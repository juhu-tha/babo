import { formatDeIntl } from '../utils/numberFormat';
/**
 * Rechenkern Expositionsklassen (Z3), übernommen aus src/modules/Expositionsklassen.tsx:
 *  - maßgebende Hüllwerte mehrerer Expositionsklassen (DIN 1045-2, Tab. F.2.1/F.2.2; DIN EN 1992-1-1/NA, Tab. 4.4DE):
 *    kleinster (w/z)_eq, höchste Mindestdruckfestigkeitsklasse, größter Mindestzementgehalt, größter Mindestluftgehalt
 *    (je Größtkorn), größte c_min,dur (mindestens 10 mm) und c_nom = c_min,dur + Δc_dev
 *  - k-Wert-Ansatz (DIN 1045-2, 5.2.5.2): Flugasche k_f = 0,4 mit f ≤ 0,33·z, Silikastaub k_s = 1,0 mit s ≤ 0,11·z;
 *    äquivalenter Bindemittelgehalt z_eq = z + k_f·f + k_s·s, (w/z)_eq = w/z_eq
 * Einheiten: Gehalte in kg/m³, Luftgehalt in Vol.-%, Deckung in mm. Die Klassendaten werden übergeben (Daten liegen im Modul).
 * Reiner Rechenkern – geprüft in tests/expositionsklassen.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss } from './plausibilitaet';

/** Rangfolge der Festigkeitsklassen für den Hüllwert-Vergleich (wie im Modul) */
export const FESTIGKEITS_RANG: Readonly<Record<string, number>> = {
  'C8/10': 1, 'C12/15': 2, 'C16/20': 3, 'C20/25': 4, 'C25/30': 5, 'C30/37': 6, 'C35/45': 7, 'C40/50': 8, 'C45/55': 9, 'C50/60': 10,
};

export type Groesstkorn = 32 | 16 | 8;

/** Strukturell kompatibel zu NormExposureClass aus src/modules/expositionsklassen/daten.ts */
export interface ExpositionsAnforderung {
  code: string;
  maxWzEq: number | null;
  minStrengthClass: string;
  minCement: number | null;
  minAirContent?: { dmax32: number; dmax16: number; dmax8: number };
  requiresAirEntrainment?: boolean;
  minCoverDurMm: number | null;
}

export interface HuellwerteErgebnis {
  minWzEq: number | null;
  highestClass: string;
  maxCement: number;
  requiresLP: boolean;
  minAirVal: number | null;
  maxCoverDur: number;
  cNom: number;
  specialReqs: string[];
  gueltig: boolean;
  hinweise: Hinweis[];
}

/** Maßgebende Hüllwerte; null, wenn keine Klasse gewählt ist (wie im Modul). */
export function huellwerte(alle: readonly ExpositionsAnforderung[], gewaehlt: readonly string[], dmax: Groesstkorn, deltaCdev: number): HuellwerteErgebnis | null {
  if (gewaehlt.length === 0) return null;
  const hinweise: Hinweis[] = [];
  muss(hinweise, Number.isFinite(deltaCdev) && deltaCdev >= 0, 'deltaCdev', 'Δc_dev muss ≥ 0 mm sein.');
  const matched = alle.filter(c => gewaehlt.includes(c.code));
  let minWzEq: number | null = null;
  for (const c of matched) if (c.maxWzEq !== null && (minWzEq === null || c.maxWzEq < minWzEq)) minWzEq = c.maxWzEq;
  let highestClass = 'C8/10', highestRank = 1;
  for (const c of matched) {
    const rank = FESTIGKEITS_RANG[c.minStrengthClass] || 0;
    if (rank > highestRank) { highestRank = rank; highestClass = c.minStrengthClass; }
    if (!(c.minStrengthClass in FESTIGKEITS_RANG)) hinweise.push({ stufe: 'warnung', feld: 'klassen', text: `Festigkeitsklasse ${c.minStrengthClass} ist in der Rangfolge nicht enthalten und wird nicht berücksichtigt.` });
  }
  let maxCement = 0;
  for (const c of matched) if (c.minCement !== null && c.minCement > maxCement) maxCement = c.minCement;
  const requiresLP = matched.some(c => c.requiresAirEntrainment);
  let minAirVal: number | null = null;
  if (requiresLP) {
    for (const c of matched) if (c.minAirContent) {
      const air = dmax === 32 ? c.minAirContent.dmax32 : dmax === 16 ? c.minAirContent.dmax16 : c.minAirContent.dmax8;
      if (minAirVal === null || air > minAirVal) minAirVal = air;
    }
  }
  let maxCoverDur = 10;
  for (const c of matched) if (c.minCoverDurMm !== null && c.minCoverDurMm > maxCoverDur) maxCoverDur = c.minCoverDurMm;
  const cNom = maxCoverDur + deltaCdev;
  const has = (k: string) => gewaehlt.includes(k);
  const specialReqs: string[] = [];
  if (has('XA2') || has('XA3')) specialReqs.push('Bei Sulfatangriff (> 600 mg/l SO₄²⁻ im Wasser) SR-Zement; bis 1500 mg/l alternativ Zement-Flugasche-Gemisch.');
  if (has('XA3')) specialReqs.push('XA3: zusätzlich Schutz des Betons oder Gutachten (DIN 1045-2).');
  if (has('XM2')) specialReqs.push('XM2: Oberflächenbehandlung des Betons – sonst w/z ≤ 0,45 und C35/45.');
  if (has('XM3')) specialReqs.push('XM3: Hartstoffe nach DIN 1100.');
  if (has('XF4')) specialReqs.push('XF4: nur Luftporenbeton.');
  if (has('XC1') && maxCoverDur <= 10) specialReqs.push('Nur XC1: Δc_dev darf auf 10 mm verringert werden.');
  if (matched.length < gewaehlt.length) hinweise.push({ stufe: 'warnung', feld: 'klassen', text: 'Mindestens eine gewählte Klasse ist in den Daten nicht vorhanden.' });
  return { minWzEq, highestClass, maxCement, requiresLP, minAirVal, maxCoverDur, cNom, specialReqs, gueltig: !hatFehler(hinweise), hinweise };
}

