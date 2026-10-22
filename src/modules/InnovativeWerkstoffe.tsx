import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Layers, Lightbulb, Box, Sparkles, Cpu, Check, Zap, TrendingUp, Coins, Leaf, Scale, Settings, Activity, ChevronRight, AlertCircle, Info, HelpCircle, ArrowRight, Wrench, CheckCircle2 } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

interface MaterialProfile {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  co2Index: number; // 1-100 (lower is better, relative to standard concrete = 100)
  costIndex: number; // 100-500 (relative to standard concrete = 100)
  strength: string; // Compressive/Tensile description
  advantages: string[];
  disadvantages: string[];
  specs: Record<string, string>;
  details: string;
}

const FUTURE_MATERIALS: MaterialProfile[] = [
  {
    id: '3dcp',
    name: '3D-Betondruck (3DCP - 3D Concrete Printing)',
    category: 'Digitale Fertigungsverfahren',
    shortDesc: 'Schichtweiser, Schichtweiser, schalungsfreier Auftrag eines pumpbaren, thixotropen Feinkornbetons mit hoher Fließgrenze direkt aus dem Druckkopf. direkt aus dem Druckkopf ohne jegliche Holzschalungen.',
    co2Index: 65, // Saves CO2 because material is only printed where statically required (topology optimization)
    costIndex: 140, // High equipment cost, but saves human labor, scaffolding, and wood waste
    strength: 'Hohe Druckfestigkeit im Schichtverbund (oft 40-70 MPa); Zugkapazität gering und richtungsabhängig.',
    advantages: [
      'Kompletter Wegfall konventioneller Schalarbeiten (spart viel Zeit, Holzmüll und Lohnkosten)',
      'Unbegrenzte geometrische Gestaltungsfreiheit für Architekten (doppelt gekrümmte Freiformflächen)',
      'Topologieoptimierung: Material wird nur gedruckt, wo Kräfte fließen (bis zu 40% Betonmassen-Ersparnis)',
      'Digitaler Prozess: Direktes Drucken aus dem CAD/BIM-Modell verkürzt die Bauplanungskette im Rohbau'
    ],
    disadvantages: [
      'Ausgeprägte Festigkeitsanisotropie: Die Haftung zwischen den gedruckten Einzelschichten ist eine statische Schwachstelle',
      'Integration von Bewehrungen (Schub-/Biegezugkraft) bisher verfahrenstechnisch anspruchsvoll',
      'Sehr stringente Feuchtigkeits- und Temperaturregelung auf der Baustelle nötig (Zugluft führt zu Frühschwindrissen)'
    ],
    specs: {
      'Druckgeschwindigkeit': '10 bis 30 cm/Sekunde',
      'Größtkorn des Mörtels': '2 bis 4 mm (Feinstkornmischung)',
      'Pumpendruck': 'bis zu 120 bar',
      'Typische Schichtstärke': '10 bis 30 mm pro Bahn',
      'Statischer Nachweis': 'Bislang oft Einzelfallprüfungen (ZiE) oder verlorene Schalung notwendig'
    },
    details: 'Der 3D-Concrete-Printing-Prozess erfordert hochentwickelte, thixotrope Baustoffmischungen. Der Frischbeton muss im Schlauch pumpbar sein (geringe Viskosität), doch unmittelbar nach dem Verlassen der Düse standfest werden (hohe Fließgrenze im Stillstand), um das Eigengewicht der folgenden Schichten ohne Schalung zu tragen. Als innovative Bewehrungsmethoden werden heute endlose Carbonfäden im Druckkopf mitextrudiert, Mikrostahlfasern eingedüst, oder nachträglich Spannkabel durch verbleibende Hohlkammern gezogen.'
  },
  {
    id: 'carbon',
    name: 'Carbonbeton & Textilbeton (C³)',
    category: 'Innovative Bewehrungssysteme',
    shortDesc: 'Ersatz von korrosionsanfälligem Baustahl durch hochfeste, korrosionsfreie Gitterstrukturen aus Carbonfasern oder Glasfasern.',
    co2Index: 35, // Thick steel covers aren't needed. Saved concrete saves massive CO2.
    costIndex: 250, // Carbon is expensive but requires a fraction of concrete weight
    strength: 'Extreme Zugfestigkeit der Carbonfasern (Fasern bis ca. 3.000–5.000 N/mm²).000 MPa, ca. 6-mal stärker als Betonstahl).',
    advantages: [
      'Vollkommene Korrosionsfreiheit: Die dünne Beton-Erhaltungsschicht von 3-4 cm (zum Rostschutz von Stahl) entfällt komplett',
      'Filigrane Bauteilgeometrien: Bauteildicken können von 20 cm auf unter 5 cm reduziert werden (Gewichtsersparnis bis zu 75%)',
      'Instandsetzungs-Meilenstein: Perfekt zur flächigen Tragwerksverstärkung im Denkmalschutz oder bei Brückensanierungen',
      'Enorme Langlebigkeit: Gebrauchsdauern von über 100 Jahren ohne wesentliche Betonkorrosion'
    ],
    disadvantages: [
      'Hohe Materialkosten bei der Anschaffung des Carbongeleges im Vergleich zu standardmäßigem Baustahl',
      'Derzeit hoher Energieaufwand bei der Herstellung von Carbonfasern (sukzessiver Ersatz durch Bio-Carbon geplant)',
      'Kein ausgeprägtes Fließverhalten (sprödes Versagen ohne Vorwarnung), weshalb Überdimensionierungen nötig sind'
    ],
    specs: {
      'Zugfestigkeit Faser': 'ca. 3.000 bis 4.500 MPa',
      'Elastizitätsmodul': 'ca. 230.000 bis 260.000 MPa (Carbon)',
      'Notwendige Betondeckung': 'nur 10 bis 15 mm (reiner Verbundschutz, kein Rostschutz)',
      'Betonmatrix': 'Feinkornbeton mit optimiertem Fließverhalten',
      'CO₂-Reduktionspotenzial': 'bis zu 50% Einsparung auf Gesamtbauteilebene'
    },
    details: 'Da Carbon nicht rostet, benötigt man keine dicke alkalische Betondeckung, um die Bewehrung vor Luft und Wasser zu schützen. Es reicht eine dünne Matrix aus hochfließfähigem Feinkornbeton. Carbonbeton ermöglicht so extrem leichte, filigrane Architekturen (Hängedächer, dünne Fassadenschalen) und bietet neue Potenziale für das ressourceneffiziente Bauen. Die Verarbeitbarkeit erfolgt entweder als Fertigteil oder im Spritzbetonverfahren.'
  },
  {
    id: 'uhpc',
    name: 'Ultra-High Performance Concrete (UHPC)',
    category: 'Gefügeoptimierte Betone',
    shortDesc: 'Ultrahochfester Beton mit einem extrem dichten, porenfreien Gefüge und Druckfestigkeiten, Ultrahochfester Beton mit extrem dichtem, porenarmem Gefüge und Druckfestigkeiten von ca. 150–250 MPa..',
    co2Index: 50, // Very strong, so you need much less volume. Net CO2 is low.
    costIndex: 280, // Requires dense packing additives and high amount of binders
    strength: 'Extreme Druckfestigkeit von 150 bis über 250 MPa. Enorme Abriebs- und Verschleißresistenz.',
    advantages: [
      'Tragfähigkeit im Bereich von konstruktivem Stahl bei dämpfenden Eigenschaften des mineralischen Betons',
      'Extrem dichte Packung verwehrt Schadstoffen (Chloriden, Frost) jegliches Eindringen in das Gefüge',
      'Schnittbegrenzung: Filigranste Brückentragwerke, Fahrbahnübergänge und schlanke Stützen mit enormen Traglasten'
    ],
    disadvantages: [
      'Erhöhter Zementleimgehalt und Feinstfüller führen zu erhöhtem Schwindpotenzial',
      'Sehr sprödes Bruchverhalten: Muss zwingend hochdosiert mit Stahl- oder Polymerfasern duktilisiert werden',
      'Strengste Qualitätskontrollen beim Mischprozess im Transportbetonwerk notwendig (Temperatur/Fließmittel)'
    ],
    specs: {
      'Druckfestigkeit (28d)': '150 bis 230 N/mm² (MPa)',
      'w/z-Wert (Wasser-Zement)': 'extrem niedrig (0.15 bis 0.18)',
      'Zusatzstoffe': 'Silikastaub (Mikrosilika), Quarzmehl als Mikrogrenzfüller',
      'Stahlfaser-Bewehrung': '1 bis 3 Vol.-% hochfeste Mikrostahlfasern',
      'Frost-Tausalz-Resistenz': 'Absolut unempfindlich, kein nennenswerter Abtrag'
    },
    details: 'Die bahnbrechenden Festigkeiten von UHPC beruhen auf einer strengen Optimierung der Packungsdichte. Durch die Zugabe von lungengängigen aber hydratisierbaren ultrafeinen Silikastaub-Partikeln werden alle mikro- und makroskopischen Zwischenräume zwischen den Sandkörnern gefüllt. Das Resultat ist eine nahezu vollständige Abwesenheit freier Kapillarporen. UHPC wird im Verbund mit Stahlfasern duktil und kann extreme Kräfte aufnehmen.'
  },
  {
    id: 'ilb',
    name: 'Infraleichtbeton (ILB)',
    category: 'Gefügeoptimierte Betone',
    shortDesc: 'Hochwärmedämmender Konstruktionsbeton mit extrem geringer Rohdichte zur Realisierung einschichtiger, monolithischer Sichtbetonbauten.',
    co2Index: 60, // Monolithic, replaces multi-layered walls and synthetic insulation boards (WDVS)
    costIndex: 125, // Slightly more expensive than aggregate concrete but saves insulation layer installer labor
    strength: 'Geringe bis mittlere Tragfähigkeit (Druckfestigkeit 8 bis 15 MPa). Ausreichend für mehrgeschossigen Wohnungsbau.',
    advantages: [
      'Vollständig monolithisches Bauen: Wand übernimmt statischen Lastabtrag UND bauphysikalische Wärmedämmung',
      'Keine synthetischen Wärmedämmverbundsysteme (WDVS, Polystyrol) nötig, dadurch 100% recyclingfähig',
      'Exzellenter physikalischer Brandschutz (reiner mineralischer Brandschutz-Baustoff)',
      'Glatte visuelle Sichtbetonoberfläche außen und innen in einem Arbeitsschritt gegossen'
    ],
    disadvantages: [
      'Statisch begrenzt: Aufgrund der vielen Luftporen nicht für hochbelastete Pfeiler oder extreme Spannweiten geeignet',
      'Erhöhte Wasseraufnahme durch poröse Zuschlagstoffe (Blähton/Blähglas), erfordert hydrophobierende Hydrophobierung',
      'Besondere Sorgfalt bei Verdichtung auf der Baustelle nötig (Gefahr des Aufschwimmens der leichten Gesteinskörnung)'
    ],
    specs: {
      'Trockenrohdichte': '650 bis 800 kg/m³ (Normalbeton = 2.400 kg/m³)',
      'Wärmeleitfähigkeit (λ)': '0,15 bis 0,18 W/(m·K)',
      'Druckfestigkeitsklasse': 'LC 8/9 bis LC 12/13',
      'Zuschläge': 'Blähmaterialien, Blähglas (recyceltes Altglas), Blähton',
      'Bewehrung': 'Stahlbewehrung mit Korrosionsschutzbeschichtung oder GFK-Bewehrung'
    },
    details: 'Infraleichtbeton löst das Dilemma des mehrschichtigen Bauens. Anstatt tragenden Beton mit brennbarem und schwer recyclebarem Styropor zu verkleben, wird ein poröser gefügeoptimierter Beton gegossen, dessen Luftporen im Blähglasaggregat die Wärme im Gebäude halten. Die statischen Mindestanforderungen für Gebäude bis zu 3-4 Stockwerken werden trotz des geringen Eigengewichts eingehalten.'
  },
  {
    id: 'bio_lc3',
    name: 'Ökologische Bindemittel (LC³ & Geopolymere)',
    category: 'Nachhaltige Bindemittel & Kreislauf',
    shortDesc: 'Zukunftsweisende Klinker-Alternativen: CO₂-reduziertes LC³-Zementkonzept und vollständig zementfreie, alkalisch aktivierte Geopolymer-Betone.',
    co2Index: 20, // Huge carbon reduction of 40-80%
    costIndex: 115, // Cost-competitive once factories are optimized, currently slight premium
    strength: 'Sehr gute Festigkeitseigenschaften (30-65 MPa), vergleichbar mit klassischen Portlandzementen.',
    advantages: [
      'Erhebliche Verbesserung der Ökobilanz: CO₂-Emissionen der Bindemittelherstellung sinken um bis zu 80%',
      'Verwendung von regionalen Abfallstoffen (Hüttensand, Flugasche, calcinierten Tonen) schont Kies- und Tonvorkommen',
      'Hervorragende Widerstandskraft gegen Säurebeanspruchungen und aggressive Abwässer'
    ],
    disadvantages: [
      'Teilweise schnelle Erstarrungszeiten bei Geopolymeren erfordern präzise Dosierung von Verzögerern',
      'Aktivatorlösungen (wie Wasserglas) sind ätzende Gefahrstoffe in der Handhabung im Transportbetonwerk',
      'Langzeitverhalten im Hinblick auf Carbonatisierung und Schutz des Bewehrungsstahls noch unter intensiver Erforschung'
    ],
    specs: {
      'CO₂-Einsparung (LC³)': '30 bis 45% im Vergleich zu reinem CEM I',
      'Zusammensetzung LC³': 'Klinkeranteil halbiert, Rest: Calcinierter Ton (Tonmergel) & Kalksteinmehl',
      'Zementfreier Geopolymer': 'Alkalisch aktivierte Flugasche (Fly ash) oder Hüttensand (Slag)',
      'Hydratationswärme': 'Sehr gering, exzellent geeignet für massige Bauteile',
      'Zulassung': 'Sukzessive Aufnahme in die DIN EN 197-1 (z. B. als CEM VI)'
    },
    details: 'Der LC³-Zement (Limestone Calcined Clay Cement) nutzt einen synergistischen Effekt: Durch das gemeinsame Vermahlen von calciniertem (bei ca. 800°C erhitztem) Ton mit feinem Kalksteinmehl entsteht ein hochreaktives Bindemittel, das den Zementklinkerbedarf drastisch senkt. Geopolymere verzichten kpl. auf Portlandklinker; hier formen kovalente Alumosilicat-Netzwerke den künstlichen Stein.'
  }
];

