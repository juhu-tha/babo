# Prüfliste Quiz – Cluster VI: Studium & Lehre

Stand: 27.10.2026 · Grundlage: `src/data/quiz.json` (Felder `vorpruefung` und `verified`), `docs/quiz-pruefhinweise.md`, Lernziele aus `src/data/lernziele.ts`. Erzeugt mit `npx tsx scripts/pruefliste.ts`; gesetzte Kreuze übernimmt das Skript beim nächsten Lauf. quiz.json wurde für diese Liste nicht verändert.

Cluster VI umfasst 60 Fragen aus 10 Modulen. Aufgeführt sind 20 auffällige Fragen (Vorprüfung „korrigiert“ oder „fraglich“, offener Prüfhinweis oder neu seit 26.10.2026 ohne Freigabe) und eine Stichprobe von 5 unauffälligen Fragen. Entscheidung je Frage ankreuzen; bei „ändern“ den Änderungswunsch in die Zeile darunter schreiben.

Auffällig im Einzelnen (Mehrfachnennung möglich): 20 korrigiert, 0 fraglich, 0 mit offenem Prüfhinweis, 0 neu seit 26.10.2026.

## A. Auffällige Fragen

### qn_rechnung_bestand_1 · Bauen im Bestand

- **Frage:** Aus den Bestandsunterlagen wurde für einen Altbeton f_ck,cyl = 17,1 N/mm² abgeleitet; Bohrkerne liegen nicht vor. Welcher Bemessungswert f_cd ergibt sich nach dem Vorgehen des Moduls (pauschaler Abschlag 3,0 N/mm², α_cc = 0,85, γ_C = 1,5)?
- **Richtige Antwort:** f_cd = 7,99 N/mm²
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_bestand_5 · Bauen im Bestand

- **Frage:** Ein Tragwerksplaner überlegt, ob sich Kernbohrungen in einer Stahlbetondecke aus den 1960er Jahren lohnen. Welches Argument stützt das Modul?
- **Richtige Antwort:** Der pauschale Abschlag entfällt; die oft höhere reale Festigkeit wird nutzbar
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_beton_5 · Beton: Mischungsentwurf

- **Frage:** Im Sommer ergibt sich eine Frischbetontemperatur von 27,1 °C. Werden 30 kg des Anmachwassers durch Schuppeneis von 0 °C ersetzt, sinkt sie laut Modell auf 22,1 °C. Worauf beruht der größte Teil dieser Absenkung?
- **Richtige Antwort:** Auf der Schmelzenthalpie von 334 kJ/kg, die dem Gemisch beim Auftauen entzogen wird
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_beton_6 · Beton: Mischungsentwurf

- **Frage:** Eine Decke aus C25/30 mit Zement der Klasse N (s = 0,25) erhärtet 7 Tage bei konstant 12 °C. Wie ist die Ausschaleignung nach dem Vorgehen des Moduls (Reifealter nach Arrhenius, Kriterium β_cc ≥ 0,5) zu bewerten?
- **Richtige Antwort:** t_T ≈ 4,8 d, β_cc ≈ 0,70: Ausschalen im Regelfall möglich
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_mauerwerk_1 · Mauerwerk: Tragfähigkeit

- **Frage:** Für Kalksandstein-Mauerwerk setzt das Modul f_k = 5,6 N/mm², den Dauerstandsbeiwert ζ = 0,85 und γ_M = 1,5 an. Welcher Bemessungswert f_d ergibt sich?
- **Richtige Antwort:** f_d = 3,17 N/mm²
- **Auffälligkeit:** Vorprüfung „korrigiert“: Gutachten 27.10.2026: Rechnung auf f_d = ζ · f_k/γ_M mit ζ = 0,85 umgestellt wie im Modul (src/calc/mauerwerk.ts); Werte und Distraktoren mit dem Rechenkern neu gerechnet, abgesichert in tests/quizRechenfragen.test.ts. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_mauerwerk_2 · Mauerwerk: Tragfähigkeit

