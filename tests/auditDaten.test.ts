// Admin-Bereich „Audit“: erzeugte Daten (scripts/auditDaten.ts → virtual:audit-daten) sind vollständig und aktuell,
// statische Daten (src/data/audit/*.ts) sind gültig, der Audit-Bereich wird nur lazy geladen.
import fs from 'fs';
import path from 'path';
import {
  erzeugeAuditDaten, auditDatenPlugin, AUDIT_DATEN_ID, F_ORDNER, F_MARKE, FACHGEBIET_SONST,
  kontextVon, fachgebietVon, offenePruefhinweise, prueflistenKopf, einstiegGzipKB, NEU_SEIT_26_10,
} from '../scripts/auditDaten';
import { GUTACHTEN_27_10, notenMittel } from '../src/data/audit/gutachten';
import { ZULIEFERUNGEN } from '../src/data/audit/zulieferungen';
import { UMSETZUNGSPLAN, phasenStand } from '../src/data/audit/umsetzungsplan';
import { AUDIT_STATUS_TEXT, passtFilter, type AuditStatus } from '../src/data/audit/typen';
import { quizCluster } from '../src/data/quizZuordnung';
import { spawnSync } from 'child_process';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Audit-Daten (Admin) ---');

const d = await erzeugeAuditDaten();

// 1. F-Freigabe: jede Fundstelle (unabhängig gesucht) genau einmal in der Liste, nichts zusätzlich
function alle(ordner: string): string[] {
  if (!fs.existsSync(ordner)) return [];
  return fs.readdirSync(ordner, { withFileTypes: true }).flatMap(e => {
    const p = `${ordner}/${e.name}`;
    return e.isDirectory() ? alle(p) : /\.(tsx?|json|mjs)$/.test(e.name) ? [p] : [];
  });
}
const soll = new Set<string>();
for (const o of F_ORDNER) for (const f of alle(o)) {
  if (f.startsWith('src/data/audit/')) continue;
  fs.readFileSync(f, 'utf8').split('\n').forEach((z, i) => { if (F_MARKE.test(z)) soll.add(`${f}:${i + 1}`); });
}
const ist = d.fFreigabe.gruppen.flatMap(g => g.eintraege.map(e => `${e.datei}:${e.zeile}`));
pruefe(ist.length === new Set(ist).size, 'F-Freigabe: Fundstelle doppelt gelistet');
pruefe(ist.length === d.fFreigabe.gesamt, `F-Freigabe: gesamt ${d.fFreigabe.gesamt} ≠ Einträge ${ist.length}`);
for (const s of soll) pruefe(ist.includes(s), `F-Freigabe: ${s} fehlt in der Liste`);
for (const s of ist) pruefe(soll.has(s), `F-Freigabe: ${s} ist keine Fundstelle`);
pruefe(soll.size > 0, 'F-Freigabe: keine Fundstellen gefunden (Suche defekt?)');
for (const g of d.fFreigabe.gruppen) for (const e of g.eintraege) pruefe(F_MARKE.test(e.kontext) || e.kontext.length > 0, `${e.datei}:${e.zeile}: leerer Kontext`);
const sonst = d.fFreigabe.gruppen.find(g => g.fachgebiet === FACHGEBIET_SONST);
if (sonst) console.warn(`Hinweis: ${sonst.eintraege.length} F-Freigabe-Fundstellen ohne Fachgebiet (FACHGEBIETE in scripts/auditDaten.ts ergänzen): ${sonst.eintraege.map(e => e.datei).join(', ')}`);
// Hilfsfunktionen
pruefe(kontextVon([' * erste Zeile mit Wert 0,121', ' *   vorläufig, F-Freigabe'], 1) === 'erste Zeile mit Wert 0,121 vorläufig, F-Freigabe', 'kontextVon: Kommentar-Fortsetzung');
pruefe(kontextVon(['x'.repeat(500) + ' F-Freigabe ' + 'y'.repeat(100)], 0).includes('F-Freigabe'), 'kontextVon: Kürzung verliert die Marke');
pruefe(fachgebietVon('src/calc/schall.ts', '') === 'Bauphysik – Schallschutz', 'fachgebietVon: Datei');
pruefe(fachgebietVon('src/data/rechnerGrenzen.ts', 'Fließgrenze: Einpunktverfahren') === 'Geotechnik', 'fachgebietVon: Kontext');

