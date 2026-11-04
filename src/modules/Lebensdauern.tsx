import React, { useState, useMemo } from 'react';
import { Clock, RefreshCw, BarChart3, Calculator, Table, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import { InlineMath, BlockMath } from 'react-katex';
import inhalt from '@/content/lebensdauern/Lebensdauern.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';
import { ErgebnisAnsage } from '@/src/components/ui/ErgebnisAnsage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LifespanItem {
  id: string;
  category: string;
  group: 'Tragwerk' | 'Dach' | 'Fassade' | 'Dämmung' | 'Ausbau' | 'Technik';
  min: number;
  max: number;
  avg: number;
}

const lifespanData: LifespanItem[] = [
  { id: 'tragwerk_beton', category: inhalt.werte.tragwerkStahlbeton, group: 'Tragwerk', min: 50, max: 100, avg: 80 },
  { id: 'tragwerk_mauerwerk', category: inhalt.werte.tragwerkMauerwerk, group: 'Tragwerk', min: 50, max: 100, avg: 80 },
  { id: 'tragwerk_holz', category: inhalt.werte.tragwerkHolz, group: 'Tragwerk', min: 50, max: 80, avg: 60 },
  { id: 'tragwerk_stahl', category: inhalt.werte.tragwerkStahl, group: 'Tragwerk', min: 50, max: 100, avg: 80 },
  { id: 'dachstuhl', category: inhalt.werte.dachkonstruktionHolzStahl, group: 'Dach', min: 40, max: 60, avg: 50 },
  { id: 'dach_ziegel', category: inhalt.werte.dacheindeckungZiegelDachstein, group: 'Dach', min: 30, max: 50, avg: 40 },
  { id: 'dach_blech', category: inhalt.werte.dacheindeckungBlechKupferZink, group: 'Dach', min: 40, max: 60, avg: 50 },
  { id: 'dach_flach', category: inhalt.werte.flachdachabdichtungBitumenKunststoff, group: 'Dach', min: 15, max: 30, avg: 20 },
  { id: 'dach_gruen', category: inhalt.werte.dachbegrünungExtensiv, group: 'Dach', min: 20, max: 40, avg: 30 },
  { id: 'dachfenster', category: 'Dachfenster', group: 'Dach', min: 20, max: 30, avg: 25 },
  { id: 'fassade_putz', category: inhalt.werte.fassadeAussenputz, group: 'Fassade', min: 20, max: 40, avg: 30 }, // Lehrwert (vorläufig, Normprüfung ausstehend)
  { id: 'fassade_wdvs', category: inhalt.werte.fassadeWdvs, group: 'Fassade', min: 30, max: 50, avg: 40 }, // BNB 2017, 335.641 WDVS: 40 a (Konsistenz 29.10.2026, F-5)
  { id: 'fassade_klinker', category: inhalt.werte.fassadeKlinkerVormauerziegel, group: 'Fassade', min: 50, max: 80, avg: 60 },
  { id: 'fassade_holz', category: inhalt.werte.fassadeHolzschalung, group: 'Fassade', min: 20, max: 40, avg: 30 },
  { id: 'fassade_glas', category: inhalt.werte.fassadeGlasPfostenRiegel, group: 'Fassade', min: 30, max: 50, avg: 40 },
  { id: 'daemmung_eps', category: inhalt.werte.dämmungEpsXpsMineralwolle, group: 'Dämmung', min: 30, max: 50, avg: 40 },
  { id: 'daemmung_natur', category: inhalt.werte.dämmungHolzfaserZellulose, group: 'Dämmung', min: 30, max: 50, avg: 40 },
  { id: 'daemmung_pur', category: inhalt.werte.dämmungPurPir, group: 'Dämmung', min: 30, max: 50, avg: 40 },
  { id: 'daemmung_schaumglas', category: inhalt.werte.dämmungSchaumglas, group: 'Dämmung', min: 40, max: 60, avg: 50 },
  { id: 'fenster_holz', category: inhalt.werte.fensterHolz, group: 'Ausbau', min: 25, max: 40, avg: 40 }, // BBSR 40 a (Umsetzung 29.10.2026, T11-LCA-2)
  { id: 'fenster_kunststoff', category: inhalt.werte.fensterKunststoff, group: 'Ausbau', min: 25, max: 40, avg: 40 }, // BBSR 40 a
  { id: 'fenster_alu', category: inhalt.werte.fensterAluminium, group: 'Ausbau', min: 30, max: 50, avg: 50 }, // BBSR ≥ 50 a
  { id: 'sonnenschutz', category: inhalt.werte.sonnenschutzAußenjalousien, group: 'Ausbau', min: 15, max: 25, avg: 20 },
  { id: 'tueren_innen', category: inhalt.werte.innentürenHolzRöhrenspan, group: 'Ausbau', min: 20, max: 40, avg: 30 },
  { id: 'tueren_aussen', category: inhalt.werte.außentürenAluStahl, group: 'Ausbau', min: 30, max: 50, avg: 40 },
  { id: 'innenwand_trockenbau', category: inhalt.werte.innenwändeTrockenbau, group: 'Ausbau', min: 25, max: 50, avg: 40 },
  { id: 'innenwand_massiv', category: inhalt.werte.innenwändeMassiv, group: 'Ausbau', min: 50, max: 100, avg: 80 },
  { id: 'boden_parkett', category: inhalt.werte.bodenbelägeParkett, group: 'Ausbau', min: 15, max: 30, avg: 20 },
  { id: 'boden_keramik', category: inhalt.werte.bodenbelägeKeramikfliesen, group: 'Ausbau', min: 30, max: 50, avg: 40 },
  { id: 'boden_naturstein', category: inhalt.werte.bodenbelägeNaturstein, group: 'Ausbau', min: 30, max: 50, avg: 40 },
  { id: 'boden_textil', category: inhalt.werte.bodenbelägeTeppichLaminat, group: 'Ausbau', min: 10, max: 15, avg: 12 },
  { id: 'boden_estrich', category: inhalt.werte.estrichZementAnhydrit, group: 'Ausbau', min: 40, max: 60, avg: 50 },
  { id: 'oberflaechen_innen', category: inhalt.werte.anstrichTapeteInnen, group: 'Ausbau', min: 5, max: 15, avg: 10 },
  { id: 'abdichtung_epdm', category: inhalt.werte.abdichtungEpdmFpo, group: 'Dach', min: 20, max: 40, avg: 30 },
];

