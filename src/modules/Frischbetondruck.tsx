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
  Filler,
  type TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Slider } from '@/src/components/ui/Slider';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import inhalt from '@/content/frischbetondruck/Frischbetondruck.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

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
          label: inhalt.werte.frischbetondruckLimitiertKnM,
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
          label: inhalt.werte.hydrostatischerDruckWorstCase,
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
          text: inhalt.werte.wandhöheTiefeM,
          font: { family: 'Work Sans', weight: 'bold' as const }
        }
      },
      x: {
        min: 0,
        max: Math.max(100, Math.ceil(gamma * H * 1.1)),
        title: {
          display: true,
          text: inhalt.werte.schalungsdruckHkKnM,
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
          label: (context: TooltipItem<'line'>) => `${context.dataset.label}: ${formatDeZahl(context.raw as number, 1)} kN/m² bei Tiefe ${formatDeZahl(context.label, 2)} m`
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.parameterDin18218} /></h2>
      

        
        <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
          <p><MdText text={inhalt.texte.alsFrischbetondruckOderSchalungsdruck} /></p>
          <ul className="list-disc pl-5 space-y-1">
            <li><MdText text={inhalt.texte.einflussgrößenWichteKonsistenzUnd} /></li>
            <li><MdText text={inhalt.texte.druckverlaufImBereichDes} />) wird der Anstieg begrenzt, wodurch sich ein von der Höhe unabhängiger Absolutwert (&#475569;<MdText text={inhalt.texte.subHkMaxSub} /></li>
          </ul>
        </div>

        <Slider
          label={inhalt.werte.steiggeschwindigkeitV}
          min={0.1} max={10.0} step={0.1}
          value={v} unit="m/h"
          info={inhalt.werte.geschwindigkeitMitDerDie}
          onChange={(e) => setV(Number(e.target.value))}
        />
        
        <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-4">
          <h3 className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.erstarrenTemperaturAbs5} /></h3>
          <Slider
            label={inhalt.werte.basisErstarrungszeitBei15}
            min={1} max={20} step={0.5}
            value={tE_ref} unit="h"
            info={inhalt.werte.dieAmReferenzbetonErmittelte}
            onChange={(e) => setTERef(Number(e.target.value))}
          />

          <Slider
            label={inhalt.werte.frischbetontemperaturTC}
            min={5} max={35} step={1}
            value={T_c} unit="°C"
            info={inhalt.werte.temperaturDesFrischbetonsEine}
            onChange={(e) => setTc(Number(e.target.value))}
          />
          
          <div className="text-xs text-text-main/70 bg-white p-3 rounded-lg border border-home-grau/30 flex flex-col gap-1">
            <span className="font-medium text-text-main"><MdText text={inhalt.texte.effektiveErstarrungszeitTSub} /><strong>{formatDeZahl(tE_eff, 1)} h</strong></span>
            <span><MdText text={inhalt.texte.berücksichtigtDenTemperatureinflussNach} /></span>
            <span className="font-medium text-text-main mt-1">Beiwert K<sub>1</sub>: <strong>{formatDeZahl(K1, 3)}</strong></span>
            <span className="text-[11px] text-text-main/60"><MdText text={inhalt.texte.näherungKSub1} /></span>
          </div>
        </div>

        <Slider
          label={inhalt.werte.frischbetonrohdichte}
          min={20} max={30} step={0.5}
          value={gamma} unit="kN/m³"
          info={inhalt.werte.wichteDesFrischbetonsNormalbeton}
          onChange={(e) => setGamma(Number(e.target.value))}
        />

        <Slider
          label={inhalt.werte.absoluteSchalungshöheH}
          min={1} max={20} step={0.5}
          value={H} unit="m"
          info={inhalt.werte.gesamthöheDerZuBetonierenden}
          onChange={(e) => setH(Number(e.target.value))}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Konsistenzklasse</label><InfoTooltip text={inhalt.werte.maßFürDieVerarbeitbarkeit} /></div>
            <InfoTooltip text={inhalt.werte.beschreibtDieFließfähigkeitDes} />
          </div>
          <select aria-label="Konsistenzklasse" 
            className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
            value={klasse}
            onChange={(e) => setKlasse(e.target.value)}
          >
            <option value="F1">F1 (steif)</option>
            <option value="F2">F2 (plastisch)</option>
            <option value="F3">F3 (weicher Beton)</option>
            <option value="F4">F4 (sehr weich)</option>
            <option value="F5">F5 (fließfähig)</option>
            <option value="SVB">SVB (voller hydrostatischer Druck; F6 nicht gesondert abgebildet)</option>
          </select>
        </div>

        <div className="mt-4 p-4 bg-off-white rounded-xl border border-home-grau/50">
          <h3 className="text-sm font-bold text-text-main mb-3">Schalungssystem-Vorschlag</h3>
          <div className="text-sm text-text-main/80 space-y-2">
            <div className="flex justify-between items-center">
              <span><MdText text={inhalt.texte.maxSchalungsdruck} /></span>
              <span className="font-bold text-shiraz">{formatDeZahl(maxP, 1)} kN/m²</span>
            </div>
            <ErgebnisAnsage text={kurzzeile(ansageWert('maximaler Schalungsdruck', maxP, 1, 'kN/m²'), ansageWert('erreicht in Tiefe', hs, 2, 'm'))} />
            <div className="p-3 bg-white border border-home-grau/30 rounded mt-2">
              {maxP <= 40 && (
                <p><MdText text={inhalt.texte.leichteRahmenschalungBrAusreichend} /></p>
              )}
              {maxP > 40 && maxP <= 60 && (
                <p><MdText text={inhalt.texte.standardRahmenschalungBrGeeignet} /></p>
              )}
              {maxP > 60 && maxP <= 80 && (
                <p><MdText text={inhalt.texte.schwereRahmenTrägerschalungBr} /></p>
              )}
              {maxP > 80 && (
                <p><MdText text={inhalt.texte.sonderschalungHochleistungsschalungBrFür} /></p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[500px]">
          <h2 className="text-xl font-bold text-text-main mb-2"><MdText text={inhalt.texte.druckverteilungAufLotrechteSchalung} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.derHydrostatischeDruckSteigt} /></p>
        </div>
          
          <div className="flex-1 relative w-full h-full">
            <Line data={chartData} options={options} />
          </div>
        </div>

        {/* Schematische Darstellung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDruckverteilung} /></h3>
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
    
  </div>
  );
}
