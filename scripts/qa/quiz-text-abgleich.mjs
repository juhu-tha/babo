#!/usr/bin/env node
/**
 * Quiz-Text-Abgleich (Auftrag 02.11.2026 nach Nachstichprobe 4, docs/pruefung/nachstichprobe4-2026-11-02.md):
 * Quiz-Erklärungen, die bei Korrekturen am Modultext nicht nachgezogen wurden (oder umgekehrt), finden.
 *
 * Aufruf:  node scripts/qa/quiz-text-abgleich.mjs                 → Zusammenfassung auf der Konsole
 *          node scripts/qa/quiz-text-abgleich.mjs --json <datei>  → zusätzlich alle Treffer als JSON
 *          node scripts/qa/quiz-text-abgleich.mjs --modul <id>    → nur Fragen eines Moduls (moduleId oder Route)
 *          node scripts/qa/quiz-text-abgleich.mjs --seit <rev> [--json-seit <datei>] → zusätzlich (D) Änderungen seit <rev>
 *
 * Je Frage werden aus Frage, richtiger Antwort, Erklärung, Distraktor-Rückmeldungen, Lernhilfe (gapAnalysis) und normRef
 * gelesen (die falschen Antwortoptionen selbst nicht – sie sind absichtlich falsch) und gegen den Text des Moduls
 * (Komponente und Importkette laut scripts/qa/kennwert-abgleich.mjs, also content/<modul>/*.json und Modul-TSX)
 * sowie die zentralen Konstanten abgeglichen:
 *  (W) Größe = Zahl [Einheit]: dieselbe Größe (Formelzeichen oder Begriff unmittelbar vor der Zahl) mit derselben
 *      Einheit kommt im Modul vor, aber nie mit dem Wert der Frage (Rundung und Spannen berücksichtigt).
 *  (K) Klassen- und Stufenbegriffe (CC1–3, Expositions-, Festigkeits-, Einbau-, Konsistenz-, Nutzungs-, Brand-,
 *      Korrosivitätsklassen, Bewertungsstufen …): Begriff im Modul gar nicht genannt, oder ein Bezugswort steht im
 *      Modul nur neben anderen Klassen derselben Familie.
 *  (N) Normverweise: Ausgabe weicht von allen Ausgaben derselben Norm im Modul bzw. von der Normen-Registry ab;
 *      Tabelle/Abschnitt der Norm wird im Modul nicht genannt, obwohl das Modul die Norm mit anderen Fundstellen zitiert.
 *  (Z) Zahlenwerte gegen zentrale Konstanten (pruefeKennwerte aus kennwert-abgleich.mjs), jetzt auch in Rückmeldungen
 *      und Lernhilfe.
 *  (D) mit --seit <rev>: Angaben, die seit <rev> aus dem Modultext entfallen sind und in einer Frage des Moduls noch
 *      stehen (Modul korrigiert, Quiz nicht), und Angaben, die aus einer Frage entfernt wurden und im Modul weiter stehen.
 * Ergebnis ist eine Prüfliste (heuristisch, kein Urteil). Kein CI-Gate; tests/quizTextAbgleich.test.ts prüft Erkennung
 * und Lauffähigkeit sowie die zentralen Lehrwerte in Quiztexten (Dauerprüfung).
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { normalisiere, leseZahl, normVerweise, registryAusgaben, modulZuordnung, ladeReferenzen, pruefeKennwerte, passt } from './kennwert-abgleich.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const lies = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

// ------------------------------------------------------------------------------------------------ Text

const GRIECH = { mu: 'μ', xi: 'ξ', lambda: 'λ', eta: 'η', sigma: 'σ', tau: 'τ', psi: 'ψ', varphi: 'φ', phi: 'φ', Delta: 'Δ', delta: 'δ', omega: 'ω', kappa: 'κ', nu: 'ν', theta: 'θ', zeta: 'ζ', chi: 'χ' };
const TIEF = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };

/** Quiz- und Modultext vereinheitlichen (LaTeX, Tiefstellungen, Leerzeichen) */
export function text(s) {
  let t = normalisiere(String(s));
  t = t.replace(/\\(mu|xi|lambda|eta|sigma|tau|psi|varphi|phi|Delta|delta|omega|kappa|nu|theta|zeta|chi)(?![a-zA-Z])/g, (_, g) => GRIECH[g])
    .replace(/\\le(?:q)?(?![a-z])/g, '≤').replace(/\\ge(?:q)?(?![a-z])/g, '≥').replace(/\\approx/g, '≈').replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)')
    .replace(/_\{([^{}]{1,20})\}/g, '_$1').replace(/\^\{([^{}]{1,10})\}/g, '^$1')
    .replace(/[₀-₉]/g, c => TIEF[c]).replace(/\$/g, '').replace(/\\left|\\right/g, '')
    .replace(/[  ]/g, ' ').replace(/\s+/g, ' ');
  return t;
}

