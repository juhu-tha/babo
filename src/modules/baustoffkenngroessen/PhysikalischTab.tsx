// Ausgelagert aus src/modules/Baustoffkenngroessen.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Scale } from 'lucide-react';
import { Slider } from '@/src/components/ui/Slider';
import { BlockMath, InlineMath } from 'react-katex';

export interface PhysikalischTabProps {
  dichtePresets: { ziegel: { name: string; rhoR: number; rho: number; rhoS: number; desc: string; }; blaehton: { name: string; rhoR: number; rho: number; rhoS: number; desc: string; }; granit: { name: string; rhoR: number; rho: number; rhoS: number; desc: string; }; porenbeton: { name: string; rhoR: number; rho: number; rhoS: number; desc: string; }; };
  handleDichtePresetChange: (preset: 'ziegel' | 'blaehton' | 'granit' | 'porenbeton' | 'custom') => void;
  physRho: number;
  physRhoR: number;
  physRhoS: number;
  selectedDichtePreset: 'custom' | 'ziegel' | 'blaehton' | 'granit' | 'porenbeton';
  setPhysRho: React.Dispatch<React.SetStateAction<number>>;
  setPhysRhoR: React.Dispatch<React.SetStateAction<number>>;
  setPhysRhoS: React.Dispatch<React.SetStateAction<number>>;
}

