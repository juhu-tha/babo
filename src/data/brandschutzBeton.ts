/**
 * Tabellarische Mindestmaße für Stahlbetonbauteile im Brandfall (Beispielrechnung Brandschutz, Reiter Stahlbeton).
 * Balken: statisch bestimmt gelagerte Balken, kleinste Breite b_min mit zugehörigem Achsabstand a nach DIN EN 1992-1-2,
 * Tab. 5.5 (erste Spalte; öffentlich wiedergegeben u. a. in Acta Technica Napocensis 57 (2014) 2, Tab. 4:
 * b_w,min 80/120/150/200 mm, a 25/40/55/65 mm). Platten: einachsig gespannte Platten, Tab. 5.8 (h_s).
 * Stützen: Richtwerte ohne Angabe des Ausnutzungsgrads μ_fi (Methode A, Tab. 5.2a) – vorläufig, F-Freigabe.
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
}

export const EC2_BRAND_MINDESTMASSE: readonly BrandMindestmass[] = [
  { klasse: 'R30', balkenB: 80, balkenA: 25, platteH: 60 },
  { klasse: 'R60', balkenB: 120, balkenA: 40, platteH: 80 },
  { klasse: 'R90', balkenB: 150, balkenA: 55, platteH: 100 },
  { klasse: 'R120', balkenB: 200, balkenA: 65, platteH: 120 },
];
