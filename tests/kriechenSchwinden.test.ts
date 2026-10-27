// Rechenkern Kriechen und Schwinden (Umsetzungsplan Phase 4, AP 4.2): DIN EN 1992-1-1, 3.1.4, 3.3.2 und Anhang B
import {
  kriechSchwindModell, kriechzahl, trocknungsschwinden, autogenesSchwinden, gesamtschwinden, wirksamerEModul,
  kriechSchwindVerlauf, diagrammZeitpunkte, stuetzenVerformung, STUETZE_LEHRWERTE, EC_TANGENTENFAKTOR, betaDs, betaAs, betaC, beiwertKh,
  spannstahlRelaxation, relaxationsVerlauf, RELAXATION_ZEITPUNKTE_H, rheologieKennwerte, maxwellRelaxation, zenerRelaxation,
  kelvinKriechen, maxwellKriechen, zenerKriechen, halbwertszeit, lehrDehnungPromille,
  type KriechSchwindEingabe, type Zementklasse, type Relaxationsklasse,
} from '../src/calc/kriechenSchwinden';
import { betonkennwerte } from '../src/calc/betonkennwerte';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
/** relative Abweichung ≤ tol */
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
const relNahe = (ist: number, soll: number, rel = 1e-12) => ist === soll || Math.abs(ist - soll) <= rel * Math.max(1e-300, Math.abs(soll));
console.log('--- Test: Kriechen und Schwinden ---');

/**
 * Referenz: wörtliche Kopie der Rechnung aus src/modules/KriechenSchwinden.tsx (ec2KriechenSchwinden, Stand origin/main b3a574e6).
 * Sie belegt, dass der Kern das bisherige Verhalten übernimmt.
 */
function modulReferenz(fck: number, rh: number, h0: number, t0T: number, ts: number, zement: string) {
  const fcm = fck + 8;
  const Ecm = 22000 * Math.pow(fcm / 10, 0.3);
  const a1 = Math.pow(35 / fcm, 0.7), a2 = Math.pow(35 / fcm, 0.2), a3 = Math.pow(35 / fcm, 0.5);
  const rhTerm = (1 - rh / 100) / (0.1 * Math.pow(h0, 1 / 3));
  const phiRH = fcm <= 35 ? 1 + rhTerm : (1 + rhTerm * a1) * a2;
  const betaFcm = 16.8 / Math.sqrt(fcm);
  const alphaZ = zement === 'S' ? -1 : zement === 'R' ? 1 : 0;
  const t0 = Math.max(0.5, t0T * Math.pow(9 / (2 + Math.pow(t0T, 1.2)) + 1, alphaZ));
  const betaT0 = 1 / (0.1 + Math.pow(t0, 0.2));
  const phi0 = phiRH * betaFcm * betaT0;
  const betaH = fcm <= 35
    ? Math.min(1.5 * (1 + Math.pow(0.012 * rh, 18)) * h0 + 250, 1500)
    : Math.min(1.5 * (1 + Math.pow(0.012 * rh, 18)) * h0 + 250 * a3, 1500 * a3);
  const [ads1, ads2] = zement === 'S' ? [3, 0.13] : zement === 'R' ? [6, 0.11] : [4, 0.12];
  const betaRH = 1.55 * (1 - Math.pow(rh / 100, 3));
  const epsCd0 = 0.85 * (220 + 110 * ads1) * Math.exp(-ads2 * fcm / 10) * 1e-6 * betaRH;
  const kh = h0 <= 100 ? 1.0 : h0 <= 200 ? 1.0 - 0.15 * (h0 - 100) / 100 : h0 <= 300 ? 0.85 - 0.10 * (h0 - 200) / 100 : h0 <= 500 ? 0.75 - 0.05 * (h0 - 300) / 200 : 0.70;
  const epsCaInf = 2.5 * (fck - 10) * 1e-6;
  const phi = (t: number) => (t <= t0T ? 0 : phi0 * Math.pow((t - t0T) / (betaH + t - t0T), 0.3));
  const epsCd = (t: number) => (t <= ts ? 0 : ((t - ts) / ((t - ts) + 0.04 * Math.sqrt(Math.pow(h0, 3)))) * kh * epsCd0);
  const epsCa = (t: number) => (1 - Math.exp(-0.2 * Math.sqrt(t))) * epsCaInf;
  return { fcm, Ecm, phi0, betaH, kh, epsCd0, epsCaInf, t0eff: t0, phi, epsCd, epsCa };
}
/** Kopie calculateStahl (Relaxation) aus dem Modul */
function modulRelaxation(stahlKlasse: string, mu: number, t: number) {
  const rho1000 = ({ '1': 8.0, '2': 2.5, '3': 4.0 } as Record<string, number>)[stahlKlasse] || 2.5;
  let relLoss = 0;
  if (mu > 0.5) {
    let k1 = 0.66, k2 = 9.1;
    if (stahlKlasse === '1') { k1 = 5.39; k2 = 6.7; } else if (stahlKlasse === '3') { k1 = 1.98; k2 = 8.0; }
    relLoss = k1 * rho1000 * Math.exp(k2 * mu) * Math.pow(t / 1000, 0.75 * (1 - mu)) * 1e-5;
  }
  return relLoss * 100;
}

