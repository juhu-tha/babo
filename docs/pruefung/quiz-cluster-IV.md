# Prüfliste Quiz – Cluster IV: Bestand & Nachhaltigkeit

Stand: 03.11.2026 · Grundlage: `src/data/quiz.json` (Felder `vorpruefung` und `verified`), `docs/quiz-pruefhinweise.md`, Lernziele aus `src/data/lernziele.ts`. Erzeugt mit `npx tsx scripts/pruefliste.ts`; gesetzte Kreuze übernimmt das Skript beim nächsten Lauf. quiz.json wurde für diese Liste nicht verändert.

Cluster IV umfasst 350 Fragen aus 50 Modulen. Aufgeführt sind 142 auffällige Fragen (Vorprüfung „korrigiert“ oder „fraglich“, offener Prüfhinweis oder neu seit 26.10.2026 ohne Freigabe) und eine Stichprobe von 5 unauffälligen Fragen. Entscheidung je Frage ankreuzen; bei „ändern“ den Änderungswunsch in die Zeile darunter schreiben.

Auffällig im Einzelnen (Mehrfachnennung möglich): 87 korrigiert, 4 fraglich, 11 mit offenem Prüfhinweis, 48 neu seit 26.10.2026.

## A. Auffällige Fragen

### q_ab_7 · Abfälle & Altlasten

- **Frage:** Ein Abbruchunternehmen will asbesthaltige Platten mit unbelastetem Bauschutt mischen, um den Asbestgehalt des Gemischs unter einen Zuordnungswert zu drücken. Wie ist das zu bewerten?
- **Richtige Antwort:** Unzulässig: Für gefährliche Abfälle gilt das Vermischungsverbot (§ 9a KrWG)
- **Auffälligkeit:** Vorprüfung „korrigiert“: Rechtsquellen-Prüfung 03.11.: Normverweis „GefStoffV Anhang II“ → „GefStoffV § 11 Abs. 1“ (Asbestverbote seit der Novelle vom 05.12.2024 in § 11, Anhang II Nr. 1 weggefallen; Feld „quelle“ nannte es bereits richtig); Antwort unverändert – korrigiert
- [ ] ok
- [ ] ändern: …

### q_bst_1 · Altbauatlas

- **Frage:** Warum steigt bei einer Innendämmung das Risiko von Tauwasser an der Grenzschicht zur Bestandswand?
- **Richtige Antwort:** Weil die Bestandswand kälter wird und Raumluftfeuchte bis zu ihr diffundiert
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_bst_2 · Altbauatlas

- **Frage:** Ab welchem Umfang greifen die Höchstwerte nach Anlage 7 GModG bei der Änderung eines Außenbauteils?
- **Richtige Antwort:** Wenn mehr als 10 % der gesamten jeweiligen Bauteilfläche geändert werden
- **Auffälligkeit:** Prüfhinweis: GModG §§ 35, 36, 105 und Anlage 7 – Rechtsstand. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_bst_3 · Altbauatlas

- **Frage:** Eine Bestandswand hat U = 1,40 W/(m²K). Sie erhält 12 cm Dämmung mit λ = 0,035 W/(m·K). Wie groß ist der neue U-Wert ungefähr?
- **Richtige Antwort:** 0,24 W/(m²K)
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 28.10. (Runde 3): Rückmeldungen zu 0,29 und 0,35 W/(m²K) korrigiert (0,29 ist der Wert ohne R_alt, 0,35 entspräche rund 7,5 cm Dämmung) – korrigiert
- [ ] ok
- [ ] ändern: …

### q_bst_5 · Altbauatlas

- **Frage:** In einer Außenwandecke wird bei θ_i = 20 °C und θ_e = −5 °C eine Oberflächentemperatur von θ_si = 11,5 °C bestimmt. Ist der Mindestwärmeschutz nach DIN 4108-2:2013-02 (f_Rsi ≥ 0,70) eingehalten?
- **Richtige Antwort:** Nein, denn f_Rsi = (11,5 + 5)/(20 + 5) = 0,66 liegt unter 0,70
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 29.10.: Ausgabe DIN 4108-2:2013-02 im Fragetext genannt (Neuausgabe 2026-05 erschienen, Zahlenwert öffentlich nicht prüfbar); Erklärung: aus f_Rsi = 0,70 folgen bei −5/20 °C 12,5 °C, 12,6 °C ist der Wert des 80-%-Kriteriums – korrigiert
- [ ] ok
- [ ] ändern: …

### q_bwe_1 · Bauwerkserfassung

- **Frage:** Wofür ist ein verformungsgetreues Aufmaß bei einem historischen Dachstuhl besonders wichtig?
- **Richtige Antwort:** Es erfasst Ist-Querschnitte und Vorverformungen für die statische Nachrechnung
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_bwu_1 · Bauwerksdiagnose & ZfP

- **Frage:** Ein 36 Jahre altes Bauteil hat eine Karbonatisierungstiefe von 15 mm. Bei welchem Bauteilalter erreicht die Front nach dem √t-Gesetz eine Betondeckung von 25 mm?
- **Richtige Antwort:** bei einem Alter von ca. 100 Jahren
- **Auffälligkeit:** Prüfhinweis: „nach ca. 100 Jahren“ (Bauteilalter) eindeutig formulieren. · bereits freigegeben (verified)
- [ ] ok
- [x] ändern: Bezugszeitpunkt eindeutig (Bauteilalter) formuliert, korrigiert

### q_cl_2 · Checklisten

- **Frage:** Wie wird der korrosionsauslösende Chloridgehalt im Rahmen einer Instandsetzungsplanung festgelegt?
- **Richtige Antwort:** Objektspezifisch durch den sachkundigen Planer; Orientierung oft 0,5 M.-% bez. auf Zement
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_dauer_2 · Typische Bauschäden & Schadensanalyse

- **Frage:** Was kennzeichnet die gefürchtete Lochfraßkorrosion (Pitting) an Bewehrungsstahl durch Chlorideintrag?
- **Richtige Antwort:** Örtlicher Durchbruch der Passivschicht mit tiefen Löchern, oft ohne Vorwarnung am Beton
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: Hinweistext „kritische Chloridgehalte 0,4–0,5 M.-%“ korrigiert – 0,40 M.-% ist die Herstellungsgrenze Cl 0,40 (DIN EN 206/DIN 1045-2), Bewertungswert ≈ 0,5 M.-% bez. auf Zement (Breit et al. 2011, DAfStb-Richtlinie); Frage und Antworten unverändert; Bloom-Stufe, Niveau und Rückmeldungen zu den Distraktoren ergänzt – korrigiert · Zweitprüfung 27.10. (Runde 2): richtige Option gekürzt (Längenverhältnis 2,5 → ≈ 1,0), Distraktor „ausschließlich bei Minustemperaturen im Vakuum“ (Absolutwort, unplausibel) durch Depassivierung infolge Karbonatisierung ersetzt, Rückmeldungen angepasst – korrigiert
- [ ] ok
- [ ] ändern: …

### q_dc_1 · Checklisten

- **Frage:** Ein Bauteil ist XC4, XD1 und XF2 (LP) zugeordnet. Welcher maximale w/z-Wert ist maßgebend?
- **Richtige Antwort:** 0,55
- **Auffälligkeit:** Vorprüfung „korrigiert“: Rückmeldung zu Option 2: 0,45 gilt für XD3/XS3, nicht für XF4 (dort 0,50 mit LP, DIN 1045-2 Tab. F.2.1). · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_dc_2 · Checklisten

- **Frage:** Welcher Rechenwert der Rissbreite gilt nach deutschem NA für Stahlbeton in XD- und XS-Klassen?
- **Richtige Antwort:** 0,3 mm
- **Auffälligkeit:** Prüfhinweis: bereits korrigiert – bitte bestätigen. · Prüfhinweis: korrigiert auf 0,3 mm – bestätigen. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_dc_3 · Checklisten

- **Frage:** Betondeckungsmessung an einer XD1-Wand: Mittelwert 47 mm, Standardabweichung 4,5 mm. Wie groß ist das 5-%-Quantil und was folgt?
- **Richtige Antwort:** ≈ 39,6 mm – knapp unter c_min = 40 mm
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 28.10. (Runde 3): Distraktor 33,0 mm auf 33,5 mm berichtigt (47 − 3 · 4,5 = 33,5 mm), Rückmeldung angepasst – korrigiert
- [ ] ok
- [ ] ändern: …

### q_dp_1 · Denkmalpflege

- **Frage:** Welche Eigenschaft sollte ein Fugenmörtel für historisches Mauerwerk im Verhältnis zum Stein haben?
- **Richtige Antwort:** Geringere Festigkeit und höhere Porosität als der Stein (Opfermörtel)
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_dp_2 · Denkmalpflege

- **Frage:** Was regelt § 105 GModG für Baudenkmäler?
- **Richtige Antwort:** Abweichungen, soweit Anforderungen Substanz oder Erscheinungsbild beeinträchtigen
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · Prüfhinweis: GModG §§ 35, 36, 105 und Anlage 7 – Rechtsstand. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_hb_2 · Hist. Bauweisen

- **Frage:** Warum ist das Schwindmaß von Holz bei der Sanierung von Holzbalkendecken relevant?
- **Richtige Antwort:** Austrocknung verändert Querschnitte und Verbindungen, quer zur Faser stärker als längs
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ho_1 · Holzkorrosion

- **Frage:** Welche Gebrauchsklasse gilt für einen Holzpfahl mit ständigem Erdkontakt?
- **Richtige Antwort:** GK 4
- **Auffälligkeit:** Vorprüfung „korrigiert“: Abgleich 02.11.: Rückmeldung zu GK 3.2 nannte die ungeschützte Fassadenschalung als Beispiel; nach der GK-Matrix des Moduls (und qn_holzkorrosion_4) ist eine senkrechte Fassade GK 3.1 (Wasser läuft rasch ab), GK 3.2 gilt bei Wasseranlagerung – korrigiert
- [ ] ok
- [ ] ändern: …

### q_hp_1 · Hist. Bauprodukte

