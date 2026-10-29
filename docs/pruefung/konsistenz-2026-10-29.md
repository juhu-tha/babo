# Modulübergreifende Konsistenz der Kennwerte (29.10.2026)

**Ziel:** Werte, die in mehreren Modulen vorkommen, auf unterschiedliche Zahlen für dieselbe Größe prüfen.

**Umfang:** `content/**`, `src/data/**` (einschließlich `quiz.json` und `tasks/**`), `src/calc/**`, `src/modules/**`, `src/components/**`.

**Vorgehen:**
- Suche nach Größe und Baustoff mit `rg`, dazu eigene Skripte:
  - Normausgaben: dieselbe Norm mit mehreren Ausgabedaten (39 Normen; die meisten bewusst, z. B. 1. und 2. Generation, historische Ausgaben).
  - EC2-Tab.-3.1-Werte im Fließtext gegen die Tabelle (`f_cm`, `f_ctm`, `E_cm` je Klasse; nur Distraktoren und Formelwerte abweichend).
  - Expositionsklassen: `NORMATIVE_EXPOSURE_CLASSES` gegen `DIN1045_2_EXPOSITIONSKLASSEN`.
  - Kopie der Tab. 3.1 in `src/data/standards/eurocode2.ts` gegen `CONCRETE`.
- Maßgebend ist jeweils die zentrale Konstante bzw. der geprüfte Kern. Entschiedene Werte sind aus den Befundlisten `docs/pruefung/*` übernommen.
- Regressionstest: `tests/konsistenz1029.test.ts`.

**Ergebnis:** 29 Funde.
- **10 angeglichen** (A-1 … A-10).
- **11 geklärt:** bewusst unterschiedliche Werte bzw. Bezugsgrößen (G-1 … G-11).
- **8 offene Fragen mit Vorschlag** (F-1 … F-8).

## Angeglichen

