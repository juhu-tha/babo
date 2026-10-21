import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Monitor, Database, ArrowRight, Settings, FileCode, Layers, Eye, ShieldCheck, HelpCircle, Copy, Check, Download } from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';

interface MaterialArchetype {
  id: string;
  name: string;
  defaultDensity: number; // kg/m³
  defaultConductivity: number; // W/(m·K)
  defaultEModulus: number; // N/mm²
  defaultGwp: number; // kg CO2-eq / m³
  description: string;
  ifcClass: string;
}

const ARCHETYPES: MaterialArchetype[] = [
  {
    id: 'beton',
    name: 'Normalbeton C30/37',
    defaultDensity: 2400,
    defaultConductivity: 2.10,
    defaultEModulus: 33000,
    defaultGwp: 245.0,
    description: 'Klassischer mineralischer Baustoff mit hoher Tragfähigkeit, hoher thermischer Masse, aber signifikantem CO₂-Rucksack.',
    ifcClass: 'IfcMaterial'
  },
  {
    id: 'holz',
    name: 'Brettschichtholz (Fichte)',
    defaultDensity: 450,
    defaultConductivity: 0.13,
    defaultEModulus: 11000,
    defaultGwp: -480.0, // negative GWP due to biogenic carbon storage
    description: 'Nachwachsender Tragwerksbaustoff mit integriertem biogenem Kohlenstoffspeicher und hervorragendem Gewichts-Festigkeits-Verhältnis.',
    ifcClass: 'IfcMaterial'
  },
  {
    id: 'mineralwolle',
    name: 'Mineralwolle (Dämmung)',
    defaultDensity: 60,
    defaultConductivity: 0.035,
    defaultEModulus: 5,
    defaultGwp: 42.0,
    description: 'Hochleistungsdämmstoff zur thermischen Trennung und Minimierung der Transmissionswärmeverluste der thermischen Gebäudehülle.',
    ifcClass: 'IfcMaterial'
  },
  {
    id: 'stahl',
    name: 'Baustahl S355',
    defaultDensity: 7850,
    defaultConductivity: 50.0,
    defaultEModulus: 210000,
    defaultGwp: 1450.0,
    description: 'Duktiler Tragwerkswerkstoff mit exzellenten Festigkeitseigenschaften, unbegrenzt kreislauffähig (Modul D Gutschriften), aber hoher Primärenergieherstellung.',
    ifcClass: 'IfcMaterial'
  }
];

