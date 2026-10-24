import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { bemesseStuetze } from '@/src/calc/stuetze';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
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
  const [l0, setL0] = useState(3.0); // m (Ersatzlänge nach DIN EN 1992-1-1)
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
      ...results.interactionCurves.map((curve: any, index: number) => ({
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
        label: 'Einwirkung (μ_Ed, ν_Ed)',
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
        title: { display: true, text: 'Bezogenes Moment μ_Ed' },
        min: 0,
        max: Math.max(0.6, Math.ceil(results.mu_Ed * 1.2 * 10) / 10)
      },
      y: {
        type: 'linear' as const,
        title: { display: true, text: 'Bezogene Normalkraft ν_Ed (Druck negativ)' },
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
            <Layers className="text-shiraz" />
            Stützenbemessung (Interaktionsdiagramm)
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300">
            Berechnet nach DIN EN 1992-1-1 + NA (DE)
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Bemessung von Massivbaustützen (Stahlbeton) unter Normalkraft und Biegemoment. Das Modul berechnet die erforderliche 
            symmetrische Längsbewehrung (<FormulaText text="A_{s,tot}" />) unter Berücksichtigung von Mindestausmitte, 
            Imperfektionen und Schlankheitskontrolle nach DIN EN 1992-1-1 mit NA DE.
          </p>
        </div>

        {results.isTheorie2Ordnung && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <div className="font-bold text-amber-800 text-sm">
                Theorie II. Ordnung erforderlich – nicht Teil dieses Lehrrechners
              </div>
              <div className="text-xs text-amber-700 mt-1">
                Die Schlankheit der Stütze beträgt <FormulaText text={`\\lambda = ${formatDeTeX(results.lambda, 1)}`} /> und überschreitet die Grenzschlankheit <FormulaText text={`\\lambda_{lim} = ${formatDeTeX(results.lambda_lim, 1)}`} /> nach DIN EN 1992-1-1, Abs. 5.8.3.1. Schnittgrößen nach Theorie II. Ordnung müssen nachgewiesen werden.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Querschnitt &amp; Material</h3>
              <div className="grid grid-cols-2 gap-4">
                <Slider label="Breite b" value={b} min={15} max={100} step={5} onChange={(e) => setB(Number(e.target.value))} unit="cm" />
                <Slider label="Höhe h" value={h} min={15} max={100} step={5} onChange={(e) => setH(Number(e.target.value))} unit="cm" />
              </div>
              <div className="mt-4">
                <Slider label="Randabstand d1" value={d1} min={2} max={10} step={0.5} onChange={(e) => setD1(Number(e.target.value))} unit="cm" />
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
              <h3 className="font-semibold mb-4 text-text-main">Einwirkungen &amp; Knicklänge</h3>
              <Slider 
                label={<FormulaText text="Ersatzlänge l_0" />} 
                value={l0} 
                min={1.0} max={10.0} step={0.1} 
                onChange={(e) => setL0(Number(e.target.value))} 
                unit="m" 
                info="Knicklänge bzw. Ersatzlänge l0 nach DIN EN 1992-1-1."
              />
              <div className="mt-4">
                <Slider label={<FormulaText text="Druckkraft N_{Ed}" />} value={nEd} min={0} max={5000} step={50} onChange={(e) => setNEd(Number(e.target.value))} unit="kN" />
              </div>
              <div className="mt-4">
                <Slider label={<FormulaText text="Biegemoment M_{Ed}" />} value={mEd} min={0} max={1000} step={10} onChange={(e) => setMEd(Number(e.target.value))} unit="kNm" />
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
                  <span>Maßgebendes <FormulaText text="M_{Ed} = \max(M_{0Ed} + N_{Ed} e_i;\; N_{Ed} e_0)" />:</span>
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
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Ergebnis (NA DE)</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm opacity-80">Bezogene Normalkraft <FormulaText text="\nu_{Ed}" /></div>
                  <div className="text-xl font-bold">{formatDeZahl(results.nu_Ed, 3)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Bezogenes Moment <FormulaText text="\mu_{Ed}" /> (inkl. e₀, eᵢ)</div>
                  <div className="text-xl font-bold">{formatDeZahl(results.mu_Ed, 3)}</div>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border text-center">
                <div className="text-sm font-bold uppercase mb-2">Erf. Gesamtbewehrung <FormulaText text="A_{s,tot}" /></div>
                {results.isPossible ? (
                  <>
                    <div className="text-4xl font-bold text-shiraz">{formatDeZahl(results.as_final, 2)} cm²</div>
                    <div className="text-xs mt-2 opacity-70">
                      (Rechnerisch: {formatDeZahl(results.as_tot_req, 2)} cm² | Mindestbewehrung NA DE: {formatDeZahl(results.as_min, 2)} cm²)
                    </div>
                  </>
                ) : (
                  <div className="text-xl font-bold text-red-600">Querschnitt nicht ausreichend!</div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm h-[400px]">
              <h3 className="text-sm font-bold text-text-main mb-4">Interaktionsdiagramm (Dehnungsiteration)</h3>
              <div className="relative w-full h-[300px]">
                <Line data={chartData as any} options={chartOptions as any} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
