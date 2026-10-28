import { Sparkles, AlertTriangle, Settings, ArrowUp, ArrowDown, Trash2, Plus, Recycle, Percent } from 'lucide-react';
import { PRESET_WALLS, EPD_DATABASE } from './daten';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import type { ConfiguredLayer } from './daten';
import type { Dispatch, SetStateAction } from 'react';
import type { MaterialData } from './daten';
import inhalt from '@/content/nachhaltigkeit/Wandkonfigurator.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

interface WandkonfiguratorProps {
  addLayer: () => void;
  addThickness: number;
  applyPreset: (presetKey: string) => void;
  chartData: ChartData<'bar'>;
  chartOptions: ChartOptions<'bar'>;
  computedWall: { layers: { mat: MaterialData; massKg: number; r_i: number; gwpTotalA1A3: number; materialKey: string; thicknessCm: number; }[]; thicknessCm: number; totalWeightKg: number; rVal: number; uValue: number; gwpFossilA1A3: number; gwpBiogenicA1A3: number; gwpTotalA1A3: number; gwpC3C4: number; gwpD: number; gwpNetTotal: number; penrtTotal: number; inherentCircularity: number; jointSeparabilityFactor: number; effectiveCircularity: number; };
  connectionType: "glued" | "screwed";
  gegRating: { label: string; color: string; rating: string; };
  handleThicknessChange: (index: number, val: number) => void;
  moveLayer: (index: number, direction: "up" | "down") => void;
  removeLayer: (index: number) => void;
  selectedAddMaterial: string;
  setAddThickness: Dispatch<SetStateAction<number>>;
  setConnectionType: Dispatch<SetStateAction<"glued" | "screwed">>;
  setSelectedAddMaterial: Dispatch<SetStateAction<string>>;
  wallLayers: ConfiguredLayer[];
}

