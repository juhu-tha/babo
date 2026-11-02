// Begriffs-Styleguide (Umsetzungsplan Phase 3, AP 3.10) – Regeln siehe docs/begriffe.md
import fs from 'fs';
import path from 'path';

const fehler: string[] = [];
console.log('--- Test: Begriffe ---');

const REGELN: { name: string; muster: RegExp; erlaubt?: RegExp }[] = [
  { name: 'Wasserzementwert', muster: /Wasser-Zement-Wert|[wW]\/[zZ]-Verhältnis|W\/Z-Wert/g },
  {
    name: 'Gesteinskörnung statt Zuschlag',
    muster: /\b[\wäöü-]*(Zuschlagst?off|Zuschlagsstoff|Leichtzuschlag|Gesteinszuschlag|RC-Zuschlag|Zuschlagskörn|Zuschlagskorn|Betonzuschlag)[\wäöü]*/gi,
    erlaubt: /pflanzliche Zuschlagstoffe|Zuschlagstoffe \(Kalk\)|strukturverbessernden Zuschlagstoffen|'rc-zuschlag'/,
  },
  { name: 'Euler-Fall arabisch', muster: /Euler-?[Ff]äll?e? [IV]+\b|Eulerfall/g },
  // Entscheidung 02.11.2026: Normbegriff je Norm. DIN 18533:2026-06 sagt „Wasserbeanspruchungsklasse“ (W1-E bis W4-E;
  // „Wassereinwirkungsklasse“ nur als Begriff der Ausgabe 2017-07); DIN 18534/18535 behalten „Wassereinwirkungsklasse“ (W0-I bis W3-I, W1-B bis W3-B).
  {
    name: 'Wasserbeanspruchungsklasse (DIN 18533:2026-06)',
    muster: /\bWassereinwirkungsklassen?\b/g,
    erlaubt: /2017|W[0-4]-[IB]\b|DIN 1853[45]|Dusche/,
  },
];

const dateien = (fs.readdirSync('src', { recursive: true }) as string[])
  .filter(f => /\.(tsx?|json)$/.test(f))
  .filter(f => !f.includes(`${path.sep}ki${path.sep}`) && !f.endsWith('digitalesTasks.ts'));

// ausgelagerte Fachtexte (AP 5.3) unter content/ zählen mit
const inhalte = (fs.existsSync('content') ? fs.readdirSync('content', { recursive: true }) as string[] : [])
  .filter(f => f.endsWith('.json') && !f.startsWith(`ki${path.sep}`))
  .map(f => path.join('..', 'content', f));
for (const rel of [...dateien, ...inhalte]) {
  const zeilen = fs.readFileSync(path.join('src', rel), 'utf8').split('\n');
  zeilen.forEach((zeile, i) => {
    if (/^\s*\/\//.test(zeile)) return;
    for (const r of REGELN) {
      for (const m of zeile.matchAll(r.muster)) {
        if (r.erlaubt && r.erlaubt.test(zeile)) continue;
        if (/eulerFall|setEulerFall/.test(m[0])) continue;
        fehler.push(`${rel}:${i + 1}: ${r.name} – „${m[0]}“`);
      }
    }
  });
}

// Sie-Form in den Lerntipps und Erklärungen des Quizpools
const quiz = JSON.parse(fs.readFileSync('src/data/quiz.json', 'utf8')) as { id: string; explanation: string; question: string; gapAnalysis?: { actionableAdvice?: string } }[];
const DU = /\b(du|dein\w*|dir|dich)\b/;
const IMPERATIV = /^(Wiederhole|Prüfe|Lies|Gehe|Studiere|Schau|Beachte|Achte|Vergleiche|Rechne|Merke)\b/;
for (const q of quiz) {
  for (const t of [q.question, q.explanation, q.gapAnalysis?.actionableAdvice ?? '']) {
    if (DU.test(t) || IMPERATIV.test(t)) fehler.push(`quiz ${q.id}: Du-Form – „${t.slice(0, 60)}…“`);
  }
}

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: ${dateien.length + inhalte.length} Dateien, ${quiz.length} Quizfragen ohne Befund`);
