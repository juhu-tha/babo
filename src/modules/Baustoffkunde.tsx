import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Clock, Layers, AlertCircle, 
  ArrowRight, Landmark, Zap, ShieldCheck, TreePine, Construction, Hammer,
  User, Users, CheckCircle, Box
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

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
      lifespan: 'ca. 80 v. Chr. – 15 v. Chr.',
      role: 'Römischer Architekt, Ingenieur & Offizier',
      field: 'Antiker Gussmauerwerksbau (Opus Caementicium)',
      origin: 'Römisches Reich',
      contribution: 'Verfasste das legendäre Standardwerk "De Architectura" (Zehn Bücher über Architektur), in dem er erstmals detailliert die physikalisch-chemische Wirkungsweise von sandig-vulkanischen Puzzolanerden und geeigneten Luftkalköfen beschrieb.',
      achievements: [
        'Formulierte die klassischen Kriterien guter Architektur, die noch heute für Baustoffe gelten: Firmitas (Festigkeit), Utilitas (Gebrauchstauglichkeit) und Venustas (Schönheit).',
        'Dokumentierte das Rezeptur-Geheimnis der römischen Unterwasserhärtung von Opus Caementicium durch Beimischen von reaktiver Vulkanerde aus Baiae und Pozzuoli.'
      ],
      quote: '„Es gibt auch eine Art Staub, welche aus natürlichen Ursachen eine bewundernswerte Wirkung hervorbringt. Sie findet sich in der Gegend von Baiae und den Landstrichen um den Vesuv.“'
    },
    {
      id: 'aspdin',
      name: 'Joseph Aspdin',
      lifespan: '1778 – 1855',
      role: 'Britischer Maurer & Erfinder',
      field: 'Erfindung des Portlandzements (OPC)',
      origin: 'Großbritannien (Leeds)',
      contribution: 'Er erhielt am 21. Oktober 1824 das fundamentale Patent für das künstliche Bindemittel „Portland Cement“. Er entwickelte das Herstellungsverfahren durch zielgerichtetes Brennen einer fein gemahlenen Mischung aus weichem Kalkstein und tonreichen Gesteinen.',
      achievements: [
        'Brachte die künstliche Zementherstellung durch reproduzierbare Mischverhältnisse und kontrolliertes Trockenbrennen auf ein industrielles Niveau.',
        'Wählte bewusst den werbewirksamen Begriff „Portlandzement“, da das ausgehärtete Material farblich und haptisch dem edlen, damals hochpreisigen Portland-Naturstein der englischen Halbinsel Portland ähnelte.'
      ],
      quote: '„Ich, Joseph Aspdin, erkläre hiermit mein Verfahren zur Herstellung einer Zementmischung, die ich Portlandzement nenne...“'
    },
    {
      id: 'vicat',
      name: 'Louis-Joseph Vicat',
      lifespan: '1786 – 1861',
      role: 'Französischer Bauingenieur & Forscher',
      field: 'Hydraulizitätstheorie & standardisierte Zementprüfung',
      origin: 'Frankreich (Grenoble)',
      contribution: 'Erforste als Erster rein physikalisch-chemisch das Phänomen der Hydraulizität (wasserfeste Erhärtung). Er erfand das noch heute weltweit genormte Nadelprüfgerät ("Vicat-Nadel") zur prazisen Ermittlung des Erstarrungsbeginns von Zementleim.',
      achievements: [
        'Veröffentlichte 1818 das chemische Prinzip für künstliche hydraulische Kalke und verzichtete selbstlos auf Patente, um das weltweite Bauwesen voranzubringen.',
        'Formulierte den Vicatsche Index (Verhältnis von SiO2 + Al2O3 zu CaO/MgO) zur Beurteilung der Eignung von Zementrohmehlen.'
      ],
      quote: '„Die Wissenschaft verzeichnet ihren größten Triumph erst dann, wenn sie direkt zum materiellen Fortschritt und zur Lebenssicherheit der menschlichen Gesellschaft beiträgt.“'
    },
    {
      id: 'monier',
      name: 'Joseph Monier',
      lifespan: '1823 – 1906',
      role: 'Französischer Gärtner & Erfinder',
      field: 'Erfindung des Verbundbaus (Eisen-/Stahlbeton)',
      origin: 'Frankreich (Saint-Quentin)',
      contribution: 'Erkannte die mangelhafte Zugfestigkeit bei unbewehrten Mörtelschalen. Ab 1849 legte er Eisendrahtgeflechte als zugfeste Skeletteinlage in seine Gärtnereizuber ein und schuf damit die Geburtsstunde des Verbundbaus.',
      achievements: [
        'Sicherte sich zukunftsentscheidende Patente für weitreichendere Konstruktionen wie Rohre, Fassadenplatten, Gewölbedecken und erste Brückenträger.',
        'Sein Name ging dauerhaft in den Bauwortschatz über (sogenannte „Monier-Eisen“ für Betonstahlbewehrungen).'
      ],
      quote: '„Ich suchte nach einer Methode, um große Pflanzenkübel zu produzieren, die nicht im Frost platzen, wenn das feuchte Erdreich sich ausdehnt. Das Eisen gab dem Mörtelkörper die nötige Zähigkeit.“'
    },
    {
      id: 'wayss_freytag',
      name: 'Freytag & Wayss (Das System Monier)',
      lifespan: 'Conrad Freytag (1846–1921) | Gustav Wayss (1851–1917)',
      role: 'Deutsche Bauunternehmer & Bautechnik-Pioniere',
      field: 'Wissenschaftliche Validierung des Stahlbetonprinzips',
      origin: 'Deutschland (Neustadt/Weinstraße & Berlin)',
      contribution: 'Erkannten das immense Tragpotenzial des elastischen Zusammenspiels von Stahl und Beton. Sie erwarben die Patentrechte von Monier für den deutschen Raum und finanzierten die ersten wissenschaftlich exakten Tragbarkeitsversuche.',
      achievements: [
        'Brachten das monolithische Verbundprinzip auf den baurechtlich anerkannten Stand der Technik und gründeten die weltbekannte Wayss & Freytag AG.',
        'Veröffentlichten 1887 das Buch „Das System Monier“, welches als Initialzündung der Berechnungsverfahren im konstruktiven Ingenieurbau gilt.'
      ],
      quote: '„Erst durch die präzise, tiefe Einbettung des Eisens in die neutrale Faser des Betons wird aus zwei gewöhnlichen Baustoffen ein harmonisches, unverwüstliches Verbundtragwerk.“'
    },
    {
      id: 'moersch',
      name: 'Prof. Dr.-Ing. E.h. Emil Mörsch',
      lifespan: '1872 – 1950',
      role: 'Bauingenieur & Hochschulprofessor',
      field: 'Theorie des Massivbaus & Schubbemessung',
      origin: 'Deutschland (Stuttgart)',
      contribution: 'Gilt weltweit als der Begründer des wissenschaftlich fundierten Stahlbetonbaus. Er systematisierte die Schubbemessung und entwickelte das zeitlose Fachwerkmodell für Querkraftnachweise im Massivbau.',
      achievements: [
        'Formulierte die Berechnungsverfahren für den gerissenen Zustand II unter Einbeziehung des Elastizitätsbeiwertes n.',
        'Verfasste das epochale, über Jahrzehnte führende Standardwerk „Der Eisenbetonbau – Seine Theorie und Anwendung“ ab der Erstauflage 1902.'
      ],
      quote: '„Der Ingenieur darf nicht bloß blind rechnen, er muss die Kraftpfade des Werkstoffs im Verbund körperlich spüren und verstehen lernen.“'
    },
    {
      id: 'powers',
      name: 'Treval C. Powers',
      lifespan: '1900 – 1997',
      role: 'US-amerikanischer Werkstoffwissenschaftler',
      field: 'Portlandzement-Mikrostruktur & Gel-Poren-Modell',
      origin: 'USA (Chicago / Portland Cement Association)',
      contribution: 'Entschlüsselte als globaler Pionier das komplexe physikalische Gefüge des erhärteten Zementsteins. Powers formulierte das Gel-Poren-Modell des Hydratationsprodukts, welches Festigkeiten und Dauerhaftigkeiten mathematisch berechenbar machte.',
      achievements: [
        'Wies experimentell nach, dass Zementstein aus kristallinen Plattenschichten (CSH-Gelen) sowie winzigen Gelporen (Breite ~1.5 nm) und Kapillarporen aufgebaut ist.',
        'Erstellte exakte Gleichungsverfahren für die Wasserbindungskoeffizienten im Reifezyklus mineralischer Baustoffe.'
      ],
      quote: '„Die Festigkeit von erhärtetem Zement ist kein Zufall, sondern steht in direkter Funktion zur Packungsdichte und dem Verhältnis von festem Gelkörper zu freiem Porenvolumen.“'
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
        { name: 'Zugfestigkeit', value: 'Gering (ca. 10% der Druckfestigkeit)' },
        { name: 'Thermisches Verhalten', value: 'Hervorragende Feuerbeständigkeit, nicht brennbar (A1)' },
        { name: 'Rohdichte', value: 'Typischerweise 1200 - 2800 kg/m³' }
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
        { name: 'Festigkeit', value: 'Extrem hoch in Zug- und Druckrichtung (350 - 1800 MPa)' },
        { name: 'Verhalten', value: 'Plastisch verformbar (duktil), ausgeprägtes Fließverhalten' },
        { name: 'Korrosion', value: 'Empfindlich gegen Oxidation (Rosten) ohne aktiven Schutz' },
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
        { name: 'Treibhauspotenzial', value: 'Negatives GWP (wirkt temporär als Kohlenstoffspeicher)' },
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
        'Folien, Dampfbremsen und geometrische Abdichtungsbahnen',
        'Fassadenbekleidungen und Rohrleitungssysteme (PVC, PE, PP)',
        'Bautenklebstoffe, Kunstharze und Versiegelungen',
        'Bitumen und polymer-modifiziertes Bitumen im Straßen- & Dachbau'
      ],
      keyAttributes: [
        { name: 'Gewicht', value: 'Sehr leicht (z.B. EPS ca. 15 - 30 kg/m³)' },
        { name: 'Dämmeigenschaften', value: 'Sehr niedrige Wärmeleitfähigkeit (ca. 0.030 - 0.040 W/(mK))' },
        { name: 'Kriechneigung', value: 'Hoch viskoelastisch unter Dauerlasten' },
        { name: 'Brandschutz', value: 'Brennbar (B1/B2 nach DIN 4102), Rauchentwicklung' }
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
        'Faserzementplatten (historisch Asbestzement, heute harmlose Kunstfasern)'
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
      milestone: 'Entdeckung der thermischen Materialveredelung (Brennen von Ton zu ersten Lehmsteinen).',
      details: 'Die ersten Behausungen nutzten Astwerke, Tierhäute und unverfestigten Lehm. Der konstruktive Holzbau entwickelte sich im Pfahlbau. Haltbarkeit war primär ein Problem biotischer Verrottung.'
    },
    {
      era: 'Antike (~ 300 v. Chr. – 400 n. Chr.)',
      century: 'Römisches Reich',
      title: 'Die Erfindung des "Opus Caementicium"',
      description: 'Die Römer revolutionierten die Weltarchitektur durch Erfindung des ersten echten hydraulischen Betons. Dies erlaubte weite Bögen, Gewölbekuppeln und Unterwasserbauten.',
      icon: <Landmark className="text-indigo-700" size={20} />,
      materials: ['Römischer Beton (Opus Caementicium)', 'Puzzolanasche (Vulkanerde)', 'Luftkalk-Mörtel', 'Puzzolanische Ziegelmehle'],
      milestone: 'Kuppel des Pantheons in Rom (erbaut ca. 120 n. Chr., 43,3 m freie Weite aus unbewehrtem Gussbeton).',
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
      details: 'Fachwerkbauten dominierten die mitteleuropäischen Städte. Der Werkstoff Kalkmörtel hielt ausschließlich über Karbonatisierung (CO₂-Aufnahme) stand, was bei dicken Wänden Jahrzehnte dauerte. Gotische Baumeister sicherten die Standsicherheit rein empirisch über geometrische Verhältnisregeln.'
    },
    {
      era: 'Industrielle Revolution (19. Jahrhundert)',
      century: '1800 - 1899',
      title: 'Das Patent von Portlandzement & Stahlbeton',
      description: 'Mit dem Beginn der Industrialisierung und der Chemie als exakte Wissenschaft wurden Baustoffe standardisiert, künstlich synthetisiert und maschinell geprüft.',
      icon: <Zap className="text-amber-500" size={20} />,
      materials: ['Portlandzement (OPC)', 'Schmiedeeisen / Gusseisen', 'Frühformen des Flussstahls', 'Eisenbeton nach J. Monier'],
      milestone: '1824 patentiert Joseph Aspdin die Herstellung des "Portland-Cementes". Ende des 19. Jh. formuliert Conrad Freytag die physikalischen Grundlagen des Stahlbetons.',
      details: 'Durch extrem hohes Brennen von Kalkstein- und Tonmischungen bis zur Sintergrenze (~1450 °C) entstand der Portlandzementklinker mit den hydraulischen Hauptphasen Alit und Belit. Um 1867 meldet der Gärtner Joseph Monier eiserne Einlagen in Pflanzenkübeln aus Zementmörtel als Patent an ("Monier-Eisen"). Die geniale Erkenntnis: Beton und Stahl dehnen sich bei Hitze fast identisch aus (gleicher thermischer Ausdehnungskoeffizient α ≈ 1.2·10⁻⁵ K⁻¹).'
    },
    {
      era: 'Moderne (20. Jahrhundert)',
      century: '1900 - 1999',
      title: 'Hochleistungsbaustoffe und Normierung',
      description: 'Das Jahrhundert des uneingeschränkten Betonbooms. Erforschung der Zementchemie führte zu ultra-festen Werkstoffen, Spannstählen und synthetischen Polymerdämmstoffen.',
      icon: <GraduationCap className="text-blue-600" size={20} />,
      materials: ['Hochleistungsbeton (z. B. UHPC)', 'Spannstahl', 'Polystyrol (EPS/XPS)', 'Bewehrungsstahl B500B', 'Floatglas'],
      milestone: 'Bau weitgespannter Spannbetonbrücken und extremer Hochhäuser. Einführung des Sicherheitskonzepts auf Basis von Teilsicherheitsbeiwerten (Eurocodes).',
      details: 'Mit Fließmitteln (Polycarboxylatether, PCE) und reaktiven Feinststoffen (Silicastaub) gelingt es, den Wasserzementwert (w/z-Wert) auf unter 0,25 zu senken, was zu Ultra-Hochleistungsbetonen (UHPC) mit Druckfestigkeiten von weit über 150 MPa führt. Dämmstoffe aus Mineralwolle und Polystyrol verändern den winterlichen Wärmeschutz.'
    },
    {
      era: 'Anthropozän & Zukunft (21. Jahrhundert)',
      century: 'Seit 2000',
      title: 'Dekarbonisierung, zirkuläres Bauen',
      description: 'Das Bauwesen ist für knapp 40% der globalen CO₂-Emissionen verantwortlich. Der Fokus schwenkt radikal von rein mechanischer Festigkeit zu Nachhaltigkeit, CO₂-Einbindung und Materialkreisläufen.',
      icon: <ShieldCheck className="text-emerald-600 font-bold" size={20} />,
      materials: ['Carbonbeton (korrosionsfrei)', 'Zemente mit Klinkerersatzstoffen (LC3)', 'Rezyklat-Beton (RC-Gestein)', 'Pflanzenkohle-Beton', 'Ingenieurholz-Produkte'],
      milestone: 'Erste Carbonbetongebäude ("CUBE" Dresden) ohne Stahlkorrosionsgefahr. Einführung digitaler Produktpässe (DPP) zur Erfassung zirkulärer Materialressourcen im Baurecht.',
      details: 'Die CO₂-neutrale Baustoffkunde ersetzt herkömmlichen Klinker durch calcinierten Ton und Kalksteinmehl (LC3-Zement). Pflanzenkohle wird als dauerhafter Kohlenstoffspeicher in Beton eingebunden (Kohlenstoff-Senke). Korrosionsfreie Carbonbewehrungen sparen bis zu 50% Beton-Bauteildicke und verbilligen den Transport erheblich.'
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
                Die Geschichte des Bauens ist untrennbar mit der Entdeckung und Beherrschung neuer Baustoffe verknüpft. Jede tektonische Epoche wurde durch veränderte stoffchemische und mechanische Möglichkeiten definiert – vom unbewehrten Monument der Antike bis zum hochgradig ressourcen-optimierten und digitalisierten Bauteil der Gegenwart. Navigiere unten durch die wichtigsten Meilensteine.
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
                Hinter jedem modernen Hochleistungsbaustoff stehen genialer Forschergeist, beharrliche Experimente und bahnbrechende Entdeckungen. Diese Pioniere haben die Brücke zwischen geologischem Vorkommen, chemischer Synthese und mathematischer Tragwerkslehre geschlagen. Entdecke die Meilensteine dieser Persönlichkeiten.
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
                                  {aIdx + 1}
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

      {/* 3. CORE VALUE MODULE FOOTER */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Werkstoffkunde', url: 'https://de.wikipedia.org/wiki/Werkstoffkunde' },
          { title: 'Baustoff', url: 'https://de.wikipedia.org/wiki/Baustoff' },
          { title: 'Opus caementicium', url: 'https://de.wikipedia.org/wiki/Opus_caementicium' },
          { title: 'Portlandzement', url: 'https://de.wikipedia.org/wiki/Portlandzement' }
        ]}
        literatur={[
          'W. Scholz: Baustoffkenntnis (19. Auflage, Werner Verlag, Neuwied, 2020)'
        ]}
        regelwerke={[
          { title: 'DIN EN 1990 (Eurocode: Grundlagen der Tragwerksplanung)' },
          { title: 'DIN EN 197-1 (Zement - Teil 1: Zusammensetzung, Anforderungen und Konformitätskriterien von Normalzement)' }
        ]}
        formeln={[
          {
            formel: "\\epsilon_{\\Theta} = \\alpha_T \\cdot \\Delta T",
            erklaerung: "Thermodynamische Längendehnung durch Temperaturänderungen in einem ungehinderten Werkstoff.",
            quelle: "Allgemeine Bauphysik / Elastomechanik"
          }
        ]}
      />

    </div>
  );
}
