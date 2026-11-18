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
