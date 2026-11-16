# SKV138 – PROJECT.md

**Sist oppdatert:** 2026-11-16  
**Gjeldende testversjon:** V16 (delvis implementert, ikke iPhone-testet)  
**Miljø:** GitHub Pages, `main` → `/ (root)`  
**Test-URL:** https://khelgevold.github.io/SKV138-test/  
**Repository:** https://github.com/khelgevold/SKV138-test  
**Status:** Publisert og grunnleggende iPhone-test bestått. Finpussrunde planlagt; ingen endringer etter V15.1 er besluttet.

> Dette dokumentet er prosjektets løpende sannhetskilde. Oppdater ved hver kodeendring/versjon, inkludert feilrettinger, hva som er testet, utestående arbeid og eventuelle avvik. Les også `ARBEIDSREGLER.md` og `NY_CHAT_PROMPT.md`.

## 1. Formål og rammer

SKV138 er en privat, norskspråklig webapp for administrasjon av en utleiehytte i Sirdal: bookinger, privat bruk, kalender, økonomi, oppgaver, lager, statistikk og innstillinger. Prosjektet het tidligere «Hytteøkonomi», men appnavnet er nå **SKV138**. Repositoryet heter `SKV138-test`.

**Viktig teknisk avgrensning:** V15.1 er én selvstendig `index.html` med HTML/CSS/JavaScript og lokal lagring (`localStorage`, med fallback ved manglende lagring). Dette er en **testprototype**, ikke en ferdig produksjonsapp. Ingen SKV138-database, innlogging, sanntidssynkronisering eller automatisk Homey-integrasjon er etablert. Lokale data på én enhet deles ikke med andre enheter. Offentlig GitHub Pages gir ikke privat tilgangskontroll.

## 2. Gjeldende navigasjon og funksjoner

### Oversikt
- Årsvelger og nøkkeltall: bruttoinntekt/prognose, plattformgebyrer, estimert skatt og netto etter skatt.
- V15: egne tall for «Utbetalt hittil i år», «Estimert skatt hittil i år» og summen. Utbetalinger registreres manuelt per booking med beløp og dato; kan redigeres/reverseres.
- Skiller forventet inntekt, opptjent inntekt og faktisk utbetaling. Inntekt over årsskifte fordeles etter utleiedøgn; utbetaling føres på faktisk dato.
- Relevante kommende oppgaver, med prioritet til aktiv/nærmeste booking.

### Bookinger
- Utleie- og privatbookinger; filtrering, redigering og avbestilling.
- Gjestenavn, antall personer, plattform, ankomst/avreise med klokkeslett (standard 16:00/12:00), beløp, gebyrer, tillegg og notater.
- Minimum to netter for utleie, ikke for privat bruk.
- Tidsbasert kontroll mot overlapp; samme dag kan være utsjekk/innsjekk dersom tidene ikke kolliderer.
- Avbestilling kan omfatte delvis refusjon.
- Plattformfarger: FINN lyseblå, Booking.com mørkeblå, Airbnb korall, privat grønn, direkte grå.
- Bookingmarkører for stamp, sengetøy/håndklær, lading og hund.

### Kalender
- Månedsvisning med kompakte ukedager og sammenhengende fargebånd for opphold.
- Ankomst/avreise illustreres som deldager; navn vises én gang per bånd; bånd kan åpne booking.
- Trykk på ledig dato kan starte booking. Privat bruk vises grønt.

### Oppgaver
- Kommende/utførte/alle, med manuell fullføring og angre.
- Sjekklister før ankomst og etter avreise.
- Regler for automatisk generering basert på plattform, ankomst/avreise, forskyvning, aktiv-status og melding.
- Endringer i bookinger skal oppdatere oppgaver; avbestilling skal fjerne fremtidige oppgaver.
- iPhone-pushvarsler er fremtidig funksjon, ikke aktivt.

### Lager
- Utleievarer med antall, terskel for lav beholdning og synlighet.
- Private varer med fleksibelt antall og automatisk skjuling ved null.
- Katalog for utleievarer administreres via Innstillinger.

### Mer / Statistikk
- Års-/månedsoversikter, brutto/netto, gebyrer, utleiedøgn, gjester, belegg, snittpris, plattformfordeling, avbestillinger og årssammenligning.
- Skille mellom prognose og opptjent inntekt er viktig.

### Mer / Innstillinger
- Seksjoner sammenfoldet som standard, flere kan åpnes samtidig.
- Generelle standarder, priskalkulator, gebyrer, oppgaveregler, sjekklister, meldingstekster, utleievarekatalog, skatt, lys/mørk/automatisk visning og iCal.
- Priskalkulator: ønsket netto per natt og vask, minst to netter, plattformspesifikke gebyrer og håndtering av vask separat eller inkludert.
- FINN/Airbnb har normalt separat vask; Booking.com inkluderer vask i nattpris. Konfigurerbare rabattnivåer for lengre opphold.

