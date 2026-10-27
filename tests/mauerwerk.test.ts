// Rechenkern Mauerwerk EC 6, vereinfachtes Verfahren DIN EN 1996-3/NA (Umsetzungsplan Phase 4, AP 4.7)
import {
  bemesseWandVereinfacht, phi1, phi2, rho2, fdAusFk, fkNA, fkEmpfehlungEN, phiAusmitte, FK_TAFEL_NA,
  type WandEingabe, type WandLage,
} from '../src/calc/mauerwerk';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Mauerwerk ---');

// 1. Herstellerbeispiel „Außenwand“: KS-Merkblatt „Bemessung von Mauerwerkswänden – Tragfähigkeitstafeln“
//    (BV Kalksandsteinindustrie), S. 3: KS XL SFK 12 (f_k = 9,4 N/mm²), t = 17,5 cm, h = 2,50 m, l_f = 6,00 m,
//    a/t = 1,0, unter Geschossdecke → Tafelwert T = 59, n_Rd = 59 · 9,4 = 555 kN/m (n_Ed = 500 kN/m, erfüllt).
//    Eigene Rechnung: Φ1 = 1,6 − 6/6 = 0,60 maßgebend; n_Rd = 0,60 · 175 · 0,85 · 9,4 / 1,5 = 559,3 kN/m (+0,8 %).
const fkXL12 = fkNA('KSXL-12-DM');
pruefe(fkXL12?.fk === 9.4, 'f_k KS XL 12 = 9,4');
const aw: WandEingabe = { lage: 'zwischen', h: 2.5, t: 175, a: 175, lf: 6.0, fk: fkXL12?.fk ?? NaN, nEd: 500 };
const r1 = bemesseWandVereinfacht(aw);
pruefe(nahe(r1.nRd, 555, 0.02), `Außenwand n_Rd ${r1.nRd} vs 555 kN/m (± 2 %)`);
pruefe(Math.floor(r1.tafelwert) === 59, `Außenwand Tafelwert ${r1.tafelwert} vs 59`);
pruefe(r1.massgebend === 'phi1' && nahe(r1.phi, 0.6, 1e-9) && r1.nachgewiesen, 'Außenwand Φ1 maßgebend, Nachweis erfüllt');

// 2. Herstellerbeispiel „Innenwand“ (gleiche Quelle, S. 3): KS XL SFK 20 (f_k = 12,9 N/mm²), t = 15,0 cm, h = 2,50 m
//    → T = 57, n_Rd = 735 kN/m (n_Ed = 625 kN/m). Eigene Rechnung: h_ef = 0,75 · 2,50 = 1,875 m; Φ2 = 0,85 − 0,0011 · 12,5²
//    = 0,678 maßgebend; n_Rd = 0,678 · 150 · 0,5667 · 12,9 = 743,6 kN/m (+1,2 %).
const iw = bemesseWandVereinfacht({ lage: 'innen', h: 2.5, t: 150, a: 150, lf: 5, fk: fkNA('KSXL-20-DM')?.fk ?? NaN, nEd: 625 });
pruefe(nahe(iw.nRd, 735, 0.02), `Innenwand n_Rd ${iw.nRd} vs 735 kN/m (± 2 %)`);
pruefe(iw.massgebend === 'phi2' && nahe(iw.hEf, 1.875, 1e-12) && Math.floor(iw.tafelwert) === 57, `Innenwand T ${iw.tafelwert}`);

