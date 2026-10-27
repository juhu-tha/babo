# Normwerte – Belege (Auftrag B, Stand 27.10.2026)

Prüfung aller im Code als „vorläufig“ bzw. „F-Freigabe“ markierten Werte in `src/calc/mauerwerk.ts`,
`src/calc/bspSchwingung.ts`, `src/calc/glaser.ts` und `src/calc/lca.ts` sowie der Mischungsberechnung Beispiel 5 (Z9)
gegen öffentlich zugängliche Quellen. Normtexte wurden nicht abgeschrieben. Status:

- **belegt** – Wert wörtlich oder rechnerisch eindeutig in einer öffentlichen Quelle; Markierung entfernt
- **korrigiert** – Wert wich von der öffentlichen Quelle ab und wurde geändert (vorher → nachher)
- **vorläufig** – nur über den Normtext bzw. ein nicht öffentliches Dokument bestätigbar; bleibt markiert (Fehlliste unten)

## Quellen (Kurzzeichen)

| Kürzel | Quelle |
|---|---|
| AMz 2016 | Arbeitsgemeinschaft Mauerziegel e. V.: Bemessung von Ziegelmauerwerk – Vereinfachte Berechnungsmethoden nach DIN EN 1996-3/NA, 2. Ausgabe 03/2016 (luecking.de) |
| TUD 2025 | TU Dresden, Institut für Massivbau (P. Schöps): Musterlösung Mauerwerk, 14.02.2025, OER Bildungsportal Sachsen |
| mb 7/2013 | mb AEC Software: mb-news 7/2013, „Mauerwerksnachweis“, S. 34–36 |
| KS-TH 2012 | Bundesverband Kalksandsteinindustrie: KS-Broschüre „Bemessung nach Eurocode 6“, Stand 10/2012, S. 14, Tafeln 14–16 |
| KS-MB | Bundesverband Kalksandsteinindustrie: KS-Merkblatt „Bemessung von Mauerwerkswänden mit Tragfähigkeitstafeln“ |
| KS-MB 2020 | Bundesverband Kalksandsteinindustrie: Merkblatt „Vereinfachtes Berechnungsverfahren nach DIN EN 1996-3/NA:2019-12 – Erweiterte Anwendungsgrenzen für Wandhöhen > 2,75 m“, 04/2020 |
| Lücking 2026 | Lücking: Produkthandbuch 2026, S. 49, HLz B 12-0,90 |
| JRC | European Commission JRC, Eurocodes-Workshop „EN 1996-3“ (Witje), 2022: h_ef/t_ef ≤ 27 |
| proHolz II | proHolz Austria: Brettsperrholz Bemessung Band II – Anwendungsfälle, 1. Aufl. 01/2018 |
| Dlubal | Dlubal Wissensdatenbank KB 000694 „Vereinfachter Schwingungsnachweis für EC 5“, 29.03.2021 |
| BNW | BaunetzWissen Bauphysik: „Normativer Rechenweg: Randbedingungen“ (Feuchteschutz) |
| T 3288 | Ackermann/Kießl/Grafe: Systematische rechnerische Untersuchungen zur ergänzenden Absicherung vereinfachter nationaler Klima-Randbedingungen, Forschungsbericht T 3288, Fraunhofer IRB 2012 (DIBt-gefördert) |
| DIN Media | DIN Media, Produktseite DIN 4108-3:2024-03, Änderungsvermerk gegenüber 2018-10 |
| München FKG | Landeshauptstadt München, RKU: Vorlage „RL22 Beispiel-Bericht LCA-THG“, Förderprogramm Klimaneutrale Gebäude 2024, Arbeitsblatt 3 (nach QNG „Oekobilanzierung-Rechenwerte-2023-Version-1.3“) |
| EVEBI 2023 | QNG-Beispielbericht WG, Energie Effizienz Institut, EVEBI 13.0.6, 04.05.2023 (gebaeudebilanz.de) |
| KfW 09/2025 | KfW: Anlage zum Merkblatt 296/498, Technische Mindestanforderungen, 09/2025, Tab. 1 |
| envisys 2026 | envisys Infothek „QNG“, Stand 01/2026 |
| Lobbyregister | Deutscher Bundestag, Lobbyregister SG2505050004 (Bundesverband der Deutschen Ziegelindustrie), 05.05.2025 |
| UBA 2024 | Umweltbundesamt: Vergleich der durchschnittlichen Emissionen einzelner Verkehrsmittel im Güterverkehr in Deutschland 2024, TREMOD 6.71B (10/2025) |
| B 20 | InformationsZentrum Beton / VDZ: Zement-Merkblatt Betontechnik B 20 „Zusammensetzung von Normalbeton“, Ausgabe 2.2017 (beton.org) |

