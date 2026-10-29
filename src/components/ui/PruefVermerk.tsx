import React, { useId, useState } from 'react';
import { BadgeCheck, CircleDashed, Info, RefreshCw } from 'lucide-react';
import type { Pruefvermerk } from '@/src/data/pruefvermerke';
import { PRUEFVERFAHREN_HINWEIS, istGeprueft, pruefvermerkText } from './pruefvermerkText';

/** Öffentlich angezeigt werden im Kopf nur freigegebene bzw. nachzuprüfende Module; „offen“ bleibt dort ausgeblendet
 *  (Entscheidung 27.10.2026). Die Fußzeile nennt dann neutral „Fachliche Prüfung in Bearbeitung“;
 *  die Admin-Ansicht „Meine Module“ listet offene weiterhin. */
export const vermerkOeffentlich = (vermerk: Pruefvermerk | undefined): boolean => !!vermerk && vermerk.status !== 'offen';

/** Info-Schaltfläche am Vermerk: ein Satz zum Prüfverfahren (Tooltip und aufklappbarer Text, Gutachten 29.10.2026) */
export function PruefverfahrenHinweis({ className = '' }: { className?: string }) {
  const [offen, setOffen] = useState(false);
  const id = useId();
  return (
    <>
      <button
        type="button"
        onClick={() => setOffen(o => !o)}
        aria-expanded={offen}
        aria-controls={id}
        title={PRUEFVERFAHREN_HINWEIS}
        className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded-md hover:text-shiraz cursor-pointer ${className}`}
      >
        <Info size={14} aria-hidden="true" />
        <span className="sr-only">Hinweis zum Prüfverfahren</span>
      </button>
      <span id={id} hidden={!offen} className="ml-1 basis-full font-normal" data-pruefverfahren="">
        {PRUEFVERFAHREN_HINWEIS}
      </span>
    </>
  );
}

/** Zeile „Fachlich geprüft am …“ (mit „von …“ nur, wenn eine Person eingetragen ist) im Kopf jedes Fachmoduls (Umsetzungsplan Phase 6, AP 6.6).
 *  Text aus pruefvermerkText() – dieselbe Formulierung wie in der Fußzeile (ModuleFooter). */
export function PruefVermerk({ vermerk }: { vermerk: Pruefvermerk }) {
  if (!vermerkOeffentlich(vermerk)) return null;
  const geprueft = istGeprueft(vermerk);
  const nach = vermerk.status === 're-review';
  const Icon = geprueft ? BadgeCheck : nach ? RefreshCw : CircleDashed;
  const farbe = geprueft
    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
    : nach
      ? 'border-amber-300 bg-amber-50 text-amber-950'
      : 'border-home-grau/30 bg-off-white text-text-main/80';
  return (
    <div role="note" className={`mb-4 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-3 py-1.5 text-xs font-semibold ${farbe}`} data-pruefstatus={vermerk.status}>
      <Icon size={14} aria-hidden="true" /><span data-pruefvermerk="kopf">{pruefvermerkText(vermerk)}</span>
      {(geprueft || nach) && <PruefverfahrenHinweis />}
    </div>
  );
}

export default PruefVermerk;
