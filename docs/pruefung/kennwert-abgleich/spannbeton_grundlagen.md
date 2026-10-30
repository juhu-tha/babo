# Kennwert-Abgleich: `spannbeton_grundlagen`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `spannbeton_grundlagen` (Massivbau, geprueft), `spannbeton_kennwerte` (Massivbau, geprueft)
- **Komponente:** `src/modules/Spannbeton.tsx`
- **Dateien (38):** `content/spannbeton/BeiwerteKatalog.json`, `content/spannbeton/Spannbeton.json`, `content/spannbeton/SpannbetonDauerhaftigkeit.json`, `content/spannbeton/SpannbetonDehnungsAnimation.json`, `content/spannbeton/SpannbetonKennwerte.json`, `content/spannbeton/SpannbetonNullBisHundert.json`, `content/spannbeton/SpannbetonPrinzipien.json`, `content/spannbeton/kennwerte/KennwerteBeispielrechnung.json`, `content/spannbeton/kennwerte/KennwerteBeton.json`, `content/spannbeton/kennwerte/KennwerteEinpressmoertel.json`, `content/spannbeton/kennwerte/KennwerteKriechen.json`, `content/spannbeton/kennwerte/KennwerteRechner.json`, `content/spannbeton/kennwerte/KennwerteRelaxation.json`, `content/spannbeton/kennwerte/KennwerteSchwinden.json`, `content/spannbeton/kennwerte/daten.json`, `content/spannbeton/nullbishundert/Station2Dilemma.json`, `content/spannbeton/nullbishundert/Station3Verfahren.json`, `content/spannbeton/nullbishundert/Station4LoadBalancing.json`, `content/spannbeton/nullbishundert/Station6Nachweise.json`, `src/modules/Spannbeton.tsx`, `src/modules/spannbeton/BeiwerteKatalog.tsx`, `src/modules/spannbeton/SpannbetonDauerhaftigkeit.tsx`, `src/modules/spannbeton/SpannbetonDehnungsAnimation.tsx`, `src/modules/spannbeton/SpannbetonKennwerte.tsx`, `src/modules/spannbeton/SpannbetonNullBisHundert.tsx`, `src/modules/spannbeton/SpannbetonPrinzipien.tsx`, `src/modules/spannbeton/kennwerte/KennwerteBeispielrechnung.tsx`, `src/modules/spannbeton/kennwerte/KennwerteBeton.tsx`, `src/modules/spannbeton/kennwerte/KennwerteEinpressmoertel.tsx`, `src/modules/spannbeton/kennwerte/KennwerteKriechen.tsx`, `src/modules/spannbeton/kennwerte/KennwerteRechner.tsx`, `src/modules/spannbeton/kennwerte/KennwerteRelaxation.tsx`, `src/modules/spannbeton/kennwerte/KennwerteSchwinden.tsx`, `src/modules/spannbeton/kennwerte/daten.ts`, `src/modules/spannbeton/nullbishundert/Station2Dilemma.tsx`, `src/modules/spannbeton/nullbishundert/Station3Verfahren.tsx`, `src/modules/spannbeton/nullbishundert/Station4LoadBalancing.tsx`, `src/modules/spannbeton/nullbishundert/Station6Nachweise.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 12 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 49 (45) |
| (3) Normverweise / Hinweise | 172 / 3 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (12): `CONCRETE['C30/37'].fck` ×1, `CONCRETE['C35/45'].Ecm` ×2, `CONCRETE['C35/45'].fck` ×1, `CONCRETE['C40/50'].fck` ×1, `CONCRETE['C40/50'].fctm` ×1, `CONCRETE['C45/55'].Ecm` ×1, `CONCRETE['C45/55'].fck` ×1, `CONCRETE['C50/60'].fck` ×1, `CONCRETE['C60/75'].fck` ×1, `CONCRETE['C70/85'].Ecm` ×1, `CONCRETE['C70/85'].fck` ×1

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Spannbeton.tsx:175` | `28` | – | `const betaCc = Math.exp(s * (1 - Math.sqrt(28 / concreteAge)));` |
| `src/modules/Spannbeton.tsx:181` | `0.3` | – | `const Ecm_t0 = Math.max(15000, Math.pow(fcm_t0 / fcm, 0.3) * conc.Ecm);` |
| `src/modules/Spannbeton.tsx:185` | `0.80` | ja | `const sigmaPmax = Math.min(0.80 * steel.fpk, 0.90 * steel.fp01k);` |
| `src/modules/Spannbeton.tsx:185` | `0.90` | ja | `const sigmaPmax = Math.min(0.80 * steel.fpk, 0.90 * steel.fp01k);` |
| `src/modules/Spannbeton.tsx:247` | `0.75` | – | `const isPm0Ok = sigmaPm0 <= Math.min(0.75 * steel.fpk, 0.85 * steel.fp01k);` |
| `src/modules/Spannbeton.tsx:247` | `0.85` | – | `const isPm0Ok = sigmaPm0 <= Math.min(0.75 * steel.fpk, 0.85 * steel.fp01k);` |
| `src/modules/Spannbeton.tsx:264` | `0.60` | – | `const permCompStress_t0 = 0.60 * fck_t0; // EC2 5.10.2.2: 0.60 * f_ck(t0)` |
| `src/modules/Spannbeton.tsx:278` | `0.60` | – | `const permCompStressRare = 0.60 * conc.fck; // EC2 7.2: 0.60 * f_ck` |
| `src/modules/Spannbeton.tsx:288` | `0.45` | – | `const permCompStressQuasi = 0.45 * conc.fck; // EC2 7.2: 0.45 * f_ck (lineares Kriechen)` |
| `src/modules/Spannbeton.tsx:304` | `0.75` | – | `const sigmaP_max_transfer = Math.min(0.75 * steel.fpk, 0.85 * steel.fp01k);` |
| `src/modules/Spannbeton.tsx:304` | `0.85` | – | `const sigmaP_max_transfer = Math.min(0.75 * steel.fpk, 0.85 * steel.fp01k);` |
| `src/modules/Spannbeton.tsx:306` | `0.75` | – | `const sigmaP_perm_char = 0.75 * steel.fpk;` |
| `src/modules/Spannbeton.tsx:307` | `0.65` | – | `const sigmaP_perm_quasi = 0.65 * steel.fpk;` |
| `src/modules/spannbeton/SpannbetonDauerhaftigkeit.tsx:70` | `1.5` | – | `c_min_b = Math.round(1.5 * strandDiameter);` |
| `src/modules/spannbeton/SpannbetonDehnungsAnimation.tsx:479` | `0.4` | – | `Q 310,${24 + beamDeflectPx} 590,${24 + beamDeflectPx * 0.4}` |
| `src/modules/spannbeton/SpannbetonDehnungsAnimation.tsx:480` | `0.4` | – | `L 590,${66 + beamDeflectPx * 0.4}` |
| `src/modules/spannbeton/SpannbetonDehnungsAnimation.tsx:481` | `0.4` | – | `Q 310,${66 + beamDeflectPx} 30,${66 + beamDeflectPx * 0.4} Z'}` |
| `src/modules/spannbeton/SpannbetonDehnungsAnimation.tsx:565` | `3000` | – | `const arrowLen = Math.min(22, (prestressForce / 3000) * 22);` |
| `src/modules/spannbeton/SpannbetonDehnungsAnimation.tsx:565` | `22` | – | `const arrowLen = Math.min(22, (prestressForce / 3000) * 22);` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:55` | `150` | – | `const strandArea = groutStrandCount * 150; // mm² (150 mm² je 0.6" Litze)` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:62` | `0.317` | ja | `const cementPerLiter = 1.0 / (0.317 + groutWz); // kg Zement je Liter Mörtel` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:68` | `25` | – | `const cementBags25 = Math.ceil(totalCementKg / 25);` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:154` | `28` | ja | `const beta_cc = Math.exp(s * (1 - Math.sqrt(28 / Math.max(0.1, t_eff))));` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:216` | `1.05` | – | `const k = (1.05 * Ecm * (eps_c1 / 1000)) / fcm;` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:267` | `195000` | – | `return { fck: 35, fcm: 43, Ecm: 34000, alpha_p: 195000 / 34000 };` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:267` | `34000` | – | `return { fck: 35, fcm: 43, Ecm: 34000, alpha_p: 195000 / 34000 };` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:270` | `195000` | – | `return { fck: 70, fcm: 78, Ecm: 41000, alpha_p: 195000 / 41000 };` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:270` | `41000` | – | `return { fck: 70, fcm: 78, Ecm: 41000, alpha_p: 195000 / 41000 };` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:272` | `195000` | – | `return { fck: 45, fcm: 53, Ecm: 36000, alpha_p: 195000 / 36000 };` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:272` | `36000` | – | `return { fck: 45, fcm: 53, Ecm: 36000, alpha_p: 195000 / 36000 };` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:312` | `0.8` | – | `const term_relaxation = 0.8 * delta_sig_pr;` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:317` | `0.8` | – | `const nenner = 1 + exConc.alpha_p * (Ap / Ac) * k_geom * (1 + 0.8 * phi);` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:358` | `3.2` | – | `? Math.max(1.8, 3.2 * Math.pow(calcT0, -0.22) * (45 / calcFck))` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:358` | `-0.22` | – | `? Math.max(1.8, 3.2 * Math.pow(calcT0, -0.22) * (45 / calcFck))` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:358` | `45` | – | `? Math.max(1.8, 3.2 * Math.pow(calcT0, -0.22) * (45 / calcFck))` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:359` | `-0.20` | – | `: Math.max(1.2, 2.0 * Math.pow(calcT0, -0.20) * (45 / calcFck));` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:359` | `45` | – | `: Math.max(1.2, 2.0 * Math.pow(calcT0, -0.20) * (45 / calcFck));` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:362` | `3.8` | – | `const estCsrLossPct = Math.min(30, Math.max(8, (estPhi * 3.8 + estEpsCs * 195000 / approxInitialPrestress * 100 * 0.7 + calcSteelLoss * 0.8)` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:362` | `195000` | – | `const estCsrLossPct = Math.min(30, Math.max(8, (estPhi * 3.8 + estEpsCs * 195000 / approxInitialPrestress * 100 * 0.7 + calcSteelLoss * 0.8)` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:362` | `0.7` | – | `const estCsrLossPct = Math.min(30, Math.max(8, (estPhi * 3.8 + estEpsCs * 195000 / approxInitialPrestress * 100 * 0.7 + calcSteelLoss * 0.8)` |
| `src/modules/spannbeton/SpannbetonKennwerte.tsx:362` | `0.8` | – | `const estCsrLossPct = Math.min(30, Math.max(8, (estPhi * 3.8 + estEpsCs * 195000 / approxInitialPrestress * 100 * 0.7 + calcSteelLoss * 0.8)` |
| `src/modules/spannbeton/kennwerte/KennwerteBeton.tsx:388` | `1.15` | – | `const maxSigmaY = Math.max(50, Math.ceil(matMaturity.fcm_t * 1.15 / 10) * 10);` |
| `src/modules/spannbeton/kennwerte/KennwerteBeton.tsx:392` | `0.75` | – | `Math.round(maxSigmaY * 0.75),` |
| `src/modules/spannbeton/kennwerte/KennwerteBeton.tsx:409` | `1.15` | – | `const maxSigmaY = Math.max(50, Math.ceil(matMaturity.fcm_t * 1.15 / 10) * 10);` |
| `src/modules/spannbeton/kennwerte/KennwerteBeton.tsx:410` | `560` | – | `const getX = (eps: number) => 70 + (eps / 4.0) * 560;` |
| `src/modules/spannbeton/kennwerte/KennwerteBeton.tsx:411` | `200` | – | `const getY = (sig: number) => 240 - (sig / maxSigmaY) * 200;` |
| `src/modules/spannbeton/kennwerte/KennwerteBeton.tsx:432` | `0.85` | – | `const ultY = getY(ultPt ? ultPt.sigma : matMaturity.fcm_t * 0.85);` |
| `src/modules/spannbeton/kennwerte/KennwerteEinpressmoertel.tsx:293` | `150` | – | `<span><MdText text={inhalt.texte.litzenbelegungAp} />{groutStrandCount * 150} mm²):</span>` |
| `src/modules/spannbeton/kennwerte/KennwerteRechner.tsx:131` | `195000` | – | `Entspricht {formatDeZahl((estEpsCs * 195000), 0)}<MdText text={inhalt.texte.nMmTheoretischemSpannungsabfall} /></p>` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 3 |  |
| DIN 1045-2 | 2023-08 | – | 1 | Ausgaben uneinheitlich |
| DIN 1076 | – | – | 1 |  |
| DIN 4227 | – | – | 1 |  |
| EN 197-1 | – | – | 2 |  |
| EN 206 | – | – | 1 |  |
| EN 206 | 2021-06 | – | 1 |  |
| EN 445 | – | – | 9 |  |
| EN 445 | 2008-01 | – | 1 |  |
| EN 446 | 2008-01 | – | 1 |  |
| EN 447 | – | – | 23 |  |
| EN 447 | 2017-09 | – | 1 |  |
| EN 523 | – | – | 3 |  |
| EN 523 | 2003-11 | – | 1 |  |
| EN 934-4 | – | – | 1 |  |
| EN 1990 | – | – | 1 |  |
| EN 1992-1-1/NA | – | – | 3 |  |
| EN 1992-1-1/NA | 2013-04 | – | 1 |  |
| EN 1992-1-1 | – | Abs. 2.4.2.2, Abs. 3.1.2, Abs. 3.1.4, Abs. 3.3.2, Abs. 4.4.1.2, Abs. 5.10.5, Abs. 5.10.5.2, Abs. 5.10.5.3, Abs. 5.10.6, Abs. 5.10.9, Abs. 7.2, Abs. 8.10.4, Anhang B, Bild 3.2, Gl. 3.1, Gl. 3.2, Gl. 3.5, Gl. 3.12, Gl. 3.14, Gl. 3.29, Gl. 4.1, Gl. 5.41, Gl. 5.43, Gl. 5.44, Gl. 5.45, Gl. 5.46, Gl. 6.63, Tab. 2, Tab. 3.1, Tab. 4.2 | 86 |  |
| EN 1992-1-1 | 2011-01 | – | 2 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2023 | – | 4 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-1-1 | 2025-09 | – | 3 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-2/NA | – | – | 1 |  |
| EN 1992-2/NA | 2013-04 | – | 1 |  |
| EN 1992-2 | – | – | 12 |  |
| EN 1992-2 | 2010-12 | – | 1 |  |
| EN 1992-3 | – | – | 1 |  |
| EN 10138 | – | – | 4 |  |
| EN 13554 | – | – | 1 |  |
| EN ISO 12696 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/spannbeton/Spannbeton.json › daten.Spannbeton.regelwerke.3.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton: Festlegung, Eigenschaften, Hers…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/spannbeton/Spannbeton.json › daten.Spannbeton.regelwerke.0.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 mit DIN EN 1992-1-1/NA:201…
  - 2025-09 (mit Hinweis): `content/spannbeton/Spannbeton.json › daten.Spannbeton.regelwerke.2.title` – DIN EN 1992-1-1:2025-09 (Deutsche Fassung EN 1992-1-1:2023, 2.…
  - 2023 (mit Hinweis): `content/spannbeton/Spannbeton.json › daten.Spannbeton.regelwerke.2.title` – DIN EN 1992-1-1:2025-09 (Deutsche Fassung EN 1992-1-1:2023, 2. Generation; ersetzt formal DIN EN 1…
  - 2011-01 (mit Hinweis): `content/spannbeton/Spannbeton.json › daten.Spannbeton.regelwerke.2.title` – …-09 (Deutsche Fassung EN 1992-1-1:2023, 2. Generation; ersetzt formal DIN EN 1992-1-1:2011-01, DIN EN 1992-2 und DIN EN 1992-3 – baua…
  - 2023 (mit Hinweis): `content/spannbeton/SpannbetonPrinzipien.json › texte.t82GenerationEc2` – 8. 2. Generation EC2 (EN 1992-1-1:2023)
  - 2023 (mit Hinweis): `content/spannbeton/SpannbetonPrinzipien.json › texte.ausblick2GenerationDes` – Ausblick: 2. Generation des Eurocode 2 (EN 1992-1-1:2023)
  - 2025-09: `content/spannbeton/SpannbetonPrinzipien.json › texte.dinEn199215` – DIN EN 1992-1-1:2025-09
  - 2023 (mit Hinweis): `content/spannbeton/SpannbetonPrinzipien.json › texte.dieEuropäischeNormungSteht` – …Modernisierungsschritt seit 2004. Die **2. Generation des Eurocode 2 (EN 1992-1-1:2023, in Deutschland als DIN EN 1992-1-1:202…
  - 2025-09 (mit Hinweis): `content/spannbeton/SpannbetonPrinzipien.json › texte.dieEuropäischeNormungSteht` – …**2. Generation des Eurocode 2 (EN 1992-1-1:2023, in Deutschland als DIN EN 1992-1-1:2025-09 veröffentlicht; bauaufsichtliche Einfüh…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- EN 1992-1-1:2025-09 (Registry 2011-01): `content/spannbeton/SpannbetonPrinzipien.json › texte.dinEn199215` – DIN EN 1992-1-1:2025-09

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