- **Frage:** Eine Raumluftmessung ergibt 1400 ng/m³ PCB. Wie ist das nach PCB-Richtlinie einzuordnen?
- **Richtige Antwort:** Zwischen Vorsorge- und Eingreifwert (300–3000 ng/m³): Quelle suchen, mittelfristig sanieren
- **Auffälligkeit:** Vorprüfung „korrigiert“: Umsetzung 02.11.: Erklärung um die AIR-Richtwerte 2025 ergänzt (RW I 80, RW II 800 ng/m³ PCB gesamt; Bundesgesundheitsblatt 2025, 68:201–218; Quiz-Abgleich 30.10.) – korrigiert
- [x] ok
- [ ] ändern: …

### q_is_cl_2 · Instandsetzungs-Checklisten

- **Frage:** Warum muss der Instandsetzungsmörtel frisch in frisch auf die Haftbrücke aufgetragen werden?
- **Richtige Antwort:** Weil eine angetrocknete Haftbrücke als Trennschicht wirkt und der Verbund versagt
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_is_wta_1 · WTA-Merkblätter

- **Frage:** Welche Aufgabe hat ein Sanierputzsystem nach WTA 2-9?
- **Richtige Antwort:** Salze im Putz einlagern, Feuchte verdampfen lassen; Oberfläche trocken, salzfrei
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_lca_1 · Ökobilanzierung (LCA & EPD)

- **Frage:** Warum deklarieren Umweltproduktdeklarationen (EPDs) nachwachsender Rohstoffe wie Holz oder Stroh in Phase A1-A3 oft negative GWP-Werte?
- **Richtige Antwort:** Weil Bäume während des Wachstums CO2 via Photosynthese absorbieren und als biogenen Kohlenstoff physisch im Bauteil speichern (temporäre Kohlenstoffsenke).
- **Auffälligkeit:** Vorprüfung „korrigiert“: Umsetzung 02.11.: Erklärung zum biogenen Kohlenstoff nach DIN EN 15804+A2 berichtigt (Ausbuchung bei Verlassen des Produktsystems, auch bei stofflicher Verwertung; ÖKOBAUDAT Grundsätze Anhang B, Nachstichprobe 3) – korrigiert
- [ ] ok
- [ ] ändern: …

### q_mo_1 · Materialoptimierung

- **Frage:** Welche Maßnahme senkt das GWP (A1–A3) von Transportbeton meist am stärksten?
- **Richtige Antwort:** Geringerer Klinkeranteil, z. B. CEM III/A statt CEM I
- **Auffälligkeit:** Vorprüfung „korrigiert“: Umsetzung 29.10.: Lehrbeispiel mit Zement-GWP CEM I 0,665 (VDZ-Branchen-EPD) und CEM III/A 0,40 kg/kg neu gerechnet (T15-NH-3) – korrigiert · Umsetzung 30.10.: Lehrbeton C30/37 mit einheitlichem Restanteil 45 kg/m³ (258/173 statt 243/158) – korrigiert
- [ ] ok
- [ ] ändern: …

### q_mod_2 · Modernisierung & GModG

- **Frage:** Welche Regelung trifft das GModG für ungedämmte oberste Geschossdecken beheizter Räume?
- **Richtige Antwort:** Nachrüstpflicht mit U ≤ 0,24 W/(m²K) (§ 35, vormals § 47 GEG)
- **Auffälligkeit:** Prüfhinweis: GModG §§ 35, 36, 105 und Anlage 7 – Rechtsstand. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ms_mg_1 · Große Materialschäden & Einstürze

- **Frage:** Welcher Schädigungsmechanismus gilt als wesentliche Ursache des Teileinsturzes der Carolabrücke Dresden (2024)?
- **Richtige Antwort:** Wasserstoffinduzierte Spannungsrisskorrosion des Spannstahls
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ms_mo_1 · Tragwerksmonitoring (SHM)

- **Frage:** Was deutet eine lokal deutlich verringerte Ultraschallgeschwindigkeit in einem Betonbauteil an?
- **Richtige Antwort:** Gefügestörung, z. B. Kiesnest, Hohlraum, Riss
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ms_mo_2 · Tragwerksmonitoring (SHM)

- **Frage:** Darf ein installiertes Dauermonitoring die Hauptprüfung nach DIN 1076 ersetzen?
- **Richtige Antwort:** Nein, Monitoring ergänzt die handnahe Prüfung, ersetzt sie aber nicht
- **Auffälligkeit:** Prüfhinweis: „DIN 1076:2026-01“ nicht bestätigt. · Normenabgleich: DIN 1076:2026-01: DIN Media nennt DIN 1076:2026-01 → Ausgabe bestätigt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ms_sc_2 · Schadensaufnahme-Checklisten

- **Frage:** Warum gibt man bei Mauerwerk neben dem Feuchtegehalt den Durchfeuchtungsgrad an?
- **Richtige Antwort:** Erst der Bezug auf die maximale Wasseraufnahme macht Baustoffe vergleichbar
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ms_sc_3 · Schadensaufnahme-Checklisten

- **Frage:** Bohrmehlprobe: feucht 85,0 g, darrtrocken 80,2 g, maximale Wasseraufnahme 15,0 M.-%. Wie groß ist der Durchfeuchtungsgrad?
- **Richtige Antwort:** 40 %
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 28.10. (Runde 3): Distraktor 37 % auf 38 % berichtigt (Bezug auf Feuchtmasse: 5,65/15,0 = 38 %), Rückmeldung angepasst – korrigiert
- [ ] ok
- [ ] ändern: …

### q_ms_tb_1 · Typische Bauschäden

- **Frage:** Warum darf ein Riss nicht ohne Weiteres kraftschlüssig verpresst werden?
- **Richtige Antwort:** Ein aktiver Riss reißt daneben neu auf; erst Ursache und Rissbewegung klären
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ms_zb_1 · Zustandsbewertung

- **Frage:** Wann findet nach DIN 1076 die Einfache Prüfung statt?
- **Richtige Antwort:** Drei Jahre nach einer Hauptprüfung
- **Auffälligkeit:** Prüfhinweis: „DIN 1076:2026-01“ nicht bestätigt. · Normenabgleich: DIN 1076:2026-01: DIN Media nennt DIN 1076:2026-01 → Ausgabe bestätigt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ms_zb_2 · Zustandsbewertung

- **Frage:** Welche rechtliche Stellung hat die VDI 6200?
- **Richtige Antwort:** Private Richtlinie, die als anerkannte Regel der Technik Eigentümerpflichten konkretisiert
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ndr_2 · Daten & Regeln

- **Frage:** Wie ist der Rechtsstand des „Gebäudetyp E“ im Oktober 2026?
- **Richtige Antwort:** Der Entwurf von 2024 ist erledigt; seit 10/2026 liegt ein neuer Entwurf zur Anhörung vor
- **Auffälligkeit:** Vorprüfung „korrigiert“: Rechtsquellen-Prüfung 03.11.: Rückmeldung zu Option 1 „§ 650o BGB war nur im Regierungsentwurf vorgesehen“ → Gebäudetyp-E-Regelung § 650o BGB-E nur im Entwurf; geltender § 650o BGB (abweichende Vereinbarungen beim Verbraucherbauvertrag) besteht seit 2018; Antwort unverändert – korrigiert
- [ ] ok
- [x] ändern: Erklärung präzisiert (Referentenentwurf BMJV 26.10.2026, Frist 09.11.2026; Prognose „Mitte 2027“ ohne Beleg entfernt), korrigiert

### q_rb_1 · Rückbau & Material

- **Frage:** Wie viele Fraktionen von Bau- und Abbruchabfällen sind nach § 8 GewAbfV grundsätzlich getrennt zu halten?
- **Richtige Antwort:** Zehn, u. a. Glas, Kunststoff, Metalle, Holz, Gips, Beton und Ziegel
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_rb_2 · Rückbau & Material

- **Frage:** Was regelt die DIN SPEC 91484?
- **Richtige Antwort:** Pre-Demolition Audit: Erfassung von Bauprodukten vor Abbruch für Anschlussnutzung
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · Prüfhinweis: „DIN SPEC 91525 (2026)“ nicht bestätigt. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_rc_1 · Checklisten

- **Frage:** Mit welchem Vorlauf sind Tätigkeiten mit Asbest der zuständigen Behörde anzuzeigen?
- **Richtige Antwort:** Mindestens eine Woche vor Beginn
- **Auffälligkeit:** Vorprüfung „korrigiert“: Antwort bestätigt (§ 11a Abs. 4 GefStoffV: spätestens eine Woche vor Beginn). Erklärung korrigiert: keine „Genehmigung“ für niedriges/mittleres Risiko, sondern risikoabhängige Anzeige; Zulassung bei hohem Risiko max. 6 Jahre (§ 11a Abs. 3). · Prüfhinweis: GefStoffV 2024 – Genehmigung bzw. Zulassung je Risikobereich prüfen. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_rc_2 · Checklisten

- **Frage:** Eine mobile Brechanlage bricht auf einer Abbruchbaustelle den dort angefallenen Bauschutt (Behandlung am Entstehungsort). Ab wann ist sie nach der 4. BImSchV genehmigungsbedürftig?
- **Richtige Antwort:** Wenn sie länger als zwölf Monate am selben Ort betrieben wird
- **Auffälligkeit:** Prüfhinweis: 4. BImSchV – Zwölf-Monats-Regel vereinfacht. · bereits freigegeben (verified)
- [ ] ok
- [x] ändern: Frage auf Behandlung am Entstehungsort eingegrenzt (sonst gilt § 1 Abs. 1 Satz 2 4. BImSchV: Abfallanlagen Nr. 8 ab dem ersten Tag), korrigiert

### q_rc_4 · Checklisten

