// Auswertehilfen virtuelle Versuche (src/calc/laborVersuch.ts): Höchstwert statt letztem Messwert, glatte Achsen,
// Spaltzugfestigkeit nach DIN EN 12390-6, Ausbreitmaß aus d1/d2 (Befund 28.10.2026: Ergebnis 0,00 MPa nach dem Bruch)
import { hoechstwert, schoeneAchse, spaltzugfestigkeit, spaltkraft, ausbreitDurchmesser } from '../src/calc/laborVersuch';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Auswertung virtuelle Versuche ---');

// 1. Regression Spaltzug: Kurve steigt, bricht und fällt auf 0 – Ergebnis ist der Höchstwert, nicht der letzte Punkt
const kurve = [
  { x: 0, y: 0 }, { x: 0.02, y: 1.1 }, { x: 0.05, y: 2.8 }, { x: 0.08, y: 3.22 }, { x: 0.085, y: 1.2 }, { x: 0.09, y: 0 }, { x: 0.1, y: 0 },
];
const h = hoechstwert(kurve);
pruefe(h.y === 3.22 && h.index === 3 && h.x === 0.08, `Höchstwert ${JSON.stringify(h)}`);
pruefe(kurve[kurve.length - 1].y === 0 && h.y > 0, 'letzter Wert 0, Höchstwert > 0');
// Gleichstand → erster Punkt; leer → Index −1; NaN wird übergangen
pruefe(hoechstwert([{ x: 1, y: 5 }, { x: 2, y: 5 }]).x === 1, 'Gleichstand: erster Punkt');
const leer = hoechstwert([]);
pruefe(leer.index === -1 && leer.y === 0, 'leere Reihe');
pruefe(hoechstwert([{ x: 0, y: NaN }, { x: 1, y: 2 }]).y === 2, 'NaN übergangen');
pruefe(hoechstwert([{ x: 0, y: -3 }, { x: 1, y: -1 }]).y === -1, 'nur negative Werte');

// 2. Spaltzug: C30/37, d = 150 mm, L = 300 mm, f_ct,sp = 3,22 N/mm² → F = 3,22·π·150·300/2000 = 227,61 kN
//    Rückrechnung 2·F/(π·L·d) muss wieder 3,22 ergeben (DIN EN 12390-6, Gleichung f_ct = 2F/(π·L·d))
const F = spaltkraft(3.22, 150, 300);
pruefe(nahe(F, 227.6084, 1e-3), `Spaltkraft ${F}`);
pruefe(nahe(spaltzugfestigkeit(F, 150, 300), 3.22, 1e-12), 'Rückrechnung f_ct,sp');
pruefe(spaltzugfestigkeit(100, 0, 300) === 0 && spaltzugfestigkeit(NaN, 150, 300) === 0, 'ungültige Geometrie → 0');

// 3. Glatte Achsen: krumme Höchstwerte aus dem Ist-Stand (56,3 / 4,02 / 3000,4 / 0,37 / 0,21 / 39,4)
const faelle: [number, number, number][] = [
  [56.25, 60, 10], [4.025, 5, 1], [3000.4, 4000, 1000], [2400, 2500, 500], [0.37, 0.4, 0.1], [0.207, 0.25, 0.05], [39.4, 40, 10], [45, 50, 10], [1, 1, 0.2],
];
for (const [ein, max, schritt] of faelle) {
  const a = schoeneAchse(ein);
  pruefe(a.max === max && a.schritt === schritt, `schoeneAchse(${ein}) = ${a.max}/${a.schritt}, erwartet ${max}/${schritt}`);
}
pruefe(schoeneAchse(0).max === 1 && schoeneAchse(-5).max === 1 && schoeneAchse(Infinity).max === 1, 'Randfälle Achse');

// 4. Ausbreitmaß: Mittel aus d1 und d2 bleibt f
for (const f of [200, 350, 487, 740]) {
  const { d1, d2 } = ausbreitDurchmesser(f);
  pruefe((d1 + d2) / 2 === f && d1 > d2, `Ausbreitmaß ${f}: ${d1}/${d2}`);
}
pruefe(ausbreitDurchmesser(0).d1 === 0, 'Ausbreitmaß 0');

// 5. Fuzz: 1 000 Zufallseingaben ohne NaN/∞; Achse ≥ Wert, Teilung ganzzahlig, höchstens 12 Teile
let s = 7;
const zufall = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
for (let i = 0; i < 1000; i++) {
  const w = Math.pow(10, zufall() * 12 - 6) * (1 + zufall());
  const a = schoeneAchse(w);
  const teile = a.max / a.schritt;
  pruefe(Number.isFinite(a.max) && a.max >= w * (1 - 1e-12) && Math.abs(teile - Math.round(teile)) < 1e-6 && teile <= 12, `Fuzz Achse ${w} → ${a.max}/${a.schritt}`);
  const pkt = Array.from({ length: 1 + Math.floor(zufall() * 20) }, () => ({ x: zufall(), y: zufall() * 100 - 10 }));
  const hw = hoechstwert(pkt);
  pruefe(Number.isFinite(hw.y) && pkt.every(p => p.y <= hw.y), 'Fuzz Höchstwert');
  const sp = spaltzugfestigkeit(zufall() * 500, 50 + zufall() * 150, 100 + zufall() * 200);
  pruefe(Number.isFinite(sp) && sp >= 0, 'Fuzz Spaltzug');
}

if (fehler.length) { fehler.slice(0, 20).forEach(f => console.log('FAIL', f)); process.exit(1); }
console.log('alle Prüfungen bestanden');
