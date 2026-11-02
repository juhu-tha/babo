// Ratsche: keine sichtbaren Bearbeitungsvermerke in der App (Auftrag NS5C-X-1, 02.11.2026).
// Geprüft werden alle Zeichenketten in content/**/*.json sowie die Zeichenketten-Literale,
// Vorlagen-Literale und JSX-Texte in src/**/*.{ts,tsx} (Code-Kommentare zählen nicht – sie
// erreicht der TypeScript-Scanner gar nicht). Bericht: docs/pruefung/bearbeitungsvermerke-2026-11-02.md.
//
// Ein Bearbeitungsvermerk ist ein Hinweis an die Autorin/den Autor („manuell prüfen“, „Absatz
// prüfen“, „TODO“, „[Quelle]“, „???“, „XX“ …). Hinweise an die Leserin/den Leser („Konditionen
// vor Antragstellung bei KfW/BAFA prüfen“, „Messsatz prüfen“) sind keine Vermerke und bleiben.
// Unbelegte Fachwerte werden einheitlich mit „vorläufig, Normprüfung ausstehend“ gekennzeichnet.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const WURZEL = path.resolve(import.meta.dirname, '..');

/** Muster für Bearbeitungsvermerke (Name → regulärer Ausdruck). */
const MUSTER: Array<[string, RegExp]> = [
  ['manuell prüfen/abgleichen', /manuell(?: am Normtext)? (?:prüfen|prüfe\b|abgleichen|nachprüfen|ergänzen|kontrollieren|nachtragen|nachsehen)/i],
  ['Absatz/Titel/Quelle prüfen', /\b(?:Absatz|Titel|Quelle|Originalpatent\/Quelle|Zitat|Seitenzahl) (?:noch )?prüfen\b(?! Sie)/i],
  // „den aktuellen Stand prüfen“ richtet sich an die Leserin/den Leser und bleibt erlaubt
  ['Stand prüfen', /(?<!aktuellen )\bStand(?: \d{1,2}\/\d{4})? (?:noch )?prüfen\b/i],
  ['Normtext prüfen ohne Kennzeichnung', /\bNormtext prüfen\b|\bam (?:Normtext|Amtsblatt|Original) zu bestätigen\b/],
  ['noch prüfen/zu prüfen', /\b(?:noch zu prüfen|noch prüfen|bitte prüfen|später prüfen)\b/i],
  ['TODO/FIXME/TBD/XXX', /\b(?:TODO|FIXME|TBD|XXX)\b/],
  ['englischer Prüfvermerk', /\b(?:to be checked|check this|needs? check(?:ing)?|please check|to be confirmed|verify this)\b/i],
  ['Fragezeichen-Platzhalter', /\?\?\?|\(\?\)/],
  ['Platzhalter XX', /(?:^|[\s(])XX(?:[\s%.,)]|$)|\d+XX\b|\bXX\d/],
  ['Platzhalter in eckigen Klammern', /\[(?:Quelle|Beleg|Zitat|Link|Ref|Nachweis|Seite|Jahr|Wert|Zahl)\]/i],
  // „[Name]“ ist kein Vermerk: es anonymisiert Personen in Beispieldokumenten (Bautagebuch, Gutachten, Probenahme)
];

/** Sätze, die „Normtext prüfen“ zulassen: die Fundstelle ist schon gekennzeichnet oder richtet sich an die Leserin/den Leser. */
const NORMTEXT_ERLAUBT = /Normprüfung ausstehend|F-Freigabe|im Einzelfall/;

/**
 * Begründete Ausnahmen (Datei relativ zum Repo, Teiltext der Zeichenkette).
 * Jede Ausnahme braucht eine Begründung.
 */
const AUSNAHMEN: Array<{ datei: string; text: string; grund: string }> = [
  { datei: 'content/ki/ueberblick/daten.json', text: 'Bitte prüfen Sie die DIN 1045', grund: 'zitierte, absichtlich ausweichende KI-Antwort im Vergleichsbeispiel (Lehrinhalt „Halluzination/Absicherung“)' },
  { datei: 'content/ki/KiGlossar.json', text: 'Vier-Augen-Prinzip prüfen!', grund: 'Aufforderung an die Leserin/den Leser, kein Bearbeitungsvermerk' },
  { datei: 'src/data/audit/', text: '', grund: 'Audit-Arbeitslisten (Reiter „Audit“): offene Arbeitspunkte sind dort der Inhalt' },
  { datei: 'src/data/kiUebungen.ts', text: '[TEXT]', grund: 'Platzhalter der Kopiervorlage, den die Studierenden ersetzen' },
  { datei: 'src/data/quiz.json', text: 'Platzhalter', grund: 'Fachbegriff „Platzhalter-Key“ (lokales Sprachmodell), kein Vermerk' },
];

function ausgenommen(datei: string, s: string): boolean {
  return AUSNAHMEN.some(a => datei.startsWith(a.datei) && (a.text === '' || s.includes(a.text)));
}

