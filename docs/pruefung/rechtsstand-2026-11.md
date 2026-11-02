# Rechtsstand 11/2026 – Prüfung der in der App genannten Vorschriften und Fristen

**Stand:** 02.11.2026 (Branch `recht/stand-11-2026`, Basis origin/main bfc156b0)
**Auftrag:** Rechtsvorschriften und Fristen auf Änderungen seit 10/2026 prüfen, Fundstellen in `content/` und `src/` sammeln, eindeutig belegte Abweichungen korrigieren, Unsicheres „vorläufig“ kennzeichnen, zeitgebundene Aussagen datieren.
**Vorgehen:** Fundstellen per Grep (Vorschriftenname, Fundstellennummern, Zeitwörter „ab/bis/derzeit/geplant/in Vorbereitung“ in der Nähe der Vorschrift). Quellen nur aus Suchergebnissen abgerufen (abgerufen 02.11.2026); einige amtliche Seiten (BAuA, buzer.de GewAbfV) waren nicht abrufbar. Prüfvermerke (`src/data/pruefvermerke.ts`) sind nicht geändert. Keine Quizfrage ist falsch geworden; `src/data/quiz.json` ist unverändert.

## 1. Fundstellen (Zahl der Dateien / Treffer in content/ und src/)

| Vorschrift | Dateien / Treffer |
|---|---|
| GModG / Gebäudemodernisierungsgesetz | 62 / 458 |
| GEG (als frühere Bezeichnung) | 75 / 233 |
| EBV / Mantelverordnung | 57 / 357 |
| KrWG | 34 / 104 |
| GewAbfV | 22 / 79 |
| GefStoffV | 25 / 91 |
| TRGS 519 / TRGS 521 | 25 / 101 bzw. 15 / 44 |
| ChemVerbotsV | 3 / 3 |
| REACH Anhang XVII | 6 / 8 |
| BauPVO (EU) 2024/3110 / DPP | 23 / 83 bzw. 31 / 191 |
| EPBD (EU) 2024/1275 | 24 / 148 |
| EU-Taxonomie | 21 / 72 |
| Gebäudetyp E | 22 / 49 |
| BayBO | 11 / 21 |
| MVV TB | 41 / 132 |
| KI-VO (EU) 2024/1689 | 13 / 44 |
| DSGVO | 16 / 61 |

## 2. Korrekturen (eindeutig belegt)

