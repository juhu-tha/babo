# Freigabepaket: Hydratation & Folgen (Wärme, Reife, Rissrisiko) (`hydratation_folgen`)

Stand 04.11.2026 · Gruppe „Betontechnologie“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Rechnung in Tranche 3 freigabefähig, eingebettete Seiten in Tranche 16 freigegeben; offen bleibt die Form der gewogenen Reife nach NEN 5970. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Hydratation und ihre Folgen für Baustoffkunde (Termin 6) und Betontechnologie: Reifefunktionen (Arrhenius, fib Model Code 2010, Saul, Rastrup, gewogene Reife nach NEN 5970), Festigkeits- und E-Modul-Entwicklung nach DIN EN 1992-1-1 Gl. (3.2)/(3.5), Hydratationswärme und adiabatische Erwärmung, Rissrisiko massiger Bauteile mit Zwang, Eigenspannungen sowie Kriechen und Schwinden.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: Baustoffkunde.

## Reiter und Bereiche

Eingebettet sind die Direktlink-Seiten `kriechen`, `zwang` und `eigenspannungen`; sie sind keine Fachmodule und wurden in Tranche 16 geprüft und am 02.11.2026 in der Befundliste freigegeben. Für sie gilt laut T16-ALL-1 der Prüfvermerk dieses Moduls.

Komponente `src/modules/HydratationFolgen.tsx`; Inhalt `content/eigenspannungen/Eigenspannungen.json`, `content/hydratation/Hydratation.json`, `content/hydratationfolgen/HydratationFolgen.json`, `content/hydratationpruefverfahren/HydratationPruefverfahren.json`, `content/hydratationrissberechnung/HydratationRissberechnung.json`, `content/integrationverformungen/IntegrationVerformungen.json`, `content/kriechenschwinden/KriechenSchwinden.json`, `content/massigebauteile/MassigeBauteile.json`, `content/praxisbeispiele/Praxisbeispiele.json`, `content/zwang/Zwang.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/hydratation.ts` | `tests/hydratation.test.ts` (76), `tests/demosBeton.test.ts` (25), `tests/entscheidungen1029.test.ts` (12), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/kleinfragenTranche1bis3.test.ts` (34), `tests/modulpruefungTranche3.test.ts` (60) und 2 weitere | Arrhenius E_a = 38 kJ/mol, 10 °C: k_T = 0,5766; Saul 48 h bei 10 °C: t₂₀ = 32 h; β_cc(7 d, s = 0,25) = 0,7788; z = 320 kg/m³, Q = 350 J/g: ΔT_ad = 46,7 K |
| `src/calc/zwang.ts` | `tests/quizRechenfragen.test.ts` (43), `tests/tranche16.test.ts` (45) | Zwangspannungen (Tranche 16, Kern neu) |
| `src/calc/eigenspannungen.ts` | `tests/tranche16.test.ts` (45) | Eigenspannungen; Beispiel 20/10/20 °C: Zug +0,50 N/mm² im Kern (T16-ES-1) |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T3-HY-1 | Form der gewogenen Reife nach NEN 5970 (k_T = C^((T − 20)/10) gegenüber der integrierten Form nach de Vree) und C-Bereich 1,15–1,75 | offen (Normtext) (vorläufig gekennzeichnet) | T3 (`module-tranche-3.md`) (Nr. 5) |
| T3-HY-2 | c·ρ im Anwendungsbeispiel 2500 statt 2400 kJ/(m³K) wie Kern und Quiz → angeglichen (46,7 K, 61,7 °C) | erledigt (umgesetzt) (29.10.) | T3 (`module-tranche-3.md`), Umsetzung 29.10. |
| QZ-4 | `q_hyf_2`, `q_hyf_4` auf c·ρ = 2400 umgerechnet (29,2 K; 61,7 °C) | erledigt (umgesetzt) (Quiz wieder offen) | T3 (`module-tranche-3.md`), Umsetzung 29.10. |
| Hinweis | Kurzfassung „E-Modul nach 2 Tagen etwa 70 bis 80 %“ – nach Gl. 3.2/3.5 73 % (S), 81 % (N), 85 % (R) | offen (Formulierung, siehe unten) | T3 (`module-tranche-3.md`) |
| F-Stelle T3/5 | Zuordnung der L-Zemente zur Klasse S/N (32,5 L → S, 42,5 L → S, 52,5 L → N) | vorläufig gekennzeichnet | T3 (`module-tranche-3.md`) |
| T16-KS-1, T16-ES-1, T16-ZW-1 bis -3 | Eingebettete Seiten Kriechen, Eigenspannungen, Zwang | erledigt (behoben) (#293, #297) | T16 (`module-tranche-16.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T3-HY-1 | NEN 5970:2001 (gewogene Reife) | Form der Reifefunktion und Bereich von C (1,15 … 1,75, Standard 1,45) | `src/calc/hydratation.ts:46` |
| F-Stelle T3/5 | DIN EN 1992-1-1, 3.1.2 (s-Werte) mit Zementklassen nach DIN EN 197-1 | Zuordnung der L-Zemente zu s = 0,38/0,25 | `src/calc/hydratation.ts` |

