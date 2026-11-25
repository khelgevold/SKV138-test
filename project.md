## Status 25.11.2026 – Flytt MESKs årsvalg til relevante kort

Samlet Årsinnstillinger er erstattet av avgrensede valg. Hyttekonto har Juster inngående saldo. Dekning av åremålet har Rediger avtalt åremål og bruker beregnet årsplan når eget beløp mangler. Skatteoverføring har Rediger skatteopplysninger for sats, justering og bekreftet skatt eller skattebesparelse. Hvert skjema oppdaterer bare sine egne felt og beholder tidligere verdier i øvrige grupper. Testet med separate lagringer og automatisk åremål. Klargjort på `prep/skv138-mesk-entry-menu`.

## Status 25.11.2026 – Fjern avdragssnarveien fra lånekortet

«Planlegg avdrag 1. januar» er fjernet fra Heden-kortet. Automatisk avdragsforslag vises i årsplanen. Lånekortet viser fortsatt forventet restgjeld ved årsslutt. Testet med automatiske avdrag i to sammenhengende år. Klargjort på `prep/skv138-mesk-entry-menu`.

## Status 25.11.2026 – Fjern manuell Heden-simulator

Den manuelle simulatoren «Simuler ekstra avdrag til Heden» er fjernet fra Lån. Automatisk avdragsforslag beregnes fortsatt fra betalingsevnen i Planlagt. Testet med et årsbudsjett som gir rom for ekstra avdrag. Klargjort på `prep/skv138-mesk-entry-menu`.

## Status 25.11.2026 – Oppdater planlagte faste kostnader ved registrering

Når en planlagt driftskostnad i kategorien Forsikring, Vann og avløp eller Renovasjon registreres som faktisk med et annet beløp, får allerede planlagte poster i samme kategori fra og med betalingsåret det nye beløpet. Kategorien må være den samme på faktisk post. Lagrede faktiske poster og tidligere års planer beholdes. Antall terminer, datoer og øvrige opplysninger beholdes. Testet for alle tre kategorier, samme beløp og endret kategori. Klargjort på `prep/skv138-mesk-entry-menu`.

## Status 25.11.2026 – Skatteoverføring som siste planlagte post

Beregnet skatteoverføring per 31. desember vises som siste linje i Planlagt med beløp, retning og estimert saldo. Når beløpet er større enn null, kan det registreres som faktisk via trepunktsmenyen. Restbeløpet beregnes etter lagring. Testet fra beregnet linje til faktisk post og avregning. Klargjort på `prep/skv138-mesk-entry-menu`.

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

Releasen samler tre knapper på én linje i Lager, fjerner den gamle Varsler-siden og Testdata-panelet, og ordner Innstillinger i avtalt rekkefølge med mer luft rundt Pushvarsler og Plasseringer. Kalenderintegrasjon har kortere tittel. Statistikk viser prosentfordeling og en dynamisk Total-visning med skatt per år. Sjekklistemaler støtter Hund, og oppgaveregler samt planlagt push støtter Alle inkl. privat. Velkomstmeldingen kan kopieres med eller uten salgstekst fra ett av sju konfigurerbare scenarioer. Avhukingene for utvask fungerer igjen. Kalkulatoren viser leietakergebyr i gjestens total, mens bookinggebyr bare bruker utleiergebyr. Eksakt FINN-sats og salgstekster konfigureres i innstillingene. Ingen SQL-migrering. Lokal DOM-kontroll og målrettede beregningstester besto. Kontroll på iPhone gjenstår.

## Status 24.11.2026 – Automatisk push bekreftet i PROD

Brukeren bekreftet at automatisk push planlagt kl. 20.40 kom kl. 20.45 med iPhone-appen helt lukket. PROD-deploy `417e986` aktiverte automatisk utsending. Netlify-funksjonen er konfigurert til å kjøre på hvert hele kvarter (`*/15 * * * *`). Både manuelt og automatisk pushvarsel er funksjonelt bekreftet i PROD. iPhone kunne åpne PROD-feeden og forhåndsvise 24 hendelser. En Booking.com-hendelse viste innsjekk kl. 16.00 og utsjekk kl. 12.00 i norsk sommertid. Homey-import og oppdatering gjenstår, med eksisterende kalender som reserve. Overgangen til ett produksjonsmiljø vurderes etter en stabil driftsperiode.

## Status 24.11.2026 – Automatisk push i PROD

Manuelt pushvarsel er bekreftet på iPhone. Brukeren har satt automatisk utsending til true i Netlify PROD og godkjent deploy. Etter publisering gjenstår automatisk push-test med lukket iPhone-app og Homey-test.

## Status 24.11.2026 – Manuell push bekreftet i PROD

Brukeren bekreftet mottak av manuelt pushvarsel på iPhone etter oppdatering av abonnementet. PROD-deploy `d95d2f1` tok i bruk det nye VAPID-nøkkelparet. Automatisk utsending står fortsatt av. Neste steg er aktivering og én automatisk PROD-test med helt lukket app. Homey gjenstår.

## Status 24.11.2026 – PROD-deploy med nytt VAPID-nøkkelpar

Eier-ID er verifisert i PROD. Pushfunksjonen kom videre til VAPID-validering, der den gamle privatnøkkelen feilet på lengde. Brukeren har lagret et nytt nøkkelpar i riktig format i Netlify PROD og godkjent ny deploy. Neste kontroll er å oppdatere pushabonnementet på iPhone og bekrefte manuelt varsel. Automatisk utsending står av.

## Status 24.11.2026 – Ny PROD-deploy for push

Inntektsrettelsen er godkjent i PROD. Brukeren har oppdatert eier-ID-en i Netlify til ID-en fra den aktive PROD-sesjonen, og godkjent en ny deploy. Etter publisering verifiseres Pushvarsler og manuelt testvarsel på iPhone. Automatisk utsending står av.

## Status 24.11.2026 – Oppfølgingsrelease publisert i PROD

Commit `a8a0111` er publisert ifølge brukeren og bekreftet levert på PROD-domenet. Bekreftede kommende inntekter utelater nå bookinger etter utsjekk. Før publisering korrigerte brukeren eier-ID-en i Netlify til én ID uten JSON-innpakning. Sjekk i PROD at inntektskortet viser forventet beløp, at Pushvarsler vises på iPhone og at manuelt testvarsel mottas. Automatisk utsending står av inntil manuelt pushvarsel er verifisert. Homey testes separat i PROD.

## Status 24.11.2026 – Samlet release publisert i PROD

PROD-kandidaten ligger på `prep/skv138-prod-2026-11-24` med utgangspunkt i publisert PROD-gren `release/skv138-prod` ved `3173833`. Den overfører godkjente TEST-endringer for bookinger, gebyrer, økonomikort, oppgaver, handleliste, iCal og push. Eksisterende PROD-byggekommando, Netlify-konfigurasjon, Neon Auth-proxy, PWA-manifest og ikon er beholdt. Ingen TEST-data overføres. Netlify bekreftet Published kl. 19.30 for `dfb1247`, deploy `6b05d7de7eec04d1c419b4fa`. Live på `skv138.helgevold.no`: ny app og service worker svarte 200, og push-endepunkt uten innlogging svarte 401 som forventet. Innlogging, eksisterende bookinger, manuelt pushvarsel på iPhone og Homey gjenstår å bekrefte som innlogget bruker. Brukeren bekreftet at den additive pushmigreringen i Neon PROD ble kjørt med suksess.

