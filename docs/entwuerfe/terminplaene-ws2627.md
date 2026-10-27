# Entwürfe: Terminpläne der Lernpfade im WS 2026/27 und TTZ-Kursliste

Stand: 27.10.2026 · **Alle Angaben Entwurf, zu bestätigen durch Prof. Dr.-Ing. Jürgen Huber.** Termine, Themen und Module stammen aus `src/data/lernpfade.ts` (Status `entwurf`), die Kursliste aus `src/data/ttzKurse.ts`. Diese Datei wurde aus den Daten erzeugt; maßgeblich sind die Daten im Code.

## Semesterrahmen WS 2026/27 (THA)

| Angabe | Datum |
|---|---|
| Semesterdauer | 01.10.2026 – 14.03.2027 |
| Vorlesungszeit | Do 01.10.2026 – Fr 22.01.2027 |
| Vorlesungsfrei (Weihnachten) | Do 24.12.2026 – Mi 06.01.2027 |
| Prüfungsanmeldung | 02.11.2026 – 03.12.2026 |
| Leistungsnachweise AW-Fächer | Sa 16.01.2027 |
| Hauptprüfungstag, Ersatzprüfungstag | Mo 18.01.2027 |
| Bekanntgabe der Noten | 11.02.2027 |

Quellen: THA, Semestertermine 2026/27 (Stand 17.06.2026), <https://www.tha.de/Binaries/Binary94073/THA-2026-27-Semestertermine.docx-17.06.pdf>; Satzung über die Vorlesungs- und Ferienzeiten an der THA vom 20.12.2022, § 2 (Beginn 1. Oktober, Ende 25. Januar bzw. vorausgehender Freitag, vorlesungsfrei 24.12.–06.01.), <https://www.tha.de/Binaries/Binary63006/Satzung-Vorlesungszeiten-final.pdf>. Der Prüfungszeitraum wird von den Prüfungskommissionen festgelegt [bitte ergänzen].

### Wochenraster

Der Wochentag jeder Lehrveranstaltung ist im Repository nicht hinterlegt. Deshalb ist je Termin nur die **Vorlesungswoche** (Montag bis Freitag) eingetragen; das genaue Datum folgt aus dem Wochentag [bitte ergänzen]. Raster für 12 Termine: elf Wochen vom 05.10. bis 18.12.2026 und die Woche ab 11.01.2027. Reserve: Woche ab 28.09. (nur Do/Fr 01./02.10.), Woche ab 21.12. (nur Mo–Mi), Do/Fr 07./08.01. und die Woche ab 18.01.2027 (mit Hauptprüfungstag am Mo 18.01.).

> **Wichtig:** Die Vorlesungszeit hat am 01.10.2026 begonnen. Die Wochen bis einschließlich 26.10.2026 liegen bereits zurück. Die Zuordnung ist daher mit den tatsächlich gehaltenen Terminen abzugleichen; das Raster dient als Vorlage, nicht als Ist-Stand.

In der App erscheinen die Wochen auf der Lernpfad-Seite als „Woche ab TT.MM.JJJJ (Entwurf, zu bestätigen)“ (Feld `wocheEntwurf`). Nach der Freigabe wird je Termin `datum` eingetragen, `wocheEntwurf` gelöscht und `status` auf `freigegeben` gesetzt.

## Baustoffkunde (Grundlagen)

- Studiengang: Bauingenieurwesen und Architektur (Bachelor)
- Semester: Grundlagenstudium (Semesterlage offen)
- Umfang: 12 Termine (Entwurf; SWS noch offen)
- Hinweis: Abfolge nach der klassischen Gliederung: Kenngrößen → mineralische → metallische → organische Baustoffe; abgeleitet aus der Vorlesungsgliederung „Baustoffkunde (VL)“.

