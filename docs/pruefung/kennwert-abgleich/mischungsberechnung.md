# Kennwert-Abgleich: `mischungsberechnung`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `mischungsberechnung` (Betontechnologie, geprueft)
- **Komponente:** `src/modules/Mischungsberechnung.tsx`
- **Dateien (16):** `content/mischungsberechnung/GrenzwerteSection.json`, `content/mischungsberechnung/MischungEingaben.json`, `content/mischungsberechnung/MischungErgebnisse.json`, `content/mischungsberechnung/Mischungsberechnung.json`, `content/mischungsberechnung/WalzKurvenSection.json`, `content/mischungsberechnung/daten.json`, `content/mischungsberechnunganleitung/MischungsberechnungAnleitung.json`, `content/packungsdichte/Packungsdichte.json`, `src/modules/Mischungsberechnung.tsx`, `src/modules/MischungsberechnungAnleitung.tsx`, `src/modules/Packungsdichte.tsx`, `src/modules/mischungsberechnung/GrenzwerteSection.tsx`, `src/modules/mischungsberechnung/MischungEingaben.tsx`, `src/modules/mischungsberechnung/MischungErgebnisse.tsx`, `src/modules/mischungsberechnung/WalzKurvenSection.tsx`, `src/modules/mischungsberechnung/daten.ts`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 3 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 18 (11) |
| (3) Normverweise / Hinweise | 83 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (3): `PK_LEHRWERT.ePK` ×1, `PK_NETTO_SENKE_KG` ×2

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Mischungsberechnung.tsx:203` | `1.5` | ja | `const deltaLuftVol = Math.max(0, (luft - 1.5) * 10); // dm³/m³ Verdrängungsvolumen im Stoffraum` |
| `src/modules/Mischungsberechnung.tsx:205` | `1.5` | ja | `const empfohleneSandReduktion = Math.max(0, Math.round((luft - 1.5) * 1.0)); // M.-% Sandreduktion nach Walz` |
| `src/modules/Mischungsberechnung.tsx:206` | `1.5` | – | `const wasserEinsparungLP = isLpActive ? Math.max(0, (luft - 1.5) * 2.5) : 0; // L/m³` |
| `src/modules/Mischungsberechnung.tsx:206` | `2.5` | – | `const wasserEinsparungLP = isLpActive ? Math.max(0, (luft - 1.5) * 2.5) : 0; // L/m³` |
| `src/modules/Mischungsberechnung.tsx:301` | `0.02` | – | `const co2Sf = sf * 0.02;` |
| `src/modules/Mischungsberechnung.tsx:305` | `0.003` | ja | `const co2Gestein = masseGesteinTrocken * 0.003; // ca. 3 kg CO2 pro Tonne Gestein` |
| `src/modules/Mischungsberechnung.tsx:306` | `0.0003` | ja | `const co2Wasser = wasserTrocken * 0.0003; // ca. 0.3 kg CO2 pro m³ Wasser` |
| `src/modules/Mischungsberechnung.tsx:307` | `1.5` | ja | `const co2ZM = zusatzmittel * 1.5; // ca. 1.5 kg CO2 pro kg ZM` |
| `src/modules/Mischungsberechnung.tsx:308` | `1.90` | ja | `const co2Stahlfaser = stahlfaser * 1.90; // ca. 1.9 kg CO2 pro kg Stahlfaser (DIN EN 15804)` |
| `src/modules/Mischungsberechnung.tsx:309` | `2.10` | ja | `const co2PpFaser = ppFaser * 2.10; // ca. 2.1 kg CO2 pro kg PP-Faser` |
| `src/modules/Mischungsberechnung.tsx:395` | `1.5` | – | `const lpWaterReduction = isLpActive ? Math.max(0, (luft - 1.5) * 2.5) : 0;` |
| `src/modules/Mischungsberechnung.tsx:395` | `2.5` | – | `const lpWaterReduction = isLpActive ? Math.max(0, (luft - 1.5) * 2.5) : 0;` |
| `src/modules/mischungsberechnung/MischungEingaben.tsx:349` | `0.65` | – | `if (val === 'C20/25') setWasser(zement * 0.65);` |
| `src/modules/mischungsberechnung/MischungEingaben.tsx:350` | `0.60` | – | `else if (val === 'C25/30') setWasser(zement * 0.60);` |
| `src/modules/mischungsberechnung/MischungEingaben.tsx:351` | `0.55` | – | `else if (val === 'C30/37') setWasser(zement * 0.55);` |
| `src/modules/mischungsberechnung/MischungEingaben.tsx:353` | `0.45` | – | `else if (val === 'C40/50') setWasser(zement * 0.45);` |
| `src/modules/mischungsberechnung/MischungEingaben.tsx:354` | `0.40` | – | `else if (val === 'C45/55') setWasser(zement * 0.40);` |
| `src/modules/mischungsberechnung/MischungEingaben.tsx:355` | `0.35` | – | `else if (val === 'C50/60') setWasser(zement * 0.35);` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | Anhang L, Tab. 13, Tab. F.2.2, Tab. F.4.1 | 29 |  |
| DIN 1045-2 | 2008-08 | Tab. F.4.1 | 1 | Ausgaben uneinheitlich; Registry 2023-08 |
| DIN 1045-2 | 2023-08 | Abschn. 5.2.5.2.3 | 15 | Ausgaben uneinheitlich |
| DIN 1045 | – | – | 4 |  |
| EN 197-1 | 2011-11 | – | 1 |  |
| EN 197-5 | 2021-07 | – | 1 |  |
| EN 206 | – | – | 6 |  |
| EN 206 | 2021-06 | – | 7 |  |
| EN 933 | – | – | 1 |  |
| EN 1097-6 | – | – | 1 |  |
| EN 12620 | – | – | 1 |  |
| EN 12620 | 2008-07 | – | 2 |  |
| EN 14889-1 | – | – | 4 |  |
| EN 14889-1 | 2006-11 | – | 1 |  |
| EN 14889-2 | – | – | 4 |  |
| EN 14889-2 | 2006-11 | – | 1 |  |
| EN 14889 | 2006-11 | – | 1 |  |
| EN 15167-1 | – | – | 2 |  |
| EN 15804 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (145×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/mischungsberechnung/MischungEingaben.json › texte.achtungXf4IstNach` – **Achtung:** XF4 ist nach DIN 1045-2:2023-08 nur als Luftporenbeton (LP) geregelt. B…
  - 2023-08: `content/mischungsberechnung/MischungEingaben.json › texte.din104522023` – DIN 1045-2:2023-08: Anrechnung von Silikastaub mit k = 1,0…
  - 2023-08: `content/mischungsberechnung/MischungEingaben.json › werte.nachDin10452` – Nach DIN 1045-2:2023-08, Abschn. 5.2.5.2.3 darf Silikastaub mit…
  - 2023-08: `content/mischungsberechnung/MischungErgebnisse.json › werte.dinEn2062021` – DIN EN 206:2021-06; DIN 1045-2:2023-08
  - 2023-08: `content/mischungsberechnung/Mischungsberechnung.json › werte.din104522023` – DIN 1045-2:2023-08 (Grenzwerte je Expositionsklasse); k-We…
  - 2023-08: `content/mischungsberechnung/Mischungsberechnung.json › daten.Mischungsberechnung.regelwerke.0.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Tragwerke aus Beton: Festlegung, Eigen…
  - 2023-08: `content/mischungsberechnung/Mischungsberechnung.json › daten.Mischungsberechnung.formeln.0.erklaerung` – Stoffraumgleichung für 1 m³ Beton nach DIN EN 206:2021-06 / DIN 1045-2:2023-08: Summe der Feststoffvolumina (Zement z,…
  - 2023-08: `content/mischungsberechnung/Mischungsberechnung.json › daten.Mischungsberechnung.formeln.0.quelle` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 / DIN EN 14889:2006-11
  - 2023-08: `content/mischungsberechnung/Mischungsberechnung.json › daten.Mischungsberechnung.formeln.1.erklaerung` – …stoffen (z.B. Flugasche mit k = 0,4 oder Silikastaub mit k = 1,0 nach DIN 1045-2:2023-08; der Empfehlungswert k = 2,0 der DIN EN…
  - 2023-08: `content/mischungsberechnung/Mischungsberechnung.json › daten.Mischungsberechnung.formeln.1.quelle` – DIN 1045-2:2023-08 / DIN EN 206:2021-06
  - 2023-08: `content/mischungsberechnung/Mischungsberechnung.json › daten.Mischungsberechnung.formeln.2.quelle` – DIN 1045-2:2023-08 / DBV-Merkblatt Beton
  - 2023-08: `content/mischungsberechnunganleitung/MischungsberechnungAnleitung.json › daten.MischungsberechnungAnleitung.regelwerke.1.title` – DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Sp…
  - 2023-08: `content/mischungsberechnunganleitung/MischungsberechnungAnleitung.json › daten.MischungsberechnungAnleitung.formeln.0.quelle` – DIN 1045-2:2023-08 / DIN EN 206:2021-06
  - 2023-08: `src/modules/Mischungsberechnung.tsx:59` – const [kSf, setKSf] = useState(1.0); // DIN 1045-2:2023-08, 5.2.5.2.3: k = 1,0 (s ≤ 0,11·z); bei X…
  - 2008-08: `src/modules/Mischungsberechnung.tsx:295` – const maxMehlkornText = `\${formatDeWert(maxMehlkornWert)} kg/m³ (DIN 1045-2:2008-08, Tab. F.4.1; in der Ausgabe 2023-08 ent…
  - 2023-08: `src/modules/Mischungsberechnung.tsx:360` – // DIN 1045-2:2023-08 regelt XF4 nur als LP-Beton – ohne LP k…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- DIN 1045-2:2008-08 (Registry 2023-08): `src/modules/Mischungsberechnung.tsx:295` – const maxMehlkornText = `\${formatDeWert(maxMehlkornWert)} kg/m³ (DIN 1045-2:2008-08, Tab. F.4.1; in der Ausgabe 2023-08 ent…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

