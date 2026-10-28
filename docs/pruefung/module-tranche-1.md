# Modulprüfung Tranche 1 – Rechnermodule (Befundliste zur Freigabe)

**Stand:** 27.10.2026 (Branch `pruefung/module-tranche1-10-27`, Basis origin/main 9f67cda3)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke geändert.

## Vorgehen

- **Tranchen à 10 Module, Rechnermodule zuerst.** Tranche 1 umfasst die zentralen Rechenkerne der Pflichtfächer Massivbau, Betontechnologie, Mauerwerksbau, Holzbau und Bauphysik.
- **Auswahl:** Die Kerne werden in mehreren Modulen verwendet (z. B. `holzbau.ts` in 6 Modulen, `biegung.ts`, `waermeschutz.ts` und `schall.ts` in je 3 Modulen). Sie decken die Rechenverfahren ab, die in den Klausuren am häufigsten vorkommen, und stützen sich auf Eurocodes mit NA DE bzw. DIN-Normen, deren Ausgaben bauaufsichtlich relevant sind.
- **Prüfumfang je Modul:** Fachtext (`content/*.json`) auf fachliche Richtigkeit und Normstand, Rechenkern mit mindestens drei eigenen Nachrechnungen (eigene Umsetzung der Normgleichungen in einem getrennten Skript, keine Übernahme der Testwerte; Randfälle eingeschlossen), Grenzen/Hinweise (`src/data/rechnerGrenzen.ts`), Beispiele mit Rechenweg, Lernziele und Kurzfassung (`src/data/lernziele.ts`, `src/data/kurzfassung.ts`), Quellen und Literatur sowie offene Stellen „vorläufig, F-Freigabe“.
- **Ergebnis der Nachrechnung:** 159 Einzelvergleiche, 153 ohne Abweichung (Toleranz 0,5 %). Die Abweichungen betreffen nur die Stütze (Befunde S-1 und S-2) sowie f₀ im Trittschallrechner (Faktor 160 statt 1/(2π)·10³ = 159,2, Abweichung 0,5 %, als Näherung gekennzeichnet, kein Befund). Die maßgebenden Sollwerte sind als Regressionstest in `tests/modulpruefungTranche1.test.ts` festgehalten.
- **Prüfeinheiten und Prüfvermerke:** Biegung, Querkraft, Stütze und Durchstanzen sind Reiter des Moduls `stahlbeton_bemessung`. Der Prüfvermerk für dieses Modul setzt zusätzlich die Prüfung der Reiter Verankerung, Rissbreite und σ-ε-Linien voraus (Vorschlag: Tranche 2). Für die Reiter 1–4 wird deshalb eine Teilfreigabe erbeten.
- Es wurden nur öffentliche Quellen verwendet. Normtexte wurden nicht abgeschrieben.

## Übersicht

| Nr. | Prüfeinheit | Prüfvermerk-ID | Rechenkern | Empfehlung |
|---|---|---|---|---|
| 1 | Biegebemessung | `stahlbeton_bemessung` (Reiter) | `src/calc/biegung.ts` | freigabefähig nach Klärung von F-1 (hochfester Beton) |
| 2 | Querkraft | `stahlbeton_bemessung` (Reiter) | `src/calc/querkraft.ts` | freigabefähig |
| 3 | Stütze | `stahlbeton_bemessung` (Reiter) | `src/calc/stuetze.ts` | freigabefähig nach Klärung von S-2 (Spannungsblock bei x > h) |
| 4 | Durchstanzen | `stahlbeton_bemessung` (Reiter) | `src/calc/durchstanzen.ts` | freigabefähig nach Klärung von P-2 (Rand- und Eckstützen) |
| 5 | Mischungsberechnung | `mischungsberechnung` | `src/calc/mischung.ts` | freigabefähig nach Klärung von M-5 bis M-8 und F-Stellen |
| 6 | Betonkennwerte | `betonkennwerte` | `src/calc/betonkennwerte.ts`, `kriechenSchwinden.ts` | freigabefähig nach Klärung der F-Stellen (hochfester Beton) |
| 7 | Mauerwerk | `rechnung_mauerwerk` (Kern auch im Modul `mauerwerk`) | `src/calc/mauerwerk.ts` | freigabefähig nach Klärung von W-1 und F-Stellen |
| 8 | Holzbau-Bemessung | `holzbau_bemessung` | `src/calc/holzbau.ts` | freigabefähig nach Klärung von H-2 und H-3 |
| 9 | Wärme- und Feuchteschutz | `bauphysik`, `feuchteschutz` | `src/calc/waermeschutz.ts`, `glaser.ts` | freigabefähig nach Klärung der F-Stellen DIN 4108-3:2024-03 |
| 10 | Schallschutz | `schallschutz` | `src/calc/schall.ts` | freigabefähig nach Klärung der F-Stellen Trittschall |

**Behobene Fehler (dieser PR):** S-1 Stütze (Zuschlag auf der unsicheren Seite), Formel M_Ed,1 im Modul Stahlbeton, Normangabe und Konsistenzklassen in der Mischungsberechnung, Zugabewasserformel, Höchstzementgehalt XM (380 → 360 kg/m³), Überstandsangabe beim Querdruck, Geltungsbereich Durchstanzen, Hinweis φ_RH (B.3a/b), k = 2,0 der DIN EN 206 (nicht „Eurocode“), Lernziel GEG → GModG.