| Termin | Woche (Entwurf, zu bestätigen) | Thema | Module |
|---|---|---|---|
| Termin 1 | 05.10.2026 – 09.10.2026 | Einführung, Systematik und Kenngrößen der Baustoffe | Baustoffkunde & Historie, Baustoffkenngrößen, Einheitenumrechner, Kennwerte-Datenbank |
| Termin 2 | 12.10.2026 – 16.10.2026 | Aufbau der Stoffe: Bindungsarten, Gefüge und Bauchemie | Modulinfos Grundlagen, Bauchemie & Mineralogie |
| Termin 3 | 19.10.2026 – 23.10.2026 | Mechanisches Verhalten und Baustoffprüfung | Mechan. Kenngrößen & E-Modul, Mechanische Prüfungen, Messen & Prüfen |
| Termin 4 | 26.10.2026 – 30.10.2026 | Natursteine und Gesteinskörnungen | Gesteine & Natursteine, Ausgangsstoffe des Betons |
| Termin 5 | 02.11.2026 – 06.11.2026 | Nichthydraulische Bindemittel: Baukalk und Gips | Kalk (Baukalk), Gips & Calciumsulfat |
| Termin 6 | 09.11.2026 – 13.11.2026 | Zement und Hydratation | Bindemittel & Hydratation, Hydratationswärme & Rissrisiko |
| Termin 7 | 16.11.2026 – 20.11.2026 | Beton: Zusammensetzung, Frisch- und Festbeton | Stoffraum-Mischungsberechnung, Frischbetonprüfungen, Festbetoneigenschaften |
| Termin 8 | 23.11.2026 – 27.11.2026 | Mauerwerk, Ziegel, Putze und Mörtel | Mauerwerk & Steine, Keramik und Ziegel, Putze & Mörtel |
| Termin 9 | 30.11.2026 – 04.12.2026 | Stahl, NE-Metalle und Metallkorrosion | Baustahl & Fe-C-Diagramm, NE-Metalle & Legierungen, Metallkorrosion |
| Termin 10 | 07.12.2026 – 11.12.2026 | Holz und Holzwerkstoffe | Konstruktionsholz, Holzwerkstoffe & Platten |
| Termin 11 | 14.12.2026 – 18.12.2026 | Kunststoffe, Bitumen und Dämmstoffe | Kunststoffe & Polymere, Asphalt & Bitumen, Dämmstoffe im Hochbau |
| Termin 12 | 11.01.2027 – 15.01.2027 | Glas, Lehm, nachwachsende und neue Baustoffe | Bauglas & Glaskorrosion, Lehm & Stampflehm, Biogene Baustoffe (NaWaRo), Zukunftswerkstoffe & 3D-Druck |

## Bauen im Bestand

- Studiengang: Bauingenieurwesen und Architektur (Studiengang und Niveau noch offen)
- Semester: offen
- Umfang: 12 Termine (Entwurf; SWS noch offen)
- Hinweis: Abgeleitet aus der Vorlesungsgliederung „Bauen im Bestand (VL)“ (14 Einheiten), auf 12 Termine verdichtet.

| Termin | Woche (Entwurf, zu bestätigen) | Thema | Module |
|---|---|---|---|
| Termin 1 | 05.10.2026 – 09.10.2026 | Einführung: Bestand als Ressource, Baualtersklassen und Epochen | Modulinfos Bauen im Bestand, Altbauatlas & Epochen |
| Termin 2 | 12.10.2026 – 16.10.2026 | Bauaufnahme, Archivrecherche und Bauwerkserfassung | Bauwerkserfassung (3D-Scan), Probenahme & Erkundung |
| Termin 3 | 19.10.2026 – 23.10.2026 | Schadenskartierung und Kausalkette | Typische Bauschäden (Schadensatlas), Recht & Grundlagen (VOB/BGB) |
| Termin 4 | 26.10.2026 – 30.10.2026 | Bauwerksdiagnose und zerstörungsfreie Prüfung | Bauwerksdiagnose & ZfP-Katalog, Analytik & Diagnostik |
| Termin 5 | 02.11.2026 – 06.11.2026 | Holz im Bestand: Diagnostik, Schädlinge und Pilze | Holzkorrosion & Schädlinge, Konstruktionsholz |
| Termin 6 | 09.11.2026 – 13.11.2026 | Mauerwerk im Bestand: Diagnose und historische Bauweisen | Mauerwerk & Steine, Historische Bauweisen |
| Termin 7 | 16.11.2026 – 20.11.2026 | Feuchte und Hygrothermik, Innendämmung | Feuchteschutz & Glaser-Verfahren, Innendämmung vs. Außendämmung |
| Termin 8 | 23.11.2026 – 27.11.2026 | Historische Baustoffe, Bauprodukte und Denkmalpflege | Historische Bauprodukte, Denkmalpflege & Historische Baustoffe |
| Termin 9 | 30.11.2026 – 04.12.2026 | Historische Betonstähle und Eisenwerkstoffe, Materialkennwerte | Historische Materialkennwerte, Baustahl & Fe-C-Diagramm |
| Termin 10 | 07.12.2026 – 11.12.2026 | Schadstoffe im Bestand | Schad- und Gefahrstoffe, PFAS in Baustoffen |
| Termin 11 | 14.12.2026 – 18.12.2026 | Bestandsschutz, Modernisierung und energetische Anforderungen | Modernisierung & GModG-Rechner, Energieausweis (GModG / GEG) |
| Termin 12 | 11.01.2027 – 15.01.2027 | Bewertung bestehender Tragwerke und Zustandsbewertung | Eurocode-Sicherheitskonzept, Zustandsbewertung (VDI 6200), Bestands-Checklisten |

