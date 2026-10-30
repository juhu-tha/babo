# Gezielte Durchsicht Tranche B (29.10.2026)

Nachhaltigkeit, Rückbau & Schadstoffe, Digitales, KI im Bauwesen, Beispielrechnungen, Praxiswissen, Bauphysik – 27 freigegebene Module (Aufteilung nach `docs/pruefung/nachpruefung2-2026-10-29.md`, Abschnitt „Vorschlag“). Entscheidung 29.10.2026: Durchsicht nur auf

- **(a)** Bezugsgrößen und Einstufungen in Beispielen (Würfel/Zylinder, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t, Klasse aus dem richtigen Wert),
- **(b)** Norm-, Teil-, Tabellen-, Abschnitts- und Ausgabenzuordnungen (gegen `src/data/centralNormenRegistry.ts`, Ausgaben Stand 10/2026),
- **(c)** mehrfach vorkommende Kennwerte gegen die zentralen Konstanten (`zementGwp.ts`, `gwpLehrwerte.ts`, `A4_FAKTOR_*` in `src/calc/lca.ts`, `din1045_2.ts`, `K_WERT_DIN1045_2`).

Grundlage je Modul: Ergänzungsbogen `docs/pruefung/kennwert-abgleich/<bericht>.md` (Funde = Prüfaufträge) und eigene Durchsicht aller Beispiele und Tabellen der Inhaltsdateien. Alle Beispielrechnungen wurden mit eigenen Python-Skripten nachgerechnet; das Excel-Arbeitsblatt der Transportbeton-Übung zusätzlich mit LibreOffice neu berechnet. Regressionstest: `tests/durchsichtB.test.ts` (eigene Formelauswertung des Arbeitsblatts, Kennwerte gegen zentrale Konstanten, Nachrechnungen). Prüfvermerke (`src/data/pruefvermerke.ts`) unverändert.

Schwerpunkt war die gemeinsame **LCA-Komponente** `OekobilanzLCA` (Bericht `lca_ingenieurbau.md`, Modul-IDs `oekobilanz_lca`, `lca_rechner`, `lca_ingenieurbau`, `lca_regulatorik`). Befunde in den Reitern von `oekobilanz_lca` und `lca_rechner` (beide aus den Stichproben) sind unter der Kennung DSB-LC geführt.

## Übersicht

| Modul | (a) | (b) | (c) | Befund | Kennungen |
|---|---|---|---|---|---|
| LCA-Komponente (Reiter Rechner/Grundlagen) | geprüft | geprüft | geprüft | **behoben** (1 gewichtig), Fragen | DSB-LC-1 bis -12 |
| `lca_ingenieurbau` | geprüft | geprüft | geprüft | Kennzeichnung, Frage | DSB-LI-1, -2 |
| `lca_regulatorik` | geprüft | geprüft | geprüft | **behoben**, Frage | DSB-LR-1 bis -3 |
| `kreislauf_dpp` | geprüft | geprüft | geprüft | Quellkommentar | DSB-KD-1 |
| `lebenszyklus_kosten` | geprüft | geprüft | geprüft | ohne Befund | – |
| `nachhaltigkeit_daten_regeln` | geprüft | geprüft | geprüft | Kennzeichnung, Frage | DSB-NR-1, -2 |
| `ressourcen_umwelt` | geprüft | geprüft | geprüft | Frage (zentral) | DSB-RU-1 |
| `abfaelle` | geprüft | geprüft | geprüft | **behoben** | DSB-AB-1 |
| `altholz_urban_mining` | geprüft | geprüft | geprüft | ohne Befund | – |
| `boden_materialaufbereitung` | geprüft | geprüft | geprüft | **behoben** (gewichtig), Kennzeichnung | DSB-BM-1, -2 |
| `pfas_baustoffe` | geprüft | geprüft | geprüft | ohne Befund | – |
| `rueckbau` | geprüft | geprüft | geprüft | **behoben** | DSB-RB-1 |
| `schadstoffe` | geprüft | geprüft | geprüft | Hinweis | DSB-SS-1 |
| `bim_baustoffe` | geprüft | geprüft | geprüft | **behoben** | DSB-BIM-1 |
| `dpp` | geprüft | geprüft | geprüft | **behoben**, Hinweis | DSB-DPP-1, -2 |
| `materialdatenbanken` | geprüft | geprüft | geprüft | **behoben** (Format), Hinweis | DSB-MDB-1, -2 |
| `materialpaesse` | geprüft | geprüft | geprüft | ohne Befund | – |
| `ki_lokal` | geprüft | geprüft | geprüft | ohne Befund | – |
| `ki_ressourcen` | geprüft | geprüft | geprüft | ohne Befund | – |
| `ki_system` | geprüft | geprüft | geprüft | ohne Befund | – |
| `ki_uebungen` | geprüft | geprüft | geprüft | ohne Befund | – |
| `rechnung_holzbau` | geprüft | geprüft | geprüft | ohne Befund | – |
| `rechnung_nachhaltigkeit` | geprüft | geprüft | geprüft | **behoben** | DSB-RN-1 |
| `rechnung_stahlbeton` | geprüft | geprüft | geprüft | ohne Befund | – |
| `rechnung_u_wert` | geprüft | geprüft | geprüft | **behoben** | DSB-UW-1 |
| `px_bauleitung` | geprüft | geprüft | geprüft | **behoben** | DSB-PB-1 |
| `px_planung` | geprüft | geprüft | geprüft | **behoben** | DSB-PP-1 |
| `daemmung_vergleich` | geprüft | geprüft | geprüft | ohne Befund | – |

