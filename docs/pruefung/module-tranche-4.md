# Modulprüfung Tranche 4 – Grundlagen, Labor und Versuchs-Handouts (Befundliste zur Freigabe)

**Stand:** 28.10.2026 (Branch `pruefung/module-tranche4-10-28`, Basis origin/main b2cb8367)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke und **keine** Quizfragen geändert.

## Vorgehen

- **Auswahl (17 Module):** Gruppe Grundlagen (Baustoffkunde, Einheiten, Kennwerte, Baustoffkenngrößen, Bauchemie, Eurocode-Sicherheitskonzept) und Gruppe Labor & Auswertung (Probenahme, Messen & Prüfen, Analytik, Mechanische Prüfungen, Virtuelle Versuche, Festbeton-Statistik und die fünf Versuchs-Handouts).
- **Prüfumfang je Modul** (wie Tranche 1 bis 3):
  - Rechenkerne mit mindestens drei eigenen Nachrechnungen. Dafür gibt es ein eigenes Python-Skript mit eigener Umsetzung der Norm- und Modellgleichungen; Testwerte wurden nicht übernommen.
  - Wo ein Modul nur in der Komponente rechnet (Baustoffkenngrößen, Sicherheitskonzept, Probenahme, Analytik, Virtuelle Versuche): Formeln Zeile für Zeile gegen die eigene Rechnung abgeglichen.
  - Wo ein Modul nicht rechnet (Baustoffkunde, Kennwerte-Tabelle): Fakten-Stichprobe mit mindestens fünf Aussagen gegen öffentliche Quellen.
  - Fachtext (`content/*.json`) mit Normstand (Ausgaben Oktober 2026, NA DE), Grenzen (`src/data/rechnerGrenzen.ts`), Beispiele mit Rechenweg, Erkundungsaufträge, Lernziele, Quellen und Stellen „vorläufig, F-Freigabe“.
- **Ergebnis der Nachrechnung:** 97 Werte im Prüfskript, davon 65 Vergleiche als Regressionstest in `tests/modulpruefungTranche4.test.ts`. Alle Kernergebnisse stimmen innerhalb von 0,5 % mit der eigenen Rechnung überein. Abweichungen gab es nur in Komponenten: Rückprall in der Probenahme (T4-PN-1) und Washburn-Konstante in der Analytik (T4-AN-1).
- Alle Beispiele und Erkundungsaufträge der 17 Module wurden nachgerechnet, ohne weitere Abweichung.
- Es wurden nur öffentliche Quellen verwendet. Normtexte wurden nicht abgeschrieben.

## Übersicht

| Nr. | Prüfeinheit | Prüfvermerk-ID | Rechenkern | Empfehlung |
|---|---|---|---|---|
| 1 | Baustoffkunde & Historie | `baustoffkunde` | – (Faktenstichprobe) | freigabefähig nach Korrektur T4-BSK-1 |
| 2 | Einheiten | `einheiten` | `src/calc/einheiten.ts` | freigabefähig |
| 3 | Kennwerte-Datenbank | `materialkennwerte` | `src/data/materials.json` | freigabefähig nach Klärung von T4-MK-1 |
| 4 | Baustoffkenngrößen | `baustoffkenngroessen` | Inline (`Baustoffkenngroessen.tsx`, Reiter) | freigabefähig (Hinweis T4-KG-1) |
| 5 | Bauchemie | `bauchemie` | `src/calc/bauchemie.ts` | freigabefähig nach Korrektur T4-BC-1 und Klärung von T4-BC-2 |
| 6 | Eurocode-Sicherheitskonzept | `sicherheitskonzept` | Inline (`Sicherheitskonzept.tsx`) | freigabefähig nach Korrektur T4-SK-1 und Klärung von T4-SK-2 |
| 7 | Probenahme & Erkundung | `probenahme` | Inline, jetzt mit `src/calc/bauwerksuntersuchung.ts` | freigabefähig nach Korrektur T4-PN-1 und Klärung von T4-PN-2 |
| 8 | Messen & Prüfen | `messen_pruefen` | `src/calc/pruefverfahren.ts` (GUM, Ringversuch, Werkzeuge) | freigabefähig |
| 9 | Analytik & Diagnostik | `analytik` | Inline (`Analytik.tsx`) | freigabefähig nach Korrektur T4-AN-1 |
| 10 | Mechanische Prüfungen | `mechanische_pruefungen` | `src/calc/pruefverfahren.ts` | freigabefähig (F-Stelle B500B) |
| 11 | Virtuelle Versuche | `labor` | Inline (`src/components/labor/*`), Rückprall zentral | freigabefähig (Stichprobe) |
| 12 | Festbeton (Statistik) | `festbeton_statistik` | `src/calc/festbetonStatistik.ts` | freigabefähig (F-Stelle σ ≥ 3 N/mm²) |
| 13 | Handout Potentialmessung | `labor_potentialmessung` | `src/calc/laborversuche.ts` | freigabefähig |
| 14 | Handout Auslagerungsversuch | `labor_auslagerung` | `src/calc/laborversuche.ts` | freigabefähig |
| 15 | Handout Frischbetonprüfungen | `labor_frischbeton` | `src/calc/laborversuche.ts` | freigabefähig |
| 16 | Handout Würfeldruckfestigkeit | `labor_druckfestigkeit` | `src/calc/laborversuche.ts` | freigabefähig |
| 17 | Handout Mörtelprismen | `labor_moertelprismen` | `src/calc/laborversuche.ts` | freigabefähig |

**Behobene Fehler (dieser PR):**
- **T4-PN-1:** Der Rückprall-Simulator der Probenahme rechnete mit eigenen Werten:
  - Festigkeitsgerade 1,4·R − 20 statt der Lehrkurve 0,0125·R^2,22,
  - Karbonatisierung pauschal −0,15 Skt./mm statt des Faktors k,
  - eine eigene Winkeltabelle.
  
  Damit widersprach er der Entscheidung aus Runde 5 (Z55), nur eine Lehrkurve im Repo zu verwenden. Bei R = 38 ergab der Rohwert 33 statt 40 N/mm². Der Simulator nutzt jetzt den zentralen Kern; das Beispiel 3 nennt die Herstellerformel.
