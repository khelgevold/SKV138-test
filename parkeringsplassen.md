# AVKLARING – DIREKTE BOOKINGER

Godkjent: Direkte utleiebookinger har 0 % bekreftet inntekt før innsjekk som standard, med manuell avkryssing «Bekreft inntekten» per booking for 100 %. Automatisk 100 % ved innsjekk. Hele forventede nettoinntekten inngår i prognosen uansett. Private opphold holdes utenfor. Avbestillingsregler ferdig avklart.

---
# AVKLARING – GYLDIGHET AV AVBESTILLINGSREGLER

Bruker godkjenner at dagens avbestillingsregler også gjelder eksisterende bookinger, inkludert bookinger uten registrert bookingdato. Fremtidige regelendringer får egne gyldighetsdatoer basert på bookingdato. Dette er uavhengig av gebyrberegningens startdato 01.01.2027.

---
# AVKLARING – AVBESTILLINGSREGLER

Bruker bekrefter tidligere gjennomgåtte regler for Airbnb, Booking.com og FINN: Airbnb 0/50/100 % ved 30 og 7 dagers grenser, Booking.com 0/100 % ved 30 dager, FINN 0/50/100 % ved 30 og 14 dager. Prosent angir beholdt brutto ved avbestilling. Bruk opprinnelige vilkårsbeskrivelser for eksakte grenseverdier og tidspunkt. Historiske regelsett basert på bookingdato. Direkte og første gyldighetsdato gjenstår å avklare.

---
# AVTALT NESTE TEST-RELEASE – LEVENDE ICAL FOR HOMEY

Erstatt manuell iCal-eksport med permanent HTTPS .ics-feed generert ved forespørsel fra Neon via Netlify. Én hemmelig, tilbakekallbar kalenderadresse med kopi-ikon under Innstillinger. Alle aktive utleiebookinger og privatopphold, eksakte innsjekk-/utsjekktider (Europe/Oslo), stabile UID-er, kun plattformnavn som tittel, ingen person- eller økonomidata. Kansellerte opphold utelates. Ingen import/eksport mot Airbnb, Booking.com eller FINN, ingen periodisk jobb på vår side. Bruker har fungerende Homey iCal-integrasjon med manuelt vedlikeholdt Google-kalender; hensikten er å erstatte denne og unngå dobbeltregistrering. Test feed, oppdateringsfrekvens og kompatibilitet med eksisterende Homey-flows før Google-kalender kobles fra. TEST/PROD må ha separate nøkler og data. Samles i neste TEST-release; ingen deploy nå.

---
# AVKLARING – PLATTFORMGEBYR FRA 01.01.2027

Bruker ønsker første automatiske gebyrperiode fra 01.01.2027, basert på bookingdato (ikke innsjekk). Bookingdato før dette: manuelt gebyr. Fra datoen: automatisk beregning fra historisk gyldig gebyrperiode, med manuell overstyring. Airbnb og Booking.com bruker registrerte satser; FINN skal også omfattes med startsats 0 %. Gjør løsningen plattformuavhengig, Direkte kan ha 0 % som standard. Behold eksisterende lagrede gebyrer uten retroaktiv omberegning. Neste samlede TEST-release.

---
# HANDLELISTE – KOPIER TIL UTKLIPPSTAVLE

Neste TEST-release: kopi-ikon øverst til høyre på Handleliste. Kopier alle gjenstående varer, både automatiske og manuelle, med aktuelt antall som ren tekst, én vare per linje i format `6 × Kvikk Lunsj`, egnet for Google Keep, Notater og SMS. Vis kort bekreftelse «Handleliste kopiert» ved vellykket kopiering. Ingen deploy nå.

---
# NESTE TEST-RELEASE – HANDLELISTE OG ENKLERE PRIVATLAGER

Bruker ønsker tredje fane Handleliste under Lager ved siden av Utleie og Privat. Utleievarer under minimum skal automatisk vises på handlelisten; foreslått antall er minimum minus beholdning, med manuell justering. Manuelle handlevarer via permanent åpent tekstfelt nederst, standard antall 1, justerbart. Forslag: avhuking som handlet øker utleiebeholdning for automatisk koblede varer, manuelle varer fjernes uten lagerendring; unngå duplikater og behold automatisk restbehov dersom innkjøp ikke dekker minimum. Privat: erstatt Ny vare-knapp med tilsvarende åpent felt nederst, standard antall 1; plassering valgfritt via blyant etter opprettelse, behold eksisterende plasseringer. Behold eksisterende visuell stil. Samles i neste TEST-release; ingen deploy nå.

