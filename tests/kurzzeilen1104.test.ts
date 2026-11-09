// Kurzzeilen 04.11.2026 (docs/pruefung/kurzzeilen-2026-11-04.md): Jeder Rechner sagt sein Ergebnis an (WCAG 4.1.3).
//  1. ansageWert/kurzzeile: deutsch formatiert, „–“ bei ungültiger Eingabe, nie „NaN“
//  2. FormulaDerivationBox: Prop `kurzzeile` ersetzt die Ansage „Titel: Ergebnishinweis“ und wird nicht angezeigt
//  3. Statische Prüfung: jeder Rechner (Registry typ 'calculator' und jedes Modul, dessen Komponentenbaum einen
//     Rechenkern aus src/calc/ einbindet) hat eine Ansagequelle – <ErgebnisAnsage …>, `kurzzeile=` an einer
//     Rechenweg-Box oder einen aus Rechenwerten gebildeten Ergebnishinweis (Vorlage mit ${…}). Begründete Ausnahmen
//     stehen in AUSNAHMEN (Ratsche: keine ungenutzte Ausnahme, Anzahl höchstens MAX_AUSNAHMEN).
import fs from 'node:fs';
import path from 'node:path';
import { h, rendere } from './hilfen/komponenten';
import { ansageWert, kurzzeile } from '../src/components/ui/ErgebnisAnsage';

const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
console.log('--- Test: Kurzzeilen 04.11.2026 ---');

// ---------------------------------------------------------------- 1. Hilfen
gilt(ansageWert('f_ck', 31.64, 1, 'MPa') === 'f_ck 31,6 MPa', 'ansageWert: Dezimalkomma');
gilt(ansageWert('A', NaN, 1, 'MPa') === 'A –', 'ansageWert: NaN → „–“ ohne Einheit');
gilt(ansageWert('A', Infinity, 1) === 'A –' && ansageWert('A', null, 0) === 'A –' && ansageWert('A', undefined, 0) === 'A –', 'ansageWert: ±∞/null → „–“');
gilt(ansageWert('M', 12345.6, 1, 'kg') === 'M 12 345,6 kg', 'ansageWert: Tausender ab 5 Stellen mit U+202F');
gilt(ansageWert('M', 1234.5, 0) === 'M 1235', 'ansageWert: 4 Stellen ohne Tausendertrennung');
gilt(ansageWert('d', -2.5, 1, 'mm') === 'd −2,5 mm', 'ansageWert: Minuszeichen');
gilt(ansageWert('d', -0.0001, 2) === 'd 0,00', 'ansageWert: gerundet null ohne Vorzeichen');
gilt(ansageWert('w', 0.000123, 'frei') === 'w 0,000123' && ansageWert('w', NaN, 'frei', 'kg') === 'w –', 'ansageWert frei');
gilt(kurzzeile('a', '', false, null, undefined, 'b') === 'a, b', 'kurzzeile: leere Teile entfallen');

// ---------------------------------------------------------------- 2. FormulaDerivationBox
const { FormulaDerivationBox } = await import('../src/components/ui/FormulaDerivationBox');
const box = (p: Record<string, unknown>) => rendere(h(FormulaDerivationBox, { title: 'Knicklast', zielGleichung: 'F', schritte: [], ...p }));
const mitKz = box({ ergebnisHinweis: 'fester Text', kurzzeile: 'F_K 10,0 kN' });
gilt((mitKz.match(/data-ergebnis-ansage/g) ?? []).length === 1, 'FormulaDerivationBox: genau eine Ansageregion mit Kurzzeile');
gilt(!mitKz.includes('F_K 10,0 kN'), 'FormulaDerivationBox: Kurzzeile wird nicht angezeigt (Seitenaufbau, sichtbar unverändert)');
const ohne = box({});
gilt(!ohne.includes('data-ergebnis-ansage'), 'FormulaDerivationBox: ohne Hinweis und Kurzzeile keine Ansage');
const quelle = fs.readFileSync('src/components/ui/FormulaDerivationBox.tsx', 'utf8');
gilt(/kurzzeile !== undefined\s*\?\s*<ErgebnisAnsage text=\{kurzzeile\}/.test(quelle), 'FormulaDerivationBox: Kurzzeile hat Vorrang vor dem Ergebnishinweis');