// 3. Tragfähigkeitstafel (gleiche Quelle, S. 4; h = 2,50 m, n_Rd = T · f_k, Tafelwerte abgerundet).
//    Spaltenzuordnung aus dem Textauszug rekonstruiert: Innenwand | Außenwand a/t = 1 (l_f = 5,5 / 6,0 m) |
//    Außenwand a/t = 2/3 (l_f = 6,0 m) | Dachdecke a/t = 1. Bestätigt zugleich ρ2 = 0,75 / 0,90 / 1,00 und ρ2 = 1 bei a < t.
type Zeile = { t: number; innen: number; aw55?: number; aw60?: number; aw23: number; dach: number };
const tafel: Zeile[] = [
  { t: 150, innen: 57, aw60: 51, aw23: 22, dach: 28 },
  { t: 175, innen: 71, aw55: 67, aw60: 59, aw23: 33, dach: 33 },
  { t: 200, innen: 80, aw23: 44, dach: 37 },
  { t: 240, innen: 102, aw55: 92, aw60: 81, aw23: 60, dach: 45 },
  { t: 300, innen: 131, aw23: 83, dach: 56 },
];
const T = (lage: WandLage, t: number, a: number, lf: number) => bemesseWandVereinfacht({ lage, h: 2.5, t, a, lf, fk: 10, nEd: 0 }).tafelwert;
const tafelOk = (ist: number, soll: number, was: string) => pruefe(ist >= soll && ist < soll + 1, `Tafel ${was}: ${ist.toFixed(2)} vs ${soll}`);
for (const z of tafel) {
  tafelOk(T('innen', z.t, z.t, 5), z.innen, `t=${z.t} Innenwand`);
  if (z.aw55) tafelOk(T('zwischen', z.t, z.t, 5.5), z.aw55, `t=${z.t} l_f=5,5`);
  if (z.aw60) tafelOk(T('zwischen', z.t, z.t, 6.0), z.aw60, `t=${z.t} l_f=6,0`);
  tafelOk(T('zwischen', z.t, (2 / 3) * z.t, 6.0), z.aw23, `t=${z.t} a/t=2/3`);
  tafelOk(T('dach', z.t, z.t, 6.0), z.dach, `t=${z.t} Dachdecke`);
}

// 4. Softwarebeispiel mb AEC, mb-news 7/2013, S. 34–36, Pos. W4 (Außenwand): l = 11,58 m, l_f = 3,90 m, a = t = 17,5 cm,
//    h_ef = 1,97 m, f_k = 6,98 N/mm² → Φ = 0,71 (Φ2), N_Rd = 5693,9 kN, Ausnutzung 15,9 % bei N_Ed = 906,9 kN.
const w4 = bemesseWandVereinfacht({ lage: 'zwischen', h: 1.97 / 0.75, t: 175, a: 175, lf: 3.9, fk: 6.98, nEd: 906.9 / 11.58 });
pruefe(nahe(w4.nRd * 11.58, 5693.9, 0.02), `mb W4 N_Rd ${w4.nRd * 11.58} vs 5693,9 kN (± 2 %)`);
pruefe(nahe(w4.phi, 0.71, 0.01) && w4.massgebend === 'phi2' && nahe(w4.phi1, 0.9, 1e-12), `mb W4 Φ ${w4.phi}`);
pruefe(nahe(w4.eta, 0.159, 0.02), `mb W4 Ausnutzung ${w4.eta}`);

