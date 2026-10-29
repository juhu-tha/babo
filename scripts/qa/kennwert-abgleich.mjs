#!/usr/bin/env node
/**
 * Kennwert-Abgleich (Prüfskript vor der vollständigen gezielten Durchsicht, Entscheidung 29.10.2026;
 * Vorschlag in docs/pruefung/nachpruefung2-2026-10-29.md, Abschnitt „Empfehlung“, Punkt 2).
 *
 * Aufruf:  node scripts/qa/kennwert-abgleich.mjs            → schreibt docs/pruefung/kennwert-abgleich/*.md
 *          node scripts/qa/kennwert-abgleich.mjs --nur-zahlen → nur Zusammenfassung auf der Konsole, schreibt nichts
 *          node scripts/qa/kennwert-abgleich.mjs --ausgabe <ordner>
 *
 * Drei Prüfungen (alle heuristisch – das Ergebnis ist eine Prüfliste, kein Urteil):
 *  (1) Zahlen mit Einheit in content/**, src/modules/**, src/data/** (und quiz.json) werden über Schlüsselwörter in ihrer
 *      Umgebung einer zentralen Konstante zugeordnet und verglichen (src/data/zementGwp.ts, src/data/gwpLehrwerte.ts,
 *      SCHWINDBEIWERTE in src/calc/holzphysik.ts, CONCRETE in src/utils/ec2Spannbeton.ts, Stahl- und Holzkennwerte in
 *      src/data/kennwerte.ts, Energieausweis-Faktoren in src/calc/energieausweis.ts, Transportfaktoren A4 in src/calc/lca.ts,
 *      Pflanzenkohle-Lehrwerte in src/calc/biokohlebeton.ts). Ein Wert gilt als übereinstimmend, wenn er eine Rundung des
 *      zentralen Werts ist oder relativ höchstens 0,5 % abweicht. GWP- und Transportwerte ohne Zuordnung werden als
 *      Prüfliste ausgegeben.
 *  (2) Fest verdrahtete Faktoren: Zahlliterale in Rechenausdrücken in src/modules/** und src/data/** (außerhalb von
 *      src/calc/ und der zentralen Dateien), ohne Zehnerpotenzen, kleine ganze Zahlen und Darstellungscode (SVG, Layout).
 *  (3) Normverweise (Norm, Teil, NA, Ausgabe, Tabelle/Abschnitt/Gleichung/Anhang/Bild): uneinheitliche Ausgaben je Norm
 *      und Teil, Abweichungen von src/data/centralNormenRegistry.ts, dieselbe Tabelle unter verschiedenen Teilen.
 *
 * Zuordnung zu Modulen: Modul-ID → Komponente (src/routing/ModulInhalt.tsx) → Importkette (src/modules, content,
 * src/data). Dateien, die von mehr als drei Komponenten erreicht werden, stehen im Bericht „_gemeinsam“.
 * Kein CI-Gate; tests/kennwertAbgleich.test.ts prüft nur, dass das Skript läuft und die Erkennung stimmt.
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const rel = p => path.relative(ROOT, p).split(path.sep).join('/');
const lies = p => fs.readFileSync(p, 'utf8');

/** Zentrale Dateien: Quelle der Referenzwerte, werden nicht als Fundstelle gezählt */
export const ZENTRALE_DATEIEN = [
  'src/data/zementGwp.ts', 'src/data/gwpLehrwerte.ts', 'src/data/kennwerte.ts', 'src/data/centralNormenRegistry.ts',
  'src/calc/holzphysik.ts', 'src/utils/ec2Spannbeton.ts', 'src/calc/energieausweis.ts', 'src/calc/lca.ts', 'src/calc/biokohlebeton.ts',
];
/** Dateien in src/data ohne Fachinhalt (Verwaltung, Audit, Register) – nicht durchsucht */
const OHNE_FACHINHALT = /^src\/data\/(audit\/|pruefvermerke\.ts|speicherRegister\.ts|versionData\.ts|stand\.ts|lizenz|paten\.ts|quizModell\.ts|quizLader\.ts|quizPool\.d\.ts|quizZuordnung\.ts|modulCluster\.ts|metaClusters\.ts|bibliography\.ts|kiSchalter\.ts)/;

// ------------------------------------------------------------------------------------------------ Textnormalisierung