Ergebnis: Module mit Befund (Fehler behoben oder offene Frage) **16 von 27** zuzüglich der LCA-Reiter aus den Stichproben; ohne Befund 11. Wie in den Nachstichproben lag kein Befund in einem Rechenkern (`src/calc/`); betroffen sind Arbeitsblatt, Fließtext, Katalogkarten und Voreinstellungen.

**Gewichtige Fehler in freigegebenen Modulen** (für die Entscheidung über die Prüfvermerke; nicht geändert):
1. **DSB-LC-1 (`lca_rechner`, Excel-Download):** Im Blatt „Aufgabe_Studierende“ waren alle Zellbezüge um zwei Zeilen versetzt; die Mappe zeigte `#WERT!` statt der Ergebnisse.
2. **DSB-BM-1 (`boden_materialaufbereitung`):** Die angezeigten Rechtsgrundlagen zu Asbest stammten aus einer nicht berichtigten Kopie der Daten (die Paragrafenprüfung vom 29.10. hatte nur die ungenutzte Kopie im Modul `schadstoffe` korrigiert).
3. **DSB-BIM-1 (`bim_baustoffe`):** Baustahl S355 mit dem Betonstahl-Referenzwert 0,64 statt des zentralen Profilstahl-Lehrwerts 1,1 kg CO₂-Äq./kg (Faktor 1,7 zu niedrig).

## GWP- und Transportwerte ohne zentrale Zuordnung (Prüfskript)

Von den 93 Funden des Prüfskripts liegen 72 in dieser Tranche. Erledigung:

| Bericht | Funde | Ergebnis |
|---|---|---|
| `lca_ingenieurbau` (Komponente) | 29 | 2 = `A4_FAKTOR_GEBAEUDE` (Konstante fehlt im Prüfskript; jetzt im Test), 5 = `LEHRBETON_C3037`/`GWP_LEHRWERTE` (243, 158, 30, 0,10 kg/kg = 245/2400), 4 als Lehrwert gekennzeichnet (0,004/0,003 tkm, −150 Modul D, Lehmstein 0,022 wie Datenbank), 2 fiktiv gekennzeichnet (0,10/0,75 Übung), 1 Kommentar ohne Rechenbezug entfernt (380 g/kWh), 1 Größenordnung passend (−700 bis −800 biogen), 1 Beispielwert (195 = RC-Beton-Lehrwert), 1 Frage (0,43 kWh, DSB-LC-12), 1 Frage EPS (DSB-LC-10); 11 Quizstellen nachgerechnet, richtig (`qn_lca_rechner_1` mit älteren Faktoren als Angabe, DSB-LC-11) |
| `boden_materialaufbereitung` | 12 | CO₂-Spannen der Behandlungsoptionen als Lehrwerte gekennzeichnet (DSB-BM-2) |
| `schadstoffe` | 12 | dieselben Daten, im Modul nicht angezeigt (DSB-SS-1) |
| `materialdatenbanken` | 8 | 245 = Lehrbeton C25/30; 0,13 / 3,3 / 1,20 als Lehrwert gekennzeichnet; Quiz richtig (DSB-MDB-2) |
| `bim_baustoffe` | 6 | 1,20 · 60 = 72 wie Materialdatenbanken; 280 als EPD-Lehrwert gekennzeichnet; Quiz richtig |
| `ki_baustoffe` (`ki_ressourcen`) | 3 | 0,36 kg CO₂/kWh als Lehrwert mit UBA-Prüfhinweis gekennzeichnet; Quiz richtig |
| `ressourcen_umwelt` (Reiter NaWaRo) | 2 | GL24h 420 kg/m³ → 688 kg CO₂ nach DIN EN 16449 richtig; Abweichung zur zentralen BSH-Konstante als Frage (DSB-RU-1) |