- **Frage:** Eine zweiseitig gehaltene Wand mit h_ef = 2,75 m hat eine Dicke von 17,5 cm. Welche Schlankheit ergibt sich, und ist der Grenzwert des vereinfachten Verfahrens eingehalten?
- **Richtige Antwort:** h_ef/t = 15,7 ≤ 27, eingehalten
- **Auffälligkeit:** Vorprüfung „korrigiert“: Gutachten 27.10.2026: Grenzschlankheit 25 → 27 wie im Modul (SCHLANKHEIT_MAX in src/calc/mauerwerk.ts, DIN EN 1996-1-1, 5.5.1.4); abgesichert in tests/quizRechenfragen.test.ts. Zweitprüfung 27.10.: Rückmeldung zu Option 4 (6,4 = 17,5 cm/2,75 m, Kehrwert mit gemischten Einheiten) korrigiert.
- [ ] ok
- [x] ändern: Rückmeldung zu Option 4 (17,5/2,75 = 6,4, gemischte Einheiten), korrigiert

### qn_rechnung_mauerwerk_4 · Mauerwerk: Tragfähigkeit

- **Frage:** Für die KS-Wand gilt Φ = 0,578, t = 175 mm und f_d = ζ · f_k/γ_M = 3,17 N/mm². Welcher Traglastwiderstand N_Rd je Meter Wandlänge ergibt sich?
- **Richtige Antwort:** N_Rd ≈ 321 kN/m
- **Auffälligkeit:** Vorprüfung „korrigiert“: Gutachten 27.10.2026: Rechnung auf f_d = ζ · f_k/γ_M mit ζ = 0,85 umgestellt wie im Modul (src/calc/mauerwerk.ts); Werte und Distraktoren mit dem Rechenkern neu gerechnet, abgesichert in tests/quizRechenfragen.test.ts. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_mauerwerk_5 · Mauerwerk: Tragfähigkeit

- **Frage:** Eine 11,5 cm dicke KS-Innenwand (f_k = 5,6 N/mm², Decke voll aufliegend) mit lichter Höhe h = 3,60 m soll N_Ed = 120 kN/m tragen. Nach dem Modul ergeben sich h_ef = 0,75 · 3,60 m = 2,70 m, h_ef/t = 23,5, Φ = Φ2 ≈ 0,24 und η ≈ 1,35. Wie ist der Befund einzuordnen?
- **Richtige Antwort:** Erweiterte Bedingungen erlauben h = 3,60 m, doch mit Φ ≈ 0,24 ist sie überlastet
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: erweiterte Bedingungen für h > 2,75 m (DIN EN 1996-3/NA:2019-12, Tab. NA.2; KS-Merkblatt 04/2020) eingearbeitet; Beispiel auf Innenwand 115 mm mit h = 3,60 m und N_Ed = 120 kN/m umgestellt, Werte mit src/calc/mauerwerk.ts gerechnet (tests/quizRechenfragen.test.ts) – korrigiert
- [ ] ok
- [x] ändern: Klärung erforderlich: Nach DIN EN 1996-3/NA gilt das vereinfachte Verfahren für Innenwände mit 11,5 cm ≤ t < 24 cm nur bis zu einer lichten Geschosshöhe von 2,75 m; h_ef = 3,00 m bei t = 11,5 cm liegt außerhalb der Anwendungsgrenze (auch im Modul nicht geprüft). Wandhöhe auf 2,75 m ändern oder Anwendungsgrenze in Frage und Modul aufnehmen? Rechnung selbst nachgerechnet und richtig.

### qn_rechnung_mauerwerk_6 · Mauerwerk: Tragfähigkeit

