# Gegenprüfung der gewichtigen Korrekturen der Durchsicht vom 29.10.2026

**Stand:** 30.10.2026 (Branch `pruefung/gegenpruefung-10-30`, Basis origin/main mit #282)
**Auftrag:** Unabhängige Gegenprüfung der vier gewichtigen Korrekturen aus `docs/pruefung/durchsicht-{A,B,C,D}-2026-10-29.md` (DSB-LC-1, DSB-BM-1, DSB-BIM-1, DSA-SB-2) und Zufallsstichprobe von fünf weiteren behobenen Befunden. Die Berichte der Durchsicht wurden nicht als Wahrheit genommen: Jeder Punkt wurde mit eigenem Skript bzw. an öffentlichen Quellen neu geprüft. **Prüfvermerke (`src/data/pruefvermerke.ts`), `src/data/gwpLehrwerte.ts` und die Durchsichtsberichte sind nicht geändert.** Regressionstest `tests/gegenpruefung30.test.ts`.

## Ergebnis

| Punkt | Kennung | Modul | Ergebnis | Änderung in diesem PR |
|---|---|---|---|---|
| 1 | DSB-LC-1 | `lca_rechner` (Excel-Download) | **bestätigt** | – (Test ergänzt) |
| 2 | DSB-BM-1 | `boden_materialaufbereitung` | **nicht vollständig bestätigt** – Kopien gleich, aber die neue Fundstelle „GefStoffV § 11a und Anhang II Nr. 1“ ist seit 05.12.2024 überholt; ein angezeigter Hinweis nannte weiter TRGS 519 als Verbotsgrundlage | berichtigt (GC-BM-1, GC-BM-2), dazu `schadstoffe` (GC-SS-1) |
| 3 | DSB-BIM-1 | `bim_baustoffe` | **bestätigt** | – (Test ergänzt) |
| 4 | DSA-SB-2 | `spannbeton_grundlagen` | **bestätigt** (c_min,dur je Klasse und +10 mm für Spannstahl im Verbund) – Fragen zu c_min,b, Δc_dev und −5-mm-Regel | Kern: kein Ergebnis bei ungültiger Eingabe (GC-SB-1) |
| Stichprobe | DSC-RG-1, DSC-BS-1, DSA-SO-1, DSD-MM-1 | `regularien`, `bauschaeden`, `sonderbetone`, `materialmodelle` | **bestätigt** | – |
| Stichprobe | DSB-LC-6 | Nachhaltigkeit (Praxisbeispiel QNG) | **nicht vollständig bestätigt** – Summe im Text berichtigt, Tabellenzeile B6 zeigte weiter 7,75 | berichtigt (GC-LC-6) |

## 1. `lca_rechner` – Excel-Mappe, Blatt „Aufgabe_Studierende“ (DSB-LC-1): bestätigt

**Vorgehen:** Mappe mit dem Generator aus dem Repository erzeugt (`generateTransportbetonExcel` in `src/modules/lca/TransportbetonExcelExport.ts`, Daten `content/lca/TransportbetonExcelExport.json`), mit LibreOffice headless neu berechnet (`soffice --convert-to xlsx`), beide Fassungen mit openpyxl ausgelesen (Formeln bzw. berechnete Werte). Eigenes Prüfskript (Sitzungsablage `scratchpad/gp30/pruef_xl.py`).

- **Zellbezüge:** 26 Formeln im Blatt. Alle 20 Produktformeln `C<n>*D<n>` bzw. `C<n>*F<n>` (Zeilen 19–27, 29) beziehen sich auf die eigene Zeile und auf Zahlenzellen; `SUM(E19:E30)`/`SUM(G19:G30)` umfassen alle Komponenten; G33, E36, G37, G38 beziehen sich auf die richtigen Ergebniszellen. Die Zeilen 28 (Mischwerk 5,2) und 30 (Pumpe 3,5) enthalten Festwerte statt Formeln – gleich EF · Menge (1 m³/m³), kein Fehler.
- **Fehlerwerte:** keine in allen vier Blättern (Blatt 2: 70 Formeln, Blatt 3: 26).
- **Ergebnisse (LibreOffice = eigene Rechnung):** Referenz 247,921, Entwurf 139,5965 kg CO₂-Äq./m³, Minderung 43,69 %, Ersparnis 92,08 t (850 m³). Handrechnung Referenz: 340 · 0,665 + (700 + 1140) · 0,0035 + 2 · 1,65 + 170 · 0,0003 + 5,2 + 18 · 0,185 + 3,5 = 247,921; Entwurf: 290 · 0,40 + 40 · 0,015 + (680 + 700) · 0,0035 + 450 · 0,0018 + 3,2 · 1,65 + 155 · 0,0003 + 5,2 + 3,33 + 3,5 = 139,5965.
- **Selbstkontrolle:** verweist auf G33, F19 bis F21, F27, F22 – richtig. (w/z)_eq des Musterentwurfs = 155/(290 + 0,4 · 40) = 0,507 ≤ 0,55.

Hinweise (kein Fehler, nicht geändert): Bemerkungsspalte „(w/z) = 155 / 290 = 0.53“ nennt den einfachen w/z-Wert neben dem Grenzwert für (w/z)_eq, dazu Dezimalpunkt; „Flugasche oder Gesteinsmehl … k-Wert = 0.4 anrechenbar“ – der k-Wert gilt nur für Flugasche.

## 2. `boden_materialaufbereitung` – Asbest-Rechtslage (DSB-BM-1): nicht vollständig bestätigt

**Bestätigt:** Die angezeigten Behandlungsoptionen stammen aus `content/bodenmaterialaufbereitung/…`; beide Kopien (`content/schadstoffe/…`, ungenutzt) sind gleich (Test der Durchsicht); „ausnahmslos ILLEGAL … in ganz Europa“ ist entfernt. TRGS 519 „Fassung 2014 mit Änderung vom 28.01.2025“ (`schadstoffe`) stimmt: TRGS 519 vom 13.01.2014 (GMBl. 2014 S. 164), Änderungen 2015, 2019, 2022 und 28.01.2025 (GMBl. 2025 S. 144), keine Neufassung ([umwelt-online, TRGS 519](https://umwelt-online.de/recht/t_regeln/trgs/trgs500/519.htm)).

**Nicht bestätigt:**

| Kennung | Befund | Quelle | Änderung |
|---|---|---|---|
| GC-BM-1 | Die neue Fundstelle „GefStoffV § 11a und Anhang II Nr. 1“ (Option Erdaushub/Sand, beide Kopien) ist überholt: Mit der Novelle (in Kraft 05.12.2024) ist **Anhang II Nr. 1 weggefallen**; die Verbote (u. a. Aufbereitung und Wiederverwendung asbesthaltiger natürlicher Rohstoffe > 0,1 M.-%, weitere Verwendung asbesthaltiger Materialien außer zur Abfallbehandlung/-entsorgung) stehen in **§ 11 Abs. 1 „Verwendungs- und Tätigkeitsbeschränkungen für Asbest“**; § 11a regelt die „Anforderungen an Tätigkeiten mit Asbest“ (Gefährdungsbeurteilung, Zulassung, Anzeige, Sachkunde) und enthält kein Verwertungsverbot | [GefStoffV § 11](https://www.gesetze-im-internet.de/gefstoffv_2010/__11.html), [§ 11a](https://www.gesetze-im-internet.de/gefstoffv_2010/__11a.html), Änderungsverordnung 2024 ([umwelt-online](https://umwelt-online.de/recht/gefstoff/gefahrst.vo/z24_0384.htm): „Anhang II Nummer 1 (weggefallen)“) | „GefStoffV § 11 Abs. 1 Nr. 1 und 2 (Verwendungs- und Tätigkeitsbeschränkungen für Asbest; bis 04.12.2024 Anhang II Nr. 1)“ in beiden Kopien |
| GC-BM-2 | Angezeigter Hinweis unter den Behandlungsoptionen (`texte.hinweisZuAsbestFasern`, von DSB-BM-1 nicht erfasst): Zerkleinern und Wiederaufbereiten „stellt … gem. TRGS 519 eine schwerwiegende Ordnungswidrigkeit bzw. Umweltstraftat dar“ – die TRGS 519 regelt Schutzmaßnahmen bei ASI-Arbeiten, das Verbot steht in § 11 GefStoffV, die Sanktionen ergeben sich aus GefStoffV/ChemG (ggf. § 326 StGB) | wie GC-BM-1 | Hinweis: Verbot nach § 11 Abs. 1 GefStoffV, TRGS 519 als Konkretisierung der Schutzmaßnahmen, Sanktionen GefStoffV i. V. m. ChemG, ggf. § 326 StGB |
| GC-SS-1 | `schadstoffe` (angezeigt, nicht Teil von DSB-BM-1): „Tätigkeiten mit Asbest regelt § 11a mit Anhang I Nr. 2“ – Anhang I Nr. 2 betrifft partikelförmige Gefahrstoffe, Asbest steht in Anhang I Nr. 3 (§ 11a verweist auf Nr. 3.2 bis 3.8) | [§ 11a](https://www.gesetze-im-internet.de/gefstoffv_2010/__11a.html), Änderungsverordnung 2024 | „Verbote und zulässige Tätigkeiten mit Asbest regelt § 11, die Anforderungen an diese Tätigkeiten § 11a mit Anhang I Nr. 3“ |

**Bedarf außerhalb dieses PR (nur gemeldet):**
- `src/data/quiz.json`, Frage zum Vermischungsverbot (`quelle`: „KrWG § 9a; GefStoffV Anhang II Nr. 1; AVV 17 06 05*“) – Frage und Antwort bleiben richtig, nur die Quellangabe ist überholt (→ „GefStoffV § 11“). Nicht geändert (Frage wird nicht falsch).
- `content/rueckbau/AktualitaetTab.json`: „Risikobasiertes Maßnahmenkonzept (GefStoffV Anhang I Nr. 2, TRGS 519)“ – für Asbest vermutlich Anhang I Nr. 3; bei der Durchsicht von `rueckbau` am Verordnungstext prüfen.

## 3. `bim_baustoffe` – Baustahl S355 (DSB-BIM-1): bestätigt

Eigenes Skript (`scratchpad/gp30/bim.ts`) über die Inhaltsdaten und den zentralen Lehrwert: `GWP_LEHRWERTE.profilstahl` = 1100 kg CO₂-Äq./t, Rohdichte 7850 kg/m³ → 1,1 · 7850 = **8635 kg CO₂-Äq./m³** (Faktor 1,72 gegenüber 0,64 kg/kg = 5024 kg/m³, vorher „5000“). Inhalts-JSON und die zur Laufzeit gebildete Voreinstellung stimmen überein (8635). Folgewerte: Wert liegt im GWP-Regler für Stahl (2000–10 000, Schritt 5, auf dem Raster); er fließt nur in die IFC-Ausgabe `GWP_A1_A3`. Keine Quizfrage und keine Beispielrechnung des Moduls nutzt den Stahlwert (geprüft: `q_dg_bim_1/2`, `qn_bim_baustoffe_1` bis `_4`); Test T14 (BIM3) prüft 1,1 kg/kg.

Hinweise (nicht geändert): Die im Lehrwert genannte Spanne reicht bis rund 2,9 kg/kg (≈ 22 800 kg/m³), der Regler endet bei 10 000. Beton-Voreinstellung 243 liegt nicht auf dem 5er-Raster des Reglers (10–400, Schritt 5); der Regler zeigt dann 245, die IFC-Ausgabe 243.

## 4. `spannbeton_grundlagen` – Kern `spanngliedDeckung` (DSA-SB-2): bestätigt, mit Fragen

Eigenes Skript (`scratchpad/gp30/spann.ts`) mit **eigener** Tabelle für Spannstahl (nicht aus dem Kern): 8640 Kombinationen (Bauwerk × Verfahren × XC × XD × Betonklasse × Hüllrohr 40/60/75/80/81/100 mm × Litze 9,3/12,5/15,7 mm), **0 Abweichungen**.

- **c_min,dur (Hochbau, ohne Zu-/Abschläge):** Spannstahl im Verbund XC1 20, XC2/XC3 30, XC4 35, XD1–XD3 50 mm = Betonstahl Tab. 4.4DE (10/20/25/40) + 10 mm – wie die NA-Werte für Spannstahl in öffentlicher Sekundärliteratur ([FRILO, Dauerhaftigkeit, Kriechzahl und Schwindmaß](https://www.frilo.eu/wp-content/uploads/DE/Manuals/dauerhaftigkeit-kriechzahl_und_schwindmass.pdf): Spannstahl 20/30/35/40/45/50 mm mit c_dur,add 10/5/0 für XD1/XD2/XD3, also 50 mm in allen XD-Klassen). Kombination XC + XD maßgebend als Maximum – richtig. Ohne Verbund: Betonstahlwert ohne +10 mm (Lehrannahme, ETA maßgebend).
- **Grenzfälle:** Hüllrohr 80/81/120 mm → c_min,b = 80 mm (Begrenzung nach 4.4.1.2(3)); c_min ≥ 10 mm; Δc_dev 10 mm nur Hochbau XC1.
- **Behoben – GC-SB-1:** Bei ungültiger Eingabe (Hüllrohr 0 mm oder negativ) lieferte der Kern trotz `gueltig = false` ein Zahlenergebnis (c_nom = 30 mm aus c_min,dur). Jetzt kein Ergebnis (NaN), wie in den übrigen Kernen. In der Anzeige nicht erreichbar (Auswahllisten), daher ohne Anzeigeänderung.

**Fragen mit Vorschlag** (Normtext; nicht geändert, da nur Sekundärquelle):

| Kennung | Frage | Vorschlag |
|---|---|---|
| GC-SB-2 (Normtext) | c_min,b im sofortigen Verbund: Kern 2,0 · Ø „nach 4.4.1.2(3)“. Die EN-Empfehlung ist 1,5 · Ø (Litze), nach der Sekundärquelle (FRILO) gibt der NA DE 2,5 · Ø für Litzen und 3,0 · Ø für profilierte Drähte an, 2,0 · Ø bzw. 2,5 · Ø nur bei σ_p0 ≤ 1000 N/mm². Für Litze 15,7 mm ergäbe das c_min,b = 39 statt 31 mm (c_nom 54 statt 46 mm im Beispiel „Spannbett“) – der Kern läge auf der unsicheren Seite | Am NA prüfen; dann 2,5 · Ø (Litzen) als Regelwert, 2,0 · Ø nur mit Schalter σ_p0 ≤ 1000 N/mm²; bis dahin Kennzeichnung „vorläufig, Normprüfung ausstehend“ an c_min,b ergänzen |
| GC-SB-3 (Normtext) | Δc_dev: Kern 15 mm auch, wenn c_min,b maßgebend ist; nach der Sekundärquelle erlaubt der NA DE dann 10 mm (Standardfall Hüllrohr 75 mm: c_nom 85 statt 90 mm, konservativ) | Am NA 4.4.1.3 prüfen; ggf. Δc_dev = 10 mm bei maßgebendem c_min,b |
| GC-SB-4 (Normtext, ergänzt DSA-SB-2a) | Abzug −5 mm: Kern pauschal für C45/55 und C50/60, auch in XC1. Nach der bekannten Regel (DIN 1045-1, Tab. 4, Fußnote; im NA DE übernommen) darf um 5 mm vermindert werden, wenn die Festigkeitsklasse mindestens zwei Klassen über der Mindestfestigkeitsklasse liegt, **nicht bei XC1** (Kern im Hochbau XC1: c_min,dur 15 statt 20 mm, 8 von 8640 Fällen; im Bauteil maßgebend meist c_min,b) | Mit DSA-SB-2a am Normtext klären; dann Abzug aus „Mindestklasse + 2“ je Expositionsklasse bilden und für XC1 ausschließen |

## Stichprobe von fünf weiteren behobenen Befunden

Auswahl per Zufall (`random.Random(20261030).sample`) aus 57 behobenen Befunden der Berichte A–D (ohne die vier gewichtigen): DSC-RG-1, DSA-SO-1, DSC-BS-1, DSB-LC-6, DSD-MM-1.

| Kennung | Modul | Prüfung | Ergebnis |
|---|---|---|---|
| DSC-RG-1 | `regularien` | Text: Entwurf zum BGB-Bauvertragsrecht seit 26.10.2026 in der Anhörung von Ländern und Verbänden, ohne Kabinettsbeschluss. Gegen [CMS, Legal Update vom 28.10.2026](https://cms.law/de/deu/legal-updates/gebaeudetyp-e-neuer-referentenentwurf-und-folgen-fuer-bauvertraege): Referentenentwurf (BMJV) nach längerer Abstimmung veröffentlicht, Stellungnahmen bis 09.11.2026, kein Kabinettsbeschluss | bestätigt |
| DSC-BS-1 | `bauschaeden` | gleicher Sachstand (Kabinettsentwurf 06.11.2024 erledigt, Eckpunkte 20.11.2025, neuer Entwurf 26.10.2026) | bestätigt |
| DSA-SO-1 | `sonderbetone` | U = 1/(0,17 + 0,50/λ): λ 0,12 → 0,231, λ 0,18 → 0,339 W/(m²K) (Text „0,23 bis 0,34“); 40 cm, λ 0,12 → 0,285 | bestätigt |
| DSB-LC-6 | Nachhaltigkeit, Praxisbeispiel QNG | 705/(1200 · 50) = 11,75; 180/(1200 · 50) = 3,00; 18 · 0,43 = 7,74; Summe 22,49; Anteile 52/13/34 % richtig. **Aber:** die Ergebnistabelle (`AnhangPraxisbeispiele.tsx`) zeigte für B6 weiter **7,75** (Ursache der früheren 22,50) | nicht vollständig bestätigt → **GC-LC-6** behoben (7,74) |
| DSD-MM-1 | `materialmodelle` | Diff des Durchsicht-Commits: B500B 500/200 000, S355 355/210 000, S235 235/210 000 durch `BETONSTAHL.B500B.fyk`, `BAUSTAHL_EC3`, `E_BETONSTAHL`, `E_BAUSTAHL` ersetzt; Konstanten haben dieselben Werte | bestätigt (ohne Wertänderung) |

Die zum Sachstand Gebäudetyp E offene Bewertung der Durchsicht (Fachklärung 26.10.2026) bleibt gültig; Paragrafen des Entwurfs sind weiter nicht öffentlich.

## Geänderte Dateien

| Datei | Kennung |
|---|---|
| `content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json` | GC-BM-1, GC-BM-2 |
| `content/schadstoffe/Schadstoffe.json` | GC-BM-1 (Kopie gleich gehalten), GC-SS-1 |
| `src/calc/spannbeton.ts` | GC-SB-1 |
| `src/modules/nachhaltigkeit/AnhangPraxisbeispiele.tsx` | GC-LC-6 |
| `tests/gegenpruefung30.test.ts` | Regressionstest aller vier Punkte und GC-LC-6 |

## Nachweis

- Prüfskripte (Sitzungsablage, nicht im Repository): `scratchpad/gp30/pruef_xl.py` (Formeln/Zellbezüge, LibreOffice-Werte, eigene Rechnung), `scratchpad/gp30/bim.ts`, `scratchpad/gp30/spann.ts` (8640 Fälle, Grenzfälle).
- Quellen der Webrecherche: [GefStoffV § 11](https://www.gesetze-im-internet.de/gefstoffv_2010/__11.html), [GefStoffV § 11a](https://www.gesetze-im-internet.de/gefstoffv_2010/__11a.html), [Änderungsverordnung 2024 (umwelt-online)](https://umwelt-online.de/recht/gefstoff/gefahrst.vo/z24_0384.htm), [TRGS 519 (umwelt-online)](https://umwelt-online.de/recht/t_regeln/trgs/trgs500/519.htm), [FRILO-Handbuch Dauerhaftigkeit](https://www.frilo.eu/wp-content/uploads/DE/Manuals/dauerhaftigkeit-kriechzahl_und_schwindmass.pdf), [CMS Legal Update 28.10.2026](https://cms.law/de/deu/legal-updates/gebaeudetyp-e-neuer-referentenentwurf-und-folgen-fuer-bauvertraege). Nicht abrufbar: BAuA-Seite TRGS 519 (Fehler der Seite), urteile-gesetze.de (robots).
