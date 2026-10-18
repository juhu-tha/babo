import React, { useState } from 'react';
import { ModuleFooter } from '../components/ui/ModuleFooter';
import { 
  Leaf, 
  Droplets, 
  Sun, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  ShieldAlert, 
  Thermometer, 
  Flame, 
  Percent, 
  Activity, 
  Clock, 
  Lightbulb, 
  Beaker 
} from 'lucide-react';
import { useTabContext } from '../contexts/TabContext';
import { motion } from 'motion/react';
import { FormulaText } from '../components/ui/FormulaText';

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
    let uvWeight = material === 'bitumen' ? 2.5 : material === 'pvc' ? 3.0 : material === 'hemp' ? 1.5 : 1.0;
    let moistureWeight = material === 'hemp' ? 3.5 : material === 'bitumen' ? 1.5 : material === 'cork' ? 1.8 : 1.0;
    let tempWeight = material === 'bitumen' ? 2.0 : material === 'pvc' ? 1.5 : material === 'hemp' ? 1.0 : 1.0;
    let chemWeight = material === 'pvc' ? 2.0 : material === 'bitumen' ? 1.8 : material === 'hemp' ? 2.5 : 1.5;

    // Apply modifiers
    let uvEff = uvExposure * (hasUvStabilizer ? 0.4 : 1.0);
    let moistEff = moisture * (hasHydrophobicSeal ? 0.35 : 1.0);

    const degradationScore = (
      (uvEff * uvWeight) + 
      (moistEff * moistureWeight) + 
      (tempCycles * tempWeight) + 
      (chemicalLoad * chemWeight)
    ) / 10;

    // Lifetime years (base reduced by degradation)
    const factorRatio = Math.max(0.15, 1 - (degradationScore / 6.5));
    const projectedLifetime = Math.round(baseLifetime[material] * factorRatio);

    // Degradation rate % per 10 years
    const 十YearsDegradation = Math.min(100, Math.round((degradationScore / 4.5) * 45));

    return {
      degradationScore: parseFloat(degradationScore.toFixed(2)),
      projectedLifetime,
      十YearsDegradation,
    };
  };

  const { degradationScore, projectedLifetime, 十YearsDegradation } = calculateDegradation();

  // Selected material specific detailed information block
  const materialDetails = {
    bitumen: {
      title: 'Bitumen & Bitumenbahnen',
      agingMechanism: 'Oxidation (Verlust geschmeidiger Maltene, Akkumulation spröder Asphaltene), thermische Rissbildung.',
      warningSign: 'Haarrisse, Blasenbildung, Elastizitätsverlust (Versprödung am Winter-Biegepunkt).',
      remedy: 'Kiesabdeckung (Sonnenschutz), Schieferungsbesendung, Elastomer-Modifizierung (SBS/APP).',
    },
    pvc: {
      title: 'Kunststoffe / PVC & Polyolefine',
      agingMechanism: 'Weichmacher-Migration (Verflüchtigung), UV-Kettenbruch (Photooxidation), Chlorabspaltung.',
      warningSign: 'Gelbverfärbung, Abkreiden, Versprödung der Außenseite, Festigkeitsverlust.',
      remedy: 'Soot (carbon black) Additive, UV-Stabilisatoren (HALS Co-Polymere), phtalatfreie Trägerpolymere.',
    },
    hemp: {
      title: 'NaWaRo / Hanf- & Strohdämmstoffe',
      agingMechanism: 'Biologischer Pilzabbau (Zellulose-Zersetzung bei u > 15%), Kapillarfäule, Schimmelbildung.',
      warningSign: 'Dunkelbraune Zersetzungsflecken, modriger Geruch, Bausch-Volumenkollaps, Feuchtenester.',
      remedy: 'Konstruktive Entwässerung (Hinterlüftung), Soda- oder Ammoniumsalz-Imprägnierung (Borratsalze).',
    },
    cork: {
      title: 'Naturkorkplatten (Naturmaterial)',
      agingMechanism: 'Frost-Sprengung bei stehender Nässe, chemisch-hydrolytischer Suberin-Abbau bei Dauernässe.',
      warningSign: 'Bröseln der Ecken, Schimmelpilz-Rasenbelag, Formänderung (Wölbung).',
      remedy: 'Diffusionsoffene Einbaudetails, diffusionsoffener Sorptionsschutz, bituminöse Bindung.',
    },
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6 mt-6">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Beaker className="w-5 h-5 text-shiraz" />
          Haltbarkeits- &amp; Alterungs-Simulator für Organik
        </h4>
        <p className="text-xs text-slate-550 mt-0.5">
          Simuliere den Einfluss von Außenklima, UV-Belastung und Materialqualität auf die chemisch-biologische Zersetzungsrate organischer Bausubstanzen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Parameters / Controls */}
        <div className="lg:col-span-6 space-y-4">
          {/* Material selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Organischen Baustoff wählen:</span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => { setMaterial('bitumen'); setHasUvStabilizer(false); setHasHydrophobicSeal(false); }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${material === 'bitumen' ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              >
                🛢️ Bitumenbahn (Dach)
              </button>
              <button 
                onClick={() => { setMaterial('pvc'); setHasUvStabilizer(false); setHasHydrophobicSeal(false); }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${material === 'pvc' ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              >
                🧪 Kunststoff (PVC-Folie)
              </button>
              <button 
                onClick={() => { setMaterial('hemp'); setHasUvStabilizer(false); setHasHydrophobicSeal(false); }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${material === 'hemp' ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              >
                🌱 Hanffaserdämmung
              </button>
              <button 
                onClick={() => { setMaterial('cork'); setHasUvStabilizer(false); setHasHydrophobicSeal(false); }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${material === 'cork' ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              >
                🪵 Naturkorkplatte
              </button>
            </div>
          </div>

          {/* Environmental sliders */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Klima- &amp; Umweltbelastung:</h5>
            
            {/* UV exposure */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-amber-500" /> UV-Strahlungsintensität (Foto-Aktivität)</span>
                <span className="font-bold">{uvExposure}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={uvExposure} onChange={(e) => setUvExposure(parseInt(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Moisture loading */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-sky-500" /> Dauernässe / Feuchteklasse (Hydrolyserisiko)</span>
                <span className="font-bold">{moisture}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={moisture} onChange={(e) => setMoisture(parseInt(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Temperature Cycles */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-red-500" /> Thermische Zyklen (T-Wechsel extreme)</span>
                <span className="font-bold">{tempCycles}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={tempCycles} onChange={(e) => setTempCycles(parseInt(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Chemical attacks */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1"><Beaker className="w-3.5 h-3.5 text-indigo-505" /> Chemische Beanspruchung (Säuren/Salze/Ozon)</span>
                <span className="font-bold">{chemicalLoad}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={chemicalLoad} onChange={(e) => setChemicalLoad(parseInt(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>
          </div>

          {/* Protective additives toggle */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Rezeptur-Modifikation &amp; Schutzmaßnahmen:</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex-1 flex items-center gap-2 p-2.5 rounded-xl border border-slate-205 cursor-pointer bg-white text-xs select-none hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" checked={hasUvStabilizer} 
                  onChange={(e) => setHasUvStabilizer(e.target.checked)}
                  disabled={material === 'hemp'}
                  className="w-4 h-4 accent-shiraz text-white" 
                />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">Copolymer / UV-Schutz</span>
                  <span className="text-xs text-slate-500">Ruß, Besendung oder HALS</span>
                </div>
              </label>

              <label className="flex-1 flex items-center gap-2 p-2.5 rounded-xl border border-slate-205 cursor-pointer bg-white text-xs select-none hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" checked={hasHydrophobicSeal} 
                  onChange={(e) => setHasHydrophobicSeal(e.target.checked)}
                  className="w-4 h-4 accent-shiraz text-white" 
                />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">Hydrophobic / Imprägn.</span>
                  <span className="text-xs text-slate-500">Borsalz, Soda od. Elastomer-Film</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Simulation Outputs */}
        <div className="lg:col-span-6 flex flex-col justify-between border-l border-slate-100 lg:pl-6 gap-5">
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 flex flex-col gap-4 text-slate-800">
            <h5 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              Lebensdauer-Prognose &amp; Schadensfortschritt
            </h5>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-xl border border-slate-150 text-center">
                <span className="text-xs text-slate-450 uppercase font-bold tracking-wider">Prognostizierte Standzeit</span>
                <span className="block text-3xl font-black text-shiraz mt-1 font-mono">{projectedLifetime} Jahre</span>
                <span className="text-xs text-slate-550 mt-0.5 block">Erwarteter Funktionserhalt</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-150 text-center">
                <span className="text-xs text-slate-450 uppercase font-bold tracking-wider">Qualitätsabbruch in 10 J.</span>
                <span className="block text-3xl font-black text-slate-850 mt-1 font-mono">{十YearsDegradation}%</span>
                <span className="text-xs text-slate-550 mt-0.5 block">Ebenen-Abbau (Verschleiß)</span>
              </div>
            </div>

            {/* Degradation bar representation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 uppercase">
                <span>Zersetzungsgeschwindigkeit / Degradationsrate:</span>
                <span className="font-mono text-shiraz">{Math.round(degradationScore * 15)}%</span>
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
                <span>0% (Stabil / inert)</span>
                <span>Zersetzung nach ca. 5 Jahren</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-shiraz/5 border border-shiraz/10 text-xs text-slate-800 space-y-2">
            <h6 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-shiraz block animate-pulse"></span>
              Schadensmerkmale des Werkstoffs:
            </h6>
            <div className="space-y-1.5 font-medium">
              <p>🟢 <strong className="text-slate-950">Material:</strong> {materialDetails[material].title}</p>
              <p>💥 <strong className="text-slate-950">Zersetzungs-Mechanismus:</strong> {materialDetails[material].agingMechanism}</p>
              <p>🚨 <strong className="text-slate-950">Optische Warnsignale:</strong> {materialDetails[material].warningSign}</p>
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
            <Activity className="w-4 h-4 text-shiraz animate-pulse shrink-0" />
            🔬 Mathematische &amp; Physikalisch-Chemische Alterungsmodelle &amp; Normative Grundlagen anzeigen
          </span>
          <span className="text-xs bg-shiraz/10 text-shiraz px-2 py-0.5 rounded-full font-mono shrink-0">
            {showFormulas ? 'SCHLIESSEN ▲' : 'ANZEIGEN ▼'}
          </span>
        </button>

        {showFormulas && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-4 sm:p-5 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 space-y-4 font-sans text-xs sm:text-sm"
          >
            <h5 className="font-bold text-white border-b border-slate-800 pb-2 text-xs uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Wissenschaftliche Herleitung &amp; Zersetzungskinetik
            </h5>

            <div className="space-y-4">
              {/* Formula 1: Arrhenius Equation */}
              <div className="bg-slate-900/60 p-3 sm:p-4 rounded-lg border border-slate-800/80">
                <p className="font-semibold text-amber-300 text-xs uppercase mb-1">1. Thermisch-Physikalische Alterung (Arrhenius-Gleichung)</p>
                <div className="flex flex-col md:flex-row items-center gap-4 py-2 justify-center bg-slate-950/80 my-2 rounded-lg border border-slate-900">
                  <div className="text-base sm:text-lg font-mono font-bold text-white tracking-wide border-b md:border-b-0 md:border-r border-slate-800 pb-2 md:pb-0 md:pr-4">
                    k(T) = A &middot; e<sup>&minus; E<sub>A</sub> / (R &middot; T)</sup>
                  </div>
                  <div className="text-xs text-slate-400 max-w-md font-medium leading-relaxed">
                    Regelt die Geschwindigkeit <strong className="text-white">k</strong> chemischer Alterungsreaktionen (z. B. Oxidationsvorgänge) als Funktion der absoluten Temperatur <strong className="text-white">T (in Kelvin)</strong>. <strong className="text-white">E<sub>A</sub></strong> ist die Aktivierungsenergie, <strong className="text-white">R</strong> die allgemeine Gaskonstante und <strong className="text-white">A</strong> der Frequenzfaktor. Eine Temperaturerhöhung um 10 &deg;C verdoppelt bis verdreifacht die Reaktionsrate (RGT-Regel).
                  </div>
                </div>
              </div>

              {/* Formula 2: Photooxidation / Light Weathering */}
              <div className="bg-slate-900/60 p-3 sm:p-4 rounded-lg border border-slate-800/80">
                <p className="font-semibold text-sky-400 text-xs uppercase mb-1">2. Solare Photooxidation &amp; UV-Kettenabbruch (Stark-Einstein-Kinetik)</p>
                <div className="flex flex-col md:flex-row items-center gap-4 py-2 justify-center bg-slate-950/80 my-2 rounded-lg border border-slate-900">
                  <div className="text-base sm:text-lg font-mono font-bold text-white tracking-wide border-b md:border-b-0 md:border-r border-slate-800 pb-2 md:pb-0 md:pr-4">
                    v<sub>Photo</sub> = &Phi; &middot; I<sub>0</sub> &middot; (1 &minus; e<sup>&minus; &epsilon; &middot; c &middot; d</sup>)
                  </div>
                  <div className="text-xs text-slate-400 max-w-md font-medium leading-relaxed">
                    Beschreibt das Ausmaß des Kettenbruchs von Polymeren (z. B. PVC, Bitumen) durch solare Strahlung. Die Abbaugeschwindigkeit <strong className="text-white">v<sub>Photo</sub></strong> hängt von der Quantenausbeute <strong className="text-white">&Phi;</strong>, der solaren Anfangsintensität <strong className="text-white">I<sub>0</sub></strong>, dem Extinktionskoeffizienten <strong className="text-white">&epsilon;</strong> und der Schichtdicke <strong className="text-white">d</strong> ab. Integrierte UV-Stabilisatoren (z. B. HALS) fangen gebildete Radikale ab und senken die Quantenausbeute <strong className="text-white">&Phi; (Copolymer Modifierfaktor f<sub>UV</sub> = 0.40)</strong>.
                  </div>
                </div>
              </div>

              {/* Formula 3: Sedlbauer Biological Deterioration */}
              <div className="bg-slate-900/60 p-3 sm:p-4 rounded-lg border border-slate-800/80">
                <p className="font-semibold text-emerald-400 text-xs uppercase mb-1">3. Biologischer Abbau von NaWaRo (Isoplethen-Modell nach Sedlbauer)</p>
                <div className="flex flex-col md:flex-row items-center gap-4 py-2 justify-center bg-slate-950/80 my-2 rounded-lg border border-slate-900">
                  <div className="text-base sm:text-lg font-mono font-bold text-white tracking-wide border-b md:border-b-0 md:border-r border-slate-800 pb-2 md:pb-0 md:pr-4">
                    v<sub>Bio</sub> = M<sub>crit</sub> &middot; [&phi;<sub>Wood</sub> &minus; &phi;<sub>crit</sub>(T)] &middot; f<sub>pH</sub>
                  </div>
                  <div className="text-xs text-slate-400 max-w-md font-medium leading-relaxed">
                    Gilt für Hanffasern und Stroh. Mikrobieller Pilzabbau setzt kritische Substratfeuchte <strong className="text-white">&phi;<sub>Wood</sub> &ge; 20 % Holzfeuchte</strong> voraus. Die Wachstumsgeschwindigkeit des Myzels <strong className="text-white">v<sub>Bio</sub></strong> skaliert linear mit der Überschreitung der kritischen, temperaturabhängigen Luftfeuchtegrenze <strong className="text-white">&phi;<sub>crit</sub>(T) (LIM - Lowest Isopleth for Mold)</strong> und wird durch Imprägnierungen (Borsalze, Soda) modifiziert (<strong className="text-white">f<sub>pH</sub> = 0.35</strong>).
                  </div>
                </div>
              </div>

              {/* Formula 4: Bitumen Colloidal State Transformation */}
              <div className="bg-slate-900/60 p-3 sm:p-4 rounded-lg border border-slate-800/80">
                <p className="font-semibold text-rose-300 text-xs uppercase mb-1">4. Bitumen-Strukturtransformations-Kennzahl (Gaestel-Index I<sub>C</sub>)</p>
                <div className="flex flex-col md:flex-row items-center gap-4 py-2 justify-center bg-slate-950/80 my-2 rounded-lg border border-slate-950">
                  <div className="text-base sm:text-lg font-mono font-bold text-white tracking-wide border-b md:border-b-0 md:border-r border-slate-800 pb-2 md:pb-0 md:pr-4">
                    I<sub>C</sub> = (Asph + Ges) / (Aro + Harz)
                  </div>
                  <div className="text-xs text-slate-400 max-w-md font-medium leading-relaxed">
                    In der Asphaltchemie bewertet der Gaestel-Kolloidindex <strong className="text-white">I<sub>C</sub></strong> den Alterungszustand. Frisch-Bitumen besitzt ein Sol-Kolloidstadium (niedriger Index, hohe Duktilität). Oxidation und UV-Bewitterung überführen Maltene in polare Asphaltene, wodurch sich der Gaestel-Index <strong className="text-white">I<sub>C</sub></strong> erhöht. Bitumen wandelt sich in einen starren Gel-Zustand um (hoher Erweichungspunkt Ring und Kugel, stark herabgesetzter Nadelpenetrations-Kennwert).
                  </div>
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
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Material-Lehrpfad: Organische Baustoffe
        </h4>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          Verbinde die Theorie der Kunststoff- und Bitumenkunde mit den Korrosionsmechanismen:
        </p>
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
            <span>Chemie der Kunststoffe (Material)</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Stufenpolymere, Polymerisat-Synthese, thermische Erweichungspunkte &amp; Normklassen.
          </span>
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
            <span>Verwitterung &amp; Alterung (Dauerhaftigkeit)</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Bitumenalterung, Weichmachermigration, Bioabbaubarkeit &amp; Schadensphänomene.
          </span>
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
          <Leaf className="w-6 h-6 text-shiraz" />
          Korrosion &amp; Verwitterung organischer Baustoffe
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Grundgesetze der physikalisch-chemischen Alterung und Biokorrosion von Bitumen, Baupolymeren und Naturbaustoffen.
        </p>
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
            {tab === 'uebersicht' ? '📊 Übersicht' : tab === 'bitumen' ? '🛢️ Bitumen & Asphalte' : tab === 'kunststoffe' ? '🧪 Polymere & Kunststoffe' : '🌱 NaWaRo & Naturfasern'}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: OVERVIEW */}
      {activeSubTab === 'uebersicht' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl leading-relaxed text-sm text-slate-700">
            <h3 className="font-bold text-slate-900 text-base mb-2">Warum altert Organik anders als Metalle oder Beton?</h3>
            <p className="mb-3">
              Im Gegensatz zur <strong>elektrochemischen Korrosion</strong> von Metallen (Rosten durch Ionenwanderung in galvanischen Zellen) oder der <strong>chemisch-mineralischen Auslaugung</strong> von Beton (Säureangriff, Ettringittreiben), beruht der Verfall organischer Baustoffe vor allem auf <strong>makromolekularer Depolymerisation</strong>, solarer Photooxidation sowie enzymatischem Abbau durch Mikroorganismen.
            </p>
            <p>
              Kohlenstoffbasierte Baustoffe sind thermodynamisch metastabil. Sie streben unter dem Einfluss von solarer kurzwelligem UV-Licht-Einstrahlung, Hitze und Sauerstoff einen energetisch günstigeren, kurzkettigeren Zustand an. Diese irreversible Eigenschaftsverschlechterung wird baupraktisch als <strong>Alterung</strong> oder <strong>organische Materialkorrosion</strong> bezeichnet.
            </p>
          </div>

          {/* Triad of Organic Corrosion */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                <Sun className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Solar-chemische Korrosion</h4>
              <p className="text-xs text-slate-550 leading-relaxed">
                UV-Einstrahlung initiiert Radikalreaktionen. Die Hochenergie-Strahlung spaltet kovalente C-C- oder C-H-Bindungen. Das Material bleicht aus, bekommt Mikrorisse und kreidet ab.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-shiraz">
                <Thermometer className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Thermisch-physikalische Beanspruchung</h4>
              <p className="text-xs text-slate-550 leading-relaxed">
                Hohe Temperaturen beschleunigen Oxidationsreaktionen nach der van-’t-Hoff-Regel (RGT-Regel). Tiefe Temperaturen führen bei viskoelastischem Bitumen und Elastomeren zum Erreichen des Glasübergangs (Versprödung).
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Leaf className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Biologischer Abbau</h4>
              <p className="text-xs text-slate-550 leading-relaxed">
                Nachwachsende Naturfasern und Füllstoffe (Zellulose, Stärke) besitzen Nährwert für Bakterien, Pilze und Insekten. Bei relativer Luftfeuchtigkeit über 80% (oder u &gt; 15%) droht enzymatisch katalysierte hydrolytische Zersetzung.
              </p>
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
              <h3 className="text-lg font-bold text-slate-850 flex items-center gap-2">
                📂 Kolloidaler Aufbau und Alterung von Bitumen
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Bitumen ist ein komplexes, thermoplastisches Gemisch hochmolekularer Kohlenwasserstoffe. Physikalisch lässt sich Bitumen als faszinierendes kolloidales System (Sol-Gel) beschreiben:
              </p>

              <div className="bg-stone-50 p-4 rounded-xl border border-slate-200">
                <ul className="space-y-3 text-xs text-slate-700">
                  <li>
                    <strong>Asphaltene (Disperse Phase):</strong> Hochkondensierte, schwerlösliche Kohlenwasserstoff-Kerne. Sie bestimmen die Viskosität und Härte des Bitumens.
                  </li>
                  <li>
                    <strong>Maltene (Kontinuierliche Phase):</strong> Bestehend aus öligen Ölen (Saturates, Aromatics) und harzigen Harzen (Resins). Das Harz stabilisiert das elastische Dispersionsgleichgewicht.
                  </li>
                </ul>
              </div>

              <h4 className="font-bold text-slate-850 text-sm mt-3">Der Alterungsprozess (Oxidatationsalterung)</h4>
              <p className="text-xs text-slate-650 leading-relaxed">
                Durch thermische Beaufschlagung während der Verarbeitung (Heißeinbau) und jahrzehntelange solare Bewitterung oxidieren die Maltene irreversibel. Die niedermolekularen Harze und Öle bilden Brücken und überführen sich sukzessive in polare, starre <strong>Asphaltene</strong>.
              </p>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-slate-800 space-y-1">
                <h5 className="font-bold text-amber-900">Die makroskopische Folge der Bitumenalterung:</h5>
                <p>📍 Der Werkstoff verliert seine plastische Dehnfähigkeit (Duktilität).</p>
                <p>📍 Er wird unelastisch, spröde und neigt bereits bei winterlichen Frostzyklen zur Thermorissbildung.</p>
                <p>📍 Im Labor steigt das Verhältnis von Asphaltenen zu Maltenen drastisch an; die Nadelpenetration sinkt stark ab.</p>
              </div>
            </div>

            <div className="md:col-span-5 space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
                <h4 className="font-bold text-slate-900 text-sm mb-3">Laborwerte &amp; Alterungsreaktion</h4>
                <p className="mb-2 font-medium">Zur Charakterisierung der Bitumenalterung dienen im Bauwesen standardisierte Prüfmethoden:</p>
                
                <div className="space-y-2 mb-4">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                    <span className="font-bold text-shiraz">RTFOT-Verfahren (DIN EN 12607-1):</span>
                    <p className="text-slate-550 mt-1">Rolling Thin Film Oven Test. Simuliert die thermo-oxidative Asphalt-Alterung während des instabilen Asphalt-Heiß-Mischvorgangs.</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                    <span className="font-bold text-shiraz">PAV-Alterung (DIN EN 14769):</span>
                    <p className="text-slate-550 mt-1">Pressure Aging Vessel. Simuliert die subsequente, 10- bis 15-jährige Feld-Alterung unter hohem Sauerstoffdruck (2,1 MPa) bei 100°C.</p>
                  </div>
                </div>

                <div className="bg-shiraz/5 p-3 rounded-xl border border-shiraz/15 font-semibold text-slate-800">
                  <span className="block text-xs font-bold text-shiraz uppercase mb-1">Rheologische Kennzahl-Verschiebung:</span>
                  <div className="flex justify-between border-b border-shiraz/10 pb-1.5 pt-0.5 text-xs">
                    <span>Frischbitumen (Klasse 50/70)</span>
                    <span className="font-mono text-slate-600">EP RuK: 46 - 54 °C</span>
                  </div>
                  <div className="flex justify-between pt-1.5 text-xs">
                    <span>Gealtertes Bitumen (nach PAV)</span>
                    <span className="font-mono text-xs text-red-600">EP RuK &gt; 68 °C (Hart &amp; Spröde!)</span>
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
            <h3 className="font-bold text-slate-900 text-base mb-2">Plastik-Korrosion: UV-induzierte Zersetzung &amp; Photooxydation</h3>
            <p className="mb-3">
              Moderne Thermoplaste wie Polyvinylchlorid (PVC), Polyethylen (PE) und Polypropylen (PP) sowie elastomere Abdichtungsfolien (EPDM) bestehen aus Kohlenstoffketten. Ein fallgünstiger Strahl solarer UV-Strahlung (vor allem hochenergetische UV-B Strahlung mit einer Wellenlänge von 290–320 nm) reicht energetisch aus, um kovalente Verknüpfungen abzuspalten.
            </p>
            <p>
              Diese Kettenbrüche setzen autokatalytische Oxidationsreaktionen in Gang (<strong>Autoxidation</strong>). Das Ergebnis: Die Kettenlänge schrumpft, Moleküle vernetzen sich regellos quer, und die makroskopischen Dehnungs- und Festigkeitsreserven kollabieren.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-sm space-y-3">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">Mechanismus</span>
              <h4 className="font-bold text-slate-850 text-sm">Weichmacher-Auswanderung (Migration)</h4>
              <p className="text-xs text-slate-650 leading-relaxed mb-2">
                PVC ist von Natur aus spröd-hart. Biegsame Baufolien (z.B. Dachbeläge) enthalten Weichmacher (Phthalate wie DINP/DIDP), die nicht chemisch gebunden, sondern nur physikalisch in den Polymerketten eingelagert sind. 
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 font-mono text-xs text-slate-700">
                <span>Migration =&gt; Verflüchtigung =&gt; Plastikversprödung =&gt; Mikrorissbildung</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-sm space-y-3">
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest block">Schadensbild</span>
              <h4 className="font-bold text-slate-850 text-sm">Kreidung / Abkreiden</h4>
              <p className="text-xs text-slate-650 leading-relaxed mb-2">
                Bei der Solarkorrosion zersetzen sich organische Polymer-Matrixanteile an der Außenfläche zuerst. Freigelegte mineralische Füllstoffe (z. B. Titandioxid, Kreide) bilden einen lose wischbaren, pulvrigen Schleier auf der Oberfläche.
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 font-mono text-xs text-slate-700">
                <span>Foto-Kettenbruch =&gt; Zersetzung Bindemittel =&gt; Mineral-Auskreidung</span>
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
              <h3 className="text-lg font-bold text-slate-850 flex items-center gap-2">
                🌱 Biologische Korrosion von Naturbaustoffen
              </h3>
              <p className="text-sm text-slate-705 leading-relaxed">
                Nachwachsende Rohstoffe (NaWaRo) wie <strong>Hanffasern, Stroh, Schilf, Zelluloseeinblasdämmung und Naturkork</strong> werden im Sinne des nachhaltigen Bauens immer wichtiger. Doch im Gegensatz zu mineralischen Dämmstoffen (Mineralwolle, Blähton) sind diese organischen, zellulosebasierten Fasern biological abbaubar und dienen Schädlingen als Nährboden.
              </p>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Die drei mikrobiellen Feinde dämmtechnischer Organik:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-150 flex flex-col gap-1">
                    <span className="text-xs font-bold text-shiraz">1. Schimmelpilze</span>
                    <p className="text-xs text-slate-550 leading-relaxed">
                      Zersetzen Holz oder Faserkörper mechanospezifisch meist nicht primär, verfärben aber Oberflächen und schädigen die Raumluft (Mykotoxine/Sporen) massiv ab u &gt; 15-18% Holz/Faserfeuchte.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-150 flex flex-col gap-1">
                    <span className="text-xs font-bold text-shiraz">2. Moderfäule</span>
                    <p className="text-xs text-slate-550 leading-relaxed">
                      Wird durch Ascomyceten im direkten Erdkontakt (Dauernässe) hervorgerufen. Sie dringen in sekundäre Zellwände ein und erweichen Faserbündel vollständig hydroenzymatisch.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-150 flex flex-col gap-1">
                    <span className="text-xs font-bold text-shiraz">3. Trockenfäule</span>
                    <p className="text-xs text-slate-550 leading-relaxed">
                      Erreger wie der Braunk things (Kellerschwamm) bauen Zellulose unter Freisetzung von Säuren ab - es verbleibt der typische würfelartige Bruch („Staubende Zerstörung“).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-250 text-xs text-slate-755 leading-relaxed">
                <strong>Zentraler Leitsatz der Ökologischen Bauchemie:</strong> 
                <p className="mt-1">
                  <em>„Der chemische Holz- und Faserschutz (Biozide, Fungizide) kann konstruktive Planungsfehler nie langfristig korrigieren. Nur der konsequente, bauliche Feuchteschutz (Hinterlüftung, Trockenhalten, Verhinderung stehender Nässe) schützt Naturbaustoffe dauerhaft vor biologischer Korrosion.“</em>
                </p>
              </div>
            </div>

            <div className="md:col-span-4 bg-white border border-slate-205 p-4 rounded-xl space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Brandschutz vs. Bioschutz</span>
              <h4 className="font-bold text-slate-850 text-sm">Mineralisierung &amp; Imprägnierung</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Um Hanfwollmatten oder Einblaszellulose feuer- und verrottungsresistent zu machen, müssen sie industriell modifiziert werden (sogenannte <strong>Mineralisierung</strong>):
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
                  <span className="font-semibold text-slate-800">Bor-Imprägnierung</span>
                  <p className="text-xs text-slate-500 mt-0.5">Zellulosefasern werden mit Borsalzen umgeben. Wirkt fungizid, insektizid und brandhemmend. Steht jedoch aus humantoxikologischen Gründen in der Diskussion.</p>
                </div>
                <div className="bg-slate-55/70 p-2 rounded-lg border border-slate-150">
                  <span className="font-semibold text-slate-800">Soda &amp; Ammoniumsalze</span>
                  <p className="text-xs text-slate-500 mt-0.5">Ökologische Alternative. Erhöht den pH-Wert der organischen Struktur weit in den alkalischen Bereich. Pilze und Enzyme sterben ab.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thematic Path Links */}
      <OrganicThematicLinks current="dauerhaftigkeit" />

      {/* Footer metadata */}
      <ModuleFooter
        wikipedia={[
          { title: 'Organische Chemie', url: 'https://de.wikipedia.org/wiki/Organische_Chemie' },
          { title: 'Polymer', url: 'https://de.wikipedia.org/wiki/Polymer' },
          { title: 'Dämmstoff', url: 'https://de.wikipedia.org/wiki/D%C3%A4mmstoff' }
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 12944 (Korrosionsschutz durch Beschichtungssysteme)', url: 'https://www.beuth.de/' },
          { title: 'DIN 68800 (Holzschutz: Vorbeugender Schutz im Hochbau)', url: 'https://www.beuth.de/' },
          { title: 'DIN 18531 (Abdichtung von Dächern und Bauwerken)', url: 'https://www.beuth.de/' }
        ]}
        literatur={[
          'Schunck, E. et al.: Dachatlas: Geneigte Dächer und Flachdächer (Edition Detail)'
        ]}
        formeln={[
          {
            formel: 'k = A \\cdot \\exp\\left(-\\frac{E_a}{R \\cdot T}\\right)',
            erklaerung: 'Arrhenius-Gleichung zur Modellierung der temperaturabhängigen Alterungs- und Depolymerisationskinetik organischer Bindemittel und Kunststoffe.',
            quelle: 'Reaktionskinetik / Bauchemie'
          },
          {
            formel: 't_{\\text{Life}} = t_0 \\cdot \\prod f_i \\quad [\\text{Jahre}]',
            erklaerung: 'Prognostizierte Nutzungsdauer organischer Werkstoffe unter Berücksichtigung von Reduktionsfaktoren für UV-Strahlung, Feuchte, Temperaturzyklen und Additive.',
            quelle: 'ISO 15686-1'
          }
        ]}
      />
    </div>
  );
}