---

## 1. Biegebemessung (Reiter von `stahlbeton_bemessung`)

**Prüfumfang:** `src/calc/biegung.ts`; `content/biegebemessung/Biegebemessung.json`, `content/stahlbetonbemessung/Stahlbetonbemessung.json` (Formelteil Biegung), Grenzen `STAHLBETON`, Beispiel „Rechteckquerschnitt (Standardwerte)“, Lernziele und Kurzfassung `stahlbeton_bemessung`.

**Nachrechnungen** (Spannungsblock, Gleichgewicht direkt in x gelöst, nicht über die ω-Formel des Kerns):

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| B1 | 30/60, d₁ = 5 cm, C30/37, M_Ed = 250 kNm | µ = 0,162; A_s1 = 11,48 cm²; x = 12,23 cm; A_s,min = 2,11 cm² | identisch |
| B2 | 25/50, C25/30, M_Ed = 400 kNm (µ = 0,558 > µ_lim) | x = ξ_lim·d = 20,25 cm; σ_s2 = f_yd; A_s2 = 10,83 cm²; A_s1 = 24,02 cm² | identisch |
| B3 | C60/75, M_Ed = 600 kNm (λ = 0,775; η = 0,95; ξ_lim = 0,35) | A_s1 = 28,38 cm²; x = 16,43 cm | identisch |
| B4 | M_Ed = 0 (Randfall) | A_s1 = 0; maßgebend A_s,min = 2,11 cm² | identisch |

Das Beispiel im Modul (30/50, M_Ed = 200 kNm: µ = 0,194, ω = 0,217, A_s1 = 11,5 cm², A_s,min = 1,8 cm²) ist nachvollzogen und richtig.

**Befunde**
- behoben: keine im Reiter Biegung.
- offen: keine Rechenfehler. Fachtext, Kurzfassung (µ_Eds,lim = 0,296) und Robustheitsbewehrung nach NA DE sind richtig.

**F-Freigabe-Stellen**
- F-1: ξ_lim = 0,35 ab C55/67 (NA DE, NCI zu 5.4; im Kern als „5.4.1“ zitiert) und zusätzliche f_cd-Abminderung ab C55/67 (zentraler Schalter `FCD_HOCHFEST_AKTIV = false`, `src/data/kennwerte.ts`).

**Empfehlung:** freigabefähig nach Klärung von F-1 (für Normalbeton bis C50/60 uneingeschränkt freigabefähig).

- [ ] Modul freigeben (Teilfreigabe Reiter Biegung; Prüfvermerk `stahlbeton_bemessung` nach Tranche 2)

## 2. Querkraft (Reiter von `stahlbeton_bemessung`)

**Prüfumfang:** `src/calc/querkraft.ts`; `content/querkraftbemessung/Querkraftbemessung.json`, Formelteil in `Stahlbetonbemessung.json`, Grenzen, Rechenweg.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| Q1 | 30/60, d = 55 cm, C30/37, A_sl = 12,57 cm², V_Ed = 250 kN, θ = 21,8° | z = 48,5 cm (NA-Grenze d − c_v,l − 30 mm maßgebend); V_Rd,c = 75,1 kN; cot θ,max = 2,12 (6.7aDE); a_sw = 5,59 cm²/m; V_Rd,max = 715,8 kN | identisch |
| Q2 | 40/100, d = 95 cm (κ₁ = 0,0375 für v_min), V_Ed = 300 kN | V_Rd,c = 159,2 kN; V_Ed < V_Rd,cc → cot θ,max = 3,0; V_Rd,max = 2 180 kN | identisch |
| Q3 | wie Q1, V_Ed = 60 kN (Randfall V_Ed < V_Rd,c) | nur a_sw,min = 2,78 cm²/m | identisch |
| Q4 | h = 25 cm, d = 22 cm (flacher Balken) | z = 15,5 cm (Grenze d − 2·c_v,l); V_Rd,c = 49,7 kN | identisch |

**Befunde**
- behoben: keine.
- offen (Frage Q-1): Im Formelteil von `Stahlbetonbemessung.json` ist ρ_w,min = 0,16·f_ctm/f_yk mit „DIN EN 1992-1-1/NA Gl. (9.5N)“ zitiert. Nach meinem Kenntnisstand führt der NA die Gleichung als (9.5aDE). Bitte Gleichungsnummer am Normtext bestätigen; der Wert ist richtig.
- Hinweis (keine Änderung): Der Rechner rechnet mit dem eingegebenen V_Ed; ein Satz zur Bemessungsquerkraft im Abstand d vom Auflagerrand (6.2.1(8)) wäre didaktisch hilfreich.

**F-Freigabe-Stellen:** keine eigenen (nur der zentrale f_cd-Schalter, siehe F-1; für V_Rd,max wird bewusst ohne Hochfest-Abminderung gerechnet).

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben (Teilfreigabe Reiter Querkraft; Prüfvermerk `stahlbeton_bemessung` nach Tranche 2)

## 3. Stütze (Reiter von `stahlbeton_bemessung`)

**Prüfumfang:** `src/calc/stuetze.ts`; `content/stuetzenbemessung/Stuetzenbemessung.json`, Formelteil in `Stahlbetonbemessung.json`, Erkundungsaufträge `stuetzenbemessung`, Grenzen.

