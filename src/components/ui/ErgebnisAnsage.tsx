import React, { useEffect, useId, useSyncExternalStore } from 'react';

/**
 * Kurze Statusmeldung des Hauptergebnisses eines Rechners für Screenreader (WCAG 4.1.3, aria-live="polite").
 * Unsichtbar; angesagt wird erst, wenn sich die Texte `ANSAGE_RUHE` ms nicht mehr geändert haben – beim Ziehen
 * eines Reglers also einmal nach dem Loslassen bzw. nach der letzten Pfeiltaste, nicht bei jedem Zwischenwert.
 * Der erste Text jeder Ansage wird nicht angesagt (Seitenaufbau). Höchstens ein bis zwei Sätze, keine Tabellen.
 *
 *   <ErgebnisAnsage text={`U-Wert ${formatDeZahl(u, 2)} W/(m²K)`} />
 *
 * Bündelung (Kleinpunkte 04.11.2026): Alle Ansagen einer Seite (Modul bzw. Reiter) laufen über ein gemeinsames
 * Bündel. Ändert eine Eingabe mehrere Rechenweg-Boxen zugleich, gibt es nach der Ruhezeit EINE Meldung: das erste
 * geänderte Ergebnis (in Seitenreihenfolge) und die Zahl der weiteren („… und 2 weitere Ergebnisse aktualisiert“).
 * Gesprochen wird nur aus einer Live-Region – der des ersten geänderten Ergebnisses (sichtbar, weil es sich gerade
 * geändert hat); alle übrigen Regionen bleiben leer.
 */
export const ANSAGE_MAX = 300;
/** Ruhezeit in ms bis zur Ansage */
export const ANSAGE_RUHE = 700;

/** Text für die Ansage: Leerraum zusammengefasst, höchstens ANSAGE_MAX Zeichen. Exportiert für Tests. */
export function ansageText(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > ANSAGE_MAX ? `${t.slice(0, ANSAGE_MAX - 1).trimEnd()}…` : t;
}

/** Meldung aus den geänderten Texten (in Seitenreihenfolge). Exportiert für Tests. */
export function buendelText(geaendert: readonly string[]): string {
  if (!geaendert.length) return '';
  const weitere = geaendert.length - 1;
  if (!weitere) return ansageText(geaendert[0]);
  const zusatz = ` – und ${weitere} ${weitere === 1 ? 'weiteres Ergebnis' : 'weitere Ergebnisse'} aktualisiert`;
  const kopf = ansageText(geaendert[0]);
  const platz = ANSAGE_MAX - zusatz.length;
  return `${kopf.length > platz ? `${kopf.slice(0, platz - 1).trimEnd()}…` : kopf}${zusatz}`;
}

interface Planer { setTimeout: (f: () => void, ms: number) => number; clearTimeout: (id: number) => void }

/**
 * Gemeinsames Bündel aller Ansagen (reine Logik ohne DOM, Zeitgeber austauschbar – tests/kleinpunkte1104.test.ts).
 * `melde(id, text)` nach jeder Textänderung; nach `ruhe` ms ohne weitere Meldung wird `angesagt` gesetzt.
 */
export function erzeugeAnsageBuendel(ruhe = ANSAGE_RUHE, planer: Planer = {
  setTimeout: (f, ms) => window.setTimeout(f, ms), clearTimeout: id => window.clearTimeout(id),
}) {
  const reihe: string[] = [];                                  // eingehängte Ansagen in Einhängereihenfolge
  const erster = new Map<string, string>();                    // Text beim Einhängen (wird nicht angesagt)
  const aktiv = new Set<string>();                             // hat sich seit dem Einhängen schon geändert
  const offen = new Map<string, string>();                     // seit der letzten Ansage geändert
  const hoerer = new Set<() => void>();
  let angesagt = '';
  let sprecher: string | undefined;                            // Region, die die letzte Meldung trägt
  let zeit: number | undefined;
  const melden = () => hoerer.forEach(h => h());
  const sprich = () => {
    zeit = undefined;
    const ids = reihe.filter(id => offen.has(id));
    const texte = ids.map(id => offen.get(id)!);
    offen.clear();
    if (!texte.length) return;
    sprecher = ids[0];
    angesagt = buendelText(texte);
    melden();
  };
  return {
    anmelden(id: string, text: string) {
      if (!reihe.includes(id)) reihe.push(id);
      erster.set(id, ansageText(text));
      melden();
    },
    abmelden(id: string) {
      const warSprecher = sprecher === id;
      const i = reihe.indexOf(id);
      if (i >= 0) reihe.splice(i, 1);
      erster.delete(id); aktiv.delete(id); offen.delete(id);
      if (warSprecher) { angesagt = ''; sprecher = undefined; }
      melden();
    },
    melde(id: string, text: string) {
      const t = ansageText(text);
      if (!aktiv.has(id)) {
        if (t === erster.get(id)) return;                      // Seitenaufbau bzw. unverändert
        aktiv.add(id);
      }
      offen.set(id, t);
      if (zeit !== undefined) planer.clearTimeout(zeit);
      zeit = planer.setTimeout(sprich, ruhe);
    },
    sprecher: () => sprecher,
    angesagt: () => angesagt,
    abonniere(h: () => void) { hoerer.add(h); return () => { hoerer.delete(h); }; },
  };
}

let buendel: ReturnType<typeof erzeugeAnsageBuendel> | undefined;
const seitenBuendel = () => (buendel ??= erzeugeAnsageBuendel());
const ohneBuendel = () => () => {};

export function ErgebnisAnsage({ text }: { text: string }) {
  const id = useId();
  const b = typeof window === 'undefined' ? undefined : seitenBuendel();
  useEffect(() => {
    if (!b) return;
    b.anmelden(id, text);
    return () => b.abmelden(id);
    // nur beim Ein-/Aushängen (Text beim Einhängen gilt als Seitenaufbau); Textänderungen meldet der zweite Effekt
  }, [b, id]);
  useEffect(() => { b?.melde(id, text); }, [b, id, text]);
  const inhalt = useSyncExternalStore(
    b ? b.abonniere : ohneBuendel,
    () => (b && b.sprecher() === id ? b.angesagt() : ''),
    () => '',
  );
  return <p role="status" aria-live="polite" aria-atomic="true" className="sr-only" data-ergebnis-ansage="">{inhalt}</p>;
}

export default ErgebnisAnsage;