// 2. Quiz-Prüflisten: Zählungen = quiz.json
const fragen: { id: string; moduleId: string; verified?: boolean; vorpruefung?: { ergebnis?: string } }[] = JSON.parse(fs.readFileSync('src/data/quiz.json', 'utf8'));
pruefe(d.quiz.gesamt === fragen.length, `Quiz gesamt ${d.quiz.gesamt} ≠ ${fragen.length}`);
pruefe(d.quiz.verified === fragen.filter(q => q.verified === true).length, 'Quiz verified weicht ab');
pruefe(d.quiz.cluster.reduce((s, c) => s + c.gesamt, 0) + d.quiz.ohneCluster === fragen.length, 'Quiz: Summe der Cluster + ohne Cluster ≠ gesamt');
const hinweise = offenePruefhinweise(fs.readFileSync('docs/quiz-pruefhinweise.md', 'utf8'));
for (const c of d.quiz.cluster) {
  const f = fragen.filter(q => quizCluster(q.moduleId)?.id === c.cluster);
  pruefe(c.gesamt === f.length, `Cluster ${c.cluster}: gesamt ${c.gesamt} ≠ ${f.length}`);
  pruefe(c.verified === f.filter(q => q.verified === true).length, `Cluster ${c.cluster}: verified weicht ab`);
  pruefe(c.auffaellig === f.filter(q => ['korrigiert', 'fraglich'].includes(q.vorpruefung?.ergebnis ?? '') || hinweise.has(q.id) || (NEU_SEIT_26_10.test(q.id) && q.verified !== true)).length, `Cluster ${c.cluster}: auffällig weicht ab`);
  pruefe(!c.liste || (c.liste.gesamt === c.gesamt && c.liste.auffaellig === c.auffaellig), `Cluster ${c.cluster}: Prüfliste veraltet (${c.liste?.auffaellig}/${c.liste?.gesamt} statt ${c.auffaellig}/${c.gesamt}) → npx tsx scripts/pruefliste.ts`);
  pruefe(c.auffaellig <= c.gesamt && c.verified <= c.gesamt, `Cluster ${c.cluster}: Zähler > gesamt`);
  pruefe(!!c.datei, `Cluster ${c.cluster}: Prüfliste docs/pruefung/quiz-cluster-${c.cluster}.md fehlt`);
  pruefe(!c.datei || !!c.liste, `Cluster ${c.cluster}: Kopfzahlen der Prüfliste nicht lesbar („umfasst N Fragen … Aufgeführt sind M auffällige“)`);
}
for (const datei of fs.readdirSync('docs/pruefung').filter(f => /^quiz-cluster-.+\.md$/.test(f))) {
  const nr = /^quiz-cluster-(.+)\.md$/.exec(datei)![1];
  pruefe(d.quiz.cluster.some(c => c.cluster === nr), `Prüfliste ${datei} ohne Cluster in den Daten`);
}
pruefe(offenePruefhinweise('- [ ] **q_a_1, qn_b_2**: x\n- [x] **q_c_3**: erledigt\nBereits korrigiert: q_d_4 – bitte bestätigen.').size === 3, 'offenePruefhinweise: Muster');
pruefe(JSON.stringify(prueflistenKopf('Stand: 27.10.2026 · x\nCluster I umfasst 235 Fragen aus 38 Modulen. Aufgeführt sind 17 auffällige Fragen'))
  === JSON.stringify({ gesamt: 235, auffaellig: 17, stand: '27.10.2026' }), 'prueflistenKopf: Muster');

