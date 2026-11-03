// Grenzfallprüfung aller Rechenkerne (02.11.2026, docs/pruefung/rechenkerne-grenzfaelle-2026-11-02.md)
// Anlass: GC-SB-1 (Spannbeton: Zahlenergebnis trotz gueltig = false). Geprüft werden alle exportierten Funktionen in
// src/calc/ und den Rechenkernen in src/utils/ mit gestörten Eingaben: NaN, ±∞, 0, −1, 1e15, 1e−15.
// Regeln:
//   R1  keine Ausnahme, kein Hängen (alle Fälle)
//   R2  Kern (Ergebnis mit gueltig/hinweise): als ungültig markiert → keine endliche Zahl im Ergebnis
//   R3  Kern: nicht endliche Eingabe, die das Ergebnis ändert → als ungültig markiert
//   R4  Kern: gültig markiert → keine ±∞ im Ergebnis (sofern die Basis keine enthält)
//   R5  Formel (Ergebnis ohne Gültigkeit): NaN-Eingabe, die das Ergebnis ändert → mindestens ein NaN im Ergebnis
//   R6  Monotonie, wo physikalisch zwingend; Einheitenwechsel umkehrbar
//   R7  Vollständigkeit: jede exportierte Funktion hat eine Basis (Fixture oder Hand) oder eine begründete Ausnahme
// Die Basiseingaben stehen in tests/fixtures/rechenkerne-basis.json (erzeugt mit scripts/qa/rechenkerne-basis.ts).
import fs from 'node:fs';
import path from 'node:path';
import datei from './fixtures/rechenkerne-basis.json';
import { FIB_KARBONATISIERUNG as K, FIB_CHLORID as C, rInvAusAcc, rInvStreuung, type LebensdauerEingabe } from '../src/calc/lebensdauer';
import hydratationInhalt from '../content/hydratationpruefverfahren/HydratationPruefverfahren.json';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const fehler: string[] = [];
const gilt = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Grenzfälle der Rechenkerne ---');

type Pfad = (string | number)[];
type Eintrag = { args: unknown[]; pfade: Pfad[]; art: 'kern' | 'formel'; ms: number };
const BASIS = (datei as unknown as { basis: Record<string, Record<string, Eintrag>> }).basis;
const STOER = [NaN, Infinity, -Infinity, 0, -1, 1e15, 1e-15];
/** Fehlersuche bei hängenden Fällen: GRENZFALL_VERLAUF=<Datei> schreibt den laufenden Fall mit */
const VERLAUF = process.env.GRENZFALL_VERLAUF;

function zahlen(r: unknown, tiefe = 0, aus: number[] = [], gesehen = new Set<unknown>()): number[] {
  if (typeof r === 'number') aus.push(r);
  else if (r && typeof r === 'object' && tiefe < 6 && !gesehen.has(r) && aus.length < 5000) { gesehen.add(r); for (const v of Object.values(r)) zahlen(v, tiefe + 1, aus, gesehen); }
  return aus;
}
const fehlerIn = (v: unknown) => Array.isArray(v) && v.some(x => x && typeof x === 'object' && (x as { stufe?: string }).stufe === 'fehler');
function ungueltig(r: unknown): boolean {
  if (r === null || r === undefined) return true;
  if (typeof r !== 'object') return false;
  const o = r as Record<string, unknown>;
  if (o.gueltig === false) return true;
  return fehlerIn(r) || Object.values(o).some(fehlerIn);
}
function setze(x: unknown, p: Pfad, v: unknown): unknown {
  if (!p.length) return v;
  const c = (Array.isArray(x) ? [...x] : { ...(x as object) }) as Record<string | number, unknown>;
  c[p[0]] = setze((x as Record<string | number, unknown>)[p[0]], p.slice(1), v);
  return c;
}
function zahlPfade(x: unknown, p: Pfad = [], aus: Pfad[] = [], fest: string[] = []): Pfad[] {
  if (typeof x === 'number') aus.push(p);
  else if (Array.isArray(x)) x.slice(0, 3).forEach((v, i) => zahlPfade(v, [...p, i], aus, fest));
  else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) if (!fest.includes(k)) zahlPfade(v, [...p, k], aus, fest);
  return aus;
}
const gleich = (a: number[], b: number[]) => a.length === b.length && a.every((x, i) => Object.is(x, b[i]));

/** Ausnahmen je Regel: „datei:funktion“ → Begründung (wird im Bericht aufgeführt) */
const OHNE_R3: Record<string, string> = {
  // Kern-Ergebnisse, bei denen eine nicht endliche Eingabe einen Grenzwert ergibt, der fachlich richtig ist
  'src/calc/korrosion.ts:karbonatisierungsFront': 'K = 0 bzw. t = ∞: t_Deckung = ∞ (Deckung wird nie erreicht) ist richtig.',
  // Tabellen- und Datenbankwerte als Eingabe (nicht frei eingebbar)
  'src/calc/expositionsklassen.ts:huellwerte': 'Klassenanforderungen aus der Tabelle der DIN 1045-2 (keine Nutzereingabe).',
  'src/calc/lca.ts:einzelbaustoffA1A4': 'Baustoffdatensatz aus der Datenbank (keine Nutzereingabe).',
  'src/calc/stahlbau.ts:biegewiderstandY': 'Profilwerte aus der Profiltabelle (keine Nutzereingabe).',
  'src/calc/lebensdauerUebergabe.ts:vorgabeAusUebergabe': 'Werte aus leseUebergabe, die nur endliche Zahlen im Gültigkeitsbereich übernimmt.',
};
/** Pfade mit Datenbankwerten, die von R3/R4 ausgenommen sind */
const DATEN_PFADE: Record<string, RegExp> = {
  'src/calc/lca.ts:lcaBilanz': /^0\.zeilen\.\d+\.baustoff\./,
  // optionale Angaben: fehlen sie, entfällt nur eine Zusatzgröße (Rohdichte bzw. Gegenprobe, dann mit Warnhinweis)
  'src/calc/laborversuche.ts:druckpruefung': /^0\.wuerfel\.\d+\.(h|m)$/,
  'src/calc/laborversuche.ts:frischbeton': /^1$/,
};
/** Formeln mit beabsichtigtem Rückfallwert bei NaN */
const OHNE_R5: Record<string, string> = {
  'src/calc/laborVersuch.ts:schoeneAchse': 'Achsenteilung für Diagramme: Rückfall 0 … 1 bei ungültigem Maximum.',
  'src/calc/pruefverfahren.ts:torrentKlasse': 'Klassifizierer mit Zahlenklassen 1 … 5 (F-1).',
  'src/calc/schutzInstandsetzung.ts:schulnoteAusZustandsnote': 'Klassifizierer mit Noten 1 … 6 (F-1).',
  'src/calc/stuetze.ts:muGrenze': 'Interaktionskurve aus interaktionskurve(); Punkte sind keine Eingabe.',
};

