/**
 * Membranspannung gekrümmter, unter Innendruck stehender Membranen (Kesselformel) – AP 3.13, Modul „Membranen und ETFE-Folien“.
 *
 *   Zylinder (einfach gekrümmter Streifen, Traglufthalle):  n = p · r
 *   Kugel (gleichsinnig doppelt gekrümmt, Kissenmitte):     n = p · r / 2
 *
 * Krümmungsradius aus Spannweite L und Stich f (Kreisbogen):  r = L²/(8·f) + f/2.
 * Vergleich mit einer zulässigen Membrankraft aus Kurzzeitfestigkeit und Gesamtsicherheitsbeiwert:
 *   Gewebe: n_zul = (f_t / 0,05 m) / γ   mit f_t in N/5 cm
 *   Folie:  n_zul = f · t / γ            mit f in N/mm², t in mm
 * Die Festigkeiten und γ sind Lehrwerte – die Bemessung erfolgt in Deutschland nach abZ/aBG bzw. vBG
 * (Abminderungsbeiwerte für Dauerlast, Temperatur, Alterung, Fügung) bzw. künftig nach EN 19102.
 * Reiner Rechenkern – geprüft in tests/membran.test.ts.
 */
import { type Hinweis, istEndlich, muss, hatFehler, bereich, nurGueltig } from './plausibilitaet';

export type MembranGeometrie = 'zylinder' | 'kugel';
export type MembranWerkstoff = 'gewebe' | 'folie';

/** Lehrwerte (Herstellerangaben, Größenordnung) – keine Bemessungswerte */
export const MEMBRAN_LEHRWERTE = {
  /** PVC/PES Typ II, Kurzzeitzugfestigkeit Kette [N/5 cm] (Datenblattwert, z. B. 4400/4000 Kette/Schuss) */
  pvcPesTyp2: 4000,
  /** PTFE/Glas mittlere Sorte [N/5 cm] (z. B. 5000/4500 Kette/Schuss) */
  ptfeGlas: 4500,
  /** ETFE-Folie: Spannung bei 10 % Dehnung [N/mm²] (Datenblatt, Mittelwert) */
  etfeSigma10: 23,
  /** ETFE-Folie: Bruchspannung [N/mm²] (Datenblatt, Mittelwert) */
  etfeBruch: 50,
  /** Lehrwert Gesamtsicherheitsbeiwert Gewebe (Kurzzeitfestigkeit → Gebrauchslast) */
  gammaGewebe: 5,
  /** Lehrwert Gesamtsicherheitsbeiwert Folie (bezogen auf σ bei 10 % Dehnung) */
  gammaFolie: 2,
} as const;

export interface MembranEingabe {
  geometrie: MembranGeometrie;
  /** Innendruck bzw. Flächenlast senkrecht zur Membran [Pa = N/m²] */
  p: number;
  /** Krümmungsradius [m]; wenn > 0, werden Spannweite/Stich nicht verwendet */
  radius?: number;
  /** Spannweite L [m] (nur wenn kein Radius) */
  spannweite?: number;
  /** Stich f [m] (nur wenn kein Radius) */
  stich?: number;
  werkstoff: MembranWerkstoff;
  /** Gewebe: Kurzzeitzugfestigkeit in maßgebender Richtung [N/5 cm] */
  festigkeitGewebe?: number;
  /** Folie: Dicke [µm] */
  dickeUm?: number;
  /** Folie: Bezugsfestigkeit [N/mm²] */
  festigkeitFolie?: number;
  /** Gesamtsicherheitsbeiwert γ [-] */
  gamma: number;
}

export interface MembranErgebnis {
  r: number;
  /** Membrankraft [N/m] */
  n: number;
  /** Membrankraft [kN/m] */
  nKN: number;
  /** zulässige Membrankraft [N/m] */
  nZul: number;
  /** Folienspannung [N/mm²] (nur Folie, sonst NaN) */
  sigma: number;
  /** Ausnutzung n / n_zul [-] */
  eta: number;
  ok: boolean;
  hinweise: Hinweis[];
}

/** Kreisbogenradius aus Spannweite L und Stich f: r = L²/(8f) + f/2 */
export function radiusAusStich(L: number, f: number): number {
  return (L * L) / (8 * f) + f / 2;
}

/** Kesselformel: Membrankraft [N/m] für p [Pa] und r [m] */
export function membranKraft(geometrie: MembranGeometrie, p: number, r: number): number {
  return geometrie === 'zylinder' ? p * r : (p * r) / 2;
}

