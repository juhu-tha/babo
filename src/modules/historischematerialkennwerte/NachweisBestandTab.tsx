import type { Dispatch, SetStateAction } from 'react';
import { Calculator, ShieldCheck } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';

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
          <ShieldCheck className="text-shiraz" size={20} />
          Das Paradoxon des Teilsicherheitskonzepts beim Bauen im Bestand
        </h3>
        <p className="mb-3">
          Das semiprobabilistische Sicherheitskonzept der Eurocodes (DIN EN 1990 mit Ziel-Zuverlässigkeitsindex{' '}
          <InlineMath math="\beta = 3{,}8" /> bzw. Versagenswahrscheinlichkeit{' '}
          <InlineMath math="P_f \approx 10^{-4}" />) wurde ausschließlich für <em>Neubauten</em> konzipiert. Hohe Teilsicherheitsbeiwerte ({' '}
          <InlineMath math="\gamma_G = 1{,}35" />, <InlineMath math="\gamma_c = 1{,}50" />, <InlineMath math="\gamma_s = 1{,}15" />) sichern dort Streuungen ab, die beim Bestandsbau durch Messung (Bauaufnahme, Bohrkerne, Wiegung) teilweise reduziert werden können; Modell- und Einwirkungsunsicherheiten bleiben bestehen.
        </p>
        <p>
          Werden Neubau-Beiwerte unverändert auf den Bestand angewendet, bleiben Informationen aus der Bauwerksuntersuchung ungenutzt.
          Das <strong>DBV-Merkblatt „Bauen im Bestand – Modifizierte Teilsicherheitsbeiwerte“</strong> (Beton und Betonstahl) und die{' '}
          <strong>EN 1990-2:2026 („Assessment of existing structures“)</strong> erlauben auf Grundlage gemessener Kennwerte angepasste Teilsicherheitsbeiwerte und das <strong>Bayes&apos;sche Updating</strong>. Ob sich daraus eine Tragreserve ergibt, hängt vom Stichprobenumfang, der Streuung und der Modellunsicherheit ab – der Rechner unten zeigt, dass der Effekt auch negativ sein kann.
        </p>
      </div>
    
      {/* Interactive Bestands-Tragfähigkeitsrechner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-5">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="text-shiraz" size={18} />
              Interaktiver Tragfähigkeits- und Zuverlässigkeitsrechner
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Vergleich: Starre Eurocode-Neubau-Bemessung vs. DBV-Merkblatt vs. probabilistische EN 1990-2:2026-Bemessung
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-shiraz/10 text-shiraz border border-shiraz/20">
            EN 1990-2:2026 &amp; DBV
          </span>
        </div>
    
        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-2">
              1. Baustoff &amp; Versagensart
            </span>
            
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
              <div className="grid grid-cols-2 gap-1.5">
                <button aria-pressed={failureDuctility === 'duktil'}
                  type="button"
                  onClick={() => setFailureDuctility('duktil')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          failureDuctility === 'duktil'
                            ? 'bg-shiraz text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                >
                  Duktil (Biegezug)
                </button>
                <button aria-pressed={failureDuctility === 'sproed'}
                  type="button"
                  onClick={() => setFailureDuctility('sproed')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          failureDuctility === 'sproed'
                            ? 'bg-shiraz text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                >
                  Spröde (Querkraft/Knick)
                </button>
              </div>
            </div>
    
            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={measuredGeometry}
                  onChange={(e) => setMeasuredGeometry(e.target.checked)}
                  className="rounded text-shiraz focus:ring-shiraz"
                />
                <span>Querschnittsmaße millimetergenau aufgemessen</span>
              </label>
            </div>
          </div>
    
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-2">
              2. Statistische Stichprobendaten
            </span>
    
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Mittelwert der Festigkeit (<InlineMath math="f_m" />):</span>
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
                <span>Variationskoeffizient (<InlineMath math="V_f" />):</span>
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
              <span className="text-[10px] text-slate-500 block mt-1">
                Typisch: Stahl 6–10 %, Beton 12–18 %, Mauerwerk 20–30 %
              </span>
            </div>
          </div>
    
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-2">
              3. Zuverlässigkeit &amp; Ziel-Index
            </span>
    
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Ziel-Zuverlässigkeit (<InlineMath math="\beta" />):</span>
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
                >
                  β = 3,8 (50 a)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetBeta(4.7)}
                  className={`py-1 px-2 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          targetBeta === 4.7
                            ? 'bg-shiraz text-white border-shiraz'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                >
                  β = 4,7 (1 a)
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block">
                β gilt für die jeweilige Bezugsdauer (RC2: β₅₀ = 3,8 ≙ β₁ = 4,7). Eine kürzere Restnutzungsdauer senkt β nicht automatisch – Anpassungen nach EN 1990-2:2026 mit Fundstelle begründen.
              </span>
            </div>
    
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Modellunsicherheit (<InlineMath math="\gamma_{Rd}" />):</span>
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
                <span>Sensitivitätsfaktor (<InlineMath math="\alpha_R" />):</span>
                <strong className="font-mono text-slate-900">{formatDeZahl(alphaR, 2)}</strong>
              </div>
              <span className="text-[10px] text-slate-500 block">
                Normierter Standardwert nach EN 1990 Anhang C: <InlineMath math="\alpha_R = 0{,}8" />
              </span>
            </div>
          </div>
        </div>
    
        {/* Comparative Results Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Method 1: Eurocode Classic */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                1. Konventioneller Eurocode (Neubau)
              </span>
              <strong className="text-xl font-extrabold text-slate-800 block mt-1">
                {formatDeZahl(nachweisCalc.f_d_ec, 2)} N/mm²
              </strong>
              <span className="text-xs text-slate-600 block mt-0.5">
                Bemessungsfestigkeit <InlineMath math="f_d = f_k / \gamma_M" />
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Charakt. Wert (<InlineMath math="f_k" />):</span>
                <strong className="font-mono">{formatDeZahl(nachweisCalc.f_k, 1)} N/mm²</strong>
              </div>
              <div className="flex justify-between">
                <span>Teilsicherheit (<InlineMath math="\gamma_M" />):</span>
                <strong className="font-mono text-slate-700">{formatDeZahl(nachweisCalc.gamma_M_ec, 2)}</strong>
              </div>
              <span className="text-[10px] text-rose-600 font-semibold block pt-1">
                Referenzbasis (0 % Reserve)
              </span>
            </div>
          </div>
    
          {/* Method 2: DBV-Merkblatt */}
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                2. DBV-Merkblatt (Modifiziert)
              </span>
              <strong className="text-xl font-extrabold text-amber-900 block mt-1">
                {formatDeZahl(nachweisCalc.f_d_dbv, 2)} N/mm²
              </strong>
              <span className="text-xs text-amber-800 block mt-0.5">
                Modifizierte Teilsicherheit <InlineMath math="\gamma_{M,\text{mod}}" />
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200 text-xs text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span>Modifizierter Beiwert:</span>
                <strong className="font-mono text-amber-900">{formatDeZahl(nachweisCalc.gamma_M_dbv, 2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Traglastvorteil:</span>
                <strong className="font-mono text-emerald-700">{nachweisCalc.gainDbvPercent >= 0 ? '+' : ''}{formatDeZahl(nachweisCalc.gainDbvPercent, 1)} %</strong>
              </div>
              <span className="text-[10px] text-amber-900 font-semibold block pt-1">
                {nachweisCalc.dbvApplicable
                  ? 'DBV-Merkblatt „Modifizierte Teilsicherheitsbeiwerte für Stahlbetonbauteile“'
                  : 'Nicht anwendbar: Das DBV-Merkblatt gilt nur für Beton und Betonstahl.'}
              </span>
            </div>
          </div>
    
          {/* Method 3: EN 1990-2:2026 (Eurocode 2. Gen) */}
          <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                3. EN 1990-2:2026 (versuchsgestützt)
              </span>
              <strong className="text-xl font-extrabold text-emerald-900 block mt-1">
                {formatDeZahl(nachweisCalc.f_d_pren, 2)} N/mm²
              </strong>
              <span className="text-xs text-emerald-800 block mt-0.5">
                Lognormaler Bemessungswert mit <InlineMath math="\gamma_{Rd}" /></span>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200 text-xs text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span>Äquivalente Sicherheit:</span>
                <strong className="font-mono text-emerald-900">{formatDeZahl(nachweisCalc.equivalentGammaPren, 2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Differenz zum Neubauwert:</span>
                <strong className={`font-mono text-sm font-extrabold ${nachweisCalc.gainPrenPercent >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {nachweisCalc.gainPrenPercent >= 0 ? '+' : ''}{formatDeZahl(nachweisCalc.gainPrenPercent, 1)} %
                </strong>
              </div>
              <span className="text-[10px] text-emerald-900 font-semibold block pt-1">
                Nur mit ausreichender Stichprobe und belegtem V
              </span>
            </div>
          </div>
        </div>
    
        {/* Explanatory Formula Box */}
        <div className="mt-5 p-4 rounded-xl bg-slate-900 text-white font-mono text-xs">
          <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">
            Lognormaler Bemessungswert (Grundgleichung nach DIN EN 1990, Anhang C; Anwendung im Bestand nach EN 1990-2:2026):
          </span>
          <BlockMath math="f_d = \frac{f_m}{\gamma_{Rd}} \cdot \exp\left(-\alpha_R \cdot \beta \cdot \sigma_{\ln} - 0{,}5 \cdot \sigma_{\ln}^2\right),\quad \sigma_{\ln} = \sqrt{\ln(1 + V_f^2)}" />
          <div className="text-[11px] text-slate-300 font-sans mt-2 leading-relaxed">
            <strong>Ergebnis-Interpretation:</strong> Durch den Nachweis geringer In-situ-Streuung (<InlineMath math={`V_f = ${formatDeTeX((sampleCov * 100), 1)}\\%`} />) ergibt sich gegenüber dem Neubauwert eine Differenz von{' '}
            <strong className="text-emerald-400">{nachweisCalc.gainPrenPercent >= 0 ? '+' : ''}{formatDeZahl(nachweisCalc.gainPrenPercent, 1)} %</strong>. Ergibt sich eine Reserve, kann eine Verstärkung ggf. entfallen; Voraussetzung sind ausreichende Stichproben und die Berücksichtigung der Modellunsicherheit.
          </div>
        </div>
      </div>
    </div>
  );
}
