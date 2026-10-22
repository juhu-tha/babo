import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { AlertTriangle, CheckCircle2, Leaf, Droplets } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Recyclingbeton() {
  const [rcAnteil, setRcAnteil] = useState(25); // Vol.-%
  const [rcTyp, setRcTyp] = useState('Typ 1'); // Typ 1 (Betonsplitt), Typ 2 (Mauerwerksbruch)
  const [expositionsklasse, setExpositionsklasse] = useState('X0, XC1, XC2');
  const [wa24, setWa24] = useState(5.0); // Wasseraufnahme in M.-%

  const results = useMemo(() => {
    let eModulReduktion = 0;
    let wasseranspruchErhoehung = 0;
    let schwindenErhoehung = 0;
    let rohdichteReduktion = 0;
    let maxAnteil = 0;
    let isOk = true;
    let hinweis = '';

    // DAfStb-Richtlinie "Recycling-Beton" (vereinfachte Annahmen für Lehre)
    if (rcTyp === 'Typ 1') {
      // Typ 1: Betonsplitt (bessere Qualität)
      maxAnteil = expositionsklasse === 'X0, XC1, XC2' ? 45 : 35;
      eModulReduktion = rcAnteil * 0.25; // ca. 25% Reduktion bei 100% RC
      wasseranspruchErhoehung = rcAnteil * 0.15; // ca. 15% mehr Wasserbedarf
      schwindenErhoehung = rcAnteil * 0.30; // ca. 30% mehr Schwinden bei 100%
      rohdichteReduktion = rcAnteil * 0.06; // ca. 6% geringere Dichte bei 100%
    } else {
      // Typ 2: Bau- und Abbruchbruch (Mauerwerk etc., schlechtere Qualität)
      maxAnteil = expositionsklasse === 'X0, XC1, XC2' ? 35 : 25;
      eModulReduktion = rcAnteil * 0.40; // ca. 40% Reduktion bei 100% RC
      wasseranspruchErhoehung = rcAnteil * 0.30;
      schwindenErhoehung = rcAnteil * 0.50; // ca. 50% mehr Schwinden bei 100%
      rohdichteReduktion = rcAnteil * 0.12; // ca. 12% geringere Dichte bei 100%
    }

    if (rcAnteil > maxAnteil) {
      isOk = false;
      hinweis = `Der Anteil von ${formatDeWert(rcAnteil)}% überschreitet den nach DAfStb-Richtlinie (2010) zulässigen Maximalwert von ${formatDeWert(maxAnteil)}% für ${rcTyp} in den Expositionsklassen ${expositionsklasse}.`;
    } else {
      hinweis = `Der Anteil von ${formatDeWert(rcAnteil)}% liegt innerhalb der Grenzen der DAfStb-Richtlinie (max. ${formatDeWert(maxAnteil)}%; Übernahme in DIN 1045-2:2023-08 manuell prüfen).`;
    }

    // Wasseraufnahme (Kernfeuchte)
    const zusatzWasser = (rcAnteil / 100) * 1800 * (wa24 / 100); // grobe Schätzung: 1800 kg/m³ Gestein gesamt

    return { eModulReduktion, wasseranspruchErhoehung, schwindenErhoehung, rohdichteReduktion, isOk, hinweis, zusatzWasser, maxAnteil };
  }, [rcAnteil, rcTyp, wa24, expositionsklasse]);

  const chartData = useMemo(() => {
    const labels = [];
    const dataEModul = [];
    const dataWasser = [];
    const dataSchwinden = [];
    
    for (let i = 0; i <= 100; i += 10) {
      labels.push(i);
      if (rcTyp === 'Typ 1') {
        dataEModul.push(-(i * 0.25));
        dataWasser.push(i * 0.15);
        dataSchwinden.push(i * 0.30);
      } else {
        dataEModul.push(-(i * 0.40));
        dataWasser.push(i * 0.30);
        dataSchwinden.push(i * 0.50);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: 'E-Modul Reduktion (%)',
          data: dataEModul,
          borderColor: '#dc2626',
          backgroundColor: '#dc2626',
          tension: 0.1,
        },
        {
          label: 'Wasseranspruch Erhöhung (%)',
          data: dataWasser,
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          tension: 0.1,
        },
        {
          label: 'Schwinden & Kriechen Zunahme (%)',
          data: dataSchwinden,
          borderColor: '#eab308',
          backgroundColor: '#eab308',
          tension: 0.1,
        }
      ]
    };
  }, [rcTyp]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'RC-Anteil (Vol.-%)' }
      },
      y: {
        title: { display: true, text: 'Veränderung (%)' }
      }
    },
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: results.maxAnteil,
            xMax: results.maxAnteil,
            borderColor: 'rgba(255, 99, 132, 0.5)',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: 'Max. Anteil',
              display: true,
              position: 'start'
            }
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Leaf className="text-shiraz" /> Recyclingbeton (RC-Beton)
        </h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Recyclingbeton (R-Beton) nutzt gebrochenen Bauschutt (Betonsplitt oder Mauerwerksbruch) als Gesteinskörnung. Dies schont natürliche Ressourcen. RC-Körnungen haben jedoch eine höhere Porosität (alter Zementstein haftet an). Dies führt zu einer höheren Wasseraufnahme (<FormulaText text="WA_{24}" />), einem höheren Wasseranspruch im Frischbeton und einem reduzierten E-Modul im Festbeton. Die DAfStb-Richtlinie begrenzt daher die maximalen Austauschraten.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Eingabeparameter</h3>
              
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Art der RC-Körnung</label><InfoTooltip text="Herkunft der rezyklierten Gesteinskörnung (z.B. Betonbrechsand)." /></div>
                <select aria-label="Art der RC-Körnung" 
                  className="p-2 border border-home-grau/40 rounded-xl bg-white text-sm"
                  value={rcTyp}
                  onChange={(e) => setRcTyp(e.target.value)}
                >
                  <option value="Typ 1">Typ 1 (Betonsplitt, ≥ 90% Beton)</option>
                  <option value="Typ 2">Typ 2 (Bau- und Abbruchbruch, mit Mauerwerk)</option>
                </select>
                <p className="text-xs text-home-grau mt-1">
                  Typ 1 hat bessere mechanische Eigenschaften und geringere Wasseraufnahme als Typ 2.
                </p>
              </div>

              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Expositionsklassen (maßgebend)</label><InfoTooltip text="Je nach Umgebungsbedingungen sind unterschiedliche maximale Austauschraten erlaubt." /></div>
                <select aria-label="Expositionsklassen (maßgebend)" 
                  className="p-2 border border-home-grau/40 rounded-xl bg-white text-sm"
                  value={expositionsklasse}
                  onChange={(e) => setExpositionsklasse(e.target.value)}
                >
                  <option value="X0, XC1, XC2">X0, XC1, XC2 (z.B. Innenbauteile, Gründungen)</option>
                  <option value="XC3, XC4, XF1, XA1">XC3, XC4, XF1, XA1 (z.B. Außenbauteile)</option>
                </select>
              </div>

              <Slider label="Austauschrate (RC-Anteil)" info="Anteil der rezyklierten Körnung an der gesamten groben Gesteinskörnung (d > 2mm)." min={0} max={100} step={5} value={rcAnteil} unit="Vol.-%" onChange={(e) => setRcAnteil(Number(e.target.value))} />
              
              <div className="mt-4">
                <Slider  label={<FormulaText text="Wasseraufnahme WA_{24}" />} info="Wasseraufnahme der RC-Körnung nach 24h. Wichtig für die Kernfeuchte-Kompensation." min={1.0} max={15.0} step={0.5} value={wa24} unit="M.-%" onChange={(e) => setWa24(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className={`p-6 rounded-xl shadow-md text-white ${results.isOk ? 'bg-shiraz' : 'bg-red-600'}`}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Auswirkungen & Bewertung</h3>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                <div>
                  <div className="text-white/70 text-sm mb-1">E-Modul Reduktion</div>
                  <div className="text-2xl font-bold">-{formatDeZahl(results.eModulReduktion, 1)} %</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm mb-1">Wasseranspruch Erhöhung</div>
                  <div className="text-2xl font-bold">+{formatDeZahl(results.wasseranspruchErhoehung, 1)} %</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm mb-1 flex items-center gap-1">Schwinden/Kriechen <InfoTooltip text="Zunahme des Schwind- und Kriechmaßes gegenüber Normalbeton" /></div>
                  <div className="text-2xl font-bold">+{formatDeZahl(results.schwindenErhoehung, 1)} %</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm mb-1 flex items-center gap-1">Trockenrohdichte Red. <InfoTooltip text="Abnahme der Dichte des Festbetons" /></div>
                  <div className="text-2xl font-bold">-{formatDeZahl(results.rohdichteReduktion, 1)} %</div>
                </div>
                <div className="col-span-2 mt-2">
                  <div className="text-white/70 text-sm mb-1 flex items-center gap-1">
                    <Droplets size={16} /> Kernfeuchte-Kompensation (Schätzung)
                    <InfoTooltip text="Zusätzliches Wasser, das die RC-Körnung aufsaugt und das beim Mischen zugegeben werden muss (Vorsättigung)." />
                  </div>
                  <div className="text-xl font-bold">ca. {formatDeZahl(results.zusatzWasser, 0)} Liter/m³</div>
                </div>
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="text-sm font-bold mb-1 flex items-center gap-2">
                  {results.isOk ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />} 
                  Normative Bewertung
                </div>
                <div className="text-sm leading-relaxed">
                  {results.hinweis}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Einfluss des RC-Anteils</h3>
              <div className="h-[250px] w-full">
                <Line data={chartData} options={chartOptions as any} />
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: RC-Körnung (Typ 1 vs. Typ 2)</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="160" viewBox="0 0 450 160">
                  {/* Typ 1 (Betonsplitt) */}
                  <g transform="translate(100, 80)">
                    <text x="0" y="-60" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Typ 1 (Betonsplitt)</text>
                    
                    {/* Korn 1 */}
                    <path d="M -30 -20 L -10 -40 L 20 -30 L 40 -10 L 30 20 L 0 40 L -20 30 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                    {/* Alter Mörtel anhaftend */}
                    <path d="M -30 -20 L -10 -40 L 0 -20 L -10 0 Z" fill="#94a3b8" />
                    <path d="M 30 20 L 40 -10 L 20 0 Z" fill="#94a3b8" />
                    
                    {/* Poren im alten Mörtel */}
                    <circle cx="-15" cy="-20" r="1.5" fill="#fff" />
                    <circle cx="-5" cy="-10" r="1" fill="#fff" />
                    <circle cx="25" cy="5" r="1.5" fill="#fff" />
                    
                    <text x="0" y="60" fontSize="10" fill="#1e293b" textAnchor="middle">&ge; 90% Beton</text>
                  </g>

                  {/* Typ 2 (Bau/Abbruch) */}
                  <g transform="translate(320, 80)">
                    <text x="0" y="-60" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Typ 2 (Bauschutt)</text>
                    
                    {/* Korn 1 (Beton) */}
                    <path d="M -40 -10 L -20 -30 L 0 -20 L -10 10 L -30 20 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                    
                    {/* Korn 2 (Ziegel/Mauerwerk) */}
                    <path d="M 10 -40 L 40 -30 L 50 0 L 20 10 Z" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
                    <circle cx="25" cy="-20" r="1.5" fill="#fff" />
                    <circle cx="35" cy="-10" r="2" fill="#fff" />
                    <circle cx="20" cy="-5" r="1" fill="#fff" />
                    
                    {/* Korn 3 (Kalksandstein) */}
                    <path d="M -10 20 L 20 10 L 40 30 L 10 40 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                    
                    <text x="0" y="60" fontSize="10" fill="#1e293b" textAnchor="middle">Beton + Mauerwerk (porös)</text>
                  </g>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  RC-Körnungen bestehen aus Gesteinskörnern mit anhaftendem Altmörtel (Typ 1) oder zusätzlich aus porösem Mauerwerksbruch (Typ 2). Der Altmörtel und insbesondere Ziegelbruch erhöhen die Porosität und damit die Wasseraufnahme im Vergleich zu natürlichem Gestein erheblich.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
            
      <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
        <h3 className="font-semibold text-text-main mb-3">Typische Mischungszusammensetzung (pro m³)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[300px]">
            <thead>
              <tr className="border-b-2 border-home-grau/30 bg-home-grau/5">
                <th className="py-2 px-3 text-sm font-semibold text-text-main">Komponente</th>
                <th className="py-2 px-3 text-sm font-semibold text-text-main text-right">Menge</th>
              </tr>
            </thead>
            <tbody>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-home-grau/5 transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zement (z.B. CEM II)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 320 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-home-grau/5 transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Wasser (effektiver w/z-Wert ~0,50)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 160 kg (+ Wasser für Kernfeuchte)</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-home-grau/5 transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Natürliche Gesteinskörnung</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1100 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-home-grau/5 transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Rezyklierte Gesteinskörnung (z.B. Typ 1)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 700 kg</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
