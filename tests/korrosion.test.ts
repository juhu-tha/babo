// Rechenkern Bewehrungskorrosion (Umsetzungsplan Phase 4, AP 4.2)
import {
  abtragsrateFaraday, querschnittsverlust, ABTRAG_UM_JE_UA_CM2, EISEN,
  dAppAlterung, chloridGehalt, chloridProfil, T0_CHLORID, CL_KRITISCH,
  karbonatisierungsFront, karbonatisierungsKurve, schnellUmrechnung, CO2_KAMMER_EN12390_12,
  feuchteFaktor, iCorrLehrmodell, schadensStufe, lokalelement, LOKALELEMENT, I_PASSIV,
} from '../src/calc/korrosion';
import { erf } from '../src/lib/math';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Korrosion ---');

// 1. Faraday: Eisen, 1 µA/cm² → 11,6 µm/a (Lehrbuchwert, auch Rechenbeispiel 2 in content/korrosion/Korrosion.json);
//    RILEM TC 154-EMC (François, RILEM Technical Letters 6 (2021), Tab. 1): 1 µA/cm² ≈ 0,010 mm/a (Größenordnung).
pruefe(nahe(abtragsrateFaraday(1), 11.6, 0.01), `v_corr(1 µA/cm²) = ${abtragsrateFaraday(1)} vs 11,6 µm/a`);
pruefe(nahe(abtragsrateFaraday(1), ABTRAG_UM_JE_UA_CM2, 0.01), 'Lehrwert 11,6 entspricht Faraday (± 1 %)');
pruefe(Math.abs(abtragsrateFaraday(1) / 1000 - 0.010) < 0.002, 'RILEM: ≈ 0,01 mm/a');
pruefe(nahe(abtragsrateFaraday(0.1), abtragsrateFaraday(1) / 10, 1e-12), 'linear in i_corr');
// Zink (M = 65,38 g/mol, z = 2, ρ = 7,14 g/cm³): 1 µA/cm² ≈ 15,0 µm/a (Faraday, Handrechnung)
pruefe(nahe(abtragsrateFaraday(1, 65.38, 2, 7.14), 14.97, 0.01), 'Zink 15 µm/a');

// 2. Rechenbeispiel 2 (Korrosion.json, „Querschnittsverlust“): Ø 12 mm, 11,6 µm/a, 10 a → d = 11,77 mm, ΔA/A = 3,8 %
const q = querschnittsverlust(12, ABTRAG_UM_JE_UA_CM2, 10);
pruefe(Math.abs(q.dRest - 11.77) < 0.005, `d_Rest ${q.dRest}`);
pruefe(Math.abs(q.verlust - 0.038) < 0.0005, `ΔA/A ${q.verlust}`);
pruefe(querschnittsverlust(12, 1000, 100).dRest === 0 && querschnittsverlust(12, 1000, 100).verlust === 1, 'vollständiger Abtrag → d = 0');

// 3. Rechenbeispiel 1 (Korrosion.json, nach fib Bulletin 34): C_s = 3,0, D = 0,3·10⁻¹² m²/s konstant (a = 0), x = 45 mm, t = 50 a
//    → z = 1,03, erf(z) = 0,856, C = 0,43 M.-% v. z. < 0,5 → passiv
const c1 = chloridGehalt(45, 50, 0.3, 3.0, 0);
pruefe(nahe(c1, 0.43, 0.01), `C(45 mm, 50 a) = ${c1} vs 0,43`);
pruefe(!chloridProfil({ t: 50, cNom: 45, dApp: 0.3, cS: 3, a: 0 }).depassiviert, 'Beispiel 1 passiv');
// Fehlerfunktion gegen Tabellenwerte (Abramowitz/Stegun, Tab. 7.1): erf(0,5) = 0,5205, erf(1) = 0,8427, erf(2) = 0,9953
pruefe(Math.abs(erf(0.5) - 0.5205) < 1e-4 && Math.abs(erf(1) - 0.8427) < 1e-4 && Math.abs(erf(2) - 0.9953) < 1e-4, 'erf-Tabellenwerte');
// Handrechnung mit z = 0,5: x = 2·√(D·t) · 0,5 → C = C_s · (1 − 0,5205)
const tS = 365 * 24 * 3600 * 20, D = 2e-12;
const x05 = 2 * Math.sqrt(D * tS) * 0.5 * 1000;
pruefe(nahe(chloridGehalt(x05, 20, 2, 4, 0), 4 * (1 - 0.5205), 0.001), 'C bei z = 0,5');

