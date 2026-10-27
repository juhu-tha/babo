// Rechenkern Betonkennwerte (Z3): DIN EN 1992-1-1 mit NA – Festigkeit, Zugfestigkeit, E-Modul, Schwinden, Kriechen
import { betonkennwerte, beiwertKh, temperaturFaktor, type BetonkennwerteEingabe, type Zementklasse, type Gesteinskoernung } from '../src/calc/betonkennwerte';
import { dehnungsKennwerte } from '../src/data/kennwerte';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
const relNahe = (ist: number, soll: number, rel = 1e-12) => ist === soll || Math.abs(ist - soll) <= rel * Math.max(1, Math.abs(soll));
console.log('--- Test: Betonkennwerte ---');

/**
 * Referenz: wörtliche Kopie der Rechnung aus src/modules/Betonkennwerte.tsx (useMemo calcResults, Stand origin/main 26.10.2026).
 * Sie belegt, dass der Kern das bisherige Verhalten exakt übernimmt; bei der Verdrahtung (Z11) entfällt die Kopie im Modul.
 * Runde 5 (Z55, Entscheidung Prof. Huber „normgemäß korrigieren“): f_ck(t) = f_ck für t ≥ 28 d (3.1.2(5)), ε_cu1/ε_c2/ε_cu2/n
 * nach Tab. 3.1 (Klassenwerte, über C90/105 gehalten), h_0 ohne Klemmung auf 20 … 1500 mm, A_c und u ohne Ersatzwerte.
 */
