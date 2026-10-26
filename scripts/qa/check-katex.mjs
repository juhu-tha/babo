// Prüft alle KaTeX-Formeln im Quelltext.
// Findet (1) Formeln, die KaTeX nicht rendern kann, und (2) Formeln, deren Backslashes
// beim Parsen des JS-Strings verloren gegangen sind (z. B. "cdot", "frac", Tab/Formfeed-Zeichen).
// (3) KaTeX-strict-Warnungen (Unicode im Mathe-Modus, Zeichen ohne Schriftmetrik) als Ratsche GRENZE_STRIKT.
// Aufruf: node scripts/qa/check-katex.mjs [--json] [--strikt] [Pfadfilter]   (--strikt listet alle strict-Warnungen)
import ts from 'typescript';
import katex from 'katex';
import fs from 'fs';
import path from 'path';
import { inhaltsDateien, inhaltsTexte, mdFormeln, relativ } from './inhaltDateien.mjs';

const ROOT = path.resolve('src');
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const filter = args.find(a => !a.startsWith('--'));
const MATH_PROPS = new Set(['math', 'formel', 'formula', 'latex', 'tex', 'katex', 'equation', 'gleichung', 'zielGleichung']);
const LOST = /(^|[^\\a-zA-Z])(cdot|frac|sqrt|text\{|mathrm|varepsilon|epsilon|sigma|alpha|beta|gamma|delta|Delta|lambda|approx|times|leq?|geq?|infty|sum|int|rightarrow|Rightarrow|quad|left[(\[|]|right[)\]|]|circ|mu|rho|phi|varphi|tau|eta|theta|pi|partial|nabla|ldots|dots|cdots|underbrace|overline|mathbf|boldsymbol|xrightarrow|uparrow|downarrow)(?![a-zA-Z])/;
const CTRL = /[\t\f\v\b\r]/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) out.push(p);
  }
  return out;
}

function stringValue(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return { text: node.text, raw: node.getText() };
  if (ts.isJsxExpression(node)) return stringValue(node.expression);
  if (ts.isParenthesizedExpression(node)) return stringValue(node.expression);
  if (ts.isTaggedTemplateExpression(node) && node.tag.getText() === 'String.raw' && ts.isNoSubstitutionTemplateLiteral(node.template)) {
    return { text: node.template.rawText ?? node.template.text, raw: node.getText() };
  }
  if (ts.isTemplateExpression(node)) {
    // Platzhalter durch 1 ersetzen, damit der Rest geprüft werden kann
    let t = node.head.text;
    for (const s of node.templateSpans) t += '1' + s.literal.text;
    return { text: t, raw: node.getText(), template: true };
  }
  return null;
}