| Nr. | Vorschrift | Fundstelle | bisher | neu | Quelle |
|---|---|---|---|---|---|
| R-1 | GefStoffV | `content/moduleinfo/daten.json` (Regelwerke Rückbau) | „§ 5a Veranlasser, § 11a Asbest (Fassung seit 05.12.2024)“ | „(Novelle seit 05.12.2024; zuletzt geändert durch VO vom 17.12.2025, BGBl. 2025 I Nr. 337, in Kraft seit 20.12.2025)“ | Verordnung zur Änderung der Gefahrstoffverordnung und der Baustellenverordnung, BR-Drs. 566/25 (Inkrafttreten am Tag nach der Verkündung; verkündet 19.12.2025); IHK Karlsruhe „Chemikalien aktuell“: „in Kraft seit 20.12.2025“ |
| R-2 | GefStoffV § 11a Abs. 4a | `content/schadstoffe/Schadstoffe.json` (`derSTO`, mittleres Risiko) | „Abbrucharbeiten bedürfen einer Genehmigung.“ | „… einer behördlichen Genehmigung (§ 11a Abs. 4a GefStoffV, seit 20.12.2025).“ | BR-Drs. 566/25: neuer § 11a Abs. 4a (Genehmigung für Abbrucharbeiten im Bereich niedrigen oder mittleren Risikos; Genehmigungsfiktion nach zwei Wochen, Geltung sechs Jahre) |
| R-3 | GefStoffV, EBV | `src/data/moduleHistoryData.ts` (Zeitleiste Rückbau) | „GefStoffV-Novelle (in Kraft 05.12.2024)“; „EBV-Novelle liegt seit August 2026 als Referentenentwurf vor.“ | „(in Kraft 05.12.2024; geändert mit Wirkung vom 20.12.2025, u. a. Genehmigung für Asbest-Abbrucharbeiten nach § 11a Abs. 4a)“; „seit 15.07.2026 als Referentenentwurf vor (Stand 11/2026)“ | wie R-1; BDEW „Novellierung der Ersatzbaustoff-VO“ (Referentenentwurf des BMUKN vom 15.07.2026, Stellungnahme 06.08.2026) – deckt sich mit `content/abfaelle/Abfaelle.json` |
| R-4 | EBV | `content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json`, `content/kreislaufwirtschaft/Kreislaufwirtschaft.json` (Regelwerke) | „Novelle in Vorbereitung“ | „Novelle als Referentenentwurf vom 15.07.2026, Stand 11/2026“ | BDEW (wie R-3) |
| R-5 | ChemVerbotsV / REACH Anh. XVII Nr. 77 | `content/holzwerkstoffe/Holzwerkstoffe.json` (`einKritischerFaktorSind`) | „In Deutschland gilt seit 2020 die ChemVerbotsV mit Prüfung nach DIN EN 16516 …, seit 06.08.2026 EU-weit REACH …“ | „Seit 06.08.2026 gilt EU-weit REACH Anhang XVII Eintrag 77 mit 0,062 mg/m³ …; die zuvor in Deutschland seit 2020 geltende Regelung der ChemVerbotsV … ist damit gegenstandslos (UBA, Stand 11/2026).“ | UBA, FAQ zu Regelungen von Formaldehyd: „Die Regelungen zu Formaldehyd in der ChemVerbotsV sind seitdem obsolet.“ |
| R-6 | ChemVerbotsV / REACH | `content/nachhaltigkeitchecklisten/NachhaltigkeitChecklisten.json` (Referenz Checkliste Ausschreibung 4) | „DIN EN 16516 / ChemVerbotsV“ | „REACH Anhang XVII Nr. 77 (seit 06.08.2026; zuvor ChemVerbotsV) / DIN EN 16516“ | wie R-5 |
| R-7 | KI-VO Art. 50 | `content/ki/FehlerRechtEthik.json` (`dieAm1August`), `content/kibaustoffe/KiBaustoffe.json` (Schritt „Gestaffelte Anwendung“) | „Art. 50 ab 02.08.2026“ | „Art. 50 seit 02.08.2026“ | Termin verstrichen; FGS-Blog „EU AI Act: Was ab dem 2. August 2026 gilt“ (Art. 50 unverändert ab 02.08.2026) |
| R-8 | KI-VO Art. 4 | `content/ki/FehlerRechtEthik.json` | „Verbote und KI-Kompetenz (Art. 4) seit 02.02.2025“ | ergänzt: „(Art. 4; seit dem Digital Omnibus als Pflicht, die KI-Kompetenz zu fördern)“ | IHK Lüneburg-Wolfsburg „Digital-Omnibus-Verordnung zur KI in Kraft getreten“; FGS-Blog: Sicherstellungs- wird Förderpflicht (VO (EU) 2026/1744, in Kraft 27.07.2026) |
| R-9 | KI-MIG | `content/ki/FehlerRechtEthik.json` | „In der nationalen Aufsicht ist die Bundesnetzagentur vorgesehen.“ | „Nationale Marktüberwachungsbehörde ist nach dem KI-Marktüberwachungs- und Innovationsförderungsgesetz (KI-MIG, in Kraft seit 29.07.2026) die Bundesnetzagentur.“ | IHK Lüneburg-Wolfsburg „AI Act: So regelt Deutschland die Umsetzung“ (verkündet 28.07.2026, in Kraft 29.07.2026, BNetzA); gesetze-im-internet.de/ki-mig |
| R-10 | Gebäudetyp E | `content/nachhaltigkeit/PraxisInnovationen.json` (Einleitung) | „das neue Gebäudetyp-E-Gesetz (§ 650o BGB)“ | „das Gebäudetyp-E-Vorhaben (Referentenentwurf vom 26.10.2026, noch kein Gesetz)“ | mtrlegal „Gebäudetyp E: Referentenentwurf zum Basisstandard“; § 650o BGB-E stand nur im erledigten Regierungsentwurf 2024 |
| R-11 | Gebäudetyp E | `src/components/ui/RechtsrahmenKompendium.tsx` (Eintrag `gebaeudetyp_e`) | Kurzname „Gesetzentwurf, Stand 10/2026“; Langtitel „Gesetz zur Erleichterung des einfachen Bauens (Entwurf)“ (Titel 2024); Meilenstein 2026 ohne Datum | Kurzname „Referentenentwurf 26.10.2026“; Langtitel „Entwurf eines Gesetzes zur Regelung des gesetzlichen Basisstandards (Gebäudetyp E) im Bürgerlichen Gesetzbuch“; Norm „Referentenentwurf vom 26.10.2026, Stellungnahmen bis 09.11.2026“; Meilenstein 2026 „… Kabinettsbeschluss und parlamentarisches Verfahren stehen aus (Stand 11/2026)“ | mtrlegal (wie R-10): BMJV mit BMWSB, 26.10.2026, Stellungnahmen bis 09.11.2026; Quelle als Code-Kommentar |
| R-12 | Gebäudetyp E | `src/data/moduleHistoryData.ts` (Zeitleiste Bestand) | „Gesetzentwurf 2024, neuer Anlauf mit Eckpunkten 2025“ | „Gesetzentwurf 2024, Eckpunkte 2025, Referentenentwurf vom 26.10.2026“ | wie R-10 |
| R-13 | BauPVO / DPP | `src/components/ui/RechtsrahmenKompendium.tsx` (Meilenstein „ab 2027“) | „(Stand 10/2026 noch nicht erlassen)“ | „(Stand 11/2026 noch nicht erlassen, vorläufig; ein delegierter Rechtsakt zu DPP-Diensteanbietern wird für das 4. Quartal 2026 erwartet)“ | Cobuilder „Digital Product Passports for Construction: CPR Working Plan 2026–2029“ (Stand 17.06.2026); Erlass nicht bestätigt → vorläufig |
| R-14 | GewAbfV | `src/data/lernpfade.ts` (Termine 2 und 4, Lehrhinweis) | „Novelle der GewAbfV 2026 berücksichtigen.“ | „Stand der GewAbfV-Novelle prüfen (Kabinettsbeschluss 27.11.2024; Angaben zu Verkündung und Inkrafttreten widersprüchlich, vorläufig – Stand 11/2026).“ | siehe O-1 |

