/**
 * Zentrale Materialkennwerte (Umsetzungsplan Phase 0, AP 0.6).
 *
 * Betonkennwerte nach DIN EN 1992-1-1:2011-01, Tabelle 3.1, kommen ausschließlich aus
 * CONCRETE in src/utils/ec2Spannbeton.ts (getestet in tests/ec2Spannbeton.test.ts).
 * Rechner und Module verwenden diese Funktionen statt eigener Tabellen;
 * tests/kennwerte.test.ts prüft, dass keine abweichenden lokalen Kopien entstehen.
 */
import { CONCRETE, type ConcreteClassData } from '../utils/ec2Spannbeton';

export { CONCRETE as BETON_EC2 };
export type { ConcreteClassData };

const ALLE = Object.values(CONCRETE);

/** Betonfestigkeitsklasse, z. B. 'C30/37' */
export function betonNachKlasse(klasse: string): ConcreteClassData | undefined {
  return CONCRETE[klasse];
}

/** Betonfestigkeitsklasse zur charakteristischen Zylinderdruckfestigkeit fck [MPa] */
export function betonNachFck(fck: number): ConcreteClassData | undefined {
  return ALLE.find(c => c.fck === fck);
}

/**
 * Mittelwert der zentrischen Zugfestigkeit fctm [MPa]: Tabellenwert nach EC2 Tab. 3.1,
 * sonst Gl. in Tab. 3.1 (fctm = 0,30·fck^(2/3) bis C50/60, darüber 2,12·ln(1 + fcm/10)).
 */
export function fctmVonFck(fck: number): number {
  const tab = betonNachFck(fck);
  if (tab) return tab.fctm;
  return fck <= 50 ? 0.3 * Math.pow(fck, 2 / 3) : 2.12 * Math.log(1 + (fck + 8) / 10);
}