- **T4-AN-1:** Der MIP-Simulator rechnete r = 7500/p. Überschrift und Beispiel 2 nennen γ = 0,485 N/m und θ = 140°, daraus folgt r·p = 7431 nm·bar. Bei 100 bar zeigte der Simulator 75,0 nm, das Beispiel 74 nm. Der Simulator rechnet jetzt mit der Washburn-Gleichung.
- **T4-BC-1:** Für die Umwandlung Thenardit → Mirabilit stand „rund dreifaches Volumen“. Richtig ist eine Volumenzunahme um gut 300 %, also rund das Vierfache.
- **T4-SK-1:** Normenstand Eurocode 0: DIN EN 1990-1:2026-12 (EN 1990-1:2023+A1:2026) ist angekündigt, der Nationale Anhang liegt im Entwurf vor.
- **T4-BSK-1:** Monier-Lizenz: 1884 an Freytag & Heidschuch (Süddeutschland), 1885 die Rechte für Norddeutschland an Wayss. Herausgeber von „Das System Monier“ (1887) war Wayss.
- **Grenzen:** neue Einträge für drei Module, die rechnen, aber nicht als Rechner einsortiert sind: `sicherheitskonzept`, `probenahme`, `analytik`.

---

## 1. Baustoffkunde & Historie (`baustoffkunde`)

**Prüfumfang:** `content/baustoffkunde/Baustoffkunde.json` (Systematik, Epochen, Pioniere, Stoffklassen, Formel α_T), Lernziele. Das Modul rechnet nicht.

**Fakten-Stichprobe**

