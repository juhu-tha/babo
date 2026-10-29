/**
 * Rechenkern Material-Orientierungsrechner Putze & Mörtel (Modulprüfung Tranche 5, 28.10.2026),
 * Verhalten aus src/modules/PutzeMoertel.tsx übernommen; geändert ist nur die Sackanzahl (siehe unten).
 *
 *  - Putzbedarf: m = A · d · f mit Verbrauchsrichtwert f in kg je m² und mm Putzdicke (Herstellerangaben,
 *    Produktdatenblatt maßgebend); Wasser je Putzart (WASSER_PUTZ_L_JE_KG, Lehrwerte; Umsetzung 29.10.2026, T5-PM-5 –
 *    vorher pauschal 0,26 l/kg für alle Putze)
 *  - Mauermörtel Normalfuge: V = A · v₀ · k_t mit Grundbedarf v₀ in l/m² je Steinformat (11,5-cm-Wand) und
 *    Dickenfaktor k_t; Trockenmörtel 1,55 kg je Liter Frischmörtel, Wasser 0,21 l/kg (Lehrwerte)
 *  - Dünnbettmörtel: m = A · (t/10 cm) · 1,2 kg/m² (Lehrwert), Wasser 0,26 l/kg (Lehrwert)
 *  - Sackanzahl = ⌈m / 25 kg⌉. Geändert: Gleitkommareste werden vor dem Aufrunden entfernt
 *    (50 m² · 15 mm · 1,1 ergab 825,0000000000001 kg und damit 34 statt 33 Säcke).
 * Reiner Rechenkern – geprüft in tests/moertelbedarf.test.ts. Orientierungswerte, keine Ausschreibungsmengen.
 */
import { type Hinweis, istEndlich, hatFehler, muss } from './plausibilitaet';

/** Verbrauchsrichtwerte in kg je m² und mm Putzdicke (Herstellerangaben, Größenordnung) */
export const PUTZ_VERBRAUCH = { gips: 1.1, luftkalk: 1.3, kalkzement: 1.25, zement: 1.6, sanier: 1.2, aerogel: 0.28 } as const;
export type Putzart = keyof typeof PUTZ_VERBRAUCH;

/** Grundbedarf Mauermörtel in l je m² Wandfläche bei 11,5 cm Wanddicke (Lehrwerte) */
export const MOERTEL_GRUNDBEDARF = { df: 38, nf: 30, twoDF: 24, hlz: 18 } as const;
export type Steinformat = keyof typeof MOERTEL_GRUNDBEDARF;

/** Faktor auf den Grundbedarf je Wanddicke in cm */
export const WANDDICKE_FAKTOR = { '11.5': 1.0, '24.0': 2.1, '30.0': 2.6, '36.5': 3.2 } as const;
export type Wanddicke = keyof typeof WANDDICKE_FAKTOR;

export const SACK_KG = 25;
/**
 * Anmachwasser in l je kg Trockenmörtel je Putzart (Lehrwerte, Größenordnung der Herstellerangaben; Produktdatenblatt
 * maßgebend). Gipsputz ≈ 0,6 l/kg (Entscheidung 28.10.), Kalkzement ≈ 0,2 l/kg (Tranche 5, T5-PM-5), Aerogel-Dämmputz
 * ≈ 1 l/kg (HAGATHERM Typ Aerogel: 7 l Wasser je 7-kg-Sack).
 */
export const WASSER_PUTZ_L_JE_KG: Readonly<Record<Putzart, number>> = { gips: 0.6, luftkalk: 0.22, kalkzement: 0.2, zement: 0.16, sanier: 0.2, aerogel: 1.0 };
/** Anmachwasser Dünnbettmörtel in l je kg (Lehrwert, wie bisher) */
export const WASSER_DUENNBETT_L_JE_KG = 0.26;
export const WASSER_MAUERMOERTEL_L_JE_KG = 0.21;
export const TROCKENMOERTEL_KG_JE_L = 1.55;
export const DUENNBETT_KG_JE_M2_UND_10CM = 1.2;

