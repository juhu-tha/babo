import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ShieldCheck, Calculator, Check, AlertTriangle, Layers as LayersIcon, HardHat, Star } from 'lucide-react';
import { InnovationPraxisSection } from '@/src/components/ui/InnovationPraxisSection';
import inhalt from '@/content/bpmineralisch/BpMineralisch.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface MineralMaterial {
  id: string;
  name: string;
  type: 'glass' | 'ceramics' | 'stone';
  density: number; // kg/m³
  waterAbs: number; // % by weight
  mohsHardness: number; // 1-10 scale
  thermalCond: number; // W/(m·K)
  pros: string[];
  rules: string;
  frostResistant: 'Ja' | 'Bedingt' | 'Nein';
}

const mineralDb: MineralMaterial[] = [
  // GLASS
  {
    id: 'float',
    name: inhalt.werte.floatglasStandardKalknatronglas,
    type: 'glass',
    density: 2500,
    waterAbs: 0,
    mohsHardness: 5.5,
    thermalCond: 1.0,
    pros: [inhalt.werte.keinerleiOptischeVerzerrung, inhalt.werte.kostengünstigHerstellbar, inhalt.werte.sehrPlaneOberfläche],
    rules: inhalt.werte.nurFürVertikaleVerglasungen,
    frostResistant: 'Ja'
  },
  {
    id: 'esg',
    name: inhalt.werte.esgEinscheibensicherheitsglas,
    type: 'glass',
    density: 2500,
    waterAbs: 0,
    mohsHardness: 6.0,
    thermalCond: 1.0,
    pros: [inhalt.werte.hoheBiegezugfestigkeitCa120, inhalt.werte.sehrTemperaturwechselbeständig, inhalt.werte.zerfälltBeiStoßbruchIn],
    rules: inhalt.werte.nachträglichesSchneidenOderBohren,
    frostResistant: 'Ja'
  },
  {
    id: 'vsg',
    name: inhalt.werte.vsgVerbundsicherheitsglas,
    type: 'glass',
    density: 2550, // slightly higher due to PVB foil
    waterAbs: 0,
    mohsHardness: 5.5,
    thermalCond: 0.9,
    pros: [inhalt.werte.splitterbindendDurchZähelastischeReißfes, inhalt.werte.schallschützendeEigenschaften, inhalt.werte.hoheEinbruchhemmung],
    rules: inhalt.werte.erforderlichFürÜberkopfverglasungenUnter,
    frostResistant: 'Ja'
  },
  
  // CERAMICS
  {
    id: 'feinsteinzeug',
    name: inhalt.werte.feinsteinzeugFlieseBisPlattenware,
    type: 'ceramics',
    density: 2450,
    waterAbs: 0.2, // very low < 0.5%
    mohsHardness: 8.0, // extremely hard
    thermalCond: 1.3,
    pros: [inhalt.werte.sehrDichteSinterungWasseraufnahme, 'Frostbeständig', inhalt.werte.hoheAbriebUndBruchfestigkeit],
    rules: inhalt.werte.imAußenbereichWerdenVerformbare,
    frostResistant: 'Ja'
  },
  {
    id: 'steinzeug',
    name: inhalt.werte.steinzeugFliesenSpaltklinker,
    type: 'ceramics',
    density: 2300,
    waterAbs: 2.5, // 0.5% to 3.0%
    mohsHardness: 6.5,
    thermalCond: 1.1,
    pros: [inhalt.werte.rustikaleOptik, inhalt.werte.guteFrostbeständigkeit, inhalt.werte.säurefestGegenDieMeisten],
    rules: inhalt.werte.häufigAlsIndustriebodenOder,
    frostResistant: 'Ja'
  },
  {
    id: 'steingut',
    name: inhalt.werte.steingutFliesenKlassischeWandfliese,
    type: 'ceramics',
    density: 1900,
    waterAbs: 15.0, // high water absorption
    mohsHardness: 4.0, // easily scratched
    thermalCond: 0.8,
    pros: [inhalt.werte.leichtZuzuschneidenUndZu, inhalt.werte.guteHaftungVerglasterGlasuren, inhalt.werte.helleScherbenfarbenFürBrillante],
    rules: inhalt.werte.nurFürInnenwändeGeeignet,
    frostResistant: 'Nein'
  },

  // STONE
  {
    id: 'granit',
    name: inhalt.werte.granitTiefengestein,
    type: 'stone',
    density: 2750,
    waterAbs: 0.3,
    mohsHardness: 7.0,
    thermalCond: 2.8, // high conductivity
    pros: [inhalt.werte.extremWitterungsUndAbriebbeständig, inhalt.werte.säurefestImGegensatzZu, inhalt.werte.hervorragendPolierbar],
    rules: inhalt.werte.universellerAußenUndInnenstein,
    frostResistant: 'Ja'
  },
  {
    id: 'marmor',
    name: inhalt.werte.marmorMetamorphesKalkgestein,
    type: 'stone',
    density: 2700,
    waterAbs: 0.2,
    mohsHardness: 3.5, // soft stone
    thermalCond: 2.0,
    pros: [inhalt.werte.exquisiteEdleAderungUnd, inhalt.werte.hygienischeDichte, inhalt.werte.tolleHaptikImBadbereich],
    rules: inhalt.werte.säureempfindlichEssigZitroneOder,
    frostResistant: 'Bedingt'
  }
];

