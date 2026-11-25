## Status 25.11.2026 – Handlingsmeny for MESK-poster

På `prep/skv138-mesk-entry-menu` ligger Rediger, Registrer faktisk og Slett i en meny ved beløp og saldo. Beregnede linjer, inkludert skatteoverføring, kan registreres med faktisk dato og beløp. Rediger og Slett er deaktivert på beregnede linjer. Ved lagring opprettes en faktisk post og prognosen regner på nytt. Testet fra meny til opprettet og avregnet åremål. Klargjort for neste publisering.

## Status 25.11.2026 – MESK-planhorisont til og med 2033

Årsvelger, årsprognose, kopiering av planlagte poster og lånesimulering stopper ved utgangen av 2033. Aktuelt kalenderår blir tilgjengelig for faktiske posteringer når det kommer. Grensen er testet for årsplan og lånesimulering. Klargjort på `prep/skv138-mesk-cost-refund`.

## Status 25.11.2026 – Løpende saldo i MESK Planlagt

Planlagte og beregnede poster viser estimert saldo etter hver linje. Beløpet etter skatteoverføringen ved årsslutt vises nederst. Planlagt åremål har egen posttype; eksisterende inntektsposter med notatet «Innbetaling av åremål» regnes som åremål, slik at en registrert innbetaling avregnes mot automatisk åremålsinntekt. Testet med flere poster samme dato, beregnede renter og skatteavstemming. Klargjort for neste publisering.

## Status 25.11.2026 – Automatisk årsplan i MESK

Planlagt viser åremål, avdrag og Heden-renter med 1. januar som beregningsdato for fremtidige år. Avtalt åremål, eksisterende avdrag og manuelt planlagte Heden-renter brukes når de finnes. Forslaget er største ekstraavdrag i trinn på 50 000 kr som gir positiv saldo etter årets driftskostnader, renter og skatt. Innlagte fremtidige avdrag respekteres. Utgående saldo føres videre som neste års inngående saldo med mindre egen inngående saldo er satt. Ufullstendig årsbudsjett gir ingen automatisk avdragsanbefaling. Nederst på Planlagt vises beregnet skatteoverføring per 31. desember, justert etter posteringer og planlagte overføringer. En bekreftet skattebesparelse kan gi motsatt retning. Beregnede linjer er prognoser og lagres ikke som posteringer. Testet med sammenhengende år, manuelt avdrag, endret kostnad og delvis skatteoverføring. Klargjort på `prep/skv138-mesk-cost-refund`.

## Status 25.11.2026 – Kreditnota som kostnadsreduksjon i MESK

På `prep/skv138-mesk-cost-refund` kan en refusjon registreres med valget «Refusjon reduserer kostnaden». Beløpet vises som innbetaling på hyttekontoen, reduserer registrerte kostnader og inngår i resultat og skatteestimat. Eksisterende refusjoner beholder sin valgte behandling. Kontrollert med kreditnota på driftskostnad og separat refusjon fra kjøpsoppgjør. Klargjort for neste publisering.

## Status 25.11.2026 – MESK-renter og skatteoverføring publisert i PROD

Commit `e9657e2` er publisert på `skv138.helgevold.no`. Produksjonsdomenet leverer den verifiserte MESK-modulen med nyeste postering først, tydeligere årsresultat, oppgjorte renter per lån og årsoversikt for skatteoverføring i begge retninger. Beregningene og sorteringen er testet med eksempeldata. Innlogget funksjonstest av de nye valgene gjenstår. Ingen SQL-migrering.

## Status 25.11.2026 – Årsoversikt for skatteoverføring

På `prep/skv138-mesk-posting-results` viser Skatteoverføring beregnet skatt eller mulig skattebesparelse fra registrerte poster. Brukeren registrerer faktisk bekreftet skatt som positivt beløp eller faktisk brukt skattebesparelse som negativt beløp per skatteår. Kortet viser restbeløpet og retningen etter registrerte skatteoverføringer og eventuell skatt betalt direkte fra hyttekontoen. Ny posttype «Skattebesparelse til hyttekonto» dekker innbetaling fra hovedkonto. Oppgjøret knyttes til skatteåret, mens saldo følger bokføringsdato. Testet med underskudd, overskudd, deloppgjør og betaling året etter. Klargjort for neste publisering.

## Status 25.11.2026 – Nyeste MESK-postering øverst

På `prep/skv138-mesk-posting-results` sorteres faktiske posteringer med nyeste dato øverst. På samme dato vises sist registrerte post først. Planlagte poster vises fortsatt etter forfall, med udaterte poster sist. Sorteringen er testet og klargjort for neste publisering.

## Status 25.11.2026 – Skatteavsetning til hovedkonto

På `prep/skv138-mesk-posting-results` kan overføring fra hyttekonto til hovedkonto registreres med eget skatteår, som faktisk eller planlagt post. Betalt skatt kan registreres med hyttekonto eller hovedkonto som betalingskonto. Betaling fra hovedkonto påvirker betalt skatt for inntektsåret, mens hyttekontoens kontantstrøm fanger opp overføringen. Resultatet før skatt og skatteestimatet bygger på de samme inntektene og kostnadene som før. Eldre skattebetalinger behandles som trekk på hyttekontoen. Verifisert med fiktive poster og betaling i etterfølgende kalenderår. Klargjort for neste publisering.

## Status 25.11.2026 – Oppgjorte renter per lån og år

På `prep/skv138-mesk-posting-results` kan årets renter markeres som ferdig oppgjort separat for privatlånet og Heden Holding. Saldo-, resultat- og skatteprognose samt åremålsforslag bruker da registrerte renter for lånet i det året. Eventuelle planlagte renteposter beholdes og merkes som holdt utenfor prognosen. Innstillingen påvirker bare valgt lån og år. Testet med avviket på 154 kr og scenarier for begge lån og påfølgende år. Klargjort for neste publisering.

## Status 25.11.2026 – MESK-resultat per år