## Ergebnis je Wert

| Wert | Stelle | Status | Quelle |
|---|---|---|---|
| ρ₂ = 0,75 (t ≤ 175 mm, a = t) | `mauerwerk.ts` `rho2` | belegt | TUD 2025, Abschn. 4.1.2 (t = 175 mm); KS-MB-Tafel (Rückrechnung, Test) |
| ρ₂ = 0,90 (175 < t ≤ 250 mm) | `mauerwerk.ts` `rho2` | belegt | TUD 2025, Abschn. 4.2.2 (t = 240 mm); AMz 2016, S. 12 (t = 240 mm) |
| ρ₂ = 1,00 (t > 250 mm) | `mauerwerk.ts` `rho2` | belegt | AMz 2016, S. 12; KS-MB-Tafel t = 300 mm (Rückrechnung) |
| ρ₂ = 1,0 bei a/t = 2/3 | `mauerwerk.ts` `rho2` | belegt | KS-MB-Tafel, Spalte a/t = 2/3 (Rückrechnung aller Zeilen, Test) |
| ρ₂ = 1,0 bei 2/3 < a/t < 1 | `mauerwerk.ts` `rho2` | vorläufig | nur Normtext |
| Φ₁ = 1,6 − l_f/6 ≤ 0,9·a/t (f_k ≥ 1,8) bzw. 1,6 − l_f/5 | `mauerwerk.ts` `phi1` | belegt | mb 7/2013; AMz 2016, S. 12 |
| Φ₁ = 0,333 (oberstes Geschoss) | `mauerwerk.ts` `phi1` | belegt | mb 7/2013; AMz 2016, S. 12 |
| Φ₁ = 0,9 (Innenwand) | `mauerwerk.ts` `phi1`, `RechnungMauerwerk.json` | belegt | mb 7/2013 („Mindestwert von Φ1 = 0,9“); TUD 2025 |
| Φ₂ = 0,85·a/t − 0,0011·(h_ef/t)² | `mauerwerk.ts` `phi2` | belegt | mb 7/2013; AMz 2016, S. 12 (Beispiele 1/2) |
| ζ = 0,85; γ_M = 1,5 | `mauerwerk.ts` | belegt | AMz 2016, S. 7/10 und Tab. 3 |
| Grenzschlankheit h_ef/t ≤ 27 | `mauerwerk.ts` `SCHLANKHEIT_MAX` | belegt | AMz 2016, S. 12 („darf nicht größer als 27 sein“); JRC |
| l_f ≤ 6,0 m | `mauerwerk.ts` `LF_MAX` | belegt | AMz 2016, S. 8; KS-MB (Tafeln bis 6,0 m) |
| Tab. NA.2: h > 2,75 m nur mit erweiterten Bedingungen; Innenwände t ≥ 115 mm | `mauerwerk.ts` Hinweise | belegt | KS-MB 2020 |
| f_k KS/KS-R, NM II–IIIa (SFK 12–28) | `mauerwerk.ts` `FK_TAFEL_NA` | belegt | KS-TH 2012, Tafel 15 |
| f_k KS L/KS L-R, NM II–IIIa (SFK 10–16) | `mauerwerk.ts` `FK_TAFEL_NA` | belegt | KS-TH 2012, Tafel 14 |
| f_k KS XL, DM (9,4/11,2/12,9/16,0) | `mauerwerk.ts` `FK_TAFEL_NA` | belegt | KS-TH 2012, Tafel 16; KS-MB, Fußnoten 4–10 |
| f_k KS P, KS L-P, DM | `mauerwerk.ts` `FK_TAFEL_NA` | vorläufig | KS-TH 2012, Tafel 16 – Spaltenzuordnung im Textauszug nicht eindeutig |
| f_k HLz B 12-0,90 (3,8/5,0/5,7/3,5) | `mauerwerk.ts` `FK_TAFEL_NA` | belegt | Lücking 2026, S. 49 (Quelle von Produkthandbuch 2024 auf 2026 aktualisiert) |
| E_0,mean = 11 550, G_r,mean = 65 N/mm², γ = 5,5 kN/m³ | `bspSchwingung.ts` `BSP_KENNWERTE` | belegt | proHolz II, Tab. 3-1/3-2, S. 11–12 |
| f₁ ≥ 8/6 Hz, w(1 kN) ≤ 0,25/0,50 mm, f₁,min 4,5 Hz | `bspSchwingung.ts` `ORIENTIERUNG` | belegt | proHolz II, Gl. 4.1/4.2, S. 17–18 |
| Anwendungsgrenze 8 Hz (EN 1995-1-1, 7.3.3) | `bspSchwingung.ts` | belegt | Dlubal |
| Grenzwerte DIN EN 1995-1-1/NA (DE), 7.3.3 | `HolzbauBauphysik.json` (Datei A2) | vorläufig | nur Normtext |
| Tauperiode 2 160 h, 20 °C/50 %, −5 °C/80 % | `glaser.ts` `TAUPERIODE_DIN_4108_3` | belegt | BNW; T 3288, Tab. 1 |
| R_si = 0,25, R_se = 0,04 m²K/W | `glaser.ts` | belegt | T 3288, Abschn. 4.1.1 |
| Verdunstung 2 160 h, p_i = p_e = 1 200 Pa, 1 700 Pa (Wand) | `glaser.ts` `verdunstungDin4108_3` | belegt | BNW; T 3288, Tab. 1 |
| 2 000 Pa (Dach) | `glaser.ts` `verdunstungDin4108_3` | belegt (Stand 2014/2018), für 2024-03 vorläufig | T 3288, Tab. 1; DIN 4108-3:2024-03 führt neue Außendampfdrücke für verschattete und helle Dächer ein (DIN Media) |
| Unverändertheit der Klimawerte in DIN 4108-3:2024-03 | `glaser.ts` | vorläufig | DIN Media nennt keine Änderung der Tauperiode, bestätigt aber auch keine |
| Höhenlage ≤ 700 m | `rechnerGrenzen.ts` (feuchteschutz) | belegt, als Grenze ergänzt | DIN Media (Änderungsvermerk a) |
| δ₀ = 2,0 · 10⁻¹⁰ kg/(m·s·Pa) | `glaser.ts` `DELTA_0_KG_MHPA` | vorläufig | Wert der DIN EN ISO 13788; Verwendung in DIN 4108-3:2024-03 öffentlich nicht belegt |
| M_c ≤ 1,0 bzw. 0,5 kg/m² | `glaser.ts` | belegt | BNW; T 3288 |
| Netzstrom B6 | `lca.ts` `B6_FAKTOREN.netzstrom` | korrigiert | 0,5320 → 0,53203 kg CO₂-Äq./kWh; München FKG (QNG-Rechenwerte 2023 v1.3); EVEBI 2023 (Rückrechnung 0,53204) |
| QNG-PLUS 24 / PREMIUM 20 kg CO₂-Äq./(m²·a) | `lca.ts` `QNG_WG` | belegt | KfW 09/2025, Tab. 1; envisys 2026 |
| vorübergehend geringere QNG-Anforderungen seit 12/2025 | `lca.ts` `QNG_WG` | vorläufig | envisys 2026 nennt die Absenkung, Zahlenwerte öffentlich nicht gefunden |
| BNB-Nutzungsdauern, Fassung 24.02.2017 | `lca.ts` `BNB_NUTZUNGSDAUER` | belegt (Fassung) | QNG-Anhang 3.1.1 v1.4; Lobbyregister („letzter Stand: 2017“, Neuerhebung läuft) |
| BNB-Neufassung 2025 (WDVS ≥ 50 a) | `lca.ts` Kommentar | vorläufig | öffentlich nicht bestätigt |
| ND-Zuordnung Geopolymer, Lehmplatte, Hanfkalk, Stroh, EPS/Holzfaser-WDVS | `lca.ts` `BNB_NUTZUNGSDAUER` | vorläufig | Analogieschluss (nicht gelistete Baustoffe) |
| A4 Gebäuderechner Lkw | `lca.ts` `A4_FAKTOR_GEBAEUDE.lkw` | korrigiert | 0,15 → 0,118 kg/(t·km); UBA 2024 (Lkw gesamt 118 g/tkm) |
| A4 Gebäuderechner Bahn | `lca.ts` `A4_FAKTOR_GEBAEUDE.bahn` | korrigiert | 0,03 → 0,014 kg/(t·km); UBA 2024 (Güterbahnen 14 g/tkm) |
| A4 Einzelrechner „Diesel-Lkw 40 t“ | `lca.ts` `A4_FAKTOR_EINZEL['lkw-heavy']` | korrigiert | 0,020 → 0,101 kg/(t·km); UBA 2024 (Last- und Sattelzüge) |
| A4 Einzelrechner „Diesel-Lkw 7,5 t“ | `lca.ts` `A4_FAKTOR_EINZEL['lkw-light']` | korrigiert | 0,080 → 0,561 kg/(t·km); UBA 2024 (Lkw 3,5–7,5 t) |
| A4 Einzelrechner Güterzug | `lca.ts` `A4_FAKTOR_EINZEL.zug` | korrigiert | 0,005 → 0,014 kg/(t·km); UBA 2024 |
| A4 Elektro-Lkw 0,004 / H₂-Lkw 0,003 | `lca.ts` `A4_FAKTOR_EINZEL` | vorläufig | Lehrwerte, keine öffentliche Quelle |
| Beispiel 5: Zugabewasser 161,7 l/m³, Oberflächenwasser 13,3 l/m³ | `mischungBeispiele.ts` | belegt (Rechnung) | unabhängige Handrechnung in `tests/mischungBeispiel5.test.ts`; Rechenschema B 20, Abschn. 4 |
| Beispiel 5: Quellenangabe „offizielle Musteraufgabe aus B 20“ | `mischungBeispiele.ts` | korrigiert | B 20 (2.2017) enthält kein Beispiel mit 318 kg Zement / 175 l / 2,60 / 1,5 % → als Lehrbeispiel nach dem Rechenschema von B 20 bezeichnet |
| Beispiel 5: XC4/XF1 max. w/z 0,60 | `mischungBeispiele.ts` | belegt | B 20, Tafel 2 |
| Beispiel 5: minZement 300 kg/m³ | `mischungBeispiele.ts` | Prüfpunkt (nicht geändert) | B 20, Tafel 2 nennt 280 kg/m³ für XC4/XF1; der Datensatz setzt wie Beispiel 1 „+20 kg wegen D_max 16“ an – Begründung öffentlich nicht belegt, Wert in der Oberfläche nicht angezeigt |

