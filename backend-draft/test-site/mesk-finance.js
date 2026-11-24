/* MESK accounting overview, stored with the authenticated SKV138 state. */
(function () {
  'use strict';

  const host = document.getElementById('meskOkonomi');
  if (!host) return;
  const panels = host.querySelector('[data-mesk-content]');
  const yearLabel = host.querySelector('[data-mesk-year]');
  const loans = { private: 'Lån fra dere privat', heden: 'Lån fra Heden Holding' };
  const kinds = {
    income: 'Inntekt', rent: 'Betalt åremål', expense: 'Driftskostnad',
    interest: 'Betalte lånerenter', principal: 'Avdrag', borrowing: 'Låneopptak',
    investment: 'Kjøp og investering', transfer: 'Intern overføring',
    refund: 'Refusjon', tax: 'Betalt forskuddsskatt'
  };
  const categories = [
    'Forsikring', 'Strøm og nettleie', 'Vann og avløp', 'Renovasjon', 'Vedlikehold',
    'Elektriker', 'Tømrer', 'Bankgebyr', 'Regnskapsføring', 'Dokumentavgift og tinglysing', 'Annet'
  ];
  const tabs = [['overview', 'Oversikt'], ['entries', 'Posteringer'], ['planned', 'Planlagt'], ['loans', 'Lån']];
  const today = () => new Date().toLocaleDateString('sv-SE', {timeZone:'Europe/Oslo'});
  let currentYear = Number(today().slice(0, 4));
  let activeTab = 'overview';
  let editor = null;
  let notice = '';
  const amount = n => money(n / 100);
  const numeric = n => n === null || n === undefined ? '' : n / 100;
  const datestamp = day => Date.parse(day + 'T00:00:00Z');
  const dateYear = date => Number(date.slice(0, 4));
  const yearStart = y => y + '-01-01';
  const yearEnd = y => yearStart(y + 1);
  const cashIn = new Set(['income', 'rent', 'borrowing', 'refund']);
  const loanEntry = new Set(['interest', 'principal', 'borrowing']);
  const model = () => state.meskFinance || {years:{}, loans:{}, entries:[]};
  const yearSettings = (data, y) => data.years[y] || {};
  const balanceChange = e => (cashIn.has(e.kind) || (e.kind === 'transfer' && e.direction === 'in') ? 1 : -1) * e.amount;
  const sum = (items, fn) => items.reduce((total, item) => total + fn(item), 0);

  function persist(data, message) {
    state.meskFinance = data;
    save();
    editor = null;
    notice = message;
    renderMesk();
  }

  function escape(value) {
    return esc(String(value ?? ''));
  }

  function option(value, label, selection) {
    return '<option value="' + escape(value) + '"' + (value === selection ? ' selected' : '') + '>' + escape(label) + '</option>';
  }

  function rateFor(data, key, y) {
    for (let year = y; year >= 2000; year--) {
      const rate = yearSettings(data, year).rates?.[key];
      if (rate != null) return rate;
    }
    return null;
  }

  function calculateLoan(data, key, y, withPlanned, ignoreThisYearsPrincipal = false) {
    const loan = data.loans[key];
    if (!loan?.start || !Number.isFinite(loan.amount)) return null;
    const start = loan.start;
    const from = yearStart(y);
    const end = yearEnd(y);
    if (start >= end) return null;
    const payments = data.entries.filter(e =>
      e.kind === 'principal' && e.loan === key && e.date && e.date >= start && e.date < end &&
      (e.status === 'actual' || withPlanned) && (!ignoreThisYearsPrincipal || e.date < from)
    ).sort((a, b) => a.date.localeCompare(b.date));
    let balance = loan.amount;
    let cursor = start > from ? start : from;
    const rate = rateFor(data, key, y);
    const daysOfYear = (datestamp(end) - datestamp(from)) / 86400000;
    let interest = 0;
    for (const payment of payments) {
      if (payment.date >= from) {
        const days = (datestamp(payment.date) - datestamp(cursor)) / 86400000;
        interest += balance * (rate ?? 0) / 100 * days / daysOfYear;
        cursor = payment.date;
      }
      balance = Math.max(0, balance - payment.amount);
    }
    interest += balance * (rate ?? 0) / 100 * (datestamp(end) - datestamp(cursor)) / 86400000 / daysOfYear;
    return {balance, interest: rate === null ? null : Math.round(interest)};
  }

  function resultValue(entry) {
    if (entry.kind === 'income' || entry.kind === 'rent' || (entry.kind === 'refund' && entry.treatment === 'income')) return entry.amount;
    if (entry.kind === 'interest' || (entry.kind === 'expense' && entry.treatment !== 'review')) return -entry.amount;
    return 0;
  }

  function taxValue(entry) {
    if (entry.treatment === 'exclude' || entry.treatment === 'review') return 0;
    return resultValue(entry);
  }

  function yearFigures(data, y) {
    const config = yearSettings(data, y);
    const actual = data.entries.filter(e => e.year === y && e.status === 'actual');
    const planned = data.entries.filter(e => e.year === y && e.status === 'planned');
    const rentPaid = sum(actual.filter(e => e.kind === 'rent'), e => e.amount);
    const remainingRent = Math.max(0, (config.rent ?? 0) - rentPaid);
    const projectedLoans = Object.fromEntries(Object.keys(loans).map(key => [key, calculateLoan(data, key, y, true)]));
    const remainingInterest = sum(Object.keys(loans), key => {
      const loan = projectedLoans[key];
      const alreadyIncluded = sum([...actual, ...planned].filter(e => e.kind === 'interest' && e.loan === key), e => e.amount);
      return Math.max(0, (loan?.interest ?? 0) - alreadyIncluded);
    });
    const adjustment = config.taxAdjustment || 0;
    const taxRate = config.taxRate ?? 22;
    const actualResult = sum(actual, resultValue);
    const forecastResult = actualResult + sum(planned, resultValue) + remainingRent - remainingInterest;
    const tax = base => Math.round(Math.max(0, base) * taxRate / 100);
    const taxPaid = sum(data.entries.filter(e => e.kind === 'tax' && e.status === 'actual' && e.taxYear === y), e => e.amount);
    return {
      actual, planned, rentPaid, remainingRent, actualResult, forecastResult, projectedLoans, taxPaid,
      actualTax: tax(sum(actual, taxValue) + adjustment),
      forecastTax: tax(sum([...actual, ...planned], taxValue) + remainingRent - remainingInterest + adjustment),
      actualCash: sum(actual, balanceChange),
      forecastCash: sum([...actual, ...planned], balanceChange) + remainingRent - remainingInterest
    };
  }

  function openingBalances(data, y) {
    const years = [...Object.keys(data.years).map(Number), ...data.entries.map(e => e.year)].filter(n => n <= y);
    const first = Math.min(y, ...years);
    let actual = 0;
    let forecast = 0;
    for (let year = first; year <= y; year++) {
      const opening = yearSettings(data, year).opening;
      if (opening !== undefined && opening !== null) {
        actual = opening;
        forecast = opening;
      }
      if (year === y) break;
      const figures = yearFigures(data, year);
      actual += figures.actualCash;
      forecast += year < dateYear(today()) ? figures.actualCash : figures.forecastCash;
    }
    return {actual, forecast};
  }

  function privateCoverage(y) {
    const paid = state.bookings.filter(b => b.paid && b.paidDate && dateYear(b.paidDate) === y && b.paidAmount != null && Number.isFinite(Number(b.paidAmount)));
    const net = sum(paid, b => Number(b.paidAmount));
    const gross = net + sum(paid, b => bookingAmounts(b).fee);
    const forecast = yearIncome(y);
    return {
      actual: Math.round((net - skvAnnualTax(gross)) * 100),
      forecast: Math.round((forecast.gross - forecast.fees - skvAnnualTax(forecast.gross)) * 100)
    };
  }

  function metric(label, value) {
    return '<div class="metric"><small>' + escape(label) + '</small><b>' + escape(value) + '</b></div>';
  }

  function card(title, metrics, extra = '') {
    return '<div class="card"><h3>' + escape(title) + '</h3><div class="grid mesk-metrics">' + metrics.join('') + '</div>' + extra + '</div>';
  }

  function field(label, attrs, value) {
    return '<label>' + escape(label) + '<input ' + attrs + ' value="' + escape(value) + '"></label>';
  }

  function toggleEditor(action, label) {
    return '<button type="button" data-mesk-action="' + action + '">' + escape(label) + '</button>';
  }

  function yearForm(config) {
    return '<form class="card" data-mesk-form="year"><h3>Årsinnstillinger</h3><div class="field-grid">' +
      field('Avtalt åremål (kr)', 'name="rent" type="number" min="0" step="0.01"', numeric(config.rent)) +
      field('Åremål før årets avdrag (kr)', 'name="rentBase" type="number" min="0" step="0.01"', numeric(config.rentBase)) +
      field('Inngående saldo (kr)', 'name="opening" type="number" step="0.01" placeholder="Bruk saldo fra forrige år"', numeric(config.opening)) +
      field('Skattesats (%)', 'name="taxRate" type="number" min="0" max="100" step="0.01" required', config.taxRate ?? 22) +
      field('Skattemessig justering (kr)', 'name="taxAdjustment" type="number" step="0.01"', numeric(config.taxAdjustment)) +
      '</div><div class="row">' + '<button class="primary" type="submit">Lagre årsinnstillinger</button>' + toggleEditor('close', 'Avbryt') + '</div></form>';
  }

  function oversikt(data, config, figures) {
    const opening = openingBalances(data, currentYear);
    const privateIncome = privateCoverage(currentYear);
    const upcoming = currentYear > dateYear(today());
    const rent = config.rent ?? null;
    const remaining = value => rent === null ? '–' : amount(Math.max(0, rent - value));
    const setup = editor?.kind === 'year' ? yearForm(config) : '';
    return '<div class="mesk-toolbar">' + toggleEditor('year', 'Årsinnstillinger') + '</div>' + setup +
      card('Hyttekonto', [
        metric(upcoming ? 'Beregnet inngående saldo' : 'Faktisk saldo', amount(upcoming ? opening.forecast : opening.actual + figures.actualCash)),
        metric('Prognose ved årsslutt', amount(opening.forecast + figures.forecastCash))
      ]) +
      card('Dekning av åremålet', [
        metric('Avtalt åremål', rent === null ? '–' : amount(rent)),
        metric('Betalt til MESK', amount(figures.rentPaid)),
        metric('Privat utleie, utbetalt etter estimert skatt', amount(privateIncome.actual)),
        metric('Privat utleie, prognose etter estimert skatt', amount(privateIncome.forecast)),
        metric('Gjenstår å tjene inn', remaining(privateIncome.actual)),
        metric('Prognose for udekket åremål', remaining(privateIncome.forecast)),
        metric('Gjenstår å betale til MESK', remaining(figures.rentPaid))
      ]) +
      card('Resultat og skatt for hytta', [
        metric('Registrert inntekt', amount(sum(figures.actual.filter(e => resultValue(e) > 0), resultValue))),
        metric('Registrerte kostnader og renter', amount(-sum(figures.actual.filter(e => resultValue(e) < 0), resultValue))),
        metric('Registrert resultat før skatt', amount(figures.actualResult)),
        metric('Årsprognose før skatt', amount(figures.forecastResult)),
        metric('Estimert skatt på registrerte poster', amount(figures.actualTax)),
        metric('Estimert skatt for året', amount(figures.forecastTax)),
        metric('Årsprognose etter estimert skatt', amount(figures.forecastResult - figures.forecastTax)),
        metric('Betalt forskuddsskatt for året', amount(figures.taxPaid)),
        metric('Gjenstår å sette av', amount(Math.max(0, figures.forecastTax - figures.taxPaid)))
      ], '<p class="sub">Skatteestimatet gjelder hytteeierskapet. Før forventet skattebetaling under Planlagt for å ta den med i saldoen.</p>');
  }

  function rowForm(item) {
    const planned = item.status === 'planned';
    const currentKind = item.kind || (planned ? 'expense' : 'income');
    return '<form class="card" data-mesk-form="entry"><h3>' + (editor.mode === 'confirm' ? 'Registrer faktisk post' : item.id ? 'Rediger post' : 'Ny post') + '</h3>' +
      '<div class="field-grid"><label>Type<select name="kind">' +
      Object.entries(kinds).filter(([key]) => !planned || key !== 'rent').map(([key, label]) => option(key, label, currentKind)).join('') +
      '</select></label>' +
      field(planned ? 'Forfallsdato (valgfri)' : 'Faktisk dato', 'name="date" type="date"' + (planned ? '' : ' required'), item.date || (planned ? '' : today())) +
      field('Beløp (kr)', 'name="amount" type="number" min="0.01" step="0.01" required', numeric(item.amount)) +
      field('Kategori', 'name="category" list="meskCategories" maxlength="80"', item.category) +
      '</div><datalist id="meskCategories">' + categories.map(c => option(c, c)).join('') + '</datalist>' +
      field('Avsender eller mottaker', 'name="party" maxlength="120"', item.party) +
      '<div data-mesk-field="loan"><label>Lån<select name="loan">' + option('', 'Velg lån', '') +
      Object.entries(loans).map(([key, label]) => option(key, label, item.loan)).join('') + '</select></label></div>' +
      '<div data-mesk-field="direction"><label>Retning<select name="direction">' +
      option('in', 'Inn på hyttekontoen', item.direction) + option('out', 'Ut fra hyttekontoen', item.direction) + '</select></label></div>' +
      '<div data-mesk-field="taxYear">' + field('Skatten gjelder inntektsåret', 'name="taxYear" type="number" min="2000" max="2100"', item.taxYear ?? currentYear) + '</div>' +
      '<div data-mesk-field="treatment"><label>Skattebehandling<select name="treatment">' +
      option('normal', 'Inngår i estimert skattegrunnlag', item.treatment) +
      option('exclude', 'Utenfor skatteestimatet', item.treatment) +
      option('review', 'Til avklaring', item.treatment) +
      option('income', 'Refusjon inngår som inntekt', item.treatment) + '</select></label></div>' +
      '<div class="field-grid">' + field('Bilagsnummer', 'name="voucher" maxlength="80"', item.voucher) +
      field('Notat', 'name="note" maxlength="300"', item.note) + '</div><div class="row">' +
      '<button class="primary" type="submit">Lagre post</button>' + toggleEditor('close', 'Avbryt') + '</div></form>';
  }

  function entryList(data, figures, planned) {
    const entries = [...(planned ? figures.planned : figures.actual)].sort((a, b) =>
      (a.date || yearEnd(a.year)).localeCompare(b.date || yearEnd(b.year)) || a.kind.localeCompare(b.kind));
    const draw = editor?.kind === 'entry' ? rowForm(editor.item) : '';
    const action = planned ? 'Ny planlagt post' : 'Ny postering';
    const rows = entries.map(e => {
      const id = escape(e.id);
      const info = [e.date ? fmt(e.date) : String(e.year), e.party, e.loan && loans[e.loan], e.treatment === 'review' && 'Til avklaring', e.voucher && 'Bilag ' + e.voucher, e.note].filter(Boolean);
      return '<div class="mesk-entry"><div class="mesk-entry-head"><strong>' + escape(e.category || kinds[e.kind]) +
        '</strong><strong>' + amount(balanceChange(e)) + '</strong></div><div class="sub">' + info.map(escape).join(' · ') +
        '</div><div class="row mesk-entry-actions"><button data-mesk-action="edit" data-id="' + id + '">Rediger</button>' +
        (planned ? '<button data-mesk-action="confirm" data-id="' + id + '">Registrer faktisk</button>' : '') +
        '<button data-mesk-action="remove" data-id="' + id + '">Slett</button></div></div>';
    }).join('') || '<p class="sub">Ingen ' + (planned ? 'planlagte poster' : 'posteringer') + ' for året.</p>';
    return '<div class="mesk-toolbar">' + toggleEditor('new', action) +
      (planned && entries.length && currentYear < 2100 ? toggleEditor('copy', 'Kopier til neste år') : '') + '</div>' + draw +
      (planned ? '<p class="sub">Avtalt åremål og beregnede lånerenter ligger i prognosen. Her kan du registrere andre forventede poster.</p>' : '') +
      '<div class="card mesk-entries">' + rows + '</div>';
  }

  function loanForm(data, key, config) {
    const loan = data.loans[key] || {};
    return '<form class="card" data-mesk-form="loan"><h3>' + escape(loans[key]) +
      '</h3><div class="field-grid">' +
      field('Opprinnelig lånebeløp (kr)', 'name="amount" type="number" min="0.01" step="0.01" required', numeric(loan.amount)) +
      field('Startdato', 'name="start" type="date" required', loan.start) +
      field('Rente for ' + currentYear + ' (%)', 'name="rate" type="number" min="0" max="100" step="0.01" placeholder="Bruk sist registrerte rente"', config.rates?.[key]) +
      '</div><div class="row"><button class="primary" type="submit">Lagre låneopplysninger</button>' + toggleEditor('close','Avbryt') + '</div></form>';
  }

  function loanPanel(data, config, figures) {
    const draw = editor?.kind === 'loan' ? loanForm(data, editor.key, config) : '';
    const entries = Object.entries(loans).map(([key, label]) => {
      const loan = data.loans[key];
      const rate = rateFor(data,key,currentYear);
      const projected = figures.projectedLoans[key];
      const original = calculateLoan(data, key, currentYear, true, true);
      const saving = original?.interest != null && projected?.interest != null ? Math.max(0, original.interest - projected.interest) : null;
      const base = config.rentBase ?? config.rent;
      const suggested = saving > 0 && base != null ? Math.max(0, base - saving) : null;
      const edit = '<div class="row mesk-entry-actions"><button data-mesk-action="loan" data-id="' + key + '">' + (loan ? 'Rediger lån og årets rente' : 'Sett opp lån') + '</button>' +
        (key === 'heden' && loan ? toggleEditor('principal', 'Planlegg avdrag 1. januar') : '') +
        (key === 'heden' && suggested != null && suggested !== config.rent ? toggleEditor('accept-rent', 'Bruk som avtalt åremål') : '') + '</div>';
      return card(label, [
        metric('Opprinnelig lånebeløp', loan ? amount(loan.amount) : '–'),
        metric('Rente for ' + currentYear, rate == null ? '–' : rate.toLocaleString('nb-NO') + ' %'),
        metric('Forventet restgjeld ved årsslutt', projected ? amount(projected.balance) : '–'),
        metric('Forventede renter for året', projected?.interest == null ? '–' : amount(projected.interest)),
        ...(key === 'heden' ? [
          metric('Rentebesparelse fra årets avdrag', saving === null ? '–' : amount(saving)),
          metric('Forslag til åremål med rentebesparelsen', suggested === null ? '–' : amount(suggested))
        ] : [])
      ], edit);
    }).join('');
    return draw + entries + '<p class="sub">Renter beregnes fra restgjelden og datoen for avdraget. Registrer låneopptak som en egen postering hvis beløpet skal inngå i hyttekontoens saldo.</p>';
  }

  function renderMesk() {
    const data = model();
    const settings = yearSettings(data, currentYear);
    const figures = yearFigures(data, currentYear);
    yearLabel.textContent = currentYear;
    host.querySelector('[data-mesk-action="previous"]').disabled = currentYear <= 2000;
    host.querySelector('[data-mesk-action="next"]').disabled = currentYear >= 2100;
    host.querySelector('[data-mesk-tabs]').innerHTML = tabs.map(([key,label]) =>
      '<button type="button" data-mesk-action="tab" data-id="' + key + '" aria-pressed="' + (key === activeTab) + '" class="' +
      (key === activeTab ? 'selected' : '') + '">' + label + '</button>').join('');
    host.querySelector('[data-mesk-notice]').textContent = notice;
    panels.innerHTML = activeTab === 'overview' ? oversikt(data, settings, figures) :
      activeTab === 'loans' ? loanPanel(data, settings, figures) : entryList(data, figures, activeTab === 'planned');
    const form = panels.querySelector('[data-mesk-form="entry"]');
    if (form) {
      syncEntryFields(form);
      if (editor.initialFocus) {
        form.elements.amount.focus();
        editor.initialFocus = false;
      }
    }
  }

  function syncEntryFields(form) {
    const kind = form.elements.kind.value;
    const date = form.elements.date;
    const planned = editor.item.status === 'planned';
    const fields = {loan:loanEntry.has(kind), direction:kind==='transfer', taxYear:kind==='tax', treatment:['income','expense','refund'].includes(kind)};
    for (const [name, show] of Object.entries(fields)) {
      form.querySelector('[data-mesk-field="' + name + '"]').hidden = !show;
    }
    form.elements.loan.required = fields.loan;
    form.elements.taxYear.required = fields.taxYear;
    date.required = !planned || kind === 'principal';
    const label = date.closest('label');
    label.firstChild.textContent = planned
      ? kind === 'principal' ? 'Planlagt avdragsdato' : 'Forfallsdato (valgfri)'
      : 'Faktisk dato';
    const treatment = form.elements.treatment;
    const refund = treatment.querySelector('[value="income"]');
    refund.hidden = kind !== 'refund';
    if (kind !== 'refund' && treatment.value === 'income') treatment.value = 'normal';
  }

  function readMoney(values, name) {
    const raw = values.get(name);
    return raw === '' || raw == null ? null : Math.round(Number(raw) * 100);
  }

  function editEntry(item, mode) {
    editor = {kind:'entry', mode, item, initialFocus:true};
    renderMesk();
  }

  function readEntry(form, data) {
    const values = new FormData(form);
    const existing = editor.item;
    const kind = String(values.get('kind'));
    const date = String(values.get('date') || '');
    const value = readMoney(values,'amount');
    const year = date ? dateYear(date) : currentYear;
    const loan = loanEntry.has(kind) ? String(values.get('loan')) : '';
    const taxYear = kind === 'tax' ? Number(values.get('taxYear')) : null;
    if (!Object.hasOwn(kinds, kind) || !Number.isSafeInteger(value) || value <= 0 ||
        year < 2000 || year > 2100 || (loanEntry.has(kind) && !Object.hasOwn(loans, loan))) {
      alert('Kontroller dato, beløp og lånevalg.');
      return null;
    }
    if (kind === 'principal') {
      const configured = data.loans[loan];
      if (!configured || date < configured.start) {
        alert('Legg inn låneopplysningene før du registrerer avdrag.');
        return null;
      }
      const remaining = configured.amount - sum(data.entries.filter(e => e.kind === 'principal' && e.loan === loan && e.id !== existing.id && e.date <= date && (existing.status === 'planned' || e.status === 'actual')), e => e.amount);
      if (value > remaining) {
        alert('Avdraget overstiger restgjelden på valgt dato.');
        return null;
      }
    }
    return {
      id:existing.id || crypto.randomUUID(), kind, date, year, amount:value, loan, taxYear, status:existing.status,
      copiedFrom:existing.copiedFrom, category:String(values.get('category')).trim(), party:String(values.get('party')).trim(),
      note:String(values.get('note')).trim(), voucher:String(values.get('voucher')).trim(),
      direction:kind === 'transfer' ? values.get('direction') : '',
      treatment:['income','expense','refund'].includes(kind) ? values.get('treatment') : ''
    };
  }

  host.addEventListener('change', event => {
    if (event.target.name === 'kind') syncEntryFields(event.target.form);
  });

  host.addEventListener('submit', event => {
    const form = event.target;
    const kind = form.dataset.meskForm;
    if (!kind) return;
    event.preventDefault();
    const data = model();
    const values = new FormData(form);
    const settings = yearSettings(data, currentYear);
    if (kind === 'year') {
      data.years[currentYear] = {...settings, rent:readMoney(values,'rent'), rentBase:readMoney(values,'rentBase'), opening:readMoney(values,'opening'),
        taxRate:Number(values.get('taxRate')), taxAdjustment:readMoney(values,'taxAdjustment') ?? 0};
      persist(data,'Årsinnstillingene er lagret.');
    } else if (kind === 'loan') {
      const key = editor.key;
      const rate = values.get('rate');
      const amount = readMoney(values,'amount');
      const start = String(values.get('start'));
      const paid = sum(data.entries.filter(e => e.kind === 'principal' && e.loan === key && e.status === 'actual'), e => e.amount);
      if (!Number.isSafeInteger(amount) || amount <= 0 || amount < paid || data.entries.some(e => e.kind === 'principal' && e.loan === key && e.date < start)) {
        alert('Kontroller beløp og startdato mot registrerte avdrag.');
        return;
      }
      data.loans[key] = {amount, start};
      data.years[currentYear] = {...settings, rates:{...settings.rates,[key]:rate === '' ? null : Number(rate)}};
      persist(data,'Låneopplysningene er lagret.');
    } else if (kind === 'entry') {
      const entry = readEntry(form, data);
      if (!entry) return;
      const index = data.entries.findIndex(e => e.id === entry.id);
      if (index === -1) data.entries.push(entry);
      else data.entries[index] = entry;
      currentYear = entry.year;
      activeTab = entry.status === 'actual' ? 'entries' : 'planned';
      persist(data,'Posten er lagret.');
    }
  });

  function copyPlanned(data) {
    const candidates = data.entries.filter(e => e.status==='planned' && e.year===currentYear && !['principal','tax','borrowing','transfer','investment'].includes(e.kind));
    const next = currentYear + 1;
    const rows = candidates.filter(e => !data.entries.some(other => other.year===next && (other.copiedFrom===e.id ||
      (other.kind===e.kind && other.category===e.category && other.party===e.party && other.note===e.note && other.loan===e.loan))));
    if (!rows.length) {
      notice = 'Ingen nye planlagte poster å kopiere.';
      renderMesk();
      return;
    }
    for (const e of rows) data.entries.push({...e, id:crypto.randomUUID(), year:next, date:'', copiedFrom:e.id});
    currentYear = next;
    persist(data, rows.length + ' planlagte poster kopiert.');
  }

  host.addEventListener('click', event => {
    const button = event.target.closest('[data-mesk-action]');
    if (!button || button.disabled) return;
    const {meskAction:action,id} = button.dataset;
    const data = model();
    const entry = data.entries.find(e => e.id === id);
    notice = '';
    switch(action) {
      case 'previous': currentYear--; editor=null; break;
      case 'next': currentYear++; editor=null; break;
      case 'tab': activeTab=id; editor=null; break;
      case 'close': editor=null; break;
      case 'year': editor={kind:'year'}; break;
      case 'loan': editor={kind:'loan',key:id}; break;
      case 'new':
        editEntry({status:activeTab === 'planned' ? 'planned' : 'actual',date:activeTab === 'entries' && dateYear(today()) === currentYear ? today() : ''},'new');
        return;
      case 'accept-rent': {
        const config = yearSettings(data,currentYear);
        const baseline = config.rentBase ?? config.rent;
        const original = calculateLoan(data,'heden',currentYear,true,true);
        const projected = calculateLoan(data,'heden',currentYear,true);
        if (baseline == null || original?.interest == null || projected?.interest == null) return;
        data.years[currentYear] = {...config, rentBase:baseline, rent:Math.max(0, baseline - Math.max(0, original.interest - projected.interest))};
        persist(data,'Avtalt åremål er oppdatert.');
        return;
      }
      case 'principal':
        activeTab='planned';
        editEntry({status:'planned',kind:'principal',loan:'heden',date:yearStart(currentYear)},'new');
        return;
      case 'edit':
        if (entry) editEntry({...entry},'edit');
        return;
      case 'confirm':
        if (entry?.status==='planned') editEntry({...entry,status:'actual',date:dateYear(today())===entry.year?today():''},'confirm');
        return;
      case 'remove':
        if (entry && confirm('Slette denne posten fra MESK Økonomi?')) {
          data.entries=data.entries.filter(e => e.id!==entry.id);
          persist(data,'Posten ble slettet.');
        }
        return;
      case 'copy': copyPlanned(data); return;
      default: return;
    }
    renderMesk();
  });

  const showBase = show;
  show = function (name) {
    showBase(name);
    if (name === 'meskOkonomi') renderMesk();
  };
})();
