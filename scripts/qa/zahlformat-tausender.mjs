// Tausendertrennung (Entscheidung 28.10.2026): in Anzeigetexten schmales geschütztes Leerzeichen U+202F
// (in KaTeX „\,“), gegliedert ab 5 Stellen; vierstellige Zahlen ungegliedert. Gemeldet werden
//  (1) Zahlen mit Tausenderpunkt (1.000, 210.000) oder mit normalem/geschütztem Leerzeichen als Trenner (210 000)
//      in content/**/*.json, src/**/*.json und Zeichenketten/JSX-Text in src/**/*.ts(x),
//  (2) direkte Aufrufe von toLocaleString(…) auf Zahlen (Intl liefert den Punkt) – statt dessen formatDeIntl().
// Nicht gemeldet: Normnummern und Verweise (DIN/EN/ISO …, §, Nr., S., Tab. …), Datumsangaben, URLs,
// Versionsnummern, BNB-Bauteilnummern (331.211) sowie die Einträge in AUSNAHMEN (Dezimalpunkt in Formeln).
// Ratsche: GRENZE = 0. Aufruf: node scripts/qa/zahlformat-tausender.mjs [--check|--show]
import ts from 'typescript'; import fs from 'node:fs'; import path from 'node:path';
const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const MODE = process.argv[2];
const GRENZE = 0;
// Dezimalpunkt (kein Tausender) in Lösungsformeln der Übungsaufgaben – eigener Befund (Dezimalkomma), hier ausgenommen
const AUSNAHMEN = [['betonTasks.ts', '1.159'], ['betonTasks.ts', '2.805'], ['bauprodukteTasks.ts', '3.047'], ['digitalesTasks.ts', '1.000'],
  ['massivbauTasks.ts', '1.026'], ['massivbauTasks.ts', '2.026'], ['massivbauTasks.ts', '2.314'], ['massivbauTasks.ts', '2.828'], ['massivbauTasks.ts', '5.477'], ['massivbauTasks.ts', '10.417']];
const RE = /(?<![\d.,\w /#-])([1-9]\d{0,2})((?:\.\d{3})+|(?:[   ]\d{3})+)(?![\d]|\.\d|,\d*\.\d|[   ]\d{3})/g;
const VOR_AUSSCHLUSS = /(DIN|EN|ISO|IEC|VDI|VDE|DVGW|DAfStb|DBV|ZTV|TL|TP|EAD|ETA|EOTA|CEN|ASTM|BS|NF|SN|ÖNORM|SIA|WTA|DWA|ATV|RAL|RAL-GZ|FLL|TRGS|TRBA|DGUV|BGR|BGI|GefStoffV|§|Art\.|Artikel|Abs\.|Nr\.|Nummer|Version|Vers\.|v|V|S\.|Seite|Seiten|Kap\.|Kapitel|Tab\.|Tabelle|Bild|Abb\.|Gl\.|Gleichung|Anhang|Abschnitt|Abschn\.|Az\.|Postfach|PLZ|Tel\.|Telefon|Fax|ISBN|ISSN|DOI|Bd\.|Heft|Band|Ziff\.|Ziffer|Punkt|Kat\.|AVV|Abfallschlüssel|Schlüssel|EAK|ASN|LAGA|CAS|EG-Nr\.|UN|Drucksache|BT-Drs\.|Drs\.|BGBl\.|ABl\.|L|Teil|Blatt|Merkblatt|Richtlinie|Code|Typ|Klasse|Projekt|Förderkennzeichen|FKZ)\s*[-:]?\s*$/;
const KONTEXT_URL = /https?:|www\.|\.(png|jpg|svg|pdf|json|html?)\b/;
const befunde = [];

function pruefeText(text, datei, zeileVon) {
  for (const m of text.matchAll(RE)) {
    const off = m.index, roh = m[0], rest = m[2];
    const vor = text.slice(Math.max(0, off - 30), off), nach = text.slice(off + roh.length, off + roh.length + 25);
    const punkt = rest.startsWith('.');
    if (VOR_AUSSCHLUSS.test(vor) || KONTEXT_URL.test(text.slice(Math.max(0, off - 60), off + roh.length + 30))) continue;
    if (punkt && (/^\d{1,2}\.\d{1,2}\.$/.test(vor.slice(-6)) || /^\.\d|^\d/.test(nach) || /^\s?‰/.test(nach))) continue;
    if (punkt && /BNB/.test(text) && /^\d{3}\.\d{3}$/.test(roh)) continue;
    if (punkt && AUSNAHMEN.some(([d, w]) => datei.endsWith(d) && w === roh)) continue;
    if (!punkt && (/\d[  ]$/.test(vor) || /^(?:[ ;]|, )\d/.test(nach))) continue; // Zahlenfolgen „7 28 90“
    befunde.push(`${datei}:${zeileVon(off)} | …${(vor + '⟦' + roh + '⟧' + nach).replace(/\s+/g, ' ')}…`);
  }
}
const zeilen = (src, basis) => (off) => src.slice(0, basis + off).split('\n').length;
const walk = (d, re, acc = []) => { if (!fs.existsSync(d)) return acc; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p, re, acc); } else if (re.test(e.name)) acc.push(p); } return acc; };

