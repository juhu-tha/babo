# Freigabepaket: Mechan. Kenngrößen & E-Modul (`mechanische_kenngroessen`)

Stand 04.11.2026 · Gruppe „Mechanik“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Vier Fehlerbefunde behoben, Kerne nachgerechnet (auch gegen SOFiSTiK-Verifikation); offen sind zwei Kriechzahlen am NA und drei Kennwerte ohne Quelle. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Mechanische Kenngrößen für Baustoffkunde (Termin 3): Spannung, Dehnung, Hookesches Gesetz, Querdehnzahl, E-, G- und K-Modul, Dehn- und Biegesteifigkeit, Knicklast, Formänderungsarbeit; zeitabhängiges Verhalten (Kriechen, Schwinden, Relaxation) mit Zugversuchsimulator und Werkstoffmatrix.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: Baustoffkunde.

## Reiter und Bereiche

Komponente `src/modules/MechanischeKenngroessen.tsx`; Inhalt `content/mechanischekenngroessen/Beispiele.json`, `content/mechanischekenngroessen/Grundlagen.json`, `content/mechanischekenngroessen/KriechModellDiagramm.json`, `content/mechanischekenngroessen/KriechenSchwinden.json`, `content/mechanischekenngroessen/MechanischeKenngroessen.json`, `content/mechanischekenngroessen/Steifigkeiten.json`, `content/mechanischekenngroessen/Zugversuchsimulator.json`, `content/mechanischekenngroessen/daten.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/mechanischeKenngroessen.ts` | `tests/mechanischeKenngroessen.test.ts` (22), `tests/modulpruefungTranche10.test.ts` (104) | S235, Ø 25 mm, L = 3 m, F = 80 kN: σ = 162,97 N/mm², ε = 0,776 ‰, ΔL = 2,33 mm, F_K = 4,42 kN |
| `src/calc/kriechenSchwinden.ts` | `tests/kriechenSchwinden.test.ts` (46), `tests/modulpruefungTranche10.test.ts` (104), `tests/tranche16.test.ts` (45) | SOFiSTiK-Verifikation C35/45, RH 80 %, h₀ = 500 mm: φ(t,t₀)/1,05 = 1,393, Δε_cs = 18,85·10⁻⁵; Relaxation Klasse 2, μ = 0,7, 1000 h: 0,96 % |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T10-MK-1 | Relaxationsklassen falsch beschrieben (Klasse 1/2 Drähte und Litzen, Klasse 3 Stäbe) | erledigt (behoben) | T10 (`module-tranche-10.md`) (Nr. 7) |
| T10-MK-2 | Querdehnzahl „0 ≤ ν ≤ 0,5“ → −1 < ν ≤ 0,5 | erledigt (behoben) | T10 (`module-tranche-10.md`) |
| T10-MK-3 | Porenbeton φ∞ 1,5–3,0 → 0,5 (0,2–0,7) nach DIN EN 1996-1-1/NA | erledigt (behoben) | T10 (`module-tranche-10.md`) |
| T10-MK-4 | σ_true nur bis Gleichmaßdehnung, Stahlkriechen 0,3–0,4·T_m, Kunststoffe oberhalb T_g, DIN 18008/k_mod, Holz-Schwindmaße, Alu T66 | erledigt (behoben) | T10 (`module-tranche-10.md`) |
| T10-MK-5 | φ∞ Leichtbeton 1,5–2,5 und Kalksandstein 1,0–2,0 nicht öffentlich belegt | offen (Normtext) (gekennzeichnet) | T10 (`module-tranche-10.md`) |
| T10-MK-6 | Werkstoffmatrix Holz C24 ν = 0,05 und ε_cs = −0,20 ‰; „Elastomerlager verlieren bis zu 70 % Steifigkeit“ unbelegt | als vorläufige Lehrwerte gekennzeichnet; Quelle offen | T10 (`module-tranche-10.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T10-MK-5a | DIN EN 1996-1-1/NA:2019-12, NA, Tabelle der Verformungskennwerte (Endkriechzahl) | φ∞ Leichtbeton | „Φ∞ ≈ 1,5 bis 2,5 (vorläufig, F-Freigabe)“ – `content/mechanischekenngroessen/KriechenSchwinden.json:59` |
| T10-MK-5b | DIN EN 1996-1-1/NA:2019-12, wie oben | φ∞ Kalksandstein | „Φ∞ ≈ 1,0 bis 2,0“ – `content/mechanischekenngroessen/KriechenSchwinden.json:58` |
| T10-MK-6a | Ohne benannte Norm (Kennwerte Holz, Elastomerlager), – (Quelle eintragen) | Querdehnzahl Holz C24 in der Werkstoffmatrix (richtungsabhängig 0,02 bis 0,5) | `nu: 0.05` – `src/modules/mechanischekenngroessen/daten.ts:70` |
| T10-MK-6b | Ohne benannte Norm (Kennwerte Holz, Elastomerlager), – (Quelle eintragen) | Endschwindmaß längs zur Faser | `epsSchwinden: -0.20` (‰) – `src/modules/mechanischekenngroessen/daten.ts:77` |
| T10-MK-6c | Ohne benannte Norm (Kennwerte Holz, Elastomerlager), – (Quelle eintragen) | Steifigkeitsverlust Elastomer-Brückenlager | „verlieren bis zu 70 % ihrer elastischen Steifigkeit“ – `content/mechanischekenngroessen/KriechenSchwinden.json:69` |

## Quizfragen

7 Fragen, davon 1 nicht freigegeben: `qlz_mechanische_kenngroessen_1`.

## Quellen

DIN EN 1992-1-1 (3.1.4, 3.3.2, Anhang B), DIN EN 1996-1-1/NA (Verformungskennwerte; Normtext nicht öffentlich), Xella „Bautechnologie kompakt“ 2024, thyssenkrupp Werkstoffblatt EN AW-6060, SOFiSTiK-Verifikation (Kriechen und Schwinden). Befundliste Tranche 10, Nr. 7.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Beispiel 1: S235, d = 30 mm, L = 4 m, F = 120 kN → A = 706,86 mm², EA = 148,44 MN, σ = 169,77 N/mm², ΔL = 3,234 mm, Δd = −7,3 µm, U = 194,0 J; G = 80 769, K = 175 000 N/mm².
2. C24 100/200 mm, L = 3 m, Druck 50 kN: I_min = 1,667·10⁷ mm⁴, F_K = 201,0 kN, σ = −2,5 N/mm².
3. Kriechen mit E_c = 1,05·E_cm (EC 2, 3.1.4(3)): Rechteck 30 × 60 mm, C30/37, 20 kN, φ = 2,2, ε_s = 0,45 ‰ → ΔL_ges = −1,010·3,2 − 1,35 = −4,58 mm.
4. Relaxation Klasse 2 (Litze, niedrig), μ = 0,7, 1000 h → 0,96 %; Klasse 1 → 4,69 %; Klasse 3 → 2,14 %.
5. Endkriechzahlen Mauerwerk: Leichtbeton 1,5–2,5, Kalksandstein 1,0–2,0, Porenbeton 0,5 (0,2–0,7) gegen die Tabelle des NA zu DIN EN 1996-1-1 prüfen (T10-MK-5a/b).
6. Werkstoffmatrix Holz C24: ν = 0,05 und ε_cs = −0,20 ‰ längs (`content/mechanischekenngroessen/daten.json:10`) sowie Elastomerlager „bis etwa 70 %“ – als vorläufige Lehrwerte gekennzeichnet; Quelle eintragen oder Kennzeichnung als ausreichend werten (T10-MK-6a–c).

## Empfehlung

**freigabereif.** Alle Rechenfälle stimmen, T10-MK-1 bis -4 sind behoben. T10-MK-5a/b brauchen den NA zu DIN EN 1996-1-1. T10-MK-6a–c sind keine Normwerte, sondern Kennwerte ohne Quelle; sie sind im Modul bereits als vorläufige Lehrwerte gekennzeichnet (`content/mechanischekenngroessen/daten.json`, `KriechenSchwinden.json`). Vorschlag: Quelle nachtragen oder die Kennzeichnung als Lehrwert als ausreichend werten.

Bisher „freigabereif nach Klärung von T10-MK-5a/b und T10-MK-6a–c“. Die offenen Normpunkte (von T10-MK-5a/b und T10-MK-6a–c) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
