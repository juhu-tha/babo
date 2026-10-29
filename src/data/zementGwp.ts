/**
 * Zement-GWP A1–A3 (GWP-total, Nettowert) in kg CO₂-Äq. je kg Zement – gemeinsame Konstante für alle Module
 * (Entscheidung 29.10.2026, Modulprüfung T15-NH-3; vorher je Modul 0,80 bzw. 0,85 für CEM I).
 *
 * Belegt (VDZ-Branchen-EPD nach DIN EN 15804+A2, Download über beton.org):
 *  - CEM I: 665 kg CO₂-Äq./t netto; brutto einschließlich CO₂ aus der Verbrennung von Abfällen 875 kg/t
 *    (EPD-VDZ-20220153-IAG1-DE, ausgestellt 08.06.2022, gültig bis 07.06.2027)
 *  - CEM II/C-M (50 % Klinker): 400 kg CO₂-Äq./t netto; brutto 510 kg/t
 *    (EPD-VDZ-20230234-IAG1-DE, ausgestellt 11.07.2023, gültig bis 10.07.2028)
 *
 * Lehrwerte (vorläufig, F-Freigabe): Für die übrigen Zementarten wurde kein Wert einer VDZ-Branchen-EPD abgerufen.
 * Sie sind linear über den mittleren Klinkeranteil k (Bandmitte nach DIN EN 197-1/-5) zwischen den beiden EPD-Werten
 * inter- bzw. extrapoliert und auf 0,01 gerundet (lehrwertAusKlinker). Ausnahme CEM II/A: 0,60 wie bisher in der
 * Materialoptimierung (abgestimmt auf ÖKOBAUDAT 2024-I „Transportbeton C25/30“). Für Nachweise gelten die EPD des
 * Herstellers bzw. die Branchen-EPD.
 *
 * Alle Module rechnen mit Nettowerten. Ein Bruttowert (mit Brennstoff-Emissionen aus Abfällen) ist nur für die belegten
 * Zemente angegeben und wird nicht gerechnet.
 */
export type ZementGwpArt = 'CEM I' | 'CEM II/A' | 'CEM II/B' | 'CEM II/C-M' | 'CEM III/A' | 'CEM III/B' | 'CEM IV' | 'CEM V' | 'CEM VI';

/** Stützstellen der Lehrwerte: belegte Nettowerte und Klinkeranteile */
export const VDZ_EPD_STUETZ = { cemI: { klinker: 0.95, gwp: 0.665 }, cemIICM: { klinker: 0.50, gwp: 0.400 } } as const;

/** Lehrwert aus dem mittleren Klinkeranteil k (0…1), linear zwischen CEM II/C-M und CEM I, auf 0,01 gerundet */
export function lehrwertAusKlinker(k: number): number {
  const { cemI, cemIICM } = VDZ_EPD_STUETZ;
  const g = cemIICM.gwp + ((cemI.gwp - cemIICM.gwp) * (k - cemIICM.klinker)) / (cemI.klinker - cemIICM.klinker);
  return Math.round(g * 100) / 100;
}

/** Mittlerer Klinkeranteil (Bandmitte DIN EN 197-1/-5) der Lehrwerte */
export const KLINKER_MITTE: Readonly<Record<'CEM II/B' | 'CEM III/A' | 'CEM III/B' | 'CEM IV' | 'CEM V' | 'CEM VI', number>> = {
  'CEM II/B': 0.72, 'CEM III/A': 0.495, 'CEM III/B': 0.27, 'CEM IV': 0.545, 'CEM V': 0.52, 'CEM VI': 0.42,
};

/** GWP A1–A3 netto [kg CO₂-Äq./kg Zement] */
export const ZEMENT_GWP_KG: Readonly<Record<ZementGwpArt, number>> = {
  'CEM I': 0.665,      // VDZ-Branchen-EPD 2022 (belegt)
  'CEM II/A': 0.60,    // Lehrwert (ÖKOBAUDAT-Abgleich, vorläufig)
  'CEM II/B': 0.53,    // Lehrwert aus Klinkeranteil (vorläufig)
  'CEM II/C-M': 0.40,  // VDZ-Branchen-EPD 2023 (belegt)
  'CEM III/A': 0.40,   // Lehrwert aus Klinkeranteil (vorläufig)
  'CEM III/B': 0.26,   // Lehrwert aus Klinkeranteil (vorläufig)
  'CEM IV': 0.43,      // Lehrwert aus Klinkeranteil (vorläufig)
  'CEM V': 0.41,       // Lehrwert aus Klinkeranteil (vorläufig)
  'CEM VI': 0.35,      // Lehrwert aus Klinkeranteil (vorläufig)
};

/** Bruttowerte einschließlich CO₂ aus der Verbrennung von Abfällen [kg CO₂-Äq./kg] – nur Kennzeichnung, nicht gerechnet */
export const ZEMENT_GWP_BRUTTO_KG: Readonly<Partial<Record<ZementGwpArt, number>>> = { 'CEM I': 0.875, 'CEM II/C-M': 0.51 };

/** Zementarten mit belegtem Wert (VDZ-Branchen-EPD); alle anderen sind Lehrwerte */
export const ZEMENT_GWP_BELEGT: readonly ZementGwpArt[] = ['CEM I', 'CEM II/C-M'];
