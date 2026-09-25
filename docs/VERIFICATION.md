# Verifikimi i versionit 1.0

Data: 25 shtator 2026, UTC. Testet e shfletuesit u kryen në Chromium headless në Linux.

| Kontrolli                                                        | Rezultati                                           |
| ---------------------------------------------------------------- | --------------------------------------------------- |
| TypeScript dhe Vite production build                             | Kaloi                                               |
| ESLint                                                           | Kaloi                                               |
| Teste Vitest për shportën dhe katalogun                          | 8/8 kaluan                                          |
| Teste Playwright                                                 | 10/10 kaluan                                        |
| Porosi, konfirmim dhe shkarkim në HTTPS publik                   | Kaloi                                               |
| Pamja mobile në HTTPS publik                                     | Kaloi                                               |
| axe: login, katalog desktop/tablet dhe dialogu mobile i porosisë | Pa shkelje të zbuluara nga kontrollet e aktivizuara |
| Gjerësi 320, 375, 390, 768, 1024, 1280, 1440 px; karta dhe listë | Pa tejkalim horizontal të faqes                     |
| HTTPS dhe katalogu publik JSON                                   | HTTP 200; 18 produkte                               |
| Container i veçuar                                               | Running / healthy                                   |
| Dy faqet ekzistuese pas publikimit                               | HTTP 200                                            |
| Konfigurimi ekzistues i proxy-t                                  | U ruajt identik; u shtua vetëm blloku MarketOne     |

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

Kapjet e ekranit janë në `docs/screenshots/`. Pamjet e login-it, desktop-it dhe mobile-it u inspektuan vizualisht. Kontrollet automatike nuk përbëjnë auditim të plotë aksesueshmërie ose testim në çdo shfletues; Safari dhe Firefox nuk janë testuar.

Për riprodhim, përdorni komandat në README. Të gjitha porositë e testimit janë demonstrime në shfletues dhe nuk krijojnë të dhëna në server.
