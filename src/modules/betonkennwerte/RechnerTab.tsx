// Ausgelagert aus src/modules/Betonkennwerte.tsx (AP 5.2)
import { Sliders, TrendingDown, AlertTriangle, Scale, Compass, GitCommit } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { EC2_CONCRETE_CLASSES, type ConcreteClassData } from './daten';
import { Ec2ParameterSkizze } from './Ec2ParameterSkizze';

export interface RechnerTabProps {
  aggregateType: 'quarzit' | 'kalkstein' | 'sandstein' | 'basalt';
  ambientTempT: number;
  areaAc: number;
  axialStressSigmaC: number;
  baseConcrete: ConcreteClassData;
  calcResults: { fck: number; fcm: number; fcd: number; s: number; betaCcT0: number; fcmT0: number; fckT0: number; betaCcT: number; fcmT: number; fckT: number; fctm: number; fctk005: number; fctk095: number; fctd: number; fctmFl: number; fctSp: number; fctmT: number; alphaE: number; Ecm: number; Ec0: number; EcmT0: number; EcmT: number; Gcm: number; epsC1: number; epsCu1: number; kPlastizitaet: number; epsC2: number; epsCu2: number; exponentN: number; h0: number; kh: number; epsCd0: number; epsCd: number; epsCa: number; epsCs: number; deltaLShrinkMm: number; phi0: number; phiLinear: number; phiFinal: number; isNonlinearCreep: boolean; stressLimitLin: number; stressLimitMax: number; kSigma: number; epsCc: number; deltaLCreepMm: number; EcEff: number; EcEffZwang: number; Ecm2025: number; etaFc2025: number; };
  cementClass: 'S' | 'N' | 'R';
  curingDaysTs: number;
  elementHeightH: number;
  elementLengthL: number;
  loadingAgeT0: number;
  perimeterU: number;
  relativeHumidity: number;
  selectedClassIdx: number;
  setAggregateType: React.Dispatch<React.SetStateAction<'quarzit' | 'kalkstein' | 'sandstein' | 'basalt'>>;
  setAmbientTempT: React.Dispatch<React.SetStateAction<number>>;
  setAreaAc: React.Dispatch<React.SetStateAction<number>>;
  setAxialStressSigmaC: React.Dispatch<React.SetStateAction<number>>;
  setCementClass: React.Dispatch<React.SetStateAction<'S' | 'N' | 'R'>>;
  setCuringDaysTs: React.Dispatch<React.SetStateAction<number>>;
  setElementHeightH: React.Dispatch<React.SetStateAction<number>>;
  setElementLengthL: React.Dispatch<React.SetStateAction<number>>;
  setLoadingAgeT0: React.Dispatch<React.SetStateAction<number>>;
  setPerimeterU: React.Dispatch<React.SetStateAction<number>>;
  setRelativeHumidity: React.Dispatch<React.SetStateAction<number>>;
  setSelectedClassIdx: React.Dispatch<React.SetStateAction<number>>;
  targetAgeT: number;
}

