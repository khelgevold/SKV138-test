# SKV138 – project.md
Oppdatert: 2026-11-18

## Gjeldende status (les først)
**V16.23 er ferdig og uttrykkelig godkjent av brukeren etter iPhone-testing.** Oversikt, Bookinger, Kalender, Oppgaver, Lager (Utleie/Privat), Statistikk og Innstillinger er godkjent. Ingen kjente avtalte V16-UI-endringer gjenstår. Kodeversjonens siste V16.23-fiks: `2d4bd65189eb6e4d5a9e44675d83cb2412a8b24c`.

**Viktig:** Godkjent V16.23 er en nettleserbasert HTML/CSS/JS-prototype med localStorage, ikke en produksjonsklar app med delt database og innlogging. Ingen SKV138 PROD er satt opp. Ikke endre godkjent funksjonalitet uten avtale.

## Formål
Privat administrasjonsapp for hytteutleie og privat bruk i Sirdal. Skal brukes av to personer, brukeren og Melinda. Funksjoner: bookinger, kalender, økonomi, oppgaver, lager, statistikk og innstillinger.

## Kode, test og publisering
- GitHub: https://github.com/khelgevold/SKV138-test
- Eksisterende HTML-test: https://khelgevold.github.io/SKV138-test/
- Utviklingsflyt: ChatGPT gjør kode- og dokumentasjonsendringer direkte i GitHub. Netlify beholdes for publisering, med få og planlagte deploys for å spare credits. Ikke utløs Netlify-builds for dokumentasjonsoppdateringer når det kan unngås.
- Detaljert historikk og tidligere beslutninger finnes i eksisterende `PROJECT.md` og `ARBEIDSREGLER.md`. Eldre historiske «ikke godkjent»-notater er avløst av statusen over.

## Aktiv fase – database og autentisering
- Supabase Pro vurdert for dyrt. Neon valgt foreløpig, fremfor Firebase, under forutsetning av teknisk og sikkerhetsmessig verifikasjon.
- Neon Free: prosjekt `SKV138-TEST`, prosjekt-ID `lively-block-14962279`, AWS Europe Central 1 (Frankfurt). PostgreSQL og Better Auth aktivert; andre valg som Object Storage, Functions, AI Gateway og Realtime ikke aktivert ved opprettelse.
- Neon standardgren `production` er et internt grennavn, ikke appens PROD-miljø.
- Better Auth viser at hvem som helst kan registrere seg; tilgang til appdata må derfor begrenses til de to godkjente brukerne gjennom faktisk autorisasjon. Ingen Neon-brukere eller appdatatabeller er opprettet ennå. Ingen appkobling, PROD-prosjekt eller Netlify-endringer i denne fasen.
- Neste handling: Åpne Neon TEST → Better Auth → Configure Auth, inspiser skjermbilde uten å endre innstillinger. Deretter planlegges datamodell, frontend/API-sikkerhet, tilgangskontroll, backup, localStorage-migrering og TEST-verifisering før PROD.
- Ingen hemmelige databasepassord, API-nøkler eller connection strings i chat/offentlig repo.

## Planlagte senere funksjoner
- Dynamisk, personvernvennlig iCal-feed for eksisterende Homey-integrasjon. Nåværende manuelle ICS-eksport beholdes.
- Se `parkeringsplassen.md` for utsatte ideer.

## Dokumentbibliotek
- `project.md`: denne gjeldende oversikten.
- `startnestechat.md`: nyeste kopierbare overleveringsprompt.
- `utviklingsregler.md`: gjeldende generelle utviklingsregler.
- `parkeringsplassen.md`: avtalte utsatte ønsker.
- Historiske/kompatible dokumenter: `PROJECT.md`, `NY_CHAT_PROMPT.md`, `ARBEIDSREGLER.md`. Les disse for detaljer og prosjektspesifikke krav, men bruk nyeste status her.

