/**
 * Bereich und Raster des GWP-Reglers im Modul BIM-Baustoffe [kg CO₂-Äq./m³] (Umsetzung 02.11.2026, Gegenprüfung 30.10.2026,
 * Hinweise zu DSB-BIM-1):
 *  - Schritt 1 statt 5 für Beton, Holz und Mineralwolle, damit die Voreinstellung aus der Lehrwerttabelle (z. B. Beton C30/37
 *    CEM I 258) auf dem Raster liegt – vorher zeigte der Regler den gerundeten Rasterwert, die IFC-Ausgabe den Lehrwert.
 *  - Stahl bis 23 000, damit die Spanne des Profilstahl-Lehrwerts bis rund 2,9 kg/kg (≈ 22 800 kg/m³ bei 7850 kg/m³)
 *    einstellbar ist (vorher Ende bei 10 000).
 */
export interface GwpReglerBereich {
  min: number;
  max: number;
  step: number;
}

export function gwpRegler(id: string): GwpReglerBereich {
  if (id === 'holz') return { min: -900, max: -300, step: 1 };
  if (id === 'stahl') return { min: 2000, max: 23000, step: 5 };
  return { min: 10, max: 400, step: 1 };
}

/** true, wenn ein Wert im Bereich und auf dem Raster des Reglers liegt (der Regler zeigt ihn dann unverändert an) */
export function liegtAufRaster(id: string, wert: number): boolean {
  const r = gwpRegler(id);
  const n = (wert - r.min) / r.step;
  return wert >= r.min && wert <= r.max && Math.abs(n - Math.round(n)) < 1e-9;
}
