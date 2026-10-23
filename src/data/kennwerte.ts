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
