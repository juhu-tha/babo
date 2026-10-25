// KaTeX bei Bedarf (Phase 5, AP 5.5): Ersatz für 'react-katex' im Browser-Bundle.
// Das Vite-Plugin scripts/bedarfsLaden.ts lenkt Importe von 'react-katex' aus src/ hierher um;
// die Module bleiben unverändert (Tests unter tsx nutzen weiter das echte react-katex).
// KaTeX (~77 kB gzip) wird erst geladen, wenn ein Chunk mit Formeln ausgeführt wird, und blockiert das
// erste Rendern der Modulseite nicht. Bis dahin steht ein Platzhalter mit dem TeX-Quelltext (Screenreader/
// Kopieren); danach rendern alle Formeln als Transition (unterbrechbar). Das KaTeX-CSS bleibt im Haupt-CSS
// (src/main.tsx): Ein später eingefügtes Stylesheet kostete eine Stil-/Layout-Neuberechnung der ganzen Seite.
import React from 'react';
import type * as ReactKatex from 'react-katex';

type Bibliothek = typeof ReactKatex;
type MathProps = React.ComponentProps<Bibliothek['InlineMath']>;
const tex = (p: MathProps) => String(('math' in p && p.math) || ('children' in p && p.children) || '');

let bibliothek: Bibliothek | undefined;
let laden: Promise<Bibliothek> | undefined;
const warten = new Set<() => void>();

export function ladeKatex(): Promise<Bibliothek> {
  // diese Datei ist von der Umlenkung ausgenommen → echtes react-katex
  laden ??= (import('react-katex') as Promise<Partial<Bibliothek> & { default?: Bibliothek }>).then(m => {
    bibliothek = (m.InlineMath ? m : m.default) as Bibliothek;
    // als Transition: React rendert die Formeln unterbrechbar (in kurzen Abschnitten statt einer langen Task)
    React.startTransition(() => warten.forEach(f => f()));
    warten.clear();
    return bibliothek;
  });
  return laden;
}
// sofort anstoßen: sobald ein Chunk mit Formeln läuft, wird KaTeX gebraucht
if (typeof window !== 'undefined') void ladeKatex().catch(() => { laden = undefined; });

function useKatex(): Bibliothek | undefined {
  const [, neu] = React.useReducer((n: number) => n + 1, 0);
  const gerendert = bibliothek;
  React.useEffect(() => {
    if (bibliothek) { if (!gerendert) neu(); return; } // zwischen Rendern und Effekt geladen
    warten.add(neu);
    void ladeKatex().catch(() => {});
    return () => { warten.delete(neu); };
  }, []);
  return bibliothek;
}

function platzhalter(tex: string, block: boolean) {
  // gleiche Schriftgröße wie .katex (1.21em) – hält Zeilenhöhe und -umbruch ähnlich
  return block
    ? <span className="katex-platzhalter block text-center my-[1em] min-h-[1.6em] text-[1.1em] text-text-main/50" data-tex={tex}>{tex}</span>
    : <span className="katex-platzhalter text-text-main/50" data-tex={tex}>{tex}</span>;
}

export function InlineMath(props: MathProps) {
  const b = useKatex();
  return b ? <b.InlineMath {...props} /> : platzhalter(tex(props), false);
}

export function BlockMath(props: MathProps) {
  const b = useKatex();
  return b ? <b.BlockMath {...props} /> : platzhalter(tex(props), true);
}