- **Frage:** Bei einem kleinen Umbau fallen insgesamt 8 m³ Bau- und Abbruchabfälle an. Was gilt nach § 8 GewAbfV?
- **Richtige Antwort:** Getrennt sammeln ist Pflicht, die Dokumentationspflicht entfällt bis 10 m³
- **Auffälligkeit:** Vorprüfung „korrigiert“: Umsetzung 29.10.: Paragrafenprüfung – Distraktor-Rückmeldung „Teil 3 … §§ 8 bis 10“ auf „Abschnitt 3 … §§ 8 und 9“ berichtigt (gesetze-im-internet.de, GewAbfV); Antwort unverändert – korrigiert
- [ ] ok
- [ ] ändern: …

### q_re_2 · Ressourceneffizienz

- **Frage:** Was besagt § 14 Abs. 2 KrWG für nicht gefährliche Bau- und Abbruchabfälle?
- **Richtige Antwort:** Ein nationales Ziel von mind. 70 Gew.-% stofflicher Verwertung inkl. Verfüllung
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ru_2 · Ressourcen & Umwelt

- **Frage:** Woraus setzt sich der Indikator PENRT zusammen?
- **Richtige Antwort:** PENRE (energetisch) plus PENRM (stofflich), beide nicht erneuerbar
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_sb_2 · Betonkorrosion

- **Frage:** Ein Zement hat 0,25 M.-% Na₂O und 0,95 M.-% K₂O. Wie groß ist das Na₂O-Äquivalent und gilt er als NA-Zement?
- **Richtige Antwort:** 0,88 M.-%, kein NA-Zement
- **Auffälligkeit:** Prüfhinweis: Zementart im Fragetext nennen (0,60 % gilt für CEM I-NA). · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_vdi_1 · Bauwerksprüfung & VDI 6200

- **Frage:** Welches Ziel verfolgt die Richtlinie VDI 6200 'Standsicherheit von Bauwerken' bei der Einstufung in Schadensfolgeklassen (CC1 bis CC3)?
- **Richtige Antwort:** Systematische Definition von Inspektionsintervallen und Prüfungstiefen (fachkundige Sichtprüfung bis eingehende statische Überprüfung) zur Verhinderung plötzlicher Einstürze von Hochbauten (z. B. Hallendächern).
- **Auffälligkeit:** Vorprüfung „korrigiert“: Umsetzung 02.11.: Erklärung nach Modultext: CC3 = Versammlungsstätten > 5000 Personen, Stadien; Sporthallen und Industriebauten CC2; eingehende Überprüfung durch besonders fachkundige Person (NS4-VDI-2) – korrigiert
- [ ] ok
- [ ] ändern: …

### q_zs_6 · Zertifizierung & Deklarationen

- **Frage:** Ein Wohngebäude (EH 40, Wärmepumpe) erhält das DGNB-Zertifikat in Gold. Der Bauherr möchte den KfW-Kredit „Klimafreundliches Wohngebäude – mit QNG“. Was gilt?
- **Richtige Antwort:** Zusätzlich müssen die besonderen QNG-Anforderungen erfüllt und zertifiziert sein
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qlz_abfaelle_1 · Abfälle & Altlasten

- **Frage:** Ein homogenes Haufwerk Betonbruch umfasst 250 m³, das Größtkorn beträgt 63 mm. Welchen Beprobungsumfang ergibt der Planer des Moduls nach LAGA PN 98?
- **Richtige Antwort:** 28 Einzel-, 7 Misch-, 7 Laborproben; Einzelprobe mindestens 5 l
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_altholz_urban_mining_1 · Altholz-NIR-Sortierung und Urban Mining

- **Frage:** Eine Stadt will für ein Quartier der 1960er Jahre abschätzen, wie viel Bauholz künftig stofflich verwertbar wird. Welche Bewertung des Vorgehens ist richtig?
- **Richtige Antwort:** Top-down liefert früh Mengen; erst Gebäudepässe oder Begehungen zeigen Qualität und Schadstoffe
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_bauwerksunters_monitoring_1 · Tragwerksmonitoring (SHM)

- **Frage:** Ein Riss in einer Stützwand soll über ein Jahr daraufhin überwacht werden, ob er sich bewegt. Welche Verfahrenswahl ist nach dem Modul am besten begründet?
- **Richtige Antwort:** LVDT-Rissmonitoring mit Datenlogger, Temperatur mitmessen und saisonal deuten
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_bestand_1 · Altbauatlas

- **Frage:** Eine Außenwand (A = 100 m², F_x = 1,0) wird gedämmt, ΔU = 1,16 W/(m²K). Welche jährliche Einsparung (G_t20/15 = 3500 Kd/a) und welche CO₂-Minderung bei Erdgas (0,24 kg/kWh) ergibt der Rechner?
- **Richtige Antwort:** rund 9744 kWh/a und rund 2,3 t CO₂/a
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_bestand_2 · Altbauatlas

- **Frage:** Für eine ungedämmte Altbau-Außenwand (U = 1,40 W/(m²K)) werden verglichen: (A) 12 cm WDVS außen, U_neu ≈ 0,24 W/(m²K); (B) 4 cm Innendämmung ohne Feuchtenachweis, U_neu ≈ 0,55 W/(m²K). Wie ist das zu beurteilen?
- **Richtige Antwort:** Nur A ist konform; B verfehlt 0,24 W/(m²K) und erhöht das Tauwasserrisiko innen
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_boden_materialaufbereitung_1 · Boden- & Materialaufbereitung

- **Frage:** Ein Recyclingwerk möchte auf die Fremdüberwachung verzichten, weil seine tägliche werkseigene Kontrolle bereits Sieblinie und Eluat-Schnelltests umfasst. Wie ist das nach dem Modul zu bewerten?
- **Richtige Antwort:** Nicht zulässig: erst unabhängige, unangekündigte Prüfungen belegen die Güte
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_boden_materialaufbereitung_2 · Boden- & Materialaufbereitung

- **Frage:** Welche Zuordnung von Verordnung und Regelungsinhalt entspricht dem Modul?
- **Richtige Antwort:** EBV: Herstellung, Güteüberwachung und Einbau mineralischer Ersatzbaustoffe
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_dauerhaftigkeit_1 · Dauerhaftigkeit & Korrosionsschutz

- **Frage:** Welche Zuordnung von Maßnahme und Schutzprinzip entspricht dem Modul?
- **Richtige Antwort:** Opferanode als aktiver Schutz, Feuerverzinkung als passive Barriere
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_denkmalpflege_1 · Denkmalpflege

- **Frage:** Ein historisches Ziegelmauerwerk mit Feuchteschäden soll einen neuen Putz erhalten. Welche Planung ist denkmalpflegerisch am besten begründet?
- **Richtige Antwort:** Schadhafte Flächen ergänzen, intakten Altputz sichern, Kalkputz und Silikatfarbe
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_historische_bauweisen_1 · Hist. Bauweisen

- **Frage:** Ein Deckenbalken 14/20 cm liegt im Abstand 0,90 m, Spannweite 4,00 m, Eigenlast 1,5 kN/m², Nutzlast 2,0 kN/m² (charakteristisch). Welche Biegespannung σ_m = M/W ergibt sich als Einfeldträger?
- **Richtige Antwort:** σ_m ≈ 6,75 N/mm²
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_holzkorrosion_1 · Holzkorrosion

- **Frage:** In einem Dachstuhl wird aktiver Befall durch Echten Hausschwamm festgestellt; das Myzel ist bereits ins Mauerwerk gewachsen. Welches Vorgehen begründet das Modul nach DIN 68800-4?
- **Richtige Antwort:** Holz 1,00 m über den Befallsrand absägen, Mauerwerk mit „M“-Mittel sperren, Holz als A IV entsorgen
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_korrosion_1 · Bewehrungskorrosion

- **Frage:** Wie verläuft nach dem Modul die Schädigung durch Bewehrungskorrosion, und welche Besonderheit gilt beim chloridinduzierten Lochfraß?
- **Richtige Antwort:** Depassivierung, Rost mit 2- bis 6-fachem Volumen, Risse, Abplatzung; Lochfraß oft ohne Vorwarnung
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_korrosionsschutz_beschichtungen_1 · Korrosionsschutz durch Beschichtungen

- **Frage:** Ein Stahlträger in Kategorie C4 soll mindestens 40 Jahre geschützt sein. Die Feuerverzinkung hat 85 µm, der Zinkabtrag beträgt 2,1 bis 4,2 µm/a. Genügt die Verzinkung allein?
- **Richtige Antwort:** Nein: Ungünstig nur rund 20 Jahre; ein Duplex-System mit Beschichtung wählen
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_korrosionsschutz_beschichtungen_2 · Korrosionsschutz durch Beschichtungen

- **Frage:** Ein Stahlbauteil im Freien erhält EP-Zinkstaub, EP-Eisenglimmer und eine PUR-Deckbeschichtung. Warum wird oben PUR statt EP verwendet?
- **Richtige Antwort:** PUR ist UV- und farbtonstabil und schützt die darunterliegenden EP-Schichten vor Abbau
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_kreislauf_dpp_1 · Kreislaufwirtschaft & Ressourceneffizienz

- **Frage:** In welcher Rangfolge stehen die R-Strategien im Modul, beginnend mit der höchsten Priorität?
- **Richtige Antwort:** Refuse & Reduce → Reuse → Repair & Refurbish → Recycle → Recover & Dispose
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_kreislauf_dpp_2 · Kreislaufwirtschaft & Ressourceneffizienz

- **Frage:** Warum steht in der Erkundung nach DIN SPEC 91484 die Schadstoffanalyse vor dem Re-Use-Inventar?
- **Richtige Antwort:** Weil nur schadstofffreie, trennbare Bauteile als Re-Use-tauglich gelten können
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_lebenszyklus_kosten_1 · Lebenszyklus & Kosten

- **Frage:** Ein Fensterflügel wird planmäßig nach 30 Jahren ausgetauscht. In welche Kostengruppe der Nutzungskosten nach DIN 18960 gehört dieser Austausch nach dem Modul?
- **Richtige Antwort:** KG 400 Instandsetzungskosten (Soll-Zustand herstellen)
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_material_schaeden_gross_1 · Große Materialschäden & Einstürze

