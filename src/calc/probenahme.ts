/**
 * Probenahme nach LAGA PN 98 (Mitteilung 32, Stand 2019) – Runde 5, Entscheidung: normgemäß rechnen.
 *  - Tabelle 2: Mindestanzahl der Einzel-, Misch-, Sammel- und Laborproben nach dem Volumen der Grundmenge (Haufwerk bzw.
 *    Untersuchungseinheit). Bis 600 m³ gestuft (30/60/100/150/200/300/400/500/600 m³ → 2 … 10 Mischproben); darüber je
 *    angefangene 100 m³ eine weitere Mischprobe (bei gleichbleibender Beschaffenheit je 3 zu einer Sammelprobe zusammengefasst)
 *    und je angefangene 300 m³ eine weitere Laborprobe. Eine Mischprobe besteht aus 4 Einzelproben.
 *  - Tabelle 3: Mindestvolumen der Einzel- und Laborprobe nach Größtkorn: ≤ 2 mm 0,5/1 l, > 2–20 mm 1/2 l, > 20–50 mm 2/4 l,
 *    > 50–120 mm 5/10 l, > 120 mm Stück = Einzelprobe.
 * Öffentliche Wiedergabe der Tabellen: umwelt-online.de, „PN 98 – Probenahme aus festen und stichfesten Abfällen“ (Teil 2).
 * Bildung von Untersuchungseinheiten (z. B. höchstens 3 000 m³ je Haufwerk nach LfU-Arbeitshilfe) ist Vorgabe des Anwenders;
 * die Probenzahl gilt je Untersuchungseinheit. Reiner Rechenkern – geprüft in tests/probenahme.test.ts.
 */
import { type Hinweis, istEndlich, muss, hatFehler } from './plausibilitaet';

/** Stufen der Tabelle 2 bis 600 m³ (Obergrenzen) */
export const PN98_STUFEN = [30, 60, 100, 150, 200, 300, 400, 500, 600] as const;

export interface Pn98Proben {
  einzelproben: number;
  mischproben: number;
  /** Sammelproben aus je 3 Mischproben über 600 m³ (bei gleichbleibender Beschaffenheit) */
  sammelproben: number;
  laborproben: number;
}

/** Mindestprobenzahl nach LAGA PN 98, Tabelle 2, für eine Grundmenge V [m³] (V > 0) */
export function pn98Probenzahl(volumenM3: number): Pn98Proben {
  if (!(volumenM3 > 0) || !Number.isFinite(volumenM3)) return { einzelproben: 0, mischproben: 0, sammelproben: 0, laborproben: 0 };
  if (volumenM3 <= 600) {
    const mp = PN98_STUFEN.findIndex(g => volumenM3 <= g) + 2;
    return { einzelproben: 4 * mp, mischproben: mp, sammelproben: 0, laborproben: mp };
  }
  const zusatzMp = Math.ceil((volumenM3 - 600) / 100 - 1e-9);
  const mp = 10 + zusatzMp;
  return { einzelproben: 4 * mp, mischproben: mp, sammelproben: Math.ceil(zusatzMp / 3), laborproben: 10 + Math.ceil((volumenM3 - 600) / 300 - 1e-9) };
}

export interface Pn98Eingabe {
  /** Gesamtvolumen des Haufwerks [m³] */
  volumenM3: number;
  /** Höchstvolumen je Untersuchungseinheit [m³] (Vorgabe, z. B. 3 000 m³ nach LfU) */
  maxUeM3: number;
}

/** Aufteilung in gleich große Untersuchungseinheiten und Probenzahl je Einheit sowie insgesamt */
export function pn98Plan(e: Pn98Eingabe) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.volumenM3, e.maxUeM3) && e.volumenM3 > 0 && e.maxUeM3 > 0, 'volumen', 'Haufwerksvolumen und Größe der Untersuchungseinheit müssen größer als 0 sein.');
  if (hatFehler(hinweise)) return { einheiten: 0, volumenJeUe: 0, jeUe: pn98Probenzahl(0), gesamt: pn98Probenzahl(0), hinweise };
  const einheiten = Math.max(1, Math.ceil(e.volumenM3 / e.maxUeM3 - 1e-9));
  const volumenJeUe = e.volumenM3 / einheiten;
  const jeUe = pn98Probenzahl(volumenJeUe);
  const gesamt: Pn98Proben = {
    einzelproben: jeUe.einzelproben * einheiten, mischproben: jeUe.mischproben * einheiten,
    sammelproben: jeUe.sammelproben * einheiten, laborproben: jeUe.laborproben * einheiten,
  };
  if (volumenJeUe > 1200) hinweise.push({ stufe: 'warnung', feld: 'volumen', text: 'Tabelle 2 der LAGA PN 98 endet bei 1 200 m³; größere Grundmengen werden mit den Zuschlagsregeln fortgeschrieben.' });
  return { einheiten, volumenJeUe, jeUe, gesamt, hinweise };
}

export interface Pn98Volumen { einzelL: number | null; laborL: number | null; stueck: boolean }

/** Mindestvolumen der Einzel- und Laborprobe nach LAGA PN 98, Tabelle 3, aus dem Größtkorn d_max [mm] */
export function pn98Mindestvolumen(dMaxMm: number): Pn98Volumen {
  if (dMaxMm <= 2) return { einzelL: 0.5, laborL: 1, stueck: false };
  if (dMaxMm <= 20) return { einzelL: 1, laborL: 2, stueck: false };
  if (dMaxMm <= 50) return { einzelL: 2, laborL: 4, stueck: false };
  if (dMaxMm <= 120) return { einzelL: 5, laborL: 10, stueck: false };
  return { einzelL: null, laborL: null, stueck: true };
}
