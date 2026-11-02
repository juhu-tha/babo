// Prüfung „Kein Ergebnis in der Anzeige“ (02.11.2026, docs/pruefung/kein-ergebnis-anzeige-2026-11-02.md)
// Seit der Grenzfallprüfung der Rechenkerne (#305) liefern alle Kerne bei ungültiger Eingabe NaN. Dieser Test sichert:
//   A  statisch (TypeScript-Compiler, scripts/qa/kein-ergebnis-anzeige.mjs): keine Ausgabe eines Kernwerts ohne
//      NaN-festen Formatierer (Template-String, toFixed, rohe Zahl in JSX, Zahl + Text) und kein Vergleich, dessen
//      NaN-Zweig wie ein Erfolg aussieht („x > grenz ? 'rot' : 'grün'“) – außer begründeten Ausnahmen
//   B  Klassifizierer (Entscheidung F-1): keine Zahl → „–“ (Zahlenklassen und Faktoren → NaN), gültige Zahl → echte Klasse
//   C  Kern-Ergebnisse: ungültig → Klassen-, Stufen- und Bewertungsfelder „–“ (über nurGueltig(…, klassen))
import fs from 'node:fs';
import path from 'node:path';
import datei from './fixtures/rechenkerne-basis.json';
import { scanne } from '../scripts/qa/kein-ergebnis-anzeige.mjs';
import { KEINE_KLASSE, nurGueltig } from '../src/calc/plausibilitaet';
import { potentialStufe, potentialStatus, karsten } from '../src/calc/bauwerksuntersuchung';
import { zustandsformISO14688 } from '../src/calc/boden';
import { gefuegeRaumtemperatur, schweisseignung } from '../src/calc/eisenKohlenstoff';
import { effizienzklasse } from '../src/calc/energieausweis';
import { rissgefahrAusDeltaT, festigkeitsentwicklungAusR, oberflaechenTempBereich } from '../src/calc/hydratation';
import { saugKlasse, karstenAuswertung } from '../src/calc/karsten';
import { fliesenGruppe, scherbenTyp, keramikKennwerte } from '../src/calc/keramik';
import { schadensStufe } from '../src/calc/korrosion';
import { schutzdauerklasse } from '../src/calc/korrosionsschutz';
import { bereichCSE, ausbreitklasse, trockenFaktor } from '../src/calc/laborversuche';
import { effizienzKlasseThg } from '../src/calc/materialoptimierung';
import { normalmoertelGruppe, fvk0NA } from '../src/calc/mauerwerk';
import { potentialRisikoZfp, torrentFeuchte, thermografieStufe, torrentKlasse } from '../src/calc/pruefverfahren';
import { bauartAusCwirk } from '../src/calc/sommerWaermeschutz';
import { stahlVerformungsphase, gefuegeklasse } from '../src/calc/werkstoffmodelle';
import { schulnoteAusZustandsnote } from '../src/calc/schutzInstandsetzung';
import { xiLimit } from '../src/calc/biegung';
import { classFor } from '../src/utils/bestandKern';
import { margin13791, riebwClass } from '../src/utils/schadensKern';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
console.log('--- Test: Kein Ergebnis in der Anzeige ---');

// ---------------------------------------------------------------- A. statisch
/** Ausnahmen „Datei:Zeilentext-Muster“ → Begründung (keine Anzeige eines Kernergebnisses) */
const AUSNAHMEN: { datei: string; muster: RegExp; grund: string }[] = [
  { datei: 'src/modules/Asphalt.tsx', muster: /p\.bitumen\.toFixed/, grund: 'Achsenbeschriftung aus der festen Bitumen-Stützstellenreihe des Diagramms' },
  { datei: 'src/modules/Hydratation.tsx', muster: /fReq\.toFixed/, grund: 'Diagramm-Datenreihe (NaN → Lücke), Beschriftung über formatDeZahl' },
  { datei: 'src/modules/nachhaltigkeit/CbamRechner.tsx', muster: /p\.jahr/, grund: 'Jahreszahl aus fester Reihe 2026–2034' },
  { datei: 'src/modules/Sicherheitskonzept.tsx', muster: /k\.massgebend/, grund: 'Index der Leiteinwirkung (ganze Zahl), Formelindex' },
  { datei: 'src/modules/beispielrechnungen/RechnungMauerwerk.tsx', muster: /e\.sfk/, grund: 'Steinfestigkeitsklasse aus der Tabelle (Text der Klasse)' },
  { datei: 'src/modules/PfasBaustoffe.tsx', muster: /PFAS_GRENZWERTE\.pfas20/, grund: 'fester Grenzwert (Konstante), keine Rechnung' },
];
const befunde = (scanne() as { datei: string; zeile: number; art: string; text: string }[])
  .filter(b => !AUSNAHMEN.some(a => a.datei === b.datei && a.muster.test(b.text)));
