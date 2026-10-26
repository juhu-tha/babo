// Rechenkern E-Modul (Z3): E_cm nach EC2, Voigt-/Reuss- und Hashin-Shtrikman-Schranken
import { ecmEc2, verbundSchranken, emodul, type EModulEingabe } from '../src/calc/emodul';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: E-Modul ---');

// 1. Handrechnung Startwerte des Moduls: C30/37, α_E = 1, E_G = 60 GPa, E_M = 20 GPa, v_G = 70 %
//    E_cm = 22·3,8^0,3 = 32,837 GPa (Tab. 3.1: 33 GPa)
//    Voigt 0,7·60 + 0,3·20 = 48; Reuss 1/(0,7/60 + 0,3/20) = 37,5
//    HS unten (Matrix Bezug): K_M = 20/1,8 = 11,111, G_M = 20/2,4 = 8,333, K_G = 33,333, G_G = 25
//      K = 11,111 + 0,7/(1/22,222 + 0,9/66,667) = 23,077; G = 8,333 + 0,7/(1/16,667 + 1,8·27,778/(5·8,333·66,667)) = 17,308
//      E = 9·23,077·17,308/(3·23,077 + 17,308) = 41,538
//    HS oben (Gestein Bezug): K = 24,638, G = 18,478 → E = 44,348
const S: EModulEingabe = { fck: 30, alphaE: 1, eGestein: 60, eMatrix: 20, volGestein: 70 };
const r = emodul(S);
pruefe(r.gueltig && r.hinweise.length === 0, `Startwerte ohne Hinweise (${r.hinweise.map(x => x.text).join(' | ')})`);
pruefe(nahe(r.ecm, 32.8366, 1e-4) && nahe(r.voigt, 48, 1e-12) && nahe(r.reuss, 37.5, 1e-12), `E_cm/Voigt/Reuss ${r.ecm} ${r.voigt} ${r.reuss}`);
pruefe(nahe(r.hsUnten, 41.53846, 1e-5) && nahe(r.hsOben, 44.34783, 1e-5), `HS ${r.hsUnten} ${r.hsOben}`);
pruefe(r.kurve.length === 21 && r.kurve[14].vG === 70 && nahe(r.kurve[14].hsUnten, r.hsUnten, 1e-12) && nahe(r.kurve[0].voigt, 20, 1e-12) && nahe(r.kurve[20].reuss, 60, 1e-12), 'Diagrammreihe');
// α_E: Basalt 1,2 → 39,40 GPa
pruefe(nahe(ecmEc2(30, 1.2), 1.2 * 32.8366, 1e-3) && nahe(ecmEc2(12), 27.085, 1e-3), `E_cm C12/15 ${ecmEc2(12)}`);

// 2. Referenz: wörtliche Formeln aus src/modules/EModul.tsx (Rollen bei E_M > E_G über min/max getauscht)
function modulHS(eG: number, eM: number, vG: number) {
  const vM = 1 - vG, nu = 0.2;
  const kG = eG / (3 * (1 - 2 * nu)), gG = eG / (2 * (1 + nu)), kM = eM / (3 * (1 - 2 * nu)), gM = eM / (2 * (1 + nu));
  const kHSMinus = kM + vG / (1 / (kG - kM) + 3 * vM / (3 * kM + 4 * gM));
  const gHSMinus = gM + vG / (1 / (gG - gM) + 6 * vM * (kM + 2 * gM) / (5 * gM * (3 * kM + 4 * gM)));
  const eHSMinusRaw = (9 * kHSMinus * gHSMinus) / (3 * kHSMinus + gHSMinus);
  const kHSPlus = kG + vM / (1 / (kM - kG) + 3 * vG / (3 * kG + 4 * gG));
  const gHSPlus = gG + vM / (1 / (gM - gG) + 6 * vG * (kG + 2 * gG) / (5 * gG * (3 * kG + 4 * gG)));
  const eHSPlusRaw = (9 * kHSPlus * gHSPlus) / (3 * kHSPlus + gHSPlus);
  return { oben: Math.max(eHSPlusRaw, eHSMinusRaw), unten: Math.min(eHSPlusRaw, eHSMinusRaw) };
}

// 3. Randfälle
const gl = verbundSchranken(30, 30, 0.6);
pruefe(nahe(gl.voigt, 30, 1e-12) && nahe(gl.reuss, 30, 1e-12) && nahe(gl.hsUnten, 30, 1e-9) && nahe(gl.hsOben, 30, 1e-9), 'gleiche Phasen → alle Schranken = E');
const rein = verbundSchranken(60, 20, 0), voll = verbundSchranken(60, 20, 1);
pruefe(nahe(rein.hsUnten, 20, 1e-9) && nahe(rein.hsOben, 20, 1e-9) && nahe(voll.hsUnten, 60, 1e-9) && nahe(voll.voigt, 60, 1e-12), 'v_G = 0 bzw. 100 %');
const weich = verbundSchranken(10, 25, 0.7);
pruefe(weich.hsUnten <= weich.hsOben && weich.reuss <= weich.hsUnten + 1e-12 && weich.hsOben <= weich.voigt + 1e-12, 'weiche Körnung (Leichtbeton): Schranken getauscht und geordnet');
pruefe(!emodul({ ...S, eMatrix: 0 }).gueltig && !emodul({ ...S, volGestein: 120 }).gueltig && !emodul({ ...S, fck: NaN }).gueltig, 'E_M = 0 / v_G > 100 / NaN → Fehler');
pruefe(emodul({ ...S, volGestein: 30 }).hinweise.some(x => x.feld === 'volGestein'), 'ungewöhnlicher Gesteinsanteil → Warnung');

// 4. Fuzz-Test: Reuss ≤ HS− ≤ HS+ ≤ Voigt, identisch zum Modul, monoton in v_G und f_ck
let zufall = 5150;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
for (let i = 0; i < 1000; i++) {
  const eG = 5 + rnd() * 120, eM = 5 + rnd() * 40, vG = rnd();
  const s = verbundSchranken(eG, eM, vG), m = modulHS(eG, eM, vG);
  pruefe([s.voigt, s.reuss, s.hsUnten, s.hsOben].every(Number.isFinite), `Fuzz ${i}: endlich`);
  pruefe(s.reuss <= s.hsUnten + 1e-9 && s.hsUnten <= s.hsOben + 1e-9 && s.hsOben <= s.voigt + 1e-9, `Fuzz ${i}: Ordnung ${JSON.stringify(s)}`);
  pruefe(nahe(s.hsOben, m.oben, 1e-12 * m.oben) && nahe(s.hsUnten, m.unten, 1e-12 * m.unten), `Fuzz ${i}: identisch zum Modul`);
  const s2 = verbundSchranken(eG, eM, Math.min(1, vG + 0.05));
  const steigt = eG >= eM;
  pruefe(steigt ? (s2.voigt >= s.voigt - 1e-12 && s2.hsUnten >= s.hsUnten - 1e-9) : (s2.voigt <= s.voigt + 1e-12 && s2.hsOben <= s.hsOben + 1e-9), `Fuzz ${i}: Monotonie in v_G`);
}
for (let fck = 12; fck < 100; fck++) pruefe(ecmEc2(fck + 1) > ecmEc2(fck), `E_cm monoton bei f_ck = ${fck}`);

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: E-Modul');
