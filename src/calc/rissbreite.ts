/**
 * Rissbreitenbegrenzung (direkte Berechnung) und Mindestbewehrung nach DIN EN 1992-1-1 + NA (DE), 7.3.
 * Rechteckquerschnitt, eine Bewehrungslage, Betonstahl. Reiner Rechenkern – geprüft in tests/rissbreite.test.ts.
 */
import { EC2_NA_DE } from '../data/normParams';
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';

export interface RissEingabe {
  h: number; b: number;   // [mm]
  cNom: number; phi: number; // [mm]
  abstand: number;        // Stababstand [cm]
  sigmaS: number;         // Stahlspannung im Riss [N/mm²]
  fctEff: number; ecm: number; // [N/mm²]
  beanspruchung: 'biegung' | 'zug';
  zwangNach28d: boolean;
  kt: number;
  wkReq: number;          // [mm]
}

export interface RissErgebnis {
  as: number; d: number; x: number; hcEf: number; actEff: number; rhoPEff: number; effectiveFct: number;
  srMax: number; epsSmEpsCm: number; wkCalc: number; asMinReq: number; isOk: boolean;
  hinweise: Hinweis[];
}

const ES = 200000;

/** Druckzonenhöhe im gerissenen Zustand II (reine Biegung, ohne Druckbewehrung) */
export function xZustandII(alphaE: number, rho: number, d: number): number {
  const a = alphaE * rho;
  return a * d * (-1 + Math.sqrt(1 + 2 / a));
}

/** Rissbreite für gegebene Bewehrungsfläche a_s [mm²] – auch für die Diagrammkurve */
export function rissbreiteFuerAs(e: RissEingabe, as: number): Omit<RissErgebnis, 'hinweise' | 'asMinReq' | 'isOk'> {
  const d = e.h - e.cNom - e.phi / 2;
  const alphaE = ES / e.ecm;
  const x = e.beanspruchung === 'biegung' ? xZustandII(alphaE, as / (e.b * d), d) : 0;
  // Bild 7.1: h_c,ef = min{2,5·(h − d); (h − x)/3; h/2}; bei zentrischem Zug je Seite min{2,5·(h − d); h/2}
  const hcEf = e.beanspruchung === 'biegung' ? Math.min(2.5 * (e.h - d), (e.h - x) / 3, e.h / 2) : Math.min(2.5 * (e.h - d), e.h / 2);
  const actEff = e.b * hcEf;
  const rhoPEff = as / actEff;
  const effectiveFct = e.zwangNach28d ? Math.max(e.fctEff, EC2_NA_DE.fctEffMinLangzeit) : e.fctEff;
  // (7.11DE): s_r,max = φ/(3,6·ρ_p,eff) ≤ σ_s·φ/(3,6·f_ct,eff)
  const srMax = Math.min(e.phi / (3.6 * rhoPEff), (e.sigmaS * e.phi) / (3.6 * effectiveFct));
  // (7.9)
  const epsSmEpsCm = Math.max((e.sigmaS - e.kt * (effectiveFct / rhoPEff) * (1 + alphaE * rhoPEff)) / ES, (0.6 * e.sigmaS) / ES);
  return { as, d, x, hcEf, actEff, rhoPEff, effectiveFct, srMax, epsSmEpsCm, wkCalc: srMax * epsSmEpsCm };
}

export function pruefeRiss(e: RissEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.h, e.b, e.cNom, e.phi, e.abstand, e.sigmaS, e.fctEff, e.ecm, e.kt, e.wkReq), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (hatFehler(h)) return h;
  muss(h, e.h > 0 && e.b > 0, 'h', 'Höhe und Breite müssen größer als 0 sein.');
  muss(h, e.phi > 0 && e.abstand > 0, 'phi', 'Stabdurchmesser und Stababstand müssen größer als 0 sein.');
  muss(h, e.cNom >= 0 && e.cNom + e.phi / 2 < e.h / 2, 'cNom', 'Betondeckung zu groß: Die Bewehrung muss in der Zugzone liegen (c_nom + φ/2 < h/2).');
  muss(h, e.sigmaS > 0, 'sigmaS', 'Die Stahlspannung σ_s muss größer als 0 sein.');
  muss(h, e.fctEff > 0 && e.ecm > 0, 'fctEff', 'f_ct,eff und E_cm müssen größer als 0 sein.');
  muss(h, e.wkReq > 0, 'wkReq', 'Die zulässige Rissbreite muss größer als 0 sein.');
  if (hatFehler(h)) return h;
  bereich(h, 'sigmaS', e.sigmaS, 0, 500, 'σ_s liegt über der Streckgrenze von B500 – im Gebrauchszustand nicht möglich.');
  bereich(h, 'kt', e.kt, 0.4, 0.6, 'k_t ist 0,4 (langfristig) oder 0,6 (kurzfristig).');
  if (e.abstand * 10 > 5 * (e.cNom + e.phi / 2)) {
    h.push({ stufe: 'warnung', feld: 'abstand', text: 'Stababstand > 5·(c + φ/2): Nach 7.3.4(4) ist s_r,max = 1,3·(h − x) anzusetzen (hier nicht berücksichtigt).' });
  }
  return h;
}

export function bemesseRiss(e: RissEingabe): RissErgebnis {
  const hinweise = pruefeRiss(e);
  if (hatFehler(hinweise)) {
    return { as: 0, d: 0, x: 0, hcEf: 0, actEff: 0, rhoPEff: 0, effectiveFct: 0, srMax: 0, epsSmEpsCm: 0, wkCalc: 0, asMinReq: 0, isOk: false, hinweise };
  }
  const as = (e.b / (e.abstand * 10)) * (Math.PI * e.phi * e.phi) / 4;
  const r = rissbreiteFuerAs(e, as);
  // (7.1): A_s,min·σ_s = k_c·k·f_ct,eff·A_ct
  const kc = e.beanspruchung === 'biegung' ? 0.4 : 1.0;
  const act = e.beanspruchung === 'biegung' ? (e.b * e.h) / 2 : e.b * e.h;
  const asMinReq = (kc * EC2_NA_DE.kAsMin(e.h) * r.effectiveFct * act) / e.sigmaS;
  if (as < asMinReq) hinweise.push({ stufe: 'warnung', feld: 'as', text: 'Die vorhandene Bewehrung liegt unter der Mindestbewehrung nach (7.1).' });
  return { ...r, asMinReq, isOk: r.wkCalc <= e.wkReq, hinweise };
}
