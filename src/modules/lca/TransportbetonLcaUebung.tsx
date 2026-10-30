import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Truck, 
  Building2, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  ArrowRight,
  Info
} from 'lucide-react';
import { LCA_BENCHMARKS, LKW_FAKTOR_UEBUNG, LKW_FAKTOR_ZENTRAL } from './transportbetonKennwerte';
import { K_WERT_DIN1045_2 } from '@/src/calc/mischung';
import { getMassgebendeAnforderung } from '@/src/data/standards/din1045_2';

/**
 * Umsetzung 30.10.2026 (DSB-LC-9): w/z-Grenze der Web-Übung an die Fallstudie gekoppelt – Expositionsklassen
 * XC4/XD1/XF1, maßgebend XD1 nach DIN 1045-2:2023-08 mit (w/z)_eq ≤ 0,55 (vorher fest 0,50 ohne Klasse).
 */
const FALLSTUDIE_EXPOSITION = ['XC4', 'XD1', 'XF1'] as const;
const WZ_GRENZE_FALLSTUDIE = getMassgebendeAnforderung([...FALLSTUDIE_EXPOSITION]).maxWz ?? 0.55;
import inhalt from '@/content/lca/TransportbetonLcaUebung.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface ConcretePreset {
  id: string;
  name: string;
  description: string;
  cemType: 'cem1' | 'cem2' | 'cem3a' | 'cem3b';
  cemAmount: number; // kg/m³
  flyAsh: number;    // kg/m³
  sand: number;      // kg/m³
  gravel: number;    // kg/m³
  rcGravel: number;  // kg/m³
  water: number;     // kg/m³
  superplasticizer: number; // kg/m³
  distanceA2Cement: number; // km
  distanceA2Gravel: number; // km
  distanceA4Jobsite: number; // km
}

const PRESETS: ConcretePreset[] = [
  {
    id: 'standard',
    name: inhalt.werte.t1StandardC2530,
    description: inhalt.werte.konventionellerTransportbetonMitReinem,
    cemType: 'cem1',
    cemAmount: 320,
    flyAsh: 0,
    sand: 720,
    gravel: 1150,
    rcGravel: 0,
    water: 175,
    superplasticizer: 2.5,
    distanceA2Cement: 80,
    distanceA2Gravel: 25,
    distanceA4Jobsite: 15
  },
  {
    id: 'eco_cem3',
    name: inhalt.werte.t2KlinkereffizientC2530,
    description: inhalt.werte.klimaschonenderBetonMitHüttensandreichem,
    cemType: 'cem3a',
    cemAmount: 290,
    flyAsh: 40,
    sand: 710,
    gravel: 1160,
    rcGravel: 0,
    water: 160,
    superplasticizer: 3.2,
    distanceA2Cement: 110,
    distanceA2Gravel: 25,
    distanceA4Jobsite: 15
  },
  {
    id: 'circular_rc',
    name: inhalt.werte.t3ZirkulärerÖkoBeton,
    description: inhalt.werte.maximalRessourcenUndKlimaschonend,
    cemType: 'cem3b',
    cemAmount: 280,
    flyAsh: 50,
    sand: 650,
    gravel: 600,
    rcGravel: 550,
    water: 155,
    superplasticizer: 3.5,
    distanceA2Cement: 120,
    distanceA2Gravel: 15,
    distanceA4Jobsite: 15
  }
];

