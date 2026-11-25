## Gjeldende beslutning 25.11.2026 kl. 16:01 – Kun PROD

Brukeren bekrefter at siste release fungerer fint. Innlogget sluttkontroll av siste MESK-/Pushvarsler-release (5d1f25c) anses godkjent av brukeren. Aktiv løsning: https://skv138.helgevold.no/ (GitHub khelgevold/SKV138-test, release/skv138-prod). Fra nå av brukes ikke separat TEST-miljø. Tidligere TEST-instrukser nedenfor er historikk og overstyres av denne beslutningen. TEST-gren, database og Netlify-site slettes ikke uten særskilt godkjenning. Bruk midlertidig prep-gren for kode og målrettede kontroller med syntetiske data før samlet PROD-release; ikke et nytt permanent miljø. Behold PROD-data, autentisering, miljøvariabler og eksisterende ID-er. SQL-endringer skal være bakoverkompatible og risikovurderes; backup/rollback ved behov. Ingen PROD-publisering uten eksplisitt godkjenning. Dokumentasjonsendringer alene skal ikke kreve deploy. Homey-import/oppdatering er ikke særskilt bekreftet i denne meldingen; ikke anta at den er testet. Ingen ny funksjonell release avtalt.

# Utviklingsregler – SKV138
Opprettet: 2026-11-18. Gjelder utvikling av SKV138. Kan gjenbrukes som mal for andre apper, men ikke automatisk endre andre repoer.

## 1. Kostnader og arbeidsflyt
1. Samle mest mulig avtalte endringer i neste versjon/release før publisering. Begrens Netlify-builds/deploys og andre credits. Ikke utsett nødvendig test eller feilretting bare for å spare credits.
2. ChatGPT utfører selv alt det kan gjennom tilgjengelige GitHub-verktøy. Brukeren involveres bare ved nødvendige handlinger, beslutninger, tester eller godkjenninger.
3. Bygg og avklar mest mulig design/funksjonalitet i lokal HTML/GitHub Pages-prototype før backend og Netlify settes opp, når prosjektet tillater det. For funksjoner som krever backend, avklar arkitekturen tidlig nok til å unngå omfattende ombygging.
4. Dokumentasjonscommits gjøres direkte i GitHub, aldri via betalte Netlify-AI-verktøy. Kontroller at dokumentasjonsendringer ikke unødvendig utløser betalte builds; ingen garanti for at GitHub-commit alene ikke trigger en tilkoblet CI/CD.
5. Ikke aktiver betalte tjenester, ressurskrevende AI-kall eller ekstra infrastruktur uten forhåndsavklaring av kostnad.

## 2. Selvstendighet og kommunikasjon
6. ChatGPT arbeider selvstendig gjennom avtalte, lavrisiko deloppgaver uten å be om «ok» etter hvert steg. Stopp når brukerbeslutning, nødvendig manuell handling, risikofylt endring eller særskilt godkjenning kreves. Ikke gjennomfør produksjonssetting, sletting av reelle data eller irreversible endringer uten eksplisitt samtykke.
7. Ved starten av hvert utviklingsløp, også små, presenter en kort fremdriftsplan med milepæler. Oppdater omtrentlige fremdriftsprosenter ved naturlige milepæler, med tydelig skille mellom implementert, testet og godkjent. Ikke bruk falsk presisjon.
8. Ikke gjennomfør unødvendige tester, gjentatte uttrekk eller kontroller av mikroskopisk risiko. Prioriter kontroller etter sannsynlighet og konsekvens. Sikkerhet, tilgangskontroll, risiko for datatap og sentrale brukerflyter skal likevel verifiseres målrettet.
9. Unngå å gjenta spørsmål som allerede er avklart i dokumentasjonen. Si tydelig fra ved feil eller manglende verktøytilgang; ikke påstå at noe er gjort uten bekreftet resultat.

## 3. Database, miljøer og sikkerhet
10. SQL som brukeren skal kjøre manuelt i Supabase, skal alltid gis som komplett kopierbar SQL i chatten. Samme prinsipp gjelder andre SQL-baserte databaser, inkludert Neon. Forklar kort formål, miljø og eventuell risiko.
11. Før risikable databaseendringer: vurder reell fare for datatap og bruk hensiktsmessig, verifiserbar sikkerhetskopi eller reverseringsplan. Ikke krev omfattende databaseuttrekk for trivielle endringer; ikke anta at gratisplanen har automatisk backup.
12. Hemmelige API-nøkler, databasepassord og private connection strings skal aldri legges i offentlig GitHub-kode eller vises i chat. Nettlesertilgang må sikres med faktisk autentisering og autorisasjon, ikke bare skjulte knapper.
13. TEST og PROD skal ha tydelig adskilte data, konfigurasjon og publiseringsløp. Sammenlign relevant kode, migreringer og konfigurasjon ved milepæler og før release; unngå å overføre utdaterte testendringer til PROD. Dokumenter bevisste forskjeller.
14. Før produksjonssetting: kontroller at avtalte funksjoner og sentrale flyter er testet, at data/tilgang er beskyttet, og innhent eksplisitt godkjenning. Ikke likestill grønn deploy med funksjonell godkjenning.

## 4. GitHub-dokumentasjon
15. Hvert nytt app-prosjekt skal ha fire sentrale Markdown-filer (kan opprettes når GitHub-repo finnes):
    - `project.md`: prosjektets faktiske status, arkitektur, funksjoner, versjoner, tester, åpne saker og neste steg.
    - `startnestechat.md`: oppdatert, kopierbar prompt for neste chat med siste status og neste konkrete handling.
    - `utviklingsregler.md`: varige utviklingsregler og avtalte justeringer.
    - `parkeringsplassen.md`: godkjente ideer som er utsatt, med status og prioritet ved behov.
16. Oppdater `project.md` og `startnestechat.md` etter relevante endringer og milepæler, også før en chat blir lang. Les `utviklingsregler.md` ved hver dokumentasjonsrunde og ved oppstart av ny chat; oppdater regelverket kun når nye regler avtales. Hold parkeringsplassen oppdatert når ideer legges til, endres eller fjernes.
17. Dokumenter hva som er planlagt, implementert, publisert, testet og godkjent. Historiske notater skal ikke forveksles med nyeste status. Sørg for én tydelig gjeldende status øverst.
18. Ved overlevering skal neste chat lese dokumentene og relevant faktisk kode før arbeid. Ikke la gamle prompttekster overstyre nyere prosjektstatus.

## 5. Endringskontroll
19. Beskytt godkjent funksjonalitet. Gjør avgrensede kodeendringer, unngå unødvendige overstyringer og refaktorering uten avtale, og bevar eksisterende data.
20. Ved avvik eller feil: undersøk faktisk årsak før ny endring, og unngå gjentatte spekulative rettinger.
21. Brukerens nyeste eksplisitte instruksjon har forrang. Ved motstrid mellom dokumenter eller mellom regler og teknisk virkelighet: gjør avviket synlig og avklar før risikofylte handlinger.

## Prosjektspesifikk overgang – SKV138
Eksisterende `PROJECT.md`, `NY_CHAT_PROMPT.md` og `ARBEIDSREGLER.md` beholdes som historiske/kompatible filer. Nye små bokstav-filer er innganger for fremtidig arbeid; gammel detaljhistorikk slettes ikke. `ARBEIDSREGLER.md` inneholder også spesifikke SKV138-krav som fortsatt gjelder når de ikke strider mot nyere avtalte regler.
