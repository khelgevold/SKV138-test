# SKV138 – ARBEIDSREGLER.md

**Opprettet:** 2026-11-16  
**Gjelder:** Alle fremtidige SKV138-chatter og versjoner.  
**Prioritet:** Brukerens nyeste eksplisitte instruksjon går foran dette dokumentet. Ved motstrid mellom dokumenter: avklar med brukeren, ikke gjett.

## 1. Prosjektisolasjon
- Arbeid kun i `khelgevold/SKV138-test` når SKV138 diskuteres, med mindre brukeren eksplisitt velger annet.
- Ikke endre eller blande inn Solåsen Padel, andre repositoryer, databaser, Netlify-sider eller prosjektdokumenter.
- Appnavn er **SKV138**; «Hytteøkonomi» er historisk navn.

## 2. Kostnader og verktøy
- **ALDRI bruk Netlify-credits til å opprette, redigere eller oppdatere `PROJECT.md`, `NY_CHAT_PROMPT.md` eller `ARBEIDSREGLER.md`.**
- Dokumentasjonsendringer skal gjøres **direkte i GitHub**, uten Netlify-bygg eller betalte deployverktøy.
- Bruk GitHub Pages som gratis testmiljø så lenge det dekker behovet.
- Ikke opprett eller aktiver betalte tjenester, AI-kall, databaser eller nye abonnementer uten å avklare behov og mulig kostnad med brukeren.
- Skill dokumentasjonsoppdatering fra app-publisering: en dokumentasjonscommit skal ikke kreve appbygging. GitHub Pages kan likevel automatisk kjøre en gratis publiseringsjobb når repositoryet endres; dette er ikke Netlify-credits.

## 3. Dokumentasjonsplikt
- `PROJECT.md`: funksjonalitet, status, versjonshistorikk, endringer, feilrettinger, testing, åpne feil og neste steg.
- `NY_CHAT_PROMPT.md`: oppdatert og direkte kopierbar oppstartsprompt som alltid samsvarer med gjeldende `PROJECT.md`.
- `ARBEIDSREGLER.md`: alle varige samarbeidsregler; oppdateres når vi avtaler nye eller endrede regler.
- Ved **hver ny appversjon** skal alle tre dokumentene gjennomgås og holdes konsistente. Dokumenter også små feilrettinger.
- Ikke påstå at dokumentasjon er oppdatert før commit er bekreftet. Oppgi gjerne commit/referanse.
- Ved ny chat: les alle tre dokumentene og faktisk kode før du foreslår endringer.

## 4. Arbeidsmetode
- Diskuter og avklar ønskede forbedringer før implementering når brukeren er i idé-/finpussfasen.
- Ta én avgrenset oppgave eller én avtalt samlet versjon om gangen.
- Bevar eksisterende funksjoner; ikke fjern eller endre urelatert funksjonalitet uten godkjenning.
- Gjør GitHub-arbeidet direkte gjennom tilgjengelig tilkobling der tillatelsene gir det; ikke be brukeren utføre unødvendige manuelle steg.
- Skill tydelig mellom planlagt, implementert, publisert og faktisk testet.
- Ikke lov at noe er fikset før det er kontrollert. Hvis et verktøy feiler, forklar feilen og ikke påstå suksess.
- Før risikable endringer: vurder reverserbarhet, commit-historikk og behov for sikkerhetskopi.
- Unngå unødvendige kredittkostnader og lange feilsøkingsløp uten målbar fremdrift.

## 5. Test og publisering
- Test på faktisk GitHub Pages-adresse i Safari/iPhone; lokal iOS-filforhåndsvisning er ikke pålitelig for JavaScript.
- Brukeren godkjenner funksjonelle endringer etter testing; en skjermvisning alene er ikke full regresjonstest.
- Gjeldende miljø er **test**, ikke produksjon.
- Ikke opprett produksjonsmiljø eller migrer data uten særskilt avtale.
- Ved feil: undersøk årsaken før du legger på flere tilfeldige overstyringer.

