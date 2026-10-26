import React, { useState, useMemo } from 'react';
import { 
  Award, 
  HelpCircle, 
  CheckCircle, 
  Users, 
  ArrowRight, 
  GraduationCap, 
  Check, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  Zap,
  Hammer
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

// Types representing specialized certifications
type CertificateID = 
  | 'eschein' 
  | 'sivv' 
  | 'skp' 
  | 'kks' 
  | 'duesenfuehrer' 
  | 'trgs519' 
  | 'trgs524' 
  | 'trgs521'
  | 'sfi'
  | 'wood_protection'
  | 'masonry_restoration'
  | 'mold_remediation'
  | 'heritage_energy'
  | 'sigeko'
  | 'crack_injection'
  | 'thermography'
  | 'waterproofing'
  | 'drone_inspection'
  | 'building_damage_expert';

interface Certificate {
  id: CertificateID;
  title: string;
  abbreviation: string;
  authority: string;
  scope: string; // Brief visual summary
  legalBase: string;
  targetGroup: string;
  duration: string;
  validity: string;
  difficulty: 'Hoch' | 'Mittel' | 'Sehr Hoch';
  prerequisites: string[];
  modules: string[];
  relevance: string;
  category: 'beton' | 'schadstoffe' | 'denkmal' | 'bauphysik' | 'baubetrieb';
}

const categories = [
  { id: 'all', name: 'Alle Bereiche' },
  { id: 'beton', name: 'Betontechnologie' },
  { id: 'schadstoffe', name: 'Schadstoffe & Umwelt' },
  { id: 'denkmal', name: 'Baubestand & Denkmal' },
  { id: 'bauphysik', name: 'Bauphysik & Diagnostik' },
  { id: 'baubetrieb', name: 'Baubetrieb & Sicherheit' },
] as const;

export default function Fortbildungen() {
  const [activeCertId, setActiveCertId] = useState<CertificateID>('eschein');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Path finder states
  const [userBackground, setUserBackground] = useState<string>('');
  const [userGoal, setUserGoal] = useState<string>('');

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const filtered = Object.values(certs).filter(
      (c) => catId === 'all' || c.category === catId
    );
    if (filtered.length > 0) {
      setActiveCertId(filtered[0].id);
    }
  };

  const certs: Record<CertificateID, Certificate> = {
    eschein: {
      id: 'eschein',
      title: 'Erweiterte technologische Ausbildung im Betonbau',
      abbreviation: 'E-Schein (Betontechnologe)',
      authority: 'Deutscher Beton- und Bautechnik-Verein e.V. (DBV)',
      scope: 'Nachweis fortgeschrittener betontechnologischer Fachkenntnis für die Herstellung, Überwachung und den Einbau von Beton.',
      legalBase: 'DIN 1045-3:2023-08 (Leitung der ständigen Betonprüfstelle bei Überwachungsklasse 2 und 3); Ausbildungsbeirat beim DBV.',
      targetGroup: 'Architekten, Planer, Bauingenieure, Bauleiter, Techniker, Betonwerksmeister, Betonlaborleiter.',
      duration: 'Mehrwöchiger Lehrgang mit schriftlicher und mündlicher Prüfung (Umfang beim jeweiligen Bildungsträger prüfen).',
      validity: 'Regelungen zu Gültigkeit und Fortbildung beim Ausbildungsbeirat prüfen.',
      difficulty: 'Hoch',
      prerequisites: [
        'Bauingenieur-/Architekturstudium (Diplom, B.Sc., M.Sc.)',
        'Oder Ausbildung als staatlich geprüfter Techniker im Bauwesen',
        'Oder Bauhandwerksmeister (z. B. Maurer-/Betonbauer-Meister) mit einschlägiger Berufserfahrung',
        'Nachweis über grundlegende betontechnologische Kenntnisse vor Lehrgangsbeginn'
      ],
      modules: [
        'Zement, Gesteinskörnungen, Betonzusatzstoffe und Betonzusatzmittel',
        'Anforderungen an Frisch- und Festbeton, Einteilung der Expositionsklassen (z. B. Carbonatisierung, Frost-Tau, Chloride)',
        'Betonmischungsberechnung nach neuesten DBV-Richtlinien',
        'Besondere Betonprüfverfahren (z. B. Konsistenzprüfung, Luftporengehalt, Würfeldruckfestigkeit)',
        'Herstellen von Beton auf Baustellen und in Transportbetonwerken',
        'Sonderbetone (z. B. Leichtbeton, Schwerbeton, Sichtbeton, SVB/SCC, Faserbeton, Massenbeton)',
        'Konstruktionsregeln für schwind- und temperaturrissminimierte Tragwerke'
      ],
      relevance: 'Auf Baustellen mit anspruchsvollen Bauteilen (z. B. Brücken, hohe Hochbauten mit Festigkeiten ≥ C30/37 oder wasserundurchlässigen Bauteilen, WU-Beton) is ein E-Schein-Inhaber als sachkundige Person zur Überwachung vorgeschrieben. Ohne ihn greifen Baustopps durch die Bauaufsicht.',
      category: 'beton'
    },
    sivv: {
      id: 'sivv',
      title: 'Schützen, Instandsetzen, Verbinden und Verstärken von Betonbauteilen',
      abbreviation: 'SIVV-Schein (Kolonne / Fachkraft)',
      authority: 'Ausbildungsbeirat Sachkundige Planer und SIVV-Fachpersonal beim DBV',
      scope: 'Nachweis der praktischen und theoretischen Sachkunde für bauausführende Handwerker bei der Betoninstandhaltung.',
      legalBase: 'Instandhaltungs-Richtlinie des DAfStb bzw. neue TR Instandhaltung (DIBt), ZTV-ING, VOB/C DIN 18349.',
      targetGroup: 'Vorarbeiter, Poliere, Kolonnenführer, anwendende Facharbeiter auf Instandsetzungsbaustellen.',
      duration: 'Lehrgang mit theoretischer und praktischer Prüfung nach Prüfungsordnung des Ausbildungsbeirats (Fassung Juli 2022); Umfang beim Ausbildungszentrum prüfen.',
      validity: 'Regelungen zu Gültigkeit und Auffrischung beim Ausbildungsbeirat Schutz und Instandsetzung im Betonbau (DBV) prüfen.',
      difficulty: 'Mittel',
      prerequisites: [
        'Erfolgreich abgeschlossene gewerblich-technische Berufsausbildung im Bauwesen (z.B. Maurer, Betonbauer, Gipser, Maler)',
        'Mindestens 3 Jahre Berufspraxis in der Bauausführung',
        'Ausnahmegenehmigung für Quereinsteiger mit extrem langjähriger, nachgewiesener Betonsanierungspraxis möglich'
      ],
      modules: [
        'Grundlagen des Korrosionsschutzes von Bewehrungsstählen (Alkalität des Passivraums)',
        'Untergrundvorbereitung (Hochdruckwasserstrahlen ≥ 1200 bar, Sandstrahlen, Stemmen)',
        'Verbindungstechniken: Verpressen und Verfugen mit mineralischen und epoxidgefüllten Bindemitteln rissüberbrückend',
        'Korrosionsbeschichtung und Haftbrückenmörtel',
        'Instandsetzungsmörtel in Handapplikation (PCC / RM) und Spritzbetonapplikation (SPCC)',
        'Verarbeitung und Aufbringen von Oberflächenschutzsystemen (OS 1 bis OS 11)',
        'Faserverstärkte Kunststofflamellen (CFK-Lamellen) zur externen Tragstärkung ankleben'
      ],
      relevance: 'Qualitätssicherung bei der Betoninstandsetzung. Fast alle öffentlichen (z.B. Brücken nach ZTV-ING) und privaten Ausschreibungen (z.B. Parkhausdecken) fordern pro Kolonne mindestens einen handwerklich aktiven Eigner des gültigen SIVV-Scheins.',
      category: 'beton'
    },
    skp: {
      id: 'skp',
      title: 'Sachkundiger Planer für Schutz und Instandsetzung von Betonbauteilen',
      abbreviation: 'Sachkundiger Planer (SKP) / QP',
      authority: 'Ausbildungsbeirat Sachkundige Planer beim DBV',
      scope: 'Höchste planerische Zertifizierungsstufe für Ingenieure zur herstellerneutralen Diagnose und Instandsetzung von Betonbauwerken.',
      legalBase: 'TR Instandhaltung des Deutschen Instituts für Bautechnik (DIBt) und DAfStb-Instandsetzungsrichtlinie.',
      targetGroup: 'Freischaffende und angestellte Tragwerksplaner, Bauingenieure, Werkstoffprüfer, erfahrene Bauzustand-Gutachter.',
      duration: 'Ausbildungslehrgang in mehreren zeitlichen Blöcken (ca. 100-120 Stunden) plus komplexe Projektarbeit und mündliche Kolloquiums-Prüfung.',
      validity: 'Unbefristet, wobei Fortbildungspflichten der Ingenieurkammern der Länder für eingetragene Listen zwingend greifen.',
      difficulty: 'Sehr Hoch',
      prerequisites: [
        'Abschluss eines Studiums des Bauingenieurwesens (Universität / Fachhochschule)',
        'Mindestens 3 Jahre nachgewiesene praktische Berufserfahrung in der Planung oder Ausführung von Bauwerkssanierungen',
        'E-Schein oder vertiefte Vorkenntnisse sind hochgradig empfohlen, um dem dichten Lehrplan folgen zu können'
      ],
      modules: [
        'Zustandserfassung und Schadensursachen-Eingrenzung (Karbonatisierungstiefe, Chloridprofile, elektrische Leitfähigkeit)',
        'Zerstörungsfreie Diagnoseverfahren (z. B. Potenzialfeldmessung zur Ortung anodischer Korrosionsherde)',
        'Erstellen von herstellerneutralen Sanierungskonzepten basierend auf den Prinzipien W, C, K, M, B nach DAfStb',
        'Tragfähigkeitsprüfung korrodierter Bauteile (Rückverankerung, Querschnittsverluste)',
        'Nachträgliche Verstärkungskonzepte (CFK, Vergussmörtelschalen, Einzelfundamentverbreiterung)',
        'Auswahl geeigneter Baustoffe (Zementmörtel, Epoxidharze, Kathodischer Korrosionsschutz)',
        'Rechtliche Verantwortung und Haftung des Planers bei Fehldiagnosen'
      ],
      relevance: 'Die Richtlinien fordern, dass jede Sanierung eines statisch relevanten Betontragwerks von einem zertifizierten Sachkundigen Planer (SKP) entworfen, begleitet und abgenommen wird. Ein genereller Tragwerksplaner (Statiker) darf dies ohne diesen Spezialschein rechtlich nicht ausschreiben.',
      category: 'beton'
    },
    kks: {
      id: 'kks',
      title: 'Kathodischer Korrosionsschutz im Betonbau nach ISO 15257',
      abbreviation: 'KKS-Fachkraft (Sektor Beton)',
      authority: 'FKKS (Fachverband Kathodischer Korrosionsschutz e.V.) / DIN CERTCO',
      scope: 'Spezialausbildung zur Planung, Errichtung und Überwachung elektrochemischer Korrosionsschutzsysteme an Stahlbetonbauwerken.',
      legalBase: 'DIN EN ISO 15257 (Anforderungsprofil an KKS-Personal), DIN EN ISO 12696 (KKS im Beton).',
      targetGroup: 'Elektrochemiker, Werkstoffwissenschaftler, Bauingenieure im Bereich Dauerhaftigkeit, Fachplaner für Parkhaus-Instandsetzung.',
      duration: 'Gestuft nach Kompetenzstufen der DIN EN ISO 15257; je Stufe Lehrgang mit Prüfung (Umfang beim Zertifizierer prüfen).',
      validity: 'Befristet; Rezertifizierung nach den Regeln des Zertifizierers.',
      difficulty: 'Sehr Hoch',
      prerequisites: [
        'Ingenieurtechnische Ausbildung oder elektrotechnische Meisterausbildung',
        'Langjährige praktische Mitarbeit bei KKS-Messungen (Referenznachweise vorzulegen)',
        'Bestandenes Level-Zertifikat des jeweils untergeordneten Levels'
      ],
      modules: [
        'Physikalisch-chemische und elektrochemische Grundlagen des Korrosionsschutzes',
        'Messung und Auswertung von halbelektrischen Potenzialen und Depolarisationsraten',
        'Systeme: Fremdstromanoden (z. B. platinierter Titandraht, Titan-Anodennetze) und galvanische Opferanoden (Zink)',
        'Auslegung von Transformator- und Gleichrichtersteuerungen für feuchte Umgebungen',
        'Störspannungen und vagabundierende Ströme (Interferenz)',
        'Installation, Inbetriebnahme, messtechnische Fernkontrolle (Datenlogger) und Wartung'
      ],
      relevance: 'KKS is bei chloridbelasteten Brücken und Parkhäusern oft die einzige physikalische Methode, die Bewehrung ohne massiven, teuren Betonabtrag wirksam zu retten. Nur zertifizierte Personen nach Level 2 (Instandhaltungspfleger) und Level 3 (KKS-Planer) dürfen diese hochsensiblen Steuerstromsysteme einregulieren.',
      category: 'beton'
    },
    duesenfuehrer: {
      id: 'duesenfuehrer',
      title: 'Zertifikat für Spritzbeton-Düsenführer (Düsenführerschein)',
      abbreviation: 'Spritzbeton-Schein (Düsenführer)',
      authority: 'Deutscher Beton- und Bautechnik-Verein e.V. (DBV)',
      scope: 'Qualifikationsnachweis für das manuelle und rechnergestützte Aufspritzen von Spritzbeton im Tunnelbau und bei Sanierungen.',
      legalBase: 'DIN 18551 (Spritzbeton), Nationaler Anhang zur DIN EN 14487.',
      targetGroup: 'Bauhandwerker, Tunnelbauer, Spezialtiefbauer, Kolonnenarbeiter im Brückensanierungsbereich.',
      duration: '5 Tage Kompaktkurs, theoretischer Unterricht gefolgt von intensiven Spritzprüfungen (Überkopf-Spritzkiste).',
      validity: 'Unbefristet, wobei Arbeitsschutz-Unterweisungen jährlich aufgefrischt werden müssen.',
      difficulty: 'Mittel',
      prerequisites: [
        'Absolvierte Gesellenprüfung im Bauhauptgewerbe',
        'Mindestens 1 Jahr nachgewiesene praktische Mitarbeit in einer Spritzbetonkolonne (Nachweis über Baustellenreferenzen)'
      ],
      modules: [
        'Maschinentechnik der Förderung (Trocken- und Nassspritzverfahren)',
        'Strömungsmechanik der Förderleitung und Auswahl geeigneter Spritzdüsen',
        'Einflussfaktoren des Rückpralls (Rebound-Verlust minimieren)',
        'Richtiges Auftragen in Schichten zur Vermeidung von Trennlagen und Lufttaschen hinter der Bewehrung',
        'Arbeitsschutz, Atemschutz, Entstaubung, Handhabung alkalischer Erstarrungsbeschleuniger',
        'Sonderspritzbetone (z. B. stahlfaserverstärkter Spritzbeton zur Hangsicherung)'
      ],
      relevance: 'Qualitativ unzureichend gespritzter Beton neigt zu massiver Hohlraumbildung hinter den Stahlstäben. Das DBV-Düsenführerzertifikat sichert ab, dass der Spritzbeton hohlraumfrei und haftungsverstärkt verdichtet aufgetragen wird. Für Traggerüste und Tunnelschalen gesetzlich ausnahmslos gefordert.',
      category: 'beton'
    },
    trgs519: {
      id: 'trgs519',
      title: 'Sachkundenachweis für Asbest-Abbruch, Sanierungs- und Instandhaltungsarbeiten',
      abbreviation: 'TRGS 519 (Asbest-Schein)',
      authority: 'Staatliches Gewerbeaufsichtsamt / Bezirksregierung (durch Lehrgangsträger)',
      scope: 'Gesetzlich vorgeschriebene Sachkunde zum Umgang mit asbesthaltigen Baustoffen beim Bauen im Bestand.',
      legalBase: 'Gefahrstoffverordnung (GefStoffV), Technische Regel für Gefahrstoffe TRGS 519 (Anlage 3 o. 4).',
      targetGroup: 'Objektplaner, Baustoffprüfer, Denkmalschützer, Sanierungsunternehmer, Bauleiter, Abbruchpoliere.',
      duration: 'Mehrtägiger behördlich anerkannter Lehrgang nach TRGS 519 Anlage 3 (große Sachkunde) bzw. Anlage 4 (kleine Sachkunde) mit Prüfung.',
      validity: '6 Jahre. Muss vor Ablauf dieser Frist durch einen behördlich anerkannten Fortbildungslehrgang um weitere 6 Jahre verlängert werden.',
      difficulty: 'Mittel',
      prerequisites: [
        'Keine akademischen Voraussetzungen. Mindestalter 18 Jahre',
        'Für die tatsächliche Ausführung ist ein Nachweis der persönlichen Atemschutztauglichkeit (Arbeitsmedizinischer Check G26) obligatorisch'
      ],
      modules: [
        'Eigenschaften von Asbestsorten (Chrysotil, Amphibolasbest) und gesundheitliche Akutrisiken (Asbestose, Mesotheliome)',
        'Gesetzliche Vorgaben, Anzeige- und Meldepflichten bei den Aufsichtsbehörden',
        'Messtechnische Raumluftüberwachung vor und nach der Sanierung',
        'Schutzmaßnahmen bei Arbeiten an schwach gebundenem Asbest (z. B. Spritzasbest) vs. fest gebundenem Asbest (Asbestzement)',
        'Errichtung von Unterdruckbereichen (Schleusensysteme, 3- und 5-Kammersysteme) und Absauganlagen',
        'Entsorgung asbesthaltiger Sonderabfälle'
      ],
      relevance: 'Beim Bauen im Altbestand (Gebäude vor Bj. 1995) stößt man fast immer auf verdeckten Asbest (z.B. in Fliesenklebern, Spachtelmassen, Dichtungsschnüren). Jeder, der diese Arbeiten leitet, ausschreibt oder bauüberwacht, begibt sich ohne diesen Schein in die akute strafrechtliche Haftung nach StGB § 324a (Boden- und Luftverunreinigung).',
      category: 'schadstoffe'
    },
    trgs524: {
      id: 'trgs524',
      title: 'Sicherheit und Gesundheitsschutz bei der Arbeit in kontaminierten Bereichen',
      abbreviation: 'TRGS 524 / DGUV Regel 101-004 (Altlasten)',
      authority: 'Berufsgenossenschaften (BG Bau) / Staatlich anerkannte Prüfungsinstitute',
      scope: 'Sachkundenachweis für Bauleiter, Planer und Gutachter bei der Erkundung, Sanierung und Beprobung von kontaminierten Liegenschaften, Deponien und Altlasten-Untergründen.',
      legalBase: 'TRGS 524 (Technische Regel kontaminierte Bereiche), DGUV Regel 101-004 (früher BGR 128) für Arbeiten im Erdreich.',
      targetGroup: 'SiGeKo (Sicherheits- und Gesundheitsschutzkoordinatoren), Geologen, Bodengutachter, Rückbauplaner.',
      duration: '2 bis 5 Tage (je nach Modulausprägung Aufbau 6A/6B), Abschlussprüfung.',
      validity: 'Unbefristet (regelmäßige betriebliche Nachprüfung empfohlen).',
      difficulty: 'Mittel',
      prerequisites: [
        'Erfahrung im Erdbau oder in der Altlastensanierung vorteilhaft',
        'Fachkenntnisse im Arbeitsschutz (z.B. Sicherheitskoordinator-Ausbildung)'
      ],
      modules: [
        'Gefahrstoffanalyse kontaminierter Standorte (z.B. PAK, LCKW, Schwermetalle, Dioxine)',
        'Erstellung von detaillierten Arbeits- und Sicherheitsplänen (A+S-Pläne)',
        'Messtechnische Gasdetektion im Arbeitsbereich (PID-Messgeräte, Gasprüfröhrchen)',
        'Festlegung der Schwarz-Weiß-Bereiche auf Großbaustellen',
        'Gefahrenprävention bezüglich Brand- und Explosionsrisiken bei Deponie-Rückbauarbeiten',
        'Umweltschonender Umgang mit kontaminiertem Grundwasser und Sickerleitungskonzepten'
      ],
      relevance: 'Dieser Schein ist unabdingbar für Bauingenieure im Erdbau und in der Baugrundsondierung. Tauchen beim Aushub Kampfmittel, Teeröle oder kontaminierte Haldenstoffe op, muss der Bauleiter die Arbeiten sichern - dies darf rechtlich nur eine nach TRGS 524 sachkondige Person tun.',
      category: 'schadstoffe'
    },
    trgs521: {
      id: 'trgs521',
      title: 'Abbruch-, Sanierungs- und Instandhaltungsarbeiten mit künstlichen Mineralfasern',
      abbreviation: 'TRGS 521 (KMF-Schein)',
      authority: 'Berufsgenossenschaften und staatlich anerkannte Institutionen',
      scope: 'Regelt Schutzmaßnahmen und arbeitsmedizinische Richtlinien beim Umgang mit krebserzeugender alter Mineralwolle (Glas- und Steinwolle).',
      legalBase: 'TRGS 521 (Mineralfasern), Gefahrstoffverordnung (GefStoffV).',
      targetGroup: 'Bauleiter, Architekten, Energieberater, Trockenbaubetriebe, Entsorgungsbeauftragte, Zimmerer.',
      duration: '1 Tag Kompaktlehrgang inklusive schriftlicher Sachkundeprüfung.',
      validity: 'Unbefristet (Auffrischungen bezüglich Gefahrstoffverordnung und PSA werden im 5-Jahres-Turnus angeraten).',
      difficulty: 'Mittel',
      prerequisites: [
        'Mindestalter 18 Jahre',
        'Eignungsnachweis für Atemschutzgeräte (G26-Zertifikat für Maskenträger)'
      ],
      modules: [
        'Faserklassifizierung: Alte krebserzeugende Wolle (KI-Wert < 40) vs. neue gesundheitlich unbedenkliche Bioloswolle',
        'Staubarme Demontagetechniken: Befeuchten mit Entstaubungsmitteln, Schneiden statt Reiß-Aktivität',
        'Erforderliche persönliche Schutzausrüstung (PSA): Partikelfiltrierende Halbmaske FFP2/FFP3, Einwegschutzanzüge Typ 5/6',
        'Sackverpackung vor Transport sowie die exklusive Deklarations- und Ablagerungspflicht auf Deponien',
        'Einrichten staubarmer Sanierungsbereiche und Trennungen zum Wohnraum'
      ],
      relevance: 'Alte gesundheitlich bedenkliche Mineralfasern sind in Gebäuden vor Bj. 2000 flächendeckend verbaut. Wer deren Abbruch leitet oder ausschreibt, muss zwingend über Fachkunde nach TRGS 521 verfügen, um Baustellenstilllegungen durch das Gewerbeaufsichtsamt abzuwenden.',
      category: 'schadstoffe'
    },
    sfi: {
      id: 'sfi',
      title: 'Schweißfachingenieur (International Welding Engineer)',
      abbreviation: 'SFI / IWE (Schweißaufsicht)',
      authority: 'DVS (Deutscher Verband für Schweißen) / International Institute of Welding (IIW)',
      scope: 'Weltweit anerkanntes Spitzenzertifikat zur Schweißaufsicht über geschweißte Stahlbauten und Brücken.',
      legalBase: 'DIN EN ISO 14731 (Schweißaufsicht - Aufgaben und Verantwortung), Bauprodukt-Herstellungsnorm DIN EN 1090 (Ausführungsklassen EXC 1 bis EXC 4).',
      targetGroup: 'Tragwerksplaner im Metall- und Stahlbau, Brückenbau-Überwachungsorgane, Werksproduktionsleiter.',
      duration: 'Sehr umfangreich: 3 Module (SFI 1 - Grundlagen, SFI 2 - Praxis, SFI 3 - Vertiefung), ca. 440 Stunden Gesamtunterricht, mehrere anspruchsvolle Fachprüfungen.',
      validity: 'Unbefristet. Kontinuierliche Weiterbildung muss nach ISO 14731 nachweisbar sein.',
      difficulty: 'Sehr Hoch',
      prerequisites: [
        'Abgeschlossenes anerkanntes Ingenieurstudium (FH, Universität oder technische Hochschule, Fachrichtung Maschinenbau, Bauingenieurwesen o. ä.)',
        'Zulassungsprüfung bei der anerkannter DVS-SLV Bildungseinrichtung'
      ],
      modules: [
        'Schweißverfahren und deren Physik (Lichtbogenschweißen, MIG/MAG, TIG, Laser, Unterpulverschweißen)',
        'Werkstoffe und ihr metallurgisches Verhalten (Gefügestrukturen, Heißrissempfindlichkeit, Vorwärmtemperaturen für hochfeste Stähle)',
        'Konstruktion und Berechnung geschweißter Verbindungen im Hoch-, Kran- und Brückenbau',
        'Werkstoffprüfung des Schmelzbads (Röntgenprüfung, Farbeindringverfahren, Ultraschalldiagnostik von Schweißnähten)',
        'Auslegung und Qualitätskontrolle im Rahmen der DIN EN 1090 (Werkseigene Produktionskontrolle - WPK)'
      ],
      relevance: 'Verantwortlicher Ingenieur im Sinne der EN 1090. Bei großen Tragsystemen im Hoch- und Brückenbau (Überwachungsklassen EXC 3 und 4) darf ohne die Freigabe und Werksüberwachung eines qualifizierten Schweißfachingenieurs (SFI) keine tragende Naht geschweißt oder zugewiesen werden.',
      category: 'baubetrieb'
    },
    wood_protection: {
      id: 'wood_protection',
      title: 'Sachkundiger für Holzschutz am Bau (Bekämpfender Holzschutz)',
      abbreviation: 'Sachkundenachweis Holzschutz (DIN 68800-4)',
      authority: 'Deutscher Holz- und Bautenschutzverband e.V. (DHBV) / WTA',
      scope: 'Spezialisierter Nachweis zur fachgerechten Untersuchung, statischen Schadensanalyse und Bekämpfung pilz- und insektenbedingter Holzschäden im Altbau.',
      legalBase: 'DIN 68800-4 (Vorbeugende und bekämpfende Maßnahmen gegen holzzerstörende Pilze und Insekten am Bau), WTA-Merkblätter.',
      targetGroup: 'Denkmalpfleger, Architekten, Gutachter, Bauingenieure im Sanierungsbereich, Zimmerermeister.',
      duration: 'Ca. 80 Unterrichtsstunden zzgl. umfangreicher schriftlicher und mündlicher Sachkundeprüfung vor dem Fachprüfungsausschuss.',
      validity: 'Lebenslang gültig, wobei regelmäßige Aktualisierungsseminare zur DIN 68800 und Gefahrstoffverordnung gefordert werden.',
      difficulty: 'Hoch',
      prerequisites: [
        'Kandidat aus dem Bauhauptgewerbe (z. B. Zimmerer, Bautenschützer) oder ein einschlägiges Architektur-/Bauingenieurstudium',
        'Mindestens 3 Jahre Berufserfahrung im Holz- und Bautenschutz'
      ],
      modules: [
        'Biologische Bestimmung holzzerstörender Pilze (Echter Hausschwamm, Brauner Kellerschwamm, Porenschwämme)',
        'Erkennung und Differenzierung von Insektenfrass (Hausbockkäfer, Gewöhnlicher Nagekäfer, Buntkäfer)',
        'Mechanische, thermische (Heißluftverfahren) und chemische Bekämpfungstechniken im Baubestand',
        'Sanierung von hausschwammbefallenem Mauerwerk (Abflammen, Bohrlochinjektion mit Schwammsperrmitteln)',
        'Untersuchungsmethoden, Schadenskartierung und Beurteilung der statischen Resttragfähigkeit von Alt-Dachstühlen',
        'Gefahrstoffverordnung, gesetzliche Anwendungsbeschränkungen für chemische Biozide und Holzschutzmittel'
      ],
      relevance: 'Der Schein ist rechtlich zwingend erforderlich, um Hausschwammsanierungen oder chemische Holzbekämpfungen auszuschreiben oder den Einsatz baurechtlich freizugeben. Ohne Sachkundenachweis droht dem Bauunternehmen vollständiger Haftungsausschluss bei Folgeschäden.',
      category: 'denkmal'
    },
    masonry_restoration: {
      id: 'masonry_restoration',
      title: 'Zertifizierter Fachplaner für Bauwerkserhaltung & Mauerwerksinstandsetzung',
      abbreviation: 'Fachplaner Mauerwerk (WTA)',
      authority: 'WTA e.V. (Wissenschaftlich-Technische Arbeitsgemeinschaft für Bauwerkserhaltung)',
      scope: 'Höchste herstellerneutrale Weiterbildung im Altbaubereich für ingenieurtechnische Mauerwerksdiagnostik und Sanierungsentwürfe.',
      legalBase: 'WTA-Merkblätter (Referat Mauerwerk), DIN EN 1996 mit NA (Mauerwerksbemessung).',
      targetGroup: 'Tragwerksplaner, Gutachter für Bauwerksschäden, Restauratoren im Handwerk, Denkmalschutz-Ingenieure.',
      duration: 'Modulares Aufbaustudium (ca. 45-60 Stunden) mit Projektarbeit und Fachkolloquium beim Wissenschaftsausschuss.',
      validity: 'Gültigkeit und Fortbildungspflichten nach den Zertifizierungsregeln der WTA.',
      difficulty: 'Hoch',
      prerequisites: [
        'Studienabschluss im Bauingenieurwesen, Bauphysik oder der Architektur',
        'Oder anerkannter Restaurator im Handwerk mit mindestens 4 Jahren Berufserfahrung in der Denkmalsanierung'
      ],
      modules: [
        'Grundlagen der bauphysikalischen Feuchtigkeitsmessung (Darr-Verfahren, CM-Methode, hydrische Ausdehnungsanalysen)',
        'Untersuchung von schädlichen Salzanreicherungen (Nitrate, Sulfate, Chloride) und deren Kristallisationsdrücke im Gefüge',
        'Mauerwerkstrockenlegung: Mechanische Horizontalsperren, druckbehaftete Injektionsverfahren (Paraffine, Silikonmikroemulsionen)',
        'Sanierung von statischen Mauerwerksrissen (Nachträgliches Verpressen, kraftschlüssiges Vernadeln mit Spiralankern)',
        'Historische Bindemittel und Mörtelrezepturen (Trass-Kalkmischungen vs. Zementsysteme) bei Denkmalen',
        'Sanierputz-Systeme nach WTA-Merkblatt 2-9 zur schadensfreien Salzeinlagerung im Bauteil'
      ],
      relevance: 'Historisches Mauerwerk reagiert hochgradig empfindlich auf moderne Sanierungsmaterialien. Fachplaner WTA verhindern irreparable Schäden, indem sie Instandsetzungssysteme materialtechnisch optimal auf die Bestandsmörtel abstimmen.',
      category: 'denkmal'
    },
    mold_remediation: {
      id: 'mold_remediation',
      title: 'Sachkundenachweis für die Erkennung, Bewertung und Sanierung von Schimmelpilzbelastungen',
      abbreviation: 'Schimmel-Sachkunde (TÜV / WTA)',
      authority: 'Verband der TÜV e.V. / WTA-Akademie (anerkannt nach UBA)',
      scope: 'Nachweis der fachtechnischen und gesundheitsbezogenen Eignung zur Beseitigung von mikrobiellen Schäden im Bestand.',
      legalBase: 'Schimmelpilz-Leitfaden des Umweltbundesamtes (UBA), Biostoffverordnung (BioStoffV), DGUV Information 201-028 (Biostoffe bei der Schimmelpilzsanierung).',
      targetGroup: 'Bauleiter, Schadensgutachter, Malermeister, Trockenbauer, Verwerter von Feuchtigkeitsschäden.',
      duration: '3 bis 5 Tage Kompaktkurs inklusive mündlicher und schriftlicher Sachkundeprüfung nach staatlichem Prüfstandard.',
      validity: 'Unbefristet (regelmäßige eintägige Refresher-Seminare werden aufgrund neuer Regelungen des UBA dringend empfohlen).',
      difficulty: 'Mittel',
      prerequisites: [
        'Fachliche Ausbildung im Bau- oder Ausbaugewerbe (z. B. Maler, Stuckateur, Isolierer) oder Fachplanerausbildung',
        'Sicherer Umgang mit grundlegendem Werkzeug zur Probeentnahme'
      ],
      modules: [
        'Mikrobiologie: Unterscheidung von Schimmelpilzen (Penicillium, Aspergillus, Stachybotrys) und Bakterien (Strukturen, Gefahren)',
        'Messtechnische Erfassung der Bauwerkshygrothermik (Infrarot-Thermografie, relative Luftfeuchten, Datenloggerauswertung)',
        'Ursachenanalyse von Schimmelbildung (Wärmebrücken im Bestand, unzureichende Lüftungskonzepte nach DIN 1946-6)',
        'Schadensklassifizierung (Kategorie 1 bis 3 nach UBA) und Gefährdungsbeurteilung der Arbeitnehmer',
        'Sanierungskonzepte: Errichtung staubdichter Unterdruck-Schwarzbereiche, Abschleif- und Absaugtechniken (Filterklasse H)',
        'Desinfektion und Reinigung mit Isopropanol, Wasserstoffperoxid, mechanische Entfernung befallener Putzschichten'
      ],
      relevance: 'Beim nachträglichen Einbau dichter Fenster im Altbestand entstehen ohne Lüftungskonzept hochgradige Schimmelschadensfälle. Unternehmen ohne diese qualifizierte Sachkunde haften unbeschränkt bei misslungener Sporenbeseitigung oder gesundheitlicher Gefährdung.',
      category: 'schadstoffe'
    },
    heritage_energy: {
      id: 'heritage_energy',
      title: 'Energieberater für Baudenkmale und erhaltenswerte Bausubstanz',
      abbreviation: 'Energieberater Denkmal (dena / WTA)',
      authority: 'dena (Deutsche Energie-Agentur) / WTA-Akademie',
      scope: 'Zertifizierter Sachverständiger zur thermisch-energetischen Effizienzsteigerung denkmalgeschützter Bauwerke ohne baustoffliche Gefährdung.',
      legalBase: 'Gebäudemodernisierungsgesetz (GModG; geändertes GEG, Art. 1 in Kraft seit 29.07.2026, weitere Teile ab 01.01.2027) – Ausnahmen für Baudenkmale, KfW-Förderung Effizienzhaus Denkmal.',
      targetGroup: 'Architekten, Bauphysiker, Tragwerksplaner, gelistete Energieeffizienz-Experten.',
      duration: 'Spezifisches Aufbaustudium (ca. 160 Unterrichtsstunden) inklusive einer komplexen Fach-Projektarbeit zur Modernisierung eines Denkmals.',
      validity: '3 Jahre. Verlängerung durch dena-Punkteprüfung und den Nachweis aktiver Denkmal-Modernisierungsplanungen im Register.',
      difficulty: 'Sehr Hoch',
      prerequisites: [
        'Zulassung als regulärer dena-Energieeffizienz-Experte (Wohn- oder Nichtwohngebäude)',
        'Bauhauptstudienabschluss oder handwerkliche Meisterstufe mit nachweisbarer Bauphysik-Zertifizierung'
      ],
      modules: [
        'Einfluss historischer Baustoffe (Lehm, Massivholz, Fachwerkausmauerung) auf hygrothermische Feuchtebilanzen',
        'Simulationsverfahren für kapillaraktive Innendämmungen (WUFI-Simulationen) zur Vermeidung kritischer Taupunktlagen',
        'Denkmalpflegerische Kernkriterien (Fassadenerhalt, historische Verglasungen, Kastenfenstersanierungen)',
        'Wärmebrückenberechnung an Holzbalkenauflagern im gedämmten Mauerwerk zur Verhinderung von Fäulnis',
        'Konzeptionierung behutsamer Anlagentechnik (z. B. Bauteil- und Wandflächentemperierung, Solarpaneel-Integration)',
        'Beantragung und Nachweisführung geförderter Sanierungsstufen ("KfW-Effizienzhaus Denkmal")'
      ],
      relevance: 'Standardmäßige Außendämmungen (WDVS) sind auf Denkmalfassaden verboten. Die energetische Sanierung muss extrem anspruchsvoll über bauphysikalische Innendämmungen geplant werden. Dies dürfen rechtlich belastbar und im Förderungsrahmen NUR gelistete Energieberater Denkmal tun.',
      category: 'denkmal'
    },
    sigeko: {
      id: 'sigeko',
      title: 'Sicherheits- und Gesundheitsschutzkoordinator nach BaustellV',
      abbreviation: 'SiGeKo (RAB 30)',
      authority: 'Bau-Berufsgenossenschaften (BG) / Staatlich anerkannte Zertifizierungsstellen',
      scope: 'Zulassung zur gesetzlich vorgeschriebenen Arbeitsschutzkoordinierung auf Baustellen mit mehreren Gewerken.',
      legalBase: 'Verordnung über Sicherheit und Gesundheitsschutz auf Baustellen (Baustellenverordnung - BaustellV), Regeln für den Arbeitsschutz auf Baustellen (RAB 30).',
      targetGroup: 'Bauleiter, Projektsteuerer, Architekten, Bauingenieure, Poliere mit Baustellenerfahrung.',
      duration: 'Lehrgänge zu arbeitsschutzfachlichen und koordinatorenspezifischen Kenntnissen nach RAB 30 (Anlagen B und C) mit Prüfungen.',
      validity: 'Unbefristet (fortlaufende informelle Aktualisierungsseminare bezüglich Arbeitsschutzregelungen dringend empfohlen).',
      difficulty: 'Mittel',
      prerequisites: [
        'Baufachliche Berufsausbildung (Techniker, Meister, Ingenieur)',
        'Mindestens 2 Jahre einschlägige Berufserfahrung in der operativen Bauausführung oder Bauüberwachung vor Ort'
      ],
      modules: [
        'Grundlagen des Arbeitsschutzrechts (ArbSchG, BaustellV, ArbStättV) und Pflichten des Bauherren',
        'Erstellung des gesetzlich geforderten Sicherheits- und Gesundheitsschutzplans (SiGe-Plan)',
        'Entwurf der Unterlagen für spätere Arbeiten am Gebäude (Sicherheitsvorkehrungen für Instandsetzungen)',
        'Koordinierungsmethodik in der Planungsphase (Wohnungs- und Industriebau) sowie in der Ausführungsphase',
        'Praktischer Arbeitsschutz auf Baustellen: Absturzhöhen, Gerüstabnahmen, Lärmemittlung, Gefahrenbereiche',
        'Haftungsrechtliche Verpflichtungen und Strafrechtstatbestände bei der Übernahme von Koordinierungsaufgaben'
      ],
      relevance: 'Sobald Beschäftigte mehrerer Firmen gleichzeitig oder nacheinander auf einer Baustelle tätig sind und ein bestimmter Projektumfang überschritten wird, ist die SiGeKo-Bestellung gesetzliche Pflicht. Ein Fehlen führt zu unmittelbaren Bußgeldern oder behördlich verfügtem Baustopp.',
      category: 'baubetrieb'
    },
    crack_injection: {
      id: 'crack_injection',
      title: 'Fachkraft für das Füllen und Verpressen von Rissen in Betonbauteilen (Injektionsschein)',
      abbreviation: 'Injektions-Schein (Rissverpressung)',
      authority: 'Akademien der Bauwirtschaft / DBV-konforme Qualifizierungszentren',
      scope: 'Zertifizierter Nachweis zur fachgerechten handwerklichen Ausführung von Füll- und Verpressarbeiten im Zuge der Bauwerkssanierung.',
      legalBase: 'TR Instandhaltung des DIBt (Teil 2), DAfStb-Instandsetzungsrichtlinie, DIN EN 1504-5 (Injektionsstoffe für Betoninstandhaltung).',
      targetGroup: 'Sanierungshandwerker, Poliere, Kolonnenführer im Hoch-, Tief- und Kanalbau, bauüberwachende Sachkundige.',
      duration: 'Praxisorientierter Lehrgang mit Applikationsprüfung (Umfang beim Ausbildungszentrum prüfen).',
      validity: 'Regelungen zu Gültigkeit und Auffrischung beim Ausbildungsbeirat prüfen.',
      difficulty: 'Mittel',
      prerequisites: [
        'Erfolgreich absolvierter SIVV-Schein (bevorzugt)',
        'Oder eine abgeschlossene Ausbildung als Beton- und Stahlbetonbauer, Maurer oder artverwandte Baufugen-Gewerke'
      ],
      modules: [
        'Einteilung von Haarrissen, Gefügestörungen sowie Ursachenermittlung (Zwangspannungen, statische Verschiebungen)',
        'Materialeigenschaften von Injektionsstoffen: Polyurethanharze (PUR), Epoxidharze (EP), Zementleim bzw. Zementsuspensionen (ZS)',
        'Mechanische Bohrpackertechnik vs. Klebe-Oberflächenpacker (Auswahl, packerfreie Injektionen, Anordnung)',
        'Maschinentechnik: Wirkungsweisen von 1-Komponenten-Handhebelpressen und pneumatischen 2-Komponenten-Mischpumpen',
        'Sanierungsmethoden: Kraftschlüssiges Verbinden (EP-Harz), dehnfähiges Abdichten (PUR-Harze), dehnfähiges Füllen mit Schäumen',
        'Qualitätssicherung: Überwachung der Bauteiltemperatur, Verbrauchsmessungen, Festigkeits- und Drucküberwachung'
      ],
      relevance: 'Verpressungen im Rissbereich hängen unmittelbar von der handwerklichen Präzision ab (z. B. unzureichender Druck führt zu Hohlräumen, falscher Stoff zu erneutem Bauteilriss). Für Rissverpressungen an Ingenieurtragwerken fordert die ZTV-ING zwingend qualifizierte Injektionistennachweise.',
      category: 'beton'
    },
    thermography: {
      id: 'thermography',
      title: 'Zertifizierter Thermograf der Stufe 1 / 2 (Sektor Bau)',
      abbreviation: 'Bauthermograf (DIN EN ISO 9712)',
      authority: 'Zertifizierungsstellen nach DIN EN ISO 9712 (z. B. Sector Cert, TÜV)',
      scope: 'Nachweis der messtechnischen und physikalischen Eignung zur berührungslosen Erkennung von Wärmebrücken, Feuchteschäden und Leckagen mittels Infrarot-Kamerasystemen.',
      legalBase: 'DIN EN ISO 9712 (Zerstörungsfreie Prüfung - Qualifizierung und Zertifizierung von ZfP-Personal).',
      targetGroup: 'Energieberater, Bauphysiker, Gebäude-Diagnostiker, Sachverständige für Bauschäden.',
      duration: 'Je Stufe 40-80 Unterrichtsstunden zzgl. einer ganztägigen theoretischen und praktischen Qualifizierungsprüfung.',
      validity: '5 Jahre, Verlängerung durch Rezertifizierungsprüfung oder Nachweis kontinuierlicher praktischer Tätigkeit.',
      difficulty: 'Hoch',
      prerequisites: [
        'Nachweis über ausreichendes Sehvermögen (Jaeger-Sehtest)',
        'Praktische Erfahrungszeiten im Bereich Bauthermographie vor der Fachprüfung (Nachweis über Gutachten-Beispiele)'
      ],
      modules: [
        'Physikalische Grundlagen der Infrarotstrahlung (Emission, Reflexion, Transmission)',
        'Messtechnische Parameter: Bestimmung des Emissionsgrads (ε) und der reflektierten Umgebungstemperatur',
        'Bauphysikalische Zusammenhänge: Wärmewiderstand, Feuchtigkeitseinlagerungen, Taupunkt- und Schimmelpilzgrenzen',
        'Einfluss von Luftströmungen und Druckunterschieden (Synergien mit dem Blower-Door-Verfahren)',
        'Gerätekunde: Detektorauflösung (NETD), Wellenlängenbereiche (Langwelle 7,5 - 14 µm für den Hochbau)',
        'Erstellung normgerechter thermografischer Berichte und Defekt-Kartierung'
      ],
      relevance: 'Gutachterliche Thermografieberichte sind vor Gericht im Schadensfall nur haltbar, wenn der Durchführende ein anerkanntes Personenzertifikat nach DIN EN ISO 9712 nachweisen kann. Das Zertifikat schützt vor falschen Temperaturdeutungen (z. B. Reflexion statt Kältebrücke).',
      category: 'bauphysik'
    },
    waterproofing: {
      id: 'waterproofing',
      title: 'Zertifizierter Fachplaner und Sachverständiger für Bauwerksabdichtung',
      abbreviation: 'Abdichtungs-Planer (DHBV / TÜV)',
      authority: 'Deutscher Holz- und Bautenschutzverband e.V. (DHBV) / TÜV Bauakademie',
      scope: 'Spezialisierter Sachkunde- und Planernachweis für anspruchsvolle erdberührte Abdichtungen, Flachdächer und Nassräume im Hoch- und Bestandbau.',
      legalBase: 'DIN 18531 bis DIN 18535 (Neues Abdichtungsregelwerk, insbesondere DIN 18533 für erdberührte Bauteile), WTA-Merkblätter.',
      targetGroup: 'Architekten, Tragwerksplaner, beratende Ingenieure, Bauleiter, Bauwerksdiagnostiker.',
      duration: 'Speziallehrgang in mehreren Fachblöcken (ca. 60-80 Stunden) zzgl. Praxisprojekt und Abschlussbeirat-Prüfung.',
      validity: 'Unbefristet (kontinuierliche Anpassungsfortbildungen bezüglich neuer Werkstoffentwicklungen zwingend erforderlich).',
      difficulty: 'Hoch',
      prerequisites: [
        'Ingenieurtechnische Bauausbildung oder handwerkliche Meisterprüfungen im Bauwesen',
        'Mindestens 2 Jahre nachgewiesene Berufserfahrung in der Bauphysik oder im Bautenschützergewerbe'
      ],
      modules: [
        'Wasserbeanspruchungsklassen (W1-E bis W4-E), Riss- und Raumnutzungsklassen nach DIN 18533',
        'Moderne Abdichtungsstoffe: Kunststoffmodifizierte Bitumendickbeschichtungen (PMBC), polymermodifizierte Dickbeschichtungen (FPD), Dichtungsschlämmen (MDS)',
        'Detailplanung für die Bauausführung: Sockelausbildung, Rohrdurchlässe, Dehnungsfugen und Übergänge',
        'Bauwerksbeurteilungen bei drückendem Wasser, Schichtenwasser und Bodenfeuchtigkeit',
        'Nachträgliche Schleierinjektionen und innenliegende druckwasserdichte Sanierungsabdichtungen'
      ],
      relevance: 'Wassereintritte und feuchte Keller sind die Schadensursache Nummer 1 an Alt- und Neubauten. Zertifizierte Abdichtungsplaner minimieren das enorme rechtliche Ausführungsrisiko der statischen Tragsicherungsgefährdung.',
      category: 'bauphysik'
    },
    drone_inspection: {
      id: 'drone_inspection',
      title: 'EU-Fernpilotenzeugnis A2 für Bauwerksinspektion',
      abbreviation: 'Drohneninspektor A2 (LBA)',
      authority: 'Luftfahrt-Bundesamt (LBA) / Anerkannte Prüfstellen des Bundes',
      scope: 'Rechtlicher und praktischer Befähigungsnachweis zum sicheren Betrieb unbemannter Luftfahrtsysteme (UAS) für hochauflösende optische und thermische Bauwerkskartierungen.',
      legalBase: 'EU-Verordnung 2019/947 (Betrieb von unbemannten Luftfahrzeugen), Luftverkehrsgesetz (LuftVG).',
      targetGroup: 'Gebäudediagnostiker, Brückenprüfingenieure nach DIN 1076, Schadensgutachter, Vermesser.',
      duration: '3-4 Tage Theorie- und Praxisausbildung inkl. anspruchsvoller Fachprüfung bei einer zertifizierten Prüfstelle des LBA.',
      validity: '5 Jahre; Verlängerung nach den Vorgaben des Luftfahrt-Bundesamts.',
      difficulty: 'Mittel',
      prerequisites: [
        'Vorgeschalteter EU-Kompetenznachweis A1/A3 (kleiner Drohnenführerschein) obligatorisch',
        'Erklärung der Absolvierung eines eigenständigen praktischen Flugtrainings',
        'Haftpflicht-Versicherungsschutz für Fluggeräte im gewerblichen Einsatz'
      ],
      modules: [
        'Aerodynamische Windschatten- und Turbulenzeffekte im engebebauten Raum und an Brückenpfeilern',
        'LBA-Richtlinien bezüglich des Mindestabstands zu Wohngebieten und Verkehrswegen (Kategorie "Open A2")',
        'Grundlagen der bildgestützten Bauwerks-Vermessung (Photogrammetrie und 3D-Rekonstruktionen)',
        'Sicherheits-Notfallsteuerungen und Signalstörungs-Gegenmaßnahmen bei GPS-Ausfällen im Stahlgitterschatten',
        'Datenschutzrechtliche Aspekte (DSGVO) bei der Befliegung bewohnter Fassadenteile'
      ],
      relevance: 'Die Inspektion hoher Schornsteine, Brückenunterseiten oder weitläufiger Dächer mittels Kameradrohnen ist kostengünstiger und sicherer als Rüstungen oder Steiger. Die A2-Zulassung ist rechtlich unumgänglich für den nahen, genehmigungsfreien Betrieb im städtischen Raum.',
      category: 'bauphysik'
    },
    building_damage_expert: {
      id: 'building_damage_expert',
      title: 'Zertifizierter Sachverständiger für Schäden an Gebäuden',
      abbreviation: 'Bauschadens-Gutachter (IHK / ISO 17024)',
      authority: 'IHK / Personenzertifizierungsstellen nach DIN EN ISO/IEC 17024',
      scope: 'Höchststufe der bautechnischen Zertifizierung zur unabhängigen, beweissicheren Bewertung, Ursachenforschung und Schadensbewertung an Konstruktionen.',
      legalBase: '§ 36 GewO (öffentliche Bestellung), §§ 402 ff. ZPO (gerichtliche Gutachten), DIN EN ISO/IEC 17024 (Personenzertifizierung), BGB/VOB Werkvertragsrecht.',
      targetGroup: 'Freiberufliche Bausachverständige, planende Ingenieure, Tragwerksprüfer, Versicherungsingenieure.',
      duration: 'Modulares Studium über ca. 1-2 Jahre (ca. 180-240 Stunden) inkl. Fachgutachten-Hausarbeiten und Abschlusskolloquium.',
      validity: 'Personenzertifikate nach DIN EN ISO/IEC 17024 meist 5 Jahre; öffentliche Bestellung befristet; Fortbildung nachzuweisen.',
      difficulty: 'Sehr Hoch',
      prerequisites: [
        'Abgeschlossenes Ingenieur- oder Architekturstudium mit mindestens 5 Jahren fundierter Berufserfahrung',
        'Oder qualifizierter Handwerksmeister (z. B. Maurer, Betonbauer, Zimmerer) mit 10-jähriger Praxis'
      ],
      modules: [
        'Werkvertragsrecht und Mängelzuweisung nach BGB § 633 und VOB/B',
        'Schadensmechanik: Thermisch-hygrische Bauwerkspannungen, Setzungserscheinungen und Baugrundfehler',
        'Bautechnische Bauwerksdiagnostik: Rissbreitenanalysen, Rissmonitoring, zerstörungsfreie Festigkeitsprüfungen',
        'Dach- und Bauwerksabdichtungskonstruktionen, fehlerhafte Einbauten von Dichtbändern',
        'Gutachtenmethodik: Unabhängigkeit, Nachvollziehbarkeit für baulaie Gerichte und sachverständige Abgrenzung'
      ],
      relevance: 'Gerichtliche Beweisbeschlüsse und Versicherungssanierungen berufen sich im Kern auf Gutachten zertifizierter Sachverständiger. Das Siegel nach ISO 17024 oder IHK garantiert höchste Fachkompetenz und genießt absolutes Vertrauen vor deutschen Zivilgerichten.',
      category: 'baubetrieb'
    }
  };

  // Profile-Based Certificate Finder
  const recommendedCerts = useMemo(() => {
    if (!userBackground || !userGoal) return [];
    
    const recs: { cert: Certificate; reason: string }[] = [];
    
    if (userBackground === 'engineer') {
      if (userGoal === 'sanierung') {
        recs.push({ cert: certs.skp, reason: 'Als Bauingenieur ist der "Sachkundige Planer" der absolute Goldstandard für die Ausarbeitung und Abrechnung von Betoninstandsetzungsprojekten.' });
        recs.push({ cert: certs.eschein, reason: 'Der E-Schein bildet die technologische Voraussetzung, damit Sie betonüberwachte Großprojekte (z. B. Großbrücken) planen und leiten können.' });
        recs.push({ cert: certs.building_damage_expert, reason: 'Der Bauschadens-Gutachter (IHK/ISO 17024) vervollständigt Ihr kaufmännisches und beweissicherndes technisches Profil vor Gerichten.' });
      } else if (userGoal === 'bauleitung') {
        recs.push({ cert: certs.eschein, reason: 'Als bauüberwachende Ingenieurin oder bauüberwachender Ingenieur müssen Sie bei Überwachungsklasse 2 und 3 technisches Know-how auf Prüfklassenniveau nachweisen. Der E-Schein ist hier Pflicht.' });
        recs.push({ cert: certs.trgs519, reason: 'Bei Sanierungsbauleitungen im Altbestand ist der Asbest-Schein (TRGS 519) ein Muss zur sicheren Überwachung staubfreier Absauganlagen.' });
        recs.push({ cert: certs.sigeko, reason: 'Der SiGeKo-Schein RAB 30 liefert das rechtliche Rüstzeug, um operative Baustellenabsicherungen parallel zu koordinieren.' });
      } else if (userGoal === 'stahlbau') {
        recs.push({ cert: certs.sfi, reason: 'Im konstruktiven Ingenieurbau / Stahlbrückenbau bildet die Qualifikation zum Schweißfachingenieur (SFI/IWE) die rechtliche Grundbedingung für Schweißprüfungen nach EN 1090.' });
      } else if (userGoal === 'spezialwerke') {
        recs.push({ cert: certs.kks, reason: 'Für die dauerhafte Instandhaltung hochexponierter Ingenieurwerke (Salzbelastung in Parkhäusern, Kappenbereiche von Brücken) empfiehlt sich die elektrochemische KKS-Ausbildung nach ISO 15257.' });
      } else if (userGoal === 'holzschutz') {
        recs.push({ cert: certs.wood_protection, reason: 'Der Sachkundenachweis für Holzschutz am Bau (DIN 68800-4) ist für den planenden Ingenieur zur Schadensbeurteilung und Sanierungsfreigabe von Holzbauten essenziell.' });
      } else if (userGoal === 'schadstoffe') {
        recs.push({ cert: certs.trgs519, reason: 'Der Asbest-Schein TRGS 519 ist gesetzlich vorgeschrieben zur Bauherrenabsicherung bei Schadstoffsanierung.' });
        recs.push({ cert: certs.trgs524, reason: 'Für Arbeiten im kontaminierten Bereich (Altlasten, gefährlicher Bodeneingriff) ist die Ausbildung nach TRGS 524 zwingend erforderlich.' });
        recs.push({ cert: certs.trgs521, reason: 'Mit der Fachkunde nach TRGS 521 leiten und koordinieren Sie KMF-Sanierungen staubarm und entsorgungsrechtlich unbedenklich.' });
        recs.push({ cert: certs.mold_remediation, reason: 'Die Schimmel-Sachkunde liefert den biologisch-technischen Leitfaden zur Desinfektion, Beurteilung und Sanierungsbegleitung im Bestand.' });
      } else if (userGoal === 'denkmal_energie') {
        recs.push({ cert: certs.heritage_energy, reason: 'Als dena-gelisteter Energieberater Denkmal können Sie hochempfindliche, geförderte energetische Modernisierungspläne rechtlich belastbar unterbreiten.' });
        recs.push({ cert: certs.masonry_restoration, reason: 'Die WTA-Instandsetzungsplanung liefert die nötige materialspezifische Abstimmung auf historische Trasskalk- und Natursteingefüge zur Schadensvermeidung.' });
      } else if (userGoal === 'baustellen_sicherheit') {
        recs.push({ cert: certs.sigeko, reason: 'Als Planer/Ingenieur qualifiziert Sie der RAB-30-Nachweis direkt als gesetzlich anerkannter SiGeKo zur Koordinierung paralleler Bauabläufe.' });
      } else if (userGoal === 'rissinjektion') {
        recs.push({ cert: certs.skp, reason: 'Planerische Entwürfe, Bauteilauswahlen und Risskartierungen bedürfen des tiefgreifenden betontechnischen SKP-Wissens.' });
        recs.push({ cert: certs.crack_injection, reason: 'Der handwerkliche Injektionsschein vermittelt Ihnen tiefes Systemwissen über Harze, Zementsuspensionen und Bohrpacker zur besseren Detailüberwachung.' });
      } else if (userGoal === 'bauwerk_diagnose') {
        recs.push({ cert: certs.thermography, reason: 'Erwirb ein anerkanntes Bauthermografen-Zertifikat nach ISO 9712, um beweissichere thermodynamische Bauwerksbeurteilungen zu verfassen.' });
        recs.push({ cert: certs.drone_inspection, reason: 'Der große Drohnenführerschein A2 des Luftfahrt-Bundesamtes legitimiert dichte Bauwerküberwachungsflüge im urbanen Raum ohne Strafbarkeitsrisiko.' });
      } else if (userGoal === 'abdichtung') {
        recs.push({ cert: certs.waterproofing, reason: 'Als zertifizierter Fachplaner für Bauwerksabdichtungen nach DIN 18533 entwerfen Sie horizontal/vertikale Kellersperren lückenlos und schadensfrei.' });
        recs.push({ cert: certs.masonry_restoration, reason: 'Ergänze WTA-Spezialwissen für historische, feuchtebelastete Bruchstein- oder Altbaumauerwerke bei der nachträglichen Bauwerksabdichtung.' });
      }
    } else if (userBackground === 'handwerker') {
      if (userGoal === 'sanierung') {
        recs.push({ cert: certs.sivv, reason: 'Als Maurermeister, Polier oder geschickter Geselle ist der SIVV-Schein essenziell. Jede aktive Kolonne auf Baustellen nach ZTV-ING muss einen SIVV-Eigner führen.' });
        recs.push({ cert: certs.duesenfuehrer, reason: 'Spritzbeton aufzubringen verlangt äußerste Fingerfertigkeit bezüglich Rückprallminimierung. Der Düsenführerschein sichert Ihre handwerkliche Position.' });
      } else if (userGoal === 'bauleitung') {
        recs.push({ cert: certs.sivv, reason: 'Polieren im Bestand wird fast immer durch den SIVV-Schein legitimiert.' });
        recs.push({ cert: certs.trgs519, reason: 'Wer asbesthaltige Gefahrstoffe (z.B. Fliesenkleber) aktiv abschleift, benötigt zwingend den Sachkundenachweis TRGS 519 zur Genehmigungsabsicherung.' });
      } else if (userGoal === 'holzschutz') {
        recs.push({ cert: certs.wood_protection, reason: 'Als ausführender Handwerker (z. B. Zimmerer) qualifiziert Sie dieser Schein zur bauaufsichtlich konformen Bekämpfung von Hausschwamm und Hausbock nach DIN 68800-4.' });
      } else if (userGoal === 'schadstoffe') {
        recs.push({ cert: certs.trgs519, reason: 'TRGS 519 Anlage 3/4 ist gesetzlich zwingend gefordert für das manuelle Abschlagen und Schleifen asbesthaltiger Klebstoffe im Sanierungsausbau.' });
        recs.push({ cert: certs.trgs521, reason: 'Der KMF-Schein sichert Sie beim staubigen Ausbau alter Dämmmaterialien (Glas-/Steinwolle) rechtsschutzrechtlich ab.' });
        recs.push({ cert: certs.mold_remediation, reason: 'Die Schimmelpilz-Sanierungssachkunde berechtigt Sie zur sicheren und ordnungsgemäßen Beseitigung schwerer Wohnraum-Schimmelpilzschäden.' });
      } else if (userGoal === 'baustellen_sicherheit') {
        recs.push({ cert: certs.sigeko, reason: 'Mit baufachlichem Hintergrund als Meister oder Polier eröffnet Ihnen der RAB-30-Nachweis lukrative SiGeKo-Zusatzaufträge zur Baustellensicherheit.' });
      } else if (userGoal === 'rissinjektion') {
        recs.push({ cert: certs.crack_injection, reason: 'Der Rissinjektion-Schein ist das handwerkliche Gütesiegel zur kraftschlüssigen oder dehnfähigen Abdichtung von Kellerrissen und Tunnelgewölben.' });
        recs.push({ cert: certs.sivv, reason: 'Für qualifizierte Injektionen rissbelasteter Bauwerke ist die generelle Mörtelsachkunde der SIVV-Fachkraft eine hervorragende normative Ergänzung.' });
      } else if (userGoal === 'bauwerk_diagnose') {
        recs.push({ cert: certs.drone_inspection, reason: 'Befliege komplexe Steildachflächen oder unzugängliche Simse mit einer A2-Drohnenberechtigung zur schnellen handwerklichen Schadensprüfung.' });
      } else if (userGoal === 'abdichtung') {
        recs.push({ cert: certs.waterproofing, reason: 'Bautenschützer und Sanierungshandwerker weisen mit dem Abdichtungs-Zertifikat meisterliche Qualität bei der Kellersanierung nach.' });
        recs.push({ cert: certs.crack_injection, reason: 'Sie führen hochdruckverpressende Rissabdichtungen mit PUR- oder Acrylatgelen meisterlich aus.' });
      } else {
        recs.push({ cert: certs.sivv, reason: 'Zur Weiterbildung im Handwerk bildet der SIVV-Mörtelschein die solide, anerkannte Grundlage.' });
      }
    } else if (userBackground === 'student') {
      recs.push({ cert: certs.eschein, reason: 'Studierende des Bauingenieurwesens können oft direkt im Anschluss an ihr Studium den E-Schein an kooperierenden Instituten zu stark vergünstigten Konditionen ablegen.' });
      recs.push({ cert: certs.skp, reason: 'Berufsziel Instandsetzungsplanung? Bereiten Sie sich akademisch darauf vor: Nach 3 Jahren praktischer Berufserfahrung können Sie die SKP-Aufbaufachprüfung absolvieren.' });
      
      if (userGoal === 'holzschutz') {
        recs.push({ cert: certs.wood_protection, reason: 'Bietet Architektur- und Baustudierenden ein wertvolles Spezialwissen im anspruchsvollen Holzbau und der historischen Bausubstanz.' });
      } else if (userGoal === 'schadstoffe') {
        recs.push({ cert: certs.trgs524, reason: 'Altlasten und Geotechnik sind sehr gute Vertiefungsfelder des Umwelt- und Bauingenieurwesens am Berufseinstieg.' });
        recs.push({ cert: certs.trgs521, reason: 'Wichtiges Kompakt-Fachwissen für hiwi-Tätigkeiten (Studentische Hilfskraft) auf Sanierungsbaustellen.' });
      } else if (userGoal === 'denkmal_energie') {
        recs.push({ cert: certs.heritage_energy, reason: 'Idealer Einstieg bereits während des Masterstudiums zur zukunftsträchtigen, hocheffizienten bauphysikalischen Denkmalsanierung.' });
      } else if (userGoal === 'bauwerk_diagnose') {
        recs.push({ cert: certs.thermography, reason: 'Nutzen Sie thermografische Qualifikationen der Stufe 1 als starkes bauphysikalisches Alleinstellungsmerkmal bei der Bewerbung in renommierten Ingenieurbüros.' });
      } else if (userGoal === 'abdichtung') {
        recs.push({ cert: certs.waterproofing, reason: 'Vertiefen Sie Ihr Wissen über das anspruchsvolle neue Abdichtungsregelwerk DIN 18533 bereits vor dem Berufseinstieg.' });
      }
    }
    
    return recs;
  }, [userBackground, userGoal]);

  const filteredCerts = useMemo(() => {
    return Object.values(certs).filter(cert => {
      if (selectedCategory === 'all') return true;
      return cert.category === selectedCategory;
    });
  }, [selectedCategory, certs]);

  const activeCert = certs[activeCertId];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header and overview */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Award className="text-shiraz" /> Relevante Fortbildungen, Scheine &amp; Qualifikationsnachweise
          </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Detailliertes und umfassendes Verzeichnis deutscher Fortbildungen, Handwerker- und Ingenieurscheine in den Bereichen Baustofftechnologie, Bautechnik, Schadstoffsanierung und Bauwerksinstandsetzung im Bestand.
          </p>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/25 flex gap-3 leading-relaxed">
          <GraduationCap className="text-shiraz shrink-0 mt-0.5" size={20} />
          <p>
            Im deutschen Bauwesen sind Qualifikationsnachweise und Zertifizierungen von herausragender rechtlicher Tragkraft. Sie verknüpfen bauphysikalische Kenntnisse mit haftungsrechtlicher Befugnis. Viele Ausschreibungen verlangen herstellerunabhängige Qualifikationsnachweise (z. B. nach Richtlinien des Deutschen Ausschusses für Stahlbeton - DAfStb, der WTA e.V. oder der Berufsgenossenschaften). Ein Nichtvorliegen dieser Nachweise führt regelmäßig zu haftungsrechtlichen Klagen oder Baustopps durch Landesbauordnungen.
          </p>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100/70 rounded-xl border border-home-grau/30">
          {categories.map((cat) => {
            const count = cat.id === 'all' 
              ? Object.keys(certs).length 
              : Object.values(certs).filter(c => c.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-text-main/70 hover:text-text-main hover:bg-stone-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-stone-200 text-text-main/60'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic selector interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* List of Certificates */}
          <div className="lg:col-span-4 flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 block">Zertifizierungsauswahl:</span>
            {filteredCerts.map((cert) => {
              const isActive = activeCertId === cert.id;
              return (
                <button aria-pressed={isActive}
                  key={cert.id}
                  onClick={() => setActiveCertId(cert.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex justify-between items-center gap-2 ${
                    isActive
                      ? 'bg-shiraz text-white border-shiraz shadow-md'
                      : 'bg-stone-50/50 border-home-grau/25 hover:bg-stone-50 text-text-main'
                  }`}
                >
                  <div className="flex flex-col gap-0.5 min-w-0 pr-1">
                    <span className={`text-[9px] uppercase font-mono tracking-widest ${isActive ? 'text-white/80' : 'text-shiraz font-bold'}`}>
                      {cert.authority}
                    </span>
                    <span className="font-bold truncate">{cert.abbreviation}</span>
                  </div>
                  <ArrowRight size={14} className={`shrink-0 transition-transform ${isActive ? 'translate-x-1' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Certificate Detail View */}
          <div className="lg:col-span-8 bg-stone-50 border border-home-grau/30 p-5 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-home-grau/30 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold bg-shiraz/10 text-shiraz px-2 py-0.5 rounded-md">
                    Herausgeber: {activeCert.authority}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500">SCHWIERIGKEIT:</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${
                      activeCert.difficulty === 'Sehr Hoch' ? 'bg-red-600' :
                      activeCert.difficulty === 'Hoch' ? 'bg-orange-600' : 'bg-teal-600'
                    }`}>
                      {activeCert.difficulty}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-text-main mt-2 leading-tight">
                  {activeCert.title}
                </h3>
                <p className="text-xs sm:text-sm text-shiraz font-semibold mt-1 font-mono">
                  Kurzformel/Titel: {activeCert.abbreviation}
                </p>
              </div>

              {/* Detailed specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-gray-900 font-bold border-b pb-1">
                    <FileText size={14} className="text-shiraz" /> Gesetzliche / Normative Verknüpfung
                  </div>
                  <p className="text-gray-750 leading-relaxed text-xs sm:text-sm">{activeCert.legalBase}</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-gray-900 font-bold border-b pb-1">
                    <Users size={14} className="text-shiraz" /> Zielpublikum
                  </div>
                  <p className="text-gray-750 leading-relaxed text-xs sm:text-sm">{activeCert.targetGroup}</p>
                </div>
              </div>

              {/* Scope & Syllabus */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wide">Ausbildungsnutzen &amp; Studieninhalte</h4>
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic border-l-2 border-shiraz pl-2">
                    "{activeCert.scope}"
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-750 list-none pl-0">
                    {activeCert.modules.map((m, idx) => (
                      <li key={idx} className="flex gap-1.5 items-start">
                        <Check size={14} className="text-emerald-600 block mt-0.5 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Requirements & Validity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wide mb-1.5">Zulassungsvoraussetzungen</h4>
                  <ul className="space-y-1 text-xs sm:text-sm text-gray-750 pl-0 list-none">
                    {activeCert.prerequisites.map((p, idx) => (
                      <li key={idx} className="flex gap-1.5 items-start">
                        <span className="w-1.5 h-1.5 bg-shiraz rounded-full mt-1.5 shrink-0"></span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wide mb-1.5">Gültigkeit &amp; Rezertifizierung</h4>
                  <div className="p-3 bg-stone-100 rounded-xl space-y-2 text-xs sm:text-sm border border-gray-200">
                    <div className="flex justify-between items-center text-[11px] font-mono border-b pb-1">
                      <span className="font-bold text-gray-500">DAUER:</span>
                      <span className="text-gray-900">{activeCert.duration}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="font-bold text-gray-500">FRIST:</span>
                      <span className="text-red-700 font-bold">{activeCert.validity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Practice relevance info */}
              <div className="bg-indigo-50 border border-indigo-200/50 p-4 rounded-xl flex gap-2.5 text-xs sm:text-sm text-indigo-900">
                <AlertTriangle className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                <div className="space-y-0.5">
                  <span className="font-bold block text-indigo-950">Bedeutung für die Praxis:</span>
                  <p className="leading-relaxed">{activeCert.relevance}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Path finder widget */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-2 mb-4 border-b border-home-grau/30 pb-3">
          <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg"><Sparkles size={18} /></span>
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              Qualifizierungs-Pfadfinder (Welche Ausbildung passt zu mir?)
            </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Geben Sie Ihren Hintergrund und Ihr konkretes Projektziel ein, um Ihren optimalen Weg zu Spezialzertifikaten am Bau zu filtern.
          </p>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Inputs */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                1. Ihr beruflicher / akademischer Hintergrund:
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => { setUserBackground('engineer'); setUserGoal(''); }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                    userBackground === 'engineer'
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                      : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-mono">🎓</span> Absolvent / Bauingenieur / Werkstoffwissenschaftler
                </button>
                <button
                  onClick={() => { setUserBackground('handwerker'); setUserGoal(''); }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                    userBackground === 'handwerker'
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                      : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-mono">🛠️</span> Handwerker / Meister / Polier / Quereinsteiger
                </button>
                <button
                  onClick={() => { setUserBackground('student'); setUserGoal(''); }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                    userBackground === 'student'
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                      : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-mono font-bold">📖</span> Studierender der Architektur / Bauingenieurwesen
                </button>
              </div>
            </div>

            {userBackground && (
              <div className="animate-in fade-in duration-300">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  2. Ihr primäres Einsatz- oder Karriereziel im Bestand:
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  
                  {/* Shared/Universal goals tailored contextually */}
                  <button aria-pressed={userGoal === 'sanierung'}
                    onClick={() => setUserGoal('sanierung')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'sanierung'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>Betonbau- / Parkhaus- / Brückeninstandsetzung leiten</span>
                    <Hammer size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'bauleitung'}
                    onClick={() => setUserGoal('bauleitung')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'bauleitung'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>Bauüberwachung auf anspruchsvollen Sanierungsbaustellen</span>
                    <Zap size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'holzschutz'}
                    onClick={() => setUserGoal('holzschutz')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'holzschutz'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>Historischen Holzbau &amp; Dachstühle sanieren und begutachten</span>
                    <Hammer size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'schadstoffe'}
                    onClick={() => setUserGoal('schadstoffe')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'schadstoffe'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>Schadstoffsanierung &amp; Innenraumhygiene (Asbest/Schimmel) leiten</span>
                    <Zap size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'rissinjektion'}
                    onClick={() => setUserGoal('rissinjektion')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'rissinjektion'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>Rissabdichtungen &amp; Harzinjektionen fachgerecht ausführen</span>
                    <Hammer size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'baustellen_sicherheit'}
                    onClick={() => setUserGoal('baustellen_sicherheit')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'baustellen_sicherheit'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>Sicherheitskoordination nach BaustellV (SiGeKo RAB 30)</span>
                    <Zap size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'bauwerk_diagnose'}
                    onClick={() => setUserGoal('bauwerk_diagnose')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'bauwerk_diagnose'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>Bauwerksdiagnostik, Inspektion &amp; Messtechnik (z. B. Drohne/Thermografie)</span>
                    <Zap size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'abdichtung'}
                    onClick={() => setUserGoal('abdichtung')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'abdichtung'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>Bauwerksabdichtungen &amp; Feuchtigkeitsschutz planen / ausführen</span>
                    <Hammer size={12} className="shrink-0 text-shiraz" />
                  </button>

                  {/* Engineer exclusivities */}
                  {userBackground === 'engineer' && (
                    <>
                      <button aria-pressed={userGoal === 'stahlbau'}
                        onClick={() => setUserGoal('stahlbau')}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          userGoal === 'stahlbau'
                            ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                            : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                        }`}
                      >
                        <span>Stahlbau- / Schweißaufsicht nach DIN EN 1090 übernehmen</span>
                        <Zap size={12} className="shrink-0 text-shiraz" />
                      </button>
                      <button aria-pressed={userGoal === 'spezialwerke'}
                        onClick={() => setUserGoal('spezialwerke')}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          userGoal === 'spezialwerke'
                            ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                            : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                        }`}
                      >
                        <span>Elektrochemischen KKS-Schutz für Chloridschäden planen</span>
                        <Zap size={12} className="shrink-0 text-shiraz" />
                      </button>
                      <button aria-pressed={userGoal === 'denkmal_energie'}
                        onClick={() => setUserGoal('denkmal_energie')}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          userGoal === 'denkmal_energie'
                            ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                            : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                        }`}
                      >
                        <span>Energetische Sanierung historischer Baudenkmale planen</span>
                        <Zap size={12} className="shrink-0 text-shiraz" />
                      </button>
                    </>
                  )}

                  {userBackground === 'student' && (
                    <button aria-pressed={userGoal === 'denkmal_energie'}
                      onClick={() => setUserGoal('denkmal_energie')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        userGoal === 'denkmal_energie'
                          ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                          : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                      }`}
                    >
                      <span>Energetische Sanierung historischer Baudenkmale planen</span>
                      <Zap size={12} className="shrink-0 text-shiraz" />
                    </button>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Recommendation Area */}
          <div className="md:col-span-7 bg-stone-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col justify-center min-h-[350px]">
            {userBackground && userGoal ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block">Unsere Analyse &amp; Zertifizierungspfad</span>
                <h4 className="font-bold text-sm text-gray-900 border-b pb-1.5 flex items-center gap-1.55">
                  <CheckCircle size={16} className="text-emerald-600" />
                  Empfohlene Qualifikationsnachweise &amp; Zusatzstufen
                </h4>
                
                {recommendedCerts.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {recommendedCerts.map((rec, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
                        <div className="flex justify-between items-center">
                          <strong className="text-xs text-shiraz block">{rec.cert.abbreviation}</strong>
                          <span className="text-[9px] font-mono text-gray-600 bg-gray-100 rounded px-1.5 py-0.5">{rec.cert.authority}</span>
                        </div>
                        <p className="text-[11px] text-gray-800 leading-relaxed font-semibold mt-1">
                          {rec.cert.title}
                        </p>
                        <p className="text-[10.5px] text-gray-550 leading-relaxed mt-1 bg-stone-50 p-2.5 rounded border border-gray-100 italic">
                          "{rec.reason}"
                        </p>
                        <button 
                          onClick={() => setActiveCertId(rec.cert.id)}
                          className="text-[9.5px] font-bold text-shiraz hover:underline flex items-center gap-1 mt-1.5"
                        >
                          Details im Verzeichnis ansehen <ArrowRight size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    Keine direkten Spezifikationsübereinstimmungen gefunden. Wählen Sie ein anderes Karriereziel, um das dichte Richtlinienprüfungsnetz des DBV abzugleichen.
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center text-home-grau flex flex-col items-center justify-center gap-2">
                <HelpCircle size={36} className="text-gray-300" />
                <p className="font-medium text-xs">Pfadfinder inaktiv</p>
                <p className="text-[11px] max-w-sm leading-relaxed text-gray-500">
                  Bitte wählen Sie links Ihre Ausbildungsstufe und Ihr Sanierungs- oder Planungsziel im Bestand aus, um eine passgenaue Laufbahnsimulation und die rechtlich verknüpften Lehrgangsscheine zu generieren.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      <ModuleFooter 
        weblinks={[
          { title: "Deutscher Beton- und Bautechnik-Verein e.V. (DBV)", url: "https://www.betonverein.de/" },
          { title: "WTA Publications (WTA GmbH) – Merkblätter der WTA e.V.", url: "https://www.wta-gmbh.de/" },
          { title: "dena - Deutsche Energie-Agentur Expertenliste", url: "https://www.energie-effizienz-experten.de/" },
          { title: "FKKS e.V. - Kathodischer Korrosionsschutz Ausbildung", url: "https://www.fkks.de/" }
        ]} 
        wikipedia={[
          { title: "Betontechnologe" },
          { title: "Hausschwamm", url: "https://de.wikipedia.org/wiki/Echter_Hausschwamm" },
          { title: "Kathodischer Korrosionsschutz", url: "https://de.wikipedia.org/wiki/Kathodischer_Korrosionsschutz" }
        ]} 
        literatur={[
          'Deutscher Beton- und Bautechnik-Verein e.V. (DBV): DBV-Merkblattsammlung und Schulungshandbücher',
          'WTA e.V.: Wissenschaftlich-Technische Arbeitsgemeinschaft für Bauwerkserhaltung und Denkmalpflege Merkblätter',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]} 
        regelwerke={[
          { title: 'Ausbildungsbeirat Sachkundiger Planer für Betonerhaltung (ABB-SKP)' },
          { title: 'DVS / EWF Richtlinien für Schweiß- und Verbindungstechnik', url: 'https://www.dvs-home.de/' },
          { title: 'dena Regelheft Energieeffizienz-Expertenliste', url: 'https://www.energie-effizienz-experten.de/' }
        ]} 
        formeln={[
          {
            formel: 'U_{\\text{vorh}} \\le U_{\\text{GEG}} \\implies \\Delta Q = (U_{\\text{Bestand}} - U_{\\text{Saniert}}) \\cdot A \\cdot F_x \\cdot H_T',
            erklaerung: 'Heizwärmebedarfseinsparung bei energetischer Sanierung (Berechnungsgrundlage für Gebäudeenergieberater nach dem Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, vormals GEG) und dena-Expertenliste).',
            quelle: 'GModG (vormals GEG) / Energieberater-Leitfaden'
          },
          {
            formel: 'E_{\\text{KKS}} \\le -850\\,\\text{mV}_{\\text{CSE}} \\implies \\text{Schutzpotentialkriterium für kathodisch geschützten Stahlbeton}',
            erklaerung: 'KKS-Schutzkriterium nach DIN EN ISO 12696 zur Vermeidung von Lochfraßkorrosion der Bewehrung bei Chloridbeaufschlagung.',
            quelle: 'DIN EN ISO 12696'
          }
        ]} 
      />
    </div>
  );
}