const OHNE_R4: Record<string, string> = {
  'src/calc/korrosion.ts:karbonatisierungsFront': 'K = 0: t_Deckung = ∞ (Deckung wird nie erreicht) ist richtig.',
  'src/calc/biegelinie.ts:biegelinie': 'unbelasteter Träger: L/w = ∞ (keine Durchbiegung) ist richtig.',
  'src/calc/stahlbau.ts:biegewiderstandY': 'Profilwerte aus der Profiltabelle (keine Nutzereingabe).',
  'src/calc/stuetze.ts:bemesseStuetze': 'N_Ed = 0: λ_lim = 16/√n = ∞ (keine Schlankheitsgrenze ohne Druck) ist richtig.',
};
const NACHWEIS_FELDER = ['ok', 'erfuellt', 'nachgewiesen', 'isOk', 'eingehalten', 'nachweis'];
const nachweisErfuellt = (r: unknown) => !!r && typeof r === 'object' && NACHWEIS_FELDER.some(k => (r as Record<string, unknown>)[k] === true);
const anzahlHinweise = (r: unknown) => (r && typeof r === 'object' && Array.isArray((r as { hinweise?: unknown }).hinweise) ? (r as { hinweise: unknown[] }).hinweise.length : 0);
const neueHinweise = (r: unknown, rb: unknown) => anzahlHinweise(r) > anzahlHinweise(rb);

type Fall = { datei: string; name: string; fn: (...a: unknown[]) => unknown; args: unknown[]; pfade: Pfad[]; art: 'kern' | 'formel'; werte?: number[] };
function pruefeFall(f: Fall) {
  const id = `${f.datei.replace('src/', '')}:${f.name}`;
  let rb: unknown;
  try { rb = f.fn(...f.args); } catch (e) { gilt(false, `${id}: Basis wirft ${String((e as Error).message)}`); return; }
  if (ungueltig(rb) || !zahlen(rb).some(Number.isFinite)) { gilt(false, `${id}: Basis ist nicht gültig (Fixture neu erzeugen)`); return; }
  const zb = zahlen(rb);
  for (const p of f.pfade) for (const v of f.werte ?? STOER) {
    const fall = `${id} [${p.join('.')} = ${v}]`;
    if (VERLAUF) fs.writeFileSync(VERLAUF, fall);
    let r: unknown;
    try { r = f.fn(...(setze(f.args, p, v) as unknown[])); } catch (e) { gilt(false, `R1 ${fall}: Ausnahme ${String((e as Error).message).slice(0, 80)}`); continue; }
    const z = zahlen(r);
    if (gleich(z, zb)) continue; // Feld ohne Einfluss auf das Ergebnis
    const inv = ungueltig(r);
    const datenPfad = DATEN_PFADE[`${f.datei}:${f.name}`]?.test(p.join('.')) ?? false;
    if (f.art === 'kern' && !datenPfad) {
      if (inv && z.some(Number.isFinite)) gilt(false, `R2 ${fall}: ungültig, aber Zahlenergebnis`);
      if (inv && nachweisErfuellt(r)) gilt(false, `R2 ${fall}: ungültig, aber Nachweis als erfüllt gemeldet`);
      // Listen (Messreihen, Tabellenzeilen): Überspringen mit Warnhinweis ist zulässig
      if (!Number.isFinite(v) && !inv && !OHNE_R3[`${f.datei}:${f.name}`] && !(p.slice(1).some(x => typeof x === 'number') && neueHinweise(r, rb))) gilt(false, `R3 ${fall}: kein Fehlerhinweis`);
      // ±∞ aus 0 oder −1 (Division durch null); Überlauf bei 1e15 zeigt die Anzeige als „–“ und wird nur auf R1/R2 geprüft
      if ((v === 0 || v === -1) && !inv && z.some(x => x === Infinity || x === -Infinity) && zb.every(Number.isFinite) && !OHNE_R4[`${f.datei}:${f.name}`]) gilt(false, `R4 ${fall}: ±∞ ohne Fehlerhinweis`);
    } else if (f.art === 'formel' && Number.isNaN(v) && z.length && z.every(Number.isFinite) && !OHNE_R5[`${f.datei}:${f.name}`]) gilt(false, `R5 ${fall}: NaN als Zahl ausgegeben`);
  }
}

// ---------------------------------------------------------------- 1. Fixture-Basen (automatisch gefunden)
const module: Record<string, Record<string, unknown>> = {};
const KERN_DATEIEN = [
  ...fs.readdirSync(path.join(ROOT, 'src/calc')).filter(f => f.endsWith('.ts')).sort().map(f => `src/calc/${f}`),
  'src/utils/bestandKern.ts', 'src/utils/ec2Spannbeton.ts', 'src/utils/rheologySim.ts', 'src/utils/schadensKern.ts',
];
for (const d of KERN_DATEIEN) module[d] = await import(path.join(ROOT, d)) as Record<string, unknown>;

/** Anzahl- und Auflösungsparameter (Stützstellen, Jahre): eigener Abschnitt 3 mit gezielten Werten */
const AUFLOESUNG: Record<string, number[]> = {
  'src/calc/pruefverfahren.ts:rueckprallKurven': [0, 1, 2], 'src/calc/werkstoffmodelle.ts:walzEigenspannung': [2],
  'src/calc/werkstoffmodelle.ts:schweissEigenspannung': [1, 2], 'src/calc/biegelinie.ts:biegelinie': [1],
  'src/utils/schadensKern.ts:din1076Plan': [0, 1], 'src/calc/spannungszustand.ts:kreisPunkte': [1],
  'src/calc/korrosion.ts:karbonatisierungsKurve': [1], 'src/calc/bauchemie.ts:akrKurve': [2], 'src/calc/korrosion.ts:schnellUmrechnung': [3],
};
const gesehen = new Set<string>();
let anzahlFaelle = 0;
for (const [d, fns] of Object.entries(BASIS)) for (const [name, e] of Object.entries(fns)) {
  const fn = module[d]?.[name];
  gilt(typeof fn === 'function', `Fixture: ${d}:${name} ist nicht mehr exportiert (Fixture neu erzeugen)`);
  if (typeof fn !== 'function') continue;
  gesehen.add(`${d}:${name}`);
  const pfade = e.pfade.filter(p => !(AUFLOESUNG[`${d}:${name}`] ?? []).includes(p[0] as number) || p.length > 1);
  // langsame Kerne (Monte-Carlo) nur mit NaN, 0 und −1
  pruefeFall({ datei: d, name, fn: fn as Fall['fn'], args: e.args, pfade, art: e.art, werte: e.ms > 2 ? [NaN, 0, -1] : undefined });
  anzahlFaelle += pfade.length;
}

