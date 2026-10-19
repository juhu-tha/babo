import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { EC2_NA_DE } from '@/src/data/normParams';
import { AlertTriangle, Layers } from 'lucide-react';
import { Line } from 'react-chartjs-2';
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

  const results = useMemo(() => {
    // Umrechnung in m
    const b_m = b / 100;
    const h_m = h / 100;
    const d1_m = d1 / 100;
    
    // Materialkennwerte aus zentraler Registry
    const fcd = (EC2_NA_DE.alphaCC * fck) / EC2_NA_DE.gammaC; // MPa
    const fyd = fyk / EC2_NA_DE.gammaS; // MPa
    
    // Mindestausmitte e0 und Imperfektion ei nach NA DE
    const e0_m = EC2_NA_DE.e0Min_mm(h * 10) / 1000; // max(h/30; 20 mm) in m
    const ei_m = l0 / 400; // in m
    
    // Bemessungsmoment nach Theorie I. Ordnung inkl. Imperfektionen
    const mEd_1 = Math.max(mEd, nEd * e0_m) + nEd * ei_m; // in kNm

    // Schlankheit lambda = l0 / i
    const i_radius = h_m / Math.sqrt(12); // m
    const lambda = l0 / i_radius;

    // Bezogene Schnittgrößen
    const nu_Ed = (-nEd / 1000) / (b_m * h_m * fcd); // Druck ist negativ
    const mu_Ed = Math.abs((mEd_1 / 1000) / (b_m * h_m * h_m * fcd));

    // Grenzschlankheit lambda_lim nach DIN EN 1992-1-1, 5.8.3.1
    const n = Math.abs(nu_Ed);
    const lambda_lim = n > 0 ? (20 * 0.7 * 1.1 * 0.7) / Math.sqrt(n) : 100;
    const isTheorie2Ordnung = lambda > lambda_lim;

    // EC2 Dehnungsiteration für Interaktionsdiagramm
    const generateInteractionData = (omega: number) => {
      const points = [];
      const d = h_m - d1_m;
      
      // 1. Reiner Zug
      points.push({ x: 0, y: omega });

      // Verteilung der Dehnung an der Druckseite
      const eps_top_calc = (xi: number) => {
        if (xi <= 1.0) return -3.5;
        return (-2.0 * xi) / (xi - 3 / 7);
      };

      // 2. Biegung mit Längskraft (xi = x/h variiert)
      const num_points = 100;
      for (let i = 0; i <= num_points; i++) {
        const xi = 0.001 * Math.pow(100000, i / num_points);
        const eps_top = eps_top_calc(xi);
        
        const eps_s1 = eps_top * ((xi - (d / h_m)) / xi);
        const eps_s2 = eps_top * ((xi - (d1_m / h_m)) / xi);
        
        const sig_s1 = Math.max(-fyd, Math.min(fyd, (eps_s1 / 1000) * 200000));
        const sig_s2 = Math.max(-fyd, Math.min(fyd, (eps_s2 / 1000) * 200000));
        
        let y = 0.8 * xi * h_m;
        if (y > h_m) y = h_m;
        
        const Fc = -y * b_m * fcd;
        const zc = h_m / 2 - y / 2;
        const Mc = Fc < 0 ? -Fc * zc : 0; 
        
        const As1 = 0.5 * omega * b_m * h_m * (fcd / fyd);
        const As2 = As1;
        
        const Fs1 = As1 * sig_s1;
        const Fs2 = As2 * sig_s2;
        
        const N = Fc + Fs1 + Fs2;
        const Ms = Fs1 * (h_m / 2 - d1_m) - Fs2 * (h_m / 2 - d1_m);
        const M = Mc + Ms;
        
        const nu = N / (b_m * h_m * fcd);
        const mu = Math.abs(M / (b_m * h_m * h_m * fcd));
        
        points.push({ x: mu, y: nu });
      }
      
      // 3. Reiner Druck
      const eps_c = -2.0; // Promille
      const sig_s = Math.max(-fyd, Math.min(fyd, (eps_c / 1000) * 200000));
      const N_comp = -b_m * h_m * fcd + omega * b_m * h_m * (fcd / fyd) * sig_s;
      const nu_comp = N_comp / (b_m * h_m * fcd);
      points.push({ x: 0, y: nu_comp });

      return { omega, points, nu_comp };
    };

    // Diagrammlinien für Visualisierung
    const omegaValues = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.5, 2.0];
    const interactionCurves: Array<{ omega: number; points: { x: number; y: number }[]; nu_comp: number; isRequired?: boolean }> = omegaValues.map(generateInteractionData);

    // Finde erforderliches omega durch iteratives Annähern
    let req_omega = 0;
    let isPossible = false;
    
    for (let o = 0; o <= 2.5; o += 0.01) {
      const { points, nu_comp } = generateInteractionData(o);
      
      let inside = false;
      if (nu_Ed <= o && nu_Ed >= nu_comp) {
        let mu_max = -1;
        for (let k = 0; k < points.length - 1; k++) {
          const p1 = points[k];
          const p2 = points[k + 1];
          if ((nu_Ed <= p1.y && nu_Ed >= p2.y) || (nu_Ed >= p1.y && nu_Ed <= p2.y)) {
            if (p1.y === p2.y) {
              mu_max = Math.max(mu_max, p1.x, p2.x);
            } else {
              const t = (nu_Ed - p2.y) / (p1.y - p2.y);
              const interpol_mu = p2.x + t * (p1.x - p2.x);
              if (interpol_mu > mu_max) mu_max = interpol_mu;
            }
          }
        }
        if (mu_Ed <= mu_max + 0.002) { 
          inside = true;
        }
      }
      
      if (inside) {
        req_omega = o;
        isPossible = true;
        break;
      }
    }
    
    if (isPossible && !omegaValues.includes(req_omega)) {
      const req_curve = generateInteractionData(req_omega);
      interactionCurves.push({ ...req_curve, isRequired: true });
      interactionCurves.sort((a, b) => a.omega - b.omega);
    }

    const as_tot_req = req_omega * b_m * h_m * (fcd / fyd) * 10000; // cm²
    
    // Mindestbewehrung für Stützen nach NA DE: As,min = 0.15 * |NEd| / fyd
    // NEd in kN (1000 N), fyd in MPa (N/mm²), As,min in cm² = (mm² / 100)
    const as_min = (EC2_NA_DE.AsMinStuetze(nEd * 1000, fyd)) / 100; // cm²
    const as_final = isPossible ? Math.max(as_tot_req, as_min) : 0;

    return {
      nu_Ed,
      mu_Ed,
      mEd_1,
      e0_mm: e0_m * 1000,
      ei_mm: ei_m * 1000,
      lambda,
      lambda_lim,
      isTheorie2Ordnung,
      req_omega,
      as_tot_req,
      as_min,
      as_final,
      isPossible,
      interactionCurves
    };
  }, [b, h, d1, l0, nEd, mEd, fck, fyk]);

  const chartData = {
    datasets: [
      ...results.interactionCurves.map((curve: any, index: number) => ({
        label: `ω = ${curve.omega.toFixed(2)}${curve.isRequired ? ' (erf.)' : ''}`,
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
                Die Schlankheit der Stütze beträgt <FormulaText text={`\\lambda = ${results.lambda.toFixed(1)}`} /> und überschreitet die Grenzschlankheit <FormulaText text={`\\lambda_{lim} = ${results.lambda_lim.toFixed(1)}`} /> nach DIN EN 1992-1-1, Abs. 5.8.3.1. Schnittgrößen nach Theorie II. Ordnung müssen nachgewiesen werden.
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
                  <select className="w-full p-2 border rounded-md" value={fck} onChange={(e) => setFck(Number(e.target.value))}>
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
                  <select className="w-full p-2 border rounded-md" value={fyk} onChange={(e) => setFyk(Number(e.target.value))}>
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
                  <span className="font-mono font-bold">{results.e0_mm.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Imperfektion <FormulaText text="e_i" /> (l₀/400):</span>
                  <span className="font-mono font-bold">{results.ei_mm.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between border-t border-home-grau/20 pt-1">
                  <span>Maßgebendes <FormulaText text="M_{Ed,1}" />:</span>
                  <span className="font-mono font-bold text-shiraz">{results.mEd_1.toFixed(2)} kNm</span>
                </div>
                <div className="flex justify-between border-t border-home-grau/20 pt-1">
                  <span>Schlankheit <FormulaText text="\lambda" /> / <FormulaText text="\lambda_{lim}" />:</span>
                  <span className="font-mono font-bold">{results.lambda.toFixed(1)} / {results.lambda_lim.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className={`p-6 rounded-xl border ${results.isPossible ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Ergebnis (NA DE)</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm opacity-80">Bezogene Normalkraft <FormulaText text="\nu_{Ed}" /></div>
                  <div className="text-xl font-bold">{results.nu_Ed.toFixed(3)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Bezogenes Moment <FormulaText text="\mu_{Ed}" /> (inkl. e₀, eᵢ)</div>
                  <div className="text-xl font-bold">{results.mu_Ed.toFixed(3)}</div>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border text-center">
                <div className="text-sm font-bold uppercase mb-2">Erf. Gesamtbewehrung <FormulaText text="A_{s,tot}" /></div>
                {results.isPossible ? (
                  <>
                    <div className="text-4xl font-bold text-shiraz">{results.as_final.toFixed(2)} cm²</div>
                    <div className="text-xs mt-2 opacity-70">
                      (Rechnerisch: {results.as_tot_req.toFixed(2)} cm² | Mindestbewehrung NA DE: {results.as_min.toFixed(2)} cm²)
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

      <ModuleFooter
        wikipedia={[
          { title: 'Stütze (Bauteil)', url: 'https://de.wikipedia.org/wiki/St%C3%BCtze_(Bauteil)' },
          { title: 'Eurocode 2', url: 'https://de.wikipedia.org/wiki/Eurocode_2' },
          { title: 'Interaktionsdiagramm', url: 'https://de.wikipedia.org/wiki/Interaktionsdiagramm' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1:2023-08 / DIN EN 1992-1-1/NA:2013-04 (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken - Abschnitte 5.8 und 9.5)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' }
        ]}
        literatur={['Zilch, K., Zehetmaier, G.: Bemessung im Konstruktiven Betonbau (2010)']}
        formeln={[
          {
            erklaerung: "Mindestbewehrung für Stützen nach NA DE\nA_{s,min}: Mindestbewehrung [cm²]\nN_{Ed}: Bemessungswert der Normalkraft [kN]\nf_{yd}: Bemessungsstreckgrenze des Betonstahls [MPa]",
            formel: "A_{s,min} = \\frac{0{,}15 \\cdot |N_{Ed}|}{f_{yd}}"
          },
          {
            erklaerung: "Bemessungsmoment mit Mindestausmitte und Imperfektion\nM_{Ed,1}: Bemessungsmoment Theorie I. Ordnung [kNm]\ne_0: Mindestausmitte = \\max(h/30; 20\\text{ mm})\ne_i: Ungewollte Schiefstellung = l_0 / 400",
            formel: "M_{Ed,1} = \\max(M_{Ed}, N_{Ed} \\cdot e_0) + N_{Ed} \\cdot e_i"
          },
          {
            erklaerung: "Schlankheit und Grenzschlankheitskriterium\n\\lambda: Bauteilschlankheit = l_0 / i\ni: Trägheitsradius = h / \\sqrt{12}\n\\lambda_{lim}: Kriterium nach DIN EN 1992-1-1, 5.8.3.1 für Theorie II. Ordnung",
            formel: "\\lambda = \\frac{l_0}{i} \\le \\lambda_{lim} = \\frac{20 \\cdot A \\cdot B \\cdot C}{\\sqrt{n}}"
          }
        ]}
      />
    </div>
  );
}
