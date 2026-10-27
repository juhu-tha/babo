// Ausgelagert aus src/modules/ZfP.tsx (AP 5.2)
import { formatDeZahl } from '@/src/utils/numberFormat';
import React from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InlineMath } from 'react-katex';
import { Activity, Waves, Hammer, Droplets, AlertTriangle } from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import inhalt from '@/content/zfp/MechanischTab.json';
import type { PruefWinkel } from '@/src/calc/pruefverfahren';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import type { Hinweis } from '@/src/calc/plausibilitaet';

export interface MechanischTabProps {
  angle: PruefWinkel;
  chartData: { labels: number[]; datasets: ({ label: string; data: number[]; borderColor: string; backgroundColor: string; borderWidth: number; tension: number; borderDash?: undefined; } | { label: string; data: number[]; borderColor: string; backgroundColor: string; borderWidth: number; borderDash: number[]; tension: number; })[]; };
  karstenAbsorbed: number;
  karstenResults: { w: number; tHours: number; eingruppierung: string; textClass: string; color: string; detailtext: string; hinweise: readonly Hinweis[]; };
  karstenTime: number;
  options: ChartOptions<'line'>;
  rebound: number;
  reboundResults: { rCorr: number; fc: number; hinweise: readonly Hinweis[]; };
  renderEmbeddedGeraete: (tabKey: string, deviceIds: string[]) => React.JSX.Element | null;
  setAngle: React.Dispatch<React.SetStateAction<PruefWinkel>>;
  setKarstenAbsorbed: React.Dispatch<React.SetStateAction<number>>;
  setKarstenTime: React.Dispatch<React.SetStateAction<number>>;
  setRebound: React.Dispatch<React.SetStateAction<number>>;
  setTorrentKt: React.Dispatch<React.SetStateAction<number>>;
  setTorrentMoisture: React.Dispatch<React.SetStateAction<number>>;
  torrentKt: number;
  torrentMoisture: number;
  torrentResults: { klassifizierung: string; bewertung: string; textClass: string; description: string; moistureWarning: string | null; moistureCritical: boolean; };
}