const ZEITEN = [1, 2, 5, 7, 10, 28, 29, 90, 365, 1825, 10000, 18250];
function gleichModul(e: KriechSchwindEingabe, tag: string) {
  const m = kriechSchwindModell(e);
  const r = modulReferenz(e.fck, e.rh, e.h0, e.t0, e.ts, e.zement);
  for (const k of ['fcm', 'Ecm', 'phi0', 'betaH', 'kh', 'epsCd0', 't0eff'] as const) {
    if (!relNahe(m[k], r[k])) { fehler.push(`${tag}: ${k} Kern ${m[k]} ≠ Modul ${r[k]}`); return; }
  }
  if (e.fck >= 10 && !relNahe(m.epsCaInf, r.epsCaInf)) { fehler.push(`${tag}: epsCaInf`); return; }
  for (const t of ZEITEN) {
    const paare: [number, number, string][] = [[kriechzahl(m, t), r.phi(t), 'φ'], [trocknungsschwinden(m, t), r.epsCd(t), 'ε_cd']];
    if (e.fck >= 10) paare.push([autogenesSchwinden(m, t), r.epsCa(t), 'ε_ca']);
    for (const [ist, soll, name] of paare) if (!relNahe(ist, soll)) { fehler.push(`${tag}: ${name}(${t}) Kern ${ist} ≠ Modul ${soll}`); return; }
  }
}

