import type { TooltipItem } from 'chart.js';
import { useState, useMemo } from 'react';
import { formatDeZahl } from '@/src/utils/numberFormat';
import { Slider } from '@/src/components/ui/Slider';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Line } from 'react-chartjs-2';
import inhalt from '@/content/mischungsberechnung/WalzKurvenSection.json';
import { MdText } from '@/src/components/inhalt/MdText';

export function WalzKurvenSection() {
  const [wzWert, setWzWert] = useState(0.50);
  const [zementKlasse, setZementKlasse] = useState(42.5);

  const chartData = useMemo(() => {
    const wzValues = [];
    for (let i = 0.35; i <= 0.8; i += 0.05) {
      wzValues.push(i);
    }

    const calcStrength = (wz: number, klasse: number) => {
      let A = 100;
      if (klasse === 42.5) A = 120;
      if (klasse === 52.5) A = 140;
      return A / Math.pow(5, wz);
    };

    return {
      labels: wzValues.map(v => formatDeZahl(v, 2)),
      datasets: [
        {
          label: 'CEM 32,5',
          data: wzValues.map(wz => calcStrength(wz, 32.5)),
          borderColor: zementKlasse === 32.5 ? '#A3113E' : '#cbd5e1',
          borderWidth: zementKlasse === 32.5 ? 3 : 2,
          borderDash: zementKlasse === 32.5 ? [] : [5, 5],
          tension: 0.4,
          pointRadius: zementKlasse === 32.5 ? 4 : 0,
        },
        {
          label: 'CEM 42,5',
          data: wzValues.map(wz => calcStrength(wz, 42.5)),
          borderColor: zementKlasse === 42.5 ? '#A3113E' : '#cbd5e1',
          borderWidth: zementKlasse === 42.5 ? 3 : 2,
          borderDash: zementKlasse === 42.5 ? [] : [5, 5],
          tension: 0.4,
          pointRadius: zementKlasse === 42.5 ? 4 : 0,
        },
        {
          label: 'CEM 52,5',
          data: wzValues.map(wz => calcStrength(wz, 52.5)),
          borderColor: zementKlasse === 52.5 ? '#A3113E' : '#cbd5e1',
          borderWidth: zementKlasse === 52.5 ? 3 : 2,
          borderDash: zementKlasse === 52.5 ? [] : [5, 5],
          tension: 0.4,
          pointRadius: zementKlasse === 52.5 ? 4 : 0,
        }
      ]
    };
  }, [zementKlasse]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: inhalt.werte.mittlereWürfeldruckfestigkeit28D,
          font: { family: 'Work Sans', weight: 'bold' as const }
        },
        min: 10,
        max: 90,
      },
      x: {
        title: {
          display: true,
          text: inhalt.werte.wasserzementwertWZ,
          font: { family: 'Work Sans', weight: 'bold' as const }
        }
      }
    },
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 1)} N/mm²`
        }
      }
    }
  };

  const currentStrength = useMemo(() => {
    let A = 100;
    if (zementKlasse === 42.5) A = 120;
    if (zementKlasse === 52.5) A = 140;
    return A / Math.pow(5, wzWert);
  }, [wzWert, zementKlasse]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
      <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main">Walz-Kurven</h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieWalzKurvenBeschreiben} /></p>
        </div>

        <Slider
          label={inhalt.werte.wasserzementwertWZ2}
          min={0.35} max={0.80} step={0.01}
          value={wzWert} unit=""
          info={inhalt.werte.massenverhältnisVonWirksamemWasser}
          onChange={(e) => setWzWert(Number(e.target.value))}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2"><label htmlFor="walzkurve-festigkeit" className="text-sm font-medium text-text-main">Zementfestigkeitsklasse</label><InfoTooltip text={inhalt.werte.normfestigkeitDesZementsNach} /></div>
            <InfoTooltip text={inhalt.werte.normdruckfestigkeitDesZementsNach} />
          </div>
          <select 
            id="walzkurve-festigkeit"
            aria-label="Zementfestigkeitsklasse"
            className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
            value={zementKlasse}
            onChange={(e) => setZementKlasse(Number(e.target.value))}
          >
            <option value={32.5}>CEM 32.5</option>
            <option value={42.5}>CEM 42.5</option>
            <option value={52.5}>CEM 52.5</option>
          </select>
        </div>

        <div className="mt-4 p-4 bg-off-white rounded-xl border border-shiraz/20">
          <h3 className="text-sm font-bold text-shiraz mb-2"><MdText text={inhalt.texte.erwarteteMittlereDruckfestigkeit} /></h3>
          <div className="text-3xl font-bold text-shiraz">{formatDeZahl(currentStrength, 1)} <span className="text-lg font-normal">MPa</span></div>
          <div className="text-sm text-shiraz/80 mt-1"><FormulaText text={inhalt.werte.fCmBei28} /></div>
        </div>
      </div>

      <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[500px]">
        <h2 className="text-xl font-bold text-text-main mb-2"><MdText text={inhalt.texte.abhängigkeitDerFestigkeitVom} /></h2>
        <p className="text-xs text-text-main/60 mb-2"><MdText text={inhalt.texte.näherungNachDemAbrams} /></p>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            <FormulaText text={inhalt.werte.darstellungNachDemGesetz} />
          </p>
        </div>
        
        <div className="flex-1 relative w-full h-full">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}
