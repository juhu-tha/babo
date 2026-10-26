// Inline-Markdown für ausgelagerte Fachtexte (Umsetzungsplan Phase 5, AP 5.3) – ohne Abhängigkeiten.
// Texte unter content/<modul>/<Datei>.json („texte“) werden mit <MdText> gerendert; dieses Modul
// zerlegt sie in Knoten. Bewusst klein gehalten (Syntax siehe docs/architektur.md, „Inhalte bearbeiten“):
//   **fett**   *kursiv*   `code`   $TeX$ (InlineMath)   <sub>…</sub>   <sup>…</sup>   <br>   [Text](URL)
// Ein Backslash hebt die Sonderbedeutung des folgenden Zeichens auf: \*  \$  \`  \[  \<  \\
// Die Blockstruktur (Absätze, Listen, Tabellen samt Tailwind-Klassen) bleibt im TSX; Listen und
// Tabellen liegen als JSON-Arrays unter „daten“.

export type MdKnoten =
  | string
  | { typ: 'strong' | 'em' | 'sub' | 'sup'; kinder: MdKnoten[] }
  | { typ: 'code'; text: string }
  | { typ: 'formel'; tex: string }
  | { typ: 'br' }
  | { typ: 'link'; href: string; kinder: MdKnoten[] };

const SONDER = new Set(['\\', '*', '$', '`', '[', '<']);
const LEER = /\s/;

/** Zerlegt einen Inline-Markdown-Text in Knoten (Texte benachbart zusammengefasst). */
export function parseMd(text: string): MdKnoten[] {
  return lies(text, 0, null).knoten;
}

type Ende = '**' | '*' | '</sub>' | '</sup>' | ']' | null;

function lies(s: string, start: number, ende: Ende): { knoten: MdKnoten[]; pos: number; geschlossen: boolean } {
  const knoten: MdKnoten[] = [];
  let puffer = '';
  const text = (t: string) => { puffer += t; };
  const knoten_ = (k: MdKnoten) => { if (puffer) { knoten.push(puffer); puffer = ''; } knoten.push(k); };
  let i = start;
  while (i < s.length) {
    // Ende des umschließenden Elements?
    if (ende && s.startsWith(ende, i)) {
      const schliesstEm = ende !== '*' || (i > start && !LEER.test(s[i - 1]) && s[i + 1] !== '*');
      const schliesstStrong = ende !== '**' || (i > start && !LEER.test(s[i - 1]));
      if (schliesstEm && schliesstStrong) {
        if (puffer) knoten.push(puffer);
        return { knoten, pos: i + ende.length, geschlossen: true };
      }
    }
    const c = s[i];
    if (c === '\\' && i + 1 < s.length && SONDER.has(s[i + 1])) { text(s[i + 1]); i += 2; continue; }
    if (c === '*') {
      const doppelt = s[i + 1] === '*';
      const marke: Ende = doppelt ? '**' : '*';
      const nach = s[i + marke.length];
      if (nach !== undefined && !LEER.test(nach) && !(doppelt === false && nach === '*')) {
        const r = lies(s, i + marke.length, marke);
        if (r.geschlossen && r.knoten.length) { knoten_({ typ: doppelt ? 'strong' : 'em', kinder: r.knoten }); i = r.pos; continue; }
      }
      text(marke); i += marke.length; continue;
    }
    if (c === '`') {
      const z = s.indexOf('`', i + 1);
      if (z > i + 1) { knoten_({ typ: 'code', text: s.slice(i + 1, z) }); i = z + 1; continue; }
      text(c); i++; continue;
    }
    if (c === '$') {
      const z = s.indexOf('$', i + 1);
      if (z > i + 1) { knoten_({ typ: 'formel', tex: s.slice(i + 1, z) }); i = z + 1; continue; }
      text(c); i++; continue;
    }
    if (c === '<') {
      if (s.startsWith('<br>', i)) { knoten_({ typ: 'br' }); i += 4; continue; }
      const tag = s.startsWith('<sub>', i) ? 'sub' : s.startsWith('<sup>', i) ? 'sup' : null;
      if (tag) {
        const r = lies(s, i + 5, tag === 'sub' ? '</sub>' : '</sup>');
        if (r.geschlossen) { knoten_({ typ: tag, kinder: r.knoten }); i = r.pos; continue; }
      }
      text(c); i++; continue;
    }
    if (c === '[') {
      const r = lies(s, i + 1, ']');
      if (r.geschlossen && s[r.pos] === '(') {
        const z = s.indexOf(')', r.pos + 1);
        const href = z > r.pos + 1 ? s.slice(r.pos + 1, z) : '';
        if (href && !/\s/.test(href)) { knoten_({ typ: 'link', href, kinder: r.knoten }); i = z + 1; continue; }
      }
      text(c); i++; continue;
    }
    text(c); i++;
  }
  if (puffer) knoten.push(puffer);
  return { knoten, pos: i, geschlossen: false };
}

