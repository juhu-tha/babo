/**
 * Rechenkern Betonkennwerte nach DIN EN 1992-1-1:2011-01 mit DIN EN 1992-1-1/NA:2013-04 (Z3).
 * Übernimmt die Gleichungsfolge aus src/modules/Betonkennwerte.tsx unverändert (Verdrahtung in Z11):
 *  1. Druckfestigkeit: f_cm = f_ck + 8; f_cd = α_cc·f_ck/γ_c (α_cc = 0,85, γ_c = 1,50)
 *     Festigkeitsentwicklung β_cc(t) = exp[s·(1 − √(28/t_T))] (Gl. 3.2) mit temperaturangepasstem Alter
 *     t_T = t·exp[−(4000/(273 + T) − 13,65)] (Anhang B, Gl. B.10), f_ck(t) = f_cm(t) − 8
 *  2. Zugfestigkeit: f_ctm = 0,30·f_ck^(2/3) (≤ C50/60) bzw. 2,12·ln(1 + f_cm/10); f_ctk;0,05 = 0,7·f_ctm,
 *     f_ctk;0,95 = 1,3·f_ctm, f_ctd = α_ct·f_ctk;0,05/γ_c (α_ct = 0,85 NA), f_ctm,fl = max(1,6 − h/1000; 1)·f_ctm (Gl. 3.23),
 *     f_ct,sp = f_ctm/0,9 (Gl. 3.3), f_ctm(t) = β_cc(t)^α·f_ctm (Gl. 3.4; α = 1 für t < 28 d, sonst 2/3)
 *  3. E-Modul: E_cm = 22 000·(f_cm/10)^0,3·α_E [N/mm²] (Tab. 3.1, 3.1.3(2)), E_c0 = 1,05·E_cm, E_cm(t) = β_cc(t)^0,3·E_cm (Gl. 3.5),
 *     G_cm = E_cm/(2·(1 + ν)) mit ν = 0,2
 *  4. Spannungs-Dehnungs-Linie (Tab. 3.1): ε_c1, ε_cu1, k (Gl. 3.14), ε_c2, ε_cu2, n
 *  5. Schwinden (3.1.4, Anhang B.2): h_0 = 2·A_c/u, ε_ca(t) (Gl. 3.11–3.13), ε_cd(t) (Gl. 3.9, 3.10, B.11, B.12), k_h (Tab. 3.3)
 *  6. Kriechen (Anhang B.1): φ_RH, β(f_cm), β(t_0) mit t_0,eff (Gl. B.9), β_H, β_c(t,t_0), nichtlineares Kriechen (Gl. 3.7),
 *     ε_cc = φ·σ_c/E_c0, E_c,eff = E_cm/(1 + φ) (Gl. 7.20), E_c,eff,Zwang = E_cm/(1 + 0,8·φ)
 *  7. Vorschau DIN EN 1992-1-1:2025-09: E_cm = 9500·f_cm^(1/3), η_cc = min(1; (40/f_ck)^(1/3))
 * Einheiten: Festigkeiten und Moduln in N/mm² (MPa), Dehnungen ε_c1 … ε_cu2 in ‰, Schwind- und Kriechdehnungen
 * dimensionslos (–), Längen in mm (Ausnahme: A_c in m², u und Bauteillänge in m), Zeiten in Tagen, Temperatur in °C.
 * Die Klemmungen der Moduldatei (h ≥ 50 mm, 20 ≤ h_0 ≤ 1500 mm, 20 ≤ RH ≤ 100 %, t_T ≥ 0,1 d) bleiben erhalten;
 * sie werden als Warnung gemeldet, wenn sie greifen. Reiner Rechenkern – geprüft in tests/betonkennwerte.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss } from './plausibilitaet';

export type Zementklasse = 'S' | 'N' | 'R';
export type Gesteinskoernung = 'quarzit' | 'kalkstein' | 'sandstein' | 'basalt';

/** Beiwert α_E für die Gesteinskörnung nach DIN EN 1992-1-1, 3.1.3(2) */
export const ALPHA_E: Readonly<Record<Gesteinskoernung, number>> = { quarzit: 1.0, kalkstein: 0.9, sandstein: 0.7, basalt: 1.2 };
/** Zementbeiwert s nach Gl. (3.2) */
export const ZEMENT_S: Readonly<Record<Zementklasse, number>> = { S: 0.38, N: 0.25, R: 0.20 };
/** Beiwerte α_ds1, α_ds2 nach Gl. (B.11) */
export const ZEMENT_DS: Readonly<Record<Zementklasse, { ads1: number; ads2: number }>> = {
  S: { ads1: 3, ads2: 0.13 }, N: { ads1: 4, ads2: 0.12 }, R: { ads1: 6, ads2: 0.11 },
};
/** Exponent α nach Gl. (B.9) */
export const ZEMENT_ALPHA: Readonly<Record<Zementklasse, number>> = { S: -1, N: 0, R: 1 };