// JSON (Rohtext, Werte ohne Schlüssel wie id/url/version)
for (const f of [...walk(path.join(REPO, 'content'), /\.json$/), ...walk(path.join(REPO, 'src'), /\.json$/)]) {
  const src = fs.readFileSync(f, 'utf8'); let schluessel = '';
  for (const m of src.matchAll(/"((?:[^"\\]|\\.)*)"(\s*:)?/g)) {
    if (m[2]) { schluessel = m[1]; continue; }
    if (/^(id|url|href|src|key|datum|date|stand|version|reviewedAt|doi|isbn|nummer|norm|normNr|code)$/i.test(schluessel)) continue;
    pruefeText(m[1], path.relative(REPO, f), zeilen(src, m.index + 1));
  }
}

// TS/TSX: Zeichenketten und JSX-Text (ohne Klassen, Pfade, Schlüssel, RegExp/Parser-Aufrufe), toLocaleString-Aufrufe
const SKIP_ATTR = /^(className|style|d|points|href|src|key|id|value|defaultValue|viewBox|transform|type|name|htmlFor|role|to|path|url|step|min|max|pattern|inputMode|autoComplete|lang)$/;
let locale = 0;
for (const f of walk(path.join(REPO, 'src'), /\.tsx?$/)) {
  if (/numberFormat\.ts$|\.d\.ts$|lib\/schriften\.ts$/.test(f)) continue;
  const src = fs.readFileSync(f, 'utf8');
  const hatZahl = /[1-9]\d{0,2}(?:\.\d{3}|[   ]\d{3})/.test(src), hatLocale = /\.toLocaleString\(/.test(src);
  if (!hatZahl && !hatLocale) continue;
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, f.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const rel = path.relative(REPO, f);
  const ueberspringen = (node) => { let p = node.parent; for (let i = 0; i < 6 && p; i++, p = p.parent) {
    if (ts.isJsxAttribute(p)) return SKIP_ATTR.test(p.name.getText());
    if (ts.isPropertyAssignment(p)) { const n = p.name.getText().replace(/['"]/g, ''); return SKIP_ATTR.test(n) || /^(url|href|id|datum|stand|version|doi|isbn|norm)$/.test(n); }
    if (ts.isJsxElement(p) && /^(code|pre|kbd)$/.test(p.openingElement.tagName.getText())) return true;
    if (ts.isCallExpression(p) && /parseFloat|Number|parseInt|querySelector|fetch|URL|RegExp|test|match|replace|split|toFixed|includes|startsWith|endsWith|indexOf|Date/.test(p.expression.getText())) return true;
    if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) return true; } return false; };
  const visit = (node) => {
    if (hatLocale && ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'toLocaleString'
      && !/Date|datum|zeit|time/i.test(node.expression.expression.getText())) { locale++; befunde.push(`${rel}:${sf.getLineAndCharacterOfPosition(node.getStart()).line + 1} | ${node.getText().slice(0, 80)} → formatDeIntl(…)`); }
    if (hatZahl && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node) || ts.isJsxText(node)) && !ueberspringen(node))
      pruefeText(src.slice(node.getStart(), node.getEnd()), rel, zeilen(src, node.getStart()));
    ts.forEachChild(node, visit); };
  visit(sf);
}
if (MODE === '--show' || (MODE === '--check' && befunde.length > GRENZE)) befunde.forEach(b => console.log(b));
console.log(`Tausendertrennung: ${befunde.length - locale} Zahlen mit Punkt/Leerzeichen statt U+202F, ${locale} direkte toLocaleString-Aufrufe (Grenze ${GRENZE}).`);
if (MODE === '--check') process.exit(befunde.length > GRENZE ? 1 : 0);
