// Ausgelagerte Fachtexte (Umsetzungsplan Phase 5, AP 5.3): content/**/*.json gültig, jeder Verweis vorhanden,
// keine verwaisten Einträge; Inline-Markdown (src/lib/inhaltMd.ts), <MdText> und das Einbett-Plugin.
import fs from 'fs';
import path from 'path';
import { h, rendere, text, anzahl, sicher, testlauf } from './hilfen/komponenten';
import { parseMd, schreibeMd, normalisiereMd, mdKlartext, type MdKnoten } from '../src/lib/inhaltMd';
import { inhaltEinbetten } from '../scripts/inhaltEinbetten';
const { MdText } = await import('../src/components/inhalt/MdText');

const t = testlauf('Inhalte (content/)');
const GRUPPEN = ['texte', 'werte', 'daten'];
type Inhalt = Record<string, Record<string, unknown>>;

const jsonDateien = (fs.readdirSync('content', { recursive: true }) as string[]).filter(f => f.endsWith('.json')).map(f => path.join('content', f));
const quellen = (fs.readdirSync('src', { recursive: true }) as string[]).filter(f => /\.tsx?$/.test(f)).map(f => path.join('src', f));
const inhalte = new Map<string, Inhalt>();

t.test('jede Inhaltsdatei ist gültiges JSON mit den Gruppen texte/werte/daten', () => {
  sicher(jsonDateien.length > 0, 'keine Dateien unter content/');
  const fehler: string[] = [];
  for (const f of jsonDateien) {
    let j: Inhalt;
    try { j = JSON.parse(fs.readFileSync(f, 'utf8')) as Inhalt; } catch (e) { fehler.push(`${f}: ${(e as Error).message}`); continue; }
    inhalte.set(f, j);
    for (const [g, v] of Object.entries(j)) {
      if (!GRUPPEN.includes(g)) fehler.push(`${f}: unbekannte Gruppe „${g}“`);
      else if (!v || typeof v !== 'object' || Array.isArray(v)) fehler.push(`${f}: „${g}“ ist kein Objekt`);
      else if (g !== 'daten') for (const [k, x] of Object.entries(v)) if (typeof x !== 'string') fehler.push(`${f}: ${g}.${k} ist keine Zeichenkette`);
    }
  }
  sicher(!fehler.length, fehler.slice(0, 10).join('\n'));
});

