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

export const EPD_DATABASE: Record<string, MaterialData> = {
  concrete_cem1: {
    name: 'Normalbeton C25/30 (CEM I)',
    category: 'Mineralisch',
    density: 2400,
    lambda: 2.10,
    gwp_fossil_a1a3: 0.102,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.008,
    gwp_d: -0.010,
    penrt: 0.77,
    circularity_pct: 15
  },
  concrete_rc: {
    name: 'RC-Beton C25/30 (klinkerreduziert)',
    category: 'Mineralisch',
    density: 2350,
    lambda: 1.95,
    gwp_fossil_a1a3: 0.083,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.006,
    gwp_d: -0.015,
    penrt: 0.60,
    circularity_pct: 45
  },
  brick_unfilled: {
    name: 'Hochlochziegel (ungefüllt)',
    category: 'Mineralisch',
    density: 800,
    lambda: 0.45,
    gwp_fossil_a1a3: 0.275,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.012,
    gwp_d: -0.005,
    penrt: 3.12,
    circularity_pct: 25
  },
  brick_perlite: {
    name: 'Wärmedämmziegel (Perlite-gefüllt)',
    category: 'Mineralisch',
    density: 680,
    lambda: 0.07,
    gwp_fossil_a1a3: 0.426,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.018,
    gwp_d: -0.008,
    penrt: 4.55,
    circularity_pct: 15
  },
  bsh_softwood: {
    name: 'Brettschichtholz (BSH, Fichte)',
    category: 'Holz',
    density: 480,
    lambda: 0.13,
    gwp_fossil_a1a3: 0.229,
    gwp_biogenic_a1a3: -1.583, // active carbon pool sequestering CO2
    gwp_c3c4: 1.583,            // fully released at waste-to-energy plant
    gwp_d: -0.65,               // substitute-credit for fuel heating displacement
    penrt: 6.45,
    circularity_pct: 85
  },
  wood_fiber: {
    name: 'Holzfaserdämmung (WF)',
    category: 'Dämmung',
    density: 160,
    lambda: 0.045,
    gwp_fossil_a1a3: 0.531,
    gwp_biogenic_a1a3: -1.50,
    gwp_c3c4: 1.50,
    gwp_d: -0.55,
    penrt: 10.0,
    circularity_pct: 90
  },
  mineral_wool: {
    name: 'Glaswolle-Dämmplatte',
    category: 'Dämmung',
    density: 50,
    lambda: 0.035,
    gwp_fossil_a1a3: 0.96,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.04,
    gwp_d: -0.05,
    penrt: 25.0,
    circularity_pct: 35
  },
  eps_styropor: {
    name: 'EPS-Hartschaumplatte (Styropor)',
    category: 'Dämmung',
    density: 20,
    lambda: 0.040,
    gwp_fossil_a1a3: 3.25,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 3.20,
    gwp_d: -1.20,
    penrt: 92.5,
    circularity_pct: 10
  },
  plaster_mineral: {
    name: 'Kalk-Gipsputz / Leichtputz',
    category: 'Mineralisch',
    density: 1200,
    lambda: 0.70,
    gwp_fossil_a1a3: 0.15,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.005,
    gwp_d: 0.0,
    penrt: 1.22,
    circularity_pct: 30
  },
  gypsum_board: {
    name: 'Gipsfaserplatte',
    category: 'Mineralisch',
    density: 1150,
    lambda: 0.32,
    gwp_fossil_a1a3: 0.30,
    gwp_biogenic_a1a3: -0.05,
    gwp_c3c4: 0.05,
    gwp_d: -0.02,
    penrt: 3.48,
    circularity_pct: 45
  },
  osb_board: {
    name: 'OSB-Platte',
    category: 'Holz',
    density: 620,
    lambda: 0.13,
    gwp_fossil_a1a3: 0.32,
    gwp_biogenic_a1a3: -1.30,
    gwp_c3c4: 1.30,
    gwp_d: -0.45,
    penrt: 8.5,
    circularity_pct: 75
  },
  straw_bale: {
    name: 'Strohdämmung (Strohballen)',
    category: 'Dämmung',
    density: 100,
    lambda: 0.045,
    gwp_fossil_a1a3: 0.035,
    gwp_biogenic_a1a3: -1.45,
    gwp_c3c4: 1.45,
    gwp_d: -0.40,
    penrt: 0.55,
    circularity_pct: 95
  },
  clay_plaster: {
    name: 'Lehm-Feinputz / Lehmputz',
    category: 'Mineralisch',
    density: 1600,
    lambda: 0.82,
    gwp_fossil_a1a3: 0.015,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.002,
    gwp_d: 0.0,
    penrt: 0.18,
    circularity_pct: 100
  },
  clay_brick_din18940: {
    name: 'Lehmstein DIN 18940 (SFK 3, tragend)',
    category: 'Mineralisch',
    density: 1800,
    lambda: 0.90,
    gwp_fossil_a1a3: 0.022,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.002,
    gwp_d: 0.0,
    penrt: 0.28,
    circularity_pct: 100
  },
  baustahl: {
    name: 'Baustahl (Elektrookoroute - 100% RC)',
    category: 'Metalle',
    density: 7850,
    lambda: 50.0,
    gwp_fossil_a1a3: 0.48,
    gwp_biogenic_a1a3: 0.0,
    gwp_c3c4: 0.02,
    gwp_d: -0.32,
    penrt: 4.8,
    circularity_pct: 95
  }
};

