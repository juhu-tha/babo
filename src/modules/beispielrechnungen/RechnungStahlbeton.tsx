import { Sliders } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeWert, formatDeTeX, formatDeTeXWert, formatDeZahl } from '@/src/utils/numberFormat';
import React from 'react';

interface RechnungStahlbetonProps {
  a_s_req: number;
  bWidth: number;
  b_m: number;
  concreteClass: "C20/25" | "C25/30" | "C30/37";
  d1Margin: number;
  d_m: number;
  f_cd: number;
  f_ck: 20 | 25 | 30;
  f_yd: number;
  hHeight: number;
  mEd: number;
  mu_Ed: number;
  mu_lim: number;
  setBWidth: React.Dispatch<React.SetStateAction<number>>;
  setConcreteClass: React.Dispatch<React.SetStateAction<"C20/25" | "C25/30" | "C30/37">>;
  setHHeight: React.Dispatch<React.SetStateAction<number>>;
  setMEd: React.Dispatch<React.SetStateAction<number>>;
  z_m: number;
  zeta: number;
}

export default function RechnungStahlbeton({ a_s_req, bWidth, b_m, concreteClass, d1Margin, d_m, f_cd, f_ck, f_yd, hHeight, mEd, mu_Ed, mu_lim, setBWidth, setConcreteClass, setHHeight, setMEd, z_m, zeta }: RechnungStahlbetonProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Sliders className="text-shiraz" size={18} />
            <span>Bemessung eines Rechteckquerschnitts für reine Biegung im GZT</span>
          </h3>
          <p className="text-xs text-text-main/80 leading-relaxed font-normal">
            <strong>Was?</strong> Berechnet wird die erforderliche Längszugbewehrung <InlineMath math="A_s" /> in <InlineMath math="\text{cm}^2" /> für einen einachsig beanspruchten Stahlbetonbalken. <br />
            <strong>Warum?</strong> Beton besitzt eine sehr geringe Zugfestigkeit. Bei Biegung entstehen an der Bauteilunterseite Zugspannungen, die durch eingelegte Stahlstäbe rissminimierend und tragfähig aufgenommen werden müssen. <br />
            <strong>Wie?</strong> Über das dimensionslose Beiwert-Verfahren (<InlineMath math="\mu" />-Tabelle) für den Grenzzustand der Tragfähigkeit (GZT) nach <strong>Eurocode 2 (DIN EN 1992-1-1)</strong>.
          </p>
        </div>

        {/* INTERACTIVE CONTROLS */}
        <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
          <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Sliders size={14} className="text-shiraz" /> Tragwerksparameter einstellen
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Bending Moment */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block">Bemessungsmoment <InlineMath math="M_{Ed}" /> (kNm):</label>
              <input aria-label="Bemessungsmoment (kNm)" 
                type="range" min="50" max="300" step="10"
                value={mEd}
                onChange={(e) => setMEd(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeWert(mEd)} kNm</div>
            </div>

            {/* Concrete Class */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block">Betongüte:</label>
              <select aria-label="Betongüte" 
                value={concreteClass} 
                onChange={(e) => setConcreteClass(e.target.value as 'C20/25' | 'C25/30' | 'C30/37')}
                className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
              >
                <option value="C20/25">C20/25 (f_ck = 20 MPa)</option>
                <option value="C25/30">C25/30 (f_ck = 25 MPa)</option>
                <option value="C30/37">C30/37 (f_ck = 30 MPa)</option>
              </select>
            </div>

            {/* Section Dimensions */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs col-span-2">
              <label className="font-bold text-slate-700 block">Abmessungen Balken <InlineMath math="b \times h" /> (cm):</label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">Breite b:</span>
                  <input aria-label="Breite b" 
                    type="number" min="15" max="60"
                    value={bWidth}
                    onChange={(e) => setBWidth(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-slate-200 font-mono text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">Höhe h:</span>
                  <input aria-label="Höhe h" 
                    type="number" min="30" max="100"
                    value={hHeight}
                    onChange={(e) => setHHeight(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-slate-200 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* STEP-BY-STEP CALCULATION DETAILS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
            Biegung-Bemessungsverfahren (DIN EN 1992-1-1) Schritt für Schritt
          </h4>

          <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
            <div>
              <strong>Schritt 1: Rechnerische Materialfestigkeiten ermitteln</strong>
              <p className="mt-1">
                Zylinderdruckfestigkeit des Betons <InlineMath math={`f_{ck} = ${f_ck} \\, \\text{N/mm}^2`} />. <br />
                Bemessungswert der Betondruckfestigkeit <InlineMath math="f_{cd}" /> (mit Teilsicherheitsbeiwert <InlineMath math="\gamma_C = 1{,}5" /> und Beiwert für Langzeitwirkungen <InlineMath math="\alpha_{cc} = 0{,}85" />):
              </p>
              <BlockMath math={`f_{cd} = \\alpha_{cc} \\cdot \\frac{f_{ck}}{\\gamma_C} = 0{,}85 \\cdot \\frac{\\color{#A3113E}{${f_ck}}}{1{,}5} = \\color{#A3113E}{${formatDeTeX(f_cd, 2)}} \\, \\text{N/mm}^2 \\, (\\text{MPa})`} />
              <p className="mt-1">
                Bemessungswert der Stahlstreckgrenze <InlineMath math="f_{yd}" /> (mit <InlineMath math="f_{yk} = 500 \, \text{N/mm}^2" /> und Teilsicherheitsbeiwert <InlineMath math="\gamma_S = 1{,}15" />):
              </p>
              <BlockMath math={`f_{yd} = \\frac{f_{yk}}{\\gamma_S} = \\frac{500}{1{,}15} = ${formatDeTeX(f_yd, 1)} \\, \\text{N/mm}^2`} />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 2: Nutzhöhe d bestimmen</strong>
              <p className="mt-1">
                Die Nutzhöhe <InlineMath math="d" /> ist der Abstand des am stärksten gedrückten Betonrandes zum Schwerpunkt der Zugbewehrung. 
                Wir nehmen einen Vorhaltemaß-Abstand von <InlineMath math={`d_1 = ${formatDeTeXWert(d1Margin)} \\, \\text{cm}`} /> an:
              </p>
              <BlockMath math={`d = h - d_1 = \\color{#A3113E}{${hHeight}} - ${formatDeTeXWert(d1Margin)} = \\color{#A3113E}{${formatDeTeX((hHeight - d1Margin), 1)}} \\, \\text{cm} \\quad (= \\color{#A3113E}{${formatDeTeX(d_m, 3)}} \\, \\text{m})`} />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 3: Dimensionsloses Biegemoment <InlineMath math="\mu_{Ed}" /> berechnen</strong>
              <p className="mt-1">
                Hiermit wird geprüft, ob die Druckzone des Querschnitts ohne zusätzliche Druckbewehrung ausreicht:
              </p>
              <BlockMath math={`\\mu_{Ed} = \\frac{M_{Ed}}{b \\cdot d^2 \\cdot f_{cd}}`} />
              <BlockMath math={`\\mu_{Ed} = \\frac{\\color{#A3113E}{${formatDeTeX((mEd * 0.001), 3)}} \\, \\text{MNm}}{\\color{#A3113E}{${formatDeTeX(b_m, 2)}} \\, \\text{m} \\cdot (\\color{#A3113E}{${formatDeTeX(d_m, 3)}} \\, \\text{m})^2 \\cdot \\color{#A3113E}{${formatDeTeX(f_cd, 2)}} \\, \\text{MN/m}^2} = \\color{#A3113E}{${formatDeTeX(mu_Ed, 4)}}`} />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 4: Hebelarm der inneren Kräfte z ermitteln</strong>
              {mu_Ed < mu_lim ? (
                <>
                  <p className="mt-1">
                    Da <InlineMath math={`\\mu_{Ed} = ${formatDeTeX(mu_Ed, 4)} \\le \\mu_{lim} = ${formatDeTeX(mu_lim, 3)}`} /> ist (Grenze für <InlineMath math="\xi_{lim} = 0{,}45" /> nach NA DE), ist keine Druckbewehrung erforderlich.
                    Der mechanische Bewehrungsbeiwert <InlineMath math="\omega" /> und der Hebelarmbeiwert <InlineMath math="\zeta" /> ergeben sich hier vereinfacht aus einem rechteckigen Spannungsblock über die gesamte Druckzonenhöhe (Näherung; genauer: Parabel-Rechteck-Diagramm bzw. Spannungsblock mit λ = 0,8 nach DIN EN 1992-1-1, 3.1.7) zu:
                  </p>
                  <BlockMath math={`\\zeta = \\frac{1 + \\sqrt{1 - 2 \\cdot \\mu_{Ed}}}{2} = \\frac{1 + \\sqrt{1 - 2 \\cdot \\color{#A3113E}{${formatDeTeX(mu_Ed, 4)}}}}{2} = \\color{#A3113E}{${formatDeTeX(zeta, 4)}}`} />
                  <BlockMath math={`z = \\zeta \\cdot d = \\color{#A3113E}{${formatDeTeX(zeta, 4)}} \\cdot \\color{#A3113E}{${formatDeTeX(d_m, 3)}} = \\color{#A3113E}{${formatDeTeX(z_m, 3)}} \\, \\text{m}`} />
                </>
              ) : (
                <p className="text-red-600 font-bold">
                  Achtung! μ_Ed (<span className="text-shiraz">{formatDeZahl(mu_Ed, 4)}</span>) &gt; μ_lim ({formatDeZahl(mu_lim, 3)}, ξ_lim = 0,45 nach NA DE). Druckbewehrung erforderlich!
                  Ohne Druckbewehrung müssen die Balkenabmessungen (b, h) vergrößert werden, damit die Bewehrung fließt und ein sprödes Betonversagen ausgeschlossen ist.
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 5: Erforderliche Stahlfläche A_s berechnen</strong>
              <BlockMath math={`A_{s,\\text{erf}} = \\frac{M_{Ed}}{f_{yd} \\cdot z}`} />
              {mu_Ed < mu_lim ? (
                <BlockMath math={`A_{s,\\text{erf}} = \\frac{\\color{#A3113E}{${mEd}} \\, \\text{kNm} \\cdot 10}{${formatDeTeX(f_yd, 1)} \\, \\text{N/mm}^2 \\cdot \\color{#A3113E}{${formatDeTeX(z_m, 3)}} \\, \\text{m}} = \\color{#A3113E}{${formatDeTeX(a_s_req, 2)}} \\, \\text{cm}^2`} />
              ) : (
                <div className="text-center text-red-650 font-bold bg-red-50 p-3 rounded-lg border border-red-200">
                  Berechnung gesperrt wegen Querschnitts-Überbeanspruchung!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* EVALUATION OF REINFORCEMENT AREA */}
        {mu_Ed < mu_lim && (
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs font-normal text-text-main/80 space-y-3">
            <span className="font-extrabold text-slate-800 block">Ergebnis-Interpretation &amp; Konstruktionsvorschlag:</span>
            <p>
              Die statisch erforderliche Längsbewehrung an der Balkenunterseite beträgt <strong>{formatDeZahl(a_s_req, 2)} cm²</strong>. 
              Im Ingenieurbüro muss diese Fläche nun in konkrete Bewehrungsdurchmesser umgesetzt werden.
            </p>
            <div className="p-3 bg-white border rounded-lg space-y-2.5 font-normal text-xxs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-2 bg-slate-50 rounded-lg border text-center">
                  <span className="block font-bold mb-1">Option A (Standard):</span>
                  <strong className="text-shiraz">3 Ø 16</strong> (6,03 cm²)
                  <span className={`block text-[10px] mt-1 ${6.03 >= a_s_req ? 'text-slate-400' : 'text-red-700 font-bold'}`}>
                    {6.03 >= a_s_req ? `Auslastung: ${formatDeZahl((a_s_req / 6.03 * 100), 0)}%` : `Fläche unzureichend (${formatDeZahl((a_s_req / 6.03 * 100), 0)} %)!`}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border text-center">
                  <span className="block font-bold mb-1">Option B (Kompakt):</span>
                  <strong className="text-teal-700">2 Ø 20</strong> (6,28 cm²)
                  <span className={`block text-[10px] mt-1 ${6.28 >= a_s_req ? 'text-slate-400' : 'text-red-700 font-bold'}`}>
                    {6.28 >= a_s_req ? `Auslastung: ${formatDeZahl((a_s_req / 6.28 * 100), 0)}%` : `Fläche unzureichend (${formatDeZahl((a_s_req / 6.28 * 100), 0)} %)!`}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border text-center">
                  <span className="block font-bold mb-1">Option C (Minimalistisch):</span>
                  <strong className="text-indigo-700">4 Ø 12</strong> (4,52 cm²)
                  <span className="block text-[10px] text-slate-400 mt-1">
                    {4.52 >= a_s_req ? `Auslastung: ${formatDeZahl((a_s_req / 4.52 * 100), 0)}%` : 'Fläche unzureichend!'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