// ------------------------------------------------------------------------------------------------ (W) Größe = Wert

const ZAHL = String.raw`\d{1,3}(?: \d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?`;
/** Einheiten (längere zuerst); Schlüssel = vereinheitlichte Schreibweise */
const EINHEIT_LISTE = [
  ['W/(m·K)', String.raw`W\s*\/\s*\(?\s*m\s*·?\s*K\)?`], ['W/(m²·K)', String.raw`W\s*\/\s*\(?\s*m²\s*·?\s*K\)?`], ['m²·K/W', String.raw`m²\s*·?\s*K\s*\/\s*W`],
  ['kWh/(m²·a)', String.raw`kWh\s*\/\s*\(?\s*m²\s*·?\s*a\)?`], ['N/mm²', String.raw`N\s*\/\s*mm²|MPa`], ['GPa', 'GPa'], ['kN/m²', String.raw`kN\s*\/\s*m²|kPa`], ['kN/m³', String.raw`kN\s*\/\s*m³`],
  ['kN/m', String.raw`kN\s*\/\s*m(?![²³\w])`], ['kNm', String.raw`kNm|kN\s*·\s*m(?![²³\w])`], ['kN', 'kN'], ['MN', 'MN'], ['kg/m³', String.raw`kg\s*\/\s*m³`], ['kg/m²', String.raw`kg\s*\/\s*m²`],
  ['g/cm³', String.raw`g\s*\/\s*cm³|kg\s*\/\s*dm³|t\s*\/\s*m³`], ['l/m³', String.raw`(?:l|Liter)\s*\/\s*m³`], ['mm/m', String.raw`mm\s*\/\s*m(?![²³\w])`], ['mm/a', String.raw`mm\s*\/\s*a(?![\wäöü])`], ['µm/a', String.raw`[µμ]m\s*\/\s*a(?![\wäöü])`],
  ['mm²', 'mm²'], ['cm²', 'cm²'], ['m²', 'm²'], ['m³', 'm³'], ['µm', '[µμ]m'], ['mm', 'mm'], ['cm', 'cm'], ['km', 'km'], ['m', String.raw`m(?![\wäöü²³/])`],
  ['%', '%'], ['‰', '‰'], ['°C', '°C'], ['K', String.raw`K(?![\wäöü])`], ['dB', 'dB'], ['MJ', 'MJ'], ['kWh', 'kWh'],
  ['a', String.raw`(?:a|Jahre[n]?)(?![\wäöü])`], ['d', String.raw`(?:d|Tage[n]?)(?![\wäöü])`], ['h', String.raw`(?:h|Stunden)(?![\wäöü])`], ['min', String.raw`min(?![\wäöü])`],
];
const EINHEIT_RE = new RegExp(String.raw`(?<![\w.,/])(${ZAHL})(?:\s*(?:–|-|bis)\s*(${ZAHL}))?\s*(${EINHEIT_LISTE.map(e => `(?:${e[1]})`).join('|')})`, 'g');
const einheitSchluessel = roh => (EINHEIT_LISTE.find(([, re]) => new RegExp(`^(?:${re})$`).test(roh)) || [roh])[0];
/** dimensionslose Kennzahlen nur nach einem Formelzeichen mit Index oder griechischem Buchstaben */
const SYMBOL = String.raw`(?:[A-Za-zα-ωΔ]{1,3}_[\w,]{1,12}|[α-ωΔ](?:_[\w,]{1,12})?|w\/z|w\/b|k)`;
const DIMLOS_RE = new RegExp(String.raw`(?<![\w])(${SYMBOL})\s*(?:\([^()]{0,20}\))?\s*(=|≈|≤|≥|<|>)\s*(?:ca\.\s*|rund\s*)?(${ZAHL})(?![\d,.]*\s*(?:${EINHEIT_LISTE.map(e => `(?:${e[1]})`).join('|')}))(?!\s*[·*/+−-]\s*\d)`, 'g');
const STOPP = new Set(['dabei', 'diese', 'dieser', 'dieses', 'damit', 'durch', 'einer', 'eines', 'einem', 'werden', 'wird', 'sind', 'beträgt', 'liegt', 'nach', 'gemäß', 'etwa', 'rund', 'circa', 'mindestens', 'höchstens', 'zwischen', 'unter', 'über', 'oberhalb', 'unterhalb', 'insgesamt', 'jeweils', 'beispiel', 'beispielsweise', 'typisch', 'typische', 'typischen', 'maximal', 'minimal', 'werte', 'wert', 'wäre', 'ergibt', 'ergeben', 'daraus', 'hierbei', 'sowie', 'falls', 'wenn', 'beim', 'einen', 'eine', 'oder', 'auch', 'noch', 'also', 'statt', 'anstelle', 'gegenüber', 'bereits', 'schon', 'ohne', 'weniger', 'mehr', 'erst', 'richtig', 'falsch', 'hier', 'wurde', 'wurden', 'nicht', 'genau']);