## A.RYC – Recycling, Abfälle, Altlasten

- Studiengang: offen (durch Prof. Huber zu ergänzen)
- Semester: offen
- Umfang: 14 Termine ARYC-00 bis ARYC-13
- Hinweis: Themen der Foliensätze ARYC-00 bis ARYC-13 im Detail noch nicht hinterlegt; Termine aus den Modulen der Bereiche Rückbau & Schadstoffe, Kreislaufwirtschaft, Abfälle und Boden entworfen.

| Termin | Woche (Entwurf, zu bestätigen) | Thema | Module |
|---|---|---|---|
| ARYC-00 | 05.10.2026 – 09.10.2026 | Einführung: Stoffkreisläufe und Ressourcen im Bauwesen | Modulinfos Rückbau, Ressourcen & Umweltbelastung, Kreislaufwirtschaft & DPP |
| ARYC-01 | 12.10.2026 – 16.10.2026 | Rechtsrahmen: KrWG, Abfallhierarchie und Abfallbegriff | Abfälle & AVV-Katalog, Daten & Regeln (EPBD & Taxonomie) |
| ARYC-02 | 19.10.2026 – 23.10.2026 | Gewerbeabfallverordnung (GewAbfV): Getrennthaltung und Dokumentation. *Novelle der GewAbfV 2026 berücksichtigen.* | Abfälle & AVV-Katalog, Rückbau & Materialstrom |
| ARYC-03 | 26.10.2026 – 30.10.2026 | Abfallverzeichnis (AVV), Einstufung und Nachweisführung | Abfälle & AVV-Katalog, Rückbau-Checklisten |
| ARYC-04 | 02.11.2026 – 06.11.2026 | Rückbau: Planung, Erkundung und Materialstrom. *Novelle der GewAbfV 2026 berücksichtigen.* | Rückbau & Materialstrom, Probenahme & Erkundung, Schad- und Gefahrstoffe |
| ARYC-05 | 09.11.2026 – 13.11.2026 | Schad- und Gefahrstoffe: Asbest, PAK, PCB, KMF | Schad- und Gefahrstoffe |
| ARYC-06 | 16.11.2026 – 20.11.2026 | PFAS in Baustoffen und Böden | PFAS in Baustoffen |
| ARYC-07 | 23.11.2026 – 27.11.2026 | Mineralik I: Beton und Mauerwerk. *RC-Gesteinskörnungen, Recyclingbeton, Mauerwerksbruch.* | Rückbau & Materialstrom, Mauerwerk & Steine, Ausgangsstoffe des Betons, Materialoptimierung & Klinker |
| ARYC-08 | 30.11.2026 – 04.12.2026 | Mineralik II: Ersatzbaustoffverordnung (EBV). *Materialklassen und Grenzwerte nach EBV in der geltenden Fassung prüfen.* | Boden- & Materialaufbereitung, Erdbau & Böden |
| ARYC-09 | 07.12.2026 – 11.12.2026 | Boden und Altlasten: Erkundung, Bewertung, Sanierung | Boden- & Materialaufbereitung, Bodenmechanik, Probenahme & Erkundung |
| ARYC-10 | 14.12.2026 – 18.12.2026 | Altholz und Urban Mining | Altholz-NIR-Sortierung und Urban Mining |
| ARYC-11 | 21.12.2026 – 25.12.2026 | Metalle, Kunststoffe, Glas und Dämmstoffe: Verwertungswege | NE-Metalle & Legierungen, Kunststoffe & Polymere, Bauglas & Glaskorrosion, Dämmstoffe im Hochbau |
| ARYC-12 | 11.01.2027 – 15.01.2027 | Design for Disassembly, Materialpässe und Digitaler Produktpass | Kreislaufwirtschaft & DPP, Materialpässe & Gebäudepass, Digitaler Produktpass (DPP) |
| ARYC-13 | 18.01.2027 – 22.01.2027 | Ressourceneffizienz und Bilanzierung, Abschluss | Ressourceneffizienz (REZ), Ökobilanzierung (LCA): Grundlagen |