**Nachrechnungen** (eigene Dehnungsiteration, einmal mit Spannungsblock, einmal mit Parabel-Rechteck-Diagramm):

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| S1 | 40/40, d₁ = 5 cm, C30/37, l₀ = 4 m, N_Ed = 2 000 kN, M_Ed = 100 kNm | ν = −0,735; µ = 0,110 (e_i = 10 mm); λ = 34,6 > λ_lim = 25; ω_erf = 0,05 (Block), 0,07 (Parabel-Rechteck) | vorher 0,04, jetzt 0,05 |
| S2 | N_Ed = 3 000 kN, M_Ed = 0 (nur Mindestausmitte e₀ = 20 mm) | ν = −1,103; µ = 0,055; ω_erf = 0,24 (Block), 0,26 (Parabel-Rechteck); A_s,min = 10,35 cm² | 0,24 |
| S3 | l₀ = 8 m, N_Ed = 800 kN, M_Ed = 40 kNm | λ = 69,3 > λ_lim = 16/√0,294 = 29,5; ω_erf = 0 | identisch |
| Kurve ω = 0,4 | µ_Rd bei ν = −0,3 / −0,9 / −1,2 | Block 0,255 / 0,180 / 0,081; Parabel-Rechteck 0,254 / 0,174 / 0,073 | 0,255 / 0,180 / 0,080 |

**Befunde**
- **behoben – S-1:** Die Suche nach ω_erf akzeptierte ein ω, wenn µ_Ed ≤ µ_Rd **+ 0,002** war. Der Zuschlag liegt auf der unsicheren Seite; im Fall S1 ergab er eine Stufe zu wenig (ω = 0,04 statt 0,05). Er ist entfernt. Die lineare Interpolation zwischen den Kurvenpunkten liegt bei der konvexen Kurve ohnehin auf der sicheren Seite. Test angepasst (`tests/stuetze.test.ts`), Regression in `tests/modulpruefungTranche1.test.ts`, Erkundungsaufträge neu gerechnet (N_Ed = 2 000 kN: 22,5 → 22,9 cm², ω 0,64 → 0,65; M_Ed = 100 kNm: 13,7 → 14,1 cm², ω 0,39 → 0,40; Ausgangswert ω 0,02 → 0,03).
- **behoben – S-3:** Im Formelteil von `Stahlbetonbemessung.json` stand M_Ed,1 = max(M_Ed; N_Ed·e₀) + N_Ed·e_i. Das widerspricht dem Kern, dem Rechenweg („werden nicht addiert“) und EC2 6.1(4)/5.2(7). Korrigiert auf M_Ed,1 = max(M_0Ed + N_Ed·e_i; N_Ed·e₀).
- **offen – Frage S-2:** Die Interaktionskurven verwenden den Spannungsblock auch bei vollständig überdrückten Querschnitten (x > h, Blockhöhe auf h begrenzt). Gegenüber dem Parabel-Rechteck-Diagramm liegt µ_Rd im Bereich hoher Druckausnutzung damit auf der unsicheren Seite: bei ν = −0,9 um rund 3,5 %, bei ν = −1,2 um rund 9 %. Im Fall S2 ergibt sich ω_erf = 0,24 statt 0,26. Die gängigen Bemessungsdiagramme beruhen auf dem Parabel-Rechteck-Diagramm. Frage: Sollen die Kurven für ξ > 1 (oder insgesamt) auf das Parabel-Rechteck-Diagramm umgestellt werden? Bis dahin steht ein Hinweis in den Grenzen.

**F-Freigabe-Stellen:** keine eigenen (f_cd-Schalter siehe F-1).

**Empfehlung:** freigabefähig nach Klärung von S-2.

- [ ] Modul freigeben (Teilfreigabe Reiter Stütze; Prüfvermerk `stahlbeton_bemessung` nach Tranche 2)

## 4. Durchstanzen (Reiter von `stahlbeton_bemessung`)

**Prüfumfang:** `src/calc/durchstanzen.ts`; `content/durchstanzen/Durchstanzen.json`, Formelteil in `Stahlbetonbemessung.json`, Grenzen, Erkundungsaufträge.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| D1 | Innenstütze rund c = 400 mm, d = 220 mm, ρ_l = 1 %, C30/37, V_Ed = 800 kN, β = 1,10 | u₁ = π·(c + 4d) = 4 021 mm; v_Ed = 0,995; v_Rd,c = 0,728 N/mm²; A_sw je Reihe = 650 mm² (s_r = 0,75·d, f_ywd,ef = 305 N/mm²) | identisch |
| D2 | Rechteckstütze 250/250, d = 300 mm (u₀/d = 3,33 < 4 → C_Rd,c abgemindert), V_Ed = 1 500 kN | v_Rd,c = 0,632; v_Ed = 1,153 > 1,4·v_Rd,c → nicht nachweisbar | identisch |
| D3 | wie D1, V_Ed = 1 100 kN (Randfall v_Ed > v_Rd,max) | keine Bewehrung ermittelbar | identisch |

