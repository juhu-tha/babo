import { formatDeZahl, formatDeWert, formatDeIntl } from '@/src/utils/numberFormat';
import { blechMasse, potentialDifferenz } from '@/src/calc/bauprodukte';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  Layers, 
  Flame, 
  Calculator, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  BookOpen, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { InnovationPraxisSection } from '@/src/components/ui/InnovationPraxisSection';
import inhalt from '@/content/bpmetallisch/BpMetallisch.json';
import { LAMBDA_ALUMINIUM } from '@/src/data/kennwerte';
import { MdText } from '@/src/components/inhalt/MdText';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

function MetalThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadMetalleIm} /></h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5"><MdText text={inhalt.texte.weiterZuDenAnderen} /></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('metalle')}
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
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.physikalischeEigenschaftenSchmelzpunktLe} /></span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_metallisch')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t2MechanikPraxis} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.plattenrechnerKontaktkorrosionsPrüfungLi} /></span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={() => setActiveTab('metallkorrosion')}
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
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.galvanischeZellenKorrosionsartenSchutz} /></span>
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

export interface MetalMaterial {
  id: string;
  name: string;
  density: number; // kg/m³
  potential: number; // Volt vs Standard Hydrogen Electrode
  lambda: number; // W/(m·K)
  lambdaHinweis?: string; // Zusatz zur Kennwertkarte (z. B. Bemessungswert gegen Reinmetall)
  alpha: number; // 10^-6 / K
  description: string;
  crystalStructure?: string;
  eModul?: number; // N/mm²
  yieldStrength?: string;
  standards?: string;
  corrosionCategory?: string;
  practicalAdvice?: string;
  poissonRatio?: number;
  elongationAtBreak?: string;
  recyclingRate?: string;
}

// λ Aluminium zentral aus kennwerte.ts (DIN EN ISO 10456, Entscheidung 30.10.2026); Umsetzung 02.11.2026 (NS4-ME-1)
const ALUMINIUM_INHALT: MetalMaterial = inhalt.daten["metalsDb.aluminum"];

export const metalsDb: MetalMaterial[] = [
  inhalt.daten["metalsDb.zinc"],
  { ...ALUMINIUM_INHALT, lambda: LAMBDA_ALUMINIUM },
  inhalt.daten["metalsDb.steel"],
  {
    id: 'stainless',
    name: inhalt.werte.edelstahlRostfreiA2A4,
    density: 7900,
    potential: +0.15, // Passivzustand in belüfteter Atmosphäre
    lambda: 15,
    alpha: 16,
    crystalStructure: inhalt.werte.kubischFlächenzentriertKfzAustenit,
    eModul: 200000,
    yieldStrength: inhalt.werte.rp02200240,
    standards: inhalt.werte.dinEn10088Din,
    corrosionCategory: inhalt.werte.crcIiA2Bis,
    poissonRatio: 0.30,
    elongationAtBreak: inhalt.werte.a4045Hohe,
    recyclingRate: inhalt.werte.t100WichtigerTrägerVon,
    description: inhalt.werte.austenitischerChromNickelBzw,
    practicalAdvice: inhalt.werte.inHallenbädernStraßentunnelnUnd
  },
  inhalt.daten["metalsDb.lead"],
  {
    id: 'titanium',
    name: inhalt.werte.titanReintitanGrad1,
    density: 4500,
    potential: +0.20,
    lambda: 22,
    alpha: 8.6,
    crystalStructure: inhalt.werte.hexagonalDichtesteKugelpackungHdp,
    eModul: 105000,
    yieldStrength: inhalt.werte.rp02275345,
    standards: inhalt.werte.dinEnIso28438,
    corrosionCategory: inhalt.werte.höchsteKorrosionsbeständigkeitMeerwasser,
    poissonRatio: 0.34,
    elongationAtBreak: 'A ≥ 20 %',
    recyclingRate: inhalt.werte.t90AlsTitanschrottFerro,
    description: inhalt.werte.hochleistungsLeichtmetallMitHerausragend,
    practicalAdvice: inhalt.werte.fügenVonTitanelementenAuf
  },
  {
    id: 'copper',
    name: inhalt.werte.kupferBauKupferCu,
    density: 8960,
    potential: +0.34,
    lambda: 380,
    alpha: 17,
    crystalStructure: inhalt.werte.kubischFlächenzentriertKfz,
    eModul: 130000,
    yieldStrength: inhalt.werte.rp02140250,
    standards: inhalt.werte.dinEn1172Kupfer,
    corrosionCategory: inhalt.werte.äußerstBeständigBildetSchützende,
    poissonRatio: 0.34,
    elongationAtBreak: inhalt.werte.a5033R220Weich,
    recyclingRate: inhalt.werte.t95OhneQualitätsverlustRecyclierbar,
    description: inhalt.werte.halbedelmetallMitKubischFlächenzentriert,
    practicalAdvice: inhalt.werte.fließregelZwingendEinhaltenKupferrinnen
  },
  inhalt.daten["metalsDb.corten"],
  inhalt.daten["metalsDb.brass"],
  inhalt.daten["metalsDb.cast_iron"]
];

