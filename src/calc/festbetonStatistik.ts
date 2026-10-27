/**
 * Rechenkern Festbeton-Statistik und Konformität (Z3), übernommen aus src/modules/FestbetonStatistik.tsx:
 *  - charakteristische Festigkeit als 5-%-Quantil der Normalverteilung: f_ck = f_cm − 1,645·σ
 *  - Bemessungswert f_cd = α_cc·f_ck/γ_c (immer aus der Zylinderfestigkeit)
 *  - Anzeige als Würfelfestigkeit über das Verhältnis f_ck,cube/f_ck der Festigkeitsklassen (Tab. 3.1, fckCubeVonFck;
 *    Runde 5, Z55 – vorher pauschal 1,25; C30/37: 37/30 = 1,233, C50/60: 1,20)
 *  - Konformitätskriterien für die Druckfestigkeit nach DIN EN 206, 8.2.1.3, mit DIN 1045-2:
 *      Herstellungsbeginn (n = 3):     f_cm ≥ f_ck + 4,       f_ci ≥ f_ck − 4
 *      stetige Herstellung (n ≥ 15):   f_cm ≥ f_ck + 1,48·σ,  f_ci ≥ f_ck − 4, σ aus der vorausgehenden Prüfreihe, σ ≥ 3 N/mm²
 *    Das Modul setzt dabei f_ck = f_cm − 1,645·σ der eingestellten Verteilung an (Lehrdarstellung).
 *  - Schnellevaluator Konformität aus Einzelwerten (Modul Festbeton, Reiter 4): konformitaetDruck
 * Einheiten: N/mm². Reiner Rechenkern – geprüft in tests/festbetonStatistik.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss, bereich } from './plausibilitaet';
import { stichprobe } from './statistik';
import { fckCubeVonFck } from '../data/kennwerte';
import { formatDeZahl } from '../utils/numberFormat';

export type Probenform = 'zylinder' | 'wuerfel';
export type PruefArt = 'erst' | 'stetig';

/** Quantilwert der Standardnormalverteilung für 5 % */
export const K_FRAKTIL_5 = 1.645;
/** Mindeststandardabweichung für das Kriterium der stetigen Herstellung in N/mm² (DIN 1045-2, vorläufig, F-Freigabe) */
export const SIGMA_MIN_STETIG = 3.0;
/** Umrechnungsfaktor Würfel/Zylinder über die Festigkeitsklasse (f_ck,cube/f_ck nach Tab. 3.1) */
export function faktorWuerfel(fckCyl: number): number {
  return fckCyl > 0 ? fckCubeVonFck(fckCyl) / fckCyl : 15 / 12;
}

export interface FestbetonStatistikEingabe {
  /** mittlere Zylinderdruckfestigkeit f_cm,cyl in N/mm² */
  fcm: number;
  /** Standardabweichung σ_cyl in N/mm² */
  sigma: number;
  format: Probenform;
  alphaCc: number;
  gammaC: number;
  pruefArt: PruefArt;
}

export interface FestbetonStatistikErgebnis {
  /** charakteristische Zylinderdruckfestigkeit f_ck in N/mm² */
  fckCyl: number;
  /** Bemessungswert f_cd in N/mm² */
  fcd: number;
  /** Umrechnungsfaktor der Anzeige (1,0 Zylinder, f_ck,cube/f_ck der Klasse für Würfel) */
  faktor: number;
  anzeigeFcm: number;
  anzeigeSigma: number;
  anzeigeFck: number;
  /** Mindestmittelwert und Mindesteinzelwert der Konformitätsprüfung (Anzeigeformat) */
  mindestMittelwert: number;
  mindestEinzelwert: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function festbetonStatistik(e: FestbetonStatistikEingabe): FestbetonStatistikErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.fcm, e.sigma, e.alphaCc, e.gammaC), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  muss(hinweise, e.sigma >= 0, 'sigma', 'Die Standardabweichung darf nicht negativ sein.');
  muss(hinweise, e.gammaC > 0, 'gammaC', 'γ_c muss größer als 0 sein.');
  const fckCyl = e.fcm - K_FRAKTIL_5 * e.sigma;
  const fcd = (e.alphaCc * fckCyl) / e.gammaC;
  const faktor = e.format === 'wuerfel' ? faktorWuerfel(fckCyl) : 1.0;
  const anzeigeFcm = e.fcm * faktor;
  const anzeigeSigma = e.sigma * faktor;
  const anzeigeFck = fckCyl * faktor;
  const mindestMittelwert = e.pruefArt === 'stetig' ? anzeigeFck + 1.48 * Math.max(anzeigeSigma, SIGMA_MIN_STETIG) : anzeigeFck + 4;
  const mindestEinzelwert = anzeigeFck - 4;
  if (fckCyl <= 0) hinweise.push({ stufe: 'warnung', feld: 'sigma', text: 'f_ck ≤ 0: Die Streuung ist für diesen Mittelwert unrealistisch groß.' });
  bereich(hinweise, 'alphaCc', e.alphaCc, 0.8, 1.0, 'α_cc liegt außerhalb 0,8 … 1,0 (DIN EN 1992-1-1/NA: 0,85).');
  if (e.sigma >= 0 && anzeigeSigma < SIGMA_MIN_STETIG && e.pruefArt === 'stetig') hinweise.push({ stufe: 'warnung', feld: 'sigma', text: 'σ < 3 N/mm²: Für das Kriterium der stetigen Herstellung wird σ = 3 N/mm² angesetzt (DIN 1045-2).' });
  if (e.format === 'wuerfel') hinweise.push({ stufe: 'warnung', feld: 'format', text: `Würfelanzeige über f_ck,cube/f_ck = ${formatDeZahl(faktor, 3)} der Festigkeitsklasse (Tab. 3.1, linear zwischen den Klassen) statt pauschal 1,25.` });
  return { fckCyl, fcd, faktor, anzeigeFcm, anzeigeSigma, anzeigeFck, mindestMittelwert, mindestEinzelwert, gueltig: !hatFehler(hinweise), hinweise };
}