// 1. Veröffentlichtes Rechenbeispiel (±2 %):
//    SOFiSTiK AG, Verification Manual, Benchmark DCE-EN18 „Creep and Shrinkage Calculation“ (EN 1992-1-1, Anhang B),
//    öffentlich unter docs.sofistik.com (Verification, Ausgabe 2024). Rechteckbalken b = h = 1,0 m, A_c = 1,0 m², h₀ = 500 mm,
//    C35/45, Zement N, RH = 80 %, t₀ = 28 d, t_s = 0 d, t = 1 000 028 d, T = 20 °C (t₀,T = 28 d).
//    Handrechnung im Beispiel: f_cm = 43, α₁/α₂/α₃ = 0,8658/0,9597/0,9022, φ_RH = 1,1691, β(f_cm) = 2,562, β(t₀) = 0,48844,
//    φ₀ = 1,463, β_H = 1335,25 (Grenze 1353,30), β_c(t,t₀) = 0,9996, φ(t,t₀)/1,05 = 1,393 (Beispiel bezieht φ auf E_cm);
//    β_RH = 0,7564, ε_cd,0 = 2,533·10⁻⁴, k_h = 0,70, β_ds(t,t_s) = 0,99955, β_ds(t₀,t_s) = 0,05892, Δε_cd(t₀…t) = 1,668·10⁻⁴,
//    ε_ca(∞) = 6,25·10⁻⁵, Δβ_as = 0,347, Δε_ca = 2,169·10⁻⁵, Δε_cs = 18,85·10⁻⁵, ε_ca(∞) + ε_cd,0 = 31,58·10⁻⁵, E_cm = 34 077 N/mm².
const SOF: KriechSchwindEingabe = { fck: 35, rh: 80, h0: 500, t0: 28, ts: 0, zement: 'N' };
const s = kriechSchwindModell(SOF);
const tS = 1000028;
pruefe(s.gueltig && s.hinweise.length === 0, `Beispiel ohne Hinweise (${s.hinweise.map(h => h.text).join(' | ')})`);
pruefe(s.fcm === 43 && nahe(s.Ecm, 34077, 0.02), `f_cm/E_cm ${s.fcm} ${s.Ecm}`);
pruefe(nahe(s.alpha1, 0.8658, 0.02) && nahe(s.alpha2, 0.9597, 0.02) && nahe(s.alpha3, 0.9022, 0.02), `α ${s.alpha1} ${s.alpha2} ${s.alpha3}`);
pruefe(nahe(s.phiRH, 1.1691, 0.02) && nahe(s.betaFcm, 2.562, 0.02) && nahe(s.betaT0, 0.48844, 0.02) && nahe(s.phi0, 1.463, 0.02), `φ₀ ${s.phiRH} ${s.betaFcm} ${s.betaT0} ${s.phi0}`);
pruefe(nahe(s.betaH, 1335.25, 0.02) && nahe(betaC(tS, 28, s.betaH), 0.9996, 0.02), `β_H/β_c ${s.betaH}`);
pruefe(nahe(kriechzahl(s, tS), 1.393 * 1.05, 0.02) && nahe(kriechzahl(s, tS) / 1.05, 1.393, 0.02), `φ(t,t₀) ${kriechzahl(s, tS)}`);
pruefe(nahe(s.betaRH, 0.7564, 0.02) && nahe(s.epsCd0, 2.533e-4, 0.02) && s.kh === 0.70, `ε_cd,0 ${s.betaRH} ${s.epsCd0} ${s.kh}`);
pruefe(nahe(betaDs(tS, 0, 500), 0.99955, 0.02) && nahe(betaDs(28, 0, 500), 0.05892, 0.02), 'β_ds');
const dCd = trocknungsschwinden(s, tS) - trocknungsschwinden(s, 28);
const dCa = autogenesSchwinden(s, tS) - autogenesSchwinden(s, 28);
pruefe(nahe(dCd, 1.668e-4, 0.02) && nahe(s.epsCaInf, 6.25e-5, 0.02) && nahe(betaAs(tS) - betaAs(28), 0.347, 0.02) && nahe(dCa, 2.169e-5, 0.02), `Δε_cd ${dCd} Δε_ca ${dCa}`);
pruefe(nahe(gesamtschwinden(s, tS) - gesamtschwinden(s, 28), 18.85e-5, 0.02) && nahe(s.epsCaInf + s.epsCd0, 31.58e-5, 0.02), 'Δε_cs / ε_ca∞ + ε_cd,0');
gleichModul(SOF, 'Beispiel SOFiSTiK');

