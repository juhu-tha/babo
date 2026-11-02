# Nachstichprobe 5c (02.11.2026) – die 16 nach Nachstichprobe 5a/5b offenen freigegebenen Module (Positionen 51–66)

**Stand:** 02.11.2026 (Branch `pruefung/nachstichprobe5c-11-02`, Basis origin/main 39f48254)
**Status:** Bericht zur Kenntnis und Entscheidung – keine Prüfvermerke geändert; eine Quizfrage korrigiert (zur Freigabe zurückgestellt).
**Auftrag:** Abschluss der Fehlerquotenmessung an den freigegebenen Modulen. Nachstichprobe 5a (PR #301, ungerade Positionen 1–49) und 5b (PR #300, gerade Positionen 2–50) haben je 25 der 66 Module der Restliste geprüft; diese Prüfung nimmt die übrigen Positionen 51 bis 66. Damit ist jedes freigegebene Modul einmal nachgeprüft (Nachstichproben 1–5c: 136 Module, dazu sieben Module nur in der Gegenprüfung vom 30.10.2026, siehe Gesamtbilanz).

## Auswahl

- **Grundgesamtheit und Ordnung wie Nachstichprobe 5a/5b:** Fachmodule mit Status `geprueft` in `src/data/pruefvermerke.ts` (143) ohne die 70 Module der Nachstichproben 1–4 und ohne die Module der Gegenprüfung; Restliste 66 Module, alphabetisch nach Modul-ID (Python `sorted`, „_“ vor Buchstaben). Das Auswahlskript der Nachstichprobe 5a wurde auf diesen Stand neu ausgeführt (`scratchpad/ns5c/auswahl.py`, Sitzungsablage) und ergibt dieselbe Liste; die Positionen 51 bis 66 stimmen mit den Angaben beider Berichte überein (gerade: NS5b, ungerade: Restangabe NS5a).

| Pos. | Modul | Pos. | Modul | Pos. | Modul |
|---|---|---|---|---|---|
| 51 | `metallkorrosion` | 57 | `px_bauleitung` | 63 | `sicherheitskonzept` |
| 52 | `nachhaltigkeit_daten_regeln` | 58 | `px_planung` | 64 | `sichtbeton` |
| 53 | `nawaro` | 59 | `qualitaetssicherung` | 65 | `sonstiges` |
| 54 | `normen_ausblick` | 60 | `rechnung_nachhaltigkeit` | 66 | `stahlbau_ec3` |
| 55 | `pfas_baustoffe` | 61 | `rechnung_u_wert` | | |
| 56 | `putzemoertel` | 62 | `rueckbau` | | |

## Vorgehen

- **Prüfumfang je Modul wie Nachstichprobe 5a/5b:** Komponente laut `src/routing/ModulInhalt.tsx` mit Importkette; bei geteilten Komponenten nur der Teil der Modul-ID (`px_planung` = Reiter „Planung & Ausschreibung“, `px_bauleitung` = „Bauleitung & Baustelle“ von `Praxiswissen`; `rechnung_u_wert` und `rechnung_nachhaltigkeit` = Reiter von `Beispielrechnungen` mit `RechnungUWert` bzw. `RechnungNachhaltigkeit`; `qualitaetssicherung` = vier Teilkomponenten). Geprüft auf (a) Bezugsgrößen und Einstufungen, (b) Norm-, Teil-, Tabellen-, Abschnitts- und Ausgabenzuordnungen (Registry `src/data/centralNormenRegistry.ts`), (c) Kennwerte gegen die zentralen Konstanten; dazu Fließtext, Tabellen und Datensätze. Ergänzungsbogen `docs/pruefung/kennwert-abgleich/<modul>.md` frisch erzeugt (`node scripts/qa/kennwert-abgleich.mjs --ausgabe …`) als Prüfauftrag; für `px_planung`, `rechnung_u_wert` und `rechnung_nachhaltigkeit` liegt keiner vor (eigene Durchsicht). Einzige gemeldete Kennwertabweichung (S355 f_y = 335 N/mm² für 40 < t ≤ 80 mm in `stahlbau_ec3`) ist richtig.
- **Zusätzlich (Auftrag):** Fristen und Schwellen aus Rechtsquellen an der Primärquelle bzw. am Wortlaut geprüft (EPBD Art. 7, VO (EU) 2025/1988, TrinkwV Anlage 2, GewAbfV § 8, EBV §§ 19/22, GefStoffV, BBodSchV-freie Stellen); Stellen, die #299 (Rechtsstand, Branch `recht/stand-11-2026`) bereits geändert oder bewertet hat, sind nicht doppelt bearbeitet (siehe NS5C-NDR-3).
- **Nachrechnung:** jede Beispielrechnung, jede rechnende Quizfrage einschließlich der rechnerischen Distraktor-Rückmeldungen und die Standardeingaben der Rechner mit eigenem Skript (`scratchpad/ns5c/nachrechnung.py`): **192 Nachrechnungen, davon 190 gegen einen im Modul oder Quiz genannten Wert – alle im Rundungsrahmen** (zwei Standardeingaben ohne angezeigten Sollwert). Regressionstest `tests/nachstichprobe5c.test.ts` über fünf Rechenkerne (`stahlbau`, `sicherheitskonzept`, `korrosionsschutz`, `moertelbedarf`, `pfas`) und die Korrekturen.
- **Quiz:** alle **102 Fragen** der 16 Module gegen Modultext und sinngemäß gelesen (Bereichsgrenzen, Klassen, Rundung, Herleitung jeder rechnerischen Rückmeldung, Merksatz der Lückenanalyse). Fünf Fragen standen bereits auf `verified: false` (`q_px_pl_5`, `q_px_pl_6`, `qn_px_bauleitung_2`, `qn_rechnung_u_wert_2`, `qn_rechnung_nachhaltigkeit_4`, frühere Umsetzungen).
- **Zählregel wie Nachstichprobe 1–5b:** ein Modul zählt als fehlerhaft, wenn der Modulinhalt mindestens eine eindeutig falsche fachliche Aussage, Einstufung oder Zuordnung enthält. Fragen, Hinweise und redaktionelle Punkte zählen nicht; Fehler in Quiz-Erklärungen und -Rückmeldungen werden getrennt ausgewiesen.
- **Quellen:** fünf Websuchen; abgerufen nur Seiten aus den Suchergebnissen (Liste am Ende). Normtexte wurden nicht abgeschrieben.

## Ergebnis

| Modul | Befund | Art | Gewicht | Status |
|---|---|---|---|---|
| `pfas_baustoffe` | NS5C-PF-1 Rechner und Text zählen die Perfluorsulfonsäuren C6 und C7 (PFHxS, PFHpS) zu den **kurzkettigen** PFAS („C4–C7“ für beide Säuregruppen). Nach OECD bzw. UBA sind Sulfonsäuren nur bis C5 kurzkettig; PFHxS ist langkettig (und POP sowie Teil von PFAS-4) | (a) Einstufung im Rechenkern | gering (Kennzahl „Anteil kurzkettig“: Rechnerbeispiel 68 % statt richtig 60 %; Grenzwertbewertung unberührt) | behoben |
| `rueckbau` | NS5C-RB-1 LAGA M 20: „Z2 = deponierungsbedürftig“ – Z 2 ist der eingeschränkte Einbau mit definierten technischen Sicherungsmaßnahmen; deponie- bzw. behandlungsbedürftig ist erst Material oberhalb Z 2 | (a) Einstufung | gering | behoben |
| `nachhaltigkeit_daten_regeln` | NS5C-NDR-1 EPBD Stufe 2028: ZEB-Pflicht für Neubauten „im Eigentum **oder in der Nutzung** öffentlicher Einrichtungen“ – Art. 7 Abs. 1 verpflichtet nur für Gebäude im Eigentum; für genutzte, nicht eigene Gebäude „streben sie an“. Die 2028-Stufe des Lebenszyklus-GWP (> 1000 m²) fehlte, „Ausnahmslos alle“ überzeichnet | (b) Rechtszuordnung | gering | behoben |
| | NS5C-NDR-2 „Von den 9 Erdsystemgrenzen sind **aktuell 6** überschritten“ – Stand Richardson et al. 2023; der Planetary Health Check 2025 des PIK zählt mit der Ozeanversauerung 7 | (e) Aktualität | gering | behoben |
| `metallkorrosion` | NS5C-MK-1 Die Korrosivitätskategorien C1–CX werden als „Schutzdauerklassen L, M, H, VH“ bezeichnet (Schutzdauer ist eine getrennte Festlegung nach DIN EN ISO 12944-1) | (b) Zuordnung | gering | behoben |
| `qualitaetssicherung` | NS5C-QS-1 Quiz `q_qsi_4`: Merksatz der Lückenanalyse „ÜK 1–3 nach DIN 1045-3“ – seit DIN 1045-3:2023-08 nur ÜK 1 und ÜK 2 (so Modultext, Antwortoption und Erklärung derselben Frage) | Quiz | gering | korrigiert (`verified: false`) |
| | NS5C-QS-2 Anzeige „(min 3.0)“ bei der Mindest-Standardabweichung | redaktionell | – | behoben |
| `nachhaltigkeit_daten_regeln`, `rueckbau`, app-weit | Fragen NS5C-NDR-3 (Gebäudetyp E), NS5C-NDR-4 (Leitfaden Nachhaltiges Bauen), NS5C-RB-2 (§ 22 EBV), NS5C-X-1 (Bearbeitungsvermerke „manuell prüfen“) | Frage | – | offen |
| übrige 11 Module | – | – | – | ohne Befund |

**Fehlerquote (Modulinhalt, Zählregel wie Nachstichprobe 1–5b): 4 von 16 Modulen = 25 %** (95-%-Vertrauensbereich nach Wilson **10 % bis 49 %**). **Einschließlich der falschen Quiz-Erklärung: 5 von 16 = 31 %** (Wilson 14 % bis 56 %).

| Stichprobe | Module mit Fachfehler | Quote | Wilson 95 % |
|---|---|---|---|
| Nachstichprobe 1 (29.10.) | 4 von 15 | 27 % | 11 – 52 % |
| Erweiterte Nachprüfung 2 (29.10.) | 5 von 15 | 33 % | 15 – 58 % |
| Nachstichprobe 3 (30.10.) | 4 von 20 | 20 % | 8 – 42 % |
| Nachstichprobe 4 (02.11.) | 1 von 20 | 5 % | 1 – 24 % |
| Nachstichprobe 5a (02.11.) | 4 von 25 | 16 % | 6 – 35 % |
| Nachstichprobe 5b (02.11.) | 3 von 25 | 12 % | 4 – 30 % |
| **Nachstichprobe 5c (02.11.)** | **4 von 16** | **25 %** | **10 – 49 %** |
| Nachstichprobe 5 gesamt (66 Module der Restliste) | 11 von 66 | 17 % | 10 – 27 % |
| Nachstichprobe 4 bis 5c | 12 von 86 | 14 % | 8 – 23 % |

- **Statistik (exakter Test nach Fisher):** Nachstichprobe 5c gegenüber 5a/5b zusammen (7 von 50) zweiseitig p = 0,44, gegenüber Nachstichprobe 1–4 (14 von 70) p = 0,74 – kein Unterschied nachweisbar. Nachstichprobe 4 bis 5c (12 von 86) gegenüber Nachstichprobe 1–3 (13 von 50): zweiseitig p = 0,11, einseitig „gesunken“ p = 0,07 – ein Rückgang ist angedeutet, aber nicht gesichert.
- Bei einer wahren Quote von 10 % träten 4 oder mehr Fehlermodule unter 16 mit 7 % Wahrscheinlichkeit auf, bei 20 % mit 40 %. Der hohe Punktschätzer der kleinen Teilstichprobe ist mit der Quote der übrigen Restliste vereinbar.
- **Art der Fehler:** wie in allen Nachstichproben nie im Ergebnis eines Nachweises, sondern in Einstufungen und Zuordnungen: zwei Klassenzuordnungen aus Fachkonventionen (PFAS-Kettenlänge, LAGA-Zuordnungswerte), eine Rechtszuordnung (EPBD Art. 7) und eine Normbegriffsverwechslung (Korrosivitätskategorie/Schutzdauer); dazu eine überholte „aktuell“-Angabe. Zwei der vier Fehlermodule betreffen wieder **Rechtsquellen außerhalb der zentralen Konstanten** (EPBD, LAGA M 20), wie in Nachstichprobe 5a (3 von 4).
- **Rechenkerne:** 190 Nachrechnungen gegen Modul- und Quizwerte stimmen. Der einzige Kernbefund (NS5C-PF-1) ist eine fachlich falsche Klassengrenze, keine Rechenabweichung; die Grenzwertbewertung PFAS-20/PFAS-4 ist richtig.
- **Gewichtige Fehler (Rechenergebnis oder Nachweisentscheidung falsch): keine.** Kein Anlass für die Rücknahme eines Prüfvermerks.

## Gesamtbilanz Nachstichprobe 1 bis 5c (alle freigegebenen Module)

| | Module | mit Fachfehler | Quote | Wilson 95 % |
|---|---|---|---|---|
| Nachstichprobe 1, 2, 3 (29./30.10.) | 50 | 13 | 26 % | 16 – 40 % |
| Nachstichprobe 4, 5a, 5b, 5c (02.11.) | 86 | 12 | 14 % | 8 – 23 % |
| **Nachstichprobe 1 bis 5c** | **136** | **25** | **18 %** | **13 – 26 %** |
| Gegenprüfung 30.10. (nur dort geprüft: `bim_baustoffe`, `boden_materialaufbereitung`, `materialmodelle`, `regularien`, `schadstoffe`, `sonderbetone`, `spannbeton_grundlagen`) | 7 | – | – | gezielte Nachkontrolle einzelner Korrekturen, keine Vollprüfung nach (a)/(b)/(c); Fehler gefunden und behoben in `boden_materialaufbereitung` (GC-BM-1/-2) und `schadstoffe` (GC-SS-1) |

- **143 freigegebene Module:** 136 sind in genau einer Nachstichprobe vollständig nach (a)/(b)/(c) nachgeprüft, die übrigen 7 nur in der Gegenprüfung (dort wurden in 2 von 7 Fehler gefunden). Rechnet man diese 7 mit ihren Gegenprüfungsfunden hinzu, sind es mindestens **27 von 143 Modulen (19 %)** mit einem behobenen Fachfehler. Alle gefundenen Fehler sind behoben oder als Frage vorgelegt. **Gewichtig** (Einstufung bzw. Nachweisentscheidung falsch) war über alle Nachstichproben nur ein Befund: NS-BD-1 in `bauwerksdiagnose` (Nachstichprobe 1, Kerne h/d = 1 über den Zylinderwert eingestuft, behoben); seit Nachstichprobe 3 keiner.
- **Lage der Fehler über alle Nachstichproben:** Fließtext, Beispiele, Karten- und Katalogwerte, Rechts- und Normzuordnungen; nie in der Rechnung eines Rechenkerns (NS5C-PF-1 ist eine falsche Klassengrenze im Kern, keine Rechenabweichung). Prüfskripte (`kennwert-abgleich.mjs`, `quiz-text-abgleich.mjs`) finden die zentralen Kennwerte zuverlässig, aber nicht Rechtsfristen, Schwellen und Klassenzuordnungen aus Fachkonventionen – dort lagen in Nachstichprobe 5a/5c 5 von 8 Befunden.
- **Vorschlag (wie NS5a):** zentrale Fristen-/Schwellenliste (`src/data/rechtsfristen.ts`) mit Quelle je Eintrag und Abgleichskript; zusätzlich Klassengrenzen aus Fachkonventionen (PFAS-Kettenlänge, LAGA-Zuordnungswerte, EBV-Materialklassen) dort mit führen.

## Befunde je Modul

### 51. Metallkorrosion (`metallkorrosion`)
**Nachrechnungen:** Beispiel 1 t = 85/2,1 = 40 a (C3, DIN EN ISO 1461 Mittelwert 85 µm bei t > 6 mm), C5 85/8,4 bis 85/4,2 = 10 bis 20 a; Beispiel 2 PREN 1.4404 = 24,4, 2205 = 34,6; Quiz 120/4,2 = 29 a mit allen Distraktoren (57, 171, 14 a; 19,8; 23,6; 180), Reaktionsgleichungen Rost und Malachit stöchiometrisch – richtig (Kern `zinkSchutzdauer`).
**(b)/(c):** DIN EN ISO 9223:2012-05 (Zinkabtrag C2 0,1–0,7 … CX 8,4–25 µm/a), DIN EN ISO 12944-2/-3 (Kantenradius ≥ 2 mm), Schutzdauer L/M/H/VH nach Teil 1, DIN EN 1993-1-4 Anhang A (CRC), abZ Z-30.3-6, PBR Al 1,28/Cu₂O 1,68/Fe₂O₃ ≈ 2,1, Sensibilisierung 450–850 °C, LC-Stahl C < 0,03 %, Superduplex 1.4410 PREN > 40 – richtig.
- **behoben – NS5C-MK-1 (b):** „Der Planer muss die Umwelt vorab in standardisierte Kategorien einordnen (Schutzdauerklassen L, M, H, VH)“ – die folgende Tabelle zeigt die Korrosivitätskategorien C1 bis CX; L/M/H/VH sind die Schutzdauerklassen nach DIN EN ISO 12944-1 (≤ 7, 7–15, 15–25, > 25 Jahre). Neu: „… in standardisierte Korrosivitätskategorien einordnen (C1 bis CX) und die geforderte Schutzdauer festlegen (L, M, H, VH nach Teil 1)“ (`content/metallkorrosion/Metallkorrosion.json`).

### 52. Nachhaltigkeit: Daten & Regeln (`nachhaltigkeit_daten_regeln`)
**Nachrechnungen:** Beispiel 1 Taxonomie 0,90 · 40 = 36 ≥ 34 kWh/(m²a); Beispiel 2 CRREM (52 − 18)/10 = 3,4, 2026: 31,6 < 32,0, Schnittpunkt 2029,4; Quiz 0,90 · 50 = 45 (Distraktoren 47,5 und 40); Stoffstromrechner 3,5 + 0,101 · 25 = 6,0 kg CO₂-Äq./t – richtig.
**(b)/Rechtsquellen:** EPBD Art. 7 Abs. 2 (Lebenszyklus-GWP ab 01.01.2028 > 1000 m², ab 01.01.2030 alle Neubauten, Offenlegung im Ausweis – [Wortlaut](https://gesetzefinden.at/eu-recht/richtlinien/eu.32024l1275/artikel-7)), Art. 17 Abs. 15 (keine Förderung fossiler Einzelkessel ab 2025), Taxonomie 7.1 (−10 % NZEB, > 5000 m² GWP, Luftdichtheit), QNG-PLUS 24 / PREMIUM 20 kg CO₂e/(m²a) und PENRT 96 (Quiz), § 7b EStG, § 22 EBV 250 m³, KrWG § 6, Kyoto/Paris/COP 28, Leitfaden 2001, Daly 1990, MCI-Formel – richtig. Quiz `q_ndr_1`, `q_ndr_7` (ZEB öffentliche Neubauten im Eigentum ab 2028) stimmen.
- **behoben – NS5C-NDR-1 (b):** Stufe 2028 „Alle neuen Gebäude im Eigentum **oder in der Nutzung** öffentlicher Einrichtungen müssen als ZEB errichtet werden“ – nach Art. 7 Abs. 1 EPBD gilt die Pflicht ab 01.01.2028 für neue Gebäude im Eigentum öffentlicher Einrichtungen; für neue Gebäude, die sie nutzen, ohne Eigentümer zu sein, „streben sie an“, dass es Nullemissionsgebäude sind. Neu mit diesem Unterschied und der 2028-Stufe des Lebenszyklus-GWP (> 1000 m² Nutzfläche); Stufe 2030 ohne „Ausnahmslos“, GWP-Pflicht „für alle Neubauten (Art. 7 Abs. 2)“ (`content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json`).
- **behoben – NS5C-NDR-2 (e):** Reiter Definitionen: „Von den 9 definierten Erdsystemgrenzen sind aktuell 6 überschritten“ – das ist der Stand von Richardson et al. (2023); der Planetary Health Check 2025 (PIK, September 2025) zählt sieben, neu die Ozeanversauerung ([DKKV](https://dkkv.org/en/planetary-health-check-2025-seven-out-of-nine-planetary-boundaries-have-been-exceeded/)). Neu: „waren nach Richardson et al. (2023) 6 überschritten (…); der Planetary Health Check 2025 des PIK (September 2025) zählt mit der Ozeanversauerung 7“ (`content/nachhaltigkeitdatenregeln/DefinitionenTab.json`).
- **Hinweise (kein Fehler):** Zeitleiste 1987 „Formulierung des Drei-Säulen-Modells“ – der Reiter Definitionen ordnet das Modell der Enquete-Kommission 1998 zu; Bauschutt „zu ca. 80 % zu RC-Schotter … downgecycelt“ meint sinngemäß die Verwertungsquote.

### 53. NaWaRo (`nawaro`)
**Nachrechnungen:** BSH 420/1,12 = 375 kg, C 187,5 kg, CO₂ 688 kg (DIN EN 16449, cf = 0,5); Quiz 2 m³ Fichte 1,47 t mit Distraktoren 0,74/1,65/0,40 t, 0,21/1,54/0,38 t; Temperaturleitfähigkeit HF 1,19 · 10⁻⁷, EPS 1,17 · 10⁻⁶ m²/s, Faktor 9,8 (Distraktoren 8 und 1,1); Navigator ρ · c = 567 kJ/(m³K) – richtig.
**(b)/(c):** GL24h E = 11 500 N/mm², f_m,k = 24, ρ_mean 420 kg/m³ (DIN EN 14080), C25/30 E_cm 31 000, f_ctm 2,6 (EC2 Tab. 3.1), ETA-17/0247 Baustroh, DIN EN 13171:2015-04, DIN EN 15101-1:2019-07, DIN 4108-10:2021-11, DIN 68800-1 bis -4, DIN 4108-2:2026-05 mit Hinweis auf 2013-02 (wie Bauphysik, Energieausweis) – richtig. Ohne Befund (Bearbeitungsvermerk Seegras siehe NS5C-X-1).

### 54. Ausblick neue Normengeneration (`normen_ausblick`)
**Nachrechnungen:** x_c,50 = XRC · √50: XRC 3 → 21 mm, XRC 2 → 14 mm, Distraktoren 25 mm (XRC 3,5), 100 mm (linear) – richtig.
**(b):** eingeführte Ausgaben DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04, DIN EN 1993-1-1:2010-12 + A1:2014-07, DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA:2013-08, DIN EN 1990:2021-10; 2. Generation (EC2 2025-09, EC3 2025-04, EC5 2026-09) als nicht eingeführt gekennzeichnet; M/515 (2012), DAV 30.03.2026, DoP 30.09.2027, DoW 30.03.2028, Paket 1. Generation 01.07.2012; XRC 0,5–7 und XRDS 0,5–10 (als Lesart gekennzeichnet), DIN EN 12390-10/-11/-12 – richtig. Die Registry-Abweichungen des Bogens sind gewollte Nennungen der neuen Ausgaben. Ohne Befund.

### 55. PFAS in Baustoffen (`pfas_baustoffe`)
**Nachrechnungen:** Beispiel 1 x = 8/22 = 0,36; Beispiel 2 E = 0,5 · 2 = 1,0 µg/kg, 400 t → 0,4 g, rechnerisch 20 Mio. l auf 20 ng/l; Rechnerbeispiel Σ PFAS-20 = 77 (82,5 mit BG/2), Σ PFAS-4 = 28 ng/l; Quiz 18 ng/l (Distraktor 14), Spanne 92 bis 112 ng/l – richtig (Kern `pfasSummenbewertung`).
**Rechtsquellen:** TrinkwV Anlage 2 Teil I: PFAS-20 0,1 µg/l ab 12.01.2026, PFAS-4 0,02 µg/l ab 12.01.2028, „PFAS gesamt“ 0,5 µg/l nicht übernommen ([White & Case](https://www.whitecase.com/insight-alert/new-standards-drinking-water-germany-new-limits-pfas)); VO (EU) 2025/1988 Feuerlöschschäume, in Kraft 23.10.2025, Summe aller PFAS ≥ 1 mg/l, gestaffelte Übergänge ([EUR-Lex](https://eur-lex.europa.eu/eli/reg/2025/1988/oj/eng), [IHK Braunschweig](https://www.ihk.de/braunschweig/beratung-und-service/umwelt-und-energie/umwelt/reach-verordnungen/pfas-beschraenkung-fuer-feuerloeschschaeume-tritt-in-kraft-6777792)); POP PFOS 2009, PFOA 2019, PFHxS 2022; (EU) 2021/1297, (EU) 2024/2462; EFSA 2020 TWI 4,4 ng/kg KG und Woche; OECD-Definition 2021 – richtig.
- **behoben – NS5C-PF-1 (a), Rechenkern:** Der Rechner wies den „Anteil kurzkettiger PFAS (C4–C7)“ aus und zählte dabei alle Stoffe mit c ≤ 7, also auch die Sulfonsäuren PFHxS (C6) und PFHpS (C7); der Text „Mobilität“ nannte ebenfalls C4–C7 für alle PFAS. Nach OECD und UBA sind kurzkettig die Perfluorcarbonsäuren mit weniger als sieben perfluorierten C-Atomen (PFBA bis PFHpA, C4–C7) und die Perfluorsulfonsäuren mit weniger als sechs C-Atomen (PFBS, PFPeS, C4–C5) ([UBA, PFAS-Portal](https://www.umweltbundesamt.de/themen/chemikalien/chemikalien-reach/stoffe-ihre-eigenschaften/stoffgruppen/pfas-portal-start)); PFHxS ist langkettig, Teil von PFAS-4 und POP. Neu: Funktion `istKurzkettig` in `src/calc/pfas.ts` (Sulfonsäuren c ≤ 5, Carbonsäuren c ≤ 7); Texte „Carbonsäuren C4–C7, Sulfonsäuren C4–C5“ (`content/pfasbaustoffe/PfasBaustoffe.json`). Rechnerbeispiel: 49,5/82,5 = 60 % statt 68 %. Die Regressionstests `tests/pfas.test.ts` und `tests/modulpruefungTranche12.test.ts` sind auf den neuen Sollwert umgestellt (mit Vermerk). Keine Quizfrage betroffen.

### 56. Putze & Mörtel (`putzemoertel`)
**Nachrechnungen:** Gipsputz 50 · 15 · 1,1 = 825 kg = 33 Sack; Quiz 80 · 20 · 1,25 = 2000 kg = 80 Sack, Distraktoren 64, 103 (Faktor 1,6), 40 Sack; C₃S-Hydratation stöchiometrisch – richtig (Kern `putzbedarf`).
**(b):** DIN EN 998-1/-2:2017-02 (CS I 0,4–2,5 … CS IV ≥ 6; M 1 bis M 20, MG IIa ≙ M 5), LM 21 ≤ 700 kg/m³, DIN EN 13279-1, DIN EN 13914-1/-2:2016-09, DIN 18550-1/-2, DIN 4108-3:2024-03 (w ≤ 0,5, s_d ≤ 2,0 m, w · s_d ≤ 0,2; wasserhemmend 0,5 < w < 2,0), WTA 2-9-20/D (Luftporen > 25 Vol.-%, Porosität ≥ 40 Vol.-%, Abschlagen ≥ 80 cm über Schadensgrenze, Spritzbewurf ≤ 50 %, Sanierputz ≥ 20 mm), Dünnbettfuge 1–3 mm – richtig. Ohne Befund (Bearbeitungsvermerk Aerogel-Putz siehe NS5C-X-1).

### 57./58. Praxiswissen Bauleitung und Planung (`px_bauleitung`, `px_planung`)
**Nachrechnungen:** c_nom XC4 = 25 + 15 = 40 mm; Gleichwertigkeit R = 0,160/0,035 = 4,57 m²K/W, d_erf = 0,183 m; w/z 165/300 = 0,55 → 175/300 = 0,58 (Δ 0,03); f_bd = 2,25 · 1,8/1,5 = 2,7 N/mm², l_b,rqd = 483 mm, l_0 = 1,4 · 483 = 677 mm (Tab. 8.3DE: Ø < 16 mm, > 33 %); Quiz Ø 14: 564 mm (Distraktoren 790, 2256 mm), HOAI-Anteile Σ 100 % – richtig.
**(b)/Rechtsquellen:** § 7 Abs. 2 VOB/A („oder gleichwertig“), § 4 Abs. 3, § 6 Abs. 1, § 13 Abs. 3 VOB/B, HOAI § 34 Abs. 3 (2/7/15/3/25/10/4/32/2 %), Anlage 10 LPH 8, DIN 18533 (W1-E, W2.1-E ≤ 3 m), EN 1992-1-2 Tab. 5.2a (R 90, μ_fi = 0,5: 300/45, 400/38), Nachbehandlung 35/50/70 % f_ck, Fahrmischer 90 min, F3 420–480 mm, LP-Mindestwert 4,5 Vol.-% bei 16 mm, DIN EN 12390-2 (16 h bis 3 d, 20 ± 5 °C; Wasserlagerung 20 ± 2 °C), Δc_dev 15/10 mm, CM-Grenzwerte 2,0/1,8 bzw. 0,5/0,3 CM-%, Einbaufeuchte ≤ 20 %, REACH Anhang XVII Nr. 47 – richtig. Ohne Befund.

### 59. Qualitätssicherung (`qualitaetssicherung`, mit Grundlagen, Betonbauklassen, Konformitätskontrolle, CSC)
**Nachrechnungen:** Beispiel C30/37 (Würfel) σ = max(2,5; 3,0), f_cm ≥ 41,4, f_ci ≥ 33 N/mm²; Szenarien 1 (Mittel 35,5 ≥ 34, Würfel), 2 (n = 15, Mittel 41,64 ≥ 41,44, s = 1,77 → 3,0), 3 (Zylinder, Mittel 29,93 < 31,0); Quiz 41,4 (Distraktor 40,3), 29/21, 38 N/mm² – richtig; Bezugsgrößen Würfel/Zylinder jeweils konsistent.
**(b):** DIN EN 206 8.2.1 und Anhang B (n = 1: f_ck − 4; 2–4: + 1; 5–6: + 2), DIN 1045-1000:2023-08 (BBQ-N/E/S), DIN 1045-3:2023-08 (nur ÜK 1/ÜK 2), CSC-Credit-Anteile 60/25/15 % (Gewichtungen als Lehrannahme gekennzeichnet) – richtig.
- **korrigiert – NS5C-QS-1 (Quiz):** `q_qsi_4`, Merksatz der Lückenanalyse „BBQ-N/E/S nach DIN 1045-1000; ÜK 1–3 nach DIN 1045-3“ – widerspricht Modultext, Antwortoption 4 und Erklärung derselben Frage (die Zweitprüfung 27.10. hatte nur diese berichtigt). Neu „ÜK 1 und ÜK 2 nach DIN 1045-3:2023-08 (die frühere ÜK 3 ist entfallen)“; `verified: false`, Vermerk in `vorpruefung.hinweis`, Prüfliste neu erzeugt (`docs/pruefung/quiz-cluster-III.md`).
- **behoben – NS5C-QS-2 (redaktionell):** „(min 3.0)“ → „(mind. 3,0)“ (`src/modules/Konformitaetskontrolle.tsx`).

### 60. Beispielrechnung Nachhaltigkeit (`rechnung_nachhaltigkeit`)
**Nachrechnungen:** d_k = 4,0 · √50 = 28,3 mm; m_Z = 8,49 kg, CaO reagiert 3,31 kg, CO₂ 2,60 kg/m² (Distraktoren 4,33 und 4,22); t = (30/4)² = 56 a (Distraktoren 7,5, 112, 225); GWP A = 42,56 t, B = 17,68 t, Δ 24,9 t = 58,5 % (Distraktoren 140,7 %, 25,9 t/60,9 %, 41,5 %) – richtig.
**(c):** CEM I 665 kg/t netto (brutto 875), CEM III/B 260 kg/t Lehrwert, CEM II/C-M 400 kg/t – gleich `src/data/zementGwp.ts`. Ohne Befund.

### 61. Beispielrechnung U-Wert (`rechnung_u_wert`)
**Nachrechnungen:** Standardwand R_T = 4,278 m²K/W, U = 0,234 W/(m²K); Quiz 12 cm EPS U = 0,270, erforderliche Dicke 13,6 cm, 40 cm Beton U = 0,229, Dämmanteil 93 % mit allen Distraktoren (0,243; 0,250; 0,28; 0,29; 11,5/14,2/15,6 cm; 97 %; 39 %) – richtig.
**(b)/(c):** R_si 0,13 / R_se 0,04 (DIN EN ISO 6946), λ Stahlbeton 2,3 (DIN EN ISO 10456), Höchstwert 0,24 W/(m²K) Anlage 7 GModG (Änderung bestehender Wohngebäude), Mindestwärmeschutz R ≥ 1,2 m²K/W – richtig. Ohne Befund (Bearbeitungsvermerk DIN 4108-2 siehe NS5C-X-1).

### 62. Rückbau & Material (`rueckbau`)
**Nachrechnungen:** Beispiel 1 Σ = 2880 + 480 + 30 + 40 = 3430 t, Q_min = 98 %; Beispiel 2 ΔK = 3360 · 23 − 40 000 = 37 280 €; Quiz Q_min = 97,7 % (Distraktoren 80,8; 95,5 Volumenanteil; 98,9 %) – richtig.
**(b)/Rechtsquellen:** GewAbfV § 8 (zehn Fraktionen, Dokumentation ab 10 m³, so auch #299 O-1), § 9 (Vorbehandlung, Sortierquote 85 %), § 4 Abs. 3 (90 % nur gewerbliche Siedlungsabfälle), KrWG § 9/§ 9a, EBV § 19 Abs. 7/8 und § 22 (RC-3, vier Wochen), GefStoffV § 5a, Ampel 10 000/100 000 F/m³ (Genehmigung im mittleren Risiko wie #299 R-2), POP-VO Anhang IV HBCDD 500 mg/kg, gefährlich ab 30 000 mg/kg, AIR-PCB 80/800 ng/m³, VDI 6202 Blatt 3:2021-09, R-Beton DIN 1045-2:2023-08 Anhang E (45/35 Vol.-%), AVV-Schlüssel – richtig.
- **behoben – NS5C-RB-1 (a):** Reiter Aktualität: „In Bayern galt z. B. der RC-Leitfaden des LfU mit den Einstufungen unbedenklich (Z0), eingeschränkt (Z1.1, Z1.2) oder deponierungsbedürftig (Z2).“ Nach LAGA M 20 steht Z 2 für den eingeschränkten Einbau mit definierten technischen Sicherungsmaßnahmen; erst Material oberhalb von Z 2 ist zu deponieren oder zu behandeln. Neu entsprechend (`content/rueckbau/AktualitaetTab.json`).
- **Hinweis (kein Fehler):** HBCD in EPS/XPS „vor Baujahr 2014“ (Epochenkarte) und „bis Baujahr ca. 2015“ (Recyclingmatrix) uneinheitlich, beides als Näherung vertretbar.

### 63. Eurocode-Sicherheitskonzept (`sicherheitskonzept`)
**Nachrechnungen:** Beispiel 1 N_Ed = 1,35 · 800 + 1,50 · 300 = 1530 kN, f_cd = 17,0, N_Rd = 2083 kN, η = 0,73; Beispiel 2 −1,40 bzw. −1,50 kN/m²; Quiz 1530 (Distraktoren 1100/1380/1650), f_cd 17,0 (20,0/25,5/30), quasi-ständig 6,6 (8,0/11,1/7,4); Rechner-Standardeingabe 23,7 kN – richtig (Kern `kombination610`).
**(b):** DIN EN 1990:2021-10 mit NA:2010-12 und NA/A1:2012-08, Tab. NA.A.1.1 (ψ₀ 0,7/1,0/0,5/0,7/0,6/0,6) und NA.A.1.2(B), DIN EN 1992-1-1/NA Tab. 2.1DE, Gl. (6.8)/(6.10)/(6.16b), CEN/TS 19100 und 19101 – richtig. Ohne Befund.

### 64. Sichtbeton (`sichtbeton`)
**Nachrechnungen:** c_nom = 40 mm; Porenanteil 600/250 000 = 0,24 %; Quiz 0,72 % → P2 (Distraktor 7,2 %); Mischung w/z = 175/350 = 0,50 – richtig.
**(b):** DBV/VDZ-Merkblatt Sichtbeton (Juni 2015; SB 1–SB 4, P1 ≤ 3000 … P4 ≤ 750 mm² je 500 × 500 mm), DIN 18217, DIN 18218 – richtig. Ohne Befund.

### 65. Sonstige & Innovationen (`sonstiges`)
**Nachrechnungen:** PCM 2,0 · 5 + 150 = 160 kJ/kg gegen Beton 5 kJ/kg (Faktor 32); Quiz 1920 kJ (Distraktoren 120/1800/60 kJ); Calciumlactat-Gleichung stöchiometrisch; VIP/EPS 5 – richtig.
**(b):** DIN EN 13055:2016-11 (≤ 2000 bzw. 1200 kg/m³), DIN EN 17140:2021-02, RAL-GZ 896, Aerogel λ 0,013–0,018 W/(m·K), VIP 0,007–0,008 (belüftet ≈ 0,020), Jonkers 2011 – richtig. Ohne Befund.

### 66. Stahlbau nach Eurocode 3 (`stahlbau_ec3`)
**Nachrechnungen:** Beispiel 1 N_pl,Rd = 282,0, N_u,Rd = 254,0 kN, η = 0,79; Beispiel 2 IPE 300 c/t 5,3 und 35,0 (Klasse 1), M_pl,Rd = 147,7, M_el,Rd = 130,9 kNm, Steg unter Druck S235 Kl. 2/S355 Kl. 4 (42ε = 34,2); Beispiel 3 HEB 200 λ̄_z = 0,840, Φ = 1,010, χ_z = 0,637, N_b,z,Rd = 1063 kN, λ̄_y = 0,499, χ_y = 0,885, 1476 kN, N_c,Rd = 1835 kN (58 %); Quiz 212,5 kN (236,2/138,7/235,0), λ̄_z 0,84 (1,03 bei S355), L_cr 3 → 6 m: 1280 → 678 kN (53 %), χ(1,0) 0,47 bis 0,73 – richtig (Kerne `bemesseZugstab`, `biegewiderstandY`, `bemesseDruckstab`).
**(b)/(c):** DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (γ_M0 1,0, γ_M1 1,1, γ_M2 1,25), Tab. 3.1 (S355 > 40 mm: 335 N/mm² – Bogenmeldung richtig), Tab. 5.2, 6.1, 6.2, 6.3.1.2(4), DIN EN 10025-2/-3:2019-10 – richtig. Ohne Befund.

## Behobene Punkte (dieser PR)

| Kennung | Modul | Datei | Änderung |
|---|---|---|---|
| NS5C-PF-1 | `pfas_baustoffe` | `src/calc/pfas.ts`, `content/pfasbaustoffe/PfasBaustoffe.json`, `tests/pfas.test.ts`, `tests/modulpruefungTranche12.test.ts` | kurzkettig = Carbonsäuren C4–C7, Sulfonsäuren C4–C5 (`istKurzkettig`); Rechnerbeispiel 60 % statt 68 % |
| NS5C-RB-1 | `rueckbau` | `content/rueckbau/AktualitaetTab.json` | LAGA M 20: Z 2 = eingeschränkter Einbau mit technischen Sicherungsmaßnahmen; Deponie erst oberhalb Z 2 |
| NS5C-NDR-1 | `nachhaltigkeit_daten_regeln` | `content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json` | ZEB 2028 nur für Gebäude im Eigentum öffentlicher Einrichtungen (Nutzung: „anstreben“); Lebenszyklus-GWP 2028 > 1000 m², 2030 alle |
| NS5C-NDR-2 | `nachhaltigkeit_daten_regeln` | `content/nachhaltigkeitdatenregeln/DefinitionenTab.json` | 6 von 9 Grenzen (Richardson 2023) → 7 von 9 (Planetary Health Check 2025) |
| NS5C-MK-1 | `metallkorrosion` | `content/metallkorrosion/Metallkorrosion.json` | Korrosivitätskategorien C1–CX und Schutzdauer L/M/H/VH getrennt |
| NS5C-QS-1 | `qualitaetssicherung` | `src/data/quiz.json`, `docs/pruefung/quiz-cluster-III.md` | `q_qsi_4` Merksatz ÜK 1 und ÜK 2; `verified: false` |
| NS5C-QS-2 | `qualitaetssicherung` | `src/modules/Konformitaetskontrolle.tsx` | „(mind. 3,0)“ (redaktionell) |

Regressionstest: `tests/nachstichprobe5c.test.ts`. Kein Prüfvermerk geändert, kein Normtext gekennzeichnet (kein Normtextpunkt offen). Die Datei `NachhaltigkeitDatenRegeln.json` ändert auch #299 (Eintrag EBV in den Regelwerken); die Änderungen hier betreffen andere Schlüssel.

## Offene Fragen mit Vorschlag

| Kennung | Modul | Frage | Vorschlag |
|---|---|---|---|
| NS5C-NDR-3 | `nachhaltigkeit_daten_regeln` | Gebäudetyp E: „nach Eckpunkten vom 20.11.2025 befindet sich ein neuer Gesetzentwurf in der Ressortabstimmung, ist aber noch nicht veröffentlicht (Stand 10/2026)“ – nach #299 (R-10, R-11) liegt seit 26.10.2026 ein Referentenentwurf vor (Stellungnahmen bis 09.11.2026). #299 hat diese Stelle nicht geändert; hier nicht doppelt bearbeitet | nach dem Merge von #299 im selben Wortlaut wie dort: „… liegt seit 26.10.2026 ein Referentenentwurf von BMJV und BMWSB vor (Stellungnahmen bis 09.11.2026); Kabinettsbeschluss und parlamentarisches Verfahren stehen aus (Stand 11/2026)“ |
| NS5C-NDR-4 | `nachhaltigkeit_daten_regeln` | Leitfaden Nachhaltiges Bauen: Reiter Definitionen „BMWSB … 2021“ (2 Stellen), Literatur „BMI, Stand Januar 2019“; das BMWSB besteht erst seit Dezember 2021, eine Ausgabe 2021 ist nicht belegt | einheitlich „BMI (Hrsg.): Leitfaden Nachhaltiges Bauen, 3. Aufl., Stand Januar 2019“, falls keine spätere Ausgabe nachgewiesen wird |
| NS5C-RB-2 | `rueckbau` | Reiter Baustoffrecycling: „Einbauerstatter müssen Einbauten mineralischer Ersatzbaustoffe ab 250 m³ behördlich melden“ (Überschrift „Ersatzbaustoffregister“) – § 22 EBV betrifft nur bestimmte Materialklassen und Einbauweisen (der Reiter Aktualität nennt RC-3 richtig) | an den Wortlaut von § 22 Abs. 1 angleichen: „Der Verwender zeigt den Einbau bestimmter Materialklassen (u. a. RC-3, BM-F3, BG-F3) ab 250 m³ vier Wochen vorher an; die Behörde führt ein Kataster“ (Normtextprüfung der Klassenliste vorher) |
| NS5C-X-1 | app-weit (6 Stellen hier) | 32 sichtbare Bearbeitungsvermerke „manuell prüfen/abgleichen“ in 25 Dateien, hier: Taxonomie-Normquelle „(Stand manuell prüfen)“, Seegras „(Euroklasse manuell prüfen)“, Aerogel-Putz „(… manuell prüfen)“, CSC R-Modul und LEED, U-Wert „Neuausgabe 2026-05 manuell abgleichen“ (vgl. NS5B-DP-1) | in einer eigenen Runde einheitlich ersetzen: Normbezug → „vorläufig, Normprüfung ausstehend“ (mit FACHGEBIETE-Abgleich in `scripts/auditDaten.ts`), Produktklasse → „nach Leistungserklärung des Produkts“, sonst „Stand nicht geprüft“ |

## Quellen (abgerufen 02.11.2026, nur aus Suchergebnissen)

- EPBD (EU) 2024/1275, Art. 7: https://gesetzefinden.at/eu-recht/richtlinien/eu.32024l1275/artikel-7
- Planetary Health Check 2025 (7 von 9 Grenzen): https://dkkv.org/en/planetary-health-check-2025-seven-out-of-nine-planetary-boundaries-have-been-exceeded/
- UBA, PFAS-Portal (Definition kurzkettig): https://www.umweltbundesamt.de/themen/chemikalien/chemikalien-reach/stoffe-ihre-eigenschaften/stoffgruppen/pfas-portal-start
- VO (EU) 2025/1988, Feuerlöschschäume: https://eur-lex.europa.eu/eli/reg/2025/1988/oj/eng, https://www.ihk.de/braunschweig/beratung-und-service/umwelt-und-energie/umwelt/reach-verordnungen/pfas-beschraenkung-fuer-feuerloeschschaeume-tritt-in-kraft-6777792
- TrinkwV, PFAS-Grenzwerte und Stichtage: https://www.whitecase.com/insight-alert/new-standards-drinking-water-germany-new-limits-pfas
- Übrige Rechtsangaben (GewAbfV § 8, GefStoffV, Gebäudetyp E) nach den in #299 (`docs/pruefung/rechtsstand-2026-11.md`) abgerufenen Quellen; EBV § 22 und BBodSchV wie Nachstichprobe 5a.
