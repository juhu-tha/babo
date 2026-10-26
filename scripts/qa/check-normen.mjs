#!/usr/bin/env node
/**
 * Normenstand-Prüfung (Umsetzungsplan Phase 0, AP 0.5)
 *
 * 1. Dieselbe Norm wird in allen ModuleFooter-„regelwerke“ mit derselben Hauptausgabe zitiert.
 * 2. Die Hauptausgabe stimmt mit der zentralen Normen-Registry (src/data/centralNormenRegistry.ts) überein.
 * Ausgenommen sind Zitate, die ausdrücklich eine Folge-/Vorgängerausgabe benennen
 * (z. B. „2. Generation“, „noch nicht eingeführt“, „Entwurf“, „vorbestellbar“).
 */
import fs from 'fs';
import path from 'path';
import { inhaltsDateien } from './inhaltDateien.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const NORM = /\b((?:DIN(?:\s+(?:EN|ISO|IEC|CEN\/TS|SPEC|CEN\/TR))*(?:\s+ISO)?|EN(?:\s+ISO)?|ISO)\s+\d+(?:[-–]\d+)*(?:\/NA)?(?:\/A\d+)?)\s*:\s*((?:19|20)\d{2}(?:-\d{2})?)/;
const AUSNAHME = /Generation|nicht eingeführt|noch nicht|Entwurf|vorbestellbar|historisch|zurückgezogen|Vorgänger/i;
const norm = s => s.replace(/\s+/g, ' ').replace('–', '-');

function dateien(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? dateien(p) : /\.tsx?$/.test(e.name) ? [p] : [];
  });
}

// Registry-Stand: Normnummer → Ausgabe
const reg = fs.readFileSync(path.join(ROOT, 'src/data/centralNormenRegistry.ts'), 'utf8');
const registry = new Map();
for (const m of reg.matchAll(/code:\s*'([^']+)'/g)) {
  for (const teil of m[1].split(/\s*[\/&]\s*(?=DIN|EN|ISO)/)) {
    const n = teil.match(NORM);
    if (n && !registry.has(norm(n[1]))) registry.set(norm(n[1]), n[2]); // erste Angabe = maßgebende Fassung
  }
}

const haupt = new Map(); // Norm → Map(Ausgabe → [Fundstellen])
for (const f of dateien(path.join(ROOT, 'src'))) {
  const s = fs.readFileSync(f, 'utf8');
  for (const block of s.matchAll(/regelwerke=\{\[([\s\S]*?)\]\}/g)) {
    for (const t of block[1].matchAll(/title:\s*'((?:[^'\\]|\\.)*)'/g)) erfasse(t[1], f);
  }
}
// ausgelagerte Fußzeilen (AP 5.3): content/**/*.json → daten["<Komponente>.regelwerke"] = [{ title, … }]
for (const f of inhaltsDateien()) {
  const daten = JSON.parse(fs.readFileSync(f, 'utf8')).daten ?? {};
  for (const [k, v] of Object.entries(daten)) {
    if (/(^|\.)regelwerke(_\d+)?$/.test(k) && Array.isArray(v)) for (const e of v) if (e && typeof e.title === 'string') erfasse(e.title, f);
  }
}

function erfasse(titel, f) {
  const n = titel.match(NORM);
  if (!n || n.index > 2 || AUSNAHME.test(titel)) return;
  const k = norm(n[1]);
  if (!haupt.has(k)) haupt.set(k, new Map());
  const m = haupt.get(k);
  if (!m.has(n[2])) m.set(n[2], []);
  m.get(n[2]).push(path.relative(ROOT, f));
}

const fehler = [];
for (const [k, ausgaben] of haupt) {
  if (ausgaben.size > 1) {
    fehler.push(`${k}: uneinheitliche Ausgaben ${[...ausgaben].map(([a, f]) => `${a} (${f.join(', ')})`).join(' vs. ')}`);
  }
  const soll = registry.get(k);
  if (soll) for (const [a, f] of ausgaben) if (a !== soll && !soll.startsWith(a)) fehler.push(`${k}:${a} in ${f.join(', ')} – Registry nennt ${soll}`);
}

console.log(`${haupt.size} Normen in Modul-Fußzeilen, ${registry.size} in der Registry.`);
if (fehler.length) {
  for (const e of fehler) console.error('FEHLER ' + e);
  process.exit(1);
}
console.log('Normenstand einheitlich: 0 Abweichungen.');
