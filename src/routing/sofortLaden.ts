// React.lazy mit Vorladen (Z52): Eine vorgerenderte Modulseite (dist/modul/<id>.html, scripts/vorrendern.ts)
// soll beim Übernehmen durch React nicht kurz den Suspense-Platzhalter (Spinner) zeigen. React.lazy wartet
// aber auch bei schon geladenem Chunk mindestens einen Mikrotask und rendert dann den Platzhalter.
// lazySofort merkt sich das geladene Modul und gibt es beim ersten Rendern synchron zurück, wenn
// vorladen() vorher abgeschlossen ist. Ohne Vorladen verhält es sich wie React.lazy.
import React, { type ReactNode } from 'react';

type Lader<T> = () => Promise<{ default: T }>;
/** Komponententyp, den React.lazy annimmt (ComponentType<any>, ohne `any` im Quelltext) */
type LazyKomponente = Awaited<ReturnType<Parameters<typeof React.lazy>[0]>>['default'];
const VORLADER = new WeakMap<object, () => Promise<unknown>>();

export function lazySofort<T extends LazyKomponente>(lade: Lader<T>): React.LazyExoticComponent<T> & { vorladen: () => Promise<{ default: T }> } {
  let modul: { default: T } | undefined;
  let laufend: Promise<{ default: T }> | undefined;
  const vorladen = () => (laufend ??= lade().then(m => (modul = m), f => { laufend = undefined; throw f; }));
  const komponente = React.lazy<T>(() => (modul
    // synchron aufgelöstes „Thenable“: React übernimmt den Wert ohne Platzhalter
    ? ({ then: (ok: (m: { default: T }) => void) => ok(modul!) } as unknown as Promise<{ default: T }>)
    : vorladen()));
  VORLADER.set(komponente, vorladen);
  return Object.assign(komponente, { vorladen });
}

/** Stellvertreter für `React` in src/routing/ModulInhalt.tsx: Die Zeilen bleiben `React.lazy(() => import('…'))`
 * (Parser in scripts/modulVorladen.ts, scripts/qa/a11y-routen.mjs, tests/hilfen/fliesstext.ts). */
export const SofortReact = { lazy: lazySofort };

/** Alle lazySofort-Komponenten in einem Elementbaum vorladen (z. B. ModulInhalt({ activeTab }) ohne Rendern) */
export function vorladenFuer(knoten: ReactNode): Promise<unknown> {
  const auftraege: Promise<unknown>[] = [];
  const besuche = (k: ReactNode) => {
    if (Array.isArray(k)) { k.forEach(besuche); return; }
    if (!React.isValidElement(k)) return;
    const vorladen = typeof k.type === 'object' && k.type !== null ? VORLADER.get(k.type) : undefined;
    if (vorladen) auftraege.push(vorladen());
    besuche((k.props as { children?: ReactNode }).children);
  };
  besuche(knoten);
  return Promise.all(auftraege);
}
