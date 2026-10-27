/**
 * Querkraftbemessung Rechteckquerschnitt (Stahlbeton, nicht vorgespannt) nach DIN EN 1992-1-1 + NA (DE), 6.2.
 * Vereinfachungen: z = 0,9·d, senkrechte Bügel (α = 90°), σ_cp = 0, α_cw = 1,0.
 * Ein flacheres θ als nach Gl. (6.7aDE) zulässig wird auf cot θ,max begrenzt (cot_theta_eff).
 * Reiner Rechenkern ohne React – geprüft in tests/querkraft.test.ts.
 */
import { formatDeZahl } from '../utils/numberFormat';
import { EC2_NA_DE } from '../data/normParams';
import { fctmVonFck, fcdBeton, fcdHochfestHinweis } from '../data/kennwerte';
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';
import { type Bewehrung } from './biegung';

export interface QuerkraftEingabe {
  b: number;   // Stegbreite b_w [cm]
  h: number;   // [cm]
  d1: number;  // [cm]
  fck: number; // [MPa]
  bewehrung: Bewehrung;
  fyk: number; ftk: number; gammaFRP: number;
  asl: number; // verankerte Längsbewehrung [cm²]
  vEd: number; // [kN]
  theta: number; // Druckstrebenneigung [°]
}

export interface QuerkraftErgebnis {
  d: number; z: number; fcd: number; fyd: number; fctm: number;
  /** f_cd für V_Rd,max (ohne Hochfest-Abminderung, da in ν1 = 0,75·ν2 enthalten) [N/mm²] */
  fcd_vRdMax: number;
  vRd_max: number; vRd_c: number; vRd_cc_kN: number;
  /** cot_theta: gewählter Wert; cot_theta_eff: in der Rechnung verwendet = min(cot θ; cot θ,max) */
  cot_theta: number; cot_theta_eff: number; theta_eff_deg: number; cot_theta_max: number; theta_min_deg: number; isCotThetaExceeded: boolean;
  asw_req: number; asw_min: number; asw_final: number;
  isVRdcExceeded: boolean; isVRdMaxExceeded: boolean;
  hinweise: Hinweis[];
}

/** κ1 für v_min nach NA DE NDP 6.2.1(1): 0,0525 (d ≤ 600 mm) … 0,0375 (d ≥ 800 mm), linear dazwischen */
export function kappa1Vmin(d_mm: number): number {
  return d_mm <= 600 ? 0.0525 : d_mm >= 800 ? 0.0375 : 0.0525 - (0.015 * (d_mm - 600)) / 200;
}

export function pruefeQuerkraft(e: QuerkraftEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.b, e.h, e.d1, e.fck, e.fyk, e.ftk, e.gammaFRP, e.asl, e.vEd, e.theta), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (hatFehler(h)) return h;
  muss(h, e.b > 0 && e.h > 0, 'b', 'Breite und Höhe müssen größer als 0 sein.');
  muss(h, e.d1 > 0 && e.d1 < e.h, 'd1', 'Der Achsabstand d₁ muss zwischen 0 und h liegen.');
  muss(h, e.fck > 0, 'fck', 'f_ck muss größer als 0 sein.');
  muss(h, e.bewehrung === 'Stahl' ? e.fyk > 0 : e.ftk > 0 && e.gammaFRP > 0, 'fyk', 'Die Festigkeit der Bewehrung und γ müssen größer als 0 sein.');
  muss(h, e.asl >= 0, 'asl', 'Die Längsbewehrung A_sl darf nicht negativ sein.');
  muss(h, e.vEd >= 0, 'vEd', 'V_Ed muss ≥ 0 sein (Betrag der Querkraft eingeben).');
  muss(h, e.theta > 0 && e.theta < 90, 'theta', 'Die Druckstrebenneigung θ muss zwischen 0° und 90° liegen.');
  if (hatFehler(h)) return h;
  const cot = 1 / Math.tan((e.theta * Math.PI) / 180);
  if (cot < EC2_NA_DE.cotThetaMin - 1e-9) h.push({ stufe: 'warnung', feld: 'theta', text: 'θ > 45° (cot θ < 1,0) ist nach NA DE nicht zulässig; es gilt cot θ ≥ 1,0.' });
  bereich(h, 'fck', e.fck, 12, 50, 'Die Querkraftformeln sind hier nur für Normalbeton bis C50/60 hinterlegt.');
  if (e.bewehrung !== 'Stahl') {
    h.push({ stufe: 'warnung', feld: 'bewehrung', text: 'Die Querkraftbemessung nach EC2 gilt für Betonstahlbügel. Für nichtmetallische Bügel sind die Abminderungen der Zulassung (Biegeradius, Bruchdehnung) maßgebend; das Ergebnis ist nur eine Orientierung.' });
  }
  return h;
}