Anmerkung: 14 Termine passen nur mit zwei Reservewochen ins Semester (ab 21.12., nur Mo–Mi; ab 18.01., Hauptprüfungstag Mo 18.01.). Liegt A.RYC auf Do oder Fr, ist ARYC-00 in der Woche ab 28.09. (01./02.10.) und ARYC-11 am 07./08.01. möglich [bitte ergänzen: Wochentag].

## Wahlpflichtfach Nachhaltiges Bauen

- Studiengang: Bauingenieurwesen (Bachelor)
- Semester: 7. Semester
- Umfang: 12 Termine à 1,5 h, davon 2 mit externen Referent:innen
- Hinweis: Pflichtthemen: Ökobilanzierung mit Übungen, DAfStb-Richtlinie „Treibhausgasreduzierte Tragwerke“, Zertifizierungssysteme mit Schwerpunkt DGNB, Deklarationen und Siegel.

| Termin | Woche (Entwurf, zu bestätigen) | Thema | Module |
|---|---|---|---|
| Termin 1 | 05.10.2026 – 09.10.2026 | Einführung: Klimawirkung des Bauens und Rechtsrahmen | Modulinfos Nachhaltigkeit, Daten & Regeln (EPBD & Taxonomie) |
| Termin 2 | 12.10.2026 – 16.10.2026 | Ökobilanzierung I: Methode nach DIN EN 15978 und DIN EN 15804 | Ökobilanzierung (LCA): Grundlagen |
| Termin 3 | 19.10.2026 – 23.10.2026 | Ökobilanzierung II: Übung Bauteil-Ökobilanz. *Übung* | LCA-Rechner & QNG-Nachweis, Nachhaltigkeit: GWP-Bilanz |
| Termin 4 | 26.10.2026 – 30.10.2026 | Ökobilanzierung III: Übung Gebäude-Ökobilanz und QNG-Nachweis. *Übung* | LCA-Rechner & QNG-Nachweis, Rechtsrahmen, CRREM & Praxis |
| Termin 5 | 02.11.2026 – 06.11.2026 | DAfStb-Richtlinie „Treibhausgasreduzierte Tragwerke“ | Materialoptimierung & Klinker, LCA im Ingenieurbau (DIN EN 17472) |
| Termin 6 | 09.11.2026 – 13.11.2026 | Externer Vortrag 1. *Platzhalter: externe:r Referent:in und Thema noch offen; Modulzuordnung nach Thema anpassen.* | Modulinfos Nachhaltigkeit |
| Termin 7 | 16.11.2026 – 20.11.2026 | Deklarationen: Umweltproduktdeklarationen (EPD) und Digitaler Produktpass | Zertifizierung & Deklarationen, Digitaler Produktpass (DPP) |
| Termin 8 | 23.11.2026 – 27.11.2026 | Zertifizierungssysteme I: DGNB-System | Zertifizierung & Deklarationen, Nachhaltigkeits-Checklisten |
| Termin 9 | 30.11.2026 – 04.12.2026 | Zertifizierungssysteme II: DGNB-Kriterien in der Anwendung, BNB, QNG, LEED. *Übung* | Zertifizierung & Deklarationen, Lebenszykluskosten (LCC) |
| Termin 10 | 07.12.2026 – 11.12.2026 | Siegel und Produktkennzeichnungen | Zertifizierung & Deklarationen, CE vs. Ü & MVV TB |
| Termin 11 | 14.12.2026 – 18.12.2026 | Externer Vortrag 2. *Platzhalter: externe:r Referent:in und Thema noch offen; Modulzuordnung nach Thema anpassen.* | Modulinfos Nachhaltigkeit |
| Termin 12 | 11.01.2027 – 15.01.2027 | Kreislaufgerechtes Bauen und Abschluss | Kreislaufwirtschaft & DPP, Ressourcen & Umweltbelastung |

