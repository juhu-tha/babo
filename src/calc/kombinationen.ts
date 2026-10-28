/**
 * Werkstoff-Kombinationen: Faserverbund-Mikromechanik (Voigt/Reuss, Lehrmodell) und Mehrschicht-Außenwand
 * (R, U nach DIN EN ISO 6946, s_d je Schicht, Feuchte-Hinweis). Reiner Rechenkern mit Plausibilitätsprüfung
 * (T6-KO-5, Umsetzung 29.10.2026) – vorher rechnete die Komponente selbst und begrenzte Eingaben still.
 * Geprüft in tests/kombinationen.test.ts und tests/modulpruefungTranche6.test.ts.
 */
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';
import { sdRegel, type SdRegelErgebnis } from './glaser';
import { formatDeZahl } from '../utils/numberFormat';

// ---------------------------------------------------------------------------------------------
// Faserverbund
// ---------------------------------------------------------------------------------------------

export interface FaserverbundEingabe {
  /** E-Modul Faser/Matrix [GPa], Zugfestigkeit Faser/Matrix [MPa], Dichte Faser/Matrix [g/cm³] */
  ef: number; sf: number; rhoF: number;
  em: number; sm: number; rhoM: number;
  /** Faservolumengehalt [%] */
  vf: number;
}

export interface FaserverbundErgebnis {
  /** E-Modul längs (Voigt) und quer (Reuss) [GPa], Längsfestigkeit [MPa], Dichte [g/cm³] */
  eLaengs: number; eQuer: number; festigkeitLaengs: number; rho: number;
  gueltig: boolean; hinweise: Hinweis[];
}

/** E_∥ = E_f·v_f + E_m·(1 − v_f) (Voigt) */
export const eModulLaengs = (ef: number, em: number, vf01: number) => ef * vf01 + em * (1 - vf01);
/** E_⊥ = E_f·E_m / (v_f·E_m + (1 − v_f)·E_f) (Reuss) */
export const eModulQuer = (ef: number, em: number, vf01: number) => (ef * em) / (vf01 * em + (1 - vf01) * ef);

export function faserverbund(e: FaserverbundEingabe): FaserverbundErgebnis {
  const hinweise: Hinweis[] = [];
  const leer: FaserverbundErgebnis = { eLaengs: 0, eQuer: 0, festigkeitLaengs: 0, rho: 0, gueltig: false, hinweise };
  muss(hinweise, istEndlich(e.ef, e.sf, e.rhoF, e.em, e.sm, e.rhoM, e.vf), 'eingabe', 'Alle Kennwerte müssen endliche Zahlen sein.');
  if (hatFehler(hinweise)) return leer;
  muss(hinweise, e.ef > 0 && e.em > 0, 'E', 'Die E-Moduln von Faser und Matrix müssen größer als 0 sein.');
  muss(hinweise, e.sf > 0 && e.sm > 0, 'f', 'Die Festigkeiten von Faser und Matrix müssen größer als 0 sein.');
  muss(hinweise, e.rhoF > 0 && e.rhoM > 0, 'rho', 'Die Dichten müssen größer als 0 sein.');
  muss(hinweise, e.vf >= 0 && e.vf <= 100, 'vf', 'Der Faservolumengehalt liegt zwischen 0 und 100 %.');
  if (hatFehler(hinweise)) return leer;
  bereich(hinweise, 'vf', e.vf, 20, 70, 'Technisch übliche Faservolumengehalte liegen bei etwa 20–70 %; außerhalb ist die Mischungsregel nur schematisch.');
  const v = e.vf / 100;
  // Mischungsregel Festigkeit (Lehrmodell): Versagen bei Faserbruchdehnung sf/ef; Matrixspannung dann em·sf/ef (≤ sm)
  const festigkeitLaengs = e.sf * v + Math.min(e.sm, e.em * e.sf / e.ef) * (1 - v);
  return {
    eLaengs: eModulLaengs(e.ef, e.em, v),
    eQuer: eModulQuer(e.ef, e.em, v),
    festigkeitLaengs,
    rho: e.rhoF * v + e.rhoM * (1 - v),
    gueltig: true,
    hinweise,
  };
}

