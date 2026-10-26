// Ausgelagert aus src/modules/Baustoffkenngroessen.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { BlockMath, InlineMath } from 'react-katex';
import inhalt from '@/content/baustoffkenngroessen/ThermischTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';

export interface ThermischTabProps {
  alphaT: number;
  deltaT: number;
  handleThermischPresetChange: (preset: 'holz' | 'porenbeton' | 'ziegel' | 'beton' | 'stahl' | 'eps' | 'custom') => void;
  laenge: number;
  lambda: number;
  lambdaDicke: number;
  setAlphaT: React.Dispatch<React.SetStateAction<number>>;
  setDeltaT: React.Dispatch<React.SetStateAction<number>>;
  setLaenge: React.Dispatch<React.SetStateAction<number>>;
  setLambda: React.Dispatch<React.SetStateAction<number>>;
  setLambdaDicke: React.Dispatch<React.SetStateAction<number>>;
  setSpezKapazitaetC: React.Dispatch<React.SetStateAction<number>>;
  setSpezKapazitaetDeltaT: React.Dispatch<React.SetStateAction<number>>;
  setSpezKapazitaetMasse: React.Dispatch<React.SetStateAction<number>>;
  setThermischC: React.Dispatch<React.SetStateAction<number>>;
  setThermischLambda: React.Dispatch<React.SetStateAction<number>>;
  setThermischRho: React.Dispatch<React.SetStateAction<number>>;
  spezKapazitaetC: number;
  spezKapazitaetDeltaT: number;
  spezKapazitaetMasse: number;
  thermischC: number;
  thermischLambda: number;
  thermischPreset: 'holz' | 'beton' | 'stahl' | 'custom' | 'ziegel' | 'porenbeton' | 'eps';
  thermischRho: number;
  waermedehnung: number;
}

