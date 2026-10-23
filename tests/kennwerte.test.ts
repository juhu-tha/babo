// Zentrale Betonkennwerte (Umsetzungsplan Phase 0, AP 0.6)
import fs from 'fs';
import { BETON_EC2, fctmVonFck, betonNachKlasse, betonAuswahl } from '../src/data/kennwerte';

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

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: zentrale Betonkennwerte konsistent');
