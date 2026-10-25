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

export interface MechanischTabProps {
  angle: '0' | '90' | '-90';
  chartData: { labels: number[]; datasets: ({ label: string; data: number[]; borderColor: string; backgroundColor: string; borderWidth: number; tension: number; borderDash?: undefined; } | { label: string; data: number[]; borderColor: string; backgroundColor: string; borderWidth: number; borderDash: number[]; tension: number; })[]; };
  karstenAbsorbed: number;
  karstenResults: { w: number; tHours: number; eingruppierung: string; textClass: string; color: string; detailtext: string; };
  karstenTime: number;
  options: ChartOptions<'line'>;
  rebound: number;
  reboundResults: { rCorr: number; fc: number; };
  renderEmbeddedGeraete: (tabKey: string, deviceIds: string[]) => React.JSX.Element | null;
  setAngle: React.Dispatch<React.SetStateAction<'0' | '90' | '-90'>>;
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
              <h2 className="text-xl font-bold text-slate-900">Rückprallhammer (Druckfestigkeit)</h2>
            </div>
          
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <p>
                <FormulaText text="Der Rückprallhammer misst die Oberflächenhärte des Betons. Die Rückprallzahl R korreliert mit der Druckfestigkeit f_c." />
              </p>
            </div>

            <Slider info="Vorgabe der gemessenen Rückprallzahl R."
              label={<FormulaText text="Rückprallzahl R" />}
              min={20} max={60} step={1}
              value={rebound} unit="-"
              onChange={(e) => setRebound(Number(e.target.value))}
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-900">Prüfrichtung (Winkel)</label>
                <InfoTooltip text="Die Schwerkraft beeinflusst die Masse im Hammer. Messungen rechtwinklig nach unten liefern höhere Werte als Messungen senkrecht nach oben." />
              </div>
              <select aria-label="Prüfrichtung (Winkel)" 
                className="p-2 border border-home-grau/30 rounded-md bg-slate-50 focus:outline-none focus:border-shiraz text-sm"
                value={angle}
                onChange={(e) => setAngle(e.target.value as "0" | "90" | "-90")}
              >
                <option value="0">Horizontal (0°)</option>
                <option value="90">Nach unten (+90°)</option>
                <option value="-90">Nach oben (-90°)</option>
              </select>
            </div>

            <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md relative overflow-hidden">
              <div className="text-sm opacity-90 mb-1">Geschätzte Druckfestigkeit</div>
              <div className="text-3xl font-bold">{formatDeZahl(reboundResults.fc, 1)} N/mm²</div>
              <div className="text-xs opacity-75 mt-2">
                Korrigiertes R: {formatDeZahl(reboundResults.rCorr, 1)}
              </div>
              {/* Animation */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                <div className="w-8 h-8 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[400px]">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Korrelationskurven (Rückprallhammer)</h2>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-4">
              <p>
                Zusammenhang zwischen Rückprallzahl R und Druckfestigkeit f_c für verschiedene Prüfrichtungen nach DIN EN 12504-2.
              </p>
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
            <h2 className="text-xl font-bold text-slate-900 font-sans">Gaspermeabilität (Torrent)</h2>
          </div>

          <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
            <p>
              Das Torrent-Verfahren misst zerstörungsfrei den Luftpermeabilitätsbeiwert <InlineMath math="k_T" /> der Betonrandzone. Ein wichtiges Maß zur Vorhersage der Carbonatisierungsgeschwindigkeit.
            </p>
          </div>

          <Slider 
            label={<FormulaText text="Gaspermeabilitätsbeiwert kT (10^{-16}\ \text{m}^2)" />}
            min={0.001} max={15.0} step={0.01}
            value={torrentKt} unit=""
            info="Spezifischer Beiwert der Deckschichtverätzung."
            onChange={(e) => setTorrentKt(Number(e.target.value))}
          />

          <Slider 
            label="Betonfeuchtigkeit (r.F.)"
            min={10} max={98} step={1}
            value={torrentMoisture} unit="%"
            info="Das okkludierte Wasser im Porensystem behindert den Gasdurchfluss."
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
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Qualitative Einstufung</div>
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
            <h2 className="text-xl font-bold text-slate-900 font-sans">Kapillare Wasseraufnahme (Karsten-Röhrchen)</h2>
          </div>

          <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
            <p>
              Misst vor Ort die kapillare Wasseraufnahme von mineralischen Baustoffen unter definiertem hydrostatischem Wasserdruck (simulierter Schlagregen).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Slider 
              label="Messdauer (t)"
              min={5} max={60} step={5}
              value={karstenTime} unit="min"
              info="Dauer des hydrostatischen Eindringversuchs."
              onChange={(e) => setKarstenTime(Number(e.target.value))}
            />
            <Slider 
              label="Wasseraufnahme (V)"
              min={0.1} max={10.0} step={0.1}
              value={karstenAbsorbed} unit="ml"
              info="Menge des eingedrungenen Wassers."
              onChange={(e) => setKarstenAbsorbed(Number(e.target.value))}
            />
          </div>

          <div className="mt-2 p-4 rounded-xl border flex flex-col gap-2 bg-slate-50 border-home-grau/20">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
              <span>Wasseraufnahmekoeffizient (w)</span>
              <span className="font-mono text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded text-[10px]">RILEM II.4</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {formatDeZahl(karstenResults.w, 3)} kg/(m² · h^{"0.5"})
            </div>

            <div className={`mt-2 p-3 rounded-lg border text-xs flex flex-col gap-1 ${karstenResults.textClass}`}>
              <span className="font-bold">{karstenResults.eingruppierung}</span>
              <p className="text-slate-600 font-normal">{karstenResults.detailtext}</p>
            </div>
          </div>

          {/* Röhrchen Visualisierung */}
          <div className="relative h-20 bg-slate-100 rounded-lg border border-home-grau/20 overflow-hidden flex items-center justify-between px-6">
            <div className="text-xs font-semibold text-slate-700 flex flex-col">
              <span>Simulierter Wasserspeicher</span>
              <span className="text-[10px] text-slate-500">Kapillarer Flüssigkeitsstadium</span>
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
