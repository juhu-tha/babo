import { Leaf, TrendingUp } from 'lucide-react';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { BlockMath, InlineMath } from 'react-katex';
import React from 'react';

interface RechnungNachhaltigkeitProps {
  bauteilVol: number;
  caoAnteil: number;
  caoMassPerM2: number;
  carbGrad: number;
  carbonationDepth: number;
  cementGehalt: number;
  cementGehaltA: number;
  cementGehaltB: number;
  cementMassPerM2: number;
  co2SubTab: "karbonatisierung" | "gwp_vergleich";
  co2UptakePerM2: number;
  deltaGwp: number;
  durabilityYears: number;
  gwpZementA: number;
  gwpZementB: number;
  kFactor: number;
  percentSavings: number;
  reactedCaoMassPerM2: number;
  setBauteilVol: React.Dispatch<React.SetStateAction<number>>;
  setCaoAnteil: React.Dispatch<React.SetStateAction<number>>;
  setCarbGrad: React.Dispatch<React.SetStateAction<number>>;
  setCementGehalt: React.Dispatch<React.SetStateAction<number>>;
  setCementGehaltA: React.Dispatch<React.SetStateAction<number>>;
  setCementGehaltB: React.Dispatch<React.SetStateAction<number>>;
  setCo2SubTab: React.Dispatch<React.SetStateAction<"karbonatisierung" | "gwp_vergleich">>;
  setDurabilityYears: React.Dispatch<React.SetStateAction<number>>;
  setGwpZementA: React.Dispatch<React.SetStateAction<number>>;
  setGwpZementB: React.Dispatch<React.SetStateAction<number>>;
  setKFactor: React.Dispatch<React.SetStateAction<number>>;
  totalCementA: number;
  totalCementB: number;
  totalGwpA: number;
  totalGwpB: number;
}

