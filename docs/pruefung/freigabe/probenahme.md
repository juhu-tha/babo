# Freigabepaket: Probenahme & Erkundung (`probenahme`)

Stand 04.11.2026 · Gruppe „Labor & Auswertung“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T4-PN-2** – Rechnungen nachgerechnet, T4-PN-1 behoben; offen ist allein die Verwerfungsregel nach DIN EN 12504-2 (6 Einheiten oder 25 % des Medians).

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Probenahme im Bestand für Bauen im Bestand (Termin 2) und A.RYC (Termine 4 und 9): Haufwerksbeprobung nach LAGA PN 98, Bohrkernentnahme (DIN EN 12504-1) mit Umrechnung h/d, Bohrmehlentnahme für Chloridanalysen, Rückprallprüfung nach DIN EN 12504-2.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: A.RYC, Bauen im Bestand.

## Reiter und Bereiche

Ein Modul mit Fachtext und drei Rechnern: Bohrkern-Prüfer, Bohrmehlrechner, Rückprall-Simulator; drei Rechenbeispiele.

Komponente `src/modules/Probenahme.tsx`; Inhalt `content/probenahme/Probenahme.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/bauwerksuntersuchung.ts` | `tests/bauwerksuntersuchung.test.ts` (38), `tests/durchsichtA.test.ts` (49), `tests/hist13791.test.ts` (51), `tests/karsten.test.ts` (10), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/lebensdauerUebergabe.test.ts` (35) und 6 weitere | Rückprall R = 38, horizontal, d_k = 15 mm: k = 0,85, R = 32,3, f_c = 28,0 N/mm²; nach oben R = 36: ΔR = −4,22 |

Bohrmehl- und Bohrkernrechnung stehen inline in der Komponente und sind in Tranche 4 (PN1–PN3) nachgerechnet; Regression in `tests/modulpruefungTranche4.test.ts`.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T4-PN-1 | Rückprall-Simulator mit eigenen Ansätzen (f ≈ 1,4·R − 20, −0,15 Skt./mm, Winkeltabelle) → zentraler Kern `rueckprall()`/`rueckprallLehrkurve()` | erledigt (behoben) | T4 (`module-tranche-4.md`) (Nr. 7) |
| Grenzen | Bohrmehl mit fester Rohdichte, Bohrkernfaktoren nur 1 ≤ h/d ≤ 2, Rückprall als Lehransatz | erledigt (behoben) | T4 (`module-tranche-4.md`) |
| T4-PN-2 | Verwerfungsregel des Messsatzes: 25 % des Medians → 6 Einheiten (Kern `rueckprallMesssatz`) | erledigt (umgesetzt, als vorläufig gekennzeichnet); offen (Normtext) | T4 (`module-tranche-4.md`), Umsetzung 29.10. |
| Befund 04.11. | Ausgabenzuordnung der Verwerfungsregel widersprüchlich: Kern-Hinweis und Simulator nennen „6 Einheiten nach DIN EN 12504-2:2012; nach Sekundärquellen nennt die Ausgabe 2021-10 25 % des Medians“ (`src/calc/bauwerksuntersuchung.ts:129`); Kernkopf, `Probenahme.json` und `pruefverfahrenData.json` schreiben die 6-Einheiten-Regel der Ausgabe 2021-10 zu | offen (klärt sich mit T4-PN-2 am Normtext) | `bearbeitungsvermerke-2026-11-02.md`, Nr. 34/35 und „Offen“ |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T4-PN-2 | DIN EN 12504-2:2021-10, Auswertung (Verwerfen der Messreihe) | Schwelle für das Verwerfen der Messreihe: Abweichung vom Median in % oder in Einheiten? | Mehr als 20 % der Einzelwerte weichen um mehr als 25 % vom Median ab → Messreihe verwerfen. Code: `Math.abs(v - median) / median > 0.25`, `outliers.length > 0.2 * valid.length` – `src/components/labor/SchmidtHammerSimulator.tsx:110–111`, Meldung `:170`; Text `content/probenahme/Probenahme.json:79`; Quiz `q_prob_4` `src/data/quiz.json:2586` |

## Quizfragen

7 Fragen, davon 2 nicht freigegeben: `q_prob_4`, `qlz_probenahme_1`.

## Quellen

LAGA PN 98 (2019), DIN 19698-1/-2, DIN EN 932-2, DIN EN 12504-1:2021-02, DIN EN 12504-2:2021-10, DIN EN 14629:2007-06, DIN EN 13791:2020-02 mit A20:2022-04 (DIN Media); ASTM C42 (h/d-Faktoren); TUM ZfP-Wiki und VUT Brno (Sekundärquellen zur Ausgabe 2021-10). Befundliste Tranche 4, Nr. 7.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Bohrmehl: Ø 12 mm, Δz = 10 mm, 3 Löcher, ρ = 2,2 g/cm³ → m = 3·π·0,6²·1,0·2,2 = 7,46 g; Beispiel 1 (Ø 16 mm, 2 Löcher) 8,85 g ≥ 5 g.
2. Bohrkern (Beispiel 2): h/d = 1,5, f_core = 35,0 N/mm² → k = 0,96, 33,6 N/mm².
3. Rückprall (Beispiel 3): R = 36 nach oben → ΔR = (−7,1 + 0,08·36) = −4,22, R_korr = 31,8.
4. Startwerte Simulator: R = 38, horizontal, d_k = 15 mm → k = 1 − 0,015·10 = 0,85, R = 32,3, f_c = 0,0125·32,3^2,22 = 28,0 N/mm² (Lehrkurve).
5. Verwerfungsregel: Text „Weichen mehr als 20 % der Einzelwerte um mehr als 6 Einheiten vom Median ab, wird der gesamte Messsatz verworfen“ (`content/probenahme/Probenahme.json:79`) am Normtext DIN EN 12504-2:2021-10 prüfen; Alternative laut Sekundärquellen: 25 % des Medians.
6. Quizfrage `q_prob_4` (nicht freigegeben) hängt am Ergebnis von T4-PN-2.

## Empfehlung

**freigabereif nach Klärung von T4-PN-2.** Rechnungen nachgerechnet, T4-PN-1 behoben; offen ist allein die Verwerfungsregel nach DIN EN 12504-2 (6 Einheiten oder 25 % des Medians).

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
