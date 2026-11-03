import React, { useState } from 'react';
import { HOLZ_EN338, fcdBeton, FCD_MODUL } from '@/src/data/kennwerte';
import { bemesseBiegung } from '@/src/calc/biegung';
import { bemesseDruckstab } from '@/src/calc/holzbau';
import { stoffraum, K_WERT_DIN1045_2, maxFaFaktor } from '@/src/calc/mischung';
import { temperaturFaktor, betaCc, ZEMENT_S, ausschalVergleich, AUSSCHAL_VORGABE_LEHRANNAHME } from '@/src/calc/betonkennwerte';
import { fckZumAlter, ALTBETON_ZUORDNUNG, type AltbetonKlasse } from '@/src/data/kennwerte';
import { insituDruckfestigkeit13791 } from '@/src/calc/bauwerksuntersuchung';
import { ZEMENT_GWP_KG } from '@/src/data/zementGwp';
import { wandSchalldaemmung, PUTZ_MASSE_BEIDSEITIG } from '@/src/calc/schall';
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
  const [uConcreteLambda, setUConcreteLambda] = useState<number>(2.3); // W/(mK) – Stahlbeton (DIN EN ISO 10456: armiert 1 % 2,3; unbewehrt 2400 kg/m³ 2,0)
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

  // Wasseranspruch in l/m³ nach Konsistenz und Größtkorn: Lehrwerte der Größenordnung, keine Normwerte (Entscheidung 29.10., T15-BE-6)
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
  const V_air = 15;   // Compaction pores in dm³/m³ (1.5%)

  // Absolute volume method: V_c + V_w + V_air + V_a = 1000 dm³ – Rechenkern src/calc/mischung.ts (stoffraum, Modulprüfung T15-BE-3)
  const mischErg = stoffraum({
    zement: cementContent, rhoZement: rho_c, wasser: waterDemand, fa: 0, sf: 0, hues: 0, biochar: 0, zusatzmittel: 0,
    luft: V_air / 10, stahlfaser: 0, ppFaser: 0, rhoGestein: rho_a, fraktionen: [{ anteil: 100, feuchte: 0, wa: 0 }],
    biocharFeuchte: 0, biocharWa: 0, k: { fa: K_WERT_DIN1045_2.kF, sf: K_WERT_DIN1045_2.kS, hues: 0, biochar: 0 }, maxFaFaktor: maxFaFaktor('CEM I'),
  });
  const V_c = mischErg.vol.zement;
  const V_w = mischErg.vol.wasser;
  const V_a = mischErg.volGestein;
  const aggregateMass = mischErg.masseGestein;
  const freshConcreteDensity = mischErg.rohdichte * 1000;

  // --- NEW: EXTRA BETON CALCULATORS ---
  const [betonSubTab, setBetonSubTab] = useState<'mischung' | 'k_wert' | 'temperatur' | 'festigkeit'>('mischung');

  // A. k-Wert-Ansatz
  const [kAddType, setKAddType] = useState<'flugasche' | 'silikastaub'>('flugasche');
  const [kCement, setKCement] = useState<number>(300); // kg/m³
  const [kAddition, setKAddition] = useState<number>(60); // kg/m³
  const [kWater, setKWater] = useState<number>(150); // l/m³

  // DIN 1045-2 (k-Wert-Ansatz): Flugasche k = 0,4, f/z ≤ 0,33 (CEM I); Silikastaub k = 1,0, s/z ≤ 0,11 – Werte aus src/calc/mischung.ts
  const k_factor = kAddType === 'flugasche' ? K_WERT_DIN1045_2.kF : K_WERT_DIN1045_2.kS;
  const k_max_ratio = kAddType === 'flugasche' ? maxFaFaktor('CEM I') : K_WERT_DIN1045_2.maxSfFaktor;
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
  // Modulprüfung T15-BE-5: keine stille Begrenzung auf −5 °C mehr; unter 0 °C gilt die Bilanz ohne Phasenwechsel nicht (Hinweis im Reiter)
  const finalFreshTemp = total_heat / total_heat_capacity;

  // C. Festigkeitsentwicklung (EC2 Arrhenius maturity)
  const [strengthClassFck, setStrengthClassFck] = useState<number>(25); // e.g. 20, 25, 30, 37, 40, 50 MPa
  const [strengthCementType, setStrengthCementType] = useState<'S' | 'N' | 'R'>('N');
  const [strengthCureAge, setStrengthCureAge] = useState<number>(7); // days
  const [strengthCureTemp, setStrengthCureTemp] = useState<number>(12); // °C

  // Rechenkern src/calc/betonkennwerte.ts (Modulprüfung T15-BE-1): s nach EC2 3.1.2(6), t_T nach Anhang B, Gl. (B.10)
  // (Reifeansatz wie fib Model Code 2010, Schalter „festigkeitMitWirksamemAlter“ im Modul Betonkennwerte),
  // β_cc(t) nach Gl. (3.2), f_ck(t) = f_cm(t) − 8 für t < 28 d bzw. f_ck für t ≥ 28 d (3.1.2(5)); vorher f_ck(t) = β_cc·f_ck.
  const s_param = ZEMENT_S[strengthCementType];
  const maturityAge = Math.max(0.1, strengthCureAge * temperaturFaktor(strengthCureTemp));
  const beta_cc = betaCc(s_param, maturityAge);
  const f_cm_28 = strengthClassFck + 8;
  const f_cm_t = beta_cc * f_cm_28;
  const f_ck_t = fckZumAlter(strengthClassFck, f_cm_t, maturityAge);
  // Ausschalkriterium (Entscheidung 29.10., T15-BE-2): f_ck(t) gegen die Vorgabe der Tragwerksplanung in % von f_ck (Voreinstellung 50 % = Lehrannahme)
  const [ausschalVorgabe, setAusschalVorgabe] = useState<number>(AUSSCHAL_VORGABE_LEHRANNAHME);
  const ausschal = ausschalVergleich(strengthClassFck, f_ck_t, ausschalVorgabe);

  // --- 3. STATE FOR STAHLBETON-BIEGUNG ---
  const [mEd, setMEd] = useState<number>(160); // Bending moment in kNm
  const [concreteClass, setConcreteClass] = useState<'C20/25' | 'C25/30' | 'C30/37'>('C25/30');
  const [bWidth, setBWidth] = useState<number>(30); // Beam width in cm
  const [hHeight, setHHeight] = useState<number>(50); // Beam height in cm
  const [d1Margin, setD1Margin] = useState<number>(4.5); // Effective depth cover d1 in cm

  // Rechenkern src/calc/biegung.ts (Modulprüfung T15-SB-1; Ergebnisse gegenüber der bisherigen Inline-Rechnung unverändert):
  // Spannungsblock λ = 0,8, η = 1,0, ξ_lim = 0,45 (NA DE 5.4.1), f_cd = α_cc·f_ck/γ_c, f_yd = f_yk/1,15
  const f_ck = concreteClass === 'C20/25' ? 20 : concreteClass === 'C25/30' ? 25 : 30; // MPa
  const biegErg = bemesseBiegung({ b: bWidth, h: hHeight, d1: d1Margin, d2: 4.5, med: mEd, fck: f_ck, bewehrung: 'Stahl', fyk: 500, ftk: 0, gammaFRP: 1 });
  const f_cd = fcdBeton(f_ck, FCD_MODUL.beispielrechnungen); // = biegErg.fcd (zentral, src/data/kennwerte.ts)
  const f_yd = biegErg.fyd;
  const b_m = bWidth / 100; // m
  const d_m = biegErg.d / 100; // Nutzhöhe in m
  const mu_Ed = biegErg.mu_Ed;
  const mu_lim = biegErg.muLim; // µ_Eds,lim = λ·ξ_lim·(1 − λ·ξ_lim/2) = 0,295
  const biegungOk = mu_Ed <= mu_lim;
  // Hebelarmbeiwert ζ = 1 − ω/2 = (1 + √(1 − 2µ))/2 (Spannungsblock, η = 1)
  const zeta = biegungOk ? 1 - biegErg.omega / 2 : 0;
  const z_m = zeta * d_m; // Hebelarm in m
  const a_s_req = biegungOk ? biegErg.as1_req : 0; // A_s,erf = ω·b·d·f_cd/f_yd = M_Ed/(f_yd·z) in cm²
  const a_s_min = biegErg.as_min; // Mindestbewehrung (Robustheit, NA DE 9.2.1.1) in cm²

  // --- 4. STATE FOR HOLZBAU KNICKEN ---
  const [colLength, setColLength] = useState<number>(3.0); // column length in m
  const [colWidth, setColWidth] = useState<number>(14); // cross-section b in cm
  const [colHeight, setColHeight] = useState<number>(14); // cross-section h in cm
  const [designForce, setDesignForce] = useState<number>(65); // N_d in kN
  const [timberGrade, setTimberGrade] = useState<'C24' | 'C30'>('C24');

  // Rechenkern src/calc/holzbau.ts (Modulprüfung T15-HO-1; Ergebnisse unverändert): Vollholz nach DIN EN 338:2016,
  // NKL 1, KLED kurz (k_mod = 0,9; maßgebende kurzzeitige Einwirkung angenommen), γ_M = 1,3, Euler-Fall 2 (s_k = L), β_c = 0,2
  const f_c0k = HOLZ_EN338[timberGrade].fc0k;
  const E_005 = HOLZ_EN338[timberGrade].E005;
  const holzErg = bemesseDruckstab({ b: colWidth * 10, h: colHeight * 10, laenge: colLength, eulerFall: 2, nEd: designForce, fc0k: f_c0k, E005: E_005, brettschichtholz: false, nkl: 1, kled: 'krt' });
  const f_c0d = holzErg.f_c0d;
  const A_wood = colWidth * colHeight; // cm²
  const i_radius = Math.min(holzErg.iy, holzErg.iz) / 10; // Trägheitsradius der schwachen Achse in cm
  const slenderness = holzErg.lambda_z; // λ = s_k / i
  const lambda_rel = holzErg.lambda_rel_z;
  // Hilfswert k nach Gl. (6.27) für die Anzeige (Vollholz β_c = 0,2)
  const k_factor_wood = 0.5 * (1 + 0.2 * (lambda_rel - 0.3) + Math.pow(lambda_rel, 2));
  const k_c_final = holzErg.k_cz;
  const sigma_c0d = (designForce * 10) / A_wood; // N/mm²
  const utilizationWood = holzErg.utilization / 100;

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
  // Vorgaben aus src/data/zementGwp.ts (Entscheidung 29.10., T15-NH-3): CEM I 665 kg/t (VDZ-Branchen-EPD 2022, netto), CEM III/B Lehrwert 260 kg/t
  const [gwpZementA, setGwpZementA] = useState<number>(Math.round(ZEMENT_GWP_KG['CEM I'] * 1000)); // kg CO2-eq/t
  const [cementGehaltB, setCementGehaltB] = useState<number>(350); // kg/m³
  const [gwpZementB, setGwpZementB] = useState<number>(Math.round(ZEMENT_GWP_KG['CEM III/B'] * 1000)); // kg CO2-eq/t

  // Derived values for CO2 Karbonatisierung:
  const carbonationDepth = kFactor * Math.sqrt(durabilityYears); // in mm
  const volumePerM2 = carbonationDepth / 1000; // m³ per m²
  const cementMassPerM2 = volumePerM2 * cementGehalt; // kg
  const caoMassPerM2 = cementMassPerM2 * (caoAnteil / 100); // kg
  const reactedCaoMassPerM2 = caoMassPerM2 * (carbGrad / 100); // kg
  const co2UptakePerM2 = reactedCaoMassPerM2 * (44.01 / 56.08); // kg CO2/m², Molmassen M(CO₂)/M(CaO) wie im Rechenweg (T15-NH-2)

  // Derived values for GWP Zement Vergleich:
  const totalCementA = (bauteilVol * cementGehaltA) / 1000; // t
  const totalGwpA = totalCementA * gwpZementA / 1000; // t CO2-eq
  const totalCementB = (bauteilVol * cementGehaltB) / 1000; // t
  const totalGwpB = totalCementB * gwpZementB / 1000; // t CO2-eq
  const deltaGwp = totalGwpA - totalGwpB; // t CO2-eq
  const percentSavings = totalGwpA > 0 ? (deltaGwp / totalGwpA) * 100 : 0;

  // --- 7. STATE FOR BAUEN IM BESTAND ---
  const [bestandSubTab, setBestandSubTab] = useState<'beton' | 'stahl'>('beton');
  // Beton (Entscheidung 29.10.2026, T15-BS-3 bis -6): Zuordnung über die gemeinsame Tabelle ALTBETON_ZUORDNUNG
  // (src/data/kennwerte.ts, Schnell/Fischer/Loch 2008, Tab. 2.1; vorher Lehransatz 0,8·β_W/0,95 − 3 N/mm²) und Prüfwert nach
  // DIN EN 13791 mit n, s und kleinstem Einzelwert (insituDruckfestigkeit13791; vorher Mittelwert ohne Streuung)
  const [histBetonKlasse, setHistBetonKlasse] = useState<AltbetonKlasse>('B225');
  const [altbetonGrenze, setAltbetonGrenze] = useState<'unten' | 'oben'>('unten');
  const [hasPruefung, setHasPruefung] = useState<boolean>(false);
  const [kernAnzahl, setKernAnzahl] = useState<number>(8);
  const [pruefFestigkeit, setPruefFestigkeit] = useState<number>(28.5); // f_m,is der Kerne (h/d = 1 ≙ 150-mm-Würfel) in N/mm²
  const [kernStreuung, setKernStreuung] = useState<number>(2.0); // s in N/mm²
  const [kernKleinster, setKernKleinster] = useState<number>(25.5); // f_is,lowest in N/mm²
  // Stahl states:
  const [histStahlKlasse, setHistStahlKlasse] = useState<'BSt220' | 'BSt420' | 'BSt500'>('BSt220');
  const [diameterStahl, setDiameterStahl] = useState<number>(12); // mm

  const altbeton = ALTBETON_ZUORDNUNG[histBetonKlasse];
  const fckTabelle = altbetonGrenze === 'unten' ? altbeton.fckUnten : altbeton.fckOben;
  const klasseTabelle = altbetonGrenze === 'unten' ? altbeton.klasseUnten : altbeton.klasseOben;
  const insitu = insituDruckfestigkeit13791({ n: kernAnzahl, mittel: pruefFestigkeit, s: kernStreuung, kleinster: kernKleinster, bezug: 'wuerfel' });
  const f_ck_final: number | null = hasPruefung ? (insitu.gueltig && insitu.klasse ? insitu.fck : null) : fckTabelle;
  const f_cd_bestand: number | null = f_ck_final !== null ? fcdBeton(f_ck_final, FCD_MODUL.beispielBestand) : null;

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

  // Calculations Schallschutz – Rechenkern src/calc/schall.ts (Massekurve DIN 4109-32)
  const schall_KF = schallFlanke === 'entkoppelt' ? 0 : schallFlanke === 'massiv' ? 2 : 4;
  const schallErgebnis = wandSchalldaemmung({ dicke: schallDicke / 100, rohdichte: schallRohdichte, putzMasse: schallPutz ? PUTZ_MASSE_BEIDSEITIG : 0, kF: schall_KF });
  const schall_m0 = schallErgebnis.m0; // kg/m²
  const schall_m_total = schallErgebnis.mStrich; // kg/m²
  const schall_Rw = schallErgebnis.Rw;
  const schall_R_prime_w = schallErgebnis.RwStrich;

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
        {activeTab === 'beton' && <RechnungBeton ausschal={ausschal} ausschalVorgabe={ausschalVorgabe} setAusschalVorgabe={setAusschalVorgabe} V_a={V_a} V_air={V_air} V_c={V_c} V_w={V_w} actualWz={actualWz} aggregateMass={aggregateMass} beta_cc={beta_cc} betonSubTab={betonSubTab} cementContent={cementContent} cementFromWz={cementFromWz} consClass={consClass} f_ck_t={f_ck_t} f_cm_28={f_cm_28} f_cm_t={f_cm_t} finalFreshTemp={finalFreshTemp} freshConcreteDensity={freshConcreteDensity} heat_agg={heat_agg} heat_cement={heat_cement} heat_ice_melting={heat_ice_melting} heat_liquid_water={heat_liquid_water} kAddType={kAddType} kAddition={kAddition} kCement={kCement} kWater={kWater} k_credited_addition={k_credited_addition} k_factor={k_factor} k_max_allowed_addition={k_max_allowed_addition} k_max_ratio={k_max_ratio} k_w_z_eq={k_w_z_eq} k_w_z_pure={k_w_z_pure} mAggregateInput={mAggregateInput} mCementInput={mCementInput} mIceInput={mIceInput} mLiquidWater={mLiquidWater} mWaterInput={mWaterInput} maturityAge={maturityAge} maxGrainSize={maxGrainSize} maxWz={maxWz} minCement={minCement} s_param={s_param} setBetonSubTab={setBetonSubTab} setConsClass={setConsClass} setKAddType={setKAddType} setKAddition={setKAddition} setKCement={setKCement} setKWater={setKWater} setMIceInput={setMIceInput} setMaxGrainSize={setMaxGrainSize} setStrengthCementType={setStrengthCementType} setStrengthClassFck={setStrengthClassFck} setStrengthCureAge={setStrengthCureAge} setStrengthCureTemp={setStrengthCureTemp} setTargetExposure={setTargetExposure} setTempAggregate={setTempAggregate} setTempCement={setTempCement} setTempWater={setTempWater} strengthCementType={strengthCementType} strengthClassFck={strengthClassFck} strengthCureAge={strengthCureAge} strengthCureTemp={strengthCureTemp} targetExposure={targetExposure} tempAggregate={tempAggregate} tempCement={tempCement} tempWater={tempWater} total_heat={total_heat} total_heat_capacity={total_heat_capacity} waterDemand={waterDemand} />}

        {/* --- 3. TAB CONTENT: STAHLBETON-BIEGUNG --- */}
        {activeTab === 'stahlbeton' && <RechnungStahlbeton a_s_req={a_s_req} a_s_min={a_s_min} bWidth={bWidth} b_m={b_m} concreteClass={concreteClass} d1Margin={d1Margin} d_m={d_m} f_cd={f_cd} f_ck={f_ck} f_yd={f_yd} hHeight={hHeight} mEd={mEd} mu_Ed={mu_Ed} mu_lim={mu_lim} setBWidth={setBWidth} setConcreteClass={setConcreteClass} setHHeight={setHHeight} setMEd={setMEd} z_m={z_m} zeta={zeta} />}

        {/* --- 4. TAB CONTENT: HOLZBAU KNICKEN --- */}
        {activeTab === 'holzbau' && <RechnungHolzbau A_wood={A_wood} E_005={E_005} colHeight={colHeight} colLength={colLength} colWidth={colWidth} designForce={designForce} f_c0d={f_c0d} f_c0k={f_c0k} i_radius={i_radius} k_c_final={k_c_final} k_factor_wood={k_factor_wood} lambda_rel={lambda_rel} setColHeight={setColHeight} setColLength={setColLength} setColWidth={setColWidth} setDesignForce={setDesignForce} setTimberGrade={setTimberGrade} sigma_c0d={sigma_c0d} slenderness={slenderness} timberGrade={timberGrade} utilizationWood={utilizationWood} />}

        {/* --- 5. TAB CONTENT: MAUERWERK TRAGFÄHIGKEIT --- */}
        {activeTab === 'mauerwerk' && <RechnungMauerwerk />}

        {/* --- 6. TAB CONTENT: NACHHALTIGKEIT & ÖKOBILANZ --- */}
        {activeTab === 'nachhaltigkeit' && <RechnungNachhaltigkeit bauteilVol={bauteilVol} caoAnteil={caoAnteil} caoMassPerM2={caoMassPerM2} carbGrad={carbGrad} carbonationDepth={carbonationDepth} cementGehalt={cementGehalt} cementGehaltA={cementGehaltA} cementGehaltB={cementGehaltB} cementMassPerM2={cementMassPerM2} co2SubTab={co2SubTab} co2UptakePerM2={co2UptakePerM2} deltaGwp={deltaGwp} durabilityYears={durabilityYears} gwpZementA={gwpZementA} gwpZementB={gwpZementB} kFactor={kFactor} percentSavings={percentSavings} reactedCaoMassPerM2={reactedCaoMassPerM2} setBauteilVol={setBauteilVol} setCaoAnteil={setCaoAnteil} setCarbGrad={setCarbGrad} setCementGehalt={setCementGehalt} setCementGehaltA={setCementGehaltA} setCementGehaltB={setCementGehaltB} setCo2SubTab={setCo2SubTab} setDurabilityYears={setDurabilityYears} setGwpZementA={setGwpZementA} setGwpZementB={setGwpZementB} setKFactor={setKFactor} totalCementA={totalCementA} totalCementB={totalCementB} totalGwpA={totalGwpA} totalGwpB={totalGwpB} />}

        {/* --- 7. TAB CONTENT: BAUEN IM BESTAND --- */}
        {activeTab === 'bestand' && <RechnungBestand bestandSubTab={bestandSubTab} altbeton={altbeton} altbetonGrenze={altbetonGrenze} setAltbetonGrenze={setAltbetonGrenze} fckTabelle={fckTabelle} klasseTabelle={klasseTabelle} insitu={insitu} kernAnzahl={kernAnzahl} setKernAnzahl={setKernAnzahl} kernStreuung={kernStreuung} setKernStreuung={setKernStreuung} kernKleinster={kernKleinster} setKernKleinster={setKernKleinster} diameterStahl={diameterStahl} f_cd_bestand={f_cd_bestand} f_ck_final={f_ck_final} f_yd_stahl={f_yd_stahl} f_yk_stahl={f_yk_stahl} hasPruefung={hasPruefung} histBetonKlasse={histBetonKlasse} histStahlKlasse={histStahlKlasse} pruefFestigkeit={pruefFestigkeit} setBestandSubTab={setBestandSubTab} setDiameterStahl={setDiameterStahl} setHasPruefung={setHasPruefung} setHistBetonKlasse={setHistBetonKlasse} setHistStahlKlasse={setHistStahlKlasse} setPruefFestigkeit={setPruefFestigkeit} steelArea={steelArea} yieldCapacity={yieldCapacity} />}

        {/* --- 8. TAB CONTENT: SCHALLSCHUTZ (DIN 4109) --- */}
        {activeTab === 'schallschutz' && <RechnungSchallschutz schallDicke={schallDicke} schallFlanke={schallFlanke} schallPutz={schallPutz} schallRohdichte={schallRohdichte} schallSollTyp={schallSollTyp} schallWandTyp={schallWandTyp} schall_KF={schall_KF} schall_R_prime_w={schall_R_prime_w} schall_Rw={schall_Rw} schall_erf={schall_erf} schall_m0={schall_m0} schall_m_total={schall_m_total} schall_passed={schall_passed} schall_hinweise={schallErgebnis.hinweise} schall_soll_werte={schall_soll_werte} setSchallDicke={setSchallDicke} setSchallFlanke={setSchallFlanke} setSchallPutz={setSchallPutz} setSchallRohdichte={setSchallRohdichte} setSchallSollTyp={setSchallSollTyp} setSchallWandTyp={setSchallWandTyp} />}

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
          { title: inhalt.werte.treibhauspotentialGwp, url: 'https://de.wikipedia.org/wiki/Treibhauspotential' }
        ]}
        literatur={inhalt.daten["Beispielrechnungen.literatur"]}
        regelwerke={inhalt.daten["Beispielrechnungen.regelwerke"]}
        formeln={inhalt.daten["Beispielrechnungen.formeln"]}
      />
    </div>
  );
}
