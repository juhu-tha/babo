/**
 * Gemeinsame GWP-Lehrwerte A1–A3 (GWP-total nach DIN EN 15804+A2, einschließlich biogenem Kohlenstoff) für Beton,
 * Brettschichtholz, Konstruktionsvollholz und Betonstahl – eine Quelle für alle Module
 * (Entscheidung 29.10.2026 zur Konsistenzprüfung, docs/pruefung/konsistenz-2026-10-29.md, F-3 und F-4).
 *
 * Module, die daraus lesen: LCA-Rechner (src/modules/interactivelcacalc/daten.ts), Materialdatenbanken (Konsole und
 * QNG-Tabelle), LCA-Grundlagen (EPD-Musterdatenbank), Nachhaltigkeit (Wandkonfigurator, Werte je kg), DPP/EPD
 * (fiktive Muster-EPD), BIM-Baustoffe (IFC-Attribute), Materialoptimierung (Betonstahl-Referenz); Kalksandstein nur
 * Materialdatenbanken (Beispiel 1 und QNG-Tabelle).
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
 *    Größenordnung ÖKOBAUDAT 2024-I „Transportbeton C25/30“ 221,7 kg/m³. C30/37: 320 kg Zement.
 *    CEM II/C-M und CEM III/A ergeben damit 165 kg/m³ (vorher 155 und 135 – die Minderung von 45 % gegenüber CEM I passte
 *    nicht zu ZEMENT_GWP_KG; jetzt rund 33 %). Lehrwerte.
 *    Umsetzung 30.10.2026 (Lehrbeton-Rest aus #278, NP2-LC-1): ein Restanteil LEHRBETON_REST = 45 kg CO₂-Äq./m³ für beide
 *    Lehrbetone, Zementanteil aus ZEMENT_GWP_KG (src/data/zementGwp.ts). C30/37 damit CEM I 258 (vorher 243 mit Rest 30),
 *    CEM III/A 173 kg/m³ (vorher 158); Minderung rund 33 % wie bei C25/30. Der Rest hängt kaum von der Festigkeitsklasse ab.
 *  - RC-Beton, Geopolymerbeton, BSH, KVH: Lehrwerte (vorläufig, Normprüfung ausstehend; ÖKOBAUDAT-Abgleich offen). Der biogene Anteil folgt DIN EN 16449
 *    (biogenesCo2DinEn16449 in src/calc/holzphysik.ts, auf 10 kg gerundet): KVH 500 kg/m³ bei u = 12 % → −818,5, gerundet −820;
 *    BSH (Umsetzung 30.10.2026, DSB-RU-1) mit der festgelegten Rohdichte 480 kg/m³ bei u = 12 % → −785,7, gerundet −790
 *    (vorher −760 ohne Herleitung), fossil +110 wie bisher → GWP-total −680 kg CO₂-Äq./m³ (vorher −650).
 *  - Dämmstoffe EPS und Mineralwolle (Umsetzung 30.10.2026, DSB-LC-10): je kg, ein Wert für alle Module. EPS 3,25 kg CO₂-Äq./kg
 *    (Lehrwert, Größenordnung ÖKOBAUDAT „EPS-Hartschaum“; vorher 3,0/3,25/3,3/3,9 je Modul); Mineralwolle 1,20 kg CO₂-Äq./kg
 *    (Lehrwert für Glas- und Steinwolle, Größenordnung ÖKOBAUDAT/EPD Steinwolle mittlere Rohdichte 115 kg CO₂-Äq. je 99 kg = 1,16;
 *    vorher 0,96 im Wandkonfigurator und in der EPD-Musterdatenbank). Die Rohdichte hängt vom Produkt ab und bleibt je Modul.
 *  - Kalksandstein (Umsetzung 02.11.2026, NS3-MDB-2): 0,13 kg CO₂-Äq./kg = 130 kg/t A1–A3 für KS-Planstein, Rohdichteklasse 1,8
 *    (Lehrwert, Größenordnung ÖKOBAUDAT/Verbands-EPD Kalksandstein: rund 126 kg CO₂ je t nach Nachhaltigkeitsfolder des
 *    Bundesverbands Kalksandsteinindustrie; vorläufig, ÖKOBAUDAT-Abgleich offen). Vorher im Modul Materialdatenbanken drei
 *    Werte: Beispiel 0,13, QNG-Tabelle 110 kg/t, Quiz q_dg_db_6 0,12 kg/kg – jetzt alle 0,13.
 *  - Profilstahl-Vergleichswert (Entscheidung 30.10.2026): EPD Elektrostahl rund 0,56 kg CO₂-Äq./kg (PROFILSTAHL_EPD_ELEKTROSTAHL),
 *    wird überall neben dem Lehrwert 1,1 angezeigt.
 * Für Nachweise gelten die Datensätze der ÖKOBAUDAT bzw. die Produkt-EPD.
 */
