# Freigabepaket: Energieausweis (GModG / GEG) (`energieausweis`)

Stand 04.11.2026 · Gruppe „Bauphysik“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Rechtsstand GModG geprüft und umgesetzt, Rechner in sechs Fällen nachgerechnet; offen ist der Wert der internen Gewinne (Kern 35, Text 25–30 kWh/(m²a)). Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Energieausweis nach dem Gebäudemodernisierungsgesetz (GModG, seit 29.07.2026, vormals GEG) für Bauen im Bestand (Termin 11): Bedarfs- und Verbrauchsausweis, Effizienzklassen A+ bis H, Lehrrechner Wohngebäude (Monatsbilanz vereinfacht) mit Stichtagsschalter für den Rechtsstand bis 31.12.2026 und ab 01.01.2027.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: Bauen im Bestand, VNHB, Zertifikat Ausbau und Bestand.

## Reiter und Bereiche

Reiter laut Komponente: Übersicht & Skala (`uebersicht`) · Annahmen & 3-Stufen-Rechnung (`annahmen_berechnung`) · Interaktiver Bedarfs-Rechner (`simulator`) · Praxis, Rebound & GModG-Recht (`praxis_recht`).

Komponente `src/modules/Energieausweis.tsx`; Inhalt `content/energieausweis/Energieausweis.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/energieausweis.ts` | `tests/energieausweis.test.ts` (18), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/konsistenz1029.test.ts` (60), `tests/modulpruefungTranche11.test.ts` (26), `tests/modulpruefungTranche12.test.ts` (51) | EFH, A_N = 150 m², GEG-Standard, Fensterlüftung, Luft-Wasser-WP: H_T = 128,85 W/K, q_h = 31, q_E = 18 kWh/(m²a) → A+, q_P = 32, CO₂ = 10 kg/(m²a) |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T11-EA-1 | Rechtsstand GModG (Verfahren, Verkündung BGBl. 2026 I Nr. 226, Stufen 29.07.2026/01.01.2027, Referenzgebäude, Verbrauchsausweis, Gültigkeit, Normen) | erledigt (behoben) | T11 (`module-tranche-11.md`) (Nr. 5) |
| T11-EA-2 | Primärenergiefaktoren ab 01.01.2027 → Stichtagsschalter, f_P nach neuer Anlage 4 (fossil 1,1, biogen 0,7, Strom 1,5, Fernwärme 0,7) | erledigt (umgesetzt) (29.10.) | T11 (`module-tranche-11.md`), Umsetzung 29.10. |
| T11-EA-3 | CO₂-Faktoren → Anlage 9 (Gas 240, Öl 310, Holz 20, Strom 560 g/kWh); ab 2027 Strom 100 g/kWh vorläufig, Fernwärme 120 Lehrwert | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T11 (`module-tranche-11.md`), Umsetzung 29.10. |
| T11-EA-4 | Interne Gewinne: Kern 35 kWh/(m²a), Text 25–30 kWh/(m²a) bzw. DIN V 18599-10 → als Lehrwert gekennzeichnet | offen (Normtext) | T11 (`module-tranche-11.md`), Umsetzung 29.10. |
| QZ-2 | Quiz `q_ea_1`/`q_ea_2` an den Rechtsstand 2027 angepasst (Freigaben zurückgesetzt) | erledigt (umgesetzt) | T11 (`module-tranche-11.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T11-EA-4 | DIN/TS 18599-10:2025-10, Nutzungsprofil Wohnen, interne Wärmequellen | Einheitlicher Wert der internen Gewinne für Kern und Text | Kern: `q_intern = 35` kWh/(m²a) – `src/calc/energieausweis.ts:80`; Text: „q_i = 5 W/m² … rund 25 bis 30 kWh/(m²·a)“, „DIN V 18599-10 … EFH 45 Wh/(m²·d), MFH 90 Wh/(m²·d)“ – `content/energieausweis/Energieausweis.json:49` |

## Quizfragen

6 Fragen, davon 2 nicht freigegeben: `q_ea_1`, `q_ea_2`.

## Quellen

GModG (BGBl. 2026 I Nr. 226), Anlage 4 und Anlage 9 (Haufe-Synopse, buzer.de), DIN/TS 18599-10:2025-10 (Normtext nicht öffentlich), Ökozentrum NRW, BDB, H&G. Befundliste Tranche 11, Nr. 5.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Startwerte EFH 150 m², GEG-Standard, Luft-Wasser-WP: H_T = 180·0,24 + 90·0,18 + 33·1,10 + 90·0,25·0,6 + 393·0,05 = 128,85 W/K, H′_T = 0,328 W/(m²K), q_h = 31, q_E = 18 → A+, q_P = 32, CO₂ = 18·560/1000 = 10 kg/(m²a).
2. Unsanierter Altbau mit Gasbrennwert: H_T = 546,9 W/K, q_h = 224, q_E = 264 → Klasse H, q_P = 293 kWh/(m²a).
3. Stichtagsschalter „ab 01.01.2027“: WP q_P = 18·1,5 = 27, CO₂ = 18·0,1 = 2 kg/(m²a); Gas unsaniert q_P = 292.
4. Interne Gewinne pauschal 35 kWh/(m²a) (`src/calc/energieausweis.ts:76`) gegen das Nutzungsprofil Wohnen der DIN/TS 18599-10:2025-10 prüfen; Text nennt 25–30 kWh/(m²a) (T11-EA-4).
5. Beispiel Gas gegen WP bei q = 80 kWh/(m²a): q_E = 86,8 / 26,7, q_P = 98,0 / 48,1 → Klasse C / A+.
6. Quizfragen `q_ea_1`, `q_ea_2` (nicht freigegeben) gegen den Rechtsstand bis 31.12.2026 und ab 01.01.2027 lesen.

## Empfehlung

**freigabereif.** T11-EA-1 bis -3 sind erledigt, der Stichtagsschalter für 2027 ist eingebaut. Offen ist T11-EA-4: Kern und Text nennen verschiedene Werte für die internen Gewinne; beide sind als Lehrwert gekennzeichnet. Zusätzlich ist der Strom-CO₂-Faktor ab 2027 (100 g/kWh) vorläufig, weil die Fassung 2027 der Anlage 9 öffentlich nicht abrufbar war. Vor dem 01.01.2027 lohnt eine kurze Kontrolle beider Werte.

Bisher „freigabereif nach Klärung von T11-EA-4“. Die offenen Normpunkte (von T11-EA-4) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