// ---------------------------------------------------------------- 2. Handbasen (Kerne, für die keine Basis automatisch gefunden wird)
const lebensdauerBasis = (): LebensdauerEingabe => {
  const rx = rInvAusAcc(5);
  return {
    mechanismus: 'karbonatisierung', nutzungsdauer: 50, betaZiel: 1.3, laeufe: 1000, startwert: 1,
    karbonatisierung: { deckung: { typ: 'normal', m: 35, s: 8 }, rh: { typ: 'beta', m: 65, s: 10, a: 40, b: 100 }, tc: 7, bc: K.bc, kt: K.kt, rInv: { typ: 'normal', m: rx, s: rInvStreuung(rx) }, epsT: K.epsT, cS: K.cSatm, pSR: 0, tow: 0, bw: K.bw },
    chlorid: { deckung: { typ: 'normal', m: 55, s: 8 }, cCrit: C.cCrit, c0: 0.1, cS: { typ: 'lognormal', m: 3.0, s: 1.5 }, dx: C.dxSpritz, dRcm: { typ: 'normal', m: 1.9, s: 0.38 }, a: C.alterung.huettensand, be: C.be, tReal: { typ: 'normal', m: 10, s: 5 }, kt: 1 },
  } as LebensdauerEingabe;
};
const HAND: { datei: string; name: string; args: unknown[]; fest?: string[]; werte?: number[]; art?: 'kern' | 'formel' }[] = [
  { datei: 'src/calc/biegung.ts', name: 'bemesseBiegung', args: [{ b: 30, h: 50, d1: 5, d2: 5, med: 200, fck: 30, bewehrung: 'Stahl', fyk: 500, ftk: 3000, gammaFRP: 1.3 }] },
  { datei: 'src/calc/biokohlebeton.ts', name: 'biokohleBilanz', args: [{ mPK: 10, cGehalt: 80, fPerm: 0.8, ePK: 0.3, zRef: 320, deltaZ: 10, gwpZ: 0.8, w: 160, wAufnahme: 100 }] },
  { datei: 'src/calc/carbonbeton.ts', name: 'carbonbetonBiegung', args: [{ h: 40, c: 10, aTex: 100, fTk: 2500, eTexGPa: 200, fCk: 50 }] },
  { datei: 'src/calc/glaser.ts', name: 'glaser', args: [[{ name: 'Spanplatte innen', d: 0.019, lambda: 0.13, mu: 50 }, { name: 'Mineralwolle', d: 0.16, lambda: 0.04, mu: 1 }, { name: 'Spanplatte außen', d: 0.019, lambda: 0.13, mu: 100 }]] },
  { datei: 'src/calc/holzbau.ts', name: 'bemesseEinfeldbalken', args: [{ l: 4.5, abstand: 0.625, gk: 1.0, qk: 1.5, b: 100, h: 200, fmk: 24, fvk: 4.0, E0mean: 11000, rhoMean: 420, brettschichtholz: false, nkl: 1, kled: 'mtl', gammaM: 1.3 }], fest: ['nkl'] },
  { datei: 'src/calc/holzbau.ts', name: 'verformterDruckstab', args: [{ b: 100, h: 140, l: 4000, nd: 10, qd: 2.0, e0: 10, fmk: 24, fc0k: 21, E0mean: 11000, E005: 7400, kmod: 0.9, gammaM: 1.3 }] },
  { datei: 'src/calc/holzbau.ts', name: 'holzschraube', args: [{ rhok: 350, d: 8, lef: 80, alpha: 90, n: 4, nkl: 1, kled: 'mtl' }], fest: ['nkl'] },
  { datei: 'src/calc/keramik.ts', name: 'keramikKennwerte', args: [{ mt: 200, mn: 210, ma: 118, rhoRein: 2.65, formgebung: 'B' }] },
  { datei: 'src/calc/lebensdauer.ts', name: 'lebensdauerbemessung', args: [lebensdauerBasis()], werte: [NaN, 0, -1] },
  { datei: 'src/calc/ecKennwerte.ts', name: 'ecKennwerte', args: [{ baustoff: 'mauerwerk', klasse: 'frei', situation: 'staendig', fk: 5, zeta: 0.85 }] },
  { datei: 'src/calc/mauerwerk.ts', name: 'bemesseWandVereinfacht', args: [{ lage: 'innen', h: 2.5, t: 240, a: 160, lf: 5, fk: 5, nEd: 200 }] },
  { datei: 'src/calc/packungsdichte.ts', name: 'sieblinienOptimierung', args: [{ zement: 12, zusatz: 5, sand: 33, kies1: 20, q: 0.3, kornform: 'rund', vFest: 750 }] },
  { datei: 'src/calc/querkraft.ts', name: 'bemesseQuerkraft', args: [{ b: 30, h: 50, d1: 5, fck: 30, bewehrung: 'Stahl', fyk: 500, ftk: 3000, gammaFRP: 1.3, asl: 6, vEd: 250, theta: 40 }] },
  { datei: 'src/calc/rissbreite.ts', name: 'bemesseRiss', args: [{ h: 200, b: 1000, cNom: 35, phi: 16, abstand: 20, sigmaS: 250, fctEff: 2.9, ecm: 33000, beanspruchung: 'biegung', zwangNach28d: false, kt: 0.4, wkReq: 0.3 }] },
  { datei: 'src/calc/schnellkarbonatisierung.ts', name: 'schnellkarbonatisierung', args: [{ punkte: [{ tTage: 0, xMm: 0.5 }, { tTage: 7, xMm: 2.6 }, { tTage: 28, xMm: 5.1 }, { tTage: 70, xMm: 8.0 }], mitAchsenabschnitt: true, cAcc: 3, cNat: 0.04, deckung: 25, nutzungsdauer: 50 }] },
  { datei: 'src/calc/stahlbau.ts', name: 'bemesseDruckstab', args: [{ profil: 'HEB 200', guete: 'S235', LcrY: 4, LcrZ: 4, nEd: 800 }] },
  { datei: 'src/calc/stuetze.ts', name: 'bemesseStuetze', args: [{ b: 30, h: 30, d1: 4, l0: 3, nEd: 1000, mEd: 50, fck: 30, fyk: 500 }] },
  { datei: 'src/calc/verankerung.ts', name: 'bemesseVerankerung', args: [{ fck: 30, fyk: 500, phi: 16, verbund: 'gut', beanspruchung: 'zug', art: 'verankerung', form: 'gerade', alpha2: 1, alpha3: 1, alpha5: 1, asErf: 10, asVorh: 12 }] },
  { datei: 'src/calc/verkehrswegebau.ts', name: 'asphaltHohlraum', args: [{ gesteinAnteil: 94.5, bitumenAnteil: 5.5, rhoGestein: 2.68, rhoBitumen: 1.02, raumdichteMischung: 2.41 }] },
  { datei: 'src/calc/verkehrswegebau.ts', name: 'betondeckenFugen', args: [4.0, 22] },
  { datei: 'src/calc/verkehrswegebau.ts', name: 'spritzbetonRing', args: [4.5, 0.15, 15, 25] },
  { datei: 'src/calc/altholz.ts', name: 'sortierbilanz', args: [{ masse: { AI: 15, AII: 45, AIII: 15, AIV: 25 }, ausbringen: { AI: 0.95, AII: 0.9, AIII: 0.85, AIV: 0.95 } }] },
  { datei: 'src/calc/einheiten.ts', name: 'umrechnung', args: [20, 'Länge', 'm', 'mm'] },
  { datei: 'src/calc/laborversuche.ts', name: 'frischbeton', args: [[{ d1: 450, d2: 470, mLeer: 3.215, mVoll: 22.045, vol: 8, a1: 2.1, g: 0.2 }], 2400] },
  { datei: 'src/calc/laborversuche.ts', name: 'moertelprismen', args: [[{ Ff: 2.9, Fc1: 79.2, Fc2: 81 }, { Ff: 3.1, Fc1: 80.1, Fc2: 78.5 }, { Ff: 3.0, Fc1: 82.3, Fc2: 79.6 }], 28] },
  { datei: 'src/calc/laborversuche.ts', name: 'druckMittel196', args: [[49.5, 50.6, 50.1, 40.6, 51.4, 49.8]] },
  { datei: 'src/utils/schadensKern.ts', name: 'fckIs13791', args: [[28, 30, 31, 27, 29, 33, 26, 30]], art: 'formel' },
  // Ergänzung 02.11.2026 (Historische Kennwerte): Bohrkernserie nach DIN EN 13791 – Basis Lehrbeispiel 1 (10 Kerne, h/d = 2)
  { datei: 'src/calc/bohrkernserie13791.ts', name: 'bohrkernserie13791', args: [{ werte: [16.4, 18.9, 20.3, 17.6, 21.8, 19.4, 15.9, 18.2, 20.9, 17.1], ansatz: 'kerne', bezug: 'zylinder', durchmesserMm: 100, groesstkornMm: 32, volumenM3: 120, mindestStreuung: true }] },
  { datei: 'src/calc/lcc.ts', name: 'epsWdvsGwp', args: [0.16, 150, 16], art: 'formel' },
];
for (const h of HAND) {
  const fn = module[h.datei]?.[h.name];
  gilt(typeof fn === 'function', `Handbasis: ${h.datei}:${h.name} fehlt`);
  if (typeof fn !== 'function') continue;
  gesehen.add(`${h.datei}:${h.name}`);
  const pfade = zahlPfade(h.args, [], [], h.fest ?? []);
  pruefeFall({ datei: h.datei, name: h.name, fn: fn as Fall['fn'], args: h.args, pfade, art: h.art ?? 'kern', werte: h.werte });
  anzahlFaelle += pfade.length;
}