| Nr. | Wert | Fundstellen | vorher | nachher | Begründung |
|---|---|---|---|---|---|
| A-1 | ε_c1 nach EC2 Tab. 3.1, C12/15 … C45/55 | `src/data/standards/eurocode2.ts` (`EUROCODE2_TABELLE_3_1`, exportiert über `normParams.ts`) gegen `CONCRETE` (`src/utils/ec2Spannbeton.ts`, geprüft) | 1,6 / 1,7 / 1,8 / 1,9 / 2,0 / 2,1 / 2,2 / 2,3 ‰ | 1,8 / 1,9 / 2,0 / 2,1 / 2,2 / 2,25 / 2,3 / 2,4 ‰ | Übertragungsfehler: Werte um eine Klasse verschoben. Alle übrigen Spalten waren gleich. Die Tabelle wird derzeit von keinem Rechner gelesen. Abgleich im Test. |
| A-2 | Ausgabe EC2 in derselben Datei | `eurocode2.ts` (Kopf, `norm`), `standards/index.ts` | „DIN EN 1992-1-1:2023-08 & NA:2023-08“ | DIN EN 1992-1-1:2011-01 + A1:2015-03 & NA:2013-04 + NA/A1:2015-12 | Eine Ausgabe 2023-08 gibt es nicht. Tab. 3.1 stammt aus der eingeführten 1. Generation; die 2. Generation ist DIN EN 1992-1-1:2025-09 (`centralNormenRegistry.ts`). |
| A-3 | Differentielle Schwindmaße Fichte und Kiefer (q_r/q_t) | Modul Holz (`src/modules/Holz.tsx`, Fichte, Kiefer, BSH; `content/holz/Holz.json`) gegen `SCHWINDBEIWERTE` (`src/calc/holzphysik.ts`; Module Holzbau, Historische Bauweisen) | Fichte/BSH 0,16/0,33; Kiefer 0,17/0,31 %/% | Fichte/BSH/Kiefer 0,19/0,36 %/% (Import der Kernkonstante; Eiche 0,18/0,34 ebenfalls aus dem Kern) | Veraltete Kopie: entschieden in T10-HW-1 und in T12-HB-1 übernommen (TU München, Skript „Holz – Eigenschaften, Merkmale“). |
| A-4 | Folge von A-3: Erkundung Holz | `src/data/erkundung.ts` (`holz`) | Brett 116,4 statt 114,6 mm; Bohle nach 30 d 26,8 % und 2,1 mm, nach 365 d 14,8 % und 190,0 mm | Brett 116,1 statt 114,2 mm; Bohle 26,4 % und 2,6 mm bzw. 13,2 % und 187,9 mm | Mit dem Kern nachgerechnet (τ = 135 d bei 60 mm). Die Bohlenwerte passten schon vorher nicht zum Kern (26,8 % entspricht nicht τ = 135 d). |
| A-5 | Folge von A-3: Quiz `q_hol_2` (Erklärung) | `src/data/quiz.json` | q_t ≈ 0,33, q_r ≈ 0,16 | q_t ≈ 0,36, q_r ≈ 0,19 | Die Erklärung widersprach dem Modul. Die Antwort (Verhältnis ≈ 2) bleibt. `verified` false, Prüfliste neu erzeugt. |
| A-6 | Wärmedehnzahl Beton α_T | Klebstoff- und Dichtstoffberater (`src/components/KlebstoffBerater.tsx`, Modul `bp_klebstoffe`) gegen das Rechenbeispiel desselben Moduls, `betonkennwerte`, `hydratation` (10 · 10⁻⁶) | 12 · 10⁻⁶ 1/K | 10 · 10⁻⁶ 1/K | DIN EN 1992-1-1, 3.1.3(5); das Fugenbeispiel des Moduls rechnet schon mit 10. Quizfragen nicht betroffen (`qn_bp_klebstoffe_3` rechnet mit Aluminium). |
| A-7 | CO₂-Faktor Erdgas | `src/calc/bauprodukte.ts` (`CO2_FAKTOR_HEIZUNG`, Dämmberater) | Kopie 0,24 | Import aus `FAKTOREN.bis_2026` (`src/calc/energieausweis.ts`), Wert 0,24 | Zentrale Konstante statt Kopie (GModG Anlage 9). Zahl unverändert. |
| A-8 | Teilsicherheitsbeiwerte γ_M (Statistik) | `src/calc/statistik.ts` | Kopie 1,5 / 1,15 / 1,3 | Import von `GAMMA_C.staendig`, `EC2_NA_DE.gammaS` und `GAMMA_M_HOLZ` | Zentrale Konstanten statt Kopie. Zahlen unverändert. |
| A-9 | Spez. Wärmekapazität EPS | Baustoffkenngrößen, Preset EPS (`src/modules/Baustoffkenngroessen.tsx`) gegen Wärmeeigenschaften | 1500 J/(kg·K) | 1450 J/(kg·K) | DIN EN ISO 10456, Tab. 3; gleicher Wert wie im Modul Wärmeeigenschaften. Keine Erkundung oder Quizfrage betroffen. |
| A-10 | UV-Durchlässigkeit ETFE (Nachtrag aus der Koordination) | `content/membranenetfe/MembranenETFE.json` (3 Stellen) gegen die am 29.10. entschiedene Quizfassung `qn_membranen_etfe_3` | „anders als Floatglas – in hohem Maß UV-A-durchlässig“ | „UV-durchlässig (UV-A und UV-B); Floatglas sperrt UV-B weitgehend“ | Gleiche Aussage wie in der Quizfrage. |

**Begriffe angeglichen, Werte unverändert (Klarstellung im Text):**
- **λ = 2,3 W/(m·K):** im U-Wert-Beispiel (`content/beispielrechnungen/RechnungUWert.json`, Kommentar in `Beispielrechnungen.tsx`, Erkundung `rechnung_u_wert`) heißt die Schicht jetzt „Stahlbeton (bewehrt)“ statt „Normalbeton“.
  - Nach DIN EN ISO 10456 gilt 2,3 für armierten Beton mit 1 % Bewehrung.
  - Unbewehrter Beton mit 2400 kg/m³ hat 2,0; so steht er in Baustoffkenngrößen, Wärmeeigenschaften und im Quiz.
