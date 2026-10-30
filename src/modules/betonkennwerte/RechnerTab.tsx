// Ausgelagert aus src/modules/Betonkennwerte.tsx (AP 5.2)
import { Sliders, TrendingDown, AlertTriangle, Scale, Compass, GitCommit } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { EC2_CONCRETE_CLASSES, type ConcreteClassData } from './daten';
import { Ec2ParameterSkizze } from './Ec2ParameterSkizze';
import inhalt from '@/content/betonkennwerte/RechnerTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface RechnerTabProps {
  aggregateType: 'quarzit' | 'kalkstein' | 'sandstein' | 'basalt';
  ambientTempT: number;
  festigkeitMitTT: boolean;
  setFestigkeitMitTT: React.Dispatch<React.SetStateAction<boolean>>;
  areaAc: number;
  axialStressSigmaC: number;
  baseConcrete: ConcreteClassData;
  calcResults: { fck: number; fcm: number; fcd: number; tT: number; s: number; betaCcT0: number; fcmT0: number; fckT0: number; betaCcT: number; fcmT: number; fckT: number; fctm: number; fctk005: number; fctk095: number; fctd: number; fctmFl: number; fctSp: number; fctmT: number; alphaE: number; Ecm: number; Ec0: number; EcmT0: number; EcmT: number; Gcm: number; epsC1: number; epsCu1: number; kPlastizitaet: number; epsC2: number; epsCu2: number; exponentN: number; h0: number; kh: number; epsCd0: number; epsCd: number; epsCa: number; epsCs: number; deltaLShrinkMm: number; phi0: number; phiLinear: number; phiFinal: number; isNonlinearCreep: boolean; stressLimitLin: number; stressLimitMax: number; kSigma: number; epsCc: number; deltaLCreepMm: number; EcEff: number; EcEffZwang: number; Ecm2025: number; etaFc2025: number; };
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