// 4. Alterung D(t) = D₀·(t₀/t)^a; Grenzen
pruefe(dAppAlterung(5, T0_CHLORID, 0.5) === 5 && dAppAlterung(5, T0_CHLORID / 2, 0.5) === 5, 'D(t ≤ t₀) = D₀');
pruefe(nahe(dAppAlterung(5, 50, 0.2), 5 * Math.pow((28 / 365) / 50, 0.2), 1e-12), 'D(50 a), a = 0,2');
pruefe(dAppAlterung(5, 50, 0) === 5, 'a = 0 → konstant');
const p0 = chloridProfil({ t: 50, cNom: 35, dApp: 5, cS: 3, a: 0.2 });
pruefe(p0.gueltig && p0.profil.length === 101 && Math.abs(p0.profil[0] - 3) < 1e-6, 'C(0) = C_s');
pruefe(p0.profil.every((c, i) => i === 0 || c <= p0.profil[i - 1] + 1e-12), 'Profil monoton fallend');
pruefe(nahe(p0.cBewehrung, p0.profil[35], 1e-12) && p0.depassiviert === (p0.profil[35] >= CL_KRITISCH), 'C an der Bewehrung = Profilwert');
pruefe(!chloridProfil({ t: 0, cNom: 35, dApp: 5, cS: 3, a: 0.2 }).gueltig, 't = 0 → Fehler');
pruefe(!chloridProfil({ t: 50, cNom: 35, dApp: 0, cS: 3, a: 0.2 }).gueltig, 'D = 0 → Fehler');
pruefe(!chloridProfil({ t: 50, cNom: 35, dApp: 5, cS: 3, a: 1 }).gueltig, 'a = 1 → Fehler');

// 5. Karbonatisierung x = K·√t: K = 3 mm/√a, 49 a → 21 mm; Deckung 25 mm erreicht nach (25/3)² = 69,4 a
const f = karbonatisierungsFront(3, 49, 25);
pruefe(f.xc === 21 && !f.depassiviert && nahe(f.tDeckung, 625 / 9, 1e-12), 'x_c(49 a) = 21 mm');
pruefe(karbonatisierungsFront(5, 25, 25).depassiviert, 'x_c = c → depassiviert (Grenze)');
pruefe(karbonatisierungsFront(0, 50, 25).tDeckung === Infinity, 'K = 0 → nie');
const kurve = karbonatisierungsKurve(3, 100);
pruefe(kurve.length === 101 && kurve[0] === 0 && kurve[100] === 30, 'Kurve 0 … 100 a');
pruefe(!karbonatisierungsFront(3, 50, 0).gueltig && !karbonatisierungsFront(-1, 50, 25).gueltig, 'c = 0, K < 0 → Fehler');

// 6. Schnellkarbonatisierung: K_acc = 2 mm/√d bei 2 %, c_nat = 0,04 % → K_nat = 2·√0,02·√365 = 5,404 mm/√a
const s = schnellUmrechnung(2, 2, 0.04, 90);
pruefe(nahe(s.kNat, 2 * Math.sqrt(0.02) * Math.sqrt(365), 1e-12) && nahe(s.kNat, 5.404, 0.001), `K_nat ${s.kNat}`);
pruefe(s.tiefenSchnell.length === 91 && s.tiefenSchnell[9] === 6, 'x_acc(9 d) = 6 mm');
pruefe(nahe(s.tiefenNat[90], s.kNat * Math.sqrt(90 / 365), 1e-12), 'x_nat(90 d)');
pruefe(schnellUmrechnung(2, 0.04, 0.04).hinweise.some(h => h.stufe === 'warnung'), 'c_nat = c_acc → Warnung');
pruefe(!schnellUmrechnung(2, 0, 0.04).gueltig, 'c_acc = 0 → Fehler');
// Runde 4 (bewusst geändert): Kammer-Standard 3,0 Vol.-% CO₂ nach DIN EN 12390-12 (vorher 2,0 Vol.-% im Modul).
// K_acc = 2 mm/√d bei 3 %, c_nat = 0,04 % → K_nat = 2·√(0,04/3)·√365 = 4,412 mm/√a
const s3 = schnellUmrechnung(2, CO2_KAMMER_EN12390_12, 0.04, 90);
pruefe(CO2_KAMMER_EN12390_12 === 3 && nahe(s3.kNat, 2 * Math.sqrt(0.04 / 3) * Math.sqrt(365), 1e-12) && nahe(s3.kNat, 4.412, 0.001), `K_nat(3 %) ${s3.kNat}`);
pruefe(!s3.hinweise.some(h => h.feld === 'cAcc') && s.hinweise.some(h => h.feld === 'cAcc'), '3 % ohne, 2 % mit Hinweis auf DIN EN 12390-12');

