// a11y 09.11.2026 (docs/pruefung/a11y-regler-svg-2026-11-09.md): statische Ratschen für Regler, SVG-Grafiken und
// Überschriftenfolge. Die Zählerstände dürfen nur sinken; nach einer Verbesserung die Höchstwerte hier nachziehen.
//  1. Regler (<input type="range">) ohne aria-valuetext – Screenreader sagen sonst die rohe Zahl ohne Einheit an
//     (Punkt statt Komma). Die Slider-Komponente setzt aria-valuetext selbst und zählt nicht.
//  2. <svg> ohne Textalternative: role="img"/role="group" mit aria-label, role="img" mit <title> oder aria-hidden
//     (rein dekorativ bzw. Information steht daneben im Text). Ein Elternelement mit role="img" und Namen genügt.
//  3. Überschriftensprünge je Datei in Quelltextreihenfolge (z. B. h2 → h4). Überschriften in HTML-Vorlagen für
//     Druckfenster (class=…) zählen nicht. Angehobene Ebenen behalten über die Klasse wie-h4/wie-h5 ihr Aussehen.
import fs from 'node:fs';
import path from 'node:path';

const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
console.log('--- Test: a11y Regler, SVG, Überschriften 09.11.2026 ---');

/** Zählerstände: Stand vor dem Auftrag (08.11.) → nach der Umsetzung (09.11.); Höchstwert = nach der Umsetzung.
 *  Regler: 311 → 0 im Folgeauftrag (docs/pruefung/a11y-slider-2026-11-09.md). */
export const STAND = {
  reglerOhneText: { vorher: 348, max: 0 },
  svgOhneAlternative: { vorher: 118, max: 0 },
  ueberschriftSprung: { vorher: 45, max: 0 },
};

/** Ende eines JSX-Starttags ab Position i (Klammern und Zeichenketten werden übersprungen) */
export function tagEnde(s: string, i: number): number {
  let tiefe = 0; let q: string | null = null;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (q) { if (c === q) q = null; continue; }
    if (tiefe === 0 && (c === '"' || c === "'" || c === '`')) { q = c; continue; }
    if (c === '{') tiefe++;
    else if (c === '}') tiefe--;
    else if (c === '>' && tiefe === 0) return j;
  }
  return -1;
}

