# Modulprüfung Tranche 10 – Holzbau und Mechanik (Befundliste zur Freigabe)

**Stand:** 28.10.2026 (Branch `pruefung/module-tranche10-10-28`, Basis origin/main b2cb8367, main b0169af5 eingemergt)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke und **keine** Quizfragen geändert.

## Vorgehen

- **Auswahl (14 Module):** Gruppe Holzbau ohne die Bemessung (`holzbau_info`, `holzbau_werkstoffe`, `holzbau_konstruktion`, `holzbau_verbindung`, `holzbau_bauphysik`; `holzbau_bemessung` wurde in Tranche 1 geprüft) und Gruppe Mechanik (`mechanik_info`, `mechanische_kenngroessen`, `formaenderungen`, `materialmodelle`, `emodul`, `festigkeit`, `baustatik`, `knicken`, `bruchmechanik`).
- **Prüfumfang je Modul:** wie Tranche 1 bis 3.
  - Rechenkern mit mindestens drei eigenen Nachrechnungen: eigenes Python-Skript, eigene Umsetzung der Norm- bzw. Modellgleichungen, Randfälle eingeschlossen.
  - Module ohne Rechnung: Stichprobe von mindestens fünf Aussagen gegen öffentliche Quellen.
  - Außerdem: Fachtext (`content/*.json`) und Normstand, Grenzen (`src/data/rechnerGrenzen.ts`), Beispiele, Lernziele, Quellen und Stellen „vorläufig, F-Freigabe“.
- **Ergebnis der Nachrechnung:** 98 Einzelvergleiche, dazu 404 Formprüfungen der Knick-Eigenformen. Nach Korrektur stimmen alle innerhalb von 0,5 %. Die Sollwerte stehen als Regressionstest in `tests/modulpruefungTranche10.test.ts`.
- **Inline-Rechnungen:**
  - Der Abbrandrechner (bisher in `HolzbauBeta.tsx`) liegt jetzt als `abbrandQuerschnitt` in `src/calc/holzbau.ts`; das Verhalten ist unverändert.
  - Die Knickfigur nutzt die neue Funktion `eulerEigenform` in `src/calc/stabilitaet.ts`.
  - Die Bruchmechanik (K_I = Y·σ·√(π·a)) und der Schwindrechner im Reiter Werkstoffe rechnen weiter in der Komponente. Ihre Formeln wurden Zeile für Zeile abgeglichen.
- Es wurden nur öffentliche Quellen verwendet und keine Normtexte abgeschrieben. Wo der Normtext zur Bestätigung nötig ist, steht die Stelle unter „F-Freigabe“.

## Normstand Eurocode 5 (Auftrag: DIN EN 1995-1-1:2026-09)