- **„GEG-Höchstwert“/„GEG-Grenzwert“ → „Höchstwert nach (Anlage 7) GModG (vormals GEG)“**, wie in T6-IA-2, T8-DA-5 und T8-GL-2 entschieden.
  - Fundstellen: Erkundung `bauphysik` und `rechnung_u_wert`, `rechnerGrenzen.ts` (`daemmung_vergleich`), `content/nachhaltigkeit/Nachhaltigkeit.json` (2 Labels), Dämmberater („Empfehlung für GModG“).
- **LCC Fensterszenario** (`content/lcc/LCC.json`): Die Beschreibung sagt jetzt, dass die Nutzungsdauern 25 bzw. 45 a Szenariowerte sind.
  - Die BNB-Tabelle 2017 nennt 40 a bzw. ≥ 50 a (T11-LCA-2). Die Rechnung ist unverändert.

## Geklärt – bewusst unterschiedlich

| Nr. | Wert | Fundstellen | Werte | Begründung |
|---|---|---|---|---|
| G-1 | CO₂-Faktor Netzstrom | Energieausweis/Bestand (GModG Anl. 9); LCA-Rechner B6 (`lca.ts`); KI-Baustoffe; Nachhaltigkeit, Praxisbeispiel | 560 g/kWh; 0,53203 kg/kWh (QNG-Rechenwerte 2023); 0,36 (Lehrwert UBA-Strommix); 0,43 (über 50 a gewichtet sinkend) | Verschiedene Bezugsgrößen: Gebäudebewertung, QNG-Ökobilanz, Lehrbeispiel, Zukunftsszenario. In allen Modulen benannt. |
| G-2 | λ Beton | Baustoffkenngrößen, Wärmeeigenschaften, Quiz (2,0) gegen Dämmberater „Stahlbetonwand“ (2,3) | 2,0 / 2,3 | Unbewehrt gegen bewehrt (DIN EN ISO 10456). Zur Fragestellung siehe F-1. |
| G-3 | E-Modul Stahl | Betonstahl 200 000 N/mm² (`E_BETONSTAHL`), Baustahl 210 000 N/mm² (`E_BAUSTAHL`) | 200 / 210 GPa | EC2 3.2.7(4) gegen EC3 3.2.6; zentral getrennt, keine vertauschte Verwendung gefunden. |
| G-4 | XM2-Grenzwerte | `din1045_2.ts` (0,45/C35/45/320) gegen Modul Expositionsklassen (0,55/C30/37/300) | – | Beide Varianten aus DIN 1045-2, Tab. F.2.2: mit bzw. ohne Oberflächenbehandlung. Die jeweils andere Variante steht im Text. |
| G-5 | Zement-GWP in Aufgaben | `qn_biokohlebeton_3` (0,80), CBAM-Frage `qn_lca_regulatorik_5` (0,8 t/t) gegen `ZEMENT_GWP_KG` (0,665) | – | In der Aufgabe vorgegebene Daten bzw. eingebettete Emissionen nach CBAM (andere Bezugsgröße); Rechnung richtig. Vorschlag dazu: F-8. |
| G-6 | CEM I in der ÖKOBAUDAT-Konsole (Materialdatenbanken) | 680 kg CO₂-Äq./t gegen VDZ-Branchen-EPD 665 | – | Musterwert einer herstellerspezifischen EPD („Spezifisch (EPD)“, „Musterwert“) gegen Branchenwert. Die A2-Lehrwerte sind daraus skaliert. |
| G-7 | Rohdichte Fichte | Holz 450 kg/m³ gegen Wärmeeigenschaften und Baustoffkenngrößen 500 kg/m³ | – | Mittlere Rohdichte Fichte gegen den Bemessungswert Bauholz nach DIN EN ISO 10456 (λ 0,13 bei 500 kg/m³). |
| G-8 | Normausgaben DIN 4108-2 | 2013-02 (40 Stellen) / 2026-05 (18 Stellen) | – | Entscheidung 28.10.: Es wird nach 2013-02 gerechnet (§§ 11, 14 GModG); 2026-05 erscheint überall nur als Hinweis bzw. in der Registry. |
| G-9 | Normausgaben DIN 4108-3 | Feuchteschutz: Randbedingungen „DIN 4108-3:2018-10“, sonst 2024-03 | – | § 11 GModG nimmt 2018-10 in Bezug; die Randbedingungen gelten unverändert seit 2014-11 (`glaser.ts`). |
| G-10 | Normausgaben weiterer Normen | DIN EN 1990 (2010-12 in zwei Quiz-Quellen, sonst 2021-10); DIN 1045-2/-3 (2008 bzw. 2012 nur historisch); DIN EN 206-1:2026-07 (Neuausgabe); DIN 20000-401:2026-11 (Entwurf); DIN 18533-1 (2017-07 als Vorgänger benannt); DIN EN 15804/15978 (Ausgaben 2012/2011 als EN-Bezug); EC 5/EC 3, 2. Generation | – | Bewusst: Vorgängerausgabe mit gleichem Inhalt (2021-10 ist die berichtigte Neuausgabe von 2010-12), historische Aussage, Ausblick oder Entwurf. |
| G-11 | Weitere Kennwerte ohne Abweichung | Stahl ρ 7850 kg/m³ (17 Stellen; Edelstahl 7980), λ Stahl 50; c_min,dur XC1 … XS3 (10/20/25/40) mit Δc_dev; Expositionsklassen (bis auf G-4 gleich); EC2-Werte im Fließtext; γ_c 1,5, γ_s 1,15, γ_M Holz 1,3 (auch BSH), γ_G 1,35, γ_Q 1,5; Wärmedehnzahl Stahl 12, Aluminium 23, Glas 9; Zement-GWP (nach T15-NH-3 überall `zementGwp.ts`); Kriechzahlen (nur fallbezogene Eingaben) | – | Konsistent. |

