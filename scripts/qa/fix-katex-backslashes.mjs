// Repariert verdoppelte Backslashes in KaTeX-Formeln (einmalige Korrektur).
// JSX-Attribut ohne Klammern (math="…"): Escapes werden dort nicht ausgewertet, also "\\cdot" → "\cdot".
// JS-String ('…' oder `…`): "\\\\cdot" (ergibt \\cdot) → "\\cdot" (ergibt \cdot).
import ts from 'typescript';
import fs from 'fs';

const files = process.argv.slice(2);
const MATH_PROPS = new Set(['math', 'formel', 'formula', 'latex', 'tex', 'katex', 'equation', 'gleichung']);
let total = 0;
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const consider = (lit, inJsxAttr) => {
    const raw = lit.getText(sf);
    const q = raw[0], body = raw.slice(1, -1);
    if (inJsxAttr && (q === '"' || q === "'")) {
      // cooked == raw: doppelte Backslashes vor Befehlen/Abständen halbieren
      if (!/\\\\[a-zA-Z,;:!{}%# ]/.test(body)) return;
      const fixed = body.replace(/\\\\/g, '\\');
      edits.push([lit.getStart(sf) + 1, lit.getEnd() - 1, fixed]);
    } else {
      // JS-Literal: vierfacher Backslash im Quelltext vor Befehl → zweifach
      if (!/\\\\\\\\[a-zA-Z,;:!{}%# ]/.test(body)) return;
      const fixed = body.replace(/\\\\\\\\/g, '\\\\');
      edits.push([lit.getStart(sf) + 1, lit.getEnd() - 1, fixed]);
    }
  };
  const visit = node => {
    if (ts.isJsxAttribute(node) && MATH_PROPS.has(node.name.getText(sf)) && node.initializer) {
      const init = node.initializer;
      if (ts.isStringLiteral(init)) consider(init, true);
      else if (ts.isJsxExpression(init) && init.expression && (ts.isStringLiteral(init.expression) || ts.isNoSubstitutionTemplateLiteral(init.expression))) consider(init.expression, false);
    } else if (ts.isPropertyAssignment(node) && MATH_PROPS.has(node.name.getText(sf).replace(/['"]/g, ''))) {
      const init = node.initializer;
      if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) consider(init, false);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!edits.length) continue;
  let out = src;
  for (const [a, b, t] of edits.sort((x, y) => y[0] - x[0])) out = out.slice(0, a) + t + out.slice(b);
  fs.writeFileSync(file, out);
  total += edits.length;
  console.log(`${file}: ${edits.length} Formeln korrigiert`);
}
console.log(`Gesamt: ${total}`);
