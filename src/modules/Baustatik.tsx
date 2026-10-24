import { Minus, Square, Scale } from 'lucide-react';
import { dreigelenkrahmen, traeger } from '@/src/calc/statik';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Baustatik() {
  const [activeTab, setActiveTab] = useState<'traeger' | 'rahmen'>('traeger');
  
  // Träger State
  const [system, setSystem] = useState<'einfeld' | 'kragarm' | 'zweifeld'>('einfeld');
  const [l, setL] = useState(10); // Gesamtlänge in m
  const [l1, setL1] = useState(5); // Position Mittelauflager in m (nur Zweifeld)
  const [q, setQ] = useState(10); // Gleichlast in kN/m
  const [f, setF] = useState(20); // Einzellast in kN
  const [a, setA] = useState(2.5); // Position Einzellast in m
  const [m0, setM0] = useState(0); // Einzellmoment in kNm
  const [a_m, setAM] = useState(5); // Position Einzellmoment in m

  // Rahmen State
  const [rahmenH, setRahmenH] = useState(4); // Höhe in m
  const [rahmenL, setRahmenL] = useState(6); // Breite in m
  const [rahmenQ, setRahmenQ] = useState(10); // Gleichlast Riegel in kN/m
  const [rahmenW, setRahmenW] = useState(20); // Horizontallast Ecke in kN
  const [rahmenSchnitt, setRahmenSchnitt] = useState<'M' | 'V' | 'N'>('M');

  const results = useMemo(() => {
    const totalLength = l;
    const a_pos = Math.min(a, totalLength); 
    const am_pos = Math.min(a_m, totalLength);
    const l1_pos = Math.min(Math.max(l1, 0.1), totalLength - 0.1); // Verhindert div by 0

    // Statik aus dem Rechenkern src/calc/statik.ts; Laststellungen werden sichtbar über die Regler begrenzt
    const st = traeger({ system, l: totalLength, l1: l1_pos, q, f, a: a_pos, m0, am: am_pos });
    const { A, B, C, MA } = st;

    const steps = 100;
    const dx = totalLength / steps;
    const labels = [];
    const momentData = [];
    const shearData = [];

    let maxM = 0;
    let minM = 0;
    let maxV = 0;
    let xMaxM = 0, xMinM = 0, xMaxV = 0, vAtMax = 0;

    for (let i = 0; i <= steps; i++) {
      const x = i * dx;
      labels.push(formatDeZahl(x, 2));

      const vx = st.V(x);
      const mx = st.M(x);

      shearData.push(vx);
      momentData.push(mx);

      if (mx > maxM) { maxM = mx; xMaxM = x; }
      if (mx < minM) { minM = mx; xMinM = x; }
      if (Math.abs(vx) > maxV) { maxV = Math.abs(vx); xMaxV = x; vAtMax = vx; }
    }

    const maxAbsM = Math.max(Math.abs(maxM), Math.abs(minM));
    const xAbsM = Math.abs(maxM) >= Math.abs(minM) ? xMaxM : xMinM;
    const mAtMax = Math.abs(maxM) >= Math.abs(minM) ? maxM : minM;

    const momentChart = {
      labels,
      datasets: [
        {
          label: 'Biegemoment M(x) [kNm]',
          data: momentData,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(163, 17, 62, 0.1)',
          fill: true,
          tension: 0.1,
          pointRadius: 0,
        }
      ]
    };

    const shearChart = {
      labels,
      datasets: [
        {
          label: 'Querkraft V(x) [kN]',
          data: shearData,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(14, 85, 140, 0.1)',
          fill: true,
          stepped: true,
          pointRadius: 0,
        }
      ]
    };

    return { A, B, C, MA, MB: st.MB, l1_pos, maxAbsM, xAbsM, mAtMax, maxV, xMaxV, vAtMax, momentChart, shearChart, a_pos, am_pos, totalLength, hinweise: st.hinweise };
  }, [system, l, l1, q, f, a, m0, a_m]);

  const rahmenResults = useMemo(() => dreigelenkrahmen(rahmenH, rahmenL, rahmenQ, rahmenW), [rahmenH, rahmenL, rahmenQ, rahmenW]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        title: { display: true, text: 'Position x [m]', font: { weight: 'bold' as const } }
      }
    }
  };

  const renderSystemSketch = () => {
    const svgWidth = 800;
    const svgHeight = 240;
    const marginX = 60;
    const drawWidth = svgWidth - 2 * marginX;
    const scale = drawWidth / results.totalLength;
    const getX = (x: number) => marginX + x * scale;
    const baseY = 120;

    const drawFestlager = (x: number) => (
      <g transform={`translate(${x}, ${baseY})`}>
        <polygon points="0,0 -15,25 15,25" fill="white" stroke="#1e293b" strokeWidth="2" />
        <line x1="-25" y1="25" x2="25" y2="25" stroke="#1e293b" strokeWidth="3" />
        <line x1="-20" y1="25" x2="-25" y2="32" stroke="#1e293b" strokeWidth="1" />
        <line x1="-10" y1="25" x2="-15" y2="32" stroke="#1e293b" strokeWidth="1" />
        <line x1="0" y1="25" x2="-5" y2="32" stroke="#1e293b" strokeWidth="1" />
        <line x1="10" y1="25" x2="5" y2="32" stroke="#1e293b" strokeWidth="1" />
        <line x1="20" y1="25" x2="15" y2="32" stroke="#1e293b" strokeWidth="1" />
      </g>
    );

    const drawLoslager = (x: number) => (
      <g transform={`translate(${x}, ${baseY})`}>
        <polygon points="0,0 -15,20 15,20" fill="white" stroke="#1e293b" strokeWidth="2" />
        <circle cx="-8" cy="24" r="4" fill="white" stroke="#1e293b" strokeWidth="2" />
        <circle cx="8" cy="24" r="4" fill="white" stroke="#1e293b" strokeWidth="2" />
        <line x1="-25" y1="28" x2="25" y2="28" stroke="#1e293b" strokeWidth="3" />
        <line x1="-20" y1="28" x2="-25" y2="35" stroke="#1e293b" strokeWidth="1" />
        <line x1="-10" y1="28" x2="-15" y2="35" stroke="#1e293b" strokeWidth="1" />
        <line x1="0" y1="28" x2="-5" y2="35" stroke="#1e293b" strokeWidth="1" />
        <line x1="10" y1="28" x2="5" y2="35" stroke="#1e293b" strokeWidth="1" />
        <line x1="20" y1="28" x2="15" y2="35" stroke="#1e293b" strokeWidth="1" />
      </g>
    );

    const drawEinspannung = (x: number) => (
      <g transform={`translate(${x}, ${baseY})`}>
        <line x1="0" y1="-30" x2="0" y2="30" stroke="#1e293b" strokeWidth="4" />
        <line x1="0" y1="-25" x2="-10" y2="-15" stroke="#1e293b" strokeWidth="1" />
        <line x1="0" y1="-10" x2="-10" y2="0" stroke="#1e293b" strokeWidth="1" />
        <line x1="0" y1="5" x2="-10" y2="15" stroke="#1e293b" strokeWidth="1" />
        <line x1="0" y1="20" x2="-10" y2="30" stroke="#1e293b" strokeWidth="1" />
      </g>
    );

    const drawQ = () => {
      if (q <= 0) return null;
      const numArrows = Math.max(5, Math.floor(results.totalLength * 2));
      const step = results.totalLength / numArrows;
      const arrows = [];
      for (let i = 0; i <= numArrows; i++) {
        const x = getX(i * step);
        arrows.push(
          <line key={`q-${i}`} x1={x} y1={baseY - 40} x2={x} y2={baseY - 5} stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />
        );
      }
      return (
        <g>
          <rect x={getX(0)} y={baseY - 40} width={drawWidth} height={35} fill="rgba(59, 130, 246, 0.1)" />
          <line x1={getX(0)} y1={baseY - 40} x2={getX(results.totalLength)} y2={baseY - 40} stroke="#475569" strokeWidth="2" />
          {arrows}
          <text x={getX(results.totalLength / 2)} y={baseY - 48} fill="#475569" textAnchor="middle" fontWeight="bold" fontSize="14">q = {formatDeWert(q)} kN/m</text>
        </g>
      );
    };

    const drawF = () => {
      if (f <= 0) return null;
      const x = getX(results.a_pos);
      return (
        <g>
          <line x1={x} y1={baseY - 80} x2={x} y2={baseY - 5} stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrowhead-red)" />
          <text x={x} y={baseY - 88} fill="#A3113E" textAnchor="middle" fontWeight="bold" fontSize="14">F = {formatDeWert(f)} kN</text>
        </g>
      );
    };

    const drawM0 = () => {
      if (m0 === 0) return null;
      const x = getX(results.am_pos);
      // Clockwise moment arrow
      return (
        <g>
          <path d={`M ${x-15} ${baseY-15} A 15 15 0 1 1 ${x+15} ${baseY-15}`} fill="none" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrowhead-yellow)" />
          <text x={x} y={baseY - 35} fill="#64748b" textAnchor="middle" fontWeight="bold" fontSize="14">M = {formatDeWert(m0)} kNm</text>
        </g>
      );
    };

    const drawDimensions = () => {
      const dimY1 = baseY + 50;
      const dimY2 = baseY + 80;
      const dimY3 = baseY + 110;

      return (
        <g stroke="#64748b" strokeWidth="1.5" fill="#64748b" fontSize="12">
          {/* Feld 1 */}
          <line x1={getX(0)} y1={baseY + 10} x2={getX(0)} y2={dimY1 + 10} />
          {system === 'zweifeld' ? (
            <>
              <line x1={getX(l1)} y1={baseY + 10} x2={getX(l1)} y2={dimY1 + 10} />
              <line x1={getX(0)} y1={dimY1} x2={getX(l1)} y2={dimY1} markerStart="url(#tick)" markerEnd="url(#tick)" />
              <text x={getX(l1/2)} y={dimY1 - 5} textAnchor="middle">l₁ = {formatDeZahl(l1, 2)} m</text>
              
              <line x1={getX(l)} y1={baseY + 10} x2={getX(l)} y2={dimY1 + 10} />
              <line x1={getX(l1)} y1={dimY1} x2={getX(l)} y2={dimY1} markerStart="url(#tick)" markerEnd="url(#tick)" />
              <text x={getX(l1 + (l-l1)/2)} y={dimY1 - 5} textAnchor="middle">l₂ = {formatDeZahl(l - l1, 2)} m</text>
            </>
          ) : (
            <>
              <line x1={getX(l)} y1={baseY + 10} x2={getX(l)} y2={dimY1 + 10} />
              <line x1={getX(0)} y1={dimY1} x2={getX(l)} y2={dimY1} markerStart="url(#tick)" markerEnd="url(#tick)" />
              <text x={getX(l/2)} y={dimY1 - 5} textAnchor="middle">l = {formatDeWert(l)} m</text>
            </>
          )}

          {/* Position a */}
          {f > 0 && (
            <>
              <line x1={getX(results.a_pos)} y1={baseY + 10} x2={getX(results.a_pos)} y2={dimY2 + 10} strokeDasharray="4 4" />
              <line x1={getX(0)} y1={dimY2} x2={getX(results.a_pos)} y2={dimY2} markerStart="url(#tick)" markerEnd="url(#tick)" />
              <text x={getX(results.a_pos / 2)} y={dimY2 - 5} textAnchor="middle">a = {formatDeZahl(results.a_pos, 2)} m</text>
            </>
          )}

          {/* Position a_m */}
          {m0 !== 0 && (
            <>
              <line x1={getX(results.am_pos)} y1={baseY + 10} x2={getX(results.am_pos)} y2={dimY3 + 10} strokeDasharray="4 4" stroke="#64748b" />
              <line x1={getX(0)} y1={dimY3} x2={getX(results.am_pos)} y2={dimY3} markerStart="url(#tick)" markerEnd="url(#tick)" stroke="#64748b" />
              <text x={getX(results.am_pos / 2)} y={dimY3 - 5} textAnchor="middle" fill="#64748b">a_m = {formatDeZahl(results.am_pos, 2)} m</text>
            </>
          )}
        </g>
      );
    };

    return (
      <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm mb-6 overflow-x-auto">
        <h3 className="text-sm font-bold text-center mb-4">Systemskizze & Laststellung</h3>
        <div className="min-w-[600px] flex justify-center">
          <svg width="100%" height="280" viewBox="0 0 800 280" style={{ maxWidth: '800px' }}>
            <defs>
              <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#A3113E" />
              </marker>
              <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
              </marker>
              <marker id="arrowhead-yellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
              <marker id="tick" markerWidth="2" markerHeight="10" refX="1" refY="5" orient="auto">
                <rect width="2" height="10" fill="#64748b" />
              </marker>
            </defs>

            {/* Beam */}
            <line x1={getX(0)} y1={baseY} x2={getX(results.totalLength)} y2={baseY} stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />

            {/* Supports */}
            {system === 'einfeld' && (
              <>
                {drawFestlager(getX(0))}
                {drawLoslager(getX(l))}
              </>
            )}
            {system === 'kragarm' && (
              <>
                {drawEinspannung(getX(0))}
              </>
            )}
            {system === 'zweifeld' && (
              <>
                {drawFestlager(getX(0))}
                {drawLoslager(getX(l1))}
                {drawLoslager(getX(l))}
              </>
            )}

            {/* Loads */}
            {drawQ()}
            {drawF()}
            {drawM0()}

            {/* Dimensions */}
            {drawDimensions()}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Scale className="text-shiraz" /> Baustatik
          <InfoTooltip text="Berechnung von Schnittgrößen (Biegemoment und Querkraft) für Einfeldträger, Kragarm und Rahmen." />
        </h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Baustatik liefert die Schnittgrößen (Moment <FormulaText text="M" />, Querkraft <FormulaText text="V" />, Normalkraft <FormulaText text="N" />), die für die Bemessung von Bauteilen erforderlich sind. Hier können statisch bestimmte Systeme (Einfeldträger, Kragarm, Dreigelenkrahmen) untersucht werden, sowie der statisch unbestimmte Zweifeldträger.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button aria-pressed={activeTab === 'traeger'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'traeger' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('traeger')}>
          <Minus size={16} /> Träger (1D)
        </button>
        <button aria-pressed={activeTab === 'rahmen'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'rahmen' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('rahmen')}>
          <Square size={16} /> Rahmen (2D)
        </button>
        </div>

        {activeTab === 'traeger' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">System & Lasten</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Statisches System</label><InfoTooltip text="Art der Lagerung des Trägers (z.B. Einfeldträger, Kragarm)." /></div>
                  <select aria-label="Statisches System" 
                    className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                    value={system}
                    onChange={(e) => setSystem(e.target.value as 'einfeld' | 'kragarm' | 'zweifeld')}
                  >
                    <option value="einfeld">Einfeldträger</option>
                    <option value="kragarm">Kragarm (links eingespannt)</option>
                    <option value="zweifeld">Zweifeldträger (Lage des Mittelauflagers wählbar)</option>
                  </select>
                </div>

                <Slider label={system === 'zweifeld' ? "Gesamtlänge (l)" : "Stützweite / Länge (l)"} info={system === 'zweifeld' ? "Gesamtlänge des Bauteils über beide Felder." : "Abstand zwischen den Auflagern oder Gesamtlänge des Bauteils."} min={1} max={30} step={0.5} value={l} unit="m" onChange={(e) => setL(Number(e.target.value))} />
                
                {system === 'zweifeld' && (
                  <Slider label="Position Mittelauflager (l₁)" info="Lage des mittleren Auflagers; die Felder dürfen ungleich lang sein. Annahme: konstante Biegesteifigkeit EI über beide Felder." min={0.5} max={l - 0.5} step={0.1} value={Math.min(l1, l-0.5)} unit="m" onChange={(e) => setL1(Number(e.target.value))} />
                )}

                <div className="mt-2 pt-4 border-t border-home-grau/30">
                  <Slider label="Gleichlast (q)"  min={0} max={100} step={1} value={q} unit="kN/m" onChange={(e) => setQ(Number(e.target.value))} />
                </div>
                <div className="mt-2 pt-4 border-t border-home-grau/30">
                  <Slider label="Einzellast (F)" info="Punktuell einwirkende Kraft auf das Bauteil." min={0} max={500} step={5} value={f} unit="kN" onChange={(e) => setF(Number(e.target.value))} />
                  {f > 0 && <Slider label="Position Einzellast (a)"  min={0} max={results.totalLength} step={0.1} value={results.a_pos} unit="m" onChange={(e) => setA(Number(e.target.value))} />}
                </div>
                <div className="mt-2 pt-4 border-t border-home-grau/30">
                  <Slider label="Einzelmoment (M)" info="Punktuell einwirkendes Biegemoment." min={-200} max={200} step={10} value={m0} unit="kNm" onChange={(e) => setM0(Number(e.target.value))} />
                  {m0 !== 0 && <Slider label="Position Moment (a_m)"  min={0} max={results.totalLength} step={0.1} value={results.am_pos} unit="m" onChange={(e) => setAM(Number(e.target.value))} />}
                </div>
              </div>
            </div>

            <div className={`grid ${system === 'zweifeld' ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm text-center">
                <div className="text-home-grau text-xs font-bold uppercase mb-1">Auflager A (links)</div>
                <div className="text-2xl font-bold text-text-main">{formatDeZahl(results.A, 1)} <span className="text-sm font-normal">kN</span></div>
                {system === 'kragarm' && (
                  <div className="text-sm text-shiraz mt-1"><FormulaText text="M_A" /> = {formatDeZahl(results.MA, 1)} kNm</div>
                )}
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm text-center">
                <div className="text-home-grau text-xs font-bold uppercase mb-1">{system === 'zweifeld' ? 'Auflager B (Mitte)' : 'Auflager B (rechts)'}</div>
                <div className="text-2xl font-bold text-text-main">{formatDeZahl(results.B, 1)} <span className="text-sm font-normal">kN</span></div>
                {system === 'kragarm' && (
                  <div className="text-sm text-home-grau mt-1">Freies Ende</div>
                )}
              </div>
              {system === 'zweifeld' && (
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm text-center">
                  <div className="text-home-grau text-xs font-bold uppercase mb-1">Auflager C (rechts)</div>
                  <div className="text-2xl font-bold text-text-main">{formatDeZahl(results.C, 1)} <span className="text-sm font-normal">kN</span></div>
                </div>
              )}
            </div>

            <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/20">
              <h3 className="text-sm font-bold text-shiraz uppercase tracking-wider mb-4">Maximalwerte</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="text-home-grau text-sm mb-1">Max. Biegemoment (|<FormulaText text="M_{max}" />|)</div>
                  <div className="text-3xl font-bold text-shiraz">{formatDeZahl(results.maxAbsM, 1)} <span className="text-lg font-normal">kNm</span></div>
                </div>
                <div>
                  <div className="text-home-grau text-sm mb-1">Max. Querkraft (|<FormulaText text="V_{max}" />|)</div>
                  <div className="text-3xl font-bold text-shiraz">{formatDeZahl(results.maxV, 1)} <span className="text-lg font-normal">kN</span></div>
                </div>
              </div>
            </div>

            <FormulaDerivationBox
              live
              title="Ihr Rechenweg: Auflagerkräfte und Schnittgrößen mit den aktuellen Eingaben"
              zielGleichung={`|M|_{max} = ${formatDeTeX(results.maxAbsM, 1)}\\,\\text{kNm},\\quad |V|_{max} = ${formatDeTeX(results.maxV, 1)}\\,\\text{kN}`}
              normQuelle="Gleichgewichtsbedingungen; Dreimomentengleichung (Zweifeldträger)"
              schritte={[
                system === 'einfeld'
                  ? {
                      titel: 'Auflagerkraft A',
                      erklaerung: 'Momentengleichgewicht um das rechte Auflager B.',
                      formel: `A = \\frac{q \\cdot l}{2} + \\frac{F \\cdot (l - a)}{l} - \\frac{M_0}{l} = \\frac{${formatDeTeX(q, 1)} \\cdot ${formatDeTeX(l, 1)}}{2} + \\frac{${formatDeTeX(f, 1)} \\cdot ${formatDeTeX(l - results.a_pos, 2)}}{${formatDeTeX(l, 1)}} - \\frac{${formatDeTeX(m0, 1)}}{${formatDeTeX(l, 1)}} = ${formatDeTeX(results.A, 1)}\\,\\text{kN}`,
                    }
                  : system === 'kragarm'
                    ? {
                        titel: 'Einspannkräfte',
                        erklaerung: 'Vertikal- und Momentengleichgewicht an der Einspannung A (links).',
                        formel: `A = q \\cdot l + F = ${formatDeTeX(q, 1)} \\cdot ${formatDeTeX(l, 1)} + ${formatDeTeX(f, 1)} = ${formatDeTeX(results.A, 1)}\\,\\text{kN};\\quad M_A = -\\frac{q l^2}{2} - F a - M_0 = ${formatDeTeX(results.MA, 1)}\\,\\text{kNm}`,
                      }
                    : {
                        titel: 'Stützmoment über dem Mittelauflager',
                        erklaerung: `Dreimomentengleichung (Clapeyron) mit l₁ = ${formatDeZahl(results.l1_pos, 2)} m und l₂ = ${formatDeZahl(l - results.l1_pos, 2)} m, EI konstant.`,
                        formel: `M_B = -\\frac{q \\cdot (l_1^3 + l_2^3)}{8 \\cdot l} + \\Delta M_{B,F} + \\Delta M_{B,M_0} = -\\frac{${formatDeTeX(q, 1)} \\cdot (${formatDeTeX(results.l1_pos, 2)}^3 + ${formatDeTeX(l - results.l1_pos, 2)}^3)}{8 \\cdot ${formatDeTeX(l, 1)}} + \\ldots = ${formatDeTeX(results.MB, 2)}\\,\\text{kNm}`,
                      },
                system === 'einfeld'
                  ? {
                      titel: 'Auflagerkraft B',
                      erklaerung: 'Momentengleichgewicht um das linke Auflager A.',
                      formel: `B = \\frac{q \\cdot l}{2} + \\frac{F \\cdot a}{l} + \\frac{M_0}{l} = ${formatDeTeX((q * l) / 2, 2)} + ${formatDeTeX((f * results.a_pos) / l, 2)} + ${formatDeTeX(m0 / l, 2)} = ${formatDeTeX(results.B, 1)}\\,\\text{kN}`,
                    }
                  : system === 'kragarm'
                    ? {
                        titel: 'Freies Ende',
                        erklaerung: 'Am freien Ende B gibt es keine Auflagerkraft.',
                        formel: 'B = 0',
                      }
                    : {
                        titel: 'Auflagerkräfte',
                        erklaerung: 'Auflagerkräfte der beiden Einfeldträger, korrigiert um den Anteil des Stützmoments M_B/l₁ bzw. M_B/l₂.',
                        formel: `A = ${formatDeTeX(results.A, 1)}\\,\\text{kN};\\quad B = ${formatDeTeX(results.B, 1)}\\,\\text{kN};\\quad C = ${formatDeTeX(results.C, 1)}\\,\\text{kN}`,
                      },
                {
                  titel: 'Kontrolle des Vertikalgleichgewichts',
                  erklaerung: 'Die Summe der Auflagerkräfte muss der Summe der Vertikallasten entsprechen.',
                  formel: `\\sum A_i = ${formatDeTeX(results.A + (system === 'kragarm' ? 0 : results.B) + (system === 'zweifeld' ? results.C : 0), 1)}\\,\\text{kN} = q \\cdot l + F = ${formatDeTeX(q * l + f, 1)}\\,\\text{kN}`,
                },
                {
                  titel: 'Größtes Biegemoment',
                  erklaerung: `Der Momentenverlauf M(x) wird an 101 Stellen ausgewertet; der Betragsgrößtwert liegt bei x = ${formatDeZahl(results.xAbsM, 2)} m.`,
                  formel: `M(${formatDeTeX(results.xAbsM, 2)}) = ${formatDeTeX(results.mAtMax, 1)}\\,\\text{kNm} \\;\\Rightarrow\\; |M|_{max} = ${formatDeTeX(results.maxAbsM, 1)}\\,\\text{kNm}`,
                },
                {
                  titel: 'Größte Querkraft',
                  erklaerung: `Der Betragsgrößtwert der Querkraft liegt bei x = ${formatDeZahl(results.xMaxV, 2)} m.`,
                  formel: `V(${formatDeTeX(results.xMaxV, 2)}) = ${formatDeTeX(results.vAtMax, 1)}\\,\\text{kN} \\;\\Rightarrow\\; |V|_{max} = ${formatDeTeX(results.maxV, 1)}\\,\\text{kN}`,
                },
              ]}
              ergebnisHinweis={`|M|max = ${formatDeZahl(results.maxAbsM, 1)} kNm, |V|max = ${formatDeZahl(results.maxV, 1)} kN`}
            />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            {renderSystemSketch()}
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 h-[300px] flex flex-col">
              <h3 className="text-sm font-bold text-center mb-2">Biegemomentenverlauf M(x)</h3>
              <div className="flex-1 relative">
                <Line data={results.momentChart} options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: { title: { display: true, text: 'Moment [kNm]', font: { weight: 'bold' as const } }, reverse: true }
                  }
                } as any} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 h-[300px] flex flex-col">
              <h3 className="text-sm font-bold text-center mb-2">Querkraftverlauf V(x)</h3>
              <div className="flex-1 relative">
                <Line data={results.shearChart} options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: { title: { display: true, text: 'Querkraft [kN]', font: { weight: 'bold' as const } } }
                  }
                } as any} />
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Auflagerarten in der Ebene</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="160" viewBox="0 0 450 160">
                  {/* Loslager (Verschieblich) */}
                  <g transform="translate(50, 40)">
                    <text x="0" y="-20" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Loslager</text>
                    <text x="0" y="-5" fontSize="10" fill="#1e293b" textAnchor="middle">(1 Wertigkeit)</text>
                    {/* Symbol */}
                    <polygon points="0,10 -15,40 15,40" fill="none" stroke="#1e293b" strokeWidth="2" />
                    <circle cx="-10" cy="45" r="3" fill="#1e293b" />
                    <circle cx="10" cy="45" r="3" fill="#1e293b" />
                    <line x1="-25" y1="48" x2="25" y2="48" stroke="#1e293b" strokeWidth="2" />
                    <line x1="-20" y1="48" x2="-25" y2="55" stroke="#1e293b" strokeWidth="1" />
                    <line x1="0" y1="48" x2="-5" y2="55" stroke="#1e293b" strokeWidth="1" />
                    <line x1="20" y1="48" x2="15" y2="55" stroke="#1e293b" strokeWidth="1" />
                    {/* Reaktionskraft */}
                    <path d="M 0 65 L 0 15" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-statik)" />
                    <text x="5" y="60" fontSize="12" fill="#A3113E">V</text>
                  </g>

                  {/* Festlager (Unverschieblich) */}
                  <g transform="translate(225, 40)">
                    <text x="0" y="-20" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Festlager</text>
                    <text x="0" y="-5" fontSize="10" fill="#1e293b" textAnchor="middle">(2 Wertigkeiten)</text>
                    {/* Symbol */}
                    <polygon points="0,10 -15,40 15,40" fill="none" stroke="#1e293b" strokeWidth="2" />
                    <line x1="-25" y1="40" x2="25" y2="40" stroke="#1e293b" strokeWidth="2" />
                    <line x1="-20" y1="40" x2="-25" y2="47" stroke="#1e293b" strokeWidth="1" />
                    <line x1="0" y1="40" x2="-5" y2="47" stroke="#1e293b" strokeWidth="1" />
                    <line x1="20" y1="40" x2="15" y2="47" stroke="#1e293b" strokeWidth="1" />
                    {/* Reaktionskräfte */}
                    <path d="M 0 65 L 0 15" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-statik)" />
                    <text x="5" y="60" fontSize="12" fill="#A3113E">V</text>
                    <path d="M -30 10 L -5 10" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-statik)" />
                    <text x="-25" y="5" fontSize="12" fill="#A3113E">H</text>
                  </g>

                  {/* Einspannung */}
                  <g transform="translate(400, 40)">
                    <text x="0" y="-20" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Einspannung</text>
                    <text x="0" y="-5" fontSize="10" fill="#1e293b" textAnchor="middle">(3 Wertigkeiten)</text>
                    {/* Symbol */}
                    <rect x="-5" y="0" width="10" height="40" fill="#1e293b" />
                    <line x1="-5" y1="0" x2="-5" y2="40" stroke="#1e293b" strokeWidth="2" />
                    <line x1="-5" y1="5" x2="-12" y2="10" stroke="#1e293b" strokeWidth="1" />
                    <line x1="-5" y1="20" x2="-12" y2="25" stroke="#1e293b" strokeWidth="1" />
                    <line x1="-5" y1="35" x2="-12" y2="40" stroke="#1e293b" strokeWidth="1" />
                    {/* Reaktionskräfte */}
                    <path d="M 5 65 L 5 45" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-statik)" />
                    <text x="10" y="60" fontSize="12" fill="#A3113E">V</text>
                    <path d="M 30 20 L 10 20" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-statik)" />
                    <text x="25" y="15" fontSize="12" fill="#A3113E">H</text>
                    <path d="M 25 45 A 20 20 0 0 0 25 -5" fill="none" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-statik)" />
                    <text x="35" y="45" fontSize="12" fill="#A3113E">M</text>
                  </g>

                  <defs>
                    <marker id="arrow-red-statik" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Auflagerarten in der 2D-Ebene: Ein Loslager nimmt nur Vertikalkräfte auf (1 Unbekannte). Ein Festlager nimmt Vertikal- und Horizontalkräfte auf (2 Unbekannte). Eine Einspannung nimmt zusätzlich ein Moment auf (3 Unbekannte).
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

        {activeTab === 'rahmen' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">System & Lasten</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Slider label="Rahmenhöhe (h)" min={2} max={10} step={0.5} value={rahmenH} unit="m" onChange={(e) => setRahmenH(Number(e.target.value))} />
                  <Slider label="Rahmenbreite (l)" min={2} max={20} step={0.5} value={rahmenL} unit="m" onChange={(e) => setRahmenL(Number(e.target.value))} />
                  <div className="mt-2 pt-4 border-t border-home-grau/30">
                    <Slider label="Gleichlast Riegel (q)" min={0} max={100} step={1} value={rahmenQ} unit="kN/m" onChange={(e) => setRahmenQ(Number(e.target.value))} />
                  </div>
                  <div className="mt-2 pt-4 border-t border-home-grau/30">
                    <Slider label="Horizontallast (W)" info="Windlast an der linken oberen Ecke." min={0} max={100} step={1} value={rahmenW} unit="kN" onChange={(e) => setRahmenW(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm text-center">
                  <div className="text-home-grau text-xs font-bold uppercase mb-1">Auflager A (links)</div>
                  <div className="text-lg font-bold text-text-main">V: {formatDeZahl(rahmenResults.Av, 1)} kN</div>
                  <div className="text-lg font-bold text-text-main">H: {formatDeZahl(rahmenResults.Ah, 1)} kN</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm text-center">
                  <div className="text-home-grau text-xs font-bold uppercase mb-1">Auflager B (rechts)</div>
                  <div className="text-lg font-bold text-text-main">V: {formatDeZahl(rahmenResults.Bv, 1)} kN</div>
                  <div className="text-lg font-bold text-text-main">H: {formatDeZahl(rahmenResults.Bh, 1)} kN</div>
                </div>
              </div>

              <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/20">
                <h3 className="text-sm font-bold text-shiraz uppercase tracking-wider mb-4">Maximalwerte Schnittgrößen</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-home-grau text-sm mb-1">Maximales Biegemoment (|<FormulaText text="M_{max}" />|)</div>
                    <div className="text-3xl font-bold text-shiraz">{formatDeZahl(Math.max(Math.abs(rahmenResults.M_Ecke_Links), Math.abs(rahmenResults.M_Ecke_Rechts), Math.abs(rahmenResults.M_Feld_Max)), 1)} <span className="text-lg font-normal">kNm</span></div>
                  </div>
                  <div>
                    <div className="text-home-grau text-sm mb-1">Maximale Querkraft (|<FormulaText text="V_{max}" />|)</div>
                    <div className="text-3xl font-bold text-shiraz">{formatDeZahl(Math.max(Math.abs(rahmenResults.Ah), Math.abs(rahmenResults.Bh), Math.abs(rahmenResults.Av), Math.abs(rahmenResults.Av - rahmenQ * rahmenL)), 1)} <span className="text-lg font-normal">kN</span></div>
                  </div>
                  <div>
                    <div className="text-home-grau text-sm mb-1">Maximale Normalkraft (|<FormulaText text="N_{max}" />|)</div>
                    <div className="text-3xl font-bold text-shiraz">{formatDeZahl(Math.max(Math.abs(rahmenResults.Av), Math.abs(rahmenResults.Bv), Math.abs(rahmenResults.Bh)), 1)} <span className="text-lg font-normal">kN</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm mb-6 overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-center">Systemskizze & Schnittgrößen</h3>
                  <div className="flex bg-off-white rounded-lg p-1 border border-home-grau/30">
                    <button aria-pressed={rahmenSchnitt === 'M'} className={`px-3 py-1 text-xs font-bold rounded-md ${rahmenSchnitt === 'M' ? 'bg-white shadow-sm text-shiraz' : 'text-home-grau'}`} onClick={() => setRahmenSchnitt('M')}>Moment (M)</button>
                    <button aria-pressed={rahmenSchnitt === 'V'} className={`px-3 py-1 text-xs font-bold rounded-md ${rahmenSchnitt === 'V' ? 'bg-white shadow-sm text-[#A3113E]' : 'text-home-grau'}`} onClick={() => setRahmenSchnitt('V')}>Querkraft (V)</button>
                    <button aria-pressed={rahmenSchnitt === 'N'} className={`px-3 py-1 text-xs font-bold rounded-md ${rahmenSchnitt === 'N' ? 'bg-white shadow-sm text-green-700' : 'text-home-grau'}`} onClick={() => setRahmenSchnitt('N')}>Normalkraft (N)</button>
                  </div>
                </div>
                <div className="min-w-[600px] flex justify-center">
                  <svg width="100%" height="400" viewBox="0 0 800 400" style={{ maxWidth: '800px' }}>
                    <defs>
                      <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#A3113E" />
                      </marker>
                      <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                      </marker>
                    </defs>

                    {/* Koordinatensystem Transformation für einfaches Zeichnen */}
                    {/* Ursprung unten links bei (200, 350) */}
                    <g transform="translate(200, 350)">
                      {/* Skalierung */}
                      {(() => {
                        const scale = Math.min(400 / rahmenL, 250 / rahmenH);
                        const w = rahmenL * scale;
                        const h = rahmenH * scale;
                        
                        // Skalierungen für M, V, N
                        const maxM = Math.max(Math.abs(rahmenResults.M_Ecke_Links), Math.abs(rahmenResults.M_Ecke_Rechts), Math.abs(rahmenResults.M_Feld_Max), 1);
                        const maxV = Math.max(Math.abs(rahmenResults.Ah), Math.abs(rahmenResults.Bh), Math.abs(rahmenResults.Av), Math.abs(rahmenResults.Av - rahmenQ * rahmenL), 1);
                        const maxN = Math.max(Math.abs(rahmenResults.Av), Math.abs(rahmenResults.Bv), Math.abs(rahmenResults.Bh), 1);
                        
                        const mScale = (scale * 0.5) / (maxM / 10 + 1);
                        const vScale = (scale * 0.5) / (maxV / 10 + 1);
                        const nScale = (scale * 0.5) / (maxN / 10 + 1);

                        return (
                          <>
                            {/* Rahmenstruktur */}
                            <line x1="0" y1="0" x2="0" y2={-h} stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
                            <line x1="0" y1={-h} x2={w} y2={-h} stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
                            <line x1={w} y1={-h} x2={w} y2="0" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />

                            {/* Gelenk C */}
                            <circle cx={w/2} cy={-h} r="5" fill="white" stroke="#1e293b" strokeWidth="2" />

                            {/* Auflager A (Loslager/Festlager -> Dreigelenkrahmen hat 2 Festlager) */}
                            <g transform={`translate(0, 0)`}>
                              <polygon points="0,0 -15,25 15,25" fill="white" stroke="#1e293b" strokeWidth="2" />
                              <line x1="-25" y1="25" x2="25" y2="25" stroke="#1e293b" strokeWidth="3" />
                            </g>

                            {/* Auflager B */}
                            <g transform={`translate(${w}, 0)`}>
                              <polygon points="0,0 -15,25 15,25" fill="white" stroke="#1e293b" strokeWidth="2" />
                              <line x1="-25" y1="25" x2="25" y2="25" stroke="#1e293b" strokeWidth="3" />
                            </g>

                            {/* Last W */}
                            {rahmenW > 0 && (
                              <g>
                                <line x1={-50} y1={-h} x2={-10} y2={-h} stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrowhead-red)" />
                                <text x={-30} y={-h - 10} fill="#A3113E" textAnchor="middle" fontWeight="bold" fontSize="14">W</text>
                              </g>
                            )}

                            {/* Last q */}
                            {rahmenQ > 0 && (
                              <g>
                                <rect x="0" y={-h - 30} width={w} height={25} fill="rgba(59, 130, 246, 0.1)" />
                                <line x1="0" y1={-h - 30} x2={w} y2={-h - 30} stroke="#475569" strokeWidth="2" />
                                {Array.from({length: 6}).map((_, i) => (
                                  <line key={i} x1={i * w / 5} y1={-h - 30} x2={i * w / 5} y2={-h - 5} stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />
                                ))}
                                <text x={w/2} y={-h - 38} fill="#475569" textAnchor="middle" fontWeight="bold" fontSize="14">q</text>
                              </g>
                            )}

                            {/* Schnittgrößenverlauf */}
                            {rahmenSchnitt === 'M' && (
                              <g stroke="#A3113E" strokeWidth="2" fill="rgba(163, 17, 62, 0.2)">
                                {/* Linke Stütze */}
                                <polygon points={`0,0 0,${-h} ${-rahmenResults.M_Ecke_Links * mScale},${-h} 0,0`} />
                                
                                {/* Rechte Stütze */}
                                <polygon points={`${w},0 ${w},${-h} ${w - rahmenResults.M_Ecke_Rechts * mScale},${-h} ${w},0`} />
  
                                {/* Riegel (Parabel) */}
                                {(() => {
                                  const steps = 20;
                                  let path = `M 0,${-h} `;
                                  for (let i = 0; i <= steps; i++) {
                                    const x_real = (i / steps) * rahmenL;
                                    const x_draw = (i / steps) * w;
                                    const m_val = rahmenResults.M_Ecke_Links + rahmenResults.Av * x_real - (rahmenQ * x_real * x_real) / 2;
                                    path += `L ${x_draw},${-h - m_val * mScale} `;
                                  }
                                  path += `L ${w},${-h} Z`;
                                  return <path d={path} />;
                                })()}
                              </g>
                            )}

                            {rahmenSchnitt === 'V' && (
                              <g stroke="#A3113E" strokeWidth="2" fill="rgba(14, 85, 140, 0.2)">
                                {/* Linke Stütze (V_li = -Ah) */}
                                <polygon points={`0,0 0,${-h} ${-rahmenResults.Ah * vScale},${-h} ${-rahmenResults.Ah * vScale},0`} />
                                
                                {/* Rechte Stütze (V_re = Bh, bei lokaler z-Richtung nach oben) */}
                                <polygon points={`${w},0 ${w},${-h} ${w + rahmenResults.Bh * vScale},${-h} ${w + rahmenResults.Bh * vScale},0`} />
  
                                {/* Riegel (Linear V(x) = Av - q*x) */}
                                <polygon points={`0,${-h} 0,${-h - rahmenResults.Av * vScale} ${w},${-h - (rahmenResults.Av - rahmenQ * rahmenL) * vScale} ${w},${-h}`} />
                              </g>
                            )}

                            {rahmenSchnitt === 'N' && (
                              <g stroke="#334155" strokeWidth="2" fill="rgba(21, 128, 61, 0.2)">
                                {/* Linke Stütze N = -Av (Druck negativ) */}
                                <polygon points={`0,0 0,${-h} ${-rahmenResults.Av * nScale},${-h} ${-rahmenResults.Av * nScale},0`} />
                                
                                {/* Rechte Stütze N = -Bv */}
                                <polygon points={`${w},0 ${w},${-h} ${w + rahmenResults.Bv * nScale},${-h} ${w + rahmenResults.Bv * nScale},0`} />
  
                                {/* Riegel N = Bh */}
                                <polygon points={`0,${-h} 0,${-h - rahmenResults.Bh * nScale} ${w},${-h - rahmenResults.Bh * nScale} ${w},${-h}`} />
                              </g>
                            )}

                          </>
                        );
                      })()}
                    </g>
                  </svg>
                </div>
                <div className="text-center text-sm text-text-main/70 mt-4">
                  {rahmenSchnitt === 'M' && "Dargestellt ist der Momentenverlauf (M). Die Momentenfläche wird (konventionsgemäß) auf der Seite der Zugfaser gezeichnet."}
                  {rahmenSchnitt === 'V' && "Dargestellt ist der Querkraftverlauf (V). Positive Querkräfte drehen das abgetrennte Element im Uhrzeigersinn."}
                  {rahmenSchnitt === 'N' && "Dargestellt ist der Normalkraftverlauf (N). Druckkräfte sind in der Regel negativ."}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Einfeldträger mit Gleich- und Einzellast"
        zielGleichung="M_{max} = A \cdot a - \frac{q \cdot a^2}{2}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Stützweite l = 6 m, Gleichlast q = 10 kN/m, Einzellast F = 50 kN bei a = 2 m.', formel: 'l = 6\\,\\text{m},\\; q = 10\\,\\text{kN/m},\\; F = 50\\,\\text{kN},\\; a = 2\\,\\text{m}' },
          { titel: 'Auflagerkräfte', erklaerung: 'Momentengleichgewicht um B bzw. A:', formel: 'A = \\frac{10 \\cdot 6}{2} + \\frac{50 \\cdot 4}{6} = 63{,}3\\,\\text{kN}, \\quad B = 30 + \\frac{50 \\cdot 2}{6} = 46{,}7\\,\\text{kN}' },
          { titel: 'Querkraftnullstelle', erklaerung: 'V springt unter der Einzellast von +43,3 kN auf −6,7 kN; dort liegt das Momentenmaximum.', formel: 'V(2^-) = 63{,}3 - 20 = 43{,}3\\,\\text{kN}, \\quad V(2^+) = -6{,}7\\,\\text{kN}' },
          { titel: 'Maximales Moment', erklaerung: 'Moment an der Stelle x = a:', formel: 'M_{max} = 63{,}3 \\cdot 2 - \\frac{10 \\cdot 2^2}{2} = 106{,}7\\,\\text{kNm}' }
        ]}
        ergebnisHinweis="Kontrolle: A + B = 110 kN = q · l + F. Das Moment ist dort maximal, wo die Querkraft das Vorzeichen wechselt (dM/dx = V)."
        normQuelle="Gleichgewichtsbedingungen der Statik (statisch bestimmtes System)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Zweifeldträger und Dreigelenkrahmen unter Gleichlast"
        zielGleichung="M_B = -\frac{q \cdot (l_1^3 + l_2^3)}{8 \cdot (l_1 + l_2)}"
        schritte={[
          { titel: 'Zweifeldträger', erklaerung: 'l₁ = l₂ = 5 m, q = 20 kN/m, EI konstant; Stützmoment aus der Dreimomentengleichung (Clapeyron):', formel: 'M_B = -\\frac{20 \\cdot (125 + 125)}{8 \\cdot 10} = -62{,}5\\,\\text{kNm}' },
          { titel: 'Auflagerkräfte', erklaerung: 'Das Stützmoment entlastet die Endauflager und belastet das Mittelauflager:', formel: 'A = C = 50 - \\frac{62{,}5}{5} = 37{,}5\\,\\text{kN}, \\quad B = 2 \\cdot (50 + 12{,}5) = 125\\,\\text{kN}' },
          { titel: 'Dreigelenkrahmen', erklaerung: 'Riegel L = 8 m, Stielhöhe H = 4 m, q = 10 kN/m: Horizontalschub aus der Gelenkbedingung M_C = 0:', formel: 'H = \\frac{q \\cdot L^2}{8 \\cdot H_{Stiel}} = \\frac{10 \\cdot 64}{8 \\cdot 4} = 20\\,\\text{kN}' },
          { titel: 'Rahmenecke', erklaerung: 'Eckmoment aus Horizontalschub mal Stielhöhe:', formel: '|M_{Ecke}| = 20 \\cdot 4 = 80\\,\\text{kNm} = \\frac{q \\cdot L^2}{8}' }
        ]}
        ergebnisHinweis="Durchlaufwirkung und Rahmenwirkung verlagern Moment aus dem Feld in Stützen bzw. Ecken: Beim Zweifeldträger erhält das Mittelauflager 1,25 · q · l statt q · l, beim Dreigelenkrahmen ist das Feldmoment im Scheitelgelenk null."
        normQuelle="Dreimomentengleichung (Clapeyron); Gleichgewicht am Dreigelenkrahmen"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="baustatik" />

      <ModuleFooter 
        lastReviewed="Oktober 2026 (AP 5 Mechanik: Auflager- und Schnittgrößenformeln, Zweifeld- und Rahmenstatik nachgerechnet, Normbezüge geprüft; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
        { title: 'Baustatik', url: 'https://de.wikipedia.org/wiki/Baustatik' },
        { title: 'Träger (Statik)', url: 'https://de.wikipedia.org/wiki/Tr%C3%A4ger_(Statik)' },
        { title: 'Rahmen (Bauwesen)', url: 'https://de.wikipedia.org/wiki/Rahmen_(Bauwesen)' }
      ]}
        literatur={[
          'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024',
          'Gross, D.; Hauger, W.; Schröder, J.; Wall, W. A.: Technische Mechanik 2 – Elastostatik. Berlin: Springer Vieweg (aktuelle Auflage)'
        ]}
        regelwerke={[
          { title: 'DIN EN 1990:2021-10 (Eurocode 0: Grundlagen der Tragwerksplanung & Kombinationsregeln)' },
          { title: 'DIN EN 1991-1-1:2010-12 mit NA (Eurocode 1: Einwirkungen auf Tragwerke – Wichten, Eigengewicht, Nutzlasten)' },
          { title: 'DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3, bauaufsichtlich eingeführt); neue Generation DIN EN 1993-1-1:2025-04' }
        ]}
        formeln={[
          {
            formel: 'M_{\\text{max}} = \\frac{q \\cdot L^2}{8} \\quad \\text{und} \\quad w_{\\text{max}} = \\frac{5 \\cdot q \\cdot L^4}{384 \\cdot E \\cdot I}',
            erklaerung: 'Maximales Biegemoment und maximale Durchbiegung in Feldmitte eines Einfeldträgers unter gleichmäßig verteilter Linienlast q.',
            quelle: 'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024'
          },
          {
            formel: '\\sigma(z) = \\frac{N}{A} \\pm \\frac{M_y}{I_y} \\cdot z \\le f_{y,d}',
            erklaerung: 'Normalspannungsverteilung im Querschnitt bei einachsiger Biegung mit Normalkraft nach der linearen Elastizitätstheorie (Navier-Hypothese).',
            quelle: 'Technische Mechanik; elastischer Querschnittsnachweis nach DIN EN 1993-1-1, 6.2.1 (5)'
          },
          {
            formel: 'w\'\'(x) = -\\frac{M(x)}{E \\cdot I}',
            erklaerung: 'Biegelinie (Differentialgleichung der Biegung 2. Ordnung): Zusammenhang zwischen Trägerkrümmung, Biegemoment und Biegesteifigkeit E*I.',
            quelle: 'Euler-Bernoulli-Balkentheorie'
          }
        ]}
      />
    </div>
  );
}