Brukeren meldte at registrerte inntekter og kostnader viser null selv om postene er registrert. År, datoer og posttyper i PROD er ikke bekreftet. På `prep/skv138-mesk-posting-results` viser resultatkortet valgt år og en forklaring når årets faktiske poster gir null registrert inntekt og kostnad. Postlisten viser posttypen også når en egen kategori er satt. Kontrollert med fiktive data for tre år og ulike posttyper. Beregningen og lagrede data er uendret. Endringen er klargjort for en senere publisering.

## Status 25.11.2026 – MESK-rettelser og eget PROD-domene

Commit `7677d78` er publisert. `skv138.helgevold.no` leverer nytt MESK-skjema og viser «lagret» etter bekreftelse fra serveren. Skjemaet skiller skattegrunnlag fra valget om å ta med kostnaden i åremålsforslaget. Brukeren satte `SKV138_APP_ORIGIN` til `https://skv138.helgevold.no` før deploy. Produksjonsbygget er verifisert med Auth på dette domenet. Det forrige `Origin denied`-avviket ble omgått ved å registrere posteringene via Netlify-adressen, og brukeren bekreftet at de vises på begge adresser. Innlogget lagring og kontroll etter ny innlasting på eget domene gjenstår etter denne deployen. Ingen SQL-migrering.

## Status 25.11.2026 – MESK-oppdatering publisert i PROD

Commit `fb46109` samler beregnet åremål, flerårig simulering av ekstra avdrag til Heden i trinn på 50 000 kr og avhuking for hva som inngår i åremålet. Produksjonsdomenet `skv138.helgevold.no` leverer versjonen fra committen. Appens HTML laster modulen. Testet med fiktive data før publisering. Innlogget funksjonstest i PROD gjenstår. Ingen databasemigrering.

## Status 25.11.2026 – Valg av kostnader i åremålet

På klargjøringsgrenen `prep/skv138-mesk-annual-rent` har faktiske og planlagte drifts- og renteposter valget «Inngår i beregning av åremål». Valget er på som standard, også for eldre poster. Det endrer bare beregnet åremål. Under Lån kan simulerte rentevirkninger tas med i åremålet eller holdes utenfor mens restgjeld og rentebesparelse fortsatt vises. Beregningstestene er bestått. Publisering og innlogget funksjonstest gjenstår.

## Status 25.11.2026 – Simulering av ekstra avdrag til Heden

Under MESK Økonomi → Lån kan brukeren simulere ekstra avdrag i inntil ti år. Årsrammen rundes ned til trinn på 50 000 kr innenfor restgjelden og med plass til allerede registrerte eller planlagte avdrag. Simuleringen tar utgangspunkt i 1. januar og viser avdrag, restgjeld, renter, rentebesparelse mot registrert plan og beregnet åremål per år. Simuleringen lagrer ingen posteringer eller endringer i avtalt åremål. Rente ved registrert avdrag beregnes etter registrert betalingsdato. Beregningene er testet med fiktive data. Klargjort på `prep/skv138-mesk-annual-rent`, publisering og innlogget funksjonstest gjenstår.

## Status 25.11.2026 – Beregnet åremål for MESK

På klargjøringsgrenen `prep/skv138-mesk-annual-rent` beregnes forslag til åremål fra egenkapital brukt ved kjøpet × årlig avkastningskrav (standard 4,8 %), pluss renter og driftskostnader for valgt år. Brukeren registrerer egenkapitalen i appen. Avdrag inngår i kontantstrøm og reduserer renteberegningen fra betalingsdatoen. Åremålet som er avtalt, oppdateres ved eget valg. Beregningen er testet lokalt. Publisering og innlogget funksjonstest gjenstår.

## Status 24.11.2026 – MESK Økonomi i SKV138

Brukeren godkjente implementering og publisering i PROD. Under Mer ligger MESK Økonomi med årsvisning for hyttekonto, resultat og estimert skatt, dekning av åremål, faktiske og planlagte poster, og to redigerbare lån. Planlagte poster kan bekreftes med faktisk dato og beløp. Faste planer kan kopieres til neste år. Heden-lånet har snarvei for avdrag 1. januar og forslag til justert åremål basert på rentebesparelse. Forslaget må bekreftes av brukeren. Første oppsett skjer i appen: faktiske tall og låneopplysninger er ikke forhåndslastet. Funksjonen lagres som et eget felt i eksisterende Neon-payload; ingen SQL-migrering. Lokal test av UI, lagring, prognose, skatt og avdrag besto med fiktive data. Kontroll med faktiske tall i den innloggede PROD-appen gjenstår.

## Status 24.11.2026 – Samlet PROD-release for innstillinger og statistikk

Commit `5e63f32` utløste publisering. PROD-domenet leverte samme HTML som besto lokal DOM-kontroll. Kontroll på fysisk iPhone gjenstår.

Releasen samler tre knapper på én linje i Lager, fjerner den gamle Varsler-siden og Testdata-panelet, og ordner Innstillinger i avtalt rekkefølge med mer luft rundt Pushvarsler og Plasseringer. Kalenderintegrasjon har kortere tittel. Statistikk viser prosentfordeling og en dynamisk Total-visning med skatt per år. Sjekklistemaler støtter Hund, og oppgaveregler samt planlagt push støtter Alle inkl. privat. Velkomstmeldingen kan kopieres med eller uten salgstekst fra ett av sju konfigurerbare scenarioer. Avhukingene for utvask fungerer igjen. Kalkulatoren viser leietakergebyr i gjestens total, mens bookinggebyr bare bruker utleiergebyr. Eksakt FINN-sats og salgstekster konfigureres i innstillingene. Ingen SQL-migrering. Lokal DOM-kontroll og målrettede beregningstester besto. Test navigasjon og layout på iPhone, valg av salgsmal på en booking, og at leietakergebyr kun legges på gjestens pris i kalkulatoren.