// ---------------------------------------------------------------- 3. Anzahl- und Auflösungsparameter (vorher Endlosschleife/Ausnahme)
{
  const m = (d: string) => module[`src/${d}`] as Record<string, (...a: unknown[]) => unknown>;
  const leerOderUngueltig = (r: unknown) => Array.isArray(r) ? r.length === 0 : ungueltig(r) && !zahlen(r).some(Number.isFinite);
  for (const v of [Infinity, 1e15, -1, NaN]) {
    const t = (fall: string, f: () => unknown, pruef: (r: unknown) => boolean) => {
      try { gilt(pruef(f()), `Auflösung ${fall} = ${v}: nicht abgewiesen`); } catch (e) { gilt(false, `Auflösung ${fall} = ${v}: Ausnahme ${String((e as Error).message)}`); }
    };
    t('rueckprallKurven schritt', () => m('calc/pruefverfahren.ts').rueckprallKurven(20, 60, v <= 0 || Number.isNaN(v) ? v : 0), r => (r as { labels: number[] }).labels.length === 0);
    t('rueckprallKurven bis', () => m('calc/pruefverfahren.ts').rueckprallKurven(20, v, 2), r => (r as { labels: number[] }).labels.length <= 1e4);
    t('walzEigenspannung punkte', () => m('calc/werkstoffmodelle.ts').walzEigenspannung(355, 'h', v), r => (r as { verlauf: unknown[] }).verlauf.length === 0);
    t('schweissEigenspannung punkte', () => m('calc/werkstoffmodelle.ts').schweissEigenspannung({ fy: 355, streckenenergie: 1500, blechdicke: 10 }, v), leerOderUngueltig);
    t('stahlKennlinienPunkte A', () => m('calc/werkstoffmodelle.ts').stahlKennlinienPunkte({ id: 'B500B', E: 200000, fy: 500, fu: 540, A: v, sh_strain: 2, fu_strain: 8, frac_stress: 500, yieldType: 'ausgeprägt' }), r => (r as unknown[]).length === 0);
    t('bilinearKurve epsMax', () => m('calc/werkstoffmodelle.ts').bilinearKurve({ fy: 355, E: 210000, Et: 1000, epsMaxPromille: v }), r => (r as unknown[]).length <= 1e4);
    t('biegelinie n', () => m('calc/biegelinie.ts').biegelinie({ lagerung: 'einfeldtraeger', L: 5, F: 10, a: 2.5, q: 5, E: 210000, I: 8000 }, v), r => v === -1 || leerOderUngueltig(r));
    t('eigenspannungsVerlauf punkte', () => m('calc/eigenspannungen.ts').eigenspannungsVerlauf({ tInnen: 20, tMitte: 40, tAussen: 20, eModul: 30000, dicke: 1, epsCsPromille: 0.3, punkte: v }), leerOderUngueltig);
    t('din1076Plan years', () => m('utils/schadensKern.ts').din1076Plan(2026, v), r => (r as unknown[]).length === 0);
    t('kreisPunkte n', () => m('calc/spannungszustand.ts').kreisPunkte({ sx: 100, sy: 20, txy: 30 }, v), r => (r as unknown[]).length === 0);
    t('karbonatisierungsKurve tMax', () => m('calc/korrosion.ts').karbonatisierungsKurve(4, v), r => (r as unknown[]).length === 0);
    t('akrKurve jahre', () => m('calc/bauchemie.ts').akrKurve(0.6, 80, v), leerOderUngueltig);
    t('schnellUmrechnung tageMax', () => m('calc/korrosion.ts').schnellUmrechnung(4, 3, 0.04, v), leerOderUngueltig);
    t('lccVergleich N', () => {
      const o = { capex: 1000, opex0: 10, maintenanceCost: 5, maintenanceInterval: 5, replacementCost: 800, lifespan: 30, eolCost: 50, embodiedCO2: 100, operatingCO2: 10 };
      return m('calc/lcc.ts').lccVergleich(o, o, { r: 0.015, e: 0.02, i: 0.02, N: v, co2Bepreisung: false, co2Preis: 0, co2Steigerung: 0, foerderungB: 0 });
    }, leerOderUngueltig);
  }
}

