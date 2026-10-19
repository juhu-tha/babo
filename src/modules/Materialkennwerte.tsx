import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Box, Mountain, PaintBucket, Wrench, TreePine, Shield, FlaskConical, GlassWater, Waypoints, Layers, Scale, BarChart2, BookOpen } from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { FormulaText } from '@/src/components/ui/FormulaText';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

import libraryData from '@/src/data/materials.json';

const materialsData = libraryData.materials.reduce((acc, m) => {
  acc[m.id] = { 
    name: m.name, 
    category: libraryData.categories.find(c => c.id === m.categoryId)?.name || 'Sonstige', 
    ...m.properties 
  };
  return acc;
}, {} as Record<string, any>);

const properties = libraryData.schema;

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Beton & Mineralische Baustoffe': return <Box className="w-5 h-5" />;
    case 'Gesteine': return <Mountain className="w-5 h-5" />;
    case 'Putze & Mörtel': return <PaintBucket className="w-5 h-5" />;
    case 'Metalle': return <Wrench className="w-5 h-5" />;
    case 'Holz & Holzwerkstoffe': return <TreePine className="w-5 h-5" />;
    case 'Dämmstoffe': return <Shield className="w-5 h-5" />;
    case 'Kunststoffe & Verbundwerkstoffe': return <FlaskConical className="w-5 h-5" />;
    case 'Glas': return <GlassWater className="w-5 h-5" />;
    case 'Asphalt & Bitumen': return <Waypoints className="w-5 h-5" />;
    default: return <Layers className="w-5 h-5" />;
  }
};

