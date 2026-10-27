import { Leaf, TrendingUp } from 'lucide-react';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { BlockMath, InlineMath } from 'react-katex';
import React from 'react';
import inhalt from '@/content/beispielrechnungen/RechnungNachhaltigkeit.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../../components/ui/Auswahlgruppe';

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
        <ReiterLeiste label="Beispielrechnungen Nachhaltigkeit" className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
          <button {...alsReiter(co2SubTab === 'karbonatisierung', 'rechnung-co2', 'karbonatisierung')}
            onClick={() => setCo2SubTab('karbonatisierung')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  co2SubTab === 'karbonatisierung'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
          ><MdText text={inhalt.texte.t1ReKarbonatisierungCo2} /></button>
          <button {...alsReiter(co2SubTab === 'gwp_vergleich', 'rechnung-co2', 'gwp_vergleich')}
            onClick={() => setCo2SubTab('gwp_vergleich')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  co2SubTab === 'gwp_vergleich'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
          ><MdText text={inhalt.texte.t2ÖkobilanzGwpVergleich} /></button>
        </ReiterLeiste>

        {co2SubTab === 'karbonatisierung' && (
          <div {...reiterPanel('rechnung-co2', co2SubTab)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs and explanation */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Leaf className="text-shiraz" size={16} /><MdText text={inhalt.texte.eingabeparameterCo2Absorption} /></h3>

                {/* k-Faktor Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700"><MdText text={inhalt.texte.karbonatisierungsbeiwertK} /></span>
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
                  <span className="text-xxs text-slate-500 block"><MdText text={inhalt.texte.typisch103} /></span>
                </div>

                {/* Nutzungsdauer Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700"><MdText text={inhalt.texte.nutzungsdauerT} /></span>
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
                    <span className="text-slate-700"><MdText text={inhalt.texte.zementgehaltC} /></span>
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
                    <span className="text-slate-700"><MdText text={inhalt.texte.caoAnteilImZement} /></span>
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
                  <span className="text-xxs text-slate-500 block"><MdText text={inhalt.texte.anteilReaktivesCalciumoxidIm} /></span>
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
                  <span className="text-xxs text-slate-500 block"><MdText text={inhalt.texte.prozentsatzDesReaktionsfähigenCao} /></span>
                </div>
              </div>
            </div>

            {/* Step by Step calculation */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.berechnungCo2UptakeBilanz} /></h3>

                <div className="space-y-4 text-xs text-text-main/80 leading-relaxed">
                  <div><MdText text={inhalt.texte.schritt1KarbonatisierungstiefeD} /><p className="mt-1 text-xxs"><MdText text={inhalt.texte.dieTiefenwirkungDerKarbonatisierung} /></p>
                    <BlockMath math={`d_k = k \\cdot \\sqrt{t} = \\color{#A3113E}{${formatDeTeX(kFactor, 1)}} \\cdot \\sqrt{\\color{#A3113E}{${durabilityYears}}} = \\color{#A3113E}{${formatDeTeX(carbonationDepth, 2)}} \\, \\text{mm} = \\color{#A3113E}{${formatDeTeX((carbonationDepth/1000), 4)}} \\, \\text{m}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt2StoffmengenIm} /><p className="mt-1 text-xxs"><MdText text={inhalt.texte.betrachtetWird1M} /></p>
                    <BlockMath math={`m_{\\text{Zement}} = V \\cdot c = \\color{#A3113E}{${formatDeTeX((carbonationDepth/1000), 4)}} \\, \\text{m}^3 \\cdot \\color{#A3113E}{${cementGehalt}} \\, \\text{kg/m}^3 = \\color{#A3113E}{${formatDeTeX(cementMassPerM2, 2)}} \\, \\text{kg}`} />
                    <BlockMath math={`m_{\\text{CaO}} = m_{\\text{Zement}} \\cdot \\text{Anteil} = \\color{#A3113E}{${formatDeTeX(cementMassPerM2, 2)}} \\cdot \\color{#A3113E}{${formatDeTeX((caoAnteil/100), 2)}} = \\color{#A3113E}{${formatDeTeX(caoMassPerM2, 2)}} \\, \\text{kg}`} />
                    <BlockMath math={`m_{\\text{CaO,react}} = m_{\\text{CaO}} \\cdot \\text{Grad} = \\color{#A3113E}{${formatDeTeX(caoMassPerM2, 2)}} \\cdot \\color{#A3113E}{${formatDeTeX((carbGrad/100), 2)}} = \\color{#A3113E}{${formatDeTeX(reactedCaoMassPerM2, 2)}} \\, \\text{kg}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt3Co2Absorption} /><p className="mt-1 text-xxs"><MdText text={inhalt.texte.dieChemischeUmwandlungLautet} /></p>
                    <BlockMath math={`m_{\\text{CO2}} = m_{\\text{CaO,react}} \\cdot 0{,}784 = \\color{#A3113E}{${formatDeTeX(reactedCaoMassPerM2, 2)}} \\cdot 0{,}784 = \\color{#A3113E}{${formatDeTeX(co2UptakePerM2, 2)}} \\, \\text{kg CO}_2 / \\text{m}^2`} />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-green-50 border border-green-150 text-xs text-green-900 leading-relaxed font-normal space-y-2">
                <div className="flex items-center gap-2 font-bold text-green-900">
                  <Leaf className="text-green-600 animate-pulse" size={18} />
                  <span><MdText text={inhalt.texte.co2KlimabilanzSichererKohlenstoffspeiche} /></span>
                </div>
                <p><MdText text={inhalt.texte.durchDieReKarbonatisierung} />{durabilityYears}<MdText text={inhalt.texte.jahreHinwegProM} /><strong>{formatDeZahl(co2UptakePerM2, 2)} kg CO2</strong><MdText text={inhalt.texte.dauerhaftAusDerAtmosphäre} /></p>
                <p className="text-xxs text-green-800 opacity-90"><MdText text={inhalt.texte.hinweisBeiEinerTypischen} /><strong>{formatDeZahl((co2UptakePerM2 * 1000 / 1000), 1)} Tonnen CO2</strong><MdText text={inhalt.texte.diesMildertDenCo2} /></p>
              </div>
            </div>
          </div>
        )}

        {co2SubTab === 'gwp_vergleich' && (
          <div {...reiterPanel('rechnung-co2', co2SubTab)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Leaf className="text-shiraz" size={16} /><MdText text={inhalt.texte.gwpEingabeparameterCemI} /></h3>

              {/* Bauteilvolumen Slider */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700"><MdText text={inhalt.texte.bauteilvolumenV} /></span>
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
                <h4 className="font-bold text-xs text-slate-800"><MdText text={inhalt.texte.rezepturAPortlandzementCem} /></h4>
                {/* c_A Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-normal">
                    <span className="text-slate-600"><MdText text={inhalt.texte.zementgehaltCA} /></span>
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
                    <span className="text-slate-600"><MdText text={inhalt.texte.spezifischerGwpAKlinkerreich} /></span>
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
                <h4 className="font-bold text-xs text-shiraz"><MdText text={inhalt.texte.rezepturBHochofenzementCem} /></h4>
                {/* c_B Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-normal">
                    <span className="text-slate-600"><MdText text={inhalt.texte.zementgehaltCB} /></span>
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
                    <span className="text-slate-600"><MdText text={inhalt.texte.spezifischerGwpBHüttensandreich} /></span>
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
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.vergleichsrechnungGwpTreibhauspotenzial} /></h3>

                <div className="space-y-4 text-xs text-text-main/80 leading-relaxed">
                  <div><MdText text={inhalt.texte.berechnungRezepturACem} /><BlockMath math={`M_{c,A} = \\frac{${bauteilVol} \\, \\text{m}^3 \\cdot ${cementGehaltA} \\, \\text{kg/m}^3}{1000} = \\color{#A3113E}{${formatDeTeX(totalCementA, 1)}} \\, \\text{t Zement}`} />
                    <BlockMath math={`GWP_A = \\frac{${formatDeTeX(totalCementA, 1)} \\, \\text{t} \\cdot ${gwpZementA} \\, \\text{kg CO}_2\\text{-eq/t}}{1000} = \\color{#A3113E}{${formatDeTeX(totalGwpA, 2)}} \\, \\text{t CO}_2\\text{-eq}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.berechnungRezepturBCem} /><BlockMath math={`M_{c,B} = \\frac{${bauteilVol} \\, \\text{m}^3 \\cdot ${cementGehaltB} \\, \\text{kg/m}^3}{1000} = \\color{#A3113E}{${formatDeTeX(totalCementB, 1)}} \\, \\text{t Zement}`} />
                    <BlockMath math={`GWP_B = \\frac{${formatDeTeX(totalCementB, 1)} \\, \\text{t} \\cdot ${gwpZementB} \\, \\text{kg CO}_2\\text{-eq/t}}{1000} = \\color{#A3113E}{${formatDeTeX(totalGwpB, 2)}} \\, \\text{t CO}_2\\text{-eq}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.ergebnisGwpEinsparung} /><BlockMath math={`\\Delta GWP = GWP_A - GWP_B = ${formatDeTeX(totalGwpA, 2)} - ${formatDeTeX(totalGwpB, 2)} = \\color{#A3113E}{${formatDeTeX(deltaGwp, 2)}} \\, \\text{t CO}_2\\text{-eq}`} />
                    <BlockMath math={`\\text{Prozentuale Einsparung} = \\color{#A3113E}{${formatDeTeX(percentSavings, 1)}\\%}`} />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-150 text-xs text-blue-900 leading-relaxed font-normal space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <TrendingUp size={18} />
                  <span><MdText text={inhalt.texte.betontechnologischeUnterschiedeBeratung} /></span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-xxs">
                  <li><MdText text={inhalt.texte.hydratationswärmeCemIiiB} /></li>
                  <li><MdText text={inhalt.texte.nachbehandlungWegenDerLangsameren} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
