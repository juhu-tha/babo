// Gezielte Durchsicht Tranche A (29.10.2026, docs/pruefung/durchsicht-A-2026-10-29.md): Regressionstest für die
// behobenen Befunde DSA-* und die zentral übernommenen Kennwerte. Sollwerte von Hand nachgerechnet (Rechenweg in den
// Kommentaren), nicht aus den Kernen übernommen.
import fs from 'fs';
import {
  CONCRETE, E_SPANNSTAHL, SPANNSTAHL, RHO_1000, SPANNUNGSGRENZEN, sigmaPMax, sigmaPm0Grenze, relaxation,
  spanngliedDeckung, C_MIN_DUR_BETONSTAHL_NA, LITZE, DILEMMA_STAHL,
} from '../src/calc/spannbeton';
import { DECKUNG } from '../src/calc/bauwerksuntersuchung';
import { NORMATIVE_EXPOSURE_CLASSES } from '../src/modules/expositionsklassen/daten';
import { EC2_CONCRETE_CLASSES } from '../src/modules/betonkennwerte/daten';
import { LP_FESTIGKEITSVERLUST_JE_PROZENT } from '../src/calc/mischung';
import { BETONSTAHL, E_BETONSTAHL } from '../src/data/kennwerte';
import { schadensStufe, LOKALELEMENT } from '../src/calc/korrosion';
import spannDauer from '../content/spannbeton/SpannbetonDauerhaftigkeit.json';
import spannPrinz from '../content/spannbeton/SpannbetonPrinzipien.json';
import spann0100 from '../content/spannbeton/SpannbetonNullBisHundert.json';
import station6 from '../content/spannbeton/nullbishundert/Station6Nachweise.json';
import betonAZ from '../content/betonaz/BetonAZ.json';
import bkTabelle from '../content/betonkennwerte/TabelleTab.json';
import betonpraxis from '../content/betonpraxis/Betonpraxis.json';
import herstellung from '../content/herstellungeinbau/HerstellungEinbau.json';
import innovativ from '../content/innovativewerkstoffe/InnovativeWerkstoffe.json';
import konformitaet from '../content/konformitaetskontrolle/Konformitaetskontrolle.json';
import sonderbetone from '../content/sonderbetone/Sonderbetone.json';
import wu from '../content/wubauwerke/WUBauwerke.json';
import metallkorrosion from '../content/metallkorrosion/Metallkorrosion.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const text = (o: unknown) => JSON.stringify(o);
const quelle = (p: string) => fs.readFileSync(p, 'utf8');

console.log('--- Test: Durchsicht Tranche A (29.10.2026) ---');

// DSA-SB-7: Spannstahl und Spannungsgrenzen zentral
pruefe('SB-7 E_p', E_SPANNSTAHL, 195000);
pruefe('SB-7 E_p wie Station 2', DILEMMA_STAHL.y1860.E, E_SPANNSTAHL);
pruefe('SB-7 σ_p,max Y1860', sigmaPMax(SPANNSTAHL.Y1860.fpk, SPANNSTAHL.Y1860.fp01k), 1440);   // min(0,8·1860 = 1488; 0,9·1600 = 1440)
pruefe('SB-7 σ_pm0 Y1860', sigmaPm0Grenze(SPANNSTAHL.Y1860.fpk, SPANNSTAHL.Y1860.fp01k), 1360); // min(0,75·1860 = 1395; 0,85·1600 = 1360)
pruefe('SB-7 σ_pm0 Y1770', sigmaPm0Grenze(SPANNSTAHL.Y1770.fpk, SPANNSTAHL.Y1770.fp01k), 1292); // min(1327,5; 0,85·1520 = 1292)
pruefe('SB-7 σ_p quasi-ständig', SPANNUNGSGRENZEN.spannstahlQuasiStaendig * 1860, 1209);        // 0,65·1860
pruefe('SB-7 ρ1000 Klasse 1/2/3', RHO_1000[1] + RHO_1000[2] + RHO_1000[3], 0.145);             // 8 + 2,5 + 4 %
// Relaxation unverändert (vor der Umstellung): σ_pi = 1300, f_pk = 1860, Klasse 2, 500 000 h
// μ = 0,6989; 0,66·2,5·e^(9,1·0,6989)·500^(0,75·0,3011)·1e-5 = 0,66·2,5·578,4·4,069·1e-5 = 0,03883 → 50,5 N/mm²
pruefe('SB-7 Relaxation Klasse 2', relaxation(1300, 1860, 2, 500000).delta_sigma_pr, 50.48, 1e-3);
pruefe('SB-7 Litze A_p', LITZE.Ap, 150);
for (const [datei, muster] of [
  ['src/modules/Spannbeton.tsx', /0\.75 \* steel\.fpk|0\.65 \* steel\.fpk|Ep: 195000/],
  ['src/modules/spannbeton/SpannbetonKennwerte.tsx', /alpha_p: 195000|groutStrandCount \* 150\b/],
  ['src/modules/spannbeton/SpannbetonPrinzipien.tsx', /=== "Y1860" \? 1860 : 1770|beamFctm = 3\.5/],
] as const) gilt(!muster.test(quelle(datei)), `SB-7 keine fest verdrahteten Spannstahlwerte mehr in ${datei}`);