/** Größe unmittelbar vor einer Zahl: Formelzeichen („f_ck =“) oder Substantiv (≥ 5 Zeichen) in ≤ 35 Zeichen ohne Satzgrenze */
function groesseVor(t, start) {
  const vor = t.slice(Math.max(0, start - 45), start);
  const satz = vor.split(/[.;!?:]\s|\(|\)|,\s(?=[a-zäöü]+\s)|\bund\b|\boder\b|\bbzw\./).pop();
  const sym = satz.match(new RegExp(String.raw`(?<![\w])(${SYMBOL})\s*(?:\([^()]{0,20}\))?\s*(?:=|≈|≤|≥|<|>|von|:)\s*(?:ca\.|rund|etwa|mind\.|max\.)?\s*$`));
  if (sym) return { art: 'symbol', key: sym[1].replace(/\s/g, '') };
  const w = [...satz.matchAll(/([A-ZÄÖÜ][a-zäöüß]{4,}(?:[-][A-ZÄÖÜa-zäöüß]+)?)/g)].map(m => m[1]).filter(x => !STOPP.has(x.toLowerCase()));
  if (!w.length) return null;
  return { art: 'begriff', key: w[w.length - 1].toLowerCase() };
}

/** Größen mit Wert eines Textes: [{ key, art, einheit, werte[], roh, pos }] */
export function groessenWerte(roh) {
  const t = text(roh);
  const aus = [];
  for (const m of t.matchAll(EINHEIT_RE)) {
    const g = groesseVor(t, m.index);
    if (!g) continue;
    const w1 = leseZahl(m[1]); const w2 = m[2] ? leseZahl(m[2]) : undefined;
    if (!Number.isFinite(w1)) continue;
    aus.push({ ...g, einheit: einheitSchluessel(m[3]), werte: w2 !== undefined ? [w1, w2] : [w1], spanne: w2 !== undefined, roh: m[0], pos: m.index, dez: dez(m[1]) });
  }
  for (const m of t.matchAll(DIMLOS_RE)) {
    const w = leseZahl(m[3]);
    if (!Number.isFinite(w)) continue;
    aus.push({ art: 'symbol', key: m[1].replace(/\s/g, ''), einheit: '–', werte: [w], spanne: false, roh: m[0], pos: m.index, dez: dez(m[3]), op: m[2] });
  }
  return aus;
}
const dez = roh => { const m = roh.match(/[.,](\d+)$/); return m && !/^\d{1,3}(?: \d{3})+$/.test(roh) ? m[1].length : 0; };
const gleich = (a, b, d) => passt(a, b, 0.005, d) || passt(b, a, 0.005, d);
function deckt(q, m) {
  if (q.spanne && m.spanne) return gleich(q.werte[0], m.werte[0], Math.min(q.dez, m.dez)) && gleich(q.werte[1], m.werte[1], Math.min(q.dez, m.dez));
  if (m.spanne) return q.werte.every(v => v >= m.werte[0] - 1e-9 && v <= m.werte[1] + 1e-9);
  if (q.spanne) return m.werte.every(v => v >= q.werte[0] - 1e-9 && v <= q.werte[1] + 1e-9);
  return gleich(q.werte[0], m.werte[0], Math.min(q.dez, m.dez));
}

// ------------------------------------------------------------------------------------------------ (K) Klassen