// ---------------------------------------------------------------- 4. Regressionen der behobenen Einzelfälle (vorher → nachher)
{
  const bu = module['src/calc/bauwerksuntersuchung.ts'] as Record<string, (...a: unknown[]) => Record<string, unknown>>;
  const h0 = bu.haftzug(2.5, 'beton', 0);
  gilt(h0.gueltig === false && Number.isNaN(h0.fct as number) && h0.ok === false, 'haftzug Stempel 0 mm: vorher f_ct = ∞ und „ok“, jetzt ungültig');
  const ok = bu.haftzug(2.5, 'beton');
  gilt(ok.gueltig === true && Math.abs((ok.fct as number) - 2500 / (Math.PI * 625)) < 1e-12, 'haftzug Standard unverändert');
  const ch = bu.chlorid(-1, false);
  gilt(ch.gueltig === false && Number.isNaN(ch.verhaeltnis as number) && Number.isNaN(ch.grenze as number), 'chlorid −1: vorher Verhältnis −2, jetzt kein Zahlenergebnis');
  const vw = module['src/calc/verkehrswegebau.ts'] as Record<string, (...a: unknown[]) => Record<string, unknown>>;
  const w0 = vw.westergaardRand({ dickeCm: 26, achslastKn: 115, bettungMNm3: 100, E: 0 });
  gilt(w0.gueltig === false && w0.ok === false || (w0.gueltig === false && Number.isNaN(w0.sigmaE as number)), 'westergaardRand E = 0: vorher σ = −∞ und „ok“, jetzt ungültig');
  const hb = module['src/calc/holzbau.ts'] as Record<string, (...a: unknown[]) => Record<string, unknown>>;
  for (const nkl of [0, 4, NaN]) {
    let r: Record<string, unknown> | undefined;
    try { r = hb.festigkeitswerte({ fm: 24, ft0: 14, ft90: 0.4, fc0: 21, fc90: 2.5, fv: 4, gammaM: 1.3, kc90: 1, winkel: 0, nkl, kled: 'mtl' }); } catch { r = undefined; }
    gilt(!!r && ungueltig(r) && !zahlen(r).some(Number.isFinite), `holzbau festigkeitswerte nkl = ${nkl}: vorher Ausnahme, jetzt ungültig ohne Zahl`);
  }
  const es = module['src/calc/eigenspannungen.ts'] as Record<string, (...a: unknown[]) => Record<string, unknown>>;
  const e1 = es.eigenspannungsVerlauf({ tInnen: 20, tMitte: 40, tAussen: 20, eModul: 30000, dicke: 1, epsCsPromille: 0.3, punkte: 1 });
  gilt(e1.gueltig === false && (e1.punkte as unknown[]).length === 0, 'eigenspannungsVerlauf punkte = 1: vorher Verlauf trotz Fehler, jetzt leer');
  const lv = module['src/calc/laborversuche.ts'] as Record<string, (...a: unknown[]) => Record<string, unknown>>;
  const dp = lv.druckpruefung({ wuerfel: [{ a: 150, b: 150, F: 1000, h: NaN, m: NaN }, { a: 150, b: NaN, F: 1100, h: NaN, m: NaN }], trocken: false, zielklasse: 'C30/37' });
  gilt((dp.hinweise as { text: string }[]).some(x => x.text.includes('unvollständig')), 'druckpruefung: unvollständige Zeile vorher still übergangen, jetzt Warnung');
  const ms = module['src/calc/mauerwerk.ts'] as Record<string, (...a: unknown[]) => Record<string, unknown>>;
  gilt(Number.isNaN(ms.fvk0NA('NM', NaN).fvk0 as number), 'fvk0NA NM mit f_m = NaN: vorher NM IIIa, jetzt kein Wert');
  const sk = module['src/utils/schadensKern.ts'] as Record<string, (...a: unknown[]) => unknown>;
  gilt(sk.riebwClass(NaN) === 'ungültig', 'riebwClass NaN: vorher „ungenügender Bauwerkszustand“, jetzt „ungültig“');
}