// DSA-SB-1: Initialdehnung des Spannstahls wie in der Rechnung (σ_pm0 = 1360 N/mm²): 1360/195 000 = 6,97 ‰
const prinzTsx = quelle('src/modules/spannbeton/SpannbetonPrinzipien.tsx');
gilt(/\\frac\{1360\}\{195\\,000\} \\approx 6\{,\}97/.test(prinzTsx) && !/7\{,\}18/.test(prinzTsx), 'SB-1 ε_pm0 = 6,97 ‰');
pruefe('SB-1 Nachrechnung', (1360 / 195000) * 1000, 6.974, 1e-3);

// DSA-SB-2: c_min,dur nach Tab. 4.4DE wie die zentralen Daten
for (const k of ['XC1', 'XC3', 'XC4', 'XD1', 'XD3'] as const) pruefe(`SB-2 ${k} wie DECKUNG`, C_MIN_DUR_BETONSTAHL_NA[k], DECKUNG[k].min);
for (const k of ['XC1', 'XC2', 'XC3', 'XC4', 'XD1', 'XD2', 'XD3'] as const) {
  const z = NORMATIVE_EXPOSURE_CLASSES.find(c => c.code === k);
  gilt(!!z && z.minCoverDurMm === C_MIN_DUR_BETONSTAHL_NA[k], `SB-2 ${k} wie Expositionsklassen-Daten`);
}
// Brücke, nachträglicher Verbund, Hüllrohr 75 mm, XC4 + XD3, C45/55: c_min,dur = 40 + 5 + 10 − 5 = 50; c_min = max(75; 50) = 75; c_nom = 90
let d = spanngliedDeckung({ bauwerk: 'bruecke', verfahren: 'post_tensioned', huellrohrMm: 75, litzeMm: 15.7, xc: 'XC4', xd: 'XD3', betonklasse: 'C45/55' });
pruefe('SB-2 Standard c_min,dur', d.c_min_dur, 50); pruefe('SB-2 Standard c_nom', d.c_nom, 90);
// Hochbau, sofortiger Verbund, Litze 15,7 mm, XC3, XD0, C35/45: c_min,b = 31; c_min,dur = 20 + 10 = 30; c_nom = 31 + 15 = 46
d = spanngliedDeckung({ bauwerk: 'hochbau', verfahren: 'pre_tensioned', huellrohrMm: 75, litzeMm: 15.7, xc: 'XC3', xd: 'XD0', betonklasse: 'C35/45' });
pruefe('SB-2 Spannbett c_min,b', d.c_min_b, 31); pruefe('SB-2 Spannbett c_min,dur', d.c_min_dur, 30); pruefe('SB-2 Spannbett c_nom', d.c_nom, 46);
// Hochbau, ohne Verbund, XC1: c_min,dur = 10; c_min,b = round(1,5·15,7) = 24; Δc_dev = 10 → c_nom = 34
d = spanngliedDeckung({ bauwerk: 'hochbau', verfahren: 'unbonded', huellrohrMm: 75, litzeMm: 15.7, xc: 'XC1', xd: 'XD0', betonklasse: 'C30/37' });
pruefe('SB-2 Monolitze c_nom', d.c_nom, 34);
gilt(/Tab\. 4\.4DE/.test(spannDauer.texte.dauerhaftigkeitCMinDur) && /vorläufig, Normprüfung ausstehend/.test(spannDauer.texte.dauerhaftigkeitCMinDur), 'SB-2 Text nennt Tab. 4.4DE und Kennzeichnung');

