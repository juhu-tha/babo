#!/usr/bin/env tsx
/**
 * Fachtexte aus Modul-TSX nach content/ auslagern (Umsetzungsplan Phase 5, AP 5.3).
 *
 *   npx tsx scripts/inhalt-auslagern.ts [--ausschluss datei.json] [--karte karte.json] src/modules/X.tsx …
 *
 * Je Quelldatei src/modules/<pfad>/<Name>.tsx entsteht content/<modul>/<Name>.json mit drei Gruppen:
 *   texte – JSX-Fließtext als Inline-Markdown (src/lib/inhaltMd.ts), gerendert mit <MdText text={…} />
 *   werte – einzelne Zeichenketten (Props, Werte im Code), unverändert als String eingesetzt
 *   daten – reine Literal-Teilbäume (Tabellen, Listen, Glossare …) unter einem Pfadschlüssel
 * Das Skript ersetzt nur Literale durch Verweise auf exakt denselben Wert (Rundreise geprüft), die
 * Ausgabe bleibt also zeichengleich. Bereits ausgelagerte Dateien (Import aus '@/content/') werden übersprungen.
 * --ausschluss: Liste „<datei>:<offset>“ von Stellen, die im Code bleiben (z. B. wegen Literaltypen);
 * --karte: schreibt je Ersetzung die neue Position (für die Zuordnung von tsc-Fehlern).
 */
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { schreibeMd, type MdKnoten } from '../src/lib/inhaltMd';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const MIN = 12;

const args = process.argv.slice(2);
const opt = (n: string) => { const i = args.indexOf(n); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v; };
const ausschlussDatei = opt('--ausschluss');
const karteDatei = opt('--karte');
const listeDatei = opt('--liste');
// --neu <rev>: Datei vorher auf den Stand <rev> zurücksetzen und ihre JSON neu erzeugen (Wiederholungslauf)
const neuAb = opt('--neu');
if (listeDatei) args.push(...fs.readFileSync(listeDatei, 'utf8').split('\n').map(z => z.trim()).filter(Boolean));
const AUSSCHLUSS = new Set<string>(ausschlussDatei && fs.existsSync(ausschlussDatei) ? JSON.parse(fs.readFileSync(ausschlussDatei, 'utf8')) : []);
const karte: Record<string, { start: number; ende: number; id: string }[]> = {};