function modulReferenz(fck: number, cementClass: Zementklasse, aggregateType: Gesteinskoernung, relativeHumidity: number, areaAc: number, perimeterU: number,
  elementHeightH: number, curingDaysTs: number, loadingAgeT0: number, targetAgeT: number, ambientTempT: number, axialStressSigmaC: number, elementLengthL: number) {
  const fcm = fck + 8;
  const alphaCc = 0.85;
  const gammaC = 1.50;
  // Entscheidung Prof. Huber 27.10.: ab C55/67 zusätzlich · (1,1 − f_ck/500) (vorläufig, F-Freigabe)
  const fcd = (alphaCc * fck * (fck >= 55 ? Math.min(1, 1.1 - fck / 500) : 1)) / gammaC;
  let s = 0.25;
  if (cementClass === 'S') s = 0.38;
  else if (cementClass === 'R') s = 0.20;
  const tempFactor = Math.exp(-((4000 / (273 + ambientTempT)) - 13.65));
  const t0Temp = Math.max(0.1, loadingAgeT0 * tempFactor);
  const tTemp = Math.max(0.1, targetAgeT * tempFactor);
  const betaCcT0 = Math.exp(s * (1 - Math.sqrt(28 / t0Temp)));
  const fcmT0 = betaCcT0 * fcm;
  const fckT0 = t0Temp >= 28 ? fck : Math.max(0, fcmT0 - 8);
  const betaCcT = Math.exp(s * (1 - Math.sqrt(28 / tTemp)));
  const fcmT = betaCcT * fcm;
  const fckT = tTemp >= 28 ? fck : Math.max(0, fcmT - 8);
  let fctm = 0;
  if (fck <= 50) fctm = 0.30 * Math.pow(fck, 2 / 3);
  else fctm = 2.12 * Math.log(1 + fcm / 10);
  const fctk005 = 0.70 * fctm;
  const fctk095 = 1.30 * fctm;
  const alphaCt = 0.85;
  const fctd = (alphaCt * fctk005) / gammaC;
  const hMm = Math.max(50, elementHeightH);
  const scaleFactor = Math.max(1.0, 1.6 - hMm / 1000);
  const fctmFl = scaleFactor * fctm;
  const fctSp = fctm / 0.90;
  const alphaExponent = targetAgeT < 28 ? 1.0 : (2 / 3);
  const fctmT = Math.pow(betaCcT, alphaExponent) * fctm;
  let alphaE = 1.0;
  if (aggregateType === 'basalt') alphaE = 1.2;
  else if (aggregateType === 'kalkstein') alphaE = 0.9;
  else if (aggregateType === 'sandstein') alphaE = 0.7;
  const Ecm = 22000 * Math.pow(fcm / 10, 0.3) * alphaE;
  const Ec0 = 1.05 * Ecm;
  const EcmT0 = Math.pow(betaCcT0, 0.3) * Ecm;
  const EcmT = Math.pow(betaCcT, 0.3) * Ecm;
  const Gcm = Ecm / (2 * (1 + 0.20));
  const epsC1 = Math.min(2.8, 0.7 * Math.pow(fcm, 0.31));
  const dk = dehnungsKennwerte(fck);
  const epsCu1 = dk.ecu1;
  // Z11: Formelfehler korrigiert – im Modul stand (fcm / 1000) im Nenner (k 1000-fach zu groß)
  const kPlastizitaet = (1.05 * Ecm * (epsC1 / 1000)) / fcm;
  const epsC2 = dk.ec2, epsCu2 = dk.ecu2, exponentN = dk.n;
  const AcMm2 = areaAc * 1e6;
  const uMm = perimeterU * 1e3;
  const h0 = (2 * AcMm2) / uMm;
  const epsCaInfty = 2.5 * Math.max(0, fck - 10) * 1e-6;
  const betaAs = 1 - Math.exp(-0.2 * Math.sqrt(Math.max(0, targetAgeT)));
  const epsCa = betaAs * epsCaInfty;
  let alphaDs1 = 4, alphaDs2 = 0.12;
  if (cementClass === 'S') { alphaDs1 = 3; alphaDs2 = 0.13; }
  else if (cementClass === 'R') { alphaDs1 = 6; alphaDs2 = 0.11; }
  const RH = Math.min(100, Math.max(20, relativeHumidity));
  const betaRH = 1.55 * (1 - Math.pow(RH / 100, 3));
  const epsCd0 = 0.85 * ((220 + 110 * alphaDs1) * Math.exp(-alphaDs2 * (fcm / 10))) * 1e-6 * betaRH;
  let kh = 1.0;
  if (h0 <= 100) kh = 1.0;
  else if (h0 <= 200) kh = 1.0 - ((h0 - 100) / 100) * 0.15;
  else if (h0 <= 300) kh = 0.85 - ((h0 - 200) / 100) * 0.10;
  else if (h0 <= 500) kh = 0.75 - ((h0 - 300) / 200) * 0.05;
  else kh = 0.70;
  const deltaTds = Math.max(0, targetAgeT - curingDaysTs);
  const betaDs = deltaTds / (deltaTds + 0.04 * Math.sqrt(Math.pow(h0, 3)));
  const epsCd = betaDs * kh * epsCd0;
  const epsCs = epsCd + epsCa;
  const deltaLShrinkMm = epsCs * (elementLengthL * 1000);
  let phiRH = 1.0, alpha1 = 1.0, alpha2 = 1.0, alpha3 = 1.0;
  if (fcm <= 35) {
    phiRH = 1 + (1 - RH / 100) / (0.10 * Math.cbrt(h0));
  } else {
    alpha1 = Math.pow(35 / fcm, 0.7);
    alpha2 = Math.pow(35 / fcm, 0.2);
    alpha3 = Math.pow(35 / fcm, 0.5);
    phiRH = (1 + ((1 - RH / 100) / (0.10 * Math.cbrt(h0))) * alpha1) * alpha2;
  }
  const betaFcm = 16.8 / Math.sqrt(Math.max(1, fcm));
  let alphaCementMod = 0;
  if (cementClass === 'S') alphaCementMod = -1;
  else if (cementClass === 'R') alphaCementMod = 1;
  const t0Eff = Math.max(0.5, t0Temp * Math.pow((9 / (2 + Math.pow(t0Temp, 1.2))) + 1, alphaCementMod));
  const betaT0 = 1 / (0.1 + Math.pow(t0Eff, 0.20));
  const phi0 = phiRH * betaFcm * betaT0;
  let betaH = 1.5 * (1 + Math.pow(0.012 * RH, 18)) * h0 + 250;
  if (fcm <= 35) betaH = Math.min(1500, betaH);
  else betaH = Math.min(1500 * alpha3, 1.5 * (1 + Math.pow(0.012 * RH, 18)) * h0 + 250 * alpha3);
  const deltaTcreep = Math.max(0, targetAgeT - loadingAgeT0);
  const betaC = Math.pow(deltaTcreep / (betaH + deltaTcreep), 0.3);
  const phiLinear = phi0 * betaC;
  const stressLimitLin = 0.45 * fckT0;
  const stressLimitMax = 0.60 * fckT0;
  const isNonlinearCreep = axialStressSigmaC > stressLimitLin;
  let kSigma = 0;
  let phiFinal = phiLinear;
  if (fckT0 > 0) {
    kSigma = axialStressSigmaC / fckT0;
    if (isNonlinearCreep) phiFinal = phiLinear * Math.exp(1.5 * (kSigma - 0.45));
  }
  const epsCc = (phiFinal * axialStressSigmaC) / Ec0;
  const deltaLCreepMm = epsCc * (elementLengthL * 1000);
  const EcEff = Ecm / (1 + phiFinal);
  const EcEffZwang = Ecm / (1 + 0.80 * phiFinal);
  const Ecm2025 = 9500 * Math.pow(fcm, 1 / 3);
  const etaFc2025 = Math.min(1.0, Math.pow(40 / Math.max(1, fck), 1 / 3));
  return { fck, fcm, fcd, s, betaCcT0, fcmT0, fckT0, betaCcT, fcmT, fckT, fctm, fctk005, fctk095, fctd, fctmFl, fctSp, fctmT, alphaE, Ecm, Ec0, EcmT0, EcmT, Gcm,
    epsC1, epsCu1, kPlastizitaet, epsC2, epsCu2, exponentN, h0, kh, epsCd0, epsCd, epsCa, epsCs, deltaLShrinkMm, phi0, phiLinear, phiFinal, isNonlinearCreep,
    stressLimitLin, stressLimitMax, kSigma, epsCc, deltaLCreepMm, EcEff, EcEffZwang, Ecm2025, etaFc2025 };
}

