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
 *  - Profilstahl (Entscheidung 29.10.2026, Nachprüfung NP2-ST-2): Lehrwert 1,1 kg CO₂-Äq./kg wie bisher im LCA-Rechner;
 *    das Stahl-Modul rechnete vorher mit 1,8. In Deutschland gewalzte offene Profile kommen überwiegend aus der
 *    Elektrostahlroute (EPD bauforumstahl 0,56 kg/kg), Importe und Bleche auch aus der Hochofenroute (verzinkte Profile
 *    ÖKOBAUDAT 2024-I 2,92 kg/kg; bauforumstahl-Leitfaden BFS-RL 01-101, 02/2026, Tab. 2/3). Der Lehrwert steht für einen
 *    Marktmix ohne Herkunftsnachweis (vorläufig, Normprüfung ausstehend; ÖKOBAUDAT-Abgleich offen). Für Nachweise gilt die
 *    EPD des Herstellers.
 *  - Betonstahl: ÖKOBAUDAT „Bewehrungsstahl (de)“ 0,642 kg CO₂-Äq./kg (belegt, T11-MO-3; überwiegend Elektrostahl).
 *  - Zementgebundene Lehrbetone (Entscheidung 29.10.2026, Nachprüfung NP2-LC-1): GWP = Zementgehalt · ZEMENT_GWP_KG + Rest.
 *    C25/30: 300 kg Zement, Rest 45 kg CO₂-Äq./m³ (Gesteinskörnung, Wasser, Zusatzmittel, Transporte, Werk) – mit CEM I
 *    245 kg/m³ wie bisher im LCA-Rechner, in der Konsole und in der EPD-Musterdatenbank; mit CEM II/A (0,60) 225 kg/m³,
 *    Größenordnung ÖKOBAUDAT 2024-I „Transportbeton C25/30“ 221,7 kg/m³. C30/37: 320 kg Zement, Rest 30 (Materialoptimierung).
 *    CEM II/C-M und CEM III/A ergeben damit 165 kg/m³ (vorher 155 und 135 – die Minderung von 45 % gegenüber CEM I passte
 *    nicht zu ZEMENT_GWP_KG; jetzt rund 33 %), C30/37 mit CEM III/A 158 kg/m³ (vorher 145). Lehrwerte.
 *  - RC-Beton, Geopolymerbeton, BSH, KVH: Lehrwerte (vorläufig, Normprüfung ausstehend; ÖKOBAUDAT-Abgleich offen). Der biogene Anteil folgt DIN EN 16449
 *    (KVH 500 kg/m³ bei u = 12 % → −818 kg CO₂, gerundet −820); BSH −760 wie bisher in Wandkonfigurator und QNG-Tabelle.
 * Für Nachweise gelten die Datensätze der ÖKOBAUDAT bzw. die Produkt-EPD.
 */
import { ZEMENT_GWP_KG, type ZementGwpArt } from './zementGwp';

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
  /** true = Lehrwert ohne abgerufenen ÖKOBAUDAT-Datensatz (vorläufig, Normprüfung ausstehend) */
  vorlaeufig: boolean;
}

/** Zementgehalt [kg/m³] und Restanteil [kg CO₂-Äq./m³] des Lehrbetons C30/37 (wie src/calc/materialoptimierung.ts) */
export const LEHRBETON_C3037 = { zement: 320, rest: 30 } as const;
/** Zementgehalt [kg/m³] und Restanteil [kg CO₂-Äq./m³] des Lehrbetons C25/30 (LCA-Rechner, Konsole, EPD-Musterdatenbank) */
export const LEHRBETON_C2530 = { zement: 300, rest: 45 } as const;

/** GWP A1–A3 eines Lehrbetons [kg CO₂-Äq./m³] = round(Zementgehalt · ZEMENT_GWP_KG + Rest) */
export function lehrbetonGwp(lehrbeton: { zement: number; rest: number }, zement: ZementGwpArt): number {
  return Math.round(lehrbeton.zement * ZEMENT_GWP_KG[zement] + lehrbeton.rest);
}

export const GWP_LEHRWERTE = {
  betonC2530CemI: { name: 'Normalbeton C25/30 (CEM I)', einheit: 'm³', gwp: lehrbetonGwp(LEHRBETON_C2530, 'CEM I'), biogen: 0, rohdichte: 2400,
    quelle: 'Lehrbeton C25/30: 300 kg CEM I · 0,665 + 45 kg/m³ (LCA-Rechner, ÖKOBAUDAT-Konsole, EPD-Musterdatenbank)', vorlaeufig: true },
  betonC2530CemIICM: { name: 'Beton C25/30 (CEM II/C-M)', einheit: 'm³', gwp: lehrbetonGwp(LEHRBETON_C2530, 'CEM II/C-M'), biogen: 0, rohdichte: 2400,
    quelle: 'Lehrbeton C25/30: 300 kg CEM II/C-M · 0,40 + 45 kg/m³ (LCA-Rechner; VDZ-Branchen-EPD 2023)', vorlaeufig: true },
  betonCemIIIA: { name: 'Beton C25/30 mit CEM III/A (Hüttensand)', einheit: 'm³', gwp: lehrbetonGwp(LEHRBETON_C2530, 'CEM III/A'), biogen: 0, rohdichte: 2400,
    quelle: 'Lehrbeton C25/30: 300 kg CEM III/A · 0,40 (Lehrwert) + 45 kg/m³ (LCA-Rechner)', vorlaeufig: true },
  betonC3037CemIII: { name: 'Beton C30/37 (CEM III/A)', einheit: 'm³', gwp: lehrbetonGwp(LEHRBETON_C3037, 'CEM III/A'), biogen: 0, rohdichte: 2400,
    quelle: 'Lehrbeton C30/37: 320 kg CEM III/A · 0,40 (Lehrwert) + 30 kg/m³ (QNG-Tabelle Materialdatenbanken, Materialoptimierung)', vorlaeufig: true },
  betonC3037CemI: { name: 'Normalbeton C30/37 (CEM I)', einheit: 'm³',
    gwp: lehrbetonGwp(LEHRBETON_C3037, 'CEM I'), biogen: 0, rohdichte: 2400,
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
  profilstahl: { name: 'Profilstahl (Baustahl, Walzprofile)', einheit: 't', gwp: 1100, biogen: 0, rohdichte: 7850,
    quelle: 'Lehrwert 1,1 kg CO₂-Äq./kg für Profilstahl im Marktmix (LCA-Rechner, Stahl-Modul); Spanne: Elektrostahlroute 0,56 '
      + '(EPD bauforumstahl EPD-BFS-20230271-IBG19, Profile und Stabstahl) bis Hochofenroute rund 2,9 (ÖKOBAUDAT 2024-I, '
      + 'verzinkte Profile), nach bauforumstahl-Leitfaden BFS-RL 01-101 (02/2026), Tab. 2 und 3', vorlaeufig: true },
} as const satisfies Record<string, GwpLehrwert>;

export type GwpLehrwertSchluessel = keyof typeof GWP_LEHRWERTE;

/** GWP A1–A3 je kg [kg CO₂-Äq./kg], fossil und biogen getrennt (für Datenbanken mit Werten je kg) */
export function gwpJeKg(s: GwpLehrwertSchluessel): { fossil: number; biogen: number } {
  const w: GwpLehrwert = GWP_LEHRWERTE[s];
  const masse = w.einheit === 't' ? 1000 : w.rohdichte;
  return { fossil: (w.gwp - w.biogen) / masse, biogen: w.biogen / masse };
}