export default function PhysikalischTab({ dichtePresets, handleDichtePresetChange, physRho, physRhoR, physRhoS, selectedDichtePreset, setPhysRho, setPhysRhoR, setPhysRhoS }: PhysikalischTabProps) {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in" id="physikalisch-tab-container">
      {/* Sektion 1: Dichtearten im Gefügevergleich */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-3 flex items-center gap-2">
          <Scale className="text-shiraz" size={20} /> Gefügeabhängige Dichtebestimmung im Vergleich
        </h3>
        
        <p className="text-xs sm:text-sm text-text-main/80 mt-3 mb-6 leading-relaxed">
          Im Bauwesen ist Dichte nicht gleich Dichte. Je nachdem, ob Hohlräume im Baustoffinneren (Poren) oder Zwickelräume zwischen Baustoffkörnern (Haufwerk) mitgewogen werden, unterscheidet man drei grundlegende Dichtebegriffe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Reindichte */}
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <div className="bg-white p-4 rounded-lg border border-home-grau/30 shadow-inner mb-4 flex justify-center">
                <svg viewBox="0 0 120 120" className="w-24 h-24">
                  <rect x="10" y="10" width="100" height="100" rx="8" fill="#475569" />
                  <g opacity="0.3">
                    <circle cx="25" cy="25" r="4" fill="#ffffff" />
                    <circle cx="45" cy="25" r="4" fill="#ffffff" />
                    <circle cx="65" cy="25" r="4" fill="#ffffff" />
                    <circle cx="85" cy="25" r="4" fill="#ffffff" />
                    <circle cx="25" cy="45" r="4" fill="#ffffff" />
                    <circle cx="45" cy="45" r="4" fill="#ffffff" />
                    <circle cx="65" cy="45" r="4" fill="#ffffff" />
                    <circle cx="85" cy="45" r="4" fill="#ffffff" />
                    <circle cx="25" cy="65" r="4" fill="#ffffff" />
                    <circle cx="45" cy="65" r="4" fill="#ffffff" />
                    <circle cx="65" cy="65" r="4" fill="#ffffff" />
                    <circle cx="85" cy="65" r="4" fill="#ffffff" />
                    <circle cx="25" cy="85" r="4" fill="#ffffff" />
                    <circle cx="45" cy="85" r="4" fill="#ffffff" />
                    <circle cx="65" cy="85" r="4" fill="#ffffff" />
                    <circle cx="85" cy="85" r="4" fill="#ffffff" />
                  </g>
                  <text x="60" y="64" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">100% Feststoff</text>
                </svg>
              </div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">1. Reindichte (<InlineMath math="\rho_R" />)</h4>
              <p className="text-xs text-slate-600 leading-relaxed min-h-[64px]">
                Die Reindichte bezieht sich ausschließlich auf das Netto-Volumen der reinen, absolut porenfreien Festsubstanz. Es wird chemisch-physikalisch durch Zermahlen bestimmt.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-home-grau/30">
              <BlockMath math="\rho_R = \frac{m}{V_{Fest}}" />
              <div className="mt-2 mb-2 p-2 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal">
                <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                Ziegelmehl: <InlineMath math="m = 26{,}5\text{ g}" />, <InlineMath math="V_{Fest} = 10\text{ cm}^3" />.
                <div className="font-mono mt-0.5 text-slate-800">&rho;_R = 26,5 g / 10 cm³ = 2,65 g/cm³ (2650 kg/m³)</div>
              </div>
              <span className="text-[10px] text-slate-400 block text-center mt-1">Prüfverfahren: Helium-Pyknometrie / DIN 51057</span>
            </div>
          </div>

          {/* Card 2: Rohdichte */}
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <div className="bg-white p-4 rounded-lg border border-home-grau/30 shadow-inner mb-4 flex justify-center relative">
                <svg viewBox="0 0 120 120" className="w-24 h-24">
                  <rect x="8" y="8" width="104" height="104" rx="10" fill="transparent" stroke="#94a3b8" strokeDasharray="4,4" strokeWidth="1.5" />
                  <rect x="10" y="10" width="100" height="100" rx="8" fill="#64748b" />
                  <circle cx="35" cy="28" r="7" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                  <circle cx="50" cy="74" r="10" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                  <circle cx="82" cy="35" r="11" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                  <circle cx="85" cy="78" r="6" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                  <circle cx="32" cy="82" r="5" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                  <path d="M 10 50 Q 25 50 25 55 Q 25 60 10 60 Z" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">2. Rohdichte (<InlineMath math="\rho" />)</h4>
              <p className="text-xs text-slate-600 leading-relaxed min-h-[64px]">
                Die Rohdichte (Scherben- bzw. Steinrohdichte) beschreibt das Verhältnis der Masse zum äußeren Hüllvolumen des Festkörpers, also inklusive aller eingebetteten Poren und Risse.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-home-grau/30">
              <BlockMath math="\rho = \frac{m}{V_{H\ddot{u}ll}}" />
              <div className="mt-2 mb-2 p-2 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal">
                <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                Ziegelstein: <InlineMath math="m = 3{,}6\text{ kg}" />, <InlineMath math="V_{Hüll} = 2\text{ dm}^3\ (0{,}002\text{ m}^3)" />.
                <div className="font-mono mt-0.5 text-slate-800">&rho; = 3,6 kg / 0,002 m³ = 1800 kg/m³</div>
              </div>
              <span className="text-[10px] text-slate-400 block text-center mt-1">Prüfverfahren: Wägung und Volumen über Ausmessen oder Unterwasserwägung (z. B. DIN EN 1936, DIN EN 772-13)</span>
            </div>
          </div>

          {/* Card 3: Schüttdichte */}
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <div className="bg-white p-4 rounded-lg border border-home-grau/30 shadow-inner mb-4 flex justify-center">
                <svg viewBox="0 0 120 120" className="w-24 h-24">
                  <path d="M 15 15 L 15 110 L 105 110 L 105 15" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                  <g stroke="#334155" strokeWidth="1" fill="#94a3b8">
                    <circle cx="35" cy="95" r="12" />
                    <circle cx="62" cy="93" r="13" />
                    <circle cx="85" cy="95" r="11" />
                    <circle cx="45" cy="75" r="10" />
                    <circle cx="75" cy="74" r="12" />
                    <circle cx="30" cy="55" r="11" />
                    <circle cx="58" cy="54" r="12" />
                    <circle cx="88" cy="58" r="10" />
                  </g>
                  <g fill="#ffffff" opacity="0.4">
                    <circle cx="35" cy="95" r="1.5" />
                    <circle cx="62" cy="93" r="2" />
                    <circle cx="85" cy="95" r="1.5" />
                    <circle cx="45" cy="75" r="1.5" />
                    <circle cx="75" cy="74" r="2" />
                    <circle cx="58" cy="54" r="1.5" />
                  </g>
                </svg>
              </div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">3. Schüttdichte (<InlineMath math="\rho_S" />)</h4>
              <p className="text-xs text-slate-600 leading-relaxed min-h-[64px]">
                Die Schüttdichte gilt für lose Haufwerke (Sande, Kiese, Körnungen). Das Volumen umfasst hier sowohl das Feststoffvolumen, die Kornporen als auch die weiten Zwickelräume dazwischen.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-home-grau/30">
              <BlockMath math="\rho_S = \frac{m}{V_{Sch\ddot{u}tt}}" />
              <div className="mt-2 mb-2 p-2 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal">
                <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                Splitschüttung: <InlineMath math="m = 11\text{ kg}" />, <InlineMath math="V_{Schütt} = 10\text{ Liter}\ (0{,}01\text{ m}^3)" />.
                <div className="font-mono mt-0.5 text-slate-800">&rho;_S = 11 kg / 0,01 m³ = 1100 kg/m³</div>
              </div>
              <span className="text-[10px] text-slate-400 block text-center mt-1">Prüfverfahren: Messzylindermessung / DIN EN 1097-3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sektion 2: Interaktiver Gefügerechner & Porigkeitssimulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 lg:col-span-1">
          <h3 className="text-md font-bold text-text-main border-b border-home-grau/30 pb-2">Materialkonfiguration</h3>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Werkstoff-Gefügetyp</label>
            <select aria-label="Werkstoff-Gefügetyp" 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz text-xs font-semibold"
              value={selectedDichtePreset}
              onChange={(e) => handleDichtePresetChange(e.target.value as "ziegel" | "granit" | "porenbeton" | "custom" | "blaehton")}
            >
              <option value="ziegel">Ziegelton (Poröse Keramik)</option>
              <option value="blaehton">Blähton (Zellulär hochporös)</option>
              <option value="granit">Granitschotter (Kompaktgestein)</option>
              <option value="porenbeton">Porenbeton (Aufgeschäumtes Mineral)</option>
              <option value="custom">Benutzerdefiniert / Custom</option>
            </select>
          </div>

          {selectedDichtePreset === 'custom' ? (
            <div className="space-y-4 mt-2">
              <Slider 
                label="Reindichte (ρ_R) [Feststoff]" 
                min={1000} 
                max={3500} 
                step={50} 
                value={physRhoR} 
                unit="kg/m³" 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPhysRhoR(val);
                  if (physRho > val) setPhysRho(val);
                  if (physRhoS > val) setPhysRhoS(val);
                }} 
              />
              <Slider 
                label="Rohdichte (ρ) [Korn]" 
                min={200} 
                max={physRhoR} 
                step={20} 
                value={physRho} 
                unit="kg/m³" 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPhysRho(val);
                  if (physRhoS > val) setPhysRhoS(val);
                }} 
              />
              <Slider 
                label="Schüttdichte (ρ_S) [Schüttung]" 
                min={50} 
                max={physRho} 
                step={10} 
                value={physRhoS} 
                unit="kg/m³" 
                onChange={(e) => setPhysRhoS(Number(e.target.value))} 
              />
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/30 text-xs mt-2 self-start flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-700 leading-tight mb-2">Gefügecharakteristik:</h4>
                <p className="text-slate-600 leading-relaxed italic">{dichtePresets[selectedDichtePreset].desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-home-grau/30 text-slate-500 font-mono text-[10px] space-y-1">
                <div>Reindichte: <strong>{formatDeWert(dichtePresets[selectedDichtePreset].rhoR)} kg/m³</strong></div>
                <div>Rohdichte: <strong>{formatDeWert(dichtePresets[selectedDichtePreset].rho)} kg/m³</strong></div>
                <div>Schüttdichte: <strong>{formatDeWert(dichtePresets[selectedDichtePreset].rhoS)} kg/m³</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Panel 2 & 3: Mathematische Auswertung & Porenanteile */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 lg:col-span-2">
          <h3 className="text-md font-bold text-text-main border-b border-home-grau/30 pb-2">Mathematische Gefügeanalyse</h3>
          
          {(() => {
            const activeRhoR = selectedDichtePreset === 'custom' ? physRhoR : dichtePresets[selectedDichtePreset].rhoR;
            const activeRho = selectedDichtePreset === 'custom' ? physRho : dichtePresets[selectedDichtePreset].rho;
            const activeRhoS = selectedDichtePreset === 'custom' ? physRhoS : dichtePresets[selectedDichtePreset].rhoS;
            
            const grainPorosity = (1 - (activeRho / activeRhoR)) * 100;
            const haufwerkPorosity = (1 - (activeRhoS / activeRho)) * 100;
            const totalVoidRatio = (1 - (activeRhoS / activeRhoR)) * 100;

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Kornporosität */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Innere Kornporosität</span>
                      <BlockMath math="P_{Korn} = \left(1 - \frac{\rho}{\rho_R}\right)" />
                      <div className="mt-2 p-2 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal">
                        <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                        Ziegel mit Rohdichte <InlineMath math="\rho = 1800\text{ kg/m}^3" /> und Reindichte <InlineMath math="\rho_R = 2650\text{ kg/m}^3" />.
                        <div className="font-mono mt-0.5 text-slate-800">1 - (1800 / 2650) = 32,1%</div>
                      </div>
                    </div>
                    <div className="text-center mt-3 bg-white p-2 rounded border border-home-grau/30">
                      <strong className="text-lg font-extrabold text-blue-600">{formatDeZahl(grainPorosity, 1)}%</strong>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold mt-0.5">Inneres Porenvolumen</span>
                    </div>
                  </div>

                  {/* Haufwerksporigkeit */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Zwickel-/Haufwerksporigkeit</span>
                      <BlockMath math="P_{Hauf} = \left(1 - \frac{\rho_S}{\rho}\right)" />
                      <div className="mt-2 p-2 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal">
                        <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                        Kiesschüttung mit Schüttdichte <InlineMath math="\rho_S = 1600\text{ kg/m}^3" /> und Kornrohdichte <InlineMath math="\rho = 2650\text{ kg/m}^3" />.
                        <div className="font-mono mt-0.5 text-slate-800">1 - (1600 / 2650) = 39,6%</div>
                      </div>
                    </div>
                    <div className="text-center mt-3 bg-white p-2 rounded border border-home-grau/30">
                      <strong className="text-lg font-extrabold text-indigo-600">{formatDeZahl(haufwerkPorosity, 1)}%</strong>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold mt-0.5">Zwischenkörnungshohlraum</span>
                    </div>
                  </div>

                  {/* Gesamthohlraumgehalt */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Gesamter Hohlraumanteil</span>
                      <BlockMath math="P_{Gesamt} = \left(1 - \frac{\rho_S}{\rho_R}\right)" />
                      <div className="mt-2 p-2 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal">
                        <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                        Ziegelgrus mit Schüttdichte <InlineMath math="\rho_S = 1100\text{ kg/m}^3" /> und Reindichte <InlineMath math="\rho_R = 2650\text{ kg/m}^3" />.
                        <div className="font-mono mt-0.5 text-slate-800">1 - (1100 / 2650) = 58,5%</div>
                      </div>
                    </div>
                    <div className="text-center mt-3 bg-white p-2 rounded border border-home-grau/30">
                      <strong className="text-lg font-extrabold text-shiraz">{formatDeZahl(totalVoidRatio, 1)}%</strong>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold mt-0.5">Hohlraumanteil gesamt</span>
                    </div>
                  </div>
                </div>

                {/* Gefügebalken Visualisierung */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Visuelle Verteilung des Schüttvolumens</h4>
                  <div className="h-8 w-full bg-slate-200 rounded-full overflow-hidden flex font-mono text-[9px] font-bold text-white text-center">
                    <div 
                      className="bg-slate-700 flex items-center justify-center transition-all duration-300"
                      style={{ width: `${(100 - totalVoidRatio)}%` }}
                      title="Reines Feststoffvolumen (Skelett)"
                    >
                      {(100 - totalVoidRatio) > 12 && `Skelett ${formatDeZahl((100 - totalVoidRatio), 1)}%`}
                    </div>
                    <div 
                      className="bg-blue-500 flex items-center justify-center transition-all duration-300"
                      style={{ width: `${((100 - haufwerkPorosity) * (grainPorosity / 100))}%` }}
                      title="Volumen der Kornporen"
                    >
                      {((100 - haufwerkPorosity) * (grainPorosity / 100)) > 12 && `Intraporen`}
                    </div>
                    <div 
                      className="bg-indigo-500 flex items-center justify-center transition-all duration-300"
                      style={{ width: `${haufwerkPorosity}%` }}
                      title="Volumen der Interporen (Haufwerkshohlräume)"
                    >
                      {haufwerkPorosity > 12 && `Haufwerk ${formatDeZahl(haufwerkPorosity, 1)}%`}
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-medium">
                    <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-700 rounded-sm"></span> Rein-Feststoff (Skelett)</div>
                    <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></span> Kornporen (Intra-Poren)</div>
                    <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></span> Haufwerksporen (Zwickelräume)</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