export default function Lebensdauern() {
  const [activeTab, setActiveTab] = useState<'austauschrechner' | 'diagramm' | 'tabelle' | 'theorie'>('austauschrechner');
  const [buildingLifespan, setBuildingLifespan] = useState<number>(50);
  const [filterGroup, setFilterGroup] = useState<string>('Alle');

  const filteredData = useMemo(() => {
    if (filterGroup === 'Alle') return lifespanData;
    return lifespanData.filter(d => d.group === filterGroup);
  }, [filterGroup]);

  // Chart setup
  const chartData = {
    labels: lifespanData.slice(0, 16).map(item => item.category),
    datasets: [
      {
        label: inhalt.werte.lebensdauerSpannweiteMinMax,
        data: lifespanData.slice(0, 16).map(item => [item.min, item.max]),
        backgroundColor: 'rgba(158, 42, 43, 0.4)',
        borderColor: '#9E2A2B',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const data = context.raw as [number, number];
            return `Lebensdauer: ${formatDeWert(data[0])} - ${formatDeWert(data[1])} Jahre`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: inhalt.werte.nutzungsdauerJahre
        },
        max: 100
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Clock className="text-shiraz" /><MdText text={inhalt.texte.typischeLebensdauernAustauschzyklenAp} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.richtwerteFürDieTechnische} /></p>
        </div>

        {/* Tab Navigation following GEMINI_md */}
        <ReiterLeiste label="Bereiche Lebensdauern" className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button {...alsReiter(activeTab === 'austauschrechner', 'lebensdauer-bereich', 'austauschrechner')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'austauschrechner' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('austauschrechner')}
          >
            <Calculator size={16} /> Austauschzyklen-Rechner
          </button>
          <button {...alsReiter(activeTab === 'diagramm', 'lebensdauer-bereich', 'diagramm')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'diagramm' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('diagramm')}
          >
            <BarChart3 size={16} /><MdText text={inhalt.texte.lebensdauerSpannenDiagramm} /></button>
          <button {...alsReiter(activeTab === 'tabelle', 'lebensdauer-bereich', 'tabelle')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'tabelle' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('tabelle')}
          >
            <Table size={16} /><MdText text={inhalt.texte.bauteiltabelleBnbBbsr} /></button>
          <button {...alsReiter(activeTab === 'theorie', 'lebensdauer-bereich', 'theorie')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'theorie' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('theorie')}
          >
            <BookOpen size={16} /><MdText text={inhalt.texte.faktorenmethodeIso15686} /></button>
        </ReiterLeiste>

        {/* Tab 1: Rechner */}
        {activeTab === 'austauschrechner' && (
          <div {...reiterPanel('lebensdauer-bereich', activeTab)} className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-shiraz" /><MdText text={inhalt.texte.gebäudeBetrachtungszeitraumLcaLcc} /></h3>
                  <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.typischerReferenzStudienzeitraumFür} /></p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-lg text-shiraz">
                    {formatDeWert(buildingLifespan)} Jahre
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={buildingLifespan}
                  onChange={(e) => setBuildingLifespan(Number(e.target.value))}
                  className="flex-1 h-2 bg-home-grau/20 rounded-lg appearance-none cursor-pointer accent-shiraz"
                />
              </div>
              {(() => {
                // Kurzzeile (04.11.2026): Erneuerungen je Bauteil im Betrachtungszeitraum zusammengefasst, wie die Tabelle
                const n = lifespanData.map(item => Math.max(0, Math.ceil(buildingLifespan / item.avg) - 1));
                const zahl = (x: number) => formatDeZahl(x, 0);
                return <ErgebnisAnsage text={`Betrachtungszeitraum ${formatDeWert(buildingLifespan)} Jahre: ${zahl(n.filter(x => x === 0).length)} Bauteile ohne Erneuerung, ${zahl(n.filter(x => x === 1).length)} mit einer, ${zahl(n.filter(x => x > 1).length)} mit mehreren Erneuerungen`} />;
              })()}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-600 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg font-bold"><MdText text={inhalt.texte.bauteilgruppeBaustoff} /></th>
                    <th className="px-4 py-3 text-center font-bold"><MdText text={inhalt.texte.spannweiteMinMax} /></th>
                    <th className="px-4 py-3 text-center font-bold"><MdText text={inhalt.texte.nutzungsdauer} /></th>
                    <th className="px-4 py-3 text-center rounded-tr-lg font-bold"><MdText text={inhalt.texte.austauschzyklenBei} />{formatDeWert(buildingLifespan)} a</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lifespanData.map((item, idx) => {
                    const replacements = Math.max(0, Math.ceil(buildingLifespan / item.avg) - 1);
                    return (
                      <tr key={item.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50/50' : 'bg-off-white/40 hover:bg-slate-50/50'}>
                        <td className="px-4 py-2.5 font-medium text-slate-800">{item.category}</td>
                        <td className="px-4 py-2.5 text-center font-mono text-slate-600">{formatDeWert(item.min)} – {formatDeWert(item.max)} a</td>
                        <td className="px-4 py-2.5 text-center font-mono font-bold text-slate-900">{formatDeWert(item.avg)} a</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full font-bold text-xs ${
                            replacements === 0 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : replacements === 1 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {replacements === 0 ? inhalt.werte.t0Dauerhaft : `${formatDeWert(replacements)} × Erneuerung`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm">
              <h3 className="font-bold text-sm text-text-main mb-3 flex items-center gap-2">
                <Layers className="text-shiraz" size={16} /><MdText text={inhalt.texte.schematischeDarstellungAustauschzyklenIm} /></h3>
              <div className="flex flex-col items-center bg-off-white rounded-xl border border-home-grau/30 p-4">
                <svg width="100%" height="150" viewBox="0 0 450 150">
                  <line x1="50" y1="120" x2="400" y2="120" stroke="#1e293b" strokeWidth="2" markerEnd="url(#arrow-black-lebensdauer)" />
                  <text x="410" y="125" fontSize="11" fill="#1e293b">Zeit (a)</text>
                  
                  <line x1="50" y1="110" x2="50" y2="130" stroke="#1e293b" strokeWidth="2" />
                  <text x="50" y="145" fontSize="10" fill="#1e293b" textAnchor="middle">0 a</text>
                  <line x1="350" y1="110" x2="350" y2="130" stroke="#1e293b" strokeWidth="2" />
                  <text x="350" y="145" fontSize="10" fill="#1e293b" textAnchor="middle">{formatDeWert(buildingLifespan)} a (Gebäude)</text>
                  
                  {/* Long life component */}
                  <rect x="50" y="65" width="300" height="22" fill="#cbd5e1" stroke="#64748b" rx="4" />
                  <text x="200" y="80" fontSize="10" fill="#1e293b" textAnchor="middle">Tragwerk (Lebensdauer ≥ {formatDeWert(buildingLifespan)} a) → 0 Austausche</text>
                  
                  {/* Short life component */}
                  <rect x="50" y="25" width="120" height="22" fill="#fca5a5" stroke="#ef4444" rx="4" />
                  <text x="110" y="40" fontSize="10" fill="#7f1d1d" textAnchor="middle">Flachdach (20 a)</text>
                  
                  <rect x="170" y="25" width="120" height="22" fill="#fca5a5" stroke="#ef4444" rx="4" />
                  <text x="230" y="40" fontSize="10" fill="#7f1d1d" textAnchor="middle">Austausch 1</text>
                  
                  <rect x="290" y="25" width="60" height="22" fill="#fca5a5" stroke="#ef4444" rx="4" />
                  <text x="320" y="40" fontSize="10" fill="#7f1d1d" textAnchor="middle">Aust. 2</text>
                  
                  <defs>
                    <marker id="arrow-black-lebensdauer" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2 leading-relaxed"><MdText text={inhalt.texte.bauteileMitEinerKürzeren} /></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Diagramm */}
        {activeTab === 'diagramm' && (
          <div {...reiterPanel('lebensdauer-bereich', activeTab)} className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2 mb-2">
                <BarChart3 className="text-shiraz" size={18} /><MdText text={inhalt.texte.lebensdauerSpannweitenZentralerBauteilsc} /></h3>
              <p className="text-xs text-slate-500 mb-6"><MdText text={inhalt.texte.übersichtDerMinimalenUnd} /></p>
              <div className="h-[550px] w-full relative">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Bauteiltabelle */}
        {activeTab === 'tabelle' && (
          <div {...reiterPanel('lebensdauer-bereich', activeTab)} className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.filterNachGewerk} /></span>
              <div className="flex flex-wrap gap-1.5">
                {['Alle', 'Tragwerk', 'Dach', 'Fassade', 'Dämmung', 'Ausbau'].map(g => (
                  <button
                    key={g}
                    onClick={() => setFilterGroup(g)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterGroup === g
                        ? 'bg-shiraz text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-home-grau/30 hover:bg-slate-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-home-grau/30 shadow-sm overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-600 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold">Gewerk</th>
                    <th className="px-4 py-3 font-bold">Bauteilbezeichnung</th>
                    <th className="px-4 py-3 text-center font-bold"><MdText text={inhalt.texte.minimaleDauer} /></th>
                    <th className="px-4 py-3 text-center font-bold"><MdText text={inhalt.texte.maximaleDauer} /></th>
                    <th className="px-4 py-3 text-center font-bold"><MdText text={inhalt.texte.mittelwertReferenz} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((d, i) => (
                    <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-off-white/40'}>
                      <td className="px-4 py-2.5 font-bold text-shiraz">{d.group}</td>
                      <td className="px-4 py-2.5 text-slate-800 font-medium">{d.category}</td>
                      <td className="px-4 py-2.5 text-center font-mono text-slate-600">{formatDeWert(d.min)} a</td>
                      <td className="px-4 py-2.5 text-center font-mono text-slate-600">{formatDeWert(d.max)} a</td>
                      <td className="px-4 py-2.5 text-center font-mono font-bold text-slate-900">{formatDeWert(d.avg)} a</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Theorie */}
        {activeTab === 'theorie' && (
          <div {...reiterPanel('lebensdauer-bereich', activeTab)} className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <BookOpen className="text-shiraz" size={18} /><MdText text={inhalt.texte.faktorenmethodeNachIso15686} /></h3>
                <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.dieTatsächlicheNutzungsdauerEines} /></p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
                  <BlockMath math="\text{ESLC} = \text{RSLC} \cdot A \cdot B \cdot C \cdot D \cdot E \cdot F \cdot G" />
                </div>
                <div className="text-xs text-slate-650 space-y-1.5 leading-relaxed">
                  <div><MdText text={inhalt.texte.rslcReferenzNutzungsdauerNach} /></div>
                  <div><MdText text={inhalt.texte.aWerkstoffUndKomponentenqualität} /></div>
                  <div><MdText text={inhalt.texte.bEntwurfsUndKonstruktionsqualität} /></div>
                  <div><MdText text={inhalt.texte.cAusführungsqualitätAufDer} /></div>
                  <div><MdText text={inhalt.texte.dInnenklimaUndChemische} /></div>
                  <div><MdText text={inhalt.texte.eAußenklimaSchlagregenUv} /></div>
                  <div><MdText text={inhalt.texte.fNutzungsbeanspruchungVerkehrMechanische} /></div>
                  <div><MdText text={inhalt.texte.gInstandhaltungsUndWartungsniveau} /></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-700" size={18} /><MdText text={inhalt.texte.relevanzFürLccÖkobilanzierung} /></h3>
                <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
                  <p><MdText text={inhalt.texte.inDerLebenszykluskostenrechnungLcc} /></p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.ersatzinvestitionenReinvestitionen} /></span><MdText text={inhalt.texte.fallenZuDenZeitpunkten} /></div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.graueEmissionenEmbodiedCarbon} /></span><MdText text={inhalt.texte.kurzlebigeBauteileZB} /></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ModuleFooter following GEMINI_md */}
      <ModuleFooter
        wikipedia={[
          { title: inhalt.werte.lebensdauerTechnik, url: 'https://de.wikipedia.org/wiki/Lebensdauer_(Technik)' },
          { title: 'Obsoleszenz', url: 'https://de.wikipedia.org/wiki/Obsoleszenz' },
          { title: 'Instandhaltung', url: 'https://de.wikipedia.org/wiki/Instandhaltung' }
        ]}
        regelwerke={inhalt.daten["Lebensdauern.regelwerke"]}
        literatur={inhalt.daten["Lebensdauern.literatur"]}
        formeln={[
          {
            formel: String.raw`\text{ESLC} = \text{RSLC} \cdot A \cdot B \cdot C \cdot D \cdot E \cdot F \cdot G`,
            erklaerung: inhalt.werte.faktorenmethodeNachIso15686,
            quelle: inhalt.werte.dinEnIso15686
          },
          {
            formel: String.raw`N_{\text{Austausch}} = \max\left(0, \left\lceil \frac{t_{\text{Gebäude}}}{\text{ESLC}} \right\rceil - 1\right)`,
            erklaerung: inhalt.werte.berechnungDerAnzahlErforderlicher,
            quelle: inhalt.werte.bnbLeitfadenNachhaltigesBauen
          }
        ]}
      />
    </div>
  );
}
