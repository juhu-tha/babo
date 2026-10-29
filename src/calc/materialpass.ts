// Lehrmodell „Urban Mining Lab“ im Modul Materialpässe (vereinfachte Kreislauf-, CO₂-Speicher- und Restwertbilanz).
// Aus src/modules/Materialpaesse.tsx herausgelöst (Modulprüfung Tranche 14), damit die Rechnung testbar ist;
// Rechenweg unverändert. Alle Preise und Quoten sind Lehrwerte, keine Marktdaten.

export type Fuegung = 'glued' | 'mortar' | 'screwed';

export interface Gebaeudetyp {
  concreteVolume: number; // m³ je m² BGF
  steelMass: number;      // kg je m² BGF
  woodVolume: number;     // m³ je m² BGF
  copperMass: number;     // kg je m² BGF
}

/** Lehrwerte für Rohstoffpreise bzw. Entsorgungskosten in € je t. */
export const ROHSTOFFPREISE = {
  copper: 8400,
  steel: 650,
  concreteRecycled: 18, // Restwert sauber gebrochener Gesteinskörnung
  concreteWaste: -35,   // Entsorgungskosten bei verklebtem bzw. nicht trennbarem Beton
  woodBiomass: 110,     // energetische Verwertung oder Spanplatte
  woodReuse: 450,       // direkte Wiederverwendung als Bauteil
} as const;

/** Output-Zirkularität nach Lösbarkeit der Verbindungen in % (geklebt 10, vermörtelt 50, geschraubt 95). */
export const OUTPUT_ZIRKULARITAET: Record<Fuegung, number> = { glued: 10, mortar: 50, screwed: 95 };

export const ROHDICHTE_BETON = 2.4; // t/m³
export const ROHDICHTE_HOLZ = 0.5;  // t/m³, vereinfacht als darrtrockene Masse

export interface MaterialpassBilanz {
  concreteTons: number;
  steelTons: number;
  woodTons: number;
  copperTons: number;
  totalWeightTons: number;
  circularityIndex: number;   // % (Mittel aus Rezyklat-Input und Output-Zirkularität, gerundet)
  carbonStoredTons: number;   // t CO₂ (biogener Kohlenstoff, gerundet)
  totalResidualValue: number; // € (gerundet)
  residualValuePerM2: number; // €/m² BGF (gerundet)
}

export function materialpassBilanz(typ: Gebaeudetyp, bgf: number, rezyklatProzent: number, fuegung: Fuegung): MaterialpassBilanz {
  const concreteTons = typ.concreteVolume * bgf * ROHDICHTE_BETON;
  const steelTons = (typ.steelMass * bgf) / 1000;
  const woodTons = typ.woodVolume * bgf * ROHDICHTE_HOLZ;
  const copperTons = (typ.copperMass * bgf) / 1000;
  const totalWeightTons = concreteTons + steelTons + woodTons + copperTons;

  const circularityIndex = Math.round((rezyklatProzent + OUTPUT_ZIRKULARITAET[fuegung]) / 2);

  // Biogener Kohlenstoff: ca. 50 % C in darrtrockenem Holz → 0,5 · 44/12 ≈ 1,83 t CO₂ je t Holz (DIN EN 16449)
  const carbonStoredTons = Math.round(woodTons * 0.5 * 44 / 12);

  const concreteRecoveryRate = fuegung === 'screwed' ? 0.90 : fuegung === 'mortar' ? 0.60 : 0.0;
  const concreteValue = concreteRecoveryRate > 0
    ? concreteTons * concreteRecoveryRate * ROHSTOFFPREISE.concreteRecycled
    : concreteTons * ROHSTOFFPREISE.concreteWaste;
  const steelRecoveryRate = fuegung === 'screwed' ? 0.98 : fuegung === 'mortar' ? 0.80 : 0.50;
  const steelValue = steelTons * steelRecoveryRate * ROHSTOFFPREISE.steel;
  const woodRecoveryRate = fuegung === 'screwed' ? 0.85 : fuegung === 'mortar' ? 0.40 : 0.05;
  const woodValue = woodRecoveryRate > 0.5
    ? woodTons * woodRecoveryRate * ROHSTOFFPREISE.woodReuse
    : woodTons * ROHSTOFFPREISE.woodBiomass;
  const copperValue = copperTons * 0.95 * ROHSTOFFPREISE.copper;

  const totalResidualValue = Math.round(concreteValue + steelValue + woodValue + copperValue);
  const residualValuePerM2 = Math.round(totalResidualValue / bgf);

  return { concreteTons, steelTons, woodTons, copperTons, totalWeightTons, circularityIndex, carbonStoredTons, totalResidualValue, residualValuePerM2 };
}