export default function ThermischTab({ alphaT, deltaT, handleThermischPresetChange, laenge, lambda, lambdaDicke, setAlphaT, setDeltaT, setLaenge, setLambda, setLambdaDicke, setSpezKapazitaetC, setSpezKapazitaetDeltaT, setSpezKapazitaetMasse, setThermischC, setThermischLambda, setThermischRho, spezKapazitaetC, spezKapazitaetDeltaT, spezKapazitaetMasse, thermischC, thermischLambda, thermischPreset, thermischRho, waermedehnung }: ThermischTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-fade-in">
      {/* Card 1: Wärmeleitfähigkeit (lambda) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="p-1 bg-amber-50 text-amber-600 rounded-md text-xs">λ</span><MdText text={inhalt.texte.wärmeleitfähigkeitLambdaWert} /></h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p><MdText text={inhalt.texte.derLambdaWertGibt} /></p>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
            <BlockMath math="R = \frac{d}{\lambda}" />
            <p className="text-[10px] text-slate-500 mt-2 font-mono"><MdText text={inhalt.texte.rWärmedurchlasswiderstandMK} /></p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
            <span className="font-bold text-indigo-950 block mb-0.5"><MdText text={inhalt.texte.einfacheBeispielrechnung} /></span><MdText text={inhalt.texte.eineZellulosedämmungHatEine} /><div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]"><MdText text={inhalt.texte.r014M} /></div>
          </div>

          <div className="space-y-4">
            <Slider label={inhalt.werte.bauteildickeD} min={0.01} max={0.50} step={0.01} value={lambdaDicke} unit="m" onChange={(e) => setLambdaDicke(Number(e.target.value))} />
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <label><MdText text={inhalt.texte.wärmeleitfähigkeit} /></label>
                <span className="text-indigo-600">{formatDeZahl(lambda, 3)} W / (m · K)</span>
              </div>
              <input 
                type="range" 
                min="0.020" 
                max="3.000" 
                step="0.005" 
                value={lambda} 
                onChange={(e) => setLambda(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="flex gap-1.5 flex-wrap mt-1">
                <button onClick={() => setLambda(0.035)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700"><MdText text={inhalt.texte.dämmungEps0035} /></button>
                <button onClick={() => setLambda(0.13)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700"><MdText text={inhalt.texte.holz013} /></button>
                <button onClick={() => setLambda(0.70)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700"><MdText text={inhalt.texte.mauerwerk070} /></button>
                <button onClick={() => setLambda(2.0)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700"><MdText text={inhalt.texte.normalbeton20} /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {(() => {
            const rCalc = lambdaDicke / lambda;
            const uCalc = 1 / (0.13 + rCalc + 0.04); // R_si = 0.13, R_se = 0.04 fur Aussenwand
            return (
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Wärmedurchlasswiderstand <span className="font-semibold">R</span>:</span>
                  <strong className="text-slate-800">{formatDeZahl(rCalc, 2)} m²K/W</strong>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span><MdText text={inhalt.texte.geschätzterUWertEinschichtige} /></span>
                  <strong className="text-indigo-600 font-bold">{formatDeZahl(uCalc, 2)} W/(m²K)</strong>
                </div>
              </div>
            );
          })()}

          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600">
            <p><MdText text={inhalt.texte.zugelassenesPrüfverfahrenSchutzplattenVe} /></p>
            <p><MdText text={inhalt.texte.rechtlicherBezugNachweisDes} /></p>
          </div>
        </div>
      </div>

      {/* Card 2: Spezifische Wärmekapazität (c) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="p-1 bg-rose-50 text-shiraz rounded-md text-xs">c</span><MdText text={inhalt.texte.spezifischeWärmekapazität} /></h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p><MdText text={inhalt.texte.dieSpezifischeWärmekapazitätBeschreibt} /></p>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
            <BlockMath math="Q = m \cdot c \cdot \Delta T" />
            <p className="text-[10px] text-slate-500 mt-2 font-mono"><MdText text={inhalt.texte.qZugeführteWärmemengeKj} /></p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
            <span className="font-bold text-indigo-950 block mb-0.5"><MdText text={inhalt.texte.einfacheBeispielrechnung2} /></span><MdText text={inhalt.texte.eineHolzweichfaserwandMitMasse} /><div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]"><MdText text={inhalt.texte.q500Kg2} /></div>
          </div>

          <div className="space-y-4">
            <Slider label={inhalt.werte.bauteilmasseM} min={10} max={10000} step={20} value={spezKapazitaetMasse} unit="kg" onChange={(e) => setSpezKapazitaetMasse(Number(e.target.value))} />
            <Slider label={inhalt.werte.temperaturerwärmungT} min={1} max={100} step={1} value={spezKapazitaetDeltaT} unit="K" onChange={(e) => setSpezKapazitaetDeltaT(Number(e.target.value))} />
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <label><MdText text={inhalt.texte.spezifischeWärmekapazitätC} /></label>
                <span className="text-indigo-600">{spezKapazitaetC.toLocaleString('de-DE')}<MdText text={inhalt.texte.jKgK} /></span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="2500" 
                step="50" 
                value={spezKapazitaetC} 
                onChange={(e) => setSpezKapazitaetC(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="flex gap-1.5 flex-wrap mt-1">
                <button onClick={() => setSpezKapazitaetC(480)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700"><MdText text={inhalt.texte.stahlC480} /></button>
                <button onClick={() => setSpezKapazitaetC(1000)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700"><MdText text={inhalt.texte.betonZiegelC1000} /></button>
                <button onClick={() => setSpezKapazitaetC(1600)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700"><MdText text={inhalt.texte.holzC1600} /></button>
                <button onClick={() => setSpezKapazitaetC(2100)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700"><MdText text={inhalt.texte.strohDämmungC2100} /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {(() => {
            const energyKJ = (spezKapazitaetMasse * (spezKapazitaetC / 1000) * spezKapazitaetDeltaT);
            const energyWh = energyKJ / 3.6; // 1 Wh = 3.6 kJ
            return (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs space-y-1 text-center font-sans">
                <div className="font-bold"><MdText text={inhalt.texte.gespeicherteWärmeenergieQ} /></div>
                <div className="text-xl font-black">{energyKJ.toLocaleString('de-DE', { maximumFractionDigits: 1 })} kJ <span className="text-xs font-normal">({formatDeZahl((energyWh / 1000), 2)} kWh)</span></div>
              </div>
            );
          })()}

          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600">
            <p><MdText text={inhalt.texte.zugelassenesPrüfverfahrenDynamischeDiffe} /></p>
            <p><MdText text={inhalt.texte.praxisrelevanzBauteileMitHoher} /></p>
          </div>
        </div>
      </div>

      {/* Card 3: Wärmedehnung */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="p-1 bg-blue-50 text-blue-600 rounded-md text-xs">Δl</span><MdText text={inhalt.texte.thermischeLängenausdehnung} /></h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p><MdText text={inhalt.texte.baustoffeVerändernIhrGeometrisches} /></p>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
            <BlockMath math="\Delta l = \alpha_T \cdot l_0 \cdot \Delta T" />
            <p className="text-[10px] text-slate-500 mt-2 font-mono"><MdText text={inhalt.texte.deltaLLängenänderungMm} />{-5}<MdText text={inhalt.texte.t1KL0} /></p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
            <span className="font-bold text-indigo-950 block mb-0.5"><MdText text={inhalt.texte.einfacheBeispielrechnung3} /></span><MdText text={inhalt.texte.einStählernerTrägerL} /><div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]"><MdText text={inhalt.texte.l1210} /></div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider"><MdText text={inhalt.texte.werkstoffAusdehnungskoeffizientT} /></label>
              <select aria-label={inhalt.werte.werkstoffAusdehnungskoeffizientT} 
                className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz text-xs font-semibold"
                value={alphaT}
                onChange={(e) => setAlphaT(Number(e.target.value))}
              >
                <option value={1.2}>Stahl (1,2 × 10⁻⁵ 1/K)</option>
                <option value={1.0}>Normalbeton (1,0 × 10⁻⁵ 1/K)</option>
                <option value={2.4}>Aluminium (2,4 × 10⁻⁵ 1/K)</option>
                <option value={0.5}>Holz parallel (0,5 × 10⁻⁵ 1/K)</option>
                <option value={0.9}>Kalknatronscheibenglas (0,9 × 10⁻⁵ 1/K)</option>
                <option value={0.1}>Invar-Legierung FeNi36 (ca. 0,1 × 10⁻⁵ 1/K)</option>
              </select>
            </div>

            <Slider label={inhalt.werte.ursprungslängeL} min={1} max={100} step={1} value={laenge} unit="m" onChange={(e) => setLaenge(Number(e.target.value))} />
            <Slider label={inhalt.werte.temperaturänderungT} min={-40} max={120} step={5} value={deltaT} unit="K" onChange={(e) => setDeltaT(Number(e.target.value))} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="p-3 bg-shiraz/10 rounded-lg text-shiraz font-bold text-center text-sm"><MdText text={inhalt.texte.resultierendeLängenänderungL} />{formatDeZahl(waermedehnung, 3)} mm
          </div>

          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600">
            <p><MdText text={inhalt.texte.normverfahrenDilatometerMessungIm} /></p>
            <p><MdText text={inhalt.texte.wichtigeBaupraxisErmöglichtDie} /></p>
          </div>
        </div>
      </div>

      {/* Card 4: Thermische Dynamik (Wärmeeindringkoeffizient & Temperaturleitfähigkeit) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="p-1 bg-amber-50 text-amber-600 rounded-md text-xs">d</span><MdText text={inhalt.texte.thermischeInstationärDynamik} /></h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p><MdText text={inhalt.texte.dasInstationäreWärmeverhaltenBeschreibt} /></p>

          {/* Presets and Custom Mode Slider Block */}
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 mb-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider"><MdText text={inhalt.texte.dynamischesMaterialpreset} /></span>
              <select aria-label={inhalt.werte.dynamischesMaterialpreset} 
                value={thermischPreset}
                onChange={(e) => handleThermischPresetChange(e.target.value as "ziegel" | "porenbeton" | "stahl" | "holz" | "eps" | "beton" | "custom")}
                className="p-1.5 border border-home-grau/30 rounded bg-white text-xs font-bold focus:outline-none focus:border-shiraz"
              >
                <option value="ziegel">Hochlochziegel (Mauerstein)</option>
                <option value="beton">Normalbeton (Konstruktiver Kern)</option>
                <option value="holz">Nadelholz (Dielung/Parkett)</option>
                <option value="porenbeton">Porenbeton (Wärmeschutzstein)</option>
                <option value="stahl">Baustahl (Skelettträger)</option>
                <option value="eps">EPS / Styropor (Wärmedämmung)</option>
                <option value="custom">Benutzerdefiniert / Custom Slider</option>
              </select>
            </div>

            {thermischPreset === 'custom' ? (
              <div className="space-y-3 pt-2">
                <Slider label={inhalt.werte.wärmeleitfähigkeit} min={0.01} max={60} step={0.01} value={thermischLambda} unit="W/(m·K)" onChange={(e) => setThermischLambda(Number(e.target.value))} />
                <Slider label={inhalt.werte.rohdichte} min={10} max={8000} step={10} value={thermischRho} unit="kg/m³" onChange={(e) => setThermischRho(Number(e.target.value))} />
                <Slider label={inhalt.werte.spezWärmekapazitätC} min={100} max={2500} step={10} value={thermischC} unit="J/(kg·K)" onChange={(e) => setThermischC(Number(e.target.value))} />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono text-slate-600 pt-1.5">
                <div className="bg-white p-1.5 rounded border border-home-grau/30">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">λ (mK)</span>
                  <strong>{formatDeZahl(thermischLambda, 3)}</strong>
                </div>
                <div className="bg-white p-1.5 rounded border border-home-grau/30">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">ρ (kg/m³)</span>
                  <strong>{formatDeWert(thermischRho)}</strong>
                </div>
                <div className="bg-white p-1.5 rounded border border-home-grau/30">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">c (J/kgK)</span>
                  <strong>{formatDeWert(thermischC)}</strong>
                </div>
              </div>
            )}
          </div>

          {(() => {
            const a_m2_s = thermischLambda / (thermischRho * thermischC);
            const a_mm2_s = a_m2_s * 1e6;
            const b_eff = Math.sqrt(thermischLambda * thermischRho * thermischC);

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {/* Diffusivity Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.temperaturleitfähigkeitA} /></span>
                    <BlockMath math="a = \frac{\lambda}{\rho \cdot c}" />
                    <div className="p-2.5 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal mb-2">
                      <span className="font-bold text-indigo-950 block"><MdText text={inhalt.texte.einfacheBeispielrechnungBeton} /></span>
                      <InlineMath math="\lambda = 2{,}0\,\text{W/(mK)}" />, <InlineMath math="\rho = 2400\,\text{kg/m}^3" />, <InlineMath math="c = 1000\,\text{J/(kgK)}" />.
                      <div className="font-mono mt-0.5 text-slate-800"><MdText text={inhalt.texte.a202400} /></div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed"><MdText text={inhalt.texte.maßFürDieAusbreitungsgeschwindigkeit} /></p>
                  </div>
                  <div className="mt-4 bg-white p-2.5 rounded border border-home-grau/30 text-center font-mono">
                    <strong className="text-md text-slate-800 font-extrabold block">{formatDeZahl(a_mm2_s, 3)} mm²/s</strong>
                    <span className="text-[9px] text-slate-400 block font-bold">(= {formatDeZahl(a_m2_s * 1e7, 2)}<MdText text={inhalt.texte.t10MS} /></span>
                  </div>
                </div>

                {/* Effusivity Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.wärmeeindringkoeffizientB} /></span>
                    <BlockMath math="b = \sqrt{\lambda \cdot \rho \cdot c}" />
                    <div className="p-2.5 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal mb-2">
                      <span className="font-bold text-indigo-950 block"><MdText text={inhalt.texte.einfacheBeispielrechnungFichte} /></span>
                      <InlineMath math="\lambda = 0{,}13\,\text{W/(mK)}" />, <InlineMath math="\rho = 500\,\text{kg/m}^3" />, <InlineMath math="c = 1600\,\text{J/(kgK)}" />.
                      <div className="font-mono mt-0.5 text-slate-800"><MdText text={inhalt.texte.b013500} /></div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed"><MdText text={inhalt.texte.maßFürDasAufheizverhalten} /></p>
                  </div>
                  <div className="mt-4 bg-white p-2.5 rounded border border-home-grau/30 text-center font-mono">
                    <strong className="text-md text-shiraz font-extrabold block">{formatDeZahl(b_eff, 0)} J/(m²·K·s^0,5)</strong>
                    <span className="text-[9px] text-slate-400 block font-bold">Barfußkontakt: {b_eff < 1000 ? inhalt.werte.behaglichWarm : inhalt.werte.kühleffekt}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="mt-4 p-3 bg-amber-50 text-amber-950 rounded-xl text-xs space-y-1.5 border border-amber-200 font-normal leading-relaxed">
          <p><MdText text={inhalt.texte.wohnbehaglichkeitTactileComfort} /></p>
          <p className="text-[11px] text-amber-900 leading-normal"><MdText text={inhalt.texte.nadelholzBesitztEinSehr} /></p>
        </div>
      </div>
      {/* Z12: Rechenweg zur Formel */}
      <div className="lg:col-span-2">
        <FormulaDerivationBox
          title={inhalt.werte.herleitungWärmedurchlasswiderstand}
          zielGleichung="R = \frac{d}{\lambda}"
          normQuelle={inhalt.werte.normR}
          schritte={inhalt.daten["ThermischTab.schritte"]}
          ergebnisHinweis={inhalt.werte.hinweisR}
        />
      </div>
    </div>
  );
}
