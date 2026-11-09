import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Layers, Calculator, Info, Trees, ArrowRight, CheckCircle2, AlertTriangle, Star, BookOpen, ShieldAlert } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { InnovationPraxisSection } from '@/src/components/ui/InnovationPraxisSection';
import inhalt from '@/content/bpholzprodukte/BpHolzprodukte.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { bemesseEinfeldbalken, GAMMA_M_HOLZ, type KLED, type Nutzungsklasse } from '@/src/calc/holzbau';
import { BSH_EN14080, HOLZ_EN338, type HolzKennwerte } from '@/src/data/kennwerte';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';
import { reglerName } from '@/src/lib/reglerName';

interface WoodProductType {
  id: string;
  name: string;
  short: string;
  density: number; // kg/m³
  eModulus: number; // N/mm² (mean)
  f_mk: number; // Char. bending strength, N/mm²
  f_vk: number; // Char. shear strength, N/mm²
  advantages: string[];
  disadvantages: string[];
  usecases: string[];
  dimensions: string;
}

const woodProducts: WoodProductType[] = inhalt.daten.woodProducts;

function WoodThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadHolzIm} /></h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5"><MdText text={inhalt.texte.weiterZuDenAnderen} /></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('holz')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t1BaustoffKennwerte} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.anisotropesQuellenSchwinden3d} /></span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_holzprodukte')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t2HolzproduktePraxis} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.konstruktionsvollholzCltVorUnd} /></span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={() => setActiveTab('holzkorrosion')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t3Dauerhaftigkeit} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.holzzerstörendePilzeInsektenWitterung} /></span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function BpHolzprodukte() {
  const [selectedWood, setSelectedWood] = useState<WoodProductType>(woodProducts[0]);
  
  // Calculator States
  const [span, setSpan] = useState<number>(4.5); // L in m
  const [spacing, setSpacing] = useState<number>(0.625); // s in m (Standard-Sparren/Balkenraster)
  const [loadk, setLoadk] = useState<number>(1.5); // q_k Nutzlast in kN/m² (Kategorie A2/A3)
  const [loadg, setLoadg] = useState<number>(1.0); // g_k Ausbaulast (Fußbodenaufbau, Unterdecke) in kN/m²
  const [beamWidth, setBeamWidth] = useState<number>(100); // b in mm
  const [beamHeight, setBeamHeight] = useState<number>(200); // h in mm
  const [woodClass, setWoodClass] = useState<string>('c24'); // strength class selection
  const [nkl, setNkl] = useState<Nutzungsklasse>(1);
  const [kled, setKled] = useState<KLED>('mtl'); // Nutzlast Kategorie A: mittel

  // Kennwerte zentral aus src/data/kennwerte.ts (DIN EN 338:2016, DIN EN 14080:2013; ρ_mean für das Eigengewicht)
  const KLASSE_ZU_NORM: Record<string, { name: string; k: HolzKennwerte }> = {
    c24: { name: 'KVH C24', k: HOLZ_EN338.C24 }, gl24h: { name: 'BSH GL24h', k: BSH_EN14080.GL24h },
    gl28h: { name: 'BSH GL28h', k: BSH_EN14080.GL28h }, gl30h: { name: 'BSH GL30h', k: BSH_EN14080.GL30h },
  };
  const sel = KLASSE_ZU_NORM[woodClass] ?? KLASSE_ZU_NORM.c24;
  const activeMat = { name: sel.name, f_mk: sel.k.fmk, f_vk: sel.k.fvk, E: sel.k.E0mean, density: sel.k.rhoMean, gammaM: GAMMA_M_HOLZ };
  // Rechenkern src/calc/holzbau.ts: Einfeldbalken (Biegung, Schub mit k_cr, w_inst/w_fin/w_net,fin mit k_def); k_mod aus NKL und KLED
  const balken = bemesseEinfeldbalken({
    l: span, abstand: spacing, gk: loadg, qk: loadk, b: beamWidth, h: beamHeight,
    fmk: activeMat.f_mk, fvk: activeMat.f_vk, E0mean: activeMat.E, rhoMean: activeMat.density,
    brettschichtholz: woodClass !== 'c24', nkl, kled, gammaM: activeMat.gammaM,
  });
  const { sigma_md, f_md, k_cr, tau_d, f_vd, w_inst } = balken;
  const w_limit = balken.w_grenz;
  const bendingUtilization = balken.eta_m, shearUtilization = balken.eta_v, deflectionUtilization = balken.eta_w;
  const isSafe = balken.ok;

  return (
    <div id="bp-holzprodukte-module" className="flex flex-col gap-8">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
            <Trees className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.holzprodukteImKonstruktivenHolzbau} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.technischeKenngrößenBauaufsichtlicheVerl} /></p>
        </div>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.holzwerkstoffeHabenSichVon} /></p>
      </div>

      {/* Main Material Database & Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left selector */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-text-main/50 uppercase tracking-wider block"><MdText text={inhalt.texte.verfügbareHolzwerkstoffKlassen} /></span>
          <div className="flex flex-col gap-2.5">
            {woodProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedWood(p)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${
                  selectedWood.id === p.id
                    ? 'bg-shiraz text-white border-shiraz shadow-md scale-[1.02]'
                    : 'bg-white text-text-main hover:bg-slate-50 border-home-grau/30 shadow-sm'
                }`}
              >
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block ${selectedWood.id === p.id ? 'text-white/60' : 'text-text-main/40'}`}>
                    {p.short}
                  </span>
                  <span className="font-extrabold text-sm">{p.name}</span>
                </div>
                <ArrowRight size={16} className={`opacity-70 ${selectedWood.id === p.id ? 'translate-x-1' : ''} transition-transform`} />
              </button>
            ))}
          </div>

          <div className="bg-off-white/40 p-4 border border-home-grau/30 rounded-xl space-y-2 mt-4 text-xs text-slate-800 leading-relaxed">
            <div className="flex gap-1.5 items-center font-bold">
              <Info size={14} className="text-shiraz" />
              <span><MdText text={inhalt.texte.nutzungsklassenNklNachEc} /></span>
            </div>
            <p className="font-normal text-[11px] text-text-main/80"><MdText text={inhalt.texte.nkl1HolzfeuchteEntspricht} /></p>
          </div>
        </div>

        {/* Right product sheet */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
          <div className="border-b border-home-grau/15 pb-4 flex justify-between items-start flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-shiraz uppercase tracking-wider block"><MdText text={inhalt.texte.technischesDatenblatt} /></span>
              <h3 className="text-xl font-bold text-text-main mt-0.5">{selectedWood.name}</h3>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-home-grau/10 text-right">
              <span className="text-[10px] text-text-main/40 block leading-tight"><MdText text={inhalt.texte.typischesBiegeFM} /></span>
              <span className="text-sm font-bold text-slate-800 font-mono">{formatDeWert(selectedWood.f_mk)} N/mm²</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50/70 p-3 rounded-xl border border-home-grau/30 text-center">
              <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1"><MdText text={inhalt.texte.dichteK} /></span>
              <span className="text-base font-bold font-mono text-slate-800">~{formatDeWert(selectedWood.density)} kg/m³</span>
            </div>
            <div className="bg-slate-50/70 p-3 rounded-xl border border-home-grau/30 text-center">
              <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1"><MdText text={inhalt.texte.eModulEMean} /></span>
              <span className="text-base font-bold font-mono text-slate-800">{formatDeWert(selectedWood.eModulus)} MPa</span>
            </div>
            <div className="bg-slate-50/70 p-3 rounded-xl border border-home-grau/30 text-center">
              <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">Schub-f_v,k</span>
              <span className="text-base font-bold font-mono text-slate-800">{formatDeZahl(selectedWood.f_vk, 1)} N/mm²</span>
            </div>
            <div className="bg-slate-50/70 p-3 rounded-xl border border-home-grau/30 text-center">
              <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">Liefermaße</span>
              <span className="text-xs font-semibold text-slate-700 leading-snug line-clamp-2 block mt-1">
                {selectedWood.dimensions}
              </span>
            </div>
          </div>

          {/* Advantages & Disadvantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-home-grau/10">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase block tracking-wider"><MdText text={inhalt.texte.vorteileStärken} /></span>
              <ul className="space-y-1.5">
                {selectedWood.advantages.map((adv, i) => (
                  <li key={i} className="text-xs text-text-main/80 flex gap-2 items-start font-normal">
                    <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-red-800 uppercase block tracking-wider"><MdText text={inhalt.texte.einschränkungenRisiken} /></span>
              <ul className="space-y-1.5">
                {selectedWood.disadvantages.map((dis, i) => (
                  <li key={i} className="text-xs text-text-main/80 flex gap-2 items-start font-normal">
                    <AlertTriangle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Practical Applications */}
          <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/10 mt-4 space-y-2">
            <span className="text-xs font-bold text-text-main/60 uppercase block"><MdText text={inhalt.texte.häufigeAnwendungsbereicheBaupraxis} /></span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-800">
              {selectedWood.usecases.map((uc, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white p-2 border border-home-grau/30 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                  <span>{uc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* timber beam deflection calculator */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-home-grau/15 pb-4">
          <Calculator className="text-shiraz" />
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.ec5HolzbalkenPre} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.einfacheAbschätzungFürEinfeldträger} /></p>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input column 1 */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-text-main/60 uppercase block tracking-wider">Träger-Geometrie</span>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main"><MdText text={inhalt.texte.spannweiteL} /></label>
                <span className="text-shiraz font-mono">{formatDeZahl(span, 2)} m</span>
              </div>
              <input 
                type="range" 
                min="2.0" 
                max="10.0" 
                step="0.1" 
                value={span}
                aria-label={reglerName(inhalt.texte.spannweiteL)}
                aria-valuetext={`${formatDeZahl(span, 2)} m`} 
                onChange={(e) => setSpan(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main"><MdText text={inhalt.texte.achsabstandDerBalkenS} /></label>
                <span className="text-shiraz font-mono">{formatDeZahl((spacing * 100), 1)} cm</span>
              </div>
              <input 
                type="range" 
                min="0.300" 
                max="1.250" 
                step="0.025" 
                value={spacing}
                aria-label={reglerName(inhalt.texte.achsabstandDerBalkenS)}
                aria-valuetext={`${formatDeZahl((spacing * 100), 1)} cm`} 
                onChange={(e) => setSpacing(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main"><MdText text={inhalt.texte.einflussFlächenlastQK} /></label>
                <span className="text-shiraz font-mono">{formatDeZahl(loadk, 1)} kN/m²</span>
              </div>
              <input
                type="range"
                aria-label={inhalt.werte.nutzlastQk}
                min="0.0"
                max="8.0"
                step="0.1"
                value={loadk}
                aria-valuetext={`${formatDeZahl(loadk, 1)} kN/m²`}
                onChange={(e) => setLoadk(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <span className="text-[10px] text-text-main/40 block leading-tight"><MdText text={inhalt.texte.inklVerkehrlicheNutzlastenRaumbildende} /></span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main"><MdText text={inhalt.texte.ausbaulastGk} /></label>
                <span className="text-shiraz font-mono">{formatDeZahl(loadg, 1)} kN/m²</span>
              </div>
              <input
                type="range"
                aria-label={inhalt.werte.ausbaulastGk}
                min="0.0"
                max="4.0"
                step="0.1"
                value={loadg}
                aria-valuetext={`${formatDeZahl(loadg, 1)} kN/m²`}
                onChange={(e) => setLoadg(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-text-main flex flex-col gap-1"><MdText text={inhalt.texte.nutzungsklasseEinfeld} />
                <select aria-label={inhalt.werte.nutzungsklasseEinfeld} value={nkl} onChange={(e) => setNkl(Number(e.target.value) as Nutzungsklasse)}
                  className="w-full text-xs p-1.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800">
                  <option value={1}>NKL 1</option>
                  <option value={2}>NKL 2</option>
                  <option value={3}>NKL 3</option>
                </select>
              </label>
              <label className="text-xs font-bold text-text-main flex flex-col gap-1"><MdText text={inhalt.texte.kledEinfeld} />
                <select aria-label={inhalt.werte.kledEinfeld} value={kled} onChange={(e) => setKled(e.target.value as KLED)}
                  className="w-full text-xs p-1.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800">
                  <option value="stnd">{inhalt.werte.kledStaendig}</option>
                  <option value="lg">{inhalt.werte.kledLang}</option>
                  <option value="mtl">{inhalt.werte.kledMittel}</option>
                  <option value="krt">{inhalt.werte.kledKurz}</option>
                </select>
              </label>
            </div>
          </div>

          {/* Input column 2 */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-text-main/60 uppercase block tracking-wider"><MdText text={inhalt.texte.querschnittHolzgüte} /></span>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.verwendeteHolzgüte} /></label>
              <select aria-label={inhalt.werte.verwendeteHolzgüte}
                value={woodClass}
                onChange={(e) => setWoodClass(e.target.value)}
                className="w-full text-xs p-2 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
              >
                <option value="c24">KVH / Vollholz C24 (Standard)</option>
                <option value="gl24h">Brettschichtholz BSH GL24h (Standard-Zweck)</option>
                <option value="gl28h">Brettschichtholz BSH GL28h (Erhöhte Festigkeit)</option>
                <option value="gl30h">Brettschichtholz BSH GL30h (Premium-Leimbinder)</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main"><MdText text={inhalt.texte.balkenbreiteB} /></label>
                <span className="text-shiraz font-mono">{formatDeWert(beamWidth)} mm</span>
              </div>
              <input 
                type="range" 
                min="60" 
                max="240" 
                step="20" 
                value={beamWidth}
                aria-label={reglerName(inhalt.texte.balkenbreiteB)}
                aria-valuetext={`${formatDeWert(beamWidth)} mm`} 
                onChange={(e) => setBeamWidth(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-text-main"><MdText text={inhalt.texte.balkenhöheH} /></label>
                <span className="text-shiraz font-mono">{formatDeWert(beamHeight)} mm</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="440" 
                step="20" 
                value={beamHeight}
                aria-label={reglerName(inhalt.texte.balkenhöheH)}
                aria-valuetext={`${formatDeWert(beamHeight)} mm`} 
                onChange={(e) => setBeamHeight(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
            </div>
          </div>

          {/* Results column 3 */}
          <div className="flex flex-col justify-between bg-slate-50 p-4 rounded-2xl border border-home-grau/30">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-home-grau/10">
                <span className="text-xs font-bold text-text-main/50 uppercase">Statusergebnis:</span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  isSafe ? 'bg-emerald-150 text-emerald-800 border border-emerald-300' : 'bg-red-150 text-red-800 border border-red-300'
                }`}>
                  {isSafe ? inhalt.werte.tragfähigOk : inhalt.werte.überlastetNichtOk}
                </span>
              </div>

              <EingabeHinweise hinweise={balken.hinweise} />
              <ErgebnisAnsage text={kurzzeile(ansageWert('Ausnutzung Biegung', bendingUtilization, 0, '%'), ansageWert('Schub', shearUtilization, 0, '%'), ansageWert('Durchbiegung', deflectionUtilization, 0, '%'), Number.isFinite(bendingUtilization) && (isSafe ? 'Nachweis erfüllt' : 'Nachweis nicht erfüllt'))} />
              {/* Util percentages */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="font-sans font-semibold text-text-main/80"><MdText text={inhalt.texte.t1BiegespannungUls} /></span>
                    <span className={`font-bold ${bendingUtilization > 100 ? 'text-red-700' : 'text-slate-700'}`}>
                      {formatDeZahl(bendingUtilization, 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${bendingUtilization > 100 ? 'bg-red-600' : 'bg-shiraz'}`}
                      style={{ width: `${Math.min(100, bendingUtilization)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-text-main/50 block font-sans mt-0.5">
                    σ_md = {formatDeZahl(sigma_md, 2)}<MdText text={inhalt.texte.nMmVsF} />{formatDeZahl(f_md, 2)} N/mm²
                  </span>
                </div>

                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="font-sans font-semibold text-text-main/80"><MdText text={inhalt.texte.t2SchubspannungUls} /></span>
                    <span className={`font-bold ${shearUtilization > 100 ? 'text-red-700' : 'text-slate-700'}`}>
                      {formatDeZahl(shearUtilization, 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${shearUtilization > 100 ? 'bg-red-600' : 'bg-shiraz'}`}
                      style={{ width: `${Math.min(100, shearUtilization)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-text-main/50 block font-sans mt-0.5">
                    τ_d = {formatDeZahl(tau_d, 2)}<MdText text={inhalt.texte.nMmBEf} />{formatDeZahl(k_cr, 2)}<MdText text={inhalt.texte.vsFVd} />{formatDeZahl(f_vd, 2)} N/mm²
                  </span>
                </div>

                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="font-sans font-semibold text-text-main/80"><MdText text={inhalt.texte.t3DurchbiegungSlsComfort} /></span>
                    <span className={`font-bold ${deflectionUtilization > 100 ? 'text-red-700' : 'text-slate-700'}`}>
                      {formatDeZahl(deflectionUtilization, 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${deflectionUtilization > 100 ? 'bg-red-600' : 'bg-sky-600'}`}
                      style={{ width: `${Math.min(100, deflectionUtilization)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-text-main/50 block font-sans mt-0.5">
                    w_inst = {formatDeZahl(w_inst, 1)}<MdText text={inhalt.texte.mmVsMaxL} />{formatDeZahl(w_limit, 1)} mm
                  </span>
                  <span className="text-[9px] text-text-main/50 block font-sans">
                    w_fin = {formatDeZahl(balken.w_fin, 1)}<MdText text={inhalt.texte.mmVsMaxL200} />{formatDeZahl(balken.w_grenz_fin, 1)} mm
                  </span>
                  <span className="text-[9px] text-text-main/50 block font-sans">
                    w_net,fin = {formatDeZahl(balken.w_net_fin, 1)}<MdText text={inhalt.texte.mmVsMaxL} />{formatDeZahl(balken.w_grenz_net, 1)} mm (k_def = {formatDeZahl(balken.kdef, 2)}, ψ₂ = {formatDeZahl(balken.psi2, 1)})
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-home-grau/10 text-[10px] space-y-1 text-text-main/60 font-sans leading-relaxed">
              <div><MdText text={inhalt.texte.eigengewicht} /><strong>{formatDeZahl(balken.masse, 1)} kg/m</strong> (~{formatDeWert(activeMat.density)}<MdText text={inhalt.texte.kgMDensity} /></div>
              <div><MdText text={inhalt.texte.teilsicherheitsbeiwerteG135} /></div>
              <div><MdText text={inhalt.texte.kModBeiwert0} />{formatDeZahl(balken.kmod, 2)} / γ_M = {formatDeZahl(activeMat.gammaM, 1)}</div>
              <div>{balken.kombination === 'G'
                ? <><MdText text={inhalt.texte.kombinationG} />{formatDeZahl(balken.eta_m_GQ, 1)}<MdText text={inhalt.texte.kombinationAusnutzung} /></>
                : <><MdText text={inhalt.texte.kombinationGQ} />{formatDeZahl(balken.eta_m_G, 1)}<MdText text={inhalt.texte.kombinationAusnutzung} /></>}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Industrial Wood Suppliers Table */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm mt-2 bg-slate-50/50">
        <h3 className="font-bold text-home-prim text-lg mb-2 flex items-center gap-2">
          <Star className="text-shiraz" size={18} /><MdText text={inhalt.texte.produktgruppenSystemtechnikenDesHolzbaus} /></h3>
        <p className="text-xs text-text-main/60 mb-4 italic"><MdText text={inhalt.texte.hinweisZurHerstellerneutralitätZur} /></p>
        <p className="text-xs text-text-main/70 mb-4 font-normal"><MdText text={inhalt.texte.holzbauprodukteErfordernEineCe} /></p>
        <div className="overflow-x-auto rounded-xl border border-home-grau/15 bg-white">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-home-grau/15 text-text-main/80 font-bold font-sans">
                <th className="p-3"><MdText text={inhalt.texte.systemwerkstoffProduktgruppe} /></th>
                <th className="p-3"><MdText text={inhalt.texte.kernkompetenzenAnwendungsbereiche} /></th>
                <th className="p-3"><MdText text={inhalt.texte.zertifikateNormenHolzarten} /></th>
                <th className="p-3"><MdText text={inhalt.texte.rolleImModernenIngenieurholzbau} /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-text-main/80">
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.brettsperrholzCltBsp} /></td>
                <td className="p-3"><MdText text={inhalt.texte.flächigeTragelementeAusKreuzweise} /></td>
                <td className="p-3 font-mono"><MdText text={inhalt.texte.pefcFscDinEn} /></td>
                <td className="p-3"><MdText text={inhalt.texte.hochbelastbarerMassivholzbauFürMehrgesch} /></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.holzwerkstoffplattenOsbSpanplattenMdf} /></td>
                <td className="p-3"><MdText text={inhalt.texte.ausgerichteteFlachpressplattenUndSpanpla} /></td>
                <td className="p-3 font-mono"><MdText text={inhalt.texte.fscCeNachDin} /></td>
                <td className="p-3"><MdText text={inhalt.texte.standardPlattenwerkstoffeFürDen} /></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.ökologischeHolzfaserDämmsysteme} /></td>
                <td className="p-3"><MdText text={inhalt.texte.flexibleUndDruckfesteDämmplatten} /></td>
                <td className="p-3 font-mono"><MdText text={inhalt.texte.fscDinEn13171} /></td>
                <td className="p-3"><MdText text={inhalt.texte.guterSommerlicherWärmeschutzUnd} /></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.brettschichtholzBshStegträger} /></td>
                <td className="p-3"><MdText text={inhalt.texte.faserparallelVerklebteHolzlamellenFür} /></td>
                <td className="p-3 font-mono"><MdText text={inhalt.texte.pefcDinEn14080} /></td>
                <td className="p-3"><MdText text={inhalt.texte.ingenieurholzbaulösungenFürWeitgespannte} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <InnovationPraxisSection moduleKey="bp_holzprodukte" />

      <WoodThematicLinks current="bauprodukt" />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielDeckenbalkenC24Vordime}
          zielGleichung="M_{Ed} = \frac{q_d L^2}{8}, \quad \sigma_{m,d} = \frac{M_{Ed}}{W} \le k_{mod} \frac{f_{m,k}}{\gamma_M}"
          normQuelle={inhalt.werte.dinEn19951}
          schritte={inhalt.daten["BpHolzprodukte.schritte"]}
          ergebnisHinweis={inhalt.werte.beiHolzbalkendeckenWirdOft}
        />
      </div>

      <ModulTest moduleId="bp_holzprodukte" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Konstruktionsvollholz', url: 'https://de.wikipedia.org/wiki/Konstruktionsvollholz' },
          { title: 'Brettschichtholz', url: 'https://de.wikipedia.org/wiki/Brettschichtholz' },
          { title: 'Brettsperrholz', url: 'https://de.wikipedia.org/wiki/Brettsperrholz' }
        ]} 
        literatur={inhalt.daten["BpHolzprodukte.literatur"]} 
        regelwerke={inhalt.daten["BpHolzprodukte.regelwerke"]} 
        formeln={inhalt.daten["BpHolzprodukte.formeln"]} 
      />
    </div>
  );
}
