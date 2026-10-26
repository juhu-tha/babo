import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { Timer } from 'lucide-react';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/mechanischekenngroessen/KriechModellDiagramm.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { maxwellRelaxation, zenerRelaxation, kelvinKriechen, maxwellKriechen, zenerKriechen, lehrDehnungPromille, rheologieKennwerte } from '@/src/calc/kriechenSchwinden';

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

        const sMax = maxwellRelaxation(rheoWert0, t, rheoTauSec);
        const sZen = zenerRelaxation(rheoWert0, t, rheoTauSec);
        const sKel = rheoWert0;
        const sHoo = rheoWert0;

        maxwellPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(sMax).toFixed(1)} `;
        zenerPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(sZen).toFixed(1)} `;
        kelvinPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(sKel).toFixed(1)} `;
        hookePts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(sHoo).toFixed(1)} `;
      }

      // Kennwerte aus dem Rechenkern src/calc/kriechenSchwinden.ts (Teil C, qualitative Lehrkurven)
      const kw = rheologieKennwerte(rheoWert0, rheoTauSec, maxTime);
      const sigEndMaxwell = kw.sigmaEndeMaxwell;
      const sigEndZener = kw.sigmaEndeZener;
      const relaxRateMaxwell = kw.abbauMaxwellProzent;
      const halfLife = kw.halbwertszeit;

      return (
        <div className="space-y-4">
          {/* Diagram Container */}
          <div className="relative bg-white rounded-2xl border border-home-grau/30 shadow-sm p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span><MdText text={inhalt.texte.spannungsverlaufTBeiVorgegebener} /></span>
              <span className="text-[11px] font-mono text-slate-500"><MdText text={inhalt.texte.halbwertszeitT} />{formatDeZahl(halfLife, 2)} s
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
                <span className="text-slate-600 font-mono"><MdText text={inhalt.texte.tET0} /></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-purple-600 inline-block border-t-2 border-purple-600"></span>
                <span className="font-bold text-purple-700"><MdText text={inhalt.texte.zenerSls} /></span>
                <span className="text-slate-600 font-mono"><MdText text={inhalt.texte.t0} /></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t-2 border-green-600 border-dashed inline-block"></span>
                <span className="font-bold text-green-700">Kelvin-Voigt:</span>
                <span className="text-slate-600 font-mono"><MdText text={inhalt.texte.keineRelaxationStarr} /></span>
              </div>
            </div>
          </div>

          {/* Live Cockpit Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold"><MdText text={inhalt.texte.anfangsspannung} /></span>
              <span className="font-mono font-bold text-base text-text-main block mt-0.5">{formatDeZahl(rheoWert0, 1)} MPa</span>
              <span className="text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.aufgeprägtBeiT0} /></span>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold"><MdText text={inhalt.texte.relaxationszeit} /></span>
              <span className="font-mono font-bold text-base text-blue-700 block mt-0.5">{formatDeZahl(rheoTauSec, 1)} s</span>
              <span className="text-[10px] text-slate-500 font-mono">t½ = {formatDeZahl(halfLife, 2)} s</span>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold"><MdText text={inhalt.texte.maxwell10S} /></span>
              <span className="font-mono font-bold text-base text-blue-800 block mt-0.5">{formatDeZahl(sigEndMaxwell, 2)} MPa</span>
              <span className="text-[10px] text-slate-500 font-mono">Abbau: -{formatDeZahl(relaxRateMaxwell, 0)} %</span>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold"><MdText text={inhalt.texte.zener10S} /></span>
              <span className="font-mono font-bold text-base text-purple-800 block mt-0.5">{formatDeZahl(sigEndZener, 2)} MPa</span>
              <span className="text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.restgrenze40} /></span>
            </div>
          </div>

          {/* Vertiefte didaktische Erklärung zur Relaxation */}
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 text-xs text-text-main/80 space-y-2 leading-relaxed">
            <div className="font-bold text-purple-950 flex items-center gap-1.5">
              <Timer size={15} className="text-purple-700" />
              <span><MdText text={inhalt.texte.warumRelaxiertDasMaxwell} /></span>
            </div>
            <p><MdText text={inhalt.texte.beiDerSpannungsrelaxationWird} /></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
              <div className="p-2.5 bg-white rounded-lg border border-purple-150 space-y-1">
                <span className="font-bold text-blue-700 block"><MdText text={inhalt.texte.maxwellElementReihe} /></span>
                <span><MdText text={inhalt.texte.federUndDämpferTeilen} /></span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-purple-150 space-y-1">
                <span className="font-bold text-green-700 block"><MdText text={inhalt.texte.kelvinVoigtElementParallel} /></span>
                <span><MdText text={inhalt.texte.federUndDämpferErfahren} /></span>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // KRIECHEN: eps(t)
      // Kelvin-Voigt vs. Maxwell vs. Hooke
      const epsEl = lehrDehnungPromille(rheoWert0); // Promille
      const maxEps = epsEl * 3.5;
      const yToY = (yVal: number) => padT + plotH - (Math.max(0, Math.min(yVal, maxEps)) / maxEps) * plotH;

      let maxwellPts = '';
      let zenerPts = '';
      let kelvinPts = '';
      let hookePts = '';

      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * maxTime;
        const x = tToX(t);

        const eKel = kelvinKriechen(epsEl, t, rheoTauSec);
        const eMax = maxwellKriechen(epsEl, t, rheoTauSec);
        const eZen = zenerKriechen(epsEl, t, rheoTauSec);
        const eHoo = epsEl;

        kelvinPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(eKel).toFixed(1)} `;
        maxwellPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(eMax).toFixed(1)} `;
        zenerPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(eZen).toFixed(1)} `;
        hookePts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(eHoo).toFixed(1)} `;
      }

      const kw = rheologieKennwerte(rheoWert0, rheoTauSec, maxTime);
      const epsEndKelvin = kw.epsEndeKelvin;
      const epsEndMaxwell = kw.epsEndeMaxwell;

      return (
        <div className="space-y-4">
          {/* Diagram Container */}
          <div className="relative bg-white rounded-2xl border border-home-grau/30 shadow-sm p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-shiraz flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.dehnungsverlaufTBeiKonstanter} /></span>
              <span className="text-[11px] font-mono text-slate-500"><MdText text={inhalt.texte.retardationszeit} />{formatDeZahl(rheoTauSec, 1)} s
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
                <span className="font-bold text-green-700"><MdText text={inhalt.texte.kelvinVoigtKriechen} /></span>
                <span className="text-slate-600 font-mono"><MdText text={inhalt.texte.asymptotischBegrenzt} /></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t-2 border-blue-600 border-dashed inline-block"></span>
                <span className="font-bold text-blue-700">Maxwell-Fluid:</span>
                <span className="text-slate-600 font-mono"><MdText text={inhalt.texte.unbegrenztesFließen} /></span>
              </div>
            </div>
          </div>

          {/* Live Cockpit Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold"><MdText text={inhalt.texte.elastAnfangsdehnung} /></span>
              <span className="font-mono font-bold text-base text-text-main block mt-0.5">{formatDeZahl(epsEl, 2)} ‰</span>
              <span className="text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.elE} /></span>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold"><MdText text={inhalt.texte.retardationszeit2} /></span>
              <span className="font-mono font-bold text-base text-green-700 block mt-0.5">{formatDeZahl(rheoTauSec, 1)} s</span>
              <span className="text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.t632Erreichen} /></span>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold"><MdText text={inhalt.texte.kelvinVoigt10S} /></span>
              <span className="font-mono font-bold text-base text-green-800 block mt-0.5">{formatDeZahl(epsEndKelvin, 2)} ‰</span>
              <span className="text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.kriechzahl15} /></span>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
              <span className="text-[10px] text-text-main/70 uppercase block font-semibold"><MdText text={inhalt.texte.maxwell10S2} /></span>
              <span className="font-mono font-bold text-base text-blue-800 block mt-0.5">{formatDeZahl(epsEndMaxwell, 2)} ‰</span>
              <span className="text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.linearesFließen} /></span>
            </div>
          </div>
        </div>
      );
    }
}