TEST er funksjonelt brukergodkjent, inklusive Bookingdato og automatisk push med 0 og 1 times ledetid med lukket iPhone-app. PROD-autentiseringspakken er bygget lokalt med en fiktiv Neon Auth-adresse. Build sjekket generert redirect og at TEST-adressen ikke er med. Syntakskontroll og fem push-planleggingstester besto, og de tre nye Netlify-funksjonsmodulene kunne lastes lokalt. Dette verifiserer ikke faktiske Netlify-innstillinger, Neon-tilgang eller mottak i PROD.

Før publisering:
1. Fullført: `backend-draft/push-migration-prod.sql` er kjørt i SKV138 PROD ifølge brukeren. Migreringen oppretter to pushtabeller og gir den dokumenterte runtime-rollen `skv138_app` de nødvendige rettighetene. Brukeren har lagt inn eierens PROD-ID som `SKV138_PUSH_OWNER_USER_ID` og satt `SKV138_PUSH_SENDING_ENABLED=false` i Netlify PROD.
2. Fullført ifølge brukeren: PROD-verdier for VAPID og iCal er lagt inn i Netlify, og database-URL, privat VAPID-nøkkel og iCal-token er merket som hemmelige. `SKV138_PUSH_SENDING_ENABLED=false` inntil manuelt PROD-varsel er verifisert. Kalenderadressen gis kun til den autoriserte eierkontoen, og funksjonen krever gyldig token.
3. Klarsignal er gitt og produksjonsgrenen er oppdatert. Ved behov kan forrige PROD-deploy gjenpubliseres fra Netlify. Etter publisering kontrolleres eksisterende bookingdata, iPhone-innlogging, push på PROD-domenet og iCal i Homey. Eksisterende Homey-kalender beholdes som reserve under testen.

# Neste utviklingsrunde – 19.11.2026

PROD-runden er avsluttet. Brukeren tester videre med ekte data. Følgende punkter er meldt før videre live-erfaring og står åpne.

1. Nye bookinger skal foreslå to netter. Brukeren skal kunne endre til én natt, og datoene skal lagres riktig.
2. Sett opp egen PROD-konto for Melinda med e-post og passord hun selv velger. Bruk appens registrering og gi tilgang via `skv138_access`. Kontroller godkjent fremgangsmåte i innloggingsdokumentet.
3. Legg inn headerbilder øverst i appen og på nettsiden. Avklar bilder og plassering før endringen.
4. Legg inn et SKV138-ikon for den installerte iPhone-webappen, og kontroller ikonet på hjemskjermen.
5. Legg til «Logg ut». Sjekk at F5 ikke gjenoppretter den avsluttede økten, og at ny innlogging fungerer.
6. Endre Chrome-fanens tittel fra dagens TEST-tittel til «SKV138».

Kodearbeid skjer først i TEST. Melindas PROD-tilgang avklares separat.

---

# Produksjonsrunden avsluttet – 19.11.2026

PROD er publisert og i løpende bruk. Siste Netlify-deploy med tekstendringene viste Published ifølge brukeren. Automatisk innlogging gjør at innloggingsteksten ikke ble visuelt kontrollert etter siste deploy. Funksjonelle PROD-kontroller er godkjent på PC, i Chrome på iPhone og installert iPhone-PWA. Ekte booking og sesjon besto F5. Brukeren vil teste videre i vanlig bruk. Logg ut-knapp er utsatt til senere TEST-arbeid. Ingen videre deploy eller endring i main i denne runden.

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

# BESLUTNING OG OVERLEVERING – 19.11.2026 – PROD STARTER TOMT

Brukeren har besluttet: **Ingen TEST-data skal flyttes til PROD**. Opprett eget tomt PROD-datamiljø med nødvendig skjema og tilgangskonfigurasjon; ikke kopier bookinger, oppgaver, lager eller andre TEST-data. Dette er en planbeslutning, **ikke** autorisasjon til å opprette eller publisere PROD. Neste chat skal starte PROD-planlegging, ikke nye TEST-funksjonstester.

**Kritisk teknisk referanse:** Les `innlogging-og-pwa.md` før PROD-arbeid. Dokumentet beskriver hele historikken rundt PC-token 404, F5/sesjonsgjenoppretting, installert iPhone-PWA 401, same-origin Neon Auth-proxy, iOS-statuslinje, fungerende commits og PROD-fallgruver. TEST Auth URL er hardkodet og skal ikke gjenbrukes uendret i PROD. TEST QA F01–F06 og sluttkontroller 3/3 godkjent; `main` V16.23 urørt.

---

# AKTIV STATUS – 19.11.2026 – FUNKSJONELL TEST GODKJENT, PROD IKKE KLARERT

**Nyeste status overstyrer eldre historikk under.** GitHub: `khelgevold/SKV138-test`, gren `feature/neon-test-integration`. TEST: https://skv138-neon-test.netlify.app. `main` med godkjent V16.23 er urørt. **Det finnes ennå ikke eget PROD-miljø.**

**Brukergodkjent QA:** Første runde 25 godkjente kontroller. Alle seks registrerte feil/forbedringer **F01–F06 godkjent**: F01 sesjon/fane etter F5; F02 installert iPhone-PWA innlogging via same-origin Neon Auth-proxy; F03 kansellering og korrekte økonomitall; F04 opprette/slette plattformgebyrer; F05 fire økonomikort; F06 mørk iPhone-statuslinje. F06 kodecommit `64d630a` er publisert og brukerbekreftet. F04 HTML-handlerretting `8eed144` og same-origin auth proxy er også brukerbekreftet. F03 fungerte ved ny test uten ytterligere kodeendring; tidligere 409-årsak er ikke sikkert fastslått.

**Avsluttende manuelle kontroller 3/3 godkjent:** (1) ny booking vedvarer etter F5; (2) utlogging/innlogging gir tilgang til samme booking; (3) kansellering vedvarer etter F5 med riktige økonomitall. Dette er funksjonell TEST-godkjenning, **ikke sikkerhetsrevisjon eller godkjenning av PROD**.

**Foreløpig teknisk kildekodegjennomgang:** `backend-draft/skv138-state.mjs` krever konfigurasjon fra miljøvariabler, verifiserer JWT med JWKS, eksakt issuer og EdDSA, sjekker bruker mot `skv138_access`, begrenser API til GET/PUT, avviser feil origin på PUT, validerer payload og krever `expectedVersion` ved lagring. `backend-draft/client-adapter.mjs` sender Bearer-token uten å lagre det i localStorage. Same-origin proxy ligger i `backend-draft/test-site/_redirects`. **Kun statisk inspeksjon:** ingen live penetrasjonstest, kontroll av faktiske Netlify-hemmeligheter eller full verifikasjon av alle tilgangstilfeller. TEST-spesifikke diagnostikkmeldinger og foreldede «NOT deployed»-kommentarer finnes fortsatt i kode og bør vurderes før PROD. Ikke fjern versjonskontroll eller JWT-autorisasjon.

**Neste milepæl:** Avklare produksjonsarkitektur og dataoverføring/ren oppstart, kontrollere PROD-spesifikke tilgangsregler, secrets, miljøskille, logging/diagnostikk og backup-/rollback-plan. PROD krever eksplisitt godkjenning. Ingen nye deploys, migreringer eller unødvendige tester nå. Utsatt: pushvarsler (prioritet 1), dynamisk iCal (prioritet 2); ingen manuell ICS-eksport i avtalt plan.

---

# F02 – teknisk undersøkelse 19.11.2026 (nyeste status)

