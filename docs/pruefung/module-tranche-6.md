# Modulprüfung Tranche 6 – Holz, Kunststoffe, Dämm- und Ausbaustoffe (Befundliste zur Freigabe)

**Stand:** 28.10.2026 (Branch `pruefung/module-tranche6-10-28`, Basis origin/main b2cb8367)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke und **keine** Quizfragen geändert; keine Quizfrage wird durch die Korrekturen falsch (Abgleich aller 68 Fragen der elf Module).

## Vorgehen

- **Auswahl (11 Module):** `holz`, `holzwerkstoffe`, `nawaro`, `kunststoffe`, `membranen_etfe`, `daemmstoffe`, `ausbau`, `kombinationen`, `materialitaet_architektur`, `sonstiges`, `innenausbau`. Keines der Module ist vom Aufteilen langer Module betroffen (alle unter 2 400 Wörter Fachtext).
- **Prüfumfang je Modul** wie Tranche 1 bis 3:
  - Rechnende Module: Rechenkern bzw. Inline-Rechnung und Beispiele, mindestens drei eigene Nachrechnungen. Eigenes Python-Skript, eigene Umsetzung der Gleichungen, keine Übernahme von Testwerten. Die Gleichgewichtsfeuchte wurde über die Fahrenheit-Fassung der Hailwood-Horrobin-Gleichung (Wood Handbook) gerechnet, also auf anderem Weg als im Kern (metrische Koeffizienten).
  - Fachtext (`content/*.json`) mit Normstand (Ausgaben Oktober 2026, NA DE), Grenzen (`src/data/rechnerGrenzen.ts`), Beispiele, Lernziele (`src/data/lernziele.ts`; eine Kurzfassung gibt es für diese Module nicht), Quellen und Stellen „vorläufig, F-Freigabe“.
  - Module ohne eigenen Rechner: Nachrechnung der Anwendungsbeispiele und Stichprobe von Fachaussagen gegen öffentliche Quellen.
- **Ergebnis der Nachrechnung:** 81 Einzelwerte, alle ohne Abweichung (Toleranz 0,5 %). Die Sollwerte der Kerne stehen als Regressionstest in `tests/modulpruefungTranche6.test.ts` (Holzphysik, Holzbau-Bemessungswerte, Kunststoff-Lehrmodell, Kesselformel, s_d-Regel).
- **Grenze der Stichprobe:** Das Suchkontingent der Websuche war während der Prüfung erschöpft. Aussagen ohne verlinkte Quelle in den Tabellen sind gegen Fachliteratur geprüft (Lehrbuch- bzw. Tabellenwerte), aber nicht durch eine öffentlich abrufbare Seite belegt. Sie sind mit „Lit.“ gekennzeichnet.
- Normtexte wurden nicht abgeschrieben. Wo der Normtext zur Bestätigung nötig ist, steht die Stelle unter „F-Freigabe“.

## Übersicht

| Nr. | Modul | Prüfvermerk-ID | Rechnung | Empfehlung |
|---|---|---|---|---|
| 1 | Holz | `holz` | `src/calc/holzphysik.ts`, `src/calc/holzbau.ts` | freigabefähig nach Klärung von T6-HO-1 |
| 2 | Holzwerkstoffe | `holzwerkstoffe` | Beispiel k_def | freigabefähig |
| 3 | Biogene Baustoffe (NaWaRo) | `nawaro` | Beispiel DIN EN 16449, Navigator (Inline) | freigabefähig nach Korrektur T6-NA-1/-2 |
| 4 | Kunststoffe | `kunststoffe` | `src/calc/werkstoffmodelle.ts` (Lehrmodell) | freigabefähig nach Klärung von T6-KU-1 |
| 5 | Membranen & ETFE | `membranen_etfe` | `src/calc/membran.ts` | freigabefähig nach Klärung von T6-ME-1 |
| 6 | Dämmstoffe | `daemmstoffe` | Beispiel Dämmstoffdicke | freigabefähig (Hinweis T6-DA-1) |
| 7 | Ausbau & Abdichtung | `ausbau` | Beispiel Estrichfeld | freigabefähig nach Korrektur T6-AU-1/-2 und Klärung von T6-AU-3 |
| 8 | Werkstoff-Kombinationen | `kombinationen` | Inline (`Kombinationen.tsx`), `sdRegel` aus `src/calc/glaser.ts` | freigabefähig nach Korrektur T6-KO-1 bis -3 und Klärung von T6-KO-4/-5 |
| 9 | Materialität (Architektur) | `materialitaet_architektur` | Beispiel Kontakttemperatur | freigabefähig nach Korrektur T6-MA-1 |
| 10 | Sonstige & Innovationen | `sonstiges` | Beispiel PCM | freigabefähig nach Korrektur T6-SO-1 |
| 11 | Innenausbau | `innenausbau` | Belegreife-Prüfer (Inline), Beispiel f₀ | freigabefähig nach Korrektur T6-IA-1/-2 und Klärung von T6-IA-3/-4 |

**Behobene Fehler (dieser PR):**
- **T6-KO-1:** Kombinationen nannte noch das GEG; der U-Wert-Vergleich hieß „GEG-Mindestwert“, obwohl 0,24 W/(m²K) der Höchstwert nach Anlage 7 (Änderung bestehender Gebäude) ist. Jetzt GModG mit Anlage 7.
- **T6-KO-2:** Der Schichtrechner versprach eine „Glaser-Feuchteüberprüfung“, rechnet aber nur die vereinfachte s_d-Regel. Die Meldung „äußere Schichten diffusionsdichter als innere“ passte nicht zu allen Auslösefällen der Regel. Beides ist neu formuliert.
- **T6-KO-3:** WDVS-Normbezug ETAG 004 durch EAD 040083-00-0404 ersetzt.
- **T6-IA-1:** W2-I nannte gewerbliche Küchen; diese gehören zu W3-I. Dazu kommt: In W2-I sind keine feuchteempfindlichen Untergründe zulässig.
- **T6-IA-2 / T6-AU-1:** GModG statt GEG; Calciumsulfatestrich im Modul Ausbau wie im Innenausbau nur W0-I/W1-I (vorher pauschal „nicht für Nassräume“).
- **T6-AU-2:** Gruppengrenzen der Fliesen nach DIN EN 14411 (≤ 0,5 %, 0,5 < E ≤ 3 %, > 10 %).
- **T6-MA-1:** Architekten von Kapelle der Versöhnung, Alnatura-Campus und Centre Pompidou-Metz (vorher Anna Heringer bzw. Frei Otto).
- **T6-SO-1:** Reaktionsgleichung der Photokatalyse war nicht ausgeglichen (H-Bilanz). Jetzt: Hydroxyl- und Superoxidpfad getrennt.
- **T6-NA-1:** PENRT-Zeile „~15 MJ/kg (biogen)“ widersprach sich (PENRT ist nicht erneuerbar). **T6-NA-2:** Der Navigator wertete Holzfaser (μ 3–5) als „höherer Diffusionswiderstand“, weil die Schwelle μ < 5 statt μ ≤ 5 war.

