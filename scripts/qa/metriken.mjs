#!/usr/bin/env node
/**
 * Metrik-Baseline (Umsetzungsplan Phase 0, AP 0.7)
 * Reproduziert die Kennzahlen des Reviews vom 23.10.2026 und schreibt docs/metriken.json.
 * Aufruf: npm run -s metriken  (nach `npx vite build` enthält die Ausgabe auch Bundle-Größen)
 * Spätere Phasen vergleichen gegen diese Datei (Ratchet: Werte dürfen nur besser werden).
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const r = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
function dateien(dir, re = /\.tsx?$/) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? dateien(p, re) : re.test(e.name) ? [p] : [];
  });
}
const src = dateien('src');
const inhalt = Object.fromEntries(src.map(f => [f, r(f)]));
const zaehle = re => src.filter(f => re.test(inhalt[f])).length;
const zeilen = f => inhalt[f].split('\n').length;

// Fließtext-Wörter: JSX-Text und Zeichenketten mit Leerzeichen (Näherung wie im Review)
function woerter(code) {
  const teile = [...code.matchAll(/>([^<>{}]+)</g)].map(m => m[1])
    .concat([...code.matchAll(/'((?:[^'\\\n]|\\.)* (?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)* (?:[^"\\\n]|\\.)*)"|`([^`]* [^`]*)`/g)].map(m => m[1] || m[2] || m[3]));
  return teile.reduce((s, t) => {
    const tok = t.trim().split(/\s+/);
    if (tok.filter(w => /[-:\/\[\]#=]/.test(w)).length > 0.4 * tok.length) return s; // CSS-Klassen u. ä.
    return s + (t.match(/[A-Za-zÄÖÜäöüß]{2,}/g) || []).length;
  }, 0);
}

// Quiz
const quiz = JSON.parse(r('src/data/quiz.json'));
const proModul = {};
for (const q of quiz) proModul[q.moduleId] = (proModul[q.moduleId] || 0) + 1;
const anzahlen = Object.values(proModul).sort((a, b) => a - b);
let laengste = 0, verhSum = 0, absolut = 0;
for (const q of quiz) {
  const ok = q.options[q.correctIdx];
  if (typeof ok !== 'string') continue;
  const andere = q.options.filter(o => o !== ok);
  if (ok.length > Math.max(...andere.map(o => o.length))) laengste++;
  verhSum += ok.length / (andere.reduce((s, o) => s + o.length, 0) / andere.length);
  absolut += andere.filter(o => /(ausschließlich|stets|immer|niemals|grundsätzlich|keinesfalls|jede[rsnm]?|alle)\b/i.test(o)).length;
}

// Code
const anyAnzahl = src.reduce((s, f) => s + (inhalt[f].match(/:\s*any\b|as any\b|<any>/g) || []).length, 0);
const gross = src.filter(f => zeilen(f) > 1500).map(f => ({ datei: f, zeilen: zeilen(f) })).sort((a, b) => b.zeilen - a.zeilen);
const module = src.filter(f => f.startsWith('src/modules/'));

// Bundle (falls gebaut)
let bundle = null;
const assets = dateien('dist/assets', /\.js$/);
if (assets.length) {
  const groessen = assets.map(f => { const b = fs.readFileSync(path.join(ROOT, f)); return { datei: path.basename(f), kB: Math.round(b.length / 1024), gzip_kB: Math.round(zlib.gzipSync(b).length / 1024) }; });
  const html = fs.existsSync(path.join(ROOT, 'dist/index.html')) ? r('dist/index.html') : '';
  const einstieg = groessen.filter(g => html.includes(g.datei));
  bundle = {
    chunks: groessen.length,
    gesamt_kB: groessen.reduce((s, g) => s + g.kB, 0),
    einstieg_gzip_kB: einstieg.reduce((s, g) => s + g.gzip_kB, 0),
    groesste: groessen.sort((a, b) => b.kB - a.kB).slice(0, 5),
  };
}

const m = {
  stand: new Date().toISOString().slice(0, 10),
  didaktik: {
    moduldateien: module.length,
    mit_ModuleFooter: zaehle(/<ModuleFooter\b/),
    mit_Herleitung: zaehle(/<FormulaDerivationBox\b/),
    mit_ModulTest: zaehle(/<ModulTest\b/),
    mit_Lernzielen: zaehle(/<BloomLernziele\b/),
    freigabe_ausstehend: zaehle(/lastReviewed\s*=\s*["']nicht geprüft|fachliche Freigabe .*ausstehend/),
    quizfragen: quiz.length,
    quiz_moduleIds: anzahlen.length,
    quiz_median_je_modul: anzahlen[Math.floor(anzahlen.length / 2)],
    quiz_module_unter_5: anzahlen.filter(a => a < 5).length,
    quiz_richtige_ist_laengste_pct: Math.round(100 * laengste / quiz.length),
    quiz_laengenverhaeltnis: Math.round(100 * verhSum / quiz.length) / 100,
    quiz_absolutwoerter_distraktoren: absolut,
    quiz_geprueft: quiz.filter(q => q.verified).length,
    module_ueber_5000_woerter: module.filter(f => woerter(inhalt[f]) > 5000).length,
  },
  technik: {
    quelldateien: src.length,
    zeilen_gesamt: src.reduce((s, f) => s + zeilen(f), 0),
    any: anyAnzahl,
    dateien_ueber_1500_zeilen: gross.length,
    groesste_dateien: gross.slice(0, 5),
    ts_ignore: src.reduce((s, f) => s + (inhalt[f].match(/@ts-ignore|@ts-nocheck/g) || []).length, 0),
    tests: dateien('tests', /\.test\.ts$/).length,
    lockfile: fs.existsSync(path.join(ROOT, 'package-lock.json')),
    ci_workflow: fs.existsSync(path.join(ROOT, '.github/workflows/qa.yml')),
  },
  bundle,
};

const ziel = path.join(ROOT, 'docs/metriken.json');
if (process.argv.includes('--schreiben')) fs.writeFileSync(ziel, JSON.stringify(m, null, 2) + '\n');
console.log(JSON.stringify(m, null, 2));
