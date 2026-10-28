import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  Leaf, 
  Trees, 
  Droplets, 
  Scale, 
  Activity, 
  Layers, 
  Search, 
  Zap, 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/nawaro/Nawaro.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

// Define FNR Product Type
interface FnrProduct {
  id: string;
  name: string;
  category: string;
  rho: string; // Rohdichte in kg/m³
  lambda: string; // Wärmeleitfähigkeit in W/(mK)
  c: string; // Spezifische Wärmekapazität J/(kgK)
  mu: string; // Wasserdampf-Diffusionswiderstand
  fireClass: string; // Baustoffklasse / Brandverhalten
  advantages: string[];
  disadvantages: string[];
  description: string;
  fnrUsage: string; // Typical FNR recommendation / application area
}

type NawaroReiter = 'overview' | 'fnr_db' | 'navigator' | 'comparison';
const REITER: readonly ModulTab<NawaroReiter>[] = [
  { id: 'overview', label: inhalt.texte.übersichtCKreislauf.trim(), icon: Layers },
  { id: 'fnr_db', label: inhalt.texte.fnrBaustoffDatenbank.trim(), icon: BookOpen },
  { id: 'navigator', label: inhalt.texte.interaktiverDämmNavigator.trim(), icon: Calculator },
  { id: 'comparison', label: inhalt.texte.technischeVergleiche.trim(), icon: Scale },
];

