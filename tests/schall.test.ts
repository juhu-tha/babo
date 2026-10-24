// Rechenkerne Schallschutz und Fenster (Umsetzungsplan Phase 4, AP 4.3)
import { rwMassiv, schalldaemmung } from '../src/calc/schall';
import { uwFenster, PSI_ABSTANDHALTER } from '../src/calc/fenster';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Schall und Fenster ---');

// 1. DIN 4109-32 Gl. (2): R_w(100) = 39,6 dB; R_w(300) = 54,3 dB; R_w(400) = 58,2 dB; Verdopplung der Masse → +9,3 dB
pruefe(nahe(rwMassiv(100), 39.6, 0.05) && nahe(rwMassiv(300), 54.3, 0.05) && nahe(rwMassiv(400), 58.2, 0.05), 'R_w-Stützwerte');
pruefe(nahe(rwMassiv(400) - rwMassiv(200), 30.9 * Math.log10(2), 1e-9), 'Massegesetz +9,3 dB je Verdopplung');
// 240 mm KS (2000 kg/m³) + 2 × 15 mm Kalkputz (1400 kg/m³): m' = 480 + 42 = 522 kg/m² → R_w = 61,8 dB
const ks = schalldaemmung([{ d: 0.015, density: 1400 }, { d: 0.24, density: 2000 }, { d: 0.015, density: 1400 }]);
pruefe(nahe(ks.mStrich, 522, 1e-9) && nahe(ks.Rw, 61.8, 0.05) && ks.hinweise.length === 0, `KS-Wand ${ks.Rw}`);
pruefe(schalldaemmung([{ d: 0.1, density: 400 }]).hinweise.some(x => x.feld === 'm'), 'außerhalb 65–720 → Warnung');
pruefe(schalldaemmung([{ d: 0.24, density: 800 }, { d: 0.16, density: 20 }]).hinweise.some(x => x.feld === 'aufbau'), 'WDVS → Warnung');
pruefe(schalldaemmung([{ d: 0, density: 800 }]).hinweise.some(x => x.stufe === 'fehler') && schalldaemmung([]).gueltig === false, 'Fehlerfälle');

// 2. Normfenster 1,23 × 1,48 m, Rahmen 110 mm, U_g = 0,6, U_f = 1,1, Ψ = 0,038 (Hand):
//    A = 1,8204; A_g = 1,01·1,26 = 1,2726; A_f = 0,5478; l_g = 4,54 m
//    U_w = (0,76356 + 0,60258 + 0,17252)/1,8204 = 0,8452 W/(m²K)
const f = uwFenster({ breite: 1.23, hoehe: 1.48, rahmenMm: 110, ug: 0.6, uf: 1.1, psi: PSI_ABSTANDHALTER.warm_edge_kunststoff, g: 0.53, strahlung: 450 });
pruefe(nahe(f.Ag, 1.2726, 1e-9) && nahe(f.lg, 4.54, 1e-9) && nahe(f.uw, 0.8452, 1e-4) && f.gegKonform && !f.passivhaus, `U_w ${f.uw}`);
// Grenzfall ohne Rahmen: U_w = U_g; Rahmen zu breit → Fehler (vorher stiller Ersatz 0,1 m Glasbreite)
pruefe(nahe(uwFenster({ breite: 1, hoehe: 1, rahmenMm: 0, ug: 1.1, uf: 1.3, psi: 0, g: 0.6, strahlung: 0 }).uw, 1.1, 1e-12), 'U_w = U_g ohne Rahmen');
pruefe(uwFenster({ breite: 0.2, hoehe: 1, rahmenMm: 110, ug: 1, uf: 1, psi: 0.04, g: 0.5, strahlung: 0 }).hinweise.some(x => x.stufe === 'fehler'), 'Rahmen zu breit');

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Schall und Fenster');