Anmerkung: Die Termine der externen Vorträge (Termin 6 und 11) hängen von den Referentinnen und Referenten ab [bitte ergänzen: Namen, Themen, Termine].

## VNHB – Vertiefung Nachhaltiges Bauen

- Studiengang: offen (durch Prof. Huber zu ergänzen)
- Semester: offen
- Umfang: 12 Termine (Entwurf; SWS noch offen)
- Hinweis: Durchgehendes Fallbeispiel „MFH Augsburg-Nord“: Jeder Termin wendet die Inhalte auf dasselbe Mehrfamilienhaus an.

| Termin | Woche (Entwurf, zu bestätigen) | Thema | Module |
|---|---|---|---|
| Termin 1 | 05.10.2026 – 09.10.2026 | Einführung, Rahmen (EPBD, GEG, Taxonomie) und Fallbeispiel. *Fallbeispiel MFH Augsburg-Nord vorstellen.* | Daten & Regeln (EPBD & Taxonomie), Modulinfos Nachhaltigkeit |
| Termin 2 | 12.10.2026 – 16.10.2026 | Bilanzrahmen und Lebenszyklusphasen. *MFH Augsburg-Nord: Systemgrenze und funktionelle Einheit festlegen.* | Ökobilanzierung (LCA): Grundlagen |
| Termin 3 | 19.10.2026 – 23.10.2026 | Datengrundlagen: ÖKOBAUDAT, EPD und Materialdatenbanken | Zertifizierung & Deklarationen, Materialdatenbanken |
| Termin 4 | 26.10.2026 – 30.10.2026 | Gebäude-Ökobilanz und QNG-Nachweis. *MFH Augsburg-Nord: Ökobilanz der Varianten rechnen.* | LCA-Rechner & QNG-Nachweis, Nachhaltigkeit: GWP-Bilanz |
| Termin 5 | 02.11.2026 – 06.11.2026 | Betriebsenergie, GEG und Energieausweis | Energieausweis (GModG / GEG), Bauphysik-Rechner (U-Wert, Sommer, Akustik) |
| Termin 6 | 09.11.2026 – 13.11.2026 | Materialwahl: Klinkerreduktion, Holz und biogene Baustoffe | Materialoptimierung & Klinker, Biogene Baustoffe (NaWaRo), Holzwerkstoffe & dataholz |
| Termin 7 | 16.11.2026 – 20.11.2026 | Sommerlicher Wärmeschutz und Suffizienz | Sommerlicher Wärmeschutz (DIN 4108-2) |
| Termin 8 | 23.11.2026 – 27.11.2026 | Lebenszykluskosten und CRREM | Lebenszykluskosten (LCC), Rechtsrahmen, CRREM & Praxis |
| Termin 9 | 30.11.2026 – 04.12.2026 | Zirkuläres Konstruieren und Materialpässe | Kreislaufwirtschaft & DPP, Materialpässe & Gebäudepass |
| Termin 10 | 07.12.2026 – 11.12.2026 | Rückbau, Abfälle und Ersatzbaustoffe | Rückbau & Materialstrom, Abfälle & AVV-Katalog |
| Termin 11 | 14.12.2026 – 18.12.2026 | Zertifizierung (DGNB, QNG) am Fallbeispiel. *MFH Augsburg-Nord: Kriterien bewerten.* | Zertifizierung & Deklarationen, Nachhaltigkeits-Checklisten |
| Termin 12 | 11.01.2027 – 15.01.2027 | Bestand oder Neubau? Variantenvergleich und Abschluss. *MFH Augsburg-Nord: Gesamtbewertung.* | Modernisierung & GModG-Rechner, Ressourcen & Umweltbelastung |