// ---------------------------------------------------------------- 3. Statische Prüfung
const reg = fs.readFileSync('src/registry/modules.ts', 'utf8');
const bloecke = reg.slice(reg.indexOf('export const MODULE = ['), reg.indexOf('] as const satisfies readonly ModulEintrag[]')).split(/\n(?= {2}\{ id: ')/);
const module = bloecke.map(b => ({ id: b.match(/^ {2}\{ id: '([a-z0-9_-]+)'/m)?.[1], typ: b.match(/typ: '(\w+)'/)?.[1] })).filter(m => m.id) as { id: string; typ?: string }[];
const inaktiv = (reg.match(/export const INAKTIVE_GRUPPEN[^=]*= \[([^\]]*)\]/)?.[1] ?? '').match(/'([^']+)'/g)?.map(s => s.slice(1, -1)) ?? [];
const gruppeVon = (id: string) => bloecke.find(b => b.startsWith(`  { id: '${id}'`))?.match(/gruppe: '([^']+)'/)?.[1];

const mi = fs.readFileSync('src/routing/ModulInhalt.tsx', 'utf8');
const lazy = Object.fromEntries([...mi.matchAll(/const (\w+) = React\.lazy\(\(\) => import\('([^']+)'\)/g)].map(m => [m[1], path.join('src/routing', m[2])]));

/** Gemeinsame Komponenten mit Reitern: die Dateien des jeweiligen Reiters statt der ganzen Komponente */
const TEILDATEIEN: Record<string, string[]> = {
  stahlbeton_bemessung: ['src/modules/SpannungDehnung.tsx'],
  spannung: ['src/modules/SpannungDehnung.tsx'],
  biegebemessung: ['src/modules/Biegebemessung.tsx'],
  querkraftbemessung: ['src/modules/Querkraftbemessung.tsx'],
  stuetzenbemessung: ['src/modules/Stuetzenbemessung.tsx'],
  durchstanzen: ['src/modules/Durchstanzen.tsx'],
  verankerungslaenge: ['src/modules/Verankerungslaenge.tsx'],
  rissbreite: ['src/modules/Rissbreite.tsx'],
  oekobilanz_lca: ['src/modules/LCA.tsx'],
  lca_rechner: ['src/modules/InteractiveLCACalc.tsx', 'src/modules/lca/TransportbetonLcaUebung.tsx', 'src/modules/nachhaltigkeit/Wandkonfigurator.tsx', 'src/modules/nachhaltigkeit/QngNachweis.tsx'],
  lca_ingenieurbau: ['src/modules/lca/IngenieurbauLCA.tsx'],
  lca_regulatorik: ['src/modules/nachhaltigkeit/CrremRegulatorik.tsx', 'src/modules/nachhaltigkeit/PraxisInnovationen.tsx'],
  holzbau_info: ['src/modules/holzbaubeta/HolzbauInfo.tsx'],
  holzbau_werkstoffe: ['src/modules/holzbaubeta/HolzbauWerkstoffe.tsx'],
  holzbau_konstruktion: ['src/modules/holzbaubeta/HolzbauKonstruktion.tsx'],
  holzbau_bemessung: ['src/modules/holzbaubeta/HolzbauBemessung.tsx'],
  holzbau_verbindung: ['src/modules/holzbaubeta/HolzbauVerbindung.tsx'],
  holzbau_bauphysik: ['src/modules/holzbaubeta/HolzbauBauphysik.tsx'],
  bp_verkehrswegebau: ['src/modules/bpverkehrswegebau/RstoRechnerTab.tsx'],
  bp_verkehr_rsto: ['src/modules/bpverkehrswegebau/RstoRechnerTab.tsx'],
  bp_verkehr_asphalt: ['src/modules/bpverkehrswegebau/VergleichTab.tsx'],
  bp_verkehr_bitumen: ['src/modules/bpverkehrswegebau/BindemittelTab.tsx'],
  bp_verkehr_pruefung: ['src/modules/bpverkehrswegebau/PrueftechnikTab.tsx'],
  bp_verkehr_betondecken: ['src/modules/bpverkehrswegebau/BetondeckenTab.tsx'],
  bp_verkehr_tiefbau: ['src/modules/bpverkehrswegebau/TiefbauTab.tsx'],
  bp_verkehr_bahn: ['src/modules/bpverkehrswegebau/BahnbauTab.tsx'],
  bp_verkehr_tunnel: ['src/modules/bpverkehrswegebau/TunnelbauTab.tsx'],
  bauwerksdiagnose: ['src/modules/bauwerksuntersuchung/ProbenahmePlaner.tsx', 'src/modules/bauwerksuntersuchung/InterpretationNavigator.tsx'],
  pruefverfahren_katalog: ['src/modules/bauwerksuntersuchung/PruefverfahrenKatalog.tsx'],
  zfp: ['src/modules/ZfP.tsx'],
  aufgaben_trainer: ['src/components/trainer/DynamischerAufgabenGenerator.tsx'],
  kombinationen: ['src/modules/Kombinationen.tsx'],
  faserverbund: ['src/modules/Kombinationen.tsx'],
};

/**
 * Begründete Ausnahmen (Ratsche): Rechner ohne Rechenergebnis, das sich durch Eingaben ändert.
 * Nur kürzen; ein neuer Eintrag braucht einen Grund.
 */
export const AUSNAHMEN: Record<string, string> = {
  dpp: 'Digitaler Produktpass: Scan-Simulation und Datenblatt, keine Eingabe mit Rechenergebnis',
  px_bautagebuch: 'Bautagebuch: Formular zum Ausfüllen und Drucken, kein Rechenergebnis',
};
const MAX_AUSNAHMEN = 2;   // 09.11.: ki_prompting gestrichen (Komponentenbaum hat jetzt die Ansage des Token-Rechners)
/** Zusätzlich wie Rechner geprüft: im Befund vom 04.11. genannt (Regler, Lehrnäherung ohne Rechenkern) */
const ZUSATZ_RECHNER = ['sonderbetone'];
/**
 * Offen (Folgeauftrag, Ratsche): Module ohne Rechenkern und nicht typ 'calculator', deren Baum Regler oder Zahlenfelder
 * enthält, aber keine Ansagequelle. Liste darf nur kürzer werden; ein Modul mit neuer Kurzzeile hier streichen.
 * Seit 09.11.2026 leer (alle 25 Module mit Ansage, docs/pruefung/a11y-regler-svg-2026-11-09.md).
 */
const REGLER_OFFEN: string[] = [];

function aufloesen(von: string, spec: string): string | null {
  let p: string;
  if (spec.startsWith('@/')) p = spec.slice(2);
  else if (spec.startsWith('.')) p = path.join(path.dirname(von), spec);
  else return null;
  for (const e of ['', '.tsx', '.ts', '/index.tsx', '/index.ts']) if (fs.existsSync(p + e) && fs.statSync(p + e).isFile()) return path.normalize(p + e);
  return null;
}
/** Komponentenbaum einer Datei (Module und Komponenten, ohne ui/Kontext/Daten); Rechenkerne werden vermerkt */
function baum(datei: string, gesehen = new Set<string>()): Set<string> {
  if (gesehen.has(datei)) return gesehen;
  gesehen.add(datei);
  const s = fs.readFileSync(datei, 'utf8');
  for (const m of s.matchAll(/(?:from|import\()\s*'([^']+)'/g)) {
    const r = aufloesen(datei, m[1]);
    if (!r || !/\.tsx?$/.test(r)) continue;
    if (r.startsWith('src/calc/')) { gesehen.add(r); continue; }
    if (/^src\/(components\/ui|contexts|i18n|data|utils|lib|registry|routing|types)\//.test(r)) continue;
    baum(r, gesehen);
  }
  return gesehen;
}
const QUELLE = /<ErgebnisAnsage\b|\bkurzzeile=\{|ergebnisHinweis=\{[^\n]*`[^`\n]*\$\{/;

const ohneQuelle: string[] = [];
const reglerOffen = new Set<string>();
const neuOhne: string[] = [];
const genutzt = new Set<string>();
let rechnerAnzahl = 0;
for (const { id, typ } of module) {
  if (inaktiv.includes(gruppeVon(id) ?? '')) continue;
  let starts = TEILDATEIEN[id];
  if (!starts) {
    const comp = mi.match(new RegExp(`activeTab === '${id}'[^\\n]*?<(\\w+)`))?.[1];
    const f = comp && lazy[comp] ? aufloesen('src/routing/x.tsx', `./${path.relative('src/routing', lazy[comp])}`) : null;
    starts = f ? [f] : [];
  }
  for (const s of starts) gilt(fs.existsSync(s), `${id}: Teildatei ${s} fehlt`);
  const dateien = new Set<string>();
  for (const s of starts.filter(x => fs.existsSync(x))) baum(s, dateien);
  const mitKern = [...dateien].some(d => d.startsWith('src/calc/'));
  const quellenTexte = () => [...dateien].filter(d => !d.startsWith('src/calc/')).map(d => fs.readFileSync(d, 'utf8'));
  if (typ !== 'calculator' && !mitKern && !ZUSATZ_RECHNER.includes(id)) {
    const regler = quellenTexte().some(t => /type="range"|<Slider\b|type="number"/.test(t));
    const hatQ = quellenTexte().some(t => QUELLE.test(t));
    if (regler && !hatQ) { if (REGLER_OFFEN.includes(id)) reglerOffen.add(id); else neuOhne.push(id); }
    continue;
  }
  rechnerAnzahl++;
  if (!starts.length) { gilt(id in AUSNAHMEN, `${id}: Rechner ohne zuordenbare Komponente`); if (id in AUSNAHMEN) genutzt.add(id); continue; }
  const hat = [...dateien].some(d => !d.startsWith('src/calc/') && QUELLE.test(fs.readFileSync(d, 'utf8')));
  if (hat) continue;
  if (id in AUSNAHMEN) { genutzt.add(id); continue; }
  ohneQuelle.push(id);
}
gilt(ohneQuelle.length === 0, `Rechner ohne Ansagequelle (Kurzzeile ergänzen oder begründete Ausnahme): ${ohneQuelle.join(', ')}`);
const ungenutzt = Object.keys(AUSNAHMEN).filter(id => !genutzt.has(id));
gilt(ungenutzt.length === 0, `Ausnahmen ohne Bedarf (streichen): ${ungenutzt.join(', ')}`);
gilt(Object.keys(AUSNAHMEN).length <= MAX_AUSNAHMEN, `Ausnahmen ${Object.keys(AUSNAHMEN).length} > ${MAX_AUSNAHMEN}`);
gilt(neuOhne.length === 0, `Module mit Reglern ohne Ansagequelle (neu, Kurzzeile ergänzen): ${neuOhne.join(', ')}`);
const erledigt = REGLER_OFFEN.filter(id => !reglerOffen.has(id));
gilt(erledigt.length === 0, `REGLER_OFFEN: erledigt bzw. ohne Bedarf, streichen: ${erledigt.join(', ')}`);
gilt(rechnerAnzahl >= 120, `nur ${rechnerAnzahl} Rechner erkannt – Zuordnung ModulInhalt/Registry prüfen`);

// Kurzzeilen nicht aus rohen Zahlen: keine toFixed/toString/toExponential in Ansagetexten (Punkt statt Komma, „NaN“)
const roh: string[] = [];
const alle = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? alle(path.join(d, e.name)) : /\.tsx$/.test(e.name) ? [path.join(d, e.name)] : []);
for (const d of [...alle('src/modules'), ...alle('src/components')]) {
  const s = fs.readFileSync(d, 'utf8');
  for (const m of s.matchAll(/(?:<ErgebnisAnsage text=\{|kurzzeile=\{|kurzzeile: kz)([^\n]*)/g)) {
    if (/\.toFixed\(|\.toExponential\(|\.toString\(\)|String\(\w+\)/.test(m[1])) roh.push(`${d}: ${m[1].slice(0, 60)}`);
  }
}
gilt(roh.length === 0, `Ansagetexte mit roher Zahlformatierung: ${roh.join(' | ')}`);
// alte Live-Regionen um ganze Ergebniskarten sind durch Kurzzeilen ersetzt (keine Doppelansage)
for (const d of ['src/modules/statistik/TTestTab.tsx', 'src/modules/schallschutz/TrittschallTab.tsx', 'src/modules/bodenmechanik/AtterbergTab.tsx',
  'src/modules/Lebensdauerbemessung.tsx', 'src/modules/historischematerialkennwerte/BohrkernserieTab.tsx', 'src/modules/EcKennwerte.tsx']) {
  gilt(!/<(section|div)[^>]*aria-live="polite"/.test(fs.readFileSync(d, 'utf8')), `${d}: Ergebniskarte noch als Live-Region`);
}
for (const d of ['src/modules/StahlbauEC3.tsx', 'src/modules/SommerlicherWaermeschutz.tsx', 'src/modules/KorrosionsschutzBeschichtungen.tsx']) {
  const s = fs.readFileSync(d, 'utf8');
  gilt(!/rounded-xl border[^\n]*role="status"/.test(s) && /kurzzeile=\{/.test(s), `${d}: Nachweiskasten noch role="status" statt Kurzzeile`);
}

console.log(`  ${rechnerAnzahl} Rechner geprüft, ${Object.keys(AUSNAHMEN).length} begründete Ausnahmen, ${reglerOffen.size} Module mit Reglern offen`);
if (fehler.length) { fehler.forEach(f => console.error('FAIL: ' + f)); process.exit(1); }
console.log('OK: Kurzzeilen 04.11.2026');
