/**
 * Vite-Plugin „audit-daten“ (Admin-Bereich, Reitergruppe „Audit“): ermittelt beim Build bzw. im Dev-Server
 * die Kennzahlen des Admin-Bereichs aus dem Quelltext, statt sie hart zu codieren:
 *   - Prüfpunkte „F-Freigabe“: alle Fundstellen in src/calc, src/data, content (Datei, Zeile, Kontext, Fachgebiet)
 *   - Quiz-Prüflisten je Cluster: gesamt / auffällig / verified aus src/data/quiz.json (+ Kopfzahlen der Prüflisten
 *     docs/pruefung/quiz-cluster-*.md, damit eine veraltete Liste auffällt; Listen erzeugt scripts/pruefliste.ts)
 *   - Tool-Umfang: Module, Fachmodule, Prüfvermerke, Rechenkerne, Testdateien, Quizfragen, Zeilen je Bereich
 *   - Sprachen & Tools: Versionen der Kernpakete aus package.json
 *   - Bundle: letzte Messung aus docs/metriken.json und Budget aus scripts/qa/check-bundle.mjs; zusätzlich schreibt
 *     das Plugin nach dem Build dist/audit-bundle.json (Einstieg gzip wie check-bundle.mjs), das die Seite nachlädt.
 *
 * Virtuelles Modul: virtual:audit-daten  →  export default AuditDaten (JSON). Es wird nur vom lazy geladenen
 * Audit-Chunk des Admin-Bereichs importiert (src/components/admin/audit/*), nicht vom Einstieg.
 * package.json bleibt unverändert: das Plugin läuft in `vite build` mit (vite.config.ts) wie quizPool/modulKopf.
 * Prüfung: tests/auditDaten.test.ts (Fundstellen vollständig, Zählungen = quiz.json, Prüflisten-Dateien vorhanden).
 * Aufruf zur Kontrolle: npx tsx scripts/auditDaten.ts  (gibt eine Zusammenfassung aus)
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';
import type { Plugin } from 'vite';
import type { AuditDaten, FFundstelle, QuizClusterZaehlung, Zeilenbereich } from '../src/data/audit/typen';

export const AUDIT_DATEN_ID = 'virtual:audit-daten';
const AUFGELOEST = '\0' + AUDIT_DATEN_ID;
/** Datei im Build-Ausgabeverzeichnis mit der Einstiegsgröße (vom Admin-Bereich per fetch gelesen) */
export const BUNDLE_DATEI = 'audit-bundle.json';

