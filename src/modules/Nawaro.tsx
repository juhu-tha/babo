import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  Leaf, 
  Trees, 
  Droplets, 
  Scale, 
  Activity, 
  Layers, 
  Search, 
  Zap, 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

// Define FNR Product Type
interface FnrProduct {
  id: string;
  name: string;
  category: string;
  rho: string; // Rohdichte in kg/m³
  lambda: string; // Wärmeleitfähigkeit in W/(mK)
  c: string; // Spezifische Wärmekapazität J/(kgK)
  mu: string; // Wasserdampf-Diffusionswiderstand
  fireClass: string; // Baustoffklasse / Brandverhalten
  advantages: string[];
  disadvantages: string[];
  description: string;
  fnrUsage: string; // Typical FNR recommendation / application area
}

export default function Nawaro() {
  const [activeTab, setActiveTab] = useState<'overview' | 'fnr_db' | 'navigator' | 'comparison'>('overview');
  
  // Database filter states
  const [dbCategory, setDbCategory] = useState<string>('all');
  const [dbSearch, setDbSearch] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>('holzfaser');

  // Navigator preference states
  const [navGoal, setNavGoal] = useState<'heat' | 'summer' | 'moisture' | 'sound' | 'eco'>('summer');
  const [navWallType, setNavWallType] = useState<'dach' | 'innen' | 'fassade'>('dach');

  // FNR Product Database
  const fnrProducts: FnrProduct[] = [
    {
      id: 'holzfaser',
      name: 'Holzfaserdämmstoffe (HFD)',
      category: 'daemmung',
      rho: '50 - 270',
      lambda: '0,038 - 0,050',
      c: '2.100',
      mu: '3 - 5',
      fireClass: 'E (normalentflammbar, vgl. B2)',
      advantages: [
        'Guter sommerlicher Wärmeschutz bei Platten durch hohe Wärmespeicherfähigkeit ρ·c',
        'Gute Schallschutzwirkung im Bauteil durch Masse und hohen Strömungswiderstand',
        'Diffusionsoffen (μ ≈ 3–5) und sorptionsfähig',
        'Speichert biogenen Kohlenstoff'
      ],
      disadvantages: [
        'Höheres Eigengewicht beansprucht die Tragstruktur stärker',
        'Teurer im Vergleich zu konventionellem EPS'
      ],
      description: 'Hergestellt aus Sägeresten und Nadelholz-Hackschnitzeln im Nass- oder Trockenverfahren (flexible Matten ca. 50 kg/m³, Platten bis ca. 270 kg/m³). Die Fasern verfilzen unter Druck und Hitze, teils unter Ausnutzung holzeigener Bindekräfte (Lignin).',
      fnrUsage: 'Aufsparrendämmung, Zwischensparrendämmung, Putzträgerplatten im Holzrahmenbau (WDVS).'
    },
    {
      id: 'zellulose',
      name: 'Zellulosedämmstoff',
      category: 'daemmung',
      rho: '30 - 65',
      lambda: '0,037 - 0,043',
      c: '2.150',
      mu: '1 - 2',
      fireClass: 'B-s2, d0 oder E – produktabhängig (ETA/Leistungserklärung)',
      advantages: [
        'Günstiges Preis-Leistungs-Verhältnis',
        'Fugenfreier Einbau als Einblasdämmung (vermeidet Wärmebrücken)',
        'Hohe spezifische Wärmekapazität',
        'Ressourcenschonend, da aus Altpapier hergestellt'
      ],
      disadvantages: [
        'Setzungsverhalten bei unsachgemäßem Einblasen möglich',
        'Nicht geeignet für direkte Beanspruchung durch flüssiges Wasser'
      ],
      description: 'Hergestellt durch trockene Zerfaserung von sortiertem Altpapier (überwiegend Tageszeitungen). Zum Schutz vor Brand und Schimmelpilzen werden Zusätze beigegeben (z. B. Borsalze, zunehmend ersetzt durch Ammoniumphosphat oder -sulfat).',
      fnrUsage: 'Einblasdämmung in belüfteten Flachdächern, Holzrahmenwänden und Deckenhohlräumen.'
    },
    {
      id: 'hanf',
      name: 'Hanffaserdämmung',
      category: 'daemmung',
      rho: '30 - 45',
      lambda: '0,038 - 0,042',
      c: '1.700',
      mu: '1 - 2',
      fireClass: 'E (normalentflammbar) / B2',
      advantages: [
        'Geringe Anfälligkeit für Schimmel und Schädlinge (Herstellerangabe; Feuchteschutz bleibt erforderlich)',
        'Gute Elastizität vereinfacht den Klemm-Einbau zwischen den Sparren',
        'Anbau mit geringem Pflanzenschutzmitteleinsatz (schnellwüchsig, unterdrückt Beikraut)'
      ],
      disadvantages: [
        'Zusatz von Bindefasern (z.B. Biopolymere oder Stützkunststoffe) für Formstabilität nötig',
        'Zuschnitt erfordert geeignetes Werkzeug (Dämmstoffmesser oder -säge)'
      ],
      description: 'Nutzung der robusten Bastfasern des Hanfstängels. Die Fasern werden mit thermoplastischen Stützfasern (meist Polyester-Bikomponentenfasern, seltener biobasiertes PLA) thermisch zu Matten verfestigt.',
      fnrUsage: 'Zwischensparrendämmung, Gefachdämmung im Innenausbau und Holzbau.'
    },
    {
      id: 'stroh',
      name: 'Baustroh / Baustrohballen',
      category: 'daemmung',
      rho: '85 - 115',
      lambda: '0,043 - 0,048',
      c: '2.000',
      mu: '1 - 2',
      fireClass: 'E (normalentflammbar); verputzte Bauteile mit nachgewiesener Feuerwiderstandsdauer (Nachweis manuell prüfen)',
      advantages: [
        'Sehr geringer Herstellungsaufwand (Nebenprodukt der Getreideernte)',
        'Kostengünstiger, regional verfügbarer Rohstoff',
        'Unterstützt regionale landwirtschaftliche Kreisläufe'
      ],
      disadvantages: [
        'Hohe Wandstärken (~35-50 cm) für guten Dämmwert erforderlich',
        'Erfordert konsequenten Feuchteschutz während Lagerung und Bauphase'
      ],
      description: 'Weizen-, Roggen- oder Dinkelstroh, das zu formstabilen Ballen gepresst wird. Der Verwendbarkeitsnachweis erfolgt über ETA bzw. allgemeine bauaufsichtliche Zulassung (Nummern manuell prüfen).',
      fnrUsage: 'Ausfachung von Holzständerkonstruktionen, beidseitig mit Lehm- oder Kalkputz.'
    },
    {
      id: 'paludikultur',
      name: 'Rohrkolben- und Schilfdämmplatten (Typha)',
      category: 'daemmung',
      rho: '120 - 240',
      lambda: '0,050 - 0,065',
      c: '1.800',
      mu: '5 - 10',
      fireClass: 'E / B2',
      advantages: [
        'Geringe Feuchteempfindlichkeit (Herstellerangabe)',
        'Paludikultur ermöglicht die Wiedervernässung von Mooren und senkt deren CO₂-Emissionen',
        'Geeignet als Putzträger bei Innendämmung'
      ],
      disadvantages: [
        'Höhere Wärmeleitfähigkeit als Holzfaser (mehr Dicke für gleichen U-Wert)',
        'Bisher geringe Marktverfügbarkeit'
      ],
      description: 'Biomasse aus Paludikulturen (Anbau auf wiedervernässten Moorböden). Die Pflanzenteile werden zu Platten gepresst und gebunden (je nach Produkt mineralisch oder mit Draht). Kennwerte sind Richtwerte – maßgebend ist der Verwendbarkeitsnachweis.',
      fnrUsage: 'Innendämmung von Fachwerkbauten, feuchtebelastete Deckenbereiche, Putzträger.'
    },
    {
      id: 'seegras',
      name: 'Seegras (Zostera / Neptungras)',
      category: 'daemmung',
      rho: '65 - 85',
      lambda: '0,039 - 0,045',
      c: '2.000',
      mu: '1 - 2',
      fireClass: 'laut Hersteller schwerentflammbar ohne Flammschutzmittel (Euroklasse manuell prüfen)',
      advantages: [
        'Hoher Mineral- und Salzgehalt erschwert Entflammung und Schimmelbefall (Herstellerangabe)',
        'Geringe Anfälligkeit für Schädlinge (Herstellerangabe)',
        'Je nach Produkt ohne Zusatz- und Bindemittel'
      ],
      disadvantages: [
        'Wird meist als loses Schüttmaterial eingebaut (Verarbeitungsaufwand)',
        'Verfügbarkeit hängt stark von Meeresanschwemmungen ab'
      ],
      description: 'Strandgut des Neptungrases (Posidonia oceanica, Mittelmeer) oder des Echten Seegrases (Zostera, Ostsee). Beides sind Seegräser (Blütenpflanzen), keine Algen.',
      fnrUsage: 'Dämmschüttung für Holzbalkendecken und Dächer, Einblasdämmung.'
    },
    {
      id: 'clt',
      name: 'Brettsperrholz (CLT / Cross-Laminated Timber)',
      category: 'tragwerk',
      rho: '450 - 500',
      lambda: '0,13',
      c: '1.600',
      mu: '20 - 50',
      fireClass: 'D-s2, d0 / normalentflammbar',
      advantages: [
        'Ermöglicht schnellen, trockenen und großflächigen Rohbau',
        'Lastabtrag in zwei Richtungen (Plattenwirkung durch kreuzweise Lagen)',
        'Speichert biogenen Kohlenstoff für die Nutzungsdauer'
      ],
      disadvantages: [
        'Schallschutz im mehrgeschossigen Holzbau erfordert Entkopplung und Zusatzmasse',
        'Verklebung erschwert die sortenreine stoffliche Verwertung'
      ],
      description: 'Massivholztafeln, die aus mindestens drei kreuzweise verklebten Einschichtplatten aus Nadelholz bestehen. Das Kreuzlagenprinzip minimiert Quellen und Schwinden.',
      fnrUsage: 'Tragende Wand-, Decken- und Dachplatten für mehrgeschossigen Wohnungsbau.'
    },
    {
      id: 'hempcrete',
      name: 'Hanfkalk (Hempcrete)',
      category: 'lehm_putz',
      rho: '250 - 450',
      lambda: '0,060 - 0,090',
      c: '1.600',
      mu: '4 - 8',
      fireClass: 'produktabhängig, häufig B-s1, d0 (Leistungserklärung prüfen)',
      advantages: [
        'Kombination aus Dämmwirkung und Wärmespeicherfähigkeit',
        'Günstige Treibhausgasbilanz: biogener Kohlenstoff im Hanf, Kalk nimmt beim Erhärten CO₂ wieder auf (Karbonatisierung)',
        'Alkalisches Milieu hemmt Schimmelbildung; feuchtepuffernd'
      ],
      disadvantages: [
        'Nicht als lasttragendes Strukturbauteil für mehrgeschossige Gebäude geeignet (Traggerippe nötig)',
        'Sehr lange Trocknungszeit auf der Baustelle (bei Nass-Gusstechnik)'
      ],
      description: 'Eine plastische Mischung aus holzigen Hanfschäben (dem zerkleinerten Pflanzenstängel des Nutzhanfs) und kalkbasierten Bindemitteln (Luftkalk, hydraulischer Kalk).',
      fnrUsage: 'Monolithische Ausmauerung von Gefachen, dicke Innendämmschalen, Bodenunterbauten.'
    },
    {
      id: 'linoleum',
      name: 'Linoleum',
      category: 'boden',
      rho: '1.150 - 1.250',
      lambda: '0,17',
      c: '1.400',
      mu: '1.000 - 5.000 (Richtwert)',
      fireClass: 'Cfl-s1 (schwerentflammbar, vgl. B1)',
      advantages: [
        'Überwiegend aus nachwachsenden und mineralischen Rohstoffen (Herstellerangabe bis ca. 98 %)',
        'Abriebfest und langlebig (Nutzungsdauer mehrere Jahrzehnte, Richtwert)',
        'Bakteriostatische Wirkung laut Hersteller (Einsatz in Schulen und Kliniken)'
      ],
      disadvantages: [
        'Geruchsentwicklung (Leinölgeruch) in den ersten Wochen nach Verlegung',
        'Erfordert ebenen Untergrund und fachgerechtes Verschweißen der Bahnen'
      ],
      description: 'Zusammensetzung aus oxidiertem Leinöl (Linoleumzement), Naturharzen (Kolophonium), Holzmehl, Kalksteinmehl und organischen Pigmenten auf einem Juteträgergewebe.',
      fnrUsage: 'Hochbelastbarer, elastischer Bodenbelag in öffentlichen und privaten Räumen.'
    },
    {
      id: 'kork',
      name: 'Expanderkork / Korkschrot',
      category: 'daemmung',
      rho: '110 - 180',
      lambda: '0,040 - 0,045',
      c: '1.900',
      mu: '5 - 10',
      fireClass: 'E / B2',
      advantages: [
        'Hohe Dimensionsstabilität und verrottungsbeständig',
        'Gute Trittschallminderung und Druckfestigkeit',
        'Kann ohne chemische Flammschutzmittel verbaut werden'
      ],
      disadvantages: [
        'Lange Transportwege (primär aus Portugal/Mittelmeerraum)',
        'Begrenzte Verfügbarkeit (dieselbe Korkeiche wird nur etwa alle 9 Jahre geschält)'
      ],
      description: 'Gewonnen aus der Rinde der Korkeiche. Zur Plattenherstellung wird Korkgranulat unter Wasserdampfeinwirkung erhitzt. Das Granulat expandiert, korkeigene Harze treten aus und binden die Partikel ohne Zusatzbindemittel.',
      fnrUsage: 'Perimeterdämmung, Flachdachdämmung, Trittschallminderung.'
    }
  ];

  // Filters calculation
  const filteredProducts = fnrProducts.filter(p => {
    const matchesCategory = dbCategory === 'all' || p.category === dbCategory;
    const matchesSearch = p.name.toLowerCase().includes(dbSearch.toLowerCase()) || 
                          p.description.toLowerCase().includes(dbSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedProductData = fnrProducts.find(p => p.id === selectedProduct) || fnrProducts[0];

  // Navigator logic: Rank materials based on user goals
  const getScoredMaterials = () => {
    return fnrProducts
      .filter(p => p.category === 'daemmung' || p.id === 'hempcrete')
      .map(p => {
        let score = 50; // Neutral baseline
        let reason = '';

        // Technical criteria modifiers
        if (navGoal === 'summer') {
          // Lehrmodell: Wärmespeicherfähigkeit ρ·c in kJ/(m³K), obere Rohdichte
          const rhoVal = parseFloat(p.rho.split('-')[1] || p.rho);
          const cVal = parseFloat(p.c.replace('.', ''));
          const inertia = (rhoVal * cVal) / 1000;
          if (inertia > 300) { score += 45; reason = 'Hohe Wärmespeicherfähigkeit (ρ·c > 300 kJ/(m³K)) – günstig für die Phasenverschiebung.'; }
          else if (inertia > 120) { score += 30; reason = 'Mittlere Wärmespeicherfähigkeit (120–300 kJ/(m³K)).'; }
          else { score += 10; reason = 'Geringe Wärmespeicherfähigkeit (< 120 kJ/(m³K)) – wenig Beitrag zum sommerlichen Wärmeschutz.'; }
        }

        if (navGoal === 'heat') {
          // Score based on low lambda
          const lambdaMin = parseFloat(p.lambda.split(' ')[0].replace(',', '.'));
          if (lambdaMin < 0.040) { score += 45; reason = 'Niedrige Wärmeleitfähigkeit (λ < 0,040) erlaubt geringere Dämmdicken.'; }
          else if (lambdaMin <= 0.045) { score += 30; reason = 'Marktübliche Wärmeleitfähigkeit (λ ≤ 0,045).'; }
          else { score += 15; reason = 'Höhere Wärmeleitfähigkeit erfordert dickere Dämmschichten für den gleichen U-Wert.'; }
        }

        if (navGoal === 'sound') {
          // Score based on density
          const maxRho = parseFloat(p.rho.split('-')[1] || p.rho);
          if (maxRho > 150) { score += 45; reason = 'Hohe Rohdichte – günstig für die Luftschalldämmung des Bauteils.'; }
          else if (maxRho > 60) { score += 30; reason = 'Mittlere Rohdichte – gute Hohlraumbedämpfung in leichten Bauteilen.'; }
          else { score += 10; reason = 'Geringe Rohdichte – wirkt v. a. als Hohlraumdämpfung.'; }
        }

        if (navGoal === 'moisture') {
          // Score based on moisture protection / vapor permeability
          const muVal = parseFloat(p.mu.split('-')[1] || p.mu);
          if (p.id === 'hempcrete' || p.id === 'paludikultur') {
            score += 48; reason = 'Kapillaraktiv und sorptionsfähig – geeignet für Innendämmung im Bestand (hygrothermischer Nachweis erforderlich).';
          } else if (muVal < 5) {
            score += 35; reason = 'Diffusionsoffen (niedriger μ-Wert) – erleichtert die Rücktrocknung.';
          } else {
            score += 20; reason = 'Sorptionsfähig, aber höherer Diffusionswiderstand.';
          }
        }

        if (navGoal === 'eco') {
          // Eco score (stroh, zellulose and paludikultur excel)
          if (p.id === 'stroh') { score += 49; reason = 'Sehr geringer Herstellungsaufwand (landwirtschaftliches Nebenprodukt).'; }
          else if (p.id === 'zellulose') { score += 42; reason = 'Überwiegend aus Altpapier – Sekundärrohstoff.'; }
          else if (p.id === 'paludikultur') { score += 45; reason = 'Paludikultur auf wiedervernässten Mooren mindert Emissionen aus entwässerten Moorböden.'; }
          else { score += 25; reason = 'Speichert biogenen Kohlenstoff; Herstellungsaufwand produktabhängig.'; }
        }

        // Adjust score based on wall type matching
        if (navWallType === 'innen' && (p.id === 'paludikultur' || p.id === 'hempcrete' || p.id === 'holzfaser')) {
          score += 10;
        } else if (navWallType === 'innen' && (p.id === 'stroh' || p.id === 'zellulose')) {
          score -= 15; // Hard to use loose in wall interiors unless specialized boards are chosen
        }

        return {
          product: p,
          score: Math.min(100, Math.max(10, score)),
          reason
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  const scoredMaterials = getScoredMaterials();

  return (
    <div className="flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-shiraz/10 rounded-2xl text-shiraz border border-shiraz/20 shadow-sm">
              <Trees size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight">
                NaWaRo <span className="text-shiraz font-medium text-lg">| Biobasierte Baustoffe</span>
              </h2>
              <p className="text-xs text-text-main/60 font-medium">Überblick mit Bezug auf Informationsangebote der FNR – Kennwerte sind Richtwerte</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-100 text-slate-800 border border-slate-200 py-1.5 px-3 rounded-full text-xs font-semibold">
            <Leaf size={14} className="text-shiraz" /> Richtwerte, keine Produktdaten
          </div>
        </div>

        {/* Outer Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20" id="nawaro_nav_tabs">
          <button
            id="tab_overview"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'overview' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <Layers size={16} /> Übersicht &amp; C-Kreislauf
          </button>
          
          <button
            id="tab_fnr_db"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'fnr_db' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('fnr_db')}
          >
            <BookOpen size={16} /> FNR Baustoff-Datenbank
          </button>
          
          <button
            id="tab_navigator"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'navigator' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('navigator')}
          >
            <Calculator size={16} /> Interaktiver Dämm-Navigator
          </button>

          <button
            id="tab_comparison"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'comparison' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('comparison')}
          >
            <Scale size={16} /> Technische Vergleiche
          </button>
        </div>

        {/* Tab content 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="nawaro_overview_content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="text-base text-text-main/80 bg-off-white p-5 rounded-2xl border border-home-grau/30 leading-relaxed">
                  <span className="font-bold text-emerald-800 uppercase text-xs tracking-wider block mb-1">Über die FNR e.V.</span>
                  Die <strong>Fachagentur Nachwachsende Rohstoffe e. V. (FNR)</strong> ist Projektträger des Bundesministeriums für Landwirtschaft, Ernährung und Heimat (BMLEH) für nachwachsende Rohstoffe. Ein Schwerpunkt ist das Bauen mit nachwachsenden Rohstoffen: Das Themenportal <strong>baustoffe.fnr.de</strong> informiert herstellerneutral über Materialien und Bauphysik, die FNR-Marktübersicht stellt Dämmstoffe aus nachwachsenden Rohstoffen zusammen.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-home-grau/20 p-4 rounded-xl bg-emerald-50/30 flex gap-3">
                    <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-text-main mb-1">CO₂-Speicher-Effekt (Carbon Sequestration)</h4>
                      <p className="text-xs text-text-main/70">Pflanzen entziehen der Luft beim Wachstum CO₂. Der Kohlenstoff bleibt für die Nutzungsdauer im Bauteil gespeichert und wird bei Verbrennung oder Verrottung wieder frei (temporärer Speicher).</p>
                    </div>
                  </div>

                  <div className="border border-home-grau/20 p-4 rounded-xl bg-emerald-50/30 flex gap-3">
                    <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-text-main mb-1">Ressourceneffizienz &amp; Zirkularität</h4>
                      <p className="text-xs text-text-main/70">Wiederverwendung (Re-Use) und – bei zusatzstofffreien Produkten – biologische Abbaubarkeit können Bauabfälle und Deponiekosten reduzieren.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carbon storage visualization card */}
              <div className="border border-home-grau/30 rounded-2xl p-5 bg-white shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-text-main text-sm flex items-center gap-2 border-b border-home-grau/20 pb-2">
                  <Activity size={16} className="text-emerald-600" /> Kohlenstoff-Dynamik
                </h3>
                
                {/* Embedded SVG scheme */}
                <div className="flex justify-center bg-off-white rounded-xl border border-home-grau/30 p-2">
                  <svg width="100%" height="150" viewBox="0 0 240 150">
                    <g transform="translate(40, 100)">
                      <rect x="-3" y="0" width="6" height="30" fill="#A3113E" />
                      <path d="M 0 -45 L 20 0 L -20 0 Z" fill="#475569" />
                      <text x="0" y="45" fontSize="9" fill="#1e293b" textAnchor="middle">Wachstum</text>
                      <path d="M -25 -20 Q -10 -5 -2 -15" fill="none" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
                      <text x="-25" y="-23" fontSize="8" fill="#334155" textAnchor="end">CO₂ Bindung</text>
                    </g>
                    <path d="M 85 80 L 115 80" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-gray)" />
                    <g transform="translate(155, 100)">
                      <rect x="-20" y="0" width="40" height="25" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                      <path d="M -25 0 L 0 -20 L 25 0 Z" fill="#A3113E" stroke="#881235" strokeWidth="1.5" />
                      <text x="0" y="40" fontSize="9" fill="#1e293b" textAnchor="middle">Nutzung im Bau</text>
                      <text x="0" y="16" fontSize="10" fill="#1e293b" textAnchor="middle" fontWeight="bold">C-Speicher</text>
                    </g>
                    <defs>
                      <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
                      </marker>
                      <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                      </marker>
                    </defs>
                  </svg>
                </div>
                <p className="text-[11px] text-text-main/60 leading-normal">
                  Pflanzliche Baustoffe speichern den aus CO₂ aufgenommenen Kohlenstoff über die Nutzungsdauer. In der Ökobilanz wird dieser biogene Kohlenstoff nach DIN EN 16449 bzw. DIN EN 15804 getrennt ausgewiesen.
                </p>
              </div>
            </div>

            {/* FNR Focus Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              <div className="border border-home-grau/30 p-4 rounded-xl bg-white hover:border-emerald-300 transition-all flex flex-col gap-2">
                <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">PRODUKTGRUPPE 1</span>
                <h4 className="font-bold text-sm text-text-main">Wärmedämmstoffe</h4>
                <p className="text-xs text-text-main/70">Biobasierte Zwischen-, Unter- &amp; Aufsparrendämmplatten aus Holzfasern, Naturfasern und Recyclingstoffen.</p>
              </div>
              <div className="border border-home-grau/30 p-4 rounded-xl bg-white hover:border-emerald-300 transition-all flex flex-col gap-2">
                <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">PRODUKTGRUPPE 2</span>
                <h4 className="font-bold text-sm text-text-main">Massiv- &amp; Konstruktionsholz</h4>
                <p className="text-xs text-text-main/70">Massivholzbau wie CLT (Brettsperrholz) und LVL (Furnierschichtholz) für Tragwerke mit geringem Herstellungs-Treibhauspotenzial und temporärer Kohlenstoffspeicherung.</p>
              </div>
              <div className="border border-home-grau/30 p-4 rounded-xl bg-white hover:border-emerald-300 transition-all flex flex-col gap-2">
                <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">PRODUKTGRUPPE 3</span>
                <h4 className="font-bold text-sm text-text-main">Verbundmaterialien</h4>
                <p className="text-xs text-text-main/70">Verbundbaustoffe wie Hanfkalk (Hempcrete) oder Wood-Plastic-Composites (WPC; Kunststoffanteil erschwert die Verwertung).</p>
              </div>
              <div className="border border-home-grau/30 p-4 rounded-xl bg-white hover:border-emerald-300 transition-all flex flex-col gap-2">
                <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">PRODUKTGRUPPE 4</span>
                <h4 className="font-bold text-sm text-text-main">Oberflächen, Farben &amp; Böden</h4>
                <p className="text-xs text-text-main/70">Ressourcenschonender Innenausbau unter Verwendung von Linoleum, Naturharzlacken und organischen Putzträgern.</p>
              </div>
            </div>

            {/* Technical boundaries banner */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-xs text-amber-950/80 leading-relaxed">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
              <div>
                <strong>Konstruktive Beachtung:</strong> Biobasierte Baustoffe erfordern konsequenten Schutz vor dauerhafter Feuchtebelastung (baulicher Holzschutz und Gebrauchsklassen nach DIN 68800). Der Einbau muss stets schlagregen- und erdberührungsdicht geplant werden, um Schimmelbildung und fäulnisbedingten Verlust tragender Eigenschaften zu verhindern.
              </div>
            </div>
          </div>
        )}

        {/* Tab content 2: FNR DATABASE */}
        {activeTab === 'fnr_db' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="nawaro_db_content">
            
            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setDbCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbCategory === 'all' 
                      ? 'bg-text-main text-white border-text-main' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  Alle Produkte
                </button>
                <button
                  onClick={() => setDbCategory('daemmung')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbCategory === 'daemmung' 
                      ? 'bg-emerald-700 text-white border-emerald-700' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  Dämmstoffe
                </button>
                <button
                  onClick={() => setDbCategory('tragwerk')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbCategory === 'tragwerk' 
                      ? 'bg-blue-700 text-white border-blue-700' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  Tragwerk
                </button>
                <button
                  onClick={() => setDbCategory('lehm_putz')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbCategory === 'lehm_putz' 
                      ? 'bg-amber-700 text-white border-amber-700' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  Lehm &amp; Putze
                </button>
                <button
                  onClick={() => setDbCategory('boden')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbCategory === 'boden' 
                      ? 'bg-rose-700 text-white border-rose-700' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  Böden &amp; Lacke
                </button>
              </div>

              {/* Search input */}
              <div className="relative flex-grow max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-home-grau" />
                <input
                  type="text"
                  placeholder="Material suchen..."
                  value={dbSearch}
                  onChange={(e) => setDbSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 border border-home-grau/30 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 bg-white text-text-main font-medium placeholder:text-home-grau"
                />
              </div>
            </div>

            {/* Split layout: List vs Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Material List (col span 5) */}
              <div className="lg:col-span-5 flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-2">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                        selectedProduct === p.id
                          ? 'bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                          : 'bg-white border-home-grau/30 hover:border-home-grau/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-text-main">{p.name}</span>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          p.category === 'daemmung' ? 'bg-emerald-100 text-emerald-800' :
                          p.category === 'tragwerk' ? 'bg-blue-100 text-blue-800' :
                          p.category === 'lehm_putz' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {p.category}
                        </span>
                      </div>
                      <p className="text-xs text-text-main/60 line-clamp-1">{p.description}</p>
                      <div className="flex items-center justify-between text-[11px] font-mono mt-1 text-text-main/50">
                        <span>λ = {p.lambda} W/(mK)</span>
                        <span>ρ = {p.rho} kg/m³</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12 text-xs text-text-main/50 border border-dashed border-home-grau/20 rounded-xl">
                    Keine Materialien für diese Filtereinstellungen gefunden.
                  </div>
                )}
              </div>

              {/* Material Details Sheet (col span 7) */}
              <div className="lg:col-span-7 bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-5">
                <div>
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
                    <Sparkles size={14} /> Materialsteckbrief
                  </div>
                  <h3 className="text-lg font-black text-text-main">{selectedProductData.name}</h3>
                  <p className="text-xs text-text-main/70 mt-1">{selectedProductData.description}</p>
                </div>

                {/* Technical Parameters Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20">
                    <span className="text-[10px] text-text-main/40 font-bold block">Rohdichte (ρ)</span>
                    <span className="font-mono text-sm font-bold text-text-main">{selectedProductData.rho} kg/m³</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20">
                    <span className="text-[10px] text-text-main/40 font-bold block">Wärmeleitfähigkeit (λ)</span>
                    <span className="font-mono text-sm font-bold text-emerald-700">{selectedProductData.lambda} W/(mK)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20">
                    <span className="text-[10px] text-text-main/40 font-bold block">Spez. Wärme (c)</span>
                    <span className="font-mono text-sm font-bold text-text-main">{selectedProductData.c} J/(kgK)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20">
                    <span className="text-[10px] text-text-main/40 font-bold block">Diffusionswiderst. (μ)</span>
                    <span className="font-mono text-sm font-bold text-text-main">{selectedProductData.mu}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 col-span-2">
                    <span className="text-[10px] text-text-main/40 font-bold block">Brand- / Baustoffklasse</span>
                    <span className="text-xs font-bold text-text-main block mt-0.5">{selectedProductData.fireClass}</span>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg">
                    <h4 className="text-xs font-black text-emerald-800 mb-2 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Vorteile &amp; Potenziale
                    </h4>
                    <ul className="text-xs text-emerald-950/80 space-y-1.5 list-disc list-inside">
                      {selectedProductData.advantages.map((adv, i) => (
                        <li key={i} className="leading-tight">{adv}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-torch-red/5 border border-torch-red/10 p-3 rounded-lg">
                    <h4 className="text-xs font-black text-danger mb-2 flex items-center gap-1">
                      <AlertCircle size={13} /> Grenzen &amp; Risiken
                    </h4>
                    <ul className="text-xs text-text-main/80 space-y-1.5 list-disc list-inside">
                      {selectedProductData.disadvantages.map((dis, i) => (
                        <li key={i} className="leading-tight">{dis}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs">
                  <span className="font-bold text-text-main block mb-1">FNR-Praxisempfehlung:</span>
                  <p className="text-text-main/75">{selectedProductData.fnrUsage}</p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Tab content 3: DÄMMSTOFF NAVIGATOR */}
        {activeTab === 'navigator' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="nawaro_navigator_content">
            
            <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-200">
              <h3 className="font-bold text-sm text-emerald-900 mb-1 flex items-center gap-2">
                <Calculator size={18} /> Dämmstoff-Navigator (Lehrmodell)
              </h3>
              <p className="text-xs text-emerald-900/80">
                Wählen Sie Ihre primären konstruktiven Zielstellungen und das Bauteil aus. Der Navigator ordnet die Dämmstoffgruppen nach einer vereinfachten Punktebewertung aus den Richtwerten (λ, ρ, c, μ). Er ersetzt keine Planung und keinen Nachweis.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Sidebar controls (col span 4) */}
              <div className="lg:col-span-4 flex flex-col gap-5 border border-home-grau/30 p-5 rounded-xl bg-white">
                
                {/* Rule-1: Prioritized Target (Interaktives Steuerelement) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider">Planerischer Ziel-Fokus</label>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setNavGoal('summer')}
                      className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        navGoal === 'summer'
                          ? 'bg-shiraz text-white border-shiraz font-bold shadow-md'
                          : 'bg-white border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      <Zap size={16} className="text-amber-500" />
                      <div>
                        <span className="text-xs block">Sommerlicher Wärmeschutz</span>
                        <span className="text-[10px] text-text-main/50 font-normal">Verzögerung von Hitzeeinträgen (Phasenverschiebung)</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setNavGoal('heat')}
                      className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        navGoal === 'heat'
                          ? 'bg-shiraz text-white border-shiraz font-bold shadow-md'
                          : 'bg-white border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      <Layers size={16} className="text-blue-500" />
                      <div>
                        <span className="text-xs block">Maximaler Kälteschutz (Wärmeschutz)</span>
                        <span className="text-[10px] text-text-main/50 font-normal">Niedrige Wärmeleitfähigkeit λ für dünne Wände</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setNavGoal('sound')}
                      className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        navGoal === 'sound'
                          ? 'bg-shiraz text-white border-shiraz font-bold shadow-md'
                          : 'bg-white border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      <Activity size={16} className="text-purple-500" />
                      <div>
                        <span className="text-xs block">Akustische Dämpfung (Schallschutz)</span>
                        <span className="text-[10px] text-text-main/50 font-normal">Höhere Rohdichte ρ verbessert die Luftschalldämmung</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setNavGoal('moisture')}
                      className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        navGoal === 'moisture'
                          ? 'bg-shiraz text-white border-shiraz font-bold shadow-md'
                          : 'bg-white border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      <Droplets size={16} className="text-sky-500" />
                      <div>
                        <span className="text-xs block">Feuchtesicherheit &amp; Diffusion</span>
                        <span className="text-[10px] text-text-main/50 font-normal">Diffusionsoffene und kapillaraktive Rücktrocknung</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setNavGoal('eco')}
                      className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        navGoal === 'eco'
                          ? 'bg-shiraz text-white border-shiraz font-bold shadow-md'
                          : 'bg-white border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      <Leaf size={16} className="text-emerald-500" />
                      <div>
                        <span className="text-xs block">Minimierte graue Energie (Öko-Fokus)</span>
                        <span className="text-[10px] text-text-main/50 font-normal">Niedrigster Herstellungsaufwand &amp; Recycling</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Wall/Building Component */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider">Dämmendes Bauteil</label>
                  <select aria-label="Dämmendes Bauteil"
                    value={navWallType}
                    onChange={(e) => setNavWallType(e.target.value as any)}
                    className="w-full border border-home-grau/30 rounded-lg p-2 text-xs text-text-main font-semibold bg-white"
                  >
                    <option value="dach">Steildach / Zwischensparrendämmung</option>
                    <option value="innen"> Fachwerk-Innendämmung (feuchtekritisch)</option>
                    <option value="fassade">Hinterlüftete Außenfassade / Holzbau-WDVS</option>
                  </select>
                </div>

              </div>

              {/* Dynamic results display (col span 8) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <h3 className="font-bold text-sm text-text-main uppercase tracking-wider">Dämmstoff-Dynamik Ranking</h3>
                
                <div className="flex flex-col gap-4">
                  {scoredMaterials.slice(0, 4).map((m, idx) => (
                    <div
                      key={m.product.id}
                      className="border border-home-grau/30 rounded-xl p-4 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-emerald-400 transition-all"
                    >
                      <div className="flex-grow flex flex-col gap-1.5 max-w-lg">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-sm text-text-main">{m.product.name}</span>
                          {idx === 0 && (
                            <span className="text-[9px] font-black uppercase text-white bg-emerald-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Sparkles size={10} /> Empfehlung
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-850 font-medium leading-normal bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/60">
                          {m.reason}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] text-text-main/40 font-mono mt-1">
                          <span>λ: {m.product.lambda} W/(mK)</span>
                          <span>ρ: {m.product.rho} kg/m³</span>
                          <span>c: {m.product.c} J/(kgK)</span>
                        </div>
                      </div>

                      {/* Score visual metric */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0 self-end md:self-center">
                        <span className="text-xs font-bold text-emerald-700 font-mono">{formatDeWert(m.score)}% Eignung</span>
                        <div className="w-24 bg-home-grau/20 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${m.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab content 4: COMPARISONS */}
        {activeTab === 'comparison' && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-8" id="nawaro_comparison_content">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Technischer Detailvergleich zwischen konventionellen Baustoffen und NaWaRo-Alternativen (Richtwerte; Kennwerte BSH nach DIN EN 14080, Beton nach DIN EN 1992-1-1) bezüglich baustoffphysikalischer sowie mechanischer Parameter.
              </p>
            </div>

            {/* Dämmstoffe Vergleich */}
            <div>
              <h3 className="font-bold text-text-main text-base mb-3 flex items-center gap-2">
                <Scale size={18} className="text-shiraz" /> Wärmedämmstoffe: Erdöl-EPS vs. Holzfaserplatte
              </h3>
              <div className="overflow-x-auto bg-white rounded-xl border border-home-grau/30">
                <table className="w-full text-left text-sm">
                  <thead className="bg-home-grau/5">
                    <tr>
                      <th className="py-3 px-4 font-bold text-text-main">Eigenschaft</th>
                      <th className="py-3 px-4 font-bold text-text-main border-l border-home-grau/10">EPS (Styropor)</th>
                      <th className="py-3 px-4 font-bold text-emerald-700 border-l border-home-grau/10">Holzfaserdämmplatte</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-home-grau/10">
                      <td className="py-3 px-4 font-medium">Wärmeleitfähigkeit (λ)</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono">0,032 - 0,040 W/(m·K)</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">0,038 - 0,050 W/(m·K)</td>
                    </tr>
                    <tr className="border-t border-home-grau/10 bg-off-white/50">
                      <td className="py-3 px-4 font-medium">Spezifische Wärmekapazität (c)</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono">~1.500 J/(kg·K)</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">~2.100 J/(kg·K) <span className="text-xs block text-emerald-600">(Besserer sommerlicher Wärmeschutz)</span></td>
                    </tr>
                    <tr className="border-t border-home-grau/10">
                      <td className="py-3 px-4 font-medium">Rohdichte (ρ)</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono">15 - 30 kg/m³</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">110 - 200 kg/m³ <span className="text-xs block text-emerald-600">(Mehr Schallschutzmasse)</span></td>
                    </tr>
                    <tr className="border-t border-home-grau/10 bg-off-white/50">
                      <td className="py-3 px-4 font-medium">Diffusionswiderstand (μ)</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono">20 - 100</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">3 - 5 <span className="text-xs block text-emerald-600">(diffusionsoffen)</span></td>
                    </tr>
                    <tr className="border-t border-home-grau/10">
                      <td className="py-3 px-4 font-medium">Brandschutz-Klassifizierung</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono">Brandverhalten: Euroklasse E (Platte); im zugelassenen WDVS mit Brandriegeln schwerentflammbar</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">B2 (normalentflammbar) / E</td>
                    </tr>
                    <tr className="border-t border-home-grau/10 bg-off-white/50">
                      <td className="py-3 px-4 font-medium">Primärenergie nicht erneuerbar (PENRT, Richtwert)</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-torch-red">~100 MJ/kg (nicht erneuerbar)</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">~15 MJ/kg (biogen)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tragende Konstruktionen */}
            <div>
              <h3 className="font-bold text-text-main text-base mb-3 flex items-center gap-2">
                <Scale size={18} className="text-shiraz" /> Tragwerk: Normalbeton vs. Brettschichtholz (GL24h)
              </h3>
              <div className="overflow-x-auto bg-white rounded-xl border border-home-grau/30">
                <table className="w-full text-left text-sm">
                  <thead className="bg-home-grau/5">
                    <tr>
                      <th className="py-3 px-4 font-bold text-text-main">Eigenschaft</th>
                      <th className="py-3 px-4 font-bold text-text-main border-l border-home-grau/10">Normalbeton (C25/30)</th>
                      <th className="py-3 px-4 font-bold text-emerald-700 border-l border-home-grau/10">Brettschichtholz (BSH)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-home-grau/10">
                      <td className="py-3 px-4 font-medium">Rohdichte (ρ)</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono">~2.400 kg/m³</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">~420 kg/m³ <span className="text-xs block text-emerald-600">(geringere Eigenlast)</span></td>
                    </tr>
                    <tr className="border-t border-home-grau/10 bg-off-white/50">
                      <td className="py-3 px-4 font-medium">Zug- bzw. Biegefestigkeit</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono">f_ctm ≈ 2,6 N/mm² (Zug, unbewehrt)</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">24 N/mm² <span className="text-xs block text-emerald-600">(char. Biegefestigkeit f_m,k)</span></td>
                    </tr>
                    <tr className="border-t border-home-grau/10">
                      <td className="py-3 px-4 font-medium">Elastizitätsmodul (E)</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono">31.000 N/mm²</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">11.500 N/mm²</td>
                    </tr>
                    <tr className="border-t border-home-grau/10 bg-off-white/50">
                      <td className="py-3 px-4 font-medium">CO₂-Bilanz</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-torch-red">Klinkerentsäuerung emittiert CO₂</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">Biogener Kohlenstoffspeicher (ca. −0,7 t CO₂-Äq./m³ nach DIN EN 16449)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <FormulaDerivationBox
              title="Anwendungsbeispiel: Biogener Kohlenstoff in 1 m³ BSH"
              zielGleichung="P_{CO_2} = \frac{44}{12} \cdot cf \cdot \frac{\rho_\omega \cdot V_\omega}{1 + \omega/100}"
              normQuelle="DIN EN 16449:2014-06"
              schritte={[
                { titel: '1. Gegeben', formel: '\\rho_{12} = 420\\,\\text{kg/m}^3,\\; \\omega = 12\\,\\%,\\; cf = 0{,}5,\\; V = 1\\,\\text{m}^3', erklaerung: 'Rohdichte bei 12 % Holzfeuchte, Kohlenstoffanteil der Trockenmasse 50 %.' },
                { titel: '2. Darrmasse', formel: 'm_0 = 420 / 1{,}12 = 375\\,\\text{kg}', erklaerung: 'Wasseranteil herausrechnen.' },
                { titel: '3. Kohlenstoff', formel: 'm_C = 0{,}5 \\cdot 375 = 187{,}5\\,\\text{kg}', erklaerung: 'Gespeicherter biogener Kohlenstoff.' },
                { titel: '4. CO₂-Äquivalent', formel: 'P_{CO_2} = 44/12 \\cdot 187{,}5 = 688\\,\\text{kg}', erklaerung: 'Molmassenverhältnis CO₂ zu C.' },
              ]}
              ergebnisHinweis="Rund 0,69 t CO₂ je m³ – ein temporärer Speicher, der am Lebensende wieder frei wird, sofern das Holz nicht weiter genutzt wird."
            />

          </div>
        )}

      </div>
      
      
      <ModulTest moduleId="nawaro" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Nachwachsender Rohstoff', url: 'https://de.wikipedia.org/wiki/Nachwachsender_Rohstoff' },
          { title: 'Fachagentur Nachwachsende Rohstoffe', url: 'https://de.wikipedia.org/wiki/Fachagentur_Nachwachsende_Rohstoffe' },
          { title: 'Dämmstoff', url: 'https://de.wikipedia.org/wiki/D%C3%A4mmstoff' },
          { title: 'Holzfaserwerkstoff', url: 'https://de.wikipedia.org/wiki/Holzfaserwerkstoff' }
        ]}
        literatur={[
          'Fachagentur Nachwachsende Rohstoffe e. V. (FNR) (Hrsg.): Marktübersicht Dämmstoffe aus nachwachsenden Rohstoffen. 13., überarb. Aufl., Gülzow-Prüzen: FNR 2024',
          'Niemz, P.; Sonderegger, W.: Holzphysik – Eigenschaften, Prüfung und Kennwerte. 2. Aufl., München: Hanser 2021'
        ]}
        weblinks={[
          { title: 'FNR-Themenportal Bauen', url: 'https://baustoffe.fnr.de/' }
        ]}
        regelwerke={[
          { title: 'DIN 4108-2 (Mindestanforderungen an den Wärmeschutz; Neuausgabe 2026-05, bisher 2013-02)' },
          { title: 'DIN 4108-10:2021-11 (Wärmeschutz und Energie-Einsparung in Gebäuden - Anwendungsbezogene Anforderungen an Dämmstoffe)' },
          { title: 'DIN 68800 Teile 1 bis 4 (Holzschutz; Teil 1:2019-06, Teil 2:2022-02, Teil 3:2020-03, Teil 4:2020-12)' },
          { title: 'DIN EN 13171:2015-04 (Wärmedämmstoffe für Gebäude - Werkmäßig hergestellte Produkte aus Holzfasern (WF))' },
          { title: 'DIN EN 16449:2014-06 (Holz und Holzprodukte – Berechnung des biogenen Kohlenstoffgehalts)' },
          { title: 'DIN EN 15101-1:2019-07 (Wärmedämmstoffe für Gebäude – An der Verwendungsstelle hergestellte Wärmedämmung aus Zellulosefüllstoff (LFCI))' },
          { title: 'GModG (Gebäudemodernisierungsgesetz, seit 29.07.2026; vormals GEG) / EPBD (EU) 2024/1275', url: 'https://www.gesetze-im-internet.de/geg/' }
        ]}
        formeln={[
          {
            formel: 's = \\rho \\cdot c',
            erklaerung: 'Volumenbezogene Wärmespeicherfähigkeit in kJ/(m³·K) (ρ in kg/m³, c in kJ/(kg·K)). Hohe Werte verzögern sommerliche Wärmeeinträge.',
            quelle: 'Bauphysik-Grundlagen'
          },
          {
            formel: 'a = \\frac{\\lambda}{\\rho \\cdot c}',
            erklaerung: 'Temperaturleitfähigkeit in m²/s: Je kleiner a, desto langsamer dringt eine Temperaturwelle ein (größere Phasenverschiebung).',
            quelle: 'Bauphysik-Grundlagen'
          },
          {
            formel: 'P_{CO_2} = \\frac{44}{12} \\cdot cf \\cdot \\frac{\\rho_\\omega \\cdot V_\\omega}{1 + \\omega/100}',
            erklaerung: 'Im Holz gespeichertes CO₂ mit cf = 0,5 (Kohlenstoffanteil der Darrmasse).',
            quelle: 'DIN EN 16449'
          }
        ]}
      />
    </div>
  );
}
