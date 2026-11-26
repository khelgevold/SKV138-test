# Bomservice for SKV138

Status 26.11.2026. Utkast til gjennomgang før godkjenning av utviklingsplanen. Fase 0 er planlagt. Bomservice er ikke implementert.

## Mål og rammer

SKV138 skal oppdage tekniske avvik på den dedikerte Android-telefonen, varsle administrator og etter hvert tilby bomåpning og bomlogg. Eksisterende SMS-åpning gjelder gjennom hele utviklingen. Kameratens egen SMS-kode fungerer uavhengig av bookinger og gjestetilgang. Endringer i eksisterende SMS-makroer krever særskilt godkjenning. Administratorens iPhone-app er en selvstendig reserve.

PROD er eneste aktive miljø. Følg utviklingsreglene i repoet. Gjesteportalen bygges separat. Twilio, AI og automatisering av iPhone-appen inngår ikke.

## Overvåking og varsling

- En separat MacroDroid-makro sender status til et endepunkt med egen autentisering. SKV138 bruker serverens mottakstid. Utgangspunktet for prøvekjøring er hvert femte minutt. Endelig intervall bestemmes etter fase 0.
- Batterinivå, lading, Wi-Fi og mobilnett prioriteres. Signalstyrke, siste omstart og siste utførte bommakro inngår der data er pålitelige og tilgjengelige. SMS-makroene beholdes urørt i fase 0.
- En separat toveistest med unik test-ID kjøres automatisk hvert kvarter som utgangspunkt. «Test forbindelse» kjører samme test manuelt. Bare en gyldig bekreftelse med riktig ID teller som svar. Responstiden måles på serveren. Testmakroen inneholder ingen ringehandling.
- Målet er push innen omtrent én time ved kontaktbrudd, også uten aktiv booking. Forslaget er sjekk i dagens kvartersjobb og varsel ved minst 45 minutter siden sist mottatte status, normalt 45–60 minutter etter siste statusmelding. Før første mottatte status vises «Venter på første status».
- Foreslått varsel ved to mislykkede automatiske toveistester på rad dersom statusmeldingene fortsatt kommer inn. Ved samlet kontaktbrudd sendes ett kontaktvarsel. Vellykket test og fersk status brukes for å avgjøre hva som er gjenopprettet.
- Foreslåtte øvrige varsler er batteri under 20 prosent, kritisk batteri under 10 prosent, lader frakoblet i mer enn 15 minutter, rapportert bommakrofeil og rapportert omstart. Varsle ved endring og ved normal drift igjen. Ordinære vellykkede åpneforespørsler sender ingen push.

## Innstillinger, Oversikt og historikk

«Bomservice» vises sammenfoldet som standard under Innstillinger. Panelet viser driftsstatus, batteri, lading, tilgjengelig nettstatus, siste statusmelding, siste vellykkede toveistest, responstid, siste bomforespørsel, antall i dag og gjestetilgang når den funksjonen er tilgjengelig. Testknapp, adminknapp, bomlogg og statistikk kommer med tilhørende release. Oversikt viser bare advarsel ved avvik.

Bomloggen skal skille mellom forespørsel, eventuell bekreftet start på anrop og utfall som er ukjent. Fysisk bomstilling krever separat tilbakemelding fra bommen. Rapporter digital tilgjengelighet, registrert nedetid, feil, åpneforespørsler, kilder, gjennomsnittlig responstid og statushistorikk. Vis 7, 30 og 90 dager for tilgjengelighet. Perioder uten målegrunnlag vises som ukjente. Tekniske tester holdes utenfor antall åpneforespørsler.

Behold siste status, relevante statusendringer og nødvendige statistikkdata. Telefonnumre, SMS-koder og SMS-innhold lagres ikke i bomloggen. Kilder er admin, fremtidig gjesteportal og eventuelt de to SMS-makroene etter særskilt godkjenning. Tekniske tester får sin egen kategori.

## Åpne bommen

Admin kan åpne fra SKV138 uavhengig av booking. Autorisasjon kontrolleres på serveren. Makroens webhook og hemmeligheter holdes på serveren. Åpneforespørsler via API deler en atomisk sperre med minst 30 sekunder mellom godkjente forespørsler. Ved usikkert utfall sender systemet ingen automatisk ny åpnekommando. SMS-reserven er uavhengig av denne sperren.

## Gjeste-API og reserve

I en senere release kan gjesteportalen vise «OPEN GATE» uten innlogging eller personlig lenke, forutsatt at dette er forenlig med grunneiers tilgangsregler. Serveren verifiserer gjestebryteren og minst én gyldig, ikke-kansellert privat- eller utleiebooking ved hver forespørsel. Vinduet er fra kl. 00.00 på ankomstdagen til kl. 00.00 dagen etter utsjekkdagen, med sluttidspunktet ekskludert, i Europe/Oslo. API-et avviser åpning når bookingstatus ikke kan verifiseres og returnerer ingen bookingdetaljer. Admin kan slå av gjestetilgangen umiddelbart. API-et må begrense automatisert misbruk.

Reserve i ankomstinformasjonen er eksisterende SMS og kontakt med administrator. Reservenummeret på bommen settes mellom disse bare hvis grunneier godkjenner ordinær bruk. Dersom det er et nødnummer, holdes det utenfor den ordinære rekkefølgen. Eventuell bookingbegrensning av gjestenes SMS-kode vurderes separat. Dagens SMS-reserve og kameratens uavhengige tilgang er førende for den avklaringen.

## Fase 0

Registrer telefonmodell, Android-versjon og MacroDroid-versjon. Bruk en separat testmakro med teknisk bekreftelse og uten ringehandling. Ingen eksisterende SMS-makro endres. Registrer observert resultat og om telefonen kom tilbake av seg selv.

| Kontroll | Hva vi registrerer |
|---|---|
| Telefon våken og skjermen låst | Statusmelding og gyldig svar med samme test-ID. |
| Lengre inaktivitet, gjerne over natten | Intervall mellom statusmeldinger og om toveistesten fortsatt svarer. |
| Wi-Fi og mobildata | Hvert nett for seg og overgang mellom dem. Registrer tid til gjenopprettet kontakt. |
| Omstart | Kontroller før første opplåsing og igjen etter opplåsing. Dokumenter eventuell nødvendig manuell handling. |
| Lading og bakgrunn | Hvilke statusfelt som er tilgjengelige. Gjennomgå batterioptimalisering, oppstart, bakgrunnsaktivitet og strømsparing på denne modellen. |
| Forbruk | Sjekk faktisk Netlify- og Neon-abonnement og anslå funksjonskjøring. Vurder om hyppige statusoppdateringer holder Neon aktiv, og velg lagringsmåte og intervaller deretter. |

Fase 0 er gjennomført når testene er dokumentert og vi har valgt intervaller og akseptert eventuell begrensning før første opplåsing. Modellspesifikke innstillinger og hvilke statusfelt som kan brukes i første release står åpne frem til testen. Grunneiers avklaringer gjelder gjestereleasen og reservenummeret.

## Rekkefølge

1. Godkjenn utviklingsplanen og gjennomfør fase 0.
2. Release 1 gir sikkert statusendepunkt, lagring og visning i Innstillinger.
3. Release 2 gir toveistest, overvåking, push og avviksvisning på Oversikt.
4. Release 3 gir adminåpning, bomlogg, kilder og statistikk. Test sammen med kameraten der det er relevant.
5. Release 4 gir gjeste-API med bookingkontroll og gjestebryter. Gjesteportalens frontend håndteres i eget prosjekt.
