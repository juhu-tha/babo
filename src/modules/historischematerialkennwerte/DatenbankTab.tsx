import type { Dispatch, SetStateAction } from 'react';
import { MaterialCategory, historicalData, HistoricalCategoryData } from '@/src/data/historicalMaterialsData';
import { FormulaText } from '@/src/components/ui/FormulaText';
import React from 'react';
import { Layers, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { BlockMath, InlineMath } from 'react-katex';

export interface DatenbankTabProps {
  setActiveCategory: Dispatch<SetStateAction<MaterialCategory>>;
  setExpandedIndex: Dispatch<SetStateAction<number | null>>;
  activeCategory: MaterialCategory;
  currentData: HistoricalCategoryData;
  expandedIndex: number | null;
  chartData: { labels: string[]; datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; }[]; } | null;
  chartOptions: { responsive: boolean; maintainAspectRatio: boolean; scales: { y: { title: { display: boolean; text: string; }; beginAtZero: boolean; }; }; };
}

export function DatenbankTab({ setActiveCategory, setExpandedIndex, activeCategory, currentData, expandedIndex, chartData, chartOptions }: DatenbankTabProps) {
  return (
    <div>
      <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30 mb-6">
        <p>
          <strong>Für Studierende &amp; Prüfingenieure:</strong> Ein ordentliches Tragfähigkeitsgutachten setzt voraus, dass alte Gliederungen, wie z.B. visuelle Holzgüteklassen nach DIN 4074 oder die frühere Beton-Bezeichnungsart Bn/B nach DIN 1045, präzise in aktuelle Eurocode-Nenngrößen übersetzt werden.
        </p>
      </div>
    
      <div className="flex flex-wrap gap-2 mb-8">
        {(Object.keys(historicalData) as MaterialCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setExpandedIndex(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-shiraz text-white' 
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-home-grau/30'
                  }`}
            id={`historical-cat-${cat}`}
          >
            {cat === 'mauerwerk' ? 'Mauerwerk' : historicalData[cat].title.split(' ')[0]}
          </button>
        ))}
      </div>
    
      <div className="bg-slate-50 p-6 rounded-xl border border-home-grau/30 mb-8 animate-fadeIn">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{currentData.title}</h3>
        <p className="text-slate-700 mb-4">{currentData.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border border-home-grau/30">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alte Normenlandschaft</span>
            <div className="font-semibold text-slate-800 mt-1">{currentData.normOld}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-home-grau/30">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktueller Status</span>
            <div className="font-semibold text-shiraz mt-1">{currentData.normNew}</div>
          </div>
        </div>
      </div>
    
      <div className="overflow-x-auto rounded-xl border border-home-grau/30 mb-8">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-home-grau/30 bg-slate-50">
              <th className="py-3 px-4 font-bold text-text-main">Alte Bezeichnung</th>
              <th className="py-3 px-4 font-bold text-shiraz">Neue Entsprechung (EC)</th>
              {activeCategory === 'beton' && (
                <>
                  <th className="py-3 px-4 font-bold text-text-main"><FormulaText text="f_{ck,cube}" /> (Alt-Wert) [MPa]</th>
                  <th className="py-3 px-4 font-bold text-shiraz"><FormulaText text="f_{ck,cyl}" /> (Neu-Wert) [MPa]</th>
                </>
              )}
              {(activeCategory === 'betonstahl' || activeCategory === 'baustahl') && (
                <>
                  <th className="py-3 px-4 font-bold text-text-main">
                    {activeCategory === 'baustahl' ? <FormulaText text="f_y" /> : <FormulaText text="f_{yk}" />} (Alt) [MPa]
                  </th>
                  <th className="py-3 px-4 font-bold text-shiraz">
                    {activeCategory === 'baustahl' ? <FormulaText text="f_{y}" /> : <FormulaText text="f_{yk}" />} (Neu) [MPa]
                  </th>
                </>
              )}
              {activeCategory === 'holz' && (
                <>
                  <th className="py-3 px-4 font-bold text-text-main">Zul. Biegespannung (Alt) [MPa]</th>
                  <th className="py-3 px-4 font-bold text-shiraz"><FormulaText text="f_{m,k}" /> (Neu) [MPa]</th>
                </>
              )}
              {activeCategory === 'mauerwerk' && (
                <>
                  <th className="py-3 px-4 font-bold text-text-main">SFK Steinklasse (Alt)</th>
                  <th className="py-3 px-4 font-bold text-shiraz">SFK Steinklasse (Neu)</th>
                </>
              )}
              <th className="py-3 px-4 font-bold text-slate-500 text-right w-12">Info</th>
            </tr>
          </thead>
          <tbody>
            {currentData.data.map((row, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <React.Fragment key={idx}>
                  <tr 
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className={`border-b border-home-grau/30 hover:bg-shiraz/5 transition-colors cursor-pointer ${
                            isExpanded ? 'bg-shiraz/5 font-semibold' : idx % 2 === 0 ? 'bg-slate-50/30' : ''
                          }`}
                    id={`historic-row-${activeCategory}-${idx}`}
                  >
                    <td className="py-3 px-4 font-medium text-slate-800">{row.old}</td>
                    <td className="py-3 px-4 font-bold text-shiraz">{row.new}</td>
                    <td className="py-3 px-4 text-slate-700 font-mono">{row.f_old}</td>
                    <td className="py-3 px-4 text-shiraz font-semibold font-mono">{row.f_new}</td>
                    <td className="py-3 px-4 text-slate-400 text-right">
                      {isExpanded ? <ChevronUp size={16} className="ml-auto text-shiraz" /> : <ChevronDown size={16} className="ml-auto" />}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-shiraz/5 border-b border-home-grau/25">
                      <td colSpan={5} className="p-4">
                        <div className="bg-white p-4 rounded-xl border border-shiraz/15 shadow-sm space-y-2">
                          <h5 className="font-bold text-shiraz flex items-center gap-1.5 text-xs uppercase tracking-wider">
                            <Info size={14} /> Praxis- &amp; Diagnostikhinweis für {row.old}
                          </h5>
                          <p className="text-slate-750 leading-relaxed text-sm font-normal">
                            {row.explanation}
                          </p>
                          <div className="text-xs text-slate-400 pt-1 border-t border-slate-50 font-sans font-normal">
                            Normungsquellen: {currentData.normOld} vs. {currentData.normNew}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    
      {(activeCategory === 'betonstahl' || activeCategory === 'baustahl') && chartData && (
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm mb-8">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Chronologische Festigkeitsentwicklung</h3>
          <div className="h-[280px] w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    
      {/* Sicherheitskonzepte Block */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 my-4">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="text-shiraz" size={20} /> Umrechnung auf Eurocode (Sicherheitskonzepte)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="text-md font-bold text-slate-900 mb-3">Historisch: Globale Sicherheit</h4>
            <p className="text-xs md:text-sm text-slate-700 mb-4 leading-relaxed">
              Bis ca. 2004 galt das <strong>globale Sicherheitskonzept</strong> (z.B. DIN 1045:1988). Die Beanspruchungen wurden unskaliert verglichen mit herabgesetzten Festigkeiten. Ein einziger mittlerer Beiwert deckte alle Lastschwankungen ab:
            </p>
            <div className="bg-white p-3 rounded border border-home-grau/30 text-center font-serif text-sm">
              <BlockMath math="\sigma_{vorh} \le \sigma_{zul} = \frac{f_k}{\gamma_{global}}" />
            </div>
            <ul className="list-disc pl-5 mt-4 text-xs text-slate-500 space-y-1">
              <li>Sicherheitsfaktor meist <InlineMath math="\gamma \approx 1{,}75\text{ bis }2{,}1" />.</li>
              <li>Keine separate Sicherheit für ständige (G) und variable (Q) Lasten.</li>
            </ul>
          </div>
    
          <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/20">
            <h4 className="text-md font-bold text-shiraz mb-3">Modern: Teilsicherheitsbeiwerte</h4>
            <p className="text-xs md:text-sm text-slate-750 mb-4 leading-relaxed">
              Die heutigen Eurocodes verwenden das <strong>Teilsicherheitskonzept</strong>. Einwirkungen werden mit Lastfaktoren (<InlineMath math="\gamma_F" />) erhöht, Werkstoffeigenschaften durch Materialfaktoren (<InlineMath math="\gamma_M" />) gemindert:
            </p>
            <div className="bg-white p-3 rounded border border-shiraz/20 text-center font-serif text-sm">
              <BlockMath math="E_d \le R_d" />
            </div>
            <div className="text-center mt-2">
              <InlineMath math="(E_k \cdot \gamma_F) \le \frac{R_k}{\gamma_M}" />
            </div>
            <ul className="list-disc pl-5 mt-4 text-xs text-shiraz/80 space-y-1">
              <li><InlineMath math="\gamma_G = 1{,}35" /> für Eigengewichte</li>
              <li><InlineMath math="\gamma_Q = 1{,}50" /> für Verkehrslasten (Nutz-, Schnee-, Windlast)</li>
              <li>Materialbeiwerte: Beton (<InlineMath math="\gamma_C = 1{,}5" />), Stahl (<InlineMath math="\gamma_{M0} = 1{,}0" />), Holz (<InlineMath math="\gamma_M = 1{,}3" />).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
