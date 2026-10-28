# Modulprüfung Tranche 3 – Rechner- und Fachmodule (Befundliste zur Freigabe)

**Stand:** 28.10.2026 (Branch `pruefung/module-tranche3-10-28`, Basis origin/main 10e8190d, main 1974ca9b eingemergt)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke und **keine** Quizfragen geändert.

## Vorgehen

- **Auswahl (10 Bereiche):** Rechner und Fachmodule mit hoher Nutzung in den Pflichtfächern Bauphysik, Betontechnologie, Mauerwerksbau, Stahlbau und Verkehrswegebau, die in Tranche 1 und 2 nicht geprüft wurden. Gründe im Einzelnen:
  - **Sommerlicher Wärmeschutz:** Nachweis nach § 14 GModG; DIN 4108-2 ist im Mai 2026 neu erschienen.
  - **U-Wert-Varianten:** Beispielrechnung `rechnung_u_wert` und Fenster-U_w (`bp_glaeser`); Tranche 1 prüfte nur den Kern im Modul Bauphysik.
  - **Mauerwerk (Modul `mauerwerk`, Reiter Festigkeit & Bemessung)** und die am 27.10. eingeführten erweiterten Bedingungen für h > 2,75 m im Kern `mauerwerk.ts`.
  - **Frischbeton/LP-Gehalt:** Klärung der Quizfrage `qn_frischbeton_4` (Mindestwert + 4 %).
  - **Hydratation/Reife:** gewogene Reife nach NEN 5970 seit 27.10. im Kern, Form „vorläufig“.
  - **Expositionsklassen**, **Stahlbau EC 3**, **Asphalt**, **Brandschutz** (Fachmodul und Beispielrechnung Heißbemessung) und **Schallschutz-Trittschall** (Reiter Trittschall und Beispielrechnung `rechnung_schallschutz`).
- **Prüfumfang je Modul** (wie Tranche 1 und 2):
  - Rechenkern mit mindestens drei eigenen Nachrechnungen: eigenes Python-Skript mit eigener Umsetzung der Norm- bzw. Modellgleichungen, keine Übernahme von Testwerten, Randfälle eingeschlossen.
  - Fachtext (`content/*.json`) auf Richtigkeit und Normstand, Grenzen (`src/data/rechnerGrenzen.ts`), Beispiele mit Rechenweg, Lernziele und Kurzfassung, Quellen und Stellen „vorläufig, F-Freigabe“.
- **Ergebnis der Nachrechnung:** 83 Einzelvergleiche, alle ohne Abweichung (Toleranz 0,5 %). Einzige Näherung: f₀ = 160·√(s′/m′) statt 159,2·√(s′/m′) im Trittschallrechner (0,5 %, wie Tranche 1, kein Befund). Die Sollwerte stehen als Regressionstest in `tests/modulpruefungTranche3.test.ts`.
- **Inline-Rechnungen:** Die Heißbemessung Holz (`Beispielrechnungen.tsx`) und die Mauerwerksbemessung im Modul `mauerwerk` rechnen in der Komponente bzw. über einzelne Kernfunktionen. Die Formeln wurden Zeile für Zeile gegen die eigene Rechnung abgeglichen.
- Es wurden nur öffentliche Quellen verwendet. Normtexte wurden nicht abgeschrieben. Wo der Normtext zur Bestätigung nötig ist, steht die Stelle unter „F-Freigabe“.

## Übersicht

| Nr. | Prüfeinheit | Prüfvermerk-ID | Rechenkern | Empfehlung |
|---|---|---|---|---|
| 1 | Sommerlicher Wärmeschutz | `sommerlicher_waermeschutz` | `src/calc/sommerWaermeschutz.ts` | freigabefähig für den Normenstand 2013-02 nach Klärung von T3-SW-2 |
| 2 | U-Wert-Varianten | `rechnung_u_wert`, `bp_glaeser` (Reiter U_w) | `src/calc/waermeschutz.ts`, `src/calc/fenster.ts` | freigabefähig nach Korrektur T3-UW-1 |
| 3 | Mauerwerk (Bemessungsreiter, erweiterte Bedingungen) | `mauerwerk` | `src/calc/mauerwerk.ts` | freigabefähig nach Klärung von T3-MW-1 und T3-MW-2 |
| 4 | Frischbeton / LP-Gehalt | `frischbeton` | `src/calc/frischbeton.ts` (neu) | freigabefähig nach Korrektur T3-FB-1 und Klärung von T3-FB-2 |
| 5 | Hydratation / Reife | `hydratation_folgen` | `src/calc/hydratation.ts` | Rechnung freigabefähig; gewogene Reife bleibt „vorläufig“ (T3-HY-1) |
| 6 | Expositionsklassen | `expositionsklassen` | `src/calc/expositionsklassen.ts` | freigabefähig nach Klärung von T3-EX-1 und T3-EX-2 |
| 7 | Stahlbau EC 3 | `stahlbau_ec3` | `src/calc/stahlbau.ts` | freigabefähig |
| 8 | Asphalt | `asphalt` | `src/calc/asphalt.ts` | freigabefähig nach Korrektur T3-AS-1/-2 (F-Stelle Lufttemperaturen) |
| 9 | Brandschutz | `brandschutz`, `rechnung_brandschutz` | Inline (`Beispielrechnungen.tsx`), `src/data/brandschutzBeton.ts` (neu) | freigabefähig nach Korrektur T3-BR-1 und Klärung von T3-BR-2/-3 |
| 10 | Schallschutz-Trittschall | `schallschutz` (Reiter Trittschall), `rechnung_schallschutz` | `src/calc/schall.ts` | freigabefähig nach Klärung der F-Stellen aus Tranche 1 und von T3-TS-1 |

**Behobene Fehler (dieser PR):**
- **T3-FB-1:** Luftgehalt – obere Grenze ist Normgrenzwert, Meldung bei zu hohem Luftgehalt, Grenzabweichung der Einzelwerte; neuer Kern mit Test.
- **T3-AS-1:** AGW-Übergangsfrist Bitumen (bis 31.12.2026, nicht „Ende 2024“). **T3-AS-2:** ZTV Asphalt-StB 26 Teil 1 als geltende Fassung.
- **T3-BR-1:** Balken-Mindestmaße im Brandfall (Breite und Achsabstand aus verschiedenen Spalten der Tab. 5.5; auf der unsicheren Seite).
- **T3-UW-1:** U-Wert-Beispiel: GModG statt GEG, Geltungsbereich Anlage 7, falsche Begründung „Mindestwärmeschutz“; dazu „GEG“-Beschriftungen im Fensterrechner.
- **T3-ST-1:** Verhältnis W_pl/W_el im Stahlbau-Text (HEA nur rund 10 %).
- **T3-SW-1:** Normenstand-Hinweis Sommerlicher Wärmeschutz um die Gliederung der DIN 4108-2:2026-05 ergänzt.