### iCal
- V15: lokal `.ics`-eksport av aktive utleie- og privatopphold med korrekt tidssone Europe/Oslo og stabile hendelses-ID-er.
- Hendelsestittel viser kun plattform, ikke gjestenavn. Avbestilte bookinger utelates.
- Automatisk abonnementsfeed/Homey-styring er **ikke** implementert.

## 3. Versjonshistorikk

| Versjon | Dokumentert innhold/status |
|---|---|
| V1–V14 | Gradvis utbygging av bookinger, økonomi, kalender, oppgaver, lager, statistikk, innstillinger, prislogikk, tema og mobiltilpasning. Enkeltdetaljer må kontrolleres mot tidligere prosjektlogg ved behov; ikke dikt opp commit-historikk. |
| V14 | Innstillingsseksjoner sammenfoldet som standard. |
| V15 | Manuell utbetalingsregistrering og utbetalings-/skattetall hittil i år; hundemarkør; lokal iCal-eksport. |
| V15.1 | Forsøk på bedre håndtering av lokal lagring i forhåndsvisning. Lokal iPhone-filvisning viste fremdeles manglende dynamisk innhold. |
| V15.1 – publisering | 2026-11-16: `index.html` publisert til GitHub Pages. iPhone-skjermbilde bekreftet at år 2026, økonomitall, utbetalingspanel og bunnnavigasjon rendres. Bruker bekreftet at Bookinger åpnes og fungerer. Dermed sannsynliggjøres at tidligere problem skyldtes filforhåndsvisningen. Ingen påstand om full funksjonstest. |

**Publiseringscommit:** `6f0bfe78095dbe0aa1dd17d417782cff5ec26e47` (før dokumentasjonscommitene).

## 4. Bekreftet teststatus

- [x] GitHub Pages viser appen på iPhone.
- [x] Årstall, økonomitall og bunnnavigasjon vises.
- [x] Bruker har åpnet Bookinger og bekreftet at det fungerer.
- [ ] Full test av opprett/rediger/slett/avbestill booking.
- [ ] Full test av kalender, oppgaver, lager, statistikk, innstillinger, iCal og priskalkulator.
- [ ] Verifisere lagring etter lukking/oppfriskning og ulike iPhone/Safari-visninger.
- [ ] Kontrollere skatteberegning mot gjeldende norske regler før reell bruk.

## 5. Kjente begrensninger og risiko

- Data lagres lokalt i nettleseren. Ingen sikkerhetskopi/synkronisering på tvers av enheter.
- GitHub Pages-repositoryet er offentlig: ingen ekte gjestedata, private notater, adgangskoder eller hemmelige nøkler i kildekoden.
- HTML-filen har akkumulert flere versjonslag/overstyringer. Bør refaktoreres forsiktig, med regresjonstesting.
- Ikke anta at iCal-abonnement, Homey, varsler, autentisering eller backend er aktive.
- Skatteforutsetninger i prototypen er foreløpige; må kvalitetssikres.

## 6. Neste arbeid

**Aktiv fase: finpuss før videre funksjonsutvikling.** Gå gjennom én seksjon om gangen: Oversikt → Bookinger/Kalender → Oppgaver/Lager → Statistikk/Innstillinger. Samle beslutninger og endringer, gjennomfør kontrollert versjon, test på iPhone og dokumenter resultat. Ingen konkrete finpussendringer er vedtatt ennå.

## 7. Prosess for hver versjon

1. Les `PROJECT.md`, `ARBEIDSREGLER.md` og `NY_CHAT_PROMPT.md`, og kontroller faktisk kode på `main`.
2. Avklar om endringen er ønsket og hvilket omfang den har; noter beslutning.
3. Gjør endringen i riktig repository. Bevar eksisterende funksjonalitet.
4. Kontroller syntaks/at appen laster; be om nødvendig brukerbasert iPhone-test.
5. Oppdater **alle tre dokumenter i samme versjonsrunde**: historikk/status her, oppstartsprompt og arbeidsregler ved behov (bekreft også uendrede regler).
6. Oppgi commit, teststatus, hva som er endret og hva som gjenstår. Ikke påstå testet funksjonalitet uten bevis.

**Merk:** Dokumentasjonsendringer alene er ikke en ny appversjon og skal ikke utløse Netlify-bruk.

## 8. Nye krav avklart 2026-11-16 – planlagt, ikke implementert

### Innlogging og delt lagring
- SKV138 skal støtte **maksimalt to innloggede brukerkontoer**. Ingen behov for åpen registrering eller omfattende administrasjon.
- Begge skal kunne arbeide med **samme bookinger, kalender, oppgaver og økonomidata** på tvers av enheter; sikker autentisering og sentral datalagring må planlegges før ekte data tas i bruk.
- Teknologivalg, tilgangsroller, passordhåndtering og datamigrering er **ikke avklart**. Ikke implementer falsk klientbasert innlogging som om den sikrer offentlig GitHub Pages.

