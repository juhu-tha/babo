# Kleinpunkte 04.11.2026 – offene Punkte aus den Berichten vom 03.11.

Grundlage: `docs/pruefung/gutachten-umsetzung-2026-11-03.md` (Abschnitt 3, „Offen“), `docs/pruefung/a11y-tastatur-sr-2026-11-03.md` (Hinweis zu T9) und `docs/pruefung/lernziel-abdeckung-2026-11-03.md` (Folgerunde, Rest). Branch `audit/kleinpunkte-11-04` ab `a11y/tastatur-sr-11-03` (#323). Prüfvermerke (`src/data/pruefvermerke.ts`) und Quizfreigaben sind unverändert. Ratsche und Prüfungen: `tests/kleinpunkte1104.test.ts`.

## 1. Modulüberschriften (Regel „Modultitel“, `docs/architektur.md`)

| Modul | vorher (erste h2) | nachher |
|---|---|---|
| `zfp` | „Rückprallhammer“ (erster Simulator) | Kopfkarte „Bauwerksdiagnose – ZfP-Simulatoren & DGZfP“ mit einem Satz Einleitung vor den Verfahrensreitern (`src/modules/ZfP.tsx`, Texte `content/zfp/ZfP.json`) |
| `ausbau` | „Trockenbau“ (erster Abschnitt) | Kopfkarte „Ausbau & Abdichtung“ mit einem Satz Einleitung vor den Reitern (`src/modules/Ausbau.tsx`, `content/ausbau/Ausbau.json`) |
| `nawaro` | „NaWaRo \| Biobasierte Baustoffe“ | „Biogene Baustoffe (NaWaRo)“ (Titel, Zusatz in Akzentfarbe wie bisher) |
| `aufgaben_kennwerte` | „Übungsaufgaben: Labor, Prüftechnik & Kenngrößen“ | „Übungsaufgaben: Labor & Grundlagen: Prüftechnik & Kenngrößen“ (Kategoriename in `src/data/aufgabenData.ts`) |

- `AUSNAHMEN_UEBERSCHRIFT` (`scripts/qa/modultitel.mjs`): die vier „offen:“-Einträge gestrichen, 58 Einträge; Ratsche in `tests/modultitel.test.ts` von 62 auf 58.
- Build-Prüfung (`node scripts/qa/modultitel.mjs`, BB_STATISCH=1): 265 Modulüberschriften geprüft, 0 nennen das Modul nicht, keine ungenutzte Ausnahme.

Beim Prüfen auf den geänderten Routen gefunden und behoben (`scripts/qa/a11y-tastatur.mjs`, bestand schon vorher):
- `nawaro`: Überschriftensprung h2 → h4 („CO₂-Speicher-Effekt“, „Ressourceneffizienz“) → h3 mit gleicher Optik; SVG „Kohlenstoff-Dynamik“ ohne Textalternative → `role="img"` mit `aria-label` (Text in `content/nawaro/Nawaro.json`).
- `aufgaben_*`: Kartentitel „Fach-Quiz & Wissenscheck: …“ und „Lernziele: Übungsaufgaben, …“ waren `h4` vor der Bereichsüberschrift (Sprung h1 → h4) → Absatz mit gleicher Optik (`src/modules/Aufgaben.tsx`; `BloomLernziele` hat dafür die Eigenschaft `titelElement`, Standard weiter `h4`).
- `zfp`: Simulatorergebnisse wurden nicht angesagt (4.1.3) → je Ergebnis eine Kurzzeile `ErgebnisAnsage` (Rückprall, Ultraschall, Impact-Echo, Wenner-Sonde, Bewehrungssucher, Georadar, Durchstrahlung; `src/modules/zfp/*Tab.tsx`), wie T9 vom 03.11.

## 2. Lernhilfen mit alten Modulnamen

Reine Namensangleichung im Freitext `gapAnalysis.actionableAdvice` („… im Modul <Name> noch einmal durch.“) auf den Modultitel aus der Registry; die gespeicherten Felder `moduleTitle`/`targetModuleLabel` sind mitgezogen (zur Laufzeit ohnehin aus der Registry, `src/data/quizModell.ts`). Wie die Regel „Thema/Abschnitt“ vom 02.11. (`tests/umsetzungQuiztext_20261102.test.ts`) und „Begriff angeglichen 02.11.“: Frage, Antworten, Rückmeldungen und Freigabe bleiben; `vorpruefung.hinweis` trägt „Modulname angeglichen 04.11.“ (`am`/`ergebnis` unverändert).

Auswahl: Name im Ratschlag enthält das Label nicht **und** enthält Wörter, die weder im Titel noch im Label stehen (Skript im Bericht nicht eingecheckt; die Liste prüft der Test). Bericht 03.11. nannte 7; mit derselben Regel sind es 16:

| Fragen | alter Name | Modultitel |
|---|---|---|
| `q_bpm_1`, `q_bpm_2` | Mineralische Bauprodukte | Mineralische Werkstoffe im Hochbau |
| `q_bpt_1`, `q_bpt_2` | Metallische Bauprodukte | Metallische Werkstoffe & Bleche |
| `q_son_1`, `q_son_2` | Sonstige Baustoffe | Sonstige & Innovationen |
| `q_bwu_2` | Bauwerksdiagnose & ZfP | Bauwerksdiagnose – Prüfverfahren-Katalog |
| `q_bwu_1`, `qn_bauwerksuntersuchung_1`–`_3` | Bauwerksdiagnose & ZfP | Bauwerksdiagnose – Ablauf, Probenahme & Bewertung |
| `q_bpr_1`–`q_bpr_5` | BauPVO & CE-Kennzeichnung | CE vs. Ü & MVV TB |

Nicht geändert: `q_ki_bs_1`–`_6` („KI in der Baustoffkunde“) – `ki_baustoffe` hat keine Menügruppe und keinen Titel, die sichtbare Bereichsüberschrift lautet „KI in der Baustoffkunde: Bereiche“. Kurzformen (Label, Label-Teil wie „Spannbeton“, „Ausbau“, „Gläser“) bleiben, sie widersprechen der Regel nicht.

Prüflisten (`npx tsx scripts/pruefliste.ts`) neu erzeugt.

## 3. Gebündelte Ergebnisansagen (WCAG 4.1.3)

Vorher: Jede `ErgebnisAnsage` (in jeder `FormulaDerivationBox` mit Ergebnishinweis und in sechs Modulen als Kurzzeile) hatte eine eigene Live-Region mit eigener Entprellung; betraf eine Eingabe mehrere Boxen, wurden alle nacheinander angesagt.

Nachher (`src/components/ui/ErgebnisAnsage.tsx`): ein gemeinsames Bündel je Seite (Modul bzw. Reiter).
- Jede Ansage meldet ihre Textänderungen an das Bündel; der Text beim Einhängen gilt weiter als Seitenaufbau und wird nicht angesagt.
- Nach 0,7 s Ruhe (`ANSAGE_RUHE`, über alle Boxen) entsteht **eine** Meldung: das erste geänderte Ergebnis in Seitenreihenfolge, bei mehreren mit „– und N weitere Ergebnisse aktualisiert“ (`buendelText`, höchstens 300 Zeichen, der Zusatz bleibt beim Kürzen erhalten).
- Gesprochen wird aus der Region des ersten geänderten Ergebnisses (es ist sichtbar, weil es sich gerade geändert hat); alle anderen Regionen bleiben leer. Wird diese Region ausgehängt (Reiterwechsel), wird die Meldung geleert.
- Die Logik ist DOM-frei (`erzeugeAnsageBuendel`, Zeitgeber austauschbar) und in `tests/kleinpunkte1104.test.ts` geprüft (drei Boxen, Zwischenwerte beim Ziehen → ein Zeitgeber, eine Meldung).
- `scripts/qa/a11y-tastatur.mjs` meldet jetzt zusätzlich „Mehrfachansage“, wenn nach einer Reglereingabe mehr als eine Ergebnis-Region Text trägt.

**Befund am Rande (nicht geändert):** 303 von 318 `ergebnisHinweis`-Angaben sind feste Texte aus `content/`. Diese Boxen ändern sich bei Eingaben nicht und werden deshalb nicht angesagt; Mehrfachansagen entstehen damit heute nur selten (in der Stichprobe trug nach einer Eingabe nie mehr als eine Region Text, z. B. `knicken`: 3 Regionen, 1 Meldung). Rechner, deren Ergebnis nur in einer festen Box steht, melden in `a11y-tastatur.mjs` „Ergebnis nach Reglereingabe nicht als Statusmeldung angesagt“ (geprüft: `statistik`, `sonderbetone`; `rissbreite` beim ersten Regler, der w_k nicht ändert). Das bestand vorher und ist kein Mehrfachansage-Fall; Kurzzeilen für diese Rechner (wie T9 und hier für `zfp`) sind ein eigener Auftrag.

## 4. Lernziel-Abdeckung – Rest

Sechs neue Fragen, alle `verified: false`, mit Bloom-Stufe, Niveau, Rückmeldung je Option, Lernhilfe, `normRef` und `quelle`; die richtige Antwort ist nicht die längste, Spannweite ≤ 1,2, keine Absolutwörter. Zuordnung in `ZUORDNUNG_MANUELL` (`scripts/qa/lernziel-abdeckung.mjs`). Inhalte der Module sind nicht geändert.

| Frage | Lernziel | Bloom | Thema | normRef |
|---|---|---|---|---|
| `qlz_bauschaeden_1` | `bauschaeden#1` | Verstehen | Mangel und Schaden (fehlende Abdichtung, Keller trocken) | BGB § 633 |
| `qlz_schadensbilder_1` | `schadensbilder#3` | Anwenden | Mindestfugenbreite: L = 4,0 m, α_T = 10 · 10⁻⁶ 1/K, ΔT = 80 K → ΔL = 3,2 mm, b_erf = 3,2/0,25 = 12,8 mm (nachgerechnet im Test; Formel und Beispiel des Moduls) | DIN 18540, DIN EN 15651-1 |
| `qlz_schadensbilder_2` | `schadensbilder#4` | Analysieren | Kohäsionsbruch bei 5-mm-Fuge → Planungsfehler (Überdehnung über ZGV), Abgrenzung Flankenabriss/Dreiflankenhaftung/Blasen | DIN 18540, DIN EN 15651-1 |
| `qlz_schadensbilder_3` | `schadensbilder#5` | Bewerten | wasserführender, bewegter Riss → PUR/Acrylatgel statt EP, ZS oder Hydrophobierung | DIN EN 1504-5, TR Instandhaltung |
| `qlz_historisch_1` | `historisch#4` | Analysieren | Neubau-γ_M, DBV-Merkblatt (nur Beton/Betonstahl) und EN 1990-2:2026 am Mauerwerkspfeiler | DIN EN 1990 Anh. C; EN 1990-2:2026; DBV-Merkblatt 2013 |
| `qlz_historisch_2` | `historisch#5` | Bewerten | ein einzelner Bohrkern belegt keine Klasse (Serie, Mindestanzahl, k_n, Kleinstwert) | DIN EN 13791:2020-02 (Werte nach Sekundärquellen – vorläufig, Normprüfung ausstehend) |

`historisch` und `ec_kennwerte`: Inhalt unverändert; in `historisch` lagen beide Restpunkte (Lernziel 4, höchste Stufe Bewerten), deshalb nur die beiden Fragen. `ec_kennwerte` hatte keinen offenen Punkt.

| Prüfpunkt | vorher (03.11. Folgerunde) | nachher |
|---|---|---|
| Lernziele ohne Quizfrage | 8 | **4** (Beton A–Z, Nachschlagewerk ohne Selbsttest, begründet) |
| Module ohne Frage auf höchster Lernzielstufe | 3 | **1** (`mischungsberechnung`, Stufe Erschaffen, begründet) |
| Lernziele mit Frage, aber keiner auf passender Stufe | 36 | **34** (Ratsche gesenkt) |

- `tests/lernzielAbdeckung.test.ts`: Ausnahmen `bauschaeden#1`, `schadensbilder#3`, `schadensbilder#4`, `historisch#4` sowie `historisch`/`schadensbilder` (höchste Stufe) gestrichen; `MAX_OHNE_PASSENDE_STUFE` 36 → 34.
- `tests/pruefliste.test.ts`: `NEU_SEIT_26_10` 158 → 164.
- `tests/umbauKlebDicht_20261102.test.ts`: Die Zählung „6 Fragen bauschaeden“ (Schutz des Kleb-/Dichtstoff-Umzugs) zählt die Lernziel-Fragen `qlz_*` nicht mit; die neue Frage betrifft Mangel/Schaden.
- Kommentar in `ZUORDNUNG_MANUELL` berichtigt: Lernziel-Nummern zählen ab 1 (stand „Index ab 0“).
- Suchindex: nur die Einträge der geänderten Seiten neu erzeugt (`zfp`, `ausbau`, `nawaro`, `aufgaben_kennwerte`, `bauschaeden`, `schadensbilder`, `historisch`, `bp_mineralisch`, `bp_metallisch`, `sonstiges`, `pruefverfahren_katalog`, `bp_recht_grundlagen`, `bauwerksdiagnose`); alle übrigen unverändert.

## QA

| Prüfung | Ergebnis |
|---|---|
| `npx tsc --noEmit` | 0 Fehler |
| `npm test` | 200/200 Testdateien ok (neu: `tests/kleinpunkte1104.test.ts`) |
| `check:formeln` / `check:zahlen` | 4678 Formeln, 0 fehlerhaft / 0 Befunde (inkl. Tausender) |
| `check-design`, `check-verwaist --strict`, `check-any` | 0 neu / 0 verwaist / 0 `any` |
| Build `BB_STATISCH=1`, `check-bundle --statisch` | ok, Budget eingehalten |
| `scripts/qa/modultitel.mjs` (nach Build) | 265 Überschriften, 0 Abweichungen |
| `a11y-reiter.mjs` (zfp, ausbau, nawaro, aufgaben_kennwerte, aufgaben_beton, bauschaeden, schadensbilder, historisch, knicken; desk, mob, desk-dunkel) | 150 Reiter-Prüfungen, 0 Verstöße |
| `a11y-tastatur.mjs --nur modul` (dieselben Routen + emodul, rechnung_u_wert; desk, mob) | 0 Befunde (vorher auf diesen Routen 8: zfp 4.1.3, nawaro 1.3.1/1.1.1, aufgaben_kennwerte 1.3.1) |

Vorschau: `PORT=4531 node scripts/qa/vercel-vorschau.mjs dist`.
