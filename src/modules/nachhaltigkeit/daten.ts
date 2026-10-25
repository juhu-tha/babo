import inhalt from '@/content/nachhaltigkeit/daten.json';
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

export const EPD_DATABASE: Record<string, MaterialData> = inhalt.daten.EPD_DATABASE;

export interface ConfiguredLayer {
  materialKey: string;
  thicknessCm: number; // thickness in centimeters
}

export const PRESET_WALLS: Record<string, { name: string; desc: string; layers: ConfiguredLayer[] }> = inhalt.daten.PRESET_WALLS;

export type NachhaltigkeitBereich = 'wandkonfigurator' | 'qng_nachweis' | 'crrem_regulatorik' | 'praxis_innovationen' | 'leitfaden';

export const ALLE_BEREICHE: readonly NachhaltigkeitBereich[] = ['wandkonfigurator', 'qng_nachweis', 'crrem_regulatorik', 'praxis_innovationen', 'leitfaden'];
