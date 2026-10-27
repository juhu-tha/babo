import { Recycle, SlidersHorizontal } from 'lucide-react';
import { formatDeZahl } from '@/src/utils/numberFormat';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { InlineMath, BlockMath } from 'react-katex';
import { CustomRow } from './daten';
import inhalt from '@/content/interactivelcacalc/ModulDLabor.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { VERWERTUNGSFAKTOR } from '@/src/calc/lca';

export interface ModulDLaborProps {
  results: { totalWeightTons: number; totalCircularWeightTons: number; overallCircularityRate: number; gwpA1A3: number; gwpBioStorageInstalled: number; gwpA4: number; gwpC: number; gwpD: number; gwpAC: number; gwpPerSqmYearAC: number; totalGwpNet: number; gwpPerSqmYearNet: number; gwpPerSqmYearD: number; weightedUmi: number; totalPenrtMj: number; penrtKwhPerSqmYear: number; rowModulDDetails: { rowId: string; matName: string; category: string; unit: string; qty: number; weightTons: number; circularQuota: number; sortingRate: number; recoveryType: string; circularMassTons: number; effectiveRecoveredMassTons: number; rowGwpD: number; substitutesPrimary: string; }[]; };
  setGlobalModulDStrategy: (strategy: "linear" | "standard" | "selective" | "pioneer") => void;
  rows: CustomRow[];
  updateRow: (id: string, updates: Partial<Omit<CustomRow, "id">>) => void;
}