export function bemesseQuerkraft(e: QuerkraftEingabe): QuerkraftErgebnis {
  const hinweise = pruefeQuerkraft(e);
  const leer: QuerkraftErgebnis = {
    d: 0, z: 0, fcd: 0, fyd: 0, fctm: 0, fcd_vRdMax: 0, vRd_max: 0, vRd_c: 0, vRd_cc_kN: 0, cot_theta: 0, cot_theta_eff: 0, theta_eff_deg: 0, cot_theta_max: 0, theta_min_deg: 0,
    isCotThetaExceeded: false, asw_req: 0, asw_min: 0, asw_final: 0, isVRdcExceeded: false, isVRdMaxExceeded: false, hinweise,
  };
  if (hatFehler(hinweise)) return leer;

  const isStahl = e.bewehrung === 'Stahl';
  const b_m = e.b / 100;
  const d_m = (e.h - e.d1) / 100;
  const vEd_MN = e.vEd / 1000;
  const cot_theta = 1 / Math.tan((e.theta * Math.PI) / 180);
  // f_cd zentral (src/data/kennwerte.ts): α_cc·f_ck/γ_c, ab C55/67 · (1,1 − f_ck/500) (vorläufig, F-Freigabe)
  const fcd = fcdBeton(e.fck);
  // V_Rd,max mit f_cd ohne Hochfest-Abminderung, weil ν1 = 0,75·ν2 sie bereits enthält (keine Doppelabminderung)
  const fcdOhneHf = fcdBeton(e.fck, { hochfest: false });
  const hfHinweis = fcdHochfestHinweis(e.fck);
  if (hfHinweis) hinweise.push({ stufe: 'warnung', feld: 'fck', text: `${hfHinweis} V_Rd,max bleibt unverändert: ν₁ = 0,75·ν₂ enthält den Faktor bereits.` });
  const fyd = isStahl ? e.fyk / EC2_NA_DE.gammaS : e.ftk / e.gammaFRP;
  const z = 0.9 * d_m;

  // cot θ-Grenze (6.7aDE) mit V_Rd,cc = 0,5·0,48·f_ck^(1/3)·b_w·z (σ_cp = 0)
  const vRd_cc_N = 0.5 * 0.48 * Math.cbrt(e.fck) * b_m * 1000 * z * 1000;
  const vEd_N = e.vEd * 1000;
  const cot_theta_max = vEd_N > vRd_cc_N ? Math.min(EC2_NA_DE.cotThetaMax, 1.2 / (1 - vRd_cc_N / vEd_N)) : EC2_NA_DE.cotThetaMax;
  const theta_min_deg = (Math.atan(1 / cot_theta_max) * 180) / Math.PI;
  const isCotThetaExceeded = cot_theta > cot_theta_max + 0.005;
  // Gerechnet wird mit dem zulässigen Wert: cot θ_eff = min(cot θ; cot θ,max)
  const cot_theta_eff = Math.min(cot_theta, cot_theta_max);
  const th = Math.atan(1 / cot_theta_eff);
  const theta_eff_deg = (th * 180) / Math.PI;
  if (isCotThetaExceeded) {
    hinweise.push({ stufe: 'warnung', feld: 'cotTheta', text: `θ ist flacher als zulässig: Nach Gl. (6.7aDE) gilt hier cot θ ≤ ${formatDeZahl(cot_theta_max, 2)}, also θ ≥ ${formatDeZahl(theta_min_deg, 1)}°. Gerechnet wird mit cot θ = ${formatDeZahl(cot_theta_max, 2)}.` });
  }

  // V_Rd,max (6.9): ν1 = 0,75·ν2, ν2 = 1,1 − f_ck/500 ≤ 1,0 (NA DE)
  const nu1 = EC2_NA_DE.nu1 * Math.min(1.0, 1.1 - e.fck / 500);
  const vRd_max = (b_m * z * nu1 * fcdOhneHf) / (Math.tan(th) + cot_theta_eff);

  // a_sw,erf (6.8)
  const asw_req = (vEd_MN / (z * fyd * cot_theta_eff)) * 10000;
  // ρ_w,min = 0,16·f_ctm/f_yk (NA DE 9.2.2(5))
  const fctm = fctmVonFck(e.fck);
  const asw_min = EC2_NA_DE.rhoWmin(fctm, isStahl ? e.fyk : e.ftk) * b_m * 10000;

  // V_Rd,c (6.2a/b) mit C_Rd,c = 0,15/γc und v_min nach NA DE
  const d_mm = d_m * 1000;
  const k = Math.min(2.0, 1 + Math.sqrt(200 / d_mm));
  const rho_l = Math.min(0.02, e.asl / 10000 / (b_m * d_m));
  const v_min = (kappa1Vmin(d_mm) / EC2_NA_DE.gammaC) * Math.pow(k, 1.5) * Math.sqrt(e.fck);
  const vRdc = Math.max(EC2_NA_DE.CRdc_Querkraft * k * Math.cbrt(100 * rho_l * e.fck), v_min) * b_m * d_m;

  const isVRdcExceeded = vEd_MN > vRdc;
  const isVRdMaxExceeded = vEd_MN > vRd_max;
  if (isVRdMaxExceeded) {
    hinweise.push({ stufe: 'warnung', feld: 'vRdMax', text: 'V_Ed überschreitet die Druckstrebentragfähigkeit V_Rd,max. Querschnitt vergrößern, Betonfestigkeit erhöhen oder θ steiler wählen.' });
  }
  return {
    d: d_m * 100, z: z * 100, fcd, fyd, fctm, fcd_vRdMax: fcdOhneHf,
    vRd_max: vRd_max * 1000, vRd_c: vRdc * 1000, vRd_cc_kN: vRd_cc_N / 1000,
    cot_theta, cot_theta_eff, theta_eff_deg, cot_theta_max, theta_min_deg, isCotThetaExceeded,
    asw_req, asw_min, asw_final: isVRdcExceeded ? Math.max(asw_req, asw_min) : asw_min,
    isVRdcExceeded, isVRdMaxExceeded, hinweise,
  };
}