Bruker testet iPhone installert PWA: `TEST_DIAG_TOKEN_ENDPOINT_HTTP_401` etter innlogging. Samme feil etter full lukking og etter sletting/ny installasjon. Safari på iPhone og PC fungerer. Dette avkrefter ikke alle PWA-cacheproblemer, men gjør gammel installasjon lite sannsynlig som hovedårsak.

Gjennomgått `neon-auth-bootstrap.mjs`, `neon-test-config.mjs`, `client-adapter.mjs` og login-controller: frontend `skv138-neon-test.netlify.app` kaller separat `*.neonauth.*.aws.neon.tech`-domene; SDK token() prøves før GET /token med credentials:include. Better Auth dokumenterer at Safari ITP kan blokkere tredjeparts sesjonscookies, og anbefaler same-origin reverse proxy eller delt parent-domene. **Dette er en sterk hypotese, ikke bekreftet rotårsak.** Dokumentasjon: https://github.com/better-auth/better-auth/blob/main/docs/content/docs/concepts/cookies.mdx . Neon-dokumentasjon viser at managed auth bruker HttpOnly sesjonscookie og at token er separat JWT: https://github.com/neondatabase/website/blob/main/content/docs/auth/authentication-flow.md .

**Neste tekniske steg:** Utform en avgrenset same-origin Netlify Auth-proxy, med eksplisitt håndtering av cookie-domain/path, Neon trusted origin og SDK base URL. Ikke bare bytt /token-URL: både sign-in, get-session og token må bruke samme cookie-kontekst. Før kodeendring: avklar faktisk Netlify publish directory/redirect-konfigurasjon og hvordan proxyen påvirker Set-Cookie. Behold JWT-verifisering og server-allowlist. F04 rettet i commit `8eed144`, ikke publisert. Ingen ny deploy før kontrollert samlet kandidat.

---

# AKTIV STATUS – 19.11.2026 – QA F01–F05, samlet TEST-kandidat under forberedelse

**Nyeste status overstyrer eldre historikk nedenfor.** Brukeren har fullført første manuelle QA-runde: 25 godkjente tester/kontroller og fem registrerte feil. Netlify TEST **Stopped builds bekreftet av bruker**. Eget PROD-miljø er **ikke** opprettet; `main` inneholder godkjent V16.23 og skal ikke endres.

**F01**: Ved F5 vises innloggingssiden (autofyll logger raskt inn igjen); forventet automatisk gjenoppretting og samme hovedfane. TEST-kode skjuler innlogging under sesjonskontroll og lagrer hovedfane i sessionStorage. **Ikke funksjonstestet.** Årsaken til eventuell mislykket Neon-sesjonsgjenoppretting er fortsatt ukjent.

**F02**: Innlogging i installert iPhone-PWA feiler, Safari fungerer. Tidligere `TEST_DIAG_TOKEN_EXCEPTION`. Rotårsak ikke fastslått; ingen spekulativ JWT/auth-endring. Må undersøkes ved målrettet PWA-test. Diagnostikk fjernes først etter bekreftet løsning.

**F03**: Kansellering med beholdt brutto/gebyr gir HTTP 409/lagringsstopp; booking forblir ukansellert etter F5. Serveren bruker `expectedVersion`, transaksjon og `FOR UPDATE`; køen serialiserer writes. Årsak til konflikt ikke påvist, og beskyttelsen skal ikke fjernes. Trenger målrettet reproduksjon/versjonskontroll ved neste TEST-deploy.

**F04**: Opprett/slett plattformgebyr fungerte ikke. TEST-koden samler usparte skjemaverdier før én lagring ved add/delete, uten mellomliggende save. Commit `2724130`; **ikke funksjonstestet**.

**F05**: Manglende fjerde KPI «Estimert netto hittil i år» i seksjonen «Utbetalinger og skatt hittil i år». TEST-koden legger til kortet og 2×2-oppsett, mens tre eksisterende KPI-er beholdes. Commit `2724130`; **ikke funksjonstestet**.

**GitHub Actions:** En kontrakttest feilet etter F01-strukturendring, rettet i `1592b48`; bruker bekreftet grønn etter dette. Nyere commit `2724130` er **ikke bekreftet grønn** i samtalen. Ingen ny Netlify-publisering av F01/F04/F05 er gjort.

**Neste milepæl:** Kontroller GitHub Actions etter siste endringer, publiser deretter én samlet TEST-kandidat etter avtale. Test én handling av gangen: F01, F04, F05, F02 og F03, deretter blokkert kanselleringsregresjon. Ikke test allerede godkjente deler unødvendig. Tester 5, 12–14, 20, 37–39 og 41 gjenstår; test 15 manuell ICS-eksport er fjernet (kun dynamisk iCal senere). Ikke opprett ekstra bruker kun for test. Pushvarsler/dynamisk iCal er utsatt.

---

# GJELDENDE STATUS – 19.11.2026 – Neon TEST innlogging og bookingpersistens bekreftet

**Nyeste status overstyrer eldre tidsstemplede notater nedenfor.** Bruker bekrefter på PC at innlogging fungerer, appen åpnes med Neon TEST-data, en ny TEST-booking kan opprettes, og bookingen **fortsatt finnes etter F5/refresh**. Dermed er denne konkrete Neon GET/PUT-persistensflyten funksjonstestet og godkjent. Det er **ikke** bekreftet at brukeren forblir innlogget etter refresh (separat test), eller at installert iPhone PWA fungerer.

**Løsning på PC-innloggingsblokker:** Edge Network viste at `GET /neondb/auth/get-j-w-t-token` returnerte HTTP 404. Neon Better Auth, riktig Auth URL, trusted domain og offentlig JWKS (EdDSA/Ed25519) var bekreftet. TEST-koden i `backend-draft/client-adapter.mjs` forsøker `authClient.token()`, og ved manglende token direkte `GET {SKV138_TEST_AUTH_URL}/token` med `credentials: include`. Endringene i `d173b9e` og `75fe6c4` er **publisert og brukerbekreftet fungerende på PC**. Ingen omgåelse av backend-JWT-verifisering eller tilgangsliste. Diagnostikk skal ryddes opp først etter at innlogging er verifisert på relevante klienter.

**Publisert TEST:** `https://skv138-neon-test.netlify.app` fra `feature/neon-test-integration`. **PROD/main V16.23 urørt.** Netlify TEST var gjentatte ganger satt til Stopped builds for å spare credits; siste instruks til bruker var å stoppe builds etter vellykket publisering. **Ikke anta at bruker faktisk har stoppet dem etter siste deploy uten bekreftelse.** Unngå nye deploys før konkrete feilrettinger krever det.

**Neste oppgave er IKKE ny kode eller deploy:** Start ny chat med å lage en prioritert, fullstendig og praktisk TEST-sjekkliste ut fra de 11 avtalte endringene i denne filen, øvrige prosjektfiler og gjeldende kode. Skill mellom godkjent, utestet og blokkert; prioriter sesjonsbevaring ved refresh, installert iPhone PWA, PC-/mobil-layout, booking/kansellering, økonomi/skatt, private oppgaver, plattformgebyrer og innstillinger. Bruker skal få én nødvendig testhandling av gangen, og funn samles for samlet rettingspakke. Ingen unødvendige kontroller. Pushvarsler og dynamisk iCal er utsatt til etter øvrig TEST-godkjenning. Vurder PROD-migrering separat.

**Dokumentasjonsstatus:** `project.md` og `startnestechat.md` oppdatert ved overlevering. `utviklingsregler.md` er gjennomgått og uendret; `parkeringsplassen.md` gjennomgås for utsatte ønsker. Historiske seksjoner nedenfor beskriver tidligere feil og ikke nødvendigvis nåværende status.