const TECH_ATTR = /^(className|class|style|key|id|href|src|srcSet|type|role|d|viewBox|fill|stroke|points|transform|target|rel|name|htmlFor|value|defaultValue|width|height|x|y|x1|x2|y1|y2|cx|cy|r|rx|ry|accept|inputMode|mode|variant|size|color|icon|lang|step|min|max|pattern|autoComplete|data-[\w-]+|aria-hidden|aria-controls|aria-labelledby|aria-describedby|strokeWidth|strokeLinecap|strokeLinejoin|strokeDasharray|textAnchor|dominantBaseline|fontSize|fontWeight|fontFamily|gradientUnits|offset|stopColor|stopOpacity|preserveAspectRatio|xmlns|clipPath|mask|filter|markerEnd|markerStart|markerWidth|markerHeight|refX|refY|orient|loading|decoding|method|encType|tabIndex|layout|initial|animate|exit|transition|whileHover|whileTap|to|path|download|form|list|dateTime|colSpan|rowSpan|scope|headers|wrap|dir|media|sizes|integrity|crossOrigin|referrerPolicy|sandbox|allow|frameBorder|scrolling|kind|srcLang|poster|preload|autoPlay|controls|loop|muted|playsInline|spellCheck|draggable|hidden|open|selected|checked|disabled|readOnly|required|multiple)$/;
const MATH = /^(math|formel|formula|latex|tex|katex|equation|gleichung|zielGleichung|formelTex|formelLatex)$/;
const TECH_KEY = /(Color|Class|ClassName|Classes|Klasse|Style|Icon|Url|Href|Bg)$|^(className|class|klasse|klassen|style|color|colour|farbe|bg|bgColor|bgClass|textColor|borderColor|iconColor|border|ring|gradient|icon|href|url|link|src|bild|image|img|key|id|tw|cls|variant|stroke|fill|hex|rgb)$/i;
const SKIP_CALL = /^(cn|clsx|twMerge|require|import|console\.\w+|document\.\w+|window\.\w+|localStorage\.\w+|sessionStorage\.\w+|\w+\.setAttribute|\w+\.querySelector(All)?|\w+\.getElementById|\w+\.addEventListener|new RegExp|RegExp|fetch|katex\.render\w*|\w+\.setItem|\w+\.getItem|\w+\.removeItem)$/;
const INLINE_TAG = new Set(['strong', 'em', 'sub', 'sup']);
const KEIN_MD = new Set(['pre', 'kbd', 'option', 'title', 'textarea', 'style', 'script', 'InlineMath', 'BlockMath', 'tspan', 'text', 'desc', 'optgroup']);
const ENT: Record<string, string> = { amp: '&', gt: '>', lt: '<', quot: '"', apos: "'", nbsp: ' ', bull: '•', ge: '≥', le: '≤', rarr: '→', larr: '←', uarr: '↑', darr: '↓', deg: '°', Delta: 'Δ', middot: '·', ldquo: '“', rdquo: '”', bdquo: '„', lsquo: '‘', rsquo: '’', rho: 'ρ', epsilon: 'ε', radic: '√', phi: 'φ', Phi: 'Φ', ndash: '–', mdash: '—', minus: '−', gamma: 'γ', times: '×', sigma: 'σ', permil: '‰', mu: 'μ', eta: 'η', approx: '≈', sect: '§', agrave: 'à', euro: '€', copy: '©', Oslash: 'Ø', hellip: '…', alpha: 'α', beta: 'β', delta: 'δ', lambda: 'λ', tau: 'τ', theta: 'θ', pi: 'π', plusmn: '±', sup2: '²', sup3: '³', frac12: '½', auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß', shy: '­' };

/** HTML-Entities wie esbuild/Babel auflösen; null bei unbekannten oder Leerraum-Entities */
function entities(s: string): string | null {
  let fehler = false;
  const r = s.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, e: string) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      if (n === 9 || n === 10 || n === 13 || n === 32 || n > 0xFFFF || (n >= 0xD800 && n <= 0xDFFF)) { fehler = true; return m; }
      return String.fromCharCode(n);
    }
    if (!(e in ENT)) { fehler = true; return m; }
    return ENT[e];
  });
  return fehler ? null : r;
}

/** JSX-Text wie Babel/esbuild (cleanJSXElementLiteralChild) */
function jsxText(roh: string): string | null {
  if (/[\t\r]/.test(roh)) return null;
  const zeilen = roh.split('\n');
  let letzte = 0;
  zeilen.forEach((z, i) => { if (/[^ ]/.test(z)) letzte = i; });
  let s = '';
  zeilen.forEach((z, i) => {
    let t = z;
    if (i !== 0) t = t.replace(/^ +/, '');
    if (i !== zeilen.length - 1) t = t.replace(/ +$/, '');
    if (t) { if (i !== letzte) t += ' '; s += t; }
  });
  return entities(s);
}

