#!/usr/bin/env node
/**
 * Anteil ausgelagerter Fachtexte (Umsetzungsplan Phase 5, AP 5.3; Ziel ≥ 60 %)
 * Zählt Zeichen menschenlesbarer Texte in src/modules/** (JSX-Text, Text-Props, Zeichenketten in Daten/Code –
 * ohne Klassen, URLs, IDs, Vergleiche) und in content/<modul>/*.json (alle Zeichenketten nach derselben Regel).
 *   node scripts/qa/inhalt-anteil.mjs [--top 15]
 */
import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { inhaltsDateien, inhaltsTexte } from './inhaltDateien.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const MODULE = path.join(ROOT, 'src/modules');
const TOP = Number(process.argv[process.argv.indexOf('--top') + 1]) || 15;
const TECH = /^(className|class|style|key|id|href|src|type|role|d|viewBox|fill|stroke|points|transform|target|rel|name|htmlFor|value|defaultValue|width|height|x|y|cx|cy|r|accept|inputMode|mode|variant|size|color|icon|lang|step|min|max|pattern|autoComplete|data-[\w-]+|aria-hidden|strokeWidth|textAnchor|fontSize|fontWeight|offset|stopColor|xmlns)$/;
const TECH_KEY = /^(className|color|bg|textColor|border|icon|key|id|href|url|gestisUrl|farbe|style|bgColor|borderColor|iconColor|tw|klasse|klassen)$/i;

/** Menschenlesbarer Text? (Buchstabe, keine Klassenliste/URL/ID) */
export function istText(s) {
  const t = s.trim();
  if (t.length < 2 || !/\p{L}/u.test(t)) return false;
  if (/^(https?:|www\.|\/|#|\.\.?\/|@\/)/.test(t)) return false;
  if (!/\s/.test(t) && /^[a-z0-9_\-:/[\]\.#%!]+$/.test(t)) return false;
  const toks = t.split(/\s+/);
  return !(toks.every(k => /^[a-z0-9:\-/[\]\.#%!_()&>]+$/.test(k)) && toks.some(k => k.includes('-')));
}

const proModul = new Map();
const plus = (mod, k, n) => { const m = proModul.get(mod) ?? { tsx: 0, content: 0 }; m[k] += n; proModul.set(mod, m); };

for (const rel of fs.readdirSync(MODULE, { recursive: true }).filter(f => /\.tsx?$/.test(f))) {
  const f = path.join(MODULE, rel);
  const sf = ts.createSourceFile(f, fs.readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true, f.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const mod = rel.includes(path.sep) ? rel.split(path.sep)[0].toLowerCase() : rel.replace(/\.tsx?$/, '').toLowerCase();
  const v = n => {
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) return;
    let s = null;
    if (ts.isJsxText(n)) s = n.text.replace(/\s+/g, ' ');
    else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) {
      s = n.text;
      const p = ts.isJsxExpression(n.parent) ? n.parent.parent : n.parent;
      if (ts.isJsxAttribute(p) && TECH.test(p.name.getText())) s = null;
      else if (ts.isPropertyAssignment(n.parent) && (n.parent.name === n || TECH_KEY.test(n.parent.name.getText()))) s = null;
      else if (ts.isCallExpression(n.parent) && /^(cn|clsx|useState)$/.test(n.parent.expression.getText())) s = null;
      else if (ts.isBinaryExpression(n.parent) && /===|!==|==/.test(n.parent.operatorToken.getText())) s = null;
      else if (ts.isCaseClause(n.parent) || ts.isElementAccessExpression(n.parent) || ts.isLiteralTypeNode(n.parent)) s = null;
    }
    if (s && istText(s)) plus(mod, 'tsx', s.trim().length);
    ts.forEachChild(n, v);
  };
  v(sf);
}
for (const datei of inhaltsDateien()) {
  const mod = path.relative(path.join(ROOT, 'content'), datei).split(path.sep)[0];
  for (const t of inhaltsTexte(datei)) if (!(t.eigenschaft && TECH_KEY.test(t.eigenschaft)) && istText(t.text)) plus(mod, 'content', t.text.trim().length);
}

let tsx = 0, content = 0;
for (const m of proModul.values()) { tsx += m.tsx; content += m.content; }
const pz = (a, b) => (100 * a / Math.max(a + b, 1)).toFixed(1).replace('.', ',');
console.log(`Fachtext: ${content.toLocaleString('de-DE')} Zeichen in content/, ${tsx.toLocaleString('de-DE')} im TSX → ${pz(content, tsx)} % ausgelagert`);
const rest = [...proModul].sort((a, b) => b[1].tsx - a[1].tsx).slice(0, TOP);
console.log(`Meiste verbliebene Texte im TSX:`);
for (const [k, m] of rest) console.log(`  ${String(m.tsx).padStart(7)} Zeichen TSX, ${pz(m.content, m.tsx).padStart(5)} % ausgelagert  ${k}`);