---

## BEKREFTET TEST-RESULTAT – innlogging fungerer 19.11.2026
- Bruker har bekreftet med skjermbilde at ny TEST-deploy med `/token`-fallback (commits `d173b9e`/`75fe6c4`) åpner hytteappen på PC etter innlogging. Dette løser den tidligere PC-blokkeren `TEST_DIAG_JWT_HELPER_EXCEPTION_OTHER_HTTP_404` i den testede flyten. Ikke påstå at iPhone PWA eller refresh er verifisert.
- Skjermbildet viser oversikten med Prognose år, utbetaling/skatt, neste oppgaver og bunnmeny. PC-layout og øvrige funksjoner er ennå ikke godkjent.
- **Neste prioritet:** opprett en TEST-booking, vent til lagring er ferdig, oppdater siden og kontroller at bookingen fortsatt finnes i Neon. Deretter kontroll av sesjonsbevaring, PC-layout og iPhone PWA. Behold PROD/main urørt og begrens Netlify-builds; stopp TEST-builds etter publisering.

## Neon JWT konkret retting – 19.11.2026 (IKKE publisert)
- Edge Network viste faktisk GET `/neondb/auth/get-j-w-t-token` → 404. Neon Better Auth/JWKS er tilgjengelig og Auth URL/trusted domain stemmer.
- Dokumentert Neon-flyt for standard Better Auth-klient er `authClient.token()` med `data.token`; direkte REST GET `{AUTH_URL}/token` med `credentials: include` kan brukes dersom SDK ikke leverer token. `getJWTToken()`-fallback er fjernet; `session.access_token`-fallback er fjernet siden den tilhører en annen klientvariant. Commit `d173b9e`, korrigert URL-regex `75fe6c4`. Ingen tokenlagring, backend-JWT-verifikasjon og allowlist uendret.
- **Ikke testet/publisert.** Netlify TEST Stopped builds. Ved neste avtalte ene TEST-deploy: logg inn og kontroller Network `/token` og resultatet. Ingen PROD/main-endring.

## TEST JWT – sesjonstoken som sikker fallback 19.11.2026
- Neon Better Auth er aktiv; Auth URL/trusted domain samsvarer med GitHub; JWKS GET fungerer (EdDSA/Ed25519). Sist observerte feil ved JWT-helper: HTTP 404.
- Neons dokumenterte innloggingsflyt oppgir JWT i `session.access_token`. Commit `1244039` prøver derfor `authClient.getSession().data.session.access_token` ved manglende `token()`-resultat, **før** eksisterende `getJWTToken()`-fallback. Ingen token lagres i localStorage, og backend må fortsatt validere JWT/allowlist. Endringen er en målrettet hypotese, **ikke testet**; tokenfeltets tilgjengelighet i låst SDK 0.4.0-beta må bekreftes ved neste TEST-innlogging.
- Netlify TEST Stopped builds. Ikke publisert, ingen PROD/main-endringer. Neste: én kontrollert TEST-deploy og innloggingstest, deretter bookingpersistens.

## TEST Neon Auth – målrettet feildiagnostikk 19.11.2026
- Siste publiserte innloggingsfeil: `TEST_DIAG_JWT_HELPER_EXCEPTION`; Netlify TEST `Stopped builds` bekreftet. `token()` ga ikke brukbart token og `getJWTToken()` kastet feil; rotårsak ukjent.
- Commit `f214e09` klassifiserer feil fra JWT-helper med begrenset HTTP-status (400–599 hvis tilgjengelig) og fast feiltype (TYPE/ABORT/NETWORK/OTHER). Commit `e1662b6` viser sifre i den begrensede diagnostikkoden. Rå feilmeldinger, token og legitimasjon eksponeres ikke. Ingen endring i backend-autorisasjon.
- **Ikke publisert eller testet.** Neste kontroll: én manuell TEST-deploy etter aktivering og én innlogging; noter hele `TEST_DIAG_...`-koden, stopp builds igjen. PROD/main urørt.

## TEST Neon token diagnostikk – 19.11.2026
- Netlify TEST `Stopped builds` bekreftet av bruker etter at siste deploy viste `TEST_DIAG_TOKEN_EXCEPTION`.
- Commit `f7130ff`: avgrenset diagnostikk i `backend-draft/client-adapter.mjs` skiller feil i `token()`, `getJWTToken()` og begge metodene. Viser kun forhåndsdefinerte feilkoder, aldri token eller rå SDK-feilmeldinger. Ingen endring i backend-autorisasjon.
- Ikke publisert/testet. Neste steg er én kontrollert TEST-deploy og én innloggingstest for å hente ny feilkode. Ikke bygg mer før resultatet er vurdert. PROD/main urørt.

## TEST tokenretting 19.11.2026 – ikke publisert
- Etter manuell TEST-deploy viste innlogging `TEST_DIAG_TOKEN_MISSING` (tidligere iPhone PWA viste `TEST_DIAG_TOKEN_EXCEPTION`). Feilen oppstår før backend-GET.
- GitHub commit `c507ed7`: `backend-draft/client-adapter.mjs` bruker fortsatt `authClient.token()` først, men forsøker dokumentert `authClient.getJWTToken()` når tokenresponsen mangler eller tokenkallet feiler. JWT sendes kun som Bearer-header; ingen lokal tokenlagring, ingen svekket backend-autorisasjon. Diagnostikken beholdes inntil funksjonstest.
- **Netlify TEST Stopped builds bekreftet av bruker.** Endringen er IKKE publisert/testet. Neste steg: én kontrollert TEST-deploy etter avtale, prøv innlogging og bookingpersistens; deretter PC/mobil. PROD/main urørt.

## Statisk UI-kontroll – bookingfelt og PC-layout 19.11.2026
- Verifisert i faktisk `backend-draft/test-site/app.html`: V15-bookingskjemaet legger til `bdog` (hund), øvrige felter omfatter gjester, stamp, elbillading og sengetøy. Siste bookingkort-wrapper bruker de samme bookingegenskapene. Grønn privat-badge og separat prognosekort har CSS/DOM-koblinger.
- PC-layout har eksplisitt `@media (min-width:651px)` for bunnnavigasjon; mobilvisningen er separat. Dette er **kun kildekodekontroll**, ikke visuell test. Ingen kodeendring uten påvist feil.
- Gjenstår før godkjenning: kontrollert én-gangs TEST-publisering, PC/mobil-layout, opprette booking og bekrefte persistens etter refresh, kansellering og privatoppgaver, samt iPhone PWA-tokenfeil. Netlify TEST fortsatt Stopped builds; PROD/main urørt.

## Punkt 1 – booking/kansellering, statisk kontroll 19.11.2026
- Gjennomgått faktiske funksjoner `v10Stays()`, `v10Conflict()`, `v16SetBookingPeriod()`, `v16OpenBooking()`, `skvConfirmSettlement()`, `skvDeleteCancelled()`, `bookingAmounts()`, `v10YearStats()`, `v15TaxYtd()`, `v15CalendarData()`.
- Bekreftet i kode: kansellerte bookinger utelates fra oppholdslisten som brukes til kalender og overlappskontroll; beholdes i bookinghistorikken «Kansellerte»; inntekts- og gebyrbeløp bygger på registrert oppgjør; sletting krever kansellert status og eksplisitt bekreftelse. Tidligere dobbelttelling i plattformstatistikk ble fjernet i `bfc9a10`.
- Åpne funksjonelle verifikasjoner: kansellering/oppgjør, permanent sletting, bookingpersistens etter refresh, auth i iPhone PWA, og PC/mobil-layout. Dette er ikke godkjent uten TEST-publisering.
- **Netlify TEST fortsatt Stopped builds**. Ingen ny kodeendring eller deploy i denne kontrollen; PROD/main urørt.

