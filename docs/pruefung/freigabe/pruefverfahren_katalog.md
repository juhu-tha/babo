# Freigabepaket: Bauwerksdiagnose – Prüfverfahren-Katalog (`pruefverfahren_katalog`)

Stand 04.11.2026 · Gruppe „Bauen im Bestand“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T12-BU-7** – Neun Nachrechnungen identisch, fünf Fehler behoben; offen sind die Rückprall-Verwerfungsregel am Normtext und zwei kleine Widersprüche aus den Hinweisen der Tranche 12.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Bauwerksdiagnose, Teil 2, für Bauen im Bestand (Termin 4): Katalog von 14 zerstörungsfreien, minimalinvasiven und zerstörenden Prüfverfahren mit Normen und Diagnosehinweisen, dazu Simulatoren für Rückprall, Karbonatisierung, Bohrkern, Ultraschall, Impact-Echo und Karsten-Röhrchen.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: Bauen im Bestand.

## Reiter und Bereiche

Bereich „Prüfkatalog (14 Verfahren)“ der Komponente Bauwerksuntersuchung (Teilmodul seit #231; die Bereiche Diagnose, Probenahme und Interpretation gehören zu `bauwerksdiagnose`, DGZfP zu `zfp`).

Komponente `src/modules/Bauwerksuntersuchung.tsx`; Inhalt `content/bauwerksuntersuchung/Bauwerksuntersuchung.json`, `content/bauwerksuntersuchung/InterpretationNavigator.json`, `content/bauwerksuntersuchung/ProbenahmePlaner.json`, `content/bauwerksuntersuchung/PruefverfahrenKatalog.json`, `content/bauwerksuntersuchung/PruefverfahrenSimulatoren.json`, `content/bauwerksuntersuchung/diagnoseData.json`, `content/bauwerksuntersuchung/pruefverfahrenData.json`, `content/zfp/AkustischTab.json`, `content/zfp/DgzfpTab.json`, `content/zfp/ElektrochemischTab.json`, `content/zfp/ElektromagnetischTab.json`, `content/zfp/HolzTab.json`, `content/zfp/MechanischTab.json`, `content/zfp/ThermischTab.json`, `content/zfp/ZfP.json`, `content/zfp/daten.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/pruefverfahren.ts` | `tests/pruefverfahren.test.ts` (78), `tests/durchsichtC.test.ts` (21), `tests/karsten.test.ts` (10), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/modulpruefungTranche4.test.ts` (61), `tests/modulpruefungTranche9.test.ts` (38) und 4 weitere | Simulatoren des Katalogs (GUM-Messunsicherheit, Potential, Torrent) |
| `src/calc/karsten.ts` | `tests/karsten.test.ts` (10), `tests/keinErgebnisAnzeige.test.ts` (1) | Karsten 2,5 ml in 60 min, A = 5,73 cm² → w = 4,36 kg/(m²√h) → wassersaugend |
| `src/calc/bauwerksuntersuchung.ts` | `tests/bauwerksuntersuchung.test.ts` (38), `tests/durchsichtA.test.ts` (49), `tests/hist13791.test.ts` (51), `tests/karsten.test.ts` (10), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/lebensdauerUebergabe.test.ts` (35) und 6 weitere | R = 30 abwärts, d_k = 15 mm → R_korr = 33,0, f_c = 20,5 N/mm²; 0,40 m/95 µs → v_p = 4211 m/s, E_dyn = 38,3 GPa; Impact-Echo 6 kHz → d = 32,0 cm |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T12-BU-2 | Bewehrungsortung: c_min-Angaben widersprachen Tab. 4.4DE und dem Kern | erledigt (behoben) | T12 (`module-tranche-12.md`) (Nr. 6) |
| T12-BU-3 | Karsten-Klassen widersprachen DIN 4108-3 und dem Kern; Prüffläche 4,5 → 5,73 cm² | erledigt (behoben) | T12 (`module-tranche-12.md`) |
| T12-BU-4 | Ausgaben DIN EN 12504-1:2021-02, -2 und -4:2021-10 | erledigt (behoben) | T12 (`module-tranche-12.md`) |
| T12-BU-7 | Rückprall: „Ausreißer > 6 Einheiten streichen“ → Median aller Werte, Messsatz verwerfen bei > 20 % mit > 6 Einheiten (Kern `rueckprallMesssatz`) | erledigt (umgesetzt, als vorläufig gekennzeichnet); offen (Normtext) | T12 (`module-tranche-12.md`), Umsetzung 29.10. |
| Hinweis T12 (a) | Gefügestufen Ultraschall: Kern < 3000 kritisch, < 3800 mäßig (`src/calc/bauwerksuntersuchung.ts:173`); Texte nennen 3000–3500 / 3500–4200 / > 4500 m/s | offen (nicht angeglichen) | T12 (`module-tranche-12.md`) |
| Hinweis T12 (b) | Ablesezeit Phenolphthalein: 30–60 s in Diagnosedaten und Planer, „60 bis 120 s abwarten“ im Prüfkatalog (`content/bauwerksuntersuchung/pruefverfahrenData.json:146`) | offen (nicht angeglichen) | T12 (`module-tranche-12.md`) |
| Befund 04.11. | Ausgabenzuordnung der Verwerfungsregel widersprüchlich: Kern-Hinweis und Simulator nennen „6 Einheiten nach DIN EN 12504-2:2012; nach Sekundärquellen nennt die Ausgabe 2021-10 25 % des Medians“ (`src/calc/bauwerksuntersuchung.ts:129`); Kernkopf, `Probenahme.json` und `pruefverfahrenData.json` schreiben die 6-Einheiten-Regel der Ausgabe 2021-10 zu | offen (klärt sich mit T4-PN-2 am Normtext) | `bearbeitungsvermerke-2026-11-02.md`, Nr. 34/35 und „Offen“ |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T12-BU-7 (Nr. 1) | DIN EN 12504-2:2021-10, Auswertung | Messsatz verwerfen: > 20 % der Werte mehr als 6 Einheiten vom Median (Ausgabe 2012) oder 25 % des Medians (Ausgabe 2021-10 laut Sekundärquellen)? | `content/bauwerksuntersuchung/pruefverfahrenData.json:51`; Kern `src/calc/bauwerksuntersuchung.ts:109` |

## Quizfragen

7 Fragen, davon 6 nicht freigegeben: `qt_pruefverfahren_katalog_1`, `qt_pruefverfahren_katalog_2`, `qt_pruefverfahren_katalog_3`, `qt_pruefverfahren_katalog_4`, `qt_pruefverfahren_katalog_5`, `qlz_pruefverfahren_katalog_1`.
 Fünf Fragen `qt_pruefverfahren_katalog_*` sind neu und noch nicht freigegeben.

## Quellen

DIN EN 12504-1/-2/-4:2021, DIN EN 13791:2020-02, DIN EN 14630, DIN 4108-3 (Karsten-Klassen), DIN EN 1992-1-1/NA Tab. 4.4DE, ASTM C876, DIN 1076:2026-01. Befundliste Tranche 12, Nr. 6.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Rückprall R = 30, Schlag nach unten, d_k = 15 mm: Richtungskorrektur +3,01 → 33,0; k = 0,85 → 28,06; f_c = 0,0125·28,06^2,22 = 20,5 N/mm² (Lehrkurve).
2. Ultraschall: 0,40 m in 95 µs → v_p = 4211 m/s, E_dyn = 38,3 GPa (ρ = 2400 kg/m³); Impact-Echo 6 kHz bei v_p = 4000 m/s → d = 32,0 cm.
3. Karsten-Röhrchen: 2,5 ml in 60 min, A = 5,73 cm² → w = 4,36 kg/(m²√h) → wassersaugend (≤ 0,5 wasserabweisend, ≤ 2,0 wasserhemmend).
4. Karbonatisierung: d_k = 15 mm nach 36 a → K = 2,5 mm/√a; c = 25 mm → Depassivierung nach 100 a.
5. Verwerfungsregel Rückprall am Normtext DIN EN 12504-2:2021-10 klären (6 Einheiten oder 25 % des Medians) – entscheidet zugleich `probenahme`, `labor` und `bauwerksunters_monitoring`.
6. Entscheiden: Gefügestufen Ultraschall (Kern 3000/3800 m/s gegen Text 3000/3500/4500 m/s) und Ablesezeit Phenolphthalein (30–60 s gegen 60–120 s) angleichen.

## Empfehlung

**freigabereif nach Klärung von T12-BU-7.** T12-BU-2 bis -4 sind behoben, T12-BU-7 ist umgesetzt und gekennzeichnet. Vor der Freigabe sind zwei Hinweise aus Tranche 12 noch nicht angeglichen (Ultraschall-Gefügestufen, Ablesezeit Phenolphthalein); beides sind Textwidersprüche, die eine fachliche Festlegung brauchen. Die Ausgabenzuordnung der Verwerfungsregel ist im Code widersprüchlich (Befund 04.11.).

Auch nach der Regel der Freigabe vom 02.11.2026 (gekennzeichnete Normtextpunkte gelten als erledigt) bleiben hier zwei Textwidersprüche zu entscheiden: Ultraschall-Gefügestufen und Ablesezeit Phenolphthalein.
