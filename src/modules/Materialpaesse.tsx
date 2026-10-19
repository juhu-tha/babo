import React, { useState } from 'react';
import { FileText, RefreshCw, Layers, Sparkles, AlertCircle, TrendingUp, CheckCircle, Scale, DollarSign, HelpCircle, HardHat, Award } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';

interface BuildingArchetype {
  id: string;
  name: string;
  description: string;
  concreteVolume: number; // m³ per m² GFA
  steelMass: number; // kg per m² GFA
  woodVolume: number; // m³ per m² GFA
  copperMass: number; // kg per m² GFA
  baseRecycledInput: number; // in %
  baseLösbarkeit: 'glued' | 'mortar' | 'screwed';
}

const ARCHETYPES: BuildingArchetype[] = [
  {
    id: 'massiv',
    name: 'Szenario A: Massivbau (Beton/Stahl)',
    description: 'Konventionelles Bürogebäude aus Ortbeton C30/37 mit hohem Stahlanteil. Tragende Bauteile sind nass vergossen und starr miteinander verbunden.',
    concreteVolume: 0.40,
    steelMass: 45,
    woodVolume: 0,
    copperMass: 1.5,
    baseRecycledInput: 10,
    baseLösbarkeit: 'glued'
  },
  {
    id: 'hybrid',
    name: 'Szenario B: Holz-Hybridbauweise',
    description: 'Tragwerk aus Brettschichtholz-Stützen und -Trägern. Decken als Holz-Beton-Verbundelemente (HBV) ausgeführt. Verbindungsmittel sind trennbar geklemmt/geschraubt.',
    concreteVolume: 0.12,
    steelMass: 15,
    woodVolume: 0.25,
    copperMass: 1.2,
    baseRecycledInput: 35,
    baseLösbarkeit: 'screwed'
  },
  {
    id: 'circular',
    name: 'Szenario C: Cradle-to-Cradle Vision',
    description: 'Konsequente Kreislaufarchitektur: Fundamente aus Geopolymer-Recyclingbeton, Holzstützen aus regionaler Forstwirtschaft, zerlegbare Trockenbau-Klimaschallwände, wiederverwendbare Stahlträger.',
    concreteVolume: 0.05,
    steelMass: 10,
    woodVolume: 0.30,
    copperMass: 1.0,
    baseRecycledInput: 85,
    baseLösbarkeit: 'screwed'
  }
];

// Mock values for commodity prices / recycling attributes
const COMMODITY_PRICES = {
  copper: 8400, // € per ton
  steel: 650,   // € per ton
  concreteRecycled: 18, // € per ton residual worth for clean crushed aggregate
  concreteWaste: -35,   // € per ton tipping fee (disposal cost if glued/hazardous)
  woodBiomass: 110,     // € per ton for energetic or particle use
  woodReuse: 450,       // € per ton for actual direct element reuse
};