## Statisk kontroll – Neon innlogging og lagringskø 19.11.2026
- Kontrollert `neon-test-entry.mjs`, `login-controller.mjs`, `access-verifier.mjs`, `client-adapter.mjs`, `legacy-save-queue.mjs`, `v1623-state-bridge.mjs`, `test-site/index.html` og appens `save()`-kobling. Autorisert backend GET kreves før appens iframe lastes. `save()` sender snapshot via bridge til serialisert PUT-kø. 409/andre skrivefeil stopper videre lagring og muliggjør eksport av ulagrede data.
- Ved refresh forsøker `restoreSession()` `login.session()` og backend-verifisering; feil fanges og brukeren blir på innlogging. Derfor kan koden **ikke** alene bevise vedvarende innlogging. iPhone PWA `TEST_DIAG_TOKEN_EXCEPTION` gjenstår og kan oppstå før backend-kallet.
- Ingen ny kodeendring i denne kontrollen: ingen sikker og bekreftet rotårsak til iPhone-problemet funnet. Ikke fjern diagnostikken eller omgå tokenkontroll før den er diagnostisert.
- Ingen TEST-publisering eller funksjonstest utført. **Netlify TEST Stopped builds beholdes** til kontrollert felles testkandidat er avklart. PROD/main urørt.

## Kodegjennomgang punkt 1 – private oppgaver og Neon 19.11.2026
- Commit `505ddda`: tidligere endring beholdt **alle** private oppgaver fra avsluttede opphold, også ufullførte; disse ville ligget som forfalte oppgaver permanent. Nå beholdes fullførte private oppgaver for historikk, mens ufullførte oppgaver fra avsluttede privatopphold ikke genereres. Aktivt/fremtidig privatopphold beholder alle aktive regler. Dette følger eksisterende utleieoppgaveprinsipp så langt som mulig.
- Statisk kontrollert `backend-draft/v1623-state-bridge.mjs`: `initialize()` krever validert state fra autorisert backend, `commit()` validerer og kølegger endringer, og `whenIdle()` er tilgjengelig. **Dette dokumenterer kodeflyten, ikke verifisert persistens etter refresh**; den testen krever TEST-publisering.
- Netlify TEST fortsatt **Stopped builds**; ingen publisering, PROD/main urørt. Neste kontroll: køens feil-/konflikthåndtering og kobling fra iframe til lagringsbroen før samlet TEST-test.

## Kodegjennomgang punkt 1 – plattformgebyrer 19.11.2026
- Commit `5bae1a1`: bekreftet at gebyrverdi-feltet i `renderPricePanels()` brukte `oninput="priceFeesChanged()"`, og at `priceFeesChanged()` kaller `save()`. Det kunne starte en Neon-lagring for hvert tastetrykk. Endret gebyrverdi til `onchange` slik at redigering lagres ved feltendring/avsluttet redigering; øvrige felt hadde allerede `onchange`. Brukeren må fortsatt verifisere faktisk persistens i TEST.
- Statisk kontroll: V16.20 flytter gebyrfeltene til nye DOM-grupper, men beholder input-ID-ene som siste gebyrfunksjoner leser. V16.8 gjør Innstillinger-kort til `details` med `summary` inni eksisterende kort; siste sortering finner disse titlene. Dette er kodekontroll, **ikke** visuelt godkjent.
- **Netlify TEST skal fortsatt ha Stopped builds.** Ingen deploy utført. Fortsett kontroll av oppgaver, state-bridge og sentrale brukerflyter før beskjed om kontrollert TEST-publisering.

## Kodegjennomgang punkt 1 – 19.11.2026 (Netlify builds stoppet)
- Brukeren har satt Netlify TEST til **Stopped builds** etter 30–40 automatiske jobber. Ikke be om å aktivere igjen før samlet TEST-kandidat er klar; GitHub-commits skal ikke trigge nye automatiske bygg mens denne innstillingen står.
- **Bekreftet økonomifeil rettet** i commit `bfc9a10`: `v10YearStats` summerte allerede kansellerte bookinger i `platforms`, mens V16.7-wrapperen la de samme beløpene til én gang til. Den overflødige wrapperen er fjernet. Dette hindrer dobbelttelling av brutto/gebyr per plattform for kanselleringer; samlet årssum var ikke påvirket av akkurat denne wrapperen.
- Kontrollert at V16-bookingkort har `v16OpenBooking(id)` og at siste wrapper leser samme onclick-format; kontrollert at kanselleringsskjemaets `booking-actions` finnes i opprinnelig detaljvisning. Ingen nettleser-/iPhone-verifikasjon ennå.
- Neste: fortsette statisk gjennomgang av gebyrredigering, innstillingsrekkefølge, private oppgaver og tilstandslagring. Hold TEST og PROD urørt i Netlify inntil eksplisitt beskjed.

## Fremdrift – videre kodekontroll 19.11.2026
- Gjennomgått `client-adapter.mjs`, `login-controller.mjs`, `login-form.mjs`, `neon-test-entry.mjs` og relevante deler av `app.html`. `TEST_DIAG_TOKEN_EXCEPTION` oppstår ved unntak i `authClient.token()` **før** backend-kallet; derfor kan den ikke løses ved å endre SQL/autorisasjon. Den konkrete underliggende iOS-årsaken er ennå ikke observert. Ingen endring i token-sikkerhet eller lagring av JWT.
- Commit `29e5858`: sikret at kanselleringsskjemaet bare monteres når bookingens handlingsrad faktisk finnes; unngår et skjult skjema ved avvikende visning.
- Neste nødvendige milepæl: én samlet TEST-publisering og målrettet kontroll av installert iPhone-webapp kontra Safari, refresh og booking/økonomi. Ikke bruk ekte bookinger til permanent sletting i test. Publisering og brukerhandling avklares før utførelse. PROD/main urørt.

## Fremdrift – kvalitetssikring av oppgaver og auth 19.11.2026
- Commit `80934c9`: funnet og rettet en reell feil: `done()` for private oppgaver av typen sjekkliste slo opp i `state.bookings` og kunne feile når privatoppholdet bare finnes i `state.privateStays`. Privatoppgaver bruker nå sin egen lagrede fullføringsstatus; utleiesjekklister beholdes uendret.
- Commit `b0d5dc4`: fjernet overflødig avlesning/dekoding av uverifiserte JWT-claims fra login-UI. Backend-basert autorisasjon er beholdt. Midlertidige `TEST_DIAG_*`-feilmeldinger i klient/server er **ikke** fjernet ennå fordi iPhone PWA-tokenfeilen fortsatt ikke er diagnostisert.
- Viktig gjenstående: bekreft faktisk årsak til iPhone PWA-tokenfeil, verifiser refresh og datalagring, og kjør samlet funksjonstest av økonomi, kansellering og oppgaver. Ingen TEST-publisering eller PROD-endring i dette steget.