## Status 24.11.2026 – Automatisk push bekreftet i PROD

Brukeren bekreftet at automatisk push planlagt kl. 20.40 kom kl. 20.45 med iPhone-appen helt lukket. PROD-deploy `417e986` aktiverte automatisk utsending. Netlify-funksjonen er konfigurert til å kjøre på hvert hele kvarter (`*/15 * * * *`). Både manuelt og automatisk pushvarsel er funksjonelt bekreftet i PROD. iPhone kunne åpne PROD-feeden og forhåndsvise 24 hendelser. En Booking.com-hendelse viste innsjekk kl. 16.00 og utsjekk kl. 12.00 i norsk sommertid. Homey-import og oppdatering gjenstår, med eksisterende kalender som reserve. Overgangen til ett produksjonsmiljø vurderes etter en stabil driftsperiode.

## Status 24.11.2026 – Manuell push bekreftet i PROD

Brukeren bekreftet mottak av manuelt pushvarsel på iPhone etter oppdatering av abonnementet. PROD-deploy `d95d2f1` tok i bruk det nye VAPID-nøkkelparet. Automatisk utsending står fortsatt av. Neste steg er aktivering og én automatisk PROD-test med helt lukket app. Homey gjenstår.

## Status 24.11.2026 – Oppfølgingsrelease publisert i PROD

Commit `a8a0111` er publisert ifølge brukeren og bekreftet levert på PROD-domenet. Bekreftede kommende inntekter utelater nå bookinger etter utsjekk. Før publisering korrigerte brukeren eier-ID-en i Netlify til én ID uten JSON-innpakning. Sjekk i PROD at inntektskortet viser forventet beløp, at Pushvarsler vises på iPhone og at manuelt testvarsel mottas. Automatisk utsending står av inntil manuelt pushvarsel er verifisert. Homey testes separat i PROD.

## Status 24.11.2026 – Samlet release publisert i PROD

PROD-kandidaten ligger på `prep/skv138-prod-2026-11-24` med utgangspunkt i publisert PROD-gren `release/skv138-prod` ved `3173833`. Den overfører godkjente TEST-endringer for bookinger, gebyrer, økonomikort, oppgaver, handleliste, iCal og push. Eksisterende PROD-byggekommando, Netlify-konfigurasjon, Neon Auth-proxy, PWA-manifest og ikon er beholdt. Ingen TEST-data overføres. Netlify bekreftet Published kl. 19.30 for `dfb1247`, deploy `6b05d7de7eec04d1c419b4fa`. Live på `skv138.helgevold.no`: ny app og service worker svarte 200, og push-endepunkt uten innlogging svarte 401 som forventet. Innlogging, eksisterende bookinger, manuelt pushvarsel på iPhone og Homey gjenstår å bekrefte som innlogget bruker. Brukeren bekreftet at den additive pushmigreringen i Neon PROD ble kjørt med suksess.

TEST er funksjonelt brukergodkjent, inklusive Bookingdato og automatisk push med 0 og 1 times ledetid med lukket iPhone-app. PROD-autentiseringspakken er bygget lokalt med en fiktiv Neon Auth-adresse. Build sjekket generert redirect og at TEST-adressen ikke er med. Syntakskontroll og fem push-planleggingstester besto, og de tre nye Netlify-funksjonsmodulene kunne lastes lokalt. Dette verifiserer ikke faktiske Netlify-innstillinger, Neon-tilgang eller mottak i PROD.

Før publisering:
1. Fullført: `backend-draft/push-migration-prod.sql` er kjørt i SKV138 PROD ifølge brukeren. Migreringen oppretter to pushtabeller og gir den dokumenterte runtime-rollen `skv138_app` de nødvendige rettighetene. Brukeren har lagt inn eierens PROD-ID som `SKV138_PUSH_OWNER_USER_ID` og satt `SKV138_PUSH_SENDING_ENABLED=false` i Netlify PROD.
2. Fullført ifølge brukeren: PROD-verdier for VAPID og iCal er lagt inn i Netlify, og database-URL, privat VAPID-nøkkel og iCal-token er merket som hemmelige. `SKV138_PUSH_SENDING_ENABLED=false` inntil manuelt PROD-varsel er verifisert. Kalenderadressen gis kun til den autoriserte eierkontoen, og funksjonen krever gyldig token.
3. Klarsignal gitt og release publisert. Ved behov kan forrige PROD-deploy gjenpubliseres fra Netlify. Etter publisering kontrolleres eksisterende bookingdata, iPhone-innlogging, push på PROD-domenet og iCal i Homey. Eksisterende Homey-kalender beholdes som reserve under testen.

# Start neste chat – SKV138 etter produksjonssetting

Vi fortsetter SKV138 etter produksjonssettingen.

GitHub: `khelgevold/SKV138-test`
TEST-gren: `feature/neon-test-integration`
PROD-gren: `release/skv138-prod`
TEST: https://skv138-neon-test.netlify.app
PROD: https://skv138-prod.netlify.app

Les `project.md`, `startnestechat.md`, `utviklingsregler.md`, `parkeringsplassen.md` og hele `innlogging-og-pwa.md` på `release/skv138-prod` først. Nyeste status står øverst. Les relevant kode på TEST-grenen før endringer.

PROD er publisert med separat Neon-database og Better Auth. Ingen TEST-data er overført. Innlogging på PC, Chrome på iPhone og installert iPhone-webapp er bekreftet. Første ekte booking og innlogget sesjon besto F5. Jeg tester videre i vanlig bruk.

Punkter før videre live-erfaring:
1. Nye bookinger skal foreslå to netter. Brukeren skal kunne endre til én natt, og datoene skal lagres riktig.
2. Sett opp egen PROD-konto for Melinda med e-post og passord hun selv velger. Bruk appens registrering og gi tilgang via `skv138_access`. Kontroller godkjent fremgangsmåte i innloggingsdokumentet.
3. Legg inn headerbilder øverst i appen og på nettsiden. Avklar bilder og plassering før endringen.
4. Legg inn et SKV138-ikon for den installerte iPhone-webappen, og kontroller ikonet på hjemskjermen.
5. Legg til «Logg ut». Sjekk at F5 ikke gjenoppretter den avsluttede økten, og at ny innlogging fungerer.
6. Endre Chrome-fanens tittel fra dagens TEST-tittel til «SKV138».

