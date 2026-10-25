import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Timer, 
  GitCommit, 
  RotateCw 
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { RheologySimulator } from '@/src/components/rheology/RheologySimulator';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import inhalt from '@/content/materialmodelle/Materialmodelle.json';
import { MdText } from '@/src/components/inhalt/MdText';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- SVG-ERSATZBILDER FÜR DIE MECHANISCH-RHEOLOGISCHEN MODELLE ---

const HookeShape = ({x, y, label = "E"}: {x:number, y:number, label?: string}) => (
  <g transform={`translate(${x},${y})`} className="stroke-middle-blue fill-none">
    <path d="M 0 20 L 20 20 L 25 10 L 35 30 L 45 10 L 55 30 L 65 10 L 75 30 L 80 20 L 100 20" strokeWidth="2" strokeLinejoin="round" />
    <text x="50" y="8" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">{label}</text>
  </g>
);

const NewtonShape = ({x, y, label = "η"}: {x:number, y:number, label?: string}) => (
  <g transform={`translate(${x},${y})`} className="stroke-middle-blue fill-none">
    <path d="M 0 20 L 30 20 M 30 10 L 60 10 M 30 30 L 60 30 M 30 10 L 30 30" strokeWidth="2" />
    <path d="M 50 12 L 50 28 M 50 20 L 100 20" strokeWidth="2" />
    <text x="45" y="8" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">{label}</text>
  </g>
);

const StVenantShape = ({x, y, label = "f_y"}: {x:number, y:number, label?: string}) => (
  <g transform={`translate(${x},${y})`} className="stroke-middle-blue fill-none">
    <path d="M 0 20 L 30 20 M 70 20 L 100 20" strokeWidth="2" />
    <rect x="30" y="10" width="40" height="20" strokeWidth="2" fill="white" />
    <path d="M 25 32 L 75 32" strokeWidth="2" />
    <path d="M 30 32 L 25 38 M 40 32 L 35 38 M 50 32 L 45 38 M 60 32 L 55 38 M 70 32 L 65 38" strokeWidth="1" />
    <text x="50" y="8" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">{label}</text>
  </g>
);

const ZenerShape = ({x, y}: {x:number, y:number}) => (
  <g transform={`translate(${x},${y})`} className="stroke-middle-blue fill-none">
    <path d="M 0 35 L 20 35 M 20 15 L 20 55 M 180 15 L 180 55 M 180 35 L 200 35" strokeWidth="2" />
    {/* Upper branch: Hooke E1 */}
    <line x1="20" y1="15" x2="50" y2="15" strokeWidth="1.5" />
    <HookeShape x={50} y={-5} label={inhalt.werte.eParallel} />
    <line x1="150" y1="15" x2="180" y2="15" strokeWidth="1.5" />
    {/* Lower branch: Maxwell (E2 + eta) */}
    <line x1="20" y1="55" x2="30" y2="55" strokeWidth="1.5" />
    <HookeShape x={30} y={35} label="E₂" />
    <NewtonShape x={110} y={35} label="η" />
    <line x1="170" y1="55" x2="180" y2="55" strokeWidth="1.5" />
    <text x="100" y="8" fontSize="8.5" fill="currentColor" stroke="none" textAnchor="middle">Feder E₁ (Gleichgewicht)</text>
    <text x="100" y="84" fontSize="8.5" fill="currentColor" stroke="none" textAnchor="middle">Maxwell-Ast (E₂ + η)</text>
  </g>
);

const ElastoPlasticShape = ({x, y}: {x:number, y:number}) => (
  <g transform={`translate(${x},${y})`} className="stroke-middle-blue fill-none">
    {/* Feder E in Reihe mit (Reibelement fy parallel zu Verfestigungsfeder Et) */}
    <path d="M 0 35 L 20 35" strokeWidth="2" />
    <HookeShape x={20} y={15} label={inhalt.werte.eElastisch} />
    <path d="M 120 35 L 135 35 M 135 15 L 135 55 M 215 15 L 215 55 M 215 35 L 230 35" strokeWidth="2" />
    {/* Oberer Zweig: Reibelement fy */}
    <StVenantShape x={125} y={-5} label="f_y" />
    {/* Unterer Zweig: Verfestigungsfeder Et */}
    <HookeShape x={125} y={35} label="E_t" />
    <text x="70" y="12" fontSize="9" fill="currentColor" stroke="none" textAnchor="middle">Feder E</text>
    <text x="175" y="8" fontSize="8.5" fill="currentColor" stroke="none" textAnchor="middle">Reibelement f_y</text>
    <text x="175" y="84" fontSize="8.5" fill="currentColor" stroke="none" textAnchor="middle">Verfestigung E_t</text>
  </g>
);

