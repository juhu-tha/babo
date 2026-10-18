import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Mountain, Droplets, Activity, MoveHorizontal, Clock, Scissors, ArrowDownToLine, Timer } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { formatDeZahl } from '@/src/utils/numberFormat';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Bodenmechanik() {
  const [activeTab, setActiveTab] = useState<'konsistenz' | 'scherfestigkeit' | 'erddruck' | 'konsolidierung'>('konsistenz');

  // Konsistenzgrenzen State
  const [w, setW] = useState(25); // Natürlicher Wassergehalt
  const [wL, setWL] = useState(45); // Fließgrenze (Liquid Limit)
  const [wP, setWP] = useState(20); // Ausrollgrenze (Plastic Limit)

  const results = useMemo(() => {
    // Plastizitätszahl I_P = w_L - w_P
    const iP = wL - wP;

    // Konsistenzzahl I_c = (w_L - w) / I_P
    const iC = iP !== 0 ? (wL - w) / iP : 0;

    let zustand = '';
    let farbe = 'bg-gray-500';

    if (iC < 0) {
      zustand = 'flüssig';
      farbe = 'bg-blue-500';
    } else if (iC >= 0 && iC < 0.5) {
      zustand = 'breiig';
      farbe = 'bg-teal-500';
    } else if (iC >= 0.5 && iC < 0.75) {
      zustand = 'weich';
      farbe = 'bg-green-500';
    } else if (iC >= 0.75 && iC < 1.0) {
      zustand = 'steif';
      farbe = 'bg-yellow-600';
    } else {
      zustand = 'halbfest / fest';
      farbe = 'bg-amber-800';
    }

    // Bodenklassifikation nach DIN 18196 / Casagrande (vereinfacht)
    let klasse = '';
    const aLine = 0.73 * (wL - 20); // A-Linie im Plastizitätsdiagramm
    
    if (iP >= aLine && iP >= 4) {
      if (wL < 35) klasse = 'TL (Ton, leicht plastisch)';
      else if (wL <= 50) klasse = 'TM (Ton, mittelplastisch)';
      else klasse = 'TA (Ton, ausgeprägt plastisch)';
    } else {
      if (wL < 35) klasse = 'UL (Schluff, leicht plastisch) oder organisch (OU)';
      else if (wL <= 50) klasse = 'UM (Schluff, mittelplastisch) oder organisch (OM)';
      else klasse = 'UA (Schluff, ausgeprägt plastisch) oder organisch (OA)';
    }

    return { iP, iC, zustand, farbe, klasse };
  }, [w, wL, wP]);

  // Scherfestigkeit State
  const [c, setC] = useState(10); // Kohäsion in kN/m²
  const [phi, setPhi] = useState(30); // Reibungswinkel in Grad
  const [sigma3, setSigma3] = useState(50); // Kleinste Hauptspannung in kN/m²
  const [sigma1, setSigma1] = useState(150); // Größte Hauptspannung in kN/m²

  const shearResults = useMemo(() => {
    // Mohr-Coulomb: tau = c + sigma * tan(phi)
    const phiRad = (phi * Math.PI) / 180;
    
    const center = (sigma1 + sigma3) / 2;
    const radius = Math.abs(sigma1 - sigma3) / 2;
    
    // Distance from center to failure envelope
    const distanceToEnvelope = center * Math.sin(phiRad) + c * Math.cos(phiRad);
    const isFailing = radius > distanceToEnvelope + 0.1; // Add small epsilon for floating point
    
    // Calculate sigma1 at failure for the given sigma3
    const tan45PlusPhiHalf = Math.tan(Math.PI/4 + phiRad/2);
    const sigma1_f = sigma3 * Math.pow(tan45PlusPhiHalf, 2) + 2 * c * tan45PlusPhiHalf;

    const maxSigma = Math.max(300, sigma1 * 1.2, sigma1_f * 1.2);
    
    const envelopeData = [
      { x: 0, y: c },
      { x: maxSigma, y: c + maxSigma * Math.tan(phiRad) }
    ];

    // Generate Mohr's circle (upper half)
    const circleData = [];
    const numPoints = 100;
    for (let i = 0; i <= numPoints; i++) {
      const theta = Math.PI * (i / numPoints); // 0 to PI
      const x = center + radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      circleData.push({ x, y });
    }
    // Sort by x for Line chart
    circleData.sort((a, b) => a.x - b.x);

    const chartData = {
      datasets: [
        {
          label: 'Bruchgerade (Mohr-Coulomb)',
          data: envelopeData,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'Mohrscher Spannungskreis',
          data: circleData,
          borderColor: isFailing ? '#A3113E' : '#A3113E',
          backgroundColor: isFailing ? 'rgba(239, 68, 68, 0.2)' : 'rgba(139, 21, 56, 0.2)',
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
        }
      ]
    };

    return { center, radius, isFailing, sigma1_f, chartData, maxSigma };
  }, [c, phi, sigma1, sigma3]);

  // Erddruck State
  const [phiErddruck, setPhiErddruck] = useState(30); // Reibungswinkel in Grad
  const [gamma, setGamma] = useState(20); // Wichte in kN/m³
  const [h, setH] = useState(5); // Wandhöhe in m

  const erddruckResults = useMemo(() => {
    const phiRad = (phiErddruck * Math.PI) / 180;
    
    // Erddruckbeiwerte nach Rankine
    const k_a = Math.pow(Math.tan(Math.PI/4 - phiRad/2), 2);
    const k_p = Math.pow(Math.tan(Math.PI/4 + phiRad/2), 2);
    const k_0 = 1 - Math.sin(phiRad);

    // Erddruckordinaten an der Wandbasis
    const e_a = k_a * gamma * h;
    const e_p = k_p * gamma * h;
    const e_0 = k_0 * gamma * h;

    // Resultierende Erddruckkräfte
    const E_a = 0.5 * e_a * h;
    const E_p = 0.5 * e_p * h;
    const E_0 = 0.5 * e_0 * h;

    const chartData = {
      datasets: [
        {
          label: 'Aktiver Erddruck e_a',
          data: [{x: 0, y: 0}, {x: e_a, y: h}],
          borderColor: '#A3113E',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          fill: true,
          borderWidth: 2,
        },
        {
          label: 'Erdruhedruck e_0',
          data: [{x: 0, y: 0}, {x: e_0, y: h}],
          borderColor: '#475569',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
          borderWidth: 2,
        },
        {
          label: 'Passiver Erddruck e_p',
          data: [{x: 0, y: 0}, {x: e_p, y: h}],
          borderColor: '#475569',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          borderWidth: 2,
          borderDash: [5, 5],
        }
      ]
    };

    return { k_a, k_p, k_0, E_a, E_p, E_0, chartData };
  }, [phiErddruck, gamma, h]);

  // Konsolidierung State
  const [hSchicht, setHSchicht] = useState(4); // Schichtdicke in m
  const [deltaSigma, setDeltaSigma] = useState(50); // Zusatzspannung in kN/m²
  const [es, setEs] = useState(5); // Steifemodul in MN/m²
  const [cv, setCv] = useState(2); // Konsolidierungsbeiwert in m²/Jahr
  const [drainage, setDrainage] = useState<'einseitig' | 'zweiseitig'>('zweiseitig');

  const konsolidierungResults = useMemo(() => {
    // Endsetzung s = (deltaSigma / Es) * h
    // Umrechnung Es von MN/m² in kN/m² -> * 1000
    const s_end = (deltaSigma / (es * 1000)) * hSchicht * 1000; // in mm

    // Entwässerungsweg d
    const d = drainage === 'zweiseitig' ? hSchicht / 2 : hSchicht;

    // Zeit für Konsolidierungsgrade
    // Tv = (cv * t) / d^2  => t = (Tv * d^2) / cv
    // Tv für U=50% approx 0.197
    // Tv für U=90% approx 0.848
    const t_50 = (0.197 * d * d) / cv;
    const t_90 = (0.848 * d * d) / cv;

    // Zeit-Setzungs-Kurve
    const labels = [];
    const setzungsData = [];
    const maxT = Math.ceil(t_90 * 1.5);
    const step = maxT / 50;

    for (let t = 0; t <= maxT; t += step) {
      const Tv = (cv * t) / (d * d);
      let U = 0;
      if (Tv <= 0.283) {
        U = Math.sqrt((4 * Tv) / Math.PI);
      } else {
        U = 1 - Math.pow(10, -(Tv + 0.085) / 0.933);
      }
      setzungsData.push({ x: t, y: s_end * U });
    }

    const chartData = {
      datasets: [
        {
          label: 'Setzung s(t) [mm]',
          data: setzungsData,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(163, 17, 62, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        }
      ]
    };

    return { s_end, t_50, t_90, chartData };
  }, [hSchicht, deltaSigma, es, cv, drainage]);

  const scherfestigkeitChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: { display: true, text: 'Normalspannung σ (kN/m²)', font: { weight: 'bold' as const } },
        min: 0,
        max: shearResults.maxSigma
      },
      y: {
        title: { display: true, text: 'Scherspannung τ (kN/m²)', font: { weight: 'bold' as const } },
        min: 0,
      }
    }
  };

  const erddruckChartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: { display: true, text: 'Erddruckordinate e (kN/m²)', font: { weight: 'bold' as const } },
        min: 0,
      },
      y: {
        type: 'linear' as const,
        title: { display: true, text: 'Tiefe z (m)', font: { weight: 'bold' as const } },
        reverse: true,
        min: 0,
        max: h,
      }
    }
  };

  const konsolidierungChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: { display: true, text: 'Zeit t [Jahre]', font: { weight: 'bold' as const } },
        min: 0,
      },
      y: {
        title: { display: true, text: 'Setzung s [mm]', font: { weight: 'bold' as const } },
        reverse: true, // Setzung nach unten
        min: 0,
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'konsistenz' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('konsistenz')}>
          <Droplets size={16} /> Konsistenzgrenzen
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'scherfestigkeit' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('scherfestigkeit')}>
          <Scissors size={16} /> Scherfestigkeit
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'erddruck' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('erddruck')}>
          <ArrowDownToLine size={16} /> Erddruck
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'konsolidierung' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('konsolidierung')}>
          <Timer size={16} /> Konsolidierung
        </button>
      </div>

      {activeTab === 'konsistenz' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
          <Droplets className="text-shiraz" /> Erdbau &amp; Bodenmechanik (Konsistenzgrenzen)
          <InfoTooltip text="Berechnung von Plastizitätszahl und Konsistenzzahl nach Atterberg zur Klassifikation bindiger Böden." />
        </h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
          <p>
            Bindige Böden (Ton, Schluff) ändern ihre Eigenschaften stark mit dem Wassergehalt (w). Die Atterbergschen Grenzen definieren die Übergänge zwischen den Zustandsformen: Die Ausrollgrenze (w_P) trennt halbfest von plastisch, die Fließgrenze (w_L) trennt plastisch von flüssig. Die Plastizitätszahl (I_P = w_L - w_P) gibt den Bereich an, in dem der Boden plastisch verformbar ist. Die Konsistenzzahl (I_c) beschreibt den aktuellen Zustand des Bodens in der Natur.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Eingabeparameter (Wassergehalte in %)</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <Slider info="Aktueller, natürlicher Wassergehalt des Bodens in Prozent." label={<FormulaText text="Natürlicher Wassergehalt (w)" />} min={5} max={80} step={1} value={w} unit="%" onChange={(e) => setW(Number(e.target.value))} />
                <Slider label={<FormulaText text="Fließgrenze (w_L)" />} info="Liquid Limit: Wassergehalt am Übergang vom plastischen zum flüssigen Zustand (Casagrande-Gerät)." min={20} max={100} step={1} value={wL} unit="%" onChange={(e) => setWL(Number(e.target.value))} />
                <Slider info="Plastic Limit: Wassergehalt am Übergang vom halbfesten zum plastischen Zustand (Faden-Ausroll-Versuch)." label={<FormulaText text="Ausrollgrenze (w_P)" />}  min={10} max={50} step={1} value={wP} unit="%" onChange={(e) => setWP(Number(e.target.value))} />
              </div>
              
              {wP >= wL && (
                <div className="mt-4 text-xs font-bold text-red-500 bg-red-50 p-2 rounded border border-red-200">
                  <FormulaText text="Fehler: Die Fließgrenze (w_L) muss größer sein als die Ausrollgrenze (w_P)!" />
                </div>
              )}
            </div>

            {/* Schematische Darstellung: Konsistenz */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Konsistenzbereiche</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="100" viewBox="0 0 350 100">
                  {/* Achse */}
                  <line x1="20" y1="50" x2="330" y2="50" stroke="#1e293b" strokeWidth="2" markerEnd="url(#arrow-black-boden)" />
                  <text x="330" y="40" fontSize="10" fill="#1e293b" textAnchor="end">Wassergehalt w</text>

                  {/* Bereiche */}
                  <rect x="20" y="55" width="100" height="15" fill="#f7ced6" />
                  <text x="70" y="85" fontSize="10" fill="#1e293b" textAnchor="middle">Fest / Halbfest</text>
                  
                  <rect x="120" y="55" width="100" height="15" fill="#cbd5e1" />
                  <text x="170" y="85" fontSize="10" fill="#1e293b" textAnchor="middle">Plastisch (I_P)</text>
                  
                  <rect x="220" y="55" width="100" height="15" fill="#cbd5e1" />
                  <text x="270" y="85" fontSize="10" fill="#1e293b" textAnchor="middle">Flüssig</text>

                  {/* Grenzen */}
                  <line x1="120" y1="40" x2="120" y2="70" stroke="#1e293b" strokeWidth="2" />
                  <text x="120" y="30" fontSize="10" fill="#1e293b" textAnchor="middle">w_P</text>
                  
                  <line x1="220" y1="40" x2="220" y2="70" stroke="#1e293b" strokeWidth="2" />
                  <text x="220" y="30" fontSize="10" fill="#1e293b" textAnchor="middle">w_L</text>

                  {/* Aktueller Wassergehalt (Marker) */}
                  {(() => {
                    // Skalierung für Marker: w_P = 120, w_L = 220
                    const range = wL - wP;
                    let markerX = 120 + ((w - wP) / range) * 100;
                    // Begrenzung für Anzeige
                    markerX = Math.max(30, Math.min(310, markerX));
                    return (
                      <g transform={`translate(${markerX}, 50)`}>
                        <polygon points="0,0 -5,-10 5,-10" fill="#A3113E" />
                        <text x="0" y="-15" fontSize="10" fill="#A3113E" textAnchor="middle" fontWeight="bold">w</text>
                      </g>
                    );
                  })()}

                  <defs>
                    <marker id="arrow-black-boden" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Die Konsistenzgrenzen w_P (Ausrollgrenze) und w_L (Fließgrenze) teilen das Verhalten bindiger Böden in fest/halbfest, plastisch und flüssig ein. Der rote Marker zeigt den aktuellen Zustand w.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className={`p-6 rounded-xl shadow-md text-white ${results.farbe}`}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Atterberg-Kennwerte</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                <div>
                  <div className="text-white/70 text-sm mb-1 flex items-center gap-1">
                    <FormulaText text="Plastizitätszahl (I_P)" />
                    <InfoTooltip text="I_P = w_L - w_P. Maß für die Plastizität des Bodens." />
                  </div>
                  <div className="text-3xl font-bold">{formatDeZahl(results.iP, 1)} %</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm mb-1 flex items-center gap-1">
                    <FormulaText text="Konsistenzzahl (I_c)" />
                    <InfoTooltip text="I_c = (w_L - w) / I_P. Beschreibt den aktuellen Zustand." />
                  </div>
                  <div className="text-3xl font-bold">{formatDeZahl(results.iC, 2)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-white/70 text-sm mb-1 flex items-center gap-1">
                    <Droplets size={16} /> Zustandsform (Konsistenz)
                  </div>
                  <div className="text-2xl font-bold uppercase tracking-wide">{results.zustand}</div>
                </div>
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="text-sm font-bold mb-1 flex items-center gap-2">
                  <Mountain size={16} /> Bodenklassifikation (vereinfacht)
                </div>
                <div className="text-sm leading-relaxed">
                  {results.klasse}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {activeTab === 'scherfestigkeit' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
            <Scissors className="text-shiraz" /> Scherfestigkeit nach Mohr-Coulomb
            <InfoTooltip text="Berechnung der Scherfestigkeit eines Bodens in Abhängigkeit von Kohäsion, Reibungswinkel und Normalspannung." />
          </h2>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
            <p>
              Das Bruchkriterium nach Mohr-Coulomb beschreibt die Scherfestigkeit von Böden. 
              Die Bruchbedingung lautet <strong>τ = c + σ · tan(φ)</strong>. 
              Der Spannungszustand im Boden wird durch den <strong>Mohrschen Spannungskreis</strong> (definiert durch die Hauptspannungen σ₁ und σ₃) dargestellt. 
              Berührt oder schneidet der Kreis die Bruchgerade, kommt es zum Versagen (Bruch) des Bodens.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Bodenparameter</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Slider info="Kohäsion des Bodens." label={<FormulaText text="Kohäsion (c)" />} min={0} max={100} step={1} value={c} unit="kN/m²" onChange={(e) => setC(Number(e.target.value))} />
                  <Slider  label={<FormulaText text="Reibungswinkel (\\varphi)" />} min={0} max={45} step={1} value={phi} unit="°" onChange={(e) => setPhi(Number(e.target.value))} />
                </div>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Spannungszustand</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Slider info="Kleinste Hauptspannung (z.B. Seitendruck im Triaxialversuch)." label={<FormulaText text="Kleinste Hauptspannung (\\sigma_3)" />} min={0} max={200} step={5} value={sigma3} unit="kN/m²" onChange={(e) => {
                    const val = Number(e.target.value);
                    setSigma3(val);
                    if (val > sigma1) setSigma1(val);
                  }} />
                  <Slider info="Größte Hauptspannung (z.B. Vertikaldruck)." label={<FormulaText text="Größte Hauptspannung (\\sigma_1)" />} min={0} max={500} step={5} value={sigma1} unit="kN/m²" onChange={(e) => {
                    const val = Number(e.target.value);
                    setSigma1(val);
                    if (val < sigma3) setSigma3(val);
                  }} />
                </div>
              </div>

              <div className={`p-6 rounded-xl shadow-md text-white transition-colors ${shearResults.isFailing ? 'bg-torch-red' : 'bg-emerald-600'}`}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Zustandsbewertung</h3>
                <div>
                  <div className="text-2xl font-bold mb-2">
                    {shearResults.isFailing ? 'Bruchzustand erreicht!' : 'Boden ist standsicher'}
                  </div>
                  <div className="text-white/80 text-sm">
                    <FormulaText text={`Max. ertragbare \\sigma_1 bei aktuellem \\sigma_3: ${formatDeZahl(shearResults.sigma1_f, 1)} kN/m²`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-xl border border-home-grau/30 h-[500px] flex flex-col">
                <h3 className="text-sm font-bold text-center mb-4">Mohr-Coulomb Bruchkriterium</h3>
                <div className="flex-1 relative">
                  <Line data={shearResults.chartData} options={scherfestigkeitChartOptions as any} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'erddruck' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
            <ArrowDownToLine className="text-shiraz" /> Erddruck nach Rankine
            <InfoTooltip text="Berechnung von aktivem, passivem und Erdruhedruck für eine senkrechte Wand und horizontale Geländeoberfläche." />
          </h2>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
            <p>
              Der Erddruck beschreibt die Belastung von Stützwänden durch den anstehenden Boden. 
              Der <strong>aktive Erddruck (E_a)</strong> entsteht, wenn die Wand vom Boden weg nachgibt. 
              Der <strong>passive Erddruck (E_p)</strong> entsteht, wenn die Wand in den Boden gedrückt wird (Erddruckwiderstand). 
              Der <strong>Erdruhedruck (E_0)</strong> wirkt auf eine unverschiebliche Wand (z.B. Kellerwand).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Geometrie & Boden</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Slider label={<FormulaText text="Wandhöhe (h)" />} info="Höhe der Stützwand bzw. der vertikalen Geländestufe." min={1} max={10} step={0.5} value={h} unit="m" onChange={(e) => setH(Number(e.target.value))} />
                  <Slider label={<FormulaText text="Wichte (\\gamma)" />} info="Die Wichte (feuchtes Raumgewicht) des anstehenden Bodens." min={15} max={22} step={0.5} value={gamma} unit="kN/m³" onChange={(e) => setGamma(Number(e.target.value))} />
                  <Slider info="Der charakteristische Reibungswinkel des Bodens zur Scherfestigkeitsberechnung." label={<FormulaText text="Reibungswinkel (\\varphi)" />} min={15} max={45} step={1} value={phiErddruck} unit="°" onChange={(e) => setPhiErddruck(Number(e.target.value))} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Erddruckbeiwerte</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                    <div className="text-xs text-red-800 font-bold mb-1"><FormulaText text="K_a" /></div>
                    <div className="text-lg font-mono text-red-600">{formatDeZahl(erddruckResults.k_a, 3)}</div>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-xs text-blue-800 font-bold mb-1"><FormulaText text="K_0" /></div>
                    <div className="text-lg font-mono text-blue-600">{formatDeZahl(erddruckResults.k_0, 3)}</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-xs text-green-800 font-bold mb-1"><FormulaText text="K_p" /></div>
                    <div className="text-lg font-mono text-green-600">{formatDeZahl(erddruckResults.k_p, 3)}</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl shadow-md text-white bg-shiraz transition-colors">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Resultierende Kräfte</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-white/80 text-sm"><FormulaText text="Aktiver Erddruck (E_a)" /></span>
                    <span className="text-xl font-bold">{formatDeZahl(erddruckResults.E_a, 1)} kN/m</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-white/80 text-sm"><FormulaText text="Erdruhedruck (E_0)" /></span>
                    <span className="text-xl font-bold">{formatDeZahl(erddruckResults.E_0, 1)} kN/m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm"><FormulaText text="Passiver Erddruck (E_p)" /></span>
                    <span className="text-xl font-bold">{formatDeZahl(erddruckResults.E_p, 1)} kN/m</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-xl border border-home-grau/30 h-[500px] flex flex-col">
                <h3 className="text-sm font-bold text-center mb-4">Erddruckverteilung über die Tiefe</h3>
                <div className="flex-1 relative">
                  <Line data={erddruckResults.chartData} options={erddruckChartOptions as any} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'konsolidierung' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
            <Timer className="text-shiraz" /> Konsolidierung (Eindimensionale Setzung)
            <InfoTooltip text="Berechnung der zeitlichen Entwicklung von Setzungen in bindigen Böden nach der Terzaghi-Theorie." />
          </h2>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
            <p>
              Bei bindigen, wassergesättigten Böden (z.B. Ton) führt eine Lasterhöhung zunächst zu einem Porenwasserüberdruck. Die Setzung erfolgt erst zeitverzögert, wenn das Wasser aus den Poren ausgepresst wird (Konsolidierung). Die Endsetzung s hängt von der Steifigkeit (E_s) ab, die Dauer vom Konsolidierungsbeiwert (c_v) und dem Entwässerungsweg (d).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Boden & Belastung</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Slider info="Dicke der Bodenschicht." label={<FormulaText text="Schichtdicke (h)" />} min={1} max={20} step={0.5} value={hSchicht} unit="m" onChange={(e) => setHSchicht(Number(e.target.value))} />
                  <Slider  label={<FormulaText text="Zusatzspannung (\\Delta\\sigma)" />} min={10} max={200} step={5} value={deltaSigma} unit="kN/m²" onChange={(e) => setDeltaSigma(Number(e.target.value))} />
                  <Slider info="Steifemodul des Bodens." label={<FormulaText text="Steifemodul (E_s)" />} min={1} max={20} step={0.5} value={es} unit="MN/m²" onChange={(e) => setEs(Number(e.target.value))} />
                  <Slider  label={<FormulaText text="Konsolidierungsbeiwert (c_v)" />} min={0.1} max={10} step={0.1} value={cv} unit="m²/Jahr" onChange={(e) => setCv(Number(e.target.value))} />
                  
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Entwässerung</label><InfoTooltip text="Art der Wasserableitung vom Bauteil." /></div>
                    <select 
                      className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                      value={drainage}
                      onChange={(e) => setDrainage(e.target.value as 'einseitig' | 'zweiseitig')}
                    >
                      <option value="zweiseitig">Zweiseitig (oben und unten durchlässig)</option>
                      <option value="einseitig">Einseitig (nur oben oder unten durchlässig)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl shadow-md text-white bg-shiraz transition-colors">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Ergebnisse</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="text-white/80 text-sm mb-1"><FormulaText text="Endsetzung (s_{end})" /></div>
                    <div className="text-3xl font-bold">{formatDeZahl(konsolidierungResults.s_end, 1)} mm</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                    <div>
                      <div className="text-white/80 text-xs mb-1 flex items-center gap-1"><Clock size={12}/> <FormulaText text="t_{50} (U=50\\%)" /></div>
                      <div className="text-xl font-bold">{formatDeZahl(konsolidierungResults.t_50, 1)} a</div>
                    </div>
                    <div>
                      <div className="text-white/80 text-xs mb-1 flex items-center gap-1"><Clock size={12}/> <FormulaText text="t_{90} (U=90\\%)" /></div>
                      <div className="text-xl font-bold">{formatDeZahl(konsolidierungResults.t_90, 1)} a</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-xl border border-home-grau/30 h-[400px] flex flex-col">
                <h3 className="text-sm font-bold text-center mb-4">Zeit-Setzungs-Verlauf</h3>
                <div className="flex-1 relative">
                  <Line data={konsolidierungResults.chartData} options={konsolidierungChartOptions as any} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ModuleFooter 
        wikipedia={[
        { title: 'Bodenmechanik', url: 'https://de.wikipedia.org/wiki/Bodenmechanik' },
        
        { title: 'Scherfestigkeit', url: 'https://de.wikipedia.org/wiki/Scherfestigkeit' },
        { title: 'Erddruck', url: 'https://de.wikipedia.org/wiki/Erddruck' },
        { title: 'Konsolidierung', url: 'https://de.wikipedia.org/wiki/Konsolidation_(Bodenmechanik)' }
      ]}
        literatur={[
          'Kolymbas, D. (2019): Geotechnik: Bodenmechanik, Grundbau und Tunnelbau (Springer-Verlag)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Simmer, K.: Grundbau 1: Bodenmechanik und erdstatische Berechnungen (Teubner Verlag)'
        ]}
        regelwerke={[
          { title: 'DIN EN 1997-1:2024-04 (Eurocode 7: Geotechnische Bemessung - Teil 1: Allgemeine Regeln)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN 1054:2021-04 (Baugrund - Sicherheitsnachweise im Erd- und Grundbau)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN 18122-1:2020-11 (Baugrund: Untersuchung von Bodenproben - Zustandsgrenzen / Konsistenzgrenzen)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN 4085:2017-08 (Baugrund - Berechnung des Erddrucks)', url: 'https://www.dinmedia.de/' }
        ]}
        formeln={[
          {
            formel: 'I_c = \\frac{w_L - w}{I_P}',
            erklaerung: 'Konsistenzzahl: I_c gibt die plastische Zustandsform bindiger Böden an (w_L = Fließgrenze, w = aktueller Wassergehalt, I_P = Plastizitätsindex).',
            quelle: 'DIN 18122'
          },
          {
            formel: '\\tau_f = c + \\sigma \\cdot \\tan(\\varphi)',
            erklaerung: 'Bruchkriterium nach Mohr-Coulomb: \\tau_f = Scherfestigkeit, c = Kohäsion, \\sigma = wirksame Normalspannung, \\varphi = Reibungswinkel.',
            quelle: 'DIN EN 1997-1 / DIN 1054'
          },
          {
            formel: 'K_a = \\tan^2\\left(45^\\circ - \\frac{\\varphi}{2}\\right)',
            erklaerung: 'Aktiver Erddruckbeiwert nach Rankine bei horizontaler Geländeoberfläche und reibungsfreier Wand.',
            quelle: 'DIN 4085'
          },
          {
            formel: 's = \\frac{\\Delta \\sigma}{E_s} \\cdot h',
            erklaerung: 'Eindimensionale Endsetzung einer Bodenschicht: \\Delta \\sigma = Spannungszuwachs, E_s = Steifemodul (Ödometerversuch), h = Schichtdicke.',
            quelle: 'DIN 4019'
          },
          {
            formel: 'T_v = \\frac{c_v \\cdot t}{d^2}',
            erklaerung: 'Zeitfaktor der Konsolidierung nach Terzaghi: c_v = Konsolidierungsbeiwert, d = maximaler Entwässerungsweg, t = Konsolidierungszeit.',
            quelle: 'Terzaghi: Theoretical Soil Mechanics'
          }
        ]}
      />
    </div>
  );
}
