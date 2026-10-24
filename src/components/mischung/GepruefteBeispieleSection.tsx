import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { 
  CheckCircle2, BookOpen, ArrowRight, ShieldCheck, 
  Layers, Info, Sparkles, Scale 
} from 'lucide-react';

import { BENCHMARK_EXAMPLES, type BenchmarkData } from '@/src/data/mischungBeispiele';
export { BENCHMARK_EXAMPLES, type BenchmarkData };

interface Props {
  onLoadBenchmark: (benchmark: BenchmarkData) => void;
}

export default function GepruefteBeispieleSection({ onLoadBenchmark }: Props) {
  const [selectedId, setSelectedId] = useState<string>('bsp_hochbau');

  const selected = BENCHMARK_EXAMPLES.find(b => b.id === selectedId) || BENCHMARK_EXAMPLES[0];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-home-grau/20">
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <BookOpen className="text-shiraz" /> Geprüfte Beispielrechnungen &amp; Verifikation
          </h2>
          <p className="text-sm text-text-main/70 mt-1">
            Vollständig verifizierte Referenzmischungen nach DIN EN 206 / DIN 1045-2 mit exakten Zwischenrechnungen und 1-Klick-Übernahme in den Rechner.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200">
          <ShieldCheck size={16} /> Mathematisch 100% verifiziert
        </div>
      </div>

      {/* Auswahl-Karten der 4 Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {BENCHMARK_EXAMPLES.map(bsp => (
          <button aria-pressed={selectedId === bsp.id}
            key={bsp.id}
            onClick={() => setSelectedId(bsp.id)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedId === bsp.id 
                ? 'bg-shiraz/5 border-shiraz shadow-sm ring-1 ring-shiraz' 
                : 'bg-off-white/60 border-home-grau/30 hover:border-shiraz/40 hover:bg-off-white'
            }`}
          >
            <div>
              <div className="text-[11px] font-bold text-shiraz uppercase tracking-wider mb-1">
                {bsp.kategorie}
              </div>
              <div className="text-sm font-bold text-text-main leading-tight mb-2">
                {bsp.titel.split(':')[1] || bsp.titel}
              </div>
              <div className="text-xs text-text-main/60 line-clamp-2">
                {bsp.bauteilTyp}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-home-grau/20 flex items-center justify-between text-xs font-medium text-text-main/70">
              <span>{bsp.normVorgaben.druckfestigkeit}</span>
              <span className="font-mono text-shiraz font-bold">Dmax {bsp.groesstkorn}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail-Ansicht des gewählten Beispiels */}
      <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-shiraz text-white">
                {selected.normKonformitaet}
              </span>
              <span className="text-xs text-text-main/70 font-medium">
                Bauteil: <strong>{selected.bauteilTyp}</strong>
              </span>
            </div>
            <h3 className="text-lg font-bold text-text-main">
              {selected.titel}
            </h3>
            <p className="text-sm text-text-main/80 mt-1 max-w-3xl">
              {selected.beschreibung}
            </p>
          </div>

          <button
            onClick={() => onLoadBenchmark(selected)}
            className="px-4 py-2.5 bg-shiraz text-white rounded-xl font-bold text-sm shadow hover:bg-shiraz/90 transition-all flex items-center gap-2 cursor-pointer self-start"
          >
            <Sparkles size={16} />
            <span>In Mischungsrechner laden</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Kenndaten Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <div className="text-xs text-text-main/60">Druckfestigkeit</div>
            <div className="text-base font-bold text-shiraz">{selected.normVorgaben.druckfestigkeit}</div>
            <div className="text-[11px] text-text-main/60">Zement: {formatDeWert(selected.zement)} kg/m³</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <div className="text-xs text-text-main/60">Wasserzementwert</div>
            <div className="text-base font-bold text-text-main">{formatDeZahl((selected.wasser / selected.zement), 2)}</div>
            <div className="text-[11px] text-text-main/60">Wasser: {formatDeWert(selected.wasser)} L/m³</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <div className="text-xs text-text-main/60">Luftporengehalt</div>
            <div className="text-base font-bold text-text-main">{formatDeZahl(selected.luft, 1)} Vol.-%</div>
            <div className="text-[11px] text-text-main/60">Volumen: {formatDeZahl(selected.stoffraum.luftVol, 1)} dm³</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <div className="text-xs text-text-main/60">Frischbetonrohdichte</div>
            <div className="text-base font-bold text-text-main">{formatDeZahl(selected.frischbetonDichte, 3)} kg/dm³</div>
            <div className="text-[11px] text-text-main/60">Gestein: {formatDeZahl(selected.massenTrocken.gesteinGesamt, 1)} kg</div>
          </div>
        </div>

        {/* Schrittweise Stoffraumrechnung & Feuchtebilanz */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Linke Spalte: Stoffraumrechnung */}
          <div className="bg-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2 mb-3">
              <Layers size={16} className="text-shiraz" />
              <span>Stoffraumrechnung (1000 dm³ = 1 m³ Frischbeton)</span>
            </h4>
            
            <div className="bg-off-white/70 p-2.5 rounded-lg border border-home-grau/20 text-xs font-mono mb-3 text-center">
              <FormulaText text="V_G = 1000 - (V_Z + V_W + V_L + V_{ZM} + V_{Zusatz} + V_{Fasern})" />
            </div>

            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-home-grau/15 py-1">
                  <td className="py-1 text-text-main/70">Zement ({selected.zementArt}):</td>
                  <td className="py-1 text-right font-mono">{formatDeWert(selected.zement)} kg ÷ {selected.zementArt === 'CEM I' ? '3.10' : '3.05'} =</td>
                  <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.zementVol, 1)} dm³</td>
                </tr>
                <tr className="border-b border-home-grau/15 py-1">
                  <td className="py-1 text-text-main/70">Wasser (wirksam):</td>
                  <td className="py-1 text-right font-mono">{formatDeWert(selected.wasser)} kg ÷ 1,00 =</td>
                  <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.wasserVol, 1)} dm³</td>
                </tr>
                <tr className="border-b border-home-grau/15 py-1">
                  <td className="py-1 text-text-main/70">Luftporen (Luftgehalt):</td>
                  <td className="py-1 text-right font-mono">{formatDeZahl(selected.luft, 1)} Vol.-% × 10 =</td>
                  <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.luftVol, 1)} dm³</td>
                </tr>
                {selected.hues > 0 && (
                  <tr className="border-b border-home-grau/15 py-1">
                    <td className="py-1 text-text-main/70">Hüttensandmehl (HüS):</td>
                    <td className="py-1 text-right font-mono">{formatDeWert(selected.hues)} kg ÷ 2,90 =</td>
                    <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.zusatzstoffVol, 1)} dm³</td>
                  </tr>
                )}
                {selected.fa > 0 && (
                  <tr className="border-b border-home-grau/15 py-1">
                    <td className="py-1 text-text-main/70">Flugasche (FA):</td>
                    <td className="py-1 text-right font-mono">{formatDeWert(selected.fa)} kg ÷ 2,20 =</td>
                    <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.zusatzstoffVol, 1)} dm³</td>
                  </tr>
                )}
                {selected.zusatzmittel > 0 && (
                  <tr className="border-b border-home-grau/15 py-1">
                    <td className="py-1 text-text-main/70">Zusatzmittel (FM/LP):</td>
                    <td className="py-1 text-right font-mono">{formatDeWert(selected.zusatzmittel)} kg ÷ 1,05 =</td>
                    <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.zmVol, 1)} dm³</td>
                  </tr>
                )}
                {(selected.stahlfaser || 0) > 0 && (
                  <tr className="border-b border-home-grau/15 py-1">
                    <td className="py-1 text-text-main/70">Stahlfasern (SF):</td>
                    <td className="py-1 text-right font-mono">{formatDeWert(selected.stahlfaser)} kg ÷ 7,85 =</td>
                    <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.faserVol, 1)} dm³</td>
                  </tr>
                )}
                <tr className="border-t-2 border-home-grau/40 bg-slate-50/70 font-bold">
                  <td className="py-1.5 text-shiraz">Gesteinskörnung (Restvolumen):</td>
                  <td className="py-1.5 text-right font-mono">1000 - Summe =</td>
                  <td className="py-1.5 text-right text-shiraz font-mono">{formatDeZahl(selected.stoffraum.gesteinVol, 1)} dm³</td>
                </tr>
                <tr className="bg-slate-50/70">
                  <td className="py-1 text-text-main font-semibold">Trockenmasse Gestein:</td>
                  <td className="py-1 text-right font-mono">{formatDeZahl(selected.stoffraum.gesteinVol, 1)} × 2,65 =</td>
                  <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.massenTrocken.gesteinGesamt, 1)} kg</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Rechte Spalte: Feuchtekorrektur & Rezeptur für die Waage */}
          <div className="bg-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2 mb-3">
              <Scale size={16} className="text-shiraz" />
              <span>Praxis-Einwaage mit Feuchtekorrektur</span>
            </h4>

            <div className="text-xs text-text-main/80 space-y-2 mb-3">
              <p>
                Gesteinskörnungen enthalten freie Oberflächenfeuchte (Gesamtfeuchte minus Kernfeuchte WA). Diese reduziert das Zugabewasser am Mischer:
              </p>
              <div className="p-2 bg-off-white/80 rounded border border-home-grau/20 text-center font-mono">
                <FormulaText text="w_{Zugabe} = w_{Soll} - \sum Wasser_{Gestein}" />
              </div>
            </div>

            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-home-grau/30 text-text-main/60 text-left">
                  <th className="py-1">Stoffkomponente</th>
                  <th className="py-1 text-right">Trocken</th>
                  <th className="py-1 text-right">Feuchte</th>
                  <th className="py-1 text-right font-bold text-shiraz">Einwaage (feucht)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-home-grau/10">
                  <td className="py-1">Zement</td>
                  <td className="py-1 text-right font-mono">{formatDeZahl(selected.zement, 1)} kg</td>
                  <td className="py-1 text-right text-text-main/40">-</td>
                  <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.zement, 1)} kg</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-1">Sand 0/4 ({formatDeWert(selected.f04)}%)</td>
                  <td className="py-1 text-right font-mono">{formatDeZahl(selected.massenTrocken.m04, 1)} kg</td>
                  <td className="py-1 text-right font-mono">+{formatDeWert(selected.feuchte04)}%</td>
                  <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.feuchteRechnung.m04Feucht, 1)} kg</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-1">Kies 4/8 ({formatDeWert(selected.f48)}%)</td>
                  <td className="py-1 text-right font-mono">{formatDeZahl(selected.massenTrocken.m48, 1)} kg</td>
                  <td className="py-1 text-right font-mono">+{formatDeWert(selected.feuchte48)}%</td>
                  <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.feuchteRechnung.m48Feucht, 1)} kg</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-1">Kies 8/16 ({formatDeWert(selected.f816)}%)</td>
                  <td className="py-1 text-right font-mono">{formatDeZahl(selected.massenTrocken.m816, 1)} kg</td>
                  <td className="py-1 text-right font-mono">+{formatDeWert(selected.feuchte816)}%</td>
                  <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.feuchteRechnung.m816Feucht, 1)} kg</td>
                </tr>
                {(selected.massenTrocken.m1632 || 0) > 0 && (
                  <tr className="border-b border-home-grau/10">
                    <td className="py-1">Kies 16/32 ({formatDeWert(selected.f1632)}%)</td>
                    <td className="py-1 text-right font-mono">{formatDeZahl(selected.massenTrocken.m1632, 1)} kg</td>
                    <td className="py-1 text-right font-mono">+{formatDeWert(selected.feuchte1632)}%</td>
                    <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.feuchteRechnung.m1632Feucht, 1)} kg</td>
                  </tr>
                )}
                {selected.hues > 0 && (
                  <tr className="border-b border-home-grau/10">
                    <td className="py-1">Hüttensand (HüS)</td>
                    <td className="py-1 text-right font-mono">{formatDeZahl(selected.hues, 1)} kg</td>
                    <td className="py-1 text-right text-text-main/40">-</td>
                    <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.hues, 1)} kg</td>
                  </tr>
                )}
                {(selected.stahlfaser || 0) > 0 && (
                  <tr className="border-b border-home-grau/10">
                    <td className="py-1">Stahlfasern</td>
                    <td className="py-1 text-right font-mono">{formatDeZahl(selected.stahlfaser, 1)} kg</td>
                    <td className="py-1 text-right text-text-main/40">-</td>
                    <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.stahlfaser, 1)} kg</td>
                  </tr>
                )}
                <tr className="border-t-2 border-shiraz bg-shiraz/5 font-bold">
                  <td className="py-1.5 text-shiraz">Tatsächliches Zugabewasser:</td>
                  <td className="py-1.5 text-right font-mono">{formatDeZahl(selected.wasser, 1)} L</td>
                  <td className="py-1.5 text-right font-mono text-red-600">-{formatDeZahl(selected.feuchteRechnung.wasserAusGestein, 1)} L</td>
                  <td className="py-1.5 text-right font-mono text-shiraz">{formatDeZahl(selected.feuchteRechnung.zugabewasser, 1)} L</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Didaktische Erläuterungen & Normhinweise */}
        <div className="bg-white p-4 rounded-xl border border-home-grau/25">
          <h4 className="font-bold text-sm text-text-main flex items-center gap-2 mb-2">
            <Info size={16} className="text-shiraz" />
            <span>Fachtechnische Einordnung &amp; Verifikationshinweise</span>
          </h4>
          <ul className="space-y-2 text-xs text-text-main/80">
            {selected.didaktischeHinweise.map((h, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-shiraz flex-shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
