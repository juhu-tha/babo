/**
 * Rechenkern Bauchemie (AP 4.2), übernommen aus src/modules/Bauchemie.tsx. Lehr- und Vorbemessungswerkzeug:
 *  - Stellmittel-Rheologie (Lehrmodell): η(γ̇) = 1,5 + c·90/(γ̇^0,72 + 0,25) [Pa·s], gerundet auf 0,1 Pa·s;
 *    Bewertung von Standfestigkeit (γ̇ < 5 s⁻¹) und Verarbeitung nach Dosierung (0,4 … 1,5 %)
 *  - AKR-Dehnung (Lehrmodell): ε(t) = (Na₂O-Äq./5)·f_F·ln(t + 1) [mm/m] mit f_F = φ/100 für φ > 80 %, sonst 0,1
 *  - Karbonatisierung: Wurzel-t-Gesetz d_k = K·√t und t = (c/K)² aus src/calc/schnellkarbonatisierung.ts,
 *    Richtwerte K je w/z-Wert für das Diagramm
 *  - Stöchiometrie: molare Masse aus der Summenformel (Standard-Atomgewichte IUPAC/CIAAW, gekürzt),
 *    Massenumsatz bei bekanntem Stoffmengenverhältnis, z. B. Ca(OH)₂ + CO₂ → CaCO₃ + H₂O
 *  - pH-Wert und Hydroxidionenkonzentration bei 25 °C: pH = 14 + lg[OH⁻]
 * Reiner Rechenkern – geprüft in tests/bauchemie.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss } from './plausibilitaet';
import { tiefeNach, zeitBisTiefe } from './schnellkarbonatisierung';

export interface Ergebnis { gueltig: boolean; hinweise: Hinweis[] }
const abschluss = (h: Hinweis[]): Ergebnis => ({ gueltig: !hatFehler(h), hinweise: h });
const runde1 = (x: number) => Math.round(x * 10) / 10;

// ---------------------------------------------------------------- Stellmittel / Rheologie
/** Scherraten der Diagrammkurve in s⁻¹ */
export const SCHERRATEN = [0.1, 1, 5, 10, 20, 30, 50, 70, 90, 100] as const;
/** Viskosität der Referenz-Slurry ohne Stellmittel (newtonsch) in Pa·s */
export const VISKOSITAET_REFERENZ = 2.0;
/** Dosierbereich mit guter Standfestigkeit in % und Grenze Ruhe/Scherung in s⁻¹ */
export const STELLMITTEL_OPTIMAL = { min: 0.4, max: 1.5 } as const;
export const SCHERRATE_RUHE = 5;

/** Scheinbare Viskosität in Pa·s (Lehrmodell, scherverdünnend), gerundet auf 0,1 Pa·s */
export const stellmittelViskositaet = (konzentration: number, scherrate: number) =>
  runde1(1.5 + (konzentration * 90) / (Math.pow(scherrate, 0.72) + 0.25));

export type Dosierung = 'unter' | 'optimal' | 'ueber';
export type Kraftaufwand = 'hoch' | 'leicht' | 'optimal';
export interface RheologieErgebnis extends Ergebnis {
  kurve: number[];
  referenz: number[];
  /** Viskosität bei der gewählten Scherrate in Pa·s */
  viskositaet: number;
  /** Ruhezustand (Standfestigkeit) oder Scherung (Verarbeitung) */
  ruhe: boolean;
  dosierung: Dosierung;
  kraftaufwand: Kraftaufwand;
}
/** Konzentration in % (bezogen auf das Bindemittel), Scherrate in s⁻¹ */
export function stellmittelRheologie(konzentration: number, scherrate: number): RheologieErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(konzentration, scherrate) && konzentration >= 0 && scherrate >= 0, 'eingabe', 'Konzentration und Scherrate müssen ≥ 0 sein.');
  const viskositaet = stellmittelViskositaet(konzentration, scherrate);
  const dosierung: Dosierung = konzentration < STELLMITTEL_OPTIMAL.min ? 'unter' : konzentration <= STELLMITTEL_OPTIMAL.max ? 'optimal' : 'ueber';
  const kraftaufwand: Kraftaufwand = viskositaet > 15 ? 'hoch' : viskositaet < 4 ? 'leicht' : 'optimal';
  if (konzentration > 2) h.push({ stufe: 'warnung', feld: 'konzentration', text: 'Das Lehrmodell ist für Stellmittelgehalte bis 2 % angelegt.' });
  return {
    kurve: SCHERRATEN.map(s => stellmittelViskositaet(konzentration, s)),
    referenz: SCHERRATEN.map(() => VISKOSITAET_REFERENZ),
    viskositaet, ruhe: scherrate < SCHERRATE_RUHE, dosierung, kraftaufwand, ...abschluss(h),
  };
}