**Transportbeton-Übung (NP2-LC-2, Entscheidung: belassen):** Der Lkw-Faktor 0,068 kg CO₂-Äq./(t·km) bleibt unverändert (`LKW_FAKTOR_UEBUNG`). Unter den Logistik-Eingaben steht jetzt ein Hinweis mit dem zentralen Vergleichswert (`A4_FAKTOR_EINZEL['lkw-heavy']` = 0,101, UBA 2024, alle Last- und Sattelzüge einschließlich Leerfahrten) und dem A2-Wert der aktuellen Eingabe mit beiden Faktoren (Standardrezeptur 4,9 bzw. 7,3 kg CO₂-Äq./m³); dasselbe in der Datenquelle der Excel-Stammdaten. Quiz `qn_lca_rechner_x_1` bleibt richtig.

## Befunde je Modul

### LCA-Komponente (`OekobilanzLCA`; Reiter von `lca_rechner` und `oekobilanz_lca`)

**Nachrechnungen:** Transportbeton-Presets A1–A5 = 239,9 / 145,3 / 100,3 kg CO₂-Äq./m³ (Web) und 239,9 / 148,8 / 100,8 (Excel Blatt 2, andere Mengen) – richtig; Blatt 3 nach Korrektur 247,9 / 139,6 kg/m³, Minderung 43,7 %, Ersparnis 92,1 t; Bezugseinheit 52,0 + 30,8 = 82,8 kg/m² bzw. 1,66 kg/(m²·a); QNG-Praxisbeispiel 11,75 + 3,00 + 7,74; Deckenübung 55,0 + 16,5 = 71,5 kg/m²; Zementanteil 320 · 0,665 + 30 = 243 bzw. 320 · 0,40 + 30 = 158.

- **behoben – DSB-LC-1 (gewichtig; (a)):** `content/lca/TransportbetonExcelExport.json`, Blatt 3: alle 26 Formeln um zwei Zeilen versetzt (z. B. `C17*D17` in Zeile 19) → Bezüge berichtigt; Zellangaben der Selbstkontrolle (G31 → G33, F19 → F19 bis F21, F25 → F27) nachgezogen. Nachgerechnet mit LibreOffice und im Test.
- **behoben – DSB-LC-2 ((a)/(b)):** Fallstudie XC4/XD1/XF1: Anforderungen „Zement ≥ 280 kg/m³ (bei CEM II/A-LL oder CEM III/A)“ und „(w/z)_eq ≤ 0,50“ passten zu keiner der Klassen. Maßgebend XD1 nach DIN 1045-2:2023-08 (`src/data/standards/din1045_2.ts`): w/z ≤ 0,55, Zement ≥ 300 kg/m³; mit Anrechnung von Flugasche 270 kg/m³ (vorläufig, Normprüfung ausstehend). Der Musterentwurf erfüllt beides ((w/z)_eq = 0,51). Ergebniszeile als „A1, A3–A5; A2 hier nicht erfasst“ bezeichnet (Blatt 3 enthält keine A2-Zeilen).
- **behoben – DSB-LC-3 ((c)):** Lkw-Faktor ausgewiesen (s. o.); Bahn 0,018 → `A4_FAKTOR_EINZEL.zug` = 0,014 (UBA 2024) in `transportbetonKennwerte.ts` und Stammdaten; Binnenschiff, Fahrmischer, Pumpe und Mischwerk als Lehrwerte; „Amtliche ÖKOBAUDAT-Emissionsfaktoren“ → „Lehr-Emissionsfaktoren (Größenordnung ÖKOBAUDAT/EPD)“ (Web-Text und Blatt 1/4).
- **behoben – DSB-LC-4 ((a) Würfel/Zylinder):** „Spezifisches GWP pro Festigkeitsklasse (C25/30 = 30 N/mm²)“ → „je N/mm² Würfeldruckfestigkeit (C25/30: f_ck,cube = 30 N/mm²)“.
- **behoben – DSB-LC-5:** Preset 2 „Reduziert A1 um ~45 %“ – nachgerechnet A1 −42,5 % (nur Zement −45,5 %) → „Senkt A1 um rund 43 % (Zementanteil um rund 45 %)“.
- **behoben – DSB-LC-6:** QNG-Praxisbeispiel 22,50 → 22,49 kg CO₂-Äq./(m²·a) (Summe 11,75 + 3,00 + 7,74).
- **behoben – DSB-LC-7 ((a) Einstufung):** Deckenübung und deklarierte Einheit: „Baustahl B500B“/„100 kg Baustahl pro m³“ → Betonstahl; „normativ festgelegter Bewehrungsgehalt“ → „angenommener“.
- **erledigt – DSB-LC-8 (fest verdrahtete Faktoren):** k-Wert Flugasche 0,4 aus `K_WERT_DIN1045_2.kF` importiert; Szenariofaktoren der Kreislauf-Voreinstellungen (0,4/1,15/1,3) und Tutor-Schwelle 30 % als Darstellungsgrößen kommentiert; QNG-Schnellrechner und CRREM-Stützwerte mit Lehrwert-Kommentar (`Nachhaltigkeit.tsx`).
- **offen – Frage DSB-LC-9:** Die Web-Übung bewertet (w/z)_eq mit „normkonform ≤ 0,50“, ohne Expositionsklasse. **Vorschlag:** Grenze an die Fallstudie koppeln (XD1: 0,55) oder Klasse auswählbar machen (XC4/XF1: 0,60).
- **offen – Frage DSB-LC-10 ((c)):** EPS-Lehrwerte A1–A3 uneinheitlich: 3,0 (Bezugseinheit), 3,25 (Wandkonfigurator), 3,3 kg CO₂-Äq./kg (Materialdatenbanken); Mineralwolle 0,96 (Wandkonfigurator, Glaswolle) bzw. 1,20 (Materialdatenbanken, BIM). **Vorschlag:** EPS und Mineralwolle in `gwpLehrwerte.ts` aufnehmen (EPS 3,25; Glas-/Steinwolle getrennt) und Beispiele daraus rechnen.
- **Hinweis DSB-LC-11:** `qn_lca_rechner_1` gibt die früheren Gebäuderechner-Faktoren Lkw 0,15 und (Distraktor) Bahn 0,03 vor; die Frage ist in sich richtig (Werte stehen in der Aufgabe), der Rechner nutzt jetzt 0,118/0,014. Bei der nächsten Quizrunde angleichen.
- **offen – Frage DSB-LC-12:** QNG-Praxisbeispiel: „Emissionsfaktor Strommix (50 a gewichtet sinkend): 0,43 kg CO₂-Äq./kWh“ – ein über 50 Jahre sinkender Faktor läge unter dem heutigen (Lehrwert KI-Modul 0,36). **Vorschlag:** als konstanten Bilanzfaktor nach QNG-Rechenregel (ÖKOBAUDAT-Datensatz Strom) bezeichnen und den Wert am Datensatz prüfen (Normtext).
- (b) geprüft: EN 15804 „2012+A2:2019“ als Klammerzusatz zu DIN EN 15804:2022-03 richtig; „DIN EN 15978:2011, Abschn. 3.14“ in den Quellen der Bezugseinheit zitiert die Definition der Vorgängerausgabe (Registry 2026-09) – Abschnittsnummer in der Ausgabe 2026 am Normtext prüfen (Normtext); EN 17472:2022 im Weblink ist die europäische Fassung von DIN EN 17472:2024-06 – richtig.