---

## 1. Holz (`holz`)

**Prüfumfang:** `src/modules/Holz.tsx` (Reiter Grundlagen, Schwinden 3D, Festigkeit EC5, Kriechen), Kerne `src/calc/holzphysik.ts` (Gleichgewichtsfeuchte, Feuchteangleich, Schwinden) und `src/calc/holzbau.ts` (`festigkeitswerte`, `druckUnterWinkel`, `kdefFuer`; Kern in Tranche 1 geprüft), Kennwerte `src/data/kennwerte.ts` (EN 338, EN 14080), `content/holz/Holz.json`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| H1 | Gleichgewichtsfeuchte 20 °C / 65 % | 12,00 % (Fahrenheit-Fassung) | identisch (12,0 %) |
| H2 | 30 °C / 80 % | 15,56 % | identisch |
| H3 | 10 °C / 40 % | 7,88 % | identisch |
| H4 | Feuchteangleich 30 → 12 %, 30 d, d = 24 mm | τ = 15·(24/20)² = 21,6 d; u = 16,49 % | identisch |
| H5 | Fichte 30 → 12 %, Brett 120 × 24 × 3 500 mm (q 0,33/0,16/0,01) | 112,87 × 23,31 × 3 493,7 mm; ε_V = 8,81 % | identisch |
| H5b | Einbaufeuchte 40 % | schwindwirksam erst ab 30 %: ε_T = 5,94 %, Warnung | identisch |
| H6 | C24, NKL 1, KLED mittel | k_mod 0,8; f_m,d 14,77; f_c,0,d 12,92; f_c,90,d 1,54; f_v,d 2,46 N/mm² | identisch |
| H7 | Hankinson (6.16): C24 30°, k_c,90 = 1,0; 90° mit 1,5; GL24h NKL 3 kurz 45° mit 1,75 | 4,534 / 2,308 / 3,985 N/mm² | identisch |
| H8 | Beispiel M_Rd C24 100/200, M_Ed = 7,0 kNm | M_Rd = 9,85 kNm, η = 0,71 | identisch |

k_mod (Tab. 3.1), k_def (Tab. 3.2: Vollholz/BSH/FSH 0,6/0,8/2,0; OSB/3 1,5/2,25/–), γ_M = 1,3 (NA DE, auch BSH), k_cr nach NA (2,0/f_v,k bzw. 2,5/f_v,k), die k_c,90-Stufen 1,25/1,5/1,75 und die Abbrandraten (β_n 0,8 Nadelvollholz, 0,7 BSH/FSH, 0,55 Laubholz; β₀ 0,9 OSB nach DIN EN 1995-1-2, Tab. 3.1) sind richtig (Lit.).