## Grundlagen für den Einsatz von KI im Bauwesen – Möglichkeiten und Grenzen

- Studiengang: Bauingenieurwesen (Master)
- Semester: offen
- Umfang: 2,5 SWS an höchstens 12 Terminen: Grundlagenteil 1,0 SWS (24 UE), Praxisberichte/Gastvorträge 1,5 SWS
- Hinweis: Gastvorträge der Fachbereiche (1,5 SWS): Termine und Themen gestalten die Fachkolleg:innen selbst – hier nur als Platzhalter vermerkt. Jeder Grundlagenblock schließt mit einer Hands-on-Übung im Modul „Hands-on-Übungen KI (Master)“.

| Termin | Woche (Entwurf, zu bestätigen) | Thema | Module |
|---|---|---|---|
| Termin 1 | 05.10.2026 – 09.10.2026 | Einführung: Was ist KI? Maschinelles Lernen und Branchenbezug (2 UE) | Überblick & Grundlagen |
| Termin 2 | 12.10.2026 – 16.10.2026 | LLM-Grundlagen (4 UE) | Überblick & Grundlagen, Systemarchitektur der KI, Hands-on-Übungen KI (Master) |
| Termin 3 | 19.10.2026 – 23.10.2026 | Funktionsweise eines KI-Assistenten (cloudbasiert und lokal) (3 UE). *Übung: Vorlage 3 „Funktionsweise“ der Übung zu Block 1.* | Systemarchitektur der KI, Lokale KI (LM Studio), Hands-on-Übungen KI (Master) |
| Termin 4 | 26.10.2026 – 30.10.2026 | Prompting im Ingenieurbüro (3 UE) | Prompting-Praxis, LLM-Praxis (Claude & ChatGPT), Hands-on-Übungen KI (Master) |
| Termin 5 | 02.11.2026 – 06.11.2026 | KI-Agenten (3 UE) | Systemarchitektur der KI, Hands-on-Übungen KI (Master) |
| Termin 6 | 09.11.2026 – 13.11.2026 | Retrieval-Augmented Generation (RAG) mit Normtexten (3 UE) | Systemarchitektur der KI, Tools für Thesen & Literatur, Hands-on-Übungen KI (Master) |
| Termin 7 | 16.11.2026 – 20.11.2026 | „Sich programmieren lassen“ (3 UE) | LLM-Praxis (Claude & ChatGPT), Online-Tools & Rechner, Hands-on-Übungen KI (Master) |
| Termin 8 | 23.11.2026 – 27.11.2026 | Fehlerbilder und Verifikation, Recht und Ethik (3 UE) | Fehler, Recht & Ethik, Hands-on-Übungen KI (Master) |

Anmerkung: Eingetragen sind die acht Grundlagenblöcke (24 UE) in den Wochen 05.10.–27.11.2026. Für die Praxisberichte und Gastvorträge (1,5 SWS) bleiben die Wochen ab 30.11., 07.12., 14.12.2026 und 11.01.2027; Termine und Themen legen die Fachkolleginnen und Fachkollegen fest [bitte ergänzen].

## Zertifikat „Ausbau und Bestand“

- Studiengang: Weiterbildung (Zertifikat Fachingenieur:in / Fachplaner:in, 30 ECTS)
- Semester: 2 Semester, berufsbegleitend
- Umfang: Module A 1 bis A 3 (Termine je Modul noch offen)
- Hinweis: Gliederung nach den Modulen A 1 „Projektmodul“, A 2 „Konzeption und Konstruktion“ und A 3 „Bauphysik und TGA“ (Angaben aus Weiter@THA). Schwerpunkte: Nachhaltigkeit, Schadstoffe, Kreislaufwirtschaft, Projektmanagement, Aus- und Leichtbausysteme.

