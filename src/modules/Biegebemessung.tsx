import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { EC2_NA_DE } from '@/src/data/normParams';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Layers } from 'lucide-react';
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
import { Chart } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';

import { bemesseBiegung, MU_LIM_STAHL, MU_LIM_FRP } from '@/src/calc/biegung';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { NachErstemBild } from '@/src/components/ui/NachErstemBild';
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


export default function Biegebemessung() {
  const [b, setB] = useState(30); // Breite in cm
  const [h, setH] = useState(50); // Höhe in cm
  const [d1, setD1] = useState(5); // Randabstand Zug in cm
  const [d2, setD2] = useState(5); // Randabstand Druck in cm
  const [med, setMed] = useState(200); // Biegemoment in kNm
  const [fck, setFck] = useState(30); // Betonfestigkeit MPa (C30/37)
  
  const [bewehrungsArt, setBewehrungsArt] = useState<'Stahl' | 'Carbon' | 'GFK' | 'Basalt'>('Stahl');
  const [fyk, setFyk] = useState(500); // Stahlfestigkeit MPa (B500)
  const [ftk, setFtk] = useState(3000); // Zugfestigkeit nichtmetallisch MPa
  const [gammaFRP, setGammaFRP] = useState(1.3); // Teilsicherheitsbeiwert FRP

  const results = useMemo(
    () => bemesseBiegung({ b, h, d1, d2, med, fck, bewehrung: bewehrungsArt, fyk, ftk, gammaFRP }),
    [b, h, d1, d2, med, fck, bewehrungsArt, fyk, ftk, gammaFRP]
  );

  const chartData = useMemo(() => {
    const med_values: number[] = [];
    const as_values: (number | null)[] = [];
    for (let m = 20; m <= 600; m += 20) {
      med_values.push(m);
      const r = bemesseBiegung({ b, h, d1, d2, med: m, fck, bewehrung: bewehrungsArt, fyk, ftk, gammaFRP });
      as_values.push(r.isPossible ? r.as_final : null);
    }

    return {
      labels: med_values,
      datasets: [
        {
          label: 'Erforderliches As1 (cm²)',
          data: as_values,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(163, 17, 62, 0.1)',
          fill: true,
          tension: 0.1
        },
        {
          label: 'Mindestbewehrung As,min (NA DE)',
          data: med_values.map(() => results.as_min),
          borderColor: '#64748b',
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }
      ]
    };
  }, [b, h, d1, d2, fck, fyk, bewehrungsArt, ftk, gammaFRP, results.as_min]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { title: { display: true, text: 'Erf. As (cm²)', font: { family: 'Work Sans', weight: 'bold' as const } } },
      x: { title: { display: true, text: 'Biegemoment M_Ed (kNm)', font: { family: 'Work Sans', weight: 'bold' as const } } }
    },
    plugins: { legend: { display: true, position: 'top' as const } }
  };

  const svgWidth = 300;
  const svgHeight = 250;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const drawWidth = svgWidth - margin.left - margin.right;
  const drawHeight = svgHeight - margin.top - margin.bottom;
  
  const scale = Math.min(drawWidth / Math.max(b, 20), drawHeight / Math.max(h, 20));
  const rectW = b * scale;
  const rectH = h * scale;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" />
            Biegebemessung (Massivbau)
            <InfoTooltip text="Biegebemessung für Rechteckquerschnitte nach DIN EN 1992-1-1 mit NA DE." />
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300">
            Berechnet nach DIN EN 1992-1-1 + NA (DE)
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
          <p>
            Die Biegebemessung ermittelt die erforderliche Längsbewehrung (<FormulaText text="A_s" />) für ein gegebenes Biegemoment (<FormulaText text="M_{Ed}" />). Die Mindestbewehrung wird in Deutschland (NA DE) als Robustheitsbewehrung zur Aufnahme des Rissmoments berechnet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Spalten unterhalb des Bildausschnitts erst nach dem ersten Bild (Ladezeit, AP 5.5) */}
          <NachErstemBild minHoehe="30rem">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Querschnitt &amp; Einwirkung</h3>
              <div className="grid grid-cols-1 gap-4">
                <Slider info="Breite des Bauteils." label={<FormulaText text="Breite b" />} min={10} max={100} step={5} value={b} unit="cm" onChange={(e) => setB(Number(e.target.value))} />
                <Slider label={<FormulaText text="Höhe h" />} min={20} max={150} step={5} value={h} unit="cm" onChange={(e) => setH(Number(e.target.value))} />
                <Slider info="Abstand vom Rand zur Zugbewehrung." label={<FormulaText text="Randabstand d_1 (Zug)" />} min={2} max={10} step={0.5} value={d1} unit="cm" onChange={(e) => setD1(Number(e.target.value))} />
                <Slider info="Abstand vom Rand zur Druckbewehrung." label={<FormulaText text="Randabstand d_2 (Druck)" />} min={2} max={10} step={0.5} value={d2} unit="cm" onChange={(e) => setD2(Number(e.target.value))} />
                
                <div className="mt-4 pt-4 border-t border-home-grau/30">
                  <Slider label={<FormulaText text="Biegemoment M_{Ed}" />} min={10} max={1000} step={10} value={med} unit="kNm" onChange={(e) => setMed(Number(e.target.value))} />
                </div>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Materialien</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2"><label className="text-xs text-home-grau block"><FormulaText text="Betonfestigkeit f_{ck}" /></label><InfoTooltip text="Charakteristische Druckfestigkeit des Betons." /></div>
                  <select
                    value={fck}
                    onChange={(e) => setFck(Number(e.target.value))}
                    className="w-full p-2 border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-shiraz focus:border-shiraz outline-none text-sm bg-white"
                  >
                    <option value={20}>C20/25</option>
                    <option value={25}>C25/30</option>
                    <option value={30}>C30/37</option>
                    <option value={35}>C35/45</option>
                    <option value={40}>C40/50</option>
                    <option value={50}>C50/60</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2"><label className="text-xs text-home-grau block">Bewehrungsart</label><InfoTooltip text="Art der verwendeten Bewehrung (z.B. Betonstahl, Carbon)." /></div>
                  <select aria-label="Bewehrungsart"
                    value={bewehrungsArt}
                    onChange={(e) => setBewehrungsArt(e.target.value as 'Stahl' | 'Carbon' | 'GFK' | 'Basalt')}
                    className="w-full p-2 border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-shiraz focus:border-shiraz outline-none text-sm bg-white"
                  >
                    <option value="Stahl">Betonstahl (B500)</option>
                    <option value="Carbon">Carbon (CFK)</option>
                    <option value="GFK">Glasfaser (GFK)</option>
                    <option value="Basalt">Basalt (BFK)</option>
                  </select>
                </div>

                {bewehrungsArt === 'Stahl' ? (
                  <div>
                    <label className="text-xs text-home-grau block mb-2"><FormulaText text="Stahlfestigkeit f_{yk}" /></label>
                    <select
                      value={fyk}
                      onChange={(e) => setFyk(Number(e.target.value))}
                      className="w-full p-2 border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-shiraz focus:border-shiraz outline-none text-sm bg-white"
                    >
                      <option value={500}>B500 (500 MPa)</option>
                    </select>
                  </div>
                ) : (
                  <>
                    <Slider label="Zugfestigkeit ftk" info="Charakteristische Zugfestigkeit des Materials." min={500} max={4000} step={100} value={ftk} unit="MPa" onChange={(e) => setFtk(Number(e.target.value))} />
                    <Slider label="Teilsicherheitsbeiwert γFRP" min={1.0} max={2.0} step={0.05} value={gammaFRP} unit="-" onChange={(e) => setGammaFRP(Number(e.target.value))} />
                    <p className="text-[11px] text-text-main/60 leading-relaxed">
                      Lehrannahme: Nichtmetallische Bewehrung ist nicht in EC2 geregelt. Maßgebend sind die DAfStb-Richtlinie
                      „Betonbauteile mit nichtmetallischer Bewehrung“ (2024-01) bzw. die jeweilige Zulassung; γ und μ_lim = 0,25 sind hier vereinfacht.
                    </p>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col h-[300px]">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-2">Erf. As über Biegemoment</h3>
              <div className="flex-1 relative w-full h-full">
                <Chart type="line" data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
          </NachErstemBild>

          <NachErstemBild minHoehe="40rem">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <EingabeHinweise hinweise={results.hinweise} />
            <div className={`${results.isPossible ? 'bg-shiraz/5 border-shiraz/20' : 'bg-red-100 border-red-300'} p-6 rounded-xl border flex flex-col justify-center`}>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 ${results.isPossible ? 'text-shiraz' : 'text-red-700'}`}>
                Bemessungsergebnis (NA DE)
              </h3>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-home-grau text-sm mb-1">Bezogenes Moment (<FormulaText text="\mu_{Ed}" />)</div>
                  <div className={`text-3xl font-bold ${results.isPossible ? 'text-text-main' : 'text-red-600'}`}>
                    {formatDeZahl(results.mu_Ed, 3)}
                  </div>
                  <div className="text-xs text-home-grau mt-1">Grenzwert: {formatDeZahl(bewehrungsArt === 'Stahl' ? MU_LIM_STAHL : MU_LIM_FRP, 3)}{bewehrungsArt === 'Stahl' && <> (ξ<sub>lim</sub> = 0,45)</>}</div>
                </div>
                
                <div>
                  <div className="text-home-grau text-sm mb-1">Mech. Bewehrungsgrad (<FormulaText text="\omega" />)</div>
                  <div className="text-3xl font-bold text-text-main">
                    {results.isPossible ? formatDeZahl(results.omega, 3) : '-'}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-home-grau/30 shadow-sm text-center">
                <div className="text-home-grau text-sm font-bold uppercase mb-2">Maßgebende Zugbewehrung (<FormulaText text="A_{s1}" />)</div>
                {results.isPossible ? (
                  <>
                    <div className="text-5xl font-bold text-shiraz">{formatDeZahl(results.as_final, 2)} <span className="text-xl font-normal">cm²</span></div>
                    <div className="text-xs text-home-grau mt-2 flex items-center justify-center gap-1">
                      <span>Rechnerisch <FormulaText text="A_{s1}" />: {formatDeZahl(results.as1_req, 2)} cm² | Min. <FormulaText text="A_{s,min}" />: {formatDeZahl(results.as_min, 2)} cm²</span>
                      <InfoTooltip text={`Mindestbewehrung nach DIN EN 1992-1-1/NA als Robustheitsbewehrung: As,min = Mcr / (fyk * z) = ${formatDeZahl(results.as_min, 2)} cm² mit Mcr = ${formatDeZahl(results.mcr_kNm, 2)} kNm. Die Formel 0,26 * (fctm/fyk) * b * d (${formatDeZahl(results.as_min_ec, 2)} cm²) ist eine EC-Empfehlung (nicht DE).`} />
                    </div>
                  </>
                ) : (
                  <div className="text-xl font-bold text-red-600">{results.message}</div>
                )}
              </div>

              {results.as2_req > 0 && (
                <div className="p-6 bg-white rounded-xl border border-home-grau/30 shadow-sm text-center mt-4">
                  <div className="text-home-grau text-sm font-bold uppercase mb-2">Erforderliche Druckbewehrung (<FormulaText text="A_{s2}" />)</div>
                  <div className="text-4xl font-bold text-slate-700">{formatDeZahl(results.as2_req, 2)} <span className="text-xl font-normal">cm²</span></div>
                  <div className="text-xs text-home-grau mt-2">
                    {results.message}
                  </div>
                </div>
              )}

              <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-home-grau">
                <div>Statische Nutzhöhe <FormulaText text="d" />: {formatDeWert(results.d)} cm</div>
                <div>Rissmoment <FormulaText text="M_{cr}" />: {formatDeZahl(results.mcr_kNm, 2)} kNm</div>
                <div>Bemessungswert Beton <FormulaText text="f_{cd}" />: {formatDeZahl(results.fcd, 1)} MPa</div>
                <div>Bemessungswert Stahl <FormulaText text="f_{yd}" />: {formatDeZahl(results.fyd, 1)} MPa</div>
                {results.isPossible && <div>Druckzonenhöhe <FormulaText text="x" />: {formatDeZahl(results.x, 1)} cm</div>}
              </div>
            </div>

            <FormulaDerivationBox
              live
              title="Ihr Rechenweg: Biegebemessung mit den aktuellen Eingaben"
              zielGleichung={`A_{s1} = \\omega \\cdot b \\cdot d \\cdot \\frac{f_{cd}}{f_{yd}} = ${results.isPossible ? formatDeTeX(results.as_final, 2) : '\\text{–}'}\\,\\text{cm}^2`}
              normQuelle="DIN EN 1992-1-1 mit NA (DE), 3.1.7 und 6.1"
              schritte={[
                {
                  titel: 'Bemessungswerte der Baustoffe',
                  erklaerung: bewehrungsArt === 'Stahl'
                    ? 'Beton mit α_cc = 0,85 und γ_c = 1,5, Betonstahl mit γ_s = 1,15.'
                    : 'Beton mit α_cc = 0,85 und γ_c = 1,5; nichtmetallische Bewehrung mit dem gewählten Teilsicherheitsbeiwert γ_FRP.',
                  formel: bewehrungsArt === 'Stahl'
                    ? `f_{cd} = \\frac{${formatDeTeX(EC2_NA_DE.alphaCC, 2)} \\cdot ${formatDeTeX(fck, 0)}}{${formatDeTeX(EC2_NA_DE.gammaC, 1)}} = ${formatDeTeX(results.fcd, 1)}\\,\\text{N/mm}^2;\\quad f_{yd} = \\frac{${formatDeTeX(fyk, 0)}}{${formatDeTeX(EC2_NA_DE.gammaS, 2)}} = ${formatDeTeX(results.fyd, 1)}\\,\\text{N/mm}^2`
                    : `f_{cd} = \\frac{${formatDeTeX(EC2_NA_DE.alphaCC, 2)} \\cdot ${formatDeTeX(fck, 0)}}{${formatDeTeX(EC2_NA_DE.gammaC, 1)}} = ${formatDeTeX(results.fcd, 1)}\\,\\text{N/mm}^2;\\quad f_{fd} = \\frac{${formatDeTeX(ftk, 0)}}{${formatDeTeX(gammaFRP, 2)}} = ${formatDeTeX(results.fyd, 1)}\\,\\text{N/mm}^2`,
                },
                {
                  titel: 'Statische Nutzhöhe',
                  erklaerung: 'Abstand vom gedrückten Rand bis zur Achse der Zugbewehrung.',
                  formel: `d = h - d_1 = ${formatDeTeX(h, 1)} - ${formatDeTeX(d1, 1)} = ${formatDeTeX(results.d, 1)}\\,\\text{cm}`,
                },
                {
                  titel: 'Bezogenes Moment',
                  erklaerung: results.mu_Ed > (bewehrungsArt === 'Stahl' ? MU_LIM_STAHL : MU_LIM_FRP)
                    ? (bewehrungsArt === 'Stahl'
                      ? 'Der Grenzwert ist überschritten: Der Querschnitt wird mit μ_lim bemessen, das Restmoment übernimmt eine Druckbewehrung A_s2.'
                      : 'Der Grenzwert ist überschritten: Die Druckzone versagt, der Querschnitt muss vergrößert werden.')
                    : 'Der Grenzwert ist eingehalten, eine Druckbewehrung ist nicht erforderlich.',
                  formel: `\\mu_{Eds} = \\frac{M_{Ed}}{b \\cdot d^2 \\cdot f_{cd}} = \\frac{${formatDeTeX(med / 1000, 3)}}{${formatDeTeX(b / 100, 2)} \\cdot ${formatDeTeX(results.d / 100, 3)}^2 \\cdot ${formatDeTeX(results.fcd, 1)}} = ${formatDeTeX(results.mu_Ed, 3)} \\;${results.mu_Ed > (bewehrungsArt === 'Stahl' ? MU_LIM_STAHL : MU_LIM_FRP) ? '>' : '\\le'}\\; \\mu_{lim} = ${formatDeTeX(bewehrungsArt === 'Stahl' ? MU_LIM_STAHL : MU_LIM_FRP, 3)}`,
                },
                {
                  titel: 'Mechanischer Bewehrungsgrad und Druckzone',
                  erklaerung: 'Rechteckiger Spannungsblock mit λ = 0,8; die Druckzonenhöhe folgt aus x = ω · d / λ.',
                  formel: results.isPossible
                    ? `\\omega = 1 - \\sqrt{1 - 2 \\cdot ${formatDeTeX(Math.min(results.mu_Ed, bewehrungsArt === 'Stahl' ? MU_LIM_STAHL : MU_LIM_FRP), 3)}} = ${formatDeTeX(results.omega, 3)};\\quad x = \\frac{${formatDeTeX(results.omega, 3)} \\cdot ${formatDeTeX(results.d, 1)}}{0{,}8} = ${formatDeTeX(results.x, 1)}\\,\\text{cm}`
                    : `\\text{${results.message}}`,
                },
                {
                  titel: 'Erforderliche Zugbewehrung',
                  erklaerung: results.as2_req > 0
                    ? `Anteil aus dem Grenzmoment plus Anteil der Druckbewehrung (A_s2 = ${formatDeZahl(results.as2_req, 2)} cm², σ_s2 = ${formatDeZahl(results.sigma_s2, 0)} N/mm²).`
                    : bewehrungsArt === 'Stahl'
                      ? 'Die Bewehrung fließt; Bemessung mit f_yd.'
                      : 'Nichtmetallische Bewehrung: Bemessung mit der Spannung σ_f aus dem ebenen Dehnungszustand (höchstens f_fd).',
                  formel: !results.isPossible
                    ? '\\text{nicht bemessbar}'
                    : results.as2_req > 0
                      ? `A_{s1} = ${formatDeTeX(results.omega, 3)} \\cdot ${formatDeTeX(b, 0)} \\cdot ${formatDeTeX(results.d, 1)} \\cdot \\frac{${formatDeTeX(results.fcd, 1)}}{${formatDeTeX(results.fyd, 1)}} + ${formatDeTeX(results.as2_req, 2)} \\cdot \\frac{${formatDeTeX(results.sigma_s2, 0)}}{${formatDeTeX(results.fyd, 1)}} = ${formatDeTeX(results.as1_req, 2)}\\,\\text{cm}^2`
                      : bewehrungsArt === 'Stahl'
                        ? `A_{s1} = ${formatDeTeX(results.omega, 3)} \\cdot ${formatDeTeX(b, 0)} \\cdot ${formatDeTeX(results.d, 1)} \\cdot \\frac{${formatDeTeX(results.fcd, 1)}}{${formatDeTeX(results.fyd, 1)}} = ${formatDeTeX(results.as1_req, 2)}\\,\\text{cm}^2`
                        : `A_{s1} = \\omega \\cdot b \\cdot d \\cdot \\frac{f_{cd}}{\\sigma_f} = ${formatDeTeX(results.as1_req, 2)}\\,\\text{cm}^2 \\quad (\\sigma_f = ${formatDeTeX(results.as1_req > 0 ? results.omega * b * results.d * results.fcd / results.as1_req : NaN, 0)}\\,\\text{N/mm}^2)`,
                },
                {
                  titel: 'Mindestbewehrung und maßgebender Wert',
                  erklaerung: 'Robustheitsbewehrung nach NA (DE): A_s,min = M_cr / (f_yk · z) mit z = 0,9 d; maßgebend ist der größere Wert.',
                  formel: results.isPossible
                    ? `M_{cr} = ${formatDeTeX(results.mcr_kNm, 2)}\\,\\text{kNm},\\; A_{s,min} = ${formatDeTeX(results.as_min, 2)}\\,\\text{cm}^2 \\;\\Rightarrow\\; A_{s1} = \\max(${formatDeTeX(results.as1_req, 2)};\\, ${formatDeTeX(results.as_min, 2)}) = ${formatDeTeX(results.as_final, 2)}\\,\\text{cm}^2`
                    : `M_{cr} = ${formatDeTeX(results.mcr_kNm, 2)}\\,\\text{kNm},\\; A_{s,min} = ${formatDeTeX(results.as_min, 2)}\\,\\text{cm}^2`,
                },
              ]}
              ergebnisHinweis={results.isPossible ? `Maßgebende Zugbewehrung A_s1 = ${formatDeZahl(results.as_final, 2)} cm²` : results.message}
            />

            {/* Interaktives Schnittgrößenmodell */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Interaktives Schnittgrößenmodell (ULS)</h3>
              <div className="w-full overflow-x-auto bg-off-white rounded-lg border border-home-grau/30">
                <svg width="550" height="320" className="mx-auto block">
                  <defs>
                    <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                    <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                    </marker>
                  </defs>

                  <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <text x={rectW / 2} y="-15" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Querschnitt</text>
                    <rect x="0" y="0" width={rectW} height={rectH} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                    
                    {results.isPossible && results.x > 0 && (
                      <rect x="0" y="0" width={rectW} height={results.x * scale} fill="#f7ced6" opacity="0.5" />
                    )}

                    <circle cx={rectW / 4} cy={results.d * scale} r="4" fill="#A3113E" />
                    <circle cx={rectW / 2} cy={results.d * scale} r="4" fill="#A3113E" />
                    <circle cx={(3 * rectW) / 4} cy={results.d * scale} r="4" fill="#A3113E" />

                    {results.as2_req > 0 && (
                      <>
                        <circle cx={rectW / 4} cy={d2 * scale} r="4" fill="#334155" />
                        <circle cx={(3 * rectW) / 4} cy={d2 * scale} r="4" fill="#334155" />
                      </>
                    )}

                    <line x1="0" y1="-5" x2={rectW} y2="-5" stroke="#475569" strokeWidth="1" />
                    <text x={rectW / 2} y="-8" fontSize="10" fill="#475569" textAnchor="middle">b</text>

                    <line x1="-10" y1="0" x2="-10" y2={rectH} stroke="#475569" strokeWidth="1" />
                    <text x="-15" y={rectH / 2} fontSize="10" fill="#475569" textAnchor="end" dominantBaseline="middle">h</text>
                  </g>

                  {/* Dehnungsverteilung */}
                  {(() => {
                    const strainX = margin.left + rectW + 100;
                    const epsPxMax = 60; 
                    let epsTopPx = epsPxMax;
                    let epsBotPx = 0;
                    if (results.isPossible && results.x > 0) {
                      epsBotPx = epsTopPx * ((results.d - results.x) / results.x);
                      if (epsBotPx > 100) {
                        epsTopPx = epsTopPx * (100 / epsBotPx);
                        epsBotPx = 100;
                      }
                    }

                    return (
                      <g transform={`translate(${strainX}, ${margin.top})`}>
                        <text x="0" y="-15" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Dehnungen</text>
                        <line x1="-80" y1="0" x2="60" y2="0" stroke="#cbd5e1" strokeDasharray="2 2" />
                        <line x1="-80" y1={results.d * scale} x2="60" y2={results.d * scale} stroke="#cbd5e1" strokeDasharray="2 2" />
                        <line x1="0" y1="0" x2="0" y2={rectH} stroke="#94a3b8" strokeDasharray="4 4" />
                        
                        {results.isPossible && results.x > 0 && (
                          <>
                            <line x1={-epsTopPx} y1="0" x2={epsBotPx} y2={results.d * scale} stroke="#1e293b" strokeWidth="2" />
                            <line x1={-epsTopPx} y1="0" x2="0" y2="0" stroke="#475569" strokeWidth="2" markerStart="url(#arrow-blue)" />
                            <text x={-epsTopPx - 5} y="-5" fontSize="10" fill="#475569" textAnchor="end">ε_c</text>
                            <line x1="0" y1={results.d * scale} x2={epsBotPx} y2={results.d * scale} stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                            <text x={epsBotPx + 5} y={results.d * scale + 10} fontSize="10" fill="#A3113E" textAnchor="start">ε_s1</text>
                            <line x1="-80" y1={results.x * scale} x2="160" y2={results.x * scale} stroke="#1e293b" strokeDasharray="5 5" />
                            <text x="160" y={results.x * scale - 5} fontSize="10" fill="#1e293b" textAnchor="end">Nulllinie (x)</text>
                          </>
                        )}
                      </g>
                    );
                  })()}

                  {/* Spannungsverteilung */}
                  {(() => {
                    const stressX = margin.left + rectW + 280;
                    const stressW = 50;

                    return (
                      <g transform={`translate(${stressX}, ${margin.top})`}>
                        <text x="0" y="-15" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Spannungen</text>
                        <line x1="0" y1="0" x2="0" y2={rectH} stroke="#94a3b8" strokeDasharray="4 4" />
                        
                        {results.isPossible && results.x > 0 && (
                          <>
                            <rect x={-stressW} y="0" width={stressW} height={0.8 * results.x * scale} fill="#475569" opacity="0.2" stroke="#475569" />
                            <line x1={-stressW} y1={0.8 * results.x * scale} x2="0" y2={0.8 * results.x * scale} stroke="#475569" strokeWidth="2" />
                            <line x1={-stressW} y1="0" x2={-stressW} y2={0.8 * results.x * scale} stroke="#475569" strokeWidth="2" />
                            <line x1={-stressW} y1={0.4 * results.x * scale} x2="0" y2={0.4 * results.x * scale} stroke="#475569" strokeWidth="2" markerStart="url(#arrow-blue)" />
                            <text x={-stressW - 5} y={0.4 * results.x * scale + 3} fontSize="10" fill="#475569" textAnchor="end">F_cd</text>
                            <line x1="0" y1={results.d * scale} x2={stressW} y2={results.d * scale} stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                            <text x={stressW + 5} y={results.d * scale + 3} fontSize="10" fill="#A3113E" textAnchor="start">F_sd</text>
                            <line x1={stressW + 30} y1={0.4 * results.x * scale} x2={stressW + 30} y2={results.d * scale} stroke="#1e293b" strokeWidth="1" />
                            <line x1={stressW + 25} y1={0.4 * results.x * scale} x2={stressW + 35} y2={0.4 * results.x * scale} stroke="#1e293b" strokeWidth="1" />
                            <line x1={stressW + 25} y1={results.d * scale} x2={stressW + 35} y2={results.d * scale} stroke="#1e293b" strokeWidth="1" />
                            <text x={stressW + 35} y={(0.4 * results.x * scale + results.d * scale) / 2} fontSize="10" fill="#1e293b" dominantBaseline="middle">z</text>
                          </>
                        )}
                      </g>
                    );
                  })()}
                </svg>
                <div className="p-4 text-xs text-text-main/70 border-t border-home-grau/30">
                  Diese Darstellung ist <strong>maßstäblich in Bezug auf die Profilhöhe h</strong>. Der Betondruckblock wird vereinfacht als Rechteck (<FormulaText text="0{,}8 \cdot x" />) mit der Bemessungsspannung <FormulaText text="f_{cd}" /> angenommen.
                </div>
              </div>
            </div>
          </div>
          </NachErstemBild>
        </div>
      </div>
      
      <NachErstemBild minHoehe="14rem">
      <FormulaDerivationBox
        title="Anwendungsbeispiel: Biegebemessung Rechteckquerschnitt (Standardwerte)"
        zielGleichung="A_{s1} = \omega \cdot b \cdot d \cdot \frac{f_{cd}}{f_{yd}}, \quad \omega = 1 - \sqrt{1 - 2\mu_{Eds}}"
        normQuelle="DIN EN 1992-1-1 mit NA, 3.1.7 (Spannungsblock) und 6.1"
        schritte={[
          { titel: '1. Gegeben', formel: 'b/h = 30/50\\,\\text{cm},\\; d = 45\\,\\text{cm},\\; M_{Ed} = 200\\,\\text{kNm},\\; \\text{C30/37, B500}', erklaerung: 'Rechteckquerschnitt ohne Normalkraft.' },
          { titel: '2. Bemessungswerte', formel: 'f_{cd} = 0{,}85 \\cdot 30/1{,}5 = 17{,}0\\,\\text{N/mm}^2;\\; f_{yd} = 500/1{,}15 = 435\\,\\text{N/mm}^2', erklaerung: 'α_cc = 0,85 nach NA.' },
          { titel: '3. Bezogenes Moment', formel: '\\mu_{Eds} = \\frac{0{,}200}{0{,}30 \\cdot 0{,}45^2 \\cdot 17{,}0} = 0{,}194 < 0{,}296', erklaerung: 'Keine Druckbewehrung erforderlich.' },
          { titel: '4. Mechanischer Bewehrungsgrad', formel: '\\omega = 1 - \\sqrt{1 - 2 \\cdot 0{,}194} = 0{,}217;\\; \\zeta = 1 - \\omega/2 = 0{,}891', erklaerung: 'Rechteckiger Spannungsblock (λ = 0,8).' },
          { titel: '5. Bewehrung', formel: 'A_{s1} = 0{,}217 \\cdot 30 \\cdot 45 \\cdot \\frac{17{,}0}{435} = 11{,}5\\,\\text{cm}^2 \\;>\\; A_{s,min} = 1{,}8\\,\\text{cm}^2', erklaerung: 'A_s,min aus dem Rissmoment (f_ctm = 2,9 N/mm², z = 0,9d).' },
        ]}
        ergebnisHinweis="A_s1 ≈ 11,5 cm², z. B. 6 Ø 16 (12,1 cm²)."
      />
      </NachErstemBild>

      <CalculatorDisclaimerBanner className="my-2" />
    </div>
  );
}
