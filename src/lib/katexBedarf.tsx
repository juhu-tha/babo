// KaTeX bei Bedarf (Phase 5, AP 5.5): Ersatz für 'react-katex' im Browser-Bundle.
// Das Vite-Plugin scripts/bedarfsLaden.ts lenkt Importe von 'react-katex' aus src/ hierher um;
// die Module bleiben unverändert (Tests unter tsx nutzen weiter das echte react-katex).
// KaTeX (~77 kB gzip) wird erst geladen, wenn eine Formel in die Nähe des Bildausschnitts kommt (Einzelheiten
// unten bei „Wann laden“), und blockiert das erste Rendern der Modulseite nicht. Bis dahin steht ein Platzhalter mit dem TeX-Quelltext (Screenreader/
// Kopieren); danach rendern alle Formeln als Transition (unterbrechbar). Das KaTeX-CSS bleibt im Haupt-CSS
// (src/main.tsx): Ein später eingefügtes Stylesheet kostete eine Stil-/Layout-Neuberechnung der ganzen Seite.
import React from 'react';
import { flushSync } from 'react-dom';
import type * as ReactKatex from 'react-katex';
import { beimDrucken, STUFE } from './druckVorbereitung';

type Bibliothek = typeof ReactKatex;
type MathProps = React.ComponentProps<Bibliothek['InlineMath']>;
const tex = (p: MathProps) => String(('math' in p && p.math) || ('children' in p && p.children) || '');

let bibliothek: Bibliothek | undefined;
let laden: Promise<Bibliothek> | undefined;
/** Formeln, die noch den Platzhalter zeigen (bis sie mit KaTeX gerendert sind) */
const offen = new Set<() => void>();

export function ladeKatex(): Promise<Bibliothek> {
  // diese Datei ist von der Umlenkung ausgenommen → echtes react-katex
  laden ??= (import('react-katex') as Promise<Partial<Bibliothek> & { default?: Bibliothek }>).then(m => {
    bibliothek = (m.InlineMath ? m : m.default) as Bibliothek;
    // als Transition: React rendert die Formeln unterbrechbar (in kurzen Abschnitten statt einer langen Task)
    React.startTransition(() => offen.forEach(f => f()));
    return bibliothek;
  });
  return laden;
}
// Wann laden (TBT 04.11.2026, docs/pruefung/perf-tbt-2026-11-04.md): Auswerten des KaTeX-Chunks kostet unter
// 4× CPU-Drosselung eine Task von ≈ 80–90 ms, das Rendern der Formeln weitere. Deshalb nicht mehr sofort, sobald
// ein Chunk mit Formeln läuft, sondern
//   - sobald ein Platzhalter in die Nähe des Bildausschnitts kommt (eine Bildschirmhöhe voraus),
//   - bei der ersten Tastatureingabe (Tastatur- und Screenreader-Nutzung, auch Strg+P),
//   - spätestens, wenn die Seite nach dem Laden ruht (Leerlauf), damit Drucken und Suchen alle Formeln finden,
//   - vor dem Drucken bzw. PDF-Export (beimDrucken unten).
// Bis dahin steht wie bisher der Platzhalter mit dem TeX-Quelltext (gleiche Zeilenhöhe).
const starten = () => { void ladeKatex().catch(() => { laden = undefined; }); };
const beobachter = new Map<Element | null, IntersectionObserver>();
function beobachte(el: Element): () => void {
  if (laden) return () => {};
  if (typeof IntersectionObserver !== 'function') { starten(); return () => {}; }
  // Inhalt scrollt in <main id="scroll-container">: dort gilt der Vorlauf (am Fenster würde er abgeschnitten)
  const wurzel = el.closest('#scroll-container');
  let io = beobachter.get(wurzel);
  if (!io) {
    io = new IntersectionObserver(eintraege => {
      if (!eintraege.some(e => e.isIntersecting)) return;
      beobachter.forEach(b => b.disconnect());
      beobachter.clear();
      starten();
    }, { root: wurzel, rootMargin: '100% 0px' });
    beobachter.set(wurzel, io);
  }
  io.observe(el);
  return () => io.unobserve(el);
}
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', starten, { once: true, capture: true });
  const ruhe = () => {
    const idle = (f: () => void) => (typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(f, { timeout: 5000 }) : window.setTimeout(f, 200));
    window.setTimeout(() => idle(starten), 3000);
  };
  if (document.readyState === 'complete') ruhe(); else window.addEventListener('load', ruhe, { once: true });
}

function useKatex(platz: React.RefObject<HTMLSpanElement | null>): Bibliothek | undefined {
  const [, neu] = React.useReducer((n: number) => n + 1, 0);
  const gerendert = bibliothek;
  React.useEffect(() => {
    if (gerendert) return;
    if (bibliothek) { neu(); return; } // zwischen Rendern und Effekt geladen
    offen.add(neu);
    const el = platz.current;
    const austragen = el ? beobachte(el) : (starten(), () => {});
    return () => { offen.delete(neu); austragen(); }; // mit KaTeX neu gerendert oder ausgehängt
  }, [gerendert, platz]);
  return bibliothek;
}

// Drucken/PDF-Export: Die Transition nach dem Laden kann noch ausstehen → offene Formeln sofort (synchron) rendern
const alleRendern = () => { if (bibliothek && offen.size) flushSync(() => offen.forEach(f => f())); };
beimDrucken(STUFE.formeln, alleRendern, async () => { if (offen.size) { await ladeKatex(); alleRendern(); } });

function platzhalter(tex: string, block: boolean, ref: React.RefObject<HTMLSpanElement | null>) {
  // gleiche Schriftgröße wie .katex (1.21em) – hält Zeilenhöhe und -umbruch ähnlich
  return block
    ? <span ref={ref} className="katex-platzhalter block text-center my-[1em] min-h-[1.6em] text-[1.1em] text-text-main/50" data-tex={tex}>{tex}</span>
    : <span ref={ref} className="katex-platzhalter text-text-main/50" data-tex={tex}>{tex}</span>;
}

export function InlineMath(props: MathProps) {
  const platz = React.useRef<HTMLSpanElement>(null);
  const b = useKatex(platz);
  return b ? <b.InlineMath {...props} /> : platzhalter(tex(props), false, platz);
}

export function BlockMath(props: MathProps) {
  const platz = React.useRef<HTMLSpanElement>(null);
  const b = useKatex(platz);
  return b ? <b.BlockMath {...props} /> : platzhalter(tex(props), true, platz);
}
