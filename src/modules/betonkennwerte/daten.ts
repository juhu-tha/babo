// Ausgelagert aus src/modules/Betonkennwerte.tsx (AP 5.2)

// ----------------------------------------------------------------------
// EC2 TABELLE 3.1: FESTIGKEITS- UND VERFORMUNGSEIGENSCHAFTEN FÜR BETON
// (DIN EN 1992-1-1:2011-01 & NA:2013-04)
// ----------------------------------------------------------------------
export interface ConcreteClassData {
  name: string;
  fck: number;      // MPa (Zylinder)
  fckCube: number;  // MPa (150 mm Würfel)
  fcm: number;      // MPa
  fctm: number;     // MPa
  fctk005: number;  // MPa
  fctk095: number;  // MPa
  Ecm: number;      // GPa
  epsC1: number;    // ‰
  epsCu1: number;   // ‰
  epsC2: number;    // ‰
  epsCu2: number;   // ‰
  n: number;        // Exponent Parabel-Rechteck
  epsC3: number;    // ‰
  epsCu3: number;   // ‰
}

export const EC2_CONCRETE_CLASSES: ConcreteClassData[] = [
  { name: 'C12/15', fck: 12, fckCube: 15, fcm: 20, fctm: 1.6, fctk005: 1.1, fctk095: 2.0, Ecm: 27, epsC1: 1.8, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C16/20', fck: 16, fckCube: 20, fcm: 24, fctm: 1.9, fctk005: 1.3, fctk095: 2.5, Ecm: 29, epsC1: 1.9, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C20/25', fck: 20, fckCube: 25, fcm: 28, fctm: 2.2, fctk005: 1.5, fctk095: 2.9, Ecm: 30, epsC1: 2.0, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C25/30', fck: 25, fckCube: 30, fcm: 33, fctm: 2.6, fctk005: 1.8, fctk095: 3.3, Ecm: 31, epsC1: 2.1, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C30/37', fck: 30, fckCube: 37, fcm: 38, fctm: 2.9, fctk005: 2.0, fctk095: 3.8, Ecm: 33, epsC1: 2.2, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C35/45', fck: 35, fckCube: 45, fcm: 43, fctm: 3.2, fctk005: 2.2, fctk095: 4.2, Ecm: 34, epsC1: 2.25, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C40/50', fck: 40, fckCube: 50, fcm: 48, fctm: 3.5, fctk005: 2.5, fctk095: 4.6, Ecm: 35, epsC1: 2.3, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C45/55', fck: 45, fckCube: 55, fcm: 53, fctm: 3.8, fctk005: 2.7, fctk095: 4.9, Ecm: 36, epsC1: 2.4, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C50/60', fck: 50, fckCube: 60, fcm: 58, fctm: 4.1, fctk005: 2.9, fctk095: 5.3, Ecm: 37, epsC1: 2.45, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C55/67', fck: 55, fckCube: 67, fcm: 63, fctm: 4.2, fctk005: 3.0, fctk095: 5.5, Ecm: 38, epsC1: 2.5, epsCu1: 3.2, epsC2: 2.2, epsCu2: 3.1, n: 1.75, epsC3: 1.8, epsCu3: 3.1 },
  { name: 'C60/75', fck: 60, fckCube: 75, fcm: 68, fctm: 4.4, fctk005: 3.1, fctk095: 5.7, Ecm: 39, epsC1: 2.6, epsCu1: 3.0, epsC2: 2.3, epsCu2: 2.9, n: 1.6, epsC3: 1.9, epsCu3: 2.9 },
  { name: 'C70/85', fck: 70, fckCube: 85, fcm: 78, fctm: 4.6, fctk005: 3.2, fctk095: 6.0, Ecm: 41, epsC1: 2.7, epsCu1: 2.8, epsC2: 2.4, epsCu2: 2.7, n: 1.45, epsC3: 2.0, epsCu3: 2.7 },
  { name: 'C80/95', fck: 80, fckCube: 95, fcm: 88, fctm: 4.8, fctk005: 3.4, fctk095: 6.3, Ecm: 42, epsC1: 2.8, epsCu1: 2.8, epsC2: 2.5, epsCu2: 2.6, n: 1.4, epsC3: 2.2, epsCu3: 2.6 },
  { name: 'C90/105', fck: 90, fckCube: 105, fcm: 98, fctm: 5.0, fctk005: 3.5, fctk095: 6.6, Ecm: 44, epsC1: 2.8, epsCu1: 2.8, epsC2: 2.6, epsCu2: 2.6, n: 1.4, epsC3: 2.3, epsCu3: 2.6 },
  { name: 'C100/115', fck: 100, fckCube: 115, fcm: 108, fctm: 5.2, fctk005: 3.6, fctk095: 6.8, Ecm: 45, epsC1: 2.8, epsCu1: 2.8, epsC2: 2.6, epsCu2: 2.6, n: 1.4, epsC3: 2.3, epsCu3: 2.6 }
];