| Aussage im Modul | Ergebnis | Quelle |
|---|---|---|
| Aspdin, Patent Nr. 5022 vom 21.10.1824; Lebensdaten 1778–1855; Brand unter der Sintergrenze | bestätigt | [Wikipedia, Joseph Aspdin](https://en.wikipedia.org/wiki/Joseph_Aspdin) (BP 5022, 21.10.1824; Brand unter 1250 °C, kein Alit) |
| Wayss erwarb 1885 die Monier-Patente für Deutschland | **korrigiert (T4-BSK-1)** | [Deutsche Biographie, Wayss](https://www.deutsche-biographie.de/sfz139203.html): Lizenz für Süddeutschland 1884 an Freytag & Heidschuch und Martenstein & Josseaux, 1885 Rechte für Norddeutschland an Wayss; Broschüre 1887 von Wayss herausgegeben |
| Koenen stellte 1886 die erste Bemessungsmethode auf | bestätigt | [Deutsche Biographie, Koenen](https://www.deutsche-biographie.de/gnd117528471.html) (Veröffentlichung im Centralblatt der Bauverwaltung, Herbst 1886) |
| CUBE, TU Dresden, erstes Carbonbetongebäude, eröffnet 2022 | bestätigt | [TU Dresden, Einweihung 28.09.2022](https://tu-dresden.de/tu-dresden/newsportal/news/feierliche-einweihung-des-weltweit-ersten-gebaeudes-aus-carbonbeton-cube) |
| Gebäude und Bau: rund 37 % der energiebedingten CO₂-Emissionen (UNEP) | bestätigt (2022: 37 % der energie- und prozessbedingten CO₂-Emissionen) | [UNEP, Global Status Report](https://www.unep.org/resources/report/global-status-report-buildings-and-construction) |
| Neue Bauproduktenverordnung (EU) 2024/3110 | bestätigt (wie Tranche 1) | – |

Weitere Angaben sind plausibel und ohne Befund: Pantheon 43,3 m, Monier-Patent 1867 (Vorläufer Lambot 1848 und Wilkinson 1854), Mörsch „Der Eisenbetonbau“ 1902, Ritter 1899, Powers/Brownyard 1946/47 mit rund 28 % Gelporosität, Asbestzementverbot 1993, Eurocodes bauaufsichtlich ab 2012, α_T von Beton 10·10⁻⁶ und von Stahl 12·10⁻⁶ 1/K.

**Befunde**
- **behoben – T4-BSK-1:** siehe Tabelle; „gaben … heraus“ ist zu „Wayss gab … heraus“ geändert.
- offen: keine.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig nach Korrektur T4-BSK-1.

- [ ] Modul freigeben

## 2. Einheiten (`einheiten`)

**Prüfumfang:** `src/calc/einheiten.ts`, `content/einheiten/Einheiten.json` (SI-System, Präfixe, drei Beispiele, Formeln), Grenzen, Erkundung, Lernziele.

**Normstand:** DIN EN ISO 80000-1 in der Fassung EN ISO 80000-1:2022 ([DIN Media](https://www.dinmedia.de/de/norm/din-en-iso-80000-1/362915152)), wie im Modul genannt. DIN 1301-1:2010-10 ist unverändert.

**Nachrechnungen** (exakte Definitionen nach NIST SP 811)

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| EH1 | 1 psi → kPa | 0,45359237·9,80665/0,0254² = 6,894 757 kPa | identisch |
| EH2 | 100 °F → °C | (100 − 32)·5/9 = 37,778 °C | identisch |
| EH3 | 45 kNm → Nmm | 4,5·10⁷ Nmm | identisch |
| EH4 | 1 kWh → kcal | 3,6·10⁶/4186,8 = 859,85 kcal | identisch |
| EH5 | 1000 lbf → N | 4448,22 N | identisch |
| Beispiele | σ = 500 kN/(300 mm)²; σ = M/W (q = 10 kN/m, l = 6 m, 30/50 cm); 5 kN/m² | 5,56 / 3,6 / 0,005 N/mm² | richtig |

**Befunde:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 3. Kennwerte-Datenbank (`materialkennwerte`)

**Prüfumfang:** `src/data/materials.json` (51 Baustoffe, 7 Kennwerte), `content/materialkennwerte/Materialkennwerte.json` (Lesehinweis, zwei Beispiele), Lernziele.

**Fakten-Stichprobe**
- **Normwerte bestätigt** (Tab. 3.1 DIN EN 1992-1-1, DIN EN 338:2016, DIN EN 14080):
  - C30/37: E_cm 33 000, f_ctk;0,05 2,0 N/mm²; C80/95: E_cm 42 000, f_ctk;0,05 3,4 N/mm².
  - LC20/22 bei 1600 kg/m³: E = E_cm·(ρ/2200)² ≈ 15 900, f_ctk;0,05 ≈ 1,25 N/mm².
  - C24: E₀,mean 11 000, f_c,0,k 21, f_t,0,k 14,5, ρ_mean 420; GL24h: f_t,0,k 19,2, E 11 500.
  - S235: f_y 235, f_u 360.
  - Floatglas f_g,k 45, ESG 120 N/mm².
- **Lehrwerte ohne Befund:** λ, c_p und α_T der Metalle und Dämmstoffe sowie Glas (E 70 000, α_T 9·10⁻⁶).

**Nachrechnungen der Beispiele:** ΔL_Al = 23·10⁻⁶·10 000·60 = 13,8 mm; ΔL_StB = 6,0 mm; Differenz 7,8 mm. E/ρ: Stahl 26,8, C24 26,2, Beton 13,8. Alle richtig.

**Befunde**
- **offen – Frage T4-MK-1 (Mauersteine):** Für Kalksandstein KS 12 (1800 kg/m³) ist λ = 0,9 W/(mK) hinterlegt. Nach meinem Kenntnisstand nennt DIN 4108-4 für die Rohdichteklasse 1,8 den Bemessungswert 0,99 W/(mK). Ziegelmauerwerk MZ 12 mit 1600 kg/m³ und λ = 0,5 passt weder zu Voll- noch zu Hochlochziegeln nach DIN 4108-4 (Tabellenwerte je Mörtel). Frage: Mauersteinzeilen an DIN 4108-4 angleichen oder als Lehrwerte kennzeichnen?
- Hinweis: Aluminium EN AW-6060 ist mit f_0 = 160 und f_u = 190 N/mm² hinterlegt. Nach DIN EN 1999-1-1 hängen die Werte vom Zustand und von der Wanddicke ab (T66: 160/215 bzw. 150/195). Eine Zustandsangabe würde die Zeile eindeutig machen.

**F-Freigabe-Stellen:** λ der Mauersteine nach DIN 4108-4 (falls T4-MK-1 so entschieden wird).

**Empfehlung:** freigabefähig nach Klärung von T4-MK-1.

- [ ] Modul freigeben

## 4. Baustoffkenngrößen (`baustoffkenngroessen`)

**Prüfumfang:** Reiter Eigenschaften, Mechanisch, Physikalisch, Hygrisch, Thermisch, Zeitlich und Rechenbeispiele (`Baustoffkenngroessen.tsx`, `baustoffkenngroessen/*.tsx`, sieben JSON-Dateien), Grenzen, Erkundung, Lernziele. Die Komponente rechnet selbst.

**Nachrechnungen** (Formeln der Komponente gegen eigene Rechnung)

| Fall | Eingabe (Startwerte) | Handrechnung | Komponente |
|---|---|---|---|
| KG1 | F = 100 kN, A = 50 cm²; Δl = 5 mm auf 2 m, E = 210 000 | σ = 20 N/mm²; σ_Hooke = 525 N/mm² | identisch |
| KG2 | Säule Beton 500 kN, 625 cm², L₀ = 3 m, E = 30 000, f = 30 | σ = 8,0; ΔL = 0,80 mm; Ausnutzung 26,7 % | identisch |
| KG3 | ρ = 2400, ρ_R = 2650; Ziegel 1800/2650 | P = 9,4 % bzw. 32,1 % | identisch |
| KG4 | U einschichtig d = 0,12 m, λ = 0,04; b Vollziegel (0,81/1800/1000) | U = 0,315 W/(m²K); b = 1207 J/(m²K√s) | identisch |
| KG5 | Zeitlich: σ₀ = 15, E = 30 000, φ∞ = 2, ε_cs∞ = −0,5 ‰, ψ = 12 %, t = 365 d | ε_cr = 0,924 ‰; ε_ges = 1,778 ‰; σ(t) = 13,34 N/mm² | identisch |
| Beispiele | w = 1,4/√4; s_d = 130·0,20; Q = 500·2,1·10; Δl Stahlträger 20 m, 30 K; ε_ges = 1,50 ‰ | 0,70; 26,0 m; 10 500 kJ; 7,20 mm; 15 mm auf 10 m | richtig |

- **Fachtext:**
  - μ = 80/130 für Normalbeton (DIN EN ISO 10456 / DIN 4108-4) richtig.
  - Grenzwerte wasserabweisend nach DIN 4108-3 richtig: w ≤ 0,5, s_d ≤ 2,0 m, w·s_d ≤ 0,2.
  - Eintauchtiefe 5 ± 2 mm nach DIN EN ISO 15148 richtig.
  - Kriechen linear bis σ ≤ 0,45 f_ck richtig.

**Befunde**
- behoben: keine.
- Hinweis T4-KG-1: Die spezifische Wärmekapazität von Stahl steht an drei Stellen mit drei Werten:
  - 460 J/(kgK) in der Vorbelegung „Stahl“ des Wärmeeindringkoeffizienten,
  - 480 J/(kgK) in der Auswahl der Wärmespeicherung,
  - 440 J/(kgK) in der Kennwerte-Datenbank.
  
  DIN EN ISO 10456 nennt 450 J/(kgK). Kein Rechenfehler; eine Vereinheitlichung wird empfohlen.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 5. Bauchemie (`bauchemie`)

**Prüfumfang:** `src/calc/bauchemie.ts`, `content/bauchemie/Bauchemie.json` (Bindungen, pH, Sintern, CSH, Zusatzmittel, Angriffe, Salze, Oberflächenschutz, Korrosion, Kleben und Dichten, zwei Beispiele), Grenzen, Erkundung, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| BC1 | M Ca(OH)₂, M Ca₃SiO₅ (IUPAC-Atomgewichte) | 74,092 / 228,314 g/mol | identisch |
| BC2 | Ca(OH)₂ + CO₂ → CaCO₃ + H₂O | m_CO₂/m_CH = 0,594 (Beispiel 2: 0,59) | identisch |
| BC3 | c = 40 mm, K = 4 / 2 mm/√a; c = 30 mm | 100 / 400 / 56 Jahre (Beispiel 1) | identisch |
| BC4 | AKR-Lehrmodell 3 kg/m³, 85 %, 10 a; Stellmittel 0,8 %, 15 s⁻¹ | 1,223 mm/m; 11,4 Pa·s | identisch |
| BC5 | pH 12,6 → c(OH⁻) → pH | Rundreise exakt | identisch |

- **Fachtext ohne Befund:**
  - Standardpotentiale: Mg −2,37, Al −1,66, Zn −0,76, Fe −0,44, Cu +0,34 V.
  - c_min,dur XC4 = 25 mm, Δc_dev = 15 mm.
  - Sanierputz WTA 2-9 mit über 40 Vol.-% Porosität.
  - Dichtstoffklassen 25LM sowie Acrylat 7,5–12,5 %.
  - Fliesenkleber C/D/R nach DIN EN 12004, Holzklebstoffe D1–D4 nach DIN EN 204.

**Befunde**
- **behoben – T4-BC-1:** „Thenardit → Mirabilit, rund dreifaches Volumen“ war falsch. Die Molvolumina betragen 142,04/2,66 ≈ 53 cm³/mol für Thenardit und 322,2/1,464 ≈ 220 cm³/mol für Mirabilit. Das ergibt eine Zunahme um rund 313 %. Das SalzWiki der HAWK nennt eine „volume expansion of 320%“ ([SalzWiki, Sodium sulfate](https://saltwiki.hawk.de/index.php/Sodium_sulfate)). Der Text lautet jetzt „Volumenzunahme um gut 300 %, also rund das Vierfache“.
- **offen – Frage T4-BC-2 (Fugendimensionierung):** Das Modul gibt für DIN 18540 an: b : t ≈ 1 : 1 bis 10 mm Fugenbreite, darüber 2 : 1 (z. B. 20 mm → 10 mm). Die Norm tabelliert die Dichtstoffdicke je Fugenbreite mit Grenzabmaßen. Bitte am Normtext bestätigen, dass die Faustregel die Tabelle abbildet; sonst durch die Tabellenwerte ersetzen.

**F-Freigabe-Stellen:** DIN 18540, Tabelle Fugenbreite/Dichtstoffdicke (T4-BC-2).

**Empfehlung:** freigabefähig nach Korrektur T4-BC-1 und Klärung von T4-BC-2.

- [ ] Modul freigeben

## 6. Eurocode-Sicherheitskonzept (`sicherheitskonzept`)

**Prüfumfang:** `src/modules/Sicherheitskonzept.tsx` (Lastermittlung nach Gl. 6.10 in der Komponente), `content/sicherheitskonzept/Sicherheitskonzept.json` (Teile der Eurocodes, Teilsicherheits- und Kombinationsbeiwerte, Grenzzustände, zwei Beispiele), Lernziele.

**Normstand DIN EN 1990:**
- Bauaufsichtlich gilt DIN EN 1990:2021-10 mit NA:2010-12 und NA/A1:2012-08 (wie im Modul).
- Der Nachfolger ist als **DIN EN 1990-1** angekündigt (vorbestellbar): „Eurocode – Grundlagen der Tragwerksplanung und Planung geotechnischer Bauwerke – Teil 1: Neubauten; Deutsche Fassung EN 1990-1:2023+A1:2026“. Er ersetzt DIN EN 1990:2021-10 und teilweise DIN EN 1997-1 ([DIN Media, DIN EN 1990-1](https://www.dinmedia.de/en/standard/din-en-1990-1-a1/400467169)).
- Der Nationale Anhang zu DIN EN 1990-1:2026-12 liegt als Entwurf vor ([DIN Media, E DIN EN 1990-1/NA](https://www.dinmedia.de/en/draft-standard/din-en-1990-1-na/407077791)).

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Komponente |
|---|---|---|---|
| SK1 | Startwerte G_k = 10, Q_k,1 = 5, Q_k,2 = 3 kN, ψ₀ = 0,6 | E_d = 13,5 + 7,5 + 2,7 = 23,7 kN | identisch |
| SK2 | Beispiel 1: Stütze 35 × 35 cm, C30/37, G_k = 800, Q_k = 300 kN | N_Ed = 1530 kN; N_Rd = 2082,5 kN; η = 0,735 | richtig |
| SK3 | Beispiel 2: Windsog −1,20, g_k = 0,30 kN/m² | γ_G = 1,35: −1,395; γ_G,inf = 1,00: −1,50 kN/m² | richtig |

Teilsicherheitsbeiwerte (1,35/1,00; 1,50/0; γ_C 1,50, γ_S 1,15, γ_M0 1,00, γ_M Holz 1,30) und ψ₀ (Kategorie A–D 0,7; E 1,0; Schnee 0,5/0,7; Wind 0,6; Temperatur 0,6) entsprechen DIN EN 1990/NA.

**Befunde**
- **behoben – T4-SK-1:** Unter Regelwerke stand „Nachfolger DIN EN 1990 (EN 1990:2023) vorbestellbar“. Der Text nennt jetzt DIN EN 1990-1:2026-12 (EN 1990-1:2023+A1:2026, Teil 1: Neubauten), den NA-Entwurf und „bauaufsichtlich noch nicht eingeführt“. Der Hinweis zur zweiten Eurocode-Generation nennt die Umbenennung in EN 1990-1.
- **Grenzen ergänzt:** Das Modul rechnet, hatte aber keinen Eintrag in `rechnerGrenzen.ts`. Der neue Eintrag nennt drei Grenzen:
  - nur Gl. 6.10,
  - Q_k,1 ist fest die Leiteinwirkung,
  - ein gemeinsames γ_G.
- **offen – Frage T4-SK-2:** Der Rechner setzt Q_k,1 immer als Leiteinwirkung an. Nach Gl. 6.10 ist jede veränderliche Einwirkung einmal als Leiteinwirkung zu untersuchen. Soll ein Schalter „Leiteinwirkung tauschen“ mit Anzeige des Maximums ergänzt werden? Der Zustand `psi0_1` wird in der Komponente nicht verwendet.
- Hinweis für andere Module: `normen_ausblick` und `statistik` nennen EN 1990:2023 ohne die neue Benennung EN 1990-1. Sie gehören nicht zu dieser Tranche und wurden nicht geändert.

**Empfehlung:** freigabefähig nach Korrektur T4-SK-1 und Klärung von T4-SK-2.

- [ ] Modul freigeben

## 7. Probenahme & Erkundung (`probenahme`)

**Prüfumfang:** `src/modules/Probenahme.tsx`:
- Haufwerksbeprobung (Text),
- Bohrkern-Prüfer,
- Bohrmehlrechner,
- Rückprall-Simulator.

Dazu `content/probenahme/Probenahme.json` mit drei Beispielen und die Lernziele.

**Normstand:**
- EBV § 8, LAGA PN 98 (2019), DIN 19698-1/-2, DIN 19747, DIN EN 932-2, DIN EN 12504-1:2021-02, DIN EN 12504-2:2021-10 und DIN EN 14629:2007-06 wie im Modul.
- DIN EN 13791/A20:2022-04 ist der deutsche Anhang zu DIN EN 13791:2020-02 mit η = 0,85 ([DIN Media](https://www.dinmedia.de/de/norm/din-en-13791-a20/351305107)).

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Komponente / Kern |
|---|---|---|---|
| PN1 | Bohrmehl Ø 12 mm, Δz = 10 mm, 3 Löcher, ρ = 2,2 g/cm³ | 3·π·0,6²·1,0·2,2 = 7,46 g | identisch |
| PN2 | Beispiel 1: Ø 16 mm, 2 Löcher | 2·4,42 = 8,85 g ≥ 5 g | richtig |
| PN3 | Beispiel 2: h/d = 1,5, f_core = 35,0 | k = 0,96 (ASTM C42); 33,6 N/mm² | richtig |
| PN4 | Beispiel 3: R = 36, nach oben | ΔR = (−7,1 + 0,08·36)·sin 90° = −4,22; R_korr = 31,8 | Kern `rueckprall` identisch |
| PN5 | Startwerte R = 38, horizontal, d_k = 15 mm | k = 1 − 0,015·10 = 0,85; R = 32,3; f_c = 0,0125·32,3^2,22 = 28,0 N/mm² | identisch (vorher 1,4·R − 20 mit −0,15 Skt./mm: R = 35,8, 30 N/mm²) |
| PN6 | R = 30, nach unten | ΔR = +3,01; R = 33,0; f_c = 29,4 N/mm² | identisch |

**Befunde**
- **behoben – T4-PN-1 (Rückprall):** Der Simulator nutzte drei eigene Ansätze, im Repo sonst nirgends verwendet:
  - die Festigkeitsgerade f ≈ 1,4·R − 20,
  - einen additiven Karbonatisierungsabzug −0,15 Skt./mm (höchstens −6),
  - eine linear interpolierte Winkeltabelle (−5,4 statt −5,5 bei R = 20).
  
  Bauwerksuntersuchung, ZfP und Virtuelle Versuche rechnen seit Runde 5 (Z55) und der Entscheidung vom 27.10. einheitlich mit der Herstellerformel Original Schmidt Typ N, dem Faktor k = max(0,75; 1 − 0,015·(d_k − 5)) und der Lehrkurve 0,0125·R^2,22. Bei R = 38 lag der Rohwert-Schätzwert damit bei 33 statt 40 N/mm².
  
  Der Simulator ruft jetzt `rueckprall()` und `rueckprallLehrkurve()` aus `src/calc/bauwerksuntersuchung.ts` auf. Hinweistext und Beispiel 3 nennen die Formel. Test: `tests/modulpruefungTranche4.test.ts` (PN4–PN7).
- **Grenzen ergänzt** (`probenahme`):
  - Bohrmehl mit fester Rohdichte und Richtwert 5 g,
  - Bohrkernfaktoren nur für 1 ≤ h/d ≤ 2,
  - Rückprall als Lehransatz.
- **offen – Frage T4-PN-2 (Messreihe nach DIN EN 12504-2):** Das Modul schreibt: „Weichen mehr als 20 % der Einzelwerte um mehr als 25 % vom Median ab, wird die gesamte Messreihe verworfen“. Nach meinem Kenntnisstand nennt DIN EN 12504-2 als Schwelle eine Abweichung um **6 Einheiten** vom Median. Öffentlich war der Wortlaut nicht belegbar. Bitte am Normtext bestätigen.

**F-Freigabe-Stellen:** Verwerfungsregel der Messreihe, DIN EN 12504-2:2021-10, Auswertung (T4-PN-2).

**Empfehlung:** freigabefähig nach Korrektur T4-PN-1 und Klärung von T4-PN-2.

- [ ] Modul freigeben

## 8. Messen & Prüfen (`messen_pruefen`)

**Prüfumfang:**
- `src/calc/pruefverfahren.ts`: `gumMessunsicherheit`, `ringversuch`, `werkzeugToleranz`, `messwerteAusText`.
- Reiter Begriffe, Treffbild, Messunsicherheit, Prüfstreuung und Ringversuche.
- Vier JSON-Dateien, Grenzen, Erkundung, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| MP1 | Beispiel 1: 38,5/39,2/37,8/38,9/39,6 MPa, d = 0,1, U_kal = 0,15 | s = 0,689; u_A = 0,308; u_B = 0,029/0,075; u_c = 0,319; U = 0,64 MPa | identisch |
| MP2 | Beispiel 2: x = 46,0, X = 50,0, σ_pt = 1,8, U = 1,4/0,6 | z = −2,22 (fraglich); E_n = −2,63 (nicht zufriedenstellend) | identisch |
| MP3 | Gliedermaßstab Klasse II, 2 m | ±(0,3 + 0,2·2) = ±0,7 mm | identisch |

- **Fachtext ohne Befund:**
  - r = 2,8·s_r (1,96·√2),
  - ISO/IEC 17025, 7.7.2,
  - Bewertungsgrenzen nach DIN ISO 13528 (|z| ≤ 2, < 3, ≥ 3; |E_n| ≤ 1),
  - Betonprüfmaschinen mindestens Klasse 1 nach DIN EN ISO 7500-1.

**Befunde:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 9. Analytik & Diagnostik (`analytik`)

**Prüfumfang:** `src/modules/Analytik.tsx` (TGA- und MIP-Simulator, REM/EDX, XRD), `content/analytik/Analytik.json` (Verfahren, Chloridbestimmung, drei Beispiele), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Komponente |
|---|---|---|---|
| AN1 | Beispiel 1: TGA-Stufe 400–500 °C, 2,5 % | 2,5·74,09/18,02 = 10,3 M.-% Ca(OH)₂ | richtig |
| AN2 | Beispiel 2: Hg, γ = 0,485 N/m, θ = 140°, p = 100 bar | r = 0,743 N/m / 10⁷ Pa = 74,3 nm | Simulator vorher 75,0 nm, jetzt 74,3 nm |
| AN3 | Beispiel 3: Cu-Kα 0,15406 nm, 2θ = 26,6° | d = 0,335 nm (Quarz) | richtig |
| AN4 | TGA-Lehrmodell bei 1000 °C | 100 − 2 − 4 − 2,5 − 6 = 85,5 % | identisch |

Chloridklassen Cl 0,40 und Cl 0,20, Plasmatemperatur 6000–10 000 K, NIR 780–2500 nm und MIP bis rund 4000 bar sind richtig.

**Befunde**
- **behoben – T4-AN-1:** Der MIP-Simulator rechnete mit der gerundeten Konstanten 7500 nm·bar. Die Überschrift nennt γ = 0,485 N/m und θ = 140°, daraus folgen −2·0,485·cos 140°/10⁵ = 7431 nm·bar. Simulator und Beispiel 2 (74 nm, Faustformel 7400) widersprachen sich. Der Simulator rechnet jetzt mit der Washburn-Gleichung (`WASHBURN_NM_BAR`).
- **Grenzen ergänzt** (`analytik`): TGA-Lehrprobe mit linearen Stufen; MIP im Zylinderporenmodell, Flaschenhals-Effekt.

**Empfehlung:** freigabefähig nach Korrektur T4-AN-1.

- [ ] Modul freigeben

## 10. Mechanische Prüfungen (`mechanische_pruefungen`)

**Prüfumfang:**
- `src/calc/pruefverfahren.ts`: `bohrkernPruefung`, `spaltzugfestigkeit`, `marshallQuotient`, `zugversuchStahl`, `holzSchaetzung`, `biegezug4Punkt`.
- `content/mechanischepruefungen/MechanischePruefungen.json` (zwölf Prüfverfahren, drei Beispiele).
- Grenzen, Erkundung, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| ME1 | Kern Ø 100, h = 100 mm, 350 kN | f = 44,56 N/mm² (h/d = 1 → Würfel); Zylinder über die Klassen 34,73 N/mm² | identisch |
| ME2 | Beispiel 2: Zylinder 150/300, 250 kN | f_ct,sp = 3,54; f_ct = 0,9·3,54 = 3,18 N/mm² | identisch |
| ME3 | Beispiel 3: Ø 12, F_e = 62,0, F_m = 69,5 kN, L₀ = 100, L_m = 107,5 mm | R_e = 548, R_m = 615, R_m/R_e = 1,12, A_gt = 7,5 % → B500B | identisch |
| ME4 | Holz 4-Punkt: F = 20 kN, L = 2700, b = 100, h = 150, u = 18 % | f_m = 3F·(L/3)/(bh²) = 24,0 N/mm²; Feuchtefaktor 0,79 → Niveau C24 | identisch |
| Beispiel 1 | Würfel 150 mm, 1050 kN | 46,7 N/mm²; Prüfdauer bei 0,6 MPa/s ≈ 78 s | richtig |

Prüfnormangaben ohne Befund:
- Belastungsraten 0,6 ± 0,2 MPa/s (Druck) und 0,04–0,06 MPa/s (Biegezug, Spaltzug).
- Charpy-V-Kerbe 2 mm, 45°, r = 0,25 mm, Übergabe in höchstens 5 s; S355J2 27 J bei −20 °C.
- Rückbiegeversuch: 90°, Alterung 100 °C, mindestens 20°.
- DIN EN 408: L = 18 h, a = 6 h, Bruch nach 300 ± 120 s.

**Befunde:** keine (Lehrfaktoren Bohrrichtung 1,085 und +3,5 % je Stab sind in den Grenzen gekennzeichnet; BS 1881-120 ergibt 2,5/2,3 = 1,087).

**F-Freigabe-Stellen:** Obergrenze R_e,ist/R_e,nenn ≤ 1,30 für B500B (Kern, Hinweistext „vorläufig, F-Freigabe“).

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 11. Virtuelle Versuche (`labor`)

**Prüfumfang:**
- `src/modules/Labor.tsx` mit den Simulatoren in `src/components/labor/*`: Universalprüfstand, Spaltzug, Biegezug, Haftzug, Schmidt-Hammer, Frischbeton.
- `BitumenVersuche.tsx`.
- `content/labor/Labor.json` mit zwei Beispielen.
- Die Simulatoren umfassen rund 6500 Zeilen; geprüft wurde als Stichprobe der Formelkern je Simulator.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Komponente / Text |
|---|---|---|---|
| LB1 | Beispiel 1: Haftzug Ø 50 mm, 3,20 kN | f_h = 1,63 N/mm²; Laststeigerung 0,05 MPa/s ≙ 98 N/s | richtig |
| LB2 | Beispiel 2: f_c = 38,0, Δε = 2,70·10⁻⁴ | σ_a = 12,67, σ_b = 3,8 → E_C,S = 32 840 N/mm² (mit gerundetem σ_a = 12,7: 32 960) | richtig (Rundung im Rechenweg, kein Befund) |
| LB3 | Spaltzug C30/37, f_ct,sp = 3,22, Zylinder 150/300 | F = f_ct,sp·π·d·l/2 = 227,6 kN | identisch |
| LB4 | Biegezug: Hebelarm L/6 (4-Punkt) bzw. L/4 (3-Punkt) | M = F·L/6 bzw. F·L/4 | identisch |

Die Betonkennwerte der Simulatoren (f_ctm, E_cm je Klasse nach Tab. 3.1; f_ct,sp ≈ f_ctm/0,9) sind richtig. Der Schmidt-Hammer nutzt den zentralen Kern.

**Befunde:** keine.

**Empfehlung:** freigabefähig (auf Grundlage der Stichprobe).

- [ ] Modul freigeben

## 12. Festbeton (Statistik) (`festbeton_statistik`)

**Prüfumfang:** `src/calc/festbetonStatistik.ts`, `src/modules/FestbetonStatistik.tsx`, `content/festbetonstatistik/FestbetonStatistik.json` (Kriterien, zwei Beispiele), Grenzen, Erkundung, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| FS1 | f_cm = 38, σ = 5, Zylinder, α_cc = 0,85, γ_c = 1,5 | f_ck = 29,775; f_cd = 16,87; Kriterium 1 (Erstherstellung) 33,775 N/mm² | identisch |
| FS1b | wie FS1, Würfelanzeige | Faktor 30 + (29,775 − 25)/5·7 = 36,69 → 1,232 | identisch |
| FS2 | Beispiel 1: 41,0/39,5/43,2, C30/37 | f_cm = 41,2 ≥ 41,0; f_ci,min = 39,5 ≥ 33 → konform | identisch |
| FS3 | Beispiel 2: σ = 4,0, n = 15 | 37 + 1,48·4,0 = 42,9 ≤ 44,5 | richtig |
| FS4 | stetig, σ der Vorserie 2,5 N/mm² | σ = 3,0 angesetzt: 37 + 4,44 = 41,44 | identisch |

**Befunde:** keine.

**F-Freigabe-Stellen:** Mindeststandardabweichung σ ≥ 3 N/mm² bei stetiger Herstellung nach DIN 1045-2 (Kern, „vorläufig, F-Freigabe“).

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 13. bis 17. Versuchs-Handouts (`labor_potentialmessung`, `labor_auslagerung`, `labor_frischbeton`, `labor_druckfestigkeit`, `labor_moertelprismen`)

**Prüfumfang:** `src/calc/laborversuche.ts`, Handout-Daten `src/data/laborhandouts/*.ts` (Ziele, Geräte, Ablauf, Lehrbeispiele, Fehlerquellen), Komponenten `src/modules/laborhandouts/*.tsx`, Texte `content/laborhandouts/*.json`, Grenzen, Erkundungsaufträge (je drei), Lernziele.

**Nachrechnungen**

| Fall | Handout | Eingabe | Handrechnung | Kern |
|---|---|---|---|---|
| HP1 | Potential | Lehrwerte, Ag/AgCl gesättigt (+197 mV), CSE +316 mV | Nullmessung −80 → −199 mV CSE; 4 g NaCl: −330 → −449 mV CSE | identisch |
| HP2 | Potential | pH 12,6, 4 g NaCl in 1 L | c(OH⁻) = 0,0398; c(Cl⁻) = 0,0684 mol/L; Cl⁻/OH⁻ = 1,72; Sprung bei 4 g (−215 mV) | identisch |
| HP3 | Potential | Kalomel statt Ag/AgCl; pH 12,0 | −155 mV CSE; Cl⁻/OH⁻ = 6,84 (Erkundung) | identisch |
| HA1 | Auslagerung | Ø 12 × 100 mm | A = (π·12·100 + 2·π·36)/100 = 39,96 cm² | identisch |
| HA2 | Auslagerung | Lehrwerte NaCl / Ca(OH)₂, Blind 0,010 g, 28 d, ρ = 7,85 | 99,3 / 0,69 µm/a; ohne Blindwert 4,85 µm/a; 14 d: 198,6 µm/a | identisch |
| HF1 | Frischbeton | d₁/d₂ = 450/470 bzw. 440/455 | 460 / 450 mm (auf 10 mm), F3 | identisch |
| HF2 | Frischbeton | m = 22,045 − 3,215 kg, V = 8 L, A₁ = 2,1, G = 0,2, Soll 2400 | D = 2350 kg/m³; L = 1,9 %; Gegenprobe 2,1 % | identisch |
| HD1 | Würfeldruck | drei Würfel 955/980/935 kN | 42,4/43,6/41,5; f_cm = 42,5 → C30/37 | identisch |
| HD2 | Würfeldruck | Trockenlagerung ×0,92 | f_cm = 39,1 → C25/30; W3 mit 860 kN: 38,1 N/mm² | identisch |
| HM1 | Mörtelprismen | F_f = 2,90/3,10/3,00 kN, sechs F_c | R_f = 1,5·F·100/40³ = 7,03; R_c = 50,07 → 42,5 | identisch |
| HM2 | Mörtelprismen | zweite Hälfte B 65 kN | Abweichung 16,5 % > 10 % → verworfen; Mittel der übrigen fünf 50,28 | identisch |

**Normangaben ohne Befund:**
- Potentialmessung:
  - Bezugselektroden (Ag/AgCl gesättigt 197 mV, KCl 3 mol/L 210 mV, Kalomel 241 mV, CSE 316 mV),
  - Grenzen nach ASTM C876 (−200/−350 mV CSE),
  - Cl⁻/OH⁻ = 0,6 nach Hausmann.
- Auslagerung: K = 8,76·10⁷ in µm/a mit t in h (ASTM G1).
- Frischbeton (DIN EN 206, DIN EN 12350-5/-6/-7):
  - Ausbreitmaßklassen F1–F6,
  - Ablauf: 2 Lagen mit je 10 Stößen, 30 s Wartezeit, 15 Hübe,
  - Rundung auf 10 mm bzw. 10 kg/m³.
- Würfeldruck: 0,6 ± 0,2 MPa/s ≙ 13,5 kN/s am 150-mm-Würfel; Faktor 0,92/0,95 nach DIN EN 12390-2/NA.
- Mörtelprismen (DIN EN 196-1, DIN EN 197-1):
  - Normmörtel 450/1350/225 g,
  - Prüfgeschwindigkeiten 50 ± 10 N/s (Biegezug) und 2400 ± 200 N/s (Druck),
  - ±10-%-Regel mit Verwerfen der Serie,
  - Zementklassen 32,5/42,5/52,5 mit Obergrenzen.

**Befunde:** keine. Die Vereinfachungen sind in den Grenzen genannt: Klassenzuordnung nach der Erstherstellung, Faktor 0,92/0,95 nach dem Mittelwert, keine Bewertung der Anfangsfestigkeit.

**Empfehlung:** alle fünf freigabefähig.

- [ ] Modul freigeben (`labor_potentialmessung`)
- [ ] Modul freigeben (`labor_auslagerung`)
- [ ] Modul freigeben (`labor_frischbeton`)
- [ ] Modul freigeben (`labor_druckfestigkeit`)
- [ ] Modul freigeben (`labor_moertelprismen`)

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage |
|---|---|---|
| T4-MK-1 | Kennwerte | λ der Mauersteine (KS 12: 0,9 statt nach meinem Kenntnisstand 0,99 W/(mK); MZ 12) an DIN 4108-4 angleichen oder als Lehrwerte kennzeichnen? |
| T4-BC-2 | Bauchemie | Faustregel b : t (≤ 10 mm 1 : 1, darüber 2 : 1) am Normtext DIN 18540 bestätigen oder durch Tabellenwerte ersetzen? |
| T4-SK-2 | Sicherheitskonzept | Schalter „Leiteinwirkung tauschen“ (Maximum beider Kombinationen nach Gl. 6.10) ergänzen? |
| T4-PN-2 | Probenahme | Verwerfungsregel DIN EN 12504-2: Abweichung „mehr als 25 %“ oder „mehr als 6 Einheiten“ vom Median? |
| T4-KG-1 | Baustoffkenngrößen | c_p von Stahl einheitlich (z. B. 450 J/(kgK) nach DIN EN ISO 10456) statt 440/460/480? (Hinweis) |

## Nachweis der Prüfung

- **Unabhängige Nachrechnung:** eigenes Skript (Python) mit eigener Umsetzung der Norm- und Modellgleichungen, 97 Werte. 65 davon sind als `tests/modulpruefungTranche4.test.ts` gegen die Kerne übernommen. Die Inline-Rechnungen (Baustoffkenngrößen, Sicherheitskonzept, Probenahme, Analytik, Virtuelle Versuche) wurden über die Formeln abgeglichen.
- **Öffentliche Quellen dieser Prüfung:**
  - [DIN Media, DIN EN 1990-1 (EN 1990-1:2023+A1:2026)](https://www.dinmedia.de/en/standard/din-en-1990-1-a1/400467169)
  - [DIN Media, E DIN EN 1990-1/NA](https://www.dinmedia.de/en/draft-standard/din-en-1990-1-na/407077791)
  - [DIN Media, DIN EN 13791/A20:2022-04](https://www.dinmedia.de/de/norm/din-en-13791-a20/351305107)
  - [DIN Media, DIN EN ISO 80000-1 (EN ISO 80000-1:2022)](https://www.dinmedia.de/de/norm/din-en-iso-80000-1/362915152)
  - [SalzWiki, Sodium sulfate](https://saltwiki.hawk.de/index.php/Sodium_sulfate)
  - [Wikipedia, Joseph Aspdin](https://en.wikipedia.org/wiki/Joseph_Aspdin)
  - [Deutsche Biographie, Wayss](https://www.deutsche-biographie.de/sfz139203.html)
  - [Deutsche Biographie, Koenen](https://www.deutsche-biographie.de/gnd117528471.html)
  - [TU Dresden, Einweihung CUBE](https://tu-dresden.de/tu-dresden/newsportal/news/feierliche-einweihung-des-weltweit-ersten-gebaeudes-aus-carbonbeton-cube)
  - [UNEP, Global Status Report for Buildings and Construction](https://www.unep.org/resources/report/global-status-report-buildings-and-construction)
