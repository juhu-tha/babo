# Quiz-Vorprüfung Cluster I–III (technische Vorprüfung, ohne Freigabe)

Stand: 2026-10-25 · Umfang: alle 691 Fragen der Cluster I (Grundlagen & Labor), II (Materialien & Produkte) und III (Entwurf & Bemessung) laut Registry, einschließlich der 30 Labor-Handout-Fragen aus #140 (`quizZuordnung.ts` → `META_CLUSTERS`).

Jede Frage trägt jetzt `vorpruefung: { am: '2026-10-25', ergebnis, hinweis? }`. `verified` wurde nicht verändert – die fachliche Freigabe bleibt bei Prof. Huber.

## Ergebnis

| Cluster | ok | korrigiert | fraglich |
|---|---|---|---|
| I | 203 | 8 | 1 |
| II | 301 | 7 | 2 |
| III | 160 | 8 | 1 |
| **Summe** | **664** | **23** | **4** |

Geprüft wurden: Richtigkeit und Eindeutigkeit der Lösung, Distraktoren und `distraktorFeedback`, alle Rechenfragen nachgerechnet, `normRef` gegen `centralNormenRegistry.ts` (Skriptabgleich), Bloom-Stufe und Niveau. Zweifelsfälle wurden per Websuche geprüft (Quellen in der Tabelle).

## Fragliche Punkte für Prof. Huber

- **q_kunststoff_1** (Cluster II): Tippfehler in der richtigen Antwort: „du bist engmaschig …“ → „Sie sind engmaschig …“. Freigegebene Frage daher unverändert gelassen – bitte korrigieren; Vorschlag für Distraktoren (Ratsche, „ausschließlich“) im Bericht.
- **q_ea_2** (Cluster I): Bestätigt: GModG gilt seit 29.07.2026, 65-%-Regel entfällt, Bio-Treppe (§ 43 GModG), Energieausweis A+ bis H bleibt. Nicht bestätigt: Verkündungsdatum 28.07.2026 und die Aussage „§§ 15, 16 und 79–88 bleiben, Bestandsregeln teils neu nummeriert“ (keine Konkordanz gefunden).
- **q_hwk_3** (Cluster II): Seit 06.08.2026 gilt zusätzlich die EU-Beschränkung REACH Anhang XVII Nr. 77 (Formaldehyd 0,062 mg/m³, Kammerverfahren nach Anlage 14; EN 717-1 bevorzugt, EN 16516 zulässig). Frage und Erklärung nennen nur ChemVerbotsV/DIN EN 16516 – bitte entscheiden, ob Frage auf den EU-Stand umgestellt werden soll.
- **qn_grundlagen_2** (Cluster III): normRef nennt DIN 1045-2:2008-08, Tab. F.4.1; Registry: DIN 1045-2:2023-08. Bitte prüfen, ob Mehlkornhöchstwerte (400/450 kg/m³) und Tabellennummer in der Ausgabe 2023-08 unverändert sind – dann normRef umstellen.

Sammelhinweise (Ergebnis „ok“, aber offen auf Modulebene):

- **qn_sommerlicher_waermeschutz_1 bis _8**: zitieren DIN 4108-2:2013-02 bewusst (§ 14 GModG nimmt diese Ausgabe in Bezug); die Registry führt DIN 4108-2:2026-05. Der Abgleich der Tabellenwerte ist laut Modul noch offen.
- **q_bab_1, qn_bp_abdichtung_1**: Klassen W1-E/W2.1-E nach DIN 18533-1:2017-07; die Registry führt die Ausgabe 2026-06 (Klassenabgleich offen laut Normen-Check).

## Ratschen

Nicht freigegebene Fragen der Cluster I–III tragen nach der Vorprüfung **0** Treffer zu „Verhältnis > 1,2“ und **0** Absolutwörter in Distraktoren. Alle verbleibenden Treffer in I–III liegen in **17 bereits freigegebenen Fragen** (Verhältnis > 1,2: 17; Absolutwörter: 7 – q_kg_1 2, q_massiv_1 2, q_kunststoff_1 1, q_holz_2 1, q_recht_1 1). Sie wurden nach Absprache **nicht geändert**; die Umformulierungen stehen unten als Vorschlag. Mit allen Vorschlägen fielen die Treffer in I–III auf 0/0 (rechnerisch geprüft: alle Verhältnisse ≤ 1,2). Die Grenzwerte in `tests/quiz.test.ts` sind unverändert.

## Vorschläge für freigegebene Fragen (nicht umgesetzt)

### q_kg_1

Was ist der fundamentale Unterschied zwischen Reindichte (ρ_s) und Rohdichte (ρ) eines Baustoffs?

Richtig (unverändert): Die Reindichte ermittelt sich unter Ausschluss sämtlicher Porenräume (Zerkleinerung des Materials), während die Rohdichte das Porenvolumen einschließt.

- Option 2: ~~Die Rohdichte wird stets feucht gemessen, während die Reindichte das unberührte Baumaterial beschreibt.~~ → Die Rohdichte wird am wassergesättigten Probekörper bestimmt, die Reindichte dagegen am unbehandelten, trockenen Stück im Lieferzustand.
- Option 3: ~~Die Reindichte beschreibt ausschließlich metallische Werkstoffe, während Rohdichte nur für klastische Lockergesteine gilt.~~ → Die Reindichte wird für metallische und andere porenfreie Werkstoffe angegeben, die Rohdichte dagegen für Lockergesteine und Schüttgüter.
- Option 4: ~~Reindichte und Rohdichte sind bei mineralischen Baustoffen definitionsgemäß identisch.~~ → Reindichte und Rohdichte sind bei mineralischen Baustoffen gleich, weil die Poren mit Luft gefüllt sind und keine Masse beitragen.

### q_kg_2

Wie verändert sich die Wärmeleitfähigkeit (λ) eines Mauerwerksteines bei zunehmendem Feuchtegehalt?

Richtig (unverändert): Sie steigt drastisch an, da Wasser eine rund 25-fach höhere Wärmeleitfähigkeit aufweist als ruhende Luft (0,6 W/(m·K) vs. 0,026 W/(m·K)).

