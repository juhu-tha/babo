import { formatDeZahl } from '@/src/utils/numberFormat';
import { Recycle } from 'lucide-react';
import inhalt from '@/content/interactivelcacalc/CalculationDashboard.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import type { LcaErgebnis } from '@/src/calc/lca';

export interface QngSchwellen { plus: number; premium: number; label: string }
export interface QngBenchmarkStatus { label: string; color: string; badge: string; desc: string }

/** Ergebnisanzeige des LCA-Rechners; alle Zahlen aus dem Rechenkern src/calc/lca.ts */
export function CalculationDashboard({
  ergebnis,
  qngThresholds,
  benchmarkStatus,
  nrfR,
  betrachtungszeitraum,
  namen = {},
}: {
  ergebnis: LcaErgebnis;
  qngThresholds: QngSchwellen;
  benchmarkStatus: QngBenchmarkStatus;
  /** Netto-Raumfläche NRF(R) [m²] und Betrachtungszeitraum [a] für die Anzeige der Bezugsgröße */
  nrfR: number;
  betrachtungszeitraum: number;
  /** Anzeigenamen der Baustoffe je id */
  namen?: Record<string, string>;
}) {
  const s = ergebnis.spez;
  const farbe = ergebnis.aussage === 'premium' ? 'text-emerald-700' : ergebnis.aussage === 'plus' ? 'text-teal-700' : ergebnis.aussage === 'ueberschritten' ? 'text-shiraz' : 'text-slate-700';
  const phasen = [
    { label: inhalt.werte.phaseA1A3Baustoff, value: s.a1a3, aktiv: true, colorClass: s.a1a3 < 0 ? 'bg-emerald-500' : 'bg-rose-500', desc: inhalt.werte.rohstoffgewinnungUndVeredelungIm },
    { label: inhalt.werte.phaseB4Ersatz, value: s.b4, aktiv: ergebnis.enthaeltB4, colorClass: 'bg-orange-500', desc: inhalt.werte.ersatzNachBnb },
    { label: inhalt.werte.phaseC3C4Entsorgung, value: s.c3c4, aktiv: true, colorClass: 'bg-indigo-500', desc: inhalt.werte.rückbauUndVerbrennungBiogener },
    { label: inhalt.werte.phaseTga, value: s.sockelTga, aktiv: true, colorClass: 'bg-slate-500', desc: inhalt.werte.tgaPauschal },
    { label: inhalt.werte.phaseB6Betrieb, value: s.b6, aktiv: ergebnis.enthaeltB6, colorClass: 'bg-sky-600', desc: inhalt.werte.b6Beschreibung },
    { label: inhalt.werte.phaseA4LogistikTransportweg, value: s.a4, aktiv: true, colorClass: 'bg-amber-500', desc: inhalt.werte.zustellungZumBaustellenort },
    { label: inhalt.werte.modulDRecyclingpotenziale, value: s.d, aktiv: true, colorClass: 'bg-teal-500', desc: inhalt.werte.gutschriftenAußerhalbDerBilanzgrenze },
  ];
  const maxAbs = Math.max(1, ...phasen.map(p => Math.abs(p.value)));
  const summe = ergebnis.a1a3 + ergebnis.b4 + ergebnis.c3c4 + ergebnis.sockelTga + ergebnis.b6;

  return (
    <div className="bg-white border border-home-grau/30 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b pb-2">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono"><MdText text={inhalt.texte.ergebnisZusammenfassungQngLca} /></span>
        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700">
          {qngThresholds.label}
        </span>
      </div>

      <EingabeHinweise hinweise={ergebnis.hinweise} />

      {ergebnis.gueltig && (
        <>
          {/* Bezugsgröße (Auftrag 28.10.2026): funktionales Äquivalent je m² NRF(R)·a, Baustoffdaten je deklarierter Einheit */}
          <p className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-[11px] text-slate-800 leading-relaxed" data-testid="bezug-gebaeude">
            <MdText text={inhalt.texte.bezugGebaeudeTitel} /><strong>{formatDeZahl(betrachtungszeitraum, 0)} a</strong> (NRF(R) = {formatDeZahl(nrfR, 0)} m²). <MdText text={inhalt.texte.bezugGebaeudeDaten} />
            {!ergebnis.enthaeltB4 && <> <MdText text={inhalt.texte.bezugGebaeudeOhneB4} /></>}
          </p>

          {/* Hauptwert je m² NRF(R) und Jahr (vereinfachte Bilanz, kein QNG-Nachweis) */}
          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner flex flex-col justify-center items-center">
            <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider font-mono px-3">
              <MdText text={ergebnis.enthaeltB4 && ergebnis.enthaeltB6 ? inhalt.texte.orientierungswertInAnlehnungAn : inhalt.texte.teilbilanzTitel} />
            </span>
            <strong className={`text-4xl font-black mt-1.5 font-mono leading-none tracking-tight ${farbe}`}>
              {formatDeZahl(s.qng, 2)}
            </strong>
            <span className="text-[10.5px] text-slate-500 block font-mono mt-1"><MdText text={inhalt.texte.kgCoEqM} /></span>
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs ${benchmarkStatus.badge}`}>
                {benchmarkStatus.label}
              </span>
            </div>
          </div>

          {/* Modul D getrennt */}
          <div className="bg-teal-50/60 border border-teal-200/80 p-3.5 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-teal-900">
              <span className="flex items-center gap-1.5">
                <Recycle size={14} className="text-teal-700" /><MdText text={inhalt.texte.modulDRecyclingGutschrift} /></span>
              <span className="font-mono text-teal-800">{formatDeZahl(s.d, 2)} kg/(m²·a)</span>
            </div>
            <p className="text-[11px] text-teal-800/80 leading-snug"><MdText text={inhalt.texte.nettoBilanzUnterEinrechnung} /><strong className="font-mono text-teal-950 font-bold">{formatDeZahl(s.netto, 2)}<MdText text={inhalt.texte.kgCoEqM2} /></strong><MdText text={inhalt.texte.hinweisNachQngUnd} /></p>
          </div>

          <div className={`p-4 rounded-xl border text-xs leading-relaxed flex flex-col gap-1.5 shadow-sm transition ${benchmarkStatus.color}`}>
            <span className="text-[11px] leading-relaxed">{benchmarkStatus.desc}</span>
          </div>

          {/* Kennzahlen UMI, biogener Kohlenstoff, PENRT */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="text-[9.5px] uppercase font-bold text-slate-400 block font-mono"><MdText text={inhalt.texte.urbanMiningIndex} /></span>
              <strong className="text-base font-black text-slate-800 font-mono">{formatDeZahl(ergebnis.umi, 0)}%</strong>
              <span className="text-[8.5px] text-slate-500 block">Zirkularität</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="text-[9.5px] uppercase font-bold text-slate-400 block font-mono"><MdText text={inhalt.texte.biogenerPuffer} /></span>
              <strong className="text-base font-black text-emerald-700 font-mono">{formatDeZahl(ergebnis.biogenGespeichert / 1000, 1)} t</strong>
              <span className="text-[8.5px] text-slate-500 block">CO₂-Speicher</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="text-[9.5px] uppercase font-bold text-slate-400 block font-mono">Primärenergie</span>
              <strong className="text-base font-black text-slate-800 font-mono">{formatDeZahl(ergebnis.penrtKwhJeM2a, 1)}</strong>
              <span className="text-[8.5px] text-slate-500 block"><MdText text={inhalt.texte.kwhMAPenrt} /></span>
            </div>
          </div>

          {/* Module je m² NRF(R) und Jahr */}
          <div className="space-y-3 pt-1">
            <span className="text-[10.5px] font-extrabold text-slate-700 block uppercase tracking-wide font-mono"><MdText text={inhalt.texte.coBilanzNachLebenszyklusphasen} /></span>
            <div className="space-y-2.5">
              {phasen.map((phase) => {
                const pct = Math.min(50, (Math.abs(phase.value) / maxAbs) * 50);
                const negativ = phase.value < 0;
                return (
                  <div key={phase.label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600 font-medium">{phase.label}</span>
                      <strong className={`font-mono ${negativ ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {phase.aktiv ? `${phase.value > 0 ? '+' : ''}${formatDeZahl(phase.value, 2)}` : inhalt.werte.nichtBilanziert}
                      </strong>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full w-full overflow-hidden relative border border-slate-200">
                      {phase.aktiv && (
                        <div
                          className={`absolute top-0 h-full ${phase.colorClass} rounded-full transition-all duration-300`}
                          style={negativ ? { right: '50%', width: `${pct}%` } : { left: '50%', width: `${pct}%` }}
                        />
                      )}
                      <span className="absolute left-[50%] top-0 w-[1px] h-full bg-slate-350" />
                    </div>
                    <span className="text-[9px] text-slate-400 leading-none block italic">{phase.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t pt-3 flex justify-between items-center gap-2 text-xs text-slate-700">
            <span className="font-semibold"><MdText text={inhalt.texte.nettobilanzCoAusstoßA1} /></span>
            <strong className="font-mono text-sm font-black text-slate-900 shrink-0">
              {formatDeZahl(summe, 0)} kg CO₂-eq
            </strong>
          </div>

          {/* Rechenweg deklarierte Einheit → Bezugsgröße (nur Anzeige; Zahlen aus lcaBilanz) */}
          <details className="border-t pt-3 text-[11px] text-slate-700" data-testid="rechenweg-bezug">
            <summary className="cursor-pointer font-bold text-slate-800">{inhalt.texte.rechenwegTitel}</summary>
            <p className="mt-2 leading-relaxed"><MdText text={inhalt.texte.rechenwegText} /></p>
            <ul className="mt-2 space-y-1.5" aria-label={inhalt.werte.rwCaption}>
              {ergebnis.zeilen.map((z, i) => (
                <li key={`${z.id}-${i}`} className="border-b border-slate-100 pb-1">
                  <span className="block font-medium text-slate-800">{namen[z.id] ?? z.id}</span>
                  <span className="block font-mono text-[10.5px] text-slate-700">
                    {formatDeZahl(z.menge, 2)} {z.einheit} → {formatDeZahl(z.a1a3 + z.c, 0)} · (1 + {formatDeZahl(z.ersatz, 0)}) = <strong>{formatDeZahl(z.a1a3 + z.c + z.b4, 0)} kg</strong>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 font-mono leading-relaxed">
              {inhalt.werte.rwKonstruktion}: {formatDeZahl(ergebnis.a1a3 + ergebnis.c3c4 + ergebnis.b4, 0)} + {formatDeZahl(ergebnis.sockelTga, 0)} = {formatDeZahl(ergebnis.a1a3 + ergebnis.c3c4 + ergebnis.b4 + ergebnis.sockelTga, 0)} kg CO₂-Äq.
              {' '}÷ ({formatDeZahl(nrfR, 0)} m² · {formatDeZahl(betrachtungszeitraum, 0)} a) = <strong>{formatDeZahl(s.konstruktion, 2)} kg CO₂-Äq./(m²·a)</strong> {inhalt.werte.rwJeFlaeche}
              {ergebnis.enthaeltB6 && <>; {inhalt.werte.rwMitB6}: {formatDeZahl(s.konstruktion, 2)} + {formatDeZahl(s.b6, 2)} = <strong>{formatDeZahl(s.qng, 2)}</strong></>}
            </p>
          </details>

          {ergebnis.vorlaeufig.length > 0 && (
            <div className="text-[10px] text-slate-500 leading-snug border-t pt-2">
              <strong className="block text-slate-600"><MdText text={inhalt.texte.vorlaeufigTitel} /></strong>
              <ul className="list-disc pl-4 space-y-0.5 mt-1">
                {ergebnis.vorlaeufig.map(v => <li key={v}>{v}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