// ---------------------------------------------------------------- Schnellevaluator Konformität (Modul Festbeton, Reiter 4)
/** Würfelwerte aus Text: Trennung an Semikolon oder Leerzeichen, Komma als Dezimalzeichen; nur Werte > 0 */
export function pruefwerteAusText(text: string): number[] {
  return text
    .split(/[;\s]+/)
    .map(v => parseFloat(v.replace(',', '.')))
    .filter(v => !isNaN(v) && v > 0);
}

/** Mindeststandardabweichung des Schnellevaluators in N/mm² */
export const SIGMA_MIN_KONFORMITAET = 3.0;

export interface KonformitaetEingabe {
  /** Einzelwerte f_ci (Würfel) in N/mm² */
  werte: readonly number[];
  /** charakteristische Würfeldruckfestigkeit f_ck,cube der Klasse in N/mm² */
  fckCube: number;
  pruefArt: PruefArt;
  /** Standardabweichung σ der vorausgehenden Prüfreihe (stetige Herstellung, mindestens 35 Werte) in N/mm² */
  sigmaVorserie?: number;
}
export interface KonformitaetErgebnis {
  n: number; mittelwert: number; minimum: number;
  /** Stichproben-Standardabweichung s und angesetztes σ = max(s; 3) */
  s: number; sigmaAngesetzt: number;
  sollMittelwert: number; sollEinzelwert: number;
  mittelOk: boolean; einzelOk: boolean; anzahlOk: boolean; bestanden: boolean;
  gueltig: boolean;
  hinweise: Hinweis[];
}
/** Kriterien 1 und 2 nach DIN EN 206, 8.2.1.3 mit DIN 1045-2 (Runde 5, Z55):
 *  Herstellungsbeginn n ≥ 3: f_cm ≥ f_ck + 4; stetig n ≥ 15: f_cm ≥ f_ck + 1,48·σ mit σ aus der vorausgehenden Prüfreihe
 *  (sigmaVorserie), mindestens 3 N/mm²; stets f_ci ≥ f_ck − 4. Ohne σ der Vorserie wird ersatzweise die Stichprobe verwendet
 *  (Lehrdarstellung, mit Hinweis). */
export function konformitaetDruck(e: KonformitaetEingabe): KonformitaetErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, Number.isFinite(e.fckCube) && e.werte.every(Number.isFinite), 'eingabe', 'Klasse und Messwerte müssen Zahlen sein.');
  const n = e.werte.length;
  const st = stichprobe(e.werte);
  const mittelwert = n > 0 ? st.mittelwert : 0;
  const minimum = n > 0 ? st.sortiert[0] : 0;
  const s = n > 1 ? st.stdAbw : 0;
  const hatVorserie = e.sigmaVorserie !== undefined && Number.isFinite(e.sigmaVorserie);
  muss(hinweise, !hatVorserie || (e.sigmaVorserie as number) >= 0, 'sigmaVorserie', 'Die Standardabweichung der Vorserie darf nicht negativ sein.');
  const sigmaBasis = e.pruefArt === 'stetig' && hatVorserie ? (e.sigmaVorserie as number) : s;
  const sigmaAngesetzt = Math.max(sigmaBasis, SIGMA_MIN_KONFORMITAET);
  const sollMittelwert = e.pruefArt === 'erst' ? e.fckCube + 4.0 : e.fckCube + 1.48 * sigmaAngesetzt;
  const sollEinzelwert = e.fckCube - 4.0;
  const mittelOk = mittelwert >= sollMittelwert;
  const einzelOk = minimum >= sollEinzelwert;
  const anzahlOk = e.pruefArt === 'erst' ? n >= 3 : n >= 15;
  if (e.pruefArt === 'stetig' && n > 1 && sigmaBasis < SIGMA_MIN_KONFORMITAET) hinweise.push({ stufe: 'warnung', feld: 'werte', text: 'σ < 3 N/mm²: Nach DIN 1045-2 wird σ = 3 N/mm² angesetzt.' });
  if (e.pruefArt === 'stetig' && !hatVorserie) hinweise.push({ stufe: 'warnung', feld: 'sigma', text: 'Ohne σ der vorausgehenden Prüfreihe wird σ ersatzweise aus derselben Stichprobe geschätzt; DIN EN 206 verlangt bei stetiger Herstellung σ aus einer vorausgehenden Prüfreihe (mindestens 35 Werte).' });
  return { n, mittelwert, minimum, s, sigmaAngesetzt, sollMittelwert, sollEinzelwert, mittelOk, einzelOk, anzahlOk, bestanden: mittelOk && einzelOk && anzahlOk, gueltig: !hatFehler(hinweise), hinweise };
}
