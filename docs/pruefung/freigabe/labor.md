# Freigabepaket: Virtuelle Laborversuche (`labor`)

Stand 04.11.2026 · Gruppe „Labor & Auswertung“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Tranche 4 ohne Fehler; die Normpunkte T4-PN-2, #253-HZ und #255-RuK sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Virtuelle Laborversuche für die Baustofflabor-Praktika: Universalprüfstand (Druck, E-Modul), Spaltzug, Biegezug, Haftzug, Schmidt-Hammer, Frischbetonprüfungen und Bitumenversuche mit Protokollverwaltung und Auswertung.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Simulatoren in `src/components/labor/*` (Universalprüfstand, Spaltzug, Biegezug, Haftzug, Schmidt-Hammer, Frischbeton) und `BitumenVersuche`; Protokollverwaltung und Laborauswertung.

Komponente `src/modules/Labor.tsx`; Inhalt `content/bitumenversuche/BitumenVersuche.json`, `content/labor/Labor.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/laborVersuch.ts` | `tests/laborVersuch.test.ts` (24) | Spaltzug C30/37, Zylinder 150/300 mm, f_ct,sp = 3,22 N/mm² → F = 227,6 kN |
| `src/calc/laborversuche.ts` | `tests/laborversuche.test.ts` (45), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/modulpruefungTranche4.test.ts` (61), `tests/nachstichprobe3.test.ts` (64), `tests/nachstichprobe5a.test.ts` (50), `tests/nachstichprobe5b.test.ts` (32) | Druckprüfung, Mörtelprismen, Frischbeton, Potentialreihe (gemeinsam mit den Laborhandouts) |
| `src/calc/bauwerksuntersuchung.ts` | `tests/bauwerksuntersuchung.test.ts` (38), `tests/durchsichtA.test.ts` (49), `tests/hist13791.test.ts` (51), `tests/karsten.test.ts` (10), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/lebensdauerUebergabe.test.ts` (35) und 6 weitere | Rückprall: R = 36, horizontal, d_k = 12 mm → R′ = 32,22, f_c = 27,9 N/mm²; Verwerfungsregel `rueckprallMesssatz` |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T4 Nr. 11 | Stichprobe des Formelkerns je Simulator (rund 6500 Zeilen), Betonkennwerte nach Tab. 3.1 | keine Befunde | T4 (`module-tranche-4.md`) (Nr. 11) |
| T4-PN-2 | Schmidt-Hammer nutzt die Verwerfungsregel des Messsatzes (6 Einheiten, 20 %) → im Freigabeabschnitt 29.10. als Grund genannt, im Prüfbogen nur `probenahme` zugeordnet | offen (Normtext) | T4 (`module-tranche-4.md`), Freigabe 29.10. |
| Befund 04.11. | Ausgabenzuordnung der Verwerfungsregel widersprüchlich: Kern-Hinweis und Simulator nennen „6 Einheiten nach DIN EN 12504-2:2012; nach Sekundärquellen nennt die Ausgabe 2021-10 25 % des Medians“ (`src/calc/bauwerksuntersuchung.ts:129`); Kernkopf, `Probenahme.json` und `pruefverfahrenData.json` schreiben die 6-Einheiten-Regel der Ausgabe 2021-10 zu | offen (klärt sich mit T4-PN-2 am Normtext) | `bearbeitungsvermerke-2026-11-02.md`, Nr. 34/35 und „Offen“ |
| Befund 04.11. | Bildunterschrift der Rückprallskala nannte noch die alte Regel („rot: > 25 % vom Median“), markiert werden seit #254 die Werte mit mehr als 6 Einheiten Abstand → „rot: mehr als 6 Einheiten vom Median“ | erledigt (dieser PR) | `tests/freigabepakete_20261104.test.ts` |
| Befund 04.11. | #253-HZ und #255-RuK waren in der App nicht gekennzeichnet → Hinweis „vorläufig, Normprüfung ausstehend“ im Haftzug-Simulator und in der Formelerläuterung Ring und Kugel | erledigt (dieser PR) | `tests/freigabepakete_20261104.test.ts` |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T4-PN-2 | DIN EN 12504-2:2021-10, Auswertung (Verwerfen der Messreihe) | Schwelle für das Verwerfen des Messsatzes: 6 Einheiten (Ausgabe 2012) oder 25 % des Medians (Ausgabe 2021-10 laut Sekundärquellen)? | Seit #254 (29.10.): Median aller Einzelwerte, kein Streichen; weichen mehr als 20 % der Einzelwerte um mehr als 6 Einheiten vom Median ab, wird der ganze Messsatz verworfen – Kern `src/calc/bauwerksuntersuchung.ts:109` (`rueckprallMesssatz`), Simulator `src/components/labor/SchmidtHammerSimulator.tsx:109`, Meldung „vorläufig, Normprüfung ausstehend“ `src/calc/bauwerksuntersuchung.ts:129`; Text `content/probenahme/Probenahme.json:79`. Die frühere 25-%-Regel (Prüfbogen-Stand 28.10.) ist entfernt. |
| #253-HZ | DIN EN 1542, Prüfstelle vorbereiten | Tiefe der Ringnut (Kernbohrung): ab Kontaktfuge in den Untergrund oder ab Oberfläche? | Haftzug-Simulator zeichnet die Ringnut mit der Kernbohrtiefe unterhalb der Kontaktfuge; seit 04.11.2026 gekennzeichnet („… ab der Kontaktfuge in den Untergrund (DIN EN 1542; vorläufig, Normprüfung ausstehend)“, `src/components/labor/HaftzugPruefung.tsx:513`) → nicht blockierend |
| #255-RuK | DIN EN 1427:2015, Durchführung | Starttemperatur des Wasserbads 5 °C und Aufheizrate 5 K/min | `RUK_STARTTEMPERATUR` = 5 °C, `RUK_AUFHEIZRATE` = 5 K/min (`src/calc/laborVersuch.ts:97`), belegt über Gerätedatenblatt und IS 1205; seit 04.11.2026 in der Formelerläuterung gekennzeichnet (`content/bitumenversuche/BitumenVersuche.json:53`) → nicht blockierend |

