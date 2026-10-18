import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
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
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { normalPDF } from '@/src/lib/math';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Layers, Activity } from 'lucide-react';

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

function StatistikSection() {
  const [fcm, setFcm] = useState(45); // Mittlere Festigkeit
  const [sigma, setSigma] = useState(4.0); // Standardabweichung
  const [format, setFormat] = useState<'zylinder' | 'wuerfel'>('zylinder');
  const [alphaCc, setAlphaCc] = useState(0.85);
  const [gammaC, setGammaC] = useState(1.5);
  const [pruefArt, setPruefArt] = useState<'erst' | 'stetig'>('stetig');

  const chartData = useMemo(() => {
    // 5% Fraktil
    const fck = fcm - 1.645 * sigma;
    
    // Scale factor for cube vs cylinder (approx 1 / 0.8 = 1.25)
    const scale = format === 'wuerfel' ? 1.25 : 1.0;
    
    const scaledFcm = fcm * scale;
    const scaledSigma = sigma * scale;
    const scaledFck = fck * scale;

    const minX = Math.floor(Math.max(0, scaledFcm - 4 * scaledSigma));
    const maxX = Math.ceil(scaledFcm + 4 * scaledSigma);
    
    // Generate x values: fine steps for a smooth curve + the exact scaledFck point for a sharp vertical cutoff
    const rawXValues = [];
    const step = (maxX - minX) / 100;
    for (let i = 0; i <= 100; i++) {
      rawXValues.push(minX + i * step);
    }
    rawXValues.push(scaledFck);
    // Sort and remove duplicates
    const xValues = Array.from(new Set(rawXValues)).sort((a, b) => a - b);
    
    const yValues = xValues.map(x => normalPDF(x, scaledFcm, scaledSigma));
    
    // Create a dataset for the red shaded area (x <= fck)
    const redAreaX = [];
    const redAreaY = [];
    
    xValues.forEach(x => {
      if (x <= scaledFck) {
        redAreaX.push(x);
        redAreaY.push(normalPDF(x, scaledFcm, scaledSigma));
      }
    });
    // Add the vertical drop
    redAreaX.push(scaledFck);
    redAreaY.push(0);

    return {
      datasets: [
        {
          label: '5%-Fraktil (Ausschuss)',
          data: redAreaX.map((x, i) => ({ x: x, y: redAreaY[i] })),
          backgroundColor: 'rgba(255, 3, 80, 0.6)', // Torch Red
          borderColor: 'transparent',
          fill: true,
          pointRadius: 0,
          tension: 0, // No tension for the red area to keep the drop vertical
        },
        {
          label: 'Wahrscheinlichkeitsdichte',
          data: xValues.map((x, i) => ({ x: x, y: yValues[i] })),
          borderColor: '#A3113E', // Shiraz
          backgroundColor: 'rgba(210, 210, 210, 0.3)', // Home Grau
          borderWidth: 2,
          fill: true,
          pointRadius: 0,
          tension: 0.4,
        },
        {
          label: `f_ck (${scaledFck.toFixed(1)})`,
          data: [{ x: scaledFck, y: 0 }, { x: scaledFck, y: Math.max(...yValues) }],
          borderColor: '#1e293b',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }
      ]
    };
  }, [fcm, sigma, format]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false, // Hide Y axis as density values aren't intuitive
        beginAtZero: true,
      },
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: `Druckfestigkeit (N/mm²) - ${format === 'zylinder' ? 'Zylinder' : 'Würfel'}`,
          font: { family: 'Work Sans', weight: 'bold' as const }
        },
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            if (Number.isInteger(value)) {
              return value;
            }
            return null;
          }
        }
      }
    },
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          title: (context: any) => `Festigkeit: ${Number(context[0].parsed.x).toFixed(1)} N/mm²`,
          label: () => '' // Simplify tooltip
        }
      }
    }
  };

  // Base calculations are always on cylinder strength for design values
  const fckCyl = fcm - 1.645 * sigma;
  const fcd = (alphaCc * fckCyl) / gammaC;
  
  // Display values scaled for the selected format
  const scale = format === 'wuerfel' ? 1.25 : 1.0;
  const displayFcm = fcm * scale;
  const displaySigma = sigma * scale;
  const displayFck = fckCyl * scale;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
      <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><Layers className="text-shiraz" /> Statistik & Konformität</h2>
      

        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            <FormulaText text="Beton ist ein Naturprodukt, dessen Festigkeit streut. Dieses Modul zeigt, wie aus vielen Einzelprüfungen (Mittelwert f_{cm} und Streuung σ) der verlässliche charakteristische Wert (f_{ck}) berechnet wird, der für die statische Bemessung (f_{cd}) verwendet wird." />
          </p>
        </div>

        <Slider info="Der statistische Mittelwert aller ermittelten Druckfestigkeiten aus der Probekörperserie."
          label={<FormulaText text="Mittlere Festigkeit (f_{cm,cyl})" />}
          min={20} max={100} step={1}
          value={fcm} unit="N/mm²"
          
          onChange={(e) => setFcm(Number(e.target.value))}
        />
        
        <Slider info="Maß für die Streuung der Festigkeitswerte um den Mittelwert. Höhere Werte bedeuten stärkere Produktionsschwankungen."
          label={<FormulaText text="Standardabweichung (σ_{cyl})" />}
          min={1.0} max={10.0} step={0.1}
          value={sigma} unit="N/mm²"
          
          onChange={(e) => setSigma(Number(e.target.value))}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Anzeigeformat</label><InfoTooltip text="Wählen Sie das geometrische Prüf-Format für die Auswertung." /></div>
            <InfoTooltip text="Zylinder (150x300mm) oder Würfel (150x150x150mm). Würfeldruckfestigkeiten sind aufgrund der behinderten Querdehnung an den Druckplatten ca. 20-25% höher als Zylinderdruckfestigkeiten. Die Bemessung (f_{cd}) basiert immer auf der Zylinderfestigkeit." />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="format" 
                value="zylinder" 
                checked={format === 'zylinder'}
                onChange={() => setFormat('zylinder')}
                className="accent-shiraz"
              />
              Zylinder
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="format" 
                value="wuerfel" 
                checked={format === 'wuerfel'}
                onChange={() => setFormat('wuerfel')}
                className="accent-shiraz"
              />
              Würfel
            </label>
          </div>
        </div>

        <div className="border-t border-home-grau/30 pt-4 mt-2">
          <h3 className="text-sm font-bold text-text-main mb-4">Bemessungswerte (Design)</h3>
          
          <Slider info="Beiwert zur Berücksichtigung von Langzeitwirkungen auf die Druckfestigkeit und ungünstigen Lasteinflüssen (nach DIN EN 1992-1-1 Nationaler Anhang meist 0.85)."
            label={<FormulaText text="Beiwert (α_{cc})" />}
            min={0.8} max={1.0} step={0.05}
            value={alphaCc} unit=""
            
            onChange={(e) => setAlphaCc(Number(e.target.value))}
          />
          
          <Slider info="Teilsicherheitsbeiwert für Beton zur Abminderung der charakteristischen Druckfestigkeit auf das Bemessungsniveau (öffentlich geregelt bei 1.5 für ständige Bemessungssituationen)."
            label={<FormulaText text="Teilsicherheitsbeiwert (γ_c)" />}
            min={1.2} max={1.5} step={0.1}
            value={gammaC} unit=""
            
            onChange={(e) => setGammaC(Number(e.target.value))}
          />
        </div>

        <div className="border-t border-home-grau/30 pt-4 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-bold text-text-main">Konformitätsprüfung (DIN EN 206)</h3>
            <InfoTooltip text="Wählen Sie die Art der Prüfung. Erstprüfung (n=3) für neue Betonsorten oder stetige Produktion (n≥15) für laufende Überwachung." />
          </div>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input 
                type="radio" 
                name="pruefArt" 
                value="erst" 
                checked={pruefArt === 'erst'}
                onChange={() => setPruefArt('erst')}
                className="accent-shiraz"
              />
              Erstprüfung (n=3)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input 
                type="radio" 
                name="pruefArt" 
                value="stetig" 
                checked={pruefArt === 'stetig'}
                onChange={() => setPruefArt('stetig')}
                className="accent-shiraz"
              />
              Stetige Produktion (n≥15)
            </label>
          </div>
          
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/50 text-sm">
            {pruefArt === 'stetig' ? (
              <>
                <p className="text-text-main/80 mb-2">
                  Für eine stetige Produktion (n ≥ 15) gilt das Vorhaltekriterium:
                </p>
                <div className="bg-white p-2 rounded border border-home-grau text-center font-mono text-shiraz mb-2">
                  <FormulaText text="f_{cm} \ge f_{ck} + 1.48 \cdot \sigma" />
                </div>
                <p className="text-text-main/80">
                  Bei einem angestrebten 5%-Fraktil von <strong>{displayFck.toFixed(1)} N/mm²</strong> 
                  muss das Werk normativ einen Mittelwert von mindestens <strong>{(displayFck + 1.48 * displaySigma).toFixed(1)} N/mm²</strong> nachweisen.
                </p>
              </>
            ) : (
              <>
                <p className="text-text-main/80 mb-2">
                  Für die Erstprüfung (n = 3) gelten die Kriterien:
                </p>
                <div className="bg-white p-2 rounded border border-home-grau text-center font-mono text-shiraz mb-2">
                  <FormulaText text="Kriterium 1: f_{cm} \ge f_{ck} + 4" /><br/>
                  <FormulaText text="Kriterium 2: f_{ci} \ge f_{ck} - 4" />
                </div>
                <p className="text-text-main/80">
                  Bei einem angestrebten 5%-Fraktil von <strong>{displayFck.toFixed(1)} N/mm²</strong> 
                  muss der Mittelwert aus 3 Proben mindestens <strong>{(displayFck + 4).toFixed(1)} N/mm²</strong> betragen, und kein Einzelwert darf <strong>{(displayFck - 4).toFixed(1)} N/mm²</strong> unterschreiten.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col">
            <h3 className="text-sm font-bold text-text-main mb-3">Charakteristischer Wert (5% Fraktile)</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-text-main/80"><FormulaText text="Mittelwert (f_{cm}):" /></span>
                <span className="text-text-main font-bold">{displayFcm.toFixed(1)} MPa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-main/80"><FormulaText text="Standardabweichung (σ):" /></span>
                <span className="text-text-main font-bold">{displaySigma.toFixed(1)} MPa</span>
              </div>
              <div className="flex justify-between items-center border-t border-home-grau/30 pt-2 mt-1">
                <span className="text-text-main font-bold"><FormulaText text="Charakteristische Festigkeit (f_{ck}):" /></span>
                <span className="text-shiraz font-bold text-lg">{displayFck.toFixed(1)} MPa</span>
              </div>
              <div className="mt-2 text-xs text-shiraz font-medium bg-shiraz/10 p-2 rounded">
                Statistisch gesehen unterschreiten nur 5% aller Proben diesen Wert.
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col">
            <h3 className="text-sm font-bold text-text-main mb-3">Bemessungswert (Design)</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-text-main/80"><FormulaText text="Charakteristischer Wert (f_{ck,cyl}):" /></span>
                <span className="text-text-main font-bold">{fckCyl.toFixed(1)} MPa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-main/80"><FormulaText text="Faktoren (α_{cc} / γ_c):" /></span>
                <span className="text-text-main font-bold">{alphaCc.toFixed(2)} / {gammaC.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-home-grau/30 pt-2 mt-1">
                <span className="text-text-main font-bold"><FormulaText text="Bemessungswert (f_{cd}):" /></span>
                <span className="text-emerald-600 font-bold text-lg">{fcd.toFixed(1)} MPa</span>
              </div>
              <div className="mt-2 text-xs text-emerald-600 font-medium bg-emerald-50 p-2 rounded">
                Dieser Wert wird für die statische Bemessung im Grenzzustand der Tragfähigkeit (GZT) verwendet. Basiert immer auf Zylinderfestigkeit.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[500px]">
          <h2 className="text-xl font-bold text-text-main mb-2">Gaußsche Normalverteilung der Festigkeit</h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            <FormulaText text="Das 5%-Fraktil (f_{ck}) markiert den Wert, der nur von 5% der Proben unterschritten wird (rote Fläche)." />
          </p>
        </div>
          
          <div className="flex-1 relative w-full h-full">
            <Line data={chartData} options={options} />
          </div>
        </div>

        {/* Schematische Darstellung Zylinder vs Würfel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Zylinder- vs. Würfeldruckfestigkeit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Zylinder */}
            <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
              <div className="text-sm font-bold mb-2">Zylinder (150 x 300 mm)</div>
              <svg width="100%" height="150" viewBox="0 0 200 150">
                {/* Druckplatten */}
                <rect x="60" y="10" width="80" height="10" fill="#64748b" />
                <rect x="60" y="130" width="80" height="10" fill="#64748b" />
                
                {/* Zylinder */}
                <rect x="70" y="20" width="60" height="110" fill="#cbd5e1" stroke="#94a3b8" />
                
                {/* Kraftpfeile */}
                <path d="M 100 0 L 100 10" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                <path d="M 100 150 L 100 140" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                
                {/* Querdehnung (ungestört in der Mitte) */}
                <path d="M 70 75 L 50 75" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow-blue)" />
                <path d="M 130 75 L 150 75" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow-blue)" />
                
                {/* Reibungskegel (klein im Verhältnis) */}
                <path d="M 70 20 L 130 20 L 100 50 Z" fill="#94a3b8" opacity="0.5" />
                <path d="M 70 130 L 130 130 L 100 100 Z" fill="#94a3b8" opacity="0.5" />
              </svg>
              <div className="text-xs text-text-main/70 text-center mt-2">
                Der mittlere Bereich bleibt ungestört von der Reibung an den Druckplatten. Die Querdehnung kann frei stattfinden. Geringere gemessene Festigkeit (f_ck,cyl).
              </div>
            </div>

            {/* Würfel */}
            <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
              <div className="text-sm font-bold mb-2">Würfel (150 x 150 x 150 mm)</div>
              <svg width="100%" height="150" viewBox="0 0 200 150">
                {/* Druckplatten */}
                <rect x="50" y="25" width="100" height="10" fill="#64748b" />
                <rect x="50" y="115" width="100" height="10" fill="#64748b" />
                
                {/* Würfel */}
                <rect x="60" y="35" width="80" height="80" fill="#cbd5e1" stroke="#94a3b8" />
                
                {/* Kraftpfeile */}
                <path d="M 100 10 L 100 25" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                <path d="M 100 140 L 100 125" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                
                {/* Querdehnung (behindert) */}
                <path d="M 60 75 L 45 75" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" markerEnd="url(#arrow-blue)" />
                <path d="M 140 75 L 155 75" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" markerEnd="url(#arrow-blue)" />
                
                {/* Reibungskegel (überschneiden sich fast) */}
                <path d="M 60 35 L 140 35 L 100 70 Z" fill="#94a3b8" opacity="0.5" />
                <path d="M 60 115 L 140 115 L 100 80 Z" fill="#94a3b8" opacity="0.5" />
                
                <defs>
                  <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                  </marker>
                  <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                  </marker>
                </defs>
              </svg>
              <div className="text-xs text-text-main/70 text-center mt-2">
                Die Reibung an den Druckplatten behindert die Querdehnung im gesamten Probekörper (Reibungskegel). Dies führt zu einer scheinbar höheren Festigkeit (f_ck,cube).
              </div>
            </div>
          </div>
        </div>

        <ModuleFooter weblinks={[{ title: "Beton.wiki: Festbeton", url: "https://beton.wiki/index.php?title=Festbeton" }, { title: "Zement-Merkblätter Übersicht", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }]} 
          wikipedia={[
                { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' }
              ]}
              regelwerke={[
            'DIN EN 206: Beton - Teil 1: Festlegung, Eigenschaften, Herstellung und Konformität',
            'DIN 1045-2: Tragwerke aus Beton, Stahlbeton und Spannbeton - Teil 2: Beton',
            'DIN EN 1992-1-1 (Eurocode 2): Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken'
          ]}
          literatur={[
            'Grübl, P., Weigler, H., Karl, S.: Beton - Arten, Herstellung und Eigenschaften (2001)',
            'Locher, F. W.: Zement - Grundlagen der Herstellung und Verwendung (2000)'
          ]}
          formeln={[
            {
              formel: 'f_{ck} = f_{cm} - 1.645 \\cdot \\sigma',
              erklaerung: 'Charakteristische Druckfestigkeit (5%-Fraktil)\n\\sigma: Normalspannung [kN/m²] oder [N/mm²]\nf_{cm}: Mittlere Druckfestigkeit [N/mm²]\nf_{ck}: Charakteristische Druckfestigkeit [N/mm²]',
              quelle: 'Grübl, P., Weigler, H., Karl, S.: Beton - Arten, H...'
            },
            {
              formel: 'f_{cd} = \\alpha_{cc} \\cdot f_{ck,cyl} / \\gamma_c',
              erklaerung: 'Bemessungswert der Druckfestigkeit\n\\alpha_{cc}: Beiwert für Langzeiteffekte [-]\nf_{ck,cyl}: Charakteristische Zylinderdruckfestigkeit [N/mm²]\n\\gamma_c: Teilsicherheitsbeiwert für Beton [-]\nf_{cd}: Bemessungswert der Betondruckfestigkeit [N/mm²]',
              quelle: 'Grübl, P., Weigler, H., Karl, S.: Beton - Arten, H...'
            },
            {
              formel: 'f_{cm}(t) = \\beta_{cc}(t) \\cdot f_{cm}',
              erklaerung: 'Zeitliche Entwicklung der Druckfestigkeit\n\\beta_{cc}(t): Beiwert für die Festigkeitsentwicklung [-]\nf_{cm}(t): Mittlere Druckfestigkeit zum Zeitpunkt t [N/mm²]\nf_{cm}: Mittlere Druckfestigkeit [N/mm²]',
              quelle: 'Grübl, P., Weigler, H., Karl, S.: Beton - Arten, H...'
            },
            {
              formel: '\\beta_{cc}(t) = \\exp(s \\cdot (1 - \\sqrt{28 / t}))',
              erklaerung: 'Beiwert für die Festigkeitsentwicklung\n\\beta_{cc}(t): Beiwert für die Festigkeitsentwicklung [-]\ns: Setzung [m] oder [mm]\nt: Zeit [s], [min], [h] oder [d]',
              quelle: 'Grübl, P., Weigler, H., Karl, S.: Beton - Arten, H...'
            }
          ]}
        />
      </div>
    </div>
  );
}

export default function Festbeton() {
  const [fck, setFck] = useState(30);
  const [alter, setAlter] = useState(28);
  const [zementArt, setZementArt] = useState('N');
  const [geometrie, setGeometrie] = useState('Zylinder 150/300');
  const [lagerung, setLagerung] = useState('Normlagerung (Wasser/20°C)');

  // Berechnungen nach EC2
  const fcm = fck + 8;
  
  // Festigkeitsentwicklung mit der Zeit
  let s = 0.25; // N
  if (zementArt === 'S') s = 0.38;
  if (zementArt === 'R') s = 0.20;

  const beta_cc = Math.exp(s * (1 - Math.sqrt(28 / alter)));
  const fcm_t = fcm * beta_cc;
  const fck_t = fcm_t - 8;

  // Umrechnung Geometrie (Näherungswerte)
  let geoFaktor = 1.0;
  if (geometrie === 'Würfel 150') geoFaktor = 1.25; // fck,cube / fck,cyl ≈ 1.25
  if (geometrie === 'Würfel 100') geoFaktor = 1.30;
  if (geometrie === 'Würfel 200') geoFaktor = 1.20;
  if (geometrie === 'Prisma') geoFaktor = 1.05;

  // Umrechnung Lagerung (Näherungswerte)
  let lagerungsFaktor = 1.0;
  if (lagerung === 'Luftlagerung (trocken)') lagerungsFaktor = 0.9;
  if (lagerung === 'Feuchtlagerung') lagerungsFaktor = 0.95;
  if (lagerung === 'Heißhärtung') lagerungsFaktor = 0.85; // Oft geringere Endfestigkeit

  const fcm_t_geo_lag = fcm_t * geoFaktor * lagerungsFaktor;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-text-main">Eingabeparameter</h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            <FormulaText text="Die Druckfestigkeit von Beton wird standardmäßig nach 28 Tagen unter Normlagerung bestimmt. Beton erhärtet jedoch über Monate und Jahre weiter. Die Funktion \beta_{cc}(t) beschreibt diese zeitliche Entwicklung. Zudem zeigen Würfel aufgrund der behinderten Querdehnung scheinbar höhere Festigkeiten als schlanke Zylinder." />
          </p>
        </div>

        <Slider 
          label={<FormulaText text="Charakt. Zylinderdruckfestigkeit (f_{ck})" />}
          min={12} max={90} step={1}
          value={fck} unit=" MPa"
          info="fck nach 28 Tagen bei Normlagerung."
          onChange={(e) => setFck(Number(e.target.value))}
        />

        <Slider
          label="Betonalter (t)"
          min={1} max={365} step={1}
          value={alter} unit=" Tage"
          info="Alter des Betons zum Zeitpunkt der Prüfung."
          onChange={(e) => setAlter(Number(e.target.value))}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Zementklasse</label><InfoTooltip text="Klassifizierung der Festigkeitsentwicklung des Zements." /></div>
            <InfoTooltip text="S: langsam, N: normal, R: schnell erhärtend." />
          </div>
          <select 
            className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
            value={zementArt}
            onChange={(e) => setZementArt(e.target.value)}
          >
            <option value="S">Klasse S (langsam)</option>
            <option value="N">Klasse N (normal)</option>
            <option value="R">Klasse R (schnell)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Prüfgeometrie</label><InfoTooltip text="Form des Probekörpers (z.B. Zylinder, Würfel)." /></div>
            <InfoTooltip text="Form und Größe des Probekörpers." />
          </div>
          <select 
            className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
            value={geometrie}
            onChange={(e) => setGeometrie(e.target.value)}
          >
            <option value="Zylinder 150/300">Zylinder 150/300 mm (Referenz)</option>
            <option value="Würfel 150">Würfel 150 mm</option>
            <option value="Würfel 100">Würfel 100 mm</option>
            <option value="Würfel 200">Würfel 200 mm</option>
            <option value="Prisma">Prisma (z.B. 100x100x400)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Lagerungsbedingung</label><InfoTooltip text="Bedingungen während der Aushärtung (z.B. Wasser, Luft)." /></div>
            <InfoTooltip text="Bedingungen während der Erhärtung bis zur Prüfung." />
          </div>
          <select 
            className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
            value={lagerung}
            onChange={(e) => setLagerung(e.target.value)}
          >
            <option value="Normlagerung (Wasser/20°C)">Normlagerung (Wasser/20°C)</option>
            <option value="Feuchtlagerung">Feuchtlagerung (z.B. &gt;95% r.F.)</option>
            <option value="Luftlagerung (trocken)">Luftlagerung (trocken, z.B. 65% r.F.)</option>
            <option value="Heißhärtung">Heißhärtung (erhöhte Temp.)</option>
          </select>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h2 className="text-xl font-bold text-text-main mb-4">Umrechnung auf Normlagerung</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-home-grau mb-2">Referenz (28d, Zylinder, Normlagerung)</h3>
              <div className="text-3xl font-bold text-text-main">{fcm.toFixed(1)} <span className="text-lg font-normal">MPa</span></div>
              <div className="text-sm text-home-grau mt-1"><FormulaText text="Mittlere Druckfestigkeit f_{cm}" /></div>
            </div>
            
            <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/20">
              <h3 className="text-sm font-bold text-shiraz mb-2">Erwartete Festigkeit (Prüfung)</h3>
              <div className="text-3xl font-bold text-shiraz">{fcm_t_geo_lag.toFixed(1)} <span className="text-lg font-normal">MPa</span></div>
              <div className="text-sm text-shiraz/80 mt-1">Unter gewählten Bedingungen</div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-text-main mb-4">Einflussfaktoren</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-home-grau/30">
                  <th className="py-3 px-4 font-bold text-text-main">Faktor</th>
                  <th className="py-3 px-4 font-bold text-text-main">Wert</th>
                  <th className="py-3 px-4 font-bold text-text-main">Beschreibung</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-home-grau/10">
                  <td className="py-3 px-4 font-medium text-text-main"><FormulaText text="Alter (\beta_{cc})" /></td>
                  <td className="py-3 px-4">{beta_cc.toFixed(3)}</td>
                  <td className="py-3 px-4 text-sm text-home-grau">Festigkeitsentwicklung über die Zeit (t = {alter} d).</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-3 px-4 font-medium text-text-main">Geometrie</td>
                  <td className="py-3 px-4">{geoFaktor.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-home-grau">Umrechnung von {geometrie} auf Referenzzylinder.</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-3 px-4 font-medium text-text-main">Lagerung</td>
                  <td className="py-3 px-4">{lagerungsFaktor.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-home-grau">Einfluss der Nachbehandlung ({lagerung}).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <ModuleFooter 
      weblinks={[
        { title: "Beton.wiki: Festbeton", url: "https://beton.wiki/index.php?title=Festbeton" }, 
        { title: "Zement-Merkblätter Beton.org", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }
      ]} 
      wikipedia={[
        { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
        { title: 'Druckfestigkeit', url: 'https://de.wikipedia.org/wiki/Druckfestigkeit' }
      ]}
      regelwerke={[
        { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton - Festlegung, Eigenschaften, Konformität)', url: 'https://www.dinmedia.de/' },
        { title: 'DIN EN 12390-3:2019-10 (Prüfung von Festbeton - Druckfestigkeit von Probekörpern)', url: 'https://www.dinmedia.de/' },
        { title: 'DIN EN 1992-1-1:2023-08 (Eurocode 2: Bemessung und Konstruktion von Stahlbetontragwerken)', url: 'https://www.dinmedia.de/' }
      ]}
      literatur={[
        'Grübl, P.; Weigler, H.; Karl, S. (2001): Beton - Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
        'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
        'Zilch, K.; Zehetmaier, G. (2010): Bemessung im konstruktiven Betonbau (Springer)'
      ]}
      formeln={[
        {
          formel: 'f_{cm}(t) = \\beta_{cc}(t) \\cdot f_{cm}',
          erklaerung: 'Zeitabhängige mittlere Betondruckfestigkeit im Alter t Tage nach Eurocode 2.',
          quelle: 'DIN EN 1992-1-1 Abs. 3.1.2'
        },
        {
          formel: '\\beta_{cc}(t) = \\exp\\left( s \\cdot \\left[ 1 - \\sqrt{\\frac{28}{t}} \\right] \\right)',
          erklaerung: 'Entwicklungsbeiwert β_cc(t) nach Eurocode 2: s ist der zementabhängige Erhärtungskoeffizient (s = 0.20 für CEM 42.5 R / 52.5 R; s = 0.25 für CEM 32.5 R / 42.5 N; s = 0.38 für CEM 32.5 N).',
          quelle: 'DIN EN 1992-1-1 Gl. (3.1)'
        },
        {
          formel: 'f_{cm} = f_{ck} + 8\\,\\text{N/mm}^2',
          erklaerung: 'Beziehung zwischen charakteristischer Zylinderdruckfestigkeit fck und mittlerer Zylinderdruckfestigkeit fcm.',
          quelle: 'DIN EN 1992-1-1 Tab. 3.1'
        }
      ]}
    />
    </div>
  );
}
