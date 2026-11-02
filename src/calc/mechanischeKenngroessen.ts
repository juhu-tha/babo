/**
 * Rechenkern Mechanische Kenngrößen eines Stabs (Z3), übernommen aus src/modules/MechanischeKenngroessen.tsx:
 *  - Querschnitt: Kreis A = π·d²/4, I = π·d⁴/64; Rechteck A = b·h, I_y = b·h³/12, I_z = h·b³/12
 *  - Steifigkeiten EA, EI (starke Achse), EI_min, Federsteifigkeit c = EA/L
 *  - Spannung σ = F/A (Zug positiv), Dehnung ε = σ/E (Hooke), ΔL = F·L/(E·A), Querdehnung ε_q = −ν·ε, Δd = ε_q·d
 *  - Biegung Einfeldträger mit Einzellast in Feldmitte: w = F·L³/(48·EI)
 *  - Euler-Knicklast (Fall 2, β = 1): F_K = π²·E·I_min/(β·L)²
 *  - Formänderungsarbeit U = ½·F·ΔL; G = E/(2·(1 + ν)); K = E/(3·(1 − 2ν))
 *  - Kriechen ΔL_k = φ·ΔL_el, E_eff = E/(1 + φ); Schwinden ΔL_s = −ε_s·L; Masse m = A·L·ρ
 *  - Grenzzustand: spröde (mineralisch, Glas) ohne Fließgrenze; Zug: f_u, Druck: f_y (Druckfestigkeit)
 * Einheiten: Kraft in kN, Länge L in m, Querschnittsmaße in mm, E/f in N/mm², ε_s in ‰, ρ in kg/m³;
 * Ergebnisse mit Einheit im Namen (…Mm, …Mm2, …Mm4, …KN, …KNm2, …Joule). Linear-elastische Rechnung auch oberhalb
 * der Fließgrenze (Lehrvereinfachung, als Warnung gemeldet). Reiner Rechenkern – geprüft in tests/mechanischeKenngroessen.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss, nurGueltig } from './plausibilitaet';

export type Werkstoffkategorie = 'Metall' | 'Mineralisch' | 'Organisch' | 'Verbund' | 'Glas';

export interface StabWerkstoff {
  kategorie: Werkstoffkategorie;
  /** E-Modul in N/mm² */
  E: number;
  /** Querdehnzahl ν */
  nu: number;
  /** Streckgrenze bzw. Druckfestigkeit in N/mm² */
  fy: number;
  /** Zugfestigkeit in N/mm² */
  fu: number;
  /** Rohdichte in kg/m³ */
  dichte: number;
}

export interface StabEingabe {
  werkstoff: StabWerkstoff;
  lastArt: 'zug' | 'druck';
  /** Betrag der Normalkraft in kN */
  kraftKn: number;
  /** Stablänge in m */
  laengeM: number;
  querschnitt: 'rund' | 'rechteck';
  /** Durchmesser (Kreis) in mm */
  durchmesserMm: number;
  /** Breite b und Höhe h (Rechteck) in mm */
  breiteMm: number;
  hoeheMm: number;
  /** Kriechzahl φ */
  kriechZahl: number;
  /** Endschwindmaß ε_s in ‰ (Betrag) */
  schwindPromille: number;
}