/** Fasst benachbarte Texte zusammen und entfernt leere – Normalform für Vergleiche. */
export function normalisiereMd(knoten: MdKnoten[]): MdKnoten[] {
  const aus: MdKnoten[] = [];
  for (const k of knoten) {
    const n: MdKnoten = typeof k === 'string' || !('kinder' in k) ? k : { ...k, kinder: normalisiereMd(k.kinder) };
    if (typeof n === 'string') {
      if (!n) continue;
      if (typeof aus[aus.length - 1] === 'string') aus[aus.length - 1] += n;
      else aus.push(n);
    } else aus.push(n);
  }
  return aus;
}

const maskiere = (t: string) => t.replace(/[\\*$`[<]/g, m => '\\' + m);

/**
 * Schreibt Knoten als Inline-Markdown. Texte werden nur maskiert, wenn es nötig ist
 * (Rundreise parseMd(schreibeMd(k)) ≡ k); null, wenn sich die Knoten nicht eindeutig darstellen lassen.
 */
export function schreibeMd(knoten: MdKnoten[]): string | null {
  const ziel = JSON.stringify(normalisiereMd(knoten));
  for (const mask of [false, true]) {
    const s = schreibe(knoten, mask);
    if (s !== null && JSON.stringify(normalisiereMd(parseMd(s))) === ziel) return s;
  }
  return null;
}

function schreibe(knoten: MdKnoten[], mask: boolean): string | null {
  let s = '';
  for (const k of knoten) {
    if (typeof k === 'string') { s += mask ? maskiere(k) : k; continue; }
    switch (k.typ) {
      case 'br': s += '<br>'; break;
      case 'code': if (k.text.includes('`') || !k.text) return null; s += '`' + k.text + '`'; break;
      case 'formel': if (k.tex.includes('$') || !k.tex) return null; s += '$' + k.tex + '$'; break;
      case 'link': { const i = schreibe(k.kinder, mask); if (i === null || /[\s)]/.test(k.href)) return null; s += `[${i}](${k.href})`; break; }
      default: {
        const i = schreibe(k.kinder, mask);
        if (i === null || !i) return null;
        const m = k.typ === 'strong' ? ['**', '**'] : k.typ === 'em' ? ['*', '*'] : [`<${k.typ}>`, `</${k.typ}>`];
        s += m[0] + i + m[1];
      }
    }
  }
  return s;
}

/** Reiner Text (wie innerText ohne Formeln/Umbrüche) – für Suche, Tests und Prüfskripte. */
export function mdKlartext(knoten: MdKnoten[]): string {
  return knoten.map(k => typeof k === 'string' ? k : 'kinder' in k ? mdKlartext(k.kinder) : k.typ === 'code' ? k.text : k.typ === 'formel' ? k.tex : '\n').join('');
}
