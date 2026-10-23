import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Layers, Activity, Maximize, BookOpen } from 'lucide-react';

const glassTypes = {
  'SPG': { name: 'Spiegelglas (Floatglas)', fgk: 45, deltaT: 40, desc: 'Normales Kühlglas, bricht in scharfkantige Schollen' },
  'TVG': { name: 'Teilvorgespanntes Glas (TVG)', fgk: 70, deltaT: 100, desc: 'Thermisch verfestigt, bricht in größere Schollen, hohe Resttragfähigkeit im VSG' },
  'ESG': { name: 'Einscheibensicherheitsglas (ESG)', fgk: 120, deltaT: 200, desc: 'Thermisch voll vorgespannt, bricht in kleine stumpfkantige Krümel, keine Resttragfähigkeit' },
};

export default function Glas() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'festigkeit' | 'verbundglas' | 'isoglas'>('steckbrief');

  const [glassType, setGlassType] = useState<keyof typeof glassTypes>('SPG');
  const [sigma, setSigma] = useState(45); // Spannung in MPa
  const [area, setArea] = useState(1.0); // Fläche in m²
  const [m, setM] = useState(7); // Weibull-Modul
  const [sigma0, setSigma0] = useState(60); // Charakteristische Festigkeit

  const [temp, setTemp] = useState(20); // Temperatur in °C
  const [duration, setDuration] = useState<'short' | 'medium' | 'long'>('short'); // Lasteinwirkungsdauer

  const weibullData = useMemo(() => {
    const data = [];
    const A0 = 1.0; // Bezugsfläche
    
    for (let s = 0; s <= 120; s += 2) {
      // Pf = 1 - exp( - (sigma/sigma0)^m * (A/A0) )
      const Pf = 1 - Math.exp(-Math.pow(s / sigma0, m) * (area / A0));
      data.push({ x: s, y: Pf * 100 }); // in %
    }

    const currentPf = 1 - Math.exp(-Math.pow(sigma / sigma0, m) * (area / A0));

    return {
      datasets: [
        {
          label: `Bruchwahrscheinlichkeit (A = ${formatDeWert(area)} m², m = ${formatDeWert(m)})`,
          data: data,
          borderColor: '#64748b',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          fill: true,
          borderWidth: 3,
          pointRadius: 0,
        },
        {
          label: 'Aktuelle Spannung σ',
          data: [{ x: sigma, y: currentPf * 100 }],
          backgroundColor: '#A3113E',
          borderColor: '#A3113E',
          pointRadius: 6,
          pointHoverRadius: 8,
          showLine: false,
        }
      ]
    };
  }, [area, m, sigma0, sigma]);

  const vsgData = useMemo(() => {
    // Schubmodul G von PVB (vereinfachte Interpolation)
    // Kurz (Wind), Mittel (Schnee), Lang (Eigengewicht)
    // Lehrannahme: Schubmodul-Werte stark vereinfacht (produktabhängig, maßgebend Zulassung/Datenblatt)
    const G_values = {
      short: { 0: 400, 20: 10, 40: 0.5, 60: 0.1 },
      medium: { 0: 100, 20: 1.0, 40: 0.1, 60: 0.01 },
      long: { 0: 10, 20: 0.1, 40: 0.01, 60: 0.001 }
    };

    // Interpolate G based on temp
    const getG = (t: number, dur: 'short' | 'medium' | 'long') => {
      const vals = G_values[dur] as Record<number, number>;
      if (t <= 0) return vals[0];
      if (t >= 60) return vals[60];
      const keys = [0, 20, 40, 60];
      for (let i = 0; i < keys.length - 1; i++) {
        if (t >= keys[i] && t <= keys[i+1]) {
          const ratio = (t - keys[i]) / (keys[i+1] - keys[i]);
          return vals[keys[i]] + ratio * (vals[keys[i+1]] - vals[keys[i]]);
        }
      }
      return 0.1;
    };

    const G = getG(temp, duration);
    
    // Schubverbund VSG (2x 8mm Glas, 1.52mm PVB)
    const h1 = 8;
    const h2 = 8;
    const d = 1.52;
    const E = 70000; // MPa
    const a = 1000; // Spannweite in mm
    const hm = (h1 + h2) / 2 + d;
    const Is = h1 * Math.pow(hm/2, 2) + h2 * Math.pow(hm/2, 2); // vereinfacht

    // DIN EN 16612: Γ = 1 / (1 + 9,6·E·I_s·h_v / (G·h_m²·a²))
    const Gamma = 1 / (1 + 9.6 * E * Is * d / (G * Math.pow(hm, 2) * Math.pow(a, 2)));
    
    // h_ef,w = ∛(h1³ + h2³ + 12·Γ·I_s)
    const hef_w = Math.cbrt(Math.pow(h1, 3) + Math.pow(h2, 3) + 12 * Gamma * Is);

    return { G, Gamma, hef_w };
  }, [temp, duration]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Glas im Bauwesen
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Glas ist ein spröder, linear-elastischer Werkstoff, dessen Festigkeit maßgeblich von mikroskopischen Oberflächenfehlern abhängt. Das Tragverhalten wird statistisch über die Weibull-Verteilung beschrieben.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Baustoff-Steckbrief
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'festigkeit' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('festigkeit')}
          >
            <Activity size={16} /> Festigkeit &amp; Bruchwahrscheinlichkeit
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'verbundglas' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('verbundglas')}
          >
            <Layers size={16} /> Verbundsicherheitsglas (VSG)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'isoglas' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('isoglas')}
          >
            <Maximize size={16} /> Mehrscheiben-Isolierglas (MIG)
          </button>
        </div>

      {activeTab === 'festigkeit' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
        <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Glasart & Eigenschaften</h3>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Glasart</label><InfoTooltip text="Art des verwendeten Glases (z.B. Floatglas, ESG)." /></div>
                <select aria-label="Glasart" 
                  className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                  value={glassType}
                  onChange={(e) => {
                    const type = e.target.value as keyof typeof glassTypes;
                    setGlassType(type);
                    setSigma0(glassTypes[type].fgk * 1.5); // Lehrmodell: σ0 = 1,5 · f_g,k (keine Normgröße)
                  }}
                >
                  {Object.entries(glassTypes).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
                <p className="text-text-main/80 mb-3 font-medium">{glassTypes[glassType].desc}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-main/60">Char. Festigkeit <FormulaText text="f_{g,k}" />:</span>
                    <span className="font-bold">{formatDeWert(glassTypes[glassType].fgk)} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-main/60">Temp.-Wechsel <FormulaText text="\Delta T" />:</span>
                    <span className="font-bold">{formatDeWert(glassTypes[glassType].deltaT)} K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-main/60">Dichte <FormulaText text="\rho" />:</span>
                    <span className="font-bold">2500 kg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-main/60">E-Modul <FormulaText text="E" />:</span>
                    <span className="font-bold">70.000 MPa</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Sprödbruch (Weibull-Verteilung)</h3>
              <p className="text-sm text-text-main/80 mb-4">
                Glas versagt spröde. Die Festigkeit hängt von der Größe der Oberfläche ab (Größeneffekt). Größere Scheiben haben eine höhere Wahrscheinlichkeit für Mikrorisse.
              </p>
              
              <Slider info="Vorhandene Spannung im Glas." label={<FormulaText text="Vorhandene Spannung σ" />} min={10} max={100} step={1} value={sigma} unit="MPa" onChange={(e) => setSigma(Number(e.target.value))} />
              <div className="mt-4">
                <Slider label="Scheibenfläche A"  min={0.1} max={10} step={0.1} value={area} unit="m²" onChange={(e) => setArea(Number(e.target.value))} />
              </div>
              <div className="mt-4">
                <Slider label="Weibull-Modul m" info="Parameter für die Streuung der Festigkeit bei spröden Werkstoffen." min={3} max={15} step={1} value={m} unit="-" onChange={(e) => setM(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[400px]">
              <h3 className="text-lg font-bold text-text-main mb-4"><FormulaText text="Bruchwahrscheinlichkeit P_f" /></h3>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={weibullData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { type: 'linear', title: { display: true, text: 'Spannung σ (MPa)' } },
                      y: { title: { display: true, text: 'Bruchwahrscheinlichkeit (%)' }, min: 0, max: 100 }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'verbundglas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Verbundsicherheitsglas (VSG)</h3>
              <p className="text-sm text-text-main/80 mb-4">
                Der Schubverbund der PVB-Folie hängt stark von Temperatur und Lasteinwirkungsdauer ab. Bei langzeitigen Lasten oder hohen Temperaturen wird Schubmodul G sehr gering und es tritt kaum Schubverbund auf (Gleitverbund). Bei Kurzzeitlasten ist er hingegen ausgeprägt. Hinweis: Nach DIN 18008 darf der Schubverbund in Deutschland grundsätzlich nicht angesetzt werden (Ausnahme: Zulassung bzw. Bauartgenehmigung); der Rechner zeigt das Prinzip mit vereinfachten G-Werten (Lehrannahme).
              </p>
              
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Lasteinwirkungsdauer</label><InfoTooltip text="Dauer, über die die Last auf das Bauteil einwirkt." /></div>
                <select aria-label="Lasteinwirkungsdauer" 
                  className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as any)}
                >
                  <option value="short">Kurz (Wind, Stoß)</option>
                  <option value="medium">Mittel (Schnee, Personen)</option>
                  <option value="long">Lang (Eigengewicht)</option>
                </select>
              </div>

              <Slider label={<div className="flex items-center gap-2">Temperatur <FormulaText text="T" /></div>} min={-20} max={60} step={5} value={temp} unit="°C" onChange={(e) => setTemp(Number(e.target.value))} />
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                  <div className="text-xs text-home-grau mb-1">Schubmodul PVB (<FormulaText text="G_{PVB}" />)</div>
                  <div className="font-bold text-shiraz text-xl">{formatDeZahl(vsgData.G, 2)} MPa</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                  <div className="text-xs text-home-grau mb-1">Effektive Dicke (<FormulaText text="h_{ef,w}" />)</div>
                  <div className="font-bold text-text-main text-xl">{formatDeZahl(vsgData.hef_w, 1)} mm</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: VSG (Verbundsicherheitsglas)</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="160" viewBox="0 0 350 160">
                  {/* Glas 1 */}
                  <rect x="100" y="40" width="150" height="20" fill="#cbd5e1" opacity="0.6" stroke="#475569" strokeWidth="1" />
                  <text x="175" y="54" fontSize="10" fill="#1e293b" textAnchor="middle">Glas 1 (h_1)</text>

                  {/* PVB Folie */}
                  <rect x="100" y="60" width="150" height="10" fill="#cbd5e1" opacity="0.8" />
                  <text x="175" y="68" fontSize="8" fill="#475569" textAnchor="middle">PVB-Folie (G)</text>

                  {/* Glas 2 */}
                  <rect x="100" y="70" width="150" height="20" fill="#cbd5e1" opacity="0.6" stroke="#475569" strokeWidth="1" />
                  <text x="175" y="84" fontSize="10" fill="#1e293b" textAnchor="middle">Glas 2 (h_2)</text>

                  {/* Schubverbund Pfeile */}
                  <path d="M 120 65 L 140 65" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-glas)" />
                  <path d="M 230 65 L 210 65" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-glas)" />
                  <text x="175" y="60" fontSize="8" fill="#A3113E" textAnchor="middle">Schubübertragung (Γ)</text>

                  {/* Biegung (symbolisch) */}
                  <path d="M 100 110 Q 175 140 250 110" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 175 100 L 175 120" stroke="#1e293b" strokeWidth="2" markerEnd="url(#arrow-black-glas)" />

                  <defs>
                    <marker id="arrow-red-glas" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                    </marker>
                    <marker id="arrow-black-glas" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Verbundsicherheitsglas (VSG) besteht aus Glasscheiben, die durch eine zähelastische Folie (meist PVB) verbunden sind. Die Folie überträgt Schubkräfte (Γ) zwischen den Scheiben. Bei Bruch bindet die Folie die Splitter und sorgt für eine Resttragfähigkeit.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'isoglas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Mehrscheiben-Isolierglas (MIG)</h3>
              <p className="text-sm text-text-main/80 mb-4">
                MIG besteht aus zwei oder mehr Glasscheiben, die durch einen luft- oder gasgefüllten Scheibenzwischenraum (SZR) getrennt sind. Der SZR ist hermetisch abgedichtet (Randverbund).
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2 text-sm text-gray-700">
                <li><strong>Wärmeschutz (Ug-Wert):</strong> Edelgasfüllungen (Argon, Krypton) und Low-E-Beschichtungen (hauchdünne Metallschichten) reduzieren den Wärmedurchgang erheblich.</li>
                <li><strong>Klimatische Belastung:</strong> Da der SZR hermetisch geschlossen ist, verhält er sich wie eine Gasfeder. Änderungen des äußeren Luftdrucks oder der Temperatur führen zu einer Wölbung der Scheiben ("Klimabelastung").</li>
                <li><strong>Isochoren-Druck:</strong> Der Druckunterschied wirkt als Flächenlast auf das Glaspaket.</li>
              </ul>
            </div>
            
             <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 mb-2">Klimalasten (p_0)</h3>
              <p className="text-sm text-blue-800">
                Wird MIG an einem Ort (z. B. im Werk) gefertigt und in deutlich abweichender Höhe über NN (anderer Luftdruck) eingebaut, müssen Klimalasten statisch berechnet werden. Ggf. ist ein kapillarer Druckausgleich notwendig.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">MIG Aufbau</h3>
              <div className="bg-off-white p-4 rounded-lg flex justify-center border border-home-grau/30">
                 <svg width="200" height="150" viewBox="0 0 200 150">
                    {/* Scheibe Außen */}
                    <rect x="50" y="20" width="10" height="110" fill="#cbd5e1" opacity="0.6" stroke="#475569" />
                    <text x="35" y="75" fontSize="10" fill="#1e293b" transform="rotate(-90 35,75)">Außen</text>
                    
                    {/* Low-E Schicht */}
                    <rect x="58" y="20" width="2" height="110" fill="#cbd5e1" />
                    
                    {/* Gasfüllung */}
                    <rect x="60" y="25" width="80" height="100" fill="#f1f5f9" opacity="0.5" />
                    <text x="100" y="75" fontSize="10" fill="#475569" textAnchor="middle">SZR (Argon)</text>
                    
                    {/* Abstandhalter */}
                    <rect x="60" y="20" width="80" height="5" fill="#94a3b8" />
                    <rect x="60" y="125" width="80" height="5" fill="#94a3b8" />
                    
                    {/* Scheibe Innen */}
                    <rect x="140" y="20" width="10" height="110" fill="#cbd5e1" opacity="0.6" stroke="#475569" />
                    <text x="160" y="75" fontSize="10" fill="#1e293b" transform="rotate(-90 160,75)">Innen</text>
                 </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300">
          <BaustoffProfil materialKey="glas" />
        </div>
      )}
      </div>
    
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Thermischer Glasbruch bei teilbeschattetem Floatglas"
          zielGleichung="\sigma_T \approx E \cdot \alpha_T \cdot \Delta T"
          normQuelle="Lehrmodell (voll behinderte Dehnung); zulässige Temperaturdifferenzen als Richtwerte"
          schritte={[
            { titel: '1. Gegeben', formel: 'E = 70\\,000\\,\\text{N/mm}^2,\\; \\alpha_T = 9 \\cdot 10^{-6}\\,\\text{K}^{-1}', erklaerung: 'Kalk-Natron-Silikatglas.' },
            { titel: '2. Temperaturdifferenz', formel: '\\Delta T = 40\\,\\text{K}\\;(\\text{besonnte Scheibenmitte gegen beschatteten, kalten Rand})', erklaerung: 'Typisch bei Teilverschattung oder dunklen Gegenständen hinter der Scheibe.' },
            { titel: '3. Zugspannung am Rand', formel: '\\sigma_T \\approx 70\\,000 \\cdot 9 \\cdot 10^{-6} \\cdot 40 \\approx 25\\,\\text{N/mm}^2', erklaerung: 'Die kalte Randzone wird von der warmen Mitte gedehnt.' },
            { titel: '4. Bewertung', formel: '\\Delta T = 60\\,\\text{K} \\Rightarrow \\sigma_T \\approx 38\\,\\text{N/mm}^2', erklaerung: 'Damit ist die Kantenfestigkeit von Floatglas (Kantenbearbeitung, Mikrorisse) schnell erreicht – TVG (≈ 100 K) und ESG (≈ 200 K) vertragen deutlich mehr.' },
          ]}
          ergebnisHinweis="Bei Risiko thermischer Spannungen (Teilverschattung, Heizkörper, Sonnenschutzfolien) wird TVG oder ESG gewählt; die Kanten sind sauber zu bearbeiten."
        />
      </div>

      <ModulTest moduleId="glas" />

      <ModuleFooter 
        wikipedia={[
        { title: 'Glas', url: 'https://de.wikipedia.org/wiki/Glas' },
        { title: 'Verbundsicherheitsglas', url: 'https://de.wikipedia.org/wiki/Verbundsicherheitsglas' }
      ]}
        literatur={[
          'Weller, B.; Krampe, P.; Reich, S.: Glasbau-Praxis – Konstruktion und Bemessung, Band 1 und 2. Berlin: Beuth 2013 (Auflage manuell prüfen)'
        ]}
        regelwerke={[
          { title: 'DIN 18008-1:2020-05 (Glas im Bauwesen - Bemessungs- und Konstruktionsregeln - Teil 1: Begriffe und allgemeine Grundlagen)' },
          { title: 'DIN 18008-2:2020-05 (Glas im Bauwesen - Teil 2: Liniengestützte Verglasungen unter Wind- und Schneeeinwirkungen)' },
          { title: 'DIN 18008-3:2020-05 (Glas im Bauwesen - Teil 3: Punktförmig gelagerte Verglasungen)' },
          { title: 'DIN 18008-4:2020-05 (Glas im Bauwesen - Teil 4: Zusatzanforderungen an absturzsichernde Verglasungen)' },
          { title: 'DIN EN 572-1:2016-06 (Glas im Bauwesen - Basiserzeugnisse aus Kalk-Natronsilicatglas)' },
          { title: 'DIN EN 12150-1:2020-07 (Glas im Bauwesen - Thermisch vorgespanntes Kalknatron-Einscheibensicherheitsglas ESG)' },
          { title: 'DIN EN ISO 12543-1:2022-04 (Glas im Bauwesen - Verbundglas und Verbund-Sicherheitsglas VSG)' },
          { title: 'DIN EN 16612:2019-12 (Glas im Bauwesen - Bestimmung des Lastwiderstandes von Glasscheiben durch Berechnung und Prüfung)' }
        ]}
        formeln={[
          {
            formel: 'h_{ef,w} = \\sqrt[3]{h_1^3 + h_2^3 + 12 \\cdot \\Gamma \\cdot I_s}, \\quad I_s = h_1 h_{m,2}^2 + h_2 h_{m,1}^2',
            erklaerung: 'Effektive Dicke für Durchbiegungen bei Verbundsicherheitsglas (VSG) nach DIN 18008-1:2020-05 / DIN EN 16612:2019-12. \\Gamma beschreibt den Schubverbundbeiwert (0 = gleitend, 1 = starr) der polymeren Zwischenschicht (PVB/SentryGlas).',
            quelle: 'DIN EN 16612:2019-12'
          },
          {
            formel: 'f_{g,d} = \\frac{k_{mod} \\cdot k_{sp} \\cdot f_{g,k}}{\\gamma_M}',
            erklaerung: 'Bemessungswert der Biegezugfestigkeit für thermisch nicht vorgespanntes Floatglas (Spiegelglas). k_{mod} berücksichtigt die Lasteinwirkungsdauer (Subkritisches Risswachstum), k_{sp} den Oberflächenzustand (EN 16612). In Deutschland nach DIN 18008-1: f_{g,d} = k_{mod}·k_c·f_{g,k}/γ_M, Floatglas γ_M = 1,8 (manuell prüfen).',
            quelle: 'DIN EN 16612:2019-12'
          }
        ]}
      />
    </div>
  );
}