Start med å spørre om jeg har funn fra live-bruken som skal inn i listen. Lag så en kort milepælsplan med omtrentlig fremdrift. Bruk TEST for kodeendringer, behold fungerende Neon Auth og same-origin-proxy, og samle avtalte endringer før Netlify-deploy. Ta Melindas PROD-tilgang som et eget steg etter avtale. Gjør GitHub-arbeidet selv og be om én nødvendig brukerhandling om gangen. Ingen endring i `main` eller PROD-publisering uten godkjenning.

---

# Gjeldende overlevering – 19.11.2026

SKV138 PROD er publisert og brukeren har avsluttet produksjonsrunden. Brukeren følger opp i vanlig bruk. Les prosjektets dokumenter på release/skv138-prod for PROD-status og innloggingserfaringer. Siste deploy med oppryddede tekster viste Published, innloggingsteksten ble ikke visuelt kontrollert på grunn av automatisk innlogging. Når brukeren ønsker en Logg ut-knapp, start i TEST på feature/neon-test-integration og verifiser før eventuell godkjent PROD-publisering.

---

# PROD-status – 19.11.2026

PROD er publisert på https://skv138-prod.netlify.app fra `release/skv138-prod`. Separat Neon-prosjekt i Frankfurt, tom oppstart med standardoppsett, ingen TEST-data. Netlify bruker den begrensede databaserollen `skv138_app`. Neon localhost er av og PROD-origin er registrert som trusted domain. Netlify Visitor access står på Private / Previews only. Med Private / Production and previews fikk det autentiserte funksjonskallet 401 i ren tekst. Etter endringen svarte appens backend med JSON.

Den faktiske PROD-tokenutstederen er Neon Auth-origin uten /neondb/auth. `NEON_AUTH_ISSUER` bruker origin alene, mens `SKV138_NEON_AUTH_UPSTREAM` bruker hele Auth URL. Første bruker ble registrert fra appen med e-post og passord, fikk forventet avslag før innføring i `skv138_access` og fikk deretter tilgang.

Brukeren bekreftet innlogging på PC, i Chrome på iPhone og i installert iPhone-PWA. Safari-kontroll utgår fordi brukeren benytter Chrome. Første ekte booking og sesjon overlevde F5. Neon viser seks timers gjenopprettingshistorikk, ingen snapshots eller planlagte sikkerhetskopier. Ved behov forhåndsvis data fra ønsket tidspunkt før eventuell godkjent gjenoppretting. Ved en kodefeil kan forrige fungerende Netlify-deploy republiseres etter godkjenning.

Synlige TEST-tekster og «Lokal testprototype» er ryddet i releasegrenen. Endringen avventer én eksplisitt godkjent deploy og visuell kontroll. `main` og TEST-grenen er urørt.

---

# PROD-releasekandidat – 19.11.2026

