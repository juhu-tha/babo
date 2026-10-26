import React, { useState } from 'react';
import { MU_LIM_STAHL } from '@/src/calc/biegung';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { GruppierteModuleTabs } from '@/src/components/ui/GruppierteModuleTabs';
import { Calculator } from 'lucide-react';
import { RECHNUNG_GRUPPEN } from './beispielrechnungen/daten';
import type { RechnungReiter } from './beispielrechnungen/daten';
import RechnungUWert from './beispielrechnungen/RechnungUWert';
import RechnungBeton from './beispielrechnungen/RechnungBeton';
import RechnungStahlbeton from './beispielrechnungen/RechnungStahlbeton';
import RechnungHolzbau from './beispielrechnungen/RechnungHolzbau';
import RechnungMauerwerk from './beispielrechnungen/RechnungMauerwerk';
import RechnungNachhaltigkeit from './beispielrechnungen/RechnungNachhaltigkeit';
import RechnungBestand from './beispielrechnungen/RechnungBestand';
import RechnungSchallschutz from './beispielrechnungen/RechnungSchallschutz';
import RechnungBrandschutz from './beispielrechnungen/RechnungBrandschutz';
import inhalt from '@/content/beispielrechnungen/Beispielrechnungen.json';
import { MdText } from '@/src/components/inhalt/MdText';

/** Reiterleiste nur ohne festen Einsprung (forceTab); sonst wird der Inhalt unverändert durchgereicht. */
function RechnungReiterRahmen({ zeigen, aktiv, onWechsel, children }: { zeigen: boolean; aktiv: RechnungReiter; onWechsel: (t: RechnungReiter) => void; children: React.ReactNode }) {
  if (!zeigen) return <>{children}</>;
  return (
    <GruppierteModuleTabs
      label={inhalt.werte.beispielrechnungenBereiche}
      gruppen={RECHNUNG_GRUPPEN}
      aktiv={aktiv}
      onWechsel={onWechsel}
      className="my-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20"
    >
      <div className="mt-6">{children}</div>
    </GruppierteModuleTabs>
  );
}

interface BeispielrechnungenProps {
  forceTab?: RechnungReiter;
}

