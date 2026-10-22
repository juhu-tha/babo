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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';

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
      label: 'Dämmstoffe (EPS)',
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
      label: 'Kupfer (Rohre)',
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
      label: 'Baulöhne (Tarif)',
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
        label: function(context: any) {
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
          <h2 className="text-xl font-bold text-text-main">Preisentwicklung Baustoffe</h2>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Preisentwicklung von Baustoffen unterliegt starken Schwankungen, die durch globale Krisen, Energiekosten, Rohstoffknappheit und Lieferkettenprobleme beeinflusst werden. 
            Die folgende Grafik zeigt die exemplarische Entwicklung der Erzeugerpreise für ausgewählte Baustoffe seit 1980.
          </p>
        </div>

        {/* Chart Section */}
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
              <BarChart3 size={20} className="text-shiraz" /> Erzeugerpreisindex
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2"><label htmlFor="baseYear" className="text-sm font-medium text-text-main">Basisjahr:</label><InfoTooltip text="Referenzjahr für die Preisentwicklung." /></div>
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
          
          <div className="h-[400px] w-full">
            <Line data={normalizedData} options={getChartOptions(baseYear)} />
          </div>
          
          <div className="mt-4 text-xs text-text-main/60 flex items-start gap-2 bg-off-white p-3 rounded-lg">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>
              <strong>Hinweis:</strong> Die dargestellten Werte sind exemplarische Indexwerte zur Veranschaulichung der Trends. 
              Ein Wert von 100 entspricht dem durchschnittlichen Preisniveau im Basisjahr {baseYear}. 
              Reale Baupreise können regional und projektspezifisch abweichen.
            </p>
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
                <span><strong>Energiekosten:</strong> Besonders energieintensive Baustoffe wie Zement, Ziegel und Stahl reagieren stark auf schwankende Strom- und Gaspreise.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-torch-red font-bold">•</span>
                <span><strong>Globale Nachfrage:</strong> Ein Bauboom in anderen Teilen der Welt (z.B. USA, China) kann zu lokaler Verknappung und Preissteigerungen führen (z.B. bei Bauholz 2021).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-torch-red font-bold">•</span>
                <span><strong>Lieferketten:</strong> Störungen in globalen Lieferketten (Pandemien, Konflikte) verzögern Materiallieferungen und treiben Preise.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-torch-red font-bold">•</span>
                <span><strong>CO₂-Bepreisung:</strong> Zunehmende Kosten für CO₂-Zertifikate verteuern emissionsintensive Materialien (Zement, Stahl).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-torch-red font-bold">•</span>
                <span><strong>Lohnkosten:</strong> Tarifliche Anpassungen und der generelle Fachkräftemangel führen zu einem stetigen, langfristig planbaren Anstieg der Bau- und Baunebenlöhne.</span>
              </li>
            </ul>
          </div>

          <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
            <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-shiraz" /> Historische Ereignisse
            </h3>
            <div className="space-y-4 text-sm">
              <div className="border-l-2 border-shiraz pl-3">
                <h4 className="font-bold text-text-main">2021/2022: Die "Holzkrise"</h4>
                <p className="text-text-main/70 mt-1">Extreme Preisspitzen bei Bauholz durch hohe Nachfrage aus den USA, Borkenkäferbefall und gestörte Lieferketten während der Corona-Pandemie.</p>
              </div>
              <div className="border-l-2 border-shiraz pl-3">
                <h4 className="font-bold text-text-main">2022: Energiekrise</h4>
                <p className="text-text-main/70 mt-1">Massiver Anstieg der Gas- und Strompreise in Folge des Ukraine-Kriegs führte zu historischen Preissprüngen bei Zement, Ziegeln und Stahl.</p>
              </div>
              <div className="border-l-2 border-shiraz pl-3">
                <h4 className="font-bold text-text-main">Langfristiger Trend</h4>
                <p className="text-text-main/70 mt-1">Stetiger, moderater Anstieg der Baupreise seit den 1980er Jahren, überlagert von konjunkturellen Zyklen und jüngsten Krisen.</p>
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
        regelwerke={[
          { title: 'Baupreisindizes des Statistischen Bundesamtes (Destatis Fachserie 17 Reihe 4)', url: 'https://www.destatis.de/' },
          { title: 'VOB/B § 2 Abs. 3 (Mehr- und Minderkostenberechnung bei Mengenabweichungen)', url: 'https://www.gesetze-im-internet.de/' }
        ]}
        literatur={[
          'Destatis: Methodische Erläuterungen zu den Baupreis- und Immobilienpreisindizes',
          'Hauptverband der Deutschen Bauindustrie: Bauwirtschaftliche Zahlen und Trends',
          'Wendehorst Bautechnische Zahlentafeln: Kapitel Kostenplanung und Preisentwicklung'
        ]}
        formeln={[
          {
            formel: 'I_L = \\frac{\\sum p_{t,i} \\cdot q_{0,i}}{\\sum p_{0,i} \\cdot q_{0,i}} \\cdot 100',
            erklaerung: 'Laspeyres-Preisindex: Gesetzliche Grundlage für amtliche Preisindizes (z.B. Destatis Baupreisindex). Vergleicht die Kosten eines festen Warenkorbs (q_0) aus der Basisperiode bei aktuellen Preisen p_t mit den Basispreisen p_0.',
            quelle: 'Statistisches Bundesamt (Destatis)'
          },
          {
            formel: 'K_t = K_0 \\cdot \\frac{I_t}{I_0} \\quad \\text{bzw.} \\quad \\Delta K = K_0 \\cdot \\left(\\frac{I_t - I_0}{I_0}\\right)',
            erklaerung: 'Preisgleitklausel-Berechnung zur Anpassung von Bauwerksverträgen bei unvorhersehbaren Baustoffpreiserhöhungen.',
            quelle: 'VOB/B § 2 / BGB'
          }
        ]}
      />
    </div>
  );
}