## 6. Personvern og sikkerhet
- Repositoryet og GitHub Pages er offentlige. Bruk bare fiktive testdata.
- Ikke legg inn ekte gjestenavn, telefonnumre, adgangskoder, hemmeligheter, private økonomiopplysninger eller API-nøkler.
- Ikke legg til reelle brukerdata før privat, egnet lagring/tilgangskontroll er etablert.
- Lokal lagring er ikke sikkerhetskopi og deles ikke mellom enheter.

## 7. Kommunikasjon
- Svar på norsk, konkret og uten unødvendig teknisk kompleksitet.
- Forklar hva som faktisk er gjort, hva som gjenstår og hva brukeren eventuelt må gjøre.
- Still bare nødvendige spørsmål. Prioriter forutsigbar fremdrift og lav brukerbelastning.

## 8. Arkitekturkrav som må huskes\n- Planlegg for **maksimalt to innloggede brukere med felles, sikker datalagring** før reelle data brukes. Ikke forveksle lokal nettleserlagring med delt database eller klientbasert skjuling med sikker innlogging.\n- Gjenbruk eksisterende **Homey-app som leser iCal**; planlegg en dynamisk, personvernvennlig feed med både utleie og privat bruk, ikke ny Homey-integrasjon uten behov.\n- Disse kravene er planlagt og **ikke implementert i V15.1**.\n\n## 9. Regelendringer
Nye regler som brukeren uttrykkelig godkjenner, legges inn her og tas med i `NY_CHAT_PROMPT.md` ved neste synkronisering. Ikke finn på nye bindende regler uten å merke dem som forslag.


## V16-status
Reglene er gjennomgått ved første V16-kodecommit `2cde050` og videreføres uendret. Innlogging og dynamisk iCal skal ikke bygges som del av denne finpussrunden.

V16 del 2 `f58b02f`: arbeidsreglene videreføres uten endring; iCal og innlogging er fortsatt utsatt.

V16.2 commit `e6bdd6f`: kalender to-trykks datoperiode (start og slutt), opprett booking med forhåndsutfylte datoer, tilbakeknapp fra utleiebooking åpnet i kalender og retur etter lagring av ny utleiebooking. Ikke iPhone-testet. Privat booking-redigering og returflyt trenger fortsatt kontroll. Eksisterende iCal-feed/innlogging utsatt.

V16.3 commit `5686094`: private booking/opphold har tilbakeknapp til kildefane, retur ved vellykket lagring/sletting, og kalendervalgt utleieperiode valideres mot minimum 2 netter. Kode er ikke iPhone-testet. Gjenstår: full egen bookingvisning, kronologisk oppgavegruppering, privatlager/plasseringer, netto-statistikk, innstillingsfinpuss og samlet test. iCal og innlogging utsatt.

V16.4 commit `401edd9`: Oppgaver grupperes i rammer for sammenhengende oppgaver fra samme booking uten å endre kronologisk rekkefølge. Gjestenavn/plattform vises i gruppeoverskrift, oppgavehandlinger beholdt. Ikke testet på iPhone. Neste prioritet: Privat lager med plasseringer; deretter bookingliste, statistikk, innstillinger og samlet regresjonstest.

V16.5 commit `92d89df`: Privat lager har plassering på varer, forhåndsvalg og egendefinerte plasseringer, redigering og visning av plassering. Minimumsbeholdning og fast-vare gjelder bare Utleie. Eksisterende private varer uten plassering vises som «Ikke angitt» til de redigeres. Ikke iPhone-testet. Neste: bookingliste/navigasjon, statistikk, innstillinger og samlet test.

V16.6 commit `4ca1d06`: Bookinger viser hele trykkbare kort (uten Åpne-knapp), tidsfilter Aktuelle/Tidligere/Kansellerte, kansellerte kort i grått, og bookingdetaljer/redigering skjuler bookinglisten slik at visningen fremstår separat med tilbakeknapp. Antall gjester 1–8 som nedtrekksliste. Ikke iPhone-testet; kontroll av lagre/avbryt/kalenderretur og øvrige avtalte funksjoner gjenstår. Statistikk og innstillinger er neste hovedområder.

