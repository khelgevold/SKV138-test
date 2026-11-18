# SKV138 – project.md
Oppdatert: 2026-11-18


## 18.11.2026 – JWT og backend-tilgang verifisert; tom TEST-seed klargjort
- Neon TEST JWT-validering, allowlist og databaselesing er nå bekreftet i live TEST. Årsak til 401 var avsluttende `/` i Netlify `NEON_AUTH_ISSUER`; rettet og deployet. GET returnerer nå forventet 404 `Not initialized`, fordi `shared` mangler.
- Brukeren bekrefter at V16.23 bare har eksempeldata. Avtalt: ren TEST-start uten eksempelbookinger og lagervarer, men med standardinnstillinger, oppgavemaler og lagerplasseringer fra godkjent V16.23.
- `database/seed-neon-test.sql` er klargjort som idempotent `INSERT ... ON CONFLICT DO NOTHING`. **Ikke kjørt ennå.** Brukeren må kjøre i Neon TEST SQL Editor; ingen PROD-data påvirkes. Deretter én målrettet innlogging for å bekrefte 200 og backend-tilgang.
- TEST-innloggingsskallet er ennå ikke koblet til hele V16.23-grensesnittet. Neste utviklingspakke: integrere felles GET/PUT, sikre initial lasting/lagring og håndtere versjonskonflikt, så målrettet TEST-verifisering. Midlertidige JWT-diagnostikkfelter fjernes før ferdigstilling.

## GJELDENDE STATUS 18.11.2026 – Neon TEST i drift, JWT-validering gjenstår
**Denne seksjonen overstyrer eldre tidsstemplede «neste steg» og «ikke deployet»-opplysninger nedenfor.** V16.23 i `main` er fortsatt godkjent og urørt. Ingen SKV138 PROD er etablert.

- Aktiv gren: `feature/neon-test-integration`. Separat Netlify TEST: https://skv138-neon-test.netlify.app. Neon TEST: `SKV138-TEST`, ID `lively-block-14962279`, Frankfurt. Neon-databasegren `production` er IKKE SKV138 PROD.
- TEST-nettside, Auth-klient og Netlify-funksjon `/.netlify/functions/skv138-state` er publisert. Neon e-post/passord-registrering og innlogging er bekreftet fungerende. Trusted Domains er korrigert til eksakt TEST-origin uten avsluttende skråstrek. En ny TEST-bruker er opprettet og allowlist-registrert; eldre bruker uten passord er beholdt.
- PostgreSQL-tabeller `public.skv138_access`, `public.skv138_data` og `public.skv138_data_history` finnes. `skv138_data` og historikk er ennå tomme; ingen V16.23-data importert. Runtime-rollen `skv138_runtime` er opprettet med avgrensede rettigheter, og `skv138_app_test` har fått medlemskap. Eksponert opprinnelig passord for `skv138_app_test` ble tilbakestilt.
- Fire Netlify TEST-miljøvariabler er lagret: `DATABASE_URL` (hemmelig), `NEON_AUTH_JWKS_URL`, `NEON_AUTH_ISSUER`, `SKV138_APP_ORIGIN`. Ikke skriv ut verdier for hemmeligheter. JWT `iss` fra TEST-token er observert som `https://ep-twilight-sea-b979zblt.neonauth.c-7.eu-central-1.aws.neon.tech`; dette er en uverifisert dekoding for diagnostikk, ikke en autorisasjonsbeslutning.
- Netlify TEST var satt til **Private** under Project visibility. Dette ga HTTP 401 `text/plain` fra Netlify før funksjonen. Brukeren endret til **Public** for TEST; nå returnerer backend sin egen JSON-401 for innlogget forespørsel. Direkte GET uten token returnerer `{"error":"Authentication required"}`, som bekrefter funksjon og nødvendig konfigurasjon.
- **Aktiv blokker:** Neon Auth-innlogging lykkes, men backend avviser JWT med HTTP 401. `backend-draft/skv138-state.mjs` bruker `jose.jwtVerify`, eksplisitt issuer, fjern-JWKS og tillater bare `algorithms: ["EdDSA"]`. Faktisk JWT-signaturalgoritme er ennå ikke bekreftet; JWKS/issuer/signeringsnøkkel kan også være årsak. IKKE svekk signaturverifisering eller fjern tilgangskontroll.
- TEST-diagnostikk i `backend-draft/neon-test-entry.mjs` og `backend-draft/login-form.mjs` viser nå `TEST JWT alg:` etter innlogging. **Neste handling:** vent på eksisterende Netlify TEST-publisering, logg inn én gang og noter algoritmen. Sammenlign med backendens EdDSA-begrensning. Hvis lik, undersøk JWKS/issuer/token-type kontrollert. Ikke endre SQL eller Netlify-variabler på spekulasjon.
- Etter vellykket JWT-validering forventes tilgangssjekk mot `skv138_access`; dersom `skv138_data` fortsatt er tom, forventes HTTP 404 `Not initialized` / «SKV138 TEST er ikke klargjort med data ennå». Deretter planlegg sikker førstegangsinitialisering og import med uttrykkelig godkjenning, test datalagring/versjonering og sikkerhet før eventuell PROD.
- TEST-diagnostikk skal fjernes når feilen er løst. Ingen hemmelige JWT, Authorization-headere, databasepassord eller connection strings i chat eller GitHub.
- Arbeidsform: ChatGPT gjør GitHub-arbeid, brukeren bare nødvendige UI-handlinger; samle endringer og minimer Netlify-credits og unødvendige tester. Oppdater `project.md` og `startnestechat.md` ved milepæler. Omtrentlig fremdrift for **TEST innlogging/backend-tilgang**, ikke hele appen: 85 % (anslag, ikke verifisert fullføring).

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

## 18.11 – Isolert TEST-publisering: klargjøring
- Passordtilbakestilling sender nå `redirectTo` tilbake til TEST-sidens URL; test lagt til. Ingen deploy.
- Bruker har vist at Neon TEST bruker Shared e-postleverandør og at e-postinnlogging er på. Faktisk e-postlevering/passordtilbakestilling er ikke verifisert.
- Neste: velge separat Netlify TEST-site og kjent hostname, tillate domene i Neon Auth, bekrefte JWT issuer/JWKS, database-rolle og allowlist, deretter godkjent TEST-deploy. V16.23/PROD urørt.

## 18.11 – TEST Auth: registrering uten å slette eksisterende bruker
- Undersøkt Better Auth: serverbasert `setPassword` krever autentisert sesjon; passordreset-e-post er ikke mottatt. Vi sletter ikke eksisterende Neon-bruker eller endrer `neon_auth` direkte.
- Egen `Opprett TEST-bruker`-visning er nå lagt til i `backend-draft/test-site/index.html` på utviklingsgrenen. Bruker kan registrere med en annen e-postadresse som vedkommende kontrollerer og eget passord. Registrering gir ikke automatisk tilgang til SKV138-data; `skv138_access` håndheves i backend.
- Endringen er ikke bekreftet i CI eller publisert. TEST Netlify-site er separat; neste trinn: kontrollere GitHub Actions og foreta én bevisst TEST-deploy, så registrere bruker og verifisere autentisering.
