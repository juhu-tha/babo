/**
 * „Das Wichtigste in 5 Punkten“ für lange Module (Umsetzungsplan Phase 3, AP 3.8).
 * tests/kurzfassung.test.ts prüft Form und Abdeckung der Pflichtmodule.
 */
export const KURZFASSUNG: Readonly<Record<string, readonly string[]>> = {
  abfaelle: [
    "Bau- und Abbruchabfälle folgen der fünfstufigen Abfallhierarchie des KrWG: Vermeidung vor Wiederverwendung, Recycling und sonstiger Verwertung, die Beseitigung ist letzte Instanz.",
    "Die Einstufung erfolgt nach AVV Kapitel 17; bei Spiegeleinträgen wie 17 05 03* und 17 05 04 entscheidet erst die Analytik, ob ein gefährlicher Abfall mit eANV-Pflicht vorliegt.",
    "Seit dem 1. August 2023 regelt die EBV den Einbau mineralischer Ersatzbaustoffe bundeseinheitlich über Materialklassen wie BM-0 oder RC-1 und die Einbautabellen der Anlage 2.",
    "Für RC-3, BM-F3 und BG-F3 ist ab 250 m³ eine Voranzeige vier Wochen vor Einbaubeginn nach § 22 EBV nötig; in Wasserschutzgebieten gilt die Anzeigepflicht mengenunabhängig.",
    "Typischer Fehler ist das Vermischen: Gelangt A-IV-Altholz in einen Container mit A I bis A III, gilt der gesamte Inhalt als gefährlicher Abfall mit hohen Entsorgungskosten.",
  ],
  betonpraxis: [
    "Das Modul bündelt Praxisregeln nach Krell (2022) zur Steuerung von Frisch- und Festbeton über die Norm hinaus, vom Ausbreitmaß bis zur Bohrkernprüfung.",
    "Der Zusammenhalt wird über k = (w − 70)/MK beurteilt: Optimal sind 0,27 bis 0,31, ab 0,33 droht Bluten, bei 0,25 und darunter ist der Beton klebrig und schwer entlüftbar.",
    "Nachträgliche Wasserzugabe ist nach DIN 1045-3 unzulässig; im Simulator senken 20 l/m³ Zusatzwasser die Druckfestigkeit um mehr als 8 N/mm² und erhöhen das Schwinden.",
    "Bohrkerne nach DIN EN 13791 müssen im kleinsten Einzelwert 0,85 · (f_ck − 4) erreichen; bei der Identitätsprüfung muss jeder Einzelwert mindestens f_ck − 4 N/mm² betragen.",
    "Für WU-Bauteile gilt (w/z)_eq ≤ 0,55 bei BK 1; Elementwände benötigen 240 mm Gesamtdicke mit mindestens 120 mm Kernbeton und ein Größtkorn von höchstens 16 mm.",
  ],
  bp_abdichtung: [
    "DIN 18533 unterscheidet W1-E (Bodenfeuchte, bei bindigem Boden nur mit Dränung nach DIN 4095), W2-E für drückendes Wasser bis bzw. über 3,0 m und W4-E am Sockel.",
    "PMBC benötigt eine Mindesttrockenschichtdicke von 3,0 mm bei W1-E und W4-E sowie 4,0 mm mit Gewebeeinlage bei mäßig drückendem Wasser; MDS erfordert an jeder Stelle mindestens 2,0 mm.",
    "Die Nassschichtdicke folgt aus Mindesttrockenschichtdicke geteilt durch den Feststoffanteil; im Modulbeispiel ergeben 4 mm trocken bei mäßig drückendem Wasser rund 6 mm nass.",
    "Arbeitsfugen in WU-Bauteilen sichern Fugenblech, Fugenband, Quellband oder Injektionsschlauch; schlecht verdichteter Beton an Fugenbändern führt zu Kiesnestern und Umläufigkeit.",
    "Das Injektionsgut richtet sich nach dem Risszustand: EP für trockene, ruhende Risse, PUR für wasserführende oder bewegte Risse, Acrylatgel für Schleierinjektionen.",
  ],
  bp_farben_lacke: [
    "Ein Beschichtungsstoff besteht aus Bindemittel, Löse- bzw. Verdünnungsmittel, Pigmenten und Füllstoffen sowie Additiven; das Bindemittel bildet den eigentlichen Schutzfilm.",
    "Dispersionsfarben trocknen physikalisch, Alkydharze härten oxidativ, 2K-EP und 2K-PUR vernetzen durch Polyaddition; bei 2K-Systemen ist das Mischungsverhältnis exakt einzuhalten.",
    "Die Nassschichtdicke folgt aus Trockenschichtdicke geteilt durch den Festkörpervolumenanteil; Verdünnung und Verlustfaktor, etwa 10 bis 15 % beim Rollen, erhöhen den Materialbedarf.",
    "Silikatfarben verkieseln mit dem mineralischen Untergrund und sind sehr diffusionsoffen (sd < 0,01 m), eignen sich aber nicht für Gips, Holz, Metall oder Altkunststoff.",
    "OS-Systeme werden nach Belastung gewählt: OS 8 starr für Tiefgaragenböden, OS 11a mit erhöhter dynamischer Rissüberbrückung für frei bewitterte Parkdecks, bei Haftzug ≥ 1,5 N/mm².",
  ],
  dauerhaftigkeit: [
    "Dauerhaftigkeit beruht auf drei Ebenen: konstruktiver Schutz vor Materialanpassung und aktiven bzw. passiven Schutzsystemen, wobei der konstruktive Schutz am wirksamsten ist.",
    "Die Betondeckung ergibt sich aus c_nom = c_min + Δc_dev mit Δc_dev = 15 mm nach NA (nur XC1: 10 mm); für XC4 folgen c_min,dur = 25 mm und c_nom = 40 mm.",
    "Die Karbonatisierungstiefe wächst nach dem Wurzel-t-Gesetz x_c = k · √t; erreicht die Front mit pH unter 9 die Bewehrung, ist der Stahl depassiviert.",
    "Die Zeit bis zur Depassivierung wächst quadratisch mit der Deckung: Im Modulbeispiel verkürzen 15 mm Minderdeckung sie um rund 60 %, daher Abstandhalter kontrollieren.",
    "Für Metalle gelten Korrosivitätskategorien C1 bis CX nach DIN EN ISO 12944-2, für Holz Gebrauchsklassen GK 0 bis GK 5 nach DIN 68800-1; unedle Schrauben in edlem Blech sind ein No-Go.",
  ],
  historische_bauprodukte: [
    "Das Modul ordnet Bauprodukte Epochen zu, etwa Gusseisen und Reichsformatziegel vor 1945, Isteg-Stahl und Trümmerbeton im Wiederaufbau sowie Sokalit-Platten in der DDR.",
    "Gusseisen ist druckfest, aber spröde und nicht schweißbar; es bricht ohne Vorwarnung, daher sind Zugspannungszonen konstruktiv zu vermeiden.",
    "Thomas-Stahl ist alterungsversprödet und für tragende Anschlüsse nicht schweißbar; Ertüchtigungen historischer Stähle erfolgen über Schraub-, Niet- oder Klemmverbindungen.",
    "Typische Schadstoffträger sind Asbestzement, Teer-Parkettkleber mit PAK, PCB-haltige Thiokol-Fugen und PCP-/Lindan-Holzschutz; vor jedem Eingriff ist eine Materialprobe nötig.",
    "Nach PCB-Richtlinie gilt Raumluft unter 300 ng/m³ als langfristig tolerabel, über 3 000 ng/m³ sind unverzüglich Maßnahmen nötig; für Blei im Trinkwasser gelten ab 2028 höchstens 5 µg/l.",
  ],
  instandhaltung: [
    "Standsicherheitsrelevante Instandsetzungen folgen der TR Instandhaltung des DIBt mit sachkundigem Planer (SKP); DIN EN 1504 regelt nur Produkteigenschaften und CE-Kennzeichnung.",
    "DIN EN 1504 definiert 11 Prinzipien: 1 bis 6 betreffen Betonschäden, 7 bis 11 die Bewehrungskorrosion, etwa Repassivierung oder kathodischen Korrosionsschutz.",
    "Oberflächenschutzsysteme reichen von OS 1 (Hydrophobierung) über OS 4 als CO₂-Bremse bis OS 8 (starr, befahrbar) und OS 11 (rissüberbrückend, befahrbar).",
    "Instandsetzungsmörtel CC, PCC, SPCC und PC werden nach DIN EN 1504-3 in R1 bis R4 eingeteilt; statisch relevant sind R3 und R4, R4 erfordert mindestens 2,0 MPa Haftzug.",
    "Für KKS sind etwa 2 bis 20 mA/m² Stahloberfläche üblich; Schutzkriterium nach DIN EN ISO 12696 ist ein Ausschaltpotenzial unter −720 mV oder eine Depolarisation ≥ 100 mV.",
  ],
  ki_ueberblick: [
    "KI ist der Oberbegriff; Machine Learning, Deep Learning und Large Language Models bilden nach dem Zwiebelschalen-Modell jeweils engere Teilmengen davon.",
    "ML-Modelle gelten nur innerhalb ihres Trainingsbereichs; bei neuartigen Zementen oder Zusatzmitteln liefern sie scheinbar plausible, physikalisch aber falsche Kennwerte.",
    "Reine Sprachmodelle halluzinieren bei Normwerten; RAG bindet die Antwort an kuratierte, versionierte Quellen und nennt Normabschnitt, Tabelle und Fundstelle.",
    "Bei KI-Risserkennung ist der Recall maßgebend: Im Modulbeispiel mit 45 erkannten und 15 übersehenen Rissen bleibt jeder vierte Riss unentdeckt.",
    "KI haftet nicht: Statische Nachweise und haftungsrelevante Freigaben bleiben nach BGB § 634 beim bauvorlageberechtigten Ingenieur (Human-in-the-Loop).",
  ],
  lca_rechner: [
    "Der LCA-Rechner bilanziert das Treibhauspotenzial von Gebäudevarianten nach DIN EN 15978 über 50 Jahre, bezogen auf m² NRF und Jahr in kg CO₂-Äq./(m²·a).",
    "Für Wohngebäude gelten nach QNG-Handbuch QNG-PLUS ≤ 24 und QNG-PREMIUM ≤ 20 kg CO₂-Äq./(m² NRF·a), zusätzlich PENRT ≤ 96 bzw. 64 kWh/(m²a).",
    "Typischer Fehler: Gutschriften aus Modul D werden mit A bis C verrechnet; nach DIN EN 15804 und QNG sind sie separat auszuweisen und dürfen nicht abgezogen werden.",
    "Im Rechenbeispiel verfehlt ein Mehrfamilienhaus mit 1 200 m² NRF mit 24,2 kg CO₂-Äq./(m²a) QNG-PLUS knapp; die Holzhybrid-Variante erreicht 21,5.",
    "GWP-Faktoren in kg CO₂-Äq./kg sind mit Volumen mal Rohdichte zu multiplizieren; biogener Kohlenstoff aus A1–A3 wird am Lebensende in C3 wieder freigesetzt.",
  ],
  lca_regulatorik: [
    "Der Rechtsrahmen gliedert sich in fünf Ebenen: Klimaziele (Green Deal, Klimagesetz), Gebäude (EPBD, GModG), Bauprodukte (BauPVO, ESPR), CO₂-Bepreisung (ETS, CBAM) und Finanzen.",
    "Die EPBD (EU) 2024/1275 fordert Nullemissionsgebäude ab 2028 für öffentliche und ab 2030 für alle Neubauten sowie die Ausweisung des Lebenszyklus-GWP im Energieausweis.",
    "Nach CRREM gilt ein Gebäude als stranded, sobald seine Betriebsemissionen über dem 1,5-°C-Pfad liegen; im Lehrpfad sinkt der Bürowert von 52 auf 18 kg CO₂e/(m²a) bis 2030.",
    "Die freie Zuteilung im EU-ETS I läuft bis 2034 aus und CBAM bepreist Importe; bei 100 €/t CO₂ verteuert sich CEM I um rund 80 €/t, was klinkerarme Bindemittel begünstigt.",
    "Praxisansätze wie Gebäudetyp E (Stand Oktober 2026 noch kein Gesetz), Urban Mining und tragender Lehmbau nach DIN 18940 ab 17,5 cm Wanddicke schonen Ressourcen.",
  ],
  material_schaeden_gross: [
    "Das Modul analysiert Großschäden wie Bad Reichenhall, Ponte Morandi und Carolabrücke als Zusammenspiel aus Werkstoffdegradation, Fehlplanung, fehlender Redundanz und Prüflücken.",
    "Bad Reichenhall 2006: UF-Leim zersetzte sich in feuchter Hallenluft hydrolytisch; UF (Typ II) ist nur in NKL 1 zulässig, für NKL 2/3 sind Typ-I-Klebstoffe nötig.",
    "Spannstahl versagt verdeckt: Verpressfehler und wasserstoffinduzierte Spannungsrisskorrosion, etwa beim Hennigsdorfer St 140/160 der Carolabrücke, kündigen sich oft nicht an.",
    "Bei Burgrain 2022 führten AKR und sekundäre Ettringitbildung in Spannbetonschwellen zum Verlust der Vorspannung; vorbeugend gilt die DAfStb-Alkali-Richtlinie.",
    "Hyatt Regency 1981 zeigt den typischen Fehler: Eine ungeprüfte Detailänderung verdoppelte die Anschlusslast auf 2P; jede Änderung erfordert eine statische Neuberechnung.",
  ],
  nachhaltigkeit_daten_regeln: [
    "Nachhaltiges Bauen bewertet nach DIN EN 15643 ökologische, ökonomische und soziokulturelle Qualität über den gesamten Lebenszyklus, ergänzt um technische und Prozessqualität.",
    "Das Bauwesen verursacht rund 40 % der energiebedingten CO₂-Emissionen (28 % Betrieb, 11–12 % graue Emissionen) und beansprucht über 50 % des weltweiten Rohstoffverbrauchs.",
    "Von 220 bis 230 Mio. t Bauabfällen in Deutschland ist Bodenaushub mit rund 130 Mio. t die größte Fraktion; Bauschutt wird zu etwa 80 % zu RC-Schotter downgecycelt.",
    "Taxonomiekonform ist ein Neubau nur mit Primärenergiebedarf mindestens 10 % unter NZEB, ab 5 000 m² zusätzlich mit offengelegtem Lebenszyklus-GWP und erfüllten DNSH-Kriterien.",
    "EPDs nach DIN EN 15804+A2 weisen GWP-total, -fossil, -biogenic und -luluc aus; generische ÖKOBAUDAT-Daten erhalten im QNG/BNB einen Sicherheitsaufschlag von 10 %.",
  ],
  rueckbau: [
    "Selektiver Rückbau läuft in Phasen: Bestandserkundung, Schadstoffkataster nach VDI 6202 Blatt 1, Entfrachtung, sortenreiner Abbruch sowie Aufbereitung und Verwertung.",
    "Schadstoffe sind vor dem mineralischen Abbruch auszubauen; erst nach erfolgreicher Freigabemessung darf der Rohbau abgebrochen werden, sonst wird der Bauschutt kontaminiert.",
    "Die Epochen-Schadstoff-Matrix leitet aus dem Baujahr Verdachtsstoffe ab: Asbest und PAK bis 1970, alte KMF und PCP von 1970 bis 1990, HBCD in EPS-Platten vor 2014.",
    "Nach § 8 GewAbfV sind Beton (17 01 01) und Ziegel (17 01 02) getrennt zu halten, soweit technisch möglich und zumutbar; ab 10 m³ Abfall ist die Getrennthaltung zu dokumentieren.",
    "Typischer Fehler: Schon 0,1 % Asbest im Putz kann bei unerkundetem Abbruch den gesamten Ziegel- und Betonbruch zu gefährlichem Abfall für die Deponie DK III machen.",
  ],
  schadensbilder: [
    "Das Modul gliedert typische Bauschäden in Feuchte und Schimmel, Risse, Korrosion und Betonschäden, stoffliche Unverträglichkeiten sowie Schäden im Tief- und Ingenieurbau.",
    "Gegen Schimmel an Wärmebrücken verlangt DIN 4108-2 f_Rsi ≥ 0,70, also θ_si ≥ 12,6 °C; Tauwasser im Bauteil wird nach Glaser gemäß DIN 4108-3 auf höchstens 1,0 kg/m² begrenzt.",
    "Risse unter 0,1 mm gelten meist als unkritisch, ab 0,3 mm ist die Ursache statisch-konstruktiv zu prüfen; entscheidend ist, ob der Riss ruht oder sich bewegt.",
    "Nach DIN EN 1504-5 verbindet EP ruhende Risse kraftschlüssig, PUR dichtet wasserführende oder bewegte Risse, Zementsuspension füllt Risse über 0,8 mm und Hohlräume.",
    "Unverträglichkeiten sind typische Fehler: Kupfer oberhalb von Zink verletzt die Fließregel, Gips auf feuchtem Beton führt zu Ettringittreiben, Weich-PVC auf EPS versprödet.",
  ],
  schadstoffe: [
    "Das Modul behandelt Gebäudeschadstoffe wie Asbest, PAK, PCB, alte KMF, PFAS und Chlorparaffine mit Vorkommen, Gefährdung, AVV-Schlüssel und Schutzausrüstung.",
    "Asbest ist in Deutschland seit dem 31. Oktober 1993 verboten; verdeckt steckt er oft in Putzen, Spachtelmassen und Fliesenklebern, die nach VDI 6202 Blatt 3 zu beproben sind.",
    "Nach § 5a GefStoffV übergibt der Veranlasser alle vorliegenden Informationen und das Baujahr; bei Errichtung zwischen 1993 und 1996 ist der Baubeginn mitzuteilen.",
    "Mineralwolle wird über den Kanzerogenitätsindex eingestuft: KI ≤ 30 bedeutet krebserzeugend Kategorie 1B, KI ≥ 40 keine Einstufung; vor Juni 2000 eingebaute KMF gelten als alt.",
    "Schutzmaßnahmen folgen dem STOP-Prinzip; bei Asbest bestimmen Akzeptanzkonzentration (10 000 F/m³) und Toleranzkonzentration (100 000 F/m³) die Risikostufe.",
  ],
  spannbeton: [
    "Vorspannung überdrückt den Querschnitt planmäßig; die Randspannungen folgen im Zustand I aus σ = −P/A_c ± P·e_p/W ∓ M/W und werden für t = 0 und t = ∞ geprüft.",
    "Hochfester Spannstahl wie Y1860 ist nötig, weil Kriech- und Schwindstauchungen von etwa 1 ‰ bei Betonstahl B500 rund 46 % der Vorspannung aufzehren würden.",
    "Im GZG gilt nach DIN EN 1992-1-1: Betondruck ≤ 0,60 f_ck unter seltener und ≤ 0,45 f_ck unter quasi-ständiger Kombination, sonst ist nichtlineares Kriechen anzusetzen.",
    "Spannkraftverluste aus Reibung, Keilschlupf und elastischer Verkürzung sowie aus Kriechen, Schwinden und Relaxation sind nach EC2 gekoppelt und dürfen nicht linear addiert werden.",
    "Vergütete Spannstähle wie Hennigsdorfer St 140/160 neigen zu Spannungsrisskorrosion ohne Vorankündigung; an Spannstahl gilt zudem ein striktes Schweißverbot.",
  ],
  stahl: [
    "S235 und S355 zeigen eine ausgeprägte Streckgrenze mit Lüders-Plateau; Vergütungs- und Spannstähle fließen stetig und werden über Dehngrenzen wie Rp0,2 bzw. f_p0,1k beschrieben.",
    "Nach DIN EN 10027-1 bedeutet S355J2+N: Baustahl mit 355 N/mm² Mindeststreckgrenze, 27 J Kerbschlagarbeit bei −20 °C und normalisierend gewalztem Lieferzustand.",
    "Betonstahl ist nach Duktilität gestaffelt: B500A mit f_t/f_y ≥ 1,05 und ε_uk ≥ 2,5 %, B500B mit ≥ 1,08 und ≥ 5,0 %, B500C mit 1,15 bis 1,35 und ≥ 7,5 %.",
    "Der E-Modul steigt nicht mit der Festigkeit; bei schlanken Tragwerken aus S460 oder S690 entscheiden daher meist Durchbiegung, Biegedrillknicken oder Beulen statt der Streckgrenze.",
    "Mehr Kohlenstoff steigert die Festigkeit, mindert aber Zähigkeit und Schweißbarkeit; an Spannstahl mit 0,80 bis 0,85 % C ist Schweißen wegen Martensitbildung streng verboten.",
  ],
};

/** Module mit mehr als ca. 4 000 Wörtern Fließtext – brauchen eine Kurzfassung */
export const KURZFASSUNG_PFLICHT: readonly string[] = ['abfaelle', 'betonpraxis', 'bp_abdichtung', 'bp_farben_lacke', 'dauerhaftigkeit', 'historische_bauprodukte', 'instandhaltung', 'ki_ueberblick', 'lca_rechner', 'lca_regulatorik', 'material_schaeden_gross', 'nachhaltigkeit_daten_regeln', 'rueckbau', 'schadensbilder', 'schadstoffe', 'spannbeton', 'stahl'];