// DSA-SB-3 … SB-6: Fließtext
gilt(/8–11 %/.test(spann0100.texte.betonBesitztEineHohe), 'SB-3 f_ctm/f_ck 8–11 % (2,2/20 = 11 %, 4,1/50 = 8 %)');
gilt(/0\{,\}80\\\\dots 0\{,\}90/.test(text(station6.texte.esIstStetsZwischen)), 'SB-4 P∞ ≈ 0,80 … 0,90 P_m0');
gilt(!/25-mm-Radialzone|25-mm-Radius/.test(text(spannPrinz)), 'SB-5 Schutzbereich nach NA DE');
gilt(/vorläufig, Normprüfung ausstehend/.test(spannPrinz.texte.koppelfugenMüssenInBauteillängsrichtung), 'SB-6 Koppelstellen gekennzeichnet');

// DSA-BAZ-1, DSA-WU-1: Konsistenzbezeichnungen nach DIN EN 206 (F4 sehr weich, F5 fließfähig, F6 sehr fließfähig)
gilt(/Fließfähig \(F5\) \/ sehr fließfähig \(F6\)/.test(betonAZ.texte.fließfähigSelbstverdichtenderBetonSvb), 'BAZ-1 F5/F6');
gilt(wu.texte.f3BisF4Weich === 'F3 bis F4 (weich bis sehr weich)', 'WU-1 F3/F4');