import { ZEMENT_GWP_KG, type ZementGwpArt } from './zementGwp';
import { biogenesCo2DinEn16449 } from '../calc/holzphysik';
import { formatDeZahl } from '../utils/numberFormat';

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

/**
 * Restanteil der Lehrbetone [kg CO₂-Äq./m³] (Gesteinskörnung, Wasser, Zusatzmittel, Transporte, Werk) – einheitlich für
 * C25/30 und C30/37 (Umsetzung 30.10.2026; vorher C30/37 mit 30). Abgestimmt auf ÖKOBAUDAT 2024-I „Transportbeton C25/30“:
 * 300 kg · 0,60 (CEM II/A) + 45 = 225 ≈ 221,7 kg/m³.
 */
export const LEHRBETON_REST = 45;
/** Zementgehalt [kg/m³] und Restanteil [kg CO₂-Äq./m³] des Lehrbetons C30/37 (wie src/calc/materialoptimierung.ts) */
export const LEHRBETON_C3037 = { zement: 320, rest: LEHRBETON_REST } as const;
/** Zementgehalt [kg/m³] und Restanteil [kg CO₂-Äq./m³] des Lehrbetons C25/30 (LCA-Rechner, Konsole, EPD-Musterdatenbank) */
export const LEHRBETON_C2530 = { zement: 300, rest: LEHRBETON_REST } as const;

/** Rohdichte des BSH-Lehrwerts [kg/m³] bei u = 12 % (festgelegt, Umsetzung 30.10.2026, DSB-RU-1) */
export const BSH_LEHR_ROHDICHTE = 480;
/** Rohdichte des KVH-Lehrwerts [kg/m³] bei u = 12 % */
export const KVH_LEHR_ROHDICHTE = 500;
/** Biogener Anteil nach DIN EN 16449 [kg CO₂-Äq./m³], negativ, auf 10 kg gerundet */
export function biogenLehrwert(rohdichte: number): number {
  return -Math.round(biogenesCo2DinEn16449(rohdichte, 12) / 10) * 10;
}
const BSH_BIOGEN = biogenLehrwert(BSH_LEHR_ROHDICHTE); // −790
const KVH_BIOGEN = biogenLehrwert(KVH_LEHR_ROHDICHTE); // −820
/** Fossiler Anteil A1–A3 der Holz-Lehrwerte [kg CO₂-Äq./m³] (Trocknung, Verklebung, Transporte; Lehrwerte) */
const BSH_FOSSIL = 110;
const KVH_FOSSIL = 80;

/**
 * Vergleichswert Profilstahl: EPD bauforumstahl (Elektrostahlroute, Profile und Stabstahl, EPD-BFS-20230271-IBG19)
 * rund 0,56 kg CO₂-Äq./kg – Entscheidung 30.10.2026: überall dort neben dem Lehrwert 1,1 anzeigen, wo dieser erscheint.
 */
