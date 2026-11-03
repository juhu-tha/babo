import React, { useEffect, useState } from 'react';

/**
 * Kurze Statusmeldung des Hauptergebnisses eines Rechners für Screenreader (WCAG 4.1.3, aria-live="polite").
 * Unsichtbar; angesagt wird erst, wenn sich der Text `verzoegerung` ms nicht mehr geändert hat – beim Ziehen
 * eines Reglers also einmal nach dem Loslassen bzw. nach der letzten Pfeiltaste, nicht bei jedem Zwischenwert.
 * Der erste Text wird nicht angesagt (Seitenaufbau). Höchstens ein bis zwei Sätze, keine Tabellen.
 *
 *   <ErgebnisAnsage text={`U-Wert ${formatDeZahl(u, 2)} W/(m²K)`} />
 */
export const ANSAGE_MAX = 300;

/** Text für die Ansage: Leerraum zusammengefasst, höchstens ANSAGE_MAX Zeichen. Exportiert für Tests. */
export function ansageText(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > ANSAGE_MAX ? `${t.slice(0, ANSAGE_MAX - 1).trimEnd()}…` : t;
}

export function ErgebnisAnsage({ text, verzoegerung = 700 }: { text: string; verzoegerung?: number }) {
  const [angesagt, setAngesagt] = useState('');
  const [erster] = useState(() => ansageText(text));
  useEffect(() => {
    const t = ansageText(text);
    if (t === erster && !angesagt) return; // Seitenaufbau: nichts ansagen
    const zeit = window.setTimeout(() => setAngesagt(t), verzoegerung);
    return () => window.clearTimeout(zeit);
  }, [text, verzoegerung, erster, angesagt]);
  return <p role="status" aria-live="polite" aria-atomic="true" className="sr-only" data-ergebnis-ansage="">{angesagt}</p>;
}

export default ErgebnisAnsage;