export const KLASSEN = [
  ['Schadensfolgeklasse', /\bCC\s?[1-3]\b/g],
  ['Zuverlässigkeitsklasse', /\bRC\s?[1-3](?![-\d])\b/g],
  ['Expositionsklasse', /\bX(?:0|C[1-4]|D[1-3]|S[1-3]|F[1-4]|A[1-3]|M[1-3])\b/g],
  ['Feuchtigkeitsklasse (AKR)', /\bW[OFAS]\b/g],
  ['Betonfestigkeitsklasse', /\bL?C\d{2,3}\/\d{2,3}\b/g],
  ['Stahlsorte', /\b(?:S(?:235|275|355|420|460)|B500[ABC]?|Y\d{4})\b/g],
  ['Holzfestigkeitsklasse', /\b(?:C(?:14|16|18|20|22|24|27|30|35|40|45|50)(?![\/\d])|D(?:18|24|30|35|40|50|60|70)|GL\s?\d{2}[hc])\b/g],
  ['Einbauklasse (LAGA)', /\bZ\s?(?:0\*|0|1\.1|1\.2|2)(?![\d.])/g],
  ['Materialklasse (EBV)', /\b(?:RC|BM-F|BM|BG-F|BG|GS|HMVA|SWS|SKG|CUM|HOS|SFA|SKA|GRS)-\d\*?/g],
  ['Konsistenzklasse', /\b(?:F[1-6]|SF[1-3]|S[1-5])\b/g],
  ['Korrosivitätskategorie', /\b(?:C[1-5]|CX|Im[1-4])\b(?!\/)/g],
  ['Nutzungsklasse Holz', /\b(?:NKL|Nutzungsklasse)\s?[1-3]\b/g],
  ['Gebrauchsklasse Holz', /\b(?:GK|Gebrauchsklasse)\s?[0-5]\b/g],
  ['Feuerwiderstand', /\b(?:REI|EI|R)\s?(?:30|60|90|120|180)\b|\bF\s?(?:30|60|90|120|180)\b/g],
  ['Baustoffklasse/Euroklasse', /\b(?:A1|A2|B1|B2|B3)\b(?![-\/])|\b(?:A2|B|C|D|E)-s[1-3],\s?d[0-2]\b/g],
  ['Wassereinwirkungsklasse', /\bW[0-4](?:\.\d)?-[EIB]\b/g],
  ['Belastungsklasse (RStO)', /\bBk\s?\d+(?:,\d+)?\b/g],
  ['Beanspruchungsklasse (WU)', /\b(?:Beanspruchungsklasse|BK)\s?[12]\b/g],
  ['Bewertungsstufe', /\bBewertungsstufe\s?\d\b/g],
  ['Zementart', /\bCEM\s?(?:III|II|IV|VI|V|I)(?:\s?\/\s?[ABC](?:-[A-Z]{1,2})?)?/g],
  ['Mörtelgruppe/-klasse', /\b(?:MG\s?(?:IIIa|III|IIa|II|I)|M\s?(?:2,5|5|10|15|20))\b/g],
];
const klassenNorm = k => k.replace(/\s+/g, '').replace(/^Nutzungsklasse/, 'NKL').replace(/^Gebrauchsklasse/, 'GK').replace(/^Beanspruchungsklasse/, 'BK');
const BEZUG_STOPP = new Set([...STOPP, 'klasse', 'klassen', 'expositionsklasse', 'expositionsklassen', 'festigkeitsklasse', 'schadensfolgeklasse', 'einstufung', 'eingestuft', 'betons', 'beton', 'zuordnung', 'gilt', 'gelten']);
/** Klassen eines Textes: [{ familie, klasse, pos, bezug: Set(Wortstämme in ±50 Zeichen) }] */
export function klassen(roh) {
  const t = text(roh);
  const aus = [];
  for (const [familie, re] of KLASSEN) {
    const ms = [...t.matchAll(re)];
    ms.forEach((m, i) => {
    // Bezugswörter nur bis zur Nachbarklasse derselben Familie und innerhalb des Satzteils (Aufzählungen nicht vermischen)
    let a = Math.max(0, m.index - 50, i > 0 ? ms[i - 1].index + ms[i - 1][0].length : 0);
    let b = Math.min(t.length, m.index + m[0].length + 50, i < ms.length - 1 ? ms[i + 1].index : t.length);
    const vor = t.slice(a, m.index); const vg = Math.max(...[/[.;!?]\s/g, /\n/g].flatMap(r => [...vor.matchAll(r)].map(x => x.index + x[0].length)), 0); a += vg;
    const nach = t.slice(m.index + m[0].length, b); const ng = nach.search(/[.;!?](?:\s|$)|\n/); if (ng >= 0) b = m.index + m[0].length + ng;
    const umfeld = t.slice(a, b);
    const bezug = new Set([...umfeld.matchAll(/[A-Za-zÄÖÜäöüß]{6,}/g)].map(x => x[0].toLowerCase()).filter(w => !BEZUG_STOPP.has(w)));
    aus.push({ familie, klasse: klassenNorm(m[0]), pos: m.index, bezug });
    });
  }
  return aus;
}

// ------------------------------------------------------------------------------------------------ Fragen und Module

