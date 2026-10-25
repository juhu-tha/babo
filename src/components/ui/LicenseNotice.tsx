import React from 'react';
import { LIZENZ, LIZENZ_AKTIV, LIZENZ_AUSNAHMEN } from '@/src/data/lizenz';

interface LicenseNoticeProps {
  /** Nur für Tests: überschreibt den Schalter LIZENZ_AKTIV (src/data/lizenz.ts) */
  aktiv?: boolean;
}

/**
 * Lizenzhinweis für die Fußzeile jeder Seite (AP 6.8). Rendert nichts, solange LIZENZ_AKTIV = false.
 * Text: Namensnennung nach CC-Empfehlung (Titel, Urheber, Quelle, Lizenz) plus Ausnahmen für Inhalte Dritter.
 */
export function LicenseNotice({ aktiv = LIZENZ_AKTIV }: LicenseNoticeProps) {
  if (!aktiv) return null;
  const { werk, werkUrl, urheber, einrichtung, inhalte, code } = LIZENZ;
  return (
    <p className="mt-2 max-w-3xl mx-auto leading-relaxed" data-lizenzhinweis="">
      Inhalte: <a href={werkUrl} className="underline">{werk}</a> von {urheber} ({einrichtung}),{' '}
      lizenziert unter{' '}
      <a href={inhalte.url} rel="license noopener noreferrer" target="_blank" className="underline" title={inhalte.name}>
        {inhalte.kurz}
      </a>
      {' '}· Code:{' '}
      <a href={code.url} rel="noopener noreferrer" target="_blank" className="underline">{code.kurz}</a>.{' '}
      <span>{LIZENZ_AUSNAHMEN}</span>
    </p>
  );
}

export default LicenseNotice;
