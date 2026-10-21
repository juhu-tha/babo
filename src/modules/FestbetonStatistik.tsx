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
import { BarChart3, ShieldAlert } from 'lucide-react';
import Sicherheitskonzept from './Sicherheitskonzept';
import { formatDeZahl } from '@/src/utils/numberFormat';
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

export default function FestbetonStatistik() {
  const [fcm, setFcm] = useState(45); // Mittlere Festigkeit
  const [sigma, setSigma] = useState(4.0); // Standardabweichung
  const [format, setFormat] = useState<'zylinder' | 'wuerfel'>('zylinder');
  const [alphaCc, setAlphaCc] = useState(0.85);
  const [gammaC, setGammaC] = useState(1.5);
  const [pruefArt, setPruefArt] = useState<'erst' | 'stetig'>('stetig');

  const chartData = useMemo(() => {
    // 5% Fraktil
    const fck = fcm - 1.645 * sigma;
    
    // Näherung Würfel/Zylinder ≈ 1,25 (tatsächlich klassenabhängig, z. B. C30/37: 37/30 = 1,23)
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
          label: `f_ck (${formatDeZahl(scaledFck, 1)})`,
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
          title: (context: any) => `Festigkeit: ${formatDeZahl(Number(context[0].parsed.x), 1)} N/mm²`,
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
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <BarChart3 className="text-shiraz" /> Festbeton Statistik & Konformität
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            <FormulaText text="Beton ist ein Naturprodukt, dessen Festigkeit streut. Dieses Modul zeigt, wie aus vielen Einzelprüfungen (Mittelwert f_{cm} und Streuung σ) der verlässliche charakteristische Wert (f_{ck}) berechnet wird, der für die statische Bemessung (f_{cd}) verwendet wird." />
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Konfiguration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
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

              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Anzeigeformat</label></div>
                  <InfoTooltip text="Wählen Sie das geometrische Prüf-Format für die Auswertung." />
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
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-text-main mb-2">Bemessungswerte (Design)</h3>
              
              <Slider info="Beiwert zur Berücksichtigung von Langzeitwirkungen auf die Druckfestigkeit und ungünstiger Lasteinflüsse (nach DIN EN 1992-1-1/NA für Normalbeton 0,85)."
                label={<FormulaText text="Beiwert (α_{cc})" />}
                min={0.8} max={1.0} step={0.05}
                value={alphaCc} unit=""
                onChange={(e) => setAlphaCc(Number(e.target.value))}
              />
              
              <Slider info="Teilsicherheitsbeiwert für Beton (DIN EN 1992-1-1/NA: 1,5 für ständige und vorübergehende, 1,2 für außergewöhnliche Bemessungssituationen)."
                label={<FormulaText text="Teilsicherheitsbeiwert (γ_c)" />}
                min={1.2} max={1.5} step={0.1}
                value={gammaC} unit=""
                onChange={(e) => setGammaC(Number(e.target.value))}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-bold text-text-main">Konformitätskriterien (DIN EN 206, Tab. 14)</h3>
                <InfoTooltip text="Wählen Sie die Herstellungsart: Erstherstellung (bis zum Vorliegen von 35 Ergebnissen, Gruppen von n = 3) oder stetige Herstellung (n ≥ 15 bei bekannter Standardabweichung σ)." />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="radio" 
                    name="pruefArt" 
                    value="erst" 
                    checked={pruefArt === 'erst'}
                    onChange={() => setPruefArt('erst')}
                    className="accent-shiraz"
                  />
                  Erstherstellung (n = 3)
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
                  Stetige Herstellung (n ≥ 15)
                </label>
              </div>
              
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/50 text-sm">
                {pruefArt === 'stetig' ? (
                  <>
                    <p className="text-text-main/80 mb-2">
                      Für die stetige Herstellung (n ≥ 15, σ aus mindestens 35 Ergebnissen, σ ≥ 3 N/mm²) gelten:
                    </p>
                    <div className="bg-white p-2 rounded border border-home-grau text-center font-mono text-shiraz mb-2">
                      <FormulaText text="f_{cm} \ge f_{ck} + 1{,}48 \cdot \sigma" /><br/>
                      <FormulaText text="f_{ci} \ge f_{ck} - 4" />
                    </div>
                    <p className="text-text-main/80">
                      Bei einem angestrebten 5%-Fraktil von <strong>{formatDeZahl(displayFck, 1)} N/mm²</strong> 
                      muss der Mittelwert von n ≥ 15 Ergebnissen mindestens <strong>{formatDeZahl(displayFck + 1.48 * displaySigma, 1)} N/mm²</strong> betragen, und kein Einzelwert darf <strong>{formatDeZahl(displayFck - 4, 1)} N/mm²</strong> unterschreiten.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-text-main/80 mb-2">
                      Für die Erstherstellung (Gruppen von n = 3 Ergebnissen) gelten die Kriterien:
                    </p>
                    <div className="bg-white p-2 rounded border border-home-grau text-center font-mono text-shiraz mb-2">
                      <FormulaText text="Kriterium 1: f_{cm} \ge f_{ck} + 4" /><br/>
                      <FormulaText text="Kriterium 2: f_{ci} \ge f_{ck} - 4" />
                    </div>
                    <p className="text-text-main/80">
                      Bei einem angestrebten 5%-Fraktil von <strong>{formatDeZahl(displayFck, 1)} N/mm²</strong> 
                      muss der Mittelwert aus 3 Proben mindestens <strong>{formatDeZahl(displayFck + 4, 1)} N/mm²</strong> betragen, und kein Einzelwert darf <strong>{formatDeZahl(displayFck - 4, 1)} N/mm²</strong> unterschreiten.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col">
              <h3 className="text-sm font-bold text-text-main mb-3">Charakteristischer Wert (5% Fraktile)</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-text-main/80"><FormulaText text="Mittelwert (f_{cm}):" /></span>
                  <span className="text-text-main font-bold">{formatDeZahl(displayFcm, 1)} MPa</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-main/80"><FormulaText text="Standardabweichung (σ):" /></span>
                  <span className="text-text-main font-bold">{formatDeZahl(displaySigma, 1)} MPa</span>
                </div>
                <div className="flex justify-between items-center border-t border-home-grau/30 pt-2 mt-1">
                  <span className="text-text-main font-bold"><FormulaText text="Charakteristische Festigkeit (f_{ck}):" /></span>
                  <span className="text-shiraz font-bold text-lg">{formatDeZahl(displayFck, 1)} MPa</span>
                </div>
                <div className="mt-2 text-xs text-shiraz font-medium bg-shiraz/10 p-2 rounded">
                  Bei Normalverteilung unterschreiten 5 % der Grundgesamtheit diesen Wert.
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col">
              <h3 className="text-sm font-bold text-text-main mb-3">Bemessungswert (Design)</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-text-main/80"><FormulaText text="Charakteristischer Wert (f_{ck,cyl}):" /></span>
                  <span className="text-text-main font-bold">{formatDeZahl(fckCyl, 1)} MPa</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-main/80"><FormulaText text="Faktoren (α_{cc} / γ_c):" /></span>
                  <span className="text-text-main font-bold">{formatDeZahl(alphaCc, 2)} / {formatDeZahl(gammaC, 2)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-home-grau/30 pt-2 mt-1">
                  <span className="text-text-main font-bold"><FormulaText text="Bemessungswert (f_{cd}):" /></span>
                  <span className="text-emerald-600 font-bold text-lg">{formatDeZahl(fcd, 1)} MPa</span>
                </div>
                <div className="mt-2 text-xs text-emerald-600 font-medium bg-emerald-50 p-2 rounded">
                  Dieser Wert wird für die Bemessung im Grenzzustand der Tragfähigkeit (GZT) verwendet und basiert auf der Zylinderfestigkeit.
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
            
            <div className="flex justify-between items-center mb-4 text-sm bg-off-white p-3 rounded-lg border border-home-grau/30">
              <div><span className="font-bold text-text-main">Mittelwert (μ):</span> {formatDeZahl(displayFcm, 1)} N/mm²</div>
              <div><span className="font-bold text-text-main">Standardabweichung (σ):</span> {formatDeZahl(displaySigma, 1)} N/mm²</div>
              <div><span className="font-bold text-shiraz">5%-Fraktil (f_ck):</span> {formatDeZahl(displayFck, 1)} N/mm²</div>
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
                  Der mittlere Bereich bleibt weitgehend unbeeinflusst von der Reibung an den Druckplatten; die Querdehnung ist dort kaum behindert. Geringere gemessene Festigkeit (f_ck,cyl).
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
                  <path d="M 100 15 L 100 25" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  <path d="M 100 135 L 100 125" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  
                  {/* Querdehnung (behindert) */}
                  <path d="M 60 75 L 40 75" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow-blue)" />
                  <path d="M 140 75 L 160 75" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow-blue)" />
                  
                  {/* Reibungskegel (überschneiden sich) */}
                  <path d="M 60 35 L 140 35 L 100 75 Z" fill="#94a3b8" opacity="0.5" />
                  <path d="M 60 115 L 140 115 L 100 75 Z" fill="#94a3b8" opacity="0.5" />
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Die Reibungskegel der Druckplatten durchdringen den gesamten Probekörper und behindern die Querdehnung. Höhere gemessene Festigkeit (f_ck,cube).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
        <FormulaDerivationBox
          title="Beispiel 1: Konformität bei Erstherstellung (C30/37, Würfel)"
          zielGleichung="f_{cm} \ge f_{ck} + 4,\qquad f_{ci} \ge f_{ck} - 4"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Drei Würfelergebnisse einer neuen Betonsorte C30/37 (f_ck,cube = 37 N/mm²): 41,0 / 39,5 / 43,2 N/mm².', formel: 'f_{ck,cube} = 37\\,\\text{N/mm}^2' },
            { titel: 'Kriterium 1 (Mittelwert)', erklaerung: 'Mittelwert der Gruppe:', formel: 'f_{cm} = \\frac{41{,}0 + 39{,}5 + 43{,}2}{3} = 41{,}2 \\geq 37 + 4 = 41{,}0 \;\\checkmark' },
            { titel: 'Kriterium 2 (Einzelwert)', erklaerung: 'Kleinster Einzelwert:', formel: 'f_{ci,min} = 39{,}5 \\geq 37 - 4 = 33{,}0 \;\\checkmark' }
          ]}
          ergebnisHinweis="Beide Kriterien sind erfüllt – die Gruppe ist konform. Ein Mittelwert von nur 40,9 N/mm² hätte Kriterium 1 knapp verfehlt."
          normQuelle="DIN EN 206:2021-06, 8.2.1, Tab. 14"
        />
        <FormulaDerivationBox
          title="Beispiel 2: Konformität bei stetiger Herstellung und Bemessungswert"
          zielGleichung="f_{cm} \ge f_{ck} + 1{,}48\,\sigma,\qquad f_{cd} = \alpha_{cc} \cdot \frac{f_{ck}}{\gamma_c}"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'C30/37, n = 15 Würfelergebnisse, Mittelwert 44,5 N/mm², kleinster Einzelwert 34,1 N/mm², Standardabweichung aus 35 Vorwerten σ = 4,0 N/mm².', formel: '\\sigma = 4{,}0 \\geq 3{,}0\\,\\text{N/mm}^2' },
            { titel: 'Mittelwertkriterium', erklaerung: 'Erforderlicher Mittelwert:', formel: '37 + 1{,}48 \\cdot 4{,}0 = 42{,}9 \\leq 44{,}5 \;\\checkmark' },
            { titel: 'Einzelwertkriterium', erklaerung: 'Kleinster Einzelwert:', formel: '34{,}1 \\geq 37 - 4 = 33{,}0 \;\\checkmark' },
            { titel: 'Bemessungswert', erklaerung: 'Der Statiker rechnet mit der Zylinderfestigkeit f_ck = 30 N/mm² (α_cc = 0,85; γ_c = 1,5):', formel: 'f_{cd} = 0{,}85 \\cdot \\frac{30}{1{,}5} = 17{,}0\\,\\text{N/mm}^2' }
          ]}
          ergebnisHinweis="Die Konformität wird im Format der Prüfkörper (hier Würfel) nachgewiesen, die Bemessung erfolgt immer mit der Zylinderfestigkeit."
          normQuelle="DIN EN 206:2021-06, Tab. 14; DIN EN 1992-1-1/NA, 3.1.6"
        />

        {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
        <ModulTest moduleId="festbeton_statistik" />

        <ModuleFooter 
          lastReviewed="Oktober 2026 (AP 4 Labor: Konformitätskriterien DIN EN 206, Tab. 14, Fraktilwert und Bemessungswert nach DIN EN 1992-1-1/NA geprüft; fachliche Freigabe durch den Autor ausstehend)"
          wikipedia={[
            { title: 'Druckfestigkeit', url: 'https://de.wikipedia.org/wiki/Druckfestigkeit' },
            { title: 'Normalverteilung', url: 'https://de.wikipedia.org/wiki/Normalverteilung' },
            { title: 'Teilsicherheitskonzept', url: 'https://de.wikipedia.org/wiki/Teilsicherheitskonzept' }
          ]}
          regelwerke={[
            { title: 'DIN EN 206:2021-06 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)' },
            { title: 'DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Spannbeton - Teil 2: Beton)' },
            { title: 'DIN EN 12390-3:2019-10 (Prüfung von Festbeton - Teil 3: Druckfestigkeit von Probekörpern)' },
            { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit DIN EN 1992-1-1/NA:2013-04 (bauaufsichtlich eingeführt); neue Generation DIN EN 1992-1-1:2025-09' }
          ]}
          literatur={[
            'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
            'Zilch, K.; Zehetmaier, G.: Bemessung im konstruktiven Betonbau. 2. Aufl., Berlin: Springer 2010',
            'Grübl, P.; Weigler, H.; Karl, S.: Beton – Arten, Herstellung und Eigenschaften. 2. Aufl., Berlin: Ernst & Sohn 2001'
          ]}
          formeln={[
            {
              formel: 'f_{ck} = f_{cm} - 1{,}645 \\cdot \\sigma',
              erklaerung: 'Charakteristische Druckfestigkeit (5 %-Fraktil bei angenommener Gaußscher Normalverteilung): fcm = Mittelwert, σ = Standardabweichung, 1,645 = Quantilwert.',
              quelle: 'DIN EN 206:2021-06 / DIN EN 1990, Anhang D'
            },
            {
              formel: 'f_{cd} = \\alpha_{cc} \\cdot \\frac{f_{ck}}{\\gamma_c}',
              erklaerung: 'Bemessungswert der Druckfestigkeit nach Eurocode 2: αcc = Langzeitbeiwert (im Nationalen Anhang Deutschland meist 0,85), γc = 1,50 (Teilsicherheitsbeiwert).',
              quelle: 'DIN EN 1992-1-1, 3.1.6 mit NA'
            },
            {
              formel: 'f_{cm} \\ge f_{ck} + 4 \\quad \\text{und} \\quad f_{ci} \\ge f_{ck} - 4',
              erklaerung: 'Konformitätskriterien nach DIN EN 206:2021-06, Tabelle 14, für die Erstherstellung (Gruppen von n = 3 Ergebnissen, Werte in N/mm²).',
              quelle: 'DIN EN 206:2021-06 Tab. 14'
            },
            {
              formel: 'f_{cm} \\ge f_{ck} + 1{,}48 \\cdot \\sigma \\quad \\text{und} \\quad f_{ci} \\ge f_{ck} - 4',
              erklaerung: 'Konformitätskriterien nach DIN EN 206:2021-06, Tabelle 14, für die stetige Herstellung (n ≥ 15 Ergebnisse, Standardabweichung σ aus mindestens 35 Ergebnissen).',
              quelle: 'DIN EN 206:2021-06 Tab. 14'
            }
          ]}
        />
      </div>
    </div>
  );
}
