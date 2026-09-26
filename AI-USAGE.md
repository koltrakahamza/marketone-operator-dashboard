# Deklarim i përdorimit të AI

Ky dokument pasqyron punën e realizuar deri në këtë version. Duhet rishikuar nga kandidati përpara dorëzimit.

## Mjeti

OpenAI Codex u përdor për krijimin dhe rishikimin e implementimit, përmes bisedës me përdoruesin dhe mjeteve të zhvillimit.

## Pjesët e realizuara me AI

- Propozimi i organizimit teknik dhe drejtimit vizual.
- Implementimi React/TypeScript, CSS dhe të dhënat demo.
- Login-i i simuluar, filtrimi, porosia, ruajtja në sessionStorage dhe menaxhimi i gjendjeve.
- Shkrimi dhe ekzekutimi i testeve; korrigjimet që dolën prej tyre.
- Dokumentimi dhe konfigurimi i hostimit të veçuar.

Fotografitë kryesore të 18 produkteve janë krijuar me mjetin e integruar OpenAI `imagegen` si një imazh i vetëm me qeliza (atlas). Prompt-i dhe skedari janë dokumentuar te [docs/IMAGE-PROMPT.md](docs/IMAGE-PROMPT.md). AI u përdor edhe për përmirësimin e kartave, lexueshmërisë, kontrolleve mobile dhe mandatit demo.

Fotografia e hyrjes dhe imazhet rezervë të produkteve vijnë nga Unsplash. Ikonat janë nga Lucide dhe fonti nga Manrope.

## Detyra 2

OpenAI Codex u përdor për analizën e kërkesave, propozimin e arkitekturës, modelin e të dhënave, API-të, rrjedhën e porosisë, sigurinë dhe kufijtë e MVP-së. U përdor edhe për rishikimin e burimeve OWASP/PostgreSQL, përmbledhjen e tekstit, diagramin dhe krijimin/verifikimin e PDF-së prej dy faqesh. Nuk u zhvillua backend për Detyrën 2.

Përdoruesi dha kontekstin e platformës B2B për Shqipërinë, kërkoi analizë të hollësishme dhe përcaktoi drejtimin vizual. Zgjedhjet teknike të dokumentit janë propozime të asistuara me AI; nuk janë dokumentuar ndryshime teknike të pavarura të kandidatit. Kandidati duhet ta rishikojë deklarimin sipas kontributeve reale përpara dorëzimit.

Dokumenti: [MarketOne — Propozim teknik](docs/task2/MarketOne-Propozim-Teknik.pdf).

## Vendimet e dhëna nga përdoruesi

- Të realizohet fillimisht vetëm Detyra 1.
- Të synohet një pamje e bukur, profesionale dhe e thjeshtë për përdorim, në frymën e projektit ekzistues Construction.
- Projekti të ruhet në një dosje krejt të veçantë dhe të mund të hiqet pas periudhës së demonstrimit.

## Kontributet personale të kandidatit

Në këtë fazë nuk janë regjistruar ndryshime kodi të bëra manualisht nga kandidati. Përpara dorëzimit, kandidati duhet të përshkruajë këtu vetëm vendimet, verifikimet dhe ndryshimet që ka kryer realisht vetë.

Përgatitja për intervistë duhet të përfshijë shpjegimin e reducer-it të shportës, llogaritjeve në cent, kufizimit të stokut, ngarkimit asinkron, ndryshimit mes login-it demo dhe autentikimit real, si edhe modifikimin e një komponenti ose testi.
