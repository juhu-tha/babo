# Freigabepaket: Mauerwerk & Steine (`mauerwerk`)

Stand 04.11.2026 · Gruppe „Baustoffe“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Kern in Tranche 1 und 3 unabhängig nachgerechnet und gegen Herstellertafeln belegt; T3-MW-1/-2 sind umgesetzt, offen sind Φ₁ für Innenwände und drei f_vk0-Werte am NA. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Mauersteine und Mörtel für Baustoffkunde (Termin 8) und Bauen im Bestand (Termin 6): Steinarten und Steckbriefe (Ziegel, Kalksandstein, Porenbeton, Leichtbeton, Lehm), Verbände in 3D, Druckfestigkeit f_k, Lastausmitte, Schub und Überbindemaß sowie die Wandbemessung im vereinfachten Verfahren nach DIN EN 1996-3/NA.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: A.RYC, Bauen im Bestand, Baustoffkunde.

## Reiter und Bereiche

Reiter laut Komponente: Baustoff-Steckbrief (`steckbrief`) · Steine & Mörtel (`material`) · Mauerwerksverband (`verband`) · Festigkeit & Bemessung (`bemessung`) · Ziegel-Lexikon (`ziegellexikon`).

Steinarten und Herstellung, Steckbriefe, Mauerwerksverbände (3D-Ansicht), Reiter „Festigkeit & Bemessung“ (f_k nach EN-Empfehlung als Vergleich, Lastausmitte Φ = 1 − 2e/t, Schub f_vk, Überbindemaß, vereinfachter Wandnachweis mit erweiterten Bedingungen h > 2,75 m).

Komponente `src/modules/Mauerwerk.tsx`; Inhalt `content/mauerwerk/Mauerwerk.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/mauerwerk.ts` | `tests/mauerwerk.test.ts` (38), `tests/ecKennwerte.test.ts` (45), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/kleinfragenTranche1bis3.test.ts` (34), `tests/modulpruefungTranche1.test.ts` (46), `tests/modulpruefungTranche3.test.ts` (60) und 2 weitere | Zwischendecke h = 2,50 m, t = a = 175 mm, l_f = 5,0 m, f_k = 7,1: Φ₂ = 0,724, n_Rd = 509,6 kN/m; Innenwand h = 3,50 m: Φ₂ = 0,6025, n_Rd = 424,2 kN/m |

Fremdbelege in `tests/mauerwerk.test.ts`: Herstellerbeispiele des BV Kalksandsteinindustrie (n_Rd = 559,3 bzw. 743,6 kN/m gegen Tafelwerte 555/735 kN/m, +0,8 %/+1,2 %) und mb-news 7/2013 (Φ₂ = 0,71).

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| W-1 | Φ₁ = 0,9 für Innenwände auch bei a < t? | offen (Normtext) (#239-W-1) | T1 (`module-tranche-1.md`) (Nr. 7) |
| T3-MW-1 | f_vk0 je Mörtelart statt NA-Werte → auf f_vk0 nach NA DE umgestellt | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T3 (`module-tranche-3.md`) (Nr. 3); Normtext #239-MW-1 |
| T3-MW-2 | K-Werte für Lehmsteine und KS + Leichtmörtel nicht genormt → f_k-Rechner dafür gesperrt | erledigt (umgesetzt) (28.10.) | T3 (`module-tranche-3.md`) (Nr. 3), Umsetzung 28.10. |
| F-Stellen T1 | ρ₂ = 1,0 für 2/3 < a/t < 1; f_k KS P/KS L-P (Spaltenzuordnung Tafel 16); Tab. NA.2 (Außenwände h > 2,75 m) nur Hinweis | vorläufig gekennzeichnet, laut Freigabeabschnitt nicht blockierend | T1 (`module-tranche-1.md`), T3 (`module-tranche-3.md`) |
| Hinweis | f_vk = f_vk0 + 0,4·σ_d als Grundform ohne Begrenzungen nach NA; N_Rd im Festigkeitsreiter ohne Knickeinfluss (als Vergleich gekennzeichnet) | kein Handlungsbedarf | T1 (`module-tranche-1.md`), T3 (`module-tranche-3.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| #239-W-1 | DIN EN 1996-3/NA:2019-12, NA, NCI zu 4.2.2.3 (Abminderungsbeiwert Φ₁) | Φ₁ = 0,9 für Innenwände/Zwischenauflager auch bei a < t (ohne Abminderung mit a/t) | `if (lage === 'innen') return 0.9;`; Endauflager `Math.min(1,6 − l_f/6 bzw. /5; 0.9 * aDurchT)` – `src/calc/mauerwerk.ts:189–191` |
| #239-MW-1 | DIN EN 1996-1-1/NA:2019-12, NA, Tabelle Haftscherfestigkeit f_vk0 je Mörtelgruppe | f_vk0 für NM I, NM II und NM IIIa | NM I 0,02 / NM II 0,08 / NM IIIa 0,26 N/mm² (als vorläufig geführt); übrige: NM IIa 0,18, NM III 0,22, LM 0,18, DM 0,22 – `src/calc/mauerwerk.ts:146`, Liste vorläufig `:148` |

