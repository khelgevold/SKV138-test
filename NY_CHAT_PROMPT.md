# SKV138 – NY_CHAT_PROMPT.md

**Oppdatert:** 2026-11-16  
**Gjeldende appversjon:** V15.1  
**Prosjekt:** https://github.com/khelgevold/SKV138-test  
**Test:** https://khelgevold.github.io/SKV138-test/

## Kopier teksten under til en ny ChatGPT-samtale

Jeg vil fortsette utviklingen av webappen **SKV138**, tidligere kalt Hytteøkonomi, for administrasjon av min utleiehytte i Sirdal.

**Start med å hente og lese disse tre dokumentene direkte fra GitHub-repositoryet `khelgevold/SKV138-test`:**
1. `PROJECT.md` – full prosjektstatus, funksjoner, versjonshistorikk og neste steg.
2. `ARBEIDSREGLER.md` – bindende samarbeidsregler, særlig at Netlify-credits aldri skal brukes til dokumentasjonsoppdateringer.
3. `NY_CHAT_PROMPT.md` – denne oppstartsprompten.

Kontroller også `index.html` og siste relevante GitHub-commits. **Ikke stol blindt på oppstartspromptens versjonsnummer hvis repositoryet viser nyere status.** Dokumentene og faktisk kode skal stemme overens; avklar eventuelle avvik før videre endringer.

**Gjeldende situasjon per 16.11.2026:** SKV138 V15.1 er publisert på GitHub Pages. Tidligere lokal HTML-forhåndsvisning på iPhone viste manglende dynamisk innhold, men GitHub Pages-test på iPhone viste årstall, økonomitall og navigasjon. Brukeren har også bekreftet at Bookinger åpnes og fungerer. Ingen full funksjonstest er gjennomført. Neste fase er **finpuss**, med gjennomgang av én side om gangen, med Oversikt som foreslått startpunkt. Ingen konkrete finpussendringer er ennå besluttet.

**Viktige rammer:**
- Dette er SKV138, **ikke Solåsen Padel**. Endre aldri det andre prosjektet.
- Gjør GitHub-endringer selv gjennom tilkoblingen der det er mulig. Ikke be meg laste opp filer manuelt uten grunn.
- Testmiljøet er offentlig GitHub Pages. Bruk bare fiktive data; ingen hemmeligheter eller ekte gjesteinformasjon.
- Appen er foreløpig en selvstendig HTML/JS-prototype med lokal nettleserlagring; ikke påstå at Supabase, autentisering, Homey, push eller automatisk iCal-abonnement finnes.
- Avklar forbedringer før du implementerer dem, særlig i finpussfasen.
- **ALDRI bruk Netlify-credits for å oppdatere dokumentasjon.** Rediger de tre Markdown-dokumentene direkte i GitHub.
- Etter hver ny versjon: oppdater `PROJECT.md`, `NY_CHAT_PROMPT.md` og gjennomgå/oppdater `ARBEIDSREGLER.md`; dokumenter både forbedringer og feilrettinger, teststatus og gjenstående arbeid.
- Ikke påstå at endringer er publisert/testet uten å kontrollere dette. Hold kostnader og manuelle steg nede.

**Nye, avtalte krav (16.11.2026), ennå ikke implementert:** Maksimalt **to brukerkontoer med sikker innlogging og felles data** på tvers av enheter. Brukeren har allerede en **Homey-app som leser iCal** for lys og varme; SKV138 skal etter hvert levere en **dynamisk iCal-abonnementsfeed** med både utleie og privat bruk, endringer og avbestillinger, slik at eksisterende Homey-oppsett kan gjenbrukes. Dagens manuelle .ics-eksport er ikke en abonnementsfeed. Teknologivalg, sikkerhet og Homey-kompatibilitet er ikke avklart. Se PROJECT.md punkt 8.\n\n**Arbeidsmåte nå:** Vi har valgt å bytte chat nå og ta finpuss fane for fane. Spør meg hvilke finpussendringer jeg ønsker på Oversikt, noter og diskuter dem først. Implementer først når vi er enige om omfanget. Gi tydelig status og hold dokumentasjonen synkronisert.


## V16 påbegynt – nyere status
V16 første kodecommit `2cde050`: mobil-layoutjusteringer og skjult oppgaveteller. Ikke fullført eller iPhone-testet. Les PROJECT.md punkt 9 for resterende avtalte endringer. Ikke bland inn dynamisk iCal eller innlogging i V16.

V16 del 2: `f58b02f` (privatopphold/statistikk hjelpetekst, mobilfelter). Fortsatt ikke iPhone-testet; viderefør utestående finpuss i PROJECT.md.

V16.2 commit `e6bdd6f`: kalender to-trykks datoperiode (start og slutt), opprett booking med forhåndsutfylte datoer, tilbakeknapp fra utleiebooking åpnet i kalender og retur etter lagring av ny utleiebooking. Ikke iPhone-testet. Privat booking-redigering og returflyt trenger fortsatt kontroll. Eksisterende iCal-feed/innlogging utsatt.

V16.3 commit `5686094`: private booking/opphold har tilbakeknapp til kildefane, retur ved vellykket lagring/sletting, og kalendervalgt utleieperiode valideres mot minimum 2 netter. Kode er ikke iPhone-testet. Gjenstår: full egen bookingvisning, kronologisk oppgavegruppering, privatlager/plasseringer, netto-statistikk, innstillingsfinpuss og samlet test. iCal og innlogging utsatt.

V16.4 commit `401edd9`: Oppgaver grupperes i rammer for sammenhengende oppgaver fra samme booking uten å endre kronologisk rekkefølge. Gjestenavn/plattform vises i gruppeoverskrift, oppgavehandlinger beholdt. Ikke testet på iPhone. Neste prioritet: Privat lager med plasseringer; deretter bookingliste, statistikk, innstillinger og samlet regresjonstest.

V16.5 commit `92d89df`: Privat lager har plassering på varer, forhåndsvalg og egendefinerte plasseringer, redigering og visning av plassering. Minimumsbeholdning og fast-vare gjelder bare Utleie. Eksisterende private varer uten plassering vises som «Ikke angitt» til de redigeres. Ikke iPhone-testet. Neste: bookingliste/navigasjon, statistikk, innstillinger og samlet test.

V16.6 commit `4ca1d06`: Bookinger viser hele trykkbare kort (uten Åpne-knapp), tidsfilter Aktuelle/Tidligere/Kansellerte, kansellerte kort i grått, og bookingdetaljer/redigering skjuler bookinglisten slik at visningen fremstår separat med tilbakeknapp. Antall gjester 1–8 som nedtrekksliste. Ikke iPhone-testet; kontroll av lagre/avbryt/kalenderretur og øvrige avtalte funksjoner gjenstår. Statistikk og innstillinger er neste hovedområder.

V16.7 commit `7cdb06f`: global brutto/netto-etter-estimert-skatt bryter i Statistikk (netto standard), ekstra skattemetrikker, måneds-/plattform-/snittpris-/årssammenligning følger bryteren, prosentvis årsendring, fjernet hjelpetekst under hyttebruk. Rettet manglende akkumulering av kanselleringsinntekt per plattform i eldre statistikkfunksjon. Skatteberegning og proporsjonal allokering er foreløpige og ikke verifisert mot norske regler. Ikke iPhone-testet. Neste: Innstillinger, gjennomgang av V16-overstyringer og samlet test.