export default function Wandkonfigurator({ addLayer, addThickness, applyPreset, chartData, chartOptions, computedWall, connectionType, gegRating, handleThicknessChange, moveLayer, removeLayer, selectedAddMaterial, setAddThickness, setConnectionType, setSelectedAddMaterial, wallLayers }: WandkonfiguratorProps) {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">

        {/* Editor & presets card (7-cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">

          {/* Presets block */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Sparkles size={11} className="text-shiraz" /><MdText text={inhalt.texte.vorkonfigurierteWandPresetsLaden} /></span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {Object.entries(PRESET_WALLS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className="p-2 border border-home-grau/30 rounded-lg text-left hover:border-shiraz/50 hover:bg-shiraz/5 transition-all flex flex-col gap-1"
                >
                  <strong className="text-[11px] text-slate-900 leading-tight font-bold">{item.name}</strong>
                  <span className="text-[9px] text-slate-400 line-clamp-2 leading-normal">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Callout: Massebezug vs. Bauteilbezug */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-amber-950 leading-relaxed">
              <strong className="font-bold text-amber-900 block mb-0.5"><MdText text={inhalt.texte.falleDerÖkobilanzierungMassebezug} /></strong>
              <p>
                In EPDs werden Materialwerte häufig auf 1 kg Masse bezogen. Hier wirkt Normalbeton (CEM I) mit ca. <strong><MdText text={inhalt.texte.t010KgCo} /></strong> scheinbar harmlos. 
                Aufgrund der hohen Rohdichte (2400 kg/m³) wiegt jedoch eine 20 cm Betonwand 480 kg/m² und verursacht ca. <strong><MdText text={inhalt.texte.t49KgCoE} /></strong>! 
                Konstruktionsvollholz (KVH) speichert hingegen biogenes CO₂ (-1,47 kg CO₂e/kg), und ein Lehmstein (DIN 18940) benötigt überhaupt keine klinkerspezifische Brennenergie (nur 0,022 kg CO₂e/kg). 
                <strong> Grundsatz:</strong> Bauteile müssen immer auf die funktionelle Einheit (1 m² Bauteil mit gefordertem U-Wert und Tragfähigkeit) bezogen verglichen werden.
              </p>
            </div>
          </div>

          {/* Configurator Layer Board */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-home-grau/30 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Settings size={16} className="text-shiraz" /><MdText text={inhalt.texte.schichtenaufbauKonfigurierenVonInnen} /></h3>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                Layers: {wallLayers.length}
              </span>
            </div>

            {/* Joint Connection - Design for Deconstruction */}
            <div className="bg-slate-50 p-4 border border-home-grau/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider"><MdText text={inhalt.texte.designForDeconstruction} /></span>
                  <span className="text-[9px] text-shiraz font-mono font-bold">Lerneffekt</span>
                </div>
                <label className="block text-xs font-bold text-slate-800 mt-1.5 leading-tight"><MdText text={inhalt.texte.fügungsmethodeDerWandschichten} /></label>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-normal"><MdText text={inhalt.texte.nassputzeUndVollflächigeVerklebungen} /></p>
              </div>
              <div className="w-full md:w-56 shrink-0">
                <AuswahlGruppe label="Verbindungsart" className="grid grid-cols-2 bg-slate-100 p-1 rounded-lg text-center text-xs">
                  <button {...alsOption(connectionType === 'glued')}
                    onClick={() => setConnectionType('glued')}
                    className={`py-1.5 rounded-md cursor-pointer transition-all font-semibold ${
                        connectionType === 'glued'
                          ? 'bg-shiraz text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                  ><MdText text={inhalt.texte.verklebtMörtel} /></button>
                  <button {...alsOption(connectionType === 'screwed')}
                    onClick={() => setConnectionType('screwed')}
                    className={`py-1.5 rounded-md cursor-pointer transition-all font-semibold ${
                        connectionType === 'screwed'
                          ? 'bg-shiraz text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                  ><MdText text={inhalt.texte.geschraubtTrocken} /></button>
                </AuswahlGruppe>
              </div>
            </div>

            {/* Layer list tables */}
            <div className="space-y-3">
              {computedWall.layers.map((layer, index) => (
                <div 
                  key={index}
                  className="bg-slate-50 border border-home-grau/30 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-home-grau/30"
                >
                  {/* Material Identity & sorting buttons */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex flex-col gap-0.5 shrink-0 select-none">
                      <button 
                        disabled={index === 0}
                        onClick={() => moveLayer(index, 'up')}
                        className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-500"
                        title={inhalt.werte.nachLinksInnenSchieben}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button 
                        disabled={index === wallLayers.length - 1}
                        onClick={() => moveLayer(index, 'down')}
                        className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-500"
                        title={inhalt.werte.nachRechtsAußenSchieben}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <div>
                      <strong className="text-xs text-slate-900 font-bold block leading-snug">{layer.mat.name}</strong>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">
                        {layer.mat.category} &bull; λ = {formatDeZahl(layer.mat.lambda, 3)} W/mK
                      </span>
                    </div>
                  </div>

                  {/* Thickness slider controls */}
                  <div className="flex items-center gap-4 flex-1 max-w-xs md:justify-end">
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5 px-0.5">
                        <span>Dicke:</span>
                        <span className="font-mono font-bold text-shiraz">{formatDeWert(layer.thicknessCm)} cm</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="40"
                        step="0.5"
                        value={layer.thicknessCm}
                        onChange={(e) => handleThicknessChange(index, parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                      />
                    </div>

                    {/* Delete item */}
                    <button
                      onClick={() => removeLayer(index)}
                      disabled={wallLayers.length <= 1}
                      className="text-stone-400 hover:text-red-600 disabled:opacity-35 p-1.5 rounded-lg hover:bg-slate-100 transition-colors self-end md:self-auto shrink-0"
                      title={inhalt.werte.schichtLöschen}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Layer Controller */}
            <div className="mt-4 pt-4 border-t border-home-grau/30 flex flex-col md:flex-row items-end gap-3 bg-slate-50/50 p-4 rounded-xl border border-home-grau/30">
              <div className="w-full md:flex-1">
                <label className="block text-[10px] uppercase font-bold text-slate-900 mb-1 tracking-wider"><MdText text={inhalt.texte.werkstoffAuswählen} /></label>
                <select aria-label={inhalt.werte.werkstoffAuswählen}
                  value={selectedAddMaterial}
                  onChange={(e) => setSelectedAddMaterial(e.target.value)}
                  className="w-full p-2 border border-home-grau/30 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-shiraz"
                >
                  {Object.entries(EPD_DATABASE).map(([key, mat]) => (
                    <option key={key} value={key}>{mat.name} ({mat.category})</option>
                  ))}
                </select>
              </div>

              <div className="w-24 shrink-0">
                <label className="block text-[10px] uppercase font-bold text-slate-900 mb-1 tracking-wider">Stärke (cm)</label>
                <input aria-label="Stärke (cm)"
                  type="number"
                  min="1"
                  max="50"
                  value={addThickness}
                  onChange={(e) => setAddThickness(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full p-1.5 border border-home-grau/30 rounded-lg text-xs text-center bg-white font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-shiraz"
                />
              </div>

              <button
                onClick={addLayer}
                className="bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-all select-none w-full md:w-auto justify-center"
              >
                <Plus size={14} /><MdText text={inhalt.texte.schichtHinzufügen} /></button>
            </div>

          </div>
        </div>

        {/* Calculations Fact Sheet & chart display (5-cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">

          {/* Physics outputs card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-home-grau/30 pb-1"><MdText text={inhalt.texte.bauphysikalischeKennwerte} /></h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Gesamtstärke</span>
                <strong className="text-sm font-mono font-bold text-slate-900 mt-0.5 block">{formatDeZahl(computedWall.thicknessCm, 1)} cm</strong>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Flächengewicht</span>
                <strong className="text-sm font-mono font-bold text-slate-900 mt-0.5 block">~ {formatDeWert(Math.round(computedWall.totalWeightKg))} kg/m²</strong>
              </div>
            </div>

            {/* Thermal conductivity indicator */}
            <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col items-center">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1"><MdText text={inhalt.texte.berechneterUWert} /></span>
              <strong className="text-2xl font-mono text-shiraz font-bold">{formatDeZahl(computedWall.uValue, 3)} W/m²K</strong>

              {/* GEG limits validation badge */}
              <div className={`mt-2.5 px-3 py-1 text-[10px] font-bold border rounded-full text-center ${gegRating.color}`}>
                Rating: <strong>{gegRating.rating}</strong> &bull; {gegRating.label}
              </div>
            </div>

            {/* Circular Economy Matrix */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] text-slate-800 uppercase font-bold tracking-wider flex items-center gap-1.5 font-sans">
                  <Recycle size={13} className="text-shiraz" /><MdText text={inhalt.texte.zirkularitätsIndexMci} /></span>
                <span className="text-[10px] bg-shiraz/10 text-shiraz border border-shiraz/20 px-1.5 py-0.5 rounded font-bold font-mono">
                  {formatDeWert(Math.round(computedWall.effectiveCircularity))} / 100
                </span>
              </div>

              <div className="space-y-2">
                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                        computedWall.effectiveCircularity >= 60 ? 'bg-emerald-600' :
                        computedWall.effectiveCircularity >= 30 ? 'bg-amber-600' : 'bg-shiraz'
                      }`}
                    style={{ width: `${Math.min(100, Math.max(0, computedWall.effectiveCircularity))}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-normal"><MdText text={inhalt.texte.materialZyklusInhärent} /></span>
                    <strong className="text-slate-800 font-bold font-mono mt-0.5 block">{formatDeWert(Math.round(computedWall.inherentCircularity))}%</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-normal"><MdText text={inhalt.texte.trennungsWeicheFügung} /></span>
                    <strong className="text-slate-800 font-bold font-mono mt-0.5 block">{formatDeWert(Math.round(computedWall.jointSeparabilityFactor * 100))}%</strong>
                  </div>
                </div>

                <p className="text-[10px] text-slate-600 leading-normal">
                  {computedWall.effectiveCircularity >= 70 ? (
                    <span className="text-slate-800 font-medium"><MdText text={inhalt.texte.sehrGutesDesignErleichtert} /></span>
                  ) : computedWall.effectiveCircularity >= 40 ? (
                    <span className="text-slate-600 font-medium font-normal"><MdText text={inhalt.texte.teilweiseKreislauffähigVerbessernSie} /></span>
                  ) : (
                    <span className="text-shiraz font-medium font-normal"><MdText text={inhalt.texte.hohesDowncyclingOderDeponierisiko} /></span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Footprint visualization card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex justify-between items-baseline border-b border-home-grau/30 pb-1">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider"><MdText text={inhalt.texte.ökobilanzierungNetto} /></h3>
              <span className="text-xs text-slate-400 font-mono"><MdText text={inhalt.texte.t1MWandfläche} /></span>
            </div>

            <div className="h-56 relative w-full pt-1">
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Dynamic explanations */}
            <div className="bg-slate-50 text-slate-800 p-3.5 rounded-xl border border-slate-200 text-[11px] leading-relaxed">
              <strong className="text-xs text-slate-900 block font-bold mb-1 flex items-center gap-1.5 uppercase">
                <Percent size={13} className="text-shiraz" /><MdText text={inhalt.texte.gwpBiogenicNachweisbericht} /></strong><MdText text={inhalt.texte.mitDiesemSchichtenaufbauBinden} /><span className="font-bold text-slate-900">{formatDeZahl(computedWall.gwpBiogenicA1A3, 1)}<MdText text={inhalt.texte.kgCoEqM} /></span><MdText text={inhalt.texte.biogenenKohlenstoffInDer} /><span className="font-bold text-shiraz">+{formatDeZahl(computedWall.gwpFossilA1A3, 1)} kg CO₂-eq</span><MdText text={inhalt.texte.derNettoWertEnthält} /></div>
          </div>

        </div>

      </div>
    );
}