## Quizfragen

7 Fragen, davon 3 nicht freigegeben: `q_hyf_2`, `q_hyf_4`, `qlz_hydratation_folgen_1`.

## Quellen

DIN EN 1992-1-1 Gl. (3.1)–(3.5), fib Model Code 2010 Gl. (5.1-85), NEN 5970:2001 (Normtext nicht zugänglich; Wiedergaben Giatec, Kasal/ČVUT 2020), DAfStb-Richtlinie Massige Bauteile aus Beton (04/2010). T3-HY-1 steht noch nicht im Prüfbogen Normtext (Ergänzung vorgeschlagen: neue Norm NEN 5970). Befundlisten Tranche 3, Nr. 5, und Tranche 16, Nr. 1–3.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Arrhenius, E_a = 38 kJ/mol, T = 10 °C: k_T = exp[38 000/8,314·(1/293,15 − 1/283,15)] = 0,577; fib MC 2010, 5 °C: 0,479.
2. Saul (Beispiel des Moduls): 48 h bei 10 °C → M = 960 °C·h, t₂₀ = 32 h.
3. Gewogene Reife, C = 1,45: 5 °C → 1,45^(−1,5) = 0,573; 10 °C → 0,690; Form und C-Bereich als „vorläufig“ gekennzeichnet (T3-HY-1).
4. Festigkeitsentwicklung: s = 0,25, t_e = 7 d, C30/37 → β_cc = 0,7788, f_cm = 29,6, f_ctm = 2,26 N/mm², E_cm = 30,5 GPa.
5. Adiabatische Erwärmung (Anwendungsbeispiel): z·Q = 320·350 = 112 000 kJ/m³, ΔT_ad = 112 000/2400 = 46,7 K, T_Kern = 15 + 46,7 = 61,7 °C.
6. Eigenspannungen (eingebettet): Kern kühler als die Ränder (20/10/20 °C) → Zug im Kern +0,50 N/mm², Beschriftung „Kern“ statt „Rand“.

## Empfehlung

**freigabereif.** Alle Kerne sind nachgerechnet (Tranche 3: sechs Fälle; Tranche 16: Zwang, Eigenspannungen, Kriechen). T3-HY-2 ist umgesetzt. Offen ist T3-HY-1 (Form und C-Bereich der gewogenen Reife); das Verfahren ist eines von fünf wählbaren Reifeverfahren und als vorläufig gekennzeichnet. Vorschlag: NEN 5970 in den Prüfbogen Normtext aufnehmen. Die Kurzfassung „70 bis 80 %“ könnte „70 bis 85 %“ heißen (Hinweis aus T3, nicht als Fehler gewertet).

Bisher „freigabereif nach Klärung von T3-HY-1“. Die offenen Normpunkte (von T3-HY-1) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