## Fremdrift – innlogging og oppgavehistorikk 19.11.2026
- Commit `de69d47`: innlogging etter refresh og manuell innlogging deler nå én autorisasjonsflyt, slik at samtidig respons ikke starter to separate Neon state bridges. Backend GET og tilgangskontroll kreves fremdeles. Dette er en **forebygging av konkret race condition i koden**, ikke bekreftet løsning av iOS PWA-tokenfeilen.
- Commit `104bae4`: historiske private oppgaver forsvinner ikke lenger fra oppgavelisten bare fordi privatoppholdet er avsluttet. Kanselleringsoppgjør krever eksplisitt utfylte beløpsfelt.
- Fortsatt uavklart: `TEST_DIAG_TOKEN_EXCEPTION` på installert iPhone-PWA. Må verifiseres på faktisk iPhone før PROD; ingen usikker auth-omgåelse. Samlet browser-/økonomitest og diagnostikk-opprydding gjenstår. Ingen Netlify/PROD-endringer i dette steget.

## Fremdrift – målrettet kodegjennomgang 19.11.2026
- Gjennomgått faktisk V16-kode og nye overstyringer. Commit `5cd5027`: korrigert **reell skatt %** slik at nevneren bruker samme *hittil-i-år*-periode og årsgrense som eksisterende `v15TaxYtd`, med brutto minus gebyr, ikke hele årets prognose mot YTD-skatt. Eksisterende beregnet skatt beholdes uendret.
- Commit `165e46d`: erstattet kombinert «Sum utbetalt + skatt»-kort med «Reell skatt i prosent». De to separate kortene for «Utbetalt hittil i år» og «Estimert skatt hittil i år» beholdes.
- Commit `b4e8a90`: «Plasseringer» bruker nå eksisterende standard-chevron for Innstillinger fremfor en avvikende CSS-variant.
- **Ikke kjørt nettleser-/iPhone-test.** Viktig å verifisere at gebyrfelt, innstillingsrekkefølge og oppgjør fungerer i faktisk TEST-visning. `TEST_DIAG_TOKEN_EXCEPTION` på installert iPhone-PWA er fremdeles uavklart og blokkerer godkjenning; ikke anta at sesjonsgjenoppretting løser det.
- Sikkerhet og datalagring er prioritert over rask prosentfremdrift. Ingen endring i PROD/main.

## Fremdrift – oppgavemaler og sesjon 19.11.2026
- Commit `bb9a12d`: «Privat booking» som eget plattformvalg for oppgaveregler. Private opphold får kun regler valgt for privat; «Alle plattformer» genererer ikke privatoppgaver. Commit `eff8869`: private oppgaver kan fullføres/angres uten å åpne en utleiebookings sjekkliste. Merk: private sjekkliste-oppgaver er foreløpig en enkel fullføringshandling, ikke detaljert klargjøring/etterkontroll-sjekkliste; vurder i QA.
- Commit `8d56086`: forsøk på sikker gjenoppretting av Neon-sesjon ved refresh i `backend-draft/neon-test-entry.mjs`; backend-tilgang kontrolleres før app vises. **Ikke bekreftet i browser eller iPhone.** iPhone `TEST_DIAG_TOKEN_EXCEPTION` er fremdeles åpen, og det er ikke dokumentert at refresh-rettelsen løser den.
- Ingen Netlify-publisering eller PROD-endringer. Gjenstår kontroll av app-funksjoner og økonomi, PWA-auth, opprydding av diagnostikk og samlet TEST-verifisering.

## Fremdrift – kansellering/sletting 19.11.2026
- Commit `583520d`: lagt inn skjema for kansellering med faktisk beholdt brutto, endelig gebyr og automatisk netto; mulighet til å redigere oppgjøret etter kansellering; sletting kun for kansellerte med bekreftelse. Eksisterende filtrering viser kansellerte i historikk og utelater dem fra kalenderen; eksisterende statistikk bruker `bookingAmounts`. Sletting fjerner booking fra `state.bookings` og relaterte `state.completed`-nøkler.
- **Implementert, men ikke manuelt verifisert.** Sjekk særlig endringshistorikk, oppgavefullføringer, statistikk, årsfordeling og lagring ved samlet TEST-godkjenning. Ikke slett ekte data før godkjent.
- Gjenstår fortsatt PWA/refresh-auth, private oppgavemaler, endelig UI-/økonomiverifisering, testdiagnostikk og samlet QA. Ikke erklær versjon ferdig.

## Fremdrift – videre arbeid 19.11.2026
- Commit `3e75713`: rettet gebyr-editorens lagrings-/legg til-/slett-funksjoner med feltlesing som tåler at V16.20 flytter feltene i DOM. **Ikke manuelt testet**, må verifiseres i samlet TEST-kandidat.
- Autentisering undersøkt: `index.html` starter innloggingskontroller ved lasting, `login-controller.mjs` har allerede `session()`-metode, men den er ikke koblet til automatisk gjenoppretting. iOS PWA-tokenfeilen er ennå ikke diagnostisert til konkret årsak. Ikke omgå tokenkontroll eller svekk autorisasjon.
- Gjenstår: fullstendig kansellering/sletting, private oppgavemaler, sikker sesjonsgjenoppretting og iOS PWA, kvalitetssikring av de nye UI-/økonomifeltene.

## Fremdrift – første kodearbeid 19.11.2026
- Samlet versjonsomfang (begge listene) er dokumentert øverst og godkjent for utvikling.
- Første avgrensede UI-kodeendring i TEST, commit `1b78311`: grønn Privat-indikator på bookingkort, antall gjester og relevante tilleggsikoner på utleiekort, ny sortering/format for Plasseringer under Innstillinger, ramme «Prognose år», endret bruttoetikett og ny prosent-KPI. **Ikke funksjonstestet eller godkjent ennå.** Ingen endring i main/PROD/DB.
- Åpent: verifiser prosent-KPI mot eksisterende YTD-regler og vurder datamodell for hund. De alvorlige punktene PWA-auth, refresh-sesjon, gebyrer og kansellering/sletting er ennå IKKE implementert. Private oppgavemaler gjenstår også. Ikke be brukeren teste en ufullstendig kandidat.

# AKTIV UTVIKLINGSPAKKE – 19.11.2026 (overstyrer eldre status)

Brukeren har godkjent at **begge forbedringslistene** samles i én versjon og har gitt klarsignal til implementering i `feature/neon-test-integration`. **Ingen PROD/main-endringer.** Status: omfang låst, implementering starter; ikke merk punktene som ferdige før faktisk kode/test.

## Hele omfanget – ingen punkter skal falle ut
1. Kritisk: installert iPhone-webapp/PWA feiler ved innlogging med `TEST_DIAG_TOKEN_EXCEPTION`, Safari fungerer. Finn faktisk årsak og rett uten å svekke auth.
2. Kritisk: nettleser logger ut ved refresh; gjenopprett gyldig sesjon sikkert.
3. Plattformgebyrer under Innstillinger: opprettelse og sletting virker ikke; kontroller redigering, lagring og beregninger.
4. Privat booking: grønn plattform-/typeindikator på bookingkort, lik kalender.
5. Innstillinger: «Plasseringer» samme accordion-design som øvrige, og godkjent rekkefølge: Plattformgebyrer, Priskalkulator, Utleievarer, Plasseringer, Sjekklistemaler, Tidspunkter og oppgaver, Oppgaveregler, Meldingsmaler, Kalenderintegrasjon (iCal), Testdata.
6. Kansellering: kansellert booking frigjør datoer og skjules i kalender; beholdes i historikk under Kansellerte-filter. Kanselleringsforespørsel som ikke godtas skal IKKE kansellere aktiv booking. Mulighet til å korrigere brutto, gebyr og netto ved kansellering etter faktisk oppgjør. Årsfordeling/statistikk følger oppgjøret. Kun kansellerte bookinger kan slettes permanent, etter bekreftelse; fjern alle relevante koblinger/visninger/beregninger. Ingen automatisk sletting.
7. Oversikt: ramme «Prognose år» rundt øverste prognosetall; etikett «Bruttoinntekt / prognose» -> «Bruttoinntekt» uten å endre tall.
8. Oversikt: del feltet «sum utbetalt + skatt» i to; nytt nøkkeltall reell skatt % = eksisterende beregnet skatt / (samlet brutto - samlede plattformgebyrer) * 100; ikke endre skatteberegning eller likestill gebyr med skatt. Null/negativ nevner skal ikke gi meningsløs prosent.
9. Bookingkort: ikoner for stamp, hund, elbillading, sengetøy/håndklær når relevante, og antall gjester.
10. Oppgavemaler: legg til «Privat booking» i eksisterende plattformvalg. «Alle plattformer» gjelder bare utleie; privat opphold får kun egne relevante maler med eksisterende frist-/oppgaveregler.
11. Fjern midlertidige TEST-diagnosemeldinger ved ferdigstilling, uten å miste nyttig intern feilhåndtering.

