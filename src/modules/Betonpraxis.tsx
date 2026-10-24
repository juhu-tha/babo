import React, { useState } from 'react';
import { ModuleFooter } from '../components/ui/ModuleFooter';
import { ConceptTooltip } from '@/src/components/ui/ConceptTooltip';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { 
  ClipboardCheck, 
  Droplets, 
  AlertTriangle, 
  Beaker, 
  Compass, 
  Activity, 
  Layers, 
  BookOpen, 
  ChevronRight, 
  Info,
  Sliders,
  Flame,
  Wrench,
  Sparkles,
  Calendar,
  Grid,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { DIN1045_3_NACHBEHANDLUNG } from '@/src/data/normParams';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { ExpositionsKurzkarte } from '@/src/components/ui/ExpositionsKurzkarte';
import { formatDeZahl, formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';

// Mindestdauer der Nachbehandlung: zentrale Werte nach DIN 1045-3 (normParams)
const curingTable: Record<string, Record<string, number>> = {
  '5_9': DIN1045_3_NACHBEHANDLUNG.mindestdauerTage['5_10'],
  '10_14': DIN1045_3_NACHBEHANDLUNG.mindestdauerTage['10_15'],
  '15_24': DIN1045_3_NACHBEHANDLUNG.mindestdauerTage['15_25'],
  'ge_25': DIN1045_3_NACHBEHANDLUNG.mindestdauerTage.ge25,
};

function ConcreteThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'beton');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 mt-8">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Beton im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den verschiedenen Beton-Lehrbereichen:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe / Betonpraxis */}
        <button
          onClick={() => setActiveTab('betonpraxis')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Betontechnologie & Praxis</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Expositionsklassen-Konfigurator, Nachbehandlungsrechner & Betondeckung.
          </span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_beton')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Betonzulassung (Bauprodukt)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Transport- vs. Baustellenbeton, WPK-Überwachung, Ü-Zeichen & Abnahme.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={handleDauerhaftigkeitClick}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Dauerhaftigkeit & Schäden</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Karbonatisierung, Frost-Tausalz-Angriff, AKR-Treiben & Bewehrungskorrosion.
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

interface BetonpraxisProps {
  initialSubTab?: 'diagnostik' | 'zusammenhalt' | 'einbau' | 'nachbehandlung' | 'krell_tabelle' | 'festigkeit';
}

export default function Betonpraxis({ initialSubTab }: BetonpraxisProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState<'diagnostik' | 'zusammenhalt' | 'einbau' | 'nachbehandlung' | 'krell_tabelle' | 'festigkeit'>(initialSubTab || 'diagnostik');

  // Interactive states for Tab 2: Zusammenhaltevermögen Calculator
  const [calcW, setCalcW] = useState<number>(175);
  const [calcMK, setCalcMK] = useState<number>(380);
  const [calcFK, setCalcFK] = useState<number>(420);
  const [slowHydration, setSlowHydration] = useState<boolean>(false);

  // Interactive states for Tab 2: Site Water addition Simulator
  const [waterAddition, setWaterAddition] = useState<number>(10); // l/m³
  const [airAddition, setAirAddition] = useState<number>(0); // Vol-%

  // Interactive states for Tab 3: Setting walkable time
  const [tempWalk, setTempWalk] = useState<number>(20); // °C

  // Interactive states for Tab 4: Core testing DIN EN 13791
  const [fck, setFck] = useState<number>(30); // MPa
  const [concreteVol, setConcreteVol] = useState<number>(45); // m³
  const [coresTested, setCoresTested] = useState<number>(3); 

  // Interactive states for Tab 5: Nachbehandlung
  const [curingTemp, setCuringTemp] = useState<'5_9' | '10_14' | '15_24' | 'ge_25'>('15_24');
  const [curingStrength, setCuringStrength] = useState<'schnell' | 'mittel' | 'langsam' | 'sehr_langsam'>('mittel');
  const [curingExposure, setCuringExposure] = useState<'x0_xc1' | 'standard' | 'erhoeht'>('standard');

  // Interactive states for Tab 5: Betonierbarkeit
  const [groesstkorn, setGroesstkorn] = useState<8 | 16 | 32>(16);

  // Interactive states for Tab 6: WU-Richtlinie
  const [wuBauteil, setWuBauteil] = useState<'waende' | 'bodenplatte' | 'daech'>('waende');
  const [wuBk, setWuBk] = useState<'bk1' | 'bk2'>('bk1');
  const [wuBauweise, setWuBauweise] = useState<'ortbeton' | 'element' | 'fertigteil'>('ortbeton');

  // Interactive states for Tab 6: Krell-Tabelle & Footnotes

  // --- Calculations for Zusammenhaltevermögen ---
  const kValue = calcMK > 0 ? (calcW - 70) / calcMK : 0;
  
  let kResultText = '';
  let kResultClass = '';
  let kAdvice = '';

  if (kValue <= 0.25) {
    kResultText = 'Sehr klebrig / Kaum bis kein Bluten (≤ 0.25)';
    kResultClass = 'bg-yellow-50 text-yellow-800 border-yellow-200';
    kAdvice = 'Der Beton klebt stark. Nahezu keine Wasserabgabe nach oben. Achtung beim Verdichten: Putscher/Stochern reicht meist nicht aus! Gefahr von eingeschlossenem Luftgehalt (bis zu 4-6% Gesamtluft möglich). Unbedingt sorgfältig mit der Rüttelflasche verdichten.';
  } else if (kValue <= 0.27) {
    kResultText = 'Klebend / Geringes Bluten (≤ 0.27)';
    kResultClass = 'bg-green-50 text-green-800 border-green-200';
    kAdvice = 'Beton hat ein vermindertes Bluten und eine geringere Wasseranreicherung oben. Gute Verarbeitungseigenschaft für geneigte Flächen, benötigt aber gewissenhafte Verdichtung.';
  } else if (kValue <= 0.31) {
    kResultText = 'Normales Zusammenhaltevermögen (~0.30)';
    kResultClass = 'bg-sky-50 text-sky-800 border-sky-100';
    kAdvice = 'Übliches Bluten von ca. 3 bis 5 l/m³ (bzw. 0,5 Vol.-%). Bietet ein ausgewogenes Verhalten für übliche Hochbauteile bei 20°C.';
  } else if (kValue <= 0.34) {
    kResultText = 'Mäßige Wasseranreicherung oben ("normal / dünn") (≥ 0.33)';
    kResultClass = 'bg-orange-50 text-orange-800 border-orange-200';
    kAdvice = 'Mäßige bis deutliche Wasserbewegung nach oben. Gefahr von Wasseranreicherung unter Bewehrungen oder an der Oberfläche. Achten Sie auf eine adäquate Rüttelzeit und vermeiden Sie stehendes Oberflächenwasser vor dem Oberflächenfinish.';
  } else {
    kResultText = 'Deutliches Bluten / Läuft stark aus ("dünn") (≥ 0.35)';
    kResultClass = 'bg-red-50 text-red-800 border-red-200';
    kAdvice = 'Erhebliche Gefahr einer unkontrollierten Entmischung und starker Wasseranreicherung an der Oberfläche. Hohe Gefahr von Schwindrissen/Netzrissen und minderfester Betonschicht an der Oberfläche. Mehlkornanteil erhöhen oder w/z-Wert reduzieren!';
  }

  // --- Calculations for site water addition --
  const predictedFlowIncrease = (waterAddition / 2.25) * 10; // +10mm flow spread for every 2 to 2.5 l/m³
  const predictedStrengthLoss = (waterAddition / 10) * 3.5; // -3 to -4 N/mm² for 10 l/m³
  const predictedShrinkageIncrease = (waterAddition / 10) * 0.1; // +0.1 mm/m for 10 l/m³
  const waterBleedingOut = waterAddition / 2; // half of added water bleeds out!

  // --- Calculations for air content change ---
  const predictedAirStrengthLoss = airAddition * 2; // -2 N/mm² per 1 Vol-%

  // --- Walkability calculations based on temperature ---
  // Baseline is at 20°C -> 4 hours for walkable (Trittfestigkeit)
  // 30°C is 60% of baseline (2.4h), 10°C is 200% (8h), 5°C is 400% (16h)
  let walkTimeFactor = 1.0;
  if (tempWalk >= 30) {
    walkTimeFactor = 0.6;
  } else if (tempWalk >= 20) {
    // interpolate between 20°C (1.0) and 30°C (0.6)
    walkTimeFactor = 1.0 - ((tempWalk - 20) / 10) * 0.4;
  } else if (tempWalk >= 10) {
    // interpolate between 10°C (2.0) and 20°C (1.0)
    walkTimeFactor = 2.0 - ((tempWalk - 10) / 10) * 1.0;
  } else if (tempWalk >= 5) {
    // interpolate between 5°C (4.0) and 10°C (2.0)
    walkTimeFactor = 4.0 - ((tempWalk - 5) / 5) * 2.0;
  } else {
    // Below 5°C reaction slows down drastically
    walkTimeFactor = 4.0 + ((5 - tempWalk) * 0.8);
  }
  const calcSettingTimeHours = 4 * walkTimeFactor;

  // --- Calculations for Bohrkernprüfung DIN EN 13791 ---
  // BK_min >= 0.85 * (fck - 4)
  const reqBkMin = 0.85 * (fck - 4);
  // Mittelwert-Anforderung (DIN EN 13791:2020-02 – manuell prüfen):
  // 2 - 4 Kerne: f_m(n),is >= 0,85 * (fck + 1); 5 - 6 Kerne: >= 0,85 * (fck + 2)
  const reqBkMedian = coresTested <= 4 ? 0.85 * (fck + 1) : 0.85 * (fck + 2);

  // --- Calculations for WU-Richtlinie ---
  const getWuMindestdicke = (): { dicke: number; core?: number; comment: string } => {
    if (wuBauteil === 'waende') {
      if (wuBk === 'bk1') {
        if (wuBauweise === 'ortbeton') return { dicke: 240, comment: 'Ortbetonwand, Beanspruchungsklasse 1 (drückendes Wasser).' };
        if (wuBauweise === 'element') return { dicke: 240, comment: 'Elementwand: 240 mm Gesamtdicke, Kernbeton ≥ 120 mm.' };
        return { dicke: 200, comment: 'Fertigteilwand, Beanspruchungsklasse 1.' };
      } else { // BK2
        if (wuBauweise === 'ortbeton') return { dicke: 200, comment: 'Ortbetonwand, Beanspruchungsklasse 2 (Bodenfeuchte, nicht stauendes Sickerwasser).' };
        if (wuBauweise === 'element') return { dicke: 240, comment: 'Elementwand (BK 2): 240 mm Gesamtdicke, Kernbeton ≥ 120 mm.' };
        return { dicke: 100, comment: 'Fertigteilwand, Beanspruchungsklasse 2.' };
      }
    } else if (wuBauteil === 'bodenplatte') {
      if (wuBk === 'bk1') {
        if (wuBauweise === 'ortbeton') return { dicke: 250, comment: 'Ortbeton-Bodenplatte, Beanspruchungsklasse 1.' };
        if (wuBauweise === 'element') return { dicke: 0, comment: 'Für Bodenplatten ist keine Elementbauweise vorgesehen.' };
        return { dicke: 200, comment: 'Fertigteil-Bodenplatte, Beanspruchungsklasse 1.' };
      } else { // BK2
        if (wuBauweise === 'ortbeton') return { dicke: 150, comment: 'Ortbeton-Bodenplatte, Beanspruchungsklasse 2.' };
        if (wuBauweise === 'element') return { dicke: 0, comment: 'Für Bodenplatten ist keine Elementbauweise vorgesehen.' };
        return { dicke: 100, comment: 'Fertigteil-Bodenplatte, Beanspruchungsklasse 2.' };
      }
    } else { // daech (Dächer)
      if (wuBk === 'bk1') {
        if (wuBauweise === 'ortbeton') return { dicke: 200, comment: 'Lehrannahme (keine Tabellenwerte der WU-Richtlinie für Dächer): '+'Flachdächer ohne zusätzliche Dichtungsbahn (Ortbeton): Erhöhte Dichtungskritikalität.' };
        if (wuBauweise === 'element') return { dicke: 240, core: 180, comment: 'Lehrannahme (keine Tabellenwerte der WU-Richtlinie für Dächer): '+'Elementdecke/Dach: 240 mm Gesamtdicke mit 180 mm Ortbeton-Aufbeton.' };
        return { dicke: 180, comment: 'Lehrannahme (keine Tabellenwerte der WU-Richtlinie für Dächer): '+'Werks-Fertigteil für WU-Dächer: 180 mm Dicke.' };
      } else { // BK2
        if (wuBauweise === 'ortbeton') return { dicke: 180, comment: 'Lehrannahme (keine Tabellenwerte der WU-Richtlinie für Dächer): '+'WU-Flachdach bei Schutz gegen stehendes Wasser.' };
        if (wuBauweise === 'element') return { dicke: 220, core: 160, comment: 'Lehrannahme (keine Tabellenwerte der WU-Richtlinie für Dächer): '+'Elementdecke BK 2: 220 mm Gesamtdicke mit 160 mm Kern.' };
        return { dicke: 160, comment: 'Lehrannahme (keine Tabellenwerte der WU-Richtlinie für Dächer): '+'Fertigteil BK 2: 160 mm Dicke.' };
      }
    }
  };

  return (
    <div id="betonpraxis-root" className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ClipboardCheck className="text-shiraz" /> Betonpraxis (nach Dr. Krell, 2022)
          <span className="text-xs bg-shiraz/10 text-shiraz font-mono font-bold px-2 py-0.5 rounded">
            Regelwerk-Handkarte + Anhang
          </span>
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Praxisnahe Tipps, Grenzwerte, Regelwerks-Anhang und mathematische Daumenregeln zur Frisch- und Festbetonsteuerung.
          </p>
        </div>
      </div>

      {/* Sub tabs navigation (AP 3.8: ARIA-Reiter, 6 Bereiche) */}
      <ModuleTabs
        label="Bereiche Betonpraxis"
        tabs={[
          { id: 'diagnostik' as const, label: 'Frischbeton-Diagnostik', icon: Beaker },
          { id: 'zusammenhalt' as const, label: 'Zusammenhalt & Wasser-Sim', icon: Droplets },
          { id: 'einbau' as const, label: 'Einbau & Industrieboden', icon: Wrench },
          { id: 'nachbehandlung' as const, label: 'Nachbehandlung & Betonierbarkeit', icon: Calendar },
          { id: 'krell_tabelle' as const, label: 'WU-Richtlinie & Expositionen', icon: Grid },
          { id: 'festigkeit' as const, label: 'ID-Prüfung & Bohrkerne', icon: Activity }
        ]}
        aktiv={activeSubTab}
        onWechsel={setActiveSubTab}
        className="[&>[role=tabpanel]]:mt-6"
      >

      {/* SUB-TAB 1: Frischbeton-Diagnostik */}
      {activeSubTab === 'diagnostik' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* Card 1: Ausbreitmaß & Feinmörtel */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-2">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <Compass size={18} className="text-shiraz" />
              Beobachtungen über die Norm (DIN) hinaus
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-off-white rounded-lg border border-home-grau/15 space-y-2">
                <span className="text-xs font-bold uppercase text-shiraz block">Ausbreitmaß beobachten</span>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Beim Messen des Ausbreitmaßes nicht nur auf den Millimeter-Wert achten:
                </p>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-1 pl-1">
                  <li>
                    <strong>Wasser- oder Leimrand:</strong> Optimal ist <span className="text-shiraz font-bold">kein oder maximal 3 mm</span> Rand. Ein größerer Rand zeigt ein mangelndes Wasserhaltevermögen des Betons an.
                  </li>
                  <li>
                    <strong>Grobkornverteilung:</strong> Keine Anreicherung von grobem Gestein am Randbereich. Dies signalisiert ein unzureichendes Zusammenhaltevermögen (Entmischungstendenz).
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-off-white rounded-lg border border-home-grau/15 space-y-2">
                <span className="text-xs font-bold uppercase text-shiraz block">Das Ausbreitmaß-Klassenarchiv</span>
                <p className="text-xs text-text-main/80">
                  Die standardisierten Konsistenzklassen nach DIN EN 206:
                </p>
                <div className="grid grid-cols-2 gap-1 text-xs font-mono mt-1">
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded">F1: ≤ 340 mm (steif)</div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded">F2: 350-410 (plastisch)</div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded">F3: 420-480 (weich)</div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded">F4: 490-550 (sehr weich)</div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded">F5: 560-620 (fließfähig)</div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded">F6: 630-700 (sehr fließf.)</div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded col-span-2 text-center text-shiraz font-bold">SVB: &gt; 700 mm (selbstverdichtend)</div>
                </div>
              </div>
            </div>

            {/* Spezieller Test: Rütteln im Eimer */}
            <div className="p-4 bg-shiraz/5 border border-shiraz/10 rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-text-main flex items-center gap-1.5">
                <Sparkles size={16} className="text-shiraz animate-pulse" />
                Spezialtest: Oberflächenbeurteilung im 10-Liter-Eimer
              </h4>
              <p className="text-xs text-text-main/80">
                Zur schnellen Untersuchung der Entmischungs- und Klebrigkeitstendenzen auf der Baustelle oder im Labor:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <div className="font-bold text-shiraz mb-1">1. Versuchsaufbau</div>
                  Einen standardmäßigen 10 l Eimer bis ca. 5 cm unter den Rand befüllen und auf dem Rütteltisch positionieren.
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <div className="font-bold text-shiraz mb-1">2. Blasenaufstieg</div>
                  Bestimmen Sie die Aufstiegsdauer großer Blasen beim Rütteln. Je zäher/klebriger der Beton, desto länger dauert es. Mehr Luftporen (Lunker) sind zu erwarten.
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <div className="font-bold text-shiraz mb-1">3. Fingertest</div>
                  Nach 30 Sek. Rütteln abstellen. Mit dem Handschuh-Finger von oben nach dem ersten Grobkorn tasten. Liegt dieses tiefer als <span className="font-bold text-red-600">3 mm</span>, besteht akute Entmischungsgefahr!
                </div>
              </div>

              <div className="bg-red-50/50 p-2.5 rounded border border-red-200/50 flex gap-2 items-start mt-2">
                <AlertTriangle size={15} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-900">
                  <strong>Folge von zu viel Feinmörtel oben:</strong> Anreicherung an jeder Einbaulage, Netzrisse an der Oberseite durch signifikant erhöhtes Schwindverhalten.
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Rohdichte & Luftgehalt */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <Layers size={18} className="text-shiraz" />
              Dichte &amp; Luftgehalt
            </h3>

            {/* Rohdichte-Bewertung */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-text-main/60 block">Frischbetonrohdichte bewerten</span>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Vergleichen Sie die gemessene Frischrohdichte sofort mit der Soll-Frischrohdichte der Erstprüfung:
              </p>
              
              <div className="space-y-1.5 text-xs">
                <div className="bg-red-50 border border-red-100 p-2.5 rounded">
                  <span className="font-bold text-red-800 block">Abweichung &gt; +0,02 kg/l</span>
                  Hinweis auf eine Überverdichtung des Betons. Einbaugefahr!
                </div>
                <div className="bg-orange-50 border border-orange-100 p-2.5 rounded">
                  <span className="font-bold text-orange-850 block">Abweichung &gt; -0,02 kg/l (zu niedrig)</span>
                  Gefahr von erhöhter Porosität: Entspricht ca. <span className="font-bold">10 l/m³ Luft</span> oder alternativ <span className="font-bold">15 kg/m³ unzulässigem Zusatzwasser</span>.
                </div>
              </div>
            </div>

            {/* Luftgehalt */}
            <div className="p-3 bg-yellow-50/20 border border-yellow-200/50 rounded-lg space-y-2">
              <span className="text-xs font-bold uppercase text-yellow-800 block">Luftgehalt bestimmen</span>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Selbst ohne Luftporen-Bildner (LP) verbleiben bei sachgerechter Verdichtung üblicherweise <strong>0,5 bis 3,5 Vol.-% Luft</strong> (deutlich schwankend von den standardmäßig im Rezeptentwurf angenommenen 1,5 Vol.-%).
              </p>
              <div className="text-xs text-text-main/70 bg-white p-2 rounded border border-home-grau/10">
                <strong>Achtung:</strong> Betone mit geringem w/z-Wert und mehlkornreiche (klebrige) Betone halten Luftblasen stark fest. Nicht „kaputt-rütteln“ oder unkontrolliert Feinstoff abschneiden!
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: Zusammenhalt & Wasser-Sim */}
      {activeSubTab === 'zusammenhalt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          
          {/* Card 1: Zusammenhaltevermögen Calculator */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Activity size={18} className="text-shiraz" />
                Kennwert Zusammenhalt: (w - 70) / MK
              </h3>
              
              <p className="text-xs text-text-main/80">
                Gibt Aufschluss über das Frischbetonbluten und Schwindkraftverhalten. 
                Besonders mehlkornarme Betone weisen zu wenig Wasserbindevermögen auf.
              </p>

              <div className="space-y-3 bg-off-white p-4 rounded-xl border border-home-grau/30">
                {/* Inputs */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="font-semibold text-text-main">Wassergehalt w</label>
                    <span className="font-mono text-xs">{formatDeWert(calcW)} kg/m³</span>
                  </div>
                  <input 
                    type="range" 
                    min="140" 
                    max="240" 
                    value={calcW} 
                    onChange={(e) => setCalcW(Number(e.target.value))} 
                    className="w-full accent-shiraz"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="font-semibold text-text-main">Mehlkorn MK (Partikel &lt; 0,125 mm)</label>
                    <span className="font-mono text-xs">{formatDeWert(calcMK)} kg/m³</span>
                  </div>
                  <input 
                    type="range" 
                    min="250" 
                    max="500" 
                    value={calcMK} 
                    onChange={(e) => setCalcMK(Number(e.target.value))} 
                    className="w-full accent-shiraz"
                  />
                  <span className="text-xs text-text-main/50 block">Beinhaltet Zement, Flugasche, Kalksteinmehl und Feinstsand.</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-home-grau/10">
                  <input 
                    type="checkbox" 
                    id="slow_hydr" 
                    checked={slowHydration}
                    onChange={(e) => setSlowHydration(e.target.checked)}
                    className="rounded text-shiraz focus:ring-shiraz"
                  />
                  <label htmlFor="slow_hydr" className="text-xs font-semibold text-text-main/80 cursor-pointer">
                    Späte Gefügebildung (Kaltes Wetter, Verzögerer VZ)
                  </label>
                </div>
              </div>
            </div>

            {/* Calculations Output */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between bg-shiraz/5 p-3 rounded-lg border border-shiraz/10">
                <span className="text-xs font-bold text-shiraz block uppercase">Zusammenhalte-Kennwert:</span>
                <span className="text-xl font-mono font-bold text-shiraz">
                  {formatDeZahl(kValue, 3)}
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${kResultClass} text-xs space-y-1`}>
                <span className="font-bold uppercase tracking-wider block text-xs">
                  Diagnose Frischbeton (<ConceptTooltip termKey="bluten" fallbackText="Blutungsneigung" />):
                </span>
                <p className="font-bold">{kResultText}</p>
                <p className="leading-relaxed opacity-90 mt-1">{kAdvice}</p>
                {slowHydration && (
                  <div className="mt-2 text-xs bg-white/50 p-1.5 rounded border border-current opacity-80">
                    <strong>Achtung Zusatzfaktor:</strong> Durch Verzögerer oder Winterkälte tritt das Bluten verzögert auf. Mit erhöhtem Oberflächenwasser-Blutungsrand ist zu rechnen!
                  </div>
                )}
              </div>

              {/* Formel-Herleitungs-Box für das Zusammenhaltevermögen */}
              <FormulaDerivationBox
                title="Herleitung: Zusammenhaltevermögen k-Wert & Mehlkornbedarf"
                zielGleichung="k = \frac{w - 70}{mk} \le 0{,}30"
                normQuelle="DBV-Merkblatt Frischbeton & Walz-Zusammenhaltekriterium"
                ergebnisHinweis={`Aktueller Rechenwert: k = ${formatDeZahl(kValue, 3)} bei w = ${calcW} l/m³ und mk = ${calcMK} kg/m³`}
                schritte={[
                  {
                    titel: "1. Wirksamen Wassergehalt w erfassen",
                    erklaerung: "Gesamtwasser abzüglich der Eigenfeuchte der Gesteinskörnung. Hier maßgebend für die Schmierfilmbildung.",
                    formel: `w = ${calcW}\\text{ l/m}^3`,
                    einheit: "l/m³"
                  },
                  {
                    titel: "2. Mehlkorngehalt mk bilanzieren",
                    erklaerung: "Summe aus Zement z, Betonzusatzstoffen (z. B. Flugasche, Silikastaub) und dem Feinstanteil der Gesteinskörnung < 0,125 mm.",
                    formel: `mk = z + f_{\\text{Zusatz}} + g_{<0{,}125} = ${calcMK}\\text{ kg/m}^3`,
                    einheit: "kg/m³"
                  },
                  {
                    titel: "3. Überschusswasser-Quotient berechnen",
                    erklaerung: "Die empirische Konstante 70 l/m³ beschreibt das an den Kornoberflächen adhäsiv gebundene Wasser. Das verbleibende freie Wasser bestimmt die Stabilität.",
                    formel: `k = \\frac{${formatDeTeXWert(calcW)} - 70}{${formatDeTeXWert(calcMK)}} = \\frac{${formatDeTeXWert(calcW - 70)}}{${formatDeTeXWert(calcMK)}} = ${formatDeZahl(kValue, 3)}`,
                    einheit: "[-]"
                  },
                  {
                    titel: "4. Grenzwertprüfung & Baupraxis",
                    erklaerung: "Optimal ist k ≈ 0,27 bis 0,31. Bei k > 0,33 droht signifikante Wasserabsonderung; bei k ≤ 0,25 ist der Beton klebrig und schwer entlüftbar.",
                    formel: "k_{\\text{ziel}} \\approx 0{,}30 \\quad (\\text{Zielbereich für Pump- \\& Sichtbeton})"
                  }
                ]}
              />
            </div>
          </div>

          {/* Card 2: Site Water addition Simulator */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Sliders size={18} className="text-shiraz" />
                Interaktiver Baustellen-Wasser- &amp; Luftmengen-Simulator
              </h3>
              <p className="text-xs text-text-main/80">
                Geben Sie unerlaubte Wasserzugaben oder abweichende Luftporenanteile ein, um die fatalen Auswirkungen auf Festigkeiten und Schwinddehnungen zu kalkulieren.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50/20 p-4 rounded-xl border border-red-100 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-red-800 uppercase block">Extra Wasser auf der Baustelle</span>
                    <p className="text-xs text-text-main/70">
                      Zusatzwasser verändert den w/z-Wert und verschlechtert alle Dauerhaftigkeitswerte extrem.
                    </p>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-text-main">Zusatzwassergehalt</span>
                      <span className="font-mono text-red-700 font-bold">{formatDeWert(waterAddition)} Liter/m³</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="40" 
                      step="5"
                      value={waterAddition}
                      onChange={(e) => setWaterAddition(Number(e.target.value))}
                      className="w-full accent-red-700"
                    />
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setWaterAddition(20)} 
                        className="text-xs bg-red-800 text-white font-bold py-1 px-2 rounded-lg hover:bg-red-900 transition-colors w-full animate-in"
                      >
                        Setzen Sie "20 l/m³" (Verbotenes Maß)
                      </button>
                      <button 
                        onClick={() => setWaterAddition(0)} 
                        className="text-xs bg-home-grau/20 text-text-main py-1 px-2 rounded-lg hover:bg-home-grau/30 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-50/20 p-4 rounded-xl border border-sky-100 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-sky-800 uppercase block">Luftgehaltsabweichung</span>
                    <p className="text-xs text-text-main/70">
                      Jedes zusätzliche Prozent Porenluft mindert die Druckfestigkeit des erhärteten Betons im Bauteil.
                    </p>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-text-main">Porengehalt-Differenz</span>
                      <span className="font-mono text-sky-700 font-bold">+{formatDeWert(airAddition)} Vol.-%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      step="0.5"
                      value={airAddition}
                      onChange={(e) => setAirAddition(Number(e.target.value))}
                      className="w-full accent-sky-700"
                    />
                    <button 
                      onClick={() => setAirAddition(0)} 
                      className="text-xs bg-home-grau/20 text-text-main py-1 px-2 rounded-lg hover:bg-home-grau/30 transition-colors w-full"
                    >
                      Luft-Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated outputs */}
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
              <span className="text-xs font-bold text-text-main/80 uppercase block mb-3 border-b border-home-grau/10 pb-1">
                Simuliertes Resultat (Kombinierte Defizite):
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-home-grau/10">
                  <div className="text-xs text-text-main/50 font-semibold uppercase">Ausbreitmaß-Änderung</div>
                  <div className="text-sm font-bold text-green-700 font-mono">
                    +{formatDeZahl(predictedFlowIncrease, 0)} mm
                  </div>
                  <span className="text-xs text-text-main/40 block">Flüssiger Konsistenzfluss</span>
                </div>
                
                <div className="bg-white p-2.5 rounded-lg border border-home-grau/10">
                  <div className="text-xs text-text-main/50 font-semibold uppercase">Freigesetztes Blutungswasser</div>
                  <div className="text-sm font-bold text-orange-700 font-mono">
                    {formatDeZahl(waterBleedingOut, 1)} l/m³
                  </div>
                  <span className="text-xs text-text-main/40 block">Tritt als Oberflächenwasser aus</span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-home-grau/10">
                  <div className="text-xs text-text-main/50 font-semibold uppercase">Druckfestigkeitsverlust (Δf)</div>
                  <div className="text-sm font-bold text-red-650 font-mono">
                    -{formatDeZahl(predictedStrengthLoss + predictedAirStrengthLoss, 1)} N/mm²
                  </div>
                  <span className="text-xs text-text-main/40 block">(Wasser {formatDeZahl(predictedStrengthLoss, 1)} + Luft {formatDeZahl(predictedAirStrengthLoss, 1)})</span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-home-grau/10">
                  <div className="text-xs text-text-main/50 font-semibold uppercase">Schwinddehnungs-Plus</div>
                  <div className="text-sm font-bold text-purple-700 font-mono">
                    +{formatDeZahl(predictedShrinkageIncrease, 2)} mm/m
                  </div>
                  <span className="text-xs text-text-main/40 block">Erzeugt erhebliche Zusatzrisse</span>
                </div>
              </div>

              {waterAddition >= 20 && (
                <div className="bg-red-900 border border-red-950 text-white rounded-lg p-3 text-xs flex gap-2 items-start mt-4">
                  <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block text-red-200">Nachträgliche Wasserzugabe auf der Baustelle ist unzulässig (DIN 1045-3) – hier nur zur Veranschaulichung.</strong>
                    <ul className="list-disc list-inside space-y-1 text-red-100">
                      <li><strong>Druckfestigkeit:</strong> Fällt um &gt; -8 N/mm² ab. Ein Konformitätstest scheitert fast immer (alle Würfel fallen durch).</li>
                      <li><strong>Wasserläufer &amp; Entmischung:</strong> Sand- und Feinanteile sammeln sich oben, Grobkorn sinkt stark ab.</li>
                      <li><strong>Schwinden &amp; Risse:</strong> Schwindanstieg +0,2 mm/m (deutlich mehr, tiefere und breitere Netzrisse).</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 3: Einbau & Industrieboden */}
      {activeSubTab === 'einbau' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* Card 1: Settingwalkability Calculator */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <Flame size={18} className="text-shiraz" />
              Erstarren &amp; Trittfestigkeit (Faustwerte, Lehrannahme)
            </h3>
            <p className="text-xs text-text-main/80">
              Abschätzung der Erstarrungs- und Walkability-Dauer von üblichen Bauwerksbetonen (w/z um 0.55, CEM I / CEM II 32.5 R / 42.5 N) in Abhängigkeit der Umgebungstemperatur. Base-Richtwert bei 20°C: ca. 4 bis 5 Stunden.
            </p>

            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-text-main">Umgebungstemperatur</span>
                <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(tempWalk)} °C</span>
              </div>
              <input 
                type="range" 
                min="-5" 
                max="35" 
                value={tempWalk} 
                onChange={(e) => setTempWalk(Number(e.target.value))} 
                className="w-full accent-shiraz"
              />
              
              <div className="grid grid-cols-2 gap-2 text-center text-xs mt-2 font-mono">
                <button onClick={() => setTempWalk(30)} className="bg-white p-1 rounded hover:bg-home-grau/10 border border-home-grau/10">30°C (Sommer)</button>
                <button onClick={() => setTempWalk(20)} className="bg-white p-1 rounded hover:bg-home-grau/10 border border-home-grau/10">20°C (Standard)</button>
                <button onClick={() => setTempWalk(10)} className="bg-white p-1 rounded hover:bg-home-grau/10 border border-home-grau/10">10°C (Herbst)</button>
                <button onClick={() => setTempWalk(5)} className="bg-white p-1 rounded hover:bg-home-grau/10 border border-home-grau/10">5°C (Kälte/Winter)</button>
              </div>
            </div>

            <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/10 space-y-2 text-center text-xs">
              <span className="text-xs font-bold uppercase text-shiraz block">Erwartete Dauer bis zur Trittfestigkeit:</span>
              <div className="text-2xl font-bold text-shiraz font-mono">
                {formatDeZahl(calcSettingTimeHours, 1)} Stunden
              </div>
              <p className="text-xs text-text-main/60">
                (Faktor gegenüber Standard-Referenz: {formatDeZahl((walkTimeFactor * 100), 0)}%)
              </p>
            </div>

            {/* Spezifische Erstarrenregeln */}
            <div className="text-xs bg-yellow-50/25 border border-yellow-200/50 p-3 rounded-lg space-y-1">
              <div className="font-bold text-yellow-800">Sollwerte für Temperatur-Verhalten:</div>
              <p className="text-xs text-text-main/85 leading-relaxed">
                • <strong>30°C:</strong> Nur 60% der Zeit (~2,5 h) - Rasantes Vorgehen gefordert!<br />
                • <strong>20°C:</strong> 100% (~4 h)<br />
                • <strong>10°C:</strong> 200% (~8 h) - Verzögertes Ausschalen bedenken.<br />
                • <strong>5°C:</strong> 400% (~16 h) - Frostschutz-Heizung/Matten einplanen.
              </p>
            </div>
          </div>

          {/* Card 2: Einbaufehler & Rassel-Effekte */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <AlertTriangle size={18} className="text-shiraz" />
              Einbau &amp; Verdichtungskonzepte
            </h3>
            
            <p className="text-xs text-text-main/80 leading-relaxed">
              Mangelhafte mechanische Rüttelarbeit führt auch bei dünnflüssigen Konsistenzen (F5) zu Luftporengehalten im Kern von 4% bis 6%.
            </p>

            <div className="space-y-3 text-xs text-text-main/80">
              <div className="p-3 bg-off-white/80 rounded border border-home-grau/15">
                <span className="font-bold text-shiraz block mb-1">Der "Rüttelpatsch-Effekt" bei F5</span>
                Durch das Abziehen mit einer Rüttelpatsche bei weichem Beton wird oft nur die oberste Schicht (ca. 1 cm) hoch verdichtet und versiegelt. Aufsteigendes Blutungswasser sowie feine Verdichtungsblasen sammeln sich dicht darunter:
                <ul className="list-disc list-inside mt-2 space-y-1 ml-1 text-text-main/70 text-xs">
                  <li>Einzelne größere Ansammlungen bilden <strong>Glättblasen</strong> (&lt;10 cm runder Hohlraum).</li>
                  <li>Viele Bläschen bilden dünne, extrem rissanfällige <strong>flächige Hohllagen</strong>.</li>
                </ul>
              </div>

              <div className="p-3 bg-off-white/80 rounded border border-home-grau/15">
                <span className="font-bold text-shiraz block mb-1">Mörtelanreicherung durch Fehlverdichten</span>
                <p className="text-xs leading-relaxed">
                  • <strong>Überrütteln:</strong> Flasche zu lange an einer Position belassen führt zu wasserreichen, labilen Zonen um die Flasche. Risiko für Wasserläufer und Netzrisse.<br />
                  • <strong>Treiben/Fallenlassen:</strong> Das ungleiche Weiterpumpen oder Kippen des Betons führt zum Absieben des Grobkorns. Die mörtelreichen Zonen schwinden und bluten extrem.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Industrieboden-Engineering */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <Wrench size={18} className="text-shiraz" />
              Industrieboden-Datenblatt (C30/37)
            </h3>
            
            <p className="text-xs text-text-main/80">
              Gegenüberstellung des theoretischen DBV-Anforderungsrahmens und des präziseren Krell-Consult Empfehlungskatalogs für makellose Flügelglättung.
            </p>

            <div className="space-y-4">
              <div className="border border-home-grau/30 text-xs rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 font-bold bg-off-white p-2 border-b border-home-grau/30">
                  <span>Parameter</span>
                  <span>DBV Limit</span>
                  <span className="text-shiraz">Krell Empfehlung</span>
                </div>
                
                <div className="grid grid-cols-3 p-2 border-b border-home-grau/10">
                  <span className="font-semibold">Mehlkorn MK</span>
                  <span>360-400 kg/m³</span>
                  <span className="text-shiraz font-bold">~ 360 kg/m³</span>
                </div>

                <div className="grid grid-cols-3 p-2 border-b border-home-grau/10">
                  <span className="font-semibold">Feinstkorn FK</span>
                  <span>≤ 430 kg/m³</span>
                  <span className="text-shiraz font-bold">≤ 430 kg/m³</span>
                </div>

                <div className="grid grid-cols-3 p-2">
                  <span className="font-semibold">Wasser</span>
                  <span>≤ 180 kg/m³</span>
                  <span className="text-shiraz font-bold">165 - 175 kg/m³</span>
                </div>
              </div>

              <div className="bg-red-50 border border-red-150 p-3 rounded-xl text-xs space-y-1.5 leading-relaxed">
                <span className="font-bold text-red-800 block uppercase text-xs">Achtung XM3-Einstreu bei C35/45:</span>
                Die in DIN 1045-2 dargelegte Theorie, XM3-Einstreubaustoffe direkt frisch in einen C35/45 (w/z ≤ 0,45) einzuarbeiten, is <span className="text-red-700 font-bold">baupraktisch nicht realisierbar (XM2-Flügelglatten-Einsatz)</span>.
                <div className="text-xs font-bold text-text-main bg-white p-2 rounded border border-red-200 mt-1.5">
                  Empfehlung: Nachträglicher Verbund-Industrieestrich nach DIN 18560-7 (nicht frisch auf frisch!).
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 5: Nachbehandlung & Betonierbarkeit */}
      {activeSubTab === 'nachbehandlung' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          
          {/* Curing Duration Calculator */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Calendar size={18} className="text-shiraz" />
                Dauer der Mindestnachbehandlung (Tage)
              </h3>
              <p className="text-xs text-text-main/80 font-medium">
                Berechnet die Mindestanzahl an Tagen, an denen der Frischbeton feucht gehalten und geschützt werden muss (nach DIN 1045-3 / DIN EN 13670, ergänzt durch Krell).
              </p>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-4">
                {/* 1. Exposures */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-main block">1. Expositionsklasse &amp; Schutzbedürfnis</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <button aria-pressed={curingExposure === 'x0_xc1'}
                      type="button"
                      onClick={() => setCuringExposure('x0_xc1')}
                      className={`p-2.5 text-xs font-semibold rounded-lg border transition-all ${
                        curingExposure === 'x0_xc1'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-home-grau/5'
                      }`}
                    >
                      X0, XC1 (Trocken / Kein Risiko)
                    </button>
                    <button aria-pressed={curingExposure === 'standard'}
                      type="button"
                      onClick={() => setCuringExposure('standard')}
                      className={`p-2.5 text-xs font-semibold rounded-lg border transition-all ${
                        curingExposure === 'standard'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-home-grau/5'
                      }`}
                    >
                      Alle übrigen Klassen
                    </button>
                    <button aria-pressed={curingExposure === 'erhoeht'}
                      type="button"
                      onClick={() => setCuringExposure('erhoeht')}
                      className={`p-2.5 text-xs font-semibold rounded-lg border transition-all ${
                        curingExposure === 'erhoeht'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-home-grau/5'
                      }`}
                    >
                      XM (Verschleiß)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 2. Festigkeitsentwicklung */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-main block">2. Festigkeitsentwicklung (r-Wert)</label>
                    <select aria-label="2. Festigkeitsentwicklung (r-Wert)"
                      value={curingStrength}
                      onChange={(e) => setCuringStrength(e.target.value as any)}
                      className="w-full text-xs p-2 border border-home-grau/30 rounded"
                    >
                      <option value="schnell">Schnell (r ≥ 0,50)</option>
                      <option value="mittel">Mittel (r ≥ 0,30)</option>
                      <option value="langsam">Langsam (r ≥ 0,15)</option>
                      <option value="sehr_langsam">Sehr langsam (r &lt; 0,15)</option>
                    </select>
                    <span className="text-xs text-text-main/50 block">Abhängig von Zementsorte und w/z-Wert.</span>
                  </div>

                  {/* 3. Witterung/Temperatur */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-main block">3. Bauteiloberflächentemperaturen</label>
                    <select aria-label="3. Bauteiloberflächentemperaturen"
                      value={curingTemp}
                      onChange={(e) => setCuringTemp(e.target.value as any)}
                      className="w-full text-xs p-2 border border-home-grau/30 rounded"
                    >
                      <option value="5_9">5 °C bis 9 °C (Winterlich kühl)</option>
                      <option value="10_14">10 °C bis 14 °C (Übergangszeit)</option>
                      <option value="15_24">15 °C bis 24 °C (Standardklima)</option>
                      <option value="ge_25">≥ 25 °C (Sommerliche Wärme)</option>
                    </select>
                    <span className="text-xs text-text-main/50 block">Wichtig: Kerntemperatur soll stets über 5 °C liegen.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated outputs */}
            <div className="pt-4 space-y-4">
              <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/15 text-center space-y-1">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Mindestdauer der Nachbehandlung:</span>
                <div className="text-xl font-bold text-shiraz font-mono leading-tight">
                  {curingExposure === 'x0_xc1' ? (
                    <span className="text-xs block py-1 font-semibold">Mindestens 0,5 Tage (12 Stunden), DIN 1045-3</span>
                  ) : (
                    <span>
                      {curingExposure === 'erhoeht' 
                        ? `${(curingTable[curingTemp]?.[curingStrength] || 1) * 2} Tage`
                        : `${curingTable[curingTemp]?.[curingStrength] || 0} Tage`
                      }
                    </span>
                  )}
                </div>
                {curingExposure === 'erhoeht' && (
                  <span className="text-xs text-red-700 font-semibold block">
                    (XM: doppelte Dauer nach DIN 1045-3)
                  </span>
                )}
              </div>

              <p className="text-xs text-text-main/70">
                Werte nach DIN 1045-3 (Tabelle Mindestdauer der Nachbehandlung). Ausführlich im Modul Nachbehandlung.
              </p>
            </div>
          </div>

          {/* Aggregate / Clearance Card */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Sliders size={18} className="text-shiraz" />
                Betonierbarkeit vs. Größtkorn
              </h3>
              <p className="text-xs text-text-main/80">
                Zur Verhinderung von Kiesnestern und fehlerhaften Hohlräumen muss der lichte Abstand zwischen Bewehrungsmatten bzw. Schalen auf das maximale Gesteinskorn abgestimmt sein.
              </p>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3">
                <label className="text-xs font-bold text-text-main block">Selektiertes Größtkorn der Gesteinskörnung:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[8, 16, 32].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setGroesstkorn(size as any)}
                      className={`py-2 px-3 text-xs font-mono font-bold rounded-lg border transition-all ${
                        groesstkorn === size
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-home-grau/5'
                      }`}
                    >
                      GK {formatDeWert(size)} mm
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive dimensional infographic visualizer */}
              <div className="border border-home-grau/15 p-4 rounded-xl bg-gradient-to-b from-white to-home-grau/5 flex flex-col items-center">
                <div className="w-full flex items-center justify-between px-2 mb-2">
                  <span className="text-xs uppercase font-mono font-bold text-text-main/50">Infografik: Reibungsloser Durchfluss</span>
                  <span className="text-xs font-bold text-shiraz font-mono">Min. lichte Weite: {groesstkorn === 8 ? '12 cm' : groesstkorn === 16 ? '14 cm' : '18 cm'}</span>
                </div>
                
                {/* Visual grid rendering of rebars */}
                <div className="w-full h-24 bg-off-white rounded-lg relative overflow-hidden flex items-center justify-center border border-home-grau/10">
                  {/* Left rebar */}
                  <div className="w-4 h-full bg-slate-400 absolute left-8 border-r border-home-grau/30 shadow-sm flex items-center justify-center">
                    <div className="w-full h-full bg-repeat-y opacity-30" style={{ backgroundImage: 'linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.15) 55%, transparent 60%)', backgroundSize: '100% 12px' }}></div>
                  </div>
                  {/* Right rebar */}
                  <div className="w-4 h-full bg-slate-400 absolute right-8 border-l border-home-grau/30 shadow-sm flex items-center justify-center">
                    <div className="w-full h-full bg-repeat-y opacity-30" style={{ backgroundImage: 'linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.15) 55%, transparent 60%)', backgroundSize: '100% 12px' }}></div>
                  </div>

                  {/* Flow dimension arrow */}
                  <div className="absolute left-12 right-12 h-0.5 bg-red-400 flex items-center justify-between px-1">
                    <span className="text-xs text-red-650 bg-white px-2 py-0.5 rounded border border-red-200 leading-none -mt-3.5 font-bold font-mono">
                      {groesstkorn === 8 ? '≥ 12 cm' : groesstkorn === 16 ? '≥ 14 cm' : '≥ 18 cm'}
                    </span>
                  </div>

                  {/* Simulated bouncing aggregate shapes to demonstrate size clearance */}
                  <div className="flex gap-2 justify-center z-10 transition-all duration-350">
                    <div className={`rounded-full bg-stone-500 border border-stone-400 shadow-inner ${groesstkorn === 8 ? 'w-4 h-4' : groesstkorn === 16 ? 'w-6 h-6' : 'w-9 h-9'}`}></div>
                    <div className={`rounded-full bg-stone-700 border border-stone-600 shadow-inner mt-2 ${groesstkorn === 8 ? 'w-3 h-3' : groesstkorn === 16 ? 'w-4 h-4' : 'w-7 h-7'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aggregate Notes */}
            <div className="bg-shiraz/5 border border-shiraz/10 rounded-lg p-3.5 text-xs space-y-1.5 mt-2">
              <div className="font-bold text-shiraz flex items-center gap-1">
                <Info size={14} />
                Regelwerks-Handkarte Zusatzhinweis:
              </div>
              <ul className="list-disc list-inside text-xs text-text-main/80 space-y-1">
                <li><strong>Anschlussmischung:</strong> Bei wandständigen Betonarbeiten Anschlussmischung mit maximal 8 mm Größtkorn vorsehen!</li>
                <li><strong>Spezialregel WU:</strong> Bei Elementwänden oder dünnen WU-Wänden ist das Gesteins-Größtkorn zwingend auf ≤ 16 mm zu begrenzen.</li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 6: WU-Richtlinie (Expositionsklassen nur als Kurzkarte, AP 3.9) */}
      {activeSubTab === 'krell_tabelle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          
          {/* Expositionsklassen: eine Quelle (AP 3.9) – hier nur die Kurzkarte */}
          <div className="lg:col-span-12">
            <ExpositionsKurzkarte hinweis="Die Grenzwerte je Expositionsklasse (max. w/z, Mindestfestigkeit, Mindestzementgehalt, Luftporen), die zugehörige Betondeckung und die Erleichterungen nach DIN 1045-2 werden ausschließlich im Modul Expositionsklassen gepflegt. Für die WU-Planung unten ist vor allem der Zusammenhang mit dem w/z-Wert wichtig." />
          </div>

          {/* WU-Richtlinie section */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-12">
            <div className="flex items-center gap-3 pb-2 border-b border-home-grau/10">
              <div className="w-8 h-8 bg-sky-500 text-white rounded-lg flex items-center justify-center">
                <Droplets size={16} />
              </div>
              <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  WU-Richtlinie: Empfohlene Mindestdicken für w/z ≤ 0,55
                </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Vorgeschriebene mechanische Grenzmaße zur Wasserdichtigkeit flächiger Betonbauteile nach Dr. Krell Regelwerk.
          </p>
        </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Selectors */}
              <div className="space-y-3 bg-off-white p-4 rounded-xl border border-home-grau/30 text-xs">
                {/* Member */}
                <div className="space-y-1 row-span-1">
                  <label className="font-bold text-text-main">Auszuführendes Bauteil:</label>
                  <div className="flex gap-1">
                    {[
                      { id: 'waende', label: 'Wände' },
                      { id: 'bodenplatte', label: 'Bodenplatte' },
                      { id: 'daech', label: 'Dächer' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWuBauteil(item.id as any)}
                        className={`flex-1 py-1.5 px-2 font-semibold text-center text-xs rounded transition-all ${
                          wuBauteil === item.id
                            ? 'bg-shiraz text-white'
                            : 'bg-white hover:bg-slate-50 text-text-main/70 border border-home-grau/15 animate-in'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Class */}
                <div className="space-y-1">
                  <label className="font-bold text-text-main">Beanspruchungs-Gruppe (BK):</label>
                  <div className="flex gap-1">
                    {[
                      { id: 'bk1', label: 'BK 1 (Drückend)' },
                      { id: 'bk2', label: 'BK 2 (Feucht)' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWuBk(item.id as any)}
                        className={`flex-1 py-1.5 px-2 font-semibold text-center text-xs rounded transition-all ${
                          wuBk === item.id
                            ? 'bg-shiraz text-white'
                            : 'bg-white hover:bg-slate-50 text-text-main/70 border border-home-grau/15 animate-in'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-text-main/50 block mt-1">BK 1: Drückendes und aufstauendes Wasser | BK 2: Natürliche Bodenfeuchtigkeit, Sickerwasser.</span>
                </div>

                {/* Bauweise */}
                <div className="space-y-1">
                  <label className="font-bold text-text-main">Bauverfahren / Konstruktionsweise:</label>
                  <div className="flex gap-1">
                    {[
                      { id: 'ortbeton', label: 'Ortbeton' },
                      { id: 'element', label: 'Elementwand' },
                      { id: 'fertigteil', label: 'Fertigteil' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWuBauweise(item.id as any)}
                        className={`flex-1 py-1.5 px-1 font-semibold text-center text-xs rounded transition-all ${
                          wuBauweise === item.id
                            ? 'bg-shiraz text-white'
                            : 'bg-white hover:bg-slate-50 text-text-main/70 border border-home-grau/15 animate-in'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Outputs display */}
              <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                {(() => {
                  const result = getWuMindestdicke();
                  return (
                    <div className="bg-sky-50/40 border border-sky-150 p-4 rounded-xl flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-xs uppercase font-bold text-sky-800 tracking-wider block">Empfehlung der WU-Richtlinie</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-sky-900 font-mono">{result.dicke > 0 ? `${formatDeWert(result.dicke)} mm` : '—'}</span>
                          {result.core && (
                            <span className="text-sm text-sky-700 font-semibold font-mono">({formatDeWert(result.core)} mm Kernbeton)</span>
                          )}
                        </div>
                        <p className="text-xs text-text-main/80 mt-1 leading-relaxed font-semibold">{result.comment}</p>
                      </div>

                      <div className="text-xs text-text-main/60 bg-white p-2 border border-sky-100 rounded mt-3.5 leading-normal">
                        <strong>Ecke-Ausnahme (Fußnote 1):</strong> Unter Anwendung strenger Qualitätssicherungen und riss-beschränkender Bewehrungsverfahren kann Ortbeton bei BK 2 baustellenspezifisch auf bis zu <strong>200 mm</strong> reduziert werden.
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 4: ID-Prüfung & Bohrkerne */}
      {activeSubTab === 'festigkeit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          
          {/* Bohrkernprüfungs-Rechner */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Layers size={18} className="text-shiraz" />
                Bohrkern-Prüfungsrechner (DIN EN 13791:2020-02)
              </h3>
              
              <p className="text-xs text-text-main/80">
                Konformitäts- und Beständigkeitskontrollen an Bestandsbauteilen mittels mechanischer Entnahme von Bohrkernen (BK).
              </p>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-main block">Nominale Festigkeit f_ck</label>
                  <select aria-label="Nominale Festigkeit f_ck" 
                    value={fck} 
                    onChange={(e) => setFck(Number(e.target.value))} 
                    className="w-full text-xs p-2 border border-home-grau/30 rounded"
                  >
                    <option value={20}>C20/25 (fck=20)</option>
                    <option value={25}>C25/30 (fck=25)</option>
                    <option value={30}>C30/37 (fck=30)</option>
                    <option value={35}>C35/45 (fck=35)</option>
                    <option value={40}>C40/50 (fck=40)</option>
                    <option value={45}>C45/55 (fck=45)</option>
                    <option value={50}>C50/60 (fck=50)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-main block">Betonvolumen (Baustelle)</label>
                  <div className="relative">
                    <input aria-label="Betonvolumen (Baustelle)" 
                      type="number" min="0" 
                      value={concreteVol} 
                      onChange={(e) => setConcreteVol(Number(e.target.value))} 
                      className="w-full text-xs p-2 border border-home-grau/30 rounded pr-8"
                    />
                    <span className="absolute right-2 top-2 text-xs text-home-grau font-bold">m³</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-main block">Kerne insgesamt</label>
                  <select aria-label="Kerne insgesamt" 
                    value={coresTested} 
                    onChange={(e) => setCoresTested(Number(e.target.value))} 
                    className="w-full text-xs p-2 border border-home-grau/30 rounded"
                  >
                    <option value={2}>2 bis 4 Kerne</option>
                    <option value={5}>5 bis 6 Kerne</option>
                    <option value={7}>7+ Kerne (Statistisch)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <span className="text-xs font-bold text-text-main/80 uppercase block">Anforderungen an Bohrkern-Einzelwerte:</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-home-grau/15 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-shiraz">1. Ungünstigster Einzelwert BK_min</span>
                    <p className="text-xs text-text-main/60 mt-0.5">Kleinster Einzelwert der Bohrkerndruckfestigkeit (Druckprüfung am Bohrkern nach DIN EN 12504-1, umgerechnet auf den Referenzkörper)., ermittelt an der schwächsten Stelle.</p>
                  </div>
                  <div className="mt-3">
                    <span className="text-xs text-text-main/50 font-bold font-mono">Formel: ≥ 0,85 * (f_ck - 4)</span>
                    <div className="text-lg font-bold text-shiraz font-mono mt-1">≥ {formatDeZahl(reqBkMin, 2)} N/mm²</div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-home-grau/15 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-shiraz">2. Mittelwert f_m(n),is</span>
                    <p className="text-xs text-text-main/60 mt-0.5">Mittelwert-Anforderung basierend auf der Bohrkernanzahl.</p>
                  </div>
                  <div className="mt-3">
                    <span className="text-xs text-text-main/50 font-bold font-mono mb-1 block">
                      {coresTested <= 4 ? 'Für 2-4 Kerne: ≥ 0.85 * (f_ck + 1)' : 'Für 5-6 Kerne: ≥ 0.85 * (f_ck + 2)'}
                    </span>
                    <div className="text-lg font-bold text-shiraz font-mono">≥ {formatDeZahl(reqBkMedian, 2)} N/mm²</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-250 text-xs text-yellow-900 leading-relaxed">
                <strong>Hinweis:</strong> Anzahl und Lage der Bohrkerne legen Sie nach DIN EN 13791:2020-02 fest (Kriterien manuell prüfen).
              </div>
            </div>
          </div>

          {/* TB-Werk vs Baustelle */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <BookOpen size={18} className="text-shiraz" />
                Festigkeits-Konformitätsprüfungen
              </h3>
              
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-2">
                  <span className="font-bold text-shiraz text-xs flex items-center gap-1">
                    <ChevronRight size={14} />
                    Transportbetonwerk (TB-Werk)
                  </span>
                  <p className="text-xs text-text-main/80 block leading-relaxed font-mono">
                    <strong>Konformitätsnachweis standard:</strong> <br />
                    Mittelwert von 3 Probekörpern (3er-Mittel): <br />
                    <span className="text-shiraz font-bold">f_ci,3 ≥ f_ck + 4 N/mm²</span> <br />
                    Oder fortlaufend über das statistische 15er-Mittel nach DIN EN 206.
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-2">
                  <span className="font-bold text-shiraz text-xs flex items-center gap-1">
                    <ChevronRight size={14} />
                    Baustellen-Identitätsprüfung (Annahme)
                  </span>
                  <div className="text-xs text-text-main/80 leading-relaxed font-mono space-y-1">
                    <p>Zweck: Zweifelsfreie Klärung der Betonlieferungs-Identität vor Ort.</p>
                    <p>• <strong>3er- bis 4er-Mittel:</strong> f_ci ≥ f_ck + 1 N/mm²</p>
                    <p>• <strong>5er- bis 6er-Mittel:</strong> f_ci ≥ f_ck + 2 N/mm²</p>
                    <p>• <strong>Ab 7 Werte:</strong> Statistische Gesamtauswertung zulässig.</p>
                    <p className="text-red-700 bg-red-50 text-xs p-2 rounded leading-normal border border-red-100 font-sans font-bold">
                      Jeder einzelne Probekörper-Einzelwert muss zwingend ≥ (f_ck - 4) N/mm² sein!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-home-grau/15 text-xs text-text-main/60 flex items-start gap-1.5">
              <Info size={15} className="text-shiraz flex-shrink-0 mt-0.5" />
              <span>Vergiss beim Bohrkern-Ausbau nicht den sofortigen sorgfältigen Verschluss der Bohrlöcher und die Protokollierung der Festbetonrohdichten.</span>
            </div>
          </div>

        </div>
      )}
      </ModuleTabs>

      <ConcreteThematicLinks current="baustoff" />

      {/* Module Footer standard integration */}
      <ModulTest moduleId="betonpraxis" />

      <ModuleFooter 
        weblinks={[
          { title: 'Beton.org: Planungshilfen und Zement-Merkblätter', url: 'https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/' },
          { title: 'Beton.wiki: Praxiswissen Beton', url: 'https://beton.wiki/' }
        ]}
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Expositionsklasse', url: 'https://de.wikipedia.org/wiki/Expositionsklasse' }
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton: Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN EN 13670:2011-03 / DIN 1045-3:2023-08 (Ausführung von Tragwerken aus Beton - Nachbehandlung und Einbau)' },
          { title: 'DIN 1045-1000:2023-08 (Zusammenarbeit bei Planung, Herstellung und Bauausführung - BBQ)' },
          { title: 'DIN EN 13791:2020-02 (Bewertung der Druckfestigkeit von Beton in Bauwerken oder in Bauwerksteilen)' },
          { title: 'DIN EN 12504-1 (Prüfung von Beton in Bauwerken – Bohrkernproben)' },
          { title: 'DAfStb-Richtlinie Wasserundurchlässige Bauwerke aus Beton (WU-Richtlinie), Ausgabe 2017-12' },
          { title: 'DIN EN 1992-1-1/NA:2013-04 (Betondeckung, Tab. 4.4DE)' },
          { title: 'DBV-Merkblätter: Sichtbeton (2015), Industrieböden, Betondeckung (Deutscher Beton- und Bautechnik-Verein E.V.)', url: 'https://www.betonverein.de/' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Verein Deutscher Zementwerke (VDZ): Zement-Taschenbuch (51. Ausgabe 2008, Verlag Bau+Technik)'
        ]}
        formeln={[
          {
            formel: 'K = \\frac{w - 70}{MK}',
            erklaerung: 'Praxis-Kennwert für den Zusammenhalt nach Krell (keine Normgröße): w Wassergehalt, MK Mehlkorngehalt in kg/m³; Richtwert für das Bluten bei etwa 20 °C.',
            quelle: 'Krell (2022)'
          }
        ]}
      />
    </div>
  );
}