export default function BpMetallisch() {
  const [selectedMetal, setSelectedMetal] = useState<MetalMaterial>(metalsDb[0]);

  // Galvanic (Contact) Corrosion Selector States
  const [metalAnode, setMetalAnode] = useState<string>('zinc'); // Fastener (small)
  const [metalCathode, setMetalCathode] = useState<string>('copper'); // Main Sheet (large)

  // Sheet metal weight calculator states
  const [sheetThick, setSheetThick] = useState<number>(2.0); // mm
  const [sheetWidth, setSheetWidth] = useState<number>(1.25); // m
  const [sheetLength, setSheetLength] = useState<number>(3.0); // m
  const [calcMetalId, setCalcMetalId] = useState<string>('steel');

  // Load calculator chosen metal
  const calcMetal = metalsDb.find(m => m.id === calcMetalId) || metalsDb[2];

  // Calculations weight: W = length * width * (thick / 1000) * density (kg)
  const blech = blechMasse(sheetLength, sheetWidth, sheetThick, calcMetal.density); // Rechenkern src/calc/bauprodukte.ts
  const totalWeightKg = blech.masse;

  // Bimetallic / Galvanic evaluation
  const anodeObj = metalsDb.find(m => m.id === metalAnode) || metalsDb[0];
  const cathodeObj = metalsDb.find(m => m.id === metalCathode) || metalsDb[4];

  // Potential difference deltaE
  const deltaE = potentialDifferenz(cathodeObj.potential, anodeObj.potential);

  const getCorrosionRating = (val: number, an: string, cat: string) => {
    if (an === cat) {
      return inhalt.daten.getCorrosionRating;
    }
    // Copper is extremely noble, aluminium or zinc next to it is disastrous
    if ((an === 'zinc' || an === 'aluminum' || an === 'steel' || an === 'corten') && cat === 'copper') {
      return inhalt.daten.getCorrosionRating_2;
    }
    if (val <= 0.15) {
      return inhalt.daten.getCorrosionRating_3;
    }
    if (val <= 0.35) {
      return inhalt.daten.getCorrosionRating_4;
    }
    return inhalt.daten.getCorrosionRating_5;
  };

  const corrosionResult = getCorrosionRating(deltaE, metalAnode, metalCathode);

  return (
    <div id="bp-metallisch-module" className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Overview Block */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.metallischeBauprodukteTragwerkHülle} /></h2>
            <p className="text-xs text-text-main/70 mt-0.5"><MdText text={inhalt.texte.werkstofflicheCharakteristikenPhysikalis} /></p>
          </div>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.metalleHabenHoheZug} /></p>
      </div>

      {/* Main Material Database Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left hand selection list */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-text-main/50 uppercase tracking-wider block"><MdText text={inhalt.texte.verfügbareKonstruktionsmetalle} /></span>
          
          <div className="flex flex-col gap-2 max-h-[580px] overflow-y-auto pr-1">
            {metalsDb.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMetal(m)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                  selectedMetal.id === m.id
                    ? 'bg-shiraz text-white border-shiraz shadow-md scale-[1.01]'
                    : 'bg-white text-text-main hover:bg-slate-50 border-home-grau/30 shadow-xs'
                }`}
              >
                <div>
                  <span className={`text-[9px] uppercase font-mono font-bold tracking-wider block ${selectedMetal.id === m.id ? 'text-white/70' : 'text-text-main/40'}`}>
                    Potential: {(m.potential > 0 ? '+' : '') + formatDeZahl(m.potential, 2) + ' V'}
                  </span>
                  <span className="font-extrabold text-sm">{m.name}</span>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                  selectedMetal.id === m.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {m.id.toUpperCase()}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-amber-50/80 p-4 border border-amber-250 rounded-xl space-y-2 text-xs text-amber-900 mt-2">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="text-amber-800" size={14} />
              <span><MdText text={inhalt.texte.dieAnodenKathodenFlächenregel} /></span>
            </div>
            <p className="font-normal text-[11px] text-amber-950/80 leading-relaxed"><MdText text={inhalt.texte.besondersKritischIstKontaktkorrosion} /></p>
          </div>
        </div>

        {/* Right hand Technical details block */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-home-grau/15 pb-4 flex justify-between items-start flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block"><MdText text={inhalt.texte.leistungswerteNachBaupvoDin} /></span>
                <h3 className="text-xl font-extrabold text-text-main mt-0.5">{selectedMetal.name}</h3>
              </div>
              <div className="bg-slate-50 border border-home-grau/15 px-3 py-1.5 rounded-lg text-right">
                <span className="text-[10px] text-text-main/50 block leading-tight font-medium"><MdText text={inhalt.texte.grenzPotentialU} /></span>
                <span className="text-sm font-extrabold text-slate-800 font-mono">{(selectedMetal.potential > 0 ? '+' : '') + formatDeZahl(selectedMetal.potential, 2)} V</span>
              </div>
            </div>

            {/* Quick specifications grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5"><MdText text={inhalt.texte.dichteRohdichte} /></span>
                <span className="text-sm font-extrabold font-mono text-slate-800">{formatDeIntl(selectedMetal.density)} kg/m³</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5"><MdText text={inhalt.texte.wärmeleitfähigkeit} /></span>
                <span className="text-sm font-extrabold font-mono text-slate-800">{formatDeWert(selectedMetal.lambda)} W/(m·K)</span>
                {selectedMetal.lambdaHinweis && <span className="text-[10px] text-text-main/70 block leading-tight mt-0.5">{selectedMetal.lambdaHinweis}</span>}
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5"><MdText text={inhalt.texte.wärmedehnung} /></span>
                <span className="text-sm font-extrabold font-mono text-slate-800">{formatDeWert(selectedMetal.alpha)} × 10⁻⁶/K</span>
              </div>
            </div>

            {/* General Description text block with expanded Werkstoffliche Charakteristik */}
            <div className="p-5 bg-slate-50/90 rounded-xl border border-home-grau/25 space-y-3.5 leading-relaxed font-sans">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2.5 flex-wrap gap-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={15} /><MdText text={inhalt.texte.werkstofflicheCharakteristik} /></span>
                {selectedMetal.standards && (
                  <span className="text-[10px] font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded border border-home-grau/25 shadow-2xs">
                    Normung: {selectedMetal.standards}
                  </span>
                )}
              </div>

              <div className="text-xs text-text-main/85 font-normal leading-relaxed whitespace-pre-line space-y-2">
                {selectedMetal.description}
              </div>

              {/* Structured Engineering Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-3 border-t border-home-grau/15">
                {selectedMetal.crystalStructure && (
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-2xs">
                    <span className="text-[10px] text-text-main/50 block font-bold uppercase"><MdText text={inhalt.texte.kristallgitterGefüge} /></span>
                    <span className="text-xs font-bold text-slate-800">{selectedMetal.crystalStructure}</span>
                  </div>
                )}
                {selectedMetal.eModul && (
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-2xs">
                    <span className="text-[10px] text-text-main/50 block font-bold uppercase"><MdText text={inhalt.texte.eModulSteifigkeit} /></span>
                    <span className="text-xs font-bold font-mono text-slate-800">{formatDeIntl(selectedMetal.eModul)} N/mm²</span>
                  </div>
                )}
                {selectedMetal.yieldStrength && (
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-2xs">
                    <span className="text-[10px] text-text-main/50 block font-bold uppercase"><MdText text={inhalt.texte.streckgrenzeFyRp02} /></span>
                    <span className="text-xs font-bold font-mono text-slate-800">{selectedMetal.yieldStrength}</span>
                  </div>
                )}
                {selectedMetal.poissonRatio && (
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-2xs">
                    <span className="text-[10px] text-text-main/50 block font-bold uppercase"><MdText text={inhalt.texte.querdehnzahlPoisson} /></span>
                    <span className="text-xs font-bold font-mono text-slate-800">{formatDeZahl(selectedMetal.poissonRatio, 2)} [-]</span>
                  </div>
                )}
                {selectedMetal.elongationAtBreak && (
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-2xs">
                    <span className="text-[10px] text-text-main/50 block font-bold uppercase"><MdText text={inhalt.texte.bruchdehnungDuktilität} /></span>
                    <span className="text-xs font-bold font-mono text-slate-800">{selectedMetal.elongationAtBreak}</span>
                  </div>
                )}
                {selectedMetal.recyclingRate && (
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-2xs">
                    <span className="text-[10px] text-text-main/50 block font-bold uppercase"><MdText text={inhalt.texte.recyclingZirkularität} /></span>
                    <span className="text-xs font-bold text-emerald-700">{selectedMetal.recyclingRate}</span>
                  </div>
                )}
              </div>

              {selectedMetal.practicalAdvice && (
                <div className="bg-amber-50/90 border border-amber-200/80 p-3 rounded-lg text-[11px] text-amber-950 flex items-start gap-2 mt-2">
                  <Info size={14} className="text-amber-800 mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-bold text-amber-900"><MdText text={inhalt.texte.praxisAusführungshinweis} /></strong>
                    <span>{selectedMetal.practicalAdvice}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-3 border border-home-grau/10 rounded-xl text-xs flex gap-2 items-center text-text-main/70 mt-4 font-normal">
            <Info size={14} className="text-shiraz shrink-0" />
            <span><MdText text={inhalt.texte.aluminiumWeistEineUm} /></span>
          </div>
        </div>
      </div>

      {/* Bimetallic contact corrosion compatibility checker */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
        <div className="border-b border-home-grau/15 pb-4">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /><MdText text={inhalt.texte.opferanodenKontaktkorrosionsPrüfung} /></h3>
          <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.interaktiveVerbindungsmittelKompatibilit} /></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Controls Column (col span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-text-main/60 uppercase block tracking-wider"><MdText text={inhalt.texte.verbindungspaarAuswählen} /></span>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-main text-shiraz"><MdText text={inhalt.texte.t1MetallMeistDas} /></label>
              <select aria-label={inhalt.werte.t1MetallMeistDas}
                value={metalAnode}
                onChange={(e) => setMetalAnode(e.target.value)}
                className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
              >
                {metalsDb.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name} (U_anode = {x.potential > 0 ? '+' : ''}{formatDeZahl(x.potential, 2)} V)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-main text-slate-700"><MdText text={inhalt.texte.t2MetallProfilblechAbdeckung} /></label>
              <select aria-label={inhalt.werte.t2MetallProfilblechAbdeckung}
                value={metalCathode}
                onChange={(e) => setMetalCathode(e.target.value)}
                className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
              >
                {metalsDb.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name} (U_kathode = {x.potential > 0 ? '+' : ''}{formatDeZahl(x.potential, 2)} V)
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-[11px] text-text-main/70 space-y-1">
              <ErgebnisAnsage text={kurzzeile(ansageWert('Spannungsdifferenz', deltaE * 1000, 0, 'mV'), corrosionResult.rating)} />
              <div className="flex justify-between font-mono">
                <span><MdText text={inhalt.texte.spannungsdifferenzU} /></span>
                <strong className="text-slate-800">{formatDeZahl(deltaE, 2)} V ({formatDeZahl((deltaE * 1000), 0)} mV)</strong>
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span><MdText text={inhalt.texte.grenzschwelleLehrannahme} /></span>
                <span className="text-slate-500"><MdText text={inhalt.texte.t150MvEmpfohlen} /></span>
              </div>
            </div>
          </div>

          {/* Result Column (col span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/60 p-5 rounded-xl border border-home-grau/25">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2"><MdText text={inhalt.texte.elektrochemischeRisikobewertung} /></span>
              <div className={`p-4 rounded-xl border ${corrosionResult.color} space-y-2`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    {corrosionResult.rating}
                  </h4>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/70">
                    ΔU = {formatDeZahl((deltaE * 1000), 0)} mV
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-normal">
                  {corrosionResult.desc}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-600 space-y-1">
              <p><MdText text={inhalt.texte.praxisRegelImFreien} /></p>
            </div>
          </div>
        </div>
      </div>

      {/* Sheet metal weight calculator */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
        <div className="border-b border-home-grau/15 pb-4">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Calculator className="text-shiraz" /><MdText text={inhalt.texte.blechProfilGewichtsrechner} /></h3>
          <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.ermittlungVonEigenlastenGk} /></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-text-main block mb-1">Werkstoff:</label>
            <select aria-label="Werkstoff"
              value={calcMetalId}
              onChange={(e) => setCalcMetalId(e.target.value)}
              className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
            >
              {metalsDb.map((x) => (
                <option key={x.id} value={x.id}>{x.name} ({formatDeWert(x.density)} kg/m³)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-text-main block mb-1"><MdText text={inhalt.texte.blechdickeMm} /></label>
            <input aria-label={inhalt.werte.blechdickeMm}
              type="number"
              step="0.1"
              min="0.4"
              max="50"
              value={sheetThick}
              onChange={(e) => setSheetThick(parseFloat(e.target.value) || 0)}
              className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-text-main block mb-1"><MdText text={inhalt.texte.blechbreiteM} /></label>
            <input aria-label={inhalt.werte.blechbreiteM}
              type="number"
              step="0.05"
              min="0.1"
              max="10"
              value={sheetWidth}
              onChange={(e) => setSheetWidth(parseFloat(e.target.value) || 0)}
              className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-text-main block mb-1"><MdText text={inhalt.texte.blechlängeM} /></label>
            <input aria-label={inhalt.werte.blechlängeM}
              type="number"
              step="0.1"
              min="0.1"
              max="50"
              value={sheetLength}
              onChange={(e) => setSheetLength(parseFloat(e.target.value) || 0)}
              className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Calculator Output */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 text-center">
            <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1"><MdText text={inhalt.texte.flächenbezogeneMasse} /></span>
            <span className="text-lg font-extrabold font-mono text-slate-800">
              {formatDeZahl(blech.flaechenmasse, 2)} kg/m²
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 text-center">
            <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1"><MdText text={inhalt.texte.charakteristischesEigengewichtGk} /></span>
            <span className="text-lg font-extrabold font-mono text-shiraz">
              {formatDeZahl(blech.gkFlaeche, 3)} kN/m²
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 text-center">
            <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">Tafel-Gesamtgewicht</span>
            <ErgebnisAnsage text={ansageWert('Tafel-Gesamtgewicht', totalWeightKg, 2, 'kg')} />
            <span className="text-lg font-extrabold font-mono text-slate-800">
              {formatDeZahl(totalWeightKg, 2)} kg
            </span>
          </div>
        </div>
      </div>

      {/* Normative Bauprodukte Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ShieldCheck className="text-shiraz" /><MdText text={inhalt.texte.bauproduktGruppenNachweissystemeEn} /></h3>
        <p className="text-xs text-text-main/70 mb-4 font-normal"><MdText text={inhalt.texte.tragendeStahlUndAluminiumbauteile} /></p>
        <div className="overflow-x-auto rounded-xl border border-home-grau/15 bg-white">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-home-grau/15 text-text-main/80 font-bold">
                <th className="p-3"><MdText text={inhalt.texte.produktgruppeSystem} /></th>
                <th className="p-3"><MdText text={inhalt.texte.typischeErzeugnisseSpezifikationen} /></th>
                <th className="p-3"><MdText text={inhalt.texte.güteklassenZertifikate} /></th>
                <th className="p-3"><MdText text={inhalt.texte.bedeutungImModernenTragwerks} /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-text-main/80">
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.dachUndFassadenprofileFeinbleche} /></td>
                <td className="p-3"><MdText text={inhalt.texte.trapezblecheWellprofileSandwichelementeK} /></td>
                <td className="p-3 font-mono"><MdText text={inhalt.texte.dinEn10346S220gd} /></td>
                <td className="p-3"><MdText text={inhalt.texte.weitVerbreitetImGroßflächigen} /></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.formUndProfilstähleProfilwalzerzeugnisse} /></td>
                <td className="p-3"><MdText text={inhalt.texte.warmgewalzteTrägerHebIpe} /></td>
                <td className="p-3 font-mono"><MdText text={inhalt.texte.dinEn10025S235jr} /></td>
                <td className="p-3"><MdText text={inhalt.texte.rückgratDesKlassischenSkelett} /></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.bewehrungsstähleBetonstähle} /></td>
                <td className="p-3"><MdText text={inhalt.texte.gerippterBetonstahlInStäben} /></td>
                <td className="p-3 font-mono"><MdText text={inhalt.texte.din488B500aB500b} /></td>
                <td className="p-3"><MdText text={inhalt.texte.verbundpartnerImStahlbetonbauZur} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <InnovationPraxisSection moduleKey="bp_metallisch" />

      <MetalThematicLinks current="bauprodukt" />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielEigenlastUndWärmedehnu}
          zielGleichung="G_k = L \cdot W \cdot \frac{t}{1000} \cdot \rho \cdot 9{,}81 \cdot 10^{-3}, \quad \Delta L = L \cdot \alpha_T \cdot \Delta T"
          normQuelle={inhalt.werte.lehrbeispiel7200KgM}
          schritte={inhalt.daten["BpMetallisch.schritte"]}
          ergebnisHinweis={inhalt.werte.t22MmLängenänderungAuf}
        />
      </div>

      <ModulTest moduleId="bp_metallisch" />

      <ModuleFooter 
        wikipedia={[
          { title: "Baustahl", url: "https://de.wikipedia.org/wiki/Baustahl" },
          { title: "Bimetallkorrosion", url: "https://de.wikipedia.org/wiki/Bimetallkorrosion" },
          { title: "Nichteisenmetall", url: "https://de.wikipedia.org/wiki/Nichteisenmetall" },
          { title: "Verzinken", url: "https://de.wikipedia.org/wiki/Verzinken" }
        ]} 
        literatur={inhalt.daten["BpMetallisch.literatur"]} 
        regelwerke={inhalt.daten["BpMetallisch.regelwerke"]} 
        weblinks={inhalt.daten["BpMetallisch.weblinks"]}
        formeln={inhalt.daten["BpMetallisch.formeln"]} 
      />
    </div>
  );
}