export default function Materialkennwerte() {
  const [mat1, setMat1] = useState('beton');
  const [mat2, setMat2] = useState('stahl');
  const [mat3, setMat3] = useState('holz');

  const groupedMaterials = useMemo(() => {
    return Object.entries(materialsData).reduce((acc, [key, mat]) => {
      if (!acc[mat.category]) acc[mat.category] = [];
      acc[mat.category].push({ key, ...mat });
      return acc;
    }, {} as Record<string, any[]>);
  }, []);

  const selectedMaterials = useMemo(() => {
    const mats = [materialsData[mat1], materialsData[mat2]];
    if (mat3 !== 'none') mats.push(materialsData[mat3]);
    return mats;
  }, [mat1, mat2, mat3]);

  const chartData = useMemo(() => {
    const maxValues = properties.reduce((acc, prop) => {
      const max = Math.max(...selectedMaterials.map(m => m[prop.id as keyof typeof m] as number));
      acc[prop.id] = max > 0 ? max : 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: properties.map(p => [p.label, `(0 - ${maxValues[p.id]} ${p.unit})`]),
      datasets: selectedMaterials.map((m, idx) => {
        const colors = [
          { bg: 'rgba(163, 17, 62, 0.2)', border: '#A3113E' }, // Shiraz
          { bg: 'rgba(14, 85, 140, 0.2)', border: '#0e558c' }, // Blue
          { bg: 'rgba(51, 51, 51, 0.2)', border: '#333333' },  // Dark Gray
        ];
        return {
          label: m.name,
          data: properties.map(p => ((m[p.id as keyof typeof m] as number) / maxValues[p.id]) * 105), // slightly padded
          rawData: properties.map(p => m[p.id as keyof typeof m]),
          backgroundColor: colors[idx].bg,
          borderColor: colors[idx].border,
          pointBackgroundColor: colors[idx].border,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors[idx].border,
          borderWidth: 2,
        };
      }),
    };
  }, [selectedMaterials]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top' as const,
        labels: {
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const dataset = context.dataset;
            const index = context.dataIndex;
            const rawValue = dataset.rawData[index];
            const propInfo = properties[index];
            return `${dataset.label}: ${rawValue} ${propInfo.unit}`;
          }
        }
      }
    },
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER CARD WITH Standard Template Info */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Scale className="text-shiraz" /> Kennwerte &amp; Materialdatenbank
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Wahl des richtigen Baustoffs hängt von den spezifischen Anforderungen des Tragwerks und der Bauphysik ab. Vergleichen Sie charakteristische Materialparameter wie Rohdichte, Festigkeit und Elastizitätsmodul direkt im visuellen Netzdiagramm und der tabellarischen Übersicht.
          </p>
        </div>
      </div>

      {/* SELECTION BLOCK FOR MATERIALS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 animate-in fade-in duration-300">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Scale size={18} className="text-shiraz" /> Materialien für den Vergleich auswählen:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-shiraz">Material 1</label>
              <InfoTooltip text="Erstes zu vergleichendes Material." />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-shiraz">{getCategoryIcon(materialsData[mat1].category)}</div>
              <select 
                className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz flex-1 text-sm text-text-main cursor-pointer"
                value={mat1}
                onChange={(e) => setMat1(e.target.value)}
              >
                {Object.entries(groupedMaterials).map(([category, mats]) => (
                  <optgroup key={category} label={category}>
                    {mats.map(mat => (
                      <option key={mat.key} value={mat.key}>{mat.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[#0e558c]">Material 2</label>
              <InfoTooltip text="Zweites zu vergleichendes Material." />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[#0e558c]">{getCategoryIcon(materialsData[mat2].category)}</div>
              <select 
                className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz flex-1 text-sm text-text-main cursor-pointer"
                value={mat2}
                onChange={(e) => setMat2(e.target.value)}
              >
                {Object.entries(groupedMaterials).map(([category, mats]) => (
                  <optgroup key={category} label={category}>
                    {mats.map(mat => (
                      <option key={mat.key} value={mat.key}>{mat.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[#333333]">Material 3 (Optional)</label>
              <InfoTooltip text="Drittes zu vergleichendes Material." />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[#333333]">
                {mat3 !== 'none' ? getCategoryIcon(materialsData[mat3].category) : <Layers className="w-5 h-5" />}
              </div>
              <select 
                className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz flex-1 text-sm text-text-main cursor-pointer"
                value={mat3}
                onChange={(e) => setMat3(e.target.value)}
              >
                <option value="none">- Kein drittes Material -</option>
                {Object.entries(groupedMaterials).map(([category, mats]) => (
                  <optgroup key={category} label={category}>
                    {mats.map(mat => (
                      <option key={mat.key} value={mat.key}>{mat.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 1. GRAFIK (ERST GRAFIK) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2">
            <BarChart2 className="text-shiraz w-5 h-5" /> Visueller Kennwerte-Vergleich (Netzdiagramm)
          </h3>
          <span className="text-xs text-text-main/60 font-mono bg-off-white px-2.5 py-1 rounded-md border border-home-grau/20">
            Radar-Profil
          </span>
        </div>
        <p className="text-sm text-text-main/70">
          Das Netzdiagramm zeigt die normalisierten Kennwerte der gewählten Baustoffe im direkten Vergleich (Maximum der ausgewählten Materialien entspricht 100%).
        </p>
        <div className="h-[420px] w-full relative">
          <Radar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* 2. TABELLE (DARUNTER TABELLE) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 overflow-x-auto flex flex-col gap-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz w-5 h-5" /> Kennwerte-Tabelle im direkten Vergleich
          </h3>
          <span className="text-xs text-text-main/60 font-mono bg-off-white px-2.5 py-1 rounded-md border border-home-grau/20">
            {properties.length} Parameter
          </span>
        </div>
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b-2 border-home-grau/30">
              <th className="py-3 px-4 font-bold text-text-main w-1/4">Eigenschaft</th>
              <th className="py-3 px-3 font-bold text-text-main/70 text-xs w-1/6">Wertart</th>
              <th className="py-3 px-4 font-bold text-text-main w-1/4 text-shiraz">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(materialsData[mat1].category)}
                  {materialsData[mat1].name}
                </div>
              </th>
              <th className="py-3 px-4 font-bold text-text-main w-1/4 text-[#0e558c]">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(materialsData[mat2].category)}
                  {materialsData[mat2].name}
                </div>
              </th>
              {mat3 !== 'none' && (
                <th className="py-3 px-4 font-bold text-text-main w-1/4 text-[#333333]">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(materialsData[mat3].category)}
                    {materialsData[mat3].name}
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {properties.map((prop, idx) => {
              const wertartMap: Record<string, string> = {
                density: 'Mittelwert',
                eModul: 'Mittelwert',
                compressive: 'charakteristisch',
                tensile: 'charakteristisch',
                thermalCond: 'Nennwert / Mittelwert',
                thermalExp: 'Mittelwert',
                heatCap: 'Mittelwert'
              };
              const wertart = wertartMap[prop.id] || 'Mittelwert';
              return (
                <tr key={prop.id} className={`border-b border-home-grau/10 ${idx % 2 === 0 ? 'bg-off-white/50' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-text-main text-sm">{prop.label}</div>
                    <div className="text-xs text-home-grau font-mono">[{prop.unit}]</div>
                  </td>
                  <td className="py-3 px-3 text-xs text-text-main/70 font-medium">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                      {wertart}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-main font-mono font-medium">{materialsData[mat1][prop.id]}</td>
                  <td className="py-3 px-4 text-sm text-text-main font-mono font-medium">{materialsData[mat2][prop.id]}</td>
                  {mat3 !== 'none' && (
                    <td className="py-3 px-4 text-sm text-text-main font-mono font-medium">{materialsData[mat3][prop.id]}</td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-xs text-text-main/70">
          Hinweis Holzfestigkeit: Nadelholz C24 charakteristische Zugfestigkeit parallel zur Faser <FormulaText text="f_{t,0,k} = 14{,}5\text{ N/mm}^2" /> (DIN EN 338:2016 / DIN EN 1995-1-1).
        </div>
      </div>

      {/* 3. HINTERGRUND (DARUNTER HINTERGRUND) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2">
            <BookOpen className="text-shiraz w-5 h-5" /> Hintergrund &amp; Einordnung (Physikalisch-mechanische Grundlagen)
          </h3>
          <span className="text-xs text-text-main/60 font-mono bg-off-white px-2.5 py-1 rounded-md border border-home-grau/20">
            Werkstoffmechanik
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
            <h4 className="font-bold text-shiraz h-7 flex items-center">Steifigkeit vs. Festigkeit</h4>
            <p className="text-sm text-text-main/80 leading-relaxed">
              Stahl hat einen extrem hohen E-Modul (210.000 MPa) und ist sehr fest, aber auch schwer. Holz ist leicht, hat aber eine geringere Steifigkeit. Die Abstimmung dieser Eigenschaften entscheidet über Bauteilschlankheit und Durchbiegungsstufen.
            </p>
          </div>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
            <h4 className="font-bold text-shiraz h-7 flex items-center">Zug- vs. Druckfestigkeit</h4>
            <p className="text-sm text-text-main/80 leading-relaxed">
              Beton und Mauerwerk können hohe Druckkräfte aufnehmen, versagen aber bei Zugbeanspruchung sehr früh (meist bei ca. 10% der Druckfestigkeit), weshalb sie im Verbund mit zugfestem Stahl bewehrt werden müssen.
            </p>
          </div>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
            <h4 className="font-bold text-shiraz h-7 flex items-center">Bauphysik &amp; Dämmung</h4>
            <p className="text-sm text-text-main/80 leading-relaxed">
              Metalle wie Stahl und Aluminium leiten Wärme exzellent, was zu kritischen Wärmebrücken führen kann. Dämmstoffe wie EPS oder Mineralwolle haben extrem geringe Rohdichten und isolieren hervorragend.
            </p>
          </div>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
            <h4 className="font-bold text-shiraz h-7 flex items-center">Wärmedehnung</h4>
            <p className="text-sm text-text-main/80 leading-relaxed">
              Aluminium dehnt sich bei Erwärmung fast doppelt so stark aus wie Stahl oder Beton. Dies muss bei Mischkonstruktionen durch Dehnfugen zwingend berücksichtigt werden, um zerstörungsfreie Verformungen zu garantieren.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Materialkennwerte', url: 'https://de.wikipedia.org/wiki/Werkstoffeigenschaft' },
          { title: 'Elastizitätsmodul', url: 'https://de.wikipedia.org/wiki/Elastizit%C3%A4tsmodul' },
          { title: 'Wärmeleitfähigkeit', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmeleitf%C3%A4higkeit' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1990 (Eurocode 0: Grundlagen der Tragwerksplanung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1990' },
          { title: 'DIN EN 1991 (Eurocode 1: Einwirkungen auf Tragwerke)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1991' },
          { title: 'DIN EN 1992 (Eurocode 2: Bemessung von Betonbauteilen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992' },
          { title: 'DIN EN 1993 (Eurocode 3: Bemessung von Stahlbauten)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1993' },
          { title: 'DIN EN 1995 (Eurocode 5: Bemessung von Holzbauten)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1995' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024'
        ]}
        formeln={[
          {
            formel: 'E = \\frac{\\sigma}{\\varepsilon} \\quad [\\text{MPa}] \\quad \\text{bzw.} \\quad G = \\frac{E}{2\\,(1 + \\nu)}',
            erklaerung: 'Hookesches Gesetz für linearelastisches Materialverhalten sowie Beziehung zwischen Elastizitätsmodul E, Schubmodul G und Querdehnungszahl (Poissonzahl) nu.',
            quelle: 'Festigkeitslehre / DIN EN 1990'
          },
          {
            formel: '\\Delta L = L_0 \\cdot \\alpha_T \\cdot \\Delta T \\quad [\\text{mm}]',
            erklaerung: 'Thermische Längenänderung eines Werkstoffs in Abhängigkeit von Ausgangslänge L_0, linearem thermischem Ausdehnungskoeffizienten alpha_T [10^-6 / K] und Temperaturdifferenz.',
            quelle: 'DIN EN 1991-1-5'
          }
        ]}
      />
    </div>
  );
}