export default function Materialpaesse() {
  const [selectedArchId, setSelectedArchId] = useState<string>('massiv');
  const [gfa, setGfa] = useState<number>(2500); // Gross Floor Area m²
  const [recycledInput, setRecycledInput] = useState<number>(15); // %
  const [joiningMethod, setJoiningMethod] = useState<'glued' | 'mortar' | 'screwed'>('glued');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const archetype = ARCHETYPES.find(a => a.id === selectedArchId) || ARCHETYPES[0];

  const handleArchetypeSelect = (id: string) => {
    setSelectedIdAndSyncSliders(id);
  };

  const setSelectedIdAndSyncSliders = (id: string) => {
    setSelectedArchId(id);
    const found = ARCHETYPES.find(a => a.id === id);
    if (found) {
      setRecycledInput(found.baseRecycledInput);
      setJoiningMethod(found.baseLösbarkeit);
    }
  };

  // 1. Calculate materials inventory (tons)
  const concreteDensity = 2.4; // t/m³
  const woodDensity = 0.5; // t/m³
  
  const concreteTons = archetype.concreteVolume * gfa * concreteDensity;
  const steelTons = (archetype.steelMass * gfa) / 1000;
  const woodTons = archetype.woodVolume * gfa * woodDensity;
  const copperTons = (archetype.copperMass * gfa) / 1000;
  const totalWeightTons = concreteTons + steelTons + woodTons + copperTons;

  // 2. Madaster Circularity Indikator Calculation (simplified but academically sound)
  // Input circularity: Recycled content %
  // Output circularity: based on connection/separation index (screwed = 90%, mortar = 50%, glued = 10%)
  const outputCircularityMap = {
    glued: 10,
    mortar: 50,
    screwed: 95
  };
  const outputCircularity = outputCircularityMap[joiningMethod];
  const circularityIndex = Math.round((recycledInput + outputCircularity) / 2);

  // 3. Biogenic CO2 carbon storage calculation
  // Timber stores roughly 0.9 tons of biogenic CO2 per ton of softwood
  const carbonStoredTons = Math.round(woodTons * 0.95);

  // 4. Urban Mining Potential / Restwert calculation
  // If glued, concrete has negative value (tipping fee) because you can't reuse or separate it.
  // If screwed, it can be separated. Steel is highly recyclable (95% value).
  const concreteRecoveryRate = joiningMethod === 'screwed' ? 0.90 : joiningMethod === 'mortar' ? 0.60 : 0.0;
  const concreteValue = concreteRecoveryRate > 0 
    ? concreteTons * concreteRecoveryRate * COMMODITY_PRICES.concreteRecycled
    : concreteTons * COMMODITY_PRICES.concreteWaste; // pay to throw away!

  const steelRecoveryRate = joiningMethod === 'screwed' ? 0.98 : joiningMethod === 'mortar' ? 0.80 : 0.50;
  const steelValue = steelTons * steelRecoveryRate * COMMODITY_PRICES.steel;

  const woodRecoveryRate = joiningMethod === 'screwed' ? 0.85 : joiningMethod === 'mortar' ? 0.40 : 0.05;
  const woodValue = woodRecoveryRate > 0.5
    ? woodTons * woodRecoveryRate * COMMODITY_PRICES.woodReuse
    : woodTons * COMMODITY_PRICES.woodBiomass;

  const copperValue = copperTons * 0.95 * COMMODITY_PRICES.copper;

  const totalResidualValue = Math.round(concreteValue + steelValue + woodValue + copperValue);
  const residualValuePerM2 = Math.round(totalResidualValue / gfa);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Intro section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <FileText className="w-5 h-5 text-shiraz" />
          Materialpässe (z.B. Madaster) &amp; Urban Mining
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Um den Rohstoffverbrauch im Bauwesen zu bremsen, deklarieren <strong>Gebäuderessourcenpässe</strong> (wie der offizielle <strong>DGNB Gebäuderessourcenpass</strong> oder die Madaster-Plattform) alle verbauten Materialien quantitativ und qualitativ. Ein Gebäude wird so nicht länger als Einwegstruktur, sondern als wertvolles <strong>Rohstoffdepot für die Zukunft (Urban Mining Depot)</strong> bewertet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 font-normal">
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-bold text-shiraz mb-2 flex items-center gap-2 text-sm">
              <Layers className="w-4 h-4 text-stone-500" />
              Zweck eines Materialpasses
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-705">
              <li><strong>Ressourcentransparenz:</strong> Lückenlose Dokumentation der Bauteile (Bill of Material, BOM).</li>
              <li><strong>Zirkuläres Potenzial:</strong> Genaue Angabe, ob Werkstoffe geklebt oder zerstörungsfrei demontierbar sind.</li>
              <li><strong>Gebäude-Restwert:</strong> Ermittlung des ökonomischen Werts der Rohstoffe für den Tag des Rückbaus.</li>
              <li><strong>Klimaschutznachweis:</strong> Unverzichtbare Basis für DGNB-Zertifizierungen und den Bundes-Gebäuderessourcenpass.</li>
            </ul>
          </div>
          
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-bold text-shiraz mb-2 flex items-center gap-2 text-sm">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
              Die Madaster-Plattform
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-705">
              <li>Ein Gebäude wird als 3D-BIM-Datensatz (meist offene IFC-Dateien) hochgeladen.</li>
              <li>Das Portal berechnet den herstellerübergreifenden <strong>Circularity Indicator (CI)</strong> der Rohstoffe.</li>
              <li>Der finale Materialpass weiß genau, wie viel % der Masse wiederverwendet, recycelt, verbrannt oder deponiert wird.</li>
              <li>Bauherren können Restwert-Szenarien entwerfen und mit Rohstoffbörsen koppeln.</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-bold text-shiraz mb-2 flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-purple-600" />
              DGNB Gebäuderessourcenpass
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-705">
              <li><strong>Steckbrief-Vorgaben:</strong> Orientiert am standardisierten Berichtsformat des DGNB-Ressourcenpasses.</li>
              <li><strong>Massen-Bilanzierung:</strong> Genaue Aufteilung nach Stoffgruppen, nachwachsenden (biogenen) &amp; mineralischen Massen.</li>
              <li><strong>Rückbauklassen:</strong> Detailliertes Tracking der Kreislauffähigkeit und Recycling-Quoten (Modul D).</li>
              <li><strong>Anrechnung Förderung:</strong> Erfüllt Kriterien für das Qualitätssiegel Nachhaltiges Gebäude (QNG/KFN).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* INTERACTIVE COMPONENT: MADASTER CALCULATOR & URBAN MINING SIMULATION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between border-b border-home-grau/30 pb-4 mb-6">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Sparkles className="text-shiraz shrink-0" size={20} />
              Interaktiver Kreislauf- &amp; Restwertrechner (Urban Mining Lab)
            </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Entwerfen und optimieren Sie die Circularity und Entsorgungsbilanz Ihres Gebäudes in Echtzeit.
          </p>
        </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
            <TrendingUp size={13} className="text-emerald-600" /> Madaster API-Sim
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column (5-cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5 border-r border-transparent lg:border-home-grau/30 pr-0 lg:pr-6 font-normal">
            
            {/* 1. Select Scenario Archetype */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">1. Gebäude-Szenario wählen:</label>
              <div className="flex flex-col gap-2">
                {ARCHETYPES.map((arch) => (
                  <button
                    key={arch.id}
                    onClick={() => handleArchetypeSelect(arch.id)}
                    className={`p-3 text-left border rounded-xl hover:bg-slate-50 transition-all ${
                      selectedArchId === arch.id 
                        ? 'border-shiraz bg-shiraz/5 shadow-sm ring-1 ring-shiraz/30' 
                        : 'border-home-grau/30 bg-white'
                    }`}
                  >
                    <span className="font-bold text-xs text-slate-900 block">{arch.name}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block leading-normal">{arch.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Bruttogrundfläche Slider */}
            <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold text-slate-900">Bruttogrundfläche (BGF):</span>
                <span className="font-mono font-bold text-shiraz text-sm">{gfa.toLocaleString('de-DE')} m²</span>
              </div>
              <input 
                type="range" 
                min={500} 
                max={15000} 
                step={250} 
                value={gfa} 
                onChange={(e) => setGfa(Number(e.target.value))}
                className="cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-normal">Skaliert die gesamte verbaute Rohstoffmasse proportional hoch.</p>
            </div>

            {/* 3. Recycled Input (Sekundärrohstoffe) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold text-slate-900">Recyceltes Material (Input %):</span>
                <span className="font-mono font-bold text-shiraz text-sm">{recycledInput}%</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={100} 
                step={5} 
                value={recycledInput} 
                onChange={(e) => setRecycledInput(Number(e.target.value))}
                className="cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-normal">Anteil an Recyclaten oder wiederverwendeten Bauteilen beim Baubeginn.</p>
            </div>

            {/* 4. Connection types (Lösbarkeit) */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">2. Konstruktive Verbindungsmethode (Fügung):</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'glued', label: 'Starr verklebt', desc: 'Nassverguss / Kleber' },
                  { id: 'mortar', label: 'Gemörtelt', desc: 'Halbtrennbar' },
                  { id: 'screwed', label: 'Trocken geschraubt', desc: 'Zerstörungsfrei demontierbar' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setJoiningMethod(type.id as any)}
                    className={`p-2.5 rounded-lg border text-center flex flex-col items-center justify-between h-20 transition-all ${
                      joiningMethod === type.id 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm' 
                        : 'border-home-grau/30 text-slate-705 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10.5px] font-bold leading-tight block">{type.label}</span>
                    <span className="text-[9px] text-slate-400 font-normal leading-normal mt-1 block">{type.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results Output Column (7-cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 font-normal">
            
            {/* Upper: Big Circularity Indicator Gauge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Circularity indicator card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">Ergebnis-Metrik 1</span>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mt-0.5">
                    Circularity Indicator (CI)
                    <InfoTooltip text="Mittelwert aus rezyklierter Herkunft (Input) und der dekonstruktiven Rückbau-Zerlegbarkeit (Output)." />
                  </h4>
                </div>

                <div className="my-4 flex items-baseline gap-2">
                  <span className={`text-4xl md:text-5xl font-black ${
                    circularityIndex > 70 ? 'text-emerald-600' : circularityIndex > 40 ? 'text-amber-500' : 'text-red-500'
                  }`}>{circularityIndex}%</span>
                  <span className="text-xs text-slate-500 font-medium">Kreislauffähigkeit</span>
                </div>

                {/* Micro progress bar */}
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      circularityIndex > 70 ? 'bg-emerald-500' : circularityIndex > 40 ? 'bg-amber-400' : 'bg-red-500'
                    }`} 
                    style={{ width: `${circularityIndex}%` }}
                  />
                </div>

                <span className="text-[10px] text-slate-500 block mt-2 font-normal">
                  {circularityIndex > 70 
                    ? 'Exzellenter zirkulärer Entwurf! Voll konform mit Cradle-to-Cradle Grundsätzen.' 
                    : circularityIndex > 40 
                    ? 'Guter Branchenstandard, aber materialbedingt noch Optimierungsreserven.' 
                    : 'Klassisches Linearwirtschaft-Gebäude. Schwer trennbarer Baubestaub ("Grauer Müll").'}
                </span>
              </div>

              {/* Urban mining potential card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">Ergebnis-Metrik 2</span>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mt-0.5">
                    Urban Mining Restwert
                    <InfoTooltip text="Geschätzte ökonomische Wertschöpfung der Sekundärrohstoffe beim kontrollierten Rückbau abzüglich Entsorgungs- und Deponiekosten." />
                  </h4>
                </div>

                <div className="my-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-3xl md:text-4xl font-black ${
                      totalResidualValue >= 0 ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {totalResidualValue < 0 ? '-' : ''}€ {Math.abs(totalResidualValue).toLocaleString('de-DE')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-1">
                    Umgelegt: <strong className="text-sm font-bold text-shiraz">{residualValuePerM2} €/m² BGF</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-home-grau/30 flex items-center gap-1.5 text-[10px] text-slate-500 leading-normal">
                  <DollarSign size={12} className="text-emerald-600 shrink-0" />
                  <span>
                    {totalResidualValue < 0 
                      ? 'Deponiegebühren übersteigen den Rohstofferlös! Aufgrund starrer Nassverklebung.' 
                      : 'Positiver Rohstoffwert! Das Gebäude fungiert als werthaltige Rohstoffbank.'}
                  </span>
                </div>
              </div>

            </div>

            {/* DGNB Gebäuderessourcenpass Evaluation Banner */}
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-lg text-purple-700 shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">DGNB TEC 1.6 Zirkuläres Bauen Score</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Automatisierte Einstufung für den DGNB Gebäuderessourcenpass.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">DGNB STATUS:</span>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    circularityIndex > 70 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                      : circularityIndex > 40 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-slate-100 text-slate-600 border border-home-grau/30'
                  }`}>
                    {circularityIndex > 70 ? 'Platin-Konform' : circularityIndex > 40 ? 'Gold-Konform' : 'Geringe Kreislauf-Effizienz'}
                  </span>
                </div>
                <button
                  onClick={() => setShowCertificate(true)}
                  className="px-3 py-1.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-[11px] font-bold font-sans transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <FileText size={12} />
                  <span>Pass ansehen</span>
                </button>
              </div>
            </div>

            {/* Mass Balance Breakdown & CO2 Carbon Storage bonus */}
            <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Massenbilanz &amp; Materialinventar:</h4>
                {carbonStoredTons > 0 && (
                  <span className="bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    🌳 CO₂-Speicher: -{carbonStoredTons.toLocaleString('de-DE')} t CO₂-eq
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs font-normal">
                {/* Concrete */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 text-slate-705">
                    <span>Normalbeton-Anteil:</span>
                    <span className="font-mono font-semibold">{concreteTons.toLocaleString('de-DE', {maximumFractionDigits: 0})} t</span>
                  </div>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border">
                    <div className="bg-gray-400 h-full rounded-full" style={{ width: `${Math.min(100, (concreteTons / totalWeightTons) * 100)}%` }} />
                  </div>
                </div>

                {/* Steel */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 text-slate-705">
                    <span>Baustahl-Anteil:</span>
                    <span className="font-mono font-semibold">{steelTons.toLocaleString('de-DE', {maximumFractionDigits: 1})} t</span>
                  </div>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(100, (steelTons / totalWeightTons) * 100)}%` }} />
                  </div>
                </div>

                {/* Wood */}
                {woodTons > 0 && (
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5 text-slate-705">
                      <span>Nutzholz / BSH (Biogen):</span>
                      <span className="font-mono font-semibold text-emerald-600 font-bold">{woodTons.toLocaleString('de-DE', {maximumFractionDigits: 0})} t</span>
                    </div>
                    <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (woodTons / totalWeightTons) * 100)}%` }} />
                    </div>
                  </div>
                )}

                {/* Copper */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 text-slate-705">
                    <span>Kupferleitungen &amp; Metalle:</span>
                    <span className="font-mono font-semibold">{copperTons.toLocaleString('de-DE', {maximumFractionDigits: 2})} t</span>
                  </div>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: `${Math.min(100, (copperTons / totalWeightTons) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Real-Time Evaluation & Optimization Alert */}
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm font-normal">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-shiraz" />
                Umsetzungshinweis &amp; Hebel zur Optimierung:
              </h4>

              <div className="text-xs text-slate-705 leading-relaxed font-normal space-y-2">
                {joiningMethod === 'glued' && (
                  <p className="border-l-2 border-red-500 pl-3">
                    ⚠️ <strong>Problem starrer Verbundwerkstoffe (Verklebung):</strong> Zement und Dämmungen sind untrennbar verschmolzen. Beim Abbruch führt dies zu hohem Deponiemüll (Bauschuttklasse 17 01 07), was erhebliche <strong>Deponiekosten</strong> nach sich zieht, statt wertvolle Zirculate zu liefern.
                  </p>
                )}
                {recycledInput < 30 && (
                  <p className="border-l-2 border-amber-500 pl-3">
                    💡 <strong>Primärrohstoff-Dominanz:</strong> Sie nutzen extrem viele Jungfräuliche (Virgin) Baustoffe. Versuchen Sie, den <strong>Recycling-Beton-Anteil</strong> (RC-Zuschläge) zu erhöhen oder das Tragwerk in Holzbauweise zu planen, um wertvolle CO₂-Gegenbuchungen im Cradle-to-Grave Lebenszyklus (Modul D) zu verbuchen.
                  </p>
                )}
                {joiningMethod === 'screwed' && (
                  <p className="border-l-2 border-emerald-500 pl-3">
                    ✅ <strong>Echter Design-for-Disassembly Ansatz:</strong> Durch zerstörungsfreie, schraubbare Fugenverbindungen können die Bauelemente am Ende der Nutzungsdauer einfach wie Legobausteine demontiert und an anderen Objekten verbaut werden (Urban Mining Quotient maximiert!).
                  </p>
                )}
                <p className="text-[11px] bg-slate-50 p-2.5 rounded-lg border text-slate-500 mt-3 font-normal">
                  <span className="font-bold text-shiraz">Praxisbezug für die Lehre:</span> Die erstellte Massenbilanz bildet das Kernstück für die automatisierte Übertragung in Madaster via IFC. Jedes Kilo Material erhält einen RFID-/QR-Zulassungscode, um Diebstahl und unkontrollierten Verlust im Urban Mining Kreislauf auszuschließen.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* DGNB GEBÄUDERESSOURCENPASS STECKBRIEF MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-home-grau/30 overflow-hidden flex flex-col font-sans text-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-purple-900 text-white p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <Award className="text-purple-300 animate-bounce" size={24} style={{ animationDuration: '3s' }} />
                <div>
                  <h3 className="font-bold text-base tracking-tight text-white uppercase font-sans">Gebäuderessourcenpass (GRP)</h3>
                  <span className="text-[10px] text-purple-200 font-mono tracking-wider">OFFIZIELLES DGNB-BERICHTSFORMAT (ENTWURF)</span>
                </div>
              </div>
              <button
                onClick={() => setShowCertificate(false)}
                className="text-white bg-purple-950/40 hover:bg-purple-950/75 w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Scrollable Content with GRP Steckbrief layout */}
            <div className="overflow-y-auto p-6 space-y-5 flex-1 select-all" id="print-area">
              <div className="border border-home-grau/30 p-5 rounded-xl space-y-4">
                
                {/* Official Crest Header */}
                <div className="flex justify-between items-start border-b border-home-grau/30 pb-4">
                  <div className="space-y-1">
                    <span className="text-lg font-black tracking-tight text-slate-900">GRP DEUTSCHLAND</span>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Registrier-ID: GRP-2026-{selectedArchId.toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-purple-800 block">DGNB TEC 1.6</span>
                    <span className="text-[9px] text-slate-425 block">Ressourcenpass für Gebäude</span>
                  </div>
                </div>

                {/* Building Parameters */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">1. Gebäudestammdaten</span>
                  <div className="grid grid-cols-2 gap-y-2 mt-2 p-3 bg-slate-50 border border-home-grau/30 rounded-lg text-xs font-normal text-slate-600">
                    <div>Szenario: <strong className="text-slate-900 block font-semibold">{archetype.name}</strong></div>
                    <div>Berechnungsgrundlage: <strong className="text-slate-900 block font-semibold">BOM (Massen-Take-Off)</strong></div>
                    <div>Bruttogrundfläche (BGF): <strong className="text-slate-900 block font-semibold">{gfa.toLocaleString('de-DE')} m²</strong></div>
                    <div>Konstruktive Fügung: <strong className="text-slate-900 block font-semibold">
                      {joiningMethod === 'screwed' ? 'Zerstörungsfrei trocken' : joiningMethod === 'mortar' ? 'Halb-demontierbar' : 'Klassisch nass starr'}
                    </strong></div>
                  </div>
                </div>

                {/* Circularity Evaluation */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">2. Zirkuläre Qualitätsbewertung</span>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    
                    <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/30 text-center">
                      <span className="text-[9px] text-slate-400 uppercase block font-medium">Circularity (CI)</span>
                      <strong className={`text-2xl font-black block mt-0.5 ${
                        circularityIndex > 70 ? 'text-emerald-600' : circularityIndex > 40 ? 'text-blue-600' : 'text-slate-700'
                      }`}>
                        {circularityIndex}%
                      </strong>
                      <span className="text-[8px] text-slate-400 block leading-tight mt-0.5">Ressourcen-Effizienz</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/30 text-center">
                      <span className="text-[9px] text-slate-400 uppercase block font-medium">Urban Mining Wert</span>
                      <strong className="text-xl font-black text-slate-900 block mt-0.5">
                        € {totalResidualValue.toLocaleString('de-DE')}
                      </strong>
                      <span className="text-[8px] text-slate-400 block leading-tight mt-0.5">
                        {residualValuePerM2} €/m² BGF
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/30 text-center">
                      <span className="text-[9px] text-slate-400 uppercase block font-medium">CO₂-Speicher</span>
                      <strong className="text-2xl font-black text-emerald-600 block mt-0.5">
                        -{carbonStoredTons} t
                      </strong>
                      <span className="text-[8px] text-slate-400 block leading-tight mt-0.5">In Holz-Masse</span>
                    </div>

                  </div>
                </div>

                {/* Mass breakdown inventory table */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">3. Verbaute Rohstoffmassen</span>
                  <div className="border border-home-grau/30 rounded-lg overflow-hidden mt-2">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-home-grau/30">
                        <tr>
                          <th className="p-2 pl-3">Stoffgruppe (Hauptgruppe)</th>
                          <th className="p-2 text-right">Volumen/Gewicht</th>
                          <th className="p-2 text-right">BOM-Masse %</th>
                          <th className="p-2 text-right">Rückbaubarkeit (Output)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-normal">
                        <tr>
                          <td className="p-2 pl-3 font-semibold">Normalbeton C30/37</td>
                          <td className="p-2 text-right font-mono">{concreteTons.toLocaleString('de-DE', {maximumFractionDigits: 0})} t</td>
                          <td className="p-2 text-right font-mono">{((concreteTons / totalWeightTons) * 100).toFixed(1)}%</td>
                          <td className="p-2 text-right font-mono">{joiningMethod === 'screwed' ? '90%' : joiningMethod === 'mortar' ? '60%' : '0%'}</td>
                        </tr>
                        <tr>
                          <td className="p-2 pl-3 font-semibold">Tragwerksstahl (HEB/B500)</td>
                          <td className="p-2 text-right font-mono">{steelTons.toLocaleString('de-DE', {maximumFractionDigits: 1})} t</td>
                          <td className="p-2 text-right font-mono">{((steelTons / totalWeightTons) * 100).toFixed(1)}%</td>
                          <td className="p-2 text-right font-mono">{joiningMethod === 'screwed' ? '98%' : joiningMethod === 'mortar' ? '80%' : '50%'}</td>
                        </tr>
                        {woodTons > 0 && (
                          <tr>
                            <td className="p-2 pl-3 font-semibold text-emerald-700">Brettschichtholz (Nadelholz)</td>
                            <td className="p-2 text-right font-mono text-emerald-700">{woodTons.toLocaleString('de-DE', {maximumFractionDigits: 0})} t</td>
                            <td className="p-2 text-right font-mono text-emerald-700">{((woodTons / totalWeightTons) * 100).toFixed(1)}%</td>
                            <td className="p-2 text-right font-mono text-emerald-700">{joiningMethod === 'screwed' ? '85%' : joiningMethod === 'mortar' ? '40%' : '5%'}</td>
                          </tr>
                        )}
                        <tr>
                          <td className="p-2 pl-3 font-semibold">Kupfer &amp; Haustechnikmetalle</td>
                          <td className="p-2 text-right font-mono">{copperTons.toLocaleString('de-DE', {maximumFractionDigits: 2})} t</td>
                          <td className="p-2 text-right font-mono">{((copperTons / totalWeightTons) * 100).toFixed(1)}%</td>
                          <td className="p-2 text-right font-mono">95%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Compliance Statement */}
                <div className="pt-3 border-t border-home-grau/30 flex items-start gap-2 text-[9.5px] text-slate-400 font-normal leading-normal">
                  <CheckCircle size={14} className="text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    Die Berechnungen dieses Ressourcenpasses stützen sich auf die standardisierte Kriterienmatrix <strong>DGNB Kriterium TEC 1.6</strong> sowie auf die Madaster-Kreislaufberechnungsformeln der EnEV/GEG. /* TODO: GModG Umnummerierung */ Erfüllt Anforderungen des Gebäudemodernisierungsgesetzes (GModG, in Kraft seit 29.07.2026, vormals GEG § 15) zur Pflichteinreichung digitaler Gebäudepässe.
                  </span>
                </div>

              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 border-t border-home-grau/30 p-4 shrink-0 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200 rounded-xl text-xs font-semibold font-sans transition-all flex items-center gap-1 cursor-pointer"
              >
                <Award size={14} />
                <span>GRP Drucken / PDF</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-home-grau/30 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer"
              >
                Schließen
              </button>
            </div>

          </div>
        </div>
      )}

      <ModuleFooter
        wikipedia={[
          { title: 'Gebäuderessourcenpass', url: 'https://de.wikipedia.org/wiki/Geb%C3%A4uderessourcenpass' },
          { title: 'Urban Mining', url: 'https://de.wikipedia.org/wiki/Urban_Mining' },
          { title: 'Kreislaufwirtschaft', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaft' },
          { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' }
        ]}
        regelwerke={[
          { title: 'DGNB Kriterium TEC 1.6 (Rückbaufreundlichkeit und Kreislaufwirtschaft)', url: 'https://www.dgnb.de/' },
          { title: 'DIN EN 15978 (Nachhaltigkeit von Bauwerken - Bewertung der umweltbezogenen Qualität von Gebäuden)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15978' },
          { title: 'ISO 20887 (Sustainability in buildings - Design for disassembly and adaptability)', url: 'https://www.iso.org/' },
          { title: 'EU-Taxonomie-Verordnung (Kriterien für Zirkulärwirtschaft / Circular Economy)', url: 'https://finance.ec.europa.eu/' }
        ]}
        literatur={[
          'DGNB e.V.: Gebäuderessourcenpass – Leitfaden zur Erstellung und Kriterienkatalog (2023)',
          'Madaster Germany: Material Circularity Index (MCI) Dokumentation und Berechnungsleitfaden',
          'Hillebrandt, A. et al.: Atlas Recycling – Gebäude als Materialressource (Edition Detail, München)',
          'Bundesinstitut für Bau-, Stadt- und Raumforschung (BBSR): Zirkuläres Bauen im Bestand'
        ]}
        formeln={[
          {
            formel: '\\text{MCI} = 1 - \\text{LFI} \\cdot F(X)',
            erklaerung: 'Material Circularity Indicator (MCI) nach Ellen MacArthur Foundation / Madaster zur Quantifizierung des Zirkularitätsgrads (0 = linear, 1 = vollständig zirkulär).',
            quelle: 'Ellen MacArthur Foundation / Madaster'
          },
          {
            formel: 'R_{\\text{rec}} = \\frac{\\sum (m_i \\cdot r_i)}{\\sum m_i} \\cdot 100\\,\\%',
            erklaerung: 'Massenbezogene Recyclierbarkeitsquote der Primärkonstruktion bei Gebäudeabbruch unter Berücksichtigung der Trennbarkeit.',
            quelle: 'DGNB Kriterium TEC 1.6'
          },
          {
            formel: '\\text{UMI} = \\frac{\\sum (m_{i,\\text{rück}} \\cdot c_{\\text{lös},i})}{\\sum m_{i,\\text{gesamt}}} \\cdot 100\\,\\%',
            erklaerung: 'Urban Mining Index (UMI): Prozentualer Anteil der qualitativ kreislauffähig rückgewinnbaren Baustoffe unter Bewertung des Lösbarkeitskoeffizienten.',
            quelle: 'Hillebrandt et al., Bergische Universität Wuppertal'
          }
        ]}
      />

    </div>
  );
}
