// Rechenkern Baustatik (Umsetzungsplan Phase 4, AP 4.3)
import { dreigelenkrahmen, traeger, type TraegerEingabe } from '../src/calc/statik';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol = 1e-6) => Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll));
console.log('--- Test: Statik ---');

const nur = (p: Partial<TraegerEingabe>): TraegerEingabe => ({ system: 'einfeld', l: 10, l1: 5, q: 0, f: 0, a: 0, m0: 0, am: 0, ...p });

// 1. Tabellenwerte: Einfeldträger max M = ql²/8, Kragarm M_A = −ql²/2, Zweifeldträger gleiche Felder M_B = −ql²/8 (l = Feldlänge)
pruefe(nahe(traeger(nur({ q: 10 })).M(5), 125), 'ql²/8');
pruefe(nahe(traeger(nur({ system: 'kragarm', q: 10 })).MA, -500), '−ql²/2');
const zf = traeger(nur({ system: 'zweifeld', l: 12, l1: 6, q: 10 }));
pruefe(nahe(zf.MB, -45) && nahe(zf.M(6), -45, 1e-3) && nahe(zf.A, 22.5) && nahe(zf.B, 75), `Zweifeld: M_B ${zf.MB}, A ${zf.A}, B ${zf.B}`);
// Einzellast in Feldmitte: M = Fl/4
pruefe(nahe(traeger(nur({ f: 20, a: 5 })).M(5), 50), 'Fl/4');

// 2. Gleichgewicht und Randbedingungen für alle Systeme und Laststellungen
for (const system of ['einfeld', 'kragarm', 'zweifeld'] as const) {
  for (const [a, am] of [[2, 7], [7, 2], [5, 5], [0, 10]]) {
    const e = nur({ system, l: 10, l1: 4, q: 8, f: 30, a, m0: 15, am });
    const r = traeger(e);
    // ΣV = 0
    pruefe(nahe(r.A + r.B + r.C, e.q * e.l + e.f), `${system} a=${a}: ΣV`);
    // freies bzw. gelenkiges Ende: M(l) = 0
    pruefe(nahe(r.M(e.l + 1e-12), 0, 1e-6), `${system} a=${a}, am=${am}: M(l) = ${r.M(e.l + 1e-12)}`);
  }
}

// 3. Unabhängige Kontrolle Zweifeldträger: Verträglichkeit (Arbeitssatz) – M_B = −∫M0·m̄ dx / ∫m̄² dx
//    mit M0 = Momente der beiden Einfeldträger und m̄ = Dreieck mit 1 am Mittelauflager
function mbArbeitssatz(e: TraegerEingabe): number {
  const L1 = e.l1, L2 = e.l - e.l1, n = 20000;
  const ein = (l0: number, x0: number) => {
    const fIn = e.a > x0 && e.a <= x0 + l0 || (x0 === 0 && e.a === 0);
    const mIn = e.am > x0 && e.am <= x0 + l0 || (x0 === 0 && e.am === 0);
    return traeger({ ...e, system: 'einfeld', l: l0, l1: 0, f: fIn ? e.f : 0, a: fIn ? e.a - x0 : 0, m0: mIn ? e.m0 : 0, am: mIn ? e.am - x0 : 0 });
  };
  const s1 = ein(L1, 0), s2 = ein(L2, L1);
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    const x = ((i + 0.5) / n) * e.l, dx = e.l / n;
    const M0 = x <= L1 ? s1.M(x) : s2.M(x - L1);
    const m = x <= L1 ? x / L1 : (e.l - x) / L2;
    num += M0 * m * dx; den += m * m * dx;
  }
  return -num / den;
}
for (const [l1, a, am] of [[4, 2, 7], [6, 8, 1], [3, 3.5, 9]]) {
  const e = nur({ system: 'zweifeld', l: 10, l1, q: 8, f: 30, a, m0: 15, am });
  const ist = traeger(e).MB, soll = mbArbeitssatz(e);
  pruefe(Math.abs(ist - soll) < 1e-3 * Math.max(1, Math.abs(soll)), `M_B l1=${l1}, a=${a}, am=${am}: Clapeyron ${ist.toFixed(4)} vs Arbeitssatz ${soll.toFixed(4)}`);
}

// 4. Dreigelenkrahmen: Gelenkbedingung M_C = 0 und Gleichgewicht
const r = dreigelenkrahmen(4, 6, 10, 20);
pruefe(nahe(r.Av + r.Bv, 60) && nahe(r.Ah + r.Bh, 20), 'Rahmen ΣV, ΣH');
const Mc = r.Bv * 3 - r.Bh * 4 - (10 * 3 * 3) / 2;
pruefe(nahe(Mc, 0), `Gelenk M_C = ${Mc}`);

// 5. Unsinnige Eingaben
for (const u of [{ l: 0 }, { a: 12 }, { system: 'zweifeld' as const, l1: 0 }, { system: 'zweifeld' as const, l1: 10 }, { q: NaN }]) {
  pruefe(traeger(nur(u)).hinweise.some(x => x.stufe === 'fehler'), JSON.stringify(u));
}
pruefe(dreigelenkrahmen(0, 6, 10, 20).hinweise.length > 0, 'Rahmen h = 0');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Statik');
