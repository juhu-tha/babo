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
  // Inline-Markdown (content/…/„texte“): $TeX$ zählt wie math="…" nicht, <sub>/<sup>/<br> sind keine Wörter
  if (typeof wert === 'string') { const t = wert.replace(/\$[^$]+\$/g, ' ').replace(/<\/?(sub|sup|br)>/g, ' '); return /\s/.test(t.trim()) ? zaehleText(t) : 0; }
  if (Array.isArray(wert)) return wert.reduce((s: number, w) => s + woerterJson(w), 0);
  if (wert && typeof wert === 'object') return Object.values(wert).reduce((s: number, w) => s + woerterJson(w), 0);
  return 0;
}

function aufloesen(von: string, spec: string): string | undefined {
  // relativ oder über den Alias @/ (Projektwurzel, z. B. '@/content/<modul>/<Datei>.json')
  if (!spec.startsWith('.') && !spec.startsWith('@/')) return undefined;
  const b = spec.startsWith('@/') ? path.resolve(process.cwd(), spec.slice(2)) : path.resolve(path.dirname(von), spec);
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

// ---------------------------------------------------------------------------------------------------------------
// Ansichtsumfang (Z53): Wörter, die unter einer Modul-ID tatsächlich erreichbar sind. Einstieg ist
// src/routing/ModulInhalt.tsx mit activeTab = <id>; Wächter der Form `x === 'wert'`, `f('wert')`, `x.includes('wert')`
// (auch mit !, &&, ||, ?: und if) werden gegen die bekannte Auswahl ausgewertet, unerreichbare Zweige zählen nicht.
// Zeichenketten-Attribute an modul-eigenen Komponenten (forceTab="system", teil="rechner", bereiche={['a', 'b']})
// werden zur Auswahl der Kindkomponente; `const a = b || c` und `const f = (p) => b.includes(p)` übernehmen die
// Auswahl von b, `OBJ[b]` auf ein Objektliteral lässt nur dessen Schlüssel aus der Auswahl von b zählen.
// Texte aus content/**.json zählen nur, soweit sie in einem erreichbaren Zweig referenziert werden (je Pfad einmal).
// Unbekannte Bedingungen zählen beide Zweige (eher zu viel als zu wenig).

type Auswahl = Readonly<Record<string, readonly string[]>>;

export interface Ansicht {
  /** Wörter der Ansicht */
  woerter: number;
  /** In einem erreichbaren Zweig wird ModuleTabs bzw. GruppierteModuleTabs gerendert */
  reiter: boolean;
  /** größte lexikalische Schachtelung von ModuleTabs/GruppierteModuleTabs (über Komponentengrenzen; GruppierteModuleTabs zählt als eine Ebene) */
  ebenen: number;
  /** beteiligte Dateien (relativ zur Projektwurzel) */
  dateien: string[];
}

function jsonPfadWert(obj: unknown, pfad: string[]): { wert: unknown; laenge: number } {
  let w: unknown = obj;
  let i = 0;
  for (; i < pfad.length; i++) {
    if (w && typeof w === 'object' && pfad[i] in (w as Record<string, unknown>)) w = (w as Record<string, unknown>)[pfad[i]];
    else break;
  }
  return { wert: w, laenge: i };
}

function letzterName(e: ts.Expression): string | undefined {
  if (ts.isIdentifier(e)) return e.text;
  if (ts.isPropertyAccessExpression(e)) return e.name.text;
  if (ts.isParenthesizedExpression(e) || ts.isAsExpression(e)) return letzterName(e.expression);
  return undefined;
}

function literalWerte(e: ts.Expression | undefined): string[] | undefined {
  if (!e) return undefined;
  if (ts.isParenthesizedExpression(e) || ts.isAsExpression(e)) return literalWerte(e.expression);
  if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return [e.text];
  if (ts.isArrayLiteralExpression(e)) {
    const w = e.elements.map(x => (ts.isStringLiteral(x) ? x.text : undefined));
    return w.every((x): x is string => x !== undefined) ? w : undefined;
  }
  return undefined;
}

export function ansichtWoerter(id: string, root = process.cwd()): Ansicht {
  const json = new Set<string>();
  const besucht = new Set<string>();
  const dateien = new Set<string>();
  let woerter = 0;
  let reiter = false;
  let ebenen = 0;

  const datei = (pfad: string, auswahl: Auswahl, basis = 0) => {
    let tiefe = basis;
    const schluessel = `${pfad}|${JSON.stringify(auswahl)}`;
    if (besucht.has(schluessel)) return;
    besucht.add(schluessel);
    dateien.add(path.relative(root, pfad));
    const code = fs.readFileSync(pfad, 'utf8');
    if (pfad.endsWith('.json')) { woerter += woerterJson(JSON.parse(code)); return; }
    const sf = ts.createSourceFile(pfad, code, ts.ScriptTarget.Latest, true, pfad.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const wahl: Record<string, readonly string[]> = { ...auswahl };
    const jsonImporte = new Map<string, { pfad: string; obj: unknown }>();
    const lokale = new Map<string, string>();
    const ladeFunktionen = new Map<string, string>();
    const eigen = (z: string | undefined) => (z && /[/\\](src[/\\]modules|content)[/\\]/.test(z) ? z : undefined);

    // Vorlauf: Importe, React.lazy, Auswahl-Aliase, Objekt-Einschränkungen
    const objektErlaubt = new Map<ts.ObjectLiteralExpression, readonly string[]>();
    const objektKonstanten = new Map<string, ts.ObjectLiteralExpression>();
    const vorlauf = (k: ts.Node): void => {
      if (ts.isImportDeclaration(k) && ts.isStringLiteral(k.moduleSpecifier) && !k.importClause?.isTypeOnly) {
        const z = eigen(aufloesen(pfad, k.moduleSpecifier.text));
        const c = k.importClause;
        if (z && c) {
          const benannt = c.namedBindings && ts.isNamedImports(c.namedBindings) ? c.namedBindings.elements.filter(e => !e.isTypeOnly).map(e => e.name.text) : [];
          for (const n of [c.name?.text, ...benannt]) {
            if (!n) continue;
            if (z.endsWith('.json')) jsonImporte.set(n, { pfad: z, obj: JSON.parse(fs.readFileSync(z, 'utf8')) });
            else lokale.set(n, z);
          }
        }
      }
      if (ts.isVariableDeclaration(k) && ts.isIdentifier(k.name) && k.initializer) {
        const init = k.initializer;
        const lazy = init.getText(sf).match(/^React\.lazy\(\(\) => import\('([^']+)'\)/);
        if (lazy) { const z = eigen(aufloesen(pfad, lazy[1])); if (z) lokale.set(k.name.text, z); }
        // const lade = () => import('./x'); const X = React.lazy(lade);
        const lader = init.getText(sf).match(/^\(\) => import\('([^']+)'\)$/);
        if (lader) { const z = eigen(aufloesen(pfad, lader[1])); if (z) ladeFunktionen.set(k.name.text, z); }
        const lazyRef = init.getText(sf).match(/^React\.lazy\((\w+)\)$/);
        if (lazyRef && ladeFunktionen.has(lazyRef[1])) lokale.set(k.name.text, ladeFunktionen.get(lazyRef[1])!);
        if (ts.isBinaryExpression(init) && init.operatorToken.kind === ts.SyntaxKind.BarBarToken) {
          const b = letzterName(init.left);
          if (b && wahl[b]) wahl[k.name.text] = wahl[b];
        }
        if (ts.isArrowFunction(init) && init.parameters.length === 1 && ts.isCallExpression(init.body)
          && ts.isPropertyAccessExpression(init.body.expression) && init.body.expression.name.text === 'includes') {
          const b = letzterName(init.body.expression.expression);
          if (b && wahl[b]) wahl[k.name.text] = wahl[b];
        }
        if (ts.isObjectLiteralExpression(init)) objektKonstanten.set(k.name.text, init);
      }
      ts.forEachChild(k, vorlauf);
    };
    vorlauf(sf);
    const objektSuche = (k: ts.Node): void => {
      if (ts.isElementAccessExpression(k) && ts.isIdentifier(k.expression)) {
        const obj = objektKonstanten.get(k.expression.text);
        const b = letzterName(k.argumentExpression);
        if (obj && b && wahl[b]) objektErlaubt.set(obj, wahl[b]);
      }
      ts.forEachChild(k, objektSuche);
    };
    objektSuche(sf);

    const pruefe = (e: ts.Expression): boolean | undefined => {
      if (ts.isParenthesizedExpression(e)) return pruefe(e.expression);
      if (ts.isPrefixUnaryExpression(e) && e.operator === ts.SyntaxKind.ExclamationToken) { const r = pruefe(e.operand); return r === undefined ? undefined : !r; }
      if (ts.isBinaryExpression(e)) {
        const op = e.operatorToken.kind;
        if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.AmpersandAmpersandToken) {
          const l = pruefe(e.left), r = pruefe(e.right);
          if (op === ts.SyntaxKind.BarBarToken) return l === true || r === true ? true : l === false && r === false ? false : undefined;
          return l === false || r === false ? false : l === true && r === true ? true : undefined;
        }
        const gleich = op === ts.SyntaxKind.EqualsEqualsEqualsToken || op === ts.SyntaxKind.EqualsEqualsToken;
        const ungleich = op === ts.SyntaxKind.ExclamationEqualsEqualsToken || op === ts.SyntaxKind.ExclamationEqualsToken;
        if (gleich || ungleich) {
          const lit = ts.isStringLiteral(e.right) ? e.right.text : ts.isStringLiteral(e.left) ? e.left.text : undefined;
          const n = letzterName(ts.isStringLiteral(e.right) ? e.left : e.right);
          if (lit !== undefined && n && wahl[n]) return wahl[n].includes(lit) === gleich;
        }
        return undefined;
      }
      if (ts.isCallExpression(e) && e.arguments.length === 1 && ts.isStringLiteral(e.arguments[0])) {
        const lit = e.arguments[0].text;
        if (ts.isIdentifier(e.expression) && wahl[e.expression.text]) return wahl[e.expression.text].includes(lit);
        if (ts.isPropertyAccessExpression(e.expression) && e.expression.name.text === 'includes') {
          const n = letzterName(e.expression.expression);
          if (n && wahl[n]) return wahl[n].includes(lit);
        }
        if (ts.isPropertyAccessExpression(e.expression) && e.expression.name.text === 'startsWith') {
          const n = letzterName(e.expression.expression);
          if (n && wahl[n]) return wahl[n].some(w => w.startsWith(lit));
        }
      }
      return undefined;
    };

    const zugriffPfad = (e: ts.Expression): { wurzel: string; pfad: string[] } | undefined => {
      const teile: string[] = [];
      let k: ts.Expression = e;
      for (;;) {
        if (ts.isPropertyAccessExpression(k)) { teile.unshift(k.name.text); k = k.expression; }
        else if (ts.isElementAccessExpression(k) && ts.isStringLiteral(k.argumentExpression)) { teile.unshift(k.argumentExpression.text); k = k.expression; }
        else break;
      }
      return ts.isIdentifier(k) && jsonImporte.has(k.text) ? { wurzel: k.text, pfad: teile } : undefined;
    };

    const kindAuswahl = (attrs: ts.JsxAttributes): Auswahl => {
      const a: Record<string, readonly string[]> = {};
      for (const p of attrs.properties) {
        if (!ts.isJsxAttribute(p) || !p.initializer) continue;
        const w = ts.isStringLiteral(p.initializer) ? [p.initializer.text] : ts.isJsxExpression(p.initializer) ? literalWerte(p.initializer.expression) : undefined;
        if (w) a[p.name.getText(sf)] = w;
      }
      return a;
    };

    const besuche = (k: ts.Node): void => {
      if (ts.isImportDeclaration(k) || ts.isExportDeclaration(k) || ts.isTypeAliasDeclaration(k) || ts.isInterfaceDeclaration(k) || ts.isJsxClosingElement(k)) return;
      if (ts.isJsxAttribute(k) && OHNE_TEXT_ATTRIBUTE.has(k.name.getText(sf))) return;
      if (ts.isCallExpression(k) && /^(import|require|React\.lazy)$/.test(k.expression.getText(sf))) return;
      if (ts.isBinaryExpression(k) && k.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) {
        const g = pruefe(k.left);
        besuche(k.left);
        if (g !== false) besuche(k.right);
        return;
      }
      if (ts.isConditionalExpression(k)) {
        const g = pruefe(k.condition);
        besuche(k.condition);
        if (g !== false) besuche(k.whenTrue);
        if (g !== true) besuche(k.whenFalse);
        return;
      }
      if (ts.isIfStatement(k)) {
        const g = pruefe(k.expression);
        if (g !== false) besuche(k.thenStatement);
        if (g !== true && k.elseStatement) besuche(k.elseStatement);
        return;
      }
      if (ts.isObjectLiteralExpression(k) && objektErlaubt.has(k)) {
        const erlaubt = objektErlaubt.get(k)!;
        for (const p of k.properties) {
          const n = p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : undefined;
          if (n === undefined || erlaubt.includes(n)) besuche(p);
        }
        return;
      }
      if (ts.isPropertyAccessExpression(k) || ts.isElementAccessExpression(k)) {
        const z = zugriffPfad(k);
        if (z) {
          const imp = jsonImporte.get(z.wurzel)!;
          const { wert, laenge } = jsonPfadWert(imp.obj, z.pfad);
          const schl = `${imp.pfad}#${z.pfad.slice(0, laenge).join('.')}`;
          // Präfixe bereits gezählter Pfade (und umgekehrt) nicht doppelt zählen
          if (![...json].some(s => s === schl || s.startsWith(schl + '.') || schl.startsWith(s + '.'))) {
            json.add(schl);
            dateien.add(path.relative(root, imp.pfad));
            woerter += woerterJson(wert);
          }
          return;
        }
      }
      if (ts.isJsxElement(k) && /^(ModuleTabs|GruppierteModuleTabs)$/.test(k.openingElement.tagName.getText(sf))) {
        besuche(k.openingElement);
        tiefe++;
        ebenen = Math.max(ebenen, tiefe);
        k.children.forEach(besuche);
        tiefe--;
        return;
      }
      if (ts.isJsxSelfClosingElement(k) || ts.isJsxOpeningElement(k)) {
        const tag = k.tagName.getText(sf);
        if (tag === 'ModuleTabs' || tag === 'GruppierteModuleTabs') { reiter = true; ebenen = Math.max(ebenen, tiefe + 1); }
        const z = lokale.get(tag);
        if (z) datei(z, kindAuswahl(k.attributes), tiefe);
        besuche(k.attributes);
        return;
      }
      if (ts.isVariableDeclaration(k) && ts.isIdentifier(k.name) && lokale.has(k.name.text)) return; // const X = React.lazy(…)
      if (ts.isIdentifier(k) && lokale.has(k.text) && !(ts.isPropertyAccessExpression(k.parent) && k.parent.name === k)) { datei(lokale.get(k.text)!, {}, tiefe); return; }
      if (ts.isJsxText(k)) woerter += zaehleText(k.text);
      else if (ts.isStringLiteral(k) || ts.isNoSubstitutionTemplateLiteral(k)) { if (/\s/.test(k.text.trim())) woerter += zaehleText(k.text); }
      else if (ts.isTemplateExpression(k)) {
        const teile = [k.head.text, ...k.templateSpans.map(s => s.literal.text)].join(' ');
        if (/\s/.test(teile.trim())) woerter += zaehleText(teile);
      }
      ts.forEachChild(k, besuche);
    };
    besuche(sf);
  };

  datei(path.join(root, 'src/routing/ModulInhalt.tsx'), { activeTab: [id] });
  dateien.delete(path.join('src', 'routing', 'ModulInhalt.tsx'));
  return { woerter, reiter, ebenen, dateien: [...dateien].sort() };
}
