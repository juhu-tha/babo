# Gezielte Durchsicht Tranche A – Betontechnologie, Massivbau, Dauerhaftigkeit, Labor

**Stand:** 29.10.2026 (Branch `durchsicht/a-10-29`, Basis `audit/pruefskript-10-29`, PR #278)
**Auftrag:** Entscheidung vom 29.10.2026 zur vollständigen gezielten Durchsicht (Vorschlag in `docs/pruefung/nachpruefung2-2026-10-29.md`). Je Modul nur die Fehlerarten

- **(a)** Bezugsgrößen und Einstufungen in Beispielen (Würfel/Zylinder, Kern h/d, netto/brutto, je m²/m³/t, Klasse aus dem richtigen Wert),
- **(b)** Norm-, Teil-, Tabellen-, Abschnitts- und Ausgabenzuordnungen (Normen-Registry, Ausgaben Stand 10/2026),
- **(c)** mehrfach vorkommende Kennwerte gegen die zentralen Konstanten (`CONCRETE`, `src/data/kennwerte.ts`, `src/calc/mischung.ts`, Expositionsklassen-Daten u. a.).

Grundlage je Modul: Ergänzungsbogen `docs/pruefung/kennwert-abgleich/<modul>.md` plus eigene Durchsicht aller Beispiele, Tabellen und Karten (Inhalts-JSON und Komponenten). Alle Beispielrechnungen wurden mit einem eigenen Skript nachgerechnet (Sitzungsablage `scratchpad/dsA/nachrechnung.py`, 66 Werte plus Einzelrechnungen in Korrosion, Korrosionsschutz, Metallkorrosion, Analytik, Mechanische Prüfungen, Messen, Statistik, Labor-Handouts; Ergebnis: alle Modulwerte im Rundungsrahmen außer den unten genannten Befunden). **Prüfvermerke (`src/data/pruefvermerke.ts`) sind nicht geändert.** Regressionstest `tests/durchsichtA.test.ts`.

## Ergebnis

| | Anzahl |
|---|---|
| Module geprüft | 26 |
| Module mit Fachfehler | 10 von 26 (`spannbeton_grundlagen`, `beton_a_z`, `betonkennwerte`, `betonpraxis`, `herstellung_einbau`, `innovative_werkstoffe`, `qualitaetssicherung`, `sonderbetone`, `wu-bauwerke`, `metallkorrosion`) – davon gewichtig: 1 (DSA-SB-2); dazu reine Codebefunde ohne Anzeigefehler in `carbonbeton` und `korrosion` |
| Module ohne Befund | `festbeton`, `sichtbeton`, `korrosionsschutz_beschichtungen`, `schnellkarbonatisierung`, `weitere_organik`, `analytik`, `mechanische_pruefungen`, `messen_pruefen`, `labor_potentialmessung`, `labor_auslagerung`, `labor_frischbeton`, `labor_druckfestigkeit`, `labor_moertelprismen`, `statistik` |
| Fest verdrahtete Faktoren ohne Quellkommentar (Bogen) | vorher 81, nachher 4 (alle in `festbeton`: Zahlen im JSX-Text, Fehlerkennung des Skripts) – `spannbeton_grundlagen` 45 → 0 |
| Quizfragen geändert | keine (geprüft: `q_bgl_1`, `qn_spannbeton_8`, `qn_spannbeton_9` und Volltextsuche nach allen geänderten Werten – keine Frage wird falsch) |

**Gewicht:** Wie in den Nachstichproben liegen die Fehler außerhalb der Rechenkerne: in Fließtext, Karten und einer im Modul nachgebauten Tabelle. Ein Befund ist gewichtig, weil er eine Rechnung betrifft: Der Betondeckungsrechner im Spannbeton-Reiter Dauerhaftigkeit rechnete mit den EN-Empfehlungswerten (Tab. 4.4N, Klasse S4) statt mit DIN EN 1992-1-1/NA, Tab. 4.4DE (DSA-SB-2). Im Standardfall bleibt c_nom gleich (maßgebend ist das Hüllrohr), bei kleinen Hüllrohren und im Hochbau lag c_nom bis 5 mm zu hoch (konservativ).

## Befunde je Modul

### Massivbau

#### `spannbeton_grundlagen` (Schwerpunkt)
Geprüft: Reiter 0–100 (Stationen 1–6), Grundprinzipien (8 Unterreiter), Dauerhaftigkeit (Deckungsrechner, Einpressmörtel, Dekompression, ZfP, Schadensfälle); die 45 Faktoren des Bogens stammen überwiegend aus `Spannbeton.tsx` und dem Teil Kennwerte und sind hier mit erledigt.
(a) Trägerbeispiel C40/50 500 × 1000 mm: M_cr = 0,0833 m³ · 3500 kN/m² = 291 kNm, k_u = 167 mm, 31 × 0,6″-Litzen · 1360 N/mm² ≈ 6300 kN – richtig. (b) Gl. (5.41), (5.43), (5.44)–(5.46), (3.1), (3.2), (3.5), (3.12), (3.14), (3.29), (6.63), 7.2, 7.3.1/Tab. 7.1DE richtig zugeordnet. (c) siehe Befunde.

| Kennung | Befund | Art | Gewicht | Status |
|---|---|---|---|---|
| DSA-SB-2 | Deckungsrechner: c_min,dur mit EN-Werten Tab. 4.4N/S4 (XC1 15, XC2/3 25, XC4 30, XD1/2/3 35/40/45 mm) statt NA DE Tab. 4.4DE (10/20/25/40 mm, zentral in den Expositionsklassen-Daten und `DECKUNG`); Rechnung lag im Modul statt im Kern | (c) | gewichtig (Rechnung, konservativ) | behoben: Kern `spanngliedDeckung` in `src/calc/spannbeton.ts` mit `C_MIN_DUR_BETONSTAHL_NA`, Test der Gleichheit mit den zentralen Daten; Text nennt Tab. 4.4DE |
| DSA-SB-1 | Initialdehnung Y1860 als „1400/195 000 = 7,18 ‰“, die Rechnung daneben nutzt σ_pm0 = 1360 N/mm² (6,97 ‰, wie Station 2) | (c) | gering | behoben |
| DSA-SB-5 | Grenzspannungstabelle: „Dekompressionsnachweis in 25-mm-Radialzone“, „innerhalb des 25-mm-Radius“ – Rechner und übriger Text nach NA DE 100 mm bzw. h/10 | (b) | gering | behoben (NA DE, EN-Empfehlung in Klammern) |
| DSA-SB-3 | „f_ctm 2,2 bis 4,1 N/mm² – etwa 7–10 %“: C20/25 ergibt 11 % | (c) | gering | behoben (8–11 %) |
| DSA-SB-4 | „P∞ ≈ 0,80…0,85 P_m0; zeitabhängige Verluste typisch 10–20 %“ widerspricht sich | (c) | gering | behoben (0,80…0,90) |
| DSA-SB-6 (Normtext) | Koppelstellen „Mindestversatz 1,50 m“ – nach DIN EN 1992-1-1, 8.10.4 von der Bauteilhöhe abhängig (1,5 m nur bis h = 1,5 m) | (b) | gering | gekennzeichnet „vorläufig, Normprüfung ausstehend“ |
| DSA-SB-7 | 45 Faktoren ohne Quelle: Spannstahlkennwerte (f_pk, f_p0,1k, E_p = 195 000), Litzenfläche 150 mm², ρ_1000, Spannungsgrenzen (0,80/0,90, 0,75/0,85, 0,60, 0,45, 0,65), Betonwerte der Beispielrechnung, β_cc/E_cm(t) nachgebaut | (c) | gering (Werte richtig) | behoben: zentral `E_SPANNSTAHL`, `SPANNSTAHL`, `RHO_1000`, `SPANNUNGSGRENZEN`, `sigmaPMax`, `sigmaPm0Grenze` in `src/utils/ec2Spannbeton.ts` (mit Absatzangaben), `LITZE`, `CONCRETE`, `betaCc`, `EcmT`; Überschlag im Kennwerte-Explorer als Lehrnäherung gekennzeichnet; Darstellungsfaktoren kommentiert. Verhalten unverändert (Test) |

Zusätzlich gekennzeichnet (vorläufig, Normprüfung ausstehend, im Kern und Text): Zuschlag +5 mm für 100 Jahre bei Brücken und Abzug −5 mm für C45/55 und C50/60 im Deckungsrechner; c_min,b = 1,5·Ø für Monolitzen als Lehrannahme.

#### `carbonbeton`
(a) Beispiel h = 40 mm, C50/60, a_tex = 100 mm²/m: f_td = 1923, x = 8,5 → ε_c = 3,79 ‰ > 3,5 ‰; mit Dehnungskontrolle x = 8,20 mm, σ_tex = 1860 N/mm², m_Rd = 4,97 ≈ 5,0 kNm/m (ohne Kontrolle 5,12) – richtig. (b) ohne Befund. (c) Vergleichskurve B500B mit 500/200 000/540 N/mm² fest verdrahtet → zentral `BETONSTAHL.B500B`, `E_BETONSTAHL` (gleiche Werte). Kein Anzeigefehler.

#### `wu-bauwerke`
(a) Beispiel I = 3,0/0,30 = 10 → w_k ≤ 0,20 mm; Mindestdicken 240/200/250/150 mm wie im Modul Betonpraxis. (b) WU-Richtlinie 2017-12, DIN 18197:2018-01, DIN 18533-1:2026-06 wie Registry.

| DSA-WU-1 | „F3 bis F4 (weich bis fließfähig)“ – F4 ist „sehr weich“ (DIN EN 206) | (b) | gering | behoben |
|---|---|---|---|---|

### Betontechnologie

#### `beton_a_z`
(a) Powers-Kapillarporen p = (w/z − 0,36)/(w/z + 0,32): 0,40 → 5,6 %, 0,45/0,50 → 12/17 %, 0,60 → 26 % – wie Karten; Betondeckungstabelle Tab. 4.4DE + Δc_dev richtig. (b) ohne weiteren Befund.

| DSA-BAZ-1 | „Sehr fließfähig (F5) / fließfähig (F6)“ vertauscht (F5 fließfähig, F6 sehr fließfähig) | (b) | gering | behoben |
|---|---|---|---|---|

#### `betonkennwerte`
(a) Beispiel C30/37: f_cd = 17,0, f_ctm = 2,9, E_cm = 32,8 GPa – richtig. (c) Modultabelle `EC2_CONCRETE_CLASSES` stimmt in allen 14 Klassen und allen Spalten mit `CONCRETE` überein (jetzt Test).

| DSA-BK-1 | „aller 15 genormten Betonfestigkeitsklassen“ bzw. „C12/15 bis C100/115“ – Tab. 3.1 enthält 14 Klassen bis C90/105, C100/115 ist im Modul Lehrwert | (b) | gering | behoben |
|---|---|---|---|---|

#### `betonpraxis`
(a) Dichteabweichung −0,02 kg/l ≙ 10 l/m³ Luft bzw. 15 l Zusatzwasser (2,35·10 bzw. 15·1,35 kg) – richtig; WU-Mindestdicken, Bohrkernkriterien 0,85·(f_ck − 4)/(f_ck + 1)/(f_ck + 2) nach DIN EN 13791 und Nachbehandlung (zentral `DIN1045_3_NACHBEHANDLUNG`) richtig.

| Kennung | Befund | Art | Gewicht | Status |
|---|---|---|---|---|
| DSA-BP-1 | Luftporen „−2 N/mm² je Vol.-%“ fest verdrahtet – zentral (Entscheidung 29.10.) 5 % je Vol.-% (`LP_FESTIGKEITSVERLUST_JE_PROZENT`) | (c) | gering | behoben: 5 % · f_cm(C30/37) = 1,9 N/mm² je Vol.-%, Text nennt die Bezugsgröße |
| DSA-BP-2 | Warnkasten bei 20 l/m³ Zusatzwasser „fällt um > −8 N/mm²“, der Rechner daneben 20/10 · 3,5 = 7 N/mm² | (c) | gering | behoben |
| DSA-BP-3 | Krell-Kennwert: Bezeichnungen „≥ 0,33“ und „≥ 0,35“, die Rechnung stuft ab > 0,31 bzw. > 0,34 ein | (a) | gering | behoben (Bezeichnungen wie Rechnung) |

#### `festbeton`
(a) β_cc(7 d) = 0,78, f_cm(7) = 29,6 N/mm²; Konformität 30 + 1,48 · 3,0 = 34,4 ≤ 36,0, 27,5 ≥ 26,0 – Würfelbezug richtig. (b) LC-Klassen, η_1/η_E nach 11.3, DIN EN 12390-2 NA (0,92/0,95) richtig. (c) Klassentabelle `NORM_KLASSEN` gleich `CONCRETE` (jetzt Test; C8/10 und C100/115 als Lehrwerte gekennzeichnet). **Ohne Befund.** Die 4 verbleibenden „Faktoren“ des Bogens sind Zahlen im JSX-Text (z. B. „DIN EN 206 / EC2“) – Fehlerkennung des Skripts.

#### `herstellung_einbau`
(a) Pumpendruck 3,2 + 13,9 + 4,7 ≈ 22 bar, Lieferschein 100 min > 90 min – richtig.

| DSA-HE-1 | „Nach DIN 1045-2:2023-08 ist nur Flugasche anrechenbar“ – Silikastaub darf mit k = 1,0 angerechnet werden (s ≤ 0,11·z), nur bei XF2/XF4 nicht (wie Kern `mischung.ts` und alle übrigen Module) | (c) | gering | behoben |
|---|---|---|---|---|

#### `innovative_werkstoffe`
(a) Fließgrenze 3DCP ρgH/√3 = 23,8 kPa richtig; 0,653 = 7,837/12 (Suiker) jetzt kommentiert.

| DSA-IW-1 | UHPC-Druckfestigkeit im selben Modul dreifach verschieden (150–250, 150 bis über 250, 150–230 N/mm²), Carbonfaser 3000–5000 bzw. 3000–4500 N/mm² | (c) | gering | behoben (einheitlich 150–250 bzw. 3000–5000, wie Modul UHPC) |
|---|---|---|---|---|

#### `qualitaetssicherung`
(a) Beispiel 37 + 1,48 · 3,0 = 41,4, f_ci ≥ 33 (Würfel) richtig; Szenarien 1 (Würfel) und 3 (Zylinder, f_ck + 1 = 31,0) mit richtigem Bezug. CSC-Gewichte als Lehrannahme gekennzeichnet.

| DSA-QS-1 | Szenario 2: „Mittel 41,67, s = 1,76“ – aus den 15 Werten 41,64 und 1,77 N/mm²; dazu Dezimalpunkte | (a) | gering | behoben |
|---|---|---|---|---|

#### `sichtbeton`
(a) c_nom = 25 + 15 = 40 mm (XC4, Tab. 4.4DE), Porenanteil 600/250 000 = 0,24 %, w/z 175/350 = 0,50 – richtig. **Ohne Befund.**

#### `sonderbetone`
(a) η_E = 0,53, RC-Mehrwasser 22,5 kg/m³, Dränbeton 24 % Hohlraum, (w/z)_eq = 0,40, Schwerbeton 3310 kg/m³ (Trockenrohdichte im Text richtig eingeordnet) – richtig.

| Kennung | Befund | Art | Gewicht | Status |
|---|---|---|---|---|
| DSA-SO-1 | Infraleichtbeton „U < 0,24 W/(m²K) bei 40–50 cm“ – mit λ = 0,12…0,18 und 50 cm U ≈ 0,23…0,34 (40 cm, λ 0,12: 0,29) | (a) | gering | behoben |
| DSA-SO-2 | Bohrpfahlbeton: Mindestzementgehalt „abhängig vom Größtkorn“ – nach DIN EN 1536 vom Einbauverfahren (325/375 kg/m³), vom Größtkorn hängt der Mehlkorngehalt ab (wie Reiter Bohrpfahlbeton) | (c) | gering | behoben |

Lehrnäherungen in Leichtbeton und Recyclingbeton als solche kommentiert.

### Dauerhaftigkeit

- **`korrosion`:** Chloridbeispiel D = 9,47 mm²/a, z = 1,034, C = 0,43 M.-% (35 mm: 0,77), Faraday 11,6 µm/a und 3,8 % Querschnittsverlust – richtig. Codebefund: Schadensstufen der Grafik mit eigenen Schwellen 0,7/1,5/2,8·f_ctm dupliziert → aus `schadensStufe` des Kerns (gleiches Ergebnis). Kein Anzeigefehler.
- **`korrosionsschutz_beschichtungen`:** 85/2,1 = 40,5 a (VH), C5 10,1…20,2 a (M), Duplex 1,5 · 20,1 = 30,2 a (f = 1,2: 24,1 a, H); ISO 9223-Raten, 2409-Schnittabstände, 80/20-Regel richtig. **Ohne Befund.**
- **`metallkorrosion`:** PREN 24,4 und 34,6, Zinkschutz 40 a richtig. **DSA-MK-1** (c, gering, behoben): Rostvolumen „4- bis 6-fach“, im Modul Korrosion „2- bis 6-fach“ → einheitlich 2- bis 6-fach (je nach Oxid).
- **`schnellkarbonatisierung`:** K_AC = 0,903, K_nat = 1,99 mm/√a, x(50 a) = 14,1 mm, 15 mm nach 57 a – richtig; EN 1992-1-1:2023 nur als Ausblick. **Ohne Befund.**
- **`weitere_organik`:** Arrhenius e^1,083 = 2,95, Faktorenmethode 25 · 0,96 = 24 a – richtig. **Ohne Befund.**

### Labor & Auswertung

- **`analytik`:** Portlandit 2,5 · 4,11 = 10,3 M.-%, Washburn r = 74 nm, Bragg d = 0,335 nm, Chloridklassen Cl 0,40/0,20 – richtig. **Ohne Befund.**
- **`mechanische_pruefungen`:** Würfel 46,7 N/mm² (78 s bei 0,6 MPa/s), Spaltzug 3,54 → 3,18 N/mm², B500B R_e 548/R_m 615, k = 1,12, A_gt 7,5 %; Bohrkern-Einstufung über den Würfelwert (≥ 37 → ≥ C30/37) – Bezug richtig. Veralteter Kommentar „Würfelwert ≈ f_c/0,82“ angepasst. **Ohne Befund.**
- **`messen_pruefen`:** GUM-Budget x̄ = 38,80, s = 0,69, u_c = 0,32, U = 0,64; z = −2,22, E_n = −2,63 – richtig. **Ohne Befund.**
- **`labor_potentialmessung`, `labor_auslagerung`, `labor_frischbeton`, `labor_druckfestigkeit`, `labor_moertelprismen`:** ASTM-C876-Grenzen und E_CSE = E_SHE − 316 mV, K = 8,76·10⁷, Ausbreitmaß 460 mm → F3, Rohdichte 2350 kg/m³, Würfelserie 42,4/43,6/41,5 N/mm² gegen C30/37 (Würfelbezug f_ck,cube + 4), Mörtelprismen R_f = 1,5·F·l/b³ – richtig. **Ohne Befund.**
- **`statistik`:** k_n = 1,92 (n = 10) bzw. 3,37 (n = 3), X_k = 32,2/27,8, X_d = 21,5; Grubbs G = 2,74 > 2,48 – richtig. **Ohne Befund.**

## Fragen mit Vorschlag

| Kennung | Frage | Vorschlag |
|---|---|---|
| DSA-SB-2a (Normtext) | Deckungsrechner Spannbeton: +5 mm für 100 Jahre (Brücke) und −5 mm für C45/55/C50/60 sind ohne Beleg; für Brücken gilt DIN EN 1992-2/NA mit eigenen Werten | Am Normtext prüfen; bis dahin gekennzeichnet lassen |
| DSA-SB-6 (Normtext) | Koppelstellen: Mindestabstand nach DIN EN 1992-1-1, 8.10.4 abhängig von h | Tabellenwerte nach Normtext ergänzen |
| DSA-X-1 (außerhalb Tranche) | `content/expositionsklassen/Expositionsklassen.json` nennt k_s = 1,0 (w/z ≤ 0,45) bzw. 2,0 (w/z > 0,45) – EN-Empfehlung; DE und der Kern rechnen k = 1,0 | In der Durchsicht der Expositionsklassen auf DIN 1045-2 angleichen |

## Prüfbogen (Ergänzung a–c) – erledigt für alle 26 Module

- [x] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft und nachgerechnet
- [x] (b) Normverweise in Überschriften, Karten und Tabellen (Teil, Tabelle, Ausgabe) geprüft; uneinheitliche Ausgaben im Bogen betreffen nur andere Module bzw. sind Ausblicke auf die 2. Generation
- [x] (c) Kennwerte gegen zentrale Konstanten: abweichende behoben, Tabellen-Duplikate per Test gebunden
- [x] fest verdrahtete Faktoren belegt, zentral übernommen oder als Darstellungsgröße kommentiert
