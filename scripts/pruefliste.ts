/**
 * Erzeugt die Quiz-Prüflisten je Cluster (docs/pruefung/quiz-cluster-I.md … -VI.md) reproduzierbar aus
 *   - src/data/quiz.json (Felder vorpruefung, verified; wird nur gelesen, nie geschrieben)
 *   - docs/quiz-pruefhinweise.md (offene Prüfhinweise, Normenabgleich)
 *   - src/data/lernziele.ts (Lernziel-Stichprobe)
 *
 * „Auffällig“ ist dieselbe Regel wie im Admin-Audit (scripts/auditDaten.ts → istAuffaellig): Vorprüfung „korrigiert“
 * oder „fraglich“, offener Prüfhinweis oder neu seit 26.10.2026 und nicht freigegeben. Die Stichproben (5 unauffällige
 * Fragen, 5 Module mit Lernzielen je Cluster) sind deterministisch: Sortierung nach FNV-1a-Hash der ID.
 * Bereits gesetzte Kreuze („- [x] ok“ / „- [x] ändern: …“) einer vorhandenen Liste werden je Frage bzw. Modul übernommen.
 *
 * Aufruf:  npx tsx scripts/pruefliste.ts           (Listen schreiben)
 *          npx tsx scripts/pruefliste.ts --check   (nur prüfen, Exit 1 bei veralteter Liste)
 * Prüfung: tests/pruefliste.test.ts (Listen aktuell, Kopfzahlen = Admin-Audit).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { offenePruefhinweise, istAuffaellig, istNeuOffen, type Frage } from './auditDaten';
import { quizCluster } from '../src/data/quizZuordnung';
import { META_CLUSTERS } from '../src/data/metaClusters';
import { LERNZIELE } from '../src/data/lernziele';
import { MODUL_KERN } from '../src/registry/kern';

export const PRUEF_ORDNER = 'docs/pruefung';
export const STICHPROBE = 5;

interface QuizFrage extends Frage {
  moduleTitle: string;
  question: string;
  options: string[];
  correctIdx: number;
  vorpruefung?: { am?: string; ergebnis?: string; hinweis?: string };
}

/** FNV-1a (32 bit) – stabile Reihenfolge der Stichproben */
export function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}
const nachHash = (a: string, b: string) => fnv1a(a) - fnv1a(b) || (a < b ? -1 : a > b ? 1 : 0);
const nachId = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

const datumDe = (iso: string) => { const [j, m, t] = iso.split('-'); return `${t}.${m}.${j}`; };
const einzeilig = (s: string) => s.replace(/\s*\n\s*/g, ' ').trim();