export default function Beispielrechnungen({ forceTab }: BeispielrechnungenProps = {}) {
  const [localActiveTab, setLocalActiveTab] = useState<RechnungReiter>('u_wert');
  const activeTab = forceTab || localActiveTab;

  const setActiveTab = (tab: RechnungReiter) => {
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

  // Specifications based on DIN 1045-2 & DIN EN 206
  // DIN 1045-2, Tab. F.2.1: XC4 max. w/z = 0,60, z_min = 280 kg/m³; XD3 max. w/z = 0,45, z_min = 320 kg/m³
  // For XD3: max w/z = 0.45, min cement = 320 kg/m³
  const maxWz = targetExposure === 'XC4' ? 0.60 : 0.45;
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

  const k_factor = kAddType === 'flugasche' ? 0.4 : 1.0; // DIN 1045-2: Flugasche k = 0,4; Silikastaub k = 1,0
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
  const mu_lim = MU_LIM_STAHL; // µ_Eds,lim ≈ 0,296 für ξ_lim = 0,45 (DIN EN 1992-1-1/NA, 5.4.1), wie src/calc/biegung.ts

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

  // Material parameters
  const f_c0k = timberGrade === 'C24' ? 21 : 24; // f_c,0,k nach DIN EN 338: C24 = 21, C30 = 24 N/mm²
  const E_005 = timberGrade === 'C24' ? 7400 : 8000; // 5th-percentile modulus of elasticity in N/mm²
  const k_mod = 0.90; // KLED kurz (maßgebende kurzzeitige Einwirkung angenommen), NKL 1 und 2 (DIN EN 1995-1-1, Tab. 3.1)
  const gamma_M = 1.3; // Solid timber partial factor

  const f_c0d = k_mod * f_c0k / gamma_M; // design compressive strength

  // Cross section properties
  const A_wood = colWidth * colHeight; // cm²
  const I_wood = (colWidth * Math.pow(colHeight, 3)) / 12; // cm⁴
  const i_radius = Math.min(colWidth, colHeight) / Math.sqrt(12); // Trägheitsradius der schwachen Achse in cm
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

  // --- 5. MAUERWERK: Zustand und Rechenkern in RechnungMauerwerk (src/calc/mauerwerk.ts) ---

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

  // Convert 200-mm cube to standard 150-mm cube: beta_WN,150 = beta_WN,200 / 0.95
  const beta_WN_150 = beta_WN / 0.95;
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

  const schall_soll_werte = inhalt.daten["Beispielrechnungen.schall_soll_werte"];
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

  // Ideelle Abbrandraten β_n nach DIN EN 1995-1-2, Tab. 3.1 (Verfahren mit reduziertem Querschnitt):
  // Nadelvollholz 0,8; Brettschichtholz 0,7; Laubholz mit ρ_k ≥ 450 kg/m³ 0,55 mm/min
  const beta_char = holzArtBrand === 'bsh' ? 0.70 : holzArtBrand === 'laubholz' ? 0.55 : 0.80; // mm/min
  const d_char_n = beta_char * brandDauerMin; // mm
  const d_ef = d_char_n + 7.0; // mm (Zuschlag k0 * d0 = 7 mm für Holzentfestigung)
  const b_ef_mm = Math.max(0, (holzBreite * 10) - (2 * d_ef)); // beidseitig im Feuer; 0 = vollständig abgebrannt
  const h_ef_mm = Math.max(0, brandBeanspruchung === '4_seitig' ? (holzHoehe * 10) - (2 * d_ef) : (holzHoehe * 10) - d_ef);
  const W_ef_mm3 = (b_ef_mm * Math.pow(h_ef_mm, 2)) / 6;
  const f_mk_brand = holzArtBrand === 'bsh' ? 28 : holzArtBrand === 'laubholz' ? 30 : 24; // N/mm²
  const k_fi = holzArtBrand === 'bsh' ? 1.15 : 1.25; // DIN EN 1995-1-2, Tab. 2.1: Vollholz 1,25; Brettschichtholz 1,15
  const f_m_fi_d = (1.0 * k_fi * f_mk_brand) / 1.0; // gamma_M,fi = 1.0
  const M_fi_Rd = (W_ef_mm3 * f_m_fi_d) / 1000000; // kNm
  const M_fi_Ed = 0.60 * momentKaltEd; // Reduktionsbeiwert eta_fi approx 0.60 nach EC5
  const eta_brand_holz = M_fi_Rd > 0 ? M_fi_Ed / M_fi_Rd : Infinity; // Restquerschnitt vollständig abgebrannt
  const brand_holz_passed = eta_brand_holz <= 1.0;

  // Beton Brand:
  const [betonBauteilBrand, setBetonBauteilBrand] = useState<'balken' | 'stuetze'>('balken');
  const [betonBrandKlasse, setBetonBrandKlasse] = useState<'R30' | 'R60' | 'R90' | 'R120'>('R90');

  return (
    <div className="flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Calculator className="text-shiraz" /><MdText text={inhalt.texte.interaktiveBeispielrechnungenSchrittFür} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.verstehenSieBautechnischeNachweise} /></p>
        </div>

        {/* TAB NAVIGATION (AP 3.8: 6 Hauptreiter, zweite Ebene für Bauphysik und Tragwerksnachweise) */}
        <RechnungReiterRahmen zeigen={!forceTab} aktiv={localActiveTab} onWechsel={setActiveTab}>
        {/* --- 1. TAB CONTENT: U-WERT --- */}
        {activeTab === 'u_wert' && <RechnungUWert R_T={R_T} R_concrete={R_concrete} R_insulation={R_insulation} R_plaster={R_plaster} U_value={U_value} gegLimit={gegLimit} setUConcreteThick={setUConcreteThick} setUInsuThick={setUInsuThick} setUPlasterThick={setUPlasterThick} uConcreteLambda={uConcreteLambda} uConcreteThick={uConcreteThick} uInsuLambda={uInsuLambda} uInsuThick={uInsuThick} uPlasterLambda={uPlasterLambda} uPlasterThick={uPlasterThick} />}

        {/* --- 2. TAB CONTENT: BETON TECHNOLOGIE --- */}
        {activeTab === 'beton' && <RechnungBeton V_a={V_a} V_air={V_air} V_c={V_c} V_w={V_w} actualWz={actualWz} aggregateMass={aggregateMass} beta_cc={beta_cc} betonSubTab={betonSubTab} cementContent={cementContent} cementFromWz={cementFromWz} consClass={consClass} f_ck_t={f_ck_t} f_cm_28={f_cm_28} f_cm_t={f_cm_t} finalFreshTemp={finalFreshTemp} freshConcreteDensity={freshConcreteDensity} heat_agg={heat_agg} heat_cement={heat_cement} heat_ice_melting={heat_ice_melting} heat_liquid_water={heat_liquid_water} kAddType={kAddType} kAddition={kAddition} kCement={kCement} kWater={kWater} k_credited_addition={k_credited_addition} k_factor={k_factor} k_max_allowed_addition={k_max_allowed_addition} k_max_ratio={k_max_ratio} k_w_z_eq={k_w_z_eq} k_w_z_pure={k_w_z_pure} mAggregateInput={mAggregateInput} mCementInput={mCementInput} mIceInput={mIceInput} mLiquidWater={mLiquidWater} mWaterInput={mWaterInput} maturityAge={maturityAge} maxGrainSize={maxGrainSize} maxWz={maxWz} minCement={minCement} s_param={s_param} setBetonSubTab={setBetonSubTab} setConsClass={setConsClass} setKAddType={setKAddType} setKAddition={setKAddition} setKCement={setKCement} setKWater={setKWater} setMIceInput={setMIceInput} setMaxGrainSize={setMaxGrainSize} setStrengthCementType={setStrengthCementType} setStrengthClassFck={setStrengthClassFck} setStrengthCureAge={setStrengthCureAge} setStrengthCureTemp={setStrengthCureTemp} setTargetExposure={setTargetExposure} setTempAggregate={setTempAggregate} setTempCement={setTempCement} setTempWater={setTempWater} strengthCementType={strengthCementType} strengthClassFck={strengthClassFck} strengthCureAge={strengthCureAge} strengthCureTemp={strengthCureTemp} targetExposure={targetExposure} tempAggregate={tempAggregate} tempCement={tempCement} tempWater={tempWater} total_heat={total_heat} total_heat_capacity={total_heat_capacity} waterDemand={waterDemand} />}

        {/* --- 3. TAB CONTENT: STAHLBETON-BIEGUNG --- */}
        {activeTab === 'stahlbeton' && <RechnungStahlbeton a_s_req={a_s_req} bWidth={bWidth} b_m={b_m} concreteClass={concreteClass} d1Margin={d1Margin} d_m={d_m} f_cd={f_cd} f_ck={f_ck} f_yd={f_yd} hHeight={hHeight} mEd={mEd} mu_Ed={mu_Ed} mu_lim={mu_lim} setBWidth={setBWidth} setConcreteClass={setConcreteClass} setHHeight={setHHeight} setMEd={setMEd} z_m={z_m} zeta={zeta} />}

        {/* --- 4. TAB CONTENT: HOLZBAU KNICKEN --- */}
        {activeTab === 'holzbau' && <RechnungHolzbau A_wood={A_wood} E_005={E_005} colHeight={colHeight} colLength={colLength} colWidth={colWidth} designForce={designForce} f_c0d={f_c0d} f_c0k={f_c0k} i_radius={i_radius} k_c_final={k_c_final} k_factor_wood={k_factor_wood} lambda_rel={lambda_rel} setColHeight={setColHeight} setColLength={setColLength} setColWidth={setColWidth} setDesignForce={setDesignForce} setTimberGrade={setTimberGrade} sigma_c0d={sigma_c0d} slenderness={slenderness} timberGrade={timberGrade} utilizationWood={utilizationWood} />}

        {/* --- 5. TAB CONTENT: MAUERWERK TRAGFÄHIGKEIT --- */}
        {activeTab === 'mauerwerk' && <RechnungMauerwerk />}

        {/* --- 6. TAB CONTENT: NACHHALTIGKEIT & ÖKOBILANZ --- */}
        {activeTab === 'nachhaltigkeit' && <RechnungNachhaltigkeit bauteilVol={bauteilVol} caoAnteil={caoAnteil} caoMassPerM2={caoMassPerM2} carbGrad={carbGrad} carbonationDepth={carbonationDepth} cementGehalt={cementGehalt} cementGehaltA={cementGehaltA} cementGehaltB={cementGehaltB} cementMassPerM2={cementMassPerM2} co2SubTab={co2SubTab} co2UptakePerM2={co2UptakePerM2} deltaGwp={deltaGwp} durabilityYears={durabilityYears} gwpZementA={gwpZementA} gwpZementB={gwpZementB} kFactor={kFactor} percentSavings={percentSavings} reactedCaoMassPerM2={reactedCaoMassPerM2} setBauteilVol={setBauteilVol} setCaoAnteil={setCaoAnteil} setCarbGrad={setCarbGrad} setCementGehalt={setCementGehalt} setCementGehaltA={setCementGehaltA} setCementGehaltB={setCementGehaltB} setCo2SubTab={setCo2SubTab} setDurabilityYears={setDurabilityYears} setGwpZementA={setGwpZementA} setGwpZementB={setGwpZementB} setKFactor={setKFactor} totalCementA={totalCementA} totalCementB={totalCementB} totalGwpA={totalGwpA} totalGwpB={totalGwpB} />}

        {/* --- 7. TAB CONTENT: BAUEN IM BESTAND --- */}
        {activeTab === 'bestand' && <RechnungBestand bestandSubTab={bestandSubTab} beta_WN={beta_WN} beta_WN_150={beta_WN_150} diameterStahl={diameterStahl} f_cd_bestand={f_cd_bestand} f_ck_act={f_ck_act} f_ck_cyl_raw={f_ck_cyl_raw} f_ck_final={f_ck_final} f_ck_tested={f_ck_tested} f_yd_stahl={f_yd_stahl} f_yk_stahl={f_yk_stahl} hasPruefung={hasPruefung} histBetonKlasse={histBetonKlasse} histStahlKlasse={histStahlKlasse} pruefFestigkeit={pruefFestigkeit} setBestandSubTab={setBestandSubTab} setDiameterStahl={setDiameterStahl} setHasPruefung={setHasPruefung} setHistBetonKlasse={setHistBetonKlasse} setHistStahlKlasse={setHistStahlKlasse} setPruefFestigkeit={setPruefFestigkeit} steelArea={steelArea} testedKlasseLabel={testedKlasseLabel} yieldCapacity={yieldCapacity} />}

        {/* --- 8. TAB CONTENT: SCHALLSCHUTZ (DIN 4109) --- */}
        {activeTab === 'schallschutz' && <RechnungSchallschutz schallDicke={schallDicke} schallFlanke={schallFlanke} schallPutz={schallPutz} schallRohdichte={schallRohdichte} schallSollTyp={schallSollTyp} schallWandTyp={schallWandTyp} schall_KF={schall_KF} schall_R_prime_w={schall_R_prime_w} schall_Rw={schall_Rw} schall_erf={schall_erf} schall_m0={schall_m0} schall_m_total={schall_m_total} schall_passed={schall_passed} schall_soll_werte={schall_soll_werte} setSchallDicke={setSchallDicke} setSchallFlanke={setSchallFlanke} setSchallPutz={setSchallPutz} setSchallRohdichte={setSchallRohdichte} setSchallSollTyp={setSchallSollTyp} setSchallWandTyp={setSchallWandTyp} />}

        {/* --- 9. TAB CONTENT: BRANDSCHUTZ & HEISSBEMESSUNG --- */}
        {activeTab === 'brandschutz' && <RechnungBrandschutz M_fi_Ed={M_fi_Ed} M_fi_Rd={M_fi_Rd} W_ef_mm3={W_ef_mm3} b_ef_mm={b_ef_mm} beta_char={beta_char} brandBeanspruchung={brandBeanspruchung} brandDauerMin={brandDauerMin} brandSubTab={brandSubTab} brand_holz_passed={brand_holz_passed} d_char_n={d_char_n} d_ef={d_ef} eta_brand_holz={eta_brand_holz} h_ef_mm={h_ef_mm} holzArtBrand={holzArtBrand} holzBreite={holzBreite} holzHoehe={holzHoehe} momentKaltEd={momentKaltEd} setBrandBeanspruchung={setBrandBeanspruchung} setBrandDauerMin={setBrandDauerMin} setBrandSubTab={setBrandSubTab} setHolzArtBrand={setHolzArtBrand} setHolzBreite={setHolzBreite} setHolzHoehe={setHolzHoehe} setMomentKaltEd={setMomentKaltEd} />}
        </RechnungReiterRahmen>

      </div>

      {/* MODULE FOOTER WITH NORM REFERENCES AND STANDARDS */}
      <ModuleFooter 
        wikipedia={[
          { title: 'U-Wert', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient' },
          { title: inhalt.werte.eurocode2Betonbau, url: 'https://de.wikipedia.org/wiki/Eurocode_2' },
          { title: inhalt.werte.eurocode5Holzbau, url: 'https://de.wikipedia.org/wiki/Eurocode_5' },
          { title: inhalt.werte.eurocode6Mauerwerk },
          { title: 'Schallschutz', url: 'https://de.wikipedia.org/wiki/Schallschutz' },
          { title: 'Brandschutz', url: 'https://de.wikipedia.org/wiki/Brandschutz' },
          { title: inhalt.werte.karbonatisierungBeton },
          { title: inhalt.werte.treibhauspotentialGwp, url: 'https://de.wikipedia.org/wiki/Treibhauspotenzial' }
        ]}
        literatur={inhalt.daten["Beispielrechnungen.literatur"]}
        regelwerke={inhalt.daten["Beispielrechnungen.regelwerke"]}
        formeln={inhalt.daten["Beispielrechnungen.formeln"]}
      />
    </div>
  );
}