const STANDARD: BetonkennwerteEingabe = { fck: 30, zementklasse: 'N', gestein: 'quarzit', rh: 65, ac: 0.20, u: 1.8, h: 300, ts: 3, t0: 28, t: 18250, temperatur: 20, sigmaC: 8, laenge: 12 };
const ref = (e: BetonkennwerteEingabe) => modulReferenz(e.fck, e.zementklasse, e.gestein, e.rh, e.ac, e.u, e.h, e.ts, e.t0, e.t, e.temperatur, e.sigmaC, e.laenge);
function gleichModul(e: BetonkennwerteEingabe, tag: string) {
  const k = betonkennwerte(e) as unknown as Record<string, number | boolean>;
  const r = ref(e) as unknown as Record<string, number | boolean>;
  for (const [name, soll] of Object.entries(r)) {
    const ist = k[name];
    const ok = typeof soll === 'boolean' ? ist === soll : (Number.isNaN(soll) ? Number.isNaN(ist as number) : relNahe(ist as number, soll));
    if (!ok) { fehler.push(`${tag}: ${name} Kern ${ist} ≠ Modul ${soll}`); return; }
  }
}

// 1. Handrechnung C30/37, CEM N, Quarzit, RH 65 %, A_c = 0,20 m², u = 1,8 m, t_0 = 28 d, t = 50 a, T = 20 °C, σ_c = 8 N/mm², L = 12 m
//    f_cm = 38; f_cd = 0,85·30/1,5 = 17,0; f_ctm = 0,3·30^(2/3) = 2,896; f_ctk;0,05 = 2,028; f_ctd = 0,85·2,028/1,5 = 1,149
//    E_cm = 22 000·3,8^0,3 = 32 837 N/mm²; G_cm = 13 682; ε_c1 = 0,7·38^0,31 = 2,162 ‰
//    h_0 = 2·200 000/1800 = 222,2 mm; k_h = 0,85 − 0,2222·0,10 = 0,8278
//    ε_ca = 2,5·20·10⁻⁶·(1 − e^(−0,2·√18250)) = 50,0·10⁻⁶; ε_cd,0 = 0,85·660·e^(−0,456)·10⁻⁶·1,55·(1 − 0,65³) = 399,8·10⁻⁶
//    ε_cd = 0,99973·0,8278·399,8·10⁻⁶ = 328,5·10⁻⁶; ε_cs = 378,5·10⁻⁶ → ΔL = 4,54 mm
//    φ_RH = 1,5203; β(f_cm) = 16,8/√38 = 2,7253; t_T = 28·0,99812 = 27,95 d → β(t_0) = 0,48862; φ_0 = 2,0245
//    β_H = min(1500·0,9597; 1,5·(1 + 0,78¹⁸)·222,2 + 250·0,9597) = 577,07; β_c = (18222/(577,07 + 18222))^0,3 = 0,99069 → φ = 2,0057
//    k_σ = 8/29,99 = 0,267 < 0,45 → linear; ε_cc = 2,0057·8/(1,05·32 837) = 465,4·10⁻⁶ → ΔL = 5,58 mm; E_c,eff = 32 837/3,0057 = 10 925
const b = betonkennwerte(STANDARD);
pruefe(b.gueltig && b.hinweise.length === 0, `Standardfall ohne Hinweise (${b.hinweise.map(x => x.text).join(' | ')})`);
pruefe(b.fcm === 38 && nahe(b.fcd, 17.0, 1e-12) && nahe(b.fctm, 2.8965, 1e-4) && nahe(b.fctk005, 2.0275, 1e-4) && nahe(b.fctd, 1.1489, 1e-4), `Festigkeiten ${b.fcd} ${b.fctm} ${b.fctd}`);
pruefe(nahe(b.fctk095, 3.7654, 1e-4) && nahe(b.fctSp, 3.2183, 1e-4) && nahe(b.fctmFl, 1.3 * b.fctm, 1e-12), `Zugfestigkeiten ${b.fctk095} ${b.fctSp} ${b.fctmFl}`);
pruefe(nahe(b.Ecm, 32836.6, 0.1) && nahe(b.Gcm, 13681.9, 0.1) && nahe(b.Ec0, 1.05 * b.Ecm, 1e-9) && nahe(b.epsC1, 2.1619, 1e-4), `E-Modul ${b.Ecm} ${b.Gcm} ${b.epsC1}`);
pruefe(nahe(b.h0, 222.222, 1e-3) && nahe(b.kh, 0.82778, 1e-5), `h0/kh ${b.h0} ${b.kh}`);
pruefe(nahe(b.epsCa, 50.0e-6, 1e-9) && nahe(b.epsCd0, 399.78e-6, 1e-8) && nahe(b.epsCd, 328.54e-6, 1e-8) && nahe(b.deltaLShrinkMm, 4.5425, 1e-4), `Schwinden ${b.epsCa} ${b.epsCd0} ${b.epsCd} ${b.deltaLShrinkMm}`);
pruefe(nahe(b.phi0, 2.02452, 1e-5) && nahe(b.phiFinal, 2.00567, 1e-5) && !b.isNonlinearCreep && nahe(b.kSigma, 0.26675, 1e-5), `Kriechen ${b.phi0} ${b.phiFinal} ${b.kSigma}`);
pruefe(nahe(b.epsCc, 465.37e-6, 1e-8) && nahe(b.deltaLCreepMm, 5.5845, 1e-4) && nahe(b.EcEff, 10924.9, 0.1) && nahe(b.EcEffZwang, 12607.5, 0.1), `Kriechdehnung ${b.epsCc} ${b.EcEff}`);
pruefe(nahe(b.Ecm2025, 31938.8, 0.1) && nahe(b.etaFc2025, 1.0, 1e-12) && nahe(b.fckT0, 29.991, 1e-3), `2025/fck(t0) ${b.Ecm2025} ${b.etaFc2025} ${b.fckT0}`);
//    Plastizitätszahl k = 1,05·E_cm·ε_c1/f_cm = 1,05·32 836,6·0,0021619/38 = 1,9616 (Gl. 3.14, früher 1000-fach zu groß)
pruefe(nahe(b.kPlastizitaet, 1.9616, 1e-3), `k (Gl. 3.14) ${b.kPlastizitaet}`);
gleichModul(STANDARD, 'Standardfall');