// ---------------------------------------------------------------- 5. Monotonie und Einheitenwechsel (R6)
{
  const steigt = (fall: string, werte: number[]) => gilt(werte.every((w, i) => i === 0 || w > werte[i - 1]), `R6 ${fall} nicht streng steigend: ${werte.map(w => w.toPrecision(4)).join(' ')}`);
  const faellt = (fall: string, werte: number[]) => gilt(werte.every((w, i) => i === 0 || w < werte[i - 1]), `R6 ${fall} nicht streng fallend: ${werte.map(w => w.toPrecision(4)).join(' ')}`);
  const m = (d: string) => module[`src/${d}`] as Record<string, (...a: never[]) => Record<string, unknown>>;
  const num = (r: Record<string, unknown>, k: string) => r[k] as number;
  // Biegelinie: größere Spannweite → größere Durchbiegung; größeres I → kleinere
  const bl = (L: number, I = 8000) => num(m('calc/biegelinie.ts').biegelinie({ lagerung: 'einfeldtraeger', L, F: 0, a: 0, q: 5, E: 210000, I } as never), 'wMax');
  steigt('Biegelinie w_max(L)', [2, 4, 6, 8].map(L => bl(L)));
  faellt('Biegelinie w_max(I)', [4000, 8000, 16000].map(I => bl(6, I)));
  // Biegebemessung: größeres Moment → mehr Bewehrung
  const bb = (med: number) => m('calc/biegung.ts').bemesseBiegung({ b: 30, h: 50, d1: 5, d2: 5, med, fck: 30, bewehrung: 'Stahl', fyk: 500, ftk: 3000, gammaFRP: 1.3 } as never);
  steigt('Biegung A_s1(M_Ed)', [50, 100, 200, 300].map(med => num(bb(med), 'as1_req')));
  // Querkraft: größeres V_Ed → mehr Bügelbewehrung
  const qk = (vEd: number) => m('calc/querkraft.ts').bemesseQuerkraft({ b: 30, h: 50, d1: 5, fck: 30, bewehrung: 'Stahl', fyk: 500, ftk: 3000, gammaFRP: 1.3, asl: 6, vEd, theta: 40 } as never);
  steigt('Querkraft a_sw(V_Ed)', [150, 250, 350].map(v => num(qk(v), 'asw_req')));
  // Rissbreite: größere Stahlspannung → größere Rissbreite
  const rb = (sigmaS: number) => m('calc/rissbreite.ts').bemesseRiss({ h: 200, b: 1000, cNom: 35, phi: 16, abstand: 20, sigmaS, fctEff: 2.9, ecm: 33000, beanspruchung: 'biegung', zwangNach28d: false, kt: 0.4, wkReq: 0.3 } as never);
  steigt('Rissbreite w_k(σ_s)', [200, 250, 300].map(s => num(rb(s), 'wkCalc')));
  // Stahlbau: größere Knicklänge → kleinerer Knickwiderstand
  const sd = (L: number) => m('calc/stahlbau.ts').bemesseDruckstab({ profil: 'HEB 200', guete: 'S235', LcrY: L, LcrZ: L, nEd: 800 } as never);
  faellt('Stahlbau N_b,Rd(L_cr)', [2, 4, 6, 8].map(L => num(sd(L), 'NbRd')));
  // Holzbau: längerer Druckstab → kleinerer Widerstand
  const hd = (laenge: number) => m('calc/holzbau.ts').bemesseDruckstab({ b: 120, h: 160, laenge, eulerFall: 2, nEd: 50, fc0k: 21, E005: 7400, brettschichtholz: false, nkl: 1, kled: 'mtl' } as never);
  faellt('Holzbau F_c,Rd(l)', [2, 3, 4, 5].map(l => num(hd(l), 'F_c_R_d_kN')));
  // Wärmeschutz: dickere Dämmung → kleinerer U-Wert
  const ws = m('calc/waermeschutz.ts') as Record<string, (...a: never[]) => unknown>;
  const u = (d: number) => num(ws.uWert([{ name: 'Dämmung', d, lambda: 0.035 }, { name: 'Mauerwerk', d: 0.24, lambda: 0.5 }] as never, 0.13 as never, 0.04 as never) as Record<string, unknown>, 'U');
  faellt('Wärmeschutz U(d_Dämmung)', [0.04, 0.08, 0.12, 0.2].map(u));
  // Karbonatisierung: Tiefe wächst mit der Zeit
  const kt = m('calc/korrosion.ts').karbonatisierungsKurve as unknown as (k: number, t: number) => number[];
  steigt('Karbonatisierung x_c(t)', kt(4, 50).slice(1, 50));
  // Ökobilanz: mehr Zement → mehr GWP (Mischung)
  const bk = m('calc/biokohlebeton.ts').biokohleBilanz as unknown as (e: Record<string, number>) => Record<string, number>;
  const bkb = { mPK: 10, cGehalt: 80, fPerm: 0.8, ePK: 0.3, zRef: 320, deltaZ: 10, gwpZ: 0.8, w: 160, wAufnahme: 100 };
  steigt('Biokohlebeton GWP_Ref(z_Ref) – mehr Zement, mehr GWP', [280, 320, 360].map(zRef => bk({ ...bkb, zRef }).gwpRef));
  steigt('Biokohlebeton CO₂-Speicher(m_PK)', [5, 10, 20].map(mPK => bk({ ...bkb, mPK }).co2Speicher));
  // Einheiten: hin und zurück ergibt den Ausgangswert
  const um = m('calc/einheiten.ts').umrechnung as unknown as (w: number, a: string, v: string, n: string) => { wert: number; gueltig: boolean };
  for (const [w, a, v, n] of [[20, 'Temperatur', '°C', 'K'], [355, 'Spannung/Druck', 'MPa (N/mm²)', 'bar'], [1.5, 'Länge', 'm', 'mm']] as const) {
    const hin = um(w, a, v, n);
    if (!hin.gueltig) { gilt(false, `R6 Einheiten ${a} ${v} → ${n} ungültig`); continue; }
    const zurueck = um(hin.wert, a, n, v);
    gilt(zurueck.gueltig && Math.abs(zurueck.wert - w) < 1e-9 * Math.max(1, Math.abs(w)), `R6 Einheiten ${a} ${v} ↔ ${n}: ${w} → ${hin.wert} → ${zurueck.wert}`);
  }
}

