# Prüfung der Paragrafenzitate – Fachfehler aus dem Gutachten 29.10.2026 und app-weite Zitatprüfung

**Stand:** 29.10.2026 (Branch `audit/fachfehler-paragrafen-10-29`, Basis origin/main 5e021ebd)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt. Prüfvermerke (`src/data/pruefvermerke.ts`) wurden nicht geändert.

## 1. Fachfehler aus dem Gutachten 29.10.2026 (behoben)

| Nr. | Fundstelle | vorher | nachher | Begründung |
|---|---|---|---|---|
| G-1 | `src/modules/bpverkehrswegebau/RstoRechnerTab.tsx:68` | „Bk100 (z. B. Fernbahnen, Autobahnen, …)“ | „Bk100 (z. B. hochbelastete Autobahnabschnitte, extreme Belastung)“ | Die RStO 12 gelten für den Oberbau von Verkehrsflächen des Straßenverkehrs, nicht für Bahnstrecken. |
| G-2 | `content/bpverkehrswegebau/daten.json:51` | „Splittmastix- / Beton-Asphalt“ | „Splittmastixasphalt bzw. Asphaltbeton“ | Der Fachbegriff ist Asphaltbeton (AC nach TL Asphalt-StB); „Beton-Asphalt“ gibt es nicht. |
| G-3 | `content/rueckbau/Rueckbau.json:16` | „Vermischungsverbot, § 9 Abs. 2 KrWG / GewAbfV“ | „Getrennthaltung nach § 9 KrWG und GewAbfV, Vermischungsverbot nach § 9a KrWG“ | Seit der KrWG-Novelle 2020 steht das Vermischungsverbot in § 9a („Vermischungsverbot und Behandlung gefährlicher Abfälle“); § 9 regelt die getrennte Sammlung (gesetze-im-internet.de, KrWG). |
| G-4 | `content/rueckbau/Rueckbau.json:17` | „Bauschutt gilt abfallrechtlich nach dem Vermischungsverbot bereits als kontaminiert, wenn …“ | „Werden Schadstoffe (z. B. asbesthaltiger Putz, PAK-haltiger Kleber, teerhaltige Abdichtungen) vor dem Abbruch nicht ausgebaut, wird mineralischer Bauschutt mit gefährlichen Abfällen vermischt – das verbietet § 9a KrWG. Das Gemisch ist dann je nach Schadstoffgehalt als gefährlicher Abfall einzustufen (AVV-Spiegeleintrag, z. B. 17 01 06*) und für eine hochwertige Verwertung als Ersatzbaustoff meist verloren.“ | Das Vermischungsverbot macht Bauschutt nicht „kontaminiert“; es verbietet die Vermischung gefährlicher Abfälle. Die Einstufung folgt dem Schadstoffgehalt (Spiegeleintrag). Bitumen allein ist kein Schadstoff; gemeint sind teerhaltige (PAK-) Abdichtungen. |

## 2. Vorgehen der Zitatprüfung

- **Inventar:** `node scripts/qa/paragrafen-zitate.mjs [--json datei] [--md datei] [--alle]` durchsucht `content/` und `src/` (einschließlich `src/data/quiz.json`) nach Zitatkernen (§, §§, Art., Artikel, Anlage, Anhang mit Abs./Satz/Nr./lit.) und ordnet sie dem Gesetz in unmittelbarer Nähe zu (vorangestellt „BGB § 633“ oder in den folgenden 60 Zeichen). Ergebnis: **316 verschiedene Zitate mit 891 Fundstellen** zu 47 Gesetzen/Verordnungen. Mit `--alle` kommen 151 Zitatkerne ohne erkennbares Gesetz hinzu (zusammen 1315 Fundstellen); das sind überwiegend Anhänge von Normen (DIN/EN) und Kurzverweise innerhalb eines Absatzes („§ 4 Abs. 3“ nach vorher genanntem VOB/B). Diese wurden stichprobenartig gesichtet; Befunde daraus sind in Abschnitt 3 enthalten (z. B. GefStoffV, DepV, VOB/B).
- **Zuordnung:** Die automatische Zuordnung ist an wenigen Stellen unscharf (z. B. „KI-VO Art. 50“ neben „DSGVO“). Solche Zeilen sind in der Tabelle als „Skriptzuordnung: …“ mit dem tatsächlichen Gesetz vermerkt.
- **Prüfung:** Jedes Zitat wurde auf Plausibilität geprüft (Gliederung und Inhalt des zitierten Paragrafen bzw. Artikels). Gegen den abgerufenen aktuellen Text geprüft wurden die häufigsten bzw. riskantesten Gruppen: KrWG, GewAbfV, GefStoffV § 11a, EBV § 22, BBodSchV 2023, DepV, GModG (Fassung ab 29.07.2026, Überschriften), BauPVO Art. 75, BayDSchG – **130 der 316 Zitate**. Die übrigen 186 (u. a. BGB, VOB/A/B, HOAI, MBO/BayBO, DSGVO, UrhG, KI-VO, TrinkwV) wurden aus Kenntnis der Gesetzesgliederung plausibilisiert, ohne Abruf (Kontingent).
- **GEG → GModG:** Zitate des GEG sind nur noch als frühere Fassung zulässig („vormals“, „a. F.“, „GModG/GEG“). Die Überschriften der in der App zitierten GModG-Paragrafen und -Anlagen stimmen mit der Fassung ab 29.07.2026 überein (§§ 11, 14, 15, 16, 20, 22, 35–39, 42a, 43, 69, 79–88, 105; Anlagen 1, 4, 7, 8, 9, 10; § 72 weggefallen). Zwei Textstellen mit „GEG Anlage 10“ ohne Kennzeichnung wurden umgestellt. Inhalte der zweiten Stufe (01.01.2027) sind im abgerufenen Text nicht enthalten (siehe F-2).
- **Nicht geprüft:** VOB/A 2026 (BAnz AT 24.08.2026) und der Digital Omnibus zur KI-VO (VO (EU) 2026/1744) – Angaben unverändert gelassen.

## 3. Korrigierte Zitate (eindeutige Fehler)

