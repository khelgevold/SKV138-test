# SKV138 – Neon TEST backend-kontrakt (utkast)

Dato: 2026-11-18. Status: **planlagt, ikke implementert eller testet**. V16.23 index.html er urørt.

## Bekreftet databasearbeid
Brukeren kjørte 2026-11-18 en transaksjon med vellykket COMMIT i SKV138-TEST. Migreringen opprettet med IF NOT EXISTS: public.skv138_access (user_id text), public.skv138_data (id text, payload jsonb, version bigint, updated_at, updated_by), public.skv138_data_history (id bigint, data_id, version, payload, saved_at, saved_by). REVOKE fra PUBLIC og eventuelle anon/authenticated-roller. Dette er **ikke** tilstrekkelig som fullstendig autorisasjon. Ingen data er migrert. Eksisterende Neon Auth-bruker er opprettet via dashboard, men credential-kontoen mangler passord.

## Foreslått API
- GET /api/skv138/state: verifiser gyldig Better Auth-sesjon/token server-side, sjekk eksakt bruker-ID i skv138_access, hent ett felles dokument og versjon.
- PUT /api/skv138/state: samme sjekker, valider payload og forventet versjon, atomisk oppdatering med WHERE version = expected_version; returner 409 ved konflikt. Logg forrige versjon i history i samme transaksjon. Ikke overskriv ved konflikt.
- Kun Netlify Functions med server-side database-tilkobling får databasepassord; aldri browser/GitHub. Bruk egen begrenset DB-rolle for runtime, ikke eierrolle, og eksplisitte GRANT etter verifisering.
- Opprett tilgangslisten først etter verifisert identitet for de to personene. Ny Better Auth-registrering gir ikke automatisk tilgang. Begrens datatilgang selv om registrering er åpen.
- Beskytt mot CSRF dersom cookie-baserte sesjoner benyttes; verifiser origin og autentisering. CORS kun fra godkjente domener. Avklar Neon JWKS/token/session-verifisering mot faktisk managed Better Auth før implementering.
- JSONB-dokumentet må omfatte eksisterende state samt separat localStorage-nøkkel skv138_private_locations. Tema kan forbli enhetsspesifikt.
- Ingen automatisk import av eksempeldata fra prototype; bruk kontrollert førstegangsimport, backup/eksport og bekreftelse før eventuell erstatning av lokale data.

## Første utviklingspakke
1. Implementer API og autentisering uten å endre V16.23 på main før integrasjonsløpet er avtalt og testmiljøet er klart.
2. Lag migrerings-/initialiseringsflyt med eksplisitt brukerbekreftelse.
3. Test målrettet: ingen innlogging, ikke-godkjent bruker, begge godkjente brukere, samtidig redigering (409), gjenoppretting.
4. Samle Netlify-deploy og innhent godkjenning før publisering. PROD opprettes senere separat.

## Åpent
- Bekreft korrekt Better Auth-verifiseringsmetode og sikker passordoppretting for dashboard-bruker uten passord.
- Opprett runtime-rolle/GRANT og gjennomgå sekvensprivilegier, transaksjonsgrenser og historikkbegrensning.
- Eksisterende SQL har ikke ennå en unik singleton-id-constraint utover tekst-PK; API må bruke fast dokument-ID.
