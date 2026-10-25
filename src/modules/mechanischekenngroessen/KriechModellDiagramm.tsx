import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { Timer } from 'lucide-react';
import { InlineMath } from 'react-katex';

interface KriechModellDiagrammProps {
  rheoModus: "relaxieren" | "kriechen";
  rheoTauSec: number;
  rheoWert0: number;
}

export default function KriechModellDiagramm({ rheoModus, rheoTauSec, rheoWert0 }: KriechModellDiagrammProps) {
    const W = 520;
    const H = 240;
    const padL = 55;
    const padR = 25;
    const padT = 30;
    const padB = 40;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const maxTime = 10; // 0 bis 10 s
    const tToX = (t: number) => padL + (t / maxTime) * plotW;

    if (rheoModus === 'relaxieren') {
      // RELAXATION: sigma(t)
      // Max Y = rheoWert0 * 1.15
      const maxY = rheoWert0 * 1.15;
      const yToY = (yVal: number) => padT + plotH - (Math.max(0, Math.min(yVal, maxY)) / maxY) * plotH;

      // Maxwell: sig(t) = sig0 * exp(-t / tau)
      let maxwellPts = '';
      // Zener (SLS): sig(t) = sig0 * (0.4 + 0.6 * exp(-t / tau))
      let zenerPts = '';
      // Kelvin-Voigt: sig(t) = sig0 = konst. (kann nicht relaxieren)
      let kelvinPts = '';
      // Hooke: sig(t) = sig0 = konst.
      let hookePts = '';

      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * maxTime;
        const x = tToX(t);

        const sMax = rheoWert0 * Math.exp(-t / rheoTauSec);
        const sZen = rheoWert0 * (0.4 + 0.6 * Math.exp(-t / rheoTauSec));
        const sKel = rheoWert0;
        const sHoo = rheoWert0;

        maxwellPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(sMax).toFixed(1)} `;
        zenerPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(sZen).toFixed(1)} `;
        kelvinPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(sKel).toFixed(1)} `;
        hookePts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(sHoo).toFixed(1)} `;
      }

      const sigEndMaxwell = rheoWert0 * Math.exp(-maxTime / rheoTauSec);
      const sigEndZener = rheoWert0 * (0.4 + 0.6 * Math.exp(-maxTime / rheoTauSec));
      const relaxRateMaxwell = ((rheoWert0 - sigEndMaxwell) / rheoWert0) * 100;
      const halfLife = rheoTauSec * Math.LN2;

      return (
        <div className="space-y-4">
          {/* Diagram Container */}
          <div className="relative bg-white rounded-2xl border border-home-grau/30 shadow-sm p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                Spannungsverlauf σ(t) bei vorgegebener Dehnung ε(t) = ε₀ = konst.
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Halbwertszeit t½ = {formatDeZahl(halfLife, 2)} s
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-h-[260px] select-none font-mono">
                {/* Explicit White Background */}
                <rect width={W} height={H} fill="#ffffff" rx="12" />

                {/* Coordinate Grid */}
                {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                  const yVal = frac * rheoWert0;
                  const yPos = yToY(yVal);
                  return (
                    <g key={idx}>
                      <line x1={padL} y1={yPos} x2={W - padR} y2={yPos} stroke="#f1f5f9" strokeWidth="1" />
                      <text x={padL - 6} y={yPos + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                        {formatDeZahl(yVal, 1)}
                      </text>
                    </g>
                  );
                })}

                {[0, 2, 4, 6, 8, 10].map((tVal) => {
                  const xPos = tToX(tVal);
                  return (
                    <g key={tVal}>
                      <line x1={xPos} y1={padT} x2={xPos} y2={padT + plotH} stroke="#f1f5f9" strokeWidth="1" />
                      <text x={xPos} y={H - padB + 18} textAnchor="middle" fontSize="10" fill="#334155" fontWeight="bold">
                        {formatDeWert(tVal)} s
                      </text>
                    </g>
                  );
                })}

                {/* Coordinate Axes */}
                <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#334155" strokeWidth="1.5" />
                <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth="1.5" />
                <text x={W - padR} y={padT + plotH - 8} textAnchor="end" fontSize="11" fill="#0f172a" fontWeight="bold">Zeit t (s)</text>
                <text x={padL + 6} y={padT + 12} fontSize="11" fill="#0f172a" fontWeight="bold">Spannung σ (MPa)</text>

                {/* 1. Hooke (schwarz gepunktet) */}
                <path d={hookePts} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* 2. Kelvin-Voigt (grün gestrichelt, keine Relaxation) */}
                <path d={kelvinPts} fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="6 3" />

                {/* 3. Zener (SLS / violett) */}
                <path d={zenerPts} fill="none" stroke="#9333ea" strokeWidth="2.5" />

                {/* 4. Maxwell (blau) */}
                <path d={maxwellPts} fill="none" stroke="#2563eb" strokeWidth="3" />

                {/* Marker bei t = tau */}
                {rheoTauSec <= 10 && (
                  <g>
                    <line 
                      x1={tToX(rheoTauSec)} 
                      y1={padT} 
                      x2={tToX(rheoTauSec)} 
                      y2={padT + plotH} 
                      stroke="#3b82f6" 
                      strokeWidth="1" 
                      strokeDasharray="2 2" 
                    />
                    <circle 
                      cx={tToX(rheoTauSec)} 
                      cy={yToY(rheoWert0 * Math.exp(-1))} 
                      r="4" 
                      fill="#2563eb" 
                    />
                    <text 
                      x={tToX(rheoTauSec) + 6} 
                      y={yToY(rheoWert0 * Math.exp(-1)) - 6} 
                      fontSize="9" 
                      fill="#1d4ed8" 
                      fontWeight="bold"
                    >
                      τ = {formatDeWert(rheoTauSec)} s (36,8 %)
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Legende der Kurven */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2 pt-2 border-t border-home-grau/20 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-blue-600 inline-block border-t-2 border-blue-600"></span>
                <span className="font-bold text-blue-700">Maxwell-Element:</span>
                <span className="text-slate-600 font-mono">σ(t) = σ₀ · e^(-t/τ) → 0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-purple-600 inline-block border-t-2 border-purple-600"></span>
                <span className="font-bold text-purple-700">Zener (SLS):</span>
                <span className="text-slate-600 font-mono">σ(t) → σ_∞ &gt; 0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t-2 border-green-600 border-dashed inline-block"></span>
                <span className="font-bold text-green-700">Kelvin-Voigt:</span>
                <span className="text-slate-600 font-mono">Keine Relaxation (starr)</span>
              </div>
            </div>
          </div>

          {/* Live Cockpit Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Anfangsspannung σ₀</span>
              <span className="font-mono font-bold text-base text-text-main block mt-0.5">{formatDeZahl(rheoWert0, 1)} MPa</span>
              <span className="text-[10px] text-slate-500 font-mono">aufgeprägt bei t = 0</span>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Relaxationszeit τ</span>
              <span className="font-mono font-bold text-base text-blue-700 block mt-0.5">{formatDeZahl(rheoTauSec, 1)} s</span>
              <span className="text-[10px] text-slate-500 font-mono">t½ = {formatDeZahl(halfLife, 2)} s</span>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Maxwell σ(10 s)</span>
              <span className="font-mono font-bold text-base text-blue-800 block mt-0.5">{formatDeZahl(sigEndMaxwell, 2)} MPa</span>
              <span className="text-[10px] text-slate-500 font-mono">Abbau: -{formatDeZahl(relaxRateMaxwell, 0)} %</span>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Zener σ(10 s)</span>
              <span className="font-mono font-bold text-base text-purple-800 block mt-0.5">{formatDeZahl(sigEndZener, 2)} MPa</span>
              <span className="text-[10px] text-slate-500 font-mono">Restgrenze: 40 %</span>
            </div>
          </div>

          {/* Vertiefte didaktische Erklärung zur Relaxation */}
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 text-xs text-text-main/80 space-y-2 leading-relaxed">
            <div className="font-bold text-purple-950 flex items-center gap-1.5">
              <Timer size={15} className="text-purple-700" />
              <span>Warum relaxiert das Maxwell-Modell, während Kelvin-Voigt starr bleibt?</span>
            </div>
            <p>
              Bei der <strong>Spannungsrelaxation</strong> wird dem Körper eine konstante Gesamtdehnung 
              <InlineMath math="\varepsilon(t) = \varepsilon_0 = \text{konst.}" /> aufgeprägt (daher <InlineMath math="\dot{\varepsilon} = 0" />):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
              <div className="p-2.5 bg-white rounded-lg border border-purple-150 space-y-1">
                <span className="font-bold text-blue-700 block">Maxwell-Element (Reihe):</span>
                <span>
                  Feder und Dämpfer teilen sich die Gesamtdehnung (<InlineMath math="\varepsilon = \varepsilon_F + \varepsilon_D" />), 
                  übertragen aber dieselbe Spannung. Unter konstanter Dehnung fließt der serielle Dämpfer weiter: 
                  <InlineMath math="\dot{\varepsilon}_D = \sigma / \eta" />. Dies entlastet die Hooke-Feder (<InlineMath math="\dot{\varepsilon}_F = - \dot{\varepsilon}_D" />). 
                  Die Spannung baut sich nach <InlineMath math="\sigma(t) = \sigma_0 \cdot \exp(-t/\tau)" /> vollständig ab!
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-purple-150 space-y-1">
                <span className="font-bold text-green-700 block">Kelvin-Voigt-Element (Parallel):</span>
                <span>
                  Feder und Dämpfer erfahren zwingend dieselbe Dehnung (<InlineMath math="\varepsilon_F = \varepsilon_D = \varepsilon_0" />). 
                  Bei konstanter Dehnung ist die Dehngeschwindigkeit im Dämpfer <InlineMath math="\dot{\varepsilon}_D = 0" />. 
                  Damit ist der Dämpfer vollkommen kraftlos (<InlineMath math="\sigma_D = \eta \cdot 0 = 0" />). 
                  Die Hooke-Feder hält die volle Anfangsspannung unendlich aufrecht – <strong>Kelvin-Voigt kann nicht relaxieren!</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // KRIECHEN: eps(t)
      // Kelvin-Voigt vs. Maxwell vs. Hooke
      const epsEl = rheoWert0 / 10; // Promille
      const maxEps = epsEl * 3.5;
      const yToY = (yVal: number) => padT + plotH - (Math.max(0, Math.min(yVal, maxEps)) / maxEps) * plotH;

      let maxwellPts = '';
      let zenerPts = '';
      let kelvinPts = '';
      let hookePts = '';

      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * maxTime;
        const x = tToX(t);

        const eKel = epsEl * (1 + 1.5 * (1 - Math.exp(-t / rheoTauSec)));
        const eMax = epsEl * (1 + (t / rheoTauSec));
        const eZen = epsEl * (1 + 1.2 * (1 - Math.exp(-t / rheoTauSec)));
        const eHoo = epsEl;

        kelvinPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(eKel).toFixed(1)} `;
        maxwellPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(eMax).toFixed(1)} `;
        zenerPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(eZen).toFixed(1)} `;
        hookePts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(eHoo).toFixed(1)} `;
      }

      const epsEndKelvin = epsEl * (1 + 1.5 * (1 - Math.exp(-maxTime / rheoTauSec)));
      const epsEndMaxwell = epsEl * (1 + (maxTime / rheoTauSec));

      return (
        <div className="space-y-4">
          {/* Diagram Container */}
          <div className="relative bg-white rounded-2xl border border-home-grau/30 shadow-sm p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-shiraz flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-shiraz"></span>
                Dehnungsverlauf ε(t) bei konstanter Lastspannung σ(t) = σ₀ = konst.
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Retardationszeit τ = {formatDeZahl(rheoTauSec, 1)} s
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-h-[260px] select-none font-mono">
                <rect width={W} height={H} fill="#ffffff" rx="12" />

                {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                  const yVal = frac * maxEps;
                  const yPos = yToY(yVal);
                  return (
                    <g key={idx}>
                      <line x1={padL} y1={yPos} x2={W - padR} y2={yPos} stroke="#f1f5f9" strokeWidth="1" />
                      <text x={padL - 6} y={yPos + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                        {formatDeZahl(yVal, 1)} ‰
                      </text>
                    </g>
                  );
                })}

                {[0, 2, 4, 6, 8, 10].map((tVal) => {
                  const xPos = tToX(tVal);
                  return (
                    <g key={tVal}>
                      <line x1={xPos} y1={padT} x2={xPos} y2={padT + plotH} stroke="#f1f5f9" strokeWidth="1" />
                      <text x={xPos} y={H - padB + 18} textAnchor="middle" fontSize="10" fill="#334155" fontWeight="bold">
                        {formatDeWert(tVal)} s
                      </text>
                    </g>
                  );
                })}

                <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#334155" strokeWidth="1.5" />
                <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth="1.5" />
                <text x={W - padR} y={padT + plotH - 8} textAnchor="end" fontSize="11" fill="#0f172a" fontWeight="bold">Zeit t (s)</text>
                <text x={padL + 6} y={padT + 12} fontSize="11" fill="#0f172a" fontWeight="bold">Dehnung ε (‰)</text>

                {/* 1. Hooke (gestrichelt) */}
                <path d={hookePts} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* 2. Kelvin-Voigt (grün, asymptotisch) */}
                <path d={kelvinPts} fill="none" stroke="#16a34a" strokeWidth="3" />

                {/* 3. Zener (SLS / violett) */}
                <path d={zenerPts} fill="none" stroke="#9333ea" strokeWidth="2.5" />

                {/* 4. Maxwell (blau, linear unbegrenzt) */}
                <path d={maxwellPts} fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="5 3" />
              </svg>
            </div>

            {/* Legende */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2 pt-2 border-t border-home-grau/20 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-green-600 inline-block border-t-2 border-green-600"></span>
                <span className="font-bold text-green-700">Kelvin-Voigt (Kriechen):</span>
                <span className="text-slate-600 font-mono">Asymptotisch begrenzt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t-2 border-blue-600 border-dashed inline-block"></span>
                <span className="font-bold text-blue-700">Maxwell-Fluid:</span>
                <span className="text-slate-600 font-mono">Unbegrenztes Fließen</span>
              </div>
            </div>
          </div>

          {/* Live Cockpit Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Elast. Anfangsdehnung</span>
              <span className="font-mono font-bold text-base text-text-main block mt-0.5">{formatDeZahl(epsEl, 2)} ‰</span>
              <span className="text-[10px] text-slate-500 font-mono">ε_el = σ₀ / E</span>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Retardationszeit τ</span>
              <span className="font-mono font-bold text-base text-green-700 block mt-0.5">{formatDeZahl(rheoTauSec, 1)} s</span>
              <span className="text-[10px] text-slate-500 font-mono">63,2 % Erreichen</span>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Kelvin-Voigt ε(10 s)</span>
              <span className="font-mono font-bold text-base text-green-800 block mt-0.5">{formatDeZahl(epsEndKelvin, 2)} ‰</span>
              <span className="text-[10px] text-slate-500 font-mono">Kriechzahl φ ≈ 1,5</span>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Maxwell ε(10 s)</span>
              <span className="font-mono font-bold text-base text-blue-800 block mt-0.5">{formatDeZahl(epsEndMaxwell, 2)} ‰</span>
              <span className="text-[10px] text-slate-500 font-mono">lineares Fließen</span>
            </div>
          </div>
        </div>
      );
    }
}