for (const b of befunde) fehler.push(`A ${b.art} ${b.datei}:${b.zeile}: ${b.text}`);

// ---------------------------------------------------------------- B. Klassifizierer (F-1)
const STRING_KLASSIFIZIERER: [string, (x: number) => unknown, number][] = [
  ['potentialStufe', potentialStufe, -150], ['potentialStatus', potentialStatus, -150],
  ['zustandsformISO14688', zustandsformISO14688, 0.6], ['gefuegeRaumtemperatur', gefuegeRaumtemperatur, 0.4],
  ['effizienzklasse', effizienzklasse, 80], ['rissgefahrAusDeltaT', rissgefahrAusDeltaT, 12],
  ['festigkeitsentwicklungAusR', festigkeitsentwicklungAusR, 0.4], ['oberflaechenTempBereich', oberflaechenTempBereich, 12],
  ['saugKlasse', saugKlasse, 1], ['fliesenGruppe', x => fliesenGruppe(x, 'B'), 3], ['scherbenTyp', x => scherbenTyp(x, 'B'), 3],
  ['schadensStufe', x => schadensStufe(true, x), 2], ['schutzdauerklasse', schutzdauerklasse, 20], ['bereichCSE', bereichCSE, -300],
  ['ausbreitklasse', ausbreitklasse, 450], ['effizienzKlasseThg', effizienzKlasseThg, 30], ['normalmoertelGruppe', normalmoertelGruppe, 6],
  ['potentialRisikoZfp', potentialRisikoZfp, -300], ['torrentFeuchte', torrentFeuchte, 75], ['thermografieStufe', thermografieStufe, 1],
  ['torrentKlasse', torrentKlasse, 0.2], ['bauartAusCwirk', bauartAusCwirk, 80],
  ['stahlVerformungsphase', x => stahlVerformungsphase({ E: 210000, fy: 235, fu: 360, A: 26, fu_strain: 18, sh_strain: 2, yieldType: 'ausgeprägt' } as never, x), 1],
  ['gefuegeklasse', x => gefuegeklasse(x, 8, 0, 0.05), 18], ['schulnoteAusZustandsnote', schulnoteAusZustandsnote, 2.2],
  ['classFor', classFor, 30], ['schweisseignung.stufe', x => schweisseignung(x).stufe, 0.38], ['riebwClass', riebwClass, 2.2],
];
for (const [name, f, gueltig] of STRING_KLASSIFIZIERER) {
  for (const v of [NaN, Infinity, -Infinity]) gilt(f(v) === KEINE_KLASSE || (name === 'riebwClass' && f(v) === 'ungültig'), `B ${name}(${v}) → ${String(f(v))}, soll „–“`);
  gilt(f(gueltig) !== KEINE_KLASSE && f(gueltig) !== undefined, `B ${name}(${gueltig}) liefert eine echte Klasse`);
}
const ZAHL_KLASSIFIZIERER: [string, (x: number) => number, number][] = [
  ['xiLimit', xiLimit, 30], ['trockenFaktor', trockenFaktor, 45], ['margin13791', margin13791, 18],
];
for (const [name, f, gueltig] of ZAHL_KLASSIFIZIERER) {
  gilt(Number.isNaN(f(NaN)), `B ${name}(NaN) → ${f(NaN)}, soll NaN`);
  gilt(Number.isFinite(f(gueltig)), `B ${name}(${gueltig}) endlich`);
}
gilt(xiLimit(30) === 0.45 && xiLimit(55) === 0.35 && trockenFaktor(45) === 0.92 && margin13791(18) === 3, 'B Zahlenklassen für gültige Eingaben unverändert');
gilt(fvk0NA('NM', NaN).gruppe === '–' && Number.isNaN(fvk0NA('NM', NaN).fvk0), 'B fvk0NA ohne f_m: Gruppe „–“');