- **Frage:** Eine Wand (h_ef = 2,75 m, Φ2 maßgebend) erhält N_Ed = 150 kN/m. Welcher Vergleich der Ausnutzungsgrade nach dem Modul (f_d = ζ · f_k/γ_M; KS: f_k = 5,6; HLz: f_k = 3,2 N/mm²) ist richtig?
- **Richtige Antwort:** KS 17,5 cm: η ≈ 0,47; HLz 17,5 cm: η ≈ 0,82; HLz 24 cm: η ≈ 0,49
- **Auffälligkeit:** Vorprüfung „korrigiert“: Gutachten 27.10.2026: Rechnung auf f_d = ζ · f_k/γ_M mit ζ = 0,85 umgestellt wie im Modul (src/calc/mauerwerk.ts); Werte und Distraktoren mit dem Rechenkern neu gerechnet, abgesichert in tests/quizRechenfragen.test.ts. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_nachhaltigkeit_5 · Nachhaltigkeit & Dauerhaftigkeit

- **Frage:** Für ein massiges Fundament wird CEM III/B statt CEM I gewählt. Welche betontechnologische Konsequenz muss nach dem Modul bei der Ausführung eingeplant werden?
- **Richtige Antwort:** Deutlich längere Nachbehandlung, da Festigkeit und Dichtigkeit langsamer entstehen
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_schallschutz_2 · Bauakustik: Schallschutz

- **Frage:** Welches Direktschalldämm-Maß R_w liefert die Massekurve des Moduls (DIN 4109-32: R_w = 30,9 · lg m′ − 22,2) für m′ = 390 kg/m²?
- **Richtige Antwort:** R_w ≈ 57,9 dB
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: Massekurve auf DIN 4109-32 umgestellt (R_w = 30,9 · lg m′ − 22,2 dB statt 32,4 · lg m′ − 26,0, Beiblatt 1 nur früherer Stand), Werte mit src/calc/schall.ts neu gerechnet – korrigiert
- [ ] ok
- [ ] ändern: …

### qn_rechnung_schallschutz_3 · Bauakustik: Schallschutz

- **Frage:** Eine Wohnungstrennwand aus Hochlochziegeln (24 cm, ρ = 1200 kg/m³) erhält beidseitig 40 kg/m² Putz; die Flanken sind schwer und massiv (K_F = 2 dB). Ist R′_w ≥ 53 dB eingehalten?
- **Richtige Antwort:** R′_w ≈ 53,5 dB: knapp eingehalten
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: Massekurve auf DIN 4109-32 umgestellt (R_w = 30,9 · lg m′ − 22,2 dB statt 32,4 · lg m′ − 26,0, Beiblatt 1 nur früherer Stand), Werte mit src/calc/schall.ts neu gerechnet – korrigiert
- [ ] ok
- [ ] ändern: …

### qn_rechnung_schallschutz_4 · Bauakustik: Schallschutz

- **Frage:** Eine Wohnungstrennwand aus Porenbeton (24 cm, ρ = 500 kg/m³, Putz 40 kg/m², leichte Flanken K_F = 4 dB) erreicht R′_w ≈ 41,9 dB statt 53 dB. Welche Maßnahme ist nach dem Modul zielführend?
- **Richtige Antwort:** Schwerere Steine (z. B. KS, RDK ≥ 2,0) und günstigere Flanken wählen
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: Massekurve auf DIN 4109-32 umgestellt (R_w = 30,9 · lg m′ − 22,2 dB statt 32,4 · lg m′ − 26,0, Beiblatt 1 nur früherer Stand), Werte mit src/calc/schall.ts neu gerechnet – korrigiert
- [ ] ok
- [ ] ändern: …

### qn_rechnung_schallschutz_5 · Bauakustik: Schallschutz