export function ModulDLabor({ results, setGlobalModulDStrategy, rows, updateRow }: ModulDLaborProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Concept Explanation */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 text-teal-700 rounded-xl border border-teal-200">
              <Recycle size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-700 text-white font-mono"><MdText text={inhalt.texte.dinEn15804A2} /></span>
                <span className="text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.modulDAußerhalbDer} /></span>
              </div>
              <h3 className="text-lg font-bold text-text-main mt-0.5"><MdText text={inhalt.texte.eingabemaskeModulDWiederverwendungs} /></h3>
            </div>
          </div>
          <div className="text-right text-xs font-mono font-bold text-teal-800 bg-teal-50 p-2.5 rounded-xl border border-teal-200">
            Gesamt-Gutschrift: <strong>{formatDeZahl(results.gwpD, 0)} kg CO₂-eq</strong>
          </div>
        </div>
    
        <div className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed space-y-2">
          <p><MdText text={inhalt.texte.modulDBilanziertDas} /></p>
          <p><MdText text={inhalt.texte.normativerGrundsatzNachDin} /></p>
        </div>
    
        {/* Quick Strategy Buttons */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block"><MdText text={inhalt.texte.schnellSzenarienFürRückbaubarkeit} /></span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              {
                id: 'linear' as const,
                title: inhalt.werte.t1LinearDeponie,
                desc: inhalt.werte.geringeTrennung2035,
                color: 'hover:border-rose-300'
              },
              {
                id: 'standard' as const,
                title: inhalt.werte.t2EpdReferenzstandard,
                desc: inhalt.werte.ökobaudatStandardquotenNachAktuellem,
                color: 'hover:border-slate-400'
              },
              {
                id: 'selective' as const,
                title: inhalt.werte.t3SelektiverRückbau,
                desc: inhalt.werte.hoheSortenreinheit95Nach,
                color: 'hover:border-teal-300'
              },
              {
                id: 'pioneer' as const,
                title: inhalt.werte.t4MaximumReuseUrban,
                desc: inhalt.werte.t100ZirkulärBauteilbörsenMaximale,
                color: 'hover:border-emerald-300'
              }
            ].map((strat) => (
              <button
                key={strat.id}
                type="button"
                onClick={() => setGlobalModulDStrategy(strat.id)}
                className={`p-3 rounded-xl border bg-white text-left transition-all hover:bg-slate-50 cursor-pointer ${strat.color}`}
              >
                <strong className="text-xs font-bold text-slate-800 block">{strat.title}</strong>
                <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{strat.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    
      {/* Detailed Input Grid for each Material Row */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-teal-700" /><MdText text={inhalt.texte.detaillierteBaustoffEingabemaskeZeile} /></h4>
            <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.steuernSieFürJeden} /></p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {rows.length}<MdText text={inhalt.texte.baustoffeErfasst} /></span>
        </div>
    
        <div className="space-y-4">
          {results.rowModulDDetails.map((detail) => {
            return (
              <div key={detail.rowId} className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-slate-900">{detail.matName}</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 font-mono text-slate-700 font-semibold">
                        {detail.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono block mt-0.5"><MdText text={inhalt.texte.eingebauteMasse} /><strong>{formatDeZahl(detail.qty, 1)} {detail.unit}</strong> = <strong>{formatDeZahl(detail.weightTons, 2)} t</strong>
                    </span>
                  </div>
    
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono"><MdText text={inhalt.texte.modulDGutschrift} /></span>
                      <strong className="text-sm font-black font-mono text-teal-700">
                        {formatDeZahl(detail.rowGwpD, 1)} kg CO₂-eq
                      </strong>
                    </div>
                  </div>
                </div>
    
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* 1. Kreislauffähiger Stoffanteil */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <span><MdText text={inhalt.texte.kreislauffähigerAnteil} /></span>
                        <InfoTooltip text={inhalt.werte.prozentualerMassenanteilDesBaustoffs} />
                      </span>
                      <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {formatDeZahl(detail.circularQuota, 0)} %
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={detail.circularQuota}
                      onChange={(e) => updateRow(detail.rowId, { circularQuota: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span><MdText text={inhalt.texte.t0Verlust} /></span>
                      <span><MdText text={inhalt.texte.t100VollZirkulär} /></span>
                    </div>
                  </div>
    
                  {/* 2. Sortenreinheit & Rückbautrennbarkeit */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <span><MdText text={inhalt.texte.sortenreinheitRückbau} /></span>
                        <InfoTooltip text={inhalt.werte.qualitätDerBauteiltrennungNach} />
                      </span>
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border">
                        {formatDeZahl(detail.sortingRate, 0)} %
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      step="5"
                      value={detail.sortingRate}
                      onChange={(e) => updateRow(detail.rowId, { sortingRate: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span><MdText text={inhalt.texte.t30Verklebt} /></span>
                      <span><MdText text={inhalt.texte.t100Demontierbar} /></span>
                    </div>
                  </div>
    
                  {/* 3. Verwertungskaskade / Pfad */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-slate-700 block">Verwertungskaskade:</span>
                    <select aria-label="Verwertungskaskade"
                      value={detail.recoveryType}
                      onChange={(e) => updateRow(detail.rowId, { recoveryType: e.target.value as "high_grade" | "downcycling" | "reuse" | "thermal" | undefined })}
                      className="w-full text-xs font-semibold p-1.5 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 focus:outline-none cursor-pointer"
                    >
                      <option value="reuse">{inhalt.texte.optReuse.replace('{f}', formatDeZahl(VERWERTUNGSFAKTOR.reuse, 2))}</option>
                      <option value="high_grade">{inhalt.texte.optHigh.replace('{f}', formatDeZahl(VERWERTUNGSFAKTOR.high_grade, 1))}</option>
                      <option value="downcycling">{inhalt.texte.optDown.replace('{f}', formatDeZahl(VERWERTUNGSFAKTOR.downcycling, 2))}</option>
                      <option value="thermal">{inhalt.texte.optThermal.replace('{f}', formatDeZahl(VERWERTUNGSFAKTOR.thermal, 2))}</option>
                    </select>
                    <span className="text-[10px] text-teal-800 font-mono block truncate">
                      Verdrängt: {detail.substitutesPrimary}
                    </span>
                  </div>
                </div>
    
                <div className="text-[10.5px] text-slate-500 bg-slate-100/70 p-2 rounded-lg font-mono flex flex-wrap items-center justify-between gap-2">
                  <span><MdText text={inhalt.texte.effektivWiedergewonneneSekundärmasse} /><strong>{formatDeZahl(detail.effectiveRecoveredMassTons, 2)} t</strong> (von {formatDeZahl(detail.weightTons, 2)} t)</span>
                  <span><MdText text={inhalt.texte.spezifischeGutschriftJeTonne} /><strong>{formatDeZahl(detail.rowGwpD / (detail.weightTons || 1), 1)} kg CO₂-eq/t</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    
      {/* Aggregate Modul D Balance & Formula Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aggregate Balance Card */}
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono"><MdText text={inhalt.texte.aggregierteZirkularitätsGutschriftenBila} /></h4>
    
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-teal-700 block font-mono"><MdText text={inhalt.texte.modulDGutschrift2} /></span>
              <strong className="text-xl font-black text-teal-900 font-mono">{formatDeZahl(results.gwpD, 0)} kg</strong>
              <span className="text-[9px] text-teal-700/80 block"><MdText text={inhalt.texte.coEqGutschrift} /></span>
            </div>
    
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block font-mono"><MdText text={inhalt.texte.zirkuläreGesamtmasse} /></span>
              <strong className="text-xl font-black text-emerald-900 font-mono">{formatDeZahl(results.totalCircularWeightTons, 1)} t</strong>
              <span className="text-[9px] text-emerald-700/80 block">von {formatDeZahl(results.totalWeightTons, 1)} t ({formatDeZahl(results.overallCircularityRate, 1)}%)</span>
            </div>
          </div>
    
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span><MdText text={inhalt.texte.bruttoHerstellungEntsorgungModule} /></span>
              <strong className="font-mono text-slate-900">{formatDeZahl(results.gwpAC, 0)} kg CO₂-eq</strong>
            </div>
            <div className="flex justify-between items-center text-teal-700">
              <span><MdText text={inhalt.texte.modulDGutschriftGutschrift} /></span>
              <strong className="font-mono text-teal-800">{formatDeZahl(results.gwpD, 0)} kg CO₂-eq</strong>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-2 font-bold text-slate-900">
              <span><MdText text={inhalt.texte.nettoGesamtbilanzA1D} /></span>
              <strong className={`font-mono text-sm ${results.totalGwpNet < 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                {results.totalGwpNet > 0 ? "+" : ""}{formatDeZahl(results.totalGwpNet, 0)} kg CO₂-eq
              </strong>
            </div>
          </div>
        </div>
    
        {/* Normative Formula Card */}
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono"><MdText text={inhalt.texte.berechnungsmethodeNachDinEn} /></h4>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieGutschriftInModul} /></p>
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center font-mono text-xs overflow-x-auto">
            <BlockMath math="\text{GWP}_{D,i} = \text{Menge}_i \cdot \text{GWP}_{D,\text{ref},i} \cdot \frac{r_{\text{circ},i}}{r_{\text{ref},i}} \cdot \frac{s_{\text{sort},i}}{85\,\%} \cdot \frac{\eta_{\text{Weg}}}{\eta_{\text{Ref}}}" />
          </div>
          <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 font-mono">
            <li><MdText text={inhalt.texte.rTextCircKreislauffähiger} /></li>
            <li><MdText text={inhalt.texte.sTextSortSortenreinheitsgrad} /></li>
            <li><MdText text={inhalt.texte.etaTextSubstSubstitutionswirkungsgrad} /></li>
          </ul>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.verwertungsfaktorBegruendung} /></p>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.verwertungsfaktorGrenze} /></p>
          <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.quellenVerwertung} /></p>
        </div>
      </div>
    </div>
  );
}
