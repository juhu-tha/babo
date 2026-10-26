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