| Termin | Woche (Entwurf, zu bestätigen) | Thema | Module |
|---|---|---|---|
| Termin 1 | [bitte ergänzen] | A 1 · Projektauftakt: Bestandsaufnahme am Projektobjekt | Fachingenieur Ausbau, Bauwerkserfassung (3D-Scan), Altbauatlas & Epochen |
| Termin 2 | [bitte ergänzen] | A 1 · Schadstoffe und Rückbau im Projekt | Schad- und Gefahrstoffe, Rückbau & Materialstrom |
| Termin 3 | [bitte ergänzen] | A 1 · Nachhaltigkeit und Kreislaufwirtschaft im Ausbau | Kreislaufwirtschaft & DPP, Ökobilanzierung (LCA): Grundlagen |
| Termin 4 | [bitte ergänzen] | A 1 · Projektmanagement, Planung und Ausschreibung | Planung & Ausschreibung (AVA), Bauleitung & Baustelle |
| Termin 5 | [bitte ergänzen] | A 2 · Trockenbau und Leichtbausysteme | Trockenbausysteme, Innenausbau-Zentrum |
| Termin 6 | [bitte ergänzen] | A 2 · Putz, Estrich und Bodenaufbauten | Putz & Estrichsysteme, Putze & Mörtel |
| Termin 7 | [bitte ergänzen] | A 2 · Abdichtung und Ausbau | Ausbau & Abdichtung, Abdichtungsprodukte |
| Termin 8 | [bitte ergänzen] | A 2 · Historische Konstruktionen und Instandsetzung | Historische Bauweisen, Instandsetzung nach Material |
| Termin 9 | [bitte ergänzen] | A 3 · Wärme- und Feuchteschutz, Innendämmung im Bestand | Innendämmung vs. Außendämmung, Feuchteschutz & Glaser-Verfahren |
| Termin 10 | [bitte ergänzen] | A 3 · Schallschutz im Ausbau | Schallschutz (DIN 4109) |
| Termin 11 | [bitte ergänzen] | A 3 · Brandschutz im Bestand | Brandschutz & Baustoffklassen |
| Termin 12 | [bitte ergänzen] | A 3 · Energetische Modernisierung und Schnittstellen zur TGA | Modernisierung & GModG-Rechner, Energieausweis (GModG / GEG) |

Anmerkung: Das Zertifikat ist berufsbegleitend über zwei Semester angelegt und folgt nicht dem Vorlesungsraster. Präsenz- bzw. Blocktermine je Modul A 1 bis A 3 sind deshalb nicht eingetragen [bitte ergänzen: Blocktermine laut Weiter@THA].

## TTZ-Weiterbildung: Kursliste (13 Kursentwürfe)

Selbstlernkurse in vier Strängen; je Kurs ein Kursquiz mit 10 Fragen aus den zugeordneten Modulen und Bestehensgrenze 80 %. Teilnahmebestätigung über ein Selbstlernangebot, kein Zertifikat und keine Prüfung. Alle Kurse haben den Status Entwurf; die verbindliche Kursliste liefert Prof. Huber (TTZ Aichach).

Zielgruppe aller Kurse: Praxis/Weiterbildung: Planende, Bauleitung, Sachverständige, Baustoffhandel und Behörden.