### `lca_ingenieurbau`

**Nachrechnungen:** Simulator 1500 m², 100 a, DTV-SV 4500: Spannbeton 863,4 t, Stahlverbund 825,2 t (A–C) wie im Quiz; B8 = 108 d · 1800 · 0,95 = 184,7 t; Praxisfaktum 5000 · 0,4 · 0,95 · 30 = 57 t.
- **erledigt – DSB-LI-1 (fest verdrahtete Faktoren, 18 Literale):** Kennwerte je m² Deckfläche, Intervalle und Sperrtage in einer benannten Konstante `BRUECKE_LEHRWERTE` mit Quellkommentar zusammengefasst (Werte unverändert); im Simulator sichtbar als „gerundete Lehrwerte ohne Projekt- oder Datenbankbezug“ gekennzeichnet.
- **offen – Frage DSB-LI-2 ((c)):** Der Simulator zählt Austauschzyklen als ⌊T/ND⌋ (Korrosionsschutz bei 100 a: 4), die Gebäuderechner nach `ersatzzyklen` als ⌈T/ND⌉ − 1 (3; Erneuerung im Jahr 100 entfällt). **Vorschlag:** belassen (Quiz `qn_lca_ingenieurbau_*` rechnet damit), im Simulator die Zählweise nennen.
- (b) DIN EN 17472:2024-06, DIN EN 1990 Kat. 5, ISO 15686-5 richtig zugeordnet.

### `lca_regulatorik`

**Nachrechnungen:** CRREM-Simulator Büro 2026 = 34,0 kg/(m²a); Holzbau-Leuchtturm 300 statt 700 kg/m² = −57 %; CBAM-Quiz 1000 · 0,8 · 60 = 48 000 €.
- **behoben – DSB-LR-1 ((b)):** Lehmbaunormen „DIN 18945/18946/18947/18948:2018-12“ → 2024-03 (18945 mit A1:2026-06), Titel wie in den Modulen Lehm und Lehmbauprodukte; Aussage „SFK 3 (f_St ≥ 3,5 N/mm²) mindestens erforderlich“ als vorläufig gekennzeichnet (das Modul Lehm nennt die Klassen als mittlere Steindruckfestigkeit; Normtext).
- **offen – Frage DSB-LR-2 ((c)):** „1800 m³ Holz binden dauerhaft ca. 1800 t CO₂“ (= 1 t/m³). Nach DIN EN 16449 und den zentralen Lehrwerten (BSH −760, KVH −820 kg/m³) rund 1400 bis 1500 t, und der Speicher ist temporär (Modul C3). **Vorschlag:** „rund 1500 t CO₂ (biogener Kohlenstoff nach DIN EN 16449, temporär gespeichert)“, sofern die Projektangabe nicht ausdrücklich zitiert werden soll.
- **erledigt – DSB-LR-3:** CRREM-Stützwerte als Lehrwerte kommentiert (Code).

