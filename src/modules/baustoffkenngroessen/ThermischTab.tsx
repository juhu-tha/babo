// Ausgelagert aus src/modules/Baustoffkenngroessen.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { BlockMath, InlineMath } from 'react-katex';

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
            <span className="p-1 bg-amber-50 text-amber-600 rounded-md text-xs">λ</span> Wärmeleitfähigkeit (Lambda-Wert)
          </h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p>
        Der <InlineMath math="\lambda" />-Wert gibt den Wärmestrom an, der bei einem Temperaturgefälle von 1 K durch 1 m² einer 1 m dicken Werkstoffschicht fließt. Er beschreibt das thermische Dämmvermögen eines Baustoffs.
          </p>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
            <BlockMath math="R = \frac{d}{\lambda}" />
            <p className="text-[10px] text-slate-500 mt-2 font-mono">
              R = Wärmedurchlasswiderstand [m² · K / W] | d = Bauteildicke [m] | \lambda = Wärmeleitfähigkeit [W / (m · K)]
            </p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
            <span className="font-bold text-indigo-950 block mb-0.5">🔢 Einfache Beispielrechnung:</span>
            Eine Zellulosedämmung hat eine Dicke von <InlineMath math="d = 14 \text{ cm} = 0{,}14 \text{ m}" /> und <InlineMath math="\lambda = 0{,}04 \text{ W/(m · K)}" />.
            <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]">
              R = 0,14 m / 0,04 W/(m·K) = 3,50 m&sup2;K/W
            </div>
          </div>

          <div className="space-y-4">
            <Slider label="Bauteildicke (d)" min={0.01} max={0.50} step={0.01} value={lambdaDicke} unit="m" onChange={(e) => setLambdaDicke(Number(e.target.value))} />
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <label>Wärmeleitfähigkeit (λ)</label>
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
                <button onClick={() => setLambda(0.035)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Dämmung/EPS (λ=0,035)</button>
                <button onClick={() => setLambda(0.13)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Holz (λ=0,13)</button>
                <button onClick={() => setLambda(0.70)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Mauerwerk (λ=0,70)</button>
                <button onClick={() => setLambda(2.0)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Normalbeton (λ=2,0)</button>
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
                  <span>Geschätzter U-Wert (einschichtige Außenwand, R_si = 0,13, R_se = 0,04):</span>
                  <strong className="text-indigo-600 font-bold">{formatDeZahl(uCalc, 2)} W/(m²K)</strong>
                </div>
              </div>
            );
          })()}

          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600">
            <p><strong>Zugelassenes Prüfverfahren:</strong> Schutzplatten-Verfahren nach <strong>DIN EN 12667</strong> oder Wärmeflussmesser-Verfahren für Dämmstoffe.</p>
            <p><strong>Rechtlicher Bezug:</strong> Nachweis des baulichen Wärmeschutzes nach Gebäudemodernisierungsgesetz (GModG, bis 07/2026 GEG) und Mindestwärmeschutz nach DIN 4108-2; Bemessungswerte der Wärmeleitfähigkeit nach DIN 4108-4 bzw. DIN EN ISO 10456.</p>
          </div>
        </div>
      </div>

      {/* Card 2: Spezifische Wärmekapazität (c) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="p-1 bg-rose-50 text-shiraz rounded-md text-xs">c</span> Spezifische Wärmekapazität
          </h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p>
        Die spezifische Wärmekapazität beschreibt die thermische Speicherfähigkeit eines Baustoffs. Sie gibt an, wie viel Wärmeenergie benötigt wird, um 1 kg eines Stoffes um 1 K zu erwärmen.
          </p>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
            <BlockMath math="Q = m \cdot c \cdot \Delta T" />
            <p className="text-[10px] text-slate-500 mt-2 font-mono">
              Q = Zugeführte Wärmemenge [kJ] | m = Bauteilmasse [kg] | c = spez. Wärmekapazität [J / (kg · K)] | \Delta T = Temperaturhub [K]
            </p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
            <span className="font-bold text-indigo-950 block mb-0.5">🔢 Einfache Beispielrechnung:</span>
            Eine Holzweichfaserwand mit Masse <InlineMath math="m = 500 \text{ kg}" /> (<InlineMath math="c = 2100 \text{ J/(kg·K)} = 2{,}1 \text{ kJ/(kg·K)}" />) erwärmt sich um <InlineMath math="\Delta T = 10 \text{ K}" />.
            <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]">
              Q = 500 kg · 2,1 kJ/(kg·K) · 10 K = 10.500 kJ (ca. 2,92 kWh)
            </div>
          </div>

          <div className="space-y-4">
            <Slider label="Bauteilmasse (m)" min={10} max={10000} step={20} value={spezKapazitaetMasse} unit="kg" onChange={(e) => setSpezKapazitaetMasse(Number(e.target.value))} />
            <Slider label="Temperaturerwärmung (ΔT)" min={1} max={100} step={1} value={spezKapazitaetDeltaT} unit="K" onChange={(e) => setSpezKapazitaetDeltaT(Number(e.target.value))} />
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <label>Spezifische Wärmekapazität (c)</label>
                <span className="text-indigo-600">{spezKapazitaetC.toLocaleString('de-DE')} J / (kg · K)</span>
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
                <button onClick={() => setSpezKapazitaetC(480)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Stahl (c=480)</button>
                <button onClick={() => setSpezKapazitaetC(1000)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Beton/Ziegel (c=1000)</button>
                <button onClick={() => setSpezKapazitaetC(1600)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Holz (c=1600)</button>
                <button onClick={() => setSpezKapazitaetC(2100)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Stroh/Dämmung (c=2100)</button>
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
                <div className="font-bold">Gespeicherte Wärmeenergie (Q):</div>
                <div className="text-xl font-black">{energyKJ.toLocaleString('de-DE', { maximumFractionDigits: 1 })} kJ <span className="text-xs font-normal">({formatDeZahl((energyWh / 1000), 2)} kWh)</span></div>
              </div>
            );
          })()}

          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600">
            <p><strong>Zugelassenes Prüfverfahren:</strong> Dynamische Differenzkalorimetrie (DSC) nach <strong>DIN EN ISO 11357-4</strong> für präzise Wärmekapazitätsbestimmungen.</p>
            <p><strong>Praxisrelevanz:</strong> Bauteile mit hoher Rohdichte und hohem c-Wert dämpfen sommerliche Temperaturspitzen hervorragend (Phasenverschiebung).</p>
          </div>
        </div>
      </div>

      {/* Card 3: Wärmedehnung */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="p-1 bg-blue-50 text-blue-600 rounded-md text-xs">Δl</span> Thermische Längenausdehnung
          </h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p>
        Baustoffe verändern ihr geometrisches Volumen bei Temperaturänderungen. Der thermische Längenausdehnungskoeffizienten (<InlineMath math="\alpha_T" />) beschreibt diese proportionale Längenänderung.
          </p>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
            <BlockMath math="\Delta l = \alpha_T \cdot l_0 \cdot \Delta T" />
            <p className="text-[10px] text-slate-500 mt-2 font-mono">
              \Delta l = Längenänderung [mm] | \alpha_T = Ausdehnungskoeffizient \cdot 10^{-5} [1/K] | l_0 = Ausgangslänge [m] | \Delta T = Temp.-Differenz [K]
            </p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
            <span className="font-bold text-indigo-950 block mb-0.5">🔢 Einfache Beispielrechnung:</span>
            Ein stählerner Träger (<InlineMath math="l_0 = 20 \text{ m}" />, <InlineMath math="\alpha_T = 1{,}2 \cdot 10^{-5} \text{ 1/K}" />) erfährt eine Erwärmung von <InlineMath math="\Delta T = 30 \text{ K}" />.
            <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]">
              &Delta;l = 1,2 · 10⁻⁵ · 20 m · 30 K = 0,0072 m = 7,20 mm
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Werkstoff-Ausdehnungskoeffizient (α_T)</label>
              <select aria-label="Werkstoff-Ausdehnungskoeffizient (α_T)" 
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

            <Slider label="Ursprungslänge (l₀)" min={1} max={100} step={1} value={laenge} unit="m" onChange={(e) => setLaenge(Number(e.target.value))} />
            <Slider label="Temperaturänderung (ΔT)" min={-40} max={120} step={5} value={deltaT} unit="K" onChange={(e) => setDeltaT(Number(e.target.value))} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="p-3 bg-shiraz/10 rounded-lg text-shiraz font-bold text-center text-sm">
            Resultierende Längenänderung (Δl): {formatDeZahl(waermedehnung, 3)} mm
          </div>

          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600">
            <p><strong>Normverfahren:</strong> Dilatometer-Messung im Temperaturschrank oder Laserinterferometrie nach <strong>DIN 51045</strong>.</p>
            <p><strong>Wichtige Baupraxis:</strong> Ermöglicht die korrekte Einplanung von Dehnungsfugen (Fugenabstände im Fassadenbau oder bei langen Straßenbahnschienen/Brücken).</p>
          </div>
        </div>
      </div>

      {/* Card 4: Thermische Dynamik (Wärmeeindringkoeffizient & Temperaturleitfähigkeit) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="p-1 bg-amber-50 text-amber-600 rounded-md text-xs">d</span> Thermische Instationär-Dynamik
          </h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p>
        Das instationäre Wärmeverhalten beschreibt, wie Baustoffe auf Temperaturänderungen reagieren. Es entscheidet maßgeblich über das Behaglichkeitsgefühl (z.B. barfuß auf Parkett vs. Fliesen) und das sommerliche Aufheizverhalten.
          </p>

          {/* Presets and Custom Mode Slider Block */}
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 mb-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Dynamisches Materialpreset:</span>
              <select aria-label="Dynamisches Materialpreset" 
                value={thermischPreset}
                onChange={(e) => handleThermischPresetChange(e.target.value as any)}
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
                <Slider label="Wärmeleitfähigkeit (λ)" min={0.01} max={60} step={0.01} value={thermischLambda} unit="W/(m·K)" onChange={(e) => setThermischLambda(Number(e.target.value))} />
                <Slider label="Rohdichte (ρ)" min={10} max={8000} step={10} value={thermischRho} unit="kg/m³" onChange={(e) => setThermischRho(Number(e.target.value))} />
                <Slider label="Spez. Wärmekapazität (c)" min={100} max={2500} step={10} value={thermischC} unit="J/(kg·K)" onChange={(e) => setThermischC(Number(e.target.value))} />
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
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Temperaturleitfähigkeit (<InlineMath math="a" />)</span>
                    <BlockMath math="a = \frac{\lambda}{\rho \cdot c}" />
                    <div className="p-2.5 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal mb-2">
                      <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung (Beton):</span>
                      <InlineMath math="\lambda = 2{,}0\,\text{W/(mK)}" />, <InlineMath math="\rho = 2400\,\text{kg/m}^3" />, <InlineMath math="c = 1000\,\text{J/(kgK)}" />.
                      <div className="font-mono mt-0.5 text-slate-800">a = 2,0 / (2400 · 1000) = 8,33 · 10⁻⁷ m²/s (0,833 mm²/s)</div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Maß für die Ausbreitungsgeschwindigkeit einer Wärmeleit-Welle. Hohe Werte bedeuten schnellen Temperaturausgleich.
                    </p>
                  </div>
                  <div className="mt-4 bg-white p-2.5 rounded border border-home-grau/30 text-center font-mono">
                    <strong className="text-md text-slate-800 font-extrabold block">{formatDeZahl(a_mm2_s, 3)} mm²/s</strong>
                    <span className="text-[9px] text-slate-400 block font-bold">(= {formatDeZahl(a_m2_s * 1e7, 2)} · 10⁻⁷ m²/s)</span>
                  </div>
                </div>

                {/* Effusivity Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Wärmeeindringkoeffizient (<InlineMath math="b" />)</span>
                    <BlockMath math="b = \sqrt{\lambda \cdot \rho \cdot c}" />
                    <div className="p-2.5 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal mb-2">
                      <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung (Fichte):</span>
                      <InlineMath math="\lambda = 0{,}13\,\text{W/(mK)}" />, <InlineMath math="\rho = 500\,\text{kg/m}^3" />, <InlineMath math="c = 1600\,\text{J/(kgK)}" />.
                      <div className="font-mono mt-0.5 text-slate-800">b = &radic;(0,13 · 500 · 1600) = 322,5 J/(m&sup2;·K·s^0,5)</div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Maß für das Aufheizverhalten von Oberflächen. Hohe Werte (z.B. Beton, Stahl) entziehen dem menschlichen Körper viel Wärme (Kalte Haptik).
                    </p>
                  </div>
                  <div className="mt-4 bg-white p-2.5 rounded border border-home-grau/30 text-center font-mono">
                    <strong className="text-md text-shiraz font-extrabold block">{formatDeZahl(b_eff, 0)} J/(m²·K·s^0,5)</strong>
                    <span className="text-[9px] text-slate-400 block font-bold">Barfußkontakt: {b_eff < 1000 ? '✓ Behaglich-Warm' : '❌ Kühleffekt'}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="mt-4 p-3 bg-amber-50 text-amber-950 rounded-xl text-xs space-y-1.5 border border-amber-200 font-normal leading-relaxed">
          <p>💡 <strong>Wohnbehaglichkeit ("Tactile Comfort"):</strong></p>
          <p className="text-[11px] text-amber-900 leading-normal">
            Nadelholz besitzt ein sehr geringes <InlineMath math="b \approx 320" />, weshalb Fußbodenparkett dem Fuß kaum Eigenwärme entzieht und barfuß kuschelig warm wirkt. Beton hingegen transportiert mit <InlineMath math="b \approx 2200" /> instantan Wärme ab – Estrich kühlt ungeheizt den Fuß rasch aus.
          </p>
        </div>
      </div>
    </div>
  );
}