// 5. Einzelformeln und Randfälle
pruefe(nahe(phi1('zwischen', 4.5, 5, 1), 0.85, 1e-12), 'Φ1 = 1,6 − 4,5/6');
pruefe(nahe(phi1('zwischen', 4.5, 1.5, 1), 0.7, 1e-12), 'Φ1 = 1,6 − 4,5/5 für f_k < 1,8');
pruefe(phi1('zwischen', 6, 1.79, 1) < phi1('zwischen', 6, 1.8, 1), 'Φ1-Sprung bei f_k = 1,8');
pruefe(nahe(phi1('zwischen', 3, 5, 1), 0.9, 1e-12) && nahe(phi1('zwischen', 3, 5, 2 / 3), 0.6, 1e-12), 'Φ1 ≤ 0,9·a/t');
pruefe(phi1('dach', 3, 5, 1) === 0.333 && phi1('innen', 7, 5, 1) === 0.9, 'Φ1 Dachdecke / Innenwand');
pruefe(rho2(175, 1) === 0.75 && rho2(176, 1) === 0.9 && rho2(250, 1) === 0.9 && rho2(251, 1) === 1 && rho2(175, 0.9) === 1, 'ρ2-Stufen');
pruefe(nahe(phi2(2500, 300, 1), 0.85 - 0.0011 * (2500 / 300) ** 2, 1e-12), 'Φ2 Formel');
pruefe(nahe(fdAusFk(9.4), 0.85 * 9.4 / 1.5, 1e-12), 'f_d = ζ·f_k/γ_M');
pruefe(nahe(phiAusmitte(0.05, 0.24), 1 - 0.1 / 0.24, 1e-12) && phiAusmitte(0.12, 0.24) === 0 && phiAusmitte(0.2, 0.24) === 0, 'Φ_i = 1 − 2e/t, 0 ab e = t/2');
// EN-Empfehlung (Vergleich), Handrechnung src/data/tasks/bestandTasks.ts: 0,50 · 12^0,7 · 0,5^0,3 = 2,31 N/mm²
pruefe(nahe(fkEmpfehlungEN(0.5, 12, 0.5, 'NM', false), 2.31, 0.005), 'f_k EN-Empfehlung');
// NA-Tabellenwerte: Stichproben gegen die Quellen, keine doppelten IDs
pruefe(fkNA('KS-12-NMIIa')?.fk === 6.0 && fkNA('KSL-10-NMIIIa')?.fk === 5.6 && fkNA('HLZB-12-NMIIa')?.fk === 5.0, 'f_k Tafelstichproben');
pruefe(fkNA('KS-4-NMII') === null, 'unbekannte Kombination → null');
// Belegstatus (Abgleich 27.10.2026, docs/normwerte-belege.md): KS/KS L/KS XL nach KS-Themenheft Eurocode 6 (10/2012, S. 14),
// HLz B nach Lücking-Produkthandbuch 2026, S. 49 → belegt; KS P/KS L-P (Spaltenzuordnung Tafel 16) → vorläufig
pruefe(FK_TAFEL_NA.filter(e => e.vorlaeufig).every(e => e.id.startsWith('KSP-') || e.id.startsWith('KSLP-')), 'nur KS P/KS L-P vorläufig');
pruefe(fkNA('KSXL-28-DM')?.vorlaeufig === false && fkNA('HLZB-12-LM36')?.vorlaeufig === false && fkNA('KSP-12-DM')?.vorlaeufig === true, 'Belegstatus f_k');
pruefe(new Set(FK_TAFEL_NA.map(e => e.id)).size === FK_TAFEL_NA.length && FK_TAFEL_NA.every(e => e.fk > 0 && e.quelle.length > 10), 'Tafel eindeutig mit Quelle');
// f_k wächst mit Mörtelgruppe und Steinfestigkeitsklasse (KS Vollstein)
pruefe((fkNA('KS-12-NMII')?.fk ?? 0) < (fkNA('KS-12-NMIIIa')?.fk ?? 0) && (fkNA('KS-12-NMIIa')?.fk ?? 0) < (fkNA('KS-28-NMIIa')?.fk ?? 0), 'f_k monoton');

// 6. Grenzen und Hinweise
const g1 = bemesseWandVereinfacht({ ...aw, h: 4.5, t: 115, a: 115 }); // h_ef/t = 29,3 → Φ2 < 0
pruefe(g1.hinweise.some(h => h.stufe === 'fehler') && g1.nRd === 0, 'Φ2 ≤ 0 → Fehler, kein Ergebnis');
const g2 = bemesseWandVereinfacht({ ...aw, lf: 7 });
pruefe(g2.hinweise.some(h => h.feld === 'lf' && h.stufe === 'warnung'), 'l_f > 6 m → Warnung');
const g3 = bemesseWandVereinfacht({ ...aw, nEd: 600 });
pruefe(!g3.nachgewiesen && g3.eta > 1 && g3.hinweise.some(h => h.feld === 'nEd'), 'N_Ed > N_Rd → nicht erfüllt');
pruefe(bemesseWandVereinfacht({ ...aw, h: 3.0 }).hinweise.some(h => h.feld === 'h'), 'h > 2,75 m → Hinweis Tab. NA.2');
for (const u of [{ t: 0 }, { a: 0 }, { a: 200 }, { fk: 0 }, { nEd: -1 }, { h: NaN }, { lf: 0 }] as Partial<WandEingabe>[]) {
  const ru = bemesseWandVereinfacht({ ...aw, ...u });
  pruefe([ru.nRd, ru.phi, ru.eta].every(Number.isFinite) && ru.hinweise.some(x => x.stufe === 'fehler'), `unzulässig ${JSON.stringify(u)}`);
}

// 7. Fuzz: 1 000 Zufallseingaben ohne NaN/∞
let seed = 7;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
const lagen: WandLage[] = ['zwischen', 'dach', 'innen'];
for (let i = 0; i < 1000; i++) {
  const t = z(-20, 500);
  const ru = bemesseWandVereinfacht({ lage: lagen[i % 3], h: z(-0.5, 6), t, a: t * z(-0.2, 1.2), lf: z(-1, 9), fk: z(-1, 20), nEd: z(-100, 1500) });
  if (![ru.nRd, ru.phi, ru.phi1, ru.phi2, ru.eta, ru.hEf, ru.schlankheit, ru.tafelwert].every(Number.isFinite)) { pruefe(false, `Fuzz ${i}: ${JSON.stringify(ru)}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Mauerwerk');