## Offene Fragen mit Vorschlag

| Nr. | Wert | Fundstellen | Werte | Vorschlag |
|---|---|---|---|---|
| F-1 | λ „Stahlbeton“ | Quiz `qn_bauphysik_1` (freigegeben): „20 cm Stahlbeton (λ = 2,0)“; `qn_rechnung_u_wert_2`: „Normalbeton (λ = 2,3)“ | 2,0 / 2,3 | Begriffe tauschen, ohne die Rechnung zu ändern: in `qn_bauphysik_1` „Normalbeton (unbewehrt)“, in `qn_rechnung_u_wert_2` „Stahlbeton“. Die Rechnungen bleiben richtig; die Fragen sind nicht falsch und deshalb nicht geändert. |
| F-2 | Schwindmaß Fichte in Aufgaben | `qn_holz_1` und `q_hw_4` geben q_t = 0,33 vor (Ergebnis 5,3 mm); `q_hw_4` nennt zugleich radial 0,19 | 0,33 gegen 0,36 | Auf 0,36 umstellen: 200 · 0,0036 · 8 = 5,76 ≈ 5,8 mm; Distraktoren neu. Ohne Freigabe nicht geändert, weil die Aufgaben mit dem vorgegebenen Wert richtig sind. |
| F-3 | GWP Betonstahl | ÖKOBAUDAT-Konsole (Materialdatenbanken) „Betonstahl B500B“ 1120 kg/t; LCA-Rechner „Baustahl (Profilstahl/Bewehrung)“ 1100 kg/t; QNG-Tabelle 450 bzw. 1850 kg/t; Referenz `STAHL_GWP` (Materialoptimierung) 0,64 / 0,98 / 0,42 kg/kg; BIM 0,64; Übung im Anhang Nachhaltigkeit 0,75 (fiktiv) | 0,42 … 1,85 kg/kg | B500B in der Konsole auf 640 kg/t (ÖKOBAUDAT „Bewehrungsstahl (de)“, wie T14-BIM-1) und die A2-Lehrwerte mit Faktor 640/599 neu skalieren. Im LCA-Rechner Betonstahl und Profilstahl trennen oder als „Profilstahl (Hochofenroute)“ benennen. |
| F-4 | GWP Beton C25/30 und Holz im Modul Materialdatenbanken | Konsole C25/30 245, QNG-Tabelle „C25/30 (CEM I)“ 235 kg CO₂-Äq./m³; BSH −482 (Konsole), −580 (QNG-Tabelle), −720 (LCA-Rechner); KVH −620 (QNG-Tabelle), −740 (LCA-Rechner) | – | Gemeinsame Lehrwerttabelle für Beton, BSH und KVH (A1–A3 inkl. biogenem Kohlenstoff) in `src/data/`. Mindestens innerhalb eines Moduls ein Wert (C25/30 = 245 wie LCA-Rechner). |
| F-5 | Nutzungsdauer WDVS | Modul Lebensdauern „Fassade (Putz/WDVS)“ Mittel 30 a (20–40) gegen `BNB_NUTZUNGSDAUER` und Bezugseinheit: WDVS 40 a (BNB 2017, 335.641) | 30 / 40 a | Zeile teilen: „Außenputz“ und „WDVS (BNB 2017: 40 a)“, Mittel 40 a; vorläufig, F-Freigabe wie T11-LCA-2. |
| F-6 | Normausgabe DIN EN 1504-5 | Quiz-Quelle `q_is_cl_4` (Instandsetzungs-Checklisten) 2005-03; WU-Bauwerke 2013-05 | – | Ausgabe am DIN-Katalog prüfen (EN 1504-5:2013, deutsche Fassung vermutlich 2013-06) und beide Stellen auf die geltende Ausgabe setzen (Normtext, F-Freigabe). |
| F-7 | Begriff GEG in QNG-/B6-Zusammenhängen | LCA-Rechner, Nachhaltigkeit („Endenergie nach GEG“, „GEG-Berechnung“), Energieausweis-Label „GEG-Neubau Standard (B)“, Lernziel „GEG-Standard“ | – | Belassen, wo das QNG-Regelwerk oder ein historischer Standard gemeint ist. Sonst „GModG (vormals GEG)“ wie in diesem PR. |
| F-8 | Zement-GWP in `qn_biokohlebeton_3` | Quiz 0,80 kg CO₂e/kg gegen Modul Biokohlebeton 0,665 | – | Auf 0,665 umstellen: 2,0/0,665 ≈ 3,0 kg (Distraktoren neu: 2,0 · 0,665 ≈ 1,3 kg; 2,0 kg; 2,0 − 0,665 ≈ 1,3 kg → einen davon ersetzen). Freigegebene, nicht falsche Frage – nur auf Wunsch. |