---

## 1. Sommerlicher Wärmeschutz (`sommerlicher_waermeschutz`)

**Prüfumfang:** `src/calc/sommerWaermeschutz.ts`; `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json` (Text, Tab. 6–8, zwei Beispiele, Formeln, Regelwerke), Grenzen, Lernziele.

**Normstand DIN 4108-2 (Auftrag: Ausgabe 2026?):** Ja. **DIN 4108-2:2026-05** ist erschienen und ersetzt DIN 4108-2:2013-02 ([DIN Media, Normseite](https://www.dinmedia.de/en/standard/din-4108-2/401017482); Entwurf 2024-12 zurückgezogen, [DIN Media, Entwurf](https://www.dinmedia.de/en/draft-standard/din-4108-2/384656689)). Neuer Titel: „Wärmeschutz – Anforderungen, Berechnungsverfahren und Hinweise für Planung und Ausführung“. Öffentlich belegbar sind nur die Änderungen der Gliederung ([Inhaltsverzeichnis 2026-05](https://www.din.de/de/mitwirken/normenausschuesse/nabau/veroeffentlichungen/wdc-beuth:din21:401017482/toc-3688761/download) gegen [Inhaltsverzeichnis 2013-02](https://www.din.de/de/mitwirken/normenausschuesse/nabau/veroeffentlichungen/wdc-beuth:din21:167922321/toc-1929159/download)):

| Inhalt | 2013-02 | 2026-05 |
|---|---|---|
| Sommerklimaregionen | 8.1 | 8.2 (mit Bild 1) |
| Verzicht auf den Nachweis | 8.2.2, Tab. 6 | 8.3.2, Tab. 7 |
| Sonneneintragskennwerte | 8.3, Tab. 8 | 8.4, Tab. 8 |
| Thermische Simulation | 8.4, Tab. 9 | 8.5, Tab. 9 |
| Anhaltswerte F_C | eine Tab. 7 | eigener Abschnitt 8.6 mit Tab. 10 (außen, mit oberem und seitlichem Abdeckwinkel, Bild 4), Tab. 11 (Scheibenzwischenraum), Tab. 12 (mehrschalige Konstruktionen), Tab. 13 (innen) |
| Neu | – | Grundlagen 4.3 (u. a. 4.3.5 Nachtlüftung, 4.3.6 passive Kühlung, 4.3.7 wirksame Wärmekapazität), Anhang A (normativ, Rollladenkästen), Anhang B (informativ, individuelle Randbedingungen) |

Ob sich die Zahlenwerte S1 bis S6, die Grenzen der Tab. 6/7 und die F_C-Werte geändert haben, ist öffentlich nicht belegbar (kein Änderungsvermerk im Inhaltsverzeichnis). Die neue Aufteilung der F_C-Tabellen mit Abdeckwinkeln lässt neue Werte für außenliegende Vorrichtungen erwarten.

**Nachrechnungen** (Tab. 6–8 der Ausgabe 2013-02, eigene Umsetzung von S_vorh, S1–S6 und Verzichtsregeln):

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| SW1 | Beispiel 1: Wohnen, B, mittel, erhöhte Nachtlüftung, A_G = 25 m², Süd 11 m², g = 0,59, Rollladen ¾ | S_vorh = 0,0779; S_zul = 0,103 + 0,060 − 0,231·0,44 = 0,0614; kein Verzicht | identisch |
| SW2 | wie SW1, Raffstore 45°, schwer | S_vorh = 0,0649; S_zul = 0,0714 → erfüllt | identisch |
| SW3 | Beispiel 2: Dachfenster 45° (1,5 m², 3-fach, Rollladen ¾) + West 1,2 m² ohne Schutz, leicht, A_G = 14 m² | S_vorh = 0,0589; f_neig = 0,556; S_zul = 0,0840; Tab. 6-Grenze 7 % | identisch |
| SW4 | Nichtwohnen, C, hoch, schwer, passive Kühlung, Nord 4 m², g = 0,35, innen weiß | S_vorh = 0,0455; S_zul = 0,145 + 0,007 + 0,03 + 0,10 + 0,06 = 0,342 | identisch |
| SW5 | Wohnen, Süd 2 m², A_G = 25 m² (Randfall Verzicht) | f_WG = 8 % ≤ 10 % → Nachweis entbehrlich | identisch |

Die Beispiele im Modul (0,078/0,061; 0,065/0,071; 0,059/0,084; „ohne Nachtlüftung 0,052“) sind richtig. Die Tabellenwerte S1 (36 Werte), S2–S6 und F_C stimmen mit den Wiedergaben der Ausgabe 2013-02 überein.

**Befunde**
- **behoben – T3-SW-1:** Der Hinweis „Normenstand“ nannte die Neuausgabe nur pauschal („neu gegliedert“). Er nennt jetzt die neuen Abschnitts- und Tabellennummern (Tabelle oben). Kein Rechenfehler.
- **offen – Frage T3-SW-2:** § 14 GModG verweist laut Modul ausdrücklich auf DIN 4108-2:2013-02. Soll das Modul bis zu einer Anpassung des GModG bzw. der MVV TB bei der Ausgabe 2013-02 bleiben (Empfehlung) oder auf 2026-05 umgestellt werden? Für eine Umstellung sind die Tabellen 7–13 der Neuausgabe nötig (F-Freigabe).
- Hinweis: Die 35-%-Regel bewertet O, SO, S, SW und W; NO und NW zählen nicht zu „Ost-, Süd- oder Westorientierung“. Das ist eine vertretbare Auslegung und steht in den Grenzen.

**F-Freigabe-Stellen**
- Abgleich S1–S6, Tab. 6/7 und F_C mit DIN 4108-2:2026-05 (Tab. 7–13); Spaltenzuordnung F_C bei innenliegendem Sonnenschutz (aus Runde 4 bekannt).

**Empfehlung:** freigabefähig für den Normenstand 2013-02 nach Klärung von T3-SW-2.

- [ ] Modul freigeben

## 2. U-Wert-Varianten (`rechnung_u_wert`, `bp_glaeser` Reiter U_w)

**Prüfumfang:** Beispielrechnung U-Wert (`Beispielrechnungen.tsx` Zeilen 53–71, `RechnungUWert.tsx`, `content/beispielrechnungen/RechnungUWert.json`), Fensterkern `src/calc/fenster.ts` mit `BpGlaeser.tsx`, Grenzen, Lernziele. Der Kern `waermeschutz.ts` wurde in Tranche 1 geprüft; hier nur die Varianten.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| UW1 | Beton 20 cm (λ 2,3), EPS 14 cm (0,035), Putz 1,5 cm (0,70); R_si 0,13, R_se 0,04 | R_T = 4,278 m²K/W; U = 0,2337 W/(m²K) | identisch (Komponente und `uWert`) |
| UW2 | Beton 40 cm, EPS 12 cm | U = 0,2636 > 0,24 | identisch |
| UW3 | Fenster 1,23 × 1,48 m, Rahmen 110 mm, U_g 0,6, U_f 1,0, Ψ 0,038 | A_g = 1,0414 m²; U_w = 0,815 W/(m²K) | identisch |
| UW4 | Fenster 1,0 × 1,0 m, Rahmen 100 mm, U_g 1,1, U_f 1,3, Ψ 0,08 (Alu) | U_w = 1,428 > 1,3 | identisch |
| Regel | Mindestdicke EPS für U ≤ 0,24 über den ganzen Reglerbereich (Beton 10–40 cm, Putz 0,5–3 cm) | d_min = 13,8 cm → Rasterwert 14 cm | Aussage „mindestens 14 cm“ richtig |

**Befunde**
- **behoben – T3-UW-1:** Die Beispielrechnung nannte noch „Gebäudeenergiegesetz (GEG)“ und „GEG-konform“. Seit 29.07.2026 gilt das GModG (vgl. Tranche 1, B-1). Außerdem stand dort, Anlage 7 gelte „bei nachträglicher Sanierung **oder Neuerrichtung**“. Anlage 7 begrenzt nur die Änderung bestehender Gebäude; Neubauten werden über das Referenzgebäude nachgewiesen. Die Begründung „14 cm, um den Mindestwärmeschutz einzuhalten und Tauwasser zu verhindern“ verwechselte den Höchstwert nach Anlage 7 mit dem Mindestwärmeschutz nach DIN 4108-2 (R ≥ 1,2 m²K/W, mit wenigen Zentimetern Dämmung erfüllt). Die Aussage „Schimmelpilzbildung konstruktiv unterbunden“ ist ersetzt durch einen Hinweis auf Wärmebrücken. Im Fensterrechner wurden „GEG-Max“ und „GEG-Standard“ auf GModG umgestellt. Grenzen `rechnung_u_wert` ergänzt.
- Hinweis: Ψ-Werte des Fensterkerns (Alu 0,08, Edelstahl 0,06, warme Kante 0,038 W/(mK)) sind Lehrwerte; DIN EN ISO 10077-1 unterscheidet zusätzlich nach Rahmenmaterial.

**F-Freigabe-Stellen**
- Höchstwerte Anlage 7 GModG (Außenwand 0,24, Fenster 1,3 W/(m²K)) unverändert gegenüber GEG (Frage B-2 aus Tranche 1).
- Ψ-Tabellenwerte DIN EN ISO 10077-1:2020-10, Anhang (Tabellenwerte nach Rahmenmaterial).

**Empfehlung:** freigabefähig nach Korrektur T3-UW-1 (F-Stelle B-2 aus Tranche 1 gilt mit).

- [ ] Modul freigeben (`rechnung_u_wert`)
- [ ] Modul freigeben (`bp_glaeser`, nur Reiter U_w-Rechner; übrige Reiter nicht Teil dieser Prüfung)

## 3. Mauerwerk – Bemessungsreiter und erweiterte Bedingungen (`mauerwerk`)

**Prüfumfang:** Reiter „Festigkeit & Bemessung“ in `src/modules/Mauerwerk.tsx` (f_k nach EN-Empfehlung, Lastausmitte, Schub, Überbindemaß), Steindaten `content/mauerwerk/Mauerwerk.json` (`stoneTypes`), Kern `src/calc/mauerwerk.ts` mit den am 27.10. eingeführten erweiterten Bedingungen für h > 2,75 m (DIN EN 1996-3/NA:2019-12, Tab. NA.2; KS-Merkblatt 04/2020), Lernziele. Der Nachweis im vereinfachten Verfahren für h ≤ 2,75 m wurde in Tranche 1 geprüft.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern / Komponente |
|---|---|---|---|
| MW1 | Mauerziegel, NM, f_b = 12, f_m = 5 (K = 0,55); t = 24 cm, e = 5 cm | f_k = 0,55·12^0,7·5^0,3 = 5,076; f_d = 2,876 N/mm²; Φ = 1 − 2e/t = 0,583; N_Rd = 402,7 kN/m | identisch |
| MW2 | Hochlochziegel, Dünnbettmörtel (Gruppe 2, K = 0,70), f_b = 12 | f_k = 0,70·12^0,7 = 3,986 | identisch |
| MW3 | Kalksandstein, Dünnbettmörtel (Gruppe 1, K = 0,80), f_b = 20 | f_k = 0,80·20^0,85 = 10,209 | identisch |
| MW4 | Schub: f_vk0 = 0,2, σ_d = 1,0 bzw. 2,0 N/mm², f_b = 12 | f_vk = 0,60; bei σ_d = 2,0 begrenzt auf 0,065·f_b = 0,78 | identisch |
| MW5 | Innenwand h = 3,50 m, t = 175 mm, f_k = 7,1 (erweiterte Bedingungen) | h_ef = 2,625 m; Φ₂ = 0,85 − 0,0011·15² = 0,6025; n_Rd = 424,2 kN/m; Hinweis „t ≥ 115 mm bis h ≤ 3,60 m“ | identisch |
| MW6 | wie MW5, h = 3,80 m (Randfall) | außerhalb des vereinfachten Verfahrens | Hinweis „> 3,60 m“ |

Überbindemaß ü ≥ 0,4·h_u ≥ 45 mm (NA DE) und die Zuordnung Läufer l/2, Block/Kreuz l/4 sind richtig.

**Befunde**
- behoben: keine.
- **offen – Frage T3-MW-1 (Haftscherfestigkeit):** f_vk0 ist je Mörtelart fest hinterlegt, nicht nach der Mörtelklasse. Gegenüber den Empfehlungswerten der EN 1996-1-1, Tab. 3.4 weichen ab: Hochlochziegel NM 0,15 / LM 0,10 / DM 0,20 (Tab. 3.4 für Ziegel: 0,20 bei M2,5–M9 / 0,15 / 0,30), Kalksandstein NM 0,20 (gilt erst für M10–M20; bei M2,5–M9 0,15). In Deutschland gelten ohnehin die f_vk0-Werte des NA. Frage: Werte an EN-Tab. 3.4 (mit Mörtelklasse aus f_m) angleichen oder auf die NA-Werte umstellen?
- **offen – Frage T3-MW-2 (K-Werte):** Für Lehmsteine sind K = 0,35/0,30/0,50 hinterlegt. EN 1996-1-1 enthält keine Lehmsteine; Lehmmauerwerk wird nach DIN 18940 bemessen. Für Kalksandstein mit Leichtmörtel (K = 0,45) sieht Tab. 3.3 keinen Wert vor. Frage: Lehmstein und KS + LM im f_k-Rechner sperren oder als „nicht genormt“ kennzeichnen?
- Hinweis: Die Komponente rechnet N_Rd ohne Knickeinfluss (Φ_m); das ist im Text als Vergleich gekennzeichnet (Tranche 1).

**F-Freigabe-Stellen**
- Tab. NA.2 (Außenwände h > 2,75 m) nicht hinterlegt, nur Hinweis (aus Kern, Entscheidung 27.10.).
- f_vk0 nach NA DE (falls T3-MW-1 so entschieden wird).

**Empfehlung:** freigabefähig nach Klärung von T3-MW-1 und T3-MW-2.

- [ ] Modul freigeben

## 4. Frischbeton / LP-Gehalt (`frischbeton`)

**Prüfumfang:** `src/modules/Frischbeton.tsx` (Reiter Konsistenz & Toleranzen, Luftgehalt & Rohdichte), neuer Kern `src/calc/frischbeton.ts`, `content/frischbeton/Frischbeton.json`, Grenzen, Lernziele. Unterreiter Ausbreitversuch, Frischbetondruck und Frischbetontemperatur nicht im Detail (eigene Module).

**Klärung `qn_frischbeton_4` (Auftrag):** Ja, „Mindestwert + 4 %“ ist eine Normgröße. DIN EN 206, 5.4.3: Wird der Luftgehalt als Mindestwert festgelegt, ist die **obere Grenze der festgelegte Mindestwert + 4 % (absolut)** – öffentlich wiedergegeben bei Glinicki, M. A.: „Właściwe napowietrzenie betonu“, Budownictwo, Technologie, Architektura 2/2004 ([PDF](https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-article-BTB2-0059-0196/c/Glinicki_Wlasciwe_2_2004.pdf)). Einzelwerte dürfen den unteren Grenzwert um höchstens 0,5 % unterschreiten und den oberen Grenzwert um höchstens 1,0 % überschreiten (DIN EN 206-1, Konformitätskriterien für andere Eigenschaften als die Festigkeit, Tab. 17; [umwelt-online](https://umwelt-online.de/recht/bau/din/206_1e.htm)). Für den Fall der Frage (XF4, D_max = 16 mm, 9,0 %) folgt: Mindestwert 4,5 % erfüllt, obere Grenze 8,5 % überschritten, als Einzelwert noch innerhalb der Grenzabweichung (≤ 9,5 %); das Ergebnis zählt bei der Konformitätskontrolle als außerhalb des Grenzwerts. Die richtige Antwort der Frage bleibt richtig, nur „Richtwert“ ist falsch (siehe Hinweis Quiz unten).

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| FB1 | Beispiel: XF4, D_max = 32 mm, Ablesung 4,8 %, G = 0,2 % | L = 4,6 %; Mindestwert 4,0 %, Einzelwert ≥ 3,5 %; obere Grenze 8,0 % → erfüllt | identisch |
| FB2 | XF4, D_max = 16 mm, L = 9,0 % | obere Grenze 8,5 %; oberer Einzelwert 9,5 % → über der Grenze, Einzelwert zulässig | identisch (vorher: „Mindestluftporengehalt unterschritten“) |
| FB3 | XF2, D_max = 8 mm, L = 5,2 / 5,0 / 4,9 % | Mindestwert 5,5 %, Einzelwert ≥ 5,0 % → Grenzbereich / Grenzbereich / unterschritten | identisch |
| FB4 | Frischbetonrohdichte m₁ = 10,2, m₂ = 29,1 kg, V = 8 l | D = 2 362,5 kg/m³ (Normalbeton) | identisch |

**Befunde**
- **behoben – T3-FB-1:** (a) Die obere Grenze hieß im Code „maximal empfohlener Luftgehalt (~4 % über Sollwert)“, im Text „Richtwert: max. 4 Vol.-% über Sollwert“ und in den Grenzen „keine Normgröße“. Sie ist der Grenzwert nach DIN EN 206, 5.4.3, bezogen auf den Mindestwert. (b) Ein zu hoher Luftgehalt wurde mit „Achtung: Mindestluftporengehalt unterschritten!“ gemeldet. (c) Die Grenzabweichung der Einzelwerte nach oben (+1,0 %) fehlte. Die Bewertung liegt jetzt im Kern `bewerteLuftgehalt` mit sechs Zuständen; die Anzeige zeigt obere Grenze und oberen Einzelwert und färbt den Grenzbereich gelb. Tests: `tests/frischbeton.test.ts` (Beispiel, Quizfall, Grenzen, Fehler, Fuzz) und Tranche-3-Regression.
- **offen – Frage T3-FB-2 (Konsistenz-Grenzabmaße):** Der Toleranzprüfer staffelt das Setzmaß mit ±10/±20/±30/**±40 mm (> 150 mm)** und das Ausbreitmaß mit ±20 (≤ 400)/±30 (≤ 540)/±40 mm. Öffentlich belegt ist nur die Dreistufung beim Setzmaß (±10/±20/±30) und beim Verdichtungsmaß. Bitte die Staffeln am Normtext DIN EN 206 (Grenzabweichungen für Zielwerte der Konsistenz) bestätigen.
- Hinweis: Die Auswahl „X0 / XF1 / XF3 (ohne LP-Anforderung)“ blendet aus, dass XF3 auch als LP-Beton (w/z 0,55, C25/30) ausgeführt werden darf; in den Grenzen ergänzt.

**F-Freigabe-Stellen**
- Tabellennummer der Grenzabweichung −0,5/+1,0 % in DIN EN 206:2021-06 (in DIN EN 206-1:2001 Tab. 17).

**Hinweis Quiz (nicht geändert, für den laufenden Quiz-Abgleich):** `qn_frischbeton_4`, Option C „Richtwert 8,5 % aber überschritten“ → „obere Grenze 8,5 % (DIN EN 206, 5.4.3) überschritten“; Erklärung „Laut Modul soll der Luftgehalt … höchstens rund 4 Vol.-% über dem Mindestwert liegen“ → „Nach DIN EN 206, 5.4.3 ist die obere Grenze Mindestwert + 4 % (hier 8,5 %); als Einzelwert sind bis 9,5 % zulässig, das Ergebnis zählt aber als außerhalb des Grenzwerts.“

**Empfehlung:** freigabefähig nach Korrektur T3-FB-1 und Klärung von T3-FB-2.

- [ ] Modul freigeben

## 5. Hydratation / Reife (`hydratation_folgen`)

**Prüfumfang:** `src/calc/hydratation.ts` (Reifefunktionen, Festigkeitsentwicklung, Wärme), Reiter Hydratation & Reife, Anwendungsbeispiele in `content/hydratationfolgen/HydratationFolgen.json`, Grenzen, Lernziele, Kurzfassung. Reißrahmen, Rissnachweis und Kriechen/Schwinden nicht im Detail (Kerne aus Tranche 1/2 bzw. Lehrmodelle).

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| HY1 | Arrhenius, E_a = 38 kJ/mol, T = 10 °C | k_T = exp[E_a/R·(1/293,15 − 1/283,15)] = 0,5766 | identisch |
| HY2 | fib MC 2010 (4 000 K), T = 5 °C | k_T = 0,4791 | identisch |
| HY3 | Saul, 48 h bei 10 °C (Beispiel des Moduls) | M = 960 °C·h; t₂₀ = 32 h | identisch |
| HY4 | gewogene Reife, C = 1,45, T = 5 °C | C^((T − 20)/10) = 0,5727 | identisch (siehe T3-HY-1) |
| HY5 | s = 0,25, t_e = 7 d, C30/37 | β_cc = 0,7788; f_cm = 29,59; f_ctm = 2,256 N/mm²; E_cm = 30,46 GPa | identisch |
| HY6 | z = 320 kg/m³, Q = 350 J/g | ΔT_ad = 46,7 K (c·ρ = 2 400) | identisch |

**Befunde**
- behoben: keine.
- **offen – Frage T3-HY-1 (Form der gewogenen Reife):** Nach meinem Kenntnisstand lautet die integrierte gewogene Reife nach de Vree/NEN 5970 R = Σ 10·(C^(0,1·T − 1,245) − C^(−2,245))/ln C · Δt in °C·h (Datumstemperatur −10 °C; die Struktur „10(…)/ln …“ ist in Kasal, ČVUT 2020, erkennbar, die Konstanten sind öffentlich nicht lesbar). Bezogen auf 20 °C ergibt diese Form andere Faktoren als der im Kern verwendete Temperaturfaktor C^((T − 20)/10): bei C = 1,45 und 5 °C 0,364 statt 0,573, bei 35 °C 2,11 statt 1,75. Frage: Form am Normtext NEN 5970 bestätigen und ggf. auf die integrierte Form umstellen? Bis dahin bleibt der Wert „vorläufig, F-Freigabe“ (wie im Kern vermerkt).
- **offen – Frage T3-HY-2:** Das Anwendungsbeispiel rechnet ΔT_ad mit c·ρ = 2 500 kJ/(m³K) (44,8 K ≈ 45 K), der Kern mit 2 400 (46,7 K). Beides sind Lehrwerte. Angleichen?
- Hinweis (Kurzfassung): „E-Modul nach 2 Tagen etwa 70 bis 80 %“ – nach Gl. 3.2/3.5 sind es 73 % (S), 81 % (N) und 85 % (R). „Etwa 70 bis 85 %“ wäre genauer.

**F-Freigabe-Stellen**
- Gewogene Reife nach NEN 5970: Form und C-Bereich (1,15 … 1,75) (aus Kern, Entscheidung 27.10.).
- Zuordnung der L-Zemente zur Klasse S/N (aus Kern).

**Empfehlung:** Rechnung freigabefähig; die gewogene Reife bleibt bis zur Klärung von T3-HY-1 „vorläufig“.

- [ ] Modul freigeben

## 6. Expositionsklassen (`expositionsklassen`)

**Prüfumfang:** `src/calc/expositionsklassen.ts`, Klassendaten `src/modules/expositionsklassen/daten.ts` (21 Klassen), XA-Grenzwerte und Feuchtigkeitsklassen in `content/expositionsklassen/daten.json`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| EX1 | XC4 + XF4, D_max = 16 mm, Δc_dev = 15 mm | (w/z)_eq ≤ 0,50; C30/37; z ≥ 320 kg/m³; LP ≥ 4,5 %; c_min,dur = 25; c_nom = 40 mm | identisch |
| EX2 | XD3 + XF2 + XA2, D_max = 32 mm | 0,45; C35/45; 320; LP ≥ 4,0 %; c_min,dur = 40; c_nom = 55 mm | identisch |
| EX3 | k-Wert: z = 300, w = 165, f = 120, s = 20 kg/m³ | f anrechenbar 99 kg; z_eq = 300 + 0,4·99 + 20 = 359,6; (w/z)_eq = 0,459; f ≤ 0,66·z − 3·s = 138 eingehalten | identisch |
| EX4 | nur XC1, Δc_dev = 10 mm | c_nom = 20 mm, Hinweis Δc_dev = 10 mm | identisch |

Die Klassendaten (w/z, Mindestfestigkeit, Mindestzementgehalt, Luftgehalte je Größtkorn, c_min,dur nach Tab. 4.4DE) und die XA-Grenzwerte (Sulfat, pH, CO₂, NH₄⁺, Mg²⁺, Sulfat im Boden) stimmen mit DIN 1045-2 bzw. DIN EN 206, Tab. 2 überein.

**Befunde**
- behoben: keine.
- **offen – Frage T3-EX-1 (XF2/XF3 ohne LP):** Der Hüllwertrechner setzt für XF2 und XF3 immer die LP-Variante an (w/z 0,55, C25/30, 300 kg/m³ mit LP). DIN 1045-2 lässt beide Klassen auch ohne LP zu (w/z 0,50, C35/45, 320 kg/m³); der Text nennt die Alternative. Soll ein Schalter „mit/ohne LP“ ergänzt werden?
- **offen – Frage T3-EX-2 (AKR):** Bei WA steht „Gesteinskörnung E I oder E II-S mit Eignungsnachweis; NA-Zement obligatorisch“. Nach der Alkali-Richtlinie sind bei E I keine vorbeugenden Maßnahmen nötig, und „E II-S“ ist keine Alkaliempfindlichkeitsklasse. Bitte Wortlaut am Normtext (DAfStb-Alkali-Richtlinie 2013, Tabellen der Maßnahmen) prüfen.

**F-Freigabe-Stellen:** keine neuen (Anrechnung von Zusatzstoffen bei XF2/XF4, Frage M-6 aus Tranche 1, gilt mit).

**Empfehlung:** freigabefähig nach Klärung von T3-EX-1 und T3-EX-2.

- [ ] Modul freigeben

## 7. Stahlbau EC 3 (`stahlbau_ec3`)

**Prüfumfang:** `src/calc/stahlbau.ts`, Stahlkennwerte `src/data/kennwerte.ts`, Profiltabelle (10 Walzprofile), `content/stahlbauec3/StahlbauEC3.json` (drei Beispiele, Formeln, Regelwerke), Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| ST1 | HEB 200, S235, L_cr,y = L_cr,z = 4 m, N_Ed = 800 kN | λ̄_z = 0,840 (Linie c); χ_z = 0,637; N_b,Rd = 1 063 kN; λ̄_y = 0,499 (Linie b) → 1 476 kN | identisch |
| ST2 | IPE 300, S355, Biegung | Flansch c/t = 5,28 ≤ 9ε = 7,32; Steg 35,0 ≤ 72ε = 58,6 → Klasse 1; M_pl,Rd = 223,1 kNm | identisch |
| ST3 | Zugstab A = 20 cm², A_net = 17 cm², S355 | N_pl,Rd = 710 kN; N_u,Rd = 0,9·1 700·490/1,25 = 599,8 kN (maßgebend) | identisch |
| ST4 | HEA 300, S460, L_cr = 2 m, N_Ed = 100 kN (Randfall) | Flansch c/t = 8,48 (Klasse 3), Steg 24,5 (Klasse 2) → Klasse 3; Linie a (S460, h/b ≤ 1,2); N_Ed/N_cr,z = 0,003 ≤ 0,04 → Knicken entfällt; N_Rd = N_c,Rd = 5 175 kN | identisch |

Die drei Beispiele des Moduls (Flachstahl 254,0 kN; IPE 300 S235 147,7/130,9 kNm; HEB 200 1 063 kN, 58 % von N_c,Rd) sind richtig. Die Profilwerte stimmen mit den Bautabellen überein. f_u = 490 N/mm² für S355 (t ≤ 40 mm, EN 10025-2) ist der Wert der Tab. 3.1 ([Eurocode Applied, Stahlkennwerte](https://cdn.eurocodeapplied.com/design/en1993/steel-design-properties); 510 N/mm² gilt für Hohlprofile nach EN 10210-1). Knicklinien nach Tab. 6.2 und γ_M1 = 1,1 (NA DE) richtig.

**Befunde**
- **behoben – T3-ST-1:** „W_pl,y etwa 12 bis 15 % größer als W_el,y“ – für die hinterlegten HEA-Profile sind es 9,8 bis 11,4 %. Text auf „etwa 10 bis 15 %“ mit Aufschlüsselung korrigiert.
- offen: keine.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 8. Asphalt (`asphalt`)

**Prüfumfang:** `src/calc/asphalt.ts` (Roh-/Raumdichte, Marshall-Lehrkurve, NTA-Lehrmodell), `content/asphalt/Asphalt.json`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| AS1 | Beispiel: B = 5 M.-%, V_m = 3 %, ρ_G = 2,65, ρ_B = 1,03 g/cm³ | ρ_m = 100/40,70 = 2,4568; ρ_b = 2,3831 g/cm³ | identisch |
| AS2 | B = 6 M.-%, V_m = 4 %, ρ_G = 2,70, ρ_B = 1,02 | ρ_m = 2,4572; ρ_b = 2,3589 | identisch |
| AS3 | NTA Standard, 165 °C | Aerosol 0,045·e^(0,029·165) = 5,39 mg/m³ (Lehrmodell) | identisch |
| AS4 | NTA organisch, 130 °C | η = 0,4·1,06³⁵·0,38 = 1,17 Pa·s (optimal); Fenster 38·ln(115/70) = 19 min | identisch |
| AS5 | Marshall-Lehrkurve | 12 kN bei 5,5 M.-%; 9 kN bei 7,0 M.-% | identisch |

**Befunde**
- **behoben – T3-AS-1:** „Die Übergangsfrist für den Straßenbau endete Ende 2024“ ist überholt. Die Anwendung des AGW 1,5 mg/m³ für Walzasphalt wurde mehrfach ausgesetzt, zuletzt bis 31.12.2026; ab 01.01.2027 ist er einzuhalten ([Handwerksblatt: „Temperaturabgesenkter Asphalt wird 2027 Pflicht“](https://www.handwerksblatt.de/betriebsfuehrung/temperaturabgesenkter-asphalt-wird-2027-pflicht); [ARS 08/2026, Einführung ZTV Asphalt-StB 26 Teil 1](https://www.ingenieurkammer.de/fileadmin/dokumente/News/PDF-Dateien/2026_06_05_Einf_ARS_2026_08-ZTV_Asphalt_T1.pdf)).
- **behoben – T3-AS-2:** Regelwerke nannten ZTV Asphalt-StB 07/13 als geltend. Mit ARS 08/2026 (25.03.2026) gilt die ZTV Asphalt-StB 26 Teil 1, die TL Asphalt-StB 26 ist am 23.04.2026 erschienen ([FGSV, Pressemitteilung](https://www.fgsv.de/fileadmin/PRESSE/Pressemitteilungen/2026-04-23_TL_ZTV_Asphalt_StB_26.pdf)). 07/13 bleibt als Vorgängerausgabe genannt.
- Hinweis: NTA-Viskosität, Aerosol, Energie, CO₂ und Abkühlung sind gekennzeichnete Lehrmodelle (keine Messwerte).

**F-Freigabe-Stellen**
- Mindest-Lufttemperaturen beim Einbau (Deckschicht +5/+10 °C, Binder 0 °C, Tragschicht −3 °C) nach ZTV Asphalt-StB 07/13, Tab. 6; Abgleich mit ZTV Asphalt-StB 26 Teil 1 ausstehend (im Text so gekennzeichnet).

**Empfehlung:** freigabefähig nach Korrektur T3-AS-1/-2 und Klärung der F-Stelle.

- [ ] Modul freigeben

## 9. Brandschutz (`brandschutz`, `rechnung_brandschutz`)

**Prüfumfang:** `src/modules/Brandschutz.tsx` und `content/brandschutz/Brandschutz.json` (Baustoffklassen, R/E/I, ETK, Abbrand), Beispielrechnung Heißbemessung (`Beispielrechnungen.tsx` Zeilen 365–388, `RechnungBrandschutz.tsx`, `content/beispielrechnungen/RechnungBrandschutz.json`), Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Komponente / Daten |
|---|---|---|---|
| BR1 | ETK nach 30/60/90 min | θ = 20 + 345·lg(8t + 1) = 842 / 945 / 1 006 °C | identisch (Beispiel 1) |
| BR2 | BSH 200/400, 3-seitig, β_n = 0,7, 30 und 60 min | d_ef = 28 / 49 mm; 144 × 372 / 102 × 351 mm; W/W₀ = 0,62 / 0,39 | identisch (Beispiel 2) |
| BR3 | Heißbemessung GL28h 18/36 cm, R60, 3-seitig, M_Ed = 45 kNm | d_ef = 42 + 7 = 49 mm; b_ef × h_ef = 82 × 311 mm; f_m,fi,d = 1,15·28 = 32,2; M_fi,Rd = 42,56 kNm; η_fi·M_Ed = 27 kNm → Ausnutzung 63 % | Formel der Inline-Rechnung abgeglichen, gleiches Ergebnis |
| BR4 | C24 12/24 cm, R30, 4-seitig | d_ef = 31 mm; 58 × 178 mm; M_fi,Rd = 9,19 kNm (k_fi = 1,25) | Formel abgeglichen, gleiches Ergebnis |
| BR5 | Tabellenwerte Balken/Platten DIN EN 1992-1-2 | Tab. 5.5 erste Spalte 80/25, 120/40, 150/55, 200/65 mm; Tab. 5.8 h_s 60/80/100/120 mm | **vorher abweichend**, jetzt identisch |

Abbrandraten (0,8 Nadelvollholz, 0,7 BSH, 0,55 Laubholz), k_fi (1,25/1,15), d₀ = 7 mm und η_fi = 0,6 entsprechen DIN EN 1995-1-2.

**Befunde**
- **behoben – T3-BR-1:** Die Tabelle „Stahlbeton: Mindestmaße“ kombinierte die Breite der ersten mit dem Achsabstand einer anderen Spalte der Tab. 5.5: R60 120/35, R90 160/45, R120 200/55 mm. Richtig sind 120/40, 150/55 und 200/65 mm ([Acta Technica Napocensis 57 (2014) 2, Tab. 4](https://oldconstructii.utcluj.ro/ActaCivilEng/download/atn/ATN2014(2)_4.pdf): b_w,min 80/120/150/200, a 25/40/55/65 mm). Für die angegebene Breite lag der Achsabstand auf der unsicheren Seite (bis 10 mm zu klein). Die Werte stehen jetzt in `src/data/brandschutzBeton.ts`, die Tabelle wird daraus erzeugt; Test in `tests/modulpruefungTranche3.test.ts`. Der Erklärtext nennt die weiteren Kombinationen (z. B. R90 200/45, 300/40).
- **offen – Frage T3-BR-2 (Stützen):** Die Stützenspalte (200/25, 250/35, 300/45, 350/55) gibt keinen Ausnutzungsgrad μ_fi an; R60 250/35 und R120 350/55 passen zu keiner einzelnen Spalte der Tab. 5.2a. Vorschlag: auf μ_fi = 0,5 festlegen (nach meinem Kenntnisstand R30 200/25, R60 200/36 bzw. 300/31, R90 300/45, R120 350/45) oder die Spalte entfernen. Bis dahin „vorläufig, F-Freigabe“ im Text.
- **offen – Frage T3-BR-3 (Abplatzen):** „Nach DIN EN 1992-1-2 ist bei hochfestem Beton die Zugabe von mindestens 2 kg/m³ PP-Fasern zwingend“. DIN EN 1992-1-2, 6.2 nennt für C55/67 bis C80/95 mehrere gleichwertige Methoden (u. a. Bewehrungsnetz, Nachweis, Schutzschicht, PP-Fasern ≥ 2 kg/m³). Bitte am NA DE prüfen, ob PP-Fasern dort vorgeschrieben sind; sonst „zwingend“ durch „eine der Methoden, z. B.“ ersetzen.
- Hinweis: Das Fachmodul zeigt den Abbrand ohne d₀ (Darstellung); der Text verweist für die Bemessung auf DIN EN 1995-1-2.

**F-Freigabe-Stellen**
- Stützenmaße Tab. 5.2a (T3-BR-2); Regel zum Abplatzen nach NA DE (T3-BR-3).

**Empfehlung:** freigabefähig nach Korrektur T3-BR-1 und Klärung von T3-BR-2/-3.

- [ ] Modul freigeben (`brandschutz`)
- [ ] Modul freigeben (`rechnung_brandschutz`)

## 10. Schallschutz-Trittschall (`schallschutz` Reiter Trittschall, `rechnung_schallschutz`)

**Prüfumfang:** Trittschallteil von `src/calc/schall.ts`, `src/modules/schallschutz/TrittschallTab.tsx`, `content/schallschutz/TrittschallTab.json`, Formeln und Beispiele in `Schallschutz.json`, Beispielrechnung `rechnung_schallschutz` (Massekurve nach der Umstellung vom 27.10.), Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| TS1 | Standardwerte: Rohdecke 18 cm, 2 400 kg/m³ + 10 kg/m²; Estrich 5 cm, 2 000 kg/m³; s′ = 20 MN/m³; m′_f,m = 250 kg/m² | m′ = 442; L_n,eq,0,w = 71,41; ΔL_w = 28,33; K = 1,96; L′_n,w = 45,05 dB; + 3 dB = 48,0 ≤ 50 dB | identisch |
| TS2 | Rohdecke 14 cm, Estrich 4,5 cm (2 200), s′ = 30, m′_f,m = 350 | m′ = 336; L′_n,w = 50,31 dB; 53,3 > 50 dB → nicht erfüllt | identisch |
| TS3 | Rohdecke 300 kg/m², Flanken 450 kg/m² (Randfall) | K rechnerisch −0,37 dB → 0 dB | identisch |
| TS4 | HLz 24 cm, 800 kg/m³ + Putz 15 + 36 kg/m² (Beispiel) | m′ = 243; R_w = 30,9·lg 243 − 22,2 = 51,5 dB | identisch |
| TS5 | f₀ bei s′ = 20, m′ = 100 | exakt 71,18 Hz; Kern (Faktor 160) 71,55 Hz | 0,5 % (Näherung) |

Die Beispiele (366 kg/m² für 57 dB, +9,3 dB je Masseverdopplung) und die Anforderungen (50 dB Mehrfamilienhaus, 53 dB DIN 4109:1989, Treppen 53/46 dB vorläufig) sind richtig. Der Hinweis „30 dB je Dekade“ oberhalb f₀ entspricht dem Ansatz für Nassestriche.

**Befunde**
- behoben: keine.
- **offen – Frage T3-TS-1:** Das Beispiel Hochlochziegel (HLz 24 cm, ρ = 800 kg/m³) wendet die Massekurve der DIN 4109-32 an. Für Lochsteine mit großem Lochanteil oder Dämmstofffüllung gilt sie nach DIN 4109-32 nur eingeschränkt; maßgebend sind dann Prüfwerte bzw. eigene Gleichungen. Hinweis im Beispiel ergänzen?

**F-Freigabe-Stellen** (aus Tranche 1, unverändert)
- ΔL_w = 13·lg m′ − 14,2·lg s′ + 20,8 dB (DIN 4109-34).
- K = 0,6 + 5,5·lg(m′_s/m′_f,m) mit Untergrenze 0 dB und Rundung (DIN 4109-2).
- Treppenwerte 53 dB und 46 dB (DIN 4109-1:2018-01).

**Empfehlung:** freigabefähig nach Klärung der F-Stellen und von T3-TS-1.

- [ ] Modul freigeben (`schallschutz`, Reiter Trittschall; Luftschall in Tranche 1)
- [ ] Modul freigeben (`rechnung_schallschutz`)

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage |
|---|---|---|
| T3-SW-2 | Sommerlicher Wärmeschutz | Bei DIN 4108-2:2013-02 bleiben, solange § 14 GModG darauf verweist (Empfehlung), oder auf 2026-05 umstellen? |
| T3-MW-1 | Mauerwerk | f_vk0 an EN 1996-1-1 Tab. 3.4 (je Mörtelklasse) angleichen oder NA-Werte verwenden? |
| T3-MW-2 | Mauerwerk | Lehmstein und KS + Leichtmörtel im f_k-Rechner sperren oder als „nicht genormt“ kennzeichnen? |
| T3-FB-2 | Frischbeton | Staffeln der Konsistenz-Grenzabmaße (Setzmaß ±40 mm über 150 mm, Ausbreitmaß ±20/±30/±40) bestätigen. |
| T3-HY-1 | Hydratation | Gewogene Reife: integrierte Form nach NEN 5970 statt C^((T − 20)/10)? (5 °C: 0,364 statt 0,573) |
| T3-HY-2 | Hydratation | c·ρ im Beispiel (2 500) und im Kern (2 400) angleichen? |
| T3-EX-1 | Expositionsklassen | Schalter „XF2/XF3 mit/ohne LP“ im Hüllwertrechner ergänzen? |
| T3-EX-2 | Expositionsklassen | AKR-Text zu WA (E I, „E II-S“, NA-Zement) an der Alkali-Richtlinie prüfen. |
| T3-BR-2 | Brandschutz | Stützenspalte auf μ_fi = 0,5 festlegen oder entfernen? |
| T3-BR-3 | Brandschutz | PP-Fasern bei hochfestem Beton „zwingend“ (NA DE) oder eine von mehreren Methoden? |
| T3-TS-1 | Schallschutz | Hinweis zur eingeschränkten Gültigkeit der Massekurve für Hochlochziegel ergänzen? |

## Nachweis der Prüfung

- Unabhängige Nachrechnung: eigenes Skript (Python) mit eigener Umsetzung der Norm- und Modellgleichungen, Vergleich gegen die Kernausgaben und Tabellendaten (83 Vergleiche im Test); die Inline-Rechnungen (Heißbemessung Holz, Mauerwerksreiter) wurden über die Formeln abgeglichen. Die Sollwerte sind als `tests/modulpruefungTranche3.test.ts` übernommen.
- Öffentliche Quellen dieser Prüfung: [DIN Media, DIN 4108-2:2026-05](https://www.dinmedia.de/en/standard/din-4108-2/401017482); [DIN, Inhaltsverzeichnis DIN 4108-2:2026-05](https://www.din.de/de/mitwirken/normenausschuesse/nabau/veroeffentlichungen/wdc-beuth:din21:401017482/toc-3688761/download); [DIN, Inhaltsverzeichnis DIN 4108-2:2013-02](https://www.din.de/de/mitwirken/normenausschuesse/nabau/veroeffentlichungen/wdc-beuth:din21:167922321/toc-1929159/download); [Glinicki 2004 (Luftgehalt, EN 206)](https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-article-BTB2-0059-0196/c/Glinicki_Wlasciwe_2_2004.pdf); [umwelt-online, DIN EN 206-1](https://umwelt-online.de/recht/bau/din/206_1e.htm); [Kasal, ČVUT 2020 (gewogene Reife)](https://concrete.fsv.cvut.cz/phdworkshop/proceedings/2020/pdf/Kasal_Pavel.pdf); [Giatec, Maturity Methods](https://www.giatecscientific.com/?p=26197); [Eurocode Applied, Stahlkennwerte EN 1993-1-1](https://cdn.eurocodeapplied.com/design/en1993/steel-design-properties); [Handwerksblatt, AGW Bitumen ab 2027](https://www.handwerksblatt.de/betriebsfuehrung/temperaturabgesenkter-asphalt-wird-2027-pflicht); [ARS 08/2026](https://www.ingenieurkammer.de/fileadmin/dokumente/News/PDF-Dateien/2026_06_05_Einf_ARS_2026_08-ZTV_Asphalt_T1.pdf); [FGSV, TL/ZTV Asphalt-StB 26](https://www.fgsv.de/fileadmin/PRESSE/Pressemitteilungen/2026-04-23_TL_ZTV_Asphalt_StB_26.pdf); [Acta Technica Napocensis 2014 (EC2-1-2 Balken)](https://oldconstructii.utcluj.ro/ActaCivilEng/download/atn/ATN2014(2)_4.pdf).
