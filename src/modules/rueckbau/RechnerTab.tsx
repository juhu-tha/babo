import type { Dispatch, SetStateAction } from 'react';
import { Hammer } from 'lucide-react';
import { formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';
import { FormulaText } from '@/src/components/ui/FormulaText';

export interface RechnerTabProps {
  setBuildingVolume: Dispatch<SetStateAction<number>>;
  setStructureType: Dispatch<SetStateAction<"concrete" | "masonry" | "timber" | "composite">>;
  buildingVolume: number;
  structureType: "concrete" | "masonry" | "timber" | "composite";
  totalMass: number;
  mineralPercentage: number;
  massConcrete: number;
  massMasonry: number;
  massWood: number;
  massMetals: number;
  massGypsum: number;
  massPlastics: number;
  massHazardous: number;
  massMixed: number;
  setShowCalculations: Dispatch<SetStateAction<boolean>>;
  showCalculations: boolean;
  currentDensity: { concrete: number; masonry: number; wood: number; metals: number; plastics: number; gypsum: number; hazardous: number; mixed: number; } | { concrete: number; masonry: number; wood: number; metals: number; plastics: number; gypsum: number; hazardous: number; mixed: number; } | { concrete: number; masonry: number; wood: number; metals: number; plastics: number; gypsum: number; hazardous: number; mixed: number; } | { concrete: number; masonry: number; wood: number; metals: number; plastics: number; gypsum: number; hazardous: number; mixed: number; };
}

export function RechnerTab({ setBuildingVolume, setStructureType, buildingVolume, structureType, totalMass, mineralPercentage, massConcrete, massMasonry, massWood, massMetals, massGypsum, massPlastics, massHazardous, massMixed, setShowCalculations, showCalculations, currentDensity }: RechnerTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Inputs Left */}
      <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-text-main flex items-center gap-1.5 pb-2 border-b border-home-grau/10">
          <Hammer size={16} className="text-shiraz" /> Baukörper-Spezifikationen
        </h3>
    
        <div className="space-y-4">
          {/* Typical Building Presets (Menge & Material) */}
          <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/10 space-y-2">
            <span className="text-xs font-extrabold text-[#A3113E] tracking-wider uppercase font-mono block">Typische Musterbauten-Presets</span>
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: '🏠 Einfamilienhaus (EFH)', vol: 800, type: 'masonry', label: '800 m³ • Mauerwerk (Ziegel)' },
                { name: '🏡 Doppelhaushälfte (DHH)', vol: 600, type: 'composite', label: '600 m³ • Mischbauweise' },
                { name: '🏢 Mehrfamilienhaus (MFH)', vol: 3500, type: 'concrete', label: '3.500 m³ • Stahlbeton' },
                { name: '🪵 Holzhaus (EFH-Leichtbau)', vol: 900, type: 'timber', label: '900 m³ • Holzständer' },
                { name: '🏭 Gewerbehalle (Mittel)', vol: 12000, type: 'concrete', label: '12.000 m³ • Skelettbau' },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setBuildingVolume(preset.vol);
                    setStructureType(preset.type as "concrete" | "masonry" | "timber" | "composite");
                  }}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all flex justify-between items-center ${
                        buildingVolume === preset.vol && structureType === preset.type
                          ? 'bg-shiraz text-white border-shiraz font-semibold shadow-sm shadow-shiraz/25'
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
                      }`}
                >
                  <span className="font-semibold">{preset.name}</span>
                  <span className={`text-xs font-mono ${
                        buildingVolume === preset.vol && structureType === preset.type
                          ? 'text-white/80'
                          : 'text-slate-500'
                      }`}>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
    
          <div>
            <label className="text-xs font-bold text-text-main flex justify-between mb-1.5">
              <span>Gebäudevolumen (BRI)</span>
              <span className="text-shiraz font-mono">{buildingVolume.toLocaleString('de-DE')} m³</span>
            </label>
            <input
              type="range"
              min="500"
              max="20000"
              step="500"
              value={buildingVolume}
              onChange={(e) => setBuildingVolume(Number(e.target.value))}
              className="w-full accent-shiraz"
            />
            <span className="text-xs text-text-main/60 block mt-1">BRI = Brutto-Rauminhalt des Abbruchobjekts</span>
          </div>
    
          <div>
            <label className="text-xs font-bold text-text-main block mb-1.5">Konstruktionsart</label>
            <div className="grid grid-cols-2 gap-2">
              <button aria-pressed={structureType === 'concrete'}
                onClick={() => setStructureType('concrete')}
                className={`p-2.5 text-left border rounded-lg text-xs font-bold transition-all flex flex-col ${
                      structureType === 'concrete' ? 'border-shiraz bg-shiraz/5 text-shiraz' : 'border-home-grau/30 text-text-main hover:bg-slate-50'
                    }`}
              >
                <span>Stahlbetonbau</span>
                <span className="text-xs font-normal text-text-main/50 mt-0.5">Skelett / Fertigteile</span>
              </button>
              <button aria-pressed={structureType === 'masonry'}
                onClick={() => setStructureType('masonry')}
                className={`p-2.5 text-left border rounded-lg text-xs font-bold transition-all flex flex-col ${
                      structureType === 'masonry' ? 'border-shiraz bg-shiraz/5 text-shiraz' : 'border-home-grau/30 text-text-main hover:bg-slate-50'
                    }`}
              >
                <span>Mauerwerk</span>
                <span className="text-xs font-normal text-text-main/50 mt-0.5">Ziegel / Kalksandstein</span>
              </button>
              <button aria-pressed={structureType === 'timber'}
                onClick={() => setStructureType('timber')}
                className={`p-2.5 text-left border rounded-lg text-xs font-bold transition-all flex flex-col ${
                      structureType === 'timber' ? 'border-shiraz bg-shiraz/5 text-shiraz' : 'border-home-grau/30 text-text-main hover:bg-slate-50'
                    }`}
              >
                <span>Holzständerbau</span>
                <span className="text-xs font-normal text-text-main/50 mt-0.5">Leichtbau / Gefache</span>
              </button>
              <button aria-pressed={structureType === 'composite'}
                onClick={() => setStructureType('composite')}
                className={`p-2.5 text-left border rounded-lg text-xs font-bold transition-all flex flex-col ${
                      structureType === 'composite' ? 'border-shiraz bg-shiraz/5 text-shiraz' : 'border-home-grau/30 text-text-main hover:bg-slate-50'
                    }`}
              >
                <span>Mischbauweise</span>
                <span className="text-xs font-normal text-text-main/50 mt-0.5">Gängiger Wohnungsbau</span>
              </button>
            </div>
          </div>
        </div>
    
        <div className="pt-4 border-t border-home-grau/10 text-xs text-text-main/70 bg-slate-50 p-3 rounded-xl border border-home-grau/5 leading-relaxed space-y-2">
          <div className="flex justify-between font-bold text-text-main">
            <span>Geschätzte Gesamtmasse:</span>
            <span className="font-mono text-xs">{totalMass.toLocaleString('de-DE')} t</span>
          </div>
          <div className="flex justify-between">
            <span>Mineralischer Anteil:</span>
            <span className="font-mono font-bold text-slate-800">{formatDeWert(mineralPercentage)} %</span>
          </div>
        </div>
      </div>
    
      {/* Graphical Output Right */}
      <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            Abschätzung der Wertstoff-Massenströme (Selektiver Rückbau)
          </h3>
          
          <div className="space-y-4">
            {/* Visual Bar Graph of calculated masses */}
            {[
              { name: 'Betonbruch (Beton / Stahlbeton)', mass: massConcrete, color: 'bg-slate-500', avv: '17 01 01' },
              { name: 'Mauerwerkbruch (Ziegel, Kalksandstein)', mass: massMasonry, color: 'bg-orange-600', avv: '17 01 02' },
              { name: 'Altholz (A I bis A IV)', mass: massWood, color: 'bg-amber-750', avv: '17 02 01' },
              { name: 'Altmetalle (Eisen, Baustahl, Alu, Kupfer)', mass: massMetals, color: 'bg-indigo-600', avv: '17 04 07' },
              { name: 'Gipskarton / Baustoffe auf Gipsbasis', mass: massGypsum, color: 'bg-neutral-350', avv: '17 08 02' },
              { name: 'Baustellenspezifische Kunststoffe', mass: massPlastics, color: 'bg-teal-500', avv: '17 02 03' },
              { name: 'Gefährliche Holzschutz-/Schadstoffe', mass: massHazardous, color: 'bg-red-500', avv: '17 09 03*' },
              { name: 'Gemischte Bau- und Abbruchabfälle', mass: massMixed, color: 'bg-yellow-600', avv: '17 09 04' }
            ]
            .filter(item => item.mass > 0)
            .map((item, idx) => {
              const percent = Math.max(2, Math.round((item.mass / totalMass) * 100));
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-text-main flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`}></span>
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 p-0.5 rounded">AVV {item.avv}</span>
                      <span className="font-bold font-mono text-text-main">{item.mass.toLocaleString('de-DE')} t ({formatDeWert(percent)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
    
          {/* Show interactive step-by-step calculation path */}
          <div className="mt-4 border-t border-home-grau/15 pt-4 text-xs">
            <button
              type="button"
              onClick={() => setShowCalculations(!showCalculations)}
              className="w-full text-left py-2 px-3 bg-white border border-home-grau/30 hover:bg-slate-50 rounded-lg font-bold flex justify-between items-center transition-colors text-indigo-900 border-l-4 border-l-indigo-600 cursor-pointer text-xs"
            >
              <span>{showCalculations ? '▲ Berechnungsweg & Formeln ausblenden' : '▼ Wissenschaftlichen Berechnungsweg & Formeln einblenden'}</span>
              <span className="text-xs text-slate-500 font-normal">Details nach GewAbfV &amp; LfU</span>
            </button>
    
            {showCalculations && (
              <div className="mt-3 p-4 bg-white border border-home-grau/25 rounded-xl space-y-4 text-text-main/90 leading-relaxed text-left">
                <div>
                  <h5 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    Schritt 1: Ermittlung des Brutto-Rauminhalts (BRI) und Konstruktionstyp
                  </h5>
                  <p className="mb-2 text-text-main/75 text-xs">
                    Ausgangspunkt ist der Brutto-Rauminhalt des Abbruchobjekts (<FormulaText text="V" /> = {buildingVolume.toLocaleString('de-DE')} m³) sowie der tragende Konstruktionstyp (<strong>{
                      structureType === 'concrete' ? 'Stahlbetonbau' :
                      structureType === 'masonry' ? 'Mauerwerksbau' :
                      structureType === 'timber' ? 'Holzständerbau' : 'Mischbauweise'
                    }</strong>).
                  </p>
                </div>
    
                <div>
                  <h5 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    Schritt 2: Spezifische Massendichten (<FormulaText text="\rho_i" />)
                  </h5>
                  <p className="mb-2 text-text-main/75 text-xs">
                    Für die gewählte Bauart ergeben sich folgende statistische Massenkonzentrationen (in Tonnen pro Kubikmeter umbauter Raum) nach Aufmaßwerten typischer Rückbaustrukturen:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-home-grau/15 font-mono">
                    <div>Beton: {formatDeWert(currentDensity.concrete)} t/m³</div>
                    <div>Mauerwerk: {formatDeWert(currentDensity.masonry)} t/m³</div>
                    <div>Holz: {formatDeWert(currentDensity.wood)} t/m³</div>
                    <div>Metalle: {formatDeWert(currentDensity.metals)} t/m³</div>
                    <div>Gips: {formatDeWert(currentDensity.gypsum)} t/m³</div>
                    <div>Plastik: {formatDeWert(currentDensity.plastics)} t/m³</div>
                    <div>Gefahrstoffe: {formatDeWert(currentDensity.hazardous)} t/m³</div>
                    <div>Mischabfall: {formatDeWert(currentDensity.mixed)} t/m³</div>
                  </div>
                </div>
    
                <div>
                  <h5 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    Schritt 3: Berechnung der Einzelmassen (<FormulaText text="m_i = V \cdot \rho_i" />)
                  </h5>
                  <p className="mb-2 text-text-main/75 text-xs">
                    Die prognostizierten Massenströme ergeben sich direkt aus dem Produkt des Raumvolumens mit der jeweiligen Dichte. Beispiel für Betonbruch:
                  </p>
                  <FormulaText text={`m_{\\text{Beton}} = V \\cdot \\rho_{\\text{Beton}} = ${buildingVolume} \\text{ m}^3 \\cdot ${currentDensity.concrete} \\text{ t/m}^3 = ${massConcrete} \\text{ t}`} />
                </div>
    
                <div>
                  <h5 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    Schritt 4: Bestimmung der Gesamtmasse (<FormulaText text="m_{\text{ges}} = \sum m_i" />)
                  </h5>
                  <p className="mb-2 text-text-main/75 text-xs">
                    Die Summe aller Fraktionen ergibt das geschätzte Abbruchgewicht auf der Baustelle:
                  </p>
                  <FormulaText text={`m_{\\text{ges}} = ${formatDeTeXWert(massConcrete)} + ${formatDeTeXWert(massMasonry)} + ${formatDeTeXWert(massWood)} + ${formatDeTeXWert(massMetals)} + ${formatDeTeXWert(massPlastics)} + ${formatDeTeXWert(massGypsum)} + ${formatDeTeXWert(massHazardous)} + ${formatDeTeXWert(massMixed)} = ${formatDeTeXWert(totalMass)} \\text{ t}`} />
                </div>
    
                <div>
                  <h5 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    Schritt 5: Mineralischer Anteil (<FormulaText text="P_{\text{min}}" />) und Getrennthalte-Quote
                  </h5>
                  <p className="mb-2 text-text-main/75 text-xs">
                    Nach der Gewerbeabfallverordnung (GewAbfV) müssen Bauschuttfraktionen getrennt erfasst werden. Der mineralische Haupt-Massenstrom (Beton- und Mauerwerksbruch) beträgt:
                  </p>
                  <FormulaText text={`P_{\\text{min}} = \\frac{m_{\\text{Beton}} + m_{\\text{Mauerwerk}}}{m_{\\text{ges}}} \\cdot 100 = \\frac{${formatDeTeXWert(massConcrete)} + ${formatDeTeXWert(massMasonry)}}{${formatDeTeXWert(totalMass)}} \\cdot 100 \\approx ${formatDeTeXWert(mineralPercentage)} \\%`} />
                  <div className="mt-2 text-indigo-950 bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-lg text-xs">
                    <span className="font-bold font-semibold text-indigo-900 block mb-0.5">✓ Kreislauffähigkeit &amp; LfU-Konformität:</span>
                    Da der mineralische Anteil über 85% liegt ({formatDeWert(mineralPercentage)}%), ist dieses Bauwerk baustofflich prädestiniert für ein hochwertiges RC-Recycling nach der neuen Ersatzbaustoffverordnung (EBV) von 2023. Das sortenreine Rückbaukonzept ist zwingend umzusetzen, um eine unzulässige Vermischung zu verhindern.
                  </div>
                </div>
              </div>
            )}
          </div>
    
          <p className="text-xs text-home-grau mt-6 pt-4 border-t border-home-grau/10">
            *Hinweis zur Massenermittlung: Die berechneten Massen basieren auf statistischen Kennwerten für Brutto-Rauminhalte im Hochbau. Bei realitätsnahen Projekten ist das Vorlegen eines bauteilspezifischen Aufmaßes / Schadstoffgutachtens zwingend erforderlich.
          </p>
      </div>
    </div>
  );
}
