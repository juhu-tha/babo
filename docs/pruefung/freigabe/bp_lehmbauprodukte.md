# Freigabepaket: Lehmbauprodukte (`bp_lehmbauprodukte`)

Stand 04.11.2026 · Gruppe „Bauprodukte“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Lehrrechner in sich richtig und seit 29.10. deutlich als Lehrmodell gekennzeichnet; offen sind die Produktnorm-Angaben (Sockel, Klassen, Typen). Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Lehmbauprodukte nach den Normen DIN 18945 bis 18948 (Lehmsteine, Lehmmauermörtel, Lehmputzmörtel, Lehmplatten) und DIN 18940 (tragendes Lehmsteinmauerwerk); Feuchteschutz und Sockel; Tragfähigkeitsrechner als Lehrmodell.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Ein Modul mit Produktkarten, Feuchteschutz und Lehrrechner „Lehmwand (Lehrmodell, nicht DIN 18940)“.

Komponente `src/modules/BpLehmbauprodukte.tsx`; Inhalt `content/bplehmbauprodukte/BpLehmbauprodukte.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/bauprodukte.ts` | `tests/durchsichtC.test.ts` (21), `tests/konsistenz1029.test.ts` (60), `tests/modulpruefungTranche8.test.ts` (60), `tests/nachstichprobe4.test.ts` (60), `tests/nachstichprobe5a.test.ts` (50), `tests/nachstichprobe5b.test.ts` (32) | `lehmWand`: h = 2,75 m, t = 30 cm, Klasse 2 (f_k = 0,9), Deckeneinspannung → λ = 6,88, Φ = 0,780, N_Rd = 105,3 kN/m (Lehrmodell) |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T8-LE-1 | „frei/auskragend, β = 1,0“ falsch → β = 1,0 gelenkig, β = 0,75 Deckeneinspannung; frei auskragend nicht abgebildet | erledigt (behoben) | T8 (`module-tranche-8.md`) (Nr. 13) |
| T8-LE-Q1 | Rechenansatz (f_k je Klasse, γ_M = 2,0, λ ≤ 21, Φ = 0,85·(1 − (λ/24)²)) nicht belegt → als „Lehrmodell, nicht DIN 18940“ gekennzeichnet | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T8 (`module-tranche-8.md`), Umsetzung 29.10.; Normtext T8-LE-Q1a–d |
| T8-LE-Q2 | Produktnorm-Angaben: Sockel 30 cm, M 2,5, S I/S II (0,3/0,4 MPa), LPL1–LPL3 | offen (Normtext) | T8 (`module-tranche-8.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T8-LE-Q1a | DIN 18940:2023-06, Bemessung, charakteristische Druckfestigkeit f_k (Abschnitt prüfen) | f_k je Steinfestigkeitsklasse | `LEHM_FK = { 2: 0.9, 2.5: 1.1, 3: 1.3, 4: 1.6, 5: 1.9, 6: 2.2 }` N/mm² – `src/calc/bauprodukte.ts:105` |
| T8-LE-Q1b | DIN 18940:2023-06, Bemessung, Teilsicherheitsbeiwert | γ_M | `LEHM_GAMMA_M = 2.0` – `src/calc/bauprodukte.ts:106` |
| T8-LE-Q1c | DIN 18940:2023-06, Bemessung, Schlankheit | Grenzschlankheit λ = h_ef/t | `LEHM_LAMBDA_MAX = 21` – `src/calc/bauprodukte.ts:107`; β = 0,75 (Deckeneinspannung) bzw. 1,0 – `:109` |
| T8-LE-Q1d | DIN 18940:2023-06, Bemessung, Abminderungsbeiwert | Form des Abminderungsbeiwerts Φ | Φ = 0,85·(1 − (λ/24)²), `Math.max(0, …)` – `src/calc/bauprodukte.ts:114` |
| T8-LE-Q2a | DIN 18940:2023-06, Feuchteschutz / Sockel (Abschnitt prüfen) | Mindestsockelhöhe bzw. Kimmschicht über OKF | „Sockelhöhe min. 30 cm über Geländeoberfläche im fertigen Zustand“ (DIN 18940 / WTA) – `content/bplehmbauprodukte/BpLehmbauprodukte.json:29` |
| T8-LE-Q2b | DIN 18946:2024-03, Festigkeitsklassen Lehmmauermörtel | Bezeichnung und Wert der Klasse M 2,5 | „Festigkeitsklassen z. B. M 2,5 mit Druckfestigkeit ≥ 2,5 N/mm²“ – `content/bplehmbauprodukte/BpLehmbauprodukte.json:81`, `:83` |
| T8-LE-Q2c | DIN 18947:2024-03, Klassen Lehmputzmörtel | Klassenbezeichnung S I/S II und Biegezugfestigkeit | „S I (Standard-Lehmputzmörtel), S II (Putze für erhöhte mechanische Belastung)“; „Klasse I (≥ 0,3 MPa), Klasse II (≥ 0,4 MPa)“ – `content/bplehmbauprodukte/BpLehmbauprodukte.json:96`, `:98` |
| T8-LE-Q2d | DIN 18948:2024-03, Einteilung Lehmplatten | Typen- bzw. Klassenbezeichnung | „LPL1 (Reine Lehmplatten), LPL2 (Faser- oder Schilfrohr-armiert), LPL3 (Gipskarton-Alternative)“ – `content/bplehmbauprodukte/BpLehmbauprodukte.json:111` |
| T5-LE-2b | DIN 18945:2024-03 + A1:2026-06, Druckfestigkeitsklassen Lehmsteine | Reihe der Klassen (mittlere Steindruckfestigkeit) | „2 – 2,5 – 3 – 4 – 5 – 6 N/mm²“ – `content/lehm/Lehm.json:17`; `content/bplehmbauprodukte/BpLehmbauprodukte.json:68` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN 18940:2023-06, DIN 18945:2024-03 + A1:2026-06, DIN 18946/18947/18948:2024-03 (Normtexte nicht öffentlich), WTA-Merkblätter Lehmbau, Herstellerblatt conluto (Kimmschicht). Befundliste Tranche 8, Nr. 13.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Lehrmodell: h = 2,75 m, t = 30 cm, Klasse 2 (f_k = 0,9 N/mm²), β = 0,75 → λ = 0,75·275/30 = 6,88, Φ = 0,85·(1 − (6,88/24)²) = 0,780, N_Rd = 0,780·300·0,9/2,0 = 105,3 kN/m.
2. t = 24 cm, Klasse 4 (f_k = 1,6), β = 1,0 → λ = 11,46, Φ = 0,656, N_Rd = 126,0 kN/m; t = 11,5 cm, h = 3,0 m → λ = 26,1 > 21 → nicht erfüllt.
3. Kennzeichnung „Lehrmodell, nicht DIN 18940“ in Reitername, Überschrift und Rechenweg; f_k-Tabelle `src/calc/bauprodukte.ts:119` (T8-LE-Q1a–d).
4. Produktangaben gegen die Normen: Sockelhöhe 30 cm (`content/bplehmbauprodukte/BpLehmbauprodukte.json:29`), Mörtel M 2,5, Putz Klasse I/II mit 0,3/0,4 MPa, Platten LPL1–LPL3 (T8-LE-Q2a–d).
5. Druckfestigkeitsklassen Lehmsteine 2–6 N/mm² (T5-LE-2b, gemeinsam mit `lehm`).

## Empfehlung

**freigabereif.** T8-LE-1 ist behoben. Mit der Kennzeichnung als „Lehrmodell, nicht DIN 18940“ (29.10.) hängt der Rechner nicht mehr am Normtext, sofern das Lehrmodell so bleiben darf; T8-LE-Q1a–d sind dann nur noch für eine spätere Umstellung auf DIN 18940 nötig. Vorschlag: Q1a–d nicht mehr als blockierend werten. Blockierend bleiben die vier Produktangaben T8-LE-Q2a–d und die Klassenreihe T5-LE-2b.

Bisher „freigabereif nach Klärung von T8-LE-Q2a–d und T5-LE-2b“. Die offenen Normpunkte (von T8-LE-Q2a–d und T5-LE-2b) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