- Option 1: ~~Sie sinkt ab, da das ruhende Wasser in den Poren als exzellente Wärmebarriere wirkt.~~ → Sie sinkt ab, da das ruhende Wasser in den Poren als Wärmebarriere wirkt und die Luftbewegung in den Poren vollständig unterbindet.
- Option 2: ~~Sie bleibt vollkommen unverändert, da die mineralische Struktur des Porenskeletts den Transport dominiert.~~ → Sie bleibt nahezu unverändert, da die mineralische Struktur des Porenskeletts den Wärmetransport dominiert und Wasser kaum ins Gewicht fällt.
- Option 4: ~~Sie fällt exponentiell ab, weil Feuchtigkeit die Wärmestrahlung im Porenraum vollständig absorbiert.~~ → Sie fällt exponentiell ab, weil die Feuchtigkeit die Wärmestrahlung im Porenraum absorbiert und den Strahlungsanteil damit beseitigt.

### q_kalk_1

Welche endotherme Reaktion findet beim Kalkbrennen bei ca. 900–1000 °C im Schachtofen statt?

Richtig (unverändert): CaCO3 -> CaO + CO2 (Thermische Entsäuerung des Kalksteins zu Branntkalk)

- Option 2: ~~CaO + H2O -> Ca(OH)2 + Wärme (Kalklöschen)~~ → CaO + H2O -> Ca(OH)2 + Wärme (Kalklöschen des Branntkalks zu Kalkhydrat im Löschwerk)
- Option 3: ~~Ca(OH)2 + CO2 -> CaCO3 + H2O (Karbonatisierung)~~ → Ca(OH)2 + CO2 -> CaCO3 + H2O (Karbonatisierung des Kalkhydrats beim Erhärten von Kalkmörtel)
- Option 4: ~~CaSO4 · 2 H2O -> CaSO4 · 0,5 H2O + 1,5 H2O (Gipsbrennen)~~ → CaSO4 · 2 H2O -> CaSO4 · 0,5 H2O + 1,5 H2O (Gipsbrennen zu Halbhydrat bei rund 150 °C)

### q_zement_1

Welche Klinkerphase ist für die hohe Anfangsfestigkeit (nach 1 bis 7 Tagen) im Portlandzement verantwortlich?

Richtig (unverändert): Alit (C3S, Tricalciumsilicat) mit schneller exothermer Hydratation zu C-S-H-Phasen und Portlandit.

- Option 1: ~~Belit (C2S, Dicalciumsilicat) mit langsamer Nacherhärtung über Monate.~~ → Belit (C2S, Dicalciumsilicat), das die Festigkeit vor allem langsam über Monate bis Jahre nacherhärtend aufbaut.
- Option 2: ~~Calciumsulfat-Dihydrat (Gips).~~ → Calciumsulfat-Dihydrat (Gips), das dem Klinker beim Mahlen als Erstarrungsregler zugesetzt wird.
- Option 3: ~~Tetracalciumaluminatferrit (C4AF, Braunmillerit) als reines Flussmittel.~~ → Tetracalciumaluminatferrit (C4AF, Braunmillerit), das im Drehrohrofen vor allem als Flussmittel wirkt.

### q_glas_1

Welches Glas zerfällt bei Bruch in stumpfkantige, kleine Krümel und weist eine hohe Temperaturwechselbeständigkeit (~200 K) auf?

Richtig (unverändert): Einscheiben-Sicherheitsglas (ESG) durch thermische Vorspannung

- Option 2: ~~Normales Floatglas (Spiegelglas)~~ → Normales Floatglas (Spiegelglas) ohne thermische oder chemische Nachbehandlung
- Option 3: ~~Teilvorgespanntes Glas (TVG)~~ → Teilvorgespanntes Glas (TVG), das langsamer abgekühlt wird als vorgespanntes Glas
- Option 4: ~~Mehrscheiben-Isolierglas (MIG) mit unveredelten Floatglasscheiben~~ → Mehrscheiben-Isolierglas (MIG) mit zwei unveredelten Floatglasscheiben und Randverbund

### q_glas_2

Warum führt eine Vergrößerung des Scheibenzwischenraums (SZR) von 16 mm auf über 24 mm bei Isolierglas NICHT zu einer besseren Wärmedämmung?

Richtig (unverändert): Weil ab ca. 16–18 mm Abstand freie innere Konvektionswalzen des Füllgases entstehen, die Wärme aktiv von der warmen zur kalten Scheibe transportieren.

- Option 1: ~~Weil bei größerem Abstand die Infrarotstrahlung ungehindert durch das Glas hindurchgeht.~~ → Weil bei größerem Scheibenabstand die langwellige Infrarotstrahlung ungehindert durch beide Scheiben hindurchgeht und so mehr Wärme verloren geht.
- Option 2: ~~Weil Argon bei größeren Volumina chemisch zu dissoziieren beginnt.~~ → Weil das Füllgas Argon bei größeren Volumina chemisch zu dissoziieren beginnt und dann über den Randverbund aus dem Zwischenraum entweicht.
- Option 3: ~~Weil dickere Randverbünde die mechanische Durchbiegung der Scheiben behindern.~~ → Weil dickere Randverbünde die Durchbiegung der Scheiben unter Klimalasten behindern und dadurch Wärmebrücken am Glasrand entstehen.

### q_metall_1

Was bedeutet die Bezeichnung 'S355J2+N' für einen unlegierten Baustahl?

Richtig (unverändert): Baustahl (S) mit Mindeststreckgrenze ReH = 355 MPa bei Nenndicke, Kerbschlagarbeit min. 27 J bei -20 °C (J2), normalisierend gewalzt (+N).

- Option 2: ~~Spannstahl mit 355 MPa Zugfestigkeit, nicht schweißbar.~~ → Spannstahl (S) mit 355 MPa Zugfestigkeit, J2 als Kennung der Drahtsorte (glatter Draht), nicht schweißbar und nicht nachbehandelt (+N).
- Option 3: ~~Edelstahl mit 35% Chromanteil für maritime Anwendungen.~~ → Nichtrostender Edelstahl (S) mit 35 % Chromanteil, Güteklasse J2 für maritime Anwendungen, Oberfläche nitriert (+N) gegen Lochfraß.
- Option 4: ~~Schraubenwerkstoff der Festigkeitsklasse 3.5 nach ISO 898.~~ → Schraubenwerkstoff der Festigkeitsklasse 3.5 nach ISO 898 (S = Schraube), Zusatz J2 für Zähigkeit, galvanisch verzinkt (+N).

