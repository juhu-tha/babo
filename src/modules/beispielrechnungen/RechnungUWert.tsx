import { Layers, Sliders, CheckCircle2, AlertTriangle } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeWert, formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import React from 'react';

interface RechnungUWertProps {
  R_T: number;
  R_concrete: number;
  R_insulation: number;
  R_plaster: number;
  U_value: number;
  gegLimit: 0.24;
  setUConcreteThick: React.Dispatch<React.SetStateAction<number>>;
  setUInsuThick: React.Dispatch<React.SetStateAction<number>>;
  setUPlasterThick: React.Dispatch<React.SetStateAction<number>>;
  uConcreteLambda: number;
  uConcreteThick: number;
  uInsuLambda: number;
  uInsuThick: number;
  uPlasterLambda: number;
  uPlasterThick: number;
}

export default function RechnungUWert({ R_T, R_concrete, R_insulation, R_plaster, U_value, gegLimit, setUConcreteThick, setUInsuThick, setUPlasterThick, uConcreteLambda, uConcreteThick, uInsuLambda, uInsuThick, uPlasterLambda, uPlasterThick }: RechnungUWertProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Layers className="text-shiraz" size={18} />
            <span>Wärmedurchgangskoeffizient (U-Wert) einer gedämmten Betonwand</span>
          </h3>
          <p className="text-xs text-text-main/80 leading-relaxed font-normal">
            <strong>Was?</strong> Berechnet wird der Wärmedurchgangskoeffizient <InlineMath math="U" /> einer mehrschichtigen Wandkonstruktion in <InlineMath math="\text{W/(m}^2\text{K)}" />. <br />
            <strong>Warum?</strong> Der U-Wert beschreibt den stationären Wärmestrom durch ein Bauteil bei einer Temperaturdifferenz von 1 Kelvin. Ein kleinerer Wert bedeutet eine bessere Wärmedämmung. Er ist das fundamentale Kriterium zur Begrenzung von Transmissionswärmeverlusten nach dem <strong>Gebäudeenergiegesetz (GEG)</strong>. <br />
            <strong>Wie?</strong> Durch die Addition der inneren und äußeren Wärmeübergangswiderstände <InlineMath math="R_{si}" /> und <InlineMath math="R_{se}" /> mit den Wärmedurchlasswiderständen der einzelnen Baustoffschichten <InlineMath math="R_i = d_i / \lambda_i" />.
          </p>
        </div>

        {/* INTERACTIVE CONTROLS */}
        <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
          <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Sliders size={14} className="text-shiraz" /> Parameter anpassen (Echtzeit-Nachweis)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Layer 1: Concrete */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-xxs font-bold text-slate-400 uppercase tracking-wide block">Schicht 1: Normalbeton</span>
              <label className="text-xs text-text-main/80 block font-normal">Dicke <InlineMath math="d_1" /> (cm):</label>
              <input aria-label="Dicke (cm)" 
                type="range" min="10" max="40" step="5"
                value={uConcreteThick}
                onChange={(e) => setUConcreteThick(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                <span>{formatDeWert(uConcreteThick)} cm</span>
                <span><InlineMath math="\lambda_1 = 2{,}3 \, \text{W/(mK)}" /></span>
              </div>
            </div>

            {/* Layer 2: Insulation */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-xxs font-bold text-slate-400 uppercase tracking-wide block">Schicht 2: EPS-Dämmung</span>
              <label className="text-xs text-text-main/80 block font-normal">Dicke <InlineMath math="d_2" /> (cm):</label>
              <input aria-label="Dicke (cm)" 
                type="range" min="0" max="30" step="2"
                value={uInsuThick}
                onChange={(e) => setUInsuThick(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                <span>{formatDeWert(uInsuThick)} cm</span>
                <span><InlineMath math="\lambda_2 = 0{,}035 \, \text{W/(mK)}" /></span>
              </div>
            </div>

            {/* Layer 3: Plaster */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-xxs font-bold text-slate-400 uppercase tracking-wide block">Schicht 3: Kalkgipsputz</span>
              <label className="text-xs text-text-main/80 block font-normal">Dicke <InlineMath math="d_3" /> (cm):</label>
              <input aria-label="Dicke (cm)" 
                type="range" min="0.5" max="3.0" step="0.5"
                value={uPlasterThick}
                onChange={(e) => setUPlasterThick(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                <span>{formatDeWert(uPlasterThick)} cm</span>
                <span><InlineMath math="\lambda_3 = 0{,}70 \, \text{W/(mK)}" /></span>
              </div>
            </div>

          </div>
        </div>

        {/* STEP-BY-STEP CALCULATION DETAILS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
            Schritt-für-Schritt Berechnung gemäß DIN EN ISO 6946
          </h4>

          <div className="space-y-3.5 text-xs text-text-main/80 leading-relaxed font-normal">
            <div>
              <strong>Schritt 1: Wärmeübergangswiderstände festlegen</strong>
              <p className="mt-1">
                Nach DIN EN ISO 6946 werden für horizontale Wärmeströme durch Außenwände folgende Standardwerte angesetzt:
              </p>
              <BlockMath math="R_{si} = 0{,}13 \, \text{m}^2\text{K/W} \quad \text{(Wärmeübergang Innen)}" />
              <BlockMath math="R_{se} = 0{,}04 \, \text{m}^2\text{K/W} \quad \text{(Wärmeübergang Außen)}" />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 2: Wärmedurchlasswiderstände der Baustoffschichten berechnen</strong>
              <p className="mt-1">
                Die Einzelwiderstände <InlineMath math="R_i" /> ergeben sich aus <InlineMath math="R_i = d_i / \lambda_i" /> (mit Dicke <InlineMath math="d_i" /> in Metern):
              </p>
              <div className="space-y-2 mt-2 bg-slate-50 p-3 rounded-lg font-mono text-xxs border border-home-grau/20">
                <p>• Schicht 1 (Normalbeton): R₁ = <span className="text-shiraz font-bold">{formatDeZahl((uConcreteThick/100), 2)}</span> m / {formatDeZahl(uConcreteLambda, 2)} W/(mK) = <span className="text-shiraz font-bold">{formatDeZahl(R_concrete, 4)}</span> m²K/W</p>
                <p>• Schicht 2 (EPS-Dämmung): R₂ = <span className="text-shiraz font-bold">{formatDeZahl((uInsuThick/100), 2)}</span> m / {formatDeZahl(uInsuLambda, 3)} W/(mK) = <span className="text-shiraz font-bold">{formatDeZahl(R_insulation, 4)}</span> m²K/W</p>
                <p>• Schicht 3 (Kalkgipsputz): R₃ = <span className="text-shiraz font-bold">{formatDeZahl((uPlasterThick/100), 3)}</span> m / {formatDeZahl(uPlasterLambda, 2)} W/(mK) = <span className="text-shiraz font-bold">{formatDeZahl(R_plaster, 4)}</span> m²K/W</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 3: Gesamtwärmedurchlasswiderstand R_T aufsummieren</strong>
              <BlockMath math={`R_T = R_{si} + R_1 + R_2 + R_3 + R_{se}`} />
              <BlockMath math={`R_T = 0{,}13 + \\color{#A3113E}{${formatDeTeX(R_concrete, 4)}} + \\color{#A3113E}{${formatDeTeX(R_insulation, 4)}} + \\color{#A3113E}{${formatDeTeX(R_plaster, 4)}} + 0{,}04 = \\color{#A3113E}{${formatDeTeX(R_T, 4)}} \\, \\text{m}^2\\text{K/W}`} />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 4: Wärmedurchgangskoeffizient U ermitteln</strong>
              <p className="mt-1">Der Kehrwert des Gesamtwiderstands liefert den gesuchten U-Wert:</p>
              <BlockMath math={`U = \\frac{1}{R_T} = \\frac{1}{\\color{#A3113E}{${formatDeTeX(R_T, 4)}}} = \\color{#A3113E}{${formatDeTeX(U_value, 4)}} \\, \\text{W/(m}^2\\text{K)}`} />
            </div>
          </div>
        </div>

        {/* RESULTS EVALUATION */}
        <div className={`p-5 rounded-2xl border text-xs leading-relaxed flex flex-col md:flex-row gap-4 items-start md:items-center ${
              U_value <= gegLimit 
                ? 'bg-green-50 border-green-200 text-green-900' 
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
          <div className="p-3 rounded-xl bg-white border self-start md:self-center">
            {U_value <= gegLimit ? (
              <CheckCircle2 className="text-green-600 animate-bounce" size={32} />
            ) : (
              <AlertTriangle className="text-red-600 animate-pulse" size={32} />
            )}
          </div>
          <div className="space-y-1 flex-1 font-normal">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm">Ergebnisbewertung &amp; Interpretation:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-xxs tracking-wider uppercase ${
                    U_value <= gegLimit ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                  }`}>
                {U_value <= gegLimit ? 'Bestanden (GEG-konform)' : 'Nicht bestanden (Gegen GEG)'}
              </span>
            </div>
            <p>
              Ihr berechneter U-Wert beträgt <strong>{formatDeZahl(U_value, 3)} W/(m²K)</strong>. 
              Das Gebäudeenergiegesetz (GEG), Anlage 7 fordert bei nachträglicher Sanierung oder Neuerrichtung von Außenwänden einen maximalen U-Wert von <strong>0,24 W/(m²K)</strong>.
            </p>
            <p className="text-xxs opacity-90 mt-1">
              {U_value <= gegLimit 
                ? 'Die Dämmstoffstärke ist energetisch ausreichend dimensioniert. Das Risiko von Oberflächenkondensat an der Innenseite bei üblichen Raumklimaten (20°C, 50% r.F.) ist extrem gering, wodurch Schimmelpilzbildung konstruktiv unterbunden wird.'
                : 'Die Dämmwirkung ist unzureichend. Erhöhen Sie die Dicke der EPS-Dämmung (Schicht 2) im interaktiven Regler auf mindestens 14 cm, um den Mindestwärmeschutz einzuhalten und Tauwasserausfall zu verhindern.'}
            </p>
          </div>
        </div>
      </div>
    );
}