// 2. Standardfall des Moduls (C30/37, RH 50 %, h₀ = 200 mm, t₀ = 28 d, t_s = 7 d, Zement N) – identisch zur Modulrechnung,
//    Gegenrechnung mit dem Kern Betonkennwerte (gleiche Formeln mit Temperaturfaktor = 1 bei T = 4000/13,65 − 273 °C)
const STD: KriechSchwindEingabe = { fck: 30, rh: 50, h0: 200, t0: 28, ts: 7, zement: 'N' };
gleichModul(STD, 'Standardfall');
const T1 = 4000 / 13.65 - 273;
for (const z of ['S', 'N', 'R'] as const) for (const fck of [20, 30, 45, 70]) for (const t of [60, 365, 18250]) {
  const m = kriechSchwindModell({ ...STD, fck, zement: z });
  const b = betonkennwerte({ fck, zementklasse: z, gestein: 'quarzit', rh: 50, ac: 0.1, u: 1, h: 300, ts: 7, t0: 28, t, temperatur: T1, sigmaC: 1, laenge: 1 });
  pruefe(nahe(kriechzahl(m, t), b.phiLinear, 1e-9) && nahe(gesamtschwinden(m, t), b.epsCs, 1e-9) && nahe(m.Ecm, b.Ecm, 1e-12) && nahe(m.phi0, b.phi0, 1e-9),
    `Gegenrechnung Betonkennwerte ${z}/C${fck}/t=${t}: φ ${kriechzahl(m, t)} vs ${b.phiLinear}, ε_cs ${gesamtschwinden(m, t)} vs ${b.epsCs}`);
}
// Zweig f_cm ≤ 35 (C25/30): φ_RH ohne α-Beiwerte, β_H ≤ 1500
const c25 = kriechSchwindModell({ ...STD, fck: 25 });
pruefe(nahe(c25.phiRH, 1 + 0.5 / (0.1 * Math.cbrt(200)), 1e-12) && nahe(c25.betaH, 1.5 * (1 + Math.pow(0.6, 18)) * 200 + 250, 1e-12), 'f_cm ≤ 35: Gl. (B.3a)/(B.8a)');
// Zement: S kriecht bei gleichem t₀ stärker als N, N stärker als R (wirksames Belastungsalter Gl. B.9)
const phiZ = (z: Zementklasse) => kriechzahl(kriechSchwindModell({ ...STD, zement: z }), 18250);
pruefe(phiZ('S') > phiZ('N') && phiZ('N') > phiZ('R'), 'φ: S > N > R');

// 3. Verläufe, wirksamer E-Modul und Stützenbeispiel
const zp = diagrammZeitpunkte();
pruefe(zp[0] === 1 && zp[zp.length - 1] === 10000 && zp.length === 37 && zp.every((t, i) => i === 0 || t > zp[i - 1]), `Zeitpunkte ${zp.length}`);
const m0 = kriechSchwindModell(STD);
const v = kriechSchwindVerlauf(m0);
pruefe(v.kriechzahl.length === zp.length && relNahe(v.gesamt[5], (trocknungsschwinden(m0, zp[5]) + autogenesSchwinden(m0, zp[5])) * 1e6), 'Verlauf');
pruefe(wirksamerEModul(m0, 20) === m0.Ecm && relNahe(wirksamerEModul(m0, 365), m0.Ecm / (1 + kriechzahl(m0, 365))), 'E_c,eff (Gl. 7.20)');
const st = stuetzenVerformung(m0, 18250);
// Runde 4 (bewusste Änderung, Entscheidung 26.10.): Kriechdehnung nach DIN EN 1992-1-1, 3.1.4(3)
// mit E_c = 1,05·E_cm, d. h. ε_cr = φ·σ/(1,05·E_cm). Früher: ε_cr = φ·σ/E_cm (Kriechanteil um 5 % zu groß).
pruefe(relNahe(st.epsEl, STUETZE_LEHRWERTE.sigmaC / m0.Ecm) && relNahe(st.epsCr, st.phiT * STUETZE_LEHRWERTE.sigmaC / (1.05 * m0.Ecm), 1e-12)
  && relNahe(st.dL_tot, (st.epsEl * (1 + st.phiT / 1.05) + gesamtschwinden(m0, 18250)) * 3000, 1e-12), 'Stütze ε_tot = σ/E_cm·(1 + φ/1,05) + ε_cs');
