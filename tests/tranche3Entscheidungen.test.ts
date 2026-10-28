// Umsetzung der Entscheidungen zu Tranche 3 (28.10.2026 abends): EX-1, EX-2, BR-2, BR-3, TS-1 (Befundliste docs/pruefung/module-tranche-3.md)
import { huellwerte } from '../src/calc/expositionsklassen';
import { NORMATIVE_EXPOSURE_CLASSES } from '../src/modules/expositionsklassen/daten';
import { EC2_BRAND_MINDESTMASSE } from '../src/data/brandschutzBeton';
import exDaten from '../content/expositionsklassen/daten.json';
import brand from '../content/beispielrechnungen/RechnungBrandschutz.json';
import schall from '../content/schallschutz/Schallschutz.json';
import schallRechnung from '../content/beispielrechnungen/RechnungSchallschutz.json';

const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
console.log('--- Test: Entscheidungen Tranche 3 ---');

// EX-1: XF2/XF3 mit/ohne LP (DIN 1045-2, Tab. F.2.1): mit LP 0,55/C25/30/300 + Luftgehalt, ohne LP 0,50/C35/45/320
const mitLp = huellwerte(NORMATIVE_EXPOSURE_CLASSES, ['XC4', 'XF3'], 16, 15)!;
gilt(mitLp.minWzEq === 0.55 && mitLp.highestClass === 'C25/30' && mitLp.maxCement === 300 && mitLp.requiresLP && mitLp.minAirVal === 4.5, `EX-1 mit LP ${JSON.stringify(mitLp)}`);
const ohneLp = huellwerte(NORMATIVE_EXPOSURE_CLASSES, ['XC4', 'XF3'], 16, 15, true)!;
gilt(ohneLp.minWzEq === 0.5 && ohneLp.highestClass === 'C35/45' && ohneLp.maxCement === 320 && !ohneLp.requiresLP && ohneLp.minAirVal === null, `EX-1 ohne LP ${JSON.stringify(ohneLp)}`);
const xf2 = huellwerte(NORMATIVE_EXPOSURE_CLASSES, ['XD1', 'XF2'], 32, 15, true)!;
gilt(xf2.minWzEq === 0.5 && xf2.highestClass === 'C35/45' && !xf2.requiresLP, 'EX-1 XF2 ohne LP');
// XF4 hat keine Alternative: mit XF4 bleiben die LP-Werte maßgebend (XF2-LP 0,55/C25/30, XF4 0,50/C30/37/320)
const mitXf4 = huellwerte(NORMATIVE_EXPOSURE_CLASSES, ['XF2', 'XF4'], 16, 15, true)!;
gilt(mitXf4.requiresLP && mitXf4.minWzEq === 0.5 && mitXf4.highestClass === 'C30/37' && mitXf4.maxCement === 320 && mitXf4.specialReqs.some(t => t.includes('XF4')), `EX-1 mit XF4 ${JSON.stringify(mitXf4)}`);
// Schalter ohne XF2/XF3 ohne Wirkung
const xf1 = huellwerte(NORMATIVE_EXPOSURE_CLASSES, ['XC4', 'XF1'], 16, 15, true)!;
gilt(xf1.minWzEq === 0.6 && xf1.highestClass === 'C25/30' && !xf1.requiresLP, 'EX-1 XF1 unverändert');

// EX-2: AKR-Text – E I ohne Maßnahmen, keine Klasse „E II-S“, NA-Zement nicht pauschal obligatorisch
const akr = JSON.stringify(exDaten);
gilt(!akr.includes('E II-S') && !akr.includes('NA-Zement obligatorisch') && akr.includes('E I (E I-O, E I-OF, E I-S): keine vorbeugenden Maßnahmen'), 'EX-2 AKR-Text');

// BR-2: Stützen Tab. 5.2a, μ_fi = 0,5 und 0,7 (erste Kombination b_min/a)
const soll05 = [[200, 25], [200, 36], [300, 45], [350, 45]], soll07 = [[200, 32], [250, 46], [350, 53], [350, 57]];
EC2_BRAND_MINDESTMASSE.forEach((z, i) => gilt(z.stuetze05[0] === soll05[i][0] && z.stuetze05[1] === soll05[i][1] && z.stuetze07[0] === soll07[i][0] && z.stuetze07[1] === soll07[i][1], `BR-2 ${z.klasse}`));
// Achsabstand bei gleicher Breite nimmt mit μ_fi zu, Alternative mit größerer Breite hat kleineren Achsabstand
EC2_BRAND_MINDESTMASSE.forEach(z => { if (z.stuetze07Alt) gilt(z.stuetze07Alt[0] > z.stuetze07[0] && z.stuetze07Alt[1] < z.stuetze07[1], `BR-2 Alternative ${z.klasse}`); });

// BR-3: PP-Fasern als eine von mehreren Methoden, nicht „zwingend“
gilt(!brand.texte.achtungBeiHochfestemBeton.includes('zwingend') && brand.texte.achtungBeiHochfestemBeton.includes('Bewehrungsnetz') && brand.texte.achtungBeiHochfestemBeton.includes('Schutzschicht'), 'BR-3 Methoden');

// TS-1: Hinweis zur eingeschränkten Gültigkeit der Massekurve bei Hochlochziegeln
gilt(schall.daten['Schallschutz.schritte_2'][0].erklaerung.includes('nur eingeschränkt') && schallRechnung.texte.hinweisMassekurveHochlochziegel.includes('Prüfwerte'), 'TS-1 Hinweis');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Entscheidungen Tranche 3');
