import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
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
import { EC2_NA_DE } from '@/src/data/normParams';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';

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

const CONCRETE_FCTM: Record<number, number> = {
  20: 2.2,
  25: 2.6,
  30: 2.9,
  35: 3.2,
  40: 3.5,
  50: 4.1,
};

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

  const results = useMemo(() => {
    // Bemessungswerte aus zentraler Registry
    const gamma_c = EC2_NA_DE.gammaC;
    const alpha_cc = EC2_NA_DE.alphaCC;
    const fcd = (alpha_cc * fck) / gamma_c; // MPa = N/mm²

    let fyd = 0;
    const isStahl = bewehrungsArt === 'Stahl';

    if (isStahl) {
      const gamma_s = EC2_NA_DE.gammaS;
      fyd = fyk / gamma_s; // MPa = N/mm²
    } else {
      fyd = ftk / gammaFRP; // MPa = N/mm²
    }

    const d = h - d1; // statische Nutzhöhe in cm
    const d2_val = d2; // Randabstand Druckbewehrung
    
    // Umrechnung in kN und m
    const d_m = d / 100;
    const d2_m = d2_val / 100;
    const b_m = b / 100;
    const h_m = h / 100;
    const fcd_kNm2 = fcd * 1000; // kN/m²

    // Bezogenes Biegemoment mü_Ed
    const mu_Ed = med / (b_m * d_m * d_m * fcd_kNm2);

    let omega = 0;
    let as1_req = 0; // Zugbewehrung
    let as2_req = 0; // Druckbewehrung
    let isPossible = true;
    let message = "Bemessung erfolgreich";
    let x = 0; // Druckzonenhöhe in cm

    const maxMu = isStahl ? 0.296 : 0.25;

    if (mu_Ed > maxMu) { 
      if (isStahl) {
        message = "Druckbewehrung erforderlich!";
        omega = 1 - Math.sqrt(1 - 2 * maxMu);
        const as1_base = omega * b_m * d_m * (fcd / fyd) * 10000;
        
        const m_max = maxMu * b_m * d_m * d_m * fcd_kNm2;
        const delta_m = med - m_max;
        const sigma_s2 = fyd; 
        
        as2_req = (delta_m / ((d_m - d2_m) * sigma_s2)) * 10;
        as1_req = as1_base + as2_req * (sigma_s2 / fyd);
        
        const lambda = 0.8;
        x = (omega * d) / lambda;
      } else {
        isPossible = false;
        message = "Druckzone versagt (Querschnittsvergrößerung erforderlich)";
      }
    } else {
      omega = 1 - Math.sqrt(1 - 2 * mu_Ed);
      as1_req = omega * b_m * d_m * (fcd / fyd) * 10000;
      const lambda = 0.8;
      x = (omega * d) / lambda;
    }

    // Mindestbewehrung nach NA DE als Robustheitsbewehrung aus dem Rissmoment:
    // Mcr = fctm * b * h² / 6
    // z = 0.9 * d
    // As,min = Mcr / (fyk * z)
    const fctm = CONCRETE_FCTM[fck] ?? (0.3 * Math.pow(fck, 2 / 3));
    const bw_mm = b_m * 1000;
    const h_mm = h_m * 1000;
    const mcr_Nmm = (fctm * bw_mm * Math.pow(h_mm, 2)) / 6;
    const mcr_kNm = mcr_Nmm / 1e6;
    const z_mm = 0.9 * (d_m * 1000);
    const steelYield = isStahl ? fyk : ftk;
    const as_min_mm2 = mcr_Nmm / (steelYield * z_mm);
    const as_min = as_min_mm2 / 100; // in cm²
    
    // EC-Empfehlung (nicht DE) nur für InfoTooltip:
    const as_min_ec = 0.26 * (fctm / steelYield) * b * d;
    
    const as_final = isPossible ? Math.max(as1_req, as_min) : 0;

    return {
      d,
      fcd,
      fyd,
      mu_Ed,
      omega,
      as1_req,
      as2_req,
      as_min,
      as_min_ec,
      mcr_kNm,
      as_final,
      isPossible,
      message,
      x
    };
  }, [b, h, d1, d2, med, fck, bewehrungsArt, fyk, ftk, gammaFRP]);

  const chartData = useMemo(() => {
    const med_values = [];
    const as_values = [];
    const b_m = b / 100;
    const d_m = (h - d1) / 100;
    const d2_m = d2 / 100;
    const fcd = (EC2_NA_DE.alphaCC * fck) / EC2_NA_DE.gammaC;
    const isStahl = bewehrungsArt === 'Stahl';
    const fyd = isStahl ? fyk / EC2_NA_DE.gammaS : ftk / gammaFRP;
    const fcd_kNm2 = fcd * 1000;
    const maxMu = isStahl ? 0.296 : 0.25;

    for (let m = 20; m <= 600; m += 20) {
      med_values.push(m);
      const mu = m / (b_m * d_m * d_m * fcd_kNm2);
      if (mu <= maxMu) {
        const om = 1 - Math.sqrt(1 - 2 * mu);
        const as1 = om * b_m * d_m * (fcd / fyd) * 10000;
        as_values.push(Math.max(as1, results.as_min));
      } else if (isStahl) {
        const om = 1 - Math.sqrt(1 - 2 * maxMu);
        const as1_base = om * b_m * d_m * (fcd / fyd) * 10000;
        const m_max = maxMu * b_m * d_m * d_m * fcd_kNm2;
        const delta_m = m - m_max;
        const as2 = (delta_m / ((d_m - d2_m) * fyd)) * 10;
        const as1 = as1_base + as2;
        as_values.push(as1);
      } else {
        as_values.push(null);
      }
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

          <div className="lg:col-span-6 flex flex-col gap-6">
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
                  <div className="text-xs text-home-grau mt-1">Grenzwert: ~0,296</div>
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
        </div>
      </div>
      
      <CalculatorDisclaimerBanner className="my-2" />
      <ModuleFooter 
        wikipedia={[
          { title: 'Biegung (Mechanik)', url: 'https://de.wikipedia.org/wiki/Biegung_(Mechanik)' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1:2023-08 / DIN EN 1992-1-1/NA:2013-04 (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken - Abschnitte 6.1 und 9.2.1)' }
        ]}
        literatur={[
          'Zilch, K., Zehetmaier, G.: Bemessung im Konstruktiven Betonbau',
          'Goris, A.: Stahlbetonbau-Praxis'
        ]}
        formeln={[
          {
            formel: 'A_{s,min} = \\frac{M_{cr}}{f_{yk} \\cdot z}',
            erklaerung: 'Mindestbewehrung als Robustheitsbewehrung nach DIN EN 1992-1-1/NA\nM_{cr}: Rissmoment des Querschnitts = f_{ctm} \\cdot b \\cdot h^2 / 6 [kNm]\nz: Innerer Hebelarm = 0{,}9 \\cdot d [m]\nf_{yk}: Charakteristische Streckgrenze des Stahls [MPa]. Die Standard-Formel 0,26 * (fctm/fyk) * b * d ist eine EC-Empfehlung (nicht DE).',
            quelle: 'DIN EN 1992-1-1/NA Abs. 9.2.1.1'
          },
          {
            formel: '\\mu_{Ed} = \\frac{M_{Ed}}{b \\cdot d^2 \\cdot f_{cd}}',
            erklaerung: 'Bezogenes Biegemoment\n\\mu_{Ed}: Bezogenes Biegemoment [-]\nf_{cd}: Bemessungswert der Betondruckfestigkeit [MPa]\nM_{Ed}: Einwirkendes Biegemoment [kNm]\nd: Statische Nutzhöhe (h - d₁) [m]\nb: Bauteilbreite [m]',
            quelle: 'DIN EN 1992-1-1 Abs. 6.1'
          },
          {
            formel: '\\omega = 1 - \\sqrt{1 - 2 \\cdot \\mu_{Ed}}',
            erklaerung: 'Mechanischer Bewehrungsgrad\n\\mu_{Ed}: Bezogenes Biegemoment [-]\n\\omega: Mechanischer Bewehrungsgrad [-]',
            quelle: 'DIN EN 1992-1-1 Abs. 6.1'
          },
          {
            formel: 'A_{s1} = \\omega \\cdot b \\cdot d \\cdot \\frac{f_{cd}}{f_{yd}}',
            erklaerung: 'Erforderliche Zugbewehrung\n\\omega: Mechanischer Bewehrungsgrad [-]\nb: Bauteilbreite [m]\nd: Statische Nutzhöhe [m]\nf_{cd}, f_{yd}: Bemessungswerte Festigkeit [MPa]\nA_{s1}: Zugbewehrungsquerschnitt [cm²]',
            quelle: 'DIN EN 1992-1-1 Abs. 6.1'
          }
        ]}
      />
    </div>
  );
}