## QA

- **Regressionstest:** `tests/konsistenz1029.test.ts`.
- **Statische Prüfungen:** tsc, npm test, check:formeln, check:zahlen, check-design, check-verwaist --strict, check-any.
- **Build und Barrierefreiheit:** Build, check-bundle, a11y-reiter auf den geänderten Routen. Ergebnis im PR.

## Umsetzung 29.10.2026

Entscheidungen zu F-1 … F-8 umgesetzt. Regressionstest: `tests/konsistenz1029.test.ts` (Abschnitt „Umsetzung der Entscheidungen 29.10.2026“). Nachrechnungen mit eigenem Skript gegen den Rechenkern `src/calc/lca.ts`.

| Nr. | Entscheidung | Ergebnis | Quelle | Dateien |
|---|---|---|---|---|
| F-1 | Begriffe zu λ tauschen, Rechnungen unverändert | `qn_bauphysik_1`: „20 cm Normalbeton, unbewehrt (λ = 2,0)“; `qn_rechnung_u_wert_2`: „20 cm Stahlbeton (λ = 2,3)“. U = 0,27 bzw. 0,234 W/(m²K) unverändert. | DIN EN ISO 10456 (2,0 unbewehrt, 2400 kg/m³; 2,3 bewehrt, 1 % Stahl) | `quiz.json` |
| F-2 | q_t 0,33 → 0,36 | `qn_holz_1` und `q_hw_4`: 200 · 0,0036 · 8 = 5,76 ≈ 5,8 mm. Distraktoren `qn_holz_1`: 11,5 mm (Δu = 16 %), 3,0 mm (radial 0,19), 0,6 mm (Faktor 10). `q_hw_4`: 0,2 mm (längs), 3,0 mm (radial), 14,4 mm (Δu = 20 %). | `SCHWINDBEIWERTE` (`src/calc/holzphysik.ts`, T10-HW-1) | `quiz.json` |
| F-3 | Betonstahl 640 kg/t, A2-Lehrwerte neu, Profil- und Betonstahl getrennt | Konsole (Materialdatenbanken) „Betonstahl B500B“: 1120 → 640 kg CO₂-Äq./t, Datensatz jetzt „Generisch“ (ÖKOBAUDAT „Bewehrungsstahl (de)“); PENRT 14 200 → 8100 MJ/t (mit 640/1120 skaliert, Lehrwert). A2-Lehrwerte `o-3` mit 640/598,8 = 1,07 neu skaliert: AP 3,2 → 1,8 mol H⁺-Äq.; EP-Süßwasser 0,015 → 0,0087 kg P-Äq.; EP-Meer 0,77 → 0,44 kg N-Äq.; EP-terrestrisch 8,8 → 5,0 mol N-Äq. LCA-Rechner: neuer Baustoff „Betonstahl B500 (Bewehrung, ÖKOBAUDAT)“ 640 kg/t (C 45, D −150 als Lehrwert über den Nettoschrott, ND ≥ 50 a); „Baustahl (Profilstahl, Lehrwert)“ bleibt 1100 kg/t (vorläufig). Standardaufbau, Varianten I/II und Szenarien A/B rechnen mit Betonstahl; Holz-Hybrid und Lehmbau (Verbindungsmittel) mit Profilstahl. Materialoptimierung: `STAHL_GWP.eaf_de` aus der Tabelle (0,64). | ÖKOBAUDAT „Bewehrungsstahl (de)“ 0,642 kg/kg (T11-MO-3); Quell-EPD der A2-Werte wie T14-MDB-5 | `gwpLehrwerte.ts`, `Materialdatenbanken.tsx`, `oekobaudatLehrwerteA2.ts`, `interactivelcacalc/daten.ts`, `InteractiveLCACalc.tsx`, `lca.ts`, `materialoptimierung.ts`, `rechnerGrenzen.ts` |
| F-3 | Erkundung LCA-Rechner nachgerechnet | Kennwert A1–A3 + C + A4: 2,54 → 2,42 kg/(m²a), mit Güterzug 2,38 → 2,26; NRF 70 m²: 5,08 → 4,84; A1–A3 rund 15 → 14 t. Ziegel durch KVH: A1–A3 −19 → −20 t; Kennwert A–C 3,89 → 3,77 bzw. 3,39 → 3,27; mit Modul D 1,64 → 1,79 (der alte Wert passte schon vorher nicht zum Kern, dort 1,74). | Rechenkern `lcaBilanz` | `erkundung.ts` |
| F-4 | Gemeinsame Lehrwerttabelle | `src/data/gwpLehrwerte.ts`: C25/30 CEM I 245; C25/30 CEM II/C-M 155; CEM III/A 135; C30/37 CEM III 145; C30/37 CEM I 243 (320 · 0,665 + 30); RC-C25/30 195; Geopolymer 85 kg/m³; BSH −650 (biogen −760); KVH −740 (biogen −820); Betonstahl 640 kg/t. Importiert von LCA-Rechner, Materialdatenbanken (Konsole und QNG-Tabelle), LCA-Grundlagen (EPD-Musterdatenbank), Nachhaltigkeit (Wandkonfigurator je kg), DPP/EPD (Muster-EPD), BIM-Baustoffe und Materialoptimierung. | Lehrwerte (vorläufig, Normprüfung ausstehend); biogen KVH nach DIN EN 16449 | siehe Ergebnis |
| F-4 | Abweichungen vorher → nachher | Konsole BSH −482 → −650. QNG-Tabelle C25/30 235 → 245; KVH −620 (biogen −780) → −740 (−820); BSH −580 → −650. LCA-Rechner RC-Beton 145 → 195. BIM „Normalbeton C30/37“ 245 → 243, BSH −480 → −650 (Regler −900 … −300). Muster-EPD BSH (DPP/EPD) A1–A3 −750 → −650, C3 820 → 770 (Abgabe des biogenen Kohlenstoffs + 10). Wandkonfigurator: Zahlen gleich (0,102 → 0,1021 kg/kg; Aufbau „Stahlbeton + EPS“ weiterhin 64,8 kg/m², Quizfrage `qn_lca_rechner_2` unverändert); Text KVH −1,47 → biogen −1,64, netto −1,48 kg/kg. Erkundung `oekobilanz_lca` (BSH −6500 kg) unverändert. | – | `Materialdatenbanken.tsx`, `nachhaltigkeit/daten.ts`, `BimBaustoffe.*`, `DppEpd.*`, `Wandkonfigurator.tsx` |
| F-4 | Bewusst nicht aus der Tabelle | Routenwerte Stahl: QNG-Tabelle Bewehrungsstahl sekundär 450 / primär 1850 kg/t, EPD-Musterdatenbank Baustahl Elektroofen 480 / Hochofen 1850, Muster-EPD Betonstahl 100 % Recycling 450, Materialoptimierung Hochofen 0,98 und grüner Elektrostahl 0,42 kg/kg (Bezugsgröße: eine Herstellungsroute, nicht der deutsche Mittelwert). Materialoptimierung rechnet Beton als 320 kg Zement · GWP + 30 (Formel, C30/37). BIM-Beispiel Stahlbetonwand 280 kg/m³ (Stahlbeton mit Bewehrung, entspricht 245 + rund 55 kg Betonstahl · 0,64). BIM „Baustahl S355“ 5000 kg/m³ (= 0,64 kg/kg, T14-BIM-1), siehe Rest-Frage. DPP-Bauteilpass (BSH-Träger −620 kg je Bauteil). | – | – |
| F-5 | Zeile WDVS teilen | Lebensdauern: „Fassade (Außenputz)“ 20–40, Mittel 30 a (Lehrwert, vorläufig); „Fassade (WDVS; BNB 2017: 40 a)“ 30–50, Mittel 40 a. Der Austauschrechner liest die Mittelwerte; das Diagramm zeigt die ersten 16 Zeilen. LCC-Szenario Dämmsystem: Beschreibung nennt 30/60 a als Szenariowerte und BNB 40 a (wie beim Fensterszenario); Rechnung unverändert. | BNB 2017, 335.641 (wie `BNB_NUTZUNGSDAUER['eps-daemmung']`) | `Lebensdauern.tsx`, `Lebensdauern.json`, `LCC.json` |
| F-6 | Nur Kennzeichnung | `q_is_cl_4` (Quelle) und WU-Bauwerke (Quellenliste): „(Ausgabe vorläufig, Normprüfung ausstehend)“. Fachgebiet: in `scripts/auditDaten.ts` bei Beton & Stahlbeton „DIN EN 1504“ als Alternative angehängt. | Normtext | `quiz.json`, `WUBauwerke.json`, `auditDaten.ts` |
| F-7 | Belassen | nichts geändert | – | – |
| F-8 | Zement-GWP 0,665 | `qn_biokohlebeton_3`: 2,0 / 0,665 ≈ 3,0 kg; Distraktoren 1,3 kg (2,0 · 0,665), 2,0 kg (gleiche Masse), 0,33 kg (Kehrwert 0,665/2,0; ersetzt die doppelte 1,3 kg aus 2,0 − 0,665). | `ZEMENT_GWP_KG['CEM I']` (`src/data/zementGwp.ts`, VDZ-Branchen-EPD) | `quiz.json` |

**Quiz:** `qn_bauphysik_1`, `qn_rechnung_u_wert_2`, `qn_holz_1`, `q_hw_4`, `qn_biokohlebeton_3` → `verified` false, Freigabevermerk entfernt, `vorpruefung.hinweis` „Konsistenz 29.10.: … – korrigiert“; Prüflisten neu erzeugt. `q_is_cl_4`: nur die Quellenangabe gekennzeichnet, Frage unverändert (Freigabe bleibt).

**Rest-Frage:** Der BIM-Archetyp „Baustahl S355“ nutzt 0,64 kg/kg (Betonstahl, T14-BIM-1), der LCA-Rechner für Profilstahl 1,1 kg/kg. Soll der BIM-Wert auf Profilstahl (1100 · 7,85 ≈ 8600 kg/m³) umgestellt oder der Profilstahl-Lehrwert mit einer Baustahl-EPD belegt werden?