export default function Nawaro() {
  const [activeTab, setActiveTab] = useState<NawaroReiter>('overview');
  
  // Database filter states
  const [dbCategory, setDbCategory] = useState<string>('all');
  const [dbSearch, setDbSearch] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>('holzfaser');

  // Navigator preference states
  const [navGoal, setNavGoal] = useState<'heat' | 'summer' | 'moisture' | 'sound' | 'eco'>('summer');
  const [navWallType, setNavWallType] = useState<'dach' | 'innen' | 'fassade'>('dach');

  // FNR Product Database
  const fnrProducts: FnrProduct[] = inhalt.daten["Nawaro.fnrProducts"];

  // Filters calculation
  const filteredProducts = fnrProducts.filter(p => {
    const matchesCategory = dbCategory === 'all' || p.category === dbCategory;
    const matchesSearch = p.name.toLowerCase().includes(dbSearch.toLowerCase()) || 
                          p.description.toLowerCase().includes(dbSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedProductData = fnrProducts.find(p => p.id === selectedProduct) || fnrProducts[0];

  // Navigator logic: Rank materials based on user goals
  const getScoredMaterials = () => {
    return fnrProducts
      .filter(p => p.category === 'daemmung' || p.id === 'hempcrete')
      .map(p => {
        let score = 50; // Neutral baseline
        let reason = '';

        // Technical criteria modifiers
        if (navGoal === 'summer') {
          // Lehrmodell: Wärmespeicherfähigkeit ρ·c in kJ/(m³K), obere Rohdichte
          const rhoVal = parseFloat(p.rho.split('-')[1] || p.rho);
          const cVal = parseFloat(p.c.replace('.', ''));
          const inertia = (rhoVal * cVal) / 1000;
          if (inertia > 300) { score += 45; reason = inhalt.werte.hoheWärmespeicherfähigkeitC300; }
          else if (inertia > 120) { score += 30; reason = inhalt.werte.mittlereWärmespeicherfähigkeit120300; }
          else { score += 10; reason = inhalt.werte.geringeWärmespeicherfähigkeit120Kj; }
        }

        if (navGoal === 'heat') {
          // Score based on low lambda
          const lambdaMin = parseFloat(p.lambda.split(' ')[0].replace(',', '.'));
          if (lambdaMin < 0.040) { score += 45; reason = inhalt.werte.niedrigeWärmeleitfähigkeit0040; }
          else if (lambdaMin <= 0.045) { score += 30; reason = inhalt.werte.marktüblicheWärmeleitfähigkeit0045; }
          else { score += 15; reason = inhalt.werte.höhereWärmeleitfähigkeitErfordertDickere; }
        }

        if (navGoal === 'sound') {
          // Score based on density
          const maxRho = parseFloat(p.rho.split('-')[1] || p.rho);
          if (maxRho > 150) { score += 45; reason = inhalt.werte.hoheRohdichteGünstigFür; }
          else if (maxRho > 60) { score += 30; reason = inhalt.werte.mittlereRohdichteGuteHohlraumbedämpfung; }
          else { score += 10; reason = inhalt.werte.geringeRohdichteWirktV; }
        }

        if (navGoal === 'moisture') {
          // Score based on moisture protection / vapor permeability
          const muVal = parseFloat(p.mu.split('-')[1] || p.mu);
          if (p.id === 'hempcrete' || p.id === 'paludikultur') {
            score += 48; reason = inhalt.werte.kapillaraktivUndSorptionsfähigGeeignet;
          } else if (muVal < 5) {
            score += 35; reason = inhalt.werte.diffusionsoffenNiedrigerWertErleichtert;
          } else {
            score += 20; reason = inhalt.werte.sorptionsfähigAberHöhererDiffusionswider;
          }
        }

        if (navGoal === 'eco') {
          // Eco score (stroh, zellulose and paludikultur excel)
          if (p.id === 'stroh') { score += 49; reason = inhalt.werte.sehrGeringerHerstellungsaufwandLandwirts; }
          else if (p.id === 'zellulose') { score += 42; reason = inhalt.werte.überwiegendAusAltpapierSekundärrohstoff; }
          else if (p.id === 'paludikultur') { score += 45; reason = inhalt.werte.paludikulturAufWiedervernässtenMooren; }
          else { score += 25; reason = inhalt.werte.speichertBiogenenKohlenstoffHerstellungs; }
        }

        // Adjust score based on wall type matching
        if (navWallType === 'innen' && (p.id === 'paludikultur' || p.id === 'hempcrete' || p.id === 'holzfaser')) {
          score += 10;
        } else if (navWallType === 'innen' && (p.id === 'stroh' || p.id === 'zellulose')) {
          score -= 15; // Hard to use loose in wall interiors unless specialized boards are chosen
        }

        return {
          product: p,
          score: Math.min(100, Math.max(10, score)),
          reason
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  const scoredMaterials = getScoredMaterials();

  return (
    <div className="flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-shiraz/10 rounded-2xl text-shiraz border border-shiraz/20 shadow-sm">
              <Trees size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight">
                NaWaRo <span className="text-shiraz font-medium text-lg"><MdText text={inhalt.texte.biobasierteBaustoffe} /></span>
              </h2>
              <p className="text-xs text-text-main/60 font-medium"><MdText text={inhalt.texte.überblickMitBezugAuf} /></p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-100 text-slate-800 border border-slate-200 py-1.5 px-3 rounded-full text-xs font-semibold">
            <Leaf size={14} className="text-shiraz" /><MdText text={inhalt.texte.richtwerteKeineProduktdaten} /></div>
        </div>

        {/* Outer Navigation Tabs */}
        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">

        {/* Tab content 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="nawaro_overview_content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="text-base text-text-main/80 bg-off-white p-5 rounded-2xl border border-home-grau/30 leading-relaxed">
                  <span className="font-bold text-emerald-800 uppercase text-xs tracking-wider block mb-1"><MdText text={inhalt.texte.überDieFnrE} /></span><MdText text={inhalt.texte.dieFachagenturNachwachsendeRohstoffe} /></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-home-grau/20 p-4 rounded-xl bg-emerald-50/30 flex gap-3">
                    <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-text-main mb-1"><MdText text={inhalt.texte.coSpeicherEffektCarbon} /></h4>
                      <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.pflanzenEntziehenDerLuft} /></p>
                    </div>
                  </div>

                  <div className="border border-home-grau/20 p-4 rounded-xl bg-emerald-50/30 flex gap-3">
                    <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-text-main mb-1"><MdText text={inhalt.texte.ressourceneffizienzZirkularität} /></h4>
                      <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.wiederverwendungReUseUnd} /></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carbon storage visualization card */}
              <div className="border border-home-grau/30 rounded-2xl p-5 bg-white shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-text-main text-sm flex items-center gap-2 border-b border-home-grau/20 pb-2">
                  <Activity size={16} className="text-emerald-600" /> Kohlenstoff-Dynamik
                </h3>
                
                {/* Embedded SVG scheme */}
                <div className="flex justify-center bg-off-white rounded-xl border border-home-grau/30 p-2">
                  <svg width="100%" height="150" viewBox="0 0 240 150">
                    <g transform="translate(40, 100)">
                      <rect x="-3" y="0" width="6" height="30" fill="#A3113E" />
                      <path d="M 0 -45 L 20 0 L -20 0 Z" fill="#475569" />
                      <text x="0" y="45" fontSize="9" fill="#1e293b" textAnchor="middle">Wachstum</text>
                      <path d="M -25 -20 Q -10 -5 -2 -15" fill="none" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
                      <text x="-25" y="-23" fontSize="8" fill="#334155" textAnchor="end">CO₂ Bindung</text>
                    </g>
                    <path d="M 85 80 L 115 80" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-gray)" />
                    <g transform="translate(155, 100)">
                      <rect x="-20" y="0" width="40" height="25" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                      <path d="M -25 0 L 0 -20 L 25 0 Z" fill="#A3113E" stroke="#881235" strokeWidth="1.5" />
                      <text x="0" y="40" fontSize="9" fill="#1e293b" textAnchor="middle">Nutzung im Bau</text>
                      <text x="0" y="16" fontSize="10" fill="#1e293b" textAnchor="middle" fontWeight="bold">C-Speicher</text>
                    </g>
                    <defs>
                      <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
                      </marker>
                      <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                      </marker>
                    </defs>
                  </svg>
                </div>
                <p className="text-[11px] text-text-main/60 leading-normal"><MdText text={inhalt.texte.pflanzlicheBaustoffeSpeichernDen} /></p>
              </div>
            </div>

            {/* FNR Focus Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              <div className="border border-home-grau/30 p-4 rounded-xl bg-white hover:border-emerald-300 transition-all flex flex-col gap-2">
                <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase"><MdText text={inhalt.texte.produktgruppe1} /></span>
                <h4 className="font-bold text-sm text-text-main">Wärmedämmstoffe</h4>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.biobasierteZwischenUnterAufsparrendämmpl} /></p>
              </div>
              <div className="border border-home-grau/30 p-4 rounded-xl bg-white hover:border-emerald-300 transition-all flex flex-col gap-2">
                <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase"><MdText text={inhalt.texte.produktgruppe2} /></span>
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.massivKonstruktionsholz} /></h4>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.massivholzbauWieCltBrettsperrholz} /></p>
              </div>
              <div className="border border-home-grau/30 p-4 rounded-xl bg-white hover:border-emerald-300 transition-all flex flex-col gap-2">
                <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase"><MdText text={inhalt.texte.produktgruppe3} /></span>
                <h4 className="font-bold text-sm text-text-main">Verbundmaterialien</h4>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.verbundbaustoffeWieHanfkalkHempcrete} /></p>
              </div>
              <div className="border border-home-grau/30 p-4 rounded-xl bg-white hover:border-emerald-300 transition-all flex flex-col gap-2">
                <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase"><MdText text={inhalt.texte.produktgruppe4} /></span>
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.oberflächenFarbenBöden} /></h4>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.ressourcenschonenderInnenausbauUnterVerw} /></p>
              </div>
            </div>

            {/* Technical boundaries banner */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-xs text-amber-950/80 leading-relaxed">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
              <div><MdText text={inhalt.texte.konstruktiveBeachtungBiobasierteBaustoff} /></div>
            </div>
          </div>
        )}

        {/* Tab content 2: FNR DATABASE */}
        {activeTab === 'fnr_db' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="nawaro_db_content">
            
            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <AuswahlGruppe label="Filter Kategorie" className="flex flex-wrap gap-2">
                <button {...alsOption(dbCategory === 'all')}
                  onClick={() => setDbCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbCategory === 'all' 
                      ? 'bg-shiraz text-white border-shiraz' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                ><MdText text={inhalt.texte.alleProdukte} /></button>
                <button {...alsOption(dbCategory === 'daemmung')}
                  onClick={() => setDbCategory('daemmung')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbCategory === 'daemmung' 
                      ? 'bg-emerald-700 text-white border-emerald-700' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  Dämmstoffe
                </button>
                <button {...alsOption(dbCategory === 'tragwerk')}
                  onClick={() => setDbCategory('tragwerk')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbCategory === 'tragwerk' 
                      ? 'bg-blue-700 text-white border-blue-700' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  Tragwerk
                </button>
                <button {...alsOption(dbCategory === 'lehm_putz')}
                  onClick={() => setDbCategory('lehm_putz')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbCategory === 'lehm_putz' 
                      ? 'bg-amber-700 text-white border-amber-700' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                ><MdText text={inhalt.texte.lehmPutze} /></button>
                <button {...alsOption(dbCategory === 'boden')}
                  onClick={() => setDbCategory('boden')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbCategory === 'boden' 
                      ? 'bg-rose-700 text-white border-rose-700' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                ><MdText text={inhalt.texte.bödenLacke} /></button>
              </AuswahlGruppe>

              {/* Search input */}
              <div className="relative flex-grow max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-home-grau" />
                <input
                  type="text"
                  placeholder={inhalt.werte.materialSuchen}
                  value={dbSearch}
                  onChange={(e) => setDbSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 border border-home-grau/30 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 bg-white text-text-main font-medium placeholder:text-home-grau"
                />
              </div>
            </div>

            {/* Split layout: List vs Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Material List (col span 5) */}
              <AuswahlGruppe label="Produkt" className="lg:col-span-5 flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-2">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => (
                    <button {...alsOption(selectedProduct === p.id)}
                      key={p.id}
                      onClick={() => setSelectedProduct(p.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                        selectedProduct === p.id
                          ? 'bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                          : 'bg-white border-home-grau/30 hover:border-home-grau/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-text-main">{p.name}</span>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          p.category === 'daemmung' ? 'bg-emerald-100 text-emerald-800' :
                          p.category === 'tragwerk' ? 'bg-blue-100 text-blue-800' :
                          p.category === 'lehm_putz' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {p.category}
                        </span>
                      </div>
                      <p className="text-xs text-text-main/60 line-clamp-1">{p.description}</p>
                      <div className="flex items-center justify-between text-[11px] font-mono mt-1 text-text-main/50">
                        <span>λ = {p.lambda} W/(mK)</span>
                        <span>ρ = {p.rho} kg/m³</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12 text-xs text-text-main/50 border border-dashed border-home-grau/20 rounded-xl"><MdText text={inhalt.texte.keineMaterialienFürDiese} /></div>
                )}
              </AuswahlGruppe>

              {/* Material Details Sheet (col span 7) */}
              <div className="lg:col-span-7 bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-5">
                <div>
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
                    <Sparkles size={14} /> Materialsteckbrief
                  </div>
                  <h3 className="text-lg font-black text-text-main">{selectedProductData.name}</h3>
                  <p className="text-xs text-text-main/70 mt-1">{selectedProductData.description}</p>
                </div>

                {/* Technical Parameters Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20">
                    <span className="text-[10px] text-text-main/40 font-bold block"><MdText text={inhalt.texte.rohdichte} /></span>
                    <span className="font-mono text-sm font-bold text-text-main">{selectedProductData.rho} kg/m³</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20">
                    <span className="text-[10px] text-text-main/40 font-bold block"><MdText text={inhalt.texte.wärmeleitfähigkeit} /></span>
                    <span className="font-mono text-sm font-bold text-emerald-700">{selectedProductData.lambda} W/(mK)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20">
                    <span className="text-[10px] text-text-main/40 font-bold block"><MdText text={inhalt.texte.spezWärmeC} /></span>
                    <span className="font-mono text-sm font-bold text-text-main">{selectedProductData.c} J/(kgK)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20">
                    <span className="text-[10px] text-text-main/40 font-bold block"><MdText text={inhalt.texte.diffusionswiderst} /></span>
                    <span className="font-mono text-sm font-bold text-text-main">{selectedProductData.mu}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 col-span-2">
                    <span className="text-[10px] text-text-main/40 font-bold block"><MdText text={inhalt.texte.brandBaustoffklasse} /></span>
                    <span className="text-xs font-bold text-text-main block mt-0.5">{selectedProductData.fireClass}</span>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg">
                    <h4 className="text-xs font-black text-emerald-800 mb-2 flex items-center gap-1">
                      <CheckCircle2 size={13} /><MdText text={inhalt.texte.vorteilePotenziale} /></h4>
                    <ul className="text-xs text-emerald-950/80 space-y-1.5 list-disc list-inside">
                      {selectedProductData.advantages.map((adv, i) => (
                        <li key={i} className="leading-tight">{adv}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-torch-red/5 border border-torch-red/10 p-3 rounded-lg">
                    <h4 className="text-xs font-black text-danger mb-2 flex items-center gap-1">
                      <AlertCircle size={13} /><MdText text={inhalt.texte.grenzenRisiken} /></h4>
                    <ul className="text-xs text-text-main/80 space-y-1.5 list-disc list-inside">
                      {selectedProductData.disadvantages.map((dis, i) => (
                        <li key={i} className="leading-tight">{dis}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs">
                  <span className="font-bold text-text-main block mb-1">FNR-Praxisempfehlung:</span>
                  <p className="text-text-main/75">{selectedProductData.fnrUsage}</p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Tab content 3: DÄMMSTOFF NAVIGATOR */}
        {activeTab === 'navigator' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="nawaro_navigator_content">
            
            <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-200">
              <h3 className="font-bold text-sm text-emerald-900 mb-1 flex items-center gap-2">
                <Calculator size={18} /><MdText text={inhalt.texte.dämmstoffNavigatorLehrmodell} /></h3>
              <p className="text-xs text-emerald-900/80"><MdText text={inhalt.texte.wählenSieIhrePrimären} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Sidebar controls (col span 4) */}
              <div className="lg:col-span-4 flex flex-col gap-5 border border-home-grau/30 p-5 rounded-xl bg-white">
                
                {/* Rule-1: Prioritized Target (Interaktives Steuerelement) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.planerischerZielFokus} /></label>
                  <AuswahlGruppe label="Planerischer Zielfokus" className="flex flex-col gap-2">
                    <button {...alsOption(navGoal === 'summer')}
                      onClick={() => setNavGoal('summer')}
                      className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        navGoal === 'summer'
                          ? 'bg-shiraz text-white border-shiraz font-bold shadow-md'
                          : 'bg-white border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      <Zap size={16} className="text-amber-500" />
                      <div>
                        <span className="text-xs block"><MdText text={inhalt.texte.sommerlicherWärmeschutz} /></span>
                        <span className={`text-[10px] font-normal ${navGoal === 'summer' ? 'text-white/90' : 'text-text-main/50'}`}><MdText text={inhalt.texte.verzögerungVonHitzeeinträgenPhasenversch} /></span>
                      </div>
                    </button>

                    <button {...alsOption(navGoal === 'heat')}
                      onClick={() => setNavGoal('heat')}
                      className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        navGoal === 'heat'
                          ? 'bg-shiraz text-white border-shiraz font-bold shadow-md'
                          : 'bg-white border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      <Layers size={16} className="text-blue-500" />
                      <div>
                        <span className="text-xs block"><MdText text={inhalt.texte.maximalerKälteschutzWärmeschutz} /></span>
                        <span className={`text-[10px] font-normal ${navGoal === 'heat' ? 'text-white/90' : 'text-text-main/50'}`}><MdText text={inhalt.texte.niedrigeWärmeleitfähigkeitFürDünne} /></span>
                      </div>
                    </button>

                    <button {...alsOption(navGoal === 'sound')}
                      onClick={() => setNavGoal('sound')}
                      className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        navGoal === 'sound'
                          ? 'bg-shiraz text-white border-shiraz font-bold shadow-md'
                          : 'bg-white border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      <Activity size={16} className="text-purple-500" />
                      <div>
                        <span className="text-xs block"><MdText text={inhalt.texte.akustischeDämpfungSchallschutz} /></span>
                        <span className={`text-[10px] font-normal ${navGoal === 'sound' ? 'text-white/90' : 'text-text-main/50'}`}><MdText text={inhalt.texte.höhereRohdichteVerbessertDie} /></span>
                      </div>
                    </button>

                    <button {...alsOption(navGoal === 'moisture')}
                      onClick={() => setNavGoal('moisture')}
                      className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        navGoal === 'moisture'
                          ? 'bg-shiraz text-white border-shiraz font-bold shadow-md'
                          : 'bg-white border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      <Droplets size={16} className="text-sky-500" />
                      <div>
                        <span className="text-xs block"><MdText text={inhalt.texte.feuchtesicherheitDiffusion} /></span>
                        <span className={`text-[10px] font-normal ${navGoal === 'moisture' ? 'text-white/90' : 'text-text-main/50'}`}><MdText text={inhalt.texte.diffusionsoffeneUndKapillaraktiveRücktro} /></span>
                      </div>
                    </button>

                    <button {...alsOption(navGoal === 'eco')}
                      onClick={() => setNavGoal('eco')}
                      className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        navGoal === 'eco'
                          ? 'bg-shiraz text-white border-shiraz font-bold shadow-md'
                          : 'bg-white border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      <Leaf size={16} className="text-emerald-500" />
                      <div>
                        <span className="text-xs block"><MdText text={inhalt.texte.minimierteGraueEnergieÖko} /></span>
                        <span className={`text-[10px] font-normal ${navGoal === 'eco' ? 'text-white/90' : 'text-text-main/50'}`}><MdText text={inhalt.texte.niedrigsterHerstellungsaufwandRecycling} /></span>
                      </div>
                    </button>
                  </AuswahlGruppe>
                </div>

                {/* Wall/Building Component */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.dämmendesBauteil} /></label>
                  <select aria-label={inhalt.werte.dämmendesBauteil}
                    value={navWallType}
                    onChange={(e) => setNavWallType(e.target.value as typeof navWallType)}
                    className="w-full border border-home-grau/30 rounded-lg p-2 text-xs text-text-main font-semibold bg-white"
                  >
                    <option value="dach">Steildach / Zwischensparrendämmung</option>
                    <option value="innen"> Fachwerk-Innendämmung (feuchtekritisch)</option>
                    <option value="fassade">Hinterlüftete Außenfassade / Holzbau-WDVS</option>
                  </select>
                </div>

              </div>

              {/* Dynamic results display (col span 8) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <h3 className="font-bold text-sm text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.dämmstoffDynamikRanking} /></h3>
                
                <div className="flex flex-col gap-4">
                  {scoredMaterials.slice(0, 4).map((m, idx) => (
                    <div
                      key={m.product.id}
                      className="border border-home-grau/30 rounded-xl p-4 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-emerald-400 transition-all"
                    >
                      <div className="flex-grow flex flex-col gap-1.5 max-w-lg">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-sm text-text-main">{m.product.name}</span>
                          {idx === 0 && (
                            <span className="text-[9px] font-black uppercase text-white bg-emerald-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Sparkles size={10} /> Empfehlung
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-850 font-medium leading-normal bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/60">
                          {m.reason}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] text-text-main/40 font-mono mt-1">
                          <span>λ: {m.product.lambda} W/(mK)</span>
                          <span>ρ: {m.product.rho} kg/m³</span>
                          <span>c: {m.product.c} J/(kgK)</span>
                        </div>
                      </div>

                      {/* Score visual metric */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0 self-end md:self-center">
                        <span className="text-xs font-bold text-emerald-700 font-mono">{formatDeWert(m.score)}% Eignung</span>
                        <div className="w-24 bg-home-grau/20 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${m.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab content 4: COMPARISONS */}
        {activeTab === 'comparison' && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-8" id="nawaro_comparison_content">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.technischerDetailvergleichZwischenKonven} /></p>
            </div>

            {/* Dämmstoffe Vergleich */}
            <div>
              <h3 className="font-bold text-text-main text-base mb-3 flex items-center gap-2">
                <Scale size={18} className="text-shiraz" /><MdText text={inhalt.texte.wärmedämmstoffeErdölEpsVs} /></h3>
              <div className="overflow-x-auto bg-white rounded-xl border border-home-grau/30">
                <table className="w-full text-left text-sm">
                  <thead className="bg-home-grau/5">
                    <tr>
                      <th className="py-3 px-4 font-bold text-text-main">Eigenschaft</th>
                      <th className="py-3 px-4 font-bold text-text-main border-l border-home-grau/10"><MdText text={inhalt.texte.epsStyropor} /></th>
                      <th className="py-3 px-4 font-bold text-emerald-700 border-l border-home-grau/10">Holzfaserdämmplatte</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-home-grau/10">
                      <td className="py-3 px-4 font-medium"><MdText text={inhalt.texte.wärmeleitfähigkeit2} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono"><MdText text={inhalt.texte.t00320040} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700"><MdText text={inhalt.texte.t00380050} /></td>
                    </tr>
                    <tr className="border-t border-home-grau/10 bg-off-white/50">
                      <td className="py-3 px-4 font-medium"><MdText text={inhalt.texte.spezifischeWärmekapazitätC} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono"><MdText text={inhalt.texte.t1500JKg} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700"><MdText text={inhalt.texte.t2100JKg} /><span className="text-xs block text-emerald-600"><MdText text={inhalt.texte.bessererSommerlicherWärmeschutz} /></span></td>
                    </tr>
                    <tr className="border-t border-home-grau/10">
                      <td className="py-3 px-4 font-medium"><MdText text={inhalt.texte.rohdichte2} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono"><MdText text={inhalt.texte.t1530KgM} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700"><MdText text={inhalt.texte.t110200KgM} /><span className="text-xs block text-emerald-600"><MdText text={inhalt.texte.mehrSchallschutzmasse} /></span></td>
                    </tr>
                    <tr className="border-t border-home-grau/10 bg-off-white/50">
                      <td className="py-3 px-4 font-medium"><MdText text={inhalt.texte.diffusionswiderstand} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono">20 - 100</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">3 - 5 <span className="text-xs block text-emerald-600">(diffusionsoffen)</span></td>
                    </tr>
                    <tr className="border-t border-home-grau/10">
                      <td className="py-3 px-4 font-medium">Brandschutz-Klassifizierung</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono"><MdText text={inhalt.texte.brandverhaltenEuroklasseEPlatte} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700"><MdText text={inhalt.texte.b2NormalentflammbarE} /></td>
                    </tr>
                    <tr className="border-t border-home-grau/10 bg-off-white/50">
                      <td className="py-3 px-4 font-medium"><MdText text={inhalt.texte.primärenergieNichtErneuerbarPenrt} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-torch-red"><MdText text={inhalt.texte.t100MjKgNicht} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700"><MdText text={inhalt.texte.t15MjKgBiogen} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tragende Konstruktionen */}
            <div>
              <h3 className="font-bold text-text-main text-base mb-3 flex items-center gap-2">
                <Scale size={18} className="text-shiraz" /><MdText text={inhalt.texte.tragwerkNormalbetonVsBrettschichtholz} /></h3>
              <div className="overflow-x-auto bg-white rounded-xl border border-home-grau/30">
                <table className="w-full text-left text-sm">
                  <thead className="bg-home-grau/5">
                    <tr>
                      <th className="py-3 px-4 font-bold text-text-main">Eigenschaft</th>
                      <th className="py-3 px-4 font-bold text-text-main border-l border-home-grau/10"><MdText text={inhalt.texte.normalbetonC2530} /></th>
                      <th className="py-3 px-4 font-bold text-emerald-700 border-l border-home-grau/10"><MdText text={inhalt.texte.brettschichtholzBsh} /></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-home-grau/10">
                      <td className="py-3 px-4 font-medium"><MdText text={inhalt.texte.rohdichte3} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono"><MdText text={inhalt.texte.t2400KgM} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">~420 kg/m³ <span className="text-xs block text-emerald-600"><MdText text={inhalt.texte.geringereEigenlast} /></span></td>
                    </tr>
                    <tr className="border-t border-home-grau/10 bg-off-white/50">
                      <td className="py-3 px-4 font-medium"><MdText text={inhalt.texte.zugBzwBiegefestigkeit} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono"><MdText text={inhalt.texte.fCtm26} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700">24 N/mm² <span className="text-xs block text-emerald-600"><MdText text={inhalt.texte.charBiegefestigkeitFM} /></span></td>
                    </tr>
                    <tr className="border-t border-home-grau/10">
                      <td className="py-3 px-4 font-medium"><MdText text={inhalt.texte.elastizitätsmodulE} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono"><MdText text={inhalt.texte.t31000NMm} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700"><MdText text={inhalt.texte.t11500NMm} /></td>
                    </tr>
                    <tr className="border-t border-home-grau/10 bg-off-white/50">
                      <td className="py-3 px-4 font-medium">CO₂-Bilanz</td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-torch-red"><MdText text={inhalt.texte.klinkerentsäuerungEmittiertCo} /></td>
                      <td className="py-3 px-4 border-l border-home-grau/10 font-mono text-emerald-700"><MdText text={inhalt.texte.biogenerKohlenstoffspeicherCa0} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <FormulaDerivationBox
              title={inhalt.werte.anwendungsbeispielBiogenerKohlenstoffIn}
              zielGleichung="P_{CO_2} = \frac{44}{12} \cdot cf \cdot \frac{\rho_\omega \cdot V_\omega}{1 + \omega/100}"
              normQuelle={inhalt.werte.dinEn164492014}
              schritte={inhalt.daten["Nawaro.schritte"]}
              ergebnisHinweis={inhalt.werte.rund069T}
            />

          </div>
        )}

        </ModuleTabs>
      </div>
      
      
      <ModulTest moduleId="nawaro" />

      <ModuleFooter 
        wikipedia={[
          { title: inhalt.werte.nachwachsenderRohstoff, url: 'https://de.wikipedia.org/wiki/Nachwachsender_Rohstoff' },
          { title: inhalt.werte.fachagenturNachwachsendeRohstoffe, url: 'https://de.wikipedia.org/wiki/Fachagentur_Nachwachsende_Rohstoffe' },
          { title: 'Dämmstoff', url: 'https://de.wikipedia.org/wiki/D%C3%A4mmstoff' },
          { title: 'Holzfaserwerkstoff', url: 'https://de.wikipedia.org/wiki/Holzfaserwerkstoff' }
        ]}
        literatur={inhalt.daten["Nawaro.literatur"]}
        weblinks={[
          { title: inhalt.werte.fnrThemenportalBauen, url: 'https://baustoffe.fnr.de/' }
        ]}
        regelwerke={inhalt.daten["Nawaro.regelwerke"]}
        formeln={inhalt.daten["Nawaro.formeln"]}
      />
    </div>
  );
}