### q_daemm_1

Welcher Dämmstoff eignet sich aufgrund seiner geschlossenzelligen Struktur und minimalen Wasseraufnahme besonders für die erdberührte Perimeterdämmung und das Umkehrdach?

Richtig (unverändert): Extrudiertes Polystyrol (XPS)

- Option 1: ~~Expandiertes Polystyrol (EPS)~~ → Expandiertes Polystyrol (EPS, WDVS-Platte)
- Option 2: ~~Holzfaserdämmplatten (WF)~~ → Holzfaserdämmplatten (WF, Nassverfahren)
- Option 3: ~~Steinwolle (MW)~~ → Steinwolle (MW, Mineralwolle-Platte)

### q_kunststoff_1

Welches Merkmal kennzeichnet Duroplaste (z. B. Epoxidharze, Polyurethane) im Vergleich zu Thermoplasten?

Richtig (unverändert): du bist engmaschig räumlich kovalent vernetzt, schmelzen bei Erwärmung nicht, sondern zersetzen sich thermisch bei Überhitzung.

- Option 1 (richtige Antwort, nur Tippfehler): ~~du bist engmaschig räumlich kovalent vernetzt, schmelzen bei Erwärmung nicht, sondern zersetzen sich thermisch bei Überhitzung.~~ → Sie sind engmaschig räumlich kovalent vernetzt, schmelzen bei Erwärmung nicht, sondern zersetzen sich thermisch bei Überhitzung.
- Option 2: ~~Sie lassen sich durch Wiedererwärmen beliebig oft aufschmelzen und verformen.~~ → Sie lassen sich durch Wiedererwärmen beliebig oft aufschmelzen und neu formen, weil ihre Ketten nur physikalisch verknäult sind.
- Option 3: ~~Sie besitzen keine mechanische Druckfestigkeit und sind rein flüssig.~~ → Sie besitzen keine nennenswerte Druckfestigkeit und bleiben auch nach der Aushärtung zähflüssig wie ein Bitumen.
- Option 4: ~~Sie bestehen ausschließlich aus biobasierten Zellulosefasern.~~ → Sie bestehen überwiegend aus biobasierten Zellulosefasern, die durch Naturharze zu einem Faserverbund gebunden sind.

### q_rsto_1

Welche Eingangsgröße bestimmt in den Richtlinien für die Standardisierung des Oberbaus von Verkehrsflächen (RStO 12/24) maßgeblich die Belastungsklasse (Bk100 bis Bk0,3)?

Richtig (unverändert): Die bemessungsrelevante Beanspruchung B in Form gewichteter äquivalenter 10-Tonnen-Achsübergänge des Schwerverkehrs über den Nutzungszeitraum.

- Option 2: ~~Die jährliche Niederschlagsmenge im Einzugsgebiet.~~ → Die jährliche Niederschlagsmenge im Einzugsgebiet, weil sie die Wasserbeanspruchung und damit die Frostgefährdung des Oberbaus bestimmt.
- Option 3: ~~Die zulässige Höchstgeschwindigkeit für Personenkraftwagen.~~ → Die zulässige Höchstgeschwindigkeit für Pkw, weil sie die dynamischen Radlasten und Bremskräfte auf der Fahrbahndecke bestimmt.
- Option 4: ~~Der Anteil von Fahrrädern am Gesamtverkehr.~~ → Die durchschnittliche tägliche Verkehrsstärke aller Fahrzeuge (DTV), gezählt ohne Unterscheidung nach Fahrzeugart und Achslast.

### q_beton_1

Welche Auswirkung hat eine Erhöhung des Wasserzementwerts (w/z-Wert) von 0,45 auf 0,65 auf das Festbetongefüge?

Richtig (unverändert): Das Kapillarporenvolumen steigt drastisch an, die Druckfestigkeit sinkt stark und die Dauerhaftigkeit gegen Schadstoffeintrag nimmt ab.

- Option 1: ~~Die Druckfestigkeit steigt an, da mehr Reaktionswasser für die C-S-H-Phasenbildung bereitsteht.~~ → Die Druckfestigkeit steigt an, da mehr Reaktionswasser für die C-S-H-Phasenbildung bereitsteht und der Zement vollständiger hydratisiert.
- Option 2: ~~Die Hydratationswärme verdoppelt sich, was zu massiven Temperaturrissen führt.~~ → Die Hydratationswärme verdoppelt sich, da das zusätzliche Wasser die Reaktion beschleunigt, was zu Temperaturrissen im Bauteil führt.
- Option 4: ~~Die Dichte des Zementsteins erhöht sich durch die bessere Benetzung der Gesteinskörner.~~ → Die Dichte des Zementsteins erhöht sich durch die bessere Benetzung der Gesteinskörner, wodurch die Kontaktzone dichter wird.

### q_beton_expo

Für welches Umweltangriffsszenario steht die Expositionsklasse 'XD3' gemäß DIN EN 206?

Richtig (unverändert): Wechselnd nass und trocken bei Einwirkung von taumittelhaltigem Spritzwasser (z. B. Parkhausdecks, Spritzwasserbereiche von Brückenpfeilern).

- Option 1: ~~Hohe Sättigung mit Wasser ohne Taumittel (z. B. Staumauern).~~ → Hohe Wassersättigung ohne Taumittel bei Frostangriff (z. B. offene Wasserbehälter, Bauteile in der Wasserwechselzone von Gewässern).
- Option 2: ~~Mäßige Feuchte im Innenraum ohne Korrosionsrisiko.~~ → Mäßige Feuchte im Innenraum ohne Chlorideintrag (z. B. Innenbauteile mit hoher Luftfeuchte wie Bäder, Küchen und Wäschereien).
- Option 4: ~~Chemisch schwach angreifende Böden und Abwässer.~~ → Chemisch schwach angreifende Umgebung durch natürliche Böden und Grundwasser (z. B. Fundamente in sulfathaltigem Boden).

### q_massiv_1

Wie setzt sich das Nennmaß der Betondeckung c_nom nach Eurocode 2 rechnerisch zusammen?