// 7. Lokalelement-Lehrmodell: Referenz = bisherige Komponentenrechnung (wörtlich), Schwellen und Grenzen
function alt(cl: number, rh: number, c: number, j: number) {
  const dep = cl >= 0.50;
  let i = 0.08;
  if (dep) {
    let hf = 1.0;
    if (rh < 50) hf = Math.max(0.05, (rh - 30) / 20 * 0.4);
    else if (rh <= 85) hf = 0.4 + ((rh - 50) / 35) * 0.6;
    else hf = Math.max(0.15, 1.0 - ((rh - 85) / 15) * 0.85);
    i = Math.min(18.0, 1.2 * Math.min(3.5, cl / 0.50) * hf * 2.8);
  }
  const rust = ((i * 11.6 * j) * 2.5) / 1000;
  const sig = dep ? Math.min(14.0, (12000 * (rust / 10)) / c) : 0;
  return { i, rust, sig };
}
for (const [cl, rh, c, j] of [[0.85, 80, 35, 6], [0.3, 80, 35, 6], [0.5, 85, 15, 25], [2.5, 98, 55, 1], [1.2, 30, 20, 10], [1.0, 45, 30, 12]] as const) {
  const r = lokalelement({ clGehalt: cl, relFeuchte: rh, deckungMm: c, jahre: j }), a = alt(cl, rh, c, j);
  pruefe(nahe(r.iCorr, a.i, 1e-12) && nahe(r.rostDicke, a.rust, 1e-12) && (r.sigmaRadial === a.sig || nahe(r.sigmaRadial, a.sig, 1e-12)), `Lokalelement ${cl}/${rh}/${c}/${j}`);
}
pruefe(iCorrLehrmodell(0.49, 80) === I_PASSIV && iCorrLehrmodell(0.5, 80) > I_PASSIV, 'Depassivierung bei 0,50 M.-%');
pruefe(nahe(feuchteFaktor(85), 1, 1e-12) && nahe(feuchteFaktor(50), 0.4, 1e-12) && nahe(feuchteFaktor(100), 0.15, 1e-12) && feuchteFaktor(0) === 0.05, 'Feuchtefaktor Stützstellen');
// Chloridüberschuss ist auf 3,5 begrenzt → i_corr ≤ 1,2 · 3,5 · 1 · 2,8 = 11,76 µA/cm² (Obergrenze 18 wird nie erreicht)
pruefe(nahe(iCorrLehrmodell(100, 85), 11.76, 1e-12) && iCorrLehrmodell(100, 85) < LOKALELEMENT.iMax, 'i_corr begrenzt');
pruefe(schadensStufe(false, 99) === 'passiv' && schadensStufe(true, 2.09) === 'initiierung' && schadensStufe(true, 2.1) === 'rissbildung'
  && schadensStufe(true, 4.5) === 'oberflaechenriss' && schadensStufe(true, 8.4) === 'abplatzung', 'Schadensstufen 0,7/1,5/2,8 · f_ctm');
pruefe(!lokalelement({ clGehalt: 1, relFeuchte: 80, deckungMm: 0, jahre: 5 }).gueltig, 'Deckung 0 → Fehler');
pruefe(!lokalelement({ clGehalt: 1, relFeuchte: 120, deckungMm: 30, jahre: 5 }).gueltig, 'r. F. > 100 % → Fehler');
pruefe(lokalelement({ clGehalt: 1, relFeuchte: 80, deckungMm: 30, jahre: 0 }).abtrag === 0, 'Dauer 0 → kein Abtrag');
pruefe(EISEN.z === 2, 'Eisen z = 2');

// 8. Fuzz: 1 000 Zufallseingaben → endliche Ergebnisse oder sauberer Fehler
let z = 1171;
const rnd = () => { z = (z * 1103515245 + 12345) % 2147483648; return z / 2147483648; };
let gueltige = 0;
for (let k = 0; k < 1000; k++) {
  const ch = chloridProfil({ t: rnd() * 120 - 5, cNom: rnd() * 100, dApp: rnd() * 12 - 1, cS: rnd() * 6, a: rnd() * 1.1 });
  if (ch.gueltig) { gueltige++; pruefe(ch.profil.every(Number.isFinite) && ch.profil.every(c => c >= -1e-9), `Fuzz ${k}: Chlorid`); }
  else pruefe(ch.hinweise.some(h => h.stufe === 'fehler'), `Fuzz ${k}: Chlorid ohne Fehler`);
  const kf = karbonatisierungsFront(rnd() * 12 - 1, rnd() * 110, rnd() * 80 - 5);
  if (kf.gueltig) pruefe(Number.isFinite(kf.xc) && !Number.isNaN(kf.tDeckung), `Fuzz ${k}: Karbonatisierung`);
  const su = schnellUmrechnung(rnd() * 30, rnd() * 5, rnd() * 0.2);
  if (su.gueltig) pruefe(Number.isFinite(su.kNat) && su.tiefenNat.every(Number.isFinite), `Fuzz ${k}: Schnell`);
  const lo = lokalelement({ clGehalt: rnd() * 3, relFeuchte: rnd() * 105, deckungMm: rnd() * 60, jahre: rnd() * 30 });
  if (lo.gueltig) pruefe([lo.iCorr, lo.vCorr, lo.abtrag, lo.rostDicke, lo.sigmaRadial].every(Number.isFinite) && lo.sigmaRadial <= LOKALELEMENT.sigmaMax, `Fuzz ${k}: Lokalelement`);
  else pruefe(lo.hinweise.some(h => h.stufe === 'fehler'), `Fuzz ${k}: Lokalelement ohne Fehler`);
  const v = abtragsrateFaraday(rnd() * 20);
  pruefe(Number.isFinite(v) && v >= 0, `Fuzz ${k}: Faraday`);
}
pruefe(gueltige > 600, `Fuzz: nur ${gueltige} gültige Chloridfälle`);

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Korrosion (${gueltige} gültige Chlorid-Fuzz-Fälle)`);