export interface KWertEingabe {
  /** Zement z, Wasser w, Flugasche f, Silikastaub s in kg/m³ */
  zement: number;
  wasser: number;
  flugasche: number;
  silika: number;
}
export interface KWertErgebnis {
  rawWz: number;
  maxF: number; effectiveF: number; kF: number;
  maxS: number; effectiveS: number; kS: number;
  /** äquivalenter Bindemittelgehalt in kg/m³ und (w/z)_eq */
  beq: number;
  wzEq: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}
export function kWertAnsatz(e: KWertEingabe): KWertErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.zement, e.wasser, e.flugasche, e.silika) && e.zement >= 0 && e.wasser >= 0 && e.flugasche >= 0 && e.silika >= 0, 'eingabe', 'Alle Gehalte müssen ≥ 0 kg/m³ sein.');
  const maxF = e.zement * 0.33;
  const effectiveF = Math.min(e.flugasche, maxF);
  const kF = 0.40;
  const rawWz = e.zement > 0 ? e.wasser / e.zement : 0;
  const kS = 1.0;
  const maxS = e.zement * 0.11;
  const effectiveS = Math.min(e.silika, maxS);
  const beq = e.zement + kF * effectiveF + kS * effectiveS;
  const wzEq = beq > 0 ? e.wasser / beq : 0;
  if (e.flugasche > maxF) hinweise.push({ stufe: 'warnung', feld: 'flugasche', text: 'f > 0,33·z: Nur 0,33·z dürfen angerechnet werden.' });
  if (e.silika > maxS) hinweise.push({ stufe: 'warnung', feld: 'silika', text: 's > 0,11·z: Nur 0,11·z dürfen angerechnet werden.' });
  // Runde 5 (Z55): Kombinationsregel DIN 1045-2 (Alkalitätsreserve) f/z ≤ 3·(0,22 − s/z), d. h. f ≤ 0,66·z − 3·s (CEM I);
  // für CEM II-S, CEM II/A-D, CEM II-T, CEM II/A-LL und CEM III/A gilt f ≤ 0,45·z − 3·s (Zementart hier nicht wählbar)
  const maxFKombination = Math.max(0, 0.66 * e.zement - 3 * e.silika);
  if (e.flugasche > 0 && e.silika > 0 && e.flugasche > maxFKombination + 1e-9) hinweise.push({ stufe: 'warnung', feld: 'flugasche', text: `Flugasche und Silikastaub gemeinsam: f ≤ 0,66·z − 3·s = ${formatDeIntl(Math.round(maxFKombination))} kg/m³ (CEM I, DIN 1045-2) ist überschritten; mit CEM II-S, II/A-D, II-T, II/A-LL, III/A gilt f ≤ 0,45·z − 3·s.` });
  else if (e.flugasche > 0 && e.silika > 0) hinweise.push({ stufe: 'warnung', feld: 'flugasche', text: 'Flugasche und Silikastaub gemeinsam: f ≤ 0,66·z − 3·s (CEM I) eingehalten; mit CEM II-S, II/A-D, II-T, II/A-LL, III/A gilt die strengere Grenze f ≤ 0,45·z − 3·s.' });
  return { rawWz, maxF, effectiveF, kF, maxS, effectiveS, kS, beq, wzEq, gueltig: !hatFehler(hinweise), hinweise };
}
