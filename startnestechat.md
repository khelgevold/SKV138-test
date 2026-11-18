# Start neste chat – SKV138
Oppdatert: 2026-11-18

Kopier teksten under inn i ny ChatGPT-chat:

Vi fortsetter SKV138 i GitHub-repo `khelgevold/SKV138-test`. Hent og les `utviklingsregler.md`, `project.md`, `parkeringsplassen.md` og denne `startnestechat.md` direkte fra GitHub. Ved behov les også historiske `PROJECT.md`, `ARBEIDSREGLER.md` og `NY_CHAT_PROMPT.md`. Bruk nyeste status fremfor eldre loggnotater.

V16.23 er godkjent av brukeren på iPhone for alle faner (Oversikt, Bookinger, Kalender, Oppgaver, Lager Utleie/Privat, Statistikk og Innstillinger). Ingen kjente avtalte V16-UI-feil gjenstår. Dette er fortsatt en localStorage-basert prototype, ikke en sikker flerbrukerproduksjonsapp. Ikke endre godkjent funksjonalitet uten avtale.

Vi beholder ChatGPT → GitHub → Netlify og samler endringer for å spare Netlify-credits. Supabase Pro er vurdert for dyrt. Neon er valgt foreløpig som databaseplattform. Neon gratisprosjekt `SKV138-TEST` i Frankfurt er opprettet, prosjekt-ID `lively-block-14962279`. PostgreSQL og Better Auth er aktivert. Standardgren heter `production`, men er bare Neons standard grennavn og IKKE SKV138 PROD. Ingen brukere, appdatatabeller, appintegrasjon eller PROD-miljø er opprettet.

Neon Better Auth advarer om at alle på nettet kan registrere seg. Appen skal kun brukes av to godkjente personer (brukeren og Melinda). Sikker autorisasjon er et absolutt krav. Ingen hemmelige tilkoblingsstrenger i chat eller offentlig kode.

Neste konkrete steg: Be brukeren åpne `Better Auth → Configure Auth` i Neon TEST og sende skjermbilde. Kontroller innstillingene før endringer. Deretter planlegg datamodell, trygg nettlesertilgang, datamigrering og backup. Jobb selvstendig innenfor avtalte rammer, presenter kort plan og milepæler/prosent, og be bare om nødvendige brukerhandlinger. Ikke endre appkode eller publiser uten avtale.

## Oppdatert overlevering 18.11.2026 (overstyrer eldre status over)
- Neon TEST SQL-migrering med tre skv138-tabeller er kjørt vellykket av brukeren; ingen appdata migrert. Én Better Auth-bruker er opprettet i dashboard uten passord. Ikke be om å gjenta dette.
- Les [neon-backend-plan.md](neon-backend-plan.md) for API- og sikkerhetsplan.
- Neste: avklar faktisk Neon Better Auth-token/sesjonsverifisering og trygg passordflyt, bygg deretter API med eksplisitt tilgangsliste og atomisk versjonering. Ikke endre V16.23 eller deploy uten godkjenning. Følg utviklingsregler.md.

## 18.11.2026 – Backend-utkast i GitHub
- `backend-draft/skv138-state.mjs` og `backend-draft/README.md` er lagret, men ikke aktivert eller deployet. Les README for blokkere og sikkerhetspunkter. Ikke beskriv dette som ferdig API.
- Neste: verifiser Neon JWT-tokenflyt og issuer, opprett begrenset runtime-rolle/GRANT, bygg frontend-innlogging og migreringsflyt; samlet TEST-deploy først etter avklaring. V16.23 urørt.

## 18.11.2026 – Siste milepæl
- Les `backend-draft/state-contract.mjs`: V16.23 datakontrakt og skrivefri importforhåndsvisning er kodet, men ikke testet/aktivert.
- Neste: TEST-verifisering av Neon Auth, begrenset DB-login, trygg initialisering/import med godkjenning og frontend-integrasjon. Ingen deploy; V16.23 urørt.

## Siste kodearbeid
- `backend-draft/client-adapter.mjs` opprettet som inaktiv klientmodul. Neste: verifiser faktisk Neon Auth-token, fullfør innloggings-UI, opprett begrenset DB-login og trygg initialisering/import før TEST-deploy.

## 18.11.2026 – Gjeldende overlevering (overstyrer eldre «neste steg»)
- Arbeid i `feature/neon-test-integration`, ikke `main`. V16.23 i `main/index.html` er godkjent og skal ikke endres uten eksplisitt avtale. Ingen Netlify/PROD-deploy.
- Neon TEST SQL-tabeller er opprettet; én bruker opprettet i Neon-dashboard har credential uten passord. Ikke be om Configure Auth-skjermbilder igjen. Ingen allowlist-rader, runtime DB-rolle eller importert appdata.
- Les `backend-draft/README.md`, `backend-draft/test-site/index.html`, `backend-draft/neon-test-entry.mjs`, `backend-draft/skv138-state.mjs`, `backend-draft/netlify.template.toml` og `package.json`. En isolert TEST-side har innlogging, passordresettskjema og backend-tilgangskontroll. En draft Netlify-funksjon finnes, men ingen deploy.
- GitHub Actions var grønn etter rettet Neon Auth-pakke/import. Nyere endringer må kontrolleres. Verifiser live Neon Auth-metoder (inkl. token, reset og issuer/JWKS), sett opp minsteprivilegert DB-rolle, og klargjør samlet TEST-deploy med eksplisitt godkjenning. Ikke kall løsningen ferdig før faktisk autentisering og autorisasjon er testet.
- Gjør mest mulig samlet i GitHub, minimer manuelle steg, og oppdater dokumentasjon. Ingen hemmelige nøkler i kode eller chat.

## Sikkerhetsretting 18.11.2026
- `backend-draft/skv138-state.mjs` krever nå eksplisitt `NEON_AUTH_ISSUER` (ikke antatt hostname-origin). Bekreft eksakt verdi fra Neon Auth før TEST-deploy, sammen med JWKS og tokenmetode. Ikke svekk JWT-verifiseringen. Ingen live-test eller deploy utført.
