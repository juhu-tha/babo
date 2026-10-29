# Kennwert-Abgleich: `biegebemessung`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `biegebemessung` (–, offen), `durchstanzen` (–, offen), `querkraftbemessung` (–, offen), `rissbreite` (–, offen), `spannung` (–, offen), `stahlbeton_bemessung` (Massivbau, offen), `stuetzenbemessung` (–, offen), `verankerungslaenge` (–, offen)
- **Komponente:** `src/modules/Stahlbetonbemessung.tsx`
- **Dateien (18):** `content/biegebemessung/Biegebemessung.json`, `content/durchstanzen/Durchstanzen.json`, `content/querkraftbemessung/Querkraftbemessung.json`, `content/rissbreite/Rissbreite.json`, `content/spannungdehnung/SpannungDehnung.json`, `content/stahlbeton/StahlbetonNullBisHundert.json`, `content/stahlbetonbemessung/Stahlbetonbemessung.json`, `content/stuetzenbemessung/Stuetzenbemessung.json`, `content/verankerungslaenge/Verankerungslaenge.json`, `src/modules/Biegebemessung.tsx`, `src/modules/Durchstanzen.tsx`, `src/modules/Querkraftbemessung.tsx`, `src/modules/Rissbreite.tsx`, `src/modules/SpannungDehnung.tsx`, `src/modules/Stahlbetonbemessung.tsx`, `src/modules/Stuetzenbemessung.tsx`, `src/modules/Verankerungslaenge.tsx`, `src/modules/stahlbeton/StahlbetonNullBisHundert.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 8 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 12 (10) |
| (3) Normverweise / Hinweise | 84 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (8): `CONCRETE['C20/25'].Ecm` ×1, `CONCRETE['C25/30'].Ecm` ×1, `CONCRETE['C30/37'].Ecm` ×1, `CONCRETE['C35/45'].Ecm` ×1, `CONCRETE['C40/50'].Ecm` ×1, `CONCRETE['C45/55'].Ecm` ×1, `CONCRETE['C50/60'].Ecm` ×1, `E_BETONSTAHL` ×1

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Durchstanzen.tsx:290` | `200` | – | `formel: 'k = \\min\\left(1 + \\sqrt{\\tfrac{200}{${formatDeTeX(d, 0)}}};\\, 2\\right) = ${formatDeTeX(Math.min(1 + Math.sqrt(200 / d), 2.0),` |
| `src/modules/Durchstanzen.tsx:295` | `200` | – | `formel: 'v_{Rd,c} = \\max\\left(${formatDeTeX(results.CRdc, 4)} \\cdot ${formatDeTeX(Math.min(1 + Math.sqrt(200 / d), 2.0), 3)} \\cdot (100 ` |
| `src/modules/Durchstanzen.tsx:295` | `0.0525` | – | `formel: 'v_{Rd,c} = \\max\\left(${formatDeTeX(results.CRdc, 4)} \\cdot ${formatDeTeX(Math.min(1 + Math.sqrt(200 / d), 2.0), 3)} \\cdot (100 ` |
| `src/modules/Durchstanzen.tsx:295` | `1.5` | – | `formel: 'v_{Rd,c} = \\max\\left(${formatDeTeX(results.CRdc, 4)} \\cdot ${formatDeTeX(Math.min(1 + Math.sqrt(200 / d), 2.0), 3)} \\cdot (100 ` |
| `src/modules/Durchstanzen.tsx:312` | `500` | – | `? 'A_{sw} = \\frac{(${formatDeTeX(results.vEd_stress, 3)} - 0{,}75 \\cdot ${formatDeTeX(results.vRdc, 3)}) \\cdot ${formatDeTeX(results.u1, ` |
| `src/modules/Querkraftbemessung.tsx:311` | `200` | – | `formel: 'k = \\min\\left(1 + \\sqrt{\\tfrac{200}{${formatDeTeX(results.d * 10, 0)}}};\\, 2\\right) = ${formatDeTeX(Math.min(2, 1 + Math.sqrt` |
| `src/modules/Querkraftbemessung.tsx:316` | `500` | – | `formel: 'V_{Rd,max} = \\frac{b \\cdot z \\cdot \\nu_1 \\cdot f_{cd}}{\\tan\\theta + \\cot\\theta} = \\frac{${formatDeTeX(b / 100, 2)} \\cdot` |
| `src/modules/Rissbreite.tsx:493` | `200000` | – | `erklaerung: 'Gl. (7.9) mit k_t = ${formatDeZahl(kt, 1)} und α_e = E_s/E_cm = ${formatDeZahl(200000 / ecm, 2)}; Untergrenze 0,6 · σ_s/E_s.',` |
| `src/modules/Rissbreite.tsx:494` | `200000` | – | `formel: '\\varepsilon_{sm} - \\varepsilon_{cm} = \\max\\left(\\frac{${formatDeTeX(sigmaS, 0)} - ${formatDeTeX(kt, 1)} \\cdot \\frac{${format` |
| `src/modules/stahlbeton/StahlbetonNullBisHundert.tsx:58` | `500` | ja | `const fyd = 500 / 1.15; // 434.78 N/mm2` |
| `src/modules/stahlbeton/StahlbetonNullBisHundert.tsx:58` | `1.15` | ja | `const fyd = 500 / 1.15; // 434.78 N/mm2` |
| `src/modules/stahlbeton/StahlbetonNullBisHundert.tsx:515` | `2.01` | – | `z. B. {formatDeWert(Math.ceil(As_erf_cm2 / 2.01))}<MdText text={inhalt.texte.t16MmStäbe} /></span>` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 488-1 | – | – | 2 |  |
| DIN 488-1 | 2009-08 | – | 1 |  |
| DIN 488 | – | – | 1 |  |
| EN 1992-1-1/NA | – | Abs. 7.3.2, Abs. 9.2.1.1, Gl. 6.2, Gl. 6.7, Gl. 6.9, Gl. 7.11DE, Gl. 9.5 | 22 |  |
| EN 1992-1-1/NA | 2013-04 | – | 4 |  |
| EN 1992-1-1 | – | Abs. 5.8.3.1, Abs. 6.1, Gl. 3.14, Gl. 6.8, Gl. 7.8, Gl. 7.9 | 46 |  |
| EN 1992-1-1 | 2011-01 | – | 4 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2023 | – | 2 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-1-1 | 2025-09 | – | 2 | Ausgaben uneinheitlich; Registry 2011-01 |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01: `content/querkraftbemessung/Querkraftbemessung.json › texte.vereinfachungenHebelarmZ0` – …e Wiedergabe): Prüfamt-Tipp 15/04 „Hebelarm z der inneren Kräfte nach DIN EN 1992-1-1:2011-01 in Verbindung mit DIN EN 1992-1-1/NA:20…
  - 2023 (mit Hinweis): `content/stahlbetonbemessung/Stahlbetonbemessung.json › texte.t2GenerationDesEurocode` – 2. Generation des Eurocode 2 (EN 1992-1-1:2023, deutsche Fassung DIN EN 1992-1-1:2025-…
  - 2025-09 (mit Hinweis): `content/stahlbetonbemessung/Stahlbetonbemessung.json › texte.t2GenerationDesEurocode` – 2. Generation des Eurocode 2 (EN 1992-1-1:2023, deutsche Fassung DIN EN 1992-1-1:2025-09; bauaufsichtlich noch nicht eingeführt,…
  - 2023 (mit Hinweis): `content/stahlbetonbemessung/Stahlbetonbemessung.json › texte.die2GenerationDes` – Die 2. Generation des Eurocode 2 (EN 1992-1-1:2023) führt fundamentale mechanische und nac…
  - 2011-01 (mit Hinweis): `content/stahlbetonbemessung/Stahlbetonbemessung.json › texte.dieBemessungsprogrammeUndNachweise` – …echnische Baubestimmungen (MVV TB) verbindlich eingeführten Fassung **DIN EN 1992-1-1:2011-01 + A1:2015 + DIN EN 1992-1-1/NA:2013-04*…
  - 2011-01: `content/stahlbetonbemessung/Stahlbetonbemessung.json › daten.Stahlbetonbemessung.regelwerke.0.title` – DIN EN 1992-1-1:2011-01 + A1:2015-03 + DIN EN 1992-1-1/NA:2013-…
  - 2025-09 (mit Hinweis): `content/stahlbetonbemessung/Stahlbetonbemessung.json › daten.Stahlbetonbemessung.regelwerke.1.title` – DIN EN 1992-1-1:2025-09 (Eurocode 2, 2. Generation – bauaufsich…
  - 2011-01: `content/stahlbetonbemessung/Stahlbetonbemessung.json › daten.Stahlbetonbemessung.literatur.4` – …Brandenburg: Prüfamt-Tipp 15/04 – Hebelarm z der inneren Kräfte nach DIN EN 1992-1-1:2011-01 in Verbindung mit DIN EN 1992-1-1/NA:20…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

