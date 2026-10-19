import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Layers, ShieldCheck, Eye, Sliders, Calculator, Check, AlertTriangle, RefreshCw, Layers as LayersIcon, HardHat, Star } from 'lucide-react';
import { InnovationPraxisSection } from '@/src/components/ui/InnovationPraxisSection';

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
    name: 'Floatglas (Standard-Kalknatronglas)',
    type: 'glass',
    density: 2500,
    waterAbs: 0,
    mohsHardness: 5.5,
    thermalCond: 1.0,
    pros: ['Keinerlei optische Verzerrung', 'Kostengünstig herstellbar', 'Sehr plane Oberfläche'],
    rules: 'Nur für vertikale Verglasungen ohne Absturzgefahr. Splittert scharfkantig und birgt hohes Verletzungsrisiko.',
    frostResistant: 'Ja'
  },
  {
    id: 'esg',
    name: 'ESG (Einscheibensicherheitsglas)',
    type: 'glass',
    density: 2500,
    waterAbs: 0,
    mohsHardness: 6.0,
    thermalCond: 1.0,
    pros: ['Hohe Biegezugfestigkeit (ca. 120 N/mm²)', 'Sehr temperaturwechselbeständig', 'Zerfällt bei Stoßbruch in harmlose, stumpfe Kleinkrümel'],
    rules: 'Nachträgliches Schneiden oder Bohren ist unmöglich (führt zum sofortigen Zerspringen). Heißlagerungstest (Heat-Soak-Test) empfohlen zur Vermeidung von Spontanbrüchen durch Nickelsulfid-Einschlüsse.',
    frostResistant: 'Ja'
  },
  {
    id: 'vsg',
    name: 'VSG (Verbundsicherheitsglas)',
    type: 'glass',
    density: 2550, // slightly higher due to PVB foil
    waterAbs: 0,
    mohsHardness: 5.5,
    thermalCond: 0.9,
    pros: ['Splitterbindend durch zähelastische Reißfest-PVB-Folie (0.76-1.52 mmstärke)', 'Schallschützende Eigenschaften', 'Hohe Einbruchhemmung'],
    rules: 'Zwingend vorgeschrieben für Überkopfverglasungen (Vordächer) und absturzsichernde Verglasungen (z.B. Brüstungen). Bei Glasbruch bleibt eine signifikante Resttragfähigkeit bestehen.',
    frostResistant: 'Ja'
  },
  
  // CERAMICS
  {
    id: 'feinsteinzeug',
    name: 'Feinsteinzeug (Fliese bis Plattenware)',
    type: 'ceramics',
    density: 2450,
    waterAbs: 0.2, // very low < 0.5%
    mohsHardness: 8.0, // extremely hard
    thermalCond: 1.3,
    pros: ['Extrem dichte Sinterung (Scherben fast glasartig geschmolzen)', 'Absolut frostsicher', 'Enorme Abrieb- und mechanische Belastbarkeit'],
    rules: 'Zur Verlegung im Außenbereich sind hochflexible Dünnbettmörtel der Klasse S1 oder S2 nach DIN EN 12004 zwingend erforderlich (Dehnungsspannungen auffangen).',
    frostResistant: 'Ja'
  },
  {
    id: 'steinzeug',
    name: 'Steinzeug-Fliesen (Spaltklinker)',
    type: 'ceramics',
    density: 2300,
    waterAbs: 2.5, // 0.5% to 3.0%
    mohsHardness: 6.5,
    thermalCond: 1.1,
    pros: ['Rustikale Optik', 'Gute Frostbeständigkeit', 'Säurefest gegen die meisten Reiniger'],
    rules: 'Häufig als Industrieboden oder Werkstattboden eingesetzt. Verfugung muss auf die chemische Belastung abgestimmt sein (z.B. Epoxidharzfugen).',
    frostResistant: 'Ja'
  },
  {
    id: 'steingut',
    name: 'Steingut-Fliesen (Klassische Wandfliese)',
    type: 'ceramics',
    density: 1900,
    waterAbs: 15.0, // high water absorption
    mohsHardness: 4.0, // easily scratched
    thermalCond: 0.8,
    pros: ['Leicht zuzuschneiden und zu bohren (Muffenlöcher)', 'Gute Haftung verglaster Glasuren', 'Helle Scherbenfarben für brillante Designs'],
    rules: 'Ausschließlich im Innenbereich als Wandbekleidung zugelassen. Absorbiertes Wasser würde im Winter durch Frostausdehnungen die Glasur sofort abplatzen lassen.',
    frostResistant: 'Nein'
  },

  // STONE
  {
    id: 'granit',
    name: 'Granit (Tiefengestein)',
    type: 'stone',
    density: 2750,
    waterAbs: 0.3,
    mohsHardness: 7.0,
    thermalCond: 2.8, // high conductivity
    pros: ['Extrem witterungs- und abriebbeständig', 'Säurefest im Gegensatz zu Kalksteinen', 'Hervorragend polierbar'],
    rules: 'Universeller Außen- und Innenstein. Bei hellem Granit ist auf trasszementhaltige Verlegemörtel zu achten, um dunkle Verfärbungen (Ausblühungen / Fleckenbildung) zu vermeiden.',
    frostResistant: 'Ja'
  },
  {
    id: 'marmor',
    name: 'Marmor (Metamorphes Kalkgestein)',
    type: 'stone',
    density: 2700,
    waterAbs: 0.2,
    mohsHardness: 3.5, // soft stone
    thermalCond: 2.0,
    pros: ['Exquisite, edle Aderung und Optik', 'Hygienische Dichte', 'Tolle Haptik im Badbereich'],
    rules: 'Säureempfindlich! Essig, Zitrone oder säurehaltige Reiniger zerstören die Politur sofort und hinterlassen matte blasse Flecken. Nicht tausalzbeständig im Außenbereich.',
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
            <strong className="font-bold uppercase tracking-wider block mb-1">Achtung: Erhöhtes Verletzungsrisiko (Zersplitterung)</strong>
            Floatglas zerfällt bei Belastungsgrenzen in nadelspitze, meterlange Dolche. Es eignet sich keinesfalls für bodentiefe Wohnungsfenster (ohne Brüstungsgitter) oder Vordächer!
          </div>
        </div>
      );
    }
    if (mat.id === 'vsg') {
      return (
        <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-xs text-emerald-900 flex gap-2 items-start leading-relaxed font-sans font-normal mt-3">
          <ShieldCheck className="text-emerald-700 flex-shrink-0 mt-0.5" size={16} />
          <div>
            <strong className="font-bold uppercase tracking-wider block mb-1">Sicherheitsbauteil: Vorzug für Brüstungen und Überkopf</strong>
            Das PVB-Verbundsystem sichert eine hervorragende Resttragfähigkeit. Selbst nach doppelter Zersplitterung der Deckscheiben trägt die Folienbahnelektronik das Eigengewicht sowie moderate Wind-/Schneelasten.
          </div>
        </div>
      );
    }
    if (mat.id === 'steingut') {
      return (
        <div className="bg-amber-50 border border-amber-150 p-4 rounded-xl text-xs text-amber-900 flex gap-2 items-start leading-relaxed font-sans font-normal mt-3">
          <AlertTriangle className="text-amber-700 flex-shrink-0 mt-0.5" size={16} />
          <div>
            <strong className="font-bold uppercase tracking-wider block mb-1">Frostwarnung / Verlegefehler droht</strong>
            Mit 15% Wasseraufnahme wirkt Steingut wie ein Schwamm. Bei Außenwitterung füllt sich das Porensystem bei Schlagregen. Frost dehnt dieses gefrorene Wasser um ca. 9% aus - die Fliese löst sich im ersten Winter von der Wand ab und zerspringt!
          </div>
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
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              Mineralische Werkstoffe im Hochbau
            </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Gläser, Keramikbaustoffe und Naturwerksteine - Festigkeiten, Verlegeregeln und Trass-Zementation
          </p>
        </div>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed font-normal">
          Mineralische Werkstoffe wie Baukunstgläser, feingesinterte Fliesen und Natursteine zeichnen sich durch enorme Druckfestigkeiten, Temperaturbeständigkeiten und absolute Langlebigkeit aus. Durch ihre Sprödigkeit weisen sie jedoch keine plastischen Dehnungsreserven auf und reagieren extrem empfindlich auf thermisch induzierten Zwangsspannungsaufbau oder Biegezugspannungen.
        </p>
      </div>

      {/* Main interactive DB Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left hand sub-tab and navigation */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-xs font-bold text-text-main/50 uppercase tracking-wider block">Kategoriematerial auswählen:</span>
          
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

          <div className="bg-yellow-50/50 p-4 border border-yellow-200/50 rounded-xl space-y-2 text-xs text-yellow-905">
            <div className="flex items-center gap-1.5 font-bold">
              <HardHat className="text-yellow-800" size={14} />
              <span>Sonderfall: Naturstein Ausblühungen</span>
            </div>
            <p className="font-normal text-[11px] text-yellow-950/80 leading-relaxed">
              Herkömmlicher Portlandzement setzt bei der Hydratation große Mengen an <strong>Calciumhydroxid (Portlandit)</strong> frei. Dieses gelangt durch das Mischwasser an die Natursteinoberfläche, reagiert mit Luftsauerstoff und CO₂ und hinterlässt unlösliche, weiße Fließflecken. <strong>Vorschrift:</strong> Natursteine ausschließlich mit hydraulischem <strong>Trasszement</strong> verlegen!
            </p>
          </div>
        </div>

        {/* Right Detail Sheet */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-home-grau/15 pb-4 flex justify-between items-start flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">KENNWERTDATENBLATT MINERALISCH</span>
                <h3 className="text-lg font-extrabold text-text-main mt-0.5">{selectedMat.name}</h3>
              </div>
              <div className="bg-slate-50 border border-home-grau/15 px-3 py-1 rounded-lg text-right">
                <span className="text-[10px] text-text-main/40 block leading-tight">Mohshärte (Kratzfest)</span>
                <span className="text-sm font-extrabold text-slate-800 font-mono">{selectedMat.mohsHardness.toFixed(1)} / 10</span>
              </div>
            </div>

            {/* Quick stats details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30 text-center">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5">Dichte (Rohdichte)</span>
                <span className="text-sm font-extrabold font-mono text-slate-800">{selectedMat.density} kg/m³</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30 text-center">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5">Teilw. Wasserabs.</span>
                <span className="text-sm font-extrabold font-mono text-slate-800">{selectedMat.waterAbs}% M.-%</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30 text-center">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5">Wärmeleitgefühlt λ</span>
                <span className="text-sm font-extrabold font-mono text-slate-800">{selectedMat.thermalCond.toFixed(2)} W/(m·K)</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30 text-center">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5">Frosttau-Beständig</span>
                <span className="text-xs font-extrabold text-slate-800 leading-normal block mt-1 uppercase">{selectedMat.frostResistant}</span>
              </div>
            </div>

            {/* Pros checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Gefüge-Eigenschaften &amp; Vorteile:</span>
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
              <span className="text-xs font-bold text-slate-600 uppercase block tracking-wider">Normativ einzuhaltende Verlegepraxis:</span>
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
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              Flächengewicht & Wasseraufnahmelast Rechner
            </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Berechnung der Eigenlast (trocken) im Vergleich zur wassergesättigten Volllast bei Mineralbelägen
          </p>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Section Inputs 1 */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-text-main/60 uppercase block tracking-wider">Geometrische Kenngrößen</span>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main">Gesamtfläche des Belags A:</label>
                <span className="text-shiraz font-mono">{calcArea} m²</span>
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
                <label className="text-text-main">Platten- bzw. Belagsstärke (mm):</label>
                <span className="text-shiraz font-mono">{tileThick} mm</span>
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
              <span className="text-[10px] text-text-main/40 block leading-tight">Typisch: Feinsteinzeug-Fliesen ~8-12 mm, Naturwerksteine ~20-40 mm.</span>
            </div>
          </div>

          {/* Section Inputs 2 */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-text-main/60 uppercase block tracking-wider">Mineralische Deckenschicht</span>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-main">Verlegter Werkstoff:</label>
              <select
                value={tileMaterial}
                onChange={(e) => setTileMaterial(e.target.value)}
                className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
              >
                <option value="feinsteinzeug">Feinsteinzeug Fliese (Absorption ≤ 0.2%)</option>
                <option value="steinzeug">Spaltklinker Steinzeug (Absorption ~ 2.5%)</option>
                <option value="steingut">Steingut Wandfliese (Absorption ~ 15%)</option>
                <option value="granit">Granit Werkstein (Absorption ~ 0.3%)</option>
                <option value="marmor">Marmor Werkstein (Absorption ~ 0.2%)</option>
              </select>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/30 text-xs text-text-main/70 leading-relaxed font-sans space-y-1 font-normal">
              <span className="font-bold text-slate-700 block">Sättigungsmechanismus:</span>
              Mineralische Werkstoffe lagern flüssiges Wasser im kapillaren Porensystem ab. Dadurch erhöht sich das statische Eigewicht, was bei Holzbalkendecken statisch bemessen werden muss.
            </div>
          </div>

          {/* Section results */}
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between font-mono text-xs text-text-main/80">
            <div className="space-y-3.5">
              <span className="text-xs font-bold text-slate-700 uppercase block border-b pb-1">Ergebnisse Statik-Auszug:</span>
              
              <div className="flex justify-between items-center bg-white p-2 border border-home-grau/30 rounded-md">
                <span className="font-sans font-medium">Volumen Gestein:</span>
                <span className="font-bold text-slate-800">{volumeM3.toFixed(3)} m³</span>
              </div>

              <div className="flex justify-between items-center bg-white p-2 border border-home-grau/30 rounded-md">
                <span className="font-sans font-medium text-slate-600">Material-Rohdichte:</span>
                <span className="font-bold text-slate-700">{calcMat.density} kg/m³</span>
              </div>

              <div className="flex justify-between items-center bg-white p-2 border border-home-grau/30 rounded-md">
                <span className="font-sans font-bold text-slate-800">Trocken-Eigenlast:</span>
                <span className="font-bold text-slate-900">{dryWeightKg.toFixed(1)} kg</span>
              </div>

              <div className="flex justify-between items-center bg-shiraz/5 p-2 border border-shiraz/25 rounded-md">
                <span className="font-sans font-bold text-shiraz">Nassgewicht (gesättigt):</span>
                <span className="font-bold text-shiraz">{wetWeightKg.toFixed(1)} kg</span>
              </div>
            </div>

            <div className="pt-2 border-t border-home-grau/30 text-[10px] text-text-main/50 leading-relaxed font-sans mt-3">
              * Bemessungslast trocken: {(dryWeightKg / calcArea).toFixed(1)} kg/m² (~{(dryWeightKg * 0.00981 / calcArea).toFixed(2)} kN/m²). Zusätzliches Gewicht bei Sättigung: +{waterAbsorbedKg.toFixed(1)} kg insgesamt.
            </div>
          </div>
        </div>
      </div>

      {/* Industry manufacturers standard reference */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm mt-1 bg-slate-50/50">
        <h3 className="font-bold text-home-prim text-lg mb-4 flex items-center gap-2">
          <Star className="text-shiraz" size={17} /> Mineralische Produktgruppen &amp; Systemtechniken (Herstellerneutral)
        </h3>
        <p className="text-xs text-text-main/70 mb-4 font-normal">
          Keramiken und Gläser werden anspruchsvollen Konformitätsprüfungen nach europäischen Normen unterzogen, um Frostbeständigkeit, Riegelkonstruktionen (Abriebklassen für Keramik) und absturzsichernde Verglasungen normativ zu deklarieren:
        </p>
        <div className="overflow-x-auto rounded-xl border border-home-grau/15 bg-white">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-home-grau/15 text-text-main/80 font-bold">
                <th className="p-3">Produktgruppe / System</th>
                <th className="p-3">Spezifikationen &amp; Leistungsklassen</th>
                <th className="p-3">Güteklassen / Normen</th>
                <th className="p-3">Bedeutung im modernen Fassaden- &amp; Innenbau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-text-main/80">
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800">Sicherheits- &amp; VSG-Verbundgläser</td>
                <td className="p-3">Einscheibensicherheitsglas (ESG) und Verbundsicherheitsglas (VSG) mit zähelastischen PVB-Zwischenfolien sowie Sonnenschutzbeschichtungen.</td>
                <td className="p-3 font-mono">DIN EN 12150 (ESG), DIN EN ISO 12543 (VSG)</td>
                <td className="p-3">Standard für absturzsichernde Verglasungen, Überkopfbereiche, Pfosten-Riegel-Fassaden und Schallschutzgläser.</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800">Brandschutz- &amp; Spezialgläser</td>
                <td className="p-3">Feuerwiderstandsklassifizierte Verglasungen mit lichtdurchlässigen Dämmschichten zur Hitzeabsorption im Brandfall.</td>
                <td className="p-3 font-mono">DIN 4102-13 (Brandschutzverglasung), Klassen EI30 / EI90 (F30 / F90)</td>
                <td className="p-3">Schnittstellen von Fluchtwegen, Treppenräumen und Brandabschnitten zur Verhinderung von Flammenübertragungen.</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800">Feinsteinzeug &amp; Baukeramik</td>
                <td className="p-3">Gepresste, extrem dichte Keramikfliesen mit minimaler kapillarer Wasseraufnahme, glasierte und unglasierte Formate.</td>
                <td className="p-3 font-mono">DIN EN 14411 (Keramische Fliesen), Abriebgruppen PEI I bis PEI V</td>
                <td className="p-3">Boden- und Wandbeläge in stark strapazierten Feucht- und Nassräumen sowie dekorative Fassadenverkleidungen.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <InnovationPraxisSection moduleKey="bp_mineralisch" />

      <ModuleFooter
        weblinks={[
          { title: "Zement-Taschenbuch.", url: "https://www.vdz-online.de/publikationen/zement-taschenbuch" }
        ]} 
        wikipedia={[
          { title: 'Sicherheitsglas', url: 'https://de.wikipedia.org/wiki/Sicherheitsglas' },
          { title: 'Feinsteinzeug', url: 'https://de.wikipedia.org/wiki/Feinsteinzeug' },
          { title: 'Naturstein', url: 'https://de.wikipedia.org/wiki/Naturstein' }
        ]} 
        literatur={[
          'Reiher, H.: Handbuch der Baukeramik.',
          'Weller, B.: Glasbau: Grundlagen, Berechnung, Konstruktion.'
        ]} 
        regelwerke={[ 
          { title: 'DIN EN 12150 (Glas im Bauwesen - Thermisch vorgespanntes Einscheibensicherheitsglas)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12150' }, 
          { title: 'DIN EN 14411 (Keramische Fliesen und Platten - Definitionen, Klassifizierung, Eigenschaften)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+14411' },
          { title: 'DIN 18516-3 (Außenwandbekleidungen, hinterlüftet - Naturwerkstein)', url: 'https://www.dinmedia.de/de/suche?q=DIN+18516-3' }
        ]} 
        formeln={[
          { formel: 'V_{mat} = A \\cdot \\frac{t_{mm}}{1000}', erklaerung: 'Volumenberechnung mineralischer Plattenwerkstoffe' },
          { formel: 'W_{dry} = V_{mat} \\cdot \\rho_{dry}', erklaerung: 'Eigengewicht mineralischer Werkstoffe auf Grundlage der Rohdichte' },
          { formel: 'W_{wet} = W_{dry} \\cdot \\left(1 + \\frac{w_{abs}}{100}\\right)', erklaerung: 'Nassgewicht unter vollständiger kapillarer Wasserabsättigung' }
        ]} 
      />
    </div>
  );
}