**Befunde**
- **behoben – P-1:** Fachtext und Kernkopf nannten „Flachdecken oder Fundamente“. Der Kern bildet nur Flachdecken ab; für Fundamente und Bodenplatten gelten nach NA DE, 6.4.4(2) abweichende Regeln (u. a. Beiwert C_Rd,c, iterativ ermittelter Rundschnitt, Abzug der Bodenpressung). Geltungsbereich in Text, Kernkopf und Grenzen ergänzt.
- **offen – Frage P-2:** Für Rand- und Eckstützen setzt der Rechner β = 1,40/1,50 mit dem **vollen** Rundschnitt u₁ an. Nach EC2 6.4.2 ist bei Rand- und Eckstützen der verkürzte Rundschnitt maßgebend. Mit vollem u₁ wird v_Ed je nach Lage um bis zu rund 40 % unterschätzt. Der Rechner warnt bereits. Frage: Rand- und Eckstützen sperren (nur Innenstütze) oder den Randabstand als Eingabe ergänzen?
- Hinweis: κ_sw,1 = 2,5 und κ_sw,2 = 1,4 (NA DE) sind nicht eingerechnet und als Vereinfachung genannt.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig nach Klärung von P-2.

- [ ] Modul freigeben (Teilfreigabe Reiter Durchstanzen; Prüfvermerk `stahlbeton_bemessung` nach Tranche 2)

## 5. Mischungsberechnung (`mischungsberechnung`)

**Prüfumfang:** `src/calc/mischung.ts`; `content/mischungsberechnung/*.json` (Mischungsberechnung, MischungEingaben, MischungErgebnisse, GrenzwerteSection, WalzKurvenSection, daten), Expositionstabelle, Grenzen, Lernziele, Kurzfassung.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| M1 | z = 320 (CEM I, ρ = 3,1), w = 176, Luft 1,5 %, ρ_g = 2,65, Fraktionen 35/20/45 % mit Feuchte 4/1/0,5 % und WA 0,5 % | V_g = 705,8 dm³; G = 1 870 kg; Zugabewasser = 151,2 kg; w/z = 0,55; Frischbetonrohdichte 2,366 kg/dm³ | identisch |
| M2 | z = 300, f = 120 (anrechenbar 0,33·z = 99), s = 20, CEM I | (w/z)_eq = 176/(300 + 0,4·99 + 1,0·20) = 0,489; f_max aus Alkalitätsreserve 3·(0,22 − s/z)·z = 138 kg | identisch |
| M3 | Sieblinie 16 mm, Fraktionen 36/24/40 % | 4 mm: 36 % = A16; 8 mm: 60 % = A16 → Bereich A–B | identisch |

Expositionstabelle (daten.json, 20 Klassen) abgeglichen: w/z, Mindestzementgehalt, Mindestfestigkeitsklasse und c_min,dur stimmen mit DIN 1045-2 bzw. NA DE überein (XF2/XF3 mit den Werten ohne LP).

