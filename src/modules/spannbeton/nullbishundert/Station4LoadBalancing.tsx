import type { Dispatch, SetStateAction } from 'react';
import { ArrowRight, ArrowLeft, BookOpen, Activity, Layers, Compass } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';

export interface Station4LoadBalancingProps {
  beamLength: number;
  setBeamLength: Dispatch<SetStateAction<number>>;
  deadLoad: number;
  setDeadLoad: Dispatch<SetStateAction<number>>;
  sagittaF: number;
  setSagittaF: Dispatch<SetStateAction<number>>;
  requiredP_kN: number;
  upwardLoad_u: number;
  netMomentMidspan: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function Station4LoadBalancing({ beamLength, setBeamLength, deadLoad, setDeadLoad, sagittaF, setSagittaF, requiredP_kN, upwardLoad_u, netMomentMidspan, setActiveStep }: Station4LoadBalancingProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-home-grau/20 pb-4">
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
          Lektion 4 von 6 • 60% bis 80%
        </span>
        <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
          Tragwerksmechanik & Das Load-Balancing-Verfahren (T. Y. Lin)
        </h3>
        <p className="text-sm text-text-main/80 mt-1">
          Umlenkkräfte: Kompensation ständiger Lasten durch gezielt gekrümmte Spanngliedführungen.
        </p>
      </div>
    
      {/* Sachliche Einführung */}
      <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
            <BookOpen size={20} />
          </div>
          <div className="text-sm text-text-main leading-relaxed space-y-2">
            <p className="font-bold text-slate-900">
              Wirkungsweise der Umlenkpressung (Load Balancing nach T. Y. Lin):
            </p>
            <p>
              Ein im Bauteil parabelförmig gekrümmt geführtes Spannglied übt unter Längszug eine kontinuierliche 
              Radialpressung gegen den umgebenden Beton aus. Diese Umlenkkraft wirkt der Schwerkraft entgegen 
              und erzeugt eine nach oben gerichtete Streckenlast <InlineMath math="u = \frac{8 \cdot P \cdot f}{L^2}" />.
            </p>
            <p>
              Nach der von T. Y. Lin formulierten Load-Balancing-Methode kann die Vorspannkraft <InlineMath math="P" /> so 
              dimensioniert werden, dass die Umlenkkraft <InlineMath math="u" /> das Trägereigengewicht <InlineMath math="g" /> exakt 
              kompensiert (<InlineMath math="u = g" />). In diesem Zustand treten unter Eigengewicht keine Biegemomente 
              und keine Durchbiegungen auf; der Querschnitt befindet sich im Zustand reiner zentrischer Druckbeanspruchung.
            </p>
          </div>
        </div>
      </div>
    
      {/* Formeln und Überlagerung */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-3">
          <h4 className="font-bold text-sm text-shiraz flex items-center gap-2">
            <Compass size={16} /> Mathematische Formulierung der Umlenkkraft
          </h4>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Für eine Parabel mit dem Stich <InlineMath math="f" /> über die Stützweite <InlineMath math="L" /> 
            ergibt sich die nach oben gerichtete Streckenlast <InlineMath math="u" /> aus der Seiltheorie zu:
          </p>
          <div className="p-3 bg-white rounded-lg border border-home-grau/25 text-center font-mono">
            <BlockMath math="u = \frac{8 \cdot P \cdot f}{L^2}" />
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Für einen vollständigen Lastausgleich des Eigengewichts (<InlineMath math="u = g" />) 
            berechnet sich die erforderliche Vorspannkraft zu:
          </p>
          <div className="p-3 bg-white rounded-lg border border-home-grau/25 text-center font-mono text-shiraz font-bold">
            <BlockMath math="P_{bal} = \frac{g \cdot L^2}{8 \cdot f}" />
          </div>
        </div>
    
        {/* Randspannungsüberlagerung */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Layers size={16} className="text-shiraz" /> Superposition der Randspannungen
          </h4>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">1. Zentrischer Druckanteil:</strong>
                <span className="text-slate-600 text-[11px]">Gleichmäßige Stauchung über die Querschnittsfläche.</span>
              </div>
              <span className="font-mono font-bold text-shiraz shrink-0">- P / A</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">2. Exzentrizitätsmoment:</strong>
                <span className="text-slate-600 text-[11px]">Spannglied unten erzeugt Druck unten, Zug oben.</span>
              </div>
              <span className="font-mono font-bold text-blue-700 shrink-0">± (P · e_p) / W</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">3. Äußere Lastmomente:</strong>
                <span className="text-slate-600 text-[11px]">Eigengewicht und Nutzlast erzeugen Druck oben, Zug unten.</span>
              </div>
              <span className="font-mono font-bold text-emerald-700 shrink-0">∓ M_ext / W</span>
            </div>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-medium">
            <strong>Ergebnis:</strong> An der Trägerunterseite kompensieren sich das negative Vorspannmoment 
            und das positive Lastmoment nahezu vollständig.
          </div>
        </div>
      </div>
    
      {/* Interaktiver Load-Balancing-Rechner */}
      <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
          <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
            <Activity size={15} /> Interaktiver Load-Balancing-Rechner
          </span>
          <span className="text-xs font-mono font-bold text-emerald-700">
            Lastausgleich: 100 % (Vollständig kompensiert)
          </span>
        </div>
    
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-main/70 mb-1 flex justify-between">
              <span>Stützweite (L):</span>
              <span className="font-mono text-shiraz font-bold">{formatDeWert(beamLength)} m</span>
            </label>
            <input
              type="range"
              min={10}
              max={40}
              step={1}
              value={beamLength}
              onChange={(e) => setBeamLength(Number(e.target.value))}
              className="w-full accent-shiraz cursor-pointer"
            />
          </div>
    
          <div>
            <label className="block text-xs font-semibold text-text-main/70 mb-1 flex justify-between">
              <span>Eigengewicht (g):</span>
              <span className="font-mono text-shiraz font-bold">{formatDeWert(deadLoad)} kN/m</span>
            </label>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={deadLoad}
              onChange={(e) => setDeadLoad(Number(e.target.value))}
              className="w-full accent-shiraz cursor-pointer"
            />
          </div>
    
          <div>
            <label className="block text-xs font-semibold text-text-main/70 mb-1 flex justify-between">
              <span>Parabelstich (f):</span>
              <span className="font-mono text-shiraz font-bold">{formatDeZahl((sagittaF * 100), 0)} cm</span>
            </label>
            <input
              type="range"
              min={0.10}
              max={0.90}
              step={0.05}
              value={sagittaF}
              onChange={(e) => setSagittaF(Number(e.target.value))}
              className="w-full accent-shiraz cursor-pointer"
            />
          </div>
        </div>
    
        {/* Ergebnis-Karten */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
            <span className="text-[10px] text-text-main/60 uppercase font-bold block">Erforderliche Spannkraft</span>
            <span className="text-lg font-mono font-black text-shiraz">{formatDeWert(requiredP_kN)} kN</span>
            <span className="text-[10px] text-text-main/50 block font-mono">ca. {formatDeWert(Math.round(requiredP_kN / 150))} Standard-Litzen</span>
          </div>
          <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
            <span className="text-[10px] text-text-main/60 uppercase font-bold block">Aufwärts-Umlenkkraft (u)</span>
            <span className="text-lg font-mono font-black text-emerald-700">{formatDeWert(upwardLoad_u)} kN/m</span>
            <span className="text-[10px] text-emerald-600 block font-bold">Kompensiert Eigengewicht g</span>
          </div>
          <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
            <span className="text-[10px] text-text-main/60 uppercase font-bold block">Netto-Biegemoment aus (g - u)</span>
            <span className="text-lg font-mono font-black text-slate-800">{formatDeWert(netMomentMidspan)} kNm</span>
            <span className="text-[10px] text-slate-500 block font-mono">Reine Axialdruckkraft im Träger</span>
          </div>
        </div>
      </div>
    
      {/* Navigation */}
      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex justify-between items-center">
        <button
          type="button"
          onClick={() => setActiveStep(2)}
          className="px-3.5 py-2 bg-white text-text-main hover:bg-slate-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-home-grau/30 cursor-pointer"
        >
          <ArrowLeft size={14} /> Zurück zu Kapitel 3
        </button>
        <button
          type="button"
          onClick={() => setActiveStep(4)}
          className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          Weiter zu Kapitel 5 <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
