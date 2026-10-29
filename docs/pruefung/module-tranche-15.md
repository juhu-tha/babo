# Modulprüfung Tranche 15 – Beispielrechnungen, Praxiswissen, Regelwerke (Befundliste zur Freigabe)

**Stand:** 29.10.2026 (Branch `pruefung/module-tranche15-10-29`, Basis origin/main fa954bfc)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke geändert. Geändert wurden drei Quizfragen (`qn_rechnung_bestand_4`, `qn_rechnung_bestand_6`, `qn_px_bauleitung_2`), weil sie durch die Korrekturen T15-BS-2 bzw. T15-PB-1 falsch geworden wären.

## Vorgehen

- **Auswahl (13 Module, IDs aus `src/registry/modules.ts`):** `rechnung_beton`, `rechnung_stahlbeton`, `rechnung_holzbau`, `rechnung_nachhaltigkeit`, `rechnung_bestand` (Komponente `src/modules/Beispielrechnungen.tsx` mit `src/modules/beispielrechnungen/*.tsx`, Texte `content/beispielrechnungen/*.json`), `px_planung`, `px_bauleitung`, `px_produktion`, `px_karriere` (`src/modules/Praxiswissen.tsx`, `content/praxiswissen/Praxiswissen.json`), `px_bautagebuch` (`src/modules/Bautagebuch.tsx`, `content/bautagebuch/Bautagebuch.json`), `regularien`, `normen_ausblick`, `labor_sicherheit`.
- **Besonderheit Beispielrechnungen:** Die fünf `rechnung_*`-Module rechneten inline in `Beispielrechnungen.tsx`, nicht über die geprüften Kerne. Jede Rechnung wurde mit einem eigenen Python-Skript nachgerechnet (eigene Umsetzung der Gleichungen) und gegen die inzwischen geänderten Kerne abgeglichen. Wo das risikoarm war, rechnet das Modul jetzt über den Kern (Abschnitt „Umstellung auf Rechenkerne“, Ergebnis vorher/nachher je Fall).
- **Prüfumfang je Modul:** Rechnung bzw. Fakten-Stichprobe (mindestens fünf Aussagen), Fachtext und Normstand (Ausgaben Oktober 2026, NA DE), Grenzen (`src/data/rechnerGrenzen.ts`), Beispiele mit Rechenweg, Quellen, Stellen „vorläufig, F-Freigabe“.
- **Ergebnis der Nachrechnung:** 75 Prüfungen in `tests/modulpruefungTranche15.test.ts` (Toleranz 0,5 %), alle mit den Sollwerten des Skripts; Abweichungen der alten Inline-Rechnung siehe T15-BE-1.
- **Einschränkung:** Das WebSearch-Kontingent ist knapp; gesucht wurde gezielt zu Punkten mit Korrekturbedarf. Aussagen ohne gefundene öffentliche Quelle sind als „Kenntnisstand“ markiert bzw. als Frage oder F-Stelle geführt. Normtexte wurden nicht abgeschrieben.

## Übersicht

| Nr. | Modul | Rechnung | Empfehlung |
|---|---|---|---|
| 1 | `rechnung_beton` | jetzt Kerne `mischung.ts`, `betonkennwerte.ts`, `kennwerte.ts` | freigabefähig (T15-BE-2 und T15-BE-6 am 29.10.2026 entschieden und umgesetzt) |
| 2 | `rechnung_stahlbeton` | jetzt Kern `biegung.ts` | freigabefähig nach Korrektur T15-SB-1/-2 |
| 3 | `rechnung_holzbau` | jetzt Kern `holzbau.ts` | freigabefähig |
| 4 | `rechnung_nachhaltigkeit` | inline (Lehrmodell), Zement-GWP aus `src/data/zementGwp.ts` | freigabefähig (T15-NH-3 am 29.10.2026 entschieden und umgesetzt) |
| 5 | `rechnung_bestand` | `ALTBETON_ZUORDNUNG` (`kennwerte.ts`), `insituDruckfestigkeit13791` (`bauwerksuntersuchung.ts`) | freigabefähig (T15-BS-3 bis -6 am 29.10.2026 entschieden und umgesetzt; Mindeststandardabweichung DIN EN 13791 bleibt Normtextpunkt) |
| 6 | `px_planung` | Rechenbeispiele | freigabefähig nach Korrektur T15-PP-1 |
| 7 | `px_bauleitung` | Rechenbeispiele, Kern `verankerung.ts` (Abgleich) | freigabefähig nach Korrektur T15-PB-1 (α₆ bleibt F-Stelle wie T2-S-1) |
| 8 | `px_bautagebuch` | gering (Bewertungsscore) | freigabefähig nach Korrektur T15-BT-1/-2 |
| 9 | `px_produktion` | Rechenbeispiele | freigabefähig nach Korrektur T15-PR-1/-2; RC-Höchstanteile bleiben Normtextpunkt wie T9-GL-1a |
| 10 | `px_karriere` | Rechenbeispiele | freigabefähig nach Klärung von T15-PK-1 (Normtext) |
| 11 | `regularien` | – | freigabefähig nach Korrektur T15-RG-1 |
| 12 | `normen_ausblick` | – | freigabefähig |
| 13 | `labor_sicherheit` | – | freigabefähig (T15-LS-4 am 29.10.2026 entschieden und umgesetzt) |

**Behobene Fehler (dieser PR):**
- **T15-BE-1 (gewichtig):** Festigkeitsentwicklung rechnete f_ck(t) = β_cc·f_ck; nach DIN EN 1992-1-1, 3.1.2(5) gilt f_ck(t) = f_cm(t) − 8 für t < 28 d (Kern `fckZumAlter`). Beispiel C25/30, Klasse N, 7 d, 12 °C: 15,11 statt 17,52 N/mm² (zu günstig um 2,4 N/mm²).
- **T15-PB-1:** Übergreifungslänge im Bauleitungsbeispiel mit α₆ = 1,5 (EC2-Empfehlung) statt 1,4 nach NA DE, Tab. 8.3DE (Ø < 16 mm, Stoßanteil > 33 %, Entscheidung T2-S-1): l₀ = 677 statt 725 mm; Tipp „68 bis 72 cm“ → „≈ 68 cm“; Quiz `qn_px_bauleitung_2`.
- **T15-NH-1:** Richtwerte des Karbonatisierungsbeiwerts vertauscht („innen/trocken 1–3, außen bewittert 4–8 mm/√a“); beregneter Beton karbonatisiert am langsamsten.
- **T15-BS-1/-2:** „DIN 1045:1972“ für die Klassen B 100 … B 600 (vor 1972, Serienfestigkeit); „BSt 220/340 RU … unberuhigt“ (richtig GU = glatt, unbehandelt; RU = gerippt, unbehandelt/naturhart), „η₁ = 0,3/0,7“ als Verbundabminderung (η₁ ist in EC2 der Beiwert der Verbundbedingung); „DAfStb-Richtlinie Bauen im Bestand“ und „vorgeschriebener Abschlag 3 N/mm²“ ohne Beleg → Lehransatz, vorläufig. Quiz `qn_rechnung_bestand_4`, `_6`.
- **T15-BT-1:** Bautagebuch versprach „Tagesbericht gerichtsicher zertifiziert“ und „in der Datenbank verschlüsselt“; gespeichert wird unverschlüsselt im `localStorage` des Browsers.
- **T15-LS-1 bis -3:** „Quarzfeinstaub krebserzeugend (Kat. 1A)“ → Tätigkeit nach TRGS 906, Beurteilungsmaßstab 0,05 mg/m³ (TRGS 559); „DGUV Regel 109-009 (… Krane)“ → DGUV Vorschrift 52/68, DGUV Grundsatz 308-001; „Landesunfallkasse / Bayerische Unfallkasse“ → Bayerische Landesunfallkasse.
- **Weitere:** T15-BE-3 bis -5 (Texte, Formatierung „0.33“, stille Begrenzung auf −5 °C), T15-SB-1/-2 (Text Spannungsblock, Stabwahl), T15-NH-2, T15-PP-1, T15-PR-1/-2, T15-BT-2, T15-RG-1.

