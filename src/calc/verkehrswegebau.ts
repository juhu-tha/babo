/**
 * Rechenkern Verkehrswegebau (Z3), übernommen aus src/modules/BpVerkehrswegebau.tsx und src/modules/bpverkehrswegebau/
 * (PrueftechnikTab, BahnbauTab, BetondeckenTab, TiefbauTab, TunnelbauTab). Lehrrechnungen, keine Bemessung:
 *  - Asphalt: Rohdichte ohne Hohlräume ρ_m = 100/(Σ Mᵢ/ρᵢ) [g/cm³], Hohlraumgehalt V = (1 − ρ_A/ρ_m)·100 [Vol.-%]
 *  - Lückenloses Gleis: σ_T = E·α_T·ΔT (E = 210 000 N/mm², α_T = 1,2·10⁻⁵ 1/K), Kraft je Schiene F = σ_T·A (60E1: 7686 mm²)
 *  - Betondecke: Steifigkeitslänge l = [E·h³/(12(1 − ν²)·k)]^¼, Lastradius a = √(P/(π·p)) mit p = 0,8 N/mm²,
 *    Westergaard (1926) mit Ersatzradius b = √(1,6·a² + h²) − 0,675·h für a < 1,724·h, sonst b = a:
 *    Innen σ_i = 0,316·P/h²·[4·lg(l/b) + 1,069], Rand σ_e = 0,572·P/h²·[4·lg(l/b) + 0,359], Ecke σ_c = 3·P/h²·[1 − (a·√2/l)^0,6]
 *    (Koeffizienten für ν = 0,15 abgeleitet, daher ν = 0,15; Runde 5: vorher l/r statt l/b und ν = 0,2), zulässig 2,25 N/mm² (Lehrannahme);
 *    Fugenabstand L ≤ min(25·h; 5,0 m) (Lehrannahme)
 *  - Rigole: Q_zu = A·ψ·r/10 000 [l/s], V_zu = Q_zu·D, Q_s = k_f·A_s, V_R = f_Z·(V_zu − V_s)/s_R (≥ 0,1 m³)
 *  - Spritzbetonring: Kesselformel σ = p·R/d, f_cd = α_cc·f_ck/γ_c mit γ_c = 1,5 (ständige/vorübergehende Bemessungssituation,
 *    Runde 5; vorher 1,3); γ_c = 1,3 nur außergewöhnlich (NA DE Tab. 2.1DE; EC2 empfohlen 1,2)
 * Einheiten stehen an den Feldern. Reiner Rechenkern – geprüft in tests/verkehrswegebau.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss } from './plausibilitaet';
import { asphaltRohdichte } from './asphalt';

export interface Ergebnis { gueltig: boolean; hinweise: Hinweis[] }
const abschluss = (h: Hinweis[]): Ergebnis => ({ gueltig: !hatFehler(h), hinweise: h });

// ---------------------------------------------------------------- Asphalt
export interface AsphaltEingabe {
  /** Massenanteile Gestein und Bitumen in M.-% */
  gesteinAnteil: number;
  bitumenAnteil: number;
  /** Dichten in g/cm³ */
  rhoGestein: number;
  rhoBitumen: number;
  /** Raumdichte des Probekörpers in g/cm³ */
  raumdichteMischung: number;
}
export interface AsphaltErgebnis extends Ergebnis {
  /** Rohdichte (hohlraumfrei) in g/cm³ */
  maxDichte: number;
  /** Hohlraumgehalt in Vol.-% */
  hohlraum: number;
  /** Lehrbereich 1,5 … 4,5 Vol.-% (Deckschicht) eingehalten */
  ok: boolean;
}
export function asphaltHohlraum(e: AsphaltEingabe): AsphaltErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.gesteinAnteil, e.bitumenAnteil, e.rhoGestein, e.rhoBitumen, e.raumdichteMischung) && e.rhoGestein > 0 && e.rhoBitumen > 0, 'eingabe', 'Dichten müssen größer als 0 sein.');
  const maxDichte = asphaltRohdichte(e.gesteinAnteil, e.bitumenAnteil, e.rhoGestein, e.rhoBitumen);
  const hohlraum = (1 - (e.raumdichteMischung / maxDichte)) * 100;
  if (Math.abs(e.gesteinAnteil + e.bitumenAnteil - 100) > 0.05) h.push({ stufe: 'warnung', feld: 'bitumenAnteil', text: 'Gestein und Bitumen ergeben nicht 100 M.-%.' });
  if (hohlraum < 0) h.push({ stufe: 'fehler', feld: 'raumdichteMischung', text: 'Raumdichte größer als die hohlraumfreie Rohdichte – Eingaben prüfen.' });
  return { maxDichte, hohlraum, ok: hohlraum >= 1.5 && hohlraum <= 4.5, ...abschluss(h) };
}