/** Prüfbare Textfelder einer Frage (ohne falsche Optionen) */
export function quizFelder(q) {
  const f = [['Frage', q.question], ['Antwort', (q.options ?? [])[q.correctIdx] ?? ''], ['Erklärung', q.explanation ?? '']];
  (q.distraktorFeedback ?? []).forEach((s, i) => { if (s) f.push([`Rückmeldung ${i + 1}`, s]); });
  const g = q.gapAnalysis ?? {};
  for (const k of ['misconception', 'coreRule', 'actionableAdvice']) if (g[k]) f.push([`Lernhilfe.${k}`, g[k]]);
  if (q.normRef) f.push(['normRef', q.normRef]);
  return f;
}

function jsonTexte(v, aus = []) {
  if (typeof v === 'string') aus.push(v);
  else if (Array.isArray(v)) v.forEach(x => jsonTexte(x, aus));
  else if (v && typeof v === 'object') Object.values(v).forEach(x => jsonTexte(x, aus));
  return aus;
}

/** Modulkorpus: zusammenhängender Text aller Dateien der Modul-Einheit, je Datei getrennt (für Fundstellen) */
function korpus(dateien) {
  return dateien.map(d => {
    const roh = lies(d);
    const t = d.endsWith('.json') ? jsonTexte(JSON.parse(roh)).join(' \n ') : roh;
    return { datei: d, text: text(t) };
  });
}

/** Abgleich-Index aus einem freien Text (für Tests) */
export const indexAusText = t => modulIndex([{ datei: '(Text)', text: text(t) }]);

function modulIndex(k) {
  const werte = new Map(); // key|einheit → [{…, datei}]
  const kl = new Map(); // familie → [{klasse, bezug, datei}]
  const klassenSet = new Set();
  const normen = [];
  const volltext = k.map(x => x.text).join(' \n ');
  for (const { datei, text: t } of k) {
    for (const g of groessenWerte(t)) {
      const s = `${g.key}|${g.einheit}`;
      if (!werte.has(s)) werte.set(s, []);
      werte.get(s).push({ ...g, datei, ausschnitt: t.slice(Math.max(0, g.pos - 60), g.pos + g.roh.length + 20) });
    }
    for (const c of klassen(t)) { klassenSet.add(c.klasse); if (!kl.has(c.familie)) kl.set(c.familie, []); kl.get(c.familie).push({ ...c, datei }); }
    for (const n of normVerweise(t)) normen.push({ ...n, datei });
  }
  return { werte, kl, klassenSet, normen, volltext };
}

const kurz = (s, n = 160) => { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };

/** Eine Frage gegen den Modulindex abgleichen → [{ art, feld, befund, quiz, modul? }] */
export function pruefeFrage(q, idx, { registry, referenzen }) {
  const treffer = [];
  const rechnend = q.bloom === 'Anwenden' && /\d/.test(q.question);
  const eingaben = new Set(groessenWerte(q.question).map(g => `${g.key}|${g.einheit}`));
  for (const [feld, roh] of quizFelder(q)) {
    if (feld === 'normRef') continue;
    // (W)
    for (const g of groessenWerte(roh)) {
      const s = `${g.key}|${g.einheit}`;
      const m = idx.werte.get(s);
      if (!m?.length) continue;
      if (feld !== 'Frage' && eingaben.has(s)) continue; // Eingabegröße der Aufgabe, im Modul anders belegt
      if (m.some(x => deckt(g, x))) continue;
      // Wert steht wörtlich irgendwo im Modul (andere Größe davor) → kein Treffer
      const roh1 = g.roh.replace(/^.*?(\d)/, '$1');
      if (idx.volltext.includes(roh1)) continue;
      treffer.push({ art: 'W', stark: g.art === 'symbol', rechnend, feld, befund: `${g.key} = ${kurz(g.roh, 40)}: im Modul mit dieser Größe nur ${[...new Set(m.map(x => x.roh.replace(/\s+/g, ' ')))].slice(0, 4).join(' | ')}`,
        quiz: kurz(text(roh).slice(Math.max(0, g.pos - 70), g.pos + g.roh.length + 30)), modul: `${m[0].datei}: ${kurz(m[0].ausschnitt)}` });
    }
    // (K)
    for (const c of klassen(roh)) {
      if (!idx.klassenSet.has(c.klasse)) {
        treffer.push({ art: 'K', stark: false, rechnend, feld, befund: `${c.familie} ${c.klasse} im Modultext nicht genannt`, quiz: kurz(text(roh).slice(Math.max(0, c.pos - 70), c.pos + 50)) });
        continue;
      }
      const fam = idx.kl.get(c.familie) ?? [];
      for (const w of c.bezug) {
        const stamm = w.replace(/(?:en|er|es|e|n|s)$/, '');
        if (stamm.length < 5) continue;
        const nah = fam.filter(x => [...x.bezug].some(b => b.includes(stamm)));
        if (nah.length < 2 || nah.some(x => x.klasse === c.klasse)) continue;
        treffer.push({ art: 'K', stark: true, rechnend, feld, befund: `${c.klasse} neben „${w}…“; im Modul steht „${w}…“ nur neben ${[...new Set(nah.map(x => x.klasse))].join(', ')}`,
          quiz: kurz(text(roh).slice(Math.max(0, c.pos - 70), c.pos + 50)), modul: nah[0].datei });
        break;
      }
    }
  }
  // (N)
  for (const [feld, roh] of quizFelder(q)) {
    for (const n of normVerweise(roh)) {
      if (n.ausnahme) continue;
      const k = n.norm + (n.na ? '/NA' : '');
      if (n.ausgabe) {
        const mod = new Set(idx.normen.filter(x => x.norm + (x.na ? '/NA' : '') === k && x.ausgabe && !x.ausnahme).map(x => x.ausgabe));
        const vertraeglich = a => a === n.ausgabe || a.startsWith(n.ausgabe + '-') || n.ausgabe.startsWith(a + '-');
        if (mod.size && ![...mod].some(vertraeglich)) treffer.push({ art: 'N', stark: true, rechnend, feld, befund: `${k}:${n.ausgabe} – Modul nennt ${[...mod].join(', ')}`, quiz: kurz(n.ausschnitt) });
        const soll = registry.get(k);
        if (soll && !vertraeglich(soll)) treffer.push({ art: 'N', stark: !mod.size || ![...mod].some(vertraeglich) ? true : false, rechnend, feld, befund: `${k}:${n.ausgabe} – Registry: ${soll}`, quiz: kurz(n.ausschnitt) });
      }
      if (n.ort) {
        const orte = new Set(idx.normen.filter(x => x.basis === n.basis && x.ort).map(x => x.ort));
        const nr = n.ort.split(' ')[1];
        if (orte.size && !orte.has(n.ort) && !new RegExp(String.raw`(?:Tab(?:elle|\.)|Abschn(?:itt|\.)|Gl(?:eichung|\.)|Anhang|Bild|Abs\.)\s*\(?${nr.replace(/\./g, '\\.')}(?![\d.])`).test(idx.volltext))
          treffer.push({ art: 'N', stark: false, rechnend, feld, befund: `${n.norm} ${n.ort} im Modul nicht genannt (Modul: ${[...orte].slice(0, 5).join(', ')})`, quiz: kurz(n.ausschnitt) });
      }
    }
  }
  // (A) Lernhilfe verweist auf einen Abschnitt, dessen Überschrift im Modul nicht (mehr) vorkommt
  const rat = q.gapAnalysis?.actionableAdvice ?? '';
  for (const m of rat.matchAll(/Abschnitt(?:e)?\s+„([^“]{3,120})“/g)) {
    const roh1 = m[1];
    const kern = s => s.toLowerCase().replace(/[^a-zäöüß0-9]+/g, ' ').trim();
    if (!kern(idx.volltext).includes(kern(text(roh1)))) treffer.push({ art: 'A', stark: true, rechnend, feld: 'Lernhilfe.actionableAdvice', befund: `Abschnitt „${roh1}“ im Modultext nicht gefunden`, quiz: kurz(rat) });
  }
  // (Z)
  for (const [feld, roh] of quizFelder(q)) {
    if (feld === 'normRef' || feld === 'Frage') continue;
    const { treffer: t } = pruefeKennwerte(roh, referenzen);
    for (const x of t) if (!x.ok && !x.fiktiv) treffer.push({ art: 'Z', stark: true, rechnend, feld, befund: `${x.roh} – zentral ${x.ref.werte.join(' / ')} (${x.ref.konstante})`, quiz: kurz(x.ausschnitt) });
  }
  return treffer;
}