/** Ordner, in denen nach „F-Freigabe“ gesucht wird (Auftrag: src/calc, src/data, content) */
export const F_ORDNER = ['src/calc', 'src/data', 'content'];
/** eigene Audit-Daten (beschreiben die Prüfpunkte nur) nicht mitzählen */
const F_AUSNAHMEN = [/^src\/data\/audit\//];
export const F_MARKE = /F-Freigabe/;

// ---------------------------------------------------------------- Hilfen
const rel = (wurzel: string, p: string) => path.relative(wurzel, p).split(path.sep).join('/');

function dateienIn(wurzel: string, ordner: string, endung: RegExp): string[] {
  const abs = path.join(wurzel, ordner);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(e => {
      const p = path.join(ordner, e.name);
      if (e.isDirectory()) return e.name === 'node_modules' ? [] : dateienIn(wurzel, p, endung);
      return endung.test(e.name) ? [p.split(path.sep).join('/')] : [];
    });
}

// ---------------------------------------------------------------- F-Freigabe
/** Fachgebiet je Fundstelle: zuerst nach Dateipfad, sonst nach Stichworten im Kontext (Reihenfolge = Vorrang) */
export const FACHGEBIETE: readonly { name: string; datei: RegExp; text: RegExp }[] = [
  { name: 'Bauphysik – Schallschutz', datei: /schall/i, text: /Trittschall|DIN 4109|L′_n,w|L'_n,w/ },
  { name: 'Bauphysik – Feuchteschutz', datei: /glaser|feuchte/i, text: /Glaser|DIN 4108-3|Tauwasser/ },
  { name: 'Holzbau', datei: /holz|bspSchwingung/i, text: /Holzbau|DIN EN 1995|Brettsperrholz/ },
  { name: 'Mauerwerk', datei: /mauerwerk/i, text: /Mauerwerk|DIN EN 1996|KS-Tragfähigkeit/ },
  { name: 'Geotechnik', datei: /boden|atterberg/i, text: /Fließgrenze|Atterberg|17892|DIN 18122|14688|Zustandsform/ },
  { name: 'Nachhaltigkeit (LCA/LCC)', datei: /lca|lcc|materialoptimierung|oekobilanz|modulD|dafstb/i, text: /QNG|ÖKOBAUDAT|Ökobilanz|Restwert|Modul D|EN 15804|KrWG/ },
  { name: 'Stahl & Korrosionsschutz', datei: /korrosionsschutz|eisenKohlenstoff|stahlbau/i, text: /ISO 12944|DIN EN 10025|Eisen-Kohlenstoff/ },
  { name: 'Prüfverfahren & Bauwerksdiagnostik', datei: /pruefverfahren|bauwerksuntersuchung|karsten|zfp/i, text: /Prüfverfahren|Rückprall|Karsten/ },
  { name: 'Verkehrswege- & Tunnelbau', datei: /verkehrswegebau|tunnel|tiefbau|asphalt/i, text: /Tunnel|ZTV-ING|RStO|DWA-A 138|Rigole|f_Ort|ZTV Asphalt|Bitumen/ },
  { name: 'Bauprodukte', datei: /bauprodukte|^Bp[A-Z]/, text: /Lehmstein|DIN 1894[0-8]|Fugenband|DIN 18533|DIN 18534|DIN 18365/ },
  { name: 'Beton & Stahlbeton', datei: /biegung|kennwerte|mischung|hydratation|festbeton|spannbeton|beton|lebensdauer|brandschutz|frischbeton/i, text: /Konsistenz|Luftgehalt|DIN EN 206|DIN EN 1992|DIN 1045|DIN EN 197|C55\/67|C90\/105|fib Bulletin 34|Reifefunktion|de Vree|Karbonatisierung|Chlorid|Stahlbetonbauteile/ },
];
export const FACHGEBIET_SONST = 'Weitere';

export function fachgebietVon(datei: string, kontext: string): string {
  const name = path.basename(datei);
  return FACHGEBIETE.find(g => g.datei.test(name))?.name
    ?? FACHGEBIETE.find(g => g.text.test(kontext))?.name
    ?? FACHGEBIET_SONST;
}

/** Kontext einer Fundstelle: Zeile ohne Kommentarzeichen, bei Kommentar-Fortsetzungen mit der Vorzeile; lange Zeilen gekürzt */
export function kontextVon(zeilen: readonly string[], i: number, max = 260): string {
  const sauber = (s: string) => s.trim().replace(/^(\/\*\*?|\*\/?|\/\/)\s*/, '').replace(/\s*\*\/$/, '').trim();
  let text = sauber(zeilen[i]);
  const istFortsetzung = /^\s*\*(?!\/)/.test(zeilen[i]) && i > 0 && /^\s*(\*|\/\*\*)/.test(zeilen[i - 1]);
  if (istFortsetzung && text.length < 140) text = `${sauber(zeilen[i - 1])} ${text}`.trim();
  if (text.length <= max) return text;
  const pos = text.search(F_MARKE);
  const start = Math.max(0, Math.min(pos - (max - 40), text.length - max));
  return `${start > 0 ? '…' : ''}${text.slice(start, start + max).trim()}${start + max < text.length ? '…' : ''}`;
}

export function sammleFFreigabe(wurzel = process.cwd()): AuditDaten['fFreigabe'] {
  const funde: (FFundstelle & { fachgebiet: string })[] = [];
  for (const ordner of F_ORDNER) {
    for (const datei of dateienIn(wurzel, ordner, /\.(tsx?|json|mjs)$/)) {
      if (F_AUSNAHMEN.some(r => r.test(datei))) continue;
      const text = fs.readFileSync(path.join(wurzel, datei), 'utf8');
      if (!F_MARKE.test(text)) continue;
      const zeilen = text.split('\n');
      zeilen.forEach((z, i) => {
        if (!F_MARKE.test(z)) return;
        const kontext = kontextVon(zeilen, i);
        funde.push({ datei, zeile: i + 1, kontext, fachgebiet: fachgebietVon(datei, kontext) });
      });
    }
  }
  const namen = [...FACHGEBIETE.map(g => g.name), FACHGEBIET_SONST];
  const gruppen = namen
    .map(fachgebiet => ({ fachgebiet, eintraege: funde.filter(f => f.fachgebiet === fachgebiet).map(({ datei, zeile, kontext }) => ({ datei, zeile, kontext })) }))
    .filter(g => g.eintraege.length);
  return { gesamt: funde.length, dateien: new Set(funde.map(f => f.datei)).size, gruppen, ordner: F_ORDNER };
}

// ---------------------------------------------------------------- TS-Quellen (Registry, Zuordnung) auswerten
interface Quellen {
  quizCluster: (moduleId: string) => { id: string; name: string } | undefined;
  META_CLUSTERS: { number: string; name: string }[];
  MODULE: readonly { id: string }[];
  FACHMODULE: readonly { id: string }[];
  pruefvermerkFuer: (id: string) => { status: string } | undefined;
}
async function ladeQuellen(wurzel: string): Promise<Quellen> {
  const q = (p: string) => JSON.stringify(path.join(wurzel, p));
  const ergebnis = await build({
    stdin: {
      contents: `export { quizCluster } from ${q('src/data/quizZuordnung.ts')};\n`
        + `export { META_CLUSTERS } from ${q('src/data/metaClusters.ts')};\n`
        + `export { MODULE } from ${q('src/registry/modules.ts')};\n`
        + `export { FACHMODULE, pruefvermerkFuer } from ${q('src/data/pruefvermerke.ts')};\n`,
      resolveDir: wurzel, loader: 'ts',
    },
    bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent',
    alias: { '@': wurzel }, jsx: 'automatic',
  });
  return await import('data:text/javascript;base64,' + Buffer.from(ergebnis.outputFiles[0].text).toString('base64')) as Quellen;
}

// ---------------------------------------------------------------- Quiz-Prüflisten
export interface Frage { id: string; moduleId: string; verified?: boolean; vorpruefung?: { ergebnis?: string } }

const FRAGE_ID = /\bq[a-z]*_[A-Za-z0-9_]+/g;

/** IDs mit offenem Prüfhinweis aus docs/quiz-pruefhinweise.md: „- [ ] **q_…**“ sowie „Bereits korrigiert: q_… – bitte bestätigen“ */
export function offenePruefhinweise(text: string): Set<string> {
  const ids = new Set<string>();
  for (const zeile of text.split('\n')) {
    const bestaetigen = /Bereits korrigiert:(.*)bitte bestätigen/.exec(zeile)?.[1];
    if (bestaetigen) for (const m of bestaetigen.matchAll(FRAGE_ID)) ids.add(m[0]);
    if (!/^\s*- \[ \]/.test(zeile)) continue;
    const fett = /\*\*([^*]+)\*\*/.exec(zeile)?.[1] ?? '';
    for (const m of fett.matchAll(FRAGE_ID)) ids.add(m[0]);
  }
  return ids;
}

/** Kopfzahlen einer Prüfliste: „Cluster I umfasst 235 Fragen … Aufgeführt sind 17 auffällige Fragen“, „Stand: 27.10.2026“ */
export function prueflistenKopf(text: string): QuizClusterZaehlung['liste'] {
  const g = /umfasst\s+(\d+)\s+Fragen/.exec(text);
  const a = /Aufgeführt sind\s+(\d+)\s+auffällige/.exec(text);
  const s = /Stand:\s*([0-9.]+\d)/.exec(text);
  return g && a ? { gesamt: Number(g[1]), auffaellig: Number(a[1]), stand: s?.[1] ?? '' } : null;
}

/**
 * Fragen, die seit den Prüflisten vom 26./27.10.2026 (#186) neu hinzugekommen sind: Z24-Themen aus #190
 * (qz24_*: t-Test, Trittschall, Atterberg) und #191 (Mohr-Coulomb, Bruchlinien, Eisen-Kohlenstoff).
 * Neue Fragen werden auffällig, solange sie nicht freigegeben sind (verified ≠ true). Weitere neue Fragenblöcke hier ergänzen.
 */
export const NEU_SEIT_26_10 = /^(qz24_|qn_festigkeit_mohr_|qn_formaenderungen_bl_|qn_stahl_fec_)/;

/** Auffällig = Vorprüfung „korrigiert“/„fraglich“, offener Prüfhinweis oder neu seit 26.10. und nicht freigegeben (gleiche Regel wie scripts/pruefliste.ts) */
export function istAuffaellig(q: Frage, hinweise: ReadonlySet<string>): boolean {
  const e = q.vorpruefung?.ergebnis;
  return e === 'korrigiert' || e === 'fraglich' || hinweise.has(q.id) || istNeuOffen(q);
}
export const istNeuOffen = (q: Frage) => NEU_SEIT_26_10.test(q.id) && q.verified !== true;

export function zaehleQuiz(fragen: readonly Frage[], clusterVon: (moduleId: string) => string | undefined,
  cluster: readonly { number: string; name: string }[], hinweise: Set<string>, wurzel = process.cwd()): AuditDaten['quiz'] {
  const jeCluster = cluster.map(c => {
    const f = fragen.filter(q => clusterVon(q.moduleId) === c.number);
    const korrigiert = f.filter(q => q.vorpruefung?.ergebnis === 'korrigiert').length;
    const fraglich = f.filter(q => q.vorpruefung?.ergebnis === 'fraglich').length;
    const auffaellig = f.filter(q => istAuffaellig(q, hinweise)).length;
    const datei = `docs/pruefung/quiz-cluster-${c.number}.md`;
    const vorhanden = fs.existsSync(path.join(wurzel, datei));
    return {
      cluster: c.number, name: c.name, gesamt: f.length, auffaellig, korrigiert, fraglich,
      mitPruefhinweis: f.filter(q => hinweise.has(q.id)).length,
      verified: f.filter(q => q.verified === true).length,
      datei: vorhanden ? datei : null,
      liste: vorhanden ? prueflistenKopf(fs.readFileSync(path.join(wurzel, datei), 'utf8')) : null,
    };
  }).filter(c => c.gesamt > 0 || c.datei);
  const zugeordnet = jeCluster.reduce((s, c) => s + c.gesamt, 0);
  return { gesamt: fragen.length, verified: fragen.filter(q => q.verified === true).length, ohneCluster: fragen.length - zugeordnet, cluster: jeCluster };
}

// ---------------------------------------------------------------- Kennzahlen
const BEREICHE: readonly { bereich: string; ordner: string }[] = [
  { bereich: 'Fachmodule', ordner: 'src/modules' },
  { bereich: 'UI-Komponenten', ordner: 'src/components' },
  { bereich: 'Rechenkerne', ordner: 'src/calc' },
  { bereich: 'Daten (Normen, Quiz, Lernziele …)', ordner: 'src/data' },
  { bereich: 'Fachtexte (JSON)', ordner: 'content' },
  { bereich: 'Tests', ordner: 'tests' },
  { bereich: 'Skripte (Build, QA)', ordner: 'scripts' },
  { bereich: 'Server', ordner: 'server' },
];
const QUELLE = /\.(tsx?|mjs|json|css)$/;
const zeilenVon = (wurzel: string, d: string) => fs.readFileSync(path.join(wurzel, d), 'utf8').split('\n').length;

export function zeilenbereiche(wurzel = process.cwd()): Zeilenbereich[] {
  const bekannt = BEREICHE.map(b => {
    const d = dateienIn(wurzel, b.ordner, QUELLE);
    return { ...b, dateien: d.length, zeilen: d.reduce((s, f) => s + zeilenVon(wurzel, f), 0) };
  });
  // übriger App-Code in src/ (Router, Kontexte, i18n, Hilfen) und server.ts
  const unterordner = new Set(BEREICHE.map(b => b.ordner));
  const rest = dateienIn(wurzel, 'src', QUELLE).filter(f => ![...unterordner].some(o => f.startsWith(o + '/')));
  const server = fs.existsSync(path.join(wurzel, 'server.ts')) ? ['server.ts'] : [];
  return [
    ...bekannt.filter(b => b.ordner !== 'server'),
    { bereich: 'App-Rahmen (Router, Kontexte, i18n, Hilfen)', ordner: 'src', dateien: rest.length, zeilen: rest.reduce((s, f) => s + zeilenVon(wurzel, f), 0) },
    { bereich: 'Server', ordner: 'server.ts, server/', dateien: bekannt.find(b => b.ordner === 'server')!.dateien + server.length,
      zeilen: bekannt.find(b => b.ordner === 'server')!.zeilen + server.reduce((s, f) => s + zeilenVon(wurzel, f), 0) },
  ];
}

/** Rechenkerne = Dateien in src/calc ohne die gemeinsame Plausibilitätsschicht */
export function rechenkerne(wurzel = process.cwd()): string[] {
  return dateienIn(wurzel, 'src/calc', /\.ts$/).filter(f => !/plausibilitaet\.ts$/.test(f));
}

export function bundleStand(wurzel = process.cwd()): AuditDaten['kennzahlen']['bundle'] {
  let stand: string | null = null, einstiegGzipKB: number | null = null, grenzeKB: number | null = null;
  try {
    const m = JSON.parse(fs.readFileSync(path.join(wurzel, 'docs/metriken.json'), 'utf8'));
    stand = typeof m.stand === 'string' ? m.stand : null;
    einstiegGzipKB = typeof m.bundle?.einstieg_gzip_kB === 'number' ? m.bundle.einstieg_gzip_kB : null;
  } catch { /* Datei fehlt → keine Angabe */ }
  try {
    const g = /const GRENZE_EINSTIEG\s*=\s*(\d+(?:\.\d+)?)/.exec(fs.readFileSync(path.join(wurzel, 'scripts/qa/check-bundle.mjs'), 'utf8'));
    grenzeKB = g ? Number(g[1]) : null;
  } catch { /* keine Angabe */ }
  return { stand, einstiegGzipKB, grenzeKB };
}

/** Einstiegs-Chunk samt statischer Importe, gzip -9, in kB – gleiche Regeln wie scripts/qa/check-bundle.mjs */
export function einstiegGzipKB(dist: string): number | null {
  const html = path.join(dist, 'index.html');
  if (!fs.existsSync(html)) return null;
  const src = [...fs.readFileSync(html, 'utf8').matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"/g)].map(m => m[1]).find(s => s.includes('/assets/'));
  if (!src) return null;
  const assets = path.join(dist, 'assets');
  const statisch = new Set([path.basename(src)]);
  const offen = [...statisch];
  while (offen.length) {
    const code = fs.readFileSync(path.join(assets, offen.pop()!), 'utf8');
    for (const m of code.matchAll(/(?:^|[;}\n])\s*import\s*(?:[\w${},\s*]+from\s*)?["']\.\/([^"']+\.js)["']/g)) {
      if (!statisch.has(m[1])) { statisch.add(m[1]); offen.push(m[1]); }
    }
  }
  const summe = [...statisch].reduce((s, f) => s + zlib.gzipSync(fs.readFileSync(path.join(assets, f)), { level: 9 }).length, 0);
  return Math.round((summe / 1024) * 10) / 10;
}

/** Kernpakete für „Sprachen & Tools“ (Version laut package.json, ohne Präfix ^/~) */
export const KERNPAKETE = ['typescript', 'react', 'react-dom', 'vite', 'tailwindcss', 'lucide-react', 'tsx', 'esbuild', 'express', 'katex', 'react-katex', 'chart.js', 'recharts', 'three', '@react-three/fiber', '@google/genai', 'jspdf', 'xlsx'];
export function paketVersionen(wurzel = process.cwd()): AuditDaten['pakete'] {
  const pkg = JSON.parse(fs.readFileSync(path.join(wurzel, 'package.json'), 'utf8'));
  const alle: Record<string, string> = { ...pkg.dependencies, ...pkg.devDependencies };
  return KERNPAKETE.filter(n => alle[n]).map(name => ({ name, version: alle[name].replace(/^[\^~>=<\s]+/, '') }));
}

// ---------------------------------------------------------------- Gesamt
export async function erzeugeAuditDaten(wurzel = process.cwd()): Promise<AuditDaten> {
  const quellen = await ladeQuellen(wurzel);
  const fragen: Frage[] = JSON.parse(fs.readFileSync(path.join(wurzel, 'src/data/quiz.json'), 'utf8'));
  const hinweisDatei = path.join(wurzel, 'docs/quiz-pruefhinweise.md');
  const hinweise = fs.existsSync(hinweisDatei) ? offenePruefhinweise(fs.readFileSync(hinweisDatei, 'utf8')) : new Set<string>();
  const quiz = zaehleQuiz(fragen, id => quellen.quizCluster(id)?.id, quellen.META_CLUSTERS, hinweise, wurzel);
  const bereiche = zeilenbereiche(wurzel);
  const status = quellen.FACHMODULE.map(m => quellen.pruefvermerkFuer(m.id)?.status ?? 'offen');
  return {
    erzeugtAm: new Date().toISOString().slice(0, 10),
    fFreigabe: sammleFFreigabe(wurzel),
    quiz,
    kennzahlen: {
      module: quellen.MODULE.filter(m => !m.id.startsWith('divider_')).length,
      fachmodule: quellen.FACHMODULE.length,
      fachmoduleGeprueft: status.filter(s => s === 'geprueft').length,
      fachmoduleOffen: status.filter(s => s !== 'geprueft').length,
      rechenkerne: rechenkerne(wurzel).length,
      testdateien: dateienIn(wurzel, 'tests', /\.test\.ts$/).length,
      quizfragen: quiz.gesamt,
      quizVerified: quiz.verified,
      inhaltsdateien: dateienIn(wurzel, 'content', /\.json$/).length,
      quelldateien: bereiche.reduce((s, b) => s + b.dateien, 0),
      zeilenGesamt: bereiche.reduce((s, b) => s + b.zeilen, 0),
      bereiche,
      bundle: bundleStand(wurzel),
    },
    pakete: paketVersionen(wurzel),
  };
}

export function auditDatenPlugin(wurzel = process.cwd()): Plugin {
  let distDir = path.join(wurzel, 'dist');
  let ssr = false;
  return {
    name: 'audit-daten',
    configResolved(c) { distDir = path.resolve(c.root, c.build.outDir); ssr = !!c.build.ssr; },
    resolveId(id) {
      if (id === AUDIT_DATEN_ID) return AUFGELOEST;
    },
    async load(id) {
      if (id !== AUFGELOEST) return;
      const daten = await erzeugeAuditDaten(wurzel);
      return `export default /*#__PURE__*/ JSON.parse(${JSON.stringify(JSON.stringify(daten))});\n`;
    },
    // nach dem Client-Build: aktuelle Einstiegsgröße für den Admin-Bereich ablegen (nicht im SSR-Build des Vorrenderns)
    writeBundle() {
      if (ssr) return;
      const kb = einstiegGzipKB(distDir);
      if (kb !== null) fs.writeFileSync(path.join(distDir, BUNDLE_DATEI), JSON.stringify({ einstiegGzipKB: kb, gemessenAm: new Date().toISOString().slice(0, 10) }) + '\n');
    },
  };
}

// Direktaufruf: Zusammenfassung ausgeben
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void erzeugeAuditDaten().then(d => {
    console.log(`F-Freigabe: ${d.fFreigabe.gesamt} Fundstellen in ${d.fFreigabe.dateien} Dateien`);
    for (const g of d.fFreigabe.gruppen) console.log(`  ${g.fachgebiet}: ${g.eintraege.length}`);
    console.log(`Quiz: ${d.quiz.gesamt} Fragen, ${d.quiz.verified} verified, ohne Cluster ${d.quiz.ohneCluster}`);
    for (const c of d.quiz.cluster) console.log(`  Cluster ${c.cluster}: ${c.auffaellig} auffällig / ${c.gesamt} gesamt / ${c.verified} verified · Liste: ${c.liste ? `${c.liste.auffaellig}/${c.liste.gesamt} (Stand ${c.liste.stand})` : '–'}`);
    const k = d.kennzahlen;
    console.log(`Module ${k.module}, Fachmodule ${k.fachmodule} (geprüft ${k.fachmoduleGeprueft}), Rechenkerne ${k.rechenkerne}, Testdateien ${k.testdateien}, Inhaltsdateien ${k.inhaltsdateien}`);
    console.log(`Quelldateien ${k.quelldateien}, Zeilen ${k.zeilenGesamt}; Bundle ${JSON.stringify(k.bundle)}`);
  });
}
