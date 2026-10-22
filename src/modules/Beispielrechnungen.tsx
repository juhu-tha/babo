import { formatDeZahl, formatDeTeX, formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { 
  Calculator, 
  Layers, 
  Flame, 
  Shield, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sliders,
  Scale,
  Settings,
  Leaf,
  History,
  Volume2
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

interface BeispielrechnungenProps {
  forceTab?: 'u_wert' | 'beton' | 'stahlbeton' | 'holzbau' | 'mauerwerk' | 'nachhaltigkeit' | 'bestand' | 'schallschutz' | 'brandschutz';
}

export default function Beispielrechnungen({ forceTab }: BeispielrechnungenProps = {}) {
  const [localActiveTab, setLocalActiveTab] = useState<'u_wert' | 'beton' | 'stahlbeton' | 'holzbau' | 'mauerwerk' | 'nachhaltigkeit' | 'bestand' | 'schallschutz' | 'brandschutz'>('u_wert');
  const activeTab = forceTab || localActiveTab;

  const setActiveTab = (tab: 'u_wert' | 'beton' | 'stahlbeton' | 'holzbau' | 'mauerwerk' | 'nachhaltigkeit' | 'bestand' | 'schallschutz' | 'brandschutz') => {
    if (!forceTab) {
      setLocalActiveTab(tab);
    }
  };

  // --- 1. STATE FOR U-WERT BERECHNUNG ---
  const [uConcreteThick, setUConcreteThick] = useState<number>(20); // in cm
  const [uConcreteLambda, setUConcreteLambda] = useState<number>(2.3); // W/(mK) - Normalbeton
  const [uInsuThick, setUInsuThick] = useState<number>(14); // in cm
  const [uInsuLambda, setUInsuLambda] = useState<number>(0.035); // W/(mK) - EPS/Mineralwolle
  const [uPlasterThick, setUPlasterThick] = useState<number>(1.5); // in cm (Innenputz)
  const [uPlasterLambda, setUPlasterLambda] = useState<number>(0.70); // W/(mK) - Kalkgipsputz

  // Constants
  const R_si = 0.13; // m²K/W (Wärmeübergangswiderstand innen nach DIN EN ISO 6946)
  const R_se = 0.04; // m²K/W (Wärmeübergangswiderstand außen nach DIN EN ISO 6946)

  // Calculations
  const R_concrete = (uConcreteThick / 100) / uConcreteLambda;
  const R_insulation = (uInsuThick / 100) / uInsuLambda;
  const R_plaster = (uPlasterThick / 100) / uPlasterLambda;
  const R_T = R_si + R_concrete + R_insulation + R_plaster + R_se;
  const U_value = 1 / R_T;

  const gegLimit = 0.24; // W/(m²K) limit according to GEG (Gebäudeenergiegesetz) for exterior walls

  // --- 2. STATE FOR BETON MISCHUNGSENTWURF ---
  const [targetExposure, setTargetExposure] = useState<'XC4' | 'XD3'>('XC4');
  const [consClass, setConsClass] = useState<'F2' | 'F3' | 'F4'>('F3');
  const [maxGrainSize, setMaxGrainSize] = useState<16 | 32>(32);
  const [chosenCementStrength, setChosenCementStrength] = useState<number>(42.5);

  // Specifications based on DIN 1045-2 & DIN EN 206
  // For XC4: max w/z = 0.50, min cement = 280 kg/m³
  // For XD3: max w/z = 0.45, min cement = 320 kg/m³
  const maxWz = targetExposure === 'XC4' ? 0.50 : 0.45;
  const minCement = targetExposure === 'XC4' ? 280 : 320;

  // Approximate water demand in kg/m³ (or l/m³) based on target consistency and max grain size (Walz / DBV guidance)
  const getWaterDemand = () => {
    if (maxGrainSize === 32) {
      if (consClass === 'F2') return 165;
      if (consClass === 'F3') return 175;
      return 185; // F4
    } else { // dmax = 16
      if (consClass === 'F2') return 180;
      if (consClass === 'F3') return 190;
      return 200; // F4
    }
  };

  const waterDemand = getWaterDemand();
  // Compute required cement based on max allowed w/z and minimum cement content
  const cementFromWz = waterDemand / maxWz;
  const cementContent = Math.max(cementFromWz, minCement);
  const actualWz = waterDemand / cementContent;

  // Densities for absolute volume calculation (kg/dm³ or t/m³)
  const rho_c = 3.10; // Cement density
  const rho_a = 2.65; // Aggregate density
  const rho_w = 1.00; // Water density
  const V_air = 15;   // Compaction pores in dm³/m³ (1.5%)

  // Absolute volume method: V_c + V_w + V_air + V_a = 1000 dm³
  const V_c = cementContent / rho_c;
  const V_w = waterDemand / rho_w;
  const V_a = 1000 - (V_c + V_w + V_air);
  const aggregateMass = V_a * rho_a;
  const freshConcreteDensity = cementContent + waterDemand + aggregateMass;

  // --- NEW: EXTRA BETON CALCULATORS ---
  const [betonSubTab, setBetonSubTab] = useState<'mischung' | 'k_wert' | 'temperatur' | 'festigkeit'>('mischung');

  // A. k-Wert-Ansatz
  const [kAddType, setKAddType] = useState<'flugasche' | 'silikastaub'>('flugasche');
  const [kCement, setKCement] = useState<number>(300); // kg/m³
  const [kAddition, setKAddition] = useState<number>(60); // kg/m³
  const [kWater, setKWater] = useState<number>(150); // l/m³

  const k_factor = kAddType === 'flugasche' ? 0.4 : 2.0;
  const k_max_ratio = kAddType === 'flugasche' ? 0.33 : 0.11;
  const k_max_allowed_addition = kCement * k_max_ratio;
  const k_credited_addition = Math.min(kAddition, k_max_allowed_addition);
  const k_w_z_pure = kWater / kCement;
  const k_w_z_eq = kWater / (kCement + k_factor * k_credited_addition);

  // B. Frischbetontemperatur
  const [tempCement, setTempCement] = useState<number>(20); // °C
  const [tempWater, setTempWater] = useState<number>(12); // °C
  const [tempAggregate, setTempAggregate] = useState<number>(4); // °C
  const [mCementInput, setMCementInput] = useState<number>(320); // kg/m³
  const [mWaterInput, setMWaterInput] = useState<number>(165); // l/m³
  const [mAggregateInput, setMAggregateInput] = useState<number>(1850); // kg/m³
  const [mIceInput, setMIceInput] = useState<number>(0); // kg/m³ (ice replaces part of water)

  // Specific heat capacities in kJ/(kg * K)
  const c_cement = 0.84;
  const c_agg = 0.84;
  const c_water = 4.18;
  const h_fusion_ice = 334; // Latent heat of melting in kJ/kg
  const c_ice = 2.1; // specific heat of ice in kJ/(kg * K)

  // Liquid water mass (total water minus ice)
  const mLiquidWater = Math.max(0, mWaterInput - mIceInput);
  // Heat calculations (reference 0 °C)
  const heat_cement = mCementInput * c_cement * tempCement;
  const heat_agg = mAggregateInput * c_agg * tempAggregate;
  const heat_liquid_water = mLiquidWater * c_water * tempWater;
  const heat_ice_sensible = mIceInput * c_ice * 0; // assuming ice is at 0°C for simplicity
  const heat_ice_melting = -1 * mIceInput * h_fusion_ice; // latent heat absorption

  const total_heat = heat_cement + heat_agg + heat_liquid_water + heat_ice_sensible + heat_ice_melting;
  const total_heat_capacity = (mCementInput * c_cement) + (mAggregateInput * c_agg) + (mWaterInput * c_water);
  const finalFreshTemp = total_heat_capacity > 0 ? Math.max(-5, total_heat / total_heat_capacity) : 0;

  // C. Festigkeitsentwicklung (EC2 Arrhenius maturity)
  const [strengthClassFck, setStrengthClassFck] = useState<number>(25); // e.g. 20, 25, 30, 37, 40, 50 MPa
  const [strengthCementType, setStrengthCementType] = useState<'S' | 'N' | 'R'>('N');
  const [strengthCureAge, setStrengthCureAge] = useState<number>(7); // days
  const [strengthCureTemp, setStrengthCureTemp] = useState<number>(12); // °C

  // s-parameter based on strength class of cement
  const s_param = strengthCementType === 'S' ? 0.38 : strengthCementType === 'N' ? 0.25 : 0.20;

  // Temperature-adjusted age (maturity) in days (Arrhenius)
  const maturityAge = strengthCureAge * Math.exp(4000 * (1/293 - 1/(273 + strengthCureTemp)));
  // Strength ratio beta_cc(t)
  const beta_cc = Math.exp(s_param * (1 - Math.sqrt(28 / Math.max(0.1, maturityAge))));
  // Mean strength
  const f_cm_28 = strengthClassFck + 8;
  const f_cm_t = beta_cc * f_cm_28;
  // Characteristic strength
  const f_ck_t = beta_cc * strengthClassFck;

  // --- 3. STATE FOR STAHLBETON-BIEGUNG ---
  const [mEd, setMEd] = useState<number>(160); // Bending moment in kNm
  const [concreteClass, setConcreteClass] = useState<'C20/25' | 'C25/30' | 'C30/37'>('C25/30');
  const [bWidth, setBWidth] = useState<number>(30); // Beam width in cm
  const [hHeight, setHHeight] = useState<number>(50); // Beam height in cm
  const [d1Margin, setD1Margin] = useState<number>(4.5); // Effective depth cover d1 in cm

  // Material properties
  const f_ck = concreteClass === 'C20/25' ? 20 : concreteClass === 'C25/30' ? 25 : 30; // MPa
  const f_cd = 0.85 * f_ck / 1.5; // design compressive strength
  const f_yk = 500; // B500B steel in MPa
  const f_yd = f_yk / 1.15; // design yield strength

  // Dimensions
  const b_m = bWidth / 100; // m
  const h_m = hHeight / 100; // m
  const d_m = (hHeight - d1Margin) / 100; // effective depth in m

  // Bending dimensionless coefficient
  // mEd is in kNm, f_cd in MPa (= MN/m²). f_cd * 1000 converts MPa to kN/m² so that both numerator and denominator are in kNm:
  const mu_Ed = mEd / (b_m * Math.pow(d_m, 2) * f_cd * 1000);
  const mu_lim = 0.371; // limit for failure in tension without compression reinforcement (for C50/60 is smaller, but here for C20-C30)

  // Mechanical reinforcement ratio omega
  const omega = mu_Ed < mu_lim ? 1 - Math.sqrt(1 - 2 * mu_Ed) : 0;
  // Lever arm coefficient zeta
  const zeta = mu_Ed < mu_lim ? (1 + Math.sqrt(1 - 2 * mu_Ed)) / 2 : 0.8; // conservative fallback if fails
  const z_m = zeta * d_m; // lever arm in m

  // Required steel reinforcement area in cm²
  // As = Med / (f_yd * z)
  const a_s_req = mu_Ed < mu_lim ? (mEd * 10) / (f_yd * z_m) : 0; // unit conversion to cm²

  // --- 4. STATE FOR HOLZBAU KNICKEN ---
  const [colLength, setColLength] = useState<number>(3.0); // column length in m
  const [colWidth, setColWidth] = useState<number>(14); // cross-section b in cm
  const [colHeight, setColHeight] = useState<number>(14); // cross-section h in cm
  const [designForce, setDesignForce] = useState<number>(65); // N_d in kN
  const [timberGrade, setTimberGrade] = useState<'C24' | 'C30'>('C24');
  const [serviceClass, setServiceClass] = useState<1 | 2>(1);

  // Material parameters
  const f_c0k = timberGrade === 'C24' ? 21 : 27; // Compressive strength in N/mm²
  const E_005 = timberGrade === 'C24' ? 7400 : 8000; // 5th-percentile modulus of elasticity in N/mm²
  const k_mod = serviceClass === 1 ? 0.90 : 0.80; // short-term load duration
  const gamma_M = 1.3; // Solid timber partial factor

  const f_c0d = k_mod * f_c0k / gamma_M; // design compressive strength

  // Cross section properties
  const A_wood = colWidth * colHeight; // cm²
  const I_wood = (colWidth * Math.pow(colHeight, 3)) / 12; // cm⁴
  const i_radius = colHeight / Math.sqrt(12); // radius of gyration in cm
  const slenderness = (colLength * 100) / i_radius; // lambda = s_k / i

  // Relative slenderness
  // lambda_rel = (lambda / pi) * sqrt(f_c0k / E_005)
  const lambda_rel = (slenderness / Math.PI) * Math.sqrt(f_c0k / E_005);

  // Factor k for solid timber (beta_c = 0.2)
  const beta_c = 0.2;
  const k_factor_wood = 0.5 * (1 + beta_c * (lambda_rel - 0.3) + Math.pow(lambda_rel, 2));

  // Buckling coefficient k_c
  const k_c = 1 / (k_factor_wood + Math.sqrt(Math.pow(k_factor_wood, 2) - Math.pow(lambda_rel, 2)));
  const k_c_final = Math.min(1.0, k_c);

  // Compressive stress
  const sigma_c0d = (designForce * 10) / A_wood; // N/mm²
  const maxAllowedStress = k_c_final * f_c0d; // N/mm²
  const utilizationWood = sigma_c0d / maxAllowedStress;

  // --- 5. STATE FOR MAUERWERK TRAGFÄHIGKEIT ---
  const [wallHeight, setWallHeight] = useState<number>(2.75); // in m
  const [wallThick, setWallThick] = useState<number>(17.5); // in cm
  const [masonryType, setMasonryType] = useState<'KS' | 'HLZ'>('KS');
  const [verticalLoad, setVerticalLoad] = useState<number>(90); // N_Ed in kN/m

  // Material parameters (simplified)
  const f_k = masonryType === 'KS' ? 5.6 : 3.2; // Characteristic strength in N/mm² (MPa)
  const gamma_M_mauer = 1.5; // Partial factor for simplified method
  const f_d = f_k / gamma_M_mauer; // Design strength in N/mm²

  // Wall slenderness and reduction factor Phi (DIN EN 1996-3 / simplified method)
  // Effective height: assuming bilateral bearing with slab top and bottom, so rho_2 = 1.0 (or 0.75 if rigid slabs). Let's assume rho = 1.0
  const h_ef = wallHeight; // m
  const t_m = wallThick / 100; // m
  const slenderness_mauer = h_ef / t_m;

  // Reduction factor Phi in the middle of the wall: Phi = 0.85 - 0.0011 * (h_ef/t)^2 (for simplified method)
  const phi_factor = 0.85 - 0.0011 * Math.pow(slenderness_mauer, 2);
  const phi_final = Math.max(0, phi_factor);

  // Design vertical resistance per meter length of wall: N_Rd = Phi * t * f_d
  // Units: t in m, f_d in MPa (MN/m²), so N_Rd in MN/m = * 1000 to get kN/m
  const n_Rd = phi_final * t_m * f_d * 1000; // kN/m
  const utilizationMauer = verticalLoad / n_Rd;

  // --- 6. STATE FOR NACHHALTIGKEIT & ÖKOBILANZ ---
  const [co2SubTab, setCo2SubTab] = useState<'karbonatisierung' | 'gwp_vergleich'>('karbonatisierung');
  // Karbonatisierung states:
  const [kFactor, setKFactor] = useState<number>(4.0); // mm/sqrt(a)
  const [durabilityYears, setDurabilityYears] = useState<number>(50); // years
  const [cementGehalt, setCementGehalt] = useState<number>(300); // kg/m³
  const [caoAnteil, setCaoAnteil] = useState<number>(65); // in %
  const [carbGrad, setCarbGrad] = useState<number>(60); // in %
  // GWP states:
  const [bauteilVol, setBauteilVol] = useState<number>(450); // m³
  const [cementGehaltA, setCementGehaltA] = useState<number>(340); // kg/m³
  const [gwpZementA, setGwpZementA] = useState<number>(850); // kg CO2-eq/t
  const [cementGehaltB, setCementGehaltB] = useState<number>(350); // kg/m³
  const [gwpZementB, setGwpZementB] = useState<number>(290); // kg CO2-eq/t

  // Derived values for CO2 Karbonatisierung:
  const carbonationDepth = kFactor * Math.sqrt(durabilityYears); // in mm
  const volumePerM2 = carbonationDepth / 1000; // m³ per m²
  const cementMassPerM2 = volumePerM2 * cementGehalt; // kg
  const caoMassPerM2 = cementMassPerM2 * (caoAnteil / 100); // kg
  const reactedCaoMassPerM2 = caoMassPerM2 * (carbGrad / 100); // kg
  const co2UptakePerM2 = reactedCaoMassPerM2 * (44.0 / 56.1); // kg CO2/m²

  // Derived values for GWP Zement Vergleich:
  const totalCementA = (bauteilVol * cementGehaltA) / 1000; // t
  const totalGwpA = totalCementA * gwpZementA / 1000; // t CO2-eq
  const totalCementB = (bauteilVol * cementGehaltB) / 1000; // t
  const totalGwpB = totalCementB * gwpZementB / 1000; // t CO2-eq
  const deltaGwp = totalGwpA - totalGwpB; // t CO2-eq
  const percentSavings = totalGwpA > 0 ? (deltaGwp / totalGwpA) * 100 : 0;

  // --- 7. STATE FOR BAUEN IM BESTAND ---
  const [bestandSubTab, setBestandSubTab] = useState<'beton' | 'stahl'>('beton');
  // Beton states:
  const [histBetonKlasse, setHistBetonKlasse] = useState<'B100' | 'B150' | 'B225' | 'B300' | 'B450' | 'B600'>('B225');
  const [hasPruefung, setHasPruefung] = useState<boolean>(false);
  const [pruefFestigkeit, setPruefFestigkeit] = useState<number>(28.5); // f_cm,cube,150 in N/mm²
  // Stahl states:
  const [histStahlKlasse, setHistStahlKlasse] = useState<'BSt220' | 'BSt420' | 'BSt500'>('BSt220');
  const [diameterStahl, setDiameterStahl] = useState<number>(12); // mm

  // Derived values for Beton Bestand:
  const beta_WN = {
    B100: 10.0,
    B150: 15.0,
    B225: 22.5,
    B300: 30.0,
    B450: 45.0,
    B600: 60.0
  }[histBetonKlasse];

  // Convert to standard 150mm cube: beta_WN,150 = 0.95 * beta_WN
  const beta_WN_150 = 0.95 * beta_WN;
  // Convert to standard cylinder: f_ck,cyl = 0.8 * beta_WN_150
  const f_ck_cyl_raw = 0.8 * beta_WN_150;
  // Apply DAfStb safety deduct if document-only:
  const f_ck_act = hasPruefung ? 0 : f_ck_cyl_raw - 3.0;

  let f_ck_tested = 8;
  let testedKlasseLabel = 'C8/10';
  if (pruefFestigkeit >= 37) {
    f_ck_tested = 30;
    testedKlasseLabel = 'C30/37';
  } else if (pruefFestigkeit >= 30) {
    f_ck_tested = 25;
    testedKlasseLabel = 'C25/30';
  } else if (pruefFestigkeit >= 25) {
    f_ck_tested = 20;
    testedKlasseLabel = 'C20/25';
  } else if (pruefFestigkeit >= 20) {
    f_ck_tested = 16;
    testedKlasseLabel = 'C16/20';
  } else if (pruefFestigkeit >= 15) {
    f_ck_tested = 12;
    testedKlasseLabel = 'C12/15';
  }

  const f_ck_final = hasPruefung ? f_ck_tested : f_ck_act;
  const f_cd_bestand = 0.85 * (f_ck_final / 1.5);

  // Derived values for Stahl Bestand:
  const f_yk_stahl = {
    BSt220: 220,
    BSt420: 420,
    BSt500: 500
  }[histStahlKlasse];

  const f_yd_stahl = f_yk_stahl / 1.15;
  const steelArea = (Math.PI * Math.pow(diameterStahl, 2)) / 4; // mm²
  const yieldCapacity = (steelArea * f_yd_stahl) / 1000; // kN

  // --- 8. STATE FOR SCHALLSCHUTZ (DIN 4109) ---
  const [schallWandTyp, setSchallWandTyp] = useState<'ks' | 'beton' | 'hlz' | 'porenbeton'>('ks');
  const [schallDicke, setSchallDicke] = useState<number>(17.5); // cm
  const [schallRohdichte, setSchallRohdichte] = useState<number>(2000); // kg/m³
  const [schallPutz, setSchallPutz] = useState<boolean>(true); // 2x 15mm Kalkgipsputz = 40 kg/m²
  const [schallFlanke, setSchallFlanke] = useState<'entkoppelt' | 'massiv' | 'leicht'>('massiv');
  const [schallSollTyp, setSchallSollTyp] = useState<'wohnungstrenn' | 'treppenhaus' | 'behandlung' | 'doppelhaus'>('wohnungstrenn');

  // Calculations Schallschutz
  const schall_m0 = (schallDicke / 100) * schallRohdichte; // kg/m²
  const schall_m_total = schall_m0 + (schallPutz ? 40 : 0); // kg/m²
  // DIN 4109 Massekurve für Massivbauteile: Rw = 32.4 * lg(m') - 26.0 (für m' >= 150 kg/m²)
  const schall_Rw = schall_m_total >= 150 
    ? 32.4 * Math.log10(schall_m_total) - 26.0 
    : 20.0 * Math.log10(Math.max(10, schall_m_total)) - 2.0;
  const schall_KF = schallFlanke === 'entkoppelt' ? 0 : schallFlanke === 'massiv' ? 2 : 4;
  const schall_R_prime_w = Math.max(0, schall_Rw - schall_KF);

  const schall_soll_werte = {
    wohnungstrenn: { erf: 53, label: 'Wohnungstrennwand (DIN 4109-1 Tab. 2)' },
    treppenhaus: { erf: 52, label: 'Treppenraumwand zu Aufenthaltsräumen' },
    behandlung: { erf: 47, label: 'Untersuchungs- & Behandlungsräume' },
    doppelhaus: { erf: 59, label: 'Haustrennwand Doppel-/Reihenhaus (zweischalig)' }
  };
  const schall_erf = schall_soll_werte[schallSollTyp].erf;
  const schall_passed = schall_R_prime_w >= schall_erf;

  // --- 9. STATE FOR BRANDSCHUTZ (EC5 & EC2) ---
  const [brandSubTab, setBrandSubTab] = useState<'holz_abbrand' | 'beton_tabelle'>('holz_abbrand');
  // Holz Abbrand:
  const [holzBreite, setHolzBreite] = useState<number>(18); // cm
  const [holzHoehe, setHolzHoehe] = useState<number>(36); // cm
  const [holzArtBrand, setHolzArtBrand] = useState<'c24' | 'bsh' | 'laubholz'>('bsh');
  const [brandBeanspruchung, setBrandBeanspruchung] = useState<'3_seitig' | '4_seitig'>('3_seitig');
  const [brandDauerMin, setBrandDauerMin] = useState<30 | 60 | 90 | 120>(60);
  const [momentKaltEd, setMomentKaltEd] = useState<number>(45); // kNm

  // Abbrandraten nach DIN EN 1995-1-2 Tab. 3.1
  const beta_char = holzArtBrand === 'bsh' ? 0.70 : holzArtBrand === 'laubholz' ? 0.50 : 0.65; // mm/min
  const d_char_n = beta_char * brandDauerMin; // mm
  const d_ef = d_char_n + 7.0; // mm (Zuschlag k0 * d0 = 7 mm für Holzentfestigung)
  const b_ef_mm = Math.max(10, (holzBreite * 10) - (2 * d_ef)); // beidseitig im Feuer
  const h_ef_mm = Math.max(10, brandBeanspruchung === '4_seitig' ? (holzHoehe * 10) - (2 * d_ef) : (holzHoehe * 10) - d_ef);
  const W_ef_mm3 = (b_ef_mm * Math.pow(h_ef_mm, 2)) / 6;
  const f_mk_brand = holzArtBrand === 'bsh' ? 28 : holzArtBrand === 'laubholz' ? 30 : 24; // N/mm²
  const k_fi = 1.15; // Beiwert für 20%-Fraktil im Brandfall
  const f_m_fi_d = (1.0 * k_fi * f_mk_brand) / 1.0; // gamma_M,fi = 1.0
  const M_fi_Rd = (W_ef_mm3 * f_m_fi_d) / 1000000; // kNm
  const M_fi_Ed = 0.60 * momentKaltEd; // Reduktionsbeiwert eta_fi approx 0.60 nach EC5
  const eta_brand_holz = M_fi_Rd > 0 ? M_fi_Ed / M_fi_Rd : 999;
  const brand_holz_passed = eta_brand_holz <= 1.0;

  // Beton Brand:
  const [betonBauteilBrand, setBetonBauteilBrand] = useState<'balken' | 'stuetze'>('balken');
  const [betonBrandKlasse, setBetonBrandKlasse] = useState<'R30' | 'R60' | 'R90' | 'R120'>('R90');

  return (
    <div className="flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Calculator className="text-shiraz" /> Interaktive Beispielrechnungen Schritt für Schritt
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Verstehen Sie bautechnische Nachweise und physikalische Berechnungsmodelle durch interaktives Ausprobieren. 
            Jedes Untermodul erklärt <strong>was</strong>, <strong>wie</strong> und <strong>warum</strong> berechnet wird, 
            nennt die normativen Quellen und bewertet das Ergebnis live basierend auf Ihren Eingaben.
          </p>
        </div>

        {/* TAB NAVIGATION */}
        {!forceTab && (
          <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
            <button
              onClick={() => setActiveTab('u_wert')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                activeTab === 'u_wert' 
                  ? 'bg-shiraz text-white border-shiraz shadow-md' 
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
              }`}
            >
              <Layers size={16} /> a) Bauphysik: U-Wert
            </button>
            <button
              onClick={() => setActiveTab('beton')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                activeTab === 'beton' 
                  ? 'bg-shiraz text-white border-shiraz shadow-md' 
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
              }`}
            >
              <BookOpen size={16} /> b) Beton: Mischungsentwurf
            </button>
            <button
              onClick={() => setActiveTab('stahlbeton')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                activeTab === 'stahlbeton' 
                  ? 'bg-shiraz text-white border-shiraz shadow-md' 
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
              }`}
            >
              <Sliders size={16} /> c) Massivbau: Biegung im GZT
            </button>
            <button
              onClick={() => setActiveTab('holzbau')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                activeTab === 'holzbau' 
                  ? 'bg-shiraz text-white border-shiraz shadow-md' 
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
              }`}
            >
              <Scale size={16} /> d) Holzbau: Stützenknicken
            </button>
            <button
              onClick={() => setActiveTab('mauerwerk')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                activeTab === 'mauerwerk' 
                  ? 'bg-shiraz text-white border-shiraz shadow-md' 
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
              }`}
            >
              <Settings size={16} /> e) Mauerwerk: Tragfähigkeit
            </button>
            <button
              onClick={() => setActiveTab('nachhaltigkeit')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                activeTab === 'nachhaltigkeit' 
                  ? 'bg-shiraz text-white border-shiraz shadow-md' 
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
              }`}
            >
              <Leaf size={16} /> f) Nachhaltigkeit & Ökobilanz
            </button>
            <button
              onClick={() => setActiveTab('bestand')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                activeTab === 'bestand' 
                  ? 'bg-shiraz text-white border-shiraz shadow-md' 
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
              }`}
            >
              <History size={16} /> g) Bauen im Bestand
            </button>
            <button
              onClick={() => setActiveTab('schallschutz')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                activeTab === 'schallschutz' 
                  ? 'bg-shiraz text-white border-shiraz shadow-md' 
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
              }`}
            >
              <Volume2 size={16} /> h) Bauakustik: Schallschutz
            </button>
            <button
              onClick={() => setActiveTab('brandschutz')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                activeTab === 'brandschutz' 
                  ? 'bg-shiraz text-white border-shiraz shadow-md' 
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
              }`}
            >
              <Flame size={16} /> i) Brandschutz: Heißbemessung
            </button>
          </div>
        )}

        {/* --- 1. TAB CONTENT: U-WERT --- */}
        {activeTab === 'u_wert' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <Layers className="text-shiraz" size={18} />
                <span>Wärmedurchgangskoeffizient (U-Wert) einer gedämmten Betonwand</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                <strong>Was?</strong> Berechnet wird der Wärmedurchgangskoeffizient <InlineMath math="U" /> einer mehrschichtigen Wandkonstruktion in <InlineMath math="\text{W/(m}^2\text{K)}" />. <br />
                <strong>Warum?</strong> Der U-Wert beschreibt den stationären Wärmestrom durch ein Bauteil bei einer Temperaturdifferenz von 1 Kelvin. Ein kleinerer Wert bedeutet eine bessere Wärmedämmung. Er ist das fundamentale Kriterium zur Begrenzung von Transmissionswärmeverlusten nach dem <strong>Gebäudeenergiegesetz (GEG)</strong>. <br />
                <strong>Wie?</strong> Durch die Addition der inneren und äußeren Wärmeübergangswiderstände <InlineMath math="R_{si}" /> und <InlineMath math="R_{se}" /> mit den Wärmedurchlasswiderständen der einzelnen Baustoffschichten <InlineMath math="R_i = d_i / \lambda_i" />.
              </p>
            </div>

            {/* INTERACTIVE CONTROLS */}
            <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
              <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders size={14} className="text-shiraz" /> Parameter anpassen (Echtzeit-Nachweis)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Layer 1: Concrete */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xxs font-bold text-slate-400 uppercase tracking-wide block">Schicht 1: Normalbeton</span>
                  <label className="text-xs text-text-main/80 block font-normal">Dicke <InlineMath math="d_1" /> (cm):</label>
                  <input 
                    type="range" min="10" max="40" step="5"
                    value={uConcreteThick}
                    onChange={(e) => setUConcreteThick(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                    <span>{formatDeWert(uConcreteThick)} cm</span>
                    <span><InlineMath math="\lambda_1 = 2{,}3 \, \text{W/(mK)}" /></span>
                  </div>
                </div>

                {/* Layer 2: Insulation */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xxs font-bold text-slate-400 uppercase tracking-wide block">Schicht 2: EPS-Dämmung</span>
                  <label className="text-xs text-text-main/80 block font-normal">Dicke <InlineMath math="d_2" /> (cm):</label>
                  <input 
                    type="range" min="0" max="30" step="2"
                    value={uInsuThick}
                    onChange={(e) => setUInsuThick(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                    <span>{formatDeWert(uInsuThick)} cm</span>
                    <span><InlineMath math="\lambda_2 = 0{,}035 \, \text{W/(mK)}" /></span>
                  </div>
                </div>

                {/* Layer 3: Plaster */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xxs font-bold text-slate-400 uppercase tracking-wide block">Schicht 3: Kalkgipsputz</span>
                  <label className="text-xs text-text-main/80 block font-normal">Dicke <InlineMath math="d_3" /> (cm):</label>
                  <input 
                    type="range" min="0.5" max="3.0" step="0.5"
                    value={uPlasterThick}
                    onChange={(e) => setUPlasterThick(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                    <span>{formatDeWert(uPlasterThick)} cm</span>
                    <span><InlineMath math="\lambda_3 = 0{,}70 \, \text{W/(mK)}" /></span>
                  </div>
                </div>

              </div>
            </div>

            {/* STEP-BY-STEP CALCULATION DETAILS */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                Schritt-für-Schritt Berechnung gemäß DIN EN ISO 6946
              </h4>

              <div className="space-y-3.5 text-xs text-text-main/80 leading-relaxed font-normal">
                <div>
                  <strong>Schritt 1: Wärmeübergangswiderstände festlegen</strong>
                  <p className="mt-1">
                    Nach DIN EN ISO 6946 werden für horizontale Wärmeströme durch Außenwände folgende Standardwerte angesetzt:
                  </p>
                  <BlockMath math="R_{si} = 0{,}13 \, \text{m}^2\text{K/W} \quad \text{(Wärmeübergang Innen)}" />
                  <BlockMath math="R_{se} = 0{,}04 \, \text{m}^2\text{K/W} \quad \text{(Wärmeübergang Außen)}" />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 2: Wärmedurchlasswiderstände der Baustoffschichten berechnen</strong>
                  <p className="mt-1">
                    Die Einzelwiderstände <InlineMath math="R_i" /> ergeben sich aus <InlineMath math="R_i = d_i / \lambda_i" /> (mit Dicke <InlineMath math="d_i" /> in Metern):
                  </p>
                  <div className="space-y-2 mt-2 bg-slate-50 p-3 rounded-lg font-mono text-xxs border border-home-grau/20">
                    <p>• Schicht 1 (Normalbeton): R₁ = <span className="text-shiraz font-bold">{formatDeZahl((uConcreteThick/100), 2)}</span> m / {formatDeZahl(uConcreteLambda, 2)} W/(mK) = <span className="text-shiraz font-bold">{formatDeZahl(R_concrete, 4)}</span> m²K/W</p>
                    <p>• Schicht 2 (EPS-Dämmung): R₂ = <span className="text-shiraz font-bold">{formatDeZahl((uInsuThick/100), 2)}</span> m / {formatDeZahl(uInsuLambda, 3)} W/(mK) = <span className="text-shiraz font-bold">{formatDeZahl(R_insulation, 4)}</span> m²K/W</p>
                    <p>• Schicht 3 (Kalkgipsputz): R₃ = <span className="text-shiraz font-bold">{formatDeZahl((uPlasterThick/100), 3)}</span> m / {formatDeZahl(uPlasterLambda, 2)} W/(mK) = <span className="text-shiraz font-bold">{formatDeZahl(R_plaster, 4)}</span> m²K/W</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 3: Gesamtwärmedurchlasswiderstand R_T aufsummieren</strong>
                  <BlockMath math={`R_T = R_{si} + R_1 + R_2 + R_3 + R_{se}`} />
                  <BlockMath math={`R_T = 0{,}13 + \\color{#A3113E}{${formatDeTeX(R_concrete, 4)}} + \\color{#A3113E}{${formatDeTeX(R_insulation, 4)}} + \\color{#A3113E}{${formatDeTeX(R_plaster, 4)}} + 0{,}04 = \\color{#A3113E}{${formatDeTeX(R_T, 4)}} \\, \\text{m}^2\\text{K/W}`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 4: Wärmedurchgangskoeffizient U ermitteln</strong>
                  <p className="mt-1">Der Kehrwert des Gesamtwiderstands liefert den gesuchten U-Wert:</p>
                  <BlockMath math={`U = \\frac{1}{R_T} = \\frac{1}{\\color{#A3113E}{${formatDeTeX(R_T, 4)}}} = \\color{#A3113E}{${formatDeTeX(U_value, 4)}} \\, \\text{W/(m}^2\\text{K)}`} />
                </div>
              </div>
            </div>

            {/* RESULTS EVALUATION */}
            <div className={`p-5 rounded-2xl border text-xs leading-relaxed flex flex-col md:flex-row gap-4 items-start md:items-center ${
              U_value <= gegLimit 
                ? 'bg-green-50 border-green-200 text-green-900' 
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <div className="p-3 rounded-xl bg-white border self-start md:self-center">
                {U_value <= gegLimit ? (
                  <CheckCircle2 className="text-green-600 animate-bounce" size={32} />
                ) : (
                  <AlertTriangle className="text-red-600 animate-pulse" size={32} />
                )}
              </div>
              <div className="space-y-1 flex-1 font-normal">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm">Ergebnisbewertung &amp; Interpretation:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-xxs tracking-wider uppercase ${
                    U_value <= gegLimit ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                  }`}>
                    {U_value <= gegLimit ? 'Bestanden (GEG-konform)' : 'Nicht bestanden (Gegen GEG)'}
                  </span>
                </div>
                <p>
                  Ihr berechneter U-Wert beträgt <strong>{formatDeZahl(U_value, 3)} W/(m²K)</strong>. 
                  Das Gebäudeenergiegesetz (GEG), Anlage 7 fordert bei nachträglicher Sanierung oder Neuerrichtung von Außenwänden einen maximalen U-Wert von <strong>0,24 W/(m²K)</strong>.
                </p>
                <p className="text-xxs opacity-90 mt-1">
                  {U_value <= gegLimit 
                    ? 'Die Dämmstoffstärke ist energetisch ausreichend dimensioniert. Das Risiko von Oberflächenkondensat an der Innenseite bei üblichen Raumklimaten (20°C, 50% r.F.) ist extrem gering, wodurch Schimmelpilzbildung konstruktiv unterbunden wird.'
                    : 'Die Dämmwirkung ist unzureichend. Erhöhen Sie die Dicke der EPS-Dämmung (Schicht 2) im interaktiven Regler auf mindestens 14 cm, um den Mindestwärmeschutz einzuhalten und Tauwasserausfall zu verhindern.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. TAB CONTENT: BETON TECHNOLOGIE --- */}
        {activeTab === 'beton' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* SUB-NAVIGATION FOR BETON CALCULATIONS */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-home-grau/20">
              <button
                type="button"
                className={`px-3 py-2 rounded-xl font-bold text-xs transition-all border shadow-sm cursor-pointer ${
                  betonSubTab === 'mischung'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
                onClick={() => setBetonSubTab('mischung')}
              >
                Mischungsentwurf (Stoffraum)
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-xl font-bold text-xs transition-all border shadow-sm cursor-pointer ${
                  betonSubTab === 'k_wert'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
                onClick={() => setBetonSubTab('k_wert')}
              >
                k-Wert-Ansatz (Zusatzstoffe)
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-xl font-bold text-xs transition-all border shadow-sm cursor-pointer ${
                  betonSubTab === 'temperatur'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
                onClick={() => setBetonSubTab('temperatur')}
              >
                Frischbetontemperatur
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-xl font-bold text-xs transition-all border shadow-sm cursor-pointer ${
                  betonSubTab === 'festigkeit'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
                onClick={() => setBetonSubTab('festigkeit')}
              >
                Festigkeitsentwicklung
              </button>
            </div>

            {/* A. MISCHUNGSENTWURF */}
            {betonSubTab === 'mischung' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="text-shiraz" size={18} />
                    <span>Normativer Mischungsentwurf für Frischbeton (Stoffraumberechnung)</span>
                  </h3>
                  <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                    <strong>Was?</strong> Berechnet wird die detaillierte Materialrezeptur für <InlineMath math="1 \, \text{m}^3" /> verdichteten Frischbeton unter Berücksichtigung von Expositionsklassen, Konsistenz und Zielsieblinien. <br />
                    <strong>Warum?</strong> Eine genaue Stoffraumberechnung stellt sicher, dass das angenommene Betonvolumen hohlraumfrei verdichtet genau <InlineMath math="1000 \, \text{dm}^3" /> ausfüllt. So werden Abweichungen in der Frischbetondichte und Fehlmengen auf der Baustelle vermieden. <br />
                    <strong>Wie?</strong> Über das <strong>Absolutvolumen-Verfahren</strong> nach DIN 1045-2 (Gleichung des dichten Gefüges).
                  </p>
                </div>

                {/* INTERACTIVE CONTROLS */}
                <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
                  <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sliders size={14} className="text-shiraz" /> Expositions- und Baustoffklasse wählen
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    
                    {/* Exposure Class */}
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <label className="font-bold text-slate-700 block">Expositionsklasse:</label>
                      <p className="text-[10px] text-text-main/70 mb-2">Bestimmt max. w/z-Wert &amp; Mindestzementgehalt</p>
                      <select 
                        value={targetExposure} 
                        onChange={(e) => setTargetExposure(e.target.value as 'XC4' | 'XD3')}
                        className="w-full p-2 rounded-lg border border-slate-200 font-bold text-xs"
                      >
                        <option value="XC4">XC4 (Außenbauteile mit Bewehrung)</option>
                        <option value="XD3">XD3 (Brückenkappen - Chloride)</option>
                      </select>
                    </div>

                    {/* Consistency */}
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <label className="font-bold text-slate-700 block">Konsistenzklasse:</label>
                      <p className="text-[10px] text-text-main/70 mb-2">Bestimmt den Richtwert für Wasseranspruch</p>
                      <select 
                        value={consClass} 
                        onChange={(e) => setConsClass(e.target.value as 'F2' | 'F3' | 'F4')}
                        className="w-full p-2 rounded-lg border border-slate-200 font-bold text-xs"
                      >
                        <option value="F2">F2 (steifplastisch / plastisch)</option>
                        <option value="F3">F3 (regelKonsistenz / weich)</option>
                        <option value="F4">F4 (sehr weich)</option>
                      </select>
                    </div>

                    {/* Max Grain Size */}
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <label className="font-bold text-slate-700 block">Größtkorn Aggregat:</label>
                      <p className="text-[10px] text-text-main/70 mb-2">Große Gesteinskörnung mindert Wasserbedarf</p>
                      <div className="flex gap-2 mt-1">
                        <button 
                          type="button"
                          onClick={() => setMaxGrainSize(16)}
                          className={`flex-1 py-1.5 rounded-lg font-bold border ${maxGrainSize === 16 ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700 border-slate-200'}`}
                        >
                          16 mm
                        </button>
                        <button 
                          type="button"
                          onClick={() => setMaxGrainSize(32)}
                          className={`flex-1 py-1.5 rounded-lg font-bold border ${maxGrainSize === 32 ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700 border-slate-200'}`}
                        >
                          32 mm
                        </button>
                      </div>
                    </div>

                    {/* Info Display */}
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xxs leading-relaxed font-normal text-slate-600">
                      <span className="font-bold text-slate-800 block text-xs mb-1">Randbedingungen DIN 1045-2:</span>
                      <div>• Maximaler <InlineMath math="(w/z)_{max}" />: <strong className="text-shiraz font-black">{formatDeZahl(maxWz, 2)}</strong></div>
                      <div>• Mindestzement <InlineMath math="z_{min}" />: <strong className="text-slate-800 font-bold">{minCement} kg/m³</strong></div>
                      <div>• Angenommene Reindichte Zement: <strong>3,10 kg/dm³</strong></div>
                    </div>

                  </div>
                </div>

                {/* STEP-BY-STEP RECIPE CALCULATION */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                    Stoffraumberechnung (Absolutvolumen) Schritt für Schritt
                  </h4>

                  <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
                    <div>
                      <strong>Schritt 1: Wasser- und Zementgehalt bestimmen</strong>
                      <p className="mt-1">
                        Der Wasserbedarf richtet sich nach dem Größtkorn und der Konsistenzklasse (Erfahrungswerte nach DBV): <br />
                        Für Konsistenz <span className="text-shiraz font-bold">{consClass}</span> und Größtkorn <span className="text-shiraz font-bold">dmax = {maxGrainSize} mm</span> ergibt sich ein Wasseranspruch von:
                      </p>
                      <BlockMath math={`w = \\color{#A3113E}{${waterDemand}} \\, \\text{l/m}^3 \\quad (\\approx \\color{#A3113E}{${waterDemand}} \\, \\text{kg/m}^3)`} />
                      <p className="mt-1">
                        Die erforderliche Zementmenge <InlineMath math="c" /> ergibt sich aus dem maximal zulässigen <InlineMath math="w/z" />-Verhältnis der Expositionsklasse <span className="text-shiraz font-bold">{targetExposure}</span>:
                      </p>
                      <BlockMath math={`c_{\\text{erf}} = \\frac{w}{(w/z)_{max}} = \\frac{\\color{#A3113E}{${waterDemand}}}{\\color{#A3113E}{${formatDeTeX(maxWz, 2)}}} = \\color{#A3113E}{${formatDeTeX(cementFromWz, 1)}} \\, \\text{kg/m}^3`} />
                      <p className="mt-1">
                        Da <InlineMath math={`c_{\\text{erf}} = ${formatDeTeX(cementFromWz, 1)} \\, \\text{kg/m}^3`} /> mit dem normativen Mindestzementgehalt <InlineMath math={`z_{min} = ${minCement} \\, \\text{kg/m}^3`} /> abgeglichen werden muss, wählen wir:
                      </p>
                      <BlockMath math={`c = \\max(c_{\\text{erf}}, z_{min}) = \\color{#A3113E}{${cementContent}} \\, \\text{kg/m}^3`} />
                      <p className="mt-1">Daraus resultiert das tatsächliche (wirksame) w/z-Verhältnis:</p>
                      <BlockMath math={`(w/z)_{\\text{tats}} = \\frac{w}{c} = \\frac{\\color{#A3113E}{${waterDemand}}}{\\color{#A3113E}{${cementContent}}} = \\color{#A3113E}{${formatDeTeX(actualWz, 3)}}`} />
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <strong>Schritt 2: Stoffraumbilanz für Gesteinskörnung aufstellen</strong>
                      <p className="mt-1">
                        Nach der Gleichung für dichten Frischbeton addieren sich die Absolutvolumina der festen, flüssigen und gasförmigen Bestandteile auf <InlineMath math="1000 \, \text{dm}^3" /> pro Kubikmeter:
                      </p>
                      <BlockMath math={`V_c + V_w + V_{\\text{air}} + V_a = 1000 \\, \\text{dm}^3`} />
                      <p className="mt-1">Wir berechnen die bekannten Volumenanteile:</p>
                      <div className="space-y-1 bg-slate-50 p-3 rounded-lg font-mono text-xxs border border-home-grau/20">
                        <p>• Zementvolumen: V_c = c / ρ_c = <span className="text-shiraz font-bold">{formatDeWert(cementContent)}</span> kg / 3,10 kg/dm³ = <span className="text-shiraz font-bold">{formatDeZahl(V_c, 2)}</span> dm³</p>
                        <p>• Wasservolumen: V_w = w / ρ_w = <span className="text-shiraz font-bold">{waterDemand}</span> kg / 1,00 kg/dm³ = <span className="text-shiraz font-bold">{formatDeZahl(V_w, 2)}</span> dm³</p>
                        <p>• Verdichtungsporen (1,5% Luft): V_air = {V_air} dm³</p>
                      </div>
                      <p className="mt-2">Das verbleibende Restvolumen entfällt vollständig auf die Gesteinskörnung (Zuschlag) <InlineMath math="V_a" />:</p>
                      <BlockMath math={`V_a = 1000 - (\\color{#A3113E}{${formatDeTeX(V_c, 2)}} + \\color{#A3113E}{${formatDeTeX(V_w, 2)}} + ${V_air}) = \\color{#A3113E}{${formatDeTeX(V_a, 2)}} \\, \\text{dm}^3`} />
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <strong>Schritt 3: Masse der Gesteinskörnung ermitteln</strong>
                      <p className="mt-1">Unter Annahme einer mittleren Gesteinsreindichte von <InlineMath math="\rho_a = 2{,}65 \, \text{kg/dm}^3" />:</p>
                      <BlockMath math={`m_a = V_a \\cdot \\rho_a = \\color{#A3113E}{${formatDeTeX(V_a, 2)}} \\cdot 2{,}65 = \\color{#A3113E}{${formatDeTeX(aggregateMass, 1)}} \\, \\text{kg/m}^3`} />
                    </div>
                  </div>
                </div>

                {/* RECIPE SUMMARY */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">
                    Zusammenfassung der Betonrezeptur (Soll-Werte für Mischer)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-xxs text-slate-400 block font-normal">Zement CEM I</span>
                      <strong className="text-sm text-slate-800">{formatDeWert(cementContent)} kg</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-xxs text-slate-400 block font-normal">Wasser (wirksam)</span>
                      <strong className="text-sm text-slate-800">{waterDemand} l</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-xxs text-slate-400 block font-normal">Gesteinskörnung</span>
                      <strong className="text-sm text-slate-800">{formatDeZahl(aggregateMass, 1)} kg</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-xxs text-slate-400 block font-normal">Frischbetondichte</span>
                      <strong className="text-sm text-shiraz">{formatDeZahl(freshConcreteDensity, 1)} kg/m³</strong>
                    </div>
                  </div>

                  <div className="text-xxs font-normal text-slate-500 mt-4 leading-relaxed bg-white/50 p-2.5 rounded-lg border border-slate-200/50">
                    <strong>Bewertung:</strong> Das tatsächliche w/z-Verhältnis von <strong>{formatDeZahl(actualWz, 3)}</strong> hält den Grenzwert von <strong>{formatDeZahl(maxWz, 2)}</strong> sicher ein. 
                    Die berechnete Frischbetondichte liegt mit {formatDeZahl(freshConcreteDensity, 0)} kg/m³ im typischen Bereich für Normalbeton (2000 bis 2600 kg/m³ nach DIN EN 206). 
                    Diese Rezeptur stellt sicher, dass der Beton nach dem Erhärten das erforderliche Porengefüge aufweist, um dem Frostangriff (XC4/XD3) dauerhaft zu widerstehen.
                  </div>
                </div>
              </div>
            )}

            {/* B. K-WERT-ANSATZ */}
            {betonSubTab === 'k_wert' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="text-shiraz" size={18} />
                    <span>k-Wert-Ansatz für Zusatzstoffe nach DIN EN 206</span>
                  </h3>
                  <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                    <strong>Was?</strong> Berechnet die Anrechenbarkeit von reaktiven mineralischen Zusatzstoffen (Zusatzstoffe vom Typ II) wie Flugasche oder Silikastaub auf das wirksame Wasser-Zement-Verhältnis. <br />
                    <strong>Warum?</strong> Die Verwertung von Flugasche schont Ressourcen und verringert das Porenvolumen sowie die Hydratationswärme des Betons. Die Norm gestattet daher die bilanzielle Erhöhung des Zementvolumens um einen Faktor <InlineMath math="k \cdot f" />. <br />
                    <strong>Wie?</strong> Über die Ermittlung der maximal zulässigen Anrechenbarkeit <InlineMath math="f_{max} = \text{Anteil} \cdot c" /> und Bildung des äquivalenten Wasser-Zement-Wertes <InlineMath math="(w/z)_{eq} = \frac{w}{c + k \cdot f_{anr}}" />.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* CONTROLS */}
                  <div className="md:col-span-1 bg-slate-50/50 p-4 rounded-xl border border-home-grau/30 space-y-4">
                    <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Parameter einstellen</h4>
                    
                    {/* Additive Type */}
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <label className="font-bold text-slate-700 block">Zusatzstoff Typ II:</label>
                      <select 
                        value={kAddType} 
                        onChange={(e) => {
                          const type = e.target.value as 'flugasche' | 'silikastaub';
                          setKAddType(type);
                          setKAddition(type === 'flugasche' ? 60 : 25);
                        }}
                        className="w-full p-2 rounded-lg border border-slate-200 font-bold text-xs"
                      >
                        <option value="flugasche">Flugasche (k = 0,4)</option>
                        <option value="silikastaub">Silikastaub (k = 2,0)</option>
                      </select>
                    </div>

                    {/* Cement content */}
                    <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs text-text-main/80 block font-bold">Zementgehalt <InlineMath math="c" /> (kg/m³):</label>
                      <input 
                        type="range" min="200" max="450" step="10"
                        value={kCement}
                        onChange={(e) => setKCement(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <div className="text-xxs text-text-main/70 font-mono text-right">{formatDeWert(kCement)} kg/m³</div>
                    </div>

                    {/* Addition content */}
                    <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs text-text-main/80 block font-bold">Zusatzstoffmenge <InlineMath math="f" /> (kg/m³):</label>
                      <input 
                        type="range" min="0" max="150" step="5"
                        value={kAddition}
                        onChange={(e) => setKAddition(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <div className="text-xxs text-text-main/70 font-mono text-right">{formatDeWert(kAddition)} kg/m³</div>
                    </div>

                    {/* Water content */}
                    <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs text-text-main/80 block font-bold">Wassergehalt <InlineMath math="w" /> (l/m³):</label>
                      <input 
                        type="range" min="120" max="220" step="5"
                        value={kWater}
                        onChange={(e) => setKWater(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <div className="text-xxs text-text-main/70 font-mono text-right">{formatDeWert(kWater)} l/m³</div>
                    </div>
                  </div>

                  {/* STEP-BY-STEP */}
                  <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                    <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Rechnerischer Nachweis</h4>
                    
                    <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
                      <div>
                        <strong>Schritt 1: k-Beiwert und Anrechnungsgrenze ermitteln</strong>
                        <p className="mt-1">
                          Für <span className="text-shiraz font-bold">{kAddType === 'flugasche' ? 'Flugasche' : 'Silikastaub'}</span> ist normativ ein k-Beiwert von <InlineMath math={`k = ${formatDeTeXWert(k_factor)}`} /> vorgegeben. 
                          Die maximale anrechenbare Menge beträgt das <InlineMath math={`${formatDeTeX((k_max_ratio*100), 0)}\\%`} /> des Zementgehalts (bei CEM I):
                        </p>
                        <BlockMath math={`f_{max} = ${k_max_ratio} \\cdot c = ${k_max_ratio} \\cdot \\color{#A3113E}{${kCement}} = \\color{#A3113E}{${formatDeTeX(k_max_allowed_addition, 1)}} \\, \\text{kg/m}^3`} />
                        <p className="mt-1">
                          Die anrechenbare Zusatzstoffmenge <InlineMath math="f_{anr}" /> ergibt sich als Minimum aus der tatsächlichen Zugabe und der Begrenzung:
                        </p>
                        <BlockMath math={`f_{anr} = \\min(f, f_{max}) = \\min(\\color{#A3113E}{${kAddition}}, \\color{#A3113E}{${formatDeTeX(k_max_allowed_addition, 1)}}) = \\color{#A3113E}{${formatDeTeX(k_credited_addition, 1)}} \\, \\text{kg/m}^3`} />
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <strong>Schritt 2: Äquivalenten Wasser-Zement-Wert berechnen</strong>
                        <p className="mt-1">
                          Die klassische w/z-Zahl beträgt:
                        </p>
                        <BlockMath math={`w/z = \\frac{w}{c} = \\frac{\\color{#A3113E}{${kWater}}}{\\color{#A3113E}{${kCement}}} = \\color{#A3113E}{${formatDeTeX(k_w_z_pure, 3)}}`} />
                        <p className="mt-1">
                          Durch Anrechnung des Zusatzstoffs ergibt sich das wirksame äquivalente Wasser-Zement-Verhältnis <InlineMath math="(w/z)_{eq}" />:
                        </p>
                        <BlockMath math={`(w/z)_{eq} = \\frac{w}{c + k \\cdot f_{anr}} = \\frac{\\color{#A3113E}{${kWater}}}{\\color{#A3113E}{${kCement}} + ${k_factor} \\cdot \\color{#A3113E}{${formatDeTeX(k_credited_addition, 1)}}} = \\color{#A3113E}{${formatDeTeX(k_w_z_eq, 3)}}`} />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                      <span className="text-xxs font-bold text-slate-400 block uppercase tracking-wide mb-1">Ergebnis und Einsparung</span>
                      <p className="text-xs font-normal">
                        Ihr äquivalenter Wasser-Zement-Wert sinkt um <strong className="text-shiraz">{formatDeZahl(Math.max(0, k_w_z_pure - k_w_z_eq), 3)}</strong> von <span className="text-shiraz font-bold">{formatDeZahl(k_w_z_pure, 3)}</span> auf <strong className="text-shiraz">{formatDeZahl(k_w_z_eq, 3)}</strong>. 
                        Dies entspricht rechnerisch einer fiktiven Zementeinsparung von ca. <strong className="text-shiraz">{formatDeZahl((k_factor * k_credited_addition), 1)} kg</strong> Portlandzement-Klinker pro Kubikmeter Beton bei identischer hydratationschemischer Wirksamkeit!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* C. FRISCHBETONTEMPERATUR */}
            {betonSubTab === 'temperatur' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="text-shiraz" size={18} />
                    <span>Berechnung der Frischbetontemperatur (Winter- & Sommerbetonieren)</span>
                  </h3>
                  <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                    <strong>Was?</strong> Berechnet die Mischtemperatur des Frischbetons aus den Einzel-Eingangstemperaturen von Zement, Gesteinskörnung, Wasser und eventueller Eisbeigabe. <br />
                    <strong>Warum?</strong> Bei kaltem Wetter (Winterbaustellen) darf Beton beim Einbringen nicht einfrieren (<InlineMath math="T_b \ge +5\,^\circ\text{C}" />). Bei heißem Wetter beschleunigt Hitze die Hydratation und führt zu thermischen Rissen (<InlineMath math="T_b \le +30\,^\circ\text{C}" />). <br />
                    <strong>Wie?</strong> Über eine thermodynamische Mischungsrechnung (Energiebilanz unter Berücksichtigung der spezifischen Wärmekapazitäten und der Schmelzenthalpie von Eis).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* CONTROLS */}
                  <div className="md:col-span-1 bg-slate-50/50 p-4 rounded-xl border border-home-grau/30 space-y-4">
                    <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Temperaturen &amp; Mengen</h4>
                    
                    {/* Aggregate Temp */}
                    <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                      <label className="text-xs text-text-main/80 block font-bold">Gesteinskörnung <InlineMath math="T_A" /> (°C):</label>
                      <input 
                        type="range" min="-10" max="35" step="1"
                        value={tempAggregate}
                        onChange={(e) => setTempAggregate(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                        <span>{formatDeWert(mAggregateInput)} kg</span>
                        <span className="font-bold text-shiraz">{formatDeWert(tempAggregate)} °C</span>
                      </div>
                    </div>

                    {/* Cement Temp */}
                    <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                      <label className="text-xs text-text-main/80 block font-bold">Zement <InlineMath math="T_C" /> (°C):</label>
                      <input 
                        type="range" min="0" max="60" step="2"
                        value={tempCement}
                        onChange={(e) => setTempCement(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                        <span>{formatDeWert(mCementInput)} kg</span>
                        <span className="font-bold text-shiraz">{formatDeWert(tempCement)} °C</span>
                      </div>
                    </div>

                    {/* Water Temp */}
                    <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                      <label className="text-xs text-text-main/80 block font-bold">Anmachwasser <InlineMath math="T_W" /> (°C):</label>
                      <input 
                        type="range" min="2" max="80" step="2"
                        value={tempWater}
                        onChange={(e) => setTempWater(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                        <span>{formatDeWert(mWaterInput)} l</span>
                        <span className="font-bold text-shiraz">{formatDeWert(tempWater)} °C</span>
                      </div>
                    </div>

                    {/* Flake Ice Option */}
                    <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-text-main/80 block font-bold">Schuppeneis <InlineMath math="m_{Eis}" /> (kg):</label>
                        <span className="text-[10px] text-slate-400 font-bold">Ersetzt Wasser</span>
                      </div>
                      <input 
                        type="range" min="0" max="50" step="5"
                        value={mIceInput}
                        onChange={(e) => setMIceInput(Math.min(e.target.value as any, mWaterInput))}
                        className="w-full accent-shiraz"
                      />
                      <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                        <span>Melting latent: 334 kJ/kg</span>
                        <span className="font-bold text-shiraz">{formatDeWert(mIceInput)} kg</span>
                      </div>
                    </div>
                  </div>

                  {/* CALCULATION AND VISUALIZATION */}
                  <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                    <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Thermodynamische Mischungsrechnung</h4>
                    
                    <div className="space-y-3.5 text-xs text-text-main/80 leading-relaxed font-normal">
                      <div>
                        <strong>Mischformel nach Energiebilanz (Referenz 0 °C):</strong>
                        <p className="mt-1">
                          Die Enthalpiebeträge ergeben sich aus Masse <InlineMath math="m_i" />, Temperatur <InlineMath math="T_i" /> und spezifischer Wärme <InlineMath math="c_i" />:
                        </p>
                        <div className="bg-slate-50 p-2.5 rounded-lg space-y-1 font-mono text-xxs my-2 border border-home-grau/20">
                          <p>• Gestein: {formatDeWert(mAggregateInput)} kg · 0,84 kJ/(kg·K) · <span className="text-shiraz font-bold">{formatDeWert(tempAggregate)}</span>°C = <span className="text-shiraz font-bold">{formatDeZahl(heat_agg, 0)}</span> kJ</p>
                          <p>• Zement: {formatDeWert(mCementInput)} kg · 0,84 kJ/(kg·K) · <span className="text-shiraz font-bold">{formatDeWert(tempCement)}</span>°C = <span className="text-shiraz font-bold">{formatDeZahl(heat_cement, 0)}</span> kJ</p>
                          <p>• Flüssiges Wasser: <span className="text-shiraz font-bold">{formatDeWert(mLiquidWater)}</span> kg · 4,18 kJ/(kg·K) · <span className="text-shiraz font-bold">{formatDeWert(tempWater)}</span>°C = <span className="text-shiraz font-bold">{formatDeZahl(heat_liquid_water, 0)}</span> kJ</p>
                          {mIceInput > 0 && (
                            <p className="text-blue-600 font-bold">• Schmelzwärme Eis: -(<span className="text-shiraz">{formatDeWert(mIceInput)}</span> kg · 334 kJ/kg) = <span className="text-shiraz">{formatDeZahl(heat_ice_melting, 0)}</span> kJ</p>
                          )}
                          <p className="border-t border-slate-200 pt-1 font-bold">Summe der Enthalpien Q = <span className="text-shiraz font-bold">{formatDeZahl(total_heat, 0)}</span> kJ</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <strong>Berechnung der Frischbetontemperatur <InlineMath math="T_{Beton}" />:</strong>
                        <BlockMath math={`T_B = \\frac{\\sum Q}{\\sum (m_i \\cdot c_i)} = \\frac{\\color{#A3113E}{${formatDeTeX(total_heat, 0)}} \\, \\text{kJ}}{${formatDeTeX(total_heat_capacity, 0)} \\, \\text{kJ/K}} = \\color{#A3113E}{${formatDeTeX(finalFreshTemp, 1)}} \\, ^\\circ\\text{C}`} />
                      </div>
                    </div>

                    {/* EVALUATION GRAPHIC */}
                    <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs leading-relaxed ${
                      finalFreshTemp < 5 ? 'bg-blue-50 border-blue-200 text-blue-900' :
                      finalFreshTemp > 30 ? 'bg-amber-50 border-amber-200 text-amber-950' :
                      'bg-green-50 border-green-200 text-green-900'
                    }`}>
                      <div className="text-2xl">
                        {finalFreshTemp < 5 ? '❄️' : finalFreshTemp > 30 ? '🔥' : '✅'}
                      </div>
                      <div>
                        <strong className="block font-bold">
                          Betontemperatur: {formatDeZahl(finalFreshTemp, 1)} °C ({
                            finalFreshTemp < 5 ? 'Frostgefahr / zu kalt' :
                            finalFreshTemp > 30 ? 'Zu heiß / Rissgefahr' :
                            'Optimal'
                          })
                        </strong>
                        <span className="text-xxs opacity-90">
                          {finalFreshTemp < 5 ? 'Der Beton droht einzufrieren und die Hydratation stagniert. Maßnahme: Heizen Sie das Anmachwasser (T_W > 50°C) oder erwärmen Sie die Zuschläge.' :
                           finalFreshTemp > 30 ? 'Die Erhärtungsreaktion läuft zu schnell ab, was Spannungsrisse begünstigt. Maßnahme: Kühlen Sie das Wasser oder setze Schuppeneis ein.' :
                           'Die Frischbetontemperatur entspricht den baustellenpraktischen Vorschriften der DIN EN 206.'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* D. FESTIGKEITSENTWICKLUNG */}
            {betonSubTab === 'festigkeit' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="text-shiraz" size={18} />
                    <span>Druckfestigkeitsverlauf &amp; Reifeentwicklung nach Eurocode 2</span>
                  </h3>
                  <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                    <strong>Was?</strong> Schätzt die tatsächliche Druckfestigkeit des Betons im Bauteil nach <InlineMath math="t" /> Tagen bei einer bestimmten, konstanten mittleren Nachbehandlungstemperatur. <br />
                    <strong>Warum?</strong> Auf Baustellen muss für Ausschalfristen oder Vorspannungen gewusst werden, wann der Beton eine ausreichende Mindestfestigkeit (z.B. <InlineMath math="15 \, \text{N/mm}^2" />) erreicht hat. <br />
                    <strong>Wie?</strong> Bestimmung des temperaturkorrigierten Äquivalenten Reifealters nach <strong>Arrhenius</strong> und Berechnung der zeitlichen Festigkeit nach Eurocode 2 (DIN EN 1992-1-1).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* CONTROLS */}
                  <div className="md:col-span-1 bg-slate-50/50 p-4 rounded-xl border border-home-grau/30 space-y-4">
                    <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Einflussparameter</h4>
                    
                    {/* Concrete class */}
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <label className="font-bold text-slate-700 block">Festigkeitsklasse f_ck (28d):</label>
                      <select 
                        value={strengthClassFck} 
                        onChange={(e) => setStrengthClassFck(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-200 font-bold text-xs"
                      >
                        <option value={20}>C20/25 (f_ck = 20 MPa)</option>
                        <option value={25}>C25/30 (f_ck = 25 MPa)</option>
                        <option value={30}>C30/37 (f_ck = 30 MPa)</option>
                        <option value={35}>C35/45 (f_ck = 35 MPa)</option>
                        <option value={40}>C40/50 (f_ck = 40 MPa)</option>
                        <option value={50}>C50/60 (f_ck = 50 MPa)</option>
                      </select>
                    </div>

                    {/* Cement type rapidness */}
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <label className="font-bold text-slate-700 block">Zementerhärtungsklasse (s-Wert):</label>
                      <select 
                        value={strengthCementType} 
                        onChange={(e) => setStrengthCementType(e.target.value as 'S' | 'N' | 'R')}
                        className="w-full p-2 rounded-lg border border-slate-200 font-bold text-xs"
                      >
                        <option value="S">Klasse S (CEM 32,5 N - s = 0,38)</option>
                        <option value="N">Klasse N (CEM 32,5 R / 42,5 N - s = 0,25)</option>
                        <option value="R">Klasse R (CEM 42,5 R / 52,5 - s = 0,20)</option>
                      </select>
                    </div>

                    {/* Curing Temperature */}
                    <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs text-text-main/80 block font-bold">Mittlere Bauteiltemperatur (°C):</label>
                      <input 
                        type="range" min="2" max="40" step="1"
                        value={strengthCureTemp}
                        onChange={(e) => setStrengthCureTemp(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <div className="text-xxs text-text-main/70 font-mono text-right font-bold text-shiraz">{formatDeWert(strengthCureTemp)} °C</div>
                    </div>

                    {/* Age in days */}
                    <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs text-text-main/80 block font-bold">Aktuelles Alter <InlineMath math="t" /> (Tage):</label>
                      <input 
                        type="range" min="1" max="90" step="1"
                        value={strengthCureAge}
                        onChange={(e) => setStrengthCureAge(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <div className="text-xxs text-text-main/70 font-mono text-right font-bold text-shiraz">{formatDeWert(strengthCureAge)} Tage</div>
                    </div>
                  </div>

                  {/* CALCULATIONS */}
                  <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                    <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Erhärtungsfortschritt nach EN 1992-1-1</h4>
                    
                    <div className="space-y-3.5 text-xs text-text-main/80 leading-relaxed font-normal">
                      <div>
                        <strong>Schritt 1: Reifealter (Arrhenius) berechnen</strong>
                        <p className="mt-1">
                          Aufgrund erhöhter oder verringerter Hydratationstemperatur wird die wirksame Reifezeit normativ skaliert:
                        </p>
                        <BlockMath math={`t_T = t \\cdot \\exp\\left( 4000 \\cdot \\left[ \\frac{1}{293} - \\frac{1}{273 + T} \\right] \\right)`} />
                        <BlockMath math={`t_T = \\color{#A3113E}{${formatDeTeXWert(strengthCureAge)}} \\cdot \\exp\\left( 4000 \\cdot \\left[ \\frac{1}{293} - \\frac{1}{273 + \\color{#A3113E}{${formatDeTeXWert(strengthCureTemp)}}} \\right] \\right) = \\color{#A3113E}{${formatDeTeX(maturityAge, 2)}} \\, \\text{Tage}`} />
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <strong>Schritt 2: Festigkeitsbeiwert <InlineMath math="\beta_{cc}" /> ermitteln</strong>
                        <BlockMath math={`\\beta_{cc}(t_T) = \\exp\\left( s \\cdot \\left[ 1 - \\sqrt{\\frac{28}{t_T}} \\right] \\right)`} />
                        <BlockMath math={`\\beta_{cc}(t_T) = \\exp\\left( ${formatDeTeXWert(s_param)} \\cdot \\left[ 1 - \\sqrt{\\frac{28}{\\color{#A3113E}{${formatDeTeX(maturityAge, 2)}}}} \\right] \\right) = \\color{#A3113E}{${formatDeTeX(beta_cc, 4)}}`} />
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <strong>Schritt 3: Erreichte Druckfestigkeiten</strong>
                        <div className="grid grid-cols-2 gap-4 mt-2 bg-slate-50 p-3 rounded-lg font-mono text-xxs border border-home-grau/20">
                          <div>
                            <p className="font-bold text-slate-700">Mittlere Festigkeit f_cm(t):</p>
                            <p className="text-xs text-slate-900 font-extrabold mt-1"><span className="text-shiraz">{formatDeZahl(f_cm_t, 2)}</span> N/mm²</p>
                            <p className="text-[10px] text-slate-500">von f_cm,28 = {formatDeWert(f_cm_28)} MPa</p>
                          </div>
                          <div>
                            <p className="font-bold text-slate-700">Charakteristische Festigkeit f_ck(t):</p>
                            <p className="text-xs text-shiraz font-extrabold mt-1">{formatDeZahl(f_ck_t, 2)} N/mm²</p>
                            <p className="text-[10px] text-slate-500">von f_ck,28 = {formatDeWert(strengthClassFck)} MPa</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STATUS AND EXCLUSION ASSESSMENT */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 text-xs">
                      <span className="text-xxs font-bold text-slate-400 block uppercase tracking-wide mb-1">Ausschaleignung (CEN-Richtwert)</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-3 h-3 rounded-full ${beta_cc >= 0.5 ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <p className="font-normal">
                          Der Beton hat <strong>{formatDeZahl((beta_cc * 100), 1)}%</strong> seiner 28-Tage-Nennfestigkeit erreicht. 
                          {beta_cc >= 0.5 ? (
                            <span className="text-green-800"> Ein Ausschalen tragender Bauteile ist nach DBV-Leitfaden im Regelfall zulässig (&gt; 50% Festigkeit).</span>
                          ) : (
                            <span className="text-amber-800"> Ein Ausschalen tragender Bauteile wird noch nicht empfohlen (erforderlich sind i.d.R. ≥ 50% der charakteristischen Nennfestigkeit).</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 3. TAB CONTENT: STAHLBETON-BIEGUNG --- */}
        {activeTab === 'stahlbeton' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <Sliders className="text-shiraz" size={18} />
                <span>Bemessung eines Rechteckquerschnitts für reine Biegung im GZT</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                <strong>Was?</strong> Berechnet wird die erforderliche Längszugbewehrung <InlineMath math="A_s" /> in <InlineMath math="\text{cm}^2" /> für einen einachsig beanspruchten Stahlbetonbalken. <br />
                <strong>Warum?</strong> Beton besitzt eine sehr geringe Zugfestigkeit. Bei Biegung entstehen an der Bauteilunterseite Zugspannungen, die durch eingelegte Stahlstäbe rissminimierend und tragfähig aufgenommen werden müssen. <br />
                <strong>Wie?</strong> Über das dimensionslose Beiwert-Verfahren (<InlineMath math="\mu" />-Tabelle) für den Grenzzustand der Tragfähigkeit (GZT) nach <strong>Eurocode 2 (DIN EN 1992-1-1)</strong>.
              </p>
            </div>

            {/* INTERACTIVE CONTROLS */}
            <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
              <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders size={14} className="text-shiraz" /> Tragwerksparameter einstellen
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Bending Moment */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Bemessungsmoment <InlineMath math="M_{Ed}" /> (kNm):</label>
                  <input 
                    type="range" min="50" max="300" step="10"
                    value={mEd}
                    onChange={(e) => setMEd(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeWert(mEd)} kNm</div>
                </div>

                {/* Concrete Class */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Betongüte:</label>
                  <select 
                    value={concreteClass} 
                    onChange={(e) => setConcreteClass(e.target.value as 'C20/25' | 'C25/30' | 'C30/37')}
                    className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value="C20/25">C20/25 (f_ck = 20 MPa)</option>
                    <option value="C25/30">C25/30 (f_ck = 25 MPa)</option>
                    <option value="C30/37">C30/37 (f_ck = 30 MPa)</option>
                  </select>
                </div>

                {/* Section Dimensions */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs col-span-2">
                  <label className="font-bold text-slate-700 block">Abmessungen Balken <InlineMath math="b \times h" /> (cm):</label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-normal">Breite b:</span>
                      <input 
                        type="number" min="15" max="60"
                        value={bWidth}
                        onChange={(e) => setBWidth(Number(e.target.value))}
                        className="w-full p-1.5 rounded-lg border border-slate-200 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-normal">Höhe h:</span>
                      <input 
                        type="number" min="30" max="100"
                        value={hHeight}
                        onChange={(e) => setHHeight(Number(e.target.value))}
                        className="w-full p-1.5 rounded-lg border border-slate-200 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* STEP-BY-STEP CALCULATION DETAILS */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                Biegung-Bemessungsverfahren (DIN EN 1992-1-1) Schritt für Schritt
              </h4>

              <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
                <div>
                  <strong>Schritt 1: Rechnerische Materialfestigkeiten ermitteln</strong>
                  <p className="mt-1">
                    Zylinderdruckfestigkeit des Betons <InlineMath math={`f_{ck} = ${f_ck} \\, \\text{N/mm}^2`} />. <br />
                    Bemessungswert der Betondruckfestigkeit <InlineMath math="f_{cd}" /> (mit Teilsicherheitsbeiwert <InlineMath math="\gamma_C = 1{,}5" /> und Beiwert für Langzeitwirkungen <InlineMath math="\alpha_{cc} = 0{,}85" />):
                  </p>
                  <BlockMath math={`f_{cd} = \\alpha_{cc} \\cdot \\frac{f_{ck}}{\\gamma_C} = 0{,}85 \\cdot \\frac{\\color{#A3113E}{${f_ck}}}{1{,}5} = \\color{#A3113E}{${formatDeTeX(f_cd, 2)}} \\, \\text{N/mm}^2 \\, (\\text{MPa})`} />
                  <p className="mt-1">
                    Bemessungswert der Stahlstreckgrenze <InlineMath math="f_{yd}" /> (mit <InlineMath math="f_{yk} = 500 \, \text{N/mm}^2" /> und Teilsicherheitsbeiwert <InlineMath math="\gamma_S = 1{,}15" />):
                  </p>
                  <BlockMath math={`f_{yd} = \\frac{f_{yk}}{\\gamma_S} = \\frac{500}{1{,}15} = ${formatDeTeX(f_yd, 1)} \\, \\text{N/mm}^2`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 2: Nutzhöhe d bestimmen</strong>
                  <p className="mt-1">
                    Die Nutzhöhe <InlineMath math="d" /> ist der Abstand des am stärksten gedrückten Betonrandes zum Schwerpunkt der Zugbewehrung. 
                    Wir nehmen einen Vorhaltemaß-Abstand von <InlineMath math={`d_1 = ${formatDeTeXWert(d1Margin)} \\, \\text{cm}`} /> an:
                  </p>
                  <BlockMath math={`d = h - d_1 = \\color{#A3113E}{${hHeight}} - ${formatDeTeXWert(d1Margin)} = \\color{#A3113E}{${formatDeTeX((hHeight - d1Margin), 1)}} \\, \\text{cm} \\quad (= \\color{#A3113E}{${formatDeTeX(d_m, 3)}} \\, \\text{m})`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 3: Dimensionsloses Biegemoment <InlineMath math="\mu_{Ed}" /> berechnen</strong>
                  <p className="mt-1">
                    Hiermit wird geprüft, ob die Druckzone des Querschnitts ohne zusätzliche Druckbewehrung ausreicht:
                  </p>
                  <BlockMath math={`\\mu_{Ed} = \\frac{M_{Ed}}{b \\cdot d^2 \\cdot f_{cd}}`} />
                  <BlockMath math={`\\mu_{Ed} = \\frac{\\color{#A3113E}{${formatDeTeX((mEd * 0.001), 3)}} \\, \\text{MNm}}{\\color{#A3113E}{${formatDeTeX(b_m, 2)}} \\, \\text{m} \\cdot (\\color{#A3113E}{${formatDeTeX(d_m, 3)}} \\, \\text{m})^2 \\cdot \\color{#A3113E}{${formatDeTeX(f_cd, 2)}} \\, \\text{MN/m}^2} = \\color{#A3113E}{${formatDeTeX(mu_Ed, 4)}}`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 4: Hebelarm der inneren Kräfte z ermitteln</strong>
                  {mu_Ed < mu_lim ? (
                    <>
                      <p className="mt-1">
                        Da <InlineMath math={`\\mu_{Ed} = ${formatDeTeX(mu_Ed, 4)} \\le \\mu_{lim} = 0{,}371`} /> ist, liegt ein reiner Zugbruch vor. Keine Druckbewehrung erforderlich.
                        Der mechanische Bewehrungsbeiwert <InlineMath math="\omega" /> und der Hebelarmbeiwert <InlineMath math="\zeta" /> ergeben sich aus dem parabolisch-rechteckigen Spannungsdiagramm zu:
                      </p>
                      <BlockMath math={`\\zeta = \\frac{1 + \\sqrt{1 - 2 \\cdot \\mu_{Ed}}}{2} = \\frac{1 + \\sqrt{1 - 2 \\cdot \\color{#A3113E}{${formatDeTeX(mu_Ed, 4)}}}}{2} = \\color{#A3113E}{${formatDeTeX(zeta, 4)}}`} />
                      <BlockMath math={`z = \\zeta \\cdot d = \\color{#A3113E}{${formatDeTeX(zeta, 4)}} \\cdot \\color{#A3113E}{${formatDeTeX(d_m, 3)}} = \\color{#A3113E}{${formatDeTeX(z_m, 3)}} \\, \\text{m}`} />
                    </>
                  ) : (
                    <p className="text-red-600 font-bold">
                      Achtung! \mu_Ed (<span className="text-shiraz">{formatDeZahl(mu_Ed, 4)}</span>) &gt; \mu_lim ({formatDeWert(mu_lim)}). Der Querschnitt ist überbeansprucht! 
                      Es ist Druckbewehrung erforderlich oder die Balkenabmessungen (b, h) müssen vergrößert werden, um ein sprödes Betonversagen zu verhindern.
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 5: Erforderliche Stahlfläche A_s berechnen</strong>
                  <BlockMath math={`A_{s,\\text{erf}} = \\frac{M_{Ed}}{f_{yd} \\cdot z}`} />
                  {mu_Ed < mu_lim ? (
                    <BlockMath math={`A_{s,\\text{erf}} = \\frac{\\color{#A3113E}{${mEd}} \\, \\text{kNm} \\cdot 10}{${formatDeTeX(f_yd, 1)} \\, \\text{N/mm}^2 \\cdot \\color{#A3113E}{${formatDeTeX(z_m, 3)}} \\, \\text{m}} = \\color{#A3113E}{${formatDeTeX(a_s_req, 2)}} \\, \\text{cm}^2`} />
                  ) : (
                    <div className="text-center text-red-650 font-bold bg-red-50 p-3 rounded-lg border border-red-200">
                      Berechnung gesperrt wegen Querschnitts-Überbeanspruchung!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* EVALUATION OF REINFORCEMENT AREA */}
            {mu_Ed < mu_lim && (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs font-normal text-text-main/80 space-y-3">
                <span className="font-extrabold text-slate-800 block">Ergebnis-Interpretation &amp; Konstruktionsvorschlag:</span>
                <p>
                  Die statisch erforderliche Längsbewehrung an der Balkenunterseite beträgt <strong>{formatDeZahl(a_s_req, 2)} cm²</strong>. 
                  Im Ingenieurbüro muss diese Fläche nun in konkrete Bewehrungsdurchmesser umgesetzt werden.
                </p>
                <div className="p-3 bg-white border rounded-lg space-y-2.5 font-normal text-xxs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg border text-center">
                      <span className="block font-bold mb-1">Option A (Standard):</span>
                      <strong className="text-shiraz">3 Ø 16</strong> (6,03 cm²)
                      <span className="block text-[10px] text-slate-400 mt-1">Auslastung: {formatDeZahl((a_s_req / 6.03 * 100), 0)}%</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border text-center">
                      <span className="block font-bold mb-1">Option B (Kompakt):</span>
                      <strong className="text-teal-700">2 Ø 20</strong> (6,28 cm²)
                      <span className="block text-[10px] text-slate-400 mt-1">Auslastung: {formatDeZahl((a_s_req / 6.28 * 100), 0)}%</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border text-center">
                      <span className="block font-bold mb-1">Option C (Minimalistisch):</span>
                      <strong className="text-indigo-700">4 Ø 12</strong> (4,52 cm²)
                      <span className="block text-[10px] text-slate-400 mt-1">
                        {4.52 >= a_s_req ? `Auslastung: ${formatDeZahl((a_s_req / 4.52 * 100), 0)}%` : 'Fläche unzureichend!'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 4. TAB CONTENT: HOLZBAU KNICKEN --- */}
        {activeTab === 'holzbau' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <Scale className="text-shiraz" size={18} />
                <span>Stabilitätsnachweis (Biegeknicken) einer pendelnd gelagerten Holzstütze</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                <strong>Was?</strong> Berechnet wird der Standsicherheitsnachweis einer druckbeanspruchten Holzstütze mit quadratischem/rechteckigem Querschnitt. <br />
                <strong>Warum?</strong> Schlanke Bauteile versagen unter zentrischer Druckkraft oft nicht durch direktes Brechen (Materialstauchung), sondern weichen schlagartig seitlich aus (instabiles Biegeknicken). <br />
                <strong>Wie?</strong> Mit dem Ersatzstabverfahren nach dem Abminderungsbeiwert <InlineMath math="k_c" /> gemäß <strong>Eurocode 5 (DIN EN 1995-1-1)</strong>.
              </p>
            </div>

            {/* INTERACTIVE CONTROLS */}
            <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
              <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders size={14} className="text-shiraz" /> Abmessungen &amp; Einwirkungen
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Column Length */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Knicklänge <InlineMath math="s_k = L" /> (m):</label>
                  <input 
                    type="range" min="1.5" max="6.0" step="0.5"
                    value={colLength}
                    onChange={(e) => setColLength(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeZahl(colLength, 1)} m</div>
                </div>

                {/* Section b x h */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Querschnitt <InlineMath math="b = h" /> (cm):</label>
                  <input 
                    type="range" min="8" max="24" step="2"
                    value={colHeight}
                    onChange={(e) => {
                      setColHeight(Number(e.target.value));
                      setColWidth(Number(e.target.value));
                    }}
                    className="w-full accent-shiraz"
                  />
                  <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeWert(colHeight)} x {formatDeWert(colHeight)} cm</div>
                </div>

                {/* Axial Force */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Normalkraft <InlineMath math="N_d" /> (kN):</label>
                  <input 
                    type="range" min="10" max="150" step="5"
                    value={designForce}
                    onChange={(e) => setDesignForce(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeWert(designForce)} kN</div>
                </div>

                {/* Timber Grade */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Holzart:</label>
                  <select 
                    value={timberGrade} 
                    onChange={(e) => setTimberGrade(e.target.value as 'C24' | 'C30')}
                    className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value="C24">Nadelholz C24</option>
                    <option value="C30">Nadelholz C30</option>
                  </select>
                </div>

              </div>
            </div>

            {/* STEP-BY-STEP DETAILS */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                Knicknachweis nach Eurocode 5 Schritt für Schritt
              </h4>

              <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
                <div>
                  <strong>Schritt 1: Festigkeiten bestimmen</strong>
                  <p className="mt-1">
                    Für die Holzgüte <span className="text-shiraz font-bold">{timberGrade}</span> beträgt der Festigkeitswert <InlineMath math={`f_{c,0,k} = ${f_c0k} \\, \\text{N/mm}^2`} />. <br />
                    Unter Klasse NKL 1 (beheizter Innenraum) ist <InlineMath math="k_{mod} = 0{,}9" />. Der Bemessungswert lautet:
                  </p>
                  <BlockMath math={`f_{c,0,d} = k_{mod} \\cdot \\frac{f_{c,0,k}}{\\gamma_M} = 0{,}9 \\cdot \\frac{\\color{#A3113E}{${f_c0k}}}{1{,}3} = \\color{#A3113E}{${formatDeTeX(f_c0d, 2)}} \\, \\text{N/mm}^2`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 2: Geometrische Kennwerte &amp; Schlankheit ermitteln</strong>
                  <p className="mt-1">Fläche <InlineMath math="A" /> und Trägheitsradius <InlineMath math="i" /> des quadratischen Querschnitts:</p>
                  <BlockMath math={`A = b \\cdot h = \\color{#A3113E}{${colWidth}} \\cdot \\color{#A3113E}{${colHeight}} = \\color{#A3113E}{${formatDeTeXWert(A_wood)}} \\, \\text{cm}^2`} />
                  <BlockMath math={`i = \\frac{h}{\\sqrt{12}} = \\frac{\\color{#A3113E}{${colHeight}}}{3{,}464} = \\color{#A3113E}{${formatDeTeX(i_radius, 2)}} \\, \\text{cm}`} />
                  <p className="mt-1">Daraus folgt der dimensionslose Schlankheitsgrad <InlineMath math="\lambda" />:</p>
                  <BlockMath math={`\\lambda = \\frac{s_k}{i} = \\frac{\\color{#A3113E}{${formatDeTeX((colLength * 100), 0)}} \\, \\text{cm}}{\\color{#A3113E}{${formatDeTeX(i_radius, 2)}} \\, \\text{cm}} = \\color{#A3113E}{${formatDeTeX(slenderness, 2)}}`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 3: Relativen Schlankheitsgrad berechnen</strong>
                  <p className="mt-1">Mit dem E-Modul-Quantilswert <InlineMath math={`E_{0{,}05} = ${E_005} \\, \\text{N/mm}^2`} />:</p>
                  <BlockMath math={`\\lambda_{rel} = \\frac{\\lambda}{\\pi} \\cdot \\sqrt{\\frac{f_{c,0,k}}{E_{0{,}05}}} = \\frac{\\color{#A3113E}{${formatDeTeX(slenderness, 2)}}}{\\pi} \\cdot \\sqrt{\\frac{\\color{#A3113E}{${f_c0k}}}{${E_005}}} = \\color{#A3113E}{${formatDeTeX(lambda_rel, 4)}}`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 4: Knickbeiwert k_c bestimmen</strong>
                  <p className="mt-1">Mit dem Grad der Systemunvollkommenheit <InlineMath math="\beta_c = 0{,}2" /> für Vollholz:</p>
                  <BlockMath math={`k = 0{,}5 \\cdot [1 + \\beta_c \\cdot (\\lambda_{rel} - 0{,}3) + \\lambda_{rel}^2]`} />
                  <BlockMath math={`k = 0{,}5 \\cdot [1 + 0{,}2 \\cdot (\\color{#A3113E}{${formatDeTeX(lambda_rel, 4)}} - 0{,}3) + \\color{#A3113E}{${formatDeTeX(Math.pow(lambda_rel, 2), 4)}}] = \\color{#A3113E}{${formatDeTeX(k_factor_wood, 4)}}`} />
                  <p className="mt-1">Daraus ergibt sich der Abminderungsbeiwert <InlineMath math="k_c" />:</p>
                  <BlockMath math={`k_c = \\frac{1}{k + \\sqrt{k^2 - \\lambda_{rel}^2}} = \\frac{1}{\\color{#A3113E}{${formatDeTeX(k_factor_wood, 4)}} + \\sqrt{\\color{#A3113E}{${formatDeTeX(k_factor_wood, 4)}}^2 - \\color{#A3113E}{${formatDeTeX(lambda_rel, 4)}}^2}} = \\color{#A3113E}{${formatDeTeX(k_c_final, 4)}}`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 5: Spannungsnachweis durchführen</strong>
                  <p className="mt-1">Einwirkende Druckspannung <InlineMath math="\sigma_{c,0,d}" />:</p>
                  <BlockMath math={`\\sigma_{c,0,d} = \\frac{N_d \\cdot 10}{A} = \\frac{\\color{#A3113E}{${designForce}} \\cdot 10}{\\color{#A3113E}{${A_wood}}} = \\color{#A3113E}{${formatDeTeX(sigma_c0d, 3)}} \\, \\text{N/mm}^2`} />
                  <p className="mt-1">Knicknachweis-Bedingung:</p>
                  <BlockMath math={`\\eta = \\frac{\\sigma_{c,0,d}}{k_c \\cdot f_{c,0,d}} = \\frac{\\color{#A3113E}{${formatDeTeX(sigma_c0d, 3)}}}{\\color{#A3113E}{${formatDeTeX(k_c_final, 3)}} \\cdot \\color{#A3113E}{${formatDeTeX(f_c0d, 2)}}} = \\color{#A3113E}{${formatDeTeX(utilizationWood, 3)}} \\le 1{,}0`} />
                </div>
              </div>
            </div>

            {/* RESULTS EVALUATION */}
            <div className={`p-5 rounded-2xl border text-xs leading-relaxed flex flex-col md:flex-row gap-4 items-start md:items-center ${
              utilizationWood <= 1.0 
                ? 'bg-green-50 border-green-200 text-green-900' 
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <div className="p-3 rounded-xl bg-white border self-start md:self-center">
                {utilizationWood <= 1.0 ? (
                  <CheckCircle2 className="text-green-600 animate-bounce" size={32} />
                ) : (
                  <AlertTriangle className="text-red-600 animate-pulse" size={32} />
                )}
              </div>
              <div className="space-y-1 flex-1 font-normal">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm">Ausnutzungsgrad (Knicknachweis):</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-xxs tracking-wider uppercase ${
                    utilizationWood <= 1.0 ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                  }`}>
                    {formatDeZahl((utilizationWood * 100), 0)}% Ausnutzung
                  </span>
                </div>
                <p>
                  Die Stütze ist zu <strong>{formatDeZahl((utilizationWood * 100), 1)}%</strong> ausgelastet.
                </p>
                <p className="text-xxs opacity-90 mt-1">
                  {utilizationWood <= 1.0 
                    ? 'Der Nachweis gegen Stabilitätsversagen im Grenzzustand der Tragfähigkeit (GZT) ist erfüllt. Die Stütze besitzt ausreichenden Widerstand gegen seitliches Ausknicken unter der vorgegebenen Einwirkung.'
                    : 'Achtung! Die Tragfähigkeit ist überschritten. Erhöhen Sie den Holzquerschnitt (z.B. auf 16x16 cm) oder verringern Sie die Knicklänge der Stütze mittels konstruktiver Zwischenhalterungen.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- 5. TAB CONTENT: MAUERWERK TRAGFÄHIGKEIT --- */}
        {activeTab === 'mauerwerk' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <Settings className="text-shiraz" size={18} />
                <span>Tragfähigkeitsnachweis einer unbewehrten Mauerwerkswand unter Vertikallast</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                <strong>Was?</strong> Berechnet wird die maximale aufnehmbare Vertikalkraft <InlineMath math="N_{Rd}" /> in <InlineMath math="\text{kN/m}" /> einer tragenden Innen- oder Außenwand. <br />
                <strong>Warum?</strong> Mauerwerk besitzt durch das Fugenbild und Steinmaterial ein ausgeprägtes anisotropes Tragverhalten und reagiert hochsensibel auf außermittige Lasteintragungen sowie Knickgefahren. <br />
                <strong>Wie?</strong> Mit dem vereinfachten Nachweisverfahren nach <strong>Eurocode 6 (DIN EN 1996-3)</strong>.
              </p>
            </div>

            {/* INTERACTIVE CONTROLS */}
            <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
              <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders size={14} className="text-shiraz" /> Wandparameter einstellen
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Wall Height */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Wandhöhe <InlineMath math="h" /> (m):</label>
                  <input 
                    type="range" min="2.50" max="3.50" step="0.25"
                    value={wallHeight}
                    onChange={(e) => setWallHeight(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeZahl(wallHeight, 2)} m</div>
                </div>

                {/* Wall Thickness */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Dicke <InlineMath math="t" /> (cm):</label>
                  <select 
                    value={wallThick} 
                    onChange={(e) => setWallThick(Number(e.target.value))}
                    className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value={11.5}>11,5 cm</option>
                    <option value={17.5}>17,5 cm</option>
                    <option value={24.0}>24,0 cm</option>
                    <option value={30.0}>30,0 cm</option>
                  </select>
                </div>

                {/* Vertical Load */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Druckkraft <InlineMath math="N_{Ed}" /> (kN/m):</label>
                  <input 
                    type="range" min="30" max="250" step="10"
                    value={verticalLoad}
                    onChange={(e) => setVerticalLoad(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeWert(verticalLoad)} kN/m</div>
                </div>

                {/* Masonry Compressive strength */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Steinfestigkeit / Art:</label>
                  <select 
                    value={masonryType} 
                    onChange={(e) => setMasonryType(e.target.value as 'KS' | 'HLZ')}
                    className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value="KS">Kalksandstein (f_k = 5,6 MPa)</option>
                    <option value="HLZ">Hochlochziegel (f_k = 3,2 MPa)</option>
                  </select>
                </div>

              </div>
            </div>

            {/* STEP-BY-STEP CALCULATION */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                Vereinfachter Tragfähigkeitsnachweis (Eurocode 6) Schritt für Schritt
              </h4>

              <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
                <div>
                  <strong>Schritt 1: Rechnerische Mauerwerksfestigkeit f_d</strong>
                  <p className="mt-1">
                    Der Bemessungswert der Druckfestigkeit <InlineMath math="f_d" /> berechnet sich aus der charakteristischen Festigkeit <InlineMath math="f_k" /> und dem materialspezifischen Sicherheitsbeiwert <InlineMath math="\gamma_M = 1{,}5" /> (unter vereinfachten Verfahren):
                  </p>
                  <BlockMath math={`f_d = \\frac{f_k}{\\gamma_M} = \\frac{\\color{#A3113E}{${formatDeTeX(f_k, 1)}}}{1{,}5} = \\color{#A3113E}{${formatDeTeX(f_d, 2)}} \\, \\text{N/mm}^2 \\, (\\text{MPa})`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 2: Wirksame Schlankheit bestimmen</strong>
                  <p className="mt-1">
                    Bei zweiseitiger Halterung am Wandkopf und Wandfuß durch ausreichend steife Deckenplatten entspricht die effektive Knicklänge der lichten Wandhöhe <InlineMath math="h_{ef} = h" />:
                  </p>
                  <BlockMath math={`\\bar{\\lambda} = \\frac{h_{ef}}{t} = \\frac{\\color{#A3113E}{${formatDeTeX(wallHeight, 2)}} \\, \\text{m}}{\\color{#A3113E}{${formatDeTeX(t_m, 3)}} \\, \\text{m}} = \\color{#A3113E}{${formatDeTeX(slenderness_mauer, 2)}}`} />
                  <p className="mt-1">
                    Nach DIN EN 1996-3 darf die Slenderness bei tragenden Wänden im vereinfachten Verfahren den Grenzwert <strong>25</strong> nicht überschreiten. <br />
                    Die Schlankheit beträgt: <strong className="text-shiraz">{formatDeZahl(slenderness_mauer, 2)}</strong>. 
                    {slenderness_mauer > 25 ? (
                      <span className="text-red-600 font-bold block mt-1">Achtung: Wand ist zu schlank! Erhöhen Sie die Dicke t.</span>
                    ) : (
                      <span className="text-green-600 block mt-1">Grenzbedingung erfüllt (Slenderness ≤ 25).</span>
                    )}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 3: Abminderungsfaktor \Phi bestimmen</strong>
                  <p className="mt-1">
                    Der Abminderungsfaktor <InlineMath math="\Phi" /> berücksichtigt Tragfähigkeitseinbußen durch Exzentrizitäten und Verformungen in Wandmitte nach dem vereinfachten Verfahren:
                  </p>
                  <BlockMath math={`\\Phi = 0{,}85 - 0{,}0011 \\cdot \\left(\\frac{h_{ef}}{t}\\right)^2`} />
                  <BlockMath math={`\\Phi = 0{,}85 - 0{,}0011 \\cdot (\\color{#A3113E}{${formatDeTeX(slenderness_mauer, 2)}})^2 = \\color{#A3113E}{${formatDeTeX(phi_final, 4)}}`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 4: Vertikaler Traglastwiderstand N_Rd</strong>
                  <p className="mt-1">
                    Der Bemessungswert der aufnehmbaren Vertikallast pro Meter Wandlänge ergibt sich aus:
                  </p>
                  <BlockMath math={`N_{Rd} = \\Phi \\cdot t \\cdot f_d`} />
                  <BlockMath math={`N_{Rd} = \\color{#A3113E}{${formatDeTeX(phi_final, 3)}} \\cdot \\color{#A3113E}{${formatDeTeX(t_m, 3)}} \\, \\text{m} \\cdot \\color{#A3113E}{${formatDeTeX(f_d, 2)}} \\, \\text{MN/m}^2 \\cdot 1000 = \\color{#A3113E}{${formatDeTeX(n_Rd, 1)}} \\, \\text{kN/m}`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 5: Auslastungsvergleich</strong>
                  <BlockMath math={`\\eta = \\frac{N_{Ed}}{N_{Rd}} = \\frac{\\color{#A3113E}{${verticalLoad}} \\, \\text{kN/m}}{\\color{#A3113E}{${formatDeTeX(n_Rd, 1)}} \\, \\text{kN/m}} = \\color{#A3113E}{${formatDeTeX(utilizationMauer, 3)}} \\le 1{,}0`} />
                </div>
              </div>
            </div>

            {/* RESULTS EVALUATION */}
            <div className={`p-5 rounded-2xl border text-xs leading-relaxed flex flex-col md:flex-row gap-4 items-start md:items-center ${
              utilizationMauer <= 1.0 && slenderness_mauer <= 25
                ? 'bg-green-50 border-green-200 text-green-900' 
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <div className="p-3 rounded-xl bg-white border self-start md:self-center">
                {utilizationMauer <= 1.0 && slenderness_mauer <= 25 ? (
                  <CheckCircle2 className="text-green-600 animate-bounce" size={32} />
                ) : (
                  <AlertTriangle className="text-red-600 animate-pulse" size={32} />
                )}
              </div>
              <div className="space-y-1 flex-1 font-normal">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm">Ausnutzungsgrad (Eurocode 6):</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-xxs tracking-wider uppercase ${
                    utilizationMauer <= 1.0 && slenderness_mauer <= 25 ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                  }`}>
                    {utilizationMauer <= 1.0 && slenderness_mauer <= 25 ? 'Bestanden' : 'Nicht erfüllt'}
                  </span>
                </div>
                <p>
                  Die Mauerwerkswand ist zu <strong>{formatDeZahl((utilizationMauer * 100), 1)}%</strong> ausgelastet.
                </p>
                <p className="text-xxs opacity-90 mt-1">
                  {utilizationMauer <= 1.0 && slenderness_mauer <= 25
                    ? 'Der Standsicherheitsnachweis für unbewehrtes Mauerwerk unter vertikalen Lasten ist erfolgreich erfüllt. Die Wandstärke reicht aus, um Knickerscheinungen und Quetschversagen zu verhindern.'
                    : 'Die Wand ist überlastet oder überschreitet die zulässige Grenzschlankheit. Erhöhen Sie die Wandstärke t oder wechseln Sie zu einem Steinmaterial mit höherer Steinfestigkeitsklasse (z.B. Kalksandstein).'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- 6. TAB CONTENT: NACHHALTIGKEIT & ÖKOBILANZ --- */}
        {activeTab === 'nachhaltigkeit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* SUB-TABS */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
              <button
                onClick={() => setCo2SubTab('karbonatisierung')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  co2SubTab === 'karbonatisierung'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                1. Re-Karbonatisierung (CO2-Speicherung)
              </button>
              <button
                onClick={() => setCo2SubTab('gwp_vergleich')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  co2SubTab === 'gwp_vergleich'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                2. Ökobilanz: GWP-Vergleich (CEM I vs. CEM III)
              </button>
            </div>

            {co2SubTab === 'karbonatisierung' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inputs and explanation */}
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <Leaf className="text-shiraz" size={16} /> Eingabeparameter: CO2-Absorption
                    </h3>
                    
                    {/* k-Faktor Slider */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-700">Karbonatisierungsbeiwert k:</span>
                        <span className="text-shiraz">{formatDeZahl(kFactor, 1)} mm/√a</span>
                      </div>
                      <input 
                        type="range" 
                        min="1.0" 
                        max="12.0" 
                        step="0.5" 
                        value={kFactor} 
                        onChange={(e) => setKFactor(parseFloat(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <span className="text-xxs text-slate-500 block">Typisch: 1,0 - 3,0 (Innenbereich/trocken), 4,0 - 8,0 (Außenbereich, bewittert).</span>
                    </div>

                    {/* Nutzungsdauer Slider */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-700">Nutzungsdauer t:</span>
                        <span className="text-shiraz">{durabilityYears} Jahre</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="150" 
                        step="1" 
                        value={durabilityYears} 
                        onChange={(e) => setDurabilityYears(parseInt(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    {/* Zementgehalt Slider */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-700">Zementgehalt c:</span>
                        <span className="text-shiraz">{formatDeWert(cementGehalt)} kg/m³</span>
                      </div>
                      <input 
                        type="range" 
                        min="150" 
                        max="450" 
                        step="10" 
                        value={cementGehalt} 
                        onChange={(e) => setCementGehalt(parseInt(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    {/* CaO-Anteil im Klinker */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-700">CaO-Anteil im Zement:</span>
                        <span className="text-shiraz">{formatDeWert(caoAnteil)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="30" 
                        max="85" 
                        step="5" 
                        value={caoAnteil} 
                        onChange={(e) => setCaoAnteil(parseInt(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <span className="text-xxs text-slate-500 block">Anteil reaktives Calciumoxid im Zementstein (standardmäßig ca. 65%).</span>
                    </div>

                    {/* Karbonatisierungsgrad */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-700">Karbonatisierungsgrad:</span>
                        <span className="text-shiraz">{formatDeWert(carbGrad)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        step="5" 
                        value={carbGrad} 
                        onChange={(e) => setCarbGrad(parseInt(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                      <span className="text-xxs text-slate-500 block">Prozentsatz des reaktionsfähigen CaO, der tatsächlich mit CO2 reagiert.</span>
                    </div>
                  </div>
                </div>

                {/* Step by Step calculation */}
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                      Berechnung & CO2-Uptake-Bilanz
                    </h3>
                    
                    <div className="space-y-4 text-xs text-text-main/80 leading-relaxed">
                      <div>
                        <strong>Schritt 1: Karbonatisierungstiefe d_k</strong>
                        <p className="mt-1 text-xxs">
                          Die Tiefenwirkung der Karbonatisierung folgt dem Quadratwurzel-Zeit-Gesetz (Fick'sche Diffusion):
                        </p>
                        <BlockMath math={`d_k = k \\cdot \\sqrt{t} = \\color{#A3113E}{${formatDeTeX(kFactor, 1)}} \\cdot \\sqrt{\\color{#A3113E}{${durabilityYears}}} = \\color{#A3113E}{${formatDeTeX(carbonationDepth, 2)}} \\, \\text{mm} = \\color{#A3113E}{${formatDeTeX((carbonationDepth/1000), 4)}} \\, \\text{m}`} />
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <strong>Schritt 2: Stoffmengen im karbonatisierten Volumen</strong>
                        <p className="mt-1 text-xxs">
                          Betrachtet wird 1 m² Wandfläche. Das betroffene Volumen beträgt <InlineMath math="V = 1{,}0 \, \text{m}^2 \times d_k" />.
                        </p>
                        <BlockMath math={`m_{\\text{Zement}} = V \\cdot c = \\color{#A3113E}{${formatDeTeX((carbonationDepth/1000), 4)}} \\, \\text{m}^3 \\cdot \\color{#A3113E}{${cementGehalt}} \\, \\text{kg/m}^3 = \\color{#A3113E}{${formatDeTeX(cementMassPerM2, 2)}} \\, \\text{kg}`} />
                        <BlockMath math={`m_{\\text{CaO}} = m_{\\text{Zement}} \\cdot \\text{Anteil} = \\color{#A3113E}{${formatDeTeX(cementMassPerM2, 2)}} \\cdot \\color{#A3113E}{${formatDeTeX((caoAnteil/100), 2)}} = \\color{#A3113E}{${formatDeTeX(caoMassPerM2, 2)}} \\, \\text{kg}`} />
                        <BlockMath math={`m_{\\text{CaO,react}} = m_{\\text{CaO}} \\cdot \\text{Grad} = \\color{#A3113E}{${formatDeTeX(caoMassPerM2, 2)}} \\cdot \\color{#A3113E}{${formatDeTeX((carbGrad/100), 2)}} = \\color{#A3113E}{${formatDeTeX(reactedCaoMassPerM2, 2)}} \\, \\text{kg}`} />
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <strong>Schritt 3: CO2-Absorption (Molares Verhältnis)</strong>
                        <p className="mt-1 text-xxs">
                          Die chemische Umwandlung lautet <InlineMath math="CaO + CO_2 \rightarrow CaCO_3" />. Das Verhältnis der Molmassen beträgt <InlineMath math="44{,}01 / 56{,}08 \approx 0{,}784" />:
                        </p>
                        <BlockMath math={`m_{\\text{CO2}} = m_{\\text{CaO,react}} \\cdot 0{,}784 = \\color{#A3113E}{${formatDeTeX(reactedCaoMassPerM2, 2)}} \\cdot 0{,}784 = \\color{#A3113E}{${formatDeTeX(co2UptakePerM2, 2)}} \\, \\text{kg CO}_2 / \\text{m}^2`} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-green-50 border border-green-150 text-xs text-green-900 leading-relaxed font-normal space-y-2">
                    <div className="flex items-center gap-2 font-bold text-green-900">
                      <Leaf className="text-green-600 animate-pulse" size={18} />
                      <span>CO2-Klimabilanz (Sicherer Kohlenstoffspeicher):</span>
                    </div>
                    <p>
                      Durch die Re-Karbonatisierung des Zementsteins hat die Betonwand über die {durabilityYears} Jahre hinweg pro m² Bauteilfläche ca. <strong>{formatDeZahl(co2UptakePerM2, 2)} kg CO2</strong> dauerhaft aus der Atmosphäre zurückgebunden.
                    </p>
                    <p className="text-xxs text-green-800 opacity-90">
                      Hinweis: Bei einer typischen Tragwerk-Sichtfläche von 1.000 m² entspricht dies einer Speichermenge von ca. <strong>{formatDeZahl((co2UptakePerM2 * 1000 / 1000), 1)} Tonnen CO2</strong>. Dies mildert den CO2-Fußabdruck der Herstellung (GWP) nachträglich ab. Jedoch schwächt die Karbonatisierung das alkalische Milieu (Depassivierung des Bewehrungsstahls bei Erreichen der Bewehrungslage!).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {co2SubTab === 'gwp_vergleich' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Leaf className="text-shiraz" size={16} /> GWP-Eingabeparameter (CEM I vs. CEM III)
                  </h3>
                  
                  {/* Bauteilvolumen Slider */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-700">Bauteilvolumen V:</span>
                      <span className="text-shiraz">{formatDeWert(bauteilVol)} m³</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="1500" 
                      step="10" 
                      value={bauteilVol} 
                      onChange={(e) => setBauteilVol(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <h4 className="font-bold text-xs text-slate-800">Rezeptur A: Portlandzement (CEM I)</h4>
                    {/* c_A Slider */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-normal">
                        <span className="text-slate-600">Zementgehalt c_A:</span>
                        <span className="font-bold">{formatDeWert(cementGehaltA)} kg/m³</span>
                      </div>
                      <input 
                        type="range" 
                        min="200" 
                        max="450" 
                        step="5" 
                        value={cementGehaltA} 
                        onChange={(e) => setCementGehaltA(parseInt(e.target.value))}
                        className="w-full accent-slate-600"
                      />
                    </div>
                    {/* spec GWP A Slider */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-normal">
                        <span className="text-slate-600">Spezifischer GWP_A (klinkerreich):</span>
                        <span className="font-bold">{formatDeWert(gwpZementA)} kg CO2-eq/t</span>
                      </div>
                      <input 
                        type="range" 
                        min="600" 
                        max="1000" 
                        step="10" 
                        value={gwpZementA} 
                        onChange={(e) => setGwpZementA(parseInt(e.target.value))}
                        className="w-full accent-slate-600"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <h4 className="font-bold text-xs text-shiraz">Rezeptur B: Hochofenzement (CEM III/B)</h4>
                    {/* c_B Slider */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-normal">
                        <span className="text-slate-600">Zementgehalt c_B:</span>
                        <span className="font-bold text-shiraz">{formatDeWert(cementGehaltB)} kg/m³</span>
                      </div>
                      <input 
                        type="range" 
                        min="200" 
                        max="450" 
                        step="5" 
                        value={cementGehaltB} 
                        onChange={(e) => setCementGehaltB(parseInt(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>
                    {/* spec GWP B Slider */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-normal">
                        <span className="text-slate-600">Spezifischer GWP_B (hüttensandreich):</span>
                        <span className="font-bold text-shiraz">{formatDeWert(gwpZementB)} kg CO2-eq/t</span>
                      </div>
                      <input 
                        type="range" 
                        min="100" 
                        max="550" 
                        step="10" 
                        value={gwpZementB} 
                        onChange={(e) => setGwpZementB(parseInt(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                      Vergleichsrechnung GWP (Treibhauspotenzial)
                    </h3>
                    
                    <div className="space-y-4 text-xs text-text-main/80 leading-relaxed">
                      <div>
                        <strong>Berechnung Rezeptur A (CEM I):</strong>
                        <BlockMath math={`M_{c,A} = \\frac{${bauteilVol} \\, \\text{m}^3 \\cdot ${cementGehaltA} \\, \\text{kg/m}^3}{1000} = \\color{#A3113E}{${formatDeTeX(totalCementA, 1)}} \\, \\text{t Zement}`} />
                        <BlockMath math={`GWP_A = \\frac{${formatDeTeX(totalCementA, 1)} \\, \\text{t} \\cdot ${gwpZementA} \\, \\text{kg CO}_2\\text{-eq/t}}{1000} = \\color{#A3113E}{${formatDeTeX(totalGwpA, 2)}} \\, \\text{t CO}_2\\text{-eq}`} />
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <strong>Berechnung Rezeptur B (CEM III):</strong>
                        <BlockMath math={`M_{c,B} = \\frac{${bauteilVol} \\, \\text{m}^3 \\cdot ${cementGehaltB} \\, \\text{kg/m}^3}{1000} = \\color{#A3113E}{${formatDeTeX(totalCementB, 1)}} \\, \\text{t Zement}`} />
                        <BlockMath math={`GWP_B = \\frac{${formatDeTeX(totalCementB, 1)} \\, \\text{t} \\cdot ${gwpZementB} \\, \\text{kg CO}_2\\text{-eq/t}}{1000} = \\color{#A3113E}{${formatDeTeX(totalGwpB, 2)}} \\, \\text{t CO}_2\\text{-eq}`} />
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <strong>Ergebnis GWP-Einsparung:</strong>
                        <BlockMath math={`\\Delta GWP = GWP_A - GWP_B = ${formatDeTeX(totalGwpA, 2)} - ${formatDeTeX(totalGwpB, 2)} = \\color{#A3113E}{${formatDeTeX(deltaGwp, 2)}} \\, \\text{t CO}_2\\text{-eq}`} />
                        <BlockMath math={`\\text{Prozentuale Einsparung} = \\color{#A3113E}{${formatDeTeX(percentSavings, 1)}\\%}`} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-150 text-xs text-blue-900 leading-relaxed font-normal space-y-2">
                    <div className="flex items-center gap-2 font-bold text-blue-900">
                      <TrendingUp size={18} />
                      <span>Betontechnologische Unterschiede & Beratung:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-xxs">
                      <li><strong>Hydratationswärme:</strong> CEM III/B (Hochofenzement mit hohem Hüttensandgehalt) reagiert durch den geringen Klinkeranteil extrem langsam. Die Hydratationswärme im Brückenwiderlager oder Fundament (massige Bauteile) wird drastisch verringert. Dies verhindert gefährliche Risse durch thermische Eigenspannungen!</li>
                      <li><strong>Nachbehandlung:</strong> Wegen der langsameren Hydratation baut der Beton seine Dichtigkeit in den ersten Tagen viel langsamer auf. Die Nachbehandlungsdauer (Schutz vor Austrocknung, z.B. Besprühen oder Abdecken) muss verdoppelt werden (z.B. von 3 Tagen auf 7 bis 10 Tage), um Gefügeschäden in der Randzone zu vermeiden.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 7. TAB CONTENT: BAUEN IM BESTAND --- */}
        {activeTab === 'bestand' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* SUB-TABS */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
              <button
                onClick={() => setBestandSubTab('beton')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  bestandSubTab === 'beton'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                1. Historischer Beton (DIN 1045 zu DIN EN 1992)
              </button>
              <button
                onClick={() => setBestandSubTab('stahl')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  bestandSubTab === 'stahl'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                2. Historischer Betonstahl (RU vs. RK)
              </button>
            </div>

            {bestandSubTab === 'beton' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <History className="text-shiraz" size={16} /> Historische Betongüte & Nachweisart
                    </h3>
                    
                    {/* Betonklasse Selector */}
                    <div className="space-y-2 text-xs">
                      <label className="font-bold text-slate-700 block">Historische Festigkeitsklasse (DIN 1045:1972):</label>
                      <select 
                        value={histBetonKlasse} 
                        onChange={(e) => setHistBetonKlasse(e.target.value as any)}
                        className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
                      >
                        <option value="B100">B 100 (Nominalfestigkeit 10,0 N/mm²)</option>
                        <option value="B150">B 150 (Nominalfestigkeit 15,0 N/mm²)</option>
                        <option value="B225">B 225 (Nominalfestigkeit 22,5 N/mm²)</option>
                        <option value="B300">B 300 (Nominalfestigkeit 30,0 N/mm²)</option>
                        <option value="B450">B 450 (Nominalfestigkeit 45,0 N/mm²)</option>
                        <option value="B600">B 600 (Nominalfestigkeit 60,0 N/mm²)</option>
                      </select>
                      <span className="text-xxs text-slate-500 block">Damals gemessen an Prüfwürfeln mit 200 mm Kantenlänge nach 28 Tagen Lagerung.</span>
                    </div>

                    {/* Checkbox for testing */}
                    <div className="pt-2 flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="hasPruefung" 
                        checked={hasPruefung} 
                        onChange={(e) => setHasPruefung(e.target.checked)}
                        className="rounded accent-shiraz cursor-pointer"
                      />
                      <label htmlFor="hasPruefung" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                        Bauwerksprüfung durchgeführt (Zerstörende Kernbohrungen)
                      </label>
                    </div>

                    {hasPruefung && (
                      <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-150 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-700">Mittlere Prüffestigkeit (150mm Würfel):</span>
                          <span className="text-shiraz">{formatDeZahl(pruefFestigkeit, 1)} N/mm²</span>
                        </div>
                        <input 
                          type="range" 
                          min="10.0" 
                          max="70.0" 
                          step="0.5" 
                          value={pruefFestigkeit} 
                          onChange={(e) => setPruefFestigkeit(parseFloat(e.target.value))}
                          className="w-full accent-shiraz"
                        />
                        <span className="text-xxs text-slate-500 block">Mittlerer Wert f_cm,cube der entnommenen Bohrkerne, umgerechnet auf Standard-150mm-Prüfwürfel.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                      Umrechnung nach DAfStb-Richtlinie "Bauen im Bestand"
                    </h3>
                    
                    <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal font-sans">
                      <div>
                        <strong>Schritt 1: Normierung des Probekörpers</strong>
                        <p className="mt-1 text-xxs">
                          Die historische Kantenlänge von 200 mm wird auf den heutigen 150 mm Prüfwürfel normiert:
                        </p>
                        <BlockMath math={`\\beta_{WN,150} = 0{,}95 \\cdot \\beta_{WN} = 0{,}95 \\cdot \\color{#A3113E}{${formatDeTeX(beta_WN, 1)}} = \\color{#A3113E}{${formatDeTeX(beta_WN_150, 2)}} \\, \\text{N/mm}^2`} />
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <strong>Schritt 2: Umrechnung auf Zylinderdruckfestigkeit</strong>
                        <p className="mt-1 text-xxs">
                          Das standardisierte Zylinder-zu-Würfel-Verhältnis beträgt 0,80:
                        </p>
                        <BlockMath math={`f_{ck,cyl} = 0{,}80 \\cdot \\beta_{WN,150} = 0{,}80 \\cdot \\color{#A3113E}{${formatDeTeX(beta_WN_150, 2)}} = \\color{#A3113E}{${formatDeTeX(f_ck_cyl_raw, 2)}} \\, \\text{N/mm}^2`} />
                      </div>

                      {!hasPruefung ? (
                        <div className="border-t border-slate-100 pt-3">
                          <strong>Schritt 3: Sicherheitsabschlag (fehlende Bauwerksprüfung)</strong>
                          <p className="mt-1 text-xxs text-red-700">
                            Wegen reiner Einstufung nach Aktenlage ohne Bohrkernprüfung ist ein pauschaler Abschlag von <strong>3,0 N/mm²</strong> vorgeschrieben:
                          </p>
                          <BlockMath math={`f_{ck,act} = f_{ck,cyl} - 3{,}0 = ${formatDeTeX(f_ck_cyl_raw, 2)} - 3{,}0 = \\color{#A3113E}{${formatDeTeX(f_ck_act, 2)}} \\, \\text{N/mm}^2`} />
                        </div>
                      ) : (
                        <div className="border-t border-slate-100 pt-3 bg-green-50/50 p-2.5 rounded-lg border border-green-150">
                          <strong>Schritt 3: Einstufung nach Bauwerksprüfung</strong>
                          <p className="mt-1 text-xxs text-green-700">
                            Prüfwert: <InlineMath math={`f_{cm,cube} = ${formatDeTeX(pruefFestigkeit, 1)} \\, \\text{N/mm}^2`} />. Zuordnung zur Festigkeitsklasse: <strong>{testedKlasseLabel}</strong> (<InlineMath math={`f_{ck} = ${f_ck_tested} \\, \\text{N/mm}^2`} />)
                          </p>
                        </div>
                      )}

                      <div className="border-t border-slate-100 pt-3">
                        <strong>Schritt 4: Heutiger Bemessungswert f_cd</strong>
                        <p className="mt-1 text-xxs">
                          Der Bemessungswert für die Tragfähigkeitsberechnung nach Eurocode 2 lautet:
                        </p>
                        <BlockMath math={`f_{cd} = \\alpha_{cc} \\cdot \\frac{f_{ck}}{\\gamma_C} = 0{,}85 \\cdot \\frac{\\color{#A3113E}{${formatDeTeX(f_ck_final, 1)}}}{1{,}5} = \\color{#A3113E}{${formatDeTeX(f_cd_bestand, 2)}} \\, \\text{N/mm}^2`} />
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl text-xs leading-relaxed font-normal ${
                    hasPruefung ? 'bg-green-50 border border-green-200 text-green-950' : 'bg-amber-50 border border-amber-200 text-amber-950'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                      <Sparkles size={16} />
                      <span>Tragfähigkeits-Potenzial im Bestand:</span>
                    </div>
                    <p>
                      Der Bemessungswert der Betondruckfestigkeit im Altbau beträgt für die Berechnungen <strong>{formatDeZahl(f_cd_bestand, 2)} N/mm²</strong>.
                    </p>
                    {hasPruefung ? (
                      <p className="text-xxs opacity-95 mt-1">
                        Durch die Durchführung von realen Bohrkernprüfungen entfällt der pauschale Sicherheitsabschlag. Sie erzielen eine höhere statisch anrechenbare Tragfähigkeit und vermeiden oft eine teure nachträgliche Verstärkung!
                      </p>
                    ) : (
                      <p className="text-xxs opacity-95 mt-1">
                        Achtung: Ohne physische Prüfung müssen Sie den Sicherheitsabschlag von 3,0 MPa abziehen. Tipp: Das Durchführen zerstörender Materialprüfungen am realen Objekt rechnet sich meistens wirtschaftlich extrem schnell.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {bestandSubTab === 'stahl' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <History className="text-shiraz" size={16} /> Historische Betonstahl-Kenndaten
                    </h3>
                    
                    {/* Stahlklasse Selector */}
                    <div className="space-y-2 text-xs">
                      <label className="font-bold text-slate-700 block">Historische Betonstahl-Art:</label>
                      <select 
                        value={histStahlKlasse} 
                        onChange={(e) => setHistStahlKlasse(e.target.value as any)}
                        className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
                      >
                        <option value="BSt220">Betonstahl I (BSt 220/340 RU) - Glatt, warmgewalzt, unberuhigt</option>
                        <option value="BSt420">Betonstahl III (BSt 420/500 RU) - Rippen/Sonderform, unberuhigt</option>
                        <option value="BSt500">Betonstahl IV (BSt 500/550 RK) - Gerippt, kaltverformt</option>
                      </select>
                    </div>

                    {/* Durchmesser Slider */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-700">Stabdurchmesser Ø:</span>
                        <span className="text-shiraz">{formatDeWert(diameterStahl)} mm</span>
                      </div>
                      <input 
                        type="range" 
                        min="6" 
                        max="32" 
                        step="2" 
                        value={diameterStahl} 
                        onChange={(e) => setDiameterStahl(parseInt(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                      Verbundeigenschaften & Zugkapazität (Eurocode 2)
                    </h3>
                    
                    <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal font-sans">
                      <div>
                        <strong>Schritt 1: Bemessungswert der Streckgrenze f_yd</strong>
                        <p className="mt-1 text-xxs">
                          Berechnung mit dem Materialsicherheitsbeiwert <InlineMath math="\gamma_S = 1{,}15" />:
                        </p>
                        <BlockMath math={`f_{yd} = \\frac{f_{yk}}{\\gamma_S} = \\frac{\\color{#A3113E}{${f_yk_stahl}}}{1{,}15} = \\color{#A3113E}{${formatDeTeX(f_yd_stahl, 1)}} \\, \\text{N/mm}^2`} />
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <strong>Schritt 2: Zugkapazität eines Einzelstabs F_yd</strong>
                        <BlockMath math={`A_s = \\frac{\\pi \\cdot d^2}{4} = \\frac{\\pi \\cdot \\color{#A3113E}{${formatDeTeXWert(diameterStahl)}}^2}{4} = \\color{#A3113E}{${formatDeTeX(steelArea, 1)}} \\, \\text{mm}^2`} />
                        <BlockMath math={`F_{yd} = A_s \\cdot f_{yd} = \\color{#A3113E}{${formatDeTeX(steelArea, 1)}} \\cdot \\color{#A3113E}{${formatDeTeX(f_yd_stahl, 1)}} \\cdot 10^{-3} = \\color{#A3113E}{${formatDeTeX(yieldCapacity, 1)}} \\, \\text{kN}`} />
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <strong>Schritt 3: Verbund- und Schweißeigenschaften</strong>
                        <div className="mt-1 text-xxs leading-normal">
                          {histStahlKlasse === 'BSt220' && (
                            <div className="text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-150 space-y-1">
                              <p className="font-bold">Achtung: Unberuhigt vergossener glatter Rundstahl (BSt 220 RU):</p>
                              <p>
                                - <strong>Keine Schweißeignung!</strong> Schweißen ist aufgrund der Gefahr von Heißrissen und plötzlichem Sprödbruch strengstens verboten.<br />
                                - <strong>Extrem geringe Verbundfestigkeit:</strong> Weil glatte Oberfläche, muss die Verbundspannung um 70% abgemindert werden (<InlineMath math="\eta_1 = 0{,}3" />).<br />
                                - <strong>Hakenverankerung zwingend erforderlich:</strong> Die Kraftübertragung kann statisch nicht allein durch Haftung am Stab entlang erfolgen. Winkelhaken oder Endhaken sind an Stabenden zwingend unerlässlich!
                              </p>
                            </div>
                          )}
                          {histStahlKlasse === 'BSt420' && (
                            <div className="text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-150 space-y-1">
                              <p className="font-bold">Hinweis: Betonstahl III (BSt 420/500 RU):</p>
                              <p>
                                - <strong>Schweißeignung kritisch:</strong> Meist unberuhigt vergossen, daher Schweißen nur in Ausnahmefällen unter strengen metallurgischen Sonderprüfungen gestattet.<br />
                                - <strong>Geringere Verbundwirkung:</strong> Die historische Schrägrippung ist unregelmäßiger und liefert eine geringere Verbundfestigkeit als moderne Betonstähle (<InlineMath math="\eta_1 \approx 0{,}7" />).
                              </p>
                            </div>
                          )}
                          {histStahlKlasse === 'BSt500' && (
                            <div className="text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-150 space-y-1">
                              <p className="font-bold">Hinweis: Kaltverformter gerippter Stahl (BSt 500 RK):</p>
                              <p>
                                - <strong>Bedingt schweißgeeignet:</strong> Kaltverformter Stahl verliert beim Erwärmen an Festigkeit. Schweißen vermindert die Streckgrenze in der Wärmeeinflusszone.<br />
                                - <strong>Gute Verbundwirkung:</strong> Gerippte Oberfläche erlaubt normalen Verbundnachweis (<InlineMath math="\eta_1 = 1{,}0" />).
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 8. TAB CONTENT: SCHALLSCHUTZ (DIN 4109) --- */}
        {activeTab === 'schallschutz' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <Volume2 className="text-shiraz" size={18} />
                <span>Bauakustik: Luftschalldämmung massiver Bauteile nach DIN 4109:2018</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                <strong>Was?</strong> Berechnet wird die flächenbezogene Masse <InlineMath math="m'" /> in <InlineMath math="\text{kg/m}^2" />, das Direktschalldämm-Maß <InlineMath math="R_w" /> und das resultierende Bauschalldämm-Maß <InlineMath math="R'_w" /> unter Berücksichtigung von Flankenübertragungen. <br />
                <strong>Warum?</strong> Schutz von Menschen in Wohn- und Arbeitsräumen vor unzumutbarer Schallübertragung aus fremden Wohnbereichen oder Treppenräumen gemäß <strong>DIN 4109-1:2018</strong> und Landesbauordnungen (LBO). <br />
                <strong>Wie?</strong> Bei einschaligen biegesteifen Massivbauteilen dominiert das <strong>Massegesetz</strong>: Je schwerer das Bauteil pro Quadratmeter, desto höher ist sein Schalldämmmaß. Über Flankenkorrekturwerte <InlineMath math="K_F" /> wird die reale Übertragung im Gebäude abgebildet.
              </p>
            </div>

            {/* INTERACTIVE CONTROLS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-5">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>Wandparameter &amp; Flankensituation</span>
                  <Sliders size={16} className="text-shiraz" />
                </h3>

                {/* Preset-Wandbaustoff */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Wandbaustoff-Vorauswahl:</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'ks', name: 'Kalksandstein (KS)', rho: 2000, defD: 17.5 },
                      { id: 'beton', name: 'Stahlbeton (C25/30)', rho: 2400, defD: 20.0 },
                      { id: 'hlz', name: 'Hochlochziegel (HLz)', rho: 1200, defD: 24.0 },
                      { id: 'porenbeton', name: 'Porenbeton (PB)', rho: 500, defD: 24.0 }
                    ].map(mat => (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => {
                          setSchallWandTyp(mat.id as any);
                          setSchallRohdichte(mat.rho);
                          setSchallDicke(mat.defD);
                        }}
                        className={`p-2 rounded-lg border text-left font-sans cursor-pointer transition-all ${
                          schallWandTyp === mat.id 
                            ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] leading-tight">{mat.name}</div>
                        <div className={`text-[9.5px] font-mono ${schallWandTyp === mat.id ? 'text-white/80' : 'text-slate-400'}`}>
                          {formatDeWert(mat.rho)} kg/m³
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wanddicke Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Wanddicke Rohbauteil (d):</span>
                    <span className="text-shiraz font-mono">{formatDeZahl(schallDicke, 1)} cm</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="36.5" 
                    step="0.5" 
                    value={schallDicke} 
                    onChange={(e) => setSchallDicke(parseFloat(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>10,0 cm</span>
                    <span>17,5 cm (Standard KS)</span>
                    <span>24,0 cm</span>
                    <span>36,5 cm</span>
                  </div>
                </div>

                {/* Rohdichte Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Trockenrohdichte (ρ):</span>
                    <span className="text-shiraz font-mono">{formatDeWert(schallRohdichte)} kg/m³</span>
                  </div>
                  <input 
                    type="range" 
                    min="400" 
                    max="2600" 
                    step="50" 
                    value={schallRohdichte} 
                    onChange={(e) => setSchallRohdichte(parseInt(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                </div>

                {/* Beidseitiger Putz Checkbox */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Beidseitiger Putzauftrag</span>
                    <span className="text-[11px] text-slate-500">2 × 15 mm Gips-/Kalkgipsputz (+40 kg/m²)</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={schallPutz}
                    onChange={(e) => setSchallPutz(e.target.checked)}
                    className="w-4 h-4 accent-shiraz cursor-pointer"
                  />
                </div>

                {/* Flankensituation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Flankenübertragung (K_F):</label>
                  <select 
                    value={schallFlanke}
                    onChange={(e) => setSchallFlanke(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-800"
                  >
                    <option value="entkoppelt">Akustisch entkoppelt / Vorsatzschale (KF = 0 dB)</option>
                    <option value="massiv">Schwere Massivflanken &gt; 300 kg/m² (KF = 2 dB)</option>
                    <option value="leicht">Leichte Flankenbauteile / Porenbeton (KF = 4 dB)</option>
                  </select>
                </div>

                {/* Schutzziel */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Gefordertes Schutzziel (DIN 4109-1):</label>
                  <select 
                    value={schallSollTyp}
                    onChange={(e) => setSchallSollTyp(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-800"
                  >
                    <option value="wohnungstrenn">Wohnungstrennwand (erf. R&apos;w ≥ 53 dB)</option>
                    <option value="treppenhaus">Treppenraumwand zu Aufenthaltsräumen (erf. R&apos;w ≥ 52 dB)</option>
                    <option value="behandlung">Arztpraxis / Untersuchungsräume (erf. R&apos;w ≥ 47 dB)</option>
                    <option value="doppelhaus">Doppel-/Reihenhaustrennwand zweischalig (erf. R&apos;w ≥ 59 dB)</option>
                  </select>
                </div>
              </div>

              {/* CALCULATION BREAKDOWN */}
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                    Schrittweise akustische Berechnung (DIN 4109)
                  </h3>

                  <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal font-sans">
                    {/* Step 1: Flächenbezogene Masse */}
                    <div>
                      <strong>Schritt 1: Flächenbezogene Bauteilmasse m&apos;</strong>
                      <p className="mt-1 text-xxs text-slate-500">
                        Produkt aus Wanddicke <InlineMath math="d" /> und Rohdichte <InlineMath math="\rho" /> zuzüglich Putzmasse:
                      </p>
                      <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                        <BlockMath math={`m'_0 = \\frac{${formatDeTeX(schallDicke, 1)}}{100} \\, \\text{m} \\times ${schallRohdichte} \\, \\text{kg/m}^3 = ${formatDeTeX(schall_m0, 1)} \\, \\text{kg/m}^2`} />
                        <BlockMath math={`m' = ${formatDeTeX(schall_m0, 1)} + ${schallPutz ? 40 : 0} = \\color{#A3113E}{\\mathbf{${formatDeTeX(schall_m_total, 1)}}} \\, \\text{kg/m}^2`} />
                      </div>
                    </div>

                    {/* Step 2: Direktes Schalldämmmaß */}
                    <div className="border-t border-slate-100 pt-3">
                      <strong>Schritt 2: Direktes Schalldämm-Maß R_w (Massekurve DIN 4109)</strong>
                      <p className="mt-1 text-xxs text-slate-500">
                        Für massive biegesteife Schalen (<InlineMath math="m' \ge 150 \, \text{kg/m}^2" />) nach DIN 4109 Beiblatt 1:
                      </p>
                      <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                        <BlockMath math={`R_w = 32{,}4 \\cdot \\lg(m') - 26{,}0 = 32{,}4 \\cdot \\lg(${formatDeTeX(schall_m_total, 1)}) - 26{,}0 = \\color{#A3113E}{\\mathbf{${formatDeTeX(schall_Rw, 1)}}} \\, \\text{dB}`} />
                      </div>
                    </div>

                    {/* Step 3: Bauschalldämmmaß */}
                    <div className="border-t border-slate-100 pt-3">
                      <strong>Schritt 3: Bauschalldämm-Maß R&apos;_w mit Flankenabzug K_F</strong>
                      <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                        <BlockMath math={`R'_w = R_w - K_F = ${formatDeTeX(schall_Rw, 1)} - ${schall_KF} = \\color{#A3113E}{\\mathbf{${formatDeTeX(schall_R_prime_w, 1)}}} \\, \\text{dB}`} />
                      </div>
                    </div>

                    {/* Step 4: Soll-Ist-Vergleich */}
                    <div className="border-t border-slate-100 pt-3">
                      <div className={`p-4 rounded-xl border ${
                        schall_passed 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                          : 'bg-rose-50 border-rose-300 text-rose-900'
                      }`}>
                        <div className="flex items-center gap-2 font-bold text-sm">
                          {schall_passed ? <CheckCircle2 size={18} className="text-emerald-700" /> : <AlertTriangle size={18} className="text-rose-700" />}
                          <span>{schall_passed ? 'Normnachweis ERFÜLLT' : 'Normnachweis NICHT ERFÜLLT'}</span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed">
                          Vorhandenes Bauschalldämm-Maß <strong>R&apos;_w = {formatDeZahl(schall_R_prime_w, 1)} dB</strong> vs. normative Mindestanforderung <strong>R&apos;_w,erf = {formatDeWert(schall_erf)} dB</strong> für {schall_soll_werte[schallSollTyp].label}.
                        </p>
                        {!schall_passed && (
                          <p className="mt-2 text-xxs font-medium text-rose-800">
                            Empfohlene Gegenmaßnahmen: Wanddicke vergrößern (z.B. auf 24 cm KS), Baustoff mit höherer Rohdichteklasse wählen (RDK ≥ 2,0) oder flankierende Bauteile durch elastische Entkopplung optimieren.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 9. TAB CONTENT: BRANDSCHUTZ & HEISSBEMESSUNG --- */}
        {activeTab === 'brandschutz' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <Flame className="text-shiraz" size={18} />
                <span>Brandschutz: Heißbemessung nach Eurocode 5 (Holz) &amp; Eurocode 2 (Beton)</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                <strong>Was?</strong> Berechnung des Brandwiderstands tragender Bauteile unter der <strong>Einheits-Temperaturzeitkurve (ETK)</strong> nach DIN EN 1363-1 / DIN 4102-2. <br />
                <strong>Warum?</strong> Nachweis der Mindest-Feuerwiderstandsdauer (R30 bis R120) zur Rettung von Menschenleben und Gewährleistung sicherer Löscharbeiten der Feuerwehr gemäß Musterbauordnung (MBO). <br />
                <strong>Wie?</strong> Im Holzbau über die <strong>Methode des effektiven Restquerschnitts</strong> (konstante Abbrandrate <InlineMath math="\beta" /> plus Entfestigungszone <InlineMath math="d_0 = 7\,\text{mm}" />). Im Massivbau über Mindestbauteilbreiten und Achsabstände der Bewehrung.
              </p>
            </div>

            {/* Sub-Tab Selector for Brandschutz */}
            <div className="flex gap-2 border-b border-home-grau/20 pb-3">
              <button
                type="button"
                onClick={() => setBrandSubTab('holz_abbrand')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  brandSubTab === 'holz_abbrand'
                    ? 'bg-shiraz text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                🌲 Holzbau: Effektiver Restquerschnitt (EC5-1-2)
              </button>
              <button
                type="button"
                onClick={() => setBrandSubTab('beton_tabelle')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  brandSubTab === 'beton_tabelle'
                    ? 'bg-shiraz text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                🧱 Stahlbeton: Mindestabmessungen &amp; Achsabstand (EC2-1-2)
              </button>
            </div>

            {brandSubTab === 'holz_abbrand' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
                {/* Controls Left */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span>Holzträger-Eingaben (Brandfall)</span>
                    <Flame size={16} className="text-shiraz" />
                  </h3>

                  {/* Holzart */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Holzart &amp; Festigkeit:</label>
                    <select
                      value={holzArtBrand}
                      onChange={(e) => setHolzArtBrand(e.target.value as any)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-800"
                    >
                      <option value="bsh">Brettschichtholz GL28h (β = 0,70 mm/min, fmk = 28 N/mm²)</option>
                      <option value="c24">Vollholz Nadelholz C24 (β = 0,65 mm/min, fmk = 24 N/mm²)</option>
                      <option value="laubholz">Laubholz D30 / Buche (β = 0,50 mm/min, fmk = 30 N/mm²)</option>
                    </select>
                  </div>

                  {/* Querschnitt b x h */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Breite b [cm]:</label>
                      <input 
                        type="number" min="0" 
                        value={holzBreite}
                        onChange={(e) => setHolzBreite(Math.max(8, parseFloat(e.target.value) || 8))}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Höhe h [cm]:</label>
                      <input 
                        type="number" min="0" 
                        value={holzHoehe}
                        onChange={(e) => setHolzHoehe(Math.max(12, parseFloat(e.target.value) || 12))}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Brandbeanspruchung */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Beflammung:</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setBrandBeanspruchung('3_seitig')}
                        className={`p-2 rounded-lg border text-center font-sans cursor-pointer transition-all ${
                          brandBeanspruchung === '3_seitig'
                            ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        3-seitig (Deckenbalken)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBrandBeanspruchung('4_seitig')}
                        className={`p-2 rounded-lg border text-center font-sans cursor-pointer transition-all ${
                          brandBeanspruchung === '4_seitig'
                            ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        4-seitig (freie Stütze)
                      </button>
                    </div>
                  </div>

                  {/* Branddauer */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Feuerwiderstandsdauer:</label>
                    <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                      {[30, 60, 90, 120].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setBrandDauerMin(mins as any)}
                          className={`p-2 rounded-lg border text-center cursor-pointer transition-all font-bold ${
                            brandDauerMin === mins 
                              ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          R{formatDeWert(mins)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Biegemoment Kaltzustand */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Biegemoment Kaltzustand (M_Ed):</span>
                      <span className="text-shiraz font-mono">{formatDeWert(momentKaltEd)} kNm</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="150" 
                      step="5" 
                      value={momentKaltEd} 
                      onChange={(e) => setMomentKaltEd(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                  </div>
                </div>

                {/* Calculation Right */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                    Nachweis nach DIN EN 1995-1-2 (Restquerschnittsmethode)
                  </h3>

                  <div className="space-y-3.5 text-xs text-text-main/80 font-sans">
                    <div>
                      <strong>Schritt 1: Rechnerische Abbrandtiefe d_char,n &amp; d_ef</strong>
                      <p className="mt-0.5 text-xxs text-slate-500">
                        Zuschlag <InlineMath math="d_0 = 7\,\text{mm}" /> für die temperaturgeschädigte Kohleschicht:
                      </p>
                      <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                        <BlockMath math={`d_{\\text{char},n} = ${formatDeTeXWert(beta_char)} \\cdot ${brandDauerMin} = ${formatDeTeX(d_char_n, 1)} \\, \\text{mm}`} />
                        <BlockMath math={`d_{\\text{ef}} = ${formatDeTeX(d_char_n, 1)} + 7{,}0 = \\color{#A3113E}{\\mathbf{${formatDeTeX(d_ef, 1)}}} \\, \\text{mm}`} />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-2.5">
                      <strong>Schritt 2: Effektiver Restquerschnitt b_ef × h_ef</strong>
                      <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                        <BlockMath math={`b_{\\text{ef}} = ${formatDeTeXWert(holzBreite * 10)} - 2 \\cdot ${formatDeTeX(d_ef, 1)} = \\mathbf{${formatDeTeX(b_ef_mm, 1)}} \\, \\text{mm}`} />
                        <BlockMath math={`h_{\\text{ef}} = ${holzHoehe * 10} - ${brandBeanspruchung === '4_seitig' ? '2 \\cdot ' : ''}${formatDeTeX(d_ef, 1)} = \\mathbf{${formatDeTeX(h_ef_mm, 1)}} \\, \\text{mm}`} />
                        <BlockMath math={`W_{\\text{ef}} = \\frac{b_{\\text{ef}} \\cdot h_{\\text{ef}}^2}{6} = \\mathbf{${formatDeTeX((W_ef_mm3 / 1000), 0)}} \\, \\text{cm}^3`} />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-2.5">
                      <strong>Schritt 3: Heißtragfähigkeit M_fi,Rd vs. Einwirkung M_fi,Ed</strong>
                      <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                        <BlockMath math={`M_{\\text{fi,Ed}} = 0{,}60 \\cdot ${formatDeTeXWert(momentKaltEd)} = \\mathbf{${formatDeTeX(M_fi_Ed, 1)}} \\, \\text{kNm}`} />
                        <BlockMath math={`M_{\\text{fi,Rd}} = W_{\\text{ef}} \\cdot f_{m,\\text{fi},d} = \\mathbf{${formatDeTeX(M_fi_Rd, 1)}} \\, \\text{kNm}`} />
                        <BlockMath math={`\\eta_{\\text{fi}} = \\frac{${formatDeTeX(M_fi_Ed, 1)}}{${formatDeTeX(M_fi_Rd, 1)}} = \\color{#A3113E}{\\mathbf{${formatDeTeX(eta_brand_holz, 2)}}} \\, ${brand_holz_passed ? '\\le 1{,}0' : '> 1{,}0'}`} />
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-xl border ${
                      brand_holz_passed 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                    }`}>
                      <div className="flex items-center gap-2 font-bold text-xs">
                        {brand_holz_passed ? <CheckCircle2 size={16} className="text-emerald-700" /> : <AlertTriangle size={16} className="text-rose-700" />}
                        <span>{brand_holz_passed ? `Feuerwiderstand R${brandDauerMin} ERFÜLLT (Ausnutzung ${formatDeZahl((eta_brand_holz * 100), 0)} %)` : `Feuerwiderstand R${brandDauerMin} NICHT ERFÜLLT (Überlastung ${formatDeZahl((eta_brand_holz * 100), 0)} %)`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {brandSubTab === 'beton_tabelle' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
                <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                  Stahlbeton-Brandschutz: Tabellarische Mindestmaße nach DIN EN 1992-1-2
                </h4>
                <p className="text-xs text-text-main/70">
                  Die Heißbemessung von Betonbauteilen erfolgt in der Praxis meist über das normative Tabellenverfahren. Maßgebend sind die Mindestbauteildicke <InlineMath math="b_{\text{min}}" /> und der Achsabstand <InlineMath math="a" /> der Bewehrungsstäbe zum Brandrand, um die Stahltemperatur unter <InlineMath math="500^\circ\text{C}" /> zu halten.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                        <th className="py-2">Brandklasse</th>
                        <th className="py-2">Einfeldträger Mindestbreite b_min</th>
                        <th className="py-2">Achsabstand a (Balken)</th>
                        <th className="py-2">Plattendicke h_min</th>
                        <th className="py-2">Stützen Mindestmaß b_min</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                      <tr>
                        <td className="py-2.5 font-bold text-shiraz">R30 (30 min)</td>
                        <td className="py-2.5 font-mono">80 mm</td>
                        <td className="py-2.5 font-mono">25 mm</td>
                        <td className="py-2.5 font-mono">60 mm</td>
                        <td className="py-2.5 font-mono">200 mm (a = 25 mm)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-shiraz">R60 (60 min)</td>
                        <td className="py-2.5 font-mono">120 mm</td>
                        <td className="py-2.5 font-mono">35 mm</td>
                        <td className="py-2.5 font-mono">80 mm</td>
                        <td className="py-2.5 font-mono">250 mm (a = 35 mm)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-shiraz">R90 (90 min)</td>
                        <td className="py-2.5 font-mono">160 mm</td>
                        <td className="py-2.5 font-mono">45 mm</td>
                        <td className="py-2.5 font-mono">100 mm</td>
                        <td className="py-2.5 font-mono">300 mm (a = 45 mm)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-shiraz">R120 (120 min)</td>
                        <td className="py-2.5 font-mono">200 mm</td>
                        <td className="py-2.5 font-mono">55 mm</td>
                        <td className="py-2.5 font-mono">120 mm</td>
                        <td className="py-2.5 font-mono">350 mm (a = 55 mm)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                  <strong>Achtung bei hochfestem Beton (UHPC / &gt; C55/67):</strong> Abplatzungsgefahr durch inneren Dampfdruck! Nach DIN EN 1992-1-2 ist bei hochfestem Beton die Zugabe von mindestens 2 kg/m³ Polypropylen-Fasern (PP-Fasern) zwingend erforderlich.
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODULE FOOTER WITH NORM REFERENCES AND STANDARDS */}
      <ModuleFooter 
        wikipedia={[
          { title: 'U-Wert', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient' },
          { title: 'Eurocode 2 (Betonbau)', url: 'https://de.wikipedia.org/wiki/Eurocode_2' },
          { title: 'Eurocode 5 (Holzbau)', url: 'https://de.wikipedia.org/wiki/Eurocode_5' },
          { title: 'Eurocode 6 (Mauerwerk)' },
          { title: 'Schallschutz', url: 'https://de.wikipedia.org/wiki/Schallschutz' },
          { title: 'Brandschutz', url: 'https://de.wikipedia.org/wiki/Brandschutz' },
          { title: 'Karbonatisierung (Beton)' },
          { title: 'Treibhauspotential (GWP)', url: 'https://de.wikipedia.org/wiki/Treibhauspotenzial' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024',
          'Zement-Merkblatt B12: Mischungsentwurf für Normalbeton (InformationsZentrum Beton)',
          'Fasold, W.; Veres, E.: Schallschutz und Raumakustik in der Praxis. 2. Aufl., Berlin: Verlag Bauwesen 2003',
          'Klingsch, W. et al.: Brandschutz im Bauwesen. Berlin: Springer 2018'
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 6946 (Wärmedurchlasswiderstand und Wärmedurchgangskoeffizient)' },
          { title: 'DIN 1045-2 / DIN EN 206 (Tragwerke aus Beton, Stahlbeton und Spannbeton - Betonfestlegung)' },
          { title: 'DIN EN 1992-1-1 & DIN EN 1992-1-2 (Eurocode 2: Stahlbetontragwerke - Allgemeine Regeln & Brandschutz)' },
          { title: 'DIN EN 1995-1-1 & DIN EN 1995-1-2 (Eurocode 5: Holzbauten - Allgemeine Regeln & Brandschutz)' },
          { title: 'DIN EN 1996-3 (Eurocode 6: Vereinfachte Berechnungsmethoden für Mauerwerksbauten)' },
          { title: 'DIN 4109-1:2018-01 (Schallschutz im Hochbau - Mindestanforderungen)' },
          { title: 'DAfStb-Richtlinie: Bauen im Bestand (März 2017)' }
        ]}
        formeln={[
          {
            formel: 'U = \\frac{1}{R_{si} + \\sum \\frac{d_i}{\\lambda_i} + R_{se}}',
            erklaerung: 'Berechnung des Wärmedurchgangskoeffizienten eines mehrschichtigen Bauteils mit stationärem Wärmestrom.',
            quelle: 'DIN EN ISO 6946'
          },
          {
            formel: 'R_w = 32{,}4 \\cdot \\lg(m\') - 26{,}0',
            erklaerung: 'Direktschalldämm-Maß einschaliger Massivbauteile aus der flächenbezogenen Masse nach DIN 4109 Massekurve.',
            quelle: 'DIN 4109 Beiblatt 1'
          },
          {
            formel: 'd_{\\text{ef}} = \\beta_n \\cdot t_{\\text{fi}} + k_0 \\cdot d_0',
            erklaerung: 'Effektive Abbrandtiefe im Holzbau unter Normbrandbeanspruchung nach der Restquerschnittsmethode.',
            quelle: 'DIN EN 1995-1-2'
          },
          {
            formel: '\\mu_{Ed} = \\frac{M_{Ed}}{b \\cdot d^2 \\cdot f_{cd}}',
            erklaerung: 'Dimensionsloses Biegemoment zur Bestimmung der Biegebewehrung und Überprüfung der Betondruckzone.',
            quelle: 'DIN EN 1992-1-1'
          },
          {
            formel: '\\sigma_{c,0,d} \\le k_c \\cdot f_{c,0,d}',
            erklaerung: 'Zentrischer Drucknachweis unter Berücksichtigung der Knickgefahr durch den Abminderungsbeiwert k_c.',
            quelle: 'DIN EN 1995-1-1'
          },
          {
            formel: 'N_{Rd} = \\Phi \\cdot t \\cdot f_d',
            erklaerung: 'Vertikaler Traglastwiderstand pro Meter Wandlänge unter Berücksichtigung von Schlankheit und Lastexzentrizität.',
            quelle: 'DIN EN 1996-3'
          },
          {
            formel: 'd_k = k \\cdot \\sqrt{t}',
            erklaerung: 'Karbonatisierungstiefe über das Quadratwurzel-Zeit-Gesetz (Diffusionskinetik nach Fick).',
            quelle: 'DIN EN 1992-1-1'
          }
        ]}
      />
    </div>
  );
}