## Mitgeänderte Inhalte (abhängige Zahlen)

| Stelle | Vorher | Nachher |
|---|---|---|
| `src/data/erkundung.ts`, `lca_rechner` Auftrag 1 | A4 1 621 → 324 kg; Kennwert 2,59 → 2,40 | A4 1 275 → 151 kg; Kennwert 2,54 → 2,38 |
| `src/data/erkundung.ts`, `lca_rechner` Auftrag 2 | 2,59 → 5,18 | 2,54 → 5,08 |
| `src/data/erkundung.ts`, `lca_rechner` Auftrag 3 | 2,59 → 2,06; mit D 0,82 | 2,54 → 2,01; mit D 0,78 |
| `src/data/erkundung.ts`, `oekobilanz_lca` Auftrag 1 | A4 72 → 480 kg; Anteil 3 → 20 % | A4 364 → 2 424 kg; Anteil 15 → 99 % |
| `src/data/erkundung.ts`, `oekobilanz_lca` Auftrag 2 | 1 920 kg; 78 %; Güterzug 120 kg | 13 464 kg; 5,5-fach; Güterzug 336 kg |
| `src/data/erkundung.ts`, `oekobilanz_lca` Auftrag 3 | A4 14 kg | A4 73 kg |
| `content/lca/LCA.json` | 0,020 / 0,080 / 0,005 kg/tkm; „um ca. 75 %“ | 0,101 / 0,561 / 0,014 kg/tkm (UBA 2024); „um rund 85 %“ |
| `content/interactivelcacalc/InteractiveLCACalc.json` | 0,15 / 0,03 kg CO₂/t·km | 0,118 / 0,014 kg CO₂-Äq./t·km (UBA 2024) |

