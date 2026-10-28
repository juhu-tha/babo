import type { Dispatch, SetStateAction } from 'react';
import { Calculator, ShieldCheck } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import inhalt from '@/content/historischematerialkennwerte/NachweisBestandTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

export interface NachweisBestandTabProps {
  setNachweisMaterial: Dispatch<SetStateAction<"stahl" | "beton" | "mauerwerk">>;
  setSampleMean: Dispatch<SetStateAction<number>>;
  setSampleCov: Dispatch<SetStateAction<number>>;
  nachweisMaterial: "stahl" | "beton" | "mauerwerk";
  failureDuctility: "duktil" | "sproed";
  setFailureDuctility: Dispatch<SetStateAction<"duktil" | "sproed">>;
  measuredGeometry: boolean;
  setMeasuredGeometry: Dispatch<SetStateAction<boolean>>;
  sampleMean: number;
  sampleCov: number;
  targetBeta: number;
  setTargetBeta: Dispatch<SetStateAction<number>>;
  gammaRd: number;
  setGammaRd: Dispatch<SetStateAction<number>>;
  alphaR: number;
  nachweisCalc: { f_k: number; gamma_M_ec: number; f_d_ec: number; gamma_M_dbv: number; f_d_dbv: number; gainDbvPercent: number; f_d_pren: number; gainPrenPercent: number; equivalentGammaPren: number; dbvApplicable: boolean; };
}

