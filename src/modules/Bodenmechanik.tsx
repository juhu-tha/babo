import { erddruckRankine, konsolidierung, mohrCoulomb, zustandsgrenzen } from '@/src/calc/boden';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Mountain, Droplets, Clock, Scissors, ArrowDownToLine, Timer } from 'lucide-react';
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
import '@/src/lib/chartSetup';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import inhalt from '@/content/bodenmechanik/Bodenmechanik.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
    const z = zustandsgrenzen(w, wL, wP);
    const farbe = z.zustand === 'flüssig' ? 'bg-blue-500' : z.zustand === 'breiig' ? 'bg-teal-500' : z.zustand === 'weich' ? 'bg-green-500'
      : z.zustand === 'steif' ? 'bg-yellow-600' : z.zustand === '–' ? 'bg-gray-500' : 'bg-amber-800';
    return { ...z, farbe };
  }, [w, wL, wP]);

  // Scherfestigkeit State
  const [c, setC] = useState(10); // Kohäsion in kN/m²
  const [phi, setPhi] = useState(30); // Reibungswinkel in Grad
  const [sigma3, setSigma3] = useState(50); // Kleinste Hauptspannung in kN/m²
  const [sigma1, setSigma1] = useState(150); // Größte Hauptspannung in kN/m²

  const shearResults = useMemo(() => {
    const mc = mohrCoulomb(c, phi, sigma1, sigma3);
    const phiRad = (phi * Math.PI) / 180;
    const { center, radius, isFailing } = mc;
    const sigma1_f = Number.isFinite(mc.sigma1_f) ? mc.sigma1_f : 0;
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
          label: inhalt.werte.bruchgeradeMohrCoulomb,
          data: envelopeData,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          label: inhalt.werte.mohrscherSpannungskreis,
          data: circleData,
          borderColor: isFailing ? '#A3113E' : '#A3113E',
          backgroundColor: isFailing ? 'rgba(239, 68, 68, 0.2)' : 'rgba(139, 21, 56, 0.2)',
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
        }
      ]
    };

    return { center, radius, isFailing, sigma1_f, chartData, maxSigma, hinweise: mc.hinweise };
  }, [c, phi, sigma1, sigma3]);

  // Erddruck State
  const [phiErddruck, setPhiErddruck] = useState(30); // Reibungswinkel in Grad
  const [gamma, setGamma] = useState(20); // Wichte in kN/m³
  const [h, setH] = useState(5); // Wandhöhe in m

  const erddruckResults = useMemo(() => {
    const r = erddruckRankine(phiErddruck, gamma, h);
    const { k_a, k_p, k_0, E_a, E_p, E_0 } = r;
    const e_a = k_a * gamma * h, e_p = k_p * gamma * h, e_0 = k_0 * gamma * h;

    const chartData = {
      datasets: [
        {
          label: inhalt.werte.aktiverErddruckEA,
          data: [{x: 0, y: 0}, {x: e_a, y: h}],
          borderColor: '#A3113E',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          fill: true,
          borderWidth: 2,
        },
        {
          label: inhalt.werte.erdruhedruckE0,
          data: [{x: 0, y: 0}, {x: e_0, y: h}],
          borderColor: '#475569',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
          borderWidth: 2,
        },
        {
          label: inhalt.werte.passiverErddruckEP,
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
    const k = konsolidierung(hSchicht, deltaSigma, es, cv, drainage);
    const { s_end, t_50, t_90 } = k;
    const setzungsData = k.kurve;

    const chartData = {
      datasets: [
        {
          label: inhalt.werte.setzungSTMm,
          data: setzungsData,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(163, 17, 62, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        }
      ]
    };

    return { s_end, t_50, t_90, chartData, hinweise: k.hinweise };
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
        title: { display: true, text: inhalt.werte.normalspannungKnM, font: { weight: 'bold' as const } },
        min: 0,
        max: shearResults.maxSigma
      },
      y: {
        title: { display: true, text: inhalt.werte.scherspannungKnM, font: { weight: 'bold' as const } },
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
        title: { display: true, text: inhalt.werte.erddruckordinateEKnM, font: { weight: 'bold' as const } },
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
        title: { display: true, text: inhalt.werte.zeitTJahre, font: { weight: 'bold' as const } },
        min: 0,
      },
      y: {
        title: { display: true, text: inhalt.werte.setzungSMm, font: { weight: 'bold' as const } },
        reverse: true, // Setzung nach unten
        min: 0,
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button aria-pressed={activeTab === 'konsistenz'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'konsistenz' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('konsistenz')}>
          <Droplets size={16} /> Konsistenzgrenzen
        </button>
        <button aria-pressed={activeTab === 'scherfestigkeit'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'scherfestigkeit' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('scherfestigkeit')}>
          <Scissors size={16} /> Scherfestigkeit
        </button>
        <button aria-pressed={activeTab === 'erddruck'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'erddruck' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('erddruck')}>
          <ArrowDownToLine size={16} /> Erddruck
        </button>
        <button aria-pressed={activeTab === 'konsolidierung'}
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
          <Droplets className="text-shiraz" /><MdText text={inhalt.texte.erdbauBodenmechanikKonsistenzgrenzen} /><InfoTooltip text={inhalt.werte.berechnungVonPlastizitätszahlUnd} />
        </h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
          <p><MdText text={inhalt.texte.bindigeBödenTonSchluff} /></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.eingabeparameterWassergehalteIn} /></h3>
              
              <div className="grid grid-cols-1 gap-4">
                <Slider info={inhalt.werte.aktuellerNatürlicherWassergehaltDes} label={<FormulaText text={inhalt.werte.natürlicherWassergehaltW} />} min={5} max={80} step={1} value={w} unit="%" onChange={(e) => setW(Number(e.target.value))} />
                <Slider label={<FormulaText text={inhalt.werte.fließgrenzeWL} />} info={inhalt.werte.liquidLimitWassergehaltAm} min={20} max={100} step={1} value={wL} unit="%" onChange={(e) => setWL(Number(e.target.value))} />
                <Slider info={inhalt.werte.plasticLimitWassergehaltAm} label={<FormulaText text={inhalt.werte.ausrollgrenzeWP} />}  min={10} max={50} step={1} value={wP} unit="%" onChange={(e) => setWP(Number(e.target.value))} />
              </div>
              
              {wP >= wL && (
                <div className="mt-4 text-xs font-bold text-red-500 bg-red-50 p-2 rounded border border-red-200">
                  <FormulaText text={inhalt.werte.fehlerDieFließgrenzeW} />
                </div>
              )}
            </div>

            {/* Schematische Darstellung: Konsistenz */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungKonsistenzbereich} /></h3>
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
                <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.dieKonsistenzgrenzenWP} /></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className={`p-6 rounded-xl shadow-md text-white ${results.farbe}`}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Atterberg-Kennwerte</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                <div>
                  <div className="text-white/70 text-sm mb-1 flex items-center gap-1">
                    <FormulaText text={inhalt.werte.plastizitätszahlIP} />
                    <InfoTooltip text={inhalt.werte.iPWL} />
                  </div>
                  <div className="text-3xl font-bold">{formatDeZahl(results.iP, 1)} %</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm mb-1 flex items-center gap-1">
                    <FormulaText text={inhalt.werte.konsistenzzahlIC} />
                    <InfoTooltip text={inhalt.werte.iCWL} />
                  </div>
                  <div className="text-3xl font-bold">{formatDeZahl(results.iC, 2)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-white/70 text-sm mb-1 flex items-center gap-1">
                    <Droplets size={16} /><MdText text={inhalt.texte.zustandsformKonsistenz} /></div>
                  <div className="text-2xl font-bold uppercase tracking-wide">{results.zustand}</div>
                </div>
              </div>
              
              <EingabeHinweise hinweise={results.hinweise} />
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="text-sm font-bold mb-1 flex items-center gap-2">
                  <Mountain size={16} /><MdText text={inhalt.texte.bodenklassifikationVereinfacht} /></div>
                <div className="text-sm leading-relaxed">
                  {results.klasse}
                </div>
              </div>
            </div>

            {/* Live-Rechenweg (AP 3.7) mit den aktuellen Wassergehalten */}
            <FormulaDerivationBox
              live
              title={inhalt.werte.ihrRechenwegKonsistenzUnd}
              zielGleichung="I_P = w_L - w_P, \quad I_C = \frac{w_L - w}{I_P}"
              schritte={[
                {
                  titel: 'Plastizitätszahl',
                  erklaerung: inhalt.werte.spanneDesPlastischenBereichs,
                  formel: `I_P = ${formatDeTeX(wL, 1)} - ${formatDeTeX(wP, 1)} = ${formatDeTeX(results.iP, 1)}\\,\\%`
                },
                {
                  titel: 'Konsistenzzahl',
                  erklaerung: `Abstand des natürlichen Wassergehalts w = ${formatDeZahl(w, 1)} % von der Fließgrenze, bezogen auf I_P:`,
                  formel: `I_C = \\frac{${formatDeTeX(wL, 1)} - ${formatDeTeX(w, 1)}}{${formatDeTeX(results.iP, 1)}} = ${formatDeTeX(results.iC, 2)}`
                },
                {
                  titel: 'Zustandsform',
                  erklaerung: `Einordnung nach den Grenzen 0 / 0,50 / 0,75 / 1,00: Der Boden ist ${results.zustand}.`,
                  formel: `I_C = ${formatDeTeX(results.iC, 2)} \\;\\Rightarrow\\; \\text{${results.zustand}}`
                },
                {
                  titel: inhalt.werte.lageZurALinie,
                  erklaerung: `Liegt I_P über der A-Linie (und I_P ≥ 7 %), handelt es sich um einen Ton, sonst um einen Schluff: ${results.klasse}.`,
                  formel: `I_{P,A} = 0{,}73 \\cdot (${formatDeTeX(wL, 1)} - 20) = ${formatDeTeX(0.73 * (wL - 20), 1)}\\,\\% \\quad I_P = ${formatDeTeX(results.iP, 1)}\\,\\% ${results.iP >= 0.73 * (wL - 20) ? '\\ge' : '<'} I_{P,A}`
                }
              ]}
              ergebnisHinweis={inhalt.werte.plastizitätsdiagrammNachDin18196}
              normQuelle={inhalt.werte.dinEnIso17892}
            />
          </div>
        </div>
        </div>
      )}

      {activeTab === 'scherfestigkeit' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
            <Scissors className="text-shiraz" /><MdText text={inhalt.texte.scherfestigkeitNachMohrCoulomb} /><InfoTooltip text={inhalt.werte.berechnungDerScherfestigkeitEines} />
          </h2>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
            <p><MdText text={inhalt.texte.dasBruchkriteriumNachMohr} /></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Bodenparameter</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Slider info={inhalt.werte.kohäsionDesBodens} label={<FormulaText text={inhalt.werte.kohäsionC} />} min={0} max={100} step={1} value={c} unit="kN/m²" onChange={(e) => setC(Number(e.target.value))} />
                  <Slider  label={<FormulaText text="Reibungswinkel (\varphi)" />} min={0} max={45} step={1} value={phi} unit="°" onChange={(e) => setPhi(Number(e.target.value))} />
                </div>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Spannungszustand</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Slider info={inhalt.werte.kleinsteHauptspannungZB} label={<FormulaText text="Kleinste Hauptspannung (\sigma_3)" />} min={0} max={200} step={5} value={sigma3} unit="kN/m²" onChange={(e) => {
                    const val = Number(e.target.value);
                    setSigma3(val);
                    if (val > sigma1) setSigma1(val);
                  }} />
                  <Slider info={inhalt.werte.größteHauptspannungZB} label={<FormulaText text="Größte Hauptspannung (\sigma_1)" />} min={0} max={500} step={5} value={sigma1} unit="kN/m²" onChange={(e) => {
                    const val = Number(e.target.value);
                    setSigma1(val);
                    if (val < sigma3) setSigma3(val);
                  }} />
                </div>
              </div>

              <EingabeHinweise hinweise={shearResults.hinweise} />
              <div className={`p-6 rounded-xl shadow-md text-white transition-colors ${shearResults.isFailing ? 'bg-torch-red' : 'bg-emerald-600'}`}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Zustandsbewertung</h3>
                <div>
                  <div className="text-2xl font-bold mb-2">
                    {shearResults.isFailing ? inhalt.werte.bruchzustandErreicht : inhalt.werte.bodenIstStandsicher}
                  </div>
                  <div className="text-white/80 text-sm">
                    <FormulaText text={`Max. ertragbare \\sigma_1 bei aktuellem \\sigma_3: ${formatDeZahl(shearResults.sigma1_f, 1)} kN/m²`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-xl border border-home-grau/30 h-[500px] flex flex-col">
                <h3 className="text-sm font-bold text-center mb-4"><MdText text={inhalt.texte.mohrCoulombBruchkriterium} /></h3>
                <div className="flex-1 relative">
                  <Line data={shearResults.chartData} options={scherfestigkeitChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'erddruck' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
            <ArrowDownToLine className="text-shiraz" /><MdText text={inhalt.texte.erddruckNachRankine} /><InfoTooltip text={inhalt.werte.berechnungVonAktivemPassivem} />
          </h2>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
            <p><MdText text={inhalt.texte.derErddruckBeschreibtDie} /></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.geometrieBoden} /></h3>
                <div className="grid grid-cols-1 gap-4">
                  <Slider label={<FormulaText text={inhalt.werte.wandhöheH} />} info={inhalt.werte.höheDerStützwandBzw} min={1} max={10} step={0.5} value={h} unit="m" onChange={(e) => setH(Number(e.target.value))} />
                  <Slider label={<FormulaText text="Wichte (\gamma)" />} info={inhalt.werte.dieWichteFeuchtesRaumgewicht} min={15} max={22} step={0.5} value={gamma} unit="kN/m³" onChange={(e) => setGamma(Number(e.target.value))} />
                  <Slider info={inhalt.werte.derCharakteristischeReibungswinkelDes} label={<FormulaText text="Reibungswinkel (\varphi)" />} min={15} max={45} step={1} value={phiErddruck} unit="°" onChange={(e) => setPhiErddruck(Number(e.target.value))} />
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
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90"><MdText text={inhalt.texte.resultierendeKräfte} /></h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-white/80 text-sm"><FormulaText text={inhalt.werte.aktiverErddruckEA2} /></span>
                    <span className="text-xl font-bold">{formatDeZahl(erddruckResults.E_a, 1)} kN/m</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-white/80 text-sm"><FormulaText text={inhalt.werte.erdruhedruckE02} /></span>
                    <span className="text-xl font-bold">{formatDeZahl(erddruckResults.E_0, 1)} kN/m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm"><FormulaText text={inhalt.werte.passiverErddruckEP2} /></span>
                    <span className="text-xl font-bold">{formatDeZahl(erddruckResults.E_p, 1)} kN/m</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-xl border border-home-grau/30 h-[500px] flex flex-col">
                <h3 className="text-sm font-bold text-center mb-4"><MdText text={inhalt.texte.erddruckverteilungÜberDieTiefe} /></h3>
                <div className="flex-1 relative">
                  <Line data={erddruckResults.chartData} options={erddruckChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'konsolidierung' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
            <Timer className="text-shiraz" /><MdText text={inhalt.texte.konsolidierungEindimensionaleSetzung} /><InfoTooltip text={inhalt.werte.berechnungDerZeitlichenEntwicklung} />
          </h2>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
            <p><MdText text={inhalt.texte.beiBindigenWassergesättigtenBöden} /></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.bodenBelastung} /></h3>
                <div className="grid grid-cols-1 gap-4">
                  <Slider info={inhalt.werte.dickeDerBodenschicht} label={<FormulaText text={inhalt.werte.schichtdickeH} />} min={1} max={20} step={0.5} value={hSchicht} unit="m" onChange={(e) => setHSchicht(Number(e.target.value))} />
                  <Slider  label={<FormulaText text="Zusatzspannung (\Delta\sigma)" />} min={10} max={200} step={5} value={deltaSigma} unit="kN/m²" onChange={(e) => setDeltaSigma(Number(e.target.value))} />
                  <Slider info={inhalt.werte.steifemodulDesBodens} label={<FormulaText text={inhalt.werte.steifemodulES} />} min={1} max={20} step={0.5} value={es} unit="MN/m²" onChange={(e) => setEs(Number(e.target.value))} />
                  <Slider  label={<FormulaText text={inhalt.werte.konsolidierungsbeiwertCV} />} min={0.1} max={10} step={0.1} value={cv} unit="m²/Jahr" onChange={(e) => setCv(Number(e.target.value))} />
                  
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Entwässerung</label><InfoTooltip text={inhalt.werte.artDerWasserableitungVom} /></div>
                    <select aria-label="Entwässerung" 
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
                    <div className="text-white/80 text-sm mb-1"><FormulaText text={inhalt.werte.endsetzungSEnd} /></div>
                    <div className="text-3xl font-bold">{formatDeZahl(konsolidierungResults.s_end, 1)} mm</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                    <div>
                      <div className="text-white/80 text-xs mb-1 flex items-center gap-1"><Clock size={12}/> <FormulaText text="t_{50} (U=50\%)" /></div>
                      <div className="text-xl font-bold">{formatDeZahl(konsolidierungResults.t_50, 1)} a</div>
                    </div>
                    <div>
                      <div className="text-white/80 text-xs mb-1 flex items-center gap-1"><Clock size={12}/> <FormulaText text="t_{90} (U=90\%)" /></div>
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
                  <Line data={konsolidierungResults.chartData} options={konsolidierungChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1ZustandsformUnd}
        zielGleichung="I_C = \frac{w_L - w}{w_L - w_P}"
        schritte={inhalt.daten["Bodenmechanik.schritte"]}
        ergebnisHinweis={inhalt.werte.einSteiferMittelplastischerTon}
        normQuelle={inhalt.werte.dinEnIso178922}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2AktiverErddruck}
        zielGleichung="E_a = \frac{1}{2} \cdot K_a \cdot \gamma \cdot h^2"
        schritte={inhalt.daten["Bodenmechanik.schritte_2"]}
        ergebnisHinweis={inhalt.werte.beiEinseitigerEntwässerungVerdoppelt}
        normQuelle={inhalt.werte.din4085201708}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bodenmechanik" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap5}
        wikipedia={[
        { title: 'Bodenmechanik', url: 'https://de.wikipedia.org/wiki/Bodenmechanik' },
        
        { title: 'Scherfestigkeit', url: 'https://de.wikipedia.org/wiki/Scherfestigkeit' },
        { title: 'Erddruck', url: 'https://de.wikipedia.org/wiki/Erddruck' },
        { title: 'Konsolidierung', url: 'https://de.wikipedia.org/wiki/Konsolidation_(Bodenmechanik)' }
      ]}
        literatur={inhalt.daten["Bodenmechanik.literatur"]}
        regelwerke={inhalt.daten["Bodenmechanik.regelwerke"]}
        formeln={inhalt.daten["Bodenmechanik.formeln"]}
      />
    </div>
  );
}
