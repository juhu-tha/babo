# Modulprüfung Tranche 5 – Mineralische und metallische Baustoffe (Befundliste zur Freigabe)

**Stand:** 28.10.2026 (Branch `pruefung/module-tranche5-10-28`, Basis origin/main b2cb8367)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke und **keine** Quizfragen geändert. Keine Quizfrage wird durch die Korrekturen falsch (Abgleich der 66 Fragen der zehn Module).

## Vorgehen

- **Auswahl (10 Module):** Gesteine, Keramik und Ziegel, Putze & Mörtel, Gips, Kalk, Lehm, Erdbau & Böden, Glas, Stahl, Metalle (Mauerwerk wurde in Tranche 1 und 3 geprüft).
- **Prüfumfang je Modul** (wie Tranche 1 bis 3): Rechenkern bzw. Inline-Rechnung mit mindestens drei eigenen Nachrechnungen (eigenes Python-Skript, eigene Umsetzung der Norm- und Modellgleichungen, Randfälle eingeschlossen); bei Modulen ohne Rechner Fakten-Stichprobe von mindestens fünf Aussagen. Dazu Fachtext (`content/*.json`) und Normstand (Ausgaben Oktober 2026, NA DE), Grenzen (`src/data/rechnerGrenzen.ts`), Beispiele, Lernziele und Kurzfassung, Quellen und Stellen „vorläufig, F-Freigabe“.
- **Ergebnis der Nachrechnung:** 62 Prüfungen in `tests/modulpruefungTranche5.test.ts` (Toleranz 0,5 %), dazu die Inline-Rechnungen (Lehm, Gips, Kalk, Metalle, Gesteine) über die Formeln. Abweichungen: eine Rundung im Mörtelrechner (T5-PM-1) und eine Frostklasse im Erdbaukern (T5-ER-1), beide behoben. Kontrollwert VSG: 8,584 mm gegen 8,57 mm der Quelle (0,2 %, Rundung der Quelle).
- Es wurden nur öffentliche Quellen verwendet; Normtexte wurden nicht abgeschrieben. **Hinweis:** Das Kontingent der Websuche war während der Prüfung erschöpft. Für Gips, Kalk und Teile von Metalle und Gesteine stützt sich die Stichprobe daher auf eigene Stöchiometrie- und Thermochemie-Rechnungen und Lehrbuchwissen; öffentliche Belegstellen sind dort unter „F-Freigabe“ vermerkt.

## Übersicht

| Nr. | Modul | Prüfvermerk-ID | Rechnung | Empfehlung |
|---|---|---|---|---|
| 1 | Gesteine | `gesteine` | Beispiel Körnungsziffer (Formel) | freigabefähig nach Korrektur T5-GS-1/-2/-3 (F-Stelle Sieblinien) |
| 2 | Keramik und Ziegel | `keramik_ziegel` | `src/calc/keramik.ts` | freigabefähig |
| 3 | Putze & Mörtel | `putzemoertel` | `src/calc/moertelbedarf.ts` (neu) | freigabefähig nach Korrektur T5-PM-1 bis -4 und Klärung von T5-PM-5/-6 |
| 4 | Gips | `gips` | Beispiel Wasser-Gips-Wert (Formel) | freigabefähig |
| 5 | Kalk | `kalk` | Thermochemie (Formel) | freigabefähig nach Korrektur T5-KA-1 |
| 6 | Lehm | `lehm` | Inline-Schätzmodell, Beispiel Trocknungswasser | freigabefähig nach Klärung von T5-LE-1/-2 |
| 7 | Erdbau & Böden | `erdbau` | `src/calc/erdbau.ts` | freigabefähig nach Korrektur T5-ER-1 und Klärung von T5-ER-2 |
| 8 | Glas | `glas` | `src/calc/glas.ts` | freigabefähig nach Korrektur T5-GL-1/-2 und Klärung von T5-GL-3 |
| 9 | Stahl | `stahl` | `src/calc/werkstoffmodelle.ts`, `src/calc/eisenKohlenstoff.ts` | freigabefähig nach Korrektur T5-ST-1/-2 und Klärung von T5-ST-3 |
| 10 | Metalle | `metalle` | Beispiel Wärmedehnung (Formel) | freigabefähig nach Korrektur T5-ME-1/-2 |

**Behobene Fehler (dieser PR):**
- **T5-PM-1:** Mörtelrechner – Gleitkommarest beim Aufrunden der Säcke (Standardwerte zeigten 34 statt 33 Säcke, Beispiel im Modul 33); Rechnung in neuen Kern `src/calc/moertelbedarf.ts` mit Test verlegt, keine stillen Ersatzwerte mehr.
- **T5-PM-2:** Leichtmauermörtel als M 2,5 / „alt MG II“ geführt; Leichtmauermörtel LM 21 / LM 36 sind M 5.
- **T5-ER-1:** Ausgeprägt plastischer Ton (TA) im Erdbaukern als F3 eingestuft; nach ZTV E-StB 17, Tab. 1 ist TA F2.
- **T5-GL-1:** DIN 18008-3 und -4 mit Ausgabe 2020-05 genannt; gültig sind die Ausgaben 2024-12.
- **T5-ST-1:** Formel der Wärmeeinbringung ohne Faktor 10⁻³ bei Einheit kJ/mm und mit dem Formelzeichen E_s (E-Modul).
- **T5-ME-1:** doppelte und abgebrochene Sätze (Sphäroguss, Edelstahl mit falscher CRC-Angabe zu 1.4529).
- Weitere Text- und Normstandkorrekturen: T5-GS-1 bis -3, T5-PM-3/-4, T5-KA-1, T5-GL-2, T5-ST-2, T5-ME-2, T5-KZ-1, T5-LE-3.

---

## 1. Gesteine (`gesteine`)

