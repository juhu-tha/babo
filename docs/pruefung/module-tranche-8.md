# Modulprüfung Tranche 8 – Bauprodukte (Befundliste zur Freigabe)

**Stand:** 28.10.2026 (Branch `pruefung/module-tranche8-10-28`, Basis origin/main b2cb8367)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke geändert.

## Vorgehen

- **Auswahl (15 Module der Gruppe Bauprodukte):** Trockenbau, Putz/Estrich, Abdichtung, Dämmung, Befestigung, Klebstoffe, Farben/Lacke, Betonzusatzmittel, Holzprodukte (ohne Einfeldbalken, der in Tranche 2 geprüft wurde), Kunststoffe, Mineralisch, Gläser, Lehmbauprodukte, Metallisch, Stahlbauprofile.
- **Prüfumfang je Modul:** Rechnung bzw. Rechenbeispiel, Fachtext (`content/<modul>/*.json`) und Normstand (Ausgaben Oktober 2026, NA DE), Grenzen (`src/data/rechnerGrenzen.ts`), Beispiele, Lernziele (`src/data/lernziele.ts`) und Kurzfassung (`src/data/kurzfassung.ts`), Erkundungsaufträge, Quellen im Modulfuß, Stellen „vorläufig, F-Freigabe“.
- **Rechenkern neu:** Die Module rechneten bisher in der Komponente. Die Rechnungen stehen jetzt 1:1 in `src/calc/bauprodukte.ts` (12 Funktionen); die Komponenten zeigen nur noch an. Verhalten und Rundung sind unverändert (Ausnahme: Befund T8-DA-2, eine Bedingung im Dämmstoff-Berater).
- **Nachrechnung:** eigenes Python-Skript mit eigener Umsetzung (Gösele-Näherung, DIN EN ISO 6946, DIN EN ISO 10077-1, DIN EN 1992-4, DIN 18008, Burgers-Modell, Stöchiometrie mit Molmassen), außerdem eine Konsistenzprüfung aller 86 Stahlprofile (A, I_y gegen die Blechgeometrie, W = 2I/h, i = √(I/A)). Ergebnis: 94 nachgerechnete Einzelwerte und 86 Profilzeilen, ohne Abweichung außer den Profilen HEM 400/500/600 (Befund T8-ST-1). Die maßgebenden Sollwerte stehen als Regressionstest in `tests/modulpruefungTranche8.test.ts` (mit Fuzz-Test über 1 000 Zufallseingaben).
- Wo ein Modul nur Wissen vermittelt, wurde eine Fakten-Stichprobe von mindestens fünf Aussagen gegen öffentliche Quellen geprüft. Es wurden nur öffentliche Quellen verwendet (URLs aus Suchergebnissen); Normtexte wurden nicht abgeschrieben. Wo der Normtext nötig ist, steht die Stelle unter „F-Freigabe“.
- **Grenzen:** Einträge in `rechnerGrenzen.ts` gibt es nur für `bp_glaeser` und `bp_holzprodukte`. Die übrigen 13 Module zeigen keine Grenzenliste an; die Grenzen stehen im Fließtext. Empfehlung für eine spätere Runde: Grenzen-Einträge für die Rechner Trockenbau-Bedarf, Fugenband, Dämmstoff-Berater, Farbmenge, Zusatzmittel, Lehmwand, Randspannung (nicht Teil dieses PR, weil die Anzeige erst verdrahtet werden müsste).

## Übersicht

| Nr. | Modul | Prüfvermerk-ID | Rechnung | Empfehlung |
|---|---|---|---|---|
| 1 | Trockenbau | `bp_trockenbau` | Bedarf, f₀-Beispiel | freigabefähig nach Klärung von T8-TB-Q1 |
| 2 | Putz und Estrich | `bp_putz_estrich` | Stöchiometrie-Beispiel | freigabefähig |
| 3 | Abdichtung | `bp_abdichtung` | Fugenband, Nassschichtdicke | freigabefähig nach Klärung von T8-AB-Q1 bis Q3 |
| 4 | Dämmung | `bp_daemmung` | Dämmstoff-Berater, U-Wert | freigabefähig nach Klärung von T8-DA-Q1 und Q2 |
| 5 | Befestigung | `bp_befestigung` | Betonausbruch-Beispiel | freigabefähig |
| 6 | Klebstoffe | `bp_klebstoffe` | Fugenbreite-Beispiel | freigabefähig nach Klärung von T8-KL-Q1 |
| 7 | Farben und Lacke | `bp_farben_lacke` | Schichtdicke/Menge, OS-Mengen | freigabefähig |
| 8 | Betonzusatzmittel | `bp_betonzusatzmittel` | w/z-Anrechnung | freigabefähig nach Klärung von T8-BZ-Q1 |
| 9 | Holzprodukte (Rest) | `bp_holzprodukte` | Einfeldbalken (T2) | freigabefähig |
| 10 | Kunststoffe | `bp_kunststoffe` | Burgers, ΔL | freigabefähig |
| 11 | Mineralisch | `bp_mineralisch` | Nasslast | freigabefähig |
| 12 | Gläser | `bp_glaeser` | U_w (Kern `fenster.ts`), f_g,d | freigabefähig nach Klärung von T8-GL-Q1 |
| 13 | Lehmbauprodukte | `bp_lehmbauprodukte` | Lehmwand (Lehrrechnung) | nach Klärung der F-Stellen (Rechenansatz nicht belegt) |
| 14 | Metallisch | `bp_metallisch` | Blechmasse, ΔU | freigabefähig nach Klärung von T8-ME-Q1 |
| 15 | Stahlbauprofile | `bp_stahlbauprofile` | Randspannung, Profiltabellen | freigabefähig nach Korrektur T8-ST-1 |

**Behobene Fehler (dieser PR):** T8-TB-1 bis 3, T8-PE-1 bis 3, T8-AB-1 und 2, T8-DA-1 bis 5, T8-BF-1 und 2, T8-KL-1 bis 4, T8-FL-1 bis 5, T8-BZ-1 und 2, T8-HO-1, T8-KS-1 und 2, T8-MI-1, T8-GL-1 und 2, T8-LE-1, T8-ME-1 und 2, T8-ST-1.

---

## 1. Trockenbau (`bp_trockenbau`)

