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
    refund: 'Refusjon', taxReserve: 'Skatteavsetning til hovedkonto', taxBenefit: 'Skattebesparelse til hyttekonto', tax: 'Betalt skatt'
  };
  const categories = [
    'Forsikring', 'Strøm og nettleie', 'Vann og avløp', 'Renovasjon', 'Vedlikehold',
    'Elektriker', 'Tømrer', 'Bankgebyr', 'Regnskapsføring', 'Dokumentavgift og tinglysing', 'Annet'
  ];
  const recurringCosts = new Set(['forsikring', 'vann og avløp', 'renovasjon']);
  const tabs = [['overview', 'Oversikt'], ['entries', 'Posteringer'], ['planned', 'Planlagt'], ['loans', 'Lån']];
  const today = () => new Date().toLocaleDateString('sv-SE', {timeZone:'Europe/Oslo'});
  let currentYear = Number(today().slice(0, 4));
  let activeTab = 'overview';
  let editor = null;
  let notice = '';
  const calculatedEntries = [];
  const principalStep = 5000000;
  const lastPlanningYear = 2033;
  const lastVisibleYear = () => Math.max(lastPlanningYear, dateYear(today()));
  const amount = n => money(n === 0 ? 0 : n / 100);
  const numeric = n => n === null || n === undefined ? '' : n / 100;
  const datestamp = day => Date.parse(day + 'T00:00:00Z');
  const dateYear = date => Number(date.slice(0, 4));
  const yearStart = y => y + '-01-01';
  const yearEnd = y => yearStart(y + 1);
  const cashIn = new Set(['income', 'rent', 'borrowing', 'refund', 'taxBenefit']);
  const loanEntry = new Set(['interest', 'principal', 'borrowing']);
  const rentCostKinds = new Set(['expense', 'interest']);
  const model = () => state.meskFinance || {years:{}, loans:{}, entries:[]};
  const yearSettings = (data, y) => data.years[y] || {};
  const taxKinds = new Set(['tax', 'taxReserve', 'taxBenefit']);
  const taxFromMain = e => e.kind === 'tax' && e.taxAccount === 'main';
  const balanceChange = e => taxFromMain(e) ? 0 :
    (cashIn.has(e.kind) || (e.kind === 'transfer' && e.direction === 'in') ? 1 : -1) * e.amount;
  const sum = (items, fn) => items.reduce((total, item) => total + fn(item), 0);

  function persist(data, message) {
    state.meskFinance = data;
    const queued = save();
    editor = null;
    const pending = 'Lagrer …';
    const failure = 'Lagringen er stoppet. Last ned ulagrede data fra varselet.';
    notice = queued ? pending : failure;
    renderMesk();
    if (!queued) return;

    void skv138TestBridge.whenIdle().then(() => {
      if (notice !== pending) return;
      const status = skv138TestBridge.getStatus();
      notice = status.blocked ? failure : message;
      host.querySelector('[data-mesk-notice]').textContent = notice;
    });
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

  const isCostRefund = entry => entry.kind === 'refund' && entry.treatment === 'expense-credit';

  function resultValue(entry) {
    if (isCostRefund(entry)) return entry.amount;
    if (entry.kind === 'income' || entry.kind === 'rent' || (entry.kind === 'refund' && entry.treatment === 'income')) return entry.amount;
    if (entry.kind === 'interest' || (entry.kind === 'expense' && entry.treatment !== 'review')) return -entry.amount;
    return 0;
  }

  function taxValue(entry) {
    if (entry.treatment === 'exclude' || entry.treatment === 'review') return 0;
    return resultValue(entry);
  }

  function asRentPosting(entry) {
    return entry.kind === 'income' && /^innbetaling av åremål$/i.test(entry.note?.trim() ?? '')
      ? {...entry, kind:'rent'}
      : entry;
  }

  function yearFigures(data, y, estimatedRent = null, annualPlan = false) {
    const config = yearSettings(data, y);
    const actual = data.entries.filter(e => e.year === y && e.status === 'actual').map(asRentPosting);
    const planned = data.entries.filter(e => e.year === y && e.status === 'planned').map(asRentPosting);
    const settledInterest = config.settledInterest ?? {};
    const forecastEntries = [...actual, ...planned.filter(e => e.kind !== 'interest' || !settledInterest[e.loan])];
    const rentPaid = sum(actual.filter(e => e.kind === 'rent'), e => e.amount);
    const plannedRent = sum(planned.filter(e => e.kind === 'rent'), e => e.amount);
    const remainingRent = Math.max(0, (config.rent ?? (plannedRent || estimatedRent) ?? 0) - rentPaid - plannedRent);
    const projectedLoans = Object.fromEntries(Object.keys(loans).map(key => [key, calculateLoan(data, key, y, true)]));
    const interestByLoan = Object.fromEntries(Object.keys(loans).map(key => {
      if (settledInterest[key] || (annualPlan && key === 'heden' && planned.some(e => e.kind === 'interest' && e.loan === key))) return [key, 0];
      const loan = projectedLoans[key];
      const alreadyIncluded = sum(forecastEntries.filter(e => e.kind === 'interest' && e.loan === key), e => e.amount);
      return [key, Math.max(0, (loan?.interest ?? 0) - alreadyIncluded)];
    }));
    const remainingInterest = sum(Object.values(interestByLoan), n => n);
    const adjustment = config.taxAdjustment || 0;
    const taxRate = config.taxRate ?? 22;
    const actualResult = sum(actual, resultValue);
    const forecastResult = sum(forecastEntries, resultValue) + remainingRent - remainingInterest;
    const taxEffect = base => Math.sign(base) * Math.round(Math.abs(base) * taxRate / 100);
    const actualTaxEffect = taxEffect(sum(actual, taxValue) + adjustment);
    const actualTaxEntries = data.entries.filter(e => e.status === 'actual' && e.taxYear === y);
    const taxPaid = sum(actualTaxEntries.filter(e => e.kind === 'tax'), e => e.amount);
    const taxPaidFromMain = sum(actualTaxEntries.filter(taxFromMain), e => e.amount);
    const taxReserved = sum(actualTaxEntries.filter(e => e.kind === 'taxReserve'), e => e.amount);
    const taxBenefitReceived = sum(actualTaxEntries.filter(e => e.kind === 'taxBenefit'), e => e.amount);
    const taxPaidFromCabin = taxPaid - taxPaidFromMain;
    return {
      actual, planned, forecastEntries, settledInterest, rentPaid, plannedRent, remainingRent, actualResult, forecastResult, projectedLoans, remainingInterest, interestByLoan, taxPaid, taxReserved, taxBenefitReceived, taxPaidFromCabin, actualTaxEffect,
      forecastTax: Math.max(0, taxEffect(sum(forecastEntries, taxValue) + remainingRent - remainingInterest + adjustment)),
      actualCash: sum(actual, balanceChange),
      forecastCash: sum(forecastEntries, balanceChange) + remainingRent - remainingInterest
    };
  }

  function projectYear(data, y, opening, future, extra = 0) {
    const config = yearSettings(data, y);
    const scenario = extra ? {...data, entries:[...data.entries, {
      kind:'principal', loan:'heden', year:y, date:yearStart(y), amount:extra, status:'planned', autoPrincipal:true
    }]} : data;
    const base = yearFigures(scenario, y, null, future);
    const proposal = rentProposal(scenario, base);
    const rent = config.rent ?? (base.plannedRent || (!future || proposal.missingRates.length ? null : proposal.total));
    const figures = config.rent == null && rent !== null ? yearFigures(scenario, y, rent, true) : base;
    const plannedTax = sum(figures.planned.filter(e => e.taxYear === y &&
      (e.kind === 'taxReserve' || (e.kind === 'tax' && !taxFromMain(e)))), e => e.amount);
    const taxTarget = config.confirmedTaxEffect ?? figures.forecastTax;
    const plannedBenefit = sum(figures.planned.filter(e => e.taxYear === y && e.kind === 'taxBenefit'), e => e.amount);
    const pendingTax = taxTransferBalance(taxTarget, figures) - plannedTax + plannedBenefit;
    const taxTransfer = taxTarget < 0 ? Math.min(0, pendingTax) : Math.max(0, pendingTax);
    const hedenInterest = figures.projectedLoans.heden;
    const recordedInterest = figures.forecastEntries.filter(e => e.kind === 'interest' && e.loan === 'heden');
    const manualInterest = figures.planned.some(e => e.kind === 'interest' && e.loan === 'heden') || figures.settledInterest.heden;
    const interest = manualInterest || hedenInterest?.interest == null
      ? recordedInterest.length || figures.settledInterest.heden ? sum(recordedInterest, e => e.amount) : null
      : Math.max(hedenInterest.interest, sum(recordedInterest, e => e.amount));
    const principal = sum(figures.forecastEntries.filter(e => e.kind === 'principal' && e.loan === 'heden'), e => e.amount);
    return {scenario, figures, rent, proposal, opening, extra, principal, interest, manualInterest, taxTransfer,
      closing:opening + figures.forecastCash - taxTransfer};
  }

  function annualPlan(data, targetYear, thisYear) {
    if (targetYear < thisYear || targetYear > lastPlanningYear) return null;
    let scenario = data;
    let opening = openingBalances(data, thisYear).forecast;
    let plan;
    let completeBudget = true;
    for (let year = thisYear; year <= targetYear; year++) {
      const config = yearSettings(data, year);
      if (config.opening != null) {
        opening = config.opening;
        completeBudget = true;
      }
      const future = year > thisYear;
      plan = projectYear(scenario, year, opening, future);
      if (future) {
        const hasCosts = plan.figures.forecastEntries.some(e => e.kind === 'expense');
        completeBudget = completeBudget && hasCosts && plan.rent !== null && !plan.proposal.missingRates.length;
        const laterPrincipal = sum(data.entries.filter(e =>
          e.kind === 'principal' && e.loan === 'heden' && e.date >= yearEnd(year)), e => e.amount);
        if (completeBudget && plan.principal === 0 && plan.interest !== null &&
            scenario.loans.heden?.start <= yearStart(year)) {
          const available = Math.max(0, plan.figures.projectedLoans.heden.balance - laterPrincipal);
          for (let candidate = Math.floor(available / principalStep) * principalStep;
               candidate > 0; candidate -= principalStep) {
            const trial = projectYear(scenario, year, opening, future, candidate);
            if (trial.closing > 0) {
              plan = trial;
              break;
            }
          }
        }
      }
      scenario = plan.scenario;
      opening = plan.closing;
    }
    return {...plan, completeBudget};
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

  function metric(label, value, edit = '') {
    return '<div class="metric' + (edit ? ' mesk-editable-metric' : '') + '">' + edit +
      '<small>' + escape(label) + '</small><b>' + escape(value) + '</b></div>';
  }

  function card(title, metrics, extra = '', compact = false) {
    return '<div class="card' + (compact ? ' mesk-compact-card' : '') + '"><h3>' + escape(title) +
      '</h3><div class="grid mesk-metrics">' + metrics.join('') + '</div>' + extra + '</div>';
  }

  function editMetric(action, label) {
    return '<button type="button" class="mesk-metric-edit" data-mesk-action="' + action +
      '" aria-label="' + escape(label) + '" title="' + escape(label) + '">✎</button>';
  }

  function field(label, attrs, value) {
    return '<label>' + escape(label) + '<input ' + attrs + ' value="' + escape(value) + '"></label>';
  }

  function toggleEditor(action, label) {
    return '<button type="button" data-mesk-action="' + action + '">' + escape(label) + '</button>';
  }

  function rentProposal(data, figures) {
    const equity = data.rentBasis?.equity;
    const rate = data.rentBasis?.rate ?? 4.8;
    const entries = figures.forecastEntries;
    const includedCosts = entries.filter(e => e.includeInRent !== false);
    const operatingCosts = sum(includedCosts.filter(e => e.kind === 'expense' && e.treatment !== 'review'), e => e.amount);
    const interest = figures.remainingInterest + sum(includedCosts.filter(e => e.kind === 'interest'), e => e.amount);
    const equityReturn = equity == null ? null : Math.round(equity * rate / 100);
    const missingRates = Object.entries(figures.projectedLoans)
      .filter(([key, loan]) => !figures.settledInterest[key] && loan && loan.interest == null && !entries.some(e => e.kind === 'interest' && e.loan === key))
      .map(([key]) => loans[key]);
    return {
      operatingCosts, interest, equityReturn, missingRates,
      total: equityReturn == null ? null : equityReturn + operatingCosts + interest
    };
  }

  function rentBasisForm(basis) {
    return '<form class="card" data-mesk-form="rent-basis"><h3>Grunnlag for åremål</h3><div class="field-grid">' +
      field('Egenkapital brukt ved kjøpet (kr)', 'name="equity" type="number" min="0" step="0.01" required', numeric(basis?.equity)) +
      field('Årlig avkastningskrav (%)', 'name="rate" type="number" min="0" max="100" step="0.01" required', basis?.rate ?? 4.8) +
      '</div><div class="row"><button class="primary" type="submit">Lagre grunnlag</button>' + toggleEditor('close', 'Avbryt') + '</div></form>';
  }

  function overviewSetting(section, fields) {
    if (editor?.kind !== section) return '';
    return '<form data-mesk-form="' + section + '"><div class="field-grid">' + fields +
      '</div><div class="row mesk-entry-actions"><button class="primary" type="submit">Lagre</button>' +
      toggleEditor('close', 'Avbryt') + '</div></form>';
  }

  function resultPostingsNote(actual, year) {
    if (actual.some(entry => resultValue(entry) !== 0)) return '';
    const hint = actual.length
      ? 'Posteringene for ' + year + ' gir ingen registrert inntekt eller kostnad i resultatet. Sjekk feltet Type under Posteringer.'
      : 'Ingen faktiske posteringer for ' + year + '. Sjekk datoene under Posteringer og om postene ligger under Planlagt.';
    return '<p class="sub">' + escape(hint) + '</p>';
  }

  function taxTransferBalance(confirmed, figures) {
    const directPayment = Math.min(Math.max(0, confirmed), figures.taxPaidFromCabin);
    return confirmed - directPayment - figures.taxReserved + figures.taxBenefitReceived;
  }

  function taxSettings(config) {
    return overviewSetting('tax-settings',
      field('Skattesats (%)', 'name="taxRate" type="number" min="0" max="100" step="0.01" required', config.taxRate ?? 22) +
      field('Skattemessig justering (kr)', 'name="taxAdjustment" type="number" step="0.01"', numeric(config.taxAdjustment)) +
      field('Bekreftet skatt (+) eller brukt skattebesparelse (−), kr', 'name="confirmedTaxEffect" type="number" step="0.01"', numeric(config.confirmedTaxEffect))
    );
  }

  function oversikt(data, config, figures, plan) {
    const opening = openingBalances(data, currentYear);
    const privateIncome = privateCoverage(currentYear);
    const upcoming = currentYear > dateYear(today());
    const rent = config.rent ?? null;
    const coverageRent = rent ?? plan?.rent ?? null;
    const remaining = value => coverageRent === null ? '–' : amount(Math.max(0, coverageRent - value));
    const confirmedTax = config.confirmedTaxEffect;
    const pastTaxBalance = !plan && confirmedTax != null ? taxTransferBalance(confirmedTax, figures) : 0;
    const proposal = rentProposal(data, figures);
    const proposalNote = proposal.missingRates.length
      ? '<p class="sub">Legg inn rente eller en rentepost for ' + escape(proposal.missingRates.join(' og ')) + '.</p>'
      : '';
    return card('Hyttekonto', [
        metric(upcoming ? 'Beregnet inngående saldo' : 'Faktisk saldo', amount(upcoming ? plan.opening : opening.actual + figures.actualCash)),
        metric('Prognose ved årsslutt', amount(plan?.closing ?? opening.forecast + figures.forecastCash))
      ], config.opening == null ? '' : '<div class="row mesk-entry-actions">' +
        toggleEditor('use-carried-opening', 'Bruk saldo fra forrige år') + '</div>', true) +
      card('Beregnet åremål for ' + currentYear, [
        metric('Avkastningskrav på egenkapital', proposal.equityReturn === null ? '–' : amount(proposal.equityReturn),
          editMetric('rent-basis', 'Rediger avkastningsgrunnlag')),
        metric('Lånerenter', amount(proposal.interest)),
        metric('Driftskostnader', amount(proposal.operatingCosts)),
        metric('Forslag til åremål', proposal.total === null || proposal.missingRates.length ? '–' : amount(proposal.total))
      ], proposalNote, true) +
      (editor?.kind === 'rent-basis' ? rentBasisForm(data.rentBasis) : '') +
      card('Dekning av åremålet', [
        metric(rent === null ? 'Beregnet åremål i årsplanen' : 'Avtalt åremål', coverageRent === null ? '–' : amount(coverageRent)),
        metric('Betalt til MESK', amount(figures.rentPaid)),
        metric('Privat utleie, utbetalt etter estimert skatt', amount(privateIncome.actual)),
        metric('Privat utleie, prognose etter estimert skatt', amount(privateIncome.forecast)),
        metric('Gjenstår å tjene inn', remaining(privateIncome.actual)),
        metric('Prognose for udekket åremål', remaining(privateIncome.forecast))
      ], '', true) +
      card('Resultat og skatt for hytta · ' + currentYear, [
        metric('Registrert inntekt', amount(sum(figures.actual.filter(e => !isCostRefund(e) && resultValue(e) > 0), resultValue))),
        metric('Registrerte kostnader og renter', amount(-sum(figures.actual.filter(e => isCostRefund(e) || resultValue(e) < 0), resultValue))),
        metric('Registrert resultat før skatt', amount(figures.actualResult)),
        metric('Årsprognose før skatt', amount(figures.forecastResult)),
        metric(figures.actualTaxEffect < 0 ? 'Mulig skattebesparelse på registrerte poster' : 'Estimert skatt på registrerte poster',
          amount(Math.abs(figures.actualTaxEffect))),
        metric('Estimert skatt for året', amount(figures.forecastTax), editMetric('tax-settings', 'Rediger skatteopplysninger')),
        metric('Årsprognose etter estimert skatt', amount(figures.forecastResult - figures.forecastTax)),
        metric('Betalt skatt for året', amount(figures.taxPaid)),
        ...(confirmedTax == null ? [] : [
          metric(confirmedTax < 0 ? 'Bekreftet brukt skattebesparelse' : 'Bekreftet skatt', amount(Math.abs(confirmedTax)))
        ]),
        ...(pastTaxBalance === 0 ? [] : [
          metric(pastTaxBalance < 0 ? 'Rest til hyttekonto' : 'Rest til hovedkonto', amount(Math.abs(pastTaxBalance)))
        ])
      ], resultPostingsNote(figures.actual, currentYear) +
        (plan ? '<p class="sub">Se beregnet skatteoverføring ved årsslutt under Planlagt.</p>' : '') +
        taxSettings(config));
  }

  function recurringCost(entry) {
    const category = entry?.category?.trim().toLocaleLowerCase('nb-NO');
    return entry?.kind === 'expense' && recurringCosts.has(category) ? category : null;
  }

  function updateRecurringCosts(entries, previous, actual) {
    const category = recurringCost(previous);
    if (!category || previous.status !== 'planned' || actual.status !== 'actual' ||
        category !== recurringCost(actual) || previous.amount === actual.amount) return 0;
    let updated = 0;
    for (const entry of entries) {
      if (entry.status === 'planned' && entry.year >= actual.year &&
          recurringCost(entry) === category && entry.amount !== actual.amount) {
        entry.amount = actual.amount;
        updated++;
      }
    }
    return updated;
  }

  function rowForm(item) {
    const planned = item.status === 'planned';
    const currentKind = item.kind || (planned ? 'expense' : 'income');
    return '<form class="card" data-mesk-form="entry"><h3>' + (editor.mode === 'confirm' ? 'Registrer faktisk post' : item.id ? 'Rediger post' : 'Ny post') + '</h3>' +
      '<div class="field-grid"><label>Type<select name="kind">' +
      Object.entries(kinds).map(([key, label]) => option(key, planned && key === 'rent' ? 'Innbetaling av åremål' : label, currentKind)).join('') +
      '</select></label>' +
      field(planned ? 'Forfallsdato (valgfri)' : 'Faktisk dato', 'name="date" type="date"' + (planned ? '' : ' required'), item.date || (planned || item.generated || item.autoPrincipal ? '' : today())) +
      field('Beløp (kr)', 'name="amount" type="number" min="0.01" step="0.01" required', numeric(item.amount)) +
      field('Kategori', 'name="category" list="meskCategories" maxlength="80"', item.category) +
      '</div><datalist id="meskCategories">' + categories.map(c => option(c, c)).join('') + '</datalist>' +
      field('Avsender eller mottaker', 'name="party" maxlength="120"', item.party) +
      '<div data-mesk-field="loan"><label>Lån<select name="loan">' + option('', 'Velg lån', '') +
      Object.entries(loans).map(([key, label]) => option(key, label, item.loan)).join('') + '</select></label></div>' +
      '<div data-mesk-field="direction"><label>Retning<select name="direction">' +
      option('in', 'Inn på hyttekontoen', item.direction) + option('out', 'Ut fra hyttekontoen', item.direction) + '</select></label></div>' +
      '<div data-mesk-field="taxAccount"><label>Betalingskonto<select name="taxAccount">' +
      option('cabin', 'Hyttekonto', item.taxAccount ?? 'cabin') + option('main', 'Hovedkonto', item.taxAccount) +
      '</select></label></div>' +
      '<div data-mesk-field="taxYear">' + field('Skatten gjelder inntektsåret', 'name="taxYear" type="number" min="2000" max="2100"', item.taxYear ?? currentYear) + '</div>' +
      '<div data-mesk-field="treatment"><label>Skattegrunnlag for MESK<select name="treatment">' +
      option('normal', 'Inngår i estimert skattegrunnlag', item.treatment) +
      option('exclude', 'Utenfor skatteestimatet', item.treatment) +
      option('review', 'Til avklaring', item.treatment) +
      option('expense-credit', 'Refusjon reduserer kostnaden', item.treatment) +
      option('income', 'Refusjon inngår som inntekt', item.treatment) + '</select></label></div>' +
      '<div data-mesk-field="includeInRent"><label class="check"><input type="checkbox" name="includeInRent"' +
      (item.includeInRent !== false ? ' checked' : '') + '> Ta med kostnaden i forslaget til åremål</label></div>' +
      '<div class="field-grid">' + field('Bilagsnummer', 'name="voucher" maxlength="80"', item.voucher) +
      field('Notat', 'name="note" maxlength="300"', item.note) + '</div>' +
      (editor.mode === 'confirm' && recurringCost(item)
        ? '<p class="sub">Hvis beløpet endres, oppdateres også planlagte poster i samme kategori fra og med betalingsåret.</p>' : '') +
      '<div class="row">' +
      '<button class="primary" type="submit">Lagre post</button>' + toggleEditor('close', 'Avbryt') + '</div></form>';
  }

  function annualPlanSummary(plan) {
    if (!plan || currentYear <= dateYear(today())) return '';
    const value = n => n === null ? '–' : amount(n);
    const january = fmt(yearStart(currentYear));
    return card('Årsplan for ' + currentYear, [
      metric(january + ' · Forventet innbetaling av åremål', plan.rent === null ? '–' : amount(plan.figures.plannedRent + plan.figures.remainingRent)),
      metric(january + ' · Avdrag til Heden Holding', value(plan.principal)),
      metric(january + ' · ' + (plan.manualInterest ? 'Registrerte Heden-renter for året' : 'Beregnede Heden-renter for året'), value(plan.interest)),
      metric('Saldo ved årsslutt etter skatt', value(plan.closing))
    ], !plan.completeBudget ? '<p class="sub">Legg inn åremål, lånerenter og driftskostnader for å beregne avdragsrommet.</p>' : '');
  }

  function plannedBalances(figures, opening, year) {
    const entries = [...figures.planned];
    if (figures.remainingRent > 0) entries.push({
      generated:true, kind:'rent', date:yearStart(year), amount:figures.remainingRent, category:'Beregnet gjenstående åremål'
    });
    for (const [loan, amount] of Object.entries(figures.interestByLoan)) {
      if (amount > 0) entries.push({
        generated:true, kind:'interest', loan, date:yearStart(year), amount, category:'Beregnet gjenstående rente'
      });
    }
    const sorted = entries.sort((a, b) =>
      (a.date || yearEnd(year)).localeCompare(b.date || yearEnd(year)) ||
      Number(balanceChange(b) > 0) - Number(balanceChange(a) > 0));
    let balance = opening + figures.actualCash;
    return sorted.map(entry => {
      if (entry.kind !== 'interest' || !figures.settledInterest[entry.loan]) balance += balanceChange(entry);
      return {entry,balance};
    });
  }

  function entryMenu(entry, planned) {
    const generated = entry.generated || entry.autoPrincipal;
    const id = generated ? '' : escape(entry.id);
    if (generated && entry.amount <= 0) {
      return '<span class="mesk-menu-trigger mesk-menu-disabled" aria-hidden="true">⋯</span>';
    }
    const action = (name, label, disabled = false) =>
      '<button type="button" data-mesk-action="' + name + '" data-id="' + id + '"' +
      (disabled ? ' disabled' : '') + '>' + label + '</button>';
    const confirm = generated
      ? '<button type="button" data-mesk-action="confirm-calculated" data-id="' +
        (calculatedEntries.push(entry) - 1) + '">Registrer faktisk</button>'
      : action('confirm', 'Registrer faktisk');
    return '<details class="mesk-entry-menu"><summary class="mesk-menu-trigger" aria-label="Handlinger for ' +
      escape(entry.category || kinds[entry.kind]) + '">⋯</summary><div class="mesk-menu-options">' +
      action('edit', 'Rediger', generated) + (planned ? confirm : '') + action('remove', 'Slett', generated) +
      '</div></details>';
  }

  function actualBalances(figures, opening) {
    const entries = [...figures.actual].reverse().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    let balance = opening + figures.actualCash;
    return entries.map(entry => {
      const row = {entry,balance};
      balance -= balanceChange(entry);
      return row;
    });
  }

  function entryList(data, figures, planned, plan) {
    const opening = openingBalances(data, currentYear);
    const entries = planned
      ? plannedBalances(figures, plan?.opening ?? opening.forecast, currentYear)
      : actualBalances(figures, opening.actual);
    if (planned && plan) entries.push({
      entry:{
        generated:true, kind:plan.taxTransfer < 0 ? 'taxBenefit' : 'taxReserve',
        taxYear:currentYear, date:currentYear + '-12-31', amount:Math.abs(plan.taxTransfer),
        category:plan.taxTransfer === 0 ? 'Skatteoverføring ved årsslutt' : ''
      },
      balance:plan.closing
    });
    const draw = editor?.kind === 'entry' ? rowForm(editor.item) : '';
    const action = planned ? 'Ny planlagt post' : 'Ny postering';
    const rows = entries.map(({entry:e,balance}) => {
      const generated = e.generated || e.autoPrincipal;
      const info = [e.date ? fmt(e.date) : String(e.year), generated && 'Beregnet', e.category && kinds[e.kind], isCostRefund(e) && 'Reduserer kostnaden', e.taxYear && 'Skatteår ' + e.taxYear, taxFromMain(e) && 'Hovedkonto', planned && e.kind === 'interest' && figures.settledInterest[e.loan] && 'Årets renter er oppgjort. Posten er holdt utenfor prognosen.', e.party, e.loan && loans[e.loan], e.treatment === 'review' && 'Til avklaring', rentCostKinds.has(e.kind) && e.includeInRent === false && 'Holdt utenfor åremål', e.voucher && 'Bilag ' + e.voucher, e.note].filter(Boolean);
      return '<div class="mesk-entry"><div class="mesk-entry-head"><strong>' + escape(e.category || kinds[e.kind]) +
        '</strong><div style="text-align:right"><strong>' + amount(taxFromMain(e) ? e.amount : balanceChange(e)) + '</strong>' +
        '<div class="sub">' + (planned ? 'Estimert saldo' : 'Saldo etter postering') + ' · ' + escape(amount(balance)) +
        '</div></div>' + entryMenu(e, planned) +
        '</div><div class="sub">' + info.map(escape).join(' · ') + '</div></div>';
    }).join('') || '<p class="sub">Ingen ' + (planned ? 'planlagte poster' : 'posteringer') + ' for året.</p>';
    return '<div class="mesk-toolbar">' + toggleEditor('new', action) +
      (planned && figures.planned.some(e => !e.autoPrincipal) && currentYear < lastPlanningYear ? toggleEditor('copy', 'Kopier til neste år') : '') + '</div>' + draw +
      (planned ? annualPlanSummary(plan) : '') +
      '<div class="card mesk-entries">' + rows + '</div>';
  }

  function loanForm(data, key, config) {
    const loan = data.loans[key] || {};
    return '<form class="card" data-mesk-form="loan"><h3>' + escape(loans[key]) +
      '</h3><div class="field-grid">' +
      field('Opprinnelig lånebeløp (kr)', 'name="amount" type="number" min="0.01" step="0.01" required', numeric(loan.amount)) +
      field('Startdato', 'name="start" type="date" required', loan.start) +
      field('Rente for ' + currentYear + ' (%)', 'name="rate" type="number" min="0" max="100" step="0.01" placeholder="Bruk sist registrerte rente"', config.rates?.[key]) +
      '</div><label class="check"><input type="checkbox" name="settledInterest"' +
      (config.settledInterest?.[key] ? ' checked' : '') + '> Renter ferdig oppgjort for ' + currentYear + '</label>' +
      '<div class="row"><button class="primary" type="submit">Lagre låneopplysninger</button>' + toggleEditor('close','Avbryt') + '</div></form>';
  }

  function loanPanel(data, config, figures) {
    const draw = editor?.kind === 'loan' ? loanForm(data, editor.key, config) : '';
    const entries = Object.entries(loans).map(([key, label]) => {
      const loan = data.loans[key];
      const rate = rateFor(data,key,currentYear);
      const projected = figures.projectedLoans[key];
      const settled = figures.settledInterest[key];
      const paidInterest = sum(figures.actual.filter(e => e.kind === 'interest' && e.loan === key), e => e.amount);
      const original = calculateLoan(data, key, currentYear, true, true);
      const saving = original?.interest != null && projected?.interest != null ? Math.max(0, original.interest - projected.interest) : null;
      const edit = '<div class="row mesk-entry-actions"><button data-mesk-action="loan" data-id="' + key + '">' + (loan ? 'Rediger lån og årets rente' : 'Sett opp lån') + '</button></div>';
      return card(label, [
        metric('Opprinnelig lånebeløp', loan ? amount(loan.amount) : '–'),
        metric('Rente for ' + currentYear, rate == null ? '–' : rate.toLocaleString('nb-NO') + ' %'),
        metric('Forventet restgjeld ved årsslutt', projected ? amount(projected.balance) : '–'),
        settled
          ? metric('Oppgjorte renter for ' + currentYear, amount(paidInterest))
          : metric('Forventede renter for året', projected?.interest == null ? '–' : amount(projected.interest)),
        ...(key === 'heden' ? [
          metric('Rentebesparelse fra årets avdrag', saving === null ? '–' : amount(saving))
        ] : [])
      ], edit);
    }).join('');
    return draw + entries + '<p class="sub">Renter beregnes fra restgjelden og datoen for avdraget. Registrer låneopptak som en egen postering hvis beløpet skal inngå i hyttekontoens saldo.</p>';
  }

  function renderMesk() {
    const data = model();
    const settings = yearSettings(data, currentYear);
    const plan = annualPlan(data, currentYear, dateYear(today()));
    const figures = plan?.figures ?? yearFigures(data, currentYear);
    yearLabel.textContent = currentYear;
    host.querySelector('[data-mesk-action="previous"]').disabled = currentYear <= 2000;
    host.querySelector('[data-mesk-action="next"]').disabled = currentYear >= lastVisibleYear();
    host.querySelector('[data-mesk-tabs]').innerHTML = tabs.map(([key,label]) =>
      '<button type="button" data-mesk-action="tab" data-id="' + key + '" aria-pressed="' + (key === activeTab) + '" class="' +
      (key === activeTab ? 'selected' : '') + '">' + label + '</button>').join('');
    host.querySelector('[data-mesk-notice]').textContent = notice;
    calculatedEntries.length = 0;
    panels.innerHTML = activeTab === 'overview' ? oversikt(data, settings, figures, plan) :
      activeTab === 'loans' ? loanPanel(plan?.scenario ?? data, settings, figures) : entryList(data, figures, activeTab === 'planned', plan);
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
    const fields = {loan:loanEntry.has(kind), direction:kind==='transfer', taxYear:taxKinds.has(kind), taxAccount:kind==='tax', includeInRent:rentCostKinds.has(kind), treatment:['income','expense','refund'].includes(kind)};
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
    for (const value of ['income', 'expense-credit']) {
      treatment.querySelector('[value="' + value + '"]').hidden = kind !== 'refund';
    }
    if (kind !== 'refund' && ['income', 'expense-credit'].includes(treatment.value)) treatment.value = 'normal';
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
    const taxYear = taxKinds.has(kind) ? Number(values.get('taxYear')) : null;
    const lastYear = existing.status === 'planned' ? lastPlanningYear : lastVisibleYear();
    if (year > lastYear) {
      alert('Velg en dato senest 31.12.' + lastYear + '.');
      return null;
    }
    if (!Object.hasOwn(kinds, kind) || !Number.isSafeInteger(value) || value <= 0 ||
        year < 2000 || (taxYear !== null && (!Number.isInteger(taxYear) || taxYear < 2000 || taxYear > 2100)) || (loanEntry.has(kind) && !Object.hasOwn(loans, loan))) {
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
      includeInRent:rentCostKinds.has(kind) ? values.has('includeInRent') : undefined,
      copiedFrom:existing.copiedFrom, category:String(values.get('category')).trim(), party:String(values.get('party')).trim(),
      note:String(values.get('note')).trim(), voucher:String(values.get('voucher')).trim(),
      taxAccount:kind === 'tax' ? values.get('taxAccount') : undefined,
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
    if (kind === 'tax-settings') {
      data.years[currentYear] = {...settings, taxRate:Number(values.get('taxRate')),
        taxAdjustment:readMoney(values,'taxAdjustment') ?? 0, confirmedTaxEffect:readMoney(values,'confirmedTaxEffect')};
      persist(data,'Skatteopplysningene er lagret.');
    } else if (kind === 'rent-basis') {
      const equity = readMoney(values,'equity');
      const rate = Number(values.get('rate'));
      if (!Number.isSafeInteger(equity) || equity < 0 || !Number.isFinite(rate) || rate < 0 || rate > 100) return;
      data.rentBasis = {equity, rate};
      persist(data,'Grunnlaget for åremål er lagret.');
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
      data.years[currentYear] = {
        ...settings,
        rates:{...settings.rates,[key]:rate === '' ? null : Number(rate)},
        settledInterest:{...settings.settledInterest,[key]:values.has('settledInterest')}
      };
      persist(data,'Låneopplysningene er lagret.');
    } else if (kind === 'entry') {
      const entry = readEntry(form, data);
      if (!entry) return;
      const index = data.entries.findIndex(e => e.id === entry.id);
      const previous = data.entries[index];
      if (index === -1) data.entries.push(entry);
      else data.entries[index] = entry;
      const updated = updateRecurringCosts(data.entries, previous, entry);
      currentYear = entry.year;
      activeTab = entry.status === 'actual' ? 'entries' : 'planned';
      const message = updated === 1 ? 'Posten er lagret. Én planlagt post ble oppdatert.' :
        updated > 1 ? 'Posten er lagret. ' + updated + ' planlagte poster ble oppdatert.' : 'Posten er lagret.';
      persist(data,message);
    }
  });

  function copyPlanned(data) {
    if (currentYear >= lastPlanningYear) return;
    const candidates = data.entries.filter(e => e.status==='planned' && e.year===currentYear && !['rent','principal','tax','taxReserve','taxBenefit','borrowing','transfer','investment'].includes(asRentPosting(e).kind));
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
      case 'next': currentYear = Math.min(lastVisibleYear(), currentYear + 1); editor=null; break;
      case 'tab': activeTab=id; editor=null; break;
      case 'close': editor=null; break;
      case 'use-carried-opening':
        data.years[currentYear] = {...yearSettings(data, currentYear), opening:null};
        persist(data,'Inngående saldo beregnes fra posteringene.');
        return;
      case 'tax-settings':
        editor={kind:action};
        break;
      case 'rent-basis': editor={kind:'rent-basis'}; break;
      case 'loan': editor={kind:'loan',key:id}; break;
      case 'new':
        editEntry({status:activeTab === 'planned' ? 'planned' : 'actual',date:activeTab === 'entries' && dateYear(today()) === currentYear ? today() : ''},'new');
        return;
      case 'edit':
        if (entry) editEntry({...asRentPosting(entry)},'edit');
        return;
      case 'confirm-calculated': {
        const calculated = calculatedEntries[Number(id)];
        if (calculated) editEntry({...calculated, status:'actual', category:'',
          date:dateYear(today()) === currentYear ? today() : ''}, 'confirm');
        return;
      }
      case 'confirm':
        if (entry?.status==='planned') editEntry({...asRentPosting(entry),status:'actual',date:dateYear(today())===entry.year?today():''},'confirm');
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

  document.addEventListener('click', event => {
    const active = event.target.closest('.mesk-entry-menu');
    for (const menu of host.querySelectorAll('.mesk-entry-menu[open]')) {
      if (menu !== active) menu.open = false;
    }
  });

  host.addEventListener('keydown', event => {
    const menu = event.target.closest('.mesk-entry-menu[open]');
    if (event.key === 'Escape' && menu) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });

  const showBase = show;
  show = function (name) {
    showBase(name);
    if (name === 'meskOkonomi') renderMesk();
  };
})();