---

## Umstellung auf Rechenkerne (Ergebnis vorher/nachher)

| Reiter | vorher (inline) | jetzt (Kern) | Ergebnis |
|---|---|---|---|
| Beton – Mischungsentwurf | V = z/3,10 + w + 15 dm³, m_g = V_g·2,65 | `stoffraum()` (`src/calc/mischung.ts`) mit 1,5 % Luft, eine Fraktion ohne Feuchte | unverändert (XC4/F3/32: V_g 715,91 dm³, m_g 1897,2 kg, ρ 2363,8 kg/m³) |
| Beton – k-Wert-Ansatz | k = 0,4/1,0, Grenzen 0,33/0,11 fest | `K_WERT_DIN1045_2`, `maxFaFaktor('CEM I')` | unverändert ((w/z)_eq 0,463 FA, 0,450 SF) |
| Beton – Festigkeit | t_T = t·exp(4000·(1/293 − 1/(273 + T))), f_ck(t) = β_cc·f_ck | `temperaturFaktor` (Gl. B.10, 13,65), `betaCc`, `ZEMENT_S`, `fckZumAlter` | t_T 4,772 → 4,763 d; β_cc 0,7008 → 0,7004; **f_ck(t) 17,52 → 15,11 N/mm²** (T15-BE-1) |
| Stahlbeton – Biegung | ω = 1 − √(1 − 2µ), A_s = M/(f_yd·z), µ_lim = MU_LIM_STAHL | `bemesseBiegung()` (`src/calc/biegung.ts`) | unverändert (A_s 9,00 cm²); neu angezeigt: A_s,min 1,59 cm² |
| Holzbau – Knicken | k_c nach (6.25)–(6.29) inline | `bemesseDruckstab()` (`src/calc/holzbau.ts`), NKL 1, KLED kurz, Euler-Fall 2 | unverändert (η 0,450) |

Nicht umgestellt: Frischbetontemperatur (kein Kern; reine Energiebilanz, nachgerechnet), Nachhaltigkeit (Lehrmodell; `lca.ts` bilanziert Bauteile, nicht den Karbonatisierungs-Uptake), Bestand (Lehransatz; ein Kern ist erst nach Klärung von T15-BS-3/-5 sinnvoll).

**Abgleich mit den seit Tranche 1–3 geänderten Kernen:**

| Thema (Entscheidung) | Betroffen in Tranche 15? | Ergebnis |
|---|---|---|
| Stütze Parabel-Rechteck (S-2) | nein (keine Stütze in den Beispielrechnungen) | – |
| Durchstanzen u₁/β (P-2) | nein | – |
| Verankerung/Übergreifung NA DE (T2-S-1/-2) | `px_bauleitung` Beispiel 2 | α₆ 1,5 → 1,4 angeglichen (T15-PB-1); f_bd mit α_ct = 1,0 wie Kern (2,7 N/mm²) |
| Holz d_ef / Abbrand | nicht in dieser Tranche (`rechnung_brandschutz`, T3) | Stichprobe: d_ef = β_n·t + 7 mm wie `D0_ABBRAND` im Kern |
| c·ρ = 2400 (HY-2) | nein (Frischbetontemperatur rechnet mit Massen und c der Ausgangsstoffe) | – |
| CO₂-Faktoren GModG Anlage 9 | nein (Nachhaltigkeit rechnet Zement-GWP, keine Energieträger) | Zement-GWP siehe T15-NH-3 |
| Schwindwerte | nein | – |
| f_cd zentral (`FCD_MODUL`) | Stahlbeton, Bestand | unverändert (tests/fcdModule.test.ts) |
| f_ck(t) nach Alter (Runde 5) | Beton – Festigkeit | angeglichen (T15-BE-1) |

---

## 1. Beton: Mischungsentwurf (`rechnung_beton`)

**Prüfumfang:** Reiter Mischungsentwurf, k-Wert-Ansatz, Frischbetontemperatur, Festigkeitsentwicklung; `content/beispielrechnungen/RechnungBeton.json`; Grenzen; drei Erkundungsaufträge.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| BE1 | XC4, F3, 32 mm | z = 175/0,60 = 291,7 kg; V_g = 715,91 dm³; m_g = 1897,2 kg; ρ = 2363,8 kg/m³ | identisch |
| BE2 | XD3, F3, 32 mm | z = 388,9 kg; m_g = 1814,1 kg; ρ = 2378,0 kg/m³ | identisch |
| BE3 | XC4, F2, 32 mm | 165/0,60 = 275 < z_min 280 → w/z = 0,589 | identisch |
| BE4 | 300 kg Z, 60 kg FA, 150 l W | (w/z)_eq = 150/(300 + 0,4·60) = 0,463; SF: s ≤ 33 → 0,450 | identisch |
| BE5 | 20/12/4 °C, ohne Eis; T_W 50 °C; T_G 14 °C; 20 kg Eis | 7,91 / 18,34 / 14,09 / 4,85 °C | identisch |
| BE6 | C25/30, N, 7 d, 12 °C | t_T = 4,763 d; β_cc = 0,7004; f_cm(t) = 23,11; **f_ck(t) = 15,11 N/mm²** | **vorher 17,52** |
| BE7 | C30/37, R, 3 d, 20 °C | f_ck(t) = 17,18 N/mm² | vorher 19,89 |