// ---------------------------------------------------------------- 5b. Reglergrenzen der Module (gültige Eingaben → gültiges, endliches Ergebnis)
// Bereiche aus den <input type="range">-Reglern der Module abgelesen (Stand 02.11.2026); geprüft werden alle Ecken min/max
// je Regler bei Mittelwerten der übrigen. Ein Fehlerhinweis am Reglerende wäre ein Widerspruch zwischen Anzeige und Kern.
{
  const m = (d: string) => module[`src/${d}`] as Record<string, (...a: never[]) => unknown>;
  const ecken = (fall: string, bereiche: Record<string, [number, number]>, rechne: (w: Record<string, number>) => unknown) => {
    const mitte = Object.fromEntries(Object.entries(bereiche).map(([k, [a, b]]) => [k, (a + b) / 2]));
    for (const [k, [a, b]] of Object.entries(bereiche)) for (const v of [a, b]) {
      let r: unknown;
      try { r = rechne({ ...mitte, [k]: v }); } catch (e) { gilt(false, `Regler ${fall} ${k} = ${v}: Ausnahme ${String((e as Error).message)}`); continue; }
      gilt(!ungueltig(r) && zahlen(r).length > 0 && zahlen(r).filter(x => !Number.isNaN(x)).every(Number.isFinite), `Regler ${fall} ${k} = ${v}: ungültig oder nicht endlich`);
    }
  };
  // LCC.tsx: N 10 … 80 a, r 0,5 … 6 %, e 0 … 8 %, i 0 … 5 %, CO₂-Preis 20 … 220 €/t, Steigerung 0 … 10 %, Förderung 5 … 40 %
  const o = { capex: 1000, opex0: 10, maintenanceCost: 5, maintenanceInterval: 5, replacementCost: 800, lifespan: 30, eolCost: 50, embodiedCO2: 100, operatingCO2: 10 };
  ecken('LCC', { N: [10, 80], r: [0.5, 6], e: [0, 8], i: [0, 5], co2Preis: [20, 220], co2Steigerung: [0, 10], foerderungB: [5, 40] }, w => m('calc/lcc.ts').lccVergleich(o as never, o as never,
    { r: w.r / 100, e: w.e / 100, i: w.i / 100, N: Math.round(w.N / 5) * 5, co2Bepreisung: true, co2Preis: w.co2Preis, co2Steigerung: w.co2Steigerung / 100, foerderungB: w.foerderungB, restwertLinear: false } as never));
  // Bauchemie.tsx: Stellmittel 0 … 2 %, Scherrate 0,1 … 100 1/s
  ecken('Stellmittel', { c: [0, 2], g: [0.1, 100] }, w => m('calc/bauchemie.ts').stellmittelRheologie(w.c as never, w.g as never));
  // KorrosionsschutzBeschichtungen.tsx: d_Zn 20 … 300 µm, t_B 0 … 40 a, Synergie 1 … 3, Stahldicke 1 … 30 mm
  ecken('Zinkschutzdauer', { dZn: [20, 300], tB: [0, 40], f: [1, 3], t: [1, 30] }, w => m('calc/korrosionsschutz.ts').zinkSchutzdauer({ dZn: w.dZn, kategorie: 'C3', ziel: 'H', duplex: true, tBeschichtung: w.tB, synergie: w.f, stahlDickeMm: w.t } as never));
  // HydratationPruefverfahren.tsx: Frischbeton 5 … 35 °C, Umgebung 5 … 30 °C, Fasern 0 … 60 kg/m³, Festhaltegrad 30 … 100 %
  const zement = (hydratationInhalt.daten as { CEMENT_MAP: Record<string, unknown> }).CEMENT_MAP['CEM I 42.5 N (Standard)'];
  ecken('Reißrahmen', { tf: [5, 35], tu: [5, 30], f: [0, 60], g: [30, 100] }, w => m('calc/hydratation.ts').reissrahmen({ zement, tFrisch: w.tf, tUmgebung: w.tu, fasergehalt: w.f, festhaltegrad: w.g } as never));
  // Energieausweis.tsx: Nutzfläche 80 … 400 m²
  ecken('Energieausweis', { a: [80, 400] }, w => m('calc/energieausweis.ts').energieausweis({ typ: 'efh', flaeche: w.a, huelle: 'unsaniert', lueftung: 'fenster', heizung: 'gas_brennwert', rechtsstand: 'bis_2026' } as never));
}

