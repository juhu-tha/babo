import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
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
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';

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

export default function Frischbetondruck() {
  const [v, setV] = useState(2.0);
  const [tE_ref, setTERef] = useState(5.0); // tE bei 15°C
  const [T_c, setTc] = useState(15.0); // Frischbetontemperatur
  const [H, setH] = useState(6.0); // Absolute Schalungshöhe
  const [klasse, setKlasse] = useState('F3');
  const [gamma, setGamma] = useState(25.0); // Frischbetonrohdichte

  // Temperatureinfluss nach Abs. 5.3 der DIN 18218
  const tE_eff = tE_ref * Math.pow(2, (15 - T_c) / 10);

  // Erstarren-Beiwert K1 in Abhängigkeit von der maßgebenden Erstarrungszeit (als lineare Näherung der Tabellenwerte)
  const K1 = 1 + 0.077 * (tE_eff - 5);
  
  let sigma_hk_max = gamma;
  
  if (klasse === 'SVB') {
    // Voller hydrostatischer Druck für SVB über die gesamte Höhe (vereinfacht nach DIN 18218 für SCC ohne Fließgrenze)
    sigma_hk_max = gamma * H; 
  } else {
    switch (klasse) {
      case 'F1': sigma_hk_max = Math.max(gamma, (5 * v + 21) * K1 * (gamma/25)); break;
      case 'F2': sigma_hk_max = Math.max(gamma, (10 * v + 19) * K1 * (gamma/25)); break;
      case 'F3': sigma_hk_max = Math.max(gamma, (14 * v + 18) * K1 * (gamma/25)); break;
      case 'F4': sigma_hk_max = Math.max(gamma, (17 * v + 17) * K1 * (gamma/25)); break;
      case 'F5': sigma_hk_max = Math.max(30 * (gamma/25), (25 + 34 * v * K1) * (gamma/25)); break;
    }
  }

  const maxP = Math.min(sigma_hk_max, gamma * H);
  const hs = maxP / gamma; // Depth where max pressure is reached

  const chartData = useMemo(() => {
    return {
      labels: [0, hs, H], // Y-axis values (depth)
      datasets: [
        {
          label: 'Frischbetondruck limitiert (kN/m²)',
          data: [0, maxP, maxP], // X-axis values (pressure)
          borderColor: '#A3113E', // Shiraz
          backgroundColor: 'rgba(163, 17, 62, 0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0,
          pointRadius: 5,
          pointBackgroundColor: '#A3113E',
        },
        {
          label: 'Hydrostatischer Druck (Worst-Case)',
          data: [0, maxP, gamma * H], // X-axis values
          borderColor: '#94a3b8',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0,
          pointRadius: 0,
        }
      ]
    };
  }, [maxP, gamma, H, hs]);

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear' as const,
        reverse: true, // Invert Y axis so 0 is at top
        min: 0,
        max: Math.max(6, Math.ceil(H + 1)),
        title: {
          display: true,
          text: 'Wandhöhe / Tiefe (m)',
          font: { family: 'Work Sans', weight: 'bold' as const }
        }
      },
      x: {
        min: 0,
        max: Math.max(100, Math.ceil(gamma * H * 1.1)),
        title: {
          display: true,
          text: 'Schalungsdruck σ_hk (kN/m²)',
          font: { family: 'Work Sans', weight: 'bold' as const }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${formatDeZahl(context.raw, 1)} kN/m² bei Tiefe ${formatDeZahl(context.label, 2)} m`
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">Parameter (DIN 18218)</h2>
      

        
        <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
          <p>
            Als <strong>Frischbetondruck</strong> (oder Schalungsdruck) wird die Lastkomponente des Frischbetons bezeichnet, die senkrecht auf die Betonschalung einwirkt (nach DIN 18218:2010-01). Durch Reibung können zusätzlich Schubspannungen auftreten.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Einflussgrößen:</strong> Wichte, Konsistenz und Erstarrungsverhalten (welches durch Zementart, Zusatzmittel und Temperatur gesteuert wird). Zudem beeinflussen Steiggeschwindigkeit, Rüttelintensität, Schalhaut, Bewehrung und Schalungsneigung den Druck.</li>
            <li><strong>Druckverlauf:</strong> Im Bereich des Rüttlers verhält sich der Frischbeton quasi-hydrostatisch. Mit zunehmender Höhe steigt der Druck an. Durch das fortschreitende Ansteifen (Hydratation) und die Reibung zwischen Beton und Schalung bzw. Bewehrung (<em>Siloeffekt</em>) wird der Anstieg begrenzt, wodurch sich ein von der Höhe unabhängiger Absolutwert (&#475569;<sub>hk,max</sub>) ausbildet.</li>
          </ul>
        </div>

        <Slider
          label="Steiggeschwindigkeit (v)"
          min={0.1} max={10.0} step={0.1}
          value={v} unit="m/h"
          info="Geschwindigkeit, mit der die Schalung mit Beton gefüllt wird. Üblich: 1 - 5 m/h. Höhere Geschwindigkeiten führen zu höherem Druck."
          onChange={(e) => setV(Number(e.target.value))}
        />
        
        <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-4">
          <h3 className="text-sm font-bold text-text-main">Erstarren & Temperatur (Abs. 5.3)</h3>
          <Slider
            label="Basis-Erstarrungszeit bei 15 °C (t_E,ref)"
            min={1} max={20} step={0.5}
            value={tE_ref} unit="h"
            info="Die am Referenzbeton ermittelte Erstarrungszeit bei 15 °C. Normativer Standard: 5 h."
            onChange={(e) => setTERef(Number(e.target.value))}
          />

          <Slider
            label="Frischbetontemperatur (T_c)"
            min={5} max={35} step={1}
            value={T_c} unit="°C"
            info="Temperatur des Frischbetons. Eine geringere Temperatur verzögert das Erstarren erheblich und erhöht somit den Schalungsdruck."
            onChange={(e) => setTc(Number(e.target.value))}
          />
          
          <div className="text-xs text-text-main/70 bg-white p-3 rounded-lg border border-home-grau/30 flex flex-col gap-1">
            <span className="font-medium text-text-main">Effektive Erstarrungszeit t<sub>E</sub>: <strong>{formatDeZahl(tE_eff, 1)} h</strong></span>
            <span>Berücksichtigt den Temperatureinfluss nach Abs. 5.3 der DIN 18218.</span>
            <span className="font-medium text-text-main mt-1">Beiwert K<sub>1</sub>: <strong>{formatDeZahl(K1, 3)}</strong></span>
          </div>
        </div>

        <Slider
          label="Frischbetonrohdichte (γ)"
          min={20} max={30} step={0.5}
          value={gamma} unit="kN/m³"
          info="Wichte des Frischbetons. Normalbeton liegt bei ca. 25 kN/m³."
          onChange={(e) => setGamma(Number(e.target.value))}
        />

        <Slider
          label="Absolute Schalungshöhe (H)"
          min={1} max={20} step={0.5}
          value={H} unit="m"
          info="Gesamthöhe der zu betonierenden Schalung. Begrenzt den maximal möglichen hydrostatischen Druck."
          onChange={(e) => setH(Number(e.target.value))}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Konsistenzklasse</label><InfoTooltip text="Maß für die Verarbeitbarkeit des Frischbetons." /></div>
            <InfoTooltip text="Beschreibt die Fließfähigkeit des Frischbetons. F1 ist steif, F5/F6/SVB ist sehr fließfähig (selbstverdichtend) und erzeugt den höchsten Druck." />
          </div>
          <select 
            className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
            value={klasse}
            onChange={(e) => setKlasse(e.target.value)}
          >
            <option value="F1">F1 (steif)</option>
            <option value="F2">F2 (plastisch)</option>
            <option value="F3">F3 (weicher Beton)</option>
            <option value="F4">F4 (sehr weich)</option>
            <option value="F5">F5 (fließfähig)</option>
            <option value="SVB">F6 / SVB (selbstverdichtend)</option>
          </select>
        </div>

        <div className="mt-4 p-4 bg-off-white rounded-xl border border-home-grau/50">
          <h3 className="text-sm font-bold text-text-main mb-3">Schalungssystem-Vorschlag</h3>
          <div className="text-sm text-text-main/80 space-y-2">
            <div className="flex justify-between items-center">
              <span>Max. Schalungsdruck:</span>
              <span className="font-bold text-shiraz">{formatDeZahl(maxP, 1)} kN/m²</span>
            </div>
            <div className="p-3 bg-white border border-home-grau/30 rounded mt-2">
              {maxP <= 40 && (
                <p><strong>Leichte Rahmenschalung</strong><br/>Ausreichend für geringe Drücke (z.B. Doka Frami, Peri Domino). Ideal für kleinere Bauteile und Fundamente.</p>
              )}
              {maxP > 40 && maxP <= 60 && (
                <p><strong>Standard Rahmenschalung</strong><br/>Geeignet für mittlere Drücke (z.B. Doka Framax, Peri Trio). Der Standard im Hochbau für Wände.</p>
              )}
              {maxP > 60 && maxP <= 80 && (
                <p><strong>Schwere Rahmen- / Trägerschalung</strong><br/>Erforderlich für hohe Drücke (z.B. Peri Maximo, Doka Top 50). Für schnelle Betonage oder hohe Wände.</p>
              )}
              {maxP > 80 && (
                <p><strong>Sonderschalung / Hochleistungsschalung</strong><br/>Für sehr hohe Drücke (z.B. Doka FF20, Peri VARIO GT 24). Oft bei selbstverdichtendem Beton (SVB) oder massiven Bauteilen nötig.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[500px]">
          <h2 className="text-xl font-bold text-text-main mb-2">Druckverteilung auf lotrechte Schalung</h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der hydrostatische Druck steigt bis zum Erstarren an und bleibt danach konstant.
          </p>
        </div>
          
          <div className="flex-1 relative w-full h-full">
            <Line data={chartData} options={options} />
          </div>
        </div>

        {/* Schematische Darstellung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="font-semibold mb-4 text-text-main">Schematische Druckverteilung</h3>
          <div className="relative w-full h-48 bg-off-white rounded-lg border border-home-grau/30 overflow-hidden flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
              {/* Schalung links */}
              <rect x="100" y="20" width="10" height="160" fill="#94a3b8" />
              {/* Schalung rechts */}
              <rect x="190" y="20" width="10" height="160" fill="#94a3b8" />
              {/* Beton */}
              <rect x="110" y="40" width="80" height="140" fill="#cbd5e1" />
              <path d="M 110 40 Q 150 45 190 40" fill="#94a3b8" />
              
              {/* Druckverteilung (Hydrostatisch + Konstant) */}
              <path d="M 210 40 L 280 120 L 280 180 L 210 180 Z" fill="rgba(239, 68, 68, 0.2)" stroke="#A3113E" strokeWidth="2" />
              
              {/* Pfeile */}
              <path d="M 210 60 L 225 60" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
              <path d="M 210 80 L 245 80" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
              <path d="M 210 100 L 260 100" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
              <path d="M 210 120 L 280 120" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
              <path d="M 210 150 L 280 150" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
              <path d="M 210 180 L 280 180" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />

              {/* Beschriftung */}
              <text x="150" y="110" fontSize="12" fill="#334155" textAnchor="middle" transform="rotate(-90 150,110)">Beton</text>
              <text x="300" y="80" fontSize="12" fill="#A3113E">Hydrostatisch</text>
              <text x="300" y="150" fontSize="12" fill="#A3113E">Konstant (max P)</text>

              <defs>
                <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <ModuleFooter 
      weblinks={[
        { title: "Beton.wiki: Frischbetondruck", url: "https://beton.wiki/index.php?title=Frischbetondruck" }, 
        { title: "Zement-Merkblätter Beton.org", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }
      ]} 
      wikipedia={[
        { title: 'Frischbetondruck', url: 'https://de.wikipedia.org/wiki/Frischbetondruck' }
      ]}
      regelwerke={[
        { title: 'DIN 18218:2010-01 (Frischbetondruck auf lotrechte Schalungen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+18218' },
        { title: 'DIN 18216 (Schalungsanker für Betonschalungen - Anforderungen, Prüfung, Verwendung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+18216' },
        { title: 'DIN EN 206 / DIN 1045-2 (Konsistenzklassen und Frischbetoneigenschaften)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+206' }
      ]}
      literatur={[
        'Graubner, C.-A.; Proske, T. (2010): Frischbetondruck auf lotrechte Schalungen. Beton- und Stahlbetonbau 105(1), S. 12-23',
        'Proske, T.; Graubner, C.-A. (2008): Formwork pressure of highly workable concrete (Darmstadt Concrete, Vol. 23)',
        'Schmitt, A. (2001): Schalungstechnik - Systeme, Einsatz und Bemessung (Ernst & Sohn)'
      ]}
      formeln={[
        {
          formel: '\\sigma_{hk,max} = (C_1 \\cdot v + C_2) \\cdot K_1 \\cdot \\frac{\\gamma_c}{25}',
          erklaerung: 'Bemessungsgleichung für den maximalen horizontalen Frischbetondruck σ_hk,max nach DIN 18218 (Abschnitt 5) unter Berücksichtigung von Steiggeschwindigkeit v, Konsistenzbeiwerten (C1, C2) und Erstarrungsbeiwert K1.',
          quelle: 'DIN 18218:2010-01'
        },
        {
          formel: 't_E(T_c) = t_{E,ref} \\cdot 2^{\\frac{15 - T_c}{10}}',
          erklaerung: 'Effektive Erstarrungszeit nach DIN 18218 Abs. 5.3 in Abhängigkeit von der Betontemperatur Tc (Referenzwert tE,ref bei 15 °C).',
          quelle: 'DIN 18218:2010-01'
        },
        {
          formel: 'h_s = \\frac{\\sigma_{hk,max}}{\\gamma_c}',
          erklaerung: 'Hydrostatische Übergangstiefe hs: Unterhalb dieser Tiefe stagniert der Druck infolge einsetzenden Thixotropie- und Erstarrungsaufbaus.',
          quelle: 'DIN 18218:2010-01'
        },
        {
          formel: '\\sigma_{hk}(z) = \\min\\left( \\gamma_c \\cdot z;\\; \\sigma_{hk,max} \\right)',
          erklaerung: 'Bilateraler Druckverlauf über die Schalungshöhe z von oben nach unten (anfangs hydrostatisch linear ansteigend, dann gedeckelt auf σ_hk,max).',
          quelle: 'DIN 18218:2010-01'
        }
      ]}
    />
  </div>
  );
}