- **Frage:** Eine Halle aus den 1970er-Jahren hat Brettschichtholzbinder mit UF-Klebstoff; das Hallenklima ist feucht (Nutzungsklasse 2). Welche Folgerung aus dem Fall Bad Reichenhall ist nach dem Modul am besten begründet?
- **Richtige Antwort:** UF eignet sich nur für NKL 1; Binder untersuchen und regelmäßig nach VDI 6200 prüfen
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_metallkorrosion_1 · Metallkorrosion

- **Frage:** In der Korrosionssimulation des Moduls wird die Umgebung von „Trocken“ über „Feucht“ bis „Salzwasser“ umgestellt. Welche Deutung von Rostbildung und Anodenabtrag passt zum Modul?
- **Richtige Antwort:** Trocken kein Abtrag; mit Elektrolyt beginnt er, Chloride steigern die Leitfähigkeit
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_modernisierung_1 · Modernisierung & GModG

- **Frage:** Eine Wand mit U = 1,40 W/(m²K) soll U ≤ 0,24 W/(m²K) erreichen. Wie verhalten sich die erforderlichen Dicken von PUR (λ = 0,024 W/(mK)) und Holzfaser (λ = 0,045 W/(mK))?
- **Richtige Antwort:** PUR rund 8,3 cm, Holzfaser rund 15,5 cm: Die Dicke wächst proportional mit λ
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_nachhaltigkeit_daten_regeln_1 · Daten & Regeln

- **Frage:** Welche Kennzahlen für Deutschland nennt das Modul?
- **Richtige Antwort:** Rund 220–230 Mio. t Bauabfälle jährlich; Flächenziel unter 30 ha/Tag bis 2030
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_nachhaltigkeit_daten_regeln_2 · Daten & Regeln

- **Frage:** Welche Einordnung der Instrumente des deutschen Nachhaltigkeits-Baurechts nach Verbindlichkeit ist richtig (Stand 10/2026)?
- **Richtige Antwort:** GModG, EBV und KrWG sind verbindlich; QNG ist ein freiwilliges Fördersiegel
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_oekobilanz_lca_1 · Ökobilanzierung (LCA & EPD)

- **Frage:** Rezeptur 1: 320 kg CEM I (0,665 kg CO₂-Äq./kg) und 1870 kg Gesteinskörnung (0,0035 kg CO₂-Äq./kg). Rezeptur 2: 300 kg CEM III/A (0,40 kg CO₂-Äq./kg). Welche Analyse ist richtig?
- **Richtige Antwort:** Der Zement verursacht über 90 % des A1-GWP; CEM III/A senkt diesen Anteil um rund 44 %
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_pfas_baustoffe_1 · PFAS in Baustoffen

- **Frage:** Eine frühere Feuerwehrübungsfläche mit Betonplatten soll rückgebaut werden. Welches Vorgehen ist am besten begründet?
- **Richtige Antwort:** Nutzung auswerten, AOF und TOP-Assay ergänzen, belastete Teile trennen und thermisch behandeln
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_pruefverfahren_katalog_1 · Bauwerksdiagnose & ZfP

- **Frage:** Für eine Umnutzung soll die Betondruckfestigkeit einer Decke belastbar bestimmt werden; Kernbohrungen sind nur an wenigen Stellen möglich. Welches Vorgehen ist nach dem Katalog am besten begründet?
- **Richtige Antwort:** Rückprall im Raster zur Bereichsbildung, Festigkeit an Bohrkernen kalibrieren
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_ressourcen_umwelt_1 · Ressourcen & Umwelt

- **Frage:** Welche Aussage zum typischen GWP je kg Baustoff entspricht der Übersicht im Modul?
- **Richtige Antwort:** Primäraluminium liegt mit rund 14–20 kg CO₂-Äq./kg weit über Portlandzement
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_ressourceneffizienz_1 · Ressourceneffizienz

- **Frage:** Welche Aufgabe hat das Ressourceneffizienz-Zentrum Bayern (REZ) nach dem Modul?
- **Richtige Antwort:** Es berät KMU neutral und veröffentlicht Datenblätter zu Ersatzbaustoffen
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_rueckbau_1 · Rückbau & Material

- **Frage:** Ein Gebäude von 1978 mit asbesthaltigem Putz (0,1 %) wird ohne vorherige Entfrachtung maschinell abgebrochen. Welche Folge beschreibt das Modul?
- **Richtige Antwort:** Der gesamte Ziegel- und Betonabbruch ist belastet und geht als Sondermüll
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_schadstoffe_1 · Schadstoffe & Sanierung (TRGS 519)

- **Frage:** Vor dem Umbau eines Bürogebäudes (Baujahr 1975) sollen Putze und Fliesenkleber auf Asbest geprüft und später der Bauschutt im Haufwerk für die Entsorgung beprobt werden. Welches Vorgehen ist nach dem Modul sachgerecht?
- **Richtige Antwort:** PSF-Mischproben nach VDI 6202 Blatt 3 in der Planung, Haufwerk nach LAGA PN 98
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_schutz_grundlagen_1 · Schutz- & Instands.-Grundlagen

- **Frage:** Eine Parkhausstütze ist bis in Bewehrungstiefe chloridbelastet; ein großflächiger Betonabtrag würde aufwendige Abstützungen erfordern. Welches Instandsetzungsprinzip ist nach dem Modul am besten begründet?
- **Richtige Antwort:** Prinzip 10 (CP): KKS, der chloridhaltige Beton darf im Bauteil verbleiben
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_wta_1 · WTA-Merkblätter

- **Frage:** Ein denkmalgeschütztes Ziegelmauerwerk hat Restfeuchte und Salze; die Fassade erhält Schlagregen. Welches Innendämmsystem ist am besten begründet?
- **Richtige Antwort:** Calciumsilicat, kapillaraktiv und vollflächig verklebt, ohne Dampfsperre
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qlz_zfp_1 · Zerstörungsfreie Prüfung (ZfP)

- **Frage:** An einer Tiefgaragendecke soll vor der Instandsetzungsplanung flächig festgestellt werden, wo die Bewehrung bereits aktiv korrodiert. Welche Verfahrenswahl ist nach dem Modul am besten begründet?
- **Richtige Antwort:** Potentialfeldmessung als Farbkarte, Kontakt an freigelegter Bewehrung, Befunde öffnen
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben, ohne Vorprüfung
- [ ] ok
- [ ] ändern: …

### qn_altholz_urban_mining_1 · Altholz-NIR-Sortierung und Urban Mining

- **Frage:** Welcher Altholzkategorie nach AltholzV ist ein lackiertes Möbelteil aus Spanplatte ohne PVC-Beschichtung und ohne Holzschutzmittel zuzuordnen?
- **Richtige Antwort:** A II
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_altholz_urban_mining_2 · Altholz-NIR-Sortierung und Urban Mining

- **Frage:** Welche Altholzkategorien dürfen nach AltholzV ohne besondere Vorbehandlung zu Holzhackschnitzeln für die Herstellung von Holzwerkstoffen aufbereitet werden?
- **Richtige Antwort:** A I und A II
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_bauwerkserfassung_1 · Bauwerkserfassung

- **Frage:** Für ein Baudenkmal sollen Wandneigungen und Balkendurchbiegungen geodätisch erfasst und im Maßstab 1:50 dargestellt werden. Welche Genauigkeitsstufe des Aufmaßes ist dafür vorgesehen?
- **Richtige Antwort:** Stufe III – detaillierte Bauaufnahme mit ± 2,5 cm
- **Auffälligkeit:** Vorprüfung „korrigiert“: Bearbeitungsvermerke 02.11.: Toleranzen und Maßstäbe der Genauigkeitsstufen II–IV im Modul an veröffentlichte Wiedergaben angeglichen (Stufe III ± 2,5 cm statt ± 5 mm, 1:50) – korrigiert
- [x] ok
- [ ] ändern: …

### qn_bauwerksunters_monitoring_2 · Tragwerksmonitoring (SHM)

- **Frage:** Das Bohrwiderstandsprofil eines Holzbalkens ist in den äußeren 40 mm normal, fällt dann über rund 55 mm stark ab und steigt zum Gegenrand wieder an. Welche Deutung passt?
- **Richtige Antwort:** Kernfäule im Inneren des Querschnitts bei gesunden Randzonen
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_bauwerksunters_monitoring_4 · Tragwerksmonitoring (SHM)

- **Frage:** Ein LVDT-Rissmonitoring zeigt, dass sich ein Riss im Winter weiter öffnet als im Sommer. Wie erklärt das Modul diesen Verlauf?
- **Richtige Antwort:** Bei Kälte verkürzt sich das Bauteil thermisch, Risse und Fugen öffnen sich
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_bauwerksuntersuchung_2 · Bauwerksdiagnose & ZfP

- **Frage:** Warum werden nach der Vor-Ort-Messdiagnostik (ZfP) punktuell Bohrkerne entnommen?
- **Richtige Antwort:** Um die ZfP-Ergebnisse zu kalibrieren und die reale Druckfestigkeit im Labor zu ermitteln
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_bauwerksuntersuchung_3 · Bauwerksdiagnose & ZfP

- **Frage:** An einer Brückenkappe in der Spritzwasserzone ist die Karbonatisierungstiefe gering und die Betondeckung ausreichend. Welche Folgerung ist nach dem Modul fachlich richtig?
- **Richtige Antwort:** Der Chloridgehalt ist an Bohrmehlproben in Tiefenstufen zusätzlich zu bestimmen
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_boden_materialaufbereitung_2 · Boden- & Materialaufbereitung

- **Frage:** Eine Bodenprobe wiegt feucht 1800 g und nach Trocknung bei 105 °C 1500 g. Das Labor misst 12 mg/kg in der Originalsubstanz. Wie groß ist der Gehalt bezogen auf die Trockenmasse?
- **Richtige Antwort:** rund 14,4 mg/kg TM
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_boden_materialaufbereitung_3 · Boden- & Materialaufbereitung

- **Frage:** Ein Haufwerk steht im Verdacht, leichtflüchtige Schadstoffe zu enthalten. Wie ist nach dem Modul zu beproben?
- **Richtige Antwort:** Ungestörte Proben per Stechzylinder direkt in gasdichte Gläser mit Septumdeckel füllen
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_denkmalpflege_2 · Denkmalpflege

