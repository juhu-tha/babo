# Zweite Prüfrunde Rechtsquellen – freigegebene Module und ihre Quizfragen

**Stand:** 03.11.2026 (Branch `pruefung/rechtsquellen-11-03`, Basis origin/main d53de8e0)
**Anlass:** Gesamtgutachten 03.11.2026 (PR #314, `docs/review/gesamt-2026-11-03.md`, Maßnahme 6 und „Gezielte zweite Runde nur für Rechtsquellen“) und Nachstichproben 5a–5c: Die verbliebenen Fehler liegen fast nur in Rechtszuordnungen, Fristen, Schwellen und Einstufungen aus Rechtsquellen.
**Umfang:** alle 143 Module mit Prüfvermerk „geprüft“ (`src/data/pruefvermerke.ts`) – deren Inhaltsdateien (`content/`, Modul-TSX und `src/data`, Zuordnung wie `scripts/qa/kennwert-abgleich.mjs`), die gemeinsam genutzten Dateien und das in drei freigegebenen Modulen eingebundene `RechtsrahmenKompendium` – sowie die 886 Quizfragen dieser Module.
**Basis:** nach PR #320 (`umsetzung/gutachten-11-03` eingemergt; dessen Änderungen „Materialklassen“, Abfallende im Kompendium und `src/data/klassengrenzen.ts` sind nicht doppelt bearbeitet).
**Nicht geändert:** Prüfvermerke. Quizfragen nur, wo eine Aussage falsch war (dann `verified: false`, Vermerk, Prüflisten mit `scripts/pruefliste.ts` neu erzeugt).

## 1. Gewichtige Fehler (falsche Pflicht oder Einstufung mit Rechtsfolge)

| Nr. | Fundstelle | Vorschrift | vorher | nachher | Quelle |
|---|---|---|---|---|---|
| RQ-1 | Quiz `qn_pfas_baustoffe_6` (`pfas_baustoffe`); `content/pfasbaustoffe/PfasBaustoffe.json` (`werte.derGrenzwertLiegtInnerhalb`, `werte.trinkwv2023Anlage2`); `src/data/rechnerGrenzen.ts`; `src/data/erkundung.ts`; Kopf von `src/calc/pfas.ts` | TrinkwV 2023, Anlage 2 Teil I, Bemerkung zu Summe PFAS-20 und PFAS-4 | 10 von 20 PFAS < BG (2 ng/l), übrige 92 ng/l: richtige Antwort „nicht eindeutig: Spanne 92 bis 112 ng/l“; die rechtlich richtige Option „eingehalten, 92 < 100“ war als falsch markiert. Rechnerhinweis: „die Bewertung hängt vom Ansatz ab“; Ansätze 0, BG/2, BG nur „Lehrvariante“ | Werte unterhalb der Bestimmungsgrenze bleiben nach TrinkwV bei der Summenbildung **unberücksichtigt** → Σ PFAS-20 = 92 ng/l, Grenzwert eingehalten (richtige Antwort jetzt Option 1). Die obere Schranke ist als Vorsorge-/Lehrbetrachtung gekennzeichnet; Rechnerhinweis: „Rechtlich maßgebend ist die untere Schranke …“. Quiz `verified: false` mit Vermerk | gesetze-im-internet.de, TrinkwV Anlage 2 („Werte unterhalb der Bestimmungsgrenze bleiben unberücksichtigt“) |
| RQ-2 | `src/components/ui/RechtsrahmenKompendium.tsx` (Europäisches Klimagesetz, Meilenstein 2050) – eingebunden in `nachhaltigkeit_daten_regeln`, `oekobilanz_lca`/`lca_regulatorik` | VO (EU) 2021/1119 Art. 2 Abs. 1 | „Rechtliche Pflicht zur Erreichung von Netto-Negativ-Emissionen nach 2050.“ | „Klimaneutralität der Union spätestens 2050 (Art. 2 Abs. 1); danach strebt die EU negative Emissionen an – eine Pflicht dazu enthält die Verordnung nicht.“ Zusätzlich: Zwischenziel 2040 von „Empfehlung −90 %“ auf den Stand nach Verabschiedung (Rat 05.03.2026, bis zu 5 % internationale Gutschriften ab 2036) | gesetze.legal, Art. 2 VO (EU) 2021/1119 („die Union strebt danach negative Emissionen an“); ZDH Europa aktuell 11.03.2026 |
| RQ-3 | `RechtsrahmenKompendium.tsx` (KSG: Meilenstein 2030, Pflichtenliste, Zeitstrahl 2030) | KSG i. d. F. der Novelle 2024, Anlage 2 | „Gebäudesektor-Emissionen dürfen max. 67 Mio. t CO₂e betragen“; „Sektor Gebäude muss bis 2030 seinen Ausstoß nahezu halbieren“ | Jahresemissionsmenge des Gebäudesektors 67 Mio. t CO₂e (Anlage 2), seit der Novelle 2024 nicht mehr sektorscharf verbindlich, sondern Teil der sektorübergreifenden Gesamtrechnung (so schon die Pflichtenliste desselben Eintrags) | VDIV zur Neufassung des KSG; UBA-Tabelle Sektorziele nach Novelle 2024 (angepasste Höchstmenge Gebäude 2030: 66 Mio. t) |
| RQ-4 | `RechtsrahmenKompendium.tsx` (EPBD-Meilensteine 2028/2030, Zeitstrahl 2028/2030) | Richtlinie (EU) 2024/1275 Art. 7 Abs. 1 und 2, Art. 9 Abs. 1 | „ZEB-Pflicht: Alle neuen öffentlichen Gebäude …“; „Ausnahmslos jedes neue Gebäude …“, „GWP … ausnahmslos“; MEPS „16 % aller gewerblichen Bestandsgebäude“ | ZEB 2028 für neue Gebäude **im Eigentum** öffentlicher Einrichtungen, für nur genutzte „streben sie an“; 2030 ZEB und Lebenszyklus-GWP für alle Neubauten (Art. 7) ohne „ausnahmslos“; MEPS: 16 % der Nichtwohngebäude mit der schlechtesten Gesamtenergieeffizienz (Art. 9 Abs. 1). Gleichlautende Aussage war in `nachhaltigkeit_daten_regeln` schon mit NS5C-NDR-1 berichtigt, im Kompendium aber stehen geblieben | gesetze.legal, Art. 7 RL 2024/1275 (wie NS5C-NDR-1) |

Gewichtig im Sinne des Auftrags sind RQ-1 (falsche Einstufung eines Messergebnisses gegen einen Grenzwert, richtige Antwort als falsch gewertet) und RQ-2 bis RQ-4 (Pflichten, die die Vorschrift so nicht enthält). Keiner betrifft einen Rechenkern; der PFAS-Kern rechnet alle drei Ansätze richtig, nur Deutung und Hinweistext waren falsch.

## 2. Weitere behobene Fehler

| Nr. | Fundstelle | Vorschrift | vorher | nachher | Quelle |
|---|---|---|---|---|---|
| RQ-5 | Quiz `q_ab_7` (`normRef`); `content/abfaelle/Checklisten.json` (Checkliste 6, Schritt 1, `ref`) | GefStoffV § 11, Anhang II | „GefStoffV Anhang II“ als Fundstelle der Asbestverbote | „GefStoffV § 11 Abs. 1“ (Quiz) bzw. „GefStoffV §§ 5a, 6, 11a (Asbest); Anhang II Nr. 5 (KMF)“. Seit der Novelle vom 05.12.2024 stehen die Asbestverbote in § 11 („Verwendungs- und Tätigkeitsbeschränkungen für Asbest“), Anhang II Nr. 1 ist weggefallen. Quiz `verified: false`; Antwort unverändert | gesetze-im-internet.de, GefStoffV § 11; BGN-Vorschriften, Inhaltsübersicht GefStoffV („Nr. 1 (weggefallen)“); buzer.de, Synopse § 24 GefStoffV |
| RQ-6 | `src/data/kurzfassung.ts` (Boden/Material-Aufbereitung); `content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json` (`TREATMENT_OPTIONS.rules`) | GefStoffV § 11 Abs. 1 | Zerkleinerungs-/Aufbereitungsverbot asbesthaltiger Böden „nach TRGS 519“ bzw. „DepV / TRGS 519“ | „nach § 11 Abs. 1 GefStoffV … (Schutzmaßnahmen nach TRGS 519)“; „GefStoffV § 11 Abs. 1 / TRGS 519“ – das Verbot steht in der Verordnung, die TRGS konkretisiert Schutzmaßnahmen | wie RQ-5 |
| RQ-7 | `content/abfaelle/Checklisten.json` (Checkliste 6, Schritte 2–6); `src/data/tasks/rueckbauTasks.ts` | TRGS 519 (Gliederung) | Verweise „TRGS 519 Abs. 3/2.7/7/9/14“; Verpackung asbesthaltiger Abfälle „Abs. 14“; Abschottung „Abs. 7“; Schutzmaßnahmen schwach gebundener Asbest „Anlage 3 TRGS 519“ | TRGS gliedert in Nummern: Nr. 3 (Zulassung und Anzeige), Nr. 2.7, Nr. 8 und 14 (sicherheitstechnische Maßnahmen, schwach gebundene Produkte), Nr. 9, **Nr. 18** (asbesthaltige Abfälle); Aufgabe: „TRGS 519 Nr. 14“ (Anlage 3 ist der Sachkundelehrgang) | BGN-Vorschriften, Inhaltsverzeichnis TRGS 519 |
| RQ-8 | `content/abfaelle/Checklisten.json` (Checkliste 1, Schritt 6 „eANV“) | NachwV | „Nachweisverordnung (NachwV) § 4“ | „NachwV §§ 3, 10, 17, 25“ (Entsorgungsnachweis, Begleitschein, elektronische Nachweisführung, Register); § 4 ist die Eingangsbestätigung | gesetze-im-internet.de, NachwV (Inhaltsübersicht, §§ 2, 25) |
| RQ-9 | Quiz `q_ndr_2` (`nachhaltigkeit_daten_regeln`), Rückmeldung zu Option 1 | BGB § 650o | „§ 650o BGB war nur im Regierungsentwurf vorgesehen …“ | „Die Gebäudetyp-E-Regelung (§ 650o BGB-E) stand nur im Regierungsentwurf 2024 …; der geltende § 650o BGB betrifft abweichende Vereinbarungen beim Verbraucherbauvertrag.“ `verified: false`; Antwort unverändert | buzer.de / bgb.kommentar.de, § 650o BGB „Abweichende Vereinbarungen“ |
| RQ-10 | `src/data/fristenSchwellen.ts` (Referenzliste, nicht angezeigt) | VO (EU) 2024/3110 Art. 94–96 | Inkrafttreten „Art. 95 Abs. 1“, Geltung „Art. 95 Abs. 2“, EAD-Übergang „Art. 95“ | Inkrafttreten und Geltung **Art. 96**; Art. 95 Abs. 2 = Neubewertung notifizierter Stellen bis 08.01.2030, Art. 95 Abs. 4 = EAD bis 09.01.2031; Art. 94 = Aufhebung der VO 305/2011 (Reste bis 08.01.2040). Die Angaben in `bp_recht_grundlagen` (Art. 94, Art. 95 Abs. 2/3/4/9) stimmten bereits | eurlexa.com, 32024R3110 (Datumsangaben je Artikel); Kroatisches Bauministerium, Fristenübersicht zur VO 2024/3110 |

| RQ-11 | `RechtsrahmenKompendium.tsx` (EBV: Pflichten, Zeitstrahl 2023); `content/abfaelle/EbvMantelverordnung.json` (`die250MBagatellgrenze`, `größereWiedereinbaumaßnahmenAb250`); `content/abfaelle/Checklisten.json` (Checkliste 2, Schritt 6); `content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json` (Hinweis aus PR #320) | EBV § 22 Abs. 1 und 2 i. V. m. § 20 Abs. 1 | „Einbaumengen ab 250 m³ müssen … dokumentiert werden“, „Katasterpflicht ab 250 m³“; „Wenn der Gesamteinbau **aller** mineralischen Ersatzbaustoffe … 250 m³ erreicht …, Meldepflicht“; „Liegt die geplante Einbaumenge über 250 m³?“ | Anzeige vier Wochen vorher für RC-3, BM-F3, BG-F3 ab **mindestens** 250 m³ und für die Schlacken und Aschen nach § 20 Abs. 1; übrige Klassen ohne mengenabhängige Anzeigepflicht; in Wasser-/Heilquellenschutzgebieten mengenunabhängig (§ 22 Abs. 2). Gewicht: mittel (Pflicht auf alle Ersatzbaustoffe ausgedehnt) | gesetze-im-internet.de, §§ 20, 22 ErsatzbaustoffV |
| RQ-12 | `src/modules/Abfaelle.tsx` (EBV-Prüfer, Hinweis aus PR #320) | EBV § 20 Abs. 1, § 22 Abs. 1 | Zweige `hmva1`/`hmva2` nie erreichbar (die Auswahl führt HMVA-1 unter „BM-F2 / HMVA-1“, HMVA-2 unter „RC-3 / BM-F3 / HMVA-2“); dadurch für die Auswahl „BM-F2 / HMVA-1“ ab 250 m³ „keine mengenabhängige Anzeigepflicht“ | tote Zweige entfernt; für „BM-F2 / HMVA-1“ eigener Hinweis: BM-F2 ohne mengenabhängige Anzeige, HMVA-1 als Asche nach § 20 Abs. 1 Nr. 2 anzeigepflichtig (Mengenschwelle vorläufig, Normprüfung ausstehend). HMVA-Klassen fehlen nicht, sie sind in den Sammeloptionen enthalten (Aufteilung der Auswahl: siehe O-6) | gesetze-im-internet.de, § 20 ErsatzbaustoffV |

Redaktionell mitbehoben: „Abs.“ statt „Nr.“ bei TRGS-519-Verweisen mit richtiger Nummer (Checkliste 6, Schritte 2, 3, 5).

## 3. Gegen die Primärquelle geprüft, keine Abweichung

| Vorschrift | Aussagen in der App (Auswahl) | Quelle (abgerufen 03.11.2026) |
|---|---|---|
| EBV § 19 | Zone I unzulässig, Zone II nur BM-0, BG-0, GS-0, SKG und Gemische (Abs. 6); Karst/klüftig: RC-3, BM-F3, BG-F3, GS-3 unzulässig (Abs. 7); günstige Deckschicht > 1 m, ungünstig 0,1–1 m (RC-1, BM-0* u. a.), jeweils + 0,5 m Sicherheitsabstand (Abs. 8) | gesetze-im-internet.de, § 19 ErsatzbaustoffV |
| EBV § 22 | Voranzeige vier Wochen vorher ab mindestens 250 m³ (Abs. 1), in Wasser-/Heilquellenschutzgebieten mengenunabhängig außer § 19 Abs. 6 Nr. 1–5 (Abs. 2), Abschlussanzeige: Ermittlung binnen zwei Wochen (Abs. 4), Unterlagen an Bauherrn/Eigentümer (Abs. 5), Rückbau binnen eines Jahres (Abs. 6) | gesetze-im-internet.de, § 22 ErsatzbaustoffV |
| EBV § 25 | Inverkehrbringer fünf Jahre, Grundstückseigentümer solange eingebaut (Abs. 4) | gesetze-im-internet.de, § 25 ErsatzbaustoffV |
| EBV Anlage 1 Tab. 1 | RC-1/2/3: Sulfat 600/1000/3500 mg/l, Kupfer 110/250/500 µg/l, Leitfähigkeit 2500/3200/10 000 µS/cm, PAK16 10/15/20 mg/kg, Chrom 150/440/900 µg/l; HMVA-1/2: Leitfähigkeit 2000/12 500, Chlorid 160/5000, Sulfat 820/3000 | buzer.de, Anlage 1 ErsatzbaustoffV |
| GefStoffV § 11a | Anzeige spätestens eine Woche vor Beginn (Abs. 4), Zulassung hohes Risiko höchstens sechs Jahre (Abs. 3), Genehmigung für Abbrucharbeiten niedriges/mittleres Risiko (Abs. 4a); Vermutung „kein Asbest“ bei Baubeginn nach 31.10.1993 (Abs. 1) | gesetze-im-internet.de, § 11a GefStoffV |
| TrinkwV § 17, Anlage 2 | Bleileitungen bis 12.01.2026, Verlängerung nach Abs. 2/3 (höchstens 12.01.2036, Eigentümerwechsel ein Jahr), Information Abs. 5; Blei 10 → 5 µg/l ab 12.01.2028; PFAS-20 0,1 µg/l ab 12.01.2026, PFAS-4 0,02 µg/l ab 12.01.2028 | gesetze-im-internet.de, § 17 und Anlage 2 TrinkwV |
| NachwV §§ 2, 25 | Kleinmengen bis 2 t/a ohne Nachweispflicht (§ 2 Abs. 2, Übernahmescheine bleiben), Register drei Jahre ab Einstellung, Zulassungsbescheid kann länger festlegen (§ 25) | gesetze-im-internet.de, NachwV |
| LAGA PN 98 Tab. 2, 3 (Fachkonvention) | bis 30/100/600 m³: 8/16/40 EP, 2/4/10 MP und LP; über 600 m³ je angefangene 100 m³ eine MP (850 m³ → 13 MP, 52 EP); Einzelprobe > 20–50 mm: 2 l, Laborprobe 4 l | umwelt-online, LAGA PN 98 Tabellen 2 und 3 |
| BauPVO 2024/3110 | Geltung 08.01.2026, EAD bis 09.01.2031, ETA bis 09.01.2036, notifizierte Stellen bis 08.01.2030, VO 305/2011 Reste bis 08.01.2040, gestaffelte Umweltangaben 08.01.2026/09.01.2030/09.01.2032 (Artikel 15 Abs. 3 nicht abgerufen) | eurlexa.com; mpgi.gov.hr; One Click LCA |
| VOB/A 2026 | Abschnitte 2 und 3 seit 08.09.2026 anzuwenden (Quiz `q_px_pl_5`); Abschnitt 1 (§ 7 Abs. 1 Nr. 3/4, § 7 Abs. 2, § 8a, § 9d) nicht betroffen | vergabeblog.de, 18.09.2026 |
| BayBO (GVBl. 2026 S. 75) | Art. 57 Abs. 5, 62a, 63, 81a unverändert; Art. 20 Satz 2 neu gefasst – die Quizaussage zur ZiE (`q_bpr_2`) bleibt richtig | umwelt-online, GVBl. 2026 S. 75 |
| ZIM-Richtlinie 2025 | je Unternehmen 560 000 €, je Forschungseinrichtung 280 000 €, Kooperationsprojekt 3 Mio. € (`bp_innovationen`) | IHK, Kerninhalte ZIM 2025 |
| § 650o BGB | besteht als „Abweichende Vereinbarungen“ (siehe RQ-9) | buzer.de |

Aus Kenntnis der Gliederung plausibilisiert (kein Abruf): VOB/B §§ 2, 4, 6, 8, 11, 12, 13, 16; BGB §§ 195, 199, 203, 204, 631–640, 650a–650v; HOAI §§ 7, 34; KrWG §§ 3, 5, 6, 9, 9a, 14, 49, 54; AVV § 3; DepV §§ 3, 6, 8, 10–13 und Anhänge 1, 3; BBodSchV §§ 4, 21, Anlagen 1–3; AltholzV §§ 2, 3; GEG/GModG (gegen die Lesefassung vom 29.07.2026 schon am 29.10. geprüft); KI-VO, DSGVO, UrhG, GeschGehG, VwVfG § 35a; ProdHaftG; EStG §§ 6, 7b, 7i, 10f, EStDV § 82b; CBAM, ETS-Faktoren, CSRD/CSDDD-Omnibus, EUDR, WPG, BEHG im Rechtsrahmen-Kompendium.

## 4. Fehlerquote je Rechtsgebiet

Gezählt sind eindeutige Aussagen (Sätze) mit Rechtsbezug und prüfbarer Angabe (Zahl, Frist, §/Art.) in den Dateien der freigegebenen Module und ihren Quizfragen (Sammel- und Filterskript im Arbeitsverzeichnis, 2633 Sätze mit Rechtsbezug, davon 920 mit prüfbarer Angabe) zuzüglich rund 95 Einträgen des Rechtsrahmen-Kompendiums. „Fehler“ = Aussage mit falscher Fundstelle, Pflicht, Frist oder Einstufung (redaktionelle Punkte nicht gezählt).

| Rechtsgebiet | geprüfte Aussagen | davon gegen Primärquelle | Befunde | Aussagen mit Fehler | Quote | gewichtig |
|---|---|---|---|---|---|---|
| Abfall/Boden (KrWG, GewAbfV, EBV, BBodSchV, DepV, AVV, NachwV, AltholzV, LAGA) | 199 | ≈ 65 | 3 (RQ-8, RQ-11, RQ-12) | 8 | 4 % | 0 (RQ-11 mittel) |
| Gefahrstoffe (GefStoffV, TRGS, REACH/POP, TrinkwV-PFAS) | 94 | ≈ 45 | 4 (RQ-1, -5, -6, -7) | 12 | 13 % | 1 (RQ-1) |
| Bauordnung/Bauprodukte (MBO/BayBO, MVV TB, BauPVO, BGB/VOB/HOAI, BayDSchG) | 244 | ≈ 40 | 2 (RQ-9, RQ-10) | 1 angezeigte + 4 Referenzeinträge | 0,4 % (angezeigt) | 0 |
| Energie/GEG (GModG, KSG, WPG, BEHG) | 153 | ≈ 10 | 1 (RQ-3) | 3 | 2 % | 1 |
| EU (EPBD, Taxonomie, Klimagesetz, CBAM, ETS, CSRD, EUDR) | 122 | ≈ 25 | 2 (RQ-2, RQ-4) | 6 | 5 % | 2 |
| Arbeitsschutz (ArbSchG, BaustellV, DGUV, LärmVibrationsArbSchV) | 4 | 0 | 0 | 0 | 0 % | 0 |
| Datenschutz/KI (DSGVO, KI-VO, UrhG, DDG/MStV) | 25 | 0 (KI-VO-Fristen über die zentrale Liste vom 02.11.) | 0 | 0 | 0 % | 0 |
| übrige (EStG, ZPO, ProdHaftG, BayDiV, Fachkonventionen) | ≈ 175 | ≈ 15 | 0 | 0 | 0 % | 0 |
| **gesamt** | **≈ 1016** | **≈ 200** | **12** | **30 (+ 4 Referenzeinträge)** | **3,0 %** | **4** |

- Die Fehler häufen sich dort, wo eine Vorschrift **umgebaut** wurde (GefStoffV-Novelle 12/2024: Anhang II Nr. 1 → § 11; KSG-Novelle 2024: Sektorziele; Klimagesetz-Änderung 2026) oder wo eine **Bemerkung der Vorschrift** das Ergebnis bestimmt (TrinkwV: Werte unter der BG). Reine Zahlen- und Fristangaben (EBV, NachwV, TrinkwV, BauPVO) stimmten durchweg.
- Wie in NS5B: Eine bereits behobene Aussage (EPBD Art. 7, NS5C-NDR-1) stand gleichlautend in einem gemeinsam genutzten Baustein weiter. Gleichlautende Stellen sind bei jeder Korrektur app-weit mitzusuchen; das Kompendium gehört in künftige Stichproben.
- Betroffene freigegebene Module: `pfas_baustoffe` (RQ-1), `nachhaltigkeit_daten_regeln`, `lca_regulatorik`/`oekobilanz_lca` (über das Kompendium, RQ-2 bis -4; `q_ndr_2` RQ-9), `abfaelle` (RQ-5, -7, -8, -11, -12), `boden_materialaufbereitung` (RQ-6), `rueckbau` (Aufgabe, RQ-7). Ein Anlass zur Rücknahme eines Prüfvermerks besteht nach den bisherigen Maßstäben nicht; RQ-1 sollte bei der Freigabe von `pfas_baustoffe` mitgesehen werden.

## 5. Zentrale Liste und Abgleich

`src/data/fristenSchwellen.ts` hat jetzt **61 Einträge** (vorher 42), 59 mit Erkennung; `node scripts/qa/fristen-abgleich.mjs`: **196 erkannte Angaben, 196 übereinstimmend, 0 Abweichungen**. Neu, jeweils mit Quelle aus der Websuche und Stand 03.11.2026:

| ID | Vorschrift, Fundstelle | Wert | Fundstellen in der App |
|---|---|---|---|
| `BAUPVO_NB_2030` | VO 2024/3110 Art. 95 Abs. 2 | 08.01.2030 | 1 |
| `BAUPVO_305_2040` | VO 2024/3110 Art. 94 | 08.01.2040 | 2 |
| `EBV_ANZEIGE_250` | EBV § 22 Abs. 1 | 250 m³ | 6 |
| `EBV_VORANZEIGE_FRIST` | EBV § 22 Abs. 1/2 | 4 Wochen | 8 |
| `EBV_SICHERHEITSABSTAND` | EBV § 19 Abs. 8 | 0,5 m | 7 |
| `EBV_SICKERSTRECKE_GUENSTIG` | EBV § 19 Abs. 8 | > 1 m | 5 |
| `EBV_LIEFERSCHEIN_5J` | EBV § 25 Abs. 4 Satz 1 | 5 Jahre | 1 |
| `EBV_RC1_SULFAT`, `EBV_RC2_SULFAT`, `EBV_RC3_SULFAT` | EBV Anlage 1 Tab. 1 | 600 / 1000 / 3500 mg/l | 2 / 2 / 1 |
| `EBV_RC1_KUPFER` | EBV Anlage 1 Tab. 1 | 110 µg/l | 2 |
| `GEFSTOFFV_ASBEST_ANZEIGE` | GefStoffV § 11a Abs. 4 | 1 Woche | 6 |
| `GEFSTOFFV_ASBEST_ZULASSUNG` | GefStoffV § 11a Abs. 3 | 6 Jahre | 1 |
| `NACHWV_REGISTER_3J` | NachwV § 25 Abs. 1 | 3 Jahre | 3 |
| `NACHWV_KLEINMENGE_2T` | NachwV § 2 Abs. 2 | 2 t | 1 |
| `TRINKWV_BLEI_FRIST` | TrinkwV § 17 Abs. 1 | 12.01.2026 | 4 |
| `TRINKWV_BLEI_2028` | TrinkwV Anlage 2 Teil II | 12.01.2028 | 2 |
| `TRINKWV_PFAS20_AB`, `TRINKWV_PFAS4_AB` | TrinkwV Anlage 2 Teil I | 12.01.2026 / 12.01.2028 | 1 / 1 |

Das Abgleichskript liest zusätzlich die Zahlwörter „ein(e/er)“ bis „sieben“ („vier Wochen“, „eine Woche“, „fünf Jahre“). Regressionstest: `tests/rechtsquellen1103.test.ts` (Korrekturen RQ-1 bis RQ-12, neue Sollwerte, Erkennung falscher Fristen).

## 6. Offen

| Nr. | Punkt | Vorschlag |
|---|---|---|
| O-1 | PFAS-Rechner: Voreinstellung des Ansatzes ist „< BG = BG/2“; rechtlich maßgebend ist nach TrinkwV „< BG = 0“. Die Hinweistexte sagen das jetzt, die Ampel zeigt aber weiter das Ergebnis des gewählten Ansatzes. | Fachentscheidung: Voreinstellung auf „< BG = 0 (TrinkwV)“ umstellen und BG/2, BG als Vorsorgevarianten führen (ändert Beispiele in `erkundung.ts` und Rechnertests). |
| O-2 | TRGS 519 Anlage 4: Die App ordnet „Anlage 4“ den Arbeiten geringen Umfangs zu; die abrufbare Gliederung (BGN, Stand ohne Datum) nennt Anlage 4 „Asbestzementprodukte“, Lehrgänge 4A–4C waren nicht abrufbar (BAuA-Seite gesperrt). | vorläufig, Normprüfung ausstehend – gegen die aktuelle TRGS 519 (GMBl 2025 S. 144) prüfen. |
| O-3 | Quiz `q_bbt_5`: Normverweis „MBO § 22“ (Übereinstimmungserklärung des Herstellers) für Transportbeton; nach MVV TB ist für Beton ein Übereinstimmungszertifikat (§ 23 bzw. § 21 MBO) üblich. Antwort (Ü-Zeichen auf dem Lieferschein) richtig. | vorläufig, Normprüfung ausstehend – bei der nächsten Quizrunde Verweis auf „MBO §§ 21 ff.; MVV TB“ fassen. |
| O-4 | Quiz `q_ms_sc_6` (Modul `schaeden_checklisten`, nicht freigegeben): Feld `quelle` nennt „GefStoffV Anhang II“ für Asbest. | Bei Freigabe des Moduls auf § 11 GefStoffV umstellen. |
| O-5 | `src/components/ui/BaustoffProfil.tsx`: „Schadstoffklasse wie Z0–Z5“; LAGA M 20 kennt Z 0 bis Z 2 (darüber Deponieklassen). Landesregelungen mit Z 3–Z 5 waren nicht zu belegen. | vorläufig, Normprüfung ausstehend – mit der zentralen Liste der Klassengrenzen (Gutachten 03.11., Maßnahme 6) klären. |

| O-6 | EBV-Prüfer (`abfaelle`): Sammeloptionen „BM-F2 / HMVA-1“ und „RC-3 / BM-F3 / HMVA-2“ bündeln Klassen mit unterschiedlichen Anzeigeregeln (HMVA-1 laut § 20 Abs. 1 Nr. 2 in der Gruppe ab 50 m³). | Entscheidung: HMVA-1/HMVA-2 als eigene Auswahl mit eigener Mengenschwelle führen (UI-Änderung, a11y-Prüfung nötig). |

## 7. Quellen (abgerufen 03.11.2026, nur aus Suchergebnissen)

- EBV § 19: https://www.gesetze-im-internet.de/ersatzbaustoffv/__19.html · § 20: https://www.gesetze-im-internet.de/ersatzbaustoffv/__20.html · § 22: https://www.gesetze-im-internet.de/ersatzbaustoffv/__22.html · § 25: https://www.gesetze-im-internet.de/ersatzbaustoffv/__25.html · Anlage 1: https://www.buzer.de/Anlage_1_ErsatzbaustoffV.htm
- GefStoffV § 11: https://www.gesetze-im-internet.de/gefstoffv_2010/__11.html · § 11a: https://www.gesetze-im-internet.de/gefstoffv_2010/__11a.html · Inhaltsübersicht (Anhang II Nr. 1 weggefallen): https://vorschriften.bgn-branchenwissen.de/daten/gv/gefstoffv/inhalt.htm · Synopse § 24: https://www.buzer.de/gesetz/9492/al0-208531.htm
- TRGS 519, Inhaltsverzeichnis: https://vorschriften.bgn-branchenwissen.de/daten/tr/trgs519/inhalt.htm
- TrinkwV § 17: https://www.gesetze-im-internet.de/trinkwv_2023/__17.html · Anlage 2: https://www.gesetze-im-internet.de/trinkwv_2023/anlage_2.html
- NachwV: https://www.gesetze-im-internet.de/nachwv_2007/BJNR229810006.html
- LAGA PN 98 Tabellen 2 und 3: https://umwelt-online.de/recht/abfall/laga/pn98b.htm
- BauPVO: https://eurlexa.com/act/en/32024R3110/present/info · https://mpgi.gov.hr/UserDocsImages/19641 · https://oneclicklca.com/de/resources/articles/cpr-epds-deep-dive-for-construction-professionals
- Klimagesetz Art. 2: https://gesetze.legal/eu/vo_eu_2021_1119/2 · Klimaziel 2040: https://www.zdh.de/ueber-uns/fachbereich-europapolitik/europa-aktuell/trilogeinigung-rat-verabschiedet-klimaziel-2040-final/
- KSG-Novelle: https://vdiv.de/news-details/neufassung-des-klimaschutzgesetzes-bezieht-sektoruebergreifende-bilanz-staerker-mit-ein · https://umweltbundesamt.de/sites/default/files/medien/384/bilder/dateien/3_tab_sektorziele_novelle_2024-08-16.pdf
- VOB/A 2026: https://vergabeblog.de/2026-09-18/vob-a-eu-und-vs-2026-seit-08-09-2026-anzuwenden/
- BayBO, GVBl. 2026 S. 75: https://umwelt-online.de/recht/bau/laender/bay/z26_0075.htm
- ZIM 2025: https://www.ihk.de/blueprint/servlet/resource/blob/6361838/1d1d21e88d414f9cbf8289f93f3d506f/kerninhalte-zim-2025-data.pdf
- § 650o BGB: https://www.buzer.de/650o_BGB.htm (Suchergebnis „Abweichende Vereinbarungen“)
- Nicht abrufbar: gesetze.legal § 19 EBV (keine Freigabe), urteile-gesetze.de (robots.txt), economie.fgov.be (Bot-Prüfung).