t.test('jeder Verweis existiert, jede Datei wird genau einmal importiert, kein Eintrag ist verwaist', () => {
  const fehler: string[] = [];
  const importiert = new Map<string, string[]>();
  const benutzt = new Map<string, Set<string>>();
  for (const q of quellen) {
    const code = fs.readFileSync(q, 'utf8');
    if (!code.includes("from '@/content/")) continue;
    let r: ReturnType<typeof inhaltEinbetten>;
    try {
      r = inhaltEinbetten(code, p => {
        const f = p.slice(2);
        const j = inhalte.get(f);
        if (!j) throw new Error(`${q}: ${p} fehlt`);
        // Zugriffe mitschreiben
        return new Proxy(j, { get: (o, g: string) => o[g] && new Proxy(o[g], { get: (x, k: string) => { (benutzt.get(f) ?? benutzt.set(f, new Set()).get(f)!).add(`${g}.${k}`); return x[k]; } }) });
      });
    } catch (e) { fehler.push((e as Error).message); continue; }
    if (!r) continue;
    for (const p of r.dateien) importiert.set(p.slice(2), [...(importiert.get(p.slice(2)) ?? []), q]);
    if (/from '@\/content\//.test(r.code)) fehler.push(`${q}: Inhalt wird nicht nur über <name>.<gruppe>.<schlüssel> verwendet (Einbetten unvollständig)`);
  }
  for (const [f, j] of inhalte) {
    const q = importiert.get(f) ?? [];
    if (q.length !== 1) fehler.push(`${f}: ${q.length}× importiert${q.length ? ' (' + q.join(', ') + ')' : ''}`);
    for (const [g, v] of Object.entries(j)) for (const k of Object.keys(v)) if (!benutzt.get(f)?.has(`${g}.${k}`)) fehler.push(`${f}: ${g}.${k} wird nirgends verwendet`);
  }
  sicher(!fehler.length, `${fehler.length} Befunde:\n` + fehler.slice(0, 15).join('\n'));
});

t.test('Markdown in „texte“ ist eindeutig (Rundreise) und frei von leeren Auszeichnungen', () => {
  const fehler: string[] = [];
  for (const [f, j] of inhalte) for (const [k, v] of Object.entries(j.texte ?? {})) {
    const s = v as string;
    if (schreibeMd(parseMd(s)) === null) fehler.push(`${f}: texte.${k}`);
  }
  sicher(!fehler.length, fehler.slice(0, 10).join('\n'));
});

// ── Inline-Markdown ─────────────────────────────────────────────────────────
const rund = (k: MdKnoten[]) => { const s = schreibeMd(k); sicher(s !== null, 'nicht darstellbar'); sicher(JSON.stringify(normalisiereMd(parseMd(s))) === JSON.stringify(normalisiereMd(k)), `Rundreise: ${s}`); return s; };
t.test('parseMd: fett, kursiv, Formel, Index, Code, Umbruch, Link', () => {
  const k = parseMd('**Ionenbindung:** Gips ($CaSO_4$), *kursiv*, CO<sub>2</sub>, m<sup>3</sup>, `code`<br>[THA](https://www.tha.de)');
  sicher(JSON.stringify(k) === JSON.stringify([
    { typ: 'strong', kinder: ['Ionenbindung:'] }, ' Gips (', { typ: 'formel', tex: 'CaSO_4' }, '), ', { typ: 'em', kinder: ['kursiv'] }, ', CO',
    { typ: 'sub', kinder: ['2'] }, ', m', { typ: 'sup', kinder: ['3'] }, ', ', { typ: 'code', text: 'code' }, { typ: 'br' },
    { typ: 'link', href: 'https://www.tha.de', kinder: ['THA'] },
  ]), JSON.stringify(k));
});
t.test('parseMd: Sternchen ohne Gegenstück bleiben Text (AVV 17 06 05*)', () => {
  sicher(JSON.stringify(parseMd('AVV 17 06 05* und 17 06 03* (Dämmstoffe)')) === JSON.stringify(['AVV 17 06 05* und 17 06 03* (Dämmstoffe)']), 'Sternchen falsch gedeutet');
  sicher(mdKlartext(parseMd('a \\*b\\* \\$5 c')) === 'a *b* $5 c', 'Maskierung');
});
t.test('schreibeMd: maskiert nur, wenn nötig', () => {
  sicher(rund(['Preis 5 $ pro t']) === 'Preis 5 $ pro t', 'unnötig maskiert');
  sicher(rund(['a *b* c']) === 'a \\*b\\* c', 'Kursiv-Verwechslung nicht maskiert');
  rund([{ typ: 'strong', kinder: ['A'] }, ' und ', { typ: 'em', kinder: ['b'] }, ' x < y, <sub> roh']);
  sicher(schreibeMd([{ typ: 'formel', tex: 'a$b' }]) === null, 'Formel mit $ darf nicht darstellbar sein');
});

// ── <MdText> ────────────────────────────────────────────────────────────────
t.test('MdText: erzeugt nur Inline-Knoten ohne Hüllelement', () => {
  const html = rendere(h('p', null, h(MdText, { text: '**Fett:** Text mit H<sub>2</sub>O und $x^2$<br>Ende' })));
  sicher(html.startsWith('<p><strong>Fett:</strong> Text mit H<sub>2</sub>O und '), html);
  sicher(anzahl(html, /class="katex"/) === 1 && html.includes('<br/>Ende</p>'), html);
  sicher(text(rendere(h('p', null, h(MdText, { text: 'A &amp; B < C' })))) === 'A &amp; B < C', 'Sonderzeichen');
});

// ── Einbett-Plugin ─────────────────────────────────────────────────────────
t.test('inhaltEinbetten: setzt Werte ein und entfernt den Import', () => {
  const code = "import x from 'y';\nimport inhalt from '@/content/a/B.json';\nconst T = inhalt.daten[\"T.0\"];\nexport const A = () => <p title={inhalt.werte.titel}><MdText text={inhalt.texte.einleitung} /></p>;\n";
  const r = inhaltEinbetten(code, () => ({ texte: { einleitung: 'Hallo **Welt**' }, werte: { titel: 'Ein "Titel"' }, daten: { 'T.0': [1, 'a'] } }));
  sicher(r !== null && !r.code.includes('@/content/') && r.code.includes('const T = ([1,"a"]);') && r.code.includes('title={"Ein \\"Titel\\""}') && r.code.includes('text={"Hallo **Welt**"}'), r?.code ?? 'null');
  let geworfen = false;
  try { inhaltEinbetten(code, () => ({ texte: {}, werte: {}, daten: {} })); } catch { geworfen = true; }
  sicher(geworfen, 'fehlender Schlüssel muss den Build abbrechen');
});

t.ende();
