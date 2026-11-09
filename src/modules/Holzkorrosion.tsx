import { formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Bug, Droplets, ShieldCheck, Sun, ArrowRight, BookOpen, Layers, ShieldAlert } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { motion } from 'framer-motion';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/holzkorrosion/Holzkorrosion.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { ErgebnisAnsage } from '@/src/components/ui/ErgebnisAnsage';

function WoodThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadHolzIm} /></h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5"><MdText text={inhalt.texte.wechselnSieNahtlosZwischen} /></p>
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
            <span><MdText text={inhalt.texte.t1BaustoffKennwerte} /></span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.anisotropesQuellenSchwinden3d} /></span>
          {current !== 'baustoff' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
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
            <span><MdText text={inhalt.texte.t2HolzproduktePraxis} /></span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.konstruktionsvollholzCltVorUnd} /></span>
          {current !== 'bauprodukt' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
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
            <span><MdText text={inhalt.texte.t3Dauerhaftigkeit} /></span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.holzzerstörendePilzeInsektenWitterung} /></span>
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

const moistureRanges = inhalt.daten.moistureRanges;

type HolzkorrosionReiter = 'simulation' | 'schaedlinge' | 'schutz';
const REITER: readonly ModulTab<HolzkorrosionReiter>[] = [
  { id: 'simulation', label: inhalt.texte.grundlagenSimulation, icon: Droplets },
  { id: 'schaedlinge', label: 'Holzschädlinge', icon: Bug },
  { id: 'schutz', label: inhalt.texte.holzschutzDin68800, icon: ShieldCheck },
];

