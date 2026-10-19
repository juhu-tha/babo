import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Network, GitMerge, Layers, BookOpen } from 'lucide-react';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
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
import { FormulaText } from '@/src/components/ui/FormulaText';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const fibers = {
  'Carbon (HT)': { ef: 230, sf: 3500, rho: 1.8, desc: 'High-Tenacity Carbonfaser' },
  'Carbon (HM)': { ef: 390, sf: 2500, rho: 1.9, desc: 'High-Modulus Carbonfaser' },
  'E-Glas': { ef: 73, sf: 2400, rho: 2.6, desc: 'Standard Glasfaser' },
  'Aramid': { ef: 130, sf: 2900, rho: 1.45, desc: 'Kevlar/Twaron' },
};

const matrices = {
  'Epoxidharz': { em: 3.2, sm: 70, rho: 1.2 },
  'Polyesterharz': { em: 2.8, sm: 50, rho: 1.2 },
  'Polyamid (PA6)': { em: 2.5, sm: 60, rho: 1.14 },
};

export default function Faserverbund() {
  const [activeTab, setActiveTab] = useState<'mikromechanik' | 'anwendungen' | 'steckbrief'>('steckbrief');
  
  const [fiberType, setFiberType] = useState<keyof typeof fibers>('Carbon (HT)');
  const [matrixType, setMatrixType] = useState<keyof typeof matrices>('Epoxidharz');
  const [vf, setVf] = useState(40); // Faservolumengehalt %

  const ef = fibers[fiberType].ef;
  const sf = fibers[fiberType].sf;
  const em = matrices[matrixType].em;
  const sm = matrices[matrixType].sm;

  const results = useMemo(() => {
    const v_f = vf / 100;
    const v_m = 1 - v_f;
    
    // Voigt-Modell (Parallel, Längsrichtung)
    const E_parallel = ef * v_f + em * v_m;
    const S_parallel = sf * v_f + sm * v_m;
    
    // Reuss-Modell (Reihe, Querrichtung)
    const E_quer = (ef * em) / (v_f * em + v_m * ef);
    
    const rho_composite = fibers[fiberType].rho * v_f + matrices[matrixType].rho * v_m;

    const labels = [];
    const eParallelData = [];
    const eQuerData = [];
    const currentPointParallel = [];
    const currentPointQuer = [];

    for (let v = 0; v <= 100; v += 5) {
      labels.push(v.toFixed(0));
      const current_v_f = v / 100;
      const current_v_m = 1 - current_v_f;
      
      const current_E_parallel = ef * current_v_f + em * current_v_m;
      const current_E_quer = (ef * em) / (current_v_f * em + current_v_m * ef);
      
      eParallelData.push(current_E_parallel);
      eQuerData.push(current_E_quer);

      if (Math.abs(v - vf) < 2.5) {
        currentPointParallel.push(E_parallel);
        currentPointQuer.push(E_quer);
      } else {
        currentPointParallel.push(null);
        currentPointQuer.push(null);
      }
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: 'E-Modul Längs (Voigt)',
          data: eParallelData,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'E-Modul Quer (Reuss)',
          data: eQuerData,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'Aktueller Wert (Längs)',
          data: currentPointParallel,
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        },
        {
          label: 'Aktueller Wert (Quer)',
          data: currentPointQuer,
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        }
      ]
    };

    return { E_parallel, E_quer, S_parallel, chartData, rho_composite };
  }, [vf, ef, em, sf, sm, fiberType, matrixType]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        title: { display: true, text: 'Faservolumengehalt v_f [%]', font: { weight: 'bold' as const } }
      },
      y: {
        title: { display: true, text: 'E-Modul [GPa]', font: { weight: 'bold' as const } },
        min: 0,
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Network className="text-shiraz" /> Faserverbundwerkstoffe
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Faserverbundwerkstoffe (wie CFK oder GFK) bestehen aus verstärkenden Fasern, die in eine Matrix eingebettet sind. Sie zeichnen sich durch hohe Zugfestigkeiten bei extrem geringem Eigengewicht aus. Da die Fasern hauptsächlich Zuglasten in Längsrichtung abtragen, sind solche Werkstoffe stark anisotrop (richtungsabhängig).
          </p>
        </div>
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
            activeTab === 'mikromechanik' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('mikromechanik')}
        >
          <GitMerge size={16} /> Mikromechanik (Mischungsregeln)
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'anwendungen' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('anwendungen')}
        >
          <Layers size={16} /> Anwendungen im Bauwesen
        </button>
      </div>

      {activeTab === 'mikromechanik' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Faserart</label><InfoTooltip text="Art der verwendeten Verstärkungsfasern." /></div>
                  <select 
                    className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                    value={fiberType}
                    onChange={(e) => setFiberType(e.target.value as keyof typeof fibers)}
                  >
                    {Object.keys(fibers).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Matrixart</label><InfoTooltip text="Art des verwendeten Matrixmaterials (Kunstharz)." /></div>
                  <select 
                    className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                    value={matrixType}
                    onChange={(e) => setMatrixType(e.target.value as keyof typeof matrices)}
                  >
                    {Object.keys(matrices).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              </div>

              <Slider label="Faservolumengehalt v_f" info="Volumenanteil der Fasern im Verbundwerkstoff." min={0} max={80} step={1} value={vf} unit="%" onChange={(e) => setVf(Number(e.target.value))} />
              
              <div className="mt-6 p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
                <h4 className="font-bold mb-2 text-text-main">Materialkennwerte</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-text-main/60">E-Modul Faser:</span><span className="font-bold">{formatDeWert(ef)} GPa</span></div>
                  <div className="flex justify-between"><span className="text-text-main/60">Zugfestigkeit Faser:</span><span className="font-bold">{formatDeWert(sf)} MPa</span></div>
                  <div className="flex justify-between"><span className="text-text-main/60">Dichte Faser:</span><span className="font-bold">{formatDeWert(fibers[fiberType].rho)} g/cm³</span></div>
                  <div className="col-span-2 border-t border-home-grau/30 my-1"></div>
                  <div className="flex justify-between"><span className="text-text-main/60">E-Modul Matrix:</span><span className="font-bold">{formatDeWert(em)} GPa</span></div>
                  <div className="flex justify-between"><span className="text-text-main/60">Zugfestigkeit Matrix:</span><span className="font-bold">{formatDeWert(sm)} MPa</span></div>
                  <div className="flex justify-between"><span className="text-text-main/60">Dichte Matrix:</span><span className="font-bold">{formatDeWert(matrices[matrixType].rho)} g/cm³</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-shiraz text-white p-6 rounded-xl shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Steifigkeit & Festigkeit</h3>
              <div className="grid grid-cols-1 gap-4">
                <div><div className="text-white/70 text-sm">Dichte Verbund</div><div className="text-3xl font-bold">{formatDeZahl(results.rho_composite, 2)} g/cm³</div></div>
                <div><div className="text-white/70 text-sm">E-Modul Längsrichtung (Voigt)</div><div className="text-3xl font-bold">{formatDeZahl(results.E_parallel, 1)} GPa</div></div>
                <div><div className="text-white/70 text-sm">E-Modul Querrichtung (Reuss)</div><div className="text-3xl font-bold">{formatDeZahl(results.E_quer, 1)} GPa</div></div>
                <div><div className="text-white/70 text-sm">Zugfestigkeit Längsrichtung</div><div className="text-3xl font-bold">{formatDeZahl(results.S_parallel, 0)} MPa</div></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 h-[300px] flex flex-col">
              <h3 className="text-sm font-bold text-center mb-2">E-Modul vs. Faservolumengehalt</h3>
              <div className="flex-1 relative">
                <Line data={results.chartData} options={chartOptions as any} />
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Mischungsregeln</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="160" viewBox="0 0 450 160">
                  {/* Voigt (Parallel) */}
                  <g transform="translate(50, 40)">
                    <text x="50" y="-20" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Voigt (Parallelschaltung)</text>
                    <text x="50" y="-5" fontSize="10" fill="#1e293b" textAnchor="middle">Längsrichtung (E_||)</text>
                    
                    <rect x="0" y="10" width="100" height="60" fill="#cbd5e1" stroke="#64748b" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeWidth="4" />
                    <line x1="0" y1="40" x2="100" y2="40" stroke="#1e293b" strokeWidth="4" />
                    <line x1="0" y1="55" x2="100" y2="55" stroke="#1e293b" strokeWidth="4" />
                    
                    <path d="M -20 40 L -5 40" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-faser)" />
                    <path d="M 120 40 L 105 40" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-faser)" />
                    <text x="-25" y="43" fontSize="10" fill="#A3113E" textAnchor="end">σ</text>
                    <text x="125" y="43" fontSize="10" fill="#A3113E" textAnchor="start">σ</text>
                  </g>

                  {/* Reuss (Reihe) */}
                  <g transform="translate(250, 40)">
                    <text x="50" y="-20" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Reuss (Reihenschaltung)</text>
                    <text x="50" y="-5" fontSize="10" fill="#1e293b" textAnchor="middle">Querrichtung (E_⊥)</text>
                    
                    <rect x="0" y="10" width="100" height="60" fill="#cbd5e1" stroke="#64748b" />
                    <line x1="25" y1="10" x2="25" y2="70" stroke="#1e293b" strokeWidth="4" />
                    <line x1="50" y1="10" x2="50" y2="70" stroke="#1e293b" strokeWidth="4" />
                    <line x1="75" y1="10" x2="75" y2="70" stroke="#1e293b" strokeWidth="4" />
                    
                    <path d="M -20 40 L -5 40" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-faser)" />
                    <path d="M 120 40 L 105 40" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-faser)" />
                    <text x="-25" y="43" fontSize="10" fill="#A3113E" textAnchor="end">σ</text>
                    <text x="125" y="43" fontSize="10" fill="#A3113E" textAnchor="start">σ</text>
                  </g>

                  <defs>
                    <marker id="arrow-red-faser" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Die Eigenschaften von Faserverbundwerkstoffen sind stark richtungsabhängig (anisotrop). In Faserrichtung (Voigt) dominieren die starken Fasern. Quer dazu (Reuss) dominiert die weichere Matrix.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'anwendungen' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-xl font-bold text-text-main border-b border-home-grau/30 pb-2">Anwendungen im Bauwesen</h3>
          
          <div className="space-y-4">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-lg mb-2">CFK-Lamellen (Nachträgliche Verstärkung)</h4>
              <p className="text-sm text-text-main/80 mb-2">
                Aufkleben von CFK-Lamellen auf biegebeanspruchte Stahlbetonbauteile (z. B. Brücken, Decken). Sie übernehmen Zugkräfte ähnlich einer Bewehrung.
              </p>
              <ul className="list-disc list-inside text-sm text-text-main/70">
                <li>Geringes Eigengewicht, keine Querschnittsvergrößerung.</li>
                <li>Absolute Korrosionsbeständigkeit.</li>
                <li>Brandschutz der Klebefuge ist kritisch (Harze erweichen bei ca. 60-80°C).</li>
              </ul>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-lg mb-2">GFK-Bewehrung (Nichtmetallische Bewehrung)</h4>
              <p className="text-sm text-text-main/80 mb-2">
                Ersatz für herkömmlichen Betonstahl in Bereichen mit hohen Korrosionsgefahren oder magnetisch sensiblen Bereichen (z. B. MRT-Räume).
              </p>
              <ul className="list-disc list-inside text-sm text-text-main/70">
                <li>Keine Betondeckung aus Korrosionsschutzgründen erforderlich (<FormulaText text="c_{nom}" /> kann reduziert werden).</li>
                <li>Geringerer E-Modul als Stahl (ca. 40-60 GPa statt 200 GPa) führt oft zu größeren Durchbiegungen und Rissbreiten.</li>
              </ul>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-lg mb-2">Pultrudierte Profile</h4>
              <p className="text-sm text-text-main/80 mb-2">
                Tragprofile (I-, U-, Rechteckrohr-Profile), die im Pultrusionsverfahren aus Glas- oder Kohlenstofffasern hergestellt werden.
              </p>
              <ul className="list-disc list-inside text-sm text-text-main/70">
                <li>Anwendung im Brückenbau (Fußgängerbrücken), Küstenschutz, Kläranlagen.</li>
                <li>Sehr leichte Strukturen bei hoher chemischer Beständigkeit.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300">
          <BaustoffProfil materialKey="faserverbund" />
        </div>
      )}
    
      <ModuleFooter 
        wikipedia={[
          { title: 'Faserverbundwerkstoff', url: 'https://de.wikipedia.org/wiki/Faserverbundwerkstoff' },
          { title: 'Mikromechanik', url: 'https://de.wikipedia.org/wiki/Mikromechanik' }
        ]}
        literatur={[
          'Schürmann, H. (2007): Konstruieren mit Faser-Kunststoff-Verbunden - Grundlagen, Berechnung, Konstruktion (2. Auflage, Springer-Verlag)',
          'Ehrenstein, G. W. (2006): Faserverbund-Kunststoffe - Werkstoffe, Verarbeitung, Eigenschaften (Hanser Verlag)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 14125 (Faserverstärkte Kunststoffe - Bestimmung der Biegeeigenschaften)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+14125' },
          { title: 'DIN EN ISO 527-4 (Kunststoffe - Bestimmung der Zugeigenschaften von isotropen und anisotropen faserverstärkten Kunststoffverbundwerkstoffen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+527-4' },
          { title: 'VDI 2014 Blatt 3 (Entwicklung von Bauteilen aus Faser-Kunststoff-Verbund - Berechnung)', url: 'https://www.dinmedia.de/de/suche?q=VDI+2014+Blatt+3' }
        ]}
        formeln={[
          {
            formel: 'E_{\\parallel} = E_f \\cdot v_f + E_m \\cdot (1 - v_f)',
            erklaerung: 'Mischungsregel nach Voigt (Parallelschaltung, Längsrichtung). Berechnet den Elastizitätsmodul E_{\\parallel} in Faserlängsrichtung aus den Einzel-Moduln der Faser E_f und Matrix E_m gewichtet mit dem Faservolumenanteil v_f.',
            quelle: 'VDI 2014'
          },
          {
            formel: 'E_{\\perp} = \\frac{E_f \\cdot E_m}{v_f \\cdot E_m + (1 - v_f) \\cdot E_f}',
            erklaerung: 'Mischungsregel nach Reuss (Reihenschaltung, Querrichtung). Liefert den mathematisch unteren Grenzwert für den Elastizitätsmodul quer zur Faserorientierung.',
            quelle: 'Schürmann: Konstruieren mit Faser-Kunststoff-Verbunden / VDI 2014 Blatt 3'
          },
          {
            formel: '\\sigma_{\\parallel} = \\sigma_{f,u} \\cdot v_f + \\sigma\'_m \\cdot (1 - v_f)',
            erklaerung: 'Zugfestigkeit in Faserrichtung unter Annahme spröder Fasern und duktiler Matrix. \\sigma_{f,u} ist die Bruchspannung der Faser, \\sigma\'_m ist die Matrixspannung bei der Bruchdehnung der Fasern.',
            quelle: 'Schürmann: Konstruieren mit FKV'
          }
        ]}
      />
    </div>
  );
}