## 3. Geprüft, keine Abweichung

| Vorschrift | Befund in der App | Quelle |
|---|---|---|
| GModG | Umbenennung und Inkrafttreten 29.07.2026, zweite Stufe 01.01.2027 (EPBD-Teile, neue Primärenergiefaktoren, Anlage 10a) stimmen. Weitere Stufen: Art. 3 zum 01.01.2028, Art. 4 zum 01.01.2030 (BGBl. 2026 I Nr. 226); die App nennt dafür keine abweichenden Termine. | buzer.de, GModG – Änderungsübersicht |
| EPBD (EU) 2024/1275 | Umsetzungsfrist Mai 2026, Nullemissionsgebäude 2028/2030, Lebenszyklus-GWP 2028 (> 1000 m²)/2030 – unverändert. | wie GModG; Richtlinientext (in der App bereits belegt) |
| Gebäudetyp E (übrige Stellen) | „Gesetzentwurf, Stand 10/2026“ bzw. „seit 26.10.2026 in der Anhörung“ (u. a. `Regularien.json`, `Bauschaeden.json`, Quiz `q_ndr_2`) ist zutreffend. Hinweis: Der Auftrag nennt den 28.10.2026; der Referentenentwurf datiert vom 26.10.2026. | mtrlegal |
| TRGS 521 | „Ausgabe März 2026, GMBl 2026 S. 300“ stimmt (Ausgabe 02.03.2026, GMBl Nr. 14/15 vom 04.05.2026, S. 300). | umwelt-online, TRGS 521 (2026) |
| REACH Anh. XVII Nr. 77 | 0,062 mg/m³ für Holzwerkstoffe und Möbel seit 06.08.2026 (Quiz `q_hwk_3`) stimmt. | UBA (wie R-5) |
| KI-VO / Digital Omnibus | VO (EU) 2026/1744, in Kraft 27.07.2026; Anhang III ab 02.12.2027, Anhang I ab 02.08.2028; Übergang Art. 50 Abs. 2 bis 02.12.2026; neue Verbote ab 02.12.2026 – stimmt. | IHK Lüneburg-Wolfsburg; FGS-Blog |
| BauPVO (EU) 2024/3110 | in Kraft 07.01.2025, anwendbar 08.01.2026, alte hEN bis zur Ablösung – stimmt. | IHK/ZDH-Übersichten (Suchergebnisse) |
| EUDR | Anwendung ab 30.12.2026 bzw. 30.06.2027 – keine weitere Verschiebung gefunden. | Haufe „EU-Entwaldungsverordnung – wo steht die EUDR 2026?“ |
| MVV TB | Zitierte Ausgabe 2025/1 und „notifizierter Entwurf MVV TB 2026/1“ stimmen (Notifizierung 2026/0349/DE vom 09.07.2026, Stillhaltefrist bis 12.10.2026). Ob die Ausgabe 2026/1 inzwischen veröffentlicht ist, war nicht feststellbar – siehe O-3. | TRIS-Notifizierung 2026/0349/DE |
| BayBO | Die App zitiert nur allgemeine Artikel (Art. 3, 20, 54, 57, 62a, 63, 81, 81a). Das Vierte Modernisierungsgesetz Bayern vom 26.03.2026 (GVBl. 2026 S. 75) ändert u. a. Art. 2, 20, 53, 57, 58, 67, 82, 83; die zitierten Inhalte sind davon nicht berührt (Art. 20: nur Zuständigkeit für die Zustimmung). | verkuendung-bayern.de, GVBl. 2026 S. 75 |
| KrWG | Keine zeitgebundene Aussage zur Novelle in der App. Neu: Referentenentwurf des BMUKN vom 26.06.2026 (Kabinett für 01/2027 geplant, Umsetzungsfrist Abfallrahmenrichtlinie 17.06.2027). | Gleiss Lutz, Artikel vom 31.07.2026 |
| EU-Taxonomie | Keine zeitgebundene Aussage mit Abweichung gefunden. | – |