// ---------------------------------------------------------------- C. Kern-Ergebnisse: Klassenfelder bei ungültiger Eingabe
gilt(karsten(-1).klasse === KEINE_KLASSE && karsten(10).klasse !== KEINE_KLASSE, 'C karsten: −1 ml → „–“');
gilt(karstenAuswertung(5, 0).klasse === KEINE_KLASSE, 'C karstenAuswertung: Prüfzeit 0 → „–“ (vorher „wasserabweisend“)');
{
  const k = keramikKennwerte({ mt: -1, mn: 210, ma: 118, rhoRein: 2.65, formgebung: 'B' } as never);
  gilt(!k.gueltig && (k.gruppe === KEINE_KLASSE || k.gruppe === null) && k.scherben === KEINE_KLASSE, `C keramikKennwerte ungültig → Gruppe/Scherben „–“ (${k.gruppe}, ${k.scherben})`);
}
{
  const r = nurGueltig({ wert: 1, klasse: 'A' as 'A' | '–', gueltig: false, hinweise: [] }, ['klasse']);
  gilt(Number.isNaN(r.wert) && r.klasse === '–', 'C nurGueltig setzt Klassenfelder auf „–“');
  const g = nurGueltig({ wert: 1, klasse: 'A' as 'A' | '–', gueltig: true, hinweise: [] }, ['klasse']);
  gilt(g.wert === 1 && g.klasse === 'A', 'C nurGueltig lässt gültige Ergebnisse unverändert');
}
// Alle Kerne der Fixture (#305): ungültiges Ergebnis → kein Textfeld mit einer echten Klasse außer Eingabe-Echos
type Pfad = (string | number)[];
const BASIS = (datei as unknown as { basis: Record<string, Record<string, { args: unknown[]; pfade: Pfad[]; art: string; ms: number }>> }).basis;
/** Textfelder, die eine Eingabe oder Auswahl wiedergeben (keine aus Zahlen abgeleitete Klasse) */
const ECHO: Record<string, string> = {
  'src/calc/bauwerksuntersuchung.ts:probenahmeUmfang rasterMass': 'Text zum gewählten Bauteiltyp',
  'src/calc/boden.ts:atterberg fliess.verfahren': 'gewähltes Verfahren', 'src/calc/boden.ts:fliessgrenze verfahren': 'gewähltes Verfahren',
  'src/calc/bspSchwingung.ts:bspSchwingung verfahrenAngesetzt': 'gewählter Ansatz', 'src/calc/energieausweis.ts:energieausweis rechtsstand': 'gewählter Rechtsstand',
  'src/calc/expositionsklassen.ts:huellwerte highestClass': 'Klassen aus der Tabelle der DIN 1045-2 (keine Nutzereingabe, Ausnahme in #305)',
  'src/calc/kriechenSchwinden.ts:kriechSchwindModell eingabe.zement': 'Eingabe-Echo (Zementklasse)',
};
const fehlerIn = (v: unknown) => Array.isArray(v) && v.some(x => x && typeof x === 'object' && (x as { stufe?: string }).stufe === 'fehler');
const ungueltig = (r: unknown) => !!r && typeof r === 'object' && ((r as { gueltig?: unknown }).gueltig === false || fehlerIn(r) || Object.values(r as object).some(fehlerIn));
function setze(x: unknown, p: Pfad, v: unknown): unknown {
  if (!p.length) return v;
  const c = (Array.isArray(x) ? [...x] : { ...(x as object) }) as Record<string | number, unknown>;
  c[p[0]] = setze((x as Record<string | number, unknown>)[p[0]], p.slice(1), v); return c;
}
function texte(r: unknown, p: string[] = [], aus: [string, string][] = [], t = 0): [string, string][] {
  if (typeof r === 'string') aus.push([p.join('.'), r]);
  else if (r && typeof r === 'object' && t < 5) for (const [k, v] of Object.entries(r)) if (k !== 'hinweise') texte(v, [...p, k], aus, t + 1);
  return aus;
}
let kernFaelle = 0;
for (const [d, fns] of Object.entries(BASIS)) {
  const m = await import(path.join(ROOT, d)) as Record<string, (...a: unknown[]) => unknown>;
  for (const [name, e] of Object.entries(fns)) {
    if (e.art !== 'kern' || e.ms > 2 || typeof m[name] !== 'function') continue;
    const basisTexte = new Map(texte(m[name](...e.args)));
    for (const p of e.pfade) for (const v of [NaN, -1, 0]) {
      let r: unknown; try { r = m[name](...(setze(e.args, p, v) as unknown[])); } catch { continue; }
      if (!ungueltig(r)) continue;
      kernFaelle++;
      for (const [pf, wert] of texte(r)) {
        if (!basisTexte.has(pf) || wert === KEINE_KLASSE) continue;
        const schluessel = `${d}:${name} ${pf.replace(/\.\d+\./g, '.')}`;
        if (ECHO[schluessel]) continue;
        fehler.push(`C ${schluessel} [${p.join('.')} = ${v}]: ungültig, aber „${wert.slice(0, 40)}“ statt „–“`);
      }
    }
  }
}
gilt(kernFaelle > 500, `C genug ungültige Kernfälle geprüft (${kernFaelle})`);
gilt(fs.existsSync(path.join(ROOT, 'docs/pruefung/kein-ergebnis-anzeige-2026-11-02.md')), 'Bericht vorhanden');

if (fehler.length) { for (const f of [...new Set(fehler)].slice(0, 80)) console.error(`FAIL: ${f}`); console.error(`${new Set(fehler).size} Befunde`); process.exit(1); }
console.log(`OK: keine Kernausgabe ohne Formatierer, ${STRING_KLASSIFIZIERER.length + ZAHL_KLASSIFIZIERER.length} Klassifizierer, ${kernFaelle} ungültige Kernfälle ohne echte Klasse`);
