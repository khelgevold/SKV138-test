# AVTALT TIL NESTE SAMLEDE TEST-RELEASE – 23.11.2026

1. **Privatopphold i kalender:** Bruker rapporterer at privat booking ikke vises. `v10Stays()` inkluderer `state.privateStays`, og siste `renderCalendar()` bygger bånd av disse, så undersøk konkret feil i datatilstand/rendering/CSS, rett og regresjonstest. Privatopphold skal vises tydelig og kunne åpnes/redigeres fra kalenderen.
2. **Automatisk plattformgebyr ved opprettelse av Airbnb/Booking.com-booking:** Koble eksisterende `state.priceConfig.fees` (komponenter med `kind` prosent/fast og `base` total/natt/vask) til bookingformular. Beregn fra registrerte satser, vis beregnet beløp, tillat manuell overstyring og behold lagret faktisk gebyr på booking. Legg til gebyrperioder med «gjeldende fra» og vis historiske perioder; eksisterende bookinger skal ikke endres retroaktivt. Avklar hvilken dato som velger sats (innsjekk vs bookingdato) ved implementasjon. Ta hensyn til at Booking.com kan ha vask inkludert i nattpris.
3. **Pushvarsler:** Fortsett pågående TEST-arbeid; SQL-tabeller opprettet i Neon TEST ifølge bruker, VAPID/Netlify TEST konfig og funksjonstest gjenstår. Ingen PROD før bruker godkjenner.

Alle tre endringer skal samles i én TEST-release. Ikke start Netlify-deploy uten eksplisitt godkjenning.

---
# AKTIV PRIORITET – 21.11.2026

Pushvarsler er flyttet fra utsatt til aktiv TEST-utvikling. Kun til eierens konto; kun oppgaver; på/av og ledetid per oppgaveregel; ett varsel per oppgave; ikke for fullførte/kansellerte. Fase 1 innstillinger kodet i TEST `0f6ce77`, ikke publisert, ingen varsler sendes ennå. Dynamisk iCal fortsatt utsatt.

---
# Parkeringsplassen – SKV138
Opprettet: 2026-11-18.

Her registreres utviklingsønsker som er diskutert og avtalt utsatt. Dette er ikke en liste over feil i godkjent V16.23.

| Ønske | Status | Kommentar |
|---|---|---|
| Pushvarsler | Utsatt / prioritet 1 | Først etter at øvrig Neon TEST er funksjonelt og visuelt godkjent. |
| Dynamisk iCal-abonnementsfeed for Homey | Utsatt / prioritet 2 | Gjenbruk eksisterende Homey-app som leser iCal; omfatte utleie og privat bruk. Ingen manuell ICS-eksport er avtalt; dynamisk iCal vurderes senere. |

## Ikke parkeringsplass – neste aktive fase
- Neon TEST: funksjonell QA F01–F06 og sluttkontroll 3/3 godkjent 19.11.2026. Se nyeste `project.md`.
- Senere: eget PROD-miljø og kontrollert produksjonssetting etter testing/godkjenning.

Legg kun til ønsker som brukeren har godkjent for senere vurdering. Fjern eller merk som gjennomført når de implementeres.

## Godkjent design – iPhone-ikon (21.11.2026)

Brukeren har godkjent siste genererte SKV138-ikon: mørk blå vinternatt, hytta med faktisk bygningsform (sort kledning, bratt saltak, høy glassgavl, sideinngang), tydelig mer snø på tak og terreng, varm vindusbelysning og teksten «SKV138». Originalbildet er generert i ChatGPT-samtalen 21.11.2026, 1254 × 1254 PNG. **Selve PNG-filen er ennå ikke lastet opp til GitHub**; den må legges inn som bildeasset før implementasjon. Bruk ikonet som apple-touch-icon/PWA-ikon i neste samlede TEST-versjon, og kontroller iPhone-hjemskjerm. Headerbilde er utsatt og skal ikke inkluderes nå.