/** LaTeX- und HTML-Schreibweisen vereinheitlichen, damit Zahl und Einheit erkannt werden */
export function normalisiere(s) {
  return s
    .replace(/\{,\}/g, ',')
    .replace(/\\[,;: ]|\\!|~/g, ' ')
    .replace(/\\(?:text|mathrm|textrm|mathit|operatorname|mbox)\s*\{([^{}]*)\}/g, '$1')
    .replace(/\\cdot|\\times/g, '·')
    .replace(/\\permil|\\textperthousand/g, '‰')
    .replace(/\\%/g, '%')
    .replace(/\^\{?2\}?/g, '²').replace(/\^\{?3\}?/g, '³')
    .replace(/CO_\{?2\}?|CO<sub>2<\/sub>/g, 'CO₂')
    .replace(/<sub>([^<]{1,12})<\/sub>/g, '_$1')
    .replace(/<sup>2<\/sup>/g, '²').replace(/<sup>3<\/sup>/g, '³')
    .replace(/&nbsp;|&#8239;| | | /g, ' ')
    .replace(/\\varepsilon|\\epsilon/g, 'ε').replace(/\\rho/g, 'ρ').replace(/\\gamma/g, 'γ').replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β');
}

/** Zahl in deutscher oder Code-Schreibweise lesen (0,665 | 0.665 | 33 000 | 33.000 | 1.800) */
export function leseZahl(roh) {
  let s = roh.replace(/[−–]/g, '-').trim();
  if (/^-?\d{1,3}(?: \d{3})+(?:,\d+)?$/.test(s)) s = s.replace(/ /g, '');
  if (/^-?[1-9]\d{0,2}(?:\.\d{3})+(?:,\d+)?$/.test(s)) s = s.replace(/\./g, '');
  s = s.replace(',', '.');
  const v = Number(s);
  return Number.isFinite(v) ? v : NaN;
}

const ZAHL = String.raw`\d{1,3}(?: \d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?`;

/** Einheiten der Kennwertprüfung; die Reihenfolge entscheidet (spezielle zuerst) */
export const EINHEITEN = [
  { klasse: 'gwp', re: String.raw`(?:kg|t)\s*CO₂(?:[-‑ ]?(?:Äq(?:uivalent)?e?\.?|äq\.?|e|eq\.?|-?Äquivalente?))?\.?\s*(?:\/|je|pro)\s*\(?\s*(?:t\s*·?\s*km|tkm|kg|t|m³|m3|(?:m²|m2)(?:\s*(?:_?\{?NRF\}?)?\s*[·*]?\s*a(?![\wäöüß]))?|kWh|Stk\.?|lfm|m)(?![\wäöüß])\)?`,
    bezug: m => (/km/.test(m) ? 'tkm' : /m[²2][^/]*a\)?$/.test(m) ? 'm²a' : (m.match(/(?:\/|je|pro)\s*\(?\s*(kg|t|m³|m3|m²|m2|kWh|Stk\.?|lfm|m)(?![\wäöüß])/) || [])[1]?.replace('m3', 'm³').replace('m2', 'm²') ?? '?'),
    faktor: m => (/^\s*t\s*CO/.test(m) ? 1000 : 1) },
  { klasse: 'gwp', re: String.raw`g\s*CO₂(?:[-‑ ]?(?:Äq\.?|e|eq\.?))?\.?\s*(?:\/|je|pro)\s*\(?\s*(?:t\s*·?\s*km|tkm|kWh)\)?`, bezug: m => (/km/.test(m) ? 'tkm' : 'kWh'), faktor: () => 0.001 },
  { klasse: 'gwp', re: String.raw`(?:g|kg)\s*\/\s*\(?\s*(?:t\s*·?\s*km|tkm)\)?`, bezug: () => 'tkm', faktor: m => (/^\s*g/.test(m) ? 0.001 : 1) },
  { klasse: 'gwp', re: String.raw`g\s*\/\s*kWh`, bezug: () => 'kWh', faktor: () => 0.001 },
  { klasse: 'schwind', re: String.raw`%\s*(?:\/|je|pro)\s*%`, bezug: () => '%/%', faktor: () => 1 },
  { klasse: 'festigkeit', re: String.raw`(?:N\/mm²|N\/mm2|MPa|GPa)`, bezug: m => (/GPa/.test(m) ? 'GPa' : 'N/mm²'), faktor: m => (/GPa/.test(m) ? 1000 : 1) },
  { klasse: 'dehnung', re: '‰', bezug: () => '‰', faktor: () => 1 },
  { klasse: 'energie', re: String.raw`kWh(?:\s*\/\s*\(?\s*m²\s*·?\s*a\)?)?`, bezug: () => 'kWh', faktor: () => 1 },
  { klasse: 'rohdichte', re: String.raw`kg\/m³|kg\/m3`, bezug: () => 'kg/m³', faktor: () => 1 },
];
const EINHEIT_RE = new RegExp(String.raw`(?<![\w.,])([-−–]?(?:${ZAHL}))(?:\s*(?:–|-|bis)\s*([-−–]?(?:${ZAHL})))?\s*(${EINHEITEN.map(e => e.re).join('|')})`, 'g');

/** Alle Zahlen mit Kennwert-Einheit eines Textes: { wert, wert2, klasse, bezug, start, ende, roh } (Werte in Grundeinheit) */
export function zahlenMitEinheit(text) {
  const aus = [];
  for (const m of text.matchAll(EINHEIT_RE)) {
    const einheit = m[3];
    const def = EINHEITEN.find(e => new RegExp('^' + e.re + '$').test(einheit));
    if (!def) continue;
    const f = def.faktor(einheit);
    const w1 = leseZahl(m[1]);
    const w2 = m[2] ? leseZahl(m[2]) : undefined;
    if (!Number.isFinite(w1)) continue;
    aus.push({ wert: Math.abs(w1) * f, wert2: w2 !== undefined && Number.isFinite(w2) ? Math.abs(w2) * f : undefined,
      klasse: def.klasse, bezug: def.bezug(einheit), start: m.index, ende: m.index + m[0].length, roh: m[0].trim() });
  }
  return aus;
}

/** Zahlen ohne Einheit (für Faktoren wie f_p und Code-Schlüssel wie `tangential: 0.36`) */
const ZAHL_FREI_RE = new RegExp(String.raw`(?<![\w.,/])([-−–]?(?:${ZAHL}))(?![\w.,]*\d)(?!\s*(?:${EINHEITEN.map(e => e.re).join('|')}))`, 'g');

/** zwischen Größe und Zahl nur „=“, „≈“, „:“, „von“, „beträgt“ … (keine Bedingung ≤/≥, keine Formel f_ck + 8) */
const NAH_ZWISCHEN = /^[\s}]*(?:\([^()]{0,25}\))?\s*(?:\$\s*)?(?:=|≈|:|von|beträgt|ist|mit|liegt bei|um)?\s*(?:ca\.|rund|etwa|≈|~|mind\.|max\.)?\s*(?:\$\s*)?$/;
const SATZENDE = /(?:[.!?]\s+(?=[A-ZÄÖÜ„"(])|\n|<br\s*\/?>|\\n|;\s)/g;
function umgebung(text, start, ende, vor = 140, nach = 60) {
  let v = text.slice(Math.max(0, start - vor), start);
  let letzte = -1;
  for (const m of v.matchAll(SATZENDE)) letzte = m.index + m[0].length;
  if (letzte >= 0) v = v.slice(letzte);
  let n = text.slice(ende, ende + nach);
  const e = n.search(/(?:[.!?]\s+(?=[A-ZÄÖÜ„"(])|\n|<br\s*\/?>|\\n|;\s)/);
  if (e >= 0) n = n.slice(0, e);
  return { vor: v, nach: n };
}
/** Abstand des nächstgelegenen Treffers eines Musters zur Zahl (vorher bevorzugt; nachher +40) */
function abstand(re, { vor, nach }) {
  let best = Infinity;
  for (const m of vor.matchAll(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))) best = Math.min(best, vor.length - (m.index + m[0].length));
  if (best === Infinity) { const bisZahl = nach.split(/\d/)[0]; const m = bisZahl.match(re); if (m) best = 40 + m.index; }
  return best;
}

// ------------------------------------------------------------------------------------------------ Referenzwerte

const r2 = x => Math.round(x * 100) / 100;
const CEM = {
  'CEM I': /CEM\s?I(?![IV\/\-\w])/, 'CEM II/A': /CEM\s?II\s?\/\s?A/, 'CEM II/B': /CEM\s?II\s?\/\s?B/, 'CEM II/C-M': /CEM\s?II\s?\/\s?C/,
  'CEM III/A': /CEM\s?III\s?\/\s?A/, 'CEM III/B': /CEM\s?III\s?\/\s?B/, 'CEM IV': /CEM\s?IV/, 'CEM V': /CEM\s?V(?!I)/, 'CEM VI': /CEM\s?VI/,
};

/**
 * Referenzen aus den zentralen Dateien laden (über tsx). Jede Referenz:
 * { familie, kennung, bezeichnung, konstante, werte[], klasse, bezug, kontext: RegExp, nah?: RegExp, ohneEinheit?, schluessel? }
 * Innerhalb einer Familie gewinnt die Referenz, deren Kontext der Zahl am nächsten steht.
 */
export async function ladeReferenzen() {
  const { tsImport } = await import('tsx/esm/api');
  const imp = p => tsImport(pathToFileURL(path.join(ROOT, p)).href, import.meta.url);
  const [zement, gwp, kenn, holz, ec2, ea, lca, bk] = await Promise.all(['src/data/zementGwp.ts', 'src/data/gwpLehrwerte.ts', 'src/data/kennwerte.ts',
    'src/calc/holzphysik.ts', 'src/utils/ec2Spannbeton.ts', 'src/calc/energieausweis.ts', 'src/calc/lca.ts', 'src/calc/biokohlebeton.ts'].map(imp));
  const R = [];
  const add = r => R.push({ toleranz: 0.005, ...r });

  // Zement-GWP je kg bzw. t Zement
  for (const [art, w] of Object.entries(zement.ZEMENT_GWP_KG)) {
    const werte = [w, zement.ZEMENT_GWP_BRUTTO_KG[art]].filter(x => x !== undefined);
    add({ familie: 'zement', kennung: art, bezeichnung: `Zement-GWP ${art}`, konstante: `ZEMENT_GWP_KG['${art}']`, werte, klasse: 'gwp', bezug: ['kg', 't'],
      kontext: CEM[art] });
  }
  // Beton, Holz, Betonstahl je m³ bzw. t
  const L = gwp.GWP_LEHRWERTE;
  const beton = (kennung, kontext, werte, konst) => add({ familie: 'gwp-m3', kennung, bezeichnung: `GWP ${kennung}`, konstante: konst, werte, klasse: 'gwp', bezug: ['m³'], kontext });
  add({ familie: 'gwp-m3', kennung: 'Beton CEM I (C25/30, C30/37)', bezeichnung: 'GWP Beton CEM I', konstante: 'GWP_LEHRWERTE.betonC2530CemI / .betonC3037CemI',
    werte: [L.betonC2530CemI.gwp, L.betonC3037CemI.gwp], klasse: 'gwp', bezug: ['m³'], kontext: CEM['CEM I'], auch: /C25\/30|C30\/37|Normalbeton|Lehrbeton|Standardbeton/ });
  beton('Beton CEM II/C-M', CEM['CEM II/C-M'], [L.betonC2530CemIICM.gwp], 'GWP_LEHRWERTE.betonC2530CemIICM');
  beton('Beton CEM III/A', CEM['CEM III/A'], [L.betonCemIIIA.gwp], 'GWP_LEHRWERTE.betonCemIIIA');
  beton('Beton C30/37 CEM III', /CEM\s?III(?!\s?\/)/, [L.betonC3037CemIII.gwp], 'GWP_LEHRWERTE.betonC3037CemIII');
  beton('RC-Beton', /RC-Beton|Recyclingbeton|R-Beton/, [L.betonRcC2530.gwp], 'GWP_LEHRWERTE.betonRcC2530');
  beton('Geopolymerbeton', /Geopolymer/, [L.betonGeopolymer.gwp], 'GWP_LEHRWERTE.betonGeopolymer');
  beton('Brettschichtholz', /Brettschichtholz|\bBSH\b|\bGL\d\d[hc]?\b/, [L.bsh.gwp, L.bsh.biogen, L.bsh.gwp - L.bsh.biogen].map(Math.abs), 'GWP_LEHRWERTE.bsh');
  beton('Konstruktionsvollholz', /Konstruktionsvollholz|\bKVH\b/, [L.kvh.gwp, L.kvh.biogen, L.kvh.gwp - L.kvh.biogen].map(Math.abs), 'GWP_LEHRWERTE.kvh');
  add({ familie: 'gwp-stahl', kennung: 'Betonstahl', bezeichnung: 'GWP Betonstahl B500', konstante: 'GWP_LEHRWERTE.betonstahl', werte: [L.betonstahl.gwp / 1000, 0.642],
    klasse: 'gwp', bezug: ['kg', 't'], kontext: /Betonstahl|Bewehrungsstahl|Bewehrung|B500|Baustahlmatte/ });
  if (L.profilstahl) add({ familie: 'gwp-stahl', kennung: 'Profilstahl', bezeichnung: 'GWP Profilstahl (Baustahl)', konstante: 'GWP_LEHRWERTE.profilstahl',
    werte: [L.profilstahl.gwp / 1000], klasse: 'gwp', bezug: ['kg', 't'], kontext: /Profilstahl|Baustahl|Stahlprofil|Walzprofil|Walzstahl|\bIPE\b|\bHE[ABM]\b|S235|S355|Stahlträger/ });
  // Pflanzenkohle
  add({ familie: 'pk', kennung: 'Pflanzenkohle', bezeichnung: 'CO₂-Senke Pflanzenkohle (netto)', konstante: 'PK_NETTO_SENKE_KG', werte: [r2(bk.PK_NETTO_SENKE_KG)],
    klasse: 'gwp', bezug: ['kg', 't'], kontext: /Pflanzenkohle|Biokohle|Biochar/i });
  add({ familie: 'pk', kennung: 'Pflanzenkohle Herstellung', bezeichnung: 'Herstellung Pflanzenkohle', konstante: 'PK_LEHRWERT.ePK', werte: [bk.PK_LEHRWERT.ePK],
    klasse: 'gwp', bezug: ['kg', 't'], kontext: /Pflanzenkohle|Biokohle|Biochar/i, nah: /Herstellung|Produktion|Pyrolyse/, nahGruppe: 'ePK' });
  // Transport A4 [kg CO₂-Äq./tkm]
  const A4 = lca.A4_FAKTOR_EINZEL;
  const tr = (kennung, kontext, w, k) => add({ familie: 'transport', kennung, bezeichnung: `Transport ${kennung}`, konstante: `A4_FAKTOR_EINZEL['${k}']`, werte: [w], klasse: 'gwp', bezug: ['tkm'], kontext });
  tr('Lkw 40 t (Last- und Sattelzüge)', /Lkw|Sattelzug|Lastzug|Diesel-Lkw/i, A4['lkw-heavy'], 'lkw-heavy');
  tr('Lkw 7,5 t', /7,5\s*t|3,5\s*[–-]\s*7,5|leichte[rn]?\s+Lkw|Kleinlaster/i, A4['lkw-light'], 'lkw-light');
  tr('Bahn', /Bahn|Güterzug|Schiene|\bZug\b/i, A4.zug, 'zug');
  add({ familie: 'qng', kennung: 'QNG-PLUS', bezeichnung: 'QNG-PLUS Wohngebäude', konstante: 'QNG_WG.plus', werte: [lca.QNG_WG.plus], klasse: 'gwp', bezug: ['m²a'], kontext: /QNG[-‑ ]?PLUS|PLUS/i });
  add({ familie: 'qng', kennung: 'QNG-PREMIUM', bezeichnung: 'QNG-PREMIUM Wohngebäude', konstante: 'QNG_WG.premium', werte: [lca.QNG_WG.premium], klasse: 'gwp', bezug: ['m²a'], kontext: /PREMIUM/i });
  // Energieausweis: f_p und CO₂-Faktor je Energieträger
  const TRAEGER = { strom: /strom|Wärmepumpe|\bWP\b/i, gas_brennwert: /Erdgas|Gas/, oel_kessel: /Heizöl|Öl/, pellets: /Holz|Pellet|Biomasse/, fernwaerme: /Fernwärme|Nahwärme/ };
  const fp = {}, co2 = {};
  for (const stand of Object.values(ea.FAKTOREN)) for (const [h, { fp: f, co2: c }] of Object.entries(stand)) {
    const t = h.startsWith('wp') ? 'strom' : h;
    (fp[t] ??= new Set()).add(f); (co2[t] ??= new Set()).add(c / 1000);
  }
  for (const f of Object.values(ea.FP_STROM)) fp.strom.add(f);
  for (const [t, re] of Object.entries(TRAEGER)) {
    add({ familie: 'fp', kennung: t, bezeichnung: `Primärenergiefaktor ${t}`, konstante: `FAKTOREN.*.${t}.fp / FP_STROM`, werte: [...fp[t]], ohneEinheit: true,
      kontext: re, nah: /(?:f_?\{?[pP]\}?\$?|Primärenergiefaktor(?:en)?)(?![\w,])/ });
    add({ familie: 'co2kwh', kennung: t, bezeichnung: `CO₂-Faktor ${t} (GEG/GModG Anlage 9)`, konstante: `FAKTOREN.*.${t}.co2`, werte: [...co2[t]], klasse: 'gwp', bezug: ['kWh'], kontext: re,
      auch: /GEG|GModG|Anlage\s*9|Energieausweis|Emissionsfaktor(?:en)? nach/ });
  }
  // Schwind- und Quellmaße [% je %]
  for (const [art, w] of Object.entries(holz.SCHWINDBEIWERTE)) for (const [richtung, v] of Object.entries(w)) {
    const artRe = { fichte: /Fichte|Tanne|Nadelholz/, kiefer: /Kiefer/, eiche: /Eiche/ }[art];
    const rRe = { radial: /radial/i, tangential: /tangential/i, longitudinal: /längs|longitudinal|axial/i }[richtung];
    add({ familie: 'schwind', kennung: `${art} ${richtung}`, bezeichnung: `Schwindmaß ${art} ${richtung}`, konstante: `SCHWINDBEIWERTE.${art}.${richtung}`, werte: [v],
      klasse: 'schwind', bezug: ['%/%'], kontext: artRe, nah: rRe, schluessel: richtung });
  }
  // EC2 Tab. 3.1
  const PARAM = { fck: /f_?\{?ck\}?(?![\w,]|\s*\(|_?\{?,?\s*cube)/, fck_cube: /f_?\{?ck,?\s*cube\}?/, fcm: /f_?\{?cm\}?(?![\w,(]|\s*\()/, fctm: /f_?\{?ctm\}?(?![\w,])/, Ecm: /E_?\{?cm\}?(?![\w,(])/ };
  for (const [kl, c] of Object.entries(ec2.CONCRETE)) for (const [p, re] of Object.entries(PARAM)) {
    add({ familie: `ec2`, kennung: `${kl} ${p}`, bezeichnung: `${p} ${kl} (EC2 Tab. 3.1)`, konstante: `CONCRETE['${kl}'].${p}`, werte: [c[p]], klasse: 'festigkeit', bezug: ['N/mm²', 'GPa'],
      kontext: new RegExp(String.raw`\b${kl.replace('/', '\\/')}\b`), nah: re, nahGruppe: p, toleranz: p === 'Ecm' ? 0.02 : 0.005 });
  }
  // Baustahl, Betonstahl (Werte für t ≤ 40 mm; dickere Erzeugnisse ausgenommen)
  const DICK = /40\s*mm\s*<\s*t|t\s*>\s*40|über 40 mm|> ?40 mm/;
  for (const [g, { fy, fu }] of Object.entries(kenn.BAUSTAHL_EC3)) {
    add({ familie: 'baustahl', kennung: `${g} fy`, bezeichnung: `f_y ${g} (t ≤ 40 mm)`, konstante: `BAUSTAHL_EC3.${g}.fy`, werte: [fy], klasse: 'festigkeit', bezug: ['N/mm²'], kontext: new RegExp(g), nah: /f_?\{?y\}?(?![\w,])|R_?\{?eH\}?|Streckgrenze/, nahGruppe: 'fy', ausser: DICK });
    add({ familie: 'baustahl', kennung: `${g} fu`, bezeichnung: `f_u ${g} (t ≤ 40 mm)`, konstante: `BAUSTAHL_EC3.${g}.fu`, werte: [fu], klasse: 'festigkeit', bezug: ['N/mm²'], kontext: new RegExp(g), nah: /f_?\{?u\}?(?![\w,])|R_?\{?m\}?(?![\w,])|Zugfestigkeit/, nahGruppe: 'fu', ausser: DICK });
  }
  add({ familie: 'betonstahl', kennung: 'B500 fyk', bezeichnung: 'f_yk B500', konstante: 'BETONSTAHL.B500*.fyk', werte: [500], klasse: 'festigkeit', bezug: ['N/mm²'], kontext: /B500|Betonstahl/, nah: /f_?\{?yk\}?(?![\w,])/, nahGruppe: 'fyk' });
  add({ familie: 'betonstahl', kennung: 'B500 ftk', bezeichnung: 'f_tk B500A/B', konstante: 'BETONSTAHL.B500*.ftk', werte: [kenn.BETONSTAHL.B500A.ftk, kenn.BETONSTAHL.B500B.ftk], klasse: 'festigkeit', bezug: ['N/mm²'], kontext: /B500|Betonstahl/, nah: /f_?\{?tk\}?(?![\w,])/, nahGruppe: 'ftk' });
  add({ familie: 'betonstahl', kennung: 'E_s', bezeichnung: 'E-Modul Betonstahl', konstante: 'E_BETONSTAHL', werte: [kenn.E_BETONSTAHL], klasse: 'festigkeit', bezug: ['N/mm²', 'GPa'], kontext: /B500|Betonstahl|Bewehrungsstahl/, nah: /E_?\{?s\}?(?![\w,])/, nahGruppe: 'Es' });
  // Holz EN 338 / EN 14080
  const HP = { fmk: /f_?\{?m,?\s?k\}?(?![\w])|Biegefestigkeit/, E0mean: /E_?\{?0,?\s?mean\}?|E-Modul|Elastizitätsmodul/, rhok: /ρ_?\{?k\}?(?![\w,])|charakteristische Rohdichte/, rhoMean: /ρ_?\{?mean\}?|mittlere Rohdichte/ };
  for (const tab of [kenn.HOLZ_EN338, kenn.BSH_EN14080]) for (const [kl, w] of Object.entries(tab)) for (const [p, re] of Object.entries(HP)) {
    add({ familie: 'holz', kennung: `${kl} ${p}`, bezeichnung: `${p} ${kl}`, konstante: `${tab === kenn.HOLZ_EN338 ? 'HOLZ_EN338' : 'BSH_EN14080'}.${kl}.${p}`, werte: [w[p]],
      klasse: p.startsWith('rho') ? 'rohdichte' : 'festigkeit', bezug: p.startsWith('rho') ? ['kg/m³'] : ['N/mm²'], kontext: new RegExp(String.raw`\b${kl}\b(?!\/)`), nah: re, nahGruppe: p });
  }
  return R;
}

/** true, wenn der Textwert eine Rundung eines Referenzwerts ist oder relativ höchstens tol abweicht */
export function passt(wert, ref, tol = 0.005, dezimalen = 3) {
  const halb = 0.5 * Math.pow(10, -dezimalen) + 1e-9;
  return Math.abs(wert - ref) <= halb || Math.abs(wert - ref) <= tol * Math.abs(ref);
}
const dezimalenVon = roh => { const m = roh.match(/^[-−–]?\d+(?:[ .]\d{3})*[.,](\d+)/); return m && !/^\d{1,3}(?:[ .]\d{3})+$/.test(roh.split(/\s/)[0]) ? m[1].length : 0; };

/**
 * Kennwerte eines Textabschnitts gegen die Referenzen prüfen.
 * Ergebnis: [{ ref, wert, roh, ok, ausschnitt }] und [{ wert, roh, bezug, ausschnitt }] (GWP ohne Zuordnung)
 */
export function pruefeKennwerte(text, referenzen, { code = false } = {}) {
  const t = normalisiere(text);
  const treffer = [], ohne = [];
  const pruefe = (z, kandidaten) => {
    const u = umgebung(t, z.start, z.ende);
    const familien = new Map();
    for (const r of kandidaten) {
      if (r.nah) {
        const nahText = u.vor.slice(-45);
        const m = [...nahText.matchAll(new RegExp(r.nah.source, 'g'))].pop();
        if (!m) continue;
        const zwischen = nahText.slice(m.index + m[0].length);
        if (!NAH_ZWISCHEN.test(zwischen)) continue;
        r._nahPos = m.index;
      }
      const d = abstand(r.kontext, u);
      if (d === Infinity) continue;
      if (r.auch && !r.auch.test(u.vor + ' ' + u.nach)) continue;
      const key = r.familie;
      const alt = familien.get(key);
      if (r.ausser && r.ausser.test(u.vor + ' ' + u.nach)) continue;
      const rang = r.nah ? [-1 - (r._nahPos ?? 0), d] : [0, d];
      if (!alt || rang[0] < alt.rang[0] || (rang[0] === alt.rang[0] && rang[1] < alt.rang[1])) familien.set(key, { r, rang });
    }
    if (!familien.size) return false;
    // eine Zahl gehört zu höchstens einer Familie: die mit dem nächsten Kontext
    const [{ r }] = [...familien.values()].sort((a, b) => a.rang[0] - b.rang[0] || a.rang[1] - b.rang[1]);
    const dez = dezimalenVon(z.roh) + (z.dezPlus ?? 0);
    const werte = z.wert2 !== undefined ? [z.wert, z.wert2] : [z.wert];
    const imBereich = z.wert2 !== undefined && r.werte.some(v => v >= Math.min(...werte) - 1e-9 && v <= Math.max(...werte) + 1e-9);
    const ok = imBereich || werte.some(w => r.werte.some(v => passt(w, v, r.toleranz, dez)));
    treffer.push({ ref: r, wert: z.wert, wert2: z.wert2, roh: z.roh, ok, fiktiv: /fiktiv|angenommen|Annahme/i.test(t), ausschnitt: ausschnitt(t, z.start, z.ende) });
    return true;
  };
  for (const z of zahlenMitEinheit(t)) {
    const kandidaten = referenzen.filter(r => !r.ohneEinheit && r.klasse === z.klasse && r.bezug.includes(z.bezug));
    // GWP-Werte je t: in kg je kg umrechnen, wenn die Referenz je kg geführt wird
    if (z.klasse === 'gwp' && z.bezug === 't') { z.wert /= 1000; if (z.wert2 !== undefined) z.wert2 /= 1000; z.dezPlus = 3; }
    if (z.bezug === 'GPa') z.dezPlus = -3;
    const gefunden = kandidaten.length ? pruefe(z, kandidaten) : false;
    if (!gefunden && z.klasse === 'gwp' && ['kg', 't', 'm³', 'tkm', 'kWh'].includes(z.bezug)) ohne.push({ wert: z.wert, roh: z.roh, bezug: z.bezug, ausschnitt: ausschnitt(t, z.start, z.ende) });
  }
  // Faktoren ohne Einheit (f_p) und Code-Schlüssel (tangential: 0.36)
  const frei = referenzen.filter(r => r.ohneEinheit || (code && r.schluessel));
  if (frei.length) for (const m of t.matchAll(ZAHL_FREI_RE)) {
    const roh = m[1];
    const z = { wert: Math.abs(leseZahl(roh)), roh, start: m.index, ende: m.index + roh.length, bezug: '-' };
    if (!Number.isFinite(z.wert)) continue;
    const vor = t.slice(Math.max(0, z.start - 40), z.start);
    const kand = frei.filter(r => r.ohneEinheit ? true : new RegExp(String.raw`\b${r.schluessel}\s*:\s*$`).test(vor));
    if (!kand.length) continue;
    if (kand.some(r => r.ohneEinheit) && !/(?:=|:|von|beträgt|liegt bei|ca\.|≈|rund|etwa|f_?\{?[pP]\}?\$?)\s*$/.test(vor)) continue;
    pruefe(z, kand.map(r => (r.ohneEinheit ? r : { ...r, nah: undefined })));
  }
  return { treffer, ohne };
}

function ausschnitt(t, a, b) {
  const s = t.slice(Math.max(0, a - 70), Math.min(t.length, b + 40)).replace(/\s+/g, ' ').trim();
  return (a > 70 ? '…' : '') + s + (b + 40 < t.length ? '…' : '');
}

// ------------------------------------------------------------------------------------------------ (2) feste Faktoren

const TRIVIAL = new Set([0, 1, 2, 3, 4, 0.5, 0.25, 0.1, 0.01, 0.001, 10, 100, 1000, 10000, 100000, 1e6, 1e9, 1e-3, 1e-6, 1e-9, 60, 24, 12, 365, 180, 360, 90, 3600, 1024]);
const DARSTELLUNG = /className|style=|style:|viewBox|<svg|<path|<rect|<line|<circle|<text|<g\b|\b(?:x|y|x1|x2|y1|y2|cx|cy|r|rx|ry|dx|dy|d|points|transform|fill|stroke)=|width|height|Width|Height|padding|margin|offset|Offset|radius|Radius|stroke|font|Font|angle|Angle|rotate|scale\(|Scale|translate|opacity|Opacity|delay|duration|setTimeout|setInterval|animation|anim|px\b|\bleft\b|\btop\b|\bright\b|\bbottom\b|zoom|camera|position|Position|chart|Chart|canvas|ctx\.|pixel|Pixel|grid|Grid|tick|Tick|axis|Axis|layout|Layout|index|Index|\bidx\b|\bi\b\s*[*+]|length|\.slice|\.substr|padStart|toFixed|seed|random|Math\.PI|Math\.sin|Math\.cos|hue|rgb|hsl|color|Color|breite|hoehe|Breite|Hoehe|svg|Svg|SVG|plot|Plot|xScale|yScale|sx\(|sy\(|toX|toY|mapX|mapY|\bX\(|\bY\(|\bpx\(|\bpy\(|\b(?:max|min|suggestedMax|suggestedMin|step|stepSize|steps|samples)\s*:|\b(?:p?[xy]|p[xXyY]\w*|[xy][A-Z]\w*|[xy]\d|[xy]Pos|[xy]Target)\s*=|yTarget|xTarget/;

/**
 * Quelltext auf Code reduzieren: Kommentare und Zeichenketten durch Leerzeichen ersetzen (Zeilen bleiben erhalten),
 * in Template-Literalen bleiben die Ausdrücke ${…} stehen. Liefert { code, kommentare } je Zeile.
 */
export function nurCode(quelltext) {
  const s = quelltext;
  let code = '', kom = '';
  const stapel = []; // offene Template-Literale: Klammertiefe beim Eintritt in ${
  let tiefe = 0, i = 0;
  while (i < s.length) {
    const c = s[i], n = s[i + 1];
    if (c === '/' && n === '/') { const e = s.indexOf('\n', i); const z = e < 0 ? s.length : e; kom += s.slice(i, z); code += ' '.repeat(z - i); i = z; continue; }
    if (c === '/' && n === '*') { const e = s.indexOf('*/', i + 2); const z = e < 0 ? s.length : e + 2; const t = s.slice(i, z); kom += t.replace(/[^\n]/g, ''); code += t.replace(/[^\n]/g, ' '); i = z; continue; }
    if (c === "'" || c === '"') { let j = i + 1; while (j < s.length && s[j] !== c && s[j] !== '\n') j += s[j] === '\\' ? 2 : 1; code += '""' + ' '.repeat(Math.max(0, j - i - 1)); i = j + 1; continue; }
    if (c === '`' || (c === '}' && stapel.length && tiefe === stapel[stapel.length - 1])) {
      if (c === '}') stapel.pop();
      let j = i + 1;
      while (j < s.length && s[j] !== '`' && !(s[j] === '$' && s[j + 1] === '{')) j += s[j] === '\\' ? 2 : 1;
      code += '"' + s.slice(i + 1, j).replace(/[^\n]/g, ' ');
      kom += s.slice(i + 1, j).replace(/[^\n]/g, '');
      if (s[j] === '$') { stapel.push(tiefe); code += '"+('; i = j + 2; continue; }
      code += '"'; i = j + 1; continue;
    }
    if (c === '{') tiefe++;
    if (c === '}') tiefe--;
    code += c; i++;
    if (c === '\n') kom += '\n';
  }
  return { code: code.split('\n'), kommentare: kom.split('\n') };
}

/** Zahlliterale in Rechenausdrücken einer Quelldatei (TS/TSX): [{ zeile, literal, ausschnitt, kommentiert }] */
export function festeFaktoren(quelltext) {
  const aus = [];
  const roh = quelltext.split('\n');
  const { code, kommentare } = nurCode(quelltext);
  code.forEach((zeile, i) => {
    // JSX-Text zwischen Tags und Tags selbst entfernen
    let z = zeile.replace(/>([^<>{}]*)</g, '><');
    if (/^\s*(?:import|export\s+type|type|interface|for\s*\()/.test(z)) return;
    if (!/[*\/]/.test(z) || DARSTELLUNG.test(z)) return;
    z = z.replace(/Math\.round\(\s*([^()]*?)\s*\*\s*10+\s*\)\s*\/\s*10+/g, '$1').replace(/(?:\*|\/)\s*1e[-+]?\d+/g, '').replace(/<\/?[A-Za-z][^>]*\/?>|<\/?>/g, ' ');
    for (const m of z.matchAll(/(?:[*\/]\s*\(?\s*(-?\d+(?:\.\d+)?(?:e[-+]?\d+)?)(?![\w.])|(?<![\w.$#\]])(-?\d+(?:\.\d+)?)(?=\s*\)?\s*[*\/](?![*\/>])))/g)) {
      const lit = m[1] ?? m[2];
      const v = Math.abs(Number(lit));
      if (!Number.isFinite(v) || TRIVIAL.has(v)) continue;
      if (Number.isInteger(v) && v <= 8) continue;
      const k = (kommentare[i] ?? '') + ' ' + ((roh[i - 1] ?? '').trim().startsWith('//') ? roh[i - 1] : '');
      aus.push({ zeile: i + 1, literal: lit, ausschnitt: roh[i].trim().slice(0, 140),
        kommentiert: /Quelle|Lehrwert|vorläufig|nach |DIN|EN |Tab\.|Gl\.|≈|Näherung|Annahme|Faktor|Umrechnung|kWh|kJ|Wh|MJ|kg|N\/mm|MPa|‰|%/i.test(k) });
    }
  });
  return aus;
}

// ------------------------------------------------------------------------------------------------ (3) Normverweise

const NORM_RE = /\b((?:DIN(?:\s+(?:EN|ISO|IEC|CEN\/TS|CEN\/TR|SPEC|TS))*|DIN\/TS|DIN\s+SPEC|E\s+DIN(?:\s+EN)?(?:\s+ISO)?|EN(?:\s+ISO)?|ISO|ÖNORM(?:\s+(?:EN|B))?|VDI|DWA-[AM])\s*(\d{2,5})((?:\s*[-–]\s*\d{1,3})*))(?:\s*(Beiblatt\s*\d+))?(\s*\/\s*NA)?(?:\s*\/\s*A\d+)?(?:\s*:\s*((?:19|20)\d{2})(?:\s*-\s*(\d{2}))?)?/g;
const ORT_RE = /^[\s,;]*(?:\(|,|)?\s*(?:[^\s.;]{0,3}\s*)?(Tab(?:elle|\.)|Abschn(?:itt|\.)|Gl(?:eichung|\.)|Anhang|Bild|Abs\.)\s*\(?\s*((?:NA\.)?[A-Z]?\d+(?:\.\d+)*(?:\s?(?:DE|NA))?|[A-Z]{1,2}(?:\.\d+)*)/;
const AUSNAHME = /Entwurf|2\.\s*Generation|zweite[nr]?\s+Generation|überarbeitete|Änderungsvermerk|erschienen|künftig|Ausblick|\bbis\s+(?:DIN|EN)|Vorgänger|frühere?|bisherige?|alte[nr]?\s|ersetzt|zurückgezogen|historisch|Neuausgabe|neue\s+Ausgabe|Ausgabe\s+\d{4}\s+erschienen|noch nicht|nicht eingeführt|Generation|bis\s+(?:19|20)\d\d|vormals|abgelöst|Stand\s+(?:19|20)\d\d|Fassung/i;

export function normSchluessel(praefix, nr) {
  let p = praefix.replace(/\s+/g, ' ').trim().replace(/^E DIN/, 'DIN');
  p = p.replace(/^DIN (?=EN|ISO)/, '').replace(/^DIN\/TS/, 'DIN TS');
  return `${p} ${nr}`;
}

/** Normverweise eines Textes: [{ basis, teil, norm, na, ausgabe, ort, start, ausnahme }] */
export function normVerweise(text) {
  const t = normalisiere(text);
  const aus = [];
  for (const m of t.matchAll(NORM_RE)) {
    const praefix = m[1].slice(0, m[1].length - m[2].length - m[3].length).trim();
    const teil = m[3].replace(/\s/g, '').replace(/–/g, '-');
    const basis = normSchluessel(praefix, m[2]);
    const ausgabe = m[6] ? (m[7] ? `${m[6]}-${m[7]}` : m[6]) : '';
    const danach = t.slice(m.index + m[0].length, m.index + m[0].length + 40);
    const o = danach.match(ORT_RE);
    const vorher = t.slice(Math.max(0, m.index - 60), m.index);
    const o2 = !o && vorher.match(/(Tab(?:elle|\.)|Abschn(?:itt|\.)|Gl(?:eichung|\.)|Anhang|Bild)\s*\(?((?:NA\.)?[A-Z]?\d+(?:\.\d+)*(?:\s?(?:DE|NA))?|[A-Z](?:\.\d+)*)\)?\s*(?:der|nach|in|aus|gemäß)\s*$/);
    const ortM = o ?? o2;
    const art = ortM ? ({ T: 'Tab.', A: /^Abs\./.test(ortM[1]) ? 'Abs.' : ortM[1].startsWith('Anh') ? 'Anhang' : 'Abschn.', G: 'Gl.', B: 'Bild' }[ortM[1][0]]) : '';
    const umfeld = t.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80);
    aus.push({ basis, teil, norm: basis + teil + (m[4] ? ' ' + m[4].replace(/\s+/g, ' ') : ''), na: !!m[5], ausgabe, ort: ortM ? `${art} ${ortM[2].replace(/\s/g, '')}` : '',
      start: m.index, ausnahme: AUSNAHME.test(umfeld), ausschnitt: ausschnitt(t, m.index, m.index + m[0].length) });
  }
  return aus;
}

/** Registry: Norm (Schlüssel inkl. Teil) → maßgebende Ausgabe (erste Angabe im code-Feld) */
export function registryAusgaben() {
  const reg = lies(path.join(ROOT, 'src/data/centralNormenRegistry.ts'));
  const map = new Map();
  for (const m of reg.matchAll(/code:\s*'([^']+)'/g)) for (const v of normVerweise(m[1])) {
    const k = v.norm + (v.na ? '/NA' : '');
    if (v.ausgabe && !map.has(k)) map.set(k, v.ausgabe);
  }
  return map;
}

// ------------------------------------------------------------------------------------------------ Modulzuordnung

function aufloesen(von, spez) {
  let basis;
  if (spez.startsWith('@/')) basis = path.join(ROOT, spez.slice(2));
  else if (spez.startsWith('.')) basis = path.resolve(path.dirname(von), spez);
  else return null;
  for (const e of ['', '.tsx', '.ts', '.json', '/index.tsx', '/index.ts']) {
    const p = basis + e;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
}
const IMPORT_RE = /(?:import|export)\s[^'"`;]*?from\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|import\s+['"]([^'"]+)['"]/g;
const VERFOLGEN = f => /^(src\/modules\/|content\/|src\/data\/)/.test(f) && !ZENTRALE_DATEIEN.includes(f) && !OHNE_FACHINHALT.test(f) && f !== 'src/data/quiz.json';

function erreichbar(start) {
  const gesehen = new Set();
  const stapel = [start];
  while (stapel.length) {
    const f = stapel.pop();
    const r = rel(f);
    if (gesehen.has(r) || !VERFOLGEN(r)) continue;
    gesehen.add(r);
    if (!/\.tsx?$/.test(f)) continue;
    for (const m of lies(f).matchAll(IMPORT_RE)) {
      const z = aufloesen(f, m[1] ?? m[2] ?? m[3]);
      if (z) stapel.push(z);
    }
  }
  return gesehen;
}

/** Modul-IDs, Komponenten und Dateien: { einheiten: [{ name, ids, dateien }], idInfo: Map(id → { gruppe, status }) } */
export function modulZuordnung() {
  const mi = lies(path.join(ROOT, 'src/routing/ModulInhalt.tsx'));
  const lazy = new Map([...mi.matchAll(/const (\w+) = React\.lazy\(\(\) => import\('([^']+)'\)\)/g)].map(m => [m[1], aufloesen(path.join(ROOT, 'src/routing/ModulInhalt.tsx'), m[2])]));
  const koerper = mi.slice(mi.indexOf('export function ModulInhalt'));
  const komponenteIds = new Map();
  for (const block of koerper.split(/\n\s{4}\{/).slice(1)) {
    const ids = [...block.matchAll(/activeTab(?: as string\))? === '([^']+)'/g)].map(m => m[1]);
    const k = (block.match(/<([A-Z]\w+)/) || [])[1];
    if (!k || !ids.length || !lazy.get(k)) continue;
    const pfad = lazy.get(k);
    if (!komponenteIds.has(pfad)) komponenteIds.set(pfad, new Set());
    ids.forEach(id => komponenteIds.get(pfad).add(id));
  }
  // Registry: Gruppe je ID; Prüfvermerke: Status je ID
  const reg = lies(path.join(ROOT, 'src/registry/modules.ts'));
  const gruppe = new Map([...reg.matchAll(/\{\s*id:\s*'([^']+)'[^\n]*?gruppe:\s*'([^']+)'/g)].map(m => [m[1], m[2]]));
  const pv = lies(path.join(ROOT, 'src/data/pruefvermerke.ts'));
  const status = new Map([...pv.matchAll(/^\s+(\w+):\s*\{\s*status:\s*'(\w[\w-]*)'/gm)].map(m => [m[1], m[2]]));
  const idInfo = new Map();
  const einheiten = [];
  const zaehler = new Map();
  for (const [pfad, idSet] of komponenteIds) {
    const ids = [...idSet].sort();
    ids.forEach(id => idInfo.set(id, { gruppe: gruppe.get(id) ?? '–', status: status.get(id) ?? 'offen' }));
    if (ids.every(id => (gruppe.get(id) ?? 'Allgemein') === 'Allgemein')) continue;
    const dateien = erreichbar(pfad);
    dateien.forEach(d => zaehler.set(d, (zaehler.get(d) ?? 0) + 1));
    einheiten.push({ name: ids[0], ids, komponente: rel(pfad), dateien });
  }
  const gemeinsam = new Set([...zaehler].filter(([, n]) => n > 3).map(([d]) => d));
  for (const e of einheiten) e.dateien = [...e.dateien].filter(d => !gemeinsam.has(d)).sort();
  // nicht erreichte Fachdateien
  const alle = [];
  (function lauf(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) lauf(p); else if (/\.(tsx?|json)$/.test(e.name)) alle.push(rel(p));
    }
  })(path.join(ROOT, 'content'));
  for (const d of ['src/modules', 'src/data']) (function lauf(x) {
    for (const e of fs.readdirSync(x, { withFileTypes: true })) {
      const p = path.join(x, e.name);
      if (e.isDirectory()) lauf(p); else if (/\.(tsx?|json)$/.test(e.name)) alle.push(rel(p));
    }
  })(path.join(ROOT, d));
  const erreicht = new Set([...zaehler.keys()]);
  const rest = alle.filter(f => VERFOLGEN(f) && !erreicht.has(f)).sort();
  einheiten.sort((a, b) => a.name.localeCompare(b.name));
  einheiten.push({ name: '_gemeinsam', ids: [], komponente: '–', dateien: [...gemeinsam, ...rest].sort(), sammel: true });
  return { einheiten, idInfo };
}

// ------------------------------------------------------------------------------------------------ Auswertung

/** Textabschnitte einer Datei: [{ ort, text, code }] */
function abschnitte(datei) {
  const p = path.join(ROOT, datei);
  if (datei.endsWith('.json')) {
    const aus = [];
    const json = JSON.parse(lies(p));
    (function lauf(v, weg) {
      if (typeof v === 'string') aus.push({ ort: `${datei} › ${weg.join('.')}`, text: v, code: false });
      else if (Array.isArray(v)) v.forEach((x, i) => lauf(x, [...weg, i]));
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) lauf(x, [...weg, k]);
    })(json, []);
    return aus;
  }
  return lies(p).split('\n').map((z, i) => ({ ort: `${datei}:${i + 1}`, text: z, code: true }));
}

export async function analysiere() {
  const referenzen = await ladeReferenzen();
  const { einheiten, idInfo } = modulZuordnung();
  const registry = registryAusgaben();
  const quiz = JSON.parse(lies(path.join(ROOT, 'src/data/quiz.json')));
  const idZuEinheit = new Map(einheiten.flatMap(e => e.ids.map(id => [id, e])));
  const quizJe = new Map();
  for (const q of quiz) {
    const e = idZuEinheit.get(q.moduleId) ?? einheiten[einheiten.length - 1];
    // Distraktoren sind absichtlich falsch: nur Frage, richtige Antwort und Erklärung prüfen
    const text = [q.question, (q.options ?? [])[q.correctIdx] ?? '', q.explanation ?? ''].join(' \n ');
    if (!quizJe.has(e.name)) quizJe.set(e.name, []);
    quizJe.get(e.name).push({ ort: `src/data/quiz.json › ${q.id}`, text, code: false });
  }
  const alleNormen = [];
  for (const e of einheiten) {
    e.kennwerte = []; e.ohne = []; e.faktoren = []; e.normen = [];
    const teile = [...e.dateien.flatMap(abschnitte), ...(quizJe.get(e.name) ?? [])];
    for (const a of teile) {
      const { treffer, ohne } = pruefeKennwerte(a.text, referenzen, { code: a.code });
      treffer.forEach(t => e.kennwerte.push({ ...t, ort: a.ort }));
      ohne.forEach(o => e.ohne.push({ ...o, ort: a.ort }));
      for (const n of normVerweise(a.text)) { const v = { ...n, stelle: a.ort, einheit: e.name }; e.normen.push(v); alleNormen.push(v); }
    }
    for (const d of e.dateien.filter(f => /\.tsx?$/.test(f) && !f.startsWith('content/'))) {
      for (const f of festeFaktoren(lies(path.join(ROOT, d)))) e.faktoren.push({ ...f, ort: `${d}:${f.zeile}` });
    }
  }
  // (3) uneinheitliche Ausgaben je Norm (mit Teil, getrennt nach NA), Abweichung von der Registry, Teilzuordnung je Tabelle
  const jeNorm = new Map();
  for (const n of alleNormen) {
    if (!n.ausgabe) continue;
    const k = n.norm + (n.na ? '/NA' : '');
    if (!jeNorm.has(k)) jeNorm.set(k, new Map());
    const m = jeNorm.get(k);
    if (!m.has(n.ausgabe)) m.set(n.ausgabe, []);
    m.get(n.ausgabe).push(n);
  }
  const uneinheitlich = new Map();
  for (const [k, m] of jeNorm) {
    // nur Ausgaben ohne Ausnahmewort zählen (Hinweise auf frühere/neue Ausgaben sind gewollt)
    const regulaer = [...m].filter(([, l]) => l.some(n => !n.ausnahme));
    const jahre = new Set(regulaer.map(([a]) => a));
    // 2023 und 2023-08 nicht als Widerspruch werten
    const verdichtet = new Set([...jahre].filter(a => !(a.length === 4 && [...jahre].some(b => b !== a && b.startsWith(a)))));
    if (verdichtet.size > 1) uneinheitlich.set(k, m);
  }
  const registryAbw = [];
  for (const n of alleNormen) {
    const k = n.norm + (n.na ? '/NA' : '');
    const soll = registry.get(k);
    if (!soll || !n.ausgabe || n.ausnahme) continue;
    if (!(soll === n.ausgabe || soll.startsWith(n.ausgabe + '-') || n.ausgabe.startsWith(soll + '-'))) { n.registry = soll; registryAbw.push(n); }
  }
  const jeTabelle = new Map();
  for (const n of alleNormen) {
    if (!n.ort.startsWith('Tab.') || /DE|NA/.test(n.ort)) continue;
    const k = `${n.basis} ${n.ort}`;
    if (!jeTabelle.has(k)) jeTabelle.set(k, new Map());
    const m = jeTabelle.get(k);
    const tk = n.teil || '(ohne Teil)';
    if (!m.has(tk)) m.set(tk, []);
    m.get(tk).push(n);
  }
  const teilZuordnung = new Map([...jeTabelle].filter(([, m]) => m.size > 1));
  for (const e of einheiten) {
    e.normUneinheitlich = [...new Set(e.normen.filter(n => uneinheitlich.has(n.norm + (n.na ? '/NA' : '')) && n.ausgabe).map(n => n.norm + (n.na ? '/NA' : '')))].sort();
    e.normRegistry = e.normen.filter(n => n.registry);
    e.normTeil = [...new Set(e.normen.filter(n => n.ort.startsWith('Tab.') && teilZuordnung.has(`${n.basis} ${n.ort}`)).map(n => `${n.basis} ${n.ort}`))].sort();
  }
  return { referenzen, einheiten, idInfo, uneinheitlich, registryAbw, teilZuordnung, registry };
}

// ------------------------------------------------------------------------------------------------ Berichte

const fmt = v => (Number.isInteger(v) ? String(v) : String(Math.round(v * 10000) / 10000)).replace('.', ',');
const zelle = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ').replace(/\$/g, '\\$');
const code = s => '`' + String(s).replace(/`/g, "'") + '`';

export function kennzahlen(e) {
  return {
    abweichungen: e.kennwerte.filter(k => !k.ok).length,
    uebereinstimmungen: e.kennwerte.filter(k => k.ok).length,
    ohneZuordnung: e.ohne.length,
    faktoren: e.faktoren.length,
    faktorenOhneKommentar: e.faktoren.filter(f => !f.kommentiert).length,
    normverweise: e.normen.length,
    normHinweise: e.normUneinheitlich.length + e.normRegistry.length + e.normTeil.length,
  };
}

function modulBericht(e, erg) {
  const z = kennzahlen(e);
  const info = e.ids.map(id => erg.idInfo.get(id));
  const L = [];
  L.push(`# Kennwert-Abgleich: ${e.sammel ? 'gemeinsame und nicht zugeordnete Dateien' : code(e.name)}`, '');
  L.push('Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.', '');
  if (!e.sammel) {
    L.push(`- **Modul-IDs:** ${e.ids.map((id, i) => `${code(id)} (${info[i].gruppe}, ${info[i].status})`).join(', ')}`);
    L.push(`- **Komponente:** ${code(e.komponente)}`);
  }
  L.push(`- **Dateien (${e.dateien.length}):** ${e.dateien.map(code).join(', ') || '–'}`, '');
  L.push(`| Kategorie | Anzahl |`, `|---|---|`,
    `| (1) Kennwerte abweichend von zentraler Konstante | ${z.abweichungen} |`,
    `| (1) Kennwerte übereinstimmend | ${z.uebereinstimmungen} |`,
    `| (1) GWP-/Transportwerte ohne zentrale Zuordnung | ${z.ohneZuordnung} |`,
    `| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | ${z.faktoren} (${z.faktorenOhneKommentar}) |`,
    `| (3) Normverweise / Hinweise | ${z.normverweise} / ${z.normHinweise} |`, '');

  L.push('## 1 Kennwerte gegen zentrale Konstanten', '');
  const abw = e.kennwerte.filter(k => !k.ok);
  if (abw.length) {
    L.push('| Fundstelle | Wert im Text | zentral | Konstante | Ausschnitt |', '|---|---|---|---|---|');
    for (const k of abw) L.push(`| ${code(k.ort)} | ${zelle(k.roh)}${k.fiktiv ? ' (Text nennt fiktiv/Annahme)' : ''} | ${k.ref.werte.map(fmt).join(' / ')} | ${code(k.ref.konstante)} | ${zelle(k.ausschnitt)} |`);
  } else L.push('Keine Abweichung erkannt.');
  L.push('');
  const ok = e.kennwerte.filter(k => k.ok);
  if (ok.length) {
    const jeKonst = new Map();
    ok.forEach(k => jeKonst.set(k.ref.konstante, (jeKonst.get(k.ref.konstante) ?? 0) + 1));
    L.push(`Übereinstimmend (${ok.length}): ${[...jeKonst].sort((a, b) => a[0].localeCompare(b[0])).map(([k, n]) => `${code(k)} ×${n}`).join(', ')}`, '');
  }
  if (e.ohne.length) {
    L.push('### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)', '');
    L.push('| Fundstelle | Wert | Ausschnitt |', '|---|---|---|');
    for (const o of e.ohne) L.push(`| ${code(o.ort)} | ${zelle(o.roh)} | ${zelle(o.ausschnitt)} |`);
    L.push('');
  }
  L.push('## 2 Fest verdrahtete Faktoren im Code', '');
  if (e.faktoren.length) {
    L.push('Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.', '');
    L.push('| Fundstelle | Literal | Kommentar | Zeile |', '|---|---|---|---|');
    for (const f of e.faktoren) L.push(`| ${code(f.ort)} | ${code(f.literal)} | ${f.kommentiert ? 'ja' : '–'} | ${code(f.ausschnitt)} |`);
  } else L.push('Keine erkannt.');
  L.push('');
  L.push('## 3 Normverweise', '');
  if (e.normen.length) {
    const g = new Map();
    for (const n of e.normen) {
      const k = `${n.norm}${n.na ? '/NA' : ''}|${n.ausgabe}`;
      if (!g.has(k)) g.set(k, { n, orte: new Set() });
      if (n.ort) g.get(k).orte.add(n.ort);
      g.get(k).anz = (g.get(k).anz ?? 0) + 1;
    }
    L.push('| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |', '|---|---|---|---|---|');
    for (const [k, v] of [...g].sort((a, b) => a[0].localeCompare(b[0], 'de', { numeric: true }))) {
      const nk = v.n.norm + (v.n.na ? '/NA' : '');
      const h = [];
      if (erg.uneinheitlich.has(nk) && v.n.ausgabe) h.push('Ausgaben uneinheitlich');
      const soll = erg.registry.get(nk);
      if (soll && v.n.ausgabe && !(soll === v.n.ausgabe || soll.startsWith(v.n.ausgabe + '-') || v.n.ausgabe.startsWith(soll + '-'))) h.push(`Registry ${soll}`);
      L.push(`| ${zelle(nk)} | ${v.n.ausgabe || '–'} | ${[...v.orte].sort((a, b) => a.localeCompare(b, 'de', { numeric: true })).join(', ') || '–'} | ${v.anz} | ${h.join('; ')} |`);
    }
    L.push('');
    if (e.normUneinheitlich.length) {
      L.push('### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)', '');
      for (const k of e.normUneinheitlich) {
        const m = erg.uneinheitlich.get(k);
        L.push(`- **${zelle(k)}:** ${[...m].sort().map(([a, l]) => `${a} (${l.length}×${l.some(n => n.ausnahme) ? ', teils mit Hinweis auf andere Ausgabe' : ''})`).join(', ')}`);
        for (const n of e.normen.filter(n => n.norm + (n.na ? '/NA' : '') === k && n.ausgabe)) L.push(`  - ${n.ausgabe}${n.ausnahme ? ' (mit Hinweis)' : ''}: ${code(n.stelle)} – ${zelle(n.ausschnitt)}`);
      }
      L.push('');
    }
    if (e.normRegistry.length) {
      L.push('### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)', '');
      for (const n of e.normRegistry) L.push(`- ${zelle(n.norm)}${n.na ? '/NA' : ''}:${n.ausgabe} (Registry ${n.registry}): ${code(n.stelle)} – ${zelle(n.ausschnitt)}`);
      L.push('');
    }
    if (e.normTeil.length) {
      L.push('### Dieselbe Tabelle unter verschiedenen Normteilen (app-weit)', '');
      for (const k of e.normTeil) L.push(`- **${zelle(k)}:** ${[...erg.teilZuordnung.get(k)].map(([t, l]) => `${t} (${l.length}×: ${[...new Set(l.map(n => n.einheit))].join(', ')})`).join('; ')}`);
      L.push('');
    }
  } else L.push('Keine Normverweise erkannt.', '');
  L.push('## Prüfbogen (Ergänzung, Fehlerarten a–c)', '',
    '- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)',
    '- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)',
    '- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben',
    '- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet',
    '- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt', '');
  return L.join('\n');
}

function gesamtBericht(erg) {
  const E = erg.einheiten;
  const summe = k => E.reduce((s, e) => s + kennzahlen(e)[k], 0);
  const L = [];
  L.push('# Kennwert-Abgleich – Übersicht', '');
  L.push('Maschinelle Vorarbeit für die vollständige gezielte Durchsicht (Entscheidung 29.10.2026; Vorschlag in `docs/pruefung/nachpruefung2-2026-10-29.md`). Erzeugt mit:', '',
    '```', 'node scripts/qa/kennwert-abgleich.mjs', '```', '',
    'Das Ergebnis ist eine heuristische Prüfliste (Zuordnung über Schlüsselwörter in der Umgebung einer Zahl) – jede gemeldete Stelle ist ein Prüfauftrag, kein Befund. Methode und Grenzen im Kopf von `scripts/qa/kennwert-abgleich.mjs`; Test `tests/kennwertAbgleich.test.ts`.', '');
  L.push('## Summen', '', '| Kategorie | Anzahl |', '|---|---|',
    `| (1) Kennwerte abweichend von zentraler Konstante | ${summe('abweichungen')} |`,
    `| (1) Kennwerte übereinstimmend | ${summe('uebereinstimmungen')} |`,
    `| (1) GWP-/Transportwerte ohne zentrale Zuordnung | ${summe('ohneZuordnung')} |`,
    `| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | ${summe('faktoren')} (${summe('faktorenOhneKommentar')}) |`,
    `| (3) Normverweise | ${summe('normverweise')} |`,
    `| (3) Normen mit uneinheitlicher Ausgabe (app-weit) | ${erg.uneinheitlich.size} |`,
    `| (3) Verweise abweichend von der Normen-Registry | ${erg.registryAbw.length} |`,
    `| (3) Tabellen unter verschiedenen Normteilen | ${erg.teilZuordnung.size} |`, '');
  L.push('## Zentrale Konstanten im Abgleich', '');
  const konst = [...new Set(erg.referenzen.map(r => r.konstante.replace(/\['[^']+'\]|\.[A-Za-z0-9_]+$/g, '')))];
  L.push(konst.map(code).join(', '), '');
  L.push('## Module', '', '| Bericht | Modul-IDs | Gruppe | Status | (1) abw. | (1) ohne Zuordn. | (2) Faktoren | (3) Hinweise |', '|---|---|---|---|---|---|---|---|');
  for (const e of E) {
    const z = kennzahlen(e);
    const inf = e.ids.map(id => erg.idInfo.get(id));
    L.push(`| [${e.name}](${e.name}.md) | ${e.ids.map(code).join(', ') || '–'} | ${[...new Set(inf.map(i => i.gruppe))].join(', ') || '–'} | ${[...new Set(inf.map(i => i.status))].join(', ') || '–'} | ${z.abweichungen} | ${z.ohneZuordnung} | ${z.faktoren} | ${z.normHinweise} |`);
  }
  L.push('');
  L.push('## Normen mit uneinheitlicher Ausgabe', '', '| Norm | Ausgaben (Anzahl Verweise) | Registry |', '|---|---|---|');
  for (const [k, m] of [...erg.uneinheitlich].sort((a, b) => a[0].localeCompare(b[0], 'de', { numeric: true }))) {
    L.push(`| ${zelle(k)} | ${[...m].sort().map(([a, l]) => `${a} (${l.length}${l.every(n => n.ausnahme) ? ', nur mit Hinweis' : ''})`).join(', ')} | ${erg.registry.get(k) ?? '–'} |`);
  }
  L.push('', '## Dieselbe Tabelle unter verschiedenen Normteilen', '', '| Norm, Tabelle | Teile (Anzahl, Berichte) |', '|---|---|');
  for (const [k, m] of [...erg.teilZuordnung].sort((a, b) => a[0].localeCompare(b[0], 'de', { numeric: true }))) {
    L.push(`| ${zelle(k)} | ${[...m].map(([t, l]) => `${t} (${l.length}: ${[...new Set(l.map(n => n.einheit))].join(', ')})`).join('; ')} |`);
  }
  L.push('');
  return L.join('\n');
}

export function schreibeBerichte(erg, ordner) {
  fs.mkdirSync(ordner, { recursive: true });
  for (const f of fs.readdirSync(ordner)) if (f.endsWith('.md')) fs.unlinkSync(path.join(ordner, f));
  for (const e of erg.einheiten) fs.writeFileSync(path.join(ordner, `${e.name}.md`), modulBericht(e, erg) + '\n');
  fs.writeFileSync(path.join(ordner, 'README.md'), gesamtBericht(erg) + '\n');
}

export function zusammenfassung(erg, top = 15) {
  const E = erg.einheiten.filter(e => !e.sammel);
  const zeilen = [];
  const summe = k => erg.einheiten.reduce((s, e) => s + kennzahlen(e)[k], 0);
  zeilen.push(`Berichte: ${erg.einheiten.length} (Module ${E.length} + _gemeinsam), Referenzwerte: ${erg.referenzen.length}`);
  zeilen.push(`(1) abweichend ${summe('abweichungen')}, übereinstimmend ${summe('uebereinstimmungen')}, GWP ohne Zuordnung ${summe('ohneZuordnung')}`);
  zeilen.push(`(2) feste Faktoren ${summe('faktoren')} (ohne Kommentar ${summe('faktorenOhneKommentar')})`);
  zeilen.push(`(3) Normverweise ${summe('normverweise')}, uneinheitliche Normen ${erg.uneinheitlich.size}, Registry-Abweichungen ${erg.registryAbw.length}, Teilzuordnung ${erg.teilZuordnung.size}`);
  const gewicht = e => { const z = kennzahlen(e); return 3 * z.abweichungen + z.ohneZuordnung + z.faktorenOhneKommentar + 2 * z.normHinweise; };
  zeilen.push('Top-Module (3·abw + ohne Zuordnung + Faktoren ohne Kommentar + 2·Normhinweise):');
  for (const e of [...E].sort((a, b) => gewicht(b) - gewicht(a)).slice(0, top)) {
    const z = kennzahlen(e);
    zeilen.push(`  ${e.name.padEnd(32)} ${String(gewicht(e)).padStart(4)}  abw ${z.abweichungen}, ohne ${z.ohneZuordnung}, fakt ${z.faktoren}/${z.faktorenOhneKommentar}, norm ${z.normHinweise}`);
  }
  return zeilen.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const i = args.indexOf('--ausgabe');
  const ordner = i >= 0 ? path.resolve(args[i + 1]) : path.join(ROOT, 'docs/pruefung/kennwert-abgleich');
  const erg = await analysiere();
  if (!args.includes('--nur-zahlen')) schreibeBerichte(erg, ordner);
  console.log(zusammenfassung(erg));
}