**Prüfumfang:** `content/gesteine/Gesteine.json` (Gesteinsarten, Eigenschaften, Kennwerte und Prüfung, Gesteinskörnungen, Anwendungsbeispiel Körnungsziffer B16, Formeln, Regelwerke), `src/modules/Gesteine.tsx`, Lernziele. Kein Rechner.

**Nachrechnungen / Stichprobe**

| Fall | Aussage | Prüfung | Ergebnis |
|---|---|---|---|
| GS1 | k(B16) = 3,66 aus den Durchgängen 8/20/32/42/56/76/100 % | Σ Rückstände 366 / 100 | richtig |
| GS2 | Fuller-Kurve n = 0,5: Durchgang bei d/D = 4/16 | 100·(0,25)^0,5 = 50 % | richtig |
| GS3 | LA = (m₀ − m₁)/m₀ · 100 % mit Rückstand auf 1,6 mm | Beispiel m₁ = 3 900 g → LA 22 | richtig |
| GS4 | B16 bei 4/8 mm: 56/76 % | Entscheidung 27.10. (Lehrbuchwerte) | übereinstimmend, „vorläufig“ |
| GS5 | Kornformkennzahl SI: Länge/Dicke > 3 (DIN EN 933-4); Plattigkeitskennzahl mit Stabsieben (DIN EN 933-3) | Lehrbuchwissen | richtig |
| GS6 | grobe Gesteinskörnung D ≥ 4 mm und d ≥ 2 mm, feine D ≤ 4 mm (DIN EN 12620) | Lehrbuchwissen | richtig |
| GS7 | DIN EN 12620:2008-07 aktuell | [DIN Media](https://www.dinmedia.de/de/norm/din-en-12620/103098198): Ausgabe 2013-07 ersatzlos zurückgezogen, 2008-07 weiter anzuwenden | richtig |

**Befunde**
- **behoben – T5-GS-1:** Zwei Platzhalter „Werte manuell prüfen“ bzw. „Anhang manuell prüfen“ bei den Sieblinien. Ersetzt durch „vorläufig, F-Freigabe“ (Entscheidung 27.10.).
- **behoben – T5-GS-2:** „Rohdichte (Scheinbare Dichte): … inklusive der geschlossenen und offenen Poren“. Die scheinbare Rohdichte ρ_a nach DIN EN 1097-6 enthält nur die geschlossenen Poren; die Rohdichte ρ_rd (ofentrocken) enthält alle Poren. Text getrennt nach ρ_rd, ρ_a und ρ_ssd.
- **behoben – T5-GS-3:** DIN 4226-101:2017-08 ist durch **DIN 4226-101:2025-11** ersetzt ([DIN Media](https://www.dinmedia.de/de/norm/din-4226-101/391976731); u. a. Typ 3 korrigiert, PAK16 20 mg/kg).
- Hinweis: Das Modul heißt „Gesteine & Natursteine“, behandelt aber überwiegend Gesteinskörnungen. Die Naturstein-Kennwerte (Druckfestigkeit, Frost nach DIN EN 12371) fehlen als Zahlen; die Lernziele verlangen „Wasseraufnahme, Porosität und LA aus Prüfdaten berechnen“, dafür gibt es nur Formeln, kein Beispiel.

**F-Freigabe-Stellen**
- Grenzsieblinien A/B/C 8, 16, 32 gegen DIN 1045-2:2023-08 (Entscheidung 27.10., „vorläufig“).

**Empfehlung:** freigabefähig nach Korrektur T5-GS-1 bis -3 (F-Stelle Sieblinien bleibt).

- [ ] Modul freigeben

## 2. Keramik und Ziegel (`keramik_ziegel`)

**Prüfumfang:** `src/calc/keramik.ts` (Wasseraufnahme, Fliesengruppe, Rohdichte, Porosität, Formmaß), `src/modules/KeramikZiegel.tsx`, `content/keramikziegel/KeramikZiegel.json` (Rohstoffe, Brand, Ziegelarten, Kennwerte, Normen, zwei Beispiele), Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| K1 | Beispiel 1: m_t = 1 250,0 g, m_n = 1 253,5 g, m_a = 717,0 g, trockengepresst | E_b = 0,28 %; V = 536,5 cm³; ρ = 2,330 g/cm³; P_offen = 0,652 % → BIa | identisch |
| K2 | m_t = 1 000, m_n = 1 150, m_a = 560 g, ρ_rein = 2,65, stranggepresst | E_b = 15 %; ρ = 1,695; P_offen = 25,42 %; P_ges = 36,04 % → AIII | identisch |
| K3 | Grenzen 3,0 % (B), 6,0 % (A), 10,01 % (B) | BIb, AIIa, BIII | identisch |
| K4 | Beispiel 2: NF 240 mm, s_T = 6 %, s_B = 2 % | l₀ = 260,53 mm; bei s_B = 3 %: 237,55 mm | identisch |

Druckfestigkeitsklassen (Mittelwert = 1,25 · Klasse) und LD/HD-Ziegel stimmen. DIN EN 14411:2016-12 ist aktuell ([DIN Media](https://www.dinmedia.de/de/norm/din-en-14411/256449026)). Der Entwurf **DIN 20000-401:2026-11** ist erschienen ([DIN Media](https://www.dinmedia.de/en/draft-standard/din-20000-401/406092747)); der Hinweis im Modul ist richtig.

**Befunde**
- **behoben – T5-KZ-1:** „Typ 1 nach DIN 1045-2“: Die Typen rezyklierter Gesteinskörnung sind in DIN 4226-101 festgelegt (Anwendung nach DIN 1045-2). Text angepasst.
- behoben: sonst keine.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 3. Putze & Mörtel (`putzemoertel`)

**Prüfumfang:** `src/modules/PutzeMoertel.tsx` (Mörtel- und Putzsteckbriefe, Systeme, Material-Orientierungsrechner), neuer Kern `src/calc/moertelbedarf.ts`, `content/putzemoertel/PutzeMoertel.json`, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern (vorher → nachher) |
|---|---|---|---|
| PM1 | Gipsputz 50 m², 15 mm, 1,1 kg/(m²·mm) (Standard, Beispiel im Modul) | 825 kg → 33 Säcke | **34** → 33 |
| PM2 | Normalfuge 30 m², 24 cm, NF | 1 890 l; 2 929,5 kg; 118 Säcke | identisch |
| PM3 | Dünnbett 30 m², 30 cm | 108 kg; 5 Säcke | identisch |
| PM4 | Quizfall `qn_putzemoertel_1`: 80 m², 20 mm, 1,25 | 2 000 kg = 80 Säcke | identisch |

**Befunde**
- **behoben – T5-PM-1 (Rundung):** 50 · 15 · 1,1 ergibt in Gleitkommarechnung 825,0000000000001 kg; `Math.ceil` lieferte 34 Säcke, das Beispiel im Modul nennt 33. Die drei Rechnungen liegen jetzt im Kern `src/calc/moertelbedarf.ts` (Sackanzahl mit Toleranz 10⁻⁹, Prüfung Fläche/Dicke > 0, keine stillen Ersatzwerte `|| 1.2` mehr; Hinweise über `EingabeHinweise`). Test `tests/moertelbedarf.test.ts` (Beispiel, Quizfall, Grenzen, Fuzz 1 000).
- **behoben – T5-PM-2 (Leichtmauermörtel):** „Leichtmauermörtel (LM) – Klasse M 2,5 / alt MG II“. Leichtmauermörtel LM 21 und LM 36 haben die Klasse M 5 (Druckfestigkeit > 5 N/mm²; [Heidelberg Materials, Mauermörtel](https://www.heidelbergmaterials.de/sites/default/files/assets/document/ef/12/mauermoertel_bro_4s_a4.pdf)) und waren nach DIN 1053-1 eigene Mörtelgruppen, nicht MG II. Name und Festigkeit korrigiert (ID `leicht_m25` unverändert).
- **behoben – T5-PM-3 (Sanierputz):** Altputz „mind. 1 m über Schadensgrenze“ → mindestens 80 cm über die sichtbare Schadensgrenze ([Remmers, Technisches Merkblatt Sanierputz](https://media.remmers.com/celum/export/documents/TM_0402_de_CH_85532.pdf)). „Trocknet dauerhaft feuchte Kellerräume“ ersetzt: Sanierputz beseitigt die Feuchtequelle nicht.
- **behoben – T5-PM-4 (Text):** Dezimalpunkt „0.2–0.5 Gew.-%“ → „0,2–0,5 M.-%“; fehlendes Leerzeichen; „Absolut wasserundurchlässig“ (Zementputz) → „sehr dicht, wasserabweisend“; „Prächtige mineralische Atmunghäufigkeit“ → „diffusionsoffen (geringer s_d-Wert)“.
- **offen – Frage T5-PM-5 (Wasserbedarf):** Der Rechner setzt für alle Putze 0,26 l Wasser je kg Trockenmörtel an. Für Gipsputze liegt der Wasseranspruch deutlich höher (Größenordnung 0,6 l/kg), für Kalkzementputze bei rund 0,2 l/kg. Wasserbedarf je Putzart hinterlegen (Herstellerangaben) oder die Zeile entfernen?
- **offen – Frage T5-PM-6 (Sprache):** Viele Steckbrief- und Systemtexte sind werbend („Hochleistungs-“, „extrem“, „vollständig“, „Carbonatisierungskatalyse“, „Gips-Zellmatrix atmet aktiv“, CSH „nadelartig verfilzte Kristallstrukturen … extreme Druckfestigkeit“). Fachlich nicht falsch genug für eine Einzelkorrektur, aber für ein Lehrmodul ungeeignet. Sachliche Überarbeitung der Texte beauftragen?
- Hinweis: Die Grundbedarfswerte des Mauermörtelrechners (DF 38, NF 30, 2DF 24, HLz 18 l/m² bei 11,5 cm, Dickenfaktoren 2,1/2,6/3,2) und 1,2 kg/m² je 10 cm Dünnbett sind Lehrwerte ohne Quelle; im Kern als solche gekennzeichnet.

**F-Freigabe-Stellen**
- Mindestdruckfestigkeitsklasse der Leichtmauermörtel nach DIN 20000-412 (Entwurf 2026-04 liegt vor, [DIN Media](https://www.dinmedia.de/de/norm-entwurf/din-20000-412/399667302)).

**Umsetzung 29.10.2026 – T5-PM-5:** Wasserbedarf je Putzart im Kern `src/calc/moertelbedarf.ts` (`WASSER_PUTZ_L_JE_KG`, Lehrwerte): Gips 0,6, Luftkalk 0,22, Kalkzement 0,2, Zement 0,16, Sanierputz 0,2, Aerogel-Dämmputz 1,0 l/kg; Dünnbettmörtel bleibt 0,26 l/kg. Beispiel Gipsputz 50 m², 15 mm: 495 statt 214,5 l Wasser. Beschriftung „Wasserbedarf ca. (Lehrwert je Putzart)“. Test `tests/moertelbedarf.test.ts`. Quelle: Entscheidung 28.10. (Gips ≈ 0,6 l/kg); [HAGATHERM Typ Aerogel, technisches Merkblatt](https://prd-media.crb.ch/media/111640/HAGATHERM_Typ_Aerogel.pdf) (7 l Wasser je 7-kg-Sack).

**Umsetzung 29.10.2026 – T5-PM-6:** Steckbrief-, System- und Fachtexte sachlich überarbeitet (rund 90 Werte, Schlüssel unverändert): werbende Wörter („Hochleistungs-“, „extrem“, „vollständig“, „optimal“, „hervorragend“, „Spitzenputz“) entfernt; „Carbonatisierungskatalyse“, „Gips-Zellmatrix atmet aktiv“, CSH „extreme Druckfestigkeit“ ersetzt; Ansprache „Erfahre“ entfernt. Fachliche Präzisierungen: Zementputz ersetzt keine Abdichtung (DIN 18533); Sanierputz mit begrenzter Salzaufnahme, Luftporengehalt Frischmörtel > 25 Vol.-% / Porosität ≥ 40 Vol.-%; Regelwerk „DIN V 18550-2“ → DIN EN 998-1 (Typ R); WDVS-Verwendbarkeit nach abZ/aBG bzw. ETA; Dünnbettfuge 1–3 mm; Künzel-Kriterien nach DIN 4108-3. Quelle: DIN EN 998-1/-2, DIN 4108-3, WTA-Merkblatt 2-9, DIN 18533.

**Empfehlung:** freigabefähig nach Korrektur T5-PM-1 bis -4 und Klärung von T5-PM-5/-6.

- [ ] Modul freigeben

## 4. Gips (`gips`)

**Prüfumfang:** `content/gips/Gips.json` (Herstellung, Abbinden, Festigkeit, Feuchte, Brandschutz, Ettringit, Beispiel Wasser-Gips-Wert, Formeln, Regelwerke), Lernziele. Kein Rechner.

**Nachrechnungen / Stichprobe**

| Fall | Aussage | Eigene Rechnung | Ergebnis |
|---|---|---|---|
| GI1 | chemisch gebundenes Wasser 1,5 · 18,0/145,1 = 18,6 % | M(HH) = 145,15 g/mol → 18,62 % | richtig |
| GI2 | Beispiel W/G = 0,70, 10 kg: 1,86 kg gebunden, 5,14 kg Überschuss, n ≈ 53 % | 10,80 l Brei, 5,11 l Dihydrat → 52,7 % | richtig |
| GI3 | Kristallwasser des Dihydrats „ca. 20 M.-%“ | 2·18,015/172,17 = 20,9 % | richtig (gerundet) |
| GI4 | Brennen entzieht 75 % des Kristallwassers | 1,5/2 | richtig |
| GI5 | Ettringitgleichung C₃A + 3 CaSO₄·2H₂O + 26 H₂O | Massen- und Atombilanz | ausgeglichen |
| GI6 | Quizfall `qn_gips_1`: 20 kg, W/G 0,80 → Überschuss 12,28 kg | 16 − 3,72 | richtig |
| GI7 | DIN 18534: Gipsbaustoffe W0-I und mit Verbundabdichtung W1-I, nicht W2-I/W3-I | Lehrbuchwissen | richtig |

**Befunde**
- behoben: keine.
- Hinweis: „Halbhydrat bei ca. 100–180 °C“ im Text und „120–180 °C“ in der Formel; vereinheitlichen. „GKBI ≙ Typ H2“ genauer „Typ DH2“ (DIN EN 520).

**F-Freigabe-Stellen**
- Normstand DIN EN 13279-1:2008-11, DIN EN 520:2009-12 und DIN 18180:2014-09 (wegen erschöpfter Websuche nicht gegen DIN Media abgeglichen).

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben

## 5. Kalk (`kalk`)

**Prüfumfang:** `content/kalk/Kalk.json` (Kalkkreislauf, Kalkarten DIN EN 459-1, Erhärtung, Eigenschaften, Arbeitsschutz, Thermochemie), Lernziele. Kein Rechner.

**Nachrechnungen / Stichprobe**

| Fall | Aussage | Eigene Rechnung | Ergebnis |
|---|---|---|---|
| KA1 | ΔH Brennen +178,2, Löschen −65,2, Karbonatisierung −113 kJ/mol | Summe 0 (Kreisprozess geschlossen; Bildungsenthalpien) | richtig |
| KA2 | „Pro Mol CaO 44 g CO₂“ | M(CO₂) = 44,01 g/mol; 0,44 t CO₂ je t CaCO₃ | richtig |
| KA3 | Zersetzung bei T > 898 °C (p(CO₂) = 1 bar) | Lehrbuchwert ≈ 898 °C | richtig |
| KA4 | Kurzzeichen CL, DL, NHL, HL, FL (DIN EN 459-1) | Lehrbuchwissen | richtig |
| KA5 | DIN EN 459-1:2015-07 aktuell | [DIN Media](https://dinmedia.de/en/standard/din-en-459-1/233794596) | richtig |
| KA6 | Luftkalkmörtel 1 bis 3 MPa | Lehrbuchwissen | plausibel |

**Befunde**
- **behoben – T5-KA-1:** „Wasser als Katalysator“: Wasser ist Reaktionsmedium (Lösung von CO₂ und Ca(OH)₂), kein Katalysator; der Fachtext nennt es an anderer Stelle selbst „Reaktionsmedium“. Außerdem stand „Luftkalke … im erhärteten Zustand nicht wasserbeständig“ im Widerspruch zu „wasserunlösliche Calcit-Kristalle“; präzisiert (erhärten nicht unter Wasser, bei dauernder Durchfeuchtung wenig widerstandsfähig).

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig nach Korrektur T5-KA-1.

- [ ] Modul freigeben

## 6. Lehm (`lehm`)

**Prüfumfang:** `src/modules/Lehm.tsx` (Schätzmodell Stampflehm, Bemessung DIN 18940, Bentonit), `content/lehm/Lehm.json`, Beispiel Trocknungswasser, Lernziele. Inline-Rechnung, kein Kern.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Komponente |
|---|---|---|---|
| L1 | Standard: Ton 15, Schluff 35, Sand 50 Teile, w = 12 % | ρ = 1 920 kg/m³; f = 1,21 N/mm²; Schwinden 0,84 %; λ = 0,918 W/(mK); Sorption 12 g/m² | identisch |
| L2 | Beispiel: 100 m², 20 mm, ρ_d = 1 700, u₀ = 18 %, u_eq = 1,5 % | m_W = 3 400 · 0,165 = 561 kg | identisch („≈ 560“) |
| L3 | Randwerte der Regler (Ton 40/Sand 20, w = 25 %) | ρ ≥ 1 716, f ≥ 0,65, Schwinden ≥ 0,4 | die `Math.max`-Grenzen (1 200 / 0,5 / 0,1) greifen nie |

**Befunde**
- **behoben – T5-LE-3:** DIN 18945:2024-03 ist durch **A1:2026-06** geändert ([DIN Media](https://www.dinmedia.de/de/norm/din-18945/376331208)); Regelwerk ergänzt.
- **offen – Frage T5-LE-1 (Schätzmodell):** Das Modell ist als „grobe Schätzung – Lehrmodell, keine Normwerte“ gekennzeichnet. Es liefert Druckfestigkeiten von etwa 0,7 bis 2,2 N/mm², für Stampflehm nennt die Fachliteratur eher 2 bis 4 N/mm²; die Sorption wird in g/m² ohne Zeitbezug ausgegeben (DIN 18947 bezieht die Sorptionsklassen auf Zeitstufen bis 12 h). Modell als Kern mit Quelle hinterlegen, die Sorption mit Zeitbezug angeben oder das Schätzmodell auf Rohdichte und λ beschränken? Die stillen `Math.max`-Grenzen sind unwirksam und sollten mit entfernt werden.
- **offen – Frage T5-LE-2 (DIN 18940/18945):** Anwendungsgrenze „bis 13,0 m Höhe, Gebäudeklasse 1 bis 4“ und Druckfestigkeitsklassen „2 – 2,5 – 3 – 4 – 5 – 6 N/mm²“ am Normtext (DIN 18940:2023-06, DIN 18945:2024-03 + A1) bestätigen.

**F-Freigabe-Stellen**
- T5-LE-2 (Normtext DIN 18940/18945).

**Umsetzung 29.10.2026 – T5-LE-1:** Schätzmodell als Kern `src/calc/lehm.ts` (`lehmSchaetzmodell`), Formeln unverändert, als **Lehrmodell ohne Normbezug** gekennzeichnet; die unwirksamen `Math.max`-Untergrenzen entfallen, außerhalb des Reglerbereichs warnt der Kern; Hinweis auf 2–4 N/mm² für Stampflehm; Sorption heißt jetzt „Feuchtepuffer-Kennzahl (Lehrmodell, ohne Zeitbezug)“ mit Verweis auf die Zeitstufen der DIN 18947. Grenzen-Eintrag `lehm` neu. Test `tests/lehm.test.ts`. Quelle: Tranche 5, L1–L3.

**Umsetzung 29.10.2026 – T5-LE-2:** Normtext: Anwendungsgrenzen DIN 18940 (13 m, GK 1–4) und Druckfestigkeitsklassen DIN 18945 im Modul als „vorläufig, F-Freigabe“ gekennzeichnet; Werte unverändert. Quelle: DIN 18940:2023-06, DIN 18945:2024-03 + A1:2026-06 (Normtext).

**Empfehlung:** freigabefähig nach Klärung von T5-LE-1/-2.

- [ ] Modul freigeben

## 7. Erdbau & Böden (`erdbau`)

**Prüfumfang:** `src/calc/erdbau.ts` (Bodengruppe, Frostschutz), `src/modules/Erdbau.tsx`, `content/erdbau/Erdbau.json`, Beispiel Verdichtungsgrad, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern (vorher → nachher) |
|---|---|---|---|
| E1 | Feinkorn 10 %, Kies 60 / Sand 40 (Start) | Kies 54 % ≥ 40 % → GU/GT, F2 | identisch |
| E2 | Quizfall `qn_erdbau_3`: 10 %, Kies 30 / Sand 70 | Kies 27 % → SU/ST, F2 | identisch |
| E3 | Feinkorn 60 %, ausgeprägt plastisch | TA → **F2** (ZTV E-StB 17, Tab. 1) | F3 → F2 |
| E4 | Zone II, Bk3,2, F3, ungünstig | 60 + 5 + 5 = 70 cm; gebunden 15; FSS 55 | identisch |
| E5 | Zone I, Bk100, F2, günstig | 55; 30; 25 | identisch |
| E6 | Zone III, Bk0,3, F2, günstig | 40 + 15 = 55; 15; 40 | identisch |
| E7 | Beispiel: ρ = 2,05 t/m³, w = 8 %, ρ_Pr = 1,95 | ρ_d = 1,898; D_Pr = 97,3 % | richtig |

**Befunde**
- **behoben – T5-ER-1 (Frostklasse TA):** Nach ZTV E-StB 17, Tab. 1 gehören TA, OT, OH, OK sowie ST, GT, SU, GU zur Klasse F2; F3 sind TL, TM, UL, UM, UA, OU, ST*, GT*, SU*, GU* (öffentliche Wiedergabe der Tabelle: [studenten365, „Warum sind bindige Böden frostgefährdet?“](https://studenten365.com/library/lecture/read/438429-warum-sind-bindige-boden-frostgefardet); Ausgabe 2017 laut [Einführungserlass Bayern](https://mobilitaet.bayern.de/assets/stmi/vum/strasse/bauunderhalt/49_ztve.pdf)). Der Kern stufte TA als F3 („sehr frostempfindlich“) ein. Korrigiert in Kern, Anzeige-Daten (`Erdbau_7`) und den Texten zu F2/F3; Test `tests/erdbau.test.ts` angepasst (die Monotonie „mehr Feinkorn → nie günstigere Frostklasse“ gilt mit TA normgemäß nicht mehr).
- **behoben – T5-ER-3 (Text):** „RStO 12/24/24“ und doppeltes „und anstehendem Boden“.
- **offen – Frage T5-ER-2 (E_v2/E_v1):** Die Formelbox nennt „E_v2/E_v1 ≤ 2,2 bei D_Pr ≥ 100 %“ mit Quelle DIN 18134 / ZTV E-StB 17. Nach meinem Kenntnisstand nennt die ZTV E-StB 17 als Verhältniswert 2,3 (bzw. 2,5 bei geringeren Anforderungen) und lässt höhere Werte zu, wenn E_v1 ≥ 0,6·E_v2. Bitte am Normtext bestätigen.
- Normstand: DIN 18134:2012-04 ist aktuell ([DIN Media](https://www.dinmedia.de/de/norm/din-18134/149668370)); ZTV E-StB 17 gilt weiter.

**F-Freigabe-Stellen**
- T5-ER-2 (ZTV E-StB 17, Abschnitt Verdichtungsanforderungen); Fußnote der Tab. 1 zu ST/GT/SU/GU (unter bestimmten Bedingungen F1) ist nicht abgebildet.

**Umsetzung 29.10.2026 – T5-ER-2:** Formelbox: E_v2/E_v1 ≤ **2,3** bei D_Pr ≥ 100 % und ≤ **2,5** bei D_Pr ≥ 98 %; höhere Werte zulässig, wenn E_v1 ≥ 0,6·E_v2 (vorher ≤ 2,2). Als „vorläufig, F-Freigabe“ gekennzeichnet; Fachgebiet Geotechnik um `ZTV E-StB` ergänzt. Der Wert 2,2 für Frostschutzschichten nach ZTV SoB-StB (Verkehrswegebau) bleibt unberührt. Quelle: ZTV E-StB 17, Verdichtungsanforderungen (Normtext).

**Empfehlung:** freigabefähig nach Korrektur T5-ER-1 und Klärung von T5-ER-2.

- [ ] Modul freigeben

## 8. Glas (`glas`)

**Prüfumfang:** `src/calc/glas.ts` (Weibull, VSG-Schubverbund, thermische Spannung), `src/modules/Glas.tsx`, `content/glas/Glas.json`, Beispiel thermischer Bruch, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| G1 | σ = 45, σ₀ = 1,5 · 45 = 67,5 MPa, m = 7, A = 1 bzw. 4 m² | P_f = 5,685 % bzw. 20,87 % | identisch |
| G2 | VSG 8 + 1,52 + 8, a = 1 m, 20 °C kurz (G = 10 MPa) | I_s = 362,5 mm³; Γ = 0,7099; h_ef,w = 16,02 mm | identisch |
| G3 | wie G2, lang (G = 0,1 MPa) | Γ = 0,0239; h_ef,w = 10,41 mm | identisch |
| G4 | 5 + 1,52 + 5, ω = 0,3 (Kontrollwert der Quelle 8,57 mm) | 8,584 mm | identisch (0,2 %) |
| G5 | ΔT = 40 / 60 K | σ_T = 25,2 / 37,8 N/mm² | identisch |

**Befunde**
- **behoben – T5-GL-1 (Normstand):** DIN 18008-3 und DIN 18008-4 sind seit **2024-12** neu erschienen und ersetzen die Ausgaben 2013-07 ([DIN Media, Teil 3](https://www.dinmedia.de/en/standard/din-18008-3/382246391); [Teil 4](https://en.tienda.aenor.com/norma-din-18008-4-2024-12-382244655)); das Modul nannte „2020-05“.
- **behoben – T5-GL-2 (Bemessungswert):** Der Text wendete k_mod auch auf ESG/TVG an. Nach DIN 18008-1 gilt k_mod nur für Floatglas; für thermisch vorgespanntes Glas f_g,d = k_c·f_g,k/γ_M mit γ_M = 1,5. Text getrennt.
- **offen – Frage T5-GL-3:** Sind DIN 18008-3/-4:2024-12 in der MVV TB bzw. den Landeslisten bereits eingeführt? Sonst den Hinweis „eingeführt ist noch 2013-07“ ergänzen.

**F-Freigabe-Stellen**
- T5-GL-3; Schubmoduln PVB bleiben Lehrwerte (Grenzen).

**Umsetzung 29.10.2026 – T5-GL-3:** Regelwerkseinträge DIN 18008-3/-4:2024-12 ergänzt: „ersetzt 2013-07. Bauaufsichtlich maßgebend ist die in der MVV TB bzw. der Verwaltungsvorschrift des Landes eingeführte Ausgabe – Einführung der Ausgabe 2024-12 prüfen, bis dahin gilt ggf. 2013-07“. Quelle: MVV TB (Einführung prüfen).

**Empfehlung:** freigabefähig nach Korrektur T5-GL-1/-2 und Klärung von T5-GL-3.

- [ ] Modul freigeben

## 9. Stahl (`stahl`)

**Prüfumfang:** `src/calc/werkstoffmodelle.ts` (Brand, Wöhler, Walz- und Schweißeigenspannung, PREN, Gefügeklasse), `src/calc/eisenKohlenstoff.ts` (Fe-C, Hebelgesetz, CEV), `src/modules/Stahl.tsx` mit `src/modules/stahl/*`, `content/stahl/*.json`, Beispiel M_pl,Rd, Grenzen, Lernziele, Kurzfassung. `src/calc/stahlbau.ts` wurde in Tranche 3 geprüft.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| S1 | θ = 550 °C bzw. 750 °C (DIN EN 1993-1-2, Tab. 3.1) | k_y = 0,625 / 0,17; k_E = 0,455 / 0,11 | identisch |
| S2 | Δσ_C = 71, m = 3, Δσ = 100 | Δσ_D = 52,31; Δσ_L = 28,73; N_R = 7,158·10⁵ | identisch |
| S3 | Δσ = 40 (zwischen Δσ_L und Δσ_D) | N_R = 5·10⁶·(52,31/40)⁵ = 1,913·10⁷ | identisch |
| S4 | Walzeigenspannung HEB, f_y = 355 | −177,5 / +88,75 N/mm²; ∫σ dx = 0 | identisch |
| S5 | Schweißen Q = 1 500 J/mm, t = 10 mm | b = 22,5 mm; σ(0) = f_y | identisch |
| S6 | Fe-C: 0,45 % C (Lehrbuch / Callister), 1,2 % C, 3,0 % C | Perlit 55,1 / 58,0 %; Sek.-Zementit 6,81 %; Ledeburit 42,0 %, Sek.-Zementit 12,5 %, Perlit 45,6 % | identisch |
| S7 | CEV C 0,17, Mn 1,4, Cr 0,1, Mo 0,05, V 0,01, Ni 0,1, Cu 0,2 | 0,4553 | identisch |
| S8 | Beispiel IPE 300, S355, M_Ed = 120 kNm | M_pl,Rd = 223,1 kNm; 54 % | richtig |
| S9 | PREN 17 % Cr, 2 % Mo | 23,6 | identisch |

Kurzfassung (S355J2+N, B500A/B/C-Duktilität, CEV-Grenzen S235JR 0,35 / S355J2 0,45 bis 30 mm) und Normstand DIN EN 1993-1-1:2025-04 mit NA:2026-04 ([DIN Media](https://www.dinmedia.de/de/norm/din-en-1993-1-1-na/399086476)), DIN 488-1:2009-08 ([DIN Media](https://www.dinmedia.de/de/norm/din-488-1/117493908)) sind richtig.

**Befunde**
- **behoben – T5-ST-1 (Wärmeeinbringung):** Formel „E_s = η·U·I/v [kJ/mm]“: Mit U in V, I in A und v in mm/s ergibt U·I/v J/mm; für kJ/mm fehlt der Faktor 10⁻³. Außerdem ist η·U·I/v die Wärmeeinbringung Q, nicht die Streckenenergie, und E_s ist im Modul der E-Modul. Neu: Q = k·U·I/v·10⁻³ mit Erläuterung (Streckenenergie E, Wirkungsgrad k nach DIN EN 1011-1; Wirkungsgrade z. B. 0,8 MAG, 1,0 UP, [TWI, Heat input vs. arc energy](https://twi-global.com/technical-knowledge/faqs/faq-what-is-the-difference-between-heat-input-and-arc-energy)). Der Rechner verwendet J/mm (500 … 3 000) und ist nicht betroffen.
- **behoben – T5-ST-2 (Text):** „Vermeidete CO₂-Emissionen durch d. …“, „Es gilt d. Tragsicherheitsnachweis“; Titel DIN 488-1.
- **offen – Frage T5-ST-3 (Verbundbedingungen):** „η₁ = 0,7 für mäßigen Verbund (oberste 25 cm)“ bzw. „gute Verbundbedingungen (untere Bauteilhälfte)“ vereinfacht DIN EN 1992-1-1, 8.4.2 (h ≤ 250 mm stets gut; h > 250 mm: untere 250 mm bzw. mehr als 300 mm unter der Oberseite). Genauer formulieren?
- Hinweis: CO₂-Emissionsbasis 1,8 kg CO₂/kg Baustahl ist ein Lehrwert (Hochofenroute); Profile aus Elektrostahl liegen deutlich darunter (ÖKOBAUDAT).

**F-Freigabe-Stellen** (aus Kern, unverändert)
- CEV-Grenzwerte gegen DIN EN 10025-2:2019-10 (Kern: „vorläufig, F-Freigabe“).

**Umsetzung 29.10.2026 – T5-ST-3:** Verbundbedingungen nach DIN EN 1992-1-1, 8.4.2 (Bild 8.2) ausformuliert: gut bei 45°–90° Neigung; bei flacheren Stäben alle Stäbe für h ≤ 250 mm, für 250 < h ≤ 600 mm die unteren 250 mm, für h > 600 mm Stäbe mindestens 300 mm unter der Oberseite; sonst mäßig (η₁ = 0,7). Quelle: DIN EN 1992-1-1, 8.4.2.

**Empfehlung:** freigabefähig nach Korrektur T5-ST-1/-2 und Klärung von T5-ST-3.

- [ ] Modul freigeben

## 10. Metalle (`metalle`)

**Prüfumfang:** `src/modules/Metalle.tsx`, `content/metalle/Metalle.json` (Steckbriefe von zehn Metallen mit Kennwerten, Beispiel Wärmedehnung, Formeln, Regelwerke), Lernziele.

**Nachrechnungen / Stichprobe**

| Fall | Aussage | Prüfung | Ergebnis |
|---|---|---|---|
| ME1 | Δl bei 6 m und 80 K: Al 11,5, Stahl 5,8, Ti 4,1 mm | 11,52 / 5,76 / 4,13 | richtig |
| ME2 | Kennwerte Dichte/E-Modul (Al 2 700 / 70 000, Edelstahl 7 900 / 200 000, Pb 11 340 / 16 000, Ti 4 500 / 105 000) | Lehrbuchwerte | richtig |
| ME3 | Kupfer E₀ = +0,34 V | Normalpotential Cu²⁺/Cu | richtig |
| ME4 | Titanzink α ≈ 22·10⁻⁶ 1/K (DIN EN 988), Titan 8,6·10⁻⁶ | Lehrbuchwerte | richtig |
| ME5 | CRC II 1.4301, CRC III 1.4404, CRC V 1.4529/1.4565 (DIN EN 1993-1-4) | Lehrbuchwissen | richtig, aber Doppelangabe (T5-ME-1) |
| ME6 | DIN EN 1993-1-4:2026-04 mit NA:2026-11 (Vorabveröffentlichung) | [DIN Media](https://www.dinmedia.de/en/standard/din-en-1993-1-4-na/404391737) | richtig |
| ME7 | DIN EN 1999-1-1:2024-11 | [DIN Media](https://www.dinmedia.de/de/norm/din-en-1999-1-1/356881996), NA vorhanden ([DIN Media](https://www.dinmedia.de/en/standard/din-en-1999-1-1-na/394180706)) | richtig |

**Befunde**
- **behoben – T5-ME-1:** Sphäroguss: verdoppelter, abgebrochener Satz („Weist … und Weist … auf; … als bei Stahl. auf.“). Edelstahl: angehängter Doppelsatz „…; hochlegierte Sonderstähle wie 1.4529 (CRC IV/V) zwingend für Hallenschwimmbäder“ (1.4529 ist CRC V; Aussage stand schon im Satz davor). Zink: doppelter Punkt.
- **behoben – T5-ME-2:** Titan „gegen aggressive Säuren vollkommen resistent“: nicht beständig gegen Flusssäure und heiße, konzentrierte reduzierende Säuren; abgeschwächt.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig nach Korrektur T5-ME-1/-2.

- [ ] Modul freigeben

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage |
|---|---|---|
| T5-PM-5 | Putze & Mörtel | Wasserbedarf je Putzart hinterlegen (Gips ≈ 0,6 l/kg statt pauschal 0,26) oder Zeile entfernen? |
| T5-PM-6 | Putze & Mörtel | Werbende Steckbrief- und Systemtexte sachlich überarbeiten lassen? |
| T5-LE-1 | Lehm | Schätzmodell (Festigkeit 0,7–2,2 N/mm², Sorption ohne Zeitbezug, unwirksame `Math.max`) als Kern mit Quelle, mit Zeitbezug oder auf ρ und λ beschränken? |
| T5-LE-2 | Lehm | Anwendungsgrenzen DIN 18940 (13 m, GK 1–4) und Festigkeitsklassen DIN 18945 am Normtext bestätigen. |
| T5-ER-2 | Erdbau | E_v2/E_v1 ≤ 2,2 oder ≤ 2,3 (2,5) nach ZTV E-StB 17? |
| T5-GL-3 | Glas | DIN 18008-3/-4:2024-12 bauaufsichtlich eingeführt? Sonst Hinweis auf 2013-07. |
| T5-ST-3 | Stahl | Verbundbedingungen η₁ genauer nach DIN EN 1992-1-1, 8.4.2 formulieren? |

## Nachweis der Prüfung

- Unabhängige Nachrechnung: eigenes Skript (Python) mit eigener Umsetzung der Norm- und Modellgleichungen; Vergleich gegen die Kernausgaben (62 Prüfungen in `tests/modulpruefungTranche5.test.ts`), Inline-Rechnungen über die Formeln abgeglichen.
- Neue bzw. geänderte Tests: `tests/moertelbedarf.test.ts` (neu), `tests/erdbau.test.ts` (TA → F2, Fuzz-Monotonie ohne TA), `tests/modulpruefungTranche5.test.ts` (neu).
- Öffentliche Quellen dieser Prüfung: [DIN Media, DIN EN 12620](https://www.dinmedia.de/de/norm/din-en-12620/103098198); [DIN Media, DIN 4226-101:2025-11](https://www.dinmedia.de/de/norm/din-4226-101/391976731); [DIN Media, DIN EN 14411](https://www.dinmedia.de/de/norm/din-en-14411/256449026); [DIN Media, DIN 20000-401 Entwurf](https://www.dinmedia.de/en/draft-standard/din-20000-401/406092747); [DIN Media, DIN 20000-412 Entwurf](https://www.dinmedia.de/de/norm-entwurf/din-20000-412/399667302); [Heidelberg Materials, Mauermörtel](https://www.heidelbergmaterials.de/sites/default/files/assets/document/ef/12/mauermoertel_bro_4s_a4.pdf); [Remmers, TM Sanierputz](https://media.remmers.com/celum/export/documents/TM_0402_de_CH_85532.pdf); [DIN Media, DIN EN 459-1](https://dinmedia.de/en/standard/din-en-459-1/233794596); [DIN Media, DIN 18945](https://www.dinmedia.de/de/norm/din-18945/376331208); [studenten365, Frostempfindlichkeitsklassen](https://studenten365.com/library/lecture/read/438429-warum-sind-bindige-boden-frostgefardet); [Bayern, Einführung ZTV E-StB 17](https://mobilitaet.bayern.de/assets/stmi/vum/strasse/bauunderhalt/49_ztve.pdf); [DIN Media, DIN 18134](https://www.dinmedia.de/de/norm/din-18134/149668370); [DIN Media, DIN 18008-3:2024-12](https://www.dinmedia.de/en/standard/din-18008-3/382246391); [AENOR, DIN 18008-4:2024-12](https://en.tienda.aenor.com/norma-din-18008-4-2024-12-382244655); [DIN Media, DIN EN 1993-1-1/NA:2026-04](https://www.dinmedia.de/de/norm/din-en-1993-1-1-na/399086476); [DIN Media, DIN 488-1](https://www.dinmedia.de/de/norm/din-488-1/117493908); [TWI, Heat input](https://twi-global.com/technical-knowledge/faqs/faq-what-is-the-difference-between-heat-input-and-arc-energy); [DIN Media, DIN EN 1993-1-4/NA:2026-11](https://www.dinmedia.de/en/standard/din-en-1993-1-4-na/404391737); [DIN Media, DIN EN 1999-1-1](https://www.dinmedia.de/de/norm/din-en-1999-1-1/356881996); [DIN Media, DIN EN 1999-1-1/NA](https://www.dinmedia.de/en/standard/din-en-1999-1-1-na/394180706).
