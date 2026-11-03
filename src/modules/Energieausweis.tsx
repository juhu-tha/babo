import React, { useState, useMemo } from 'react';
import { 
  Zap, Info, FileCheck, Home, Calculator, Sliders, Scale,
  TrendingDown, ArrowUpRight, Flame, Wind, Layers
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { InlineMath, BlockMath } from 'react-katex';
import inhalt from '@/content/energieausweis/Energieausweis.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { energieausweis, rechtsstandAm, FAKTOREN, type Rechtsstand } from '@/src/calc/energieausweis';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

/** Farbe der Effizienzklasse (Wohngebäude, GModG/GEG Anlage 10 zu § 86) */
const KLASSEN_FARBE: Readonly<Record<string, string>> = {
  'A+': 'bg-green-700 text-white', A: 'bg-green-600 text-white', B: 'bg-green-500 text-white', C: 'bg-lime-500 text-slate-900',
  D: 'bg-yellow-400 text-slate-900', E: 'bg-orange-400 text-white', F: 'bg-orange-500 text-white', G: 'bg-red-600 text-white', H: 'bg-red-800 text-white',
};

type EnergieausweisReiter = 'uebersicht' | 'annahmen_berechnung' | 'simulator' | 'praxis_recht';
const REITER: readonly ModulTab<EnergieausweisReiter>[] = [
  { id: 'uebersicht', label: inhalt.texte.übersichtSkala.trim(), icon: FileCheck },
  { id: 'annahmen_berechnung', label: inhalt.texte.annahmen3StufenRechnung.trim(), icon: Calculator },
  { id: 'simulator', label: inhalt.texte.interaktiverBedarfsRechner.trim(), icon: Sliders },
  { id: 'praxis_recht', label: inhalt.texte.praxisReboundGmodgRecht.trim(), icon: Scale },
];

export default function Energieausweis() {
  const [activeTab, setActiveTab] = useState<EnergieausweisReiter>('uebersicht');

  // State für interaktive Skala im Übersichtstab
  const [scaleHouseType, setScaleHouseType] = useState<'altbau_unsaniert' | 'altbau_saniert' | 'neubau_geg' | 'neubau_eh40'>('altbau_unsaniert');
  const [methodToggle, setMethodToggle] = useState<'bedarf' | 'verbrauch'>('bedarf');

  // Simulator State
  const [simBuildingType, setSimBuildingType] = useState<'efh' | 'mfh'>('efh');
  const [simArea, setSimArea] = useState<number>(150); // m² Wohnfläche / Bezugsfläche
  const [simHuelleStandard, setSimHuelleStandard] = useState<'unsaniert' | 'bestand_teilsaniert' | 'geg_standard' | 'effizienzhaus40'>('geg_standard');
  const [simVentilation, setSimVentilation] = useState<'fenster' | 'abluft' | 'kwl_wrg'>('fenster');
  const [simHeizung, setSimHeizung] = useState<'gas_brennwert' | 'oel_kessel' | 'pellets' | 'wp_luft' | 'wp_sole' | 'fernwaerme'>('wp_luft');
  // Stichtagsschalter GModG (T11-EA-2): Standard nach heutigem Datum
  const [simRechtsstand, setSimRechtsstand] = useState<Rechtsstand>(() => rechtsstandAm(new Date()));
  const fpVon = (h: keyof typeof FAKTOREN.bis_2026) => formatDeZahl(FAKTOREN[simRechtsstand][h].fp, 1);

  // Skalenwerte für Übersicht
  const getScaleValue = () => {
    switch (scaleHouseType) {
      case 'altbau_unsaniert': return inhalt.daten.getScaleValue;
      case 'altbau_saniert': return inhalt.daten.getScaleValue_2;
      case 'neubau_geg': return inhalt.daten.getScaleValue_3;
      case 'neubau_eh40': return inhalt.daten.getScaleValue_4;
    }
  };

  const getPositionStyle = (val: number) => {
    const percentage = Math.min(100, Math.max(0, (val / 250) * 100));
    return { left: `${percentage}%` };
  };

  const currentScale = getScaleValue();

  // Berechnungslogik für den interaktiven Simulator
  // Rechenkern src/calc/energieausweis.ts (Lehrmodell): H_T, H_V, Verluste/Gewinne, Q_h, Q_E, Q_P, CO₂, Effizienzklasse
  const simResults = useMemo(() => {
    const r = energieausweis({ typ: simBuildingType, flaeche: simArea, huelle: simHuelleStandard, lueftung: simVentilation, heizung: simHeizung, rechtsstand: simRechtsstand });
    return {
      ...r,
      h_t_prime: formatDeZahl(r.h_t_prime, 2),
      klasseColor: r.klasse === '–' ? 'bg-slate-100 text-slate-700' : KLASSEN_FARBE[r.klasse] ?? 'bg-red-800 text-white',
    };
  }, [simBuildingType, simArea, simHuelleStandard, simVentilation, simHeizung, simRechtsstand]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Kopfbereich */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Zap className="text-shiraz" /><MdText text={inhalt.texte.derEnergieausweisNachGmodg} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
          <p><MdText text={inhalt.texte.derEnergiebedarfsausweisBewertetDie} /></p>
        </div>

        {/* Rechtsstand GModG Infobox */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 my-4 flex items-start gap-2.5">
          <Info className="text-amber-700 shrink-0 mt-0.5" size={16} />
          <div><MdText text={inhalt.texte.rechtsstandBeschlussVonBundestag} /></div>
        </div>

        {/* Tab-Navigation */}
        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6">

        {/* TAB 1: ÜBERSICHT & FARBSKALA */}
        {activeTab === 'uebersicht' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="font-bold text-text-main text-base"><MdText text={inhalt.texte.bedarfsVsVerbrauchsausweisWann} /></h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div 
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  methodToggle === 'bedarf' 
                    ? 'bg-shiraz/5 border-shiraz/40 ring-1 ring-shiraz/30 shadow-xs' 
                    : 'bg-off-white border-home-grau/30 hover:border-home-grau/50'
                }`}
                onClick={() => setMethodToggle('bedarf')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-text-main flex items-center gap-2">
                    <FileCheck size={18} className="text-shiraz" /><MdText text={inhalt.texte.bedarfsausweisObjektivBerechnet} /></h4>
                  <span className="text-xxs font-bold px-2 py-0.5 rounded-full bg-shiraz/10 text-shiraz">
                    GEG-Standard
                  </span>
                </div>
                <ul className="text-xs text-text-main/80 space-y-2 list-disc pl-5">
                  <li><MdText text={inhalt.texte.wirdDurchEinePhysikalisch} /></li>
                  <li><MdText text={inhalt.texte.vollständigNutzerunabhängigSimuliertStan} /></li>
                  <li><MdText text={inhalt.texte.gesetzlichePflichtFürAlle} /></li>
                  <li><MdText text={inhalt.texte.ermöglichtEnergetischeSanierungsfahrplän} /></li>
                </ul>
              </div>
              
              <div 
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  methodToggle === 'verbrauch' 
                    ? 'bg-shiraz/5 border-shiraz/40 ring-1 ring-shiraz/30 shadow-xs' 
                    : 'bg-off-white border-home-grau/30 hover:border-home-grau/50'
                }`}
                onClick={() => setMethodToggle('verbrauch')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-text-main flex items-center gap-2">
                    <Home size={18} className="text-shiraz" /><MdText text={inhalt.texte.verbrauchsausweisAbrechnungsbasiert} /></h4>
                  <span className="text-xxs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700"><MdText text={inhalt.texte.eingeschränktZulässig} /></span>
                </div>
                <ul className="text-xs text-text-main/80 space-y-2 list-disc pl-5">
                  <li><MdText text={inhalt.texte.basiertAufDenRealen} /></li>
                  <li><MdText text={inhalt.texte.starkNutzerabhängigSparsamesHeizen} /></li>
                  <li><MdText text={inhalt.texte.günstigerInDerErstellung} /></li>
                  <li><MdText text={inhalt.texte.nurZulässigBeiMehrfamilienhäusern} /></li>
                </ul>
              </div>
            </div>

            {/* Interaktive Farbskala */}
            <div className="pt-4 border-t border-home-grau/20">
              <h3 className="font-bold text-text-main text-sm mb-3"><MdText text={inhalt.texte.interaktiveEnergieeffizienzskalaKlassenA} /></h3>
              
              <AuswahlGruppe label="Gebäudestandard" className="flex gap-2 flex-wrap mb-4">
                <button {...alsOption(scaleHouseType === 'neubau_eh40')} 
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    scaleHouseType === 'neubau_eh40' ? 'bg-green-700 text-white border-green-700' : 'bg-off-white text-text-main border-home-grau/30'
                  }`} 
                  onClick={() => setScaleHouseType('neubau_eh40')}
                ><MdText text={inhalt.texte.effizienzhaus40A} /></button>
                <button {...alsOption(scaleHouseType === 'neubau_geg')} 
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    scaleHouseType === 'neubau_geg' ? 'bg-green-600 text-white border-green-600' : 'bg-off-white text-text-main border-home-grau/30'
                  }`} 
                  onClick={() => setScaleHouseType('neubau_geg')}
                ><MdText text={inhalt.texte.gegNeubauStandardB} /></button>
                <button {...alsOption(scaleHouseType === 'altbau_saniert')} 
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    scaleHouseType === 'altbau_saniert' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-off-white text-text-main border-home-grau/30'
                  }`} 
                  onClick={() => setScaleHouseType('altbau_saniert')}
                ><MdText text={inhalt.texte.altbauSaniertC} /></button>
                <button {...alsOption(scaleHouseType === 'altbau_unsaniert')} 
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    scaleHouseType === 'altbau_unsaniert' ? 'bg-red-700 text-white border-red-700' : 'bg-off-white text-text-main border-home-grau/30'
                  }`} 
                  onClick={() => setScaleHouseType('altbau_unsaniert')}
                ><MdText text={inhalt.texte.altbauUnsaniertVor1977} /></button>
              </AuswahlGruppe>

              {/* Farbband */}
              <div className="w-full relative mt-12 mb-8 px-2">
                <div className="flex h-10 w-full overflow-hidden rounded-xl shadow-inner">
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-green-700" style={{width: '12%'}}>A+</div>
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-green-600" style={{width: '8%'}}>A</div>
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-green-500" style={{width: '10%'}}>B</div>
                  <div className="h-full relative font-bold text-slate-800 text-xs flex items-center justify-center bg-lime-400" style={{width: '10%'}}>C</div>
                  <div className="h-full relative font-bold text-slate-800 text-xs flex items-center justify-center bg-yellow-400" style={{width: '12%'}}>D</div>
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-orange-400" style={{width: '12%'}}>E</div>
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-orange-500" style={{width: '16%'}}>F</div>
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-red-600" style={{width: '20%'}}>G</div>
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-red-800 flex-grow">H</div>
                </div>

                <div className="flex justify-between text-xxs text-home-grau mt-2 relative w-full font-mono">
                  <span>0</span>
                  <span className="absolute left-[12%] -translate-x-1/2">30</span>
                  <span className="absolute left-[20%] -translate-x-1/2">50</span>
                  <span className="absolute left-[30%] -translate-x-1/2">75</span>
                  <span className="absolute left-[40%] -translate-x-1/2">100</span>
                  <span className="absolute left-[52%] -translate-x-1/2">130</span>
                  <span className="absolute left-[64%] -translate-x-1/2">160</span>
                  <span className="absolute left-[80%] -translate-x-1/2">200</span>
                  <span className="absolute left-[100%] -translate-x-1/2">250+</span>
                  <div className="absolute w-full mt-4 text-center text-xs text-text-main font-sans"><MdText text={inhalt.texte.endenergiebedarfInKwhM} /></div>
                </div>

                {/* Zeiger */}
                <div 
                  className="absolute top-0 w-0 -mt-10 flex flex-col items-center transition-all duration-500 ease-out z-10"
                  style={getPositionStyle(currentScale.val)}
                >
                  <div
                    className="bg-shiraz text-white px-2.5 py-1 rounded-lg font-bold text-xs shadow-md whitespace-nowrap"
                    style={(() => { const p = Math.min(100, Math.max(0, (currentScale.val / 250) * 100)); return { transform: `translateX(${p > 75 ? -(p - 75) * 1.6 : p < 25 ? (25 - p) * 1.6 : 0}%)` }; })()}
                  >
                    {formatDeWert(currentScale.val)}<span className="hidden sm:inline"> kWh/(m²a)</span> [Kl. {currentScale.class}]
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-text-main mt-0.5"></div>
                </div>
              </div>

              <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/30 mt-12 text-xs text-text-main/90"><MdText text={inhalt.texte.typischeEinstufung} />{currentScale.desc}.
              </div>
            </div>

            {/* Historie der Vorschriften */}
            <div className="pt-4 border-t border-home-grau/20">
              <h3 className="font-bold text-text-main text-sm mb-3"><MdText text={inhalt.texte.historischerStufenplanVonDer} /></h3>
              <div className="text-xs text-text-main/80 space-y-3 relative border-l-2 border-shiraz/40 ml-2 pl-4">
                <div>
                  <strong className="text-text-main block"><MdText text={inhalt.texte.t19771WärmeschutzverordnungWsvo} /></strong><MdText text={inhalt.texte.reaktionAufDieErste} /></div>
                <div>
                  <strong className="text-text-main block"><MdText text={inhalt.texte.t1984199523} /></strong><MdText text={inhalt.texte.verschärfungDerDämmstandardsDie} /></div>
                <div>
                  <strong className="text-text-main block"><MdText text={inhalt.texte.t20021EnergieeinsparverordnungEnev} /></strong><MdText text={inhalt.texte.ganzheitlicherSprungZusammenführungVon} /></div>
                <div>
                  <strong className="text-text-main block"><MdText text={inhalt.texte.t2020GebäudeenergiegesetzGeg} /></strong><MdText text={inhalt.texte.zusammenfassungVonEnegEnev} /></div>
                <div>
                  <strong className="text-text-main block"><MdText text={inhalt.texte.t2024GegNovelleHeizungsgesetz} /></strong><MdText text={inhalt.texte.pflichtZurNutzungVon} /></div>
                <div>
                  <strong className="text-text-main block"><MdText text={inhalt.texte.t2026GebäudemodernisierungsgesetzGmodg} /></strong><MdText text={inhalt.texte.beschlussVonBundestagUnd} /></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANNAHMEN & 3-STUFEN-RECHNUNG */}
        {activeTab === 'annahmen_berechnung' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* 1. Die normierten Randbedingungen */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <h3 className="font-bold text-text-main text-base"><MdText text={inhalt.texte.dieNormiertenStandardAnnahmen} /></h3>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.umEineBundesweitObjektive} /></p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-xs mb-1">
                    <Wind size={15} /><MdText text={inhalt.texte.referenzklimaStandort} /></div>
                  <p className="text-xxs text-text-main/80"><MdText text={inhalt.texte.einheitlichesTestreferenzjahrTryDes} /></p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-xs mb-1">
                    <Home size={15} /> Raum-Solltemperatur
                  </div>
                  <p className="text-xxs text-text-main/80"><MdText text={inhalt.texte.fürWohngebäudeGiltIm} /></p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-xs mb-1">
                    <Wind size={15} /> Mindestluftwechselrate
                  </div>
                  <p className="text-xxs text-text-main/80"><MdText text={inhalt.texte.standardmäßigWirdEinLuftwechsel} /></p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-xs mb-1">
                    <Zap size={15} /><MdText text={inhalt.texte.interneWärmegewinneQI} /></div>
                  <p className="text-xxs text-text-main/80"><MdText text={inhalt.texte.körperwärmeAnwesenderPersonenLampen} /></p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-xs mb-1">
                    <Flame size={15} /><MdText text={inhalt.texte.warmwasserbedarfQW} /></div>
                  <p className="text-xxs text-text-main/80"><MdText text={inhalt.texte.imVereinfachtenVerfahrenDin} /></p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-xs mb-1">
                    <Layers size={15} /><MdText text={inhalt.texte.gebäudenutzflächeAN} /></div>
                  <p className="text-xxs text-text-main/80"><MdText text={inhalt.texte.wirdVereinfachtAusDem} /></p>
                </div>
              </div>
            </div>

            {/* 2. Der 3-Stufen-Berechnungsgang */}
            <div className="pt-4 border-t border-home-grau/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <h3 className="font-bold text-text-main text-base"><MdText text={inhalt.texte.der3StufenBerechnungsgang} /></h3>
              </div>

              <div className="space-y-5">
                
                {/* STUFE 1 */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xxs font-bold">Stufe 1</span><MdText text={inhalt.texte.nutzwärmebedarfHeizwärmebedarfQH} /></h4>
                    <span className="text-xxs text-slate-500 font-mono"><MdText text={inhalt.texte.gebäudehülleLüftung} /></span>
                  </div>
                  
                  <p className="text-xs text-text-main/80 mb-3"><MdText text={inhalt.texte.beziffertDieNettoWärmemenge} /></p>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 my-2 text-center text-sm font-mono overflow-x-auto">
                    <BlockMath math="Q_h = (Q_T + Q_V) - \eta \cdot (Q_s + Q_i) \quad [\text{kWh/a}]" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs text-text-main/80 mt-3">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.transmissionsverlustQT} /></strong>
                      <InlineMath math="H_T = \sum (U_i \cdot A_i \cdot F_{xi}) + \Delta U_{WB} \cdot A" />
                      <p className="text-xxs text-slate-600 mt-1"><MdText text={inhalt.texte.wärmeabflussDurchBauteileF} /></p>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.lüftungsverlustQV} /></strong>
                      <InlineMath math="H_V = V_v \cdot \rho \cdot c_p \cdot n" />
                      <p className="text-xxs text-slate-600 mt-1"><MdText text={inhalt.texte.wärmeabflussDurchLufterneuerungSpezifisc} /></p>
                    </div>
                  </div>

                  <p className="text-xxs text-slate-500 mt-2"><MdText text={inhalt.texte.derFaktorEtaIst} /></p>
                </div>

                {/* STUFE 2 */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-xxs font-bold">Stufe 2</span><MdText text={inhalt.texte.endenergiebedarfQE} /></h4>
                    <span className="text-xxs text-slate-500 font-mono"><MdText text={inhalt.texte.anlagentechnikHilfsstrom} /></span>
                  </div>

                  <p className="text-xs text-text-main/80 mb-3"><MdText text={inhalt.texte.dieEnergiemengeDieAn} /></p>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 my-2 text-center text-sm font-mono overflow-x-auto">
                    <BlockMath math="Q_E = \frac{Q_h + Q_w + Q_{\text{Verlust,Übergabe}} + Q_{\text{Verlust,Verteilung}} + Q_{\text{Verlust,Speicher}}}{\eta_{\text{Erzeuger}} \text{ bzw. } JAZ} + W_{\text{Hilfs}}" />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-2 text-xxs text-text-main/80 mt-3">
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80"><MdText text={inhalt.texte.übergabeRegelung} /><p className="text-slate-600 mt-0.5"><MdText text={inhalt.texte.heizkörperErzeugenHöhereDeckentemperatur} /></p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80"><MdText text={inhalt.texte.verteilungSpeicher} /><p className="text-slate-600 mt-0.5"><MdText text={inhalt.texte.wärmeverlusteUngedämmterRohrleitungenIm} /></p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80"><MdText text={inhalt.texte.erzeugerwirkungsgradJaz} /><p className="text-slate-600 mt-0.5"><MdText text={inhalt.texte.brennwertkesselEtaApprox0} /></p>
                    </div>
                  </div>

                  <p className="text-xs text-text-main font-semibold mt-3"><MdText text={inhalt.texte.derEndenergiebedarfQE} /></p>
                </div>

                {/* STUFE 3 */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-xxs font-bold">Stufe 3</span><MdText text={inhalt.texte.primärenergiebedarfQP} /></h4>
                    <span className="text-xxs text-slate-500 font-mono"><MdText text={inhalt.texte.ökologischeGesamtbilanz} /></span>
                  </div>

                  <p className="text-xs text-text-main/80 mb-3"><MdText text={inhalt.texte.derPrimärenergiebedarfBewertetDie} /></p>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 my-2 text-center text-sm font-mono overflow-x-auto">
                    <BlockMath math="Q_P = \sum_i \left( Q_{E,i} \cdot f_{P,i} \right) \quad [\text{kWh/(m}^2\cdot\text{a)}]" />
                  </div>

                  <div className="mt-3">
                    <strong className="text-xs text-text-main block mb-2"><MdText text={inhalt.texte.primärenergiefaktorenFPNicht} /></strong>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="font-bold block text-slate-800">1,1</span>
                        <span className="text-xxs text-slate-600"><MdText text={inhalt.texte.erdgasHeizöl} /></span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="font-bold block text-emerald-700">0,2</span>
                        <span className="text-xxs text-slate-600"><MdText text={inhalt.texte.holzpelletsScheitholz} /></span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="font-bold block text-blue-700">1,8</span>
                        <span className="text-xxs text-slate-600"><MdText text={inhalt.texte.stromMixNetzbezug} /></span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="font-bold block text-amber-700">0,0 – 0,7</span>
                        <span className="text-xxs text-slate-600"><MdText text={inhalt.texte.fernwärmeKwk} /></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xxs text-amber-900"><MdText text={inhalt.texte.wichtigeBesonderheitBeiWärmepumpen} /></div>
                </div>

              </div>
            </div>

            {/* 3. Das Referenzgebäude-Verfahren */}
            <div className="pt-4 border-t border-home-grau/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <h3 className="font-bold text-text-main text-base"><MdText text={inhalt.texte.derGesetzlicheNachweisDas} /></h3>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-xs text-text-main/80 space-y-2">
                <p><MdText text={inhalt.texte.imNeubauSchreibtDas} /></p>
                <div className="grid sm:grid-cols-2 gap-3 my-2">
                  <div className="p-3 bg-white rounded-lg border border-home-grau/30">
                    <strong className="text-text-main block mb-1"><MdText text={inhalt.texte.t1PrimärenergieAnforderung} /></strong>
                    <BlockMath math="Q_{P,\text{Ist}} \le 0{,}55 \cdot Q_{P,\text{Ref}}" />
                    <p className="text-xxs text-slate-600"><MdText text={inhalt.texte.seit2023GiltFür} /></p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-home-grau/30">
                    <strong className="text-text-main block mb-1"><MdText text={inhalt.texte.t2BaulicherWärmeschutzHülle} /></strong>
                    <BlockMath math="H'_{T,\text{Ist}} \le H'_{T,\text{Ref}}" />
                    <p className="text-xxs text-slate-600"><MdText text={inhalt.texte.t16HöchstensDas1} /></p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: INTERAKTIVER SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-bold text-text-main text-base mb-1"><MdText text={inhalt.texte.liveSimulatorBedarfsausweisNach} /></h3>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.verändernSieGebäudeparameterDämmstandard} /></p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Parameter-Eingaben (7 Spalten) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* 0. Rechtsstand (Stichtag 01.01.2027) */}
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Scale size={15} className="text-shiraz" /><MdText text={inhalt.texte.t0RechtsstandStichtag} /></span>
                  <AuswahlGruppe label="Rechtsstand" className="grid grid-cols-2 gap-2">
                    {([['bis_2026', inhalt.texte.rechtsstandBis2026, inhalt.texte.rechtsstandBis2026Info], ['ab_2027', inhalt.texte.rechtsstandAb2027, inhalt.texte.rechtsstandAb2027Info]] as const).map(([id, titel, info]) => (
                      <button key={id} {...alsOption(simRechtsstand === id)}
                        onClick={() => setSimRechtsstand(id)}
                        className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                          simRechtsstand === id ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                        }`}
                      >
                        <strong className="block text-xxs sm:text-xs">{titel}</strong>
                        <span className="text-xxs opacity-80">{info}</span>
                      </button>
                    ))}
                  </AuswahlGruppe>
                  <p className="text-xxs text-text-main/80"><MdText text={inhalt.texte.rechtsstandHinweis} /></p>
                </div>

                {/* 1. Gebäudegeometrie */}
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Home size={15} className="text-shiraz" /><MdText text={inhalt.texte.t1GebäudegrößeTyp} /></span>

                  <AuswahlGruppe label="Gebäudetyp" className="grid grid-cols-2 gap-2">
                    <button {...alsOption(simBuildingType === 'efh')}
                      onClick={() => setSimBuildingType('efh')}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        simBuildingType === 'efh' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    ><MdText text={inhalt.texte.einfamilienhausFreistehend} /></button>
                    <button {...alsOption(simBuildingType === 'mfh')}
                      onClick={() => setSimBuildingType('mfh')}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        simBuildingType === 'mfh' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    ><MdText text={inhalt.texte.mehrfamilienhausKompakt} /></button>
                  </AuswahlGruppe>

                  <div>
                    <div className="flex justify-between text-xs text-text-main mb-1">
                      <span><MdText text={inhalt.texte.gebäudenutzflächeAN2} /></span>
                      <strong className="font-mono">{formatDeWert(simArea)} m²</strong>
                    </div>
                    <input 
                      type="range" 
                      min="80" 
                      max="400" 
                      step="10" 
                      value={simArea} 
                      onChange={(e) => setSimArea(Number(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                  </div>
                </div>

                {/* 2. Dämmstandard der Gebäudehülle */}
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Layers size={15} className="text-shiraz" /><MdText text={inhalt.texte.t2ThermischeGebäudehülleU} /></span>

                  <AuswahlGruppe label="Gebäudehülle" className="grid sm:grid-cols-2 gap-2 text-xs">
                    <button {...alsOption(simHuelleStandard === 'unsaniert')}
                      onClick={() => setSimHuelleStandard('unsaniert')}
                      className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                        simHuelleStandard === 'unsaniert' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block"><MdText text={inhalt.texte.vor1977Unsaniert} /></strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.wandU14} /></span>
                    </button>

                    <button {...alsOption(simHuelleStandard === 'bestand_teilsaniert')}
                      onClick={() => setSimHuelleStandard('bestand_teilsaniert')}
                      className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                        simHuelleStandard === 'bestand_teilsaniert' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block"><MdText text={inhalt.texte.teilsaniertWsvo95} /></strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.wandU045} /></span>
                    </button>

                    <button {...alsOption(simHuelleStandard === 'geg_standard')}
                      onClick={() => setSimHuelleStandard('geg_standard')}
                      className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                        simHuelleStandard === 'geg_standard' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block"><MdText text={inhalt.texte.neubauGegStandard} /></strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.wandU024} /></span>
                    </button>

                    <button {...alsOption(simHuelleStandard === 'effizienzhaus40')}
                      onClick={() => setSimHuelleStandard('effizienzhaus40')}
                      className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                        simHuelleStandard === 'effizienzhaus40' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block"><MdText text={inhalt.texte.effizienzhaus40} /></strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.wandU014} /></span>
                    </button>
                  </AuswahlGruppe>

                  <div className="text-xxs text-text-main/70 bg-white p-2 rounded-md border border-slate-200"><MdText text={inhalt.texte.berechneterSpezifischerTransmissionsverl} /><strong><InlineMath math={`H'_T = ${simResults.h_t_prime}\\text{ W/(m}^2\\text{K)}`} /></strong>
                  </div>
                </div>

                {/* 3. Lüftungssystem */}
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Wind size={15} className="text-shiraz" /><MdText text={inhalt.texte.t3Lüftungskonzept} /></span>

                  <AuswahlGruppe label="Lüftungskonzept" className="grid grid-cols-3 gap-2 text-xs">
                    <button {...alsOption(simVentilation === 'fenster')}
                      onClick={() => setSimVentilation('fenster')}
                      className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                        simVentilation === 'fenster' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Fensterlüftung</strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.n050H} /></span>
                    </button>
                    <button {...alsOption(simVentilation === 'abluft')}
                      onClick={() => setSimVentilation('abluft')}
                      className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                        simVentilation === 'abluft' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Abluftanlage</strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.n045H} /></span>
                    </button>
                    <button {...alsOption(simVentilation === 'kwl_wrg')}
                      onClick={() => setSimVentilation('kwl_wrg')}
                      className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                        simVentilation === 'kwl_wrg' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">KWL mit WRG</strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.t80Rückgewinnung} /></span>
                    </button>
                  </AuswahlGruppe>
                </div>

                {/* 4. Wärmeerzeuger & Energieträger */}
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Flame size={15} className="text-shiraz" /><MdText text={inhalt.texte.t4HeizsystemEnergieträger} /></span>

                  <AuswahlGruppe label="Heizsystem" className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <button {...alsOption(simHeizung === 'wp_luft')}
                      onClick={() => setSimHeizung('wp_luft')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        simHeizung === 'wp_luft' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Luft-Wasser-WP</strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.jaz33Fp} />{fpVon('wp_luft')}</span>
                    </button>

                    <button {...alsOption(simHeizung === 'wp_sole')}
                      onClick={() => setSimHeizung('wp_sole')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        simHeizung === 'wp_sole' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Sole-Wasser-WP</strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.jaz43Fp} />{fpVon('wp_sole')}</span>
                    </button>

                    <button {...alsOption(simHeizung === 'gas_brennwert')}
                      onClick={() => setSimHeizung('gas_brennwert')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        simHeizung === 'gas_brennwert' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Gas-Brennwert</strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.t096Fp1} />{fpVon('gas_brennwert')}</span>
                    </button>

                    <button {...alsOption(simHeizung === 'pellets')}
                      onClick={() => setSimHeizung('pellets')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        simHeizung === 'pellets' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Holzpellets</strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.t088Fp0} />{fpVon('pellets')}</span>
                    </button>

                    <button {...alsOption(simHeizung === 'fernwaerme')}
                      onClick={() => setSimHeizung('fernwaerme')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        simHeizung === 'fernwaerme' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs"><MdText text={inhalt.texte.fernwärmeKwk2} /></strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.t098Fp0} />{fpVon('fernwaerme')}</span>
                    </button>

                    <button {...alsOption(simHeizung === 'oel_kessel')}
                      onClick={() => setSimHeizung('oel_kessel')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        simHeizung === 'oel_kessel' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Öl-Heizkessel</strong>
                      <span className="text-xxs opacity-80"><MdText text={inhalt.texte.t084Fp1} />{fpVon('oel_kessel')}</span>
                    </button>
                  </AuswahlGruppe>
                </div>

              </div>

              {/* Berechnete Ergebnisse & Ausweis-Vorschau (5 Spalten) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Result Card */}
                <div className="bg-white p-5 rounded-2xl border-2 border-home-grau/30 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider"><MdText text={inhalt.texte.ergebnisEnergieausweis} /></span>
                    <span className={`text-sm font-black px-3 py-1 rounded-lg ${simResults.klasseColor}`}>
                      Klasse {simResults.klasse}
                    </span>
                  </div>

                  {/* Große Kennwerte */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xxs text-slate-500 font-semibold uppercase block"><MdText text={inhalt.texte.endenergiebedarfQe} /></span>
                      <div className="text-xl font-black text-slate-900 font-mono">
                        {formatDeWert(simResults.q_e)} <span className="text-xs font-normal text-slate-500">kWh/(m²a)</span>
                      </div>
                      <span className="text-xxs text-slate-500"><MdText text={inhalt.texte.basisFürBandtachoKosten} /></span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xxs text-slate-500 font-semibold uppercase block"><MdText text={inhalt.texte.primärenergiebedarfQp} /></span>
                      <div className="text-xl font-black text-emerald-800 font-mono">
                        {formatDeWert(simResults.q_p)} <span className="text-xs font-normal text-slate-500">kWh/(m²a)</span>
                      </div>
                      <span className="text-xxs text-slate-500"><MdText text={inhalt.texte.nachweisgrößeNach15Fp} />{formatDeWert(simResults.f_p)})</span>
                    </div>
                  </div>

                  {/* Detailaufschlüsselung Stufe 1 bis 3 */}
                  <div className="space-y-2 text-xs border-t border-home-grau/20 pt-3">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600"><MdText text={inhalt.texte.transmissionsverlustQT2} /></span>
                      <strong className="font-mono">{formatDeWert(simResults.q_t_jahr)} kWh/(m²a)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600"><MdText text={inhalt.texte.lüftungsverlustQV2} /></span>
                      <strong className="font-mono">{formatDeWert(simResults.q_v_jahr)} kWh/(m²a)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
                      <span><MdText text={inhalt.texte.solarInterneGewinneEta} /></span>
                      <strong className="font-mono">- {formatDeWert(simResults.q_gewinne)} kWh/(m²a)</strong>
                    </div>
                    <div className="flex justify-between py-1.5 font-bold bg-amber-50 px-2 rounded-lg text-amber-900">
                      <span><MdText text={inhalt.texte.nutzwärmebedarfQH} /></span>
                      <span className="font-mono">{formatDeWert(simResults.q_h)} kWh/(m²a)</span>
                    </div>
                    <div className="flex justify-between py-1 text-slate-600">
                      <span><MdText text={inhalt.texte.geschätzteCoEmissionen} /></span>
                      <strong className="font-mono">{formatDeWert(simResults.co2_emissionen)}<MdText text={inhalt.texte.kgCoMA} /><span className="font-normal text-slate-500">{inhalt.texte.coFaktor}{formatDeWert(simResults.co2_faktor)}{inhalt.texte.gKwh}</span></strong>
                    </div>
                  </div>

                  {/* Didaktischer Kommentar */}
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/30 text-xxs text-text-main/80 space-y-1"><MdText text={inhalt.texte.ingenieurmäßigeEinordnung} />{simResults.klasse === '–' ? (
                      <p>–</p>
                    ) : simResults.klasse === 'A+' || simResults.klasse === 'A' ? (
                      <p><MdText text={inhalt.texte.hervorragenderPassivhausBzwEffizienzhaus} /></p>
                    ) : simResults.klasse === 'B' || simResults.klasse === 'C' ? (
                      <p><MdText text={inhalt.texte.guterZeitgemäßerStandardErfüllt} /></p>
                    ) : (
                      <p className="text-red-700"><MdText text={inhalt.texte.dringenderSanierungsbedarfHoheTransmissi} /></p>
                    )}
                  </div>
                </div>

                {/* Live-Rechenweg (AP 3.7) mit den aktuellen Simulator-Einstellungen */}
                <FormulaDerivationBox
                  live
                  title={`Ihr Rechenweg: Energiebilanz für ${formatDeZahl(simArea, 0)} m²`}
                  zielGleichung="Q_E = \frac{Q_h + Q_W + Q_{\text{Verl}}}{\eta \;\text{bzw.}\; \text{JAZ}} + W_{\text{Hilf}}"
                  schritte={[
                    {
                      titel: 'Transmissionswärmeverlust',
                      erklaerung: `Wärmetransferkoeffizient der Hülle H_T (inkl. Wärmebrückenzuschlag) mal Lehr-Klimafaktor ${formatDeZahl(simResults.f_klima_k, 0)} kKh/a, bezogen auf die Fläche:`,
                      formel: `Q_T = \\frac{${formatDeTeX(simResults.h_t, 1)}\\,\\text{W/K} \\cdot ${formatDeTeX(simResults.f_klima_k, 0)}\\,\\text{kKh/a}}{${formatDeTeX(simArea, 0)}\\,\\text{m}^2} = ${formatDeTeX(simResults.q_t_roh, 1)}\\,\\text{kWh/(m}^2\\text{a)}`
                    },
                    {
                      titel: 'Lüftungswärmeverlust',
                      erklaerung: `Mit V = 2,5 m · A_N und der wirksamen Luftwechselrate n = ${formatDeZahl(simResults.n_eff, 2)} 1/h:`,
                      formel: `H_V = 0{,}34 \\cdot ${formatDeTeX(simResults.n_eff, 2)} \\cdot ${formatDeTeX(simResults.v_netto, 0)} = ${formatDeTeX(simResults.h_v, 1)}\\,\\text{W/K} \\;\\Rightarrow\\; Q_V = ${formatDeTeX(simResults.q_v_roh, 1)}\\,\\text{kWh/(m}^2\\text{a)}`
                    },
                    {
                      titel: inhalt.werte.nutzbareWärmegewinne,
                      erklaerung: inhalt.werte.solareUndInterneGewinne,
                      formel: `\\eta \\cdot (Q_S + Q_I) = ${formatDeTeX(simResults.eta_ausnutzung, 2)} \\cdot (${formatDeTeX(simResults.q_solar, 1)} + ${formatDeTeX(simResults.q_intern, 0)}) = ${formatDeTeX(simResults.q_gewinne_roh, 1)}\\,\\text{kWh/(m}^2\\text{a)}`
                    },
                    {
                      titel: 'Nutzwärmebedarf',
                      erklaerung: inhalt.werte.verlusteMinusGewinneAuf,
                      formel: `Q_h = ${formatDeTeX(simResults.q_t_roh, 1)} + ${formatDeTeX(simResults.q_v_roh, 1)} - ${formatDeTeX(simResults.q_gewinne_roh, 1)} \\approx ${formatDeTeX(simResults.q_h, 0)}\\,\\text{kWh/(m}^2\\text{a)}`
                    },
                    {
                      titel: 'Endenergiebedarf',
                      erklaerung: simResults.istWP
                        ? `Wärme für Heizung, Warmwasser und Verteilverluste geteilt durch die Jahresarbeitszahl JAZ = ${formatDeZahl(simResults.jaz, 1)}, zuzüglich Hilfsstrom:`
                        : `Wärme für Heizung, Warmwasser und Verteilverluste geteilt durch den Erzeugernutzungsgrad η = ${formatDeZahl(simResults.eta_erzeuger, 2)}, zuzüglich Hilfsstrom:`,
                      formel: `Q_E = \\frac{${formatDeTeX(simResults.q_h, 0)} + ${formatDeTeX(simResults.q_w, 1)} + ${formatDeTeX(simResults.q_verlust_netz, 0)}}{${formatDeTeX(simResults.istWP ? simResults.jaz : simResults.eta_erzeuger, 2)}} + ${formatDeTeX(simResults.w_hilfsstrom, 1)} \\approx ${formatDeTeX(simResults.q_e, 0)}\\,\\text{kWh/(m}^2\\text{a)}`
                    },
                    {
                      titel: 'Primärenergiebedarf',
                      erklaerung: simResults.istWP
                        ? `Der Strom der Wärmepumpe wird mit dem Primärenergiefaktor f_p = ${formatDeZahl(simResults.f_p, 1)} bewertet:`
                        : `Brennstoff mit f_p = ${formatDeZahl(simResults.f_p, 1)}, Hilfsstrom mit f_p = ${formatDeZahl(simResults.fp_strom, 1)}:`,
                      formel: simResults.istWP
                        ? `Q_P = ${formatDeTeX(simResults.q_e, 0)} \\cdot ${formatDeTeX(simResults.f_p, 1)} \\approx ${formatDeTeX(simResults.q_p, 0)}\\,\\text{kWh/(m}^2\\text{a)}`
                        : `Q_P = ${formatDeTeX((simResults.q_h + simResults.q_w + simResults.q_verlust_netz) / simResults.eta_erzeuger, 1)} \\cdot ${formatDeTeX(simResults.f_p, 1)} + ${formatDeTeX(simResults.w_hilfsstrom, 1)} \\cdot ${formatDeTeX(simResults.fp_strom, 1)} \\approx ${formatDeTeX(simResults.q_p, 0)}\\,\\text{kWh/(m}^2\\text{a)}`
                    }
                  ]}
                  ergebnisHinweis={`Effizienzklasse ${simResults.klasse} ergibt sich aus dem Endenergiebedarf Q_E. Vereinfachte Lehrbilanz – kein Ersatz für eine Berechnung nach DIN V 18599.`}
                  normQuelle={inhalt.werte.dinV18599Gmodg}
                />

              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRAXIS, REBOUND & RECHT */}
        {activeTab === 'praxis_recht' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Prebound vs. Rebound */}
            <div>
              <h3 className="font-bold text-text-main text-base mb-2"><MdText text={inhalt.texte.dieDiskrepanzZwischenBedarf} /></h3>
              <p className="text-xs text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.inDerPraxisWeichen} /></p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                  <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5 mb-2">
                    <TrendingDown size={16} /><MdText text={inhalt.texte.derPreboundEffektIm} /></h4>
                  <p className="text-xs text-amber-950/80 leading-relaxed"><MdText text={inhalt.texte.beiUnsaniertenAltbautenKlassen} /></p>
                  <ul className="text-xxs text-amber-900/90 space-y-1 list-disc pl-4 mt-2">
                    <li><MdText text={inhalt.texte.bewohnerHeizenAusKostengründen} /></li>
                    <li><MdText text={inhalt.texte.schlafzimmerFlureOderGästezimmer} /></li>
                    <li><MdText text={inhalt.texte.nachtsUndBeiAbwesenheit} /></li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5 mb-2">
                    <ArrowUpRight size={16} /><MdText text={inhalt.texte.derReboundEffektNach} /></h4>
                  <p className="text-xs text-blue-950/80 leading-relaxed"><MdText text={inhalt.texte.nachEinerTeurenSanierung} /></p>
                  <ul className="text-xxs text-blue-900/90 space-y-1 list-disc pl-4 mt-2">
                    <li><MdText text={inhalt.texte.weilHeizenKaumNoch} /></li>
                    <li><MdText text={inhalt.texte.fensterWerdenImWinter} /></li>
                    <li><MdText text={inhalt.texte.rechnerischErhoffteEinsparungenWerden} /></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Rechtliche Pflichten nach GEG */}
            <div className="pt-4 border-t border-home-grau/20">
              <h3 className="font-bold text-text-main text-base mb-3 flex items-center gap-2">
                <Scale size={18} className="text-shiraz" /><MdText text={inhalt.texte.gesetzlichePflichtenNachGmodg} /></h3>

              <div className="space-y-3 text-xs text-text-main/80">
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/30">
                  <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.vorlageUndÜbergabepflichtBei} /></strong><MdText text={inhalt.texte.beimVerkaufOderDer} /></div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/30">
                  <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.pflichtangabenInImmobilienanzeigen87} /></strong><MdText text={inhalt.texte.inKommerziellenAnzeigenZ} /></div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/30">
                  <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.gültigkeitModernisierungsempfehlungen79A} /></strong><MdText text={inhalt.texte.energieausweiseSindGenau10} /></div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/30">
                  <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.aushangpflichtInÖffentlichenGebäuden} /></strong><MdText text={inhalt.texte.inBehördlichenGebäudenMit} /></div>
              </div>
            </div>

          </div>
        )}

        </ModuleTabs>
      </div>      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1EndUnd}
        zielGleichung="Q_P = \sum_i Q_{E,i} \cdot f_{P,i}"
        schritte={inhalt.daten["Energieausweis.schritte"]}
        ergebnisHinweis={inhalt.werte.beiGleicherGebäudehülleHalbiert}
        normQuelle={inhalt.werte.gmodgGegAnlage4}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2GebäudenutzflächeUnd}
        zielGleichung="A_N = 0{,}32\,\text{m}^{-1} \cdot V_e"
        schritte={inhalt.daten["Energieausweis.schritte_2"]}
        ergebnisHinweis={inhalt.werte.derBezugAufA}
        normQuelle={inhalt.werte.gmodgGebäudenutzflächeAN}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="energieausweis" />

      {/* Standardisierter Footer */}
      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap6}
wikipedia={[
          { title: 'Energieausweis', url: 'https://de.wikipedia.org/wiki/Energieausweis' },
          { title: 'Gebäudeenergiegesetz', url: 'https://de.wikipedia.org/wiki/Geb%C3%A4udemodernisierungsgesetz' },
          { title: 'DIN V 18599', url: 'https://de.wikipedia.org/wiki/DIN_V_18599' }
        ]}
        literatur={inhalt.daten["Energieausweis.literatur"]}
        regelwerke={inhalt.daten["Energieausweis.regelwerke"]}
        formeln={
          activeTab === 'annahmen_berechnung' || activeTab === 'simulator'
            ? inhalt.daten.Energieausweis
            : inhalt.daten.Energieausweis_2
        }
      />
    </div>
  );
}