| Nr. | Fundstelle | vorher | nachher | Quelle |
|---|---|---|---|---|
| P-1 | `src/components/ui/RechtsrahmenKompendium.tsx:436` | Zielvorgabe § 14 Abs. 3 KrWG (70 %) | § 14 Abs. 2 KrWG | KrWG, gesetze-im-internet.de: 70-Gew.-%-Ziel steht in § 14 Abs. 2 |
| P-2 | `content/abfaelle/Altlasten.json:21` | Physikalischer Bodenschutz auf Baustellen (§ 17 BBodSchV) | (§ 4 Abs. 5 BBodSchV, DIN 19639) | BBodSchV 2023: § 17 = Sanierungsmaßnahmen; § 4 Abs. 5 = bodenkundliche Baubegleitung nach DIN 19639 (> 3 000 m²) |
| P-3 | `content/abfaelle/Checklisten.json` (ref) | AVV Anhang 1 Kapitel 17 | AVV Anlage (Abfallverzeichnis) Kapitel 17 | Das Abfallverzeichnis ist die Anlage zu § 2 Abs. 1 AVV |
| P-4 | `content/abfaelle/Checklisten.json` (2 ref) | EBV Anhang 1 Tabellen; EBV § 19 & Anhang 2 | EBV Anlage 1 Tabellen; EBV § 19 & Anlage 2 | EBV gliedert in Anlagen (Anlage 1 Materialwerte, Anlage 2 Einbauweisen) |
| P-5 | `content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json:166, 274`; `content/schadstoffe/Schadstoffe.json:343, 451` | BBodSchV Anh. 1; EBV Anhang 1 | BBodSchV Anlage 1; EBV Anlage 1 | BBodSchV 2023: Anlage 1 „Vorsorgewerte und Werte zur Beurteilung von Materialien“ |
| P-6 | `content/schadstoffe/Schadstoffe.json:373` | GefStoffV § 11 (Asbest-Verwertungsverbot) | GefStoffV § 11a und Anhang II Nr. 1 | § 11a = Anforderungen an Tätigkeiten mit Asbest; Verwendungsverbot Anhang II Nr. 1 (wie Quiz `q_ab_7`: „GefStoffV Anhang II“) |
| P-7 | `content/abfaelle/Deponie.json:162` | § 5 DepV sowie DepV Anhang 1 i. V. m. TA Abfall | § 3 DepV (Errichtung) sowie DepV Anhang 1 (Standort, geologische Barriere); TA Abfall durch DepV abgelöst | DepV: § 5 = Inbetriebnahme; geologische Barriere § 3 mit Anhang 1 |
| P-8 | `content/abfaelle/Deponie.json:186` | § 12 - 14 DepV (Abschluss, Nachsorge und Monitoring) | §§ 10–13 DepV (Stilllegung, Nachsorge, Kontrolle von Emissionen, Information und Dokumentation) | DepV: § 14 gehört zu Teil 3 (Deponieersatzbaustoffe) |
| P-9 | `content/abfaelle/Deponie.json:34` | Aufbau- und Barriereprinzip (§ 3-14 DepV) | (§ 3 und Anhang 1 DepV) | wie P-7 |
| P-10 | `content/abfaelle/Checklisten.json:188` | Eingangskontrolle am Deponietor: DepV § 12 | DepV § 8 (Annahmeverfahren) | DepV § 12 = Emissionskontrolle; Annahmekontrolle gehört zu § 8 |
| P-11 | `src/data/moduleOverviewsData.ts:341` | VOB/B § 4 Nr. 2 | VOB/B § 4 Abs. 2 | Zählung „Nr.“ gilt nur für Fassungen vor 2006 |
| P-12 | `content/ki/ueberblick/daten.json:67–68` | „vertraglichen Pönalen nach VOB/B § 5“; normRef VOB/B § 5 | Ausführungsfristen § 5, Vertragsstrafe § 11 VOB/B | Vertragsstrafe ist in § 11 VOB/B geregelt |
| P-13 | `content/ki/ueberblick/daten.json:473` | „HOAI § 634 BGB“ | „HOAI, § 634 BGB“ | § 634 gehört zum BGB |
| P-14 | `content/ki/ueberblick/daten.json:48` | MBO § 33 (Lauflänge ≤ 35 m) | MBO §§ 33, 35 | Lauflänge zum notwendigen Treppenraum: § 35 Abs. 2 MBO |
| P-15 | `src/data/erkundung.ts:143`; `src/calc/energieausweis.ts:10, 78` (Kommentar) | GEG Anlage 10 | GModG Anlage 10 (vormals GEG) | GModG seit 29.07.2026, Anlage 10 unverändert „Energieeffizienzklassen von Wohngebäuden“ |
| P-16 | `src/data/quiz.json` `q_rc_4` (Distraktor-Rückmeldung) | „Teil 3 der GewAbfV … (§§ 8 bis 10)“ | „Abschnitt 3 der GewAbfV … (§§ 8 und 9)“ | GewAbfV: Abschnitt 3 umfasst §§ 8 und 9; § 10 gehört zu Abschnitt 4. Frage auf `verified: false` gesetzt, Antwort unverändert, `vorpruefung.hinweis` „Umsetzung 29.10.: … – korrigiert“; Prüflisten neu erzeugt (`docs/pruefung/quiz-cluster-IV.md`). |

## 4. Offene Fragen mit Vorschlag

| Nr. | Fundstelle | Befund | Vorschlag |
|---|---|---|---|
| F-1 | `content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json:166`, `content/schadstoffe/Schadstoffe.json:343` | „EBV § 15 & BBodSchV Anlage 1: Gereinigte Sande … Einbauklasse BM-0 oder RC-1“ – § 15 EBV als Fundstelle für die Einstufung gereinigter Sande ist nicht belegt; gereinigter Boden ist Bodenmaterial, kein Recycling-Baustoff (RC). | „EBV Anlage 1 Tabelle 3 (Bodenmaterial) & BBodSchV Anlage 1: … Einbauklasse BM-0 bzw. BM-0*“; RC-1 streichen. |
| F-2 | `content/energieausweis/Energieausweis.json:159` | „Anlage 10a GModG“ (Effizienzklassen Nichtwohngebäude ab 01.01.2027) ist in der abgerufenen Fassung ab 29.07.2026 nicht enthalten (zweite Stufe). | Gegen die Fassung ab 01.01.2027 (Art. 4 G v. 23.07.2026, BGBl. 2026 I Nr. 226) prüfen; bis dahin „vorläufig, F-Freigabe“ ergänzen. |
| F-3 | `content/moduleinfo/daten.json:806`, `src/components/ui/RechtsrahmenKompendium.tsx:336` | „verpflichtend 18 Monate nach dem delegierten Rechtsakt nach Art. 75 VO (EU) 2024/3110“ – Art. 75 Abs. 1 (delegierte Rechtsakte zum DPP-System) bestätigt, eine 18-Monats-Frist steht dort nicht. | Fundstelle der Frist ermitteln (Art. 76 ff. bzw. Schlussbestimmungen) oder den Satz auf „über delegierte Rechtsakte nach Art. 75“ kürzen. |
| F-4 | `content/feedback/Feedback.json:53`, `src/data/lizenz.ts:5` | BayHIG Art. 18 wird einmal als „Evaluation und Qualitätssicherung“, einmal als „Satz 3: vermögensrechtliche Befugnisse“ zitiert – eine der beiden Angaben ist falsch. | Gegen gesetze-bayern.de (BayHIG) prüfen und eine Stelle berichtigen. |
| F-5 | `content/ki/ueberblick/daten.json:185` | „Baugrundrisiken nach § 644 BGB“ – § 644 regelt die Gefahrtragung bis zur Abnahme; das Baugrundrisiko wird überwiegend über § 645 BGB (vom Besteller gelieferter Stoff) dem Besteller zugeordnet. | „Baugrundrisiken, die grundsätzlich der Besteller trägt (§§ 644, 645 BGB)“. |
| F-6 | `content/abfaelle/Checklisten.json:5` | „Abfalleinstufung (§ 3, 5, 8 KrWG & AVV)“ – § 8 KrWG regelt Rangfolge und Hochwertigkeit der Verwertung, nicht die Einstufung. | „Abfalleinstufung (§§ 3–5 KrWG, § 3 AVV)“. |

## 5. Quellen (abgerufen 29.10.2026, nur aus Suchergebnissen)

- KrWG Volltext: https://www.gesetze-im-internet.de/krwg/BJNR021210012.html
- GewAbfV Volltext: https://www.gesetze-im-internet.de/gewabfv_2017/BJNR089600017.html
- GefStoffV § 11a: https://lxgesetze.de/gefstoffv/11a
- EBV § 22: https://lexmea.de/de/gesetz/ersatzbaustoffv/22
- BBodSchV 2023 Inhaltsübersicht: https://www.gesetze-im-internet.de/bbodschv_2023/index.html; § 4: https://www.gesetze-im-internet.de/bbodschv_2023/__4.html; Anlage 2: https://gesetze.legal/bund/bbodschv/anlage_2
- DepV Inhaltsübersicht: https://www.gesetze-im-internet.de/depv_2009/inhalts_bersicht.html
- GModG (Fassung ab 29.07.2026): https://www.gesetze-im-internet.de/geg/GModG.pdf
- BauPVO Art. 75: https://gesetze.legal/eu/vo_eu_2024_3110/75
- BayDSchG: https://www.gesetze-bayern.de/Content/Document/BayDSchG/true
- Nicht abrufbar (Weiterleitung ohne Freigabe): BMUV-Text der Mantelverordnung (mantelv_text.pdf) – EBV §§ 19, 25 daher nur plausibilisiert (Vorprüfung AP 9).

## 6. Zitattabelle

Erzeugt aus `node scripts/qa/paragrafen-zitate.mjs --json …` (Stand nach den Korrekturen). „bestätigt“ = gegen den abgerufenen Text geprüft; „plausibel“ = Gliederung und Inhalt stimmen nach Kenntnisstand, ohne Abruf.

