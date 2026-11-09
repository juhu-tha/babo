import { Sliders } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeWert, formatDeTeX, formatDeTeXWert, formatDeZahl } from '@/src/utils/numberFormat';
import React from 'react';
import inhalt from '@/content/beispielrechnungen/RechnungStahlbeton.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface RechnungStahlbetonProps {
  a_s_req: number;
  /** Mindestbewehrung (Robustheit, NA DE) aus src/calc/biegung.ts in cm² */
  a_s_min: number;
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

export default function RechnungStahlbeton({ a_s_req, a_s_min, bWidth, b_m, concreteClass, d1Margin, d_m, f_cd, f_ck, f_yd, hHeight, mEd, mu_Ed, mu_lim, setBWidth, setConcreteClass, setHHeight, setMEd, z_m, zeta }: RechnungStahlbetonProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Sliders className="text-shiraz" size={18} />
            <span><MdText text={inhalt.texte.bemessungEinesRechteckquerschnittsFür} /></span>
          </h3>
          <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.wasBerechnetWirdDie} /></p>
        </div>

        {/* INTERACTIVE CONTROLS */}
        <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
          <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Sliders size={14} className="text-shiraz" /><MdText text={inhalt.texte.tragwerksparameterEinstellen} /></h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Bending Moment */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.bemessungsmomentMEdKnm} /></label>
              <input aria-label={inhalt.werte.bemessungsmomentKnm} 
                type="range" min="50" max="300" step="10"
                value={mEd}
                aria-valuetext={`${formatDeWert(mEd)} kNm`}
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
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.abmessungenBalkenBTimes} /></label>
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
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.biegungBemessungsverfahrenDinEn} /></h4>

          <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
            <div><MdText text={inhalt.texte.schritt1RechnerischeMaterialfestigkeiten} /><p className="mt-1"><MdText text={inhalt.texte.zylinderdruckfestigkeitDesBetons} /><InlineMath math={`f_{ck} = ${f_ck} \\, \\text{N/mm}^2`} /><MdText text={inhalt.texte.brBemessungswertDerBetondruckfestigkeit} /></p>
              <BlockMath math={`f_{cd} = \\alpha_{cc} \\cdot \\frac{f_{ck}}{\\gamma_C} = 0{,}85 \\cdot \\frac{\\color{#A3113E}{${f_ck}}}{1{,}5} = \\color{#A3113E}{${formatDeTeX(f_cd, 2)}} \\, \\text{N/mm}^2 \\, (\\text{MPa})`} />
              <p className="mt-1"><MdText text={inhalt.texte.bemessungswertDerStahlstreckgrenzeF} /></p>
              <BlockMath math={`f_{yd} = \\frac{f_{yk}}{\\gamma_S} = \\frac{500}{1{,}15} = ${formatDeTeX(f_yd, 1)} \\, \\text{N/mm}^2`} />
            </div>

            <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt2NutzhöheD} /><p className="mt-1"><MdText text={inhalt.texte.dieNutzhöheDIst} /><InlineMath math={`d_1 = ${formatDeTeXWert(d1Margin)} \\, \\text{cm}`} /> an:
              </p>
              <BlockMath math={`d = h - d_1 = \\color{#A3113E}{${hHeight}} - ${formatDeTeXWert(d1Margin)} = \\color{#A3113E}{${formatDeTeX((hHeight - d1Margin), 1)}} \\, \\text{cm} \\quad (= \\color{#A3113E}{${formatDeTeX(d_m, 3)}} \\, \\text{m})`} />
            </div>

            <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt3DimensionslosesBiegemoment} /><p className="mt-1"><MdText text={inhalt.texte.hiermitWirdGeprüftOb} /></p>
              <BlockMath math={`\\mu_{Ed} = \\frac{M_{Ed}}{b \\cdot d^2 \\cdot f_{cd}}`} />
              <BlockMath math={`\\mu_{Ed} = \\frac{\\color{#A3113E}{${formatDeTeX((mEd * 0.001), 3)}} \\, \\text{MNm}}{\\color{#A3113E}{${formatDeTeX(b_m, 2)}} \\, \\text{m} \\cdot (\\color{#A3113E}{${formatDeTeX(d_m, 3)}} \\, \\text{m})^2 \\cdot \\color{#A3113E}{${formatDeTeX(f_cd, 2)}} \\, \\text{MN/m}^2} = \\color{#A3113E}{${formatDeTeX(mu_Ed, 4)}}`} />
            </div>

            <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt4HebelarmDer} />{mu_Ed <= mu_lim ? (
                <>
                  <p className="mt-1">
                    Da <InlineMath math={`\\mu_{Ed} = ${formatDeTeX(mu_Ed, 4)} \\le \\mu_{lim} = ${formatDeTeX(mu_lim, 3)}`} /><MdText text={inhalt.texte.istGrenzeFürXi} /></p>
                  <BlockMath math={`\\zeta = \\frac{1 + \\sqrt{1 - 2 \\cdot \\mu_{Ed}}}{2} = \\frac{1 + \\sqrt{1 - 2 \\cdot \\color{#A3113E}{${formatDeTeX(mu_Ed, 4)}}}}{2} = \\color{#A3113E}{${formatDeTeX(zeta, 4)}}`} />
                  <BlockMath math={`z = \\zeta \\cdot d = \\color{#A3113E}{${formatDeTeX(zeta, 4)}} \\cdot \\color{#A3113E}{${formatDeTeX(d_m, 3)}} = \\color{#A3113E}{${formatDeTeX(z_m, 3)}} \\, \\text{m}`} />
                </>
              ) : (
                <p className="text-red-600 font-bold"><MdText text={inhalt.texte.achtungEd} /><span className="text-shiraz">{formatDeZahl(mu_Ed, 4)}</span>) &gt; μ_lim ({formatDeZahl(mu_lim, 3)}<MdText text={inhalt.texte.lim045Nach} /></p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt5ErforderlicheStahlfläche} /><BlockMath math={`A_{s,\\text{erf}} = \\frac{M_{Ed}}{f_{yd} \\cdot z}`} />
              {mu_Ed <= mu_lim ? (
                <BlockMath math={`A_{s,\\text{erf}} = \\frac{\\color{#A3113E}{${mEd}} \\, \\text{kNm} \\cdot 10}{${formatDeTeX(f_yd, 1)} \\, \\text{N/mm}^2 \\cdot \\color{#A3113E}{${formatDeTeX(z_m, 3)}} \\, \\text{m}} = \\color{#A3113E}{${formatDeTeX(a_s_req, 2)}} \\, \\text{cm}^2`} />
              ) : (
                <div className="text-center text-red-700 font-bold bg-red-50 p-3 rounded-lg border border-red-200"><MdText text={inhalt.texte.berechnungGesperrtWegenQuerschnitts} /></div>
              )}
            </div>
          </div>
        </div>

        {/* EVALUATION OF REINFORCEMENT AREA (Modulprüfung T15-SB-2: Stabwahl aus A_s,erf statt fester Vorschläge) */}
        {mu_Ed <= mu_lim && (() => {
          const asMass = Math.max(a_s_req, a_s_min);
          const vorschlaege = [
            { label: inhalt.texte.optionAStandard, d: 16, farbe: 'text-shiraz' },
            { label: inhalt.texte.optionBKompakt, d: 20, farbe: 'text-teal-700' },
            { label: inhalt.texte.optionCMinimalistisch, d: 25, farbe: 'text-indigo-700' },
          ].map(v => {
            const a1 = (Math.PI * v.d * v.d) / 400; // cm² je Stab
            const n = Math.max(2, Math.ceil(asMass / a1 - 1e-9));
            return { ...v, n, as: n * a1 };
          });
          return (
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs font-normal text-text-main/80 space-y-3">
            <span className="font-extrabold text-slate-800 block"><MdText text={inhalt.texte.ergebnisInterpretationKonstruktionsvorsc} /></span>
            <p><MdText text={inhalt.texte.dieStatischErforderlicheLängsbewehrung} /><strong>{formatDeZahl(a_s_req, 2)} cm²</strong><MdText text={inhalt.texte.imIngenieurbüroMussDiese} /></p>
            <p><MdText text={inhalt.texte.mindestbewehrungAsMin} /><strong>{formatDeZahl(a_s_min, 2)} cm²</strong>{a_s_min > a_s_req ? <MdText text={inhalt.texte.mindestbewehrungMassgebend} /> : '.'}</p>
            <div className="p-3 bg-white border rounded-lg space-y-2.5 font-normal text-xxs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {vorschlaege.map(v => (
                  <div key={v.d} className="p-2 bg-slate-50 rounded-lg border text-center">
                    <span className="block font-bold mb-1"><MdText text={v.label} /></span>
                    <strong className={v.farbe}>{formatDeWert(v.n)} Ø {formatDeWert(v.d)}</strong> ({formatDeZahl(v.as, 2)} cm²)
                    <span className="block text-[10px] text-slate-500 mt-1">Auslastung: {formatDeZahl((asMass / v.as) * 100, 0)} %</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500"><MdText text={inhalt.texte.stabwahlHinweis} /></p>
            </div>
          </div>
          );
        })()}
      </div>
    );
}