### `kreislauf_dpp`

**Nachrechnungen:** MCI = 1 − 0,40 · 0,45 = 0,82 (X = 1: 0,64); Verwertungsquote 1070/1200 = 89 % ≥ 70 % (§ 14 KrWG).
- **erledigt – DSB-KD-1:** F(X) = 0,9/X mit Quelle (Ellen MacArthur Foundation) kommentiert; vermiedene Emissionen je kg (Metall 4,3, Technik 3,5, Holz 1,45, mineralisch 0,15) und Erlöse des Rückbau-Audits als Lehrwerte kommentiert. Hinweis: „Metall“ mischt Aluminium und Stahl; der zentrale Profilstahl-Lehrwert ist 1,1 kg/kg.

### `lebenszyklus_kosten`
Barwert 2000 · 22,40 = 44 800 € (genau 44 793 €), Fenster 20 000/1,03³⁰ = 8240 € – richtig. DIN EN 16627:2015-09, ISO 15686-5:2017, DIN EN 15643:2021-12 richtig. Ohne Befund.

### `nachhaltigkeit_daten_regeln`
**Nachrechnungen:** EU-Taxonomie 0,9 · 40 = 36 kWh/(m²a); CRREM 52 − 3,4 · 6 = 31,6, Schnittpunkt 2029,4.
- **erledigt – DSB-NR-1:** Stoffstrom-Rechner (65/25/10 %, 0,045 t CO₂ je t) als Szenario mit Lehrwerten gekennzeichnet, Quellkommentar im Code.
- **offen – Frage DSB-NR-2 ((c)):** 45 kg CO₂-Äq. je t „vermiedene Transporte/Abbau“ liegt um den Faktor 7 über Primärkies A1–A3 (3,5 kg/t, Transportbeton-Übung) zuzüglich 25 km Lkw (0,101 · 25 ≈ 2,5 kg/t). **Vorschlag:** rund 6 kg/t ansetzen oder die Herleitung angeben.
- (b) EN 15804/15978-Ausgaben richtig (Hinweise des Skripts sind Klammerzusätze).

### `ressourcen_umwelt`
KVH 500/1,12 · 0,5 · 44/12 = 818 kg; PENRT 1100 MJ = 306 kWh; NaWaRo-Reiter GL24h 420 kg/m³ → 688 kg – richtig.
- **offen – Frage DSB-RU-1 ((c), zentrale Konstante):** `GWP_LEHRWERTE.bsh` hat biogen −760 bei Rohdichte 480 kg/m³; nach DIN EN 16449 ergäben 480 kg/m³ −786, der NaWaRo-Reiter (Tranche D) rechnet GL24h mit 420 kg/m³ (−688). **Vorschlag:** BSH-Lehrwert aus DIN EN 16449 mit einer festgelegten Rohdichte bilden (wie KVH) und den Reiter darauf beziehen.

### `abfaelle`
DepV-Beispiel (DK 0 nicht, DK I eingehalten), EBV-Anzeigepflicht 1200 · 0,25 = 300 m³ ≥ 250 m³ – richtig.
- **behoben – DSB-AB-1 ((b)):** „DIN EN 206 / DIN 1045-2 / DAfStb-Richtlinie“ → „DIN 1045-2:2023-08, Anhang E; ersetzt die DAfStb-Richtlinie“.

### `altholz_urban_mining`
0,98 · 54,75 + 2,25 + 0,125 = 56,03 t, Anteil A IV 2,15 % → 0,22 %; 2160 · 0,6 · 0,9 = 1166 t – richtig. Ohne Befund.

### `boden_materialaufbereitung`
- **behoben – DSB-BM-1 (gewichtig; (b)):** Die Behandlungsoptionen liegen doppelt vor (`content/bodenmaterialaufbereitung/…` angezeigt, `content/schadstoffe/…` ungenutzt). Die Paragrafenprüfung vom 29.10. hatte nur die ungenutzte Kopie berichtigt; angezeigt wurde weiter „TRGS 519 / DepV: … ausnahmslos ILLEGAL … in ganz Europa“. Vier Texte angeglichen (GefStoffV § 11a und Anhang II Nr. 1, REACH Anhang XVII Nr. 6; ChemG/§ 326 StGB); Test sichert die Gleichheit beider Kopien.
- **erledigt – DSB-BM-2:** CO₂- und Kostenspannen je t als Lehrwerte gekennzeichnet.

### `pfas_baustoffe`
Mischung 28/6 ng/l → ≥ 36 % Brunnen 2; Normen DIN 38407-42:2011-03, DIN 38414-14:2011-08, DIN EN ISO 18127:2026-07, DIN 19529:2015-12 – richtig. Ohne Befund.

