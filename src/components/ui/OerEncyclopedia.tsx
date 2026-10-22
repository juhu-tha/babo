import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  Database, 
  FlaskConical, 
  Award, 
  Gamepad2, 
  Compass, 
  ExternalLink, 
  ArrowRight, 
  Play, 
  RotateCcw,
  CheckCircle2,
  Sliders,
  Sparkles,
  Search,
  BookMarked
} from 'lucide-react';

export function OerEncyclopedia() {
  const [activeChapter, setActiveChapter] = useState<number>(1);
  
  // Tensile test interactive simulation state
  const [tensileForce, setTensileForce] = useState<number>(0); // 0 to 120 kN
  const [probeBroken, setProbeBroken] = useState<boolean>(false);
  
  // Concrete compression test state
  const [concreteClass, setConcreteClass] = useState<'C25/30' | 'C50/60'>('C25/30');
  const [probeType, setProbeType] = useState<'Wuerfel' | 'Zylinder'>('Wuerfel');
  const [compressionForce, setCompressionForce] = useState<number>(0); // 0 to 1000 kN
  const [concreteCrushed, setConcreteCrushed] = useState<boolean>(false);

  // Search filter for external links mentioned in the encyclopedia
  const [resourceSearch, setResourceSearch] = useState<string>('');

  // Computations for steel tensile test
  // Probe parameters: circular cross section with dynamic radius changes under necking
  const l0 = 100; // Original length (mm)
  const d0 = 12; // Original diameter (mm)
  const a0 = Math.PI * Math.pow(d0 / 2, 2); // original cross section ~113.1 mm²
  const E = 210000; // Young's modulus (MPa)
  const re = 350; // Yield strength (MPa) - ~39.6 kN
  const rm = 510; // Ultimate tensile strength (MPa) - ~57.7 kN
  const fractureStrain = 22; // fracture strain (%)

  // Real-time calculation of strain and active stress based on a generic elastic-plastic with necking model
  const forceN = tensileForce * 1000;
  let stress = forceN / a0; // nominal stress
  let strain = 0; // % strain
  let statusText = 'Unbelastet';
  let statusColor = 'text-slate-400';

  if (tensileForce === 0) {
    stress = 0;
    strain = 0;
    statusText = 'Ausgangszustand (unbelastet)';
    statusColor = 'text-slate-500 bg-slate-50 border-slate-200';
  } else if (stress <= re) {
    // Elastic deformation stage
    strain = (stress / E) * 100; // in %
    statusText = 'Elastischer Bereich (Hooke’sches Gesetz)';
    statusColor = 'text-blue-700 bg-blue-50 border-blue-200';
  } else if (stress > re && tensileForce < 58) {
    // Plastic deformation / strain hardening
    const excessStress = stress - re;
    strain = (re / E) * 100 + Math.pow(excessStress / 10, 1.8);
    statusText = 'Plastischer Fließbereich (Duktile Dehnung)';
    statusColor = 'text-yellow-750 bg-yellow-50 border-yellow-200';
  } else if (tensileForce >= 58 && tensileForce < 72) {
    // Necking stage (constriction)
    strain = 12 + (tensileForce - 58) * 0.8;
    statusText = 'Einschnürung beginnt (Lokales Necking)';
    statusColor = 'text-orange-700 bg-orange-50 border-orange-200';
  } else {
    // Necking increases rapidly, then abrupt failure
    strain = 21.5;
    statusText = 'Maximale Zugkraft überschritten - Unmittelbar vor Bruch!';
    statusColor = 'text-red-750 bg-red-50 border-red-200 animate-pulse';
  }

  // Trigger rupture if load exceeds 72 kN (rupture threshold for this modeled sample)
  const handleTensileChange = (val: number) => {
    if (val >= 72) {
      setProbeBroken(true);
      setTensileForce(72);
    } else {
      setProbeBroken(false);
      setTensileForce(val);
    }
  };

  const resetTensile = () => {
    setTensileForce(0);
    setProbeBroken(false);
  };

  // Computations for Concrete Compression Test
  // C25/30 cube standard capacity: 25 MPa cylinder, 30 MPa cube
  // Standard cube (150mm): A = 22500 mm²
  // Standard cylinder (150/300mm): A = 17671 mm²
  const concreteArea = probeType === 'Wuerfel' ? 22500 : 17671;
  const characteristicStrength = concreteClass === 'C25/30' 
    ? (probeType === 'Wuerfel' ? 30 : 25) 
    : (probeType === 'Wuerfel' ? 60 : 50);

  // Failure Force in kN = (Strength * Area) / 1000
  const failureForceKn = Math.round((characteristicStrength * concreteArea) / 1000);
  const currentPressureMpa = Math.round((compressionForce * 1000) / concreteArea * 10) / 10;

  const handleCompressionChange = (val: number) => {
    if (val >= failureForceKn) {
      setConcreteCrushed(true);
      setCompressionForce(failureForceKn);
    } else {
      setConcreteCrushed(false);
      setCompressionForce(val);
    }
  };

  const resetCompression = () => {
    setCompressionForce(0);
    setConcreteCrushed(false);
  };

  // All curated resources mentioned in the encyclopedia for direct filtering search
  const ALL_RESOURCES = [
    { name: 'TIB AV-Portal', type: 'Audiovisuelle Plattform', description: 'Hochschul-Videoresearch der Nationalen Bibliothek mit automatischer Sprachtranskription und DOI-Referenzierung.', url: 'https://tib.eu/', tags: ['Video', 'TIB', 'Transkription', 'OER'] },
    { name: 'ETH Zurich Lab Video Tour', type: 'Videokanal', description: 'Einblicke in das $12M Automated Construction Lab und bahnbrechende digitale Montageprozesse.', url: 'https://www.youtube.com/watch?v=R_iM4bL6xK0', tags: ['ETH', 'Robotik', 'Druck', 'NEST'] },
    { name: 'ibac-ce RWTH Aachen', type: 'Uni-Portal', description: 'Begleitende Vorlesungsmaterialien und bauchemische Video-Erweiterungen für Baustoffkunde 1 & 2.', url: 'http://ibac-ce.rwth-aachen.de/', tags: ['Aachen', 'ibac', 'Lehre', 'Beton'] },
    { name: 'TUM Department of Mechanical Engineering', type: 'Videokanal', description: 'Vorlesungen zur angewandten Mechanik, Finite-Elemente-Kopplung und moderner Werkstoffanalyse.', tags: ['TUM', 'München', 'Mechanik'] },
    { name: 'TU Berlin (Myzel-Forschung)', type: 'Uni-Projekt', description: 'Biotechnologische Innovationen: Integrierte Dämmplatten und Pilzkulturen im Baustoffsektor.', tags: ['Berlin', 'Myzel', 'Biotech', 'Pilze'] },
    { name: 'twillo', type: 'OER-Portal', description: 'Niedersächsisches Portal zur kooperativen Erstellung und barrierefreien Verbreitung freier Studienmaterialien.', url: 'https://www.twillo.de/', tags: ['OER', 'Twillo', 'Curriculum', 'Lehre'] },
    { name: 'HOOU (Hamburg Open Online University)', type: 'OER-Portal', description: 'Interaktive Lernpfade zu Lehmbautechiken, biologischem Zirkulärbau und nachhaltigen Fügungen.', url: 'https://www.hoou.de/', tags: ['HOOU', 'Hamburg', 'Lernpfade', 'Lehm'] },
    { name: 'Material Archiv', type: 'Materialdatenbank', description: 'Schweizer Hochschulnetzwerk zur haptisch-sensorischen und qualitativen Klassifizierung von Werkstoffen.', url: 'https://www.materialarchiv.ch/', tags: ['Datenbank', 'Sensory', 'Schweiz', 'Kultur'] },
    { name: 'MaterialDistrict', type: 'Materialdatenbank', description: 'Globale Innovationsplattform für experimentelle, recycelte und kreislauffähige Baustoffe.', url: 'https://materialdistrict.com/', tags: ['Innovation', 'Zirkulär', 'Biobased', 'Trends'] },
    { name: 'WECOBIS', type: 'Öko-Datenbank', description: 'Produktneutrales Bundesportal zur gesundheitlichen, hygienischen und toxikologischen Baustoffbewertung.', url: 'https://www.wecobis.de/', tags: ['Bund', 'Schadstoffe', 'Gesundheit', 'BBSR'] },
    { name: 'ÖKOBAUDAT', type: 'Öko-Datenbank', description: 'Normierte Lebenszyklusdaten (GWP, AP, PENRT) und standardisierte Umweltproduktdeklarationen (EPDs).', url: 'https://www.oekobaudat.de/', tags: ['LCA', 'EPD', 'GWP', 'Klima', 'XML'] },
    { name: 'MINT-VR-Labs (BHT Berlin)', type: 'Virtuelles Labor', description: 'Immersive VR-Umgebungen zur Begehung komplexer BIM-Planungen und mechano-statischer Versuche.', url: 'https://projekt.bht-berlin.de/mint-vr-labs/', tags: ['VR', 'Labor', 'Simulation', 'Statik'] },
    { name: 'Karlsruher Institut für Technologie (KIT)', type: 'Virtuelles Labor', description: 'Computational Materials Science: Molekulare Modellierung und Simulation von Zementsteinstrukturen.', tags: ['KIT', 'Karlsruhe', 'Zement', 'Chemie'] },
    { name: 'Beton web.campus (IZB)', type: 'Industrie-Plattform', description: 'E-Learning-Portal zu Sichtbetonklassen, anspruchsvollen Fließmischungen und Infraleichtbeton.', url: 'https://www.beton-campus.de/', tags: ['IZB', 'Beton', 'Sichtbeton', 'Campus'] },
    { name: 'bauforumstahl', type: 'Industrie-Plattform', description: 'Bemessungshilfen ("Eurocode Easy") und Unterlagen zur Dekarbonisierung der Stahlproduktion ("Grüner Stahl").', url: 'https://www.bauforumstahl.de/', tags: ['Stahl', 'Eurocode', 'Tragwerk'] },
    { name: 'Informationsdienst Holz', type: 'Industrie-Plattform', description: 'Das herausragende Standardwerk für Eurocode 5 Bemessungen, Anschlussdetails und konstruktiven Holzschutz.', url: 'https://informationsdienst-holz.de/', tags: ['Holz', 'EC5', 'Fachschriften'] },
    { name: 'Ziegel Zentrum Süd', type: 'Industrie-Plattform', description: 'Detaillierter architektonischer Detailkatalog und Ziegellexikon für das einschalige Massivmauerwerk.', url: 'https://www.ziegel.de/', tags: ['Ziegel', 'Ziegellexikon', 'Mauerwerk'] },
    { name: 'ETHx: Regenerative Materials (edX)', type: 'MOOC', description: 'Renommierter Online-Kurs zum Bauen mit unbehandelten Naturbaustoffen wie Lehm, Stroh, Hanf und Bambus.', tags: ['edX', 'MOOC', 'Regenerative', 'Erde'] },
    { name: 'Materials Caching (TU Dortmund)', type: 'Gamification', description: 'Ortsbezogene interaktive Entdeckungsreisen im urbanen Raum zur physischen Lokalisierung von Baustoffen.', tags: ['Dortmund', 'Gamification', 'ActionBound'] }
  ];

  const filteredResources = ALL_RESOURCES.filter(res => 
    res.name.toLowerCase().includes(resourceSearch.toLowerCase()) ||
    res.description.toLowerCase().includes(resourceSearch.toLowerCase()) ||
    res.type.toLowerCase().includes(resourceSearch.toLowerCase()) ||
    res.tags.some(t => t.toLowerCase().includes(resourceSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6" id="oer-enzyklopaedie">
      {/* Intro Hero Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-2xl border border-indigo-900/40 text-white overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 p-8 opacity-10 shrink-0 select-none">
          <BookMarked size={160} className="text-white" />
        </div>
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[10px] font-extrabold tracking-wider uppercase">
            <Sparkles size={11} /> akademisches OER-Referenzwerk
          </div>
          <h3 className="text-2xl font-black tracking-tight leading-tight md:text-3xl">
            Digitale Transformation in der Baustofflehre
          </h3>
          <p className="text-indigo-200 text-xs md:text-sm leading-relaxed max-w-3xl">
            Eine wissenschaftlich kuratierte Enzyklopädie freier Lehrmaterialien, interaktiver Materialdatenbanken, virtueller Laborsimulationen und industrieller Weiterbildungsangebote für Lehre und Praxis.
          </p>
        </div>
      </div>

      {/* Main Chapter Navigation Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Side Menu (Chapters) */}
        <div className="md:col-span-1 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block px-2 mb-2">Chapters & Kapitel</span>
          {[
            { nr: 1, label: "1. Paradigmenwechsel", icon: BookOpen, desc: "Die hybride Baustofflehre" },
            { nr: 2, label: "2. Audiovisuelle Medien", icon: Video, desc: "TIB AV-Portal & Uni-Schnitt" },
            { nr: 3, label: "3. Materialdatenbanken", icon: Database, desc: "Ökologische Speicherwerke" },
            { nr: 4, label: "4. Virtuelle Laboratorien", icon: FlaskConical, desc: "Interaktive Baustoffprüfung" },
            { nr: 5, label: "5. Industrie-Allianzen", icon: Award, desc: "Wissenstransfer zur Praxis" },
            { nr: 6, label: "6. Gamification & MOOC", icon: Gamepad2, desc: "Spielerisch lehren" },
            { nr: 7, label: "7. Synthese & Handeln", icon: Compass, desc: "Empfehlungen & Leitlinien" }
          ].map((chap) => (
            <button
              key={chap.nr}
              onClick={() => setActiveChapter(chap.nr)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 group relative ${
                activeChapter === chap.nr
                  ? 'bg-shiraz border-shiraz text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-slate-50'
              }`}
            >
              <chap.icon className={`shrink-0 mt-0.5 ${activeChapter === chap.nr ? 'text-white' : 'text-slate-400 group-hover:text-shiraz'}`} size={16} />
              <div>
                <strong className="block text-xs font-bold leading-tight">{chap.label}</strong>
                <span className={`text-[10px] block leading-normal mt-0.5 ${activeChapter === chap.nr ? 'text-white/80' : 'text-slate-500 font-normal'}`}>
                  {chap.desc}
                </span>
              </div>
              {activeChapter === chap.nr && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 p-1 rounded-full">
                  <ArrowRight size={10} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Right Side Content Pane */}
        <div className="md:col-span-3 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col justify-between">
          
          {/* Chapter Content Wrapper */}
          <div className="space-y-6">
            
            {/* Chapter 1: Paradigmenwechsel */}
            {activeChapter === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-black text-slate-800">1. Einleitung: Der Paradigmenwechsel in der materialtechnologischen Ausbildung</h4>
                  <span className="text-[10px] text-shiraz font-bold uppercase tracking-wider block mt-1">Akademischer Diskurs</span>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  Die akademische Disziplin der Baustoffkunde, traditionell verankert in der physischen Interaktion mit Materie, der haptischen Erfassung von Oberflächen und der empirischen Beobachtung von Bruchmechaniken im analogen Labor, befindet sich in einer Phase tiefgreifender Transformation. Für Studierende der Architektur, des Bauingenieurwesens und angrenzender Disziplinen wie der Materialwissenschaft oder des Umweltingenieurwesens stellt sich im 21. Jahrhundert eine doppelte Herausforderung.
                </p>

                <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r-xl my-4 text-xs italic text-slate-700 leading-relaxed">
                  "Studierende müssen nicht nur die klassischen physikalischen, chemischen und mechanischen Eigenschaften von Werkstoffen – von der Druckfestigkeit des Betons bis zur Anisotropie des Holzes – beherrschen, sondern dieses Wissen zunehmend in digitalen, vernetzten und ökologisch bewerteten Kontexten anwenden."
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Die Notwendigkeit, Lehrinhalte digital verfügbar zu machen, wurde nicht zuletzt durch globale Zäsuren, die den Zugang zu physischen Lehrsälen und Laboren einschränkten, beschleunigt. Doch weit über die Notlösung der Distanzlehre hinaus hat sich ein Ökosystem an freien, online zugänglichen Ressourcen etabliert, das didaktisch neue Wege beschreitet. Der moderne <strong>"Baustoffkunde-Campus"</strong> ist hybrid: Er erstreckt sich von der klassischen Vorlesungshalle über virtuelle Labore, in denen Zerstörungsprüfungen ohne Materialverlust simuliert werden, bis hin zu semantisch durchsuchbaren Videodatenbanken und interaktiven Ökobilanz-Tools.
                </p>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Dieser Bericht bietet eine erschöpfende Analyse dieser digitalen Landschaft. Er untersucht nicht nur die Verfügbarkeit von Ressourcen, sondern bewertet deren didaktische Tiefe, ihre technische Umsetzung und ihren Beitrag zur akademischen Kompetenzentwicklung. Dabei werden die Quellen in funktionale Cluster unterteilt: von audiovisuellen Medienplattformen bis hin zu Simulationen und industriegestützten Bildungsinitiativen, die den Transfer von der Theorie in die baupraktische Anwendung leisten.
                </p>

                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex gap-3.5 items-start text-xs text-indigo-950">
                  <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold mb-1">OER & Chancengleichheit</strong>
                    Ein besonderer Fokus liegt auf der open Educational Resources (OER)-Bewegung und der Frage, wie frei zugängliches Wissen die Chancengleichheit in der Bildung erhöht und gleichzeitig durch die Einbindung aktueller Forschungsergebnisse – etwa zu mycelbasierten Baustoffen oder Infraleichtbeton – die Innovationskraft stärkt.
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 2: Audiovisuelle Wissensarchitekturen */}
            {activeChapter === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-black text-slate-800">2. Audiovisuelle Wissensarchitekturen: Vom Lehrfilm zur semantischen Videoanalyse</h4>
                  <span className="text-[10px] text-shiraz font-bold uppercase tracking-wider block mt-1">Video-Plattformen & OER</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Die Vermittlung werkstoffkundlicher Phänomene profitiert in besonderem Maße von bewegten Bildern. Das rheologische Verhalten von Frischbeton, der duktile Bruch von Stahl oder die robotergestützte Fertigung komplexer Holztragwerke lassen sich durch statische Skizzen oder Textbeschreibungen oft nur unzureichend erfassen. Der digitale Raum bietet hier weit mehr als nur das Abspielen von Filmen; er ermöglicht durch fortschrittliche Metadaten-Strukturen und Analysetools einen gezielten, forschenden Zugriff auf audiovisuelles Material.
                </p>

                {/* Specific platform: TIB AV-Portal */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Video className="text-indigo-600" size={15} /> 2.1 Das TIB AV-Portal (Hannover)
                    </span>
                    <a href="https://tib.eu/" target="_blank" rel="noopener noreferrer" className="text-[10px] hover:underline inline-flex items-center gap-1 font-bold text-shiraz">
                      tib.eu öffnen <ExternalLink size={10} />
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Im Zentrum der wissenschaftlichen Videorecherche im deutschsprachigen Raum steht das TIB AV-Portal der Technischen Informationsbibliothek (TIB) in Hannover. Es unterscheidet sich fundamental von kommerziellen Videoplattformen durch seinen Fokus auf Langzeitverfügbarkeit, Zitierfähigkeit und rechtlich belastbare Nutzung im akademischen Kontext.
                  </p>
                  
                  {/* Semantic analysis simulator/infographic */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Interaktive Semantische Suche (Muster):</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value="Hydratationswärme" 
                        className="text-[10px] border border-slate-200 rounded px-2 py-1 bg-slate-50 text-indigo-700 font-mono flex-1 focus:outline-none"
                      />
                      <button className="bg-indigo-650 hover:bg-indigo-700 text-white rounded px-3 py-1 text-[10px] font-bold flex items-center gap-1 shrink-0">
                        <Play size={10} /> Suchen
                      </button>
                    </div>
                    <div className="bg-slate-900 text-white p-2.5 rounded text-[9px] font-mono flex items-center justify-between">
                      <span className="text-slate-400">[Found at 04:12]</span>
                      <span className="text-emerald-300">"...wird beim Erhärten des Zements Hydratationswärme frei, die..."</span>
                      <span className="text-indigo-300 bg-indigo-500/20 px-1 rounded hover:underline cursor-pointer">Jump to frame 📌</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] pt-1">
                    <div className="p-2 bg-indigo-50/50 border border-indigo-100 rounded">
                      <strong className="block text-indigo-950 font-bold">Spracherkennung</strong>
                      Gesprochene Worte werden transkribiert und durchsuchbar gemacht (ASR).
                    </div>
                    <div className="p-2 bg-emerald-50/50 border border-emerald-100 rounded">
                      <strong className="block text-emerald-950 font-bold">Zitierfähigkeit (DOI)</strong>
                      Vergabe von Digital Object Identifiers garantiert permanente Zitierbarkeit.
                    </div>
                    <div className="p-2 bg-purple-50/50 border border-purple-100 rounded">
                      <strong className="block text-purple-955 font-bold">Open Access (CC)</strong>
                      Rechtlich belastbare Lizenzen erlauben Remixen, Einbinden und Verbreiten.
                    </div>
                  </div>
                </div>

                {/* Subchapter 2.2: Universitäre Videokanäle */}
                <div className="space-y-3 pt-2">
                  <h5 className="text-xs font-bold text-slate-800">2.2 Universitäre Videokanäle: Einblicke in Forschung und Lehre</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs">
                      <strong className="text-xs font-bold text-slate-800 block">ETH Zürich: Avantgarde & Robotik</strong>
                      <p className="text-[11px] text-slate-600 leading-normal font-normal">
                        Entwurf HiLo/NEST (Schnittstelle Materialwissenschaft und digitale Fabrikation). Visualisiert den Wandel von der handwerklichen zur industriellen, datengesteuerten Produktion mit Schalungsalternativen.
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs">
                      <strong className="text-xs font-bold text-slate-800 block">RWTH Aachen (ibac) & TU München</strong>
                      <p className="text-[11px] text-slate-600 leading-normal font-normal">
                        Strukturierte Grundlagenlehre und Modulkombinationen für Baustoffkunde 1 & 2. Teaser, Laborvorführungen und direkte Verknüpfungen mit der theoretischen Ausbildung vor Ort.
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs col-span-1 md:col-span-2">
                      <strong className="text-xs font-bold text-slate-800 block">TU Berlin: Biotechnologische Horizonte (Pilze & Myzel)</strong>
                      <p className="text-[11px] text-slate-600 leading-normal font-normal">
                        Präsentiert bio-basierte Werkstoffe der Zukunft. Erforscht, wie dichte Pilzgeflechte auf landwirtschaftlichen Reststoffen wachsen und zu biologisch rückführbaren Dämmplatten oder tragenden Mauersteinen reifen.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subchapter 2.3: OER-Plattformen */}
                <div className="p-4 bg-blue-50/40 border border-blue-150 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">2.3 Offene OER-Bildungsportale: Twillo & HOOU</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    <strong>Twillo</strong> (Niedersachsen) agiert als zentraler Verteilerknoten, der digitale Videos direkt mit interaktiven Vorlesungsfolien und Klausurauszügen verknüpft. Die <strong>Hamburg Open Online University (HOOU)</strong> stellt reich bebilderte und didaktisch aufbereitete interaktive Lernpfade zu ökologischen Rohstoffen wie Lehmbau bereit.
                  </p>
                </div>
              </div>
            )}

            {/* Chapter 3: Materialdatenbanken */}
            {activeChapter === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-black text-slate-800">3. Materialdatenbanken: Das digitale Gedächtnis der Werkstoffe</h4>
                  <span className="text-[10px] text-shiraz font-bold uppercase tracking-wider block mt-1">Strukturdaten & quantitative Kennwerte</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  In einer Zeit, in der die Vielfalt der verfügbaren Bauprodukte exponentiell wächst, ist das bloße Auswendiglernen historischer Kennwerte obsolet. An die Stelle des enzyklopädischen Wissens tritt die Kompetenz zur gezielten Recherche in spezialisierten Datenbanken. Diese Core-Tools sind für Studierende und Planende unverzichtbar, um Baustoffentscheidungen präzise zu untermauern.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                  <div className="p-4 border border-slate-200 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Database className="text-amber-600" size={14} /> 3.1 Material Archiv (Schweiz)
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Netzwerkprojekt schweizerischer Hochschulen (u.a. ETH Zürich, ZHdK). Besticht durch Tiefeninformationen zu <strong>Sensorik (Haptik, Optik, Geruch)</strong>, handwerklichen Fügungen und Verweisbeispielen aus Architektur und Design.
                    </p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="text-purple-600" size={14} /> 3.2 MaterialDistrict & Trends
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Zukunftsgerichtetes Portal zur Trendbeobachtung. Filterung nach performativen Kriterien wie Lichtdurchlässigkeit (Translucency), Schallabsorption und biobasierten/recycelten Stoffzusätzen.
                    </p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl space-y-2 col-span-1 md:col-span-2">
                    <span className="text-xs font-bold text-indigo-900 block">3.3 Ökologische Bundesdatenbanken: WECOBIS & ÖKOBAUDAT</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Wissenschaftliches Schadstoffmanagement im Innenausbau und präzise Quantifizierung der Treibhausgaspotenziale (GWP, AP). Die <strong>ÖKOBAUDAT</strong> stellt normgerechte Datensätze (Module A1-D) zur Berechnung von Gebäudeökobilanzen (LCA) nach EN 15804 bereit.
                    </p>
                  </div>
                </div>

                {/* Table 1: Database comparison */}
                <div className="space-y-2 pt-2">
                  <strong className="text-xs font-bold text-slate-800 block">Tabelle 1: Wissenschaftlicher Vergleich der Materialdatenbanken</strong>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="p-3">Datenbank</th>
                          <th className="p-3">Kernfokus</th>
                          <th className="p-3">Inhaltstyp</th>
                          <th className="p-3">Besonderheit / Mehrwert</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        <tr>
                          <td className="p-3 font-bold text-slate-800">Material Archiv</td>
                          <td className="p-3">Werkstoffkunde & Haptik</td>
                          <td className="p-3">Qualitative Texte, Historie, Proben</td>
                          <td className="p-3 text-[11px]">Enge Vernetzung mit physischen Mustersammlungen</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-slate-800">MaterialDistrict</td>
                          <td className="p-3">Zukunft, Design & Trends</td>
                          <td className="p-3">Produktbilder, Herstellerdaten</td>
                          <td className="p-3 text-[11px]">Fokus auf biobasierte und kreislaufreife Neuheiten</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-slate-800">WECOBIS</td>
                          <td className="p-3">Toxikologie, Innenraumhygiene</td>
                          <td className="p-3">Analysen nach Lebenszyklusphasen</td>
                          <td className="p-3 text-[11px]">Detektiert verdeckte Schadstoffe im Altbaubestand</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-slate-800">ÖKOBAUDAT</td>
                          <td className="p-3">Gebäude-Ökobilanzierung (LCA)</td>
                          <td className="p-3">Quantitative XML-Daten (EN 15804)</td>
                          <td className="p-3 text-[11px]">Verbindlich für BNB-Bewertungen & QNG-Zertifikate</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 4: Virtuelle Laboratorien */}
            {activeChapter === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-black text-slate-800">4. Virtuelle Labore und Simulationen: Das Experiment im digitalen Raum</h4>
                  <span className="text-[10px] text-shiraz font-bold uppercase tracking-wider block mt-1">Interaktives Lernen</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Das Laborpraktikum ist ein didaktisches Nadelöhr im Ingenieurstudium. Begrenzte Plätze vor Ort, hohe Materialgestellungskosten und sicherheitsrelevante Risiken limitieren den physischen Zugang. Virtuelle Labore (Virtual Labs) und Simulationen demokratisieren diesen Zugang, indem sie Experimente ortsunabhängig erlebbar machen.
                </p>

                {/* Subchapter details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
                  <strong className="text-slate-800 font-bold block">4.1 Didaktik & 4.4 Immersive VR-Labore (KIT & BHT Berlin)</strong>
                  <p>
                    <strong>MINT-VR-Labs (BHT Berlin)</strong> ermöglicht das visuelle Begehen statischer Biegebalken zur Erfassung von Querkräften und Momentenverläufen. Das <strong>Karlsruher Institut für Technologie (KIT)</strong> simuliert chemisch-mineralogische mikrostrukturelle Prozesse auf atomarer Ebene im Zementstein anstelle klassischer grober Zerstörungsproben.
                  </p>
                </div>

                {/* INTERACTIVE COMPONENT 1: Steel Tensile Test Simulator */}
                <div className="border border-indigo-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                  <div className="bg-indigo-900 p-4 text-white flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold flex items-center gap-1.5">
                        <FlaskConical className="text-indigo-300" size={15} /> 4.2 Interaktiver Virtueller Zugversuch (Steel Tensile Test)
                      </h5>
                      <span className="text-[9px] text-indigo-200">Simuliertes Baustahlelement (d₀ = 12 mm, l₀ = 100 mm)</span>
                    </div>
                    <button 
                      onClick={resetTensile}
                      className="p-1 px-2.5 bg-indigo-805 hover:bg-indigo-800 text-[10px] rounded border border-indigo-700 font-semibold flex items-center gap-1 transition-all"
                    >
                      <RotateCcw size={11} /> Reset Test
                    </button>
                  </div>
                  
                  <div className="p-5 space-y-5">
                    
                    {/* Visual Probe Representation */}
                    <div className="bg-slate-100 p-6 rounded-xl flex flex-col items-center justify-center border border-slate-200 relative">
                      <span className="text-[9px] uppercase font-bold text-slate-400 absolute top-2 right-3">Dynamischer Prüfkörper</span>
                      
                      {/* Tensile Jaw Top */}
                      <div className="w-16 h-4 bg-slate-500 rounded-t border-b-2 border-slate-600"></div>
                      
                      {/* Steel Specimen Bar */}
                      <div className="relative flex flex-col items-center">
                        {probeBroken ? (
                          <div className="space-y-4">
                            {/* Broken upper half */}
                            <div className="w-4 h-12 bg-gradient-to-r from-slate-400 to-slate-500 rounded shadow-sm border-b border-dashed border-red-500" style={{ transform: 'translateY(-2px)' }}></div>
                            <span className="text-[9px] font-extrabold text-red-600 bg-red-100/80 px-2 py-0.5 rounded border border-red-200 animate-bounce block text-center uppercase tracking-wider">
                              Probe gebrochen! (72 kN)
                            </span>
                            {/* Broken lower half */}
                            <div className="w-4 h-12 bg-gradient-to-r from-slate-400 to-slate-500 rounded shadow-sm border-t border-dashed border-red-500" style={{ transform: 'translateY(2px)' }}></div>
                          </div>
                        ) : (
                          <div 
                            className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-500 border-x border-slate-500/30 shadow-xs transition-all duration-100" 
                            style={{ 
                              height: `${70 + (strain * 1.5)}px`, 
                              width: `${tensileForce >= 58 ? 14 : 16}px`,
                              borderRadius: '2px',
                              // Simulate Necking (constriction) in the middle using a clip-path under high strain
                              clipPath: tensileForce >= 58 
                                ? 'polygon(0% 0%, 100% 0%, 100% 30%, 75% 50%, 100% 70%, 100% 100%, 0% 100%, 0% 70%, 25% 50%, 0% 30%)' 
                                : 'none'
                            }}
                          >
                            {/* Stress Color Overlay (turns red under high hardening) */}
                            <div 
                              className="w-full h-full bg-red-600/35 transition-all duration-100"
                              style={{ opacity: Math.min(stress / rm, 0.95) }}
                            ></div>
                          </div>
                        )}
                      </div>

                      {/* Tensile Jaw Bottom */}
                      <div className="w-16 h-4 bg-slate-500 rounded-b border-t-2 border-slate-600"></div>
                    </div>

                    {/* Simulation Controls */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Sliders className="text-indigo-600" size={13} /> Prüfkraft steigern (Zugbelastung F):
                        </label>
                        <span className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 p-1 px-1.5 rounded">
                          {formatDeWert(tensileForce)} kN / 72 kN
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="75" 
                        step="1"
                        disabled={probeBroken}
                        value={tensileForce}
                        onChange={(e) => handleTensileChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-205 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                      />
                      
                      {/* Stress-Strain Realtime Data */}
                      <div className={`p-3.5 rounded-xl border-l-4 text-xs ${statusColor} border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5`}>
                        <div className="space-y-0.5">
                          <strong className="block font-bold">Zustand der Zugprobe:</strong>
                          <span>{statusText}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px] text-slate-700 bg-white/80 p-2 rounded-lg border border-slate-100 italic">
                          <div>Spannung (σ): <span className="font-bold text-indigo-700">{formatDeWert(Math.round(stress))} MPa</span></div>
                          <div>Dehnung (ε): <span className="font-bold text-indigo-700">{formatDeZahl(strain, 3)} %</span></div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* INTERACTIVE COMPONENT 2: Concrete Compression Test Simulator */}
                <div className="border border-emerald-250 rounded-2xl overflow-hidden shadow-xs bg-white">
                  <div className="bg-emerald-900 p-4 text-white flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold flex items-center gap-1.5">
                        <FlaskConical className="text-emerald-300" size={15} /> 4.3 Interaktiver Virtueller Druckversuch (Concrete Compression)
                      </h5>
                      <span className="text-[9px] text-emerald-200">Bruchversuch mineralischer Bauteile</span>
                    </div>
                    <button 
                      onClick={resetCompression}
                      className="p-1 px-2.5 bg-emerald-805 hover:bg-emerald-800 text-[10px] rounded border border-emerald-700 font-semibold flex items-center gap-1 transition-all"
                    >
                      <RotateCcw size={11} /> Reset Test
                    </button>
                  </div>

                  <div className="p-5 space-y-5">
                    
                    {/* Selectors and configuration */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Beton-Festigkeitsklasse</label>
                        <select 
                          disabled={compressionForce > 0}
                          value={concreteClass} 
                          onChange={(e) => setConcreteClass(e.target.value as any)}
                          className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white text-slate-700 focus:outline-none"
                        >
                          <option value="C25/30">C25/30 (Normalbeton)</option>
                          <option value="C50/60">C50/60 (Hochfest)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Geometrie des Körpers</label>
                        <select 
                          disabled={compressionForce > 0}
                          value={probeType} 
                          onChange={(e) => setProbeType(e.target.value as any)}
                          className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white text-slate-700 focus:outline-none"
                        >
                          <option value="Wuerfel">Würfel (150 mm)</option>
                          <option value="Zylinder">Zylinder (150/300 mm)</option>
                        </select>
                      </div>
                    </div>

                    {/* Visual Probe for Concrete */}
                    <div className="bg-slate-100 p-8 rounded-xl flex flex-col items-center justify-center border border-slate-200 relative min-h-[145px]">
                      
                      {/* Press Plate Top */}
                      <div className="w-24 h-5 bg-gradient-to-b from-slate-600 to-slate-700 rounded-t border-b border-slate-900 shadow-sm" style={{ transform: `translateY(${Math.min(compressionForce / failureForceKn * 12, 12)}px)` }}></div>
                      
                      {/* Concrete Specimen */}
                      <div className="my-2 transition-all relative">
                        {concreteCrushed ? (
                          <div className="w-16 h-16 flex items-center justify-center relative">
                            {/* Stylized crushed concrete blocks */}
                            <div className="absolute inset-0 bg-slate-400 border border-slate-500 rounded opacity-20 scale-95"></div>
                            {/* Jagged crack overlays */}
                            <span className="text-[9px] font-black text-rose-800 bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded shadow-sm relative z-10 select-none tracking-tight text-center uppercase animate-pulse">
                              ZERSTÖRT BEI {formatDeWert(failureForceKn)} kN
                            </span>
                            <div className="absolute -left-2 top-2 w-4 h-8 bg-slate-350 border border-slate-400 rounded rotate-12"></div>
                            <div className="absolute -right-2 top-4 w-5 h-6 bg-slate-350 border border-slate-400 rounded -rotate-45"></div>
                          </div>
                        ) : (
                          <div 
                            className={`transition-all bg-slate-300 border-x border-slate-400 shrink-0 shadow-sm ${probeType === 'Wuerfel' ? 'w-16 h-16 rounded-sm' : 'w-12 h-20 rounded-lg'}`}
                            style={{ 
                              filter: 'contrast(1.1)',
                              backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
                              backgroundSize: '10px 10px',
                              transform: `scaleY(${1 - (compressionForce / failureForceKn * 0.05)})`
                            }}
                          >
                            {/* Overlay cracks dynamically based on force */}
                            {compressionForce > (failureForceKn * 0.5) && (
                              <div className="absolute inset-0 bg-red-400/10 flex items-center justify-center">
                                <span className="text-[8px] text-red-650 font-bold select-none rotate-12 animate-pulse">Haarrisse ⚡</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Press Plate Bottom */}
                      <div className="w-24 h-5 bg-gradient-to-t from-slate-600 to-slate-700 rounded-b border-t border-slate-900 shadow-sm"></div>
                    </div>

                    {/* Pressure slider and outputs */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Sliders className="text-emerald-600" size={13} /> Zylinder-/Würfeldruckbelastung steigern (F):
                        </label>
                        <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-50 p-1 px-1.5 rounded">
                          {formatDeWert(compressionForce)} kN / Max {formatDeWert(failureForceKn)} kN
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max={failureForceKn}
                        step="5"
                        disabled={concreteCrushed}
                        value={compressionForce}
                        onChange={(e) => handleCompressionChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-205 rounded-lg appearance-none cursor-pointer accent-emerald-605"
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600">
                        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                          <strong>Berechnete Flächenpressung:</strong>
                          <div className="font-mono text-emerald-950 font-bold text-xs mt-0.5">{formatDeWert(currentPressureMpa)} N/mm² (MPa)</div>
                        </div>
                        <div className="p-2.5 rounded bg-slate-50 border border-slate-200 shadow-xs">
                          <strong>Duktilität vs. Sprödigkeit:</strong>
                          <div className="text-[10px] leading-tight text-slate-500 mt-1">Normalbeton bricht kegelförmig mit Haarrissen, während C50/60 eine explosive Energiefreisetzung zeigt.</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* Chapter 5: Industrielle Bildungsinitiativen */}
            {activeChapter === 5 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-black text-slate-800">5. Industrielle Bildungsinitiativen: Die Brücke zur Praxis</h4>
                  <span className="text-[10px] text-shiraz font-bold uppercase tracking-wider block mt-1">Kooperativer Wissenstransfer</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Industrieverbände spielen eine entscheidende Rolle in der baustoffkundlichen Ausbildung. Ihre Materialien sind oft weitaus aktueller als veraltete Lehrbücher und praxisnäher als rein theoretische Uni-Skripte, da sie direkt den Stand der Technik, aktuelle Bemessungsregelungen und Normungsverfahren abbilden.
                </p>

                {/* Table 2: Associations overview */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 hover:shadow-sm transition-all">
                      <strong className="text-xs font-bold text-slate-800 block">5.1 Beton: InformationsZentrum Beton (IZB)</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                        Betreibt den <strong>Beton web.campus</strong>. Nach kostenloser Online-Registrierung erhalten Studierende Zugriff auf exklusive Vorlesungsreihen zu anspruchsvollem Sichtbeton, Infraleichtbeton, Dichtungskonzepten und dem Concrete Design Competition.
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 hover:shadow-sm transition-all">
                      <strong className="text-xs font-bold text-slate-800 block">5.2 Stahl: bauforumstahl</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                        Fokussiert sich stark auf den konstruktiven Ingenieurbau. Stellt kostenfreie Vorlesungsunterlagen zur Ressourceneffizienz, Ökobilanzierung und praktische Bemessungstools bereit ("Eurocode Easy").
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 hover:shadow-sm transition-all">
                      <strong className="text-xs font-bold text-slate-800 block">5.3 Holz: Informationsdienst Holz</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                        Gilt fachübergreifend als <strong>wissenschaftlicher Goldstandard</strong> für Fachpublikationen im Holzbau. Das E-Learning-Portal deckt die gesamte Eurocode 5-Planung, Verbundgliederungen und chemischen/konstruktiven Holzschutz ab.
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 hover:shadow-sm transition-all">
                      <strong className="text-xs font-bold text-slate-800 block">5.4 Mauerwerk: Ziegel Zentrum Süd e.V.</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                        Umfangreiche bauphysikalische Anschlüsse, Detailzeichnungen und Detailkataloge zur Wärmebrückenminimierung für das monolithische energiesparsame Ziegel-Mauerwerk.
                      </p>
                    </div>
                  </div>

                  {/* Association list and goals table */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <strong className="text-xs text-slate-800 font-bold block mb-2">Tabelle 2: Ressourcen der Industrieverbände im Überblick</strong>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] border-collapse bg-white">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                            <th className="p-2">Verband</th>
                            <th className="p-2 font-bold">Ressource</th>
                            <th className="p-2 font-bold">Schwerpunkt</th>
                            <th className="p-2 font-bold">Lehrformat</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="p-2 font-bold text-slate-700">InformationsZentrum Beton</td>
                            <td className="p-2">Beton web.campus</td>
                            <td className="p-2">Sichtbeton, Infraleichtbeton</td>
                            <td className="p-2 text-slate-500">Video-Seminare, Webinare</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold text-slate-700">bauforumstahl e.V.</td>
                            <td className="p-2">Download-Center</td>
                            <td className="p-2">Eurocode 3, Grüner Stahl</td>
                            <td className="p-2 text-slate-500">Eurocode-Tools, PDFs</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold text-slate-700">Informationsdienst Holz</td>
                            <td className="p-2">Holzbau-Handbücher</td>
                            <td className="p-2">Tragwerk, Eurocode 5, CAD</td>
                            <td className="p-2 text-slate-500">Schriftenreihen, CAD-Muster</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold text-slate-700">Ziegel Zentrum Süd</td>
                            <td className="p-2">Ziegel-Lexikon / Details</td>
                            <td className="p-2">Schallschutz, monolithischer Bau</td>
                            <td className="p-2 text-slate-500">Bemessungsblätter, Awards</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Chapter 6: Gamification, MOOCs */}
            {activeChapter === 6 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-black text-slate-800">6. Open Educational Resources (OER), Gamification und Peer-Learning</h4>
                  <span className="text-[10px] text-shiraz font-bold uppercase tracking-wider block mt-1">Graswurzel-Ökosystem & Interaktion</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Neben den großen, etablierten Institutionen wächst im Hintergrund ein "Graswurzel"-Ökosystem an kooperativen Lernhilfen und spielerischen Plattformen heran, das ganz bewusst auf Vernetzung und unkomplizierten interaktiven Peer-Austausch setzt.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <Gamepad2 className="text-rose-600 shrink-0 mt-1" size={20} />
                    <div className="space-y-1 text-xs">
                      <strong className="text-slate-800 font-bold block">6.1 Gamification: ActionBound & Materials Caching</strong>
                      <p className="text-slate-600 leading-relaxed">
                        Die TU Dortmund demonstriert mit dem Projekt "Baustoff-Caching", wie mobile Apps (ActionBound) für interaktive Schnitzeljagden zu städtischen Bauwerken oder Fertigungsanlagen genutzt werden können. Studierende entschlüsseln geologische Merkmale direkt am analogen Objekt im Stadtraum.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <BookOpen className="text-indigo-600 shrink-0 mt-1" size={20} />
                    <div className="space-y-1 text-xs">
                      <strong className="text-slate-800 font-bold block">6.2 Massive Open Online Courses (MOOCs)</strong>
                      <p className="text-slate-600 leading-relaxed">
                        Online-Angebote weltweiter Spitzenuniversitäten auf <strong>edX</strong>. Ein Highlight bildet der Kurs <i>"Regenerative Materials and Construction"</i> der ETH Zürich, der alternative organische Bindemittel und händischen Bau mit Naturmaterialien (Hanfstroh, Bambus, unverarbeiteter Lehm) lehrt.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <CheckCircle2 className="text-emerald-600 shrink-0 mt-1" size={20} />
                    <div className="space-y-1 text-xs">
                      <strong className="text-slate-800 font-bold block">6.3 Peer-Learning, Karteikarten & Altklausuren</strong>
                      <p className="text-slate-600 leading-relaxed">
                        Digitale Karteikartensätze auf Brainscape oder Repetico, erstellt von Studierenden für Studierende, erleichtern das prägnante Faktenlernen (Stoffklassen, DIN-Normen, Brandklassen). Studydrive dient dem unkomplizierten Austausch von Mitschriften und gedächtnisprotokollierten Prüfungsordnungen.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Chapter 7: Synthese & Handeln */}
            {activeChapter === 7 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-black text-slate-800">7. Synthese: Digitale Ressourcen klug nutzen</h4>
                  <span className="text-[10px] text-shiraz font-bold uppercase tracking-wider block mt-1">Handlungsempfehlungen für Lehre & Praxis</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Die digitale Landschaft der Baustoffkunde ist ungemein reichhaltig, aber oft fragmentiert über das Internet verteilt. Der erfolgreiche Nutzer von heute agiert deshalb zunehmend als Kurator seines eigenen materialtechnologischen Wissens, der fähig ist, verschiedene Medienformen zu einer ganzheitlichen Kompetenz zu vernetzen.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <strong className="text-xs font-bold text-slate-800 block">Klar strukturierte Handlungs-Leitlinien:</strong>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                    <div className="space-y-1">
                      <strong className="text-slate-800 font-semibold block">1. Visualisierung als Einstieg</strong>
                      <p className="text-[11px] leading-relaxed">Verwenden Sie vor dem Einstieg in komplexe theoretische Themen die animierten Vorlesungskanäle der TIB oder ETH, um ein haptisch-visuelles Gefühl für das Werkstoffphänomen zu erhalten.</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-slate-800 font-semibold block">2. Datenbasiert entwerfen</strong>
                      <p className="text-[11px] leading-relaxed">Integriere qualitative Daten des Material Archivs und quantitative Daten der ÖKOBAUDAT bereits in früheste Semester- und Entwurfsphasen zur materialgerechten Lebenszyklusplanung.</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-slate-800 font-semibold block">3. Praxisnormen absichern</strong>
                      <p className="text-[11px] leading-relaxed">Ergänze veraltete Handbücher durch hochaktuelle, werkseigene Planungsleitfäden der Industrieverbände (Holzbau Handbücher, Ziegel-Lexikon), um vor Ort DIN-konforme Baudetails zu planen.</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-slate-800 font-semibold block">4. Laboratorien virtuell vorarbeiten</strong>
                      <p className="text-[11px] leading-relaxed">Durchlaufe Zug- und Druckprüfungen in virtuellen webbasierten Simulatoren vor Antritt physischer zerstörender Uni-Praktika, um Messfehler und Verletzungen zu vermeiden.</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Die Zukunft der Baustofflehre ist grundlegend hybrid. Die hier geordneten hervorragenden Digitalressourcen können und sollen das haptische "Begreifen" des feuchten Tons oder schweren Betons nicht ersetzen, aber sie weiten den Innovationshorizont der kommenden Planergenerationen entscheidend und bereiten optimal auf eine digitalisierte, zirkuläre Baurealität vor.
                </p>

              </div>
            )}

          </div>

          {/* Persistent Chapter Interactive Resource Finder inside the Chapter Panel */}
          <div className="mt-8 pt-4 border-t border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/60">
              <div className="space-y-1">
                <strong className="text-xs text-indigo-950 font-bold flex items-center gap-1">
                  <Search size={13} className="text-indigo-600" /> Schnorchel nach Original-Links 
                </strong>
                <p className="text-[10px] text-indigo-800 leading-tight">Geben Sie Suchwörter wie "Beton", "edX" oder "TIB" ein, um die im Text referenzierten Links schnell zu finden.</p>
              </div>
              <input 
                type="text"
                placeholder="Ressource filtern..."
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                className="text-xs p-1.5 px-3 border border-indigo-200 rounded-lg w-full sm:w-48 bg-white text-slate-700 outline-none focus:ring-1 focus:ring-shiraz"
              />
            </div>

            <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
              {filteredResources.map((res, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-all flex items-center justify-between gap-4 text-[11px] leading-normal font-normal">
                  <div className="space-y-0.5">
                    <span className="bg-slate-200 text-slate-700 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded mr-2 inline-block">
                      {res.type}
                    </span>
                    <strong className="text-slate-800">{res.name}</strong>
                    <span className="text-slate-500 block text-[10px]">{res.description}</span>
                  </div>
                  <a 
                    href={res.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="shrink-0 p-1.5 bg-white border border-slate-300 rounded hover:border-shiraz hover:text-shiraz transition-all text-slate-700 shadow-xs flex items-center gap-1 text-[10px] font-semibold"
                  >
                    Besuchen <ExternalLink size={10} />
                  </a>
                </div>
              ))}
              {filteredResources.length === 0 && (
                <div className="text-center p-4 text-slate-400 text-[10px]">
                  Keine Quelle stimmt mit "{resourceSearch}" überein.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
