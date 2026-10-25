import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { bemesseStuetze } from '@/src/calc/stuetze';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EC2_NA_DE } from '@/src/data/normParams';
import { AlertTriangle, Layers } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import inhalt from '@/content/stuetzenbemessung/Stuetzenbemessung.json';
import { MdText } from '@/src/components/inhalt/MdText';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

export default function Stuetzenbemessung() {
  const [b, setB] = useState(30); // cm
  const [h, setH] = useState(30); // cm
  const [d1, setD1] = useState(4); // cm
  const [l0, setL0] = useState(2.0); // m (Ersatzlänge nach DIN EN 1992-1-1); λ = 23,1 ≤ λ_lim = 25, damit ist das Startbeispiel nach Theorie I. Ordnung zulässig
  const [nEd, setNEd] = useState(1000); // kN (Druckkraft)
  const [mEd, setMEd] = useState(50); // kNm
  const [fck, setFck] = useState(30); // MPa
  const [fyk, setFyk] = useState(500); // MPa

  const results = useMemo(
    () => bemesseStuetze({ b, h, d1, l0, nEd, mEd, fck, fyk }),
    [b, h, d1, l0, nEd, mEd, fck, fyk]
  );

  const chartData = {
    datasets: [
      ...results.interactionCurves.map((curve, index) => ({
        label: `ω = ${formatDeZahl(curve.omega, 2)}${curve.isRequired ? ' (erf.)' : ''}`,
        data: curve.points,
        borderColor: curve.isRequired ? '#A3113E' : `rgba(71, 85, 105, ${0.3 + (index % 8) * 0.1})`,
        borderWidth: curve.isRequired ? 3 : 2,
        borderDash: curve.isRequired ? [5, 5] : [],
        fill: false,
        pointRadius: 0,
        tension: 0.1
      })),
      {
        label: inhalt.werte.einwirkungEdEd,
        data: [{ x: results.mu_Ed, y: results.nu_Ed }],
        backgroundColor: '#A3113E',
        borderColor: '#A3113E',
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear' as const,
        title: { display: true, text: inhalt.werte.bezogenesMomentEd },
        min: 0,
        max: Math.max(0.6, Math.ceil(results.mu_Ed * 1.2 * 10) / 10)
      },
      y: {
        type: 'linear' as const,
        title: inhalt.daten["Stuetzenbemessung.chartOptions.scales.y.title"],
        min: Math.min(-3.0, Math.floor(results.nu_Ed * 1.2 * 10) / 10),
        max: Math.max(1.0, Math.ceil(results.nu_Ed * 1.2 * 10) / 10)
      }
    },
    plugins: {
      legend: { position: 'right' as const }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /><MdText text={inhalt.texte.stützenbemessungInteraktionsdiagramm} /></h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300"><MdText text={inhalt.texte.berechnetNachDinEn} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.bemessungVonMassivbaustützenStahlbeton} /><FormulaText text="A_{s,tot}" /><MdText text={inhalt.texte.unterBerücksichtigungVonMindestausmitte} /></p>
        </div>

        {results.isTheorie2Ordnung && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <div className="font-bold text-amber-800 text-sm"><MdText text={inhalt.texte.theorieIiOrdnungErforderlich} /></div>
              <div className="text-xs text-amber-700 mt-1"><MdText text={inhalt.texte.dieSchlankheitDerStütze} /><FormulaText text={`\\lambda = ${formatDeTeX(results.lambda, 1)}`} /><MdText text={inhalt.texte.undÜberschreitetDieGrenzschlankheit} /><FormulaText text={`\\lambda_{lim} = ${formatDeTeX(results.lambda_lim, 1)}`} /><MdText text={inhalt.texte.nachDinEn1992} /></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.querschnittMaterial} /></h3>
              <div className="grid grid-cols-2 gap-4">
                <Slider label="Breite b" value={b} min={15} max={100} step={5} onChange={(e) => setB(Number(e.target.value))} unit="cm" />
                <Slider label="Höhe h" value={h} min={15} max={100} step={5} onChange={(e) => setH(Number(e.target.value))} unit="cm" />
              </div>
              <div className="mt-4">
                <Slider label={inhalt.werte.randabstandD1} value={d1} min={2} max={10} step={0.5} onChange={(e) => setD1(Number(e.target.value))} unit="cm" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-text-main mb-2 block">Beton fck</label>
                  <select aria-label="Beton fck" className="w-full p-2 border rounded-md" value={fck} onChange={(e) => setFck(Number(e.target.value))}>
                    <option value={20}>C20/25</option>
                    <option value={25}>C25/30</option>
                    <option value={30}>C30/37</option>
                    <option value={35}>C35/45</option>
                    <option value={40}>C40/50</option>
                    <option value={50}>C50/60</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-main mb-2 block">Stahl fyk</label>
                  <select aria-label="Stahl fyk" className="w-full p-2 border rounded-md" value={fyk} onChange={(e) => setFyk(Number(e.target.value))}>
                    <option value={500}>B500 (500 MPa)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.einwirkungenKnicklänge} /></h3>
              <Slider 
                label={<FormulaText text={inhalt.werte.ersatzlängeL0} />} 
                value={l0} 
                min={1.0} max={10.0} step={0.1} 
                onChange={(e) => setL0(Number(e.target.value))} 
                unit="m" 
                info={inhalt.werte.knicklängeBzwErsatzlängeL0}
              />
              <div className="mt-4">
                <Slider label={<FormulaText text={inhalt.werte.druckkraftNEd} />} value={nEd} min={0} max={5000} step={50} onChange={(e) => setNEd(Number(e.target.value))} unit="kN" />
              </div>
              <div className="mt-4">
                <Slider label={<FormulaText text={inhalt.werte.biegemomentMEd} />} value={mEd} min={0} max={1000} step={10} onChange={(e) => setMEd(Number(e.target.value))} unit="kNm" />
              </div>

              <div className="mt-4 p-3 bg-white rounded-lg border border-home-grau/20 text-xs space-y-1.5 text-text-main/80">
                <div className="flex justify-between">
                  <span>Mindestausmitte <FormulaText text="e_0" />:</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.e0_mm, 1)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Imperfektion <FormulaText text="e_i" /> (l₀/400):</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.ei_mm, 1)} mm</span>
                </div>
                <div className="flex justify-between border-t border-home-grau/20 pt-1">
                  <span>Maßgebendes <FormulaText text="$M_{Ed} = \max(M_{0Ed} + N_{Ed}\,e_i;\; N_{Ed}\,e_0)$" />:</span>
                  <span className="font-mono font-bold text-shiraz">{formatDeZahl(results.mEd_1, 2)} kNm</span>
                </div>
                <div className="flex justify-between border-t border-home-grau/20 pt-1">
                  <span>Schlankheit <FormulaText text="\lambda" /> / <FormulaText text="\lambda_{lim}" />:</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.lambda, 1)} / {formatDeZahl(results.lambda_lim, 1)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <EingabeHinweise hinweise={results.hinweise.filter(x => x.feld !== 'theorie2')} />
            <div className={`p-6 rounded-xl border ${results.isPossible ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4"><MdText text={inhalt.texte.ergebnisNaDe} /></h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm opacity-80"><MdText text={inhalt.texte.bezogeneNormalkraft} /><FormulaText text="\nu_{Ed}" /></div>
                  <div className="text-xl font-bold">{formatDeZahl(results.nu_Ed, 3)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80"><MdText text={inhalt.texte.bezogenesMoment} /><FormulaText text="\mu_{Ed}" /><MdText text={inhalt.texte.inklEE} /></div>
                  <div className="text-xl font-bold">{formatDeZahl(results.mu_Ed, 3)}</div>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border text-center">
                <div className="text-sm font-bold uppercase mb-2"><MdText text={inhalt.texte.erfGesamtbewehrung} /><FormulaText text="A_{s,tot}" /></div>
                {results.isPossible ? (
                  <>
                    <div className="text-4xl font-bold text-shiraz">{formatDeZahl(results.as_final, 2)} cm²</div>
                    <div className="text-xs mt-2 opacity-70">
                      (Rechnerisch: {formatDeZahl(results.as_tot_req, 2)}<MdText text={inhalt.texte.cmMindestbewehrungNaDe} />{formatDeZahl(results.as_min, 2)} cm²)
                    </div>
                  </>
                ) : (
                  <div className="text-xl font-bold text-red-600"><MdText text={inhalt.texte.querschnittNichtAusreichend} /></div>
                )}
              </div>
            </div>

            <FormulaDerivationBox
              live
              title={inhalt.werte.ihrRechenwegStützenbemessungMit}
              zielGleichung={`A_{s,tot} = \\omega \\cdot b \\cdot h \\cdot \\frac{f_{cd}}{f_{yd}} = ${results.isPossible ? formatDeTeX(results.as_final, 2) : '\\text{–}'}\\,\\text{cm}^2`}
              normQuelle={inhalt.werte.dinEn19921}
              schritte={[
                {
                  titel: inhalt.werte.ausmittenUndMaßgebendesMoment,
                  erklaerung: inhalt.werte.imperfektionEIL,
                  formel: `M_{Ed} = \\max(${formatDeTeX(mEd, 0)} + ${formatDeTeX(nEd, 0)} \\cdot ${formatDeTeX(results.ei_mm / 1000, 4)};\\; ${formatDeTeX(nEd, 0)} \\cdot ${formatDeTeX(results.e0_mm / 1000, 3)}) = ${formatDeTeX(results.mEd_1, 2)}\\,\\text{kNm}`,
                },
                {
                  titel: 'Schlankheit',
                  erklaerung: results.isTheorie2Ordnung
                    ? inhalt.werte.limTheorieIiOrdnung
                    : inhalt.werte.limDieBemessungNach,
                  formel: `\\lambda = \\frac{l_0}{h/\\sqrt{12}} = \\frac{${formatDeTeX(l0, 2)}}{${formatDeTeX(h / 100, 2)}/\\sqrt{12}} = ${formatDeTeX(results.lambda, 1)} \\;${results.isTheorie2Ordnung ? '>' : '\\le'}\\; \\lambda_{lim} = ${formatDeTeX(results.lambda_lim, 1)}`,
                },
                {
                  titel: inhalt.werte.bezogeneSchnittgrößen,
                  erklaerung: `Mit f_cd = 0,85 · ${formatDeZahl(fck, 0)} / 1,5 = ${formatDeZahl((EC2_NA_DE.alphaCC * fck) / EC2_NA_DE.gammaC, 2)} N/mm²; Druck negativ.`,
                  formel: `\\nu_{Ed} = \\frac{-${formatDeTeX(nEd / 1000, 3)}}{${formatDeTeX(b / 100, 2)} \\cdot ${formatDeTeX(h / 100, 2)} \\cdot ${formatDeTeX((EC2_NA_DE.alphaCC * fck) / EC2_NA_DE.gammaC, 2)}} = ${formatDeTeX(results.nu_Ed, 3)};\\quad \\mu_{Ed} = \\frac{${formatDeTeX(results.mEd_1 / 1000, 4)}}{${formatDeTeX(b / 100, 2)} \\cdot ${formatDeTeX(h / 100, 2)}^2 \\cdot ${formatDeTeX((EC2_NA_DE.alphaCC * fck) / EC2_NA_DE.gammaC, 2)}} = ${formatDeTeX(results.mu_Ed, 3)}`,
                },
                {
                  titel: inhalt.werte.mechanischerBewehrungsgradAusDem,
                  erklaerung: results.isPossible
                    ? inhalt.werte.derRechnerSuchtIn
                    : inhalt.werte.auchMit25,
                  formel: results.isPossible
                    ? `\\omega = ${formatDeTeX(results.req_omega, 2)} \\;\\Rightarrow\\; A_{s,tot} = ${formatDeTeX(results.req_omega, 2)} \\cdot ${formatDeTeX(b, 0)} \\cdot ${formatDeTeX(h, 0)} \\cdot \\frac{${formatDeTeX((EC2_NA_DE.alphaCC * fck) / EC2_NA_DE.gammaC, 2)}}{${formatDeTeX(fyk / EC2_NA_DE.gammaS, 1)}} = ${formatDeTeX(results.as_tot_req, 2)}\\,\\text{cm}^2`
                    : '\\omega > 2{,}5',
                },
                {
                  titel: inhalt.werte.mindestbewehrungUndMaßgebenderWert,
                  erklaerung: inhalt.werte.mindestlängsbewehrungNachNaDe,
                  formel: `A_{s,min} = \\frac{0{,}15 \\cdot ${formatDeTeX(nEd * 1000, 0)}}{${formatDeTeX(fyk / EC2_NA_DE.gammaS, 1)}} \\cdot 10^{-2} = ${formatDeTeX(results.as_min, 2)}\\,\\text{cm}^2 \\;\\Rightarrow\\; A_{s,tot} = ${results.isPossible ? formatDeTeX(results.as_final, 2) : '\\text{–}'}\\,\\text{cm}^2`,
                },
              ]}
              ergebnisHinweis={results.isPossible ? `Erforderliche Gesamtbewehrung A_s,tot = ${formatDeZahl(results.as_final, 2)} cm²` : inhalt.werte.querschnittNichtAusreichend}
            />

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm h-[400px]">
              <h3 className="text-sm font-bold text-text-main mb-4"><MdText text={inhalt.texte.interaktionsdiagrammDehnungsiteration} /></h3>
              <div className="relative w-full h-[300px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
