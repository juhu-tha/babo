# Freigabepaket: Bauphysik-Rechner (U-Wert, Sommer, Akustik) (`bauphysik`)

Stand 04.11.2026 · Gruppe „Bauphysik“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T11-BP-2a/b** – U-Wert-Kern in Tranche 1, Sommer und Akustik in Tranche 11 nachgerechnet, alle Fälle identisch; offen sind zwei Wärmekapazitäten am Normtext.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Bauphysik-Rechner für die Grundlagenvorlesung: U-Wert mehrschichtiger Bauteile nach DIN EN ISO 6946 mit Temperaturverlauf und f_Rsi-Schimmelkriterium, Phasenverschiebung und Amplitudendämpfung (sommerliche Trägheit) sowie Nachhallzeit nach Sabine mit Sollwerten nach DIN 18041.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: VNHB.

## Reiter und Bereiche

Reiter laut Komponente: Wärmeschutz (U-Wert & f_Rsi) (`thermal_hygric`) · Sommerlicher Wärmeschutz (Trägheit) (`summer_heat`) · Raumakustik (Nachhallzeit T) (`acoustics`).

Drei Reiter: U-Wert/f_Rsi (Schichtaufbau aus Materialbibliothek), Sommer (Phasenverschiebung η, TAV, wirksame Wärmespeicherfähigkeit), Raumakustik (Sabine, T_soll für Gruppe A, Orientierungswert Gruppe B).

Komponente `src/modules/Bauphysik.tsx`; Inhalt `content/bauphysik/Bauphysik.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/waermeschutz.ts` | `tests/waermeschutz.test.ts` (9), `tests/glaser.test.ts` (28), `tests/modulpruefungTranche11.test.ts` (26), `tests/modulpruefungTranche3.test.ts` (60), `tests/nachstichprobe20261029.test.ts` (32), `tests/quizRechenfragen.test.ts` (43) und 1 weitere | Putz 1,5 cm + KS 17,5 cm + MW 14 cm: R_T = 4,368 m²K/W, U = 0,229 W/(m²K), f_Rsi = 0,94; Sommer (Phasenverschiebung) und Sabine inline in der Komponente |

Phasenverschiebung (Standardwand: X = 3,190, η = 12,19 h, TAV = 0,041) und Nachhallzeit (Klassenraum 9 × 7 × 3 m: T_soll = 0,558 s, mit Deckenabsorber 0,477 s) sind inline gerechnet und in Tranche 11 Zeile für Zeile nachvollzogen (`tests/modulpruefungTranche11.test.ts`).

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| B-1 | Lernziel „GEG-Höchstwert“ → GModG Anlage 7 | erledigt (behoben) | T1 (`module-tranche-1.md`) (Nr. 9) |
| B-2 | Anlage 7 GModG übernimmt die GEG-Höchstwerte unverändert? | erledigt (bestätigt, Verbraucherzentrale/Gesetzestext) | T1 (`module-tranche-1.md`); T11 (`module-tranche-11.md`) |
| T11-BP-1 | Sollkorridor Gruppe B (Büro) 0,60–0,85 s ist kein DIN-18041-Wert → als Orientierungswert ausgewiesen | erledigt (umgesetzt) | T11 (`module-tranche-11.md`), Umsetzung 29.10. |
| T11-BP-2 | c-Werte Holzfaser 2100 und Fichte 1600 J/(kgK) als Lehrwerte gekennzeichnet | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T11 (`module-tranche-11.md`); Normtext T11-BP-2a/b |
| Hinweis | Bewertung der Phasenverschiebung (≥ 10 h / 6–10 h) ist Faustregel, nicht ausdrücklich so gekennzeichnet | offen (Hinweis, kein Fehler) | T11 (`module-tranche-11.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T11-BP-2a | DIN EN ISO 10456:2010-05, Tab. 3 | spezifische Wärmekapazität Holzfaserdämmplatte | `"c": 2100` J/(kgK) – `content/bauphysik/Bauphysik.json:231` (Anzeige `:27`) |
| T11-BP-2b | DIN EN ISO 10456:2010-05, Tab. 3 | spezifische Wärmekapazität Nadelholz (Fichte/Tanne) | `"c": 1600` J/(kgK) – `content/bauphysik/Bauphysik.json:247` (Anzeige `:29`; Eiche ebenfalls 1600, `:255`) |
| DIN4108-3-a…c | DIN 4108-3:2024-03 (wie `feuchteschutz`) | Klimarandbedingungen, δ₀, Dachbedingungen | betrifft den Taupunkt-/f_Rsi-Teil nur mittelbar (Kern `waermeschutz.ts` gemeinsam mit `feuchteschutz`) |

## Quizfragen

7 Fragen, davon 2 nicht freigegeben: `qn_bauphysik_1`, `qlz_bauphysik_1`.

## Quellen

DIN EN ISO 6946 (R_si/R_se, Tab. 7), DIN EN ISO 10456:2010-05 Tab. 3, DIN 4108-4:2020-11, DIN 18041:2016-03 (Lehrbuchwiedergaben), GModG Anlage 7. Befundlisten Tranche 1, Nr. 9, und Tranche 11, Nr. 2.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Beispiel 1 (Putz 1,5 cm λ 0,70; KS 17,5 cm λ 0,99; MW 14 cm λ 0,035; R_si 0,13, R_se 0,04): R_T = 4,368 m²K/W, U = 0,229 W/(m²K), f_Rsi = 1 − 0,25·U = 0,94.
2. GModG-Höchstwerte Anlage 7 im Ergebnis: Außenwand 0,24, Steildach 0,24, Flachdach 0,20, Kellerdecke 0,30 W/(m²K).
3. Reiter Sommer, Standardwand (Gipsputz, HLZ 24, EPS 16, Zementputz): η = 12,19 h, TAV = 0,041, U = 0,186 W/(m²K); Bewertung „≥ 10 h“ als Faustregel lesen.
4. c-Werte im Reiter Sommer: Holzfaserdämmplatte 2100 J/(kgK), Fichte 1600 J/(kgK) gegen DIN EN ISO 10456 Tab. 3 prüfen (`content/bauphysik/Bauphysik.json:235`; T11-BP-2a/b).
5. Raumakustik Beispiel 2: Klassenraum 9 × 7 × 3 m (A3): V = 189 m³, T_soll = 0,32·lg V − 0,17 = 0,558 s; ohne Absorber T = 2,78 s, mit Deckenabsorber α = 0,90 T = 0,48 s.
6. Gruppe B (Mehrpersonenbüro): Ergebnis heißt „Orientierungswert 0,60–0,85 s“, nicht DIN-Empfehlung.

## Empfehlung

**freigabereif nach Klärung von T11-BP-2a/b.** Alle drei Reiter sind nachgerechnet (Tranche 1 und 11), die Fragen B-2 und T11-BP-1 sind entschieden. Offen sind die beiden c-Werte (T11-BP-2a/b, DIN EN ISO 10456 Tab. 3). Sie wirken nur auf den Reiter Sommer und sind als Lehrwerte gekennzeichnet. Die F-Stellen DIN 4108-3 betreffen hauptsächlich `feuchteschutz`; im Freigabeabschnitt 29.10. werden sie auch hier genannt. Vorschlag: für `bauphysik` nicht blockierend.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