// ---------------------------------------------------------------- Bahnbau
export type Bettung = 'schotter_mager' | 'schotter_gut' | 'feste_fahrbahn';
/** Lehr-Grenzspannungen gegen Gleisverwerfung in N/mm² */
export const KNICKGRENZE: Readonly<Record<Bettung, number>> = { schotter_mager: 90, schotter_gut: 135, feste_fahrbahn: 999 };
export type GleisStatus = 'zugKritisch' | 'zug' | 'festeFahrbahn' | 'verwerfung' | 'erhoeht' | 'unkritisch';
export interface GleisErgebnis extends Ergebnis {
  deltaT: number;
  /** Temperaturspannung in N/mm² (Druck positiv) */
  sigmaT: number;
  /** Längskraft je Schiene und je Gleis in kN */
  kraftSchieneKn: number;
  kraftGleisKn: number;
  knickGrenze: number;
  status: GleisStatus;
}
export function schienenTemperatur(schieneTemp: number, neutralTemp: number, bettung: Bettung): GleisErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(schieneTemp, neutralTemp), 'eingabe', 'Temperaturen müssen Zahlen sein.');
  const deltaT = schieneTemp - neutralTemp;
  const sigmaT = 210000 * 1.2e-5 * deltaT;
  const kraftSchieneKn = (sigmaT * 7686) / 1000;
  const kraftGleisKn = kraftSchieneKn * 2;
  const knickGrenze = KNICKGRENZE[bettung];
  let status: GleisStatus;
  if (sigmaT < -120) status = 'zugKritisch';
  else if (sigmaT < 0) status = 'zug';
  else if (bettung === 'feste_fahrbahn') status = 'festeFahrbahn';
  else if (sigmaT >= knickGrenze) status = 'verwerfung';
  else if (sigmaT >= knickGrenze * 0.7) status = 'erhoeht';
  else status = 'unkritisch';
  if (schieneTemp < -40 || schieneTemp > 70) h.push({ stufe: 'warnung', feld: 'schieneTemp', text: 'Schienentemperatur außerhalb −40 … 70 °C.' });
  return { deltaT, sigmaT, kraftSchieneKn, kraftGleisKn, knickGrenze, status, ...abschluss(h) };
}

// ---------------------------------------------------------------- Betondecke
export interface WestergaardEingabe {
  /** Plattendicke h in cm */
  dickeCm: number;
  /** Achslast in kN (Radlast = Achslast/2) */
  achslastKn: number;
  /** Bettungsmodul k in MN/m³ */
  bettungMNm3: number;
  /** E-Modul in N/mm² und Querdehnzahl */
  E?: number;
  nu?: number;
  /** Reifendruck in N/mm² */
  reifendruck?: number;
  /** zulässige Biegezugspannung in N/mm² */
  zulaessig?: number;
}
export interface WestergaardSpannungen {
  /** Ersatzradius b in mm */
  bMm: number;
  /** Biegezugspannungen in N/mm²: Plattenmitte (innen), Rand, Ecke */
  innen: number; rand: number; ecke: number;
}
/** Ersatzradius des widerstehenden Querschnitts nach Westergaard: b = √(1,6·a² + h²) − 0,675·h für a < 1,724·h, sonst b = a (mm) */
export function westergaardErsatzradius(aMm: number, hMm: number): number {
  return aMm < 1.724 * hMm ? Math.sqrt(1.6 * aMm * aMm + hMm * hMm) - 0.675 * hMm : aMm;
}
/**
 * Westergaard-Spannungen (Originalgleichungen 1926, öffentlich z. B. NPTEL „Rigid pavement design“, Kap. 29):
 * σ_i = 0,316·P/h²·[4·lg(l/b) + 1,069], σ_e = 0,572·P/h²·[4·lg(l/b) + 0,359], σ_c = 3·P/h²·[1 − (a·√2/l)^0,6].
 * P in N (Radlast), h, l, a in mm → σ in N/mm². Die Koeffizienten gelten für ν = 0,15.
 */
export function westergaardSpannungen(pN: number, hMm: number, lMm: number, aMm: number): WestergaardSpannungen {
  const bMm = westergaardErsatzradius(aMm, hMm);
  const q = pN / (hMm * hMm);
  return {
    bMm,
    innen: 0.316 * q * (4 * Math.log10(lMm / bMm) + 1.069),
    rand: 0.572 * q * (4 * Math.log10(lMm / bMm) + 0.359),
    ecke: 3 * q * (1 - Math.pow((aMm * Math.SQRT2) / lMm, 0.6)),
  };
}