export default function Holzkorrosion() {
  const { activeTab, setActiveTab } = useTabContext();
  const [activeSection, setActiveSection] = React.useState<HolzkorrosionReiter>('simulation');
  const [woodMoisture, setWoodMoisture] = React.useState<number>(12);

  // Find corresponding moisture range
  const currentRange = moistureRanges.find(r => {
    if (r.max === 100) {
      return woodMoisture >= r.min && woodMoisture <= r.max;
    }
    return woodMoisture >= r.min && woodMoisture < r.max;
  }) || moistureRanges[0];

  const percentOfSaturation = Math.min(100, (woodMoisture / 30) * 100);
  const freeWaterLevel = woodMoisture > 30 ? Math.min(100, ((woodMoisture - 30) / 70) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeSection} onWechsel={setActiveSection} className="[&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:pb-4 [&>[role=tablist]]:mb-6">

        <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
          <Bug className="text-shiraz" /><MdText text={inhalt.texte.holzkorrosionSchädlingeHolzschutz} /></h2>
        
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.unterKorrosionBeiHolz} /></p>
          </div>

          {activeSection === 'simulation' && (
            <>
              {/* SÄULEN DES BIOLOGISCHEN ABBAUS & HOLZFEUCHTE */}
              <section className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl shadow-sm animate-in fade-in duration-300">
                <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-shiraz animate-pulse" />
              <span><MdText text={inhalt.texte.voraussetzungenFürDenHolzabbau} /></span>
            </h3>
            
            <p className="text-xs text-slate-700 leading-relaxed mb-5"><MdText text={inhalt.texte.derBiologischeAbbauOft} /></p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Säule 1 */}
              <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-1.5 transition-all">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-200 text-slate-800 text-xs font-bold rounded-full flex items-center justify-center">1</span>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide"><MdText text={inhalt.texte.nährsubstratHolz} /></span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.energiequelleZelluloseHemizelluloseUnd} /></p>
              </div>

              {/* Säule 2 */}
              <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-1.5 transition-all">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-200 text-slate-800 text-xs font-bold rounded-full flex items-center justify-center">2</span>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide"><MdText text={inhalt.texte.sauerstoffO} /></span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.atmungsgasAlleHolzzerstörendenOrganismen} /></p>
              </div>

              {/* Säule 3 */}
              <div className="bg-white p-3.5 rounded-xl border border-shiraz/20 shadow-sm flex flex-col gap-1.5 bg-gradient-to-br from-rose-50/15 to-white relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                  <span className="text-xs font-bold text-shiraz uppercase tracking-wide"><MdText text={inhalt.texte.holzfeuchteU} /></span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.derHauptstellhebelOhneGenügend} /></p>
              </div>
            </div>

            {/* INTERAKTIVER SIMULATOR */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-home-grau/30 pb-5">
                <div className="flex-1 flex flex-col">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <span><MdText text={inhalt.texte.interaktiverHolzfeuchteGrenzwerteSimulat} /></span>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">DIN 68800</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.verschiebenSieDenRegler} /></p>
                </div>
                
                {/* Darrfeuchte Formula Callout Box */}
                <div className="shrink-0 max-w-sm w-full lg:w-72 bg-slate-50 p-3 rounded-xl border border-home-grau/30">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.darrfeuchteFormelDinEn} /></span>
                  <p className="text-xs text-slate-700 mb-2 leading-relaxed"><MdText text={inhalt.texte.dieHolzfeuchteOmegaIn} /></p>
                  <div className="bg-white py-1.5 px-3 rounded border border-home-grau/30 text-center">
                    <InlineMath math="\omega = \frac{m_1 - m_0}{m_0} \cdot 100 \ [\%]" />
                  </div>
                  <div className="text-xs text-slate-550 mt-1.5 flex flex-col gap-0.5 leading-normal">
                    <span><MdText text={inhalt.texte.omegaHolzfeuchteFeuchtegehaltIn} /></span>
                    <span><MdText text={inhalt.texte.m1MasseDer} /></span>
                    <span><MdText text={inhalt.texte.m0MasseDer} /></span>
                  </div>
                </div>
              </div>

              {/* Slider Controller */}
              <div className="flex flex-col gap-3 py-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider"><MdText text={inhalt.texte.holzfeuchteUWählen} /></span>
                  <div className="flex items-baseline gap-1 font-mono text-3xl font-black text-shiraz">
                    <span>{formatDeWert(woodMoisture)}%</span>
                    <span className="text-xs font-bold text-slate-550">(u)</span>
                  </div>
                </div>

                <div className="relative pt-1 px-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={woodMoisture}
                    aria-label="Holzfeuchte u"
                    aria-valuetext={`${formatDeWert(woodMoisture)} %`}
                    onChange={(e) => setWoodMoisture(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none accent-shiraz bg-slate-100 border border-home-grau/30"
                  />
                  {/* Critical markers */}
                  <div className="flex justify-between text-xs font-bold text-slate-500 mt-1.5">
                    <span><MdText text={inhalt.texte.t0Fasertrockon} /></span>
                    <span className="text-slate-500"><MdText text={inhalt.texte.t12UglInnen} /></span>
                    <span className="text-slate-650"><MdText text={inhalt.texte.t20Pilzgrenze} /></span>
                    <span className="text-shiraz animate-pulse"><MdText text={inhalt.texte.t30Fasersättigung} /></span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Schnellwahl Tasten */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                  {[
                    { val: 8, label: inhalt.werte.innenraum8 },
                    { val: 15, label: inhalt.werte.dachstuhl15 },
                    { val: 24, label: inhalt.werte.bewittert24 },
                    { val: 45, label: inhalt.werte.staunässe45 },
                    { val: 95, label: inhalt.werte.geflutet95 }
                  ].map(btn => (
                    <button
                      key={btn.val}
                      onClick={() => setWoodMoisture(btn.val)}
                      className={`px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all text-center ${
                        woodMoisture === btn.val 
                          ? 'bg-shiraz border-shiraz text-white shadow scale-[1.01]'
                          : 'bg-slate-50 hover:bg-slate-100 border-home-grau/30 text-slate-700'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time micro graphic block */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-baseline gap-2 justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider"><MdText text={inhalt.texte.mikroskopischeZellstrukturenZellwändeVs} /></span>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {woodMoisture <= 30 
                      ? `Nur gebundenes Zellwandwasser (${formatDeWert(Math.round(percentOfSaturation))}%)` 
                      : `Zellwand gesättigt + Freies Wasser im Zellhohlraum (+${formatDeWert(Math.round(freeWaterLevel))}%)`}
                  </span>
                </div>
                
                <div className="relative h-16 w-full flex items-center justify-center bg-slate-50 border border-home-grau/30 rounded-lg overflow-hidden">
                  <svg role="img" aria-label="Holzzellen mit Zellwänden und Zellhohlräumen bei der gewählten Holzfeuchte" className="w-full h-full max-w-sm" viewBox="0 0 350 70">
                    {/* Draw three hexagonal cells */}
                    {/* Left Cell */}
                    <polygon 
                      points="40,10 90,10 115,35 90,60 40,60 15,35" 
                      className="transition-colors duration-300"
                      fill={woodMoisture > 30 ? `rgba(255, 3, 80, 0.08)` : "transparent"} 
                      stroke={woodMoisture <= 30 ? "rgb(150, 150, 150)" : "var(--color-amber-800)"}
                      strokeWidth={woodMoisture <= 30 ? 3 + (percentOfSaturation/15) : 5}
                    />
                    {/* Center Cell */}
                    <polygon 
                      points="140,10 190,10 215,35 190,60 140,60 115,35" 
                      className="transition-colors duration-300"
                      fill={woodMoisture > 30 ? `rgba(255, 3, 80, 0.08)` : "transparent"} 
                      stroke={woodMoisture <= 30 ? "rgb(150, 150, 150)" : "var(--color-amber-800)"}
                      strokeWidth={woodMoisture <= 30 ? 3 + (percentOfSaturation/15) : 5}
                    />
                    {/* Right Cell */}
                    <polygon 
                      points="240,10 290,10 315,35 290,60 240,60 215,35" 
                      className="transition-colors duration-300"
                      fill={woodMoisture > 30 ? `rgba(255, 3, 80, 0.08)` : "transparent"} 
                      stroke={woodMoisture <= 30 ? "rgb(150, 150, 150)" : "var(--color-amber-800)"}
                      strokeWidth={woodMoisture <= 30 ? 3 + (percentOfSaturation/15) : 5}
                    />
                    
                    {/* Labels inside hexagonal holes */}
                    <text x="65" y="40" className="text-xs font-sans font-bold fill-slate-700 text-center" textAnchor="middle">
                      {woodMoisture > 30 ? inhalt.werte.freiesWasser : 'Zellwand'}
                    </text>
                    <text x="165" y="40" className="text-xs font-sans font-bold fill-slate-700 text-center" textAnchor="middle">
                      {woodMoisture > 30 ? inhalt.werte.porenGefüllt : 'Quellwasser'}
                    </text>
                    <text x="265" y="40" className="text-xs font-sans font-bold fill-slate-700 text-center" textAnchor="middle">
                      {woodMoisture > 30 ? inhalt.werte.freiesWasser2 : 'Zellwand'}
                    </text>
                  </svg>
                  
                  {/* Floating drops overlay */}
                  {woodMoisture > 30 && (
                    <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden h-full flex justify-around">
                      <motion.div animate={{ y: [60, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }} className="w-1.5 h-1.5 rounded-full bg-slate-400 absolute left-[15%]" />
                      <motion.div animate={{ y: [60, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut', delay: 0.5 }} className="w-2 h-2 rounded-full bg-slate-400 absolute left-[45%]" />
                      <motion.div animate={{ y: [60, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut', delay: 1.1 }} className="w-1.5 h-1.5 rounded-full bg-slate-400 absolute left-[75%]" />
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-slate-500 italic text-center">
                  {woodMoisture <= 30 
                    ? inhalt.werte.bisCa30Fasersättigung
                    : inhalt.werte.über30DieZellwände}
                </p>
              </div>

              <ErgebnisAnsage text={`Holzfeuchte ${formatDeWert(woodMoisture)} %: ${currentRange.label}, ${currentRange.level}`} />
              {/* Real-time Status Details */}
              <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors duration-300 ${currentRange.colorBg}`}>
                <div className="flex items-start md:items-center justify-between gap-3 flex-col md:flex-row">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60"><MdText text={inhalt.texte.gefährdungspotenzialBeiU} />{formatDeWert(woodMoisture)}%:</span>
                    <strong className="text-sm md:text-base font-bold leading-tight">{currentRange.label}</strong>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full text-center ${currentRange.badgeColor} shrink-0`}>
                    {currentRange.level}
                  </span>
                </div>

                <p className="text-xs leading-relaxed opacity-90 border-t border-home-grau/30 pt-2.5">
                  {currentRange.description}
                </p>

                {/* Sub-pests checklist */}
                <div className="flex flex-col gap-2 mt-1 border-t border-home-grau/30 pt-2.5">
                  <span className="text-xs font-bold uppercase tracking-wide opacity-75"><MdText text={inhalt.texte.statusDerHauptschädlinge} /></span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                    {currentRange.pests.map((pest, pidx) => (
                      <div key={pidx} className="bg-white/60 backdrop-blur-xs p-3 rounded-lg border border-home-grau/30 flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-800">{pest.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            pest.risk === 'safe' 
                              ? 'bg-slate-400' 
                              : pest.risk === 'warn' 
                                ? 'bg-slate-600' 
                                : 'bg-shiraz animate-pulse'
                          }`}></span>
                          <span className="text-xs text-slate-700 font-medium">{pest.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {activeSection === 'schaedlinge' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* Biotische Schädigungen (Organismen) nach Folienserie Holzschutz F 10 - F 18 */}
          <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl shadow-sm text-xs leading-relaxed space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-home-grau/15 pb-2 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-shiraz" />
                <span><MdText text={inhalt.texte.biotischeSchadensverursacherHolzzerstöre} /></span>
              </h3>
              <p className="text-text-main/70 mt-2"><MdText text={inhalt.texte.pilzeBenötigenFürIhren} /><span className="font-mono font-semibold text-shiraz">u &gt; 20 %</span><MdText text={inhalt.texte.fasertrockengrenzeSieBauenDie} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-2">
                <span className="text-xs font-extrabold uppercase bg-red-100 text-red-800 px-1.5 py-0.5 rounded">Fäuletyp 1</span>
                <h4 className="font-extrabold text-slate-800 text-xs"><MdText text={inhalt.texte.braunfäuleDestruktionsfäule} /></h4>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.großpilzeStänderpilzeBasidiomycetenBauen} /></p>
                <div className="text-xs text-slate-500 italic border-t border-slate-100 pt-1"><MdText text={inhalt.texte.hauptvertreterEchterHausschwammSerpula} /></div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-2">
                <span className="text-xs font-extrabold uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">Fäuletyp 2</span>
                <h4 className="font-extrabold text-slate-800 text-xs"><MdText text={inhalt.texte.weißfäuleKorrosionsfäule} /></h4>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.pilzeZerlegenGleichzeitigDas} /></p>
                <div className="text-xs text-slate-500 italic border-t border-slate-100 pt-1"><MdText text={inhalt.texte.hauptvertreterSchmetterlingstrameteAusge} /></div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-2">
                <span className="text-xs font-extrabold uppercase bg-amber-100 text-shiraz px-1.5 py-0.5 rounded">Fäuletyp 3</span>
                <h4 className="font-extrabold text-slate-800 text-xs"><MdText text={inhalt.texte.moderfäuleSoftRot} /></h4>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.schadformUnterExtremenNassbedingungen} /></p>
                <div className="text-xs text-slate-500 italic border-t border-slate-100 pt-1"><MdText text={inhalt.texte.hauptvertreterAscomycetenUndFungi} /></div>
              </div>
            </div>

            {/* Holzverfäbende Organismen */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider"><MdText text={inhalt.texte.holzverfärbendeOrganismenBakterienF} /></h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-normal">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.bläuepilzeZBAureobasidium} /></span>
                  <p><MdText text={inhalt.texte.besiedelnAusschließlichDasZelllumen} /></p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.schimmelpilzePenicilliumUA} /></span>
                  <p><MdText text={inhalt.texte.erzeugenEinenFarbigenOberflächenrasen} /></p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block">Bakterien</span>
                  <p><MdText text={inhalt.texte.bauenExtremLangsamDie} /></p>
                </div>
              </div>
            </div>

            {/* Holzzerstörende Insekten nach F 14 - F 18 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-home-grau/15 pb-2 flex items-center gap-2">
                <Bug className="w-4 h-4 text-shiraz" />
                <span><MdText text={inhalt.texte.holzzerstörendeInsektenTrockenholzinsekt} /></span>
              </h3>
              <p className="text-text-main/70"><MdText text={inhalt.texte.insektenlarvenFressenSichDurch} /><span className="font-mono font-semibold text-slate-800">u ≥ 12 %</span>):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 text-xs"><MdText text={inhalt.texte.hausbockHylotrupesBajulus} /></h4>
                  <span className="text-xs font-mono text-red-650 bg-red-50 px-1 py-0.5 rounded font-bold block w-max"><MdText text={inhalt.texte.gefährlichsterSchädling} /></span>
                  <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.befälltBevorzugtDasProteinreiche} /></p>
                  <p className="text-xs text-slate-500 italic"><MdText text={inhalt.texte.merkmaleOvaleAusflugslöcher3} /></p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 text-xs"><MdText text={inhalt.texte.gewöhnlicherNagekäfer} /></h4>
                  <span className="text-xs font-mono text-slate-600 bg-slate-55 px-1 py-0.5 rounded font-bold block w-max"><MdText text={inhalt.texte.volksmundHolzwurm} /></span>
                  <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.befälltSplintUndKernholz} /><span className="font-semibold text-slate-800">u &gt; 14 %</span><MdText text={inhalt.texte.inDarrtrockenenBeheiztenWohnräumen} /></p>
                  <p className="text-xs text-slate-500 italic"><MdText text={inhalt.texte.merkmaleKreisförmigeAusflugslöcher1} /></p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 text-xs"><MdText text={inhalt.texte.splintholzkäferLyctus} /></h4>
                  <span className="text-xs font-mono text-amber-650 bg-off-white px-1 py-0.5 rounded font-bold block w-max"><MdText text={inhalt.texte.geringfeldigTrockenresistent} /></span>
                  <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.befälltStärkereichesOffenporigesLaubholz} /></p>
                  <p className="text-xs text-slate-500 italic"><MdText text={inhalt.texte.merkmaleRundeFluglöcher1} /></p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 text-xs"><MdText text={inhalt.texte.sonderlingeTermiten} /></h4>
                  <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded font-bold block w-max"><MdText text={inhalt.texte.f14F15} /></span>
                  <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.termitenIsopteraErdbewohnendeOder} /></p>
                  <p className="text-xs text-slate-500 italic"><MdText text={inhalt.texte.weitereAmeisenBewohnenMarodes} /></p>
                </div>
              </div>
            </div>

            {/* Abiotische Schädigungen nach F 19 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-home-grau/15 pb-2 flex items-center gap-2">
                <Sun className="w-4 h-4 text-shiraz" />
                <span><MdText text={inhalt.texte.abiotischeSchädigungsfaktorenAmBauholz} /></span>
              </h3>
              <p className="text-text-main/70"><MdText text={inhalt.texte.nichtBiologischeZerstörungsmechanismenGr} /></p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-600">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <strong className="block text-slate-800 mb-1 font-extrabold"><MdText text={inhalt.texte.uvStrahlungSonne} /></strong><MdText text={inhalt.texte.photochemischerAbbauDesBindeglieds} /></div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <strong className="block text-slate-800 mb-1 font-extrabold"><MdText text={inhalt.texte.niederschlagAuswaschung} /></strong><MdText text={inhalt.texte.regenwasserWäschtDieDurch} /></div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <strong className="block text-slate-800 mb-1 font-extrabold"><MdText text={inhalt.texte.thermischerEinfluss} /></strong><MdText text={inhalt.texte.langAnhaltendHoheTemperaturen} /></div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <strong className="block text-slate-800 mb-1 font-extrabold"><MdText text={inhalt.texte.chemischerMechanischerAngriff} /></strong><MdText text={inhalt.texte.schlagregenUndWindSand} /></div>
              </div>
            </div>

            {/* Biozidgesetzgebung und Nationale Zulassung (F 52 - F 55, F 59 - F 60) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xxs space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider"><MdText text={inhalt.texte.biozidZulassungsverfahrenGesetzgebungF} /></h4>
              <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.holzschutzmittelHsmDieSchädigende} /></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.stufe1WirkstoffgenehmigungEu} /></strong>
                  <p className="leading-relaxed text-slate-500"><MdText text={inhalt.texte.dieEuropäischeChemikalienagenturEcha} /></p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.stufe2ProduktzulassungNational} /></strong>
                  <p className="leading-relaxed text-slate-500"><MdText text={inhalt.texte.fürDasVerkaufsfertigePräparat} /></p>
                </div>
              </div>
            </div>

            {/* Altholzkategorien & Entsorgung nach AltholzV (F 58) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xxs space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider"><MdText text={inhalt.texte.abfallrechtlicheEntsorgungVonSchutzbehan} /></h4>
              <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.abgebautesHolzDasMit} /></p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-600">
                <div className="p-3 border border-slate-200 bg-emerald-50/20 rounded-lg">
                  <strong className="text-emerald-800 block mb-0.5"><MdText text={inhalt.texte.kategorieAI} /></strong>
                  <span className="text-xs text-slate-400 block mb-1 leading-none font-mono"><MdText text={inhalt.texte.naturbelassenesHolz} /></span>
                  <p className="leading-relaxed text-slate-500 text-xs"><MdText text={inhalt.texte.lediglichMechanischBearbeitetesHolz} /></p>
                </div>
                <div className="p-3 border border-slate-200 bg-slate-50 rounded-lg">
                  <strong className="text-slate-700 block mb-0.5"><MdText text={inhalt.texte.kategorieAIi} /></strong>
                  <span className="text-xs text-slate-400 block mb-1 leading-none font-mono"><MdText text={inhalt.texte.verleimtesHolz} /></span>
                  <p className="leading-relaxed text-slate-500 text-xs"><MdText text={inhalt.texte.behandeltesHolzOhneHalogenorganische} /></p>
                </div>
                <div className="p-3 border border-slate-200 bg-slate-50 rounded-lg">
                  <strong className="text-slate-700 block mb-0.5"><MdText text={inhalt.texte.kategorieAIii} /></strong>
                  <span className="text-xs text-slate-400 block mb-1 leading-none font-mono"><MdText text={inhalt.texte.beschichtetesHolz} /></span>
                  <p className="leading-relaxed text-slate-500 text-xs"><MdText text={inhalt.texte.hölzerMitHalogenorganischenBeschichtunge} /></p>
                </div>
                <div className="p-3 border border-red-200 bg-red-50/20 rounded-lg">
                  <strong className="text-red-700 block mb-0.5"><MdText text={inhalt.texte.kategorieAIv} /></strong>
                  <span className="text-xs text-red-500 block mb-1 leading-none font-semibold font-mono flex items-center gap-1"><MdText text={inhalt.texte.gefährlicherAbfall} /></span>
                  <p className="leading-relaxed text-slate-500 text-xs"><MdText text={inhalt.texte.imprägniertesAbbruchholzEnthältNachweisl} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'schutz' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* DIN 68800 Regelwerk nach F 20 - F 26 */}
          <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl shadow-sm text-xs leading-relaxed space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-home-grau/15 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-shiraz" />
                <span><MdText text={inhalt.texte.primatDesBaulichenHolzschutzes} /></span>
              </h3>
              <p className="text-text-main/70 mt-2"><MdText text={inhalt.texte.dieNationaleNormenreiheDin} /></p>
            </div>

            {/* BAULICHER HOLZSCHUTZ DETAILBLÖCKE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-xxs">
                <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                  <span className="w-4 h-4 bg-emerald-100 text-emerald-800 text-xs rounded-full flex items-center justify-center font-bold">1</span><MdText text={inhalt.texte.konstruktivesFeuchtemanagement} /></h4>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                  <li><MdText text={inhalt.texte.spritzwasserschutzBauteilsockelMindesten} /></li>
                  <li><MdText text={inhalt.texte.wasserableitungDachüberständeDimensionie} /></li>
                  <li><MdText text={inhalt.texte.freieLüftungHinterlüftungenBei} /></li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-xxs">
                <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                  <span className="w-4 h-4 bg-emerald-100 text-emerald-800 text-xs rounded-full flex items-center justify-center font-bold">2</span><MdText text={inhalt.texte.ausschreibungNatürlicherDauerhaftigkeit} /></h4>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.einsatzVonSplintholzFreiem} /></p>
                <ul className="list-disc list-inside text-xs text-slate-500 space-y-0.5 pl-1">
                  <li><MdText text={inhalt.texte.eicheKlasse2Bis} /></li>
                  <li><MdText text={inhalt.texte.lärcheDouglasieKlasse3} /></li>
                  <li><MdText text={inhalt.texte.fichteTanneKlasse4} /></li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-xxs">
                <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                  <span className="w-4 h-4 bg-emerald-100 text-emerald-800 text-xs rounded-full flex items-center justify-center font-bold">3</span><MdText text={inhalt.texte.holzmodifikationInnovativeWerkstoffe} /></h4>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.verbesserungDerBiologischenDauerhaftigke} /></p>
                <ul className="list-disc list-inside text-xs text-slate-500 space-y-0.5 pl-1">
                  <li><MdText text={inhalt.texte.thermoholzTmtKontrolliertePyrolyse} /></li>
                  <li><MdText text={inhalt.texte.acetyliertesHolzAccoyaReaktion} /></li>
                </ul>
              </div>
            </div>

            {/* MATRIXTABELLE: GEBRAUCHSKLASSEN (GK) NACH DIN 68800-1 (F 24 - F 26) */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xxs">
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider"><MdText text={inhalt.texte.normmatrixDerGebrauchsklassenGk} /></h4>
                <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.dieZuordnungEntscheidetZwingend} /></p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                      <th className="p-2 w-[15%]">Gebrauchsklasse</th>
                      <th className="p-2 w-[25%] text-slate-800"><MdText text={inhalt.texte.klimaEinbaubedingung} /></th>
                      <th className="p-2 w-[25%] text-slate-800"><MdText text={inhalt.texte.hauptgefährdungOrganismus} /></th>
                      <th className="p-2 w-[35%] text-slate-800"><MdText text={inhalt.texte.empfohleneSchutzmaßnahmeChemischeRelevan} /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-650">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 0</td>
                      <td className="p-2"><MdText text={inhalt.texte.innenräumeDauerhaftTrocken} /><span className="font-semibold">u ≤ 20 %</span><MdText text={inhalt.texte.allseitigMechanischAbgedeckt} /></td>
                      <td className="p-2"><MdText text={inhalt.texte.keineInaktivitätAllerHolzabbauenden} /></td>
                      <td className="p-2 text-slate-700 font-semibold bg-emerald-50/30"><MdText text={inhalt.texte.einsatzVonTrockenemHolz} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 1</td>
                      <td className="p-2"><MdText text={inhalt.texte.innenräumeDauerhaftTrocken2} /><span className="font-semibold">u ≤ 20 %</span><MdText text={inhalt.texte.nichtBewittertSplintholzLiegend} /></td>
                      <td className="p-2"><MdText text={inhalt.texte.holzzerstörendeInsektenHausbockGewöhnlic} /></td>
                      <td className="p-2 text-slate-700"><MdText text={inhalt.texte.trockenesHolzEinbauenBei} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 2</td>
                      <td className="p-2"><MdText text={inhalt.texte.überdachtKeineDirekteBewitterung} /></td>
                      <td className="p-2"><MdText text={inhalt.texte.holzzerstörendeInsektenSowiePilze} /></td>
                      <td className="p-2 text-slate-700"><MdText text={inhalt.texte.konstruktiverSchutzZurVermeidung} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 3.1</td>
                      <td className="p-2"><MdText text={inhalt.texte.außenFreiBewittertOhne} /><span className="font-semibold"><MdText text={inhalt.texte.schwachBeansprucht} /></span><MdText text={inhalt.texte.wasserKannRaschAbfließen} /></td>
                      <td className="p-2"><MdText text={inhalt.texte.insektenSowieHolzzerstörendeFäulnispilze} /></td>
                      <td className="p-2 text-slate-700"><MdText text={inhalt.texte.widerstandsfähigeKernhölzerOderVorbeugen} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 3.2</td>
                      <td className="p-2"><MdText text={inhalt.texte.außenFreiBewittertOhne2} /><span className="font-semibold"><MdText text={inhalt.texte.starkBeansprucht} /></span><MdText text={inhalt.texte.feuchtigkeitsansammlungenMöglich} /></td>
                      <td className="p-2"><MdText text={inhalt.texte.pilzeAkuteFäulnisgefahrIm} /></td>
                      <td className="p-2 text-slate-700 font-semibold text-shiraz"><MdText text={inhalt.texte.dauerhafteHölzerDk1} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 4</td>
                      <td className="p-2"><MdText text={inhalt.texte.ständigerErdkontaktUndOder} /></td>
                      <td className="p-2"><MdText text={inhalt.texte.moderfäuleSoftRotHolzzerstörende} /></td>
                      <td className="p-2 text-slate-700 font-semibold text-shiraz"><MdText text={inhalt.texte.kernholzDerDauerhaftigkeitsklasse1} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 5</td>
                      <td className="p-2"><MdText text={inhalt.texte.ständigerSalzwasserMeerwasserkontaktHafe} /></td>
                      <td className="p-2"><MdText text={inhalt.texte.meerwasserschädlingeBohrmuschelTeredoNav} /></td>
                      <td className="p-2 text-slate-700 font-semibold"><MdText text={inhalt.texte.höchstmöglichDosierterKesseldruckschutzM} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CHEMISCHER HOLZSCHUTZ: WIRKSTOFFBASEN & PRÜFPRÄDIKATE (F 27 - F 35) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider"><MdText text={inhalt.texte.einteilungVonHolzschutzmittelnPrüfprädik} /></h4>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.holzschutzmittelHsmSindBiozidprodukte} /></p>
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/50 font-mono">
                  <div>
                    <span className="font-extrabold text-slate-800 flex items-center gap-1">Prüfkennzeichen:</span>
                    <span><MdText text={inhalt.texte.ivVorbeugendGegenInsekten} /></span>
                    <span><MdText text={inhalt.texte.pVorbeugendGegenPilze} /></span>
                    <span><MdText text={inhalt.texte.wAuswaschbeständigWitterung} /></span>
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-800 flex items-center gap-1">Sonderkennzeichen:</span>
                    <span><MdText text={inhalt.texte.eExtremAuswaschfestErdkontakt} /></span>
                    <span><MdText text={inhalt.texte.ibBekämpfendGegenInsekten} /></span>
                    <span><MdText text={inhalt.texte.mGegenHausschwammMauerwerk} /></span>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <p><MdText text={inhalt.texte.einteilungNachVermarktungsform} /></p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-500 pl-1">
                    <li><MdText text={inhalt.texte.wässrigeSchutzsalzeZB} /></li>
                    <li><MdText text={inhalt.texte.lösemittelbasierteMittelHäufigDünnschich} /></li>
                    <li><MdText text={inhalt.texte.emulsionenModerneWasserbasierteBindemitt} /></li>
                  </ul>
                </div>
              </div>

              {/* TECHNIKEINFÜHRUNG: IMPRÄGNIERVERFAHREN (F 40 - F 46) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider"><MdText text={inhalt.texte.applikationsImprägnierverfahrenF40} /></h4>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.dieSchutzwirkungHängtElementar} /></p>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="p-2 border-l-2 border-shiraz bg-off-white/20 rounded"><MdText text={inhalt.texte.t1KesseldruckimprägnierungKvd} /><p className="text-slate-500 text-xs mt-0.5 leading-normal"><MdText text={inhalt.texte.vakuumZiehtLuftUnd} /><span className="font-mono font-bold">NP5 - NP6</span><MdText text={inhalt.texte.unabdingbarFürDieGk} /></p>
                  </div>
                  <div className="p-2 border-l-2 border-slate-400 border-l-slate-400 bg-slate-50 rounded"><MdText text={inhalt.texte.t2WechseldruckverfahrenWdDoppelvakuum} /><p className="text-slate-500 text-xs mt-0.5 leading-normal"><MdText text={inhalt.texte.doppelvakuumverlegungDvNutztOrganisch} /></p>
                  </div>
                  <div className="p-2 border-l-2 border-slate-400 border-l-slate-400 bg-slate-50 rounded"><MdText text={inhalt.texte.t3Nichtdruckverfahren} /><p className="text-slate-500 text-xs mt-0.5 leading-normal"><MdText text={inhalt.texte.trogtränkungEinlagernDesHolzes} /><span className="font-mono">NP1</span><MdText text={inhalt.texte.lokaleSpezialverfahrenF32} /></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Penetrations- und Eindringtiefe-Kriterien (EN 351-1 & F 47-F 48) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xxs space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider"><MdText text={inhalt.texte.eindringtiefePenetrationsklassenNachEn} /></h4>
              <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.dieQualitätEinerChemischen} /></p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/65">
                <div className="bg-white p-2.5 rounded border border-slate-200/50">
                  <span className="font-bold text-slate-800 block mb-1"><MdText text={inhalt.texte.klasseNp1Np2} /></span>
                  <span><MdText text={inhalt.texte.np1KeineAnforderungenAn} /></span>
                  <span className="block mt-1"><MdText text={inhalt.texte.np2Mindestens3Mm} /></span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200/50">
                  <span className="font-bold text-slate-800 block mb-1"><MdText text={inhalt.texte.klasseNp3Np4} /></span>
                  <span><MdText text={inhalt.texte.np3Mindestens6Mm} /></span>
                  <span className="block mt-1"><MdText text={inhalt.texte.np4Mindestens9Mm} /></span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200/50">
                  <span className="font-bold text-slate-800 block mb-1"><MdText text={inhalt.texte.klasseNp5Np6Vollschutz} /></span>
                  <span><MdText text={inhalt.texte.np5UmfassendeSplintholzdurchdringungMind} /></span>
                  <span className="block mt-1"><MdText text={inhalt.texte.np6VollständigeSplintholzdurchdringungUn} /></span>
                </div>
              </div>
            </div>

            {/* Regelsanierung bei Pilz- und Insektenbefall nach DIN 68800-4 (F 78 - F 81) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xxs space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider"><MdText text={inhalt.texte.regelsanierungsverfahrenBeiAkutemBefall} /></h4>
              <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.istEinBauteilBereits} /></p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="space-y-2">
                  <span className="font-extrabold text-slate-800 border-b border-home-grau/10 pb-1 block"><MdText text={inhalt.texte.t1RegelsanierungBeiBefall} /></span>
                  <p className="leading-relaxed text-slate-500"><MdText text={inhalt.texte.daDerEchteHausschwamm} /></p>
                  <ul className="list-disc list-inside text-slate-500 space-y-1 text-xs">
                    <li><MdText text={inhalt.texte.schnittgrenzeBefallenesHolzIst} /></li>
                    <li><MdText text={inhalt.texte.mauerwerkssanierungMauerwerkReinigenPutz} /></li>
                    <li><MdText text={inhalt.texte.schwammSperrmittelEinstreichenOder} /></li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <span className="font-extrabold text-slate-800 border-b border-home-grau/10 pb-1 block"><MdText text={inhalt.texte.t2RegelsanierungBeiAktivem} /></span>
                  <p className="leading-relaxed text-slate-500"><MdText text={inhalt.texte.unterdrückungUndEliminierungVon} /></p>
                  <ul className="list-disc list-inside text-slate-500 space-y-1 text-xs">
                    <li><MdText text={inhalt.texte.thermischeSanierungHeißluftverfahrenEinb} /></li>
                    <li><MdText text={inhalt.texte.chemischeBekämpfungSchädigendeStellen} /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        </div>
        </ModuleTabs>
      </div>
      
      <WoodThematicLinks current="dauerhaftigkeit" />
      
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1HolzfeuchteEiner}
        zielGleichung="u = \frac{m_u - m_0}{m_0} \cdot 100\,\%"
        schritte={inhalt.daten["Holzkorrosion.schritte"]}
        ergebnisHinweis={inhalt.werte.elektrischeWiderstandsmessgeräteDinEn}
        normQuelle={inhalt.werte.dinEn131831}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2WirkstoffaufnahmeBei}
        zielGleichung="R = \frac{m_{Lsg} \cdot c}{V_{Holz}}"
        schritte={inhalt.daten["Holzkorrosion.schritte_2"]}
        ergebnisHinweis={inhalt.werte.nebenDerAufnahmeRetention}
        normQuelle={inhalt.werte.dinEn3511}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="holzkorrosion" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap10} 
        wikipedia={[
          { title: "Holzschädlingsbekämpfung", url: "https://de.wikipedia.org/wiki/Holzsch%C3%A4dlingsbek%C3%A4mpfung" },
          { title: "Holzschutz", url: "https://de.wikipedia.org/wiki/Holzschutz" },
          { title: inhalt.werte.echterHausschwamm, url: "https://de.wikipedia.org/wiki/Echter_Hausschwamm" },
          { title: "Hausbock", url: "https://de.wikipedia.org/wiki/Hausbock" }
        ]} 
        literatur={inhalt.daten["Holzkorrosion.literatur"]} 
        regelwerke={inhalt.daten["Holzkorrosion.regelwerke"]} 
        formeln={inhalt.daten["Holzkorrosion.formeln"]} 
      />
    </div>
  );
}
