/**
 * Rechenkern Erdbau (Z3), übernommen aus src/modules/Erdbau.tsx:
 *  - vereinfachte Bodengruppe nach DIN 18196 aus Feinkornanteil (≤ 0,063 mm): ≤ 5 % grobkörnig, 5 … 15 % gemischtkörnig,
 *    15 … < 40 % gemischtkörnig mit hohem Feinanteil (*), ≥ 40 % feinkörnig; Kies (G), wenn der Massenanteil ≤ 2 mm höchstens
 *    60 % beträgt (Kornanteil > 2 mm ≥ 40 % der Gesamtmasse), sonst Sand (S) – Runde 5, Quelle: FORUM VERLAG, „Bodengruppen
 *    nach DIN 18196“ (öffentliche Wiedergabe); Korngrenzen Ton/Schluff/Sand/Kies 0,002/0,063/2/63 mm nach DIN EN ISO 14688-1;
 *    Frostempfindlichkeit F1/F2/F3 (ZTV E-StB 17, Tab. 1: F1 GW/GI/GE/SW/SI/SE; F2 TA, OT, OH, OK, ST, GT, SU, GU;
 *    F3 TL, TM, UL, UM, UA, OU, ST*, GT*, SU*, GU*)
 *  - Mindestdicke des frostsicheren Oberbaus vereinfacht nach RStO 12, Tab. 6/7: Ausgangswert je F-Klasse und
 *    Belastungsklasse (F3: 65/60/50 cm, F2: 55/50/40 cm), Mehrdicke Frosteinwirkungszone I/II/III: 0/+5/+15 cm,
 *    ungünstige Wasserverhältnisse +5 cm; gebundene Schichten pauschal 30 cm (Bk100, Bk32) bzw. 15 cm; FSS ≥ 15 cm
 * Einheiten: Anteile in M.-%, Dicken in cm. Reiner Rechenkern – geprüft in tests/erdbau.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss } from './plausibilitaet';

/** Grenze Kies/Sand nach DIN 18196: Kornanteil > 2 mm in M.-% der Gesamtmasse (Anteil ≤ 2 mm höchstens 60 %) */
export const KIES_GRENZE_18196 = 40;
/** Korngrößenbereiche nach DIN EN ISO 14688-1 in mm (Obergrenzen): Ton, Schluff, Sand, Kies, Steine */
export const KORNGRENZEN_14688 = { ton: 0.002, schluff: 0.063, sand: 2, kies: 63, steine: 200 } as const;