## 4. Offene Punkte (vorläufig)

| Nr. | Vorschrift | Befund | Vorschlag |
|---|---|---|---|
| O-1 | GewAbfV-Novelle | Quellen widersprechen sich: IHK Rheinhessen und IHK Karlsruhe (Stand 2025): Kabinettsentwurf vom 27.11.2024 im Bundesrat vertagt, nicht verkündet. Gleiss Lutz (31.07.2026): „Dritte Änderung der GewAbfV am 01.07.2026 in Kraft“. gesetze-im-internet.de: Stand „geändert durch Gesetz vom 13.07.2026“ (dokumentarisch nicht abgeschlossen); § 8 Abs. 3 letzter Satz (keine Dokumentation bis 10 m³) unverändert, keine 1-m³-Schwelle in § 8 – Quiz-Rückmeldung „Eine Schwelle von 1 m³ kennt § 8 GewAbfV nicht“ bleibt damit zutreffend. | Lernpfad-Hinweis vorläufig (R-14). BGBl.-Fundstelle der Änderung vom 13.07.2026 bzw. zum 01.07.2026 ermitteln; danach §§ 8, 9 in `abfaelle`/`rueckbau` gegenprüfen. |
| O-2 | TRGS 519 | App: „Fassung 2014, zuletzt geändert 28.01.2025“. Forum Verlag nennt eine überarbeitete Fassung vom 28.02.2025 (nur Anlage 9) mit GMBl vom 04.06.2025. BAuA-Seite nicht abrufbar. | Datum gegen die BAuA-Seite prüfen; bis dahin unverändert. |
| O-3 | MVV TB 2026/1 | Stillhaltefrist endete 12.10.2026; Veröffentlichung durch das DIBt nicht feststellbar. 23 Stellen nennen „MVV TB 2025/1“ als eingeführte Fassung. | Nach Veröffentlichung von 2026/1 die Stellen mit eingeführten Eurocode-Ausgaben (Festbeton, Stahlbetonbemessung, Holzbau, Bodenmechanik) gegenprüfen. |
| O-4 | DSGVO / Hosting | `src/modules/Datenschutz.tsx` (Stand Oktober 2026) beschreibt Hosting auf Google Cloud Run, Cookie `GAESA`, Server-Protokolle, Anfragebegrenzung, Live-Abstimmung und Kurzfragebogen über den Server. Nach der Grundsatzentscheidung vom 02.11.2026 läuft die Seite auf Vercel rein statisch; alle /api-Adressen antworten mit 404. Für die Vercel-Fassung stimmen Abschnitt 2 (Anbieter, Drittland, Protokolle), 4 und 5 (Serverfunktionen) und 6 (`GAESA`) nicht. | Rechtstext nicht eigenmächtig geändert (Abstimmung mit dem Datenschutzbeauftragten vorgesehen, Kommentar im Code). Vorschlag: Abschnitt 2 je Betriebsart (`src/data/betriebsart.ts`) – für Vercel Anbieter Vercel Inc. (USA), Rechtsgrundlage, Drittlandübermittlung, Protokolle; Abschnitte 4/5 im Statik-Modus ausblenden oder als „in dieser Fassung nicht verfügbar“ kennzeichnen; `GAESA` streichen. |
| O-5 | ChemVerbotsV im Quiz | `q_hwk_3`: Antwort richtig; `gapAnalysis.coreRule` „national seit 2020 DIN EN 16516“ ist seit 06.08.2026 überholt (Erklärung sagt bereits „galt“). Keine falsch gewordene Frage, daher nicht geändert. | Bei der nächsten Quizrunde „national 2020 bis 05.08.2026 ChemVerbotsV“. |
| O-6 | BauPVO / DPP | 18-Monats-Frist nach dem delegierten Rechtsakt (offen seit F-3 der Paragrafenprüfung 29.10.) – nur Schätzung des ZDB (Deutsche Handwerks Zeitung, 29.01.2025), keine Normstelle. | wie F-3: Satz auf „über delegierte Rechtsakte nach Art. 75“ kürzen. |

