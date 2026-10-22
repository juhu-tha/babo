import React, { useState, useMemo } from 'react';
import { GMODG_ANLAGE7, FX, uRetrofit, dRequired } from '@/src/utils/bestandKern';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Slider } from '@/src/components/ui/Slider';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { InlineMath, BlockMath } from 'react-katex';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  Building2, 
  Layers, 
  Construction, 
  Calendar, 
  Flame, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Coins, 
  ShieldCheck, 
  FileText, 
  Activity,
  Calculator,
  Compass,
  Zap,
  Leaf,
  BarChart3,
  BookOpen,
  AlertTriangle,
  Info,
  SlidersHorizontal
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Baualtersklasse {
  id: string;
  vintage: string;
  label: string;
  description: string;
  typicalConstruction: string;
  characteristicMaterials: string[];
  windows: string;
  uValueWall: number;
  uValueRoof: number;
  uValueFloor: number;
  uValueWindow: number;
}

const BAUALTERSKLASSEN: Baualtersklasse[] = [
  {
    id: 'vor-1919',
    vintage: 'Vor 1919',
    label: 'Gründerzeit & Kaiserreich',
    description: 'Bauten aus der Vorkriegszeit. Typisch sind massive, oft ungedämmte Vollziegelmauerwerk-Konstruktionen, repräsentative Putz- oder Klinkerfassaden, Holzbalkendecken mit Einschub-Fehlböden sowie historische Fachwerkbauten.',
    typicalConstruction: 'Massives Ziegelmauerwerk (38-51 cm), Fachwerk, Holzbalkendecken mit Lehm/Sand-Verfüllung, preußische Kappen über Kellern, einfache Kastenfenster.',
    characteristicMaterials: ['Lehm- & Kalkmörtel', 'Vollziegel (Ziegelstein)', 'Nadelholz (historisch)', 'Natursteine', 'Gusseisen'],
    windows: 'Einfachfenster oder historische Kastenfenster (ungedämmt)',
    uValueWall: 1.60,
    uValueRoof: 1.80,
    uValueFloor: 1.40,
    uValueWindow: 4.50,
  },
  {
    id: '1919-1948',
    vintage: '1919 - 1948',
    label: 'Weimarer Republik & Weltkriegsära',
    description: 'Geprägt durch den genossenschaftlichen Wohnungsbau der 20er Jahre und den späteren kriegsbedingten Mangelbau. Vermehrt zweischalige Mauerwerkswelt (Ziegel mit Luftschicht) und erste einfache Betonfertigung oder Hohlsteindecken.',
    typicalConstruction: 'Hohlmauerwerk, zweischaliges Mauerwerk (Schlitzmauerwerk), Holzbalkendecken, Steineisendecken (Kleine Decke), Verbundfenster.',
    characteristicMaterials: ['Zementmörtel (frühe Formen)', 'Kalksandstein', 'Hüttensandziegel', 'Bimsbetonsteine'],
    windows: 'Holzverbundfenster mit Einfachverglasung',
    uValueWall: 1.40,
    uValueRoof: 1.60,
    uValueFloor: 1.20,
    uValueWindow: 3.20,
  },
  {
    id: '1949-1957',
    vintage: '1949 - 1957',
    label: 'Nachkriegszeit & Wiederaufbau',
    description: 'Konstruktionen der unmittelbaren Nachkriegszeit. Baustoffe waren Mangelware, weshalb häufig Trümmerschuttbeton (Trümmerziegel-Zuschläge) und Schlackenbetonblöcke verwendet wurden. Extrem minimierte Bauteildicken.',
    typicalConstruction: 'Mauerwerk aus Trümmerbetonsteinen, dünne einschalige Außenwände (oft 24-30 cm), Rippendecken, Holzbalkendecken, einfache Verbundfenster.',
    characteristicMaterials: ['Trümmerbeton', 'Schlackenbeton', 'Heraklith (Holzwolle-Platten)', 'Schlackendämmstoffe'],
    windows: 'Holzrahmen-Verbundfenster oder Einfachfenster',
    uValueWall: 1.70,
    uValueRoof: 1.50,
    uValueFloor: 1.30,
    uValueWindow: 3.00,
  },
  {
    id: '1958-1968',
    vintage: '1958 - 1968',
    label: 'Frühes Wirtschaftswunder',
    description: 'Industrialisierung des Bauens. Erste Hohlblocksteine aus Bims oder Leichtbeton verbesserten die Wärmedämmung leicht, allerdings bei nach wie vor dünnen Bauteilquerschnitten. Erste Isolierglasfenster kommen auf.',
    typicalConstruction: 'Porenbetonmauerwerk, Leichtbetonhohlblöcke, Einblasdämmung in zweischaligem Mauerwerk, Stahlbeton-Rippendecken, frühe Isolierglasfenster.',
    characteristicMaterials: ['Porenbeton (Ytong)', 'Gitterziegel', 'Asbestzement (Eternit-Platten)', 'Künstliche Mineralfasern (KMF)'],
    windows: 'Isolierfenster der 1. Generation ohne Metallbeschichtung',
    uValueWall: 1.20,
    uValueRoof: 1.10,
    uValueFloor: 1.00,
    uValueWindow: 2.80,
  },
  {
    id: '1969-1978',
    vintage: '1969 - 1978',
    label: 'System- & Großtafelbauten',
    description: 'Die Ära des Massenwohnungsbaus in West und Ost (Plattenbauten). Standardisierte Betonelemente, oft ungedämmt oder mit sehr geringer Kerndämmung. Erarbeitung der ersten Wärmeschutzverordnung (WSchV 1977) gegen Ende dieser Epoche.',
    typicalConstruction: 'Großtafelbauweise (Plattenbau), Ziegelgitterstein-Mauerwerk, ungedämmte Flachdächer (Kaltdach/Warmdach), Stahlbeton-Massivdecken.',
    characteristicMaterials: ['Stahlbetonfertigteile', 'Kerndämmung (Styropor/KMF)', 'Fugenabdichtungen (Thiokol)', 'PU-Schäume'],
    windows: 'Isolierglasfenster in Holz- oder Metallrahmen',
    uValueWall: 1.10,
    uValueRoof: 0.90,
    uValueFloor: 0.90,
    uValueWindow: 2.70,
  },
  {
    id: '1979-1994',
    vintage: '1979 - 1994',
    label: 'Früher Wärmeschutz (WSchV \'77/\'82)',
    description: 'Unter dem Eindruck der Ölkrisen traten die Wärmeschutzverordnungen von 1977 und 1982 in Kraft. Erste gezielte Dämmschichten an Außenwänden (WDVS) und Dächern sowie beschichtete Fenstersysteme.',
    typicalConstruction: 'Mauerwerk mit zusätzlichem Wärmedämmverbundsystem (WDVS), mehrschichtige Wandkonstruktionen, Zwischensparrendämmung im Dachgerüst.',
    characteristicMaterials: ['Polystyrol (EPS/Styropor)', 'Mineralwolle (Steinwolle)', 'Putzsysteme auf Dämmung', 'Zweischeiben-Isolierglas'],
    windows: 'Zwei-Scheiben-Isolierverglasung, erste Kunststofffenster',
    uValueWall: 0.60,
    uValueRoof: 0.45,
    uValueFloor: 0.60,
    uValueWindow: 2.00,
  },
  {
    id: '1995-2001',
    vintage: '1995 - 2001',
    label: 'Niedrigenergie-Standard (WSchV \'95)',
    description: 'Einführung des rechnerischen Heizwärmebedarfs. Fokus verlagert sich auf verbesserte Luftdichtheit (erste Blower-Door-Tests) und gezielte Vermeidung von Wärmebrücken im Übergangsbereich.',
    typicalConstruction: 'Kerndämmung 8-10 cm, verbesserte Außenwanddämmung, Mineralwolledämmung der Dachsparren (12-16 cm), optimierte Bauteilanschlüsse.',
    characteristicMaterials: ['Calcium-Silikat-Platten', 'Dampfsperrfolien/Dichtbänder', 'Edelgasmischungen (Argon)', 'Mineralwolle WLG 035'],
    windows: 'Zwei-Scheiben-Wärmeschutzverglasung mit selektiver Beschichtung & Gasfüllung',
    uValueWall: 0.35,
    uValueRoof: 0.30,
    uValueFloor: 0.40,
    uValueWindow: 1.40,
  },
  {
    id: '2002-2013',
    vintage: '2002 - 2013',
    label: 'EnEV-Ära (EnEV 2002 - 2009)',
    description: 'Einführung der Energieeinsparverordnung (EnEV). Ganzheitliche energetische Bilanzierung von Gebäudehülle und Heizungsanlagentechnik sowie Einführung des gesetzlichen Energieausweises.',
    typicalConstruction: 'WDVS (12-16 cm) mit EPS/Steinwolle, hochgedämmtes Hintermauerwerk (Planziegel oder Porenbeton), Dreifachverglasung setzt sich am Markt langsam durch.',
    characteristicMaterials: ['Poroton Planziegelsysteme', 'Holzfaserdämmstoffe', 'Klimamembranen', 'PUR/PIR Aufsparrendämmung'],
    windows: 'Hochwertiges 2-Scheiben-Wärmeschutzglas oder frühe 3-Scheiben-Dämmgläser',
    uValueWall: 0.28,
    uValueRoof: 0.22,
    uValueFloor: 0.32,
    uValueWindow: 1.20,
  },
  {
    id: '2014-2020',
    vintage: '2014 - 2020',
    label: 'Verschärfter EnEV-Standard (EnEV 2014/2016)',
    description: 'Verschärfung der primärenergetischen Grenzwerte um 25 % und des baulichen Wärmeschutzes um 20 %. Massive Zunahme von Dreifachverglasung, kontrollierter Wohnraumlüftung mit Wärmerückgewinnung und PV-Integration.',
    typicalConstruction: 'WDVS (16-20 cm), monolitische Ziegel- oder Porenbetonwände mit Dämmfüllung (Perlit, Mineralwolle), hochgedämmte Dächer (20-26 cm).',
    characteristicMaterials: ['Perlit-gefüllte Ziegel', 'Vakuum-Isolations-Paneele (VIP)', 'Extrudierter Polystyrol-Hartschaum (XPS)', 'Aerogel-Dämmputze'],
    windows: '3-Scheiben-Wärmeschutzverglasung mit thermisch getrenntem Randverbund („Warme Kante“)',
    uValueWall: 0.22,
    uValueRoof: 0.18,
    uValueFloor: 0.25,
    uValueWindow: 0.90,
  },
  {
    id: 'ab-2020',
    vintage: 'Ab 2020',
    label: 'GEG / Niedrigstenergiegebäude',
    description: 'Zusammenführung von EnEV, EnEG und EEWärmeG im Gebäudeenergiegesetz (GEG) und dem novellierten GModG. Gesetzlicher Niedrigstenergie-Gebäudestandard mit Fokus auf Lebenszyklusemissionen und 65-%-EE-Heizungsvorgaben.',
    typicalConstruction: 'Hochgedämmte Hülle (Passivhaus- oder KfW-40-Niveau), Holz-Massivbauweise mit Zellulose-/Holzfaserdämmung, thermisch entkoppelte Fundamente.',
    characteristicMaterials: ['Zellulose-Einblasdämmung', 'Holzweichfaserplatten', 'Recycling-Betone', 'Vakuum-Dämmung'],
    windows: 'Hocheffiziente 3-Scheiben-Isolierverglasung (Ug ≤ 0,5 W/(m²K), Uw ≤ 0,8 W/(m²K))',
    uValueWall: 0.18,
    uValueRoof: 0.14,
    uValueFloor: 0.20,
    uValueWindow: 0.80,
  }
];

