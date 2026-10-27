# Fehlliste: Literatur- und Normseiten, die noch gebraucht werden

Stand: 27.10.2026 · Grundlage: Prüfpunkte und Fehllisten in den PR-Texten #170 bis #185 (abgerufen mit `gh api repos/juhu-tha/babo/pulls/<n> --jq .body`), abgeglichen mit dem Code auf `main` (Stand nach #185) und den Kennzeichnungen „vorläufig, F-Freigabe“ in `src/calc/` und `src/data/rechnerGrenzen.ts`.

**Zweck:** Prof. Huber (oder die Bibliothek) beschafft nur die Seiten, die öffentlich nicht zugänglich sind und für die Freigabe wirklich gebraucht werden. Normtext wird dabei nicht ins Repository übernommen; es geht nur um den Abgleich von Werten und Formulierungen.

**Bereits erledigt und nicht mehr aufgeführt** (durch #184 mit öffentlichen Quellen korrigiert): LCC-Preissteigerung ab Jahr 2 (BNB 2.1.1), S355 f_u = 490 N/mm² (EN 1993-1-1 Tab. 3.1), E_s = 200 000 N/mm² und f_tk B500B = 540 N/mm² (EC2 3.2.7, Anhang C), Umbenennung der Reifefunktion in „Rastrup (1954)“.

**Priorität:** **A** = ein angezeigter Rechenwert oder eine Ergebnisaussage hängt davon ab (vor Freigabe des Rechners klären). **B** = Wert ist als Lehrwert gekennzeichnet, Abgleich verbessert die Belastbarkeit. **C** = Ausgabe- oder Zitierprüfung, Erweiterung oder didaktische Entscheidung.

Parallel laufende Arbeiten der Runde 5 (Beton/Stahlbeton/Prüfverfahren, Holz/Bauphysik/Geotechnik, Normwerte) können einzelne Punkte schließen. Vor der Beschaffung bitte den Stand nach deren Merge prüfen.

## A – vor Freigabe der Rechner klären

| Nr. | Werk | Abschnitt / Tabelle | Wofür (Rechner, Datei) | Herkunft |
|---|---|---|---|---|
| A1 | DIN EN 1996-3/NA (Mauerwerk, vereinfachtes Verfahren) | Knicklängenbeiwert ρ2 und seine Bedingungen (Lastausmitte, Mindestauflagertiefe); Φ1 für Endauflager (Schwelle f_k = 1,8 N/mm², Deckel 0,9·a/t, Dachdecke 0,333) und für Innenwände (0,9); Tab. NA.2 (Anwendungsgrenzen) | Tragfähigkeit Mauerwerk, `src/calc/mauerwerk.ts` | #170, Prüfpunkte 1–3 und 5 |
| A2 | DIN EN 1996-3/NA, Anhang NA.D, bzw. Zulassungen der Steine | Tabellen f_k je Steinart, Festigkeitsklasse und Mörtel; Spaltenzuordnung KS P / KS L-P | `FK_TAFEL_NA` in `src/calc/mauerwerk.ts` | #170, Prüfpunkt 4 |
| A3 | DIN 4108-3:2024-03 | Klimarandbedingungen Tau- und Verdunstungsperiode (2 160 h, 20 °C/50 %, −5 °C/80 %, 1 200 Pa); R_si = 0,25 / R_se = 0,04 m²K/W; p_sat in der Tauwasserzone 1 700 Pa (Wand) / 2 000 Pa (Dach); Rechenwert δ₀ | Glaser-Verfahren, `src/calc/glaser.ts` | #172, Prüfpunkte 1–3 |
| A4 | DIN 4108-3:2024-03, Anhang B | Beispiel 1 (Schichtaufbau und Ergebnisse M_c, M_ev); Regeln bei mehreren Tauwasserzonen | Regressionstest `tests/glaser.test.ts` | #172, Prüfpunkte 4–5 |
| A5 | QNG „Ökobilanzierung – Rechenwerte 2023“, aktuelle Version (v1.3 oder neuer) | Datensatz „Nutzung – 1 kWh nationaler Netzstrommix“ (derzeit 0,5320 kg CO₂-Äq./kWh, zurückgerechnet); Rechenwerte für Gas-, Öl- und Pelletkessel | B6 im LCA-Rechner, `src/calc/lca.ts` | #173, Prüfpunkte 1 und 4 |
| A6 | QNG-Handbuch Anlage 3, aktuelle Fassung 2026 | Anforderungswerte Wohngebäude (derzeit 24/20 kg CO₂-Äq./(m²·a)); Hinweis „seit 12/2025 vorübergehend geringere Anforderungen“; maßgebende Fassung der BNB-Nutzungsdauertabelle | Ergebnisaussage QNG im LCA-Rechner | #173, Prüfpunkte 2 und 5 |
| A7 | DIN EN 1992-1-1:2011-01 mit NA (DE) | 3.1.2(5) und (6): f_ck(t) für t ≥ 28 d und Zementbeiwert s (Zuordnung L-Zemente) | Ausschalfrist (`src/calc/hydratation.ts`), Festigkeitsentwicklung (`src/calc/pruefverfahren.ts`) | Z55; #176 Prüfpunkt 1, #182 Prüfpunkt 3, #184 Prüfpunkt 4 |
| A8 | DIN EN 1992-1-1:2011-01 mit NA (DE) | 3.1.4(3): Bezug der Kriechzahl auf E_c = 1,05·E_cm (Wortlaut) | Stützenbeispiel, `src/calc/kriechenSchwinden.ts` | #184, Prüfpunkt 1 |
| A9 | DIN EN 1992-1-1:2011-01 mit NA (DE) | Anhang B: Grenzen für h₀; Tab. 3.1: ε_cu2 und n oberhalb C90/105 | `src/calc/kriechenSchwinden.ts`, `src/calc/werkstoffmodelle.ts` | Z55; #175 Prüfpunkt 1, #177 Prüfpunkt 9 |
| A10 | DIN EN 1992-1-1/NA (DE) | 3.3.2: Relaxationsverlust bei μ ≤ 0,5; 5.10.2.1: Begrenzung σ_pm0 | Spannstahl-Relaxation (`src/calc/kriechenSchwinden.ts`), Spannbeton-Demo Station 2 (`src/calc/spannbeton.ts`) | #175 Prüfpunkt 4, #179 Prüfpunkt 3 |
| A11 | DIN EN 1992-1-1/NA (DE) | 7.3.2: Mindestbewehrung – k, f_ct,eff zum Risszeitpunkt, σ_s, h_c,ef | Praxisbeispiel massiges Bauteil, `src/calc/hydratation.ts` | #179, Prüfpunkt 4 |
| A12 | DIN EN 13791:2019 (bzw. aktuelle Ausgabe) | Bezugskurve Rückprallhammer; Umrechnung Bohrkern h/d = 1 auf Würfelfestigkeit | ZfP, Bauwerksuntersuchung, Labor; Bohrkern in `src/calc/pruefverfahren.ts` | Z55; #182, Prüfpunkte 1 und 7 |
| A13 | DIN EN 206:2021-06 und DIN 1045-2:2023-08 | Konformitätskriterien Druckfestigkeit (Tab. 14 bzw. Anhang), Mindestwert σ, Umrechnung Würfel/Zylinder | Festbeton-Statistik, `src/calc/festbetonStatistik.ts` | Z55; #182, Prüfpunkt 2 |
| A14 | DIN 1045-2:2023-08 | k-Wert-Ansatz bei gleichzeitiger Verwendung von Flugasche und Silikastaub | Expositionsklassen/Mischung, `src/calc/expositionsklassen.ts` | Z55 (Brief Runde 2) |
| A15 | ZTV-ING Teil 5 bzw. DIN EN 1992-1-1/NA (DE) | Teilsicherheitsbeiwert γ_c für Beton im Tunnelbau | Bauprodukte Verkehrswegebau, Tunnel | Z55 (Brief Runde 2) |
| A16 | Westergaard-Lösung in der Fassung der RDO Beton bzw. einschlägiger Fachliteratur | Spannungsformeln Plattenmitte/-rand/-ecke | Betondecken, `src/calc/verkehrswegebau.ts` | Z55 (Brief Runde 2) |

## B – Lehrwerte belegen

| Nr. | Werk | Abschnitt / Tabelle | Wofür (Rechner, Datei) | Herkunft |
|---|---|---|---|---|
| B1 | DIN EN 1995-1-1/NA (DE) | 7.3.3: Grenzwert w/F (Parameter a) und Geschwindigkeitskriterium | BSP-Deckenschwingung, `src/calc/bspSchwingung.ts` | #171, Prüfpunkt 1 |
| B2 | DIN 1045-3:2023-08 | Mindestdauer der Nachbehandlung: Regel unter 5 °C, X0/XC1 = 0,5 d, XM doppelte Dauer | Nachbehandlung, `src/calc/hydratation.ts` | #176, Prüfpunkt 6 |
| B3 | DIN EN 12390-12:2020 | Prüfbedingungen der Schnellkarbonatisierung (3,0 Vol.-% CO₂, Toleranz) | `src/calc/korrosion.ts`, `src/calc/schnellkarbonatisierung.ts` | #184, Prüfpunkt 5 |
| B4 | DIN EN 16612:2019 und DIN EN 16613:2019 | Schubverbundfaktor Γ und effektive Dicke (Formel mit h_v und h_s); Steifigkeitsfamilien der Zwischenschichten | Glas, `src/calc/glas.ts` | #178, Prüfpunkt 7 |
| B5 | DIN EN 338:2016 | Tab. 1: Festigkeitswerte C30 (f_c,0,k) und D30 (E_0,mean, f_c,0,k) | Bauwerkserfassung, `src/calc/holzbau.ts` | #181, Prüfpunkt 3 |
| B6 | DIN EN 14080:2013 | Rohdichte ρ_mean GL24h und GL28h | Eigengewicht BpHolzprodukte | #181, Prüfpunkt 4 |
| B7 | DIN 1045-2:2023-08 (bzw. DIN EN 12390-3/NA) | Umrechnung trocken gelagerter Probekörper (0,92/0,95) | Lagerungsfaktoren Festbeton, `src/calc/pruefverfahren.ts` | #182, Prüfpunkt 10 |
| B8 | Walz, K.: Herstellung von Beton nach DIN 1045. Beton-Verlag (bzw. Zement-Taschenbuch, Ausgabe mit Walz-Kurven) | Walz-Kurven: Lage der Kurven je Zementfestigkeitsklasse (A = 100/120/140 N/mm², B = 5) | Mischungsberechnung, `src/calc/mischung.ts` | #179, Prüfpunkt 6 |
| B9 | Fachliteratur zur Sorption von Holz (z. B. USDA Forest Products Laboratory: Wood Handbook, Kap. 4, öffentlich) | Gleichgewichtsfeuchte bei 20 °C und 65/85 % r. F. | Holzfeuchte, `src/calc/holzphysik.ts` | #181, Prüfpunkt 1 |
| B10 | RILEM TC 154-EMC bzw. AASHTO T 358 | Bewertungsschwellen des spezifischen Widerstands (Wenner) | ZfP, `src/calc/pruefverfahren.ts` | #182, Prüfpunkt 6 |
| B11 | DIN 4108-3 und WTA-Merkblatt zur Karsten-Prüfung | Klassen des Wasseraufnahmekoeffizienten; Prüffläche des Karsten-Röhrchens | ZfP gegenüber Bauwerksuntersuchung | #182, Prüfpunkt 5 |
| B12 | Fachliteratur zu temperaturabgesenkten Asphalten (z. B. DAV-Leitfaden bzw. FGSV-Merkblatt) | Viskositäts-, Aerosol- und Energieansätze | NTA-Lehrmodell, `src/calc/asphalt.ts` | #180, Prüfpunkt 1 |

## C – Ausgaben, Zitate, Erweiterungen

| Nr. | Werk | Abschnitt / Tabelle | Wofür | Herkunft |
|---|---|---|---|---|
| C1 | Rastrup, E.: Heat of hydration in concrete. Magazine of Concrete Research 6 (1954) 17, S. 79–92 | bibliografische Angaben bestätigen | Zitat Reifefunktion, `content/hydratationfolgen/HydratationFolgen.json` | #184, Prüfpunkt 6 |
| C2 | DIN EN 1993-1-9 | 7.1: Dauerfestigkeit bei Wöhlerlinien mit m = 5 | `src/calc/werkstoffmodelle.ts` | #177, Prüfpunkt 3 |
| C3 | DIN EN 1993-1-2 | Bild 3.1 und Anhang A (elliptische σ-ε-Linie, Verfestigung unter 400 °C) | Freigabe der trilinearen Lehrvereinfachung | #177, Prüfpunkt 4 |
| C4 | DIN EN 1993-1-4 | Anhang C (Ramberg-Osgood) | nur bei Erweiterung des Edelstahlmodells | #177, Prüfpunkt 8 |
| C5 | DIN 488-1:2009 | A_gt gegenüber Bruchdehnung A | Zugversuch Betonstahl, `src/calc/pruefverfahren.ts` | #182, Prüfpunkt 8 |
| C6 | DIN EN 1993-1-1, Tab. 3.1 | S460 f_u (Kennlinie 600 gegenüber 540) | `src/modules/mechanischekenngroessen/daten.ts` | #184, Prüfpunkt 7 |
| C7 | DIN 17100 (historisch) | St 52-3 Zugfestigkeit 520–620 N/mm² | `src/data/historicalMaterialsData.ts` | #184, Prüfpunkt 7 |
| C8 | ÖNORM B 1995-1-1:2015 bzw. Hamm/Richter (2009) | Orientierungswerte Deckenschwingung (Quelle der Zahlen bestätigen) | `content/holzbaubeta/HolzbauBauphysik.json` | #171 |

## Nicht über Literatur zu lösen (Entscheidung Prof. Huber)

Diese Punkte aus denselben PRs brauchen keine Normseite, sondern eine fachliche Entscheidung. Sie stehen hier, damit sie nicht verloren gehen: LCC-Restwert als Standard ja/nein (#184, 2); Estrichsteifigkeit und Beispielaufbauten BSP (#171, 5–6); Schwellen und Faktoren der Lehrmodelle in Hydratation, Reißrahmen, AKR, Karbonatisierungs-Richtwerte, Lokalelement und Packungsdichte (#176, #177, #178, #180); einheitliche Rückprall-Lehrkurve und einheitliche Potentialgrenzen (#182, 1 und 4); Litzenkraft 150 kN (#179, 2); lineare Interaktion im Sparrenrechner (#181, 5).