V16.7 commit `7cdb06f`: global brutto/netto-etter-estimert-skatt bryter i Statistikk (netto standard), ekstra skattemetrikker, måneds-/plattform-/snittpris-/årssammenligning følger bryteren, prosentvis årsendring, fjernet hjelpetekst under hyttebruk. Rettet manglende akkumulering av kanselleringsinntekt per plattform i eldre statistikkfunksjon. Skatteberegning og proporsjonal allokering er foreløpige og ikke verifisert mot norske regler. Ikke iPhone-testet. Neste: Innstillinger, gjennomgang av V16-overstyringer og samlet test.

V16.8 commit `2671b93`: Innstillinger har uavhengige details-akkordioner (lukket ved førstegangsvisning), mobiltilpassede feltbredder og knapper, samt justert oppgaveregel-layout. Ingen funksjonstest på iPhone. Viktig før test: teknisk gjennomgang av JS-overstyringer, spesielt bookinger, kalender, privatopphold og lager; sikre at innstillingspanelenes eksisterende funksjoner virker i akkordioner. Ikke ta V16 som godkjent. Innlogging og dynamisk iCal er utsatt.

V16.9 commit `8731e49`: erstattet små Unicode-symboler i bunnmenyen med seks distinkte SVG-ikoner (27 px mobil, 30 px bred skjerm), tydeligere aktiv fane og beholdt seks faner. Topptekst endret fra V15.1 til V16. Fjernet overflødig hjelpetekst under «Utbetalinger og skatt hittil i år». Basert på brukerens iPhone-skjermbilde; ikke verifisert på telefon etter endring. Teknisk regresjonstest gjenstår.

## V16.10 – samlet rettingspakke (2026-11-18)
Kodecommit `b3f01f11af9c6db7fa6683a1271aeac6ca13eff9`. Implementert: to kompakte bookingfiltre (periode/type), nytt dokumentikon for Bookinger, omvendt kronologi for Fullførte, mer kompakt Lager-visning med små redigeringsknapper, plattformstatistikk beregnet fra registrerte bookinger (ikke avhengig av utbetaling), kalenderens dato-klikk og intervallkontroll, opprydding av hjelpetekster og Utseende i Innstillinger, samt CSS for mobile felt og regelknapper. Viktig: Endringene er ikke verifisert med iPhone eller automatisert nettlesertest. Kontroller spesielt kalenderdatovalg, privat/utleiebooking, redigering av lagerplassering, pris-/gebyrfelter, lagring, avbryt, retur, statistikk og alle innstillingspaneler. Behold lokalStorage-data; ikke tilbakestill. Brukeren krever en siste fullstendig gjennomgang fane for fane etter publisering før V16 kan godkjennes. Ingen innlogging eller dynamisk iCal i V16.

### V16.11 – Oversikt (2026-11-18)
Kodecommit `15cbd68bdc7c463aa5bbb5107ea940416a913b6a`: beløpskortene på Oversikt er gjort lavere med større beløp og mer lesbare etiketter. Under «Neste oppgaver» fjernes den ekstra bookinglinjen over oppgavene når oppgaver finnes. Kun oppgaver for neste aktive/kommende booking vises, med eksisterende «Se alle»-knapp. Må bekreftes på iPhone; ingen data er nullstilt.

### V16.12 – Kalender og bookingdetaljer
Kodecommit `eb46cf6`: kalenderdato-knapper får ny klikkhåndtering etter at gammel inline-handler er fjernet (retting av regresjon ved datovalg). Doble tilbakeknapper i bookingdetaljer fjernes; årsfordeling skjules for booking innen samme kalenderår; utbetalingsseksjonen komprimeres og presiserer mottatt beløp etter plattformgebyr, før skatt; meldingsrader får venstre/høyre-justering. Oversikt godkjent av bruker. Bookinger visuelt godkjent, men «Aktuelle» skal endres til «Kommende» i samlet tekstjustering. V16.12 må testes på iPhone før godkjenning.