## Oppdatering 18.11.2026 – Neon TEST SQL gjennomført
- Brukeren bekreftet vellykket kjøring av sju SQL-setninger (inkludert COMMIT). Tabellene skv138_access, skv138_data og skv138_data_history er opprettet med IF NOT EXISTS og REVOKE for offentlige/API-roller. Ingen appdata migrert, og ingen backend integrert.
- Neon Better Auth-dashboard har én opprettet bruker, men credential-kontoen har ennå ikke passord. Dette erstatter den utdaterte statusen «ingen brukere» ovenfor.
- Detaljert sikker backend-plan finnes i [neon-backend-plan.md](neon-backend-plan.md). Ingen Netlify-deploy, ingen endring i V16.23.
- Neste: verifisere managed Better Auth-sesjonskontroll, lage API, sikre begrenset databasebruker og førstegangsimport; deretter målrettet TEST.

## 18.11.2026 – Backend-kodeutkast lagret, ikke aktivert
- GitHub: `backend-draft/skv138-state.mjs` og `backend-draft/README.md` opprettet. Dette er **ikke** Netlify Functions i drift og krever avhengigheter, konfigurasjon og sikkerhetstesting før aktivering.
- Utkastet implementerer JWT/JWKS-verifisering, godkjent bruker-ID, GET/PUT for felles JSONB-dokument, transaksjonell historikk og versjonskonflikt (409).
- Viktig gjenstående: Neon Auth JWT-kompatibilitet og faktisk issuer, runtime DB-rolle og GRANT, initialisering av singleton, full state-validering, import, klientintegrasjon og TEST-deploy. Ingen data migrert, ingen innlogging klar. V16.23 uendret.

## 18.11.2026 – V16.23 datakontrakt (kodeutkast)
- Faktisk `index.html` kontrollert: `hytteokonomi-v3-test`, `skv138_private_locations`, `hytteokonomi-theme`.
- `backend-draft/state-contract.mjs` opprettet med skrivefri importforhåndsvisning. Backend-validering tilpasset.
- Ikke aktivert, testet, deployet eller importert. V16.23 urørt.

## 18.11.2026 – Klientadapter klargjort (ikke aktiv)
- `backend-draft/client-adapter.mjs` opprettet: injisert Neon Auth-klient, kortvarig token per forespørsel, GET/PUT med versjonskontroll og 409-håndtering.
- Ikke koblet til `index.html`, ikke deployet eller testet. Ingen data endret.

## 18.11.2026 – Samlet isolert Neon TEST-gren (nyeste status)
- Aktiv utviklingsgren: `feature/neon-test-integration`. `main/index.html` V16.23 er fortsatt godkjent og urørt; ingen PROD eller Netlify-deploy.
- `package.json` og GitHub Actions bygger nå isolert browser-bundle med `@neondatabase/auth`. Brukeren bekreftet grønn Actions-kjøring etter retting av pakke/import. Nyere commits med innloggings-/resettskjerm og Netlify-funksjon er ennå ikke bekreftet grønne.
- `backend-draft/test-site/index.html`: egen innloggingsside, glemt-passord-skjema, nytt-passord-skjema og backend-tilgangssperre. `backend-draft/netlify-functions/skv138-state.mjs` eksponerer API-utkastet. `backend-draft/netlify.template.toml` er bevisst inaktivt.
- Neon TEST-tabellene er opprettet; én dashboard-opprettet bruker har credential uten passord. Ingen appdata, allowlist-brukere eller runtime-DB-rolle er satt opp. Ingen hemmeligheter i GitHub.
- **Blokkere før TEST-publisering:** verifiser faktisk Neon Auth API/token/JWKS/issuer og passordtilbakestilling, få reell TEST-innlogging, opprett begrenset DB-rolle, konfigurer Netlify-miljøvariabler, gjennomfør godkjent initialisering/import og sikkerhetstest. En grønn byggtest er ikke ende-til-ende godkjenning.
- Følg `backend-draft/README.md` og `neon-backend-plan.md` for tekniske detaljer. Ikke be om allerede innsendte Neon-skjermbilder på nytt.

## 18.11.2026 – Auth-verifisering, sikkerhetsretting
- Backend krever nå `NEON_AUTH_ISSUER` eksplisitt i stedet for å anta at JWT-utsteder er Auth-domenets origin. Må verifiseres mot faktisk Neon TEST-metadata/token før deploy; `NEON_AUTH_JWKS_URL` må samsvare.
- Fortsatt ingen live innlogging eller TEST-deploy. Ingen endring i V16.23 eller PROD.