export default function TransportbetonLcaUebung() {
  // Aktuelle Rezepturparameter
  const [cemType, setCemType] = useState<'cem1' | 'cem2' | 'cem3a' | 'cem3b'>('cem1');
  const [cemAmount, setCemAmount] = useState<number>(320);
  const [flyAsh, setFlyAsh] = useState<number>(0);
  const [sand, setSand] = useState<number>(720);
  const [gravel, setGravel] = useState<number>(1150);
  const [rcGravel, setRcGravel] = useState<number>(0);
  const [water, setWater] = useState<number>(175);
  const [superplasticizer, setSuperplasticizer] = useState<number>(2.5);
  
  // Transportdistanzen
  const [distA2Cement, setDistA2Cement] = useState<number>(80);
  const [distA2Aggregates, setDistA2Aggregates] = useState<number>(25);
  const [distA4Jobsite, setDistA4Jobsite] = useState<number>(15);
  
  // Bauvorhaben Kubatur für Hochrechnung
  const [projectVolumeM3, setProjectVolumeM3] = useState<number>(850);
  
  // Feedback
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

  const applyPreset = (p: ConcretePreset) => {
    setCemType(p.cemType);
    setCemAmount(p.cemAmount);
    setFlyAsh(p.flyAsh);
    setSand(p.sand);
    setGravel(p.gravel);
    setRcGravel(p.rcGravel);
    setWater(p.water);
    setSuperplasticizer(p.superplasticizer);
    setDistA2Cement(p.distanceA2Cement);
    setDistA2Aggregates(p.distanceA2Gravel);
    setDistA4Jobsite(p.distanceA4Jobsite);
  };

  // Emissionsfaktoren holen
  const getCemFactor = () => {
    switch (cemType) {
      case 'cem1': return LCA_BENCHMARKS.gwp_cem_I;
      case 'cem2': return LCA_BENCHMARKS.gwp_cem_II_ALL;
      case 'cem3a': return LCA_BENCHMARKS.gwp_cem_III_A;
      case 'cem3b': return LCA_BENCHMARKS.gwp_cem_III_B;
    }
  };

  const cemFactor = getCemFactor();

  // Berechnung Modul A1 (Rohstoffe)
  const gwp_A1_cement = cemAmount * cemFactor;
  const gwp_A1_flyAsh = flyAsh * LCA_BENCHMARKS.gwp_fly_ash;
  const gwp_A1_sand = sand * LCA_BENCHMARKS.gwp_aggregate_natural;
  const gwp_A1_gravel = gravel * LCA_BENCHMARKS.gwp_aggregate_natural;
  const gwp_A1_rcGravel = rcGravel * LCA_BENCHMARKS.gwp_aggregate_rc;
  const gwp_A1_water = water * LCA_BENCHMARKS.gwp_water;
  const gwp_A1_admixture = superplasticizer * LCA_BENCHMARKS.gwp_admixture;
  const sum_A1 = gwp_A1_cement + gwp_A1_flyAsh + gwp_A1_sand + gwp_A1_gravel + gwp_A1_rcGravel + gwp_A1_water + gwp_A1_admixture;

  // Berechnung Modul A2 (Transport zum Betonwerk)
  // Lkw 40t, 0.068 kg CO2/tkm (Lehrwert der Übung; zentraler A4-Faktor 0,101 – Hinweis unter den Eingaben, DSB-LC-3)
  const mass_cement_ton = cemAmount / 1000;
  const mass_aggregates_ton = (sand + gravel + rcGravel) / 1000;
  const gwp_A2_cement = mass_cement_ton * distA2Cement * LCA_BENCHMARKS.transport_truck_40t;
  const gwp_A2_aggregates = mass_aggregates_ton * distA2Aggregates * LCA_BENCHMARKS.transport_truck_40t;
  const sum_A2 = gwp_A2_cement + gwp_A2_aggregates;

  // Berechnung Modul A3 (Betonmischwerk)
  const sum_A3 = LCA_BENCHMARKS.gwp_mixing_plant_standard; // 5.20 kg CO2-eq/m³

  // Cradle-to-Gate (A1-A3)
  const sum_A1A3 = sum_A1 + sum_A2 + sum_A3;

  // Modul A4 (Fahrmischer zur Baustelle)
  const sum_A4 = distA4Jobsite * LCA_BENCHMARKS.gwp_concrete_truck_per_m3_km;

  // Modul A5 (Einbau mit Pumpe)
  const sum_A5 = LCA_BENCHMARKS.gwp_concrete_pump;

  // GESAMT A1-A5
  const total_A1A5 = sum_A1A3 + sum_A4 + sum_A5;

  // Referenzwert zum Vergleich (Preset 1 Standard CEM I)
  const refTotalA1A5 = 239.9; // kg CO2-eq/m³ – Ergebnis von Preset 1 mit den hinterlegten Kennwerten (T15-NH-3: CEM I 0,665; vorher 299,1 mit 0,85)
  const savingPct = Math.max(0, ((refTotalA1A5 - total_A1A5) / refTotalA1A5) * 100);
  const projectTotalCO2Ton = (total_A1A5 * projectVolumeM3) / 1000;
  const projectSavedCO2Ton = Math.max(0, ((refTotalA1A5 - total_A1A5) * projectVolumeM3) / 1000);

  // w/z-Wert Berechnung (mit anrechenbarer Flugasche, k-Wert nach DIN 1045-2 aus src/calc/mischung.ts, DSB-LC-8)
  const effectiveCem = cemAmount + K_WERT_DIN1045_2.kF * flyAsh;
  const wz_eq = effectiveCem > 0 ? (water / effectiveCem) : 0;

  const handleDownload = () => {
    import('./TransportbetonExcelExport')
      .then(m => m.generateTransportbetonExcel())
      .catch(e => console.error('Excel-Export fehlgeschlagen', e));
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 4000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-8 animate-in fade-in duration-300">
      
      {/* Kopfbereich & Download-Callout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-home-grau/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xxs font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300"><MdText text={inhalt.texte.interaktivesLehrÜbungsmodul} /></span>
            <span className="text-xxs text-slate-400 font-mono"><MdText text={inhalt.texte.dinEn15804A2} /></span>
          </div>
          <h3 className="text-lg font-bold text-text-main mt-1 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.ökobilanzierungTransportbetonA1A5} /></h3>
          <p className="text-xs text-text-main/70 mt-1 max-w-3xl"><MdText text={inhalt.texte.untersuchenSieDenEinfluss} /></p>
        </div>

        {/* Download Button */}
        <div className="shrink-0">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {isDownloaded ? <CheckCircle2 size={16} /> : <Download size={16} />}
            <span>{isDownloaded ? inhalt.werte.excelDateiHeruntergeladen : inhalt.werte.excelArbeitsblattHerunterladenXlsx}</span>
          </button>
          <span className="block text-[10px] text-slate-400 text-center mt-1 font-mono"><MdText text={inhalt.texte.inklFormeln4Tabellenblättern} /></span>
        </div>
      </div>

      {/* Preset-Leiste */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-text-main flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sliders size={14} className="text-shiraz" /><MdText text={inhalt.texte.schnellauswahlRezepturPresetsZum} /></span>
          <span className="text-xxs text-slate-400 font-normal"><MdText text={inhalt.texte.klickenZumLadenDer} /></span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className="text-left p-3.5 rounded-xl border border-home-grau/25 hover:border-shiraz/50 hover:bg-off-white transition-all cursor-pointer bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <h5 className="font-bold text-xs text-text-main leading-tight">{p.name}</h5>
                <p className="text-xxs text-text-main/70 mt-1 leading-relaxed">{p.description}</p>
              </div>
              <span className="text-[10px] text-shiraz font-bold mt-2 inline-flex items-center gap-1"><MdText text={inhalt.texte.presetLaden} /><ArrowRight size={11} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Interaktiver Live-Rechner & Schieberegler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Linke Spalte: Rezeptur-Eingaben (7 Spalten) */}
        <div className="lg:col-span-7 bg-off-white p-5 rounded-2xl border border-home-grau/30 space-y-4">
          <h4 className="font-bold text-xs text-text-main uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Layers size={14} className="text-shiraz" /><MdText text={inhalt.texte.t1RezepturkomponentenAusgangsstoffePro} /></h4>

          {/* Zementart-Wahl */}
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-text-main/80 flex items-center justify-between">
              <span><MdText text={inhalt.texte.zementtypBindemittelNachDin} /></span>
              <span className="text-slate-500 font-mono text-[10px]">
                EF: {formatDeZahl(cemFactor, 3)}<MdText text={inhalt.texte.kgCoEqKg} /></span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cem1', label: inhalt.werte.cemI425, sub: inhalt.werte.klinker95 },
                { id: 'cem2', label: 'CEM II/A-LL', sub: 'Kalkstein' },
                { id: 'cem3a', label: 'CEM III/A', sub: inhalt.werte.hüttensand50 },
                { id: 'cem3b', label: 'CEM III/B', sub: inhalt.werte.hüttensand70 }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setCemType(c.id as typeof cemType)}
                  className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                    cemType === c.id
                      ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs'
                      : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{c.label}</div>
                  <div className={`text-[9px] ${cemType === c.id ? 'text-white/80' : 'text-slate-400'}`}>{c.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Schieberegler Bindemittel & Zusatzstoff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xxs font-bold text-text-main/80">
                <span>Zementgehalt:</span>
                <span className="text-shiraz font-mono">{formatDeWert(cemAmount)} kg/m³</span>
              </div>
              <input 
                type="range" 
                min="240" 
                max="420" 
                step="5" 
                value={cemAmount} 
                onChange={e => setCemAmount(Number(e.target.value))}
                className="w-full accent-shiraz h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>Min: 240 kg</span>
                <span>Max: 420 kg</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xxs font-bold text-text-main/80">
                <span><MdText text={inhalt.texte.zusatzstoffFlugasche} /></span>
                <span className="text-slate-700 font-mono">{formatDeWert(flyAsh)} kg/m³</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5" 
                value={flyAsh} 
                onChange={e => setFlyAsh(Number(e.target.value))}
                className="w-full accent-slate-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>0 kg</span>
                <span>Max: 100 kg</span>
              </div>
            </div>
          </div>

          {/* Gesteinskörnung & RC-Anteil */}
          <div className="pt-2 border-t border-home-grau/20 space-y-3">
            <h5 className="text-xxs font-bold text-slate-500 uppercase tracking-wider"><MdText text={inhalt.texte.gesteinskörnungRezyklateDin4226} /></h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xxs font-bold text-slate-700">
                  <span><MdText text={inhalt.texte.sand04Mm} /></span>
                  <span className="font-mono">{formatDeWert(sand)} kg</span>
                </div>
                <input 
                  type="range" min="500" max="900" step="10" value={sand} 
                  onChange={e => setSand(Number(e.target.value))}
                  className="w-full accent-slate-500 h-1 bg-slate-200 rounded cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xxs font-bold text-slate-700">
                  <span><MdText text={inhalt.texte.kies416Primär} /></span>
                  <span className="font-mono">{formatDeWert(gravel)} kg</span>
                </div>
                <input 
                  type="range" min="400" max="1300" step="10" value={gravel} 
                  onChange={e => setGravel(Number(e.target.value))}
                  className="w-full accent-slate-500 h-1 bg-slate-200 rounded cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xxs font-bold text-emerald-800">
                  <span><MdText text={inhalt.texte.rcKies416} /></span>
                  <span className="font-mono font-bold text-emerald-700">{formatDeWert(rcGravel)} kg</span>
                </div>
                <input 
                  type="range" min="0" max="700" step="10" value={rcGravel} 
                  onChange={e => setRcGravel(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-1 bg-slate-200 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Wasser & Fließmittel */}
          <div className="pt-2 border-t border-home-grau/20 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xxs font-bold text-slate-700">
                <span>Zugabewasser:</span>
                <span className="font-mono">{formatDeWert(water)} kg/m³</span>
              </div>
              <input 
                type="range" min="140" max="210" step="5" value={water} 
                onChange={e => setWater(Number(e.target.value))}
                className="w-full accent-blue-500 h-1 bg-slate-200 rounded cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xxs font-bold text-slate-700">
                <span><MdText text={inhalt.texte.fließmittelPce} /></span>
                <span className="font-mono">{formatDeZahl(superplasticizer, 1)} kg/m³</span>
              </div>
              <input 
                type="range" min="1.0" max="6.0" step="0.2" value={superplasticizer} 
                onChange={e => setSuperplasticizer(Number(e.target.value))}
                className="w-full accent-purple-500 h-1 bg-slate-200 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Transport- & Einbau-Parameter (A2 / A4) */}
          <div className="pt-2 border-t border-home-grau/20 space-y-2">
            <h5 className="text-xxs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Truck size={12} /><MdText text={inhalt.texte.logistikTransportdistanzenA2A4} /></h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xxs">
              <div className="bg-white p-2.5 rounded-lg border border-home-grau/25">
                <span className="block text-slate-500"><MdText text={inhalt.texte.zementwerkBetonwerkA2} /></span>
                <div className="flex items-center gap-2 mt-1">
                  <input aria-label={inhalt.werte.zementwerkBetonwerkA2} 
                    type="number" min="0" value={distA2Cement} onChange={e => setDistA2Cement(Number(e.target.value))}
                    className="w-16 p-1 text-xs border rounded font-mono"
                  />
                  <span className="text-slate-400"><MdText text={inhalt.texte.kmLkw40t} /></span>
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-home-grau/25">
                <span className="block text-slate-500"><MdText text={inhalt.texte.kieswerkBetonwerkA2} /></span>
                <div className="flex items-center gap-2 mt-1">
                  <input aria-label={inhalt.werte.kieswerkBetonwerkA2} 
                    type="number" min="0" value={distA2Aggregates} onChange={e => setDistA2Aggregates(Number(e.target.value))}
                    className="w-16 p-1 text-xs border rounded font-mono"
                  />
                  <span className="text-slate-400"><MdText text={inhalt.texte.kmLkw40t2} /></span>
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-home-grau/25">
                <span className="block text-slate-500"><MdText text={inhalt.texte.betonwerkBaustelleA4} /></span>
                <div className="flex items-center gap-2 mt-1">
                  <input aria-label={inhalt.werte.betonwerkBaustelleA4} 
                    type="number" min="0" value={distA4Jobsite} onChange={e => setDistA4Jobsite(Number(e.target.value))}
                    className="w-16 p-1 text-xs border rounded font-mono"
                  />
                  <span className="text-slate-400"><MdText text={inhalt.texte.kmFahrmischer} /></span>
                </div>
              </div>
            </div>
            {/* DSB-LC-3: Lkw-Faktor der Übung belassen (Entscheidung zu NP2-LC-2), Unterschied zum zentralen A4-Faktor ausweisen */}
            <p className="text-xxs text-slate-500 leading-relaxed">
              <MdText text={inhalt.texte.hinweisLkwFaktor
                .replace('{uebung}', formatDeZahl(LKW_FAKTOR_UEBUNG, 3))
                .replace('{zentral}', formatDeZahl(LKW_FAKTOR_ZENTRAL, 3))
                .replace('{a2}', formatDeZahl(sum_A2, 1))
                .replace('{a2zentral}', formatDeZahl(sum_A2 * LKW_FAKTOR_ZENTRAL / LKW_FAKTOR_UEBUNG, 1))} />
            </p>
          </div>

        </div>

        {/* Rechte Spalte: Live-Ergebnisse, Modul-Split & Bilanz (5 Spalten) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Großes Ergebnisbanner */}
          <div className="bg-off-white text-text-main p-5 rounded-2xl border border-home-grau/30 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xxs font-mono uppercase text-text-main/70"><MdText text={inhalt.texte.gwpGesamtModulA1} /></span>
              <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold ${
                savingPct > 30 ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-white text-text-main border border-home-grau/30'
              }`}>
                {savingPct > 0 ? `-${formatDeZahl(savingPct, 1)} % CO₂` : 'Referenzniveau'}
              </span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono tracking-tight text-shiraz">
                {formatDeZahl(total_A1A5, 1)}
              </span>
              <span className="text-xs text-text-main/70 font-mono"><MdText text={inhalt.texte.kgCoEqM} /></span>
            </div>

            {/* Spezifische Kennwerte */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-home-grau/20 text-xxs">
              <div>
                <span className="text-text-main/70 block"><MdText text={inhalt.texte.äquivalenterWZEq} /></span>
                <span className={`font-mono font-bold text-xs ${wz_eq <= WZ_GRENZE_FALLSTUDIE ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {formatDeZahl(wz_eq, 2)}
                </span>
                <span className="text-[10px] text-text-main/60 block">{wz_eq <= WZ_GRENZE_FALLSTUDIE ? inhalt.werte.normkonform050 : inhalt.werte.warnung050}</span>
              </div>
              <div>
                <span className="text-text-main/70 block"><MdText text={inhalt.texte.cradleToGateA1} /></span>
                <span className="font-mono font-bold text-xs text-text-main">
                  {formatDeZahl(sum_A1A3, 1)} kg CO₂/m³
                </span>
                <span className="text-[10px] text-text-main/60 block">ÖKOBAUDAT-Wert</span>
              </div>
            </div>
          </div>

          {/* Aufschlüsselung nach Lebenszyklusmodulen */}
          <div className="bg-white p-4 rounded-xl border border-home-grau/30 space-y-2.5">
            <h5 className="font-bold text-xs text-text-main flex items-center justify-between">
              <span><MdText text={inhalt.texte.anteiligeTreibhausgasEmissionen} /></span>
              <span className="text-xxs text-slate-400 font-mono">A1–A5 Split</span>
            </h5>

            <div className="space-y-2 text-xxs">
              <div>
                <div className="flex justify-between mb-0.5">
                  <span className="font-semibold text-slate-700"><MdText text={inhalt.texte.a1RohstoffeZement} /></span>
                  <span className="font-mono font-bold">{formatDeZahl(sum_A1, 1)} kg ({formatDeZahl((sum_A1 / total_A1A5 * 100), 0)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-shiraz h-full rounded-full" style={{ width: `${(sum_A1 / total_A1A5 * 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-0.5">
                  <span className="font-semibold text-slate-700"><MdText text={inhalt.texte.a2TransportDerRohstoffe} /></span>
                  <span className="font-mono font-bold">{formatDeZahl(sum_A2, 1)} kg ({formatDeZahl((sum_A2 / total_A1A5 * 100), 1)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(sum_A2 / total_A1A5 * 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-0.5">
                  <span className="font-semibold text-slate-700"><MdText text={inhalt.texte.a3BetonmischwerkStromWärme} /></span>
                  <span className="font-mono font-bold">{formatDeZahl(sum_A3, 1)} kg ({formatDeZahl((sum_A3 / total_A1A5 * 100), 1)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(sum_A3 / total_A1A5 * 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-0.5">
                  <span className="font-semibold text-slate-700"><MdText text={inhalt.texte.a4FahrmischerTransportZur} /></span>
                  <span className="font-mono font-bold">{formatDeZahl(sum_A4, 1)} kg ({formatDeZahl((sum_A4 / total_A1A5 * 100), 1)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(sum_A4 / total_A1A5 * 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-0.5">
                  <span className="font-semibold text-slate-700"><MdText text={inhalt.texte.a5EinbauBetonpumpe} /></span>
                  <span className="font-mono font-bold">{formatDeZahl(sum_A5, 1)} kg ({formatDeZahl((sum_A5 / total_A1A5 * 100), 1)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: `${(sum_A5 / total_A1A5 * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bauvorhaben-Hochrechnung */}
          <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xxs font-bold uppercase text-emerald-900 flex items-center gap-1">
                <Building2 size={13} /><MdText text={inhalt.texte.hochrechnungGesamtbauwerk} /></span>
              <div className="flex items-center gap-1">
                <input aria-label={inhalt.werte.hochrechnungGesamtbauwerk} 
                  type="number" min="0" 
                  value={projectVolumeM3} 
                  onChange={e => setProjectVolumeM3(Number(e.target.value))}
                  className="w-16 p-0.5 text-xxs font-bold text-center bg-white border border-emerald-300 rounded font-mono"
                />
                <span className="text-[10px] text-emerald-900 font-bold">m³</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xxs pt-1">
              <div>
                <span className="text-emerald-800 block"><MdText text={inhalt.texte.projektCoA1A5} /></span>
                <span className="font-mono font-bold text-xs text-emerald-950">
                  {formatDeZahl(projectTotalCO2Ton, 1)} t CO₂-eq
                </span>
              </div>
              <div>
                <span className="text-emerald-800 block"><MdText text={inhalt.texte.eingespartGgüCemI} /></span>
                <span className="font-mono font-bold text-xs text-emerald-700">
                  {formatDeZahl(projectSavedCO2Ton, 1)} t CO₂-eq
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Didaktische Infobox zum Excel-Arbeitsblatt */}
      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/25 space-y-2">
        <h5 className="font-bold text-xs text-text-main flex items-center gap-2">
          <Info size={15} className="text-shiraz" /><MdText text={inhalt.texte.aufbauDerHerunterladbarenExcel} /></h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xxs text-text-main/80 pt-1">
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <strong className="block text-slate-800 mb-0.5"><MdText text={inhalt.texte.blatt1AnleitungNormen} /></strong><MdText text={inhalt.texte.systemgrenzenNachDinEn} /></div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <strong className="block text-slate-800 mb-0.5"><MdText text={inhalt.texte.blatt2LiveRechner} /></strong><MdText text={inhalt.texte.vollständigeTabelleMitVerknüpften} /></div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <strong className="block text-slate-800 mb-0.5"><MdText text={inhalt.texte.blatt3ÜbungsaufgabeAugsburg} /></strong><MdText text={inhalt.texte.konkreteFallstudie850M} /></div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <strong className="block text-slate-800 mb-0.5"><MdText text={inhalt.texte.blatt4EpdStammdaten} /></strong><MdText text={inhalt.texte.amtlicheÖkobaudatEmissionsfaktorenFür} /></div>
        </div>
      </div>

    </div>
  );
}
