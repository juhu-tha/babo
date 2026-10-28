/**
 * Tabellarische Mindestmaße für Stahlbetonbauteile im Brandfall (Beispielrechnung Brandschutz, Reiter Stahlbeton).
 * Balken: statisch bestimmt gelagerte Balken, kleinste Breite b_min mit zugehörigem Achsabstand a nach DIN EN 1992-1-2,
 * Tab. 5.5 (erste Spalte; öffentlich wiedergegeben u. a. in Acta Technica Napocensis 57 (2014) 2, Tab. 4:
 * b_w,min 80/120/150/200 mm, a 25/40/55/65 mm). Platten: einachsig gespannte Platten, Tab. 5.8 (h_s).
 * Stützen (Runde 28.10., T3-BR-2): Methode A, Tab. 5.2a, mehrseitig brandbeansprucht, je erste Kombination b_min/a für
 * μ_fi = 0,5 und μ_fi = 0,7 (EC2-1-2 Tab. 5.2a, öffentlich wiedergegeben u. a. bei Structville, „Fire resistance design of
 * reinforced concrete structures“, Table 10 nach EN 1992-1-2:2004); vorher Richtwerte 200/25, 250/35, 300/45, 350/55 mm
 * ohne μ_fi, die zu keiner Spalte passten. Vorläufig, F-Freigabe (Tab. 5.2a mit NA DE).
 * Modulprüfung Tranche 3, Befund T3-BR-1: vorher R60 120/35, R90 160/45, R120 200/55 mm – Breite und Achsabstand
 * stammten aus verschiedenen Spalten; der Achsabstand lag für die angegebene Breite auf der unsicheren Seite.
 */
export interface BrandMindestmass {
  klasse: 'R30' | 'R60' | 'R90' | 'R120';
  /** Balken: Mindestbreite b_min [mm] und Achsabstand a [mm] */
  balkenB: number;
  balkenA: number;
  /** Platte: Mindestdicke h_s [mm] */
  platteH: number;
  /** Stütze (Methode A, Tab. 5.2a, mehrseitig): b_min/a [mm] je μ_fi; erste Kombination und ggf. Alternative */
  stuetze05: readonly [number, number];
  stuetze05Alt?: readonly [number, number];
  stuetze07: readonly [number, number];
  stuetze07Alt?: readonly [number, number];
}

export const EC2_BRAND_MINDESTMASSE: readonly BrandMindestmass[] = [
  { klasse: 'R30', balkenB: 80, balkenA: 25, platteH: 60, stuetze05: [200, 25], stuetze07: [200, 32], stuetze07Alt: [300, 27] },
  { klasse: 'R60', balkenB: 120, balkenA: 40, platteH: 80, stuetze05: [200, 36], stuetze05Alt: [300, 31], stuetze07: [250, 46], stuetze07Alt: [350, 40] },
  { klasse: 'R90', balkenB: 150, balkenA: 55, platteH: 100, stuetze05: [300, 45], stuetze05Alt: [400, 38], stuetze07: [350, 53], stuetze07Alt: [450, 40] },
  { klasse: 'R120', balkenB: 200, balkenA: 65, platteH: 120, stuetze05: [350, 45], stuetze05Alt: [450, 40], stuetze07: [350, 57], stuetze07Alt: [450, 51] },
];