## Quizfragen

6 Fragen, davon 1 nicht freigegeben: `qn_mauerwerk_1`.

## Quellen

DIN EN 1996-1-1/NA:2019-12, DIN EN 1996-3/NA:2019-12 (Normtext nicht öffentlich), KS-Merkblatt 04/2020 (erweiterte Bedingungen), Herstellerunterlagen BV Kalksandsteinindustrie und Lücking-Produkthandbuch 2026 (f_k-Tafelwerte), Ernst & Sohn Leseprobe (f_vk0). Befundlisten Tranche 1, Nr. 7, und Tranche 3, Nr. 3.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Wandnachweis vereinfacht (Zwischendecke): h = 2,50 m, t = a = 175 mm, l_f = 5,0 m, f_k = 7,1 N/mm² → ρ₂ = 0,75, Φ₁ = 0,767, Φ₂ = 0,724 maßgebend, n_Rd = 0,724·175·0,85·7,1/1,5 = 509,6 kN/m.
2. Teilauflager: h = 2,75 m, t = 240 mm, a = 160 mm (a/t = 2/3 → ρ₂ = 1,0), l_f = 6,0 m, f_k = 5,0 → Φ₂ = 0,422, n_Rd = 287,1 kN/m.
3. Innenwand: Φ₁ = 0,9 unabhängig von a/t (`src/calc/mauerwerk.ts:203`) – am NA, NCI zu 4.2.2.3, bestätigen (#239-W-1).
4. Haftscherfestigkeit f_vk0 nach NA: NM I 0,02 · NM II 0,08 · NM IIa 0,18 · NM III 0,22 · NM IIIa 0,26 · LM 0,18 · DM 0,22 N/mm² (`src/calc/mauerwerk.ts:154`); NM I, NM II, NM IIIa sind vorläufig (#239-MW-1).
5. Reiter Festigkeit (EN-Empfehlung, nur Vergleich): Mauerziegel NM, f_b = 12, f_m = 5, K = 0,55 → f_k = 5,08, f_d = 2,88 N/mm²; e = 5 cm, t = 24 cm → Φ = 0,58, N_Rd ≈ 403 kN/m (`content/mauerwerk/Mauerwerk.json:226`).
6. Erweiterte Bedingungen: Innenwand h = 3,50 m, t = 175 mm, f_k = 7,1 → h_ef = 2,625 m, Φ₂ = 0,6025, n_Rd = 424,2 kN/m; h = 3,80 m → Hinweis „außerhalb des vereinfachten Verfahrens“.
7. Lehmstein und KS mit Leichtmörtel im f_k-Rechner: kein Ergebnis, Hinweis „kein genormter K-Wert“ (T3-MW-2).

## Empfehlung

**freigabereif.** Der Wandnachweis stimmt in zehn eigenen Fällen und mit den Herstellertafeln (Abweichung ≤ 1,2 %). Die Fragen T3-MW-1 (f_vk0 nach NA) und T3-MW-2 (Sperre ohne K-Wert) sind entschieden und umgesetzt. Offen sind zwei Normtextpunkte des NA (#239-W-1, #239-MW-1), beide im Kern als vorläufig geführt. Die übrigen F-Stellen (ρ₂ bei 2/3 < a/t < 1, KS P/KS L-P, Tab. NA.2) gelten laut Freigabeabschnitt nicht als blockierend.

Bisher „freigabereif nach Klärung von #239-W-1 und #239-MW-1“. Die offenen Normpunkte (von #239-W-1 und #239-MW-1) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