export interface StabErgebnis {
  A0_mm2: number; d0_mm: number; I_mm4: number; I_y_mm4: number; I_z_mm4: number; I_min_mm4: number;
  EA_kN: number; EA_MN: number; EI_kNm2: number; EI_min_kNm2: number;
  /** Federsteifigkeit in N/mm (= kN/m) */
  federsteifigkeit_kN_m: number;
  biegedurchbiegung_mm: number;
  /** Normalspannung σ in N/mm² (Zug positiv) */
  sigma: number; absSigma: number;
  zulSpannung: number; fliessGrenze: number;
  /** Auslastungen in % */
  auslastungFestigkeit: number; auslastungFliess: number;
  isSproede: boolean; isPlastisch: boolean; isVersagt: boolean;
  F_K_kN: number; knickAuslastung: number; isKnickGefaehrdet: boolean;
  epsilon: number; epsilonPromille: number; epsilonProzent: number;
  deltaL_mm: number; endLaenge_mm: number;
  epsilonQ: number; deltaD_mm: number; endD_mm: number;
  U_Joule: number; G_MPa: number; K_MPa: number;
  effEModulKriechen: number; deltaL_kriechen_mm: number; deltaL_elastisch_plus_kriechen_mm: number;
  deltaL_schwinden_mm: number; deltaL_gesamt_mm: number; endLaengeGesamt_mm: number;
  masse_kg: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function stabKenngroessen(e: StabEingabe): StabErgebnis {
  const hinweise: Hinweis[] = [];
  const mat = e.werkstoff;
  muss(hinweise, istEndlich(mat.E, mat.nu, mat.fy, mat.fu, mat.dichte, e.kraftKn, e.laengeM, e.durchmesserMm, e.breiteMm, e.hoeheMm, e.kriechZahl, e.schwindPromille), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  muss(hinweise, mat.E > 0, 'E', 'Der E-Modul muss größer als 0 sein.');
  // Grenzfallprüfung 02.11.2026: negative Kriechzahl vorher ohne Hinweis (φ = −1 → E_eff = ∞)
  muss(hinweise, !(e.kriechZahl < 0), 'kriechZahl', 'Die Kriechzahl darf nicht negativ sein.');
  muss(hinweise, mat.nu > -1 && mat.nu < 0.5, 'nu', 'Die Querdehnzahl muss zwischen −1 und 0,5 liegen.');
  muss(hinweise, e.laengeM > 0, 'laengeM', 'Die Stablänge muss größer als 0 sein.');
  if (e.querschnitt === 'rund') muss(hinweise, e.durchmesserMm > 0, 'durchmesserMm', 'Der Durchmesser muss größer als 0 sein.');
  else muss(hinweise, e.breiteMm > 0 && e.hoeheMm > 0, 'breiteMm', 'Breite und Höhe müssen größer als 0 sein.');

  let A0_mm2: number, d0_mm: number, I_y_mm4: number, I_z_mm4: number, I_min_mm4: number;
  if (e.querschnitt === 'rund') {
    A0_mm2 = (Math.PI * Math.pow(e.durchmesserMm, 2)) / 4;
    d0_mm = e.durchmesserMm;
    I_y_mm4 = (Math.PI * Math.pow(e.durchmesserMm, 4)) / 64;
    I_z_mm4 = I_y_mm4;
    I_min_mm4 = I_y_mm4;
  } else {
    A0_mm2 = e.breiteMm * e.hoeheMm;
    d0_mm = Math.min(e.breiteMm, e.hoeheMm);
    I_y_mm4 = (e.breiteMm * Math.pow(e.hoeheMm, 3)) / 12;
    I_z_mm4 = (e.hoeheMm * Math.pow(e.breiteMm, 3)) / 12;
    I_min_mm4 = Math.min(I_y_mm4, I_z_mm4);
  }
  const I_mm4 = I_y_mm4;
  const EA_N = mat.E * A0_mm2;
  const EA_kN = EA_N / 1000;
  const EA_MN = EA_N / 1e6;
  const EI_Nmm2 = mat.E * I_mm4;
  const EI_kNm2 = EI_Nmm2 / 1e9;
  const EI_min_kNm2 = (mat.E * I_min_mm4) / 1e9;
  const L0_mm = e.laengeM * 1000;
  const federsteifigkeit_kN_m = EA_N / L0_mm;
  const F_N = (e.lastArt === 'zug' ? e.kraftKn : -e.kraftKn) * 1000;
  const absF_N = Math.abs(F_N);
  const biegedurchbiegung_mm = (absF_N * Math.pow(L0_mm, 3)) / (48 * EI_Nmm2);
  const sigma = F_N / A0_mm2;
  const absSigma = Math.abs(sigma);
  const isSproede = mat.kategorie === 'Mineralisch' || mat.kategorie === 'Glas';
  const zulSpannung = e.lastArt === 'zug' ? mat.fu : mat.fy;
  const fliessGrenze = e.lastArt === 'zug' ? (isSproede ? mat.fu : mat.fy) : mat.fy;
  const auslastungFestigkeit = (absSigma / (zulSpannung || 1)) * 100;
  const auslastungFliess = (absSigma / (fliessGrenze || 1)) * 100;
  const isPlastisch = !isSproede && absSigma > fliessGrenze && absSigma <= zulSpannung;
  const isVersagt = absSigma > zulSpannung;
  const betaKnick = 1.0;
  const F_K_N = (Math.pow(Math.PI, 2) * mat.E * I_min_mm4) / Math.pow(betaKnick * L0_mm, 2);
  const F_K_kN = F_K_N / 1000;
  const knickAuslastung = e.lastArt === 'druck' ? (e.kraftKn / (F_K_kN || 0.001)) * 100 : 0;
  const isKnickGefaehrdet = e.lastArt === 'druck' && e.kraftKn > F_K_kN;
  const epsilon = sigma / mat.E;
  const epsilonPromille = epsilon * 1000;
  const epsilonProzent = epsilon * 100;
  const deltaL_mm = (F_N * L0_mm) / EA_N;
  const endLaenge_mm = L0_mm + deltaL_mm;
  const epsilonQ = -mat.nu * epsilon;
  const deltaD_mm = epsilonQ * d0_mm;
  const endD_mm = d0_mm + deltaD_mm;
  const U_Joule = 0.5 * (absF_N * (Math.abs(deltaL_mm) / 1000));
  const G_MPa = mat.E / (2 * (1 + mat.nu));
  const K_MPa = mat.E / (3 * (1 - 2 * mat.nu));
  const effEModulKriechen = mat.E / (1 + e.kriechZahl);
  const deltaL_kriechen_mm = deltaL_mm * e.kriechZahl;
  const deltaL_elastisch_plus_kriechen_mm = deltaL_mm * (1 + e.kriechZahl);
  const deltaL_schwinden_mm = -(e.schwindPromille / 1000) * L0_mm;
  const deltaL_gesamt_mm = deltaL_elastisch_plus_kriechen_mm + deltaL_schwinden_mm;
  const endLaengeGesamt_mm = L0_mm + deltaL_gesamt_mm;
  const masse_kg = (A0_mm2 / 1e6) * e.laengeM * mat.dichte;

  if (isPlastisch || isVersagt) hinweise.push({ stufe: 'warnung', feld: 'kraftKn', text: 'Spannung oberhalb der Fließgrenze bzw. Festigkeit: Dehnung und Längenänderung sind nur linear-elastisch gerechnet.' });
  if (e.lastArt === 'druck' && isKnickGefaehrdet) hinweise.push({ stufe: 'warnung', feld: 'laengeM', text: 'Druckkraft über der Euler-Knicklast: Der Stab knickt vor Erreichen der Druckfestigkeit aus.' });
  if (e.lastArt === 'zug' && !isSproede && mat.kategorie !== 'Metall') hinweise.push({ stufe: 'warnung', feld: 'werkstoff', text: 'Holz und Faserverbund versagen auf Zug spröde; als „Fließgrenze“ wird hier f_y (Druckfestigkeit) angesetzt.' });
  if (e.kriechZahl < 0 || e.schwindPromille < 0) hinweise.push({ stufe: 'warnung', feld: 'kriechZahl', text: 'Kriechzahl und Schwindmaß werden als nicht negative Beträge erwartet.' });

  return nurGueltig({
    A0_mm2, d0_mm, I_mm4, I_y_mm4, I_z_mm4, I_min_mm4, EA_kN, EA_MN, EI_kNm2, EI_min_kNm2, federsteifigkeit_kN_m, biegedurchbiegung_mm,
    sigma, absSigma, zulSpannung, fliessGrenze, auslastungFestigkeit, auslastungFliess, isSproede, isPlastisch, isVersagt,
    F_K_kN, knickAuslastung, isKnickGefaehrdet, epsilon, epsilonPromille, epsilonProzent, deltaL_mm, endLaenge_mm,
    epsilonQ, deltaD_mm, endD_mm, U_Joule, G_MPa, K_MPa, effEModulKriechen, deltaL_kriechen_mm, deltaL_elastisch_plus_kriechen_mm,
    deltaL_schwinden_mm, deltaL_gesamt_mm, endLaengeGesamt_mm, masse_kg,
    gueltig: !hatFehler(hinweise), hinweise,
  });
}
