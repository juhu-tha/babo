# Prüfliste Quiz – Cluster VI: Studium & Lehre

Stand: 27.10.2026 · Grundlage: `src/data/quiz.json` (Feld `vorpruefung`, Stand 25.10.2026), `docs/quiz-pruefhinweise.md`, Vorprüfungsberichte `docs/quiz-vorpruefung-cluster-I-III.md` und `docs/quiz-vorpruefung-cluster-IV-VII.md`. quiz.json wurde für diese Liste nicht verändert.

Cluster VI umfasst 60 Fragen aus 10 Modulen. Aufgeführt sind 1 auffällige Fragen (Vorprüfung „korrigiert“ oder „fraglich“ bzw. offener Prüfhinweis) und eine Stichprobe von 5 unauffälligen Fragen. Entscheidung je Frage ankreuzen; bei „ändern“ den Änderungswunsch in die Zeile darunter schreiben.

## A. Auffällige Fragen

### qn_rechnung_stahlbeton_3 · Massivbau: Biegung

- **Frage:** Für M_Ed = 120 kNm, C25/30, b/h = 30/50 cm und d = 45,5 cm ergibt sich μ_Ed = 0,136 und der Hebelarm z = 0,422 m. Welche Biegezugbewehrung ist mit f_yd = 434,8 N/mm² erforderlich?
- **Richtige Antwort:** A_s,erf = 6,54 cm²
- **Auffälligkeit:** Vorprüfung „korrigiert“: Nachgerechnet: 0,120/(434,8 · 0,422) = 6,54 cm² (vorher 6,55).
- [ ] ok
- [ ] ändern: …

## B. Stichprobe unauffälliger Fragen (5)

Auswahl deterministisch (Sortierung nach Hash der Frage-ID), damit die Stichprobe nachvollziehbar ist.

### qn_rechnung_u_wert_6 · Bauphysik: U-Wert

- **Frage:** Welcher Anteil des Gesamtwiderstands R_T entfällt bei der Standardwand des Moduls (1,5 cm Putz, 20 cm Beton, 14 cm EPS mit λ = 0,035 W/(mK), R_si = 0,13, R_se = 0,04 m²K/W) auf die Dämmschicht?
- **Richtige Antwort:** rund 93 %
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [ ] ok
- [ ] ändern: …

### qn_rechnung_u_wert_5 · Bauphysik: U-Wert

- **Frage:** Im Echtzeitrechner wird bei 14 cm EPS die Betondicke von 20 auf 40 cm verdoppelt. Der U-Wert sinkt dabei nur von 0,234 auf 0,229 W/(m²K). Welche Erklärung trifft zu?
- **Richtige Antwort:** Beton hat mit λ = 2,3 W/(mK) eine hohe Wärmeleitfähigkeit; 20 cm liefern nur 0,09 m²K/W
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [ ] ok
- [ ] ändern: …

### qn_rechnung_u_wert_4 · Bauphysik: U-Wert

- **Frage:** Für die Wand aus 1,5 cm Innenputz (λ = 0,70) und 20 cm Beton (λ = 2,3) soll mit EPS (λ = 0,035 W/(mK)) genau U ≤ 0,24 W/(m²K) erreicht werden (R_si = 0,13; R_se = 0,04 m²K/W). Welche Dämmstoffdicke ist mindestens erforderlich?
- **Richtige Antwort:** d ≥ 13,6 cm
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [ ] ok
- [ ] ändern: …

### qn_rechnung_bestand_1 · Bauen im Bestand

- **Frage:** Aus den Bestandsunterlagen wurde für einen Altbeton f_ck,cyl = 17,1 N/mm² abgeleitet; Bohrkerne liegen nicht vor. Welcher Bemessungswert f_cd ergibt sich nach dem Vorgehen des Moduls (pauschaler Abschlag 3,0 N/mm², α_cc = 0,85, γ_C = 1,5)?
- **Richtige Antwort:** f_cd = 7,99 N/mm²
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [ ] ok
- [ ] ändern: …

### qn_rechnung_bestand_2 · Bauen im Bestand

- **Frage:** Welcher Bemessungswert der Streckgrenze ergibt sich für einen historischen Betonstahl III (BSt 420/500 RU) mit γ_S = 1,15?
- **Richtige Antwort:** f_yd = 365,2 N/mm²
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [ ] ok
- [ ] ändern: …

## C. Lernziel-Stichprobe (5 Module)

Quelle: `src/data/lernziele.ts`. Zu prüfen: Lernziele operationalisiert („Sie können …“ + beobachtbares Verb), Bloom-Stufe passend, fachlich richtig, mit den Modulinhalten und Quizfragen abgedeckt.

### rechnung_mauerwerk · Mauerwerk: Tragfähigkeit

Niveau B · 35 min · Vorwissen: mauerwerk, bp_mauerwerk, sicherheitskonzept

