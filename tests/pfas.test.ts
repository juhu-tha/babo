// Rechenkern Summenbewertung PFAS-20 / PFAS-4 (AP 6.2 d, Modul „PFAS in Baustoffen“)
import { pfasSummenbewertung, ersatzwert, PFAS20, PFAS4, PFAS_GRENZWERTE, type PfasEingabe, type PfasId } from '../src/calc/pfas';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol = 1e-12) => Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll));
console.log('--- Test: PFAS-Summenbewertung ---');

// 0. Stofflisten: 20 verschiedene Stoffe, je 10 Carbon- und Sulfonsäuren C4–C13; PFAS-4 ⊂ PFAS-20
pruefe(PFAS20.length === 20 && new Set(PFAS20.map(s => s.id)).size === 20, 'PFAS-20: 20 Stoffe');
for (const g of ['Carbonsäure', 'Sulfonsäure']) {
  const c = PFAS20.filter(s => s.gruppe === g).map(s => s.c).sort((x, y) => x - y);
  pruefe(c.join(',') === '4,5,6,7,8,9,10,11,12,13', `${g}: Kettenlängen ${c.join(',')}`);
}
pruefe(PFAS4.length === 4 && PFAS4.every(id => PFAS20.some(s => s.id === id)), 'PFAS-4 ⊂ PFAS-20');
pruefe(PFAS_GRENZWERTE.pfas20 === 100 && PFAS_GRENZWERTE.pfas4 === 20, 'Grenzwerte 100/20 ng/l');

// 1. Handrechnung (Beispiel im Modul): BG = 1 ng/l, 11 Stoffe < BG
//    gemessen: PFBA 12, PFPeA 8, PFHxA 15, PFHpA 4, PFOA 9, PFNA 2, PFBS 10, PFHxS 6, PFOS 11 → Σ = 77 ng/l
//    Ansatz BG/2: 77 + 11·0,5 = 82,5 ng/l → η20 = 0,825; Schranken 77 … 88 ng/l (eindeutig ≤ 100)
//    PFAS-4 = 9 + 2 + 6 + 11 = 28 ng/l → η4 = 1,4 (überschritten, eindeutig)
const gemessen: Partial<Record<PfasId, number | null>> = { PFBA: 12, PFPeA: 8, PFHxA: 15, PFHpA: 4, PFOA: 9, PFNA: 2, PFBS: 10, PFHxS: 6, PFOS: 11 };
const werte: Partial<Record<PfasId, number | null>> = Object.fromEntries(PFAS20.map(s => [s.id, gemessen[s.id] ?? null]));
const basis: PfasEingabe = { werte, bg: 1, ansatz: 'halb' };
const a = pfasSummenbewertung(basis);
pruefe(nahe(a.pfas20.summe, 82.5) && nahe(a.pfas20.unten, 77) && nahe(a.pfas20.oben, 88) && a.pfas20.nKleinerBg === 11, `Σ20 ${a.pfas20.summe}`);
pruefe(nahe(a.pfas20.eta, 0.825) && a.pfas20.ok && !a.pfas20.uneindeutig, `η20 ${a.pfas20.eta}`);
pruefe(nahe(a.pfas4.summe, 28) && nahe(a.pfas4.eta, 1.4) && !a.pfas4.ok && a.pfas4.nKleinerBg === 0, `Σ4 ${a.pfas4.summe}`);
// kurzkettig (OECD/UBA): Carbonsäuren C4–C7 = 12+8+15+4 = 39; Sulfonsäuren nur C4–C5: PFBS 10, PFPeS <BG (0,5) → 10,5;
// Σ = 49,5 (PFHxS und PFHpS sind langkettig; NS5C-PF-1, vorher 56 mit Sulfonsäuren bis C7)
pruefe(nahe(a.anteilKurzkettig, 49.5 / 82.5), `kurzkettig ${a.anteilKurzkettig}`);
pruefe(!a.hinweise.some(h => h.stufe === 'fehler'), 'keine Fehler');

// 2. Ansätze für < BG
pruefe(ersatzwert(2, 'null') === 0 && ersatzwert(2, 'halb') === 1 && ersatzwert(2, 'voll') === 2, 'Ersatzwerte');
pruefe(nahe(pfasSummenbewertung({ ...basis, ansatz: 'null' }).pfas20.summe, 77), 'Ansatz 0');
pruefe(nahe(pfasSummenbewertung({ ...basis, ansatz: 'voll' }).pfas20.summe, 88), 'Ansatz BG');