## Quizfragen

7 Fragen, davon 1 nicht freigegeben: `qlz_labor_1`.

## Quellen

DIN EN 12390-3/-6/-13, DIN EN 12504-2:2021-10, DIN EN 1992-1-1 Tab. 3.1; Herstellerformel Original Schmidt Typ N (Screening Eagle/Proceq). Befundliste Tranche 4, Nr. 11.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Haftzug (Beispiel 1): Ø 50 mm, 3,20 kN → A = 1963,5 mm², f_h = 1,63 N/mm²; Laststeigerung 0,05 MPa/s ≙ 98 N/s.
2. E-Modul (Beispiel 2): f_c = 38,0 N/mm², σ_a = f_c/3 = 12,67, σ_b = 3,8 N/mm², Δε = 2,70·10⁻⁴ → E_C,S = 32 840 N/mm².
3. Spaltzug C30/37, Zylinder 150/300 mm: F = f_ct,sp·π·d·l/2 = 3,22·π·150·300/2000 = 227,6 kN.
4. Biegezug: Hebelarm L/6 (4-Punkt) bzw. L/4 (3-Punkt) im Moment M = F·L/6 bzw. F·L/4.
5. Schmidt-Hammer: Verwerfungskriterium „> 20 % der Einzelwerte mehr als 6 Einheiten vom Median“ (`src/calc/bauwerksuntersuchung.ts:109`) gegen DIN EN 12504-2:2021-10 prüfen – Sekundärquellen nennen für 2021-10 „25 % des Medians“.
6. Kennzeichnung der Normpunkte #253-HZ (Haftzug, Hinweis unter „Kernbohrtiefe“) und #255-RuK (Formelerläuterung Ring und Kugel in der Fußzeile) im Modul ansehen.

## Empfehlung

**freigabereif.** Tranche 4 fand in der Stichprobe keinen Fehler. Die Verwerfungsregel des Rückprall-Messsatzes (T4-PN-2) ist im Kern und im Simulator als vorläufig gekennzeichnet; die Ausgabenzuordnung der Regel ist im Code widersprüchlich (siehe Befund 04.11.) und wird mit dem Normtextabgleich bereinigt. #253-HZ und #255-RuK sind seit 04.11.2026 in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet. Alle drei gelten nach der Regel vom 02.11.2026 als erledigt.

Bisher „freigabereif nach Klärung von T4-PN-2“, nach dem Abgleich mit dem Prüfbogen „nach Klärung von #253-HZ und #255-RuK“ (nicht gekennzeichnet). Beide sind seit 04.11.2026 in der App gekennzeichnet; die Normpunkte bleiben im Prüfbogen Normtext offen, nach der Normprüfung wird der Wert angepasst.
