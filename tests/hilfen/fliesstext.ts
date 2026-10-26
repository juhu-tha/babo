// Fließtext-Umfang eines Moduls (AP 3.8): Wörter in JSX-Text und Zeichenketten der Moduldatei samt der von ihr
// importierten modul-eigenen Dateien (src/modules/**, content/**). Grundlage für die Kurzfassungspflicht.
// Gezählt wird über den TypeScript-Syntaxbaum; ausgelassen werden Importpfade, Zeichenketten ohne Leerzeichen
// (IDs, Schlüssel) sowie Attribute ohne Lesetext (className, style, key, id, Icons, Farben …).
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const OHNE_TEXT_ATTRIBUTE = new Set(['className', 'style', 'key', 'id', 'href', 'src', 'color', 'fill', 'stroke', 'd', 'viewBox', 'icon', 'variant', 'type', 'role', 'width', 'height', 'points', 'transform', 'math']);
const WORT = /[A-Za-zÄÖÜäöüß]{2,}/g;

function zaehleText(t: string): number {
  const tok = t.trim().split(/\s+/);
  if (tok.filter(w => /[-:/[\]#=]/.test(w)).length > 0.4 * tok.length) return 0; // CSS-Klassen u. ä.
  return (t.match(WORT) ?? []).length;
}

function woerterQuelle(code: string, datei: string): number {
  const sf = ts.createSourceFile(datei, code, ts.ScriptTarget.Latest, true, datei.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  let n = 0;
  const besuche = (k: ts.Node): void => {
    if (ts.isImportDeclaration(k) || ts.isExportDeclaration(k)) return;
    if (ts.isJsxAttribute(k) && OHNE_TEXT_ATTRIBUTE.has(k.name.getText(sf))) return;
    if (ts.isCallExpression(k) && /^(import|require)$/.test(k.expression.getText(sf))) return;
    if (ts.isJsxText(k)) n += zaehleText(k.text);
    else if (ts.isStringLiteral(k) || ts.isNoSubstitutionTemplateLiteral(k)) { if (/\s/.test(k.text.trim())) n += zaehleText(k.text); }
    else if (ts.isTemplateExpression(k)) {
      const teile = [k.head.text, ...k.templateSpans.map(s => s.literal.text)].join(' ');
      if (/\s/.test(teile.trim())) n += zaehleText(teile);
    }
    ts.forEachChild(k, besuche);
  };
  besuche(sf);
  return n;
}

function woerterJson(wert: unknown): number {
  if (typeof wert === 'string') return /\s/.test(wert.trim()) ? zaehleText(wert) : 0;
  if (Array.isArray(wert)) return wert.reduce((s: number, w) => s + woerterJson(w), 0);
  if (wert && typeof wert === 'object') return Object.values(wert).reduce((s: number, w) => s + woerterJson(w), 0);
  return 0;
}

function aufloesen(von: string, spec: string): string | undefined {
  if (!spec.startsWith('.')) return undefined;
  const b = path.resolve(path.dirname(von), spec);
  return [b, b + '.tsx', b + '.ts', b + '/index.tsx', b + '/index.ts'].find(c => fs.existsSync(c) && fs.statSync(c).isFile());
}

/** Wörter einer Moduldatei samt modul-eigener Importe (src/modules/**, content/**) */
export function fliesstextWoerter(einstieg: string): number {
  const gesehen = new Set<string>();
  let summe = 0;
  const sammle = (datei: string) => {
    if (gesehen.has(datei)) return;
    gesehen.add(datei);
    const code = fs.readFileSync(datei, 'utf8');
    if (datei.endsWith('.json')) { summe += woerterJson(JSON.parse(code)); return; }
    summe += woerterQuelle(code, datei);
    for (const m of code.matchAll(/(?:import|from)\s*\(?\s*['"]([^'"]+)['"]/g)) {
      const z = aufloesen(datei, m[1]);
      if (z && /[/\\](src[/\\]modules|content)[/\\]/.test(z)) sammle(z);
    }
  };
  sammle(path.resolve(einstieg));
  return summe;
}

/** Modul-ID → Einstiegsdatei der Komponente laut src/routing/ModulInhalt.tsx; nur IDs mit eigener Komponente
 *  (Komponenten, die mehrere IDs über Reiter bedienen, sind nicht eindeutig zuzuordnen und bleiben außen vor). */
export function modulDateien(root = process.cwd()): Map<string, string> {
  const mi = fs.readFileSync(path.join(root, 'src/routing/ModulInhalt.tsx'), 'utf8');
  const komp = new Map([...mi.matchAll(/const (\w+) = React\.lazy\(\(\) => import\('([^']+)'\)/g)].map(m => [m[1], m[2]]));
  const tabs = [...mi.matchAll(/activeTab === '([^']+)' && <(\w+)/g)].map(m => ({ id: m[1], komp: m[2] }));
  const jeKomp = new Map<string, number>();
  for (const t of tabs) jeKomp.set(t.komp, (jeKomp.get(t.komp) ?? 0) + 1);
  const ergebnis = new Map<string, string>();
  for (const t of tabs) {
    const spec = komp.get(t.komp);
    if (!spec || jeKomp.get(t.komp)! > 1) continue;
    const datei = aufloesen(path.join(root, 'src/routing/ModulInhalt.tsx'), spec);
    if (datei) ergebnis.set(t.id, datei);
  }
  return ergebnis;
}