const BinghamShape = ({x, y}: {x:number, y:number}) => (
  <g transform={`translate(${x},${y})`} className="stroke-middle-blue fill-none">
    <path d="M 0 35 L 25 35 M 25 15 L 25 55 M 145 15 L 145 55 M 145 35 L 170 35" strokeWidth="2" />
    {/* Oberer Zweig: Reibelement fy / tau_0 */}
    <StVenantShape x={35} y={-5} label="τ₀" />
    {/* Unterer Zweig: Dämpfer eta / mu_p */}
    <NewtonShape x={35} y={35} label="μ_p" />
    <text x="85" y="8" fontSize="9" fill="currentColor" stroke="none" textAnchor="middle">Fließgrenze τ₀</text>
    <text x="85" y="84" fontSize="9" fill="currentColor" stroke="none" textAnchor="middle">Plastische Viskosität μ_p</text>
  </g>
);

// =========================================================================
// SECTION: SIMULATION RHEOLOGISCHER MODELLE (INTERAKTIVER SIMULATOR)
// =========================================================================

function RheologySection() {
  return (
    <div className="bg-white border-y border-home-grau/30 -mx-4 sm:mx-0 sm:rounded-3xl sm:border flex flex-col pt-8 mt-12 mb-8 relative overflow-hidden shadow-sm">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A3113E]/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/4"></div>
      <div className="px-4 md:px-8 flex flex-col gap-8 pb-8">
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Activity className="text-shiraz" /><MdText text={inhalt.texte.simulationRheologischerModelle} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
            <p><MdText text={inhalt.texte.interaktivesPrüflaborFürRheologische} /></p>
          </div>
        </div>

        <RheologySimulator
          renderCircuit={(m, name) => (
              <div className="p-6 bg-white border border-home-grau/30 text-text-main rounded-3xl flex flex-col justify-center items-center shadow-sm relative overflow-hidden h-full">
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-text-main/60 font-bold">Ersatzschaltbild</span>
                  <span className="text-[10px] font-mono bg-off-white text-shiraz px-2 py-0.5 rounded border border-home-grau/30 font-bold">{name}</span>
                </div>
                <div className="text-shiraz scale-[1.15] origin-center z-10 py-2">
                  {m === 'hooke' && <svg width="100" height="40" viewBox="0 0 100 40"><HookeShape x={0} y={0} /></svg>}
                  {m === 'newton' && <svg width="100" height="40" viewBox="0 0 100 40"><NewtonShape x={0} y={0} /></svg>}
                  {m === 'st_venant' && <svg width="100" height="40" viewBox="0 0 100 40"><StVenantShape x={0} y={0} /></svg>}
                  {m === 'prandtl' && <svg width="200" height="40" viewBox="0 0 200 40"><HookeShape x={0} y={0} /><StVenantShape x={100} y={0} /></svg>}
                  {m === 'elasto_plastic' && <svg width="230" height="90" viewBox="0 0 230 90"><ElastoPlasticShape x={0} y={0} /></svg>}
                  {m === 'maxwell' && <svg width="200" height="40" viewBox="0 0 200 40"><HookeShape x={0} y={0} /><NewtonShape x={100} y={0} /></svg>}
                  {m === 'kelvin' && (
                    <svg width="160" height="90" viewBox="0 0 160 90">
                      <path d="M 0 45 L 30 45 M 30 15 L 30 75 M 130 15 L 130 75 M 130 45 L 160 45" className="stroke-current" strokeWidth="2" fill="none" />
                      <HookeShape x={30} y={-5} /> 
                      <NewtonShape x={30} y={55} />
                    </svg>
                  )}
                  {m === 'zener' && (
                    <svg width="200" height="90" viewBox="0 0 200 90">
                      <ZenerShape x={0} y={0} />
                    </svg>
                  )}
                  {m === 'bingham' && (
                    <svg width="170" height="90" viewBox="0 0 170 90">
                      <BinghamShape x={0} y={0} />
                    </svg>
                  )}
                </div>
              </div>
          )}
        />

        <div className="flex flex-col gap-8 mt-2">
          <div className="flex flex-col gap-6">
            {/* PRAXISBEISPIELE DER RHEOLOGISCHEN MODELLE */}
            <div className="mt-8 pt-6 border-t border-home-grau/25 space-y-5">
              <div>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Activity className="text-shiraz" size={18} /><MdText text={inhalt.texte.praxisbeispieleAusDemBaustoff} /></h3>
                <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.inDerBauwerkstoffkundeRepräsentiert} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                
                {/* 1. Hooke */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-shiraz text-sm"><MdText text={inhalt.texte.t1HookeKörper} /></span>
                      <span className="font-mono text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">Reinelastisch</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2"><MdText text={inhalt.texte.eFeder} /></div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><MdText text={inhalt.texte.typischeBaustoffe} /></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><MdText text={inhalt.texte.bauglasKalkNatronFloatglas} /></li>
                        <li><MdText text={inhalt.texte.keramikKlinkerKristallinesUnd} /></li>
                        <li><MdText text={inhalt.texte.baustahlS235S355Unterhalb} /></li>
                        <li><MdText text={inhalt.texte.cfkLamellenCarbonfasernBesitzen} /></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500"><MdText text={inhalt.texte.mechanismusReversibleElastischeAuslenkun} /></div>
                </div>

                {/* 2. Newton */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-blue-700 text-sm"><MdText text={inhalt.texte.t2NewtonKörper} /></span>
                      <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Rein viskos</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2"><MdText text={inhalt.texte.dDtDämpfer} /></div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><MdText text={inhalt.texte.typischeBaustoffe2} /></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><MdText text={inhalt.texte.heißbitumenT140C} /></li>
                        <li><MdText text={inhalt.texte.wasserUndStarkVerdünnte} /></li>
                        <li><MdText text={inhalt.texte.niedrigviskoseEpoxidharzeZurDrucklosen} /></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500"><MdText text={inhalt.texte.mechanismusReinesLaminaresGleiten} /></div>
                </div>

                {/* 3. St. Venant */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-amber-700 text-sm"><MdText text={inhalt.texte.t3StVenantKörper} /></span>
                      <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Ideal-plastisch</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2"><MdText text={inhalt.texte.fYReibelement} /></div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><MdText text={inhalt.texte.typischeBaustoffe3} /></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><MdText text={inhalt.texte.trockenerBaugrundSandKies} /></li>
                        <li><MdText text={inhalt.texte.ptfeGleitplattenInBrückenlagern} /></li>
                        <li><MdText text={inhalt.texte.reinesFließplateauVonWeichstahl} /></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500"><MdText text={inhalt.texte.mechanismusCoulombscheFestkörperreibungA} /></div>
                </div>

                {/* 4. Prandtl */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800 text-sm"><MdText text={inhalt.texte.t4PrandtlModell} /></span>
                      <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">Elastisch-Idealplastisch</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2"><MdText text={inhalt.texte.federReibelementReihe} /></div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><MdText text={inhalt.texte.typischeBaustoffe4} /></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><MdText text={inhalt.texte.warmgewalzterBaustahlS235S355} /></li>
                        <li><MdText text={inhalt.texte.fließgelenkeImStahlStahlbetonbau} /></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500"><MdText text={inhalt.texte.mechanismusElastischeGitterdehnungGekopp} /></div>
                </div>

                {/* 5. Elasto-Plastisch mit Verfestigung */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between border-l-4 border-l-shiraz">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-shiraz text-sm"><MdText text={inhalt.texte.t5ElastoPlastischMit} /></span>
                      <span className="font-mono text-[10px] bg-red-100 text-shiraz px-2 py-0.5 rounded font-bold">Hardening</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2"><MdText text={inhalt.texte.federEInReihe} /></div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><MdText text={inhalt.texte.typischeBaustoffeNormbezug} /></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><MdText text={inhalt.texte.betonstabstahlB500bNachEc2} /></li>
                        <li><MdText text={inhalt.texte.kaltverformterBetonstahlB500aDuktilitäts} /></li>
                        <li><MdText text={inhalt.texte.aluminiumlegierungenEnAw6060} /></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500"><MdText text={inhalt.texte.mechanismusVersetzungsaufstauAnKorngrenz} /></div>
                </div>

                {/* 6. Maxwell */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-purple-700 text-sm"><MdText text={inhalt.texte.t6MaxwellModell} /></span>
                      <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">Spannungsrelaxation</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2"><MdText text={inhalt.texte.federDämpferReihe} /></div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><MdText text={inhalt.texte.typischeBaustoffe5} /></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><MdText text={inhalt.texte.bitumenUndBitumenhaltigeFugenvergussmass} /></li>
                        <li><MdText text={inhalt.texte.thermoplasteOberhalbDerGlasübergangstemp} /></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500"><MdText text={inhalt.texte.mechanismusDerSerielleDämpfer} /></div>
                </div>

                {/* 7. Kelvin-Voigt */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-emerald-700 text-sm"><MdText text={inhalt.texte.t7KelvinVoigtModell} /></span>
                      <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold"><MdText text={inhalt.texte.kriechenRetardation} /></span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2"><MdText text={inhalt.texte.federDämpferParallel} /></div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><MdText text={inhalt.texte.typischeBaustoffe6} /></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><MdText text={inhalt.texte.normalbetonZementsteinDinEn} /></li>
                        <li><MdText text={inhalt.texte.konstruktionsvollholzC24NachEc5} /></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500"><MdText text={inhalt.texte.mechanismusDämpferBremstVerformungsgesch} /></div>
                </div>

                {/* 8. Zener / Standard Linear Solid */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-indigo-700 text-sm"><MdText text={inhalt.texte.t8ZenerModellSls} /></span>
                      <span className="font-mono text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold"><MdText text={inhalt.texte.viskoelastischerFestkörper} /></span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2"><MdText text={inhalt.texte.federEParallelZu} /></div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><MdText text={inhalt.texte.typischeBaustoffe7} /></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><MdText text={inhalt.texte.spannstahlEc2RelaxationUnter} /></li>
                        <li><MdText text={inhalt.texte.betonUnterDauerlastDie} /></li>
                        <li><MdText text={inhalt.texte.asphaltbetonImStraßenbauDin} /></li>
                        <li><MdText text={inhalt.texte.elastomerBrückenlagerNeoprenNach} /></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500"><MdText text={inhalt.texte.kombiniertElastischeSofortantwortAsympto} /></div>
                </div>

                {/* 9. Bingham */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-teal-800 text-sm"><MdText text={inhalt.texte.t9BinghamKörper} /></span>
                      <span className="font-mono text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold"><MdText text={inhalt.texte.viskoplastischesFluid} /></span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2"><MdText text={inhalt.texte.reibelementParallelZuDämpfer} /></div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><MdText text={inhalt.texte.typischeBaustoffe8} /></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><MdText text={inhalt.texte.frischbetonTransportbetonNachDin} /></li>
                        <li><MdText text={inhalt.texte.selbstverdichtenderBetonSvbScc} /></li>
                        <li><MdText text={inhalt.texte.putzmörtelFliesenkleberBleibenStandfest} /></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500"><MdText text={inhalt.texte.fließtErstNachÜberwinden} /></div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

// =========================================================================
// HAUPTKOMPONENTE: MATERIALMODELLE
// =========================================================================

export default function Materialmodelle() {
  const [activeModel, setActiveModel] = useState<'linear' | 'non-linear' | 'ideal-plastic' | 'elasto-plastic' | 'visco-elastic' | 'thixotropy-rheopexy'>('elasto-plastic');

  // Interaktive Parameter für "Elasto-Plastisch mit Verfestigung"
  const [epPreset, setEpPreset] = useState<'b500b' | 's355' | 's235' | 'alu' | 'custom'>('b500b');
  const [fyVal, setFyVal] = useState<number>(500); // MPa
  const [eModVal, setEModVal] = useState<number>(200000); // MPa
  const [etModVal, setEtModVal] = useState<number>(1600); // MPa (Verfestigungsmodul, Preset B500B)
  const [appliedMaxEpsPromille, setAppliedMaxEpsPromille] = useState<number>(50); // max. Dehnung in Promille (Preset B500B: ε_uk = 50 ‰)

  // Preset-Wechsel für Elasto-Plastisch mit Verfestigung
  const handleSelectEpPreset = (preset: 'b500b' | 's355' | 's235' | 'alu' | 'custom') => {
    setEpPreset(preset);
    if (preset === 'b500b') {
      setFyVal(500);
      setEModVal(200000);
      setEtModVal(1600); // ca. (540 - 500) / (0.050 - 0.0025) ≈ 840-2000 MPa
      setAppliedMaxEpsPromille(50); // ε_uk ≥ 5 % → k sichtbar ≥ 1,08
    } else if (preset === 's355') {
      setFyVal(355);
      setEModVal(210000);
      setEtModVal(2500);
      setAppliedMaxEpsPromille(15);
    } else if (preset === 's235') {
      setFyVal(235);
      setEModVal(210000);
      setEtModVal(2000);
      setAppliedMaxEpsPromille(15);
    } else if (preset === 'alu') {
      setFyVal(150); // Rp0.2
      setEModVal(70000);
      setEtModVal(1200);
      setAppliedMaxEpsPromille(15);
    }
  };

  // Berechnete Kennwerte für Elasto-Plastisch mit Verfestigung
  const epAnalytics = useMemo(() => {
    const epsY = fyVal / eModVal; // z.B. 500 / 200000 = 0.0025 (2.5 Promille)
    const epsYPromille = epsY * 1000;
    const maxEps = appliedMaxEpsPromille / 1000;
    
    // Spitzenspannung bei maxEps
    let peakStress = 0;
    if (maxEps <= epsY) {
      peakStress = maxEps * eModVal;
    } else {
      peakStress = fyVal + (maxEps - epsY) * etModVal;
    }

    // Elastische Rückfederung bei Entlastung: Delta eps_e = peakStress / E
    const epsElasticRecovery = peakStress / eModVal;
    const epsElasticRecoveryPromille = epsElasticRecovery * 1000;

    // Bleibende plastische Dehnung: eps_p = maxEps - epsElasticRecovery
    const epsPlasticResidual = Math.max(0, maxEps - epsElasticRecovery);
    const epsPlasticResidualPromille = epsPlasticResidual * 1000;

    // Verfestigungsverhältnis k = peakStress / fyVal (nach DIN EN 1992-1-1)
    const kVerhaeltnis = fyVal > 0 ? peakStress / fyVal : 1;

    return {
      epsYPromille,
      peakStress,
      epsElasticRecoveryPromille,
      epsPlasticResidualPromille,
      kVerhaeltnis
    };
  }, [fyVal, eModVal, etModVal, appliedMaxEpsPromille]);

  const generateData = () => {
    if (activeModel === 'thixotropy-rheopexy') {
      const times = [];
      const thixo_eta = [];
      const rheo_eta = [];
      for (let t = 0; t <= 10; t += 0.2) {
        times.push(formatDeZahl(t, 1));
        thixo_eta.push(20 + 80 * Math.exp(-0.5 * t));
        rheo_eta.push(100 - 80 * Math.exp(-0.5 * t));
      }
      return {
        labels: times,
        datasets: [
          {
            label: inhalt.werte.thixotropiePaSAbbau,
            data: thixo_eta,
            borderColor: '#991b1b',
            backgroundColor: 'rgba(153, 27, 27, 0.1)',
            fill: false,
            tension: 0.2,
            pointRadius: 0
          },
          {
            label: inhalt.werte.rheopexiePaSAufbau,
            data: rheo_eta,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: false,
            tension: 0.2,
            pointRadius: 0
          }
        ]
      };
    }

    // Wenn "Elasto-Plastisch mit Verfestigung" aktiv ist:
    if (activeModel === 'elasto-plastic') {
      const maxPlotEps = Math.max(appliedMaxEpsPromille + 5, 25); // Promille
      const epsLabels: string[] = [];
      const sigLoading: (number | null)[] = [];
      const sigIdealPlastic: (number | null)[] = [];
      const sigUnloading: (number | null)[] = [];

      const epsY = fyVal / eModVal;
      const maxEps = appliedMaxEpsPromille / 1000;
      const peakStress = maxEps <= epsY ? maxEps * eModVal : fyVal + (maxEps - epsY) * etModVal;
      const epsResidual = Math.max(0, maxEps - peakStress / eModVal);

      for (let ep = 0; ep <= maxPlotEps; ep += 0.5) {
        const e = ep / 1000; // Dehnung als Dezimalzahl
        epsLabels.push(formatDeZahl(ep, 1));

        // 1. Belastungsast bis zum Bruch / Maximalbereich
        if (e <= epsY) {
          sigLoading.push(e * eModVal);
        } else {
          sigLoading.push(fyVal + (e - epsY) * etModVal);
        }

        // 2. Ideal-Plastischer Vergleichsast
        sigIdealPlastic.push(Math.min(e * eModVal, fyVal));

        // 3. Entlastungsast von peakStress bei maxEps zurück zu sigma = 0
        if (e >= epsResidual && e <= maxEps) {
          // Gerade von (epsResidual, 0) bis (maxEps, peakStress) mit Steigung E
          const unlSig = (e - epsResidual) * eModVal;
          sigUnloading.push(unlSig);
        } else {
          sigUnloading.push(null);
        }
      }

      return {
        labels: epsLabels,
        datasets: [
          {
            label: inhalt.werte.belastungsastMitVerfestigungEt,
            data: sigLoading,
            borderColor: '#A3113E',
            backgroundColor: 'rgba(163, 17, 62, 0.08)',
            fill: false,
            borderWidth: 2.5,
            pointRadius: 0
          },
          {
            label: inhalt.werte.entlastungspfadElastischerRücksprungMit,
            data: sigUnloading,
            borderColor: '#2563eb',
            borderDash: [5, 4],
            borderWidth: 2.5,
            fill: false,
            pointRadius: 0
          },
          {
            label: inhalt.werte.vergleichElastischIdealplastischOhne,
            data: sigIdealPlastic,
            borderColor: '#94a3b8',
            borderDash: [3, 3],
            borderWidth: 1.5,
            fill: false,
            pointRadius: 0
          }
        ]
      };
    }

    // Standard qualitative Verläufe für andere Modelle
    const eps = [];
    const sig = [];
    const E = 210000; // MPa (Baustahl nach DIN EN 1993-1-1)
    const fy = 355; // MPa (z.B. S355)

    for (let e = 0; e <= 0.005; e += 0.0001) {
      eps.push(formatDeZahl(e * 1000, 1)); // in Promille
      
      if (activeModel === 'linear') {
        sig.push(e * E);
      } else if (activeModel === 'non-linear') {
        const e0 = 0.002;
        sig.push((E * e) / (1 + Math.pow(e / e0, 2)));
      } else if (activeModel === 'ideal-plastic') {
        sig.push(Math.min(e * E, fy));
      } else if (activeModel === 'visco-elastic') {
        const sigma_inf = 400; // MPa
        sig.push(sigma_inf * (1 - Math.exp(- (E * e) / sigma_inf)));
      }
    }

    return {
      labels: eps,
      datasets: [
        {
          label: inhalt.werte.spannungMpa,
          data: sig,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(163, 17, 62, 0.1)',
          fill: true,
          tension: 0.1,
          pointRadius: 0
        }
      ]
    };
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Activity className="text-shiraz" /><MdText text={inhalt.texte.materialmodelleRheologie} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.materialmodelleStoffgesetzeBeschreibenDe} /></p>
        </div>

        {/* Tab-Navigation für die Grundmodelle */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-2 relative">
          <button aria-pressed={activeModel === 'linear'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'linear' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('linear')}>
            <TrendingUp size={16} /> Linear-Elastisch
          </button>
          <button aria-pressed={activeModel === 'non-linear'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'non-linear' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('non-linear')}>
            <Activity size={16} /> Nichtlinear
          </button>
          <button aria-pressed={activeModel === 'ideal-plastic'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'ideal-plastic' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('ideal-plastic')}>
            <GitCommit size={16} /> Elastisch-Idealplastisch
          </button>
          <button aria-pressed={activeModel === 'elasto-plastic'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'elasto-plastic' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('elasto-plastic')}>
            <GitCommit size={16} /><MdText text={inhalt.texte.elastoPlastischMitVerfestigung} /></button>
          <button aria-pressed={activeModel === 'visco-elastic'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'visco-elastic' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('visco-elastic')}>
            <Timer size={16} /><MdText text={inhalt.texte.rheologischZeitabh} /></button>
          <button aria-pressed={activeModel === 'thixotropy-rheopexy'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'thixotropy-rheopexy' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('thixotropy-rheopexy')}>
            <RotateCw size={16} /><MdText text={inhalt.texte.thixotropieRheopexie} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
        
        {/* Linke Spalte: Theorie & Parametersteuerung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">
            {activeModel === 'linear' && inhalt.werte.linearElastischesMaterialmodell}
            {activeModel === 'non-linear' && inhalt.werte.nichtlinearElastischesModell}
            {activeModel === 'ideal-plastic' && inhalt.werte.elastischIdealplastischesModellOhne}
            {activeModel === 'elasto-plastic' && inhalt.werte.elastoPlastischMitVerfestigung}
            {activeModel === 'visco-elastic' && inhalt.werte.rheologischesModellZB}
            {activeModel === 'thixotropy-rheopexy' && inhalt.werte.thixotropieRheopexieZeitabhängigeViskosi}
          </h3>
          
          <div className="text-sm text-text-main/80 space-y-4">
            {activeModel === 'linear' && (
              <>
                <p><MdText text={inhalt.texte.hookeschesGesetzSpannungUnd} /><FormulaText text="\sigma = E \cdot \varepsilon" />.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><MdText text={inhalt.texte.keineBleibendenVerformungenNach} /></li>
                  <li><MdText text={inhalt.texte.giltNäherungsweiseFürViele} /></li>
                  <li><MdText text={inhalt.texte.mathematischAmEinfachstenZu} /></li>
                </ul>
              </>
            )}
            {activeModel === 'non-linear' && (
              <>
                <p><MdText text={inhalt.texte.krümmungDesVerlaufsSpannung} /></p>
                <ul className="list-disc list-inside space-y-1">
                  <li><MdText text={inhalt.texte.derZusammenhangZwischenSpannung} /></li>
                  <li><MdText text={inhalt.texte.typischFürElastomereBeton} /></li>
                  <li><MdText text={inhalt.texte.rechnerischFürBetonÜber} /></li>
                </ul>
              </>
            )}
            {activeModel === 'ideal-plastic' && (
              <>
                <p><MdText text={inhalt.texte.fließplateauOhneVerfestigungNach} /><FormulaText text="f_y" /><MdText text={inhalt.texte.nimmtDieDehnungZu} /></p>
                <ul className="list-disc list-inside space-y-1">
                  <li><MdText text={inhalt.texte.typischFürKlassischenBaustahl} /></li>
                  <li><MdText text={inhalt.texte.ermöglichtStatischeSchnittgrößenumlageru} /></li>
                  <li><MdText text={inhalt.texte.nachEntlastungBleibenIrreversible} /></li>
                </ul>
              </>
            )}

            {/* FOKUS: ELASTO-PLASTISCH MIT VERFESTIGUNG */}
            {activeModel === 'elasto-plastic' && (
              <div className="space-y-4">
                <p><MdText text={inhalt.texte.bilinearesVerfestigungsmodellNachÜbersch} /></p>
                
                {/* Werkstoff-Presets */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-text-main/70 uppercase tracking-wide block">Werkstoff-Presets:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => handleSelectEpPreset('b500b')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${epPreset === 'b500b' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'}`}
                    ><MdText text={inhalt.texte.b500bBetonstahl} /></button>
                    <button
                      type="button"
                      onClick={() => handleSelectEpPreset('s355')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${epPreset === 's355' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'}`}
                    ><MdText text={inhalt.texte.s355Baustahl} /></button>
                    <button
                      type="button"
                      onClick={() => handleSelectEpPreset('s235')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${epPreset === 's235' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'}`}
                    ><MdText text={inhalt.texte.s235Weichstahl} /></button>
                    <button
                      type="button"
                      onClick={() => handleSelectEpPreset('alu')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${epPreset === 'alu' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'}`}
                    ><MdText text={inhalt.texte.enAw6060Alu} /></button>
                  </div>
                </div>

                {/* Interaktive Parameter-Slider */}
                <div className="space-y-3 bg-off-white p-4 rounded-xl border border-home-grau/30">
                  <Slider 
                    label={<FormulaText text={inhalt.werte.fließgrenzeFY} />} 
                    min={100} 
                    max={700} 
                    step={10} 
                    value={fyVal} 
                    unit="MPa" 
                    onChange={e => { setFyVal(Number(e.target.value)); setEpPreset('custom'); }} 
                  />
                  <Slider 
                    label={<FormulaText text={inhalt.werte.elastizitätsmodulE} />} 
                    min={50000} 
                    max={220000} 
                    step={5000} 
                    value={eModVal} 
                    unit="MPa" 
                    onChange={e => { setEModVal(Number(e.target.value)); setEpPreset('custom'); }} 
                  />
                  <Slider 
                    label={<FormulaText text={inhalt.werte.verfestigungsmodulETTangentenmodul} />} 
                    min={500} 
                    max={10000} 
                    step={250} 
                    value={etModVal} 
                    unit="MPa" 
                    onChange={e => { setEtModVal(Number(e.target.value)); setEpPreset('custom'); }} 
                  />
                  <Slider 
                    label={<FormulaText text="Max. aufgeprägte Dehnung \varepsilon_{\text{max}} (für Entlastungspfad)" />} 
                    min={3} 
                    max={60} 
                    step={1} 
                    value={appliedMaxEpsPromille} 
                    unit="‰" 
                    onChange={e => setAppliedMaxEpsPromille(Number(e.target.value))} 
                  />
                </div>

                {/* Live-Berechnungs-Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold"><MdText text={inhalt.texte.fließdehnungY} /></span>
                    <span className="font-mono font-bold text-sm text-text-main mt-0.5 block">
                      {formatDeZahl(epAnalytics.epsYPromille, 2)} ‰
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono"><MdText text={inhalt.texte.yFYE} /></span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold"><MdText text={inhalt.texte.höchstspannungMax} /></span>
                    <span className="font-mono font-bold text-sm text-shiraz mt-0.5 block">
                      {formatDeZahl(epAnalytics.peakStress, 1)} MPa
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">bei ε = {formatDeWert(appliedMaxEpsPromille)} ‰</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold"><MdText text={inhalt.texte.spannungsverhältnisMaxFY} /></span>
                    <span className={`font-mono font-bold text-sm mt-0.5 block ${epAnalytics.kVerhaeltnis >= 1.08 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {formatDeZahl(epAnalytics.kVerhaeltnis, 3)}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono"><MdText text={inhalt.texte.kFTF} /></span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold"><MdText text={inhalt.texte.rückfederungE} /></span>
                    <span className="font-mono font-bold text-sm text-blue-700 mt-0.5 block">
                      {formatDeZahl(epAnalytics.epsElasticRecoveryPromille, 2)} ‰
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono"><MdText text={inhalt.texte.eMaxE} /></span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25 col-span-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold"><MdText text={inhalt.texte.bleibendeDehnungP} /></span>
                    <span className="font-mono font-bold text-sm text-purple-900 mt-0.5 block">
                      {formatDeZahl(epAnalytics.epsPlasticResidualPromille, 2)} ‰
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono"><MdText text={inhalt.texte.pMaxEPlastische} /></span>
                  </div>
                </div>

                <ul className="list-disc list-inside space-y-1 text-xs text-text-main/70">
                  <li><MdText text={inhalt.texte.entlastungsastBeiLastrücknahmeEntspannt} /></li>
                  <li><MdText text={inhalt.texte.kaltverfestigungDurchAufstauVon} /></li>
                  <li><MdText text={inhalt.texte.duktilitätNachEc2Hochduktiler} /></li>
                </ul>
              </div>
            )}

            {activeModel === 'visco-elastic' && (
              <>
                <p><MdText text={inhalt.texte.zeitabhängigkeitDieBeziehungZwischen} /></p>
                <ul className="list-disc list-inside space-y-1">
                  <li><MdText text={inhalt.texte.kriechenRetardationZunahmeDer} /></li>
                  <li><MdText text={inhalt.texte.relaxationAbnahmeDerSpannung} /></li>
                  <li><MdText text={inhalt.texte.abgebildetDurchKombinationenVon} /></li>
                  <li><MdText text={inhalt.texte.dasDiagrammZeigtQualitativ} /></li>
                </ul>
              </>
            )}

            {activeModel === 'thixotropy-rheopexy' && (
              <div className="flex flex-col gap-4">
                <p><MdText text={inhalt.texte.zeitabhängigeFluidEigenschaftenRheologie} /></p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <h4 className="font-bold text-xs text-red-900 mb-1"><MdText text={inhalt.texte.thixotropieVerflüssigung} /></h4>
                    <p className="text-[11px] text-red-800 leading-normal"><MdText text={inhalt.texte.prinzipViskositätsabnahmeBeiKonstanter} /></p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl border-dashed">
                    <h4 className="font-bold text-xs text-blue-900 mb-1"><MdText text={inhalt.texte.rheopexieVerdickung} /></h4>
                    <p className="text-[11px] text-blue-800 leading-normal"><MdText text={inhalt.texte.prinzipViskositätserhöhungBeiFortwährend} /></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rechte Spalte: Diagramm */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/30 pb-2">
            <h3 className="text-lg font-bold text-text-main">
              {activeModel === 'thixotropy-rheopexy' ? inhalt.werte.rheologischerZeitverlaufViskositätZeit : inhalt.werte.spannungsDehnungsDiagramm}
            </h3>
            {activeModel === 'elasto-plastic' && (
              <span className="text-xs font-mono bg-shiraz/10 text-shiraz border border-shiraz/30 px-2 py-0.5 rounded-full font-bold"><MdText text={inhalt.texte.bilineareVerfestigung} /></span>
            )}
          </div>

          <div className="h-80 w-full relative">
            <Line 
              data={generateData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { 
                    title: { 
                      display: true, 
                      text: activeModel === 'thixotropy-rheopexy' ? inhalt.werte.viskositätPaS : inhalt.werte.spannungMpa2,
                      color: '#1e293b',
                      font: { size: 12, weight: 'bold' }
                    },
                    suggestedMax: activeModel === 'thixotropy-rheopexy' ? 110 : (activeModel === 'elasto-plastic' ? Math.max(600, epAnalytics.peakStress * 1.1) : 500),
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.06)' }
                  },
                  x: { 
                    title: { 
                      display: true, 
                      text: activeModel === 'thixotropy-rheopexy' ? inhalt.werte.scherdauerTSBei : inhalt.werte.dehnung,
                      color: '#1e293b',
                      font: { size: 12, weight: 'bold' }
                    },
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.06)' }
                  }
                },
                plugins: { 
                  legend: { 
                    display: activeModel === 'thixotropy-rheopexy' || activeModel === 'elasto-plastic',
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      font: { size: 11 }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const val = context.parsed.y !== null ? formatDeZahl(context.parsed.y, 1) : '';
                        const unit = activeModel === 'thixotropy-rheopexy' ? ' Pa·s' : ' MPa';
                        return `${context.dataset.label ? context.dataset.label.split(' ')[0] : 'Wert'}: ${val}${unit}`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* RHEOLOGIE-SIMULATOR FÜR ERSATZMODELLE */}
      <RheologySection />

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1BleibendeDehnung}
        zielGleichung="\varepsilon_p = \varepsilon_{max} - \frac{\sigma_{max}}{E}"
        schritte={inhalt.daten["Materialmodelle.schritte"]}
        ergebnisHinweis={inhalt.werte.fastDieGesamteDehnung}
        normQuelle={inhalt.werte.dinEn19921}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2RelaxationMaxwell}
        zielGleichung="\sigma(t) = \sigma_0 \cdot e^{-t/\tau}"
        schritte={inhalt.daten["Materialmodelle.schritte_2"]}
        ergebnisHinweis={inhalt.werte.rüttelenergieSenktDieWirksame}
        normQuelle={inhalt.werte.rheologischeGrundmodelleMaxwellBingham}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="materialmodelle" />

      {/* FOOTER MIT FORMELN, WIKIPEDIA, NORMEN & LITERATUR */}
      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap5}
        wikipedia={[
          { title: inhalt.werte.hookeschesGesetz, url: 'https://de.wikipedia.org/wiki/Hookesches_Gesetz' },
          { title: 'Rheologie', url: 'https://de.wikipedia.org/wiki/Rheologie' },
          { title: 'Viskoelastizität', url: 'https://de.wikipedia.org/wiki/Viskoelastizit%C3%A4t' },
          { title: 'Fließkurve', url: 'https://de.wikipedia.org/wiki/Flie%C3%9Fkurve' },
          { title: 'Bauschinger-Effekt', url: 'https://de.wikipedia.org/wiki/Bauschingereffekt' }
        ]}
        regelwerke={inhalt.daten["Materialmodelle.regelwerke"]}
        literatur={inhalt.daten["Materialmodelle.literatur"]}
        formeln={inhalt.daten["Materialmodelle.formeln"]}
      />
    </div>
  );
}