- **Frage:** Um wie viel steigt R_w nach der Massekurve des Moduls (DIN 4109-32: R_w = 30,9 · lg m′ − 22,2), wenn die flächenbezogene Masse einer Wand verdoppelt wird?
- **Richtige Antwort:** um rund 9,3 dB
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: Massekurve auf DIN 4109-32 umgestellt (R_w = 30,9 · lg m′ − 22,2 dB statt 32,4 · lg m′ − 26,0, Beiblatt 1 nur früherer Stand), Werte mit src/calc/schall.ts neu gerechnet – korrigiert
- [ ] ok
- [ ] ändern: …

### qn_rechnung_stahlbeton_3 · Massivbau: Biegung

- **Frage:** Für M_Ed = 120 kNm, C25/30, b/h = 30/50 cm und d = 45,5 cm ergibt sich μ_Ed = 0,136 und der Hebelarm z = 0,422 m. Welche Biegezugbewehrung ist mit f_yd = 434,8 N/mm² erforderlich?
- **Richtige Antwort:** A_s,erf = 6,54 cm²
- **Auffälligkeit:** Vorprüfung „korrigiert“: Nachgerechnet: 0,120/(434,8 · 0,422) = 6,54 cm² (vorher 6,55). · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_stahlbeton_4 · Massivbau: Biegung

- **Frage:** Ein Balken b/h = 25/45 cm (C25/30, d = 40,5 cm) soll M_Ed = 300 kNm aufnehmen. Das bezogene Moment beträgt μ_Ed = 0,516. Wie ist das Ergebnis mit μ_lim = 0,296 (ξ_lim = 0,45, NA DE) aus dem Modul zu bewerten?
- **Richtige Antwort:** Ohne Druckbewehrung unzulässig; Querschnitt vergrößern oder Druckbewehrung einlegen
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_u_wert_3 · Bauphysik: U-Wert

- **Frage:** Dieselbe Betonwand (20 cm Beton, 1,5 cm Innenputz) wird nur mit 12 cm EPS (λ = 0,035 W/(mK)) gedämmt. Wie ist das Ergebnis im Vergleich mit dem im Modul angesetzten Höchstwert von 0,24 W/(m²K) zu bewerten?
- **Richtige Antwort:** U ≈ 0,27 W/(m²K): Anforderung verfehlt, Dämmung auf 14 cm erhöhen
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_u_wert_4 · Bauphysik: U-Wert

- **Frage:** Für die Wand aus 1,5 cm Innenputz (λ = 0,70) und 20 cm Beton (λ = 2,3) soll mit EPS (λ = 0,035 W/(mK)) genau U ≤ 0,24 W/(m²K) erreicht werden (R_si = 0,13; R_se = 0,04 m²K/W). Welche Dämmstoffdicke ist mindestens erforderlich?
- **Richtige Antwort:** d ≥ 13,6 cm
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_u_wert_5 · Bauphysik: U-Wert

- **Frage:** Im Echtzeitrechner wird bei 14 cm EPS die Betondicke von 20 auf 40 cm verdoppelt. Der U-Wert sinkt dabei nur von 0,234 auf 0,229 W/(m²K). Welche Erklärung trifft zu?
- **Richtige Antwort:** Beton hat mit λ = 2,3 W/(mK) eine hohe Wärmeleitfähigkeit; 20 cm liefern nur 0,09 m²K/W
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_rechnung_u_wert_6 · Bauphysik: U-Wert

- **Frage:** Welcher Anteil des Gesamtwiderstands R_T entfällt bei der Standardwand des Moduls (1,5 cm Putz, 20 cm Beton, 14 cm EPS mit λ = 0,035 W/(mK), R_si = 0,13, R_se = 0,04 m²K/W) auf die Dämmschicht?
- **Richtige Antwort:** rund 93 %
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

## B. Stichprobe unauffälliger Fragen (5)

Auswahl deterministisch (Sortierung nach FNV-1a-Hash der Frage-ID), damit die Stichprobe nachvollziehbar ist.

### qn_rechnung_bestand_2 · Bauen im Bestand

