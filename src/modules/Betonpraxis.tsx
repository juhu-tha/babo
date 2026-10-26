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
import inhalt from '@/content/betonpraxis/Betonpraxis.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadBetonIm} /></h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5"><MdText text={inhalt.texte.wechselnSieNahtlosZwischen} /></p>
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
            <span><MdText text={inhalt.texte.t1BetontechnologiePraxis} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.expositionsklassenKonfiguratorNachbehand} /></span>
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
            <span><MdText text={inhalt.texte.t2BetonzulassungBauprodukt} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.transportVsBaustellenbetonWpk} /></span>
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
            <span><MdText text={inhalt.texte.t3DauerhaftigkeitSchäden} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.karbonatisierungFrostTausalzAngriff} /></span>
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
    kResultText = inhalt.werte.sehrKlebrigKaumBis;
    kResultClass = 'bg-yellow-50 text-yellow-800 border-yellow-200';
    kAdvice = inhalt.werte.derBetonKlebtStark;
  } else if (kValue <= 0.27) {
    kResultText = inhalt.werte.klebendGeringesBluten0;
    kResultClass = 'bg-green-50 text-green-800 border-green-200';
    kAdvice = inhalt.werte.betonHatEinVermindertes;
  } else if (kValue <= 0.31) {
    kResultText = inhalt.werte.normalesZusammenhaltevermögen030;
    kResultClass = 'bg-sky-50 text-sky-800 border-sky-100';
    kAdvice = inhalt.werte.üblichesBlutenVonCa;
  } else if (kValue <= 0.34) {
    kResultText = inhalt.werte.mäßigeWasseranreicherungObenNormal;
    kResultClass = 'bg-orange-50 text-orange-800 border-orange-200';
    kAdvice = inhalt.werte.mäßigeBisDeutlicheWasserbewegung;
  } else {
    kResultText = inhalt.werte.deutlichesBlutenLäuftStark;
    kResultClass = 'bg-red-50 text-red-800 border-red-200';
    kAdvice = inhalt.werte.erheblicheGefahrEinerUnkontrollierten;
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
        if (wuBauweise === 'ortbeton') return inhalt.daten.getWuMindestdicke;
        if (wuBauweise === 'element') return inhalt.daten.getWuMindestdicke_2;
        return { dicke: 200, comment: inhalt.werte.fertigteilwandBeanspruchungsklasse1 };
      } else { // BK2
        if (wuBauweise === 'ortbeton') return inhalt.daten.getWuMindestdicke_3;
        if (wuBauweise === 'element') return inhalt.daten.getWuMindestdicke_4;
        return { dicke: 100, comment: inhalt.werte.fertigteilwandBeanspruchungsklasse2 };
      }
    } else if (wuBauteil === 'bodenplatte') {
      if (wuBk === 'bk1') {
        if (wuBauweise === 'ortbeton') return { dicke: 250, comment: inhalt.werte.ortbetonBodenplatteBeanspruchungsklasse1 };
        if (wuBauweise === 'element') return inhalt.daten.getWuMindestdicke_5;
        return { dicke: 200, comment: inhalt.werte.fertigteilBodenplatteBeanspruchungsklass };
      } else { // BK2
        if (wuBauweise === 'ortbeton') return { dicke: 150, comment: inhalt.werte.ortbetonBodenplatteBeanspruchungsklasse2 };
        if (wuBauweise === 'element') return inhalt.daten.getWuMindestdicke_6;
        return { dicke: 100, comment: inhalt.werte.fertigteilBodenplatteBeanspruchungsklass2 };
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
          <ClipboardCheck className="text-shiraz" /><MdText text={inhalt.texte.betonpraxisNachDrKrell} /><span className="text-xs bg-shiraz/10 text-shiraz font-mono font-bold px-2 py-0.5 rounded"><MdText text={inhalt.texte.regelwerkHandkarteAnhang} /></span>
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.praxisnaheTippsGrenzwerteRegelwerks} /></p>
        </div>
      </div>

      {/* Sub tabs navigation (AP 3.8: ARIA-Reiter, 6 Bereiche) */}
      <ModuleTabs
        label={inhalt.werte.bereicheBetonpraxis}
        tabs={[
          { id: 'diagnostik' as const, label: 'Frischbeton-Diagnostik', icon: Beaker },
          { id: 'zusammenhalt' as const, label: inhalt.werte.zusammenhaltWasserSim, icon: Droplets },
          { id: 'einbau' as const, label: inhalt.werte.einbauIndustrieboden, icon: Wrench },
          { id: 'nachbehandlung' as const, label: inhalt.werte.nachbehandlungBetonierbarkeit, icon: Calendar },
          { id: 'krell_tabelle' as const, label: inhalt.werte.wuRichtlinieExpositionen, icon: Grid },
          { id: 'festigkeit' as const, label: inhalt.werte.idPrüfungBohrkerne, icon: Activity }
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
              <Compass size={18} className="text-shiraz" /><MdText text={inhalt.texte.beobachtungenÜberDieNorm} /></h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-off-white rounded-lg border border-home-grau/15 space-y-2">
                <span className="text-xs font-bold uppercase text-shiraz block"><MdText text={inhalt.texte.ausbreitmaßBeobachten} /></span>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.beimMessenDesAusbreitmaßes} /></p>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-1 pl-1">
                  <li><MdText text={inhalt.texte.wasserOderLeimrandOptimal} /><span className="text-shiraz font-bold"><MdText text={inhalt.texte.keinOderMaximal3} /></span><MdText text={inhalt.texte.randEinGrößererRand} /></li>
                  <li><MdText text={inhalt.texte.grobkornverteilungKeineAnreicherungVon} /></li>
                </ul>
              </div>

              <div className="p-4 bg-off-white rounded-lg border border-home-grau/15 space-y-2">
                <span className="text-xs font-bold uppercase text-shiraz block"><MdText text={inhalt.texte.dasAusbreitmaßKlassenarchiv} /></span>
                <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.dieStandardisiertenKonsistenzklassenNach} /></p>
                <div className="grid grid-cols-2 gap-1 text-xs font-mono mt-1">
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded"><MdText text={inhalt.texte.f1340MmSteif} /></div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded"><MdText text={inhalt.texte.f2350410Plastisch} /></div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded"><MdText text={inhalt.texte.f3420480Weich} /></div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded"><MdText text={inhalt.texte.f4490550Sehr} /></div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded"><MdText text={inhalt.texte.f5560620Fließfähig} /></div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded"><MdText text={inhalt.texte.f6630700Sehr} /></div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded col-span-2 text-center text-shiraz font-bold"><MdText text={inhalt.texte.svb700MmSelbstverdichtend} /></div>
                </div>
              </div>
            </div>

            {/* Spezieller Test: Rütteln im Eimer */}
            <div className="p-4 bg-shiraz/5 border border-shiraz/10 rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-text-main flex items-center gap-1.5">
                <Sparkles size={16} className="text-shiraz animate-pulse" /><MdText text={inhalt.texte.spezialtestOberflächenbeurteilungIm10} /></h4>
              <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.zurSchnellenUntersuchungDer} /></p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <div className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.t1Versuchsaufbau} /></div><MdText text={inhalt.texte.einenStandardmäßigen10L} /></div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <div className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.t2Blasenaufstieg} /></div><MdText text={inhalt.texte.bestimmenSieDieAufstiegsdauer} /></div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <div className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.t3Fingertest} /></div><MdText text={inhalt.texte.nach30SekRütteln} /><span className="font-bold text-red-600">3 mm</span><MdText text={inhalt.texte.bestehtAkuteEntmischungsgefahr} /></div>
              </div>

              <div className="bg-red-50/50 p-2.5 rounded border border-red-200/50 flex gap-2 items-start mt-2">
                <AlertTriangle size={15} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-900"><MdText text={inhalt.texte.folgeVonZuViel} /></div>
              </div>
            </div>
          </div>

          {/* Column 3: Rohdichte & Luftgehalt */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <Layers size={18} className="text-shiraz" /><MdText text={inhalt.texte.dichteLuftgehalt} /></h3>

            {/* Rohdichte-Bewertung */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-text-main/60 block"><MdText text={inhalt.texte.frischbetonrohdichteBewerten} /></span>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.vergleichenSieDieGemessene} /></p>
              
              <div className="space-y-1.5 text-xs">
                <div className="bg-red-50 border border-red-100 p-2.5 rounded">
                  <span className="font-bold text-red-800 block"><MdText text={inhalt.texte.abweichung002Kg} /></span><MdText text={inhalt.texte.hinweisAufEineÜberverdichtung} /></div>
                <div className="bg-orange-50 border border-orange-100 p-2.5 rounded">
                  <span className="font-bold text-orange-850 block"><MdText text={inhalt.texte.abweichung002Kg2} /></span><MdText text={inhalt.texte.gefahrVonErhöhterPorosität} /><span className="font-bold"><MdText text={inhalt.texte.t10LMLuft} /></span><MdText text={inhalt.texte.oderAlternativ} /><span className="font-bold"><MdText text={inhalt.texte.t15KgMUnzulässigem} /></span>.
                </div>
              </div>
            </div>

            {/* Luftgehalt */}
            <div className="p-3 bg-yellow-50/20 border border-yellow-200/50 rounded-lg space-y-2">
              <span className="text-xs font-bold uppercase text-yellow-800 block"><MdText text={inhalt.texte.luftgehaltBestimmen} /></span>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.selbstOhneLuftporenBildner} /></p>
              <div className="text-xs text-text-main/70 bg-white p-2 rounded border border-home-grau/10"><MdText text={inhalt.texte.achtungBetoneMitGeringem} /></div>
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
                <Activity size={18} className="text-shiraz" /><MdText text={inhalt.texte.kennwertZusammenhaltW70} /></h3>
              
              <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.gibtAufschlussÜberDas} /></p>

              <div className="space-y-3 bg-off-white p-4 rounded-xl border border-home-grau/30">
                {/* Inputs */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="font-semibold text-text-main"><MdText text={inhalt.texte.wassergehaltW} /></label>
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
                    <label className="font-semibold text-text-main"><MdText text={inhalt.texte.mehlkornMkPartikel0} /></label>
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
                  <span className="text-xs text-text-main/50 block"><MdText text={inhalt.texte.beinhaltetZementFlugascheKalksteinmehl} /></span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-home-grau/10">
                  <input 
                    type="checkbox" 
                    id="slow_hydr" 
                    checked={slowHydration}
                    onChange={(e) => setSlowHydration(e.target.checked)}
                    className="rounded text-shiraz focus:ring-shiraz"
                  />
                  <label htmlFor="slow_hydr" className="text-xs font-semibold text-text-main/80 cursor-pointer"><MdText text={inhalt.texte.späteGefügebildungKaltesWetter} /></label>
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
                <span className="font-bold uppercase tracking-wider block text-xs"><MdText text={inhalt.texte.diagnoseFrischbeton} /><ConceptTooltip termKey="bluten" fallbackText="Blutungsneigung" />):
                </span>
                <p className="font-bold">{kResultText}</p>
                <p className="leading-relaxed opacity-90 mt-1">{kAdvice}</p>
                {slowHydration && (
                  <div className="mt-2 text-xs bg-white/50 p-1.5 rounded border border-current opacity-80"><MdText text={inhalt.texte.achtungZusatzfaktorDurchVerzögerer} /></div>
                )}
              </div>

              {/* Formel-Herleitungs-Box für das Zusammenhaltevermögen */}
              <FormulaDerivationBox
                title={inhalt.werte.herleitungZusammenhaltevermögenKWert}
                zielGleichung="k = \frac{w - 70}{mk} \le 0{,}30"
                normQuelle={inhalt.werte.dbvMerkblattFrischbetonWalz}
                ergebnisHinweis={`Aktueller Rechenwert: k = ${formatDeZahl(kValue, 3)} bei w = ${calcW} l/m³ und mk = ${calcMK} kg/m³`}
                schritte={[
                  {
                    titel: inhalt.werte.t1WirksamenWassergehaltW,
                    erklaerung: inhalt.werte.gesamtwasserAbzüglichDerEigenfeuchte,
                    formel: `w = ${calcW}\\text{ l/m}^3`,
                    einheit: "l/m³"
                  },
                  {
                    titel: inhalt.werte.t2MehlkorngehaltMkBilanzieren,
                    erklaerung: inhalt.werte.summeAusZementZ,
                    formel: `mk = z + f_{\\text{Zusatz}} + g_{<0{,}125} = ${calcMK}\\text{ kg/m}^3`,
                    einheit: "kg/m³"
                  },
                  {
                    titel: inhalt.werte.t3ÜberschusswasserQuotientBerechnen,
                    erklaerung: inhalt.werte.dieEmpirischeKonstante70,
                    formel: `k = \\frac{${formatDeTeXWert(calcW)} - 70}{${formatDeTeXWert(calcMK)}} = \\frac{${formatDeTeXWert(calcW - 70)}}{${formatDeTeXWert(calcMK)}} = ${formatDeZahl(kValue, 3)}`,
                    einheit: "[-]"
                  },
                  inhalt.daten["Betonpraxis.schritte.3"]
                ]}
              />
            </div>
          </div>

          {/* Card 2: Site Water addition Simulator */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Sliders size={18} className="text-shiraz" /><MdText text={inhalt.texte.interaktiverBaustellenWasserLuftmengen} /></h3>
              <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.gebenSieUnerlaubteWasserzugaben} /></p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50/20 p-4 rounded-xl border border-red-100 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-red-800 uppercase block"><MdText text={inhalt.texte.extraWasserAufDer} /></span>
                    <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.zusatzwasserVerändertDenW} /></p>
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
                      ><MdText text={inhalt.texte.setzenSie20L} /></button>
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
                    <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.jedesZusätzlicheProzentPorenluft} /></p>
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
              <span className="text-xs font-bold text-text-main/80 uppercase block mb-3 border-b border-home-grau/10 pb-1"><MdText text={inhalt.texte.simuliertesResultatKombinierteDefizite} /></span>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-home-grau/10">
                  <div className="text-xs text-text-main/50 font-semibold uppercase">Ausbreitmaß-Änderung</div>
                  <div className="text-sm font-bold text-green-700 font-mono">
                    +{formatDeZahl(predictedFlowIncrease, 0)} mm
                  </div>
                  <span className="text-xs text-text-main/40 block"><MdText text={inhalt.texte.flüssigerKonsistenzfluss} /></span>
                </div>
                
                <div className="bg-white p-2.5 rounded-lg border border-home-grau/10">
                  <div className="text-xs text-text-main/50 font-semibold uppercase"><MdText text={inhalt.texte.freigesetztesBlutungswasser} /></div>
                  <div className="text-sm font-bold text-orange-700 font-mono">
                    {formatDeZahl(waterBleedingOut, 1)} l/m³
                  </div>
                  <span className="text-xs text-text-main/40 block"><MdText text={inhalt.texte.trittAlsOberflächenwasserAus} /></span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-home-grau/10">
                  <div className="text-xs text-text-main/50 font-semibold uppercase"><MdText text={inhalt.texte.druckfestigkeitsverlustF} /></div>
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
                  <span className="text-xs text-text-main/40 block"><MdText text={inhalt.texte.erzeugtErheblicheZusatzrisse} /></span>
                </div>
              </div>

              {waterAddition >= 20 && (
                <div className="bg-red-900 border border-red-950 text-white rounded-lg p-3 text-xs flex gap-2 items-start mt-4">
                  <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block text-red-200"><MdText text={inhalt.texte.nachträglicheWasserzugabeAufDer} /></strong>
                    <ul className="list-disc list-inside space-y-1 text-red-100">
                      <li><MdText text={inhalt.texte.druckfestigkeitFälltUm8} /></li>
                      <li><MdText text={inhalt.texte.wasserläuferEntmischungSandUnd} /></li>
                      <li><MdText text={inhalt.texte.schwindenRisseSchwindanstieg0} /></li>
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
              <Flame size={18} className="text-shiraz" /><MdText text={inhalt.texte.erstarrenTrittfestigkeitFaustwerteLehran} /></h3>
            <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.abschätzungDerErstarrungsUnd} /></p>

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
                <button onClick={() => setTempWalk(30)} className="bg-white p-1 rounded hover:bg-home-grau/10 border border-home-grau/10"><MdText text={inhalt.texte.t30CSommer} /></button>
                <button onClick={() => setTempWalk(20)} className="bg-white p-1 rounded hover:bg-home-grau/10 border border-home-grau/10"><MdText text={inhalt.texte.t20CStandard} /></button>
                <button onClick={() => setTempWalk(10)} className="bg-white p-1 rounded hover:bg-home-grau/10 border border-home-grau/10"><MdText text={inhalt.texte.t10CHerbst} /></button>
                <button onClick={() => setTempWalk(5)} className="bg-white p-1 rounded hover:bg-home-grau/10 border border-home-grau/10"><MdText text={inhalt.texte.t5CKälteWinter} /></button>
              </div>
            </div>

            <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/10 space-y-2 text-center text-xs">
              <span className="text-xs font-bold uppercase text-shiraz block"><MdText text={inhalt.texte.erwarteteDauerBisZur} /></span>
              <div className="text-2xl font-bold text-shiraz font-mono">
                {formatDeZahl(calcSettingTimeHours, 1)} Stunden
              </div>
              <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.faktorGegenüberStandardReferenz} />{formatDeZahl((walkTimeFactor * 100), 0)}%)
              </p>
            </div>

            {/* Spezifische Erstarrenregeln */}
            <div className="text-xs bg-yellow-50/25 border border-yellow-200/50 p-3 rounded-lg space-y-1">
              <div className="font-bold text-yellow-800"><MdText text={inhalt.texte.sollwerteFürTemperaturVerhalten} /></div>
              <p className="text-xs text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.t30CNur60} /></p>
            </div>
          </div>

          {/* Card 2: Einbaufehler & Rassel-Effekte */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <AlertTriangle size={18} className="text-shiraz" /><MdText text={inhalt.texte.einbauVerdichtungskonzepte} /></h3>
            
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.mangelhafteMechanischeRüttelarbeitFührt} /></p>

            <div className="space-y-3 text-xs text-text-main/80">
              <div className="p-3 bg-off-white/80 rounded border border-home-grau/15">
                <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.derRüttelpatschEffektBei} /></span><MdText text={inhalt.texte.durchDasAbziehenMit} /><ul className="list-disc list-inside mt-2 space-y-1 ml-1 text-text-main/70 text-xs">
                  <li><MdText text={inhalt.texte.einzelneGrößereAnsammlungenBilden} /></li>
                  <li><MdText text={inhalt.texte.vieleBläschenBildenDünne} /></li>
                </ul>
              </div>

              <div className="p-3 bg-off-white/80 rounded border border-home-grau/15">
                <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.mörtelanreicherungDurchFehlverdichten} /></span>
                <p className="text-xs leading-relaxed"><MdText text={inhalt.texte.überrüttelnFlascheZuLange} /></p>
              </div>
            </div>
          </div>

          {/* Card 3: Industrieboden-Engineering */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <Wrench size={18} className="text-shiraz" /><MdText text={inhalt.texte.industriebodenDatenblattC3037} /></h3>
            
            <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.gegenüberstellungDesTheoretischenDbv} /></p>

            <div className="space-y-4">
              <div className="border border-home-grau/30 text-xs rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 font-bold bg-off-white p-2 border-b border-home-grau/30">
                  <span>Parameter</span>
                  <span>DBV Limit</span>
                  <span className="text-shiraz"><MdText text={inhalt.texte.krellEmpfehlung} /></span>
                </div>
                
                <div className="grid grid-cols-3 p-2 border-b border-home-grau/10">
                  <span className="font-semibold">Mehlkorn MK</span>
                  <span><MdText text={inhalt.texte.t360400KgM} /></span>
                  <span className="text-shiraz font-bold">~ 360 kg/m³</span>
                </div>

                <div className="grid grid-cols-3 p-2 border-b border-home-grau/10">
                  <span className="font-semibold"><MdText text={inhalt.texte.feinstkornFk} /></span>
                  <span>≤ 430 kg/m³</span>
                  <span className="text-shiraz font-bold">≤ 430 kg/m³</span>
                </div>

                <div className="grid grid-cols-3 p-2">
                  <span className="font-semibold">Wasser</span>
                  <span>≤ 180 kg/m³</span>
                  <span className="text-shiraz font-bold"><MdText text={inhalt.texte.t165175KgM} /></span>
                </div>
              </div>

              <div className="bg-red-50 border border-red-150 p-3 rounded-xl text-xs space-y-1.5 leading-relaxed">
                <span className="font-bold text-red-800 block uppercase text-xs"><MdText text={inhalt.texte.achtungXm3EinstreuBei} /></span><MdText text={inhalt.texte.dieInDin1045} /><span className="text-red-700 font-bold"><MdText text={inhalt.texte.baupraktischNichtRealisierbarXm2} /></span>.
                <div className="text-xs font-bold text-text-main bg-white p-2 rounded border border-red-200 mt-1.5"><MdText text={inhalt.texte.empfehlungNachträglicherVerbundIndustrie} /></div>
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
                <Calendar size={18} className="text-shiraz" /><MdText text={inhalt.texte.dauerDerMindestnachbehandlungTage} /></h3>
              <p className="text-xs text-text-main/80 font-medium"><MdText text={inhalt.texte.berechnetDieMindestanzahlAn} /></p>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-4">
                {/* 1. Exposures */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.t1ExpositionsklasseSchutzbedürfnis} /></label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <button aria-pressed={curingExposure === 'x0_xc1'}
                      type="button"
                      onClick={() => setCuringExposure('x0_xc1')}
                      className={`p-2.5 text-xs font-semibold rounded-lg border transition-all ${
                        curingExposure === 'x0_xc1'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-home-grau/5'
                      }`}
                    ><MdText text={inhalt.texte.x0Xc1TrockenKein} /></button>
                    <button aria-pressed={curingExposure === 'standard'}
                      type="button"
                      onClick={() => setCuringExposure('standard')}
                      className={`p-2.5 text-xs font-semibold rounded-lg border transition-all ${
                        curingExposure === 'standard'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-home-grau/5'
                      }`}
                    ><MdText text={inhalt.texte.alleÜbrigenKlassen} /></button>
                    <button aria-pressed={curingExposure === 'erhoeht'}
                      type="button"
                      onClick={() => setCuringExposure('erhoeht')}
                      className={`p-2.5 text-xs font-semibold rounded-lg border transition-all ${
                        curingExposure === 'erhoeht'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-home-grau/5'
                      }`}
                    ><MdText text={inhalt.texte.xmVerschleiß} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 2. Festigkeitsentwicklung */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.t2FestigkeitsentwicklungRWert} /></label>
                    <select aria-label={inhalt.werte.t2FestigkeitsentwicklungRWert}
                      value={curingStrength}
                      onChange={(e) => setCuringStrength(e.target.value as typeof curingStrength)}
                      className="w-full text-xs p-2 border border-home-grau/30 rounded"
                    >
                      <option value="schnell">Schnell (r ≥ 0,50)</option>
                      <option value="mittel">Mittel (r ≥ 0,30)</option>
                      <option value="langsam">Langsam (r ≥ 0,15)</option>
                      <option value="sehr_langsam">Sehr langsam (r &lt; 0,15)</option>
                    </select>
                    <span className="text-xs text-text-main/50 block"><MdText text={inhalt.texte.abhängigVonZementsorteUnd} /></span>
                  </div>

                  {/* 3. Witterung/Temperatur */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.t3Bauteiloberflächentemperaturen} /></label>
                    <select aria-label={inhalt.werte.t3Bauteiloberflächentemperaturen}
                      value={curingTemp}
                      onChange={(e) => setCuringTemp(e.target.value as typeof curingTemp)}
                      className="w-full text-xs p-2 border border-home-grau/30 rounded"
                    >
                      <option value="5_9">5 °C bis 9 °C (Winterlich kühl)</option>
                      <option value="10_14">10 °C bis 14 °C (Übergangszeit)</option>
                      <option value="15_24">15 °C bis 24 °C (Standardklima)</option>
                      <option value="ge_25">≥ 25 °C (Sommerliche Wärme)</option>
                    </select>
                    <span className="text-xs text-text-main/50 block"><MdText text={inhalt.texte.wichtigKerntemperaturSollStets} /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated outputs */}
            <div className="pt-4 space-y-4">
              <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/15 text-center space-y-1">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block"><MdText text={inhalt.texte.mindestdauerDerNachbehandlung} /></span>
                <div className="text-xl font-bold text-shiraz font-mono leading-tight">
                  {curingExposure === 'x0_xc1' ? (
                    <span className="text-xs block py-1 font-semibold"><MdText text={inhalt.texte.mindestens05Tage} /></span>
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
                  <span className="text-xs text-red-700 font-semibold block"><MdText text={inhalt.texte.xmDoppelteDauerNach} /></span>
                )}
              </div>

              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.werteNachDin1045} /></p>
            </div>
          </div>

          {/* Aggregate / Clearance Card */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Sliders size={18} className="text-shiraz" /><MdText text={inhalt.texte.betonierbarkeitVsGrößtkorn} /></h3>
              <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.zurVerhinderungVonKiesnestern} /></p>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3">
                <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.selektiertesGrößtkornDerGesteinskörnung} /></label>
                <div className="grid grid-cols-3 gap-2">
                  {[8, 16, 32].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setGroesstkorn(size as typeof groesstkorn)}
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
                  <span className="text-xs uppercase font-mono font-bold text-text-main/50"><MdText text={inhalt.texte.infografikReibungsloserDurchfluss} /></span>
                  <span className="text-xs font-bold text-shiraz font-mono"><MdText text={inhalt.texte.minLichteWeite} />{groesstkorn === 8 ? '12 cm' : groesstkorn === 16 ? '14 cm' : '18 cm'}</span>
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
                <Info size={14} /><MdText text={inhalt.texte.regelwerksHandkarteZusatzhinweis} /></div>
              <ul className="list-disc list-inside text-xs text-text-main/80 space-y-1">
                <li><MdText text={inhalt.texte.anschlussmischungBeiWandständigenBetonar} /></li>
                <li><MdText text={inhalt.texte.spezialregelWuBeiElementwänden} /></li>
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
            <ExpositionsKurzkarte hinweis={inhalt.werte.dieGrenzwerteJeExpositionsklasse} />
          </div>

          {/* WU-Richtlinie section */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-12">
            <div className="flex items-center gap-3 pb-2 border-b border-home-grau/10">
              <div className="w-8 h-8 bg-sky-500 text-white rounded-lg flex items-center justify-center">
                <Droplets size={16} />
              </div>
              <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.wuRichtlinieEmpfohleneMindestdicken} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.vorgeschriebeneMechanischeGrenzmaßeZur} /></p>
        </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Selectors */}
              <div className="space-y-3 bg-off-white p-4 rounded-xl border border-home-grau/30 text-xs">
                {/* Member */}
                <div className="space-y-1 row-span-1">
                  <label className="font-bold text-text-main"><MdText text={inhalt.texte.auszuführendesBauteil} /></label>
                  <div className="flex gap-1">
                    {[
                      { id: 'waende', label: 'Wände' },
                      { id: 'bodenplatte', label: 'Bodenplatte' },
                      { id: 'daech', label: 'Dächer' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWuBauteil(item.id as typeof wuBauteil)}
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
                  <label className="font-bold text-text-main"><MdText text={inhalt.texte.beanspruchungsGruppeBk} /></label>
                  <div className="flex gap-1">
                    {[
                      { id: 'bk1', label: inhalt.werte.bk1Drückend },
                      { id: 'bk2', label: inhalt.werte.bk2Feucht }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWuBk(item.id as typeof wuBk)}
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
                  <span className="text-xs text-text-main/50 block mt-1"><MdText text={inhalt.texte.bk1DrückendesUnd} /></span>
                </div>

                {/* Bauweise */}
                <div className="space-y-1">
                  <label className="font-bold text-text-main"><MdText text={inhalt.texte.bauverfahrenKonstruktionsweise} /></label>
                  <div className="flex gap-1">
                    {[
                      { id: 'ortbeton', label: 'Ortbeton' },
                      { id: 'element', label: 'Elementwand' },
                      { id: 'fertigteil', label: 'Fertigteil' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWuBauweise(item.id as typeof wuBauweise)}
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
                        <span className="text-xs uppercase font-bold text-sky-800 tracking-wider block"><MdText text={inhalt.texte.empfehlungDerWuRichtlinie} /></span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-sky-900 font-mono">{result.dicke > 0 ? `${formatDeWert(result.dicke)} mm` : '—'}</span>
                          {result.core && (
                            <span className="text-sm text-sky-700 font-semibold font-mono">({formatDeWert(result.core)}<MdText text={inhalt.texte.mmKernbeton} /></span>
                          )}
                        </div>
                        <p className="text-xs text-text-main/80 mt-1 leading-relaxed font-semibold">{result.comment}</p>
                      </div>

                      <div className="text-xs text-text-main/60 bg-white p-2 border border-sky-100 rounded mt-3.5 leading-normal"><MdText text={inhalt.texte.eckeAusnahmeFußnote1} /></div>
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
                <Layers size={18} className="text-shiraz" /><MdText text={inhalt.texte.bohrkernPrüfungsrechnerDinEn} /></h3>
              
              <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.konformitätsUndBeständigkeitskontrollenA} /></p>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-main block"><MdText text={inhalt.texte.nominaleFestigkeitFCk} /></label>
                  <select aria-label={inhalt.werte.nominaleFestigkeitFCk} 
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
                  <label className="text-xs font-semibold text-text-main block"><MdText text={inhalt.texte.betonvolumenBaustelle} /></label>
                  <div className="relative">
                    <input aria-label={inhalt.werte.betonvolumenBaustelle} 
                      type="number" min="0" 
                      value={concreteVol} 
                      onChange={(e) => setConcreteVol(Number(e.target.value))} 
                      className="w-full text-xs p-2 border border-home-grau/30 rounded pr-8"
                    />
                    <span className="absolute right-2 top-2 text-xs text-home-grau font-bold">m³</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-main block"><MdText text={inhalt.texte.kerneInsgesamt} /></label>
                  <select aria-label={inhalt.werte.kerneInsgesamt} 
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
              <span className="text-xs font-bold text-text-main/80 uppercase block"><MdText text={inhalt.texte.anforderungenAnBohrkernEinzelwerte} /></span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-home-grau/15 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-shiraz"><MdText text={inhalt.texte.t1UngünstigsterEinzelwertBk} /></span>
                    <p className="text-xs text-text-main/60 mt-0.5"><MdText text={inhalt.texte.kleinsterEinzelwertDerBohrkerndruckfesti} /></p>
                  </div>
                  <div className="mt-3">
                    <span className="text-xs text-text-main/50 font-bold font-mono"><MdText text={inhalt.texte.formel085F} /></span>
                    <div className="text-lg font-bold text-shiraz font-mono mt-1">≥ {formatDeZahl(reqBkMin, 2)} N/mm²</div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-home-grau/15 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-shiraz"><MdText text={inhalt.texte.t2MittelwertFM} /></span>
                    <p className="text-xs text-text-main/60 mt-0.5"><MdText text={inhalt.texte.mittelwertAnforderungBasierendAuf} /></p>
                  </div>
                  <div className="mt-3">
                    <span className="text-xs text-text-main/50 font-bold font-mono mb-1 block">
                      {coresTested <= 4 ? inhalt.werte.für24Kerne : inhalt.werte.für56Kerne}
                    </span>
                    <div className="text-lg font-bold text-shiraz font-mono">≥ {formatDeZahl(reqBkMedian, 2)} N/mm²</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-250 text-xs text-yellow-900 leading-relaxed"><MdText text={inhalt.texte.hinweisAnzahlUndLage} /></div>
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
                    <ChevronRight size={14} /><MdText text={inhalt.texte.transportbetonwerkTbWerk} /></span>
                  <p className="text-xs text-text-main/80 block leading-relaxed font-mono"><MdText text={inhalt.texte.konformitätsnachweisStandardBrMittelwert} /><span className="text-shiraz font-bold"><MdText text={inhalt.texte.fCi3F} /></span><MdText text={inhalt.texte.brOderFortlaufendÜber} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-2">
                  <span className="font-bold text-shiraz text-xs flex items-center gap-1">
                    <ChevronRight size={14} /><MdText text={inhalt.texte.baustellenIdentitätsprüfungAnnahme} /></span>
                  <div className="text-xs text-text-main/80 leading-relaxed font-mono space-y-1">
                    <p><MdText text={inhalt.texte.zweckZweifelsfreieKlärungDer} /></p>
                    <p><MdText text={inhalt.texte.t3erBis4erMittel} /></p>
                    <p><MdText text={inhalt.texte.t5erBis6erMittel} /></p>
                    <p><MdText text={inhalt.texte.ab7WerteStatistische} /></p>
                    <p className="text-red-700 bg-red-50 text-xs p-2 rounded leading-normal border border-red-100 font-sans font-bold"><MdText text={inhalt.texte.jederEinzelneProbekörperEinzelwert} /></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-home-grau/15 text-xs text-text-main/60 flex items-start gap-1.5">
              <Info size={15} className="text-shiraz flex-shrink-0 mt-0.5" />
              <span><MdText text={inhalt.texte.vergissBeimBohrkernAusbau} /></span>
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
          { title: inhalt.werte.betonOrgPlanungshilfenUnd, url: 'https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/' },
          { title: inhalt.werte.betonWikiPraxiswissenBeton, url: 'https://beton.wiki/' }
        ]}
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Expositionsklasse', url: 'https://de.wikipedia.org/wiki/Expositionsklasse' }
        ]}
        regelwerke={inhalt.daten["Betonpraxis.regelwerke"]}
        literatur={inhalt.daten["Betonpraxis.literatur"]}
        formeln={inhalt.daten["Betonpraxis.formeln"]}
      />
    </div>
  );
}