export const PROFILSTAHL_EPD_ELEKTROSTAHL = 0.56;
/** Hinweistext zum Profilstahl-Lehrwert (für alle Anzeigen des Lehrwerts 1,1 kg CO₂-Äq./kg) */
export const PROFILSTAHL_HINWEIS = `EPD Elektrostahl rund ${formatDeZahl(PROFILSTAHL_EPD_ELEKTROSTAHL, 2)} kg CO₂e/kg als Vergleichswert`;

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
  bsh: { name: 'Brettschichtholz (BSH, Nadelholz)', einheit: 'm³', gwp: BSH_BIOGEN + BSH_FOSSIL, biogen: BSH_BIOGEN, rohdichte: BSH_LEHR_ROHDICHTE,
    quelle: 'Lehrwert: biogen −790 (DIN EN 16449, 480 kg/m³, u = 12 %), fossil +110 kg CO₂-Äq./m³ (EPD-Musterdatenbank, Wandkonfigurator)', vorlaeufig: true },
  kvh: { name: 'Konstruktionsvollholz (KVH, Nadelholz)', einheit: 'm³', gwp: KVH_BIOGEN + KVH_FOSSIL, biogen: KVH_BIOGEN, rohdichte: KVH_LEHR_ROHDICHTE,
    quelle: 'Lehrwert: biogen −820 (DIN EN 16449, 500 kg/m³, u = 12 %), fossil +80 kg CO₂-Äq./m³ (LCA-Rechner)', vorlaeufig: true },
  betonstahl: { name: 'Betonstahl B500 (Bewehrungsstahl, de)', einheit: 't', gwp: 640, biogen: 0, rohdichte: 7850,
    quelle: 'ÖKOBAUDAT „Bewehrungsstahl (de)“ 0,642 kg CO₂-Äq./kg (überwiegend Elektrostahl)', vorlaeufig: false },
  profilstahl: { name: 'Profilstahl (Baustahl, Walzprofile)', einheit: 't', gwp: 1100, biogen: 0, rohdichte: 7850,
    quelle: 'Lehrwert 1,1 kg CO₂-Äq./kg für Profilstahl im Marktmix (LCA-Rechner, Stahl-Modul); Spanne: Elektrostahlroute 0,56 '
      + '(EPD bauforumstahl EPD-BFS-20230271-IBG19, Profile und Stabstahl) bis Hochofenroute rund 2,9 (ÖKOBAUDAT 2024-I, '
      + 'verzinkte Profile), nach bauforumstahl-Leitfaden BFS-RL 01-101 (02/2026), Tab. 2 und 3', vorlaeufig: true },
  kalksandstein: { name: 'Kalksandstein (KS-Planstein, Rohdichteklasse 1,8)', einheit: 't', gwp: 130, biogen: 0, rohdichte: 1800,
    quelle: 'Lehrwert 0,13 kg CO₂-Äq./kg A1–A3 (Größenordnung ÖKOBAUDAT/Verbands-EPD Kalksandstein, rund 126 kg CO₂ je t; '
      + 'Materialdatenbanken: Beispiel 1, QNG-Tabelle, Quiz q_dg_db_6)', vorlaeufig: true },
  eps: { name: 'EPS-Hartschaum (Dämmstoff)', einheit: 't', gwp: 3250, biogen: 0, rohdichte: 20,
    quelle: 'Lehrwert 3,25 kg CO₂-Äq./kg A1–A3 (Größenordnung ÖKOBAUDAT „EPS-Hartschaum“); Rohdichte je Produkt (Bezug 20 kg/m³)', vorlaeufig: true },
  mineralwolle: { name: 'Mineralwolle (Glas- und Steinwolle)', einheit: 't', gwp: 1200, biogen: 0, rohdichte: 30,
    quelle: 'Lehrwert 1,20 kg CO₂-Äq./kg A1–A3 (Größenordnung ÖKOBAUDAT/EPD Steinwolle mittlere Rohdichte: 115 kg je 99 kg = 1,16); '
      + 'Rohdichte je Produkt (Bezug 30 kg/m³)', vorlaeufig: true },
} as const satisfies Record<string, GwpLehrwert>;

/** GWP A1–A3 je m³ eines Dämmstoffs mit gegebener Rohdichte [kg CO₂-Äq./m³] = Lehrwert je kg · ρ */
export function daemmstoffGwpJeM3(s: 'eps' | 'mineralwolle', rohdichte: number): number {
  return (GWP_LEHRWERTE[s].gwp / 1000) * rohdichte;
}

export type GwpLehrwertSchluessel = keyof typeof GWP_LEHRWERTE;

/** GWP A1–A3 je kg [kg CO₂-Äq./kg], fossil und biogen getrennt (für Datenbanken mit Werten je kg) */
export function gwpJeKg(s: GwpLehrwertSchluessel): { fossil: number; biogen: number } {
  const w: GwpLehrwert = GWP_LEHRWERTE[s];
  const masse = w.einheit === 't' ? 1000 : w.rohdichte;
  return { fossil: (w.gwp - w.biogen) / masse, biogen: w.biogen / masse };
}