const LEER = (hinweise: Hinweis[]): MembranErgebnis => nurGueltig(({ r: NaN, n: NaN, nKN: NaN, nZul: NaN, sigma: NaN, eta: NaN, ok: false, hinweise }));

export function membranNachweis(e: MembranEingabe): MembranErgebnis {
  const hinweise: Hinweis[] = [];
  const mitRadius = e.radius !== undefined && e.radius > 0;
  const L = e.spannweite ?? NaN, f = e.stich ?? NaN;

  muss(hinweise, istEndlich(e.p, e.gamma), 'eingabe', 'Innendruck und Sicherheitsbeiwert müssen Zahlen sein.');
  muss(hinweise, mitRadius ? istEndlich(e.radius as number) : istEndlich(L, f), 'geometrie', 'Radius bzw. Spannweite und Stich müssen Zahlen sein.');
  if (e.werkstoff === 'gewebe') muss(hinweise, istEndlich(e.festigkeitGewebe ?? NaN), 'festigkeitGewebe', 'Die Gewebefestigkeit muss eine Zahl sein.');
  else muss(hinweise, istEndlich(e.dickeUm ?? NaN, e.festigkeitFolie ?? NaN), 'dickeUm', 'Foliendicke und Festigkeit müssen Zahlen sein.');
  if (hatFehler(hinweise)) return LEER(hinweise);

  muss(hinweise, e.p > 0, 'p', 'Der Innendruck muss größer als 0 sein – ohne Überdruck trägt die Membran nicht.');
  muss(hinweise, e.gamma >= 1, 'gamma', 'Der Sicherheitsbeiwert muss mindestens 1 sein.');
  if (!mitRadius) {
    muss(hinweise, L > 0 && f > 0, 'stich', 'Spannweite und Stich müssen größer als 0 sein (ebene Membran: r → ∞).');
    muss(hinweise, f <= L / 2, 'stich', 'Der Stich darf höchstens die halbe Spannweite betragen (Halbkreis).');
  }
  if (e.werkstoff === 'gewebe') muss(hinweise, (e.festigkeitGewebe as number) > 0, 'festigkeitGewebe', 'Die Gewebefestigkeit muss größer als 0 sein.');
  else muss(hinweise, (e.dickeUm as number) > 0 && (e.festigkeitFolie as number) > 0, 'dickeUm', 'Foliendicke und Festigkeit müssen größer als 0 sein.');
  if (hatFehler(hinweise)) return LEER(hinweise);

  const r = mitRadius ? (e.radius as number) : radiusAusStich(L, f);
  const n = membranKraft(e.geometrie, e.p, r);

  let nZul: number, sigma = NaN;
  if (e.werkstoff === 'gewebe') {
    nZul = (e.festigkeitGewebe as number) / 0.05 / e.gamma;
    bereich(hinweise, 'festigkeitGewebe', e.festigkeitGewebe as number, 1000, 12000, 'Gewebefestigkeit außerhalb der üblichen Spanne architektonischer Membranen (rund 1000–12 000 N/5 cm).');
  } else {
    const tMm = (e.dickeUm as number) / 1000;
    nZul = ((e.festigkeitFolie as number) * tMm * 1000) / e.gamma; // N/mm → N/m
    sigma = n / 1000 / tMm; // N/m → N/mm, dann / mm
    bereich(hinweise, 'dickeUm', e.dickeUm as number, 50, 400, 'Foliendicke außerhalb des üblichen Bereichs für ETFE-Bauteile (etwa 50–400 µm).');
    bereich(hinweise, 'festigkeitFolie', e.festigkeitFolie as number, 5, 60, 'Folienfestigkeit außerhalb der üblichen Spanne für ETFE (Bruchspannung um 50 N/mm²).');
  }
  bereich(hinweise, 'p', e.p, 100, 1000, 'Innendruck außerhalb des üblichen Bereichs pneumatischer Konstruktionen (etwa 100–1000 Pa).');
  if (e.gamma < 1.5) warnung(hinweise, 'gamma', 'Sehr kleiner Sicherheitsbeiwert: Langzeit-, Temperatur- und Fügungseinflüsse mindern die Festigkeit von Membranen deutlich.');
  if (!mitRadius && f / L < 0.05) warnung(hinweise, 'stich', 'Sehr flache Wölbung (f/L < 1/20): Der Radius und damit die Membrankraft werden groß.');

  const eta = n / nZul;
  return nurGueltig({ r, n, nKN: n / 1000, nZul, sigma, eta, ok: eta <= 1, hinweise });
}

function warnung(h: Hinweis[], feld: string, text: string) {
  h.push({ stufe: 'warnung', feld, text });
}