export function NachweisBestandTab({ setNachweisMaterial, setSampleMean, setSampleCov, nachweisMaterial, failureDuctility, setFailureDuctility, measuredGeometry, setMeasuredGeometry, sampleMean, sampleCov, targetBeta, setTargetBeta, gammaRd, setGammaRd, alphaR, nachweisCalc }: NachweisBestandTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header info */}
      <div className="text-sm text-slate-700 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 leading-relaxed">
        <h3 className="text-base font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <ShieldCheck className="text-shiraz" size={20} /><MdText text={inhalt.texte.dasParadoxonDesTeilsicherheitskonzepts} /></h3>
        <p className="mb-3"><MdText text={inhalt.texte.dasSemiprobabilistischeSicherheitskonzep} /></p>
        <p><MdText text={inhalt.texte.werdenNeubauBeiwerteUnverändert} /></p>
      </div>
    
      {/* Interactive Bestands-Tragfähigkeitsrechner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-5">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="text-shiraz" size={18} /><MdText text={inhalt.texte.interaktiverTragfähigkeitsUndZuverlässig} /></h4>
            <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.vergleichStarreEurocodeNeubau} /></p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-shiraz/10 text-shiraz border border-shiraz/20"><MdText text={inhalt.texte.en199022026} /></span>
        </div>
    
        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-2"><MdText text={inhalt.texte.t1BaustoffVersagensart} /></span>
            
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1.5">Materialart:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['stahl', 'beton', 'mauerwerk'] as const).map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => {
                      setNachweisMaterial(mat);
                      if (mat === 'stahl') {
                        setSampleMean(260);
                        setSampleCov(0.08);
                      } else if (mat === 'beton') {
                        setSampleMean(24);
                        setSampleCov(0.15);
                      } else {
                        setSampleMean(4.5);
                        setSampleCov(0.22);
                      }
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                            nachweisMaterial === mat
                              ? 'bg-shiraz text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>
    
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1.5">Versagensmechanismus:</label>
              <AuswahlGruppe label="Versagensmechanismus" className="grid grid-cols-2 gap-1.5">
                <button {...alsOption(failureDuctility === 'duktil')}
                  type="button"
                  onClick={() => setFailureDuctility('duktil')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          failureDuctility === 'duktil'
                            ? 'bg-shiraz text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                ><MdText text={inhalt.texte.duktilBiegezug} /></button>
                <button {...alsOption(failureDuctility === 'sproed')}
                  type="button"
                  onClick={() => setFailureDuctility('sproed')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          failureDuctility === 'sproed'
                            ? 'bg-shiraz text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                ><MdText text={inhalt.texte.sprödeQuerkraftKnick} /></button>
              </AuswahlGruppe>
            </div>
    
            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={measuredGeometry}
                  onChange={(e) => setMeasuredGeometry(e.target.checked)}
                  className="rounded text-shiraz focus:ring-shiraz"
                />
                <span><MdText text={inhalt.texte.querschnittsmaßeMillimetergenauAufgemess} /></span>
              </label>
            </div>
          </div>
    
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-2"><MdText text={inhalt.texte.t2StatistischeStichprobendaten} /></span>
    
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span><MdText text={inhalt.texte.mittelwertDerFestigkeitF} /></span>
                <strong className="font-mono text-shiraz">{formatDeZahl(sampleMean, 1)} N/mm²</strong>
              </div>
              <input
                type="range"
                min={nachweisMaterial === 'stahl' ? 180 : (nachweisMaterial === 'beton' ? 8 : 1.5)}
                max={nachweisMaterial === 'stahl' ? 550 : (nachweisMaterial === 'beton' ? 60 : 25)}
                step={nachweisMaterial === 'stahl' ? 5 : (nachweisMaterial === 'beton' ? 1 : 0.5)}
                value={sampleMean}
                onChange={(e) => setSampleMean(parseFloat(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>
    
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span><MdText text={inhalt.texte.variationskoeffizientVF} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl((sampleCov * 100), 1)} %</strong>
              </div>
              <input
                type="range"
                min={0.04}
                max={0.35}
                step={0.01}
                value={sampleCov}
                onChange={(e) => setSampleCov(parseFloat(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block mt-1"><MdText text={inhalt.texte.typischStahl610} /></span>
            </div>
          </div>
    
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-2"><MdText text={inhalt.texte.t3ZuverlässigkeitZielIndex} /></span>
    
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span><MdText text={inhalt.texte.zielZuverlässigkeitBeta} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(targetBeta, 1)}</strong>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                <button
                  type="button"
                  onClick={() => setTargetBeta(3.8)}
                  className={`py-1 px-2 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          targetBeta === 3.8
                            ? 'bg-shiraz text-white border-shiraz'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                ><MdText text={inhalt.texte.t3850A} /></button>
                <button
                  type="button"
                  onClick={() => setTargetBeta(4.7)}
                  className={`py-1 px-2 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          targetBeta === 4.7
                            ? 'bg-shiraz text-white border-shiraz'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                ><MdText text={inhalt.texte.t471A} /></button>
              </div>
              <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.giltFürDieJeweilige} /></span>
            </div>
    
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span><MdText text={inhalt.texte.modellunsicherheitGammaRd} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(gammaRd, 2)}</strong>
              </div>
              <input
                type="range"
                min="1.0"
                max="1.3"
                step="0.05"
                value={gammaRd}
                onChange={(e) => setGammaRd(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
            </div>
    
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span><MdText text={inhalt.texte.sensitivitätsfaktorAlphaR} /></span>
                <strong className="font-mono text-slate-900">{formatDeZahl(alphaR, 2)}</strong>
              </div>
              <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.normierterStandardwertNachEn} /></span>
            </div>
          </div>
        </div>
    
        {/* Comparative Results Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Method 1: Eurocode Classic */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider"><MdText text={inhalt.texte.t1KonventionellerEurocodeNeubau} /></span>
              <strong className="text-xl font-extrabold text-slate-800 block mt-1">
                {formatDeZahl(nachweisCalc.f_d_ec, 2)} N/mm²
              </strong>
              <span className="text-xs text-slate-600 block mt-0.5">
                Bemessungsfestigkeit <InlineMath math="f_d = f_k / \gamma_M" />
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span><MdText text={inhalt.texte.charaktWertFK} /></span>
                <strong className="font-mono">{formatDeZahl(nachweisCalc.f_k, 1)} N/mm²</strong>
              </div>
              <div className="flex justify-between">
                <span><MdText text={inhalt.texte.teilsicherheitGammaM} /></span>
                <strong className="font-mono text-slate-700">{formatDeZahl(nachweisCalc.gamma_M_ec, 2)}</strong>
              </div>
              <span className="text-[10px] text-rose-600 font-semibold block pt-1"><MdText text={inhalt.texte.referenzbasis0Reserve} /></span>
            </div>
          </div>
    
          {/* Method 2: DBV-Merkblatt */}
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider"><MdText text={inhalt.texte.t2DbvMerkblattModifiziert} /></span>
              <strong className="text-xl font-extrabold text-amber-900 block mt-1">
                {formatDeZahl(nachweisCalc.f_d_dbv, 2)} N/mm²
              </strong>
              <span className="text-xs text-amber-800 block mt-0.5"><MdText text={inhalt.texte.modifizierteTeilsicherheitGammaM} /></span>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200 text-xs text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span><MdText text={inhalt.texte.modifizierterBeiwert} /></span>
                <strong className="font-mono text-amber-900">{formatDeZahl(nachweisCalc.gamma_M_dbv, 2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Traglastvorteil:</span>
                <strong className="font-mono text-emerald-700">{nachweisCalc.gainDbvPercent >= 0 ? '+' : ''}{formatDeZahl(nachweisCalc.gainDbvPercent, 1)} %</strong>
              </div>
              <span className="text-[10px] text-amber-900 font-semibold block pt-1">
                {nachweisCalc.dbvApplicable
                  ? inhalt.werte.dbvMerkblattModifizierteTeilsicherheitsb
                  : inhalt.werte.nichtAnwendbarDasDbv}
              </span>
            </div>
          </div>
    
          {/* Method 3: EN 1990-2:2026 (Eurocode 2. Gen) */}
          <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider"><MdText text={inhalt.texte.t3En19902} /></span>
              <strong className="text-xl font-extrabold text-emerald-900 block mt-1">
                {formatDeZahl(nachweisCalc.f_d_pren, 2)} N/mm²
              </strong>
              <span className="text-xs text-emerald-800 block mt-0.5"><MdText text={inhalt.texte.lognormalerBemessungswertMitGamma} /></span>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200 text-xs text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span><MdText text={inhalt.texte.äquivalenteSicherheit} /></span>
                <strong className="font-mono text-emerald-900">{formatDeZahl(nachweisCalc.equivalentGammaPren, 2)}</strong>
              </div>
              <div className="flex justify-between">
                <span><MdText text={inhalt.texte.differenzZumNeubauwert} /></span>
                <strong className={`font-mono text-sm font-extrabold ${nachweisCalc.gainPrenPercent >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {nachweisCalc.gainPrenPercent >= 0 ? '+' : ''}{formatDeZahl(nachweisCalc.gainPrenPercent, 1)} %
                </strong>
              </div>
              <span className="text-[10px] text-emerald-900 font-semibold block pt-1"><MdText text={inhalt.texte.nurMitAusreichenderStichprobe} /></span>
            </div>
          </div>
        </div>
    
        {/* Explanatory Formula Box */}
        <div className="mt-5 p-4 rounded-xl bg-off-white border border-home-grau/30 text-text-main font-mono text-xs">
          <span className="text-slate-600 block text-[10px] uppercase tracking-wider mb-1"><MdText text={inhalt.texte.lognormalerBemessungswertGrundgleichungN} /></span>
          <BlockMath math="f_d = \frac{f_m}{\gamma_{Rd}} \cdot \exp\left(-\alpha_R \cdot \beta \cdot \sigma_{\ln} - 0{,}5 \cdot \sigma_{\ln}^2\right),\quad \sigma_{\ln} = \sqrt{\ln(1 + V_f^2)}" />
          <div className="text-[11px] text-slate-700 font-sans mt-2 leading-relaxed"><MdText text={inhalt.texte.ergebnisInterpretationDurchDen} /><InlineMath math={`V_f = ${formatDeTeX((sampleCov * 100), 1)}\\%`} /><MdText text={inhalt.texte.ergibtSichGegenüberDem} /><strong className="text-emerald-700">{nachweisCalc.gainPrenPercent >= 0 ? '+' : ''}{formatDeZahl(nachweisCalc.gainPrenPercent, 1)} %</strong><MdText text={inhalt.texte.ergibtSichEineReserve} /></div>
        </div>
      </div>
    </div>
  );
}