// ---------------------------------------------------------------- AKR (Lehrmodell)
/** Feuchteschwelle des Lehrmodells in % r. F. */
export const AKR_FEUCHTESCHWELLE = 80;
/** AKR-Dehnung in mm/m nach t Jahren; Alkaligehalt Na₂O-Äquivalent in kg/m³, Feuchte in % */
export function akrDehnung(alkali: number, feuchte: number, tJahre: number): number {
  const k = (alkali / 5) * (feuchte > AKR_FEUCHTESCHWELLE ? feuchte / 100 : 0.1);
  return k * Math.log(tJahre + 1);
}
export interface AkrErgebnis extends Ergebnis { jahre: number[]; dehnung: number[] }
export function akrKurve(alkali: number, feuchte: number, jahre = 20): AkrErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(alkali, feuchte, jahre) && alkali >= 0 && feuchte >= 0 && feuchte <= 100, 'eingabe', 'Alkaligehalt ≥ 0 und Feuchte zwischen 0 und 100 % erforderlich.');
  muss(h, Number.isInteger(jahre) && jahre >= 1, 'jahre', 'Die Anzahl der Jahre muss eine ganze Zahl ≥ 1 sein.');
  const n = Number.isInteger(jahre) && jahre >= 1 ? jahre : 0;
  const t = Array.from({ length: n }, (_, i) => i + 1);
  return { jahre: t, dehnung: t.map(x => akrDehnung(alkali, feuchte, x)), ...abschluss(h) };
}

// ---------------------------------------------------------------- Karbonatisierung
/** Richtwerte des Karbonatisierungskoeffizienten K in mm/√a je w/z-Wert (Lehrdiagramm, keine Normwerte) */
export const K_RICHTWERTE: readonly { wz: number; k: number }[] = [
  { wz: 0.6, k: 4 },
  { wz: 0.5, k: 2 },
  { wz: 0.4, k: 0.5 },
];
/** Zeitpunkte des Diagramms in Jahren */
export const KARBONATISIERUNG_ZEITEN = [0, 5, 10, 25, 50, 100] as const;
/** Karbonatisierungstiefe in mm nach t Jahren (Wurzel-t-Gesetz) */
export const karbonatisierungstiefe = (kMmJeWurzelA: number, tJahre: number) => tiefeNach(kMmJeWurzelA, tJahre);
/** Zeit in Jahren, bis die Front die Betondeckung c in mm erreicht */
export function zeitBisBewehrung(deckungMm: number, kMmJeWurzelA: number): { jahre: number } & Ergebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(deckungMm, kMmJeWurzelA) && deckungMm >= 0 && kMmJeWurzelA > 0, 'eingabe', 'Deckung ≥ 0 und K > 0 erforderlich.');
  return { jahre: zeitBisTiefe(deckungMm, kMmJeWurzelA), ...abschluss(h) };
}

