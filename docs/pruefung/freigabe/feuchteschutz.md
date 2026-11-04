# Freigabepaket: Feuchteschutz & Tauwasser (Glaser-Verfahren) (`feuchteschutz`)

Stand 04.11.2026 · Gruppe „Bauphysik“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Kern zweimal unabhängig nachgerechnet (Tranche 1 und 2, acht Fälle, alle identisch); offen sind nur die Klimarandbedingungen und δ₀ am Normtext. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Feuchteschutz nach DIN 4108-3:2024-03 für die Bauphysik-Grundlagen und die Vertiefung Bauen im Bestand: Taupunkt und Schimmelkriterium, Tauwasserberechnung nach dem Glaser-Verfahren (Wand, nicht belüftetes Dach, Innendämmung, Holzrahmenbau) und s_d-Regeln nachweisfreier Dächer.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: Bauen im Bestand, Zertifikat Ausbau und Bestand.

## Reiter und Bereiche

Ein Rechnermodul mit Glaser-Diagramm (Klima „Norm“ oder frei einstellbar, Bauteil Wand oder Dach), Schichtaufbau, Taupunktrechner und Fachtext (Beispiele, Kriterien, Regelwerke). Modultitel seit #320 einheitlich „Feuchteschutz & Tauwasser (Glaser-Verfahren)“.

Komponente `src/modules/Feuchteschutz.tsx`; Inhalt `content/feuchteschutz/Feuchteschutz.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/glaser.ts` | `tests/glaser.test.ts` (28), `tests/modulpruefungTranche1.test.ts` (46), `tests/modulpruefungTranche2.test.ts` (58), `tests/modulpruefungTranche6.test.ts` (50) | KS 17,5 cm + MW 14 cm + s_d = 100 m: Tauwasserebene bei s_d = 4,515 m, M_c = 0,260 > M_ev = 0,180 kg/m²; Dach ohne Dampfbremse: M_c = 2,60 kg/m² |
| `src/calc/waermeschutz.ts` | `tests/waermeschutz.test.ts` (9), `tests/glaser.test.ts` (28), `tests/modulpruefungTranche11.test.ts` (26), `tests/modulpruefungTranche3.test.ts` (60), `tests/nachstichprobe20261029.test.ts` (32), `tests/quizRechenfragen.test.ts` (43) und 1 weitere | Magnus: p_sat(20 °C) = 2337 Pa, p_sat(−5 °C) = 401 Pa (Eis); Taupunkt 20 °C/50 % = 9,3 °C |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| B-1 | Lernziel nannte noch „GEG-Höchstwert“ → GModG Anlage 7 | erledigt (behoben) | T1 (`module-tranche-1.md`) (Nr. 9) |
| B-2 | Höchstwerte Anlage 7 GModG unverändert gegenüber GEG? | erledigt (am Gesetzestext beantwortet, Tranche 8/12) | T1 (`module-tranche-1.md`); T3 (`module-tranche-3.md`), Freigabe 29.10. |
| Titel | Drei verschiedene Modultitel (Menü, Übersicht, Überschrift) | erledigt (#320) | `gutachten-umsetzung-2026-11-03.md` |
| Hinweis | Feuchteerhöhung von Holz/Holzwerkstoffen nach DIN 4108-3 nicht gerechnet; Ergebnis weist darauf hin | kein Handlungsbedarf | T2 (`module-tranche-2.md`) (Nr. 12) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| DIN4108-3-a | DIN 4108-3:2024-03, Anhang A, Tab. A.3 | Tauperiode (−5 °C/80 %, 20 °C/50 %, 2160 h) und Verdunstungsperiode in der Ausgabe 2024-03 unverändert? | Normklima im Kern `src/calc/glaser.ts`; Grenzen und Fachtext `content/feuchteschutz/Feuchteschutz.json` |
| DIN4108-3-b | DIN 4108-3:2024-03, A.2.5 | δ₀ = 2,0·10⁻¹⁰ kg/(m·s·Pa) (= 7,2·10⁻⁷ kg/(m·h·Pa)) | `src/calc/glaser.ts` |
| DIN4108-3-c | DIN 4108-3:2024-03, Anhang A | Neue Außenbedingungen für verschattete oder helle Dächer; Anwendungsgrenze Höhenlage ≤ 700 m | Dachklima 2000 Pa (Verdunstung) im Kern; Hinweis im Fachtext |

## Quizfragen

8 Fragen, alle freigegeben.

## Quellen

DIN 4108-3:2024-03 (Normtext für die drei F-Stellen nicht öffentlich; noch nicht im Prüfbogen, Ergänzung vorgeschlagen im Inventar 29.10.). Magnus-Formel nach DIN 4108-3. Befundlisten Tranche 1, Nr. 9, und Tranche 2, Nr. 12.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Taupunkt 20 °C / 50 % r. F. = 9,3 °C, 20 °C / 60 % = 12,0 °C; Schimmelgrenze (80 % an der Oberfläche) bei 20 °C/50 % = 12,6 °C (`tests/waermeschutz.test.ts`).
2. Glaser-Wand (Normklima): KS 17,5 cm (µ 25) + Mineralwolle 14 cm (µ 1) + Außenschicht s_d = 100 m → Tauwasserebene bei s_d = 4,515 m, M_c = 0,260 kg/m², M_ev = 0,180 kg/m² → „nicht eingehalten“ (M_c > M_ev).
3. Glaser-Dach ohne Dampfbremse: GK 12,5 mm, MW 200 mm, Unterdeckbahn s_d = 0,1 m → M_c = 2,60 kg/m² > 1,0 kg/m²; mit Dampfbremse s_d = 2 m: kein Tauwasser, U = 0,165 W/(m²K).
4. Innendämmung (Gipsputz, PUR 60 mm µ 50, Kleber, Ziegel 36,5 cm): Tauwasser an der Grenze PUR/Kleber, M_c = 0,079 kg/m², M_ev = 0,510 kg/m².
5. s_d-Regel nachweisfreier Dächer: s_d,e = 0,05 / 0,3 / 1,0 m → s_d,i ≥ 1,0 / 2,0 / 6,0 m; s_d,e = 2,5 m → Nachweis erforderlich.
6. Klimarandbedingungen und δ₀ im Kern mit DIN 4108-3:2024-03 abgleichen (Tab. A.3, A.2.5) und die Anwendungsgrenze Höhenlage ≤ 700 m sowie die neuen Dachbedingungen im Fachtext prüfen.

## Empfehlung

**freigabereif.** Glaser-Kern und Taupunktrechnung sind in zwei Tranchen mit eigener Tangentenkonstruktion nachgerechnet, ohne Rechenfehler. Frage B-2 ist beantwortet, der Titel vereinheitlicht. Offen sind die drei F-Stellen DIN 4108-3:2024-03 (Tab. A.3, δ₀ nach A.2.5, Dachbedingungen und Höhenlage). Sie stehen noch nicht im Prüfbogen Normtext; Vorschlag: dort als eigene Norm aufnehmen. Gelten die Werte der Ausgabe 2018 unverändert weiter, ist das Modul ohne Änderung freigabereif.

Bisher „freigabereif nach Klärung der drei Normtextstellen DIN 4108-3:2024-03“. Die offenen Normpunkte (der drei Normtextstellen DIN 4108-3:2024-03) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
