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
import inhalt from '@/content/bauwerksunters_monitoring/Bauwerksunters_Monitoring.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

// Constants for Wood Drill Simulator
interface TimberConfig {
  name: string;
  density: string;
  baseResistance: number;
  description: string;
}

const TIMBER_TYPES: Record<string, TimberConfig> = inhalt.daten.TIMBER_TYPES;

const TIMBER_STATES = inhalt.daten.TIMBER_STATES;

type MonitoringReiter = 'monitoring' | 'grundlagen' | 'rechner' | 'katalog';
const REITER: readonly ModulTab<MonitoringReiter>[] = [
  { id: 'monitoring', label: inhalt.texte.tragwerksMonitoringSensorikShm, icon: Activity },
  { id: 'grundlagen', label: inhalt.texte.holzdiagnostikResistographie, icon: Hammer },
  { id: 'rechner', label: inhalt.texte.schadensFeuchterechner, icon: ClipboardCheck },
  { id: 'katalog', label: inhalt.texte.zfpPrüfkatalogKonsolidiert, icon: Layers },
];

export default function Bauwerksunters_Monitoring() {
  const [activeTab, setActiveTab] = useState<MonitoringReiter>('monitoring');
  
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
      hfIndication = inhalt.werte.trockenUnter40Digits;
    } else if (measuredDigits >= 40 && measuredDigits <= 80) {
      hfIndication = inhalt.werte.feuchtigkeitsgrenzbereich4080Digits;
    } else {
      hfIndication = inhalt.werte.nassÜber80Digits;
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
      correctedStrength: karbonatisiert ? inhalt.werte.randzoneKarbonatisiert : inhalt.werte.randzoneNichtKarbonatisiert,
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
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase"><MdText text={inhalt.texte.mängelSchädenStrukturüberwachung} /></span>
            <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.tragwerksMonitoringSchadenssensorikShm} /></h2>
          </div>
        </div>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed md:flex items-center gap-4">
          <p className="flex-1"><MdText text={inhalt.texte.dasSchadensmanagementAkutBeanspruchter} /></p>
          <div className="shrink-0 flex gap-2 mt-3 md:mt-0">
            <span className="px-2 py-1 bg-shiraz/5 text-shiraz font-black rounded text-[10px] tracking-wider border border-shiraz/20">VDI 6200</span>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 font-black rounded text-[10px] tracking-wider border border-slate-200">DIN 1076</span>
          </div>
        </div>
      </div>

      <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-8 [&>[role=tablist]]:border [&>[role=tablist]]:border-home-grau/30 [&>[role=tablist]]:bg-white [&>[role=tablist]]:p-1 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:shadow-sm">

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
                <h3 className="font-bold text-base text-slate-900"><MdText text={inhalt.texte.zentralerZfpDiagnosemethodenkatalog} /></h3>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.konsolidierterKatalogSämtlicher14} /></p>
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
                <Trees className="text-shiraz" /><MdText text={inhalt.texte.interaktiverBohrwiderstandsSimulatorHolz} /></h3>
              <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.simulierenSieDasMechanische} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Steuerung */}
              <div className="lg:col-span-4 bg-[#f8fafc] p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
                <span className="text-[10px] font-black text-shiraz uppercase tracking-wider block">Simulator-Parameter:</span>
                
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1"><MdText text={inhalt.texte.holzartAuswählen} /></label>
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1"><MdText text={inhalt.texte.strukturellerWerkstoffzustand} /></label>
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
                  <span className="font-extrabold text-slate-800 uppercase block text-[9px] tracking-wider mb-1">Mess-Funktionsweise:</span><MdText text={inhalt.texte.eineRotierendeStahlnadelEmptyset} /></div>
              </div>

              {/* Diagramm & Visualisierung */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex-1 flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest"><MdText text={inhalt.texte.activeSimulatorMonitor} /></span>
                  </div>
                  
                  {/* Schematic Timber Cross-section visualization */}
                  <div className="flex items-center gap-4 bg-slate-900 px-4 py-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-300"><MdText text={inhalt.texte.querschnittsModell120Mm} /></div>
                    <div className="flex-1 h-6 rounded bg-[#1e293b] relative border border-[#334155] overflow-hidden flex">
                      {/* Left healthy bark segment */}
                      <div className="w-[10%] h-full bg-[#475569] shrink-0 border-r border-[#64748b]"></div>
                      
                      {/* Interactive defect overlay showing on wood model */}
                      <div className="flex-1 h-full relative">
                        {selectedState === 'kernfaeule' && (
                          <div className="absolute left-[33%] right-[20%] top-0 bottom-0 bg-yellow-900/60 blur-[3px] border-l border-r border-dashed border-yellow-750 flex items-center justify-center">
                            <span className="text-[8px] font-extrabold uppercase text-yellow-300 tracking-widest opacity-80"><MdText text={inhalt.texte.zersetzungPilz} /></span>
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
                            <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest"><MdText text={inhalt.texte.gefügeGesundKraftschlüssig} /></span>
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
                      <div className="absolute left-2 top-2 bg-slate-950 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-400"><MdText text={inhalt.texte.amplitudenhöheInBohrwiderstand} /></div>
                    </div>
                    
                    {/* X-Axis labels */}
                    <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                      <span><MdText text={inhalt.texte.t0MmEintritt} /></span>
                      <span>30 mm</span>
                      <span>60 mm</span>
                      <span>90 mm</span>
                      <span><MdText text={inhalt.texte.t120MmAustritt} /></span>
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
                    {selectedState === 'gesund' && inhalt.werte.dieUngestörteDämpfungskurveBeweist}
                    {selectedState === 'kernfaeule' && inhalt.werte.derCharakteristischeLanganhaltendeDichte}
                    {selectedState === 'kaefer' && inhalt.werte.einTypischesSchadbildBei}
                    {selectedState === 'hohl' && inhalt.werte.derPlötzlicheAbfallDes}
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
                <h3 className="font-bold text-base text-slate-900"><MdText text={inhalt.texte.echtzeitMonitoringShm} /></h3>
                
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.beimStructuralHealthMonitoring} /></p>

                <div className="p-3 bg-red-50 border border-red-100 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-extrabold text-red-800 uppercase block tracking-wider"><MdText text={inhalt.texte.klassischeMessgrößenSensortypologie} /></span>
                  <ul className="space-y-1.5 text-[11px] text-slate-700">
                    <li className="flex gap-1.5 items-start">
                      <span className="text-shiraz">•</span>
                      <span><MdText text={inhalt.texte.induktiveWegaufnehmerLvdtsErfassen} /><span className="block text-[10px] text-slate-500 mt-0.5"><MdText text={inhalt.texte.prüfvorschriftKalibrierungNachHersteller} /></span>
                      </span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-shiraz">•</span>
                      <span><MdText text={inhalt.texte.dehnungsmesstreifenDmsWerdenAuf} /><span className="block text-[10px] text-slate-500 mt-0.5"><MdText text={inhalt.texte.prüfvorschriftVdiVde2635} /></span>
                      </span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-shiraz">•</span>
                      <span><MdText text={inhalt.texte.piezokeramischeBeschleunigungsgeberRegis} /><span className="block text-[10px] text-slate-500 mt-0.5"><MdText text={inhalt.texte.prüfvorschriftDin456691} /></span>
                      </span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-shiraz">•</span>
                      <span><MdText text={inhalt.texte.tdrFeuchtesondenMessenZeitlich} /><span className="block text-[10px] text-slate-500 mt-0.5"><MdText text={inhalt.texte.prüfvorschriftWtaMerkblatt4} /></span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mt-4 text-[10.5px] text-slate-500 leading-normal"><MdText text={inhalt.texte.ingenieurVorteilMonitoringErgänzt} /></div>
            </div>

            {/* Interactive thermal-crack breathing loop demonstration */}
            <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-black text-shiraz uppercase tracking-widest block flex items-center gap-1.5">
                  <LineChart size={14} /><MdText text={inhalt.texte.dynamischesRissbreitenMonitoringTemperat} /></span>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.risseInBauwerkenStehen} /></p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 my-4 text-white">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-2 border-b border-slate-800 pb-1">
                  <span><MdText text={inhalt.texte.sensorIdLvdtC12} /></span>
                  <span className="text-emerald-400"><MdText text={inhalt.texte.streamOnline} /></span>
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
                  <div className="absolute left-[50%] top-2 bg-slate-900 border border-slate-800 px-1 text-[8px] rounded text-slate-300 -translate-x-[50%]"><MdText text={inhalt.texte.mittagshitzeTMax} /></div>
                </div>

                {/* X-axis time indicator */}
                <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-1.5 border-t border-slate-800">
                  <span><MdText text={inhalt.texte.t0600Morgen} /></span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                  <span><MdText text={inhalt.texte.t0600NächsterTag} /></span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1.5 bg-[#A3113E] inline-block rounded"></span>
                    <span className="text-[10px] font-mono text-slate-300"><MdText text={inhalt.texte.bauteilTemperaturC} /></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1.5 border-t-2 border-dashed border-[#94a3b8] inline-block"></span>
                    <span className="text-[10px] font-mono text-slate-300"><MdText text={inhalt.texte.rissöffnungsWeiteMm} /></span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700 leading-normal">
                <span className="font-extrabold text-slate-800"><MdText text={inhalt.texte.diagnostischeErkenntnis} /></span>
                <p><MdText text={inhalt.texte.imSommerDehntSich} /></p>
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
                    <h3 className="font-bold text-sm text-slate-900"><MdText text={inhalt.texte.feuchtigkeitsrechnerBelegreifeCmMethode} /></h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase"><MdText text={inhalt.texte.estricheMauerwerkeBewerten} /></p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1"><MdText text={inhalt.texte.estrichBaustoffKlassifizierung} /></label>
                    <select aria-label={inhalt.werte.estrichBaustoffKlassifizierung}
                      value={substrate}
                      onChange={(e) => setSubstrate(e.target.value as typeof substrate)}
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
                      <label htmlFor="heated" className="text-xs font-semibold text-slate-700 cursor-pointer"><MdText text={inhalt.texte.beheizteEstrichkonstruktionFußbodenheizu} /></label>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                      <span><MdText text={inhalt.texte.messergebnisCalciumcarbidMethode} /></span>
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
                      <span><MdText text={inhalt.texte.zerstörungsfreieHfMessungEindringtiefe} /></span>
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
                    <span>{substrate === 'brick' ? inhalt.werte.mauerwerkKeineBelegreifeGrenze : moistureEvaluation.isBelegreif ? inhalt.werte.freigabeErteiltBelegreif : inhalt.werte.verlegeSperreNichtBelegreif}</span>
                  </div>
                  <p className="leading-relaxed">{moistureEvaluation.evalText}</p>
                  <p className="border-t border-current/20 pt-1.5 text-[11px] opacity-80">
                    <strong>HF-Vorscan:</strong> {moistureEvaluation.hfIndication}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-500 leading-normal space-y-1">
                <p><MdText text={inhalt.texte.normhinweisDasKapazitiveHochfrequenz} /></p>
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
                    <h3 className="font-bold text-sm text-slate-900"><MdText text={inhalt.texte.rückprallhammerKarbonatisierung} /></h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase"><MdText text={inhalt.texte.dinEn125042} /></p>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-medium text-slate-600">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span><MdText text={inhalt.texte.gemessenerSchlagrückprallRMittelwert} /></span>
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
                      <span><MdText text={inhalt.texte.mitPhenolphthaleinBestimmteKarbonatisier} /></span>
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
                      <span><MdText text={inhalt.texte.alterDesTragwerks} /></span>
                      <span className="font-bold text-slate-900">{formatDeWert(concreteAge)} Jahre</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={concreteAge}
                      onChange={(e) => setConcreteAge(parseInt(e.target.value))}
                      className="w-full accent-slate-800"
                    />
                  </div>
                </div>

                <div className="bg-[#f8fafc] p-4 rounded-xl border border-home-grau/25 space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-shiraz tracking-widest block">Auswertung:</span>
                  <div className="grid grid-cols-2 gap-3 text-xs leading-none">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-bold block mb-1"><MdText text={inhalt.texte.rückprallzahlR} /></span>
                      <strong className="text-sm font-mono text-slate-800">{reboundEvaluation.rawStrength}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-bold block mb-1"><MdText text={inhalt.texte.qualitativeEinordnungRelativvergleich} /></span>
                      <strong className="text-sm font-mono text-rose-600">{reboundEvaluation.correction}</strong>
                    </div>
                    <div className="bg-[#1e293b] p-2.5 rounded-lg border border-[#334155] col-span-2 text-white">
                      <span className="text-[9px] text-orange-200 font-bold block mb-1">Prüffläche:</span>
                      <strong className="text-base font-black font-mono text-amber-300">{reboundEvaluation.correctedStrength}</strong>
                      <span className="text-[9px] text-slate-300 block mt-1 leading-normal italic">{reboundEvaluation.karbonatisiert ? inhalt.werte.karbonatisierteRandzonenErhöhenR : inhalt.werte.inFestigkeitUmrechnenNur}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-normal pt-1.5 border-t border-slate-200"><MdText text={inhalt.texte.progressKoeffizientFKarbonatfront} />{reboundEvaluation.k_c} mm/Jahr<sup>0,5</sup>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-500 leading-normal">
                <p><MdText text={inhalt.texte.hintergrundDurchAufnahmeVon} /></p>
              </div>
            </div>
          </div>
        )}

      </div>
      </ModuleTabs>

      {/* 4. Standardization Scientific / Code Rules (Didaktisches Formelregister) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="font-bold text-sm text-text-main mb-3 flex items-center gap-1.5 uppercase text-[10px] tracking-widest text-[#475569]">
          <Compass size={14} className="text-shiraz" /><MdText text={inhalt.texte.didaktischesFormelregisterRissDiagnostik} /></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed md:divide-x md:divide-slate-200">
          <div className="space-y-2">
            <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block"><MdText text={inhalt.texte.t1ElastomechanischeImpulslaufzeitE} /></span>
            <p><MdText text={inhalt.texte.zurZerstörungsfreienBestimmungDer} /></p>
            <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/20 my-1 text-center">
              <BlockMath math="E_{dyn} = \frac{\rho \cdot v_p^2 \cdot (1 + \nu) \cdot (1 - 2\nu)}{1 - \nu}" />
            </div>
            <p className="text-[10px] text-slate-500"><MdText text={inhalt.texte.wobeiRhoDieRohdichte} /></p>
          </div>
          <div className="space-y-2 md:pl-4">
            <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block"><MdText text={inhalt.texte.t2DiffusionsfortschrittDerKarbonatisierun} /></span>
            <p><MdText text={inhalt.texte.dieZeitlicheEntwicklungDer} /></p>
            <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/20 my-1 text-center">
              <BlockMath math="x_c(t) = k_c \cdot \sqrt{t}" />
            </div>
            <p className="text-[10px] text-slate-500"><MdText text={inhalt.texte.hierBezeichnetXC} /></p>
          </div>
        </div>
      </div>

      {/* 5. Standardized Module Footer */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1DynamischerE}
        zielGleichung="E_{dyn} = v_L^2 \cdot \rho \cdot \frac{(1+\nu)(1-2\nu)}{1-\nu}"
        schritte={inhalt.daten["Bauwerksunters_Monitoring.schritte"]}
        ergebnisHinweis={inhalt.werte.derDynamischeEModul}
        normQuelle={inhalt.werte.dinEn125044}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2ElektrolytischerBetonwiderstand}
        zielGleichung="\rho = 2\pi \cdot a \cdot \frac{U}{I}"
        schritte={inhalt.daten["Bauwerksunters_Monitoring.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dieGrenzwerteHängenVon}
        normQuelle={inhalt.werte.rilemTc154Emc}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bauwerksunters_monitoring" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap11}
        wikipedia={[
          { title: 'Bauwerksdiagnostik', url: 'https://de.wikipedia.org/wiki/Bauwerksdiagnostik' },
          { title: inhalt.werte.zerstörungsfreieWerkstoffprüfung, url: 'https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Werkstoffpr%C3%BCfung' },
          { title: 'Bohrwiderstandsmessung', url: 'https://de.wikipedia.org/wiki/Bohrwiderstandsmessung' },
          { title: 'Structural-Health-Monitoring' }
        ]}
        literatur={inhalt.daten["Bauwerksunters_Monitoring.literatur"]}
        regelwerke={inhalt.daten["Bauwerksunters_Monitoring.regelwerke"]}
        formeln={inhalt.daten["Bauwerksunters_Monitoring.formeln"]}
      />
    </div>
  );
}
