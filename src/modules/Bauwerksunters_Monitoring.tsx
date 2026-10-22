import { carbonationK } from '@/src/utils/schadensKern';
import React, { useState, useMemo } from 'react';
import { Activity, Layers, Hammer, Droplets, Ruler, ClipboardCheck, 
  Trees, 
  Info, LineChart, Compass
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { InlineMath, BlockMath } from 'react-katex';
import PruefverfahrenKatalog from './bauwerksuntersuchung/PruefverfahrenKatalog';

// Constants for Wood Drill Simulator
interface TimberConfig {
  name: string;
  density: string;
  baseResistance: number;
  description: string;
}

const TIMBER_TYPES: Record<string, TimberConfig> = {
  fichte: {
    name: "Fichte (Gemeine Fichte)",
    density: "380–470 kg/m³",
    baseResistance: 48,
    description: "Häufigstes Nadelbauholz im Tragwerksbereich. Zeigt ausgeprägte Frühholz-Spätholz-Dichteunterschiede."
  },
  kiefer: {
    name: "Kiefer (Waldkiefer)",
    density: "490–550 kg/m³",
    baseResistance: 58,
    description: "Kernholzbaum mit harzreichem Holz. Deutliche Härteunterschiede im Jahresringübergang."
  },
  eiche: {
    name: "Eiche (Stieleiche)",
    density: "650–760 kg/m³",
    baseResistance: 78,
    description: "Sehr dichtes, zähes Laubholz mit hervorragender biologischer Dauerhaftigkeit im Kernbereich."
  }
};

const TIMBER_STATES = {
  gesund: {
    name: "Gesunder Querschnitt",
    desc: "Homogene Dichteverteilung über den gesamten Holzquerschnitt mit normalen Jahresring-Oszillationen."
  },
  kernfaeule: {
    name: "Kernfäule (Pilzbefall)",
    desc: "Ausgeprägte Zersetzung des Holzgefüges im inneren Bereich. Festigkeitsverlust im tragenden Zentrum."
  },
  kaefer: {
    name: "Nagekäferbefall (Anobien, Anobium punctatum) bzw. Splintholzkäferbefall (Lyctus spp.)",
    desc: "Zerstörung der weicheren äußeren Splintholzzone durch Fraßgänge. Innerer Kern bleibt vorerst intakt."
  },
  hohl: {
    name: "Hohler Stamm / Riss",
    desc: "Vollständiger Materialausfall (Hohlraum oder breiter Schwindriss) im mittleren Tiefenbereich."
  }
};

export default function Bauwerksunters_Monitoring() {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'grundlagen' | 'rechner' | 'katalog'>('monitoring');
  
  // States for Timber Drilling Simulator
  const [selectedTimber, setSelectedTimber] = useState<string>('fichte');
  const [selectedState, setSelectedState] = useState<string>('gesund');
  const [drillProgress, setDrillProgress] = useState<number>(100); // % progress of animation or static view
  
  // States for Moisture / CM Validator
  const [substrate, setSubstrate] = useState<'cement' | 'anhydrite' | 'brick'>('cement');
  const [isHeated, setIsHeated] = useState<boolean>(false);
  const [measuredCM, setMeasuredCM] = useState<number>(2.2);
  const [measuredDigits, setMeasuredDigits] = useState<number>(65);

  // States for Carbonatization Rebound Correlation Rechner
  const [reboundVal, setReboundVal] = useState<number>(38);
  const [carbDepth, setCarbDepth] = useState<number>(15);
  const [concreteAge, setConcreteAge] = useState<number>(40); // Jahre

  // Generate Wood Drilling Resistance Path (120 data points from 0 to 120mm depth)
  const drillingData = useMemo(() => {
    const config = TIMBER_TYPES[selectedTimber] || TIMBER_TYPES.fichte;
    const state = selectedState;
    const points: { depth: number; resistance: number; isFault: boolean }[] = [];
    
    for (let d = 0; d <= 120; d++) {
      // Base resistance + sine-like oscillations for annual rings
      const base = config.baseResistance;
      // Oscillations representing earlywood vs latewood density changes
      const ringOscillation = Math.sin(d * 0.4) * 8 + Math.cos(d * 1.1) * 3;
      
      let modifier = 1.0;
      let isFault = false;
      
      if (state === 'kernfaeule') {
        // Kernfäule degrades the middle from 40mm to 95mm
        if (d >= 40 && d <= 95) {
          const t = (d - 40) / 55; // 0 to 1
          // Dip shape
          const dip = 1.0 - Math.sin(t * Math.PI) * 0.85;
          modifier = dip;
          isFault = true;
        }
      } else if (state === 'kaefer') {
        // Splintholz decay at the outer edge (0 to 30mm)
        if (d < 30) {
          const t = d / 30;
          modifier = 0.2 + t * 0.8;
          isFault = true;
        }
      } else if (state === 'hohl') {
        // Complete structural loss at 50mm to 80mm
        if (d >= 50 && d <= 80) {
          modifier = 0.03; // almost 0
          isFault = true;
        }
      }
      
      // Noise component to look like real friction torque
      const noise = (Math.sin(d * 3) * Math.cos(d * 7)) * 2;
      
      let finalVal = (base * modifier) + ringOscillation + noise;
      if (finalVal < 2) finalVal = 1 + Math.random(); // Clamp at min friction
      
      points.push({
        depth: d,
        resistance: Math.round(finalVal),
        isFault
      });
    }
    return points;
  }, [selectedTimber, selectedState]);

  // Belegreife: CM-Grenzwerte nach Schnittstellenkoordination (BVF/ZDB u. a.), belagsabhängig
  const moistureEvaluation = useMemo(() => {
    let limitCM = 2.0;
    let evalText = "";
    let isBelegreif = false;
    let hfIndication = "";

    if (substrate === 'cement') {
      limitCM = isHeated ? 1.8 : 2.0;
      isBelegreif = measuredCM <= limitCM;
      evalText = isBelegreif 
        ? `Der Zementestrich ist mit ${formatDeWert(measuredCM)} CM-% belegreif (Richtwert Schnittstellenkoordination: ≤ ${formatDeWert(limitCM)} CM-%, belagsabhängig).` 
        : `Der Zementestrich ist mit ${formatDeWert(measuredCM)} CM-% NICHT belegreif! Es drohen Verformungen oder Haftungsabrisse im Oberbelag (Richtwert: ≤ ${formatDeWert(limitCM)} CM-%, belagsabhängig).`;
    } else if (substrate === 'anhydrite') {
      limitCM = isHeated ? 0.3 : 0.5;
      isBelegreif = measuredCM <= limitCM;
      evalText = isBelegreif
        ? `Der Calciumsulfatestrich (Anhydrit) ist mit ${formatDeWert(measuredCM)} CM-% belegreif (Richtwert: ≤ ${formatDeWert(limitCM)} CM-%, belagsabhängig).`
        : `Der Calciumsulfatestrich ist mit ${formatDeWert(measuredCM)} CM-% NICHT belegreif! Ein Einbau von Belägen führt zu mineralischer Nadelbildung (Ettringit-ähnlich) und Blasen (Richtwert: ≤ ${formatDeWert(limitCM)} CM-%, belagsabhängig).`;
    } else {
      // Mauerwerk: keine Belegreife-Grenze; Beurteilung über Darr-Feuchte und Durchfeuchtungsgrad
      limitCM = NaN;
      isBelegreif = false;
      evalText = `Für Mauerwerk gibt es keinen Belegreife-Grenzwert. Gemessen: ${formatDeWert(measuredCM)} CM-%. Feuchte über Darrprüfung (DIN EN ISO 12570) und Durchfeuchtungsgrad (Bezug auf Sättigungsfeuchte) beurteilen.`;
    }

    // HF Indicator Interpretation (approximate mapping)
    if (measuredDigits < 40) {
      hfIndication = "Trocken (unter 40 Digits - oberflächennah unkritisch)";
    } else if (measuredDigits >= 40 && measuredDigits <= 80) {
      hfIndication = "Feuchtigkeitsgrenzbereich (40-80 Digits - Messung in der Tiefe empfohlen)";
    } else {
      hfIndication = "Nass (über 80 Digits - Akute Feuchtebelastung)";
    }

    return { limitCM, evalText, isBelegreif, hfIndication };
  }, [substrate, isHeated, measuredCM, measuredDigits]);

  // Calculate concrete properties with carbonatization effects (rebound correlation)
  const reboundEvaluation = useMemo(() => {
    // DIN EN 13791: Rückprallzahlen dürfen nur über eine Kalibrierung an Bohrkernen desselben
    // Bauteils in Festigkeiten umgerechnet werden; eine pauschale Karbonatisierungskorrektur gibt es nicht.
    const kategorie = reboundVal < 30 ? 'niedrig' : reboundVal <= 40 ? 'mittel' : 'hoch';
    const karbonatisiert = carbDepth >= 5;
    // √t-Gesetz: x_c = k_c · √t  →  k_c = x_c / √t  (carbonationK, schadensKern)
    const k_c = carbonationK(carbDepth, Math.max(1, concreteAge));

    return {
      rawStrength: String(reboundVal),
      correction: kategorie,
      correctedStrength: karbonatisiert ? 'Randzone karbonatisiert' : 'Randzone nicht karbonatisiert',
      karbonatisiert,
      k_c: formatDeZahl(k_c, 2)
    };
  }, [reboundVal, carbDepth, concreteAge]);

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Header & Quick Introduction */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-shiraz text-white rounded-xl shadow-sm">
            <Activity size={22} />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Mängel &amp; Schäden • Strukturüberwachung</span>
            <h2 className="text-xl font-bold text-text-main">Tragwerks-Monitoring &amp; Schadenssensorik (SHM)</h2>
          </div>
        </div>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed md:flex items-center gap-4">
          <p className="flex-1">
            Das Schadensmanagement akut beanspruchter Tragwerke beruht auf kontinuierlicher <strong>Sensorik (Structural Health Monitoring - SHM)</strong>, messtechnischer Rissbreitenüberwachung (LVDT), Dehnungsmessungen (DMS) und forensischer Holz-Resistographie. Zerstörungsfreie Prüfverfahren (ZfP) sind mit dem zentralen Prüfkatalog konsolidiert.
          </p>
          <div className="shrink-0 flex gap-2 mt-3 md:mt-0">
            <span className="px-2 py-1 bg-shiraz/5 text-shiraz font-black rounded text-[10px] tracking-wider border border-shiraz/20">VDI 6200</span>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 font-black rounded text-[10px] tracking-wider border border-slate-200">DIN 1076</span>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex border border-home-grau/30 bg-white p-1 rounded-2xl shadow-sm gap-1 flex-wrap md:flex-nowrap">
        <button
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'monitoring'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          onClick={() => setActiveTab('monitoring')}
        >
          <Activity size={16} />
          Tragwerks-Monitoring &amp; Sensorik (SHM)
        </button>
        <button
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'grundlagen'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          onClick={() => setActiveTab('grundlagen')}
        >
          <Hammer size={16} />
          Holzdiagnostik &amp; Resistographie
        </button>
        <button
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'rechner'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          onClick={() => setActiveTab('rechner')}
        >
          <ClipboardCheck size={16} />
          Schadens- &amp; Feuchterechner
        </button>
        <button
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'katalog'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          onClick={() => setActiveTab('katalog')}
        >
          <Layers size={16} />
          ZfP-Prüfkatalog (Konsolidiert)
        </button>
      </div>

      {/* 3. Tab Contents Content */}
      <div className="space-y-6">
        
        {/* TAB: PRÜFVERFAHREN-KATALOG (KONSOLIDIERT AUS BAUWERKSUNTERSUCHUNG) */}
        {activeTab === 'katalog' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex items-start gap-4">
              <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl mt-0.5 shrink-0">
                <Layers size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">Zentraler ZfP- & Diagnosemethodenkatalog</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Konsolidierter Katalog sämtlicher 14 Vor-Ort- und Laborprüfverfahren nach DGZfP, DBV und DIN EN – synchronisiert mit dem Modul <em>Bauen im Bestand &gt; Bauwerksuntersuchung</em>. Hier stehen alle physikalischen Wirkprinzipien, Auswerteformeln, Systemgrenzen und interaktiven Rechner zur Verfügung.
                </p>
              </div>
            </div>
            <PruefverfahrenKatalog />
          </div>
        )}

        {/* TAB 2: INTERAKTIVER BOHRWIDERSTANDS-SIMULATOR (HOLZ) */}
        {activeTab === 'grundlagen' && (
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trees className="text-shiraz" />
                Interaktiver Bohrwiderstands-Simulator (Holzuntersuchung)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simulieren Sie das mechanische Kraftprofil von <strong>Resistographen-Prüfungen</strong> im Inneren tragender Holzbauteile (z.B. Deckenbalken, Fachwerk, Brückenpfähle). Durch die Dichteunterschiede zwischen dichtem Spätholz und weicherem Frühholz oszilliert die Kurve; Fehlstellen, Fäule oder Insektenfraß führen zu charakteristischen Kurveneinbrüchen.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Steuerung */}
              <div className="lg:col-span-4 bg-[#f8fafc] p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
                <span className="text-[10px] font-black text-shiraz uppercase tracking-wider block">Simulator-Parameter:</span>
                
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Holzart auswählen:</label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {Object.entries(TIMBER_TYPES).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTimber(key)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border text-left transition-all ${
                          selectedTimber === key
                            ? 'bg-shiraz text-white border-shiraz'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{item.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${selectedTimber === key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{item.density}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Struktureller Werkstoffzustand:</label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {Object.entries(TIMBER_STATES).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedState(key)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border text-left transition-all ${
                          selectedState === key
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs">{item.name}</div>
                        <div className={`text-[10px] ${selectedState === key ? 'text-slate-300' : 'text-slate-500'} font-normal mt-0.5 leading-snug`}>{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                  <span className="font-extrabold text-slate-800 uppercase block text-[9px] tracking-wider mb-1">Mess-Funktionsweise:</span>
                  Eine rotierende Stahlnadel (<InlineMath math="\emptyset \approx 1{,}5\,\text{mm}" />) wird mit einer kontinuierlichen Eintriebsgeschwindigkeit ins Holz gedrückt. Der Stromverbrauch des Elektromotors korreliert mit der lokalen Rohdichte; Absolutwerte sind gerätespezifisch, ausgewertet wird relativ (Profilvergleich).
                </div>
              </div>

              {/* Diagramm & Visualisierung */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex-1 flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Active Simulator Monitor</span>
                  </div>
                  
                  {/* Schematic Timber Cross-section visualization */}
                  <div className="flex items-center gap-4 bg-slate-900 px-4 py-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-300">Querschnitts-Modell (120 mm):</div>
                    <div className="flex-1 h-6 rounded bg-[#1e293b] relative border border-[#334155] overflow-hidden flex">
                      {/* Left healthy bark segment */}
                      <div className="w-[10%] h-full bg-[#475569] shrink-0 border-r border-[#64748b]"></div>
                      
                      {/* Interactive defect overlay showing on wood model */}
                      <div className="flex-1 h-full relative">
                        {selectedState === 'kernfaeule' && (
                          <div className="absolute left-[33%] right-[20%] top-0 bottom-0 bg-yellow-900/60 blur-[3px] border-l border-r border-dashed border-yellow-750 flex items-center justify-center">
                            <span className="text-[8px] font-extrabold uppercase text-yellow-300 tracking-widest opacity-80">Zersetzung (Pilz)</span>
                          </div>
                        )}
                        {selectedState === 'kaefer' && (
                          <div className="absolute left-0 w-[25%] top-0 bottom-0 bg-amber-950/70 border-r border-dashed border-red-900 flex items-center justify-center">
                            <span className="text-[8px] font-extrabold uppercase text-amber-300 tracking-widest opacity-80">Larvenfraß</span>
                          </div>
                        )}
                        {selectedState === 'hohl' && (
                          <div className="absolute left-[41%] right-[33%] top-0 bottom-0 bg-black/90 border-l border-r border-dashed border-slate-800 flex items-center justify-center">
                            <span className="text-[8px] font-extrabold uppercase text-slate-400 tracking-widest opacity-80">Hohlraum</span>
                          </div>
                        )}
                        {selectedState === 'gesund' && (
                          <div className="w-full h-full flex items-center justify-center opacity-40">
                            <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest">Gefüge Gesund / Kraftschlüssig</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Right healthy bark segment */}
                      <div className="w-[10%] h-full bg-[#475569] shrink-0 border-l border-[#64748b]"></div>
                    </div>
                  </div>

                  {/* Drilling graph rendering using interactive SVG */}
                  <div className="flex-1 min-h-[220px] bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-end">
                    <div className="flex-1 relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                        <div className="border-b border-white w-full"></div>
                        <div className="border-b border-white w-full"></div>
                        <div className="border-b border-white w-full"></div>
                        <div className="border-b border-white w-full"></div>
                        <div className="border-b border-white w-full"></div>
                      </div>
                      
                      {/* SVG plotting path */}
                      <svg viewBox="0 0 120 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        {/* Area shading for defect zones if active */}
                        {selectedState === 'kernfaeule' && (
                          <rect x="40" y="0" width="55" height="100" fill="rgba(245, 158, 11, 0.05)" />
                        )}
                        {selectedState === 'kaefer' && (
                          <rect x="0" y="0" width="30" height="100" fill="rgba(239, 68, 68, 0.05)" />
                        )}
                        {selectedState === 'hohl' && (
                          <rect x="50" y="0" width="30" height="100" fill="rgba(255, 255, 255, 0.03)" />
                        )}

                        {/* Baseline resistance helper dotted line */}
                        <line x1="0" y1={100 - TIMBER_TYPES[selectedTimber].baseResistance} x2="120" y2={100 - TIMBER_TYPES[selectedTimber].baseResistance} stroke="rgba(239, 68, 68, 0.3)" strokeDasharray="1,1" strokeWidth="0.5" />

                        {/* Dynamic Path Plotting */}
                        <polyline
                          fill="none"
                          stroke={selectedState === 'gesund' ? '#475569' : '#64748b'}
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={drillingData.map((p, idx) => `${idx},${100 - p.resistance}`).join(' ')}
                        />
                      </svg>
                      
                      {/* Axis indicators in graph */}
                      <div className="absolute left-2 top-2 bg-slate-950 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-400">
                        Amplitudenhöhe in % (Bohrwiderstand)
                      </div>
                    </div>
                    
                    {/* X-Axis labels */}
                    <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                      <span>0 mm (Eintritt)</span>
                      <span>30 mm</span>
                      <span>60 mm</span>
                      <span>90 mm</span>
                      <span>120 mm (Austritt)</span>
                    </div>
                  </div>
                </div>

                {/* Analytical explanation bar */}
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-slate-900">
                    <Info size={14} className="text-shiraz" />
                    <span>Kurvendiagnose: {TIMBER_STATES[selectedState as keyof typeof TIMBER_STATES].name}</span>
                  </div>
                  <p className="leading-relaxed">
                    {selectedState === 'gesund' && "Die ungestörte Dämpfungskurve beweist eine intakte Faserstruktur des tragenden Bauteils. Die kleinen lokalen Ausschläge belegen die härteren Spätholzbänder, wodurch das Jahrringalter des Holzes gezählt werden kann."}
                    {selectedState === 'kernfaeule' && "Der charakteristische langanhaltende Dichteeinbruch zwischen 40mm und 95mm zeigt tiefgreifende Braunfäule oder Moderfäule im Kernbereich auf. Trotz anscheinend intakter Randschichten ist die Biegetragfähigkeit um bis zu 60% gemindert!"}
                    {selectedState === 'kaefer' && "Ein typisches Schadbild bei historischem Nadelholz. Die äußeren Millimeter weisen extrem geringen Bohrwiderstand auf, was einem vollständigen Gefügebearbeitungsverlust durch Anobien (Holzwurm) entspricht."}
                    {selectedState === 'hohl' && "Der plötzliche Abfall des Bohrwiderstands auf den Reibungswert der bloßen Nadelwelle (nahe 0%) signalisiert eine vollständige mechanische Entkopplung im Inneren (Spaltriss oder Hohlstamm)."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MONITORING & MULTI-SENSORS */}
        {activeTab === 'monitoring' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-300">
            {/* Theoretical intro to structural health monitoring SHM */}
            <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-shiraz uppercase tracking-wider block">Struktur-Überwachung</span>
                <h3 className="font-bold text-base text-slate-900">Echtzeit-Monitoring (SHM)</h3>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  Beim <strong>Structural Health Monitoring (SHM)</strong> verbleiben physikalische Sensoren dauerhaft am oder im Bauwerk. Sie erfassen kontinuierlich den Beanspruchungsverlauf aus dynamischen Lasten (Verkehr, Wind) und thermohygrischen Dehnungen.
                </p>

                <div className="p-3 bg-red-50 border border-red-100 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-extrabold text-red-800 uppercase block tracking-wider">Klassische Messgrößen &amp; Sensortypologie:</span>
                  <ul className="space-y-1.5 text-[11px] text-slate-700">
                    <li className="flex gap-1.5 items-start">
                      <span className="text-shiraz">•</span>
                      <span>
                        <strong>Induktive Wegaufnehmer (LVDTs):</strong> Erfassen Rissbreitenbewegungen im Mikrometerbereich (<InlineMath math="\mu\text{m}" />).
                        <span className="block text-[10px] text-slate-500 mt-0.5">Prüfvorschrift: Kalibrierung nach Herstellerangabe bzw. DAkkS-Kalibrierschein; Messkonzept nach Bauwerksmonitoring-Literatur (DGZfP). Rissbreitenkriterien ggf. nach TR Instandhaltung</span>
                      </span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-shiraz">•</span>
                      <span>
                        <strong>Dehnungsmesstreifen (DMS):</strong> Werden auf Stahlträger oder Betonflächen geklebt zur Bestimmung realer mikro-elastischer Spannungen (<InlineMath math="\sigma_s" />).
                        <span className="block text-[10px] text-slate-500 mt-0.5">Prüfvorschrift: VDI/VDE 2635 Blatt 1 (Dehnungsmessstreifen mit metallischem Messgitter)</span>
                      </span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-shiraz">•</span>
                      <span>
                        <strong>Piezokeramische Beschleunigungsgeber:</strong> Registrieren von Eigenfrequenzen zur frühzeitigen Feststellung von Tragfähigkeitsminderungen.
                        <span className="block text-[10px] text-slate-500 mt-0.5">Prüfvorschrift: DIN 45669-1, VDI 2038 Blatt 1</span>
                      </span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-shiraz">•</span>
                      <span>
                        <strong>TDR-Feuchtesonden:</strong> Messen zeitlich aufgelöste elektrolytische Bauwerksfeuchten direkt im Gefügeinneren.
                        <span className="block text-[10px] text-slate-500 mt-0.5">Prüfvorschrift: WTA-Merkblatt 4-11-16/D (Messung des Wassergehalts bzw. der Feuchte von mineralischen Baustoffen)</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mt-4 text-[10.5px] text-slate-500 leading-normal">
                <strong>Ingenieur-Vorteil:</strong> Monitoring ergänzt die Prüfungen nach DIN 1076, ersetzt oder verlängert die Regelintervalle aber nicht; es kann Sonderprüfungen gezielt auslösen und Nutzungsauflagen absichern, da das Risikopotential transparent überwacht wird.
              </div>
            </div>

            {/* Interactive thermal-crack breathing loop demonstration */}
            <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-black text-shiraz uppercase tracking-widest block flex items-center gap-1.5">
                  <LineChart size={14} /> Dynamisches Rissbreiten-Monitoring &amp; Temperaturgang-Simulator
                </span>
                <p className="text-xs text-slate-600 leading-normal">
                  Risse in Bauwerken stehen unter mechanischer Dehnung. Die größte Bewegungsamplitude entsteht jedoch meist nicht durch die Nutzlast, sondern durch die thermische Längenänderung der Bauteilkörper (<strong>"Riss-Atmung"</strong>). Betrachten Sie die periodische 24h-Kurve zwischen Bauteiltemperatur und LVDT-Rissöffnung:
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 my-4 text-white">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-2 border-b border-slate-800 pb-1">
                  <span>Sensor ID: LVDT_C12_401 (Zementestrich/Trägergelenk)</span>
                  <span className="text-emerald-400">Stream: Online</span>
                </div>

                <div className="h-44 relative flex flex-col justify-end">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                    <div className="border-b border-white w-full"></div>
                    <div className="border-b border-white w-full"></div>
                    <div className="border-b border-white w-full"></div>
                    <div className="border-b border-white w-full"></div>
                  </div>

                  {/* Double line plotting */}
                  {/* Sun rises, temperature rises, material expands, CRACK WIDTH DECREASES/CLOSES */}
                  <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Temp Line (Red) */}
                    <path
                      fill="none"
                      stroke="#A3113E"
                      strokeWidth="1.1"
                      d="M 0,35 C 15,35 25,10 50,10 C 75,10 85,35 100,35"
                    />
                    {/* Crack width Line (Blue) - Inverted relationship, as heat closes the crack */}
                    <path
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.1"
                      strokeDasharray="2,1"
                      d="M 0,15 C 15,15 25,40 50,40 C 75,40 85,15 100,15"
                    />
                  </svg>

                  {/* Vertical markers for noon */}
                  <div className="absolute left-[50%] top-0 bottom-0 border-l border-dashed border-white/20"></div>
                  <div className="absolute left-[50%] top-2 bg-slate-900 border border-slate-800 px-1 text-[8px] rounded text-slate-300 -translate-x-[50%]">
                    Mittagshitze (T_max)
                  </div>
                </div>

                {/* X-axis time indicator */}
                <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-1.5 border-t border-slate-800">
                  <span>06:00 (Morgen)</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                  <span>06:00 (Nächster Tag)</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1.5 bg-[#A3113E] inline-block rounded"></span>
                    <span className="text-[10px] font-mono text-slate-300">Bauteil-Temperatur (°C)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1.5 border-t-2 border-dashed border-[#94a3b8] inline-block"></span>
                    <span className="text-[10px] font-mono text-slate-300">Rissöffnungs-Weite (mm)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700 leading-normal">
                <span className="font-extrabold text-slate-800">Diagnostische Erkenntnis:</span>
                <p>
                  Im Sommer dehnt sich das Tragwerk infolge solarer Aufheizung aus <InlineMath math="\Delta l = \alpha_t \cdot l_0 \cdot \Delta T" />. Dadurch schließen sich Risse und Dehnfugen mechanisch (LVDT-Kurve sinkt). Bei winterlichem Frost zieht sich das Bauteil zusammen, Dehnfugen und Risse öffnen sich maximal (Vorsicht bei Frost-Tausalz-Angriffen!). Ein Rissgitter ohne Einbezug dieses Dehneffekts ist extrem fehleranfällig. Für eine Trendaussage müssen die Messwerte temperaturkompensiert werden. Nimmt die Rissöffnung über mehrere Zyklen bleibend zu, deutet das auf aktive Ursachen hin (Setzung, Kriechen, Korrosion, Überlast).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DIAGNOSTISCHE BERECHNUNGSWERKZEUGE */}
        {activeTab === 'rechner' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-305">
            {/* Rechner 1: Feuchtigkeits- und Belegreife-Prüfung */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-home-grau/25 pb-2 mb-2">
                  <span className="p-1.5 bg-shiraz/5 text-shiraz rounded-lg">
                    <Droplets size={16} />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Feuchtigkeitsrechner (Belegreife, CM-Methode)</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Estriche &amp; Mauerwerke bewerten</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Estrich / Baustoff-Klassifizierung</label>
                    <select aria-label="Estrich / Baustoff-Klassifizierung"
                      value={substrate}
                      onChange={(e) => setSubstrate(e.target.value as any)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-shiraz"
                    >
                      <option value="cement">Zementestrich (CT)</option>
                      <option value="anhydrite">Calciumsulfatestrich (CA / Anhydrit)</option>
                      <option value="brick">Ziegelmauerwerk (Vollziegel)</option>
                    </select>
                  </div>

                  {substrate !== 'brick' && (
                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                      <input
                        type="checkbox"
                        id="heated"
                        checked={isHeated}
                        onChange={(e) => setIsHeated(e.target.checked)}
                        className="rounded text-shiraz focus:ring-shiraz"
                      />
                      <label htmlFor="heated" className="text-xs font-semibold text-slate-700 cursor-pointer">
                        Beheizte Estrichkonstruktion (Fußbodenheizung)
                      </label>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                      <span>Messergebnis Calciumcarbid-Methode:</span>
                      <span className="font-bold text-shiraz">{formatDeWert(measuredCM)} CM-%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="5.0"
                      step="0.1"
                      value={measuredCM}
                      onChange={(e) => setMeasuredCM(parseFloat(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                      <span>Zerstörungsfreie HF-Messung (Eindringtiefe ca. 3cm):</span>
                      <span className="font-bold text-slate-800">{formatDeWert(measuredDigits)} Digits</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="120"
                      value={measuredDigits}
                      onChange={(e) => setMeasuredDigits(parseInt(e.target.value))}
                      className="w-full accent-slate-600"
                    />
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${moistureEvaluation.isBelegreif ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-amber-50 border-amber-100 text-amber-900'} text-xs space-y-2`}>
                  <div className="font-bold flex items-center gap-1">
                    <span>{substrate === 'brick' ? 'ℹ Mauerwerk: keine Belegreife-Grenze' : moistureEvaluation.isBelegreif ? '✔ Freigabe erteilt (Belegreif)' : '⚠ Verlege-Sperre (Nicht Belegreif)'}</span>
                  </div>
                  <p className="leading-relaxed">{moistureEvaluation.evalText}</p>
                  <p className="border-t border-current/20 pt-1.5 text-[11px] opacity-80">
                    <strong>HF-Vorscan:</strong> {moistureEvaluation.hfIndication}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-500 leading-normal space-y-1">
                <p><strong>Normhinweis:</strong> Das kapazitive Hochfrequenz-Verfahren (HF) dient ausschließlich der schnellen, zerstörungsfreien Eingrenzung feuchter Zonen. Die <strong>CM-Messung</strong> ist das in der Praxis vereinbarte Prüfverfahren für die Belegreife; Darr- und KRL-Verfahren sind Referenz- bzw. alternative Verfahren. Die CM-Richtwerte (CT ≤ 2,0 / beheizt ≤ 1,8; CA ≤ 0,5 / beheizt ≤ 0,3 CM-%) stammen aus der Schnittstellenkoordination und hängen vom Belag ab.</p>
              </div>
            </div>

            {/* Rechner 2: Schmidt-Hammer Festigkeitsschätzung & Karbonatisierung */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-home-grau/25 pb-2 mb-2">
                  <span className="p-1.5 bg-slate-900 text-white rounded-lg">
                    <Ruler size={16} strokeWidth={2.5} />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Rückprallhammer & Karbonatisierung</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">DIN EN 12504-2 · Festigkeit nur mit Kalibrierung (DIN EN 13791)</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-medium text-slate-600">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Gemessener Schlagrückprall R (Mittelwert):</span>
                      <span className="font-bold text-slate-900">R = {formatDeWert(reboundVal)}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="60"
                      value={reboundVal}
                      onChange={(e) => setReboundVal(parseInt(e.target.value))}
                      className="w-full accent-slate-800"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Mit Phenolphthalein bestimmte Karbonatisierungstiefe:</span>
                      <span className="font-shiraz font-bold">{formatDeWert(carbDepth)} mm</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={carbDepth}
                      onChange={(e) => setCarbDepth(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Alter des Tragwerks:</span>
                      <span className="font-bold text-slate-900">{formatDeWert(concreteAge)} Jahre</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={concreteAge}
                      onChange={(e) => setConcreteAge(parseInt(e.target.value))}
                      className="w-full accent-slate-805"
                    />
                  </div>
                </div>

                <div className="bg-[#f8fafc] p-4 rounded-xl border border-home-grau/25 space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-shiraz tracking-widest block">Auswertung:</span>
                  <div className="grid grid-cols-2 gap-3 text-xs leading-none">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-bold block mb-1">Rückprallzahl R:</span>
                      <strong className="text-sm font-mono text-slate-800">{reboundEvaluation.rawStrength}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-bold block mb-1">Qualitative Einordnung (Relativvergleich):</span>
                      <strong className="text-sm font-mono text-rose-600">{reboundEvaluation.correction}</strong>
                    </div>
                    <div className="bg-[#1e293b] p-2.5 rounded-lg border border-[#334155] col-span-2 text-white">
                      <span className="text-[9px] text-orange-200 font-bold block mb-1">Prüffläche:</span>
                      <strong className="text-base font-black font-mono text-amber-300">{reboundEvaluation.correctedStrength}</strong>
                      <span className="text-[9px] text-slate-300 block mt-1 leading-normal italic">{reboundEvaluation.karbonatisiert ? 'Karbonatisierte Randzonen erhöhen R – Prüffläche abschleifen bzw. Karbonatisierungstiefe dokumentieren.' : 'In Festigkeit umrechnen nur über eine Kalibrierung an Bohrkernen desselben Bauteils (DIN EN 13791).'}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-normal pt-1.5 border-t border-slate-205">
                    <strong>Progress-Koeffizient f. Karbonatfront:</strong> k_c = {reboundEvaluation.k_c} mm/Jahr<sup>0,5</sup>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-500 leading-normal">
                <p><strong>Hintergrund:</strong> Durch Aufnahme von atmosphärischem <InlineMath math="\text{CO}_2" /> wandelt sich Calciumhydroxid <InlineMath math="\text{Ca(OH)}_2" /> im Beton unter Oberflächenhärtung in Kalkstein <InlineMath math="\text{CaCO}_3" /> um. Ein Sklerometer (Rückprallhammer) prallt dort härter ab und liefert dort höhere Rückprallzahlen. Deshalb Prüffläche abschleifen, Karbonatisierungstiefe dokumentieren und die Rückprallzahl nur über Bohrkerne kalibriert in Festigkeit umrechnen.</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. Standardization Scientific / Code Rules (Didaktisches Formelregister) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="font-bold text-sm text-text-main mb-3 flex items-center gap-1.5 uppercase text-[10px] tracking-widest text-[#475569]">
          <Compass size={14} className="text-shiraz" /> Didaktisches Formelregister riss- &amp; diagnostikspezifischer Tragwerksprozesse
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed md:divide-x md:divide-slate-200">
          <div className="space-y-2">
            <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block">1. Elastomechanische Impulslaufzeit (E-Modul)</span>
            <p>Zur zerstörungsfreien Bestimmung der homogenen Betoneigenschaften in-situ wird die Ultraschall-Laufzeit ermittelt:</p>
            <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/20 my-1 text-center">
              <BlockMath math="E_{dyn} = \frac{\rho \cdot v_p^2 \cdot (1 + \nu) \cdot (1 - 2\nu)}{1 - \nu}" />
            </div>
            <p className="text-[10px] text-slate-500">
              Wobei <InlineMath math="\rho" /> die Rohdichte des Betons (<InlineMath math="\text{kg/m}^3" />), <InlineMath math="v_p" /> die Schallgeschwindigkeit (<InlineMath math="\text{m/s}" />) und <InlineMath math="\nu" /> die Querdehnzahl (ca. 0,2) repräsentieren.
            </p>
          </div>
          <div className="space-y-2 md:pl-4">
            <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block">2. Diffusionsfortschritt der Karbonatisierung</span>
            <p>Die zeitliche Entwicklung der Karbonatisierungsfront folgt näherungsweise dem √t-Gesetz (aus dem Fick’schen Gesetz mit wandernder Reaktionsfront abgeleitet):</p>
            <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/20 my-1 text-center">
              <BlockMath math="x_c(t) = k_c \cdot \sqrt{t}" />
            </div>
            <p className="text-[10px] text-slate-500">
              Hier bezeichnet <InlineMath math="x_c" /> die Karbonatisierungstiefe (<InlineMath math="\text{mm}" />), <InlineMath math="k_c" /> den stoff- und umweltabhängigen Karbonatisierungsbeiwert und <InlineMath math="t" /> das Alter (Jahre).
            </p>
          </div>
        </div>
      </div>

      {/* 5. Standardized Module Footer */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Dynamischer E-Modul aus der Ultraschalllaufzeit"
        zielGleichung="E_{dyn} = v_L^2 \cdot \rho \cdot \frac{(1+\nu)(1-2\nu)}{1-\nu}"
        schritte={[
          { titel: 'Messung', erklaerung: 'Durchschallung einer 300 mm dicken Wand, Laufzeit 71,4 µs:', formel: 'v_L = \\frac{0{,}300}{71{,}4 \\cdot 10^{-6}} = 4\\,200\\,\\text{m/s}' },
          { titel: 'Kennwerte', erklaerung: 'ρ = 2 400 kg/m³, ν = 0,2:', formel: '\\frac{1{,}2 \\cdot 0{,}6}{0{,}8} = 0{,}90' },
          { titel: 'E-Modul', erklaerung: 'Einsetzen:', formel: 'E_{dyn} = 4\\,200^2 \\cdot 2\\,400 \\cdot 0{,}90 = 38{,}1\\,\\text{GPa}' }
        ]}
        ergebnisHinweis="Der dynamische E-Modul liegt über dem statischen. Deutlich geringere Laufzeiten-Geschwindigkeiten in Teilbereichen weisen auf Gefügestörungen, Kiesnester oder Risse hin."
        normQuelle="DIN EN 12504-4"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Elektrolytischer Betonwiderstand nach dem Wenner-Verfahren"
        zielGleichung="\rho = 2\pi \cdot a \cdot \frac{U}{I}"
        schritte={[
          { titel: 'Messanordnung', erklaerung: 'Elektrodenabstand a = 50 mm; gemessene Spannung 0,40 V bei 1,0 mA:', formel: '\\frac{U}{I} = \\frac{0{,}40}{0{,}001} = 400\\,\\Omega' },
          { titel: 'Widerstand', erklaerung: 'Einsetzen:', formel: '\\rho = 2\\pi \\cdot 0{,}05 \\cdot 400 = 126\\,\\Omega\\text{m}' },
          { titel: 'Einordnung', erklaerung: 'Orientierungswerte: hoher Widerstand bedeutet geringe Korrosionsgeschwindigkeit.', formel: '\\rho > 100\\,\\Omega\\text{m} \\Rightarrow \\text{eher geringes Risiko}' }
        ]}
        ergebnisHinweis="Die Grenzwerte hängen von Zementart, Feuchte und Temperatur ab; der Widerstand wird mit Potentialfeldmessung und Chloridanalytik kombiniert. Bewehrung nahe der Messstrecke verfälscht das Ergebnis."
        normQuelle="RILEM TC 154-EMC; DGZfP-Merkblatt B 03"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bauwerksunters_monitoring" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 11 Mängel & Schäden: DIN 1076:2026-01, ZfP-Kennwerte und Quellen geprüft; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Bauwerksdiagnostik', url: 'https://de.wikipedia.org/wiki/Bauwerksdiagnostik' },
          { title: 'Zerstörungsfreie Werkstoffprüfung', url: 'https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Werkstoffpr%C3%BCfung' },
          { title: 'Bohrwiderstandsmessung', url: 'https://de.wikipedia.org/wiki/Bohrwiderstandsmessung' },
          { title: 'Structural-Health-Monitoring' }
        ]}
        literatur={[
          'DGZfP-Merkblätter der Reihe B (ZfP im Bauwesen); DIN 1076 und RI-EBW-PRÜF: Zustandserfassung, Analyse und Bauwerksdiagnostik im Bestand.',
          'DGZfP-Merkblätter B 02, B 03 (2025), B 04, B 10, B 11 (2022) – Deutsche Gesellschaft für Zerstörungsfreie Prüfung.',
          'DIN 68800-4: Holzschutz – Bekämpfungs- und Sanierungsmaßnahmen gegen Holz zerstörende Pilze und Insekten.'
        ]}
        regelwerke={[
          { title: 'VDI 6200:2010-02 (Standsicherheit von Bauwerken – Regelmäßige Überprüfung); Blatt 1.1:2026-06', url: 'https://www.vdi.de/' },
          { title: 'DIN 1076:2026-01 (Ingenieurbauwerke im Zuge von Straßen und Wegen – Überwachung und Prüfung)' },
          { title: 'DIN 18560-1 (Estriche im Bauwesen – Allgemeine Anforderungen, Prüfung und Ausführung); Belegreife nach Schnittstellenkoordination (BVF/ZDB) bzw. DIN 18356/18365' },
          { title: 'RILEM TC 154-EMC: Test methods for on-site measurement of resistivity of concrete (Polder, Materials and Structures 33, 2000)', url: 'https://www.rilem.net/' }
        ]}
        formeln={[
          {
            formel: 'v_L = \\sqrt{\\frac{E \\cdot (1-\\nu)}{\\rho \\cdot (1+\\nu)(1-2\\nu)}} \\quad [\\text{m/s}]',
            erklaerung: 'Longitudinalwellen-Geschwindigkeit bei Ultraschallprüfungen an Beton und Mauerwerk zur Detektion von Fehlstellen, Hohlräumen und Festigkeitsgradienten.',
            quelle: 'DIN EN 12504-4'
          },
          {
            formel: '\\rho_{\\text{app}} = 2\\pi \\cdot a \\cdot \\frac{U}{I} \\quad [\\Omega\\cdot\\text{m}]',
            erklaerung: 'Spezifischer elektrischer Widerstand nach dem Wenner-Vier-Punkt-Verfahren zur Bewertung des Korrosionsrisikos der Bewehrung (RILEM TC 154-EMC).',
            quelle: 'RILEM TC 154-EMC'
          },
          {
            formel: 'R_B = \\frac{\\Delta W}{\\Delta x} \\implies \\text{Holzgüteprofil nach Resistographie}',
            erklaerung: 'Bohrwiderstandsmessung (Resistographie) an Holzkonstruktionen: Verlauf des Drehmoments über die Bohrtiefe zur Identifizierung von Fäulnis, Fraßgängen und Jahrringdichten.',
            quelle: 'WTA / DGZfP'
          }
        ]}
      />
    </div>
  );
}
