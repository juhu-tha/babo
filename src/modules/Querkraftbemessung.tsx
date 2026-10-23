import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Layers, Scissors } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { EC2_NA_DE } from '@/src/data/normParams';
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
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';

import { fctmVonFck } from '@/src/data/kennwerte';
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


export default function Querkraftbemessung() {
  // Geometrie
  const [b, setB] = useState(30); // Breite in cm
  const [h, setH] = useState(50); // Höhe in cm
  const [d1, setD1] = useState(5); // Betondeckung + halber Stabdurchmesser in cm

  // Material
  const [fck, setFck] = useState(30); // Betonfestigkeitsklasse C30/37
  const [bewehrungsArt, setBewehrungsArt] = useState<'Stahl' | 'Carbon' | 'GFK' | 'Basalt'>('Stahl');
  const [fyk, setFyk] = useState(500); // Betonstahl B500
  const [ftk, setFtk] = useState(3000); // Zugfestigkeit nichtmetallisch MPa
  const [gammaFRP, setGammaFRP] = useState(1.3); // Teilsicherheitsbeiwert FRP
  const [asl, setAsl] = useState(6.0); // Vorhandene Längsbewehrung Asl in cm²

  // Einwirkung
  const [vEd, setVEd] = useState(250); // Bemessungswert der Querkraft in kN
  const [theta, setTheta] = useState(40); // Druckstrebenneigung in Grad (18.4° bis 45°)

  const results = useMemo(() => {
    // Umrechnung in m und MN für die Berechnung
    const b_m = b / 100;
    const h_m = h / 100;
    const d_m = Math.max(0.01, (h - d1) / 100);
    const vEd_MN = vEd / 1000;
    const theta_rad = (theta * Math.PI) / 180;
    const cot_theta = 1 / Math.tan(theta_rad);

    // Materialkennwerte aus zentraler Registry
    const gamma_c = EC2_NA_DE.gammaC;
    const alpha_cc = EC2_NA_DE.alphaCC;
    
    const fcd = (alpha_cc * fck) / gamma_c; // in MPa (MN/m²)
    
    let fyd = 0;
    const isStahl = bewehrungsArt === 'Stahl';

    if (isStahl) {
      const gamma_s = EC2_NA_DE.gammaS;
      fyd = fyk / gamma_s; // in MPa (MN/m²)
    } else {
      fyd = ftk / gammaFRP; // in MPa (MN/m²)
    }

    // Innerer Hebelarm z (vereinfacht 0.9 * d)
    const z = 0.9 * d_m;

    // VRd,max (Maximale Querkrafttragfähigkeit der Druckstrebe nach NA DE)
    const v2 = Math.min(1.0, 1.1 - fck / 500);
    const nu1 = EC2_NA_DE.nu1 * v2; // Abminderungsfaktor für gerissenen Beton (nach DIN EN 1992-1-1/NA)
    const alpha_cw = 1.0; // für nicht vorgespannte Bauteile
    
    const vRd_max = (alpha_cw * b_m * z * nu1 * fcd) / (Math.tan(theta_rad) + cot_theta);

    // Erforderliche Querkraftbewehrung (Bügel) a_sw
    const asw_req_m2_m = vEd_MN / (z * fyd * cot_theta);
    const asw_req_cm2_m = asw_req_m2_m * 10000; // in cm²/m

    // Mindestquerkraftbewehrung nach NA DE: rho_w,min = 0.16 * fctm / fyk
    const fctm = fctmVonFck(fck);
    const rho_w_min = EC2_NA_DE.rhoWmin(fctm, isStahl ? fyk : ftk);
    const asw_min_cm2_m = rho_w_min * b_m * 10000; // senkrechte Bügel (alpha = 90°)

    // Querkrafttragfähigkeit ohne Querkraftbewehrung VRd,c (nach DIN EN 1992-1-1/NA DE)
    const k = Math.min(2.0, 1 + Math.sqrt(200 / (d_m * 1000))); // Maßstabsfaktor
    const Asl_req_m2 = asl / 10000; // in m²
    const rho_l = Math.min(0.02, Asl_req_m2 / (b_m * d_m)); // Längsbewehrungsgrad
    const CRdc = EC2_NA_DE.CRdc_Querkraft; // 0.15 / gamma_c nach NA DE
    // v_min nach DIN EN 1992-1-1/NA, NDP 6.2.1(1): 0,0525/γc für d ≤ 600 mm, 0,0375/γc für d > 800 mm, dazwischen linear
    const d_mm_v = d_m * 1000;
    const vmin_k1 = d_mm_v <= 600 ? 0.0525 : d_mm_v >= 800 ? 0.0375 : 0.0525 - (0.0525 - 0.0375) * (d_mm_v - 600) / 200;
    const v_min = (vmin_k1 / 1.5) * Math.pow(k, 1.5) * Math.pow(fck, 0.5); // MIN-Wert nach NA DE

    let vRdc_MN = (CRdc * k * Math.pow(100 * rho_l * fck, 1 / 3)) * b_m * d_m;
    const vRdc_min_MN = v_min * b_m * d_m;
    vRdc_MN = Math.max(vRdc_MN, vRdc_min_MN);

    // Begrenzung von cot theta nach DIN EN 1992-1-1/NA, Gl. 6.7aDE
    // VRd,cc = 0.5 * 0.48 * fck^(1/3) * bw * z (in N mit bw, z in mm)
    const bw_mm = b_m * 1000;
    const z_mm = z * 1000;
    const vRd_cc_N = 0.5 * 0.48 * Math.pow(fck, 1 / 3) * bw_mm * z_mm;
    const vEd_N = vEd * 1000;
    
    let cot_theta_max = EC2_NA_DE.cotThetaMax;
    if (vEd_N > vRd_cc_N) {
      cot_theta_max = Math.min(EC2_NA_DE.cotThetaMax, 1.2 / (1 - vRd_cc_N / vEd_N));
    }
    const theta_min_deg = (Math.atan(1 / cot_theta_max) * 180) / Math.PI;
    const isCotThetaExceeded = cot_theta > cot_theta_max + 0.005;

    const isVRdcExceeded = vEd_MN > vRdc_MN;
    const asw_final = isVRdcExceeded ? Math.max(asw_req_cm2_m, asw_min_cm2_m) : asw_min_cm2_m;
    const isVRdMaxExceeded = vEd_MN > vRd_max;

    return {
      d: d_m * 100,
      z: z * 100,
      fcd,
      fyd,
      vRd_max: vRd_max * 1000, // in kN
      vRd_c: vRdc_MN * 1000, // in kN
      vRd_cc_kN: vRd_cc_N / 1000,
      cot_theta,
      cot_theta_max,
      theta_min_deg,
      isCotThetaExceeded,
      asw_req: asw_req_cm2_m,
      asw_min: asw_min_cm2_m,
      asw_final,
      isVRdcExceeded,
      isVRdMaxExceeded,
      fctm
    };
  }, [b, h, d1, fck, bewehrungsArt, fyk, ftk, gammaFRP, asl, vEd, theta]);

  // Diagrammdaten: a_sw über V_Ed
  const chartData = useMemo(() => {
    const vEd_values = [];
    const asw_values = [];
    const asw_min_values = [];

    const b_m = b / 100;
    const d_m = Math.max(0.01, (h - d1) / 100);
    const z = 0.9 * d_m;
    const theta_rad = (theta * Math.PI) / 180;
    const cot_theta = 1 / Math.tan(theta_rad);

    let fyd = 0;
    if (bewehrungsArt === 'Stahl') {
      fyd = fyk / EC2_NA_DE.gammaS;
    } else {
      fyd = ftk / gammaFRP;
    }

    const fctm = fctmVonFck(fck);
    const rho_w_min = EC2_NA_DE.rhoWmin(fctm, bewehrungsArt === 'Stahl' ? fyk : ftk);
    const asw_min_cm2_m = rho_w_min * b_m * 10000;

    for (let v = 20; v <= Math.min(results.vRd_max * 1.1, 1000); v += 20) {
      vEd_values.push(v);
      const v_MN = v / 1000;
      const asw_req = (v_MN / (z * fyd * cot_theta)) * 10000;
      
      const vRdc_kN = results.vRd_c;
      if (v > vRdc_kN) {
        asw_values.push(Math.max(asw_req, asw_min_cm2_m));
      } else {
        asw_values.push(asw_min_cm2_m);
      }
      asw_min_values.push(asw_min_cm2_m);
    }

    return {
      labels: vEd_values,
      datasets: [
        {
          label: 'Erforderliche Bügelbewehrung asw [cm²/m]',
          data: asw_values,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(163, 17, 62, 0.1)',
          fill: true,
          tension: 0.1,
        },
        {
          label: 'Mindestbewehrung asw,min [cm²/m]',
          data: asw_min_values,
          borderColor: '#64748b',
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }
      ]
    };
  }, [b, h, d1, theta, bewehrungsArt, fyk, ftk, gammaFRP, fck, results.vRd_max, results.vRd_c]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Querkraft V_Ed [kN]'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Bügelbewehrung a_sw [cm²/m]'
        },
        beginAtZero: true
      }
    }
  };

  // SVG Dimensionen für die Grafik (Tragmodell)
  const svgWidth = 350;
  const svgHeight = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const drawWidth = svgWidth - margin.left - margin.right;
  const drawHeight = svgHeight - margin.top - margin.bottom;
  
  const beamHeight = 100;
  const z_visual = beamHeight * 0.8;
  const theta_rad = (theta * Math.PI) / 180;
  const strutLength_x = z_visual / Math.tan(theta_rad);
  
  const startX = margin.left + 20;
  const topY = margin.top + (drawHeight - beamHeight) / 2;
  const bottomY = topY + beamHeight;
  const zTopY = topY + (beamHeight - z_visual) / 2;
  const zBottomY = zTopY + z_visual;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /> Querkraftbemessung (Massivbau)
            <InfoTooltip text="Berechnung der erforderlichen Querkraftbewehrung (Bügel) und Nachweis der Druckstrebe für einen Rechteckquerschnitt nach DIN EN 1992-1-1 mit NA DE." />
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300">
            Berechnet nach DIN EN 1992-1-1 + NA (DE)
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
          <p>
            Die Querkraftbemessung basiert auf dem Fachwerkmodell. Der Beton nimmt die Druckkräfte in den geneigten Druckstreben auf (<FormulaText text="V_{Rd,max}" />), während die Bügelbewehrung die Zugkräfte aufnimmt (<FormulaText text="V_{Rd,s}" />). Der Winkel der Druckstrebe (<FormulaText text="\theta" />) kann in Deutschland zwischen 18,4° und 45° gewählt werden (cot <FormulaText text="\theta" /> = 1,0 … 3,0). Ein flacherer Winkel erfordert weniger Bügelbewehrung, erhöht aber die Belastung der Betondruckstrebe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Querschnitt &amp; Material</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Slider info="Breite des Bauteils." label={<FormulaText text="Breite b" />} min={15} max={100} step={5} value={b} unit="cm" onChange={(e) => setB(Number(e.target.value))} />
                  <Slider label={<FormulaText text="Höhe h" />} min={20} max={150} step={5} value={h} unit="cm" onChange={(e) => setH(Number(e.target.value))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Slider info="Abstand vom Rand zur Bewehrung." label={<FormulaText text="Randabstand d_1" />} min={2} max={10} step={0.5} value={d1} unit="cm" onChange={(e) => setD1(Number(e.target.value))} />
                  <Slider info="Vorhandene Längsbewehrungsfläche (für VRd,c)." label={<FormulaText text="Längsbew. A_{sl}" />} min={0} max={50} step={0.5} value={asl} unit="cm²" onChange={(e) => setAsl(Number(e.target.value))} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2"><label className="block text-xs font-bold text-text-main"><FormulaText text="Betonklasse f_{ck}" /></label><InfoTooltip text="Charakteristische Druckfestigkeit des Betons." /></div>
                    <select 
                      className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-white"
                      value={fck}
                      onChange={(e) => setFck(Number(e.target.value))}
                    >
                      <option value={20}>C20/25</option>
                      <option value={25}>C25/30</option>
                      <option value={30}>C30/37</option>
                      <option value={35}>C35/45</option>
                      <option value={40}>C40/50</option>
                      <option value={45}>C45/55</option>
                      <option value={50}>C50/60</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2"><label className="block text-xs font-bold text-text-main">Bewehrungsart</label><InfoTooltip text="Wahl zwischen herkömmlichem Betonstahl oder Faserverbundwerkstoffen." /></div>
                    <select aria-label="Bewehrungsart" 
                      className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-white"
                      value={bewehrungsArt}
                      onChange={(e) => setBewehrungsArt(e.target.value as any)}
                    >
                      <option value="Stahl">Betonstahl (B500)</option>
                      <option value="Carbon">Carbon (CFK)</option>
                      <option value="GFK">Glasfaser (GFK)</option>
                      <option value="Basalt">Basalt (BFK)</option>
                    </select>
                  </div>
                </div>

                {bewehrungsArt === 'Stahl' ? (
                  <div className="mt-2">
                    <label className="block text-xs font-bold text-text-main mb-2">Streckgrenze Stahl <FormulaText text="f_{yk}" /></label>
                    <select aria-label="Streckgrenze Stahl" 
                      className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-white"
                      value={fyk}
                      onChange={(e) => setFyk(Number(e.target.value))}
                    >
                      <option value={500}>B500 (500 MPa)</option>
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Slider label="Zugfestigkeit ftk" info="Charakteristische Zugfestigkeit des Faserverbundstabs." min={500} max={4000} step={100} value={ftk} unit="MPa" onChange={(e) => setFtk(Number(e.target.value))} />
                    <Slider label="Teilsicherheitsbeiwert γFRP" info="Teilsicherheitsbeiwert für den Faserverbundwerkstoff." min={1.0} max={2.0} step={0.05} value={gammaFRP} unit="-" onChange={(e) => setGammaFRP(Number(e.target.value))} />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Einwirkung &amp; Modell</h3>
              <div className="grid grid-cols-1 gap-4">
                <Slider label={<FormulaText text="Querkraft V_{Ed}" />} info="Bemessungswert der einwirkenden Querkraft aus äußeren Lasten." min={10} max={2000} step={10} value={vEd} unit="kN" onChange={(e) => setVEd(Number(e.target.value))} />
                <div>
                  <Slider 
                    info="Neigungswinkel der Beton-Druckstrebe des Fachwerkmodells (in Deutschland zwischen 18,4° und 45° bzw. cot θ von 1,0 bis 3,0)." 
                    label={<FormulaText text="Druckstrebenneigung \theta" />} 
                    min={18.4} max={45} step={0.1} 
                    value={theta} unit="°" 
                    onChange={(e) => setTheta(Number(e.target.value))} 
                  />
                  <div className="text-xs text-text-main/70 mt-1 flex justify-between">
                    <span>cot θ = {formatDeZahl(results.cot_theta, 2)}</span>
                    <span>Max. zulässig (NA DE): cot θ,max = {formatDeZahl(results.cot_theta_max, 2)}</span>
                  </div>
                  {results.isCotThetaExceeded && (
                    <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-md mt-2">
                      In DE ist cot θ zusätzlich durch V<sub>Rd,cc</sub> begrenzt (DIN EN 1992-1-1/NA, Gl. 6.7aDE). 
                      Für V<sub>Ed</sub> = {formatDeWert(vEd)} kN und V<sub>Rd,cc</sub> = {formatDeZahl(results.vRd_cc_kN, 1)} kN gilt cot θ,max = {formatDeZahl(results.cot_theta_max, 2)} (θ ≥ {formatDeZahl(results.theta_min_deg, 1)}°).
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-6 rounded-xl shadow-md text-white bg-shiraz transition-colors">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90 flex items-center gap-2">
                <Scissors size={18} /> Bemessungsergebnisse (NA DE)
              </h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-white/70 text-sm mb-1">Erf. Bügelbewehrung (<FormulaText text="a_{sw}" />)</div>
                  <div className="text-4xl font-bold">{formatDeZahl(results.asw_final, 2)} <span className="text-xl">cm²/m</span></div>
                  {results.asw_final === results.asw_min && (
                    <div className="text-xs text-white/80 mt-1 bg-white/10 inline-block px-2 py-1 rounded">
                      Mindestbewehrung maßgebend
                    </div>
                  )}
                  {!results.isVRdcExceeded && (
                    <div className="text-xs text-green-200 mt-1">
                      V_Ed ≤ V_Rd,c (Rechnerisch nicht erforderlich)
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="text-white/70 text-sm mb-1">Tragf. ohne Bügel (<FormulaText text="V_{Rd,c}" />)</div>
                    <div className={`text-2xl font-bold ${results.isVRdcExceeded ? 'text-white/80' : 'text-green-300'}`}>
                      {formatDeZahl(results.vRd_c, 0)} <span className="text-base">kN</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1">Max. Tragfähigkeit (<FormulaText text="V_{Rd,max}" />)</div>
                    <div className={`text-2xl font-bold ${results.isVRdMaxExceeded ? 'text-red-300' : 'text-white'}`}>
                      {formatDeZahl(results.vRd_max, 0)} <span className="text-base">kN</span>
                    </div>
                  </div>
                </div>
              </div>

              {results.isVRdMaxExceeded ? (
                <div className="bg-red-500/20 border border-red-300/50 p-4 rounded-lg">
                  <div className="font-bold text-red-100 mb-1">Nachweis <FormulaText text="V_{Ed} \le V_{Rd,max}" /> nicht erfüllt!</div>
                  <div className="text-sm text-red-100/80">
                    Die Betondruckstrebe versagt. Erhöhen Sie den Querschnitt (<FormulaText text="b" />, <FormulaText text="h" />), die Betonfestigkeit oder den Druckstrebenwinkel <FormulaText text="\theta" />.
                  </div>
                </div>
              ) : (
                <div className="bg-green-500/20 border border-green-300/50 p-4 rounded-lg">
                  <div className="font-bold text-green-100 mb-1">Nachweis <FormulaText text="V_{Ed} \le V_{Rd,max}" /> erfüllt.</div>
                  <div className="text-sm text-green-100/80">
                    Ausnutzung Druckstrebe: {formatDeZahl(((vEd / results.vRd_max) * 100), 1)} %
                    <br />
                    {results.isVRdcExceeded ? (
                      <span>Querkraftbewehrung erforderlich, da <FormulaText text="V_{Ed} > V_{Rd,c}" />.</span>
                    ) : (
                      <span className="text-green-200">Keine rechnerische Querkraftbewehrung erforderlich (<FormulaText text="V_{Ed} \le V_{Rd,c}" />). Mindestbewehrung anordnen.</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Zwischenwerte</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Statische Nutzhöhe (<FormulaText text="d" />)</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.d, 1)} cm</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Innerer Hebelarm (<FormulaText text="z" />)</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.z, 1)} cm</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Bemessungsfestigkeit Beton (<FormulaText text="f_{cd}" />)</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.fcd, 1)} MPa</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Bemessungsfestigkeit Stahl (<FormulaText text="f_{yd}" />)</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.fyd, 1)} MPa</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Tragf. ohne Bügel (<FormulaText text="V_{Rd,c}" />)</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.vRd_c, 1)} kN</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Rechnerisch erf. <FormulaText text="a_{sw}" /></span>
                  <span className="font-mono font-bold">{formatDeZahl(results.asw_req, 2)} cm²/m</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Mindestbewehrung <FormulaText text="a_{sw,min}" /></span>
                  <span className="font-mono font-bold">{formatDeZahl(results.asw_min, 2)} cm²/m</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Grenze <FormulaText text="\cot(\theta)_{max}" /></span>
                  <span className="font-mono font-bold">{formatDeZahl(results.cot_theta_max, 2)}</span>
                </div>
              </div>
            </div>

            {/* Visualisierung Fachwerkmodell */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col items-center">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-2">Fachwerkmodell (Seitenansicht)</h3>
              <svg width={svgWidth} height={svgHeight} className="overflow-visible">
                <rect x={startX} y={topY} width={drawWidth - 40} height={beamHeight} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />
                <line x1={startX} y1={zBottomY} x2={startX + drawWidth - 40} y2={zBottomY} stroke="#A3113E" strokeWidth="3" />
                <line x1={startX} y1={zTopY} x2={startX + drawWidth - 40} y2={zTopY} stroke="#475569" strokeWidth="3" />

                <line x1={startX} y1={zBottomY} x2={startX + strutLength_x} y2={zTopY} stroke="#475569" strokeWidth="8" opacity="0.4" />
                <line x1={startX + strutLength_x} y1={zBottomY} x2={startX + 2 * strutLength_x} y2={zTopY} stroke="#475569" strokeWidth="8" opacity="0.4" />
                {startX + 2 * strutLength_x < startX + drawWidth - 40 && (
                  <line x1={startX + 2 * strutLength_x} y1={zBottomY} x2={Math.min(startX + 3 * strutLength_x, startX + drawWidth - 40)} y2={zTopY - (Math.min(startX + 3 * strutLength_x, startX + drawWidth - 40) - (startX + 2 * strutLength_x)) * Math.tan(theta_rad)} stroke="#475569" strokeWidth="8" opacity="0.4" />
                )}

                <line x1={startX + strutLength_x} y1={zTopY} x2={startX + strutLength_x} y2={zBottomY} stroke="#A3113E" strokeWidth="2" />
                <line x1={startX + 2 * strutLength_x} y1={zTopY} x2={startX + 2 * strutLength_x} y2={zBottomY} stroke="#A3113E" strokeWidth="2" />

                <path d={`M ${startX + 30} ${zBottomY} A 30 30 0 0 0 ${startX + 30 * Math.cos(theta_rad)} ${zBottomY - 30 * Math.sin(theta_rad)}`} fill="none" stroke="#475569" strokeWidth="1" />
                <text x={startX + 35} y={zBottomY - 10} fontSize="12" fill="#475569">θ = {formatDeWert(theta)}°</text>

                <line x1={startX - 10} y1={zTopY} x2={startX - 10} y2={zBottomY} stroke="#475569" strokeWidth="1" />
                <line x1={startX - 15} y1={zTopY} x2={startX - 5} y2={zTopY} stroke="#475569" strokeWidth="1" />
                <line x1={startX - 15} y1={zBottomY} x2={startX - 5} y2={zBottomY} stroke="#475569" strokeWidth="1" />
                <text x={startX - 20} y={topY + beamHeight / 2} fontSize="12" fill="#475569" textAnchor="end" dominantBaseline="middle">z</text>
                
                <circle cx={startX + 20} cy={bottomY + 20} r={4} fill="#A3113E" />
                <text x={startX + 30} y={bottomY + 20} fontSize="10" fill="#475569" dominantBaseline="middle">Zug (Stahl)</text>
                <circle cx={startX + 120} cy={bottomY + 20} r={4} fill="#475569" />
                <text x={startX + 130} y={bottomY + 20} fontSize="10" fill="#475569" dominantBaseline="middle">Druck (Beton)</text>
              </svg>
            </div>

            {/* Diagramm: a_sw über V_Ed */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Erforderliche Querkraftbewehrung</h3>
              <div className="relative w-full" style={{ height: '400px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-[11px] text-text-main/60 leading-relaxed">
        Vereinfachungen: Hebelarm z = 0,9·d (NA: z = max(d − 2c_v,l; d − c_v,l − 30 mm) ≤ 0,9·d). Nichtmetallische Bügel sind eine Lehrannahme;
        maßgebend ist die DAfStb-Richtlinie „Betonbauteile mit nichtmetallischer Bewehrung“ (2024-01).
      </p>
      <CalculatorDisclaimerBanner className="my-2" />
    </div>
  );
}