- **Frage:** Welcher Bemessungswert der Streckgrenze ergibt sich für einen historischen Betonstahl III (BSt 420/500 RU) mit γ_S = 1,15?
- **Richtige Antwort:** f_yd = 365,2 N/mm²
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### qn_rechnung_bestand_3 · Bauen im Bestand

- **Frage:** Welche Zugkapazität F_yd hat ein glatter Rundstahl BSt 220/340 RU mit Ø 16 mm (γ_S = 1,15)?
- **Richtige Antwort:** F_yd ≈ 38,5 kN
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### qn_rechnung_bestand_4 · Bauen im Bestand

- **Frage:** Bei einer Verstärkung sollen an vorhandene glatte Rundstähle BSt 220/340 RU neue Stäbe angeschweißt und gerade Stabenden über Verbund verankert werden. Wie ist das nach dem Modul zu beurteilen?
- **Richtige Antwort:** Unzulässig zum Schweißen; zudem ist der Verbund so gering, dass Haken nötig sind
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### qn_rechnung_bestand_6 · Bauen im Bestand

- **Frage:** Ein glatter BSt 220 RU Ø 20 mm wird mit einem kaltverformten BSt 500 RK Ø 12 mm verglichen. Welche Aussage trifft nach den Rechenwegen des Moduls zu?
- **Richtige Antwort:** BSt 220 Ø 20 trägt rund 60 kN, BSt 500 Ø 12 rund 49 kN; glatter Stab schwer verankerbar
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### qn_rechnung_nachhaltigkeit_1 · Nachhaltigkeit & Dauerhaftigkeit

- **Frage:** Wie tief ist eine bewitterte Betonwand mit dem Karbonatisierungsbeiwert k = 4,0 mm/√a nach 50 Jahren nach dem Quadratwurzel-Zeit-Gesetz karbonatisiert?
- **Richtige Antwort:** d_k ≈ 28,3 mm
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

## C. Lernziel-Stichprobe (5 Module)

Quelle: `src/data/lernziele.ts`. Zu prüfen: Lernziele operationalisiert („Sie können …“ + beobachtbares Verb), Bloom-Stufe passend, fachlich richtig, mit den Modulinhalten und Quizfragen abgedeckt.

### rechnung_mauerwerk · Mauerwerk: Tragfähigkeit

Niveau B · 35 min · Vorwissen: mauerwerk, bp_mauerwerk, sicherheitskonzept

- (Anwenden) Sie können den Bemessungswert der Mauerwerksdruckfestigkeit aus charakteristischer Festigkeit, Dauerstandsbeiwert und Teilsicherheitsbeiwert berechnen.
- (Anwenden) Sie können die Schlankheit einer zweiseitig gehaltenen Wand ermitteln und gegen den Grenzwert 27 des vereinfachten Verfahrens prüfen.
- (Anwenden) Sie können mit dem Abminderungsfaktor Φ den Traglastwiderstand N_Rd je Meter Wandlänge nach DIN EN 1996-3 berechnen.
- (Analysieren) Sie können den Einfluss von Wanddicke und Steinart (Kalksandstein, Hochlochziegel) auf den Ausnutzungsgrad vergleichen.

- [ ] ok
- [x] ändern: Lernziele an das Modul angeglichen – Grenzschlankheit 25 → 27, Dauerstandsbeiwert ζ in Lernziel 1 ergänzt (src/data/lernziele.ts), korrigiert

### rechnung_schallschutz · Bauakustik: Schallschutz

Niveau B · 35 min · Vorwissen: schallschutz, baustoffkenngroessen

- (Verstehen) Sie können den Einfluss des Massegesetzes und der Flankenübertragung auf die Luftschalldämmung massiver Bauteile erläutern.
- (Anwenden) Sie können die flächenbezogene Masse einer Massivwand einschließlich Putz berechnen.
- (Anwenden) Sie können das Direktschalldämm-Maß R_w über die Massekurve nach DIN 4109-32 und das Bauschalldämm-Maß R'_w mit Flankenabzug ermitteln.
- (Bewerten) Sie können das Ergebnis mit den Anforderungen nach DIN 4109-1 an Trennwände vergleichen und Verbesserungsmaßnahmen begründen.

