import { Layers } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { EC2_NA_DE } from '@/src/data/normParams';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  LineController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  ScatterController,
  LineController,
  Title,
  Tooltip,
  Legend
);

const CONCRETE_DATA: Record<string, { fctm: number; ecm: number }> = {
  'C20/25': { fctm: 2.2, ecm: 30000 },
  'C25/30': { fctm: 2.6, ecm: 31000 },
  'C30/37': { fctm: 2.9, ecm: 33000 },
  'C35/45': { fctm: 3.2, ecm: 34000 },
  'C40/50': { fctm: 3.5, ecm: 35000 },
  'C45/55': { fctm: 3.8, ecm: 36000 },
  'C50/60': { fctm: 4.1, ecm: 37000 },
};

export default function Rissbreite() {
  const [wkReq, setWkReq] = useState(EC2_NA_DE.wmax_StB.XC2); // 0.3 mm (XC2)
  const [concreteClass, setConcreteClass] = useState('C30/37');
  const [cNom, setCNom] = useState(35);
  const [phiS, setPhiS] = useState(16);
  const [sigmaS, setSigmaS] = useState(250);
  const [h, setH] = useState(200);
  const [b, setB] = useState(1000);
  const [spacing, setSpacing] = useState(20); // in cm
  const [fctEff, setFctEff] = useState(2.9);
  const [ecm, setEcm] = useState(33000); // Default for C30/37 (33,000 MPa)
  const [beanspruchung, setBeanspruchung] = useState<'biegung' | 'zug'>('biegung');
  const [zwangNach28d, setZwangNach28d] = useState(false);
  const [kt, setKt] = useState(0.4); // 0.4: langzeitig, 0.6: kurzzeitig

  const as = useMemo(() => {
    const barArea = (Math.PI * Math.pow(phiS, 2)) / 4;
    const barCount = b / (spacing * 10);
    return barCount * barArea;
  }, [phiS, spacing, b]);

  const Es = 200000; // MPa

  // Handle Concrete Class selection
  const handleConcreteChange = (selectedClass: string) => {
    setConcreteClass(selectedClass);
    if (CONCRETE_DATA[selectedClass]) {
      setFctEff(CONCRETE_DATA[selectedClass].fctm);
      setEcm(CONCRETE_DATA[selectedClass].ecm);
    }
  };

  // Calculate effective tension area A_ct,eff
  const d = h - cNom - phiS / 2;
  const hc_ef = Math.min(2.5 * (h - d), h / 2); // Simplified without neutral axis x
  const actEff = b * hc_ef;

  const rhoPEff = as / actEff;

  // Wirksame Betonzugfestigkeit: Wenn Zwang nach 28 d möglich ist, gilt f_ct,eff >= 3.0 MPa
  const effectiveFct = zwangNach28d ? Math.max(fctEff, EC2_NA_DE.fctEffMinLangzeit) : fctEff;
  
  // Max crack spacing sr,max nach DIN EN 1992-1-1/NA DE (ohne k1, k2, k3, k4)
  const srMax = Math.min(
    phiS / (3.6 * rhoPEff),
    (sigmaS * phiS) / (3.6 * effectiveFct)
  );
  
  // Strain difference using dynamic ecm
  const alphaE = Es / ecm;
  const epsSmEpsCm = Math.max(
    (sigmaS - kt * (effectiveFct / rhoPEff) * (1 + alphaE * rhoPEff)) / Es,
    (0.6 * sigmaS) / Es
  );
  
  // Calculated crack width
  const wkCalc = srMax * epsSmEpsCm;

  // Mindestbewehrung zur Begrenzung der Rissbreite nach DIN EN 1992-1-1/NA
  const kFactor = EC2_NA_DE.kAsMin(h);
  const kcFactor = beanspruchung === 'biegung' ? 0.4 : 1.0;
  const act = beanspruchung === 'biegung' ? (b * h) / 2 : b * h;
  const asMinReq = (kcFactor * kFactor * effectiveFct * act) / sigmaS;

  const isOk = wkCalc <= wkReq;

  const chartData = useMemo(() => {
    const dataWk = [];
    const dataWkReq = [];

    for (let a = 100; a <= 5000; a += 100) {
      const rho_p_eff = a / actEff;
      const sr_max = Math.min(
        phiS / (3.6 * rho_p_eff),
        (sigmaS * phiS) / (3.6 * effectiveFct)
      );
      const eps_sm_eps_cm = Math.max(
        (sigmaS - kt * (effectiveFct / rho_p_eff) * (1 + alphaE * rho_p_eff)) / Es,
        (0.6 * sigmaS) / Es
      );
      const wk = sr_max * eps_sm_eps_cm;
      
      dataWk.push({ x: a, y: wk });
      dataWkReq.push({ x: a, y: wkReq });
    }

    return {
      datasets: [
        {
          type: 'line' as const,
          label: 'Berechnete Rissbreite w_k',
          data: dataWk,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(163, 17, 62, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.1,
        },
        {
          type: 'line' as const,
          label: 'Zulässige Rissbreite w_k,req',
          data: dataWkReq,
          borderColor: '#A3113E',
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          type: 'scatter' as const,
          label: 'Aktueller A_s',
          data: [{ x: as, y: wkCalc }],
          borderColor: '#475569',
          backgroundColor: '#475569',
          pointRadius: 6,
          pointHoverRadius: 8,
          showLine: false,
        }
      ],
    };
  }, [actEff, phiS, sigmaS, effectiveFct, wkReq, as, wkCalc, kt, alphaE]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(3) + ' mm';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Bewehrungsquerschnitt A_s [mm²]'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Rissbreite w_k [mm]'
        },
        beginAtZero: true,
        max: Math.max(1.0, wkReq * 1.5, wkCalc * 1.1)
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /> Rissbreitenbegrenzung (EC2)
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300">
            Berechnet nach DIN EN 1992-1-1 + NA (DE)
          </span>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Risse im Beton sind unvermeidbar, müssen aber begrenzt werden, um Dauerhaftigkeit und Gebrauchstauglichkeit sicherzustellen. Die Berechnung erfolgt nach DIN EN 1992-1-1 mit dem Nationalen Anhang für Deutschland (NA DE).
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-main"><FormulaText text="Zulässige Rissbreite (w_{k,max})" /></label>
            <InfoTooltip text="Anforderung an w_k,max nach DIN EN 1992-1-1/NA für Stahlbeton (ohne Vorspannung). In Deutschland gilt für alle Klassen außer X0 und XC1 der Grenzwert 0,3 mm." />
          </div>
          <select 
            className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz text-sm"
            value={wkReq}
            onChange={(e) => setWkReq(Number(e.target.value))}
          >
            <option value={EC2_NA_DE.wmax_StB.XC1}>0.4 mm (X0, XC1)</option>
            <option value={EC2_NA_DE.wmax_StB.XC2}>0.3 mm (XC2, XC3, XC4, XD1–3, XS1–3)</option>
          </select>
        </div>

        <Slider
          info="Nennmaß der Betondeckung nach DIN EN 1992-1-1/NA. Schützt den Bewehrungsstahl vor Umwelteinflüssen."
          label={<FormulaText text="Betondeckung (c_{nom})" />}
          min={10} max={70} step={1}
          value={cNom} unit="mm"
          onChange={(e) => setCNom(Number(e.target.value))}
        />
        
        <Slider
          info="Außendurchmesser des gewählten Bewehrungsstabs der Zugbewehrung."
          label={<FormulaText text="Stabdurchmesser (Ø_s)" />}
          min={6} max={40} step={2}
          value={phiS} unit="mm"
          onChange={(e) => setPhiS(Number(e.target.value))}
        />
        
        <Slider
          info="Spannung in der Zugbewehrung im gerissenen Zustand (Zustand II) unter der maßgebenden quasi-ständigen bzw. häufigen Lastkombination."
          label={<FormulaText text="Stahlspannung (σ_s)" />}
          min={50} max={400} step={10}
          value={sigmaS} unit="MPa"
          onChange={(e) => setSigmaS(Number(e.target.value))}
        />

        <Slider
          label={<FormulaText text="Bauteildicke (h)" />}
          min={100} max={1000} step={10}
          value={h} unit="mm"
          info="Gesamtdicke des Bauteils."
          onChange={(e) => setH(Number(e.target.value))}
        />

        <Slider
          label={<FormulaText text="Bauteilbreite (b)" />}
          min={100} max={2000} step={50}
          value={b} unit="mm"
          onChange={(e) => setB(Number(e.target.value))}
        />

        <Slider
          info="Stababstand in cm für die Verteilung der Bewehrung."
          label="Stababstand (s)"
          min={5} max={50} step={1}
          value={spacing} unit="cm"
          onChange={(e) => setSpacing(Number(e.target.value))}
        />

        <div className="bg-slate-50 border border-home-grau/30 p-3 rounded-xl text-xs space-y-1.5 mt-1">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Bewehrungsauswahl:</span>
            <span className="font-bold text-slate-800 font-sans">
              Ø {phiS} in {spacing} cm Abstand
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-home-grau/30 pt-1.5">
            <span className="text-slate-500">Querschnittsfläche <FormulaText text="A_s" />:</span>
            <span className="font-mono font-bold text-slate-700">{as.toFixed(0)} mm²</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-main">Betonfestigkeitsklasse</label>
            <InfoTooltip text="Auswahl der Standard-Festigkeitsklasse nach EC2. Aktualisiert f_ct,eff und den Elastizitätsmodul E_cm." />
          </div>
          <select 
            className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz text-sm"
            value={concreteClass}
            onChange={(e) => handleConcreteChange(e.target.value)}
          >
            <option value="C20/25">C20/25 (E_cm = 30 GPa)</option>
            <option value="C25/30">C25/30 (E_cm = 31 GPa)</option>
            <option value="C30/37">C30/37 (E_cm = 33 GPa - Standard)</option>
            <option value="C35/45">C35/45 (E_cm = 34 GPa)</option>
            <option value="C40/50">C40/50 (E_cm = 35 GPa)</option>
            <option value="C45/55">C45/55 (E_cm = 36 GPa)</option>
            <option value="C50/60">C50/60 (E_cm = 37 GPa)</option>
          </select>
        </div>

        <Slider
          info="Effektive Betonzugfestigkeit im Risszeitpunkt (kann manuell angepasst werden)."
          label={<FormulaText text="Betonzugfestigkeit (f_{ct,eff})" />}
          min={1.0} max={5.0} step={0.1}
          value={fctEff} unit="MPa"
          onChange={(e) => setFctEff(Number(e.target.value))}
        />

        <div className="flex flex-col gap-4 border-t border-home-grau/30 pt-4 mt-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-main">Beanspruchungsart</label>
              <InfoTooltip text="Für Biegung gilt kc = 0,4 mit Act = 0,5 * b * h. Für reinen Zug gilt kc = 1,0 mit Act = b * h." />
            </div>
            <select 
              className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz text-sm"
              value={beanspruchung}
              onChange={(e) => setBeanspruchung(e.target.value as 'biegung' | 'zug')}
            >
              <option value="biegung">Biegung (k_c = 0.4)</option>
              <option value="zug">Reiner Zug (k_c = 1.0)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 p-3 bg-off-white rounded-xl border border-home-grau/30">
            <input
              type="checkbox"
              id="zwang28d"
              checked={zwangNach28d}
              onChange={(e) => setZwangNach28d(e.target.checked)}
              className="rounded text-shiraz focus:ring-shiraz cursor-pointer"
            />
            <label htmlFor="zwang28d" className="text-xs text-text-main cursor-pointer">
              <strong>Zwang nach 28 d möglich</strong>: <FormulaText text="f_{ct,eff} \ge 3{,}0\text{ MPa}" /> (NA DE)
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-main"><FormulaText text="Lasteinwirkungsdauer (k_t)" /></label>
              <InfoTooltip text="Berücksichtigt den Abbau der Mitwirkung des Betons auf Zug zwischen den Rissen durch Kriechen." />
            </div>
            <select 
              className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz text-sm"
              value={kt}
              onChange={(e) => setKt(Number(e.target.value))}
            >
              <option value={0.4}>0.4 (Langzeitige / Wiederholte Belastung)</option>
              <option value={0.6}>0.6 (Kurzzeitige Belastung)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col items-center justify-center">
          <div className="flex justify-between items-start w-full mb-4">
            <h3 className="text-sm font-bold text-text-main">Querschnitt &amp; Wirksame Zugzone</h3>
            <div className="text-xs text-home-grau bg-off-white px-2 py-1 rounded">
              Hinweis: <FormulaText text="h_{c,ef}" /> wird hier vereinfacht ohne Druckzonenhöhe <FormulaText text="x" /> berechnet.
            </div>
          </div>
          <svg width="100%" height="250" viewBox="0 0 500 250" className="max-w-md">
            <defs>
              <pattern id="concrete" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="4" cy="4" r="1.5" fill="#cbd5e1" />
                <circle cx="14" cy="12" r="2" fill="#cbd5e1" />
                <circle cx="8" cy="18" r="1" fill="#cbd5e1" />
                <path d="M 10 5 L 12 7 L 10 9 Z" fill="#94a3b8" />
              </pattern>
              <pattern id="tensionArea" patternUnits="userSpaceOnUse" width="10" height="10">
                <path d="M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9" stroke="#A3113E" strokeWidth="1" opacity="0.3" />
              </pattern>
            </defs>
            
            {/* Concrete Cross Section */}
            <rect x="100" y="20" width="300" height="200" fill="url(#concrete)" stroke="#475569" strokeWidth="2" />
            
            {/* Effective Tension Area (hc_ef) */}
            <rect x="100" y={220 - (hc_ef / h) * 200} width="300" height={(hc_ef / h) * 200} fill="url(#tensionArea)" />
            <rect x="100" y={220 - (hc_ef / h) * 200} width="300" height={(hc_ef / h) * 200} fill="rgba(163, 17, 62, 0.05)" stroke="#A3113E" strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Rebar */}
            <circle cx="250" cy={220 - (cNom / h) * 200 - (phiS / h) * 100} r={(phiS / h) * 100} fill="#1e293b" />
            
            {/* Dimensions */}
            <line x1="80" y1="20" x2="80" y2="220" stroke="#64748b" strokeWidth="1" />
            <line x1="75" y1="20" x2="85" y2="20" stroke="#64748b" strokeWidth="1" />
            <line x1="75" y1="220" x2="85" y2="220" stroke="#64748b" strokeWidth="1" />
            <text x="70" y="125" textAnchor="end" fontSize="12" fill="#64748b">h</text>
            
            <line x1="420" y1={220 - (hc_ef / h) * 200} x2="420" y2="220" stroke="#A3113E" strokeWidth="1" />
            <line x1="415" y1={220 - (hc_ef / h) * 200} x2="425" y2={220 - (hc_ef / h) * 200} stroke="#A3113E" strokeWidth="1" />
            <line x1="415" y1="220" x2="425" y2="220" stroke="#A3113E" strokeWidth="1" />
            <text x="430" y={220 - (hc_ef / h) * 100 + 4} textAnchor="start" fontSize="12" fill="#A3113E">
              h<tspan dy="4" fontSize="9">c,ef</tspan>
            </text>

            <line x1="250" y1={220 - (cNom / h) * 200} x2="250" y2="220" stroke="#475569" strokeWidth="1" />
            <text x="260" y={220 - (cNom / h) * 100 + 4} textAnchor="start" fontSize="12" fill="#475569">
              c<tspan dy="4" fontSize="9">nom</tspan>
            </text>
            
            <line x1="100" y1="235" x2="400" y2="235" stroke="#64748b" strokeWidth="1" />
            <line x1="100" y1="230" x2="100" y2="240" stroke="#64748b" strokeWidth="1" />
            <line x1="400" y1="230" x2="400" y2="240" stroke="#64748b" strokeWidth="1" />
            <text x="250" y="248" textAnchor="middle" fontSize="12" fill="#64748b">b</text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col">
            <h3 className="text-sm font-bold text-text-main mb-3">Berechnungsergebnisse (NA DE)</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-text-main/80 flex items-center gap-1">
                  <FormulaText text="Wirksame Zugzone (A_{ct,eff}):" />
                  <InfoTooltip text="Abgeminderte wirksame Zugzone des Betons um die Bewehrungslagen nach DIN EN 1992-1-1." />
                </span>
                <span className="text-text-main font-bold">{actEff.toFixed(0)} mm²</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-main/80"><FormulaText text="Effektiver Bewehrungsgrad (ρ_{p,eff}):" /></span>
                <span className="text-text-main font-bold">{(rhoPEff * 100).toFixed(2)} %</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-main/80 flex items-center gap-1">
                  <FormulaText text="Max. Rissabstand (s_{r,max}):" />
                  <InfoTooltip text="In Deutschland (NA DE) gilt die EC-Empfehlung mit k3 = 3,4 und k4 = 0,425 nicht. Nach DIN EN 1992-1-1/NA Gl. (7.11DE) gilt: sr,max = min( Ø / (3.6*rho_p,eff) ; sigma_s*Ø / (3.6*fct,eff) )." />
                </span>
                <span className="text-text-main font-bold">{srMax.toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-main/80"><FormulaText text="Mittlere Dehnungsdifferenz (ε_{sm} - ε_{cm}):" /></span>
                <span className="text-text-main font-bold">{(epsSmEpsCm * 1000).toFixed(3)} ‰</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-home-grau/25 pt-2 mt-1">
                <span className="text-text-main/80 flex items-center gap-1">
                  <FormulaText text="Mindestbewehrung (A_{s,min}):" />
                  <InfoTooltip text="Erforderliche Mindestbewehrung zur Begrenzung der Rissbreite nach DIN EN 1992-1-1/NA mit k aus kAsMin(h)." />
                </span>
                <span className="text-text-main font-bold">{asMinReq.toFixed(0)} mm²</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-main/80">Vorhandene Bewehrung:</span>
                <span className="font-semibold text-slate-800 font-sans">
                  Ø {phiS} in {spacing} cm Abstand
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-main/80">Vorhandenes <FormulaText text="A_s" />:</span>
                <span className={`font-bold text-xs px-2 py-0.5 rounded ${as >= asMinReq ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {as.toFixed(0)} mm² {as >= asMinReq ? ' (Ausreichend)' : ' (Zu gering!)'}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-home-grau/30 pt-3 mt-1">
                <span className="text-text-main font-bold text-base"><FormulaText text="Berechnete Rissbreite (w_{k}):" /></span>
                <span className={`font-bold text-lg ${isOk ? 'text-emerald-600' : 'text-torch-red'}`}>
                  {wkCalc.toFixed(3)} mm
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-center items-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${isOk ? 'bg-emerald-100 text-emerald-600' : 'bg-torch-red/10 text-torch-red'}`}>
              {isOk ? (
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h3 className={`text-xl font-bold ${isOk ? 'text-emerald-600' : 'text-torch-red'}`}>
              {isOk ? 'Nachweis erfüllt' : 'Nachweis nicht erfüllt'}
            </h3>
            <p className="text-sm text-text-main/80 mt-2">
              {isOk 
                ? `Die berechnete Rissbreite (${wkCalc.toFixed(3)} mm) ist kleiner oder gleich der zulässigen Rissbreite (${wkReq.toFixed(3)} mm).` 
                : `Die berechnete Rissbreite (${wkCalc.toFixed(3)} mm) überschreitet die zulässige Rissbreite (${wkReq.toFixed(3)} mm). Erhöhe den Bewehrungsgrad (A_s) oder verringere den Stabdurchmesser (Ø_s).`}
              {as < asMinReq && (
                <span className="block mt-2 text-amber-600 font-semibold text-xs bg-amber-50 p-2 rounded border border-amber-200">
                  Hinweis: Der vorhandene Bewehrungsquerschnitt ({as.toFixed(0)} mm²) unterschreitet die rechnerische Mindestbewehrung zur Rissbegrenzung A_s,min ({asMinReq.toFixed(0)} mm²) nach DIN EN 1992-1-1/NA.
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col">
          <h3 className="text-sm font-bold text-text-main mb-4">Rissbreite in Abhängigkeit vom Bewehrungsquerschnitt</h3>
          <div className="h-[300px] w-full">
            <Chart type="line" data={chartData} options={chartOptions} />
          </div>
        </div>

        <CalculatorDisclaimerBanner className="my-2" />
      <ModuleFooter 
          wikipedia={[
            { title: 'Rissbreitenbeschränkung', url: 'https://de.wikipedia.org/wiki/Rissbreitenbeschr%C3%A4nkung' },
            { title: 'Eurocode 2', url: 'https://de.wikipedia.org/wiki/Eurocode_2' },
            { title: 'Betonstahl', url: 'https://de.wikipedia.org/wiki/Betonstahl' }
          ]}
          regelwerke={[
            { title: 'DIN EN 1992-1-1:2023-08 / DIN EN 1992-1-1/NA:2013-04 (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken – Abschnitt 7.3: Rissbreitenbegrenzung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' }
          ]}
          literatur={[
            'Zilch, K., Zehetmaier, G.: Bemessung im Konstruktiven Betonbau (2010)',
            'Goris, A. et al.: Rissbreitenbegrenzung nach Eurocode 2 (2014)'
          ]}
          formeln={[
            {
              formel: 'w_{k} = s_{r,max} \\cdot (\\varepsilon_{sm} - \\varepsilon_{cm})',
              erklaerung: 'Charakteristische Rissbreite\nw_k: Berechnete charakteristische Rissbreite [mm]\ns_r,max: Maximaler Rissabstand [mm]\nε_sm: Mittlere Stahldehnung unter der relevanten Einwirkungskombination [-]\nε_cm: Mittlere Betondehnung zwischen den Rissen [-]',
              quelle: 'DIN EN 1992-1-1 Gl. (7.8)'
            },
            {
              formel: 's_{r,max} = \\min \\left( \\frac{\\varnothing}{3{,}6 \\cdot \\rho_{p,eff}} \\,;\\, \\frac{\\sigma_s \\cdot \\varnothing}{3{,}6 \\cdot f_{ct,eff}} \\right)',
              erklaerung: 'Maximaler Rissabstand nach deutschem Nationalem Anhang (NA DE).\nØ: Stabdurchmesser [mm]\nρ_p,eff: Effektiver Bewehrungsgrad (A_s / A_{c,eff}) [-]\nσ_s: Stahlspannung im Zustand II [MPa]\nf_ct,eff: Effektive Betonzugfestigkeit [MPa]. Die europäische EC-Empfehlung mit k3 und k4 gilt in Deutschland nicht.',
              quelle: 'DIN EN 1992-1-1/NA Gl. (7.11DE)'
            },
            {
              formel: 'A_{s,min} = k_c \\cdot k \\cdot f_{ct,eff} \\cdot \\frac{A_{ct}}{\\sigma_s}',
              erklaerung: 'Mindestbewehrung zur Begrenzung der Rissbreite nach DIN EN 1992-1-1/NA Abs. 7.3.2.\nk: Beiwert für nichtlineare Eigenspannungen aus kAsMin(h)\nk_c: Beiwert für die Spannungsverteilung vor der Erstrissbildung (0,4 bei Biegung)\nA_ct: Betonzugzone vor Erstrissbildung [mm²]\nσ_s: Maximal zulässige Stahlspannung unmittelbar nach Erstrissbildung [MPa]',
              quelle: 'DIN EN 1992-1-1/NA Abs. 7.3.2'
            },
            {
              formel: '\\varepsilon_{sm} - \\varepsilon_{cm} = \\frac{\\sigma_s - k_t \\cdot \\frac{f_{ct,eff}}{\\rho_{p,eff}} \\cdot (1 + \\alpha_e \\cdot \\rho_{p,eff})}{E_s} \\ge 0{,}6 \\cdot \\frac{\\sigma_s}{E_s}',
              erklaerung: 'Dehnungsdifferenz nach DIN EN 1992-1-1 Gl. (7.9).\nσ_s: Stahlspannung im gerissenen Zustand [MPa]\nk_t: Beiwert für Lasteinwirkungsdauer (0,6 für kurzzeitig, 0,4 für langzeitig)\nf_ct,eff: Effektive Betonzugfestigkeit [MPa]\nρ_p,eff: Effektiver Bewehrungsgrad (A_s / A_{c,eff}) [-]\nα_e: Modulverhältnis (E_s / E_{cm}) [-]\nE_s: Elastizitätsmodul des Betonstahls (200.000 MPa)',
              quelle: 'DIN EN 1992-1-1 Gl. (7.9)'
            }
          ]}
        />
      </div>
    </div>
  );
}