// ---------------------------------------------------------------- 6. Vollständigkeit (R7)
const AUSNAHMEN: Record<string, string> = {
  // Plausibilitätsschicht selbst
  'src/calc/plausibilitaet.ts:*': 'Hilfsfunktionen der Plausibilitätsschicht (keine Rechenkerne).',
  // Prüffunktionen: werden in der zugehörigen Bemessungsfunktion aufgerufen und dort mitgeprüft
  'src/calc/biegung.ts:pruefeBiegung': 'in bemesseBiegung', 'src/calc/durchstanzen.ts:pruefeDurchstanzen': 'in bemesseDurchstanzen',
  'src/calc/glaser.ts:pruefeGlaser': 'in glaser', 'src/calc/lca.ts:pruefeLca': 'in lcaBilanz', 'src/calc/lcc.ts:pruefeLcc': 'in lccVergleich (Abschnitt 3)',
  'src/calc/mischung.ts:pruefeMischung': 'in der Mischungsberechnung', 'src/calc/querkraft.ts:pruefeQuerkraft': 'in bemesseQuerkraft',
  'src/calc/rissbreite.ts:pruefeRiss': 'in bemesseRiss', 'src/calc/sommerWaermeschutz.ts:pruefeRaum': 'im Sonneneintragskennwert',
  'src/calc/spannbeton.ts:pruefeSpannbeton': 'tests/spannbeton.test.ts', 'src/calc/spannbeton.ts:pruefeDehnung': 'in der Dehnungsanimation',
  'src/calc/stahlbau.ts:pruefeDruckstab': 'in bemesseDruckstab', 'src/calc/stuetze.ts:pruefeStuetze': 'in bemesseStuetze',
  'src/calc/verankerung.ts:pruefeVerankerung': 'in bemesseVerankerung', 'src/calc/waermeschutz.ts:pruefeSchichten': 'im U-Wert',
  'src/calc/lebensdauer.ts:pruefeVerteilung': 'in lebensdauerbemessung', 'src/calc/kriechenSchwinden.ts:h0Hinweise': 'Hinweisliste, kein Ergebnis',
  // Klassifizierer und Texte (Ergebnis ist keine Zahl) – Verhalten bei NaN siehe Bericht, Frage F-1
  'src/calc/bauwerksuntersuchung.ts:potentialStufe': 'Klassifizierer (F-1)', 'src/calc/bauwerksuntersuchung.ts:potentialStatus': 'Klassifizierer (F-1)',
  'src/calc/boden.ts:zustandsformISO14688': 'Klassifizierer (F-1)', 'src/calc/eisenKohlenstoff.ts:gefuegeRaumtemperatur': 'Klassifizierer (F-1)',
  'src/calc/eisenKohlenstoff.ts:schweisseignung': 'Klassifizierer (F-1)', 'src/calc/pfas.ts:istKurzkettig': 'Klassifizierer Kettenlänge (boolesch), in pfasSummenbewertung und tests/nachstichprobe5c.test.ts','src/calc/energieausweis.ts:effizienzklasse': 'Klassifizierer (F-1)',
  'src/calc/erdbau.ts:bodengruppe': 'Klassifizierer (F-1)', 'src/calc/hydratation.ts:rissgefahrAusDeltaT': 'Klassifizierer (F-1)',
  'src/calc/hydratation.ts:festigkeitsentwicklungAusR': 'Klassifizierer (F-1)', 'src/calc/hydratation.ts:oberflaechenTempBereich': 'Klassifizierer (F-1)',
  'src/calc/karsten.ts:saugKlasse': 'Klassifizierer (F-1)', 'src/calc/keramik.ts:fliesenGruppe': 'Klassifizierer (F-1)', 'src/calc/keramik.ts:scherbenTyp': 'Klassifizierer (F-1)',
  'src/calc/korrosion.ts:schadensStufe': 'Klassifizierer (F-1)', 'src/calc/korrosionsschutz.ts:schutzdauerklasse': 'Klassifizierer (F-1)',
  'src/calc/laborversuche.ts:bereichCSE': 'Klassifizierer (F-1)', 'src/calc/laborversuche.ts:ausbreitklasse': 'Klassifizierer (liefert „–“ bei NaN)',
  'src/calc/materialoptimierung.ts:effizienzKlasseThg': 'Klassifizierer (F-1)', 'src/calc/mauerwerk.ts:normalmoertelGruppe': 'Klassifizierer (F-1); fvk0NA prüft f_m',
  'src/calc/pruefverfahren.ts:potentialRisikoZfp': 'Klassifizierer (F-1)', 'src/calc/pruefverfahren.ts:torrentFeuchte': 'Klassifizierer (F-1)',
  'src/calc/pruefverfahren.ts:thermografieStufe': 'Klassifizierer (F-1)', 'src/calc/sommerWaermeschutz.ts:bauartAusCwirk': 'Klassifizierer (F-1)',
  'src/calc/stahlbau.ts:knicklinieNachTab62': 'Klassifizierer aus Tabellenwerten', 'src/calc/werkstoffmodelle.ts:stahlVerformungsphase': 'Klassifizierer (F-1)',
  'src/calc/werkstoffmodelle.ts:gefuegeklasse': 'Klassifizierer (F-1)', 'src/utils/bestandKern.ts:classFor': 'Klassifizierer (F-1)',
  'src/utils/schadensKern.ts:riebwClass': 'Klassifizierer, Abschnitt 4', 'src/calc/lebensdauerUebergabe.ts:bindemittelAusAlterung': 'Zuordnung aus Tabellenwert',
  'src/calc/biegelinie.ts:istLagerung': 'Typprüfung', 'src/calc/mischung.ts:fzLehrannahme': 'Wahrheitswert', 'src/calc/mischung.ts:bereichAmSieb': 'Klassifizierer mit Typ Größtkorn',
  // Tabellenzugriffe mit Schlüsseltypen (Werte nur aus Auswahllisten)
  'src/calc/bauchemie.ts:molmasse': 'Formelparser (Text)', 'src/calc/bauchemie.ts:stoffumsatz': 'Reaktionsauswahl (Schlüssel)',
  'src/calc/einheiten.ts:umrechnen': 'in umrechnung', 'src/calc/einheiten.ts:einheitVon': 'Tabellenzugriff',
  'src/calc/energieausweis.ts:rechtsstandAm': 'Datum', 'src/calc/festbetonStatistik.ts:pruefwerteAusText': 'Textparser',
  'src/calc/pruefverfahren.ts:messwerteAusText': 'Textparser', 'src/calc/mauerwerk.ts:fkNA': 'Tabellenzugriff (Steinart, Mörtel)',
  'src/calc/mischung.ts:kombinationsGrenze': 'Tabellenzugriff (Zementart)', 'src/calc/sommerWaermeschutz.ts:fcAusTabelle': 'Tabellenzugriff',
  'src/calc/stahlbau.ts:profil': 'Tabellenzugriff', 'src/utils/rheologySim.ts:controlFor': 'Tabellenzugriff',
  'src/calc/hydratation.ts:praxisbeispielMassigesBauteil': 'festes Praxisbeispiel ohne Eingaben',
  // Zufallszahlen und Monte-Carlo-Bausteine (in lebensdauerbemessung mitgeprüft)
  'src/calc/lebensdauer.ts:zufallsgenerator': 'Zufallszahlen', 'src/calc/lebensdauer.ts:standardNormal': 'Zufallszahlen', 'src/calc/lebensdauer.ts:gammaZufall': 'Zufallszahlen',
  'src/calc/lebensdauer.ts:ziehe': 'Zufallszahlen', 'src/calc/lebensdauer.ts:betaFormparameter': 'in pruefeVerteilung geprüft', 'src/calc/lebensdauer.ts:kritischeTiefe': 'in lebensdauerbemessung',
  // Adressen und Übergaben zwischen Modulen
  'src/calc/lebensdauerUebergabe.ts:uebergabeSuche': 'URL-Baustein', 'src/calc/lebensdauerUebergabe.ts:leseUebergabe': 'URL-Leser (eigener Test)', 'src/calc/lebensdauerUebergabe.ts:uebergabeAdresse': 'URL-Baustein',
  // Statistik mit Kennwertobjekten aus stichprobe() (in tests/statistik.test.ts)
  'src/calc/statistik.ts:einstichprobenTTestKennwerte': 'Kennwerte aus stichprobe()', 'src/calc/statistik.ts:zweistichprobenTTestKennwerte': 'Kennwerte aus stichprobe()',
  'src/calc/boden.ts:zustandsgrenzen': 'eigener Test (tests/boden.test.ts)', 'src/calc/durchstanzen.ts:bemesseDurchstanzen': 'Fixture',
  'src/calc/mischung.ts:istSieblinie': 'Typ Größtkorn', 'src/calc/mischung.ts:regelDurchgang': 'Typ Größtkorn',
  'src/utils/bestandKern.ts:fxBauteilVon': 'Zuordnung aus Bauteiltyp (in savings mitgeprüft)',
};
for (const d of KERN_DATEIEN) for (const [name, wert] of Object.entries(module[d])) {
  if (typeof wert !== 'function') continue;
  const id = `${d}:${name}`;
  if (gesehen.has(id) || AUSNAHMEN[id] || AUSNAHMEN[`${d}:*`]) continue;
  // Re-Exporte (spannbeton.ts → ec2Spannbeton.ts) zählen bei der Herkunftsdatei
  if (d === 'src/calc/spannbeton.ts' && typeof module['src/utils/ec2Spannbeton.ts'][name] === 'function') continue;
  if (Object.entries(module).some(([d2, m2]) => d2 !== d && m2[name] === wert && gesehen.has(`${d2}:${name}`))) continue;
  gilt(false, `R7 ${id}: weder Basis noch begründete Ausnahme`);
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); console.error(`${fehler.length} Befunde`); process.exit(1); }
console.log(`OK: Grenzfälle der Rechenkerne (${gesehen.size} Funktionen, ${anzahlFaelle} Zahlenfelder)`);