/** Auswahl einzelner Klassen als Nachschlagetabelle (für Auswahlfelder in Modulen) */
export function betonAuswahl<K extends string>(klassen: readonly K[]): Record<K, ConcreteClassData> {
  const out = {} as Record<K, ConcreteClassData>;
  for (const k of klassen) {
    const c = CONCRETE[k];
    if (!c) throw new Error(`Betonklasse ${k} fehlt in EC2 Tab. 3.1`);
    out[k] = c;
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Stahlkennwerte (Runde 4, Entscheidung Prof. Huber 26.10.: Normwerte vereinheitlichen).
// Einzige Quelle für Baustahl S235/S355/S460 und Betonstahl B500A/B500B; Module und Rechenkerne
// verwenden diese Konstanten. tests/kennwerte.test.ts prüft die Werte und sucht abweichende Kopien.
// ---------------------------------------------------------------------------------------------

export type BaustahlGuete = 'S235' | 'S355' | 'S460';

/**
 * Nennwerte der Streckgrenze f_y und Zugfestigkeit f_u für Erzeugnisdicken t ≤ 40 mm nach DIN EN 1993-1-1,
 * Tab. 3.1 (S235/S355 nach EN 10025-2, S460 als S460N/NL nach EN 10025-3) [N/mm²].
 * Hinweis: 470 N/mm² für S355 ist der Tabellenwert für 40 mm < t ≤ 80 mm bzw. die Untergrenze des
 * Zugfestigkeitsbereichs nach EN 10025-2 – nicht der Bemessungsnennwert für t ≤ 40 mm.
 */
export const BAUSTAHL_EC3: Readonly<Record<BaustahlGuete, { fy: number; fu: number }>> = {
  S235: { fy: 235, fu: 360 },
  S355: { fy: 355, fu: 490 },
  S460: { fy: 460, fu: 540 },
};

/** Elastizitätsmodul von Baustahl E = 210 000 N/mm² nach DIN EN 1993-1-1, 3.2.6 */
export const E_BAUSTAHL = 210000;

export type BetonstahlSorte = 'B500A' | 'B500B';

/** Elastizitätsmodul von Betonstahl E_s = 200 000 N/mm² nach DIN EN 1992-1-1, 3.2.7(4) */
export const E_BETONSTAHL = 200000;

/**
 * Betonstahl B500 nach DIN 488-1 und DIN EN 1992-1-1, Anhang C (Tab. C.1): f_yk = 500 N/mm²,
 * k = (f_t/f_y)_k ≥ 1,05 (A) bzw. ≥ 1,08 (B), f_tk = k·f_yk (525 bzw. 540 N/mm²), ε_uk ≥ 25 ‰ (A) bzw. 50 ‰ (B).
 */
export const BETONSTAHL: Readonly<Record<BetonstahlSorte, { fyk: number; k: number; ftk: number; euk: number }>> = {
  B500A: { fyk: 500, k: 1.05, ftk: 525, euk: 25 },
  B500B: { fyk: 500, k: 1.08, ftk: 540, euk: 50 },
};

// ---------------------------------------------------------------------------------------------
// Holzkennwerte (Runde 5, Entscheidung Prof. Huber 27.10.: Normwerte vereinheitlichen).
// Einzige Quelle für Vollholz (DIN EN 338:2016-07, Tab. 1/3) und Brettschichtholz (DIN EN 14080:2013-09, Tab. 4/5).
// Module und Rechenkerne verwenden diese Konstanten; tests/kennwerte.test.ts prüft die Werte.
// Öffentliche Wiedergaben: studiomadera.it (UNI EN 338:2016, Tab. 15.1, Nadel- und Laubholz),
// structuralbasics.com und HASSLACHER-Broschüre „Brettschichtholz“ (EN 14080:2013, Tab. 4/5).
// ---------------------------------------------------------------------------------------------

export interface HolzKennwerte {
  /** charakteristische Festigkeiten [N/mm²] */
  fmk: number; ft0k: number; ft90k: number; fc0k: number; fc90k: number; fvk: number;
  /** Steifigkeiten [N/mm²] */
  E0mean: number; E005: number; Gmean: number;
  /** Rohdichten [kg/m³] */
  rhok: number; rhoMean: number;
}

export type VollholzKlasse = 'C16' | 'C24' | 'C30' | 'D30' | 'D40';

/** Vollholz nach DIN EN 338:2016-07 (C: Nadelholz und Pappel, D: Laubholz) */
export const HOLZ_EN338: Readonly<Record<VollholzKlasse, HolzKennwerte>> = {
  C16: { fmk: 16, ft0k: 8.5, ft90k: 0.4, fc0k: 17, fc90k: 2.2, fvk: 3.2, E0mean: 8000, E005: 5400, Gmean: 500, rhok: 310, rhoMean: 370 },
  C24: { fmk: 24, ft0k: 14.5, ft90k: 0.4, fc0k: 21, fc90k: 2.5, fvk: 4.0, E0mean: 11000, E005: 7400, Gmean: 690, rhok: 350, rhoMean: 420 },
  C30: { fmk: 30, ft0k: 19, ft90k: 0.4, fc0k: 24, fc90k: 2.7, fvk: 4.0, E0mean: 12000, E005: 8000, Gmean: 750, rhok: 380, rhoMean: 460 },
  D30: { fmk: 30, ft0k: 18, ft90k: 0.6, fc0k: 24, fc90k: 5.3, fvk: 3.9, E0mean: 11000, E005: 9200, Gmean: 690, rhok: 530, rhoMean: 640 },
  D40: { fmk: 40, ft0k: 24, ft90k: 0.6, fc0k: 27, fc90k: 5.5, fvk: 4.2, E0mean: 13000, E005: 10900, Gmean: 810, rhok: 550, rhoMean: 660 },
};

export type BshKlasse = 'GL24h' | 'GL28h' | 'GL30h' | 'GL24c' | 'GL28c';

/** Brettschichtholz nach DIN EN 14080:2013-09 (h: homogen, Tab. 5; c: kombiniert, Tab. 4); f_t,90 = 0,5, G = 650 N/mm² */
export const BSH_EN14080: Readonly<Record<BshKlasse, HolzKennwerte>> = {
  GL24h: { fmk: 24, ft0k: 19.2, ft90k: 0.5, fc0k: 24, fc90k: 2.5, fvk: 3.5, E0mean: 11500, E005: 9600, Gmean: 650, rhok: 385, rhoMean: 420 },
  GL28h: { fmk: 28, ft0k: 22.3, ft90k: 0.5, fc0k: 28, fc90k: 2.5, fvk: 3.5, E0mean: 12600, E005: 10500, Gmean: 650, rhok: 425, rhoMean: 460 },
  GL30h: { fmk: 30, ft0k: 24, ft90k: 0.5, fc0k: 30, fc90k: 2.5, fvk: 3.5, E0mean: 13600, E005: 11300, Gmean: 650, rhok: 430, rhoMean: 480 },
  GL24c: { fmk: 24, ft0k: 17, ft90k: 0.5, fc0k: 21.5, fc90k: 2.5, fvk: 3.5, E0mean: 11000, E005: 9100, Gmean: 650, rhok: 365, rhoMean: 400 },
  GL28c: { fmk: 28, ft0k: 19.5, ft90k: 0.5, fc0k: 24, fc90k: 2.5, fvk: 3.5, E0mean: 12500, E005: 10400, Gmean: 650, rhok: 390, rhoMean: 420 },
};

/** Kennwerte einer Holzklasse (Vollholz oder BSH) nach Bezeichnung, z. B. 'C24' oder 'GL28h' */
export function holzKennwerte(klasse: string): HolzKennwerte | undefined {
  return (HOLZ_EN338 as Record<string, HolzKennwerte>)[klasse] ?? (BSH_EN14080 as Record<string, HolzKennwerte>)[klasse];
}