export default function RechnungNachhaltigkeit({ bauteilVol, caoAnteil, caoMassPerM2, carbGrad, carbonationDepth, cementGehalt, cementGehaltA, cementGehaltB, cementMassPerM2, co2SubTab, co2UptakePerM2, deltaGwp, durabilityYears, gwpZementA, gwpZementB, kFactor, percentSavings, reactedCaoMassPerM2, setBauteilVol, setCaoAnteil, setCarbGrad, setCementGehalt, setCementGehaltA, setCementGehaltB, setCo2SubTab, setDurabilityYears, setGwpZementA, setGwpZementB, setKFactor, totalCementA, totalCementB, totalGwpA, totalGwpB }: RechnungNachhaltigkeitProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">
        {/* SUB-TABS */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
          <button aria-pressed={co2SubTab === 'karbonatisierung'}
            onClick={() => setCo2SubTab('karbonatisierung')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  co2SubTab === 'karbonatisierung'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
          >
            1. Re-Karbonatisierung (CO2-Speicherung)
          </button>
          <button aria-pressed={co2SubTab === 'gwp_vergleich'}
            onClick={() => setCo2SubTab('gwp_vergleich')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  co2SubTab === 'gwp_vergleich'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
          >
            2. Ökobilanz: GWP-Vergleich (CEM I vs. CEM III)
          </button>
        </div>

        {co2SubTab === 'karbonatisierung' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs and explanation */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Leaf className="text-shiraz" size={16} /> Eingabeparameter: CO2-Absorption
                </h3>

                {/* k-Faktor Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700">Karbonatisierungsbeiwert k:</span>
                    <span className="text-shiraz">{formatDeZahl(kFactor, 1)} mm/√a</span>
                  </div>
                  <input 
                    type="range" 
                    min="1.0" 
                    max="12.0" 
                    step="0.5" 
                    value={kFactor} 
                    onChange={(e) => setKFactor(parseFloat(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <span className="text-xxs text-slate-500 block">Typisch: 1,0 - 3,0 (Innenbereich/trocken), 4,0 - 8,0 (Außenbereich, bewittert).</span>
                </div>

                {/* Nutzungsdauer Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700">Nutzungsdauer t:</span>
                    <span className="text-shiraz">{durabilityYears} Jahre</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="150" 
                    step="1" 
                    value={durabilityYears} 
                    onChange={(e) => setDurabilityYears(parseInt(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                </div>

                {/* Zementgehalt Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700">Zementgehalt c:</span>
                    <span className="text-shiraz">{formatDeWert(cementGehalt)} kg/m³</span>
                  </div>
                  <input 
                    type="range" 
                    min="150" 
                    max="450" 
                    step="10" 
                    value={cementGehalt} 
                    onChange={(e) => setCementGehalt(parseInt(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                </div>

                {/* CaO-Anteil im Klinker */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700">CaO-Anteil im Zement:</span>
                    <span className="text-shiraz">{formatDeWert(caoAnteil)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="85" 
                    step="5" 
                    value={caoAnteil} 
                    onChange={(e) => setCaoAnteil(parseInt(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <span className="text-xxs text-slate-500 block">Anteil reaktives Calciumoxid im Zementstein (standardmäßig ca. 65%).</span>
                </div>

                {/* Karbonatisierungsgrad */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700">Karbonatisierungsgrad:</span>
                    <span className="text-shiraz">{formatDeWert(carbGrad)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="5" 
                    value={carbGrad} 
                    onChange={(e) => setCarbGrad(parseInt(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <span className="text-xxs text-slate-500 block">Prozentsatz des reaktionsfähigen CaO, der tatsächlich mit CO2 reagiert.</span>
                </div>
              </div>
            </div>

            {/* Step by Step calculation */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                  Berechnung & CO2-Uptake-Bilanz
                </h3>

                <div className="space-y-4 text-xs text-text-main/80 leading-relaxed">
                  <div>
                    <strong>Schritt 1: Karbonatisierungstiefe d_k</strong>
                    <p className="mt-1 text-xxs">
                      Die Tiefenwirkung der Karbonatisierung folgt dem Quadratwurzel-Zeit-Gesetz (Fick'sche Diffusion):
                    </p>
                    <BlockMath math={`d_k = k \\cdot \\sqrt{t} = \\color{#A3113E}{${formatDeTeX(kFactor, 1)}} \\cdot \\sqrt{\\color{#A3113E}{${durabilityYears}}} = \\color{#A3113E}{${formatDeTeX(carbonationDepth, 2)}} \\, \\text{mm} = \\color{#A3113E}{${formatDeTeX((carbonationDepth/1000), 4)}} \\, \\text{m}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <strong>Schritt 2: Stoffmengen im karbonatisierten Volumen</strong>
                    <p className="mt-1 text-xxs">
                      Betrachtet wird 1 m² Wandfläche. Das betroffene Volumen beträgt <InlineMath math="V = 1{,}0 \, \text{m}^2 \times d_k" />.
                    </p>
                    <BlockMath math={`m_{\\text{Zement}} = V \\cdot c = \\color{#A3113E}{${formatDeTeX((carbonationDepth/1000), 4)}} \\, \\text{m}^3 \\cdot \\color{#A3113E}{${cementGehalt}} \\, \\text{kg/m}^3 = \\color{#A3113E}{${formatDeTeX(cementMassPerM2, 2)}} \\, \\text{kg}`} />
                    <BlockMath math={`m_{\\text{CaO}} = m_{\\text{Zement}} \\cdot \\text{Anteil} = \\color{#A3113E}{${formatDeTeX(cementMassPerM2, 2)}} \\cdot \\color{#A3113E}{${formatDeTeX((caoAnteil/100), 2)}} = \\color{#A3113E}{${formatDeTeX(caoMassPerM2, 2)}} \\, \\text{kg}`} />
                    <BlockMath math={`m_{\\text{CaO,react}} = m_{\\text{CaO}} \\cdot \\text{Grad} = \\color{#A3113E}{${formatDeTeX(caoMassPerM2, 2)}} \\cdot \\color{#A3113E}{${formatDeTeX((carbGrad/100), 2)}} = \\color{#A3113E}{${formatDeTeX(reactedCaoMassPerM2, 2)}} \\, \\text{kg}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <strong>Schritt 3: CO2-Absorption (Molares Verhältnis)</strong>
                    <p className="mt-1 text-xxs">
                      Die chemische Umwandlung lautet <InlineMath math="CaO + CO_2 \rightarrow CaCO_3" />. Das Verhältnis der Molmassen beträgt <InlineMath math="44{,}01 / 56{,}08 \approx 0{,}784" />:
                    </p>
                    <BlockMath math={`m_{\\text{CO2}} = m_{\\text{CaO,react}} \\cdot 0{,}784 = \\color{#A3113E}{${formatDeTeX(reactedCaoMassPerM2, 2)}} \\cdot 0{,}784 = \\color{#A3113E}{${formatDeTeX(co2UptakePerM2, 2)}} \\, \\text{kg CO}_2 / \\text{m}^2`} />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-green-50 border border-green-150 text-xs text-green-900 leading-relaxed font-normal space-y-2">
                <div className="flex items-center gap-2 font-bold text-green-900">
                  <Leaf className="text-green-600 animate-pulse" size={18} />
                  <span>CO2-Klimabilanz (Sicherer Kohlenstoffspeicher):</span>
                </div>
                <p>
                  Durch die Re-Karbonatisierung des Zementsteins hat die Betonwand über die {durabilityYears} Jahre hinweg pro m² Bauteilfläche ca. <strong>{formatDeZahl(co2UptakePerM2, 2)} kg CO2</strong> dauerhaft aus der Atmosphäre zurückgebunden.
                </p>
                <p className="text-xxs text-green-800 opacity-90">
                  Hinweis: Bei einer typischen Tragwerk-Sichtfläche von 1.000 m² entspricht dies einer Speichermenge von ca. <strong>{formatDeZahl((co2UptakePerM2 * 1000 / 1000), 1)} Tonnen CO2</strong>. Dies mildert den CO2-Fußabdruck der Herstellung (GWP) nachträglich ab. Jedoch schwächt die Karbonatisierung das alkalische Milieu (Depassivierung des Bewehrungsstahls bei Erreichen der Bewehrungslage!).
                </p>
              </div>
            </div>
          </div>
        )}

        {co2SubTab === 'gwp_vergleich' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Leaf className="text-shiraz" size={16} /> GWP-Eingabeparameter (CEM I vs. CEM III)
              </h3>

              {/* Bauteilvolumen Slider */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">Bauteilvolumen V:</span>
                  <span className="text-shiraz">{formatDeWert(bauteilVol)} m³</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="1500" 
                  step="10" 
                  value={bauteilVol} 
                  onChange={(e) => setBauteilVol(parseInt(e.target.value))}
                  className="w-full accent-shiraz"
                />
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <h4 className="font-bold text-xs text-slate-800">Rezeptur A: Portlandzement (CEM I)</h4>
                {/* c_A Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-normal">
                    <span className="text-slate-600">Zementgehalt c_A:</span>
                    <span className="font-bold">{formatDeWert(cementGehaltA)} kg/m³</span>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="450" 
                    step="5" 
                    value={cementGehaltA} 
                    onChange={(e) => setCementGehaltA(parseInt(e.target.value))}
                    className="w-full accent-slate-600"
                  />
                </div>
                {/* spec GWP A Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-normal">
                    <span className="text-slate-600">Spezifischer GWP_A (klinkerreich):</span>
                    <span className="font-bold">{formatDeWert(gwpZementA)} kg CO2-eq/t</span>
                  </div>
                  <input 
                    type="range" 
                    min="600" 
                    max="1000" 
                    step="10" 
                    value={gwpZementA} 
                    onChange={(e) => setGwpZementA(parseInt(e.target.value))}
                    className="w-full accent-slate-600"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <h4 className="font-bold text-xs text-shiraz">Rezeptur B: Hochofenzement (CEM III/B)</h4>
                {/* c_B Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-normal">
                    <span className="text-slate-600">Zementgehalt c_B:</span>
                    <span className="font-bold text-shiraz">{formatDeWert(cementGehaltB)} kg/m³</span>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="450" 
                    step="5" 
                    value={cementGehaltB} 
                    onChange={(e) => setCementGehaltB(parseInt(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                </div>
                {/* spec GWP B Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-normal">
                    <span className="text-slate-600">Spezifischer GWP_B (hüttensandreich):</span>
                    <span className="font-bold text-shiraz">{formatDeWert(gwpZementB)} kg CO2-eq/t</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="550" 
                    step="10" 
                    value={gwpZementB} 
                    onChange={(e) => setGwpZementB(parseInt(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                  Vergleichsrechnung GWP (Treibhauspotenzial)
                </h3>

                <div className="space-y-4 text-xs text-text-main/80 leading-relaxed">
                  <div>
                    <strong>Berechnung Rezeptur A (CEM I):</strong>
                    <BlockMath math={`M_{c,A} = \\frac{${bauteilVol} \\, \\text{m}^3 \\cdot ${cementGehaltA} \\, \\text{kg/m}^3}{1000} = \\color{#A3113E}{${formatDeTeX(totalCementA, 1)}} \\, \\text{t Zement}`} />
                    <BlockMath math={`GWP_A = \\frac{${formatDeTeX(totalCementA, 1)} \\, \\text{t} \\cdot ${gwpZementA} \\, \\text{kg CO}_2\\text{-eq/t}}{1000} = \\color{#A3113E}{${formatDeTeX(totalGwpA, 2)}} \\, \\text{t CO}_2\\text{-eq}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <strong>Berechnung Rezeptur B (CEM III):</strong>
                    <BlockMath math={`M_{c,B} = \\frac{${bauteilVol} \\, \\text{m}^3 \\cdot ${cementGehaltB} \\, \\text{kg/m}^3}{1000} = \\color{#A3113E}{${formatDeTeX(totalCementB, 1)}} \\, \\text{t Zement}`} />
                    <BlockMath math={`GWP_B = \\frac{${formatDeTeX(totalCementB, 1)} \\, \\text{t} \\cdot ${gwpZementB} \\, \\text{kg CO}_2\\text{-eq/t}}{1000} = \\color{#A3113E}{${formatDeTeX(totalGwpB, 2)}} \\, \\text{t CO}_2\\text{-eq}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <strong>Ergebnis GWP-Einsparung:</strong>
                    <BlockMath math={`\\Delta GWP = GWP_A - GWP_B = ${formatDeTeX(totalGwpA, 2)} - ${formatDeTeX(totalGwpB, 2)} = \\color{#A3113E}{${formatDeTeX(deltaGwp, 2)}} \\, \\text{t CO}_2\\text{-eq}`} />
                    <BlockMath math={`\\text{Prozentuale Einsparung} = \\color{#A3113E}{${formatDeTeX(percentSavings, 1)}\\%}`} />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-150 text-xs text-blue-900 leading-relaxed font-normal space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <TrendingUp size={18} />
                  <span>Betontechnologische Unterschiede & Beratung:</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-xxs">
                  <li><strong>Hydratationswärme:</strong> CEM III/B (Hochofenzement mit hohem Hüttensandgehalt) reagiert durch den geringen Klinkeranteil extrem langsam. Die Hydratationswärme im Brückenwiderlager oder Fundament (massige Bauteile) wird drastisch verringert. Dies verhindert gefährliche Risse durch thermische Eigenspannungen!</li>
                  <li><strong>Nachbehandlung:</strong> Wegen der langsameren Hydratation baut der Beton seine Dichtigkeit in den ersten Tagen viel langsamer auf. Die Nachbehandlungsdauer (Schutz vor Austrocknung, z.B. Besprühen oder Abdecken) muss verdoppelt werden (z.B. von 3 Tagen auf 7 bis 10 Tage), um Gefügeschäden in der Randzone zu vermeiden.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