export default function MechanischTab({ angle, chartData, karstenAbsorbed, karstenResults, karstenTime, options, rebound, reboundResults, renderEmbeddedGeraete, setAngle, setKarstenAbsorbed, setKarstenTime, setRebound, setTorrentKt, setTorrentMoisture, torrentKt, torrentMoisture, torrentResults }: MechanischTabProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Section 1: Rückprallhammer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Parameter Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Rückprallhammer */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                <Activity size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900"><MdText text={inhalt.texte.rückprallhammerDruckfestigkeit} /></h2>
            </div>
          
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <p>
                <FormulaText text={inhalt.werte.derRückprallhammerMisstDie} />
              </p>
            </div>

            <Slider info={inhalt.werte.vorgabeDerGemessenenRückprallzahl}
              label={<FormulaText text={inhalt.werte.rückprallzahlR} />}
              min={20} max={60} step={1}
              value={rebound} unit="-"
              onChange={(e) => setRebound(Number(e.target.value))}
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-900"><MdText text={inhalt.texte.prüfrichtungWinkel} /></label>
                <InfoTooltip text={inhalt.werte.dieSchwerkraftBeeinflusstDie} />
              </div>
              <select aria-label={inhalt.werte.prüfrichtungWinkel} 
                className="p-2 border border-home-grau/30 rounded-md bg-slate-50 focus:outline-none focus:border-shiraz text-sm"
                value={angle}
                onChange={(e) => setAngle(e.target.value as PruefWinkel)}
              >
                <option value="90">Senkrecht nach oben (+90°, Decke)</option>
                <option value="45">Schräg nach oben (+45°)</option>
                <option value="0">Horizontal (0°)</option>
                <option value="-45">Schräg nach unten (−45°)</option>
                <option value="-90">Senkrecht nach unten (−90°, Boden)</option>
              </select>
            </div>

            <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md relative overflow-hidden">
              <div className="text-sm opacity-90 mb-1"><MdText text={inhalt.texte.geschätzteDruckfestigkeit} /></div>
              <div className="text-3xl font-bold">{formatDeZahl(reboundResults.fc, 1)} N/mm²</div>
              <div className="text-xs opacity-75 mt-2"><MdText text={inhalt.texte.korrigiertesR} />{formatDeZahl(reboundResults.rCorr, 1)}
              </div>
              {/* Animation */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                <div className="w-8 h-8 bg-white/40 rounded-full"></div>
              </div>
            </div>
            <EingabeHinweise hinweise={reboundResults.hinweise} />
          </div>
        </div>

        {/* Chart Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[400px]">
            <h2 className="text-xl font-bold text-slate-900 mb-2"><MdText text={inhalt.texte.korrelationskurvenRückprallhammer} /></h2>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-4">
              <p><MdText text={inhalt.texte.zusammenhangZwischenRückprallzahlR} /></p>
            </div>
            
            <div className="flex-1 relative w-full h-full">
              <Line data={chartData} options={options} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Gaspermeation & Karstensches Röhrchen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Torrent Gaspermeationsmessung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
              <Waves size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-sans"><MdText text={inhalt.texte.gaspermeabilitätTorrent} /></h2>
          </div>

          <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.dasTorrentVerfahrenMisst} /></p>
          </div>

          <Slider 
            label={<FormulaText text="Gaspermeabilitätsbeiwert kT (10^{-16}\ \text{m}^2)" />}
            min={0.001} max={15.0} step={0.01}
            value={torrentKt} unit=""
            info={inhalt.werte.spezifischerBeiwertDerDeckschichtverätzu}
            onChange={(e) => setTorrentKt(Number(e.target.value))}
          />

          <Slider 
            label={inhalt.werte.betonfeuchtigkeitRF}
            min={10} max={98} step={1}
            value={torrentMoisture} unit="%"
            info={inhalt.werte.dasOkkludierteWasserIm}
            onChange={(e) => setTorrentMoisture(Number(e.target.value))}
          />

          {torrentResults.moistureWarning && (
            <div className={`p-3 rounded-lg border text-xs flex gap-2 items-start ${
              torrentResults.moistureCritical 
                ? 'bg-red-50 text-red-800 border-red-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{torrentResults.moistureWarning}</span>
            </div>
          )}

          <div className={`mt-2 p-4 rounded-xl border flex flex-col gap-2 ${torrentResults.textClass}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500"><MdText text={inhalt.texte.qualitativeEinstufung} /></div>
            <div className="text-xl font-bold font-sans">{torrentResults.klassifizierung}</div>
            <div className="text-sm font-semibold text-slate-800">Bewertung: {torrentResults.bewertung}</div>
            <p className="text-xs text-slate-600 mt-1">{torrentResults.description}</p>
          </div>
        </div>

        {/* Karsten'sches Röhrchen */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
              <Droplets size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-sans"><MdText text={inhalt.texte.kapillareWasseraufnahmeKarstenRöhrchen} /></h2>
          </div>

          <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.misstVorOrtDie} /></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Slider 
              label={inhalt.werte.messdauerT}
              min={5} max={60} step={5}
              value={karstenTime} unit="min"
              info={inhalt.werte.dauerDesHydrostatischenEindringversuchs}
              onChange={(e) => setKarstenTime(Number(e.target.value))}
            />
            <Slider 
              label={inhalt.werte.wasseraufnahmeV}
              min={0.1} max={10.0} step={0.1}
              value={karstenAbsorbed} unit="ml"
              info={inhalt.werte.mengeDesEingedrungenenWassers}
              onChange={(e) => setKarstenAbsorbed(Number(e.target.value))}
            />
          </div>

          <div className="mt-2 p-4 rounded-xl border flex flex-col gap-2 bg-slate-50 border-home-grau/20">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
              <span><MdText text={inhalt.texte.wasseraufnahmekoeffizientW} /></span>
              <span className="font-mono text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded text-[10px]">RILEM II.4</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {formatDeZahl(karstenResults.w, 3)}<MdText text={inhalt.texte.kgMH0} /></div>

            <div className={`mt-2 p-3 rounded-lg border text-xs flex flex-col gap-1 ${karstenResults.textClass}`}>
              <span className="font-bold">{karstenResults.eingruppierung}</span>
              <p className="text-slate-600 font-normal">{karstenResults.detailtext}</p>
            </div>
            <EingabeHinweise hinweise={karstenResults.hinweise} />
          </div>

          {/* Röhrchen Visualisierung */}
          <div className="relative h-20 bg-slate-100 rounded-lg border border-home-grau/20 overflow-hidden flex items-center justify-between px-6">
            <div className="text-xs font-semibold text-slate-700 flex flex-col">
              <span><MdText text={inhalt.texte.simulierterWasserspeicher} /></span>
              <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.kapillarerFlüssigkeitsstadium} /></span>
            </div>
            {/* Dynamische Wassersäule */}
            <div className="h-4 w-48 bg-slate-200 rounded-full overflow-hidden relative border border-home-grau/30">
              <div 
                className="h-full bg-blue-500 absolute left-0 transition-all duration-500"
                style={{ width: `${Math.max(10, 100 - (karstenAbsorbed * 10))}%` }}
              ></div>
            </div>
            <div className="text-xs font-mono font-bold text-blue-600">
              {formatDeZahl(Math.max(0, 10 - karstenAbsorbed), 1)} ml übrig
            </div>
          </div>
        </div>

      </div>

      {/* Section 3: Zugehörige Geräte aus Gerätepool */}
      {renderEmbeddedGeraete('mechanisch', ['rueckprall', 'haftzug', 'ausziehpruefung', 'torrent', 'karsten'])}
    </div>
  );
}