---
# AVTALT NESTE TEST-RELEASE – BETINGEDE OPPGAVEREGLER

Legg til Betingelse på eksisterende oppgaveregler: Alltid (standard for eksisterende regler), Stamp, Sengetøy/håndklær, Hund, Elbillading. Oppgaver genereres kun ved samsvar med bookingens avhuking og øvrige regelvilkår. Behold navn, plattform, frist før/etter innsjekk/utsjekk og pushinnstillinger. Fjernes avhuking, forsvinner ufullført oppgave; bevar fullført historikk. Bruk samme betingelseslogikk i klient og automatisk push-sender, slik at irrelevante varsler ikke sendes. Samles i neste TEST-release; ingen deploy nå.

---
# OVERSIKT SOM REN ØKONOMISIDE – 24.11.2026

Bruker ønsker i neste TEST-release: øverst på Oversikt/Hjem bekreftede kommende inntekter med horisontalt stolpediagram fordelt på plattform. Deretter utbetalte inntekter, deretter prognose. Fjern oppgavevisning fra Hjem; behold Oppgaver-fanen og pushfunksjonalitet. Forslag til beregningsprinsipp: estimert ikke-refunderbar nettoinntekt som ikke er utbetalt, faktisk registrerte utbetalinger, prognose uten dobbelttelling. Oppdater beregning etter avbestillingsfrister. Behold eksisterende årsvalg og øvrige relevante økonomifunksjoner; avklar detaljvisning ved behov. Ingen deploy nå.

---
# NESTE TEST-RELEASE – BEKREFTEDE INNTEKTER – 24.11.2026

Bruker ønsker bekreftede inntekter basert på avbestillingsregler. Plassering og fremstilling avklares senere av bruker. Skjermbilder: antatt Booking.com: gratis inntil 30 døgn før innsjekk, totalpris ved avbestilling innen 30 døgn; Airbnb Begrensede, kortvarige opphold under 28 netter: full refusjon minst 30 dager før innsjekkingstidspunkt, 50 % refusjon 7–30 dager før, ingen deretter; antatt FINN Moderat: full refusjon mer enn 30 dager før innsjekksdato, 50 % 14–30 dager før, ingen under 14 dager. Bekreft plattformtilordning for første og tredje bilde samt eksakte grensevilkår før implementasjon. Forslag: historiske regelperioder basert på bookingdato, skille estimert ikke-refunderbar nettoinntekt fra faktisk utbetalt, hensynta gebyrer og eventuelle unntak. Ikke implementer visning før bruker har avklart hvor/hvordan. Samles med push, privatopphold åpning og automatisk plattformgebyr i neste TEST-release.

---
# KORRIGERT FEILBESKRIVELSE – 23.11.2026

Brukeren bekrefter at privatopphold **allerede vises riktig i kalenderen**; tidligere rapport skyldtes feil dato ved opprettelse. Reell feil: trykk på privatopphold gjør ingenting både i kalender og bookingoversikt. Rett åpning til detaljer/redigering/sletting fra begge steder i neste TEST-release. Ikke bruk tid på å reparere visning som allerede virker. I koden peker `openCalendarStay('private',id)` til `editPrivateStay(id)` og `privateStayForm` kaller `show('kalender')`; undersøk særlig navigasjon/elementtilgjengelighet og hendelser. Ikke deploy før samlet TEST-release godkjennes.

---
# AVKLARING 23.11.2026 – HISTORISKE PLATTFORMGEBYRER

Bruker har besluttet at **bookingdato** (datoen bestillingen ble gjort) avgjør hvilken gebyrperiode som brukes, **ikke innsjekkdato**. Ny booking må derfor ha lagret bookingdato; for eldre bookinger uten bookingdato må vi unngå å gjette og beholde deres eksisterende lagrede gebyr. Gebyrperiode med «gjeldende fra» velges ut fra bookingdato. Lagret gebyrbeløp på eksisterende bookinger skal ikke endres retroaktivt. Samles med privatopphold i kalender og push i neste TEST-release.

---
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