export async function analysiere({ nurModul } = {}) {
  const { tsImport } = await import('tsx/esm/api');
  const { quizRoute } = await tsImport(pathToFileURL(path.join(ROOT, 'src/data/quizZuordnung.ts')).href, import.meta.url);
  const referenzen = await ladeReferenzen();
  const registry = registryAusgaben();
  const { einheiten } = modulZuordnung();
  const idZuEinheit = new Map(einheiten.flatMap(e => e.ids.map(id => [id, e])));
  const quiz = JSON.parse(lies('src/data/quiz.json'));
  const cache = new Map();
  const erg = [];
  let ohneModul = 0;
  for (const q of quiz) {
    const route = quizRoute(q.moduleId) ?? q.moduleId;
    if (nurModul && nurModul !== q.moduleId && nurModul !== route) continue;
    const e = idZuEinheit.get(route) ?? idZuEinheit.get(q.moduleId);
    if (!e) { ohneModul++; continue; }
    if (!cache.has(e.name)) cache.set(e.name, modulIndex(korpus(e.dateien)));
    const t = pruefeFrage(q, cache.get(e.name), { registry, referenzen });
    if (t.length) erg.push({ id: q.id, moduleId: q.moduleId, einheit: e.name, verified: q.verified, treffer: t });
  }
  return { fragen: quiz.length, ohneModul, erg };
}

// ------------------------------------------------------------------------------------------------ (D) Änderungen seit <rev>

/** Dateien einer Revision lesen (git cat-file --batch); fehlende Dateien fehlen in der Map */
function gitLesen(rev, dateien) {
  const ein = dateien.map(d => `${rev}:${d}`).join('\n') + '\n';
  const roh = execFileSync('git', ['cat-file', '--batch'], { cwd: ROOT, input: ein, maxBuffer: 1 << 30 });
  const aus = new Map();
  let i = 0;
  for (const d of dateien) {
    const nl = roh.indexOf(10, i);
    const kopf = roh.subarray(i, nl).toString();
    if (/ missing$/.test(kopf)) { i = nl + 1; continue; }
    const n = Number(kopf.split(' ')[2]);
    aus.set(d, roh.subarray(nl + 1, nl + 1 + n).toString('utf8'));
    i = nl + 1 + n + 1;
  }
  return aus;
}
const korpusAus = inhalte => inhalte.map(([d, roh]) => { try { return text(d.endsWith('.json') ? jsonTexte(JSON.parse(roh)).join(' \n ') : roh); } catch { return ''; } }).join(' \n ');