export interface WestergaardErgebnis extends Ergebnis {
  /** Steifigkeitslänge l, Lastradius r (= a) und Ersatzradius b in mm */
  lMm: number;
  rMm: number;
  bMm: number;
  /** Spannungen in N/mm² für Plattenmitte und Ecke (zur Einordnung) */
  sigmaInnen: number;
  sigmaEcke: number;
  /** Randspannung in N/mm² und Ausnutzung in % */
  sigmaE: number;
  ausnutzung: number;
  ok: boolean;
}
export function westergaardRand(e: WestergaardEingabe): WestergaardErgebnis {
  const h: Hinweis[] = [];
  const E = e.E ?? 34000, nu = e.nu ?? 0.15, p = e.reifendruck ?? 0.8, zul = e.zulaessig ?? 2.25;
  muss(h, istEndlich(e.dickeCm, e.achslastKn, e.bettungMNm3) && e.dickeCm > 0 && e.achslastKn > 0 && e.bettungMNm3 > 0, 'eingabe', 'Dicke, Achslast und Bettungsmodul müssen größer als 0 sein.');
  const hMm = e.dickeCm * 10;
  const pN = (e.achslastKn / 2) * 1000;
  const k = e.bettungMNm3 * 1e-3;
  const lMm = Math.pow((E * Math.pow(hMm, 3)) / (12 * (1 - Math.pow(nu, 2)) * k), 0.25);
  const rMm = Math.sqrt(pN / (p * Math.PI));
  const sp = westergaardSpannungen(pN, hMm, lMm, rMm);
  const sigmaE = sp.rand;
  const ausnutzung = (sigmaE / zul) * 100;
  if (nu !== 0.15) h.push({ stufe: 'warnung', feld: 'nu', text: 'Die Westergaard-Koeffizienten 0,316/0,572 sind für ν = 0,15 abgeleitet; mit anderem ν nur Näherung.' });
  h.push({ stufe: 'warnung', feld: 'sigmaE', text: 'Westergaard-Lastspannung am Rand ohne Wölbspannungen aus Temperaturgradient und ohne Ermüdungsnachweis; die Dimensionierung erfolgt nach RDO Beton.' });
  return { lMm, rMm, bMm: sp.bMm, sigmaInnen: sp.innen, sigmaEcke: sp.ecke, sigmaE, ausnutzung, ok: sigmaE <= zul, ...abschluss(h) };
}

export interface FugenErgebnis extends Ergebnis { maxAbstandM: number; ok: boolean; duebel: number; anker: number }
/** Fugenabstand L in m und Plattendicke in cm; Dübel Ø 25 im Abstand 25 cm je 3,75-m-Fahrstreifen, Anker alle 1,5 m */
export function betondeckenFugen(abstandM: number, dickeCm: number): FugenErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(abstandM, dickeCm) && abstandM > 0 && dickeCm > 0, 'eingabe', 'Fugenabstand und Dicke müssen größer als 0 sein.');
  const maxAbstandM = Math.min(25 * (dickeCm / 100), 5.0);
  return { maxAbstandM, ok: abstandM <= maxAbstandM, duebel: Math.floor(3.75 / 0.25), anker: Math.max(3, Math.floor(abstandM / 1.5) + 1), ...abschluss(h) };
}