// 2. Zweige: hochfest (C55/67, f_ck > 50), f_cm ≤ 35 (C25/30), Zement S/R, Gesteine, nichtlineares Kriechen
//    C55/67: f_ctm = 2,12·ln(1 + 6,3) = 4,214; Tab. 3.1 (Klassenwerte): ε_c2 = 2,2; ε_cu2 = 3,1; n = 1,75; ε_cu1 = 3,2
//    (Gleichungen der Tab. 3.1 ergeben gerundet dieselben Werte: 2,1995 / 3,125 / 1,751 / 3,205)
const hf = betonkennwerte({ ...STANDARD, fck: 55 });
pruefe(nahe(hf.fctm, 4.2143, 1e-4) && hf.epsC2 === 2.2 && hf.epsCu2 === 3.1 && hf.exponentN === 1.75 && hf.epsCu1 === 3.2, `C55/67 ${hf.fctm} ${hf.epsC2} ${hf.epsCu2} ${hf.exponentN} ${hf.epsCu1}`);
//    Zwischenwert f_ck = 65 nach den Gleichungen: ε_cu2 = 2,6 + 35·0,25⁴ = 2,7367; n = 1,4 + 23,4·0,25⁴ = 1,4914
const c65 = betonkennwerte({ ...STANDARD, fck: 65 });
pruefe(nahe(c65.epsCu2, 2.73672, 1e-5) && nahe(c65.exponentN, 1.49141, 1e-5), `f_ck = 65: ${c65.epsCu2} ${c65.exponentN}`);
//    Über C90/105 (Z55): Werte von C90/105 gehalten statt erneut ansteigend (vorher f_ck = 110: ε_cu2 = 2,6056, n = 1,4037)
const c110 = betonkennwerte({ ...STANDARD, fck: 110 });
pruefe(c110.epsCu2 === 2.6 && c110.exponentN === 1.4 && c110.epsCu1 === 2.8 && c110.epsC2 === 2.6, `f_ck = 110: ${c110.epsCu2} ${c110.exponentN} ${c110.epsCu1}`);
//    f_ck(t) für t ≥ 28 d (3.1.2(5)): f_ck(50 a) = f_ck = 30 (vorher f_cm(t) − 8 = 40,3); 7 d: β_cc = e^(0,25·(1 − 2)) = 0,7788 → 38·0,7788 − 8 = 21,59
pruefe(b.fckT === 30 && nahe(betonkennwerte({ ...STANDARD, t: 7, t0: 7, temperatur: 20 }).fckT, 38 * Math.exp(0.25 * (1 - Math.sqrt(28 / (7 * temperaturFaktor(20))))) - 8, 1e-9), `f_ck(t) ${b.fckT}`);
pruefe(betonkennwerte({ ...STANDARD, t0: 90 }).fckT0 === 30 && betonkennwerte({ ...STANDARD, t0: 90 }).stressLimitLin === 0.45 * 30, 'f_ck(t₀ = 90 d) = f_ck → 0,45·f_ck');
const c25 = betonkennwerte({ ...STANDARD, fck: 25 });
//    C25/30: φ_RH = 1 + 0,35/(0,1·222,2^(1/3)) = 1,5770 (ohne α-Beiwerte)
pruefe(nahe(c25.phi0 / (16.8 / Math.sqrt(33)) / (1 / (0.1 + Math.pow(28 * temperaturFaktor(20), 0.2))), 1 + 0.35 / (0.1 * Math.cbrt(2e5 / 900)), 1e-9), 'f_cm ≤ 35: φ_RH ohne α-Beiwerte');
const nl = betonkennwerte({ ...STANDARD, sigmaC: 15 });
pruefe(nl.isNonlinearCreep && nahe(nl.phiFinal, nl.phiLinear * Math.exp(1.5 * (15 / nl.fckT0 - 0.45)), 1e-12), 'nichtlineares Kriechen Gl. (3.7)');
pruefe(betonkennwerte({ ...STANDARD, sigmaC: 19 }).hinweise.some(x => x.feld === 'sigmaC'), 'σ_c > 0,6·f_ck(t0) → Warnung');
for (const z of ['S', 'N', 'R'] as const) for (const g of ['quarzit', 'kalkstein', 'sandstein', 'basalt'] as const) for (const fck of [12, 25, 30, 50, 55, 70, 90, 100]) {
  gleichModul({ ...STANDARD, zementklasse: z, gestein: g, fck }, `Zweig ${z}/${g}/C${fck}`);
}
pruefe(betonkennwerte({ ...STANDARD, gestein: 'basalt' }).Ecm / b.Ecm > 1.2 - 1e-12 && betonkennwerte({ ...STANDARD, gestein: 'sandstein' }).alphaE === 0.7, 'α_E Basalt/Sandstein');
// Zement R erhärtet anfangs schneller: β_cc(7 d) R > N > S
const bcc7 = (z: Zementklasse) => betonkennwerte({ ...STANDARD, zementklasse: z, t: 7 }).betaCcT;
pruefe(bcc7('R') > bcc7('N') && bcc7('N') > bcc7('S'), 'β_cc(7 d): R > N > S');
// t < 28 d → Exponent α = 1 in Gl. (3.4)
const jung = betonkennwerte({ ...STANDARD, t: 7, t0: 3 });
pruefe(nahe(jung.fctmT, jung.betaCcT * jung.fctm, 1e-12), 'f_ctm(t) mit α = 1 für t < 28 d');