### iCal-feed til eksisterende Homey-app
- Brukeren har **allerede en Homey-app som leser iCal** og bruker opphold til styring av lys og varme.
- SKV138 skal på sikt eksponere en **stabil abonnementsadresse for iCal** som denne Homey-appen kan lese. Eksisterende Homey-oppsett skal gjenbrukes fremfor å bygge ny Homey-integrasjon uten behov.
- Både **utleiebookinger og privat bruk** skal inkluderes, med korrekte inn-/utsjekktider, oppdateringer og håndtering av avbestillinger. Bevar personvernvennlige hendelsestitler.
- Eksisterende manuelle `.ics`-eksport i V15.1 er **ikke** en dynamisk feed. Feeden krever en tilgjengelig datakilde/endpoint, og kompatibilitet med Homey-appens iCal-format må testes.
- Avklar sikkerhetsmodell for feed-URL (for eksempel vanskelig å gjette, roterbar URL) før ekte bookingdata publiseres; ikke legg hemmeligheter i offentlig repository.

### Plan for neste chat
- **Bytt chat nå**, og fortsett med **finpuss fane for fane**. Begynn med Oversikt og avklar endringer før kodeoppdatering. De nye innloggings- og iCal-kravene registreres som senere arkitekturarbeid, ikke som allerede bygde funksjoner.


## 9. V16 – finpussrunde påbegynt 2026-11-16
- Første kodecommit: `2cde0507f4f1f10bc37fa1dde04f1f8e35075bde`.
- Implementert: mobil-CSS for bedre bryting av knapper, rader og felt, og skjult teller for gjenstående oppgaver.
- Ikke verifisert på iPhone ennå. V16 er **ikke ferdig**.
- Avtalte utestående forbedringer: kalender med trykk på start/slutt og retur til opprinnelig kalender; kronologiske oppgavegrupper med gjestenavn som rammeoverskrift; privat lager uten minimum/fast-vare, med egne plasseringer; statistikk med flere nettotall og mindre infotekst; systematisk opprydding i innstillinger, kolliderende felt/knapper og oppgavereglenes overskriftsplassering.
- Innlogging/felles datalagring og dynamisk iCal-feed til Homey utsettes til egen arkitekturfase etter finpuss. Eksisterende manuell ICS-eksport beholdes.
- Neste steg: fortsett implementering i små kontrollerbare trinn, kontroller funksjonene og test i Safari på iPhone.

- V16 del 2 commit `f58b02f`: fjernet hjelpetekst i privatopphold og statistikk; lagt til mer robust mobil-CSS for dato-/klokkeslettfelt og handlingsknapper. Ikke testet på iPhone. Gjenstående V16-arbeid uendret.

V16.2 commit `e6bdd6f`: kalender to-trykks datoperiode (start og slutt), opprett booking med forhåndsutfylte datoer, tilbakeknapp fra utleiebooking åpnet i kalender og retur etter lagring av ny utleiebooking. Ikke iPhone-testet. Privat booking-redigering og returflyt trenger fortsatt kontroll. Eksisterende iCal-feed/innlogging utsatt.

V16.3 commit `5686094`: private booking/opphold har tilbakeknapp til kildefane, retur ved vellykket lagring/sletting, og kalendervalgt utleieperiode valideres mot minimum 2 netter. Kode er ikke iPhone-testet. Gjenstår: full egen bookingvisning, kronologisk oppgavegruppering, privatlager/plasseringer, netto-statistikk, innstillingsfinpuss og samlet test. iCal og innlogging utsatt.

V16.4 commit `401edd9`: Oppgaver grupperes i rammer for sammenhengende oppgaver fra samme booking uten å endre kronologisk rekkefølge. Gjestenavn/plattform vises i gruppeoverskrift, oppgavehandlinger beholdt. Ikke testet på iPhone. Neste prioritet: Privat lager med plasseringer; deretter bookingliste, statistikk, innstillinger og samlet regresjonstest.

V16.5 commit `92d89df`: Privat lager har plassering på varer, forhåndsvalg og egendefinerte plasseringer, redigering og visning av plassering. Minimumsbeholdning og fast-vare gjelder bare Utleie. Eksisterende private varer uten plassering vises som «Ikke angitt» til de redigeres. Ikke iPhone-testet. Neste: bookingliste/navigasjon, statistikk, innstillinger og samlet test.

V16.6 commit `4ca1d06`: Bookinger viser hele trykkbare kort (uten Åpne-knapp), tidsfilter Aktuelle/Tidligere/Kansellerte, kansellerte kort i grått, og bookingdetaljer/redigering skjuler bookinglisten slik at visningen fremstår separat med tilbakeknapp. Antall gjester 1–8 som nedtrekksliste. Ikke iPhone-testet; kontroll av lagre/avbryt/kalenderretur og øvrige avtalte funksjoner gjenstår. Statistikk og innstillinger er neste hovedområder.