**Befunde**
- **behoben – M-1:** Kopfzeile „Berechnet nach DIN EN 1992-1-1 + NA (DE)“. Für die Stoffraumrechnung ist das die falsche Norm; korrigiert auf DIN EN 206 / DIN 1045-2.
- **behoben – M-2:** Konsistenzbeschreibung C2/F3 und C3/F4: Die Paare „Weich“ bzw. „Sehr weich“ ließen die C-Bezeichnung aus (C2 = plastisch, C3 = weich) und widersprachen `daten.json`. Ergänzt zu „Plastisch / weich“ und „Weich / sehr weich“.
- **behoben – M-3:** Die Formel für das Zugabewasser zog die **Gesamtfeuchte** ab. Der Kern zieht richtig nur die Oberflächenfeuchte (Gesamtfeuchte − Wasseraufnahme) ab. Formel und Erklärung angepasst.
- **behoben – M-4:** Höchstzementgehalt XM1–XM3: 380 kg/m³ → **360 kg/m³** (DIN 1045-2, nicht bei hochfestem Beton; öffentlich: [Heidelberg Materials, Flyer „Beton bestellen nach Norm“](https://heidelbergmaterials.de/sites/default/files/2024-09/flyer_beton_bestellen_nach_norm.pdf), Fußnote 6). `src/data/mischungBeispiele.ts` nannte bereits 360. Warntext „empfohlener Maximalwert“ → „Höchstwert nach DIN 1045-2“. Außerdem „k = 2,0 ist Eurocode-Wert/EC-Empfehlung“ → Empfehlungswert der DIN EN 206 (Kurzfassung, Formeltext).
- **offen – Frage M-5:** Hinweis „bei D_max = 16 mm Mindestzementgehalt ~+20 kg/m³, bei 8 mm ~+40 kg/m³“. Öffentlich fand sich nur eine Regel mit +10 % / +20 % (umwelt-online, archivierte Fassung, Tabellenbezug unklar). Bitte Herkunft und Bezug (Mindestzementgehalt nach F.2 oder andere Tabelle) bestätigen oder Hinweis streichen.
- **offen – Frage M-6:** XF2/XF4: Der Text sagt „Silikastaub nicht anrechenbar – bei XF2/XF4 ist nur Flugasche anrechenbar“. Die Regel zur Anrechnung von Zusatzstoffen bei XF2/XF4 war öffentlich nicht eindeutig belegbar. Bitte am Normtext DIN 1045-2:2023-08 bestätigen (die Grenzen nennen XF2/XF4 bereits als „nicht abgebildet“).
- **offen – Frage M-7:** Die Frischbetonrohdichte rechnet mit Gesteinskörnung trocken + wirksamem Wasser. Das von der Gesteinskörnung aufgenommene Kernwasser (hier ≈ 9 kg/m³, 0,4 %) fehlt. Je nach Bezug der Kornrohdichte (ofentrocken oder wassergesättigt, oberflächentrocken) ist das richtig oder nicht. Welcher Bezug ist gewollt?
- **offen – M-8:** Walz-Kurven als Abrams-Näherung mit Lehrwerten A = 100/120/140 N/mm² (plausibel, w/z 0,5 / CEM 42,5: 53,7 N/mm² Würfel). Kein Normwert, als Lehrwert gekennzeichnet.

**F-Freigabe-Stellen**
- Regelsieblinien A/B/C 8, 16, 32 als Lehrbuchwerte (Abgleich mit DIN 1045-2, Anhang L, Bilder L.1–L.3). Die hinterlegten Werte stimmen mit den üblichen Lehrbuchwerten überein.
- Zuordnung der Zementarten ohne Hauptbestandteil-Kennbuchstaben zu f/z ≤ 0,33/0,25 und zur Kombinationsregel f + s (`maxFaFaktor`, `kombinationsGrenze`).
- k-Wert für Hüttensandmehl (nicht hinterlegt; Eingabe Lehrannahme).

**Empfehlung:** freigabefähig nach Klärung von M-5 bis M-7 und der F-Stellen.

- [ ] Modul freigeben

## 6. Betonkennwerte (`betonkennwerte`)

**Prüfumfang:** `src/calc/betonkennwerte.ts`, Bausteine aus `src/calc/kriechenSchwinden.ts`, `src/data/kennwerte.ts`; `content/betonkennwerte/*.json` (Rechner, Tabelle, Zeit/Theorie, Praxis, Ausblick 2025, Wissenstest), Grenzen, Lernziele.

**Nachrechnungen** (Anhang B vollständig selbst umgesetzt: φ_RH mit α₁/α₂, β(f_cm), β(t₀) mit B.9, β_H mit α₃, ε_cd,0 nach B.11/B.12, k_h, β_ds, ε_ca):

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| K1 | C30/37, CEM N, RH 50 %, A_c = 0,12 m², u = 1,4 m (h₀ = 171 mm), t₀ = 28 d, t = 50 a, σ_c = 8 N/mm² | E_cm = 32 837 N/mm²; φ = 2,40; ε_cs = 0,50 ‰; k (Gl. 3.14) = 1,96; f_cm(t) = 48,3 N/mm² | identisch |
| K2 | t = t₀ = 7 d, T = 10 °C, wirksames Alter an | f_cm(7 d) = 25,8 N/mm² (t_T = 4,3 d) | identisch |
| K3 | wie K2, Schalter aus (EC2 3.1.2(6)) | f_cm(7 d) = 29,6 N/mm² | identisch |
| K4 | wie K1, σ_c = 15 N/mm² > 0,45·f_ck (Randfall nichtlineares Kriechen) | φ_k = 2,59 (Gl. 3.7) | identisch |

**Befunde**
- **behoben – K-1:** Die Herleitungsformel für φ₀ im Rechner zeigt φ_RH nach Gl. (B.3a), die nur für f_cm ≤ 35 N/mm² gilt. Erklärung ergänzt: Ab C30/37 gilt (B.3b) mit α₁, α₂, die der Rechner verwendet.
- offen: keine Rechenfehler. Zementklassen-Zuordnung für s (S/N/R), α_E, f_ctm,fl, f_ct,sp, E_c0 = 1,05·E_cm und Ausblick EC2 2025 (E_cm = 9 500·f_cm^(1/3), η_cc) sind richtig.

**F-Freigabe-Stellen**
- Zusätzliche f_cd-Abminderung ab C55/67 (Schalter aus) und Dehnungswerte C100/115 (= C90/105 gehalten), `src/data/kennwerte.ts`.
- Festigkeitsentwicklung mit wirksamem Alter t_T (fib MC 2010) als Standard (Entscheidung 27.10., Schalter vorhanden; keine neue Frage).

**Empfehlung:** freigabefähig nach Klärung der F-Stellen (für Normalbeton ≤ C50/60 uneingeschränkt freigabefähig).

- [ ] Modul freigeben

## 7. Mauerwerk (`rechnung_mauerwerk`; Kern auch im Modul `mauerwerk`)

**Prüfumfang:** `src/calc/mauerwerk.ts`; `content/beispielrechnungen/RechnungMauerwerk.json`, `content/mauerwerk/Mauerwerk.json` (Rechnerteil, Beispiel, Formeln), Grenzen `rechnung_mauerwerk`, Lernziele.

**Nachrechnungen** (vereinfachtes Verfahren DIN EN 1996-3/NA, f_d = 0,85·f_k/1,5):

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| W1 | Zwischendecke, h = 2,50 m, t = a = 175 mm, l_f = 5,0 m, f_k = 7,1 | ρ₂ = 0,75; Φ₁ = 0,767; Φ₂ = 0,724 (maßgebend); n_Rd = 509,6 kN/m | identisch |
| W2 | h = 2,75 m, t = 240, a = 160 mm (a/t = 2/3 → ρ₂ = 1,0), l_f = 6,0 m, f_k = 5,0 | Φ₁ = min(0,600; 0,600); Φ₂ = 0,422; n_Rd = 287,1 kN/m | identisch |
| W3 | Innenwand, h = 3,20 m, t = 115 mm (erweiterte Bedingungen) | Φ₁ = 0,9; Φ₂ = 0,371; n_Rd = 220,0 kN/m; Hinweis Tab. NA.2 | identisch |
| W4 | Dachdecke, t = 300 mm, f_k = 3,8 | Φ₁ = 0,333 (maßgebend); n_Rd = 215,1 kN/m | identisch |

Das Beispiel im Modul `mauerwerk` (EN-Empfehlung K = 0,55, Φ = 1 − 2e/t, N_Rd ≈ 403 kN/m) ist richtig gerechnet und als Vergleich ohne Knickeinfluss gekennzeichnet.

**Befunde**
- behoben: keine.
- **offen – Frage W-1:** Innenwände erhalten Φ₁ = 0,9 unabhängig von a/t. Bei teilweise aufliegender Decke (a < t) wäre nach dem Ansatz für Endauflager 0,9·a/t naheliegend. Bitte bestätigen, ob Φ₁ = 0,9 für Zwischenauflager auch bei a < t gilt.
- Hinweis: Die Schubformel f_vk = f_vk0 + 0,4·σ_d im Modul `mauerwerk` ist die Grundform; die Begrenzungen nach NA DE sind nicht dargestellt (als Darstellung, nicht als Nachweis).

**F-Freigabe-Stellen**
- ρ₂ = 1,0 für 2/3 < a/t < 1.
- f_k-Werte KS P und KS L-P (Spaltenzuordnung Tafel 16) und Gleichheit der f_k-Tabellen der NA-Fassung 2019-12 mit 2012.
- Wandhöhen > 2,75 m bei Außenwänden (Tab. NA.2, nur Hinweis).

**Empfehlung:** freigabefähig nach Klärung von W-1 und der F-Stellen.

- [ ] Modul freigeben

## 8. Holzbau-Bemessung (`holzbau_bemessung`)

**Prüfumfang:** `src/calc/holzbau.ts` (Druckstab, Querdruck, k_mod), `src/modules/HolzbauBeta.tsx` (Verdrahtung), `content/holzbaubeta/HolzbauBemessung.json`, `HolzbauBeta.json` (Anwendungsbeispiel, Regelwerke, Literatur), Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| H1 | C24 120/160, l_ef = 3,0 m, NKL 1, mittel | λ = 86,6; λ_rel = 1,469; k_c = 0,393; F_c,Rd = 97,6 kN | identisch |
| H2 | GL24h 160/160, l = 4 m, NKL 2, lang (β_c = 0,1) | λ_rel = 1,378; k_c = 0,475; F_c,Rd = 157,2 kN | identisch |
| H3 | C24 100/100, l = 0,3 m (Randfall λ_rel ≤ 0,3) | k_c = 1,0; F_c,Rd = 113,1 kN | identisch |
| H4 | Querdruck Einzelauflager C24, l = 150 mm, Überstand beidseitig | l_ef = 210 mm; σ = 2,38 > k_c,90·f_c,90,d = 1,5·1,538 = 2,31 N/mm² | identisch |
| H5 | Trägerende BSH, l = 200 mm | l_ef = 230 mm; Grenze mit k_c,90 = 1,0: 1,15 N/mm² | identisch |

Das Anwendungsbeispiel (C24 120/160, N_Rd ≈ 97,6 kN, ohne Knicken rund 248 kN) ist richtig.

**Befunde**
- **behoben – H-1:** Schalterbeschriftung „Überstehende Holzfasern (> 150 mm)?“. Nach DIN EN 1995-1-1, 6.1.5(1) wird die Kontaktlänge je Seite um 30 mm verlängert, höchstens um den Überstand a. Maßgebend ist also ein Überstand ≥ 30 mm, nicht > 150 mm. Neu: „Überstand ≥ 30 mm je Seite?“.
- **offen – Frage H-2:** Im Rechenweg steht „(Grenzschlankheit nach EC5 = 120)“. EN 1995-1-1 nennt nach meinem Kenntnisstand keine Grenzschlankheit 120, der Kern warnt erst ab λ > 200. Quelle bestätigen (ggf. NA DE oder Lehrempfehlung) oder Text streichen bzw. an den Kern angleichen.
- **offen – Frage H-3:** Für den Fall „Trägerende“ setzt der Kern k_c,90 = 1,0 an. Nach 6.1.5 gilt für Einzelauflager mit l₁ ≥ 2h auch am Trägerende k_c,90 = 1,5 (Nadelvollholz) bzw. 1,75 (BSH, l ≤ 400 mm). Das liegt auf der sicheren Seite. Soll der erhöhte Wert angesetzt werden?
- Nebenbefund außerhalb dieses Moduls (für Tranche 2, `bp_holzprodukte`): `bemesseEinfeldbalken` weist nur die Kombination 1,35·g + 1,5·q mit k_mod(mittel) nach. Die ständige Kombination 1,35·g mit k_mod(ständig) wird maßgebend, wenn g > 3,33·q ist; sie fehlt.

**F-Freigabe-Stellen:** keine im Modul `holzbau_bemessung` (Verformungsgrenzen und Ersatzimperfektion betreffen andere Module).

**Empfehlung:** freigabefähig nach Klärung von H-2 und H-3.

- [ ] Modul freigeben

## 9. Wärme- und Feuchteschutz (`bauphysik`, `feuchteschutz`)

**Prüfumfang:** `src/calc/waermeschutz.ts`, `src/calc/glaser.ts`; `content/bauphysik/Bauphysik.json`, `content/feuchteschutz/Feuchteschutz.json` (Beispiele, Formeln, Regelwerke), Grenzen beider Module, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| U1 | Innenputz 1,5 cm, KS 17,5 cm, Mineralwolle 14 cm, Außenputz 1 cm; Wand (R_si = 0,13, R_se = 0,04) | U = 0,228 W/(m²K); θ_si = 19,26 °C; θ an Grenze KS/Dämmung = 18,13 °C (20/−5 °C) | identisch |
| U2 | Dach (R_si = 0,10): Beton 20 cm + Dämmung 16 cm | U = 0,237 W/(m²K) | identisch |
| U3 | Magnus-Formel | p_sat(20 °C) = 2 337 Pa; p_sat(−5 °C) = 401 Pa (über Eis); Taupunkt 20 °C/50 % = 9,27 °C | identisch |
| G1 | Glaser: KS 17,5 cm (µ 25) + Dämmung 14 cm (µ 1) + Außenschicht s_d = 100 m; Normklima | Tauwasserebene bei s_d = 4,515 m; M_c = 0,260 kg/m²; M_ev = 0,180 kg/m² → M_c > M_ev | identisch |
| G3 | Ziegel 24 cm + Dämmung 10 cm (µ 20) | kein Tauwasser | identisch |

Die Beispiele (U = 0,229, f_Rsi = 0,94; Nachhallzeit 2,78 s → 0,48 s, T_soll = 0,56 s; Taupunkt 9,3 °C, Schimmelgrenze 12,6 °C bzw. 13,2/16,7 °C bei 65 %) sind nachgerechnet und richtig.

**Befunde**
- **behoben – B-1:** Lernziel `bauphysik` sprach noch vom „GEG-Höchstwert“. Das Modul verweist seit der Umstellung auf das Gebäudemodernisierungsgesetz (öffentlich z. B. [BauNetz Wissen: GModG](https://www.baunetzwissen.de/daemmstoffe/fachwissen/richtlinien-verordnungen/gebaeudemodernisierungsgesetz-gmodg-10411131)). Angeglichen: „Höchstwert nach Anlage 7 des GModG (vormals GEG)“.
- **offen – Frage B-2:** Höchstwerte der Anlage 7 (Außenwand 0,24, Steildach 0,24, Flachdach 0,20, Kellerdecke 0,30 W/(m²K)) sind die bisherigen GEG-Werte. Bitte bestätigen, dass Anlage 7 des GModG sie unverändert übernimmt.
- Hinweis: Sommerlicher Wärmeschutz (Phasenverschiebung ≥ 10 h / 6 h) und Raumakustik sind Lehrbewertungen; die Grenzwerte sind als solche zu verstehen (kein Normwert).

**F-Freigabe-Stellen**
- Tauperiode und Verdunstungsperiode in der Ausgabe DIN 4108-3:2024-03 unverändert (Anhang A, Tab. A.3); neue Außendampfdrücke für verschattete oder helle Dächer; Begrenzung auf Höhenlagen bis 700 m.
- δ₀ = 2,0·10⁻¹⁰ kg/(m·s·Pa) in DIN 4108-3:2024-03 (A.2.5).

**Empfehlung:** freigabefähig nach Klärung der F-Stellen und von B-2.

- [ ] Modul freigeben (`bauphysik`)
- [ ] Modul freigeben (`feuchteschutz`)

## 10. Schallschutz (`schallschutz`)

**Prüfumfang:** `src/calc/schall.ts`; `content/schallschutz/Schallschutz.json`, `TrittschallTab.json` (Beispiele, Formeln, Anforderungen, Lernziele des Reiters), Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| R1 | KS 24 cm, ρ = 1 800 kg/m³ (m′ = 432 kg/m²) | R_w = 30,9·lg 432 − 22,2 = 59,2 dB | identisch |
| R2 | 17,5 cm, ρ = 2 000, Putz 20 kg/m², K_F = 2 dB | R′_w = 55,2 dB | identisch |
| R3 | Rohdecke 20 cm (480 kg/m²), Estrich 5 cm (100 kg/m²), s′ = 20 MN/m³, m′_f,m = 300 kg/m² | L_n,eq,0,w = 70,2; ΔL_w = 28,3; K = 1,7; L′_n,w = 43,6 dB; f₀ = 71,2 Hz (Kern mit Faktor 160: 71,6 Hz) | identisch (f₀ 0,5 %) |
| R4 | m′ = 50 kg/m² (Randfall außerhalb 65–720) | R_w = 30,3 dB mit Warnung | identisch |

Die Beispiele (KS 17,5 cm: m′ = 380 kg/m², R_w = 57,5 dB; HLz 24 cm: 243 kg/m², 51,5 dB; m′ = 366 kg/m² für 57 dB; +9,3 dB je Masseverdopplung) sind richtig. Anforderungen DIN 4109-1:2018-01 (R′_w ≥ 53 dB Trennwand, ≥ 54 dB Trenndecke, L′_n,w ≤ 50 dB) stimmen.

**Befunde**
- behoben: keine.
- Hinweis: Die „ältere Näherung“ R_w ≈ 37,5·lg m′ − 42 ist als informativer Anhang der DIN EN 12354-1 zitiert; Zuordnung im Modul bereits als „manuell prüfen“ gekennzeichnet.

**F-Freigabe-Stellen**
- ΔL_w = 13·lg m′ − 14,2·lg s′ + 20,8 dB (DIN 4109-34).
- K = 0,6 + 5,5·lg(m′_s/m′_f,m) mit Untergrenze 0 dB und Rundung (DIN 4109-2).
- Treppenwerte 53 dB (Mehrfamilienhaus) und 46 dB (Reihen-/Doppelhaus) nach DIN 4109-1:2018-01.

**Empfehlung:** freigabefähig nach Klärung der F-Stellen Trittschall (Luftschall-Teil uneingeschränkt freigabefähig).

- [ ] Modul freigeben

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage |
|---|---|---|
| Q-1 | Querkraft | Gleichungsnummer ρ_w,min: (9.5N) oder (9.5aDE)? |
| S-2 | Stütze | Interaktionskurven für x > h (oder insgesamt) auf Parabel-Rechteck umstellen? (bis zu ~9 % auf der unsicheren Seite) |
| P-2 | Durchstanzen | Rand-/Eckstützen sperren oder Randabstand als Eingabe ergänzen (voller u₁ unterschätzt v_Ed)? |
| M-5 | Mischung | Herkunft „+20/+40 kg/m³ Zement bei D_max 16/8 mm“ bestätigen oder streichen? |
| M-6 | Mischung | Anrechnung von Zusatzstoffen bei XF2/XF4 nach DIN 1045-2:2023-08 bestätigen. |
| M-7 | Mischung | Frischbetonrohdichte mit oder ohne Kernwasser der Gesteinskörnung (Bezug der Kornrohdichte)? |
| W-1 | Mauerwerk | Φ₁ = 0,9 für Innenwände auch bei a < t? |
| H-2 | Holzbau | „Grenzschlankheit nach EC5 = 120“ belegen oder streichen? |
| H-3 | Holzbau | k_c,90 = 1,5/1,75 auch am Trägerende ansetzen (statt 1,0)? |
| B-2 | Bauphysik | Höchstwerte Anlage 7 GModG unverändert gegenüber GEG? |

## Nachweis der Prüfung

- Unabhängige Nachrechnung: eigenes Skript (Python) mit eigener Umsetzung der Normgleichungen, Vergleich gegen die Kernausgaben (159 Vergleiche). Die Sollwerte sind als `tests/modulpruefungTranche1.test.ts` übernommen (ohne Rückgriff auf vorhandene Testwerte).
- Öffentliche Quellen dieser Prüfung: [Heidelberg Materials, Flyer „Beton bestellen nach Norm“](https://heidelbergmaterials.de/sites/default/files/2024-09/flyer_beton_bestellen_nach_norm.pdf) (XM-Höchstzementgehalt), [umwelt-online, DIN 1045-2 (archiviert)](https://umwelt-online.de/recht/bau/din/1045_2g.htm) (Zuschläge Größtkorn, Bezug unklar), [BauNetz Wissen: GModG](https://www.baunetzwissen.de/daemmstoffe/fachwissen/richtlinien-verordnungen/gebaeudemodernisierungsgesetz-gmodg-10411131).

## Freigabe 28.10.2026

Freigegeben wurden Module mit Empfehlung „freigabefähig“ ohne offene Fragen. In dieser Tranche trifft das auf kein ganzes Modul zu. Der Reiter Querkraft (Nr. 2) ist freigabefähig, zählt aber erst mit dem ganzen Modul `stahlbeton_bemessung` (offen: F-1, S-2, P-2, Tranche 2 T2-S-1/-2); der Prüfvermerk bleibt „offen“.

## Nachtrag 28.10.2026 (abends): Entscheidungen S-2, P-2, Q-1 umgesetzt

- **S-2 (Stütze):** Interaktionskurven jetzt mit dem Parabel-Rechteck-Diagramm (n = 2, ε_c2 = 2 ‰, ε_cu2 = 3,5 ‰, analytisch integriert); der Spannungsblock wird nur noch zum Vergleich angezeigt. Nachrechnung mit eigenem Skript (Streifenintegration, Gleichgewicht per Bisektion): S1 ω_exakt = 0,0665 → ω_erf = 0,07 (vorher 0,05), S2 ω_exakt = 0,254 → 0,26 (vorher 0,24). Regressionstest angepasst.
- **P-2 (Durchstanzen):** Stützenlage innen/Rand/Ecke als Eingabe, u₁ nach EC2 Bild 6.15 (Schnitt endet senkrecht am freien Rand, Randabstand einstellbar, maßgebend der kürzere Rundschnitt nach 6.4.2(4)), β konstant nach NA DE 6.4.3(6) (1,10/1,40/1,50). Fünf Handrechnungsfälle in `tests/durchstanzen.test.ts`.
- **Q-1 (Querkraft):** Gleichungsnummer auf (9.5aDE) korrigiert (vorläufig, Nummer nicht öffentlich belegt; Wert unverändert).

## Umsetzung 29.10.2026

- **#239-H-3 (Holzbau, Querdruck):** BSH-Einzelauflager mit Auflagerlänge l > 400 mm: k_c,90 = 1,0 (die Erhöhung auf 1,75 gilt nach DIN EN 1995-1-1, 6.1.5(4) nur für l ≤ 400 mm); vorher wurde 1,75 mit Warnung angesetzt. Kern `bemesseQuerdruck` in `src/calc/holzbau.ts`, Test `tests/kleinfragenTranche1bis3.test.ts`: l = 450 mm → F_c,90,Rd = 110,77 kN; l = 400 mm → 172,31 kN (b = 160 mm, GL, NKL 1, mittel).