// 3. Tabellenwerte k_h (Tab. 3.3) und Temperaturfaktor
pruefe(beiwertKh(100) === 1 && nahe(beiwertKh(200), 0.85, 1e-12) && nahe(beiwertKh(300), 0.75, 1e-12) && nahe(beiwertKh(500), 0.70, 1e-12) && beiwertKh(900) === 0.70, 'k_h Stützstellen');
pruefe(nahe(temperaturFaktor(20), 0.99812, 1e-5) && temperaturFaktor(30) > 1 && temperaturFaktor(5) < 1, 'Temperaturfaktor');

// 4. Randfälle und Plausibilität
pruefe(!betonkennwerte({ ...STANDARD, fck: 0 }).gueltig && !betonkennwerte({ ...STANDARD, fck: NaN }).gueltig, 'f_ck ≤ 0 / NaN → Fehler');
pruefe(!betonkennwerte({ ...STANDARD, t: 0 }).gueltig && !betonkennwerte({ ...STANDARD, temperatur: -300 }).gueltig, 't = 0 / T < −273 °C → Fehler');
const vorBel = betonkennwerte({ ...STANDARD, t: 20, t0: 28 });
pruefe(vorBel.phiFinal === 0 && vorBel.hinweise.some(x => x.feld === 't'), 't < t0 → φ = 0 mit Hinweis');
pruefe(betonkennwerte({ ...STANDARD, rh: 30 }).hinweise.some(x => x.feld === 'rh') && betonkennwerte({ ...STANDARD, ac: 10, u: 1 }).hinweise.some(x => x.feld === 'ac'), 'Klemmung RH / h0 > 1500 → Warnung');
//    h_0 ohne Klemmung (Z55, wie kriechenSchwinden.ts): A_c = 10 m², u = 1 m → h_0 = 20 000 mm, k_h = 0,70
const massig = betonkennwerte({ ...STANDARD, ac: 10, u: 1 });
pruefe(massig.h0 === 20000 && massig.kh === 0.7 && massig.gueltig, `h0 ungeklemmt ${massig.h0}`);
pruefe(!betonkennwerte({ ...STANDARD, ac: 0 }).gueltig && !betonkennwerte({ ...STANDARD, u: 0 }).gueltig, 'A_c = 0 / u = 0 → Fehler statt Ersatzwert');
pruefe(betonkennwerte({ ...STANDARD, rh: 100 }).epsCd === 0, 'RH = 100 % → kein Trocknungsschwinden');
pruefe(betonkennwerte({ ...STANDARD, fck: 100 }).hinweise.some(x => x.feld === 'fck'), 'f_ck > 90 → Warnung Tab. 3.1');
gleichModul({ ...STANDARD, rh: 10, ac: 0.05, u: 0.5, h: 10, t: 1, t0: 1, ts: 5, temperatur: -10 }, 'Klemmungen');