### `rueckbau`
3430 t, Quote 3360/3430 = 98 %, Mehrkosten 3360 · 23 − 40 000 = 37 280 € – richtig.
- **behoben – DSB-RB-1 ((b)):** „DAfStb-Richtlinie / DIN 1045-2“ → „DIN 1045-2:2023-08, Anhang E; ersetzt die DAfStb-Richtlinie“ (RC-Anteile 45/35 Vol.-% wie `rcGesteinskoernung.ts`).

### `schadstoffe`
KI-Index 31,8 − 2 · 2,0 = 27,8 ≤ 30 (Kat. 1B); TRGS 402: 14,5/8 = 1,81 mg/m³, I = 1,45; EBV-Leitparameter RC-1/RC-2, BM-0* – richtig.
- **Hinweis DSB-SS-1:** `TREATMENT_OPTIONS` in `Schadstoffe.tsx` wird nicht angezeigt (Doppel zu `boden_materialaufbereitung`). **Vorschlag:** Kopie entfernen; bis dahin prüft `tests/durchsichtB.test.ts` die Gleichheit.

### `bim_baustoffe`
GWP Wand 8,64 · 280 = 2419 kg; U = 1/4,85 = 0,21 W/(m²K); Quiz 1232 kg und 134 kg (5,9 %) – richtig.
- **behoben – DSB-BIM-1 (gewichtig; (c)):** Baustahl S355 5000 kg CO₂-Äq./m³ (0,64 kg/kg, Betonstahl-Referenz aus T14-BIM-1) → aus `GWP_LEHRWERTE.profilstahl` (1,1 kg/kg, Entscheidung NP2-ST-2) · 7850 kg/m³ = 8635 kg CO₂-Äq./m³; Reglerschritt 5. Test T14 (BIM3) auf 1,1 kg/kg fortgeschrieben.

### `dpp`
EPD-Beispiel 250 + 5 + 2 = 257 kg, D getrennt; PENRT 2000 MJ – richtig.
- **behoben – DSB-DPP-1 ((c)):** Muster-DPP „BSH-Träger 0,8 m³: −620 kg CO₂-Äqv.“ (= −775 kg/m³) widersprach der Muster-EPD im selben Modul (−650 kg/m³) → −520 kg aus `GWP_LEHRWERTE.bsh`.
- **Hinweis DSB-DPP-2:** Stütze C35/45 (1,2 m³ + 180 kg Betonstahl) 385 kg ohne Herleitung; kein zentraler C35/45-Lehrwert.

### `materialdatenbanken`
KS 0,175 · 1800 · 0,13 = 40,95 kg/m²; EPS 9,24; Mineralwolle 5,76 kg/m² – richtig. Konsole: Beton, BSH, Betonstahl aus `GWP_LEHRWERTE`; Muster-Zement 680 kg/t als herstellerspezifische Muster-EPD bewusst über dem Branchenwert 665 (T14-MDB-5) – begründet abweichend.
- **behoben – DSB-MDB-1:** „Rohdichte 1.8“ → „Rohdichteklasse 1,8“.
- **Hinweis DSB-MDB-2:** Beispiel KS 0,13 kg/kg, Quiz `q_dg_db_6` 0,12 kg/kg (beide Lehrwert, Quiz in sich richtig).

### `materialpaesse`
R_rec = 292/327 = 89,3 %, MCI = 0,55 – richtig; ISO 20887:2020. Ohne Befund.

### `ki_lokal`, `ki_ressourcen`, `ki_system`, `ki_uebungen`
Kosinus 0,96/0,36; Sigmoid 0,70; 14 · 10⁹ · 4,85/8 = 8,5 GB; 70 · 10⁹ → 42/140 GB; u = 0,057; 0,175 kWh · 0,36 = 0,063 kg CO₂ – richtig. „DIN 1045-2:2008-08“ in `ki_uebungen` ist der absichtlich eingebaute Fehler der Übung (Lösung nennt 2023-08). Ohne Befund.

### `rechnung_holzbau`, `rechnung_stahlbeton`
k_mod 0,9 (KLED kurz, DIN EN 1995-1-1 Tab. 3.1), β_c = 0,2; γ_C 1,5, α_cc 0,85, ξ_lim 0,45 (NA DE), A_s,min nach NA 9.2.1.1 – richtig. „Tab. 3.1“ unter EN 1995-1-1 (k_mod) und EN 1995-1-2 (Abbrandraten) sind verschiedene Tabellen, kein Fehler. Ohne Befund.

### `rechnung_nachhaltigkeit`
CO₂-Aufnahme 4 · √50 mm · 300 · 0,65 · 0,6 · 44,01/56,08 = 2,60 kg/m²; Zementvergleich 101,7 − 41,0 = 60,8 t – richtig.
- **behoben – DSB-RN-1 ((a) Bezugsgröße):** Erläuterung „Anteil reaktives Calciumoxid im Zementstein (ca. 65 %)“ widersprach Regler („CaO-Anteil im Zement“) und Rechnung (Zementgehalt · Anteil) → „Masseanteil CaO bezogen auf den Zement …“.

