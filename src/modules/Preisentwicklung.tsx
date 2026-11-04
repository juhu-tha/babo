import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { TrendingUp, Euro, Calendar, Info, BarChart3 } from 'lucide-react';
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
  type TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import inhalt from '@/content/preisentwicklung/Preisentwicklung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ErgebnisAnsage } from '@/src/components/ui/ErgebnisAnsage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RAW_PRICE_DATA = {
  labels: ['1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Betonstahl',
      data: [45, 50, 55, 60, 58, 75, 90, 100, 105, 140, 175, 150],
      borderColor: 'rgb(220, 38, 38)', // torch-red
      backgroundColor: 'rgba(220, 38, 38, 0.5)',
      tension: 0.3,
    },
    {
      label: 'Zement',
      data: [40, 45, 50, 58, 65, 70, 85, 100, 110, 115, 140, 160],
      borderColor: 'rgb(107, 114, 128)', // gray
      backgroundColor: 'rgba(107, 114, 128, 0.5)',
      tension: 0.3,
    },
    {
      label: 'Bauholz',
      data: [50, 55, 60, 65, 70, 75, 85, 100, 115, 180, 160, 130],
      borderColor: 'rgb(16, 185, 129)', // emerald
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      tension: 0.3,
    },
    {
      label: inhalt.werte.dämmstoffeEps,
      data: [60, 65, 70, 75, 80, 85, 95, 100, 105, 120, 145, 135],
      borderColor: 'rgb(59, 130, 246)', // blue
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      tension: 0.3,
    },
    {
      label: 'Ziegel',
      data: [35, 40, 50, 60, 70, 80, 90, 100, 110, 115, 135, 145],
      borderColor: 'rgb(217, 119, 6)', // amber
      backgroundColor: 'rgba(217, 119, 6, 0.5)',
      tension: 0.3,
    },
    {
      label: 'Flachglas',
      data: [55, 60, 65, 70, 75, 80, 90, 100, 105, 110, 130, 140],
      borderColor: 'rgb(14, 165, 233)', // sky
      backgroundColor: 'rgba(14, 165, 233, 0.5)',
      tension: 0.3,
    },
    {
      label: inhalt.werte.kupferRohre,
      data: [30, 35, 45, 50, 60, 85, 110, 100, 120, 160, 150, 145],
      borderColor: 'rgb(245, 158, 11)', // amber-500
      backgroundColor: 'rgba(245, 158, 11, 0.5)',
      tension: 0.3,
    },
    {
      label: 'Aluminium',
      data: [40, 45, 55, 60, 65, 80, 95, 100, 105, 140, 165, 150],
      borderColor: 'rgb(148, 163, 184)', // slate-400
      backgroundColor: 'rgba(148, 163, 184, 0.5)',
      tension: 0.3,
    },
    {
      label: 'Bitumen',
      data: [25, 30, 35, 40, 55, 75, 95, 100, 90, 110, 155, 140],
      borderColor: 'rgb(31, 41, 55)', // gray-800
      backgroundColor: 'rgba(31, 41, 55, 0.5)',
      tension: 0.3,
    },
    {
      label: 'Sand & Kies',
      data: [45, 50, 55, 65, 70, 75, 85, 100, 115, 120, 130, 140],
      borderColor: 'rgb(234, 179, 8)', // yellow-500
      backgroundColor: 'rgba(234, 179, 8, 0.5)',
      tension: 0.3,
    },
    {
      label: inhalt.werte.baulöhneTarif,
      data: [30, 38, 45, 55, 62, 68, 75, 85, 100, 102, 106, 112],
      borderColor: 'rgb(139, 92, 246)', // violet
      backgroundColor: 'rgba(139, 92, 246, 0.5)',
      tension: 0.3,
      borderDash: [5, 5],
    }
  ]
};

const getChartOptions = (baseYear: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        boxWidth: 8,
      }
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        label: function(context: TooltipItem<'line'>) {
          return `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 1)} (Index)`;
        }
      }
    },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: `Preisindex (${baseYear} = 100)`
      },
      min: 0,
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false,
  },
});