**Normstand:** Bauaufsichtlich eingeführt bleibt DIN EN 1995-1-1:2010-12 mit NA:2013-08. Die 2. Generation ist als DIN EN 1995-1-1:2026-09 erschienen ([Austrian Standards, Shop](https://www.austrian-standards.at/en/shop/din-en-1995-1-1-2026-09~p5057531)); der Fußtext nennt das richtig („NA noch ausstehend, nicht eingeführt“). DIN 68800-1 bis -4, DIN EN 338:2016-07, DIN EN 14080:2013-09 und DIN EN 14081-1:2019-10 sind die geltenden Ausgaben (Lit.).

**Befunde**
- behoben: keine.
- **offen – Frage T6-HO-1 (Holzwerkstoffe im Schwindrechner):** Für FSH (q_r = 0,05) und OSB (q = 0,02 in allen Richtungen) sind Werte in Plattenebene hinterlegt. Der Rechner wendet q_r auf die „Dicke (R)“ an. In Dickenrichtung quellen FSH und OSB etwa wie Vollholz radial oder stärker (Lit.). Frage: Dickenrichtung für FSH/OSB getrennt hinterlegen oder den Reiter für Holzwerkstoffe auf Plattenebene beschränken?
- Hinweis: Die Zeitkonstante τ = 15 d·(d/20 mm)² ist eine Lehrannahme; sie steht in den Grenzen.

**F-Freigabe-Stellen:** keine im Modul.

**Empfehlung:** freigabefähig nach Klärung von T6-HO-1.

- [x] Modul freigeben (29.10.2026)

## 2. Holzwerkstoffe (`holzwerkstoffe`)

**Prüfumfang:** `src/modules/Holzwerkstoffe.tsx`, `content/holzwerkstoffe/Holzwerkstoffe.json` (Arten, Herstellung, Umwelt, Beispiel Kriechverformung, Formeln, Regelwerke), Lernziele.

**Nachrechnungen (Beispiel)**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| HW1 | w_inst,G = 4,0 mm, OSB/3, NKL 1, k_def = 1,5 | w_fin = 10,0 mm | identisch |
| HW2 | Vollholz, k_def = 0,6 | 6,4 mm | identisch |
| HW3 | OSB/3, NKL 2, k_def = 2,25 | 13,0 mm | identisch |

**Fakten-Stichprobe**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| DIN EN 16351:2025-07 (Brettsperrholz) ist die geltende Ausgabe | richtig (korrigierte Fassung der Ausgabe 2021-06) | [DIN Media](https://www.dinmedia.de/en/standard/din-en-16351/388285455) |
| REACH Anhang XVII Eintrag 77: 0,062 mg/m³ ab 06.08.2026 | richtig | [IHK](https://www.ihk.de/sbh/unternehmer/energie-umwelt/umwelt/gefahrstoffe/neue-beschraenkung-von-formaldehyd-5871186) |
| γ_M = 1,3 nach NA, Empfehlungswert 1,2 für OSB/Sperrholz | richtig | Lit. (DIN EN 1995-1-1, Tab. 2.3) |
| k_def OSB/3 NKL 1/2 = 1,5/2,25 | richtig | Lit. (Tab. 3.2) |
| Spanplatten P4–P7 tragend nach DIN EN 312 | richtig | Lit. |
| Leime PRF, MUF, PUR; PUR formaldehydfrei | richtig | Lit. |

**Befunde:** keine. Hinweis: „BSH aus in der Regel mindestens drei Lamellen“ – DIN EN 14080 lässt als Balkenschichtholz auch zwei bis fünf Lamellen zu; durch „in der Regel“ vertretbar.

**Empfehlung:** freigabefähig.

- [x] Modul freigeben (29.10.2026)

## 3. Biogene Baustoffe (`nawaro`)

**Prüfumfang:** `src/modules/Nawaro.tsx` (Übersicht, FNR-Datenbank mit zehn Produkten, Dämm-Navigator, Vergleiche), `content/nawaro/Nawaro.json`, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| NA1 | DIN EN 16449: ρ₁₂ = 420 kg/m³, ω = 12 %, cf = 0,5 | m₀ = 375 kg; m_C = 187,5 kg; P_CO₂ = 687,5 kg/m³ | identisch (688 kg, „rund 0,69 t“) |
| NA2 | Navigator ρ·c: Holzfaser 270·2 100, Stroh 115·2 000 | 567 bzw. 230 kJ/(m³K) → „hoch“ bzw. „mittel“ | identisch |
| NA3 | Vergleich BSH GL24h / C25/30 | f_m,k 24 N/mm², E_0,mean 11 500 N/mm²; f_ctm 2,6, E_cm 31 000 N/mm² | identisch (EN 14080, EC2 Tab. 3.1) |

**Fakten-Stichprobe**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| Strohgedämmte Wand mit beidseitig Kalkputz F90-B | richtig | [baulinks 2015](https://www.baulinks.de/webplugin/2015/1569.php4) |
| Verwendbarkeit Baustroh über ETA-17/0247 | richtig | Lit. (FASBA) |
| Korkeiche alle etwa 9 Jahre geschält | richtig | Lit. |
| Seegras: Posidonia oceanica bzw. Zostera, Blütenpflanzen | richtig | Lit. |
| BMLEH als zuständiges Ministerium der FNR | richtig | Lit. |

**Befunde**
- **behoben – T6-NA-1:** Zeile „Primärenergie nicht erneuerbar (PENRT)“: Holzfaser „~15 MJ/kg (biogen)“ widersprach sich. Jetzt „~15 MJ/kg (nicht erneuerbar; Rohstoff biogen, verfahrensabhängig)“.
- **behoben – T6-NA-2:** Der Navigator (Ziel Feuchte) gab Holzfaser (μ 3–5) den Text „höherer Diffusionswiderstand“, obwohl das Datenblatt „diffusionsoffen (μ ≈ 3–5)“ nennt. Ursache: Schwelle μ < 5 auf den oberen Wert 5. Jetzt μ ≤ 5.
- Hinweis: Navigator und Kennwerte sind ausdrücklich Lehr- und Richtwerte; das ist im Modul deutlich gekennzeichnet.

**Empfehlung:** freigabefähig nach Korrektur T6-NA-1/-2.

- [x] Modul freigeben (29.10.2026)

## 4. Kunststoffe (`kunststoffe`)

**Prüfumfang:** `src/modules/Kunststoffe.tsx` (Arten, Temperaturabhängigkeit, Geokunststoffe, ETFE), Kern `kunststoffTemperatur`/`emodulKunststoff`/`waermedehnung` in `src/calc/werkstoffmodelle.ts`, `content/kunststoffe/Kunststoffe.json`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| KU1 | amorph (T_g 100 °C, T_f 150 °C) bei 20 / 100 / 150 °C | 3 000,0 / 1 504,9 / 5,83 MPa | identisch |
| KU2 | teilkristallin bei 20 / 160 °C | 1 650 / 150 MPa, Warnung Schmelzbereich | identisch |
| KU3 | Elastomer 20 °C | 3,02 MPa | identisch |
| KU4 | Duroplast 150 °C (= T_g) | 2 400 MPa | identisch |
| KU5 | Beispiel PVC-U 10 m, α = 80·10⁻⁶ K⁻¹, ΔT = 40 K; Stahl 12·10⁻⁶ | 32 mm bzw. 4,8 mm (Faktor 6,7) | identisch |

**Normstand:** DIN EN ISO 527-1:2019-12, DIN EN ISO 6721-1:2019-09, DIN EN ISO 11357-1:2023-08, DIN EN ISO 178:2019-08 (Lit.). Der Entwurf DIN EN ISO 11359-2:2026-11 auf Grundlage von ISO 11359-2:2021 ist bestätigt ([DIN Media](https://www.dinmedia.de/en/draft-standard/din-en-iso-11359-2/406342785)).

**Befunde**
- behoben: keine.
- **offen – Frage T6-KU-1 (Duroplast oberhalb T_g):** Das Lehrmodell lässt den Duroplast von 4 000 auf 800 MPa fallen (Faktor 5). Der Formelkasten nennt „1 bis 3 Zehnerpotenzen, bei vernetzten Kunststoffen weniger“. Für engmaschig vernetzte Harze liegt der gummielastische Modul nach Lehrbuch eher bei einigen 10 MPa (Lit.). Frage: Plateau auf etwa 50 bis 100 MPa senken oder beim deutlich kenntlichen Lehrmodell bleiben?
- Hinweis: T_g = 20 °C für „teilkristallin“ liegt über den T_g von PE und PP; als schematische Kurve vertretbar, so in den Grenzen benannt.

**Empfehlung:** freigabefähig nach Klärung von T6-KU-1.

- [x] Modul freigeben (29.10.2026)

## 5. Membranen & ETFE (`membranen_etfe`)

**Prüfumfang:** `src/modules/MembranenETFE.tsx` (Einführung, Gewebe & ETFE, Kennwerte & Bauphysik, Rechner, Regelwerke & Bauten), Kern `src/calc/membran.ts`, `content/membranenetfe/MembranenETFE.json`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| ME1 | Beispiel 1: Zylinder r = 18 m, p = 300 Pa, PVC/PES 4 000 N/5 cm, γ = 5 | n = 5 400 N/m; n_zul = 16 000 N/m; η = 0,34; Sturm 550 Pa: η = 0,62 | identisch |
| ME2 | Beispiel 2: L = 3,5 m, f = 0,35 m, 250 µm, 600 Pa, 23 N/mm² / 2 | r = 4,55 m; σ = 10,92 N/mm²; η = 0,95 | identisch |
| ME3 | Kugel L = 3 m, f = 0,3 m, 300 Pa, 200 µm | r = 3,90 m; n = 585 N/m; σ = 2,93 N/mm²; η = 0,25 | identisch |
| ME4 | Randfall f > L/2 | unzulässig | Fehlermeldung |

**Fakten-Stichprobe**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| DIN 4134-1:2026-03 und DIN 4134-101 (Tragluftbauten) | richtig | [DIN Media, Teil 1](https://www.dinmedia.de/en/standard/din-4134-1/393467764), [Teil 101](https://www.dinmedia.de/en/standard/din-4134-101/393467784) |
| DIN CEN/TS 19102 (deutsche Fassung CEN/TS 19102:2023) | richtig | [DIN Media](https://dinmedia.de/en/pre-standard/din-cen-ts-19102/362739883) |
| U-Werte Kissen 2/3/4 Lagen rund 2,9 / 1,8–2,0 / 1,4–1,5 W/(m²K) | richtig | [Baunetz Wissen, Folienkissen](https://www.baunetzwissen.de/geneigtes-dach/fachwissen/dachdeckungen/folienkissen-158497) |
| Allianz Arena: rund 2 800 ETFE-Kissen, Herzog & de Meuron, 2005 | richtig | [Baunetz Wissen, Allianz Arena](https://www.baunetzwissen.de/fassade/objekte/sport-freizeit/allianz-arena-in-muenchen-70590) |
| ETFE: Dichte 1,75 g/cm³, Schmelzbereich um 265 °C | richtig | Lit. |
| Tropical Islands: 300 Pa dauerhaft, bis 800 Pa bei Schnee | **nicht belegt** (Projektseite ohne Druckangaben) | [TensiNet](https://tensinet.com/index.php/projects-database/projects/4286) |

**Befunde**
- behoben: keine.
- **offen – Frage T6-ME-1:** Die Druckwerte für Tropical Islands (300/800 Pa) waren öffentlich nicht zu bestätigen. Frage: Quelle nachtragen oder das Beispiel allgemein fassen („im Betrieb rund 250 bis 300 Pa, bei Schnee bis etwa 800 Pa“)?
- Hinweis: Baunetz Wissen nennt für die Allianz Arena „0,035 bar“ (3 500 Pa). Das passt nicht zu den üblichen Kisseninnendrücken und ist vermutlich ein Druckfehler (0,0035 bar). Das Modul nennt keinen Wert; kein Handlungsbedarf.

**Empfehlung:** freigabefähig nach Klärung von T6-ME-1.

- [x] Modul freigeben (29.10.2026)

## 6. Dämmstoffe (`daemmstoffe`)

**Prüfumfang:** `src/modules/Daemmstoffe.tsx`, `content/daemmstoffe/Daemmstoffe.json` (mineralisch, synthetisch, nachwachsend, Beispiel Dämmstoffdicke), Lernziele.

**Nachrechnungen (Beispiel)**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| DA1 | Bestand 15 mm Putz (0,70) + 240 mm KS (0,99) | R = 0,434 m²K/W | 0,43 |
| DA2 | Ziel U = 0,20 W/(m²K) | R_D = 4,566 m²K/W | 4,57 |
| DA3 | d = λ·R_D für EPS 035 / MW 032 / HF 040 | 159,8 / 146,1 / 182,6 mm | 160 / 146 / 183 mm |

**Fakten-Stichprobe** (Lit., Bemessungs- und Nennwerte nach DIN 4108-4 bzw. Produktangaben): λ Mineralwolle 0,032–0,040, Schaumglas 0,036–0,050, EPS 0,031–0,040, XPS 0,032–0,039, PUR/PIR 0,022–0,028, VIP 0,004–0,007 (belüftet etwa 0,020) W/(mK); Holzfaser c ≈ 2 100 J/(kgK); Schafwolle sorbiert bis etwa ein Drittel des Eigengewichts. Alle Angaben liegen in den üblichen Spannen.

**Befunde**
- behoben: keine.
- **Hinweis T6-DA-1:** „EPS … Euroklasse E (früher B1 nach DIN 4102-1)“ ist historisch richtig, kann aber missverstanden werden: Euroklasse E entspricht bauaufsichtlich „normalentflammbar“; schwerentflammbar ist EPS nur im zugelassenen WDVS mit Brandriegeln (so im Modul NaWaRo formuliert). Ergänzung empfohlen.

**Empfehlung:** freigabefähig (Hinweis T6-DA-1).

- [x] Modul freigeben (29.10.2026)

## 7. Ausbau & Abdichtung (`ausbau`)

**Prüfumfang:** `src/modules/Ausbau.tsx` (Trockenbau, Estriche & Böden, Keramik, Anstriche, Abdichtung, Kleben & Schäumen), `content/ausbau/Ausbau.json`, Lernziele.

**Nachrechnungen (Beispiel)**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| AU1 | Heizestrich L = 8 m, α_T = 12·10⁻⁶ K⁻¹, ΔT = 30 K | ΔL_T = 2,88 mm | 2,9 mm |
| AU2 | ε_cs = 0,3 mm/m | ΔL_cs = 2,4 mm | 2,4 mm |

**Fakten-Stichprobe**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| Fliesengruppen nach Wasseraufnahme (≤ 0,5 %, 0,5–3 %, > 10 %) | Grenzen mit „<“ statt „≤“ (behoben, T6-AU-2) | [Baunetz Wissen, Einteilung nach Norm](https://www.baunetzwissen.de/fliesen-und-platten/fachwissen/keramische-belaege/einteilung-keramischer-fliesen-und-platten-nach-norm-1584291) |
| DIN 18157 Teile 1 bis 3 (zementär, Dispersion, Reaktionsharz) | richtig, Neufassung 2017 | [WEKA](https://www.weka.de/architekten-ingenieure/neue-din-18157-ausfuehrung-von-bekleidungen-und-belaegen-im-duennbettverfahren/) |
| Calciumsulfatestrich „nicht für Nassräume“ | zu pauschal (behoben, T6-AU-1) | [Stauf, Merkblatt SO 01](https://www.stauf.de/fileadmin/masterTemplate/Resources/Public/Files/tech_info/weitere_themenbereiche/SO_01_Parkett_und_Bodenbelaege_im_Bad_Ansicht.pdf) |
| C1 ≥ 0,5 / C2 ≥ 1,0 N/mm² Haftzug (DIN EN 12004-1) | richtig | Lit. |
| Feldgrößen Zement-Heizestrich ≤ 40 m², ≤ 8 m, 1 : 2 | richtig (BEB-Hinweisblatt) | Lit. |

**Befunde**
- **behoben – T6-AU-1:** „Empfindlich gegen Feuchtigkeit (nicht für Nassräume)“ widersprach dem Modul Innenausbau und DIN 18534 (Bäder W0-I/W1-I mit Abdichtung zulässig; in W2-I/W3-I keine feuchteempfindlichen Untergründe). Jetzt gleichlautend.
- **behoben – T6-AU-2:** „Wasseraufnahme < 3 %“ und „< 0,5 %“ → „0,5 % < E ≤ 3 %“ und „E ≤ 0,5 %“ (DIN EN 14411).
- **offen – Frage T6-AU-3 (Schwindmaß Zementestrich):** Das Beispiel rechnet mit ε_cs = 0,3 mm/m, das Modul Innenausbau nennt 0,4–0,6 mm/m. Beide sind Lehrwerte. Angleichen?
- Hinweis: Die Regelwerke nennen keine Abdichtungsnormen, obwohl das Modul „Ausbau & Abdichtung“ heißt (Registry: DIN 18533). Ergänzung von DIN 18531 bis DIN 18535 (jeweils geltende Ausgabe) empfohlen; die Ausgaben sind am Normenverzeichnis zu bestätigen (DIN 18534: 2025-10).

**Empfehlung:** freigabefähig nach Korrektur T6-AU-1/-2 und Klärung von T6-AU-3.

- [x] Modul freigeben (29.10.2026)

## 8. Werkstoff-Kombinationen (`kombinationen`)

**Prüfumfang:** `src/modules/Kombinationen.tsx` (sieben Reiter; Faserverbund-Mikromechanik und Schichtrechner inline, s_d-Regel über `sdRegel` aus `src/calc/glaser.ts`), `content/kombinationen/Kombinationen.json`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| KO1 | Standardaufbau (Putz, HLz 24 cm λ 0,28, EPS 16 cm 0,035, Armierungs- und Oberputz) | R_T = 5,630 m²K/W; U = 0,178 W/(m²K) | identisch |
| KO1 | s_d nach Schichthälften (1–3 innen, 4–5 außen) | s_d,i = 8,95 m; s_d,e = 0,215 m → erforderlich ≥ 2,0 m, eingehalten | identisch |
| KO2 | CFK HT/EP, v_f = 40 % | E_∥ = 93,92 GPa; E_⊥ = 5,28 GPa; σ_∥ = 1 429 MPa; ρ = 1,44 g/cm³ | identisch |
| KO3 | E-Glas/UP, v_f = 60 % | E_∥ = 44,92 GPa; E_⊥ = 6,62 GPa | identisch |

Faser- und Matrixkennwerte (Carbon HT 230 GPa/3 500 MPa, HM 390/2 500, E-Glas 73/2 400, Aramid 130/2 900, Epoxid 3,2 GPa) entsprechen üblichen Lehrbuchwerten (Lit.). Die Normpotentiale Zn −0,76 V und Fe −0,44 V, der Prüfstempel Ø 50 mm (DIN EN 1542) und der Hinterlüftungsspalt ≥ 20 mm (DIN 18516-1) sind richtig (Lit.).

**Befunde**
- **behoben – T6-KO-1:** „Gebäudeenergiegesetz (GEG)“ und die Bewertung „GEG-Standard übertroffen / GEG-Mindestwert eingehalten / GEG-Vorgabe verfehlt“. Seit 29.07.2026 gilt das GModG (vgl. Tranche 1, B-1). U ≤ 0,24 W/(m²K) ist der Höchstwert nach Anlage 7 für die Änderung bestehender Gebäude, kein Mindestwert. Die Texte nennen jetzt GModG Anlage 7 mit Geltungsbereich.
- **behoben – T6-KO-2:** „U-Wert … und s_d mit Glaser-Feuchteüberprüfung“ → „mit einer vereinfachten s_d-Regel (kein Glaser-Verfahren)“. Die Warnung „Die äußeren Schichten weisen einen höheren Diffusionswiderstand auf als die inneren“ erschien auch, wenn die Regel aus anderem Grund verletzt war (z. B. s_d,i < 6·s_d,e bei s_d,i > s_d,e); jetzt „erfüllt die vereinfachte s_d-Regel nicht: äußere Schichten im Verhältnis zu den inneren zu diffusionsdicht“. Die Erfolgsmeldung ist entsprechend angepasst.
- **behoben – T6-KO-3:** WDVS-Normbezug „ETAG 004“ → „EAD 040083-00-0404 (ersetzt ETAG 004)“ ([ITeC](https://en.itec.cat/infoitec/certification/new-ead-040083-00-0404-supersedes-etag-004-for-the-ce-marking-of-etics-systems/)).
- **offen – Frage T6-KO-4 (Schichtteilung der s_d-Regel):** Die Regel teilt nach Schichtanzahl. Im Standardaufbau zählt die EPS-Dämmung zur Innenseite. Bei Teilung an der Dämmschicht wäre s_d,e = 6,6 m und die Dachregel nicht anwendbar, obwohl WDVS auf Mauerwerk nach DIN 4108-3 zu den nachweisfreien Außenwänden gehört. Frage: Teilung an der Schicht mit dem größten Wärmedurchlasswiderstand und für Außenwände die Liste der nachweisfreien Konstruktionen statt der Dachregel verwenden?
- **offen – Frage T6-KO-5 (Rechenkern):** Faserverbund und Schichtrechner rechnen in der Komponente, Eingaben werden still begrenzt (`Math.max(1, … || 1)`). Soll die Rechnung wie bei anderen Modulen in einen Kern `src/calc/` mit Plausibilitätsprüfung überführt werden?

**Empfehlung:** freigabefähig nach Korrektur T6-KO-1 bis -3 und Klärung von T6-KO-4/-5.

- [x] Modul freigeben (29.10.2026)

## 9. Materialität (Architektur) (`materialitaet_architektur`)

**Prüfumfang:** `src/modules/MaterialitaetArchitektur.tsx` (Dimensionen, Referenzbauten, Lichtsimulation, Beispiel Kontakttemperatur), `content/materialitaetarchitektur/MaterialitaetArchitektur.json`, `src/data/architekturMaterialitaet.ts` (Texte je Baustoff), Lernziele.

**Nachrechnungen (Beispiel)**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| MA1 | b = √(λρc): Holz 0,13/450/1 600; Beton 2,0/2 400/1 000; Stahl 50/7 850/450 | 305,9 / 2 190,9 / 13 290 J/(m²K√s) | 306 / 2 191 / 13 290 |
| MA2 | ϑ_K mit b_Haut = 1 000, 33 °C, Material 20 °C | Holz 29,95; Beton 24,07; Stahl 20,91 °C | 30,0 / 24,1 / 20,9 °C |
| MA3 | Differenz Holz – Stahl | 9,0 K | „rund 9 K“ |

**Fakten-Stichprobe**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| Kapelle der Versöhnung: „Martin Rauch / Anna Heringer“ | **falsch**: Reitermann/Sassenroth, Lehmbau Martin Rauch (behoben) | [Wikipedia, Chapel of Reconciliation](https://en.wikipedia.org/wiki/Chapel_of_Reconciliation) |
| Alnatura-Campus Darmstadt | haascookzemmrich STUDIO2050, Lehmbau Lehm Ton Erde (Martin Rauch) | [Baunetz Wissen](https://www.baunetzwissen.de/gesund-bauen/objekte/buero-arbeiten/firmenzentrale-alnatura-in-darmstadt-6504499) |
| Centre Pompidou-Metz: „Shigeru Ban / Frei Otto“ | **falsch**: Shigeru Ban mit Jean de Gastines (behoben) | [Dezeen](https://www.dezeen.com/?p=65106) |
| Allianz Arena (Herzog & de Meuron), ETFE-Kissen | richtig | [Baunetz Wissen](https://www.baunetzwissen.de/fassade/objekte/sport-freizeit/allianz-arena-in-muenchen-70590) |
| DBV/VDZ-Merkblatt Sichtbeton, Fassung 2015 | richtig (überarbeitete Fassung 2015) | [Baunetz Wissen](https://www.baunetzwissen.de/gerueste-und-schalungen/tipps/planungshilfen/dbv-vdz-merkblatt-sichtbeton-4812778) |
| Chilehaus (Höger), Bauakademie (Schinkel), Therme Vals (Zumthor), John Deere HQ (Saarinen, Cortenstahl) | richtig | Lit. |

**Befunde**
- **behoben – T6-MA-1:** Architektenangaben der Lehm- und Holzreferenzen (Tabelle). Die Schlüssel `martinRauchAnnaHeringer` und `shigeruBanFreiOtto` bleiben unverändert.
- Hinweis: In `architekturMaterialitaet.ts` steht für Lehm „die höchste thermische Behaglichkeit aller mineralischen Baustoffe“. Das ist nicht messbar belegt; eine relative Formulierung („besonders behaglich, feuchtepuffernd“) wäre vorsichtiger. Die Datei speist auch den Baustoff-Steckbrief und wurde nicht geändert.

**Empfehlung:** freigabefähig nach Korrektur T6-MA-1.

- [x] Modul freigeben (29.10.2026)

## 10. Sonstige & Innovationen (`sonstiges`)

**Prüfumfang:** `src/modules/Sonstiges.tsx` (PCM, Leichtzuschläge, Aerogele, selbstheilender Beton, Photokatalyse/Sensorbeton, VIP/Myzel), `content/sonstiges/Sonstiges.json`, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| SO1 | Beton c = 1,0 kJ/(kgK), ΔT = 5 K | 5 kJ/kg | identisch |
| SO1 | Paraffin c = 2,0, Δh_m = 150 kJ/kg | 160 kJ/kg; Verhältnis 32 | identisch („rund 30-mal“) |
| SO2 | Atombilanz Ca(C₃H₅O₃)₂ + 6 O₂ → CaCO₃ + 5 CO₂ + 5 H₂O | ausgeglichen (C 6, H 10, O 18) | richtig |
| SO3 | Atombilanz NO + ·OH + O₂⁻ → NO₃⁻ + H₂O | H: links 1, rechts 2 – **nicht ausgeglichen** | behoben (T6-SO-1) |
| SO4 | VIP 0,007 gegen EPS 0,035 W/(mK); belüftet 0,020 | Faktor 5; Dämmwirkung auf rund ein Drittel | identisch |

**Fakten-Stichprobe**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| Photokatalyse: Hydroxylpfad NO → HNO₂ → NO₂ → HNO₃, Superoxidpfad NO + ·O₂⁻ → NO₃⁻ | Grundlage der Korrektur | [Catalysts 15 (2025) 103](https://www.mdpi.com/2073-4344/15/2/103) |
| DIN EN 13055: Kornrohdichte ≤ 2 000 kg/m³ bzw. Schüttdichte ≤ 1 200 kg/m³ | richtig | Lit. |
| Aerogel: Porenanteil bis 99,8 %, λ 0,013–0,018, Poren < 50 nm (Knudsen) | richtig | Lit. |
| Jonkers 2011: Risse bis etwa 0,4–0,5 mm geschlossen | richtig | Lit. (HERON 56) |
| DIN EN 17140:2021-02 (VIP), RAL-GZ 896 (PCM) | richtig | Lit. |

**Befunde**
- **behoben – T6-SO-1:** Die Gleichung „NO + ·OH + O₂⁻ → NO₃⁻ + H₂O“ war nicht ausgeglichen. Jetzt getrennt: O₂ + e⁻ → ·O₂⁻; NO + ·OH → HNO₂; HNO₂ + ·OH → NO₂ + H₂O; NO₂ + ·OH → HNO₃; NO + ·O₂⁻ → NO₃⁻.

**Empfehlung:** freigabefähig nach Korrektur T6-SO-1.

- [x] Modul freigeben (29.10.2026)

## 11. Innenausbau (`innenausbau`)

**Prüfumfang:** `src/modules/Innenausbau.tsx` (Übersicht mit zwölf Werkzeugen, Estriche & Belegreife, Trockenbau, Verbundabdichtung, Belegreife-Prüfer), `content/innenausbau/Innenausbau.json`, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul |
|---|---|---|---|
| IA1 | s′ = 0,111/d, d = 75 mm | 1,48 MN/m³ | identisch |
| IA2 | f₀ bei 2 × 12,5 mm GKB je Seite (17 kg/m²) | 66,4 Hz | „≈ 66 Hz“ |
| IA3 | f₀ bei einfacher Beplankung (8,5 kg/m²) | 93,9 Hz | „rund 94 Hz“ |
| IA4 | Belegreife CT unbeheizt / beheizt, CA unbeheizt / beheizt | Grenzen 2,0 / 1,8 / 0,5 / 0,3 CM-%; 1,9 CM-% CT unbeheizt belegreif | identisch (auch `qn_innenausbau_1`) |
| IA5 | Kristallwasser GKF 15 mm (≈ 12 kg/m², 20,9 %) | 2,5 l/m² | „rund 2–3 Liter“ |

**Fakten-Stichprobe**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| DIN 18534-1 bis -6:2025-10 | richtig (Neufassung Oktober 2025) | [bauprofessor](https://www.bauprofessor.de/news/ueberarbeitung-der-din-18534-zur-badabdichtung-veroeffentlicht/), [DIN, Inhaltsverzeichnis Teil 1](https://www.din.de/de/mitwirken/normenausschuesse/nabau/veroeffentlichungen/wdc-beuth:din21:391755876/toc-3620546/download) |
| W2-I: „bodengleiche Duschen, gewerbliche Küchen …“ | gewerbliche Küchen sind W3-I (behoben) | [Baunetz Wissen, Wassereinwirkungsklassen](https://www.baunetzwissen.de/glossar/w/wassereinwirkungsklassen-8432878) |
| Gipsplatten in W2-I/W3-I nicht zulässig | richtig | [Rigips, Wassereinwirkungsklassen](https://www.rigips.de/sites/mac3.rigips.de/files/dam_assets/Wassereinwirkungsklassen_nach_DIN_18534_1_13.pdf) |
| In W2-I/W3-I keine feuchteempfindlichen Untergründe | richtig (ergänzt) | [Stauf, Merkblatt SO 01](https://www.stauf.de/fileadmin/masterTemplate/Resources/Public/Files/tech_info/weitere_themenbereiche/SO_01_Parkett_und_Bodenbelaege_im_Bad_Ansicht.pdf) |
| GKBI Typ H2: Wasseraufnahme ≤ 10 % | richtig (DIN EN 520; Gesamtwasseraufnahme) | Lit. |
| R_si Decke 0,10 (nach oben) / 0,17 m²K/W (nach unten) | richtig (DIN EN ISO 6946) | Lit. |

**Befunde**
- **behoben – T6-IA-1:** W2-I nannte gewerbliche Küchen (nach DIN 18534-1 W3-I, im Modul unter W3-I auch so genannt). Neu: „Bodenflächen mit Abläufen und/oder Rinnen (z. B. bodengleiche Duschen), Wandflächen von Duschen in Sport- und Gewerbestätten“. Die Abdichtungszeile lautet jetzt „Abdichtung zwingend (z. B. AIV-B oder MDS; Stoffauswahl nach DIN 18534-2 bis -6); keine feuchteempfindlichen Untergründe; Dichtmanschetten Pflicht!“. Vorher stand dort „AIV-B oder MDS vorgeschrieben“; das las sich wie eine abschließende Liste.
- **behoben – T6-IA-2:** Werkzeugkarte U-Wert „Nachweis der Grenzwerte nach Gebäudeenergiegesetz (GEG)“ → „Vergleich mit den Höchstwerten nach GModG (vormals GEG)“.
- **offen – Frage T6-IA-3 (DIN 18534:2025-10):** Die Klassenbeschreibungen folgen der Ausgabe 2017. Bitte Tab. 1 und Anhang A der Ausgabe 2025-10 abgleichen, insbesondere die Zuordnung bodengleicher Duschen im häuslichen Bad (W1-I oder W2-I; betrifft auch `q_iax_3`).
- **offen – Frage T6-IA-4 (VOB/C):** „Nach VOB/C DIN 18365 gehört die Prüfung des Untergrunds einschließlich Feuchtemessung zu den Nebenleistungen“. Ob die CM-Messung Nebenleistung oder Besondere Leistung ist, war öffentlich nicht zu klären. Bitte am Normtext DIN 18365 (Abschnitte 3.1 und 4) bestätigen.

**F-Freigabe-Stellen:** Tab. 1 DIN 18534-1:2025-10 (T6-IA-3); DIN 18365, Abschnitt 4 (T6-IA-4).

**Empfehlung:** freigabefähig nach Korrektur T6-IA-1/-2 und Klärung von T6-IA-3/-4.

- [ ] Modul freigeben

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage |
|---|---|---|
| T6-HO-1 | Holz | Quell- und Schwindmaße von FSH/OSB in Dickenrichtung getrennt hinterlegen oder den Rechner für Holzwerkstoffe auf die Plattenebene beschränken? |
| T6-KU-1 | Kunststoffe | Plateau-Modul des Duroplasts oberhalb T_g (800 MPa) auf etwa 50–100 MPa senken? |
| T6-ME-1 | Membranen & ETFE | Druckwerte Tropical Islands (300/800 Pa) belegen oder allgemein formulieren? |
| T6-AU-3 | Ausbau | Schwindmaß Zementestrich angleichen (Beispiel 0,3 mm/m, Innenausbau 0,4–0,6 mm/m)? |
| T6-KO-4 | Kombinationen | s_d-Regel an der Dämmschicht teilen und für Außenwände die nachweisfreien Konstruktionen der DIN 4108-3 verwenden? |
| T6-KO-5 | Kombinationen | Rechnung in einen Kern `src/calc/` mit Plausibilitätsprüfung überführen (statt stiller Eingabebegrenzung)? |
| T6-IA-3 | Innenausbau | Wassereinwirkungsklassen mit Tab. 1 der DIN 18534-1:2025-10 abgleichen (bodengleiche Dusche, `q_iax_3`). |
| T6-IA-4 | Innenausbau | CM-Messung nach DIN 18365 Neben- oder Besondere Leistung? |

Hinweise ohne Entscheidungsbedarf: T6-DA-1 (Brandverhalten EPS), Abdichtungsnormen in den Regelwerken des Moduls Ausbau, Formulierung „höchste Behaglichkeit“ (Lehm) in `architekturMaterialitaet.ts`.

## Nachweis der Prüfung

- Unabhängige Nachrechnung: eigenes Python-Skript (81 Werte). Die Kernwerte sind als `tests/modulpruefungTranche6.test.ts` übernommen. Die Inline-Rechnungen (Kombinationen, Navigator, Belegreife) und die Anwendungsbeispiele wurden über die Formeln abgeglichen.
- Öffentliche Quellen dieser Prüfung: [DIN Media, DIN 4134-1](https://www.dinmedia.de/en/standard/din-4134-1/393467764); [DIN Media, DIN 4134-101](https://www.dinmedia.de/en/standard/din-4134-101/393467784); [DIN Media, DIN CEN/TS 19102](https://dinmedia.de/en/pre-standard/din-cen-ts-19102/362739883); [DIN Media, DIN EN 16351:2025-07](https://www.dinmedia.de/en/standard/din-en-16351/388285455); [DIN Media, Entwurf DIN EN ISO 11359-2](https://www.dinmedia.de/en/draft-standard/din-en-iso-11359-2/406342785); [Austrian Standards, DIN EN 1995-1-1:2026-09](https://www.austrian-standards.at/en/shop/din-en-1995-1-1-2026-09~p5057531); [bauprofessor, DIN 18534:2025-10](https://www.bauprofessor.de/news/ueberarbeitung-der-din-18534-zur-badabdichtung-veroeffentlicht/); [DIN, Inhaltsverzeichnis DIN 18534-1:2025-10](https://www.din.de/de/mitwirken/normenausschuesse/nabau/veroeffentlichungen/wdc-beuth:din21:391755876/toc-3620546/download); [Baunetz Wissen, Wassereinwirkungsklassen](https://www.baunetzwissen.de/glossar/w/wassereinwirkungsklassen-8432878); [Rigips, Wassereinwirkungsklassen](https://www.rigips.de/sites/mac3.rigips.de/files/dam_assets/Wassereinwirkungsklassen_nach_DIN_18534_1_13.pdf); [Stauf, Merkblatt SO 01](https://www.stauf.de/fileadmin/masterTemplate/Resources/Public/Files/tech_info/weitere_themenbereiche/SO_01_Parkett_und_Bodenbelaege_im_Bad_Ansicht.pdf); [Baunetz Wissen, Fliesengruppen](https://www.baunetzwissen.de/fliesen-und-platten/fachwissen/keramische-belaege/einteilung-keramischer-fliesen-und-platten-nach-norm-1584291); [WEKA, DIN 18157](https://www.weka.de/architekten-ingenieure/neue-din-18157-ausfuehrung-von-bekleidungen-und-belaegen-im-duennbettverfahren/); [IHK, REACH Formaldehyd](https://www.ihk.de/sbh/unternehmer/energie-umwelt/umwelt/gefahrstoffe/neue-beschraenkung-von-formaldehyd-5871186); [baulinks, Strohballenwand F90-B](https://www.baulinks.de/webplugin/2015/1569.php4); [Baunetz Wissen, Folienkissen](https://www.baunetzwissen.de/geneigtes-dach/fachwissen/dachdeckungen/folienkissen-158497); [Baunetz Wissen, Allianz Arena](https://www.baunetzwissen.de/fassade/objekte/sport-freizeit/allianz-arena-in-muenchen-70590); [TensiNet, Tropical Islands](https://tensinet.com/index.php/projects-database/projects/4286); [Wikipedia, Chapel of Reconciliation](https://en.wikipedia.org/wiki/Chapel_of_Reconciliation); [Baunetz Wissen, Alnatura](https://www.baunetzwissen.de/gesund-bauen/objekte/buero-arbeiten/firmenzentrale-alnatura-in-darmstadt-6504499); [Dezeen, Centre Pompidou-Metz](https://www.dezeen.com/?p=65106); [Baunetz Wissen, Merkblatt Sichtbeton](https://www.baunetzwissen.de/gerueste-und-schalungen/tipps/planungshilfen/dbv-vdz-merkblatt-sichtbeton-4812778); [Catalysts 15 (2025) 103, Photokatalyse](https://www.mdpi.com/2073-4344/15/2/103); [ITeC, EAD 040083-00-0404](https://en.itec.cat/infoitec/certification/new-ead-040083-00-0404-supersedes-etag-004-for-the-ce-marking-of-etics-systems/).

## Umsetzung 29.10.2026

Entscheidungen vom 28.10.2026 (nachts, „alle Vorschläge übernehmen“); Regressionstests in `tests/modulpruefungTranche6.test.ts` und `tests/kombinationen.test.ts`.

- **T6-HO-1 (Holz):** Quell-/Schwindmaße der Holzwerkstoffe getrennt nach Plattenebene und Dickenrichtung im Kern (`HOLZWERKSTOFF_SCHWINDMASSE` in `src/calc/holzphysik.ts`): FSH q = 0,05/0,01 % je % in Plattenebene, 0,24 % je % in Dickenrichtung; OSB 0,02/0,02 bzw. 0,30 % je %. Die Dickenwerte sind Lehrwerte (vorläufig, F-Freigabe), Hinweistext im Modul. Nachrechnung: OSB 18 mm, u 15 → 9 %: 17,676 mm; FSH 45 mm: 44,352 mm. Quelle: Befund T6-HO-1 (Dickenquellung etwa wie Vollholz radial oder stärker, Lit.).
- **T6-KU-1 (Kunststoffe):** Duroplast-Plateau oberhalb T_g von 800 auf 80 MPa (Lehrwert im Bereich 50–100 MPa) gesenkt; E(T_g) = 2 040 MPa, E(250 °C) = 80,18 MPa. Fachtext und Grenzen nennen die Spanne. Quelle: Lehrbuchwerte für den gummielastischen Modul engmaschig vernetzter Harze (Befund T6-KU-1).
- **T6-ME-1 (Membranen & ETFE):** Kissendruck allgemein „etwa 200 bis 800 Pa“ ohne Projektzuordnung; das unbelegte Projektbeispiel ist entfernt.
- **T6-AU-3 (Ausbau/Innenausbau):** Schwindmaß Zementestrich einheitlich 0,5 mm/m (Lehrwert), Spanne 0,4–0,6 mm/m im Text. Beispiel Ausbau: ΔL_cs = 8 · 0,5 = 4,0 mm (vorher 2,4 mm), Hinweis „rund 4 mm Verkürzung (3–5 mm)“.
- **T6-KO-4 (Kombinationen):** Die s_d-Regel teilt jetzt an der Dämmschicht (Schicht mit dem größten Wärmedurchlasswiderstand, selbst nicht mitgezählt, wie bei den nachweisfreien Dächern der DIN 4108-3). Standardaufbau: s_d,i = 2,55 m, s_d,e = 0,215 m. Außenwände mit Außendämmung auf tragender Schicht (WDVS auf Mauerwerk) werden als Konstruktion ohne rechnerischen Tauwassernachweis nach DIN 4108-3 eingeordnet (Zuordnung im Einzelfall am Normtext; vorläufig, F-Freigabe), Innendämmung mit Hinweis auf Glaser/DIN EN 15026, sonst Dachregel als Orientierung.
- **T6-KO-5 (Kombinationen):** Faserverbund und Schichtrechner rechnen im neuen Kern `src/calc/kombinationen.ts` (`faserverbund`, `schichtaufbau`) mit Plausibilitätsprüfung; die stille Eingabebegrenzung (`Math.max(1, … || 1)`) ist entfernt, unzulässige Eingaben (Dicke ≤ 0, λ ≤ 0, μ < 1, v_f außerhalb 0–100 %) werden gemeldet. Handwerte: CFK HT/EP 40 %: 93,92/5,284 GPa, 1 429,2 MPa; WDVS U = 0,17761 W/(m²K).
- **T6-IA-3 (Innenausbau, Normtext):** Zuordnung bodengleicher Duschen und Klassenbeschreibungen als „vorläufig, F-Freigabe“ am Normtext DIN 18534-1:2025-10, Tab. 1 gekennzeichnet; Inhalt unverändert. `q_iax_3` bleibt unverändert (durch die Kennzeichnung nicht falsch). Fachgebiet: `DIN 18534` als Alternative an „Bauprodukte“ in `scripts/auditDaten.ts` angehängt.
- **T6-IA-4 (Innenausbau, Normtext):** Einordnung der CM-Messung als Neben- oder Besondere Leistung nach DIN 18365, Abschnitt 4 als „vorläufig, F-Freigabe“ gekennzeichnet; Fachgebiet über die Alternative `DIN 18365`.

## Freigabe 29.10.2026

Entscheidung vom 28.10.2026: „Module ohne offene Frage freigeben“; Punkte, die nur am Normtext zu klären sind, blockieren die Freigabe (Prüfbogen Normtext, Abschnitt „Was ohne Normtext nicht weiterkommt“). Geprüft wurde je Modul: Empfehlung erfüllt (Korrekturen behoben, Klärungen entschieden und in den Abschnitten „Umsetzung 29.10.2026“ bzw. in den genannten PRs umgesetzt oder gekennzeichnet) und kein Normtextpunkt offen. Prüfvermerk in `src/data/pruefvermerke.ts`: „geprueft“, am 2026-10-29, passiv ohne Namen. Quizfreigaben sind davon getrennt.

Freigegeben:

- `holz` – T6-HO-1 umgesetzt (#251, Dickenrichtung getrennt, Lehrwerte vorläufig)
- `holzwerkstoffe` – freigabefähig, keine Frage
- `nawaro` – nach Korrektur T6-NA-1/-2 (behoben, #237)
- `kunststoffe` – T6-KU-1 umgesetzt (#251, Plateau 80 MPa)
- `membranen_etfe` – T6-ME-1 umgesetzt (#251, ohne Projektzuordnung)
- `daemmstoffe` – freigabefähig (Hinweis T6-DA-1 ohne Entscheidungsbedarf)
- `ausbau` – T6-AU-1/-2 behoben (#237), T6-AU-3 umgesetzt (#251, 0,5 mm/m)
- `kombinationen` – T6-KO-1 bis -3 behoben (#237), T6-KO-4/-5 umgesetzt (#251, Kern kombinationen.ts)
- `materialitaet_architektur` – nach Korrektur T6-MA-1 (behoben, #237)
- `sonstiges` – nach Korrektur T6-SO-1 (behoben, #237)

Nicht freigegeben:

- `innenausbau` – Prüfbogen: T6-IA-3, T6-IA-4 (Normtext)