**Utenfor pakken:** pushvarsler (neste prioritet 1) og automatisk iCal (prioritet 2) først etter øvrig TEST-godkjenning. Vurder migrering av reelle TEST-data til fremtidig PROD separat; ingen ukritisk kopiering.

**Arbeidsform:** minst mulig unødvendige GitHub/Netlify-commits, ingen ekstra DB-operasjoner; målrettet kvalitetssikring av sikkerhet, lagring, beregninger og bookingflyt. Brukeren tester én samlet kandidat når klar. Oppdater fremdrift med faktisk implementert/testet/godkjent.

---

# GJELDENDE STATUS – 18.11.2026 kl. 21:20 (les først)

## Kritiske innloggingsfeil – 19.11.2026 (må løses før PROD)
**To separate bekreftede brukeropplevelser i Neon TEST:**
1. **Nettleser:** Brukeren blir logget ut ved hver sideoppdatering/refresh. Forventning: aktiv innloggingssesjon skal beholdes etter refresh.
2. **iPhone installert webapp/PWA:** Innlogging feiler, mens vanlig Safari på samme telefon fungerer. Tidligere observert `TEST_DIAG_TOKEN_EXCEPTION`, også etter manuelt passord.

**Begge er blokkerende feil for PROD**, ikke ordinære forbedringsønsker. Undersøk målrettet når øvrige testfunn samles til neste rettingspakke; ikke anta at de har samme årsak. Unngå unødvendige tester og deploys. Pushvarsler (prioritet 1) og iCal (prioritet 2) skal vente til øvrig TEST er visuelt og funksjonelt godkjent.


## Prioritering og PROD-data – 19.11.2026
Brukeren prioriterer **pushvarsler som første neste funksjonsområde** og **iCal som prioritet 2**, men **begge skal vente** til øvrige deler av Neon TEST er visuelt og funksjonelt ferdig/godkjent. Fortsett å samle funn og diskutere samlet før neste versjon. Ingen implementering/deploy nå.

Brukeren spør om data fra Neon TEST kan tas til fremtidig PROD eller om PROD bør starte tom. **Mulig å migrere**, men endelig valg tas senere ut fra faktisk datakvalitet og ønsket om å bevare reelle data. Foretrekk planlagt, selektiv migrering av reelle bookinger, oppgaver/maler, lager, innstillinger mv. framfor ukritisk kopiering av testbookinger og testhistorikk. Kartlegg skjema, relasjoner, identiteter/tilganger, referanser og datamengde før konkret migreringsplan. Ikke utfør databaseoperasjoner nå. TEST og PROD må forbli isolert.


**Neon TEST fungerer i Safari på iPhone og i PC-nettleser. Vanlig utleiebooking er nå opprettet med hell av brukeren etter rettelse av rekursiv `saveBooking` (commit `39709cc`).** Privat booking fungerte allerede. Brukeren fortsetter nå en samlet funksjonstest (bookinger, kansellering, utbetaling, oppgaver/sjekklister, lager, statistikk og innstillinger). Ikke påstå at hele appen er ferdig testet eller produksjonsklar.

- GitHub: `khelgevold/SKV138-test`, aktiv gren `feature/neon-test-integration`. Godkjent V16.23 i `main` er urørt; ingen SKV138 PROD. TEST: https://skv138-neon-test.netlify.app.
- Neon Auth, allowlist, GET og PUT fungerer i vanlig nettleser. Lagring var først blokkert av `Origin denied`: `SKV138_APP_ORIGIN` i Netlify hadde feilaktig avsluttende `/`. Brukeren fjernet skråstreken og deployet; lagring fungerer. Neon TEST-seed er kjørt.
- PC-bunnmenyen ble gjort fast med en avgrenset CSS-overstyring i TEST-kopien `backend-draft/test-site/app.html`; brukeren bekreftet at appen fungerer på mobil og PC. Merk at eventuell separat PC-verifisering av fast meny ikke er uttrykkelig dokumentert.
- **Feil rettet:** Vanlig utleiebooking reagerte ikke på lagreknappen. Midlertidig diagnostikk viste `Maximum call stack size exceeded` med gjentatte `saveBooking`-rammer. V10-wrapperen var deklarert med `function saveBooking` og ble hoistet slik at `oldSaveBookingV10` pekte tilbake på wrapperen. Endret wrapperen til `saveBooking=function(...)` slik at tidligere funksjon fanges korrekt; fjernet midlertidig booking-feildiagnostikk. Brukeren bekreftet 18.11 kl. 21:15 at lagring nå fungerer. **Ved neste naturlige test: kontroller at bookingen fortsatt finnes etter sideoppdatering**; dette er ikke eksplisitt bekreftet for den siste utleiebookingen.
- **Åpen feil før PROD:** iPhone installert som webapp via Hjem-skjerm feiler ved innlogging med `TEST_DIAG_TOKEN_EXCEPTION`, selv med manuelt passord. Safari på samme iPhone og PC-nettleser fungerer. Undersøk Neon Auth-token/sesjon i iOS standalone/PWA; ikke anta årsaken eller endre sikkerhet. Kan samles med øvrige funn i én rettelsespakke.
- Midlertidige `TEST_DIAG_*`-diagnostikkmeldinger i auth-klienten gjenstår å rydde før produksjon. Unngå unødvendige enkeltdeploys.
- **Neste handling:** La brukeren fullføre funksjonstesten og rapportere konkrete feil fortløpende. Rett nødvendige blokkere når de hindrer videre testing, ellers samle rettelser for færrest mulig Netlify-deploys. Én nødvendig brukerhandling om gangen. Ved videre arbeid: les `utviklingsregler.md`, dette dokumentet og faktisk kode. Ikke gjør unødvendige tester, endringer i main eller databaseoperasjoner.

## Avtalt forbedring under funksjonstest – oppgaver for private bookinger (18.11.2026 kl. 22:26)
Brukeren ønsker å beholde eksisterende oppgavemal-skjema og regler. Legg til «Privat booking» som ekstra valg i eksisterende «Plattform»-nedtrekk (Alle plattformer, Finn.no, Airbnb, Booking.com, Direkte, Privat booking). «Alle plattformer» skal fortsatt bety utleieplattformene, ikke privat. Når Privat booking er valgt, skal oppgavemalen generere oppgaver for private opphold med samme relevante frister, oppgavetype, gjennomføring og visning i Oppgaver-fanen, tilpasset at private opphold har annen datamodell/skjema enn utleiebookinger. Eksempel: «Skru på varme». Ikke automatisk legg alle utleieoppgaver på privat. Ikke endre kode eller deploy nå; ta med i samlet forbedringspakke etter funksjonstest.


