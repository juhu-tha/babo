// Prüfung „Kein Ergebnis in der Anzeige“ (02.11.2026, docs/pruefung/kein-ergebnis-anzeige-2026-11-02.md).
// Seit der Grenzfallprüfung der Rechenkerne (#305) liefern alle Kerne bei ungültiger Eingabe NaN. Diese Prüfung
// sucht mit dem TypeScript-Compiler in den Anzeige-Dateien (.tsx unter src/) jede Ausgabe eines Kernwerts
// (Zahl, deren Herkunft eine Eigenschaft eines Kern-Ergebnisses aus src/calc/ oder den Kernen in src/utils/ ist),
// die NICHT über einen NaN-festen Formatierer läuft:
//   T  Template-String  `${erg.x} mm` bzw. KaTeX-Formel mit eingesetztem Wert
//   F  .toFixed / .toPrecision / .toExponential / .toString / String(…) / .toLocaleString
//   J  rohe Zahl als JSX-Kind {erg.x}
//   P  Zahl + Text  (erg.x + ' mm')
//   V  Vergleich mit Kernwert als Bedingung einer Textauswahl (x > grenz ? 'ok' : …) – NaN führt immer in den
//      else-Zweig; gemeldet, wenn der else-Zweig (bzw. bei < der then-Zweig) wie ein Erfolg aussieht oder die
//      Bedingung keinen Endlichkeits-/Gültigkeitsschutz hat und einen Erfolgstext auswählt.
// NaN-feste Formatierer: formatDe*, fmt*-Helfer aus numberFormat und lokal definierte Helfer, deren Rumpf
// Number.isFinite/isNaN/formatDe* enthält. Ausnahmen mit Begründung in AUSNAHMEN (Datei:Zeile-Muster).
import ts from 'typescript'; import fs from 'node:fs'; import path from 'node:path';

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const KERN_DATEI = /\/src\/calc\/|\/src\/utils\/(bestandKern|ec2Spannbeton|rheologySim|schadensKern)\.ts$/;
// Erfolg bzw. Fehlschlag im Code eines Zweigs (Text, Farbklasse, Symbol)
const ERFOLG_CODE = /emerald|green|bu-ok|bu-gruen|CheckCircle|#059669|#16a34a|\b(ok|erfüllt|eingehalten|nachgewiesen|ausreichend|zulässig|bestanden|zufriedenstellend|normkonform|unkritisch|sicher|Ausreichend|Zufriedenstellend)\b|✓|✔/i;
const FEHLSCHLAG_CODE = /nicht|rose|red-|#dc2626|fehler|AlertTriangle|XCircle|ShieldAlert|überschritten|unzureichend|zuGering|warn|kritisch|amber/i;

/** Dateien, die Kerne importieren (Anzeige-Schicht). */
export function anzeigeDateien(repo = REPO) {
  const aus = [];
  (function w(d) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) w(p);
      else if (/\.tsx$/.test(f)) {
        const s = fs.readFileSync(p, 'utf8');
        if (/from\s+['"][^'"]*(\/calc\/|utils\/(bestandKern|ec2Spannbeton|rheologySim|schadensKern))/.test(s)) aus.push(p);
      }
    }
  })(path.join(repo, 'src'));
  return aus.sort();
}