// ---------------------------------------------------------------- Rigole
export interface RigolenEingabe {
  /** angeschlossene Fläche in m² */
  flaecheM2: number;
  /** Abflussbeiwert ψ */
  psi: number;
  /** Regenspende r in l/(s·ha) */
  regenspende: number;
  /** Regendauer D in min */
  dauerMin: number;
  /** Speicherkoeffizient s_R */
  speicherKoeff: number;
  /** Durchlässigkeit k_f in m/s */
  kf?: number;
  /** Zuschlagsfaktor f_Z */
  fZ?: number;
}
export interface RigolenErgebnis extends Ergebnis {
  aRed: number;
  /** Zufluss in l/s und m³ */
  qZu: number;
  vZu: number;
  /** Sohlfläche m², Sickerrate l/s, versickertes Volumen m³ */
  aSohle: number;
  qSicker: number;
  vSicker: number;
  /** Rigolen-Bruttovolumen und speicherwirksames Volumen in m³ */
  vRigole: number;
  vNutz: number;
  /** Länge bei 1,2 m × 0,6 m in m, Anzahl Sickerboxen à 0,24 m³ */
  laengeM: number;
  boxen: number;
}
export function rigole(e: RigolenEingabe): RigolenErgebnis {
  const h: Hinweis[] = [];
  const kf = e.kf ?? 1.0e-5, fZ = e.fZ ?? 1.1;
  muss(h, istEndlich(e.flaecheM2, e.psi, e.regenspende, e.dauerMin, e.speicherKoeff) && e.speicherKoeff > 0, 'speicherKoeff', 'Der Speicherkoeffizient muss größer als 0 sein.');
  muss(h, e.flaecheM2 >= 0 && e.regenspende >= 0 && e.dauerMin >= 0, 'flaecheM2', 'Fläche, Regenspende und Dauer müssen ≥ 0 sein.');
  const aRed = e.flaecheM2 * e.psi;
  const qZu = aRed * (e.regenspende / 10000);
  const vZu = (qZu * (e.dauerMin * 60)) / 1000;
  const aSohle = Math.max(1.5, vZu * 0.35);
  const qSicker = kf * aSohle * 1000;
  const vSicker = (qSicker * (e.dauerMin * 60)) / 1000;
  const vRigole = Math.max(0.1, fZ * (vZu - vSicker) / e.speicherKoeff);
  const vNutz = vRigole * e.speicherKoeff;
  const laengeM = vRigole / (0.6 * 1.2);
  const boxen = Math.ceil(vNutz / 0.24);
  h.push({ stufe: 'warnung', feld: 'kf', text: 'Vereinfachung: Nach DWA-A 138 wird in der ungesättigten Zone mit k_f/2 versickert und das Volumen über mehrere Regendauern iteriert.' });
  if (e.psi < 0 || e.psi > 1) h.push({ stufe: 'warnung', feld: 'psi', text: 'Der Abflussbeiwert liegt üblicherweise zwischen 0 und 1.' });
  return { aRed, qZu, vZu, aSohle, qSicker, vSicker, vRigole, vNutz, laengeM, boxen, ...abschluss(h) };
}

// ---------------------------------------------------------------- Tunnelbau
export interface SpritzbetonErgebnis extends Ergebnis {
  /** Ringdruckkraft in kN/m und Ringspannung in N/mm² */
  ringKraftKnM: number;
  sigmaRing: number;
  fcd: number;
  /** Ausnutzung in % */
  ausnutzung: number;
  ok: boolean;
}
/**
 * Teilsicherheitsbeiwerte γ_c nach DIN EN 1992-1-1/NA, Tab. 2.1DE: ständig/vorübergehend 1,5; außergewöhnlich 1,3
 * (EC2 Tab. 2.1N empfiehlt 1,2 – in Deutschland gilt der NA; vorläufig, F-Freigabe). Für Tunnel regeln ZTV-ING Teil 5 bzw. Ril 853
 * (DS 853) zusätzliche Anforderungen; sie sind hier nicht abgebildet.
 */
export const GAMMA_C_TUNNEL = { voruebergehend: 1.5, aussergewoehnlich: 1.3, ec2Aussergewoehnlich: 1.2 } as const;

/** Radius in m, Gebirgsdruck in N/mm², Schalendicke in cm, f_ck in N/mm²; γ_c = 1,5 (Bauzustand = vorübergehende Situation) */
export function spritzbetonRing(radiusM: number, gebirgsdruck: number, dickeCm: number, fck: number, gammaC: number = GAMMA_C_TUNNEL.voruebergehend, alphaCc = 0.85): SpritzbetonErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(radiusM, gebirgsdruck, dickeCm, fck, gammaC) && radiusM > 0 && dickeCm > 0 && fck > 0 && gammaC > 0, 'eingabe', 'Radius, Dicke, f_ck und γ_c müssen größer als 0 sein.');
  const sigmaRing = (gebirgsdruck * radiusM) / (dickeCm / 100);
  const fcd = (alphaCc * fck) / gammaC;
  const ausnutzung = (sigmaRing / fcd) * 100;
  if (gammaC < GAMMA_C_TUNNEL.voruebergehend) h.push({ stufe: 'warnung', feld: 'gammaC', text: 'γ_c < 1,5 ist nur für die außergewöhnliche Bemessungssituation vorgesehen (DIN EN 1992-1-1/NA: 1,3; EC2 empfohlen 1,2). Bauzustände sind vorübergehende Situationen mit γ_c = 1,5.' });
  h.push({ stufe: 'warnung', feld: 'tunnel', text: 'Lehrmodell: Für Tunnelschalen gelten zusätzlich ZTV-ING Teil 5 (Straßentunnel) bzw. Ril 853 (DS 853, Eisenbahntunnel).' });
  if (dickeCm / 100 > radiusM / 10) h.push({ stufe: 'warnung', feld: 'dickeCm', text: 'd > R/10: Die Kesselformel für dünnwandige Ringe wird ungenau.' });
  return { ringKraftKnM: gebirgsdruck * radiusM * 1000, sigmaRing, fcd, ausnutzung, ok: ausnutzung <= 100, ...abschluss(h) };
}