// 5. Fuzz-Test: Zufallseingaben → endliche Ergebnisse, identisch zur Modulrechnung, Monotonie
let zufall = 4711;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
const KLASSEN = [12, 16, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90];
const ZK: Zementklasse[] = ['S', 'N', 'R'];
const GK: Gesteinskoernung[] = ['quarzit', 'kalkstein', 'sandstein', 'basalt'];
let n = 0;
for (let i = 0; i < 1000; i++) {
  const t0 = 3 + Math.floor(rnd() * 90);
  const e: BetonkennwerteEingabe = {
    fck: KLASSEN[Math.floor(rnd() * KLASSEN.length)], zementklasse: ZK[Math.floor(rnd() * 3)], gestein: GK[Math.floor(rnd() * 4)],
    rh: 40 + rnd() * 60, ac: 0.01 + rnd() * 2, u: 0.4 + rnd() * 6, h: 50 + rnd() * 1500, ts: 1 + Math.floor(rnd() * 14), t0,
    t: t0 + 1 + rnd() * 30000, temperatur: 5 + rnd() * 30, sigmaC: rnd() * 12, laenge: 1 + rnd() * 40,
  };
  const r = betonkennwerte(e);
  gleichModul(e, `Fuzz ${i}`);
  const werte = [r.fcd, r.fctm, r.fctd, r.Ecm, r.EcmT, r.epsCs, r.phiFinal, r.epsCc, r.EcEff, r.deltaLShrinkMm, r.deltaLCreepMm];
  pruefe(r.gueltig && werte.every(Number.isFinite) && r.phiFinal >= 0 && r.epsCs >= 0 && r.EcEff > 0 && r.EcEff <= r.Ecm, `Fuzz ${i}: ${JSON.stringify(werte)}`);
  // Monotonie: späterer Zeitpunkt → mehr Schwinden und Kriechen, höhere Festigkeit
  const spaeter = betonkennwerte({ ...e, t: e.t * 1.5 });
  pruefe(spaeter.epsCs >= r.epsCs - 1e-15 && spaeter.phiLinear >= r.phiLinear - 1e-12 && spaeter.fcmT >= r.fcmT, `Fuzz ${i}: Zeitmonotonie`);
  // trockenere Luft → mehr Trocknungsschwinden und Kriechen
  const trocken = betonkennwerte({ ...e, rh: e.rh - 10 });
  pruefe(trocken.epsCd >= r.epsCd && trocken.phi0 >= r.phi0, `Fuzz ${i}: Feuchtemonotonie`);
  n++;
}
// höhere Festigkeitsklasse → höherer E-Modul und höhere Zugfestigkeit, kleinere Grundkriechzahl
for (let i = 1; i < KLASSEN.length; i++) {
  const a = betonkennwerte({ ...STANDARD, fck: KLASSEN[i - 1] }), c = betonkennwerte({ ...STANDARD, fck: KLASSEN[i] });
  pruefe(c.Ecm > a.Ecm && c.fctm > a.fctm && c.phi0 < a.phi0, `Klassenmonotonie C${KLASSEN[i - 1]} → C${KLASSEN[i]}`);
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Betonkennwerte (${n} Fuzz-Fälle, identisch zur Modulrechnung)`);
