/**
 * Volltextsuche über den Inhalt aller Module (Umsetzungsplan Phase 2, AP 2.9).
 * Der Index (public/suchindex.json) wird mit scripts/gen-suchindex.mjs aus der gerenderten App erzeugt
 * und erst beim ersten Suchen geladen.
 */
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

const norm = (s: string) => s.toLowerCase().normalize('NFC');

/** Bewertet Module: Titel 10, Überschrift 5, Wort im Text 2, Teilwort 1 – je Suchbegriff; alle Begriffe müssen vorkommen. */
export function suche(index: IndexEintrag[], anfrage: string, titel: (id: string) => string, max = 12): Treffer[] {
  const begriffe = norm(anfrage).split(/\s+/).filter(b => b.length >= 2);
  if (!begriffe.length) return [];
  const treffer: Treffer[] = [];
  for (const e of index) {
    const t = norm(titel(e.id));
    const hs = e.h.map(norm);
    const woerter = ' ' + e.w + ' ';
    let punkte = 0;
    let allesGefunden = true;
    for (const b of begriffe) {
      let p = 0;
      if (t.includes(b)) p += 10;
      if (hs.some(h => h.includes(b))) p += 5;
      if (woerter.includes(' ' + b + ' ')) p += 2;
      else if (woerter.includes(b)) p += 1;
      if (!p) { allesGefunden = false; break; }
      punkte += p;
    }
    if (!allesGefunden) continue;
    const text = e.t ?? '';
    const pos = norm(text).indexOf(begriffe[0]);
    const start = Math.max(0, pos - 60);
    const ausschnitt = pos >= 0 ? (start > 0 ? '…' : '') + text.slice(start, pos + 100).trim() + '…' : '';
    const ueberschrift = e.h.find(h => norm(h).includes(begriffe[0]));
    treffer.push({ id: e.id, punkte, ausschnitt, ueberschrift });
  }
  return treffer.sort((a, b) => b.punkte - a.punkte).slice(0, max);
}
