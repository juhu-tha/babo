/**
 * Volltextsuche über den Inhalt aller Module (Umsetzungsplan Phase 2, AP 2.9).
 * Der Index (public/suchindex.json) wird mit scripts/gen-suchindex.mjs aus der gerenderten App erzeugt
 * und erst beim ersten Suchen geladen.
 * Schreibvarianten und Synonyme (Gesamtgutachten 03.11.2026): ./suchNormalisierung.ts.
 */
import { falte, zerlege, vergleichstext, enthaelt, type Suchbegriff, type Vergleichstext } from './suchNormalisierung';

export interface IndexEintrag { id: string; h: string[]; w: string; t?: string }
export interface Treffer { id: string; punkte: number; ausschnitt: string; ueberschrift?: string }

let ladeVersprechen: Promise<IndexEintrag[]> | null = null;
export function ladeSuchindex(): Promise<IndexEintrag[]> {
  if (!ladeVersprechen) {
    ladeVersprechen = fetch('/suchindex.json')
      .then(r => (r.ok ? r.json() : { module: [] }))
      .then(d => (Array.isArray(d.module) ? d.module : []))
      .catch(() => { ladeVersprechen = null; return []; });
  }
  return ladeVersprechen;
}

/** Vorbereiteter Eintrag: Überschriften und Wörter gefaltet, Wörter ohne Bindestrich (je Wort, Leerzeichen bleiben) */
interface Vorbereitet { h: Vergleichstext[]; wk: string }
const cache = new WeakMap<IndexEintrag, Vorbereitet>();
function vorbereitet(e: IndexEintrag): Vorbereitet {
  let v = cache.get(e);
  if (!v) {
    v = { h: e.h.map(vergleichstext), wk: (' ' + falte(e.w) + ' ').replace(/-/g, '') };
    cache.set(e, v);
  }
  return v;
}

const regexSicher = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wortpunkte: ganzes Wort 2, Teilwort 1, sonst 0 */
function wortPunkte(v: Vorbereitet, b: Suchbegriff): number {
  let p = 0;
  for (const f of b.formen) {
    if (v.wk.includes(' ' + f + ' ')) return 2;
    if (v.wk.includes(f)) p = 1;
  }
  for (const f of b.woerter) if (new RegExp(`\\s${regexSicher(f)}\\d*\\s`).test(v.wk)) return 2;
  return p;
}

/**
 * Bewertet Module: Titel 10, Überschrift 5, Wort im Text 2, Teilwort 1 – je Suchbegriff; Zielmodul eines Synonyms +10.
 * Alle Begriffe müssen vorkommen (im Zielmodul eines Synonyms gilt der Begriff als vorhanden).
 */
export function suche(index: IndexEintrag[], anfrage: string, titel: (id: string) => string, max = 12): Treffer[] {
  const begriffe = zerlege(anfrage);
  if (!begriffe.length) return [];
  const erster = begriffe[0];
  const treffer: Treffer[] = [];
  for (const e of index) {
    const v = vorbereitet(e);
    const t = vergleichstext(titel(e.id));
    let punkte = 0;
    let allesGefunden = true;
    for (const b of begriffe) {
      let p = 0;
      if (enthaelt(t, b)) p += 10;
      if (v.h.some(h => enthaelt(h, b))) p += 5;
      p += wortPunkte(v, b);
      if (b.ziele.has(e.id)) p += 10;
      if (!p) { allesGefunden = false; break; }
      punkte += p;
    }
    if (!allesGefunden) continue;
    // Ausschnitt um die erste Fundstelle des ersten Begriffs (eingegebene Form, sonst eine Variante)
    const text = e.t ?? '';
    const tl = text.toLowerCase();
    const kandidaten = [anfrage.trim().split(/\s+/)[0]?.toLowerCase() ?? '', erster.roh, ...erster.formen].filter(f => f.length >= 2);
    const pos = kandidaten.reduce((best, f) => { const i = tl.indexOf(f); return i >= 0 && (best < 0 || i < best) ? i : best; }, -1);
    const start = Math.max(0, pos - 60);
    const ausschnitt = pos >= 0 ? (start > 0 ? '…' : '') + text.slice(start, pos + 100).trim() + '…' : '';
    const ueberschrift = e.h.find(h => enthaelt(vergleichstext(h), erster));
    treffer.push({ id: e.id, punkte, ausschnitt, ueberschrift });
  }
  return treffer.sort((a, b) => b.punkte - a.punkte).slice(0, max);
}