- **Frage:** Eine historische Ziegelwand (U_alt = 1,50 W/(m²K)) erhält innen 5 cm Holzfaser-Lehm-System mit λ = 0,040 W/(mK). Welcher U-Wert ergibt sich mit U_neu = 1/(1/U_alt + d/λ)?
- **Richtige Antwort:** rund 0,52 W/(m²K)
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_historische_bauprodukte_3 · Hist. Bauprodukte

- **Frage:** In einem Gebäude von 1965 liegt unter dem Parkett ein schwarzer, pechartiger Kleber. Welcher Schadstoff ist nach dem Modul vorrangig zu vermuten?
- **Richtige Antwort:** PAK aus Steinkohlenteerpech im sogenannten Schwarzkleber (Teerkleber)
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · Zweitprüfung 27.10.: richtige Option verlängert (war deutlich kürzeste, Längenverhältnis 1,27) – korrigiert · bereits freigegeben (verified)
- [ ] ok
- [x] ändern: Längenhinweis beseitigt (richtige Option war kürzeste, Verhältnis 1,27), korrigiert

### qn_holzkorrosion_1 · Holzkorrosion

- **Frage:** Ein Deckenbalken ist dunkelbraun verfärbt, schrumpft spröde und zerfällt in würfelförmige Stücke. Welcher Fäuletyp liegt nach dem Modul vor?
- **Richtige Antwort:** Braunfäule, da vorwiegend Cellulose abgebaut wird und Lignin bleibt
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_holzkorrosion_2 · Holzkorrosion

- **Frage:** Im Splintholz eines trockenen Nadelholz-Dachstuhls sind ovale Ausfluglöcher zu sehen, die Oberfläche ist sonst papierdünn intakt, darunter ist das Holz zerfressen. Welches Insekt ist zu vermuten?
- **Richtige Antwort:** Hausbock, dessen Larven jahrelang im Nadelholz-Splint fressen
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_holzkorrosion_3 · Holzkorrosion

- **Frage:** Eine Charge Kiefernsplintholz von 0,60 m³ nimmt bei der Kesseldrucktränkung 220 kg Lösung mit 2,5 % Konzentration auf. Wie groß ist die Einbringmenge an Wirkstoff je m³?
- **Richtige Antwort:** rund 9,2 kg/m³
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_holzkorrosion_4 · Holzkorrosion

- **Frage:** Welcher Gebrauchsklasse nach DIN 68800-1 ordnet das Modul waagerecht verlegte, bewitterte Terrassendielen ohne Erdkontakt zu?
- **Richtige Antwort:** GK 3 (zweite Unterklasse) – bewittert, mit Wasseranlagerung
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_instandhaltung_1 · Stahlbetoninstandhaltung

- **Frage:** Für eine Tiefgaragendecke von 800 m² mit 0,8 m² Bewehrungsoberfläche je m² Bauteilfläche wird eine Schutzstromdichte von 15 mA/m² Stahloberfläche angesetzt. Welcher Gesamtschutzstrom ist auszulegen?
- **Richtige Antwort:** rund 9,6 A
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 28.10. (Abgleich Runde 3): Rückmeldung zu 96 A an den Fehlerweg angepasst (150 statt 15 mA/m²) – korrigiert
- [ ] ok
- [ ] ändern: …

### qn_instandhaltung_3 · Stahlbetoninstandhaltung

- **Frage:** Ein Tiefgaragenboden im Innenbereich ist mechanisch stark befahren, aber rissfrei und ohne Rissgefahr. Welches Oberflächenschutzsystem passt nach der OS-Übersicht des Moduls?
- **Richtige Antwort:** OS 8 – starre, befahrbare Beschichtung
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_instandhaltung_4 · Stahlbetoninstandhaltung

- **Frage:** Wie gliedert DIN EN 1504 nach dem Modul ihre 11 Instandsetzungsprinzipien?
- **Richtige Antwort:** Prinzipien 1–6 betreffen Betonschäden, 7–11 Bewehrungskorrosion
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_instandsetzung_materialien_1 · Instandsetzung nach Material

- **Frage:** Ein Stahlträger in C4 hat 100 µm Feuerverzinkung (Zinkabtrag bis 4,2 µm/a) und eine Beschichtung mit 12 Jahren Einzelschutzdauer. Welche Schutzdauer ergibt sich mit dem Synergiefaktor S = 1,5?
- **Richtige Antwort:** rund 54 Jahre
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_korrosion_1 · Bewehrungskorrosion

- **Frage:** In einer Kammer mit 2,0 Vol.-% CO₂ wird K_schnell = 2,0 mm/√d gemessen. Welcher äquivalente K-Wert ergibt sich nach K_nat ≈ K_schnell · √(CO₂,nat/CO₂,schnell) für 0,04 Vol.-% CO₂?
- **Richtige Antwort:** rund 0,28 mm/√d
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_korrosion_2 · Bewehrungskorrosion

- **Frage:** C_s = 2,5 M.-% v. z., D_app = 0,5 · 10⁻¹² m²/s (≈ 15,8 mm²/a, konstant), Betondeckung 40 mm, t = 50 a. Welcher Chloridgehalt ergibt sich an der Bewehrung nach C = C_s · [1 − erf(x/(2√(D · t)))]?
- **Richtige Antwort:** rund 0,78 M.-% v. z.
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_korrosionsschutz_beschichtungen_2 · Korrosionsschutz durch Beschichtungen

- **Frage:** Ein feuerverzinktes Bauteil (85 µm Zink) steht in Kategorie C4 mit einem Zinkabtrag von 2,1 bis 4,2 µm/a. Welche Schutzdauer ergibt sich im ungünstigen Fall?
- **Richtige Antwort:** rund 20 Jahre
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktor 30 → 27 Jahre: 85 µm/3,15 µm/a ≈ 27 a entspricht dem beschriebenen Fehler. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_korrosionsschutz_beschichtungen_3 · Korrosionsschutz durch Beschichtungen

- **Frage:** Was beschreibt der Oberflächenvorbereitungsgrad Sa 2½ nach DIN EN ISO 8501-1?
- **Richtige Antwort:** Sehr gründlich gestrahlt, nur leichte Schatten
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_korrosionsschutz_beschichtungen_4 · Korrosionsschutz durch Beschichtungen

- **Frage:** Warum ist die Schutzdauer eines Duplex-Systems größer als die Summe der Schutzdauern von Feuerverzinkung und Beschichtung?
- **Richtige Antwort:** Beschichtung bremst Zinkabtrag, Zink hemmt Unterrostung
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_kreislauf_dpp_2 · Kreislaufwirtschaft

- **Frage:** Bei der Erfassung vor dem Rückbau (in Anlehnung an DIN SPEC 91484) werden vier Bauteile aufgenommen. Welches ist nach Verbindungsart und Schadstoffstatus am besten für die Wiederverwendung geeignet?
- **Richtige Antwort:** Geschraubte BSH-Unterzüge, schadstofffrei und lösbar
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 28.10. (Abgleich Runde 3): Klassen A–D als Fügungsklassen des Modul-Simulators gekennzeichnet (nicht aus DIN SPEC 91484); Fragetext „in Anlehnung an“ – korrigiert
- [ ] ok
- [ ] ändern: …

### qn_kreislauf_dpp_3 · Kreislaufwirtschaft

- **Frage:** Ein Abbruchunternehmer will Betonbruch mit anhaftendem Gipsputz zu Gesteinskörnung für neuen Beton aufbereiten. Wie ist das nach dem Modul zu bewerten?
- **Richtige Antwort:** Kritisch, denn das Sulfat des Gipses kann im neuen Beton Ettringittreiben auslösen
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_lca_ingenieurbau_1 · LCA im Ingenieurbau (DIN EN 17472)

- **Frage:** Welches Merkmal unterscheidet die Ökobilanz von Ingenieurbauwerken nach DIN EN 17472 von der Gebäudebilanz nach DIN EN 15978?
- **Richtige Antwort:** Sie nutzt eigene funktionelle Einheiten, z. B. 1 m² Brückendeckfläche.
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 29.10. (Runde 4, Klärung entschieden): richtige Option auf funktionelle Einheiten umgestellt, da EN 15978:2026 B8 ebenfalls (optional) kennt – korrigiert
- [ ] ok
- [ ] ändern: …

### qn_lca_ingenieurbau_3 · LCA im Ingenieurbau (DIN EN 17472)

- **Frage:** Spannbeton-Hohlkasten im Simulator: 100 Jahre, 6 Belagswechsel mit je 18 Tagen Teilsperrung, DTV-SV = 4500 LKW/d, davon 40 % im Stau, 0,95 kg CO₂-Äq. je Fahrzeug, konventionelle Baustellenführung. Wie hoch sind die im Simulator als B8 geführten Stauemissionen?
- **Richtige Antwort:** rund 184,7 t CO₂-Äq.
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 29.10. (Runde 4, Klärung entschieden): Fragetext: Stauemissionen „im Simulator als B8 geführt“ (Modellannahme des Moduls) – korrigiert
- [ ] ok
- [ ] ändern: …

### qn_lca_ingenieurbau_4 · LCA im Ingenieurbau (DIN EN 17472)

- **Frage:** Bei 1500 m² Deckfläche und 100 Jahren liefert der Simulator für die Module A–C: Spannbeton 863 t (A1–A3: 400 t, B2–B5: 194 t, B8: 185 t) und Stahlverbund 825 t (A1–A3: 317 t, B2–B5: 233 t, B8: 212 t). Welche Analyse trifft zu?
- **Richtige Antwort:** Ihr A1–A3-Vorteil wird durch Korrosionsschutz (B2–B5) und Stautage (B8) zum Großteil aufgezehrt.
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · Zweitprüfung 27.10.: Erklärung an Simulator angepasst (Netto 39 t, 5,76 kg; Rest 22 t aus A4–A5 und C statt nur C) – korrigiert · bereits freigegeben (verified)
- [ ] ok
- [x] ändern: Erklärung nachgerechnet (Netto 39 t, 5,76 statt 5,75; 22 t aus A4–A5 und C, nicht nur aus C), korrigiert

