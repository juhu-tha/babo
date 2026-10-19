# Phase A – Eingangs-Audit (Vorher-Bewertung) und Arbeitspaket-Plan
Stand: 19.10.2026 · Basis: `main` (inkl. PR #1–#8; PR #9 Mängel & Schäden offen) · 240 Reiter (Trennlinien nicht gezählt), 33 Navigationsgruppen.
## Methode und Aussagekraft

Die Bewertung kombiniert zwei Quellen:

1. **Automatisch gemessene Indikatoren je Modul** (Skript über den Quelltext inkl. lokal importierter Untermodule):
   - Anzahl der Formeln
   - Anzahl der Rechner-Eingaben
   - Vorhandensein einer Test-/Quiz-Stufe
   - generische DIN-Media-Links (Startseite statt Norm)
   - Links auf beuth.de
   - Du-Anrede
   - absolute Rechtsaussagen (gerichtsfest, rechtssicher …)
   - `toFixed` (Punkt als Dezimaltrenner) gegenüber `formatDeZahl`
2. **Fachliche Tiefenprüfung** von bisher vier Modulgruppen: Rheologie, Spannbeton, Bauen im Bestand, Mängel & Schäden. Dabei fanden sich je Untermodul im Mittel 10–30 fachliche Fehler: falsche Grenzwerte, veraltete Normfassungen, erfundene Formeln und Quellen, widersprüchliche Werte zwischen Modulen.

**D1 (Richtigkeit) und D3 (Vollständigkeit) sind für nicht tiefengeprüfte Module Erwartungswerte aus dieser Stichprobe, keine Einzelbefunde.** Belastbare Einzelbewertungen entstehen erst im jeweiligen AP; dort werden alle Mängel einzeln offengelegt.

Bewertungsskala je Dimension: Erfüllungsgrad in % (100 % = verifiziert, normaktuell, vollständig).

| Dimension | Messgröße / Basis |
|---|---|
| D1 Richtigkeit & Normen | 60 % Grundwert (Stichprobe), 85 % nach Tiefenprüfung; Abzug für generische Normlinks, beuth.de, prEN |
| D2 Didaktik | 50 % Grundwert (4-Stufen-Lehrpfad nur in 6 Modulen ansatzweise); +15 % mit Test-Stufe; −5 % bei Du-Anrede |
| D3 Vollständigkeit | Erwartungswert 70 % (wird im AP je Modul gegen Lehrplan/Normenumfang geprüft) |
| D4 Praxisrelevanz | Erwartungswert 75 % (viele Fallbeispiele, aber teils ohne belegte Quellen) |
| D5 Konsistenz | 55 % (widersprüchliche Werte modulübergreifend nachgewiesen), 70 % nach Tiefenprüfung |
| D6 Interaktivität & Verifikation | 50 % + 40 % × Anteil `formatDeZahl` an allen Zahlausgaben; „–“ = keine Rechner/Formeln |

## Querschnittsbefunde (gesamte App)

| Befund | Umfang | Dimension |
|---|---|---|
| Normlinks nur auf `https://www.dinmedia.de/` (ohne Norm, ohne Ausgabe) | 688 Links in 183 Modulen | D1 |
| Links auf altes Portal beuth.de | 87 Links in 24 Modulen | D1 |
| Zahlausgabe mit `toFixed` (Dezimalpunkt) statt `formatDeZahl` | 3.293 Stellen in 86 Modulen (`formatDeZahl`: 702) | D6 |
| Du-Anrede (Betrachte, Simuliere, Wähle …) | 85 Stellen in 44 Modulen | D2 |
| Absolute Rechtsaussagen (gerichtsfest, rechtssicher, zwingend vorgeschrieben) | 72 Stellen in 36 Modulen | D1/D4 |
| Test-Stufe (Prüffragen mit Feedback) im Modul selbst | nur 20 von 240 Reitern; zentrales Quizsystem vorhanden (`InteractiveQuizSystem`) | D2 |
| Prüfdatum im Footer (`lastReviewed`) | 1 von 224 Footern (nach PR #9: 7) | D5 |
| Modulübergreifend widersprüchliche Kennwerte (Chlorid, Rostvolumen, KMF-Zeitraum, DGZfP-Nummern, EN 13791) | in 4 geprüften Gruppen behoben, weitere zu erwarten | D5 |
| Doppelt gerenderte Module (App.tsx) | 2 gefunden und behoben (PR #9); Prüfung aller Render-Zweige offen | D5/D6 |

## Bewertung je Gruppe (Mittelwerte)

| Gruppe | Reiter | Formeln | Rechner-Eingaben | D1 | D2 | D3 | D4 | D5 | D6 | Ø |
|---|---|---|---|---|---|---|---|---|---|---|
| Allgemein | 8 | 5 | 1 | 60 | 51 | 70 | 75 | 55 | 90 | 67 |
| Grundlagen | 8 | 174 | 48 | 58 | 50 | 70 | 75 | 55 | 73 | 64 |
| Labor & Auswertung | 8 | 43 | 44 | 57 | 49 | 70 | 75 | 55 | 54 | 60 |
| Baustoffe | 21 | 126 | 60 | 58 | 50 | 70 | 75 | 55 | 70 | 63 |
| Bauprodukte | 35 | 204 | 175 | 59 | 48 | 70 | 75 | 55 | 66 | 62 |
| Betontechnologie | 16 | 238 | 145 | 55 | 49 | 70 | 75 | 55 | 66 | 62 |
| Massivbau | 5 | 554 | 97 | 62 | 56 | 70 | 75 | 58 | 71 | 65 |
| Holzbau | 6 | 330 | 108 | 58 | 50 | 70 | 75 | 55 | 90 | 66 |
| Innenausbau | 1 | 4 | 1 | 58 | 50 | 70 | 75 | 55 | 50 | 60 |
| Mechanik | 10 | 203 | 55 | 61 | 50 | 70 | 75 | 56 | 74 | 64 |
| Bauphysik | 8 | 65 | 28 | 59 | 50 | 70 | 75 | 55 | 72 | 64 |
| Nachhaltigkeit | 8 | 123 | 55 | 58 | 51 | 70 | 75 | 55 | 87 | 66 |
| Bauen im Bestand | 10 | 170 | 71 | 83 | 50 | 85 | 80 | 70 | 83 | 75 |
| Rückbau & Schadstoffe | 7 | 15 | 16 | 60 | 48 | 70 | 75 | 55 | 83 | 65 |
| Dauerhaftigkeit | 8 | 39 | 33 | 58 | 49 | 70 | 75 | 55 | 84 | 65 |
| Mängel & Schäden | 7 | 141 | 26 | 83 | 49 | 85 | 80 | 70 | 83 | 75 |
| Schutz & Instandsetzung | 6 | 92 | 14 | 59 | 49 | 70 | 75 | 55 | 90 | 66 |
| Digitales | 6 | 11 | 7 | 59 | 49 | 70 | 75 | 55 | 58 | 61 |
| KI im Bauwesen | 9 | 18 | 0 | 59 | 45 | 70 | 75 | 55 | 90 | 66 |
| Praxiswissen | 6 | 10 | 5 | 59 | 46 | 70 | 75 | 55 | 90 | 66 |
| Infos & Quellen | 5 | 13 | 0 | 59 | 48 | 70 | 75 | 55 | 90 | 66 |
| Kuriositäten | 1 | 5 | 0 | 58 | 50 | 70 | 75 | 55 | 50 | 60 |
| Studium THA | 1 | 0 | 0 | 60 | 50 | 70 | 75 | 55 | – | 62 |
| Weiter@THA | 8 | 0 | 8 | 58 | 50 | 70 | 75 | 55 | 90 | 66 |
| Thesen & Projekte | 1 | 1 | 0 | 60 | 50 | 70 | 75 | 55 | 90 | 67 |
| Übungsaufgaben | 16 | 32 | 0 | 60 | 65 | 70 | 75 | 55 | 90 | 69 |
| Beispielrechnungen | 9 | 1773 | 405 | 56 | 50 | 70 | 75 | 55 | 50 | 59 |
| Übersicht & Zugang | 1 | 0 | 0 | 59 | 50 | 70 | 75 | 55 | – | 62 |
| Bauen im Bestand (VL) | 1 | 0 | 0 | 59 | 50 | 70 | 75 | 55 | – | 62 |
| Nachhaltiges Bauen (VL) | 1 | 0 | 0 | 59 | 50 | 70 | 75 | 55 | – | 62 |
| Bauschäden (VL) | 1 | 0 | 0 | 59 | 50 | 70 | 75 | 55 | – | 62 |
| Baustoffkunde (VL) | 1 | 0 | 0 | 59 | 50 | 70 | 75 | 55 | – | 62 |
| Instandhaltung (VL) | 1 | 0 | 0 | 59 | 50 | 70 | 75 | 55 | – | 62 |

**Gesamt (Vorher, Mittel über Gruppen): ca. 64 %** (Bauen im Bestand und Mängel & Schäden bereits nach Korrektur bewertet; ohne diese ca. 63 %). Stärken: Stoffumfang, Interaktivität, Praxisbezug. Schwächen: Normaktualität und -belege, modulübergreifende Konsistenz, fehlende Test-Stufe, Zahlformat.

## Arbeitspaket-Plan

Zuschnitt: Querschnitts-APs (mechanisch, app-weit, mit Prüfskript abgesichert) zuerst, weil sie die meisten Einzelmängel mit geringem Risiko beseitigen. Danach Fach-APs je Modulgruppe (1–2 komplexe bzw. bis 6 kleine Module je AP). Jedes AP endet mit PR, Vorher-Nachher-Tabelle D1–D6 und Übergabe-Block.

| AP | Inhalt | Module | Schwerpunkte / zu prüfende Normen & Quellen |
|---|---|---|---|
| AP 1 | Querschnitt Quellen & Sprache | alle | 688 generische DIN-Media-Links → stabile Suchlinks mit Normnummer (`dinmedia.de/de/suche?q=…`), beuth.de → DIN Media, prEN-Reste, Du→Sie, absolute Rechtsaussagen; Prüfskript `check:links` |
| AP 2 | Querschnitt Zahlformat & Rechner-Robustheit | alle mit Rechnern | `toFixed` in sichtbaren Ausgaben → `formatDeZahl`, NaN/Infinity-Schutz, Division durch 0, min/max der Eingaben; Prüfskript `check:zahlen` |
| AP 3 | Grundlagen | 8 | DIN 1301, DIN EN 1990/NA, MVV TB 2025/1, BauPVO 2024/3110 |
| AP 4 | Labor & Auswertung | 8 | DIN EN ISO/IEC 17025, DIN EN 12390-Reihe, DIN 1048-Reste, Messunsicherheit (GUM) |
| AP 5a/b | Baustoffe | 21 | DIN EN 197-1/-5, DIN 1164, DIN EN 459, DIN EN 13139/12620, DIN EN 10080/DIN 488 |
| AP 6a–d | Bauprodukte | 35 | BauPVO 2024, DIN EN 771/772, DIN EN 13162 ff., DIN EN 14351, DIN 18533/18534/18535 |
| AP 7a/b | Betontechnologie | 16 | DIN 1045-2:2023-08, DIN EN 206, DAfStb-Richtlinien (Alkali, WU, SVB), DIN 1045-3 |
| AP 8 | Massivbau (ohne Spannbeton) | 4 | DIN EN 1992-1-1/NA, Rissbreite NA(DE), Durchstanzen, Verankerung |
| AP 9 | Holzbau | 6 | DIN EN 1995-1-1/NA, DIN 68800-1…4, DIN EN 14080, DIN 4074 |
| AP 10 | Mechanik | 10 | Festigkeitslehre, Stabilität, Einheiten |
| AP 11 | Bauphysik + Innenausbau | 9 | DIN 4108-2/-3, DIN EN ISO 6946/13788, DIN 4109, GModG |
| AP 12 | Nachhaltigkeit | 8 | DIN EN 15804+A2, DIN EN 15978, QNG/BNB, ÖKOBAUDAT, KrWG/ErsatzbaustoffV |
| AP 13 | Rückbau & Schadstoffe | 7 | GefStoffV 2024, TRGS 519/521/524, VDI 6202, AVV, POP-V |
| AP 14 | Dauerhaftigkeit | 8 | DIN 1045-2 Expositionsklassen, Karbonatisierung, Frost, AKR, Korrosion |
| AP 15 | Schutz & Instandsetzung | 6 | TR Instandhaltung, DIN EN 1504, ZTV-ING 3-4, DIN EN ISO 12944, WTA |
| AP 16 | Digitales + KI im Bauwesen | 15 | DIN EN ISO 19650, IFC 4.3, EU AI Act (Fristen 2025–2027) |
| AP 17 | Praxiswissen, Infos & Quellen, Kuriositäten | 12 | HOAI 2021, VOB 2016/2019, BGB-Bauvertragsrecht, Quellenverzeichnis |
| AP 18 | Übungsaufgaben (Test-Stufe) | 16 | Lösungen gegen korrigierte Module, begründetes Feedback, Verknüpfung je Modul |
| AP 19 | Beispielrechnungen | 9 | Nachrechnung aller Beispiele, Zahlformat, Normbezug |
| AP 20 | Vorlesungen, Studium, Weiter@THA, Thesen, Allgemein | 25 | Aktualität Termine/Ordnungen, Konsistenz mit Fachmodulen |
| AP 21 | Nacharbeit geprüfte Gruppen | Rheologie, Spannbeton, Bestand, Schäden | nur D2 (Test-Stufe) und D6 (Zahlformat), Verdrahtung der Rechenkerne |
| AP 22 | Abschluss | alle | Cross-Modul-Konsistenz (zentrale Konstanten-Datei), Vorher-Nachher-Gesamtbewertung, Roadmap |

### Querschnittsregel D2 (4-Stufen-Lehrpfad)
Die Test-Stufe wird je Modul als Block mit 3–5 Prüffragen mit begründetem Feedback ergänzt. Dafür wird das vorhandene Quizsystem verwendet (kein neues Layout). Die Fragen prüfen die in „Grundlagen“ eingeführten Formeln und Kennwerte und deren Anwendung im Rechner.

## Vollständiges Modulinventar (Indikatoren)

Spalten:
- **F** = Formeln
- **R** = Rechner-Eingaben
- **Q** = Test-Stufe vorhanden
- **DIN** = generische DIN-Media-Links
- **bth** = beuth.de-Links
- **du** = Du-Anrede
- **abs** = absolute Rechtsaussagen
- **tF / fD** = `toFixed` / `formatDeZahl`

| Gruppe | Reiter | Komponente | Dateien | Zeilen | F | R | Q | DIN | bth | du | abs | tF | fD |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Allgemein | Startseite (`start`) | Startseite | 1 | 170 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Allgemein | Admin (THA) (`admin`) | Admin | 1 | 894 | 1 | 0 |  | 2 | 0 | 1 | 0 | 0 | 2 |
| Allgemein | Anleitung (`anleitung`) | Anleitung | 1 | 297 | 2 | 1 |  | 2 | 0 | 0 | 0 | 0 | 0 |
| Allgemein | Modulstruktur (`modulstruktur`) | Modulstruktur | 1 | 1639 | 2 | 0 | ✓ | 0 | 0 | 0 | 0 | 0 | 0 |
| Allgemein | Feedback (`feedback`) | Feedback | 1 | 326 | 0 | 0 |  | 2 | 0 | 0 | 0 | 0 | 0 |
| Allgemein | Changelog (`versionen`) | Versionen | 1 | 115 | 0 | 0 |  | 0 | 1 | 0 | 0 | 0 | 0 |
| Allgemein | Impressum (`impressum`) | Impressum | 1 | 173 | 0 | 0 |  | 0 | 0 | 0 | 1 | 0 | 0 |
| Allgemein | Datenschutz (`datenschutz`) | Datenschutz | 1 | 207 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Grundlagen | Modulinfos (`grundlagen_info`) | ModuleInfo:grundlagen | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Grundlagen | Baustoffkunde (`baustoffkunde`) | Baustoffkunde | 1 | 858 | 1 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Grundlagen | Einheiten (`einheiten`) | Einheiten | 1 | 348 | 20 | 1 |  | 3 | 0 | 0 | 0 | 0 | 0 |
| Grundlagen | Kennwerte (`materialkennwerte`) | Materialkennwerte | 1 | 395 | 2 | 0 |  | 0 | 5 | 0 | 0 | 0 | 0 |
| Grundlagen | Baustoffkenngrößen (`baustoffkenngroessen`) | Baustoffkenngroessen | 2 | 2864 | 114 | 39 |  | 5 | 0 | 0 | 0 | 53 | 0 |
| Grundlagen | Bauchemie (`bauchemie`) | Bauchemie | 1 | 1187 | 33 | 5 |  | 6 | 0 | 0 | 0 | 5 | 0 |
| Grundlagen | Eurocode (`sicherheitskonzept`) | Sicherheitskonzept | 1 | 316 | 2 | 3 |  | 0 | 2 | 0 | 0 | 7 | 0 |
| Grundlagen | Regulatives (`regularien`) | Regularien | 1 | 1314 | 2 | 0 |  | 1 | 0 | 0 | 2 | 0 | 0 |
| Labor & Auswertung | Modulinfos (`labor_info`) | ModuleInfo:labor | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Labor & Auswertung | Probenahme & Erkundung (`probenahme`) | Probenahme | 1 | 718 | 2 | 8 |  | 5 | 0 | 1 | 0 | 10 | 0 |
| Labor & Auswertung | Messen & Prüfen (`messen_pruefen`) | MessenPruefen | 1 | 1468 | 6 | 8 |  | 4 | 0 | 0 | 0 | 26 | 0 |
| Labor & Auswertung | Analytik & Diagnostik (`analytik`) | Analytik | 1 | 558 | 3 | 2 |  | 3 | 0 | 1 | 0 | 2 | 0 |
| Labor & Auswertung | Mechanische Prüfungen (`mechanische_pruefungen`) | MechanischePruefungen | 1 | 1099 | 7 | 17 |  | 7 | 0 | 0 | 0 | 22 | 0 |
| Labor & Auswertung | Virtuelle Versuche (`labor`) | Labor | 2 | 595 | 11 | 0 |  | 15 | 0 | 0 | 0 | 3 | 0 |
| Labor & Auswertung | Statistik (`statistik`) | Statistik | 2 | 1549 | 8 | 2 |  | 6 | 0 | 0 | 0 | 35 | 0 |
| Labor & Auswertung | Festbeton (Statistik) (`festbeton_statistik`) | FestbetonStatistik | 2 | 797 | 6 | 7 |  | 4 | 2 | 0 | 0 | 9 | 15 |
| Baustoffe | Modulinfos (`baustoffe_info`) | ModuleInfo:baustoffe | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Baustoffe | Gesteine (`gesteine`) | Gesteine | 1 | 309 | 5 | 0 |  | 7 | 0 | 0 | 0 | 0 | 0 |
| Baustoffe | Mauerwerk (`mauerwerk`) | Mauerwerk | 1 | 999 | 3 | 8 |  | 9 | 0 | 0 | 0 | 11 | 0 |
| Baustoffe | Putze & Mörtel (`putzemoertel`) | PutzeMoertel | 1 | 1268 | 25 | 8 |  | 6 | 0 | 0 | 0 | 9 | 0 |
| Baustoffe | Gips (`gips`) | Gips | 1 | 266 | 7 | 0 |  | 5 | 0 | 0 | 0 | 0 | 0 |
| Baustoffe | Kalk (`kalk`) | Kalk | 1 | 265 | 9 | 0 |  | 4 | 0 | 0 | 0 | 0 | 0 |
| Baustoffe | Lehm (`lehm`) | Lehm | 1 | 332 | 2 | 4 |  | 5 | 0 | 0 | 1 | 9 | 0 |
| Baustoffe | Erdbau & Böden (`erdbau`) | Erdbau | 1 | 409 | 2 | 3 |  | 4 | 0 | 0 | 0 | 0 | 0 |
| Baustoffe | Glas (`glas`) | Glas | 1 | 421 | 2 | 4 |  | 8 | 0 | 0 | 0 | 2 | 0 |
| Baustoffe | Stahl (`stahl`) | Stahl | 1 | 3168 | 46 | 10 |  | 6 | 0 | 0 | 0 | 34 | 0 |
| Baustoffe | Metalle (`metalle`) | Metalle | 1 | 458 | 2 | 0 |  | 6 | 0 | 0 | 1 | 2 | 0 |
| Baustoffe | Holz (`holz`) | Holz | 1 | 1286 | 4 | 13 |  | 5 | 0 | 0 | 0 | 38 | 0 |
| Baustoffe | Holzwerkstoffe (`holzwerkstoffe`) | Holzwerkstoffe | 1 | 261 | 2 | 0 |  | 5 | 0 | 0 | 0 | 0 | 0 |
| Baustoffe | Biogene Baustoffe (NaWaRo) (`nawaro`) | Nawaro | 1 | 1013 | 1 | 0 |  | 5 | 0 | 0 | 0 | 0 | 0 |
| Baustoffe | Asphalt & Bitumen (`asphalt`) | Asphalt | 1 | 1070 | 3 | 6 |  | 7 | 0 | 0 | 1 | 8 | 0 |
| Baustoffe | Kunststoffe (`kunststoffe`) | Kunststoffe | 1 | 682 | 3 | 1 |  | 5 | 0 | 0 | 0 | 2 | 0 |
| Baustoffe | Materialität & Ästhetik (`materialitaet_architektur`) | MaterialitaetArchitektur | 1 | 568 | 2 | 2 |  | 2 | 0 | 0 | 0 | 0 | 0 |
| Baustoffe | Dämmstoffe (`daemmstoffe`) | Daemmstoffe | 1 | 188 | 2 | 0 |  | 2 | 0 | 0 | 0 | 0 | 0 |
| Baustoffe | Ausbau & Abdichtung (`ausbau`) | Ausbau | 1 | 356 | 2 | 0 |  | 3 | 0 | 0 | 0 | 0 | 0 |
| Baustoffe | Faserverbund (CFK/GFK) (`faserverbund`) | Faserverbund | 1 | 397 | 3 | 1 |  | 3 | 0 | 0 | 0 | 5 | 0 |
| Baustoffe | Sonstige & Innovationen (`sonstiges`) | Sonstiges | 1 | 379 | 1 | 0 |  | 2 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Modulinfos (`bauprodukte_info`) | ModuleInfo:bauprodukte | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Baustoffindustrie (`bp_baustoffindustrie`) | BpBaustoffindustrie | 1 | 304 | 1 | 0 |  | 1 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Innovationen & F&E (`bp_innovationen`) | BpInnovationen | 1 | 950 | 3 | 0 |  | 2 | 0 | 0 | 1 | 0 | 0 |
| Bauprodukte | CE vs. Ü & MVV TB (`bp_recht_grundlagen`) | BpRechtliches | 1 | 965 | 2 | 0 |  | 2 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | AVCP-Systeme (`bp_recht_avcp`) | BpRechtliches | 1 | 965 | 2 | 0 |  | 2 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Konformität & Auditierung (`bp_recht_konformitaet`) | BpRechtliches | 1 | 965 | 2 | 0 |  | 2 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Normenarbeit im Bauwesen (`bp_recht_normen`) | BpRechtliches | 1 | 965 | 2 | 0 |  | 2 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Beton (Frisch/Fest) (`bp_beton`) | BpBeton | 1 | 240 | 2 | 0 |  | 2 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Betonfertigteile (`bp_betonfertigteile`) | BpBetonfertigteile | 1 | 860 | 2 | 0 |  | 5 | 0 | 1 | 0 | 0 | 0 |
| Bauprodukte | Betonwaren (`bp_betonwaren`) | BpBetonwaren | 1 | 767 | 2 | 0 |  | 5 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Mauerwerk (`bp_mauerwerk`) | BpMauerwerk | 1 | 693 | 2 | 0 |  | 4 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Dach & Fassade (`bp_dach_fassade`) | BpDachFassade | 1 | 528 | 15 | 7 |  | 1 | 0 | 0 | 0 | 17 | 0 |
| Bauprodukte | Dimensionierung (RStO 12/24) (`bp_verkehr_rsto`) | BpVerkehrswegebau | 1 | 1985 | 13 | 15 |  | 0 | 0 | 1 | 0 | 39 | 0 |
| Bauprodukte | Asphaltsorten (`bp_verkehr_asphalt`) | BpVerkehrswegebau | 1 | 1985 | 13 | 15 |  | 0 | 0 | 1 | 0 | 39 | 0 |
| Bauprodukte | Bitumen & Gesteine (`bp_verkehr_bitumen`) | BpVerkehrswegebau | 1 | 1985 | 13 | 15 |  | 0 | 0 | 1 | 0 | 39 | 0 |
| Bauprodukte | Labor-Prüfmethoden (`bp_verkehr_pruefung`) | BpVerkehrswegebau | 1 | 1985 | 13 | 15 |  | 0 | 0 | 1 | 0 | 39 | 0 |
| Bauprodukte | Betondecken (ZTV) (`bp_verkehr_betondecken`) | BpVerkehrswegebau | 1 | 1985 | 13 | 15 |  | 0 | 0 | 1 | 0 | 39 | 0 |
| Bauprodukte | Tiefbau & Entwässerung (`bp_verkehr_tiefbau`) | BpVerkehrswegebau | 1 | 1985 | 13 | 15 |  | 0 | 0 | 1 | 0 | 39 | 0 |
| Bauprodukte | Bahnbau (Kompakt) (`bp_verkehr_bahn`) | BpVerkehrswegebau | 1 | 1985 | 13 | 15 |  | 0 | 0 | 1 | 0 | 39 | 0 |
| Bauprodukte | Tunnelbau (Vortrieb) (`bp_verkehr_tunnel`) | BpVerkehrswegebau | 1 | 1985 | 13 | 15 |  | 0 | 0 | 1 | 0 | 39 | 0 |
| Bauprodukte | Trockenbau (`bp_trockenbau`) | BpTrockenbau | 1 | 989 | 4 | 1 |  | 6 | 0 | 0 | 0 | 8 | 0 |
| Bauprodukte | Putz & Estrich (`bp_putz_estrich`) | BpPutzEstrich | 1 | 418 | 8 | 0 |  | 5 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Abdichtungen (`bp_abdichtung`) | BpAbdichtung | 1 | 1354 | 2 | 5 |  | 3 | 0 | 1 | 2 | 4 | 0 |
| Bauprodukte | Dämmstoffe (`bp_daemmung`) | BpDaemmung | 1 | 676 | 3 | 0 |  | 5 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Befestigungstechnik (`bp_befestigung`) | BpBefestigung | 1 | 331 | 2 | 0 |  | 1 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Kleb- & Dichtstoffe (`bp_klebstoffe`) | BpKlebstoffe | 1 | 348 | 2 | 0 |  | 3 | 0 | 0 | 0 | 0 | 0 |
| Bauprodukte | Farben & Lacke (`bp_farben_lacke`) | BpFarbenLacke | 1 | 1717 | 2 | 6 |  | 3 | 0 | 0 | 1 | 6 | 0 |
| Bauprodukte | Betonzusatzmittel (`bp_betonzusatzmittel`) | BpBetonzusatzmittel | 1 | 1101 | 5 | 7 |  | 3 | 0 | 1 | 0 | 14 | 0 |
| Bauprodukte | Holzprodukte (`bp_holzprodukte`) | BpHolzprodukte | 1 | 727 | 3 | 5 |  | 4 | 0 | 0 | 0 | 14 | 0 |
| Bauprodukte | Kunststoffe (`bp_kunststoffe`) | BpKunststoffe | 1 | 1269 | 6 | 4 |  | 3 | 0 | 0 | 0 | 13 | 0 |
| Bauprodukte | Mineralische Werkstoffe (`bp_mineralisch`) | BpMineralisch | 1 | 507 | 3 | 2 |  | 3 | 0 | 0 | 1 | 8 | 0 |
| Bauprodukte | Gläser & Fenster (`bp_glaeser`) | BpGlaeser | 1 | 1559 | 14 | 8 |  | 4 | 0 | 0 | 0 | 19 | 0 |
| Bauprodukte | Lehmbauprodukte (`bp_lehmbauprodukte`) | BpLehmbauprodukte | 1 | 586 | 5 | 2 |  | 5 | 0 | 0 | 0 | 18 | 0 |
| Bauprodukte | Metallische Werkstoffe (`bp_metallisch`) | BpMetallisch | 1 | 843 | 3 | 3 |  | 5 | 0 | 0 | 0 | 11 | 0 |
| Bauprodukte | Stahlbauprofile (`bp_stahlbauprofile`) | BpStahlbauprofile | 1 | 649 | 3 | 5 |  | 2 | 0 | 0 | 0 | 14 | 0 |
| Betontechnologie | Modulinfos (`beton_info`) | BetonInfo | 1 | 602 | 1 | 0 |  | 4 | 0 | 0 | 0 | 0 | 0 |
| Betontechnologie | Beton A-Z (`beton_a_z`) | BetonAZ | 1 | 632 | 2 | 1 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Betontechnologie | Grundlagen (`grundlagen`) | Grundlagen | 2 | 1919 | 5 | 0 |  | 4 | 0 | 0 | 2 | 0 | 0 |
| Betontechnologie | Bindemittel (`bindemittel`) | Bindemittel | 2 | 1344 | 55 | 7 |  | 3 | 3 | 0 | 0 | 9 | 0 |
| Betontechnologie | Mischungsberechnung (`mischungsberechnung`) | Mischungsberechnung | 3 | 3135 | 10 | 40 |  | 7 | 3 | 0 | 0 | 125 | 0 |
| Betontechnologie | Herstellung & Einbau (`herstellung_einbau`) | HerstellungEinbau | 1 | 192 | 2 | 0 |  | 0 | 2 | 0 | 0 | 0 | 0 |
| Betontechnologie | Frischbeton (`frischbeton`) | Frischbeton | 4 | 1077 | 9 | 13 |  | 11 | 0 | 0 | 0 | 13 | 0 |
| Betontechnologie | Hydratation & Folgen (`hydratation_folgen`) | HydratationFolgen | 10 | 4734 | 70 | 44 |  | 6 | 12 | 2 | 0 | 93 | 0 |
| Betontechnologie | Nachbehandlung (`nachbehandlung`) | Nachbehandlung | 1 | 320 | 3 | 4 |  | 0 | 2 | 0 | 0 | 1 | 0 |
| Betontechnologie | Festbeton (`festbeton`) | Festbeton | 1 | 678 | 7 | 6 |  | 3 | 0 | 0 | 0 | 19 | 0 |
| Betontechnologie | Sichtbeton (SB 1–4) (`sichtbeton`) | Sichtbeton | 1 | 200 | 2 | 0 |  | 0 | 3 | 0 | 0 | 0 | 0 |
| Betontechnologie | Sonderbetone (`sonderbetone`) | Sonderbetone | 16 | 2550 | 33 | 4 |  | 15 | 18 | 0 | 0 | 8 | 0 |
| Betontechnologie | Entwicklungen (`innovative_werkstoffe`) | InnovativeWerkstoffe | 1 | 1451 | 16 | 5 |  | 1 | 0 | 2 | 0 | 8 | 0 |
| Betontechnologie | Qualitätssicherung (`qualitaetssicherung`) | Qualitaetssicherung | 5 | 2478 | 11 | 5 |  | 5 | 8 | 2 | 1 | 8 | 0 |
| Betontechnologie | Expositionsklassen (`expositionsklassen`) | Betonpraxis | 1 | 1684 | 6 | 8 |  | 4 | 0 | 0 | 0 | 5 | 9 |
| Betontechnologie | Betonpraxis (`betonpraxis`) | Betonpraxis | 1 | 1684 | 6 | 8 |  | 4 | 0 | 0 | 0 | 5 | 9 |
| Massivbau | Modulinfos (`stahlbeton_info`) | ModuleInfo:stahlbeton | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Massivbau | Stahlbeton (`stahlbeton_bemessung`) | Stahlbetonbemessung | 9 | 4831 | 83 | 46 | ✓ | 10 | 0 | 0 | 0 | 96 | 0 |
| Massivbau | Spannbeton (`spannbeton`) | Spannbeton | 7 | 9874 | 436 | 42 | ✓ | 0 | 0 | 0 | 1 | 180 | 84 |
| Massivbau | WU-Bauwerke (Weiße Wannen) (`wu-bauwerke`) | WUBauwerke | 1 | 945 | 32 | 3 |  | 5 | 0 | 0 | 0 | 0 | 10 |
| Massivbau | Carbonbeton (`carbonbeton`) | Carbonbeton | 1 | 419 | 3 | 6 |  | 1 | 0 | 0 | 0 | 2 | 8 |
| Holzbau | Modulinfos (`holzbau_info`) | HolzbauBeta | 1 | 2242 | 55 | 18 |  | 3 | 0 | 0 | 0 | 0 | 37 |
| Holzbau | Werkstoffe & dataholz (`holzbau_werkstoffe`) | HolzbauBeta | 1 | 2242 | 55 | 18 |  | 3 | 0 | 0 | 0 | 0 | 37 |
| Holzbau | Konstruktionsweisen (`holzbau_konstruktion`) | HolzbauBeta | 1 | 2242 | 55 | 18 |  | 3 | 0 | 0 | 0 | 0 | 37 |
| Holzbau | Bemessung (EC5) (`holzbau_bemessung`) | HolzbauBeta | 1 | 2242 | 55 | 18 |  | 3 | 0 | 0 | 0 | 0 | 37 |
| Holzbau | Verbindungen & Anschlüsse (`holzbau_verbindung`) | HolzbauBeta | 1 | 2242 | 55 | 18 |  | 3 | 0 | 0 | 0 | 0 | 37 |
| Holzbau | Bauphysik & Brandschutz (`holzbau_bauphysik`) | HolzbauBeta | 1 | 2242 | 55 | 18 |  | 3 | 0 | 0 | 0 | 0 | 37 |
| Innenausbau | Sammlung (`innenausbau`) | Innenausbau | 1 | 970 | 4 | 1 |  | 5 | 0 | 0 | 0 | 7 | 0 |
| Mechanik | Modulinfos (`mechanik_info`) | ModuleInfo:mechanik | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Mechanik | Mechan. Kenngrößen (`mechanische_kenngroessen`) | MechanischeKenngroessen | 1 | 2527 | 150 | 12 |  | 0 | 4 | 0 | 0 | 62 | 0 |
| Mechanik | Formänderungen (`formaenderungen`) | Formaenderungen | 1 | 407 | 2 | 0 |  | 2 | 0 | 0 | 0 | 0 | 0 |
| Mechanik | Materialmodelle (`materialmodelle`) | Materialmodelle | 1 | 1022 | 25 | 4 |  | 4 | 0 | 0 | 0 | 4 | 5 |
| Mechanik | E-Modul & Mikromechanik (`emodul`) | EModul | 1 | 369 | 4 | 4 |  | 2 | 0 | 0 | 0 | 5 | 0 |
| Mechanik | Festigkeitsberechnungen (`festigkeit`) | Festigkeitsberechnungen | 1 | 396 | 3 | 1 |  | 3 | 0 | 0 | 0 | 0 | 6 |
| Mechanik | Baustatik (`baustatik`) | Baustatik | 1 | 853 | 3 | 11 |  | 3 | 0 | 0 | 0 | 1 | 17 |
| Mechanik | Knicken (Euler) (`knicken`) | Knicken | 1 | 530 | 9 | 5 |  | 3 | 0 | 0 | 0 | 1 | 11 |
| Mechanik | Bruchmechanik (`bruchmechanik`) | Bruchmechanik | 1 | 273 | 2 | 4 |  | 1 | 0 | 0 | 0 | 1 | 0 |
| Mechanik | Bodenmechanik (`bodenmechanik`) | Bodenmechanik | 1 | 750 | 5 | 14 |  | 4 | 0 | 0 | 0 | 0 | 12 |
| Bauphysik | Modulinfos (`bauphysik_info`) | ModuleInfo:bauphysik | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Bauphysik | Bauphysik (Wärme & Feuchte) (`bauphysik`) | Bauphysik | 1 | 1680 | 3 | 12 |  | 3 | 0 | 0 | 0 | 5 | 33 |
| Bauphysik | Thermische Eigenschaften & Dämmstoffe (`waermeeigenschaften`) | Waermeeigenschaften | 1 | 388 | 6 | 6 |  | 2 | 0 | 0 | 0 | 7 | 0 |
| Bauphysik | Feuchteschutz & Tauwasser (`feuchteschutz`) | Feuchteschutz | 1 | 706 | 3 | 4 |  | 0 | 0 | 0 | 0 | 14 | 0 |
| Bauphysik | Innendämmung vs. Außendämmung (`daemmung_vergleich`) | DaemmungVergleich | 1 | 180 | 2 | 0 |  | 1 | 0 | 0 | 0 | 0 | 0 |
| Bauphysik | Schallschutz (`schallschutz`) | Schallschutz | 1 | 368 | 2 | 1 |  | 0 | 3 | 0 | 0 | 5 | 0 |
| Bauphysik | Brandschutz (`brandschutz`) | Brandschutz | 1 | 406 | 2 | 3 |  | 3 | 0 | 0 | 0 | 0 | 5 |
| Bauphysik | Energieausweis (`energieausweis`) | Energieausweis | 1 | 1157 | 47 | 2 |  | 2 | 0 | 0 | 0 | 0 | 1 |
| Nachhaltigkeit | Modulinfos (`nachhaltigkeit_info`) | ModuleInfo:nachhaltigkeit | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Nachhaltigkeit | Daten & Regeln (`nachhaltigkeit_daten_regeln`) | NachhaltigkeitDatenRegeln | 1 | 1496 | 5 | 1 |  | 4 | 0 | 0 | 4 | 0 | 4 |
| Nachhaltigkeit | Materialoptimierung (`materialoptimierung`) | Materialoptimierung | 1 | 1548 | 28 | 1 |  | 5 | 0 | 1 | 0 | 0 | 5 |
| Nachhaltigkeit | Ökobilanzierung (LCA) (`oekobilanz_lca`) | OekobilanzLCA | 7 | 8447 | 55 | 30 | ✓ | 13 | 0 | 3 | 0 | 30 | 74 |
| Nachhaltigkeit | Zertifizierung & Deklarationen (`zertifizierung_siegel`) | ZertifizierungSiegel | 3 | 1529 | 5 | 1 |  | 1 | 0 | 0 | 0 | 0 | 0 |
| Nachhaltigkeit | Kreislaufwirtschaft (`kreislauf_dpp`) | Kreislaufwirtschaft | 1 | 1436 | 2 | 14 |  | 0 | 0 | 0 | 1 | 0 | 7 |
| Nachhaltigkeit | Ressourcen & Umwelt (`ressourcen_umwelt`) | RessourcenUmwelt | 3 | 1262 | 5 | 0 |  | 5 | 1 | 0 | 0 | 0 | 0 |
| Nachhaltigkeit | Lebenszyklus & Kosten (`lebenszyklus_kosten`) | LebenszyklusKosten | 4 | 1906 | 23 | 8 |  | 4 | 1 | 0 | 0 | 1 | 6 |
| Bauen im Bestand | Modulinfos (`bestand_info`) | ModuleInfo:bestand | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Bauen im Bestand | Altbauatlas (`bestand`) | Bestand | 1 | 884 | 7 | 4 |  | 2 | 0 | 0 | 0 | 0 | 27 |
| Bauen im Bestand | Bauwerkserfassung (`bauwerkserfassung`) | Bauwerkserfassung | 1 | 720 | 3 | 6 |  | 2 | 0 | 0 | 0 | 0 | 11 |
| Bauen im Bestand | Denkmalpflege (`denkmalpflege`) | Denkmalpflege | 1 | 459 | 2 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Bauen im Bestand | Modernisierung & GEG (`modernisierung`) | Modernisierung | 1 | 1019 | 18 | 6 |  | 3 | 0 | 0 | 0 | 0 | 23 |
| Bauen im Bestand | Bauwerksdiagnose & ZfP (`bauwerksuntersuchung`) | Bauwerksuntersuchung | 7 | 4854 | 32 | 26 |  | 25 | 0 | 0 | 5 | 19 | 18 |
| Bauen im Bestand | Historische Kennwerte (`historisch`) | HistorischeMaterialkennwerte | 1 | 1660 | 74 | 15 |  | 7 | 0 | 0 | 0 | 51 | 0 |
| Bauen im Bestand | Hist. Bauweisen (`historische_bauweisen`) | HistorischeBauweisen | 1 | 913 | 25 | 14 |  | 1 | 0 | 0 | 0 | 0 | 27 |
| Bauen im Bestand | Hist. Bauprodukte (`historische_bauprodukte`) | HistorischeBauprodukte | 1 | 948 | 7 | 0 |  | 3 | 0 | 0 | 0 | 0 | 0 |
| Bauen im Bestand | Checklisten (`bestand_checklisten`) | BestandChecklisten | 1 | 372 | 2 | 0 |  | 1 | 0 | 0 | 0 | 0 | 0 |
| Rückbau & Schadstoffe | Modulinfos (`rueckbau_info`) | ModuleInfo:rueckbau | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Rückbau & Schadstoffe | Rückbau & Material (`rueckbau`) | Rueckbau | 1 | 1624 | 2 | 1 |  | 3 | 0 | 0 | 2 | 0 | 0 |
| Rückbau & Schadstoffe | Boden- & Materialaufbereitung (`boden_materialaufbereitung`) | BodenMaterialAufbereitung | 1 | 1232 | 4 | 4 |  | 0 | 0 | 0 | 2 | 0 | 1 |
| Rückbau & Schadstoffe | Abfälle & Altlasten (`abfaelle`) | Abfaelle | 1 | 2927 | 3 | 2 |  | 0 | 0 | 3 | 7 | 0 | 1 |
| Rückbau & Schadstoffe | Schad- und Gefahrstoffe (`schadstoffe`) | Schadstoffe | 1 | 1337 | 2 | 5 |  | 0 | 0 | 1 | 3 | 0 | 8 |
| Rückbau & Schadstoffe | Ressourceneffizienz (`ressourceneffizienz`) | Ressourceneffizienz | 1 | 1428 | 2 | 4 |  | 1 | 0 | 2 | 0 | 18 | 0 |
| Rückbau & Schadstoffe | Checklisten (`rueckbau_checklisten`) | RueckbauChecklisten | 1 | 425 | 2 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Dauerhaftigkeit | Modulinfos (`dauerhaftigkeit_info`) | ModuleInfo:dauerhaftigkeit | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Dauerhaftigkeit | Prinzipien & Übersicht (`dauerhaftigkeit`) | Dauerhaftigkeit | 1 | 1961 | 2 | 4 |  | 3 | 0 | 1 | 0 | 0 | 13 |
| Dauerhaftigkeit | Bewehrungskorrosion (`korrosion`) | Korrosion | 1 | 1246 | 5 | 16 |  | 0 | 3 | 0 | 0 | 0 | 6 |
| Dauerhaftigkeit | Betonkorrosion (`schadreaktionen_beton`) | SchadreaktionenBeton | 1 | 990 | 9 | 8 |  | 0 | 3 | 0 | 0 | 0 | 8 |
| Dauerhaftigkeit | Holzkorrosion (`holzkorrosion`) | Holzkorrosion | 1 | 1000 | 8 | 1 |  | 4 | 0 | 0 | 1 | 0 | 0 |
| Dauerhaftigkeit | Metallkorrosion (`metallkorrosion`) | Metallkorrosion | 1 | 969 | 11 | 0 |  | 6 | 0 | 0 | 0 | 0 | 0 |
| Dauerhaftigkeit | Weitere Organik (`weitere_organik`) | WeitereOrganik | 1 | 739 | 2 | 4 |  | 0 | 3 | 1 | 0 | 1 | 0 |
| Dauerhaftigkeit | Checklisten (`dauerhaftigkeit_checklisten`) | DauerhaftigkeitChecklisten | 1 | 316 | 2 | 0 |  | 2 | 0 | 0 | 0 | 0 | 0 |
| Mängel & Schäden | Modulinfos (`schaeden_info`) | ModuleInfo:schaeden | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Mängel & Schäden | Recht & Grundlagen (`bauschaeden`) | Bauschaeden | 1 | 1328 | 3 | 0 |  | 6 | 0 | 0 | 2 | 0 | 0 |
| Mängel & Schäden | Typische Bauschäden (`schadensbilder`) | TypischeBauschaeden | 1 | 1003 | 109 | 0 |  | 3 | 0 | 1 | 0 | 0 | 0 |
| Mängel & Schäden | Tragwerksmonitoring (SHM) (`bauwerksunters_monitoring`) | Bauwerksunters_Monitoring | 5 | 3938 | 22 | 22 |  | 20 | 0 | 2 | 2 | 19 | 4 |
| Mängel & Schäden | Zustandsbewertung (`vdi6200`) | Zustandsbewertung | 1 | 1214 | 2 | 4 |  | 0 | 1 | 0 | 0 | 0 | 3 |
| Mängel & Schäden | Große Materialschäden & Einstürze (`material_schaeden_gross`) | MaterialSchaedenGross | 1 | 1580 | 5 | 0 |  | 4 | 0 | 0 | 0 | 0 | 0 |
| Mängel & Schäden | Schadensaufnahme-Checklisten (`schaeden_checklisten`) | SchaedenChecklisten | 1 | 275 | 0 | 0 |  | 0 | 0 | 0 | 2 | 0 | 0 |
| Schutz & Instandsetzung | Modulinfos (`instandsetzung_info`) | ModuleInfo:instandsetzung | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Schutz & Instandsetzung | Schutz- & Instands.-Grundlagen (`schutz_grundlagen`) | SchutzGrundlagen | 1 | 823 | 40 | 1 |  | 5 | 0 | 0 | 0 | 0 | 0 |
| Schutz & Instandsetzung | Instandsetzung nach Material (`instandsetzung_materialien`) | InstandsetzungMaterialien | 1 | 912 | 29 | 0 |  | 0 | 2 | 0 | 0 | 0 | 0 |
| Schutz & Instandsetzung | Stahlbetoninstandhaltung (`instandhaltung`) | Stahlbetoninstandhaltung | 1 | 2012 | 4 | 8 |  | 3 | 0 | 0 | 0 | 0 | 5 |
| Schutz & Instandsetzung | WTA-Merkblätter (`wta`) | WTA | 1 | 1205 | 17 | 5 |  | 1 | 0 | 1 | 0 | 0 | 2 |
| Schutz & Instandsetzung | Instandsetzungs-Checklisten (`instandsetzung_checklisten`) | InstandsetzungChecklisten | 1 | 722 | 2 | 0 |  | 0 | 2 | 0 | 0 | 0 | 0 |
| Digitales | Modulinfos (`digitales_info`) | ModuleInfo:digitales | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Digitales | Online-Tools & Rechner (`online_tools`) | OnlineTools | 1 | 1151 | 2 | 0 |  | 5 | 0 | 0 | 0 | 0 | 0 |
| Digitales | BIM für Baustoffe (`bim_baustoffe`) | BimBaustoffe | 1 | 420 | 2 | 4 |  | 2 | 0 | 0 | 0 | 10 | 0 |
| Digitales | Materialdatenbanken (`materialdatenbanken`) | Materialdatenbanken | 1 | 823 | 2 | 1 |  | 1 | 0 | 0 | 0 | 6 | 0 |
| Digitales | Materialpässe (`materialpaesse`) | Materialpaesse | 1 | 704 | 3 | 2 |  | 1 | 0 | 0 | 0 | 4 | 0 |
| Digitales | Digitaler Produktpass (DPP) (`dpp`) | DppEpd | 1 | 946 | 2 | 0 |  | 3 | 0 | 2 | 0 | 16 | 0 |
| KI im Bauwesen | Überblick & Grundlagen (`ki_ueberblick`) | KiBaustoffe | 1 | 872 | 2 | 0 |  | 2 | 0 | 4 | 0 | 0 | 0 |
| KI im Bauwesen | Systemarchitektur (`ki_system`) | KiBaustoffe | 1 | 872 | 2 | 0 |  | 2 | 0 | 4 | 0 | 0 | 0 |
| KI im Bauwesen | Prompting-Praxis (`ki_prompting`) | KiBaustoffe | 1 | 872 | 2 | 0 |  | 2 | 0 | 4 | 0 | 0 | 0 |
| KI im Bauwesen | LLM-Praxis (`ki_llmpraxis`) | KiBaustoffe | 1 | 872 | 2 | 0 |  | 2 | 0 | 4 | 0 | 0 | 0 |
| KI im Bauwesen | Tools für Thesen (`ki_thesen`) | KiBaustoffe | 1 | 872 | 2 | 0 |  | 2 | 0 | 4 | 0 | 0 | 0 |
| KI im Bauwesen | Fehler, Recht & Ethik (`ki_recht_ethik`) | KiBaustoffe | 1 | 872 | 2 | 0 |  | 2 | 0 | 4 | 0 | 0 | 0 |
| KI im Bauwesen | Lokale KI (LM Studio) (`ki_lokal`) | KiBaustoffe | 1 | 872 | 2 | 0 |  | 2 | 0 | 4 | 0 | 0 | 0 |
| KI im Bauwesen | Unabhängige KI-Seiten (`ki_ressourcen`) | KiBaustoffe | 1 | 872 | 2 | 0 |  | 2 | 0 | 4 | 0 | 0 | 0 |
| KI im Bauwesen | Onlinekurse (`ki_onlinekurse`) | KiBaustoffe | 1 | 872 | 2 | 0 |  | 2 | 0 | 4 | 0 | 0 | 0 |
| Praxiswissen | Modulinfos (`praxiswissen_info`) | ModuleInfo:praxiswissen | 0 | 0 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Praxiswissen | Planung & Ausschreibung (`px_planung`) | Praxiswissen | 1 | 902 | 2 | 0 |  | 2 | 0 | 1 | 3 | 0 | 0 |
| Praxiswissen | Bauleitung & Baustelle (`px_bauleitung`) | Praxiswissen | 1 | 902 | 2 | 0 |  | 2 | 0 | 1 | 3 | 0 | 0 |
| Praxiswissen | Bautagebuch (`px_bautagebuch`) | Bautagebuch | 1 | 1431 | 2 | 5 |  | 1 | 0 | 1 | 1 | 0 | 0 |
| Praxiswissen | Produktherstellung & QS (`px_produktion`) | Praxiswissen | 1 | 902 | 2 | 0 |  | 2 | 0 | 1 | 3 | 0 | 0 |
| Praxiswissen | Karrierestart & Soft Skills (`px_karriere`) | Praxiswissen | 1 | 902 | 2 | 0 |  | 2 | 0 | 1 | 3 | 0 | 0 |
| Infos & Quellen | Software & Tools (`software`) | Software | 1 | 187 | 1 | 0 |  | 0 | 1 | 0 | 0 | 0 | 0 |
| Infos & Quellen | Glossar (`glossar`) | Glossar | 1 | 401 | 5 | 0 |  | 6 | 0 | 0 | 0 | 0 | 0 |
| Infos & Quellen | Fortbildungen (`fortbildungen`) | Fortbildungen | 1 | 1166 | 2 | 0 |  | 0 | 0 | 0 | 4 | 0 | 0 |
| Infos & Quellen | Informationsquellen (`informationsquellen`) | Informationsquellen | 1 | 687 | 2 | 0 |  | 1 | 0 | 5 | 3 | 0 | 0 |
| Infos & Quellen | Literatur (`literatur`) | Literatur | 1 | 681 | 3 | 0 |  | 4 | 0 | 1 | 0 | 0 | 0 |
| Kuriositäten | Kuriositäten & Rekorde (`kuriositaeten`) | Kuriositaeten | 1 | 924 | 5 | 0 |  | 0 | 2 | 0 | 0 | 1 | 0 |
| Studium THA | Portal app.tha.de (`studium_tha`) | StudiumTHA | 1 | 208 | 0 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Weiter@THA | Alle Studienangebote (`weiter_tha`) | WeiterTHA | 1 | 552 | 0 | 1 |  | 3 | 0 | 0 | 0 | 0 | 0 |
| Weiter@THA | Master Bauingenieurwesen (`weiter_bauing`) | WeiterTHA | 1 | 552 | 0 | 1 |  | 3 | 0 | 0 | 0 | 0 | 0 |
| Weiter@THA | Master Projektmanagement (`weiter_pm`) | WeiterTHA | 1 | 552 | 0 | 1 |  | 3 | 0 | 0 | 0 | 0 | 0 |
| Weiter@THA | Fachingenieur Ausbau (`weiter_ausbau`) | WeiterTHA | 1 | 552 | 0 | 1 |  | 3 | 0 | 0 | 0 | 0 | 0 |
| Weiter@THA | Fachingenieur Fassade (`weiter_fassade`) | WeiterTHA | 1 | 552 | 0 | 1 |  | 3 | 0 | 0 | 0 | 0 | 0 |
| Weiter@THA | Fachingenieur Holzbau (`weiter_holzbau`) | WeiterTHA | 1 | 552 | 0 | 1 |  | 3 | 0 | 0 | 0 | 0 | 0 |
| Weiter@THA | TTZ Aichach (digital. Holzbau) (`weiter_ttz`) | WeiterTHA | 1 | 552 | 0 | 1 |  | 3 | 0 | 0 | 0 | 0 | 0 |
| Weiter@THA | MAPR (Applied Research) (`weiter_mapr`) | WeiterTHA | 1 | 552 | 0 | 1 |  | 3 | 0 | 0 | 0 | 0 | 0 |
| Thesen & Projekte | Thesen & Semesterprojekte (`thesen_projekte`) | ThesenProjekte | 1 | 471 | 1 | 0 |  | 0 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Dynamischer Prüfungs-Trainer (`aufgaben_trainer`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Bauforensik & Fallstudien (`aufgaben_komplex`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Wissenscheck & Wissenslücken (`aufgaben_quiz`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Betontechnologie (`aufgaben_beton`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Massivbau (`aufgaben_stahlbeton`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Holzbau (`aufgaben_holzbau`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Baustoffe (`aufgaben_weitere`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Bauprodukte & Baurecht (`aufgaben_bauprodukte`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Mechanik (`aufgaben_mechanik`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Bauphysik (`aufgaben_bauphysik`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Nachhaltigkeit (`aufgaben_nachhaltigkeit`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Bauen im Bestand (`aufgaben_bestand`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Dauerhaftigkeit & Schäden (`aufgaben_dauerhaftigkeit`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Rückbau & Schadstoffe (`aufgaben_rueckbau`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Labor & Grundlagen (`aufgaben_kennwerte`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Übungsaufgaben | Digitales, BIM & KI (`aufgaben_digitales`) | Aufgaben | 1 | 404 | 2 | 0 | ✓ | 1 | 0 | 0 | 0 | 0 | 0 |
| Beispielrechnungen | Bauphysik: U-Wert (`rechnung_u_wert`) | Beispielrechnungen | 1 | 2924 | 197 | 45 |  | 7 | 0 | 0 | 0 | 187 | 0 |
| Beispielrechnungen | Beton: Mischungsentwurf (`rechnung_beton`) | Beispielrechnungen | 1 | 2924 | 197 | 45 |  | 7 | 0 | 0 | 0 | 187 | 0 |
| Beispielrechnungen | Massivbau: Biegung (`rechnung_stahlbeton`) | Beispielrechnungen | 1 | 2924 | 197 | 45 |  | 7 | 0 | 0 | 0 | 187 | 0 |
| Beispielrechnungen | Holzbau: Stützenknicken (`rechnung_holzbau`) | Beispielrechnungen | 1 | 2924 | 197 | 45 |  | 7 | 0 | 0 | 0 | 187 | 0 |
| Beispielrechnungen | Mauerwerk: Tragfähigkeit (`rechnung_mauerwerk`) | Beispielrechnungen | 1 | 2924 | 197 | 45 |  | 7 | 0 | 0 | 0 | 187 | 0 |
| Beispielrechnungen | Nachhaltigkeit & Dauerhaftigkeit (`rechnung_nachhaltigkeit`) | Beispielrechnungen | 1 | 2924 | 197 | 45 |  | 7 | 0 | 0 | 0 | 187 | 0 |
| Beispielrechnungen | Bauen im Bestand (`rechnung_bestand`) | Beispielrechnungen | 1 | 2924 | 197 | 45 |  | 7 | 0 | 0 | 0 | 187 | 0 |
| Beispielrechnungen | Bauakustik: Schallschutz (`rechnung_schallschutz`) | Beispielrechnungen | 1 | 2924 | 197 | 45 |  | 7 | 0 | 0 | 0 | 187 | 0 |
| Beispielrechnungen | Brandschutz: Heißbemessung (`rechnung_brandschutz`) | Beispielrechnungen | 1 | 2924 | 197 | 45 |  | 7 | 0 | 0 | 0 | 187 | 0 |
| Übersicht & Zugang | Übersicht & Zugang (`vl_ueberblick`) | Vorlesungen | 1 | 884 | 0 | 0 |  | 2 | 0 | 0 | 1 | 0 | 0 |
| Bauen im Bestand (VL) | Bauen im Bestand (1/2 SWS) (`vl_bauen_im_bestand`) | Vorlesungen | 1 | 884 | 0 | 0 |  | 2 | 0 | 0 | 1 | 0 | 0 |
| Nachhaltiges Bauen (VL) | Nachhaltiges Bauen (2 SWS) (`vl_nachhaltiges_bauen`) | Vorlesungen | 1 | 884 | 0 | 0 |  | 2 | 0 | 0 | 1 | 0 | 0 |
| Bauschäden (VL) | Bauschäden (1/2 SWS) (`vl_bauschaeden`) | Vorlesungen | 1 | 884 | 0 | 0 |  | 2 | 0 | 0 | 1 | 0 | 0 |
| Baustoffkunde (VL) | Baustoffkunde (2-4 SWS) (`vl_baustoffkunde`) | Vorlesungen | 1 | 884 | 0 | 0 |  | 2 | 0 | 0 | 1 | 0 | 0 |
| Instandhaltung (VL) | Instandhaltung (4 SWS) (`vl_instandhaltung`) | Vorlesungen | 1 | 884 | 0 | 0 |  | 2 | 0 | 0 | 1 | 0 | 0 |