## 5. Quellen (abgerufen 02.11.2026, nur aus Suchergebnissen)

- Gebäudetyp E, Referentenentwurf: https://www.mtrlegal.com/gebaeudetyp-e-referentenentwurf-zum-basisstandard/
- GModG, Änderungsübersicht: https://www.buzer.de/gesetz/14072/l.htm
- GefStoffV, Änderungsverordnung 2025 (BR-Drs. 566/25): https://dserver.bundestag.de/brd/2025/0566-25.pdf
- GefStoffV, Bußgeld-Änderung (BR-Drs. 194/26, Entwurf, Inkrafttreten nach Verkündung): https://dserver.bundestag.de/brd/2026/0194-26.pdf
- GefStoffV, Fassungsübersicht: https://www.buzer.de/gesetz/9492/v0.htm
- IHK Karlsruhe, Chemikalien aktuell (GefStoffV in Kraft 20.12.2025): https://www.ihk.de/karlsruhe/fachthemen/umwelt/chemikalien/aktuelle-informationen/gefahrstoffe-neugefasste-trgs-521-7062602
- TRGS 521 (2026): https://umwelt-online.de/recht/t_regeln/trgs/trgs500/521_26.htm
- TRGS 519: https://forum-verlag.com/fachwissen/arbeitsschutz/trgs-519/
- EBV-Novelle: https://www.bdew.de/service/novellierung-der-ersatzbaustoff-vo/
- GewAbfV: https://www.ihk.de/rheinhessen/innovation-umwelt/umwelt/abfallwirtschaft/gewerbeabfallverordnung-gewabfv--3433792, https://www.ihk.de/karlsruhe/fachthemen/umwelt/abfall/aktuelle-informationen, https://www.gesetze-im-internet.de/gewabfv%5F2017/BJNR089600017.html
- KrWG-Novelle: https://www.gleisslutz.com/de/know-how/referentenentwurf-zur-novelle-des-kreislaufwirtschaftsgesetzes-neue-recyclingoptionen-schaerfere-vollzugsinstrumente
- Formaldehyd/ChemVerbotsV: https://www.umweltbundesamt.de/themen/wirtschaft-konsum/produkte/bauprodukte/studien-zur-messung-vermeidung-bewertung-von/formaldehydemissionen-pruefbedingungen-fuer/faq-zu-regelungen-von-formaldehyd-in
- DPP-Zeitplan: https://cobuilder.com/en/digital-product-passport-dpp/digital-product-passports-for-construction-what-the-eus-2026-2029-cpr-working-plan-means-for-stakeholders/, https://www.deutsche-handwerks-zeitung.de/?p=358024
- KI-VO / Digital Omnibus: https://www.ihk.de/ihklw/produkte/beratung-und-service/ecommerce-und-internet/digital-omnibus-verordnung-zur-ki-tritt-in-kraft-7142858, https://www.fgs.de/news-and-insights/blog/detail/eu-ai-act-was-ab-dem-2-august-2026-gilt-und-was-verschoben-wurde
- KI-MIG: https://www.ihk.de/ihklw/produkte/beratung-und-service/ecommerce-und-internet/ki-mig-veroeffentlicht-7142702
- MVV TB 2026/1 (Notifizierung): https://technical-regulation-information-system.ec.europa.eu/en/notification/28201
- MVV TB 2025/1: https://www.eco-institut.de/de/category/neuigkeiten/aktuelles-zur-novellierung-des-bauordnungsrechts/
- BayBO, Viertes Modernisierungsgesetz Bayern: https://www.verkuendung-bayern.de/gvbl/2026-75/
- EUDR: https://www.haufe.de/sustainability/umwelt/eu-entwaldungsverordnung-wo-steht-die-eudr_575774_676882.html