| Zitat | Fundstellen | geprüft gegen | Ergebnis |
|---|---|---|---|
| § 2 AltholzV | content/altholzurbanmining/AltholzUrbanMining.json:15,125<br>src/calc/altholz.ts:5<br>src/data/quiz.json:8625,8651,8965,8974,8994<br>src/modules/AltholzUrbanMining.tsx:31 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 2 Nr. 4 AltholzV | content/altholzurbanmining/AltholzUrbanMining.json:16 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 3 AltholzV | src/data/quiz.json:9009,9018,9038 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 3 AVV | src/data/quiz.json:8582,8591,8608<br>src/data/tasks/rueckbauTasks.ts:42 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 10 BauGB | content/regularien/Regularien.json:256 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 31 BauGB | content/regularien/Regularien.json:173 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 34 BauGB | src/data/quiz.json:8672 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 35 BauGB | src/data/quiz.json:8672 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 4 und 6 BauPVO 2024/3110 | content/regularien/Regularien.json:393 | gesetze.legal Art. 75 VO (EU) 2024/3110 | Zitat bezieht sich auf VO (EU) 305/2011 (Leistungserklärung) – plausibel |
| Art. 75 BauPVO 2024/3110 | content/moduleinfo/daten.json:806 | gesetze.legal Art. 75 VO (EU) 2024/3110 | bestätigt (delegierte Rechtsakte DPP-System); „18 Monate“: Frage F-3 |
| Art. 75 Abs. 1 BauPVO 2024/3110 | src/components/ui/RechtsrahmenKompendium.tsx:336 | gesetze.legal Art. 75 VO (EU) 2024/3110 | bestätigt; „18 Monate“: Frage F-3 |
| § 3 BaustellV | content/rueckbauchecklisten/RueckbauChecklisten.json:84 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 14 BayBGG | content/barrierefreiheit/Barrierefreiheit.json:4<br>src/modules/Barrierefreiheit.tsx:7 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 3 BayBO | content/moduleinfo/daten.json:547<br>content/zustandsbewertung/Zustandsbewertung.json:51 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 20 BayBO | src/data/quiz.json:1138,1164 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 54 BayBO | content/schaedenchecklisten/SchaedenChecklisten.json:73 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 57 Abs. 5 BayBO | content/rueckbau/Rueckbau.json:32 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 63 BayBO | content/bauschaeden/Bauschaeden.json:37 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 81 BayBO | content/regularien/Regularien.json:264 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 81a BayBO | content/regularien/Regularien.json:229 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 9 Abs. 1 BayDiV | content/barrierefreiheit/Barrierefreiheit.json:5,42<br>src/modules/Barrierefreiheit.tsx:7 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 9 Abs. 4 BayDiV | content/barrierefreiheit/Barrierefreiheit.json:15 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 11 Abs. 2 BayDiV | content/barrierefreiheit/Barrierefreiheit.json:15 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 9 bis 11 BayDiV | content/barrierefreiheit/Barrierefreiheit.json:4 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 9–11 BayDiV | src/modules/Barrierefreiheit.tsx:7 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 2 BayDSchG | content/denkmalpflege/Denkmalpflege.json:25,28<br>src/data/quiz.json:41409,41422 | gesetze-bayern.de BayDSchG (Stand 01.05.2026) | bestätigt |
| Art. 6 BayDSchG | content/denkmalpflege/Denkmalpflege.json:35,76 | gesetze-bayern.de BayDSchG (Stand 01.05.2026) | bestätigt |
| Art. 6 Abs. 1 BayDSchG | content/denkmalpflege/Denkmalpflege.json:30 | gesetze-bayern.de BayDSchG (Stand 01.05.2026) | bestätigt |
| Art. 7 und 8 BayDSchG | src/data/quiz.json:41359 | gesetze-bayern.de BayDSchG (Stand 01.05.2026) | bestätigt |
| Art. 9 BayDSchG | content/denkmalpflege/Denkmalpflege.json:48,50 | gesetze-bayern.de BayDSchG (Stand 01.05.2026) | bestätigt (Schatzregal) |
| Art. 20 BayDSchG | content/denkmalpflege/Denkmalpflege.json:29 | gesetze-bayern.de BayDSchG (Stand 01.05.2026) | bestätigt (Ordnungswidrigkeiten, bis 5 Mio. €) |
| Art. 2 BayHIG | src/modules/Datenschutz.tsx:101,124 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 18 BayHIG | content/feedback/Feedback.json:53 | Plausibilität (Gliederung des Gesetzes), kein Abruf | Frage F-4 (zwei verschiedene Inhalte für Art. 18) |
| Art. 18 Satz 3 BayHIG | src/data/lizenz.ts:5 | Plausibilität (Gliederung des Gesetzes), kein Abruf | Frage F-4 |
| § 2 Abs. 5 BBodSchG | src/data/quiz.json:8668,8669,8694 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 4 Abs. 5 BBodSchV | content/abfaelle/Altlasten.json:21 | gii BBodSchV 2023 (Inhaltsübersicht, § 4); gesetze.legal Anlage 2 | korrigiert (vorher „§ 17 BBodSchV“ = Sanierungsmaßnahmen); bodenkundliche Baubegleitung nach DIN 19639 |
| § 21 BBodSchV | content/abfaelle/LagaPn98.json:28 | gii BBodSchV 2023 (Inhaltsübersicht, § 4); gesetze.legal Anlage 2 | bestätigt (Probennahme aus Haufwerken) |
| §§ 18–24 BBodSchV | content/abfaelle/LagaPn98.json:28 | gii BBodSchV 2023 (Inhaltsübersicht, § 4); gesetze.legal Anlage 2 | bestätigt (Abschnitt 4 Vorerkundung, Probennahme, Analyse) |
| Anlage 1 BBodSchV | content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json:166<br>content/schadstoffe/Schadstoffe.json:343 | gii BBodSchV 2023 (Inhaltsübersicht, § 4); gesetze.legal Anlage 2 | korrigiert (vorher „Anh. 1“); Bezug zu EBV § 15 siehe F-1 |
| Anlage 2 Tab. 2 BBodSchV | content/abfaelle/Altlasten.json:123 | gii BBodSchV 2023 (Inhaltsübersicht, § 4); gesetze.legal Anlage 2 | bestätigt (Sickerwasser anorganisch; PFAS Tab. 3) |
| Anlage 2 Tab. 4 BBodSchV | content/abfaelle/Altlasten.json:67,81 | gii BBodSchV 2023 (Inhaltsübersicht, § 4); gesetze.legal Anlage 2 | bestätigt (Boden-Mensch; Cd 2,0 als Fußnote) |
| Anlage 2 Tab. 4) BBodSchV | content/abfaelle/Altlasten.json:95,109 | gii BBodSchV 2023 (Inhaltsübersicht, § 4); gesetze.legal Anlage 2 | bestätigt |
| Anlage 2 Tab. 6 BBodSchV | content/abfaelle/Altlasten.json:139 | gii BBodSchV 2023 (Inhaltsübersicht, § 4); gesetze.legal Anlage 2 | bestätigt (Cd 0,04 Maßnahmenwert) |
| Anlage 3 BBodSchV | content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json:144 | gii BBodSchV 2023 (Inhaltsübersicht, § 4); gesetze.legal Anlage 2 | bestätigt (Untersuchungsverfahren) |
| § 13 BGB | content/schaedenchecklisten/SchaedenChecklisten.json:58 | Plausibilität (Gliederung des Gesetzes), kein Abruf | Skriptzuordnung: VOB/B § 13 – plausibel |
| § 195 BGB | src/data/quiz.json:10673,22057 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 203 BGB | content/regularien/Regularien.json:76 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 204 Abs. 1 Nr. 7 BGB | content/bauschaeden/Bauschaeden.json:88,246<br>src/data/quiz.json:10870,10879,10891,10896 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 438 BGB | src/data/quiz.json:2340 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 555b BGB | content/modernisierung/Modernisierung.json:13,21 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 631 BGB | content/ki/FehlerRechtEthik.json:32<br>src/data/kurzfassung.ts:66 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 633 BGB | content/bauschaeden/Bauschaeden.json:7<br>content/fortbildungen/Fortbildungen.json:363<br>content/ki/FehlerRechtEthik.json:36<br>content/kibaustoffe/KiBaustoffe.json:128<br>content/nachhaltigkeit/PraxisGebaeudetypE.json:7<br>content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json:121<br>+ 7 weitere Dateien | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 634 BGB | content/ki/ueberblick/daten.json:118,473,761,822<br>src/data/kurzfassung.ts:152 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 634a BGB | content/bauschaeden/Bauschaeden.json:18<br>content/bpinnovationen/BpInnovationen.json:25<br>content/regularien/Regularien.json:75,292<br>src/data/quiz.json:2327,2336,2340,10657,22041,22050 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 634a Abs. 1 Nr. 1 BGB | src/data/quiz.json:22055 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 634a Abs. 1 Nr. 2 BGB | content/bauschaeden/Bauschaeden.json:258<br>src/data/moduleHistoryData.ts:738<br>src/data/quiz.json:10666 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 634a Abs. 3 BGB | content/bauschaeden/Bauschaeden.json:246 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 634a Abs. 3 Satz 2 BGB | content/bauschaeden/Bauschaeden.json:23 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 638 BGB | src/data/moduleHistoryData.ts:738 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 640 BGB | src/data/quiz.json:10699 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 642 BGB | src/modules/Bauschaeden.tsx:134,153 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 644 BGB | content/ki/ueberblick/daten.json:185 | Plausibilität (Gliederung des Gesetzes), kein Abruf | Frage F-5 (Baugrundrisiko üblich § 645) |
| § 650g BGB | content/schaedenchecklisten/SchaedenChecklisten.json:57,58 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 650o BGB | content/nachhaltigkeit/PraxisGebaeudetypE.json:13<br>content/nachhaltigkeit/PraxisInnovationen.json:5<br>src/components/ui/RechtsrahmenKompendium.tsx:669,676,685<br>src/data/quiz.json:5757,5763,5767 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 650t BGB | content/bauschaeden/Bauschaeden.json:92 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 823 BGB | content/schaedenchecklisten/SchaedenChecklisten.json:16 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 195, 199 BGB | content/bauschaeden/Bauschaeden.json:23 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 631 ff. BGB | content/regularien/Regularien.json:63,290 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 631, 633 BGB | src/data/quiz.json:14050,14059,14076 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 633–634a BGB | content/schaedenchecklisten/SchaedenChecklisten.json:142 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 633, 650a BGB | src/data/moduleHistoryData.ts:740 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 634a, 204 BGB | content/bauschaeden/Bauschaeden.json:247 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 650a BGB | src/data/moduleHistoryData.ts:836 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 650a ff. BGB | content/moduleinfo/ressourcen.json:527<br>content/regularien/Regularien.json:63,292<br>src/components/ui/RechtsrahmenKompendium.tsx:669<br>src/data/moduleHistoryData.ts:738<br>src/data/quiz.json:5763 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 650a–650v BGB | content/moduleinfo/daten.json:1513 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 823, 836 BGB | content/moduleinfo/daten.json:547 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 823, 836–838 BGB | content/zustandsbewertung/Zustandsbewertung.json:51 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 14 BGB | content/ki/ueberblick/daten.json:822 | Plausibilität (Gliederung des Gesetzes), kein Abruf | Skriptzuordnung: KI-VO Art. 14 – plausibel |
| § 1 Abs. 1 BImSchV | src/data/quiz.json:9683 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 1 Abs. 1 Satz 1 BImSchV | content/rueckbauchecklisten/RueckbauChecklisten.json:32<br>src/data/quiz.json:9692 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 1 Abs. 1 Satz 2 BImSchV | src/data/quiz.json:9715 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Anhang 1 Nr. 8 BImSchV | content/rueckbauchecklisten/RueckbauChecklisten.json:33 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 3 Abs. 1 BITV | content/barrierefreiheit/Barrierefreiheit.json:5<br>src/modules/Barrierefreiheit.tsx:7 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 6 CBAM | src/components/ui/RechtsrahmenKompendium.tsx:543 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 9, 21 und 31 CBAM | content/nachhaltigkeit/Nachhaltigkeit.json:150 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 9, 21, 31 CBAM | content/nachhaltigkeit/CbamRechner.json:22<br>src/components/ui/RechtsrahmenKompendium.tsx:558 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 10a Abs. 1a CBAM | src/calc/cbam.ts:7 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 31 CBAM | content/nachhaltigkeit/CbamRechner.json:4<br>content/nachhaltigkeit/Nachhaltigkeit.json:149<br>src/calc/cbam.ts:5<br>src/components/ui/RechtsrahmenKompendium.tsx:557<br>src/data/quiz.json:26629,26650 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 3 DepV | content/abfaelle/Deponie.json:34,162 | gii DepV (Inhaltsübersicht) | korrigiert (vorher „§ 3-14 DepV“ bzw. „§ 5 DepV … i. V. m. TA Abfall“) |
| § 6 DepV | content/abfaelle/Deponie.json:168 | gii DepV (Inhaltsübersicht) | bestätigt (Voraussetzungen für die Ablagerung) |
| § 8 DepV | content/abfaelle/Checklisten.json:162,164,188<br>content/abfaelle/LagaPn98.json:29<br>content/rueckbauchecklisten/RueckbauChecklisten.json:62,64 | gii DepV (Inhaltsübersicht) | bestätigt (Annahmeverfahren); Checklisten: korrigiert (vorher „DepV § 12“) |
| § 8 Abs. 4 DepV | content/abfaelle/Checklisten.json:182 | gii DepV (Inhaltsübersicht) | bestätigt |
| §§ 10–13 DepV | content/abfaelle/Deponie.json:186 | gii DepV (Inhaltsübersicht) | korrigiert (vorher „§ 12 - 14 DepV“) |
| Anhang 1 DepV | content/abfaelle/Deponie.json:34,39,42,161,162 | gii DepV (Inhaltsübersicht) | bestätigt |
| Anhang 1 Nr. 2 DepV | content/abfaelle/Deponie.json:174,180 | gii DepV (Inhaltsübersicht) | bestätigt |
| Anhang 1 Tab. 1 DepV | content/abfaelle/Deponie.json:71 | gii DepV (Inhaltsübersicht) | bestätigt |
| Anhang 1 Tab. 1) DepV | content/abfaelle/Deponie.json:266 | gii DepV (Inhaltsübersicht) | bestätigt |
| Anhang 3 DepV | content/abfaelle/Abfaelle.json:181,264<br>content/abfaelle/Checklisten.json:164<br>content/abfaelle/Deponie.json:18,23,238<br>content/rueckbauchecklisten/RueckbauChecklisten.json:67<br>src/data/lernziele.ts:1572 | gii DepV (Inhaltsübersicht) | bestätigt |
| Anhang 3 Nr. 2 DepV | content/abfaelle/Abfaelle.json:181 | gii DepV (Inhaltsübersicht) | bestätigt |
| Anhang 3 Tabelle 2 DepV | content/abfaelle/Abfaelle.json:263<br>content/abfaelle/Checklisten.json:170,176<br>content/rueckbauchecklisten/RueckbauChecklisten.json:66,67<br>src/data/quiz.json:8455 | gii DepV (Inhaltsübersicht) | bestätigt |
| Art. 4 DSGVO | content/ki/FehlerRechtEthik.json:51<br>src/data/quiz.json:13969 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 6 DSGVO | content/ki/FehlerRechtEthik.json:52 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 6 Abs. 1 lit. a DSGVO | src/modules/Datenschutz.tsx:142 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 6 Abs. 1 lit. e DSGVO | src/modules/Datenschutz.tsx:72,100,124,188 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 6, 28, 44 ff. DSGVO | src/data/quiz.json:13965 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 7 Abs. 3 DSGVO | src/modules/Datenschutz.tsx:202 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 13 DSGVO | src/modules/Impressum.tsx:205 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 15 bis 21 DSGVO | src/modules/Datenschutz.tsx:194 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 28 DSGVO | content/ki/FehlerRechtEthik.json:65 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 33 DSGVO | src/data/quiz.json:14093,14102,14114 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 33 und 34 DSGVO | src/data/quiz.json:14119 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 45 DSGVO | src/modules/Datenschutz.tsx:57 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 50 DSGVO | content/ki/KiUeberblick.json:20<br>content/kibaustoffe/KiBaustoffe.json:165 | Plausibilität (Gliederung des Gesetzes), kein Abruf | Skriptzuordnung: KI-VO Art. 50 – plausibel |
| Art. 7 EPBD 2024/1275 | content/nachhaltigkeit/Nachhaltigkeit.json:144<br>src/components/ui/RechtsrahmenKompendium.tsx:194,369,376,388<br>src/data/quiz.json:5721,5978,5990,26670,26682 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 35 EPBD 2024/1275 | src/data/quiz.json:5995 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 4 ErsatzbaustoffV | content/abfaelle/Checklisten.json:82 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| § 8 ErsatzbaustoffV | content/abfaelle/LagaPn98.json:28<br>content/moduleinfo/ModuleInfo.json:15<br>content/probenahme/Probenahme.json:8,126<br>src/data/quiz.json:2667,2668,2681 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| § 8 Abs. 1 ErsatzbaustoffV | src/data/quiz.json:2676 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| § 11 ErsatzbaustoffV | content/abfaelle/Checklisten.json:82 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| § 14 Abs. 2 ErsatzbaustoffV | content/abfaelle/LagaPn98.json:28 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| § 15 ErsatzbaustoffV | content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json:166<br>content/schadstoffe/Schadstoffe.json:343 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | Frage F-1 (Fundstelle für gereinigte Sande unklar) |
| § 19 ErsatzbaustoffV | content/abfaelle/Checklisten.json:94<br>content/rueckbau/AktualitaetTab.json:63 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | plausibel (Vorprüfung AP 9); Checklisten „Anhang 2“ → Anlage 2 korrigiert |
| § 19 Abs. 6 ErsatzbaustoffV | content/abfaelle/Abfaelle.json:142,144<br>content/abfaelle/Checklisten.json:93 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| § 19 Abs. 7 ErsatzbaustoffV | content/abfaelle/Abfaelle.json:176 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| § 19 Abs. 8 ErsatzbaustoffV | content/abfaelle/Abfaelle.json:149,156,157<br>content/abfaelle/Checklisten.json:99<br>content/rueckbau/AktualitaetTab.json:67 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| § 20 ErsatzbaustoffV | content/abfaelle/Checklisten.json:100 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| § 22 ErsatzbaustoffV | content/abfaelle/Abfaelle.json:138,139,182<br>content/abfaelle/Checklisten.json:110,112<br>content/abfaelle/EbvMantelverordnung.json:74<br>content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json:30<br>content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json:115<br>content/rueckbau/AktualitaetTab.json:65<br>+ 4 weitere Dateien | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt (Voranzeige RC-3/BM-F3/BG-F3, § 20-Stoffe ab 250 m³) |
| § 22 Abs. 1 ErsatzbaustoffV | content/abfaelle/Abfaelle.json:140,177 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| § 22 Abs. 5 ErsatzbaustoffV | content/abfaelle/EbvMantelverordnung.json:81 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| § 22 Abs. 6 ErsatzbaustoffV | content/abfaelle/EbvMantelverordnung.json:81 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt (Rückbau binnen eines Jahres) |
| § 25 Abs. 4 Satz 1 ErsatzbaustoffV | content/abfaelle/EbvMantelverordnung.json:81 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| § 25 Abs. 4 Satz 2 ErsatzbaustoffV | content/abfaelle/EbvMantelverordnung.json:81 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| §§ 8 und 14 ErsatzbaustoffV | content/abfaelle/LagaPn98.json:28 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| §§ 19 ErsatzbaustoffV | content/abfaelle/Abfaelle.json:185<br>content/rueckbau/Rueckbau.json:124 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| §§ 19, 20 ErsatzbaustoffV | content/rueckbauchecklisten/RueckbauChecklisten.json:48 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| §§ 19, 20, 22 ErsatzbaustoffV | content/abfaelle/Abfaelle.json:184 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| Anlage 1 ErsatzbaustoffV | content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json:274,292,305<br>content/nachhaltigkeitchecklisten/NachhaltigkeitChecklisten.json:60<br>content/rueckbau/Rueckbau.json:276<br>content/rueckbauchecklisten/RueckbauChecklisten.json:156<br>content/schadstoffe/Schadstoffe.json:451,469,482 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | plausibel; 2 Stellen korrigiert (vorher „EBV Anhang 1“) |
| Anlage 1 Tab. 1 ErsatzbaustoffV | content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json:211<br>content/schadstoffe/Schadstoffe.json:388 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| Anlage 1 Tab. 1) ErsatzbaustoffV | content/schadstoffe/Schadstoffe.json:79,86 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| Anlage 1 Tab. 3) ErsatzbaustoffV | content/schadstoffe/Schadstoffe.json:83 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| Anlage 1 Tabellen ErsatzbaustoffV | content/abfaelle/Checklisten.json:88 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | korrigiert (vorher „Anhang 1“) |
| Anlage 2 ErsatzbaustoffV | content/abfaelle/Abfaelle.json:147,150,152,154,167,183<br>content/rueckbau/AktualitaetTab.json:64<br>content/schadstoffe/Schadstoffe.json:84<br>src/data/tasks/rueckbauTasks.ts:18 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | bestätigt |
| Art. 11 Abs. 2 ErsatzbaustoffV | content/kreislaufwirtschaft/Kreislaufwirtschaft.json:183 | lexmea § 22 EBV; übrige §§ Plausibilität (Vorprüfung AP 9) | Skriptzuordnung: Art. 11 Abs. 2 RL 2008/98/EG – plausibel |
| § 6 Abs. 1 Nr. 1a EStG/EStDV | content/modernisierung/Modernisierung.json:26 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 7b EStG/EStDV | content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json:113 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 7i EStG/EStDV | content/denkmalpflege/Denkmalpflege.json:79,95 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 10f EStG/EStDV | content/denkmalpflege/Denkmalpflege.json:82 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 82b EStG/EStDV | content/modernisierung/Modernisierung.json:25 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 7i, 10f EStG/EStDV | content/denkmalpflege/Denkmalpflege.json:78 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 5a GefStoffV | content/abfaelle/Checklisten.json:120<br>content/bestandchecklisten/BestandChecklisten.json:24<br>content/rueckbau/AktualitaetTab.json:71,72<br>content/rueckbau/Rueckbau.json:124<br>content/rueckbauchecklisten/RueckbauChecklisten.json:13<br>content/schadstoffe/Schadstoffe.json:97,98<br>+ 4 weitere Dateien | lxgesetze § 11a GefStoffV (Stand 17.12.2025) | plausibel (Vorprüfung AP 9, nicht erneut abgerufen) |
| § 5a Abs. 1 GefStoffV | content/bestandchecklisten/BestandChecklisten.json:23 | lxgesetze § 11a GefStoffV (Stand 17.12.2025) | plausibel (Vorprüfung AP 9) |
| § 5a Abs. 2 GefStoffV | content/schadstoffe/Schadstoffe.json:99,100 | lxgesetze § 11a GefStoffV (Stand 17.12.2025) | plausibel (Vorprüfung AP 9) |
| § 8 GefStoffV | content/abfaelle/Checklisten.json:264 | lxgesetze § 11a GefStoffV (Stand 17.12.2025) | plausibel (Allgemeine Schutzmaßnahmen) |
| § 11a GefStoffV | content/abfaelle/Checklisten.json:239<br>content/rueckbau/Rueckbau.json:36<br>content/rueckbauchecklisten/RueckbauChecklisten.json:71,96,97<br>content/schadstoffe/Schadstoffe.json:116,119,373<br>src/data/quiz.json:9640,9649<br>src/data/tasks/rueckbauTasks.ts:26 | lxgesetze § 11a GefStoffV (Stand 17.12.2025) | bestätigt (Abs. 3 Zulassung ≤ 6 Jahre, Abs. 4 Anzeige 1 Woche, Abs. 4a Abbruch); Schadstoffe: korrigiert (vorher „GefStoffV § 11“) |
| § 11a Abs. 4 GefStoffV | src/data/quiz.json:9672 | lxgesetze § 11a GefStoffV (Stand 17.12.2025) | bestätigt |
| §§ 5a, 11a GefStoffV | content/moduleinfo/daten.json:489 | lxgesetze § 11a GefStoffV (Stand 17.12.2025) | bestätigt |
| § 16 GEG | content/regularien/Regularien.json:388 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| § 36 GEG | content/moduleinfo/daten.json:1215 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| § 47 GEG | src/data/quiz.json:7282 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| § 48 GEG | content/bestand/Bestand.json:35<br>src/data/quiz.json:6862 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| § 72 GEG | content/modernisierung/Modernisierung.json:36<br>src/components/ui/RechtsrahmenKompendium.tsx:214 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| § 72 Abs. 1–2 GEG | content/modernisierung/Modernisierung.json:6,37 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| § 72 Abs. 4 GEG | content/modernisierung/Modernisierung.json:6,37 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| § 86 GEG | src/modules/Energieausweis.tsx:17 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| §§ 15 GEG | content/energieausweis/Energieausweis.json:247 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| §§ 47–55 und 71–73 GEG | src/data/quiz.json:5701 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| §§ 79–88 GEG | content/energieausweis/Energieausweis.json:151 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| Anlage 4 GEG | content/energieausweis/Energieausweis.json:76,168,265<br>src/calc/energieausweis.ts:12 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| Anlage 7 GEG | content/bauphysik/Bauphysik.json:96,97,110<br>content/bestand/Bestand.json:35,300<br>src/calc/fenster.ts:9<br>src/calc/waermeschutz.ts:18<br>src/components/DaemmungBerater.tsx:46<br>src/modules/Bauphysik.tsx:743,744 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| Anlage 9 GEG | src/utils/bestandKern.ts:26 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| Anlage 10 GEG | content/energieausweis/Energieausweis.json:22,165<br>src/data/quiz.json:5630<br>src/modules/Energieausweis.tsx:17 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| Art. 1 GEG | content/fortbildungen/Fortbildungen.json:256 | gii GModG.pdf (Überschriften); GEG 2024 als a. F. | bestätigt (als a. F. bzw. GModG/GEG gekennzeichnet) |
| § 2 GeschGehG | content/ki/FehlerRechtEthik.json:53 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 2 Nr. 1 GeschGehG | content/ki/FehlerRechtEthik.json:55 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 8 GewAbfV | content/abfaelle/Abfaelle.json:26<br>content/abfaelle/AvvSchluessel.json:32<br>content/abfaelle/Checklisten.json:42,44,144<br>content/abfaelle/EbvMantelverordnung.json:18<br>content/moduleinfo/daten.json:495<br>content/rueckbau/Rueckbau.json:119,120,270<br>+ 6 weitere Dateien | gii GewAbfV (Volltext) | bestätigt |
| § 8 Abs. 1 GewAbfV | content/rueckbau/daten.json:33 | gii GewAbfV (Volltext) | bestätigt |
| § 8 Abs. 1 bis 3 GewAbfV | src/data/quiz.json:9795 | gii GewAbfV (Volltext) | bestätigt |
| § 8 Abs. 3 GewAbfV | content/abfaelle/AvvSchluessel.json:33<br>content/abfaelle/Checklisten.json:43 | gii GewAbfV (Volltext) | bestätigt |
| § 9 GewAbfV | content/rueckbau/AktualitaetTab.json:13,14 | gii GewAbfV (Volltext) | bestätigt |
| §§ 4, 8 GewAbfV | content/rueckbau/Rueckbau.json:271 | gii GewAbfV (Volltext) | bestätigt (90 % in § 4 Abs. 3) |
| §§ 8 GewAbfV | content/rueckbau/Rueckbau.json:124 | gii GewAbfV (Volltext) | bestätigt |
| §§ 8 und 9 GewAbfV | src/data/quiz.json:9800 | gii GewAbfV (Volltext) | korrigiert (Quiz q_rc_4: vorher „Teil 3 … §§ 8 bis 10“) |
| §§ 8, 9 GewAbfV | content/rueckbau/Rueckbau.json:123 | gii GewAbfV (Volltext) | bestätigt |
| § 36 GewO | content/fortbildungen/Fortbildungen.json:357 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 31 GG | content/regularien/Regularien.json:12 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 70 GG | content/regularien/Regularien.json:215<br>src/data/quiz.json:2454 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 70, 74 Abs. 1 Nr. 18 GG | src/data/quiz.json:2480 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 74 Abs. 1 Nr. 18 GG | content/regularien/Regularien.json:215 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 11 GModG | content/bauphysik/Bauphysik.json:110<br>content/feuchteschutz/Feuchteschutz.json:73 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| § 14 GModG | content/energieausweis/Energieausweis.json:254<br>content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json:4,11,105,190<br>src/calc/sommerWaermeschutz.ts:3,198<br>src/data/lernziele.ts:30<br>src/data/quiz.json:50456,50497,50538,50579,50620,50661,50702<br>src/registry/modules.ts:630,631 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| § 14 Abs. 1 GModG | content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json:8 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| § 15 GModG | content/nachhaltigkeitchecklisten/NachhaltigkeitChecklisten.json:100,101<br>content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json:207 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| § 20 GModG | content/energieausweis/Energieausweis.json:251,266 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| § 22 GModG | content/energieausweis/Energieausweis.json:278 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| § 35 GModG | content/modernisierung/Modernisierung.json:6,30,32<br>src/components/ui/RechtsrahmenKompendium.tsx:211<br>src/data/quiz.json:7278,7287,7291 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| § 35 Abs. 1 GModG | content/modernisierung/Modernisierung.json:31 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| § 36 GModG | content/bestand/Bestand.json:35<br>content/modernisierung/Modernisierung.json:6,29,40,41,43,73,135,137,138,140,142,155,274,275<br>src/components/DaemmungBerater.tsx:46<br>src/components/ui/RechtsrahmenKompendium.tsx:208,212<br>src/data/quiz.json:6853,6862<br>src/modules/Modernisierung.tsx:125,302,603,618,624 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| § 37 GModG | content/modernisierung/Modernisierung.json:156<br>src/data/quiz.json:7299 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| § 42a GModG | src/components/ui/RechtsrahmenKompendium.tsx:208 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt (Grüngas-/Grünheizölquote) |
| § 43 Abs. 1 GModG | content/modernisierung/Modernisierung.json:6 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | Überschrift bestätigt; Quoten nicht im Abruf (Vorprüfung Lesefassung) |
| § 69 GModG | content/modernisierung/Modernisierung.json:33<br>src/components/ui/RechtsrahmenKompendium.tsx:211 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| § 69 Abs. 3 GModG | content/modernisierung/Modernisierung.json:39<br>src/components/ui/RechtsrahmenKompendium.tsx:213 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | Überschrift bestätigt; Absatz nicht im Abruf (Vorprüfung Lesefassung) |
| § 105 GModG | content/denkmalpflege/Denkmalpflege.json:51,52,101,102,138<br>src/data/quiz.json:7193,7194 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| §§ 35–37 GModG | content/modernisierung/Modernisierung.json:161<br>content/moduleinfo/daten.json:446 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| §§ 35, 36 GModG | src/components/ui/RechtsrahmenKompendium.tsx:207 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| §§ 35, 69 GModG | src/data/quiz.json:41547 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | Überschriften bestätigt; Absatzinhalt Vorprüfung |
| §§ 36, 37 GModG | content/modernisierung/Modernisierung.json:157 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| Anlage 1 GModG | content/energieausweis/Energieausweis.json:271 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| Anlage 4 GModG | content/energieausweis/Energieausweis.json:81,120,121,168<br>src/calc/energieausweis.ts:14,143 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| Anlage 7 GModG | content/bauphysik/Bauphysik.json:14,124<br>content/beispielrechnungen/RechnungUWert.json:25,28,29,31<br>content/bestand/Bestand.json:35,61<br>content/bpdaemmung/BpDaemmung.json:20,579<br>content/bpglaeser/BpGlaeser.json:47<br>content/kombinationen/Kombinationen.json:180,181,182<br>+ 11 weitere Dateien | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| Anlage 8 GModG | content/modernisierung/Modernisierung.json:34 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| Anlage 9 GModG | src/calc/bauprodukte.ts:55<br>src/components/DaemmungBerater.tsx:413<br>src/data/rechnerGrenzen.ts:431<br>src/modules/Bestand.tsx:67<br>src/utils/bestandKern.ts:6,26,28,30 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt |
| Anlage 10 GModG | src/calc/energieausweis.ts:10,78<br>src/data/erkundung.ts:143<br>src/data/tasks/bauphysikTasks.ts:8 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | bestätigt; erkundung.ts/energieausweis.ts von „GEG Anlage 10“ umgestellt |
| Anlage 10a GModG | content/energieausweis/Energieausweis.json:159 | gii GModG.pdf (Fassung ab 29.07.2026, Überschriften) | Frage F-2 (in der Fassung ab 29.07.2026 nicht enthalten) |
| § 34 HOAI | src/data/quiz.json:15149 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 34 Abs. 3 HOAI | src/data/quiz.json:15157 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Anlage 10 HOAI | content/moduleinfo/daten.json:616<br>src/data/quiz.json:15131 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel (Leistungsbild Gebäude und Innenräume) |
| Art. 6 HOAI | content/ki/ueberblick/daten.json:119 | Plausibilität (Gliederung des Gesetzes), kein Abruf | Skriptzuordnung: KI-VO Art. 6 – plausibel |
| Art. 50 KI-VO (AI Act) 2024/1689 | content/ki/FehlerRechtEthik.json:40<br>src/data/quiz.json:13884,13889,13894<br>src/modules/KiBaustoffe.tsx:265 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel; Digital Omnibus (VO (EU) 2026/1744) nicht geprüft |
| Art. 113 KI-VO (AI Act) 2024/1689 | content/kibaustoffe/KiBaustoffe.json:139 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 3 Abs. 5 KrWG | src/data/tasks/rueckbauTasks.ts:42 | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt |
| § 3 Abs. 23a KrWG | src/data/quiz.json:9820,9837 | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt (Verfüllung zählt zur stofflichen Verwertung) |
| § 3, 5, 8 KrWG | content/abfaelle/Checklisten.json:5 | gii KrWG (Volltext, Stand 13.10.2026) | Frage F-6 (§ 8 betrifft Rangfolge, nicht Einstufung) |
| § 5 KrWG | content/abfaelle/Abfaelle.json:154<br>content/abfaelle/Checklisten.json:66<br>content/abfaelle/EbvMantelverordnung.json:26<br>src/data/moduleOverviewsData.ts:1040 | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt |
| § 5 Abs. 1 KrWG | content/abfaelle/EbvMantelverordnung.json:27,89,90 | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt |
| § 6 KrWG | content/abfaelle/Checklisten.json:158<br>content/altholzurbanmining/AltholzUrbanMining.json:9<br>content/interactivelcacalc/ModulDLabor.json:36<br>content/rueckbauchecklisten/RueckbauChecklisten.json:25<br>src/calc/lca.ts:152,322<br>src/data/audit/zulieferungen.ts:50<br>+ 3 weitere Dateien | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt |
| § 6 Abs. 1 KrWG | content/interactivelcacalc/ModulDLabor.json:34<br>src/calc/lca.ts:143,150<br>src/data/quiz.json:8565 | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt |
| § 6 Abs. 2 KrWG | content/interactivelcacalc/ModulDLabor.json:35 | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt (Lebenszyklus) |
| § 9 KrWG | content/rueckbau/Rueckbau.json:16 | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt (Getrennte Sammlung) – neu gesetzt statt „§ 9 Abs. 2“ |
| § 9a KrWG | content/rueckbau/Rueckbau.json:16,17<br>src/data/quiz.json:8591,8711,8715,8720,8732,8737 | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt; Rückbau: korrigiert (vorher „§ 9 Abs. 2 KrWG“, Gutachten 29.10.) |
| § 14 KrWG | content/abfaelle/Abfaelle.json:185,225<br>content/kreislaufwirtschaft/Kreislaufwirtschaft.json:183<br>content/moduleinfo/daten.json:492<br>content/rueckbauchecklisten/RueckbauChecklisten.json:140<br>src/data/quiz.json:6599 | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt |
| § 14 Abs. 2 KrWG | content/abfaelle/Abfaelle.json:253,254<br>content/ressourceneffizienz/Ressourceneffizienz.json:354<br>content/rueckbauchecklisten/RueckbauChecklisten.json:150,151<br>src/components/ui/RechtsrahmenKompendium.tsx:436<br>src/data/quiz.json:9597,9598,9612,9618,9811,9812,9832,9837 | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt (70 Gew.-%); RechtsrahmenKompendium: korrigiert (vorher „§ 14 Abs. 3“) |
| § 49 KrWG | content/abfaelle/Abfaelle.json:69 | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt |
| § 54 KrWG | src/data/tasks/rueckbauTasks.ts:42 | gii KrWG (Volltext, Stand 13.10.2026) | bestätigt |
| § 3 MBO | content/moduleinfo/daten.json:547<br>content/zustandsbewertung/Zustandsbewertung.json:51<br>src/data/quiz.json:11263 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 16a MBO | content/bpinnovationen/BpInnovationen.json:75<br>src/data/moduleOverviewsData.ts:330,331 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 16b MBO | src/data/quiz.json:1293 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 17 ff. MBO | content/bpinnovationen/BpInnovationen.json:70 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 20 MBO | src/data/quiz.json:1138,1164 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 22 MBO | src/data/quiz.json:22509 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 26 MBO | src/data/quiz.json:5544,5570 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 58 MBO | content/schaedenchecklisten/SchaedenChecklisten.json:73 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 85a MBO | content/bprechtliches/BpRechtliches.json:174<br>content/regularien/Regularien.json:229<br>src/data/quiz.json:2411,12331 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 16a bis 25 MBO | content/bpinnovationen/BpInnovationen.json:272 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 16a ff. MBO | src/data/quiz.json:21998 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 16a–25 MBO | content/bprechtliches/BpRechtliches.json:244 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 16b–25 MBO | content/moduleinfo/daten.json:149 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 21, 22 MBO | src/data/quiz.json:1094,1120,22535 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 33, 35 MBO | content/ki/ueberblick/daten.json:48 | Plausibilität (Gliederung des Gesetzes), kein Abruf | korrigiert (ergänzt: Lauflänge 35 m nach § 35 Abs. 2 MBO; vorher nur § 33) |
| §§ 35, 36 MBO | content/innenausbau/Innenausbau.json:128 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 18 MStV | src/modules/Impressum.tsx:48,153,204 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 18 Abs. 2 MStV | src/modules/Impressum.tsx:165,169 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 2 Abs. 2 NachwV | content/abfaelle/Abfaelle.json:123<br>src/data/tasks/rueckbauTasks.ts:42 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 4 NachwV | content/abfaelle/Checklisten.json:74 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 25 NachwV | content/abfaelle/Abfaelle.json:70<br>content/abfaelle/AvvSchluessel.json:46<br>content/abfaelle/Checklisten.json:73 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 1 Abs. 2 Nr. 5 ProdHaftG | content/bauschaeden/Bauschaeden.json:68 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 57 REACH | src/components/ui/RechtsrahmenKompendium.tsx:580 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 304 StGB | content/denkmalpflege/Denkmalpflege.json:29 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 324a StGB | content/fortbildungen/Fortbildungen.json:151 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 326 StGB | content/schadstoffe/Schadstoffe.json:499 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Art. 3 Taxonomie-VO | src/data/quiz.json:5798 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 25 Abs. 1 TDDDG | src/modules/Datenschutz.tsx:142 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 25 Abs. 2 Nr. 2 TDDDG | src/data/speicherRegister.ts:44<br>src/modules/Datenschutz.tsx:101,157 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Anhang 1 TEHG | src/data/quiz.json:21836 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 5 TMG/DDG | src/components/ui/ModuleFooter.tsx:396<br>src/modules/Impressum.tsx:48,153,157,203 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 7 ff. TMG/DDG | src/modules/Impressum.tsx:177 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 17 TrinkwV | content/historischebauprodukte/HistorischeBauprodukte.json:71 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Anlage 2 TrinkwV | content/pfasbaustoffe/PfasBaustoffe.json:125 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Anlage 2 Teil I TrinkwV | content/pfasbaustoffe/PfasBaustoffe.json:119,128,214<br>src/calc/pfas.ts:15,43<br>src/data/quiz.json:9349 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| Anlage 2 Teil II) TrinkwV | content/historischebauprodukte/HistorischeBauprodukte.json:361 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 2 Abs. 2 UrhG | content/ki/FehlerRechtEthik.json:57<br>src/data/kurzfassung.ts:69<br>src/data/quiz.json:14007,14016,14028,14033 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 44b UrhG | content/ki/FehlerRechtEthik.json:81<br>content/ki/KiUeberblick.json:20<br>content/kibaustoffe/KiBaustoffe.json:165,602<br>src/data/quiz.json:14137,14145,14151,14157 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 51 UrhG | src/data/lizenzTexte.ts:42<br>src/modules/Impressum.tsx:183 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 60d UrhG | content/ki/FehlerRechtEthik.json:81<br>src/data/quiz.json:14145 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 44b, 60d UrhG | src/data/quiz.json:14136,14162 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 7 VOB/A | content/bpinnovationen/BpInnovationen.json:65<br>content/ki/ueberblick/daten.json:411<br>src/data/quiz.json:15200,15217,15259 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 7 Abs. 1 Nr. 3 VOB/A | src/data/quiz.json:15233,15242,15254 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel (Abschnitt 1, 2019); Hinweis auf VOB/A 2026 nicht geprüft |
| § 7 Abs. 1 Nr. 4 VOB/A | src/data/quiz.json:15191,15200,15212 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel (Abschnitt 1, 2019); Hinweis auf VOB/A 2026 nicht geprüft |
| § 7 Abs. 2 VOB/A | content/praxiswissen/Praxiswissen.json:47,118<br>src/data/quiz.json:15062 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 8a VOB/A | content/regularien/Regularien.json:59 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 9d VOB/A | content/preisentwicklung/Preisentwicklung.json:50,51<br>src/data/quiz.json:41061 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 1 Abs. 1 VOB/B | content/regularien/Regularien.json:348 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 2 VOB/B | content/bauschaeden/Bauschaeden.json:49<br>content/ki/ueberblick/daten.json:540 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 2 Abs. 1 VOB/B | content/ki/ueberblick/daten.json:538 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 2 Abs. 3 VOB/B | content/preisentwicklung/Preisentwicklung.json:33,50 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 2 Abs. 6 VOB/B | src/modules/Bauschaeden.tsx:195,213 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 4 VOB/B | content/bautagebuch/Bautagebuch.json:55<br>content/ki/KiOnlinekurse.json:117<br>src/data/tasks/digitalesTasks.ts:40 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 4 Abs. 2 VOB/B | src/data/moduleOverviewsData.ts:341 | Plausibilität (Gliederung des Gesetzes), kein Abruf | korrigiert (vorher „§ 4 Nr. 2“, Zählung vor 2002) |
| § 4 Abs. 3 VOB/B | content/bauschaeden/Bauschaeden.json:43<br>content/bautagebuch/Bautagebuch.json:109,206,273,283<br>content/ki/LlmPraxis.json:95,113<br>content/ki/LlmPraxisTeile/SkillsKonnektorenTab.json:45,46<br>content/ki/Systemarchitektur.json:257<br>content/kiuebungen/KiUebungen.json:36<br>+ 9 weitere Dateien | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 4 Abs. 3) VOB/B | content/ki/LlmPraxis.json:70<br>src/data/kiUebungen.ts:155 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 4 Abs. 7 VOB/B | content/ki/LlmPraxis.json:52,94<br>content/ki/ueberblick/daten.json:758,761<br>content/moduleinfo/daten.json:569<br>content/schaedenchecklisten/SchaedenChecklisten.json:58<br>src/data/kurzfassung.ts:62 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 4 Abs. 7) VOB/B | content/ki/LlmPraxis.json:67 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 5 VOB/B | content/ki/ueberblick/daten.json:67 | Plausibilität (Gliederung des Gesetzes), kein Abruf | korrigiert (Pönale = Vertragsstrafe § 11, Fristen § 5) |
| § 6 VOB/B | content/bautagebuch/Bautagebuch.json:21,224,288,298<br>src/data/lernziele.ts:1180<br>src/data/moduleOverviewsData.ts:1352,1397,1398<br>src/data/quiz.json:48585 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 6 Abs. 1 VOB/B | content/bauschaeden/Bauschaeden.json:45,60<br>content/bautagebuch/Bautagebuch.json:22,108<br>content/ki/LlmPraxisTeile/SkillsKonnektorenTab.json:41<br>content/praxiswissen/Praxiswissen.json:302<br>src/data/lernziele.ts:1170<br>src/data/quiz.json:15530,15539,15544<br>+ 1 weitere Dateien | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 6 Abs. 2 VOB/B | content/bautagebuch/Bautagebuch.json:300<br>src/modules/Bauschaeden.tsx:153 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 6 Abs. 6 VOB/B | src/modules/Bauschaeden.tsx:153 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 8 Abs. 3 VOB/B | content/ki/LlmPraxis.json:94 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 11 VOB/B | content/ki/ueberblick/daten.json:67 | Plausibilität (Gliederung des Gesetzes), kein Abruf | korrigiert (neu ergänzt) |
| § 12 VOB/B | src/data/moduleOverviewsData.ts:1352,1408 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 13 VOB/B | content/bauschaeden/Bauschaeden.json:20,47<br>content/moduleinfo/daten.json:550<br>content/regularien/Regularien.json:75<br>content/schaedenchecklisten/SchaedenChecklisten.json:64<br>src/data/moduleHistoryData.ts:740<br>src/modules/Bauschaeden.tsx:121 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 13 Abs. 3 VOB/B | content/bautagebuch/Bautagebuch.json:275<br>content/praxiswissen/Praxiswissen.json:312<br>src/data/moduleOverviewsData.ts:1413<br>src/data/quiz.json:10793,15326,48591<br>src/modules/Bauschaeden.tsx:123 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 13 Abs. 4 VOB/B | content/regularien/Regularien.json:299<br>src/data/quiz.json:2327,2342,10657 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 13 Abs. 4 Nr. 1 VOB/B | content/bauschaeden/Bauschaeden.json:21,263<br>src/data/quiz.json:10666 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 13 Abs. 5 VOB/B | content/bauschaeden/Bauschaeden.json:27<br>src/data/kurzfassung.ts:222<br>src/data/quiz.json:10896<br>src/modules/Bauschaeden.tsx:164,184 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 13 Abs. 5 Nr. 1 VOB/B | content/bauschaeden/Bauschaeden.json:268 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 16 VOB/B | content/ki/ueberblick/daten.json:632,633 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 4, 13 VOB/B | content/ki/LlmPraxis.json:113 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 4, 13, 15 VOB/B | src/modules/ki/LlmPraxis.tsx:378 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 5, 11 VOB/B | content/ki/ueberblick/daten.json:68 | Plausibilität (Gliederung des Gesetzes), kein Abruf | korrigiert (vorher nur § 5) |
| Anlage 10 VOB/B | content/moduleinfo/daten.json:616 | Plausibilität (Gliederung des Gesetzes), kein Abruf | Skriptzuordnung: HOAI Anlage 10 – plausibel |
| § 35a VwVfG | content/ki/FehlerRechtEthik.json:46 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 286 ZPO | content/moduleinfo/daten.json:1384 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| § 404 Abs. 3 ZPO | content/bauschaeden/Bauschaeden.json:78,80 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 402 ff. ZPO | content/fortbildungen/Fortbildungen.json:357 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |
| §§ 485 ff. ZPO | content/bauschaeden/Bauschaeden.json:88<br>content/schaedenchecklisten/SchaedenChecklisten.json:60<br>src/data/quiz.json:10870,10879,10896 | Plausibilität (Gliederung des Gesetzes), kein Abruf | plausibel |