export default function RechnerTab({ aggregateType, ambientTempT, areaAc, axialStressSigmaC, baseConcrete, calcResults, cementClass, curingDaysTs, elementHeightH, elementLengthL, loadingAgeT0, perimeterU, relativeHumidity, selectedClassIdx, setAggregateType, setAmbientTempT, setAreaAc, setAxialStressSigmaC, setCementClass, setCuringDaysTs, setElementHeightH, setElementLengthL, setLoadingAgeT0, setPerimeterU, setRelativeHumidity, setSelectedClassIdx, targetAgeT }: RechnerTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Eingabe-Steuerung Dashboard */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
          <Sliders size={18} className="text-shiraz" />
          1. Parameter der Formelsammlung einstellen (Abschnitt 1 – 6)
        </h3>

        {/* Interaktive Systemskizze aller Formelsammlungs-Parameter */}
        <Ec2ParameterSkizze
          baseConcrete={baseConcrete}
          calcResults={calcResults}
          cementClass={cementClass}
          aggregateType={aggregateType}
          relativeHumidity={relativeHumidity}
          areaAc={areaAc}
          perimeterU={perimeterU}
          loadingAgeT0={loadingAgeT0}
          curingDaysTs={curingDaysTs}
          targetAgeT={targetAgeT}
          axialStressSigmaC={axialStressSigmaC}
          ambientTempT={ambientTempT}
          elementHeightH={elementHeightH}
          elementLengthL={elementLengthL}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Betonklasse */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700">Betonfestigkeitsklasse</label>
            <select aria-label="Betonfestigkeitsklasse" 
              className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-bold text-shiraz focus:ring-1 focus:ring-shiraz"
              value={selectedClassIdx}
              onChange={(e) => setSelectedClassIdx(Number(e.target.value))}
            >
              {EC2_CONCRETE_CLASSES.map((c, idx) => (
                <option key={c.name} value={idx}>
                  {c.name} (f_ck = {formatDeWert(c.fck)} MPa, Würfel = {formatDeWert(c.fckCube)} MPa)
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-500">
              {baseConcrete.fck <= 50 ? 'Normalbeton (≤ C50/60)' : 'Hochfester Beton (> C50/60)'}
            </span>
          </div>

          {/* Zementklasse */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700">Zementbeiwert s (Abschnitt 1)</label>
            <select aria-label="Zementbeiwert s (Abschnitt 1)" 
              className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-shiraz"
              value={cementClass}
              onChange={(e) => setCementClass(e.target.value as "S" | "N" | "R")}
            >
              <option value="S">Klasse S (s = 0,38 - CEM 32,5 N)</option>
              <option value="N">Klasse N (s = 0,25 - CEM 32,5 R, CEM 42,5 N)</option>
              <option value="R">Klasse R (s = 0,20 - CEM 42,5 R, CEM 52,5 N/R)</option>
            </select>
            <span className="text-[10px] text-slate-500">Steuert β_cc(t), Schwindbeiwerte α_ds1/2 &amp; t_0,eff</span>
          </div>

          {/* Gesteinskörnung */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700">Gesteinskörnung α_E (Abschnitt 3)</label>
            <select aria-label="Gesteinskörnung α_E (Abschnitt 3)" 
              className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-shiraz"
              value={aggregateType}
              onChange={(e) => setAggregateType(e.target.value as "kalkstein" | "sandstein" | "basalt" | "quarzit")}
            >
              <option value="quarzit">Quarzit (α_E = 1,00 - Regelfall)</option>
              <option value="kalkstein">Kalkstein (α_E = 0,90; -10 %)</option>
              <option value="sandstein">Sandstein (α_E = 0,70; -30 %)</option>
              <option value="basalt">Basalt / dichter Kalkstein (α_E = 1,20; +20 %)</option>
            </select>
            <span className="text-[10px] text-slate-500">E_cm = 22.000 · (f_cm/10)^0,3 · α_E [MPa]</span>
          </div>

          {/* Relative Luftfeuchte */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">Luftfeuchte RH (Abschnitt 5 &amp; 6)</label>
              <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(relativeHumidity)} %</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="100" 
              step="5"
              value={relativeHumidity}
              onChange={(e) => setRelativeHumidity(Number(e.target.value))}
              className="w-full accent-shiraz cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Innenraum ~50 %, feuchtes Freiland ~80 %</span>
          </div>

          {/* Querschnittsfläche Ac */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700">Querschnittsfläche A_c [m²]</label>
            <input aria-label="Querschnittsfläche A_c [m²]" 
              type="number" 
              step="0.05"
              min="0.01"
              max="10.0"
              value={areaAc}
              onChange={(e) => setAreaAc(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
              className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
            />
            <span className="text-[10px] text-slate-500">Betonfläche für wirksame Dicke h₀</span>
          </div>

          {/* Trocknender Umfang u */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700">Umfang u (Austrocknung) [m]</label>
            <input aria-label="Umfang u (Austrocknung) [m]" 
              type="number" 
              step="0.1"
              min="0.1"
              max="30.0"
              value={perimeterU}
              onChange={(e) => setPerimeterU(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
            />
            <span className="text-[10px] text-slate-500">
              h₀ = 2·Ac/u = <strong>{formatDeZahl(calcResults.h0, 0)} mm</strong> (kh = {formatDeZahl(calcResults.kh, 2)})
            </span>
          </div>

          {/* Belastungsalter t0, Nachbehandlung ts & Temperatur */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700">Erstbelastung t₀ / Nachbeh. ts [d]</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                min="1" 
                max="365"
                value={loadingAgeT0}
                onChange={(e) => setLoadingAgeT0(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-1/2 bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
                title="Alter bei Erstbelastung t0 in Tagen"
              />
              <input 
                type="number" 
                min="1" 
                max="30"
                value={curingDaysTs}
                onChange={(e) => setCuringDaysTs(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-1/2 bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
                title="Ende der Nachbehandlung ts in Tagen"
              />
            </div>
            <span className="text-[10px] text-slate-500">t₀ = {formatDeWert(loadingAgeT0)} d (Last), ts = {formatDeWert(curingDaysTs)} d (Curing)</span>
          </div>

          {/* Einwirkende Dauerspannung σ_c */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700">Dauerspannung σ_c [MPa]</label>
            <input aria-label="Dauerspannung σ_c [MPa]" 
              type="number" 
              step="0.5"
              min="0"
              max="60"
              value={axialStressSigmaC}
              onChange={(e) => setAxialStressSigmaC(Math.max(0, parseFloat(e.target.value) || 0))}
              className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
            />
            <span className={`text-[10px] ${calcResults.isNonlinearCreep ? 'text-amber-800 font-bold' : 'text-slate-500'}`}>
              Grenzspannung linear: 0,45·fck(t₀) = {formatDeZahl(calcResults.stressLimitLin, 1)} MPa
            </span>
          </div>

        </div>

        {/* Zusätzliche Zeile: Bauteilhöhe für Biegezug & Umgebungstemperatur */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-home-grau/15">
          <div className="flex items-center justify-between bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-xs">
            <span className="text-slate-700 font-medium">Bauteildicke h (Biegezug f_ctm,fl):</span>
            <div className="flex items-center gap-1.5">
              <input aria-label="Bauteildicke h (Biegezug f_ctm,fl)" 
                type="number" 
                min="50" 
                max="3000" 
                step="50" 
                value={elementHeightH} 
                onChange={(e) => setElementHeightH(Math.max(50, parseInt(e.target.value) || 50))}
                className="w-20 bg-white border border-home-grau/40 rounded p-1 text-xs font-mono font-bold text-right"
              />
              <span className="text-slate-500">mm</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-xs">
            <span className="text-slate-700 font-medium">Umgebungstemperatur T (Anhang B.3):</span>
            <div className="flex items-center gap-1.5">
              <input aria-label="Umgebungstemperatur T (Anhang B.3)" 
                type="number" 
                min="-10" 
                max="60" 
                step="1" 
                value={ambientTempT} 
                onChange={(e) => setAmbientTempT(parseInt(e.target.value) || 20)}
                className="w-16 bg-white border border-home-grau/40 rounded p-1 text-xs font-mono font-bold text-right"
              />
              <span className="text-slate-500">°C</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-xs">
            <span className="text-slate-700 font-medium">Bauteillänge L (Längenverkürzung):</span>
            <div className="flex items-center gap-1.5">
              <input aria-label="Bauteillänge L (Längenverkürzung)" 
                type="number" 
                min="1" 
                max="100" 
                step="1" 
                value={elementLengthL} 
                onChange={(e) => setElementLengthL(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-16 bg-white border border-home-grau/40 rounded p-1 text-xs font-mono font-bold text-right"
              />
              <span className="text-slate-500">m</span>
            </div>
          </div>
        </div>

      </div>

      {/* Warnmeldung: Nichtlineares Kriechen nach Gl. 3.7 */}
      {calcResults.isNonlinearCreep && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start gap-3 shadow-xs">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong>Nachweis nach EC2 Abschnitt 3.1.4(4) &amp; Gl. (3.7): Nichtlineares Kriechen aktiv!</strong>
            <p className="mt-1">
              Die einwirkende Dauerdruckspannung <InlineMath math={`\\sigma_c = ${formatDeZahl(axialStressSigmaC, 1)}\\text{ MPa}`} /> liegt über der Linearitätsgrenze von <InlineMath math={`0{,}45 \\cdot f_{ck}(t_0) = ${formatDeZahl(calcResults.stressLimitLin, 1)}\\text{ MPa}`} /> (mit <InlineMath math={`k_\\sigma = \\sigma_c / f_{ck}(t_0) = ${formatDeZahl(calcResults.kSigma, 2)}`} />). Die Kriechzahl vergrößert sich exponentiell:
            </p>
            <div className="mt-2 font-mono font-bold bg-white/80 p-2 rounded border border-amber-200 inline-block">
              <InlineMath math={`\\varphi_k(t, t_0) = \\varphi(t, t_0) \\cdot \\exp\\left(1{,}5 \\cdot (k_\\sigma - 0{,}45)\\right) = ${formatDeZahl(calcResults.phiLinear, 2)} \\cdot \\exp(${formatDeZahl(1.5 * (calcResults.kSigma - 0.45), 3)}) = ${formatDeZahl(calcResults.phiFinal, 2)}`} />
            </div>
          </div>
        </div>
      )}

      {/* 4 Primäre Ergebnisblöcke der Formelsammlung */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* BLOCK 1: DRUCKFESTIGKEIT (Abschnitt 1) */}
        <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-home-grau/20 mb-2.5">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Scale size={14} className="text-shiraz" /> 1. Druckfestigkeit
              </span>
              <span className="text-[10px] font-mono bg-shiraz/10 text-shiraz px-1.5 py-0.2 rounded font-bold">
                {baseConcrete.name}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Zylinder <InlineMath math="f_{ck}" /> (28 d):</span>
                <strong className="font-mono text-slate-900">{formatDeWert(calcResults.fck)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Würfel <InlineMath math="f_{ck,\text{cube}}" />:</span>
                <strong className="font-mono text-slate-900">{formatDeWert(baseConcrete.fckCube)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Mittelwert <InlineMath math="f_{cm} = f_{ck} + 8" />:</span>
                <strong className="font-mono text-slate-900">{formatDeWert(calcResults.fcm)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100 bg-emerald-50/60 px-1 rounded">
                <span className="text-emerald-950 font-bold">Bemessung <InlineMath math="f_{cd} = \frac{\alpha_{cc} f_{ck}}{\gamma_c}" />:</span>
                <strong className="font-mono text-emerald-800">{formatDeZahl(calcResults.fcd, 2)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Festigkeit bei <InlineMath math="t_0" /> (<InlineMath math="f_{cm}(t_0)" />):</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fcmT0, 1)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Zylinder bei <InlineMath math="t_0" /> (<InlineMath math="f_{ck}(t_0)" />):</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fckT0, 1)} MPa</strong>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            <InlineMath math="\alpha_{cc} = 0{,}85" /> (NA-DE), <InlineMath math="\gamma_c = 1{,}50" />
          </div>
        </div>

        {/* BLOCK 2: ZUGFESTIGKEIT (Abschnitt 2) */}
        <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-home-grau/20 mb-2.5">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <GitCommit size={14} className="text-blue-600" /> 2. Zugfestigkeit
              </span>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-bold">
                Gl. 3.2 – 3.23
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Mittelwert <InlineMath math="f_{ctm}" />:</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fctm, 2)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">5%-Fraktil <InlineMath math="f_{ctk;0{,}05}" />:</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fctk005, 2)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">95%-Fraktil <InlineMath math="f_{ctk;0{,}95}" />:</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fctk095, 2)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100 bg-blue-50/60 px-1 rounded">
                <span className="text-blue-950 font-bold">Bemessung <InlineMath math="f_{ctd}" />:</span>
                <strong className="font-mono text-blue-900">{formatDeZahl(calcResults.fctd, 2)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Biegezug <InlineMath math="f_{ctm,fl}" /> ({formatDeWert(elementHeightH)} mm):</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fctmFl, 2)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Spaltzug <InlineMath math="f_{ct,sp} \approx \frac{f_{ctm}}{0{,}9}" />:</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fctSp, 2)} MPa</strong>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            <InlineMath math="\alpha_{ct} = 0{,}85" /> (NA-DE), <InlineMath math="\gamma_c = 1{,}50" />
          </div>
        </div>

        {/* BLOCK 3: E-MODUL & STEIFIGKEIT (Abschnitt 3) */}
        <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-home-grau/20 mb-2.5">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Compass size={14} className="text-indigo-600" /> 3. E-Modul &amp; Steifigkeit
              </span>
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-bold">
                α_E = {formatDeZahl(calcResults.alphaE, 2)}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Sekantenmodul <InlineMath math="E_{cm}" /> (28 d):</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.Ecm, 0)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Tangentenmodul <InlineMath math="E_c = 1{,}05 E_{cm}" />:</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.Ec0, 0)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">E-Modul bei <InlineMath math="t_0" /> (<InlineMath math="E_{cm}(t_0)" />):</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.EcmT0, 0)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Schubmodul <InlineMath math="G_{cm}" /> (<InlineMath math="\nu = 0{,}2" />):</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.Gcm, 0)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100 bg-indigo-50/60 px-1 rounded">
                <span className="text-indigo-950 font-bold">Eff. Kriechmodul <InlineMath math="E_{c,\text{eff}}" />:</span>
                <strong className="font-mono text-indigo-900 font-bold">{formatDeZahl(calcResults.EcEff, 0)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Zwang-Relaxiert (<InlineMath math="\rho = 0{,}8" />):</span>
                <strong className="font-mono text-indigo-900">{formatDeZahl(calcResults.EcEffZwang, 0)} MPa</strong>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            Wärmedehnung: <InlineMath math="\alpha_T = 10 \cdot 10^{-6}\text{ K}^{-1}" />
          </div>
        </div>

        {/* BLOCK 4: SCHWINDEN & KRIECHEN (Abschnitt 5 & 6) */}
        <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-home-grau/20 mb-2.5">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <TrendingDown size={14} className="text-rose-600" /> 4. Schwinden &amp; Kriechen
              </span>
              <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded font-bold">
                Anhang B
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Trocknungsschwinden <InlineMath math="\varepsilon_{cd}" />:</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.epsCd * 1000, 3)} ‰</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Autogenes Schwinden <InlineMath math="\varepsilon_{ca}" />:</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.epsCa * 1000, 3)} ‰</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100 bg-rose-50/60 px-1 rounded">
                <span className="text-rose-950 font-bold">Gesamtschwinden <InlineMath math="\varepsilon_{cs}" />:</span>
                <strong className="font-mono text-rose-800 font-bold">{formatDeZahl(calcResults.epsCs * 1000, 3)} ‰</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Grundkriechzahl <InlineMath math="\varphi_0" />:</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.phi0, 2)}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100 bg-amber-50/60 px-1 rounded">
                <span className="text-amber-950 font-bold">Kriechzahl <InlineMath math="\varphi(t, t_0)" />:</span>
                <strong className="font-mono text-amber-900 font-bold">{formatDeZahl(calcResults.phiFinal, 2)}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Verkürzung ({formatDeWert(elementLengthL)} m gesamt):</span>
                <strong className="font-mono text-slate-900">ΔL = -{formatDeZahl(calcResults.deltaLShrinkMm + calcResults.deltaLCreepMm, 2)} mm</strong>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            Schwindanteil: -{formatDeZahl(calcResults.deltaLShrinkMm, 2)} mm | Kriechanteil: -{formatDeZahl(calcResults.deltaLCreepMm, 2)} mm
          </div>
        </div>

      </div>

      {/* Formel-Herleitungsbox für Schwinden & Kriechen nach EC2 */}
      <FormulaDerivationBox
        title="Normative Herleitung: Schwind- und Kriechmodell nach EC2 Anhang B"
        zielGleichung="\varepsilon_{cs}(t, t_s) = \varepsilon_{cd}(t, t_s) + \varepsilon_{ca}(t), \quad \varphi(t, t_0) = \varphi_0 \cdot \beta_c(t, t_0)"
        normQuelle="DIN EN 1992-1-1:2011-01 (Abschnitt 3.1.4 & Anhang B)"
        schritte={[
          {
            titel: "1. Trocknungsschwinden und wirksame Bauteildicke",
            formel: "h_0 = \\frac{2 \\cdot A_c}{u}, \\quad \\varepsilon_{cd}(t, t_s) = \\beta_{ds}(t, t_s) \\cdot k_h \\cdot \\varepsilon_{cd,0}",
            erklaerung: "Das Trocknungsschwinden beschreibt den kapillaren Feuchtigkeitsverlust an die Umgebungsatmosphäre. k_h berücksichtigt die Verlangsamung bei größerem Diffusionsweg (h_0)."
          },
          {
            titel: "2. Autogenes Schwinden (Selbstaustrocknung)",
            formel: "\\varepsilon_{ca}(t) = \\beta_{as}(t) \\cdot 2{,}5 \\cdot (f_{ck} - 10) \\cdot 10^{-6}, \\quad \\beta_{as}(t) = 1 - \\exp(-0{,}2 \\cdot t^{0{,}5})",
            erklaerung: "Infolge der chemischen Hydratationskontraktion (Le-Chatelier-Effekt) verzehren C-S-H-Phasen Porenwasser. Bei hochfestem Beton mit geringem w/z-Wert dominiert diese Komponente."
          },
          {
            titel: "3. Kriechzahl und Feuchteeinfluss",
            formel: "\\varphi_0 = \\varphi_{RH} \\cdot \\beta(f_{cm}) \\cdot \\beta(t_0) = \\left[1 + \\frac{1 - RH/100}{0{,}10 \\cdot \\sqrt[3]{h_0}}\\right] \\cdot \\frac{16{,}8}{\\sqrt{f_{cm}}} \\cdot \\frac{1}{0{,}1 + t_{0,\\text{eff}}^{0{,}20}}",
            erklaerung: "Kriechen ist viskoses Gleiten der C-S-H-Schichten unter äußerer Dauerlast. Je jünger der Beton bei Erstbelastung (t_0) und je trockener das Milieu (geringe RH), desto größer ist die Kriechzahl."
          }
        ]}
      />

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Kennwerte für C30/37 aus f_ck"
        zielGleichung="f_{cd} = \alpha_{cc} \frac{f_{ck}}{\gamma_c}, \quad f_{ctm} = 0{,}30\, f_{ck}^{2/3}, \quad E_{cm} = 22\,(f_{cm}/10)^{0{,}3}"
        normQuelle="DIN EN 1992-1-1 mit NA, Tab. 3.1 und Abschn. 3.1.6 (α_cc = 0,85; γ_c = 1,5)"
        schritte={[
          { titel: '1. Bemessungswert der Druckfestigkeit', formel: 'f_{cd} = 0{,}85 \\cdot \\frac{30}{1{,}5} = 17{,}0\\,\\text{N/mm}^2', erklaerung: 'In Deutschland α_cc = 0,85.' },
          { titel: '2. Mittlere Zugfestigkeit', formel: 'f_{ctm} = 0{,}30 \\cdot 30^{2/3} = 0{,}30 \\cdot 9{,}65 = 2{,}9\\,\\text{N/mm}^2', erklaerung: 'Gilt bis C50/60.' },
          { titel: '3. Elastizitätsmodul', formel: 'E_{cm} = 22 \\cdot (38/10)^{0{,}3} = 22 \\cdot 1{,}49 = 32{,}8\\,\\text{GPa}', erklaerung: 'f_cm = f_ck + 8 = 38 N/mm²; Tab. 3.1 rundet auf 33 GPa (Quarzit).' },
        ]}
        ergebnisHinweis="f_cd = 17,0 N/mm², f_ctm = 2,9 N/mm², E_cm ≈ 33 GPa."
      />

    </div>
  );
}