### V16.13 – bookingformularer (2026-11-18)
Kodecommit `d080867`: Ved åpning av privatopphold skjules bookinglisten og eksisterende bookingdetaljer slik at skjemaet står alene. Ved lukking gjenopprettes visningene. Nye og redigerte utleiebookinger og private opphold rulles til toppen. Dato-/klokkeslettfelter gis begrenset bredde, mindre mobilskrift og korrekt min-width i to kolonner. To-datovalg i kalender bekreftet fungerende av bruker. Ikke ennå iPhone-verifisert for skjemarettelsene.

### V16.14 (2026-11-18)
Kodecommit `318bcfc`: Ny utleiebooking åpnet fra kalender får «Tilbake til kalender» og går faktisk tilbake dit. Fra Bookinger returnerer tilbakeknappen til Bookinger. For å unngå iOS/Safari-overlapp er ankomst, avreise, innsjekk og utsjekk i én kolonne på mobil (full bredde). Dette må bekreftes på iPhone. Brukeren bekreftet at V16.13 åpner private/utleieskjema uten støy, men at feltbredde og retur fra utleieskjema fortsatt var feil.

### V16.15 (2026-11-18)
Kodecommit `c837837`: Bruker ønsker ankomst/avreise og innsjekk/utsjekk side om side på mobil. Gjeninnført to like brede kolonner i både privat- og utleieskjema, med kompakt iOS Safari-dato-/tidskontroll (redusert padding/font, min-width 0). Må kontrolleres på iPhone for eventuell avklipping. Retur til kalender fra V16.14 beholdt.

### V16.16 (2026-11-18)
Kodecommit `a26dfba`: Samme ikoner for alle fire tilvalg i skjema for utleiebooking: ♨️ Stamp, ⚡ Elbillading, 🛏️ Sengetøy/håndklær og 🐕 Hund. Ikonene i bookingdetaljer beholdes. Brukeren bekreftet at dato-/tidsfeltene i V16.15 er mye bedre. Ikke ny funksjonalitet.

## V16.17 – samlet testrelease (2026-11-18)
Kodecommit `5ffc7c047426594f30f4a9f0f77f0712fb4d3803`. Implementert i `index.html`: bookingdetaljer med tre kompakte økonomibeløp, utbetaling som statusrad med redigerbart skjema, meldingsknapper til høyre; oppgaver med dato/tid på overskriftslinje og fullførthake; kompakt lagerliste og ny-vare-skjema flyttet over listen; privatlager har én plassering per vare, og Innstillinger har administrasjon av plasseringer (legge til, gi nytt navn, slette ubrukt). Utseende-seksjonen fjernes og utvalgte hjelpetekster ryddes bort; mobilfelt for standardtid gis full bredde. Eksisterende data beholdes, ingen reset. VIKTIG: Ikke bekreftet iPhone-test eller nettleserregresjonstest. Plasseringene lagres i nettleserens localStorage som egen liste; privatvarenes plassering lagres i eksisterende app-state. Bruker har godkjent Oversikt, Kalender og Statistikk og ønsker sluttkontroll av Bookinger, Oppgaver, Lager og Innstillinger. Kontroller spesielt skjemaer, utbetalingslagring, kopiering, oppgavehandlinger, vareendring og innstillingspaneler. Ikke erklær V16 ferdig før brukergodkjenning.

## V16.18 – korrigeringsrelease (18.11.2026)
Commit `ac7bf56dc894a30c11adba7f07e789cb6a5f7c25`: Bookinger: utbetaling registreres med bare dato; beløpet tas fra bookingens netto og lagres som eget tall; eksisterende registrering beholder lagret beløp ved datoendring; angre støttes. Lager: tolinjers varevisning, én plasseringstekst, redigeringsblyant på raden med teller; ny-vare-felter skjult bak + Ny vare. Innstillinger: fjern Utseende-ramme, luft øverst, tidspunktsfelter i én kolonne, oppgaveregler med detaljer bak utvidbar tittel, Totalpris som fjerde kolonne i Anbefalte priser. Oversikt, Kalender, Oppgaver og Statistikk er godkjent og skal ikke endres. Testrelease er ikke sluttgodkjent: kontroller spesielt iPhone-visning, funksjoner for registrering/angre, lagervare-redigering og prisberegning. Ikke publiser prod uten særskilt godkjenning.