| Dokument | Stand | Quelle |
|---|---|---|
| DIN EN 1995-1-1:2026-09 (Deutsche Fassung EN 1995-1-1:2025) | erschienen; ersetzt DIN EN 1995-1-1:2010-12 und A2:2014-07. Neu sind u. a. Brettsperrholz, Produktgruppen, Bemessungskennwerte, Dauerhaftigkeit/Robustheit, Ausklinkungen, Verstärkungen, eingeklebte Stahlstäbe, Holzpfähle, zimmermannsmäßige Verbindungen, Querdruck im GZG, Schwingung und Ermüdung | [DIN Media, Normseite](https://www.dinmedia.de/de/norm/din-en-1995-1-1/396471004) |
| DIN EN 1995-1-1/A1:2026-10 (Entwurf) | Entwurf einer ersten Änderung der Neuausgabe | [DIN Media, Entwurf](https://www.dinmedia.de/en/draft-standard/din-en-1995-1-1-a1/405676816) |
| DIN EN 1995-1-2:2026-10 (Deutsche Fassung EN 1995-1-2:2025) | erschienen; ersetzt DIN EN 1995-1-2:2010-12 | [DIN Media, Normseite](https://www.dinmedia.de/en/standard/din-en-1995-1-2/394988951) |
| Nationaler Anhang zur Neuausgabe, Einführung in die MVV TB | öffentlich nicht belegt; die MVV TB 2025/1 verweist weiter auf die Ausgaben 2010-12 mit NA | – |

**Folgerung:** Die Rechner bleiben auf der bauaufsichtlich eingeführten Fassung 2010-12 + A2:2014-07 mit NA:2013-08. Die Regelwerkslisten nennen die Neuausgabe von Teil 1-1 mit dem Hinweis „bauaufsichtlich noch nicht eingeführt“. Für Teil 1-2 wurde dieser Hinweis in diesem PR ergänzt (Modulfuß Holzbau, Abbrandtext, Grenzen). Das Programm des JRC-Webinars vom 09.11.2026 nennt als Schwerpunkte Querdruck, Schub, Deckenschwingung, Brettsperrholz und Verbindungen ([JRC, Webinar EN 1995](https://eurocodes.jrc.ec.europa.eu/events/second-generation-eurocode-en-1995-eurocode-5-design-timber-structures-key-changes)). Inhaltliche Änderungen (k_mod, Schwingungsnachweis, Abbrand, d₀) sind öffentlich noch nicht belegbar.

## Übersicht

| Nr. | Modul | Prüfvermerk-ID | Rechenkern | Empfehlung |
|---|---|---|---|---|
| 1 | Holzbau Modulinfos | – (Info-Modul, kein Eintrag) | – | freigabefähig |
| 2 | Werkstoffe & dataholz | `holzbau_werkstoffe` | Kennwerte `src/data/kennwerte.ts`; Schwindrechner inline | freigabefähig nach Korrektur T10-HW-1 bis -3 und Klärung von T10-HW-4 |
| 3 | Konstruktionsweisen | `holzbau_konstruktion` | – | freigabefähig |
| 4 | Verbindungen & Anschlüsse | `holzbau_verbindung` | `src/calc/holzbau.ts` (`holzschraube`) | freigabefähig nach Korrektur T10-HV-1 und Klärung von T10-HV-2/-3 (F-Freigabe NA) |
| 5 | Bauphysik & Brandschutz | `holzbau_bauphysik` | `src/calc/holzbau.ts` (`abbrandQuerschnitt`, neu), `src/calc/bspSchwingung.ts` | freigabefähig für DIN EN 1995-1-2:2010-12 nach Klärung von T10-HB-1/-2 |
| 6 | Mechanik Modulinfos | – (Info-Modul, kein Eintrag) | – | freigabefähig nach Korrektur T10-MI-1 |
| 7 | Mechanische Kenngrößen | `mechanische_kenngroessen` | `src/calc/mechanischeKenngroessen.ts`, `kriechenSchwinden.ts` | freigabefähig nach Korrektur T10-MK-1 bis -4 und Klärung von T10-MK-5/-6 |
| 8 | Formänderungen | `formaenderungen` | `src/calc/biegelinie.ts` | freigabefähig |
| 9 | Materialmodelle | `materialmodelle` | `src/calc/werkstoffmodelle.ts` | freigabefähig nach Korrektur T10-MM-1 |
| 10 | E-Modul & Mikromechanik | `emodul` | `src/calc/emodul.ts` | freigabefähig |
| 11 | Festigkeitsberechnungen | `festigkeit` | `src/calc/festigkeitsvergleich.ts`, `spannungszustand.ts` | freigabefähig |
| 12 | Baustatik | `baustatik` | `src/calc/statik.ts` | freigabefähig (Hinweis T10-ST-1) |
| 13 | Knicken (Euler) | `knicken` | `src/calc/stabilitaet.ts` (`eulerEigenform`, neu) | freigabefähig nach Korrektur T10-KN-1 |
| 14 | Bruchmechanik | `bruchmechanik` | Inline (`Bruchmechanik.tsx`) | freigabefähig nach Korrektur T10-BM-1 |

**Behobene Fehler (dieser PR):**
- **T10-KN-1:** Knickfigur Euler-Fall 3 falsch (Ausbiegung ab 0,7·l null, Form ohne Einspannung). Außerdem waren die Diagrammwerte je Fall durch 15 bis 25 geteilt. Jetzt wird die exakte Eigenform in mm dargestellt, mit Achsentiteln.
- **T10-HW-1:** Differentielle Quellmaße Lärche (0,18/0,38 → 0,14/0,29), Eiche (0,15/0,28 → 0,18/0,34) und Fichte tangential (0,33 → 0,36) korrigiert.
- **T10-HW-2:** U-Wert der BSP-Geschossdecke 0,32 → 0,41 W/(m²K), aus den angegebenen Schichten nachgerechnet.
- **T10-HW-3:** Hinweis zu den Festigkeitswerten (E_0,mean ist ein Mittelwert, keine 5-%-Quantile) und widersprüchliche Kurzbeschreibungen zweier Aufbauten korrigiert.
- **T10-HV-1:** Abstandsregel für Stabdübel stand unter „8.5“ (Bolzen) statt 8.6 (Tab. 8.5). Die Johansen-Texte nannten Lochleibung „spröde“ und „dickes Blech“ für Holz-Holz-Fugen. Das Lernziel nannte Stabdübel und Bolzen, gerechnet wird die Holzschraube.
- **T10-MK-1:** Spannstahl-Relaxationsklassen nach EC2, 3.3.2 falsch zugeordnet.
- **T10-MK-2:** Querdehnzahl „thermodynamisch 0 ≤ ν ≤ 0,5“ widersprach dem Absatz zu auxetischen Stoffen; richtig ist −1 < ν ≤ 0,5.
- **T10-MK-3:** Endkriechzahl Porenbeton (1,5–3,0 → 0,5, Bereich 0,2–0,7).
- **T10-MK-4:** Gültigkeit der wahren Spannung, Kriechgrenze Stahl (0,3·T_m ≠ 350 °C), Glasübergang von PE/PP/EPDM, „φ = 0 (DIN 18008)“, Schwindmaße Holz (Gesamtschwindmaße, keine α je %), Alu EN AW-6060 „T6“ mit Werten von T66.
- **T10-MM-1:** Einheit der Dissipationsarbeit (N/mm² = MJ/m³, nicht kJ/m³).
- **T10-BM-1 / T10-MI-1:** ISO 12737 ist zurückgezogen, Nachfolge ISO 12135:2021. In der Mechanik-Übersicht passten beim E-Modul die Norm (DIN EN ISO 527-1, Kunststoffe) und der Anwendungsfall (Faserverbund) nicht zum Modul (Beton).

---

## 1. Holzbau Modulinfos (`holzbau_info`)

**Prüfumfang:** `src/modules/holzbaubeta/HolzbauInfo.tsx`, `content/holzbaubeta/HolzbauInfo.json`, Historie `src/data/moduleHistoryData.ts` (Gruppe holzbau), Kopf- und Fußtexte `content/holzbaubeta/HolzbauBeta.json`.

**Fakten-Stichprobe (6 Aussagen)**

| Aussage | Ergebnis | Quelle |
|---|---|---|
| MHolzBauRL Fassung 2024, veröffentlicht in den DIBt-Mitteilungen 2025/2 | richtig (Fassung 24.09.2024, DIBt-Mitteilungen Nr. 2 vom 12.05.2025) | [umwelt-online, MHolzBauRL](https://umwelt-online.de/recht/bau/dibt/mholzbaurl25.htm) |
| DIN EN 1995-1-1 Neuausgabe 2026-09 erschienen, nicht eingeführt | richtig | [DIN Media](https://www.dinmedia.de/de/norm/din-en-1995-1-1/396471004) |
| Hetzer-Patent 1906, DRP Nr. 197773, gebogene verleimte Träger | richtig (22.06.1906) | [dewiki, Leimholz](https://dewiki.de/Lexikon/Leimholz) |
| „Roots“ Hamburg 65 m | richtig (19 Geschosse) | [baulinks 2024](https://www.baulinks.de/webplugin/2024/0745.php4) |
| „HoHo Wien“ 84 m | richtig (24 Geschosse, 2019) | [Liste der höchsten Holzbauten](https://cliffipedia.org/content/wikipedia_en_all_maxi_2025-08/List_of_tallest_wooden_buildings) |
| dataholz.eu in Deutschland kein Verwendbarkeitsnachweis | richtig formuliert (Planungshilfe) | – |

**Befunde**
- behoben: Die Beschreibung des Institut für Holzbau nannte „Holzbaurichtlinien (HBrR)“. Diese Abkürzung gibt es nicht; sie wurde durch MHolzBauRL ersetzt. Die Werbeformel „Die Leitinstitution …“ ist jetzt neutral formuliert.
- Hinweis: Die Historie nennt für 2004/2012 die „Einführung des Grenzzustandskonzepts im Holzbau“ mit dem Eurocode 5. In Deutschland galt das Teilsicherheitskonzept schon mit DIN 1052:2004. Ein Satz dazu wäre genauer (nicht geändert).

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 2. Werkstoffe & dataholz (`holzbau_werkstoffe`)

**Prüfumfang:** `src/modules/holzbaubeta/HolzbauWerkstoffe.tsx`, `daten.ts` (7 Festigkeitsklassen, 4 Aufbauten), `content/holzbaubeta/HolzbauWerkstoffe.json`, `daten.json`, Schwindbeiwerte in `HolzbauBeta.json`, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | App |
|---|---|---|---|
| HW-K | Kennwerte C24, C30, D30, D40, GL24h, GL28c, GL30h | f_m, f_t,0, f_c,0, f_v, E_0,mean, E_0,05, ρ_k, ρ_mean nach DIN EN 338:2016 Tab. 1 bzw. DIN EN 14080:2013 Tab. 5 | identisch |
| HW-S | Fichte 120/240 mm, radial/tangential, u = 20 → 12 % | Δb = 120·0,19·(−8)/100 = −1,82 mm; Δh = 240·0,36·(−8)/100 = −6,91 mm | nach Korrektur identisch (vorher −6,34 mm mit 0,33) |
| HW-U | BSP-Geschossdecke: CAF 65 mm (λ 1,2), MW 30 (0,035), Splitt 60 (0,70), BSP 140 (0,13), R_si = 2·0,17 | R_T = 2,41 m²K/W, U = 0,41 W/(m²K) | vorher 0,32, jetzt 0,41 |
| HW-U2 | Außenwände und Dach (Richtwerte, λ üblicher Produkte, Holzanteil 10 %) | Holzrahmen ≈ 0,16; BSP-Wand ≈ 0,16–0,17; Dach ≈ 0,155 W/(m²K) | 0,18 / 0,16 / 0,14 – innerhalb der Richtwertgenauigkeit (siehe T10-HW-4) |

**Befunde**
- **behoben – T10-HW-1:** Die differentiellen Quellmaße für Lärche (0,18/0,38 %/%) und Eiche (0,15/0,28) lagen deutlich neben den Literaturwerten. Für Fichte tangential stand 0,33 statt 0,36. Neue Werte und Quellenangabe im Text: Fichte 0,19/0,36, Lärche 0,14/0,29, Eiche 0,18/0,34 ([TU München, Skript „Holz – Eigenschaften, Merkmale“](https://webarchiv.typo3.tum.de/ED/ARC/ls-ebb/fileadmin/w00cgv/ebb/Scripten_Allgemein/Holz_Eigenschaften_Merkmale.pdf)). Kiefer (0,19/0,36) und Buche (0,20/0,40) passen.
- **behoben – T10-HW-2:** Der U-Wert der BSP-Geschossdecke (0,32 W/(m²K)) ist mit den angegebenen Schichten nicht erreichbar. Nachgerechnet sind es 0,41 W/(m²K) (Test HW1).
- **behoben – T10-HW-3:** Der Hinweis unter der Kennwerttabelle nannte alle Werte „5-%-Quantile“; E_0,mean ist ein Mittelwert (Klammerfehler ebenfalls behoben). Die Kurzbeschreibungen „Hanf-Faserplatte“ (Holzrahmenwand) und „Unterdachbahn, Klimamembran, Gipsfaser“ (Dach) widersprachen den Schichtlisten (Holzfaser-Installationsebene, Holzfaser-Unterdeckplatte, feuchtevariable Dampfbremse, GKF).
- **offen – Frage T10-HW-4:** Die vier Beispielaufbauten heißen „angelehnt an dataholz.eu“, haben aber keine Katalognummer. Feuerwiderstand (REI 30 bis 90, K₂30) und R_w (46 bis 62 dB) sind nicht prüfbar, das Dach liegt mit U = 0,14 eher bei 0,155 W/(m²K). Sollen echte dataholz-Einträge (mit Nummer und Link) übernommen oder die Werte als „Lehrbeispiel, nicht klassifiziert“ gekennzeichnet werden?

**F-Freigabe-Stellen**
- Rechenwert Schwind-/Quellmaß quer zur Faser 0,24 %/% (im Text „DIN 1052; Fundstelle im NA zu EC5 manuell prüfen“) – DIN EN 1995-1-1/NA, NCI zu 3.x.

**Empfehlung:** freigabefähig nach Korrektur T10-HW-1 bis -3 und Klärung von T10-HW-4.

- [x] Modul freigeben (29.10.2026)

## 3. Konstruktionsweisen (`holzbau_konstruktion`)

**Prüfumfang:** `HolzbauKonstruktion.tsx`, `content/holzbaubeta/HolzbauKonstruktion.json`, Lernziele. Das Modul rechnet nicht.

**Fakten-Stichprobe (5 Aussagen)**

| Aussage | Ergebnis |
|---|---|
| Holzrahmenbau aus KVH im Raster e = 62,5 cm, Aussteifung über Beplankung | richtig (übliches Plattenraster 1 250 mm/2) |
| BSP trägt zweiachsig, Rollschub in den Querlagen | richtig (vgl. proHolz, Bemessung BSP Band II) |
| BSP-Decke 140 mm 5-lagig | plausibel (5 × 28 mm) |
| Splittschüttung verbessert die tieffrequente Trittschalldämmung (< 100 Hz) | richtig (Masse) |
| Skelettbau mit BSH-Riegeln, Fassade getrennt | richtig |

**Befunde:** keine.

**Empfehlung:** freigabefähig.

- [x] Modul freigeben (29.10.2026)

## 4. Verbindungen & Anschlüsse (`holzbau_verbindung`)

**Prüfumfang:** `holzschraube` in `src/calc/holzbau.ts`, `HolzbauVerbindung.tsx` mit Rechenweg, `content/holzbaubeta/HolzbauVerbindung.json`, Grenzen, Lernziele, Erkundung.

**Nachrechnungen** (DIN EN 1995-1-1, 8.7.2 Gl. 8.38–8.41 und 8.2.2; γ_M = 1,3)

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| HS1 | C24 (ρ_k 350), d = 8, l_ef = 80 mm, 90°, n = 4, NKL 1, mittel | f_ax,k = 12,865 N/mm²; F_ax,Rk = 8 233 N; F_ax,Rd = 17,64 kN (n_ef = 4^0,9); f_h,k = 26,40; M_y,Rk = 26 743 Nmm; F_v,Rk = 5 924 N; F_v,Rd = 14,58 kN | identisch |
| HS2 | GL24h (385), d = 10, l_ef = 120, 45°, n = 6, NKL 2, kurz | F_ax,Rd = 45,17 kN; F_v,Rd = 38,40 kN | identisch |
| HS3 | C30 (380), d = 12, l_ef = 60 (< 6·d), n = 2, NKL 3, mittel (k_mod 0,65) | F_ax,Rd = 7,76 kN; F_v,Rd = 10,25 kN; Warnung l_ef | identisch |

**Befunde**
- **behoben – T10-HV-1:** Die Abstandsregel a₁ ≥ (3 + 2|cos α|)·d, a₂ ≥ 3·d gilt für Stabdübel (Abschnitt 8.6, Tab. 8.5); der Text nannte „8.5“ (Bolzen, Tab. 8.4). Die Modusbeschreibungen nannten Lochleibung „spröde“ und führten „dickes Blech“ für Holz-Holz-Fugen an. Neue Texte: Lochleibung mit geradem Stift; spröde Versagensarten (Spalten, Blockscheren) werden über Abstände und eigene Nachweise ausgeschlossen. Das Lernziel nannte Stabdübel und Bolzen, gerechnet wird die Holzschraube.
- **offen – Frage T10-HV-2 (NA DE):** Der Kern rechnet das Herausziehen mit Gl. (8.39) der EN-Fassung mit A1. Nach meinem Kenntnisstand enthält der NA DE (NCI) eigene Ausziehparameter für Schrauben ohne ETA (Tragfähigkeitsklassen nach DIN 1052, f_ax,k = k·10⁻⁶·ρ_k²). Zudem ist offen, ob A2:2014 die Gl. (8.38) geändert hat. Beides ist öffentlich nicht belegbar. Bitte am Normtext prüfen (F-Freigabe).
- **offen – Frage T10-HV-3:** Das Abscheren ist vereinfacht: Lochleibung über t = l_ef auf beiden Seiten, Modus (f) mit β = 1, f_h nach (8.32) ohne Faserwinkel, Nenndurchmesser statt d_ef = 1,1·d_Kern. Das steht in den Grenzen und im Hinweis. Soll d_ef für Schrauben ergänzt werden?

**F-Freigabe-Stellen**
- Ausziehparameter und ggf. Fließmoment für Schrauben ohne ETA nach DIN EN 1995-1-1/NA:2013-08 (NCI zu 8.7).

**Empfehlung:** freigabefähig nach Korrektur T10-HV-1 und Klärung von T10-HV-2/-3.

- [ ] Modul freigeben

## 5. Bauphysik & Brandschutz (`holzbau_bauphysik`)

**Prüfumfang:**
- Abbrandrechner, jetzt `abbrandQuerschnitt` in `src/calc/holzbau.ts`
- Deckenschwingung `src/calc/bspSchwingung.ts` mit `HolzbauBauphysik.tsx`
- `content/holzbaubeta/HolzbauBauphysik.json`, Grenzen, Lernziele

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| BR1 | Nadel-Vollholz β_n = 0,8, 30 min, 120/240, 4-seitig | d_ef = 24 + 7 = 31 mm; 58 × 178 mm; ΔA = 64,2 %; ΔW = 73,4 % | identisch |
| BR2 | BSH β_n = 0,7, 60 min, 160/320, 3-seitig | d_ef = 49 mm; 62 × 271 mm; ΔW = 72,2 % | identisch |
| BR3 | BSP β₀ = 0,65, 10 min (k₀ = 0,5) | d_ef = 6,5 + 3,5 = 10 mm | identisch |
| BR4 | Laubholz β_n = 0,55, 90 min, 100/200 | d_ef = 56,5 mm → kein Restquerschnitt | identisch |
| BSP1 | 5 × 30 mm, ℓ = 4,8 m, +100 kg/m², b_D = 5 m, γ-Verfahren | γ₁ = 0,9359; (EI)_ef = 2,413 MNm²/m; m = 184,1 kg/m²; f₁ = 7,81 Hz; b_F = 3,17 m; w = 0,301 mm | identisch |
| BSP2 | 30-40-30 mm, ℓ = 3,5 m, +50 kg/m² (3-lagig, γ = 1/(1 + k/2)) | γ = 0,9209; f₁ = 11,37 Hz; w = 0,646 mm | identisch |

Abbrandraten (β₀ 0,65/0,50; β_n 0,80/0,70/0,55), d₀ = 7 mm und k₀ = min(1; t/20) entsprechen DIN EN 1995-1-2:2010-12. Für die γ-Formel der 3-lagigen Platte wurde die Gleichwertigkeit mit Anhang B (zwei gleiche Gurte) nachgewiesen.

**Befunde**
- behoben: Normstand. Text, Grenzen und Modulfuß nennen jetzt DIN EN 1995-1-2:2010-12 als Rechengrundlage und die Neuausgabe 2026-10 als „erschienen, nicht eingeführt“.
- **offen – Frage T10-HB-1:** Abbrand weiter nach DIN EN 1995-1-2:2010-12 rechnen, bis die Neuausgabe eingeführt ist (Empfehlung)? Die Neuausgabe enthält nach Fachberichten u. a. geänderte Regeln für Brettsperrholz (Lagenabfall). Die Zahlenwerte sind öffentlich nicht belegbar.
- **offen – Frage T10-HB-2:** Die BSP-Kennwerte E_0,mean = 11 550 N/mm², G_r,mean = 65 N/mm² und Wichte 5,5 kN/m³ stammen aus proHolz Austria (2018). Viele ETAs und die Neuausgabe von EC 5 rechnen mit G_r = 50 N/mm². Soll der Rollschubmodul wählbar werden?

**F-Freigabe-Stellen** (aus Runde 6, unverändert)
- Grenzwerte des Schwingungsnachweises nach DIN EN 1995-1-1/NA:2013-08 (NCI zu 7.3.3), nicht abgebildet.

**Empfehlung:** freigabefähig für DIN EN 1995-1-2:2010-12 nach Klärung von T10-HB-1/-2.

- [x] Modul freigeben (29.10.2026)

## 6. Mechanik Modulinfos (`mechanik_info`)

**Prüfumfang:** Gruppe `mechanik` in `src/modules/moduleinfo/daten.tsx` und `content/moduleinfo/daten.json`, Historie `moduleHistoryData.ts` (Gruppe mechanik).

**Fakten-Stichprobe (6 Aussagen)**

| Aussage | Ergebnis |
|---|---|
| Hooke 1678 „Ut tensio, sic vis“ | richtig |
| Navier 1826 (Résumé des leçons), Saint-Venant Torsion 1855 | richtig |
| Mohr 1882, Spannungskreis (Zivilingenieur) | richtig |
| Castigliano 1879; Maxwell 1864; Müller-Breslau 1886 | richtig |
| Zienkiewicz/Cheung 1967, The Finite Element Method in Structural and Continuum Mechanics | richtig |
| Bruchmechanik nach „ISO 12737“ | **zurückgezogen** ([DIN Media, DIN EN ISO 12737](https://dinmedia.de/en/standard/din-en-iso-12737/138028592)); aktuell ISO 12135:2021 ([Genorma, ISO 12135:2021](https://genorma.com/en/standards/iso-12135-2021)) |

**Befunde**
- **behoben – T10-MI-1:** ISO 12737 → ISO 12135. Beim Teilmodul E-Modul standen DIN EN ISO 527-1 (Zugversuch an Kunststoffen) und „Quer-E-Modul eines Faserverbundes“; das Modul behandelt Beton. Neu: DIN EN 1992-1-1, 3.1.3; DIN EN 12390-13 und „Abschätzung des Beton-E-Moduls aus Gesteinskörnung und Zementstein“.

**Empfehlung:** freigabefähig nach Korrektur T10-MI-1.

- [ ] Modul freigeben

## 7. Mechanische Kenngrößen (`mechanische_kenngroessen`)

**Prüfumfang:**
- Kern `src/calc/mechanischeKenngroessen.ts` mit Zugversuchsimulator, Werkstoffmatrix `daten.ts`, Rheologie-Diagramm (`kriechenSchwinden.ts`)
- Reiter Grundlagen, Steifigkeiten, Kriechen/Schwinden und Beispiele (`content/mechanischekenngroessen/*.json`)
- Grenzen, Lernziele

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| MK1 | Beispiel 1: S235, d = 30 mm, L = 4 m, F = 120 kN | A = 706,86 mm²; EA = 148,44 MN; σ = 169,77 N/mm²; ΔL = 3,234 mm; Δd = −7,3 µm; U = 194,0 J; G = 80 769; K = 175 000 N/mm² | identisch |
| MK2 | C24 100/200, L = 3 m, Druck 50 kN | I_min = 1,667·10⁷ mm⁴; F_K = 201,0 kN; σ = −2,5 N/mm²; w (F mittig) = 38,35 mm | identisch |
| MK3 | Beispiele 2–4 | w = 25,69 mm (C24 12/24, 5 m, 15 kN); ΔL_∞ = −2,39 mm (C30/37, φ = 2); Δσ_pr = 21,2 MPa (Klasse 2, μ = 0,75, 1 000 h) | Texte richtig |

**Befunde**
- **behoben – T10-MK-1:** „Klasse 1 (Draht), Klasse 2 (Litze sehr niedrig), Klasse 3 (Stab)“ – nach DIN EN 1992-1-1, 3.3.2 sind Klasse 1 und 2 Drähte und Litzen mit normaler bzw. niedriger Relaxation (ρ₁₀₀₀ = 8 bzw. 2,5 %), Klasse 3 warmgewalzte Stäbe (4 %). Die Angabe „2,5–8 %“ bezieht sich auf 1 000 h bei 0,7·f_pk.
- **behoben – T10-MK-2:** „thermodynamisch streng 0 ≤ ν ≤ 0,5“ widerspricht dem Folgeabsatz (auxetisch ν < 0) und dem Kern (−1 < ν < 0,5). Richtig ist −1 < ν ≤ 0,5.
- **behoben – T10-MK-3:** Porenbeton kriecht wenig: φ∞ = 0,5 (0,2–0,7) nach DIN EN 1996-1-1/NA ([Xella, Bautechnologie kompakt 2024](https://baulinks.de/bkd_file/xella/Xella_ytong_silka_multipor_bautechnologie_kompakt_20240611.pdf)); der Text nannte 1,5–3,0. Tabelle auf „0,2 bis 2,5“ angepasst.
- **behoben – T10-MK-4:**
  - Die Formel σ_true = σ_eng(1 + ε) gilt nur bis zur Gleichmaßdehnung, nicht für den einschnürenden Querschnitt.
  - Stahlkriechen: „0,3·T_m (< 350 °C)“ passt nicht zusammen (0,3·T_m ≈ 270 °C). Neu: 0,3 bis 0,4·T_m, rund 300 bis 450 °C.
  - Kunststoffe: PE, PP und EPDM arbeiten oberhalb ihrer Glasübergangstemperatur, nicht „nahe“ daran.
  - „φ = 0 (DIN 18008)“: DIN 18008 regelt die Lastdauer über k_mod.
  - Holz: 0,1–0,3/3–5/6–10 % sind Gesamtschwindmaße, keine Beiwerte α je %.
  - Alu: Die Werte f_y/f_u = 160/215 N/mm² gehören zum Zustand T66 (t ≤ 5 mm), nicht zu T6 (150/190) ([thyssenkrupp, Werkstoffblatt EN AW-6060](https://ucpcdn.thyssenkrupp.com/_binary/UCPthyssenkruppBAMaterialsSchulte/1a557d48-f591-46ee-baba-b1a8047b47d0/6060-03.2020.pdf)). Die Bezeichnung lautet jetzt T66, die Werte bleiben.
- **offen – Frage T10-MK-5:** Der Leichtbeton-Wert φ∞ ≈ 1,5–2,5 und der Bereich für Kalksandstein (1,0–2,0) sind nicht öffentlich belegt (F-Freigabe, DIN EN 1996-1-1/NA, Tabelle der Verformungskennwerte).
- **offen – Frage T10-MK-6:** Werkstoffmatrix Holz C24: ν = 0,05 (bei Holz richtungsabhängig 0,02 bis 0,5) und Endschwindmaß längs −0,20 ‰ (bei 0,01 %/% und 10 bis 20 % Feuchteänderung eher −1 bis −2 ‰). Die Angabe „Elastomer-Brückenlager verlieren bis zu 70 % ihrer Steifigkeit“ ist unbelegt. Kennzeichnen oder anpassen?

**Empfehlung:** freigabefähig nach Korrektur T10-MK-1 bis -4 und Klärung von T10-MK-5/-6.

- [ ] Modul freigeben

## 8. Formänderungen (`formaenderungen`)

**Prüfumfang:** `src/calc/biegelinie.ts`, `Biegelinie.tsx`, `content/formaenderungen/*.json` (Systematik, zwei Beispiele), Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| BL1 | Einfeldträger C24 12/24 (I = 13 824 cm⁴), L = 5 m, q = 10 kN/m | w = 5qL⁴/(384EI) = 53,52 mm | identisch |
| BL2 | IPE 240 (I = 8 356 cm⁴), L = 5 m, F = 20 kN bei a = 1,5 m | x(w_max) = L − √((L² − a²)/3) = 2,246 m; w_max = 2,380 mm; w(L/2) = 2,351 mm | identisch |
| BL3 | Kragarm GL24h 12/24, L = 3 m, F = 5 kN bei a = 2 m, q = 2 kN/m | w(L) = 27,42 mm; w′(L) = 11,95 mrad | identisch |
| FÄ1/2 | Beispiele: Wand 30 m, ΔT = 40 K; C30/37 σ = 10 N/mm², φ = 2 | Δl = 12 mm, σ = 13,2 N/mm²; ε = 0,29 + 0,58 = 0,87 ‰, 2,6 mm | Texte richtig |

**Befunde:** keine. Hinweis: Beispiel 2 rechnet die elastische Dehnung mit E_c = 1,05·E_cm (wie Gl. 3.6). Für die Sofortdehnung wird meist E_cm angesetzt; das Ergebnis ändert sich dadurch kaum (0,30 statt 0,29 ‰).

**Empfehlung:** freigabefähig.

- [x] Modul freigeben (29.10.2026)

## 9. Materialmodelle (`materialmodelle`)

**Prüfumfang:** `bilinearVerfestigung`, Lehrkurven und Thixotropie in `src/calc/werkstoffmodelle.ts`, Simulator `Materialmodelle.tsx`, `content/materialmodelle/Materialmodelle.json` (neun Ersatzmodelle, zwei Beispiele), Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| MM1 | f_y = 500, E = 200 000, E_t = 2 000 N/mm², ε_max = 20 ‰ | ε_y = 2,5 ‰; σ_max = 535 N/mm²; ε_p = 17,33 ‰; k = 1,07 | identisch |
| MM2 | Maxwell σ₀ = 10 MPa, τ = 2 s; Zener (Rest 40 %); Bingham τ₀ = 500 Pa, μ_p = 50 Pa·s | σ(3 s) = 2,231 MPa; t½ = 1,386 s; Zener σ(10 s) = 4,040 MPa; γ̇(800 Pa) = 6 s⁻¹ | identisch |

B500B (k ≥ 1,08, ε_uk ≥ 5 %), B500A (1,05; 2,5 %), Relaxationsklasse 2 (ρ₁₀₀₀ = 2,5 %), φ = E₂/E₁ im Zener-Modell und DIN 1342-1 bis -3:2003-11 sind richtig.

**Befunde**
- **behoben – T10-MM-1:** Die Dissipationsarbeit ∮σ dε hat die Einheit N/mm² = MJ/m³; dort stand „kJ/m³ bzw. N/mm²“.

**Empfehlung:** freigabefähig nach Korrektur T10-MM-1.

- [x] Modul freigeben (29.10.2026)

## 10. E-Modul & Mikromechanik (`emodul`)

**Prüfumfang:** `src/calc/emodul.ts`, `EModul.tsx`, `content/emodul/EModul.json`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| EM1 | C30/37, α_E = 1,0 / 0,9 / 0,7 | E_cm = 22·3,8^0,3 = 32,84 / 29,55 / 22,99 GPa | identisch |
| EM2 | E_G = 60, E_M = 20 GPa, v_G = 0,7, ν = 0,2 | Voigt 48,0; Reuss 37,5; HS unten 41,54; HS oben 44,35 GPa | identisch |

Formeln der Hashin-Shtrikman-Schranken (K und G), Quellen (Voigt 1889, Reuss 1929, Hashin/Shtrikman 1963, J. Mech. Phys. Solids 11, S. 127–140) und DIN EN 12390-13:2021-09 sind richtig.

**Befunde:** keine.

**Empfehlung:** freigabefähig.

- [x] Modul freigeben (29.10.2026)

## 11. Festigkeitsberechnungen (`festigkeit`)

**Prüfumfang:** `src/calc/festigkeitsvergleich.ts`, `src/calc/spannungszustand.ts`, `Festigkeitsberechnungen.tsx`, `Spannungszustand.tsx`, `content/festigkeitsberechnungen/*.json` (13 Werkstoffe), Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| FE1 | C20/25 (2 400 kg/m³, 20 N/mm²); S235 (7 850, f_u = 360) | H = 849,5 m; mit Bemessungswerten 356,6 m; L = 4 675 m | identisch (Beispiele richtig) |
| FE2 | Würfelstapel C20/25, a = 10 cm | N = 8 494; σ = 20,00 N/mm²; δ unten = 0,0667 mm; δ gesamt = 283,1 mm | identisch |
| FE3 | σ_x = 80, σ_y = −40, τ_xy = 30 N/mm² | σ₁,₂ = 87,08 / −47,08; φ₁ = 13,28°; σ_v (Mises) = 117,90; Tresca 134,16 | identisch |
| FE4 | wie FE3, θ = 30° | σ_ξ = 75,98; τ_ξη = −36,96 N/mm² | identisch |

Die Werkstoffwerte (fctm/Ecm C20/25 und C50/60, S690 f_u = 770, Kevlar 3 600 N/mm²/112 GPa, Spinnenseide) sind übliche Lehr- und Literaturwerte.

**Befunde:** keine. Hinweis: Glas steht hier mit f_c = 500, in der Werkstoffmatrix der Mechanischen Kenngrößen mit 800 N/mm². Beides sind Literaturwerte, eine Angleichung wäre einheitlicher.

**Empfehlung:** freigabefähig.

- [x] Modul freigeben (29.10.2026)

## 12. Baustatik (`baustatik`)

**Prüfumfang:** `src/calc/statik.ts`, `Baustatik.tsx` (Diagramme, Rahmenskizze), `content/baustatik/Baustatik.json`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| ST1 | Beispiel 1: l = 6 m, q = 10, F = 50 kN bei 2 m | A = 63,33; B = 46,67 kN; M(2) = 106,67 kNm | identisch |
| ST2 | Zweifeldträger l₁ = 4, l₂ = 6 m, q = 10 kN/m | M_B = −q(l₁³ + l₂³)/(8l) = −35 kNm; A = 11,25; B = 64,58; C = 24,17 kN | identisch |
| ST3 | Zweifeldträger 5 + 5 m, F = 30 kN bei 2 m | M_B = −F·a·(l₁² − a²)/(2·l₁·l) = −12,6 kNm | identisch |
| ST4 | Dreigelenkrahmen h = 4, l = 6 m, q = 10 kN/m, W = 20 kN | A_v = 16,67; B_v = 43,33; B_h = 21,25 kN; Eckmomente 5 / 85 kNm | identisch (Beträge) |
| ST5 | Kragarm l = 3 m, q = 5, F = 10 kN am Ende, M₀ = 4 kNm | A = 25 kN; M_A = −56,5 kNm | identisch |

Beispiel 2 (M_B = −62,5 kNm, B = 1,25·q·l, H = 20 kN, M_Ecke = 80 kNm) ist richtig.

**Befunde**
- Hinweis T10-ST-1: `dreigelenkrahmen` liefert die linke Eckmoment-Größe mit Vorzeichen der Riegelkonvention (−ql²/8), die rechte mit umgekehrtem Vorzeichen (+ql²/8). Angezeigt werden nur Beträge, und die Skizze zeichnet beide Seiten richtig. Ein Fehler in der Anzeige entsteht nicht; für spätere Nutzung sollte die Konvention aber einheitlich sein (nicht geändert).

**Empfehlung:** freigabefähig.

- [x] Modul freigeben (29.10.2026)

## 13. Knicken (`knicken`)

**Prüfumfang:** `Knicken.tsx` (F_K inline, Theorie II. Ordnung, Diagramm), `src/calc/stabilitaet.ts`, `content/knicken/Knicken.json`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | App |
|---|---|---|---|
| KN1 | Beispiel: l = 3,5 m, E = 210 000, I = 850 cm⁴ | F_K = 1 438 kN (Fall 2); 360 kN (Fall 1); 2 935 kN (Fall 3); 5 753 kN (Fall 4); w = 11,67/(1 − 0,65) = 33,3 mm | identisch |
| KN2 | Eigenform Fall 3 (eingespannt–gelenkig) | tan(kℓ) = kℓ → kℓ = 4,4934; β = π/kℓ = 0,6992; w(ξ) = sin kℓξ − kℓξ + kℓ(1 − cos kℓξ), Größtwert bei ξ = 0,60 | **vorher abweichend**, jetzt identisch |

**Befunde**
- **behoben – T10-KN-1:** Die Knickfigur von Euler-Fall 3 war sin(πx/0,7l)·(1 − x/l) und ab 0,7·l null. Damit fehlte die Einspannung am Fuß (Neigung ≠ 0), und das obere Drittel blieb gerade. Außerdem waren die Diagrammwerte je Fall durch 20, 15 bzw. 25 geteilt, während die Legende „w_max“ in mm nannte. Die Eigenformen aller vier Fälle liegen jetzt in `eulerEigenform` (normiert, Test der Randbedingungen). Das Diagramm zeigt w in mm und hat Achsentitel; die Grenzen sind angepasst.
- Hinweis: Die Vorkrümmung w₀ = l/300 wird für alle Fälle mit der Stablänge l angesetzt (Lehrmodell, in den Grenzen genannt).

**Empfehlung:** freigabefähig nach Korrektur T10-KN-1.

- [x] Modul freigeben (29.10.2026)

## 14. Bruchmechanik (`bruchmechanik`)

**Prüfumfang:** `Bruchmechanik.tsx` (K_I inline, Diagramm), `content/bruchmechanik/Bruchmechanik.json`, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | App |
|---|---|---|---|
| BM1 | Glas K_Ic = 0,75 MPa√m, Kantenriss a = 0,5 mm, Y = 1,12 | σ_c = 16,9 MPa | identisch |
| BM2 | Stahl K_Ic = 100, σ = 200 MPa, a = 10 mm | K_I = 39,7 MPa√m, η = 2,52; kritische Risslänge 63 mm | identisch |
| BM3 | Formel im Diagramm | K_I(a) = Y·σ·√(π·a) mit a in m | identisch |

**Befunde**
- **behoben – T10-BM-1:** ISO 12737 (K_Ic bei ebener Dehnung) ist zurückgezogen; Nachfolge ist ISO 12135:2021. RILEM TC 50-FMC (1985), fib Model Code 2010 und Gross/Seelig (6. Aufl. 2016) sind richtig.

**Empfehlung:** freigabefähig nach Korrektur T10-BM-1.

- [x] Modul freigeben (29.10.2026)

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage |
|---|---|---|
| T10-HW-4 | Werkstoffe & dataholz | Beispielaufbauten: echte dataholz-Einträge mit Nummer übernehmen oder als „Lehrbeispiel, nicht klassifiziert“ kennzeichnen? |
| T10-HV-2 | Verbindungen | Ausziehparameter für Schrauben ohne ETA nach NA DE (NCI) und mögliche Änderung von (8.38) durch A2:2014 am Normtext prüfen (F-Freigabe). |
| T10-HV-3 | Verbindungen | Beim Abscheren d_ef = 1,1·d_Kern für Schrauben ergänzen? |
| T10-HB-1 | Bauphysik & Brandschutz | Abbrand bis zur Einführung bei DIN EN 1995-1-2:2010-12 lassen (Empfehlung)? |
| T10-HB-2 | Bauphysik & Brandschutz | Rollschubmodul G_r wählbar machen (65 nach proHolz, 50 nach ETA/EC 5 neu)? |
| T10-MK-5 | Mechanische Kenngrößen | φ∞ Leichtbeton (1,5–2,5) und Kalksandstein (1,0–2,0) am NA DE zu EC 6 bestätigen (F-Freigabe). |
| T10-MK-6 | Mechanische Kenngrößen | Holz C24 in der Werkstoffmatrix (ν = 0,05; ε_s längs −0,20 ‰) und unbelegte 70 % bei Elastomerlagern kennzeichnen oder anpassen? |

## Nachweis der Prüfung

- **Unabhängige Nachrechnung:** eigenes Python-Skript mit eigener Umsetzung der Norm- und Modellgleichungen, Vergleich gegen die Kernausgaben und Tabellendaten. Der Test enthält 98 Vergleiche und 404 Formprüfungen. Die Inline-Rechnungen (Bruchmechanik, Schwindrechner, Euler-Knicklast) wurden über die Formeln abgeglichen.
- **Öffentliche Quellen dieser Prüfung:**
  - Normstand: [DIN Media, DIN EN 1995-1-1:2026-09](https://www.dinmedia.de/de/norm/din-en-1995-1-1/396471004); [DIN Media, Entwurf DIN EN 1995-1-1/A1:2026-10](https://www.dinmedia.de/en/draft-standard/din-en-1995-1-1-a1/405676816); [DIN Media, DIN EN 1995-1-2:2026-10](https://www.dinmedia.de/en/standard/din-en-1995-1-2/394988951); [JRC, Webinar Eurocode 5](https://eurocodes.jrc.ec.europa.eu/events/second-generation-eurocode-en-1995-eurocode-5-design-timber-structures-key-changes); [DIN Media, DIN EN ISO 12737 (zurückgezogen)](https://dinmedia.de/en/standard/din-en-iso-12737/138028592); [Genorma, ISO 12135:2021](https://genorma.com/en/standards/iso-12135-2021).
  - Holzbau: [umwelt-online, MHolzBauRL 2024](https://umwelt-online.de/recht/bau/dibt/mholzbaurl25.htm); [dewiki, Leimholz (Hetzer-Patent)](https://dewiki.de/Lexikon/Leimholz); [baulinks, Roots Hamburg](https://www.baulinks.de/webplugin/2024/0745.php4); [Liste der höchsten Holzbauten](https://cliffipedia.org/content/wikipedia_en_all_maxi_2025-08/List_of_tallest_wooden_buildings); [TU München, Holz – Eigenschaften, Merkmale](https://webarchiv.typo3.tum.de/ED/ARC/ls-ebb/fileadmin/w00cgv/ebb/Scripten_Allgemein/Holz_Eigenschaften_Merkmale.pdf).
  - Werkstoffe: [Xella, Bautechnologie kompakt (Kennwerte EC 6/NA)](https://baulinks.de/bkd_file/xella/Xella_ytong_silka_multipor_bautechnologie_kompakt_20240611.pdf); [thyssenkrupp, Werkstoffblatt EN AW-6060](https://ucpcdn.thyssenkrupp.com/_binary/UCPthyssenkruppBAMaterialsSchulte/1a557d48-f591-46ee-baba-b1a8047b47d0/6060-03.2020.pdf).

## Umsetzung 29.10.2026

Entscheidungen vom 28.10.2026 (nachts); Regressionstests `tests/modulpruefungTranche10.test.ts`, `tests/holzbauNachweise.test.ts`, `tests/bspSchwingung.test.ts`.

- **T10-HW-4 (Werkstoffe & dataholz):** Bauteilexplorer als „Lehrbeispiel, nicht klassifiziert“ gekennzeichnet (Abzeichen statt „dataholz.eu Lizenz-Standard“, Überschrift, Hinweis: ohne Katalognummer, REI/R_w/U nicht geprüft, maßgebend sind klassifizierte Originaleinträge).
- **T10-HV-2 (Verbindungen, Normtext):** Ausziehparameter nach NA DE (NCI) und Fassung der Gl. (8.38) nach A2:2014 als „vorläufig, F-Freigabe“ im Kern `holzschraube` gekennzeichnet; Rechnung unverändert.
- **T10-HV-3 (Verbindungen):** Abscheren mit d_ef = 1,1·d₁ (DIN EN 1995-1-1, 8.7.1(3)); Kerndurchmesser d₁ optional, sonst Lehrwert 0,65·d; d_ef ≤ 6 mm Lochleibung nach den Regeln für Nägel (8.15, nicht vorgebohrt), sonst für Bolzen (8.32) (8.7.1(4)); M_y,Rk mit d_ef. Neue Handwerte: HS1 d_ef = 5,72 mm, f_h,k = 17,01 N/mm², F_v,Rd = 8,35 kN (vorher 14,58 kN); HS2 27,33 kN (38,40); HS3 6,63 kN (10,25); Herausziehen unverändert. Rechenweg, Grenzen und Quizfrage `qn_holzbau_verbindung_6` angepasst (verified false, „korrigiert“).
- **T10-HB-1 (Bauphysik & Brandschutz):** bestätigt – Abbrand bleibt bei DIN EN 1995-1-2:2010-12, Hinweis auf die Neuausgabe 2026-10 („noch nicht eingeführt“) war bereits in Text und Grenzen; keine Änderung.
- **T10-HB-2 (Bauphysik & Brandschutz):** Rollschubmodul G_r wählbar 50 N/mm² (Standard, viele ETAs/EC 5 Neuausgabe) oder 65 N/mm² (proHolz Austria 2018), `BSP_ROLLSCHUB` in `src/calc/bspSchwingung.ts`. Handwerte G_r = 50, BSP1: γ₁ = 0,918225, (EI)_γ = 2,36875·10⁶ Nm²/m, f₁ = 7,733 Hz (G_r = 65: 7,805 Hz).
- **T10-MK-5 (Mechanische Kenngrößen):** φ∞ Kalksandstein 1,0–2,0 wie Leichtbeton als „vorläufig, F-Freigabe: Endkriechzahlen nach DIN EN 1996-1-1/NA“ gekennzeichnet.
- **T10-MK-6 (Mechanische Kenngrößen):** Holz C24 in der Werkstoffmatrix: ν = 0,05 und Schwindmaß längs −0,20 ‰ als vorläufige Lehrwerte gekennzeichnet (mit Spannen); „Elastomer-Brückenlager bis zu 70 %“ als unbelegter Lehrwert (vorläufig) umformuliert.

## Freigabe 29.10.2026

Entscheidung vom 28.10.2026: „Module ohne offene Frage freigeben“; Punkte, die nur am Normtext zu klären sind, blockieren die Freigabe (Prüfbogen Normtext, Abschnitt „Was ohne Normtext nicht weiterkommt“). Geprüft wurde je Modul: Empfehlung erfüllt (Korrekturen behoben, Klärungen entschieden und in den Abschnitten „Umsetzung 29.10.2026“ bzw. in den genannten PRs umgesetzt oder gekennzeichnet) und kein Normtextpunkt offen. Prüfvermerk in `src/data/pruefvermerke.ts`: „geprueft“, am 2026-10-29, passiv ohne Namen. Quizfreigaben sind davon getrennt.

Freigegeben:

- `holzbau_werkstoffe` – T10-HW-1 bis -3 behoben (#241), T10-HW-4 umgesetzt (#251, „Lehrbeispiel, nicht klassifiziert“)
- `holzbau_konstruktion` – freigabefähig, keine Frage
- `holzbau_bauphysik` – T10-HB-1 bestätigt, T10-HB-2 umgesetzt (#251, G_r 50/65); freigegeben für DIN EN 1995-1-2:2010-12
- `formaenderungen` – freigabefähig, keine Frage
- `materialmodelle` – nach Korrektur T10-MM-1 (behoben, #241)
- `emodul` – freigabefähig, keine Frage
- `festigkeit` – freigabefähig, keine Frage
- `baustatik` – freigabefähig, keine Frage
- `knicken` – nach Korrektur T10-KN-1 (behoben, #241)
- `bruchmechanik` – nach Korrektur T10-BM-1 (behoben, #241)

Nicht freigegeben:

- `holzbau_verbindung` – Prüfbogen: T10-HV-2a/b (Normtext)
- `mechanische_kenngroessen` – Prüfbogen: T10-MK-5a/b, T10-MK-6a–c

Ohne Eintrag in `src/data/pruefvermerke.ts` (kein Fachmodul im Sinne der Prüfvermerke, daher kein Vermerk): `holzbau_info`, `mechanik_info`.
