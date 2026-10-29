# Kennwert-Abgleich: `sonderbetone`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `sonderbetone` (Betontechnologie, geprueft)
- **Komponente:** `src/modules/Sonderbetone.tsx`
- **Dateien (30):** `content/bohrpfahlbeton/Bohrpfahlbeton.json`, `content/draenbeton/Draenbeton.json`, `content/faserbeton/Faserbeton.json`, `content/infraleichtbeton/Infraleichtbeton.json`, `content/leichtbeton/Leichtbeton.json`, `content/massenbeton/Massenbeton.json`, `content/pumpbeton/Pumpbeton.json`, `content/recyclingbeton/Recyclingbeton.json`, `content/schleuderbeton/Schleuderbeton.json`, `content/schwerbeton/Schwerbeton.json`, `content/sonderbetone/Sonderbetone.json`, `content/spritzbeton/Spritzbeton.json`, `content/svb/SVB.json`, `content/uhpc/UHPC.json`, `content/uwbeton/UwBeton.json`, `src/modules/Bohrpfahlbeton.tsx`, `src/modules/Draenbeton.tsx`, `src/modules/Faserbeton.tsx`, `src/modules/Infraleichtbeton.tsx`, `src/modules/Leichtbeton.tsx`, `src/modules/Massenbeton.tsx`, `src/modules/Pumpbeton.tsx`, `src/modules/Recyclingbeton.tsx`, `src/modules/SVB.tsx`, `src/modules/Schleuderbeton.tsx`, `src/modules/Schwerbeton.tsx`, `src/modules/Sonderbetone.tsx`, `src/modules/Spritzbeton.tsx`, `src/modules/UHPC.tsx`, `src/modules/UwBeton.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 10 (4) |
| (3) Normverweise / Hinweise | 82 / 2 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Leichtbeton.tsx:12` | `0.8` | – | `const fc = Math.max(2, (dichte - 0.8) * 35);` |
| `src/modules/Leichtbeton.tsx:12` | `35` | – | `const fc = Math.max(2, (dichte - 0.8) * 35);` |
| `src/modules/Leichtbeton.tsx:13` | `0.4` | – | `const lambda = Math.max(0.15, (dichte - 0.4) * 0.4); // thermal conductivity` |
| `src/modules/Recyclingbeton.tsx:55` | `0.15` | ja | `wasseranspruchErhoehung = rcAnteil * 0.15; // ca. 15% mehr Wasserbedarf` |
| `src/modules/Recyclingbeton.tsx:56` | `0.30` | ja | `schwindenErhoehung = rcAnteil * 0.30; // ca. 30% mehr Schwinden bei 100%` |
| `src/modules/Recyclingbeton.tsx:57` | `0.06` | ja | `rohdichteReduktion = rcAnteil * 0.06; // ca. 6% geringere Dichte bei 100%` |
| `src/modules/Recyclingbeton.tsx:61` | `0.40` | ja | `eModulReduktion = rcAnteil * 0.40; // ca. 40% Reduktion bei 100% RC` |
| `src/modules/Recyclingbeton.tsx:62` | `0.30` | – | `wasseranspruchErhoehung = rcAnteil * 0.30;` |
| `src/modules/Recyclingbeton.tsx:64` | `0.12` | ja | `rohdichteReduktion = rcAnteil * 0.12; // ca. 12% geringere Dichte bei 100%` |
| `src/modules/Recyclingbeton.tsx:75` | `1800` | ja | `const zusatzWasser = (rcAnteil / 100) * 1800 * (wa24 / 100); // grobe Schätzung: 1800 kg/m³ Gestein gesamt` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 1045-2 | – | – | 10 |  |
| DIN 1045-2 | 2023-08 | Abschn. 5.2.3.4 | 9 | Ausgaben uneinheitlich |
| DIN 4226-101 | – | – | 1 |  |
| DIN 6847-2 | 2008-03 | – | 1 |  |
| DIN 18314 | – | – | 1 |  |
| DIN 18551 | 2014-08 | – | 1 |  |
| DIN 24200 | – | – | 1 |  |
| DIN 25413-1 | – | – | 1 |  |
| DIN 25413-1 | 1995-10 | – | 1 |  |
| EN 197-1 | – | – | 1 |  |
| EN 206-1 | – | – | 1 |  |
| EN 206 | – | Abs. 4.3 | 15 |  |
| EN 206 | 2021-06 | – | 3 |  |
| EN 1536 | – | – | 3 |  |
| EN 1536 | 2015-10 | – | 1 |  |
| EN 1916 | – | – | 1 |  |
| EN 1992-1-1 | – | Abs. 11.3.1, Abs. 11.3.2, Abschn. 11, Abschn. 11.3.2, Tab. 11.3.1 | 7 |  |
| EN 1992-1-1 | 2011-01 | – | 1 | Ausgaben uneinheitlich |
| EN 1992-1-1 | 2025-09 | – | 1 | Ausgaben uneinheitlich; Registry 2011-01 |
| EN 1992-3 | – | – | 1 |  |
| EN 12350-8 | – | – | 4 |  |
| EN 12350-9 | – | – | 2 |  |
| EN 12350-12 | – | – | 1 |  |
| EN 12620 | – | – | 2 |  |
| EN 12620 | 2008-07 | – | 1 |  |
| EN 12843 | – | – | 2 |  |
| EN 13055 | 2016-11 | – | 1 |  |
| EN 14487-1 | – | – | 1 |  |
| EN 14487 | – | – | 2 |  |
| EN 14651 | – | – | 3 |  |
| EN 14889-1 | – | – | 1 |  |
| EN 14889-2 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 1045-2:** 2008 (2×), 2008-08 (5×), 2023 (6×, teils mit Hinweis auf andere Ausgabe), 2023-08 (139×, teils mit Hinweis auf andere Ausgabe)
  - 2023-08: `content/bohrpfahlbeton/Bohrpfahlbeton.json › texte.mindestzementgehalt325KgM` – …mm) bzw. ≥ 450 kg/m³ (D ≤ 8 mm), w/z(eq) ≤ 0,60 (DIN EN 1536 i. V. m. DIN 1045-2:2023-08).
  - 2023-08 (mit Hinweis): `content/sonderbetone/Sonderbetone.json › werte.lehrwerteZulässigeAnteileNach` – Lehrwerte; zulässige Anteile nach DIN 1045-2:2023-08, Abschn. 5.2.3.4 und Anhang E (Tab. E.5…
  - 2023-08: `content/sonderbetone/Sonderbetone.json › daten.Sonderbetone.regelwerke.0.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Leichtbetonklassen LC8/9 bis LC80/88,…
  - 2023-08: `content/sonderbetone/Sonderbetone.json › daten.Sonderbetone.regelwerke.11.title` – DIN 1045-2:2023-08 (Beton mit rezyklierter Gesteinskörnung…
  - 2023-08: `content/sonderbetone/Sonderbetone.json › daten.Sonderbetone.regelwerke.31.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Schwerbeton mit Trockenrohdichte > 260…
  - 2023-08: `content/sonderbetone/Sonderbetone.json › daten.Sonderbetone.regelwerke.42.title` – DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton: Festlegung, Eigenschaften, Hers…
  - 2023-08: `src/modules/Recyclingbeton.tsx:48` – // Grenzwerte grobe RC-Gesteinskörnung nach DIN 1045-2:2023-08 (Zement-Merkblatt B30, Tafel 6); Eigens…
  - 2023-08: `src/modules/Recyclingbeton.tsx:69` – …s = `Der Anteil von \${formatDeWert(rcAnteil)}% überschreitet den nach DIN 1045-2:2023-08 zulässigen Maximalwert von \${formatDeWe…
  - 2023-08: `src/modules/Recyclingbeton.tsx:71` – …nteil von \${formatDeWert(rcAnteil)}% liegt innerhalb der Grenzen nach DIN 1045-2:2023-08 (max. \${formatDeWert(maxAnteil)}% für \$…
- **EN 1992-1-1:** 2011 (7×), 2011-01 (49×, teils mit Hinweis auf andere Ausgabe), 2023 (23×, teils mit Hinweis auf andere Ausgabe), 2025-09 (25×, teils mit Hinweis auf andere Ausgabe)
  - 2011-01 (mit Hinweis): `content/sonderbetone/Sonderbetone.json › daten.Sonderbetone.regelwerke.1.title` – DIN EN 1992-1-1:2011-01 mit NA:2013-04, Abschnitt 11 (Leichtbet…
  - 2025-09 (mit Hinweis): `content/sonderbetone/Sonderbetone.json › daten.Sonderbetone.regelwerke.1.title` – …92-1-1:2011-01 mit NA:2013-04, Abschnitt 11 (Leichtbeton); Neuausgabe DIN EN 1992-1-1:2025-09

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