export interface ConfiguredLayer {
  materialKey: string;
  thicknessCm: number; // thickness in centimeters
}

export const PRESET_WALLS: Record<string, { name: string; desc: string; layers: ConfiguredLayer[] }> = {
  massiv_wdvs: {
    name: 'Stahlbeton + EPS (WDVS)',
    desc: 'Konventionelle mineralische Tragschale (20cm) mit marktüblichem organischen Wärmedämmverbundsystem.',
    layers: [
      { materialKey: 'plaster_mineral', thicknessCm: 1.5 },
      { materialKey: 'concrete_cem1', thicknessCm: 20.0 },
      { materialKey: 'eps_styropor', thicknessCm: 16.0 },
      { materialKey: 'plaster_mineral', thicknessCm: 1.5 }
    ]
  },
  massiv_eco: {
    name: 'RC-Beton + Holzfaser',
    desc: 'Klinkerreduzierte mineralische Tragschale (20cm) gedämmt mit nachwachsender Holzfaser-Dämmplatte.',
    layers: [
      { materialKey: 'plaster_mineral', thicknessCm: 1.5 },
      { materialKey: 'concrete_rc', thicknessCm: 20.0 },
      { materialKey: 'wood_fiber', thicknessCm: 16.0 },
      { materialKey: 'plaster_mineral', thicknessCm: 1.5 }
    ]
  },
  holz_staender: {
    name: 'Holzrahmenbau (gedämmt)',
    desc: 'Hocheffiziente, kreislauffähige Leichtbaukonstruktion mit sehr guter Dämmwirkung und biogenem Kohlenstoffspeicher.',
    layers: [
      { materialKey: 'gypsum_board', thicknessCm: 1.25 },
      { materialKey: 'osb_board', thicknessCm: 1.5 },
      { materialKey: 'bsh_softwood', thicknessCm: 24.0 }, // also serves as framing
      { materialKey: 'wood_fiber', thicknessCm: 8.0 },
      { materialKey: 'plaster_mineral', thicknessCm: 1.5 }
    ]
  },
  ziegel_mono: {
    name: 'Monolithischer perlite-gefüllter Ziegel',
    desc: 'Tragendes einschaliges Ziegelmauerwerk ohne Zusatzdämmung, sehr robust und langlebig.',
    layers: [
      { materialKey: 'plaster_mineral', thicknessCm: 1.5 },
      { materialKey: 'brick_perlite', thicknessCm: 36.5 },
      { materialKey: 'plaster_mineral', thicknessCm: 2.0 }
    ]
  },
  lehm_massiv_18940: {
    name: 'Tragender Lehmbau (DIN 18940)',
    desc: 'Schlanke 17,5 cm Lehmsteinwand (SFK 3) mit Holzfaserdämmung und Lehmputz – 100 % zirkulär.',
    layers: [
      { materialKey: 'clay_plaster', thicknessCm: 1.5 },
      { materialKey: 'clay_brick_din18940', thicknessCm: 17.5 },
      { materialKey: 'wood_fiber', thicknessCm: 16.0 },
      { materialKey: 'clay_plaster', thicknessCm: 2.0 }
    ]
  },
  naturbaustoff_stroh: {
    name: 'Naturbaustoff Stroh & Lehm',
    desc: 'Holzrahmenkonstruktion ausgefacht mit hochdämmenden Strohballen, innen und außen geschützt durch dicken Lehmputz.',
    layers: [
      { materialKey: 'clay_plaster', thicknessCm: 3.0 },
      { materialKey: 'osb_board', thicknessCm: 1.5 },
      { materialKey: 'straw_bale', thicknessCm: 32.0 },
      { materialKey: 'osb_board', thicknessCm: 1.5 },
      { materialKey: 'clay_plaster', thicknessCm: 1.5 }
    ]
  }
};

export type NachhaltigkeitBereich = 'wandkonfigurator' | 'qng_nachweis' | 'crrem_regulatorik' | 'praxis_innovationen' | 'leitfaden';

export const ALLE_BEREICHE: readonly NachhaltigkeitBereich[] = ['wandkonfigurator', 'qng_nachweis', 'crrem_regulatorik', 'praxis_innovationen', 'leitfaden'];