**Prüfumfang:** `src/modules/BpTrockenbau.tsx` (Bedarfsrechner, Systemtabelle), `content/bptrockenbau/BpTrockenbau.json` (Produkt- und Systemdaten, Spachtelklassen, Ausführungshinweise, Resonanz-Beispiel), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| TB1 | f₀, je Seite 10 kg/m², d = 75 mm, Faserdämmung | Gösele: f₀ = 160·√(s′·(1/m₁ + 1/m₂)), s′ = 0,10/d MN/m³ → 82,6 Hz (Vorfaktor 160·√0,10 = 50,6) | 82 Hz (Vorfaktor 50) |
| TB2 | wie TB1, doppelt beplankt (20 kg/m²) | 58,4 Hz (Faktor 1/√2) | 58 Hz |
| TB3 | Vorfaktor Luftschicht | 160·√0,14 = 59,9 | „≈ 60“ |
| TB4 | Bedarf 20 m², 2-lagig, 62,5 cm, mit Dämmung | 84 m² Platten; CW 42 / UW 14,7 lfm; 1 155 Schrauben; 36 kg Spachtel; 16 lfm Band; 20,4 m² Dämmung | identisch |
| TB5 | 7 m², 1-lagig, 31,25 cm | 221 Schrauben; CW 27,9 lfm | identisch |
| TB6 | Kristallwasser Gips | 2·18,015/172,17 = 20,9 M.-% („~21 %“; ≈ 2 l/m² bei 12,5 mm GKF) | identisch |