Kandidaten ligger i `release/skv138-prod` fra godkjent TEST-gren. `netlify.toml` velger PROD-bygget. Sett `SKV138_APP_ORIGIN` til eksakt PROD-origin for både bygg og funksjoner, og `SKV138_NEON_AUTH_UPSTREAM` til den offentlige Neon PROD Auth-URL-en for bygget. Bygget genererer same-origin Auth-URL og full /neondb/auth/*-rewrite. Database- og JWT-variabler settes for funksjoner. Ingen PROD-ressurser er opprettet. Neste godkjenningspunkt er separat Neon PROD med tomme appdata og egen Auth. Publisering krever egen godkjenning.

---

# START NESTE CHAT – SKV138 PROD-FORBEREDELSE – 19.11.2026

Vi fortsetter SKV138. GitHub: `khelgevold/SKV138-test`; arbeidsgren: `feature/neon-test-integration`. TEST: https://skv138-neon-test.netlify.app. `main` inneholder godkjent V16.23 og skal ikke endres uten eksplisitt godkjenning. Eget PROD-miljø finnes ennå ikke.

**Første handling:** Les direkte fra GitHub `project.md`, `startnestechat.md`, `utviklingsregler.md`, `parkeringsplassen.md` og **`innlogging-og-pwa.md`**. Nyeste status øverst i dokumentene gjelder. Særlig viktig: Les hele `innlogging-og-pwa.md` før du planlegger eller endrer auth/PWA.

**Godkjent status:** Alle seks QA-funn F01–F06 og tre avsluttende funksjonstester er brukerbekreftet godkjent 19.11.2026. PC og installert iPhone PWA logger inn, sesjon overlever F5, booking og kansellering lagres og økonomitall stemmer; iPhone-statuslinjen er mørk. Ikke gjenta TEST-QA uten grunn. Same-origin Neon Auth-proxy var nøkkelen til å få installert iPhone PWA til å fungere. Behold JWT-verifisering og server-allowlist.

**Ny beslutning:** **PROD skal starte med tom database. Ingen TEST-data migreres.** Eget PROD-miljø må planlegges og godkjennes. Opprettelse av PROD, database, Auth og deploy krever brukerens eksplisitte samtykke. `main` V16.23 er urørt.

**Oppgave:** Presenter en kort, milepælsbasert plan for PROD med separat Neon database/Auth, korrekt app-origin og same-origin auth-proxy, miljøvariabler, bruker-/tilgangsoppsett, nødvendig skjema/seed uten TEST-data, backup/rollback, begrenset PROD-røykprøve på PC og installert iPhone PWA, samt rydding av TEST-diagnostikk. Les relevant kode og avklar reelle nødvendige valg før endringer. Vurder om TEST-branch skal være releasegrunnlag uten å overskrive `main` for tidlig. Ikke gjør unødvendige kontroller eller Netlify-builds. ChatGPT utfører GitHub-arbeid selv og ber om én nødvendig brukerhandling av gangen. Hold `project.md` og `startnestechat.md` oppdatert.

Utsatt: pushvarsler og dynamisk iCal. Ingen manuell ICS-eksport er avtalt.

---

# AKTIV OVERLEVERING – 19.11.2026 – SKV138 TEST FUNKSJONELT GODKJENT

Vi fortsetter SKV138. GitHub `khelgevold/SKV138-test`, aktiv gren `feature/neon-test-integration`; TEST https://skv138-neon-test.netlify.app. Les først `project.md`, `startnestechat.md`, `utviklingsregler.md` og `parkeringsplassen.md` direkte fra GitHub. **Nyeste status øverst gjelder; eldre tekst er historikk.**

Brukeren har godkjent **alle F01–F06** og **alle 3 avsluttende funksjonstester**: booking overlever F5, utlogging/innlogging beholder data, kansellering overlever F5 og gir korrekte økonomitall. Installert iPhone PWA og mørk statuslinje er godkjent. Neon Auth same-origin proxy er publisert. Godkjent V16.23 i `main` er urørt; eget PROD-miljø finnes ikke. Funksjonell TEST er godkjent, men ikke PROD.

En foreløpig statisk sikkerhetsgjennomgang av `backend-draft/skv138-state.mjs`, `client-adapter.mjs` og `test-site/_redirects` viser JWT-verifisering, server-allowlist, payload-validering, origin-kontroll og versjonskonfliktvern. Dette er **ikke** full sikkerhetsrevisjon. TEST-diagnostikk og gamle kodekommentarer må vurderes før PROD.

**Neste oppgave:** Presenter kort PROD-forberedelsesplan, undersøk bare nødvendig faktisk kode og konfigurasjon, avklar om testdata skal migreres eller PROD starte tomt, og avtal separat PROD-miljø, secrets, tilgang, backup og reverseringsplan. Ingen PROD-opprettelse eller deploy uten eksplisitt godkjenning. Ikke repeter godkjente funksjonstester. Utfør alt mulig GitHub-arbeid selv og be om én nødvendig brukerhandling om gangen. Pushvarsler og dynamisk iCal er utsatt. Ingen manuell ICS-eksport i planen.

---

# AKTIV OVERLEVERING – 19.11.2026 – SKV138 QA og feilretting

Les `project.md`, `utviklingsregler.md`, `parkeringsplassen.md` og denne filen direkte fra GitHub. Aktiv gren `feature/neon-test-integration` i `khelgevold/SKV138-test`. TEST: https://skv138-neon-test.netlify.app. Netlify TEST Stopped builds bekreftet. Eget PROD-miljø finnes ikke; `main` V16.23 urørt.

Første QA-runde: 25 godkjente tester/kontroller, fem feil F01–F05. Se øverste `project.md` for presise feil, kodeendringer og utestede forhold. F01 visning/fane delvis rettet, F04/F05 kodeendret i `2724130`; F02 PWA-tokenfeil og F03 409 ved kansellering har ukjent rotårsak. GitHub Actions var grønn etter `1592b48`, men status etter `2724130` er ikke bekreftet. Ingen ny TEST-publisering av disse rettingene. Ikke påstå at feilene er godkjent.

Neste: verifiser siste GitHub Actions, avtal én kontrollert TEST-deploy, test F01/F04/F05 og samle nødvendig diagnostikk for F02/F03. Én brukerhandling om gangen, ikke omgå serverauth eller versjonskontroll. Behold Netlify stoppet mellom kontroller. Ingen unødvendig retesting. Ingen manuell ICS-eksport. Ikke rør main.

---

# START NESTE CHAT – 19.11.2026 – systematisk TEST av SKV138

Vi fortsetter utviklingen av **SKV138**.

**GitHub:** `khelgevold/SKV138-test`
**Gren:** `feature/neon-test-integration`
**TEST:** https://skv138-neon-test.netlify.app
**PROD:** Godkjent V16.23 i `main` – skal ikke endres.

**Første handling:** Les `project.md`, `startnestechat.md`, `utviklingsregler.md` og `parkeringsplassen.md` direkte fra GitHub. Nyeste status øverst overstyrer eldre historikk. Les bare relevant faktisk kode hvis nødvendig for å lage en presis testplan.

**Bekreftet status 19.11:** Neon TEST-innlogging på PC fungerer etter retting av JWT-tokenhenting (`/token`-fallback), og hytteappen åpnes. Jeg har opprettet en TEST-booking og bekreftet at den **fortsatt finnes etter F5/refresh**. Dette er en godkjent deltest av Neon-persistens. Vi har **ikke** bekreftet at sesjonen beholdes etter refresh, eller at innlogging fungerer i installert iPhone PWA. PC-/mobil-layout og resten av den samlede endringspakken er ikke ferdig funksjonstestet. Netlify TEST ble tidligere stoppet for å unngå credits; ikke anta at siste stopp er bekreftet etter siste deploy.

**Oppgaven i denne chatten:** Start med å presentere en **komplett, prioritert og nummerert testliste i fornuftig rekkefølge** for hele den nåværende TEST-versjonen. Bruk de 11 avtalte endringspunktene i `project.md`, samt kritiske auth-/lagringsflyter, layout, booking/kansellering, privatopphold og oppgaver, økonomi/skatt, plattformgebyrer, innstillinger og relevante tilgangskontroller. Merk hva som allerede er godkjent og hva som gjenstår; ikke gjenta bekreftet bookingpersistenstest. Gi korte forventede resultater og hvilken enhet (PC, mobil Safari, installert PWA) hver test krever. Identifiser eventuelle blokkere og grupper testene slik at vi unngår unødvendig arbeid.

**Etter at testlisten er presentert:** Gjennomfør testene **én nødvendig brukerhandling av gangen**. Noter resultatene i `project.md` ved naturlige milepæler, og samle feil til en rettingspakke. Ikke start med kodeendringer, nye deploys, databaseuttrekk eller unødvendige kontroller. Følg `utviklingsregler.md`: ChatGPT gjør alt mulig GitHub-arbeid selv; begrens Netlify-builds; gi kort fremdriftsplan og omtrentlig prosent ved milepæler. Ingen PROD-endring uten eksplisitt godkjenning.

**Utsatt:** Pushvarsler (prioritet 1) og dynamisk iCal (prioritet 2) først etter at øvrig TEST er godkjent. PROD-migrering diskuteres separat.

---

# STATUS – 19.11.2026 – private oppgaver og Neon-kodegjennomgang

Commit `505ddda` beholder fullførte historiske private oppgaver, men ikke ufullførte oppgaver fra avsluttede privatopphold. `v1623-state-bridge.mjs` er gjennomgått statisk: server-state valideres før visning, endringer kølegges. Persistens ved refresh og iPhone PWA-auth er **ikke** funksjonstestet. Netlify TEST er satt til Stopped builds på grunn av 30–40 jobber/time; IKKE be bruker aktivere før samlet kandidat er klar. Neste: gjennomgå lagringskø og iframe-kobling, deretter kontrollert TEST-publisering med brukerens godkjenning. Se `project.md` og `utviklingsregler.md`.

---
# STATUS – 19.11.2026 – neste milepæl

Kodegjennomgang viser at `TEST_DIAG_TOKEN_EXCEPTION` kommer fra `authClient.token()` før backend-GET. Underliggende årsak på installert iPhone-webapp må undersøkes i faktisk PWA-miljø; ingen auth-omgåelse. Commit `29e5858` sikrer kanselleringsskjema ved manglende handlingsrad. Øvrig samlepakke ligger i `feature/neon-test-integration`, ikke funksjonstestet eller publisert. Se øverste `project.md` for komplett omfang og siste commits. Neste milepæl er samlet TEST-publisering etter avklaring, så én målrettet brukerhandling om gangen for iPhone/refresh og sentrale dataflyter. Ikke rør main/PROD. Push og iCal er utsatt.

---

# STATUS – 19.11.2026 – fortsatt TEST-utvikling

Siste commits: `80934c9` retter fullføringskontroll for private sjekkliste-oppgaver; `b0d5dc4` fjerner uverifisert JWT-dekoding fra login-UI. iPhone PWA `TEST_DIAG_TOKEN_EXCEPTION` er **fortsatt åpen**; klientens øvrige TEST-diagnostikk må først fjernes når feilen er diagnostisert og verifisert løst. Les topp i `project.md` og `utviklingsregler.md`. Ikke publiser eller endre PROD uten godkjenning. Prioriter samlet TEST-verifisering av auth/refresh, lagring, private oppgaver, kansellering og skatt. Push/iCal fortsatt utsatt.

---

# AKTIV STATUS – 19.11.2026 – samlet TEST-pakke under arbeid

Brukeren har godkjent begge listene i `project.md`. Arbeid på `feature/neon-test-integration` i `khelgevold/SKV138-test`. Nyeste kodearbeid: `de69d47` serialiserer gjenopprettet sesjon/manuell innlogging for å unngå dobbel state-bridge; `104bae4` beholder historiske private oppgaver og krever utfylte oppgjørsbeløp. Tidligere commits for bookingkort, innstillinger, skatt, gebyrer, kansellering og private oppgaveregler er dokumentert i `project.md`. **Ikke funksjonstestet eller godkjent**, og iOS PWA-tokenfeilen er fortsatt uavklart. Før PROD: målrettet verifikasjon av iPhone installert app, refresh, lagring, kansellering, økonomi og private oppgaver. Ikke utelat diagnostikk-opprydding. Push og iCal først etter godkjent TEST. Ikke endre main/PROD eller publiser uten særskilt godkjenning. Les også `utviklingsregler.md` og `parkeringsplassen.md`.

---

# START HER – 19.11.2026 – samlet versjonspakke påbegynt

Brukeren godkjente **samtlige punkter i begge listene** og ba ChatGPT starte utviklingen. Les øverste seksjon i `project.md` for komplett omfang (11 punkter) før arbeid, samt `utviklingsregler.md`, `parkeringsplassen.md` og faktisk kode. Jobb i `khelgevold/SKV138-test`, `feature/neon-test-integration`; `main` V16.23 og PROD urørt. Ikke utelat noen av de tidligere avtalte oversikt-/booking-/oppgaveforbedringene. iPhone PWA-innlogging og refresh-sesjon er to åpne blokkere. Brukeren vil ha samlet TEST-kandidat med minst mulig deploys, og én nødvendig handling om gangen. Push/iCal utsettes til godkjent øvrig TEST. Dokumenter konkret fremdrift, ikke påstå at en samlet pakke er ferdig før alle punktene er gjennomført og verifisert.

---

# START HER – SKV138, oppdatert 18.11.2026 kl. 21:20

## Kritiske innloggingsfeil – 19.11.2026 (må løses før PROD)
**To separate bekreftede brukeropplevelser i Neon TEST:**
1. **Nettleser:** Brukeren blir logget ut ved hver sideoppdatering/refresh. Forventning: aktiv innloggingssesjon skal beholdes etter refresh.
2. **iPhone installert webapp/PWA:** Innlogging feiler, mens vanlig Safari på samme telefon fungerer. Tidligere observert `TEST_DIAG_TOKEN_EXCEPTION`, også etter manuelt passord.

**Begge er blokkerende feil for PROD**, ikke ordinære forbedringsønsker. Undersøk målrettet når øvrige testfunn samles til neste rettingspakke; ikke anta at de har samme årsak. Unngå unødvendige tester og deploys. Pushvarsler (prioritet 1) og iCal (prioritet 2) skal vente til øvrig TEST er visuelt og funksjonelt godkjent.


## Ny prioritering – 19.11.2026
Brukeren vil først ferdigstille alle andre visuelle og funksjonelle forhold i Neon TEST og samle forbedringslisten for felles diskusjon. **Pushvarsler prioritet 1, iCal prioritet 2**, men ingen av dem skal påbegynnes før øvrig TEST er godkjent. Brukeren vurderer migrering av data til fremtidig PROD; dette er teknisk mulig, men migreringsomfang og valg mot ren oppstart avklares senere. Ikke kopier testdata ukritisk. Se øverste status i project.md. Ingen kode, DB-endring eller deploy nå.


Vi fortsetter SKV138 i GitHub `khelgevold/SKV138-test`, aktiv gren `feature/neon-test-integration`. Les først **øverste status i `project.md`**, deretter `utviklingsregler.md`, `parkeringsplassen.md` og relevant kode. Nyeste status overstyrer eldre historikk i dokumentene. ChatGPT gjør GitHub-arbeid selv, minimerer unødvendige Netlify-deploys og ber om kun én nødvendig brukerhandling av gangen.

**Nåværende status:** Neon TEST på https://skv138-neon-test.netlify.app fungerer i Safari på iPhone og PC. Innlogging, Neon GET/PUT og privat booking fungerer. Utleiebooking fungerte ikke pga. rekursiv `saveBooking`/hoisting, rettet i `backend-draft/test-site/app.html` commit `39709cc`; brukeren bekreftet at vanlig utleiebooking nå kan lagres. Netlify `SKV138_APP_ORIGIN` er korrigert (fjernet avsluttende skråstrek). PC-bunnmeny er gjort fast i TEST-koden. Godkjent V16.23 i `main` er urørt; ingen PROD.

**Brukeren tester nå hele appen** (booking, utbetaling, kansellering, oppgaver/sjekklister, lager, statistikk og innstillinger). Ikke avbryt med unødvendige tester. Hvis et problem hindrer videre testing, undersøk og rett målrettet. Ellers samle funn til en samlet kodepakke. Sjekk ved anledning at lagret utleiebooking finnes etter refresh (ikke eksplisitt bekreftet). **Åpen feil:** iPhone installert webapp/PWA får `TEST_DIAG_TOKEN_EXCEPTION` ved innlogging, mens Safari fungerer; må utredes før PROD. Midlertidig auth-diagnostikk skal fjernes før produksjon.

**Arbeidsregler:** Ingen endringer i `main`, Neon-data eller PROD uten avtale. Unngå ekstra CI-tester og Netlify-publiseringer uten behov. Oppdater `project.md` og `startnestechat.md` ved milepæler; `parkeringsplassen.md` kun for avtalte utsatte ønsker. Ikke forveksle gammel historikk under denne toppseksjonen med gjeldende status.

---

# START HER – ny chat SKV138 (18.11.2026 kl. 20:15)

Vi fortsetter SKV138 i GitHub `khelgevold/SKV138-test`, gren `feature/neon-test-integration`. Les gjeldende toppseksjon i `project.md`, `utviklingsregler.md`, `parkeringsplassen.md`, og relevant faktisk kode i `backend-draft/`. **Nyeste status overstyrer eldre historiske tekster lenger ned i dokumentene.** ChatGPT gjør alt mulig GitHub-arbeid selv; brukeren skal kun gjøre nødvendige UI-tester. Ikke gjør mer enn nødvendig; minimer Netlify-deploys og repetisjon.

**Faktisk status:** Neon TEST på https://skv138-neon-test.netlify.app er live. Neon Auth + backend allowlist + initialisert `shared`-tilstand er bekreftet. Brukeren har vist skjermbilde hvor hele V16-hytteappen vises etter innlogging, uten eksempelbookinger. GitHub Actions for nyeste commit `6e45109` er grønne. V16.23 i `main/index.html` er urørt; ingen PROD. TEST-appen er i `backend-draft/test-site/app.html`, innloggingsskallet i `backend-draft/test-site/index.html`; Neon-broen og serialisert lagring er i `backend-draft/v1623-state-bridge.mjs` og `legacy-save-queue.mjs`. SQL-seed er allerede kjørt. **Neon PUT/persistens er IKKE manuelt testet.**

**Første handling i ny chat:** Be brukeren, etter PC-omstart, opprette én testbooking i TEST, oppdatere siden og bekrefte at bookingen fortsatt finnes. Dette er eneste nødvendige test nå. Ikke start med ny kode eller gjentatte kontroller. Hvis lagring feiler, undersøk konkret feil før retting. Hvis den fungerer, avklar konkret PC-layout-avvik og deretter mobilvisning. Brukeren sier layouten ser feil ut; tidligere assistent konstaterte at PC-navigasjonens plassering følger eksisterende V16 CSS og ikke nødvendigvis er Neon-feil. Ikke redesign på spekulasjon. Teksten «V16 · Lokal testprototype» er fortsatt synlig. Ikke endre `main` uten avtale. Senere kan midlertidig JWT-diagnostikk ryddes i samlet release.

Brukeren ba om dokumentasjon og ny chat fordi PC skal restartes. Svar kort, uten å gjenta status i hver melding. Les `project.md` og `utviklingsregler.md` før arbeid.

---

## 18.11.2026 – Bekreftet etter TEST-seed
- Brukeren kjørte initialiserings-SQL og viste skjermbilde med «Tilgang bekreftet». Hele innloggings-, tilgangs- og database-GET-kjeden er bekreftet i live TEST. Ingen grunn til å gjenta auth-feilsøking.
- **Neste arbeid:** implementer V16.23-integrasjon med eksisterende `createSkv138Client`, GET før visning og sikker PUT/409-håndtering i `feature/neon-test-integration`. Undersøk eksisterende `index.html` `save()`/localStorage-mønster før endring; behold `main` uendret. Samle kodeendringer og tester før én planlagt TEST-deploy. Fjern midlertidig JWT-diagnostikk når integrasjonen er ferdig.

# Start neste chat – SKV138
Oppdatert: 2026-11-18


## 18.11.2026 – NYESTE STATUS: backend verifisert, seed klar
- **Overstyrer eldre 401-blokker:** JWT, allowlist og databaseforbindelse fungerer i live Neon/Netlify TEST. Feilen var en ekstra `/` på slutten av `NEON_AUTH_ISSUER` i Netlify; rettet. Forventet melding er nå «SKV138 TEST er ikke klargjort med data ennå» (HTTP 404 fordi `shared` mangler).
- V16.23 inneholder kun eksempeldata. Brukeren godkjente ren oppstart uten eksempelbookinger/-varer, med standardinnstillinger, oppgavemaler og lagerplasseringer.
- **Neste handling:** Be brukeren kjøre kopierbar `database/seed-neon-test.sql` i Neon **TEST** SQL Editor (idempotent, skriver kun dersom `shared` ikke finnes). SQL er lagret i GitHub, men **ikke kjørt**. Deretter bekreft at innlogging går til «Tilgang bekreftet».
- Fortsett deretter GitHub-arbeid i `feature/neon-test-integration` for å koble godkjent V16.23 UI til felles GET/PUT, uten å endre `main`. Begrens deploys, behold sikker autorisasjon og fjern midlertidig diagnostikk før ferdigstilling.

## GJELDENDE OVERLEVERING 18.11.2026 – LES DENNE FØRST
**Denne seksjonen overstyrer alle eldre «neste steg» og opplysninger om manglende TEST-deploy nedenfor.** Hent oppdatert `project.md`, `utviklingsregler.md`, `neon-backend-plan.md` og relevante backend-filer fra GitHub før nye endringer.

Vi jobber i `khelgevold/SKV138-test`, **kun** `feature/neon-test-integration`. Godkjent V16.23 i `main` er urørt; ingen SKV138 PROD finnes. Separat TEST-side: https://skv138-neon-test.netlify.app. Neon TEST ID `lively-block-14962279`; Neons interne `production`-gren er ikke app-PROD.

Ferdig: Neon Auth registrering og innlogging med e-post/passord; TEST-bruker allowlistet i `public.skv138_access`; SQL-tabeller `skv138_access`, `skv138_data`, `skv138_data_history`; runtime DB-rolle `skv138_runtime` med avgrensede grants og tilordnet `skv138_app_test`; hemmelig passord tilbakestilt; fire TEST Netlify env-vars (`DATABASE_URL`, `NEON_AUTH_JWKS_URL`, `NEON_AUTH_ISSUER`, `SKV138_APP_ORIGIN`); TEST Netlify-funksjon publisert. Ingen appdata er importert. TEST-nettstedet måtte settes til **Public** i Netlify Project visibility for at Netlify skulle slutte å svare med sin egen 401 `text/plain`; appens egen innlogging/autorisasjon er fortsatt påkrevd.

**Nåværende blokker:** Etter vellykket Neon-innlogging får klienten backend HTTP 401 JSON (JWT avvises). Backend i `backend-draft/skv138-state.mjs` verifiserer signatur via JWKS, eksakt issuer og **kun EdDSA**. Uverifisert JWT-issuer diagnostisert som `https://ep-twilight-sea-b979zblt.neonauth.c-7.eu-central-1.aws.neon.tech`. Siste kodeendring viser JWT-headerens ufarlige `alg` som `TEST JWT alg:` på innloggingsskjermen. **Vent på Netlify TEST-deploy og be brukeren oppgi kun algoritmen etter én innlogging.** Hvis algoritmen avviker, undersøk korrekt Neon-støttet signaturverifisering; hvis lik, kontroller JWKS/issuer/token-type uten å svekke sikkerhet. Ikke be om token, Authorization-header, passord eller connection string.

Når JWT er løst: verifiser allowlist/database; forvent `404 Not initialized` fordi `skv138_data` er tom; planlegg trygg initialisering/import og TEST-verifikasjon. Fjern midlertidig TEST-diagnostikk etterpå. Ikke anta at databaseforbindelsen er testet – 401 oppstår før DB-tilkobling.

Arbeidsregler: gjør alle mulige GitHub-endringer selv, unngå gjentatt manuell testing og Netlify-deploys, én brukerhandling av gangen, kort milepælplan/prosent, kopierbar SQL ved behov, dokumenter ved milepæler. Ingen PROD/main-endringer uten godkjenning. Oppdatert anslag: ca. 85 % for delmålet TEST-innlogging/backend-tilgang, ikke hele SKV138.

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

## 18.11 – neste handling
- `redirectTo` for passordreset er koblet til isolert TEST-side; tilhørende test lagt til, ikke deployet. Neon TEST har Shared email provider. Avklar eksisterende/separat Netlify TEST-site og URL før deploy, og bekreft Auth trusted domain, eksakt JWT issuer/JWKS, runtime DB role, allowlist. Ingen PROD/V16.23-endringer. Ikke be om nye skjermbilder av tidligere viste Neon Auth-innstillinger.

## 18.11 – TEST Auth: registrering uten å slette eksisterende bruker
- Undersøkt Better Auth: serverbasert `setPassword` krever autentisert sesjon; passordreset-e-post er ikke mottatt. Vi sletter ikke eksisterende Neon-bruker eller endrer `neon_auth` direkte.
- Egen `Opprett TEST-bruker`-visning er nå lagt til i `backend-draft/test-site/index.html` på utviklingsgrenen. Bruker kan registrere med en annen e-postadresse som vedkommende kontrollerer og eget passord. Registrering gir ikke automatisk tilgang til SKV138-data; `skv138_access` håndheves i backend.
- Endringen er ikke bekreftet i CI eller publisert. TEST Netlify-site er separat; neste trinn: kontrollere GitHub Actions og foreta én bevisst TEST-deploy, så registrere bruker og verifisere autentisering.
