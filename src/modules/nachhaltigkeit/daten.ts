import inhalt from '@/content/nachhaltigkeit/daten.json';
import { GWP_LEHRWERTE, gwpJeKg, type GwpLehrwertSchluessel } from '@/src/data/gwpLehrwerte';
// Scientific EPD Material Database for dynamic compilation
export interface MaterialData {
  name: string;
  category: string;
  density: number;          // kg/m³
  lambda: number;           // W/(m·K) - thermal conductivity
  gwp_fossil_a1a3: number;  // kg CO₂-eq pro kg material
  gwp_biogenic_a1a3: number;// kg CO₂-eq pro kg material
  gwp_c3c4: number;         // kg CO₂-eq pro kg material (End-of-Life release/processing)
  gwp_d: number;            // kg CO₂-eq pro kg material (Substitutionspotential)
  penrt: number;            // MJ pro kg material (nicht-erneuerbare Primärenergie)
  circularity_pct: number;  // Inherent recyclability or circularity score (0 - 100%)
}

// Beton und BSH je kg aus der gemeinsamen Lehrwerttabelle (Konsistenz 29.10.2026, F-4: 245, 195 und BSH −680 kg CO₂-Äq./m³ seit 30.10.2026, DSB-RU-1)
const AUS_LEHRWERTTABELLE: Partial<Record<string, GwpLehrwertSchluessel>> = { concrete_cem1: 'betonC2530CemI', concrete_rc: 'betonRcC2530', bsh_softwood: 'bsh' };
// Dämmstoffe je kg aus der Lehrwerttabelle, Rohdichte bleibt die des Produkts (Umsetzung 30.10.2026, DSB-LC-10:
// EPS 3,25 und Mineralwolle 1,20 kg CO₂-Äq./kg; vorher Glaswolle 0,96)
const JE_KG_AUS_LEHRWERTTABELLE: Partial<Record<string, 'eps' | 'mineralwolle'>> = { mineral_wool: 'mineralwolle', eps_styropor: 'eps' };

export const EPD_DATABASE: Record<string, MaterialData> = Object.fromEntries(
  Object.entries(inhalt.daten.EPD_DATABASE as Record<string, MaterialData>).map(([k, m]) => {
    const d = JE_KG_AUS_LEHRWERTTABELLE[k];
    if (d) return [k, { ...m, gwp_fossil_a1a3: gwpJeKg(d).fossil, gwp_biogenic_a1a3: 0 }];
    const s = AUS_LEHRWERTTABELLE[k];
    if (!s) return [k, m];
    const j = gwpJeKg(s);
    return [k, { ...m, density: GWP_LEHRWERTE[s].rohdichte, gwp_fossil_a1a3: j.fossil, gwp_biogenic_a1a3: j.biogen }];
  }),
);

export interface ConfiguredLayer {
  materialKey: string;
  thicknessCm: number; // thickness in centimeters
}

export const PRESET_WALLS: Record<string, { name: string; desc: string; layers: ConfiguredLayer[] }> = inhalt.daten.PRESET_WALLS;

export type NachhaltigkeitBereich = 'wandkonfigurator' | 'qng_nachweis' | 'crrem_regulatorik' | 'praxis_innovationen' | 'leitfaden';

export const ALLE_BEREICHE: readonly NachhaltigkeitBereich[] = ['wandkonfigurator', 'qng_nachweis', 'crrem_regulatorik', 'praxis_innovationen', 'leitfaden'];