### qn_lca_ingenieurbau_5 · LCA im Ingenieurbau (DIN EN 17472)

- **Frage:** Mit Schnellbau (−65 % Sperrzeit) sinkt die Summe A–C der Spannbetonbrücke im Simulator von 863 t auf 743 t, die der Stahlverbundbrücke von 825 t auf 687 t. Konventionell gebaut liegt Stahlverbund bei 825 t. Welche Bewertung ist fachlich am besten begründet?
- **Richtige Antwort:** Im Schnellbau unterbietet Spannbeton sogar den konventionell gebauten Stahlverbund.
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 29.10. (Runde 4, Klärung entschieden): Erklärung: B8 „im Simulator“ maßgeblicher Bilanzanteil (Modellannahme) – korrigiert
- [ ] ok
- [ ] ändern: …

### qn_lca_ingenieurbau_x_2 · LCA im Ingenieurbau (DIN EN 17472)

- **Frage:** Warum ist bei der Ökobilanz einer Autobahnbrücke nach DIN EN 17472 das Modul B8 oft bedeutsam, während es im Hochbau kaum eine Rolle spielt?
- **Richtige Antwort:** B8 erfasst Stauemissionen und Umwege des Verkehrs während Instandsetzungssperrungen
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_lca_rechner_3 · LCA-Rechner & QNG-Nachweis

- **Frage:** In der Transportbeton-Übung sinkt das GWP A1–A5 von rund 240 kg CO₂-Äq./m³ (CEM I, 320 kg) auf rund 100 kg CO₂-Äq./m³ beim Preset mit CEM III/B (280 kg) und 550 kg RC-Kies. Worauf ist diese Minderung im Wesentlichen zurückzuführen?
- **Richtige Antwort:** Auf den Emissionsfaktor des Zements (0,26 statt 0,665 kg CO₂-Äq./kg).
- **Auffälligkeit:** Vorprüfung „korrigiert“: Umsetzung 29.10.: Transportbeton-Übung mit Zement-GWP CEM I 0,665 und CEM III/B 0,26 kg/kg neu gerechnet (T15-NH-3) – korrigiert
- [ ] ok
- [ ] ändern: …

### qn_lca_regulatorik_1 · Rechtsrahmen, CRREM & Praxis

- **Frage:** Welche Einordnung entspricht dem Rechtsrahmen-Kompendium des Moduls?
- **Richtige Antwort:** BauPVO (EU) 2024/3110: unmittelbar geltende Verordnung, Ebene Baustoffe
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_lca_regulatorik_4 · Rechtsrahmen, CRREM & Praxis

- **Frage:** Welcher der im Modul vorgestellten Praxisansätze schont Primärressourcen auf der höchsten Stufe der Abfallhierarchie?
- **Richtige Antwort:** Neues Museum Berlin: rund 375 000 geborgene Ziegel werden erneut vermauert.
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_lca_regulatorik_5 · Rechtsrahmen, CRREM & Praxis

- **Frage:** Ein Importeur führt 1000 t Zement mit 0,8 t CO₂ je t Zement ein. Der EU-ETS-Preis beträgt 80 €/t CO₂, im Herkunftsland wurden bereits 20 €/t CO₂ gezahlt. Welche CBAM-Kosten ergeben sich nach der im Modul angegebenen Formel (Endzustand ohne kostenlose Zuteilung)?
- **Richtige Antwort:** 48 000 €
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 28.10. (Abgleich Runde 3): Frage auf Endzustand ohne kostenlose Zuteilung eingegrenzt; Erklärung um Art. 31 (Anpassung kostenlose Zuteilung, CBAM-Faktor 2026 97,5 %) ergänzt, Artikelverweise korrigiert (Art. 9 Anrechnung, Art. 21 Preis) – korrigiert
- [ ] ok
- [ ] ändern: …

### qn_lebenszyklus_kosten_2 · Lebenszyklus & Kosten

- **Frage:** Wie viele Erneuerungen eines Teppich-/Laminatbelags (mittlere Lebensdauer 12 a) sind nach der Formel des Austauschzyklen-Rechners über einen Betrachtungszeitraum von 50 a anzusetzen?
- **Richtige Antwort:** 4 Erneuerungen
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_lebenszyklus_kosten_3 · Lebenszyklus & Kosten

- **Frage:** Im LCC-Rechner wird ein CO₂-Schattenpreis aktiviert. Wie verändert das den Vergleich EPS-WDVS (rund 4 t CO₂-Äq. Herstellung als Lehrwert, 1,8 t/a Betrieb) gegen Holzfaser (1,5 t, 0,95 t/a)?
- **Richtige Antwort:** Zugunsten der Holzfaser, da die Klimakosten beider Varianten eingepreist werden
- **Auffälligkeit:** Vorprüfung „korrigiert“: Umsetzung 02.11.: Herstellungs-GWP des EPS-WDVS im Fragetext 12,5 t → rund 4 t (Lehrwert aus GWP_LEHRWERTE.eps, 16 cm auf 150 m² = 1560 kg, Systemanteil 2400 kg, zusammen 3960 kg; NS5A-LK-1); Aussage und Antwort unverändert – korrigiert
- [x] ok
- [ ] ändern: …

### qn_lebenszyklus_kosten_4 · Lebenszyklus & Kosten

- **Frage:** Ein Bauvertrag über 80 000 € wurde bei einem Baustoffpreisindex von 140 geschlossen; bei Lieferung steht der Index bei 175. Welcher angepasste Betrag ergibt sich mit K_t = K_0 · I_t/I_0?
- **Richtige Antwort:** 100 000 €
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_materialoptimierung_2 · Materialoptimierung

- **Frage:** Warum lässt sich nach dem Modul der Zementgehalt um etwa 8 bis 10 % senken, wenn die Konformitätsprüfung der Druckfestigkeit auf 56 statt 28 Tage festgelegt wird?
- **Richtige Antwort:** Hüttensand und Puzzolane hydratisieren langsam; ihr Beitrag wird erst nach 56 Tagen erfasst
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · Abgleich 02.11.: Lernhilfe nannte die Richtlinie „Treibhausgasoptimierte Tragwerke aus Stahlbeton“; Titel wie im Modul „Treibhausgasreduzierte Tragwerke aus Beton, Stahlbeton oder Spannbeton“ – korrigiert
- [x] ok
- [ ] ändern: …

### qn_materialoptimierung_3 · Materialoptimierung

- **Frage:** Eine Hohlkörperdecke enthält 19,5 m³ Beton (CEM III/A, Prüfalter 56 d: 157 kg CO₂-Äq./m³) und 2470 kg Betonstahl (Elektroofenstahl mit Grünstrom, Lehrwert 0,42 kg CO₂-Äq./kg). Wie groß ist das GWP A1–A3 nach GWP = V_c · gwp_c + m_s · gwp_s?
- **Richtige Antwort:** rund 4100 kg CO₂-Äq.
- **Auffälligkeit:** Vorprüfung „korrigiert“: Umsetzung 29.10.: Beton-GWP CEM III/A bei 56 d jetzt 144 statt 123 kg/m³ (Zement-GWP nach T15-NH-3) – korrigiert · Zweitprüfung 29.10. (Runde 5): Stahlkennwert 0,42 wie im Modul als „Elektroofenstahl mit Grünstrom (Lehrwert)“ bezeichnet; 0,64 (ÖKOBAUDAT „Bewehrungsstahl (de)“) ist ebenfalls überwiegend Elektroofenstahl – korrigiert · Umsetzung 30.10.: Beton-GWP CEM III/A bei 56 d jetzt 157 statt 144 kg/m³ (Lehrbeton-Rest einheitlich 45 kg/m³), Antworten neu gerechnet – korrigiert
- [x] ok
- [ ] ändern: …

### qn_metallkorrosion_4 · Metallkorrosion

- **Frage:** Ein Bauteil steht dauerhaft im Meerwasser-Spritzbereich. Welche Werkstoffwahl stützt die PREN-Faustregel des Moduls?
- **Richtige Antwort:** Ein Superduplexstahl mit PREN über etwa 40
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_modernisierung_3 · Modernisierung & GModG

- **Frage:** Ein Einfamilienhaus mit ungedämmter oberster Geschossdecke wird verkauft. Der Altbesitzer bewohnte es seit 1998 selbst. Was gilt nach dem Modul für den Käufer?
- **Richtige Antwort:** Er muss die Nachrüstpflichten binnen zwei Jahren nach Eigentumsübergang erfüllen
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_oekobilanz_lca_g1 · Ökobilanzierung (LCA): Grundlagen

- **Frage:** 1 m³ C30/37 enthält 320 kg Zement. Mit GWP CEM I = 0,665 (VDZ-Branchen-EPD, netto) und CEM III/A = 0,40 kg CO₂-Äq./kg (Lehrwert) sowie pauschal 45 kg CO₂-Äq./m³ für die übrigen Bestandteile: Um wie viel Prozent sinkt das GWP (A1–A3) beim Wechsel auf CEM III/A?
- **Richtige Antwort:** um rund 33 %
- **Auffälligkeit:** Vorprüfung „korrigiert“: Umsetzung 29.10.: Lehrbeispiel mit CEM I 0,665 (VDZ-Branchen-EPD, netto) und CEM III/A 0,40 kg/kg neu gerechnet (T15-NH-3) – korrigiert · Umsetzung 30.10.: Restanteil der Lehrbetone einheitlich 45 kg/m³ (258/173, Minderung 33 %) – korrigiert
- [x] ok
- [ ] ändern: …

### qn_pfas_baustoffe_3 · PFAS in Baustoffen

- **Frage:** Welche Grenzwerte gelten nach der Trinkwasserverordnung für die Summen PFAS-20 und PFAS-4?
- **Richtige Antwort:** PFAS-20: 0,1 µg/l; PFAS-4: 0,02 µg/l
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_pfas_baustoffe_4 · PFAS in Baustoffen

