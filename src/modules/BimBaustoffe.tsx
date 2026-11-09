import { formatDeZahl, formatDeWert, formatDeIntl } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Monitor, Database, Settings, FileCode, Layers, ShieldCheck, Copy, Check, Download } from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import inhalt from '@/content/bimbaustoffe/BimBaustoffe.json';
import { GWP_LEHRWERTE, PROFILSTAHL_HINWEIS, type GwpLehrwertSchluessel } from '@/src/data/gwpLehrwerte';
import { gwpRegler } from '@/src/modules/bimbaustoffe/gwpRegler';
import { MdText } from '@/src/components/inhalt/MdText';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

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

// Beton C30/37 und BSH aus der gemeinsamen Lehrwerttabelle (Konsistenz 29.10.2026, F-4); Baustahl S355 (Walzprofile) mit dem
// zentralen Profilstahl-Lehrwert 1,1 kg CO₂-Äq./kg (Entscheidung 29.10.2026, NP2-ST-2) statt 0,64 kg/kg (Betonstahl-Referenz),
// je m³ über die Rohdichte der Voreinstellung (Durchsicht B 29.10.2026, DSB-BIM-1); Mineralwolle 1,20 kg/kg zentral
// (Umsetzung 30.10.2026, DSB-LC-10) · 60 kg/m³ = 72
const AUS_LEHRWERTTABELLE: Partial<Record<string, GwpLehrwertSchluessel>> = { beton: 'betonC3037CemI', holz: 'bsh', stahl: 'profilstahl', mineralwolle: 'mineralwolle' };
const ARCHETYPES: MaterialArchetype[] = inhalt.daten.ARCHETYPES.map(a => {
  const s = AUS_LEHRWERTTABELLE[a.id];
  if (!s) return a;
  const w = GWP_LEHRWERTE[s];
  // Holz: Rohdichte der Voreinstellung = Rohdichte des BSH-Lehrwerts (480 kg/m³, DIN EN 16449), damit Rohdichte, GWP −680
  // und IFC-Ausgabe zusammenpassen (Umsetzung 02.11.2026; vorher 450 kg/m³)
  const defaultDensity = s === 'bsh' ? w.rohdichte : a.defaultDensity;
  return { ...a, defaultDensity, defaultGwp: w.einheit === 't' ? Math.round((w.gwp / 1000) * defaultDensity) : w.gwp };
});