// ---------------------------------------------------------------------------------------------
// Mehrschicht-Außenwand
// ---------------------------------------------------------------------------------------------

export type SchichtKategorie = 'tragend' | 'daemmend' | 'schuetzend';

export interface Schicht {
  /** Dicke [mm], Wärmeleitfähigkeit [W/(mK)], Wasserdampf-Diffusionswiderstandszahl μ [–] */
  dicke: number; lambda: number; mu: number;
  kategorie: SchichtKategorie;
}

export interface SchichtErgebnis { r: number; sd: number }

/**
 * Einordnung des Feuchte-Hinweises (T6-KO-4):
 * - 'aussendaemmung': Dämmschicht außen auf einer tragenden Schicht (z. B. WDVS auf Mauerwerk) – nach DIN 4108-3
 *   (nachweisfreie Außenwände) ohne rechnerischen Tauwassernachweis; Zuordnung am Normtext prüfen (vorläufig, F-Freigabe DIN 4108-3).
 * - 'innendaemmung': Dämmschicht innenseitig der tragenden Schicht – rechnerischer bzw. hygrothermischer Nachweis.
 * - 'orientierung': sonstige Aufbauten – s_d-Regel der nachweisfreien Dächer nur als Orientierung.
 */
export type WandEinordnung = 'aussendaemmung' | 'innendaemmung' | 'orientierung';

export interface SchichtaufbauErgebnis {
  schichten: SchichtErgebnis[];
  dickeGesamt: number; rT: number; u: number; sdGesamt: number;
  /** Index der Dämmschicht (größter Wärmedurchlasswiderstand), −1 ohne Ergebnis */
  iDaemm: number;
  /** s_d innen bzw. außen der Dämmschicht (Dämmschicht selbst nicht mitgezählt) [m] */
  sdInnen: number; sdAussen: number;
  /** s_d-Regel nach DIN 4108-3 (nachweisfreie nicht belüftete Dächer), geteilt an der Dämmschicht */
  sdPruefung: SdRegelErgebnis | null;
  einordnung: WandEinordnung | null;
  /** true: kein Hinweis auf Tauwasserrisiko (nachweisfreie Konstruktion oder s_d-Regel eingehalten) */
  unkritisch: boolean;
  gueltig: boolean; hinweise: Hinweis[];
}

/** Wärmeübergangswiderstände Wand, horizontaler Wärmestrom (DIN EN ISO 6946) */
export const RSI_WAND = 0.13;
export const RSE_WAND = 0.04;