**Normstand:** DIN 1045-2:2023-08 mit DIN EN 206:2021-06 (bauaufsichtlich eingeführt; DIN EN 206-1/-2:2026-07 erschienen, noch nicht eingeführt – [DIN Media, DIN EN 206-1:2026-07](https://www.dinmedia.de/de/norm/din-en-206-1/399836281)). XC4: w/z ≤ 0,60, z_min 280 kg/m³; XD3: 0,45/320 kg/m³; k_f = 0,4 (f/z ≤ 0,33), k_s = 1,0 (s/z ≤ 0,11) – wie Kern `mischung.ts` (Tranche 1 geprüft). s-Werte 0,38/0,25/0,20 nach EC2 3.1.2(6) – richtig.

**Befunde**
- **behoben – T15-BE-1:** f_ck(t) siehe oben. Formelanzeige t_T auf die Form von Gl. (B.10) umgestellt; Text nennt, dass EC2 t_T für Kriechen/Schwinden angibt und der Reifeansatz für die Festigkeit dem fib Model Code 2010 folgt (wie Schalter im Modul Betonkennwerte, Entscheidung 27.10.).
- **offen – Frage T15-BE-2 (Ausschalkriterium):** „Ausschaleignung (CEN-Richtwert)“ und „nach DBV-Leitfaden im Regelfall zulässig (> 50 % Festigkeit)“ – keine Quelle gefunden; verglichen wurde β_cc (f_cm(t)/f_cm), der Text sprach von „charakteristischer Nennfestigkeit“. Jetzt „Ausschalhinweis (Lehrannahme, vorläufig)“, Bezug f_cm(t)/f_cm, maßgebend Tragwerksplanung und Festigkeitsnachweis nach DIN EN 13670/DIN 1045-3.
- **Umsetzung 29.10.2026 – T15-BE-2:** Neue Eingabe „Vorgabe der Tragwerksplanung (% von f_ck)“ (20–100 %, Voreinstellung 50 % als Lehrannahme gekennzeichnet, vorläufig, F-Freigabe). Verglichen wird jetzt die charakteristische Festigkeit f_ck(t) (Kern `fckZumAlter`) mit p·f_ck – Kern `ausschalVergleich()` in `src/calc/betonkennwerte.ts`, nicht mehr β_cc. Beispiel C25/30, N, 7 d, 12 °C: f_ck(t) = 15,11 N/mm² ≥ 0,50·25 = 12,50 N/mm² (60,4 %); C30/37, R, 3 d, 20 °C: 17,18 < 18,00 N/mm² bei 60 %. Quelle: Entscheidung; Norm DIN EN 13670/DIN 1045-3 (Ausschalen nach ausreichender Festigkeit, Vorgabe der Tragwerksplanung). Grenzen ergänzt; Quiz `qn_rechnung_beton_6` angepasst.
- **behoben – T15-BE-3:** Bewertungstext „Frischbetondichte 2000 bis 2600 kg/m³ nach DIN EN 206“ – DIN EN 206 grenzt Normalbeton über die Trockenrohdichte ab; „stellt sicher, dass … dauerhaft zu widerstehen“ → Grenzwerte als Voraussetzung, Eignung über Erstprüfung.
- **behoben – T15-BE-4:** k-Wert-Text „Erhöhung des Zementvolumens um k·f“ → Anrechnung auf den Zementgehalt (DIN 1045-2); „fiktive Einsparung … Portlandzement-Klinker bei identischer hydratationschemischer Wirksamkeit“ → „bei gleichem äquivalentem w/z-Wert (rechnerische Anrechnung, keine chemische Gleichwertigkeit)“; Formel zeigte „0.33“/„0.4“ mit Dezimalpunkt.
- **behoben – T15-BE-5:** Frischbetontemperatur wurde still auf −5 °C begrenzt; jetzt ungekürzt mit Hinweis „unter 0 °C gilt die Bilanz ohne Phasenwechsel nicht“. Englischer Text „Melting latent“ → „Schmelzwärme“; „setze Schuppeneis ein“ → „setzen Sie“; Bewertung „+5 bis +30 °C (DIN EN 206/DIN 1045-2; unter −3 °C Lufttemperatur mindestens +10 °C nach DIN 1045-3)“. Option „F3 (regelKonsistenz / weich)“ korrigiert.
- **offen – Frage T15-BE-6 (Wasseranspruch):** Die Tabelle (32 mm: 165/175/185 l/m³; 16 mm: 180/190/200 l/m³ für F2/F3/F4) ist als „Erfahrungswerte nach DBV“ bezeichnet; eine öffentliche Fundstelle wurde nicht gefunden. Die Größenordnung ist plausibel.
- **Umsetzung 29.10.2026 – T15-BE-6:** Text „Erfahrungswerte nach DBV“ ersetzt durch „Lehrwerte der Größenordnung (keine Normwerte; im Einzelfall über die Erstprüfung festlegen)“; Kommentar im Code und Rechnergrenzen entsprechend. Werte unverändert (165/175/185 bzw. 180/190/200 l/m³), Quizfrage `qn_rechnung_beton_1` bleibt richtig.

**Grenzen:** ergänzt um t_T nach Gl. (B.10), f_ck(t) bis 28 d und „Frischbetontemperatur ohne Phasenwechsel“.

**F-Freigabe-Stellen:** Ausschalhinweis (Lehrannahme 50 %).

**Empfehlung:** freigabefähig (T15-BE-2 und T15-BE-6 am 29.10.2026 umgesetzt; keine offene Frage).

- [ ] Modul freigeben

## 2. Massivbau: Biegung (`rechnung_stahlbeton`)

**Prüfumfang:** µ-Verfahren, Texte, Konstruktionsvorschlag, Grenzen, drei Erkundungsaufträge.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul (Kern) |
|---|---|---|---|
| SB1 | 160 kNm, C25/30, 30/50, d₁ 4,5 | f_cd 14,17; µ 0,1818; ω 0,2023; ζ 0,8988; A_s 9,00 cm²; A_s,min 1,59 cm² (f_ctm 2,6) | identisch |
| SB2 | 240 kNm | A_s 14,49 cm² | identisch |
| SB3 | C30/37 | A_s 8,82 cm² | identisch |
| SB4/5 | h 60 cm / b 40 cm | 7,09 / 8,73 cm² | identisch |
| SB6 | 300 kNm | µ 0,341 > µ_lim 0,295 | identisch (Sperre) |

**Befunde**
- **behoben – T15-SB-1:** Text: ω und ζ ergäben sich „vereinfacht aus einem rechteckigen Spannungsblock über die gesamte Druckzonenhöhe (Näherung)“. Die Formeln gelten exakt für den Spannungsblock nach 3.1.7(3) (λ = 0,8, η = 1,0); λ geht nur in x = ω·d/λ ein. Rechnung jetzt über `bemesseBiegung()` (Werte unverändert); Mindestbewehrung (Robustheit, NA DE 9.2.1.1) wird angezeigt und bei der Stabwahl berücksichtigt.
- **behoben – T15-SB-2:** Der Konstruktionsvorschlag bot fest 3 Ø 16, 2 Ø 20 und 4 Ø 12 an – beim Vorgabewert 9,00 cm² alle „unzureichend“. Jetzt n = ⌈A_s/A_s,1⌉ für Ø 16/20/25 (5 Ø 16, 3 Ø 20, 2 Ø 25) mit Hinweis, was nicht geprüft wird (Stababstände, Einbaubreite, Rissbreite).
- Hinweis T15-SB-3: µ_lim wird im Modul mit 0,295 (Spannungsblock) angezeigt; Quiz `qn_rechnung_stahlbeton_4` und Literatur nennen 0,296 (Parabel-Rechteck). Erkundungsauftrag auf 0,295 angeglichen; Quizfrage unverändert (Ergebnis nicht betroffen).

**Empfehlung:** freigabefähig nach Korrektur T15-SB-1/-2.

- [ ] Modul freigeben

## 3. Holzbau: Stützenknicken (`rechnung_holzbau`)

**Nachrechnungen:** HO1 (L 3,0 m, 14/14, 65 kN, C24): λ 74,23, λ_rel 1,259, k 1,388, k_c 0,507, f_c,0,d 14,54 N/mm², η 0,450; HO2 (6,0 m): k_c 0,146, η 1,564; HO3 (12/12): η 0,789; HO4 (C30): η 0,411 – Modul und Kern identisch. Erkundungsaufträge stimmen.

**Normstand:** DIN EN 1995-1-1/NA: k_mod 0,9 (NKL 1/2, KLED kurz), γ_M 1,3, β_c 0,2, Kennwerte DIN EN 338:2016 (C24: 21/7400; C30: 24/8000) – richtig.

**Befunde:** Rechnung auf `bemesseDruckstab()` umgestellt (T15-HO-1, Werte unverändert). Keine Fehler.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 4. Nachhaltigkeit & Dauerhaftigkeit (`rechnung_nachhaltigkeit`)

**Nachrechnungen:** NH1 (k 4, 50 a, 300 kg, 65 % CaO, 60 %): d_k 28,28 mm, 2,597 kg CO₂/m² (vorher mit 44,0/56,1: 2,596); NH2 (100 a): 3,673 kg/m²; NH3 (450 m³, 340·850 vs. 350·290): ΔGWP 84,4 t, 64,9 %; NH4 (c_B 450): 54,8 %.

**Befunde**
- **behoben – T15-NH-1:** Richtwerte k vertauscht. Karbonatisierung ist bei mittlerer Feuchte am schnellsten, in beregnetem bzw. nassem Beton am langsamsten ([MATEC Web Conf. 289, 02001 (2019)](https://www.matec-conferences.org/articles/matecconf/pdf/2019/38/matecconf_cs18_02001.pdf): höchste Rate bei geschützter Außenlage, maßgebend die Luftfeuchte). Neu: „außen beregnet etwa 1–3, geschützt/innen etwa 3–8 mm/√a (Lehrwerte, vorläufig, F-Freigabe; Werte je Festigkeitsklasse in EN 16757)“.
- **behoben – T15-NH-2:** Code rechnete mit 44,0/56,1, Rechenweg zeigt 44,01/56,08 ≈ 0,784 – angeglichen. Text zum Karbonatisierungsgrad ergänzt (Literatur im Mittel 50–60 %, Obergrenze häufig 75 % des CaO; [core.ac.uk 325948752](https://core.ac.uk/download/325948752.pdf)).
- **offen – Frage T15-NH-3 (Zement-GWP):** Vorgaben 850 kg CO₂-Äq./t (CEM I) und 290 kg/t (CEM III/B). Die VDZ-Branchen-EPD CEM I (2022, gültig bis 06/2027) nennt 665 kg CO₂-Äq./t GWP-total A1–A3 (netto; brutto mit Abfallverbrennung 875) ([VDZ-EPD CEM I](https://www.beton.org/fileadmin/beton-org/media/Dokumente/PDF/Wissen/Beton-Bautechnik/Nachhaltigkeit/2022-06-08-EPD-CEM_I-D.pdf)). Andere Module verwenden 0,85 (Mischungsberechnung `ZEMENT_DATA`), 0,80 (Materialoptimierung), CEM III/B 0,35.
- **Umsetzung 29.10.2026 – T15-NH-3:** Gemeinsame Konstante `ZEMENT_GWP_KG` in `src/data/zementGwp.ts` (Nettowerte GWP-total A1–A3). Belegt: CEM I 0,665 kg/kg (brutto mit Abfallverbrennung 0,875; EPD-VDZ-20220153-IAG1-DE, gültig bis 07.06.2027, [VDZ-EPD CEM I](https://www.beton.org/fileadmin/beton-org/media/Dokumente/PDF/Wissen/Beton-Bautechnik/Nachhaltigkeit/2022-06-08-EPD-CEM_I-D.pdf)) und CEM II/C-M 0,400 (brutto 0,510; EPD-VDZ-20230234-IAG1-DE, gültig bis 10.07.2028, [VDZ-EPD CEM II/C-M](https://www.beton.org/fileadmin/beton-org/media/Dokumente/PDF/Wissen/Beton-Bautechnik/Nachhaltigkeit/2023-07-15-EPD-CEM_IIC-M.pdf)). Eine VDZ-Branchen-EPD für CEM III/A bzw. CEM III/B war über die zugelassenen Suchtreffer nicht abrufbar; diese und die übrigen Zementarten sind Lehrwerte, linear über den mittleren Klinkeranteil zwischen den beiden EPD-Werten (CEM II/B 0,53, CEM III/A 0,40, CEM III/B 0,26, CEM IV 0,43, CEM V 0,41, CEM VI 0,35; CEM II/A 0,60 wie bisher in der Materialoptimierung, ÖKOBAUDAT-Abgleich) – vorläufig, F-Freigabe. Modul: Vorgaben 665 (A) und 260 kg/t (B), Quellenzeile mit netto/brutto, Regler A in 5er-Schritten. Neu gerechnet: NH3 (450 m³, 340·665 vs. 350·260) ΔGWP 60,80 t, 59,8 %; NH4 (c_B 450) 48,3 %; Erkundungsaufträge (60 %/48 %, 61/122 t).
  - **Abgleich der übrigen Module** (alle rechneten Lehrwerte ohne Bruttokennzeichnung, keines bewusst brutto – daher überall angeglichen, keine Kennzeichnung nötig):

    | Modul / Datei | vorher (CEM I; weitere) | jetzt | neu gerechnet |
    |---|---|---|---|
    | Mischungsberechnung (`ZEMENT_DATA`, `src/calc/mischung.ts`) | 0,85; II/A 0,75, II/B 0,65, II/C-M 0,55, III/A 0,45, III/B 0,35, IV 0,50, V/VI 0,40 | aus `ZEMENT_GWP_KG` | Erkundung: CO₂ ≈ 219 → 245 kg/m³ (+12 %), vorher 278 → 312 |
    | Materialoptimierung (`ZEMENT_GWP_JE_KG`) | 0,80; II/A-LL 0,60, II/B-S 0,55, III/A 0,45, II/C-M 0,43 | 0,665/0,60/0,53/0,40/0,40 → Beton 243/222/200/158/158 kg/m³ | Lehrbeispiel 61,4 → 35,2 kg/m² (−43 %), Tests MO1–MO5 (u. a. MO1 8148/3845, 52,8 %), Erkundungen 53/34 %, 22/12/53 %, 72/54 % |
    | LCA-Grundlagen (Beispiel OE) | 0,80; III/A 0,45 | 0,665; 0,40 | 243 → 158 kg/m³ (−35 %) |
    | Transportbeton-Übung (`LCA_BENCHMARKS`, Excel-Vorlage) | 0,85; II/A-LL 0,68, III/A 0,42, III/B 0,28 | 0,665/0,60/0,40/0,26 | Referenz Preset 1: 299,1 → 239,9 kg/m³; Preset 3: ≈ 100 kg/m³ |
    | Biokohlebeton (Zementauswahl) | 0,80; II/B 0,65, III/A 0,45 | 0,665/0,53/0,40 | Beispiel: 2,05/0,665 = 3,08 kg Zement je kg Kohle; Erkundungen 27,1/33,0 kg/m³ (12,7/15,5 %), 19,2 %, 24,5 kg/m³ (19,1 %) |
    | Übungsaufgabe `t_nh_gwp_cem_vergleich` | 850/290 | 665/260 | ΔGWP 60,80 t (≈ 60 %) |

    Nicht geändert: Klinker-Emissionen „800–850 kg CO₂/t Klinker“ (BaustoffProfil; bezogen auf Klinker, nicht Zement), CBAM-Beispiel (direkte Emissionen nach CBAM-Methodik). Quiz angepasst: `qn_rechnung_nachhaltigkeit_4`, `q_mo_1`, `qn_materialoptimierung_3`, `qn_oekobilanz_lca_g1`, `qn_lca_rechner_3`.

**Empfehlung:** freigabefähig (T15-NH-3 am 29.10.2026 umgesetzt; CEM-III/B-Wert ist gekennzeichneter Lehrwert, F-Stelle).

- [ ] Modul freigeben

## 5. Bauen im Bestand (`rechnung_bestand`)

**Nachrechnungen:** B 225 ohne Prüfung: 0,8·22,5/0,95 − 3 = 15,95 N/mm², f_cd 9,04; B 300: 22,26/12,62; Prüfung 28,5 N/mm² → C20/25, f_cd 11,33; Ø 12: F_yd 21,64 (BSt 220), 41,31 (BSt 420), 49,17 kN (BSt 500) – Modul identisch, Erkundung richtig.

**Befunde**
- **behoben – T15-BS-1:** Klassen B 100 … B 600 als „DIN 1045:1972“ bezeichnet; DIN 1045:1972 führte erst die Klassen auf Quantilbasis (Bn …) ein ([Ernst & Sohn, Historische technische Regelwerke, Leseprobe](https://www.ernst-und-sohn.de/sites/default/files/uploads/produkte/buecher/probekapitel/978-3-433-02925-3_histor._techn._regelwerke_diverse.pdf)); davor Mindestfestigkeit der Würfelserie. Label „DIN 1045 vor 1972“, Hinweis Serienfestigkeit; Registry-Kurztext und Meta (nannte eine nicht vorhandene U-Wert-Rechnung) korrigiert.
- **behoben – T15-BS-2:** Stahlbezeichnungen nach DIN 488 (Kenntnisstand): G = glatt, R = gerippt, U = unbehandelt (warmgewalzt), K = kaltverformt. „BSt 220/340 RU – unberuhigt“ → „BSt 220/340 GU“; „BSt 420/500 RU – unberuhigt“ → „gerippt, warmgewalzt (naturhart)“. „Keine Schweißeignung … Heißrisse … strengstens verboten“ → „Schweißeignung nicht vorausgesetzt, Schweißen nur nach Werkstoffprüfung“. „η₁ = 0,3/0,7/1,0“ → Lehransatz der Verbundabminderung (vorläufig, F-Freigabe).
- **behoben – T15-BS-3a:** „Umrechnung nach DAfStb-Richtlinie Bauen im Bestand“ und „Abschlag 3,0 N/mm² vorgeschrieben“ – keine solche Richtlinie mit diesem Abschlag gefunden; jetzt „Lehransatz (keine Normvorgabe; vorläufig, F-Freigabe)“. Werbende Sätze („rechnet sich … extrem schnell“) neutral gefasst.
- **offen – Frage T15-BS-3 (Zuordnung/Abschlag):** Das Modul liefert für B 225 f_ck = 15,9 N/mm² (≈ C12/15), die Tabelle in „Historische Materialkennwerte“ ordnet B 225 → C20/25 („nicht konservativ – prüfen“) zu. Welche Zuordnung und welcher Abschlag sollen gelten?
- **offen – Frage T15-BS-4 (Klassen):** B 100 und B 150 sind in den älteren Fassungen nach Kenntnisstand nicht belegt (dort B 120, B 160, B 225, B 300; B 450/B 600 Spannbeton). Liste anpassen?
- **offen – Frage T15-BS-5 (Prüfwert):** Die Zuordnung über den Mittelwert einer Bohrkernserie ohne Streuung liegt auf der unsicheren Seite (vom Erkundungsauftrag selbst so beschrieben). Auf DIN EN 13791 (k_n, Kern `bauwerksuntersuchung.ts`, T12 geprüft) umstellen?
- **offen – Frage T15-BS-6 (Verbund-Lehransätze):** 30 % (glatt) bzw. 70 % (BSt III) der heutigen Verbundspannung – Quelle (z. B. Nachrechnungsrichtlinie, DBV-Merkblatt) festlegen oder streichen.
- Hinweis: 225 kp/cm² = 22,07 N/mm²; das Modul setzt 22,5 N/mm² (üblich gerundet, 2 % günstiger).
- **Umsetzung 29.10.2026 – T15-BS-3 (Zuordnung):** Eine gemeinsame, belegte Tabelle `ALTBETON_ZUORDNUNG` in `src/data/kennwerte.ts` für `rechnung_bestand` und „Historische Materialkennwerte“ (`historicalMaterialsData.ts` erzeugt die Zeilen B 120 … B 600 daraus). Quelle: J. Schnell, A. Fischer, M. Loch, „Anwendung von Teilsicherheitsbeiwerten auf Bestandsbauten im Hochbau“, Kurzbericht (BBR), TU Kaiserslautern 2008, Tab. 2.1 ([Schnell/Fischer/Loch, Kurzbericht BBR 2008](https://www.irbnet.de/daten/kbf/kbf_d_F_2719.pdf)): f_ck untere/obere Grenze der Ausführungsqualität und Klasse nach DIN EN 206-1 – B 120: 5,0/6,2 (–/–), B 160: 6,7/8,3 (–/C8/10), B 225: 10,1/12,3 (C8/10/C12/15), B 300: 15,5/18,0 (≈ C16/20/C16/20); nach der Quelle nur für die Vorbemessung. Das DBV-Merkblatt bzw. Fingerloos/Hegger/Zilch waren öffentlich nicht abrufbar. Der Lehransatz 0,8·β_W/0,95 − 3 N/mm² und der pauschale Abschlag sind entfallen; im Modul wählt man die Ausführungsqualität (untere Grenze voreingestellt). Neu: B 225 untere Grenze f_ck 10,1 → f_cd 5,72 N/mm² (vorher 15,95/9,04); B 300 15,5 → 8,78 (vorher 22,26/12,62). Historische Kennwerte: B 225 „C8/10 bis C12/15“ statt „C 20/25 (nicht konservativ – prüfen)“, B 300 „≈ C16/20 bis C16/20“ statt „C 25/30“.
- **Umsetzung 29.10.2026 – T15-BS-4 (Klassen):** Auswahl B 120, B 160, B 225, B 300; B 450 und B 600 als „Spannbeton (DIN 4227), nicht in der Zuordnungstabelle“ gekennzeichnet – ohne Bauwerksprüfung kein f_cd, nur Hinweis auf die Bohrkernprüfung. B 100/B 150 entfallen.
- **Umsetzung 29.10.2026 – T15-BS-5 (Prüfwert):** Eingaben n (8–30), Mittelwert f_m,is, Standardabweichung s und kleinster Einzelwert; Auswertung mit dem neuen Kern `insituDruckfestigkeit13791()` in `src/calc/bauwerksuntersuchung.ts`, der k_n und M aus `kn13791`/`margin13791` (`src/utils/schadensKern.ts`, T12/Runde 5 geprüft) übernimmt: f_ck,is = min(f_m − k_n·s; f_lowest + M), Klasse über f_ck,is ≥ 0,85·f_ck,cube (Kern h/d = 1 ≙ 150-mm-Würfel). Beispiel n = 8, 28,5/2,0/25,5: f_ck,is = 24,5 → C20/25, f_cd 11,33 N/mm²; Mittel 30,0 → 26,0 → C25/30; s 3,0 → 24,0 → C20/25. Für n < 8 meldet der Kern „nicht abgebildet“. Mindeststandardabweichung nicht angesetzt (Normtextpunkt, vorläufig, F-Freigabe). Übungsaufgabe `t_hist_beton_umrechnung` (Modul Historische Kennwerte) ebenfalls korrigiert: k_n = 2,00 statt 1,48, Aktenlage nach Tabelle (f_cd 5,72 statt 6,8).
- **Umsetzung 29.10.2026 – T15-BS-6 (Verbund):** Keine belegte Quelle für 30 %/70 % gefunden – gestrichen. Text jetzt: Verbundspannungen nach DIN EN 1992-1-1 gelten für Rippenstähle und sind auf glatte bzw. historisch gerippte Stäbe nicht übertragbar; Ansatz im Einzelfall durch die Tragwerksplanung. Quiz `qn_rechnung_bestand_1`, `_4` (Erklärung), `_5` angepasst; Erkundungsaufträge neu gerechnet.

**Empfehlung:** freigabefähig (T15-BS-3 bis -6 am 29.10.2026 umgesetzt; offen bleibt nur der Normtextpunkt Mindeststandardabweichung nach DIN EN 13791).

- [ ] Modul freigeben

## 6. Planung & Ausschreibung (`px_planung`)

**Nachrechnungen:** Beispiel 1 c_nom XC4 Ø 12: max(12; 25; 10) + 15 = 40 mm – richtig (Tab. 4.4DE wie T12); Beispiel 2 Gleichwertigkeit: R = 4,57 m²K/W, d_erf = 0,183 m – richtig.

**Fakten-Stichprobe:** DIN 18533-1:2026-06 erschienen, Türanschluss ≥ 15 cm, abgesenkte Anschlüsse mit Ersatzmaßnahmen, Begriff „Wasserbeanspruchungsklasse“, Klassen W1-E bis W4-E bleiben – richtig ([DIN Media, DIN 18533-1](https://www.dinmedia.de/de/norm/din-18533-1/399850897); [Bauprofessor, Änderungen DIN 18533-1](https://www.bauprofessor.de/din18533-1-abdichtung-von-erdberuehrten-bauteilen-die-wichtigsten-aenderungen/)). XC2 C16/20, w/z 0,75; XF1 C25/30, w/z 0,60; R90-Stütze µ_fi 0,5: 300/45 bzw. 400/38 mm; Nachbehandlungsklassen 35/50/70 % (DIN EN 13670); CEM III/A 36–65 % Hüttensand; § 7 Abs. 2 VOB/A „oder gleichwertig“ – nach Kenntnisstand richtig.

**Befunde:** **behoben – T15-PP-1:** „CEM II/B-M, CEM II/C-M nach DIN EN 197-5“ → CEM II/B-M nach DIN EN 197-1.

**Empfehlung:** freigabefähig nach Korrektur T15-PP-1.

- [ ] Modul freigeben

## 7. Bauleitung & Baustelle (`px_bauleitung`)

**Nachrechnungen:** w/z 165/300 = 0,55 → 175/300 = 0,583 – richtig; f_bd = 2,25·1,2 = 2,70 N/mm² (α_ct = 1,0 wie Kern), l_b,rqd = 483 mm – richtig; l₀ siehe T15-PB-1 (Kern `bemesseVerankerung`: α₆ = 1,4).

**Fakten-Stichprobe (Kenntnisstand):** F3 = 420–480 mm; Mindestluftgehalt 4,5 % bei 16 mm; Probekörper 16 h bis 3 d bei 20 ± 5 °C (DIN EN 12390-2); Δc_dev 15/10 mm; § 6 Abs. 1 und § 13 Abs. 3 VOB/B; Belegreife CM 2,0/1,8 bzw. 0,5/0,3 %; Haftzug ≥ 1,5/1,0 N/mm² – richtig.

**Befunde**
- **behoben – T15-PB-1:** siehe oben (α₆ nach NA DE, vorläufig, F-Freigabe wie T2-S-1).
- Hinweis T15-PB-2: DIN 18014 ohne Ausgabe genannt (Ausgabe 2023-06 nach Kenntnisstand); Grenzwert 0,2 Ω nicht am Normtext geprüft.

**Empfehlung:** freigabefähig nach Korrektur T15-PB-1.

- [ ] Modul freigeben

## 8. Bautagebuch (`px_bautagebuch`)

**Nachrechnungen:** Saul f_T = 30/(5 + 10) = 2,0 → 6 d; r = 18/40 = 0,45 → „mittel“ (Grenzen 0,50/0,30/0,15) – richtig. Bewertungsscore: Abzüge 10–30 Punkte, Untergrenze 10, Notenstufen – in sich schlüssig.

**Befunde**
- **behoben – T15-BT-1:** „Tagesbericht gerichtsicher zertifiziert“ und „in der Datenbank verschlüsselt“ → „ausgewertet (Lehrbewertung, keine rechtliche Prüfung)“ und „nur lokal in diesem Browser gespeichert (unverschlüsselt, ohne Server)“ – entspricht `localStorage`. Bestnote „entspricht vollumfänglich den rechtlichen Ansprüchen“ → „erfüllt alle Prüfpunkte dieser Lehrbewertung“.
- **behoben – T15-BT-2:** Szenario Schlechtwetter wertete jedes „fm“ im Freitext als Ablehnung der Wasserzugabe (z. B. „Aufmaß“); jetzt nur das Wort „FM“.
- Hinweis T15-BT-3: Die Schlagwortprüfung erkennt Verneinungen nicht („Wasser zugegeben“ zählt als „Wasserzugabe untersagt“); Lehrheuristik, im Text nicht als solche bezeichnet.

**Empfehlung:** freigabefähig nach Korrektur T15-BT-1/-2.

- [ ] Modul freigeben

## 9. Produktherstellung & QS (`px_produktion`)

**Nachrechnungen:** Feuchtekorrektur 1000·1,04 = 1040 kg, w_Zugabe 125 kg, w/z ohne Korrektur 0,683 – richtig; Konformität Erstherstellung f_cm 41,0 ≥ 41, f_ci,min 39 ≥ 33 – richtig.

**Fakten-Stichprobe:** BauPVO (EU) 2024/3110 anwendbar seit 08.01.2026; Aufbewahrung 10 Jahre (VO 305/2011); Dosiergenauigkeit ±3/±5 %; DEF-Grenze 60–65 °C; Mischguttemperaturen 140–190 °C (Kenntnisstand) – richtig.

**Befunde**
- **behoben – T15-PR-1:** RC-Gesteinskörnung „nach DAfStb-Richtlinie (2010): Typ 2 etwa 25–35 Vol.-%“ → DIN 1045-2:2023-08, Anhang E (ersetzt die Richtlinie): Typ 1 25–45, Typ 2 20–35 Vol.-%, XA2/XA3/XM unzulässig – wie Kern `rcGesteinskoernung.ts` (vorläufig, F-Freigabe; Normtextpunkt T9-GL-1a).
- **behoben – T15-PR-2:** System 2+: die notifizierte Stelle stellt das „Zertifikat der Konformität der werkseigenen Produktionskontrolle“ aus, nicht das „Konformitätszertifikat“ (Systeme 1+/1).

**Empfehlung:** freigabefähig nach Korrektur T15-PR-1/-2; die RC-Höchstanteile bleiben bis zur Prüfung am Normtext vorläufig (wie T9-GL-1a).

- [ ] Modul freigeben

## 10. Karrierestart & Soft Skills (`px_karriere`)

**Nachrechnungen:** Angebot 100 000·1,09·1,05 = 114 450 €; Lohnkosten 250·0,8·30 = 6000 € – richtig.

**Fakten-Stichprobe (Kenntnisstand):** DGUV Vorschrift 38, BaustellV, BayBauKaG Fortbildungspflicht, SIVV-Schein (Ausbildungsbeirat beim DBV), E-Schein – plausibel.

**Befunde:** **offen – Frage T15-PK-1 (Normtext):** „ÜK 2 (DIN 1045-3:2023-08; bis 2012 auch ÜK 3)“ – ob DIN 1045-3:2023-08 die Überwachungsklasse 3 noch führt, ist öffentlich nicht eindeutig; am Normtext prüfen.

**Empfehlung:** freigabefähig nach Klärung von T15-PK-1.

- [ ] Modul freigeben

## 11. Regulatives & Normung (`regularien`)

**Fakten-Stichprobe:** § 634a BGB 5 Jahre, § 13 Abs. 4/5 VOB/B 4 Jahre bzw. 2 Jahre nach Mängelrüge; § 8a VOB/A; Art. 81a BayBO/§ 85a MBO; HOAI 2021 Basishonorarsatz ohne Vereinbarung; EuGH C-377/17 vom 04.07.2019; DIN 18195 seit 2017 nur Begriffe; EPBD 2024 Umsetzung bis Mai 2026; EU-Taxonomie 70 % Bauabfall – nach Kenntnisstand richtig. BauPVO 2024/3110 seit 08.01.2026 und GModG (in Kraft 29.07.2026) wie T12 belegt.

**Befunde**
- **behoben – T15-RG-1:** „Aufgrund der Kulturhoheit … liegt das Bauordnungsrecht bei den Ländern“ → Gesetzgebungskompetenz der Länder (Art. 70 GG), Bauplanungsrecht beim Bund (Art. 74 Abs. 1 Nr. 18 GG).
- Hinweis: „Gebäudetyp E – Gesetzentwurf im parlamentarischen Verfahren seit 06/2026“ nicht nachgeprüft (Stand vor der Lehre prüfen); Literatur Wendehorst 27. Aufl. 2011 veraltet.

**Empfehlung:** freigabefähig nach Korrektur T15-RG-1.

- [ ] Modul freigeben

## 12. Neue Normengeneration (`normen_ausblick`)

**Fakten-Stichprobe:** DIN EN 206-1:2026-07 erschienen, ersetzt DIN EN 206:2021-06 teilweise; Aufteilung in drei Teile, Anhang D → EN 206-3, Öffnung für nationale ERC-Regeln, Abschnitt 5.4 CO₂-Klassen, Angleichung an EN 1992-1-1:2023 – richtig ([DIN Media, DIN EN 206-1:2026-07](https://www.dinmedia.de/de/norm/din-en-206-1/399836281)). XRC-Klassen 0,5 … 7, XRDS 0,5 … 10, Einführung 1. Generation zum 01.07.2012, M/515 – nach Kenntnisstand richtig; das Modul kennzeichnet unbestätigte Punkte bereits.

**Befunde:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 13. Laborsicherheit (`labor_sicherheit`)

**Prüfumfang:** Laborordnung, PSA, Sperrgeräte, Gefahrstoffe (Zement, Quarzstaub, Epoxidharze), Notfallkette, Regelwerke, Formeln. Maßstab: GefStoffV/TRGS Stand 10/2026, keine Gefährdung durch falsche Angaben.

**Fakten-Stichprobe:** TRGS 559 „Quarzhaltiger Staub“ (01.04.2020): Beurteilungsmaßstab Quarz (A-Staub) 0,05 mg/m³, A-Staub-AGW 1,25 mg/m³, Tätigkeiten mit A-Staub aus kristallinem SiO₂ nach TRGS 906 krebserzeugend ([umwelt-online, TRGS 559](https://umwelt-online.de/recht/t_regeln/trgs/trgs500/559_20.htm); [BGN, TRGS 559 Abschn. 1](https://vorschriften.bgn-branchenwissen.de/daten/tr/trgs559/1.htm)); Unfallversicherungsträger der Studierenden staatlicher bayerischer Hochschulen ist die Bayerische Landesunfallkasse ([OTH Regensburg, Versicherungen](https://www.oth-regensburg.de/studieren/im-studium/formales/versicherungen)); DGUV Vorschrift 68 und DGUV Grundsatz 308-001 für Flurförderzeuge ([TÜV Akademie, Bedienberechtigungen](https://akademie.tuv.com/page/mobilitaet/bedienberechtigungen)). Kenntnisstand: S3-Zehenkappe 200 J, LärmVibrationsArbSchV obere Auslösewerte 85 dB(A), pH ≥ 12,5 ⇒ [OH⁻] ≥ 0,03 mol/l, Staubklasse M/H, Augenspülung 10–15 min – richtig.

**Befunde**
- **behoben – T15-LS-1:** „Krebserzeugend (Kat. 1A)“ → „Tätigkeit nach TRGS 906“, Beurteilungsmaßstab 0,05 mg/m³ ergänzt (eine harmonisierte CLP-Einstufung von Quarz als Carc. 1A besteht nach Kenntnisstand nicht).
- **behoben – T15-LS-2:** Regelwerk „DGUV Regel 109-009 (Fahrzeuginstandhaltung / Hebebühnen und Krane)“ → DGUV Vorschrift 52 (Krane), DGUV Vorschrift 68 (Flurförderzeuge), Fahrausweis nach DGUV Grundsatz 308-001.
- **behoben – T15-LS-3:** „Landesunfallkasse / Bayerische Unfallkasse“ → Bayerische Landesunfallkasse. Formelquelle „DIN EN 197-1 / TRGS 613“ → „Sicherheitsdatenblatt Zement (H315, H318); DIN EN 197-1“ (TRGS 613 nach Kenntnisstand aufgehoben).
- **offen – Frage T15-LS-4 (lokale Angaben):** Namen, Durchwahlen, Räume (Ersthelfer, Hausservice), „Notruf 0-112“ und der Vermerk „geprüft durch Laborleitung Prof. Dr.-Ing. …“ sind öffentlich nicht prüfbar. Bitte bestätigen; Vermerk ohne Namen fassen (Grundsatz „keine Personennamen bei Prüfungen/Freigaben“)?
- **Umsetzung 29.10.2026 – T15-LS-4:** Namen und Durchwahlen ersetzt durch Funktionsbezeichnungen: „Laborleitung des Baustofflabors“, „Ersthelfer/in des Baustofflabors bzw. des Gebäudes G2 (siehe Aushang)“, „Sicherheitsbeauftragte/r bzw. Laborpersonal vor Ort“, „Hausservice“, jeweils „erreichbar über die Hochschulzentrale“; personenbezogene Raumangaben und Suchbegriffe (Namen) entfernt. Vermerk jetzt „… Gebäude G2, TH Augsburg; durch die Laborleitung geprüft“. Notruf 112 (Festnetz ggf. 0-112) und Gebäudeangaben unverändert.
- Hinweis: Die GefStoffV wird ohne Fassung genannt (Novelle mit Asbest-Regeln in Kraft seit 05.12.2024, Kenntnisstand); „Bei jedem Arztbesuch zwingend D-Arzt“ ist strenger als nötig, aber nicht gefährdend – unverändert.

**Empfehlung:** freigabefähig (T15-LS-4 am 29.10.2026 umgesetzt).

- [ ] Modul freigeben

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage | Vorschlag |
|---|---|---|---|
| T15-BE-2 | Beton | Ausschalkriterium „≥ 50 %“ ohne Quelle (früher „CEN-Richtwert“, „DBV-Leitfaden“) | Als Eingabe „Festigkeitsvorgabe der Tragwerksplanung (z. B. 50 % von f_ck)“ führen und mit f_ck(t) vergleichen; bis dahin Lehrannahme (umgesetzt) |
| T15-BE-6 | Beton | Wasseranspruch-Tabelle „Erfahrungswerte nach DBV“ ohne Fundstelle | Als „Lehrwerte (Größenordnung)“ kennzeichnen, Quelle nur nennen, wenn belegt |
| T15-NH-3 | Nachhaltigkeit | Zement-GWP 850/290 kg/t gegenüber VDZ-EPD CEM I 665 kg/t (netto) und anderen Modulen | Vorgabe CEM I = 665 kg/t (VDZ-EPD 2022, A1–A3) mit Hinweis brutto 875; CEM III/B aus Branchen-EPD; Erkundungsaufträge neu rechnen |
| T15-BS-3 | Bestand | Zuordnung B 225 → 15,9 N/mm² (Modul) vs. C20/25 (Historische Kennwerte); Abschlag 3 N/mm² ohne Quelle | Eine Zuordnungstabelle aus einer Quelle (z. B. DBV-Merkblatt „Bauen im Bestand – Beton und Betonstahl“) in `src/data/kennwerte.ts`, beide Module daraus |
| T15-BS-4 | Bestand | Klassen B 100/B 150 nicht belegt | Auswahl B 120, B 160, B 225, B 300 (B 450/B 600 als Spannbeton kennzeichnen) |
| T15-BS-5 | Bestand | Prüfwert über Mittelwert ohne Streuung | Eingabe n und s, Auswertung nach DIN EN 13791 mit dem Kern aus T12 |
| T15-BS-6 | Bestand | Verbund-Lehransätze 30 %/70 % | Quelle festlegen oder durch qualitativen Hinweis ersetzen |
| T15-PK-1 | Karriere | ÜK 3 in DIN 1045-3:2023-08 (Normtext) | Am Normtext prüfen; bis dahin Satz „bis 2012 auch ÜK 3“ als vorläufig kennzeichnen |
| T15-LS-4 | Laborsicherheit | Lokale Angaben und Vermerk „geprüft durch …“ mit Namen | Angaben durch die Laborleitung bestätigen; Vermerk „Stand Oktober 2026 (Laborleitung)“ ohne Namen |

**Stand 29.10.2026:** T15-BE-2, T15-BE-6, T15-NH-3, T15-BS-3 bis -6 und T15-LS-4 entschieden und umgesetzt (Abschnitte „Umsetzung 29.10.2026“ oben); offen bleibt T15-PK-1 (Normtext).

## Hinweis Quiz

- Geändert (je `verified: false`, `reviewer`/`reviewedAt` entfernt, `vorpruefung.hinweis` „Modulprüfung Tranche 15 (29.10.): … – korrigiert“): `qn_rechnung_bestand_4` (GU statt RU, Schweißen nur nach Werkstoffprüfung, ohne η₁), `qn_rechnung_bestand_6` (Bezeichnung GU), `qn_px_bauleitung_2` (Distraktor l₀ mit α₆ = 1,4: 790 statt 846 mm). Prüflisten Cluster V/VI mit `scripts/pruefliste.ts` neu geschrieben.
- Umsetzung 29.10.2026 (je `verified: false`, `reviewer`/`reviewedAt` entfernt, `vorpruefung.hinweis` „Umsetzung 29.10.: … – korrigiert“): `qn_rechnung_beton_6` (Kriterium f_ck(t) gegen Vorgabe), `qn_rechnung_nachhaltigkeit_4` (665/260), `qn_rechnung_bestand_1` (Tabelle, f_cd 5,72), `qn_rechnung_bestand_4` (Erklärung ohne 30 %), `qn_rechnung_bestand_5` (kein Abschlag), `q_mo_1`, `qn_materialoptimierung_3`, `qn_oekobilanz_lca_g1`, `qn_lca_rechner_3` (Zement-GWP); Prüflisten mit `scripts/pruefliste.ts` neu geschrieben.
- Geprüft, unverändert (Stand vor der Umsetzung): `qn_rechnung_beton_6` (t_T ≈ 4,8 d, β_cc ≈ 0,70 bleiben richtig; Kriterium im Modul jetzt Lehrannahme), `qn_rechnung_stahlbeton_4/5`, `qn_rechnung_nachhaltigkeit_1/3`, `qn_rechnung_bestand_1/5`, `qn_labor_sicherheit_2`.

## Nachweis der Prüfung

- Eigenes Python-Skript (eigene Umsetzung von Stoffraumrechnung, k-Wert-Ansatz, Energiebilanz, EC2 3.1.2/Anhang B, µ-Verfahren, EC5 6.3.2, √t-Gesetz und Stöchiometrie, Lehransatz Bestand, EC2 8.4/8.7, Kalkulation, Saul); 75 Prüfungen als `tests/modulpruefungTranche15.test.ts`.
- QA (lokal, nach Einmergen von origin/main): `npx tsc --noEmit`, `npm test` (alle Tests, inkl. `fcdModule`, `auditDaten`, `quiz`, `pruefliste`), `check:formeln` (4490 Formeln, 0 fehlerhaft), `check:zahlen` (inkl. Tausender), `check-design`, `check-verwaist --strict`, `check-any`, Build, `check-bundle`; `a11y-reiter` (desk, mob, desk-dunkel) auf `rechnung_beton`, `rechnung_stahlbeton`, `rechnung_holzbau`, `rechnung_nachhaltigkeit`, `rechnung_bestand`, `px_planung`, `px_bauleitung`, `px_bautagebuch`, `px_produktion`, `labor_sicherheit`, `regularien`: 105 Reiter-Prüfungen, 0 Verstöße.
- Öffentliche Quellen: [DIN Media, DIN EN 206-1:2026-07](https://www.dinmedia.de/de/norm/din-en-206-1/399836281); [DIN Media, DIN 18533-1](https://www.dinmedia.de/de/norm/din-18533-1/399850897); [Bauprofessor, DIN 18533-1 Änderungen](https://www.bauprofessor.de/din18533-1-abdichtung-von-erdberuehrten-bauteilen-die-wichtigsten-aenderungen/); [VDZ-EPD CEM I (2022)](https://www.beton.org/fileadmin/beton-org/media/Dokumente/PDF/Wissen/Beton-Bautechnik/Nachhaltigkeit/2022-06-08-EPD-CEM_I-D.pdf); [MATEC Web Conf. 289, 02001](https://www.matec-conferences.org/articles/matecconf/pdf/2019/38/matecconf_cs18_02001.pdf); [core.ac.uk 325948752](https://core.ac.uk/download/325948752.pdf); [Ernst & Sohn, Historische technische Regelwerke (Leseprobe)](https://www.ernst-und-sohn.de/sites/default/files/uploads/produkte/buecher/probekapitel/978-3-433-02925-3_histor._techn._regelwerke_diverse.pdf); [umwelt-online, TRGS 559](https://umwelt-online.de/recht/t_regeln/trgs/trgs500/559_20.htm); [BGN, TRGS 559 Abschn. 1](https://vorschriften.bgn-branchenwissen.de/daten/tr/trgs559/1.htm); [OTH Regensburg, Versicherungen](https://www.oth-regensburg.de/studieren/im-studium/formales/versicherungen); [TÜV Akademie, Bedienberechtigungen](https://akademie.tuv.com/page/mobilitaet/bedienberechtigungen).