Richtig (unverändert): c_nom = c_min + Δc_dev (Mindestbetondeckung plus Vorhaltemaß für baustellenbedingte Ausführungstoleranzen)

- Option 1: ~~c_nom entspricht immer dem Stabdurchmesser ds ohne Toleranzaufschlag~~ → c_nom = ds (Stabdurchmesser), da die Verbundbedingung die Deckung allein bestimmt und kein Toleranzaufschlag nötig ist
- Option 2: ~~c_nom = c_min · 1,50 (Reiner Teilsicherheitsfaktor auf die Betondeckung)~~ → c_nom = c_min · 1,50 (Teilsicherheitsbeiwert γ auf die Mindestbetondeckung nach dem Sicherheitskonzept des EC 2)
- Option 4: ~~c_nom = 20 mm für sämtliche Bauteile und Umweltklassen pauschal~~ → c_nom = 20 mm als Pauschalwert für alle Bauteile, unabhängig von Expositionsklasse, Stabdurchmesser und Ausführung

### q_holz_1

Was versteht man in der Holzphysik unter dem 'Fasersättigungsbereich' (FSB)?

Richtig (unverändert): Den Feuchtepunkt (ca. 28-32% Holzfeuchte u), bei dem die Zellwände maximal mit gebundenem Wasser gesättigt sind, die Zellhohlräume (Lumina) aber noch frei von flüssigem Wasser sind.

- Option 1: ~~Den Feuchtegehalt, bei dem das Holz unter Wasser vollständig verrottet.~~ → Den Feuchtegehalt (über ca. 60 % Holzfeuchte), bei dem das Holz unter Wasser vollständig durchnässt ist, alle Zellhohlräume gefüllt sind und es zu verrotten beginnt.
- Option 2: ~~Die maximale Feuchteaufnahme von verleimtem Brettschichtholz.~~ → Die maximale Feuchteaufnahme von verleimtem Brettschichtholz (ca. 20 % Holzfeuchte), ab der die Klebfugen aufweichen und sich die einzelnen Lamellen ablösen.
- Option 4: ~~Den Grenzwert, ab dem Schimmelpilzbefall physikalisch unmöglich wird.~~ → Den Grenzwert der Holzfeuchte (ca. 10 %), oberhalb dessen ein Befall durch Schimmelpilze und holzzerstörende Pilze physikalisch unmöglich wird, weil Sauerstoff fehlt.

### q_holz_2

Warum unterscheidet man bei mechanischen Holzfestigkeiten stets strikt zwischen Beanspruchung parallel und rechtwinklig zur Faser?

Richtig (unverändert): Weil Holz ein stark anisotropes (orthotropes) Material ist: Die Zugfestigkeit parallel zur Faser ist um ein Vielfaches höher als die Zugfestigkeit quer zur Faser, die extrem gering ist (Spaltgefahr).

- Option 1: ~~Weil Holz ein isotroper Werkstoff mit einheitlichem Elastizitätsmodul ist.~~ → Weil Holz ein isotroper Werkstoff mit richtungsunabhängigem E-Modul ist, dessen Festigkeiten nur wegen der visuellen Sortierklassen nach DIN 4074 getrennt angegeben werden.
- Option 3: ~~Weil quer zur Faser der Brandschutz versagt.~~ → Weil quer zur Faser der Brandschutz versagt: Die Abbrandrate rechtwinklig zur Faser ist so hoch, dass die Festigkeit in dieser Richtung im Brandfall vollständig entfällt.
- Option 4: ~~Weil Holzfasern im Kernholz stets quer zur Wuchsrichtung verlaufen.~~ → Weil die Holzfasern im Kernholz quer zur Wuchsrichtung des Stammes verlaufen und deshalb nur das äußere Splintholz in Faserrichtung tragfähig belastet werden darf.

### q_recht_1

Wann ist ein Bauunternehmen nach VOB/B § 4 Abs. 3 verpflichtet, eine schriftliche Bedenkenanmeldung abzugeben?

Richtig (unverändert): Wenn es Bedenken gegen die vorgesehene Art der Ausführung, die Güte der vom Auftraggeber gelieferten Stoffe oder gegen die Vorleistungen anderer Unternehmer hat.

- Option 1: ~~Nur wenn der Bauherr die Baustelle länger als 4 Wochen nicht persönlich besichtigt hat.~~ → Nur wenn der Bauherr die Baustelle länger als vier Wochen nicht persönlich besichtigt und die Ausführung der Arbeiten damit nicht selbst überwacht hat.
- Option 2: ~~Nur wenn ein gerichtliches Gutachten die Unbrauchbarkeit der Planung bestätigt.~~ → Nur wenn ein gerichtliches Gutachten die Unbrauchbarkeit der Planung bereits bestätigt hat, da vorher kein ausreichend begründeter Verdacht besteht.
- Option 3: ~~Ausschließlich bei Überschreitung der behördlichen Baugenehmigungsfristen.~~ → Wenn die behördlichen Fristen der Baugenehmigung überschritten sind und die Arbeiten deshalb ohne gültige Genehmigung weiterlaufen würden.

### q_recht_cpr

Was bescheinigt die CE-Kennzeichnung auf einem Bauprodukt rechtlich verbindlich nach der EU-Bauproduktenverordnung (CPR)?

Richtig (unverändert): Dass der Hersteller die Verantwortung für die Konformität mit der erklärten Leistung (Declaration of Performance, DoP) und harmonisierten Normen (hEN) übernimmt.

- Option 1: ~~Dass das Bauprodukt ein deutsches Qualitäts- und Gütesiegel wie 'RAL' besitzt.~~ → Dass das Bauprodukt ein deutsches Qualitäts- und Gütesiegel wie RAL besitzt und laufend von einer Güteschutzgemeinschaft überwacht wird.
- Option 2: ~~Dass das Produkt zu 100% schadstofffrei und biologisch abbaubar ist.~~ → Dass das Produkt frei von Schadstoffen und biologisch abbaubar ist, was durch eine Umweltproduktdeklaration (EPD) verbindlich belegt wird.
- Option 3: ~~Dass das Produkt in jedem Bundesland ohne weitere statische Prüfung verbaut werden darf.~~ → Dass das Produkt in jedem Bundesland ohne weitere statische Prüfung oder Verwendbarkeitsnachweis in jedes Bauwerk eingebaut werden darf.
- normRef: EU-BauPVO (CPR) Nr. 305/2011 → EU-BauPVO (CPR) Nr. 305/2011 bzw. VO (EU) 2024/3110

