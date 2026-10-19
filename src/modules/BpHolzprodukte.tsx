import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Layers, Calculator, Info, Trees, HelpCircle, ArrowRight, CheckCircle2, AlertTriangle, Play, RefreshCw, Star, Info as FactIcon, BookOpen, ShieldAlert } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { InnovationPraxisSection } from '@/src/components/ui/InnovationPraxisSection';

interface WoodProductType {
  id: string;
  name: string;
  short: string;
  density: number; // kg/m³
  eModulus: number; // N/mm² (mean)
  f_mk: number; // Char. bending strength, N/mm²
  f_vk: number; // Char. shear strength, N/mm²
  advantages: string[];
  disadvantages: string[];
  usecases: string[];
  dimensions: string;
}

const woodProducts: WoodProductType[] = [
  {
    id: 'kvh',
    name: 'Konstruktionsvollholz (KVH)',
    short: 'KVH C24',
    density: 420,
    eModulus: 11000,
    f_mk: 24,
    f_vk: 4.0,
    advantages: [
      'Geringe Holzfeuchte (15% ± 3%), dadurch formstabil & rissminimiert',
      'In großen Längen durch Keilzinkung lieferbar (bis zu 16m)',
      'Insekten- und pilzresistent durch technische Trocknung (kein chemischer Schutz nötig)',
      'Definierte Oberflächenqualitäten (NSi für nicht-sichtbar, Si für sichtbar)'
    ],
    disadvantages: [
      'Begrenzte Bauteildicken (meist max. 14 cm)',
      'Geringere Tragfähigkeit im Vergleich zu BSH',
      'Keilzinkungsstellen im Sichtbereich sichtbar'
    ],
    usecases: [
      'Holzrahmenbau / Holztafelbau',
      'Dachstühle & Sparrenkonstruktionen',
      'Unterkonstruktionen im Innenausbau',
      'Garten- und Carportbau'
    ],
    dimensions: 'Breiten 40-140 mm, Höhen 60-240 mm, Längen bis 16m'
  },
  {
    id: 'bsh',
    name: 'Brettschichtholz (BSH / Leimbinder)',
    short: 'BSH GL24h',
    density: 450,
    eModulus: 11500,
    f_mk: 24,
    f_vk: 3.5,
    advantages: [
      'Enorm hohe Tragfähigkeit bei kompakteren Abmessungen',
      'Sehr formstabil und rissminimiert durch Schicht-Verklebung',
      'Große Spannweiten für Hallenbau (Träger bis >30m)',
      'Sehr hohe Feuerwiderstandsdauer (berechenbarer Abbrand)',
      'Hervorragend gestaltbar (auch gebogene oder gekrümmte Formen)'
    ],
    disadvantages: [
      'Spürbar teurer als KVH',
      'Ausschließlich mit zugelassenen Klebstoffen leimbar (Harnstoff-/MUF-/PU-Leime)'
    ],
    usecases: [
      'Weitgespannte Hallentragwerke und Deckenunterzüge',
      'Hochbelastete Stützen und Hauptträger',
      'Ingenieurholzbau & Skelettbauten',
      'Brückenbau (mit witterungsschützenden Bekleidungen)'
    ],
    dimensions: 'Breiten 80-280 mm, Höhen 120-2000 mm, Längen bis 30m+'
  },
  {
    id: 'clt',
    name: 'Brettsperrholz (BSP / CLT)',
    short: 'CLT - Cross Laminated Timber',
    density: 480,
    eModulus: 11000,
    f_mk: 21, // typisch für Lamellen
    f_vk: 2.5,
    advantages: [
      'Flächige Lastabtragung (Schnittgrößen in zwei Richtungen)',
      'Extrem hohe Dimensionsstabilität durch kreuzweise Verlegung',
      'Hoher Vorfertigungsgrad (CNC-Abbund von Fensterausschnitten im Werk)',
      'Sofort tragfähig, trockene Bauweise (keine Einbaufeuchte)'
    ],
    disadvantages: [
      'Hohes Eigengewicht (erfordert Mobilkräne auf Baustelle)',
      'Wandstärken nehmen viel Grundfläche ein bei mehrgeschossigen Bauten',
      'Aufwendige Schallschutz-Detailpunkte an Plattenstößen'
    ],
    usecases: [
      'Massivholz-Wände und Massivholz-Decken',
      'Mehrgeschossiger Holzwohnbau (Gebäudeklasse 1 bis 5)',
      'Kragarme und aussteifende Deckenscheiben',
      'Aufstockungen im urbanen Raum (geringeres Gewicht als Beton)'
    ],
    dimensions: 'Plattenbreiten bis 3.5 m, Längen bis 16 m, Stärken 60-350 mm'
  },
  {
    id: 'lvl',
    name: 'Furnierschichtholz (FSH / LVL)',
    short: 'LVL (eg. Kerto)',
    density: 500,
    eModulus: 13800,
    f_mk: 48, // sehr hoch durch Furniere
    f_vk: 4.6,
    advantages: [
      'Äußerst homogenes Gefüge (Äste und Fehlstellen sind verteilt)',
      'Höchste mechanische Tragfähigkeiten aller Holzwerkstoffe',
      'Sehr dünne, schlanke Querschnitte möglich',
      'Hohe Plattenstabilität bei Scheibenbeanspruchung'
    ],
    disadvantages: [
      'Verlegeaufwand an Kanten (Kopplung)',
      'Hoher Klebstoffanteil',
      'Aufwendigerer Zuschnitt (harte Leimfugen)'
    ],
    usecases: [
      'Hochbelastete Unterzüge und Verstärkungen',
      'Sparren und Pfetten bei extremen Spannweiten',
      'Schalungsplatten und Gerüstbohlen',
      'Gurtmaterial für I-Beams (Stegträger)'
    ],
    dimensions: 'Dicken 21-75 mm, Breiten bis 1.8 m, Längen bis 20m+'
  }
];

function WoodThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Holz im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den drei Säulen der Holz-Baustofflehre:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('holz')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Baustoff-Kennwerte</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Anisotropes Quellen/Schwinden (3D-Modell), Holzfestigkeiten (EC5) & Kennwerte.
          </span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_holzprodukte')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Holzprodukte & Praxis</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Konstruktionsvollholz, CLT, Vor- und Nachteile & Vorbemessungsrechner.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={() => setActiveTab('holzkorrosion')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Dauerhaftigkeit</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Holzzerstörende Pilze/Insekten, Witterung & baulicher Holzschutz nach DIN 68800.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function BpHolzprodukte() {
  const [selectedWood, setSelectedWood] = useState<WoodProductType>(woodProducts[0]);
  
  // Calculator States
  const [span, setSpan] = useState<number>(4.5); // L in m
  const [spacing, setSpacing] = useState<number>(0.625); // s in m (Standard-Sparren/Balkenraster)
  const [loadk, setLoadk] = useState<number>(2.5); // q_k (Verkehrslast + Ausbau) in kN/m²
  const [beamWidth, setBeamWidth] = useState<number>(100); // b in mm
  const [beamHeight, setBeamHeight] = useState<number>(200); // h in mm
  const [woodClass, setWoodClass] = useState<string>('c24'); // strength class selection

  // Material properties for calculations based on selected class
  const getCalcProperties = (cls: string) => {
    switch (cls) {
      case 'c24':
        return { name: 'KVH C24', f_mk: 24, f_vk: 4.0, E: 11000, density: 420, gammaM: 1.3 };
      case 'gl24h':
        return { name: 'BSH GL24h', f_mk: 24, f_vk: 3.5, E: 11500, density: 450, gammaM: 1.25 };
      case 'gl28h':
        return { name: 'BSH GL28h', f_mk: 28, f_vk: 3.5, E: 12600, density: 450, gammaM: 1.25 };
      case 'gl30h':
        return { name: 'BSH GL30h', f_mk: 30, f_vk: 3.5, E: 13600, density: 480, gammaM: 1.25 };
      default:
        return { name: 'KVH C24', f_mk: 24, f_vk: 4.0, E: 11000, density: 420, gammaM: 1.3 };
    }
  };

  const activeMat = getCalcProperties(woodClass);
  const k_mod = 0.8; // Medium-term (Standard Nutzungsklasse 1)

  // Calculations:
  // 1. Self-weight of timber beam: g_wood_k = (b * h / 10^6) * (density * 9.81 / 1000) kN/m
  const selfWeightKN_m = (beamWidth * beamHeight / 1000000) * (activeMat.density * 0.00981);
  
  // Line loads (kN/m)
  const g_k = selfWeightKN_m; // kN/m (Balkeneigengewicht)
  const q_k = loadk * spacing; // kN/m (Ausbau- und Nutzlasten)
  
  // Design line load: q_d = 1.35 * g_k + 1.5 * q_k
  const q_d = 1.35 * g_k + 1.5 * q_k;
  const q_inst = g_k + q_k; // SLS quasi-permanent characteristic combination
  
  // Bending moment: M_Ed = q_d * L^2 / 8
  const m_ed = (q_d * Math.pow(span, 2)) / 8; // kNm
  
  // Shear force: V_Ed = q_d * L / 2
  const v_ed = (q_d * span) / 2; // kN

  // Section properties
  const w_y = (beamWidth * Math.pow(beamHeight, 2)) / 6; // mm³
  const i_y = (beamWidth * Math.pow(beamHeight, 3)) / 12; // mm⁴

  // Bending stress: sigma_m_d = M_Ed * 10^6 / W_y (N/mm²)
  const sigma_md = (m_ed * 1000000) / w_y;
  // Bending strength design: f_md = k_mod * f_mk / gammaM
  const f_md = (k_mod * activeMat.f_mk) / activeMat.gammaM;
  const bendingUtilization = (sigma_md / f_md) * 100;

  // Shear stress: tau_d = 1.5 * V_Ed * 10^3 / (b * h)
  const tau_d = (1.5 * v_ed * 1000) / (beamWidth * beamHeight);
  // Shear strength design: f_vd = k_mod * f_vk / gammaM
  const f_vd = (k_mod * activeMat.f_vk) / activeMat.gammaM;
  const shearUtilization = (tau_d / f_vd) * 100;

  // Elastic Deflection comfort check: w = (5/384) * (q_inst * L^4) / (E * I)
  // q_inst is in kN/m which equals N/mm, L is converted to mm, E in N/mm², I in mm⁴
  const span_mm = span * 1000;
  const w_inst = (5 * q_inst * Math.pow(span_mm, 4)) / (384 * activeMat.E * i_y);
  
  // SLS boundary: w_limit = L / 300 (standard structural requirement)
  const w_limit = span_mm / 300;
  const deflectionUtilization = (w_inst / w_limit) * 100;

  // Max of utilizations
  const maxUtilization = Math.max(bendingUtilization, shearUtilization, deflectionUtilization);
  const isSafe = maxUtilization <= 100;

  return (
    <div id="bp-holzprodukte-module" className="flex flex-col gap-8">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
            <Trees className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              Holzprodukte im konstruktiven Holzbau
            </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Technische Kenngrößen, bauaufsichtliche Verlässlichkeit und vereinfachte Vordimensionierung nach Eurocode 5 (DIN EN 1995-1-1)
          </p>
        </div>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed font-normal">
          Holzwerkstoffe haben sich von rein handwerklichen Balkenhölzern zu hochentwickelten, industriellen Verbundbaustoffen gewandelt. Sie weisen durch gezielte Homogenisierung, Trocknung und schichtweise Verklebung weit kalkulierbarere mechanische Gütestufen und geringere Schwind- und Quellverformungen auf als klassisches Bauholz.
        </p>
      </div>

      {/* Main Material Database & Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left selector */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-text-main/50 uppercase tracking-wider block">Verfügbare Holzwerkstoff-Klassen:</span>
          <div className="flex flex-col gap-2.5">
            {woodProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedWood(p)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${
                  selectedWood.id === p.id
                    ? 'bg-shiraz text-white border-shiraz shadow-md scale-[1.02]'
                    : 'bg-white text-text-main hover:bg-slate-50 border-home-grau/30 shadow-sm'
                }`}
              >
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block ${selectedWood.id === p.id ? 'text-white/60' : 'text-text-main/40'}`}>
                    {p.short}
                  </span>
                  <span className="font-extrabold text-sm">{p.name}</span>
                </div>
                <ArrowRight size={16} className={`opacity-70 ${selectedWood.id === p.id ? 'translate-x-1' : ''} transition-transform`} />
              </button>
            ))}
          </div>

          <div className="bg-off-white/40 p-4 border border-home-grau/30 rounded-xl space-y-2 mt-4 text-xs text-slate-800 leading-relaxed">
            <div className="flex gap-1.5 items-center font-bold">
              <Info size={14} className="text-shiraz" />
              <span>Nutzungsklassen (NKL) nach EC 5</span>
            </div>
            <p className="font-normal text-[11px] text-slate-900/80">
              • <strong>NKL 1:</strong> Holzfeuchte entspricht max 12% (z.B. allseitig geschlossene beheizte Räume).<br />
              • <strong>NKL 2:</strong> Holzfeuchte entspricht max 20% (z.B. überdachte offene Bauwerke, Carports).<br />
              • <strong>NKL 3:</strong> Größere Feuchten (z.B. freie Bewitterung unter freiem Himmel). Hier sind Abminderungsfaktoren (k_mod) stark verschärft.
            </p>
          </div>
        </div>

        {/* Right product sheet */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
          <div className="border-b border-home-grau/15 pb-4 flex justify-between items-start flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">TECHNISCHES DATENBLATT</span>
              <h3 className="text-xl font-bold text-text-main mt-0.5">{selectedWood.name}</h3>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-home-grau/10 text-right">
              <span className="text-[10px] text-text-main/40 block leading-tight">Typisches Biege-f_m,k</span>
              <span className="text-sm font-bold text-slate-800 font-mono">{selectedWood.f_mk} N/mm²</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50/70 p-3 rounded-xl border border-home-grau/30 text-center">
              <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">Dichte (ρ_k)</span>
              <span className="text-base font-bold font-mono text-slate-800">~{selectedWood.density} kg/m³</span>
            </div>
            <div className="bg-slate-50/70 p-3 rounded-xl border border-home-grau/30 text-center">
              <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">E-Modul (E_mean)</span>
              <span className="text-base font-bold font-mono text-slate-800">{selectedWood.eModulus.toLocaleString()} MPa</span>
            </div>
            <div className="bg-slate-50/70 p-3 rounded-xl border border-home-grau/30 text-center">
              <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">Schub-f_v,k</span>
              <span className="text-base font-bold font-mono text-slate-800">{selectedWood.f_vk.toFixed(1)} N/mm²</span>
            </div>
            <div className="bg-slate-50/70 p-3 rounded-xl border border-home-grau/30 text-center">
              <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">Liefermaße</span>
              <span className="text-xs font-semibold text-slate-705 leading-snug line-clamp-2 block mt-1">
                {selectedWood.dimensions}
              </span>
            </div>
          </div>

          {/* Advantages & Disadvantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-home-grau/10">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase block tracking-wider">Vorteile & Stärken:</span>
              <ul className="space-y-1.5">
                {selectedWood.advantages.map((adv, i) => (
                  <li key={i} className="text-xs text-text-main/80 flex gap-2 items-start font-normal">
                    <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-red-800 uppercase block tracking-wider">Einschränkungen & Risiken:</span>
              <ul className="space-y-1.5">
                {selectedWood.disadvantages.map((dis, i) => (
                  <li key={i} className="text-xs text-text-main/80 flex gap-2 items-start font-normal">
                    <AlertTriangle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Practical Applications */}
          <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/10 mt-4 space-y-2">
            <span className="text-xs font-bold text-text-main/60 uppercase block">Häufige Anwendungsbereiche (Baupraxis):</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-800">
              {selectedWood.usecases.map((uc, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white p-2 border border-home-grau/30 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                  <span>{uc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* timber beam deflection calculator */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-home-grau/15 pb-4">
          <Calculator className="text-shiraz" />
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              EC 5 Holzbalken-Pre-Dimensionierung
            </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Einfache Abschätzung für Einfeldträger unter Gleichlast (ULS & SLS Nachweis der Durchbiegung/Spannung)
          </p>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input column 1 */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-text-main/60 uppercase block tracking-wider">Träger-Geometrie</span>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main">Spannweite L:</label>
                <span className="text-shiraz font-mono">{span.toFixed(2)} m</span>
              </div>
              <input 
                type="range" 
                min="2.0" 
                max="10.0" 
                step="0.1" 
                value={span} 
                onChange={(e) => setSpan(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main">Achsabstand der Balken s:</label>
                <span className="text-shiraz font-mono">{(spacing * 100).toFixed(1)} cm</span>
              </div>
              <input 
                type="range" 
                min="0.300" 
                max="1.250" 
                step="0.025" 
                value={spacing} 
                onChange={(e) => setSpacing(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main">Einfluss-Flächenlast q_k:</label>
                <span className="text-shiraz font-mono">{loadk.toFixed(1)} kN/m²</span>
              </div>
              <input 
                type="range" 
                min="1.0" 
                max="8.0" 
                step="0.1" 
                value={loadk} 
                onChange={(e) => setLoadk(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <span className="text-[10px] text-text-main/40 block leading-tight">Inkl. verkehrliche Nutzlasten &amp; raumbildende Fußbodenaufbauten.</span>
            </div>
          </div>

          {/* Input column 2 */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-text-main/60 uppercase block tracking-wider">Querschnitt & Holzgüte</span>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-main">Verwendete Holzgüte:</label>
              <select
                value={woodClass}
                onChange={(e) => setWoodClass(e.target.value)}
                className="w-full text-xs p-2 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
              >
                <option value="c24">KVH / Vollholz C24 (Standard)</option>
                <option value="gl24h">Brettschichtholz BSH GL24h (Standard-Zweck)</option>
                <option value="gl28h">Brettschichtholz BSH GL28h (Erhöhte Festigkeit)</option>
                <option value="gl30h">Brettschichtholz BSH GL30h (Premium-Leimbinder)</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main">Balkenbreite b:</label>
                <span className="text-shiraz font-mono">{beamWidth} mm</span>
              </div>
              <input 
                type="range" 
                min="60" 
                max="240" 
                step="20" 
                value={beamWidth} 
                onChange={(e) => setBeamWidth(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main">Balkenhöhe h:</label>
                <span className="text-shiraz font-mono">{beamHeight} mm</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="440" 
                step="20" 
                value={beamHeight} 
                onChange={(e) => setBeamHeight(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>
          </div>

          {/* Results column 3 */}
          <div className="flex flex-col justify-between bg-slate-50 p-4 rounded-2xl border border-home-grau/30">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-home-grau/10">
                <span className="text-xs font-bold text-text-main/50 uppercase">Statusergebnis:</span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  isSafe ? 'bg-emerald-150 text-emerald-800 border border-emerald-300' : 'bg-red-150 text-red-800 border border-red-300'
                }`}>
                  {isSafe ? 'Tragfähig (OK)' : 'Überlastet (Nicht OK)'}
                </span>
              </div>

              {/* Util percentages */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="font-sans font-semibold text-text-main/80">1. Biegespannung (ULS):</span>
                    <span className={`font-bold ${bendingUtilization > 100 ? 'text-red-700' : 'text-slate-700'}`}>
                      {bendingUtilization.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${bendingUtilization > 100 ? 'bg-red-600' : 'bg-shiraz'}`}
                      style={{ width: `${Math.min(100, bendingUtilization)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-text-main/50 block font-sans mt-0.5">
                    σ_md = {sigma_md.toFixed(2)} N/mm² vs. f_md = {f_md.toFixed(2)} N/mm²
                  </span>
                </div>

                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="font-sans font-semibold text-text-main/80">2. Schubspannung (ULS):</span>
                    <span className={`font-bold ${shearUtilization > 100 ? 'text-red-700' : 'text-slate-700'}`}>
                      {shearUtilization.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${shearUtilization > 100 ? 'bg-red-600' : 'bg-shiraz'}`}
                      style={{ width: `${Math.min(100, shearUtilization)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-text-main/50 block font-sans mt-0.5">
                    τ_d = {tau_d.toFixed(2)} N/mm² vs. f_vd = {f_vd.toFixed(2)} N/mm²
                  </span>
                </div>

                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="font-sans font-semibold text-text-main/80">3. Durchbiegung (SLS comfort):</span>
                    <span className={`font-bold ${deflectionUtilization > 100 ? 'text-red-700' : 'text-slate-700'}`}>
                      {deflectionUtilization.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${deflectionUtilization > 100 ? 'bg-red-600' : 'bg-sky-600'}`}
                      style={{ width: `${Math.min(100, deflectionUtilization)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-text-main/50 block font-sans mt-0.5">
                    w_inst = {w_inst.toFixed(1)} mm vs. Max (L/300) = {w_limit.toFixed(1)} mm
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-home-grau/10 text-[10px] space-y-1 text-text-main/60 font-sans leading-relaxed">
              <div>• Eigengewicht: <strong>{(selfWeightKN_m * 100).toFixed(0)} kg/m</strong> (~{activeMat.density} kg/m³ density)</div>
              <div>• Teilsicherheitsbeiwerte: γ_G = 1.35, γ_Q = 1.50</div>
              <div>• k_mod Beiwert = 0.8 / Material-γ_M = {activeMat.gammaM}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Industrial Wood Suppliers Table */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm mt-2 bg-slate-50/50">
        <h3 className="font-bold text-home-prim text-lg mb-2 flex items-center gap-2">
          <Star className="text-shiraz" size={18} /> Produktgruppen &amp; Systemtechniken des Holzbaus (Herstellerneutral)
        </h3>
        <p className="text-xs text-text-main/60 mb-4 italic">
          Hinweis zur Herstellerneutralität: Zur Wahrung vollständiger Produkt- und herstellerneutralität im Rahmen der akademischen Lehre und VOB-gerechten Ausschreibung werden nachfolgend standardisierte Systemklassen deklariert.
        </p>
        <p className="text-xs text-text-main/70 mb-4 font-normal">
          Holzbauprodukte erfordern eine CE-Konformitätskennzeichnung bzw. eine ETA (European Technical Assessment) und werden nach harmonisierten europäischen Standards klassifiziert:
        </p>
        <div className="overflow-x-auto rounded-xl border border-home-grau/15 bg-white">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-home-grau/15 text-text-main/80 font-bold font-sans">
                <th className="p-3">Systemwerkstoff / Produktgruppe</th>
                <th className="p-3">Kernkompetenzen &amp; Anwendungsbereiche</th>
                <th className="p-3">Zertifikate, Normen &amp; Holzarten</th>
                <th className="p-3">Rolle im modernen Ingenieurholzbau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-text-main/80">
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800">Brettsperrholz (CLT / BSP)</td>
                <td className="p-3">Flächige Tragelemente aus kreuzweise verklebten Nadelholzbrettern für Decken, Wände und Dachscheiben.</td>
                <td className="p-3 font-mono">PEFC, FSC, DIN EN 16351 (ETA-Zulassungen, meist Fichte / Kiefer)</td>
                <td className="p-3">Hochbelastbarer Massivholzbau für mehrgeschossige urbane Wohn- und Zweckgebäude.</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800">Holzwerkstoffplatten (OSB, Spanplatten, MDF)</td>
                <td className="p-3">Ausgerichtete Flachpressplatten und Spanplatten für aussteifende Wandbeplankungen, Schalungen und Baubretter.</td>
                <td className="p-3 font-mono">FSC, CE nach DIN EN 13986 / EN 300 (Güteüberwachung)</td>
                <td className="p-3">Standard-Plattenwerkstoffe für den trockenen Innenausbau und konstruktive Scheibenwirkung bei Ständerwerken.</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800">Ökologische Holzfaser-Dämmsysteme</td>
                <td className="p-3">Flexible und druckfeste Dämmplatten aus verfilzten Holzfasern (Nass- oder Trockenverfahren), Putzträgerplatten.</td>
                <td className="p-3 font-mono">FSC, DIN EN 13171, ETA-Zulassungen für WDVS</td>
                <td className="p-3">Hervorragender sommerlicher Hitzeschutz, Diffusionsoffenheit und gesunder Feuchtigkeitshaushalt im Holzrahmenbau.</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800">Brettschichtholz (BSH) &amp; Stegträger</td>
                <td className="p-3">Faserparallel verklebte Holzlamellen für Träger mit großen Spannweiten, schlanke I-Träger (Stegträger) mit Furnierschichtgurt.</td>
                <td className="p-3 font-mono">PEFC, DIN EN 14080 (ETA-Zulassungen für Sonderformen)</td>
                <td className="p-3">Ingenieurholzbaulösungen für weitgespannte Skeletttragwerke, Hallenbauten und hochgedämmte Dachsparrenstücke.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <InnovationPraxisSection moduleKey="bp_holzprodukte" />

      <WoodThematicLinks current="bauprodukt" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Konstruktionsvollholz', url: 'https://de.wikipedia.org/wiki/Konstruktionsvollholz' },
          { title: 'Brettschichtholz', url: 'https://de.wikipedia.org/wiki/Brettschichtholz' },
          { title: 'Brettsperrholz', url: 'https://de.wikipedia.org/wiki/Brettsperrholz' }
        ]} 
        literatur={[ 
          'Götz, K.-H. et al.: Holzbau Atlas.', 
          'Kaufmann, H. et al.: Building with Timber.' 
        ]} 
        regelwerke={[ 
          { title: 'DIN EN 1995-1-1:2024-03 / NA:2021-03 (Eurocode 5: Bemessung und Konstruktion von Holzbauten)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1995-1-1' }, 
          { title: 'DIN EN 14080:2013-09 (Holzbauwerke - Brettschichtholz und Balkenschichtholz)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+14080' },
          { title: 'DIN EN 15497:2014-07 (Keilgezinktes Vollholz für tragende Zwecke - KVH)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15497' },
          { title: 'DIN EN 16351:2021-06 (Holzbauwerke - Brettsperrholz - Anforderungen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+16351' }
        ]} 
        formeln={[
          { 
            formel: 'M_{Ed} = \\frac{q_d \\cdot L^2}{8}', 
            erklaerung: 'Maximales Biegemoment Med eines statisch bestimmt gelagerten Einfeldträgers unter Gleichstreckenlast qd.',
            quelle: 'Statik / Technische Mechanik'
          },
          { 
            formel: '\\sigma_{m,y,d} = \\frac{M_{y,Ed}}{W_y} \\le f_{m,y,d} = k_{\\text{mod}} \\cdot \\frac{f_{m,y,k}}{\\gamma_M}', 
            erklaerung: 'Biegespannungsnachweis (ULS) nach EC 5 unter Berücksichtigung von Modifikationsbeiwert kmod und Teilsicherheitsbeiwert gamma_M (1.30 für Vollholz, 1.25 für BSH).',
            quelle: 'DIN EN 1995-1-1 Abs. 6.1.6'
          },
          { 
            formel: 'w_{\\text{inst}} = \\frac{5 \\cdot q_{\\text{inst}} \\cdot L^4}{384 \\cdot E_{0,\\text{mean}} \\cdot I_y} \\le \\frac{L}{300} \\dots \\frac{L}{500}', 
            erklaerung: 'Gebrauchstauglichkeitsnachweis (SLS): Elastische Anfangsdurchbiegung unter quasi-ständiger Lastkombination.',
            quelle: 'DIN EN 1995-1-1 Abs. 7.2'
          }
        ]} 
      />
    </div>
  );
}
