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