interface Fund { datei: string; muster: string; text: string }
const funde: Fund[] = [];

function pruefeText(datei: string, s: string) {
  if (!s || ausgenommen(datei, s)) return;
  for (const [name, re] of MUSTER) {
    if (!re.test(s)) continue;
    if ((name.startsWith('Normtext') || name.startsWith('noch')) && NORMTEXT_ERLAUBT.test(s)) continue;
    const m = s.match(re)!;
    const i = Math.max(0, (m.index ?? 0) - 60);
    funde.push({ datei, muster: name, text: s.slice(i, i + 140).replace(/\s+/g, ' ') });
  }
}

function sammleJson(wert: unknown, datei: string) {
  if (typeof wert === 'string') pruefeText(datei, wert);
  else if (Array.isArray(wert)) wert.forEach(w => sammleJson(w, datei));
  else if (wert && typeof wert === 'object') Object.values(wert).forEach(w => sammleJson(w, datei));
}

function dateien(ordner: string, endungen: string[]): string[] {
  const aus: string[] = [];
  for (const e of fs.readdirSync(ordner, { withFileTypes: true })) {
    const p = path.join(ordner, e.name);
    if (e.isDirectory()) aus.push(...dateien(p, endungen));
    else if (endungen.some(x => e.name.endsWith(x))) aus.push(p);
  }
  return aus;
}

function sammleQuelltext(datei: string) {
  const text = fs.readFileSync(datei, 'utf8');
  const rel = path.relative(WURZEL, datei);
  const sf = ts.createSourceFile(datei, text, ts.ScriptTarget.Latest, true, datei.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const besuche = (n: ts.Node) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) pruefeText(rel, n.text);
    else if (ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) pruefeText(rel, n.text);
    else if (ts.isJsxText(n)) pruefeText(rel, n.text);
    // Importpfade und Schlüssel sind keine angezeigten Texte
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) return;
    ts.forEachChild(n, besuche);
  };
  besuche(sf);
}

console.log('--- Test: keine sichtbaren Bearbeitungsvermerke ---');
const jsonDateien = dateien(path.join(WURZEL, 'content'), ['.json']);
for (const d of jsonDateien) sammleJson(JSON.parse(fs.readFileSync(d, 'utf8')), path.relative(WURZEL, d));
const srcJson = dateien(path.join(WURZEL, 'src'), ['.json']);
for (const d of srcJson) sammleJson(JSON.parse(fs.readFileSync(d, 'utf8')), path.relative(WURZEL, d));
const quellDateien = dateien(path.join(WURZEL, 'src'), ['.ts', '.tsx']).filter(d => !d.endsWith('.d.ts'));
for (const d of quellDateien) sammleQuelltext(d);

// Selbsttest der Muster (damit die Ratsche nicht unbemerkt wirkungslos wird)
const selbst: Array<[string, boolean]> = [
  ['Mindestzementgehalt nach DIN 1045-2 manuell prüfen.', true],
  ['Art. 6 BayDSchG (Umgebung) – Absatz prüfen', true],
  ['Werte am Normtext prüfen', true],
  ['(Schwelle vorläufig, am Normtext zu bestätigen)', true],
  ['Tabellenwerte am Normtext prüfen, vorläufig, Normprüfung ausstehend', false],
  ['TODO Wert ergänzen', true],
  ['Quelle: [Quelle]', true],
  ['Konditionen vor Antragstellung bei KfW/BAFA prüfen', false],
  ['Messsatz verwerfen und wiederholen (Wägung, Volumen, Verdichtung prüfen).', false],
  ['vorläufig, Normprüfung ausstehend', false],
  ['Ingenieurbüro [Name]', false],
  ['Jede fachliche Aussage, Zahl und Quelle prüfen Sie selbst', false],
  ['(Größenordnung 10⁶ Token; Stand prüfen)', true],
  ['vor Verwendung den aktuellen Stand prüfen', false],
];
const vorher = funde.length;
for (const [s, erwartet] of selbst) {
  const n = funde.length;
  pruefeText('selbsttest', s);
  const gefunden = funde.length > n;
  funde.splice(n);
  if (gefunden !== erwartet) { console.error(`FAIL: Selbsttest „${s}“ erwartet ${erwartet ? 'Fund' : 'kein Fund'}`); process.exit(1); }
}
funde.splice(vorher);

if (funde.length) {
  for (const f of funde) console.error(`FAIL: ${f.datei} [${f.muster}] … ${f.text} …`);
  console.error(`${funde.length} sichtbare Bearbeitungsvermerke`);
  process.exit(1);
}
console.log(`OK: ${jsonDateien.length + srcJson.length} JSON- und ${quellDateien.length} Quelldateien ohne Bearbeitungsvermerk (${AUSNAHMEN.length} begründete Ausnahmen)`);
