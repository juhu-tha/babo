// Rechenkern Energieausweis-Simulator (Z3): H_T, H_V, Q_h, Endenergie, Primärenergie, CO₂, Effizienzklasse (GEG Anlage 10)
import { energieausweis, effizienzklasse, rechtsstandAm, FAKTOREN, type EnergieausweisEingabe, type Gebaeudetyp, type Huellstandard, type Lueftung, type Heizung } from '../src/calc/energieausweis';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Energieausweis ---');

// 1. Handrechnung Startwerte: EFH, A_N = 150 m², GEG-Standard, Fensterlüftung, Luft-Wasser-WP
//    Flächen: Wand 180, Dach 90, Fenster 33, Boden 90 → A = 393 m²
//    H_T = 180·0,24 + 90·0,18 + 33·1,10 + 90·0,25·0,6 + 393·0,05 = 128,85 W/K; H'_T = 0,3279 W/(m²K)
//    H_V = 375·0,34·0,5 = 63,75 W/K; Q_T = 128,85·72/150 = 61,85; Q_V = 30,60; Q_S = 33·160/150 = 35,2; η·Q_G = 0,88·70,2 = 61,78
//    Q_h = round(61,85 + 30,60 − 61,78) = 31; Q_E = round((31 + 12,5 + 7)/3,3 + 2,5) = 18 → A+; Q_P = round(18·1,8) = 32;
//    CO₂ = round(18·560/1000) = 10 (Netzstrom nach Anlage 9 GEG/GModG, Umsetzung 29.10.2026; vorher Lehrwert 380 → 7)
const S: EnergieausweisEingabe = { typ: 'efh', flaeche: 150, huelle: 'geg_standard', lueftung: 'fenster', heizung: 'wp_luft' };
const r = energieausweis(S);
pruefe(r.gueltig && nahe(r.h_t, 128.85, 1e-9) && nahe(r.h_t_prime, 0.327863, 1e-6) && nahe(r.h_v, 63.75, 1e-9), `H_T/H_V ${r.h_t} ${r.h_v}`);
pruefe(nahe(r.q_t_roh, 61.848, 1e-9) && nahe(r.q_v_roh, 30.6, 1e-9) && nahe(r.q_solar, 35.2, 1e-9) && nahe(r.q_gewinne_roh, 61.776, 1e-9), 'Bilanzanteile');
pruefe(r.q_h === 31 && r.q_e === 18 && r.q_p === 32 && r.co2_emissionen === 10 && r.rechtsstand === 'bis_2026' && r.klasse === 'A+' && r.istWP, `Kennwerte ${r.q_h} ${r.q_e} ${r.q_p} ${r.co2_emissionen} ${r.klasse}`);
//    Unsanierter Altbau mit Gasbrennwert: H_T = 546,9 W/K; Q_h = 224; Q_E = round(250,5/0,96 + 3,5) = 264 → H; Q_P = round(286,95 + 6,3) = 293; CO₂ = 63
const u = energieausweis({ ...S, huelle: 'unsaniert', heizung: 'gas_brennwert' });
pruefe(nahe(u.h_t, 546.9, 1e-9) && u.q_h === 224 && u.q_e === 264 && u.q_p === 293 && u.co2_emissionen === 63 && u.klasse === 'H', `unsaniert ${u.q_h} ${u.q_e} ${u.q_p} ${u.klasse}`);

// 1a. Stichtagsschalter (T11-EA-2/-3): ab 01.01.2027 f_p Strom 1,5, Holz 0,7, Fernwärme 0,7; CO₂ Strom 100 g/kWh (vorläufig)
//    WP: Q_P = round(18·1,5) = 27; CO₂ = round(18·0,1) = 2. Gas unsaniert: Q_P = round(250,5/0,96·1,1 + 3,5·1,5) = round(287,03 + 5,25) = 292
const r27 = energieausweis({ ...S, rechtsstand: 'ab_2027' });
pruefe(r27.q_e === r.q_e && r27.q_p === 27 && r27.co2_emissionen === 2 && r27.f_p === 1.5 && r27.hinweise.some(x => x.feld === 'rechtsstand'), `2027 WP ${r27.q_p} ${r27.co2_emissionen}`);
pruefe(energieausweis({ ...S, huelle: 'unsaniert', heizung: 'gas_brennwert', rechtsstand: 'ab_2027' }).q_p === 292, '2027 Gas: Hilfsstrom mit f_p 1,5');
pruefe(energieausweis({ ...S, heizung: 'pellets' }).q_p === 18 && energieausweis({ ...S, heizung: 'pellets', rechtsstand: 'ab_2027' }).q_p === 45, 'Pellets f_p 0,2 → 0,7');
pruefe(FAKTOREN.bis_2026.pellets.co2 === 20 && FAKTOREN.bis_2026.wp_luft.co2 === 560 && FAKTOREN.bis_2026.gas_brennwert.co2 === 240 && FAKTOREN.bis_2026.oel_kessel.co2 === 310, 'CO₂-Faktoren Anlage 9');
pruefe(FAKTOREN.ab_2027.fernwaerme.fp === 0.7 && FAKTOREN.ab_2027.wp_sole.fp === 1.5 && FAKTOREN.ab_2027.oel_kessel.fp === 1.1, 'f_p Anlage 4 GModG 2027');
pruefe(rechtsstandAm(new Date(2026, 11, 31, 23, 59)) === 'bis_2026' && rechtsstandAm(new Date(2027, 0, 1, 0, 0)) === 'ab_2027', 'Stichtag 01.01.2027');