pruefe(EC_TANGENTENFAKTOR === 1.05 && relNahe(st.epsCr * 1.05, st.phiT * st.epsEl, 1e-12), 'ε_cr·1,05 = φ·ε_el (alter Wert / 1,05)');
const st0 = stuetzenVerformung(m0, 28);
pruefe(st0.phiT > 0 && st0.phiT < 0.15 && relNahe(st0.phiT, kriechzahl(m0, 28.01)), 'Stütze bei t = t₀: φ(t₀ + 0,01 d)');

// 4. Randfälle und Grenzen
pruefe(kriechzahl(m0, 28) === 0 && kriechzahl(m0, 10) === 0 && trocknungsschwinden(m0, 7) === 0 && trocknungsschwinden(m0, 3) === 0, 't ≤ t₀ → φ = 0; t ≤ t_s → ε_cd = 0');
const nass = kriechSchwindModell({ ...STD, rh: 100 });
pruefe(nass.epsCd0 === 0 && trocknungsschwinden(nass, 10000) === 0 && nahe(nass.phiRH, 1 * Math.pow(35 / 38, 0.2), 1e-12), 'RH = 100 %: kein Trocknungsschwinden, φ_RH = α₂');
pruefe(beiwertKh(50) === 1 && beiwertKh(100) === 1 && nahe(beiwertKh(150), 0.925, 1e-12) && nahe(beiwertKh(400), 0.725, 1e-12) && beiwertKh(1000) === 0.70, 'k_h Tab. 3.3');
// lange Zeit: φ → φ₀, β_ds → 1, β_as → 1
pruefe(nahe(kriechzahl(m0, 1e9), m0.phi0, 1e-3) && nahe(gesamtschwinden(m0, 1e12), m0.kh * m0.epsCd0 + m0.epsCaInf, 1e-3), 'Grenzwerte t → ∞');
// Grenze β_H = 1500·α₃ bei sehr dickem Bauteil
pruefe(nahe(kriechSchwindModell({ ...STD, h0: 1000, rh: 95 }).betaH, 1500 * Math.pow(35 / 38, 0.5), 1e-12), 'β_H-Grenze 1500·α₃');
// t₀ < 1 d → t₀,eff ≥ 0,5 d
const jung = kriechSchwindModell({ ...STD, t0: 0.2, zement: 'S' });
pruefe(jung.t0eff === 0.5 && jung.hinweise.some(h => h.feld === 't0') && jung.gueltig, 't₀,eff ≥ 0,5 d');
// unzulässige Eingaben → Fehler
for (const [name, e] of [['f_ck = 0', { ...STD, fck: 0 }], ['f_ck NaN', { ...STD, fck: NaN }], ['RH > 100', { ...STD, rh: 120 }], ['h₀ = 0', { ...STD, h0: 0 }],
  ['t₀ = 0', { ...STD, t0: 0 }], ['t_s < 0', { ...STD, ts: -1 }], ['Zement X', { ...STD, zement: 'X' as Zementklasse }]] as const) {
  pruefe(!kriechSchwindModell(e).gueltig, `${name} → Fehler`);
}
// Anwendungsbereich → Warnungen
pruefe(kriechSchwindModell({ ...STD, rh: 30 }).hinweise.some(h => h.feld === 'rh') && kriechSchwindModell({ ...STD, h0: 50 }).hinweise.some(h => h.feld === 'h0')
  && kriechSchwindModell({ ...STD, fck: 100 }).hinweise.some(h => h.feld === 'fck'), 'Warnungen RH/h₀/f_ck');
const weich = kriechSchwindModell({ ...STD, fck: 8 });
pruefe(weich.epsCaInf === 0 && weich.hinweise.some(h => /negativ/.test(h.text)), 'f_ck < 10: ε_ca(∞) = 0 statt negativ');
// Modulgrenzen der Schieberegler (f_ck 12/90, RH 20/100, h₀ 50/1000, t₀ 1/365, t_s 1/28) identisch zur Modulrechnung
for (const fck of [12, 90]) for (const rh of [20, 100]) for (const h0 of [50, 1000]) for (const t0 of [1, 365]) for (const ts of [1, 28]) for (const z of ['S', 'N', 'R'] as const) {
  gleichModul({ fck, rh, h0, t0, ts, zement: z }, `Grenze C${fck}/RH${rh}/h${h0}/t0=${t0}/ts=${ts}/${z}`);
}

