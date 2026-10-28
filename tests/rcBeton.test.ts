// RC-Anteil im Ressourcen-Simulator nach DIN 1045-2:2023-08, Anhang E (Umsetzung 29.10.2026, T12-RE-1)
import { rcAufteilung, RC_HOECHSTANTEIL_GROB, GROBANTEIL_LEHRWERT } from '../src/calc/rcBeton';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol = 1e-9) => Math.abs(ist - soll) <= tol;
console.log('--- Test: RC-Gesteinskörnung ---');

// 1. Standardplatte 120 m³ (Tranche 12): 216 t Gesteinskörnung; RC = 216 · 0,70 · 0,45 = 68,04 t, primär 147,96 t (vorher 108/108 t)
const a = rcAufteilung(120, true);
pruefe(nahe(a.rezykliert, 68.04) && nahe(a.primaer, 147.96) && nahe(a.anteilGesamt, 0.315), `Platte ${a.rezykliert} ${a.primaer}`);
// 2. ohne RC: alles primär; Typ 2: 0,70 · 0,35 = 24,5 %
const b = rcAufteilung(120, false);
pruefe(nahe(b.primaer, 216) && b.rezykliert === 0, 'ohne RC');
pruefe(nahe(rcAufteilung(100, true, 'typ2').anteilGesamt, 0.245), 'Typ 2');
// 3. Grenzen: Höchstanteil 45 bzw. 35 % der groben Körnung, negative/NaN-Volumen → 0
pruefe(RC_HOECHSTANTEIL_GROB.typ1 === 0.45 && RC_HOECHSTANTEIL_GROB.typ2 === 0.35 && GROBANTEIL_LEHRWERT === 0.7, 'Konstanten');
pruefe(rcAufteilung(-5, true).primaer === 0 && rcAufteilung(NaN, true).rezykliert === 0, 'Randfälle');
// 4. Fuzz: Summe = 1,8 t/m³ · V, Anteil ≤ 45 %
let s = 3;
const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
for (let i = 0; i < 1000; i++) {
  const v = rnd() * 500, r = rcAufteilung(v, i % 2 === 0, i % 3 ? 'typ1' : 'typ2');
  pruefe(Number.isFinite(r.primaer) && nahe(r.primaer + r.rezykliert, 1.8 * v, 1e-9) && r.anteilGesamt <= 0.45, `Fuzz ${i}`);
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: RC-Gesteinskörnung');