export default function InnovativeWerkstoffe() {
  const [activeSubTab, setActiveSubTab] = useState<'katalog' | 'druck' | 'finder' | 'vergleich' | 'trends'>('katalog');
  const [selectedMat, setSelectedMat] = useState<string>('3dcp');
  
  // 3DCP Simulator State
  const [printSpeed, setPrintSpeed] = useState<number>(1.2); // vertical rise rate in m/h
  const [thixotropy, setThixotropy] = useState<number>(5.0); // Athix in Pa/min
  const [concreteDensity, setConcreteDensity] = useState<number>(2100); // density in kg/m3
  const [targetHeight, setTargetHeight] = useState<number>(2.0); // target height in m
  const [initialYield, setInitialYield] = useState<number>(350); // initial yield stress tau_00 in Pa
  const [layerThickness3d, setLayerThickness3d] = useState<number>(20); // layer thickness in mm
  const [layerWidth3d, setLayerWidth3d] = useState<number>(80); // layer width in mm
  const [useAccelerator, setUseAccelerator] = useState<boolean>(true); // nozzle accelerator active?
  const [structuralShape, setStructuralShape] = useState<'straight' | 'rounded' | 'folded'>('rounded'); // wall shape
  const [druckSubTab, setDruckSubTab] = useState<'verfahren' | 'rheologie' | 'bemessung' | 'bewehrung' | 'simulator'>('verfahren');

  // Decision Tool State
  const [reqProperty, setReqProperty] = useState<string>('co2');
  const [spanLength, setSpanLength] = useState<string>('mittel');
  const [exposure, setExposure] = useState<string>('bewitterung');
  const [formFreedom, setFormFreedom] = useState<string>('hoch');
  const [calcResult, setCalcResult] = useState<{ bestId: string; reason: string; rating: Record<string, number> } | null>(null);

  const selectedMaterialData = FUTURE_MATERIALS.find(m => m.id === selectedMat) || FUTURE_MATERIALS[0];

  // Material evaluation logic
  function calculateBestMaterial() {
    let scores: Record<string, number> = {
      '3dcp': 50,
      'carbon': 50,
      'uhpc': 50,
      'ilb': 50,
      'bio_lc3': 50
    };

    // Evaluate property focus
    if (reqProperty === 'co2') {
      scores.bio_lc3 += 35;
      scores.carbon += 25;
      scores.ilb += 15;
    } else if (reqProperty === 'strength') {
      scores.uhpc += 40;
      scores.carbon += 30;
    } else if (reqProperty === 'insulation') {
      scores.ilb += 45;
    } else if (reqProperty === 'automation') {
      scores['3dcp'] += 45;
    }

    // Evaluate span / dimensions
    if (spanLength === 'gross') {
      scores.uhpc += 25;
      scores.carbon += 25;
      scores.ilb -= 30; // too weak for long spans
      scores['3dcp'] -= 10;
    } else if (spanLength === 'gering') {
      scores.ilb += 10;
      scores['3dcp'] += 15;
    }

    // Evaluate exposure environment
    if (exposure === 'aggressiv') {
      scores.carbon += 30; // no rust!
      scores.uhpc += 25; // dense matrix
      scores.bio_lc3 += 20; // acid resistant
      scores.ilb -= 20; // highly porous
    } else if (exposure === 'bauwerk_innen') {
      scores.ilb += 15;
      scores['3dcp'] += 10;
    }

    // Evaluate geometry
    if (formFreedom === 'hoch') {
      scores['3dcp'] += 40;
      scores.carbon += 15; // thin, wrap around forms
      scores.uhpc -= 5;
    }

    // Find highest
    let bestId = 'bio_lc3';
    let maxScore = -999;
    Object.entries(scores).forEach(([id, score]) => {
      if (score > maxScore) {
        maxScore = score;
        bestId = id;
      }
    });

    // Custom reasons
    let reason = '';
    if (bestId === '3dcp') {
      reason = 'Aufgrund Ihrer Anforderung an maximale geometrische Freiheit und Automatisierung ist der 3D-Betondruck Ihr idealer Werkstoff. Er druckt topologisch optimierte Bauteile direkt aus dem BIM-Modell ohne Holzabfall.';
    } else if (bestId === 'carbon') {
      reason = 'Für schlanke, filigrane Strukturen unter Bewitterung oder agressiven Medien (Rostgefahr!) ist Carbonbeton unschlagbar. Die vollkommene Auslöschung der Rostgefahr spart bis zu 75% der Betonmasse ein und senkt den CO₂-Ausstoß drastisch.';
    } else if (bestId === 'uhpc') {
      reason = 'Extreme Lasten und dichte Barriereanforderungen rufen nach Ultra-High Performance Concrete (UHPC). Seine stahlähnliche Druckfestigkeit gepaart mit lückenloser Gefügedichte trotzt härtesten Umgebungen.';
    } else if (bestId === 'ilb') {
      reason = 'Wenn monolithische Sichtbetonwand und maximale Dämmleistung ohne zusätzliche künstliche Styropordämmungen gesucht werden, ist Infraleichtbeton die erste Wahl für Tragwerke mittlerer Bauhöhe.';
    } else {
      reason = 'Da Ihre Priorität absolut auf Umweltschutz und CO₂-Fußabdruck liegt, sind ökologische Bindemittel (comme LC³ oder Geopolymere) die Antwort. Mit bis zu 80% Einsparpotential passen sie in jeden Betonmischprozess.';
    }

    // Normalize out of 5 stars
    let normalizedRatings: Record<string, number> = {};
    Object.entries(scores).forEach(([id, score]) => {
      let stars = Math.min(5, Math.max(1, Math.round((score / 130) * 5 * 10) / 10));
      normalizedRatings[id] = stars;
    });

    setCalcResult({ bestId, reason, rating: normalizedRatings });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Sparkles className="text-shiraz" /> Innovative Werkstoffe &amp; Zukunftstechnologien
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
          <p>
            Die Transformation des Bauwesens. Erforsche digitale Fertigungsprozesse, CO₂-optimierte Bindemittelkonzepte, hochfeste Carbonverbundsysteme sowie intelligente Werkstoffgefüge zur Einsparung von Primärrohstoffen.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="bg-slate-50 p-1.5 rounded-2xl border border-home-grau/30 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-2">
        <button
          onClick={() => setActiveSubTab('katalog')}
          className={`px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'katalog'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers size={14} /> Material-Spezifikationen
        </button>
        <button
          onClick={() => setActiveSubTab('druck')}
          className={`px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'druck'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Cpu size={14} /> 3D-Betondruck (3DCP)
        </button>
        <button
          onClick={() => setActiveSubTab('finder')}
          className={`px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'finder'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings size={14} /> Baustoff-Wegweiser
        </button>
        <button
          onClick={() => setActiveSubTab('vergleich')}
          className={`px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'vergleich'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Scale size={14} /> CO₂/Kosten Trade-off
        </button>
        <button
          onClick={() => setActiveSubTab('trends')}
          className={`px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'trends'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles size={14} /> Smart Materials &amp; Trends
        </button>
      </div>

      {/* Main Content Areas */}
      <div className="min-h-[450px]">
        {activeSubTab === 'druck' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Secondary chapter pills */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
              <button
                onClick={() => setDruckSubTab('verfahren')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                  druckSubTab === 'verfahren'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-white text-slate-700 border-home-grau/30 hover:bg-off-white'
                }`}
              >
                <Layers size={12} /> 1. Druckverfahren
              </button>
              <button
                onClick={() => setDruckSubTab('rheologie')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                  druckSubTab === 'rheologie'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-white text-slate-700 border-home-grau/30 hover:bg-off-white'
                }`}
              >
                <Activity size={12} /> 2. Rheologie &amp; Eigenschaften
              </button>
              <button
                onClick={() => setDruckSubTab('bemessung')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                  druckSubTab === 'bemessung'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-white text-slate-700 border-home-grau/30 hover:bg-off-white'
                }`}
              >
                <Scale size={12} /> 3. Standsicherheit &amp; Nachweise
              </button>
              <button
                onClick={() => setDruckSubTab('bewehrung')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                  druckSubTab === 'bewehrung'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-white text-slate-700 border-home-grau/30 hover:bg-off-white'
                }`}
              >
                <Wrench size={12} /> 4. Bewehrungstechniken
              </button>
              <button
                onClick={() => setDruckSubTab('simulator')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                  druckSubTab === 'simulator'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-white text-slate-700 border-home-grau/30 hover:bg-off-white'
                }`}
              >
                <Cpu size={12} /> 5. Interaktiver Simulator
              </button>
            </div>

            {/* Chapter 1: Druckverfahren */}
            {druckSubTab === 'verfahren' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-350">
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2 font-mono">
                      <span className="bg-indigo-50 p-1.5 rounded-lg">01</span> Strangextrusionsverfahren (3DCP)
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Kontinuierliche Betonextrusion</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      Das am weitesten verbreitete Verfahren in der Praxis (Gantry- oder Knickarmroboter). Ein hoch thixotroper Feinmörtel wird durch einen Schlauch an den Druckkopf gepumpt und über eine Düse schichtweise abgelegt.
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                        <div><strong>Konstruktionsgeschwindigkeit:</strong> Sehr hohe Aufbauraten im Freiraum möglich.</div>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                        <div><strong>Skalierbarkeit:</strong> Ganze Hauswände werden nahtlos vor Ort im "Field Factory"-Prinzip gedruckt.</div>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={14} />
                        <div><strong>Limitierung:</strong> Sichtbare Lagenstruktur ("Lagenoptik"). Keine Überhänge ohne Hilfsstrukturen druckbar.</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-6 font-mono text-xs text-slate-600">
                    <span className="font-bold text-slate-800 block mb-1">Typische Parameter:</span>
                    Düsengröße: 20-50 mm | Lagenhöhe: 10-25 mm | Druckgeschwindigkeit: 50-250 mm/s
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2 font-mono">
                      <span className="bg-indigo-50 p-1.5 rounded-lg">02</span> Partikelbettverfahren (Binder Jetting)
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Selektives Binden / Sand-Binder-Verfahren</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      Hierbei wird eine dünne Trockensubstanzschicht (z. B. Sand, Kies und Zementpulver) vollflächig aufgetragen. Ein Druckkopf spritzt anschließend an den festen Bauteilbereichen Wasser oder ein Flüssigkeitsaktivierungsmittel ein.
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                        <div><strong>Filigrane Formen:</strong> Überhänge, komplexe Bögen, und Hohlräume lassen sich herstellen, da das lose Sandbett als Stützmaterial dient.</div>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                        <div><strong>Oberflächenqualität:</strong> Nahezu stufenlose, steinartige Reliefflächen von herausragender Präzision.</div>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={14} />
                        <div><strong>Limitierung:</strong> Nur in speziellen Druckkammern (Fertigteilwerke) anwendbar. Das ungebundene Material muss mühsam abgesaugt werden.</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-6 font-mono text-xs text-slate-600">
                    <span className="font-bold text-slate-800 block mb-1">Typische Parameter:</span>
                    Auflösung: &lt; 1,0 mm | Bauteilvolumen: begrenzt durch Kammergröße | Hoher Zement-Aktivierungsbedarf
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 2: Rheologie & Frischbeton */}
            {druckSubTab === 'rheologie' && (
              <div className="space-y-6 animate-in fade-in duration-350">
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-600" /> Frischbeton-Rheologie: Das 3DCP-Widerspruchsdilemma
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-150">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono uppercase block w-max mb-2">Anforderung 1</span>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Pumpbarkeit &amp; Extrudierbarkeit</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Das Material muss unter hoher Scherung fließen und leicht durch den Zuführschlauch gleiten. Das bedeutet eine geringe Viskosität im Fließzustand bei hohem Schergefälle:
                      </p>
                      <div className="py-2">
                        <InlineMath math="\eta_{dynamisch} \ll 50\text{ Pa}\cdot\text{s}" />
                      </div>
                    </div>

                    <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-150">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-orange-100 text-orange-850 rounded font-mono uppercase block w-max mb-2">Anforderung 2</span>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Standfestigkeit (Buildability)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Unmittelbar nach dem Austreten aus der Düse muss das Material eine steife Konsistenz annehmen, um die nachfolgenden Lagen mechanisch ohne Setzung zu tragen:
                      </p>
                      <div className="py-2">
                        <InlineMath math="\tau_{base} \ge \tau_{statisch,0}" />
                      </div>
                    </div>

                    <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-150">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-850 rounded font-mono uppercase block w-max mb-2">Lösung</span>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Smarte Thixotropie (Zeit-Viskosität)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Einsatz strukturviskoser Bindemittel. Im Ruhezustand steigt die Fließgrenze linear durch thixotropen Strukturaufbau an, wodurch der Beton in Sekunden standfest wird:
                      </p>
                      <div className="py-2">
                        <InlineMath math="\tau_0(t) = \tau_{0{,}0} + A_{thix} \cdot t" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fcf8f2] p-6 rounded-2xl border border-amber-200">
                  <h4 className="font-bold text-amber-900 text-sm mb-3 flex items-center gap-1.5">
                    <AlertCircle className="text-amber-700 shrink-0" size={16} /> Fugenanisotropie &amp; Kaltfugen-Problem (Interlayer Bond Strength)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
                    <div>
                      <p className="mb-2">
                        Im Gegensatz zu gegossenem Beton besitzt im 3D-Druck hergestellter Beton <strong>anisotrope Festigkeitseigenschaften</strong>. Der kritische Schwachpunkt liegt an der Schnittstelle zwischen den gedruckten Bahnen:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 mb-2">
                        <li><strong>Oberflächenverdunstung:</strong> Liegt die Zeitspanne zwischen zwei Schichten (<InlineMath math="t_{gap}" />) über der Offenzeit des Mörtels, verdampft Oberflächenwasser. Eine feste Verbundwirkung wird verhindert.</li>
                        <li><strong>Mikro-Kaltfugen:</strong> Staub oder angetrocknete Porenmörtelhaut bilden Gleitfugen, die die Querkrafttragfähigkeit um bis zu <strong>40% bis 60%</strong> mindern.</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-amber-100">
                      <span className="font-bold text-slate-900 block mb-1">Phänomenologische Verbundprüfung:</span>
                      <p className="text-xs text-slate-600 mb-2">
                        Laborprüfungen zeigen, wie das Versagen bei Biegezug- oder Scherbeanspruchung fast ausnahmslos an der horizontalen Schichtgrenze stattfindet:
                      </p>
                      <BlockMath math="f_{t,interlayer} = \beta_{fugenfactor} \cdot f_{t,bulk} \quad (\beta_{fugen} \approx 0{,}4\text{ bis }0{,}85)" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 3: Standsicherheit & Nachweise */}
            {druckSubTab === 'bemessung' && (
              <div className="space-y-6 animate-in fade-in duration-350">
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Scale size={18} className="text-indigo-600" /> Mechanische Versagensarten während des Druckprozesses
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Solange der Beton im frischen bis jungen Zustand gedruckt wird, besitzt er noch keine nennenswerte zementäre Eigenfestigkeit. Die Tragkonstruktion muss während der Fertigung zwei grundlegende Standsicherheitskriterien erfüllen:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-indigo-900 text-sm mb-2 flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-indigo-600" /> 1. Plastisches Fließversagen (Plastic Collapse)
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        Die am Bauteilfuß wirkende vertikale Druckspannung durch das Eigengewicht der darüber liegenden Schichten überschreitet den mechanischen Fließwiderstand des jungen Zementsteins. Dies führt zu plastischem Breitquetschen der Fundamentbahnen.
                      </p>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 mt-2 font-mono text-xs">
                        <div className="font-bold text-slate-800 mb-1">Grenzbedingung nach Tresca:</div>
                        <BlockMath math="\tau_{0,base}(t) \ge \tau_{req} = \frac{\rho \cdot g \cdot H}{\sqrt{3}}" />
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Hierbei ist <InlineMath math="\rho" /> die Dichte, <InlineMath math="g" /> die Gravitation und <InlineMath math="H" /> die aktuelle Bauwerkshöhe.
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-indigo-900 text-sm mb-2 flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-indigo-600" /> 2. Elastisches Knicken (Elastic Buckling)
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        Durch geometrische Schlankheit, Krümmungsschwankungen und asymmetrisches Eigengewicht verliert das Bauteil seine elastische Standsicherheit und knickt seitlich aus. Dies ist meist der maßgebliche Versagensfall bei dünnen Wänden.
                      </p>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 mt-2 font-mono text-xs">
                        <div className="font-bold text-slate-800 mb-1">Kritische Höhe nach Greenhill (Self-weight buckling):</div>
                        <BlockMath math="H_{cr} = \left( \frac{7.837 \cdot E(t) \cdot I(b)}{\rho \cdot g \cdot A} \right)^{1/3}" />
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Die geometrische Trägheit wird optimiert durch Krümmungen, Faltungen oder kreisförmige Querschnittspfaden, welche das Gesamthebelarmlager verbreitern.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl text-white">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono mb-2">Ingenieurpraxis &amp; Regelwerk</span>
                  <h4 className="text-base font-bold mb-2">Normative Situation &amp; Teilsicherheitskonzept</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Da für den 3D-Druck im Hochbau derzeit <strong>keine harmonisierte europäische Bemessungsnorm</strong> (wie der Eurocode 2) existiert, muss der Tragwerksplaner auf **Zulassungen im Einzelfall (ZiE)** oder **Allgemeine Bauaufsichtliche Zulassungen (abZ)** des DIBt zurückgreifen. Die Erstellung einer Tragstruktur stützt sich auf rigorose experimentelle Vorprüfungen zur Ermittlung des zeitabhängigen Sicherheitsbeiwerts <InlineMath math="\gamma_M \approx 1{,}5\text{ bis }2{,}0" /> auf die Scherfestigkeit.
                  </p>
                </div>
              </div>
            )}

            {/* Chapter 4: Bewehrungsverfahren */}
            {druckSubTab === 'bewehrung' && (
              <div className="space-y-6 animate-in fade-in duration-350">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Option 1: Lost formwork */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <span className="bg-violet-50 text-violet-700 font-mono text-xs px-2 py-0.5 rounded">Option A</span>
                        Ausgießen von gedruckten Schalungskernen
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        Das am häufigsten praktizierte Verfahren im realen Hausdruck. Der 3D-Drucker druckt eine hohle doppelwandige Schale, die geometrisch als **verlorene Schalung** dient. In den inneren Hohlkamerkern werden konventionelle Stabstähle, Gitterträger oder Bügel per Hand eingebracht und anschließend mit klassischem Fließ- oder Transportbeton verfüllt.
                      </p>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                        <li>Kompatibel mit standardmäßigem Bauordnungsrecht</li>
                        <li>Verwendung von klassischem kostengünstigem Betonstahl</li>
                        <li>Statischer Verbundnachweis erfolgt nach Standard EC2</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 mt-4 text-[11px] text-violet-850">
                      <strong>Anwendung:</strong> Tragende Wandscheiben, schlanke Stützenkerne und Stürze.
                    </div>
                  </div>

                  {/* Option 2: Nozzle Fiber Feed */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <span className="bg-violet-50 text-violet-700 font-mono text-xs px-2 py-0.5 rounded">Option B</span>
                        Draht- &amp; Fasermitextrusion (In-Nozzle Co-Extrusion)
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        Ein hochautomatisierter High-Tech-Ansatz: Zusammen mit der Mörtelpaste wird über die Umlenkrolle des Druckkopfs kontinuierlich ein hochfester Endlosdraht, Stahldrahtkabel oder ein Carbon/Glasfaser-Roving direkt im Kern der Extrusionsbahn abgelegt.
                      </p>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                        <li>100% automatisierter Gesamtprozess</li>
                        <li>Direkter Eintrag von Zugfestigkeit in Bahnrichtung</li>
                        <li>Schwierig bei sehr engen Kurvenradien und Kreuzungspunkten</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 mt-4 text-[11px] text-violet-850">
                      <strong>Anwendung:</strong> Freitragende Brückenbögen, Schalentragwerke im anspruchsvollen Form-Design.
                    </div>
                  </div>

                  {/* Option 3: Textile mesh */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <span className="bg-violet-50 text-violet-700 font-mono text-xs px-2 py-0.5 rounded">Option C</span>
                        Manuelle Einbettung von Textilgittern (Interlayer Mesh)
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        Der Druckprozess hält in vordefinierten Höhenschritten kurz an. Ein Handwerker oder ein Roboterarm legt ein ebenes, flexibles Carbon- oder Glasfasergittergewebe flächig auf die nasse Betonschicht auf. Bei der nachfolgenden Überfahrt dringt der Mörtel durch das offene Gitter und stellt die Lagenhaftung her.
                      </p>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                        <li>Hervorragende Zugkraftverteilung im Plattenbereich</li>
                        <li>Korrosionsunanfällig und extrem schlank</li>
                        <li>Vollflächiger Verbund unter Beachtung von Schlupf</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 mt-4 text-[11px] text-violet-850">
                      <strong>Anwendung:</strong> Modulare Balkonplatten, dekorative Fassadenelemente.
                    </div>
                  </div>

                  {/* Option 4: Post Tensioning */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <span className="bg-violet-50 text-violet-700 font-mono text-xs px-2 py-0.5 rounded">Option D</span>
                        Nachträgliche externe Vorspannung (Post-Tensioning)
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        In das Bauteil werden kleine senkrechte Durchgangskanäle integriert. Nach dem vollständigen Erhärten des Zementsteins werden hochfeste Spannstahlkabel oder Carbon-Hohlstäbe durchgezogen und über hydraulische Zugpressen an den Außenflanschen vorgespannt.
                      </p>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                        <li>Führt das gesamte Bauteil unter permanente Druckvorspannung</li>
                        <li>Verhindert das Auftreten von Rissen bei Biege- oder Windlasten</li>
                        <li>Exzellent für zerlegbare und modulare Bauteile geeignet</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 mt-4 text-[11px] text-violet-850">
                      <strong>Anwendung:</strong> Segmentbrücken, schlank vorgespannte Deckenkonsolen.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 5: Interactive Simulator */}
            {druckSubTab === 'simulator' && (() => {
              // Physics Calculation Engine
              const gVal = 9.81;
              const effectiveAthix = useAccelerator ? (thixotropy + 150) : thixotropy;
              const effectiveInitial = useAccelerator ? (initialYield + 1200) : initialYield;
              
              // elapsed time inside the bottom layers in minutes to reach height H:
              const baseTimeMins = (targetHeight / printSpeed) * 60;
              const developedYieldBase = effectiveInitial + effectiveAthix * baseTimeMins;
              const developedYieldBaseKPa = developedYieldBase / 1000;
              
              const requiredYieldBase = (concreteDensity * gVal * targetHeight) / Math.sqrt(3);
              const requiredYieldBaseKPa = requiredYieldBase / 1000;
              
              const sfPlasticVal = developedYieldBase / requiredYieldBase;
              
              // Elastic Buckling
              // Youngs Modulus estimate: E ≈ 1000 * yield_strength (highly realistic transition for fresh cement paste)
              const E_mod_base = 1200 * developedYieldBase; // in Pa
              const b_m = layerWidth3d / 1000; // width of layer in m
              const shapeFactor = structuralShape === 'straight' ? 1.0 : structuralShape === 'rounded' ? 4.0 : 8.0;
              
              // simplified self-weight elastic buckling height for column of thickness b:
              const H_critical_buckling = Math.pow((0.653 * E_mod_base * b_m * b_m * shapeFactor) / (concreteDensity * gVal), 1/3);
              const sfBucklingVal = H_critical_buckling / targetHeight;
              
              // Overall State evaluation
              let isStable = sfPlasticVal >= 1.3 && sfBucklingVal >= 1.3;
              let isCritical = (sfPlasticVal >= 1.0 && sfPlasticVal < 1.3) || (sfBucklingVal >= 1.0 && sfBucklingVal < 1.3);
              let isFailed = sfPlasticVal < 1.0 || sfBucklingVal < 1.0;

              return (
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-8 animate-in duration-300">
                  <div className="border-b border-home-grau/20 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Cpu size={18} className="text-indigo-600 animate-spin" /> Standsicherheits- und Frischbetonversagens-Simulator
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Simulieren Sie mathematisch exakt das elastische Knicken und das plastische Fließversagen während des Druckvorgangs eines realen Bauteils am Fußpunkt.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Controls Col (Left) */}
                    <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block font-mono mb-2">Parameter-Steuerung</span>
                      
                      {/* Sub-block 1: Geometrie */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Druckhöhe: {formatDeZahl(targetHeight, 2)} m</label>
                        <input
                          type="range"
                          min="0.5"
                          max="4.0"
                          step="0.1"
                          value={targetHeight}
                          onChange={(e) => setTargetHeight(parseFloat(e.target.value))}
                          className="w-full text-indigo-600 accent-indigo-600 cursor-pointer"
                        />
                        <span className="text-[9px] text-slate-400 font-mono">Bereich: 0,5 bis 4,0 m</span>
                      </div>

                      {/* Sub-block 2: Print rate */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Steigrate (Print Speed): {formatDeZahl(printSpeed, 1)} m/h</label>
                        <input
                          type="range"
                          min="0.2"
                          max="2.5"
                          step="0.1"
                          value={printSpeed}
                          onChange={(e) => setPrintSpeed(parseFloat(e.target.value))}
                          className="w-full text-indigo-600 accent-indigo-600 cursor-pointer"
                        />
                        <span className="text-[9px] text-slate-400 font-mono">Vertikale Steigrate pro Stunde. Langsamer = Mehr Festigkeitsaufbauzeit an der Basis.</span>
                      </div>

                      {/* Sub-block 3: Thixotropy */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Thixotropierate: {formatDeZahl(thixotropy, 1)} Pa/min</label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          step="0.5"
                          value={thixotropy}
                          onChange={(e) => setThixotropy(parseFloat(e.target.value))}
                          className="w-full text-indigo-600 accent-indigo-600 cursor-pointer"
                        />
                        <span className="text-[9px] text-slate-400 font-mono">Gefüge-Ruheaufbaurate (Standardmörtel ohne Additive).</span>
                      </div>

                      {/* Sub-block 4: Layer Dimensions */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Lagenbreite: {formatDeWert(layerWidth3d)} mm</label>
                          <input
                            type="range"
                            min="40"
                            max="180"
                            value={layerWidth3d}
                            onChange={(e) => setLayerWidth3d(parseInt(e.target.value))}
                            className="w-full text-indigo-600 accent-indigo-600 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-0.5 font-sans">Dichte: {formatDeWert(concreteDensity)} kg/m³</label>
                          <input
                            type="range"
                            min="1800"
                            max="2400"
                            step="50"
                            value={concreteDensity}
                            onChange={(e) => setConcreteDensity(parseInt(e.target.value))}
                            className="w-full text-indigo-600 accent-indigo-600 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Sub-block 5: Shape */}
                      <div className="pt-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Bauteilverlauf (Stabilitätsform)</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setStructuralShape('straight')}
                            className={`px-2 py-1.5 rounded-lg font-bold text-[10px] text-center transition-all cursor-pointer ${
                              structuralShape === 'straight'
                                ? 'bg-indigo-650 text-white shadow-sm ring-1 ring-indigo-500'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Gerade Wand
                          </button>
                          <button
                            onClick={() => setStructuralShape('rounded')}
                            className={`px-2 py-1.5 rounded-lg font-bold text-[10px] text-center transition-all cursor-pointer ${
                              structuralShape === 'rounded'
                                ? 'bg-indigo-650 text-white shadow-sm ring-1 ring-indigo-500'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Kreisförmig
                          </button>
                          <button
                            onClick={() => setStructuralShape('folded')}
                            className={`px-2 py-1.5 rounded-lg font-bold text-[10px] text-center transition-all cursor-pointer ${
                              structuralShape === 'folded'
                                ? 'bg-indigo-650 text-white shadow-sm ring-1 ring-indigo-500'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Gewellt (Folded)
                          </button>
                        </div>
                      </div>

                      {/* Sub-block 6: Accelerator */}
                      <div className="pt-3 border-t border-slate-200">
                        <label className="relative flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={useAccelerator}
                            onChange={(e) => setUseAccelerator(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <div className="text-xs">
                            <span className="font-bold text-slate-800 block">Düsentechnik-Schnellbeschleuniger</span>
                            <span className="text-[10px] text-slate-500">Injektion von Alkalisilikaten (Wasserglas/Bentonit) am Druckkopf (+120 Pa/min &amp; +1.2 kPa Initialfestigkeit).</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Simulation Output Area (Right) */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                      {/* Overall Status Banner */}
                      <div className={`p-4 rounded-xl border flex gap-3 ${
                        isStable ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                        isCritical ? 'bg-amber-50 text-amber-950 border-amber-300' :
                        'bg-rose-50 text-rose-950 border-rose-300 font-bold'
                      }`}>
                        <div className="text-2xl mt-0.5">
                          {isStable ? '✓' : isCritical ? '⚠' : '✗'}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">
                            {isStable ? 'Druckvorgang stabil & safe' :
                             isCritical ? 'Achtung: Grenzwertig standsicher' :
                             'EINSTURZ / STATISCHES VERSAGEN'}
                          </h4>
                          <p className="text-xs leading-relaxed mt-1">
                            {isStable ? 'Die Festigkeit wächst schneller als das Bauteilgewicht belastet. Kein Fließen an der Sohle, elastische Knickgeometrie gewährleistet.' :
                             isCritical ? 'Sehr geringer Sicherheitspuffer. Es können plastische Wulstquellungen durch Kriechen am Bauteilfuß oder Risse durch Schwingungen entstehen.' :
                             sfPlasticVal < 1.0 
                               ? 'Das Mörtelgewicht drückt den Sohlzementstein vollständig platt. Fließversagen am Fußpunkt (Sohlmörtel verhält sich wie Brei).'
                               : 'Bauteil versagt schlagartig durch elastisches Seitenaußknicken. Die Wand ist geometrisch zu weich und schlank für dieses Eigengewicht.'}
                          </p>
                        </div>
                      </div>

                      {/* Numerical Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-mono block">Dauer Druckprozess</span>
                          <span className="text-lg font-extrabold text-slate-800 font-mono">
                            {formatDeWert(Math.floor(baseTimeMins / 60))} h {formatDeWert(Math.round(baseTimeMins % 60))} min
                          </span>
                          <span className="text-[9px] text-slate-400 block mt-1 font-mono">Alter der 1. Schicht</span>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-mono block">Fuß-Fließgrenze erreicht</span>
                          <span className="text-lg font-extrabold text-slate-800 font-mono">
                            {formatDeZahl(developedYieldBaseKPa, 2)} kPa
                          </span>
                          <span className="text-[9px] text-slate-400 block mt-1 font-mono">Nötig: ≥ {formatDeZahl(requiredYieldBaseKPa, 2)} kPa</span>
                        </div>
                      </div>

                      {/* Safety Factors Visualization */}
                      <div className="space-y-4">
                        {/* SF Plastic */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-700">Plastische Fließ-Standsicherheit (Tragfähigkeit)</span>
                            <span className={`font-mono font-bold ${sfPlasticVal >= 1.3 ? 'text-emerald-600' : sfPlasticVal >= 1.0 ? 'text-amber-600' : 'text-rose-600'}`}>
                              SF_p = {formatDeZahl(sfPlasticVal, 2)} {sfPlasticVal >= 1.3 ? '(Sicher)' : sfPlasticVal >= 1.0 ? '(Grenzwertig)' : '(Versagen)'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${sfPlasticVal >= 1.3 ? 'bg-emerald-500' : sfPlasticVal >= 1.0 ? 'bg-amber-400' : 'bg-rose-500'}`}
                              style={{ width: `${Math.min(100, (sfPlasticVal / 2.0) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono block">Minimale bautechnische Sicherheit: 1.3</span>
                        </div>

                        {/* SF Elastic */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-700">Elastische Knickstabilität (Biegesteifigkeit)</span>
                            <span className={`font-mono font-bold ${sfBucklingVal >= 1.3 ? 'text-emerald-600' : sfBucklingVal >= 1.0 ? 'text-amber-600' : 'text-rose-600'}`}>
                              SF_k = {formatDeZahl(sfBucklingVal, 2)} {sfBucklingVal >= 1.3 ? '(Sicher)' : sfBucklingVal >= 1.0 ? '(Mäßig)' : '(Knicken)'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${sfBucklingVal >= 1.3 ? 'bg-emerald-500' : sfBucklingVal >= 1.0 ? 'bg-amber-400' : 'bg-rose-500'}`}
                              style={{ width: `${Math.min(100, (sfBucklingVal / 2.0) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono block">Kritische Knickhöhe: {formatDeZahl(H_critical_buckling, 2)} m</span>
                        </div>
                      </div>

                      {/* Educational Recommendations Context */}
                      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-150">
                        <h5 className="font-bold text-indigo-900 text-xs mb-1.5 flex items-center gap-1">
                          <Lightbulb size={13} className="text-indigo-600" /> Didaktische Handlungsempfehlungen
                        </h5>
                        <ul className="text-[11px] text-indigo-950 space-y-1 leading-relaxed list-inside list-disc">
                          {isFailed && (
                            <>
                              <li>Aktivieren Sie den <strong>Schnellbeschleuniger</strong> oder verringern Sie die <strong>Baugeschwindigkeit (<InlineMath math="v" />)</strong>, um dem Bauteilfuß Zeit zu geben, mechanische Steifigkeit aufzubauen.</li>
                              <li>Ändern Sie den Bauteilverlauf auf <strong>Gewellt (Folded)</strong> oder <strong>Kreisförmig</strong>. Dadurch vervielfachen Sie das Trägheitsmoment <InlineMath math="I" /> ohne Zusatzmaterial!</li>
                            </>
                          )}
                          {isCritical && (
                            <li>Um den knappen Sicherheitsspielraum zu erhöhen, empfiehlt sich eine Erhöhung der <strong>Thixotropierate</strong> oder eine geringere geplante <strong>Druckhöhe</strong>.</li>
                          )}
                          {isStable && (
                            <li>Exzellentes Design! Sie können versuchen, die <strong>Steiggeschwindigkeit am Drucker zu erhöhen</strong> (Zeitvorteil), solange Sie den Standsicherheitsfaktor <InlineMath math="SF \ge 1{,}3" /> halten.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {activeSubTab === 'katalog' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {/* Left selector col */}
            <div className="space-y-2 lg:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono mb-2">Werkstoff auswählen</span>
              
              <div className="space-y-2.5">
                {FUTURE_MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMat(mat.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-full relative ${
                      selectedMat === mat.id
                        ? 'bg-white border-indigo-650 ring-1 ring-indigo-500 shadow-md transform translate-x-1'
                        : 'bg-white border-home-grau/30 hover:border-home-grau/30 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono uppercase ${
                          mat.category.includes('Fertigung') ? 'bg-orange-50 text-orange-800' :
                          mat.category.includes('Bewehrung') ? 'bg-indigo-50 text-indigo-800' :
                          mat.category.includes('Bindemittel') ? 'bg-emerald-50 text-emerald-800' :
                          'bg-sky-50 text-sky-850'
                        }`}>
                          {mat.category}
                        </span>
                        
                        <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold font-mono">
                          <Leaf size={10} /> CO₂: -{formatDeWert(100 - mat.co2Index)}%
                        </span>
                      </div>
                      
                      <h4 className="font-extrabold text-sm text-slate-900">{mat.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">{mat.shortDesc}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-home-grau/30 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                      <span>Kostenindex: {formatDeWert(mat.costIndex)}%</span>
                      <span className="text-indigo-600 flex items-center gap-0.5">Details <ChevronRight size={10} /></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right details col */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-home-grau/30 shadow-sm space-y-6">
                
                {/* Header section */}
                <div className="border-b border-home-grau/30 pb-4">
                  <span className="text-xs font-bold text-indigo-600 block mb-1 font-mono uppercase">{selectedMaterialData.category}</span>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedMaterialData.name}</h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">{selectedMaterialData.shortDesc}</p>
                </div>

                {/* Rating bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1"><Leaf className="w-4 h-4 text-emerald-600" /> CO₂-Druckminderung</span>
                      <span className="font-bold font-mono text-emerald-800">-{formatDeWert(100 - selectedMaterialData.co2Index)}% (Sehr Gut)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${100 - selectedMaterialData.co2Index}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-tight font-semibold">CO₂-Einsparpotenzial gegenüber Standardbeton (C30/37).</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1"><Coins className="w-4 h-4 text-slate-500" /> Relativer Kostenindex</span>
                      <span className="font-bold font-mono text-slate-800">{formatDeWert(selectedMaterialData.costIndex)}% (Referenz: 100%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.min(100, (selectedMaterialData.costIndex / 300) * 100)}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-tight font-semibold">Anschaffungskosten exkl. verringerte Folgeaufwände / Lohnkostenersparnis.</span>
                  </div>
                </div>

                {/* Technical detailed description */}
                <div>
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-widest font-mono mb-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-500" /> Funktionsweise &amp; Technologie
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100 font-semibold">
                    {selectedMaterialData.details}
                  </p>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                    <h5 className="font-bold text-emerald-900 text-xs uppercase tracking-widest font-mono mb-2.5 flex items-center gap-1">✔ Vorteile</h5>
                    <ul className="space-y-2">
                      {selectedMaterialData.advantages.map((adv, idx) => (
                        <li key={idx} className="text-xs text-emerald-800 leading-snug flex items-start gap-1 font-semibold">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50/30 p-4 rounded-2xl border border-red-100">
                    <h5 className="font-bold text-red-950 text-xs uppercase tracking-widest font-mono mb-2.5 flex items-center gap-1">⚠ Limitierungen &amp; Risiken</h5>
                    <ul className="space-y-2">
                      {selectedMaterialData.disadvantages.map((dis, idx) => (
                        <li key={idx} className="text-xs text-red-800 leading-snug flex items-start gap-1 font-semibold">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span>{dis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical specification table */}
                <div>
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-widest font-mono mb-2.5 flex items-center gap-1"><Box size={14} className="text-slate-500" /> Technische Kennwerte &amp; Kennzahlen</h5>
                  <div className="border border-home-grau/30 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-home-grau/30">
                          <th className="p-2.5 font-bold text-slate-700">Parameter</th>
                          <th className="p-2.5 font-bold text-slate-700">Kennzahl / Richtwert</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {Object.entries(selectedMaterialData.specs).map(([param, value]) => (
                          <tr key={param} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-medium text-slate-600">{param}</td>
                            <td className="p-2.5 font-bold text-slate-900 font-mono">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'finder' && (
          <div className="bg-white p-6 rounded-3xl border border-home-grau/30 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-home-grau/30 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5"><HelpCircle className="text-indigo-600" /> Interaktiver Baustoff-Wegweiser</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                Suchen Sie ein passendes Material für ein statisches oder thermisches Vorhaben? Geben Sie die Parameter Ihres Tragwerkes ein und lass Ihnen die optimale innovative Lösung ableiten.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controls Column */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">1. Haupt-Bauziel / Anforderung</label>
                  <select
                    value={reqProperty}
                    onChange={(e) => setReqProperty(e.target.value)}
                    className="w-full text-xs bg-white border border-home-grau/30 p-2.5 rounded-lg font-semibold text-slate-700 outline-none focus:border-indigo-500"
                  >
                    <option value="co2">CO₂-Minimierung &amp; Ökobiologie (LC³, Recyceltes Blähglas, Geopolymere)</option>
                    <option value="strength">Maximale Traglast &amp; Verringerter Bauraum (UHPC, Carbonbeton)</option>
                    <option value="insulation">Monolithische Hülle mit integrierter Wärmedämmung (Infraleichtbeton)</option>
                    <option value="automation">Automatisierte Errichtung ohne Einschalungsketten (3DCP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">2. Dimension &amp; Spannweite</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'gering', label: 'Gering', note: 'z.B. Wände, Stützen' },
                      { id: 'mittel', label: 'Mittel', note: 'Standarddecken (<8m)' },
                      { id: 'gross', label: 'Groß', note: 'Großspannbrücken, Hallen' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSpanLength(s.id)}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          spanLength === s.id
                            ? 'bg-indigo-650 text-white border-indigo-650 font-bold'
                            : 'bg-white border-home-grau/30 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs font-bold">{s.label}</div>
                        <div className="text-[9px] opacity-75">{s.note}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">3. Exposition / Chemische Beanspruchung</label>
                  <select
                    value={exposure}
                    onChange={(e) => setExposure(e.target.value)}
                    className="w-full text-xs bg-white border border-home-grau/30 p-2.5 rounded-lg font-semibold text-slate-700 outline-none focus:border-indigo-500"
                  >
                    <option value="bauwerk_innen">Trockener Innenraum – keine Frost- oder Korrosionsgefahr durch Feuchte (XC1)</option>
                    <option value="bewitterung">Freie Außen-Bewitterung - Carbonatisierung &amp; Regenlauf (XC3/XC4/XF1)</option>
                    <option value="aggressiv">Aggressive Medien - Streusalz / Abwasser / Tausalz (XD3/XS3/XA2)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">4. Geometrische Komplexität</label>
                  <div className="flex gap-4 text-xs font-semibold">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="geom"
                        checked={formFreedom === 'mittel'}
                        onChange={() => setFormFreedom('mittel')}
                        className="accent-indigo-600"
                      />
                      <span>Klassisch orthogonal (Flachwand, Balken)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="geom"
                        checked={formFreedom === 'hoch'}
                        onChange={() => setFormFreedom('hoch')}
                        className="accent-indigo-600"
                      />
                      <span>Organische Freiformen (Skulpturen, Wellen)</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={calculateBestMaterial}
                  className="w-full py-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl text-xs font-bold hover:shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Activity size={14} className="animate-pulse" /> Eignung berechnen &amp; Material vorschlagen
                </button>
              </div>

              {/* Recommendation column */}
              <div className="border border-home-grau/30 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                {calcResult ? (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="border-b border-indigo-100 pb-2.5">
                      <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono uppercase">Top-Empfehlung</span>
                      <h4 className="text-xl font-bold text-slate-900 mt-1">{FUTURE_MATERIALS.find(m => m.id === calcResult.bestId)?.name}</h4>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl font-semibold border border-home-grau/30">
                      {calcResult.reason}
                    </p>

                    <div>
                      <h5 className="font-bold text-xs text-slate-500 uppercase tracking-widest font-mono mb-2">Gesamtes Eignungsprofil (Szenario-Einstufung)</h5>
                      <div className="space-y-2">
                        {FUTURE_MATERIALS.map((m) => {
                          const stars = calcResult.rating[m.id] || 1;
                          const isBest = m.id === calcResult.bestId;
                          return (
                            <div key={m.id} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                              isBest ? 'bg-indigo-50/50 border-indigo-200 font-bold' : 'bg-white border-home-grau/30'
                            }`}>
                              <span className="text-slate-800 tracking-tight block max-w-[200px] truncate">{m.name.split(' (')[0]}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] font-mono text-slate-400 font-bold">({formatDeWert(stars)}/5)</span>
                                <div className="flex gap-0.5 text-amber-500">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={i < Math.round(stars) ? 'opacity-100' : 'opacity-20'}>★</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <Info size={40} className="text-indigo-200 mb-3" />
                    <h4 className="font-bold text-sm text-slate-800 mb-1">Kein Eignungsergebnis berechnet</h4>
                    <p className="text-xs max-w-xs leading-normal">Klicken Sie links auf "Eignung berechnen &amp; Material vorschlagen", um die statischen und ökologischen Parameter auszuwerten.</p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-home-grau/30 text-[10px] text-slate-400 leading-normal font-semibold font-medium">
                  💡 <strong>Statischer Hinweis:</strong> Diese Empfehlung basiert auf verallgemeinerten Grenzwertprofilen des Tragwerksdesigns nach Eurocode 2 und darf nicht direkt als statischer oder wärmeschutztechnischer Nachweis gewertet werden.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'vergleich' && (
          <div className="bg-white p-6 rounded-3xl border border-home-grau/30 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-home-grau/30 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5"><Scale className="text-indigo-600" /> CO₂ &amp; Kosten-Abwägung (Trade-off Matrix)</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-semibold">
                Die Auswahl innovativer Werkstoffe erfordert stets das Balancieren ökologischer Vorteile (Carbon footprint Reduktion) gegen ökonomische Einflüsse (Kostenindex bei Errichtung). 
                Diese detaillierte Matrix vergleicht die Profile im statischen Querschnitts-Vergleich mit einem klassischen Stahlbetonquerschnitt (Referenz = 100%).
              </p>
            </div>

            <div className="overflow-x-auto border border-home-grau/30 rounded-2xl shadow-xs">
              <table className="w-full text-xs text-left divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr className="divide-x divide-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Werkstoff</th>
                    <th className="p-3 text-center">Relative CO₂-Belastung</th>
                    <th className="p-3 text-center">Relative Errichtungskosten</th>
                    <th className="p-3">Typische Mindestdicke</th>
                    <th className="p-3">Primärer Tragmechanismus</th>
                    <th className="p-3">Biegesteifigkeit / Duktilität</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {/* Standard concrete reference */}
                  <tr className="bg-slate-50/70 border-b border-home-grau/30 font-semibold font-medium text-slate-500">
                    <td className="p-3 font-bold text-slate-700">Stahlbeton (Standard C30/37 + B500A)</td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded font-mono bg-slate-200 text-slate-700 font-bold text-[10px]">100% (Referenz)</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded font-mono bg-slate-200 text-slate-700 font-bold text-[10px]">100% (Referenz)</span>
                    </td>
                    <td className="p-3 font-mono">200 - 300 mm</td>
                    <td className="p-3">Verbundwirkung (Beton fängt Druck, Stahl fängt Biegezug)</td>
                    <td className="p-3">Sehr duktil durch Stahlfließen (ausreichender Ankündigungseffekt)</td>
                  </tr>

                  {FUTURE_MATERIALS.map((mat) => (
                    <tr key={mat.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{mat.name.split(' (')[0]}</div>
                        <span className="text-[10px] text-slate-400 font-semibold">{mat.category}</span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`px-2 py-0.5 rounded font-mono font-extrabold text-[10px] ${
                            mat.co2Index < 40 ? 'bg-emerald-100 text-emerald-800' :
                            mat.co2Index < 60 ? 'bg-teal-100 text-teal-850' :
                            'bg-lime-100 text-lime-850'
                          }`}>
                            {formatDeWert(mat.co2Index)}% (-{formatDeWert(100 - mat.co2Index)}%)
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`px-2 py-0.5 rounded font-mono font-extrabold text-[10px] ${
                            mat.costIndex > 200 ? 'bg-red-100 text-red-800' :
                            mat.costIndex > 130 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-850'
                          }`}>
                            {formatDeWert(mat.costIndex)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-semibold font-mono text-slate-800">{mat.specs['Notwendige Betondeckung'] || mat.specs['Typische Schichtstärke'] || 'Bauteilabhängig (ca. 40-100mm)'}</td>
                      <td className="p-3 text-slate-600 font-semibold leading-tight">{mat.strength.split('.')[0]}</td>
                      <td className="p-3 text-red-900/90 font-semibold font-medium leading-tight">{mat.disadvantages.find(d => d.includes('Versagen') || d.includes('spröd')) || 'Gut kontrollierbar mit angepasster statischer Bemessung'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-2xl text-[11px] text-indigo-950 font-semibold flex items-start gap-2 leading-relaxed">
              <Sparkles className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <strong>Instandsetzungs-Tipp:</strong> Während die Errichtungskosten von Carbonbeton hoch sind, rechnet sich die Investition über die Lebenszykluskosten (LCC), da periodische Betonsanierungen (Rostschutzinstandhaltungen) vollständig entfallen. Dies senkt Lebenszyklus-Kosten von Parkhäusern und Brücken erheblich.
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'trends' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Smart Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-5 rounded-3xl border border-home-grau/30 shadow-sm space-y-3 relative overflow-hidden">
                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-150 text-orange-600 w-fit">
                  <Cpu size={20} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">Formgedächtnislegierungen (SMA)</h4>
                <p className="text-xs text-slate-600 leading-normal font-semibold">
                  Metalle (Metalle (z. B. Nickel-Titan, im Betonbau eisenbasierte Fe-Mn-Si-Legierungen), die nach Erwärmung in ihre vordefinierte Form zurückkehren; bei behinderter Rückverformung entsteht eine Vorspannkraft.), die nach einer Formänderung durch Temperaturerwärmung in ihre vordefinierte Geometrie zurückkehren.
                </p>
                <div className="pt-2 border-t border-home-grau/30 text-[10px] text-slate-500 font-semibold font-medium leading-relaxed">
                  🔧 <strong>Anwendung:</strong> Vorspannen von Betonbauteilen ohne klassische hydraulische Spannpressen. Die Bewehrungsstäbe werden elektrisch beheizt, ziehen sich zusammen und spannen das Gefüge autonom vor.
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-home-grau/30 shadow-sm space-y-3 relative overflow-hidden">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-150 text-emerald-600 w-fit">
                  <Leaf size={20} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">Selbstheilender Beton (Self-Healing)</h4>
                <p className="text-xs text-slate-600 leading-normal font-semibold">
                  Einmischen von Bakteriensporen (z.B. Bacillus pseudofirmus) oder Epoxid-Mikrokapseln direkt in die Betonmischung im Transportbetonwerk.
                </p>
                <div className="pt-2 border-t border-home-grau/30 text-[10px] text-slate-400 font-semibold font-medium leading-relaxed">
                  💧 <strong>Heilungs-Effekt:</strong> Dringt durch Mikrorisse Wasser ein, erwachen die Bakterien, verstoffwechseln Nährsalze und kristallisieren Kalkstein (Calcit) aus, der den Riss bis 0,8 mm Breite autonom abdichtet.
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-home-grau/30 shadow-sm space-y-3 relative overflow-hidden">
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-150 text-sky-600 w-fit">
                  <Zap size={20} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">Photokatalytischer Beton</h4>
                <p className="text-xs text-slate-600 leading-normal font-semibold">
                  Fotokatalytische Veredelung der Sichtbetonmatrix durch Nanopartikel aus Titandioxid (TiO2), die als Katalysator wirken.
                </p>
                <div className="pt-2 border-t border-home-grau/30 text-[10px] text-slate-400 font-semibold font-medium leading-relaxed">
                  ☀️ <strong>Abgasreinigung:</strong> Unter Einfluss von ultravioletter Sonnenbestrahlung zersetzen die beschichteten Wandflächen schädliche Luftschadstoffe (speziell NO und NO₂-Verbindungen des Straßenverkehrs) in unbedenkliche Nitrate.
                </div>
              </div>

            </div>

            {/* Pilzmyzel & Bio-Concrete Section */}
            <div className="bg-white p-6 rounded-3xl border border-home-grau/30 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-1.5 text-indigo-650 font-bold text-xs uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4 text-indigo-500" /> Biologische Werkstoffe der Zukunft
                </div>
                <h4 className="text-xl font-bold text-slate-900">Pilzmyzel &amp; Bio-Komposite im Bauwesen</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Forschende nutzen das fadenförmige Wurzelnetzwerk von Pilzen (Myzel), um landwirtschaftliche Reststoffe (Stroh, Sägespäne) in feste, formstabile Dämm- und Wandplatten zu verwandeln. 
                  Myzel-Verbundwerkstoffe wachsen geräuschlos innerhalb von 5 bis 10 Tagen vollständig natürlich im dunklen Wachstumsklima heran und werden danach schonend getrocknet.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1.5 font-semibold leading-relaxed">
                  <div>🌱 <strong>Vorteil:</strong> 100% kompostierbar, Vorteil: kompostierbar, gute Schallabsorption (Akustikpaneele), CO₂-bindend. Wärmeleitfähigkeit ca. 0,040 W/(m·K)., CO₂-bindend (Kohlenstofferhalt).</div>
                  <div>🔬 <strong>Fokus:</strong> Akkreditierte Forschungen für Akustikpaneele und leichte nicht-tragende Brandschutzwände.</div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-home-grau/30 text-slate-700 text-xs text-center space-y-2">
                <span className="font-mono text-[9px] uppercase font-bold text-slate-400">Kreislaufökologie</span>
                <div className="text-4xl">🍄</div>
                <div className="font-bold text-slate-900">Pilzmyzel-Dämmung</div>
                <div className="text-[10px] text-slate-500 font-medium">Beste Wärmeleitfähigkeit (λ) ca. 0,040 W/(m·K) und vollständig giftfreie Entsorgung.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Module Footer */}
      <ModuleFooter 
        wikipedia={[
          { title: "3D-Betondruck", url: "https://de.wikipedia.org/wiki/3D-Betondruck" },
          { title: "Carbonbeton", url: "https://de.wikipedia.org/wiki/Carbonbeton" },
          { title: "Ultrahochfester Beton", url: "https://de.wikipedia.org/wiki/Ultrahochfester_Beton" }
        ]}
        literatur={[
          'Mechtcherine, V. et al.: 3D-Betondruck - Vom Labor in die Praxis',
          'Schmidt, M., Fehling, E.: Ultra-High Performance Concrete (UHPC)',
          'C³ - Carbon Concrete Composite e.V.: Carbonbeton im Neubau und Instandsetzung'
        ]}
        regelwerke={[
          { title: "DAfStb-Richtlinie Ultrahochfester Beton (UHPC)", url: "https://www.dafstb.de/" },
          { title: "Allgemeine Bauartgenehmigungen (aBG) für Carbonbetonsysteme - DIBt", url: "https://www.dibt.de/" },
          { title: "DIN EN 1992-1-1 (Eurocode 2: Bemessung von Betonbauteilen)", url: "https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+1992-1-1" }
        ]}
        formeln={[
          {
            formel: '\\tau_{0,\\text{base}}(t) \\ge \\tau_{\\text{req}} = \\frac{\\rho \\cdot g \\cdot H}{\\sqrt{3}}',
            erklaerung: 'Standsicherheitskriterium gegen plastisches Fließversagen (von-Mises-Kriterium) beim 3D-Betondruck in Abhängigkeit von Rohdichte, Erdbeschleunigung und Bauwerkshöhe.',
            quelle: 'Roussel (2018) / Rheology of 3D concrete printing'
          },
          {
            formel: 'H_{\\text{cr}} = \\left( \\frac{7.837 \\cdot E(t) \\cdot I}{\\rho \\cdot g \\cdot A} \\right)^{1/3}',
            erklaerung: 'Kritische Knickhöhe Hcr beim additiven Betondruck unter Eigengewicht (Greenhill-Kriterium) mit zeitabhängigem Elastizitätsmodul E(t).',
            quelle: 'Suiker (2018) / Structural stability in 3D printing'
          }
        ]}
      />
    </div>
  );
}
