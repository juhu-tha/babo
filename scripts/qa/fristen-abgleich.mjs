#!/usr/bin/env node
/**
 * Fristen- und Schwellen-Abgleich (Auftrag 02.11.2026, Folge der Rechtsstandsprüfung docs/pruefung/rechtsstand-2026-11.md).
 *
 * Gleicht Fristen und Schwellenwerte aus Rechtsquellen, die in content/**.json und src/data/quiz.json genannt werden,
 * mit der zentralen Liste src/data/fristenSchwellen.ts ab und meldet Abweichungen.
 *
 * Aufruf:  node scripts/qa/fristen-abgleich.mjs            → Zusammenfassung, Exit 1 bei unbegründeten Abweichungen
 *          node scripts/qa/fristen-abgleich.mjs --alle     → zusätzlich alle erkannten Angaben (auch übereinstimmende)
 *          node scripts/qa/fristen-abgleich.mjs --json <datei>
 *
 * Erkennung (heuristisch, Einzelheiten im Kopf von src/data/fristenSchwellen.ts): Ein Muster des Eintrags trifft eine
 * Wertangabe, und ein Anker der Vorschrift steht höchstens 220 Zeichen davor oder 200 dahinter. Konkurrieren Einträge
 * derselben Familie um dieselbe Wertangabe, gilt der Eintrag mit dem nächsten Anker. Datumsangaben mit Monat oder Jahr
 * stimmen überein, wenn das Solldatum damit beginnt.
 * Aus dem Quiz werden Frage, richtige Antwort, Erklärung, Distraktor-Rückmeldungen, gapAnalysis.coreRule/actionableAdvice
 * und normRef gelesen – nicht die falschen Antwortoptionen und nicht gapAnalysis.misconception (absichtlich falsch).
 * Begründete Ausnahmen stehen in AUSNAHMEN; tests/fristenSchwellen.test.ts hält 0 unbegründete Abweichungen.
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { inhaltsDateien, inhaltsTexte } from './inhaltDateien.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Begründete Ausnahmen: { id (Eintrag), ort (Datei#Schlüssel bzw. quiz.json#Frage/Feld), wert (gefunden), grund }.
 * Ein Eintrag gilt nur für genau diese Fundstelle und diesen Wert.
 */
export const AUSNAHMEN = [];

const MONATE = 'Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember';
const MONAT_NR = Object.fromEntries(MONATE.split('|').map((m, i) => [m, String(i + 1).padStart(2, '0')]));
const ZAHLWORT = { acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12 };
const ABK = 'Art|Abs|Nr|bzw|ca|vgl|z|B|u|a|S|Anh|Buchst|Urt|v|d|h|i|e|o|Äq|ABl|BGBl|GMBl|Drs|Bl|Kap|Tab|Ziff';
export const BAUSTEINE = {
  D: String.raw`(?:\d{1,2}\.\s?\d{1,2}\.\s?\d{4}|\d{1,2}\.\s?(?:${MONATE})\s\d{4}|(?:${MONATE})\s\d{4})`,
  Z: String.raw`(?:\d{1,3}(?: \d{3})+(?:,\d+)?|\d+(?:,\d+)?)`,
  T: String.raw`(?:[^.;!?\n]|(?<=\d)\.|(?<=(?:^|[\s(/])(?:${ABK}))\.)`,
};
BAUSTEINE.J = String.raw`(?:${BAUSTEINE.D}|20\d\d)`;