export default function BimBaustoffe() {
  const [selectedId, setSelectedId] = useState<string>('beton');
  const [density, setDensity] = useState<number>(2400);
  const [conductivity, setConductivity] = useState<number>(2.10);
  const [eModulus, setEModulus] = useState<number>(33000);
  const [gwp, setGwp] = useState<number>(ARCHETYPES[0].defaultGwp);
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

  // IFC: keine Zahl (leeres Feld) → Wert „$“ (nicht gesetzt nach ISO 10303-21) statt „MEASURE(NaN)“ (Prüfung 02.11.2026)
  const ifcWert = (typ: string, x: number, n: number) => (Number.isFinite(x) ? `${typ}(${x.toFixed(n)})` : '$');
  const generatedIfcString = `/* Bauteil-Zuweisungsstruktur für Building Information Modeling */
#100 = IFCWALL('2X3g5_w1S', #15, 'Aussenwand_Tragend', $, $, #101, $, $);
#110 = IFCMATERIAL('${archetype.name}');
#120 = IFCMATERIALCONSTITUENTSET('Schichtstruktur', $, (#130), $);
#130 = IFCMATERIALCONSTITUENT($, #110, $, $, 'Tragende Schicht');
#140 = IFCRELASSOCIATESMATERIAL('3J7y$', #15, 'Material_Assoc', $, (#100), #120);

/* Property-Set: Mechanische Werkstoffdaten fuer Statik */
/* Einheiten: IFC rechnet in SI (MassDensity kg/m3, YoungModulus Pa); E in MPa nur mit passender IFCUNITASSIGNMENT (PRESSUREUNIT, Praefix MEGA) */
#150 = IFCMATERIALPROPERTIES('Pset_MaterialCommon', $, (#160), #110);
#160 = IFCPROPERTYSINGLEVALUE('MassDensity', $, ${ifcWert('IFCMASSDENSITYMEASURE', density, 1)}, $);
#155 = IFCMATERIALPROPERTIES('Pset_MaterialMechanical', $, (#170), #110);
#170 = IFCPROPERTYSINGLEVALUE('YoungModulus', $, ${ifcWert('IFCMODULUSOFELASTICITYMEASURE', eModulus, 1)}, $);

/* Property-Set: Thermische Eigenschaften fuer Energiebilanz */
#180 = IFCMATERIALPROPERTIES('Pset_MaterialThermal', $, (#190), #110);
#190 = IFCPROPERTYSINGLEVALUE('ThermalConductivity', $, ${ifcWert('IFCTHERMALCONDUCTIVITYMEASURE', conductivity, 3)}, $);

/* Projektspezifisches Property-Set (kein IFC-Standard-Pset): Umweltindikatoren aus EPD */
#200 = IFCMATERIALPROPERTIES('CPset_Umweltdaten', $, (#210), #110);
#210 = IFCPROPERTYSINGLEVALUE('GWP_A1_A3', $, ${ifcWert('IFCREAL', gwp, 2)}, $);`;

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
          <Monitor className="text-shiraz animate-pulse" /><MdText text={inhalt.texte.bimFürBaustoffe} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.buildingInformationModelingBim} /></p>
        </div>

        {/* Info Grid - Vom Strich zum Bauteil / Attribute */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 font-normal">
          <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 shadow-inner">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <Layers size={16} className="text-shiraz" /><MdText text={inhalt.texte.t1SemantischeTiefeVom} /></h3>
            <p className="text-xs text-slate-700 leading-relaxed mb-3"><MdText text={inhalt.texte.imKlassischen2dCad} /><code className="bg-home-grau/20 px-1 py-0.5 rounded text-[11px] font-mono font-bold">IfcWall</code><MdText text={inhalt.texte.welchesPhysikalischDeterminierteEigensch} /></p>
            <ul className="text-xs text-slate-700 space-y-1.5 pl-4 list-disc">
              <li><MdText text={inhalt.texte.materialzuweisungPräziseReferenzierungKo} /></li>
              <li><MdText text={inhalt.texte.mehrschichtigkeitVerknüpfungKomplexerMat} /></li>
              <li><MdText text={inhalt.texte.mengenTakeOffVollautomatische} /></li>
            </ul>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 shadow-inner">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <Settings size={16} className="text-shiraz" /><MdText text={inhalt.texte.t2ParameterSetsJe} /></h3>
            <p className="text-xs text-slate-700 leading-relaxed mb-3"><MdText text={inhalt.texte.einBaustoffImBim} /></p>
            <ul className="text-xs text-slate-700 space-y-1.5 pl-4 list-disc">
              <li><MdText text={inhalt.texte.tragwerkerFestigkeitsklasseElastizitätsm} /></li>
              <li><MdText text={inhalt.texte.bauphysikerWärmeleitfähigkeitWasserdampf} /></li>
              <li><MdText text={inhalt.texte.nachhaltigkeitsplanerLcaGlobalesErwärmun} /></li>
              <li><MdText text={inhalt.texte.facilityManagerFmReinigungszyklen} /></li>
            </ul>
          </div>
        </div>

        {/* INTERACTIVE COMPONENT: IFC EXPRESS Property Generator */}
        <div className="border border-home-grau/30 rounded-2xl overflow-hidden mt-8 shadow-sm">
          <div className="bg-slate-100 p-4 border-b border-home-grau/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <FileCode className="text-shiraz" size={18} /><MdText text={inhalt.texte.interaktiverOpenbimAttributgeneratorIfc} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.simulierenSieWieMaterial} /></p>
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
                      : 'bg-white border border-home-grau/30 text-slate-700 hover:bg-slate-50'
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
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">{archetype.description}</p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Slider 1: Density */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-semibold text-slate-900"><MdText text={inhalt.texte.rohdichteMassdensity} /></span>
                      <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(density)} kg/m³</span>
                    </div>
                    <input 
                      type="range" 
                      min={selectedId === 'mineralwolle' ? 20 : selectedId === 'holz' ? 300 : selectedId === 'stahl' ? 7000 : 1800} 
                      max={selectedId === 'mineralwolle' ? 200 : selectedId === 'holz' ? 900 : selectedId === 'stahl' ? 8500 : 3200} 
                      step={selectedId === 'mineralwolle' ? 5 : 10}
                      value={density} 
                      aria-label="Rohdichte"
                      aria-valuetext={`${formatDeWert(density)} kg/m³`}
                      onChange={(e) => setDensity(Number(e.target.value))}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Slider 2: Conductivity */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-semibold text-slate-900"><MdText text={inhalt.texte.wärmeleitfähigkeit} /></span>
                      <span className="font-mono text-xs text-shiraz font-bold">{formatDeZahl(conductivity, 3)} W/m·K</span>
                    </div>
                    <input 
                      type="range" 
                      min={selectedId === 'mineralwolle' ? 0.030 : selectedId === 'holz' ? 0.090 : selectedId === 'stahl' ? 30.0 : 1.20} 
                      max={selectedId === 'mineralwolle' ? 0.050 : selectedId === 'holz' ? 0.200 : selectedId === 'stahl' ? 65.0 : 3.00} 
                      step={selectedId === 'stahl' ? 1.0 : 0.005}
                      value={conductivity} 
                      aria-label="Wärmeleitfähigkeit"
                      aria-valuetext={`${formatDeZahl(conductivity, 3)} W/(m·K)`}
                      onChange={(e) => setConductivity(Number(e.target.value))}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Slider 3: E-Modulus */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-semibold text-slate-900">Zylinder-E-Modulus:</span>
                      <span className="font-mono text-xs text-shiraz font-bold">{formatDeIntl(eModulus)} N/mm²</span>
                    </div>
                    <input 
                      type="range" 
                      min={selectedId === 'mineralwolle' ? 1 : selectedId === 'holz' ? 8000 : selectedId === 'stahl' ? 190000 : 25000} 
                      max={selectedId === 'mineralwolle' ? 20 : selectedId === 'holz' ? 16000 : selectedId === 'stahl' ? 230000 : 45000} 
                      step={selectedId === 'mineralwolle' ? 1 : selectedId === 'holz' ? 500 : selectedId === 'stahl' ? 5000 : 1000}
                      value={eModulus} 
                      aria-label="E-Modul"
                      aria-valuetext={`${formatDeIntl(eModulus)} N/mm²`}
                      onChange={(e) => setEModulus(Number(e.target.value))}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Slider 4: GWP */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-semibold text-slate-900 flex items-center gap-1"><MdText text={inhalt.texte.coGwpA1A3} /><InfoTooltip text={inhalt.werte.treibhauspotenzialDesBaustoffsGlobal} />
                      </span>
                      <span className="font-mono text-xs text-shiraz font-bold">{formatDeZahl(gwp, 1)} kg CO₂-Äq./m³</span>
                    </div>
                    <input 
                      type="range" 
                      min={gwpRegler(selectedId).min}
                      max={gwpRegler(selectedId).max}
                      step={gwpRegler(selectedId).step}
                      value={gwp} 
                      aria-label="GWP A1–A3"
                      aria-valuetext={`${formatDeZahl(gwp, 1)} kg CO₂-Äq./m³`}
                      onChange={(e) => setGwp(Number(e.target.value))}
                      className="cursor-pointer"
                    />
                    {selectedId === 'stahl' && (
                      <p className="text-[10px] text-slate-600 mt-1">Lehrwert Profilstahl {formatDeZahl(GWP_LEHRWERTE.profilstahl.gwp / 1000, 1)} kg CO₂e/kg · Rohdichte; {PROFILSTAHL_HINWEIS}.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/30 flex items-start gap-1.5 text-[10px] text-slate-500 bg-white p-2 rounded-lg border">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><MdText text={inhalt.texte.dieseKennwerteSteuernBerechnungs} /></span>
              </div>
            </div>

            <ErgebnisAnsage text={`IFC-Datensatz aktualisiert: ${kurzzeile(ansageWert('Rohdichte', density, 'frei', 'kg/m³'), ansageWert('Wärmeleitfähigkeit', conductivity, 3, 'W/(m·K)'),
              ansageWert('E-Modul', eModulus, 0, 'N/mm²'), ansageWert('GWP', gwp, 1, 'kg CO₂-Äq./m³'))}`} />
            {/* Right Column: Schema Code Output with pseudo Syntax Highlighting */}
            <div className="lg:col-span-8 p-5 bg-off-white border-t lg:border-t-0 border-home-grau/30 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-xs text-slate-700 font-mono ml-2"><MdText text={inhalt.texte.ifcExpressSchemaPhysical} /></span>
                </div>
                
                {/* Export & Copy actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-text-main hover:text-shiraz rounded text-[11px] font-bold font-mono transition-all border border-home-grau/30 cursor-pointer"
                    title={inhalt.werte.codeInZwischenablageKopieren}
                  >
                    {copied ? <Check size={12} className="text-emerald-700" /> : <Copy size={12} />}
                    <span>{copied ? 'Kopiert!' : 'Kopieren'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-text-main hover:text-shiraz rounded text-[11px] font-bold font-mono transition-all border border-home-grau/30 cursor-pointer"
                    title={inhalt.werte.alsIfcDateiHerunterladen}
                  >
                    <Download size={12} />
                    <span>Download</span>
                  </button>
                  <span className="text-[10px] bg-white text-slate-600 font-mono px-2 py-1 rounded font-bold uppercase border border-home-grau/30"><MdText text={inhalt.texte.iso1030321} /></span>
                </div>
              </div>
              
              <div className="flex-1 bg-white border border-home-grau/30 p-4 rounded-xl font-mono text-[11px] leading-relaxed text-slate-700 overflow-x-auto whitespace-pre select-all shadow-inner">
                {/* Visualizing synthetic schema with customized token classes */}
                <div><span className="text-slate-600"><MdText text={inhalt.texte.bauteilZuweisungsstrukturFürBuilding} /></span></div>
                <div>#100 = <span className="text-emerald-700 font-bold">IFCWALL</span><MdText text={inhalt.texte.t2x3g5W1s15Aussenwand} /></div>
                <div>#110 = <span className="text-emerald-700 font-bold">IFCMATERIAL</span>(<span className="text-amber-700">'{archetype.name}'</span>);</div>
                <div>#120 = <span className="text-emerald-700 font-bold">IFCMATERIALCONSTITUENTSET</span><MdText text={inhalt.texte.schichtstruktur130} /></div>
                <div>#130 = <span className="text-emerald-700 font-bold">IFCMATERIALCONSTITUENT</span><MdText text={inhalt.texte.t110TragendeSchicht} /></div>
                <div>#140 = <span className="text-emerald-700 font-bold">IFCRELASSOCIATESMATERIAL</span><MdText text={inhalt.texte.t3j7y15MaterialAssoc} /></div>
                <br />
                <div><span className="text-slate-600"><MdText text={inhalt.texte.propertySetMechanischeWerkstoffdaten} /></span></div>
                <div>#150 = <span className="text-blue-700 font-bold">IFCMATERIALPROPERTIES</span><MdText text={inhalt.texte.psetMaterialcommon160110} /></div>
                <div>#155 = <span className="text-blue-700 font-bold">IFCMATERIALPROPERTIES</span><MdText text={inhalt.texte.psetMaterialmechanical170110} /></div>
                <div>#160 = <span className="text-pink-700 font-bold">IFCPROPERTYSINGLEVALUE</span><MdText text={inhalt.texte.massdensity} /><span className="text-yellow-700">IFCMASSDENSITYMEASURE</span>({formatDeZahl(density, 1)}), $);</div>
                <div>#170 = <span className="text-pink-700 font-bold">IFCPROPERTYSINGLEVALUE</span><MdText text={inhalt.texte.youngmodulus} /><span className="text-yellow-700">IFCMODULUSOFELASTICITYMEASURE</span>({formatDeZahl(eModulus, 1)}), $);</div>
                <br />
                <div><span className="text-slate-600"><MdText text={inhalt.texte.propertySetThermischeEigenschaften} /></span></div>
                <div>#180 = <span className="text-blue-700 font-bold">IFCMATERIALPROPERTIES</span><MdText text={inhalt.texte.psetMaterialthermal190110} /></div>
                <div>#190 = <span className="text-pink-700 font-bold">IFCPROPERTYSINGLEVALUE</span><MdText text={inhalt.texte.thermalconductivity} /><span className="text-yellow-700">IFCTHERMALCONDUCTIVITYMEASURE</span>({formatDeZahl(conductivity, 3)}), $);</div>
                <br />
                <div><span className="text-slate-600"><MdText text={inhalt.texte.projektspezifischesPropertySetKein} /></span></div>
                <div>#200 = <span className="text-blue-700 font-bold">IFCMATERIALPROPERTIES</span><MdText text={inhalt.texte.cpsetUmweltdaten210110} /></div>
                <div>#210 = <span className="text-pink-700 font-bold">IFCPROPERTYSINGLEVALUE</span><MdText text={inhalt.texte.gwpA1A3} /><span className="text-yellow-700">IFCREAL</span>({formatDeZahl(gwp, 2)}), $);</div>
              </div>

              {/* Explanatory footer */}
              <div className="mt-3 text-[10px] text-slate-700 font-normal leading-relaxed">
                <span className="text-shiraz font-bold">Info:</span><MdText text={inhalt.texte.inDerIfcDatei} /><span className="text-mono bg-white text-slate-700 px-1 py-0.2 rounded">IFCWALL</span><MdText text={inhalt.texte.überBeziehungsentitäten} /><span className="text-mono bg-white text-slate-700 px-1 py-0.2 rounded">IFCREL...</span><MdText text={inhalt.texte.sauberVonMaterialressourcen} /><span className="text-mono bg-white text-slate-700 px-1 py-0.2 rounded">IFCMATERIAL</span><MdText text={inhalt.texte.undAttributSets} /><span className="text-mono bg-white text-slate-700 px-1 py-0.2 rounded">Pset_*</span><MdText text={inhalt.texte.getrenntDeklariertDiesErmöglicht} /></div>
            </div>

          </div>
        </div>

        {/* EPDs und BIM explanation diagram */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.epdsUndBimBuilding} /></h3>
          <p className="text-sm text-slate-700 font-normal"><MdText text={inhalt.texte.umEinAutomatisiertesLifecycle} /></p>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-between font-normal">
             <div className="flex-1 flex items-center gap-3 p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200">
               <Database className="text-blue-700 shrink-0" size={20} />
               <div className="text-xs">
                 <strong className="block text-blue-900 font-bold"><MdText text={inhalt.texte.t1BimModellOpenbim} /></strong>
                 <span className="text-blue-800/85"><MdText text={inhalt.texte.bereitstellungExakterBauteilVolumina} /></span>
               </div>
             </div>
             
             <div className="flex items-center justify-center text-slate-500 text-lg font-bold shrink-0">X</div>
             
             <div className="flex-1 flex items-center gap-3 p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
               <Database className="text-emerald-700 shrink-0" size={20} />
               <div className="text-xs">
                 <strong className="block text-emerald-900 font-bold"><MdText text={inhalt.texte.t2EpdDatenbankZ} /></strong>
                 <span className="text-emerald-800/85"><MdText text={inhalt.texte.schnittstelleRestApiLiefert} /></span>
               </div>
             </div>
             
             <div className="flex items-center justify-center text-slate-500 text-lg font-bold shrink-0">=</div>
             
             <div className="flex-1 flex items-center justify-center text-center p-3 bg-shiraz/10 text-shiraz font-bold rounded-xl border border-shiraz/30 flex-col gap-1">
               <span className="text-xs uppercase tracking-wider font-bold text-shiraz/80">Resultat</span>
               <span className="text-sm font-bold"><MdText text={inhalt.texte.automatisierteGebäudeÖkobilanzierungLca} /></span>
             </div>
          </div>
        </div>

      </div>
      
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1TreibhauspotenzialEiner}
        zielGleichung="GWP = V \cdot gwp_{V}"
        schritte={inhalt.daten["BimBaustoffe.schritte"]}
        ergebnisHinweis={inhalt.werte.dieRechnungIstNur}
        normQuelle={inhalt.werte.dinEn15804A2}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2UWert}
        zielGleichung="U = \frac{1}{R_{si} + \sum d_j/\lambda_j + R_{se}}"
        schritte={inhalt.daten["BimBaustoffe.schritte_2"]}
        ergebnisHinweis={inhalt.werte.gehörtAlsBemessungswertIn}
        normQuelle={inhalt.werte.dinEnIso6946}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bim_baustoffe" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap13} 
        wikipedia={[
          { title: inhalt.werte.buildingInformationModeling, url: 'https://de.wikipedia.org/wiki/Building_Information_Modeling' },
          { title: inhalt.werte.industryFoundationClasses, url: 'https://de.wikipedia.org/wiki/Industry_Foundation_Classes' }
        ]}
        literatur={inhalt.daten["BimBaustoffe.literatur"]}
        regelwerke={inhalt.daten["BimBaustoffe.regelwerke"]}
        weblinks={inhalt.daten["BimBaustoffe.weblinks"]}
        formeln={inhalt.daten["BimBaustoffe.formeln"]}
      />
    </div>
  );
}