// 3. Uneindeutige Bewertung: Σ gemessen 95 ng/l, 10 Stoffe < BG mit BG = 2 ng/l → Schranken 95 … 115
const knapp: Partial<Record<PfasId, number | null>> = Object.fromEntries(PFAS20.map((s, i) => [s.id, i < 10 ? 9.5 : null]));
const k = pfasSummenbewertung({ werte: knapp, bg: 2, ansatz: 'null' });
pruefe(nahe(k.pfas20.unten, 95) && nahe(k.pfas20.oben, 115) && k.pfas20.uneindeutig && k.pfas20.ok, 'uneindeutig, Ansatz 0 → ok');
pruefe(!pfasSummenbewertung({ werte: knapp, bg: 2, ansatz: 'voll' }).pfas20.ok, 'uneindeutig, Ansatz BG → überschritten');
pruefe(k.hinweise.some(h => h.stufe === 'warnung' && h.feld === 'ansatz'), 'Warnung uneindeutig');

// 4. Unabhängige Referenz (Fuzz): Summe gleich der direkten Summation; unten ≤ summe ≤ oben; Monotonie im Ansatz
let zufall = 2026;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
let gueltig = 0;
for (let i = 0; i < 1000; i++) {
  const bg = rnd() * 12 - 0.5;
  const w: Partial<Record<PfasId, number | null>> = Object.fromEntries(PFAS20.map(s => [s.id, rnd() < 0.4 ? null : rnd() * 60 - 2]));
  const ansatz = (['null', 'halb', 'voll'] as const)[Math.floor(rnd() * 3)];
  const r = pfasSummenbewertung({ werte: w, bg, ansatz });
  if (r.hinweise.some(h => h.stufe === 'fehler')) { pruefe(Number.isNaN(r.pfas20.summe), `Fuzz ${i}: Fehler ohne NaN`); continue; }
  gueltig++;
  const direkt = PFAS20.reduce((s, x) => s + (w[x.id] ?? ersatzwert(bg, ansatz)), 0);
  const direkt4 = PFAS4.reduce((s, x) => s + (w[x] ?? ersatzwert(bg, ansatz)), 0);
  pruefe(nahe(r.pfas20.summe, direkt, 1e-9) && nahe(r.pfas4.summe, direkt4, 1e-9), `Fuzz ${i}: Summe`);
  pruefe(r.pfas20.unten <= r.pfas20.summe + 1e-9 && r.pfas20.summe <= r.pfas20.oben + 1e-9 && r.pfas4.summe <= r.pfas20.summe + 1e-9, `Fuzz ${i}: Schranken`);
  pruefe(r.anteilKurzkettig >= 0 && r.anteilKurzkettig <= 1 + 1e-12, `Fuzz ${i}: Anteil`);
}
pruefe(gueltig > 300, `Fuzz: nur ${gueltig} gültige Fälle`);

// 5. Fehler und Warnungen
pruefe(pfasSummenbewertung({ ...basis, werte: { ...werte, PFOS: -3 } }).hinweise.some(h => h.stufe === 'fehler' && h.feld === 'werte'), 'negativ → Fehler');
pruefe(pfasSummenbewertung({ ...basis, bg: 0 }).hinweise.some(h => h.stufe === 'fehler' && h.feld === 'bg'), 'BG 0 → Fehler');
pruefe(pfasSummenbewertung({ ...basis, werte: { ...werte, PFOA: NaN } }).hinweise.some(h => h.stufe === 'fehler'), 'NaN → Fehler');
pruefe(pfasSummenbewertung({ ...basis, bg: 15 }).hinweise.some(h => h.stufe === 'warnung' && h.feld === 'bg'), 'BG groß → Warnung');
pruefe(pfasSummenbewertung({ ...basis, werte: { ...werte, PFOS: 25000 } }).hinweise.some(h => h.stufe === 'warnung' && /Altlasten/.test(h.text)), 'Altlastniveau → Warnung');
pruefe(pfasSummenbewertung({ ...basis, werte: { ...werte, PFOS: 0.4 } }).hinweise.some(h => h.stufe === 'warnung' && /unter der Bestimmungsgrenze/.test(h.text)), 'Wert < BG → Warnung');

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: PFAS-Summenbewertung (${gueltig} gültige Fuzz-Fälle)`);
