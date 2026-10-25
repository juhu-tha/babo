// Rechenkern Sortierbilanz Altholz (AP 6.2 c, Modul „Altholz-NIR-Sortierung und Urban Mining“)
import { sortierbilanz, ALTHOLZ_KATEGORIEN, type AltholzEingabe } from '../src/calc/altholz';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol = 1e-12) => Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll));
console.log('--- Test: Altholz-Sortierbilanz ---');

// 1. Handrechnung (Beispiel im Modul): 100 t Eingang, A I 15 t, A II 45 t, A III 15 t, A IV 25 t;
//    Ausbringen 95 / 90 / 85 / 95 %
//    stofflich richtig: 0,95·15 + 0,90·45 = 14,25 + 40,5 = 54,75 t
//    Fremdstoff in stofflich: 0,15·15 + 0,05·25 = 2,25 + 1,25 = 3,5 t  → M_st = 58,25 t, M_en = 41,75 t
//    M_F = 0,75 + 4,5 + 2,25 + 1,25 = 8,75 t → q_F = 8,75 %
//    R_st = 54,75/58,25 = 0,93991; A-IV-Anteil = 1,25/58,25 = 0,021459; q_st = 54,75 %, q_st,max = 60 %
const basis: AltholzEingabe = {
  masse: { AI: 15, AII: 45, AIII: 15, AIV: 25 },
  ausbringen: { AI: 0.95, AII: 0.9, AIII: 0.85, AIV: 0.95 },
};
const a = sortierbilanz(basis);
pruefe(nahe(a.mIn, 100) && nahe(a.mSt, 58.25) && nahe(a.mEn, 41.75), `Massen ${a.mSt}/${a.mEn}`);
pruefe(nahe(a.mFehl, 8.75) && nahe(a.qFehl, 0.0875), `Fehlsortierung ${a.mFehl}`);
pruefe(nahe(a.reinheitSt, 54.75 / 58.25) && nahe(a.anteilAIVSt, 1.25 / 58.25), `Reinheit ${a.reinheitSt}`);
pruefe(nahe(a.qSt, 0.5475) && nahe(a.qStMax, 0.6), `Quote ${a.qSt}`);
pruefe(a.hinweise.some(h => h.stufe === 'warnung' && /A IV/.test(h.text)) && !a.hinweise.some(h => h.stufe === 'fehler'), 'A-IV-Warnung erwartet');

// 2. Ideale Sortierung: keine Fehlsortierung, Reinheit 1, q_st = q_st,max
const ideal = sortierbilanz({ ...basis, ausbringen: { AI: 1, AII: 1, AIII: 1, AIV: 1 } });
pruefe(nahe(ideal.mFehl, 0) && nahe(ideal.reinheitSt, 1) && nahe(ideal.qSt, ideal.qStMax) && ideal.anteilAIVSt === 0 && ideal.hinweise.length === 0, 'ideale Sortierung');
// Keine Sortierung (Ausbringen 0): alles in der „falschen“ Linie
const null0 = sortierbilanz({ ...basis, ausbringen: { AI: 0, AII: 0, AIII: 0, AIV: 0 } });
pruefe(nahe(null0.mSt, 40) && nahe(null0.qSt, 0) && nahe(null0.qFehl, 1), 'Ausbringen 0');

// 3. Unabhängige Referenzen: Massenerhaltung und Linearität in der Masse (Fuzz)
let zufall = 4711;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
let gueltig = 0;
for (let i = 0; i < 1000; i++) {
  const e: AltholzEingabe = {
    masse: { AI: rnd() * 60 - 3, AII: rnd() * 60, AIII: rnd() * 40, AIV: rnd() * 60 },
    ausbringen: { AI: rnd() * 1.1 - 0.02, AII: rnd(), AIII: rnd(), AIV: rnd() },
  };
  const r = sortierbilanz(e);
  if (r.hinweise.some(h => h.stufe === 'fehler')) { pruefe(Number.isNaN(r.mSt), `Fuzz ${i}: Fehler ohne NaN`); continue; }
  gueltig++;
  pruefe(nahe(r.mSt + r.mEn, r.mIn, 1e-9), `Fuzz ${i}: Massenbilanz`);
  const summeStroeme = r.stroeme.reduce((s, x) => s + x.inStofflich + x.inEnergetisch, 0);
  pruefe(nahe(summeStroeme, r.mIn, 1e-9), `Fuzz ${i}: Ströme`);
  pruefe(r.qSt <= r.qStMax + 1e-12 && r.qFehl >= 0 && r.qFehl <= 1 + 1e-12, `Fuzz ${i}: Quoten ${r.qSt}/${r.qStMax}`);
  // Verdopplung aller Massen ändert die Quoten nicht
  const d = sortierbilanz({ ...e, masse: Object.fromEntries(ALTHOLZ_KATEGORIEN.map(k => [k, 2 * e.masse[k]])) as AltholzEingabe['masse'] });
  pruefe(nahe(d.qSt, r.qSt, 1e-9) && nahe(d.qFehl, r.qFehl, 1e-9) && nahe(d.mSt, 2 * r.mSt, 1e-9), `Fuzz ${i}: Skalierung`);
}
pruefe(gueltig > 500, `Fuzz: nur ${gueltig} gültige Fälle`);

// 4. Fehler und Warnungen
pruefe(sortierbilanz({ ...basis, masse: { ...basis.masse, AI: -1 } }).hinweise.some(h => h.stufe === 'fehler' && h.feld === 'masse'), 'negative Masse → Fehler');
pruefe(sortierbilanz({ ...basis, ausbringen: { ...basis.ausbringen, AII: 1.2 } }).hinweise.some(h => h.stufe === 'fehler' && h.feld === 'ausbringen'), 'Ausbringen > 1 → Fehler');
pruefe(sortierbilanz({ masse: { AI: 0, AII: 0, AIII: 0, AIV: 0 }, ausbringen: basis.ausbringen }).hinweise.some(h => h.stufe === 'fehler'), 'Eingang 0 → Fehler');
pruefe(sortierbilanz({ ...basis, masse: { ...basis.masse, AIII: NaN } }).hinweise.some(h => h.stufe === 'fehler'), 'NaN → Fehler');
pruefe(sortierbilanz({ ...basis, ausbringen: { AI: 0.7, AII: 0.7, AIII: 0.7, AIV: 0.7 } }).hinweise.filter(h => h.stufe === 'warnung').length >= 2, 'schlechte Sortierung → Warnungen');
const nurAIV = sortierbilanz({ masse: { AI: 0, AII: 0, AIII: 0, AIV: 10 }, ausbringen: { AI: 1, AII: 1, AIII: 1, AIV: 1 } });
pruefe(nurAIV.mSt === 0 && Number.isNaN(nurAIV.reinheitSt) && nurAIV.hinweise.some(h => /leer/.test(h.text)), 'nur A IV → leere stoffliche Linie');

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Altholz-Sortierbilanz (${gueltig} gültige Fuzz-Fälle)`);