/** Teilsicherheits- und Abminderungsbeiwerte nach DIN EN 1992-1-1/NA (DE) */
export const EC2_BETON_NA = { alphaCc: 0.85, alphaCt: 0.85, gammaC: 1.5, nu: 0.2, rhoRelax: 0.8 } as const;

export interface BetonkennwerteEingabe {
  /** charakteristische Zylinderdruckfestigkeit f_ck in N/mm² (Klassenwert aus Tab. 3.1) */
  fck: number;
  zementklasse: Zementklasse;
  gestein: Gesteinskoernung;
  /** relative Luftfeuchte RH in % */
  rh: number;
  /** Querschnittsfläche A_c in m² */
  ac: number;
  /** der Trocknung ausgesetzter Umfang u in m */
  u: number;
  /** Bauteilhöhe h in mm (für f_ctm,fl) */
  h: number;
  /** Nachbehandlungsdauer t_s in d */
  ts: number;
  /** Belastungsalter t_0 in d */
  t0: number;
  /** betrachtetes Betonalter t in d */
  t: number;
  /** mittlere Temperatur T in °C */
  temperatur: number;
  /** Dauerdruckspannung σ_c in N/mm² */
  sigmaC: number;
  /** Bauteillänge L in m */
  laenge: number;
}

export interface BetonkennwerteErgebnis {
  fck: number; fcm: number; fcd: number;
  /** Zementbeiwert s */
  s: number;
  betaCcT0: number; fcmT0: number; fckT0: number;
  betaCcT: number; fcmT: number; fckT: number;
  fctm: number; fctk005: number; fctk095: number; fctd: number; fctmFl: number; fctSp: number; fctmT: number;
  alphaE: number; Ecm: number; Ec0: number; EcmT0: number; EcmT: number; Gcm: number;
  /** Dehnungen in ‰, Exponent n und Plastizitätszahl k dimensionslos */
  epsC1: number; epsCu1: number; kPlastizitaet: number; epsC2: number; epsCu2: number; exponentN: number;
  /** wirksame Bauteildicke h_0 in mm, Beiwert k_h */
  h0: number; kh: number;
  /** Schwinddehnungen (dimensionslos) */
  epsCd0: number; epsCd: number; epsCa: number; epsCs: number;
  /** Verkürzung aus Schwinden in mm */
  deltaLShrinkMm: number;
  phi0: number; phiLinear: number; phiFinal: number;
  isNonlinearCreep: boolean;
  /** 0,45·f_ck(t_0) und 0,60·f_ck(t_0) in N/mm² */
  stressLimitLin: number; stressLimitMax: number;
  kSigma: number;
  /** Kriechdehnung (dimensionslos) und Verkürzung aus Kriechen in mm */
  epsCc: number; deltaLCreepMm: number;
  EcEff: number; EcEffZwang: number;
  /** Vorschau EC2 2. Generation */
  Ecm2025: number; etaFc2025: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

/** Temperaturfaktor exp[−(4000/(273 + T) − 13,65)] nach Gl. (B.10) für ein konstantes T in °C */
export function temperaturFaktor(temperatur: number): number {
  return Math.exp(-((4000 / (273 + temperatur)) - 13.65));
}

/** Geometriebeiwert k_h nach Tab. 3.3, linear interpoliert (h_0 in mm) */
export function beiwertKh(h0: number): number {
  if (h0 <= 100) return 1.0;
  if (h0 <= 200) return 1.0 - ((h0 - 100) / 100) * 0.15;
  if (h0 <= 300) return 0.85 - ((h0 - 200) / 100) * 0.10;
  if (h0 <= 500) return 0.75 - ((h0 - 300) / 200) * 0.05;
  return 0.70;
}

export function betonkennwerte(e: BetonkennwerteEingabe): BetonkennwerteErgebnis {
  const hinweise: Hinweis[] = [];
  const { fck, zementklasse, gestein, rh, ac, u, h, ts, t0, t, temperatur, sigmaC, laenge } = e;
  muss(hinweise, istEndlich(fck, rh, ac, u, h, ts, t0, t, temperatur, sigmaC, laenge), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  muss(hinweise, fck > 0, 'fck', 'f_ck muss größer als 0 sein.');
  muss(hinweise, temperatur > -273, 'temperatur', 'Die Temperatur muss über dem absoluten Nullpunkt liegen.');
  muss(hinweise, t > 0 && t0 > 0, 't', 'Betonalter t und Belastungsalter t₀ müssen größer als 0 sein.');

  // 1. Druckfestigkeit
  const fcm = fck + 8;
  const { alphaCc, alphaCt, gammaC, nu, rhoRelax } = EC2_BETON_NA;
  const fcd = (alphaCc * fck) / gammaC;
  const s = ZEMENT_S[zementklasse];
  const tempFactor = temperaturFaktor(temperatur);
  const t0Temp = Math.max(0.1, t0 * tempFactor);
  const tTemp = Math.max(0.1, t * tempFactor);
  const betaCcT0 = Math.exp(s * (1 - Math.sqrt(28 / t0Temp)));
  const fcmT0 = betaCcT0 * fcm;
  const fckT0 = Math.max(0, fcmT0 - 8);
  const betaCcT = Math.exp(s * (1 - Math.sqrt(28 / tTemp)));
  const fcmT = betaCcT * fcm;
  const fckT = Math.max(0, fcmT - 8);

  // 2. Zugfestigkeit
  const fctm = fck <= 50 ? 0.30 * Math.pow(fck, 2 / 3) : 2.12 * Math.log(1 + fcm / 10);
  const fctk005 = 0.70 * fctm;
  const fctk095 = 1.30 * fctm;
  const fctd = (alphaCt * fctk005) / gammaC;
  const hMm = Math.max(50, h);
  const fctmFl = Math.max(1.0, 1.6 - hMm / 1000) * fctm;
  const fctSp = fctm / 0.90;
  const alphaExponent = t < 28 ? 1.0 : 2 / 3;
  const fctmT = Math.pow(betaCcT, alphaExponent) * fctm;

  // 3. E-Modul
  const alphaE = ALPHA_E[gestein];
  const Ecm = 22000 * Math.pow(fcm / 10, 0.3) * alphaE;
  const Ec0 = 1.05 * Ecm;
  const EcmT0 = Math.pow(betaCcT0, 0.3) * Ecm;
  const EcmT = Math.pow(betaCcT, 0.3) * Ecm;
  const Gcm = Ecm / (2 * (1 + nu));

  // 4. Spannungs-Dehnungs-Linie
  const epsC1 = Math.min(2.8, 0.7 * Math.pow(fcm, 0.31));
  const epsCu1 = fck > 50 ? 2.8 + 27 * Math.pow((98 - fcm) / 100, 4) : 3.5;
  const kPlastizitaet = (1.05 * Ecm * (epsC1 / 1000)) / (fcm / 1000);
  let epsC2 = 2.0, epsCu2 = 3.5, exponentN = 2.0;
  if (fck > 50) {
    epsC2 = 2.0 + 0.085 * Math.pow(fck - 50, 0.53);
    epsCu2 = 2.6 + 35 * Math.pow((90 - fck) / 100, 4);
    exponentN = 1.4 + 23.4 * Math.pow((90 - fck) / 100, 4);
  }

  // 5. Schwinden
  const AcMm2 = Math.max(0.001, ac) * 1e6;
  const uMm = Math.max(0.01, u) * 1e3;
  const h0Roh = (2 * AcMm2) / uMm;
  const h0 = Math.min(1500, Math.max(20, h0Roh));
  const epsCaInfty = 2.5 * Math.max(0, fck - 10) * 1e-6;
  const betaAs = 1 - Math.exp(-0.2 * Math.sqrt(Math.max(0, t)));
  const epsCa = betaAs * epsCaInfty;
  const { ads1, ads2 } = ZEMENT_DS[zementklasse];
  const RH = Math.min(100, Math.max(20, rh));
  const betaRH = 1.55 * (1 - Math.pow(RH / 100, 3));
  const epsCd0 = 0.85 * ((220 + 110 * ads1) * Math.exp(-ads2 * (fcm / 10))) * 1e-6 * betaRH;
  const kh = beiwertKh(h0);
  const deltaTds = Math.max(0, t - ts);
  const betaDs = deltaTds / (deltaTds + 0.04 * Math.sqrt(Math.pow(h0, 3)));
  const epsCd = betaDs * kh * epsCd0;
  const epsCs = epsCd + epsCa;
  const deltaLShrinkMm = epsCs * (laenge * 1000);

  // 6. Kriechen
  let phiRH: number, alpha3 = 1.0;
  if (fcm <= 35) {
    phiRH = 1 + (1 - RH / 100) / (0.10 * Math.cbrt(h0));
  } else {
    const alpha1 = Math.pow(35 / fcm, 0.7);
    const alpha2 = Math.pow(35 / fcm, 0.2);
    alpha3 = Math.pow(35 / fcm, 0.5);
    phiRH = (1 + ((1 - RH / 100) / (0.10 * Math.cbrt(h0))) * alpha1) * alpha2;
  }
  const betaFcm = 16.8 / Math.sqrt(Math.max(1, fcm));
  const t0Eff = Math.max(0.5, t0Temp * Math.pow((9 / (2 + Math.pow(t0Temp, 1.2))) + 1, ZEMENT_ALPHA[zementklasse]));
  const betaT0 = 1 / (0.1 + Math.pow(t0Eff, 0.20));
  const phi0 = phiRH * betaFcm * betaT0;
  const betaHRoh = 1.5 * (1 + Math.pow(0.012 * RH, 18)) * h0;
  const betaH = fcm <= 35 ? Math.min(1500, betaHRoh + 250) : Math.min(1500 * alpha3, betaHRoh + 250 * alpha3);
  const deltaTcreep = Math.max(0, t - t0);
  const betaC = Math.pow(deltaTcreep / (betaH + deltaTcreep), 0.3);
  const phiLinear = phi0 * betaC;
  const stressLimitLin = 0.45 * fckT0;
  const stressLimitMax = 0.60 * fckT0;
  const isNonlinearCreep = sigmaC > stressLimitLin;
  let kSigma = 0;
  let phiFinal = phiLinear;
  if (fckT0 > 0) {
    kSigma = sigmaC / fckT0;
    if (isNonlinearCreep) phiFinal = phiLinear * Math.exp(1.5 * (kSigma - 0.45));
  }
  const epsCc = (phiFinal * sigmaC) / Ec0;
  const deltaLCreepMm = epsCc * (laenge * 1000);
  const EcEff = Ecm / (1 + phiFinal);
  const EcEffZwang = Ecm / (1 + rhoRelax * phiFinal);

  // 7. Vorschau EC2 2. Generation
  const Ecm2025 = 9500 * Math.pow(fcm, 1 / 3);
  const etaFc2025 = Math.min(1.0, Math.pow(40 / Math.max(1, fck), 1 / 3));

  // Anwendungsbereich (nur Warnungen, die Rechnung bleibt unverändert)
  if (fck > 90) hinweise.push({ stufe: 'warnung', feld: 'fck', text: 'f_ck > 90 N/mm²: Die Gleichungen für ε_cu1, ε_cu2 und n aus Tab. 3.1 gelten nur bis C90/105 (Werte steigen darüber wieder an).' });
  if (fck < 12) hinweise.push({ stufe: 'warnung', feld: 'fck', text: 'f_ck < 12 N/mm²: unterhalb der Festigkeitsklassen nach Tab. 3.1.' });
  if (rh < 40 || rh > 100) hinweise.push({ stufe: 'warnung', feld: 'rh', text: 'Anhang B gilt für 40 % ≤ RH ≤ 100 %; RH wird auf 20 … 100 % begrenzt.' });
  if (h0Roh < 20 || h0Roh > 1500) hinweise.push({ stufe: 'warnung', feld: 'ac', text: 'h₀ = 2·A_c/u liegt außerhalb 20 … 1500 mm und wird begrenzt.' });
  if (h < 50) hinweise.push({ stufe: 'warnung', feld: 'h', text: 'h < 50 mm: für f_ctm,fl wird h = 50 mm angesetzt.' });
  if (temperatur < 0 || temperatur > 80) hinweise.push({ stufe: 'warnung', feld: 'temperatur', text: 'Die Temperaturanpassung nach Anhang B gilt für etwa 0 … 80 °C.' });
  if (t < t0) hinweise.push({ stufe: 'warnung', feld: 't', text: 't < t₀: Der Beton ist noch nicht belastet, die Kriechzahl ist 0.' });
  if (ts > t) hinweise.push({ stufe: 'warnung', feld: 'ts', text: 't_s > t: Das Trocknungsschwinden hat noch nicht begonnen.' });
  if (t0 < 3) hinweise.push({ stufe: 'warnung', feld: 't0', text: 't₀ < 3 d: f_ck(t₀) = f_cm(t₀) − 8 ist nach 3.1.2(5) erst ab 3 Tagen anwendbar.' });
  if (sigmaC > stressLimitMax) hinweise.push({ stufe: 'warnung', feld: 'sigmaC', text: 'σ_c > 0,6·f_ck(t₀): Gl. (3.7) ist nur bis 0,6·f_ck(t₀) zugelassen (Grenze für die Spannung im GZG).' });
  if (sigmaC < 0) hinweise.push({ stufe: 'warnung', feld: 'sigmaC', text: 'σ_c < 0: Als Druckspannung ist ein positiver Betrag einzugeben.' });

  const gueltig = !hatFehler(hinweise);
  return {
    fck, fcm, fcd, s, betaCcT0, fcmT0, fckT0, betaCcT, fcmT, fckT,
    fctm, fctk005, fctk095, fctd, fctmFl, fctSp, fctmT,
    alphaE, Ecm, Ec0, EcmT0, EcmT, Gcm,
    epsC1, epsCu1, kPlastizitaet, epsC2, epsCu2, exponentN,
    h0, kh, epsCd0, epsCd, epsCa, epsCs, deltaLShrinkMm,
    phi0, phiLinear, phiFinal, isNonlinearCreep, stressLimitLin, stressLimitMax, kSigma,
    epsCc, deltaLCreepMm, EcEff, EcEffZwang, Ecm2025, etaFc2025,
    gueltig, hinweise,
  };
}