// 2. Klassengrenzen GEG Anlage 10 (Endenergie, Obergrenze einschließlich)
const K: [number, string][] = [[0, 'A+'], [30, 'A+'], [31, 'A'], [50, 'A'], [75, 'B'], [100, 'C'], [130, 'D'], [160, 'E'], [200, 'F'], [250, 'G'], [251, 'H']];
for (const [q, k] of K) pruefe(effizienzklasse(q) === k, `Klasse bei ${q}: ${effizienzklasse(q)} ≠ ${k}`);

// 3. Randfälle: Mindest-Q_h 10, MFH-Flächen, ungültige Fläche
const eh = energieausweis({ ...S, huelle: 'effizienzhaus40', lueftung: 'kwl_wrg' });
pruefe(eh.q_h === 10 && eh.hinweise.some(x => x.feld === 'q_h'), `EH40 mit WRG → Q_h = 10 (${eh.q_h})`);
pruefe(!energieausweis({ ...S, flaeche: 0 }).gueltig && !energieausweis({ ...S, flaeche: NaN }).gueltig, 'A_N ≤ 0 → Fehler');
const m = energieausweis({ ...S, typ: 'mfh' });
pruefe(m.h_t < r.h_t && m.q_t_roh < r.q_t_roh, 'MFH kompakter als EFH');

// 4. Fuzz: endlich, ganzzahlige Kennwerte, Monotonie bei besserer Hülle und effizienterer Heizung
let zufall = 1977;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
const T: Gebaeudetyp[] = ['efh', 'mfh'], H: Huellstandard[] = ['unsaniert', 'bestand_teilsaniert', 'geg_standard', 'effizienzhaus40'];
const L: Lueftung[] = ['fenster', 'abluft', 'kwl_wrg'], W: Heizung[] = ['gas_brennwert', 'oel_kessel', 'pellets', 'wp_luft', 'wp_sole', 'fernwaerme'];
for (let i = 0; i < 1000; i++) {
  const e: EnergieausweisEingabe = { typ: T[i % 2], flaeche: 50 + rnd() * 2000, huelle: H[Math.floor(rnd() * 4)], lueftung: L[Math.floor(rnd() * 3)], heizung: W[Math.floor(rnd() * 6)] };
  const a = energieausweis(e);
  pruefe(a.gueltig && [a.q_h, a.q_e, a.q_p, a.co2_emissionen].every(Number.isInteger) && a.q_h >= 10 && a.q_e > 0 && a.q_p > 0, `Fuzz ${i}: ${JSON.stringify([a.q_h, a.q_e, a.q_p])}`);
  const hi = H.indexOf(e.huelle);
  if (hi < 3) { const b = energieausweis({ ...e, huelle: H[hi + 1] }); pruefe(b.q_h <= a.q_h && b.h_t < a.h_t, `Fuzz ${i}: bessere Hülle`); }
  const sole = energieausweis({ ...e, heizung: 'wp_sole' }), luft = energieausweis({ ...e, heizung: 'wp_luft' }), oel = energieausweis({ ...e, heizung: 'oel_kessel' }), gas = energieausweis({ ...e, heizung: 'gas_brennwert' });
  pruefe(sole.q_e <= luft.q_e && gas.q_e <= oel.q_e, `Fuzz ${i}: Erzeuger`);
  const a27 = energieausweis({ ...e, rechtsstand: 'ab_2027' });
  pruefe(a27.gueltig && a27.q_e === a.q_e && a27.klasse === a.klasse && Number.isInteger(a27.q_p) && a27.q_p > 0, `Fuzz ${i}: Rechtsstand ändert nur f_p/CO₂`);
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Energieausweis');