- **Frage:** Welchen Stand hat der universelle PFAS-Beschränkungsvorschlag unter REACH im Herbst 2026?
- **Richtige Antwort:** Er ist im Verfahren; SEAC und Kommission entscheiden noch.
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_pfas_baustoffe_5 · PFAS in Baustoffen

- **Frage:** In einer Trinkwasserprobe werden PFOA 6 ng/l, PFNA 1 ng/l, PFHxS 4 ng/l und PFOS 7 ng/l gemessen. Wie ist die Summe PFAS-4 gegenüber dem Grenzwert ab 2028 zu bewerten?
- **Richtige Antwort:** 18 ng/l, eingehalten
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_pfas_baustoffe_6 · PFAS in Baustoffen

- **Frage:** Bei einer Probe liegen 10 der 20 PFAS unter der Bestimmungsgrenze von 2 ng/l, die übrigen 10 summieren sich auf 92 ng/l. Welche Aussage zur Summe PFAS-20 trifft zu?
- **Richtige Antwort:** eingehalten: Werte unter der BG zählen nicht (92 ng/l)
- **Auffälligkeit:** Vorprüfung „korrigiert“: Rechtsquellen-Prüfung 03.11.: Antwort „nicht eindeutig: Spanne 92 bis 112 ng/l“ widersprach TrinkwV Anlage 2 Teil I (Werte unterhalb der Bestimmungsgrenze bleiben unberücksichtigt) – richtige Antwort jetzt „eingehalten, 92 ng/l“; Optionen, Erklärung, Rückmeldungen und Lückenanalyse angepasst – korrigiert
- [x] ok
- [ ] ändern: …

### qn_rueckbau_4 · Rückbau & Material

- **Frage:** Ausbauasphalt einer alten Betriebseinfahrt soll als Frostschutzschicht im Wegebau wiederverwendet werden. Welches Vorgehen entspricht dem Modul?
- **Richtige Antwort:** Zuerst eine Bindemittelanalyse auf Teer/PAK durchführen, dann verwerten
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_schadreaktionen_beton_2 · Betonkorrosion

- **Frage:** Welcher Feuchtigkeitsklasse nach Alkali-Richtlinie ist eine Betonfahrbahndecke einer Autobahn mit Tausalzeinwirkung zuzuordnen?
- **Richtige Antwort:** WS – feucht, starke Alkalizufuhr, Verkehrslast
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_schadreaktionen_beton_3 · Betonkorrosion

- **Frage:** Zwei Betone für XF4 haben beide 4,5 Vol.-% Luftporen; der Abstandsfaktor beträgt bei Beton A 0,15 mm und bei Beton B 0,30 mm. Wie ist das zu deuten?
- **Richtige Antwort:** A ist besser, da kurze Fließwege bis zur nächsten Luftpore den Eisdruck abbauen
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_schadreaktionen_beton_4 · Betonkorrosion

- **Frage:** Für ein Bauteil der Feuchtigkeitsklasse WS ist eine Gesteinskörnung der Klasse E III vorgesehen. Welche Maßnahme sieht das Modul vor?
- **Richtige Antwort:** Gesteinskörnung austauschen oder Gutachten bzw. Performance-Prüfung einholen
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_schnellkarbonatisierung_4 · Schnellkarbonatisierung (DIN EN 12390-12)

- **Frage:** Ein Beton hat K_AC = 1,0 mm/√d bei 3 % CO₂. Welcher Koeffizient ergibt sich näherungsweise für 0,04 % CO₂ in mm/√a, wenn nur die Konzentration berücksichtigt wird?
- **Richtige Antwort:** etwa 2,2 mm/√a
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_vdi6200_3 · Zustandsbewertung

- **Frage:** Bei einer Prüfung lösen sich Betonteile über einem Gehweg (V = 4), während die Standsicherheit nicht beeinträchtigt ist (S = 1). Welcher Handlungsbedarf folgt nach dem Modul?
- **Richtige Antwort:** Sofortige Maßnahmen wie Absperrung, da die Verkehrssicherheit fehlt
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qt_bauwerksdiagnose_1 · Bauwerksdiagnose & ZfP

- **Frage:** Warum wird Bohrmehl für die Chloridanalyse nach DIN EN 14629 trocken und in Tiefenstufen entnommen?
- **Richtige Antwort:** Spülwasser löst Chloride; Stufen trennen Randzone und Gehalt in Bewehrungstiefe
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_bauwerksdiagnose_2 · Bauwerksdiagnose & ZfP

- **Frage:** Für einen Prüfbereich ergibt die Auswertung nach DIN EN 13791:2020 f_ck,is = 26,5 N/mm². In welche Druckfestigkeitsklasse ist der Beton mit f_ck = f_ck,is/0,85 höchstens einzustufen?
- **Richtige Antwort:** C30/37 (f_ck ≈ 31 N/mm²)
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_hk13791_1 · Historische Kennwerte

- **Frage:** Wie viele Bohrkerne mit Ø 100 mm sind nach DIN EN 13791:2020-02 je Prüfbereich mindestens nötig, um f_ck,is allein aus Kernen statistisch zu bestimmen?
- **Richtige Antwort:** 8 Kerne
- **Auffälligkeit:** Vorprüfung „fraglich“: Neu 02.11.2026 (Reiter Bohrkernserie): Werte nach Sekundärquellen (BRMCA 2020, TFB 2021, Sefrin et al. 2022) – vorläufig, Normprüfung ausstehend; fachliche Prüfung offen. · neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_hk13791_2 · Historische Kennwerte

- **Frage:** Zehn Kerne (h/d = 2) ergeben f_m(n),is = 30,0 N/mm², s = 3,0 N/mm² und als kleinsten Wert 26,0 N/mm². Wie groß ist f_ck,is?
- **Richtige Antwort:** 24,2 N/mm²
- **Auffälligkeit:** Vorprüfung „fraglich“: Neu 02.11.2026 (Reiter Bohrkernserie): Werte nach Sekundärquellen (BRMCA 2020, TFB 2021, Sefrin et al. 2022) – vorläufig, Normprüfung ausstehend; fachliche Prüfung offen. · neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_hk13791_3 · Historische Kennwerte

- **Frage:** Warum sinkt der Faktor k_n in DIN EN 13791 von 2,00 bei 8 Kernen auf 1,64 bei sehr vielen Kernen?
- **Richtige Antwort:** Mittelwert und Streuung sind mit mehr Kernen genauer bekannt
- **Auffälligkeit:** Vorprüfung „fraglich“: Neu 02.11.2026 (Reiter Bohrkernserie): Werte nach Sekundärquellen (BRMCA 2020, TFB 2021, Sefrin et al. 2022) – vorläufig, Normprüfung ausstehend; fachliche Prüfung offen. · neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_hk13791_4 · Historische Kennwerte

- **Frage:** Eine Bohrkernserie mit Kernen h/d = 2 ergibt f_ck,is = 22,0 N/mm². Welche Druckfestigkeitsklasse ist höchstens zuzuordnen?
- **Richtige Antwort:** C25/30
- **Auffälligkeit:** Vorprüfung „fraglich“: Neu 02.11.2026 (Reiter Bohrkernserie): Werte nach Sekundärquellen (BRMCA 2020, TFB 2021, Sefrin et al. 2022) – vorläufig, Normprüfung ausstehend; fachliche Prüfung offen. · neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_pruefverfahren_katalog_1 · Bauwerksdiagnose & ZfP

- **Frage:** Durchschallung einer Stütze: Messstrecke s = 0,40 m, Laufzeit Δt = 95 µs, ρ = 2400 kg/m³, ν = 0,2. Welche Auswertung liefert der Simulator?
- **Richtige Antwort:** v_p ≈ 4210 m/s, E_dyn ≈ 38 GPa – gutes, dichtes Gefüge
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_pruefverfahren_katalog_2 · Bauwerksdiagnose & ZfP

- **Frage:** Impact-Echo an einer 30 cm dicken Platte: dominante Frequenz f = 9,6 kHz, v_p = 4000 m/s, β = 0,96. Welche Auswertung trifft zu?
- **Richtige Antwort:** d ≈ 20 cm: Reflexion vor der Rückwand, Hinweis auf Fehlstelle
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_pruefverfahren_katalog_3 · Bauwerksdiagnose & ZfP

- **Frage:** Abreißversuch mit Stempel Ø 50 mm: Bruchkraft F = 3,5 kN, Bruch in der Klebefuge (Bruchbild Y). Wie ist das Ergebnis einzuordnen?
- **Richtige Antwort:** f_ct ≈ 1,78 N/mm² ist nur ein unterer Grenzwert; Prüfung wiederholen
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_pruefverfahren_katalog_4 · Bauwerksdiagnose & ZfP

- **Frage:** In Bewehrungstiefe werden 0,3 M.-% Chlorid bezogen auf den Zement gemessen. Wie bewertet das Modul diesen Befund für Stahlbeton und für Spannbeton?
- **Richtige Antwort:** Stahlbeton unter dem Anhaltswert; am Spannstahl (ab 0,2 M.-%) kritisch
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_pruefverfahren_katalog_5 · Bauwerksdiagnose & ZfP

- **Frage:** Ein Bohrkern D = 100 mm, L = 100 mm bricht in der Presse bei F = 275 kN. Welche Auswertung trifft nach dem Modul zu?
- **Richtige Antwort:** f_c,core ≈ 35,0 N/mm², vergleichbar mit dem Würfel (150 mm)
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_zfp_1 · Zerstörungsfreie Prüfung (ZfP)

- **Frage:** Georadar auf feuchtem Beton: relative Dielektrizitätszahl ε_r = 9, Laufzeit des Bewehrungsechos t = 2,0 ns, c₀ = 300 mm/ns. In welcher Tiefe liegt der Stab?
- **Richtige Antwort:** d ≈ 100 mm
- **Auffälligkeit:** Vorprüfung „korrigiert“: Neu 29.10.: Aufstockung des Teilmoduls auf 6 Fragen (QZ-6); mit src/calc/pruefverfahren.ts (georadar) nachgerechnet, tests/quizRechenfragen.test.ts · Zweitprüfung 29.10.: Rückmeldung zu 300 mm berichtigt (Fehlerweg: ohne √ε_r, aber halbiert; ohne Halbierung ergäben sich 600 mm) – korrigiert · neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_zfp_2 · Zerstörungsfreie Prüfung (ZfP)