export default function RechnerTab({ aggregateType, ambientTempT, festigkeitMitTT, setFestigkeitMitTT, areaAc, axialStressSigmaC, baseConcrete, calcResults, cementClass, curingDaysTs, elementHeightH, elementLengthL, loadingAgeT0, perimeterU, relativeHumidity, selectedClassIdx, setAggregateType, setAmbientTempT, setAreaAc, setAxialStressSigmaC, setCementClass, setCuringDaysTs, setElementHeightH, setElementLengthL, setLoadingAgeT0, setPerimeterU, setRelativeHumidity, setSelectedClassIdx, targetAgeT }: RechnerTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Eingabe-Steuerung Dashboard */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
          <Sliders size={18} className="text-shiraz" /><MdText text={inhalt.texte.t1ParameterDerFormelsammlung} /></h3>

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
              {baseConcrete.fck <= 50 ? inhalt.werte.normalbetonC5060 : baseConcrete.fck > 90 ? inhalt.werte.lehrwertC100115 : inhalt.werte.hochfesterBetonC5060}
            </span>
          </div>

          {/* Zementklasse */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.zementbeiwertSAbschnitt1} /></label>
            <select aria-label={inhalt.werte.zementbeiwertSAbschnitt1} 
              className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-shiraz"
              value={cementClass}
              onChange={(e) => setCementClass(e.target.value as "S" | "N" | "R")}
            >
              <option value="S">Klasse S (s = 0,38 - CEM 32,5 N)</option>
              <option value="N">Klasse N (s = 0,25 - CEM 32,5 R, CEM 42,5 N)</option>
              <option value="R">Klasse R (s = 0,20 - CEM 42,5 R, CEM 52,5 N/R)</option>
            </select>
            <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.steuertCcTSchwindbeiwerte} /></span>
          </div>

          {/* Gesteinskörnung */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.gesteinskörnungEAbschnitt3} /></label>
            <select aria-label={inhalt.werte.gesteinskörnungEAbschnitt3} 
              className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-shiraz"
              value={aggregateType}
              onChange={(e) => setAggregateType(e.target.value as "kalkstein" | "sandstein" | "basalt" | "quarzit")}
            >
              <option value="quarzit">Quarzit (α_E = 1,00 - Regelfall)</option>
              <option value="kalkstein">Kalkstein (α_E = 0,90; -10 %)</option>
              <option value="sandstein">Sandstein (α_E = 0,70; -30 %)</option>
              <option value="basalt">Basalt / dichter Kalkstein (α_E = 1,20; +20 %)</option>
            </select>
            <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.eCm22000} /></span>
          </div>

          {/* Relative Luftfeuchte */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.luftfeuchteRhAbschnitt5} /></label>
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
            <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.innenraum50FeuchtesFreiland} /></span>
          </div>

          {/* Querschnittsfläche Ac */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.querschnittsflächeACM} /></label>
            <input aria-label={inhalt.werte.querschnittsflächeACM} 
              type="number" 
              step="0.05"
              min="0.01"
              max="10.0"
              value={areaAc}
              onChange={(e) => setAreaAc(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
              className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
            />
            <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.betonflächeFürWirksameDicke} /></span>
          </div>

          {/* Trocknender Umfang u */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.umfangUAustrocknungM} /></label>
            <input aria-label={inhalt.werte.umfangUAustrocknungM} 
              type="number" 
              step="0.1"
              min="0.1"
              max="30.0"
              value={perimeterU}
              onChange={(e) => setPerimeterU(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
            />
            <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.h2AcU} /><strong>{formatDeZahl(calcResults.h0, 0)} mm</strong> (kh = {formatDeZahl(calcResults.kh, 2)})
            </span>
          </div>

          {/* Belastungsalter t0, Nachbehandlung ts & Temperatur */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.erstbelastungTNachbehTs} /></label>
            <div className="flex gap-2">
              <input 
                type="number" 
                min="1" 
                max="365"
                value={loadingAgeT0}
                onChange={(e) => setLoadingAgeT0(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-1/2 bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
                title={inhalt.werte.alterBeiErstbelastungT0}
              />
              <input 
                type="number" 
                min="1" 
                max="30"
                value={curingDaysTs}
                onChange={(e) => setCuringDaysTs(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-1/2 bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
                title={inhalt.werte.endeDerNachbehandlungTs}
              />
            </div>
            <span className="text-[10px] text-slate-500">t₀ = {formatDeWert(loadingAgeT0)}<MdText text={inhalt.texte.dLastTs} />{formatDeWert(curingDaysTs)} d (Curing)</span>
          </div>

          {/* Einwirkende Dauerspannung σ_c */}
          <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <label className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.dauerspannungCMpa} /></label>
            <input aria-label={inhalt.werte.dauerspannungCMpa} 
              type="number" 
              step="0.5"
              min="0"
              max="60"
              value={axialStressSigmaC}
              onChange={(e) => setAxialStressSigmaC(Math.max(0, parseFloat(e.target.value) || 0))}
              className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
            />
            <span className={`text-[10px] ${calcResults.isNonlinearCreep ? 'text-amber-800 font-bold' : 'text-slate-500'}`}><MdText text={inhalt.texte.grenzspannungLinear045} />{formatDeZahl(calcResults.stressLimitLin, 1)} MPa
            </span>
          </div>

        </div>

        {/* Zusätzliche Zeile: Bauteilhöhe für Biegezug & Umgebungstemperatur */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-home-grau/15">
          <div className="flex items-center justify-between bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-xs">
            <span className="text-slate-700 font-medium"><MdText text={inhalt.texte.bauteildickeHBiegezugF} /></span>
            <div className="flex items-center gap-1.5">
              <input aria-label={inhalt.werte.bauteildickeHBiegezugF} 
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
            <span className="text-slate-700 font-medium"><MdText text={inhalt.texte.umgebungstemperaturTAnhangB} /></span>
            <div className="flex items-center gap-1.5">
              <input aria-label={inhalt.werte.umgebungstemperaturTAnhangB} 
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

          <label className="flex items-start gap-2 bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-xs cursor-pointer">
            <input type="checkbox" className="mt-0.5 accent-shiraz" checked={festigkeitMitTT} onChange={(e) => setFestigkeitMitTT(e.target.checked)} />
            <span className="text-slate-700"><MdText text={inhalt.texte.wirksamesAlterFestigkeit} />{' '}
              <span className="font-mono">t_T = {formatDeZahl(calcResults.tT, 1)} d</span></span>
          </label>

          <div className="flex items-center justify-between bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-xs">
            <span className="text-slate-700 font-medium"><MdText text={inhalt.texte.bauteillängeLLängenverkürzung} /></span>
            <div className="flex items-center gap-1.5">
              <input aria-label={inhalt.werte.bauteillängeLLängenverkürzung} 
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
          <div className="text-xs text-amber-900 leading-relaxed"><MdText text={inhalt.texte.nachweisNachEc2Abschnitt} /><p className="mt-1"><MdText text={inhalt.texte.dieEinwirkendeDauerdruckspannung} /><InlineMath math={`\\sigma_c = ${formatDeTeX(axialStressSigmaC, 1)}\\text{ MPa}`} /><MdText text={inhalt.texte.liegtÜberDerLinearitätsgrenze} /><InlineMath math={`0{,}45 \\cdot f_{ck}(t_0) = ${formatDeTeX(calcResults.stressLimitLin, 1)}\\text{ MPa}`} /> (mit <InlineMath math={`k_\\sigma = \\sigma_c / f_{ck}(t_0) = ${formatDeTeX(calcResults.kSigma, 2)}`} /><MdText text={inhalt.texte.dieKriechzahlVergrößertSich} /></p>
            <div className="mt-2 font-mono font-bold bg-white/80 p-2 rounded border border-amber-200 inline-block">
              <InlineMath math={`\\varphi_k(t, t_0) = \\varphi(t, t_0) \\cdot \\exp\\left(1{,}5 \\cdot (k_\\sigma - 0{,}45)\\right) = ${formatDeTeX(calcResults.phiLinear, 2)} \\cdot \\exp(${formatDeTeX(1.5 * (calcResults.kSigma - 0.45), 3)}) = ${formatDeTeX(calcResults.phiFinal, 2)}`} />
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
                <Scale size={14} className="text-shiraz" /><MdText text={inhalt.texte.t1Druckfestigkeit} /></span>
              <span className="text-[10px] font-mono bg-shiraz/10 text-shiraz px-1.5 py-0.2 rounded font-bold">
                {baseConcrete.name}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.zylinderFCk28} /></span>
                <strong className="font-mono text-slate-900">{formatDeWert(calcResults.fck)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600">Würfel <InlineMath math="f_{ck,\text{cube}}" />:</span>
                <strong className="font-mono text-slate-900">{formatDeWert(baseConcrete.fckCube)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.mittelwertFCmF} /></span>
                <strong className="font-mono text-slate-900">{formatDeWert(calcResults.fcm)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100 bg-emerald-50/60 px-1 rounded">
                <span className="text-emerald-950 font-bold">Bemessung <InlineMath math="f_{cd} = \frac{\alpha_{cc} f_{ck}}{\gamma_c}" />:</span>
                <strong className="font-mono text-emerald-800">{formatDeZahl(calcResults.fcd, 2)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.festigkeitBeiT0} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fcmT0, 1)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.zylinderBeiT0} /></span>
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
                <GitCommit size={14} className="text-blue-600" /><MdText text={inhalt.texte.t2Zugfestigkeit} /></span>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-bold"><MdText text={inhalt.texte.gl323} /></span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.mittelwertFCtm} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fctm, 2)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.t5FraktilFCtk} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fctk005, 2)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.t95FraktilFCtk} /></span>
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
                <Compass size={14} className="text-indigo-600" /><MdText text={inhalt.texte.t3EModulSteifigkeit} /></span>
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-bold">
                α_E = {formatDeZahl(calcResults.alphaE, 2)}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.sekantenmodulECm28} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.Ecm, 0)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.tangentenmodulEC1} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.Ec0, 0)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.eModulBeiT} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.EcmT0, 0)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.schubmodulGCmNu} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.Gcm, 0)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100 bg-indigo-50/60 px-1 rounded">
                <span className="text-indigo-950 font-bold"><MdText text={inhalt.texte.effKriechmodulEC} /></span>
                <strong className="font-mono text-indigo-900 font-bold">{formatDeZahl(calcResults.EcEff, 0)} MPa</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.zwangRelaxiertRho0} /></span>
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
                <TrendingDown size={14} className="text-rose-600" /><MdText text={inhalt.texte.t4SchwindenKriechen} /></span>
              <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded font-bold">
                Anhang B
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.trocknungsschwindenVarepsilonCd} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.epsCd * 1000, 3)} ‰</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.autogenesSchwindenVarepsilonCa} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.epsCa * 1000, 3)} ‰</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100 bg-rose-50/60 px-1 rounded">
                <span className="text-rose-950 font-bold"><MdText text={inhalt.texte.gesamtschwindenVarepsilonCs} /></span>
                <strong className="font-mono text-rose-800 font-bold">{formatDeZahl(calcResults.epsCs * 1000, 3)} ‰</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.grundkriechzahlVarphi0} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.phi0, 2)}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100 bg-amber-50/60 px-1 rounded">
                <span className="text-amber-950 font-bold"><MdText text={inhalt.texte.kriechzahlVarphiTT} /></span>
                <strong className="font-mono text-amber-900 font-bold">{formatDeZahl(calcResults.phiFinal, 2)}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-600"><MdText text={inhalt.texte.verkürzung} />{formatDeWert(elementLengthL)} m gesamt):</span>
                <strong className="font-mono text-slate-900">ΔL = -{formatDeZahl(calcResults.deltaLShrinkMm + calcResults.deltaLCreepMm, 2)} mm</strong>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500"><MdText text={inhalt.texte.schwindanteil} />{formatDeZahl(calcResults.deltaLShrinkMm, 2)}<MdText text={inhalt.texte.mmKriechanteil} />{formatDeZahl(calcResults.deltaLCreepMm, 2)} mm
          </div>
        </div>

      </div>

      {/* Formel-Herleitungsbox für Schwinden & Kriechen nach EC2 */}
      <FormulaDerivationBox
        title={inhalt.werte.normativeHerleitungSchwindUnd}
        zielGleichung="\varepsilon_{cs}(t, t_s) = \varepsilon_{cd}(t, t_s) + \varepsilon_{ca}(t), \quad \varphi(t, t_0) = \varphi_0 \cdot \beta_c(t, t_0)"
        normQuelle={inhalt.werte.dinEn19921}
        schritte={inhalt.daten["RechnerTab.schritte"]}
      />

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielKennwerteFürC30}
        zielGleichung="f_{cd} = \alpha_{cc} \frac{f_{ck}}{\gamma_c}, \quad f_{ctm} = 0{,}30\, f_{ck}^{2/3}, \quad E_{cm} = 22\,(f_{cm}/10)^{0{,}3}"
        normQuelle={inhalt.werte.dinEn199212}
        schritte={inhalt.daten["RechnerTab.schritte_2"]}
        ergebnisHinweis={inhalt.werte.fCd170}
      />

    </div>
  );
}