export function reglerOhneText(s: string): number {
  let n = 0;
  for (const m of s.matchAll(/<input\b/g)) {
    const tag = s.slice(m.index!, tagEnde(s, m.index!) + 1);
    if (/type=["']range["']/.test(tag) && !/aria-valuetext/.test(tag) && !/\{\.\.\./.test(tag)) n++;
  }
  return n;
}

export function svgOhneAlternative(s: string): number {
  let n = 0;
  for (const m of s.matchAll(/<svg\b/g)) {
    const a = m.index!; const e = tagEnde(s, a); const tag = s.slice(a, e + 1);
    if (/aria-hidden/.test(tag)) continue;
    if (/role=["{]/.test(tag) && /aria-label/.test(tag)) continue;
    if (/role="img"/.test(tag) && /^\s*<title/.test(s.slice(e + 1, e + 200))) continue;
    const vor = s.slice(Math.max(0, a - 400), a);
    let k = vor.lastIndexOf('<');
    while (k >= 0 && vor[k + 1] === '/') k = vor.lastIndexOf('<', k - 1);
    const eltern = k >= 0 ? vor.slice(k) : '';
    if (/role="img"/.test(eltern) && /aria-label/.test(eltern)) continue;
    if (/aria-hidden="true"/.test(eltern) && /^<svg\b/.test(eltern)) continue;
    n++;
  }
  return n;
}

export function ueberschriftSpruenge(s: string): number {
  const ebenen = [...s.matchAll(/<h([1-6])\b(?!\s+class=)/g)].map(m => Number(m[1]));
  return ebenen.slice(1).filter((b, i) => b > ebenen[i] + 1).length;
}

const alle = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true })
  .flatMap(e => e.isDirectory() ? alle(path.join(d, e.name)) : /\.tsx$/.test(e.name) ? [path.join(d, e.name)] : []);
const wurzel = process.env.A11Y_WURZEL ?? '.';
const dateien = alle(path.join(wurzel, 'src'));
const zaehle = (f: (s: string) => number) => {
  const je: Record<string, number> = {};
  for (const d of dateien) { const n = f(fs.readFileSync(d, 'utf8')); if (n) je[path.relative(wurzel, d)] = n; }
  return { summe: Object.values(je).reduce((a, b) => a + b, 0), je };
};

// Selbstprüfung der Zähler an kleinen Beispielen
gilt(reglerOhneText('<input type="range" value={x} onChange={e => f(e)} />') === 1, 'Zähler Regler: ohne aria-valuetext');
gilt(reglerOhneText('<input type="range" aria-valuetext={`${a} mm`} />') === 0, 'Zähler Regler: mit aria-valuetext');
gilt(svgOhneAlternative('<svg viewBox="0 0 1 1"><path/></svg>') === 1, 'Zähler SVG: ohne Alternative');
gilt(svgOhneAlternative('<svg role="img" aria-label="Skizze"></svg><svg aria-hidden="true"></svg>') === 0, 'Zähler SVG: mit Alternative');
gilt(ueberschriftSpruenge('<h2>a</h2><h4>b</h4><h3>c</h3>') === 1 && ueberschriftSpruenge('<h2/><h3/><h4/><h2/><h3/>') === 0, 'Zähler Überschriften');
gilt(ueberschriftSpruenge('`<h1 class="x">a</h1><h3 class="y">b</h3>`') === 0, 'Zähler Überschriften: HTML-Vorlagen ausgenommen');

const r = zaehle(reglerOhneText);
const v = zaehle(svgOhneAlternative);
const u = zaehle(ueberschriftSpruenge);
const zeige = (je: Record<string, number>) => Object.entries(je).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([d, n]) => `${d} ${n}`).join(', ');
gilt(r.summe <= STAND.reglerOhneText.max, `Regler ohne aria-valuetext: ${r.summe} > ${STAND.reglerOhneText.max} (${zeige(r.je)})`);
gilt(v.summe <= STAND.svgOhneAlternative.max, `SVG ohne Textalternative: ${v.summe} > ${STAND.svgOhneAlternative.max} (${zeige(v.je)})`);
gilt(u.summe <= STAND.ueberschriftSprung.max, `Überschriftensprünge: ${u.summe} > ${STAND.ueberschriftSprung.max} (${zeige(u.je)})`);

// Die 25 Module aus REGLER_OFFEN (Kurzzeilen 04.11.) haben Ansage und Regler mit Klartext
const BEISPIELE: Record<string, RegExp[]> = {
  'src/modules/Korrosion.tsx': [/aria-valuetext=\{`\$\{formatDeZahl\(clContent, 2\)\} % bezogen auf Zementgehalt`\}/, /aria-valuetext=\{`\$\{durationYears\} Jahre`\}/],
  'src/modules/Zementchemie.tsx': [/<ErgebnisAnsage text=\{kurzzeile\(ansageWert\('Alit C3S'/],
  'src/modules/ki/LlmPraxisTeile/MarkdownTab.tsx': [/<ErgebnisAnsage text=\{kurzzeile\(ansageWert\('Geschätzte Token'/],
};
if (wurzel === '.') for (const [d, res] of Object.entries(BEISPIELE)) {
  const s = fs.readFileSync(d, 'utf8');
  for (const re of res) gilt(re.test(s), `${d}: ${re.source.slice(0, 50)} fehlt`);
}
// CSS: angehobene Überschriften behalten das Aussehen der früheren Ebene
const css = fs.readFileSync(path.join(wurzel === '.' ? '.' : wurzel, 'src/index.css'), 'utf8');
if (wurzel === '.') {
  gilt(/h3:where\(\.wie-h4\) \{\s*font-size: 0\.9375rem !important;/.test(css), 'index.css: h3.wie-h4 wie h4 (Schriftgröße)');
  gilt(/h4:where\(\.wie-h5\) \{\s*font-size: 0\.875rem !important;/.test(css), 'index.css: h4.wie-h5 wie h5 (Schriftgröße)');
  gilt(/\.dark h3:where\(\.wie-h4\) \{\s*color: #e2e8f0 !important;/.test(css), 'index.css: h3.wie-h4 dunkel wie h4');
  gilt(css.indexOf('h3:where(.wie-h4)') > css.indexOf('.dark h5 {') && css.indexOf('h3:where(.wie-h4)') > css.lastIndexOf('\nh4 {'), 'index.css: Regeln nach h4/.dark h4');
  for (const d of dateien) {
    const s = fs.readFileSync(d, 'utf8');
    for (const m of s.matchAll(/<h([1-6])\b[^>]*\bwie-h([4-6])\b/g)) gilt(Number(m[2]) > Number(m[1]), `${d}: wie-h${m[2]} an h${m[1]} (nur an angehobenen Ebenen)`);
  }
}

console.log(`  Regler ohne aria-valuetext ${r.summe} (vorher ${STAND.reglerOhneText.vorher}), SVG ohne Alternative ${v.summe} (vorher ${STAND.svgOhneAlternative.vorher}), Überschriftensprünge ${u.summe} (vorher ${STAND.ueberschriftSprung.vorher})`);
if (fehler.length) { fehler.forEach(f => console.error('FAIL: ' + f)); process.exit(1); }
console.log('OK: a11y Regler/SVG/Überschriften 09.11.2026');