// 5. Relaxation Spannstahl (Gl. 3.28–3.30), Handrechnung:
//    Klasse 2, μ = 0,7, t = 1000 h: 0,66·2,5·e^(6,37)·1·10⁻⁵ = 9,637·10⁻³ → 0,964 %
//    Klasse 1, μ = 0,7, t = 1000 h: 5,39·8·e^(4,69)·10⁻⁵ = 0,04694 → 4,69 %; Klasse 3: 1,98·4·e^(5,6)·10⁻⁵ = 0,02142 → 2,14 %
pruefe(nahe(spannstahlRelaxation('2', 0.7, 1000), 0.9637, 1e-3) && nahe(spannstahlRelaxation('1', 0.7, 1000), 4.694, 1e-3) && nahe(spannstahlRelaxation('3', 0.7, 1000), 2.142, 1e-3), 'Relaxation 1000 h');
//    Klasse 2, μ = 0,7, t = 500 000 h: Faktor (500)^(0,225) = 4,050 → 3,90 %
pruefe(nahe(spannstahlRelaxation('2', 0.7, 500000), 0.9637 * Math.pow(500, 0.225), 1e-3), 'Relaxation 500 000 h');
pruefe(spannstahlRelaxation('2', 0.5, 1000) === 0 && spannstahlRelaxation('1', 0.45, 1e5) === 0 && spannstahlRelaxation('2', NaN, 1000) === 0, 'μ ≤ 0,5 → 0');
for (const k of ['1', '2', '3'] as Relaxationsklasse[]) for (const mu of [0.4, 0.5, 0.55, 0.6, 0.7, 0.75, 0.8]) for (const t of RELAXATION_ZEITPUNKTE_H) {
  pruefe(relNahe(spannstahlRelaxation(k, mu, t), modulRelaxation(k, mu, t)), `Relaxation Modul ${k}/${mu}/${t}`);
}
const rv = relaxationsVerlauf('2', 0.7);
pruefe(rv.gueltig && rv.hinweise.length === 0 && rv.verlustProzent.length === 7 && rv.verlustProzent.every((x, i) => i === 0 || x > rv.verlustProzent[i - 1]), 'Relaxationsverlauf monoton');
pruefe(!relaxationsVerlauf('2', 1.2).gueltig && !relaxationsVerlauf('4' as Relaxationsklasse, 0.7).gueltig && relaxationsVerlauf('2', 0.45).hinweise.length === 1, 'Relaxation Grenzen');
pruefe(spannstahlRelaxation('1', 0.7, 1000) > spannstahlRelaxation('3', 0.7, 1000) && spannstahlRelaxation('3', 0.7, 1000) > spannstahlRelaxation('2', 0.7, 1000), 'Klasse 1 > 3 > 2');

// 6. Rheologische Grundmodelle (KriechModellDiagramm), Kopie der Diagrammformeln
const tau = 2, sig0 = 20;
pruefe(relNahe(maxwellRelaxation(sig0, tau, tau), sig0 * Math.exp(-1)) && relNahe(zenerRelaxation(sig0, 3, tau), sig0 * (0.4 + 0.6 * Math.exp(-3 / tau))), 'Relaxation Maxwell/Zener');
pruefe(relNahe(halbwertszeit(tau), tau * Math.LN2) && relNahe(maxwellRelaxation(sig0, halbwertszeit(tau), tau), sig0 / 2), 'Halbwertszeit');
const eEl = lehrDehnungPromille(sig0);
pruefe(eEl === 2 && relNahe(kelvinKriechen(eEl, 4, tau), eEl * (1 + 1.5 * (1 - Math.exp(-4 / tau)))) && relNahe(maxwellKriechen(eEl, 4, tau), eEl * (1 + 4 / tau))
  && relNahe(zenerKriechen(eEl, 4, tau), eEl * (1 + 1.2 * (1 - Math.exp(-4 / tau)))), 'Kriechen Kelvin/Maxwell/Zener');
