import { formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Bug, Droplets, ShieldCheck, Sun, ArrowRight, BookOpen, Layers, ShieldAlert, Thermometer, Shield } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { motion } from 'framer-motion';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InlineMath } from 'react-katex';

function WoodThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Holz im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den drei Säulen der Holz-Baustofflehre:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('holz')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Baustoff-Kennwerte</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Anisotropes Quellen/Schwinden (3D-Modell), Holzfestigkeiten (EC5) & Kennwerte.
          </span>
          {current !== 'baustoff' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_holzprodukte')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Holzprodukte & Praxis</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Konstruktionsvollholz, CLT, Vor- und Nachteile & Vorbemessungsrechner.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={() => setActiveTab('holzkorrosion')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Dauerhaftigkeit</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Holzzerstörende Pilze/Insekten, Witterung & baulicher Holzschutz nach DIN 68800.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

const moistureRanges = [
  {
    min: 0,
    max: 12,
    label: 'Darrtrocken bis trocken (Heizklimabereich)',
    level: 'Sicher & geschützt (Kein Befall möglich)',
    colorText: 'text-slate-800',
    colorBg: 'bg-slate-50 border-home-grau/30 text-slate-900',
    badgeColor: 'bg-slate-600 text-white',
    badge: 'u < 12%',
    description: 'Typisches Klima in geheizten Innenräumen (u = 6% - 10%). Biologische Schädlinge (Pilze & holzzerstörende Insekten) sind vollständig inaktiv, da ihnen die lebensnotwendige Grundfeuchtigkeitsumgebung fehlt. Ein absolut sicherer Schutzbereich.',
    pests: [
      { name: 'Schimmel / Bläuepilze', status: 'Inaktiv (Benötigen u > 15-20%)', risk: 'safe' },
      { name: 'Holzzerstörende Pilze', status: 'Inaktiv (Benötigen u > 20%)', risk: 'safe' },
      { name: 'Insektenlarven', status: 'Inaktiv / Überlebensgrenze unterschritten', risk: 'safe' }
    ]
  },
  {
    min: 12,
    max: 20,
    label: 'Trocken- & Übergangsbereich (Grenzbereich)',
    level: 'Pilzsicher, aber potenziell Insektengefahr',
    colorText: 'text-slate-800',
    colorBg: 'bg-slate-50/75 h-full border-home-grau/30 text-slate-900',
    badgeColor: 'bg-slate-600 text-white',
    badge: 'u = 12% - 20%',
    description: 'Klima in unbeheizten Räumen oder gut belüfteten Dachräumen. Holzzerstörende Pilze können sich hier NICHT entwickeln (Schwellenwert u > 20% nicht erreicht). Vorsicht: Einige trockenheitsresistente Insekten wie der Hausbock (ab u = 12%) oder der Gewöhnliche Nagekäfer (ab u = 14%) sind bereits aktiv und können das Holz dauerhaft schädigen!',
    pests: [
      { name: 'Schimmel / Bläuepilze', status: 'Inaktiv', risk: 'safe' },
      { name: 'Holzzerstörende Pilze', status: 'Inaktiv', risk: 'safe' },
      { name: 'Insektenlarven (Hausbock)', status: 'Aktiv (Fressen im Splintholz)', risk: 'danger' }
    ]
  },
  {
    min: 20,
    max: 30,
    label: 'Kritischer Bereich (Fasersättigungsbereich)',
    level: 'Akute Pilzgefahr (Wachstumsschwellen)',
    colorText: 'text-shiraz',
    colorBg: 'bg-off-white border-shiraz/20 text-slate-950',
    badgeColor: 'bg-shiraz text-white',
    badge: 'u = 20% - 30%',
    description: 'Dieser Bereich nähert sich dem Fasersättigungspunkt (ca. 30%). Die Zellwände lagern maximal viel Wasser ein. Erste holzzerstörende Pilze erwachen ab u ≥ 20% (vor allem der extrem gefährliche Echte Hausschwamm) und zersetzen das Holz rasant. Insektenlarven finden perfekte Wachstumsraten.',
    pests: [
      { name: 'Bläuepilze & Schimmel', status: 'Sehr aktiv (Optische Schäden)', risk: 'danger' },
      { name: 'Echter Hausschwamm', status: 'Kritisches Wachstum ab u ≈ 20%', risk: 'danger' },
      { name: 'Hausbock / Holzwurm', status: 'Optimale Fraßbedingungen', risk: 'danger' }
    ]
  },
  {
    min: 30,
    max: 80,
    label: 'Bereich freies Zellwasser (Fäulnis-Maximum)',
    level: 'Katastrophale Fäulnis / Destruktion',
    colorText: 'text-shiraz font-bold',
    colorBg: 'bg-off-white border-shiraz/35 text-slate-950',
    badgeColor: 'bg-shiraz text-white',
    badge: 'u = 30% - 80%',
    description: 'Der Fasersättigungspunkt ist überschritten (u >= 30%) - freies flüssiges Wasser füllt die Zellhohlräume. Dies ist das absolute Optimum für alle echten Holzfäulnispilze (Braunfäule, Kellerschwamm, Blättlinge). Das Holz erleidet innerhalb kürzester Zeit dramatischen Festigkeitsverlust (Würfelbruch).',
    pests: [
      { name: 'Fäulnispilze (Nass-/Braunfäule)', status: 'Wohlfühlbereich / Maximaler Abbau', risk: 'danger' },
      { name: 'Moderfäule', status: 'Besonders aktiv an Erdkontakten', risk: 'danger' },
      { name: 'Insekten / Larven', status: 'Aktiv, bevorzugen leicht feuchtes Holz', risk: 'warn' }
    ]
  },
  {
    min: 80,
    max: 100,
    label: 'Wassergesättigt (Sauerstoffmangel)',
    level: 'Sicher durch O₂-Ausschluss (Konservierung)',
    colorText: 'text-slate-800',
    colorBg: 'bg-slate-150/40 border-home-grau/30 text-slate-900',
    badgeColor: 'bg-slate-705 bg-slate-800 text-white',
    badge: 'u > 80%',
    description: 'Das Holz is vollständig geflutet (z.B. Gründungspfähle unter Grundwasser, Nasslager). Da Wasser kaum Sauerstoff transportiert, ersticken holzzerstörende Pilze und Insekten vollständig aufgrund von akutem Sauerstoffmangel. Das Holz bleibt konserviert. Nur hochspezialisierte, sehr langsame Moderfäulepilze verbleiben minimal aktiv.',
    pests: [
      { name: 'Holzzerstörende Pilze', status: 'Inaktiv (Erstickungsgefahr / O₂-Mangel)', risk: 'safe' },
      { name: 'Insekten', status: 'Inaktiv (Keine Eiablage, ertrunken)', risk: 'safe' },
      { name: 'Moderfäule', status: 'Träge aktiv (toleriert O₂-Mangel)', risk: 'warn' }
    ]
  }
];

export default function Holzkorrosion() {
  const { activeTab, setActiveTab } = useTabContext();
  const [activeSection, setActiveSection] = React.useState<'simulation' | 'schaedlinge' | 'schutz'>('simulation');
  const [woodMoisture, setWoodMoisture] = React.useState<number>(12);

  // Find corresponding moisture range
  const currentRange = moistureRanges.find(r => {
    if (r.max === 100) {
      return woodMoisture >= r.min && woodMoisture <= r.max;
    }
    return woodMoisture >= r.min && woodMoisture < r.max;
  }) || moistureRanges[0];

  const percentOfSaturation = Math.min(100, (woodMoisture / 30) * 100);
  const freeWaterLevel = woodMoisture > 30 ? Math.min(100, ((woodMoisture - 30) / 70) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-wrap gap-2 border-b border-home-grau/20 pb-4 mb-6">
          <button
            onClick={() => setActiveSection('simulation')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeSection === 'simulation'
                ? 'bg-shiraz border-shiraz text-white shadow-md'
                : 'bg-white hover:bg-off-white border-home-grau/30 text-text-main'
            }`}
          >
            <Droplets size={14} />
            <span>Grundlagen & Simulation</span>
          </button>
          <button
            onClick={() => setActiveSection('schaedlinge')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeSection === 'schaedlinge'
                ? 'bg-shiraz border-shiraz text-white shadow-md'
                : 'bg-white hover:bg-off-white border-home-grau/30 text-text-main'
            }`}
          >
            <Bug size={14} />
            <span>Holzschädlinge</span>
          </button>
          <button
            onClick={() => setActiveSection('schutz')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeSection === 'schutz'
                ? 'bg-shiraz border-shiraz text-white shadow-md'
                : 'bg-white hover:bg-off-white border-home-grau/30 text-text-main'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Holzschutz (DIN 68800)</span>
          </button>
        </div>

        <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
          <Bug className="text-shiraz" /> Holzkorrosion (Schädlinge & Holzschutz)
        </h2>
        
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30">
            <p>
              Unter "Korrosion" bei Holz versteht man meist den biologischen Abbau (durch Pilze und Insekten), chemische Zersetzung oder die natürliche Abwitterung (durch UV-Strahlung und Auswaschung). Um die Dauerhaftigkeit von Holzbauteilen zu gewährleisten, ist in den meisten Fällen der bauliche Holzschutz entscheidend.
            </p>
          </div>

          {activeSection === 'simulation' && (
            <>
              {/* SÄULEN DES BIOLOGISCHEN ABBAUS & HOLZFEUCHTE */}
              <section className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl shadow-sm animate-in fade-in duration-300">
                <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-shiraz animate-pulse" />
              <span>Voraussetzungen für den Holzabbau: Sauerstoff, Wasser & Substrat</span>
            </h3>
            
            <p className="text-xs text-slate-700 leading-relaxed mb-5">
              Der biologische Abbau (oft als "Holzkorrosion" bezeichnet) wird durch lebende Organismen verursacht. Damit dieser Schadensprozess verläuft, müssen drei entscheidende Lebensbedingungen zeitgleich erfüllt sein. Fehlt nur ein einziger Faktor, stoppt der Abbau vollständig!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Säule 1 */}
              <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-1.5 transition-all">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-200 text-slate-800 text-xs font-bold rounded-full flex items-center justify-center">1</span>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Nährsubstrat (Holz)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Energiequelle:</strong> Zellulose, Hemizellulose und Lignin dienen Pilzen als hochenergetische Kohlenstoffquelle, Insektenlarven als Eiweiß- und Stärkespender. Im Holzbauteil ist dieses Substrat von Natur aus dauerhaft vorhanden.
                </p>
              </div>

              {/* Säule 2 */}
              <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-1.5 transition-all">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-200 text-slate-800 text-xs font-bold rounded-full flex items-center justify-center">2</span>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Sauerstoff (O₂)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Atmungsgas:</strong> Alle holzzerstörenden Organismen betreiben aeroben Stoffwechsel. Fehlt molekularer Sauerstoff vollständig (z. B. bei permanent geflutetem Holz), ruht die biologische Zersetzung.
                </p>
              </div>

              {/* Säule 3 */}
              <div className="bg-white p-3.5 rounded-xl border border-shiraz/20 shadow-sm flex flex-col gap-1.5 bg-gradient-to-br from-rose-50/15 to-white relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                  <span className="text-xs font-bold text-shiraz uppercase tracking-wide">Holzfeuchte (u)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Der Hauptstellhebel:</strong> Ohne genügend freies Zellwasser können enzymatische Abbauproteine nicht diffundieren. Unter der kritischen Schwelle von <strong>u = 20 %</strong> ist Pilzwachstum physikalisch unmöglich!
                </p>
              </div>
            </div>

            {/* INTERAKTIVER SIMULATOR */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-home-grau/30 pb-5">
                <div className="flex-1 flex flex-col">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <span>Interaktiver Holzfeuchte-Grenzwerte-Simulator</span>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">DIN 68800</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Verschieben Sie den Regler oder wählen Sie ein praktisches Szenario aus, um die biologische Gefährdung und die mikroskopischen Wasserzustände live zu erforschen:
                  </p>
                </div>
                
                {/* Darrfeuchte Formula Callout Box */}
                <div className="shrink-0 max-w-sm w-full lg:w-72 bg-slate-50 p-3 rounded-xl border border-home-grau/30">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">Darrfeuchte-Formel (DIN EN 13183-1)</span>
                  <p className="text-xs text-slate-700 mb-2 leading-relaxed">
                    Die Holzfeuchte <InlineMath math="\omega" /> (in der Holzpraxis auch als <InlineMath math="u" /> bezeichnet) bezieht sich immer auf das <strong>Darrgewicht</strong> (Trockenmasse) und kann über 100 % liegen:
                  </p>
                  <div className="bg-white py-1.5 px-3 rounded border border-home-grau/30 text-center">
                    <InlineMath math="\omega = \frac{m_1 - m_0}{m_0} \cdot 100 \ [\%]" />
                  </div>
                  <div className="text-xs text-slate-550 mt-1.5 flex flex-col gap-0.5 leading-normal">
                    <span>• <InlineMath math="\omega" /> = Holzfeuchte / Feuchtegehalt in %</span>
                    <span>• <InlineMath math="m_1" /> = Masse der feuchten Probe vor dem Trocknen (g)</span>
                    <span>• <InlineMath math="m_0" /> = Masse der absolut trockenen Probe (Darrgewicht) (g)</span>
                  </div>
                </div>
              </div>

              {/* Slider Controller */}
              <div className="flex flex-col gap-3 py-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Holzfeuchte (u) wählen:</span>
                  <div className="flex items-baseline gap-1 font-mono text-3xl font-black text-shiraz">
                    <span>{formatDeWert(woodMoisture)}%</span>
                    <span className="text-xs font-bold text-slate-550">(u)</span>
                  </div>
                </div>

                <div className="relative pt-1 px-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={woodMoisture}
                    onChange={(e) => setWoodMoisture(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none accent-shiraz bg-slate-100 border border-home-grau/30"
                  />
                  {/* Critical markers */}
                  <div className="flex justify-between text-xs font-bold text-slate-500 mt-1.5">
                    <span>0% (Fasertrockon)</span>
                    <span className="text-slate-500">12% (UGL innen)</span>
                    <span className="text-slate-650">20% (Pilzgrenze)</span>
                    <span className="text-shiraz animate-pulse">30% (Fasersättigung)</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Schnellwahl Tasten */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                  {[
                    { val: 8, label: '🏜️ Innenraum (8%)' },
                    { val: 15, label: '🌫️ Dachstuhl (15%)' },
                    { val: 24, label: '🌧️ Bewittert (24%)' },
                    { val: 45, label: '💦 Staunässe (45%)' },
                    { val: 95, label: '🌊 Geflutet (95%)' }
                  ].map(btn => (
                    <button
                      key={btn.val}
                      onClick={() => setWoodMoisture(btn.val)}
                      className={`px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all text-center ${
                        woodMoisture === btn.val 
                          ? 'bg-shiraz border-shiraz text-white shadow scale-[1.01]'
                          : 'bg-slate-50 hover:bg-slate-100 border-home-grau/30 text-slate-700'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time micro graphic block */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-baseline gap-2 justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mikroskopische Zellstrukturen (Zellwände vs. Hohlräume):</span>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {woodMoisture <= 30 
                      ? `Nur gebundenes Zellwandwasser (${formatDeWert(Math.round(percentOfSaturation))}%)` 
                      : `Zellwand gesättigt + Freies Wasser im Zellhohlraum (+${formatDeWert(Math.round(freeWaterLevel))}%)`}
                  </span>
                </div>
                
                <div className="relative h-16 w-full flex items-center justify-center bg-slate-50 border border-home-grau/30 rounded-lg overflow-hidden">
                  <svg className="w-full h-full max-w-sm" viewBox="0 0 350 70">
                    {/* Draw three hexagonal cells */}
                    {/* Left Cell */}
                    <polygon 
                      points="40,10 90,10 115,35 90,60 40,60 15,35" 
                      className="transition-colors duration-300"
                      fill={woodMoisture > 30 ? `rgba(255, 3, 80, 0.08)` : "transparent"} 
                      stroke={woodMoisture <= 30 ? "rgb(150, 150, 150)" : "var(--color-amber-800)"}
                      strokeWidth={woodMoisture <= 30 ? 3 + (percentOfSaturation/15) : 5}
                    />
                    {/* Center Cell */}
                    <polygon 
                      points="140,10 190,10 215,35 190,60 140,60 115,35" 
                      className="transition-colors duration-300"
                      fill={woodMoisture > 30 ? `rgba(255, 3, 80, 0.08)` : "transparent"} 
                      stroke={woodMoisture <= 30 ? "rgb(150, 150, 150)" : "var(--color-amber-800)"}
                      strokeWidth={woodMoisture <= 30 ? 3 + (percentOfSaturation/15) : 5}
                    />
                    {/* Right Cell */}
                    <polygon 
                      points="240,10 290,10 315,35 290,60 240,60 215,35" 
                      className="transition-colors duration-300"
                      fill={woodMoisture > 30 ? `rgba(255, 3, 80, 0.08)` : "transparent"} 
                      stroke={woodMoisture <= 30 ? "rgb(150, 150, 150)" : "var(--color-amber-800)"}
                      strokeWidth={woodMoisture <= 30 ? 3 + (percentOfSaturation/15) : 5}
                    />
                    
                    {/* Labels inside hexagonal holes */}
                    <text x="65" y="40" className="text-xs font-sans font-bold fill-slate-700 text-center" textAnchor="middle">
                      {woodMoisture > 30 ? 'Freies Wasser' : 'Zellwand'}
                    </text>
                    <text x="165" y="40" className="text-xs font-sans font-bold fill-slate-700 text-center" textAnchor="middle">
                      {woodMoisture > 30 ? 'Poren gefüllt' : 'Quellwasser'}
                    </text>
                    <text x="265" y="40" className="text-xs font-sans font-bold fill-slate-700 text-center" textAnchor="middle">
                      {woodMoisture > 30 ? 'Freies Wasser' : 'Zellwand'}
                    </text>
                  </svg>
                  
                  {/* Floating drops overlay */}
                  {woodMoisture > 30 && (
                    <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden h-full flex justify-around">
                      <motion.div animate={{ y: [60, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }} className="w-1.5 h-1.5 rounded-full bg-slate-400 absolute left-[15%]" />
                      <motion.div animate={{ y: [60, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut', delay: 0.5 }} className="w-2 h-2 rounded-full bg-slate-400 absolute left-[45%]" />
                      <motion.div animate={{ y: [60, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut', delay: 1.1 }} className="w-1.5 h-1.5 rounded-full bg-slate-400 absolute left-[75%]" />
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-slate-500 italic text-center">
                  {woodMoisture <= 30 
                    ? "Bis ca. 30 % (Fasersättigung) lagert Wasser sich ausschließlich in den Zellwänden an. Das Holz quillt auf. Pilzwachstum ist physikalisch unmöglich oder extrem gehemmt. Zellhohlräume bleiben trocken."
                    : "Über 30 %: Die Zellwände können kein Wasser mehr binden. Überschüssiges Wasser lagert sich frei flüssig in den Zellhohlräumen ab. Das ideale Diffusionsmedium für Pilzenzyme!"}
                </p>
              </div>

              {/* Real-time Status Details */}
              <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors duration-300 ${currentRange.colorBg}`}>
                <div className="flex items-start md:items-center justify-between gap-3 flex-col md:flex-row">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60">Gefährdungspotenzial bei u = {formatDeWert(woodMoisture)}%:</span>
                    <strong className="text-sm md:text-base font-bold leading-tight">{currentRange.label}</strong>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full text-center ${currentRange.badgeColor} shrink-0`}>
                    {currentRange.level}
                  </span>
                </div>

                <p className="text-xs leading-relaxed opacity-90 border-t border-home-grau/30 pt-2.5">
                  {currentRange.description}
                </p>

                {/* Sub-pests checklist */}
                <div className="flex flex-col gap-2 mt-1 border-t border-home-grau/30 pt-2.5">
                  <span className="text-xs font-bold uppercase tracking-wide opacity-75">Status der Hauptschädlinge:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                    {currentRange.pests.map((pest, pidx) => (
                      <div key={pidx} className="bg-white/60 backdrop-blur-xs p-3 rounded-lg border border-home-grau/30 flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-800">{pest.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            pest.risk === 'safe' 
                              ? 'bg-slate-400' 
                              : pest.risk === 'warn' 
                                ? 'bg-slate-600' 
                                : 'bg-shiraz animate-pulse'
                          }`}></span>
                          <span className="text-xs text-slate-700 font-medium">{pest.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {activeSection === 'schaedlinge' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* Biotische Schädigungen (Organismen) nach Folienserie Holzschutz F 10 - F 18 */}
          <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl shadow-sm text-xs leading-relaxed space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-home-grau/15 pb-2 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-shiraz" />
                <span>Biotische Schadensverursacher: Holzzerstörende Pilze (F 10, F 11, F 12, F 13)</span>
              </h3>
              <p className="text-text-main/70 mt-2">
                Pilze benötigen für ihren enzymatischen Stoffwechsel Sauerstoff, ein Nährsubstrat (Kohlenstoffquellen) und eine erhöhte Holzfeuchte (<span className="font-mono font-semibold text-shiraz">u &gt; 20 %</span>, Fasertrockengrenze). Sie bauen die Zellwandbestandteile ab oder besiedeln das Zelllumen:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-2">
                <span className="text-xs font-extrabold uppercase bg-red-100 text-red-800 px-1.5 py-0.5 rounded">Fäuletyp 1</span>
                <h4 className="font-extrabold text-slate-800 text-xs">Braunfäule (Destruktionsfäule)</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Mikropilze bauen vorwiegend die helle <strong>Cellulose</strong> ab, das dunkelbraune Ligningerüst bleibt nahezu unberührt. Das Holz verliert massiv an Tragfähigkeit, schrumpft spröde und zeigt das typische Schadbild des <strong>Würfelbruchs</strong> (Risse längs und quer zur Faser). 
                </p>
                <div className="text-xs text-slate-500 italic border-t border-slate-100 pt-1">
                  <strong>Hauptvertreter:</strong> Echter Hausschwamm (<em>Serpula lacrymans</em> - besitzt exzellente Wasserleitungsmyzelien zur Fernbefeuchtung und Mauerwerkspenetration), Kellerschwamm (<em>Coniophora puteana</em>).
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-2">
                <span className="text-xs font-extrabold uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">Fäuletyp 2</span>
                <h4 className="font-extrabold text-slate-800 text-xs">Weißfäule (Korrosionsfäule)</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Pilze zerlegen gleichzeitig das dunkle <strong>Lignin</strong> und die Cellulose mittels oxidativer Enzyme (Ligninasen). Das Holz verfärbt sich weißgelb, wird faserig-weich, verliert an Rohdichte und bricht nicht würfelnd, sondern splittert faserig aus (<strong>Faserbruch</strong>). Tritt primär bei Laubhölzern auf.
                </p>
                <div className="text-xs text-slate-500 italic border-t border-slate-100 pt-1">
                  <strong>Hauptvertreter:</strong> Schmetterlingstramete, Ausgebreiteter Hausporling, zersetzt Tragzäune und feuchte Außenkonstruktionen im Erdkontakt.
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-2">
                <span className="text-xs font-extrabold uppercase bg-amber-100 text-shiraz px-1.5 py-0.5 rounded">Fäuletyp 3</span>
                <h4 className="font-extrabold text-slate-800 text-xs">Moderfäule (Soft Rot)</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Schadform unter extremen Nassbedingungen (<strong>Gebrauchsklasse 4</strong>), z.B. bei permanentem Erdkontakt oder Süßwasserberührung. Mikroskopisch winzige Pilzschläuche fressen Kavernen direkt in die Sekundärwände der Holzzellen. Das Holz erweicht oberflächlich und verfällt schlammig-schwarz.
                </p>
                <div className="text-xs text-slate-500 italic border-t border-slate-100 pt-1">
                  <strong>Hauptvertreter:</strong> Ascomyceten und Fungi imperfecti. Hohe Widerstandsfähigkeit gegen herkömmliche Schutzsalze und Sauerstoffarmut am Baugrund.
                </div>
              </div>
            </div>

            {/* Holzverfäbende Organismen */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Holzverfärbende Organismen &amp; Bakterien (F 11)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-normal">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block">Bläuepilze (z.B. Aureobasidium)</span>
                  <p>
                    Besiedeln ausschließlich das Zelllumen und nähren sich von Zellinhaltsstoffen (Stärke, Eiweiß, Zucker). Sie zerstören die tragenden Zellwände <strong>nicht</strong> (kein direkter Festigkeitsverlust). <strong>Achtung:</strong> Die Myzelien bohren Düsenkanäle durch die Hoftüpfel. Das erhöht die kapillare Wasseraufnahmefähigkeit drastisch und bereitet den Boden für Fäulnispilze!
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block">Schimmelpilze (Penicillium u.a.)</span>
                  <p>
                    Erzeugen einen farbigen Oberflächenrasen auf nassem Holz. Verursachen keine Festigkeitseinbußen, signalisieren jedoch akute Feuchtigkeitsfehler (Frischbetonausgasungen, Leckagen) und setzen gesundheitsschädliche, allergene Sporen frei.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block">Bakterien</span>
                  <p>
                    Bauen extrem langsam die Tüpfelmembranen (Kopplungsventile der Holzzellen) ab. Dies erhöht die kapillare Wasserpermeabilität langgelagerter Hölzer (z.B. im Telegrafenmast- und Wasserbau), verbessert aber im Gegenzug die spätere Kesseldruck-Imprägnierbarkeit schwieriger Holzarten wie der Fichte.
                  </p>
                </div>
              </div>
            </div>

            {/* Holzzerstörende Insekten nach F 14 - F 18 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-home-grau/15 pb-2 flex items-center gap-2">
                <Bug className="w-4 h-4 text-shiraz" />
                <span>Holzzerstörende Insekten: Trockenholzinsekten &amp; Termiten (F 14 - F 18)</span>
              </h3>
              <p className="text-text-main/70">
                Insektenlarven fressen sich durch das Holz und verwerten die organischen Stoffe (Stärke, Eiweiß, Cellulose). Sie benötigen weitaus geringere Holzfeuchtigkeiten als Pilze (oft bereits aktiv ab <span className="font-mono font-semibold text-slate-800">u ≥ 12 %</span>):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 text-xs">Hausbock (<em>Hylotrupes bajulus</em>)</h4>
                  <span className="text-xs font-mono text-red-650 bg-red-50 px-1 py-0.5 rounded font-bold block w-max">Gefährlichster Schädling</span>
                  <p className="text-xs text-slate-600 leading-normal">
                    Befällt bevorzugt das proteinreiche <strong>Splintholzgürtelvolumen</strong> trockener Nadelhölzer (Fichte, Kiefer, Tanne). Die Larve frisst bis zu 10 Jahre im Inneren, während die Holzoberfläche intakt bleibt (<strong>hauchdünne Papierhaut</strong>). Der Befall bleibt oft bis zum statischen Versagen im Dachstuhl unentdeckt.
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    <strong>Merkmale:</strong> Ovale Ausflugslöcher (3 x 6 mm), raspelndes Fraßgeräusch der Larven bei Stille vernehmbar.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 text-xs">Gewöhnlicher Nagekäfer</h4>
                  <span className="text-xs font-mono text-slate-600 bg-slate-55 px-1 py-0.5 rounded font-bold block w-max">Volksmund: "Holzwurm"</span>
                  <p className="text-xs text-slate-600 leading-normal">
                    Befällt Splint- und Kernholz von Laub- und Nadelholz. Findet sich bevorzugt in feuchteren Kellerräumen, Kirchen, Dielenböden und Möbeln. Benötigt eine Mindestholzfeuchte von <span className="font-semibold text-slate-800">u &gt; 14 %</span>; in darrtrockenen, beheizten Wohnräumen erlischt der Befall von selbst.
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    <strong>Merkmale:</strong> Kreisförmige Ausflugslöcher (1 - 2 mm Durchmesser), feinkörniges Bohrmehl mit Kotpillen.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 text-xs">Splintholzkäfer (<em>Lyctus</em>)</h4>
                  <span className="text-xs font-mono text-amber-655 bg-off-white px-1 py-0.5 rounded font-bold block w-max">Geringfeldig trockenresistent</span>
                  <p className="text-xs text-slate-600 leading-normal">
                    Befällt stärkereiches, offenporiges Laubholz (Eiche, Esche, Nussbaum, Tropenholz). Die Larven fressen das tragende Splintholz vollständig zusammen und verwandeln es im Laufe der Generationen im Bauteilinneren zu pudrigem, strukturlosen Mehl (<strong>Puderholz</strong>).
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    <strong>Merkmale:</strong> Runde Fluglöcher (1 - 1,5 mm), mehlfeines Fraßmehl rieselt aktiv bei Erschütterung heraus.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 text-xs">Sonderlinge &amp; Termiten</h4>
                  <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded font-bold block w-max">F 14 / F 15 / F 17</span>
                  <p className="text-xs text-slate-600 leading-normal">
                    <strong>Termiten (Isoptera):</strong> Erdbewohnende oder feuchtholzbewohnende Termiten fressen Holz lichtscheu von innen aus und verstopfen Hohlräume mit Lehm/Kot. Im Küstenwasser kommen zudem <strong>Meerwasserschädlinge</strong> (F 17) wie die Bohrmuschel (<em>Teredo navalis</em>) und die Bohrassel hinzu, welche tragende Hafenanlegestege durchnässen.
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    <strong>Weitere:</strong> Ameisen bewohnen marodes Holz, Holzwespen befallen nur frisch gefälltes Waldholz.
                  </p>
                </div>
              </div>
            </div>

            {/* Abiotische Schädigungen nach F 19 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-home-grau/15 pb-2 flex items-center gap-2">
                <Sun className="w-4 h-4 text-shiraz" />
                <span>Abiotische Schädigungsfaktoren am Bauholz (F 19)</span>
              </h3>
              <p className="text-text-main/70">
                Nicht-biologische Zerstörungsmechanismen greifen die Holzoberfläche chemisch-physikalisch an und schwächen die Schutzwirkung gegenüber Feuchtigkeitseintrag:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-600">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <strong className="block text-slate-800 mb-1 font-extrabold">UV-Strahlung (Sonne)</strong>
                  Photochemischer Abbau des Bindeglieds <strong>Lignin</strong>. UV-Licht spaltet die Molekülketten der Holzoberfläche in wasserlösliche Abbauprodukte auf. Das Holz verfärbt sich zunächst gelbbraun bis tiefdunkelbraun.
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <strong className="block text-slate-800 mb-1 font-extrabold">Niederschlag &amp; Auswaschung</strong>
                  Regenwasser wäscht die durch UV-Strahlung zersetzten Ligninkomponenten von der Oberfläche ab. Zurück bleibt das silbergraue, widerstandsfähige Cellulosegerüst (<strong>graue Patina</strong>). Abtragungsgeschwindigkeit: ca. 0,1 mm/Jahr.
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <strong className="block text-slate-800 mb-1 font-extrabold">Thermischer Einfluss</strong>
                  Lang anhaltend hohe Temperaturen (über 60°C) trocknen das Holz dauerhaft aus und spalten flüchtige organische Holzbestandteile ab. Dies beeinträchtigt elastische Tragfähigkeiten. Bei Temperaturen über 100°C beginnt die Zersetzung (Pyrolyse).
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <strong className="block text-slate-800 mb-1 font-extrabold">Chemischer &amp; Mechanischer Angriff</strong>
                  Schlagregen und Wind-Sand-Erosion schleifen verwitterte Holzoberflächen ab. Starke Säuren oder Alkalien bewirken Hydrolysereaktionen der Hemicellulosen (Säurefraß/Laugenfraß), was die Holzfasern irreversibel ablöst.
                </div>
              </div>
            </div>

            {/* Biozidgesetzgebung und Nationale Zulassung (F 52 - F 55, F 59 - F 60) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xxs space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Biozid-Zulassungsverfahren &amp; Gesetzgebung (F 52 - F 55, F 59 - F 60)</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Holzschutzmittel (HSM), die schädigende Zielorganismen chemisch bekämpfen, unterliegen strengen umwelt- und gesundheitsrechtlichen Auflagen. Sie fallen unter die europäische <strong>Biozidprodukte-Verordnung (BPR, Verordnung (EU) Nr. 528/2012)</strong>. Die Zulassung erfolgt in einem zweistufigen Verfahren:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  <strong className="text-slate-800 block mb-1">Stufe 1: Wirkstoffgenehmigung (EU-Ebene)</strong>
                  <p className="leading-relaxed text-slate-500">
                    Die Europäische Chemikalienagentur (ECHA) bewertet die chemischen Wirkstoffe auf Toxizität, Ökotoxizität und Wirksamkeit. Nur positiv beschlossene und im Register (Union List) aufgeführte chemische Wirkstoffe dürfen für HSM verwendet werden.
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  <strong className="text-slate-800 block mb-1">Stufe 2: Produktzulassung (National)</strong>
                  <p className="leading-relaxed text-slate-500">
                    Für das verkaufsfertige Präparat ist eine spezifische Registrierung im jeweiligen Mitgliedstaat erforderlich (in Deutschland koordiniert durch die Bundesanstalt für Arbeitsschutz und Arbeitsmedizin - BAuA). Für tragende Holzkonstruktionen verlangt das Bauordnungsrecht zusätzlich eine <strong>allgemeine bauaufsichtliche Zulassung (abZ)</strong> durch das DIBt.
                  </p>
                </div>
              </div>
            </div>

            {/* Altholzkategorien & Entsorgung nach AltholzV (F 58) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xxs space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Abfallrechtliche Entsorgung von schutzbehandeltem Altholz (F 58)</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Abgebautes Holz, das mit Holzschutzmitteln oder halogenorganischen Verbindungen behandelt wurde, kann gefährlicher Abfall sein (Altholz A IV: AVV 17 02 04*). Gemäß der deutschen <strong>Altholzverordnung (AltholzV, Novelle in Vorbereitung)</strong> sind vier Altholzkategorien definiert, deren Entsorgungs- und Recyclingwege intensiv reglementiert sind:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-600">
                <div className="p-3 border border-slate-200 bg-emerald-50/20 rounded-lg">
                  <strong className="text-emerald-800 block mb-0.5">Kategorie A I</strong>
                  <span className="text-xs text-slate-400 block mb-1 leading-none font-mono">Naturbelassenes Holz</span>
                  <p className="leading-relaxed text-slate-500 text-xs">
                    Lediglich mechanisch bearbeitetes Holz ohne Fremdstoffbelastungen. Uneingeschränkt stofflich verwertbar (z.B. Spanplattenindustrie).
                  </p>
                </div>
                <div className="p-3 border border-slate-200 bg-slate-50 rounded-lg">
                  <strong className="text-slate-700 block mb-0.5">Kategorie A II</strong>
                  <span className="text-xs text-slate-400 block mb-1 leading-none font-mono">Verleimtes Holz</span>
                  <p className="leading-relaxed text-slate-500 text-xs">
                    Behandeltes Holz ohne halogenorganische Verbindungen in der Beschichtung und ohne Holzschutzmittel (z.B. Innentüren, Verschnitte).
                  </p>
                </div>
                <div className="p-3 border border-slate-200 bg-slate-50 rounded-lg">
                  <strong className="text-slate-700 block mb-0.5">Kategorie A III</strong>
                  <span className="text-xs text-slate-400 block mb-1 leading-none font-mono">Beschichtetes Holz</span>
                  <p className="leading-relaxed text-slate-500 text-xs">
                    Hölzer mit halogenorganischen Beschichtungen (z.B. PVC-Folien, Lacke) aber ohne Holzschutzmittelbelastung.
                  </p>
                </div>
                <div className="p-3 border border-red-200 bg-red-50/20 rounded-lg">
                  <strong className="text-red-700 block mb-0.5">Kategorie A IV</strong>
                  <span className="text-xs text-red-500 block mb-1 leading-none font-semibold font-mono flex items-center gap-1">⚠️ Gefährlicher Abfall</span>
                  <p className="leading-relaxed text-slate-500 text-xs">
                    <strong>Imprägniertes Abbruchholz:</strong> Enthält nachweislich oder mutmaßlich HSM (z.B. Leitungsmasten, Bahnschwellen, Zäune). Stoffliche Verwertung nur sehr eingeschränkt (z. B. Herstellung von Aktivkohle/Industrieholzkohle); in der Regel <strong>energetische Verwertung</strong> in nach 17. BImSchV zugelassenen Anlagen mit Abgasreinigung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'schutz' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* DIN 68800 Regelwerk nach F 20 - F 26 */}
          <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl shadow-sm text-xs leading-relaxed space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-home-grau/15 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-shiraz" />
                <span>Primat des baulichen Holzschutzes &amp; Gebrauchsklassen (DIN 68800-1 u. -2)</span>
              </h3>
              <p className="text-text-main/70 mt-2">
                Die nationale Normenreihe <strong>DIN 68800</strong> (Teil 1:2019-06, Teil 2:2022-02, Teil 3:2020-03, Teil 4:2020-12) gibt baulichen Maßnahmen ausdrücklich Vorrang vor Bioziden. Das primäre Entwurfsziel des Tragwerksplaners lautet: <strong>Fernhalten von Feuchtigkeit durch konstruktiven Holzschutz</strong>. Nur wenn bauliche Maßnahmen nachweislich nicht ausreichen, darf chemischer Holzschutz in Erwägung gezogen werden.
              </p>
            </div>

            {/* BAULICHER HOLZSCHUTZ DETAILBLÖCKE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-xxs">
                <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                  <span className="w-4 h-4 bg-emerald-100 text-emerald-800 text-xs rounded-full flex items-center justify-center font-bold">1</span>
                  Konstruktives Feuchtemanagement
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                  <li><strong>Spritzwasserschutz:</strong> Bauteilsockel mindestens 30 cm über Geländeoberkante planieren, Einsatz von Stahlschuhen für Tragstützen.</li>
                  <li><strong>Wasserableitung:</strong> Dachüberstände dimensionieren, Abtropfkanten fräsen, waagerechte Anschlüsse mit Mindestgefälle (≥ 2 %) versehen.</li>
                  <li><strong>Freie Lüftung:</strong> Hinterlüftungen bei Außenwandbekleidungen anlegen, um Kondensations- und Kriechfeuchte abzuführen (Feuchtestaustopp).</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-xxs">
                <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                  <span className="w-4 h-4 bg-emerald-100 text-emerald-800 text-xs rounded-full flex items-center justify-center font-bold">2</span>
                  Ausschreibung natürlicher Dauerhaftigkeit
                </h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Einsatz von Splintholz-freiem Kernholz natürlich dauerhafter Holzarten nach <strong>DIN EN 350:2016-12</strong>. Dadurch lässt sich oft eine risikofreie Einstufung erzielen:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-500 space-y-0.5 pl-1">
                  <li><strong>Eiche (Klasse 2 bis 4 nach EN 350:2016):</strong> Dauerhaft bis wenig dauerhaft; Kernholz bewährt für Fachwerk mit konstruktivem Schutz.</li>
                  <li><strong>Lärche / Douglasie (Klasse 3-4):</strong> Mäßig dauerhaft, geeignet für Außen-Fassadenverschalungen ohne Erdkontakt.</li>
                  <li><strong>Fichte / Tanne (Klasse 4):</strong> Wenig dauerhaft, ungeschützt im Außenbereich nicht standsicher einsetzbar.</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-xxs">
                <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                  <span className="w-4 h-4 bg-emerald-100 text-emerald-800 text-xs rounded-full flex items-center justify-center font-bold">3</span>
                  Holzmodifikation (Innovative Werkstoffe)
                </h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Verbesserung der biologischen Dauerhaftigkeit und Verminderung des Quell-/Schwindverhaltens ohne den Einsatz umweltschädlicher Biozide:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-500 space-y-0.5 pl-1">
                  <li><strong>Thermoholz (TMT):</strong> Kontrollierte Pyrolyse bei 180°C bis 220°C unter Sauerstoffmangel. Baut Hemicellulosen ab, wodurch Pilzen der Nährboden entzogen wird.</li>
                  <li><strong>Acetyliertes Holz (Accoya):</strong> Reaktion mit Essigsäureanhydrid blockiert die freien Hydroxygruppen der Zellwand. Das Holz kann kaum noch Quellwasser einlagern.</li>
                </ul>
              </div>
            </div>

            {/* MATRIXTABELLE: GEBRAUCHSKLASSEN (GK) NACH DIN 68800-1 (F 24 - F 26) */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xxs">
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Normmatrix der Gebrauchsklassen (GK) nach DIN 68800-1</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Die Zuordnung entscheidet zwingend über die Zulässigkeit, das Gefährdungsspektrum und die Notwendigkeit von Schutzvorkehrungen:
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                      <th className="p-2 w-[15%]">Gebrauchsklasse</th>
                      <th className="p-2 w-[25%] text-slate-800">Klima &amp; Einbaubedingung</th>
                      <th className="p-2 w-[25%] text-slate-800">Hauptgefährdung &amp; Organismus</th>
                      <th className="p-2 w-[35%] text-slate-800">Empfohlene Schutzmaßnahme / Chemische Relevanz</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-650">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 0</td>
                      <td className="p-2">Innenräume, dauerhaft trocken (<span className="font-semibold">u ≤ 20 %</span>), allseitig mechanisch abgedeckt.</td>
                      <td className="p-2">Keine (Inaktivität aller holzabbauenden Schädlinge).</td>
                      <td className="p-2 text-slate-700 font-semibold bg-emerald-50/30">Einsatz von trockenem Holz (u ≤ 20 %). Chemischer Holzschutz ist weder erforderlich noch vorgesehen.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 1</td>
                      <td className="p-2">Innenräume, dauerhaft trocken (<span className="font-semibold">u ≤ 20 %</span>), nicht bewittert, Splintholz liegend.</td>
                      <td className="p-2">Holzzerstörende Insekten (Hausbock, Gewöhnlicher Nagekäfer).</td>
                      <td className="p-2 text-slate-700">Trockenes Holz einbauen. Bei Splintholzanteilen vorbeugender Insektenschutz (Prüfprädikat Iv) falls unzugänglich.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 2</td>
                      <td className="p-2">Überdacht, keine direkte Bewitterung, aber gelegentlich erhöhte Feuchtigkeit möglich.</td>
                      <td className="p-2">Holzzerstörende Insekten sowie Pilze (Insekten- und Pilzrisiko).</td>
                      <td className="p-2 text-slate-700">Konstruktiver Schutz zur Vermeidung längerfristiger Feuchtigkeitsnester. Vorbeugender Schutz (Prüfprädikat P u. Iv).</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 3.1</td>
                      <td className="p-2">Außen, frei bewittert, ohne Erdkontakt. <span className="font-semibold">Schwach beansprucht</span> (Wasser kann rasch abfließen).</td>
                      <td className="p-2">Insekten sowie holzzerstörende Fäulnispilze (Braun- und Weißfäule).</td>
                      <td className="p-2 text-slate-700">Widerstandsfähige Kernhölzer oder vorbeugende auswaschbeständige Holzschutzmittel (Prüfprädikat P, Iv, W).</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 3.2</td>
                      <td className="p-2">Außen, frei bewittert, ohne Erdkontakt. <span className="font-semibold">Stark beansprucht</span> (Feuchtigkeitsansammlungen möglich).</td>
                      <td className="p-2">Pilze (akute Fäulnisgefahr im Bohrloch- oder Verbindungsquerschnitt).</td>
                      <td className="p-2 text-slate-700 font-semibold text-shiraz">Dauerhafte Hölzer (DK 1-2) o. intensiv wirksamer chemischer Schutz erforderlich. Schutzmittelprüfschema nach EN 113 &amp; EN 152.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 4</td>
                      <td className="p-2">Ständiger Erdkontakt und/oder permanenter Süßwasserkontakt (z.B. Pfähle).</td>
                      <td className="p-2">Moderfäule (Soft Rot), holzzerstörende Braun- und Weißfäulepilze.</td>
                      <td className="p-2 text-slate-700 font-semibold text-shiraz">Kernholz der Dauerhaftigkeitsklasse 1 oder Kesseldrucktränkung mit Mittel mit Prüfprädikat E (Erdkontakt) erforderlich.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold text-slate-800">GK 5</td>
                      <td className="p-2">Ständiger Salzwasser-/Meerwasserkontakt (Hafen- und Küstenbauten).</td>
                      <td className="p-2">Meerwasserschädlinge (Bohrmuschel <em>Teredo navalis</em>, Bohrassel).</td>
                      <td className="p-2 text-slate-700 font-semibold">Höchstmöglich dosierter Kesseldruckschutz mit speziellem Kupfer-Salz-Wirkstoffmix für marine Zonen.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CHEMISCHER HOLZSCHUTZ: WIRKSTOFFBASEN & PRÜFPRÄDIKATE (F 27 - F 35) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Einteilung von Holzschutzmitteln &amp; Prüfprädikate (F 27, F 28, F 33)</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Holzschutzmittel (HSM) sind Biozidprodukte, die europäischen Biozid-Verordnungen (<strong>BPR / Register der Biocidal Products Regulation EU Nr. 528/2012</strong>) unterliegen. Sie werden nach Verwendungszweck (vorbeugend vs. bekämpfend) und Wirkstoffgruppe klassifiziert:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/50 font-mono">
                  <div>
                    <span className="font-extrabold text-slate-800 flex items-center gap-1">Prüfkennzeichen:</span>
                    <span>• <strong>Iv</strong>: Vorbeugend gegen Insekten</span>
                    <span>• <strong>P</strong>: Vorbeugend gegen Pilze</span>
                    <span>• <strong>W</strong>: Auswaschbeständig (Witterung)</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-800 flex items-center gap-1">Sonderkennzeichen:</span>
                    <span>• <strong>E</strong>: Extrem auswaschfest (Erdkontakt)</span>
                    <span>• <strong>Ib</strong>: Bekämpfend gegen Insekten</span>
                    <span>• <strong>M</strong>: Gegen Hausschwamm (Mauerwerk)</span>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <p><strong>Einteilung nach Vermarktungsform:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-500 pl-1">
                    <li><strong>Wässrige Schutzsalze:</strong> z.B. Kupfer-HDO oder Borate (Vorteil: hohe Diffusionstiefe; Nachteil: reine Borate sind auswaschbar und daher nur bis GK 2 zulässig).</li>
                    <li><strong>Lösemittelbasierte Mittel:</strong> Häufig dünnschichtige, organische Wirkstofflasuren für den maßhaltigen Bauteilschutz (Fenster, Außentüren, F 32).</li>
                    <li><strong>Emulsionen:</strong> Moderne wasserbasierte Bindemittelsysteme mit mikrodispergierten Wirkstoffnanopartikeln.</li>
                  </ul>
                </div>
              </div>

              {/* TECHNIKEINFÜHRUNG: IMPRÄGNIERVERFAHREN (F 40 - F 46) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xxs space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Applikations- &amp; Imprägnierverfahren (F 40 - F 46)</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Die Schutzwirkung hängt elementar von der erreichten Eindringtiefe (<strong>Penetrationsklassen NP1 bis NP6</strong> nach EN 351-1) ab. Man unterscheidet Druckverfahren von Nichtdruckverfahren:
                </p>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="p-2 border-l-2 border-shiraz bg-off-white/20 rounded">
                    <strong>1. Kesseldruckimprägnierung (KVD):</strong>
                    <p className="text-slate-500 text-xs mt-0.5 leading-normal">
                      Vakuum zieht Luft und freies Zellwasser vollständig aus den äußeren Holzkapillaren heraus. Danach wird das schützende Salzgemisch unter hohem, langanhaltendem Überdruck (8 bis 10 bar) tief in das Splintholz hineingepresst. Erreicht Penetrationsklasse <span className="font-mono font-bold">NP5 - NP6</span>. Unabdingbar für die GK 4.
                    </p>
                  </div>
                  <div className="p-2 border-l-2 border-slate-405 border-l-slate-400 bg-slate-50 rounded">
                    <strong>2. Wechseldruckverfahren (WD) &amp; Doppelvakuum (DV):</strong>
                    <p className="text-slate-500 text-xs mt-0.5 leading-normal">
                      <strong>Doppelvakuumverlegung (DV)</strong> nutzt organisch gelöste Wirkstoffe ohne Wasserzufuhr zur Imprägnierung maßhaltiger Fensterteile, um Quellverformungen auszuschließen. <strong>Wechseldruckimprägnierung (WD)</strong> wechselt rasch zwischen Vakuum und Druck zur Tränkung waldfrischer, saftreicher Fichtenmasten.
                    </p>
                  </div>
                  <div className="p-2 border-l-2 border-slate-405 border-l-slate-400 bg-slate-50 rounded">
                    <strong>3. Nichtdruckverfahren:</strong>
                    <p className="text-slate-500 text-xs mt-0.5 leading-normal">
                      Trogtränkung (Einlagern des Holzes über Stunden), Tauchen (Sekunden/Minuten), Sprühen und manuelles Streichen. Erreichen meist nur Oberflächenschutz (<span className="font-mono">NP1</span>). <strong>Lokale Spezialverfahren</strong> (F 32) beinhalten die mechanische Bohrlochdrucktränkung oder Heißluftaufwärmung zur biologischen Bekämpfung bei akutem Hausbockbefall.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Penetrations- und Eindringtiefe-Kriterien (EN 351-1 & F 47-F 48) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xxs space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Eindringtiefe &amp; Penetrationsklassen nach EN 351-1</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Die Qualität einer chemischen Schutzbehandlung wird maßgeblich durch die Eindringtiefe der bioziden Wirkstoffe bestimmt. Die DIN EN 351-1 definiert standardisierte <strong>Penetrationsklassen (NP)</strong>, die je nach angestrebter Gebrauchsklasse (GK) und Holzart verlangt werden:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/65">
                <div className="bg-white p-2.5 rounded border border-slate-200/50">
                  <span className="font-bold text-slate-800 block mb-1">Klasse NP1 &amp; NP2:</span>
                  <span>• <strong>NP1:</strong> Keine Anforderungen an die Eindringtiefe (reiner Oberflächenschutz, z.B. Streichen).</span>
                  <span className="block mt-1">• <strong>NP2:</strong> Mindestens 3 mm tief im schutzbereiten Splintholz.</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200/50">
                  <span className="font-bold text-slate-800 block mb-1">Klasse NP3 &amp; NP4:</span>
                  <span>• <strong>NP3:</strong> Mindestens 6 mm tief im Splintholz.</span>
                  <span className="block mt-1">• <strong>NP4:</strong> Mindestens 9 mm tief im Splintholz. Typisch für wässrige Salze im Außenbereich.</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200/50">
                  <span className="font-bold text-slate-800 block mb-1">Klasse NP5 &amp; NP6 (Vollschutz):</span>
                  <span>• <strong>NP5:</strong> Umfassende Splintholzdurchdringung (mind. 20 mm).</span>
                  <span className="block mt-1">• <strong>NP6:</strong> Vollständige Splintholzdurchdringung und mind. 6 mm Eindringtiefe im Kernholz (Kesseldruckverfahren).</span>
                </div>
              </div>
            </div>

            {/* Regelsanierung bei Pilz- und Insektenbefall nach DIN 68800-4 (F 78 - F 81) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xxs space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Regelsanierungsverfahren bei akutem Befall nach DIN 68800-4</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Ist ein Bauteil bereits aktiv befallen, reicht mechanischer oder rein vorbeugender Schutz nicht mehr aus. Das Sanierungskonzept muss nach DIN 68800-4 unter Hinzuziehung von Sachverständigen durchgeführt werden:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="space-y-2">
                  <span className="font-extrabold text-slate-800 border-b border-home-grau/10 pb-1 block">1. Regelsanierung bei Befall durch Echten Hausschwamm</span>
                  <p className="leading-relaxed text-slate-500">
                    Da der Echte Hausschwamm als einziger Pilz in der Lage ist, Trockenmauerwerk aktiv mit Leitungsmyzelien zu durchdringen, gelten extrem strenge Auflagen:
                  </p>
                  <ul className="list-disc list-inside text-slate-500 space-y-1 text-xs">
                    <li><strong>Schnittgrenze:</strong> Befallenes Holz ist großzügig mit einem Sicherheitsabstand von mindestens <strong>1,00 Meter</strong> über den sichtbaren Befallsrand hinaus abzusägen.</li>
                    <li><strong>Mauerwerkssanierung:</strong> Mauerwerk reinigen, Putz abschlagen, Fugen auskratzen. Myzelien durch Abflammen mit Gasbrenner abtöten.</li>
                    <li><strong>Schwamm-Sperrmittel:</strong> Einstreichen oder flächiges druckloses/Druck-Einbringen (Bohrlochtränkung) von Spezialsalzen mit dem Prüfprädikat <strong>"M"</strong> (Maurerwerks-Schwammsperrmittel).</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <span className="font-extrabold text-slate-800 border-b border-home-grau/10 pb-1 block">2. Regelsanierung bei aktivem Insektenbefall (z.B. Hausbock)</span>
                  <p className="leading-relaxed text-slate-500">
                    Unterdrückung und Eliminierung von Ei- und Larvenaktivität im Querschnitt tragender Strukturen erfolgt über zwei Hauptverfahren:
                  </p>
                  <ul className="list-disc list-inside text-slate-500 space-y-1 text-xs">
                    <li><strong>Thermische Sanierung (Heißluftverfahren):</strong> Einblasen heißer Luft in den abgesperrten Bauwerksabschnitt. Ziel: Die Temperatur im innersten Kern des Holzquerschnitts muss für mindestens <strong>60 Minuten auf mind. 55 °C</strong> erhöht werden. Dadurch gerinnen die Eiweißstrukturen der Larven, Eier und Puppen irreversibel (100%ige Abtötung).</li>
                    <li><strong>Chemische Bekämpfung:</strong> Schädigende Stellen abbeilen (Bohrmehl-Fraßgänge entfernen), Fräsflächen mit einziehenden lösemittelbasierten Bekämpfungspräparaten (Prüfsiegel <strong>"Ib"</strong>) einstreichen oder mittels Bohrloch-Injektionsverfahren direkt in Fraßwege impfen.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        </div>
      </div>
      
      <WoodThematicLinks current="dauerhaftigkeit" />
      
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Holzfeuchte einer Balkenkopfprobe nach dem Darrverfahren"
        zielGleichung="u = \frac{m_u - m_0}{m_0} \cdot 100\,\%"
        schritte={[
          { titel: 'Wägung', erklaerung: 'Bohrkernprobe aus dem Auflager im Außenmauerwerk: feucht 512 g, nach Darrtrocknung bei 103 °C bis zur Massekonstanz 418 g.', formel: 'm_u = 512\\,\\text{g}, \\quad m_0 = 418\\,\\text{g}' },
          { titel: 'Holzfeuchte', erklaerung: 'Bezug auf die Darrmasse:', formel: 'u = \\frac{512 - 418}{418} \\cdot 100 = 22{,}5\\,\\%' },
          { titel: 'Bewertung', erklaerung: 'Oberhalb von etwa 20 % ist Pilzbefall möglich; das Bauteil entspricht mindestens Gebrauchsklasse 2.', formel: '22{,}5\\,\\% > 20\\,\\% \\Rightarrow \\text{Feuchtequelle beseitigen}' }
        ]}
        ergebnisHinweis="Elektrische Widerstandsmessgeräte (DIN EN 13183-2) eignen sich für die Kartierung; das Darrverfahren (DIN EN 13183-1) ist das Referenzverfahren. Bei Hausschwammverdacht ist die Sanierung nach DIN 68800-4 zu planen."
        normQuelle="DIN EN 13183-1; DIN 68800-1:2019-06; DIN 68800-4:2020-12"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Wirkstoffaufnahme bei einer Kesseldrucktränkung"
        zielGleichung="R = \frac{m_{Lsg} \cdot c}{V_{Holz}}"
        schritte={[
          { titel: 'Charge', erklaerung: 'Kiefernsplintholz 0,80 m³; Lösungsaufnahme aus der Wägung vor und nach der Tränkung 280 kg; Konzentration der Tränklösung 3,0 %.', formel: 'm_{WS} = 280 \\cdot 0{,}030 = 8{,}4\\,\\text{kg}' },
          { titel: 'Einbringmenge', erklaerung: 'Bezogen auf das Holzvolumen:', formel: 'R = \\frac{8{,}4}{0{,}80} = 10{,}5\\,\\text{kg/m}^3' },
          { titel: 'Vergleich', erklaerung: 'Erforderliche Einbringmenge laut Zulassung des Holzschutzmittels für die Gebrauchsklasse (hier angenommen 9,0 kg/m³):', formel: '10{,}5 \\ge 9{,}0 \\Rightarrow \\text{Aufnahme ausreichend}' }
        ]}
        ergebnisHinweis="Neben der Aufnahme (Retention) ist die Eindringtiefe nach DIN EN 351-1:2023-07 (Penetrationsklassen NP1 bis NP6) nachzuweisen. Fichte ist schwer tränkbar; Kiefernsplint lässt sich dagegen gut volltränken."
        normQuelle="DIN EN 351-1:2023-07; DIN 68800-3:2020-03"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="holzkorrosion" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 10 Dauerhaftigkeit: DIN 68800-Ausgaben, Gebrauchsklassen, DIN EN 350:2016 und 351-1:2023, AltholzV geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: "Holzschädlingsbekämpfung", url: "https://de.wikipedia.org/wiki/Holzsch%C3%A4dlingsbek%C3%A4mpfung" },
          { title: "Holzschutz", url: "https://de.wikipedia.org/wiki/Holzschutz" },
          { title: "Echter Hausschwamm", url: "https://de.wikipedia.org/wiki/Echter_Hausschwamm" },
          { title: "Hausbock", url: "https://de.wikipedia.org/wiki/Hausbock" }
        ]} 
        literatur={[
          'Huckfeldt, T.; Schmidt, O.: Hausfäule- und Bauholzpilze – Diagnose und Sanierung. Köln: Rudolf Müller (aktuelle Auflage)',
          'DIN e. V. (Hrsg.): Holzschutz – Praxiskommentar zu DIN 68800 Teile 1 bis 4. Berlin: DIN Media (aktuelle Auflage; Angaben manuell prüfen)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]} 
        regelwerke={[
          { title: "DIN 68800-1:2019-06 (Holzschutz – Teil 1: Allgemeines)" },
          { title: "DIN 68800-2:2022-02 (Holzschutz – Teil 2: Vorbeugende bauliche Maßnahmen im Hochbau)" },
          { title: "DIN 68800-3:2020-03 (Holzschutz – Teil 3: Vorbeugender Schutz von Holz mit Holzschutzmitteln)" },
          { title: "DIN 68800-4:2020-12 (Holzschutz – Teil 4: Bekämpfungsmaßnahmen gegen Holz zerstörende Pilze und Insekten und Sanierungsmaßnahmen)" }
        ]} 
        formeln={[
          {
            formel: 'u = \\frac{m_w - m_0}{m_0} \\cdot 100\\,\\%',
            erklaerung: 'Holzfeuchte u [%] bezogen auf die Trockenmasse m0 (Darrgewicht). Oberhalb von etwa u = 20 % ist bei üblichen Temperaturen Befall durch holzzerstörende Pilze möglich (Braun-, Weiß-, Moderfäule).',
            quelle: 'DIN EN 13183-1'
          },
          {
            formel: 'u_{\\text{Gebrauch}} \\le 20\\,\\% \\implies \\text{GK 0 oder GK 1}',
            erklaerung: 'Grundsatz nach DIN 68800-1/-2: Dauerhaft auf u ≤ 20 % gehaltenes Holz ist vor Pilzen geschützt (GK 0/1). In GK 1 kann ein Insektenrisiko bestehen, das durch bauliche Maßnahmen (z. B. Kontrollierbarkeit, technisch getrocknetes Holz) auf GK 0 reduziert wird.',
            quelle: 'DIN 68800-1/-2'
          }
        ]} 
      />
    </div>
  );
}
