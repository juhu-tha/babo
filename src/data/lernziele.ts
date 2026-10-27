/**
 * Lernziele je Fachmodul (Umsetzungsplan Phase 3, AP 3.6).
 * Die Kopfzeile jedes Fachmoduls zeigt Niveau, Bearbeitungszeit, Vorwissen (mit Links) und 3–5 operationalisierte Ziele.
 * tests/lernziele.test.ts prüft Aufbau, Verweise und die Abdeckung (Ratsche).
 */
export type BloomStufe = 'Erinnern' | 'Verstehen' | 'Anwenden' | 'Analysieren' | 'Bewerten' | 'Erschaffen';

export interface Lernziel { stufe: BloomStufe; text: string }
export interface ModulLernziele {
  /** Studienniveau: B = Bachelor, M = Master, B/M = beides */
  niveau: 'B' | 'M' | 'B/M';
  /** Bearbeitungszeit in Minuten */
  minuten: number;
  /** Module, die vorher bearbeitet sein sollten (IDs aus der Registry) */
  vorwissen: string[];
  /** 3–5 operationalisierte Lernziele: „Sie können …“ + beobachtbares Verb */
  ziele: Lernziel[];
}

export const LERNZIELE: Readonly<Record<string, ModulLernziele>> = {
  biokohlebeton: {"niveau": "B/M", "minuten": 75, "vorwissen": ["bindemittel", "oekobilanz_lca"], "ziele": [{"stufe": "Verstehen", "text": "erläutern, wie Pflanzenkohle durch Pyrolyse entsteht und warum Kohlenstoffgehalt, H/C-Verhältnis und Permanenz ihre Speicherwirkung bestimmen."}, {"stufe": "Anwenden", "text": "die CO₂-Bilanz je m³ Beton aus Dosierung, Kohlenstoffgehalt mit dem Faktor 44/12, Permanenzfaktor und Herstellungsemission berechnen."}, {"stufe": "Analysieren", "text": "die Wirkung einer Pflanzenkohle-Zugabe mit der Wirkung einer Zementreduktion vergleichen und den Einfluss der Annahmen auf das Ergebnis aufzeigen."}, {"stufe": "Bewerten", "text": "Folgen von Pflanzenkohle für Wasseranspruch, Festigkeit, Karbonatisierung und Farbton beurteilen und erforderliche Prüfungen benennen."}]},
  normen_ausblick: {"niveau": "B/M", "minuten": 45, "vorwissen": ["regularien", "dauerhaftigkeit", "sicherheitskonzept"], "ziele": [{"stufe": "Verstehen", "text": "die Gründe für die neue Normengeneration (Mandat M/515, Anwendbarkeit, leistungsbezogene Dauerhaftigkeit) erläutern."}, {"stufe": "Verstehen", "text": "Aufbau und wesentliche Änderungen von DIN EN 206-1 und DIN EN 206-2:2026-07 gegenüber DIN EN 206:2021-06 beschreiben."}, {"stufe": "Anwenden", "text": "aus einer XRC-Klassenzahl die Größenordnung der Karbonatisierungstiefe nach 50 Jahren abschätzen und mit der Betondeckung vergleichen."}, {"stufe": "Analysieren", "text": "für eine Norm unterscheiden, ob sie nur erschienen oder über die MVV TB bauaufsichtlich eingeführt ist, und die maßgebende Ausgabe benennen."}, {"stufe": "Bewerten", "text": "Aussagen zum Einführungstermin der Eurocodes der 2. Generation nach ihrer Quelle als festgelegt, erwartet oder offen einordnen."}]},
  labor_potentialmessung: {"niveau": "B/M", "minuten": 120, "vorwissen": ["korrosion", "labor_sicherheit"], "ziele": [{"stufe": "Verstehen", "text": "die Passivierung von Stahl in alkalischer Lösung und die Depassivierung durch Chloridionen am Potentialverlauf erläutern."}, {"stufe": "Anwenden", "text": "das Ruhepotential mit einem hochohmigen Voltmeter gegen eine Bezugselektrode messen und protokollieren."}, {"stufe": "Anwenden", "text": "Potentiale zwischen Ag/AgCl, Kalomel, SHE und CSE umrechnen und das Cl⁻/OH⁻-Verhältnis berechnen."}, {"stufe": "Bewerten", "text": "die Potentialbereiche der ASTM C876 als Richtwerte einordnen und ihre Übertragbarkeit auf den Lösungsversuch beurteilen."}]},
  labor_auslagerung: {"niveau": "B/M", "minuten": 90, "vorwissen": ["korrosion", "metallkorrosion"], "ziele": [{"stufe": "Anwenden", "text": "einen Auslagerungsversuch mit Parallel- und Blindproben vorbereiten, durchführen und protokollieren."}, {"stufe": "Anwenden", "text": "aus Massenverlust, Oberfläche, Dichte und Dauer die Massenverlustrate und die Abtragsrate in µm/a berechnen."}, {"stufe": "Analysieren", "text": "den Einfluss von Blindwert, Versuchsdauer und Lochfraß auf das Ergebnis untersuchen."}, {"stufe": "Bewerten", "text": "die Aussagekraft gravimetrischer Korrosionsraten für verschiedene Medien vergleichend beurteilen."}]},
  labor_frischbeton: {"niveau": "B", "minuten": 90, "vorwissen": ["frischbeton", "labor_sicherheit"], "ziele": [{"stufe": "Anwenden", "text": "eine Frischbetonprobe entnehmen und Ausbreitversuch, Rohdichte- und Luftgehaltsprüfung normgerecht durchführen."}, {"stufe": "Anwenden", "text": "Ausbreitmaß, Frischbetonrohdichte und korrigierten Luftgehalt berechnen und einer Ausbreitmaßklasse zuordnen."}, {"stufe": "Analysieren", "text": "gemessenen und aus der Rohdichte berechneten Luftgehalt vergleichen und Abweichungen auf Fehlerquellen zurückführen."}]},
  labor_druckfestigkeit: {"niveau": "B", "minuten": 75, "vorwissen": ["festbeton", "festbeton_statistik"], "ziele": [{"stufe": "Anwenden", "text": "Betonwürfel herstellen, lagern und die Druckfestigkeit nach DIN EN 12390-3 mit vorgegebener Belastungsrate prüfen."}, {"stufe": "Anwenden", "text": "die Druckfestigkeit aus Höchstkraft und gemessener Fläche berechnen und trocken gelagerte Würfel umrechnen."}, {"stufe": "Analysieren", "text": "Bruchbilder als regelmäßig oder unregelmäßig einordnen und mögliche Ursachen benennen."}, {"stufe": "Bewerten", "text": "das Ergebnis vereinfacht einer Druckfestigkeitsklasse zuordnen und die Grenzen dieser Bewertung begründen."}]},
  labor_moertelprismen: {"niveau": "B", "minuten": 90, "vorwissen": ["bindemittel", "labor_sicherheit"], "ziele": [{"stufe": "Anwenden", "text": "einen Normmörtel nach DIN EN 196-1 mischen, Prismen herstellen und Biegezug- sowie Druckprüfung durchführen."}, {"stufe": "Anwenden", "text": "Biegezug- und Druckfestigkeit aus den Bruchkräften berechnen und die ±10-%-Regel anwenden."}, {"stufe": "Analysieren", "text": "die Formel der Biegezugfestigkeit aus der Biegespannung eines Einfeldträgers mit Einzellast herleiten."}, {"stufe": "Bewerten", "text": "das Prüfergebnis nach 28 Tagen einer Zementfestigkeitsklasse zuordnen und die Bedeutung der Grenzen erläutern."}]},
  schnellkarbonatisierung: {"niveau": "B/M", "minuten": 75, "vorwissen": ["korrosion", "expositionsklassen"], "ziele": [{"stufe": "Verstehen", "text": "das Wurzel-t-Gesetz der Karbonatisierung aus dem 1. Fickschen Gesetz herleiten und den Einfluss von CO₂-Konzentration und Feuchte erläutern."}, {"stufe": "Anwenden", "text": "den Ablauf der Schnellkarbonatisierung nach DIN EN 12390-12 mit Vorlagerung, 3 % CO₂, Messzeitpunkten und Phenolphthalein-Test beschreiben und durchführen."}, {"stufe": "Anwenden", "text": "den Karbonatisierungskoeffizienten K_AC durch lineare Regression der Tiefen über √t berechnen und das Bestimmtheitsmaß bewerten."}, {"stufe": "Bewerten", "text": "eine Prognose der Karbonatisierungstiefe gegenüber der Betondeckung erstellen und ihre Grenzen als Näherung beurteilen."}]},
  sommerlicher_waermeschutz: {"niveau": "B", "minuten": 60, "vorwissen": ["bauphysik", "waermeeigenschaften"], "ziele": [{"stufe": "Verstehen", "text": "die Anforderung nach § 14 GModG und die drei Nachweiswege nach DIN 4108-2 (Verzicht, Sonneneintragskennwerte, Simulation) erläutern."}, {"stufe": "Anwenden", "text": "den vorhandenen Sonneneintragskennwert S_vorh eines Raums mit g_tot = g · F_C aus Fensterflächen und Grundfläche berechnen."}, {"stufe": "Anwenden", "text": "den zulässigen Wert S_zul aus den Anteilskennwerten S1 bis S6 für Klimaregion, Bauart, Nachtlüftung und Fenstereigenschaften ermitteln."}, {"stufe": "Analysieren", "text": "prüfen, ob für einen Raum nach Tab. 6 oder der 35-%-Regel auf den rechnerischen Nachweis verzichtet werden darf."}, {"stufe": "Bewerten", "text": "Maßnahmen wie außenliegenden Sonnenschutz, Speichermasse und Nachtlüftung nach ihrer Wirkung auf den Nachweis beurteilen und auswählen."}]},
  membranen_etfe: {"niveau": "B", "minuten": 75, "vorwissen": ["kunststoffe", "glas"], "ziele": [{"stufe": "Verstehen", "text": "die Werkstoffe PVC/PES, PTFE/Glas, Silikon/Glas und ETFE nach Aufbau, Festigkeit, Lichtdurchlässigkeit und Dauerhaftigkeit unterscheiden."}, {"stufe": "Verstehen", "text": "mit der Membrangleichung begründen, warum mechanisch vorgespannte Membranen antiklastisch und pneumatisch vorgespannte synklastisch gekrümmt sind."}, {"stufe": "Anwenden", "text": "mit der Kesselformel Membrankraft und Folienspannung eines gewölbten Kissens oder Membranstreifens berechnen und mit einer zulässigen Membrankraft vergleichen."}, {"stufe": "Bewerten", "text": "Stich, Spannweite und Lagenzahl eines ETFE-Kissens hinsichtlich Tragverhalten und Wärmeschutz beurteilen."}]},
  korrosionsschutz_beschichtungen: {"niveau": "B", "minuten": 90, "vorwissen": ["metallkorrosion", "stahl"], "ziele": [{"stufe": "Anwenden", "text": "einem Stahlbauteil anhand seiner Umgebung eine Korrosivitätskategorie C1 bis CX bzw. Im1 bis Im4 nach DIN EN ISO 12944-2 zuordnen."}, {"stufe": "Verstehen", "text": "den Aufbau eines Beschichtungssystems aus Grund-, Zwischen- und Deckbeschichtung sowie die Rolle der Bindemittel EP, PUR, AY und ESI erläutern."}, {"stufe": "Anwenden", "text": "die Schutzdauer einer Feuerverzinkung aus Schichtdicke und Zinkabtragsrate berechnen und einer Schutzdauerklasse zuordnen."}, {"stufe": "Bewerten", "text": "beurteilen, ob für eine geforderte Schutzdauer eine Feuerverzinkung genügt oder ein Duplex-System erforderlich ist."}, {"stufe": "Analysieren", "text": "Prüfergebnisse aus Schichtdickenmessung, Gitterschnitt und Haftabzug auswerten und Ursachen für Kontaktkorrosion an Verbindungen erkennen."}]},
  altholz_urban_mining: {"niveau": "B/M", "minuten": 75, "vorwissen": ["abfaelle", "holz"], "ziele": [{"stufe": "Anwenden", "text": "Altholz aus Rückbau und Sperrmüll anhand von Behandlung und Herkunft den Kategorien A I bis A IV der AltholzV zuordnen und den zulässigen Verwertungsweg angeben."}, {"stufe": "Verstehen", "text": "das Prinzip der NIR-Spektroskopie zur Sortierung von Altholz erläutern und begründen, welche Beschichtungen und Holzschutzmittel sie erkennen kann und welche nicht."}, {"stufe": "Anwenden", "text": "die Sortierbilanz einer Altholzsortierung mit Fehlsortierquote, Reinheit und stofflicher Verwertungsquote berechnen."}, {"stufe": "Bewerten", "text": "den Nutzen von Materialkatastern und Urban Mining für die stoffliche Verwertung von Bauholz an einem Quartier beurteilen."}]},
  pfas_baustoffe: {"niveau": "B/M", "minuten": 75, "vorwissen": ["schadstoffe", "bauchemie"], "ziele": [{"stufe": "Erinnern", "text": "Anwendungen von PFAS in Beschichtungen, Dichtstoffen, Membranen und Löschschäumen benennen und Verdachtsbereiche im Bestand aufzählen."}, {"stufe": "Verstehen", "text": "den Stand der EU-Regulierung von PFAS (POP-Verordnung, REACH-Beschränkungen, universeller Beschränkungsvorschlag) und die Grenzwerte der TrinkwV erläutern."}, {"stufe": "Anwenden", "text": "die Summen PFAS-20 und PFAS-4 einer Wasserprobe bilden, Werte unter der Bestimmungsgrenze sachgerecht ansetzen und mit den Grenzwerten vergleichen."}, {"stufe": "Bewerten", "text": "Erkundung, Trennung und Entsorgung PFAS-belasteter Bauteile beim Rückbau planen und Analyseverfahren (Einzelstoffe, AOF, TOP-Assay) begründet auswählen."}]},
  keramik_ziegel: {"niveau": "B", "minuten": 75, "vorwissen": ["baustoffkenngroessen", "lehm"], "ziele": [{"stufe": "Verstehen", "text": "die Vorgänge beim Brand von der Abgabe des Kristallwassers der Tonminerale bis zur Sinterung den Temperaturbereichen zuordnen und erläutern."}, {"stufe": "Verstehen", "text": "Hintermauerziegel, Vormauerziegel, Klinker, Hochlochziegel und gefüllte Planziegel nach Herstellung, Kennwerten und Einsatz unterscheiden."}, {"stufe": "Anwenden", "text": "aus Trocken-, Nass- und Unterwasserwägung Wasseraufnahme, Rohdichte und offene Porosität berechnen und eine Fliese einer Gruppe nach DIN EN 14411 zuordnen."}, {"stufe": "Anwenden", "text": "das Formmaß eines Rohlings aus Fertigmaß, Trocken- und Brennschwindung berechnen."}, {"stufe": "Bewerten", "text": "die Eignung keramischer Erzeugnisse für frostbeanspruchte Bauteile anhand von Scherbenart, Wasseraufnahme und Frostwiderstandskategorie beurteilen."}]},
  stahlbau_ec3: {"niveau": "B", "minuten": 120, "vorwissen": ["stahl", "knicken"], "ziele": [{"stufe": "Verstehen", "text": "die Querschnittsklassen 1 bis 4 nach DIN EN 1993-1-1 erläutern und ein Walzprofil über die c/t-Verhältnisse von Flansch und Steg einstufen."}, {"stufe": "Anwenden", "text": "die Zugbeanspruchbarkeit eines gelochten Stabs aus N_pl,Rd und N_u,Rd berechnen und den maßgebenden Querschnitt bestimmen."}, {"stufe": "Anwenden", "text": "den Biegeknickwiderstand N_b,Rd einer Stütze aus bezogenem Schlankheitsgrad, Knicklinie und Abminderungsbeiwert χ berechnen."}, {"stufe": "Analysieren", "text": "den Einfluss von Knicklänge, Stahlgüte und Profilform auf den Knickwiderstand vergleichen und die maßgebende Knickachse begründen."}]},
  stahlbeton_bemessung: {
    niveau: 'B', minuten: 120, vorwissen: ['beton_info', 'stahlbeton_info', 'mechanische_kenngroessen'],
    ziele: [
      { stufe: 'Verstehen', text: 'die Spannungs-Dehnungs-Linien von Beton und Betonstahl nach DIN EN 1992-1-1 erläutern und den Spannungsblock begründen.' },
      { stufe: 'Anwenden', text: 'die erforderliche Biegezug- und Querkraftbewehrung eines Rechteckquerschnitts mit dem ω- bzw. Fachwerkmodell berechnen.' },
      { stufe: 'Anwenden', text: 'Stützen nach Theorie I. Ordnung mit Interaktionsdiagramm bemessen und die Grenzschlankheit prüfen.' },
      { stufe: 'Analysieren', text: 'erkennen, welcher Nachweis (Biegung, Querkraft, Durchstanzen, Rissbreite) ein Bauteil maßgebend bestimmt.' },
    ],
  },
  bauphysik: {
    niveau: 'B', minuten: 90, vorwissen: ['baustoffkenngroessen'],
    ziele: [
      { stufe: 'Anwenden', text: 'den U-Wert eines mehrschichtigen Bauteils nach DIN EN ISO 6946 berechnen und mit dem GEG-Höchstwert vergleichen.' },
      { stufe: 'Anwenden', text: 'den Temperaturverlauf in einem Bauteil ermitteln und mit dem Temperaturfaktor f_Rsi das Schimmelrisiko nach DIN 4108-2 prüfen.' },
      { stufe: 'Analysieren', text: 'die Wirkung von Speichermasse und Schichtfolge auf Phasenverschiebung und Amplitudendämpfung im sommerlichen Wärmeschutz vergleichen.' },
    ],
  },
  bodenmechanik: {
    niveau: 'B', minuten: 75, vorwissen: ['erdbau'],
    ziele: [
      { stufe: 'Anwenden', text: 'aus Wassergehalt, Fließ- und Ausrollgrenze die Konsistenzzahl berechnen und einen feinkörnigen Boden nach DIN 18196 einordnen.' },
      { stufe: 'Anwenden', text: 'mit dem Mohr-Coulomb-Kriterium prüfen, ob ein Spannungszustand zum Bruch führt.' },
      { stufe: 'Anwenden', text: 'aktiven, passiven und Ruhedruck auf eine Wand nach Rankine berechnen.' },
      { stufe: 'Verstehen', text: 'den zeitlichen Verlauf der Konsolidierungssetzung mit dem Konsolidierungsbeiwert erklären.' },
    ],
  },
  asphalt: {
    niveau: "B", minuten: 120, vorwissen: ["gesteine", "baustoffkenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "das viskoelastische Verhalten von Bitumen und dessen Folgen für Verformungs- und Ermüdungswiderstand erläutern." },
      { stufe: "Anwenden", text: "die Rohdichte und die Raumdichte eines Asphaltmischguts aus Bindemittelgehalt, Hohlraumgehalt und Dichten der Komponenten berechnen." },
      { stufe: "Analysieren", text: "den Zusammenhang zwischen Bitumengehalt und Marshall-Stabilität analysieren und einen günstigen Bindemittelgehalt ableiten." },
      { stufe: "Verstehen", text: "die Asphaltarten Asphaltbeton, Splittmastixasphalt, Gussasphalt und offenporigen Asphalt nach Aufbau und Einsatz unterscheiden." },
      { stufe: "Bewerten", text: "die Verfahren zur Temperaturabsenkung (Niedrigtemperaturasphalt) hinsichtlich Arbeitsschutz, Energiebedarf und technischer Risiken beurteilen." },
    ],
  },
  ausbau: {
    niveau: "B", minuten: 60, vorwissen: ["gips", "putzemoertel", "kunststoffe"],
    ziele: [
      { stufe: "Verstehen", text: "die Baustoffe des Ausbaus (Trockenbauplatten, Estriche, Bodenbeläge, Fliesen, Anstriche, Abdichtungen, Klebstoffe) nach Aufbau und Funktion unterscheiden." },
      { stufe: "Anwenden", text: "die Längenänderung eines Estrichfelds aus Temperaturdehnung und Schwinden berechnen und daraus die Notwendigkeit von Fugen ableiten." },
      { stufe: "Verstehen", text: "die keramischen Beläge Steingut, Steinzeug und Feinsteinzeug sowie Dispersions- und Silikatfarben nach Eigenschaften vergleichen." },
      { stufe: "Bewerten", text: "für eine Ausbausituation geeignete Estrich-, Belags- und Abdichtungsprodukte auswählen und die Wahl begründen." },
    ],
  },
  bauchemie: {
    niveau: "B", minuten: 150, vorwissen: ["baustoffkunde", "baustoffkenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "die Bindungsarten, Silicatstrukturen und die Bildung von CSH-Phasen bei der Hydratation erläutern." },
      { stufe: "Verstehen", text: "die Wirkungsweise verflüssigender Zusatzmittel durch elektrostatische Abstoßung und sterische Hinderung (PCE) unterscheiden." },
      { stufe: "Anwenden", text: "die Karbonatisierungstiefe in Abhängigkeit von Zeit und w/z-Wert abschätzen und mit der Betondeckung vergleichen." },
      { stufe: "Analysieren", text: "lösende und treibende Angriffe wie Säureangriff, Karbonatisierung, Sulfattreiben und AKR nach Mechanismus und Schadensbild unterscheiden." },
      { stufe: "Bewerten", text: "einen Oberflächenschutz durch Hydrophobierung, Imprägnierung oder Beschichtung für einen Schadensfall auswählen und begründen." },
    ],
  },
  baustatik: {
    niveau: "B", minuten: 90, vorwissen: ["einheiten"],
    ziele: [
      { stufe: "Verstehen", text: "die Lagerarten Loslager, Festlager und Einspannung nach ihren Wertigkeiten unterscheiden." },
      { stufe: "Anwenden", text: "die Auflagerkräfte statisch bestimmter Systeme wie Einfeldträger, Kragarm und Dreigelenkrahmen berechnen." },
      { stufe: "Anwenden", text: "den Querkraftverlauf V(x) und Biegemomentenverlauf M(x) für typische Lastfälle ermitteln und skizzieren." },
      { stufe: "Analysieren", text: "am Zweifeldträger den Einfluss der Lage des Mittelauflagers auf die Schnittgrößen untersuchen." },
    ],
  },
  baustoffkenngroessen: {
    niveau: "B", minuten: 150, vorwissen: ["einheiten", "baustoffkunde"],
    ziele: [
      { stufe: "Verstehen", text: "die Reindichte, Rohdichte und Schüttdichte voneinander abgrenzen und den Zusammenhang mit Porosität und Hohlraumgehalt erläutern." },
      { stufe: "Anwenden", text: "aus Massen- und Volumenangaben Dichten, Porosität und Wasseraufnahme eines Baustoffs berechnen." },
      { stufe: "Anwenden", text: "den Wasseraufnahmekoeffizienten, den s_d-Wert und den Wärmeeindringkoeffizienten eines Baustoffs aus gegebenen Kennwerten ermitteln." },
      { stufe: "Anwenden", text: "die Normalspannung, elastische Dehnung, Verkürzung und Ausnutzungsgrad einer zentrisch gedrückten Säule berechnen." },
      { stufe: "Analysieren", text: "elastische Dehnung, Kriechen, Schwinden und Relaxation im zeitlichen Verlauf unterscheiden und ihren Einfluss auf die Gesamtverformung vergleichen." },
    ],
  },
  baustoffkunde: {
    niveau: "B", minuten: 45, vorwissen: [],
    ziele: [
      { stufe: "Erinnern", text: "die wesentlichen Entwicklungsschritte vom Opus caementicium über den Portlandzement bis zum Stahlbeton in die richtige zeitliche Reihenfolge bringen." },
      { stufe: "Erinnern", text: "bedeutende Pioniere wie Vitruv, Aspdin, Vicat, Monier, Mörsch und Powers ihren Beiträgen zur Baustoffentwicklung zuordnen." },
      { stufe: "Verstehen", text: "die Baustoffgruppen (mineralisch, metallisch, organisch-biogen, synthetisch-polymer, Verbund) anhand ihrer typischen Eigenschaften unterscheiden." },
      { stufe: "Verstehen", text: "am Skalen-Prinzip erläutern, wie Bauteileigenschaften wie Druckfestigkeit oder Wärmeleitfähigkeit auf kleineren Betrachtungsebenen bestimmt werden." },
      { stufe: "Anwenden", text: "für eine Bauaufgabe eine geeignete Baustoffgruppe nach Festigkeit, Dauerhaftigkeit und Treibhauspotenzial auswählen und die Wahl begründen." },
    ],
  },
  bauwerkserfassung: {
    niveau: "B/M", minuten: 90, vorwissen: ["bestand", "holzbau_bemessung"],
    ziele: [
      { stufe: "Verstehen", text: "die Genauigkeitsstufen I bis IV der Bauaufnahme unterscheiden und typischen Aufgaben zuordnen." },
      { stufe: "Analysieren", text: "das Handaufmaß, die Tachymetrie, das terrestrische Laserscanning und die Photogrammetrie nach Genauigkeit, Aufwand und Einsatzbereich vergleichen." },
      { stufe: "Verstehen", text: "die Prozesskette einer Punktwolke von der Erfassung über Registrierung bis zum Export erläutern." },
      { stufe: "Anwenden", text: "für einen aufgemessenen, vorverformten Holzsparren die Spannungen aus Normalkraft und Biegung berechnen und den Interaktionsnachweis nach Eurocode 5 führen." },
    ],
  },
  bauwerksunters_monitoring: {
    niveau: "B/M", minuten: 90, vorwissen: ["bauwerksuntersuchung", "messen_pruefen"],
    ziele: [
      { stufe: "Verstehen", text: "den Aufbau und Einsatzzweck eines Structural-Health-Monitorings mit Riss- und Dehnungsaufnehmern erläutern." },
      { stufe: "Analysieren", text: "die Bohrwiderstandsprofile von Hölzern auswerten und gesunde Querschnitte von Kernfäule und Hohlräumen unterscheiden." },
      { stufe: "Anwenden", text: "die Belegreife eines Estrichs mit der CM-Methode ermitteln." },
      { stufe: "Bewerten", text: "gemessene Rückprallwerte unter Berücksichtigung von Karbonatisierungstiefe und Betonalter auswerten und die Grenzen einer Festigkeitsabschätzung ohne Kalibrierung nach DIN EN 13791 begründen." },
      { stufe: "Bewerten", text: "geeignete Verfahren aus dem ZfP-Methodenkatalog für eine Überwachungsaufgabe auswählen." },
    ],
  },
  bauwerksuntersuchung: {
    niveau: "B/M", minuten: 120, vorwissen: ["bestand", "messen_pruefen", "korrosion"],
    ziele: [
      { stufe: "Verstehen", text: "die Phasen einer Tragwerksdiagnose von der Archivrecherche bis zur zerstörenden Laborprüfung erläutern." },
      { stufe: "Verstehen", text: "zerstörungsfreie Prüfverfahren wie Rückprallhammer, Ultraschall und Bewehrungsortung nach Messprinzip und Aussagekraft unterscheiden." },
      { stufe: "Anwenden", text: "die Probenahme- und Messstellen planen und aus Prüfergebnissen charakteristische Werte nach DIN EN 13791 ermitteln." },
      { stufe: "Analysieren", text: "die Messbefunde zu Betondeckung, Karbonatisierung und Chloridgehalt an Fallbeispielen interpretieren und Schadensursachen ableiten." },
      { stufe: "Bewerten", text: "für eine Untersuchungsaufgabe geeignete Prüfverfahren auswählen und ihre Grenzen begründen." },
    ],
  },
  betonkennwerte: {
    niveau: "B/M", minuten: 120, vorwissen: ["festbeton", "mechanische_kenngroessen"],
    ziele: [
      { stufe: "Anwenden", text: "für eine Festigkeitsklasse den Bemessungswert der Druckfestigkeit, die mittlere Zugfestigkeit und den E-Modul nach DIN EN 1992-1-1 berechnen." },
      { stufe: "Anwenden", text: "die Festigkeitsentwicklung mit dem Beiwert β_cc(t) für ein gegebenes Betonalter ermitteln." },
      { stufe: "Verstehen", text: "die Spannungs-Dehnungs-Linien für Schnittgrößenermittlung und Querschnittsbemessung unterscheiden." },
      { stufe: "Anwenden", text: "das Trocknungsschwinden, autogenes Schwinden und Kriechzahl in Abhängigkeit von wirksamer Bauteildicke und Feuchte ermitteln." },
      { stufe: "Analysieren", text: "die Bedeutung der Betonkennwerte für die Nachweise der Tragwerksplanung zuordnen und Neuerungen der 2. Generation des Eurocode 2 benennen." },
    ],
  },
  betonpraxis: {
    niveau: "B", minuten: 120, vorwissen: ["expositionsklassen", "frischbeton", "nachbehandlung"],
    ziele: [
      { stufe: "Anwenden", text: "den Überschusswasser-Quotient (w − 70)/MK einer Rezeptur berechnen und den Zusammenhalt des Frischbetons beurteilen." },
      { stufe: "Anwenden", text: "die Auswirkung nachträglicher Wasser- und Luftzugabe auf der Baustelle auf w/z-Wert und Festigkeit abschätzen." },
      { stufe: "Anwenden", text: "die In-situ-Druckfestigkeit aus Bohrkernprüfungen nach DIN EN 13791 ermitteln." },
      { stufe: "Bewerten", text: "für Wände, Bodenplatten und Dächer aus WU-Beton Mindestdicken und Einbaukonzepte nach praxisbewährten Regeln auswählen und begründen." },
    ],
  },
  bim_baustoffe: {
    niveau: "B/M", minuten: 45, vorwissen: ["baustoffkenngroessen", "bauphysik"],
    ziele: [
      { stufe: "Verstehen", text: "den Unterschied zwischen Vektorlinien im 2D-CAD und semantisch attribuierten Bauteilobjekten im BIM-Modell erläutern." },
      { stufe: "Verstehen", text: "baustoffbezogene Parameter wie Rohdichte, E-Modul, Wärmeleitfähigkeit und GWP den Fachdisziplinen Tragwerksplanung, Bauphysik, LCA und Facility Management zuordnen." },
      { stufe: "Anwenden", text: "mit dem Attributgenerator eine IFC-Materialstruktur mit IfcMaterial, Beziehungsentität und Property-Sets erzeugen und deren Entitäten erläutern." },
      { stufe: "Anwenden", text: "aus BIM-Mengen (Volumen, Rohdichte) und EPD-Kennwerten das Treibhauspotenzial einer Wand sowie aus Materialattributen ihren U-Wert berechnen." },
      { stufe: "Analysieren", text: "typische Fehlerquellen bei der Verknüpfung von BIM-Modell und EPD-Datenbank, etwa Brutto- statt Nettovolumen oder fehlende Material-IDs, analysieren." },
    ],
  },
  bindemittel: {
    niveau: "B", minuten: 90, vorwissen: ["grundlagen", "bauchemie"],
    ziele: [
      { stufe: "Verstehen", text: "die Klinkerphasen C3S, C2S, C3A und C4AF hinsichtlich Reaktionsgeschwindigkeit, Festigkeitsbeitrag und Hydratationswärme vergleichen." },
      { stufe: "Anwenden", text: "aus einer chemischen Oxidanalyse die Klinkerphasenanteile nach Bogue berechnen." },
      { stufe: "Verstehen", text: "die hydraulische, latent-hydraulische und puzzolanische Erhärtung anhand der Reaktionsgleichungen erläutern." },
      { stufe: "Analysieren", text: "die Normzemente nach DIN EN 197-1 und DIN EN 197-5 anhand von Hauptbestandteilen, Festigkeitsklasse und Zusatzbezeichnungen unterscheiden." },
      { stufe: "Bewerten", text: "für eine gegebene Bauaufgabe, etwa ein massiges Bauteil, eine geeignete Zementart mit niedriger Wärmeentwicklung auswählen und begründen." },
    ],
  },
  boden_materialaufbereitung: {
    niveau: "B/M", minuten: 120, vorwissen: ["abfaelle", "rueckbau", "erdbau"],
    ziele: [
      { stufe: "Verstehen", text: "die Anforderungen von Ersatzbaustoffverordnung, Bundes-Bodenschutzverordnung und Gewerbeabfallverordnung an die Materialaufbereitung erläutern." },
      { stufe: "Anwenden", text: "für ein Haufwerk Probenanzahl und Probenmenge nach LAGA PN 98 aus Volumen und Größtkorn ermitteln." },
      { stufe: "Anwenden", text: "ein Probenahmeprotokoll nach LAGA PN 98 vollständig erstellen." },
      { stufe: "Analysieren", text: "für Boden- und Bauschuttgemische mit unterschiedlichen Schadstoffen geeignete Aufbereitungsverfahren auswählen." },
      { stufe: "Bewerten", text: "die Maßnahmen der Güteüberwachung für die Qualitätssicherung von Ersatzbaustoffen begründen." },
    ],
  },
  bp_abdichtung: {
    niveau: "B", minuten: 75, vorwissen: ["ausbau", "wu-bauwerke"],
    ziele: [
      { stufe: "Verstehen", text: "die Wasserbeanspruchungsklassen W1-E bis W4-E nach DIN 18533 (bis 2017-07: Wassereinwirkungsklassen) anhand von Baugrund und Grundwasserstand unterscheiden." },
      { stufe: "Anwenden", text: "für eine Bauwerksabdichtung die Wassereinwirkungsklasse bestimmen und ein Abdichtungssystem wie PMBC oder FPD auswählen." },
      { stufe: "Anwenden", text: "die erforderliche Nassschichtdicke einer PMBC-Abdichtung aus der Mindesttrockenschichtdicke und dem Feststoffanteil berechnen." },
      { stufe: "Analysieren", text: "die Fugenabdichtungen Fugenblech, Fugenband, Quellband und Injektionsschläuche für Arbeits- und Dehnungsfugen in WU-Bauteilen vergleichen." },
      { stufe: "Bewerten", text: "für einen Riss einen Injektionsstoff (Acrylatgel, PUR- oder EP-Harz) nach dessen Zustand (trocken, wasserführend, bewegt) auswählen und begründen." },
    ],
  },
  bp_befestigung: {
    niveau: "B/M", minuten: 45, vorwissen: ["bp_beton", "sicherheitskonzept"],
    ziele: [
      { stufe: "Verstehen", text: "die Befestigungsmittel Spreizdübel, Bolzenanker, Verbunddübel und Hinterschnittanker nach Wirkprinzip (Reib-, Stoff-, Formschluss) unterscheiden." },
      { stufe: "Verstehen", text: "die Versagensarten von Befestigungen in Beton wie Herausziehen, Betonausbruch, Spalten, Kantenbruch und Stahlversagen erläutern." },
      { stufe: "Anwenden", text: "den charakteristischen Widerstand gegen Betonausbruch eines Einzeldübels im gerissenen Beton nach DIN EN 1992-4 berechnen." },
      { stufe: "Analysieren", text: "den Einfluss der Verankerungstiefe hef auf die Betonausbruchlast quantitativ untersuchen." },
      { stufe: "Bewerten", text: "anhand von Untergrund, Rissbildung und Beanspruchung ein Befestigungssystem mit passender ETA auswählen." },
    ],
  },
  bp_betonfertigteile: {
    niveau: "B", minuten: 90, vorwissen: ["bp_beton", "stahlbeton_info"],
    ziele: [
      { stufe: "Verstehen", text: "den Aufbau von Filigrandecke, Doppelwand und Hohlplatte mit ihren Bestandteilen beschreiben." },
      { stufe: "Anwenden", text: "die Eigenlasteinsparung einer Hohlplatte gegenüber einer Massivdecke gleicher Höhe berechnen." },
      { stufe: "Verstehen", text: "die Konstruktionsklassen von Betonfertigteilen im Hoch- und Tiefbau unterscheiden." },
      { stufe: "Bewerten", text: "die Vor- und Nachteile von Fertigteil- und Halbfertigteilsystemen gegenüber Ortbeton für ein Bauvorhaben abwägen." },
    ],
  },
  bp_betonwaren: {
    niveau: "B", minuten: 75, vorwissen: ["bp_beton", "gesteine"],
    ziele: [
      { stufe: "Verstehen", text: "den zweischichtigen Aufbau von Pflastersteinen aus Vorsatz- und Kernbeton sowie die Herstellung mit erdfeuchter Konsistenz und Sofortentschalung erläutern." },
      { stufe: "Anwenden", text: "die Spaltzugfestigkeit und die Bruchlast je Länge eines Pflastersteins aus Prüfdaten berechnen und mit den Anforderungen vergleichen." },
      { stufe: "Verstehen", text: "den Aufbau und das Dichtungsprinzip von Betonrohren mit Glockenmuffe beschreiben." },
      { stufe: "Analysieren", text: "die Ursachen der biogenen Schwefelsäurekorrosion in Abwasserleitungen analysieren und Gegenmaßnahmen ableiten." },
    ],
  },
  bp_betonzusatzmittel: {
    niveau: "B", minuten: 60, vorwissen: ["grundlagen", "bindemittel", "frischbeton"],
    ziele: [
      { stufe: "Erinnern", text: "die Betonzusatzmittel ihren Wirkungsgruppen nach DIN EN 934-2 (z. B. BV, FM, LP, VZ, BE) zuordnen." },
      { stufe: "Verstehen", text: "die elektrostatische und sterische Dispergierwirkung von Betonverflüssigern und PCE-Fließmitteln erläutern." },
      { stufe: "Anwenden", text: "aus Zementgehalt und Dosierung die Zusatzmittelmenge, deren Wasseranteil und den wirksamen w/z-Wert berechnen." },
      { stufe: "Bewerten", text: "den Chlorideintrag eines Zusatzmittels für unbewehrten, Stahl- und Spannbeton beurteilen." },
    ],
  },
  bp_dach_fassade: {
    niveau: "B", minuten: 60, vorwissen: ["bauphysik", "glas"],
    ziele: [
      { stufe: "Verstehen", text: "die Dachdeckungen Tondachziegel, Betondachsteine, Schiefer und Metalldeckungen hinsichtlich Ausgangsstoff, Gewicht und Dauerhaftigkeit unterscheiden." },
      { stufe: "Verstehen", text: "den Aufbau einer vorgehängten hinterlüfteten Fassade (VHF) mit Bekleidung, Unterkonstruktion und Lüftungsspalt erläutern." },
      { stufe: "Anwenden", text: "den Fenster-U-Wert Uw nach DIN EN ISO 10077-1 aus Ug, Uf, Ψg und den Flächenanteilen berechnen." },
      { stufe: "Analysieren", text: "den Einfluss von Rahmenbreite, Randverbund und g-Wert auf Wärmeverlust und solare Gewinne eines Fensters vergleichen." },
    ],
  },
  bp_daemmung: {
    niveau: "B", minuten: 50, vorwissen: ["daemmstoffe", "bauphysik"],
    ziele: [
      { stufe: "Verstehen", text: "die Dämmstoffe EPS, XPS, Mineralwolle, Schaumglas, Holzfaser, Zellulose und VIP nach Wärmeleitfähigkeit, Brandverhalten und Feuchtebeständigkeit unterscheiden." },
      { stufe: "Anwenden", text: "die erforderliche Dämmstoffdicke für einen Ziel-U-Wert aus der Wärmeleitfähigkeit berechnen." },
      { stufe: "Anwenden", text: "den U-Wert einer mit WDVS gedämmten Außenwand berechnen." },
      { stufe: "Bewerten", text: "geeignete Dämmstoffe für Perimeterdämmung, WDVS und Innendämmung auswählen und die Eignung begründen." },
    ],
  },
  bp_farben_lacke: {
    niveau: "B", minuten: 90, vorwissen: ["bauchemie", "metallkorrosion", "schutz_grundlagen"],
    ziele: [
      { stufe: "Verstehen", text: "die Bestandteile eines Beschichtungsstoffs (Bindemittel, Lösemittel, Pigmente, Füllstoffe, Additive) und ihre Funktion erläutern." },
      { stufe: "Verstehen", text: "physikalische Trocknung, oxidative Härtung und chemische Vernetzung von EP- und PUR-Systemen unterscheiden." },
      { stufe: "Anwenden", text: "aus Trockenschichtdicke, Festkörpervolumenanteil, Verdünnung und Verlustfaktor Nassschichtdicke und Materialbedarf einer Beschichtung berechnen." },
      { stufe: "Analysieren", text: "die Fassadenfarben auf Dispersions-, Silikat- und Dispersionssilikatbasis hinsichtlich Filmbildung, Diffusionsverhalten und Untergrundeignung vergleichen." },
      { stufe: "Bewerten", text: "für Betonflächen wie Tiefgaragen ein Oberflächenschutzsystem (OS) nach Belastung und Rissüberbrückung auswählen." },
    ],
  },
  bp_glaeser: {
    niveau: "B", minuten: 75, vorwissen: ["glas", "bauphysik"],
    ziele: [
      { stufe: "Verstehen", text: "die Glasarten Floatglas, ESG, TVG und VSG nach Herstellung, Bruchbild und Anwendung nach DIN 18008 unterscheiden." },
      { stufe: "Verstehen", text: "den Aufbau und die Wirkung von Mehrscheiben-Isolierglas mit Edelgasfüllung, Low-E-Beschichtung und warmer Kante erläutern." },
      { stufe: "Anwenden", text: "den Uw-Wert eines Fensters nach DIN EN ISO 10077-1 für verschiedene Abstandhalter berechnen und auf GEG-Konformität prüfen." },
      { stufe: "Anwenden", text: "die Bemessungsfestigkeit von Floatglas, TVG und ESG berechnen und vergleichen." },
      { stufe: "Bewerten", text: "den Glasaufbau und den Rahmenwerkstoff eines Fensters für Wärme-, Sonnen- und Schallschutzanforderungen auswählen." },
    ],
  },
  bp_holzprodukte: {
    niveau: "B", minuten: 60, vorwissen: ["holz", "holzwerkstoffe", "sicherheitskonzept"],
    ziele: [
      { stufe: "Verstehen", text: "die Holzbauprodukte KVH, Brettschichtholz, Brettsperrholz und Furnierschichtholz nach Aufbau, Festigkeitsklasse und Einsatzbereich unterscheiden." },
      { stufe: "Verstehen", text: "die Maßnahmen des baulichen Holzschutzes nach DIN 68800 erläutern." },
      { stufe: "Anwenden", text: "einen Einfeldträger aus Holz mit kmod und γM vereinfacht nach DIN EN 1995-1-1 auf Biegung und Schub nachweisen." },
      { stufe: "Anwenden", text: "die elastische Durchbiegung eines Holzbalkens berechnen und mit einem Grenzwert vergleichen." },
      { stufe: "Analysieren", text: "die Wirkung von Querschnittshöhe, Spannweite und Festigkeitsklasse auf die Ausnutzung eines Holzträgers vergleichen." },
    ],
  },
  bp_innovationen: {
    niveau: "B/M", minuten: 90, vorwissen: ["bp_recht_grundlagen", "carbonbeton"],
    ziele: [
      { stufe: "Verstehen", text: "die Stufen des Technology Readiness Level (TRL 1–9) für die Entwicklung von Bauprodukten erläutern." },
      { stufe: "Anwenden", text: "mit dem Reifegrad-Check den TRL eines Bauprodukt-Projekts ermitteln und den nächsten Entwicklungsschritt ableiten." },
      { stufe: "Verstehen", text: "den nationalen (DIBt: abZ/aBG) und den europäischen Weg (ETA) zum Verwendbarkeitsnachweis für innovative Bauprodukte unterscheiden." },
      { stufe: "Anwenden", text: "den erforderlichen Bewehrungsquerschnitt für Betonstahl und Carbonbewehrung bei gleicher Zugkraft berechnen und vergleichen." },
      { stufe: "Bewerten", text: "innovative Werkstoffe wie Carbonbeton, Geopolymere, Myzel-Baustoffe oder CO₂-mineralisierten Beton hinsichtlich Reife und Markthürden beurteilen." },
    ],
  },
  bp_klebstoffe: {
    niveau: "B", minuten: 40, vorwissen: ["kunststoffe", "waermeeigenschaften"],
    ziele: [
      { stufe: "Verstehen", text: "die Dichtstoffe Silikon, Acrylat, Polyurethan und MS-Hybrid-Polymere nach Verformbarkeit, Haftung und Überstreichbarkeit unterscheiden." },
      { stufe: "Verstehen", text: "die Begriffe Adhäsion und Kohäsion sowie die Folgen einer Dreiflankenhaftung erläutern." },
      { stufe: "Anwenden", text: "die Mindestfugenbreite einer Außenwandfuge aus Bauteillänge, Temperaturdifferenz, Wärmedehnzahl und zulässiger Gesamtverformung des Dichtstoffs berechnen." },
      { stufe: "Anwenden", text: "die Fugentiefe und den Durchmesser der Hinterfüllschnur für eine berechnete Fugenbreite festlegen." },
    ],
  },
  bp_kunststoffe: {
    niveau: "B", minuten: 75, vorwissen: ["kunststoffe", "materialmodelle"],
    ziele: [
      { stufe: "Verstehen", text: "die Kunststoffgruppen Thermoplaste, Duroplaste und Elastomere sowie gängige Kurzzeichen nach DIN EN ISO 1043-1 ihren Bauanwendungen zuordnen." },
      { stufe: "Anwenden", text: "die thermische Längenänderung eines Kunststoffbauteils berechnen und mit Stahl und Beton vergleichen." },
      { stufe: "Anwenden", text: "die Kriechdehnung eines Polymers mit dem Burgers-Modell aus elastischem, verzögert elastischem und viskosem Anteil berechnen." },
      { stufe: "Analysieren", text: "die Kunststoffanwendungen Kanalrohr, Hausabflussrohr, Dachbahn und Geotextil hinsichtlich der maßgebenden Anforderungen wie Ringsteifigkeit und Temperaturbeständigkeit vergleichen." },
    ],
  },
  bp_lehmbauprodukte: {
    niveau: "B", minuten: 60, vorwissen: ["lehm", "mauerwerk"],
    ziele: [
      { stufe: "Erinnern", text: "die Lehmbauprodukte Lehmsteine, Lehmmauermörtel, Lehmputzmörtel und Lehmplatten den Produktnormen DIN 18945 bis DIN 18948 zuordnen." },
      { stufe: "Verstehen", text: "die Anwendungsklassen von Lehmsteinen und die Druckfestigkeitsklassen von Lehmmauermörtel erläutern." },
      { stufe: "Anwenden", text: "die Schlankheit, den Abminderungsbeiwert und Bemessungswert der Tragfähigkeit einer Lehmsteinwand nach vereinfachtem Ansatz der DIN 18940 berechnen." },
      { stufe: "Analysieren", text: "die Ausführung von Lehmbauteilen auf konstruktiven Feuchteschutz durch Spritzwasser-, Niederschlagsschutz und Diffusionsoffenheit prüfen." },
    ],
  },
  bp_mauerwerk: {
    niveau: "B", minuten: 75, vorwissen: ["mauerwerk", "sicherheitskonzept"],
    ziele: [
      { stufe: "Verstehen", text: "die Mauersteine und Mauermörtel als Bauprodukte nach Material, Eigenschaften und Einsatz vergleichen." },
      { stufe: "Anwenden", text: "die charakteristische Druckfestigkeit und den Bemessungswert von Mauerwerk nach Eurocode 6 berechnen und die Wandtragfähigkeit je Meter ermitteln." },
      { stufe: "Verstehen", text: "die Wandsysteme wie einschaliges Mauerwerk mit WDVS, zweischaliges Verblendmauerwerk und gefüllte Steine nach Aufbau und Funktion unterscheiden." },
      { stufe: "Bewerten", text: "für eine Außenwand ein geeignetes Mauerwerkssystem aus Stein, Mörtel und Dämmung auswählen und begründen." },
    ],
  },
  bp_metallisch: {
    niveau: "B", minuten: 50, vorwissen: ["metalle", "metallkorrosion"],
    ziele: [
      { stufe: "Verstehen", text: "die Baumetalle verzinkter Stahl, Aluminium, Edelstahl, Titanzink, Kupfer und wetterfester Baustahl nach Dichte, Korrosionsverhalten und Anwendung unterscheiden." },
      { stufe: "Anwenden", text: "die Eigenlast und Gesamtmasse von Blechen und Platten aus Abmessungen und Rohdichte berechnen." },
      { stufe: "Anwenden", text: "die Wärmedehnung einer Titanzink-Dachbahn berechnen." },
      { stufe: "Bewerten", text: "die Metallkombination von Verbindungsmittel und Bauteil anhand der galvanischen Spannungsreihe auf Kontaktkorrosionsgefahr beurteilen." },
    ],
  },
  bp_mineralisch: {
    niveau: "B", minuten: 40, vorwissen: ["glas", "gesteine"],
    ziele: [
      { stufe: "Verstehen", text: "die Glasarten Floatglas, ESG und VSG nach Bruchbild und Eignung für absturzsichernde und Überkopfverglasungen unterscheiden." },
      { stufe: "Verstehen", text: "die Fliesenarten Feinsteinzeug, Steinzeug und Steingut nach Wasseraufnahme und Einsatzbereich unterscheiden." },
      { stufe: "Anwenden", text: "die trockene und die wassergesättigte Flächenlast eines Fliesen- oder Natursteinbelags berechnen." },
      { stufe: "Analysieren", text: "die Natursteine Granit und Marmor hinsichtlich Härte, Säure- und Frostbeständigkeit vergleichen und ihre Eignung für Außen- und Nassbereiche begründen." },
    ],
  },
  bp_putz_estrich: {
    niveau: "B", minuten: 45, vorwissen: ["putzemoertel", "gips", "kalk"],
    ziele: [
      { stufe: "Verstehen", text: "die Putzmörtel Gips-, Kalk-, Kalkzement- und Sanierputze nach Bindemittel, Druckfestigkeitsklasse und Einsatzbereich unterscheiden." },
      { stufe: "Verstehen", text: "die Wirkungsweise von Sanierputz bei salzbelastetem, feuchtem Mauerwerk und seine Grenzen erläutern." },
      { stufe: "Analysieren", text: "den Zement-, Calciumsulfat- und Gussasphaltestrich hinsichtlich Schwinden, Feuchteempfindlichkeit und Belegreife vergleichen." },
      { stufe: "Anwenden", text: "für eine gegebene Nutzung ein geeignetes Putz- oder Estrichsystem auswählen und die Wahl begründen." },
    ],
  },
  bp_recht_konformitaet: {
    niveau: "B/M", minuten: 45, vorwissen: ["bp_recht_grundlagen", "bp_recht_avcp"],
    ziele: [
      { stufe: "Verstehen", text: "die Begriffe Akkreditierung, Notifizierung, Zertifizierung, Verifizierung und Auditierung voneinander abgrenzen." },
      { stufe: "Erinnern", text: "den beteiligten Institutionen (DAkkS, DIBt, notifizierte Stelle, Verifizierer) ihre Rollen im Überwachungssystem zuordnen." },
      { stufe: "Anwenden", text: "den Ablauf eines Bauprodukt-Verfahrens vom Kompetenznachweis bis zur Zertifizierung in der richtigen Reihenfolge darstellen." },
      { stufe: "Analysieren", text: "an Fallbeispielen unterscheiden, ob eine Produkt- oder Systemzertifizierung, eine EPD-Verifizierung oder eine Fremdüberwachung vorliegt." },
    ],
  },
  bp_trockenbau: {
    niveau: "B", minuten: 60, vorwissen: ["gips", "brandschutz", "schallschutz"],
    ziele: [
      { stufe: "Erinnern", text: "die Plattentypen GKB, GKBI, GKF, DFIR und Gipsfaserplatten anhand von Kennfarbe und Einsatzbereich zuordnen." },
      { stufe: "Verstehen", text: "die Brandschutzwirkung von Gipsplatten über die Abgabe des Kristallwassers erläutern." },
      { stufe: "Verstehen", text: "die Oberflächenqualitäten Q1 bis Q4 der Verspachtelung nach Anforderung und Ausführung unterscheiden." },
      { stufe: "Anwenden", text: "für eine Metallständerwand den Materialbedarf an Platten, CW- und UW-Profilen, Schrauben, Spachtelmasse und Dämmung ermitteln." },
      { stufe: "Analysieren", text: "die Wandsysteme mit einfacher, doppelter Beplankung und Doppelständer hinsichtlich Schall- und Brandschutz vergleichen." },
    ],
  },
  bp_verkehr_asphalt: {
    niveau: "B", minuten: 45, vorwissen: ["asphalt", "gesteine"],
    ziele: [
      { stufe: "Verstehen", text: "die Asphaltsorten Asphaltbeton (AC), Splittmastixasphalt (SMA), Gussasphalt (MA) und offenporigen Asphalt (PA) nach Korngerüst, Bindemittelgehalt und Hohlraumgehalt unterscheiden." },
      { stufe: "Verstehen", text: "die Funktion von Zellulosefasern im SMA und das Einbauprinzip von Gussasphalt ohne Walzverdichtung erläutern." },
      { stufe: "Anwenden", text: "für eine Verkehrsfläche mit gegebener Beanspruchung eine geeignete Asphaltsorte auswählen und die Wahl begründen." },
      { stufe: "Analysieren", text: "ungebundene Tragschichten (STS, FSS) und hydraulisch gebundene Tragschichten hinsichtlich Lastabtrag und Anforderungen an die Gesteinskörnung vergleichen." },
    ],
  },
  bp_verkehr_bahn: {
    niveau: "B", minuten: 50, vorwissen: ["gesteine", "stahl", "knicken"],
    ziele: [
      { stufe: "Verstehen", text: "den Schotteroberbau und die Feste Fahrbahn in Aufbau, Lastabtrag sowie Vor- und Nachteilen unterscheiden." },
      { stufe: "Verstehen", text: "die Anforderungen an Gleisschotter nach DIN EN 13450 und die Kenndaten des Schienenprofils UIC 60 erläutern." },
      { stufe: "Anwenden", text: "die thermische Längsspannung und Längskraft im lückenlos verschweißten Gleis aus der Differenz zur Neutraltemperatur berechnen." },
      { stufe: "Bewerten", text: "das Verwerfungsrisiko eines Gleises in Abhängigkeit von Bettungsqualität und Querverschiebewiderstand beurteilen." },
    ],
  },
  bp_verkehr_betondecken: {
    niveau: "B/M", minuten: 75, vorwissen: ["bp_beton", "expositionsklassen", "schadreaktionen_beton"],
    ziele: [
      { stufe: "Verstehen", text: "die Anforderungen an Fahrbahndecken aus Beton wie Expositionsklassen XF4/XM2, Waschbetonoberfläche und Fugenausbildung mit Dübeln und Ankern erläutern." },
      { stufe: "Anwenden", text: "die Biegezugspannung einer Betonplatte unter Radlast mit der Westergaard-Gleichung berechnen und die Deckendicke prüfen." },
      { stufe: "Anwenden", text: "einen gemessenen Luftporengehalt in Abhängigkeit vom Größtkorn der Gesteinskörnung auf Einhaltung des Sollbereichs prüfen." },
      { stufe: "Analysieren", text: "den Einfluss von Scheinfugenabstand und Plattendicke auf das Risiko unkontrollierter Rissbildung analysieren." },
      { stufe: "Bewerten", text: "das AKR-Risiko einer Betondecke aus Gesteinskörnung, Alkaligehalt des Zements und Tausalzeinwirkung beurteilen." },
    ],
  },
  bp_verkehr_bitumen: {
    niveau: "B", minuten: 40, vorwissen: ["asphalt", "gesteine"],
    ziele: [
      { stufe: "Verstehen", text: "das thermoplastische Verhalten von Bitumen und die Bezeichnung von Straßenbaubitumen nach Penetrationsbereich (z. B. 50/70) erläutern." },
      { stufe: "Verstehen", text: "die Prüfverfahren Nadelpenetration und Erweichungspunkt Ring und Kugel in Ablauf und Aussage beschreiben." },
      { stufe: "Analysieren", text: "das Verhalten von Straßenbaubitumen und polymermodifiziertes Bitumen (PmB) hinsichtlich Wärmestandfestigkeit und Kälteflexibilität vergleichen." },
      { stufe: "Bewerten", text: "die Gesteinskörnungen einer Asphaltdeckschicht anhand des PSV-Polierwerts auf ihre Eignung beurteilen." },
    ],
  },
  bp_verkehr_pruefung: {
    niveau: "B", minuten: 45, vorwissen: ["bp_verkehr_asphalt", "asphalt"],
    ziele: [
      { stufe: "Verstehen", text: "die Herstellung und Prüfung von Marshall-Probekörpern sowie die Kenngrößen Marshall-Stabilität und Fließwert erläutern." },
      { stufe: "Verstehen", text: "den Zweck und Ablauf des Spurbildungsversuchs (Wheel-Tracking) zur Beurteilung der Verformungsbeständigkeit beschreiben." },
      { stufe: "Anwenden", text: "aus Bitumengehalt, Rohdichten und Raumdichte die Maximaldichte und den Hohlraumgehalt eines Asphaltprobekörpers berechnen." },
      { stufe: "Bewerten", text: "einen berechneten Hohlraumgehalt mit dem Zielbereich vergleichen und die Folgen eines zu dichten oder zu offenen Gefüges begründen." },
    ],
  },
  bp_verkehr_rsto: {
    niveau: "B", minuten: 60, vorwissen: ["asphalt", "erdbau"],
    ziele: [
      { stufe: "Erinnern", text: "die Belastungsklassen Bk0,3 bis Bk100 typischen Straßenkategorien zuordnen." },
      { stufe: "Verstehen", text: "die Ermittlung der bemessungsrelevanten Beanspruchung B aus Verkehrsstärke und Achszahl-, Spurbreiten- und Achslastfaktor erläutern." },
      { stufe: "Anwenden", text: "für eine gegebene Belastungsklasse einen Oberbau in Asphalt- oder Betonbauweise mit Schichtfolge und Schichtdicken nach RStO 12/24 zusammenstellen." },
      { stufe: "Anwenden", text: "die Tragfähigkeit des Planums anhand des Verformungsmoduls EV2 aus dem Plattendruckversuch prüfen und Maßnahmen bei Unterschreitung ableiten." },
    ],
  },
  bp_verkehr_tiefbau: {
    niveau: "B", minuten: 60, vorwissen: ["kunststoffe", "erdbau"],
    ziele: [
      { stufe: "Erinnern", text: "die Produktgruppen des Tiefbaus wie Anschlussformteile, Dränleitungen, Schächte und Rigolenelemente ihrer Funktion zuordnen." },
      { stufe: "Verstehen", text: "die Aufgaben der Regenwasserbewirtschaftung mit Ableitung, Rückhaltung, Versickerung und Reinigung erläutern." },
      { stufe: "Anwenden", text: "aus Einzugsfläche, Abflussbeiwert, Regenspende und Regendauer das erforderliche Speichervolumen und die Länge einer Rigole nach vereinfachtem Ansatz der DWA-A 138 ermitteln." },
      { stufe: "Analysieren", text: "die Bauweisen Kiesrigole und Kunststoff-Sickerbox hinsichtlich Speicherkoeffizient und Platzbedarf vergleichen." },
    ],
  },
  bp_verkehr_tunnel: {
    niveau: "B/M", minuten: 50, vorwissen: ["bp_beton", "sicherheitskonzept", "bodenmechanik"],
    ziele: [
      { stufe: "Verstehen", text: "das Prinzip der Neuen Österreichischen Tunnelbauweise (NÖT) mit dem Gebirge als mittragendem Bauteil erläutern." },
      { stufe: "Verstehen", text: "die Frühfestigkeitsklassen von Spritzbeton ihren Einsatzbedingungen zuordnen." },
      { stufe: "Anwenden", text: "die Ringdruckspannung einer Spritzbetonschale mit der Kesselformel berechnen und die Ausnutzung gegenüber dem Bemessungswert der Druckfestigkeit ermitteln." },
      { stufe: "Bewerten", text: "die NÖT und den Schildvortrieb mit Tunnelbohrmaschine für gegebene Baugrund- und Streckenverhältnisse gegeneinander abwägen." },
    ],
  },
  bruchmechanik: {
    niveau: "M", minuten: 45, vorwissen: ["festigkeit", "mechanische_kenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "die drei Rissöffnungsarten (Modus I bis III) unterscheiden." },
      { stufe: "Anwenden", text: "den Spannungsintensitätsfaktor K_I für einen Kantenriss aus Spannung und Risslänge berechnen." },
      { stufe: "Bewerten", text: "durch Vergleich von K_I mit der Bruchzähigkeit K_Ic beurteilen, ob ein Riss instabil fortschreitet." },
      { stufe: "Verstehen", text: "begründen, warum quasi-spröder Beton nichtlineare Rissmodelle mit Bruchprozesszone und Bruchenergie G_F erfordert." },
    ],
  },
  carbonbeton: {
    niveau: "B/M", minuten: 60, vorwissen: ["stahlbeton_bemessung", "festbeton"],
    ziele: [
      { stufe: "Verstehen", text: "das Spannungs-Dehnungs-Verhalten von Carbonbewehrung und Betonstahl vergleichen und den Vorteil der Korrosionsfreiheit erläutern." },
      { stufe: "Anwenden", text: "den Biegewiderstand eines carbonbewehrten Querschnitts vereinfacht aus Bemessungswerten und Druckzonenhöhe berechnen." },
      { stufe: "Analysieren", text: "den Einfluss von Bewehrungsquerschnitt und Bauteildicke auf die Tragfähigkeit schlanker Carbonbetonbauteile analysieren." },
    ],
  },
  daemmung_vergleich: {
    niveau: "B", minuten: 30, vorwissen: ["feuchteschutz", "bauphysik"],
    ziele: [
      { stufe: "Verstehen", text: "die Auswirkungen von Innen- und Außendämmung auf Temperaturverlauf, Wärmespeicherung und Feuchteschutz der Wand erläutern." },
      { stufe: "Analysieren", text: "kritische Wärmebrücken einer Innendämmung wie einbindende Innenwände und Holzbalkenköpfe identifizieren." },
      { stufe: "Bewerten", text: "für ein Bestandsgebäude zwischen Innen- und Außendämmung entscheiden und erforderliche Maßnahmen wie Dampfbremse oder Feuchtenachweis begründen." },
    ],
  },
  dauerhaftigkeit: {
    niveau: "B", minuten: 150, vorwissen: ["expositionsklassen", "beton_info"],
    ziele: [
      { stufe: "Verstehen", text: "konstruktiven Schutz, Materialanpassung und aktive bzw. passive Schutzsysteme als Prinzipien der Dauerhaftigkeit unterscheiden." },
      { stufe: "Anwenden", text: "einem Betonbauteil Expositionsklassen zuweisen und die zugehörige Mindestbetondeckung ermitteln." },
      { stufe: "Anwenden", text: "mit dem Wurzel-t-Gesetz die Karbonatisierungstiefe nach einer Nutzungsdauer berechnen und mit der Betondeckung vergleichen." },
      { stufe: "Anwenden", text: "die Korrosivitätskategorien nach DIN EN ISO 12944-2 und Gebrauchsklassen nach DIN 68800-1 für gegebene Umgebungsbedingungen bestimmen." },
      { stufe: "Bewerten", text: "geplante Metallpaarungen auf Bimetallkorrosion prüfen und ihre Verträglichkeit beurteilen." },
    ],
  },
  denkmalpflege: {
    niveau: "B/M", minuten: 75, vorwissen: ["bestand", "historisch", "kalk"],
    ziele: [
      { stufe: "Verstehen", text: "die Grundsätze der Charta von Venedig und das deklaratorische Prinzip des BayDSchG erläutern." },
      { stufe: "Erinnern", text: "die Erlaubnispflichten am Baudenkmal, den Umgebungsschutz und die Pflichten bei archäologischen Funden wiedergeben." },
      { stufe: "Anwenden", text: "den Kristallisationsdruck eines Schadsalzes mit der Correns-Gleichung berechnen und mit der Zugfestigkeit des Steins vergleichen." },
      { stufe: "Anwenden", text: "den U-Wert einer historischen Wand nach einer Innendämmung berechnen." },
      { stufe: "Bewerten", text: "geplante Instandsetzungsmaßnahmen am Baudenkmal hinsichtlich Substanzerhalt, Reversibilität und bauphysikalischer Verträglichkeit beurteilen." },
    ],
  },
  dpp: {
    niveau: "B/M", minuten: 45, vorwissen: ["kreislauf_dpp", "zertifizierung_siegel"],
    ziele: [
      { stufe: "Verstehen", text: "den Rechtsrahmen des Digitalen Produktpasses aus Ökodesign-Verordnung (EU) 2024/1781 und Bauprodukteverordnung (EU) 2024/3110 einschließlich der stufenweisen Einführung erläutern." },
      { stufe: "Verstehen", text: "die Datenfelder eines DPP (Allgemeines, Stückliste, Umweltdaten, Rückbau) den beteiligten Akteuren und Lebenszyklusphasen zuordnen." },
      { stufe: "Verstehen", text: "technische Bausteine der DPP-Umsetzung wie eindeutige Identifikatoren, Verwaltungsschale und IFC-Anbindung beschreiben." },
      { stufe: "Anwenden", text: "aus den deklarierten EPD-Modulen das Treibhauspotenzial der Module A–C zusammenfassen und Modul D getrennt ausweisen." },
      { stufe: "Anwenden", text: "die nicht erneuerbare Primärenergie PENRT aus energetisch (PENRE) und stofflich (PENRM) genutztem Anteil berechnen." },
    ],
  },
  einheiten: {
    niveau: "B", minuten: 30, vorwissen: [],
    ziele: [
      { stufe: "Erinnern", text: "die SI-Basiseinheiten, wichtige abgeleitete Einheiten und die SI-Vorsätze mit ihren Zehnerpotenzen benennen." },
      { stufe: "Anwenden", text: "physikalische Größen für Kraft, Spannung, Dichte, Druck, Moment und Energie zwischen gebräuchlichen Einheiten umrechnen." },
      { stufe: "Anwenden", text: "die Einheiten konsistent durch eine Spannungs- oder Momentenberechnung führen und das Ergebnis in N/mm² bzw. kNm angeben." },
      { stufe: "Analysieren", text: "typische Umrechnungsfehler wie die Verwechslung von kN/cm² und N/mm² in einer Rechnung erkennen und korrigieren." },
    ],
  },
  emodul: {
    niveau: "M", minuten: 60, vorwissen: ["mechanische_kenngroessen", "festbeton"],
    ziele: [
      { stufe: "Anwenden", text: "den mittleren E-Modul E_cm nach DIN EN 1992-1-1 aus Festigkeit und Gesteinsart berechnen." },
      { stufe: "Anwenden", text: "den E-Modul eines Zweiphasen-Verbunds aus Gesteinskörnung und Zementstein mit den Modellen nach Voigt und Reuss berechnen." },
      { stufe: "Verstehen", text: "die Modelle nach Voigt, Reuss und Hashin-Shtrikman als obere und untere Schranken erläutern." },
      { stufe: "Analysieren", text: "den Einfluss von Gesteinsanteil und Gesteinsart auf den E-Modul des Betons vergleichen." },
    ],
  },
  energieausweis: {
    niveau: "B", minuten: 120, vorwissen: ["bauphysik"],
    ziele: [
      { stufe: "Verstehen", text: "den Bedarfs- und den Verbrauchsausweis unterscheiden und die Fälle zuordnen, in denen welcher Ausweis zulässig ist." },
      { stufe: "Erinnern", text: "die Entwicklung von der 1. WSVO 1977 über EnEV und GEG bis zum GModG chronologisch einordnen." },
      { stufe: "Verstehen", text: "die normierten Randbedingungen der Bilanzierung wie Referenzklima, Raumtemperatur, Luftwechsel und interne Gewinne erläutern." },
      { stufe: "Anwenden", text: "den Transmissionswärmeverlust H_T' sowie End- und Primärenergiebedarf eines Gebäudes berechnen und einer Effizienzklasse zuordnen." },
      { stufe: "Analysieren", text: "verschiedene Gebäudezustände vom unsanierten Altbau bis zum Effizienzhaus 40 hinsichtlich Energiebedarf und CO₂-Emissionen vergleichen." },
    ],
  },
  erdbau: {
    niveau: "B", minuten: 75, vorwissen: ["gesteine", "baustoffkenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "grob- und feinkörnige Böden anhand ihrer Kornzusammensetzung und Plastizität unterscheiden." },
      { stufe: "Anwenden", text: "einen Boden anhand von Kornanteilen und Plastizität vereinfacht einer Bodengruppe nach DIN 18196 zuordnen." },
      { stufe: "Anwenden", text: "aus Feuchtdichte und Wassergehalt die Trockendichte und den Verdichtungsgrad D_Pr berechnen und mit einer Anforderung vergleichen." },
      { stufe: "Anwenden", text: "die Mindestdicke des frostsicheren Oberbaus nach RStO aus Belastungsklasse, Frostempfindlichkeitsklasse und örtlichen Verhältnissen ermitteln." },
    ],
  },
  expositionsklassen: {
    niveau: "B", minuten: 90, vorwissen: ["grundlagen", "korrosion"],
    ziele: [
      { stufe: "Verstehen", text: "die Angriffsmechanismen hinter den Expositionsklassen XC, XD, XS, XF, XA und XM sowie die Feuchtigkeitsklassen gegen AKR erläutern." },
      { stufe: "Anwenden", text: "den Bauteilen anhand ihrer Umgebungsbedingungen die zutreffenden Expositions- und Feuchtigkeitsklassen zuordnen." },
      { stufe: "Anwenden", text: "aus den Expositionsklassen die Grenzwerte für (w/z)_eq, Mindestzementgehalt und Mindestdruckfestigkeitsklasse ermitteln." },
      { stufe: "Anwenden", text: "das Nennmaß der Betondeckung aus c_min,dur, c_min,b und Δc_dev nach DIN EN 1992-1-1 berechnen." },
      { stufe: "Anwenden", text: "den äquivalenten w/z-Wert bei Zugabe von Flugasche und Silikastaub mit dem k-Wert-Ansatz berechnen." },
    ],
  },
  festbeton: {
    niveau: "B", minuten: 75, vorwissen: ["grundlagen", "statistik"],
    ziele: [
      { stufe: "Erinnern", text: "die Druckfestigkeitsklassen für Normal-, Schwer- und Leichtbeton mit charakteristischer Zylinder- und Würfelfestigkeit zuordnen." },
      { stufe: "Verstehen", text: "den Einfluss der Querdehnungsbehinderung auf die Prüfwerte von Zylinder und Würfel erläutern." },
      { stufe: "Anwenden", text: "die mittlere Druckfestigkeit zu einem frühen Betonalter mit dem Entwicklungsbeiwert berechnen." },
      { stufe: "Anwenden", text: "aus einer Prüfserie Mittelwert und Standardabweichung berechnen und das Mittelwert- und Einzelwertkriterium der Konformität prüfen." },
    ],
  },
  festbeton_statistik: {
    niveau: "B", minuten: 60, vorwissen: ["statistik", "festbeton"],
    ziele: [
      { stufe: "Verstehen", text: "den charakteristischen Wert der Druckfestigkeit als 5-%-Fraktil der Normalverteilung erläutern." },
      { stufe: "Anwenden", text: "das Konformitätskriterium 1 (Mittelwert) und das Kriterium 2 (Einzelwert) nach DIN EN 206 für Erst- und stetige Herstellung prüfen." },
      { stufe: "Anwenden", text: "die Zylinder- und Würfeldruckfestigkeit einer Festigkeitsklasse einander zuordnen und den Bemessungswert berechnen." },
      { stufe: "Bewerten", text: "anhand der Prüfergebnisse beurteilen, ob eine Betonlieferung die geforderte Festigkeitsklasse erfüllt." },
    ],
  },
  festigkeit: {
    niveau: "B", minuten: 40, vorwissen: ["mechanische_kenngroessen"],
    ziele: [
      { stufe: "Anwenden", text: "die maximale Turmhöhe eines Werkstoffs aus Druckfestigkeit und Rohdichte berechnen." },
      { stufe: "Anwenden", text: "die Reißlänge eines frei hängenden Stabs aus Zugfestigkeit und Rohdichte berechnen." },
      { stufe: "Anwenden", text: "für einen Würfelstapel die maximale Anzahl Würfel, die Stauchung des untersten Würfels und die Gesamtstauchung ermitteln." },
      { stufe: "Analysieren", text: "verschiedene Werkstoffe hinsichtlich ihres Verhältnisses von Festigkeit zu Eigengewicht vergleichen und die Grenzen des Gedankenexperiments benennen." },
      { stufe: "Anwenden", text: "aus σ_x, σ_y und τ_xy mit dem Mohr'schen Spannungskreis Hauptspannungen, Hauptrichtung, größte Schubspannung und Vergleichsspannung ermitteln." },
    ],
  },
  feuchteschutz: {
    niveau: "B", minuten: 90, vorwissen: ["bauphysik", "baustoffkenngroessen"],
    ziele: [
      { stufe: "Anwenden", text: "den Sättigungsdampfdruck, Teildruck, absolute Luftfeuchte und Taupunkt eines Raumklimas berechnen." },
      { stufe: "Anwenden", text: "die relative Oberflächenfeuchte bestimmen und das Schimmelrisiko anhand der 80-%-Grenze nach DIN 4108-2 prüfen." },
      { stufe: "Anwenden", text: "die s_d-Werte der Schichten eines Bauteils und den Gesamtwert s_d,ges ermitteln." },
      { stufe: "Anwenden", text: "mit dem Glaser-Verfahren die Tauwasserebene sowie Tauwasser- und Verdunstungsmasse eines Schichtaufbaus nach DIN 4108-3 ermitteln." },
      { stufe: "Bewerten", text: "einen Schichtaufbau mit der Regel „innen dichter als außen“ und der Tauwasserbilanz beurteilen und Abhilfen wie eine Dampfbremse begründen." },
    ],
  },
  formaenderungen: {
    niveau: "B", minuten: 40, vorwissen: ["mechanische_kenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "die Formänderungen von Baustoffen nach Ursache, zeitlichem Verlauf und Reversibilität systematisch einteilen." },
      { stufe: "Verstehen", text: "elastische, plastische, verzögert elastische und viskose Verformung voneinander unterscheiden." },
      { stufe: "Analysieren", text: "spannungsunabhängige Wärme-, Feuchte- und chemische Dehnungen wie Schwinden, Quellen und Treiben konkreten Ursachen zuordnen." },
      { stufe: "Anwenden", text: "die Längenänderung eines Bauteils aus elastischem Anteil und Kriechanteil berechnen und den Einfluss einer Behinderung erläutern." },
      { stufe: "Anwenden", text: "die Biegelinie, größte Durchbiegung und Neigung von Einfeldträger und Kragarm berechnen und Stahl, Holz und Beton über E·I vergleichen." },
    ],
  },
  frischbeton: {
    niveau: "B", minuten: 90, vorwissen: ["grundlagen", "herstellung_einbau"],
    ziele: [
      { stufe: "Verstehen", text: "die Konsistenzprüfverfahren nach DIN EN 12350 und das rheologische Bingham-Modell des Frischbetons erläutern." },
      { stufe: "Anwenden", text: "mit dem Toleranzprüfer feststellen, ob gemessene Konsistenz- und Luftgehaltswerte innerhalb der zulässigen Grenzabmaße liegen." },
      { stufe: "Anwenden", text: "die Frischbetontemperatur aus den Temperaturen und Massen der Ausgangsstoffe mit der Mischungsregel berechnen." },
      { stufe: "Anwenden", text: "den Frischbetondruck auf lotrechte Schalungen nach DIN 18218 aus Steiggeschwindigkeit, Konsistenz und Erstarrungsverhalten ermitteln." },
      { stufe: "Bewerten", text: "den Luftgehalt eines LP-Betons gegen die Mindestluftgehalte prüfen und seinen Einfluss auf die Druckfestigkeit beurteilen." },
    ],
  },
  gesteine: {
    niveau: "B", minuten: 75, vorwissen: ["baustoffkenngroessen", "bauchemie"],
    ziele: [
      { stufe: "Verstehen", text: "die Gesteinsgruppen Magmatite, Sedimentite und Metamorphite nach ihrer Entstehung unterscheiden und typische Bausteine wie Granit, Kalkstein oder Marmor zuordnen." },
      { stufe: "Verstehen", text: "den Einfluss von Dichte, Porosität und Wasseraufnahme auf den Frostwiderstand und die Dauerhaftigkeit von Naturstein erläutern." },
      { stufe: "Anwenden", text: "die Wasseraufnahme, die Porosität und den Los-Angeles-Koeffizient aus Prüfdaten berechnen." },
      { stufe: "Anwenden", text: "aus Siebdurchgängen die Körnungsziffer einer Gesteinskörnung ermitteln und die Sieblinie mit der Fuller-Parabel vergleichen." },
      { stufe: "Bewerten", text: "geeignete Natursteine und Gesteinskörnungen anhand ihrer Kennwerte für einen vorgegebenen Anwendungsbereich auswählen und die Wahl begründen." },
    ],
  },
  gips: {
    niveau: "B", minuten: 60, vorwissen: ["bauchemie"],
    ziele: [
      { stufe: "Verstehen", text: "das Brennen, Abbinden und Erhärten von Gips mit den Reaktionsgleichungen des Gipskreislaufs erläutern." },
      { stufe: "Anwenden", text: "aus dem Wasser-Gips-Wert den Anteil chemisch gebundenen Wassers, das Überschusswasser und die Porosität des erhärteten Gipses berechnen." },
      { stufe: "Analysieren", text: "den Einfluss des Wasser-Gips-Werts und der Porosität auf die Festigkeit von Gipsbaustoffen analysieren." },
      { stufe: "Bewerten", text: "die Eignung von Gipsbaustoffen hinsichtlich Feuchtebeständigkeit, Brandschutz und Verträglichkeit mit Zement (Ettringitbildung) beurteilen." },
    ],
  },
  glas: {
    niveau: "B", minuten: 75, vorwissen: ["mechanische_kenngroessen", "sicherheitskonzept"],
    ziele: [
      { stufe: "Verstehen", text: "die Glasarten Floatglas, TVG und ESG nach Herstellung, Vorspannung und Bruchbild unterscheiden." },
      { stufe: "Verstehen", text: "das spröde Bruchverhalten von Glas mit Oberflächenfehlern und der Weibull-Verteilung erläutern." },
      { stufe: "Analysieren", text: "den Einfluss von Lasteinwirkungsdauer und Temperatur auf den Schubverbund der Zwischenschicht von VSG analysieren." },
      { stufe: "Anwenden", text: "die Zugspannung am Scheibenrand infolge einer Temperaturdifferenz berechnen und das Risiko eines thermischen Bruchs bewerten." },
      { stufe: "Anwenden", text: "die Wirkung von Klimalasten auf Mehrscheiben-Isolierglas an einem Aufbau beschreiben und die Glasart für eine Einbausituation auswählen." },
    ],
  },
  grundlagen: {
    niveau: "B", minuten: 90, vorwissen: ["beton_info"],
    ziele: [
      { stufe: "Erinnern", text: "die Eignung von Trinkwasser, Restwasser, Grundwasser und Meerwasser als Zugabewasser nach DIN EN 1008 wiedergeben." },
      { stufe: "Verstehen", text: "die Zementarten nach DIN EN 197-1 sowie Betonzusatzstoffe vom Typ I und Typ II und Betonzusatzmittel voneinander unterscheiden." },
      { stufe: "Anwenden", text: "den höchstzulässigen Mehlkorngehalt durch lineare Interpolation ermitteln und den Ist-Wert einer Rezeptur damit prüfen." },
      { stufe: "Anwenden", text: "den äquivalenten w/z-Wert mit dem k-Wert-Ansatz für Flugasche berechnen und mit dem Grenzwert der Expositionsklasse vergleichen." },
    ],
  },
  herstellung_einbau: {
    niveau: "B", minuten: 45, vorwissen: ["grundlagen"],
    ziele: [
      { stufe: "Verstehen", text: "die Aufgaben von Mischen, Transport im Fahrmischer und Pumpen sowie das Wirkprinzip der Gleitschicht beim Pumpbeton erläutern." },
      { stufe: "Anwenden", text: "anhand der Lieferscheinzeiten prüfen, ob die zulässige Entladezeit eines Fahrmischers eingehalten ist." },
      { stufe: "Anwenden", text: "den erforderlichen Pumpendruck aus Fließgeschwindigkeit und Druckanteilen der Rohrleitung abschätzen." },
      { stufe: "Analysieren", text: "typische Fehler beim Pumpen und Verdichten wie Stopfer, Bluten, Über- und Unterrütteln ihren Ursachen und Folgen zuordnen." },
    ],
  },
  historische_bauprodukte: {
    niveau: "B", minuten: 90, vorwissen: ["historisch", "schadstoffe"],
    ziele: [
      { stufe: "Erinnern", text: "historische Bauprodukte wie Rabitzputz, Isteg-Stahl, Bimsbeton oder Asbestzement ihren Bauepochen zuordnen." },
      { stufe: "Verstehen", text: "die Herstellung, die Eigenschaften und typische Schäden historischer Eisen- und Stahlsorten, Mauersteine und Mörtel erläutern." },
      { stufe: "Analysieren", text: "vorgefundene Bauprodukte im Bestand auf mögliche Schadstoffe wie Asbest, PCB, PAK oder FCKW prüfen." },
      { stufe: "Bewerten", text: "gemessene Schadstoffgehalte mit Grenzwerten vergleichen und Folgerungen für Erhalt, Sanierung oder Ausbau ableiten." },
    ],
  },
  historische_bauweisen: {
    niveau: "B", minuten: 120, vorwissen: ["historisch", "mauerwerk", "baustatik"],
    ziele: [
      { stufe: "Verstehen", text: "die Konstruktionsprinzipien von Vollziegelmauerwerk, Fachwerk, Holzbalken- und Kappendecken sowie Sparren-, Kehlbalken- und Pfettendächern erläutern." },
      { stufe: "Anwenden", text: "den Gewölbeschub eines Bogens bzw. einer preußischen Kappe berechnen und das Zugband bemessen." },
      { stufe: "Anwenden", text: "die Schwindverformungen eines Fachwerkholzes aus Holzfeuchteänderung und Faserrichtung berechnen." },
      { stufe: "Anwenden", text: "die Biegespannungen in einem historischen Holzbalken aus Moment und Widerstandsmoment ermitteln." },
      { stufe: "Analysieren", text: "typische Schwachstellen historischer Tragwerke anhand der Rechenergebnisse identifizieren." },
    ],
  },
  holz: {
    niveau: "B", minuten: 150, vorwissen: ["baustoffkenngroessen", "mechanische_kenngroessen", "sicherheitskonzept"],
    ziele: [
      { stufe: "Verstehen", text: "die Anisotropie von Holz und die Bedeutung von Holzfeuchte und Fasersättigung für Quellen und Schwinden erläutern." },
      { stufe: "Anwenden", text: "das Schwindmaß eines Querschnitts für eine Holzfeuchteänderung berechnen und die Querschnittsverformung je nach Jahrringlage skizzieren." },
      { stufe: "Anwenden", text: "die Bemessungsfestigkeiten nach Eurocode 5 mit k_mod und γ_M aus Festigkeitsklasse, Nutzungsklasse und KLED ermitteln." },
      { stufe: "Anwenden", text: "die Druckfestigkeit unter einem Winkel zur Faser mit der Hankinson-Gleichung berechnen." },
      { stufe: "Analysieren", text: "den Einfluss von Nutzungsklasse und Lasteinwirkungsdauer auf die Kriechverformung eines Holzbauteils analysieren." },
    ],
  },
  holzbau_bauphysik: {
    niveau: "B/M", minuten: 90, vorwissen: ["holzbau_bemessung", "brandschutz"],
    ziele: [
      { stufe: "Verstehen", text: "die Schutzwirkung der Holzkohleschicht und die Bedeutung der Abbrandraten nach DIN EN 1995-1-2 erläutern." },
      { stufe: "Anwenden", text: "die effektive Abbrandtiefe d_ef und den Restquerschnitt eines Holzbauteils für eine geforderte Branddauer berechnen." },
      { stufe: "Anwenden", text: "die Eigenfrequenz einer Brettsperrholzdecke berechnen und mit dem Gebrauchstauglichkeitskriterium vergleichen." },
      { stufe: "Analysieren", text: "konstruktive Maßnahmen zur Trittschallminderung im Holzbau nach ihrer Wirkung vergleichen." },
    ],
  },
  holzbau_bemessung: {
    niveau: "B", minuten: 120, vorwissen: ["holzbau_werkstoffe", "knicken", "baustatik"],
    ziele: [
      { stufe: "Verstehen", text: "den Einfluss von Nutzungsklasse und Lasteinwirkungsdauer auf die Bemessungsfestigkeit über k_mod erläutern." },
      { stufe: "Anwenden", text: "für eine Holzstütze Schlankheit, bezogene Schlankheit und Knickbeiwert nach DIN EN 1995-1-1 berechnen und den Knicknachweis führen." },
      { stufe: "Anwenden", text: "die Knicklänge einer Stütze anhand des zutreffenden Euler-Falls bestimmen." },
      { stufe: "Anwenden", text: "den Querpressungsnachweis an einem Auflager mit dem Beiwert k_c,90 führen." },
    ],
  },
  holzbau_konstruktion: {
    niveau: "B", minuten: 30, vorwissen: ["holz", "holzbau_werkstoffe"],
    ziele: [
      { stufe: "Verstehen", text: "die Konstruktionsweisen Holzrahmen-, Holztafel-, Massivholz- sowie Skelettbau nach Tragprinzip und Vorfertigungsgrad erläutern." },
      { stufe: "Analysieren", text: "die Konstruktionsweisen hinsichtlich Eignung für unterschiedliche Bauaufgaben vergleichen." },
      { stufe: "Anwenden", text: "den Schichtaufbau einer Massivholz-Geschossdecke skizzieren und die Funktion der einzelnen Schichten zuordnen." },
    ],
  },
  holzbau_verbindung: {
    niveau: "B/M", minuten: 90, vorwissen: ["holzbau_bemessung"],
    ziele: [
      { stufe: "Verstehen", text: "die Versagensmechanismen einschnittiger Holz-Holz-Verbindungen nach Johansen erläutern." },
      { stufe: "Anwenden", text: "die Tragfähigkeit von Stabdübel- und Bolzenverbindungen aus Lochleibungsfestigkeit und Fließmoment nach Eurocode 5 berechnen." },
      { stufe: "Anwenden", text: "den Ausziehwiderstand von Vollgewindeschrauben berechnen und die Bedeutung der Mindestabstände für das Spaltversagen begründen." },
      { stufe: "Analysieren", text: "für einen Anschluss den maßgebenden Versagensmodus ermitteln und Verbindungsmittel vergleichen." },
    ],
  },
  holzkorrosion: {
    niveau: "B", minuten: 120, vorwissen: ["holz", "dauerhaftigkeit"],
    ziele: [
      { stufe: "Verstehen", text: "die Braunfäule, Weißfäule und Moderfäule nach Schadbild und Abbauvorgang unterscheiden." },
      { stufe: "Erinnern", text: "holzzerstörende Insekten wie Hausbock, Nagekäfer und Splintholzkäfer an typischen Merkmalen identifizieren." },
      { stufe: "Anwenden", text: "die Holzfeuchte nach dem Darrverfahren berechnen und daraus die Gefährdung durch Pilze und Insekten ableiten." },
      { stufe: "Anwenden", text: "einzelnen Bauteilen die Gebrauchsklassen nach DIN 68800-1 zuordnen und geeignete Holzschutzmittel und Einbringverfahren auswählen." },
      { stufe: "Bewerten", text: "die Sanierungsverfahren bei akutem Befall nach DIN 68800-4 begründen und die Entsorgung schutzbehandelten Altholzes einordnen." },
    ],
  },
  holzwerkstoffe: {
    niveau: "B", minuten: 45, vorwissen: ["holz"],
    ziele: [
      { stufe: "Verstehen", text: "die Werkstoffgruppen Vollholz-, Furnier-, Span- und Faserwerkstoffe nach Aufbau und Herstellung unterscheiden und Produkte wie BSH, CLT, LVL und OSB zuordnen." },
      { stufe: "Anwenden", text: "die Enddurchbiegung eines Bauteils aus Holzwerkstoff mit dem Verformungsbeiwert k_def berechnen und mit Vollholz vergleichen." },
      { stufe: "Bewerten", text: "die Holzwerkstoffe hinsichtlich Rohstoffausnutzung, Emissionen, Kaskadennutzung und Kreislauffähigkeit bewerten." },
    ],
  },
  hydratation_folgen: {
    niveau: "B/M", minuten: 150, vorwissen: ["bindemittel", "festbeton"],
    ziele: [
      { stufe: "Anwenden", text: "den Reifegrad nach Nurse-Saul und das gleichwertige Alter bei 20 °C für einen gegebenen Temperaturverlauf berechnen." },
      { stufe: "Anwenden", text: "die adiabatische Temperaturerhöhung eines Betons aus Zementgehalt und Hydratationswärme berechnen." },
      { stufe: "Verstehen", text: "die Entstehung von Zwang- und Eigenspannungen aus Temperaturfeldern im jungen Beton erläutern und mit der Zugfestigkeitsentwicklung vergleichen." },
      { stufe: "Anwenden", text: "die Endkriechzahl und Schwindmaße in Abhängigkeit von Feuchte, wirksamer Bauteildicke und Belastungsalter ermitteln." },
      { stufe: "Bewerten", text: "das Rissrisiko massiger Bauteile beurteilen und geeignete Maßnahmen wie Zementwahl, Kühlung oder Mindestbewehrung begründen." },
    ],
  },
  innenausbau: {
    niveau: "B", minuten: 120, vorwissen: ["gips", "daemmstoffe", "ausbau"],
    ziele: [
      { stufe: "Analysieren", text: "die Estricharten nach DIN EN 13813 und DIN 18560 sowie Plattenwerkstoffe im Trockenbau nach Bindemittel, Eigenschaften und Einsatzbereich unterscheiden." },
      { stufe: "Anwenden", text: "die Restfeuchte eines Estrichs mit der CM-Methode ermitteln und die Belegreife für Zement- und Calciumsulfatestriche prüfen." },
      { stufe: "Erinnern", text: "die Qualitätsstufen Q1 bis Q4 der Verspachtelung ihren Anforderungen an die Oberfläche zuordnen." },
      { stufe: "Anwenden", text: "die Resonanzfrequenz einer zweischaligen Trockenbauwand aus den Beplankungen und der Steifigkeit des Hohlraums berechnen." },
      { stufe: "Bewerten", text: "für Innenräume die erforderliche Abdichtung im Verbund nach DIN 18534 auswählen und begründen." },
    ],
  },
  innovative_werkstoffe: {
    niveau: "M", minuten: 120, vorwissen: ["sonderbetone", "frischbeton"],
    ziele: [
      { stufe: "Verstehen", text: "die Verfahren des 3D-Betondrucks und das rheologische Spannungsfeld zwischen Pumpbarkeit, Extrudierbarkeit und Standfestigkeit erläutern." },
      { stufe: "Anwenden", text: "die erforderliche Fließgrenze des Frischbetons aus der Spannung in der untersten gedruckten Schicht berechnen." },
      { stufe: "Analysieren", text: "die Versagensarten plastisches Fließen und elastisches Knicken während des Druckprozesses unterscheiden und ihre Einflussgrößen benennen." },
      { stufe: "Analysieren", text: "die Optionen der Bewehrungsintegration im 3D-Betondruck hinsichtlich Tragwirkung und Umsetzbarkeit vergleichen." },
      { stufe: "Bewerten", text: "innovative Werkstoffe wie Carbonbeton, UHPC, LC³, Geopolymere oder selbstheilenden Beton nach CO₂-Bilanz und Kosten bewerten." },
    ],
  },
  instandhaltung: {
    niveau: "B/M", minuten: 180, vorwissen: ["korrosion", "schutz_grundlagen", "dauerhaftigkeit"],
    ziele: [
      { stufe: "Verstehen", text: "die Instandsetzungsprinzipien nach DIN EN 1504 und die Anwendungsbereiche von TR Instandhaltung und DIN EN 1504 erläutern." },
      { stufe: "Verstehen", text: "die Oberflächenschutzsysteme OS 1 bis OS 11 nach Aufbau, Rissüberbrückung und Befahrbarkeit unterscheiden." },
      { stufe: "Anwenden", text: "mit dem System-Finder ein geeignetes Oberflächenschutzsystem und einen Instandsetzungsmörtel (CC, PCC, SPCC, PC) für ein Bauteil auswählen." },
      { stufe: "Anwenden", text: "das Füllgut und das Injektionsziel für eine Rissinjektion aus Rissbreite, Rissaktivität und Feuchtezustand ermitteln." },
      { stufe: "Anwenden", text: "den erforderlichen Schutzstrom eines kathodischen Korrosionsschutzes aus Stahloberfläche und Schutzstromdichte berechnen." },
    ],
  },
  instandsetzung_materialien: {
    niveau: "B", minuten: 120, vorwissen: ["schutz_grundlagen", "holzkorrosion", "metallkorrosion"],
    ziele: [
      { stufe: "Verstehen", text: "präventive Schutzmaßnahmen und Instandsetzungsverfahren für Holz, Stahl, Kunststoffe, Asphalt und Mauerwerk unterscheiden." },
      { stufe: "Anwenden", text: "geeignete Korrosionsschutzsysteme nach DIN EN ISO 12944 einschließlich Duplexsystemen auswählen." },
      { stufe: "Anwenden", text: "den Restquerschnitt eines geschädigten Stahlbauteils ermitteln und mit dem Ausgangsquerschnitt vergleichen." },
      { stufe: "Bewerten", text: "passende Instandsetzungsverfahren für Holztragwerke nach DIN 68800, für Asphaltbeläge nach ZTV BEA-StB und für Mauerwerk nach WTA begründet auswählen." },
    ],
  },
  kalk: {
    niveau: "B", minuten: 45, vorwissen: ["bauchemie"],
    ziele: [
      { stufe: "Verstehen", text: "die drei Stufen des technischen Kalkkreislaufs (Brennen, Löschen, Karbonatisierung) mit Reaktionsgleichungen und Wärmetönung erläutern." },
      { stufe: "Verstehen", text: "die Kalkarten Luftkalk und hydraulischer Kalk nach Erhärtungsmechanismus und Festigkeitsentwicklung unterscheiden." },
      { stufe: "Anwenden", text: "die Reaktionsgleichungen des Kalkkreislaufs aufstellen und die bei Brennen und Löschen frei werdenden bzw. benötigten Stoffe zuordnen." },
      { stufe: "Bewerten", text: "den Einsatz von Kalkputzen und -mörteln hinsichtlich bauphysikalischer Funktion, chemischer Beständigkeit und Arbeitsschutz beurteilen." },
    ],
  },
  ki_llmpraxis: {
    niveau: "M", minuten: 75, vorwissen: ["ki_prompting", "ki_system"],
    ziele: [
      { stufe: "Verstehen", text: "die Rollen von Systemprompt, Skill und MCP-Konnektor in einem LLM-Workflow unterscheiden." },
      { stufe: "Anwenden", text: "einen Systemprompt mit Rollendefinition, Normbezug, Formatvorgaben und Halluzinationsverbot für eine ingenieurtechnische Aufgabe zusammenstellen." },
      { stufe: "Analysieren", text: "den Tokenbedarf und die Kosten verschiedener Dokumentformate (Scan, PDF, Office, Markdown) mit dem Token-Kostenrechner vergleichen." },
      { stufe: "Anwenden", text: "aus einer Stichprobe die Fehlerquote von KI-Normzitaten schätzen und die Trefferwahrscheinlichkeit eines Mehrheitsentscheids aus drei Abfragen berechnen." },
      { stufe: "Bewerten", text: "für typische Büroaufgaben begründet auswählen, ob Claude, ChatGPT, Websuche oder Code-Ausführung eingesetzt werden sollte." },
    ],
  },
  ki_lokal: {
    niveau: "B/M", minuten: 50, vorwissen: ["ki_system", "ki_prompting"],
    ziele: [
      { stufe: "Analysieren", text: "lokale Sprachmodelle und Cloud-LLMs hinsichtlich Datenschutz, Offlinefähigkeit, Kosten und Reproduzierbarkeit vergleichen." },
      { stufe: "Anwenden", text: "ein Open-Source-Modell in LM Studio laden, eine geeignete Quantisierungsstufe auswählen und einen Ingenieur-Systemprompt hinterlegen." },
      { stufe: "Anwenden", text: "den Speicherbedarf eines quantisierten Modells aus Parameterzahl, Bit je Gewicht und Kontext-Cache berechnen." },
      { stufe: "Anwenden", text: "den lokalen OpenAI-kompatiblen Server von LM Studio aus einem Python-Skript ansprechen." },
      { stufe: "Bewerten", text: "für eine gegebene Modellgröße eine passende Hardware (Grafikspeicher, Apple Silicon, CPU-Betrieb) auswählen und begründen." },
    ],
  },
  ki_prompting: {
    niveau: "B/M", minuten: 45, vorwissen: ["ki_ueberblick"],
    ziele: [
      { stufe: "Verstehen", text: "die Bausteine eines strukturierten Ingenieur-Prompts (Material, Zielsetzung, Ausgabeformat, Tonalität) benennen und ihre Wirkung auf die Antwort erläutern." },
      { stufe: "Anwenden", text: "mit dem Prompt-Generator einen präzisen Prompt für eine Regelwerksprüfung, Schadensanalyse oder CO₂-Optimierung zusammenstellen und gezielt anpassen." },
      { stufe: "Anwenden", text: "bewährte Taktiken wie Rückfragen, Chain of Thought, Few-Shot-Vorgaben und einen zweiten Prüfdurchlauf zur Vermeidung von Halluzinationen einsetzen." },
      { stufe: "Anwenden", text: "die Tokenanzahl, die Kosten und das freie Kontextbudget einer Dokumentenanalyse abschätzen." },
      { stufe: "Bewerten", text: "anhand des Kontextbudgets begründet auswählen, ob ein umfangreiches Gutachten vollständig, kapitelweise oder über RAG verarbeitet wird." },
    ],
  },
  ki_system: {
    niveau: "B/M", minuten: 90, vorwissen: ["ki_ueberblick", "statistik"],
    ziele: [
      { stufe: "Verstehen", text: "klassisches maschinelles Lernen, Deep Learning, Transformer-Sprachmodelle, RAG, Computer Vision und KI-Agenten nach Datenart, Funktionsweise und Einsatzzweck unterscheiden." },
      { stufe: "Verstehen", text: "die Schritte einer RAG-Pipeline von Chunking über Embedding und Vektorsuche bis zur Kontextinjektion erläutern." },
      { stufe: "Anwenden", text: "die Ausgabe eines einzelnen Neurons aus Eingängen, Gewichten, Bias und Aktivierungsfunktion berechnen." },
      { stufe: "Anwenden", text: "die Kosinus-Ähnlichkeit zwischen Frage- und Textvektoren berechnen und daraus das Retrieval-Ranking ableiten." },
      { stufe: "Bewerten", text: "die Risiken Extrapolationsversagen, Black-Box-Verhalten und Faktenhalluzination für bautechnische Einsatzfälle beurteilen und passende Gegenmaßnahmen auswählen." },
    ],
  },
  ki_thesen: {
    niveau: "B/M", minuten: 60, vorwissen: ["ki_prompting", "statistik"],
    ziele: [
      { stufe: "Verstehen", text: "die KI-Werkzeuge für Literatur-Mapping, Literaturverwaltung, quellengebundene Synthese, Schreiben und Datenauswertung den Arbeitsphasen einer Abschlussarbeit zuordnen." },
      { stufe: "Anwenden", text: "die Kennwerte Precision und Recall einer KI-gestützten Literatursuche berechnen und die Vollständigkeit der Recherche einschätzen." },
      { stufe: "Anwenden", text: "das Bestimmtheitsmaß eines KI-generierten Auswerteskripts per Handrechnung nachprüfen." },
      { stufe: "Bewerten", text: "die Risiken der Werkzeuge wie erfundene Zitate, falsch extrahierte Zahlen oder die Weitergabe vertraulicher Industriedaten beurteilen." },
      { stufe: "Anwenden", text: "den KI-Einsatz in einer Abschlussarbeit mit Werkzeug, Version und Zweck transparent deklarieren." },
    ],
  },
  ki_uebungen: {
    niveau: "M", minuten: 360, vorwissen: ["ki_ueberblick", "ki_prompting", "ki_system"],
    ziele: [
      { stufe: "Anwenden", text: "für eine Büroaufgabe einen Prompt mit Rolle, Kontext, Aufgabe, Format und Regeln formulieren und mit einer naiven Anfrage vergleichen." },
      { stufe: "Anwenden", text: "Retrieval-Augmented Generation ohne Programmierung nachbilden und jede Antwort mit der Fundstelle im bereitgestellten Regelwerkstext belegen lassen." },
      { stufe: "Analysieren", text: "eine KI-Antwort auf erfundene Quellen, veraltete Normausgaben, falsche Grenzwerte und Rechenfehler untersuchen und die Fehlerbilder benennen." },
      { stufe: "Bewerten", text: "ein vom Copilot erstelltes Rechenblatt mit Testfällen und einer unabhängigen Kontrollrechnung prüfen und über seine Verwendbarkeit entscheiden." },
      { stufe: "Bewerten", text: "beurteilen, welche Schritte eines Agentenlaufs selbstständig ablaufen dürfen und welche eine menschliche Freigabe erfordern." },
    ],
  },
  knicken: {
    niveau: "B", minuten: 60, vorwissen: ["baustatik", "mechanische_kenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "das Knicken als Stabilitätsversagen schlanker Druckstäbe erläutern." },
      { stufe: "Anwenden", text: "die Knicklänge für die Euler-Fälle 1 bis 4 mit dem Knicklängenbeiwert β bestimmen." },
      { stufe: "Anwenden", text: "die ideale Knicklast nach Euler aus E-Modul, Flächenträgheitsmoment und Knicklänge berechnen." },
      { stufe: "Analysieren", text: "den Einfluss der Lagerung auf die Knicklast vergleichen und die Zunahme der Biegemomente nach Theorie II. Ordnung erläutern." },
    ],
  },
  kombinationen: {
    niveau: "B/M", minuten: 120, vorwissen: ["bauphysik", "emodul"],
    ziele: [
      { stufe: "Verstehen", text: "das Prinzip Tragen – Dämmen – Schützen an Schichtaufbauten wie WDVS und vorgehängter hinterlüfteter Fassade erläutern." },
      { stufe: "Anwenden", text: "die Wärmedurchlasswiderstände, den U-Wert und die sd-Werte eines mehrschichtigen Wandaufbaus berechnen." },
      { stufe: "Analysieren", text: "die Schichtfolge eines Wandaufbaus auf diffusionstechnisch günstige Anordnung prüfen." },
      { stufe: "Anwenden", text: "den E-Modul eines Faserverbunds längs und quer zur Faser mit den Mischungsregeln nach Voigt und Reuss in Abhängigkeit vom Faservolumengehalt berechnen." },
      { stufe: "Bewerten", text: "die Faserverbundanwendungen wie CFK-Lamellen, GFK-Bewehrung und pultrudierte Profile sowie Schutzschichten für eine Bauaufgabe beurteilen." },
    ],
  },
  materialitaet_architektur: {
    niveau: "B", minuten: 60, vorwissen: ["baustoffkunde", "sichtbeton"],
    ziele: [
      { stufe: "Verstehen", text: "die vier Dimensionen der Materialität – Optik, Haptik, Licht und Alterung – an Beispielbauten erläutern." },
      { stufe: "Verstehen", text: "das warme oder kalte Griffgefühl eines Werkstoffs mit dem Wärmeeindringkoeffizienten begründen." },
      { stufe: "Analysieren", text: "die Alterung von Holz, Kupfer, Titanzink und wetterfestem Stahl hinsichtlich Mechanismus und konstruktiver Voraussetzungen vergleichen." },
      { stufe: "Bewerten", text: "für eine Entwurfsaufgabe einen Fassaden- oder Oberflächenwerkstoff nach Wirkung, Alterungsverhalten und Pflegeaufwand auswählen und begründen." },
    ],
  },
  korrosion: {
    niveau: "B", minuten: 90, vorwissen: ["dauerhaftigkeit", "expositionsklassen"],
    ziele: [
      { stufe: "Verstehen", text: "die elektrochemischen Vorgänge an Anode und Kathode bei der Bewehrungskorrosion erläutern." },
      { stufe: "Verstehen", text: "die Schadensstadien von der Passivität über Lochfraß und Risse bis zur Abplatzung beschreiben." },
      { stufe: "Anwenden", text: "die Karbonatisierungstiefe mit dem Wurzel-t-Gesetz berechnen und Ergebnisse der Schnellkarbonatisierung in natürliche Tiefen umrechnen." },
      { stufe: "Anwenden", text: "mit dem 2. Fick’schen Gesetz das Chlorid-Eindringprofil berechnen und den Zeitpunkt der Depassivierung in Höhe der Bewehrung ermitteln." },
      { stufe: "Anwenden", text: "aus der Abtragsrate Radiusabnahme und Querschnittsverlust eines Bewehrungsstabs berechnen." },
    ],
  },
  kreislauf_dpp: {
    niveau: "B/M", minuten: 120, vorwissen: ["rueckbau", "materialpaesse"],
    ziele: [
      { stufe: "Erinnern", text: "die R-Strategien von Refuse bis Recover in ihrer Rangfolge wiedergeben." },
      { stufe: "Verstehen", text: "die Schritte einer Rückbau- und Re-Use-Erkundung von der historischen Recherche bis zum Erkundungsbericht erläutern." },
      { stufe: "Anwenden", text: "den Material Circularity Indicator (MCI) aus Linear Flow Index und Nutzungsfaktor berechnen." },
      { stufe: "Analysieren", text: "die Bauteile eines Bestandsgebäudes nach Verbindungsart, Schadstoffbelastung und Wiederverwendbarkeit in einem Re-Use-Inventar einordnen." },
      { stufe: "Bewerten", text: "typische Stoffverbünde und Störstoffe hinsichtlich ihrer Rezyklierbarkeit beurteilen und Verwertungswege für Baustoffgruppen auswählen." },
    ],
  },
  kunststoffe: {
    niveau: "B", minuten: 75, vorwissen: ["bauchemie", "mechanische_kenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "die Polymergruppen Thermoplaste, Duroplaste und Elastomere nach Molekülstruktur und Temperaturverhalten unterscheiden." },
      { stufe: "Analysieren", text: "die Temperaturabhängigkeit des E-Moduls verschiedener Polymerstrukturen im Bereich der Glasübergangstemperatur analysieren." },
      { stufe: "Anwenden", text: "die temperaturbedingte Längenänderung eines Kunststoffbauteils berechnen und mit Stahl vergleichen." },
      { stufe: "Erinnern", text: "gängige Baukunststoffe wie PVC, PE, EPS/XPS, PUR/PIR, EPDM und ETFE ihren Einsatzbereichen zuordnen." },
      { stufe: "Bewerten", text: "den Einsatz von Geokunststoffen und ETFE-Folienkissen für eine Bauaufgabe anhand ihrer Funktionen und Eigenschaften beurteilen." },
    ],
  },
  labor: {
    niveau: "B", minuten: 120, vorwissen: ["mechanische_pruefungen", "frischbeton"],
    ziele: [
      { stufe: "Anwenden", text: "virtuelle Druck-, Zug- und E-Modul-Versuche an verschiedenen Werkstoffen im Universalprüfstand durchführen und die Kennwerte ablesen." },
      { stufe: "Anwenden", text: "aus Spaltzug-, Biegezug- und Haftzugversuchen die Festigkeiten berechnen und die Belastungsgeschwindigkeit kontrollieren." },
      { stufe: "Anwenden", text: "die Konsistenz von Frischbeton mit Setz- und Ausbreitmaß bestimmen und einer Konsistenzklasse zuordnen." },
      { stufe: "Bewerten", text: "die Ergebnisse von Haftzugprüfungen anhand von Mindestwert und Bruchbild beurteilen." },
      { stufe: "Anwenden", text: "die Prüfungen an Bitumen wie Nadelpenetration und Erweichungspunkt Ring und Kugel auswerten und den Penetrationsindex ermitteln." },
    ],
  },
  lebenszyklus_kosten: {
    niveau: "B/M", minuten: 90, vorwissen: ["nachhaltigkeit_daten_regeln"],
    ziele: [
      { stufe: "Verstehen", text: "die Kostengruppen der Nutzungskosten nach DIN 18960 und die Bedeutung technischer Lebensdauer und Obsoleszenz erläutern." },
      { stufe: "Anwenden", text: "mit Abzinsungs- und Rentenbarwertfaktor den Barwert von Investitions-, Betriebs- und Ersatzkosten über den Betrachtungszeitraum berechnen." },
      { stufe: "Analysieren", text: "verschiedene Bauteilvarianten (WDVS, Fenster, Flachdachabdichtung) anhand ihrer Lebenszykluskosten vergleichen." },
      { stufe: "Bewerten", text: "die Zielkonflikte zwischen ökonomischer und ökologischer Optimierung unter Berücksichtigung der Baupreisentwicklung beurteilen." },
    ],
  },
  lehm: {
    niveau: "B", minuten: 60, vorwissen: ["bauchemie", "baustoffkenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "die Zusammensetzung von Lehm aus Ton, Schluff und Sand beschreiben und die Rolle der Tonminerale als Bindemittel erläutern." },
      { stufe: "Analysieren", text: "den Einfluss von Tonanteil und Wassergehalt auf Schwindmaß und Eigenschaften eines Lehmgemischs im Rechenmodell analysieren." },
      { stufe: "Anwenden", text: "die beim Austrocknen eines Lehmputzes abzuführende Wassermenge aus Fläche, Schichtdicke, Trockenrohdichte und Feuchtegehalten berechnen." },
      { stufe: "Bewerten", text: "die Einsatzbereiche von Stampflehm, Lehmsteinen, Lehmputzen und Bentonit hinsichtlich Feuchteverhalten und Sorptionsfähigkeit beurteilen." },
    ],
  },
  materialmodelle: {
    niveau: "B/M", minuten: 120, vorwissen: ["mechanische_kenngroessen", "formaenderungen"],
    ziele: [
      { stufe: "Verstehen", text: "linear-elastisches, nichtlinear-elastisches, ideal-plastisches und elastoplastisches Materialverhalten unterscheiden." },
      { stufe: "Anwenden", text: "für ein elastoplastisches Modell mit Verfestigung Fließdehnung, Höchstspannung und bleibende Dehnung nach Entlastung berechnen." },
      { stufe: "Anwenden", text: "die Relaxation und Halbwertszeit mit dem Maxwell-Körper sowie das Kriechen mit dem Kelvin-Voigt-Körper berechnen." },
      { stufe: "Analysieren", text: "thixotropes, rheopexes und Bingham-Fließverhalten anhand von Fließkurven unterscheiden." },
      { stufe: "Bewerten", text: "für einen Baustoff ein geeignetes rheologisches Materialmodell auswählen und begründen." },
    ],
  },
  materialoptimierung: {
    niveau: "B/M", minuten: 120, vorwissen: ["bindemittel", "beton_info", "nachhaltigkeit_daten_regeln"],
    ziele: [
      { stufe: "Verstehen", text: "die Strategien Effizienz, Suffizienz, Konsistenz und Resilienz an Beispielen der Betonoptimierung erläutern." },
      { stufe: "Verstehen", text: "gängige Klinkerersatzstoffe wie Hüttensand, calcinierte Tone (LC3) und alkalisch aktivierte Bindemittel hinsichtlich Wirkungsweise und CO₂-Minderung unterscheiden." },
      { stufe: "Anwenden", text: "mit dem Rechner zur DAfStb-Richtlinie für treibhausgasoptimierte Tragwerke die THG-Emissionen eines Bauteils für verschiedene Zemente, Prüfalter und Stahlrouten ermitteln." },
      { stufe: "Analysieren", text: "den Einfluss von RC-Gesteinskörnung (Typ 1 und Typ 2), Packungsdichteoptimierung und äquivalentem w/z-Wert auf Rezeptur und Klimabilanz vergleichen." },
      { stufe: "Bewerten", text: "technische Kohlenstoffsenken wie Karbonatisierung, Pflanzenkohle und CCU/CCS hinsichtlich Reifegrad und Minderungspotenzial beurteilen." },
    ],
  },
  materialpaesse: {
    niveau: "B/M", minuten: 50, vorwissen: ["bim_baustoffe", "kreislauf_dpp"],
    ziele: [
      { stufe: "Verstehen", text: "den Zweck und die Inhalte eines Materialpasses bzw. Gebäuderessourcenpasses (Massenbilanz, Rückbaubarkeit, Restwert) erläutern." },
      { stufe: "Anwenden", text: "die massenbezogene Recyclingquote eines Gebäudes aus Stoffmassen und Verwertungsanteilen berechnen." },
      { stufe: "Anwenden", text: "den Material Circularity Indicator eines Bauteils aus Rezyklatanteil, Verwertungsquote und Nutzungsfaktor berechnen." },
      { stufe: "Analysieren", text: "den Einfluss von Bauweise, Recyclinganteil und Fügetechnik (geklebt, vermörtelt, geschraubt) auf Circularity Indicator und Urban-Mining-Restwert vergleichen." },
      { stufe: "Bewerten", text: "begründen, warum eine hohe massenbezogene Recyclingquote durch Downcycling von Beton allein keinen kreislaufgerechten Entwurf belegt." },
    ],
  },
  mauerwerk: {
    niveau: "B", minuten: 120, vorwissen: ["baustoffkenngroessen", "sicherheitskonzept"],
    ziele: [
      { stufe: "Verstehen", text: "die Mauersteinarten Mauerziegel, Kalksandstein, Porenbeton, Leichtbeton- und Lehmsteine nach Herstellung, Rohdichte und Festigkeit vergleichen." },
      { stufe: "Anwenden", text: "die charakteristische Druckfestigkeit von Mauerwerk aus Stein- und Mörteldruckfestigkeit berechnen und daraus den Bemessungswert ableiten." },
      { stufe: "Anwenden", text: "die Traglast einer Wand je Meter unter Berücksichtigung der Lastausmitte mit dem Abminderungsbeiwert Φ ermitteln." },
      { stufe: "Analysieren", text: "die Schubfestigkeit aus Haftscherfestigkeit und Reibungsanteil in Abhängigkeit von der Auflast analysieren." },
      { stufe: "Anwenden", text: "den Läufer-, Block- und Kreuzverband skizzieren und die Einhaltung des Überbindemaßes prüfen." },
    ],
  },
  mechanische_kenngroessen: {
    niveau: "B", minuten: 180, vorwissen: ["einheiten", "baustoffkenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "die Größen Spannung, Dehnung und Elastizitätsmodul definieren und das Hookesche Gesetz erläutern." },
      { stufe: "Anwenden", text: "die Dehnsteifigkeit EA und Biegesteifigkeit EI für Rund- und Rechteckquerschnitte berechnen." },
      { stufe: "Anwenden", text: "die Endkriechverformung mit der Kriechzahl φ über den effektiven E-Modul ermitteln." },
      { stufe: "Analysieren", text: "das Kriechen, Schwinden und Relaxieren verschiedener Werkstoffe wie Beton, Stahl und Holz vergleichen." },
      { stufe: "Bewerten", text: "geeignete Werkstoffe für eine Anwendung anhand ihrer mechanischen Kennwerte vergleichen und eine begründete Auswahl treffen." },
    ],
  },
  mechanische_pruefungen: {
    niveau: "B", minuten: 120, vorwissen: ["mechanische_kenngroessen", "messen_pruefen"],
    ziele: [
      { stufe: "Verstehen", text: "den Ablauf und Zweck von Druck-, Biegezug-, Spaltzug- und Zugversuchen an Beton, Stahl, Holz und Asphalt erläutern." },
      { stufe: "Anwenden", text: "aus Prüfkraft und Probenabmessungen Druck-, Spaltzug- und Biegezugfestigkeit berechnen." },
      { stufe: "Anwenden", text: "aus einem Zugversuch an Stahl Streckgrenze, Zugfestigkeit, Streckgrenzenverhältnis und Dehnung bei Höchstkraft ermitteln." },
      { stufe: "Analysieren", text: "spezielle Prüfverfahren wie Kerbschlagbiegeversuch, Marshall-Versuch und Spurbildungsversuch der jeweils geprüften Werkstoffeigenschaft zuordnen." },
    ],
  },
  messen_pruefen: {
    niveau: "B/M", minuten: 120, vorwissen: ["einheiten", "statistik"],
    ziele: [
      { stufe: "Verstehen", text: "die Begriffe Richtigkeit, Präzision, Wiederholbarkeit und Vergleichbarkeit anhand eines Treffbilds unterscheiden." },
      { stufe: "Anwenden", text: "für Messmittel wie Messschieber, Laser-Entfernungsmesser oder Nivellier ein geeignetes Gerät nach Auflösung und Messaufgabe auswählen." },
      { stufe: "Anwenden", text: "ein Unsicherheitsbudget nach GUM aus Typ-A- und Typ-B-Anteilen aufstellen und die erweiterte Messunsicherheit berechnen." },
      { stufe: "Bewerten", text: "die Ergebnisse eines Ringversuchs mit z-Score und E_n-Zahl berechnen und die Leistung eines Labors beurteilen." },
    ],
  },
  metalle: {
    niveau: "B", minuten: 60, vorwissen: ["bauchemie", "stahl"],
    ziele: [
      { stufe: "Verstehen", text: "die Baumetalle Aluminium, Kupfer, Zink, Blei, Titan und nichtrostenden Stahl nach Eigenschaften und Einsatz im Bauwesen vergleichen." },
      { stufe: "Verstehen", text: "die Passivierung und die Bimetallkorrosion an Beispielen metallischer Bauteile erläutern." },
      { stufe: "Anwenden", text: "die temperaturbedingte Längenänderung von Fassadenbauteilen aus verschiedenen Metallen berechnen und vergleichen." },
      { stufe: "Bewerten", text: "geeignete Metallpaarungen und Werkstoffe für eine Bauaufgabe hinsichtlich Korrosionsrisiko und Wärmedehnung auswählen und begründen." },
    ],
  },
  metallkorrosion: {
    niveau: "B", minuten: 90, vorwissen: ["metalle", "dauerhaftigkeit"],
    ziele: [
      { stufe: "Verstehen", text: "die Sauerstoff- und Wasserstoffkorrosion, Lochfraß, Spaltkorrosion und Spannungsrisskorrosion unterscheiden." },
      { stufe: "Verstehen", text: "die Schutzwirkung von Deckschichten mit dem Pilling-Bedworth-Verhältnis und der Patinabildung erläutern." },
      { stufe: "Anwenden", text: "die Schutzdauer eines Zinküberzugs aus Schichtdicke und Abtragsrate berechnen." },
      { stufe: "Analysieren", text: "den Einfluss von Feuchte und Chloriden auf Rostbildung und Anodenabtrag in der Korrosionssimulation analysieren." },
      { stufe: "Bewerten", text: "geeignete Werkstoffe wie wetterfesten Baustahl und nichtrostende Stähle für eine Korrosivitätskategorie nach DIN EN ISO 9223 auswählen und die Gefahr von Kontaktkorrosion beurteilen." },
    ],
  },
  mischungsberechnung: {
    niveau: "B", minuten: 150, vorwissen: ["grundlagen", "bindemittel", "expositionsklassen"],
    ziele: [
      { stufe: "Anwenden", text: "aus Expositionsklassen die maßgebenden Anforderungen an maximalen w/z-Wert, Mindestzementgehalt und Mindestdruckfestigkeitsklasse ermitteln." },
      { stufe: "Anwenden", text: "den erforderlichen w/z-Wert aus der Zielfestigkeit mithilfe der Walz-Kurven bestimmen." },
      { stufe: "Anwenden", text: "eine Betonrezeptur für 1 m³ mit der Stoffraumrechnung einschließlich Luftporen, Zusatzstoffen (k-Wert-Ansatz) und Eigenfeuchte der Gesteinskörnung berechnen." },
      { stufe: "Analysieren", text: "die Ist-Sieblinie eines Gesteinskörnungsgemischs mit den Regelsieblinien vergleichen und den Mehlkorngehalt prüfen." },
      { stufe: "Erschaffen", text: "für ein vorgegebenes Bauteil eine vollständige Mischungszusammensetzung entwerfen und die Einhaltung aller Grenzwerte nachweisen." },
    ],
  },
  modernisierung: {
    niveau: "B", minuten: 90, vorwissen: ["bauphysik", "daemmung_vergleich", "energieausweis"],
    ziele: [
      { stufe: "Erinnern", text: "die Bauteilanforderungen und Nachrüstpflichten des GModG für Bestandsgebäude wiedergeben." },
      { stufe: "Anwenden", text: "die erforderliche Dämmdicke zum Erreichen des U-Höchstwerts eines Bauteils berechnen und das Ergebnis kontrollieren." },
      { stufe: "Anwenden", text: "die Energieeinsparung, die Kosten und die statische Amortisationszeit einer Dämmmaßnahme ermitteln." },
      { stufe: "Analysieren", text: "verschiedene Dämmstoffe unterschiedlicher Wärmeleitfähigkeit hinsichtlich Dämmdicke und Wirtschaftlichkeit vergleichen." },
      { stufe: "Bewerten", text: "die Reihenfolge von Sanierungsschritten nach der Regel „Hülle vor Technik“ unter Berücksichtigung der Förderstruktur begründen." },
    ],
  },
  nachbehandlung: {
    niveau: "B", minuten: 45, vorwissen: ["frischbeton", "hydratation_folgen"],
    ziele: [
      { stufe: "Verstehen", text: "die Ziele der Nachbehandlung und die Folgen zu früher Austrocknung wie Frühschwinden und Festigkeitsverlust erläutern." },
      { stufe: "Anwenden", text: "die Verdunstungsrate einer Betonoberfläche aus Luft- und Betontemperatur, relativer Luftfeuchte und Windgeschwindigkeit berechnen." },
      { stufe: "Anwenden", text: "die Mindestdauer der Nachbehandlung nach DIN 1045-3 aus Festigkeitsentwicklung r, Oberflächentemperatur und Expositionsklasse ermitteln." },
      { stufe: "Bewerten", text: "für gegebene Witterungsbedingungen geeignete Nachbehandlungsmaßnahmen auswählen und begründen." },
    ],
  },
  nawaro: {
    niveau: "B", minuten: 90, vorwissen: ["holz", "waermeeigenschaften"],
    ziele: [
      { stufe: "Verstehen", text: "biogene Dämmstoffe und Baustoffe wie Holzfaser, Zellulose, Hanf, Stroh und Kork nach Rohstoff und Anwendung unterscheiden." },
      { stufe: "Anwenden", text: "die im Holz gespeicherte biogene Kohlenstoffmenge und das CO₂-Äquivalent aus Rohdichte und Holzfeuchte berechnen." },
      { stufe: "Analysieren", text: "biogene Dämmstoffe nach Wärmeleitfähigkeit, Wärmespeicherfähigkeit, Feuchteverhalten und Schallschutz vergleichen." },
      { stufe: "Bewerten", text: "für ein Bauteil einen biogenen Dämmstoff nach einem planerischen Zielkriterium auswählen und die Wahl begründen." },
    ],
  },
  oekobilanz_lca: {
    niveau: "B/M", minuten: 75, vorwissen: ["nachhaltigkeit_daten_regeln", "materialoptimierung"],
    ziele: [
      { stufe: "Verstehen", text: "die Lebenszyklusmodule A bis D nach DIN EN 15978 und DIN EN 15804 den Phasen eines Bauwerks zuordnen und die Systemgrenzen erläutern." },
      { stufe: "Verstehen", text: "die Wirkungsindikatoren GWP, ODP, AP, EP und POCP unterscheiden und ihre Einheiten angeben." },
      { stufe: "Anwenden", text: "mit der EPD-Musterdatenbank das GWP der Herstellung (A1–A3) und des Transports (A4) einer Materialmenge berechnen." },
      { stufe: "Analysieren", text: "den Zementanteil am GWP eines Transportbetons abschätzen und die Wirkung der Zementart auf das Ergebnis vergleichen." },
    ],
  },
  lca_rechner: {
    niveau: "B/M", minuten: 90, vorwissen: ["oekobilanz_lca", "bauphysik"],
    ziele: [
      { stufe: "Anwenden", text: "mit dem interaktiven CO₂-Rechner das Treibhauspotenzial einer Gebäudevariante einschließlich Transport (A4) und Modul D berechnen." },
      { stufe: "Anwenden", text: "das GWP eines Wandaufbaus je m² Wand aus den Schichten ermitteln und mit dem U-Wert gegenüberstellen." },
      { stufe: "Analysieren", text: "in der Transportbeton-Übung die Ökobilanz von Betonrezepturen mit CEM I, CEM III/A und RC-Gesteinskörnung vergleichen." },
      { stufe: "Bewerten", text: "den spezifischen Lebenszyklus-Kennwert eines Wohngebäudes mit den QNG-Anforderungswerten vergleichen und begründen, warum Modul D nicht angerechnet wird." },
    ],
  },
  lca_ingenieurbau: {
    niveau: "M", minuten: 60, vorwissen: ["oekobilanz_lca"],
    ziele: [
      { stufe: "Verstehen", text: "die Besonderheiten der Ökobilanz von Ingenieurbauwerken nach DIN EN 17472 gegenüber Gebäuden nach DIN EN 15978 erläutern." },
      { stufe: "Anwenden", text: "die Anzahl der Austauschzyklen von Belag, Lagern und Korrosionsschutz für einen Betrachtungszeitraum bestimmen." },
      { stufe: "Analysieren", text: "den Lebenszyklus-GWP einer Spannbeton-Hohlkastenbrücke und einer Stahlverbundbrücke modulweise vergleichen." },
      { stufe: "Bewerten", text: "den Einfluss verkehrsbedingter Stauemissionen (B8) und einer beschleunigten Bauweise auf die Variantenwahl beurteilen." },
    ],
  },
  lca_regulatorik: {
    niveau: "B/M", minuten: 75, vorwissen: ["oekobilanz_lca", "nachhaltigkeit_daten_regeln"],
    ziele: [
      { stufe: "Verstehen", text: "die Ebenen des Rechtsrahmens von Green Deal und EU-Klimagesetz bis BauPVO, EPBD, ESPR und CBAM einordnen." },
      { stufe: "Anwenden", text: "mit dem CRREM-Simulator das Stranding-Jahr eines Büro- oder Wohngebäudes für verschiedene Sanierungsstufen bestimmen." },
      { stufe: "Analysieren", text: "die Wirkung von Betriebsoptimierung, Hüllsanierung und Tiefensanierung auf den Dekarbonisierungspfad vergleichen." },
      { stufe: "Bewerten", text: "Praxisansätze wie Gebäudetyp E, Urban Mining, Lehmbau und Holz-Hybrid hinsichtlich ihres Beitrags zur Ressourcenschonung beurteilen." },
    ],
  },
  online_tools: {
    niveau: "B/M", minuten: 60, vorwissen: ["bauphysik", "baustatik", "oekobilanz_lca"],
    ziele: [
      { stufe: "Verstehen", text: "kuratierte Online-Werkzeuge für Statik, Bauphysik, Holzbau, LCA und BIM nach Einsatzzweck, Zugangsart und hinterlegten Normen zuordnen." },
      { stufe: "Anwenden", text: "die Ergebnisse eines Online-Stabwerkprogramms durch eine Handrechnung von Biegemoment und Durchbiegung eines Einfeldträgers nachrechnen." },
      { stufe: "Anwenden", text: "den Bemessungswert einer Deckenlast aus charakteristischen ständigen und veränderlichen Lasten in der Grundkombination berechnen." },
      { stufe: "Analysieren", text: "typische Fehlerquellen bei der Werkzeugnutzung wie Einheitenfehler, falsche Lagerbedingungen oder doppelt angesetzte Teilsicherheitsbeiwerte identifizieren." },
      { stufe: "Anwenden", text: "bereitgestellte Python-Snippets zur Abfrage von EPD-Daten über eine REST-Schnittstelle oder zur Mengenermittlung aus IFC-Modellen ausführen und anpassen." },
    ],
  },
  probenahme: {
    niveau: "B/M", minuten: 90, vorwissen: ["baustoffkenngroessen", "festbeton"],
    ziele: [
      { stufe: "Verstehen", text: "die Proben-Hierarchie von der Einzelprobe über die Sammelprobe bis zur Laborprobe bei der Haufwerksbeprobung erläutern." },
      { stufe: "Anwenden", text: "die Bohrmehlmenge je Tiefenstufe für eine Chloridprofilbestimmung berechnen und die Anzahl erforderlicher Bohrlöcher festlegen." },
      { stufe: "Anwenden", text: "die Bohrkernfestigkeit über Schlankheit und Korrekturfaktor auf eine vergleichbare Druckfestigkeit umrechnen." },
      { stufe: "Anwenden", text: "die Rückprallwerte des Rückprallhammers bei geneigter Schlagrichtung korrigieren." },
      { stufe: "Bewerten", text: "für ein Bauteil wie Brückenpfeiler, Parkdeck oder Balkonplatte geeignete Entnahmestellen und Untersuchungsverfahren auswählen und begründen." },
    ],
  },
  putzemoertel: {
    niveau: "B", minuten: 90, vorwissen: ["kalk", "gips"],
    ziele: [
      { stufe: "Verstehen", text: "die Mörtelarten Normal-, Leicht- und Dünnbettmörtel sowie Putzmörtel nach Bindemittel, Mörtelklasse und Einsatzbereich unterscheiden." },
      { stufe: "Verstehen", text: "den Aufbau typischer Putzsysteme (zweilagiger Außenputz, WDVS-Putz, Sanierputz nach WTA) erläutern." },
      { stufe: "Anwenden", text: "den Trockenmörtelbedarf für eine Putzfläche aus Fläche, Schichtdicke und Verbrauchsfaktor berechnen und in Gebinde umrechnen." },
      { stufe: "Anwenden", text: "den Mauermörtelbedarf für eine Wandfläche in Abhängigkeit von Wanddicke und Steinformat ermitteln." },
      { stufe: "Bewerten", text: "für einen gegebenen Untergrund und eine Beanspruchung (Sockel, Nassbereich, Innenraum) ein geeignetes Putz- oder Mörtelsystem auswählen und begründen." },
    ],
  },
  px_bauleitung: {
    niveau: "B", minuten: 60, vorwissen: ["frischbeton", "nachbehandlung", "bauschaeden"],
    ziele: [
      { stufe: "Anwenden", text: "bei der Betonannahme Lieferschein, Konsistenz, Frischbetontemperatur und Luftporengehalt prüfen und die Probekörperherstellung veranlassen." },
      { stufe: "Anwenden", text: "die Erhöhung des w/z-Werts durch nachträgliche Wasserzugabe am Fahrmischer berechnen und mit dem Grenzwert der Expositionsklasse vergleichen." },
      { stufe: "Anwenden", text: "den Grundwert der Verankerungslänge eines Betonstahls zur Plausibilisierung bei der Bewehrungsabnahme berechnen." },
      { stufe: "Analysieren", text: "die Behinderungsanzeige nach § 6 Abs. 1 VOB/B und die Bedenkenanmeldung nach § 4 Abs. 3 VOB/B nach Anlass, Form und Rechtsfolge unterscheiden." },
      { stufe: "Anwenden", text: "geeignete Baustellenprüfungen wie CM-Messung, Haftzugprüfung oder Holzfeuchtemessung für eine Ausführungsfrage auswählen." },
    ],
  },
  px_bautagebuch: {
    niveau: "B", minuten: 45, vorwissen: ["px_bauleitung", "frischbeton"],
    ziele: [
      { stufe: "Verstehen", text: "die Beweisfunktion eines lückenlos geführten Bautagebuchs erläutern." },
      { stufe: "Anwenden", text: "einen Bautagebucheintrag mit Wetterdaten, Personal, Arbeitsfortschritt, Prüfungen und Störungen vollständig und plausibel erstellen." },
      { stufe: "Anwenden", text: "bei Temperaturen unter +5 °C die erforderlichen Winterbaumaßnahmen und Frischbetontemperaturmessungen nach DIN 1045-3 dokumentieren." },
      { stufe: "Bewerten", text: "in Störfallszenarien begründen, ob eine Bedenkenanmeldung nach VOB/B § 4 Abs. 3 oder eine Behinderungsanzeige nach VOB/B § 6 erforderlich ist." },
      { stufe: "Analysieren", text: "die automatische Bewertung des eigenen Eintrags auswerten und fehlende oder unplausible Angaben korrigieren." },
    ],
  },
  px_karriere: {
    niveau: "B", minuten: 30, vorwissen: ["px_bauleitung"],
    ziele: [
      { stufe: "Verstehen", text: "erläutern, warum Freigaben, Anordnungen und Konfliktlösungen auf der Baustelle schriftlich zu dokumentieren sind." },
      { stufe: "Erinnern", text: "die Pflichten zu Arbeitsschutz, Berufshaftpflicht und Fortbildung beim Berufseinstieg benennen." },
      { stufe: "Verstehen", text: "berufliche Zusatzqualifikationen wie E-Schein, SIVV-Schein und Fachingenieur Bauwerkserhaltung den jeweiligen Tätigkeitsfeldern zuordnen." },
      { stufe: "Anwenden", text: "aus Herstellkosten und Zuschlägen für allgemeine Geschäftskosten sowie Wagnis und Gewinn einen Angebotspreis berechnen." },
      { stufe: "Anwenden", text: "die Lohnkosten einer Bauleistung aus Menge, Aufwandswert und Mittellohn ermitteln." },
    ],
  },
  px_produktion: {
    niveau: "B", minuten: 50, vorwissen: ["qualitaetssicherung", "bp_recht_avcp", "mischungsberechnung"],
    ziele: [
      { stufe: "Verstehen", text: "die Elemente der werkseigenen Produktionskontrolle beschreiben und ihren Zusammenhang mit Leistungserklärung und CE-Kennzeichnung erläutern." },
      { stufe: "Anwenden", text: "die Feuchtekorrektur bei der Dosierung feuchter Gesteinskörnung berechnen und die Folgen einer unterlassenen Korrektur für den w/z-Wert ermitteln." },
      { stufe: "Anwenden", text: "den Konformitätsnachweis der Druckfestigkeit bei Erstherstellung mit Mittelwert- und Einzelwertkriterium prüfen." },
      { stufe: "Analysieren", text: "typische Fertigungsfehler wie mangelhafte Feuchtemessung, Lunkerbildung oder verzögerte Ettringitbildung (DEF) ihren Ursachen zuordnen." },
    ],
  },
  rechnung_bestand: {
    niveau: "B/M", minuten: 45, vorwissen: ["historisch", "bauwerksuntersuchung", "stahlbeton_bemessung"],
    ziele: [
      { stufe: "Anwenden", text: "historische Betonfestigkeitsklassen nach DIN 1045:1972 über Würfelnormierung und Zylinderumrechnung einer heutigen Festigkeitsklasse zuordnen." },
      { stufe: "Anwenden", text: "den Bemessungswert der Betondruckfestigkeit im Bestand mit und ohne Bohrkernprüfung berechnen." },
      { stufe: "Bewerten", text: "den Nutzen einer zerstörenden Bauwerksprüfung gegenüber einer Einstufung nach Aktenlage mit pauschalem Abschlag beurteilen." },
      { stufe: "Anwenden", text: "für historische Betonstähle den Bemessungswert der Streckgrenze und die Zugkapazität eines Einzelstabs berechnen." },
      { stufe: "Bewerten", text: "die Schweißeignung und das Verbundverhalten historischer Betonstähle beurteilen und Konsequenzen für die Verankerung ableiten." },
    ],
  },
  rechnung_beton: {
    niveau: "B", minuten: 75, vorwissen: ["mischungsberechnung", "expositionsklassen", "grundlagen"],
    ziele: [
      { stufe: "Anwenden", text: "aus Expositionsklasse, Konsistenzklasse und Größtkorn Wasseranspruch, Zementgehalt und wirksamen w/z-Wert nach DIN 1045-2 bestimmen." },
      { stufe: "Anwenden", text: "mit der Stoffraumrechnung den Gehalt an Gesteinskörnung je Kubikmeter Beton berechnen und die Frischbetonrohdichte plausibilisieren." },
      { stufe: "Anwenden", text: "den äquivalenten w/z-Wert bei Anrechnung von Flugasche oder Silikastaub mit dem k-Wert-Ansatz berechnen." },
      { stufe: "Anwenden", text: "die Frischbetontemperatur aus Massen, Temperaturen und Wärmekapazitäten der Ausgangsstoffe einschließlich Eiszugabe berechnen." },
      { stufe: "Bewerten", text: "anhand des temperaturkorrigierten Reifealters die Festigkeitsentwicklung abschätzen und die Ausschaleignung eines Bauteils beurteilen." },
    ],
  },
  rechnung_brandschutz: {
    niveau: "B/M", minuten: 50, vorwissen: ["brandschutz", "holzbau_bauphysik", "holzbau_bemessung"],
    ziele: [
      { stufe: "Anwenden", text: "die effektive Abbrandtiefe aus Abbrandrate, Branddauer und Entfestigungszone nach DIN EN 1995-1-2 berechnen." },
      { stufe: "Anwenden", text: "den Restquerschnitt eines Holzträgers bestimmen und die Heißtragfähigkeit M_fi,Rd mit der Einwirkung M_fi,Ed vergleichen." },
      { stufe: "Anwenden", text: "die Mindestabmessungen und Achsabstände von Stahlbetonbalken und -stützen nach dem Tabellenverfahren von DIN EN 1992-1-2 ermitteln." },
      { stufe: "Analysieren", text: "das Brandverhalten von Brettschichtholz, Nadel- und Laubholz anhand ihrer Abbrandraten vergleichen." },
      { stufe: "Verstehen", text: "die Abplatzgefahr hochfester Betone im Brandfall und die zugehörige Gegenmaßnahme erläutern." },
    ],
  },
  rechnung_holzbau: {
    niveau: "B", minuten: 40, vorwissen: ["holzbau_bemessung", "knicken"],
    ziele: [
      { stufe: "Anwenden", text: "den Bemessungswert der Druckfestigkeit einer Vollholzstütze aus Festigkeitsklasse, k_mod und γ_M berechnen." },
      { stufe: "Anwenden", text: "für eine pendelnd gelagerte Stütze (Euler-Fall 2) Knicklänge, Schlankheitsgrad und bezogenen Schlankheitsgrad ermitteln." },
      { stufe: "Anwenden", text: "den Knickbeiwert k_c nach dem Ersatzstabverfahren von Eurocode 5 berechnen und den Knicknachweis führen." },
      { stufe: "Bewerten", text: "den Ausnutzungsgrad bewerten und bei Überschreitung Maßnahmen wie einen größeren Querschnitt oder eine verkürzte Knicklänge begründen." },
    ],
  },
  rechnung_mauerwerk: {
    niveau: "B", minuten: 35, vorwissen: ["mauerwerk", "bp_mauerwerk", "sicherheitskonzept"],
    ziele: [
      { stufe: "Anwenden", text: "den Bemessungswert der Mauerwerksdruckfestigkeit aus charakteristischer Festigkeit und Teilsicherheitsbeiwert berechnen." },
      { stufe: "Anwenden", text: "die Schlankheit einer zweiseitig gehaltenen Wand ermitteln und gegen den Grenzwert 25 des vereinfachten Verfahrens prüfen." },
      { stufe: "Anwenden", text: "mit dem Abminderungsfaktor Φ den Traglastwiderstand N_Rd je Meter Wandlänge nach DIN EN 1996-3 berechnen." },
      { stufe: "Analysieren", text: "den Einfluss von Wanddicke und Steinart (Kalksandstein, Hochlochziegel) auf den Ausnutzungsgrad vergleichen." },
    ],
  },
  rechnung_nachhaltigkeit: {
    niveau: "B/M", minuten: 45, vorwissen: ["oekobilanz_lca", "materialoptimierung", "bindemittel"],
    ziele: [
      { stufe: "Anwenden", text: "die Karbonatisierungstiefe einer Betonwand mit dem Quadratwurzel-Zeit-Gesetz berechnen." },
      { stufe: "Anwenden", text: "aus karbonatisiertem Volumen, CaO-Gehalt und Molmassenverhältnis die CO₂-Aufnahme je m² Bauteilfläche ermitteln." },
      { stufe: "Analysieren", text: "das Treibhauspotenzial zweier Betonrezepturen mit CEM I und CEM III/B berechnen und vergleichen." },
      { stufe: "Bewerten", text: "betontechnologische Folgen eines klinkerarmen Zements wie langsamere Hydratation und verlängerte Nachbehandlung bei der Rezepturwahl abwägen." },
    ],
  },
  rechnung_schallschutz: {
    niveau: "B", minuten: 35, vorwissen: ["schallschutz", "baustoffkenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "den Einfluss des Massegesetzes und der Flankenübertragung auf die Luftschalldämmung massiver Bauteile erläutern." },
      { stufe: "Anwenden", text: "die flächenbezogene Masse einer Massivwand einschließlich Putz berechnen." },
      { stufe: "Anwenden", text: "das Direktschalldämm-Maß R_w über die Massekurve nach DIN 4109 Beiblatt 1 und das Bauschalldämm-Maß R'_w mit Flankenabzug ermitteln." },
      { stufe: "Bewerten", text: "das Ergebnis mit den Anforderungen nach DIN 4109-1 an Trennwände vergleichen und Verbesserungsmaßnahmen begründen." },
    ],
  },
  rechnung_stahlbeton: {
    niveau: "B", minuten: 45, vorwissen: ["stahlbeton_bemessung", "betonkennwerte", "baustatik"],
    ziele: [
      { stufe: "Anwenden", text: "die Bemessungswerte f_cd und f_yd mit Teilsicherheitsbeiwerten und dem Beiwert α_cc berechnen." },
      { stufe: "Anwenden", text: "für einen Rechteckbalken Nutzhöhe, bezogenes Moment μ_Ed, Hebelarm und erforderliche Biegezugbewehrung A_s im GZT nach Eurocode 2 ermitteln." },
      { stufe: "Bewerten", text: "durch Vergleich von μ_Ed mit μ_lim prüfen, ob die Druckzone ohne Druckbewehrung ausreicht, und bei Überschreitung konstruktive Maßnahmen ableiten." },
      { stufe: "Anwenden", text: "die erforderliche Stahlfläche in eine Stabwahl umsetzen und deren Auslastung angeben." },
    ],
  },
  rechnung_u_wert: {
    niveau: "B", minuten: 30, vorwissen: ["bauphysik", "waermeeigenschaften"],
    ziele: [
      { stufe: "Erinnern", text: "die Wärmeübergangswiderstände R_si und R_se für horizontalen Wärmestrom nach DIN EN ISO 6946 angeben." },
      { stufe: "Anwenden", text: "die Wärmedurchlasswiderstände der Schichten einer gedämmten Betonwand und daraus den U-Wert berechnen." },
      { stufe: "Analysieren", text: "den Einfluss von Dämmstoffdicke und Wärmeleitfähigkeit auf den U-Wert mit dem Echtzeitrechner untersuchen." },
      { stufe: "Bewerten", text: "den berechneten U-Wert mit dem Höchstwert von 0,24 W/(m²K) für Außenwände vergleichen und eine erforderliche Dämmstoffdicke begründen." },
    ],
  },
  ressourcen_umwelt: {
    niveau: "B", minuten: 75, vorwissen: ["nachhaltigkeit_daten_regeln", "nawaro"],
    ziele: [
      { stufe: "Verstehen", text: "den Energieverbrauch, die CO₂-Emissionen und Ressourcenbedarf wesentlicher Baustoffe vergleichend erläutern." },
      { stufe: "Verstehen", text: "die Dekarbonisierungsstrategien Klinkereffizienz, alternative Brennstoffe, CCUS und Betoneffizienz für Zement und Beton beschreiben." },
      { stufe: "Anwenden", text: "aus Darrmasse und Kohlenstoffanteil die im Holz gespeicherte CO₂-Menge nach DIN EN 16449 berechnen." },
      { stufe: "Bewerten", text: "nachwachsende Dämm- und Konstruktionsbaustoffe hinsichtlich CO₂-Speicherung, Ressourceneffizienz und Einsatzgrenzen vergleichend bewerten." },
    ],
  },
  ressourceneffizienz: {
    niveau: "B/M", minuten: 90, vorwissen: ["kreislauf_dpp", "rueckbau"],
    ziele: [
      { stufe: "Erinnern", text: "die zehn R-Strategien von Refuse bis Recover wiedergeben und Beispielen aus dem Bauwesen zuordnen." },
      { stufe: "Verstehen", text: "die Aufgaben und Angebote des Ressourceneffizienz-Zentrums Bayern und regionaler Netzwerke beschreiben." },
      { stufe: "Anwenden", text: "mit dem Baustoff-Simulator den Einfluss von Betonart, Bewehrungsgrad, regionaler Gesteinskörnung und Geometrieoptimierung auf die Ressourcenbilanz ermitteln." },
      { stufe: "Anwenden", text: "mit dem ROI-Rechner die Ersparnis durch Abfallvermeidung, Transportoptimierung und RC-Einsatz berechnen." },
      { stufe: "Bewerten", text: "einzelne Maßnahmen der Ressourceneffizienz hinsichtlich ökologischem und wirtschaftlichem Nutzen vergleichend bewerten." },
    ],
  },
  rueckbau: {
    niveau: "B", minuten: 120, vorwissen: ["schadstoffe", "abfaelle"],
    ziele: [
      { stufe: "Verstehen", text: "die Phasen des selektiven Rückbaus von der Bestandserkundung über die Entfrachtung bis zur Verwertung erläutern." },
      { stufe: "Analysieren", text: "anhand der Epochen-Schadstoff-Matrix die im Gebäude zu erwartenden Schadstoffe ableiten." },
      { stufe: "Anwenden", text: "die Wertstoff-Massenströme eines Rückbauobjekts aus umbautem Raum und Bauweise abschätzen." },
      { stufe: "Bewerten", text: "die Recyclingwege für Beton, Mauerwerk, Gips, Altholz, Metalle, Glas und Kunststoffe vergleichend beurteilen." },
      { stufe: "Verstehen", text: "typische Rückbaufehler und ihre rechtlichen Konsequenzen für die Bauleitung erläutern." },
    ],
  },
  schadreaktionen_beton: {
    niveau: "B", minuten: 90, vorwissen: ["bindemittel", "festbeton", "expositionsklassen"],
    ziele: [
      { stufe: "Verstehen", text: "die Mechanismen von Alkali-Kieselsäure-Reaktion, Frost-Tau-Wechsel und Sulfattreiben erläutern." },
      { stufe: "Anwenden", text: "den Alkalieintrag über den Zementgehalt berechnen und die Wirkung eines NA-Zements ermitteln." },
      { stufe: "Anwenden", text: "die Gesteinskörnungen den Alkaliempfindlichkeitsklassen und Bauteile den Feuchtigkeitsklassen WO, WF und WS zuordnen." },
      { stufe: "Analysieren", text: "den Zusammenhang zwischen Luftporengehalt und Abstandsfaktor für den Frostwiderstand auswerten." },
      { stufe: "Bewerten", text: "das Schadensrisiko für eine Betonzusammensetzung beurteilen und betontechnologische Gegenmaßnahmen auswählen." },
    ],
  },
  schallschutz: {
    niveau: "B", minuten: 45, vorwissen: ["baustoffkenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "das Massegesetz und die Schalltransmission durch einschalige, biegesteife Bauteile erläutern." },
      { stufe: "Anwenden", text: "die flächenbezogene Masse m' eines Bauteilaufbaus aus Schichtdicken und Rohdichten berechnen." },
      { stufe: "Anwenden", text: "das bewertete Schalldämm-Maß R_w nach DIN 4109-32 berechnen und den Gültigkeitsbereich der Formel prüfen." },
      { stufe: "Analysieren", text: "den Einfluss von Material und Schichtdicke auf die Luftschalldämmung vergleichen." },
    ],
  },
  sichtbeton: {
    niveau: "B", minuten: 45, vorwissen: ["herstellung_einbau", "frischbeton"],
    ziele: [
      { stufe: "Erinnern", text: "die Sichtbetonklassen SB 1 bis SB 4 nach DBV/VDZ-Merkblatt mit ihren Anforderungen zuordnen." },
      { stufe: "Verstehen", text: "den Einfluss von Schalungshaut, Trennmittel und Betonzusammensetzung auf das Erscheinungsbild einer Sichtbetonfläche erläutern." },
      { stufe: "Anwenden", text: "den Porenflächenanteil einer Prüffläche berechnen und mit den Anforderungen der Sichtbetonklasse vergleichen." },
      { stufe: "Analysieren", text: "typische optische Beeinträchtigungen ihren herstellungsbedingten Ursachen zuordnen." },
    ],
  },
  sonderbetone: {
    niveau: "B/M", minuten: 150, vorwissen: ["grundlagen", "frischbeton", "festbeton"],
    ziele: [
      { stufe: "Verstehen", text: "die Zusammensetzung, Herstellung und Eigenschaften von UHPC, SVB, Leicht-, Infraleicht-, Faser- und Spritzbeton erläutern." },
      { stufe: "Analysieren", text: "die Beispielrezepturen verschiedener Sonderbetone hinsichtlich Bindemittelgehalt, w/z-Wert und Gesteinskörnung vergleichen." },
      { stufe: "Anwenden", text: "den Einfluss des RC-Anteils auf E-Modul, Wasseranspruch sowie Schwinden und Kriechen von Recyclingbeton abschätzen." },
      { stufe: "Bewerten", text: "für eine gegebene Bauaufgabe einen geeigneten Sonderbeton auswählen und die Wahl begründen." },
    ],
  },
  sonstiges: {
    niveau: "B/M", minuten: 45, vorwissen: ["waermeeigenschaften", "baustoffkenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "die Wirkprinzipien von Phasenwechselmaterialien, Aerogelen, Vakuumisolationspaneelen, selbstheilenden Baustoffen und Photokatalyse erläutern." },
      { stufe: "Anwenden", text: "die je Kilogramm speicherbare Wärme von Beton und Paraffin-PCM aus sensibler und latenter Wärme berechnen und vergleichen." },
      { stufe: "Verstehen", text: "leichte Gesteinskörnungen nach Herkunft und Einsatz in Leichtbeton unterscheiden." },
      { stufe: "Bewerten", text: "die Chancen und Grenzen innovativer Baustoffe hinsichtlich Leistungsfähigkeit, Dauerhaftigkeit und Zulassungssituation beurteilen." },
    ],
  },
  spannbeton: {
    niveau: "M", minuten: 180, vorwissen: ["stahlbeton_bemessung", "betonkennwerte", "hydratation_folgen"],
    ziele: [
      { stufe: "Verstehen", text: "das Prinzip der Vorspannung und die Notwendigkeit hochfester Spannstähle anhand der Dehnungsverhältnisse erläutern." },
      { stufe: "Analysieren", text: "die Vorspannverfahren mit sofortigem, nachträglichem, ohne Verbund und externer Vorspannung unterscheiden." },
      { stufe: "Anwenden", text: "die Randspannungen eines vorgespannten Querschnitts aus Normalkraft- und Momentenanteil berechnen und die Spannungsgrenzen im GZG prüfen." },
      { stufe: "Anwenden", text: "die Reibungs-, Keilschlupf- und zeitabhängige Spannkraftverluste aus Kriechen, Schwinden und Relaxation berechnen." },
      { stufe: "Bewerten", text: "die Risiken der Spannungsrisskorrosion bewerten und geeignete zerstörungsfreie Prüfverfahren für Spannglieder auswählen." },
    ],
  },
  stahl: {
    niveau: "B", minuten: 180, vorwissen: ["mechanische_kenngroessen", "sicherheitskonzept"],
    ziele: [
      { stufe: "Verstehen", text: "die Spannungs-Dehnungs-Linien von Baustahl, Betonstahl und Spannstahl vergleichen und ausgeprägte Streckgrenze und Dehngrenze unterscheiden." },
      { stufe: "Erinnern", text: "die Stahlbezeichnungen nach DIN EN 10027-1 entschlüsseln und Stahlsorten wie S235, S355 oder B500B ihren Anwendungen zuordnen." },
      { stufe: "Anwenden", text: "den plastischen Biegewiderstand eines Walzprofils berechnen und die Ausnutzung unter einem Bemessungsmoment prüfen." },
      { stufe: "Analysieren", text: "den Einfluss von Temperatur im Brandfall, Kerbfall bei Ermüdung und Schweißeigenspannungen auf die Tragfähigkeit von Stahl analysieren." },
      { stufe: "Bewerten", text: "mit dem Eisen-Kohlenstoff-Diagramm und dem Hebelgesetz das Gefüge eines Stahls bestimmen und den Einfluss von Kohlenstoff- und Legierungsgehalt (CEV) auf Festigkeit, Zähigkeit und Schweißbarkeit beurteilen." },
    ],
  },
  statistik: {
    niveau: "B", minuten: 120, vorwissen: ["einheiten"],
    ziele: [
      { stufe: "Anwenden", text: "den Mittelwert, Median, Standardabweichung und Variationskoeffizient einer Messreihe berechnen." },
      { stufe: "Anwenden", text: "mögliche Ausreißer einer Prüfserie mit dem Grubbs-Test identifizieren und die Messreihe bereinigen." },
      { stufe: "Anwenden", text: "aus einer Stichprobe den charakteristischen Wert mit Fraktilfaktor und den Bemessungswert nach DIN EN 1990 Anhang D ermitteln." },
      { stufe: "Analysieren", text: "in einem faktoriellen 2^k-Versuchsplan Haupt- und Wechselwirkungseffekte der Faktoren bestimmen und vergleichen." },
    ],
  },
  vdi6200: {
    niveau: "B/M", minuten: 120, vorwissen: ["bauschaeden", "bauwerksuntersuchung"],
    ziele: [
      { stufe: "Erinnern", text: "die Prüfungsarten nach DIN 1076 und VDI 6200 mit ihren Intervallen und den zuständigen Personen wiedergeben." },
      { stufe: "Verstehen", text: "die Schadensfolgeklassen CC 1 bis CC 3 und Robustheitsklassen RC 1 bis RC 4 nach VDI 6200 erläutern." },
      { stufe: "Anwenden", text: "festgestellte Schäden nach den Kriterien Standsicherheit, Verkehrssicherheit und Dauerhaftigkeit bewerten und daraus eine Zustandsnote berechnen." },
      { stufe: "Analysieren", text: "typische Schäden an Beton-, Stahl-, Holz- und Mauerwerksbauten den Bewertungsstufen zuordnen." },
      { stufe: "Bewerten", text: "aus der Zustandsnote den Handlungsbedarf und die erforderlichen Prüfintervalle ableiten." },
    ],
  },
  weitere_organik: {
    niveau: "B", minuten: 75, vorwissen: ["kunststoffe", "asphalt", "nawaro"],
    ziele: [
      { stufe: "Verstehen", text: "die Alterungsmechanismen organischer Baustoffe durch UV-Strahlung, Temperatur, Feuchte und biologischen Abbau erläutern." },
      { stufe: "Verstehen", text: "den kolloidalen Aufbau von Bitumen und dessen Oxidationsalterung beschreiben." },
      { stufe: "Analysieren", text: "typische Schadensbilder wie Weichmacherwanderung, Kreidung und Versprödung an Kunststoffen ihren Ursachen zuordnen." },
      { stufe: "Anwenden", text: "mit der Faktorenmethode die Nutzungsdauer eines organischen Baustoffs aus Referenznutzungsdauer und Beanspruchungsfaktoren abschätzen." },
      { stufe: "Bewerten", text: "geeignete Schutzmaßnahmen wie UV-Stabilisierung, Hydrophobierung oder Imprägnierung für einen Anwendungsfall auswählen." },
    ],
  },
  "wu-bauwerke": {
    niveau: "B/M", minuten: 90, vorwissen: ["expositionsklassen", "hydratation_folgen"],
    ziele: [
      { stufe: "Erinnern", text: "die Beanspruchungs- und Nutzungsklassen der DAfStb WU-Richtlinie benennen und Bauteilen zuordnen." },
      { stufe: "Anwenden", text: "für ein WU-Bauteil die Mindestdicke prüfen sowie Druckgefälle und zulässige Rissbreite aus Wasserdruck und Wanddicke ermitteln." },
      { stufe: "Analysieren", text: "die drei Entwurfsgrundsätze Trennrissvermeidung, Rissbreitenbegrenzung und planmäßige Rissinjektion vergleichen." },
      { stufe: "Bewerten", text: "geeignete Fugen- und Abdichtungssysteme für Arbeits- und Dehnfugen auswählen und begründen." },
      { stufe: "Analysieren", text: "die Weiße, Schwarze, Braune und Gelbe Wanne nach Wirkprinzip und Einsatzgrenzen unterscheiden." },
    ],
  },
  // Restliche Fachmodule (Typ norm/database, Reitermodule) – aus den Modulinhalten abgeleitet (Oktober 2026)
  materialkennwerte: {
    niveau: "B", minuten: 30, vorwissen: ["baustoffkenngroessen"],
    ziele: [
      { stufe: "Verstehen", text: "charakteristische Festigkeiten, Mittelwerte der Steifigkeit und typische Herstellerwerte in der Kennwerte-Tabelle unterscheiden und ihre Herkunft aus Produkt- und Bemessungsnormen erläutern." },
      { stufe: "Anwenden", text: "die thermische Längenänderung eines Bauteils mit ΔL = α_T · L₀ · ΔT berechnen und die Relativbewegung zwischen Aluminium und Stahlbeton bestimmen." },
      { stufe: "Anwenden", text: "die spezifische Steifigkeit E/ρ von Baustahl, Nadelholz und Beton berechnen und vergleichen." },
      { stufe: "Analysieren", text: "das Netzdiagramm mehrerer Baustoffe auswerten und Unterschiede in Zug- und Druckfestigkeit, Steifigkeit und Wärmeleitung für die Baustoffwahl herausarbeiten." },
    ],
  },
  sicherheitskonzept: {
    niveau: "B", minuten: 60, vorwissen: ["statistik", "baustatik"],
    ziele: [
      { stufe: "Erinnern", text: "die Teile der Eurocodes 0 bis 9 sowie die Grenzzustände der Tragfähigkeit und der Gebrauchstauglichkeit benennen." },
      { stufe: "Verstehen", text: "das semiprobabilistische Teilsicherheitskonzept mit charakteristischen Werten, Bemessungswerten und der Nachweisbedingung E_d ≤ R_d erläutern." },
      { stufe: "Anwenden", text: "den Bemessungswert der Einwirkungen nach Gl. 6.10 mit γ_G, γ_Q und ψ₀ für Leit- und Begleiteinwirkungen berechnen." },
      { stufe: "Analysieren", text: "entscheiden, ob eine ständige Einwirkung günstig oder ungünstig wirkt, und am Beispiel Windsog den Beiwert γ_G,inf = 1,00 begründen." },
      { stufe: "Bewerten", text: "die Ausnutzung einer Innenstütze aus N_Ed und N_Rd ermitteln und die Grenzen des vereinfachten Lehrbeispiels beurteilen." },
    ],
  },
  regularien: {
    niveau: "B", minuten: 60, vorwissen: [],
    ziele: [
      { stufe: "Erinnern", text: "die sechs Stufen der Regelungshierarchie vom EU-Recht über Bundes-, Landes- und Kommunalrecht bis zu Privatrecht und technischen Regeln benennen." },
      { stufe: "Verstehen", text: "den Unterschied zwischen Bauplanungsrecht (BauGB, BauNVO) für das „Ob“ und „Wo“ und Bauordnungsrecht (LBO) für das „Wie“ eines Vorhabens erläutern." },
      { stufe: "Verstehen", text: "erläutern, wie DIN-Normen als private Regeln durch Einführung als Technische Baubestimmung oder durch Vertrag verbindlich werden." },
      { stufe: "Anwenden", text: "einem Bauprodukt den erforderlichen Verwendbarkeitsnachweis (CE-Kennzeichnung mit Leistungserklärung, abZ/aBG, abP, ZiE/vBG) zuordnen." },
      { stufe: "Analysieren", text: "die Verjährung von Mängelansprüchen nach BGB (5 Jahre) und VOB/B (4 Jahre) gegenüberstellen und die Wirkung einer schriftlichen Mängelrüge einordnen." },
    ],
  },
  analytik: {
    niveau: "B/M", minuten: 75, vorwissen: ["bauchemie", "messen_pruefen"],
    ziele: [
      { stufe: "Verstehen", text: "die Messprinzipien von XRD, FTIR, RFA, ICP-OES, REM/EDX und GC-MS erläutern und angeben, ob sie Phasen, Elemente oder funktionelle Gruppen erfassen." },
      { stufe: "Anwenden", text: "den Portlanditgehalt aus der TGA-Massenstufe bei 400 bis 500 °C mit dem stöchiometrischen Faktor 74,1/18,0 berechnen." },
      { stufe: "Anwenden", text: "mit der Washburn-Gleichung den bei einem Einpressdruck gefüllten Porenradius und mit der Bragg-Gleichung einen Netzebenenabstand berechnen." },
      { stufe: "Analysieren", text: "einen nasschemisch bestimmten Chloridgehalt auf die Zementmasse umrechnen und mit den Höchstwerten der Klassen Cl 0,40 und Cl 0,20 für Neubeton vergleichen." },
      { stufe: "Bewerten", text: "für Sulfatangriff, Schwermetallnachweis, Chloridprofil oder Kunststoffidentifikation ein geeignetes Analyseverfahren auswählen und begründen." },
    ],
  },
  daemmstoffe: {
    niveau: "B", minuten: 45, vorwissen: ["bauphysik"],
    ziele: [
      { stufe: "Verstehen", text: "mineralische, synthetische und nachwachsende Dämmstoffe nach Rohstoff, Wärmeleitfähigkeit, Brandverhalten und Feuchteverhalten unterscheiden." },
      { stufe: "Anwenden", text: "die erforderliche Dämmstoffdicke für einen Ziel-U-Wert nach DIN EN ISO 6946 aus den Widerständen der Bestandswand berechnen." },
      { stufe: "Analysieren", text: "den Einfluss der Wärmeleitfähigkeit auf die Dämmstoffdicke am Vergleich von EPS 035, MW 032 und Holzfaser 040 aufzeigen." },
      { stufe: "Bewerten", text: "für Perimeterdämmung, Brandschutzbarrieren im WDVS, sommerlich belastete Dachräume oder beengte Einbausituationen einen geeigneten Dämmstoff auswählen." },
    ],
  },
  bp_beton: {
    niveau: "B", minuten: 30, vorwissen: ["festbeton_statistik"],
    ziele: [
      { stufe: "Verstehen", text: "Transportbeton und Baustellenbeton nach Herstellung, werkseigener Produktionskontrolle und Aufwand der Qualitätssicherung unterscheiden." },
      { stufe: "Verstehen", text: "die Festlegung von Beton nach DIN EN 206 / DIN 1045-2 über Druckfestigkeits-, Expositions-, Konsistenz- und Chloridklasse sowie Größtkorn erläutern." },
      { stufe: "Analysieren", text: "Beton nach Eigenschaften und Beton nach Zusammensetzung hinsichtlich der Verantwortung für die Rezeptur abgrenzen." },
      { stufe: "Anwenden", text: "die charakteristische Festigkeit einer Prüfserie mit f_ck = f_cm − 1,645 · s berechnen und prüfen, ob eine Festigkeitsklasse erreicht wird." },
    ],
  },
  bp_stahlbauprofile: {
    niveau: "B", minuten: 45, vorwissen: ["stahl", "baustatik"],
    ziele: [
      { stufe: "Verstehen", text: "die Profilreihen IPE, HEA, HEB, HEM und UPN nach Querschnittsform und typischem Einsatz als Träger, Stütze oder Abfangträger unterscheiden." },
      { stufe: "Anwenden", text: "die elastische Randspannung aus Normalkraft und Biegung mit σ_Ed = N_Ed/A ± M_Ed/W_y berechnen und die Querschnittsausnutzung bestimmen." },
      { stufe: "Anwenden", text: "für einen Einfeldträger unter Gleichlast Biegespannung und Mittendurchbiegung mit den Profilwerten aus der Tabelle nachweisen." },
      { stufe: "Analysieren", text: "die Trägheitsmomente verschiedener Profile um die starke und die schwache Achse vergleichen und ihre Bedeutung für Biegung und Knicken ableiten." },
    ],
  },
  beton_a_z: {
    niveau: "B", minuten: 45, vorwissen: ["bindemittel", "frischbeton", "festbeton"],
    ziele: [
      { stufe: "Erinnern", text: "die Ausbreitmaßklassen F1 bis F6 mit typischen Einsatzbereichen sowie Kontrollpunkte für Lieferschein, Einbau und Nachbehandlung benennen." },
      { stufe: "Verstehen", text: "den Einfluss des w/z-Werts auf Kapillarporen, Gefügedichtheit und Dauerhaftigkeit erläutern und die Dichtheitsgrenze bei etwa 0,50 begründen." },
      { stufe: "Anwenden", text: "eine Betonrezeptur über die Stoffraumgleichung auf 1 000 dm³ prüfen und den äquivalenten Wasserzementwert mit dem k-Wert für Flugasche berechnen." },
      { stufe: "Anwenden", text: "das Nennmaß der Betondeckung c_nom = c_min + Δc_dev für eine Expositionsklasse XC oder XD ermitteln." },
    ],
  },
  qualitaetssicherung: {
    niveau: "B", minuten: 75, vorwissen: ["festbeton_statistik", "frischbeton"],
    ziele: [
      { stufe: "Verstehen", text: "Eigenüberwachung, werkseigene Produktionskontrolle und Fremdüberwachung nach DIN 1045-3 mit ihren Aufgaben im Betonbau unterscheiden." },
      { stufe: "Anwenden", text: "die Konformität der Druckfestigkeit bei Erstherstellung, stetiger Herstellung und Identitätsprüfung nach DIN EN 206 / DIN 1045-2 nachweisen." },
      { stufe: "Anwenden", text: "einen Lieferschein bei Ankunft des Fahrmischers prüfen und die Frischbetonprüfungen auf der Baustelle festlegen." },
      { stufe: "Analysieren", text: "für ein Bauteil die Betonbauqualitätsklasse BBQ-N, BBQ-E oder BBQ-S nach DIN 1045-1000 ableiten und die Folgen für Planer, Hersteller und Ausführende darstellen." },
      { stufe: "Bewerten", text: "Mängel wie Zusatzwasser auf der Baustelle oder fehlende Nachbehandlung hinsichtlich ihrer Folgen für Konformität und Dauerhaftigkeit beurteilen." },
    ],
  },
  waermeeigenschaften: {
    niveau: "B", minuten: 45, vorwissen: ["bauphysik"],
    ziele: [
      { stufe: "Verstehen", text: "Wärmeleitfähigkeit, Rohdichte und spezifische Wärmekapazität als Grundgrößen von Wärmespeicherfähigkeit, Temperaturleitfähigkeit und Wärmeeindringfähigkeit erläutern." },
      { stufe: "Anwenden", text: "Wärmespeicherfähigkeit C = ρ · c, Temperaturleitfähigkeit a und Wärmeeindringfähigkeit b eines Baustoffs berechnen." },
      { stufe: "Anwenden", text: "die Kontakttemperatur zwischen Haut und Oberfläche berechnen und damit begründen, warum sich Beton kälter anfühlt als Holz." },
      { stufe: "Anwenden", text: "die erforderliche Dämmdicke für die nachträgliche Außendämmung einer Bestandswand für verschiedene Bemessungswerte λ ermitteln." },
      { stufe: "Bewerten", text: "Dämmstoffe nach Wärmeleitfähigkeit und Wärmespeicherung für den winterlichen und den sommerlichen Wärmeschutz vergleichend beurteilen." },
    ],
  },
  brandschutz: {
    niveau: "B", minuten: 60, vorwissen: ["holz", "bauphysik"],
    ziele: [
      { stufe: "Anwenden", text: "Baustoffklassen nach DIN 4102-1 den Euroklassen A1 bis F nach DIN EN 13501-1 einschließlich der Zusatzklassen s und d zuordnen." },
      { stufe: "Verstehen", text: "die Leistungskriterien R, E und I nach DIN EN 13501-2 erläutern und nationale Bezeichnungen wie F 90 europäischen Klassen wie REI 90 gegenüberstellen." },
      { stufe: "Anwenden", text: "die Brandraumtemperatur nach der Einheitstemperaturzeitkurve für eine gegebene Branddauer berechnen." },
      { stufe: "Anwenden", text: "die effektive Abbrandtiefe und den Restquerschnitt eines dreiseitig beflammten BSH-Balkens nach DIN EN 1995-1-2 berechnen." },
      { stufe: "Bewerten", text: "den Verlust an Widerstandsmoment eines Holzbalkens nach 30 und 60 Minuten Brand beurteilen und begründen, warum der Brandnachweis gesondert zu führen ist." },
    ],
  },
  nachhaltigkeit_daten_regeln: {
    niveau: "B/M", minuten: 90, vorwissen: ["regularien", "oekobilanz_lca"],
    ziele: [
      { stufe: "Erinnern", text: "Kennzahlen des Bauwesens zu energiebedingten CO₂-Emissionen, Rohstoffverbrauch, Bauabfällen und Flächenverbrauch in Deutschland benennen." },
      { stufe: "Verstehen", text: "die Anforderungen der EU-Taxonomie mit wesentlichem Beitrag und DNSH-Prinzip sowie die Stufen der EPBD 2024/1275 bis 2050 erläutern." },
      { stufe: "Anwenden", text: "das Primärenergie-Kriterium der EU-Taxonomie für einen Neubau prüfen und bestimmen, wann ein Bürogebäude nach einem linearen CRREM-Pfad stranded ist." },
      { stufe: "Analysieren", text: "die GWP-Indikatoren einer EPD nach DIN EN 15804+A2 unterscheiden und generische ÖKOBAUDAT-Daten von herstellerspezifischen EPDs abgrenzen." },
      { stufe: "Bewerten", text: "die Instrumente des deutschen Nachhaltigkeits-Baurechts (GModG, QNG, EBV, KrWG, Gebäudetyp E) nach Verbindlichkeit und Wirkung einordnen." },
    ],
  },
  bestand: {
    niveau: "B", minuten: 75, vorwissen: ["bauphysik", "historische_bauweisen"],
    ziele: [
      { stufe: "Verstehen", text: "typische Konstruktionen, Baustoffe und Fenster der Baualtersklassen von der Gründerzeit bis zum GEG-Standard beschreiben und ihnen U-Wert-Größenordnungen zuordnen." },
      { stufe: "Anwenden", text: "den U-Wert eines Bestandsbauteils nach zusätzlicher Dämmung mit U_neu = 1/(1/U_alt + d/λ) berechnen und mit dem Höchstwert nach GModG Anlage 7 vergleichen." },
      { stufe: "Anwenden", text: "die jährliche Einsparung an Transmissionswärme aus U-Wert-Differenz, Fläche und Heizgradtagen sowie die zugehörige CO₂-Minderung berechnen." },
      { stufe: "Analysieren", text: "kapillaraktive und diffusionsdichte Innendämmsysteme nach WTA-Merkblatt 6-5 unterscheiden und Schadensrisiken wie feuchte Holzbalkenköpfe ableiten." },
      { stufe: "Bewerten", text: "eine energetische Sanierungsmaßnahme nach GModG-Konformität, statischer Amortisationszeit und Feuchterisiko beurteilen." },
    ],
  },
  historisch: {
    niveau: "B/M", minuten: 90, vorwissen: ["sicherheitskonzept", "festbeton_statistik", "bestand"],
    ziele: [
      { stufe: "Anwenden", text: "historische Betonklassen wie Bn 250 über die Würfel- in die Zylinderdruckfestigkeit umrechnen und einer heutigen Festigkeitsklasse nach Eurocode 2 zuordnen." },
      { stufe: "Anwenden", text: "aus Bohrkernen, Mauersteinprüfungen und Zugversuchen an Stahlproben Kennwerte nach DIN EN 13791, Eurocode 6 und DIN EN ISO 6892-1 ermitteln." },
      { stufe: "Anwenden", text: "den lognormalen Bemessungswert einer Bestandsfestigkeit aus Mittelwert, Variationskoeffizient, α_R und β berechnen." },
      { stufe: "Analysieren", text: "die konventionelle Neubaubemessung, modifizierte Teilsicherheitsbeiwerte nach DBV-Merkblatt und die versuchsgestützte Bemessung nach EN 1990-2:2026 vergleichen." },
      { stufe: "Bewerten", text: "beurteilen, wann Stichprobenumfang und Streuung eine Tragreserve im Bestand belegen und warum aus einem einzelnen Kern keine Festigkeitsklasse folgt." },
    ],
  },
  abfaelle: {
    niveau: "B/M", minuten: 90, vorwissen: ["rueckbau", "schadstoffe"],
    ziele: [
      { stufe: "Verstehen", text: "die fünfstufige Abfallhierarchie des KrWG sowie Getrennthaltungs- und Nachweispflichten für Bau- und Abbruchabfälle erläutern." },
      { stufe: "Anwenden", text: "Bauabfälle nach AVV Kapitel 17 einem sechsstelligen Abfallschlüssel zuordnen und Spiegeleinträge als gefährlich oder nicht gefährlich einstufen." },
      { stufe: "Analysieren", text: "aus Eluat- und Feststoffwerten die Mindest-Deponieklasse nach DepV Anhang 3 bestimmen und den maßgebenden Parameter herausarbeiten." },
      { stufe: "Anwenden", text: "für den Einbau von RC-3 die Einbaumenge berechnen und die Anzeigepflicht nach § 22 EBV prüfen." },
      { stufe: "Anwenden", text: "den Beprobungsumfang eines Haufwerks nach LAGA PN 98 aus Volumen, Homogenität und Größtkorn festlegen." },
    ],
  },
  schadstoffe: {
    niveau: "B/M", minuten: 90, vorwissen: ["bestand", "rueckbau"],
    ziele: [
      { stufe: "Erinnern", text: "Gebäudeschadstoffe wie Asbest, PAK, PCB, alte KMF, PFAS und Chlorparaffine mit ihren typischen Vorkommen im Bestand benennen." },
      { stufe: "Verstehen", text: "die Informationspflichten des Veranlassers nach § 5a GefStoffV und die Bedeutung des Baujahrs für den Asbestverdacht erläutern." },
      { stufe: "Anwenden", text: "den Kanzerogenitätsindex einer Mineralwolle nach TRGS 521 aus den Oxidanteilen berechnen und die Faser einstufen." },
      { stufe: "Analysieren", text: "eine Asbesttätigkeit über Akzeptanz- und Toleranzkonzentration dem niedrigen, mittleren oder hohen Risiko zuordnen und Schutzmaßnahmen nach dem STOP-Prinzip ableiten." },
      { stufe: "Bewerten", text: "für Putze, Spachtelmassen, Fliesenkleber und Haufwerke ein sachgerechtes Beprobungsvorgehen nach VDI 6202 Blatt 3 und LAGA PN 98 auswählen und begründen." },
    ],
  },
  bauschaeden: {
    niveau: "B", minuten: 75, vorwissen: ["regularien"],
    ziele: [
      { stufe: "Verstehen", text: "den Baumangel als Abweichung der Ist- von der Soll-Beschaffenheit nach § 633 BGB vom Bauschaden als Folge abgrenzen und Gewährleistung von Garantie unterscheiden." },
      { stufe: "Anwenden", text: "das Ende der Verjährungsfrist von Mängelansprüchen nach BGB und VOB/B ab Abnahme einschließlich der Wirkung einer schriftlichen Mängelrüge berechnen." },
      { stufe: "Anwenden", text: "die Mindestbreite einer elastischen Fassadenfuge aus thermischer Längenänderung und zulässiger Gesamtverformung des Dichtstoffs berechnen." },
      { stufe: "Analysieren", text: "Fugenschäden wie Flankenabriss, Kohäsionsbruch, Blasenbildung und Randzonenverschmutzung auf Planungs- oder Verarbeitungsfehler zurückführen." },
      { stufe: "Bewerten", text: "für eine Störung im Bauablauf die passende Anzeige nach VOB/B (Bedenken, Behinderung, Mängelrüge, Nachtrag) auswählen und Form und Adressat begründen." },
    ],
  },
  schadensbilder: {
    niveau: "B", minuten: 75, vorwissen: ["bauschaeden", "bauphysik"],
    ziele: [
      { stufe: "Verstehen", text: "Schadensbilder aus Feuchte und Schimmel, Rissen, Korrosion, stofflichen Unverträglichkeiten sowie Tief- und Ingenieurbau ihren Ursachen zuordnen." },
      { stufe: "Anwenden", text: "die rechnerische Rissbreite w_k einer Stahlbetonwand nach DIN EN 1992-1-1 berechnen und mit dem Grenzwert der Expositionsklasse vergleichen." },
      { stufe: "Anwenden", text: "mit der linear-elastischen Bruchmechanik die Spannungsintensität eines Randrisses und die kritische Risslänge bei sprödem Versagen berechnen." },
      { stufe: "Analysieren", text: "an einem Schadensszenario juristischen Status, verantwortlichen Bauakteur, zuständige Versicherung und Sanierungsmethode herausarbeiten." },
      { stufe: "Bewerten", text: "für Risse und Feuchteschäden geeignete Diagnose- und Instandsetzungsverfahren wie Potenzialfeldmessung, Ultraschall oder Rissinjektion auswählen." },
    ],
  },
  material_schaeden_gross: {
    niveau: "B/M", minuten: 75, vorwissen: ["schadensbilder", "bruchmechanik"],
    ziele: [
      { stufe: "Erinnern", text: "Großschadensfälle wie Bad Reichenhall, Ponte Morandi, Carolabrücke, Silver Bridge und Hyatt Regency mit ihrem kritischen Werkstoffmechanismus benennen." },
      { stufe: "Verstehen", text: "Schadensmechanismen wie die hydrolytische Zersetzung von UF-Leim, Spannungsrisskorrosion, AKR und Sprödbruch werkstoffchemisch erläutern." },
      { stufe: "Anwenden", text: "die kritische Rissgröße eines Stahlbauteils aus Bruchzähigkeit, Nennspannung und Geometriefaktor berechnen." },
      { stufe: "Analysieren", text: "an einem Fall das Zusammenspiel aus Werkstoffdegradation, Fehlplanung, fehlender Redundanz und Prüflücken herausarbeiten." },
      { stufe: "Bewerten", text: "die normativen Konsequenzen eines Großschadens für Planung, Prüfung und Überwachung von Tragwerken beurteilen." },
    ],
  },
  schutz_grundlagen: {
    niveau: "B/M", minuten: 75, vorwissen: ["korrosion", "dauerhaftigkeit"],
    ziele: [
      { stufe: "Erinnern", text: "die elf Instandsetzungsprinzipien nach DIN EN 1504-9 benennen und den Gruppen Betonschäden (1 bis 6) und Bewehrungskorrosion (7 bis 11) zuordnen." },
      { stufe: "Verstehen", text: "passive Barriereschutzmaßnahmen und aktive elektrochemische Verfahren wie KKS, Realkalisierung und Chloridextraktion nach ihrem Wirkprinzip unterscheiden." },
      { stufe: "Anwenden", text: "mit dem Tuutti-Modell die Initiierungszeit t₀ = (c/k)² berechnen und die Kostenfolge verzögerter Instandhaltung mit der Fünferregel nach de Sitter abschätzen." },
      { stufe: "Anwenden", text: "die diffusionsäquivalente Luftschichtdicke s_d,CO₂ einer Beschichtung berechnen und mit dem Mindestwert von 50 m vergleichen." },
      { stufe: "Bewerten", text: "für Karbonatisierung, Chloridbelastung, Durchfeuchtung, Risse oder Verschleiß ein geeignetes Instandsetzungsprinzip und Verfahren auswählen und begründen." },
    ],
  },
  wta: {
    niveau: "B/M", minuten: 75, vorwissen: ["bestand", "feuchteschutz"],
    ziele: [
      { stufe: "Verstehen", text: "die Rolle der WTA-Merkblätter als Beschreibung anerkannter Regeln der Technik für die Bauwerkserhaltung erläutern und ihre Referatsbereiche zuordnen." },
      { stufe: "Verstehen", text: "den Wirkmechanismus von Sanierputzen aus Hydrophobierung, Makroporosität und Verlagerung der Verdunstungszone erläutern." },
      { stufe: "Anwenden", text: "für eine nachträgliche Horizontalsperre nach WTA-Merkblatt 4-10 Bohrlochtiefe, Bohrlochabstand und Injektionsmittelbedarf je laufendem Meter berechnen." },
      { stufe: "Analysieren", text: "aus Durchfeuchtungsgrad und Salzbelastung das geeignete Injektionsverfahren und Sanierputzsystem nach WTA-Merkblatt 2-9 ableiten." },
      { stufe: "Bewerten", text: "Innendämmsysteme aus Calciumsilicat, Holzfaser, Mineralschaum oder PUR mit Dampfsperre bei Restfeuchte, Salzlast und Schlagregen nach WTA 6-5 beurteilen." },
    ],
  },
  materialdatenbanken: {
    niveau: "B/M", minuten: 45, vorwissen: ["oekobilanz_lca"],
    ziele: [
      { stufe: "Erinnern", text: "Materialdatenbanken wie ÖKOBAUDAT, WECOBIS, GESTIS, DGNB Navigator, ecoinvent und EPD-Programmhalter mit ihrem Einsatzzweck benennen." },
      { stufe: "Verstehen", text: "generische und herstellerspezifische Datensätze nach Herkunft, Verifizierung und Einsatz in den Leistungsphasen unterscheiden." },
      { stufe: "Anwenden", text: "das flächenbezogene Treibhauspotenzial eines Bauteils aus Schichtdicke, Rohdichte und massebezogenem GWP-Wert der Module A1 bis A3 berechnen." },
      { stufe: "Analysieren", text: "masse- und volumenbezogene Deklarationen auf eine gemeinsame funktionale Einheit umrechnen und Dämmstoffe bei gleichem Wärmedurchlasswiderstand vergleichen." },
    ],
  },
  labor_sicherheit: {
    niveau: "B", minuten: 30, vorwissen: [],
    ziele: [
      { stufe: "Erinnern", text: "die acht Säulen der Laborsicherheit im Baustofflabor einschließlich Alleinarbeitsverbot und Geräteberechtigung benennen." },
      { stufe: "Verstehen", text: "die Gefährdungen durch Zement mit pH-Werten über 12, krebserzeugenden Quarzfeinstaub und sensibilisierende Reaktionsharze erläutern." },
      { stufe: "Anwenden", text: "für Mischen, Sägen, Prüfen und den Umgang mit Zement, Quarzstaub oder Epoxidharzen die erforderliche Schutzausrüstung auswählen." },
      { stufe: "Anwenden", text: "im Notfall die Sofortmaßnahmen von NOT-HALT über Erste Hilfe und Notruf mit den 5 W-Fragen bis zum Eintrag im Verbandbuch ausführen." },
    ],
  },
  bp_recht_grundlagen: {
    niveau: "B/M", minuten: 45, vorwissen: ["regularien"],
    ziele: [
      { stufe: "Verstehen", text: "das Inverkehrbringen nach BauPVO mit Leistungserklärung und CE-Kennzeichnung von der Verwendbarkeit im Bauwerk nach MBO, LBO und MVV TB abgrenzen." },
      { stufe: "Anwenden", text: "für ein Bauprodukt entscheiden, ob eine CE-Kennzeichnung über hEN oder ETA oder ein nationaler Nachweis (abZ, abP, ZiE/vBG) mit Ü-Zeichen erforderlich ist." },
      { stufe: "Anwenden", text: "aus der Leistungserklärung eines Herstellers die deklarierten Werte entnehmen und mit den Bauwerksanforderungen der MVV TB vergleichen." },
      { stufe: "Analysieren", text: "die Folgen des EuGH-Urteils C-100/13 für die Bauregellisten und den Wechsel zur Regulierung des Bauwerks über die MVV TB herausarbeiten." },
    ],
  },
  bp_recht_avcp: {
    niveau: "B/M", minuten: 30, vorwissen: ["bp_recht_grundlagen"],
    ziele: [
      { stufe: "Erinnern", text: "die AVCP-Systeme 1+, 1, 2+, 3 und 4 sowie das neue System 3+ der BauPVO 2024/3110 mit typischen Bauprodukten benennen." },
      { stufe: "Verstehen", text: "die Aufgabenteilung zwischen werkseigener Produktionskontrolle des Herstellers und Fremdüberwachung durch die notifizierte Stelle erläutern." },
      { stufe: "Analysieren", text: "aus dem AVCP-System eines Produkts den Umfang von Erstprüfung, Erstinspektion, laufender Überwachung und Audit-Testing ableiten." },
    ],
  },
  bp_recht_normen: {
    niveau: "B/M", minuten: 30, vorwissen: ["bp_recht_grundlagen"],
    ziele: [
      { stufe: "Erinnern", text: "die Normungsorganisationen DIN, CEN und ISO mit ihren Aufgaben sowie die Wiener Vereinbarung benennen." },
      { stufe: "Verstehen", text: "den Weg zur Norm vom Projektvorschlag über Entwurf, Stellungnahmeverfahren und Schlichtung bis zum Weißdruck beschreiben." },
      { stufe: "Analysieren", text: "unterscheiden, wann eine DIN-Norm nur die widerlegbare Vermutung der anerkannten Regeln der Technik begründet und wann sie durch Vertrag oder Technische Baubestimmung verbindlich wird." },
    ],
  },
  holzbau_werkstoffe: {
    niveau: "B", minuten: 45, vorwissen: ["holz", "holzwerkstoffe"],
    ziele: [
      { stufe: "Verstehen", text: "die charakteristischen Festigkeits- und Steifigkeitswerte von Vollholz nach DIN EN 338 und Brettschichtholz nach DIN EN 14080 vergleichen und ihre Verwendung in der Bemessung erläutern." },
      { stufe: "Verstehen", text: "das Schwind- und Quellverhalten von Holz unterhalb des Fasersättigungspunkts und seine Anisotropie in radialer, tangentialer und longitudinaler Richtung erläutern." },
      { stufe: "Anwenden", text: "die Maßänderung eines Holzquerschnitts aus Holzart, Feuchteänderung und Jahrringlage berechnen." },
      { stufe: "Analysieren", text: "Wand-, Decken- und Dachaufbauten im Holzbau nach Schichtenfolge, U-Wert, Brandschutzklasse und Schallschutz vergleichen." },
    ],
  },
  ki_recht_ethik: {
    niveau: "B/M", minuten: 60, vorwissen: ["ki_ueberblick"],
    ziele: [
      { stufe: "Analysieren", text: "typische KI-Fehler wie erfundene Teilsicherheitsbeiwerte, Einheitenfehler, veraltete Normzitate und überlesene Gutachtenpassagen an Beispielen erkennen und richtigstellen." },
      { stufe: "Verstehen", text: "erläutern, warum der Planer nach BGB-Werkvertragsrecht für KI-gestützte Ergebnisse haftet und sich nicht durch Software entlasten kann." },
      { stufe: "Verstehen", text: "den risikobasierten Ansatz des EU AI Act mit Hochrisiko-Systemen, Transparenzpflichten nach Art. 50 und menschlicher Aufsicht nach Art. 14 erläutern." },
      { stufe: "Anwenden", text: "vor dem Einsatz von Cloud-LLMs Maßnahmen zu Datenschutz und Geschäftsgeheimnis wie Anonymisierung, Training-Opt-out und Auftragsverarbeitungsvertrag festlegen." },
      { stufe: "Bewerten", text: "den Energiebedarf von KI-Anfragen gegen Einsparungen durch KI-Baustoffoptimierung abwägen und den normativen Bias der Modelle beurteilen." },
    ],
  },
  ki_ressourcen: {
    niveau: "B/M", minuten: 30, vorwissen: ["ki_ueberblick"],
    ziele: [
      { stufe: "Erinnern", text: "unabhängige KI-Plattformen und Verzeichnisse wie GitHub, Hugging Face, Futurepedia und THE DECODER mit ihrem Nutzen für das Bauwesen benennen." },
      { stufe: "Anwenden", text: "das 95-%-Unsicherheitsintervall eines Benchmark-Ergebnisses berechnen und prüfen, ob der Unterschied zwischen zwei Modellen belastbar ist." },
      { stufe: "Anwenden", text: "Strombedarf, CO₂-Emissionen und Kosten einer lokalen KI-Auswertung aus Leistung, Rechenzeit, Emissionsfaktor und Strompreis berechnen." },
      { stufe: "Bewerten", text: "Ranglisten unabhängiger KI-Seiten als Momentaufnahmen beurteilen und für eine Studienaufgabe ein geeignetes Werkzeug begründet auswählen." },
    ],
  },
  px_planung: {
    niveau: "B", minuten: 45, vorwissen: ["expositionsklassen", "regularien"],
    ziele: [
      { stufe: "Analysieren", text: "Tragwerks- und Architekturplanung an den HOAI-Schnittstellen der Leistungsphasen 3, 5 und 6 auf Kollisionen bei Durchbrüchen, Schächten und Stützen prüfen." },
      { stufe: "Anwenden", text: "Expositionsklassen, Nachbehandlungsklassen und Wassereinwirkungsklasse nach DIN 18533 im Leistungsverzeichnis eindeutig festlegen." },
      { stufe: "Anwenden", text: "das Nennmaß der Betondeckung c_nom für ein Außenbauteil der Expositionsklasse XC4 berechnen." },
      { stufe: "Analysieren", text: "Unverträglichkeiten wie lösemittelhaltigen Bitumenvoranstrich auf XPS oder verzinkten Stahl an Eichenholz im LV erkennen und durch Vorgaben ausschließen." },
      { stufe: "Bewerten", text: "die Gleichwertigkeit eines Alternativprodukts zum Leitprodukt nach VOB/A an funktionalen Leistungsmerkmalen wie dem Wärmedurchlasswiderstand beurteilen." },
    ],
  },
};