## Umsetzung 29.10.2026

| Frage | Ergebnis | Quelle | Datei |
|---|---|---|---|
| F-1 | „EBV Anlage 1 Tabelle 3 (Bodenmaterial) & BBodSchV Anlage 1: … Einbauklasse BM-0 bzw. BM-0*“; RC-1 gestrichen | wie Vorschlag | `content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json`, `content/schadstoffe/Schadstoffe.json` |
| F-2 | Anlage 10a GModG als „vorläufig, Normprüfung ausstehend“ gekennzeichnet (Prüfung gegen die Fassung ab 01.01.2027 steht aus) | – | `content/energieausweis/Energieausweis.json` |
| F-3 | Frist „18 Monate“ gestrichen; Satz auf „Einführung über delegierte Rechtsakte nach Art. 75 …“ gekürzt | Art. 75 VO (EU) 2024/3110 (gesetze.legal, s. o.) | `content/moduleinfo/daten.json`, `src/components/ui/RechtsrahmenKompendium.tsx` |
| F-4 | Art. 18 BayHIG lautet „Diensterfindungen“; Satz 3: „Satz 2 findet auf vermögensrechtliche Befugnisse gemäß dem Urheberrechtsgesetz entsprechende Anwendung.“ → Zitat in `src/data/lizenz.ts` richtig, unverändert. Qualitätssicherung und Evaluation regelt Art. 7 BayHIG → Fußzeile Feedback „BayHIG – Art. 7 Qualitätssicherung“ | [BayHIG, Gesamtausgabe (gesetze-bayern.de)](https://www.gesetze-bayern.de/Content/Pdf/BayHIG?all=True) | `content/feedback/Feedback.json` |
| F-5 | „Baugrundrisiken, die grundsätzlich der Besteller trägt (§§ 644, 645 BGB)“ | wie Vorschlag | `content/ki/ueberblick/daten.json` |
| F-6 | „Abfalleinstufung (§§ 3–5 KrWG, § 3 AVV)“ | wie Vorschlag | `content/abfaelle/Checklisten.json` |

Quiz: keine Frage betroffen.