/** Texte der offenen Prüfhinweise und des Normenabgleichs je Frage-ID aus docs/quiz-pruefhinweise.md */
export function hinweisTexte(text: string): { pruef: Map<string, string[]>; normen: Map<string, string[]> } {
  const pruef = new Map<string, string[]>(), normen = new Map<string, string[]>();
  const add = (m: Map<string, string[]>, id: string, t: string) => { const l = m.get(id) ?? []; if (!l.includes(t)) l.push(t); m.set(id, l); };
  const ID = /\bq[a-z0-9]*_[A-Za-z0-9_]+/g;
  let imAbgleich = false;
  for (const zeile of text.split('\n')) {
    const bestaetigen = /Bereits korrigiert:(.*)bitte bestätigen/.exec(zeile)?.[1];
    if (bestaetigen) for (const m of bestaetigen.matchAll(ID)) add(pruef, m[0], 'bereits korrigiert – bitte bestätigen.');
    const offen = /^\s*- \[ \] \*\*([^*]+)\*\*[^:]*:\s*(.*)$/.exec(zeile);
    if (offen) for (const m of offen[1].matchAll(ID)) add(pruef, m[0], offen[2].trim());
    if (/^Abgleich der oben genannten Normausgaben/.test(zeile)) imAbgleich = true;
    else if (/^<!--|^## /.test(zeile)) imAbgleich = false;
    const abgleich = imAbgleich ? /^- ([^–]+) – (.+)$/.exec(zeile) : null;
    if (abgleich) for (const m of abgleich[1].matchAll(ID)) add(normen, m[0], abgleich[2].trim());
  }
  return { pruef, normen };
}

/** Kreuze einer vorhandenen Liste: Schlüssel (Frage-ID bzw. Modul-ID) → Entscheidungszeilen, nur wenn angekreuzt/ausgefüllt */
export function vorhandeneEntscheidungen(text: string): Map<string, string[]> {
  const m = new Map<string, string[]>();
  let schluessel: string | null = null, zeilen: string[] = [], offen = false;
  const ablegen = () => {
    if (schluessel && zeilen.length && zeilen.join('\n') !== STANDARD.join('\n')) m.set(schluessel, zeilen);
  };
  for (const z of text.split('\n')) {
    const k = /^### (\S+) · /.exec(z);
    if (k || /^## /.test(z)) { ablegen(); schluessel = k ? k[1] : null; zeilen = []; offen = false; continue; }
    if (!schluessel) continue;
    // Entscheidungsblock: ab „- [ ] ok“ bis zur nächsten Leerzeile (Änderungswunsch darf in Folgezeilen stehen)
    if (/^- \[[ xX]\] ok\s*$/.test(z)) { offen = true; zeilen = [z]; continue; }
    if (offen && z.trim() === '') { offen = false; continue; }
    if (offen) zeilen.push(z);
  }
  ablegen();
  return m;
}

const STANDARD = ['- [ ] ok', '- [ ] ändern: …'];

function frageBlock(q: QuizFrage, auffaellig: string, kreuze: Map<string, string[]>): string {
  return [
    `### ${q.id} · ${q.moduleTitle}`,
    '',
    `- **Frage:** ${einzeilig(q.question)}`,
    `- **Richtige Antwort:** ${einzeilig(q.options[q.correctIdx] ?? '–')}`,
    `- **Auffälligkeit:** ${auffaellig}`,
    ...(kreuze.get(q.id) ?? STANDARD),
    '',
  ].join('\n');
}

function auffaelligkeit(q: QuizFrage, t: ReturnType<typeof hinweisTexte>, hinweise: ReadonlySet<string>): string {
  const teile: string[] = [];
  const v = q.vorpruefung;
  if (v?.ergebnis === 'korrigiert' || v?.ergebnis === 'fraglich') teile.push(`Vorprüfung „${v.ergebnis}“${v.hinweis ? `: ${einzeilig(v.hinweis)}` : ''}`);
  if (hinweise.has(q.id)) for (const h of t.pruef.get(q.id) ?? ['offen (siehe docs/quiz-pruefhinweise.md).']) teile.push(`Prüfhinweis: ${h}`);
  for (const n of t.normen.get(q.id) ?? []) teile.push(`Normenabgleich: ${n}`);
  if (istNeuOffen(q)) teile.push(`neu seit 26.10.2026 (Z24), noch nicht freigegeben${v ? '' : ', ohne Vorprüfung'}`);
  if (q.verified === true) teile.push('bereits freigegeben (verified)');
  return teile.join(' · ');
}

export interface ClusterListe { cluster: string; datei: string; inhalt: string; gesamt: number; auffaellig: number; ids: string[] }

export function erzeugePrueflisten(wurzel = process.cwd()): ClusterListe[] {
  const fragen: QuizFrage[] = JSON.parse(fs.readFileSync(path.join(wurzel, 'src/data/quiz.json'), 'utf8'));
  const hinweisText = fs.readFileSync(path.join(wurzel, 'docs/quiz-pruefhinweise.md'), 'utf8');
  const hinweise = offenePruefhinweise(hinweisText);
  const texte = hinweisTexte(hinweisText);
  const vorStand = fragen.map(q => q.vorpruefung?.am ?? '').filter(Boolean).sort().pop() ?? '';
  const stand = vorStand ? datumDe(vorStand) : '–';

  return META_CLUSTERS.map(c => {
    const datei = `${PRUEF_ORDNER}/quiz-cluster-${c.number}.md`;
    const abs = path.join(wurzel, datei);
    const kreuze = fs.existsSync(abs) ? vorhandeneEntscheidungen(fs.readFileSync(abs, 'utf8')) : new Map<string, string[]>();
    const f = fragen.filter(q => quizCluster(q.moduleId)?.id === c.number);
    const auff = f.filter(q => istAuffaellig(q, hinweise)).sort((a, b) => nachId(a.id, b.id));
    const unauff = f.filter(q => !istAuffaellig(q, hinweise)).sort((a, b) => nachHash(a.id, b.id)).slice(0, STICHPROBE);
    const module = new Set(f.map(q => q.moduleId)).size;
    const zahl = (fn: (q: QuizFrage) => boolean) => auff.filter(fn).length;
    // Lernziel-Stichprobe: bereits entschiedene Module (Kreuze) bleiben vorn, damit neue Modul-IDs (z. B. Teilmodule,
    // 28.10.2026) keine geprüften Einträge aus der Stichprobe verdrängen; aufgefüllt wird nach FNV-1a-Hash
    const lzAlle = Object.keys(LERNZIELE).filter(id => quizCluster(id)?.id === c.number).sort(nachHash);
    const lz = [...lzAlle.filter(id => kreuze.has(id)), ...lzAlle.filter(id => !kreuze.has(id))].slice(0, STICHPROBE);

    const teile: string[] = [
      `# Prüfliste Quiz – Cluster ${c.number}: ${c.name}`,
      '',
      `Stand: ${stand} · Grundlage: \`src/data/quiz.json\` (Felder \`vorpruefung\` und \`verified\`), \`docs/quiz-pruefhinweise.md\`, Lernziele aus \`src/data/lernziele.ts\`. Erzeugt mit \`npx tsx scripts/pruefliste.ts\`; gesetzte Kreuze übernimmt das Skript beim nächsten Lauf. quiz.json wurde für diese Liste nicht verändert.`,
      '',
      `Cluster ${c.number} umfasst ${f.length} Fragen aus ${module} Modulen. Aufgeführt sind ${auff.length} auffällige Fragen (Vorprüfung „korrigiert“ oder „fraglich“, offener Prüfhinweis oder neu seit 26.10.2026 ohne Freigabe) und eine Stichprobe von ${Math.min(STICHPROBE, unauff.length)} unauffälligen Fragen. Entscheidung je Frage ankreuzen; bei „ändern“ den Änderungswunsch in die Zeile darunter schreiben.`,
      '',
      `Auffällig im Einzelnen (Mehrfachnennung möglich): ${zahl(q => q.vorpruefung?.ergebnis === 'korrigiert')} korrigiert, ${zahl(q => q.vorpruefung?.ergebnis === 'fraglich')} fraglich, ${zahl(q => hinweise.has(q.id))} mit offenem Prüfhinweis, ${zahl(q => istNeuOffen(q))} neu seit 26.10.2026.`,
      '',
      '## A. Auffällige Fragen',
      '',
      ...(auff.length ? auff.map(q => frageBlock(q, auffaelligkeit(q, texte, hinweise), kreuze)) : ['Keine.', '']),
      `## B. Stichprobe unauffälliger Fragen (${unauff.length})`,
      '',
      'Auswahl deterministisch (Sortierung nach FNV-1a-Hash der Frage-ID), damit die Stichprobe nachvollziehbar ist.',
      '',
      ...unauff.map(q => frageBlock(q, q.vorpruefung ? `keine – Vorprüfung „${q.vorpruefung.ergebnis}“` : 'keine – ohne Vorprüfung', kreuze)),
      `## C. Lernziel-Stichprobe (${lz.length} Module)`,
      '',
      'Quelle: `src/data/lernziele.ts`. Zu prüfen: Lernziele operationalisiert („Sie können …“ + beobachtbares Verb), Bloom-Stufe passend, fachlich richtig, mit den Modulinhalten und Quizfragen abgedeckt.',
      '',
      ...lz.map(id => {
        const l = LERNZIELE[id];
        return [
          `### ${id} · ${MODUL_KERN.get(id)?.label ?? id}`,
          '',
          `Niveau ${l.niveau} · ${l.minuten} min · Vorwissen: ${l.vorwissen.length ? l.vorwissen.join(', ') : '–'}`,
          '',
          ...l.ziele.map(z => `- (${z.stufe}) Sie können ${z.text}`),
          '',
          ...(kreuze.get(id) ?? STANDARD),
          '',
        ].join('\n');
      }),
    ];
    const inhalt = teile.join('\n').replace(/\n{3,}/g, '\n\n').replace(/\n*$/, '\n');
    return { cluster: c.number, datei, inhalt, gesamt: f.length, auffaellig: auff.length, ids: auff.map(q => q.id) };
  });
}


// Direktaufruf
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const nurPruefen = process.argv.includes('--check');
  let veraltet = 0;
  for (const l of erzeugePrueflisten()) {
    const alt = fs.existsSync(l.datei) ? fs.readFileSync(l.datei, 'utf8') : '';
    const gleich = alt === l.inhalt;
    if (!gleich) veraltet++;
    if (!nurPruefen && !gleich) fs.writeFileSync(l.datei, l.inhalt);
    console.log(`${l.datei}: ${l.auffaellig} auffällig / ${l.gesamt} gesamt${gleich ? ' (aktuell)' : nurPruefen ? ' – VERALTET' : ' – neu geschrieben'}`);
  }
  if (nurPruefen && veraltet) { console.error(`${veraltet} Prüfliste(n) veraltet → npx tsx scripts/pruefliste.ts`); process.exit(1); }
}