**Fakten-Stichprobe:** Plattentypen nach DIN EN 520 (GKB = A, GKBI = H2, GKF = DF), λ = 0,25 W/(mK) und μ = 10 für Gipsplatten, Gipsfaser μ = 13 und ρ ≈ 1 150 kg/m³, Fugenversatz ≥ 400 mm, Q2 als Standard, Q4 mit vollflächiger Schicht > 1 mm, UA-Profil 2 mm, CW 0,6 mm: richtig. Die R_w-Werte der Systemtabelle (45/48/52/56 dB) liegen am unteren Rand der Knauf-Systemangaben (W111 CW 50: 44–56 dB, W112 CW 50: 54–67 dB, [Knauf W11.ch 03/2026](https://prd-media.crb.ch/media/125877/W11.ch_-_Knauf_Metallstaenderwände_-_DEU_-_03.2026.pdf)); als „ca.“-Werte vertretbar.

**Befunde**
- **behoben – T8-TB-1:** „erste Lage … (Ständerachsabstand 75 cm) … zweite Lage (Achsabstand 25 cm)“ verwechselte Ständer- und Schraubenabstand. Jetzt: Schraubenabstand ≤ 750 mm (innere Lage) bzw. ≤ 250 mm (äußere Lage) nach DIN 18181.
- **behoben – T8-TB-2:** Die Hartgipsplatte „Typ DFIR“ wurde als „werksseitig imprägniert“ und „mit Hydrophobierung“ beschrieben. Imprägniert ist erst der Typ DFH2IR (Kennbuchstabe H nach DIN EN 520). Die Texte nennen das jetzt als Variante; der Typ DFIR bleibt (Lernziel und Quizfrage qn_bp_trockenbau_1 bleiben richtig).
- **behoben – T8-TB-3:** Schnellbauschrauben „phosphatiert gegen aggressive Säurekorrosion im feuchten Gipsbett“ – Gips ist nicht sauer; die Phosphatierung ist ein einfacher Korrosionsschutz für trockene Innenräume. Text berichtigt.
- **offen – Frage T8-TB-Q1:** Die Bedarfs-Richtwerte (CW 2,0 m/m², Schrauben 30/55 je m², Dichtband 0,8 m/m², Spachtel 0,45 kg je m², Lage und Seite) sind herstellerneutrale Lehrwerte ohne genannte Quelle. Der Spachtel ist bei Doppelbeplankung vermutlich zu hoch angesetzt (innere Lage nur Fugenfüllung; Herstellerangabe Uniflott ca. 110 g je lfm Fuge, [Hornbach/Knauf](https://media.hornbach.de/hb/brochure/as.183302301.pdf); ein Online-Rechner zählt nur Seiten: 0,4 kg/m² Q2, [deutschland-rechner.de](https://www.deutschland-rechner.de/trockenbau-rechner)). Sollen die Werte auf eine Systemangabe (z. B. Materialbedarf W111/W112) umgestellt und im Modul als Quelle genannt werden?
- Hinweise (keine Änderung): Calciumsilikat „DIN EN 14306“ ist die Norm für betriebstechnische Dämmstoffe; Klimaplatten haben meist eine abZ/ETA. Die Systemnamen W111/W112/W115/D112/D131/F141 sind Herstellerbezeichnungen (Knauf), im Modul aber neutral beschrieben.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig nach Klärung von T8-TB-Q1.

- [ ] Modul freigeben

## 2. Putz und Estrich (`bp_putz_estrich`)

**Prüfumfang:** `content/bpputzestrich/BpPutzEstrich.json` (Produktdatenblätter, Abbindechemie, Klassen), Rechenbeispiel Wasserbedarf Stuckgips, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| PE1 | CaSO₄·½H₂O + 1,5 H₂O | M = 145,14 g/mol; gebundenes Wasser 0,1862 kg/kg | 145,1; 0,186 |
| PE2 | w/g = 0,7 | Überschuss 0,514 kg/kg; Anteil gebunden 26,6 % („gut ein Viertel“) | 0,5; richtig |
| PE3 | s_d Kalkputz 15 mm, μ = 10 | 0,15 m | identisch |

**Fakten-Stichprobe:** CS I 0,4–2,5 und CS II 1,5–5,0 N/mm² (DIN EN 998-1), Sanierputz Luftporengehalt > 25 % (WTA 2-9), Gipsputz ≥ 2,0 N/mm² (DIN EN 13279-1), Estrichklassen C5–C80/F1–F50 und AS-IC 10/15 (DIN EN 13813), Heizestrich-Feldgröße ca. 40 m², s_d ≤ 0,5 m diffusionsoffen (DIN 4108-3): richtig.

**Befunde**
- **behoben – T8-PE-1:** Schreibfehler „Q2 (standardgeqvölbt – tapezierfähig)“ → „Q2 (Standard – tapezierfähig)“.
- **behoben – T8-PE-2:** „Kalk-Zementputze (CR/CS III)“: CR ist in DIN EN 998-1 der Edelputz (farbiger Oberputz). Jetzt „GP, CS II–CS III“ (wie im Datenblatt).
- **behoben – T8-PE-3:** Gipsputz mit Code „GP / B1–B7“: GP ist ein Kurzzeichen der DIN EN 998-1, Gipsputze werden nach DIN EN 13279-1 als B1–B7 bezeichnet. Code berichtigt.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 3. Abdichtung (`bp_abdichtung`)

**Prüfumfang:** `src/modules/BpAbdichtung.tsx` (DIN-18533-Berater, Fugenband-Planer, Injektionsschlauch-Planer), `content/bpabdichtung/BpAbdichtung.json`, Kurzfassung, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| AB1 | PMBC W2.1-E, d_dry = 4 mm, 30 % flüchtig | d_wet = 5,71 mm → ≈ 6 mm | identisch (Beispiel) |
| AB2 | d_dry = 3 mm, 35 % flüchtig | 4,62 mm | – (Formel) |
| AB3 | Arbeitsfuge, 3 m WS, d = 30 cm, GK 32 | A 200; d ≥ a; Rand 10 cm ≥ 9,6 cm | identisch |
| AB4 | Dehnfuge, 10 m WS, d = 30 cm, GK 32 | FM 400; d < a; Rand 5 cm < 9,6 cm | identisch |
| AB5 | Dehnfuge, 2 m WS, d = 24 cm, GK 16 | D 240; d ≥ a; Rand 6 cm ≥ 4,8 cm | identisch |

**Normstand:** DIN 18533-1 bis -3:2026-06 (Wassereinwirkungs- heißen jetzt Wasserbeanspruchungsklassen, Rissüberbrückungsklassen mit den Rissklassen zusammengeführt, FPD in Teil 3, [Bauprofessor 03.06.2026](https://www.bauprofessor.de/news/neuauflage-der-din-18533-abdichtung-von-erdberuehrten-bauteilen/)) ist im Modul richtig umgesetzt. Schichtdicken PMBC 3 mm (W1-E/W4-E) bzw. 4 mm mit Einlage (W2.1-E), MDS 2 mm, Sockel 30 cm, Grenze W2.1/W2.2 bei 3 m, WU-Richtlinie: w/z ≤ 0,55, Mindestdicken Wand 24 cm/Sohle 25 cm, Entwurfsgrundsätze a/b/c: richtig.

**Befunde**
- **behoben – T8-AB-1:** Der Fugenband-Planer war als „Prüfbericht … nach DIN 18197“ beschriftet. Die Zuordnung der Bandbreite zum Wasserdruck (≤ 5/12 m bzw. ≤ 3/8 m) und die Größtkornprüfung (3 · GK) stehen so nicht in DIN 18197; die Norm bemisst über Diagramme aus Wasserdruck und Fugenverformung, für Arbeitsfugenbänder darf der Wasserdruck bei v_r = 0 erhöht werden ([Sika, Fugenband-Ratgeber](https://deu.sika.com/dam/dms/deaddconst01/i/Fugenband-Ratgeber-fuer-die-Praxis.pdf)). Beschriftung jetzt „Lehrprüfung … in Anlehnung an DIN 18197“, mit Hinweis auf die Lehrannahmen, die Regel d ≥ a und den Mindestabstand Fugenband–Bewehrung von 20 mm.
- **behoben – T8-AB-2:** „Wasserbeanspruchungsklasse (bis 2017-07 „Wassereinwirkungsklasse“)“ konnte als Datum der Umbenennung gelesen werden; umbenannt wurde mit der Ausgabe 2026-06. Jetzt „in der Ausgabe 2017-07 noch …“ (Fachtext und Lernziel; im zweiten Lernziel „Wassereinwirkungsklasse“ → „Wasserbeanspruchungsklasse“).
- **offen – Frage T8-AB-Q1:** Nach dem Sika-Ratgeber genügt für D 320 eine Bauteildicke von 30 cm; der Planer verlangt mit d ≥ a 32 cm. Ausnahme übernehmen oder Bandbreiten-Zuordnung ganz durch die Tabelle des Ratgebers (A/D 240 ≥ 24 cm, A/D 320 ≥ 30 cm, FM 400 ≥ 40 cm) ersetzen?
- **offen – Frage T8-AB-Q2:** FPD ist seit DIN 18533-3:2026-06 genormt. Der Text „bei W2.1-E … bauaufsichtlich zu belegen (abP)“ stammt aus der Zeit der Bauchemie-Richtlinie 2020. Ist das abP für FPD noch gefordert (F-Freigabe, Normtext Teil 3)?
- **offen – Frage T8-AB-Q3:** „Anforderungsklasse A/B/C“ im Berater vermischt die Nutzungsklassen A/B der WU-Richtlinie und die Raumnutzungsklassen RN1-E bis RN3-E der DIN 18533; „Klasse C“ gibt es in keiner der beiden. Umbenennen in „Nutzungsklasse A / B / ohne WU-Anforderung“? Außerdem: „WU-RL fordert min. 8–10 cm“ Überdeckung beim Injektionsschlauch – die WU-Richtlinie nennt dazu nach meinem Kenntnisstand keinen Wert (eher Herstellerangabe/DBV-Merkblatt). Formulierung ändern?

**F-Freigabe-Stellen:** FPD-Schichtdicken und Verwendbarkeitsnachweis nach DIN 18533-3:2026-06.

**Empfehlung:** freigabefähig nach Klärung von T8-AB-Q1 bis Q3.

- [ ] Modul freigeben

## 4. Dämmung (`bp_daemmung`)

**Prüfumfang:** `src/components/DaemmungBerater.tsx` (U-Wert, Einsparung, Mindestdicke, Feuchtebewertung), `content/bpdaemmung/BpDaemmung.json` (Stoffkatalog, Anlage 7, DIN 4108-10), Rechenbeispiel WDVS, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| DA1 | Beispiel: Putz 15/0,51 + KS 175/0,99 + EPS 160/0,035 + Putz 10/0,70 | R_T = 4,962; U = 0,2015; Dämmanteil 92 % | 0,20; „über 90 %“ |
| DA2 | Berater: Vollziegel 38 cm + EPS 14 cm (λ 0,032) | U_alt = 1,565; U_neu = 0,1994; ΔU·84 = 114,7 kWh/(m²a); CO₂ 25,2 kg/(m²a) | identisch |
| DA3 | Mindestdicke Holzfaser λ 0,040, U ≤ 0,24 | erf. R = 3,537 → 15 cm | identisch |
| DA4 | Kellerdecke Beton 20 cm, XPS, U ≤ 0,30, R_si = R_se = 0,17 | 11 cm, U = 0,280 | identisch |

**Normstand:** Höchstwerte nach Anlage 7 GModG (Außenwand 0,24; Steildach Nr. 5a/5b 0,24; Flachdach 5c 0,20; Wände/Decken gegen Erdreich und unbeheizt 6a/6b 0,30) bestätigt ([gesetze.legal, Anlage 7 GModG](https://gesetze.legal/bund/gmodg/anlage_7)). Kennwerte der Stoffnormen DIN EN 13162–13171, VIP-Bemessungswert 0,007–0,008, DIN 4108-10-Anwendungstypen: richtig.

**Befunde**
- **behoben – T8-DA-1:** Der Berater meldete für Perimeterdämmung „ausschließlich … XPS oder Schaumglas zulässig“. Auch EPS-Perimeterdämmplatten sind mit Bauartgenehmigung zulässig, in der Regel bei Bodenfeuchte (W1-E), z. B. [DIBt Z-23.33-2113](https://www.dibt.de/pdf_storage/2021/Z-23.33-2113(1.23.33-44!20).pdf). Text berichtigt (Warnung für Faserdämmstoffe und Standard-EPS bleibt).
- **behoben – T8-DA-2:** Die Warnung „diffusionsdichtes Material (wie XPS) unter Holzbalken-Kellerdecke“ wurde mit μ > 100 geprüft; XPS ist mit μ = 100 hinterlegt und löste die Warnung nie aus. Bedingung jetzt μ ≥ 100.
- **behoben – T8-DA-3:** Hanffaser mit Norm „DIN EN 13171“ (das ist die Norm für Holzfaserdämmstoffe). Jetzt „ETA bzw. abZ (keine harmonisierte Produktnorm)“.
- **behoben – T8-DA-4:** Baustroh „ETA-17/0559“ – die Bewertung heißt ETA-17/0247 (λ = 0,048 W/(mK) bei 23 °C/50 %, ρ = 100 ± 15 kg/m³, Klasse E, [DIBt](https://www.dibt.de/pdf_storage/2017/ETA-17!0247(8.12.01-5!14).pdf)); ergänzt um die abZ Z-23.11-1595 ([Baunetz Wissen](https://www.baunetzwissen.de/nachhaltig-bauen/fachwissen/baustoffe--teile/stroh-4712662)). Kennwerte im Modul passen.
- **behoben – T8-DA-5:** Beispiel „Anforderung Bestand (GEG Anlage 7)“ an die Benennung im Modul angeglichen („Anlage 7 GModG, vormals GEG“).
- **offen – Frage T8-DA-Q1:** Der CO₂-Faktor 0,22 kg/kWh („Gas/Öl-Mittel“) liegt unter den Emissionsfaktoren der Anlage 9 (Erdgas 0,240, Heizöl 0,310 kg/kWh). Zudem wird die Einsparung ΔU·84 kKh ohne Anlagenaufwand und ohne Temperatur-Korrekturfaktor (Kellerdecke gegen unbeheizt) gerechnet. Faktor auf 0,24 (Erdgas) setzen und Kellerdecke mit F_x ≈ 0,5 abmindern? (vorläufig, F-Freigabe)
- **offen – Frage T8-DA-Q2:** Quizfrage `q_daemm_1` (freigegeben): Die Lernhilfe („coreRule“) sagt „im Erdreich … darf nur XPS oder Schaumglas eingesetzt werden“. Das widerspricht jetzt T8-DA-1. Die Frage selbst bleibt richtig; deshalb nicht geändert. Soll die Lernhilfe angepasst werden (Freigabe ginge verloren)?
- Hinweis: Blähperlit als Schüttung fällt unter DIN EN 14316-1 (DIN EN 13169 gilt für Platten).

**F-Freigabe-Stellen:** CO₂-Faktor und Einsparansatz (T8-DA-Q1).

**Empfehlung:** freigabefähig nach Klärung von T8-DA-Q1 und Q2.

- [ ] Modul freigeben

## 5. Befestigung (`bp_befestigung`)

**Prüfumfang:** `content/bpbefestigung/BpBefestigung.json` (Katalog, Versagensarten, Beispiel Betonausbruch), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| BF1 | C25/30 gerissen, h_ef = 80 mm, k₁ = 7,7 | N⁰_Rk,c = 27,55 kN; N_Rd,c = 18,37 kN (γ_Mc = 1,5) | 27,5; 18,4 |
| BF2 | ungerissen, k₁ = 11,0 | 39,35 kN | – |
| BF3 | h_ef × 1,5 | Faktor 1,837 („+84 %“) | richtig |
| BF4 | C30/37, h_ef = 110 mm, gerissen | 48,66 kN | – |

**Fakten-Stichprobe:** k_cr,N = 7,7 und k_ucr,N = 11,0, Ausbruchkegel ca. 35°, EAD 330232 (mechanische Dübel) und EAD 330499 (Verbunddübel), Drehmomentanzug, Seismik C1/C2: richtig.

**Befunde**
- **behoben – T8-BF-1:** „fünf physische Versagensgrenzen unter Zuglast“ mit Pry-out als Nr. 5 – Pry-out ist eine Versagensart unter Querlast (so auch die Quizfrage qn_bp_befestigung_2). Einleitung, Nr. 4 („Spalten des Betons“) und Nr. 5 (Betonausbruch auf der lastabgewandten Seite) berichtigt.
- **behoben – T8-BF-2:** Schreibfehler „Kunststoffschandlung“ → „Versagen der Kunststoffhülse“.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 6. Klebstoffe (`bp_klebstoffe`)

**Prüfumfang:** `content/bpklebstoffe/BpKlebstoffe.json` (Produktkatalog, Adhäsion/Kohäsion, Normklassen, Beispiel Fugenbreite), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| KL1 | Fertigteil 6 m, α = 10·10⁻⁶/K, ΔT = 80 K, ZGV 25 % | Δl = 4,8 mm; b = 19,2 mm → 20 mm | identisch |
| KL2 | 3,5 m | 11,2 mm | – |
| KL3 | 6 m, ZGV 20 % | 24 mm | – |

**Fakten-Stichprobe:** C2 ≥ 1,0 N/mm², S1 2,5–5 mm (DIN EN 12004), D3/D4 (DIN EN 204), Dichtstoffe DIN EN 15651-1/-3/-4, DIN EN 1504-4 für strukturelles Kleben: richtig.

**Befunde**
- **behoben – T8-KL-1:** Schreibfehler „Dreipunfthaftung“ → „Dreiflankenhaftung“ (wie Lernziel).
- **behoben – T8-KL-2:** „neutralvernetzende Silikone setzen unbedenkliche Alkohole frei“ gilt nur für Alkoxy-Systeme; Oxim-Systeme spalten Oxim ab und sind für Kupfer/Messing ungeeignet. Berichtigt.
- **behoben – T8-KL-3:** „Holzklebemörtel nach DIN EN 204“ → „Holzklebstoff“.
- **behoben – T8-KL-4:** DIN EN 15651-4 (Typ PW) gilt für Fugen in Fußgängerwegen, nicht für befahrene Flächen. Text berichtigt.
- **offen – Frage T8-KL-Q1:** Das Lernziel „Fugentiefe und Durchmesser der Hinterfüllschnur festlegen“ wird im Modul nicht behandelt (keine Regel zum Breiten-Tiefen-Verhältnis). Inhalt ergänzen (z. B. nach IVD-Merkblatt) oder Lernziel streichen?

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig nach Klärung von T8-KL-Q1.

- [ ] Modul freigeben

## 7. Farben und Lacke (`bp_farben_lacke`)

**Prüfumfang:** `src/modules/BpFarbenLacke.tsx` und `src/modules/bpfarbenlacke/*` (Mengenschätzer, OS-Konfigurator), `content/bpfarbenlacke/*.json` (Bindemittel, Filmchemie, Decopaint, GISCODE, OS-Systeme), Kurzfassung, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| FL1 | DFT 40 µm, VS 45 %, 5 % Verdünnung, 20 % Verlust, 120 m², 2 Anstriche | WFT 88,9 µm (verdünnt 93,3); 11,25 m²/l; 111,1 ml/m²; 26,7 l | identisch |
| FL2 | OS-4-Beispiel 80 µm, VS 40 %, 20 % | WFT 200 µm; 0,20 l/m²; mit Verlust 0,25 l/m² | Beispiel vorher 0,24 (T8-FL-5) |
| FL3 | EP 250 µm, VS 100 %, 10 %, 50 m² | 13,9 l | identisch |

**Normstand / Fakten:** Decopaint 2004/42/EG, Anhang II A Phase II: a) 30/30, b) 100/100, c) 40/430, d) 130/300, i) 140/500, j) 140/500 g/l – richtig. OS-Zuordnung nach TR Instandhaltung (OS 2 = OS B, OS 4 = OS C, OS 5a/b = OS DII/DI, OS 11a/b), OS 4 ≥ 80 µm und s_d,CO₂ ≥ 50 m, Haftzug 1,5 N/mm², Betonfeuchte < 4 %, Taupunktabstand 3 K: richtig.

**Befunde**
- **behoben – T8-FL-1:** Matt-Definition „Glanz < 25@85°“: Die Decopaint-Richtlinie misst bei 60° („< 25@60°“).
- **behoben – T8-FL-2:** „Gravotrope Störreaktion“ (kein Fachbegriff) → „Nebenreaktion mit Wasser“ (Isocyanat + H₂O → Amin + CO₂).
- **behoben – T8-FL-3:** „cycloaliphatische Diisocyanate wie HDI oder IPDI“: HDI ist aliphatisch, IPDI cycloaliphatisch. Außerdem „säurehaltige Härtungsbeschleuniger (tertiäre Amine …)“ – tertiäre Amine sind Basen; berichtigt.
- **behoben – T8-FL-4:** OS 4 „starr, keine Rissüberbrückung“, aber Schichtaufbau „mit elastischem Reinacrylat“ – Widerspruch beseitigt („Reinacrylat“).
- **behoben – T8-FL-5:** Das Rechenbeispiel rechnete den Verlust als ×1,2 (0,24 l/m²), der Rechner als V/(1 − 0,20) (0,25 l/m²). Beispiel an den Rechner angeglichen.
- Hinweis: Die GISCODE-Zuordnungen (BSW10/20/40/60, BSL20/25, RE30) wurden nicht einzeln gegen die GISBAU-Liste geprüft.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 8. Betonzusatzmittel (`bp_betonzusatzmittel`)

**Prüfumfang:** `src/modules/BpBetonzusatzmittel.tsx` (w/z-Anrechner), `content/bpbetonzusatzmittel/BpBetonzusatzmittel.json` (Wirkungsgruppen, Wirkmechanismen, Grenzen), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| BZ1 | Standard: z = 320, 1,2 %, ρ = 1,12, 65 % Wasser, w = 145 | 3,84 kg; 3,43 l > 3 l; 2,50 l angerechnet; w/z 0,453 → 0,461 | identisch |
| BZ2 | Beispiel: z = 340, 1,5 %, ρ = 1,05, 70 %, w = 160 | 5,1 kg; 4,86 l; 3,57 l; w/z 0,471 → 0,481 | identisch |
| BZ3 | Grenzfall z = 280, 1,1 %, ρ = 1,05 | 2,93 l ≤ 3 l → keine Anrechnung; 0,536 | identisch |

**Fakten-Stichprobe:** Höchstmenge 50 g/kg Zement (5 M.-%), Untergrenze 2 g/kg nur in Zugabewasser gelöst, Wasseranrechnung > 3 l/m³ (DIN EN 206), Wirkungsgruppen und Tabellen der DIN EN 934-2 (BV Tab. 2, FM Tab. 3.1/3.2, ST 4, LP 5, SB 6, BE 7, VZ 8, DM 9), LP: Abstandsfaktor ≤ 0,20 mm und L₃₀₀ ≥ 1,5 %: richtig.

**Befunde**
- **behoben – T8-BZ-1:** „Mindestlimit < 0,2 M.-% (Vorwaschung erforderlich …)“ → „nur in einem Teil des Zugabewassers gelöst zugeben (DIN EN 206)“.
- **behoben – T8-BZ-2:** Schreibfehler und unklare Begriffe: „Aditivvolumen“, „Zubehörtes Volumen“, „DBC-Regel“ (die Regel stammt aus DIN EN 206), „katalytischer Lochfraß“ (→ chloridinduzierter Lochfraß und Spannungsrisskorrosion), „dringend unaufgefordert“.
- **offen – Frage T8-BZ-Q1:** Über 5 M.-% verlangt das Modul „zwingend eine abZ vom DIBt“. DIN EN 206 lässt höhere Mengen zu, wenn der Einfluss auf Leistung und Dauerhaftigkeit nachgewiesen ist; DIN 1045-2 regelt nach meinem Kenntnisstand eigene Höchstwerte (u. a. für hochfesten Beton). Formulierung auf „Nachweis nach DIN EN 206/DIN 1045-2“ ändern? (F-Freigabe, Normtext)

**F-Freigabe-Stellen:** Höchstdosierung nach DIN 1045-2:2023-08, 5.2.6 (T8-BZ-Q1); Chloridgrenze 0,10 M.-% für Zusatzmittel in Spannbeton.

**Empfehlung:** freigabefähig nach Klärung von T8-BZ-Q1.

- [ ] Modul freigeben

## 9. Holzprodukte – Rest (`bp_holzprodukte`)

**Prüfumfang:** Produktdaten (KVH, BSH, CLT, LVL), Normenliste, Formeln; der Einfeldbalken wurde in Tranche 2 geprüft (T2-H-1 behoben).

**Nachrechnungen:** W(10/20) = 666,7 cm³; Eigenlast 0,082 kN/m (ρ = 420 kg/m³); k_cr = 0,50 (C24) und 0,71 (GL24h) – identisch mit Beispiel und Erkundungsauftrag.

**Fakten-Stichprobe:** C24 f_m,k 24 / f_v,k 4,0 / E 11 000 / ρ_mean 420 (DIN EN 338), GL24h f_v,k 3,5 / E 11 500 (DIN EN 14080), LVL f_m 44 / E 13 800, KVH-Holzfeuchte 15 ± 3 %, DIN EN 16351:2025-07, 2. Generation DIN EN 1995-1-1:2026-09 erschienen ([Austrian Standards](https://www.austrian-standards.at/en/shop/din-en-1995-1-1-2026-09~p5057531)): richtig.

**Befunde**
- **behoben – T8-HO-1:** Formelerläuterung „Grenzwerte L/300 bis L/500 als Empfehlungen (NA)“: Die Spanne ist die Empfehlung der EN (Tab. 7.2), der NA (DE) setzt w_inst ≤ l/300 an (so auch Rechner und Beispiel). Berichtigt.
- Hinweis: Das Lernziel „baulicher Holzschutz nach DIN 68800 erläutern“ wird im Modul nur gestreift (Verweis auf den Lehrpfad Dauerhaftigkeit).

**F-Freigabe-Stellen:** wie Tranche 2 (Durchbiegungsgrenzen nach NA).

**Empfehlung:** freigabefähig (zusammen mit Tranche 2).

- [ ] Modul freigeben

## 10. Kunststoffe (`bp_kunststoffe`)

**Prüfumfang:** `src/modules/BpKunststoffe.tsx` (Burgers-Simulator, Längenänderungsrechner), `content/bpkunststoffe/BpKunststoffe.json`, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| KS1 | Beispiel σ₀ = 5, E₁ = 1 000, E₂ = 2 000, η₁ = 5·10⁶, η₂ = 10⁵, t = 1 000 h | 0,50 + 0,10 + 0,25 = 0,85 %; E_c = 588 N/mm² (59 %) | identisch |
| KS2 | PE-HD (Moduldaten), σ₀ = 5, t = 100 h | 0,500 + 1,429 + 0,714 = 2,643 % | identisch |
| KS3 | ΔL PE-HD α = 200·10⁻⁶, 6 m, 50 K | 60 mm (Stahl 3,6, Beton 3,0) | identisch |

**Fakten-Stichprobe:** α PE 150–200 und PVC-U 70–80·10⁻⁶/K, PMMA τ ≈ 92 %, ETFE-Kissen ≈ 300 Pa, DIN 18531-1:2025-08 ([Bauprofessor 01.08.2025](https://www.bauprofessor.de/news/neue-normen-reihe-din-18531/)): richtig. Die Ausgabe „Flachdachrichtlinie Januar 2026“ ließ sich nicht öffentlich bestätigen.

**Befunde**
- **behoben – T8-KS-1:** Schreibfehler bzw. unklare Begriffe: „Strahlungungsabbau“, „Ausflussspannungswiderstand“, „Polymerohne verbleibende Abgase“, „Präzipitierter Kautschuk“ (EPDM), „unbdingt“, „Flurierte“.
- **behoben – T8-KS-2:** „im Gegensatz zu ideal-elastischen mineralischen Baustoffen (Zementstein, Stahl)“ – Zementstein kriecht, Stahl ist kein mineralischer Baustoff. Berichtigt.

**F-Freigabe-Stellen:** keine (Burgers-Parameter als Lehrwerte gekennzeichnet).

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 11. Mineralisch (`bp_mineralisch`)

**Prüfumfang:** `src/modules/BpMineralisch.tsx` (Kennwertdatenblatt, Nasslastrechner), `content/bpmineralisch/BpMineralisch.json`, Lernziele.

**Nachrechnungen:** Steingut 20 m², 8 mm, ρ = 1 900, 15 %: 304 → 349,6 kg; Feinsteinzeug ρ = 2 400, 0,5 %: 384 → 385,9 kg; Granit 30 mm: 1 650 → 1 655 kg – identisch mit Beispiel und Kern.

**Fakten-Stichprobe:** ESG f_k = 120 N/mm² (DIN EN 12150), ESG-H für Fassaden, VSG-Pflicht für Überkopf (DIN 18008-2), Feinsteinzeug E ≤ 0,5 % (DIN EN 14411), Eisvolumen +9 %: richtig.

**Befunde**
- **behoben – T8-MI-1:** „Wärmeleitgefühlt λ“ → „Wärmeleitfähigkeit λ“; PVB-Folie „0,76–1,52 mmstärke“ → „0,38–1,52 mm, bei Absturzsicherung meist ≥ 0,76 mm“ (wie im Modul Gläser).

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 12. Gläser (`bp_glaeser`)

**Prüfumfang:** U_w-Rechner (Kern `src/calc/fenster.ts`, in Tranche 3 geprüft), Bemessungsfestigkeit, Gasfüllungen, Beschichtungen, Normen; Grenzen `bp_glaeser`, Erkundungsaufträge, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| GL1 | Standard 1,23 × 1,48 m, 110 mm, U_g 0,6, U_f 1,1, Ψ 0,038, g 0,53, 450 W/m² | A_g = 1,273; A_f = 0,548; l_g = 4,54 m; U_w = 0,845; 303,5 W | identisch |
| GL2 | Alu-Abstandhalter, U_g 1,1, U_f 1,3 | U_w = 1,360 | identisch |
| GL3 | f_g,d Float/TVG/ESG (k_mod 0,7, k_c 1,8, γ_M 1,8 bzw. 1,5) | 31,5 / 46,7 / 80 N/mm²; ESG/Float 2,54 | identisch |
| GL4 | Gasverlust 1 %/a | nach 25 a 77,8 %, nach 30 a 74,0 % („rund 75 %“) | richtig |
| Erkundung | Alu 0,95; 0,6 × 0,6 m 1,06; Rahmen 60 mm 0,79 und 360 W | identisch |

**Befunde**
- **behoben – T8-GL-1:** „Widerstandsklassen RC 1 N bis RC 4“ – DIN EN 1627 reicht bis RC 6. Berichtigt.
- **behoben – T8-GL-2:** Lernziel und Erkundungsauftrag sprachen von „GEG-Konformität“ bzw. „GEG-Höchstwert“; an die Benennung im Modul angeglichen (Anlage 7 GModG, vormals GEG).
- **offen – Frage T8-GL-Q1:** „Hohe Primärenergie bei Neualuminium (~14 kWh/kg)“: 14–15 kWh/kg ist etwa der Strombedarf der Elektrolyse; die Primärenergie von Primäraluminium liegt nach meinem Kenntnisstand deutlich höher. Wert mit EPD-/ÖKOBAUDAT-Quelle belegen oder als „Strombedarf der Elektrolyse“ bezeichnen?

**F-Freigabe-Stellen:** Ψ-Werte (Lehrwerte, bereits in den Grenzen).

**Empfehlung:** freigabefähig nach Klärung von T8-GL-Q1.

- [ ] Modul freigeben

## 13. Lehmbauprodukte (`bp_lehmbauprodukte`)

**Prüfumfang:** `src/modules/BpLehmbauprodukte.tsx` (Tragfähigkeitsrechner), `content/bplehmbauprodukte/BpLehmbauprodukte.json` (Normen DIN 18940, 18945–18948, Feuchteschutz), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| LE1 | h = 2,75 m, t = 30 cm, Klasse 2 (f_k 0,9), Deckeneinspannung | λ = 6,88; Φ = 0,780; N_Rd = 105,3 kN/m | identisch |
| LE2 | t = 24 cm, Klasse 4 (f_k 1,6), β = 1,0 | λ = 11,46; Φ = 0,656; N_Rd = 126,0 kN/m | identisch |
| LE3 | h = 3,0 m, t = 11,5 cm, β = 1,0 | λ = 26,1 > 21 → Φ = 0, nicht erfüllt | identisch |

**Befunde**
- **behoben – T8-LE-1:** Die Auswahl „Nein (frei/auskragend, β = 1,0)“ war falsch: Eine frei auskragende Wand hat β = 2,0; β = 1,0 gilt für eine oben und unten gelenkig gehaltene Wand, β = 0,75 für Einspannung durch Massivdecken. Frage und Optionen umbenannt, Rechenweg ergänzt („frei auskragend wird nicht abgebildet“). Die Rechnung ist unverändert.
- **offen – Frage T8-LE-Q1 (F-Freigabe):** Der Rechenansatz ist nicht öffentlich belegt: f_k-Rechenwerte je Steinklasse (0,9–2,2 N/mm²), γ_M = 2,0, λ ≤ 21 und Φ = 0,85·(1 − (λ/24)²). Werte nach DIN 18940:2023-06 bestätigen oder den Rechner deutlicher als „Lehrmodell, nicht DIN 18940“ kennzeichnen?
- **offen – Frage T8-LE-Q2 (F-Freigabe):** Produktnorm-Angaben prüfen: Lehmputz-Festigkeitsklassen S I/S II (Biegezug 0,3/0,4 N/mm²?), Lehmplatten „LPL1–LPL3“, Lehmmauermörtel „M 2,5“, Sockelhöhe „min. 30 cm (DIN 18940/WTA)“ – ein Herstellerblatt nennt nach DIN 18940 eine Kimmschicht ≥ 5 cm über OKF als Havarieschutz ([conluto](https://www.baustoffshop.de/media/pdf/conluto/conluto_Lehmstein-Mauerwerk-Arbeitsblatt.pdf)).

**F-Freigabe-Stellen:** DIN 18940:2023-06 (Bemessungsansatz), DIN 18946/18947/18948:2024-03 (Klassen).

**Empfehlung:** nach Klärung von T8-LE-Q1 und Q2 (die Rechnung ist in sich richtig, der Ansatz aber nicht belegt).

- [ ] Modul freigeben

## 14. Metallisch (`bp_metallisch`)

**Prüfumfang:** `src/modules/BpMetallisch.tsx` (Kontaktkorrosion, Gewichtsrechner), `content/bpmetallisch/BpMetallisch.json` (Werkstoffdaten), Beispiel Titanzink, Lernziele.

**Nachrechnungen:** Titanzinkbahn 10 × 0,5 m, 0,7 mm, ρ = 7 200: 25,2 kg, G_k = 0,247 kN, g_k = 0,049 kN/m², ΔL = 22 mm bei 100 K; Stahlblech 3 × 1,25 m × 2 mm: 58,9 kg; ΔU Zink/Kupfer 1,10 V – identisch.

**Fakten-Stichprobe:** α Titanzink 22·10⁻⁶/K (DIN EN 988), Titan 8,6·10⁻⁶/K, A4 = 1.4404 mit 2–2,5 % Mo, CRC-System (DIN EN 1993-1-4/NA), Cortenstahl Cu 0,25–0,55 %, DASt-Ri 007, Sphäroguss D400–F900: richtig.

**Befunde**
- **behoben – T8-ME-1:** Zinkabtrag „C1 bis C4: 0,2–2 µm/Jahr“ – nach DIN EN ISO 9223 reicht C4 bis 4,2 µm/a (C1 ≤ 0,1; C3 0,7–2,1). Berichtigt.
- **behoben – T8-ME-2:** Kupfer mit Norm „DIN EN 1993“ (Stahlbau) – entfernt.
- **offen – Frage T8-ME-Q1:** Die abZ Z-30.3-6 (nichtrostende Stähle) wird neben DIN EN 1993-1-4 als geltend genannt. Ist sie noch gültig oder durch den NA zu DIN EN 1993-1-4 abgelöst?

**F-Freigabe-Stellen:** keine (Potentiale und 150-mV-Schwelle als Lehrannahme gekennzeichnet).

**Empfehlung:** freigabefähig nach Klärung von T8-ME-Q1.

- [ ] Modul freigeben

## 15. Stahlbauprofile (`bp_stahlbauprofile`)

**Prüfumfang:** `src/modules/BpStahlbauprofile.tsx` (Profiltabellen IPE, HEA, HEB, HEM, UPN; Randspannung), Beispiel IPE 300, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| ST1 | IPE 300, L = 6 m, q_d = 10, q_k = 7 kN/m | M = 45 kNm; σ = 80,8 N/mm² (34 %); w = 6,73 mm ≤ 20 mm | identisch |
| ST2 | Standard: IPE 300, N = 150 kN, M = 45 kNm, S355 | σ_N = 27,9; σ_M = 80,8; η = 30,6 % | identisch |
| Tabellen | 86 Profile: A und I_y gegen Blechgeometrie, W = 2I/h bzw. 2I/b, i = √(I/A) | 83 Profile konsistent | – |

**Befunde**
- **behoben – T8-ST-1:** HEM 400, 500 und 600 hatten falsche Werte (z. B. HEM 500 mit h = 534 statt 524 mm, A = 307 statt 344 cm², HEM 400 mit A = 285 statt 326 cm², i_y = 19,1 statt 17,9 cm). Die Zeilen und die leicht abweichende Zeile HEM 280 sind nach dem [British-Steel-Datenblatt HE (07/2026)](https://www.britishsteel.co.uk/wp-content/uploads/2026/07/HE-datasheet-21.07.26.pdf) berichtigt; Abmessungen bestätigt durch [wermac.org](https://www.wermac.org/steel/dim_hem.html) und [beamdimensions.com](https://beamdimensions.com/database/European/Steel/Wide_flange_HE_HL_beams/HE_500_M).
- Hinweis: Die anderen Reihen weichen höchstens im Rundungsbereich von den Herstellertabellen ab (z. B. HEB 160 I_z 882 statt 889 cm⁴).

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig nach Korrektur T8-ST-1.

- [ ] Modul freigeben

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage |
|---|---|---|
| T8-TB-Q1 | Trockenbau | Bedarfs-Richtwerte (Spachtel 0,45 kg je Lage und Seite, Schrauben, Dichtband) auf eine Systemangabe umstellen und belegen? |
| T8-AB-Q1 | Abdichtung | Fugenband: Bandbreiten-/Dickenzuordnung nach Sika-Ratgeber übernehmen (D 320 ≥ 30 cm)? |
| T8-AB-Q2 | Abdichtung | FPD nach DIN 18533-3:2026-06: abP bei W2.1-E noch gefordert? |
| T8-AB-Q3 | Abdichtung | „Anforderungsklasse A/B/C“ und „WU-RL fordert 8–10 cm“ umformulieren? |
| T8-DA-Q1 | Dämmung | CO₂-Faktor 0,22 → 0,24 (Erdgas, Anlage 9) und Kellerdecke mit F_x abmindern? |
| T8-DA-Q2 | Dämmung | Lernhilfe der freigegebenen Quizfrage q_daemm_1 („nur XPS oder Schaumglas“) anpassen? |
| T8-KL-Q1 | Klebstoffe | Lernziel Fugentiefe/Hinterfüllschnur: Inhalt ergänzen oder Lernziel streichen? |
| T8-BZ-Q1 | Betonzusatzmittel | > 5 M.-%: „abZ zwingend“ durch Nachweis nach DIN EN 206/DIN 1045-2 ersetzen? |
| T8-GL-Q1 | Gläser | „Primärenergie Neualuminium ~14 kWh/kg“ belegen oder als Elektrolyse-Strombedarf bezeichnen? |
| T8-LE-Q1 | Lehmbau | Rechenansatz (f_k, γ_M = 2,0, λ ≤ 21, Φ) nach DIN 18940 bestätigen oder als Lehrmodell kennzeichnen? |
| T8-LE-Q2 | Lehmbau | Klassen DIN 18946–18948 und Sockelhöhe 30 cm prüfen |
| T8-ME-Q1 | Metallisch | Gilt die abZ Z-30.3-6 noch? |

**Nebenbefund außerhalb der Tranche:** In `src/data/erkundung.ts` steht unter `bp_verkehr_pruefung` ein Erkundungsauftrag zum Faserwinkel bei C24 (Holz) – vermutlich falsch zugeordnet. Nicht geändert.

## Nachweis der Prüfung

- Unabhängige Nachrechnung: eigenes Skript (Python) mit eigener Umsetzung, Vergleich gegen den neuen Kern `src/calc/bauprodukte.ts`, den Kern `src/calc/fenster.ts`, die Rechenbeispiele, Erkundungsaufträge und Tabellendaten (94 Einzelwerte und 86 Profilzeilen; 70 Vergleiche und ein Fuzz-Test im Regressionstest). Sollwerte in `tests/modulpruefungTranche8.test.ts`.
- Öffentliche Quellen dieser Prüfung (zusätzlich zu den oben verlinkten): [Bauprofessor, DIN 18533-1 Änderungen](https://www.bauprofessor.de/din18533-1-abdichtung-von-erdberuehrten-bauteilen-die-wichtigsten-aenderungen/); [derdichtebau.de, Normenartikel DIN 18533](https://www.derdichtebau.de/fileadmin/Dokumente/Downloads/260428-DDB-2503-6068-DIN-18533-Normenartikel.pdf); [gesetze.legal, Anlage 7 GModG](https://gesetze.legal/bund/gmodg/anlage_7).

## Umsetzung 29.10.2026

Entscheidungen vom 28.10.2026 (nachts); Regressionstest `tests/modulpruefungTranche8.test.ts`.

- **T8-TB-Q1 (Trockenbau):** Bedarfswerte des Materialrechners (CW, Schrauben, Dichtband, Spachtel 0,45 kg je m², Lage und Seite) als Herstellerrichtwerte gekennzeichnet (Text des Rechners und Kern `trockenbauBedarf`); Werte unverändert, maßgebend sind die Bedarfsangaben des gewählten Systems.
- **T8-AB-Q1 (Abdichtung):** Fugenband D 320: Mindestbauteildicke 30 cm nach Herstellerangabe (Sika, „Fugenband-Ratgeber für die Praxis“, im Modul und in der Literatur genannt); sonst weiter d ≥ a. Kern `fugenbandPruefung` liefert `dickeMinCm`; Test: D 320 bei 30 cm erfüllt, bei 29 cm nicht. A 320 (im Ratgeber ebenfalls ≥ 30 cm) ist nicht Teil der Entscheidung und bleibt bei d ≥ a.
- **T8-AB-Q2 (Abdichtung, Normtext):** abP für FPD bei W2.1-E als „vorläufig, F-Freigabe“ (DIN 18533-3:2026-06) gekennzeichnet; Inhalt unverändert.
- **T8-AB-Q3 (Abdichtung):** „Anforderungsklasse A/B/C“ → Nutzungsklasse A/B nach WU-Richtlinie bzw. „ohne WU-Anforderung“, Beanspruchungsklasse im Einleitungstext genannt; „WU-RL fordert min. 8–10 cm“ → „Überdeckung nach Herstellerangabe (häufig 8–10 cm)“.
- **T8-BZ-Q1 (Betonzusatzmittel):** „abZ vom DIBt zwingend“ → Nachweis nach DIN EN 206/DIN 1045-2; Höchstdosierung nach DIN 1045-2:2023-08, 5.2.6 als „vorläufig, F-Freigabe“.
- **T8-KL-Q1 (Klebstoffe):** Rechenbeispiel um Schritt 4 „Fugentiefe und Hinterfüllschnur“ ergänzt: b = 20 mm → t = 12 ± 2 mm, Rundschnur ≈ 1,25·b = 25 mm; Richtwerttabelle DIN 18540, Tab. 2 (b = 10/15/20/25/30 mm → t = 8/10/12/15/15 mm) als „vorläufig, F-Freigabe am Normtext“; Lernziel bleibt.
- **T8-ME-Q1 (Metallisch):** Regelwerksangabe „Z-30.3-6 (Stand der Zulassung prüfen)“.
- **T8-LE-Q1 (Lehmbau):** Rechner als „Lehrmodell, nicht DIN 18940“ gekennzeichnet (Reitername, Überschrift, f_k-Angabe, Rechenweg-Quelle); f_k, γ_M = 2,0, λ ≤ 21 und Φ bleiben als Lehrannahmen, Normwerte vorläufig, F-Freigabe.
- **T8-LE-Q2 (Lehmbau, Normtext):** S I/S II mit Biegezug 0,3/0,4 N/mm², LPL1–LPL3, M 2,5 und Sockelhöhe 30 cm als „vorläufig, F-Freigabe am Normtext“ gekennzeichnet; Inhalt unverändert.