- (Anwenden) Sie können den Bemessungswert der Mauerwerksdruckfestigkeit aus charakteristischer Festigkeit und Teilsicherheitsbeiwert berechnen.
- (Anwenden) Sie können die Schlankheit einer zweiseitig gehaltenen Wand ermitteln und gegen den Grenzwert 25 des vereinfachten Verfahrens prüfen.
- (Anwenden) Sie können mit dem Abminderungsfaktor Φ den Traglastwiderstand N_Rd je Meter Wandlänge nach DIN EN 1996-3 berechnen.
- (Analysieren) Sie können den Einfluss von Wanddicke und Steinart (Kalksandstein, Hochlochziegel) auf den Ausnutzungsgrad vergleichen.

- [ ] ok
- [ ] ändern: …

### rechnung_schallschutz · Bauakustik: Bauschalldämmmaß

Niveau B · 35 min · Vorwissen: schallschutz, baustoffkenngroessen

- (Verstehen) Sie können den Einfluss des Massegesetzes und der Flankenübertragung auf die Luftschalldämmung massiver Bauteile erläutern.
- (Anwenden) Sie können die flächenbezogene Masse einer Massivwand einschließlich Putz berechnen.
- (Anwenden) Sie können das Direktschalldämm-Maß R_w über die Massekurve nach DIN 4109 Beiblatt 1 und das Bauschalldämm-Maß R'_w mit Flankenabzug ermitteln.
- (Bewerten) Sie können das Ergebnis mit den Anforderungen nach DIN 4109-1 an Trennwände vergleichen und Verbesserungsmaßnahmen begründen.

- [ ] ok
- [ ] ändern: …

### rechnung_brandschutz · Brandschutz: Heißbemessung

Niveau B/M · 50 min · Vorwissen: brandschutz, holzbau_bauphysik, holzbau_bemessung

- (Anwenden) Sie können die effektive Abbrandtiefe aus Abbrandrate, Branddauer und Entfestigungszone nach DIN EN 1995-1-2 berechnen.
- (Anwenden) Sie können den Restquerschnitt eines Holzträgers bestimmen und die Heißtragfähigkeit M_fi,Rd mit der Einwirkung M_fi,Ed vergleichen.
- (Anwenden) Sie können die Mindestabmessungen und Achsabstände von Stahlbetonbalken und -stützen nach dem Tabellenverfahren von DIN EN 1992-1-2 ermitteln.
- (Analysieren) Sie können das Brandverhalten von Brettschichtholz, Nadel- und Laubholz anhand ihrer Abbrandraten vergleichen.
- (Verstehen) Sie können die Abplatzgefahr hochfester Betone im Brandfall und die zugehörige Gegenmaßnahme erläutern.

- [ ] ok
- [ ] ändern: …

### labor_sicherheit · Laborsicherheit Gebäude G2

Niveau B · 30 min · Vorwissen: –

- (Erinnern) Sie können die acht Säulen der Laborsicherheit im Baustofflabor einschließlich Alleinarbeitsverbot und Geräteberechtigung benennen.
- (Verstehen) Sie können die Gefährdungen durch Zement mit pH-Werten über 12, krebserzeugenden Quarzfeinstaub und sensibilisierende Reaktionsharze erläutern.
- (Anwenden) Sie können für Mischen, Sägen, Prüfen und den Umgang mit Zement, Quarzstaub oder Epoxidharzen die erforderliche Schutzausrüstung auswählen.
- (Anwenden) Sie können im Notfall die Sofortmaßnahmen von NOT-HALT über Erste Hilfe und Notruf mit den 5 W-Fragen bis zum Eintrag im Verbandbuch ausführen.

- [ ] ok
- [ ] ändern: …

### rechnung_bestand · Bauen im Bestand: Sanierung

Niveau B/M · 45 min · Vorwissen: historisch, bauwerksuntersuchung, stahlbeton_bemessung

- (Anwenden) Sie können historische Betonfestigkeitsklassen nach DIN 1045:1972 über Würfelnormierung und Zylinderumrechnung einer heutigen Festigkeitsklasse zuordnen.
- (Anwenden) Sie können den Bemessungswert der Betondruckfestigkeit im Bestand mit und ohne Bohrkernprüfung berechnen.
- (Bewerten) Sie können den Nutzen einer zerstörenden Bauwerksprüfung gegenüber einer Einstufung nach Aktenlage mit pauschalem Abschlag beurteilen.
- (Anwenden) Sie können für historische Betonstähle den Bemessungswert der Streckgrenze und die Zugkapazität eines Einzelstabs berechnen.
- (Bewerten) Sie können die Schweißeignung und das Verbundverhalten historischer Betonstähle beurteilen und Konsequenzen für die Verankerung ableiten.

- [ ] ok
- [ ] ändern: …