// DSA-BK-1: Tab. 3.1 umfasst 14 Klassen bis C90/105; Tabellen der Module identisch mit CONCRETE
gilt(/14 Betonfestigkeitsklassen/.test(bkTabelle.texte.vergleichendeÜbersichtAller15), 'BK-1 Klassenzahl');
for (const k of EC2_CONCRETE_CLASSES) {
  const c = CONCRETE[k.name];
  if (!c) { gilt(k.name === 'C100/115', `BK-1 ${k.name} fehlt zentral`); continue; }
  gilt(k.fck === c.fck && k.fckCube === c.fck_cube && k.fctm === c.fctm && k.Ecm * 1000 === c.Ecm && k.epsCu2 === c.eps_cu2 && k.n === c.n, `BK-1 Betonkennwerte ${k.name} wie CONCRETE`);
}
const festbeton = quelle('src/modules/Festbeton.tsx');
for (const m of festbeton.matchAll(/\{ name: '(C\d+\/\d+)', fck_cyl: (\d+), fck_cube: (\d+), fcm: (\d+), fctm: ([\d.]+), fctk_005: ([\d.]+), fctk_095: ([\d.]+), Ecm: (\d+)/g)) {
  const c = CONCRETE[m[1]];
  if (!c) continue; // C8/10 und C100/115 sind Lehrwerte
  gilt(+m[2] === c.fck && +m[3] === c.fck_cube && +m[4] === c.fcm && +m[5] === c.fctm && +m[6] === c.fctk_005 && +m[7] === c.fctk_095 && +m[8] * 1000 === c.Ecm, `Festbeton ${m[1]} wie CONCRETE`);
}

// DSA-BP-1 … BP-3: Betonpraxis
pruefe('BP-1 Luft 1 Vol.-% bei C30/37', (LP_FESTIGKEITSVERLUST_JE_PROZENT / 100) * CONCRETE['C30/37'].fcm, 1.9); // 5 % · 38
gilt(!/airAddition \* 2;/.test(quelle('src/modules/Betonpraxis.tsx')), 'BP-1 kein fester Wert −2 N/mm² je Vol.-%');
gilt(/rund 7 N\/mm²/.test(betonpraxis.texte.druckfestigkeitFälltUm8), 'BP-2 Wasserzugabe 20 l: 20/10 · 3,5 = 7 N/mm²');
gilt(/> 0,31 bis 0,34/.test(betonpraxis.werte.mäßigeWasseranreicherungObenNormal) && /> 0,34/.test(betonpraxis.werte.deutlichesBlutenLäuftStark), 'BP-3 Klassengrenzen wie Rechnung');

// DSA-HE-1: Silikastaub anrechenbar (k = 1,0) wie in der Mischungsberechnung
gilt(/Silikastaub darf nach DIN 1045-2:2023-08 mit k = 1,0/.test(text(herstellung)) && !/ist nur Flugasche anrechenbar/.test(text(herstellung)), 'HE-1 k-Wert Silikastaub');

// DSA-IW-1: UHPC und Carbon im Modul einheitlich
gilt(!/150 bis 230|bis über 250|3000 bis 4500/.test(text(innovativ)), 'IW-1 einheitliche Spannen');
pruefe('IW Suiker 7,837/12', 7.837 / 12, 0.653, 1e-3);

// DSA-QS-1: Konformität Szenario 2, 15 Würfel C30/37 (Mittel 41,64; s = 1,77; Soll 37 + 1,48 · 3,0 = 41,44)
const v15 = [41.5, 43.0, 39.5, 42.1, 40.8, 44.5, 38.9, 41.2, 43.1, 40.5, 42.0, 44.8, 39.2, 41.0, 42.5];
const m15 = v15.reduce((a, b) => a + b, 0) / 15;
const s15 = Math.sqrt(v15.reduce((a, v) => a + (v - m15) ** 2, 0) / 14);
pruefe('QS-1 Mittel', m15, 41.64, 1e-3); pruefe('QS-1 s', s15, 1.77, 2e-3);
gilt(/41,64/.test(konformitaet.texte.n15Mittel41) && /1,77/.test(konformitaet.texte.würfelDieStandardabweichungBeträgt), 'QS-1 Text');

// DSA-SO-1, SO-2: Infraleichtbeton U-Wert, Bohrpfahl-Zementgehalt
pruefe('SO-1 U(50 cm, λ = 0,12)', 1 / (0.17 + 0.5 / 0.12), 0.2308, 1e-3);
pruefe('SO-1 U(50 cm, λ = 0,18)', 1 / (0.17 + 0.5 / 0.18), 0.3390, 1e-3);
gilt(!/U-Wert < 0,24/.test(text(sonderbetone)), 'SO-1 U-Wert-Aussage korrigiert');
gilt(/325 kg\/m³ im Trockenen, 375 kg\/m³ unter Wasser/.test(text(sonderbetone)), 'SO-2 Mindestzementgehalt nach Einbauverfahren');

// DSA-CB: Betonstahl in der Carbonbeton-Kurve zentral (f_yk = 500, E_s = 200 000, f_tk = 540 bei ε_uk = 50 ‰)
pruefe('CB ε_y B500B [‰]', (BETONSTAHL.B500B.fyk / E_BETONSTAHL) * 1000, 2.5);
gilt(!/500 \/ 200000|\* 200000\)/.test(quelle('src/modules/Carbonbeton.tsx')), 'CB keine fest verdrahteten Stahlwerte');

// DSA-KO: Schadensstufen der Korrosionsgrafik aus dem Kern (0,7 / 1,5 / 2,8 · f_ctm)
gilt(schadensStufe(true, 2.8 * LOKALELEMENT.fctm) === 'abplatzung' && schadensStufe(true, 1.0 * LOKALELEMENT.fctm) === 'rissbildung', 'KO Schadensstufen');
gilt(!/fctm \* 2\.8|fctm \* 0\.7 &&|fctm \* 1\.5 &&/.test(quelle('src/modules/Korrosion.tsx')), 'KO keine eigenen Schwellen in der Grafik');

// DSA-MK-1: Rostvolumen im Modul Metallkorrosion wie Korrosion (2- bis 6-fach)
gilt(/2- bis 6-fache Volumen/.test(metallkorrosion.texte.volumendehnungseffektBauteilsprengungRos), 'MK-1 Rostvolumen');

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log('OK: Durchsicht Tranche A');