## Alle Fragen

| id | Cluster | Ergebnis | was geändert | Begründung/Quelle |
|---|---|---|---|---|
| q_kg_1 | I | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok (DIN EN 1097-6/-7) |
| q_kg_2 | I | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok (λ Wasser ≈ 0,6, Luft ≈ 0,026 W/(m·K)) |
| q_kalk_1 | II | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok |
| q_zement_1 | III | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok |
| q_glas_1 | II | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok (DIN EN 12150-1) |
| q_glas_2 | II | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok (Ug-Optimum Argon ca. 15–16 mm) |
| q_metall_1 | II | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok (DIN EN 10027-1, DIN EN 10025-2) |
| q_daemm_1 | II | ok | — (freigegeben, nur Vorschlag) | Ratsche; Eindeutigkeit |
| q_kunststoff_1 | II | fraglich | — (freigegeben, nur Vorschlag) | Tippfehler; Ratsche |
| q_rsto_1 | II | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok (RStO 12/24) |
| q_beton_1 | III | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok |
| q_beton_expo | III | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok (DIN 1045-2, Tab. 1) |
| q_massiv_1 | III | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok (DIN EN 1992-1-1/NA, 4.4.1) |
| q_holz_1 | III | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok |
| q_holz_2 | III | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok |
| q_recht_1 | I | ok | — (freigegeben, nur Vorschlag) | Ratsche; fachlich ok (§ 4 Abs. 3, § 13 Abs. 3 VOB/B) |
| q_recht_cpr | II | ok | — (freigegeben, nur Vorschlag) | Ratsche; neue BauPVO seit 07.01.2025 in Kraft (Übergangsfristen) |
| q_einh_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_einh_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_einh_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_einh_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kenn_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kenn_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kenn_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ec0_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ec0_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ec0_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ec0_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bk_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bk_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bk_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bch_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bch_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bch_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bch_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_recht_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_recht_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_recht_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kg_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kg_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kg_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_prob_1 | I | ok | — | § 8 Abs. 1 ErsatzbaustoffV: Probenahme nach LAGA PN 98, DIN 19698 ergänzend (gesetze-im-internet.de) |
| q_prob_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_prob_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_prob_4 | I | ok | — | Verwerfungskriterium (> 20 % der Werte > 25 % vom Median) bestätigt (TUM-ZfP-Wiki zu DIN EN 12504-2) |
| q_prob_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mp_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mp_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mp_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mp_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mp_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_an_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_an_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_an_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_an_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_an_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mech_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mech_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mech_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mech_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mech_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_lab_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_lab_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_lab_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_lab_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_lab_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_stat_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_stat_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_stat_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_fbs_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_fbs_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_form_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_form_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_form_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_emod_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_emod_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_fest_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bruch_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bruch_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_knick_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_knick_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bstat_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bstat_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_boden_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_boden_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_matm_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_matm_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mk_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mk_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bauphysik_5 | I | korrigiert | Rückmeldung zu Option 4 berichtigt | 1 − 0,25/0,40 ≠ 0,60; 0,60 = 1 − U (R_si vergessen) |
| qn_bauphysik_6 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bp_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bp_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_we_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_fs_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_fs_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_dv_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_dv_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ss_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ss_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bs_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bs_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ea_1 | I | ok | — | Effizienzklassen A+ bis H gelten im GModG fort (Verbraucherzentrale); Anlagennummer im GModG nicht gesondert geprüft. |
| q_ea_2 | I | fraglich | — | Ebner Stolz, Verbraucherzentrale |
| q_bgl_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_grundlagen_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_grundlagen_6 | III | korrigiert | normRef DIN EN 1008 → DIN EN 206 / DIN 1045-2 | Der wirksame Wassergehalt ist in DIN EN 206 (Begriffe, w/z-Wert) definiert, nicht in DIN EN 1008 |
| q_bgl_2 | III | korrigiert | Option 4 und Rückmeldung: 0,64 → 0,65 | 160/248 = 0,645 → gerundet 0,65 |
| q_bdm_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bdm_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mib_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mib_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hee_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hee_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_frb_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_frb_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hyf_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hyf_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_nbh_1 | III | korrigiert | Rückmeldung zu Option 1: „ab 25 °C“ → „ab 15 °C“ | DIN 1045-3, Mindestdauer der Nachbehandlung |
| q_nbh_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_feb_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_feb_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_sbt_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_sbt_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_sob_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_sob_2 | III | korrigiert | Erklärung: veraltete Zeitangabe „Stand Herbst 2024“ entfernt, Zulassung/ZiE ergänzt | DAfStb-Richtlinie „Ultrahochfester Beton“ weiterhin in Arbeit (baunetzwissen, Wikipedia) |
| q_sob_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_sob_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_sob_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_sob_6 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_inw_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_inw_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_qsi_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_qsi_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_qsi_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_qsi_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_qsi_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_exk_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_exk_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_exk_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_exk_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_exk_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_exk_6 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpx_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpx_2 | III | korrigiert | Rückmeldung zu Option 1: „ab 25 °C“ → „ab 15 °C“ | DIN 1045-3, Mindestdauer der Nachbehandlung |
| q_bpx_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpx_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpx_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_stb_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_stb_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_stb_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_stb_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_stb_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_stb_6 | III | korrigiert | Erklärung: Gl. (6.7aDE) vollständig (Längsspannungsterm) | DIN EN 1992-1-1/NA, 6.2.3: cot θ ≤ (1,2 + 1,4 σ_cd/f_cd)/(1 − V_Rd,cc/V_Ed) |
| q_stb_7 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_stb_8 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_stb_9 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_wub_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_wub_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_wub_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_wub_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_wub_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_cbm_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_cbm_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_cbm_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_cbm_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ges_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ges_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ges_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ges_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mwk_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mwk_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mwk_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mwk_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_pum_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_pum_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_pum_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_pum_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_gip_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_gip_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_gip_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kal_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kal_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kal_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_leh_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_leh_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_leh_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_erd_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_erd_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_erd_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_gla_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_gla_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_gla_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_sta_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_sta_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_sta_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_sta_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_met_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_met_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_met_3 | II | korrigiert | Erklärung präzisiert (Reinzink ≈ 30, Titanzink ≈ 22 · 10⁻⁶/K) | Titanzink hat in Walzrichtung nur ≈ 22 · 10⁻⁶/K (< Aluminium); die alte Erklärung widersprach der Lösung |
| q_hwk_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hwk_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hwk_3 | II | fraglich | — | Aktualität (EU-Recht, measurlabs.com) |
| q_dms_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_dms_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_dms_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hol_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hol_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hol_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hol_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_naw_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_naw_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_naw_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_asp_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_asp_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_asp_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kun_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kun_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kun_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mat_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mat_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mat_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mat_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mat_5 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_mat_6 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_komb_sandwich_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_komb_vhf_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_aus_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_aus_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_aus_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_fvb_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_fvb_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_son_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_son_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpi_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpi_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bin_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bin_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bin_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bre_1 | II | korrigiert | Lösung sprachlich präzisiert | „die Leistungen gelten“ war unklar; CE = Übereinstimmung mit der erklärten Leistung (BauPVO) |
| q_bre_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bre_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bbt_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bbt_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bft_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bft_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bbw_1 | II | korrigiert | Lösung: „Mittel“ → „Charakteristisch“; Rückmeldung 3 und Erklärung angepasst | DIN EN 1338: charakteristische Spaltzugfestigkeit T ≥ 3,6 MPa, kein Einzelwert < 2,9 MPa, Bruchlast ≥ 250 N/mm |
| q_bbw_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bmw_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bmw_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bdf_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bdf_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_vwb_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_vwb_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_vwb_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_vwb_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_btb_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_btb_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_btb_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpe_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpe_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bab_1 | II | ok | — | Klassenbezeichnungen nach DIN 18533-1:2017-07; die Registry führt DIN 18533-1:2026-06 – Abgleich der Klassen offen (Normen-Check Oktober 2026). |
| q_bab_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bab_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpd_1 | II | korrigiert | Rückmeldung: GEG → GModG/GEG | GModG seit 29.07.2026 (Registry) |
| q_bpd_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpd_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bbf_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bbf_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bks_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bks_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bfl_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bfl_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bfl_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bzm_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bzm_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bzm_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bph_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bph_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpk_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpk_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpm_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpm_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpg_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpg_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpl_1 | II | ok | — | DIN 18940:2023-06 bestätigt (DIN Media) |
| q_bpl_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpt_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bpt_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bps_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_bps_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kmb_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_kmb_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hbx_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hbx_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_hbx_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_iax_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_iax_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_iax_3 | III | ok | — | Bodengleich gefliester Dusche im privaten Bereich = W2-I bestätigt (haustechnikdialog zu DIN 18534-1) |
| q_iax_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ksx_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ksx_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_ksx_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_esx_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_esx_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| q_esx_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_baustoffkunde_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_baustoffkunde_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_baustoffkunde_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_einheiten_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_einheiten_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_baustoffkenngroessen_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_baustoffkenngroessen_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bauchemie_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bauchemie_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_probenahme_1 | I | korrigiert | Distraktor 4 und Rückmeldung: Rechenweg passte nicht (1,0 g ≠ 0,785 cm³) | V = π · 0,5² · 1,0 = 0,785 cm³ |
| qn_messen_pruefen_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_mechanische_pruefungen_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_statistik_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_statistik_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_statistik_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festbeton_statistik_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festbeton_statistik_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festbeton_statistik_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festbeton_statistik_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_mechanische_kenngroessen_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_mechanische_kenngroessen_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_mechanische_kenngroessen_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_mechanische_kenngroessen_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_formaenderungen_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_formaenderungen_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_formaenderungen_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_materialmodelle_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_materialmodelle_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_materialmodelle_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_materialmodelle_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_emodul_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_emodul_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_emodul_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_emodul_4 | I | korrigiert | Distraktor 4 und Rückmeldung: 54,7 GPa folgt aus 50/30 (f_ck), nicht aus f_cm | 32,8 · 50/30 = 54,7; 32,8 · 58/38 = 50,1 |
| qn_baustatik_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_baustatik_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_baustatik_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_baustatik_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_knicken_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_knicken_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_knicken_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_knicken_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bruchmechanik_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bruchmechanik_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bruchmechanik_3 | I | korrigiert | Distraktor 4: 2520 → 1153 MPa√m (passend zur Rückmeldung „a in mm“) | 1,12 · 150 · √(π · 15) = 1153; 2520 = Y · σ · a ohne Wurzel |
| qn_bruchmechanik_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bodenmechanik_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bodenmechanik_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bodenmechanik_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bodenmechanik_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bauphysik_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bauphysik_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bauphysik_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bauphysik_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_feuchteschutz_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_feuchteschutz_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_feuchteschutz_3 | I | korrigiert | Erklärung: verschachtelte Rechnung entwirrt | Einzelwerte 0,125 / 3,0 / 0,16 / 0,96 m |
| qn_feuchteschutz_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_daemmung_vergleich_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_daemmung_vergleich_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_daemmung_vergleich_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_daemmung_vergleich_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_schallschutz_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_schallschutz_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_schallschutz_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_schallschutz_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_energieausweis_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_energieausweis_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_energieausweis_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_energieausweis_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festigkeit_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festigkeit_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festigkeit_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festigkeit_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festigkeit_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_gesteine_1 | II | korrigiert | Distraktor 1: 6,06 → 5,06 (Summe der Durchgänge = 506) | 5 + 14 + 25 + 38 + 52 + 72 + 3 · 100 = 506 |
| qn_gesteine_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_mauerwerk_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_mauerwerk_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_putzemoertel_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_putzemoertel_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_gips_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_gips_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_gips_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_kalk_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_kalk_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_lehm_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_lehm_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_lehm_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_erdbau_1 | II | korrigiert | Distraktor 3: 97,6 % → 95,5 % (passend zum genannten Fehler ρ · (1 − w)) | 2,10 · 0,90/1,98 = 95,5 % |
| qn_erdbau_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_erdbau_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_glas_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_glas_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_glas_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_stahl_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_stahl_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_metalle_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_metalle_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_metalle_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holz_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holz_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzwerkstoffe_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzwerkstoffe_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzwerkstoffe_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_nawaro_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_nawaro_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_nawaro_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_asphalt_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_asphalt_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_asphalt_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_kunststoffe_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_kunststoffe_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_kunststoffe_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_ausbau_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_ausbau_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_ausbau_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_sonstiges_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_sonstiges_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_sonstiges_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_sonstiges_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_innovationen_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_innovationen_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_innovationen_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_recht_konformitaet_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_recht_konformitaet_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_recht_konformitaet_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_recht_konformitaet_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_recht_konformitaet_5 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_recht_konformitaet_6 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_betonfertigteile_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_betonfertigteile_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_betonfertigteile_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_betonfertigteile_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_betonwaren_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_betonwaren_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_betonwaren_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_betonwaren_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_mauerwerk_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_mauerwerk_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_mauerwerk_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_mauerwerk_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_dach_fassade_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_dach_fassade_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_dach_fassade_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_dach_fassade_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_rsto_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_asphalt_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_asphalt_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_asphalt_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_asphalt_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_asphalt_5 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_asphalt_6 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_bitumen_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_bitumen_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_bitumen_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_bitumen_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_bitumen_5 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_bitumen_6 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_pruefung_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_pruefung_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_pruefung_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_pruefung_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_pruefung_5 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_pruefung_6 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_betondecken_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_betondecken_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_betondecken_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_betondecken_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_betondecken_5 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_betondecken_6 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_tiefbau_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_tiefbau_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_tiefbau_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_tiefbau_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_tiefbau_5 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_tiefbau_6 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_bahn_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_bahn_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_bahn_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_bahn_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_bahn_5 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_bahn_6 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_tunnel_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_tunnel_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_tunnel_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_tunnel_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_tunnel_5 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_verkehr_tunnel_6 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_trockenbau_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_trockenbau_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_trockenbau_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_putz_estrich_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_putz_estrich_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_putz_estrich_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_putz_estrich_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_abdichtung_1 | II | ok | — | Klassenbezeichnungen nach DIN 18533-1:2017-07; die Registry führt DIN 18533-1:2026-06 – Abgleich der Klassen offen (Normen-Check Oktober 2026). |
| qn_bp_abdichtung_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_abdichtung_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_daemmung_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_daemmung_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_befestigung_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_befestigung_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_befestigung_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_befestigung_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_klebstoffe_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_klebstoffe_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_klebstoffe_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_klebstoffe_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_farben_lacke_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_farben_lacke_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_farben_lacke_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_betonzusatzmittel_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_betonzusatzmittel_2 | II | korrigiert | Rückmeldung zu Option 4 präzisiert | 150/306 = 0,490; 0,502 = 153,6/306 |
| qn_bp_betonzusatzmittel_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_holzprodukte_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_holzprodukte_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_holzprodukte_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_holzprodukte_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_kunststoffe_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_kunststoffe_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_kunststoffe_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_mineralisch_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_mineralisch_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_mineralisch_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_mineralisch_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_glaeser_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_glaeser_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_lehmbauprodukte_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_lehmbauprodukte_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_lehmbauprodukte_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_lehmbauprodukte_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_metallisch_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_metallisch_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bp_metallisch_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_grundlagen_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_grundlagen_2 | III | fraglich | — | Ausgabe weicht von Registry ab |
| qn_grundlagen_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_grundlagen_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bindemittel_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bindemittel_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_bindemittel_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_mischungsberechnung_1 | III | korrigiert | Rückmeldung zu Option 3: 177,5 = 170 + Kernfeuchte | 750 · 0,01 = 7,5 kg/m³ |
| qn_mischungsberechnung_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_mischungsberechnung_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_mischungsberechnung_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_herstellung_einbau_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_herstellung_einbau_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_herstellung_einbau_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_herstellung_einbau_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_frischbeton_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_frischbeton_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_frischbeton_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_frischbeton_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_nachbehandlung_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_nachbehandlung_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_nachbehandlung_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_nachbehandlung_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festbeton_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festbeton_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festbeton_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_festbeton_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_betonkennwerte_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_betonkennwerte_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_betonkennwerte_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_betonkennwerte_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_betonkennwerte_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_betonkennwerte_6 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_sichtbeton_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_sichtbeton_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_sichtbeton_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_sichtbeton_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_innovative_werkstoffe_1 | III | korrigiert | Rückmeldung: „Tresca“ → „von Mises“ | τ = σ/√3 ist das von-Mises-Kriterium (Tresca: σ/2) |
| qn_innovative_werkstoffe_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_innovative_werkstoffe_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_innovative_werkstoffe_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_betonpraxis_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_wu-bauwerke_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_carbonbeton_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_carbonbeton_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_konstruktion_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_konstruktion_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_konstruktion_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_konstruktion_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_konstruktion_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_konstruktion_6 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_bemessung_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_bemessung_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_bemessung_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_bemessung_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_bemessung_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_bemessung_6 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_verbindung_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_verbindung_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_verbindung_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_verbindung_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_verbindung_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_verbindung_6 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_bauphysik_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_bauphysik_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_bauphysik_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_bauphysik_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_bauphysik_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_holzbau_bauphysik_6 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_innenausbau_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_innenausbau_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_spannbeton_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_spannbeton_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_spannbeton_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_spannbeton_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_spannbeton_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_spannbeton_6 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_spannbeton_7 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_spannbeton_8 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_spannbeton_9 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_spannbeton_10 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_stahlbau_ec3_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_stahlbau_ec3_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_stahlbau_ec3_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_stahlbau_ec3_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_stahlbau_ec3_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_stahlbau_ec3_6 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_stahlbau_ec3_7 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_stahlbau_ec3_8 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_keramik_ziegel_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_keramik_ziegel_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_keramik_ziegel_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_keramik_ziegel_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_keramik_ziegel_5 | II | ok | — | DIN 105-100:2012-01 zurückgezogen, ersetzt durch DIN 105-4:2019-01 und DIN 105-41:2019-01 (DIN Media) |
| qn_keramik_ziegel_6 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_keramik_ziegel_7 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_membranen_etfe_1 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_membranen_etfe_2 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_membranen_etfe_3 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_membranen_etfe_4 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_membranen_etfe_5 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_membranen_etfe_6 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_membranen_etfe_7 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_membranen_etfe_8 | II | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_sommerlicher_waermeschutz_1 | I | ok | — | Ausgabe 2013-02 bewusst zitiert (§ 14 GModG nimmt sie in Bezug); die Registry führt die Neuausgabe DIN 4108-2:2026-05 – der Abgleich der Tabellenwerte ist modulweit noch offen. |
| qn_sommerlicher_waermeschutz_2 | I | ok | — | Ausgabe 2013-02 bewusst zitiert (§ 14 GModG nimmt sie in Bezug); die Registry führt die Neuausgabe DIN 4108-2:2026-05 – der Abgleich der Tabellenwerte ist modulweit noch offen. |
| qn_sommerlicher_waermeschutz_3 | I | ok | — | Ausgabe 2013-02 bewusst zitiert (§ 14 GModG nimmt sie in Bezug); die Registry führt die Neuausgabe DIN 4108-2:2026-05 – der Abgleich der Tabellenwerte ist modulweit noch offen. |
| qn_sommerlicher_waermeschutz_4 | I | ok | — | Ausgabe 2013-02 bewusst zitiert (§ 14 GModG nimmt sie in Bezug); die Registry führt die Neuausgabe DIN 4108-2:2026-05 – der Abgleich der Tabellenwerte ist modulweit noch offen. |
| qn_sommerlicher_waermeschutz_5 | I | ok | — | Ausgabe 2013-02 bewusst zitiert (§ 14 GModG nimmt sie in Bezug); die Registry führt die Neuausgabe DIN 4108-2:2026-05 – der Abgleich der Tabellenwerte ist modulweit noch offen. |
| qn_sommerlicher_waermeschutz_6 | I | ok | — | Ausgabe 2013-02 bewusst zitiert (§ 14 GModG nimmt sie in Bezug); die Registry führt die Neuausgabe DIN 4108-2:2026-05 – der Abgleich der Tabellenwerte ist modulweit noch offen. |
| qn_sommerlicher_waermeschutz_7 | I | ok | — | Ausgabe 2013-02 bewusst zitiert (§ 14 GModG nimmt sie in Bezug); die Registry führt die Neuausgabe DIN 4108-2:2026-05 – der Abgleich der Tabellenwerte ist modulweit noch offen. |
| qn_sommerlicher_waermeschutz_8 | I | ok | — | Ausgabe 2013-02 bewusst zitiert (§ 14 GModG nimmt sie in Bezug); die Registry führt die Neuausgabe DIN 4108-2:2026-05 – der Abgleich der Tabellenwerte ist modulweit noch offen. |
| qn_biokohlebeton_1 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_biokohlebeton_2 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_biokohlebeton_3 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_biokohlebeton_4 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_biokohlebeton_5 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_biokohlebeton_6 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_biokohlebeton_7 | III | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_potentialmessung_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_potentialmessung_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_potentialmessung_3 | I | korrigiert | Distraktoren 1, 2, 4 neu (alte Werte folgten nicht aus den genannten Fehlern) | 0,040/10 = 0,004 ≠ 0,06; Kehrwert von 1,0 ist 1,0 ≠ 25; 2,34 · 58,44 = 137 ≠ 58 |
| qn_labor_potentialmessung_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_potentialmessung_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_potentialmessung_6 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_auslagerung_1 | I | korrigiert | Rückmeldung zu Option 1 berichtigt; Distraktor 3: 1000 → 780 µm/a | 9,9 µm/a = Umrechnungsfehler cm → µm (Faktor 10); ohne Dichte: 0,24/40 cm · 365/28 = 782 µm/a |
| qn_labor_auslagerung_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_auslagerung_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_auslagerung_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_auslagerung_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_auslagerung_6 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_frischbeton_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_frischbeton_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_frischbeton_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_frischbeton_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_frischbeton_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_frischbeton_6 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_druckfestigkeit_1 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_druckfestigkeit_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_druckfestigkeit_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_druckfestigkeit_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_druckfestigkeit_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_druckfestigkeit_6 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_moertelprismen_1 | I | korrigiert | Distraktoren 2 und 3 neu (3,0 und 12,0 MPa folgten aus keinem genannten Fehler) | R_f = 1,5 · 3200 · 100/40³ = 7,5; ohne 1,5 → 5,0; mit F/2 → 3,75 |
| qn_labor_moertelprismen_2 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_moertelprismen_3 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_moertelprismen_4 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_moertelprismen_5 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |
| qn_labor_moertelprismen_6 | I | ok | — | Antwort, Distraktoren, Rückmeldungen und Rechenweg geprüft; stimmig |