const rk = rheologieKennwerte(sig0, tau);
pruefe(rk.gueltig && relNahe(rk.sigmaEndeMaxwell, sig0 * Math.exp(-10 / tau)) && relNahe(rk.abbauMaxwellProzent, (1 - Math.exp(-5)) * 100, 1e-12)
  && relNahe(rk.epsEndeKelvin, eEl * (1 + 1.5 * (1 - Math.exp(-5)))) && relNahe(rk.epsEndeMaxwell, eEl * 6), 'Kennwerte Rheologie');
pruefe(nahe(zenerRelaxation(sig0, 1e6, tau), 0.4 * sig0, 1e-12) && nahe(kelvinKriechen(eEl, 1e6, tau), 2.5 * eEl, 1e-12), 'Grenzwerte t → ∞ (Zener 40 %, Kelvin 2,5·ε_el)');
pruefe(!rheologieKennwerte(sig0, 0).gueltig && !rheologieKennwerte(-1, 2).gueltig && !rheologieKennwerte(NaN, 2).gueltig, 'Rheologie: τ ≤ 0 / σ ≤ 0 → Fehler');

// 7. Fuzz-Test: 1 000 Zufallseingaben → endliche Werte, identisch zur Modulrechnung, Monotonie
let zufall = 2026;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
const ZK: Zementklasse[] = ['S', 'N', 'R'];
let n = 0;
for (let i = 0; i < 1000; i++) {
  const e: KriechSchwindEingabe = {
    fck: 12 + Math.floor(rnd() * 79), rh: 20 + rnd() * 80, h0: 50 + rnd() * 950, t0: 1 + Math.floor(rnd() * 365), ts: 1 + Math.floor(rnd() * 28), zement: ZK[Math.floor(rnd() * 3)],
  };
  const m = kriechSchwindModell(e);
  gleichModul(e, `Fuzz ${i}`);
  const t = 1 + rnd() * 30000;
  const werte = [m.phi0, m.betaH, m.epsCd0, kriechzahl(m, t), gesamtschwinden(m, t), wirksamerEModul(m, t), stuetzenVerformung(m, t).dL_tot,
    spannstahlRelaxation(ZK.indexOf(e.zement) + 1 + '' as Relaxationsklasse, 0.4 + rnd() * 0.4, 1 + rnd() * 5e5)];
  pruefe(m.gueltig && werte.every(Number.isFinite) && werte.every(x => x >= 0) && wirksamerEModul(m, t) <= m.Ecm, `Fuzz ${i}: ${JSON.stringify(e)} → ${JSON.stringify(werte)}`);
  const spaeter = t * 1.5;
  pruefe(kriechzahl(m, spaeter) >= kriechzahl(m, t) && gesamtschwinden(m, spaeter) >= gesamtschwinden(m, t) - 1e-18, `Fuzz ${i}: Zeitmonotonie`);
  if (e.rh >= 30) {
    const tr = kriechSchwindModell({ ...e, rh: e.rh - 10 });
    pruefe(tr.phi0 >= m.phi0 && tr.epsCd0 >= m.epsCd0, `Fuzz ${i}: trockener → mehr Kriechen und Schwinden`);
  }
  const rk2 = rheologieKennwerte(2 + rnd() * 48, 0.5 + rnd() * 7.5);
  pruefe(rk2.gueltig && [rk2.halbwertszeit, rk2.sigmaEndeMaxwell, rk2.sigmaEndeZener, rk2.epsEndeKelvin, rk2.epsEndeMaxwell].every(Number.isFinite), `Fuzz ${i}: Rheologie`);
  n++;
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Kriechen und Schwinden (${n} Fuzz-Fälle, identisch zur Modulrechnung)`);