export interface BodenEingabe {
  /** Feinkornanteil < 0,063 mm in M.-% */
  feinanteil: number;
  /** Kies- und Sandanteil am Grobkorn (relativ, werden auf den Grobkornanteil 100 − Feinanteil umgerechnet) */
  kiesanteil: number;
  sandanteil: number;
  organik: 'keine' | 'stark';
  plastizitaet: 'nicht' | 'mittel' | 'ausgeprägt';
}
export interface BodenErgebnis {
  gruppe: string;
  name: string;
  frost: 'F1' | 'F2' | 'F3';
  tauglich: string;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function bodengruppe(e: BodenEingabe): BodenErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.feinanteil, e.kiesanteil, e.sandanteil) && e.feinanteil >= 0 && e.feinanteil <= 100 && e.kiesanteil >= 0 && e.sandanteil >= 0, 'feinanteil', 'Anteile müssen zwischen 0 und 100 % liegen.');
  const fertig = (r: Omit<BodenErgebnis, 'gueltig' | 'hinweise'>): BodenErgebnis => ({ ...r, gueltig: !hatFehler(hinweise), hinweise });
  const gesamtGrob = e.kiesanteil + e.sandanteil;
  const relativKies = gesamtGrob > 0 ? (e.kiesanteil / gesamtGrob) * 100 : 0;
  // DIN 18196: Kies, wenn der Massenanteil ≤ 2 mm (Sand + Feinkorn) ≤ 60 % ist, d. h. Kieskorn ≥ 40 % der Gesamtmasse
  const kiesGesamt = (relativKies * (100 - e.feinanteil)) / 100;
  const istKies = kiesGesamt >= KIES_GRENZE_18196 - 1e-9;
  if (e.organik === 'stark') return fertig({ gruppe: 'HN / HZ / F', name: 'Organische Böden (Torf/Mudde)', frost: 'F3', tauglich: 'Ungeeignet als Baugrund.' });
  if (e.feinanteil >= 40 && e.plastizitaet === 'nicht') hinweise.push({ stufe: 'warnung', feld: 'plastizitaet', text: 'Feinkörnige Böden ohne Angabe der Plastizität werden als Schluff eingeordnet.' });
  if (e.feinanteil <= 5) {
    if (istKies) return fertig({ gruppe: 'GW / GI / GE', name: 'Kies, weitgestuft bis enggestuft', frost: 'F1', tauglich: 'Sehr gut tragfähig, frostsicher.' });
    return fertig({ gruppe: 'SW / SI / SE', name: 'Sand, weitgestuft bis enggestuft', frost: 'F1', tauglich: 'Gut tragfähig, frostsicher.' });
  }
  if (e.feinanteil <= 15) {
    if (istKies) return fertig({ gruppe: 'GU / GT', name: 'Kies-Schluff- / Kies-Ton-Gemisch', frost: 'F2', tauglich: 'Tragfähig, aber bedingt frostempfindlich.' });
    return fertig({ gruppe: 'SU / ST', name: 'Sand-Schluff- / Sand-Ton-Gemisch', frost: 'F2', tauglich: 'Tragfähig, aber bedingt frostempfindlich.' });
  }
  if (e.feinanteil < 40) {
    if (istKies) return fertig({ gruppe: 'GU* / GT*', name: 'Kies-Schluff- / Kies-Ton-Gemisch (hoher Feinanteil)', frost: 'F3', tauglich: 'Eingeschränkt tragfähig, witterungs- und sehr frostempfindlich.' });
    return fertig({ gruppe: 'SU* / ST*', name: 'Sand-Schluff- / Sand-Ton-Gemisch (hoher Feinanteil)', frost: 'F3', tauglich: 'Eingeschränkt tragfähig, witterungs- und sehr frostempfindlich.' });
  }
  // geändert (Modulprüfung Tranche 5): TA gehört nach ZTV E-StB 17, Tab. 1 zur Klasse F2 (gering bis mittel frostempfindlich), nicht zu F3
  if (e.plastizitaet === 'ausgeprägt') return fertig({ gruppe: 'TA', name: 'Ausgeprägt plastischer Ton', frost: 'F2', tauglich: 'Stark setzungsempfindlich und witterungsempfindlich; wegen der sehr geringen Durchlässigkeit nur gering bis mittel frostempfindlich (F2).' });
  return fertig({ gruppe: 'UL / UM', name: 'Feinkörniger Schluff', frost: 'F3', tauglich: 'Extrem witterungsempfindlich (fließt bei Wasserzutritt), frostempfindlich.' });
}

export type RstoKlasse = 'Bk100' | 'Bk32' | 'Bk10' | 'BK3' | 'BK1' | 'BK03';
export interface FrostschutzEingabe {
  /** Frosteinwirkungszone 1, 2 oder 3 */
  frostzone: number;
  bauklasse: RstoKlasse;
  bodengruppe: 'F2' | 'F3';
  wasser: 'guenstig' | 'unguenstig';
}
export interface FrostschutzErgebnis {
  /** Mindestdicke frostsicherer Oberbau, gebundene Schichten, Frostschutzschicht in cm */
  gesamtDicke: number;
  dickeAsphalt: number;
  dickeFSS: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}
export function frostschutz(e: FrostschutzEingabe): FrostschutzErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, e.frostzone === 1 || e.frostzone === 2 || e.frostzone === 3, 'frostzone', 'Die Frosteinwirkungszone muss I, II oder III sein.');
  const hoch = e.bauklasse === 'Bk100' || e.bauklasse === 'Bk32' || e.bauklasse === 'Bk10';
  const mittel = e.bauklasse === 'BK3' || e.bauklasse === 'BK1';
  let d = e.bodengruppe === 'F3' ? (hoch ? 65 : mittel ? 60 : 50) : (hoch ? 55 : mittel ? 50 : 40);
  d += e.frostzone === 2 ? 5 : e.frostzone === 3 ? 15 : 0;
  if (e.wasser === 'unguenstig') d += 5;
  const dickeAsphalt = (e.bauklasse === 'Bk100' || e.bauklasse === 'Bk32') ? 30 : 15;
  hinweise.push({ stufe: 'warnung', feld: 'gesamtDicke', text: 'Vereinfacht: Mehr- oder Minderdicken aus RStO Tab. 7, Zeilen B, D und E (Klima, Gradiente, Entwässerung) sind nicht berücksichtigt.' });
  return { gesamtDicke: d, dickeAsphalt, dickeFSS: Math.max(15, d - dickeAsphalt), gueltig: !hatFehler(hinweise), hinweise };
}
