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
  type TooltipItem,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { formatDeWert } from '@/src/utils/numberFormat';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

import libraryData from '@/src/data/materials.json';
import inhalt from '@/content/materialkennwerte/Materialkennwerte.json';
import { MdText } from '@/src/components/inhalt/MdText';

/** Material aus materials.json: Name, Kategorie und die Kennwerte (properties) flach daneben */
interface MaterialEintrag { name: string; category: string; [kennwert: string]: string | number }

const materialsData = libraryData.materials.reduce((acc, m) => {
  acc[m.id] = { 
    name: m.name, 
    category: libraryData.categories.find(c => c.id === m.categoryId)?.name || 'Sonstige', 
    ...m.properties 
  };
  return acc;
}, {} as Record<string, MaterialEintrag>);

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
    }, {} as Record<string, (MaterialEintrag & { key: string })[]>);
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
      labels: properties.map(p => [p.label, `(0 – ${formatDeWert(maxValues[p.id])} ${p.unit})`]),
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
          label: (context: TooltipItem<'radar'>) => {
            const dataset = context.dataset as typeof context.dataset & { rawData: number[] };
            const index = context.dataIndex;
            const rawValue = dataset.rawData[index];
            const propInfo = properties[index];
            return `${dataset.label}: ${formatDeWert(rawValue)} ${propInfo.unit}`;
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
          <Scale className="text-shiraz" /><MdText text={inhalt.texte.kennwerteMaterialdatenbank} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieWahlDesRichtigen} /></p>
        </div>
      </div>

      {/* SELECTION BLOCK FOR MATERIALS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 animate-in fade-in duration-300">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Scale size={18} className="text-shiraz" /><MdText text={inhalt.texte.materialienFürDenVergleich} /></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-shiraz">Material 1</label>
              <InfoTooltip text={inhalt.werte.erstesZuVergleichendesMaterial} />
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
              <InfoTooltip text={inhalt.werte.zweitesZuVergleichendesMaterial} />
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
              <label className="text-xs font-bold text-[#333333]"><MdText text={inhalt.texte.material3Optional} /></label>
              <InfoTooltip text={inhalt.werte.drittesZuVergleichendesMaterial} />
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
            <BarChart2 className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.visuellerKennwerteVergleichNetzdiagramm} /></h3>
          <span className="text-xs text-text-main/60 font-mono bg-off-white px-2.5 py-1 rounded-md border border-home-grau/20">
            Radar-Profil
          </span>
        </div>
        <p className="text-sm text-text-main/70"><MdText text={inhalt.texte.dasNetzdiagrammZeigtDie} /></p>
        <div className="h-[420px] w-full relative">
          <Radar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* 2. TABELLE (DARUNTER TABELLE) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 overflow-x-auto flex flex-col gap-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.kennwerteTabelleImDirekten} /></h3>
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
                compressive: inhalt.werte.charakteristischNennwert,
                tensile: inhalt.werte.charakteristischNennwert2,
                thermalCond: inhalt.werte.tabellenNennwert,
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
                  <td className="py-3 px-4 text-sm text-text-main font-mono font-medium">{formatDeWert(materialsData[mat1][prop.id] as number)}</td>
                  <td className="py-3 px-4 text-sm text-text-main font-mono font-medium">{formatDeWert(materialsData[mat2][prop.id] as number)}</td>
                  {mat3 !== 'none' && (
                    <td className="py-3 px-4 text-sm text-text-main font-mono font-medium">{formatDeWert(materialsData[mat3][prop.id] as number)}</td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-xs text-text-main/70 flex flex-col gap-1.5">
          <div><MdText text={inhalt.texte.lesehinweisFestigkeitenCharakteristischN} /><FormulaText text="f_{ck}" /> und <FormulaText text="f_{ctk;0,05}" /><MdText text={inhalt.texte.nachDinEn1992} /><FormulaText text="\eta_1" /><MdText text={inhalt.texte.abgemindertBaustahlEdelstahlAluminium} /><FormulaText text="f_{c,0,k}" /> und <FormulaText text="f_{t,0,k}" /><MdText text={inhalt.texte.nachDinEn338} /><FormulaText text="f_{t,0,k} = 14{,}5\text{ N/mm}^2" /><MdText text={inhalt.texte.glasCharakteristischeBiegezugfestigkeitF} /><FormulaText text="f_k" /><MdText text={inhalt.texte.gesteineDämmUndKunststoffe} /></div>
          <div><MdText text={inhalt.texte.steifigkeitUndDichteSind} /><FormulaText text="E_{cm}" />, <FormulaText text="E_{0,mean}" />, <FormulaText text="\rho_{mean}" /><MdText text={inhalt.texte.einWärmedehnkoeffizientVon0} /></div>
        </div>
      </div>

      {/* 3. HINTERGRUND (DARUNTER HINTERGRUND) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2">
            <BookOpen className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.hintergrundEinordnungPhysikalischMechani} /></h3>
          <span className="text-xs text-text-main/60 font-mono bg-off-white px-2.5 py-1 rounded-md border border-home-grau/20">
            Werkstoffmechanik
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
            <h4 className="font-bold text-shiraz h-7 flex items-center"><MdText text={inhalt.texte.steifigkeitVsFestigkeit} /></h4>
            <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.stahlHatEinenSehr} /></p>
          </div>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
            <h4 className="font-bold text-shiraz h-7 flex items-center"><MdText text={inhalt.texte.zugVsDruckfestigkeit} /></h4>
            <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.betonUndMauerwerkKönnen} /></p>
          </div>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
            <h4 className="font-bold text-shiraz h-7 flex items-center"><MdText text={inhalt.texte.bauphysikDämmung} /></h4>
            <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.metalleWieStahlUnd} /></p>
          </div>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
            <h4 className="font-bold text-shiraz h-7 flex items-center">Wärmedehnung</h4>
            <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.aluminiumDehntSichBei} /></p>
          </div>
        </div>
      </div>

      {/* ANWENDUNG (Stufe 3 des Lehrpfads) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2 animate-in fade-in duration-300">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2 border-b border-home-grau/20 pb-3">
          <Scale className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.anwendungKennwerteImRechenbeispiel} /></h3>
        <FormulaDerivationBox
          title={inhalt.werte.beispiel1WärmedehnungEiner}
          zielGleichung="\Delta L = \alpha_T \cdot L_0 \cdot \Delta T"
          schritte={inhalt.daten["Materialkennwerte.schritte"]}
          ergebnisHinweis={inhalt.werte.aluminiumDehntSichGut}
          normQuelle={inhalt.werte.dinEn19911}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel2SpezifischeSteifigkeit}
          zielGleichung="\frac{E}{\rho}\ \text{(spezifische Steifigkeit)}"
          schritte={inhalt.daten["Materialkennwerte.schritte_2"]}
          ergebnisHinweis={inhalt.werte.bezogenAufDasGewicht}
          normQuelle={inhalt.werte.kennwerteDinEn1993}
        />
      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="materialkennwerte" />

      {/* FOOTER */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Materialkennwerte', url: 'https://de.wikipedia.org/wiki/Stoffeigenschaft' },
          { title: 'Elastizitätsmodul', url: 'https://de.wikipedia.org/wiki/Elastizit%C3%A4tsmodul' },
          { title: 'Wärmeleitfähigkeit', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmeleitf%C3%A4higkeit' }
        ]}
        regelwerke={inhalt.daten["Materialkennwerte.regelwerke"]}
        literatur={inhalt.daten["Materialkennwerte.literatur"]}
        lastReviewed={inhalt.werte.oktober2026Ap3}
        formeln={inhalt.daten["Materialkennwerte.formeln"]}
      />
    </div>
  );
}
