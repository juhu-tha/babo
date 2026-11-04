# Freigabepaket: Abdichtungsprodukte (`bp_abdichtung`)

Stand 04.11.2026 · Gruppe „Bauprodukte“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T8-AB-Q2** – Fünf Nachrechnungen richtig, Q1 und Q3 umgesetzt; offen ist, ob für FPD nach der Normung in DIN 18533-3 noch ein abP verlangt wird.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Abdichtungsprodukte für erdberührte Bauteile nach DIN 18533:2026-06: PMBC (Bitumendickbeschichtung), Bahnen, FPD (flexible polymermodifizierte Dickbeschichtung), Fugenbänder und Injektionsschläuche; Berater, Fugenband-Planer und Injektionsschlauch-Planer.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; Lernpfade: Zertifikat Ausbau und Bestand.

## Reiter und Bereiche

DIN-18533-Berater, Fugenband-Planer, Injektionsschlauch-Planer, Fachtext und Beispiel Nassschichtdicke.

Komponente `src/modules/BpAbdichtung.tsx`; Inhalt `content/bpabdichtung/BpAbdichtung.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/bauprodukte.ts` | `tests/durchsichtC.test.ts` (21), `tests/konsistenz1029.test.ts` (60), `tests/modulpruefungTranche8.test.ts` (60), `tests/nachstichprobe4.test.ts` (60), `tests/nachstichprobe5a.test.ts` (50), `tests/nachstichprobe5b.test.ts` (32) | `fugenbandPruefung`: Arbeitsfuge 3 m WS, d = 30 cm, GK 32 → A 200, Randabstand 10 cm ≥ 9,6 cm; D 320 bei 30 cm erfüllt, bei 29 cm nicht |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T8-AB-1 | Fugenband-Planer als „Prüfbericht nach DIN 18197“ beschriftet (Zuordnung stammt nicht aus der Norm) | erledigt (behoben) | T8 (`module-tranche-8.md`) (Nr. 3) |
| T8-AB-2 | Umbenennung „Wasserbeanspruchungsklasse“ mit der Ausgabe 2026-06, nicht 2017-07 | erledigt (behoben) | T8 (`module-tranche-8.md`) |
| T8-AB-Q1 | D 320: Mindestbauteildicke 30 cm nach Herstellerangabe (Sika-Ratgeber), sonst d ≥ a | erledigt (umgesetzt) (29.10.) | T8 (`module-tranche-8.md`), Umsetzung 29.10. |
| T8-AB-Q2 | FPD bei W2.1-E „bauaufsichtlich zu belegen (abP)“ – noch gefordert nach DIN 18533-3:2026-06? | offen (Normtext) | T8 (`module-tranche-8.md`) |
| T8-AB-Q3 | „Anforderungsklasse A/B/C“ → Nutzungsklasse A/B nach WU-Richtlinie bzw. „ohne WU-Anforderung“; Schlauchüberdeckung nach Herstellerangabe | erledigt (umgesetzt) (29.10.) | T8 (`module-tranche-8.md`), Umsetzung 29.10. |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T8-AB-Q2 | DIN 18533-3:2026-06, FPD: Schichtdicken und Verwendbarkeitsnachweis | Wird für FPD bei W2.1-E noch ein abP verlangt? | „Unter mäßigem drückendem Wasser (W2.1-E) sind regelkonforme [Dicken] einzuhalten und bauaufsichtlich zu belegen (abP).“ – `content/bpabdichtung/BpAbdichtung.json:31–32`; als Regelwerk noch die FPD-Richtlinie der Deutschen Bauchemie, 1. Ausgabe Februar 2020 – `:33` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN 18533-1 bis -3:2026-06 (Bauprofessor 03.06.2026), DIN 18197, DAfStb-WU-Richtlinie, Sika „Fugenband-Ratgeber für die Praxis“, FPD-Richtlinie Deutsche Bauchemie (02/2020). Befundliste Tranche 8, Nr. 3.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Nassschichtdicke PMBC: d_dry = 4 mm, 30 % flüchtige Bestandteile → d_wet = 4/0,70 = 5,71 mm ≈ 6 mm.
2. Fugenband: Arbeitsfuge 3 m Wassersäule, d = 30 cm, GK 32 → A 200, Randabstand 10 cm ≥ 3·GK = 9,6 cm; Dehnfuge 10 m WS → FM 400, d < a → nicht erfüllt.
3. D 320 bei d = 30 cm erfüllt (Herstellerangabe), bei 29 cm nicht (T8-AB-Q1).
4. Berater: Nutzungsklasse A/B nach WU-Richtlinie bzw. „ohne WU-Anforderung“ (T8-AB-Q3).
5. FPD bei W2.1-E: „bauaufsichtlich zu belegen (abP)“ (`content/bpabdichtung/BpAbdichtung.json:32`) an DIN 18533-3:2026-06 prüfen; Regelwerksangabe „FPD-Richtlinie 2020“ ggf. ersetzen (T8-AB-Q2).

## Empfehlung

**freigabereif nach Klärung von T8-AB-Q2.** Fünf Nachrechnungen richtig, Q1 und Q3 umgesetzt; offen ist, ob für FPD nach der Normung in DIN 18533-3 noch ein abP verlangt wird.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
