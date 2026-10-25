import { Recycle, SlidersHorizontal } from 'lucide-react';
import { formatDeZahl } from '@/src/utils/numberFormat';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { InlineMath, BlockMath } from 'react-katex';
import { CustomRow } from './daten';

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
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-700 text-white font-mono">
                  DIN EN 15804+A2 / DIN EN 17472
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Modul D: Außerhalb der Systemgrenze</span>
              </div>
              <h3 className="text-lg font-bold text-text-main mt-0.5">
                Eingabemaske Modul D – Wiederverwendungs-, Rückgewinnungs- &amp; Recyclingpotenziale
              </h3>
            </div>
          </div>
          <div className="text-right text-xs font-mono font-bold text-teal-800 bg-teal-50 p-2.5 rounded-xl border border-teal-200">
            Gesamt-Gutschrift: <strong>{formatDeZahl(results.gwpD, 0)} kg CO₂-eq</strong>
          </div>
        </div>
    
        <div className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed space-y-2">
          <p>
            <strong>Modul D</strong> bilanziert das <em>zukünftige Entlastungspotenzial</em> für nachfolgende Generationen: Wenn Baustoffe am Lebensende nicht auf der Deponie landen, sondern als Sekundärrohstoffe recycelt oder direkt wiederverwendet werden, verdrängen sie energieintensive Primärmaterialien (z. B. Hochofen-Stahl oder Neukies).
          </p>
          <p>
            <strong>Normativer Grundsatz:</strong> Nach DIN EN 15804 und QNG 2026 muss Modul D <em>separat ausgewiesen</em> werden. Es darf <strong>nicht</strong> vom offiziellen Errichtungsnachweiswert (Module A1–C4) abgezogen werden, um Schönrechnungen zu verhindern, dient aber als Kernindikator für die <strong>echte Kreislaufwirtschaft (Circular Economy / UMI)</strong>.
          </p>
        </div>
    
        {/* Quick Strategy Buttons */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block">
            Schnell-Szenarien für Rückbaubarkeit &amp; Zirkularitätsstrategie anwenden:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              {
                id: 'linear' as const,
                title: '1. Linear / Deponie',
                desc: 'Geringe Trennung (20-35%), Downcycling / Bauschuttverfüllung',
                color: 'hover:border-rose-300'
              },
              {
                id: 'standard' as const,
                title: '2. EPD-Referenzstandard',
                desc: 'ÖKOBAUDAT Standardquoten nach aktuellem Marktdurchschnitt',
                color: 'hover:border-slate-400'
              },
              {
                id: 'selective' as const,
                title: '3. Selektiver Rückbau',
                desc: 'Hohe Sortenreinheit (95%) nach VDI 6210, Schrott- & RC-Korn-Kreislauf',
                color: 'hover:border-teal-300'
              },
              {
                id: 'pioneer' as const,
                title: '4. Maximum Reuse / Urban Mining',
                desc: '100% zirkulär, Bauteilbörsen, maximale Primärrohstoffverdrängung',
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
              <SlidersHorizontal size={16} className="text-teal-700" />
              Detaillierte Baustoff-Eingabemaske (Zeile für Zeile)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Steuern Sie für jeden Baustoff den <strong>kreislauffähigen Stoffanteil</strong>, den <strong>Sortenreinheitsgrad</strong> und den <strong>Verwertungspfad</strong>.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {rows.length} Baustoffe erfasst
          </span>
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
                    <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                      Eingebaute Masse: <strong>{formatDeZahl(detail.qty, 1)} {detail.unit}</strong> = <strong>{formatDeZahl(detail.weightTons, 2)} t</strong>
                    </span>
                  </div>
    
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Modul D Gutschrift</span>
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
                        <span>Kreislauffähiger Anteil:</span>
                        <InfoTooltip text="Prozentualer Massenanteil des Baustoffs, der technisch und wirtschaftlich nach Rückbau einer Verwertung zugeführt werden kann (z. B. 95% bei Stahl, 88% bei RC-Beton)." />
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
                      <span>0% (Verlust)</span>
                      <span>100% (Voll zirkulär)</span>
                    </div>
                  </div>
    
                  {/* 2. Sortenreinheit & Rückbautrennbarkeit */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <span>Sortenreinheit (Rückbau):</span>
                        <InfoTooltip text="Qualität der Bauteiltrennung nach VDI 6210. Schraub- und Steckverbindungen erlauben 95-100%, vollflächige Klebeverbindungen oft nur 50-70%." />
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
                      <span>30% (Verklebt)</span>
                      <span>100% (Demontierbar)</span>
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
                      <option value="reuse">Direkte Wiederverwendung (Reuse, Faktor 1,45)</option>
                      <option value="high_grade">Hochwertiges Recycling (Closed Loop, Faktor 1,0)</option>
                      <option value="downcycling">Kaskadennutzung / Downcycling (Faktor 0,55)</option>
                      <option value="thermal">Thermische Verwertung (Energierückgewinnung, Faktor 0,85)</option>
                    </select>
                    <span className="text-[10px] text-teal-800 font-mono block truncate">
                      Verdrängt: {detail.substitutesPrimary}
                    </span>
                  </div>
                </div>
    
                <div className="text-[10.5px] text-slate-500 bg-slate-100/70 p-2 rounded-lg font-mono flex flex-wrap items-center justify-between gap-2">
                  <span>Effektiv wiedergewonnene Sekundärmasse: <strong>{formatDeZahl(detail.effectiveRecoveredMassTons, 2)} t</strong> (von {formatDeZahl(detail.weightTons, 2)} t)</span>
                  <span>Spezifische Gutschrift je Tonne: <strong>{formatDeZahl(detail.rowGwpD / (detail.weightTons || 1), 1)} kg CO₂-eq/t</strong></span>
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
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Aggregierte Zirkularitäts- &amp; Gutschriften-Bilanz
          </h4>
    
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-teal-700 block font-mono">Modul D Gutschrift</span>
              <strong className="text-xl font-black text-teal-900 font-mono">{formatDeZahl(results.gwpD, 0)} kg</strong>
              <span className="text-[9px] text-teal-700/80 block">CO₂-eq Gutschrift</span>
            </div>
    
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block font-mono">Zirkuläre Gesamtmasse</span>
              <strong className="text-xl font-black text-emerald-900 font-mono">{formatDeZahl(results.totalCircularWeightTons, 1)} t</strong>
              <span className="text-[9px] text-emerald-700/80 block">von {formatDeZahl(results.totalWeightTons, 1)} t ({formatDeZahl(results.overallCircularityRate, 1)}%)</span>
            </div>
          </div>
    
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span>Brutto-Herstellung &amp; Entsorgung (Module A1–C4):</span>
              <strong className="font-mono text-slate-900">{formatDeZahl(results.gwpAC, 0)} kg CO₂-eq</strong>
            </div>
            <div className="flex justify-between items-center text-teal-700">
              <span>Modul D Gutschrift (Gutschrift außerhalb Bilanzgrenze):</span>
              <strong className="font-mono text-teal-800">{formatDeZahl(results.gwpD, 0)} kg CO₂-eq</strong>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-2 font-bold text-slate-900">
              <span>Netto-Gesamtbilanz (A1–D):</span>
              <strong className={`font-mono text-sm ${results.totalGwpNet < 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                {results.totalGwpNet > 0 ? "+" : ""}{formatDeZahl(results.totalGwpNet, 0)} kg CO₂-eq
              </strong>
            </div>
          </div>
        </div>
    
        {/* Normative Formula Card */}
        <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Berechnungsmethode nach DIN EN 15804+A2 &amp; DIN EN 17472
          </h4>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Die Gutschrift in Modul D wird berechnet aus der Netto-Menge an Sekundärstoffen, dem Substitutionswirkungsgrad und den vermiedenen Primärlasten:
          </p>
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center font-mono text-xs overflow-x-auto">
            <BlockMath math="\text{GWP}_{D,i} = - \left( m_i \cdot \frac{r_{\text{circ},i}}{100} \cdot \frac{s_{\text{sort},i}}{100} \cdot \eta_{\text{subst}} \cdot \text{GWP}_{\text{primär,verdrängt}} \right)" />
          </div>
          <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 font-mono">
            <li><InlineMath math="r_{\text{circ}}" />: Kreislauffähiger Stoffanteil (Zirkularitätsquote)</li>
            <li><InlineMath math="s_{\text{sort}}" />: Sortenreinheitsgrad / Rückbautrennbarkeit (VDI 6210)</li>
            <li><InlineMath math="\eta_{\text{subst}}" />: Substitutionswirkungsgrad der Kaskade (Reuse, Recycling, Downcycling)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