export function scanne(repo = REPO, dateien = anzeigeDateien(repo)) {
  const cfg = ts.getParsedCommandLineOfConfigFile(path.join(repo, 'tsconfig.json'), {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} });
  const prog = ts.createProgram(dateien, { ...cfg.options, noEmit: true });
  const tc = prog.getTypeChecker();
  const befunde = [];
  const set = new Set(dateien);

  const istZahl = (n) => { const t = tc.getTypeAtLocation(n); return !!(t.flags & ts.TypeFlags.NumberLike) || (t.isUnion() && t.types.every((x) => x.flags & (ts.TypeFlags.NumberLike | ts.TypeFlags.Undefined | ts.TypeFlags.Null)) && t.types.some((x) => x.flags & ts.TypeFlags.NumberLike)); };
  const ausKern = (decl) => !!decl && KERN_DATEI.test(decl.getSourceFile().fileName);

  // Kernherkunft: Ausdruck enthält eine Eigenschaft eines Kern-Ergebnisses oder eine lokale Variable, die daraus stammt.
  const besucht = new Map();
  function kernwert(n, tiefe = 0) {
    if (tiefe > 6) return false;
    let gefunden = false;
    const v = (k) => {
      if (gefunden) return;
      // Formatierer und Funktionsaufrufe schirmen ab (Ergebnis eines Aufrufs zählt nur, wenn die Funktion ein Kern ist)
      if (ts.isCallExpression(k)) {
        const sym = tc.getSymbolAtLocation(ts.isPropertyAccessExpression(k.expression) ? k.expression.name : k.expression);
        const d = sym && (sym.flags & ts.SymbolFlags.Alias ? tc.getAliasedSymbol(sym) : sym).declarations?.[0];
        if (ausKern(d) && istZahl(k)) { gefunden = true; return; }
        if (ts.isPropertyAccessExpression(k.expression) && /^(map|filter|reduce|find|at|slice)$/.test(k.expression.name.text)) { ts.forEachChild(k.expression.expression, v); return; }
        if (ts.isPropertyAccessExpression(k.expression) && /^(max|min|abs|round|floor|ceil|sqrt|log10|pow|exp)$/.test(k.expression.name.text) && k.expression.expression.getText() === 'Math') { k.arguments.forEach(v); return; }
        return;
      }
      if (ts.isPropertyAccessExpression(k) || ts.isElementAccessExpression(k)) {
        const sym = tc.getSymbolAtLocation(ts.isPropertyAccessExpression(k) ? k.name : k.argumentExpression);
        if (sym?.declarations?.some(ausKern) && istZahl(k)) { gefunden = true; return; }
        ts.forEachChild(k, v); return;
      }
      if (ts.isIdentifier(k)) {
        const sym = tc.getSymbolAtLocation(k);
        const d = sym?.valueDeclaration;
        if (!d || !set.has(d.getSourceFile().fileName)) return;
        const key = d.pos + ':' + d.getSourceFile().fileName;
        if (besucht.has(key)) { gefunden = besucht.get(key); return; }
        besucht.set(key, false);
        let r = false;
        if (ts.isVariableDeclaration(d) && d.initializer) r = kernwert(d.initializer, tiefe + 1);
        else if (ts.isBindingElement(d)) {
          const prop = (d.propertyName ?? d.name).getText();
          let p = d.parent; while (p && !ts.isVariableDeclaration(p)) p = p.parent;
          if (p?.initializer) {
            const t = tc.getTypeAtLocation(p.initializer);
            const ps = t.getProperty?.(prop);
            r = !!ps?.declarations?.some(ausKern) || kernwert(p.initializer, tiefe + 1) && istZahl(d.name);
          }
        }
        besucht.set(key, r); gefunden = r; return;
      }
      ts.forEachChild(k, v);
    };
    v(n);
    return gefunden;
  }

  // NaN-feste Helfer: formatDe*, Helfer aus numberFormat, lokale Funktionen mit Endlichkeitsprüfung
  function istFormatierer(call) {
    const e = call.expression;
    const name = ts.isPropertyAccessExpression(e) ? e.name.text : ts.isIdentifier(e) ? e.text : '';
    if (/^formatDe|^format(Zahl|Wert|Ganz)|^umgruppiere/.test(name)) return true;
    const sym = tc.getSymbolAtLocation(ts.isPropertyAccessExpression(e) ? e.name : e);
    const s = sym && (sym.flags & ts.SymbolFlags.Alias ? tc.getAliasedSymbol(sym) : sym);
    const d = s?.declarations?.[0];
    if (!d) return false;
    if (/numberFormat|zahlFormat|formatierung/i.test(d.getSourceFile().fileName)) return true;
    const txt = d.getText();
    return /isFinite|isNaN|formatDe|Number\.isFinite/.test(txt);
  }
  // liegt n innerhalb eines Formatierer-Aufrufs (als Argument)?
  function geschuetzt(n) {
    let p = n.parent, k = n;
    while (p) {
      if (ts.isCallExpression(p) && p.arguments.includes(k) && istFormatierer(p)) return true;
      if (ts.isTemplateSpan(p) || ts.isJsxExpression(p) || ts.isBlock(p) || ts.isSourceFile(p)) return false;
      // Bedingter Ausdruck mit Endlichkeitsprüfung: isFinite(x) ? `${x}` : '–'
      if (ts.isConditionalExpression(p) && /isFinite|isNaN|gueltig|valid|ok\b|fehler/i.test(p.condition.getText())) return true;
      if (ts.isBinaryExpression(p) && p.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken && /isFinite|isNaN|gueltig|valid|fehler/i.test(p.left.getText())) return true;
      k = p; p = p.parent;
    }
    return false;
  }
  // umgebende Gültigkeitsprüfung (JSX-Zweig nur bei gültigem Ergebnis): {erg.gueltig && …}, if (!erg.gueltig) return
  function imGueltigZweig(n) {
    let p = n.parent;
    while (p && !ts.isSourceFile(p)) {
      if (ts.isConditionalExpression(p) && /isFinite|isNaN|gueltig|valid|fehler|hatFehler/i.test(p.condition.getText())) return true;
      if (ts.isBinaryExpression(p) && p.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken && /isFinite|isNaN|gueltig|valid|fehler|hatFehler/i.test(p.left.getText())) return true;
      if (ts.isIfStatement(p) && /isFinite|isNaN|gueltig|valid|fehler|hatFehler/i.test(p.expression.getText())) return true;
      p = p.parent;
    }
    return false;
  }
  const STIL = /^(style|className|d|points|transform|x|y|x1|x2|y1|y2|cx|cy|r|rx|ry|width|height|left|top|right|bottom|viewBox|strokeDasharray|strokeWidth|fill|stroke|path|href|src|key|id|opacity|fontSize|offset|dx|dy|domain|ticks|value|data-[a-z-]+)$/;
  function imStil(n) {
    let p = n.parent;
    for (let i = 0; i < 8 && p; i++, p = p.parent) {
      if (ts.isJsxAttribute(p)) return STIL.test(p.name.getText());
      if (ts.isPropertyAssignment(p) && STIL.test(p.name.getText())) return true;
      if (ts.isCallExpression(p) && /setAttribute|translate|rotate|scale|rgba|hsl|calc|moveTo|lineTo|querySelector|getElementById/.test(p.expression.getText())) return true;
      if (ts.isTemplateExpression(p)) {
        const roh = p.getText().slice(1, -1).replace(/\$\{(?:[^{}]|\{[^{}]*\})*\}/g, '');
        if (/^[\s,;()MLHVCQAZmlhvcqaz.-]*$/.test(roh.replace(/px|%|deg|rem|em|vh|vw|ms/g, ''))) return true;
      }
      if (ts.isJsxElement(p) || ts.isFunctionDeclaration(p)) return false;
    }
    return false;
  }

  const meld = (sf, n, art, text) => {
    const { line } = sf.getLineAndCharacterOfPosition(n.getStart());
    befunde.push({ datei: path.relative(repo, sf.fileName), zeile: line + 1, art, text: text.replace(/\s+/g, ' ').slice(0, 140), gueltigZweig: imGueltigZweig(n) });
  };

  for (const f of dateien) {
    const sf = prog.getSourceFile(f);
    if (!sf) continue;
    const v = (n) => {
      // T: Template-Span
      if (ts.isTemplateSpan(n) && istZahl(n.expression) && kernwert(n.expression) && !geschuetzt(n.expression) && !imStil(n.expression)) meld(sf, n.expression, 'T', n.parent.getText());
      // F: toFixed & Co.
      const nurRundung = (k) => ts.isCallExpression(k.parent) && /^(Number|parseFloat)$/.test(k.parent.expression.getText());
      if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && /^(toFixed|toPrecision|toExponential|toString|toLocaleString)$/.test(n.expression.name.text) && istZahl(n.expression.expression) && kernwert(n.expression.expression) && !imStil(n) && !nurRundung(n) && !geschuetzt(n)) meld(sf, n, 'F', n.getText());
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'String' && n.arguments[0] && istZahl(n.arguments[0]) && kernwert(n.arguments[0]) && !imStil(n)) meld(sf, n, 'F', n.getText());
      // J: rohe Zahl als JSX-Kind
      if (ts.isJsxExpression(n) && n.expression && (ts.isJsxElement(n.parent) || ts.isJsxFragment(n.parent)) && istZahl(n.expression) && kernwert(n.expression)) meld(sf, n, 'J', n.getText());
      // P: Zahl + Text
      if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.PlusToken) {
        const l = n.left, r = n.right;
        const txt = (x) => ts.isStringLiteral(x) || ts.isTemplateExpression(x) || ts.isNoSubstitutionTemplateLiteral(x);
        for (const [a, b] of [[l, r], [r, l]]) if (txt(b) && istZahl(a) && kernwert(a) && !geschuetzt(a) && !imStil(n)) meld(sf, a, 'P', n.getText());
      }
      // V: Vergleich als Bedingung einer Textauswahl
      if (ts.isConditionalExpression(n)) {
        const c = n.condition;
        let vergleich = null;
        const such = (k) => { if (vergleich) return; if (ts.isBinaryExpression(k) && [ts.SyntaxKind.LessThanToken, ts.SyntaxKind.GreaterThanToken, ts.SyntaxKind.LessThanEqualsToken, ts.SyntaxKind.GreaterThanEqualsToken].includes(k.operatorToken.kind) && (kernwert(k.left) || kernwert(k.right))) vergleich = k; else if (!ts.isCallExpression(k)) ts.forEachChild(k, such); };
        such(c);
        if (vergleich && !/isFinite|isNaN|gueltig|valid/.test(c.getText())) {
          // Zweig bei NaN: einfacher Vergleich → whenFalse, „!(Vergleich)“ → whenTrue; zusammengesetzte Bedingungen nur mit ALLE_VERGLEICHE
          const ct = c.getText().trim().replace(/^\((.*)\)$/s, '$1');
          const einfach = ts.isBinaryExpression(ts.isParenthesizedExpression(c) ? c.expression : c) && (ts.isParenthesizedExpression(c) ? c.expression : c) === vergleich;
          const neg = ts.isPrefixUnaryExpression(c) && c.operator === ts.SyntaxKind.ExclamationToken;
          const nanZweig = einfach ? n.whenFalse.getText() : neg ? n.whenTrue.getText() : null;
          if (nanZweig !== null && ERFOLG_CODE.test(nanZweig) && !FEHLSCHLAG_CODE.test(nanZweig) && !imGueltigZweig(n)) meld(sf, n, 'V', n.getText());
          else if (process.env.ALLE_VERGLEICHE) meld(sf, n, 'V*', ct);
        }
      }
      ts.forEachChild(n, v);
    };
    v(sf);
  }
  return befunde;
}

if (process.argv[1] && process.argv[1].endsWith('kein-ergebnis-anzeige.mjs')) {
  const b = scanne();
  for (const x of b) console.log(`${x.art}${x.gueltigZweig ? '(g)' : ''}\t${x.datei}:${x.zeile}\t${x.text}`);
  const z = {}; b.forEach((x) => (z[x.art] = (z[x.art] || 0) + 1));
  console.log(JSON.stringify(z), 'gesamt', b.length, 'davon im Gültig-Zweig', b.filter((x) => x.gueltigZweig).length);
}