/** auf eine Nachkommastelle runden (Anzeige wie bisher) */
const r1 = (x: number) => Math.round(x * 10) / 10;

/** Anzahl Säcke ⌈m/m_Sack⌉; Gleitkommareste (≤ 10⁻⁹ Sack) zählen nicht als angebrochener Sack */
export function sackanzahl(masseKg: number, sackKg: number = SACK_KG): number {
  return Math.max(0, Math.ceil(masseKg / sackKg - 1e-9));
}

export interface BedarfErgebnis {
  /** Trockenmörtel in kg */
  masse: number;
  saecke: number;
  /** Anmachwasser in l */
  wasser: number;
  /** Frischmörtelvolumen in l (nur Normalfuge) */
  liter?: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

const leer = (hinweise: Hinweis[]): BedarfErgebnis => ({ masse: NaN, saecke: NaN, wasser: NaN, gueltig: false, hinweise });

export function putzbedarf(e: { flaeche: number; dickeMm: number; art: Putzart }): BedarfErgebnis {
  const hinweise: Hinweis[] = [];
  const f = PUTZ_VERBRAUCH[e.art];
  muss(hinweise, f !== undefined, 'art', 'Unbekannte Putzmörtel-Art.');
  muss(hinweise, istEndlich(e.flaeche, e.dickeMm) && e.flaeche > 0, 'flaeche', 'Die Putzfläche muss größer als 0 m² sein.');
  muss(hinweise, istEndlich(e.dickeMm) && e.dickeMm > 0, 'dicke', 'Die Schichtdicke muss größer als 0 mm sein.');
  if (hatFehler(hinweise)) return leer(hinweise);
  const masse = e.flaeche * e.dickeMm * f;
  return { masse: r1(masse), saecke: sackanzahl(masse), wasser: r1(masse * WASSER_PUTZ_L_JE_KG[e.art]), gueltig: true, hinweise };
}

export function mauermoertelNormalfuge(e: { flaeche: number; wanddicke: Wanddicke; format: Steinformat }): BedarfErgebnis {
  const hinweise: Hinweis[] = [];
  const v0 = MOERTEL_GRUNDBEDARF[e.format];
  const kt = WANDDICKE_FAKTOR[e.wanddicke];
  muss(hinweise, v0 !== undefined, 'format', 'Unbekanntes Steinformat.');
  muss(hinweise, kt !== undefined, 'wanddicke', 'Unbekannte Wanddicke.');
  muss(hinweise, istEndlich(e.flaeche) && e.flaeche > 0, 'flaeche', 'Die Wandfläche muss größer als 0 m² sein.');
  if (hatFehler(hinweise)) return leer(hinweise);
  const liter = e.flaeche * v0 * kt;
  const masse = liter * TROCKENMOERTEL_KG_JE_L;
  return { liter: r1(liter), masse: r1(masse), saecke: sackanzahl(masse), wasser: r1(masse * WASSER_MAUERMOERTEL_L_JE_KG), gueltig: true, hinweise };
}

export function duennbettmoertel(e: { flaeche: number; wanddickeCm: number }): BedarfErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.flaeche) && e.flaeche > 0, 'flaeche', 'Die Wandfläche muss größer als 0 m² sein.');
  muss(hinweise, istEndlich(e.wanddickeCm) && e.wanddickeCm > 0, 'wanddicke', 'Die Wanddicke muss größer als 0 cm sein.');
  if (hatFehler(hinweise)) return leer(hinweise);
  const masse = e.flaeche * (e.wanddickeCm / 10) * DUENNBETT_KG_JE_M2_UND_10CM;
  return { masse: r1(masse), saecke: sackanzahl(masse), wasser: r1(masse * WASSER_DUENNBETT_L_JE_KG), gueltig: true, hinweise };
}