## Quellen der Websuche

- § 8 ErsatzbaustoffV: https://www.gesetze-im-internet.de/ersatzbaustoffv/__8.html
- DIN EN 12504-2 (Verwerfungskriterium): https://collab.dvb.bayern/spaces/TUMzfp/pages/1306514985/Rebound+Hammer+new
- GModG: https://www.ebnerstolz.de/de/unser-angebot/leistungen/rechtsberatung/energierecht/gebaeudemodernisierungsgesetz-verabschiedet-109427.html, https://www.verbraucherzentrale.de/wissen/energie/energetische-sanierung/geg-was-steht-im-neuen-gebaeudeenergiegesetz-13886
- DIN 18940:2023-06: https://dinmedia.de/en/standard/din-18940/366675039
- DIN 18534-1, bodengleiche Dusche W2-I: https://www.haustechnikdialog.de/News/20645/Ausfuehrungssicherheit-fuer-bodengleiche-Duschen-mit-AIV-durch-DIN-18534
- UHPC/DAfStb-Richtlinie: https://www.baunetzwissen.de/beton/fachwissen/betonarten/ultrahochleistungsbeton-150988, https://de.wikipedia.org/wiki/Ultrahochfester_Beton
- REACH Anhang XVII Nr. 77: https://measurlabs.com/de/blog/formaldehydtests-und-vorschriften-in-der-eu/
- DIN 105-100 (zurückgezogen): https://www.dinmedia.de/de/norm/din-105-100/147432690
- DIN 1045-3 Nachbehandlungstabelle: https://www.mpa-hannover.de/wp-content/uploads/2020/05/2020-05-07-Nachbehandlung-mit-ZTV.pdf