// ---------------------------------------------------------------- Stöchiometrie
/** Standard-Atomgewichte in g/mol (IUPAC/CIAAW, gekürzte Werte) */
export const ATOMMASSEN: Readonly<Record<string, number>> = {
  H: 1.008, C: 12.011, N: 14.007, O: 15.999, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085,
  S: 32.06, Cl: 35.45, K: 39.098, Ca: 40.078, Fe: 55.845,
};

/**
 * Molare Masse in g/mol aus einer Summenformel mit Klammern, z. B. „Ca(OH)2“, „CaCO3“, „Ca3SiO5“.
 * Unbekannte Elemente oder Syntaxfehler ergeben NaN.
 */
export function molmasse(formel: string): number {
  let i = 0;
  const zahl = () => {
    const m = /^\d+/.exec(formel.slice(i));
    if (!m) return 1;
    i += m[0].length;
    return Number(m[0]);
  };
  const gruppe = (): number => {
    let summe = 0;
    while (i < formel.length && formel[i] !== ')') {
      if (formel[i] === '(') {
        i++;
        const innen = gruppe();
        if (formel[i] !== ')') return NaN;
        i++;
        summe += innen * zahl();
        continue;
      }
      const m = /^[A-Z][a-z]?/.exec(formel.slice(i));
      if (!m || !(m[0] in ATOMMASSEN)) return NaN;
      i += m[0].length;
      summe += ATOMMASSEN[m[0]] * zahl();
    }
    return summe;
  };
  if (!formel) return NaN;
  const wert = gruppe();
  return i === formel.length ? wert : NaN;
}

export interface UmsatzErgebnis extends Ergebnis {
  /** molare Massen in g/mol */
  mAusgang: number;
  mZiel: number;
  /** Massenverhältnis m_Ziel/m_Ausgang */
  verhaeltnis: number;
  /** umgesetzte Masse des Zielstoffs (Einheit wie masseAusgang) */
  masse: number;
}
/**
 * Masse eines Reaktionspartners aus der Masse eines anderen bei bekanntem Stoffmengenverhältnis:
 * m_Z = m_A · (ν_Z·M_Z)/(ν_A·M_A). Massen in beliebiger, gleicher Einheit.
 */
export function stoffumsatz(ausgang: string, ziel: string, masseAusgang: number, nuAusgang = 1, nuZiel = 1): UmsatzErgebnis {
  const h: Hinweis[] = [];
  const mAusgang = molmasse(ausgang), mZiel = molmasse(ziel);
  muss(h, Number.isFinite(mAusgang) && Number.isFinite(mZiel), 'formel', 'Summenformel nicht lesbar oder Element nicht hinterlegt.');
  muss(h, istEndlich(masseAusgang, nuAusgang, nuZiel) && masseAusgang >= 0 && nuAusgang > 0 && nuZiel > 0, 'eingabe', 'Masse ≥ 0 und stöchiometrische Zahlen > 0 erforderlich.');
  const verhaeltnis = (nuZiel * mZiel) / (nuAusgang * mAusgang);
  return { mAusgang, mZiel, verhaeltnis, masse: masseAusgang * verhaeltnis, ...abschluss(h) };
}

// ---------------------------------------------------------------- pH-Wert
/** Ionenprodukt des Wassers pK_W bei 25 °C */
export const PKW_25 = 14;
/** pH aus der Hydroxidionenkonzentration in mol/l (25 °C) */
export const phAusHydroxid = (cOH: number) => PKW_25 + Math.log10(cOH);
/** Hydroxidionenkonzentration in mol/l aus dem pH-Wert (25 °C) */
export const hydroxidAusPh = (ph: number) => Math.pow(10, ph - PKW_25);
/** pH aus der Oxoniumionenkonzentration in mol/l */
export const phAusOxonium = (cH3O: number) => -Math.log10(cH3O);
/** Oxoniumionenkonzentration in mol/l aus dem pH-Wert */
export const oxoniumAusPh = (ph: number) => Math.pow(10, -ph);