export default function BpMineralisch() {
  const [activeTab, setActiveTab] = useState<'glass' | 'ceramics' | 'stone'>('glass');
  const [selectedMat, setSelectedMat] = useState<MineralMaterial>(mineralDb[0]);

  // Calculator states
  const [calcArea, setCalcArea] = useState<number>(25); // m²
  const [tileThick, setTileThick] = useState<number>(10); // mm
  const [tileMaterial, setTileMaterial] = useState<string>('feinsteinzeug');

  // Load calculator selected material
  const calcMat = mineralDb.find(m => m.id === tileMaterial) || mineralDb[3];

  // Calculations
  // Volume: V = Area * (tickness/1000) m³
  const volumeM3 = calcArea * (tileThick / 1000);
  // Dry weight: W_dry = V * density (kg)
  const dryWeightKg = volumeM3 * calcMat.density;
  // Saturated weight: W_wet = W_dry * (1 + waterAbs / 100) kg
  const waterAbsorbedKg = dryWeightKg * (calcMat.waterAbs / 100);
  const wetWeightKg = dryWeightKg + waterAbsorbedKg;

  // Render safety warning on specific material selections
  const showSecurityWarning = (mat: MineralMaterial) => {
    if (mat.id === 'float') {
      return (
        <div className="bg-red-50 border border-red-150 p-4 rounded-xl text-xs text-red-900 flex gap-2 items-start leading-relaxed font-sans font-normal mt-3">
          <AlertTriangle className="text-red-700 flex-shrink-0 mt-0.5" size={16} />
          <div>
            <strong className="font-bold uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.achtungErhöhtesVerletzungsrisikoZersplit} /></strong><MdText text={inhalt.texte.floatglasBrichtInGroße} /></div>
        </div>
      );
    }
    if (mat.id === 'vsg') {
      return (
        <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-xs text-emerald-900 flex gap-2 items-start leading-relaxed font-sans font-normal mt-3">
          <ShieldCheck className="text-emerald-700 flex-shrink-0 mt-0.5" size={16} />
          <div>
            <strong className="font-bold uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.sicherheitsbauteilVorzugFürBrüstungen} /></strong><MdText text={inhalt.texte.diePvbZwischenfolieHält} /></div>
        </div>
      );
    }
    if (mat.id === 'steingut') {
      return (
        <div className="bg-amber-50 border border-amber-150 p-4 rounded-xl text-xs text-amber-900 flex gap-2 items-start leading-relaxed font-sans font-normal mt-3">
          <AlertTriangle className="text-amber-700 flex-shrink-0 mt-0.5" size={16} />
          <div>
            <strong className="font-bold uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.frostwarnungVerlegefehlerDroht} /></strong><MdText text={inhalt.texte.mit15WasseraufnahmeWirkt} /></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="bp-mineralisch-module" className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Overview Block */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
            <LayersIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.mineralischeWerkstoffeImHochbau} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.gläserKeramikbaustoffeUndNaturwerksteine} /></p>
        </div>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.mineralischeWerkstoffeWieBaukunstgläser} /></p>
      </div>

      {/* Main interactive DB Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left hand sub-tab and navigation */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-xs font-bold text-text-main/50 uppercase tracking-wider block"><MdText text={inhalt.texte.kategoriematerialAuswählen} /></span>
          
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => { setActiveTab('glass'); setSelectedMat(mineralDb[0]); }}
              className={`p-2 rounded-lg text-xs font-bold transition-all text-center ${activeTab === 'glass' ? 'bg-white text-shiraz shadow-sm' : 'text-text-main/60 hover:text-text-main'}`}
            >
              Gläser
            </button>
            <button 
              onClick={() => { setActiveTab('ceramics'); setSelectedMat(mineralDb[3]); }}
              className={`p-2 rounded-lg text-xs font-bold transition-all text-center ${activeTab === 'ceramics' ? 'bg-white text-shiraz shadow-sm' : 'text-text-main/60 hover:text-text-main'}`}
            >
              Keramik
            </button>
            <button 
              onClick={() => { setActiveTab('stone'); setSelectedMat(mineralDb[6]); }}
              className={`p-2 rounded-lg text-xs font-bold transition-all text-center ${activeTab === 'stone' ? 'bg-white text-shiraz shadow-sm' : 'text-text-main/60 hover:text-text-main'}`}
            >
              Steine
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {mineralDb.filter(m => m.type === activeTab).map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMat(m)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex justify-between items-center ${
                  selectedMat.id === m.id
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main hover:bg-slate-50 border-home-grau/30 shadow-sm'
                }`}
              >
                <span className="font-extrabold text-xs">{m.name}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                  selectedMat.id === m.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {m.id.toUpperCase()}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-yellow-50/50 p-4 border border-yellow-200/50 rounded-xl space-y-2 text-xs text-yellow-900">
            <div className="flex items-center gap-1.5 font-bold">
              <HardHat className="text-yellow-800" size={14} />
              <span><MdText text={inhalt.texte.sonderfallNatursteinAusblühungen} /></span>
            </div>
            <p className="font-normal text-[11px] text-yellow-950/80 leading-relaxed"><MdText text={inhalt.texte.herkömmlicherPortlandzementSetztBei} /></p>
          </div>
        </div>

        {/* Right Detail Sheet */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-home-grau/15 pb-4 flex justify-between items-start flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block"><MdText text={inhalt.texte.kennwertdatenblattMineralisch} /></span>
                <h3 className="text-lg font-extrabold text-text-main mt-0.5">{selectedMat.name}</h3>
              </div>
              <div className="bg-slate-50 border border-home-grau/15 px-3 py-1 rounded-lg text-right">
                <span className="text-[10px] text-text-main/40 block leading-tight"><MdText text={inhalt.texte.mohshärteKratzfest} /></span>
                <span className="text-sm font-extrabold text-slate-800 font-mono">{formatDeZahl(selectedMat.mohsHardness, 1)} / 10</span>
              </div>
            </div>

            {/* Quick stats details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30 text-center">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5"><MdText text={inhalt.texte.dichteRohdichte} /></span>
                <span className="text-sm font-extrabold font-mono text-slate-800">{formatDeWert(selectedMat.density)} kg/m³</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30 text-center">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5"><MdText text={inhalt.texte.teilwWasserabs} /></span>
                <span className="text-sm font-extrabold font-mono text-slate-800">{formatDeWert(selectedMat.waterAbs)}% M.-%</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30 text-center">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5"><MdText text={inhalt.texte.wärmeleitgefühlt} /></span>
                <span className="text-sm font-extrabold font-mono text-slate-800">{formatDeZahl(selectedMat.thermalCond, 2)} W/(m·K)</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30 text-center">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5">Frosttau-Beständig</span>
                <span className="text-xs font-extrabold text-slate-800 leading-normal block mt-1 uppercase">{selectedMat.frostResistant}</span>
              </div>
            </div>

            {/* Pros checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-shiraz uppercase tracking-wider block"><MdText text={inhalt.texte.gefügeEigenschaftenVorteile} /></span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-main/80 font-normal">
                {selectedMat.pros.map((p, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <Check size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Normative / Bauaufsichtliche rules */}
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/10 space-y-1.5 leading-relaxed font-sans">
              <span className="text-xs font-bold text-slate-600 uppercase block tracking-wider"><MdText text={inhalt.texte.normativEinzuhaltendeVerlegepraxis} /></span>
              <p className="text-xs text-text-main/80 font-normal">
                {selectedMat.rules}
              </p>
            </div>
          </div>

          {/* Trigger active warn triggers */}
          {showSecurityWarning(selectedMat)}
        </div>
      </div>

      {/* Load & absorption wet/dry structural weight calculator */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-home-grau/15 pb-4Color">
          <Calculator className="text-shiraz" />
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.flächengewichtWasseraufnahmelastRechner} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.berechnungDerEigenlastTrocken} /></p>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Section Inputs 1 */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-text-main/60 uppercase block tracking-wider"><MdText text={inhalt.texte.geometrischeKenngrößen} /></span>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main"><MdText text={inhalt.texte.gesamtflächeDesBelagsA} /></label>
                <span className="text-shiraz font-mono">{formatDeWert(calcArea)} m²</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="300" 
                step="5" 
                value={calcArea} 
                onChange={(e) => setCalcArea(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main"><MdText text={inhalt.texte.plattenBzwBelagsstärkeMm} /></label>
                <span className="text-shiraz font-mono">{formatDeWert(tileThick)} mm</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="60" 
                step="1" 
                value={tileThick} 
                onChange={(e) => setTileThick(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <span className="text-[10px] text-text-main/40 block leading-tight"><MdText text={inhalt.texte.typischFeinsteinzeugFliesen8} /></span>
            </div>
          </div>

          {/* Section Inputs 2 */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-text-main/60 uppercase block tracking-wider"><MdText text={inhalt.texte.mineralischeDeckenschicht} /></span>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.verlegterWerkstoff} /></label>
              <select aria-label={inhalt.werte.verlegterWerkstoff}
                value={tileMaterial}
                onChange={(e) => setTileMaterial(e.target.value)}
                className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
              >
                <option value="feinsteinzeug">Feinsteinzeug Fliese (Absorption ≤ 0,2%)</option>
                <option value="steinzeug">Spaltklinker Steinzeug (Absorption ~ 2,5%)</option>
                <option value="steingut">Steingut Wandfliese (Absorption ~ 15%)</option>
                <option value="granit">Granit Werkstein (Absorption ~ 0,3%)</option>
                <option value="marmor">Marmor Werkstein (Absorption ~ 0,2%)</option>
              </select>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/30 text-xs text-text-main/70 leading-relaxed font-sans space-y-1 font-normal">
              <span className="font-bold text-slate-700 block">Sättigungsmechanismus:</span><MdText text={inhalt.texte.mineralischeWerkstoffeLagernFlüssiges} /></div>
          </div>

          {/* Section results */}
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between font-mono text-xs text-text-main/80">
            <div className="space-y-3.5">
              <span className="text-xs font-bold text-slate-700 uppercase block border-b pb-1"><MdText text={inhalt.texte.ergebnisseStatikAuszug} /></span>
              
              <div className="flex justify-between items-center bg-white p-2 border border-home-grau/30 rounded-md">
                <span className="font-sans font-medium"><MdText text={inhalt.texte.volumenGestein} /></span>
                <span className="font-bold text-slate-800">{formatDeZahl(volumeM3, 3)} m³</span>
              </div>

              <div className="flex justify-between items-center bg-white p-2 border border-home-grau/30 rounded-md">
                <span className="font-sans font-medium text-slate-600">Material-Rohdichte:</span>
                <span className="font-bold text-slate-700">{formatDeWert(calcMat.density)} kg/m³</span>
              </div>

              <div className="flex justify-between items-center bg-white p-2 border border-home-grau/30 rounded-md">
                <span className="font-sans font-bold text-slate-800">Trocken-Eigenlast:</span>
                <span className="font-bold text-slate-900">{formatDeZahl(dryWeightKg, 1)} kg</span>
              </div>

              <div className="flex justify-between items-center bg-shiraz/5 p-2 border border-shiraz/25 rounded-md">
                <span className="font-sans font-bold text-shiraz"><MdText text={inhalt.texte.nassgewichtGesättigt} /></span>
                <span className="font-bold text-shiraz">{formatDeZahl(wetWeightKg, 1)} kg</span>
              </div>
            </div>

            <div className="pt-2 border-t border-home-grau/30 text-[10px] text-text-main/50 leading-relaxed font-sans mt-3"><MdText text={inhalt.texte.bemessungslastTrocken} />{formatDeZahl((dryWeightKg / calcArea), 1)} kg/m² (~{formatDeZahl((dryWeightKg * 0.00981 / calcArea), 2)}<MdText text={inhalt.texte.knMZusätzlichesGewicht} />{formatDeZahl(waterAbsorbedKg, 1)}<MdText text={inhalt.texte.kgInsgesamt} /></div>
          </div>
        </div>
      </div>

      {/* Industry manufacturers standard reference */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm mt-1 bg-slate-50/50">
        <h3 className="font-bold text-home-prim text-lg mb-4 flex items-center gap-2">
          <Star className="text-shiraz" size={17} /><MdText text={inhalt.texte.mineralischeProduktgruppenSystemtechnike} /></h3>
        <p className="text-xs text-text-main/70 mb-4 font-normal"><MdText text={inhalt.texte.keramikenUndGläserWerden} /></p>
        <div className="overflow-x-auto rounded-xl border border-home-grau/15 bg-white">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-home-grau/15 text-text-main/80 font-bold">
                <th className="p-3"><MdText text={inhalt.texte.produktgruppeSystem} /></th>
                <th className="p-3"><MdText text={inhalt.texte.spezifikationenLeistungsklassen} /></th>
                <th className="p-3"><MdText text={inhalt.texte.güteklassenNormen} /></th>
                <th className="p-3"><MdText text={inhalt.texte.bedeutungImModernenFassaden} /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-text-main/80">
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.sicherheitsVsgVerbundgläser} /></td>
                <td className="p-3"><MdText text={inhalt.texte.einscheibensicherheitsglasEsgUndVerbunds} /></td>
                <td className="p-3 font-mono"><MdText text={inhalt.texte.dinEn12150Esg} /></td>
                <td className="p-3"><MdText text={inhalt.texte.standardFürAbsturzsicherndeVerglasungen} /></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.brandschutzSpezialgläser} /></td>
                <td className="p-3"><MdText text={inhalt.texte.feuerwiderstandsklassifizierteVerglasung} /></td>
                <td className="p-3 font-mono"><MdText text={inhalt.texte.din410213Brandschutzverglasung} /></td>
                <td className="p-3"><MdText text={inhalt.texte.schnittstellenVonFluchtwegenTreppenräume} /></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.feinsteinzeugBaukeramik} /></td>
                <td className="p-3"><MdText text={inhalt.texte.gepressteExtremDichteKeramikfliesen} /></td>
                <td className="p-3 font-mono"><MdText text={inhalt.texte.dinEn14411Keramische} /></td>
                <td className="p-3"><MdText text={inhalt.texte.bodenUndWandbelägeIn} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <InnovationPraxisSection moduleKey="bp_mineralisch" />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielNasslastEinesSteingut}
          zielGleichung="W_{wet} = A \cdot \frac{t}{1000} \cdot \rho \cdot \left(1 + \frac{w_{abs}}{100}\right)"
          normQuelle={inhalt.werte.lehrbeispielRohdichtenUndWasseraufnahme}
          schritte={inhalt.daten["BpMineralisch.schritte"]}
          ergebnisHinweis={inhalt.werte.steingutNimmtRund46}
        />
      </div>

      <ModulTest moduleId="bp_mineralisch" />

      <ModuleFooter
        weblinks={[
          { title: "Zement-Taschenbuch.", url: "https://www.vdz-online.de/wissensportal/publikationen/zement-taschenbuch-2008" }
        ]} 
        wikipedia={[
          { title: 'Sicherheitsglas', url: 'https://de.wikipedia.org/wiki/Sicherheitsglas' },
          { title: 'Feinsteinzeug', url: 'https://de.wikipedia.org/wiki/Feinsteinzeug' },
          { title: 'Naturstein', url: 'https://de.wikipedia.org/wiki/Naturstein' }
        ]} 
        literatur={inhalt.daten["BpMineralisch.literatur"]} 
        regelwerke={inhalt.daten["BpMineralisch.regelwerke"]} 
        formeln={inhalt.daten["BpMineralisch.formeln"]} 
      />
    </div>
  );
}