| Nr. | Strang | Kurs | Ziel | Dauer | Module |
|---|---|---|---|---|---|
| 1 | Zirkularität | Grundlagen der Kreislaufwirtschaft im Bauwesen | Abfallhierarchie, Ressourceneffizienz und Kreislaufstrategien kennen und auf Baustoffentscheidungen übertragen. | ca. 3 h Selbstlernzeit | Kreislaufwirtschaft & DPP, Ressourceneffizienz (REZ), Ressourcen & Umweltbelastung |
| 2 | Zirkularität | Selektiver Rückbau und Abfallmanagement | Rückbau planen, Bau- und Abbruchabfälle getrennt erfassen und Ersatzbaustoffe rechtssicher einordnen. | ca. 3 h Selbstlernzeit | Rückbau & Materialstrom, Abfälle & AVV-Katalog, Boden- & Materialaufbereitung, Rückbau-Checklisten |
| 3 | Zirkularität | Urban Mining, Altholz und Materialpässe | Sekundärrohstoffpotenziale im Bestand bewerten, Altholz kaskadisch nutzen und Materialpässe lesen. | ca. 2,5 h Selbstlernzeit | Altholz-NIR-Sortierung und Urban Mining, Materialpässe & Gebäudepass |
| 4 | Zirkularität | Schadstoffe im Stoffkreislauf (PFAS & Co.) | Schadstoffverdachte im Rückbau erkennen und deren Folgen für Verwertung und Entsorgung einschätzen. | ca. 2,5 h Selbstlernzeit | PFAS in Baustoffen, Schad- und Gefahrstoffe, Rückbau-Checklisten |
| 5 | Ökobilanz (LCA) | Ökobilanz-Grundlagen für Bauprodukte und Gebäude | Lebenszyklusmodule, Wirkungskategorien und Systemgrenzen verstehen und eine einfache Bauteil-LCA rechnen. | ca. 4 h Selbstlernzeit | Ökobilanzierung (LCA): Grundlagen, Daten & Regeln (EPBD & Taxonomie), LCA-Rechner & QNG-Nachweis |
| 6 | Ökobilanz (LCA) | LCA im Ingenieurbau und Materialoptimierung | Treibhauspotenziale von Tragwerksvarianten vergleichen und Einsparhebel über Material und Bemessung ableiten. | ca. 3 h Selbstlernzeit | LCA im Ingenieurbau (DIN EN 17472), Materialoptimierung & Klinker |
| 7 | Ökobilanz (LCA) | LCA-Daten in der Praxis: EPD, Modul D und CO₂-Aufnahme | EPD-Daten korrekt zusammenführen, Modul D und Recarbonatisierung einordnen und GWP-Vergleiche nachvollziehen. | ca. 3 h Selbstlernzeit | Digitaler Produktpass (DPP), Nachhaltigkeit: GWP-Bilanz |
| 8 | Zertifizierung | Gebäudezertifizierung DGNB und QNG | Aufbau von DGNB und QNG kennen, Ökobilanzanforderungen und EPBD-Vorgaben in Zertifizierungen einordnen. | ca. 3,5 h Selbstlernzeit | Zertifizierung & Deklarationen, Daten & Regeln (EPBD & Taxonomie), Rechtsrahmen, CRREM & Praxis, Ökobilanzierung (LCA): Grundlagen |
| 9 | Zertifizierung | Produktnachweise: Leistungserklärung, Konformität und Materialpass | DoP, CE-Kennzeichnung, AVCP-Systeme und Materialpässe als Nachweisgrundlage für Zertifizierungen nutzen. | ca. 3 h Selbstlernzeit | CE vs. Ü & MVV TB, Konformität & Auditierung, Materialpässe & Gebäudepass |
| 10 | Zertifizierung | Lebenszykluskosten, CRREM und CO₂-Bepreisung | Lebenszykluskosten barwertig berechnen und Klimarisiken (CRREM, CBAM, CO₂-Preis) in Bewertungen berücksichtigen. | ca. 3 h Selbstlernzeit | Lebenszykluskosten (LCC), Rechtsrahmen, CRREM & Praxis |
| 11 | Technologie & Produkte | Holz, Holzwerkstoffe und nachwachsende Rohstoffe | Eigenschaften und Einsatzgrenzen von Holz, Holzwerkstoffen und NawaRo-Produkten fachgerecht beurteilen. | ca. 4 h Selbstlernzeit | Konstruktionsholz, Holzwerkstoffe & Platten, Biogene Baustoffe (NaWaRo), Holzbauprodukte |
| 12 | Technologie & Produkte | Klimafreundlicher Beton: Biokohle und Schnellkarbonatisierung | Forschungsstand zu Biokohlebeton und beschleunigter Karbonatisierung von Recyclingmaterial kritisch einordnen. | ca. 3,5 h Selbstlernzeit | Biokohlebeton (Pflanzenkohle im Beton), Schnellkarbonatisierung (DIN EN 12390-12), Zukunftswerkstoffe & 3D-Druck |
| 13 | Technologie & Produkte | Bauprodukt-Innovationen: Carbonbeton und Lehm | Innovative Bauprodukte hinsichtlich Zulassung, Leistungsfähigkeit und Ressourcenwirkung bewerten. | ca. 4 h Selbstlernzeit | Innovationen & F&E, Carbonbeton & Textilbeton, Lehm & Stampflehm, Lehmbauprodukte |

Offen [bitte ergänzen]: Termine bzw. Freischaltung der Kurse, Ansprechperson am TTZ Aichach, ob einzelne Kurse zusätzlich als Präsenz- oder Online-Termin angeboten werden, und ob die Zielgruppe je Kurs enger gefasst werden soll.