export function schichtaufbau(schichten: readonly Schicht[], rsi = RSI_WAND, rse = RSE_WAND): SchichtaufbauErgebnis {
  const hinweise: Hinweis[] = [];
  const leer: SchichtaufbauErgebnis = { schichten: [], dickeGesamt: 0, rT: 0, u: 0, sdGesamt: 0, iDaemm: -1, sdInnen: 0, sdAussen: 0, sdPruefung: null, einordnung: null, unkritisch: false, gueltig: false, hinweise };
  muss(hinweise, schichten.length > 0, 'schichten', 'Mindestens eine Schicht ist erforderlich.');
  schichten.forEach((s, i) => {
    const nr = i + 1;
    muss(hinweise, istEndlich(s.dicke) && s.dicke > 0, `dicke${nr}`, `Schicht ${nr}: Die Dicke muss größer als 0 mm sein.`);
    muss(hinweise, istEndlich(s.lambda) && s.lambda > 0, `lambda${nr}`, `Schicht ${nr}: λ muss größer als 0 W/(mK) sein.`);
    muss(hinweise, istEndlich(s.mu) && s.mu >= 1, `mu${nr}`, `Schicht ${nr}: μ muss mindestens 1 sein (Luft).`);
  });
  muss(hinweise, istEndlich(rsi, rse) && rsi >= 0 && rse >= 0, 'rs', 'Die Wärmeübergangswiderstände dürfen nicht negativ sein.');
  if (hatFehler(hinweise)) return leer;
  schichten.forEach((s, i) => {
    const nr = i + 1;
    bereich(hinweise, `dicke${nr}`, s.dicke, 1, 1000, `Schicht ${nr}: Dicke außerhalb 1–1 000 mm.`);
    bereich(hinweise, `lambda${nr}`, s.lambda, 0.005, 5, `Schicht ${nr}: λ außerhalb des üblichen Bereichs 0,005–5 W/(mK).`);
  });

  const erg = schichten.map(s => ({ r: s.dicke / 1000 / s.lambda, sd: s.mu * s.dicke / 1000 }));
  const rT = rsi + rse + erg.reduce((a, s) => a + s.r, 0);
  const sdGesamt = erg.reduce((a, s) => a + s.sd, 0);
  const dickeGesamt = schichten.reduce((a, s) => a + s.dicke, 0) / 1000;

  // Teilung an der Dämmschicht = Schicht mit dem größten Wärmedurchlasswiderstand (DIN 4108-3: s_d,i unterhalb,
  // s_d,e oberhalb der Wärmedämmschicht; die Dämmschicht selbst zählt nicht mit)
  const iDaemm = erg.reduce((best, s, i) => (s.r > erg[best].r ? i : best), 0);
  const sdInnen = erg.slice(0, iDaemm).reduce((a, s) => a + s.sd, 0);
  const sdAussen = erg.slice(iDaemm + 1).reduce((a, s) => a + s.sd, 0);
  const sdPruefung = sdRegel(sdInnen, sdAussen);

  const tragendInnen = schichten.slice(0, iDaemm).some(s => s.kategorie === 'tragend');
  const tragendAussen = schichten.slice(iDaemm + 1).some(s => s.kategorie === 'tragend');
  const einordnung: WandEinordnung = tragendInnen && !tragendAussen ? 'aussendaemmung' : tragendAussen && !tragendInnen ? 'innendaemmung' : 'orientierung';
  if (schichten[iDaemm].kategorie !== 'daemmend') hinweise.push({ stufe: 'warnung', feld: 'kategorie', text: `Die Schicht mit dem größten Wärmedurchlasswiderstand (Schicht ${iDaemm + 1}) ist nicht als „dämmend“ eingestuft; die Teilung erfolgt trotzdem an ihr.` });
  if (einordnung === 'aussendaemmung') hinweise.push({ stufe: 'warnung', feld: 'einordnung', text: 'Außendämmung auf tragender Schicht (z. B. WDVS auf Mauerwerk): nach DIN 4108-3 eine Außenwand ohne rechnerischen Tauwassernachweis; Zuordnung im Einzelfall am Normtext prüfen.' });
  if (einordnung === 'innendaemmung') hinweise.push({ stufe: 'warnung', feld: 'einordnung', text: `Innendämmung (Dämmschicht innenseitig der tragenden Schicht): Tauwasser- bzw. hygrothermischen Nachweis führen (Glaser nach DIN 4108-3 oder DIN EN 15026); die s_d-Regel ist hier nur Orientierung.` });
  if (sdPruefung.sdiErforderlich === null && einordnung !== 'aussendaemmung') hinweise.push({ stufe: 'warnung', feld: 'sd', text: `s_d,e = ${formatDeZahl(sdAussen, 2)} m außerhalb der nachweisfreien Kombinationen: rechnerischer Nachweis erforderlich.` });

  return {
    schichten: erg, dickeGesamt, rT, u: 1 / rT, sdGesamt, iDaemm, sdInnen, sdAussen, sdPruefung, einordnung,
    unkritisch: einordnung === 'aussendaemmung' || (einordnung === 'orientierung' && sdPruefung.eingehalten),
    gueltig: true, hinweise,
  };
}
