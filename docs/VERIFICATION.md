# Verifikimi i Detyrës 1 — përmirësimet vizuale

Testet: 25 shtator 2026, UTC. Kontrolli përfundimtar i hostimit dhe paketimit: 26 shtator 2026, UTC. Testet e shfletuesit u kryen në Chromium headless në Linux.

| Kontrolli                                                                  | Rezultati                                           |
| -------------------------------------------------------------------------- | --------------------------------------------------- |
| TypeScript dhe Vite production build                                       | Kaloi                                               |
| ESLint                                                                     | Kaloi                                               |
| Teste Vitest për shportën dhe katalogun                                    | 8/8 kaluan                                          |
| Teste Playwright                                                           | 12/12 kaluan, në dy grupe nga 6 teste               |
| Porosi, konfirmim dhe shkarkim në HTTPS publik                             | Kaloi                                               |
| Pamja mobile në HTTPS publik                                               | Kaloi                                               |
| axe: login, katalog desktop/tablet, shportë mobile, rishikim dhe konfirmim | Pa shkelje të zbuluara nga kontrollet e aktivizuara |
| Gjerësi 320, 375, 390, 768, 1024, 1280, 1440 px; karta dhe listë           | Pa tejkalim horizontal të faqes                     |
| HTTPS dhe katalogu publik JSON                                             | HTTP 200; 18 produkte                               |
| Container i veçuar                                                         | Running / healthy                                   |
| Dy faqet ekzistuese pas publikimit                                         | HTTP 200                                            |
| Konfigurimi ekzistues i proxy-t                                            | Nuk u ndryshua gjatë këtyre përmirësimeve           |

Dy kontrollet në HTTPS publik mbuluan rishikimin, konfirmimin, shkarkimin, dukshmërinë e butonave në laptop, kërkimin gjatë lëvizjes në mobile dhe konfirmimin mobile. Të dyja kaluan. Indeksi publik përputhet me ndërtimin lokal të testuar.

## Rrjedhat funksionale të provuara

1. Hyrje e pasaktë, të dhëna demo, shfaqje e fjalëkalimit dhe ruajtje e sesionit.
2. Kërkim pa diakritikë, kategori, filtër stoku, renditje dhe pa rezultate.
3. Sasi deri në kufirin e stokut, total në cent, rifreskim, heqje dhe zbrazje me konfirmim.
4. Rishikim, konfirmim demonstrues dhe shkarkim i përmbledhjes.
5. Loading, error, empty, riprovim dhe Escape me rikthim fokusi.
6. Gabim real HTTP i simuluar në nivel rrjeti dhe JSON i pavlefshëm.
7. Shportë mobile dhe kalim mes kartave/listës në madhësi të ndryshme.
8. Dalje që pastron llogarinë dhe shportën demo.
9. Kontroll automatik aksesueshmërie në pamjet e shënuara më sipër.
10. Ruajtje e porosisë gjatë kalimit në katalog bosh dhe rikthimit në katalogun normal.
11. Ngarkimi i atlasit lokal, rikuperimi me fotografi rezervë kur atlasi dështon dhe SVG e përgjithshme kur dështon edhe fotografia rezervë; porositja vazhdon normalisht.
12. Butonat e rreshtit të parë të dukshëm pa lëvizje në laptop 1280 × 800, kërkimi i arritshëm gjatë lëvizjes në mobile dhe mandati demo në telefon.

Kapjet e ekranit janë në `docs/screenshots/`. Pamjet e login-it, desktop-it, laptop-it, mobile-it, rishikimit dhe mandatit demo u inspektuan vizualisht. Kontrollet automatike nuk përbëjnë auditim të plotë aksesueshmërie ose testim në çdo shfletues; Safari dhe Firefox nuk janë testuar.

Për riprodhim, përdorni komandat në README. Të gjitha porositë e testimit janë demonstrime në shfletues dhe nuk krijojnë të dhëna në server.

## Ndryshimet e përfunduara

Katalogu shfaqet më lart; fotografitë kanë stil të njëtrajtshëm; kartat kanë çmime dhe butona të rreshtuar; teksti është më i lexueshëm; ndryshimi i sasive dhe totalit sinjalizohet lehtë; kërkimi dhe kategoritë qëndrojnë sipër në mobile; rishikimi ka miniatura dhe konfirmimi paraqitet si mandat demonstrimi.

Vetëm Detyra 1 është implementuar. Projekti u publikua më 26 shtator 2026 në repository-n publik [koltrakahamza/marketone-operator-dashboard](https://github.com/koltrakahamza/marketone-operator-dashboard), me vetëm skedarët e MarketOne dhe PDF-në e Detyrës 2. Propozimi teknik i Detyrës 2 gjendet te `docs/task2/`; verifikimet funksionale më sipër i përkasin vetëm aplikacionit të Detyrës 1.
