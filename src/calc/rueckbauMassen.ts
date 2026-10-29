/**
 * Rückbaurechner (Modul „Rückbau & Material“): Abschätzung der Abbruchmassen aus dem Brutto-Rauminhalt (BRI).
 * m_i = V_BRI · ρ_i, m_ges = Σ m_i.
 *
 * Massenkennwerte ρ_i [t je m³ BRI] – Lehrwerte, vorläufig, F-Freigabe (T12-RB-4, Umsetzung 29.10.2026; ersetzen kein Aufmaß der Massen):
 * Summe je Bauweise 0,3 (Holzständerbau) bis 0,5 t/m³ (Massivbau Stahlbeton bzw. Mauerwerk, Standard);
 * Aufteilung auf die Fraktionen wie in der früheren Fassung (dort Summen 1,1–1,9 t/m³, physikalisch zu hoch).
 * Plausibilisierung: Krause/Hafner (2022), Energies 15(16) 5825, doi:10.3390/en15165825 – Materialintensitäten
 * deutscher Wohngebäude 0,61–1,95 t/m² BGF (Einfamilienhäuser) bzw. 1,36–1,54 t/m² BGF (Mehrfamilienhäuser);
 * mit rund 3 m BRI je m² BGF entspricht das etwa 0,2–0,65 bzw. 0,45–0,5 t/m³ BRI.
 * Eine öffentliche Tabelle mit Kennwerten je Bauweise und BRI wurde nicht gefunden.
 */

export type Bauweise = 'concrete' | 'masonry' | 'timber' | 'composite';
export type Fraktion = 'concrete' | 'masonry' | 'wood' | 'metals' | 'plastics' | 'gypsum' | 'hazardous' | 'mixed';
export type Massenkennwerte = Record<Fraktion, number>;

export const MASSENKENNWERTE_BRI: Record<Bauweise, Massenkennwerte> = {
  // Stahlbetonbau (Skelett, Fertigteile) – Massivbau, Summe 0,50 t/m³
  concrete: { concrete: 0.403, masonry: 0.027, wood: 0.013, metals: 0.016, plastics: 0.005, gypsum: 0.011, hazardous: 0.004, mixed: 0.021 },
  // Mauerwerksbau (Ziegel, Kalksandstein) – Massivbau, Standard, Summe 0,50 t/m³
  masonry: { concrete: 0.105, masonry: 0.315, wood: 0.021, metals: 0.011, plastics: 0.005, gypsum: 0.016, hazardous: 0.003, mixed: 0.024 },
  // Holzständerbau (Leichtbau, Gefache) – Summe 0,30 t/m³
  timber: { concrete: 0.053, masonry: 0.027, wood: 0.133, metals: 0.008, plastics: 0.008, gypsum: 0.032, hazardous: 0.007, mixed: 0.032 },
  // Mischbauweise (gängiger Wohnungsbau) – Summe 0,45 t/m³
  composite: { concrete: 0.209, masonry: 0.139, wood: 0.019, metals: 0.019, plastics: 0.009, gypsum: 0.019, hazardous: 0.005, mixed: 0.031 },
};

/** Summe der Massenkennwerte einer Bauweise [t/m³ BRI]. */
export const massenkennwertSumme = (b: Bauweise): number =>
  Object.values(MASSENKENNWERTE_BRI[b]).reduce((s, x) => s + x, 0);

export interface RueckbauMassen {
  massen: Record<Fraktion, number>; // [t], ganzzahlig gerundet wie in der Anzeige
  gesamt: number;                   // [t]
  mineralischProzent: number;       // (Beton + Mauerwerk) / gesamt · 100, gerundet
}

/** Abbruchmassen je Fraktion aus BRI [m³] und Bauweise. */
export function rueckbauMassen(bri: number, bauweise: Bauweise): RueckbauMassen {
  const v = Math.max(0, Number.isFinite(bri) ? bri : 0);
  const k = MASSENKENNWERTE_BRI[bauweise];
  const massen = Object.fromEntries(
    (Object.keys(k) as Fraktion[]).map((f) => [f, Math.round(v * k[f])]),
  ) as Record<Fraktion, number>;
  const gesamt = Object.values(massen).reduce((s, x) => s + x, 0);
  const mineralischProzent = Math.round(((massen.concrete + massen.masonry) / (gesamt || 1)) * 100);
  return { massen, gesamt, mineralischProzent };
}