## V16.19 – korrigeringsrelease 18.11.2026
GitHub-kodecommit `d74094435fcd6b717203ac4cae8315bcfec3fbf5` (etter første V16.19-commit). Bookinger: periodeetikett «Kommende» i stedet for «Aktuelle», og beholdt datobasert utbetalingsregistrering fra V16.18. Lager Privat: reparert synlig «+ Ny vare»-knapp, én plasseringstekst under varenavn, og ny vare/redigering med administrert plassering uten gammelt obligatorisk felt. Innstillinger: fjernet Utseende-ramme i HTML, fjernet «Redigerer: ...» i sjekklistemaler, fjernet infotekst i Utleievarer og rabattavsnitt, åpnet Plattformgebyrer direkte i egen ramme uten knapp, lagt luft til Ny meldingsmal og mobiljusteringer. Må fortsatt testes på iPhone før godkjenning, særlig alle 11 punkter, skjema for privat vare, dato-utbetaling, innstillingsfelter, og beregninger. Godkjente faner må ikke endres uten ny avtale.

## V16.20 – kompakt siste UI-justering (18.11.2026)
Commit `928ad004170befcc69bb1878722c0a02e2ef48cb`: Privatlager: lukket Ny vare-panel vises som bare knapp uten stor ramme; åpnet panel viser felter; plasseringsetikett hentes fra lagret vare og vises én gang under navn (hvis plassering finnes). Bookinger: kompakt utbetalingsrad med status og knapp på samme linje, ingen egen innrammet stor boks; datobasert registrering fra V16.18 beholdes. Innstillinger/Plattformgebyrer: hvert gebyr har navn og slett i topp, redigerbare felter i 2x2 grid (Navn/Gebyrverdi, Type/Grunnlag). Alle øvrige godkjente faner skal forbli uendret. Ikke testet på iPhone ennå; brukeren må kontrollere Ny vare, eksisterende plassering, gebyrendringer, utbetalingsdato/lagring og skjermbredde før godkjenning.

## V16.21 – retting av faktisk årsak til Privatlager-feil (18.11.2026)
Commit `9065dce26408c917a5719ef94087d58e56fad256`: eldre V11-kode setter dynamisk ID `stockAddCard` og oppretter knappen `privateAddToggle`; nyere V16.18–20 forsøkte feilaktig å styre ikke-eksisterende `v1619StockAdd`. V16.5 oppretter også et eget plasseringsfelt `v16AddLocationHost`, og ulike lag skapte duplisert/åpent felt. V16.21 bruker de faktiske ID-ene, viser bare knappen når skjemaet er lukket, skjuler eldre felt til åpning, fjerner duplisert nyere plasseringselement og forsøker å vise lagret `item.location` under riktig varenavn. Hvis eldre vare mangler lagret location, skal brukeren velge plassering via redigering; ikke tilordne Kjøleskap uten bekreftelse. Bookinger/Plattformgebyrer godkjent i V16.20. iPhone-kontroll av Lager Privat gjenstår.

## V16.22 – Privatlagerskjema (18.11.2026)
Commit `a8815f530bef4351408beef47f1fbe99f3fa3e31`: For Lager → Privat skjules minimumsbeholdning og Fast vare; feltet «Ny plassering» (fritekst) fjernes; nedtrekkslisten for plassering bruker kun administrerte steder fra Innstillinger. Opprettelse av privat vare bruker navn, antall og valgt plassering, lagrer med `min:0`, `fixed:false`, lukker skjemaet etter lagring. Utleie uendret. Test på iPhone gjenstår. Bookinger og Plattformgebyrer allerede godkjent.
