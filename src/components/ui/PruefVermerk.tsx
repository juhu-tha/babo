import React from 'react';
import { BadgeCheck, CircleDashed, RefreshCw } from 'lucide-react';
import { datumDe, type Pruefvermerk } from '@/src/data/pruefvermerke';

/** Öffentlich angezeigt werden nur freigegebene bzw. nachzuprüfende Module; „offen“ bleibt ausgeblendet
 *  (Entscheidung 27.10.2026; die Admin-Ansicht „Meine Module“ listet offene weiterhin). */
export const vermerkOeffentlich = (vermerk: Pruefvermerk | undefined): boolean => !!vermerk && vermerk.status !== 'offen';

/** Zeile „Fachlich geprüft am …“ (mit „von …“ nur, wenn eine Person eingetragen ist) im Kopf jedes Fachmoduls (Umsetzungsplan Phase 6, AP 6.6) */
export function PruefVermerk({ vermerk }: { vermerk: Pruefvermerk }) {
  if (!vermerkOeffentlich(vermerk)) return null;
  const geprueft = vermerk.status === 'geprueft' && !!vermerk.am;
  const nach = vermerk.status === 're-review';
  const Icon = geprueft ? BadgeCheck : nach ? RefreshCw : CircleDashed;
  const farbe = geprueft
    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
    : nach
      ? 'border-amber-300 bg-amber-50 text-amber-950'
      : 'border-home-grau/30 bg-off-white text-text-main/80';
  let text: string;
  if (geprueft) text = `Fachlich geprüft am ${datumDe(vermerk.am)}${vermerk.von ? ` von ${vermerk.von}` : ''}`;
  else if (nach) text = `Fachliche Nachprüfung erforderlich${vermerk.am && vermerk.von ? ` (zuletzt geprüft am ${datumDe(vermerk.am)} von ${vermerk.von})` : ''}`;
  else text = 'Fachliche Prüfung ausstehend';
  return (
    <p role="note" className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold ${farbe}`} data-pruefstatus={vermerk.status}>
      <Icon size={14} aria-hidden="true" /> {text}
    </p>
  );
}

export default PruefVermerk;