export default function Preisentwicklung() {
    const [baseYear, setBaseYear] = useState<string>('2015');

  // Calculate normalized data based on selected base year
  const baseYearIndex = RAW_PRICE_DATA.labels.indexOf(baseYear);
  
  const normalizedData = {
    labels: RAW_PRICE_DATA.labels,
    datasets: RAW_PRICE_DATA.datasets.map(dataset => {
      const baseValue = dataset.data[baseYearIndex];
      return {
        ...dataset,
        data: dataset.data.map(val => (val / baseValue) * 100)
      };
    })
  };
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
            <TrendingUp size={24} />
          </div>
          <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.preisentwicklungBaustoffe} /></h2>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.diePreisentwicklungVonBaustoffen} /></p>
        </div>

        {/* Chart Section */}
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
              <BarChart3 size={20} className="text-shiraz" /> Erzeugerpreisindex
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2"><label htmlFor="baseYear" className="text-sm font-medium text-text-main">Basisjahr:</label><InfoTooltip text={inhalt.werte.referenzjahrFürDiePreisentwicklung} /></div>
              <select 
                id="baseYear"
                value={baseYear}
                onChange={(e) => setBaseYear(e.target.value)}
                className="p-2 border border-home-grau/30 rounded-lg text-sm focus:ring-2 focus:ring-shiraz focus:border-shiraz outline-none"
              >
                {RAW_PRICE_DATA.labels.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          
          <ErgebnisAnsage text={`Preisindex ${RAW_PRICE_DATA.labels[RAW_PRICE_DATA.labels.length - 1]} (Basisjahr ${baseYear} = 100): ${normalizedData.datasets.map(d => `${d.label} ${formatDeZahl(d.data[d.data.length - 1], 0)}`).join(', ')}`} />
          <div className="h-[400px] w-full">
            <Line data={normalizedData} options={getChartOptions(baseYear)} />
          </div>
          
          <div className="mt-4 text-xs text-text-main/60 flex items-start gap-2 bg-off-white p-3 rounded-lg">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p><MdText text={inhalt.texte.hinweisDieDargestelltenWerte} />{baseYear}<MdText text={inhalt.texte.realeBaupreiseKönnenRegional} /></p>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
            <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
              <Euro size={20} className="text-shiraz" /> Preistreiber
            </h3>
            <ul className="space-y-3 text-sm text-text-main/80">
              <li className="flex gap-2">
                <span className="text-torch-red font-bold">•</span>
                <span><MdText text={inhalt.texte.energiekostenBesondersEnergieintensiveBa} /></span>
              </li>
              <li className="flex gap-2">
                <span className="text-torch-red font-bold">•</span>
                <span><MdText text={inhalt.texte.globaleNachfrageEinBauboom} /></span>
              </li>
              <li className="flex gap-2">
                <span className="text-torch-red font-bold">•</span>
                <span><MdText text={inhalt.texte.lieferkettenStörungenInGlobalen} /></span>
              </li>
              <li className="flex gap-2">
                <span className="text-torch-red font-bold">•</span>
                <span><MdText text={inhalt.texte.coBepreisungZunehmendeKosten} /></span>
              </li>
              <li className="flex gap-2">
                <span className="text-torch-red font-bold">•</span>
                <span><MdText text={inhalt.texte.lohnkostenTariflicheAnpassungenUnd} /></span>
              </li>
            </ul>
          </div>

          <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
            <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-shiraz" /><MdText text={inhalt.texte.historischeEreignisse} /></h3>
            <div className="space-y-4 text-sm">
              <div className="border-l-2 border-shiraz pl-3">
                <h4 className="font-bold text-text-main"><MdText text={inhalt.texte.t20212022DieHolzkrise} /></h4>
                <p className="text-text-main/70 mt-1"><MdText text={inhalt.texte.extremePreisspitzenBeiBauholz} /></p>
              </div>
              <div className="border-l-2 border-shiraz pl-3">
                <h4 className="font-bold text-text-main"><MdText text={inhalt.texte.t2022Energiekrise} /></h4>
                <p className="text-text-main/70 mt-1"><MdText text={inhalt.texte.massiverAnstiegDerGas} /></p>
              </div>
              <div className="border-l-2 border-shiraz pl-3">
                <h4 className="font-bold text-text-main"><MdText text={inhalt.texte.langfristigerTrend} /></h4>
                <p className="text-text-main/70 mt-1"><MdText text={inhalt.texte.stetigerModeraterAnstiegDer} /></p>
              </div>
            </div>
          </div>
        </div>

              </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Baupreisindex', url: 'https://de.wikipedia.org/wiki/Baupreisindex' },
          { title: 'Preisindex', url: 'https://de.wikipedia.org/wiki/Preisindex' },
          { title: 'Inflation', url: 'https://de.wikipedia.org/wiki/Inflation' }
        ]}
        regelwerke={inhalt.daten["Preisentwicklung.regelwerke"]}
        literatur={inhalt.daten["Preisentwicklung.literatur"]}
        formeln={inhalt.daten["Preisentwicklung.formeln"]}
      />
    </div>
  );
}
