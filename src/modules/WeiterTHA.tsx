import React from 'react';
import { 
  GraduationCap, BookOpen, ExternalLink, Calendar, Clock, Award, CheckCircle2, ChevronRight,
  LayoutGrid, Trees, Sparkles, SlidersHorizontal, Layers
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { useTabContext } from '@/src/contexts/TabContext';

interface Program {
  id: 'bauing' | 'pm' | 'ausbau' | 'fassade' | 'holzbau' | 'ttz' | 'mapr';
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBgColor: string;
  bgColor: string;
  borderColor: string;
  badge: string;
  badgeBgColor: string;
  badgeTextColor: string;
  btnBg: string;
  link?: string;
  degree: string;
  duration: string;
  format: string;
  summary: string;
  description: string;
  modulesTitle: string;
  modules: string[];
  benefitsTitle: string;
  benefitsIntro: string;
  benefits: string[];
}

const PROGRAMS: Program[] = [
  {
    id: 'bauing',
    title: 'Bauingenieurwesen (Master)',
    subtitle: 'Fakultät für Architektur und Bauwesen',
    icon: GraduationCap,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: 'Architektur & Bauwesen • THA',
    badgeBgColor: 'bg-shiraz/5',
    badgeTextColor: 'text-shiraz',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/hochschule/fakultaet/ab/studienangebot/bauingenieurwesen-meng/',
    degree: 'Master of Engineering (M.Eng.)',
    duration: '3 Semester (Vollzeit) / 5 Semester (Teilzeit)',
    format: 'Vollzeit, Teilzeit oder Studium mit vertiefter Praxis; Beginn jedes Semester',
    summary: 'Der forschungs- und praxisorientierte Masterstudiengang vertieft und erweitert das im Bachelor erworbene ingenieurwissenschaftliche Fachwissen. Er befähigt Sie zur eigenständigen Lösung komplexer Aufgabenstellungen des modernen Bauwesens, vom Konstruktiven Ingenieurbau über Digitales Bauen (BIM) bis hin zu Infrastruktur und Umwelttechnik. Das Studium ist flexibel gestaltbar und auch in Teilzeit möglich.',
    description: 'Bereiten Sie sich auf anspruchsvolle Entwicklungs-, Planungs- und Führungsaufgaben vor. Absolventen übernehmen hochqualifizierte Positionen in renommierten Ingenieurbüros, führenden Bauunternehmungen, staatlichen Baubehörden sowie Prüfämtern.',
    modulesTitle: 'Studienschwerpunkte & Fächer',
    modules: [
      'Infrastrukturbau und Verkehrsinfrastruktur',
      'Konstruktiver Ingenieurbau',
      'Geotechnik und Spezialtiefbau',
      'Wasserwirtschaft und Wasserbau',
      'Digitales Planen und Bauen',
      'Nachhaltiges Bauen und Klimaschutz',
      'Vertiefte Statik und numerische Methoden',
      'Interdisziplinäre Projektarbeit'
    ],
    benefitsTitle: 'Berufsfelder & Karriere',
    benefitsIntro: 'Absolventen übernehmen hochqualifizierte Fach- und Führungsaufgaben in Ingenieurbüros, Bauunternehmungen, Prüfämtern und der öffentlichen Bauverwaltung:',
    benefits: [
      'Fach- und Führungsaufgaben in Ingenieurbüros, Bauunternehmen und Bauverwaltung',
      'Zugang zum höheren technischen Dienst (Laufbahnvoraussetzungen des Dienstherrn beachten)',
      'Grundlage für eine Promotion; die Bauvorlageberechtigung richtet sich nach Landesrecht (z. B. Kammereintragung und Berufserfahrung)'
    ]
  },
  {
    id: 'pm',
    title: 'Projektmanagement Bau (Master)',
    subtitle: 'THA_ibi – Institut für Bau und Immobilie (berufsbegleitender Weiterbildungsmaster)',
    icon: BookOpen,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: 'Weiterbildungsstudiengang • ibi',
    badgeBgColor: 'bg-slate-100',
    badgeTextColor: 'text-slate-850',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/hochschule/fakultaet/ab/studienangebot/projektmanagement-bau-meng/',
    degree: 'Master of Engineering (M.Eng.)',
    duration: '5 Semester (berufsbegleitend)',
    format: 'Freitag/Samstag-Präsenz plus 1–2 Blockseminare je Semester; Gebühren 5 × 2.800 € (Stand 10/2026)',
    summary: 'Dieser berufsbegleitende Weiterbildungsstudiengang ist interdisziplinär angelegt und richtet sich an Architekten, Bauingenieure, Wirtschaftsingenieure und Absolventen verwandter Studiengänge mit erster Berufserfahrung. Er verknüpft technisches Know-how mit juristischer Kompetenz, Projektsteuerung, BIM-Management und Teamführung.',
    description: 'Der Masterstudiengang qualifiziert Sie für Führungsrollen in der Bau- und Immobilienwirtschaft. Der Schwerpunkt liegt auf ganzheitlicher Projektleitung und -steuerung im Einklang mit wirtschaftlichen, ökologischen und rechtlichen Parametern.',
    modulesTitle: 'Kerninhalte der PM-Module',
    modules: [
      'Master Basis: Schlüsselkompetenzen, Baurecht, International Project Management',
      'Vertiefung Bau und Immobilie: Methoden des Projektmanagements, Projektentwicklung, Nachhaltiges Bauen und Zertifizierung, Baubetrieb und KLR',
      'Alternativ Vertiefung Ausbau und Bestand, Fassade oder Holzbau (entspricht den Zertifikatsstudiengängen)',
      'Master Final: Masterseminar und Masterarbeit'
    ],
    benefitsTitle: 'Nutzen für Ihre Praxis',
    benefitsIntro: 'Die enge Verknüpfung mit erfahrenen Dozierenden aus Planung, Bauwirtschaft, Recht und Immobilienwirtschaft bietet wertvolles Praxis-Networking:',
    benefits: [
      'Karrieresprung zum Projektleiter, PM-Director oder Niederlassungsleiter',
      'Umfassendes Verständnis von immobilienwirtschaftlichen Zusammenhängen',
      'Unmittelbare Übertragbarkeit von erlernten Modulen in den Berufsalltag'
    ]
  },
  {
    id: 'ausbau',
    title: 'Ausbau und Bestand (Zertifikat)',
    subtitle: 'THA_ibi – Institut für Bau und Immobilie (berufsbegleitendes Zertifikatsstudium)',
    icon: Award,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: 'Zertifikatslehrgang • ibi',
    badgeBgColor: 'bg-slate-100',
    badgeTextColor: 'text-slate-850',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/hochschule/fakultaet/ab/studienangebot/ausbau-und-bestand-zertifikat/',
    degree: 'Zertifikat Fachingenieur:in / Fachplaner:in Ausbau und Bestand (30 ECTS)',
    duration: '2 Semester (berufsbegleitend)',
    format: 'Berufsbegleitend, Beginn im Wintersemester; Gebühren 2 × 3.200 € (Stand 10/2026); voll anrechenbar als Vertiefung im Master Projektmanagement Bau',
    summary: 'Berufsbegleitendes Zertifikatsstudium für Ausbau und Bauen im Bestand. Schwerpunkte sind Nachhaltigkeit, Schadstoffe, Kreislaufwirtschaft und Projektmanagement sowie aktuelle Systeme des Aus- und Leichtbaus; Projektarbeiten und Fallstudien in interdisziplinären Gruppen.',
    description: 'Bauen im Bestand und anspruchsvolle Innenausbauten erfordern lückenlose technische Detailkompetenz. Gewinnen Sie Vertrauen bei komplexesten Schnittstellenkoordinationen am Bau.',
    modulesTitle: 'Lehrplanthemen',
    modules: [
      'A 1: Projektmodul Ausbau und Bestand',
      'A 2: Konzeption und Konstruktion im Ausbau und Bestand',
      'A 3: Bauphysik und TGA im Ausbau und Bestand',
      'Schwerpunkte: Nachhaltigkeit, Schadstoffe, Kreislaufwirtschaft, Projektmanagement, Aus- und Leichtbausysteme'
    ],
    benefitsTitle: 'Wer profitiert am meisten?',
    benefitsIntro: 'Die praxisnahe Weiterbildung verbindet Planung und Ausführung:',
    benefits: [
      'Planenden Architekten und Bauingenieure zur Erstellung haftungssicherer Details',
      'Bauleiter, Bauherrenbeauftragte & Gutachter zur Früherkennung von Ausbaufehlern',
      'Projektsteuerer zur zeitlichen & kostengünstigen Koordination der Gewerke'
    ]
  },
  {
    id: 'fassade',
    title: 'Fassade (Zertifikat)',
    subtitle: 'THA_ibi – Institut für Bau und Immobilie (berufsbegleitendes Zertifikatsstudium)',
    icon: LayoutGrid,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: 'Zertifikatslehrgang • ibi (NEU)',
    badgeBgColor: 'bg-slate-100',
    badgeTextColor: 'text-slate-850',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/hochschule/fakultaet/ab/studienangebot/fassade-zertifikat/',
    degree: 'Zertifikat Fachingenieur:in / Fachplaner:in Fassade (30 ECTS)',
    duration: '2 Semester (berufsbegleitend)',
    format: 'Berufsbegleitend, Beginn im Wintersemester; Gebühren 2 × 3.200 € (Stand 10/2026); voll anrechenbar als Vertiefung im Master Projektmanagement Bau',
    summary: 'Die Gebäudehülle bzw. Vorhangfassade stellt als Schnittstelle zwischen Tragwerk, Bauphysik und architektonischem Ausdruck eines der komplexesten Bauteile dar. Dieser praxisnahe Zertifikatslehrgang vertieft Konstruktionsdetails von Glas-, Metall- und Elementfassaden, thermische Bauphysik sowie brandschutztechnische Anforderungen im modernen Fassadenbau.',
    description: 'Effizientes Planen moderner System- und Elementfassaden setzt herstellerunabhängiges, vertieftes technisches Spezialwissen voraus, insbesondere bei der Bewertung thermischer Effekte, Strömungsverhalten und Tragstruktur-Anschlüssen.',
    modulesTitle: 'Lehrplanthemen / Module',
    modules: [
      'F 1: Projektmodul Fassade',
      'F 2: Konzeption und Konstruktion in der Fassade',
      'F 3: Bauphysik und TGA in der Fassade',
      'F 4: Bauabwicklung in der Fassade (Kosten und Abwicklung; Regelwerke, Prüfmethoden, Schäden)'
    ],
    benefitsTitle: 'Wer profitiert am meisten?',
    benefitsIntro: 'Die Fortbildung bringt Sie auf Augenhöhe mit spezialisierten Systemherstellern und schützt Sie vor kostspieligen Haftungsfällen:',
    benefits: [
      'Planungsbüros für Fassadentechnik sowie Bauingenieure und Architekten in der Tragwerksplanung',
      'Bauleiter & QS-Beauftragte von Fassadenbauunternehmen zur Schadensvermeidung',
      'Spezialisten für thermische Hüllensanierungen, Energieberater und Bauherrenvertreter'
    ]
  },
  {
    id: 'holzbau',
    title: 'Holzbau (Zertifikat)',
    subtitle: 'THA_ibi – Institut für Bau und Immobilie (berufsbegleitendes Zertifikatsstudium)',
    icon: Trees,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: 'Zertifikatslehrgang • ibi (NEU)',
    badgeBgColor: 'bg-slate-100',
    badgeTextColor: 'text-slate-850',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/hochschule/fakultaet/ab/studienangebot/holzbau-zertifikat/',
    degree: 'Zertifikat Fachingenieur:in / Fachplaner:in Holzbau (30 ECTS)',
    duration: '2 Semester (berufsbegleitend)',
    format: 'Berufsbegleitend, Beginn im Wintersemester; Gebühren 2 × 3.200 € (Stand 10/2026); voll anrechenbar als Vertiefung im Master Projektmanagement Bau',
    summary: 'Der moderne Holzbau und mehrgeschossige Holz-Hybridbau boomen im Zuge des nachhaltigen Bauens. Dieser Zertifikatslehrgang bereitet Sie auf die anspruchsvolle Detailplanung vor, von Tragfähigkeit und Bemessung, Feuchtelast- und Schwingungsschutz bis hin zu Schallschutz und Brandschutz nach anspruchsvollen Landesbauordnungen.',
    description: 'Nachhaltiges, schnelles und präzises zirkuläres Bauen gelingt am besten im Holzbau. Das interdisziplinäre Planen mehrgeschossiger Holzbauten verlangt jedoch höchste Fachkunde bezüglich Verformungen, Schallbrücken und Fluchtwegevorsorge.',
    modulesTitle: 'Lehrplanthemen / Module',
    modules: [
      'H 1: Projektmodul Integrale Planung',
      'H 2: Bauen mit Holz',
      'H 3: Schutzmaßnahmen',
      'Schwerpunkte: Ökonomie, Ökologie, Kreislauffähigkeit, Feuchteschutz, digitale Planung, Bauen im Bestand mit Holz'
    ],
    benefitsTitle: 'Wer profitiert am meisten?',
    benefitsIntro: 'Rüsten Sie sich für die Bauwende durch echtes Holz-Tragwerks- und Ausführungswissen:',
    benefits: [
      'Tragwerksplaner & Statiker zur Erweiterung auf komplexe und klimafreundliche Holz-Tragstrukturen',
      'Zimmerermeister, Holzbautechniker, Bauleiter & Planer im modernen Zimmereihandwerk',
      'Architekten für ressourcen-, kreislaufbewusstes, modulares und klimabewusstes Entwerfen'
    ]
  },
  {
    id: 'ttz',
    title: 'TTZ Aichach (Technologietransferzentrum)',
    subtitle: 'Technologietransferzentrum für Digitales Planen und Fertigen im Bauwesen (gegründet 2023)',
    icon: Sparkles,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: 'Forschung & Transfer • THA',
    badgeBgColor: 'bg-shiraz/5',
    badgeTextColor: 'text-shiraz',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/forschung/technologietransfer/technologietransferzentren/ttz-aichach/',
    degree: 'Forschung, Transfer & Innovation',
    duration: 'Forschung & Transfer',
    format: 'Kooperationsprojekte mit Bauwirtschaft und Handwerk',
    summary: 'Das Technologietransferzentrum (TTZ) Aichach der Technischen Hochschule Augsburg (THA) ist auf Digitales Planen und Fertigen im Bauwesen spezialisiert (Fachbereiche Massivbau und Digitaler Holzbau). Es verbindet angewandte Forschung mit der Praxis von Bauwirtschaft und Handwerk in der Region.',
    description: 'In Kooperation mit Unternehmen werden praxisorientierte Lösungen für moderne Fertigungstechniken im Holzbau, Automatisierung, CO2-neutrale Baumaterialien und kreislaufgerechtes Konstruieren erprobt. Ein forschen-fokussiertes Umfeld bietet exzellente Bedingungen für Doktoranden.',
    modulesTitle: 'Forschungs- & Fokusthemen',
    modules: [
      'Fachbereiche Massivbau und Digitaler Holzbau',
      'Ressourcenschonende Baumaterialien',
      'Additive und digitale Produktionsmethoden, automatisierte Fertigung',
      'Digitale Planungstools',
      'Aus- und Weiterbildung von Fachkräften'
    ],
    benefitsTitle: 'Zusammenarbeit & Transfer',
    benefitsIntro: 'Das TTZ bietet ein lebendiges Innovationsökosystem für Studierende, Forschende und Partnerunternehmen:',
    benefits: [
      'Abschlussarbeiten und Projektarbeiten mit Praxispartnern',
      'Gemeinsame drittmittelgeförderte Forschungs- und Entwicklungsprojekte',
      'Promotion in Kooperation (Voraussetzungen und Formate bei der THA prüfen)',
      'Gefördert im Rahmen der Hightech Agenda Bayern sowie von Landkreis Aichach-Friedberg und Stadt Aichach'
    ]
  },
  {
    id: 'mapr',
    title: 'Master of Applied Research (MAPR)',
    subtitle: 'Forschungsorientierter Master der Fakultät Elektrotechnik (fakultätsübergreifend)',
    icon: GraduationCap,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: 'Master of Science (M.Sc.)',
    badgeBgColor: 'bg-shiraz/5',
    badgeTextColor: 'text-shiraz',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/hochschule/fakultaet/elektrotechnik/studienangebot/master-applied-research/',
    degree: 'Master of Science (M.Sc.)',
    duration: '3 Semester (Vollzeit)',
    format: 'Vollzeit; Beginn jedes Semester',
    summary: 'Der interdisziplinäre Masterstudiengang Angewandte Forschung und Entwicklung wendet sich an überdurchschnittlich qualifizierte Absolventen technischer Studiengänge. Sie bearbeiten ab dem ersten Tag ein konkretes Forschungs- und Entwicklungsprojekt und erlangen tiefes wissenschaftliches Know-how.',
    description: 'Dieser Studiengang kombiniert anspruchsvolle angewandte Forschungsprojekte in enger Zusammenarbeit mit Instituten oder Industriepartnern mit einem flexibel gestaltbaren technologisch-wissenschaftlichen Curriculum.',
    modulesTitle: 'Studien- & Forschungsstruktur',
    modules: [
      'Selbstständiges Forschungs- und Entwicklungsprojekt (ca. 50% des Studiums)',
      'Vertiefende Fachvorlesungen nach individuellem Studienplan',
      'Wissenschaftliche Methodik, Projektmanagement & Patentrecht',
      'Verfassen wissenschaftlicher Publikationen & Teilnahme an Fachkongressen',
      'Interdisziplinäres Forschungsseminar der bayerischen Hochschulen'
    ],
    benefitsTitle: 'Herausragende Perspektiven',
    benefitsIntro: 'Bereitet Sie zielgerichtet auf forschungsintensive Aufgaben oder eine anschließende Promotion vor:',
    benefits: [
      'Direkte Anbindung an modernste Forschungsaktivitäten und exzellente Labore der THA',
      'Hervorragende Vorbereitung auf F&E-Leitungsfunktionen in der High-Tech-Industrie',
      'Idealer Wegbereiter für eine anschließende kooperative Promotion (Dr.-Ing. / Dr. rer. nat.)'
    ]
  }
];

export default function WeiterTHA() {
  const { activeTab, setActiveTab } = useTabContext();

  const activeProgram = activeTab === 'weiter_bauing' ? 'bauing'
    : activeTab === 'weiter_pm' ? 'pm'
    : activeTab === 'weiter_ausbau' ? 'ausbau'
    : activeTab === 'weiter_fassade' ? 'fassade'
    : activeTab === 'weiter_holzbau' ? 'holzbau'
    : activeTab === 'weiter_ttz' ? 'ttz'
    : activeTab === 'weiter_mapr' ? 'mapr'
    : 'all';

  const handleProgramChange = (programId: 'all' | 'bauing' | 'pm' | 'ausbau' | 'fassade' | 'holzbau' | 'ttz' | 'mapr') => {
    if (programId === 'all') {
      setActiveTab('weiter_tha');
    } else {
      setActiveTab(`weiter_${programId}` as any);
    }
  };

  const filteredPrograms = activeProgram === 'all' 
    ? PROGRAMS 
    : PROGRAMS.filter(p => p.id === activeProgram);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Intro Banner */}
      <div className="relative bg-white border border-home-grau/30 border-t-4 border-t-shiraz rounded-3xl p-6 md:p-8 text-text-main shadow-xs overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none transform translate-y-12 translate-x-12">
          <GraduationCap size={300} className="text-shiraz" />
        </div>
        <div className="relative z-10 flex flex-col gap-4 max-w-2xl">
          <span className="bg-shiraz/5 text-shiraz border border-shiraz/15 font-semibold text-xs tracking-wider uppercase px-2.5 py-1 rounded-full self-start font-mono">
            Fakultät für Architektur und Bauwesen • THA
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main">
            Weiterführende Studienangebote (THA &amp; ibi)
          </h2>
          <p className="text-sm md:text-base text-text-main/70 leading-relaxed font-light">
            Bereiten Sie sich auf Führungsaufgaben vor! Die Technische Hochschule Augsburg (THA) bietet Absolventinnen und Absolventen herausragende Masterstudiengänge sowie maßgeschneiderte berufsbegleitende Weiterbildungen über das <strong>ibi - Institut für Bau und Immobilie</strong> an.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-2">
            <a 
              href="https://www.tha.de/TTZ-Aichach.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-home-grau/20 rounded-xl text-xs font-semibold text-text-main transition-all shadow-xs"
            >
              <ExternalLink size={12} className="text-shiraz" />
              <span>TTZ Aichach</span>
            </a>
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-home-grau/20 rounded-xl text-xs font-semibold text-text-main/80 shadow-xs"
            >
              <GraduationCap size={12} className="text-shiraz" />
              <span>MAPR (Applied Research)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Program Selector Dashboard/Buttons */}
      <div className="bg-white p-5 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-4 font-sans">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase font-bold tracking-wider text-text-main/50 flex items-center gap-1 font-mono">
            <SlidersHorizontal size={12} /> Programm-Auswahl
          </span>
          <h3 className="text-sm font-bold text-text-main">
            Wählen Sie ein akademisches Angebot zur Detailansicht aus:
          </h3>
        </div>

        {/* Program selection buttons including Master, Fachingenieure, TTZ and MAPR */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <button
            id="btn-all"
            onClick={() => handleProgramChange('all')}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-2 text-center transition-all duration-200 border cursor-pointer ${
              activeProgram === 'all'
                ? 'bg-shiraz text-white shadow-md border-shiraz'
                : 'bg-stone-50 text-text-main hover:bg-stone-100 border-home-grau/20'
            }`}
          >
            <Layers size={18} />
            <div className="flex flex-col items-center">
              <span>Alle Angebote</span>
              <span className={`text-xs font-medium block mt-0.5 ${activeProgram === 'all' ? 'text-white/80' : 'text-text-main/55'}`}>Gesamtübersicht</span>
            </div>
          </button>

          {PROGRAMS.map((program) => {
            const Icon = program.icon as any;
            const isActive = activeProgram === program.id;
            return (
              <button
                key={program.id}
                id={`btn-${program.id}`}
                onClick={() => handleProgramChange(program.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-2 text-center transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-shiraz text-white shadow-md border-shiraz font-bold'
                    : 'bg-stone-50 text-text-main hover:bg-stone-100 border-home-grau/20'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : program.iconColor} />
                <div className="flex flex-col items-center">
                  <span className="line-clamp-1 font-semibold">{program.title.replace(' (Zertifikatslehrgang)', '').replace(' (Master - Bau & Immobilie)', '').replace(' (Master)', '')}</span>
                  <span className={`text-xs font-medium block mt-0.5 ${isActive ? 'text-white/80' : 'text-text-main/55'}`}>{program.duration}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Program Grids */}
      <div className="grid grid-cols-1 gap-8">
        {filteredPrograms.map((program) => {
          const Icon = program.icon as any;
          return (
            <div 
              key={program.id}
              className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col gap-6 transition-all duration-300 ${program.borderColor}`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-home-grau/25 pb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${program.iconBgColor} rounded-2xl flex items-center justify-center ${program.iconColor}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2 flex-wrap">
                      <span>{program.title}</span>
                      {program.badge.includes('NEU') && (
                        <span className="bg-shiraz/10 text-shiraz text-xs px-2 py-0.5 rounded-md font-bold tracking-wider flex items-center gap-0.5">
                          <Sparkles size={10} /> NEU
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-text-main/60">{program.subtitle}</span>
                  </div>
                </div>
                {program.link ? (
                  <a 
                    href={program.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 ${program.btnBg} text-white font-medium text-xs rounded-xl transition-all shadow-sm shrink-0`}
                  >
                    <span>Zur Webseite</span>
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 font-medium text-xs rounded-xl border border-slate-200 shrink-0">
                    Bewerbung / Information an der THA
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <span className={`self-start text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${program.badgeBgColor} ${program.badgeTextColor}`}>
                    {program.badge}
                  </span>
                  {program.id === 'ausbau' && (
                    <span className="self-start text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                      Studiengangsleiter: Prof. Huber
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-main/80 leading-relaxed font-light">
                  {program.summary}
                </p>
                {program.id === 'ausbau' && (
                  <div className="my-1 bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs text-slate-700 font-medium shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="p-1 px-2.5 bg-shiraz/10 text-shiraz border border-shiraz/20 font-bold rounded-lg text-xs uppercase tracking-wider shrink-0">
                        Hinweis
                      </span>
                      <span>Studiengangsleiter: <strong>Prof. Huber</strong></span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium font-mono">ibi / THA</span>
                  </div>
                )}
                <p className="text-xs text-text-main/60 leading-relaxed italic">
                  {program.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-stone-50 p-4 border border-home-grau/15 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-xs uppercase font-bold tracking-wider text-text-main/40 flex items-center gap-1 font-mono">
                    <Award size={12} /> Akademischer Grad / Abschluss
                  </span>
                  <strong className="text-sm font-bold text-text-main">{program.degree}</strong>
                </div>
                <div className="bg-stone-50 p-4 border border-home-grau/15 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-xs uppercase font-bold tracking-wider text-text-main/40 flex items-center gap-1 font-mono">
                    <Calendar size={12} /> Regelstudienzeit / Struktur
                  </span>
                  <strong className="text-sm font-bold text-text-main">{program.duration}</strong>
                </div>
                <div className="bg-stone-50 p-4 border border-home-grau/15 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-xs uppercase font-bold tracking-wider text-text-main/40 flex items-center gap-1 font-mono">
                    <Clock size={12} /> Format &amp; Präsenz
                  </span>
                  <strong className="text-sm font-bold text-text-main">{program.format}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 border-t border-home-grau/10 pt-4">
                <div>
                  <h4 className="font-bold text-text-main text-sm mb-3 flex items-center gap-1.5">
                    <ChevronRight size={16} className={program.iconColor} /> {program.modulesTitle}
                  </h4>
                  <ul className="space-y-2">
                    {program.modules.map((item, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-text-main/85">
                        <CheckCircle2 size={13} className="text-shiraz shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-text-main text-sm mb-3 flex items-center gap-1.5">
                    <ChevronRight size={16} className={program.iconColor} /> {program.benefitsTitle}
                  </h4>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3">
                    {program.benefitsIntro}
                  </p>
                  <ul className="space-y-2">
                    {program.benefits.map((item, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-text-main/85">
                        <CheckCircle2 size={13} className="text-shiraz shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 17: Studiendaten, Gebühren, Module und Links mit tha.de abgeglichen, Stand 22.10.2026; Angaben können sich ändern)"
        wikipedia={[
          { title: 'Technische Hochschule Augsburg', url: 'https://de.wikipedia.org/wiki/Technische_Hochschule_Augsburg' },
          { title: 'Bauingenieurwesen', url: 'https://de.wikipedia.org/wiki/Bauingenieurwesen' }
        ]}
        literatur={[
          'Kochendörfer, B.; Liebchen, J. H.; Viering, M. G.: Bau-Projektmanagement: Grundlagen und Vorgehensweisen (Springer Vieweg)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'AHO-Heft Nr. 9 (Projektmanagementleistungen in der Bau- und Immobilienwirtschaft)', url: 'https://www.aho.de/' },
          { title: 'VOB/B (Allgemeine Vertragsbedingungen für die Ausführung von Bauleistungen)' },
          { title: 'DIN 68800 (Holzschutz im Hochbau)' },
          { title: 'DIN 18516 (Außenwandbekleidungen, hinterlüftet)' }
        ]}
        weblinks={[
          { title: 'THA_ibi – Institut für Bau und Immobilie', url: 'https://www.tha.de/ibi' },
          { title: 'Bachelor Bauingenieurwesen - THA', url: 'https://www.tha.de/hochschule/fakultaet/ab/studienangebot/bauingenieurwesen-beng/' },
          { title: 'TTZ Aichach - Technologietransferzentrum', url: 'https://www.tha.de/forschung/technologietransfer/technologietransferzentren/ttz-aichach/' },
          { title: 'MAPR - Master of Applied Research', url: 'https://www.tha.de/hochschule/fakultaet/elektrotechnik/studienangebot/master-applied-research/' }
        ]}
        hideFormeln={true}
      />
    </div>
  );
}