const HEATING_SOURCES = [
  { id: 'gas', label: 'Erdgas-Heizung', co2Factor: 0.22, costPerKwh: 0.11 },
  { id: 'oil', label: 'Heizöl', co2Factor: 0.28, costPerKwh: 0.12 },
  { id: 'district', label: 'Fernwärme (Mix)', co2Factor: 0.16, costPerKwh: 0.14 },
  { id: 'electricity', label: 'Direkt-Elektroheizung', co2Factor: 0.38, costPerKwh: 0.35 },
  { id: 'heatpump', label: 'Wärmepumpe (JAZ 3.5)', co2Factor: 0.11, costPerKwh: 0.09 },
];

export default function Bestand() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'sanierung' | 'vergleich' | 'theorie'>('steckbrief');
  const [selectedEra, setSelectedEra] = useState<string>('vor-1919');
  const [showCalculations, setShowCalculations] = useState<boolean>(false);
  
  // Sanierungskonfigurator-States
  const [selectedComp, setSelectedComp] = useState<'wall' | 'roof' | 'floor'>('wall');
  const [area, setArea] = useState<number>(100);
  const [thickness, setThickness] = useState<number>(140); // in mm
  const [lambda, setLambda] = useState<number>(0.035); // W/(mK)
  const [insulationCostM2, setInsulationCostM2] = useState<number>(120); // €/m²
  const [heatingSource, setHeatingSource] = useState<string>('gas');

  const currentEraData = useMemo(() => {
    return BAUALTERSKLASSEN.find(e => e.id === selectedEra) || BAUALTERSKLASSEN[0];
  }, [selectedEra]);

  // Calculations for thermal refurbishment
  const sanierungResults = useMemo(() => {
    // Höchstwerte nach Anlage 7 GModG; Temperatur-Korrekturfaktor Fx nach DIN V 4108-6
    let originalU = currentEraData.uValueWall;
    let gegLimit: number = GMODG_ANLAGE7.aussenwand;
    let fx = FX.aussenwand ?? 1.0;

    if (selectedComp === 'roof') {
      originalU = currentEraData.uValueRoof;
      gegLimit = GMODG_ANLAGE7.steildach_oGD; // Steildach / oberste Geschossdecke (Flachdach: 0,20)
      fx = FX.steildach_oGD ?? 0.8;
    } else if (selectedComp === 'floor') {
      originalU = currentEraData.uValueFloor;
      gegLimit = GMODG_ANLAGE7.kellerdecke_erdreich;
      fx = FX.kellerdecke_erdreich ?? 0.6;
    }

    const newU = uRetrofit(originalU, thickness / 1000, lambda);
    const deltaU = Math.max(0, originalU - newU);

    // Heizwärmeeinsparung: ΔQ = ΔU · A · F_x · G_t20/15 · 24 / 1000 [kWh/a], G_t = 3 500 Kd/a (Standortmittel)
    const GT = 3500;
    const annualEnergySavings = deltaU * area * fx * GT * 24 / 1000;
    const dReqMm = Math.ceil(dRequired(newU, gegLimit, lambda) * 1000);

    const heatConfig = HEATING_SOURCES.find(h => h.id === heatingSource) || HEATING_SOURCES[0];
    const annualCostSavings = annualEnergySavings * heatConfig.costPerKwh;
    const annualCo2Savings = annualEnergySavings * heatConfig.co2Factor;

    const totalInvestment = area * insulationCostM2;
    const paybackYears = annualCostSavings > 0 ? (totalInvestment / annualCostSavings) : 999;
    const gegCompliant = newU <= gegLimit + 1e-9;

    return {
      originalU,
      newU,
      deltaU,
      gegLimit,
      gegCompliant,
      annualEnergySavings,
      annualCostSavings,
      annualCo2Savings,
      totalInvestment,
      paybackYears,
      fx, GT, dReqMm
    };
  }, [currentEraData, selectedComp, area, thickness, lambda, insulationCostM2, heatingSource]);

  // Chart data
  const chartData = {
    labels: BAUALTERSKLASSEN.map(b => b.vintage),
    datasets: [
      {
        label: 'Außenwand U-Wert [W/(m²K)]',
        data: BAUALTERSKLASSEN.map(b => b.uValueWall),
        borderColor: '#9E2A2B',
        backgroundColor: '#9E2A2B',
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: 'Dach U-Wert [W/(m²K)]',
        data: BAUALTERSKLASSEN.map(b => b.uValueRoof),
        borderColor: '#334155',
        backgroundColor: '#334155',
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: 'GModG Grenzwert Außenwand (0,24 W/(m²K))',
        data: Array(BAUALTERSKLASSEN.length).fill(0.24),
        borderColor: '#64748B',
        borderDash: [6, 4],
        pointRadius: 0,
        borderWidth: 1.5,
        fill: false,
      },
      {
        label: 'GModG Grenzwert Steildach / oberste Geschossdecke (0,24 W/(m²K))',
        data: Array(BAUALTERSKLASSEN.length).fill(0.24),
        borderColor: '#94A3B8',
        borderDash: [4, 4],
        pointRadius: 0,
        borderWidth: 1.5,
        fill: false,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 11, family: 'Inter' }
        }
      },
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        type: 'linear' as const,
        title: { display: true, text: 'U-Wert [W/(m²K)]' },
        beginAtZero: true,
        max: 2.2
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Building2 className="text-shiraz" /> Altbau-Bestand &amp; energetische Sanierung
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
          <p>
            Wissenschaftliche U-Wert-Abschätzungen nach Baualtersklassen entsprechend den Basisdaten der Fachinfoplattform <strong>Altbau-Atlas</strong>.
            Analysieren Sie historische Baustoffgefüge von 1880 bis heute, simulieren Sie energetische Modernisierungsmaßnahmen nach den gesetzlichen Grenzwerten des <strong>Gebäudemodernisierungsgesetzes (GModG / GEG)</strong> und bilanzieren Sie Amortisationszeiten mit normgerechter deutscher Zahlenformatierung.
          </p>
        </div>

        {/* Tab Navigation following GEMINI_md */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <Calendar size={16} /> Baualtersklassen &amp; Epochen
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'sanierung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('sanierung')}
          >
            <Calculator size={16} /> Sanierungs-Simulator (GModG)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'vergleich' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('vergleich')}
          >
            <BarChart3 size={16} /> Epochen-Vergleich &amp; U-Werte
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'theorie' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('theorie')}
          >
            <BookOpen size={16} /> Konstruktive Typologie &amp; Feuchteschutz
          </button>
        </div>

        {/* Tab 1: Baualtersklassen */}
        {activeTab === 'steckbrief' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Era Buttons */}
              <div className="lg:col-span-4 flex flex-col gap-2.5">
                <h3 className="text-sm font-bold text-text-main flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-shiraz" />
                  Baualtersklasse auswählen
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {BAUALTERSKLASSEN.map((era) => (
                    <button
                      key={era.id}
                      onClick={() => setSelectedEra(era.id)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedEra === era.id
                          ? 'bg-shiraz text-white border-shiraz shadow-sm'
                          : 'bg-white hover:bg-off-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <div className="font-bold text-xs flex justify-between items-center">
                        <span>{era.vintage}</span>
                        {selectedEra === era.id && <ArrowRight className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`text-[11px] truncate mt-0.5 ${selectedEra === era.id ? 'text-white/80' : 'text-slate-500'}`}>
                        {era.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Era Detail Card */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="bg-off-white rounded-2xl border border-home-grau/30 p-6 flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-home-grau/20 pb-4">
                    <div>
                      <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">
                        Baualtersklasse {currentEraData.vintage}
                      </span>
                      <h3 className="text-lg font-bold text-text-main">
                        {currentEraData.label}
                      </h3>
                    </div>
                    <div className="px-3 py-1 bg-white border border-home-grau/30 rounded-lg text-xs font-semibold text-slate-700">
                      Standardwerte nach Altbau-Atlas
                    </div>
                  </div>

                  <p className="text-sm text-text-main/80 leading-relaxed">
                    {currentEraData.description}
                  </p>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-home-grau/20">
                      <span className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                        <Layers size={14} className="text-shiraz" /> Typische Konstruktionsmerkmale:
                      </span>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        {currentEraData.typicalConstruction}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-home-grau/20">
                      <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                        <Construction size={14} className="text-shiraz" /> Charakteristische Baustoffe &amp; Komponenten:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentEraData.characteristicMaterials.map((mat, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-xs font-medium">
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-home-grau/20">
                      <span className="text-xs font-bold text-slate-700 block mb-1">
                        Historische Verglasung &amp; Fenster:
                      </span>
                      <p className="text-xs text-text-main/80">
                        {currentEraData.windows}
                      </p>
                    </div>
                  </div>

                  {/* Thermal Metrics Grid */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                      Typische ungedämmte Bauteil-Kennwerte (U-Werte nach Altbau-Atlas)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 flex flex-col items-center text-center">
                        <span className="text-[11px] text-slate-500 font-medium mb-1">Außenwand</span>
                        <span className="text-base font-black text-shiraz font-mono">
                          {formatDeZahl(currentEraData.uValueWall, 2)}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">W/(m²K)</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 flex flex-col items-center text-center">
                        <span className="text-[11px] text-slate-500 font-medium mb-1">Dach</span>
                        <span className="text-base font-black text-slate-800 font-mono">
                          {formatDeZahl(currentEraData.uValueRoof, 2)}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">W/(m²K)</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 flex flex-col items-center text-center">
                        <span className="text-[11px] text-slate-500 font-medium mb-1">Kellerdecke</span>
                        <span className="text-base font-black text-blue-800 font-mono">
                          {formatDeZahl(currentEraData.uValueFloor, 2)}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">W/(m²K)</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 flex flex-col items-center text-center">
                        <span className="text-[11px] text-slate-500 font-medium mb-1">Fenster</span>
                        <span className="text-base font-black text-teal-700 font-mono">
                          {formatDeZahl(currentEraData.uValueWindow, 2)}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">W/(m²K)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sanierungskonfigurator */}
        {activeTab === 'sanierung' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Controls */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30 space-y-4">
                  <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-shiraz" />
                    Sanierungsparameter konfigurieren
                  </h3>

                  {/* Component selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Bauteil für die Sanierungsmaßnahme:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'wall' as const, label: 'Außenwand' },
                        { id: 'roof' as const, label: 'Steildach / oGD' },
                        { id: 'floor' as const, label: 'Kellerdecke' }
                      ].map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedComp(c.id)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            selectedComp === c.id
                              ? 'bg-shiraz text-white border-shiraz'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Slider
                    label="Bauteilfläche A [m²]"
                    value={area}
                    min={20}
                    max={500}
                    step={10}
                    unit=" m²"
                    onChange={(e) => setArea(parseFloat(e.target.value))}
                  />

                  <Slider
                    label="Zusätzliche Dämmstoffdicke d [mm]"
                    value={thickness}
                    min={40}
                    max={300}
                    step={10}
                    unit=" mm"
                    onChange={(e) => setThickness(parseFloat(e.target.value))}
                  />

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Wärmeleitfähigkeit λ_D [W/(mK)]:
                    </label>
                    <select
                      value={lambda}
                      onChange={(e) => setLambda(parseFloat(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-home-grau/30 bg-white"
                    >
                      <option value={0.022}>λ = 0,022 (PUR/PIR Hochleistungsdämmung / Resol)</option>
                      <option value={0.032}>λ = 0,032 (EPS WLG 032 / Mineralwolle 032)</option>
                      <option value={0.035}>λ = 0,035 (Standard Mineralwolle / EPS 035)</option>
                      <option value={0.040}>λ = 0,040 (Holzfaser / Zellulose / Hanf 040)</option>
                      <option value={0.045}>λ = 0,045 (Calciumsilikat-Innendämmung 045)</option>
                    </select>
                  </div>

                  <Slider
                    label="Spezifische Sanierungskosten [€/m²]"
                    value={insulationCostM2}
                    min={40}
                    max={300}
                    step={10}
                    unit=" €/m²"
                    onChange={(e) => setInsulationCostM2(parseFloat(e.target.value))}
                  />

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Bestehendes Heizsystem:
                    </label>
                    <select
                      value={heatingSource}
                      onChange={(e) => setHeatingSource(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-home-grau/30 bg-white"
                    >
                      {HEATING_SOURCES.map(h => (
                        <option key={h.id} value={h.id}>
                          {h.label} (~{formatDeZahl(h.costPerKwh * 100, 1)} ct/kWh, {formatDeZahl(h.co2Factor, 2)} kg CO₂/kWh)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Results */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div className="bg-white rounded-2xl border border-home-grau/30 p-6 shadow-sm flex flex-col gap-5">
                  <div className="flex justify-between items-center border-b border-home-grau/20 pb-3">
                    <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-shiraz" />
                      Energetische &amp; Ökonomische Sanierungsbilanz
                    </h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      sanierungResults.gegCompliant
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}>
                      {sanierungResults.gegCompliant ? '✓ GModG-konform (Anlage 7)' : `⚠ Grenzwert überschritten – ca. ${formatDeWert(sanierungResults.dReqMm)} mm mehr Dämmung`}
                    </span>
                  </div>

                  {/* U-Value Comparison */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                      <span className="text-[11px] text-slate-500 font-medium block">U-Wert Altbau</span>
                      <span className="text-base font-bold text-slate-900 font-mono">
                        {formatDeZahl(sanierungResults.originalU, 2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">W/(m²K)</span>
                    </div>

                    <div className="bg-rose-50/50 p-3.5 rounded-xl border border-shiraz/30 text-center">
                      <span className="text-[11px] text-shiraz font-medium block">U-Wert Saniert</span>
                      <span className="text-base font-black text-shiraz font-mono">
                        {formatDeZahl(sanierungResults.newU, 3)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">W/(m²K)</span>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                      <span className="text-[11px] text-slate-500 font-medium block">GModG Grenzwert</span>
                      <span className="text-base font-bold text-slate-700 font-mono">
                        {formatDeZahl(sanierungResults.gegLimit, 2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">W/(m²K)</span>
                    </div>
                  </div>

                  {/* Savings Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
                      <span className="text-[11px] text-slate-500 block">Wärmeeinsparung</span>
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {formatDeZahl(sanierungResults.annualEnergySavings, 0)} kWh/a
                      </span>
                    </div>

                    <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
                      <span className="text-[11px] text-slate-500 block">Kostenvorteil</span>
                      <span className="text-xs font-extrabold text-emerald-700 font-mono">
                        ~{formatDeZahl(sanierungResults.annualCostSavings, 0)} €/a
                      </span>
                    </div>

                    <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
                      <span className="text-[11px] text-slate-500 block">CO₂-Minderung</span>
                      <span className="text-xs font-bold text-emerald-800 font-mono">
                        {formatDeZahl(sanierungResults.annualCo2Savings, 0)} kg/a
                      </span>
                    </div>

                    <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
                      <span className="text-[11px] text-slate-500 block">Investitionsvolumen</span>
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {formatDeZahl(sanierungResults.totalInvestment, 0)} €
                      </span>
                    </div>
                  </div>

                  {/* Amortization banner */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Statische Amortisationszeit:</span>
                      <span className="text-[11px] text-slate-500">
                        Investition geteilt durch jährliche Energiekosteneinsparung
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-shiraz font-mono">
                      {sanierungResults.paybackYears > 60 
                        ? 'Keine Amortisation' 
                        : `${formatDeZahl(sanierungResults.paybackYears, 1)} Jahre`}
                    </span>
                  </div>

                  {/* Toggle Detailed Math */}
                  <button
                    onClick={() => setShowCalculations(!showCalculations)}
                    className="text-xs font-bold text-shiraz hover:underline flex items-center gap-1.5 self-start cursor-pointer"
                  >
                    <Info size={14} />
                    {showCalculations ? 'Rechenweg & Formeln ausblenden' : 'Ausführlichen Rechenweg (DIN EN ISO 6946) anzeigen'}
                  </button>

                  {showCalculations && (
                    <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3 text-xs text-slate-700 animate-in fade-in">
                      <span className="font-bold text-slate-900 block">
                        Schrittweise Herleitung des sanierungsbedingten Wärmedurchgangs:
                      </span>
                      
                      <p>
                        1. Wärmedurchgangswiderstand des ungedämmten Bestandsbauteils:
                      </p>
                      <BlockMath math={`R_{\\text{alt}} = \\frac{1}{U_{\\text{alt}}} = \\frac{1}{${formatDeZahl(sanierungResults.originalU, 2)}} \\approx ${formatDeZahl(1 / sanierungResults.originalU, 3)} \\text{ m}^2\\text{K/W}`} />

                      <p>
                        2. Zusätzlicher Wärmedurchlasswiderstand der Dämmschicht (Dicke d = {formatDeWert(thickness)} mm = {formatDeZahl(thickness / 1000, 3)} m):
                      </p>
                      <BlockMath math={`R_{\\text{Dämm}} = \\frac{d}{\\lambda_D} = \\frac{${formatDeZahl(thickness / 1000, 3)}}{${formatDeZahl(lambda, 3)}} \\approx ${formatDeZahl((thickness / 1000) / lambda, 3)} \\text{ m}^2\\text{K/W}`} />

                      <p>
                        3. Gesamtwiderstand und neuer Wärmedurchgangskoeffizient:
                      </p>
                      <BlockMath math={`U_{\\text{neu}} = \\frac{1}{R_{\\text{alt}} + R_{\\text{Dämm}}} = \\frac{1}{${formatDeZahl(1 / sanierungResults.originalU, 3)} + ${formatDeZahl((thickness / 1000) / lambda, 3)}} \\approx ${formatDeZahl(sanierungResults.newU, 3)} \\text{ W/(m}^2\\text{K)}`} />

                      <p>
                        4. Jährliche Heizwärmeeinsparung mit Gradtagzahl G_t20/15 = 3 500 Kd/a und Temperatur-Korrekturfaktor F_x (DIN V 4108-6):
                      </p>
                      <BlockMath math={`\\Delta Q = \\Delta U \\cdot A \\cdot F_x \\cdot G_t \\cdot 0{,}024 = (${formatDeZahl(sanierungResults.originalU, 2)} - ${formatDeZahl(sanierungResults.newU, 3)}) \\cdot ${area} \\cdot ${formatDeZahl(sanierungResults.fx, 1)} \\cdot 3500 \\cdot 0{,}024 \\approx ${formatDeZahl(sanierungResults.annualEnergySavings, 0)} \\text{ kWh/a}`} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Epochen-Vergleich */}
        {activeTab === 'vergleich' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-shiraz" />
                Historischer Trend der Bauteil-U-Werte von 1880 bis heute
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Entwicklung des thermischen Standards über 10 Baualtersklassen im Vergleich zu den heutigen Sanierungsanforderungen des GModG / GEG.
              </p>

              <div className="h-80 w-full">
                <Line data={chartData} options={chartOptions} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">
                    Bauphysikalische Epochensprünge:
                  </span>
                  Bis in die 1970er Jahre lagen die U-Werte von Außenwänden meist über 1,1 W/(m²K). WDVS gibt es seit den 1960er Jahren; die Wärmeschutzverordnung 1977 brachte erstmals verbindliche Wärmeschutzanforderungen. Das GModG verlangt heute bei Sanierungen Höchstwerte von 0,24 W/(m²K) für Außenwände und Steildächer/oberste Geschossdecken sowie 0,20 W/(m²K) für Flachdächer.
                </div>

                <div className="bg-rose-50/40 p-4 rounded-xl border border-shiraz/20 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-shiraz block mb-1">
                    Grenzwerte nach Gebäudemodernisierungsgesetz (GModG, vormals GEG):
                  </span>
                  Nach § 36 GModG (vormals § 48 GEG / Anlage 7) dürfen bei Änderungen an Außenbauteilen bestehender Gebäude die Höchstwerte des Wärmedurchgangskoeffizienten nicht überschritten werden, sofern mehr als 10 % der jeweiligen Bauteilfläche saniert oder erneuert werden (Bagatellgrenze). Außenwände und Steildächer/oberste Geschossdecken müssen höchstens 0,24 W/(m²K), Flachdächer 0,20 W/(m²K), Kellerdecken 0,30 W/(m²K) und Fenster U_w = 1,30 W/(m²K) einhalten (Anlage 7 GModG).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Konstruktive Typologie & Feuchteschutz */}
        {activeTab === 'theorie' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <AlertTriangle className="text-amber-600" size={18} />
                  Schadenspotenziale im Altbaubestand
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                  <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong>Holzbalkenköpfe in Außenwänden:</strong> Durch nachträgliche Innendämmung kühlt das Mauerwerk im Winter stärker aus. Die Verdunstungskapazität sinkt, was bei unzureichendem Schlagregenschutz zu Pilzbefall und Fäulnis der Balkenauflager führen kann.
                  </li>
                  <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong>Preußische Kappendecken:</strong> Korrosion der freiliegenden I-Träger-Unterflansche durch aufsteigende Feuchte in Altbaukellern oder hygroskopische Salze.
                  </li>
                  <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong>Schadstoffe der Nachkriegsepochen:</strong> Asbestzement (etwa 1930–1993, Verbot 1993), teerhaltige Kleber und Bitumenpappen (PAK), sowie künstliche Mineralfasern (alte KMF: vor 1996 hergestellt, Einbau bis 06/2000 möglich).
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <ShieldCheck className="text-emerald-700" size={18} />
                  Innendämmung nach WTA-Merkblatt 6-5
                </h3>
                <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
                  <p>
                    Bei denkmalgeschützten Fassaden ist eine Außendämmung meist unzulässig. Die Sanierung muss raumseitig erfolgen. Hierbei unterscheidet man zwei wesentliche bauphysikalische Systeme:
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block">1. Kapillaraktive, diffusionsoffene Systeme (z. B. Calciumsilikat, Holzfaser):</span>
                    <span>Anfallendes Kondensat wird durch kapillare Saugspannung aufgenommen und im Sommer schadlos in den Raum zurückverdunstet. Funktioniert ohne feuchteblockierende Dampfsperren.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block">2. Diffusionsdichte Systeme mit Dampfbremse:</span>
                    <span>Erfordern absolute Luftdichtheit der raumseitigen Membran. Kleinste Fehlstellen führen durch Konvektion zu massivem Schimmelschaden.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ModuleFooter following GEMINI_md */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Innendämmung einer Gründerzeitwand mit Calciumsilikat"
        zielGleichung="U_{neu} = \frac{1}{1/U_{alt} + d/\lambda}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Vollziegelwand U_alt = 1,50 W/(m²K); 6 cm Calciumsilikatplatte (λ = 0,060 W/(mK)), kapillaraktiv.', formel: 'R_{D} = \\frac{0{,}06}{0{,}060} = 1{,}00\\,\\text{m}^2\\text{K/W}' },
          { titel: 'Neuer U-Wert', erklaerung: 'Gesamtwiderstand alt plus Dämmschicht:', formel: 'U_{neu} = \\frac{1}{0{,}667 + 1{,}00} = 0{,}60\\,\\text{W/(m}^2\\text{K)}' },
          { titel: 'Oberflächentemperatur', erklaerung: 'θ_i = 20 °C, θ_e = −5 °C, R_si = 0,13:', formel: '\\theta_{si,alt} = 20 - 0{,}13 \\cdot 1{,}50 \\cdot 25 = 15{,}1\\,^\\circ\\text{C}, \\quad \\theta_{si,neu} = 20 - 0{,}13 \\cdot 0{,}60 \\cdot 25 = 18{,}1\\,^\\circ\\text{C}' }
        ]}
        ergebnisHinweis="Moderate Innendämmung verbessert Behaglichkeit und Schimmelschutz deutlich; die Grenzschicht wird aber kälter. Feuchtenachweis nach WTA-Merkblatt 6-5 bzw. DIN 4108-3 und Schlagregenschutz der Fassade sind Voraussetzung."
        normQuelle="DIN EN ISO 6946:2018-03; WTA-Merkblätter 6-4/6-5"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Transmissionswärmeverlust vor und nach der Innendämmung"
        zielGleichung="\Delta Q = \Delta U \cdot A \cdot HGT \cdot 24 / 1000"
        schritte={[
          { titel: 'Gegeben', erklaerung: '100 m² Außenwand, Heizgradtage 3 500 Kd/a:', formel: '\\Delta U = 1{,}50 - 0{,}60 = 0{,}90\\,\\text{W/(m}^2\\text{K)}' },
          { titel: 'Einsparung Nutzwärme', erklaerung: 'Umrechnung von Kd in kWh:', formel: '\\Delta Q = 0{,}90 \\cdot 100 \\cdot 3\\,500 \\cdot 24 / 1\\,000 = 7\\,560\\,\\text{kWh/a}' },
          { titel: 'Einordnung', erklaerung: 'Bei Gas (≈ 0,24 kg CO₂-Äq./kWh) entspricht das rund 1,8 t CO₂-Äq. pro Jahr.', formel: '7\\,560 \\cdot 0{,}24 = 1\\,814\\,\\text{kg CO}_2\\text{-Äq./a}' }
        ]}
        ergebnisHinweis="Wärmebrücken an einbindenden Innenwänden und Decken mindern die Einsparung; bei Holzbalkendecken ist die Balkenkopfzone besonders zu prüfen."
        normQuelle="VDI 2067 / VDI 4710 (Gradtagzahlverfahren)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bestand" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 8 Bestand: GModG-Bestandsanforderungen, Normausgaben und Literatur geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: "Altbau", url: "https://de.wikipedia.org/wiki/Altbau" },
          { title: "Wärmedurchgangskoeffizient", url: "https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient" },
          { title: "Innendämmung nach WTA", url: "https://de.wikipedia.org/wiki/Innend%C3%A4mmung" }
        ]}
        literatur={[
          "BMWi/BMI (2020): Bekanntmachung der Regeln zur Datenaufnahme und Datenverwendung im Wohngebäudebestand (pauschale U-Werte nach Baualtersklassen).",
          "Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011",
          "Klopfer, H.: Wassertransport durch Diffusion in Feststoffen. Wiesbaden: Bauverlag 1974"
        ]}
        regelwerke={[
          { title: "Gebäudemodernisierungsgesetz (GModG, vormals GEG) – §§ 35–37 und Anlage 7 (bestehende Gebäude)", url: "https://www.gesetze-im-internet.de/geg/" },
          { title: "DIN 4108-3:2024-03 (Klimabedingter Feuchteschutz; ersetzt 2018-10)", url: "https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+4108-3" },
          { title: "DIN EN ISO 6946:2018-03 (Bauteile - Wärmedurchlasswiderstand und Wärmedurchgangskoeffizient)", url: "https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+ISO+6946" },
          { title: "WTA-Merkblatt 6-4: Innendämmung nach WTA I – Planungsleitfaden (Ausgabe manuell prüfen)", url: "https://www.wta-gmbh.de" },
          { title: "WTA-Merkblatt 6-5: Innendämmung nach WTA II – Nachweis von Innendämmsystemen mittels numerischer Berechnungsverfahren (Ausgabe manuell prüfen)", url: "https://www.wta-gmbh.de" }
        ]}
        formeln={[
          {
            formel: "R_{\\text{Dämm}} = \\frac{d_{\\text{Dämm}}}{\\lambda_{\\text{Dämm}}} \\quad [\\text{m}^2\\text{K/W}]",
            erklaerung: "Wärmedurchlasswiderstand einer Dämmschicht mit Schichtdicke d und Bemessungswert der Wärmeleitfähigkeit lambda.",
            quelle: "DIN EN ISO 6946"
          },
          {
            formel: "U_{\\text{neu}} = \\frac{1}{\\frac{1}{U_{\\text{alt}}} + R_{\\text{Dämm}}} \\quad [\\text{W/(m}^2\\text{K)}]",
            erklaerung: "Berechnung des reduzierten Wärmedurchgangskoeffizienten nach Aufbringung einer zusätzlichen Dämmschicht auf ein Bestandsbauteil.",
            quelle: "DIN EN ISO 6946"
          },
          {
            formel: "\\Delta Q = \\Delta U \\cdot A \\cdot HGT \\cdot 24 \\div 1000 \\quad [\\text{kWh/a}]",
            erklaerung: "Berechnung der jährlichen Transmissionswärmeverlust-Reduktion basierend auf der U-Wert-Differenz und Heizgradtagen.",
            quelle: "VDI 2067"
          }
        ]}
        weblinks={[
          { title: 'Bundesarbeitskreis Altbauerneuerung e.V. (BAKA)', url: 'https://www.bakaberlin.de' }
        ]}
      />
    </div>
  );
}
