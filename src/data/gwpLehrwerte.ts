/**
 * Gemeinsame GWP-Lehrwerte A1–A3 (GWP-total nach DIN EN 15804+A2, einschließlich biogenem Kohlenstoff) für Beton,
 * Brettschichtholz, Konstruktionsvollholz und Betonstahl – eine Quelle für alle Module
 * (Entscheidung 29.10.2026 zur Konsistenzprüfung, docs/pruefung/konsistenz-2026-10-29.md, F-3 und F-4).
 *
 * Module, die daraus lesen: LCA-Rechner (src/modules/interactivelcacalc/daten.ts), Materialdatenbanken (Konsole und
 * QNG-Tabelle), LCA-Grundlagen (EPD-Musterdatenbank), Nachhaltigkeit (Wandkonfigurator, Werte je kg), DPP/EPD
 * (fiktive Muster-EPD), BIM-Baustoffe (IFC-Attribute), Materialoptimierung (Betonstahl-Referenz).
 *
 * Herkunft:
 *  - Betonstahl: ÖKOBAUDAT „Bewehrungsstahl (de)“ 0,642 kg CO₂-Äq./kg (belegt, T11-MO-3; überwiegend Elektrostahl).
 *  - Beton C25/30 mit CEM I: 245 kg/m³ wie bisher im LCA-Rechner, in der Konsole und in der EPD-Musterdatenbank
 *    (Größenordnung ≈ 300 kg Zement · 0,665 + Rest, src/data/zementGwp.ts). Lehrwert.
 *  - Weitere Betone, BSH, KVH: Lehrwerte (vorläufig, Normprüfung ausstehend). Der biogene Anteil folgt DIN EN 16449
 *    (KVH 500 kg/m³ bei u = 12 % → −818 kg CO₂, gerundet −820); BSH −760 wie bisher in Wandkonfigurator und QNG-Tabelle.
 * Für Nachweise gelten die Datensätze der ÖKOBAUDAT bzw. die Produkt-EPD.
 */
import { ZEMENT_GWP_KG } from './zementGwp';

export interface GwpLehrwert {
  /** Bezeichnung für Quellenangaben */
  name: string;
  /** Bezugseinheit */
  einheit: 'm³' | 't';
  /** GWP-total A1–A3 je Bezugseinheit [kg CO₂-Äq.] */
  gwp: number;
  /** davon biogener Kohlenstoff (Aufnahme, negativ) [kg CO₂-Äq. je Bezugseinheit] */
  biogen: number;
  /** Rohdichte, auf die sich der Wert bezieht [kg/m³] */
  rohdichte: number;
  /** Herkunft */
  quelle: string;
  /** true = Lehrwert ohne abgerufenen Datensatz (vorläufig, Normprüfung ausstehend) */
  vorlaeufig: boolean;
}

/** Zementgehalt [kg/m³] und Restanteil [kg CO₂-Äq./m³] des Lehrbetons C30/37 (wie src/calc/materialoptimierung.ts) */
export const LEHRBETON_C3037 = { zement: 320, rest: 30 } as const;

export const GWP_LEHRWERTE = {
  betonC2530CemI: { name: 'Normalbeton C25/30 (CEM I)', einheit: 'm³', gwp: 245, biogen: 0, rohdichte: 2400,
    quelle: 'Lehrwert (LCA-Rechner, ÖKOBAUDAT-Konsole, EPD-Musterdatenbank)', vorlaeufig: true },
  betonC2530CemIICM: { name: 'Beton C25/30 (CEM II/C-M)', einheit: 'm³', gwp: 155, biogen: 0, rohdichte: 2400,
    quelle: 'Lehrwert (LCA-Rechner)', vorlaeufig: true },
  betonCemIIIA: { name: 'Beton mit CEM III/A (Hüttensand)', einheit: 'm³', gwp: 135, biogen: 0, rohdichte: 2400,
    quelle: 'Lehrwert (LCA-Rechner)', vorlaeufig: true },
  betonC3037CemIII: { name: 'Beton C30/37 (CEM III)', einheit: 'm³', gwp: 145, biogen: 0, rohdichte: 2400,
    quelle: 'Lehrwert (QNG-Tabelle Materialdatenbanken)', vorlaeufig: true },
  betonC3037CemI: { name: 'Normalbeton C30/37 (CEM I)', einheit: 'm³',
    gwp: Math.round(LEHRBETON_C3037.zement * ZEMENT_GWP_KG['CEM I'] + LEHRBETON_C3037.rest), biogen: 0, rohdichte: 2400,
    quelle: 'Lehrbeton C30/37: 320 kg CEM I · 0,665 + 30 kg/m³ (Materialoptimierung, VDZ-Branchen-EPD 2022)', vorlaeufig: true },
  betonRcC2530: { name: 'RC-Beton C25/30 (klinkerreduziert)', einheit: 'm³', gwp: 195, biogen: 0, rohdichte: 2350,
    quelle: 'Lehrwert (EPD-Musterdatenbank, Wandkonfigurator)', vorlaeufig: true },
  betonGeopolymer: { name: 'Geopolymerbeton (alkalisch aktiviert)', einheit: 'm³', gwp: 85, biogen: 0, rohdichte: 2350,
    quelle: 'Lehrwert (LCA-Rechner)', vorlaeufig: true },
  bsh: { name: 'Brettschichtholz (BSH, Nadelholz)', einheit: 'm³', gwp: -650, biogen: -760, rohdichte: 480,
    quelle: 'Lehrwert: biogen −760, fossil +110 kg CO₂-Äq./m³ (EPD-Musterdatenbank, Wandkonfigurator)', vorlaeufig: true },
  kvh: { name: 'Konstruktionsvollholz (KVH, Nadelholz)', einheit: 'm³', gwp: -740, biogen: -820, rohdichte: 500,
    quelle: 'Lehrwert: biogen −820 (DIN EN 16449, 500 kg/m³, u = 12 %), fossil +80 kg CO₂-Äq./m³ (LCA-Rechner)', vorlaeufig: true },
  betonstahl: { name: 'Betonstahl B500 (Bewehrungsstahl, de)', einheit: 't', gwp: 640, biogen: 0, rohdichte: 7850,
    quelle: 'ÖKOBAUDAT „Bewehrungsstahl (de)“ 0,642 kg CO₂-Äq./kg (überwiegend Elektrostahl)', vorlaeufig: false },
} as const satisfies Record<string, GwpLehrwert>;

export type GwpLehrwertSchluessel = keyof typeof GWP_LEHRWERTE;

/** GWP A1–A3 je kg [kg CO₂-Äq./kg], fossil und biogen getrennt (für Datenbanken mit Werten je kg) */
export function gwpJeKg(s: GwpLehrwertSchluessel): { fossil: number; biogen: number } {
  const w: GwpLehrwert = GWP_LEHRWERTE[s];
  const masse = w.einheit === 't' ? 1000 : w.rohdichte;
  return { fossil: (w.gwp - w.biogen) / masse, biogen: w.biogen / masse };
}