### `rechnung_u_wert`
U bei 14 cm EPS 0,234 ≤ 0,24, bei 13 cm 0,250 – „mindestens 14 cm“ richtig.
- **behoben – DSB-UW-1 ((b)):** DIN 4108-2:2013-02, Tab. 3 um „Neuausgabe 2026-05 manuell abgleichen“ ergänzt (Entscheidung 28.10.: bei 2013-02 bleiben, Hinweis auf 2026-05).

### `px_planung`, `px_bauleitung`
c_nom = 25 + 15 = 40 mm; d_erf = 4,57 · 0,040 = 0,183 m; w/z 165/300 → 175/300 = 0,58; l_b,rqd = 483 mm, l₀ = 677 mm – richtig.
- **behoben – DSB-PP-1 ((b)):** XC2/XF1-Hinweis „nach DIN 1045-2:2008 … Werte der Ausgabe 2023-08 prüfen“ → DIN 1045-2:2023-08 (C16/20, w/z ≤ 0,75 bzw. C25/30, 0,60 wie `din1045_2.ts`).
- **behoben – DSB-PB-1 ((b)):** Beispiel Wasserzugabe „XC4 nach DIN 1045-2:2008: 0,60“ → 2023-08 (Wert unverändert).

### `daemmung_vergleich`
R_T = 0,71 / 2,21 m²K/W, θ_si 15,4 / 18,5 °C, Grenzschicht 1,5 bzw. 12,4 °C; p = 1169 Pa, θ_si,min = 12,6 °C, f_Rsi = 0,70; Taupunkt 9,3 °C – richtig; DIN 4108-2:2013-02 mit Hinweis auf 2026-05 bereits vorhanden. Ohne Befund.

## Fragen mit Vorschlag

| Kennung | Modul | Frage | Vorschlag |
|---|---|---|---|
| DSB-LC-9 | `lca_rechner` | w/z-Grenze 0,50 der Web-Übung ohne Expositionsklasse | an Fallstudie XD1 (0,55) koppeln |
| DSB-LC-10 | modulübergreifend | EPS 3,0/3,25/3,3 und Mineralwolle 0,96/1,20 kg/kg | zentral in `gwpLehrwerte.ts` (EPS 3,25) |
| DSB-LC-12 | `lca_rechner` | Strommix 0,43 „50 a gewichtet sinkend“ | als QNG-Bilanzfaktor bezeichnen, Wert prüfen (Normtext) |
| DSB-LI-2 | `lca_ingenieurbau` | Zyklen ⌊T/ND⌋ statt ⌈T/ND⌉ − 1 | belassen, Zählweise nennen |
| DSB-LR-2 | `lca_regulatorik` | 1800 m³ Holz „dauerhaft“ 1800 t CO₂ | rund 1500 t, temporär |
| DSB-NR-2 | `nachhaltigkeit_daten_regeln` | 45 kg CO₂/t vermiedene Transporte/Abbau | rund 6 kg/t oder Herleitung |
| DSB-RU-1 | zentral (`gwpLehrwerte.ts`) | BSH biogen −760 bei 480 kg/m³ (EN 16449: −786) | aus EN 16449 und festgelegter Rohdichte bilden |
| DSB-SS-1 | `schadstoffe` | ungenutzte Doppelkopie der Behandlungsoptionen | entfernen |

## Umsetzung 30.10.2026

Entscheidung 30.10.2026: alle Vorschläge übernommen. Regressionstest `tests/umsetzungDurchsicht_20261030.test.ts`; nachgezogen `tests/lca.test.ts`, `tests/konsistenz1029.test.ts`, `tests/materialoptimierung.test.ts`, `tests/modulpruefungTranche2.test.ts`, `-11`, `-14`, `tests/umsetzungNachpruefung2_20261029.test.ts`, `tests/durchsichtB.test.ts`, `tests/durchsichtC.test.ts`.