/** Merkmale eines Textes für den Vorher-nachher-Vergleich: Größe|Einheit|Wert, Klasse@Bezug, Norm:Ausgabe, Fachwort */
export function merkmale(t) {
  const m = new Map();
  const add = (k, info) => { if (!m.has(k)) m.set(k, info); };
  for (const g of groessenWerte(t)) for (const w of g.werte) add(`W|${g.key}|${g.einheit}|${w}`, { art: 'Wert', key: `${g.key}|${g.einheit}`, wert: w, roh: g.roh });
  for (const c of klassen(t)) for (const b of c.bezug) add(`K|${b}|${c.klasse}`, { art: 'Klasse', key: `${b}|${c.familie}`, wert: c.klasse, roh: `${c.klasse} bei „${b}…“` });
  for (const n of normVerweise(t)) if (n.ausgabe && !n.ausnahme) add(`N|${n.norm}|${n.ausgabe}`, { art: 'Ausgabe', key: n.norm, wert: n.ausgabe, roh: `${n.norm}:${n.ausgabe}` });
  for (const w of t.matchAll(/(?<![\wäöüÄÖÜß-])[A-ZÄÖÜ][a-zäöüß]{9,}(?![\wäöüß])/g)) add(`F|${w[0].toLowerCase()}`, { art: 'Fachwort', key: w[0].toLowerCase(), wert: w[0], roh: w[0] });
  // Wortfolgen aus vier Wörtern innerhalb eines Satzteils (umformulierte oder gestrichene Aussagen)
  for (const teil of t.toLowerCase().split(/[.,;:!?()„“"\n]|\s[–-]\s/)) {
    const w = teil.match(/[a-zäöüß][a-zäöüß0-9/-]*/g) ?? [];
    for (let i = 0; i + 4 <= w.length; i++) {
      const f = w.slice(i, i + 4);
      if (f.filter(x => x.length >= 5 && !STOPP.has(x)).length < 3) continue;
      const s = f.join(' ');
      add(`T|${s}`, { art: 'Wortfolge', key: s, wert: s, roh: `„${s}“` });
    }
  }
  return m;
}

/**
 * Änderungen seit rev: Merkmale, die im Modulkorpus entfallen sind und in einer Frage des Moduls noch stehen (Modul
 * korrigiert, Quiz nicht), und Merkmale, die aus einer Frage entfernt wurden und im Modul noch stehen (umgekehrt).
 */
export async function aenderungenSeit(rev) {
  const { tsImport } = await import('tsx/esm/api');
  const { quizRoute } = await tsImport(pathToFileURL(path.join(ROOT, 'src/data/quizZuordnung.ts')).href, import.meta.url);
  const { einheiten } = modulZuordnung();
  const idZuEinheit = new Map(einheiten.flatMap(e => e.ids.map(id => [id, e])));
  const quiz = JSON.parse(lies('src/data/quiz.json'));
  const quizAlt = new Map(JSON.parse(gitLesen(rev, ['src/data/quiz.json']).get('src/data/quiz.json') ?? '[]').map(q => [q.id, q]));
  const alt = gitLesen(rev, [...new Set(einheiten.flatMap(e => e.dateien))]);
  const cache = new Map();
  const aus = [];
  for (const q of quiz) {
    const e = idZuEinheit.get(quizRoute(q.moduleId) ?? q.moduleId) ?? idZuEinheit.get(q.moduleId);
    if (!e) continue;
    if (!cache.has(e.name)) {
      const neu = korpusAus(e.dateien.map(d => [d, lies(d)]));
      const mNeu = merkmale(neu), mAlt = merkmale(korpusAus(e.dateien.filter(d => alt.has(d)).map(d => [d, alt.get(d)])));
      const jeKey = new Map();
      for (const [, v] of mNeu) { if (!jeKey.has(v.key)) jeKey.set(v.key, new Set()); jeKey.get(v.key).add(v.wert); }
      cache.set(e.name, { neu, klein: neu.toLowerCase(), mNeu, mAlt, jeKey });
    }
    const { neu, klein, mNeu, mAlt, jeKey } = cache.get(e.name);
    const mQ = merkmale(quizFelder(q).map(([, s]) => text(s)).join(' \n '));
    // (D1) im Modul entfallen, in der Frage noch vorhanden
    for (const [k, v] of mQ) {
      if (!mAlt.has(k) || mNeu.has(k)) continue;
      if (v.art === 'Fachwort' && klein.includes(v.key)) continue;
      if (v.art === 'Wert' && neu.includes(v.roh.replace(/^.*?(\d)/, '$1'))) continue;
      const jetzt = jeKey.get(v.key);
      aus.push({ id: q.id, moduleId: q.moduleId, einheit: e.name, richtung: 'Modul geändert', art: v.art, befund: `${v.roh}: stand am ${rev} im Modul, jetzt nicht mehr${jetzt ? ` (jetzt: ${[...jetzt].slice(0, 4).join(', ')})` : ''}` });
    }
    // (D2) aus der Frage entfernt, im Modul noch vorhanden
    const qa = quizAlt.get(q.id);
    if (qa) {
      const mQa = merkmale(quizFelder(qa).map(([, s]) => text(s)).join(' \n '));
      for (const [k, v] of mQa) {
        if (mQ.has(k) || !mNeu.has(k) || v.art === 'Fachwort' || v.art === 'Wortfolge') continue;
        aus.push({ id: q.id, moduleId: q.moduleId, einheit: e.name, richtung: 'Quiz geändert', art: v.art, befund: `${v.roh}: aus der Frage entfernt, steht im Modul weiter` });
      }
    }
  }
  return aus;
}

// ------------------------------------------------------------------------------------------------ Aufruf

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = process.argv.slice(2);
  const opt = n => { const i = arg.indexOf(n); return i >= 0 ? arg[i + 1] : undefined; };
  const { fragen, ohneModul, erg } = await analysiere({ nurModul: opt('--modul') });
  const alle = erg.flatMap(e => e.treffer.map(t => ({ ...t, id: e.id })));
  const zaehl = (f) => alle.filter(f).length;
  console.log(`Quiz-Text-Abgleich: ${fragen} Fragen (${ohneModul} ohne Modulzuordnung), ${erg.length} Fragen mit Treffern, ${alle.length} Treffer`);
  for (const a of ['W', 'K', 'N', 'Z', 'A']) console.log(`  ${a}: ${zaehl(t => t.art === a)} (davon stark ${zaehl(t => t.art === a && t.stark)}, in Rechenfragen ${zaehl(t => t.art === a && t.rechnend)})`);
  const j = opt('--json');
  if (j) fs.writeFileSync(j, JSON.stringify(erg, null, 1));
  const seit = opt('--seit');
  if (seit) {
    const d = await aenderungenSeit(seit);
    console.log(`Änderungen seit ${seit}: ${d.length} Treffer (Modul geändert ${d.filter(x => x.richtung === 'Modul geändert').length}, Quiz geändert ${d.filter(x => x.richtung === 'Quiz geändert').length})`);
    const jd = opt('--json-seit');
    if (jd) fs.writeFileSync(jd, JSON.stringify(d, null, 1));
  }
}