`src/data/quiz.json` wurde nicht geändert. Betroffen (nur aufgelistet): Frage zu „20 m³ Normalbeton … Transport A4: 100 km
per LKW (0,15 kg CO₂/(t·km))“ und deren Distraktor „Güterzug mit 0,03 kg CO₂/(t·km)“ – in sich stimmig, nennt aber die
alten Rechnerfaktoren.

## Fehlliste – bleibt vorläufig (Prüfung am Normtext bzw. Originaldokument)

| Wert | Stelle | zu prüfen in |
|---|---|---|
| ρ₂ = 1,0 für 2/3 < a/t < 1 | `src/calc/mauerwerk.ts` | DIN EN 1996-3/NA:2019-12, Regel zur Knicklänge h_ef (vereinfachtes Verfahren, zweiseitig gehaltene Wände) |
| f_k KS P / KS L-P (Spaltenzuordnung) und Gleichheit aller f_k-Tabellenwerte mit der NA-Fassung 2019-12 | `src/calc/mauerwerk.ts` | DIN EN 1996-3/NA:2019-12, f_k-Tabellen für Kalksandstein (Normal- und Dünnbettmörtel); Original KS-Broschüre 10/2012, Tafel 16 |
| Tab. NA.2 vollständig (Gebäudehöhe, Nutzlast, Windzone) | `src/calc/mauerwerk.ts` (nicht geprüft) | DIN EN 1996-3/NA:2019-12, Tabelle NA.2 |
| BSP-Grenzwerte für Deutschland | `content/holzbaubeta/HolzbauBauphysik.json` (Datei A2) | DIN EN 1995-1-1/NA:2013-08, NCI zu 7.3.3 |
| Klimarandbedingungen in der Ausgabe 2024-03; Dachwert 2 000 Pa für verschattete/helle Dächer | `src/calc/glaser.ts`; `content/feuchteschutz/Feuchteschutz.json` (Datei A2) | DIN 4108-3:2024-03, Anhang A, A.2.2 und Tabelle A.3 |
| δ₀ | `src/calc/glaser.ts` | DIN 4108-3:2024-03, Anhang A, A.2.5 |
| vorübergehend geringere QNG-Anforderungen (seit 12/2025) | `src/calc/lca.ts` | QNG-Handbuch Anlage 3 bzw. QNG-Infoblatt 12/2025 (qng.info) |
| Aktualität der QNG-Rechenwert-Tabelle (v1.3) | `src/calc/lca.ts` | qng.info, „Oekobilanzierung Rechenwerte“ aktuelle Version |
| BNB-Neufassung (WDVS ≥ 50 a) und Übernahme in QNG | `src/calc/lca.ts` | BBSR, „Nutzungsdauern von Bauteilen für Lebenszyklusanalysen nach BNB“, aktuelle Fassung; QNG-Anhang 3.1.1 |
| ND-Analogien (Geopolymer, Lehmplatte, Hanfkalk, Stroh, WDVS) | `src/calc/lca.ts` | BBSR-Tabelle (nicht gelistete Baustoffe) – fachliche Entscheidung |
| A4 Elektro-/H₂-Lkw | `src/calc/lca.ts` | keine öffentliche Quelle; fachliche Entscheidung (z. B. UBA-/TREMOD-Szenariowerte) |
| L-Zemente → Zementklasse für s (EC2 3.1.2(6)) | `src/calc/hydratation.ts`, `tests/hydratation.test.ts` (Datei A1) | DIN EN 1992-1-1/NA, 3.1.2(6); DIN EN 197-1, Tab. 3 |
| linearer Restwert in der LCC | `src/calc/lcc.ts` | methodische Entscheidung (BNB 2.1.1 ohne Restwertregel; Delegierte VO (EU) 244/2012) – kein Normwert |
| minZement 300 kg/m³ in Beispiel 1 und 5 (D_max 16) | `src/data/mischungBeispiele.ts` | DIN 1045-2:2023-08, Tab. F.2.1 (B 20, Tafel 2: 280 kg/m³) |