// 3. Kennzahlen plausibel
const k = d.kennzahlen;
pruefe(k.rechenkerne === fs.readdirSync('src/calc').filter(f => f.endsWith('.ts') && f !== 'plausibilitaet.ts').length, 'Rechenkerne weichen ab');
pruefe(k.testdateien === fs.readdirSync('tests').filter(f => f.endsWith('.test.ts')).length, 'Testdateien weichen ab');
pruefe(k.quizfragen === fragen.length, 'Kennzahl Quizfragen weicht ab');
pruefe(k.module > 0 && k.fachmodule > 0 && k.fachmodule <= k.module, 'Module/Fachmodule unplausibel');
pruefe(k.fachmoduleGeprueft + k.fachmoduleOffen === k.fachmodule, 'Prüfvermerke: Summe ≠ Fachmodule');
pruefe(k.zeilenGesamt === k.bereiche.reduce((s, b) => s + b.zeilen, 0), 'Zeilen: Summe weicht ab');
pruefe(k.bundle.grenzeKB !== null, 'Bundle-Budget aus check-bundle.mjs nicht lesbar (GRENZE_EINSTIEG)');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const p of d.pakete) pruefe(String(pkg.dependencies?.[p.name] ?? pkg.devDependencies?.[p.name]).includes(p.version), `Paket ${p.name}: Version ${p.version} nicht in package.json`);
pruefe(d.pakete.some(p => p.name === 'react') && d.pakete.some(p => p.name === 'typescript'), 'Pakete: react/typescript fehlen');
// mit vollständigem Build (check-bundle verlangt seit #209 auch server.cjs und routen.json): Einstiegsgröße wie scripts/qa/check-bundle.mjs
if (fs.existsSync('dist/index.html') && fs.existsSync('dist/server.cjs') && fs.existsSync('dist/modul/routen.json')) {
  const cb = spawnSync(process.execPath, ['scripts/qa/check-bundle.mjs'], { encoding: 'utf8' }).stdout.match(/Einstieg [^:]+: ([\d,]+) kB gzip/);
  pruefe(!!cb && einstiegGzipKB('dist') === Number(cb[1].replace(',', '.')), `Einstieg: auditDaten ${einstiegGzipKB('dist')} kB, check-bundle ${cb?.[1]} kB`);
}

// 4. Plugin liefert dieselben Daten wie der Generator und ist in vite.config.ts eingebunden
const plugin = auditDatenPlugin();
const resolve = plugin.resolveId as (id: string) => string | undefined;
const load = plugin.load as (id: string) => Promise<string | undefined>;
const id = resolve(AUDIT_DATEN_ID);
pruefe(!!id, 'Plugin löst virtual:audit-daten nicht auf');
const code = id ? await load(id) : undefined;
const json = code ? /JSON\.parse\((".*")\);/s.exec(code)?.[1] : undefined;
const ausPlugin = json ? JSON.parse(JSON.parse(json)) : undefined;
pruefe(!!ausPlugin && JSON.stringify({ ...ausPlugin, erzeugtAm: '' }) === JSON.stringify({ ...d, erzeugtAm: '' }), 'Plugin-Daten weichen vom Generator ab');
pruefe(/auditDatenPlugin\(\)/.test(fs.readFileSync('vite.config.ts', 'utf8')), 'auditDatenPlugin() fehlt in vite.config.ts');