- [ ] ok
- [x] ändern: Klärung erforderlich: Lernziel nennt „DIN 4109 Beiblatt 1“ wie der Modultext und die Modulrechnung (R_w = 32,4·lg m′ − 26); der Rechenkern src/calc/schall.ts verwendet dagegen DIN 4109-32:2016-07 (R_w = 30,9·lg m′ − 22,2). Beiblatt 1 ist durch DIN 4109-32 ersetzt – Modul und Lernziel auf DIN 4109-32 umstellen?

### rechnung_brandschutz · Brandschutz: Heißbemessung

Niveau B/M · 50 min · Vorwissen: brandschutz, holzbau_bauphysik, holzbau_bemessung

- (Anwenden) Sie können die effektive Abbrandtiefe aus Abbrandrate, Branddauer und Entfestigungszone nach DIN EN 1995-1-2 berechnen.
- (Anwenden) Sie können den Restquerschnitt eines Holzträgers bestimmen und die Heißtragfähigkeit M_fi,Rd mit der Einwirkung M_fi,Ed vergleichen.
- (Anwenden) Sie können die Mindestabmessungen und Achsabstände von Stahlbetonbalken und -stützen nach dem Tabellenverfahren von DIN EN 1992-1-2 ermitteln.
- (Analysieren) Sie können das Brandverhalten von Brettschichtholz, Nadel- und Laubholz anhand ihrer Abbrandraten vergleichen.
- (Verstehen) Sie können die Abplatzgefahr hochfester Betone im Brandfall und die zugehörige Gegenmaßnahme erläutern.

- [x] ok
- [ ] ändern: …

### labor_sicherheit · Laborsicherheit

Niveau B · 30 min · Vorwissen: –

- (Erinnern) Sie können die acht Säulen der Laborsicherheit im Baustofflabor einschließlich Alleinarbeitsverbot und Geräteberechtigung benennen.
- (Verstehen) Sie können die Gefährdungen durch Zement mit pH-Werten über 12, krebserzeugenden Quarzfeinstaub und sensibilisierende Reaktionsharze erläutern.
- (Anwenden) Sie können für Mischen, Sägen, Prüfen und den Umgang mit Zement, Quarzstaub oder Epoxidharzen die erforderliche Schutzausrüstung auswählen.
- (Anwenden) Sie können im Notfall die Sofortmaßnahmen von NOT-HALT über Erste Hilfe und Notruf mit den 5 W-Fragen bis zum Eintrag im Verbandbuch ausführen.

- [x] ok
- [ ] ändern: …

### rechnung_bestand · Bauen im Bestand

Niveau B/M · 45 min · Vorwissen: historisch, bauwerksuntersuchung, stahlbeton_bemessung

- (Anwenden) Sie können historische Betonfestigkeitsklassen nach DIN 1045:1972 über Würfelnormierung und Zylinderumrechnung einer heutigen Festigkeitsklasse zuordnen.
- (Anwenden) Sie können den Bemessungswert der Betondruckfestigkeit im Bestand mit und ohne Bohrkernprüfung berechnen.
- (Bewerten) Sie können den Nutzen einer zerstörenden Bauwerksprüfung gegenüber einer Einstufung nach Aktenlage mit pauschalem Abschlag beurteilen.
- (Anwenden) Sie können für historische Betonstähle den Bemessungswert der Streckgrenze und die Zugkapazität eines Einzelstabs berechnen.
- (Bewerten) Sie können die Schweißeignung und das Verbundverhalten historischer Betonstähle beurteilen und Konsequenzen für die Verankerung ableiten.

- [x] ok
- [ ] ändern: …