/** Muster mit Platzhaltern in einen RegExp übersetzen; der erste Wert-Platzhalter wird zur Gruppe „w“ */
export function kompiliere(muster) {
  let gruppe = /\(\?<w>/.test(muster);
  const re = muster.replace(/\{([DJZT])\}/g, (_, k) => {
    if (k === 'T') return BAUSTEINE.T;
    if (gruppe) return BAUSTEINE[k];
    gruppe = true;
    return `(?<w>${BAUSTEINE[k]})`;
  });
  return new RegExp(re, 'gdiu');
}

/** Schreibweisen vereinheitlichen (Markdown, LaTeX-Zahlen, geschützte Leerzeichen) */
export function normalisiere(s) {
  return s
    .replace(/\{,\}/g, ',')
    .replace(/\\[,;: ]|~/g, ' ')
    .replace(/[   ]/g, ' ')
    .replace(/\*\*|__/g, '')
    .replace(/\$/g, '')
    .replace(/<\/?(?:strong|b|em|i)>/g, '');
}

/** Gefundene Angabe lesen: Datum → 'JJJJ-MM-TT' | 'JJJJ-MM' | 'JJJJ'; Zahl → number */
export function leseWert(roh) {
  const s = roh.trim();
  let m = s.match(/^(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  m = s.match(new RegExp(`^(\\d{1,2})\\.\\s?(${MONATE})\\s(\\d{4})$`));
  if (m) return `${m[3]}-${MONAT_NR[m[2]]}-${m[1].padStart(2, '0')}`;
  m = s.match(new RegExp(`^(${MONATE})\\s(\\d{4})$`));
  if (m) return `${m[2]}-${MONAT_NR[m[1]]}`;
  if (/^20\d\d$/.test(s)) return s;
  if (s.toLowerCase() in ZAHLWORT) return ZAHLWORT[s.toLowerCase()];
  const z = Number(s.replace(/ (?=\d{3}\b)/g, '').replace(',', '.'));
  return Number.isFinite(z) ? z : NaN;
}

/** Stimmt die gefundene Angabe mit dem Sollwert überein? */
export function stimmt(gefunden, soll) {
  if (typeof soll === 'number') return typeof gefunden === 'number' && Math.abs(gefunden - soll) < 1e-9;
  return typeof gefunden === 'string' && soll.startsWith(gefunden);
}

/** Einträge mit Erkennung vorbereiten */
export function bereite(eintraege) {
  return eintraege.filter(e => e.erkennung).map(e => ({
    ...e,
    _anker: new RegExp(e.erkennung.anker, 'gu'),
    _muster: e.erkennung.muster.map(kompiliere),
    _soll: [e.wert, ...(e.erkennung.zulaessig ?? [])],
  }));
}

/**
 * Einen Text prüfen. Ergebnis: Treffer { id, wert (gefunden), soll, ok, auszug, pos }.
 * optionen.nachherFaktor: Gewicht der Entfernung eines Ankers hinter der Angabe (Standard 1; der Klassengrenzen-Abgleich
 * zieht mit 4 den Parameter vor der Angabe vor, z. B. „Kupfer (RC-1: ≤ 110 µg/l, RC-2: ≤ 250 µg/l), Chrom …“).
 */
export function pruefeText(textRoh, eintraege, optionen = {}) {
  const nachher = optionen.nachherFaktor ?? 1;
  const text = normalisiere(textRoh);
  const kandidaten = [];
  for (const e of eintraege) {
    const anker = [...text.matchAll(e._anker)].map(m => [m.index, m.index + m[0].length]);
    if (!anker.length) continue;
    for (const re of e._muster) {
      for (const m of text.matchAll(re)) {
        const [ws, we] = m.indices.groups.w;
        let dist = Infinity;
        for (const [as, ae] of anker) {
          if (ae <= m.index && m.index - ae <= 220) dist = Math.min(dist, m.index - ae);
          else if (as >= m.index && as - (m.index + m[0].length) <= 200) dist = Math.min(dist, Math.max(0, as - m.index) * nachher);
        }
        if (dist === Infinity) continue;
        const wert = leseWert(m.groups.w);
        kandidaten.push({ e, ws, we, dist, wert, auszug: text.slice(Math.max(0, m.index - 60), Math.min(text.length, m.index + m[0].length + 40)) });
      }
    }
  }
  // je Wertangabe und Familie den Eintrag mit dem nächsten Anker behalten; doppelte Treffer eines Eintrags zusammenfassen
  const beste = new Map();
  for (const k of kandidaten) {
    const schl = `${k.e.erkennung.familie ?? k.e.id}|${k.ws}`;
    const alt = beste.get(schl);
    if (!alt || k.dist < alt.dist) beste.set(schl, k);
  }
  const gesehen = new Set();
  const aus = [];
  for (const k of beste.values()) {
    const schl = `${k.e.id}|${k.ws}`;
    if (gesehen.has(schl)) continue;
    gesehen.add(schl);
    aus.push({ id: k.e.id, wert: k.wert, soll: k.e.wert, ok: k.e._soll.some(s => stimmt(k.wert, s)), auszug: k.auszug.replace(/\s+/g, ' '), pos: k.ws });
  }
  return aus.sort((a, b) => a.pos - b.pos);
}

/** Quizfelder, die richtige Aussagen enthalten sollen */
export function quizFelder(q) {
  const f = [['question', q.question], ['antwort', (q.options ?? [])[q.correctIdx] ?? ''], ['explanation', q.explanation ?? '']];
  (q.distraktorFeedback ?? []).forEach((s, i) => { if (s) f.push([`distraktorFeedback.${i}`, s]); });
  const g = q.gapAnalysis ?? {};
  for (const k of ['coreRule', 'actionableAdvice']) if (g[k]) f.push([`gapAnalysis.${k}`, g[k]]);
  if (q.normRef) f.push(['normRef', q.normRef]);
  return f.filter(([, t]) => typeof t === 'string' && t);
}

/** Alle zu prüfenden Texteinheiten: { ort, text } */
export function texteinheiten(root = ROOT) {
  const aus = [];
  for (const d of inhaltsDateien(path.join(root, 'content'))) {
    const rel = path.relative(root, d).split(path.sep).join('/');
    for (const t of inhaltsTexte(d)) aus.push({ ort: `${rel}#${t.gruppe}.${t.schluessel}${t.eigenschaft ? '.' + t.eigenschaft : ''}`, text: t.text });
  }
  const quiz = JSON.parse(fs.readFileSync(path.join(root, 'src/data/quiz.json'), 'utf8'));
  for (const q of quiz) for (const [feld, t] of quizFelder(q)) aus.push({ ort: `src/data/quiz.json#${q.id}/${feld}`, text: t, quizId: q.id });
  return aus;
}

export const ausnahmeSchluessel = (id, ort, wert) => `${id}|${ort}|${wert}`;

/** Gesamtlauf: { treffer, abweichungen (unbegründet), ausnahmenGenutzt, ausnahmenUngenutzt } */
export async function abgleich({ root = ROOT, eintraege, einheiten } = {}) {
  if (!eintraege) {
    const { tsImport } = await import('tsx/esm/api');
    const mod = await tsImport(pathToFileURL(path.join(root, 'src/data/fristenSchwellen.ts')).href, import.meta.url);
    eintraege = mod.FRISTEN_SCHWELLEN;
  }
  const vorb = bereite(eintraege);
  const treffer = [];
  for (const u of einheiten ?? texteinheiten(root)) for (const t of pruefeText(u.text, vorb)) treffer.push({ ...t, ort: u.ort, quizId: u.quizId });
  const erlaubt = new Map(AUSNAHMEN.map(a => [ausnahmeSchluessel(a.id, a.ort, a.wert), a]));
  const genutzt = new Set();
  const abweichungen = [];
  for (const t of treffer.filter(x => !x.ok)) {
    const k = ausnahmeSchluessel(t.id, t.ort, t.wert);
    if (erlaubt.has(k)) genutzt.add(k); else abweichungen.push(t);
  }
  return { treffer, abweichungen, ausnahmenGenutzt: [...genutzt], ausnahmenUngenutzt: [...erlaubt.keys()].filter(k => !genutzt.has(k)), eintraege };
}

const istHaupt = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (istHaupt) {
  const args = process.argv.slice(2);
  const erg = await abgleich();
  const mitErkennung = erg.eintraege.filter(e => e.erkennung).length;
  console.log(`Fristen- und Schwellen-Abgleich: ${erg.eintraege.length} Einträge (${mitErkennung} mit Erkennung), ${erg.treffer.length} erkannte Angaben, ` +
    `${erg.treffer.filter(t => t.ok).length} übereinstimmend, ${erg.abweichungen.length} Abweichung(en), ${erg.ausnahmenGenutzt.length} begründete Ausnahme(n).`);
  const zeig = t => `  ${t.ok ? 'ok ' : 'ABW'} ${t.id}: gefunden ${t.wert}, Soll ${t.soll}\n      ${t.ort}\n      … ${t.auszug} …`;
  if (args.includes('--alle')) for (const t of erg.treffer) console.log(zeig(t));
  else for (const t of erg.abweichungen) console.log(zeig(t));
  for (const k of erg.ausnahmenUngenutzt) console.log(`  Hinweis: Ausnahme ohne Treffer (entfernen?): ${k}`);
  const i = args.indexOf('--json');
  if (i >= 0 && args[i + 1]) fs.writeFileSync(args[i + 1], JSON.stringify(erg.treffer, null, 2));
  const proEintrag = new Map();
  for (const t of erg.treffer) proEintrag.set(t.id, (proEintrag.get(t.id) ?? 0) + 1);
  const ohne = erg.eintraege.filter(e => e.erkennung && !proEintrag.has(e.id)).map(e => e.id);
  if (ohne.length) console.log(`  Einträge ohne Fundstelle: ${ohne.join(', ')}`);
  process.exit(erg.abweichungen.length ? 1 : 0);
}

