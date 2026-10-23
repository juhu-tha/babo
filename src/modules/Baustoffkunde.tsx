import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Clock, Layers, AlertCircle, 
  ArrowRight, Landmark, Zap, ShieldCheck, TreePine, Construction, Hammer,
  User, Users
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';

interface HistoricalPeriod {
  era: string;
  century: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  materials: string[];
  milestone: string;
  details: string;
}

interface MaterialClass {
  id: string;
  name: string;
  icon: React.ReactNode;
  bgClass: string;
  borderClass: string;
  textClass: string;
  description: string;
  subclasses: string[];
  keyAttributes: { name: string; value: string }[];
  appLinkTab: string;
  appLinkName: string;
}

interface Pioneer {
  id: string;
  name: string;
  lifespan: string;
  role: string;
  field: string;
  origin: string;
  contribution: string;
  achievements: string[];
  quote: string;
}

export default function Baustoffkunde() {
  const [activeTab, setActiveTab] = useState<'systematik' | 'historie' | 'pioniere'>('systematik');
  const [selectedClass, setSelectedClass] = useState<string>('mineralisch');
  const [timelineEra, setTimelineEra] = useState<number>(0);
  const [selectedPioneer, setSelectedPioneer] = useState<string>('vitruv');

  // Pioneers mapping
  const pioneers: Pioneer[] = [
    {
      id: 'vitruv',
      name: 'Marcus Vitruvius Pollio (Vitruv)',
      lifespan: 'ca. 80/70 v. Chr. – nach 15 v. Chr.',
      role: 'Römischer Architekt, Ingenieur & Offizier',
      field: 'Antiker Gussmauerwerksbau (Opus Caementicium)',
      origin: 'Römisches Reich',
      contribution: 'Verfasste „De architectura“ (Zehn Bücher über Architektur), das einzige vollständig erhaltene Architekturlehrbuch der Antike. Im zweiten Buch beschreibt er Kalkbrennen, Sand, Ziegel und die vulkanische Puzzolanerde (pulvis puteolanus), die Kalkmörtel wasserbeständig macht – als Erfahrungswissen, noch ohne chemische Erklärung.',
      achievements: [
        'Formulierte die klassischen Kriterien guter Architektur, die noch heute für Baustoffe gelten: Firmitas (Festigkeit), Utilitas (Gebrauchstauglichkeit) und Venustas (Schönheit).',
        'Dokumentierte die Herstellung wasserbeständiger Mörtel und Hafenbauten durch Beimischen von Vulkanerde aus der Gegend von Baiae und Puteoli (Pozzuoli).'
      ],
      quote: '„Es gibt auch eine Art Staub, der von Natur aus wunderbare Wirkungen hervorbringt. Er findet sich in der Gegend von Baiae und im Gebiet der Gemeinden rings um den Vesuv.“ (De architectura II, 6, 1; sinngemäße Übersetzung)'
    },
    {
      id: 'aspdin',
      name: 'Joseph Aspdin',
      lifespan: '1778 – 1855',
      role: 'Britischer Maurer & Erfinder',
      field: 'Erfindung des Portlandzements (OPC)',
      origin: 'Großbritannien (Leeds)',
      contribution: 'Erhielt am 21. Oktober 1824 das britische Patent Nr. 5022 für einen künstlichen Stein bzw. Zement, den er „Portland Cement“ nannte. Gebrannt wurde eine Mischung aus Kalkstein und Ton. Aspdins Brenntemperaturen lagen aber unter der Sintergrenze – sein Produkt entsprach eher einem hydraulischen Kalk. Den gesinterten, im heutigen Sinn echten Portlandzement stellte erst Isaac Charles Johnson um 1844 her.',
      achievements: [
        'Gründete Zementwerke in Wakefield; sein Sohn William Aspdin trug wesentlich zur Weiterentwicklung und Verbreitung bei.',
        'Wählte den werbewirksamen Namen „Portland Cement“, weil das erhärtete Material farblich dem geschätzten Portland-Kalkstein von der Isle of Portland ähnelte.'
      ],
      quote: '„Mein Verfahren zur Herstellung eines Zements oder künstlichen Steins … den ich Portland Cement nenne, ist wie folgt …“ (Patentschrift Nr. 5022, 1824; sinngemäße Übersetzung)'
    },
    {
      id: 'vicat',
      name: 'Louis-Joseph Vicat',
      lifespan: '1786 – 1861',
      role: 'Französischer Bauingenieur & Forscher',
      field: 'Hydraulizitätstheorie & standardisierte Zementprüfung',
      origin: 'Frankreich (Grenoble)',
      contribution: 'Untersuchte systematisch die Hydraulizität (Erhärtung unter Wasser) von Kalken und zeigte, dass sie auf dem Tongehalt beruht. Nach ihm ist das Nadelgerät benannt, mit dem bis heute Erstarrungsbeginn und -ende von Zementleim bestimmt werden (DIN EN 196-3).',
      achievements: [
        'Veröffentlichte 1818 seine Untersuchungen zur Herstellung künstlicher hydraulischer Kalke aus Kalkstein und Ton und verzichtete auf ein Patent.',
        'Ordnete Kalke nach ihrem Tongehalt in Gruppen schwach bis stark hydraulisch – Grundlage des später so genannten Hydraulizitätsindex (Verhältnis der Säure- zu den Basenanteilen).'
      ],
      quote: 'Kernaussage (Zusammenfassung, kein Originalzitat): Die Wasserbeständigkeit eines Kalks ist keine Eigenschaft geheimnisvoller Rohstoffe, sondern lässt sich über den Tonanteil gezielt einstellen.'
    },
    {
      id: 'monier',
      name: 'Joseph Monier',
      lifespan: '1823 – 1906',
      role: 'Französischer Gärtner & Erfinder',
      field: 'Erfindung des Verbundbaus (Eisen-/Stahlbeton)',
      origin: 'Frankreich (Saint-Quentin-la-Poterie, Gard)',
      contribution: 'Stellte als Pariser Gärtner Pflanzkübel aus Zementmörtel mit Einlagen aus Eisendraht her und erhielt dafür 1867 ein erstes Patent. Er war nicht der Erste (u. a. Lambot 1848, Wilkinson 1854), aber seine Patente wurden zum Ausgangspunkt der industriellen Verbreitung des Eisenbetons.',
      achievements: [
        'Erweiterte seine Patente bis 1878 auf Rohre, Behälter, Platten, Treppen und Brücken.',
        'Sein Name ging in den Bauwortschatz ein („Moniereisen“ als historische Bezeichnung für Betonstahl, „Monierbau“).'
      ],
      quote: 'Kernaussage (Zusammenfassung, kein Originalzitat): Monier bewehrte nach praktischer Erfahrung, nicht nach Berechnung – die Lage der Eisen entsprach anfangs oft nicht der Zugzone.'
    },
    {
      id: 'wayss_freytag',
      name: 'Freytag & Wayss (Das System Monier)',
      lifespan: 'Conrad Freytag (1846–1921) | Gustav Wayss (1851–1917)',
      role: 'Deutsche Bauunternehmer & Bautechnik-Pioniere',
      field: 'Wissenschaftliche Validierung des Stahlbetonprinzips',
      origin: 'Deutschland (Neustadt/Weinstraße & Berlin)',
      contribution: 'Gustav Adolf Wayss erwarb 1885 die Monier-Patente für Deutschland; Conrad Freytag (Freytag & Heidschuch) beteiligte sich an der Verwertung. Sie ließen Belastungsversuche durchführen und förderten die erste Berechnungstheorie.',
      achievements: [
        'Aus der Zusammenarbeit ging die Bauunternehmung Wayss & Freytag hervor, über Jahrzehnte eine der führenden Firmen des Betonbaus.',
        'Gaben 1887 die Schrift „Das System Monier“ heraus; sie enthielt die von Regierungsbaumeister Matthias Koenen 1886 aufgestellte erste Bemessungsmethode für Monierplatten.'
      ],
      quote: 'Kernaussage (Zusammenfassung, kein Originalzitat): Das Eisen gehört in die Zugzone – Beton übernimmt den Druck, der Stahl den Zug; nur über den Verbund wirken beide zusammen.'
    },
    {
      id: 'moersch',
      name: 'Prof. Dr.-Ing. E.h. Emil Mörsch',
      lifespan: '1872 – 1950',
      role: 'Bauingenieur & Hochschulprofessor',
      field: 'Theorie des Massivbaus & Schubbemessung',
      origin: 'Deutschland (Reutlingen / Stuttgart)',
      contribution: 'Gilt als einer der Begründer der wissenschaftlichen Stahlbetontheorie. Er baute das von Wilhelm Ritter (1899) vorgeschlagene Fachwerkmodell für die Querkraft aus – bis heute als Ritter-Mörsch-Fachwerk Grundlage der Querkraftbemessung.',
      achievements: [
        'Formulierte die Berechnungsverfahren für den gerissenen Zustand II unter Einbeziehung des Elastizitätsbeiwertes n.',
        'Verfasste das epochale, über Jahrzehnte führende Standardwerk „Der Eisenbetonbau – Seine Theorie und Anwendung“ ab der Erstauflage 1902.'
      ],
      quote: 'Kernaussage (Zusammenfassung, kein Originalzitat): Bemessung folgt dem Kraftfluss – Druckstreben im Beton, Zugstreben im Stahl.'
    },
    {
      id: 'powers',
      name: 'Treval C. Powers',
      lifespan: '1900 – 1997',
      role: 'US-amerikanischer Werkstoffwissenschaftler',
      field: 'Portlandzement-Mikrostruktur & Gel-Poren-Modell',
      origin: 'USA (Chicago / Portland Cement Association)',
      contribution: 'Entwickelte mit T. L. Brownyard (1946/47) das Modell des Zementsteins aus Zementgel, Gelporen und Kapillarporen. Daraus folgen der Hydratationsgrad, der Kapillarporenraum in Abhängigkeit vom w/z-Wert und das Gel-Raum-Verhältnis als Festigkeitsmaß.',
      achievements: [
        'Zeigte, dass das Hydratationsprodukt (C-S-H-Gel, weitgehend nanokristallin bis amorph) selbst rund 28 % Gelporen enthält und dass bei w/z > ca. 0,4 auch bei vollständiger Hydratation Kapillarporen verbleiben.',
        'Begründete die Mechanismen des Frostschadens in Beton (hydraulischer Druck) und die Bemessung von Luftporen über den Abstandsfaktor.'
      ],
      quote: 'Kernaussage (Zusammenfassung, kein Originalzitat): Die Festigkeit des Zementsteins hängt vom Gel-Raum-Verhältnis ab – also davon, wie viel des verfügbaren Raums mit Hydratationsprodukten gefüllt ist.'
    }
  ];

  // Material classification data
  const materialClasses: MaterialClass[] = [
    {
      id: 'mineralisch',
      name: 'Anorganisch-Mineralische Baustoffe',
      icon: <Layers size={18} />,
      bgClass: 'bg-emerald-50/55 hover:bg-emerald-50/80',
      borderClass: 'border-emerald-200',
      textClass: 'text-emerald-800',
      description: 'Gekennzeichnet durch ionische oder kovalente Bindungen und kristalline bis amorphe Phasen. Dies sind die volumetrisch am meisten verwendeten Baustoffe im globalen Bauwesen.',
      subclasses: [
        'Natursteine (Granit, Kalkstein, Sandstein)',
        'Natürliche und künstliche Gesteinskörnungen',
        'Anorganische Bindemittel (Zement, Baukalk, Gips)',
        'Mörtel, mineralischer Putz und Estrich',
        'Gebrannte Tonkeramik (Ziegel, Klinker)',
        'Beton (Normalbeton, Porenbeton, Leichtbeton)'
      ],
      keyAttributes: [
        { name: 'Druckfestigkeit', value: 'Sehr hoch (bis > 150 MPa bei UHPC)' },
        { name: 'Zugfestigkeit', value: 'Gering (Beton: ca. 7–10 % der Druckfestigkeit)' },
        { name: 'Thermisches Verhalten', value: 'Hervorragende Feuerbeständigkeit, nicht brennbar (A1)' },
        { name: 'Rohdichte', value: 'Von ca. 300 kg/m³ (Porenbeton) bis ca. 2800 kg/m³ (Naturstein)' }
      ],
      appLinkTab: 'gesteine',
      appLinkName: 'Gesteine, Mauerwerk & Beton'
    },
    {
      id: 'metallisch',
      name: 'Anorganisch-Metallische Baustoffe',
      icon: <Construction size={18} />,
      bgClass: 'bg-blue-50/55 hover:bg-blue-50/80',
      borderClass: 'border-blue-200',
      textClass: 'text-blue-800',
      description: 'Aufgebaut aus metallischen Bindungen (Elektronengaswolke), was ihnen hohe Zähigkeit, Duktilität und hervorragende elektrische sowie thermische Leitfähigkeit verleiht.',
      subclasses: [
        'Baustähle (z. B. S235, S355 für den Stahlbau)',
        'Betonstahl (Rippenstahl B500B zur Zugbewehrung)',
        'Edelstahl (nichtrostende Legierungen im Fassadenbereich)',
        'Gusseisen (historische Träger, Abwasserrohre)',
        'Nichteisenmetalle (Aluminium, Kupfer, Zink)'
      ],
      keyAttributes: [
        { name: 'Festigkeit', value: 'Hoch in Zug und Druck (Streckgrenze ca. 160 MPa bei Aluminium bis Zugfestigkeit 1860 MPa bei Spannstahl)' },
        { name: 'Verhalten', value: 'Plastisch verformbar (duktil), ausgeprägtes Fließverhalten' },
        { name: 'Korrosion', value: 'Unlegierter Stahl rostet ohne Schutz; Zink, Kupfer, Aluminium bilden Deckschichten' },
        { name: 'Rohdichte', value: 'Hoch (Stahl ca. 7850 kg/m³, Aluminium ca. 2700 kg/m³)' }
      ],
      appLinkTab: 'metalle',
      appLinkName: 'Metalle & Tragverhalten'
    },
    {
      id: 'organisch',
      name: 'Organische & Biogene Baustoffe',
      icon: <TreePine size={18} />,
      bgClass: 'bg-amber-50/55 hover:bg-amber-50/80',
      borderClass: 'border-amber-200',
      textClass: 'text-amber-800',
      description: 'Nachwachsende organische Werkstoffe aus der Biosphäre, primär aufgebaut aus Cellulose, Hemicellulose und Lignin. Sie binden im Wachstum CO₂.',
      subclasses: [
        'Vollholz (Nadel- und Laubholz als Konstruktionsholz)',
        'Holzwerkstoffe (Brettschichtholz BSH, Brettsperrholz BSP, OSB)',
        'Natürliche Dämmstoffe (Holzfaser, Zellulose, Hanf, Stroh)',
        'Lehm-Holz-Verbunde (historischer Fachwerkbau)',
        'Biokunststoffe und bio-basierte Bindemittel'
      ],
      keyAttributes: [
        { name: 'Anisotropie', value: 'Richtungsabhängige Kennwerte (faserparallel vs. faserquer)' },
        { name: 'Treibhauspotenzial', value: 'Biogener Kohlenstoff wird in Modul A1 negativ bilanziert und am Lebensende (Modul C) wieder ausgewiesen – Holz ist ein temporärer Kohlenstoffspeicher' },
        { name: 'Dauerhaftigkeit', value: 'Risiko von Pilz- und Insektenbefall bei Feuchteeinwirkung' },
        { name: 'Rohdichte', value: 'Gering (ca. 400 - 800 kg/m³ für Holz)' }
      ],
      appLinkTab: 'holz_werkstoffe',
      appLinkName: 'Holz & Nachwachsende Rohstoffe'
    },
    {
      id: 'polymere',
      name: 'Synthetische Polymere & Bitumen',
      icon: <Zap size={18} />,
      bgClass: 'bg-indigo-50/55 hover:bg-indigo-50/80',
      borderClass: 'border-indigo-200',
      textClass: 'text-indigo-800',
      description: 'Riesenmoleküle (Makromoleküle) aus kovalent gebundenen Kohlenstoffketten. Man unterscheidet Thermoplaste, Duroplaste und Elastomere sowie viskoelastische Naturstoffe wie Bitumen.',
      subclasses: [
        'Kunststoff-Dämmstoffe (Expandiertes Polystyrol EPS, Polyurethan PUR)',
        'Folien, Dampfbremsen, Kunststoff-Abdichtungsbahnen und Geokunststoffe',
        'Fassadenbekleidungen und Rohrleitungssysteme (PVC, PE, PP)',
        'Bautenklebstoffe, Kunstharze und Versiegelungen',
        'Bitumen und polymer-modifiziertes Bitumen im Straßen- & Dachbau'
      ],
      keyAttributes: [
        { name: 'Gewicht', value: 'Sehr leicht (z.B. EPS ca. 15 - 30 kg/m³)' },
        { name: 'Dämmeigenschaften', value: 'Sehr niedrige Wärmeleitfähigkeit (ca. 0,022–0,040 W/(m·K))' },
        { name: 'Kriechneigung', value: 'Hoch viskoelastisch unter Dauerlasten' },
        { name: 'Brandschutz', value: 'Brennbar (z. B. EPS meist Klasse E nach DIN EN 13501-1 bzw. B1/B2 nach DIN 4102-1), Rauchentwicklung' }
      ],
      appLinkTab: 'daemmstoffe',
      appLinkName: 'Dämmstoffe & Baupolymere'
    },
    {
      id: 'verbund',
      name: 'Moderne Verbundwerkstoffe',
      icon: <Hammer size={18} />,
      bgClass: 'bg-rose-50/55 hover:bg-rose-50/80',
      borderClass: 'border-rose-200',
      textClass: 'text-rose-800',
      description: 'Makroskopischer Verbund von mindestens zwei distinkten Stoffklassen, um synergistische Wirkungen zu erzielen. Ziel ist meist die Kompensation einer Zugschwäche durch faserige o. metallische Einlagen.',
      subclasses: [
        'Klassischer Stahlbeton (Beton trägt Druck, Bewehrungsstahl zieht)',
        'Stahlfaserbeton und makrosynthetische Faserbetone',
        'Zukunftsweisender Carbonbeton (korrosionsfreie Carbonbewehrung)',
        'Glasfaserverstärkte Kunststoffe (GFK) für Konsolen und Brückenträger',
        'Faserzementplatten (bis zum Verbot 1993 Asbestzement, heute mit Kunststoff- und Zellulosefasern)'
      ],
      keyAttributes: [
        { name: 'Verbundwirkung', value: 'Kraftübertragung über Haft-, Scher- und Reibeverbund' },
        { name: 'Dauerhaftigkeit', value: 'Karbonatisierung des Betons gefährdet Stahl, nicht Carbon' },
        { name: 'Ressourceneinsatz', value: 'Hoher CO₂-Impact, aber extreme Materialeinsparung möglich (Carbon)' },
        { name: 'Dicke/Überdeckung', value: 'Erheblich reduzierbar bei korrosionsfreien Bewehrungen' }
      ],
      appLinkTab: 'faserverbund',
      appLinkName: 'Faser- & Carbonverbund'
    }
  ];

  // History periods timelines
  const historicalPeriods: HistoricalPeriod[] = [
    {
      era: 'Prähistorie (~ bis 3000 v. Chr.)',
      century: 'Stein- & Bronzezeit',
      title: 'Die Ära der Naturstoffe',
      description: 'Konstruktionen erfolgten rein mit den am Fundort verfügbaren Materialien. Mechanische Bearbeitung war rudimentär, Haltbarkeit basierte auf konstruktivem Schutz.',
      icon: <TreePine className="text-amber-700 font-bold" size={20} />,
      materials: ['Lehm / Stampflehm', 'Naturstein trocken', 'Schilf & Stroh', 'Rundholz'],
      milestone: 'Luftgetrocknete Lehmziegel; ab dem 4./3. Jahrtausend v. Chr. gebrannte Ziegel im Vorderen Orient – der Beginn der thermischen Baustoffveredelung.',
      details: 'Die ersten Behausungen nutzten Astwerke, Tierhäute und unverfestigten Lehm. Der konstruktive Holzbau entwickelte sich im Pfahlbau. Haltbarkeit war primär ein Problem biotischer Verrottung.'
    },
    {
      era: 'Antike (~ 300 v. Chr. – 400 n. Chr.)',
      century: 'Römisches Reich',
      title: 'Die Erfindung des "Opus Caementicium"',
      description: 'Die Römer prägten die Baukunst durch die Entwicklung des ersten echten hydraulischen Betons. Dies erlaubte weite Bögen, Gewölbekuppeln und Unterwasserbauten.',
      icon: <Landmark className="text-indigo-700" size={20} />,
      materials: ['Römischer Beton (Opus Caementicium)', 'Puzzolanasche (Vulkanerde)', 'Luftkalk-Mörtel', 'Puzzolanische Ziegelmehle'],
      milestone: 'Kuppel des Pantheons in Rom (um 125 n. Chr. vollendet, 43,3 m Durchmesser aus unbewehrtem Gussbeton mit nach oben leichter werdenden Zuschlägen).',
      details: 'Das Opus Caementicium bestand aus gebranntem Kalkstein gebunden mit reaktivem Gesteinsmehl aus vulkanischen Regionen (Pozzuoli bei Neapel). Der Clou: Diese Puzzolane enthalten reaktive Kieselsäure und Tonerde, wodurch der Mörtel im Gegensatz zu reinem Luftkalk auch unter Luftabschluss und sogar unter Wasser steinhart hydratisiert.'
    },
    {
      era: 'Mittelalter & Renaissance (ca. 500 – 1750)',
      century: '5. - 18. Jahrhundert',
      title: 'Zunftwesen und handwerkliches Erfahrungswissen',
      description: 'Nach dem Fall Roms geriet das Geheimnis des hydraulischen Zements weitgehend in Vergessenheit. Man baute mit massiven Schwerkraftkonstruktionen aus Naturstein und hochentwickeltem Fachwerk.',
      icon: <Hammer className="text-slate-600" size={20} />,
      materials: ['Sanfte Luftkalke', 'Gipsmörtel', 'Eichen- und Tannenholz', 'Handgestrichene Ziegel'],
      milestone: 'Konstruktion gotischer Kathedralen mit filigranen Rippengewölben, Strebepfeilern und meisterhaften hölzernen Dachstühlen.',
      details: 'Fachwerkbauten dominierten die mitteleuropäischen Städte. Luftkalkmörtel erhärtete überwiegend durch Karbonatisierung (CO₂-Aufnahme), was in dicken Wänden Jahrzehnte dauern konnte; Ziegelmehl- oder Trasszusätze machten manche Mörtel hydraulisch. Gotische Baumeister sicherten die Standsicherheit rein empirisch über geometrische Verhältnisregeln.'
    },
    {
      era: 'Industrielle Revolution (19. Jahrhundert)',
      century: '1800 - 1899',
      title: 'Das Patent von Portlandzement & Stahlbeton',
      description: 'Mit dem Beginn der Industrialisierung und der Chemie als exakte Wissenschaft wurden Baustoffe standardisiert, künstlich synthetisiert und maschinell geprüft.',
      icon: <Zap className="text-amber-500" size={20} />,
      materials: ['Portlandzement (OPC)', 'Schmiedeeisen / Gusseisen', 'Frühformen des Flussstahls', 'Eisenbeton nach J. Monier'],
      milestone: '1824 patentiert Joseph Aspdin seinen „Portland Cement“; um 1844 gelingt I. C. Johnson der gesinterte Portlandzement. 1886 stellt Matthias Koenen die erste Bemessungsmethode für Eisenbeton auf.',
      details: 'Durch extrem hohes Brennen von Kalkstein- und Tonmischungen bis zur Sintergrenze (~1450 °C) entstand der Portlandzementklinker mit den hydraulischen Hauptphasen Alit und Belit. Um 1867 meldet der Gärtner Joseph Monier eiserne Einlagen in Pflanzenkübeln aus Zementmörtel als Patent an ("Monier-Eisen"). Glückliche Voraussetzung: Beton und Stahl dehnen sich bei Temperaturänderung nahezu gleich (Beton α ≈ 1,0 · 10⁻⁵ 1/K, Stahl α ≈ 1,2 · 10⁻⁵ 1/K), und das alkalische Milieu des Betons schützt den Stahl vor Korrosion.'
    },
    {
      era: 'Moderne (20. Jahrhundert)',
      century: '1900 - 1999',
      title: 'Hochleistungsbaustoffe und Normierung',
      description: 'Das Jahrhundert des uneingeschränkten Betonbooms. Erforschung der Zementchemie führte zu ultra-festen Werkstoffen, Spannstählen und synthetischen Polymerdämmstoffen.',
      icon: <GraduationCap className="text-blue-600" size={20} />,
      materials: ['Hochleistungsbeton (z. B. UHPC)', 'Spannstahl', 'Polystyrol (EPS/XPS)', 'Bewehrungsstahl B500B', 'Floatglas'],
      milestone: 'Bau weitgespannter Spannbetonbrücken und Hochhäuser. Übergang vom globalen Sicherheitsbeiwert zum Teilsicherheitskonzept (Eurocodes; in Deutschland bauaufsichtlich eingeführt ab 2012).',
      details: 'Mit Fließmitteln (Polycarboxylatether, PCE) und reaktiven Feinststoffen (Silicastaub) gelingt es, den Wasserzementwert (w/z-Wert) auf unter 0,25 zu senken, was zu Ultra-Hochleistungsbetonen (UHPC) mit Druckfestigkeiten von weit über 150 MPa führt. Dämmstoffe aus Mineralwolle und Polystyrol verändern den winterlichen Wärmeschutz.'
    },
    {
      era: 'Anthropozän & Zukunft (21. Jahrhundert)',
      century: 'Seit 2000',
      title: 'Dekarbonisierung, zirkuläres Bauen',
      description: 'Bau und Betrieb von Gebäuden verursachen nach UNEP-Angaben rund 37 % der energiebedingten CO₂-Emissionen weltweit. Der Fokus schwenkt radikal von rein mechanischer Festigkeit zu Nachhaltigkeit, CO₂-Einbindung und Materialkreisläufen.',
      icon: <ShieldCheck className="text-emerald-600 font-bold" size={20} />,
      materials: ['Carbonbeton (korrosionsfrei)', 'Zemente mit Klinkerersatzstoffen (LC3)', 'Rezyklat-Beton (RC-Gestein)', 'Pflanzenkohle-Beton', 'Ingenieurholz-Produkte'],
      milestone: 'Erstes Carbonbetongebäude („CUBE“, TU Dresden, eröffnet 2022) ohne Stahlkorrosionsgefahr. Digitaler Produktpass für Bauprodukte mit der neuen Bauproduktenverordnung (EU) 2024/3110.',
      details: 'Die CO₂-neutrale Baustoffkunde ersetzt herkömmlichen Klinker durch calcinierten Ton und Kalksteinmehl (LC3-Zement). Pflanzenkohle wird als dauerhafter Kohlenstoffspeicher in Beton eingebunden (Kohlenstoff-Senke). Korrosionsfreie Carbonbewehrungen erlauben sehr geringe Betondeckungen und damit deutlich schlankere, leichtere Bauteile.'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* 1. MODULE MAIN CARD IN ACCORDANCE WITH THE STYLEGUIDE */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <BookOpen className="text-shiraz" /> Baustoffkunde
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 mt-4">
          <p>
            Die wissenschaftliche Lehre von den inneren Strukturen, physikalisch-chemischen Mechanismen, 
            Klassifizierungen und historischen Entwicklungen unserer Bauwerkstoffe – das Fundament jeder baukonstruktiven Praxis.
          </p>
        </div>

        {/* Pure styling tab navigation to match Kalk.tsx */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'systematik' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('systematik')}
          >
            <Layers size={16} /> Systematik &amp; Fachordnung
          </button>
          
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'historie' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('historie')}
          >
            <Clock size={16} /> Historische Entwicklung
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'pioniere' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('pioniere')}
          >
            <Users size={16} /> Bedeutende Pioniere
          </button>
        </div>

        {/* 2. DYNAMIC CONTENT AREA BASED ON TAB */}
        
        {activeTab === 'systematik' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Big Concept Intro Card */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-text-main flex items-center gap-2 mb-2 font-mono">
                <GraduationCap className="text-shiraz" size={16} /> Was untersucht die Baustoffkunde?
              </h2>
              <p className="text-xs text-text-main/80 leading-relaxed max-w-4xl">
                Das Fachgebiet verknüpft die <strong>Naturwissenschaften (Physik, Chemie, Geologie)</strong> mit dem 
                praktischen <strong>Konstruktiven Ingenieurbau</strong>. Baustoffe werden nicht isoliert betrachtet, sondern 
                entlang des Beziehungsdreiecks <strong>Struktur (Mikrostruktur, Poren) ➔ Stoffeigenschaften (Makroebene) ➔ Dauerhaftigkeit / Ökologie</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                <div className="p-3.5 bg-off-white border border-home-grau/20 rounded-xl space-y-1">
                  <span className="text-[10px] font-extrabold text-[#A3113E] uppercase tracking-wider block font-mono">1. Physikalische Kriterien</span>
                  <p className="text-[10.5px] text-text-main/70 leading-relaxed">
                    Porengrößenverteilung, Roh- und Reindichte, thermische Dehnung, Feuchte- und Gastransportvorgänge im Festkörper.
                  </p>
                </div>
                <div className="p-3.5 bg-off-white border border-home-grau/20 rounded-xl space-y-1">
                  <span className="text-[10px] font-extrabold text-[#A3113E] uppercase tracking-wider block font-mono">2. Mechanische Parameter</span>
                  <p className="text-[10.5px] text-text-main/70 leading-relaxed">
                    Zusammenhang zwischen Belastungsrichtung, Spannungen, elastischer/plastischer Verformung, Zähigkeit, Ermüdung und E-Modul.
                  </p>
                </div>
                <div className="p-3.5 bg-off-white border border-home-grau/20 rounded-xl space-y-1">
                  <span className="text-[10px] font-extrabold text-[#A3113E] uppercase tracking-wider block font-mono">3. Chemische Einflüsse</span>
                  <p className="text-[10.5px] text-text-main/70 leading-relaxed">
                    Hydratationsreaktionen von anorganischen Bindemitteln, Karbonatisierung von Zementstein, Schadsalzbildung und pH-Stabilität.
                  </p>
                </div>
                <div className="p-3.5 bg-off-white border border-home-grau/20 rounded-xl space-y-1">
                  <span className="text-[10px] font-extrabold text-[#A3113E] uppercase tracking-wider block font-mono">4. Ökologische Bilanz</span>
                  <p className="text-[10.5px] text-text-main/70 leading-relaxed">
                    EPDs, Primärenergiegehalt, Klinker-Zusatzstoffe, Bio-Stoffkreisläufe, Schadstoffgehalt, Recyclingfähigkeit und Recyklatverwertung.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Classes Explorer layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Left Column: List of Classes selector */}
              <div className="lg:col-span-5 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#A3113E] font-mono mb-1 ml-1 block">
                  Stoffgruppen-Systematik
                </span>
                {materialClasses.map((item) => {
                  const isActive = selectedClass === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedClass(item.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                        isActive 
                          ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/10'
                          : 'border-home-grau/30 bg-white hover:border-home-grau/50 hover:bg-off-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border transition-transform group-hover:scale-105 ${
                          isActive
                            ? 'bg-shiraz text-white border-shiraz'
                            : 'bg-off-white text-text-main border-home-grau/30'
                        }`}>
                          {item.icon}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-text-main block leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[9px] text-text-main/70 block mt-0.5 font-sans font-normal leading-tight">
                            {item.subclasses.length} bedeutende Untergruppen
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={14} className={`text-text-main/50 transition-transform ${
                        isActive ? 'translate-x-1 text-shiraz' : 'group-hover:translate-x-0.5'
                      }`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Deep-Dive View */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                {(() => {
                  const item = materialClasses.find(c => c.id === selectedClass)!;
                  return (
                    <div className="space-y-4 h-full flex flex-col justify-between">
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-home-grau/20">
                          <div className="p-2 rounded-xl bg-off-white text-text-main border border-home-grau/30">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-text-main leading-none">{item.name}</h3>
                            <span className="text-[9.5px] font-mono text-shiraz font-bold block mt-1">Stoffklasse-DeepDive</span>
                          </div>
                        </div>

                        <p className="text-xs text-text-main/80 bg-off-white p-3 rounded-lg border border-home-grau/20 italic">
                          "{item.description}"
                        </p>

                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-text-main/50 block font-mono">Wichtigste Unterklassen &amp; Beispiele:</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {item.subclasses.map((sub, sIdx) => (
                              <div key={sIdx} className="text-xs text-text-main/80 flex items-center gap-2 bg-off-white p-2 rounded-lg hover:bg-slate-100/40 border border-home-grau/20 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-shiraz shrink-0"></span>
                                <span className="truncate">{sub}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-text-main/50 block font-mono">Typische Material-Eigenschaften:</span>
                          <div className="grid grid-cols-2 gap-2">
                            {item.keyAttributes.map((attr, aIdx) => (
                              <div key={aIdx} className="bg-[#fcf8f2] p-2.5 rounded-lg border border-home-grau/25 space-y-0.5">
                                <span className="text-[9.5px] text-text-main/60 font-extrabold uppercase tracking-tight block font-mono leading-none">{attr.name}</span>
                                <span className="text-xs text-text-main block font-bold mt-1 font-sans">{attr.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-home-grau/20 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] bg-off-white/50 -mx-5 -mb-5 p-4 rounded-b-2xl border-t border-home-grau/20">
                        <div className="flex items-center gap-1.5 text-text-main/70">
                          <AlertCircle size={13} className="text-text-main/50 shrink-0" />
                          <span>Verfügbar in den Rechnern des Portals.</span>
                        </div>
                        <span className="text-shiraz font-bold font-mono tracking-wide bg-shiraz/5 px-2 py-1 rounded inline-flex items-center gap-1 border border-shiraz/10">
                          Sektion: {item.appLinkName}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Hierarchy of Materials Science Diagram (Bento Element) */}
            <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#A3113E] font-mono mb-2">
                Das Skalen-Prinzip in der Baustoffkunde
              </h3>
              <p className="text-xs text-text-main/80 mb-4 max-w-3xl leading-relaxed">
                Die Eigenschaften, die wir auf der Baustelle messen (z.B. Druckfestigkeit oder Wärmeleitfähigkeit), werden vollständig auf kleineren physikalischen Skalen bestimmt. Die Baustoffkunde schränkt die Lupe stufenweise ein:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 hover:shadow-sm transition-shadow">
                  <span className="text-[9px] font-extrabold text-[#A3113E] font-mono tracking-widest uppercase block mb-1">1. Makrokosmos (Bauteil)</span>
                  <span className="text-xs font-bold text-text-main block mt-1">Träger, Wand, Brücke</span>
                  <span className="text-[10px] text-text-main/70 block mt-1 font-sans">Abmessungen in Metern. Sichtbare Rissbildung, Durchbiegung, Belastungen, Verformung.</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 hover:shadow-sm transition-shadow">
                  <span className="text-[9px] font-extrabold text-[#A3113E] font-mono tracking-widest uppercase block mb-1">2. Mesokosmos (Gefüge)</span>
                  <span className="text-xs font-bold text-text-main block mt-1">Zuschlag &amp; Zementstein</span>
                  <span className="text-[10px] text-text-main/70 block mt-1 font-sans">Millimeter bis Mikrometer. Haftverbundzone (ITZ), Kapillarporennetz, Mikrorisse, Sandkörner.</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 hover:shadow-sm transition-shadow">
                  <span className="text-[9px] font-extrabold text-[#A3113E] font-mono tracking-widest uppercase block mb-1">3. Mikrokosmos (Kristall)</span>
                  <span className="text-xs font-bold text-text-main block mt-1">CSH-Gele, Ettringit</span>
                  <span className="text-[10px] text-text-main/70 block mt-1 font-sans">Nanometer-Bereich. Kristalline Platten, Gelporen, Schichtstrukturen der Hydratphasen.</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 hover:shadow-sm transition-shadow">
                  <span className="text-[9px] font-extrabold text-[#A3113E] font-mono tracking-widest uppercase block mb-1">4. Sub-Mikro (Atomar)</span>
                  <span className="text-xs font-bold text-text-main block mt-1">Ionen, Atombindung</span>
                  <span className="text-[10px] text-text-main/70 block mt-1 font-sans">Angström-Bereich. Kovalente, metallische und Van-der-Waals-Bindungskräfte.</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'historie' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* History Intro */}
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2 flex items-center gap-2">
                <Clock size={18} /> Geschichtlicher Aufriss der Werkstoffevolution
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed max-w-4xl">
                Die Geschichte des Bauens ist untrennbar mit der Entdeckung und Beherrschung neuer Baustoffe verknüpft. Jede tektonische Epoche wurde durch veränderte stoffchemische und mechanische Möglichkeiten definiert – vom unbewehrten Monument der Antike bis zum hochgradig ressourcen-optimierten und digitalisierten Bauteil der Gegenwart. Wählen Sie unten eine Epoche aus.
              </p>
            </div>

            {/* Interactive Timeline layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left selector - Era names */}
              <div className="lg:col-span-4 space-y-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#A3113E] font-mono mb-1 ml-1 block">
                  Epochenauswahl
                </span>
                {historicalPeriods.map((p, idx) => {
                  const isActive = timelineEra === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setTimelineEra(idx)}
                      className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col ${
                        isActive
                          ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/10'
                          : 'border-home-grau/30 bg-white hover:border-home-grau/55 hover:bg-off-white'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[9px] font-black uppercase tracking-wider font-mono text-shiraz">
                          {p.century}
                        </span>
                        {isActive && <span className="text-[9px] bg-shiraz text-white rounded px-1 font-extrabold">Aktiv</span>}
                      </div>
                      <span className="text-xs font-extrabold text-text-main mt-1 block">
                        {p.era}
                      </span>
                      <span className="text-[10px] text-text-main/70 block truncate mt-0.5 leading-tight">
                        {p.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Display area - selected Period Details */}
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-5">
                {(() => {
                  const p = historicalPeriods[timelineEra];
                  return (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-start justify-between border-b border-home-grau/20 pb-3 gap-2">
                        <div className="space-y-1">
                          <span className="text-[9.5px] uppercase font-black tracking-widest text-shiraz font-mono block">
                            {p.century}
                          </span>
                          <h3 className="text-base font-extrabold text-text-main mt-1 leading-tight">{p.era}</h3>
                          <span className="text-xs text-text-main/70 font-medium block italic">{p.title}</span>
                        </div>
                        <div className="p-3 bg-off-white border border-home-grau/30 rounded-2xl shrink-0 text-text-main shadow-xs">
                          {p.icon}
                        </div>
                      </div>

                      <p className="text-xs text-text-main/80 leading-relaxed font-sans mt-2">
                        {p.details}
                      </p>

                      {/* Timeline Materials Chips */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-text-main/55 block font-mono">Prägende Materialien dieser Epoche:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {p.materials.map((mat, mIdx) => (
                            <span key={mIdx} className="bg-off-white border border-home-grau/30 text-text-main text-[10.5px] font-bold px-2.5 py-1 rounded-lg shadow-xxs">
                              🧱 {mat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Milestone Highlights banner */}
                      <div className="bg-shiraz/5 border border-shiraz/20 p-4 rounded-xl flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-shiraz/10 border border-shiraz/30 text-shiraz mt-0.5">
                          <ShieldCheck size={14} />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black uppercase text-shiraz block font-mono">Schlüssel-Meilenstein :</span>
                          <p className="text-xs text-text-main font-semibold leading-relaxed font-sans">{p.milestone}</p>
                        </div>
                      </div>

                      <div className="bg-[#fcf8f2] p-3.5 rounded-xl border border-home-grau/35">
                        <span className="text-[9.5px] font-bold uppercase tracking-wide text-text-main/70 block font-mono">Bedeutung für die Baustoffkunde heute :</span>
                        <p className="text-[11px] text-text-main/80 leading-relaxed mt-1 font-sans font-normal">{p.description}</p>
                      </div>

                    </div>
                  );
                })()}
              </div>

            </div>

          </div>
        )}

        {activeTab === 'pioniere' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Pioniere Intro */}
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2 flex items-center gap-2">
                <Users size={18} /> Wegbereiter &amp; Väter der Werkstoffwissenschaft
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed max-w-4xl">
                Hinter jedem modernen Hochleistungsbaustoff stehen Forschergeist, beharrliche Experimente und wichtige Entdeckungen. Diese Pioniere haben die Brücke zwischen geologischem Vorkommen, chemischer Synthese und mathematischer Tragwerkslehre geschlagen. Wählen Sie eine Person aus, um ihren Beitrag kennenzulernen.
              </p>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Left side: List of Pioneers */}
              <div className="lg:col-span-5 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#A3113E] font-mono mb-1 ml-1 block">
                  Pionier-Verzeichnis
                </span>
                <div className="space-y-2">
                  {pioneers.map((p) => {
                    const isActive = selectedPioneer === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPioneer(p.id)}
                        className={`w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                          isActive
                            ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/10'
                            : 'border-home-grau/30 bg-white hover:border-home-grau/50 hover:bg-off-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border transition-transform group-hover:scale-105 ${
                            isActive
                              ? 'bg-shiraz text-white border-shiraz'
                              : 'bg-off-white text-text-main border-home-grau/30'
                          }`}>
                            <User size={16} />
                          </div>
                          <div>
                            <span className="text-xs font-black text-text-main block leading-tight">
                              {p.name}
                            </span>
                            <span className="text-[9.5px] text-text-main/70 block mt-0.5 leading-tight">
                              {p.lifespan} • {p.origin}
                            </span>
                          </div>
                        </div>
                        <ArrowRight size={13} className={`text-text-main/50 transition-transform ${
                          isActive ? 'translate-x-1 text-shiraz' : 'group-hover:translate-x-0.5'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right side: Detailed Showcase */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                {(() => {
                  const p = pioneers.find(item => item.id === selectedPioneer)!;
                  return (
                    <div className="space-y-4 h-full flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between border-b border-home-grau/20 pb-3 gap-2">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-wider font-mono text-shiraz bg-shiraz/5 border border-shiraz/20 px-2.5 py-0.5 rounded-full inline-block">
                              {p.role}
                            </span>
                            <h3 className="text-base font-extrabold text-text-main leading-tight mt-1.5">{p.name}</h3>
                            <span className="text-[11px] text-text-main/70 block font-medium">
                              🌍 {p.origin} ({p.lifespan})
                            </span>
                          </div>
                          <div className="p-3 bg-off-white border border-home-grau/30 rounded-2xl shrink-0 text-shiraz shadow-xs font-mono text-xs font-bold">
                            💡
                          </div>
                        </div>

                        {/* Breakthrough box */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-text-main/50 block font-mono">
                            Forschungsgebiet &amp; Beitrag :
                          </span>
                          <p className="text-xs text-text-main font-semibold leading-relaxed bg-off-white p-3.5 rounded-xl border border-home-grau/20 font-sans">
                            {p.field}
                          </p>
                        </div>

                        {/* Core contribution */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-text-main/50 block font-mono">
                            Wissenschaftlicher Durchbruch :
                          </span>
                          <p className="text-xs text-text-main/80 leading-relaxed font-sans font-normal">
                            {p.contribution}
                          </p>
                        </div>

                        {/* Achievements */}
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] uppercase font-bold text-text-main/50 block font-mono">
                            Spezifische Meilensteine &amp; Errungenschaften :
                          </span>
                          <div className="space-y-2">
                            {p.achievements.map((ach, aIdx) => (
                              <div key={aIdx} className="text-xs text-text-main/80 flex items-start gap-2.5 bg-[#fcf8f2] p-3 rounded-xl border border-home-grau/20">
                                <span className="w-5 h-5 rounded-full bg-white border border-home-grau/30 text-text-main flex items-center justify-center text-[9.5px] font-mono shrink-0 font-bold">
                                  {formatDeWert(aIdx + 1)}
                                </span>
                                <span className="leading-relaxed">{ach}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Famous quote */}
                      <div className="bg-[#fcf8f2] text-text-main/90 p-4 rounded-xl border border-home-grau/30 italic text-[11px] leading-relaxed relative overflow-hidden mt-4 shadow-sm">
                        <div className="absolute -right-2 -bottom-4 text-shiraz/10 font-serif text-5xl select-none font-bold">“</div>
                        <p className="relative z-10 text-text-main/80">
                          {p.quote}
                        </p>
                      </div>

                    </div>
                  );
                })()}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="baustoffkunde" />

      {/* 3. CORE VALUE MODULE FOOTER */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Werkstoffkunde', url: 'https://de.wikipedia.org/wiki/Werkstoffkunde' },
          { title: 'Baustoff', url: 'https://de.wikipedia.org/wiki/Baustoff' },
          { title: 'Opus caementicium', url: 'https://de.wikipedia.org/wiki/Opus_caementicium' },
          { title: 'Portlandzement', url: 'https://de.wikipedia.org/wiki/Portlandzement' }
        ]}
        literatur={[
          'Möhring, R. (Hrsg.): Baustoffkenntnis (begr. von W. Scholz). 18. Aufl., Köln: Bundesanzeiger Verlag 2016',
          'Vitruv: Zehn Bücher über Architektur. Übers. und erl. von C. Fensterbusch. Darmstadt: Wissenschaftliche Buchgesellschaft (Neuauflagen)',
          'Powers, T. C.; Brownyard, T. L.: Studies of the Physical Properties of Hardened Portland Cement Paste. Journal of the American Concrete Institute 43 (1946/47)'
        ]}
        regelwerke={[
          { title: 'DIN EN 1990 (Eurocode: Grundlagen der Tragwerksplanung)' },
          { title: 'DIN EN 197-1 (Zement – Teil 1: Zusammensetzung, Anforderungen und Konformitätskriterien von Normalzement)' },
          { title: 'DIN EN 196-3 (Prüfverfahren für Zement – Erstarrungszeiten und Raumbeständigkeit)' }
        ]}
        formeln={[
          {
            formel: "\\varepsilon_T = \\alpha_T \\cdot \\Delta T",
            erklaerung: "Temperaturdehnung eines frei verformbaren Bauteils (Beton α_T ≈ 10 · 10⁻⁶ 1/K, Stahl ≈ 12 · 10⁻⁶ 1/K).",
            quelle: "DIN EN 1992-1-1, 3.1.3 und 3.2.7"
          }
        ]}
        lastReviewed="Oktober 2026 (AP 3 Grundlagen: Geschichte, Pioniere und Stoffklassen gegen Primär- und Fachquellen geprüft, erfundene Zitate entfernt; fachliche Freigabe durch den Autor ausstehend)"
      />

    </div>
  );
}
