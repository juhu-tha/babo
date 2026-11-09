import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '../components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  Leaf, 
  Droplets, 
  Sun, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  ShieldAlert, 
  Thermometer, 
  Activity, 
  Beaker 
} from 'lucide-react';
import { useTabContext } from '../contexts/TabContext';
import { motion } from 'motion/react';
import inhalt from '@/content/weitereorganik/WeitereOrganik.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ErgebnisAnsage } from '@/src/components/ui/ErgebnisAnsage';

function DynamicInteractiveDegradationCalculator() {
  const [material, setMaterial] = useState<'bitumen' | 'pvc' | 'hemp' | 'cork'>('bitumen');
  const [uvExposure, setUvExposure] = useState<number>(3); // 1-5 scale
  const [moisture, setMoisture] = useState<number>(3); // 1-5 scale
  const [tempCycles, setTempCycles] = useState<number>(3); // 1-5 scale
  const [chemicalLoad, setChemicalLoad] = useState<number>(1); // 1-5 scale (soils, acids, salts)
  const [hasUvStabilizer, setHasUvStabilizer] = useState<boolean>(false);
  const [hasHydrophobicSeal, setHasHydrophobicSeal] = useState<boolean>(false);
  const [showFormulas, setShowFormulas] = useState<boolean>(false);

  // Calculate projected lifetime & current degradation level (stages)
  const baseLifetime = {
    bitumen: 35,
    pvc: 45,
    hemp: 15,
    cork: 50,
  };

  const calculateDegradation = () => {
    // Factors weight
    const uvWeight = material === 'bitumen' ? 2.5 : material === 'pvc' ? 3.0 : material === 'hemp' ? 1.5 : 1.0;
    const moistureWeight = material === 'hemp' ? 3.5 : material === 'bitumen' ? 1.5 : material === 'cork' ? 1.8 : 1.0;
    const tempWeight = material === 'bitumen' ? 2.0 : material === 'pvc' ? 1.5 : material === 'hemp' ? 1.0 : 1.0;
    const chemWeight = material === 'pvc' ? 2.0 : material === 'bitumen' ? 1.8 : material === 'hemp' ? 2.5 : 1.5;

    // Apply modifiers
    const uvEff = uvExposure * (hasUvStabilizer ? 0.4 : 1.0);
    const moistEff = moisture * (hasHydrophobicSeal ? 0.35 : 1.0);

    const degradationScore = (
      (uvEff * uvWeight) + 
      (moistEff * moistureWeight) + 
      (tempCycles * tempWeight) + 
      (chemicalLoad * chemWeight)
    ) / 10;

    // Lifetime years (base reduced by degradation)
    const factorRatio = Math.max(0.15, 1 - (degradationScore / 6.5)); // Lehrmodell (qualitativ): Faktor 6,5 = Punktzahl ohne Restnutzung
    const projectedLifetime = Math.round(baseLifetime[material] * factorRatio);

    // Degradation rate % per 10 years
    const abbauJe10Jahre = Math.min(100, Math.round((degradationScore / 4.5) * 45));

    return {
      degradationScore: parseFloat(degradationScore.toFixed(2)),
      projectedLifetime,
      abbauJe10Jahre,
    };
  };

  const { degradationScore, projectedLifetime, abbauJe10Jahre } = calculateDegradation();

  // Selected material specific detailed information block
  const materialDetails = inhalt.daten["DynamicInteractiveDegradationCalculator.materialDetails"];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6 mt-6">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Beaker className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.haltbarkeitsAlterungsSimulatorFür} /></h4>
        <p className="text-xs text-slate-550 mt-0.5"><MdText text={inhalt.texte.simulierenSieDenEinfluss} /></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Parameters / Controls */}
        <div className="lg:col-span-6 space-y-4">
          {/* Material selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider"><MdText text={inhalt.texte.organischenBaustoffWählen} /></span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => { setMaterial('bitumen'); setHasUvStabilizer(false); setHasHydrophobicSeal(false); }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${material === 'bitumen' ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              ><MdText text={inhalt.texte.bitumenbahnDach} /></button>
              <button 
                onClick={() => { setMaterial('pvc'); setHasUvStabilizer(false); setHasHydrophobicSeal(false); }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${material === 'pvc' ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              ><MdText text={inhalt.texte.kunststoffPvcFolie} /></button>
              <button 
                onClick={() => { setMaterial('hemp'); setHasUvStabilizer(false); setHasHydrophobicSeal(false); }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${material === 'hemp' ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              ><MdText text={inhalt.texte.hanffaserdämmung} /></button>
              <button 
                onClick={() => { setMaterial('cork'); setHasUvStabilizer(false); setHasHydrophobicSeal(false); }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${material === 'cork' ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              ><MdText text={inhalt.texte.naturkorkplatte} /></button>
            </div>
          </div>

          {/* Environmental sliders */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider"><MdText text={inhalt.texte.klimaUmweltbelastung} /></h5>
            
            {/* UV exposure */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-amber-500" /><MdText text={inhalt.texte.uvStrahlungsintensitätFotoAktivität} /></span>
                <span className="font-bold">{formatDeWert(uvExposure)}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={uvExposure} aria-label="UV-Strahlungsintensität" aria-valuetext={`Stufe ${formatDeWert(uvExposure)} von 5`} onChange={(e) => setUvExposure(parseInt(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Moisture loading */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-sky-500" /><MdText text={inhalt.texte.dauernässeFeuchteklasseHydrolyserisiko} /></span>
                <span className="font-bold">{formatDeWert(moisture)}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={moisture} aria-label="Dauernässe / Feuchteklasse" aria-valuetext={`Stufe ${formatDeWert(moisture)} von 5`} onChange={(e) => setMoisture(parseInt(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Temperature Cycles */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-red-500" /><MdText text={inhalt.texte.thermischeZyklenTWechsel} /></span>
                <span className="font-bold">{formatDeWert(tempCycles)}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={tempCycles} aria-label="Thermische Zyklen" aria-valuetext={`Stufe ${formatDeWert(tempCycles)} von 5`} onChange={(e) => setTempCycles(parseInt(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Chemical attacks */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1"><Beaker className="w-3.5 h-3.5 text-indigo-500" /><MdText text={inhalt.texte.chemischeBeanspruchungSäurenSalze} /></span>
                <span className="font-bold">{formatDeWert(chemicalLoad)}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={chemicalLoad} aria-label="Chemische Beanspruchung" aria-valuetext={`Stufe ${formatDeWert(chemicalLoad)} von 5`} onChange={(e) => setChemicalLoad(parseInt(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>
          </div>

          {/* Protective additives toggle */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider"><MdText text={inhalt.texte.rezepturModifikationSchutzmaßnahmen} /></span>
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex-1 flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer bg-white text-xs select-none hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" checked={hasUvStabilizer} 
                  onChange={(e) => setHasUvStabilizer(e.target.checked)}
                  disabled={material === 'hemp'}
                  className="w-4 h-4 accent-shiraz text-white" 
                />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800"><MdText text={inhalt.texte.copolymerUvSchutz} /></span>
                  <span className="text-xs text-slate-500"><MdText text={inhalt.texte.rußBesendungOderHals} /></span>
                </div>
              </label>

              <label className="flex-1 flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer bg-white text-xs select-none hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" checked={hasHydrophobicSeal} 
                  onChange={(e) => setHasHydrophobicSeal(e.target.checked)}
                  className="w-4 h-4 accent-shiraz text-white" 
                />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800"><MdText text={inhalt.texte.hydrophobicImprägn} /></span>
                  <span className="text-xs text-slate-500"><MdText text={inhalt.texte.borsalzSodaOdElastomer} /></span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Simulation Outputs */}
        <div className="lg:col-span-6 flex flex-col justify-between border-l border-slate-100 lg:pl-6 gap-5">
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 flex flex-col gap-4 text-slate-800">
            <h5 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2"><MdText text={inhalt.texte.lebensdauerPrognoseSchadensfortschritt} /></h5>

            <ErgebnisAnsage text={`Prognostizierte Standzeit ${formatDeWert(projectedLifetime)} Jahre, Qualitätsabbau in 10 Jahren ${abbauJe10Jahre} %`} />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-xl border border-slate-150 text-center">
                <span className="text-xs text-slate-450 uppercase font-bold tracking-wider"><MdText text={inhalt.texte.prognostizierteStandzeit} /></span>
                <span className="block text-3xl font-black text-shiraz mt-1 font-mono">{formatDeWert(projectedLifetime)} Jahre</span>
                <span className="text-xs text-slate-550 mt-0.5 block"><MdText text={inhalt.texte.erwarteterFunktionserhalt} /></span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-150 text-center">
                <span className="text-xs text-slate-450 uppercase font-bold tracking-wider"><MdText text={inhalt.texte.qualitätsabbruchIn10J} /></span>
                <span className="block text-3xl font-black text-slate-850 mt-1 font-mono">{abbauJe10Jahre}%</span>
                <span className="text-xs text-slate-550 mt-0.5 block"><MdText text={inhalt.texte.ebenenAbbauVerschleiß} /></span>
              </div>
            </div>

            {/* Degradation bar representation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 uppercase">
                <span><MdText text={inhalt.texte.zersetzungsgeschwindigkeitDegradationsra} /></span>
                <span className="font-mono text-shiraz">{formatDeWert(Math.round(degradationScore * 15))}%</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300">
                <motion.div 
                  className="bg-shiraz h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, degradationScore * 15)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span><MdText text={inhalt.texte.t0StabilInert} /></span>
                <span><MdText text={inhalt.texte.zersetzungNachCa5} /></span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-shiraz/5 border border-shiraz/10 text-xs text-slate-800 space-y-2">
            <h6 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-shiraz block animate-pulse"></span><MdText text={inhalt.texte.schadensmerkmaleDesWerkstoffs} /></h6>
            <div className="space-y-1.5 font-medium">
              <p>🟢 <strong className="text-slate-950">Material:</strong> {materialDetails[material].title}</p>
              <p>💥 <strong className="text-slate-950">Zersetzungs-Mechanismus:</strong> {materialDetails[material].agingMechanism}</p>
              <p>🚨 <strong className="text-slate-950"><MdText text={inhalt.texte.optischeWarnsignale} /></strong> {materialDetails[material].warningSign}</p>
              <p>🛡️ <strong className="text-slate-950">Präventions-Strategie:</strong> {materialDetails[material].remedy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive formulas box */}
      <div className="border-t border-slate-100 pt-4 mt-2">
        <button
          onClick={() => setShowFormulas(!showFormulas)}
          className="flex items-center justify-between w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <span className="flex items-center gap-1.5 text-slate-800">
            <Activity className="w-4 h-4 text-shiraz animate-pulse shrink-0" /><MdText text={inhalt.texte.mathematischePhysikalischChemischeAlteru} /></span>
          <span className="text-xs bg-shiraz/10 text-shiraz px-2 py-0.5 rounded-full font-mono shrink-0">
            {showFormulas ? inhalt.werte.schliessen : 'ANZEIGEN ▼'}
          </span>
        </button>

        {showFormulas && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-4 sm:p-5 bg-off-white text-text-main rounded-xl border border-home-grau/30 space-y-4 font-sans text-xs sm:text-sm"
          >
            <h5 className="font-bold text-text-main border-b border-home-grau/30 pb-2 text-xs uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" /><MdText text={inhalt.texte.wissenschaftlicheHerleitungZersetzungski} /></h5>

            <div className="space-y-4">
              {/* Formula 1: Arrhenius Equation */}
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-home-grau/30">
                <p className="font-semibold text-amber-700 text-xs uppercase mb-1"><MdText text={inhalt.texte.t1ThermischPhysikalischeAlterung} /></p>
                <div className="flex flex-col md:flex-row items-center gap-4 py-2 justify-center bg-off-white my-2 rounded-lg border border-home-grau/30">
                  <div className="text-base sm:text-lg font-mono font-bold text-text-main tracking-wide border-b md:border-b-0 md:border-r border-home-grau/30 pb-2 md:pb-0 md:pr-4"><MdText text={inhalt.texte.kTAE} /></div>
                  <div className="text-xs text-slate-600 max-w-md font-medium leading-relaxed"><MdText text={inhalt.texte.regeltDieGeschwindigkeit} /><strong className="text-text-main">k</strong><MdText text={inhalt.texte.chemischerAlterungsreaktionenZB} /><strong className="text-text-main"><MdText text={inhalt.texte.tInKelvin} /></strong>. <strong className="text-text-main">E<sub>A</sub></strong><MdText text={inhalt.texte.istDieAktivierungsenergie} /><strong className="text-text-main">R</strong><MdText text={inhalt.texte.dieAllgemeineGaskonstanteUnd} /><strong className="text-text-main">A</strong><MdText text={inhalt.texte.derFrequenzfaktorEineTemperaturerhöhung} /></div>
                </div>
              </div>

              {/* Formula 2: Photooxidation / Light Weathering */}
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-home-grau/30">
                <p className="font-semibold text-sky-700 text-xs uppercase mb-1"><MdText text={inhalt.texte.t2SolarePhotooxidationUv} /></p>
                <div className="flex flex-col md:flex-row items-center gap-4 py-2 justify-center bg-off-white my-2 rounded-lg border border-home-grau/30">
                  <div className="text-base sm:text-lg font-mono font-bold text-text-main tracking-wide border-b md:border-b-0 md:border-r border-home-grau/30 pb-2 md:pb-0 md:pr-4"><MdText text={inhalt.texte.vSubPhotoSub} /></div>
                  <div className="text-xs text-slate-600 max-w-md font-medium leading-relaxed"><MdText text={inhalt.texte.beschreibtDasAusmaßDes} /><strong className="text-text-main">v<sub>Photo</sub></strong><MdText text={inhalt.texte.hängtVonDerQuantenausbeute} /><strong className="text-text-main">&Phi;</strong><MdText text={inhalt.texte.derSolarenAnfangsintensität} /><strong className="text-text-main">I<sub>0</sub></strong><MdText text={inhalt.texte.demExtinktionskoeffizienten} /><strong className="text-text-main">&epsilon;</strong><MdText text={inhalt.texte.undDerSchichtdicke} /><strong className="text-text-main">d</strong><MdText text={inhalt.texte.abIntegrierteUvStabilisatoren} /><strong className="text-text-main"><MdText text={inhalt.texte.copolymerModifierfaktorFSub} /></strong>.
                  </div>
                </div>
              </div>

              {/* Formula 3: Sedlbauer Biological Deterioration */}
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-home-grau/30">
                <p className="font-semibold text-emerald-700 text-xs uppercase mb-1"><MdText text={inhalt.texte.t3BiologischerAbbauVon} /></p>
                <div className="flex flex-col md:flex-row items-center gap-4 py-2 justify-center bg-off-white my-2 rounded-lg border border-home-grau/30">
                  <div className="text-base sm:text-lg font-mono font-bold text-text-main tracking-wide border-b md:border-b-0 md:border-r border-home-grau/30 pb-2 md:pb-0 md:pr-4"><MdText text={inhalt.texte.vSubBioSub} /></div>
                  <div className="text-xs text-slate-600 max-w-md font-medium leading-relaxed"><MdText text={inhalt.texte.giltFürHanffasernUnd} /><strong className="text-text-main"><MdText text={inhalt.texte.subWoodSub20} /></strong><MdText text={inhalt.texte.vorausDieWachstumsgeschwindigkeitDes} /><strong className="text-text-main">v<sub>Bio</sub></strong><MdText text={inhalt.texte.skaliertLinearMitDer} /><strong className="text-text-main"><MdText text={inhalt.texte.subCritSubT} /></strong><MdText text={inhalt.texte.undWirdDurchImprägnierungen} /><strong className="text-text-main">f<sub>pH</sub> = 0,35</strong>).
                  </div>
                </div>
              </div>

              {/* Formula 4: Bitumen Colloidal State Transformation */}
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-home-grau/30">
                <p className="font-semibold text-rose-700 text-xs uppercase mb-1"><MdText text={inhalt.texte.t4BitumenStrukturtransformationsKennzahl} /></p>
                <div className="flex flex-col md:flex-row items-center gap-4 py-2 justify-center bg-off-white my-2 rounded-lg border border-home-grau/30">
                  <div className="text-base sm:text-lg font-mono font-bold text-text-main tracking-wide border-b md:border-b-0 md:border-r border-home-grau/30 pb-2 md:pb-0 md:pr-4"><MdText text={inhalt.texte.iSubCSub} /></div>
                  <div className="text-xs text-slate-600 max-w-md font-medium leading-relaxed"><MdText text={inhalt.texte.inDerAsphaltchemieBewertet} /><strong className="text-text-main">I<sub>C</sub></strong><MdText text={inhalt.texte.denAlterungszustandFrischBitumen} /><strong className="text-text-main">I<sub>C</sub></strong><MdText text={inhalt.texte.erhöhtBitumenWandeltSich} /></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function OrganicThematicLinks({ current }: { current: 'baustoffe' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 mt-6">
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadOrganischeBaustoffe} /></h4>
        <p className="text-xs text-slate-600 font-medium mt-0.5"><MdText text={inhalt.texte.verbindeDieTheorieDer} /></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('kunststoffe')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoffe'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoffe'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoffe' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.chemieDerKunststoffeMaterial} /></span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.stufenpolymerePolymerisatSyntheseThermis} /></span>
          {current !== 'baustoffe' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Dauerhaftigkeit */}
        <button
          onClick={() => setActiveTab('weitere_organik')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.verwitterungAlterungDauerhaftigkeit} /></span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.bitumenalterungWeichmachermigrationBioab} /></span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function WeitereOrganik() {
  const [activeSubTab, setActiveSubTab] = useState<'uebersicht' | 'bitumen' | 'kunststoffe' | 'nawaro'>('uebersicht');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Module Title */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-850 flex items-center gap-2">
          <Leaf className="w-6 h-6 text-shiraz" /><MdText text={inhalt.texte.korrosionVerwitterungOrganischerBaustoff} /></h2>
        <p className="text-slate-500 text-sm mt-1"><MdText text={inhalt.texte.grundgesetzeDerPhysikalischChemischen} /></p>
      </div>

      {/* Internal Navigation Buttons */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {(['uebersicht', 'bitumen', 'kunststoffe', 'nawaro'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              activeSubTab === tab 
                ? 'bg-shiraz border-shiraz text-white shadow-sm' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {tab === 'uebersicht' ? inhalt.werte.übersicht : tab === 'bitumen' ? inhalt.werte.bitumenAsphalte : tab === 'kunststoffe' ? inhalt.werte.polymereKunststoffe : inhalt.werte.nawaroNaturfasern}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: OVERVIEW */}
      {activeSubTab === 'uebersicht' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl leading-relaxed text-sm text-slate-700">
            <h3 className="font-bold text-slate-900 text-base mb-2"><MdText text={inhalt.texte.warumAltertOrganikAnders} /></h3>
            <p className="mb-3"><MdText text={inhalt.texte.imGegensatzZurElektrochemischen} /></p>
            <p><MdText text={inhalt.texte.kohlenstoffbasierteBaustoffeSindThermody} /></p>
          </div>

          {/* Triad of Organic Corrosion */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                <Sun className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.solarChemischeKorrosion} /></h4>
              <p className="text-xs text-slate-550 leading-relaxed"><MdText text={inhalt.texte.uvEinstrahlungInitiiertRadikalreaktionen} /></p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-shiraz">
                <Thermometer className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.thermischPhysikalischeBeanspruchung} /></h4>
              <p className="text-xs text-slate-550 leading-relaxed"><MdText text={inhalt.texte.hoheTemperaturenBeschleunigenOxidationsr} /></p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Leaf className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.biologischerAbbau} /></h4>
              <p className="text-xs text-slate-550 leading-relaxed"><MdText text={inhalt.texte.nachwachsendeNaturfasernUndFüllstoffe} /></p>
            </div>
          </div>

          {/* Integration of Simulator */}
          <DynamicInteractiveDegradationCalculator />
        </div>
      )}

      {/* SUBTAB 2: BITUMEN */}
      {activeSubTab === 'bitumen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-lg font-bold text-slate-850 flex items-center gap-2"><MdText text={inhalt.texte.kolloidalerAufbauUndAlterung} /></h3>
              <p className="text-sm text-slate-700 leading-relaxed"><MdText text={inhalt.texte.bitumenIstEinKomplexes} /></p>

              <div className="bg-stone-50 p-4 rounded-xl border border-slate-200">
                <ul className="space-y-3 text-xs text-slate-700">
                  <li><MdText text={inhalt.texte.asphalteneDispersePhaseHochkondensierte} /></li>
                  <li><MdText text={inhalt.texte.malteneKontinuierlichePhaseBestehend} /></li>
                </ul>
              </div>

              <h4 className="font-bold text-slate-850 text-sm mt-3"><MdText text={inhalt.texte.derAlterungsprozessOxidatationsalterung} /></h4>
              <p className="text-xs text-slate-650 leading-relaxed"><MdText text={inhalt.texte.durchThermischeBeaufschlagungWährend} /></p>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-slate-800 space-y-1">
                <h5 className="font-bold text-amber-900"><MdText text={inhalt.texte.dieMakroskopischeFolgeDer} /></h5>
                <p><MdText text={inhalt.texte.derWerkstoffVerliertSeine} /></p>
                <p><MdText text={inhalt.texte.erWirdUnelastischSpröde} /></p>
                <p><MdText text={inhalt.texte.imLaborSteigtDas} /></p>
              </div>
            </div>

            <div className="md:col-span-5 space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
                <h4 className="font-bold text-slate-900 text-sm mb-3"><MdText text={inhalt.texte.laborwerteAlterungsreaktion} /></h4>
                <p className="mb-2 font-medium"><MdText text={inhalt.texte.zurCharakterisierungDerBitumenalterung} /></p>
                
                <div className="space-y-2 mb-4">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                    <span className="font-bold text-shiraz"><MdText text={inhalt.texte.rtfotVerfahrenDinEn} /></span>
                    <p className="text-slate-550 mt-1"><MdText text={inhalt.texte.rollingThinFilmOven} /></p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                    <span className="font-bold text-shiraz"><MdText text={inhalt.texte.pavAlterungDinEn} /></span>
                    <p className="text-slate-550 mt-1"><MdText text={inhalt.texte.pressureAgingVesselSimuliert} /></p>
                  </div>
                </div>

                <div className="bg-shiraz/5 p-3 rounded-xl border border-shiraz/15 font-semibold text-slate-800">
                  <span className="block text-xs font-bold text-shiraz uppercase mb-1"><MdText text={inhalt.texte.rheologischeKennzahlVerschiebung} /></span>
                  <div className="flex justify-between border-b border-shiraz/10 pb-1.5 pt-0.5 text-xs">
                    <span><MdText text={inhalt.texte.frischbitumenKlasse5070} /></span>
                    <span className="font-mono text-slate-600"><MdText text={inhalt.texte.epRuk4654} /></span>
                  </div>
                  <div className="flex justify-between pt-1.5 text-xs">
                    <span><MdText text={inhalt.texte.gealtertesBitumenNachPav} /></span>
                    <span className="font-mono text-xs text-red-600"><MdText text={inhalt.texte.epRuk68C} /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: KUNSTSTOFFE */}
      {activeSubTab === 'kunststoffe' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl leading-relaxed text-sm text-slate-700">
            <h3 className="font-bold text-slate-900 text-base mb-2"><MdText text={inhalt.texte.plastikKorrosionUvInduzierte} /></h3>
            <p className="mb-3"><MdText text={inhalt.texte.moderneThermoplasteWiePolyvinylchlorid} /></p>
            <p><MdText text={inhalt.texte.dieseKettenbrücheSetzenAutokatalytische} /></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">Mechanismus</span>
              <h4 className="font-bold text-slate-850 text-sm"><MdText text={inhalt.texte.weichmacherAuswanderungMigration} /></h4>
              <p className="text-xs text-slate-650 leading-relaxed mb-2"><MdText text={inhalt.texte.pvcIstVonNatur} /></p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 font-mono text-xs text-slate-700">
                <span><MdText text={inhalt.texte.migrationVerflüchtigungPlastikversprödun} /></span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest block">Schadensbild</span>
              <h4 className="font-bold text-slate-850 text-sm"><MdText text={inhalt.texte.kreidungAbkreiden} /></h4>
              <p className="text-xs text-slate-650 leading-relaxed mb-2"><MdText text={inhalt.texte.beiDerSolarkorrosionZersetzen} /></p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 font-mono text-xs text-slate-700">
                <span><MdText text={inhalt.texte.fotoKettenbruchZersetzungBindemittel} /></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: NAWARO */}
      {activeSubTab === 'nawaro' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-8 space-y-4">
              <h3 className="text-lg font-bold text-slate-850 flex items-center gap-2"><MdText text={inhalt.texte.biologischeKorrosionVonNaturbaustoffen} /></h3>
              <p className="text-sm text-slate-700 leading-relaxed"><MdText text={inhalt.texte.nachwachsendeRohstoffeNawaroWie} /></p>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3"><MdText text={inhalt.texte.dieDreiMikrobiellenFeinde} /></h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-150 flex flex-col gap-1">
                    <span className="text-xs font-bold text-shiraz"><MdText text={inhalt.texte.t1Schimmelpilze} /></span>
                    <p className="text-xs text-slate-550 leading-relaxed"><MdText text={inhalt.texte.zersetzenHolzOderFaserkörper} /></p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-150 flex flex-col gap-1">
                    <span className="text-xs font-bold text-shiraz"><MdText text={inhalt.texte.t2Moderfäule} /></span>
                    <p className="text-xs text-slate-550 leading-relaxed"><MdText text={inhalt.texte.wirdDurchAscomycetenIm} /></p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-150 flex flex-col gap-1">
                    <span className="text-xs font-bold text-shiraz"><MdText text={inhalt.texte.t3Trockenfäule} /></span>
                    <p className="text-xs text-slate-550 leading-relaxed"><MdText text={inhalt.texte.erregerWieDerBraunk} /></p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-250 text-xs text-slate-750 leading-relaxed"><MdText text={inhalt.texte.zentralerLeitsatzDerÖkologischen} /><p className="mt-1"><MdText text={inhalt.texte.derChemischeHolzUnd} /></p>
              </div>
            </div>

            <div className="md:col-span-4 bg-white border border-slate-200 p-4 rounded-xl space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block"><MdText text={inhalt.texte.brandschutzVsBioschutz} /></span>
              <h4 className="font-bold text-slate-850 text-sm"><MdText text={inhalt.texte.mineralisierungImprägnierung} /></h4>
              <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.umHanfwollmattenOderEinblaszellulose} /></p>
              
              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
                  <span className="font-semibold text-slate-800">Bor-Imprägnierung</span>
                  <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.zellulosefasernWerdenMitBorsalzen} /></p>
                </div>
                <div className="bg-slate-55/70 p-2 rounded-lg border border-slate-150">
                  <span className="font-semibold text-slate-800"><MdText text={inhalt.texte.sodaAmmoniumsalze} /></span>
                  <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.ökologischeAlternativeErhöhtDen} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thematic Path Links */}
      <OrganicThematicLinks current="dauerhaftigkeit" />

      {/* Footer metadata */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1BeschleunigungDer}
        zielGleichung="\frac{k(T_2)}{k(T_1)} = \exp\left[\frac{E_A}{R}\left(\frac{1}{T_1} - \frac{1}{T_2}\right)\right]"
        schritte={inhalt.daten["WeitereOrganik.schritte"]}
        ergebnisHinweis={inhalt.werte.dasBestätigtDieRgt}
        normQuelle={inhalt.werte.arrhenius1889Iso15686}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2FaktorenmethodeFür}
        zielGleichung="ESL = RSL \cdot A \cdot B \cdot C \cdot D \cdot E \cdot F \cdot G"
        schritte={inhalt.daten["WeitereOrganik.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dieFaktorenABis}
        normQuelle={inhalt.werte.iso156861Faktorenmethode}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="weitere_organik" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap10}
        wikipedia={[
          { title: inhalt.werte.organischeChemie, url: 'https://de.wikipedia.org/wiki/Organische_Chemie' },
          { title: 'Polymer', url: 'https://de.wikipedia.org/wiki/Polymer' },
          { title: 'Dämmstoff', url: 'https://de.wikipedia.org/wiki/D%C3%A4mmstoff' }
        ]}
        regelwerke={inhalt.daten["WeitereOrganik.regelwerke"]}
        literatur={inhalt.daten["WeitereOrganik.literatur"]}
        formeln={inhalt.daten["WeitereOrganik.formeln"]}
      />
    </div>
  );
}