// 5. Lazy: Admin.tsx importiert den Audit-Bereich nur dynamisch; virtual:audit-daten nur im Audit-Bereich
const admin = fs.readFileSync('src/modules/Admin.tsx', 'utf8');
pruefe(/React\.lazy\(\(\) => import\('@\/src\/components\/admin\/audit\/AuditBereich'\)\)/.test(admin), 'Admin.tsx: AuditBereich nicht per React.lazy geladen');
pruefe(!/^import (?!type)[^;]*components\/admin\/audit\//m.test(admin), 'Admin.tsx: statischer Import aus components/admin/audit');
const nutzer = alle('src').filter(f => /\.tsx?$/.test(f) && !f.endsWith('.d.ts') && fs.readFileSync(f, 'utf8').includes(`'${AUDIT_DATEN_ID}'`));
pruefe(nutzer.length === 1 && nutzer[0] === 'src/components/admin/audit/AuditBereich.tsx', `virtual:audit-daten außerhalb des Audit-Bereichs importiert: ${nutzer.join(', ')}`);

// 6. Statische Daten
const status = new Set(Object.keys(AUDIT_STATUS_TEXT));
const g = GUTACHTEN_27_10;
pruefe(g.kategorien.length === 6, 'Gutachten: 6 Kategorien erwartet');
for (const kat of g.kategorien) pruefe(kat.note >= 1 && kat.note <= 5 && kat.begruendung.length > 20, `Gutachten: ${kat.kategorie} unvollständig`);
pruefe(g.massnahmen.map(m => m.nr).join() === '1,2,3,4,5,6,7,8,9,10', 'Gutachten: Maßnahmen 1–10 erwartet');
for (const m of g.massnahmen) pruefe(status.has(m.status), `Maßnahme ${m.nr}: Status ${m.status}`);
pruefe(Math.abs(notenMittel() - g.kategorien.reduce((s, x) => s + x.note, 0) / 6) < 1e-9, 'notenMittel');
for (const z of ZULIEFERUNGEN) {
  pruefe(status.has(z.status), `Zulieferung ${z.nr}: Status ${z.status}`);
  pruefe(z.gegenstand.length > 0 && z.stand.length > 0, `Zulieferung ${z.nr}: Gegenstand/Stand leer`);
  for (const f of z.dateien ?? []) pruefe(fs.existsSync(f), `Zulieferung ${z.nr}: Datei ${f} fehlt`);
}
const filterSumme = (['offen', 'wartet', 'erledigt'] as const).reduce((s, f) => s + ZULIEFERUNGEN.filter(z => passtFilter(z.status, f)).length, 0);
pruefe(filterSumme === ZULIEFERUNGEN.length, 'Zulieferungen: jeder Punkt genau einem Filter zugeordnet');
pruefe(UMSETZUNGSPLAN.map(p => p.nr).join() === '0,1,2,3,4,5,6', 'Umsetzungsplan: Phasen 0–6 erwartet');
const aps = UMSETZUNGSPLAN.flatMap(p => p.aps.map(a => a.ap));
pruefe(aps.length === new Set(aps).size, 'Umsetzungsplan: AP doppelt');
for (const p of UMSETZUNGSPLAN) {
  pruefe(p.aps.length > 0, `Phase ${p.nr} ohne Arbeitspakete`);
  for (const a of p.aps) {
    pruefe(a.ap.startsWith(`${p.nr}.`), `AP ${a.ap} in Phase ${p.nr}`);
    pruefe(status.has(a.status as AuditStatus), `AP ${a.ap}: Status ${a.status}`);
  }
  const s = phasenStand(p);
  pruefe(s.erledigt + s.wartet + s.offen === s.gesamt && s.anteil >= 0 && s.anteil <= 1, `Phase ${p.nr}: Zählung`);
}
// keine Geheimnisse / Kennwörter in den Audit-Daten
for (const f of alle('src/data/audit').concat(['scripts/auditDaten.ts', 'src/components/admin/audit/AuditBereich.tsx'])) {
  const t = fs.readFileSync(f, 'utf8');
  pruefe(!/ADMIN_PASSWORD\s*=|GEMINI_API_KEY\s*=|AIza[0-9A-Za-z_-]{20,}/.test(t), `${path.basename(f)}: mögliches Geheimnis`);
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${d.fFreigabe.gesamt} F-Freigabe-Fundstellen in ${d.fFreigabe.gruppen.length} Fachgebieten, ${d.quiz.cluster.length} Cluster-Prüflisten, ${ZULIEFERUNGEN.length} Zulieferungen, ${aps.length} Arbeitspakete`);
