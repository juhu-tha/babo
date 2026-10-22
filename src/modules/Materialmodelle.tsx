import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Timer, 
  GitCommit, 
  RotateCw, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Info, 
  Sparkles, 
  BookOpen 
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Line } from 'react-chartjs-2';
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
    <HookeShape x={50} y={-5} label="E₁ (Parallel)" />
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
    <HookeShape x={20} y={15} label="E (Elastisch)" />
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
            <Activity className="text-shiraz" /> Simulation Rheologischer Modelle
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
            <p>
              Interaktives Prüflabor für rheologische Ersatzmodelle der Baustoffkunde. Stellen Sie Einwirkungen (Kriechen, Relaxation, zyklische Lasten)
              und Materialparameter ein, um Spannungs- und Dehnungsantworten sowie Formänderungsarbeit und Hysterese zu analysieren.
            </p>
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
                  <Activity className="text-shiraz" size={18} /> Praxisbeispiele aus dem Baustoff- &amp; Werkstoffbereich für jedes Modell
                </h3>
                <p className="text-xs text-text-main/70 mt-1">
                  In der Bauwerkstoffkunde repräsentiert jedes rheologische Ersatzmodell das charakteristische mechanische Antwortverhalten 
                  konkreter Baustoffe unter Kurzzeit-, Dauer- oder Zwangbeanspruchung.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                
                {/* 1. Hooke */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-shiraz text-sm">1. Hooke-Körper</span>
                      <span className="font-mono text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">Reinelastisch</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">σ = E · ε | Feder</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Bauglas (Kalk-Natron-Floatglas):</strong> Ideal sprödelastisch bis zum Bruch (DIN 18008). Keinerlei Fließzone oder Raumtemperaturkriechen.</li>
                        <li><strong>Keramik &amp; Klinker:</strong> Kristallines und amorphes Gefüge federt verzögerungsfrei ein.</li>
                        <li><strong>Baustahl (S235/S355):</strong> Unterhalb der Streckgrenze (<InlineMath math="\sigma < f_y" />) streng linear-elastisch.</li>
                        <li><strong>CFK-Lamellen:</strong> Carbonfasern besitzen rein elastische Dehnkennlinien bis zum Faserbruch.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Reversible elastische Auslenkung der Atomgitterbindungen ohne Dämpfungsverluste.
                  </div>
                </div>

                {/* 2. Newton */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-blue-700 text-sm">2. Newton-Körper</span>
                      <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Rein viskos</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">σ = η · (dε/dt) | Dämpfer</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Heißbitumen (T &gt; 140 °C):</strong> Beim Mischen näherungsweise newtonsch-viskos zur vollflächigen Gesteinsbenetzung. Gussasphalt als Bitumen-Gesteinskörnungs-Gemisch ist dagegen kein Newton-Fluid (Fließgrenze, strukturviskos).</li>
                        <li><strong>Wasser und stark verdünnte Feinstsuspensionen:</strong> näherungsweise newtonsch. Zementleim üblicher w/z-Werte verhält sich dagegen wie ein Bingham-Fluid.</li>
                        <li><strong>Niedrigviskose Epoxidharze:</strong> Zur drucklosen Rissverpressung vor dem Gelieren.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Reines laminares Gleiten von Fluidmolekülen. Keine Energiespeicherung, 100 % Dissipation in Wärme.
                  </div>
                </div>

                {/* 3. St. Venant */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-amber-700 text-sm">3. St.-Venant-Körper</span>
                      <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Ideal-plastisch</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">|σ| ≤ f_y | Reibelement</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Trockener Baugrund (Sand &amp; Kies):</strong> Coulomb'sches Gesetz <InlineMath math="\tau = c + \sigma \cdot \tan\varphi" /> (trockener Sand: c ≈ 0). Unterhalb der Scherfestigkeit starr, bei Überschreiten Gleiten. Die Grenzschubspannung hängt hier von der Normalspannung ab – das St.-Venant-Element bildet nur eine konstante Grenze ab.</li>
                        <li><strong>PTFE-Gleitplatten in Brückenlagern:</strong> Feste Reibungsgrenze zur Verschiebungskompensation.</li>
                        <li><strong>Reines Fließplateau von Weichstahl:</strong> Plastisches Gleiten bei konstanter Streckgrenzenspannung.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Coulombsche Festkörperreibung / Aktivierung von Kristallgleitsystemen bei Grenzschubspannung.
                  </div>
                </div>

                {/* 4. Prandtl */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800 text-sm">4. Prandtl-Modell</span>
                      <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">Elastisch-Idealplastisch</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">Feder + Reibelement (Reihe)</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Warmgewalzter Baustahl (S235, S355):</strong> Elastische Dehnung bis zur Streckgrenze <InlineMath math="f_y" />, danach Fließplateau ohne Spannungsanstieg (Lüdersband-Bereich, ca. 1–2 % Dehnung); anschließend folgt Verfestigung.</li>
                        <li><strong>Fließgelenke im Stahl- &amp; Stahlbetonbau:</strong> Basis der Fließgelenktheorie nach DIN EN 1993-1-1 (plastische Tragwerksberechnung nur mit Querschnittsklasse 1; Klasse 2 erreicht die plastische Querschnittstragfähigkeit, aber ohne ausreichende Rotationskapazität).</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Elastische Gitterdehnung gekoppelt mit athermischer Versetzungsbewegung ab <InlineMath math="f_y" />.
                  </div>
                </div>

                {/* 5. Elasto-Plastisch mit Verfestigung */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between border-l-4 border-l-shiraz">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-shiraz text-sm">5. Elasto-Plastisch mit Verfestigung</span>
                      <span className="font-mono text-[10px] bg-red-100 text-shiraz px-2 py-0.5 rounded font-bold">Hardening</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">Feder E in Reihe mit (Reibelement f_y ∥ Feder H), E_t = E·H/(E+H)</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe &amp; Normbezug:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Betonstabstahl (B500B nach EC2):</strong> Ausgeprägter Verfestigungsast mit <InlineMath math="k = (f_t/f_y)_k \ge 1{,}08" /> und <InlineMath math="\varepsilon_{uk} \ge 5{,}0\,\%" /> zur Sicherung hoher Rotationsfähigkeit im Bruchzustand (GZT).</li>
                        <li><strong>Kaltverformter Betonstahl B500A (Duktilitätsklasse A: k ≥ 1,05, ε<sub>uk</sub> ≥ 2,5 %):</strong> Kaltverfestigt mit kontinuierlichem Spannungsanstieg ohne Fließplateau.</li>
                        <li><strong>Aluminiumlegierungen (EN AW-6060 / 6082):</strong> Ausgeprägte Dehnungsverfestigung ab Dehngrenze <InlineMath math="R_{p0{,}2}" />.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Versetzungsaufstau an Korngrenzen (Kaltverfestigung); Bauschinger-Hysterese bei zyklischer Umkehr.
                  </div>
                </div>

                {/* 6. Maxwell */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-purple-700 text-sm">6. Maxwell-Modell</span>
                      <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">Spannungsrelaxation</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">Feder + Dämpfer (Reihe)</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Bitumen und bitumenhaltige Fugenvergussmassen bei Dauerdehnung:</strong> Zwangspannungen aus Temperatur bauen sich viskos ab.</li>
                        <li><strong>Thermoplaste oberhalb der Glasübergangstemperatur:</strong> Spannungen unter konstanter Dehnung relaxieren nahezu vollständig.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Der serielle Dämpfer fließt stetig und entlastet die elastische Feder (<InlineMath math="\sigma(t) \to 0" />). Spannstahl relaxiert dagegen nur um wenige Prozent (Relaxationsklasse 2: ρ<sub>1000</sub> = 2,5 %) → Zener-Modell.
                  </div>
                </div>

                {/* 7. Kelvin-Voigt */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-emerald-700 text-sm">7. Kelvin-Voigt-Modell</span>
                      <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Kriechen / Retardation</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">Feder + Dämpfer (Parallel)</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Normalbeton &amp; Zementstein (DIN EN 1992-1-1):</strong> Langzeitdurchbiegung von Decken unter Dauerlastspannung. Die Verformung ist durch das elastische Gesteinsgerüst asymptotisch begrenzt (<InlineMath math="\varphi \approx 1{,}5 - 3{,}0" />).</li>
                        <li><strong>Konstruktionsvollholz (C24 nach EC5):</strong> Langzeitkriechen der Zellwand (Hemicellulose-Lignin-Matrix); k<sub>def</sub> nach DIN EN 1995-1-1, Tab. 3.2: Vollholz NKL 1 = 0,6; NKL 2 = 0,8; NKL 3 = 2,0.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Dämpfer bremst Verformungsgeschwindigkeit; parallele Feder garantiert endlichen Gleichgewichtsendwert. Kelvin-Voigt allein hat keine elastische Sofortverformung und keinen irreversiblen Kriechanteil – für Beton und Holz wird daher die Reihenschaltung Feder + Kelvin (= Zener/SLS) oder das Burgers-Modell verwendet.
                  </div>
                </div>

                {/* 8. Zener / Standard Linear Solid */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-indigo-700 text-sm">8. Zener-Modell (SLS)</span>
                      <span className="font-mono text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">Viskoelastischer Festkörper</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">Feder E₁ parallel zu Maxwell (E₂ + η)</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Spannstahl (EC2):</strong> Relaxation unter konstanter Vordehnung auf einen Endwert σ<sub>∞</sub> &gt; 0 (Spannkraftverlust <InlineMath math="\Delta \sigma_{pr}" />).</li>
                        <li><strong>Beton unter Dauerlast:</strong> Die Kriechzahl φ entspricht im Zener-Modell E₂/E₁.</li>
                        <li><strong>Asphaltbeton im Straßenbau (DIN EN 13108):</strong> Das Mineralgerüst federt elastisch (<InlineMath math="E_1" />), während der Bitumenfilm viskose Relaxationen steuert; für bleibende Verformung (Spurrinnen) → Burgers-Modell.</li>
                        <li><strong>Elastomer-Brückenlager (Neopren nach DIN EN 1337-3):</strong> Sofortige elastische Stauchung, gefolgt von Relaxation auf Restspannung <InlineMath math="\sigma_\infty > 0" />.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Kombiniert elastische Sofortantwort, asymptotisch begrenztes Kriechen und unvollständige Relaxation.
                  </div>
                </div>

                {/* 9. Bingham */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-teal-800 text-sm">9. Bingham-Körper</span>
                      <span className="font-mono text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">Viskoplastisches Fluid</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">Reibelement parallel zu Dämpfer (τ = τ₀ + μ_p · γ̇)</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Frischbeton (Transportbeton nach DIN EN 206):</strong> Besitzt eine Fließgrenze <InlineMath math="\tau_0" /> (steht auf dem Förderband) und fließt erst bei Rüttelenergie mit plastischer Viskosität <InlineMath math="\mu_p" />.</li>
                        <li><strong>Selbstverdichtender Beton (SVB / SCC):</strong> Fließgrenze wird minimiert (<InlineMath math="\tau_0 \approx 0" />), hohe Viskosität verhindert Entmischung.</li>
                        <li><strong>Putzmörtel &amp; Fliesenkleber:</strong> Bleiben standfest an senkrechten Wänden haften.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Fließt erst nach Überwinden der inneren Haft- und Fließgrenze; Standardmodell der Frischbeton-Rheologie. Größenordnungen (stark rezepturabhängig): Normalbeton F3 τ₀ ≈ 0,5–2 kPa, μ<sub>p</sub> ≈ 20–100 Pa·s; SVB τ₀ ≈ 0–60 Pa. Der Bingham-Körper wird in Scherung (τ, γ̇) beschrieben, nicht in Normalspannung σ/ε.
                  </div>
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
            label: 'Thixotropie η (Pa·s) - Abbau bei konstanter Scherrate',
            data: thixo_eta,
            borderColor: '#991b1b',
            backgroundColor: 'rgba(153, 27, 27, 0.1)',
            fill: false,
            tension: 0.2,
            pointRadius: 0
          },
          {
            label: 'Rheopexie η (Pa·s) - Aufbau bei konstanter Scherrate',
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
            label: 'Belastungsast (mit Verfestigung Et)',
            data: sigLoading,
            borderColor: '#A3113E',
            backgroundColor: 'rgba(163, 17, 62, 0.08)',
            fill: false,
            borderWidth: 2.5,
            pointRadius: 0
          },
          {
            label: 'Entlastungspfad (elastischer Rücksprung mit Steigung E)',
            data: sigUnloading,
            borderColor: '#2563eb',
            borderDash: [5, 4],
            borderWidth: 2.5,
            fill: false,
            pointRadius: 0
          },
          {
            label: 'Vergleich: Elastisch-Idealplastisch (ohne Verfestigung)',
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
          label: 'Spannung σ (MPa)',
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
          <Activity className="text-shiraz" /> Materialmodelle &amp; Rheologie
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Materialmodelle (Stoffgesetze) beschreiben den mathematischen Zusammenhang zwischen Spannung und Dehnung (bzw. Kraft und Verformung) eines Baustoffs.
            Sie sind die zwingende Grundlage für reale statisch-konstruktive Nachweise und nichtlineare Finite-Elemente-Berechnungen (FEM).
          </p>
        </div>

        {/* Tab-Navigation für die Grundmodelle */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-2 relative">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'linear' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('linear')}>
            <TrendingUp size={16} /> Linear-Elastisch
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'non-linear' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('non-linear')}>
            <Activity size={16} /> Nichtlinear
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'ideal-plastic' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('ideal-plastic')}>
            <GitCommit size={16} /> Elastisch-Idealplastisch
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'elasto-plastic' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('elasto-plastic')}>
            <GitCommit size={16} /> Elasto-Plastisch mit Verfestigung
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'visco-elastic' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('visco-elastic')}>
            <Timer size={16} /> Rheologisch (Zeitabh.)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'thixotropy-rheopexy' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('thixotropy-rheopexy')}>
            <RotateCw size={16} /> Thixotropie &amp; Rheopexie
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
        
        {/* Linke Spalte: Theorie & Parametersteuerung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">
            {activeModel === 'linear' && 'Linear-Elastisches Materialmodell'}
            {activeModel === 'non-linear' && 'Nichtlinear-Elastisches Modell'}
            {activeModel === 'ideal-plastic' && 'Elastisch-Idealplastisches Modell (ohne Verfestigung)'}
            {activeModel === 'elasto-plastic' && 'Elasto-Plastisch mit Verfestigung (Bilineares Stoffgesetz)'}
            {activeModel === 'visco-elastic' && 'Rheologisches Modell (z.B. Maxwell)'}
            {activeModel === 'thixotropy-rheopexy' && 'Thixotropie & Rheopexie (Zeitabhängige Viskosität)'}
          </h3>
          
          <div className="text-sm text-text-main/80 space-y-4">
            {activeModel === 'linear' && (
              <>
                <p><strong>Hookesches Gesetz:</strong> Spannung und Dehnung sind streng proportional. Es gilt <FormulaText text="\sigma = E \cdot \varepsilon" />.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Keine bleibenden Verformungen nach Entlastung (vollständige Reversibilität).</li>
                  <li>Gilt näherungsweise für viele Baustoffe (Stahl, Glas, Holz parallel zur Faser) bei kleinen Dehnungen.</li>
                  <li>Mathematisch am einfachsten zu handhaben, da es auf lineare Gleichungssysteme führt.</li>
                </ul>
              </>
            )}
            {activeModel === 'non-linear' && (
              <>
                <p><strong>Krümmung des Verlaufs:</strong> Spannung und Dehnung sind nicht proportional, jedoch gibt es keine bleibenden Verformungen (elastisch).</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Der Zusammenhang zwischen Spannung und Dehnung ändert sich kontinuierlich.</li>
                  <li>Typisch für Elastomere. Beton unter Druck zeigt ebenfalls eine gekrümmte Arbeitslinie, jedoch mit bleibenden Anteilen aus Mikrorissbildung – streng genommen also nicht rein elastisch.</li>
                  <li>Rechnerisch für Beton über die Arbeitslinie nach DIN EN 1992-1-1, 3.1.5 (Schnittgrößenermittlung) bzw. das Parabel-Rechteck-Diagramm nach 3.1.7 (Querschnittsbemessung); für Metalle ohne ausgeprägte Streckgrenze über den Ramberg-Osgood-Ansatz.</li>
                </ul>
              </>
            )}
            {activeModel === 'ideal-plastic' && (
              <>
                <p><strong>Fließplateau (ohne Verfestigung):</strong> Nach Erreichen der Fließgrenze (<FormulaText text="f_y" />) nimmt die Dehnung zu, ohne dass sich die Spannung weiter erhöht.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Typisch für klassischen Baustahl (z.B. S235, S355) mit ausgeprägter Streckgrenze.</li>
                  <li>Ermöglicht statische Schnittgrößenumlagerungen in Tragwerken (Fließgelenktheorie / Traglastverfahren nach Eurocode).</li>
                  <li>Nach Entlastung bleiben irreversible plastische Verformungen zurück.</li>
                </ul>
              </>
            )}

            {/* FOKUS: ELASTO-PLASTISCH MIT VERFESTIGUNG */}
            {activeModel === 'elasto-plastic' && (
              <div className="space-y-4">
                <p>
                  <strong>Bilineares Verfestigungsmodell:</strong> Nach Überschreiten der Fließgrenze (<InlineMath math="f_y" />) steigt die Spannung 
                  bei weiterer Dehnung linear entlang des Tangentenmoduls <InlineMath math="E_t" /> (Verfestigungsmodul) an.
                </p>
                
                {/* Werkstoff-Presets */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-text-main/70 uppercase tracking-wide block">Werkstoff-Presets:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => handleSelectEpPreset('b500b')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${epPreset === 'b500b' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'}`}
                    >
                      B500B (Betonstahl)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectEpPreset('s355')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${epPreset === 's355' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'}`}
                    >
                      S355 (Baustahl)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectEpPreset('s235')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${epPreset === 's235' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'}`}
                    >
                      S235 (Weichstahl)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectEpPreset('alu')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${epPreset === 'alu' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'}`}
                    >
                      EN AW-6060 (Alu)
                    </button>
                  </div>
                </div>

                {/* Interaktive Parameter-Slider */}
                <div className="space-y-3 bg-off-white p-4 rounded-xl border border-home-grau/30">
                  <Slider 
                    label={<FormulaText text="Fließgrenze f_y" />} 
                    min={100} 
                    max={700} 
                    step={10} 
                    value={fyVal} 
                    unit="MPa" 
                    onChange={e => { setFyVal(Number(e.target.value)); setEpPreset('custom'); }} 
                  />
                  <Slider 
                    label={<FormulaText text="Elastizitätsmodul E" />} 
                    min={50000} 
                    max={220000} 
                    step={5000} 
                    value={eModVal} 
                    unit="MPa" 
                    onChange={e => { setEModVal(Number(e.target.value)); setEpPreset('custom'); }} 
                  />
                  <Slider 
                    label={<FormulaText text="Verfestigungsmodul E_t (Tangentenmodul)" />} 
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
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Fließdehnung ε_y</span>
                    <span className="font-mono font-bold text-sm text-text-main mt-0.5 block">
                      {formatDeZahl(epAnalytics.epsYPromille, 2)} ‰
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">ε_y = f_y / E</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Höchstspannung σ_max</span>
                    <span className="font-mono font-bold text-sm text-shiraz mt-0.5 block">
                      {formatDeZahl(epAnalytics.peakStress, 1)} MPa
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">bei ε = {formatDeWert(appliedMaxEpsPromille)} ‰</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Spannungsverhältnis σ_max / f_y bei ε_max</span>
                    <span className={`font-mono font-bold text-sm mt-0.5 block ${epAnalytics.kVerhaeltnis >= 1.08 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {formatDeZahl(epAnalytics.kVerhaeltnis, 3)}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">k = f_t/f_y wird bei ε_uk bestimmt (B500B: k ≥ 1,08 bei ε_uk ≥ 5 %)</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Rückfederung Δε_e</span>
                    <span className="font-mono font-bold text-sm text-blue-700 mt-0.5 block">
                      {formatDeZahl(epAnalytics.epsElasticRecoveryPromille, 2)} ‰
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">Δε_e = σ_max / E</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25 col-span-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Bleibende Dehnung ε_p</span>
                    <span className="font-mono font-bold text-sm text-purple-900 mt-0.5 block">
                      {formatDeZahl(epAnalytics.epsPlasticResidualPromille, 2)} ‰
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">ε_p = ε_max - Δε_e (plastische Deformation)</span>
                  </div>
                </div>

                <ul className="list-disc list-inside space-y-1 text-xs text-text-main/70">
                  <li><strong>Entlastungsast:</strong> Bei Lastrücknahme entspannt das Material rein linear-elastisch mit voller elastischer Steifigkeit <InlineMath math="E" /> parallel zur Hookeschen Geraden.</li>
                  <li><strong>Kaltverfestigung:</strong> Durch Aufstau von Kristallbaufehlern (Versetzungen) steigt die Scherspannungsgrenze der Gleitebenen.</li>
                  <li><strong>Duktilität nach EC2:</strong> Hochduktiler Betonstahl B500B garantiert durch seinen Verfestigungsast ein großes Sicherheitsvermögen vor dem spröden Versagen.</li>
                </ul>
              </div>
            )}

            {activeModel === 'visco-elastic' && (
              <>
                <p><strong>Zeitabhängigkeit:</strong> Die Beziehung zwischen Spannung und Dehnung hängt von der Zeit bzw. der Belastungsgeschwindigkeit ab.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Kriechen (Retardation):</strong> Zunahme der Dehnung unter konstanter Spannung. Relevant für Beton, Holz und Kunststoffe.</li>
                  <li><strong>Relaxation:</strong> Abnahme der Spannung unter konstanter Dehnung. Maßgebend bei hochfestem Spannstahl (Vorspannungsverluste).</li>
                  <li>Abgebildet durch Kombinationen von elastischen Federn (Hooke) und viskosen Dämpfern (Newton) – z.B. Maxwell- oder Kelvin-Voigt-Modelle.</li>
                  <li>Das Diagramm zeigt qualitativ eine σ-ε-Kurve bei konstanter Dehnrate: Je schneller belastet wird, desto steiler verläuft sie. Quantitative Verläufe liefert der Rheologie-Simulator unten.</li>
                </ul>
              </>
            )}

            {activeModel === 'thixotropy-rheopexy' && (
              <div className="flex flex-col gap-4">
                <p><strong>Zeitabhängige Fluid-Eigenschaften (Rheologie):</strong> Bei thixotropen und rheopexen Systemen ändert sich die Viskosität unter konstanter mechanischer Beanspruchungsgeschwindigkeit (Scherung) mit der Zeit.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <h4 className="font-bold text-xs text-red-900 mb-1">Thixotropie (Verflüssigung)</h4>
                    <p className="text-[11px] text-red-800 leading-normal">
                      <strong>Prinzip:</strong> Viskositätsabnahme bei konstanter Scherbeanspruchung. Nach Entlastung baut sich das Netzwerk vollständig wieder auf (Gelkonsistenz).
                      <br /><strong>Bedeutung:</strong> Sichert hervorragende Verarbeitbarkeit beim Pumpen, verhindert danach sofort das Abrutschen (Fliesenkleber, Putze, Betone).
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl border-dashed">
                    <h4 className="font-bold text-xs text-blue-900 mb-1">Rheopexie (Verdickung)</h4>
                    <p className="text-[11px] text-blue-800 leading-normal">
                      <strong>Prinzip:</strong> Viskositätserhöhung bei fortwährender mechanischer Scherung über die Zeit.
                      <br /><strong>Vorkommen:</strong> Extrem selten im Bauwesen; vereinzelt bei hochkonzentrierten feinsten mineralischen Bindemittelsuspensionen.
                    </p>
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
              {activeModel === 'thixotropy-rheopexy' ? 'Rheologischer Zeitverlauf (Viskosität η / Zeit t)' : 'Spannungs-Dehnungs-Diagramm σ / ε'}
            </h3>
            {activeModel === 'elasto-plastic' && (
              <span className="text-xs font-mono bg-shiraz/10 text-shiraz border border-shiraz/30 px-2 py-0.5 rounded-full font-bold">
                Bilineare Verfestigung
              </span>
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
                      text: activeModel === 'thixotropy-rheopexy' ? 'Viskosität η (Pa·s)' : 'Spannung σ (MPa)',
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
                      text: activeModel === 'thixotropy-rheopexy' ? 'Scherdauer t (s) bei konstanter Scherrate' : 'Dehnung ε (‰)',
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
        title="Beispiel 1: Bleibende Dehnung eines Betonstahls B500B nach Überlastung"
        zielGleichung="\varepsilon_p = \varepsilon_{max} - \frac{\sigma_{max}}{E}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Bilineares Modell: f_y = 500 MPa, E = 200 000 MPa, Verfestigungsmodul E_t = 2 000 MPa; Stab wird bis ε_max = 20 ‰ gedehnt und entlastet.', formel: 'f_y = 500\\,\\text{MPa},\\; E = 200\\,000\\,\\text{MPa},\\; E_t = 2\\,000\\,\\text{MPa}' },
          { titel: 'Fließdehnung', erklaerung: 'Ende des elastischen Bereichs:', formel: '\\varepsilon_y = \\frac{500}{200\\,000} = 2{,}5\\,\\text{‰}' },
          { titel: 'Höchstspannung', erklaerung: 'Verfestigungsast bis ε_max:', formel: '\\sigma_{max} = 500 + 2\\,000 \\cdot (0{,}020 - 0{,}0025) = 535\\,\\text{MPa}' },
          { titel: 'Entlastung', erklaerung: 'Rückfederung parallel zur Hookeschen Geraden:', formel: '\\varepsilon_p = 20 - \\frac{535}{200\\,000} \\cdot 1\\,000 = 20 - 2{,}68 = 17{,}3\\,\\text{‰}' }
        ]}
        ergebnisHinweis="Fast die gesamte Dehnung bleibt erhalten; die erneute Belastung verläuft elastisch bis 535 MPa (Kaltverfestigung). Das Verhältnis 535/500 = 1,07 bei 20 ‰ zeigt, warum k = f_t/f_y ≥ 1,08 erst bei ε_uk ≥ 5 % nachgewiesen wird."
        normQuelle="DIN EN 1992-1-1, 3.2.7 und Anhang C (Duktilitätsklasse B)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Relaxation (Maxwell) und Bingham-Fließen von Frischbeton"
        zielGleichung="\sigma(t) = \sigma_0 \cdot e^{-t/\tau}"
        schritte={[
          { titel: 'Maxwell-Relaxation', erklaerung: 'Aufgezwungene Dehnung mit σ₀ = 10 MPa, Relaxationszeit τ = η/E = 2 s. Spannung nach t = 3 s:', formel: '\\sigma(3\\,\\text{s}) = 10 \\cdot e^{-3/2} = 2{,}23\\,\\text{MPa}' },
          { titel: 'Halbwertszeit', erklaerung: 'Zeit bis zum Abbau auf 50 %:', formel: 't_{1/2} = \\tau \\cdot \\ln 2 = 2 \\cdot 0{,}693 = 1{,}39\\,\\text{s}' },
          { titel: 'Bingham-Fluid', erklaerung: 'Frischbeton mit τ₀ = 500 Pa und μ_p = 50 Pa·s unter einer Scherspannung von 800 Pa:', formel: '\\dot{\\gamma} = \\frac{800 - 500}{50} = 6\\,\\text{s}^{-1}' },
          { titel: 'Unterhalb der Fließgrenze', erklaerung: 'Bei τ = 400 Pa < τ₀ fließt der Beton nicht:', formel: '\\dot{\\gamma} = 0' }
        ]}
        ergebnisHinweis="Rüttelenergie senkt die wirksame Fließgrenze; selbstverdichtender Beton erreicht durch Fließmittel eine sehr niedrige Fließgrenze (rund 10 bis 50 Pa) und entlüftet allein unter Eigengewicht."
        normQuelle="Rheologische Grundmodelle (Maxwell, Bingham); Begriffe nach DIN 1342"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="materialmodelle" />

      {/* FOOTER MIT FORMELN, WIKIPEDIA, NORMEN & LITERATUR */}
      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 5 Mechanik: Stoffgesetze, Duktilitätskriterium, Rheologie-Ersatzmodelle und Normausgaben geprüft; Wikipedia-Links manuell prüfen; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Hookesches Gesetz', url: 'https://de.wikipedia.org/wiki/Hookesches_Gesetz' },
          { title: 'Rheologie', url: 'https://de.wikipedia.org/wiki/Rheologie' },
          { title: 'Viskoelastizität', url: 'https://de.wikipedia.org/wiki/Viskoelastizit%C3%A4t' },
          { title: 'Fließkurve', url: 'https://de.wikipedia.org/wiki/Flie%C3%9Fkurve' },
          { title: 'Bauschinger-Effekt', url: 'https://de.wikipedia.org/wiki/Bauschinger-Effekt' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1990:2021-10 (Eurocode 0: Grundlagen der Tragwerksplanung)' },
          { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 (Eurocode 2, 3.1.5 / 3.1.7 / 3.2.7 Arbeitslinien); neue Generation DIN EN 1992-1-1:2025-09' },
          { title: 'DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3, 5.4.3 plastische Tragwerksberechnung); neue Generation DIN EN 1993-1-1:2025-04' },
          { title: 'DIN 1342-1 bis -3:2003-11 (Viskosität – Rheologische Begriffe, Newtonsche und nicht-newtonsche Flüssigkeiten; Ausgabestand manuell prüfen)' }
        ]}
        literatur={[
          'Mang, H.; Hofstetter, G.: Festigkeitslehre. 4. Aufl., Berlin: Springer Vieweg 2013',
          'Gross, D., Hauger, W. et al.: Technische Mechanik 4: Hydromechanik, Elemente der Höheren Mechanik (Springer, 2018)',
          'Wriggers, P.: Nichtlineare Finite-Element-Methoden (Springer, 2001)'
        ]}
        formeln={[
          {
            erklaerung: "Hookesches Gesetz (Linear-Elastisch)\n\\sigma: Normalspannung\nE: Elastizitätsmodul\n\\varepsilon: Dehnung",
            formel: "\\sigma = E \\cdot \\varepsilon"
          },
          {
            erklaerung: "Elasto-Plastisch mit bilinearer Verfestigung (Betonstahl-Arbeitslinie nach DIN EN 1992-1-1, Bild 3.8)\nf_y: Fließgrenze\nE_t: Tangentenmodul (Verfestigungsmodul)\n\\varepsilon_y: Fließdehnung (\\varepsilon_y = f_y / E)\n\\varepsilon_p: bleibende plastische Dehnung nach Entlastung (\\varepsilon_p = \\varepsilon - \\sigma / E)",
            formel: "\\sigma(\\varepsilon) = \\begin{cases} E \\cdot \\varepsilon & \\text{für } \\varepsilon \\le \\varepsilon_y \\\\ f_y + E_t \\cdot (\\varepsilon - \\varepsilon_y) & \\text{für } \\varepsilon > \\varepsilon_y \\end{cases}"
          },
          {
            erklaerung: "Verfestigungsverhältnis k (Duktilitätskriterium nach Eurocode 2)\nf_t: Zugfestigkeit bei Höchstlast\nf_y: Streckgrenze des Betonstahls (B500B erfordert k ≥ 1,08 und ε_uk ≥ 5 % nach DIN EN 1992-1-1, Anhang C)",
            formel: "k = \\frac{f_t}{f_y} = 1 + \\frac{E_t}{f_y} \\cdot (\\varepsilon_{uk} - \\varepsilon_y)"
          },
          {
            erklaerung: "Maxwell-Modell (Viskoelastische Relaxation)\nKombination aus Feder und Dämpfer in Reihe.\n\\dot{\\varepsilon}: Dehnrate\n\\eta: Viskosität des Dämpfers\n\\tau = \\eta / E: Relaxationszeit (Abbau auf 1/e = 36,8 %)",
            formel: "\\dot{\\varepsilon} = \\frac{\\dot{\\sigma}}{E} + \\frac{\\sigma}{\\eta} \\implies \\sigma(t) = \\sigma_0 \\cdot e^{-t / \\tau}"
          },
          {
            erklaerung: "Kelvin-Voigt-Modell (Verzögerte Elastizität / Retardation / Kriechen)\nFeder und Dämpfer parallel geschaltet.\n\\tau = \\eta / E: Retardationszeit",
            formel: "\\sigma = E \\cdot \\varepsilon + \\eta \\cdot \\dot{\\varepsilon} \\implies \\varepsilon(t) = \\frac{\\sigma_0}{E} \\cdot \\left(1 - e^{-t / \\tau}\\right)"
          },
          {
            erklaerung: "Bingham-Modell (Viskoplastisches Fluid für Frischbeton und Mörtel)\n\\tau_0: Fließgrenze (Haftspannung)\n\\mu_p: plastische Viskosität\n\\dot{\\gamma}: Scherrate",
            formel: "\\tau = \\tau_0 + \\mu_p \\cdot \\dot{\\gamma} \\quad \\text{für } |\\tau| > \\tau_0"
          },
          {
            erklaerung: "Dissipationsarbeit / Hysteresefläche pro Zyklus\nW_{diss}: mechanische Dissipationsenergie (in kJ/m³ bzw. N/mm²)\n\\sigma: Spannung, \\varepsilon: Dehnung",
            formel: "W_{\\text{diss}} = \\oint \\sigma \\, d\\varepsilon"
          }
        ]}
      />
    </div>
  );
}