## Nye funn til samlet versjonsdiskusjon – 19.11.2026
Brukeren vil **samle alle forbedringsønsker og diskutere dem samlet før arbeid med neste versjon**. Ingen kodeendringer eller Netlify-publisering nå.

**Oversikt**
1. Ramme rundt de øverste prognosetallene, samme visuelle prinsipp som rammen under. Overskrift nøyaktig «Prognose år».
2. I rammen for «utbetalinger og skatt hittil i år»: del eksisterende felt «sum utbetalt + skatt» i to; nytt felt til høyre for «reell skatt i prosent». Brukeren oppgir «netto utbetalt / brutto-plattform». **Avklar formelen i felles gjennomgang**: dette uttrykket kan representere utbetalingsandel snarere enn skatteandel, og «brutto-plattform» må defineres presist. Ikke endre beregning uten avklaring.

**Bookinger**
3. Gjenopprett tidligere ikoner på bookingoversikt/-kort for stamp, hund, elbillading og sengetøy/håndklær når relevant.
4. Vis antall gjester på bookingkort i bookingoversikten.

**Tidligere avtalt forbedring:** «Privat booking» som eget valg i eksisterende oppgavemal-plattformvalg, uten å endre skjema ellers. «Alle plattformer» omfatter Finn.no, Airbnb, Booking.com og Direkte, **ikke** Privat booking. Private oppgaver skal genereres fra private opphold med hensyn til egen datastruktur.


## Presisering 19.11.2026 – reell privat skatt i prosent
Brukeren har avklart formelen for nytt nøkkeltall i Oversikt: **reell skatt (%) = faktisk beregnet skatt / (samlet brutto leieinntekt − samlede plattformgebyrer) × 100**. Telleren skal være eksisterende beregnet skattebeløp ut fra **samlet brutto** etter appens gjeldende skatteregler; plattformgebyrer skal IKKE behandles som skatt eller trekkes fra skattegrunnlaget i denne KPI-en. Nevneren er beløpet som står igjen etter plattformgebyrer, før skatt. Ulike plattformers praksis for gebyrutbetaling påvirker ikke denne definisjonen. Eksempel: brutto 100 000, gebyr 15 000, beregnet skatt 20 000 -> 23,5 %. Ved nevner 0/negativ: vis ikke prosent; avklar evt. visning ved samlet gjennomgang. Dette **erstatter** tidligere merknad om at formelen var uavklart. Ingen kodeendring eller deploy før samlet forbedringsdiskusjon.


## Presisering 19.11.2026 – prognoseramme på Oversikt
Når de øverste nøkkeltallene samles i rammen med overskrift «Prognose år», skal feltetiketten **«Bruttoinntekt / prognose» endres til «Bruttoinntekt»**. Dette er kun en tekstendring; eksisterende prognoseberegning og tallverdi beholdes uendret. Ta med i samlet forbedringsliste for neste versjon. Ingen kodeendring eller publisering nå.


---

# GJELDENDE STATUS – 18.11.2026 kl. 20:15 (les først)

**Milepæl: Neon TEST-integrert V16-app er publisert og åpner etter innlogging.** Brukeren viste skjermbilde fra https://skv138-neon-test.netlify.app med SKV138-grensesnittet, fem navigasjonsvalg (Oversikt, Bookinger, Oppgaver, Lager, Mer), og tom oversikt uten eksempelbookinger. Tidligere «Tilgang bekreftet»-skall er erstattet. Neon Auth, tilgangssjekk og innlasting av delt initialtilstand ble tidligere bekreftet; live skjermbilde viser at appen nå rendres. **Skriving/PUT og lagringspersistens er ennå IKKE funksjonstestet.** Ikke påstå full ende-til-ende godkjenning.

- Repo: `khelgevold/SKV138-test`; aktiv gren `feature/neon-test-integration`. Godkjent V16.23 i `main/index.html` er urørt. Ingen SKV138 PROD.
- Neon TEST `SKV138-TEST`, prosjekt-ID `lively-block-14962279`; tabeller `skv138_access`, `skv138_data`, `skv138_data_history`. Idempotent seed `database/seed-neon-test.sql` er **kjørt**. Standardinnstillinger, maler og plasseringer er beholdt, men ingen eksempelbookinger eller lagervarer.
- TEST frontend: `backend-draft/test-site/index.html` er innloggingsskall som oppretter `createV1623StateBridge` og laster `app.html` i iframe. `backend-draft/test-site/app.html` er en isolert kopi av V16.23 koblet til Neon-tilstand. Lagring går via `client-adapter.mjs`, `v1623-state-bridge.mjs` og `legacy-save-queue.mjs`, med versjonskontroll, 409-blokkering, nedlasting av recovery-data og advarsel ved navigasjon med ulagrede endringer. Ikke endre godkjent `main`.
- GitHub Actions: Brukerens skjermbilde viser grønne kjøringer for både `SKV138 backend draft tests` og `SKV138 Neon TEST checks` ved siste commit `6e45109`. Dette er automatiske tester, ikke bekreftelse på lagring i nettleseren.
- PC-skjermbildet viser mørkt tema, stor luft og navigasjon i innholdet, samt teksten «V16 · Lokal testprototype». Kodesammenligning viser at PC-navigasjonens plassering kommer fra den opprinnelige V16 CSS-en (`@media(min-width:650px)`), ikke en påvist feil i Neon-integrasjonen. Brukeren sier «alt er helt feil» visuelt; ikke anta at designet er godkjent eller start redesign uten konkret avklaring. Tidligere godkjent V16.23 var testet på iPhone.
- **Neste nødvendige steg etter PC-omstart:** Én målrettet funksjonstest i TEST på PC: opprett en testbooking, oppdater siden, logg eventuelt inn på nytt, og bekreft at bookingen fortsatt finnes. Test så en enkel redigering om nødvendig. Ikke gjenta auth/seed/CI-testene. Når lagring er bekreftet, avklar konkret hva brukeren mener er feil med PC-layout og kontroller mobilvisning én gang. Samle eventuelle UI-endringer før ny publisering. Fjern midlertidig JWT-diagnostikk ved relevant oppryddingsmilepæl, ikke som unødvendig enkeltdeploy.
- Arbeidsform: Gjør GitHub-arbeid selv, én nødvendig brukerhandling om gangen, minst mulig testing/Netlify-credits. Brukeren ønsket dokumentasjon og ny chat før PC-omstart. `utviklingsregler.md` gjelder; `parkeringsplassen.md` er uendret.

---

## 18.11.2026 – Live bekreftelse av initialisert TEST
- Brukeren kjørte `database/seed-neon-test.sql` med `Statement executed successfully` og viste deretter skjermbilde av TEST-siden med «Tilgang bekreftet». Dette verifiserer fungerende Neon Auth, backend-allowlist, lesing av gyldig `shared`-payload fra Neon TEST og fullført første initialisering. Ikke test denne kjeden på nytt uten relevant endring.
- Neste milepæl: koble V16.23-grensesnittet til felles GET/PUT. Nåværende TEST-side er bare et innloggingsskall. `index.html` i main skal forbli urørt. V16.23 har synkrone `save()`-kall til localStorage; integrasjonen må sørge for at servertilstand lastes **før** UI starter, og at feil/409 ikke gir falsk «lagret»-tilstand. Bevar enhetsspesifikt tema og separat plassering-kontrakt. Ikke publiser utestet kode.

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