| Kennung | Ergebnis | Quelle |
|---|---|---|
| DSB-LC-9 | Web-Übung bewertet (w/z)_eq gegen die Fallstudie XC4/XD1/XF1: maßgebend XD1, ≤ 0,55 (`getMassgebendeAnforderung`, vorher fest 0,50) | DIN 1045-2:2023-08 (`din1045_2.ts`) |
| DSB-LC-10 | EPS 3,25 und Mineralwolle 1,20 kg CO₂-Äq./kg zentral (`GWP_LEHRWERTE.eps`/`.mineralwolle`, `daemmstoffGwpJeM3`); Rohdichte je Produkt. Folgewerte: Wandkonfigurator Glaswolle 0,96 → 1,20; LCA-Rechner EPS 78 → 65 kg/m³ (Erkundung 2,42/2,26/4,84 → 2,40/2,24/4,80; 3,77/3,27/1,79 → 3,73/3,22/1,75); EPD-Musterdatenbank Glaswolle 48 → 60 kg/m³; Bezugseinheit EPS 3,0 → 3,25 (82,8 → 84,2 kg/m², 1,66 → 1,68 kg/(m²·a)); Materialdatenbanken EPS 3,3 → 3,25 (9,24 → 9,10; Summe 50,2 → 50,1), QNG-Tabelle Mineralwolle 45 → 46, EPS 95 → 65 kg/m³, Konsole Steinwolle 45,5 → 45,6 kg/m³; BIM 72 (aus Konstante) | ÖKOBAUDAT/EPD-Größenordnung (Steinwolle 115 kg je 99 kg = 1,16), Lehrwerte |
| DSB-LI-2 | Zählweise ⌊T/ND⌋ belassen und im Simulatortext benannt (Vergleich ⌈T/ND⌉ − 1 der Gebäuderechner) | – |
| DSB-LR-2 | „1800 m³ Holz speichern rund 1500 t CO₂ (DIN EN 16449, 500 kg/m³, u = 12 %; temporär, Freisetzung in C3)“ – Wert im Modul aus `biogenesCo2DinEn16449` gerechnet (1473 t, auf 100 t gerundet) | DIN EN 16449 |
| DSB-NR-2 | Stoffstrom-Rechner: 45 kg/t → 3,5 kg/t Primärkies A1–A3 (`LCA_BENCHMARKS.gwp_aggregate_natural`) + 0,101 kg/(t·km) · 25 km Lkw (`A4_FAKTOR_EINZEL['lkw-heavy']`) = 6,0 kg/t; Herleitung sichtbar unter dem Ergebnis | UBA 2024 (A4), Lehrwert Primärkies |
| DSB-RU-1 | BSH biogen aus DIN EN 16449 mit festgelegter Rohdichte 480 kg/m³ (`BSH_LEHR_ROHDICHTE`): 785,7 → −790 (vorher −760), GWP-total −680 (vorher −650); KVH mit derselben Formel −820 (unverändert). Folgewerte: DPP-Muster 0,8 m³ · −680 = −544 kg (vorher −520; begründet über den zentralen Lehrwert), Muster-EPD A1–A3 −680, C3 800 (= 790 + 10); EPD-Musterdatenbank, Konsole, Wandkonfigurator, BIM aus der Konstante | DIN EN 16449 |
| DSB-SS-1 | Ungenutzte Kopie `TREATMENT_OPTIONS` in `content/schadstoffe/Schadstoffe.json` und `Schadstoffe.tsx` entfernt; Test prüft, dass nur `boden_materialaufbereitung` die Daten hält | – |
| DSB-LC-12 (Normtext) | Strommix 0,43 „50 a gewichtet sinkend“ als „vorläufig, Normprüfung ausstehend“ gekennzeichnet (Abgleich ÖKOBAUDAT-Datensatz Strom nach QNG-Rechenregel offen) | – |
| Lehrbeton-Rest (NP2-LC-1, #278) | Ein Restanteil `LEHRBETON_REST` = 45 kg CO₂-Äq./m³ für C25/30 und C30/37, Zementanteil aus `ZEMENT_GWP_KG`. C30/37: CEM I 243 → 258, CEM III/A 158 → 173 (Minderung 35 → 33 %); Materialoptimierung je Zementart 258/237/215/173/173, Beispiel Decke 61,4/35,2 → 64,4/37,5 kg/m² (43 → 42 %), Erkundung (53/34 → 52/34 %, 39/54 → 41/56 kg/m², 22/12/53 → 23/13/52 %, 72 → 71 %); Quiz `q_mo_1`, `qn_materialoptimierung_3` (144 → 157 kg/m³, Summe 3845 → 4099), `qn_oekobilanz_lca_g1` (Rest 30 → 45, 35 → 33 %) korrigiert | ÖKOBAUDAT 2024-I „Transportbeton C25/30“ 221,7 ≈ 300 · 0,60 + 45 |
| Profilstahl | Lehrwert 1,1 bleibt; `PROFILSTAHL_EPD_ELEKTROSTAHL` = 0,56 mit Hinweistext „EPD Elektrostahl rund 0,56 kg CO₂e/kg als Vergleichswert“ in Stahl-Modul (CO₂-Vorteil), LCA-Rechner (Materialzeile und Beschreibung), BIM-Baustoffe (Baustahl) | EPD bauforumstahl EPD-BFS-20230271-IBG19 |
| Freigaben | `lca_rechner`, `boden_materialaufbereitung`, `bim_baustoffe`: Prüfvermerk behalten, Prüfdatum 2026-10-30 | Entscheidung 30.10.2026 |
