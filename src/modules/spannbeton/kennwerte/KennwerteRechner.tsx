import { Activity } from 'lucide-react';
import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import type { Dispatch, SetStateAction } from 'react';
import inhalt from '@/content/spannbeton/kennwerte/KennwerteRechner.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { E_SPANNSTAHL } from '@/src/calc/spannbeton';
import { reglerName } from '@/src/lib/reglerName';

interface KennwerteRechnerProps {
  calcFck: number;
  calcRH: number;
  calcSteelLoss: number;
  calcT0: number;
  estCsrLossPct: number;
  estEpsCs: 0.00038 | 0.00022;
  estPhi: number;
  setCalcFck: Dispatch<SetStateAction<number>>;
  setCalcRH: Dispatch<SetStateAction<number>>;
  setCalcSteelLoss: Dispatch<SetStateAction<number>>;
  setCalcT0: Dispatch<SetStateAction<number>>;
}

export default function KennwerteRechner({ calcFck, calcRH, calcSteelLoss, calcT0, estCsrLossPct, estEpsCs, estPhi, setCalcFck, setCalcRH, setCalcSteelLoss, setCalcT0 }: KennwerteRechnerProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
          <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Activity className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.interaktiverKennwerteVerlustExplorer} /></h4>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-1 rounded">
              Echtzeit-Parameter-Sensitivität
            </span>
          </div>

          <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.verändernSieDieWesentlichen} /></p>

          {/* Slider Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <div>
              <label className="block text-xs font-semibold text-text-main mb-1 flex justify-between">
                <span><MdText text={inhalt.texte.betonfestigkeitFCk} /></span>
                <span className="text-shiraz font-mono font-bold">{formatDeWert(calcFck)} MPa</span>
              </label>
              <input
                type="range"
                min="30"
                max="90"
                step="5"
                value={calcFck}
                aria-label={reglerName(inhalt.texte.betonfestigkeitFCk)}
                aria-valuetext={`${formatDeWert(calcFck)} MPa`}
                onChange={(e) => setCalcFck(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                <span>C30/37</span>
                <span>C90/105</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1 flex justify-between">
                <span><MdText text={inhalt.texte.vorspannalterT} /></span>
                <span className="text-shiraz font-mono font-bold">{formatDeWert(calcT0)} Tage</span>
              </label>
              <input
                type="range"
                min="2"
                max="28"
                step="1"
                value={calcT0}
                aria-label={reglerName(inhalt.texte.vorspannalterT)}
                aria-valuetext={`${formatDeWert(calcT0)} Tage`}
                onChange={(e) => setCalcT0(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                <span>2 d (Früh)</span>
                <span>28 d (Spät)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1 flex justify-between">
                <span><MdText text={inhalt.texte.luftfeuchteRh} /></span>
                <span className="text-shiraz font-mono font-bold">{formatDeWert(calcRH)} %</span>
              </label>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  type="button"
                  onClick={() => setCalcRH(50)}
                  className={`py-1 text-xs rounded font-medium border ${calcRH === 50 ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700 border-slate-200'}`}
                >
                  50% Innen
                </button>
                <button
                  type="button"
                  onClick={() => setCalcRH(80)}
                  className={`py-1 text-xs rounded font-medium border ${calcRH === 80 ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700 border-slate-200'}`}
                >
                  80% Außen
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1 flex justify-between">
                <span>Relaxationsklasse:</span>
                <span className="text-shiraz font-mono font-bold">ρ₁₀₀₀ = {formatDeWert(calcSteelLoss)}%</span>
              </label>
              <select
                value={calcSteelLoss}
                onChange={(e) => setCalcSteelLoss(Number(e.target.value))}
                className="w-full text-xs bg-white border border-slate-300 rounded p-1.5 outline-none font-medium mt-1"
              >
                <option value={2.5}>Klasse 2 (Low-Relax.) 2,5%</option>
                <option value={4.0}>Klasse 3 (Spannstäbe) 4,0%</option>
                <option value={8.0}>Klasse 1 (Normal) 8,0%</option>
              </select>
            </div>
          </div>

          {/* Ergebnis-Karten */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
              <span className="text-xs text-amber-800 font-medium"><MdText text={inhalt.texte.resultierendeKriechzahl} /></span>
              <div className="text-2xl font-bold font-mono text-amber-900">{formatDeZahl(estPhi, 2)}</div>
              <p className="text-[10px] text-amber-700">
                {estPhi > 2.5 ? inhalt.werte.hohesKriechenJungerBeton : inhalt.werte.geringesKriechenGünstig}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
              <span className="text-xs text-blue-800 font-medium"><MdText text={inhalt.texte.gesamtschwindmaßCs} /></span>
              <div className="text-2xl font-bold font-mono text-blue-900">{formatDeZahl((estEpsCs * 1000), 2)} mm/m</div>
              <p className="text-[10px] text-blue-700">
                Entspricht {formatDeZahl((estEpsCs * E_SPANNSTAHL), 0)}<MdText text={inhalt.texte.nMmTheoretischemSpannungsabfall} /></p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
              <span className="text-xs text-purple-800 font-medium"><MdText text={inhalt.texte.prognostizierterGesamtverlustCS} /></span>
              <div className="text-2xl font-bold font-mono text-purple-900">≈ {formatDeZahl(estCsrLossPct, 1)} %</div>
              <p className="text-[10px] text-purple-700"><MdText text={inhalt.texte.restspannkraftImEndzustandCa} />{formatDeZahl((100 - estCsrLossPct), 1)} % von P₀
              </p>
            </div>
          </div>
        </div>
      </div>
    );
}