- **Frage:** Wenner-Sonde mit Elektrodenabstand a = 50 mm, gemessener Widerstand R = 1000 Ω. Welcher spezifische Widerstand und welches Korrosionsrisiko ergeben sich nach dem Modul?
- **Richtige Antwort:** ρ ≈ 314 Ω·m – mäßiges Korrosionsrisiko
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_zfp_3 · Zerstörungsfreie Prüfung (ZfP)

- **Frage:** An einer Parkdeckplatte wird ein Halbzellenpotential von −280 mV gegen Cu/CuSO₄ gemessen. Wie ordnet das Modul diesen Wert ein?
- **Richtige Antwort:** Ungewiss (10 … 90 %); Bewertung objektbezogen im Potentialfeld
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_zfp_4 · Zerstörungsfreie Prüfung (ZfP)

- **Frage:** Eine Torrent-Messung ergibt k_T = 0,05 · 10⁻¹⁶ m² bei einer Betonfeuchte von 90 %. Wie ist der Wert nach dem Modul zu bewerten?
- **Richtige Antwort:** Ungültig: Porenwasser blockiert den Gasfluss, k_T fällt zu klein aus
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

### qt_zfp_5 · Zerstörungsfreie Prüfung (ZfP)

- **Frage:** Welche Zuordnung von DGZfP-Merkblatt (Reihe B, Bauwesen) und Thema trifft nach der Übersicht im Modul zu?
- **Richtige Antwort:** B 03 – Potentialmessung zur Korrosionsdetektion
- **Auffälligkeit:** neu seit 26.10.2026 (Z24), noch nicht freigegeben
- [ ] ok
- [ ] ändern: …

## B. Stichprobe unauffälliger Fragen (5)

Auswahl deterministisch (Sortierung nach FNV-1a-Hash der Frage-ID), damit die Stichprobe nachvollziehbar ist.

### qn_metallkorrosion_1 · Metallkorrosion

- **Frage:** Warum schützt die Oxidschicht des Aluminiums (PBR ≈ 1,28) das Metall, während Rost auf Eisen (Fe₂O₃, PBR ≈ 2,1) abblättert?
- **Richtige Antwort:** Ein PBR von 1 bis 2 ergibt eine dichte Schicht; darüber platzt das Oxid ab
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### qn_lca_rechner_4 · LCA-Rechner & QNG-Nachweis

- **Frage:** Ein Mehrfamilienhaus (1200 m² NRF, 50 a) erreicht 24,2 kg CO₂-Äq./(m²·a) (Konstruktion 1 050 000 kg, Betrieb 400 000 kg). Der Bauherr möchte 90 000 kg Recyclinggutschrift aus Modul D abziehen, um QNG-PLUS (≤ 24) zu erreichen. Wie ist das zu bewerten?
- **Richtige Antwort:** Unzulässig, Modul D ist separat auszuweisen; PLUS gelänge z. B. als Holzhybrid (21,5).
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### qn_metallkorrosion_3 · Metallkorrosion

- **Frage:** Unter dem Kopf einer Edelstahlschraube (Spalt < 0,1 mm) zeigt sich starke Korrosion, während die frei bewitterte Fläche intakt ist. Wie erklärt das Modul diesen Befund?
- **Richtige Antwort:** Der sauerstoffarme Spaltgrund wird gegenüber der belüfteten Fläche zur Anode
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### qn_lca_rechner_5 · LCA-Rechner & QNG-Nachweis

- **Frage:** Warum reduziert der Wandkonfigurator den Zirkularitätsindex, wenn die Fügungsmethode von „Geschraubt (Trocken)“ auf „Verklebt / Mörtel“ umgestellt wird?
- **Richtige Antwort:** Weil vollflächige Verbindungen die sortenreine Trennung im Rückbau verhindern.
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### qn_vdi6200_1 · Zustandsbewertung

- **Frage:** Im Notenrechner des Moduls (didaktisches Modell: ungünstigste Einzelbewertung + 0,1 je weiterem Schaden) wird ein Mangel mit S = 2, V = 1, D = 3 erfasst, dazu zwei weitere Schäden. Welche Zustandsnote ergibt sich?
- **Richtige Antwort:** 3,2
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

## C. Lernziel-Stichprobe (5 Module)

Quelle: `src/data/lernziele.ts`. Zu prüfen: Lernziele operationalisiert („Sie können …“ + beobachtbares Verb), Bloom-Stufe passend, fachlich richtig, mit den Modulinhalten und Quizfragen abgedeckt.

### historische_bauweisen · Hist. Bauweisen

Niveau B · 120 min · Vorwissen: historisch, mauerwerk, baustatik

- (Verstehen) Sie können die Konstruktionsprinzipien von Vollziegelmauerwerk, Fachwerk, Holzbalken- und Kappendecken sowie Sparren-, Kehlbalken- und Pfettendächern erläutern.
- (Anwenden) Sie können den Gewölbeschub eines Bogens bzw. einer preußischen Kappe berechnen und das Zugband bemessen.
- (Anwenden) Sie können die Schwindverformungen eines Fachwerkholzes aus Holzfeuchteänderung und Faserrichtung berechnen.
- (Anwenden) Sie können die Biegespannungen in einem historischen Holzbalken aus Moment und Widerstandsmoment ermitteln.
- (Analysieren) Sie können typische Schwachstellen historischer Tragwerke anhand der Rechenergebnisse identifizieren.

- [x] ok
- [ ] ändern: …

### instandsetzung_materialien · Instandsetzung nach Material

Niveau B · 120 min · Vorwissen: schutz_grundlagen, holzkorrosion, metallkorrosion

- (Verstehen) Sie können präventive Schutzmaßnahmen und Instandsetzungsverfahren für Holz, Stahl, Kunststoffe, Asphalt und Mauerwerk unterscheiden.
- (Anwenden) Sie können geeignete Korrosionsschutzsysteme nach DIN EN ISO 12944 einschließlich Duplexsystemen auswählen.
- (Anwenden) Sie können die verbleibende Biegetragfähigkeit eines angefaulten Holzbalkens aus dem Restquerschnitt ermitteln und mit dem Ausgangsquerschnitt vergleichen.
- (Bewerten) Sie können passende Instandsetzungsverfahren für Holztragwerke nach DIN 68800, für Asphaltbeläge nach ZTV BEA-StB und für Mauerwerk nach WTA begründet auswählen.

- [x] ok
- [ ] ändern: …

### wta · WTA-Merkblätter

Niveau B/M · 75 min · Vorwissen: bestand, feuchteschutz

- (Verstehen) Sie können die Rolle der WTA-Merkblätter als Beschreibung anerkannter Regeln der Technik für die Bauwerkserhaltung erläutern und ihre Referatsbereiche zuordnen.
- (Verstehen) Sie können den Wirkmechanismus von Sanierputzen aus Hydrophobierung, Makroporosität und Verlagerung der Verdunstungszone erläutern.
- (Anwenden) Sie können für eine nachträgliche Horizontalsperre nach WTA-Merkblatt 4-10 Bohrlochtiefe, Bohrlochabstand und Injektionsmittelbedarf je laufendem Meter berechnen.
- (Analysieren) Sie können aus Durchfeuchtungsgrad und Salzbelastung das geeignete Injektionsverfahren und Sanierputzsystem nach WTA-Merkblatt 2-9 ableiten.
- (Bewerten) Sie können Innendämmsysteme aus Calciumsilicat, Holzfaser, Mineralschaum oder PUR mit Dampfsperre bei Restfeuchte, Salzlast und Schlagregen nach WTA 6-5 beurteilen.

- [x] ok
- [ ] ändern: …

### pfas_baustoffe · PFAS in Baustoffen

Niveau B/M · 75 min · Vorwissen: schadstoffe, bauchemie

- (Erinnern) Sie können Anwendungen von PFAS in Beschichtungen, Dichtstoffen, Membranen und Löschschäumen benennen und Verdachtsbereiche im Bestand aufzählen.
- (Verstehen) Sie können den Stand der EU-Regulierung von PFAS (POP-Verordnung, REACH-Beschränkungen, universeller Beschränkungsvorschlag) und die Grenzwerte der TrinkwV erläutern.
- (Anwenden) Sie können die Summen PFAS-20 und PFAS-4 einer Wasserprobe bilden, Werte unter der Bestimmungsgrenze sachgerecht ansetzen und mit den Grenzwerten vergleichen.
- (Bewerten) Sie können Erkundung, Trennung und Entsorgung PFAS-belasteter Bauteile beim Rückbau planen und Analyseverfahren (Einzelstoffe, AOF, TOP-Assay) begründet auswählen.

- [x] ok
- [ ] ändern: …

### metallkorrosion · Metallkorrosion

Niveau B · 90 min · Vorwissen: metalle, dauerhaftigkeit

- (Verstehen) Sie können die Sauerstoff- und Wasserstoffkorrosion, Lochfraß, Spaltkorrosion und Spannungsrisskorrosion unterscheiden.
- (Verstehen) Sie können die Schutzwirkung von Deckschichten mit dem Pilling-Bedworth-Verhältnis und der Patinabildung erläutern.
- (Anwenden) Sie können die Schutzdauer eines Zinküberzugs aus Schichtdicke und Abtragsrate berechnen.
- (Analysieren) Sie können den Einfluss von Feuchte und Chloriden auf Rostbildung und Anodenabtrag in der Korrosionssimulation analysieren.
- (Bewerten) Sie können geeignete Werkstoffe wie wetterfesten Baustahl und nichtrostende Stähle für eine Korrosivitätskategorie nach DIN EN ISO 9223 auswählen und die Gefahr von Kontaktkorrosion beurteilen.

- [x] ok
- [ ] ändern: …