export default function BimBaustoffe() {
  const [selectedId, setSelectedId] = useState<string>('beton');
  const [density, setDensity] = useState<number>(2400);
  const [conductivity, setConductivity] = useState<number>(2.10);
  const [eModulus, setEModulus] = useState<number>(33000);
  const [gwp, setGwp] = useState<number>(245.0);
  const [copied, setCopied] = useState(false);

  const archetype = ARCHETYPES.find(a => a.id === selectedId) || ARCHETYPES[0];

  const handleArchetypeChange = (id: string) => {
    setSelectedId(id);
    const found = ARCHETYPES.find(a => a.id === id);
    if (found) {
      setDensity(found.defaultDensity);
      setConductivity(found.defaultConductivity);
      setEModulus(found.defaultEModulus);
      setGwp(found.defaultGwp);
    }
  };

  const generatedIfcString = `/* Bauteil-Zuweisungsstruktur für Building Information Modeling */
#100 = IFCWALL('2X3g5_w1S', #15, 'Aussenwand_Tragend', $, $, #101, $, $);
#110 = IFCMATERIAL('${archetype.name}');
#120 = IFCMATERIALCONSTITUENTSET('Schichtstruktur', $, (#130), $);
#130 = IFCMATERIALCONSTITUENT($, #110, $, $, 'Tragende Schicht');
#140 = IFCRELASSOCIATESMATERIAL('3J7y$', #15, 'Material_Assoc', $, (#100), #120);

/* Property-Set: Mechanische Werkstoffdaten fuer Statik */
#150 = IFCMATERIALPROPERTIES('Pset_MaterialCommon', $, (#160), #110);
#160 = IFCPROPERTYSINGLEVALUE('MassDensity', $, IFCMASSDENSITYMEASURE(${density.toFixed(1)}), $);
#155 = IFCMATERIALPROPERTIES('Pset_MaterialMechanical', $, (#170), #110);
#170 = IFCPROPERTYSINGLEVALUE('YoungModulus', $, IFCMODULUSOFELASTICITYMEASURE(${eModulus.toFixed(1)}), $);

/* Property-Set: Thermische Eigenschaften fuer Energiebilanz */
#180 = IFCMATERIALPROPERTIES('Pset_MaterialThermal', $, (#190), #110);
#190 = IFCPROPERTYSINGLEVALUE('ThermalConductivity', $, IFCTHERMALCONDUCTIVITYMEASURE(${conductivity.toFixed(3)}), $);

/* Projektspezifisches Property-Set (kein IFC-Standard-Pset): Umweltindikatoren aus EPD */
#200 = IFCMATERIALPROPERTIES('CPset_Umweltdaten', $, (#210), #110);
#210 = IFCPROPERTYSINGLEVALUE('GWP_A1_A3', $, IFCREAL(${gwp.toFixed(2)}), $);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedIfcString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedIfcString], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `material_${archetype.id}.ifc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Monitor className="text-shiraz animate-pulse" />
          BIM für Baustoffe
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Building Information Modeling (BIM) kennzeichnet den umfassenden digitalen Wandel im Bauwesen. Es ist mehr als 3D-CAD: BIM verknüpft geometrische Körper mit semantischen Eigenschaften (Sachdaten). Im digitalen Zwilling wird jeder Baustoff als exklusiver Informationsträger abgebildet.
          </p>
        </div>

        {/* Info Grid - Vom Strich zum Bauteil / Attribute */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 font-normal">
          <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 shadow-inner">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <Layers size={16} className="text-shiraz" />
              1. Semantische Tiefe (Vom Strich zum Bauteil)
            </h3>
            <p className="text-xs text-slate-705 leading-relaxed mb-3">
              Im klassischen 2D-CAD besteht eine Wand aus zwei nackten, parallelen Vektorlinien. Im BIM-Modell dagegen deklarieren wir ein intelligentes Bauteil-Objekt (z.B. <code className="bg-home-grau/20 px-1 py-0.5 rounded text-[11px] font-mono font-bold">IfcWall</code>), welches physikalisch determinierte Eigenschaften aufweist:
            </p>
            <ul className="text-xs text-slate-705 space-y-1.5 pl-4 list-disc">
              <li><strong>Materialzuweisung:</strong> Präzise Referenzierung konkreter Baustoffe.</li>
              <li><strong>Mehrschichtigkeit:</strong> Verknüpfung komplexer Materialschichten.</li>
              <li><strong>Mengen-Take-Off:</strong> Vollautomatische Massenberechnung aus der 3D-Geometrie für Kostenermittlungen.</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 shadow-inner">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <Settings size={16} className="text-shiraz" />
              2. Parameter-Sets je Fachdisziplin
            </h3>
            <p className="text-xs text-slate-705 leading-relaxed mb-3">
              Ein Baustoff im BIM-Prozess agiert als vernetztes Datenpaket, das von unterschiedlichen Projektbeteiligten gefüllt und ausgelesen wird:
            </p>
            <ul className="text-xs text-slate-705 space-y-1.5 pl-4 list-disc">
              <li><strong>Tragwerker:</strong> Festigkeitsklasse, Elastizitätsmodul, Querkontraktionszahl.</li>
              <li><strong>Bauphysiker:</strong> Wärmeleitfähigkeit (λ), Wasserdampfdiffusionswiderstand (μ).</li>
              <li><strong>Nachhaltigkeitsplaner (LCA):</strong> Globales Erwärmungspotenzial (GWP aus EPDs).</li>
              <li><strong>Facility Manager (FM):</strong> Reinigungszyklen, Wartungshinweise, Recyclingcodes.</li>
            </ul>
          </div>
        </div>

        {/* INTERACTIVE COMPONENT: IFC EXPRESS Property Generator */}
        <div className="border border-home-grau/30 rounded-2xl overflow-hidden mt-8 shadow-sm">
          <div className="bg-slate-100 p-4 border-b border-home-grau/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <FileCode className="text-shiraz" size={18} />
                Interaktiver OpenBIM-Attributgenerator (IFC 4 / 4.3)
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Simulieren Sie, wie Material-Fachparameter im offenen Standard IFC strukturiert werden.
          </p>
        </div>
            
            {/* Selection bar */}
            <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
              {ARCHETYPES.map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => handleArchetypeChange(arch.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                    selectedId === arch.id 
                      ? 'bg-shiraz text-white' 
                      : 'bg-white border border-home-grau/30 text-slate-705 hover:bg-slate-50'
                  }`}
                >
                  {arch.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Attribute Customizer Sliders */}
            <div className="lg:col-span-4 p-5 border-b lg:border-b-0 lg:border-r border-home-grau/30 bg-slate-50/50 flex flex-col justify-between font-normal">
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-xs text-shiraz mb-1.5">Materialbeschreibung</h4>
                  <p className="text-xs text-slate-705 leading-relaxed font-normal">{archetype.description}</p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Slider 1: Density */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-semibold text-slate-900">Rohdichte (MassDensity):</span>
                      <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(density)} kg/m³</span>
                    </div>
                    <input 
                      type="range" 
                      min={selectedId === 'mineralwolle' ? 20 : selectedId === 'holz' ? 300 : selectedId === 'stahl' ? 7000 : 1800} 
                      max={selectedId === 'mineralwolle' ? 200 : selectedId === 'holz' ? 900 : selectedId === 'stahl' ? 8500 : 3200} 
                      step={selectedId === 'mineralwolle' ? 5 : 10}
                      value={density} 
                      onChange={(e) => setDensity(Number(e.target.value))}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Slider 2: Conductivity */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-semibold text-slate-900">Wärmeleitfähigkeit (λ):</span>
                      <span className="font-mono text-xs text-shiraz font-bold">{formatDeZahl(conductivity, 3)} W/m·K</span>
                    </div>
                    <input 
                      type="range" 
                      min={selectedId === 'mineralwolle' ? 0.030 : selectedId === 'holz' ? 0.090 : selectedId === 'stahl' ? 30.0 : 1.20} 
                      max={selectedId === 'mineralwolle' ? 0.050 : selectedId === 'holz' ? 0.200 : selectedId === 'stahl' ? 65.0 : 3.00} 
                      step={selectedId === 'stahl' ? 1.0 : 0.005}
                      value={conductivity} 
                      onChange={(e) => setConductivity(Number(e.target.value))}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Slider 3: E-Modulus */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-semibold text-slate-900">Zylinder-E-Modulus:</span>
                      <span className="font-mono text-xs text-shiraz font-bold">{eModulus.toLocaleString('de-DE')} N/mm²</span>
                    </div>
                    <input 
                      type="range" 
                      min={selectedId === 'mineralwolle' ? 1 : selectedId === 'holz' ? 8000 : selectedId === 'stahl' ? 190000 : 25000} 
                      max={selectedId === 'mineralwolle' ? 20 : selectedId === 'holz' ? 16000 : selectedId === 'stahl' ? 230000 : 45000} 
                      step={selectedId === 'mineralwolle' ? 1 : selectedId === 'holz' ? 500 : selectedId === 'stahl' ? 5000 : 1000}
                      value={eModulus} 
                      onChange={(e) => setEModulus(Number(e.target.value))}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Slider 4: GWP */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        CO₂-GWP (A1-A3):
                        <InfoTooltip text="Treibhauspotenzial des Baustoffs (Global Warming Potential) aus der EPD." />
                      </span>
                      <span className="font-mono text-xs text-shiraz font-bold">{formatDeZahl(gwp, 1)} kg/m³</span>
                    </div>
                    <input 
                      type="range" 
                      min={selectedId === 'holz' ? -600 : selectedId === 'stahl' ? 500 : 10} 
                      max={selectedId === 'holz' ? -200 : selectedId === 'stahl' ? 2500 : 400} 
                      step={selectedId === 'stahl' ? 50 : 5}
                      value={gwp} 
                      onChange={(e) => setGwp(Number(e.target.value))}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/30 flex items-start gap-1.5 text-[10px] text-slate-500 bg-white p-2 rounded-lg border">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Diese Kennwerte steuern Berechnungs-Engines für Statik (E-Modul), GEG-U-Wert (Wärmeleitfähigkeit) und Ökobilanzierung (CO₂).</span>
              </div>
            </div>

            {/* Right Column: Schema Code Output with pseudo Syntax Highlighting */}
            <div className="lg:col-span-8 p-5 bg-gray-900 border-t lg:border-t-0 border-home-grau/30 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-xs text-gray-300 font-mono ml-2">IFC-EXPRESS Schema Physical File (.ifc)</span>
                </div>
                
                {/* Export & Copy actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-white hover:text-shiraz rounded text-[11px] font-bold font-mono transition-all border border-gray-700/50 cursor-pointer"
                    title="Code in Zwischenablage kopieren"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copied ? 'Kopiert!' : 'Kopieren'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-white hover:text-shiraz rounded text-[11px] font-bold font-mono transition-all border border-gray-700/50 cursor-pointer"
                    title="Als .ifc-Datei herunterladen"
                  >
                    <Download size={12} />
                    <span>Download</span>
                  </button>
                  <span className="text-[10px] bg-gray-800 text-gray-400 font-mono px-2 py-1 rounded font-bold uppercase border border-gray-750">ISO 10303-21</span>
                </div>
              </div>
              
              <div className="flex-1 bg-gray-950 p-4 rounded-xl font-mono text-[11px] leading-relaxed text-gray-300 overflow-x-auto whitespace-pre select-all shadow-inner">
                {/* Visualizing synthetic schema with customized token classes */}
                <div><span className="text-gray-500">/* Bauteil-Zuweisungsstruktur für Building Information Modeling */</span></div>
                <div>#100 = <span className="text-emerald-400 font-bold">IFCWALL</span>('2X3g5_w1S', #15, 'Aussenwand_Tragend', $, $, #101, $, $);</div>
                <div>#110 = <span className="text-emerald-400 font-bold">IFCMATERIAL</span>(<span className="text-amber-300">'{archetype.name}'</span>);</div>
                <div>#120 = <span className="text-emerald-400 font-bold">IFCMATERIALCONSTITUENTSET</span>('Schichtstruktur', $, (#130), $);</div>
                <div>#130 = <span className="text-emerald-400 font-bold">IFCMATERIALCONSTITUENT</span>($, #110, $, $, 'Tragende Schicht');</div>
                <div>#140 = <span className="text-emerald-400 font-bold">IFCRELASSOCIATESMATERIAL</span>('3J7y$', #15, 'Material_Assoc', $, (#100), #120);</div>
                <br />
                <div><span className="text-gray-500">/* Property-Set: Mechanische Werkstoffdaten fuer Statik */</span></div>
                <div>#150 = <span className="text-blue-400 font-bold">IFCMATERIALPROPERTIES</span>('Pset_MaterialCommon', $, (#160), #110);</div>
                <div>#155 = <span className="text-blue-400 font-bold">IFCMATERIALPROPERTIES</span>('Pset_MaterialMechanical', $, (#170), #110);</div>
                <div>#160 = <span className="text-pink-400 font-bold">IFCPROPERTYSINGLEVALUE</span>('MassDensity', $, <span className="text-yellow-400">IFCMASSDENSITYMEASURE</span>({formatDeZahl(density, 1)}), $);</div>
                <div>#170 = <span className="text-pink-400 font-bold">IFCPROPERTYSINGLEVALUE</span>('YoungModulus', $, <span className="text-yellow-400">IFCMODULUSOFELASTICITYMEASURE</span>({formatDeZahl(eModulus, 1)}), $);</div>
                <br />
                <div><span className="text-gray-500">/* Property-Set: Thermische Eigenschaften fuer Energiebilanz */</span></div>
                <div>#180 = <span className="text-blue-400 font-bold">IFCMATERIALPROPERTIES</span>('Pset_MaterialThermal', $, (#190), #110);</div>
                <div>#190 = <span className="text-pink-400 font-bold">IFCPROPERTYSINGLEVALUE</span>('ThermalConductivity', $, <span className="text-yellow-400">IFCTHERMALCONDUCTIVITYMEASURE</span>({formatDeZahl(conductivity, 3)}), $);</div>
                <br />
                <div><span className="text-gray-500">/* Projektspezifisches Property-Set (kein IFC-Standard-Pset): Umweltindikatoren aus EPD */</span></div>
                <div>#200 = <span className="text-blue-400 font-bold">IFCMATERIALPROPERTIES</span>('CPset_Umweltdaten', $, (#210), #110);</div>
                <div>#210 = <span className="text-pink-400 font-bold">IFCPROPERTYSINGLEVALUE</span>('GWP_A1_A3', $, <span className="text-yellow-400">IFCREAL</span>({formatDeZahl(gwp, 2)}), $);</div>
              </div>

              {/* Explanatory footer */}
              <div className="mt-3 text-[10px] text-gray-300 font-normal leading-relaxed">
                <span className="text-shiraz font-bold">Info:</span> In der IFC-Datei werden Geometrie-Objekte (<span className="text-mono bg-gray-800 text-gray-300 px-1 py-0.2 rounded">IFCWALL</span>) über Beziehungsentitäten (<span className="text-mono bg-gray-800 text-gray-300 px-1 py-0.2 rounded">IFCREL...</span>) sauber von Materialressourcen (<span className="text-mono bg-gray-800 text-gray-300 px-1 py-0.2 rounded">IFCMATERIAL</span>) und Attribut-Sets (<span className="text-mono bg-gray-800 text-gray-300 px-1 py-0.2 rounded">Pset_*</span>) getrennt deklariert. Dies ermöglicht vollkommene M2M-Dateninteroperabilität.
              </div>
            </div>

          </div>
        </div>

        {/* EPDs und BIM explanation diagram */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2">EPDs und BIM (Building Lifecycle Assessment)</h3>
          <p className="text-sm text-slate-705 font-normal">
            Um ein automatisiertes Lifecycle Assessment (Gebäude-LCA) durchzuführen, verknüpfen moderne Ökobilanzierungstools (wie One Click LCA oder CAALA) direkt die geometrischen Massen aus dem BIM-Modell mit den parametrischen Daten aus Umweltproduktdeklarationen (EPDs):
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-between font-normal">
             <div className="flex-1 flex items-center gap-3 p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200">
               <Database className="text-blue-700 shrink-0" size={20} />
               <div className="text-xs">
                 <strong className="block text-blue-900 font-bold">1. BIM-Modell (OpenBIM)</strong>
                 <span className="text-blue-800/85">Bereitstellung exakter Bauteil-Volumina (m³) und Massen (kg) über IFC-Mengen-Take-Off.</span>
               </div>
             </div>
             
             <div className="flex items-center justify-center text-slate-500 text-lg font-bold shrink-0">X</div>
             
             <div className="flex-1 flex items-center gap-3 p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
               <Database className="text-emerald-700 shrink-0" size={20} />
               <div className="text-xs">
                 <strong className="block text-emerald-900 font-bold">2. EPD-Datenbank (z.B. ÖKOBAUDAT)</strong>
                 <span className="text-emerald-800/85">Schnittstelle (REST-API) liefert normgerechte CO₂-Faktoren (kg CO₂-eq pro m³ oder kg) je Baustoff.</span>
               </div>
             </div>
             
             <div className="flex items-center justify-center text-slate-500 text-lg font-bold shrink-0">=</div>
             
             <div className="flex-1 flex items-center justify-center text-center p-3 bg-shiraz/10 text-shiraz font-bold rounded-xl border border-shiraz/30 flex-col gap-1">
               <span className="text-xs uppercase tracking-wider font-bold text-shiraz/80">Resultat</span>
               <span className="text-sm font-bold">Automatisierte Gebäude-Ökobilanzierung (LCA)</span>
             </div>
          </div>
        </div>

      </div>
      
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Treibhauspotenzial einer Wand aus dem BIM-Mengengerüst"
        zielGleichung="GWP = V \cdot gwp_{V}"
        schritte={[
          { titel: 'Menge aus dem Modell', erklaerung: 'IfcWall 12,0 m × 3,0 m × 0,24 m, Material Stahlbeton:', formel: 'V = 12{,}0 \\cdot 3{,}0 \\cdot 0{,}24 = 8{,}64\\,\\text{m}^3' },
          { titel: 'EPD-Kennwert', erklaerung: 'Volumenbezogener GWP-Wert der Module A1–A3 aus einer verknüpften EPD (Lehrwert):', formel: 'gwp_V = 280\\,\\text{kg CO}_2\\text{e/m}^3' },
          { titel: 'Ergebnis', erklaerung: 'Herstellungsphase der Wand:', formel: 'GWP_{A1\\text{–}A3} = 8{,}64 \\cdot 280 = 2\\,419\\,\\text{kg CO}_2\\text{e}' }
        ]}
        ergebnisHinweis="Die Rechnung ist nur so gut wie die Verknüpfung: Modelle müssen Netto-Volumen (ohne Öffnungen, ohne Doppelzählung an Wandanschlüssen) und eindeutige Material-IDs liefern. Bewehrung wird getrennt bilanziert."
        normQuelle="DIN EN 15804+A2; ISO 16739-1:2024 (IFC 4.3)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: U-Wert eines mehrschichtigen Bauteils aus den Materialattributen"
        zielGleichung="U = \frac{1}{R_{si} + \sum d_j/\lambda_j + R_{se}}"
        schritte={[
          { titel: 'Schichten', erklaerung: 'Innenputz 15 mm (λ = 0,70), Stahlbeton 200 mm (λ = 2,3), Mineralwolle 160 mm (λ = 0,035) W/(mK):', formel: '\\sum \\frac{d}{\\lambda} = 0{,}021 + 0{,}087 + 4{,}571 = 4{,}680' },
          { titel: 'Übergangswiderstände', erklaerung: 'Horizontaler Wärmestrom:', formel: 'R_T = 0{,}13 + 4{,}680 + 0{,}04 = 4{,}85\\,\\text{m}^2\\text{K/W}' },
          { titel: 'U-Wert', erklaerung: 'Kehrwert:', formel: 'U = \\frac{1}{4{,}85} = 0{,}21\\,\\text{W/(m}^2\\text{K)}' }
        ]}
        ergebnisHinweis="λ gehört als Bemessungswert in die Material-Property ThermalConductivity (Pset_MaterialThermal); ohne gepflegte Attribute ist eine automatische Auswertung nicht möglich."
        normQuelle="DIN EN ISO 6946:2018-03; IFC 4.3"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bim_baustoffe" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 13 Digitales: IFC-Property-Sets (Pset_MaterialCommon, YoungModulus, keine Fantasie-Psets), Normausgaben und Literatur geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Building Information Modeling', url: 'https://de.wikipedia.org/wiki/Building_Information_Modeling' },
          { title: 'Industry Foundation Classes', url: 'https://de.wikipedia.org/wiki/Industry_Foundation_Classes' }
        ]}
        literatur={[
          'Borrmann, A.; König, M.; Koch, C.; Beetz, J. (Hrsg.): Building Information Modeling – Technologische Grundlagen und industrielle Praxis. 2. Aufl., Wiesbaden: Springer Vieweg 2021',
          'buildingSMART International: IFC4.3 Spezifikationen und Pset-Definitionen'
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 19650-1/-2:2019-08 (Informationsmanagement mit BIM)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+19650' },
          { title: 'ISO 16739-1:2024 (Industry Foundation Classes, IFC 4.3)', url: 'https://www.iso.org/' },
          { title: 'DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarationen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15804' }
        ]}
        weblinks={[
          { title: 'thatOpen Company – Open-Source WebGL IFC Viewer', url: 'https://thatopen.com/' },
          { title: 'BIM-Portal des Bundes – Standardisierte Merkmalskataloge' },
          { title: 'Geoportal.de – Amtliche Geodaten & Geländemodelle', url: 'https://www.geoportal.de/' },
          { title: 'Calcpad – Parametrische Eurocode-Berechnungen', url: 'https://calcpad.eu/' }
        ]}
        formeln={[
          {
            formel: 'm_i = V_i \\cdot \\rho_i \\quad [\\text{kg}], \\quad GWP_i = m_i \\cdot gwp_{\\text{spec},i} \\quad [\\text{kg CO}_2\\text{-eq}]',
            erklaerung: 'Mengenermittlung aus dem BIM-Attributmodell (Volumen V und Rohdichte MassDensity) multipliziert mit dem spezifischen Treibhauspotenzial gwp der verknüpften EPD.',
            quelle: 'DIN EN 15804 / IFC Mengen-Takeoff'
          },
          {
            formel: 'U = \\frac{1}{R_{si} + \\sum_{j=1}^n \\frac{d_j}{\\lambda_j} + R_{se}} \\quad [\\text{W/(m}^2\\cdot\\text{K)}]',
            erklaerung: 'Wärmedurchgangskoeffizient mehrschichtiger BIM-Bauteile (IfcWallStandardCase) aus den thermischen Materialeigenschaften.',
            quelle: 'DIN EN ISO 6946'
          }
        ]}
      />
    </div>
  );
}
