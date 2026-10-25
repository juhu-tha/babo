import { formatDeZahl } from '@/src/utils/numberFormat';
import { Recycle } from 'lucide-react';

// Subcomponent for Calculation Dashboard
export function CalculationDashboard({
  results,
  qngThresholds,
  benchmarkStatus
}: {
  results: any;
  qngThresholds: any;
  benchmarkStatus: any;
}) {
  return (
    <div className="bg-white border border-home-grau/30 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b pb-2">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
          Ergebnis-Zusammenfassung (QNG &amp; LCA)
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700">
          {qngThresholds.label}
        </span>
      </div>

      {/* Orientierungswert (vereinfachte Bilanz, kein QNG-Nachweis) */}
      <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner flex flex-col justify-center items-center">
        <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider font-mono">
          Orientierungswert in Anlehnung an QNG (vereinfacht: A1–A4, C, ohne B4/B6 – kein Nachweis)
        </span>
        <strong className={`text-4xl font-black mt-1.5 font-mono leading-none tracking-tight ${
          results.gwpPerSqmYearAC <= qngThresholds.premium ? "text-emerald-700" :
          results.gwpPerSqmYearAC <= qngThresholds.plus ? "text-teal-700" : "text-shiraz"
        }`}>
          {formatDeZahl(results.gwpPerSqmYearAC, 2)}
        </strong>
        <span className="text-[10.5px] text-slate-500 block font-mono mt-1">kg CO₂-eq / (m² NRF · a)</span>

        <div className="mt-3 flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs ${benchmarkStatus.badge}`}>
            {benchmarkStatus.label}
          </span>
        </div>
      </div>

      {/* Modul D Credit & Net Comparison */}
      <div className="bg-teal-50/60 border border-teal-200/80 p-3.5 rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between font-bold text-teal-900">
          <span className="flex items-center gap-1.5">
            <Recycle size={14} className="text-teal-700" />
            Modul D: Recycling-Gutschrift außerhalb der Systemgrenze
          </span>
          <span className="font-mono text-teal-800">{formatDeZahl(results.gwpPerSqmYearD, 2)} kg/(m²·a)</span>
        </div>
        <p className="text-[11px] text-teal-800/80 leading-snug">
          Netto-Bilanz unter Einrechnung zukünftiger Wertstoff-Gutschriften: <strong className="font-mono text-teal-950 font-bold">{formatDeZahl(results.gwpPerSqmYearNet, 2)} kg CO₂-eq/(m²·a)</strong>. <em>Hinweis: Nach QNG und DGNB muss der formale Nachweis auf Modul A–C ohne Abzug von D erbracht werden.</em>
        </p>
      </div>

      {/* Benchmark Status card */}
      <div className={`p-4 rounded-xl border text-xs leading-relaxed flex flex-col gap-1.5 shadow-sm transition ${benchmarkStatus.color}`}>
        <span className="text-[11px] leading-relaxed">
          {benchmarkStatus.desc}
        </span>
      </div>

      {/* Key KPI Strip (UMI, Biogenic, PENRT) */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
          <span className="text-[9.5px] uppercase font-bold text-slate-400 block font-mono">Urban Mining Index</span>
          <strong className="text-base font-black text-slate-800 font-mono">{formatDeZahl(results.weightedUmi, 0)}%</strong>
          <span className="text-[8.5px] text-slate-500 block">Zirkularität</span>
        </div>

        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
          <span className="text-[9.5px] uppercase font-bold text-slate-400 block font-mono">Biogener Puffer</span>
          <strong className="text-base font-black text-emerald-700 font-mono">{formatDeZahl(results.gwpBioStorageInstalled / 1000, 1)} t</strong>
          <span className="text-[8.5px] text-slate-500 block">CO₂-Speicher</span>
        </div>

        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
          <span className="text-[9.5px] uppercase font-bold text-slate-400 block font-mono">Primärenergie</span>
          <strong className="text-base font-black text-slate-800 font-mono">{formatDeZahl(results.penrtKwhPerSqmYear, 1)}</strong>
          <span className="text-[8.5px] text-slate-500 block">kWh/(m²a) PENRT</span>
        </div>
      </div>

      {/* LCA Stage Stack Breakdown */}
      <div className="space-y-3 pt-1">
        <label className="text-[10.5px] font-extrabold text-slate-700 block uppercase tracking-wide font-mono">
          CO₂-Bilanz nach Lebenszyklusphasen (kg CO₂-eq)
        </label>

        <div className="space-y-2.5">
          {[
            { label: "Phase A1-A3: Baustoff-Herstellung", value: results.gwpA1A3, colorClass: results.gwpA1A3 < 0 ? "bg-emerald-500" : "bg-rose-500", desc: "Rohstoffgewinnung und Veredelung im Werk." },
            { label: "Phase A4: Logistik-Transportweg", value: results.gwpA4, colorClass: "bg-amber-500", desc: "Zustellung zum Baustellenort." },
            { label: "Phase C3-C4: Entsorgung (End of Life)", value: results.gwpC, colorClass: "bg-indigo-500", desc: "Rückbau und Verbrennung biogener Anteile." },
            { label: "Modul D: Recyclingpotenziale", value: results.gwpD, colorClass: "bg-teal-500", desc: "Gutschriften außerhalb der Bilanzgrenze." }
          ].map((phase, idx) => {
            const maxAbsVal = Math.max(
              100, 
              Math.abs(results.gwpA1A3), 
              Math.abs(results.gwpA4), 
              Math.abs(results.gwpC), 
              Math.abs(results.gwpD)
            );
            const pct = Math.min(100, (Math.abs(phase.value) / maxAbsVal) * 100);
            const isNegative = phase.value < 0;

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">{phase.label}</span>
                  <strong className={`font-mono ${isNegative ? "text-emerald-700" : "text-slate-900"}`}>
                    {phase.value > 0 ? "+" : ""}{formatDeZahl(phase.value, 0)} kg
                  </strong>
                </div>

                <div className="h-2.5 bg-slate-100 rounded-full w-full overflow-hidden flex relative border border-slate-200">
                  {isNegative ? (
                    <div className="flex-1 flex justify-end">
                      <div 
                        className={`h-full ${phase.colorClass} rounded-full transition-all duration-300`}
                        style={{ width: `${pct}%`, marginRight: "50%" }}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex justify-start">
                      <div 
                        className={`h-full ${phase.colorClass} rounded-full transition-all duration-300`}
                        style={{ width: `${pct}%`, marginLeft: "50%" }}
                      />
                    </div>
                  )}
                  <span className="absolute left-[50%] top-0 w-[1px] h-full bg-slate-350" />
                </div>
                <span className="text-[9px] text-slate-400 leading-none block italic">{phase.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Balance Sheet */}
      <div className="border-t pt-3 flex justify-between items-center text-xs text-slate-700">
        <span className="font-semibold">Nettobilanz CO₂-Ausstoß (A1-D):</span>
        <strong className={`font-mono text-sm font-black ${results.totalGwpNet < 0 ? "text-emerald-700" : "text-slate-900"}`}>
          {results.totalGwpNet > 0 ? "+" : ""}{formatDeZahl(results.totalGwpNet, 0)} kg CO₂-eq
        </strong>
      </div>
    </div>
  );
}