function pruefe(text) {
  const problems = [];
  if (CTRL.test(text)) problems.push('Steuerzeichen im String (verlorener Backslash vor t/f/v/b/r)');
  // In JSX-Attributen ohne geschweifte Klammern (math="…") werden Escapes NICHT ausgewertet:
  // "\\cdot" kommt dort als doppelter Backslash an → KaTeX bricht die Zeile um und zeigt "cdot".
  const dbl = text.match(/\\\\([a-zA-Z]+)/);
  if (dbl) problems.push(`Doppelter Backslash vor Befehl: "\\\\${dbl[1]}"`);
  const m = text.match(LOST);
  // "pi"/"circ" als Indexbuchstaben (σ_{pi}, r_{\text{circ}}) sind kein Fehler
  if (m && !(/^(pi|circ|mu|eta|tau|phi|rho)$/.test(m[2]) && /[_{]$/.test(text.slice(0, m.index + m[1].length)))) problems.push(`Befehl ohne Backslash: "${m[2]}"`);
  const strikt = [];
  try {
    // strict als Funktion: Warnungen (z. B. Umlaute/€ im Mathe-Modus statt in \text{…}) sammeln, Formel trotzdem rendern
    katex.renderToString(text, { throwOnError: true, strict: (code, msg) => { strikt.push(`${code}: ${msg}`); return 'ignore'; }, displayMode: true, output: 'mathml' });
  } catch (e) {
    problems.push('KaTeX: ' + String(e.message).replace(/^KaTeX parse error: /, '').slice(0, 140));
  }
  return { problems, strikt };
}

const findings = [];
const warnungen = []; // KaTeX-strict-Warnungen (Z18)
// Ratsche für KaTeX-strict-Warnungen (Z18), gezählt als Formeln je Warnungsart. Mehr als hier eingetragen bricht ab.
//   unicodeTextInMathMode: Umlaut/ß im Mathe-Modus (T_{Oberfläche}) → in \text{…} setzen.
//   unknownSymbol: Zeichen ohne KaTeX-Schriftmetrik, auch in \text{…} (‰, €, ³, ², ß, §, ₂). Abhilfe: „EUR“ statt €,
//     ^2/^3/_2 statt ²/³/₂ (\text{m}^3), \S statt §, ‰ als \char8240 (im Mathe-Modus, nicht in \text{…}).
// Stand Folgepaket 10-26: alle Warnungen behoben, Grenze 0 – neue Formeln müssen warnungsfrei sein.
const GRENZE_STRIKT = { unicodeTextInMathMode: 0, unknownSymbol: 0 };
let total = 0;
for (const file of walk(ROOT)) {
  if (filter && !file.includes(filter)) continue;
  const src = fs.readFileSync(file, 'utf8');
  if (!/katex|InlineMath|BlockMath|formel|math=/i.test(src)) continue;
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = node => {
    let cand = null, kind = '';
    if (ts.isJsxAttribute(node) && MATH_PROPS.has(node.name.getText())) { cand = stringValue(node.initializer); kind = node.name.getText(); }
    else if (ts.isJsxElement(node) && /^(InlineMath|BlockMath|TeX|MathJax|Latex|Formula|FormulaBox)$/.test(node.openingElement.tagName.getText())) {
      const kids = node.children.filter(c => !(ts.isJsxText(c) && !c.text.trim()));
      if (kids.length === 1) {
        const k = kids[0];
        cand = ts.isJsxText(k) ? { text: k.text, raw: k.getText() } : stringValue(k);
        kind = node.openingElement.tagName.getText() + '>children';
      }
    }
    else if (ts.isPropertyAssignment(node) && MATH_PROPS.has(node.name.getText().replace(/['"]/g, ''))) { cand = stringValue(node.initializer); kind = node.name.getText(); }
    if (cand && cand.text.trim()) {
      total++;
      const line = sf.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      const { problems, strikt } = pruefe(cand.text);
      if (problems.length) findings.push({ file: path.relative(process.cwd(), file), line, prop: kind, problems, value: cand.text.slice(0, 160) });
      if (strikt.length) warnungen.push({ file: path.relative(process.cwd(), file), line, prop: kind, problems: strikt, value: cand.text.slice(0, 160) });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

// Ausgelagerte Fachtexte (AP 5.3): Formel-Eigenschaften in content/**/*.json und $…$ in „texte“
if (!filter || filter.includes('content')) {
  for (const datei of inhaltsDateien()) {
    for (const t of inhaltsTexte(datei)) {
      const formeln = t.gruppe === 'texte' ? mdFormeln(t.text) : t.eigenschaft && MATH_PROPS.has(t.eigenschaft) ? [t.text] : [];
      for (const f of formeln) {
        if (!f.trim()) continue;
        total++;
        const { problems, strikt } = pruefe(f);
        if (problems.length) findings.push({ file: relativ(datei), line: 0, prop: `${t.gruppe}.${t.schluessel}`, problems, value: f.slice(0, 160) });
        if (strikt.length) warnungen.push({ file: relativ(datei), line: 0, prop: `${t.gruppe}.${t.schluessel}`, problems: strikt, value: f.slice(0, 160) });
      }
    }
  }
}

if (asJson) {
  console.log(JSON.stringify({ total, findings, warnungen }, null, 1));
} else {
  for (const f of findings) console.log(`${f.file}:${f.line} [${f.prop}] ${f.problems.join(' | ')}\n    ${JSON.stringify(f.value)}`);
}
const jeArt = {};
for (const w of warnungen) for (const art of new Set(w.problems.map(p => p.split(':')[0]))) jeArt[art] = (jeArt[art] ?? 0) + 1;
const ueber = filter ? [] : Object.entries(jeArt).filter(([art, n]) => n > (GRENZE_STRIKT[art] ?? 0));
if (!asJson) {
  if (ueber.length || args.includes('--strikt')) for (const f of warnungen) console.log(`strict ${f.file}:${f.line} [${f.prop}] ${f.problems.join(' | ')}\n    ${JSON.stringify(f.value)}`);
  console.log(`\n${total} Formeln geprüft, ${findings.length} fehlerhaft; strict-Warnungen: ${Object.entries(jeArt).map(([a, n]) => `${a} ${n} (Grenze ${GRENZE_STRIKT[a] ?? 0})`).join(', ') || 'keine'}.`);
  for (const [art, n] of ueber) console.error(`Ratsche: ${n} Formeln mit „${art}“, erlaubt sind ${GRENZE_STRIKT[art] ?? 0}.`);
}
process.exit((findings.length || ueber.length) && !asJson ? 1 : 0);
