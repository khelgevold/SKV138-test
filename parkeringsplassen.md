## Gjeldende beslutning 25.11.2026 kl. 16:01 – Kun PROD

Brukeren bekrefter at siste release fungerer fint. Innlogget sluttkontroll av siste MESK-/Pushvarsler-release (5d1f25c) anses godkjent av brukeren. Aktiv løsning: https://skv138.helgevold.no/ (GitHub khelgevold/SKV138-test, release/skv138-prod). Fra nå av brukes ikke separat TEST-miljø. Tidligere TEST-instrukser nedenfor er historikk og overstyres av denne beslutningen. TEST-gren, database og Netlify-site slettes ikke uten særskilt godkjenning. Bruk midlertidig prep-gren for kode og målrettede kontroller med syntetiske data før samlet PROD-release; ikke et nytt permanent miljø. Behold PROD-data, autentisering, miljøvariabler og eksisterende ID-er. SQL-endringer skal være bakoverkompatible og risikovurderes; backup/rollback ved behov. Ingen PROD-publisering uten eksplisitt godkjenning. Dokumentasjonsendringer alene skal ikke kreve deploy. Homey-import/oppdatering er ikke særskilt bekreftet i denne meldingen; ikke anta at den er testet. Ingen ny funksjonell release avtalt.

# Parkeringsplassen – SKV138
Opprettet: 2026-11-18.

Her registreres utviklingsønsker som er diskutert og avtalt utsatt. Dette er ikke en liste over feil i godkjent V16.23.

| Ønske | Status | Kommentar |
|---|---|---|
| Pushvarsler | Gjennomført | Publisert i PROD; siste panelendring godkjent. |
| Dynamisk iCal-abonnementsfeed for Homey | Implementert; Homey-verifisering ikke særskilt bekreftet | Kontroller kun ved behov. |

## Neste utviklingsrunde

1. Nye bookinger skal foreslå to netter. Brukeren skal kunne endre til én natt, og datoene skal lagres riktig.
2. Sett opp egen PROD-konto for Melinda med e-post og passord hun selv velger. Bruk appens registrering og gi tilgang via `skv138_access`. Kontroller godkjent fremgangsmåte i innloggingsdokumentet.
3. Legg inn headerbilder øverst i appen og på nettsiden. Avklar bilder og plassering før endringen.
4. Legg inn et SKV138-ikon for den installerte iPhone-webappen, og kontroller ikonet på hjemskjermen.
5. Legg til «Logg ut». Sjekk at F5 ikke gjenoppretter den avsluttede økten, og at ny innlogging fungerer.
6. Endre Chrome-fanens tittel fra dagens TEST-tittel til «SKV138».

Legg kun til ønsker som brukeren har godkjent for senere vurdering. Fjern eller merk som gjennomført når de implementeres.