const istFach = (s: string) => {
  const t = s.trim();
  if (t.length < MIN || !/\p{L}/u.test(t) || !/\s/.test(t)) return false;
  if (/^(https?:|www\.|\/|#|\.\.?\/|@\/)\S*$/.test(t)) return false;
  if (/^(rgba?|hsla?|translate[XYZ3d]*|rotate[XYZ]?|scale[XYZ]?|calc|url|var|cubic-bezier|linear-gradient|radial-gradient|drop-shadow|matrix)\(/.test(t)) return false;
  const toks = t.split(/\s+/);
  if (toks.every(k => /^[a-z0-9:\-/[\]\.#%!_()&>,]+$/.test(k)) && toks.some(k => k.includes('-'))) return false;
  return true;
};

function schluessel(text: string, belegt: Set<string>): string {
  const toks = (text.match(/[A-Za-z0-9ÄÖÜäöüß]+/g) ?? []).slice(0, 4);
  let k = toks.map((t, i) => i === 0 ? t.toLowerCase() : t[0].toUpperCase() + t.slice(1).toLowerCase()).join('').slice(0, 40) || 'text';
  if (/^\d/.test(k)) k = 't' + k;
  let n = k, i = 2;
  while (belegt.has(n)) n = k + i++;
  belegt.add(n);
  return n;
}

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function zielPfad(rel: string): string {
  // src/modules/Bauchemie.tsx → content/bauchemie/Bauchemie.json; src/modules/spannbeton/X.tsx → content/spannbeton/X.json
  const teile = path.relative(path.join(ROOT, 'src/modules'), rel).split(path.sep);
  const name = teile.pop()!.replace(/\.tsx?$/, '');
  // Modulordner klein (wie src/modules/<modul>/), tiefere Ordner unverändert
  const ordner = teile.length ? [teile[0].toLowerCase(), ...teile.slice(1)] : [name.toLowerCase()];
  return path.join(ROOT, 'content', ...ordner, name + '.json');
}

function bearbeite(datei: string) {
  const abs = path.resolve(datei);
  const rel = path.relative(ROOT, abs);
  if (neuAb) {
    fs.writeFileSync(abs, execFileSync('git', ['show', `${neuAb}:${rel}`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 }));
    if (fs.existsSync(zielPfad(abs))) fs.unlinkSync(zielPfad(abs));
  }
  const src = fs.readFileSync(abs, 'utf8');
  if (src.includes("from '@/content/")) { console.log(`übersprungen (schon ausgelagert): ${rel}`); return; }
  const sf = ts.createSourceFile(abs, src, ts.ScriptTarget.Latest, true, abs.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  let ident = 'inhalt';
  for (const k of ['inhalt', 'inhaltJson', 'INHALT_DATEI']) { ident = k; if (!new RegExp(`\\b${k}\\b`).test(src)) break; }
  const katexImport = /import\s*\{[^}]*\bInlineMath\b[^}]*\}\s*from\s*['"]react-katex['"]/.test(src);
  const mdName = /\bMdText\b/.test(src) ? null : 'MdText';

  const texte: Record<string, string> = {}, werte: Record<string, string> = {}, daten: Record<string, Json> = {};
  const belegtT = new Set<string>(), belegtW = new Set<string>(), belegtD = new Set<string>();
  const edits: { start: number; ende: number; text: string; id: string }[] = [];
  let mdBenutzt = false;
  const frei = (n: ts.Node) => !AUSSCHLUSS.has(`${rel}:${n.getStart()}`);

  // ---- Literale auswerten ----
  const wert = (n: ts.Expression): { ok: true; v: Json } | { ok: false } => {
    if (ts.isParenthesizedExpression(n)) return wert(n.expression);
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return { ok: true, v: n.text };
    if (ts.isNumericLiteral(n)) { const z = Number(n.text.replace(/_/g, '')); return Number.isFinite(z) && JSON.parse(JSON.stringify(z)) === z && !Object.is(z, -0) ? { ok: true, v: z } : { ok: false }; }
    if (ts.isPrefixUnaryExpression(n) && n.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(n.operand)) { const z = -Number(n.operand.text.replace(/_/g, '')); return Number.isFinite(z) && !Object.is(z, -0) ? { ok: true, v: z } : { ok: false }; }
    if (n.kind === ts.SyntaxKind.TrueKeyword) return { ok: true, v: true };
    if (n.kind === ts.SyntaxKind.FalseKeyword) return { ok: true, v: false };
    if (n.kind === ts.SyntaxKind.NullKeyword) return { ok: true, v: null };
    if (ts.isArrayLiteralExpression(n)) {
      const a: Json[] = [];
      for (const e of n.elements) { if (ts.isSpreadElement(e) || ts.isOmittedExpression(e)) return { ok: false }; const r = wert(e); if (!r.ok) return r; a.push(r.v); }
      return { ok: true, v: a };
    }
    if (ts.isObjectLiteralExpression(n)) {
      const o: Record<string, Json> = {};
      for (const p of n.properties) {
        if (!ts.isPropertyAssignment(p)) return { ok: false };
        const name = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) || ts.isNumericLiteral(p.name) ? p.name.text : null;
        if (name === null || name === '__proto__') return { ok: false };
        const r = wert(p.initializer); if (!r.ok) return r; o[name] = r.v;
      }
      return { ok: true, v: o };
    }
    return { ok: false };
  };
  const strings = (v: Json): string[] => typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v !== null && typeof v === 'object' ? Object.values(v).flatMap(strings) : [];
  // Daten-Teilbaum: mindestens ein längerer Text und überwiegend Fachtext (keine Diagramm-/Stil-Konfiguration)
  const datenFach = (v: Json): boolean => {
    const st = strings(v);
    const fach = st.filter(istFach);
    const lang = fach.some(t => t.length >= 25 && (t.match(/\s/g) ?? []).length >= 3);
    const summe = (a: string[]) => a.reduce((x, t) => x + t.length, 0);
    return lang && summe(fach) >= 0.5 * summe(st);
  };
  const hatFach = (v: Json): boolean => typeof v === 'string' ? istFach(v) : Array.isArray(v) ? v.some(hatFach) : v !== null && typeof v === 'object' ? Object.values(v).some(hatFach) : false;

  // Pfadname für einen Daten-Teilbaum: Variablenname + Eigenschaften/ids bis zum Literal
  const datenPfad = (n: ts.Node): { pfad: string; wurzel: string | null } => {
    const seg: string[] = [];
    let k: ts.Node = n;
    let wurzel: string | null = null;
    while (k.parent) {
      const p = k.parent;
      if (ts.isPropertyAssignment(p) && p.initializer === k) { seg.unshift(p.name.getText().replace(/^['"]|['"]$/g, '')); k = p.parent; continue; }
      if (ts.isArrayLiteralExpression(p)) {
        let s = String(p.elements.indexOf(k as ts.Expression));
        if (ts.isObjectLiteralExpression(k)) {
          const idp = k.properties.find(q => ts.isPropertyAssignment(q) && /^(id|key|slug)$/.test(q.name.getText()) && ts.isStringLiteral(q.initializer));
          if (idp && ts.isPropertyAssignment(idp)) s = (idp.initializer as ts.StringLiteral).text;
        }
        seg.unshift(s); k = p; continue;
      }
      if (ts.isAsExpression(p) || ts.isSatisfiesExpression(p) || ts.isParenthesizedExpression(p)) { k = p; continue; }
      if (ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) { wurzel = p.name.text; seg.unshift(wurzel); break; }
      if (ts.isJsxExpression(p) && ts.isJsxAttribute(p.parent)) { seg.unshift(p.parent.name.getText()); break; }
      if (ts.isPropertyAssignment(p) || ts.isPropertyDeclaration(p)) { seg.unshift(p.name.getText()); break; }
      break;
    }
    // umschließende Funktion/Komponente als Präfix, wenn nicht auf Dateiebene
    let f: ts.Node | undefined = n.parent;
    while (f && !ts.isSourceFile(f)) {
      if ((ts.isFunctionDeclaration(f) || ts.isFunctionExpression(f) || ts.isArrowFunction(f) || ts.isMethodDeclaration(f))) {
        const nm = ts.isFunctionDeclaration(f) && f.name ? f.name.text : ts.isVariableDeclaration(f.parent) && ts.isIdentifier(f.parent.name) ? f.parent.name.text : null;
        if (nm) { seg.unshift(nm); break; }
      }
      f = f.parent;
    }
    return { pfad: seg.join('.') || 'daten', wurzel };
  };
  const MUTATION = (name: string) => new RegExp(`\\b${name}(\\s*\\[[^\\]]*\\]|\\.\\w+)*\\.(push|pop|shift|unshift|splice|sort|reverse|fill|copyWithin)\\(|\\b${name}(\\s*\\[[^\\]]*\\]|\\.\\w+)+\\s*(=(?!=)|\\+=|-=)|\\bObject\\.assign\\(\\s*${name}\\b|\\bdelete\\s+${name}\\b`).test(src);
  const inZustand = (n: ts.Node) => { for (let p = n.parent; p && !ts.isSourceFile(p); p = p.parent) { if (ts.isCallExpression(p) && /^(React\.)?(useState|useReducer|useRef)$/.test(p.expression.getText())) return true; if (ts.isStatement(p)) break; } return false; };

  const zugriff = (gruppe: string, k: string) => /^[A-Za-zÄÖÜäöüß_$][\wÄÖÜäöüß$]*$/.test(k) ? `${ident}.${gruppe}.${k}` : `${ident}.${gruppe}[${JSON.stringify(k)}]`;

  // ---- JSX-Kinder als Inline-Knoten ----
  const mathText = (a: ts.JsxAttribute): string | null => {
    const i = a.initializer;
    if (!i) return null;
    if (ts.isStringLiteral(i)) return entities(i.getText().slice(1, -1));
    if (ts.isJsxExpression(i) && i.expression) {
      const e = i.expression;
      if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return e.text;
      if (ts.isTaggedTemplateExpression(e) && e.tag.getText() === 'String.raw' && ts.isNoSubstitutionTemplateLiteral(e.template)) return e.template.rawText ?? null;
    }
    return null;
  };
  const inline = (kinder: readonly ts.JsxChild[]): MdKnoten[] | null => {
    const aus: MdKnoten[] = [];
    for (const c of kinder) {
      if (ts.isJsxText(c)) { const t = jsxText(c.getFullText()); if (t === null) return null; if (t) aus.push(t); continue; }
      if (ts.isJsxExpression(c)) {
        if (!c.expression) continue; // Kommentar
        if (ts.isStringLiteral(c.expression) || ts.isNoSubstitutionTemplateLiteral(c.expression)) { aus.push(c.expression.text); continue; }
        return null;
      }
      if (ts.isJsxSelfClosingElement(c)) {
        const tag = c.tagName.getText();
        if (tag === 'br' && c.attributes.properties.length === 0) { aus.push({ typ: 'br' }); continue; }
        if (tag === 'InlineMath' && katexImport && c.attributes.properties.length === 1) {
          const a = c.attributes.properties[0];
          if (ts.isJsxAttribute(a) && a.name.getText() === 'math') { const m = mathText(a); if (m && !m.includes('$')) { aus.push({ typ: 'formel', tex: m }); continue; } }
        }
        return null;
      }
      if (ts.isJsxElement(c)) {
        const tag = c.openingElement.tagName.getText();
        if (c.openingElement.attributes.properties.length) return null;
        if (INLINE_TAG.has(tag)) { const k = inline(c.children); if (!k) return null; aus.push({ typ: tag as 'strong', kinder: k }); continue; }
        if (tag === 'code') { const k = inline(c.children); if (!k || k.some(x => typeof x !== 'string')) return null; aus.push({ typ: 'code', text: (k as string[]).join('') }); continue; }
        return null;
      }
      return null;
    }
    return aus;
  };
  const klartext = (k: MdKnoten[]): string => k.map(x => typeof x === 'string' ? x : 'kinder' in x ? klartext(x.kinder) : x.typ === 'code' ? x.text : '').join('');
  const intrinsisch = (n: ts.JsxElement | ts.JsxFragment) => ts.isJsxFragment(n) || /^[a-z]/.test(n.openingElement.tagName.getText());
  const tagVon = (n: ts.Node) => ts.isJsxElement(n) ? n.openingElement.tagName.getText() : ts.isJsxFragment(n) ? '' : null;

  const neuText = (md: string, start: number, ende: number, id: string) => {
    const k = schluessel(md.replace(/\\(.)/g, '$1'), belegtT);
    texte[k] = md; mdBenutzt = true;
    edits.push({ start, ende, text: `<MdText text={${zugriff('texte', k)}} />`, id });
  };
  const neuWert = (v: string, start: number, ende: number, form: (z: string) => string, id: string) => {
    const k = schluessel(v, belegtW);
    werte[k] = v;
    edits.push({ start, ende, text: form(zugriff('werte', k)), id });
  };

  let keineDaten = 0;
  const visit = (n: ts.Node): void => {
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n) || ts.isTypeNode(n) || ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n) || ts.isEnumDeclaration(n)) return;

    // 1) reine Literal-Teilbäume mit Fachtext → daten
    // ausgeschlossener Daten-Teilbaum (Literaltypen): darin nur noch einzelne Texte auslagern
    if ((ts.isArrayLiteralExpression(n) || ts.isObjectLiteralExpression(n)) && !frei(n)) {
      keineDaten++; ts.forEachChild(n, visit); keineDaten--; return;
    }
    if ((ts.isArrayLiteralExpression(n) || ts.isObjectLiteralExpression(n)) && keineDaten === 0) {
      const r = wert(n);
      if (r.ok && datenFach(r.v) && !inZustand(n)) {
        const par = n.parent;
        const techSchl = ts.isPropertyAssignment(par) && TECH_KEY.test(par.name.getText()) || ts.isPropertyAssignment(par) && MATH.test(par.name.getText());
        const attr = ts.isJsxExpression(par) && ts.isJsxAttribute(par.parent) && (TECH_ATTR.test(par.parent.name.getText()) || MATH.test(par.parent.name.getText()));
        const { pfad, wurzel } = datenPfad(n);
        let decl: ts.Node | undefined = n.parent;
        while (decl && !ts.isVariableDeclaration(decl) && !ts.isStatement(decl)) decl = decl.parent;
        const reiter = !!decl && ts.isVariableDeclaration(decl) && /ModulTab/.test(decl.type?.getText() ?? '');
        if (!techSchl && !attr && !reiter && !(wurzel && MUTATION(wurzel))) {
          let k = pfad, i = 2; while (belegtD.has(k)) k = `${pfad}_${i++}`; belegtD.add(k);
          daten[k] = r.v;
          edits.push({ start: n.getStart(), ende: n.getEnd(), text: zugriff('daten', k), id: `${rel}:${n.getStart()}` });
          return;
        }
      }
    }

    // 2) JSX-Kinder: zusammenhängende Inline-Läufe (Text, strong, em, sub, sup, code, br, InlineMath) → texte
    if ((ts.isJsxElement(n) || ts.isJsxFragment(n))) {
      const tag = tagVon(n) ?? '';
      if (ts.isJsxElement(n)) visit(n.openingElement);
      const kinder = n.children;
      const eigen = intrinsisch(n);
      const laeufe: ts.JsxChild[][] = [];
      let lauf: ts.JsxChild[] = [];
      for (const c of kinder) {
        if (!KEIN_MD.has(tag) && !/^(InlineMath|BlockMath|Latex|TeX)$/.test(tag) && inline([c]) !== null) lauf.push(c);
        else { if (lauf.length) laeufe.push(lauf); lauf = []; visit(c); }
      }
      if (lauf.length) laeufe.push(lauf);
      for (const l of laeufe) {
        const k = inline(l);
        const id = `${rel}:${l[0].getStart()}`;
        const nimm = k && istFach(klartext(k)) && AUSSCHLUSS.has(id) === false;
        if (nimm && eigen) {
          const md = schreibeMd(k!);
          if (md !== null) { neuText(md, l[0].getFullStart(), l[l.length - 1].getEnd(), id); continue; }
        } else if (nimm && l.filter(c => !(ts.isJsxText(c) && jsxText(c.getFullText()) === '')).length === 1 && k!.length === 1 && typeof k![0] === 'string') {
          // Kind einer eigenen Komponente: genau ein Text bleibt ein String-Kind
          const c = l.find(c => !(ts.isJsxText(c) && jsxText(c.getFullText()) === ''))!;
          if (ts.isJsxText(c)) { neuWert(k![0] as string, c.getFullStart(), c.getEnd(), z => `{${z}}`, id); continue; }
        }
        for (const c of l) visit(c);
      }
      return;
    }
    if (ts.isJsxText(n)) return;

    // 4) JSX-Attribut mit Text
    if (ts.isJsxAttribute(n) && n.initializer && !TECH_ATTR.test(n.name.getText()) && !MATH.test(n.name.getText()) && frei(n)) {
      const i = n.initializer;
      if (ts.isStringLiteral(i)) {
        const v = entities(i.getText().slice(1, -1));
        if (v !== null && istFach(v) && !/\\/.test(i.getText())) { neuWert(v, i.getStart(), i.getEnd(), z => `{${z}}`, `${rel}:${n.getStart()}`); return; }
        return;
      }
    }

    // 5) sonstige Zeichenketten im Code
    if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) && frei(n) && istFach(n.text)) {
      const p = n.parent;
      const verboten =
        (ts.isPropertyAssignment(p) && (p.name === n || TECH_KEY.test(p.name.getText()) || MATH.test(p.name.getText()))) ||
        ts.isElementAccessExpression(p) || ts.isLiteralTypeNode(p) || ts.isCaseClause(p) || ts.isImportDeclaration(p) || ts.isExternalModuleReference(p) ||
        ts.isTaggedTemplateExpression(p) || ts.isJsxAttribute(p) ||
        (ts.isBinaryExpression(p) && p.operatorToken.kind === ts.SyntaxKind.PlusToken) ||
        (ts.isBinaryExpression(p) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken, ts.SyntaxKind.InKeyword].includes(p.operatorToken.kind)) ||
        ((ts.isCallExpression(p) || ts.isNewExpression(p)) && SKIP_CALL.test((ts.isNewExpression(p) ? 'new ' : '') + p.expression.getText())) ||
        (ts.isJsxExpression(p) && ts.isJsxAttribute(p.parent) && (TECH_ATTR.test(p.parent.name.getText()) || MATH.test(p.parent.name.getText()))) ||
        (ts.isJsxExpression(p) && (ts.isJsxElement(p.parent) && /^(InlineMath|BlockMath)$/.test(p.parent.openingElement.tagName.getText()))) ||
        (ts.isExpressionStatement(p)) ||
        /\\[a-zA-Z]{2,}/.test(n.text) && !n.text.includes('$');
      if (!verboten) {
        // im JSX-Kind {'…'} bleibt die Form erhalten
        neuWert(n.text, n.getStart(), n.getEnd(), z => z, `${rel}:${n.getStart()}`);
        return;
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);

  if (!edits.length) { console.log(`keine Fachtexte: ${rel}`); return; }
  edits.sort((a, b) => b.start - a.start);
  for (let i = 1; i < edits.length; i++) if (edits[i].ende > edits[i - 1].start) throw new Error(`Überlappung in ${rel} bei ${edits[i].start}`);
  let out = src;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.ende);

  // Importe hinter dem letzten Import einfügen
  const ziel = zielPfad(abs);
  const importPfad = '@/' + path.relative(ROOT, ziel).split(path.sep).join('/');
  const letzte = [...sf.statements].filter(ts.isImportDeclaration).pop();
  const zeilen = [`import ${ident} from '${importPfad}';`];
  if (mdBenutzt && mdName) zeilen.push(`import { MdText } from '@/src/components/inhalt/MdText';`);
  const pos = letzte ? letzte.getEnd() : 0;
  // Positionen der Ersetzungen im neuen Text (für die Zuordnung von tsc-Fehlern)
  const aufsteigend = [...edits].reverse();
  let verschiebung = 0;
  const einfuegung = (letzte ? '\n' : '') + zeilen.join('\n') + (letzte ? '' : '\n');
  karte[rel] = aufsteigend.map(e => {
    const s = e.start + verschiebung + (e.start >= pos ? einfuegung.length : 0);
    verschiebung += e.text.length - (e.ende - e.start);
    return { start: s, ende: s + e.text.length, id: e.id };
  });
  // Einfügeposition im bearbeiteten Text: Ersetzungen liegen alle hinter den Importen
  const posNeu = pos + edits.filter(e => e.ende <= pos).reduce((s, e) => s + e.text.length - (e.ende - e.start), 0);
  out = out.slice(0, posNeu) + einfuegung + out.slice(posNeu);
  fs.writeFileSync(abs, out);
  const inhalt: Record<string, unknown> = {};
  if (Object.keys(texte).length) inhalt.texte = texte;
  if (Object.keys(werte).length) inhalt.werte = werte;
  if (Object.keys(daten).length) inhalt.daten = daten;
  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  if (fs.existsSync(ziel)) throw new Error(`Ziel existiert schon: ${ziel}`);
  fs.writeFileSync(ziel, JSON.stringify(inhalt, null, 2) + '\n');
  console.log(`${rel} → ${path.relative(ROOT, ziel)}: ${Object.keys(texte).length} texte, ${Object.keys(werte).length} werte, ${Object.keys(daten).length} daten`);
}

for (const d of args) bearbeite(d);
if (karteDatei) {
  const alt = fs.existsSync(karteDatei) ? JSON.parse(fs.readFileSync(karteDatei, 'utf8')) : {};
  fs.writeFileSync(karteDatei, JSON.stringify({ ...alt, ...karte }));
}
