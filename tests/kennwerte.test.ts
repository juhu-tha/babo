// Zentrale Betonkennwerte (Umsetzungsplan Phase 0, AP 0.6)
import fs from 'fs';
import { BETON_EC2, fctmVonFck, betonNachKlasse, betonAuswahl, BAUSTAHL_EC3, E_BAUSTAHL, BETONSTAHL, E_BETONSTAHL } from '../src/data/kennwerte';
import { STAHLGUETEN, EC3_NA_DE } from '../src/calc/stahlbau';
import { betonstahlParameter, STAHL_E } from '../src/calc/werkstoffmodelle';
import { steelGrades, extendedSteelGrades, steelCurveDefinitions } from '../src/modules/stahl/daten';
import { MATERIALIEN } from '../src/modules/mechanischekenngroessen/daten';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Zentrale Kennwerte ---');

// 1. fctm: Tabellenwerte und Formel nach EC2 Tab. 3.1
pruefe(fctmVonFck(30) === 2.9, 'fctm(C30/37) = 2,9');
pruefe(Math.abs(fctmVonFck(32) - 0.3 * Math.pow(32, 2 / 3)) < 1e-9, 'fctm(32) aus Formel ≤ C50/60');
pruefe(Math.abs(fctmVonFck(53) - 2.12 * Math.log(1 + 61 / 10)) < 1e-9, 'fctm(53) aus Formel > C50/60');
pruefe(betonNachKlasse('C30/37')?.Ecm === 33000, 'Ecm(C30/37) = 33 000 MPa');
let geworfen = false; try { betonAuswahl(['C31/38']); } catch { geworfen = true; }
pruefe(geworfen, 'Unbekannte Klasse wird abgewiesen');

// 2. Die verbleibende Lehrtabelle in Festbeton.tsx stimmt mit EC2 Tab. 3.1 überein
const fb = fs.readFileSync('src/modules/Festbeton.tsx', 'utf8');
for (const m of fb.matchAll(/name: '(C\d+\/\d+)', fck_cyl: (\d+), fck_cube: (\d+), fcm: (\d+), fctm: ([\d.]+), fctk_005: ([\d.]+), fctk_095: ([\d.]+), Ecm: (\d+)/g)) {
  const c = BETON_EC2[m[1]];
  if (!c) continue; // z. B. C8/10 (nicht in EC2 Tab. 3.1)
  const ist = [Number(m[2]), Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6]), Number(m[7]), Number(m[8]) * 1000];
  const soll = [c.fck, c.fck_cube, c.fcm, c.fctm, c.fctk_005, c.fctk_095, c.Ecm];
  pruefe(ist.every((v, i) => v === soll[i]), `Festbeton.tsx ${m[1]}: ${ist.join('/')} ≠ EC2 ${soll.join('/')}`);
}

// 3. Keine neuen lokalen fctm-Tabellen in Rechnern
for (const f of ['Biegebemessung', 'Querkraftbemessung', 'HydratationRissberechnung', 'Baustoffkenngroessen', 'stahlbeton/StahlbetonNullBisHundert']) {
  const s = fs.readFileSync(`src/modules/${f}.tsx`, 'utf8');
  pruefe(!/fctm:\s*\d/.test(s) && !/CONCRETE_FCTM/.test(s), `${f}.tsx enthält wieder eine lokale fctm-Tabelle`);
}

// 4. Stahlkennwerte (Runde 4, Entscheidung Prof. Huber: Normwerte vereinheitlichen)
//    EN 1993-1-1 Tab. 3.1, t ≤ 40 mm (öffentlich: eurocodeapplied.com „Steel design properties“): S355 f_y = 355, f_u = 490;
//    E = 210 000 (3.2.6). Betonstahl: E_s = 200 000 (EC2 3.2.7(4)), k ≥ 1,05/1,08, ε_uk ≥ 25/50 ‰ (EC2 Anhang C, Tab. C.1).
pruefe(BAUSTAHL_EC3.S355.fu === 490 && BAUSTAHL_EC3.S355.fy === 355 && BAUSTAHL_EC3.S235.fu === 360 && BAUSTAHL_EC3.S460.fu === 540, 'Baustahl EN 1993-1-1 Tab. 3.1');
pruefe(E_BAUSTAHL === 210000 && E_BETONSTAHL === 200000, 'E-Moduln Baustahl/Betonstahl');
for (const b of Object.values(BETONSTAHL)) pruefe(Math.abs(b.ftk - b.k * b.fyk) < 1e-9, `f_tk = k·f_yk (${b.ftk})`);
pruefe(BETONSTAHL.B500B.ftk === 540 && BETONSTAHL.B500A.ftk === 525 && BETONSTAHL.B500B.euk === 50 && BETONSTAHL.B500A.euk === 25, 'B500A/B500B');
// alle Verwender lesen dieselben Werte
pruefe(STAHLGUETEN.S355.fu === 490 && EC3_NA_DE.E === E_BAUSTAHL && STAHL_E === E_BAUSTAHL, 'stahlbau.ts / werkstoffmodelle.ts');
const bB = betonstahlParameter('B500B'), bA = betonstahlParameter('B500A');
pruefe(bB.E === 200000 && bB.fu === 540 && bB.k === 1.08 && bA.fu === 525 && bA.eu === 25, 'betonstahlParameter');
pruefe(steelGrades.S355.fu === 490 && steelGrades.B500B.fu === 540 && steelGrades.B500A.fu === 525, 'stahl/daten.ts steelGrades');
for (const g of extendedSteelGrades) {
  if (g.id === 'S355' || g.id === 'Corten') pruefe(g.fu === 490, `extendedSteelGrades ${g.id}: f_u ${g.fu}`);
  if (g.id === 'B500B') pruefe(g.fu === 540, `extendedSteelGrades B500B: f_tk ${g.fu}`);
}
for (const c of steelCurveDefinitions) {
  if (c.id === 'S355') pruefe(c.fu === 490 && c.E === 210000, `Kennlinie S355: f_u ${c.fu}`);
  if (c.id === 'B500B' || c.id === 'B500A') pruefe(c.E === 200000 && c.fu === BETONSTAHL[c.id].ftk, `Kennlinie ${c.id}: E ${c.E}, f_t ${c.fu}`);
}
pruefe(MATERIALIEN.s355.fu === 490, 'mechanischekenngroessen S355');
// keine neuen abweichenden Literale für S355 f_u bzw. B500 E_s/f_tk in den umgestellten Dateien
for (const f of ['src/modules/stahl/daten.ts', 'src/modules/mechanischekenngroessen/daten.ts', 'src/components/labor/UniversalPruefstand.tsx', 'src/calc/stahlbau.ts', 'src/calc/werkstoffmodelle.ts']) {
  const s = fs.readFileSync(f, 'utf8');
  pruefe(!/fy:\s*355,\s*fu:\s*(470|510)/.test(s) && !/fu:\s*(470|510|550|560),/.test(s) && !/E:\s*205000,\s*\n\s*fy:\s*500/.test(s), `${f}: abweichende Stahlkennwerte`);
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: zentrale Beton- und Stahlkennwerte konsistent');
