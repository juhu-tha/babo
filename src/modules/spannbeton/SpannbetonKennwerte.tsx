import { formatDeZahl, formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import BeiwerteKatalog from './BeiwerteKatalog';
import {
  CONCRETE,
  fckT,
  fcmT,
  fctmT,
  EcmT,
  tempAdjustedAge,
  fctmFl,
  creep,
  shrinkage,
  CementClass
} from '@/src/utils/ec2Spannbeton';
import {
  Clock,
  Droplets,
  Zap,
  Activity,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Layers,
  Info,
  RefreshCw,
  Scale,
  Thermometer,
  Compass,
  FileText,
  Calculator,
  PieChart,
  Building,
  Check,
  ShieldCheck,
  Wrench,
  Package
} from 'lucide-react';

export default function SpannbetonKennwerte() {
  const [activeSubTab, setActiveSubTab] = useState<
    'beiwerte' | 'beton' | 'einpressmoertel' | 'kriechen' | 'schwinden' | 'relaxation' | 'elastisch' | 'kopplung' | 'mechanisch' | 'beispielrechnung' | 'rechner'
  >('beton');

  // Concrete Material States (Festigkeit, E-Modul, Reife, Zugfestigkeit, Gestein)
  const [matGrade, setMatGrade] = useState<string>('C45/55');
  const [matCement, setMatCement] = useState<'R' | 'N' | 'S'>('R');
  const [matAgeDays, setMatAgeDays] = useState<number>(7);
  const [matTemp, setMatTemp] = useState<number>(20); // °C
  const [matAggregate, setMatAggregate] = useState<'quarzit' | 'basalt' | 'kalkstein' | 'sandstein'>('quarzit');
  const [matBeamHeight, setMatBeamHeight] = useState<number>(400); // mm Querschnittshöhe für fctm,fl

  // Einpressmörtel & Systembaustoffe States (DIN EN 447, Hüllrohre, Fette, Keile)
  const [groutWz, setGroutWz] = useState<number>(0.36); // Wasser-Zement-Wert
  const [groutAdmixturePct, setGroutAdmixturePct] = useState<number>(1.0); // % Quell-/Fließmittel
  const [groutCementType, setGroutCementType] = useState<string>('CEM I 52.5 R (C3A-arm)');
  const [groutDuctType, setGroutDuctType] = useState<'plastic_fib' | 'steel_en523' | 'unbonded_grease'>('plastic_fib');
  const [groutDuctDia, setGroutDuctDia] = useState<number>(85); // mm Innendurchmesser
  const [groutStrandCount, setGroutStrandCount] = useState<number>(12); // z.B. 12 oder 19 Litzen à 150mm²
  const [groutTendonLength, setGroutTendonLength] = useState<number>(45); // m Spanngliedlänge

  const groutCalculations = useMemo(() => {
    // 1. Querschnitt & Hohlraumvolumen
    const ductArea = Math.PI * Math.pow(groutDuctDia / 2, 2); // mm²
    const strandArea = groutStrandCount * 150; // mm² (150 mm² je 0.6" Litze)
    const netVoidArea = Math.max(100, ductArea - strandArea); // mm² freier Hohlquerschnitt
    const netVoidVolumeLiter = Number(((netVoidArea * (groutTendonLength * 1000)) / 1e6).toFixed(1)); // Liter Mörtel

    // Mörteldichte & Zementbedarf
    // Spezifisches Zementvolumen ≈ 1 / 3.15 = 0.317 dm³/kg
    // 1 kg Zement + wz kg Wasser = (0.317 + wz) dm³
    const cementPerLiter = 1.0 / (0.317 + groutWz); // kg Zement je Liter Mörtel
    const waterPerLiter = cementPerLiter * groutWz; // Liter Wasser je Liter Mörtel

    const totalCementKg = Math.round(netVoidVolumeLiter * cementPerLiter);
    const totalWaterLiter = Math.round(netVoidVolumeLiter * waterPerLiter);
    const totalAdmixtureKg = Number(((totalCementKg * groutAdmixturePct) / 100).toFixed(1));
    const cementBags25 = Math.ceil(totalCementKg / 25);

    // Gütekriterien-Simulation nach DIN EN 447 & DIN EN 445:
    // Trichterverfahren nach DIN EN 445, Auslaufzeit t0 und t30 [s] (DIN EN 447: ≤ 25 s)
    const flowTimeT0 = Number((16 + (0.36 - groutWz) * 60 - (groutAdmixturePct - 1.0) * 3).toFixed(1));
    const flowTimeT30 = Number((flowTimeT0 * (1.10 + Math.max(0, 0.35 - groutWz) * 0.4)).toFixed(1));
    const flowValid = flowTimeT0 <= 25 && flowTimeT30 <= 25;

    // Wasserabsondern (Bluten) nach 3 h [%] (Norm: <= 0.30 %)
    const bleeding3h = Number(Math.max(0.05, (groutWz - 0.34) * 2.5 - (groutAdmixturePct - 0.5) * 0.15).toFixed(2));
    const bleedingValid = bleeding3h <= 0.30;

    // Volumenänderung nach 24 h [%] (DIN EN 447: −1 % bis +5 %)
    const expansion24h = Number((0.2 + (groutAdmixturePct - 0.8) * 0.4 - Math.max(0, groutWz - 0.38) * 0.8).toFixed(2));
    const expansionValid = expansion24h >= -1.0 && expansion24h <= 5.0;

    // Druckfestigkeit nach 7d & 28d [N/mm²]
    const fc7d = Number((42 - (groutWz - 0.35) * 60).toFixed(1));
    const fc28d = Number((55 - (groutWz - 0.35) * 75).toFixed(1));
    const strengthValid = fc7d >= 27 && fc28d >= 30; // DIN EN 447: f_c,7 ≥ 27 N/mm²; 28-d-Wert nach Zulassung [prüfen]

    return {
      ductArea: Math.round(ductArea),
      strandArea,
      netVoidArea: Math.round(netVoidArea),
      netVoidVolumeLiter,
      cementPerLiter: Number(cementPerLiter.toFixed(2)),
      waterPerLiter: Number(waterPerLiter.toFixed(2)),
      totalCementKg,
      totalWaterLiter,
      totalAdmixtureKg,
      cementBags25,
      flowTimeT0,
      flowTimeT30,
      flowValid,
      bleeding3h,
      bleedingValid,
      expansion24h,
      expansionValid,
      fc7d,
      fc28d,
      strengthValid
    };
  }, [groutWz, groutAdmixturePct, groutDuctDia, groutStrandCount, groutTendonLength]);

  const concDatabase: Record<
    string,
    {
      fck: number;
      fck_cube: number;
      fcm: number;
      fctm: number;
      fctk005: number;
      fctk095: number;
      Ecm: number;
      eps_c1: number;
      eps_cu1: number;
      eps_c2: number;
      eps_cu2: number;
      typicalUse: string;
      prestressSuitability: string;
    }
  > = {
    'C30/37': { fck: CONCRETE['C30/37'].fck, fck_cube: CONCRETE['C30/37'].fck_cube, fcm: CONCRETE['C30/37'].fcm, fctm: CONCRETE['C30/37'].fctm, fctk005: CONCRETE['C30/37'].fctk_005, fctk095: CONCRETE['C30/37'].fctk_095, Ecm: CONCRETE['C30/37'].Ecm, eps_c1: CONCRETE['C30/37'].eps_c1, eps_cu1: CONCRETE['C30/37'].eps_cu1, eps_c2: CONCRETE['C30/37'].eps_c2, eps_cu2: CONCRETE['C30/37'].eps_cu2, typicalUse: 'Übliche Untergrenze nachträglicher Verbund (Zulassung/ETA maßgebend)', prestressSuitability: 'Zulässig für moderate Vorspannung, nicht empfohlen im Brückenbau' },
    'C35/45': { fck: CONCRETE['C35/45'].fck, fck_cube: CONCRETE['C35/45'].fck_cube, fcm: CONCRETE['C35/45'].fcm, fctm: CONCRETE['C35/45'].fctm, fctk005: CONCRETE['C35/45'].fctk_005, fctk095: CONCRETE['C35/45'].fctk_095, Ecm: CONCRETE['C35/45'].Ecm, eps_c1: CONCRETE['C35/45'].eps_c1, eps_cu1: CONCRETE['C35/45'].eps_cu1, eps_c2: CONCRETE['C35/45'].eps_c2, eps_cu2: CONCRETE['C35/45'].eps_cu2, typicalUse: 'Hallenbau, Standard-Spannbeton', prestressSuitability: 'Häufiger Standard im Hochbau' },
    'C40/50': { fck: CONCRETE['C40/50'].fck, fck_cube: CONCRETE['C40/50'].fck_cube, fcm: CONCRETE['C40/50'].fcm, fctm: CONCRETE['C40/50'].fctm, fctk005: CONCRETE['C40/50'].fctk_005, fctk095: CONCRETE['C40/50'].fctk_095, Ecm: CONCRETE['C40/50'].Ecm, eps_c1: CONCRETE['C40/50'].eps_c1, eps_cu1: CONCRETE['C40/50'].eps_cu1, eps_c2: CONCRETE['C40/50'].eps_c2, eps_cu2: CONCRETE['C40/50'].eps_cu2, typicalUse: 'Fertigteile, Brückenüberbauten', prestressSuitability: 'Sehr gut geeignet für Spannglieder und Litzen' },
    'C45/55': { fck: CONCRETE['C45/55'].fck, fck_cube: CONCRETE['C45/55'].fck_cube, fcm: CONCRETE['C45/55'].fcm, fctm: CONCRETE['C45/55'].fctm, fctk005: CONCRETE['C45/55'].fctk_005, fctk095: CONCRETE['C45/55'].fctk_095, Ecm: CONCRETE['C45/55'].Ecm, eps_c1: CONCRETE['C45/55'].eps_c1, eps_cu1: CONCRETE['C45/55'].eps_cu1, eps_c2: CONCRETE['C45/55'].eps_c2, eps_cu2: CONCRETE['C45/55'].eps_cu2, typicalUse: 'Üblich im Brückenbau (ZTV-ING prüfen)', prestressSuitability: 'Deutscher Standard für Spannbetonbrücken' },
    'C50/60': { fck: CONCRETE['C50/60'].fck, fck_cube: CONCRETE['C50/60'].fck_cube, fcm: CONCRETE['C50/60'].fcm, fctm: CONCRETE['C50/60'].fctm, fctk005: CONCRETE['C50/60'].fctk_005, fctk095: CONCRETE['C50/60'].fctk_095, Ecm: CONCRETE['C50/60'].Ecm, eps_c1: CONCRETE['C50/60'].eps_c1, eps_cu1: CONCRETE['C50/60'].eps_cu1, eps_c2: CONCRETE['C50/60'].eps_c2, eps_cu2: CONCRETE['C50/60'].eps_cu2, typicalUse: 'Hochbeanspruchte Hohlkastenbrücken, Eisenbahnschwellen', prestressSuitability: 'Hervorragend, sehr geringes Kriechen' },
    'C55/67': { fck: CONCRETE['C55/67'].fck, fck_cube: CONCRETE['C55/67'].fck_cube, fcm: CONCRETE['C55/67'].fcm, fctm: CONCRETE['C55/67'].fctm, fctk005: CONCRETE['C55/67'].fctk_005, fctk095: CONCRETE['C55/67'].fctk_095, Ecm: CONCRETE['C55/67'].Ecm, eps_c1: CONCRETE['C55/67'].eps_c1, eps_cu1: CONCRETE['C55/67'].eps_cu1, eps_c2: CONCRETE['C55/67'].eps_c2, eps_cu2: CONCRETE['C55/67'].eps_cu2, typicalUse: 'Hochfester Beton ab C55/67 (DIN 1045-2)', prestressSuitability: 'Sehr hohe Steifigkeit, geringe Kriechneigung' },
    'C60/75': { fck: CONCRETE['C60/75'].fck, fck_cube: CONCRETE['C60/75'].fck_cube, fcm: CONCRETE['C60/75'].fcm, fctm: CONCRETE['C60/75'].fctm, fctk005: CONCRETE['C60/75'].fctk_005, fctk095: CONCRETE['C60/75'].fctk_095, Ecm: CONCRETE['C60/75'].Ecm, eps_c1: CONCRETE['C60/75'].eps_c1, eps_cu1: CONCRETE['C60/75'].eps_cu1, eps_c2: CONCRETE['C60/75'].eps_c2, eps_cu2: CONCRETE['C60/75'].eps_cu2, typicalUse: 'Weitgespannte Brücken, Taktschiebeverfahren', prestressSuitability: 'Sehr hohe Frühfestigkeit' },
    'C70/85': { fck: CONCRETE['C70/85'].fck, fck_cube: CONCRETE['C70/85'].fck_cube, fcm: CONCRETE['C70/85'].fcm, fctm: CONCRETE['C70/85'].fctm, fctk005: CONCRETE['C70/85'].fctk_005, fctk095: CONCRETE['C70/85'].fctk_095, Ecm: CONCRETE['C70/85'].Ecm, eps_c1: CONCRETE['C70/85'].eps_c1, eps_cu1: CONCRETE['C70/85'].eps_cu1, eps_c2: CONCRETE['C70/85'].eps_c2, eps_cu2: CONCRETE['C70/85'].eps_cu2, typicalUse: 'Hochleistungsbeton (HPC), schlanke Pylone', prestressSuitability: 'Extrem steif, Kriechzahl unter 1.5' },
    'C80/95': { fck: CONCRETE['C80/95'].fck, fck_cube: CONCRETE['C80/95'].fck_cube, fcm: CONCRETE['C80/95'].fcm, fctm: CONCRETE['C80/95'].fctm, fctk005: CONCRETE['C80/95'].fctk_005, fctk095: CONCRETE['C80/95'].fctk_095, Ecm: CONCRETE['C80/95'].Ecm, eps_c1: CONCRETE['C80/95'].eps_c1, eps_cu1: CONCRETE['C80/95'].eps_cu1, eps_c2: CONCRETE['C80/95'].eps_c2, eps_cu2: CONCRETE['C80/95'].eps_cu2, typicalUse: 'Höchstleistungsbauteile, Großbrücken', prestressSuitability: 'Sehr geringe Relaxation & Kriechverformung' },
    'C90/105': { fck: CONCRETE['C90/105'].fck, fck_cube: CONCRETE['C90/105'].fck_cube, fcm: CONCRETE['C90/105'].fcm, fctm: CONCRETE['C90/105'].fctm, fctk005: CONCRETE['C90/105'].fctk_005, fctk095: CONCRETE['C90/105'].fctk_095, Ecm: CONCRETE['C90/105'].Ecm, eps_c1: CONCRETE['C90/105'].eps_c1, eps_cu1: CONCRETE['C90/105'].eps_cu1, eps_c2: CONCRETE['C90/105'].eps_c2, eps_cu2: CONCRETE['C90/105'].eps_cu2, typicalUse: 'Ultrahochfester Beton für Extrembauten', prestressSuitability: 'Sonderzulassung erforderlich, sehr sprödes Bruchverhalten' }
  };

  const activeMatData = concDatabase[matGrade] || concDatabase['C45/55'];

  const matMaturity = useMemo(() => {
    // Äquivalentes Betonalter unter Temperatur T nach Arrhenius (EC2 Gl. B.10):
    const t_eff = tempAdjustedAge(matAgeDays, matTemp);

    // s-Wert für Zementklasse
    const sMap: Record<CementClass, number> = { R: 0.20, N: 0.25, S: 0.38 };
    const s = sMap[matCement as CementClass] || 0.25;

    // beta_cc(t) nach DIN EN 1992-1-1 Gl. (3.2)
    const beta_cc = Math.exp(s * (1 - Math.sqrt(28 / Math.max(0.1, t_eff))));

    // Normkonforme fck(t) mit fckT() (fcm(t) - 8 nach EC2 3.1.2(5)):
    const fcm_t = Number(fcmT(activeMatData.fck, t_eff, matCement as CementClass).toFixed(1));
    const fck_t = Number(fckT(activeMatData.fck, t_eff, matCement as CementClass).toFixed(1));

    // Zuschlagstofffaktor nach EC2 Abs. 3.1.3(2)
    const aggMap = { quarzit: 1.0, basalt: 1.20, kalkstein: 0.90, sandstein: 0.70 };
    const aggFactor = aggMap[matAggregate];
    const Ecm_28 = Math.round(activeMatData.Ecm * aggFactor);

    // E-Modul bei t nach Gl. (3.5) mit EcmT():
    const Ecm_t = Number((EcmT(activeMatData.fck, t_eff, matCement as CementClass) * aggFactor).toFixed(0));

    // Zugfestigkeit bei t nach Gl. (3.4) mit fctmT():
    const fctm_t = Number(fctmT(activeMatData.fck, t_eff, matCement as CementClass).toFixed(2));
    const fctk005_t = Number((0.70 * fctm_t).toFixed(2));
    const fctk095_t = Number((1.30 * fctm_t).toFixed(2));
    // Biegezugfestigkeit nach EC2 Gl. (3.23) mit variabler Querschnittshöhe matBeamHeight:
    const fctm_fl_t = Number(fctmFl(fctm_t, matBeamHeight).toFixed(2));

    // Bemessungswerte fcd
    const fcd_28 = Number((0.85 * activeMatData.fck / 1.5).toFixed(1));
    const fcd_t = Number((0.85 * fck_t / 1.5).toFixed(1));

    // Reifegrad bezogen auf 28-Tage-fck:
    const maturity_pct = Number(((fck_t / activeMatData.fck) * 100).toFixed(1));

    // Kriterium für Spannfreigabe nach EC2 Abs. 5.10.2.2:
    const releaseReady = maturity_pct >= 70;
    const releaseOptimum = maturity_pct >= 80;

    // Maximal zulässige Betondruckspannung beim Vorspannen (EC2 Abs. 5.10.2.2(4)):
    const sigma_c_zul = Number((0.60 * fck_t).toFixed(1));

    return {
      t_eff: Number(t_eff.toFixed(1)),
      beta_cc: Number(beta_cc.toFixed(3)),
      fcm_t,
      fck_t,
      Ecm_28,
      Ecm_t,
      aggFactor,
      fctm_t,
      fctk005_t,
      fctk095_t,
      fctm_fl_t,
      fcd_28,
      fcd_t,
      maturity_pct,
      releaseReady,
      releaseOptimum,
      sigma_c_zul
    };
  }, [matGrade, matCement, matAgeDays, matTemp, matAggregate, matBeamHeight, activeMatData]);

  // Berechnete Punkte für die sigma-eps-Kurve (DIN EN 1992-1-1 Bild 3.2 & Bild 3.3)
  const stressStrainCurvePoints = useMemo(() => {
    const fcm = matMaturity.fcm_t;
    const Ecm = matMaturity.Ecm_t;
    const eps_c1 = activeMatData.eps_c1; // in ‰
    const eps_cu1 = activeMatData.eps_cu1; // in ‰
    const k = (1.05 * Ecm * (eps_c1 / 1000)) / fcm;

    const points: { eps: number; sigma: number; sigma_parabel: number }[] = [];
    const steps = 40;
    const fcd = matMaturity.fcd_t;
    const fckVal = activeMatData.fck;
    const eps_c2 = fckVal <= 50 ? 2.0 : 2.0 + 0.085 * Math.pow(fckVal - 50, 0.53);
    const eps_cu2 = fckVal <= 50 ? 3.5 : 2.6 + 35 * Math.pow((90 - fckVal) / 100, 4);
    const n = fckVal <= 50 ? 2.0 : 1.4 + 23.4 * Math.pow((90 - fckVal) / 100, 4);

    for (let i = 0; i <= steps; i++) {
      const eps = (i / steps) * eps_cu1;
      const eta = eps / eps_c1;
      let sigma = 0;
      if (eta > 0) {
        const nenner = 1 + (k - 2) * eta;
        if (nenner > 0) {
          sigma = Math.max(0, fcm * ((k * eta - Math.pow(eta, 2)) / nenner));
        }
      }

      // Parabel-Rechteck (GZT)
      let sigma_parabel = 0;
      if (eps <= eps_c2) {
        sigma_parabel = fcd * (1 - Math.pow(Math.max(0, 1 - eps / eps_c2), n));
      } else if (eps <= eps_cu2) {
        sigma_parabel = fcd;
      }

      points.push({
        eps: Number(eps.toFixed(3)),
        sigma: Number(sigma.toFixed(2)),
        sigma_parabel: Number(sigma_parabel.toFixed(2))
      });
    }
    return { points, eps_c1, eps_cu1, fcm, fcd, eps_c2, eps_cu2 };
  }, [matMaturity, activeMatData]);

  // Interactive micro-calculator states for quick exploration
  const [calcFck, setCalcFck] = useState<number>(45); // C45/55
  const [calcT0, setCalcT0] = useState<number>(7); // d
  const [calcRH, setCalcRH] = useState<number>(50); // %
  const [calcSteelLoss, setCalcSteelLoss] = useState<number>(2.5); // % (Klasse 2)

  // Interactive Example Calculation States (Vollständiges EC2-Zahlenbeispiel)
  const [exSpanT0, setExSpanT0] = useState<number>(7); // d (Spannalter)
  const [exSpanRH, setExSpanRH] = useState<number>(70); // % (Luftfeuchte)
  const [exConcreteClass, setExConcreteClass] = useState<'C35/45' | 'C45/55' | 'C70/85'>('C45/55');
  const [exP0, setExP0] = useState<number>(5000); // kN Nennkraft an der Presse

  const exConc = useMemo(() => {
    if (exConcreteClass === 'C35/45') {
      return { fck: 35, fcm: 43, Ecm: 34000, alpha_p: 195000 / 34000 };
    }
    if (exConcreteClass === 'C70/85') {
      return { fck: 70, fcm: 78, Ecm: 41000, alpha_p: 195000 / 41000 };
    }
    return { fck: 45, fcm: 53, Ecm: 36000, alpha_p: 195000 / 36000 };
  }, [exConcreteClass]);

  const exCalc = useMemo(() => {
    const Ap = 3600; // mm² (2 x 12 x 150)
    const Ac = 500000; // mm²
    const Ic = 8.5e10; // mm⁴
    const ep = 450; // mm
    const Ep = 195000; // N/mm²
    const fpk = 1860; // N/mm²

    const sigma_p0 = (exP0 * 1000) / Ap; // N/mm²
    // Unmittelbare Verluste (Reibung + Schlupf + elastische Stauchung)
    const immediateLosses = 157; // N/mm²
    const sigma_pm0 = Math.max(800, sigma_p0 - immediateLosses);
    const Pm0 = (Ap * sigma_pm0) / 1000; // kN

    // Betonspannung in Spanngliedhöhe in Feldmitte
    // Mg = 900 kNm
    const Mg = 900e6; // Nmm
    const sig_c_p0 = (Pm0 * 1000) / Ac + (Pm0 * 1000 * ep * ep) / Ic - (Mg * ep) / Ic;

    // Kriechzahl nach DIN EN 1992-1-1 Anhang B (inkl. alpha1, alpha2, alpha3 für fcm > 35 MPa)
    const phi = Number(creep(exConc.fck, exSpanT0, 'R', 278, exSpanRH).toFixed(2));

    // Schwinden
    // Schwinden nach EC2 3.1.4 / Anhang B.2 (h0 = 278 mm, Zement R), Rückgabe in ‰ → m/m
    const shr = shrinkage(exConc.fck, 'R', 278, exSpanRH);
    const eps_ca = shr.eps_ca * 1e-3;
    const eps_cd = shr.eps_cd * 1e-3;
    const eps_cs = eps_ca + eps_cd;

    // Relaxation
    const mu = sigma_pm0 / fpk;
    const delta_sig_pr = Number((0.66 * 2.5 * Math.exp(9.1 * mu) * Math.pow(500, 0.75 * (1 - mu)) * 1e-5 * sigma_pm0).toFixed(1));

    // DIN EN 1992-1-1 Gl. (5.46)
    // Zähler
    const term_schwinden = eps_cs * Ep;
    const term_kriechen = phi * exConc.alpha_p * sig_c_p0;
    const term_relaxation = 0.8 * delta_sig_pr;
    const zaehler = term_schwinden + term_kriechen + term_relaxation;

    // Nenner
    const k_geom = 1 + (Ac * ep * ep) / Ic;
    const nenner = 1 + exConc.alpha_p * (Ap / Ac) * k_geom * (1 + 0.8 * phi);

    const delta_sig_csr = Number((zaehler / nenner).toFixed(1));
    const sigma_pminf = Number((sigma_pm0 - delta_sig_csr).toFixed(1));
    const Pminf = Number(((Ap * sigma_pminf) / 1000).toFixed(0));
    const delta_P_total = exP0 - Pminf;
    const loss_pct = Number(((delta_P_total / exP0) * 100).toFixed(1));

    return {
      Ap,
      Ac,
      Ic,
      ep,
      Ep,
      fpk,
      sigma_p0: Number(sigma_p0.toFixed(0)),
      immediateLosses,
      sigma_pm0: Number(sigma_pm0.toFixed(0)),
      Pm0: Number(Pm0.toFixed(0)),
      sig_c_p0: Number(sig_c_p0.toFixed(2)),
      phi,
      eps_cs,
      eps_ca: Number((eps_ca * 1000).toFixed(3)),
      eps_cd: Number((eps_cd * 1000).toFixed(3)),
      delta_sig_pr,
      term_schwinden: Number(term_schwinden.toFixed(1)),
      term_kriechen: Number(term_kriechen.toFixed(1)),
      term_relaxation: Number(term_relaxation.toFixed(1)),
      zaehler: Number(zaehler.toFixed(1)),
      k_geom: Number(k_geom.toFixed(3)),
      nenner: Number(nenner.toFixed(3)),
      delta_sig_csr,
      sigma_pminf,
      Pminf,
      delta_P_total,
      loss_pct
    };
  }, [exP0, exSpanT0, exSpanRH, exConc]);

  // Quick estimation logic for the interactive micro-calc
  const estPhi = calcRH === 50 
    ? Math.max(1.8, 3.2 * Math.pow(calcT0, -0.22) * (45 / calcFck))
    : Math.max(1.2, 2.0 * Math.pow(calcT0, -0.20) * (45 / calcFck));
  const estEpsCs = calcRH === 50 ? 0.00038 : 0.00022; // m/m
  const approxInitialPrestress = 1350; // N/mm²
  const estCsrLossPct = Math.min(30, Math.max(8, (estPhi * 3.8 + estEpsCs * 195000 / approxInitialPrestress * 100 * 0.7 + calcSteelLoss * 0.8)));

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <BookOpen className="text-shiraz h-5 w-5" />
              Baustoffkennwerte &amp; Phänomene im Spannbetonbau
            </h3>
            <p className="text-xs text-text-main/70 mt-1">
              Physikalische Wirkmechanismen, mikrostrukturelle Prozesse und normative Bemessungsansätze nach DIN EN 1992-1-1 (Eurocode 2) &amp; DIN EN 10138
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap">
            Eurocode 2 Kap. 3 &amp; 5.10
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed mb-6">
          <p>
            Im konventionellen Stahlbetonbau werden Risse in der Zugzone bewusst toleriert (Zustand II). Im 
            <strong> Spannbetonbau</strong> hingegen wird das Tragwerk durch künstlich aufgebrachte Druckspannungen so überdrückt, 
            dass Zugspannungen unter Betriebsbelastung vermieden oder strikt begrenzt werden (Zustand I). Das Gelingen 
            dieses Prinzips hängt vollständig von der <strong>dauerhaften Beherrschung der Baustoffverformungen</strong> ab: 
            Kriechen und Schwinden des Betons sowie die molekulare Relaxation des Spannstahls führen über die Lebensdauer 
            zu unvermeidlichen Spannkraftverlusten: zeitabhängig typisch <strong>10 % bis 20 % von P<sub>m0</sub></strong>, insgesamt inkl. Reibung und Schlupf <strong>20 % bis 30 % der Pressenkraft</strong>.
          </p>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-home-grau/20">
          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === "beiwerte"
                ? "bg-shiraz text-white border-shiraz shadow-sm"
                : "bg-amber-50/80 text-amber-950 border-amber-300 hover:bg-amber-100/80"
            }`}
            onClick={() => setActiveSubTab('beiwerte')}
          >
            <Scale size={15} className={activeSubTab === 'beiwerte' ? 'text-white' : 'text-amber-800'} />
            <span>Beiwerte-Katalog (Schätz- vs. Rechenwerte)</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded bg-shiraz/20 text-shiraz font-mono font-bold">
              EC2
            </span>
          </button>
          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === 'beton'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveSubTab('beton')}
          >
            <Building size={15} /> Beton-Materialeigenschaften (<InlineMath math="f_{ck}, E_{cm}" />)
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === 'einpressmoertel'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveSubTab('einpressmoertel')}
          >
            <Droplets size={15} /> Einpressmörtel &amp; Systembaustoffe (DIN EN 447, Hüllrohre, Fette)
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === 'kriechen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveSubTab('kriechen')}
          >
            <Clock size={15} /> Kriechen (<InlineMath math="\varphi" />)
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === 'schwinden'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveSubTab('schwinden')}
          >
            <Droplets size={15} /> Schwinden (<InlineMath math="\varepsilon_{cs}" />)
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === 'relaxation'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveSubTab('relaxation')}
          >
            <Zap size={15} /> Stahlrelaxation (<InlineMath math="\Delta\sigma_{pr}" />)
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === 'elastisch'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveSubTab('elastisch')}
          >
            <Layers size={15} /> Elastische Stauchung &amp; E-Modul
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === 'kopplung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveSubTab('kopplung')}
          >
            <Scale size={15} /> EC2-Kopplung (c+s+r)
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === 'mechanisch'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveSubTab('mechanisch')}
          >
            <Compass size={15} /> Reibung &amp; Keilschlupf
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === 'beispielrechnung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveSubTab('beispielrechnung')}
          >
            <Calculator size={15} /> EC2-Beispielrechnung (Zahlenbeispiel)
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeSubTab === 'rechner'
                ? 'bg-zinc-800 text-white border-zinc-800 shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveSubTab('rechner')}
          >
            <Activity size={15} /> Kennwerte-Schnellrechner
          </button>
        </div>
      </div>

      {/* 0. TAB: BEIWERTE-KATALOG (SCHÄTZ- VS. RECHENWERTE) */}
      {activeSubTab === 'beiwerte' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <BeiwerteKatalog />
        </div>
      )}

      {/* 0. TAB: BETON-MATERIALEIGENSCHAFTEN */}
      {activeSubTab === 'beton' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Hauptkarte: Werkstoff-Labor & Reife-Simulator */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/15 pb-4">
              <div>
                <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Building className="text-shiraz h-5 w-5" />
                  0. Beton-Materialeigenschaften im Spannbetonbau
                </h4>
                <p className="text-xs text-text-main/70 mt-1">
                  Druckfestigkeit (<InlineMath math="f_{ck}" />), Elastizitätsmodul (<InlineMath math="E_{cm}" />), Zugfestigkeiten (<InlineMath math="f_{ctm}" />) &amp; Reifeentwicklung nach DIN EN 1992-1-1 (Eurocode 2) Kap. 3.1 &amp; DIN 1045-2
                </p>
              </div>
              <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap">
                EC2 Tab. 3.1 &amp; Gl. (3.1)–(3.5)
              </span>
            </div>

            {/* Didaktische Einleitung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
              <div>
                <strong className="text-text-main block mb-1">Warum sind die Betoneigenschaften im Spannbetonbau kritischer als im Stahlbeton?</strong>
                <p>
                  Im klassischen Stahlbetonbau werden Risse in der Zugzone einkalkuliert. Im <strong>Spannbetonbau</strong> muss der Beton 
                  enorme konzentrierte Einleitungsdrücke unter den Spannankern aufnehmen und über Jahrzehnte hinweg 
                  kriech- und schwindarm bleiben. Die Dekompression verlangt Druckspannungen um das Spannglied (<InlineMath math="\sigma_c \le 0" />); die Zugfestigkeit ist dafür nicht maßgebend, wohl aber für die Rissschnittgröße und Rissvermeidung.
                </p>
              </div>
              <div>
                <strong className="text-text-main block mb-1">Vorspannzeitpunkt (<InlineMath math="t_0" />) &amp; Frühfestigkeit:</strong>
                <p>
                  Die Spannkraft darf erst eingeleitet werden, wenn der Beton eine ausreichende Druckfestigkeit aufweist 
                  (typischerweise <InlineMath math="f_{ck}(t) \ge 0{,}70 \cdot f_{ck}" />). Ein zu frühes Spannen führt zu 
                  übermäßigen Kriechverlusten, Gefügezerrüttung und Verankerungsversagen.
                </p>
              </div>
            </div>

            {/* Interaktive Steuerung: Klasse, Zement, Alter, Temperatur, Gesteinskörnung */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-shiraz" />
                  Interaktiver Werkstoff- &amp; Reifesimulator
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Aktuell: <strong className="text-shiraz font-bold">{matGrade}</strong> | Alter: <strong className="text-slate-800 font-bold">{formatDeWert(matAgeDays)} d</strong> ({formatDeWert(matTemp)} °C)
                </span>
              </div>

              {/* 1. Betonklassen Schnellwahlschalter */}
              <div>
                <label className="text-xs font-semibold text-text-main block mb-2">
                  Druckfestigkeitsklasse wählen (DIN EN 1992-1-1 Tab. 3.1):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {Object.keys(concDatabase).map((grade) => {
                    const isSelected = matGrade === grade;
                    const item = concDatabase[grade];
                    return (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setMatGrade(grade)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-shiraz text-white border-shiraz shadow-sm ring-2 ring-shiraz/30'
                            : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                        }`}
                      >
                        <span className="text-xs font-bold font-mono">{grade}</span>
                        <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                          {formatDeWert(item.fck)} / {formatDeWert(item.fck_cube)} MPa
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Zement, Alter, Temperatur, Gesteinskörnung & Querschnittshöhe h */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
                {/* Zementklasse */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-main flex items-center justify-between">
                    <span>Zement-Klasse:</span>
                    <span className="font-mono text-shiraz font-bold">Klasse {matCement}</span>
                  </label>
                  <select
                    value={matCement}
                    onChange={(e) => setMatCement(e.target.value as 'R' | 'N' | 'S')}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium outline-none focus:border-shiraz"
                  >
                    <option value="R">Klasse R (schnell; s = 0,20)</option>
                    <option value="N">Klasse N (normal; s = 0,25)</option>
                    <option value="S">Klasse S (langsam; s = 0,38)</option>
                  </select>
                  <p className="text-[10px] text-slate-500">Beiwert s in EC2 Gl. (3.2)</p>
                </div>

                {/* Betonalter t */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                    <span>Betonalter t:</span>
                    <span className="font-mono text-shiraz font-bold">{formatDeWert(matAgeDays)} d</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="90"
                    step="1"
                    value={matAgeDays}
                    onChange={(e) => setMatAgeDays(Number(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <button type="button" onClick={() => setMatAgeDays(1)} className="hover:text-shiraz cursor-pointer">1 d</button>
                    <button type="button" onClick={() => setMatAgeDays(3)} className="hover:text-shiraz cursor-pointer">3 d</button>
                    <button type="button" onClick={() => setMatAgeDays(7)} className="hover:text-shiraz cursor-pointer">7 d</button>
                    <button type="button" onClick={() => setMatAgeDays(28)} className="hover:text-shiraz cursor-pointer">28 d</button>
                    <button type="button" onClick={() => setMatAgeDays(90)} className="hover:text-shiraz cursor-pointer">90 d</button>
                  </div>
                </div>

                {/* Erhärtungstemperatur T */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                    <span className="flex items-center gap-1">
                      <Thermometer size={13} className="text-shiraz" />
                      Temperatur T:
                    </span>
                    <span className="font-mono text-shiraz font-bold">{formatDeWert(matTemp)} °C</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={matTemp}
                    onChange={(e) => setMatTemp(Number(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <button type="button" onClick={() => setMatTemp(10)} className="hover:text-shiraz cursor-pointer">10 °C</button>
                    <button type="button" onClick={() => setMatTemp(20)} className="hover:text-shiraz cursor-pointer">20 °C</button>
                    <button type="button" onClick={() => setMatTemp(60)} className="hover:text-shiraz cursor-pointer">60 °C (Dampf)</button>
                  </div>
                </div>

                {/* Gesteinskörnung */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-main flex items-center justify-between">
                    <span>Gestein (EC2 3.1.3):</span>
                    <span className="font-mono text-shiraz font-bold">α_E = {formatDeZahl(matMaturity.aggFactor, 2)}</span>
                  </label>
                  <select
                    value={matAggregate}
                    onChange={(e) => setMatAggregate(e.target.value as 'quarzit' | 'basalt' | 'kalkstein' | 'sandstein')}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium outline-none focus:border-shiraz"
                  >
                    <option value="quarzit">Quarzit (α_E = 1,00)</option>
                    <option value="basalt">Basalt (+20 %, α_E = 1,20)</option>
                    <option value="kalkstein">Kalkstein (-10 %, α_E = 0,90)</option>
                    <option value="sandstein">Sandstein (-30 %, α_E = 0,70)</option>
                  </select>
                  <p className="text-[10px] text-slate-500">Beeinflusst E-Modul &amp; Kriechen</p>
                </div>

                {/* Querschnittshöhe h für Biegezugfestigkeit */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                    <span>Höhe h (f_ctm,fl):</span>
                    <span className="font-mono text-shiraz font-bold">{formatDeWert(matBeamHeight)} mm</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="2000"
                    step="50"
                    value={matBeamHeight}
                    onChange={(e) => setMatBeamHeight(Number(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>h = {formatDeWert(matBeamHeight)} mm</span>
                    <span>f_ctm,fl = {formatDeWert(matMaturity.fctm_fl_t)} MPa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 KPI Highlight-Karten */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Druckfestigkeit */}
              <div className="p-4 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-text-main/70">
                  <span className="font-semibold uppercase tracking-wider">Zylinderfestigkeit</span>
                  <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">t = {formatDeWert(matAgeDays)} d</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-shiraz">{formatDeWert(matMaturity.fck_t)}</span>
                  <span className="text-xs text-text-main/60 font-medium">N/mm² (f_ck(t))</span>
                </div>
                <div className="text-[11px] text-text-main/80 space-y-0.5 border-t border-home-grau/15 pt-2">
                  <div className="flex justify-between">
                    <span>28-Tage-Normwert:</span>
                    <strong className="font-mono">{formatDeWert(activeMatData.fck)} N/mm²</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mittlere Druckfestigkeit:</span>
                    <strong className="font-mono">{formatDeWert(matMaturity.fcm_t)} N/mm²</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Würfelfestigkeit f_ck,cube:</span>
                    <strong className="font-mono">{formatDeWert(activeMatData.fck_cube)} N/mm²</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Bemessungswert f_cd(t):</span>
                    <strong className="font-mono text-shiraz">{formatDeWert(matMaturity.fcd_t)} N/mm²</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: Elastizitätsmodul */}
              <div className="p-4 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-text-main/70">
                  <span className="font-semibold uppercase tracking-wider">Elastizitätsmodul</span>
                  <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">E_cm(t)</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-900">{formatDeWert(matMaturity.Ecm_t)}</span>
                  <span className="text-xs text-text-main/60 font-medium">N/mm²</span>
                </div>
                <div className="text-[11px] text-text-main/80 space-y-0.5 border-t border-home-grau/15 pt-2">
                  <div className="flex justify-between">
                    <span>28-Tage-Wert (mit Gestein):</span>
                    <strong className="font-mono">{formatDeWert(matMaturity.Ecm_28)} N/mm²</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tabellenwert EC2 Tab. 3.1:</span>
                    <strong className="font-mono">{formatDeWert(activeMatData.Ecm)} N/mm²</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Gesteinsfaktor α_E:</span>
                    <strong className="font-mono">{formatDeZahl(matMaturity.aggFactor, 2)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Elastische Stauchung bei 10 MPa:</span>
                    <strong className="font-mono">{formatDeZahl(((10 / matMaturity.Ecm_t) * 1000), 2)} ‰</strong>
                  </div>
                </div>
              </div>

              {/* Card 3: Zugfestigkeiten */}
              <div className="p-4 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-text-main/70">
                  <span className="font-semibold uppercase tracking-wider">Zugfestigkeit</span>
                  <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">f_ctm(t)</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-900">{formatDeWert(matMaturity.fctm_t)}</span>
                  <span className="text-xs text-text-main/60 font-medium">N/mm²</span>
                </div>
                <div className="text-[11px] text-text-main/80 space-y-0.5 border-t border-home-grau/15 pt-2">
                  <div className="flex justify-between">
                    <span>Unteres 5%-Quantil f_ctk,0.05:</span>
                    <strong className="font-mono text-blue-700">{formatDeWert(matMaturity.fctk005_t)} N/mm²</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Oberes 95%-Quantil f_ctk,0.95:</span>
                    <strong className="font-mono text-purple-700">{formatDeWert(matMaturity.fctk095_t)} N/mm²</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Biegezugfestigkeit f_ctm,fl:</span>
                    <strong className="font-mono">{formatDeWert(matMaturity.fctm_fl_t)} N/mm²</strong>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Rissnachweis / Dekompression maßgebend: f_ctk,0.05</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Spannfreigabe & Reife */}
              <div className={`p-4 rounded-xl border shadow-xs space-y-2 ${
                matMaturity.releaseOptimum
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : matMaturity.releaseReady
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-rose-50/70 border-rose-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-slate-700">Spannfreigabe (Transfer)</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    matMaturity.releaseOptimum
                      ? 'bg-emerald-600 text-white'
                      : matMaturity.releaseReady
                      ? 'bg-amber-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}>
                    {matMaturity.releaseOptimum ? 'Optimal' : matMaturity.releaseReady ? 'Bedingt zulässig' : 'Gesperrt!'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold font-mono ${
                    matMaturity.releaseOptimum ? 'text-emerald-900' : matMaturity.releaseReady ? 'text-amber-900' : 'text-rose-900'
                  }`}>
                    {formatDeWert(matMaturity.maturity_pct)} %
                  </span>
                  <span className="text-xs text-slate-600 font-medium">von f_ck,28</span>
                </div>
                <div className="text-[11px] text-slate-700 space-y-0.5 border-t border-slate-300/40 pt-2">
                  <div className="flex justify-between">
                    <span>Zulässige Betondruckspannung:</span>
                    <strong className="font-mono text-slate-900">{formatDeWert(matMaturity.sigma_c_zul)} N/mm²</strong>
                  </div>
                  <div className="text-[10px] text-slate-600">
                    <InlineMath math="\sigma_{c,zul} = 0{,}60 \cdot f_{ck}(t)" /> (EC2 5.10.2.2)
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span>Äquivalentes Alter t_eff:</span>
                    <strong className="font-mono">{formatDeWert(matMaturity.t_eff)} d</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Interaktives SVG-Diagramm: Spannungs-Dehnungs-Linie nach EC2 Bild 3.2 */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/15 pb-2">
                <div>
                  <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                    <Activity className="text-shiraz h-4 w-4" />
                    Spannungs-Dehnungs-Kennlinie (<InlineMath math="\sigma_c - \varepsilon_c" />) für {matGrade} bei t = {formatDeWert(matAgeDays)} d
                  </h5>
                  <p className="text-[11px] text-text-main/70">
                    Vergleich der realen Arbeitslinie nach DIN EN 1992-1-1 Gl. (3.14) mit dem Parabel-Rechteck-Diagramm (GZT)
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-shiraz">
                    <span className="w-3.5 h-1 bg-shiraz rounded-full inline-block"></span> Reale Arbeitslinie Gl. (3.14)
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-slate-500">
                    <span className="w-3.5 h-0.5 border-b-2 border-dashed border-slate-500 inline-block"></span> Parabel-Rechteck (GZT)
                  </span>
                </div>
              </div>

              {/* SVG Plot */}
              <div className="w-full overflow-x-auto bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <div className="min-w-[620px]">
                  <svg viewBox="0 0 700 280" className="w-full h-64">
                    <defs>
                      <marker id="arrow-axis-mat" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                      </marker>
                    </defs>

                    {/* Koordinatensystem: Ursprung bei (70, 240) */}
                    {/* Y-Achse: Spannung sigma_c [N/mm²] (0 bis ca. 110 MPa) */}
                    {/* X-Achse: Stauchung eps_c [‰] (0 bis 4.0 ‰) */}
                    <line x1="70" y1="240" x2="660" y2="240" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-axis-mat)" />
                    <line x1="70" y1="240" x2="70" y2="20" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-axis-mat)" />

                    <text x="665" y="245" fontSize="11" fill="#475569" fontWeight="bold">Stauchung ε_c [‰]</text>
                    <text x="75" y="20" fontSize="11" fill="#475569" fontWeight="bold">Druckspannung σ_c [N/mm²]</text>

                    {/* Gitternetzlinien X (Dehnung 1.0, 2.0, 3.0, 3.5, 4.0 ‰) */}
                    {[1.0, 2.0, 3.0, 3.5].map((val) => {
                      const xPos = 70 + (val / 4.0) * 560;
                      return (
                        <g key={val}>
                          <line x1={xPos} y1="240" x2={xPos} y2="30" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                          <text x={xPos} y="255" fontSize="10" fill="#64748b" textAnchor="middle">{formatDeWert(val)} ‰</text>
                        </g>
                      );
                    })}

                    {/* Gitternetzlinien Y (Spannungsskalierung dynamisch an matMaturity.fcm_t) */}
                    {(() => {
                      const maxSigmaY = Math.max(50, Math.ceil(matMaturity.fcm_t * 1.15 / 10) * 10);
                      const yTicks = [
                        Math.round(maxSigmaY * 0.25),
                        Math.round(maxSigmaY * 0.5),
                        Math.round(maxSigmaY * 0.75),
                        maxSigmaY
                      ];

                      return yTicks.map((yVal) => {
                        const yPos = 240 - (yVal / maxSigmaY) * 200;
                        return (
                          <g key={yVal}>
                            <line x1="70" y1={yPos} x2="630" y2={yPos} stroke="#e2e8f0" strokeWidth="1" />
                            <text x="62" y={yPos + 3} fontSize="10" fill="#64748b" textAnchor="end">{formatDeWert(yVal)}</text>
                          </g>
                        );
                      });
                    })()}

                    {/* Skalierungsfunktionen */}
                    {(() => {
                      const maxSigmaY = Math.max(50, Math.ceil(matMaturity.fcm_t * 1.15 / 10) * 10);
                      const getX = (eps: number) => 70 + (eps / 4.0) * 560;
                      const getY = (sig: number) => 240 - (sig / maxSigmaY) * 200;

                      // Kurven-Pfade
                      const pts = stressStrainCurvePoints.points;
                      if (pts.length === 0) return null;

                      const pathReal = pts
                        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.eps)} ${getY(p.sigma)}`)
                        .join(' ');

                      const pathParabel = pts
                        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.eps)} ${getY(p.sigma_parabel)}`)
                        .join(' ');

                      // Peak Point Coordinates
                      const peakX = getX(activeMatData.eps_c1);
                      const peakY = getY(matMaturity.fcm_t);

                      // Ultimate Point Coordinates
                      const ultX = getX(activeMatData.eps_cu1);
                      const ultPt = pts[pts.length - 1];
                      const ultY = getY(ultPt ? ultPt.sigma : matMaturity.fcm_t * 0.85);

                      // Design strength line
                      const fcdY = getY(matMaturity.fcd_t);

                      return (
                        <g>
                          {/* Parabel-Rechteck-Pfad (GZT Bemessung) */}
                          <path d={pathParabel} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5 4" />

                          {/* Reale Kurve (EC2 Gl. 3.14) */}
                          <path d={pathReal} fill="none" stroke="#990033" strokeWidth="3" />

                          {/* Scheitelpunkt f_cm Marker */}
                          <circle cx={peakX} cy={peakY} r="5" fill="#990033" stroke="#ffffff" strokeWidth="2" />
                          <line x1={peakX} y1={peakY} x2={peakX} y2="240" stroke="#990033" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="70" y1={peakY} x2={peakX} y2={peakY} stroke="#990033" strokeWidth="1" strokeDasharray="3 3" />
                          <text x={peakX + 8} y={peakY - 6} fontSize="11" fill="#990033" fontWeight="bold">
                            f_cm(t) = {formatDeWert(matMaturity.fcm_t)} MPa (ε_c1 = {formatDeWert(activeMatData.eps_c1)} ‰)
                          </text>

                          {/* Bruchstauchung ε_cu1 Marker (Arbeitslinie Gl. 3.14) */}
                          <circle cx={ultX} cy={ultY} r="4" fill="#990033" stroke="#ffffff" strokeWidth="1.5" />
                          <line x1={ultX} y1={ultY} x2={ultX} y2="240" stroke="#990033" strokeWidth="1" strokeDasharray="3 3" />
                          <text x={ultX} y={235} fontSize="10" fill="#990033" textAnchor="end" fontWeight="bold">
                            Arbeitslinie: ε_cu1 = {formatDeWert(activeMatData.eps_cu1)} ‰
                          </text>

                          {/* Parabel-Rechteck Marker: eps_c2 und eps_cu2 */}
                          {(() => {
                            const c2X = getX(activeMatData.eps_c2);
                            const cu2X = getX(activeMatData.eps_cu2);
                            return (
                              <g>
                                <line x1={c2X} y1={fcdY} x2={c2X} y2="240" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                                <text x={c2X} y={fcdY - 5} fontSize="9" fill="#475569" textAnchor="middle">
                                  ε_c2 = {formatDeWert(activeMatData.eps_c2)} ‰
                                </text>
                                <line x1={cu2X} y1={fcdY} x2={cu2X} y2="240" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                                <text x={cu2X} y={fcdY - 5} fontSize="9" fill="#475569" textAnchor="end" fontWeight="bold">
                                  Parabel Bruch: ε_cu2 = {formatDeWert(activeMatData.eps_cu2)} ‰
                                </text>
                              </g>
                            );
                          })()}

                          {/* Zulässige Vorspann-Spannung 0.60 fck */}
                          {(() => {
                            const zulY = getY(matMaturity.sigma_c_zul);
                            return (
                              <g>
                                <line x1="70" y1={zulY} x2="550" y2={zulY} stroke="#059669" strokeWidth="1.5" strokeDasharray="4 2" />
                                <text x="555" y={zulY + 3} fontSize="10" fill="#059669" fontWeight="bold">
                                  zul σ_c = 0,60 f_ck(t) ({formatDeWert(matMaturity.sigma_c_zul)} MPa)
                                </text>
                              </g>
                            );
                          })()}

                          {/* fcd Bemessungswert */}
                          <line x1="70" y1={fcdY} x2="450" y2={fcdY} stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                          <text x="455" y={fcdY + 3} fontSize="10" fill="#64748b">
                            f_cd(t) = {formatDeWert(matMaturity.fcd_t)} MPa
                          </text>
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              </div>
              <p className="text-xs text-text-main/70">
                <strong>Didaktischer Hinweis:</strong> Achten Sie auf den Unterschied zwischen Normalbeton (C30/37 bis C50/60) 
                und Hochleistungsbeton (C70/85 und C90/105): Bei hochfestem Beton steigt der Scheitelwert drastisch an, 
                der abfallende Ast wird jedoch wesentlich steiler und die Bruchstauchung <InlineMath math="\varepsilon_{cu1}" /> 
                sinkt von 3,5 ‰ auf 2,8 ‰, <InlineMath math="\varepsilon_{cu2}" /> (Parabel-Rechteck) von 3,5 ‰ auf 2,6 ‰ (spröderes Bruchverhalten!).
              </p>
            </div>

            {/* Vollständige DIN EN 1992-1-1 Tabelle 3.1 & 3.2 Normübersicht */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <BookOpen className="text-shiraz h-4 w-4" />
                  Eurocode 2 Normkennwerte aller Spannbeton-Festigkeitsklassen (DIN EN 1992-1-1 Tab. 3.1)
                </h5>
                <span className="text-[11px] text-slate-500">Klick auf eine Zeile wählt die Klasse</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-text-main border-b border-home-grau/30 font-semibold">
                      <th className="p-2.5">Klasse</th>
                      <th className="p-2.5 font-mono">f_ck [MPa]</th>
                      <th className="p-2.5 font-mono">f_ck,cube</th>
                      <th className="p-2.5 font-mono">f_cm [MPa]</th>
                      <th className="p-2.5 font-mono">f_ctm [MPa]</th>
                      <th className="p-2.5 font-mono">f_ctk,0.05</th>
                      <th className="p-2.5 font-mono">f_ctk,0.95</th>
                      <th className="p-2.5 font-mono">E_cm [MPa]</th>
                      <th className="p-2.5 font-mono">ε_c1 [‰]</th>
                      <th className="p-2.5 font-mono">ε_cu1 [‰]</th>
                      <th className="p-2.5">Eignung im Spannbetonbau</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20">
                    {Object.keys(concDatabase).map((grade) => {
                      const isRowActive = matGrade === grade;
                      const d = concDatabase[grade];
                      return (
                        <tr
                          key={grade}
                          onClick={() => setMatGrade(grade)}
                          className={`cursor-pointer transition-colors ${
                            isRowActive
                              ? 'bg-shiraz/10 font-semibold text-shiraz'
                              : 'hover:bg-off-white text-text-main/80'
                          }`}
                        >
                          <td className="p-2.5 font-bold font-mono flex items-center gap-1.5">
                            {isRowActive && <Check size={13} className="text-shiraz" />}
                            {grade}
                          </td>
                          <td className="p-2.5 font-mono">{formatDeWert(d.fck)}</td>
                          <td className="p-2.5 font-mono">{formatDeWert(d.fck_cube)}</td>
                          <td className="p-2.5 font-mono">{formatDeWert(d.fcm)}</td>
                          <td className="p-2.5 font-mono">{formatDeZahl(d.fctm, 2)}</td>
                          <td className="p-2.5 font-mono text-blue-700">{formatDeZahl(d.fctk005, 2)}</td>
                          <td className="p-2.5 font-mono text-purple-700">{formatDeZahl(d.fctk095, 2)}</td>
                          <td className="p-2.5 font-mono">{formatDeWert(d.Ecm)}</td>
                          <td className="p-2.5 font-mono">{formatDeWert(d.eps_c1)}</td>
                          <td className="p-2.5 font-mono">{formatDeWert(d.eps_cu1)}</td>
                          <td className="p-2.5 text-[11px]">{d.typicalUse}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4 Fachtechnische Vertiefungs-Boxen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Mindestdruckfestigkeiten */}
              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-shiraz" />
                  1. Normative Mindestdruckfestigkeiten &amp; Baupraxis
                </h5>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Nach <strong>DIN EN 1992-1-1 Abs. 3.1.2</strong> und den nationalen Anwendungsregeln (DIN 1045-2) gelten folgende Erfahrungswerte und Regelungen:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                  <li><strong>Nachträglicher Verbund (Hüllrohre):</strong> Übliche Praxis mindestens <strong>C30/37</strong>, um Berst- und Spaltzugspannungen hinter den Ankerkörpern sicher abzutragen.</li>
                  <li><strong>Sofortiger Verbund (Spannbett):</strong> Übliche Praxis mindestens <strong>C35/45</strong>, da die Kraftübertragung rein über Verbund, Keilwirkung (Hoyer-Effekt) und Adhäsion erfolgt.</li>
                  <li><strong>Brückenbau:</strong> In der Praxis werden meist <strong>C35/45 bis C45/55</strong> eingesetzt (Anforderungen der ZTV-ING und des Bauherrn prüfen).</li>
                  <li><strong>Zulassungsbezug:</strong> Die Mindestfestigkeit zum Spannzeitpunkt regelt verbindlich die europäische technische Bewertung (ETA) bzw. allgemeine bauaufsichtliche Zulassung (abZ) des jeweiligen Spannverfahrens.</li>
                </ul>
              </div>

              {/* Box 2: Reife & Dampfhärtung */}
              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                  <Thermometer className="h-4 w-4 text-shiraz" />
                  2. Reifeentwicklung &amp; Wärmebehandlung
                </h5>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Im Fertigteilwerk werden Spannbetonelemente oft <strong>wärmebehandelt (60 °C)</strong>, um die Formen nach 12–16 Stunden 
                  wieder zu entspannen. Das äquivalente Alter wird nach der <strong>Arrhenius-Gleichung</strong> (EC2 Gl. B.10) berechnet:
                </p>
                <div className="bg-white p-2 rounded-lg border border-home-grau/20 text-center font-mono text-[11px]">
                  <InlineMath math="t_T = \sum_{i=1}^n \Delta t_i \cdot \exp\left[ 4000 \cdot \left(\frac{1}{293} - \frac{1}{273 + T(\Delta t_i)}\right) \right]" />
                </div>
                <p className="text-[11px] text-text-main/70">
                  Bei 60 °C läuft die Hydratation etwa 5-mal schneller ab als bei 20 °C Normtemperatur (nach Gl. B.10).
                </p>
              </div>

              {/* Box 3: Gesteinskörnung & E-Modul */}
              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-shiraz" />
                  3. Einfluss der Gesteinskörnung auf Steifigkeit
                </h5>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Der Elastizitätsmodul hängt stark vom Gesteinstyp der Gesteinskörnung ab (EC2 Abs. 3.1.3):
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                  <li><strong>Basalt / Diabas:</strong> <InlineMath math="\alpha_E = 1{,}20" /> (+20 % E-Modul, extrem steif, minimale Durchbiegung).</li>
                  <li><strong>Quarzit (Normreferenz):</strong> <InlineMath math="\alpha_E = 1{,}00" />.</li>
                  <li><strong>Kalkstein:</strong> <InlineMath math="\alpha_E = 0{,}90" /> (-10 % E-Modul).</li>
                  <li><strong>Sandstein:</strong> <InlineMath math="\alpha_E = 0{,}70" /> (-30 % E-Modul, führt zu massiv erhöhter elastischer Stauchung und Kriechverlusten!).</li>
                </ul>
              </div>

              {/* Box 4: Mehraxialer Druck & Verankerung */}
              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-shiraz" />
                  4. Teilflächenbelastung in der Verankerungszone
                </h5>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Direkt unter den Spannankern entsteht ein <strong>dreiachsiger Druckspannungszustand</strong>, 
                  der die lokale Druckfestigkeit des Betons gegenüber dem einachsigen Zylinderwert dramatisch steigert (EC2 Gl. 6.63):
                </p>
                <div className="bg-white p-2 rounded-lg border border-home-grau/20 text-center font-mono text-[11px]">
                  <BlockMath math="F_{Rdu} = A_{c0} \cdot f_{cd} \cdot \sqrt{\frac{A_{c1}}{A_{c0}}} \le 3{,}0 \cdot f_{cd} \cdot A_{c0}" />
                </div>
                <p className="text-[11px] text-text-main/70">
                  Trotzdem müssen Spaltzug- und Berstzugkräfte im dahinterliegenden ungestörten Bereich 
                  durch kräftige Wendel- und Bügelbewehrungen aufgenommen werden.
                </p>
              </div>
            </div>

            {/* Tabelle 3.1 nach DIN EN 1992-1-1 */}
            <div className="p-5 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-shiraz" />
                  Tabelle 1: Wesentliche mechanische Betonkennwerte und deren Zeitabhängigkeit (DIN EN 1992-1-1)
                </h5>
                <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">EC2 Kap. 3.1</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                      <th className="p-2.5">Mechanische Eigenschaft</th>
                      <th className="p-2.5">Formelzeichen (EC2)</th>
                      <th className="p-2.5">Zeit- und Alterungsabhängigkeit</th>
                      <th className="p-2.5">Praxisbedeutung im Spannbetonbau</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold">Charakt. Zylinderdruckfestigkeit</td>
                      <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="f_{ck}" /></td>
                      <td className="p-2.5">Genormt bei <InlineMath math="t = 28" /> Tagen (Wasserlagerung 20 °C)</td>
                      <td className="p-2.5 text-[11px]">Klassifizierungsgrundlage (z. B. C30/37 oder C50/60)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold">Mittlere Zylinderdruckfestigkeit</td>
                      <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="f_{cm}(t)" /></td>
                      <td className="p-2.5">Steigt stark in den ersten 7 Tagen, danach asymptotisch (<InlineMath math="\beta_{cc}(t)" />)</td>
                      <td className="p-2.5 text-[11px]">Bestimmt Übertragungsdruckfestigkeit beim Spannen (<InlineMath math="t_0" />)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold">Mittlere axiale Zugfestigkeit</td>
                      <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="f_{ctm}(t)" /></td>
                      <td className="p-2.5">EC2 setzt für t &lt; 28 d dieselbe Entwicklung wie für f_cm an (α = 1, Gl. 3.4)</td>
                      <td className="p-2.5 text-[11px]">Maßgebend für Rissbildung &amp; Dekompressionsgrenzen</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold">Sekanten-Elastizitätsmodul</td>
                      <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="E_{cm}(t)" /></td>
                      <td className="p-2.5">Folgt der 0,3-Potenz der Druckfestigkeitsentwicklung</td>
                      <td className="p-2.5 text-[11px]">Bestimmt elastische Stauchung &amp; Kriechverformung</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 0b. TAB: EINPRESSMÖRTEL & SYSTEMBAUSTOFFE */}
      {activeSubTab === 'einpressmoertel' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/15 pb-4">
              <div>
                <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Droplets className="text-shiraz h-5 w-5" />
                  Einpressmörtel &amp; Systembaustoffe im Spannbetonbau
                </h4>
                <p className="text-xs text-text-main/70 mt-1">
                  Zementeinpressmörtel nach DIN EN 447 / 445 / 446, Hüllrohrsysteme (DIN EN 523 vs. fib Bulletin 75), Korrosionsschutzfette &amp; Keilverankerungen
                </p>
              </div>
              <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap">
                DIN EN 447 &amp; fib Bulletin 75
              </span>
            </div>

            {/* Didaktische Einleitung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
              <div>
                <strong className="text-text-main block mb-1">Die 4 Schutz- und Verbundelemente des Spannglieds:</strong>
                <p>
                  Im nachträglichen Verbund und bei unverbundenen Spanngliedern ist der hochfeste Spannstahl extrem 
                  korrosionsgefährdet (Gefahr von <strong>Spannungsrisskorrosion / Wasserstoffversprödung</strong>). 
                  Die Systembaustoffe bilden eine mehrstufige Barriere: 
                  <strong> 1. Einpressmörtel</strong> (chemische Passivierung mit <InlineMath math="\text{pH} \ge 12{,}5" />), 
                  <strong> 2. Hüllrohr</strong> (mechanischer Schutz gegen Feuchte und Chloride), 
                  <strong> 3. Korrosionsschutzfett/Wachs</strong> (bei Monolitzen) und 
                  <strong> 4. Keilverankerungen</strong> aus einsatzgehärtetem Qualitätsstahl.
                </p>
              </div>
              <div>
                <strong className="text-text-main block mb-1">Warum ist Einpressmörtel kein normaler Mörtel?</strong>
                <p>
                  Einpressmörtel muss über Entfernungen von bis zu 100 m durch enge Litzenzwischenräume gepresst werden. 
                  Er erfordert <strong>extrem hohe Fließfähigkeit</strong> bei gleichzeitig 
                  <strong> minimalem Wassergehalt (<InlineMath math="w/z \le 0{,}35 - 0{,}40" />)</strong>, 
                  darf <strong>kein freies Wasser absondern (Bluten <InlineMath math="\le 0{,}3\,\%" />)</strong> und muss durch 
                  spezielle Quellmittel das plastische Schwinden vollständig kompensieren.
                </p>
              </div>
            </div>

            {/* 1. INTERAKTIVES MÖRTEL-LABOR: REZEPTUR & GÜTE NACH DIN EN 447 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-shiraz" />
                  Mörtel-Labor &amp; Gütesimulation nach DIN EN 447 / DIN EN 445
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Prüfung bei 20 °C Normtemperatur
                </span>
              </div>

              {/* Steuerregler: w/z-Wert, Zusatzmittel, Zement */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {/* w/z-Wert */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                    <span>Wasser-Zement-Wert (w/z):</span>
                    <span className={`font-mono font-bold ${
                      groutWz <= 0.40 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {formatDeZahl(groutWz, 2)} {groutWz > 0.40 ? '(Normüberschreitung!)' : '(zulässig)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.30"
                    max="0.45"
                    step="0.01"
                    value={groutWz}
                    onChange={(e) => setGroutWz(Number(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0,30 (sehr zäh)</span>
                    <span className="text-emerald-700 font-bold">0,36 (Optimum)</span>
                    <span className="text-rose-600 font-bold">0,44 (Grenze DIN EN 447 prüfen)</span>
                    <span>0,45 (Bluten!)</span>
                  </div>
                </div>

                {/* Einpresshilfe / Zusatzmittel */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                    <span>Einpresshilfe (DIN EN 934-4):</span>
                    <span className="font-mono text-shiraz font-bold">{formatDeZahl(groutAdmixturePct, 1)} % v. Zement</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.0"
                    step="0.1"
                    value={groutAdmixturePct}
                    onChange={(e) => setGroutAdmixturePct(Number(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0,2 % (Gering)</span>
                    <span className="text-shiraz font-bold">1,0 % (Standard)</span>
                    <span>2,0 % (Stark quellend)</span>
                  </div>
                </div>

                {/* Zementart */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-main block">
                    Bindemittel (DIN EN 197-1):
                  </label>
                  <select
                    value={groutCementType}
                    onChange={(e) => setGroutCementType(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium outline-none focus:border-shiraz"
                  >
                    <option value="CEM I 52.5 R (C3A-arm)">CEM I 52.5 R (C3A-arm, hochfest)</option>
                    <option value="CEM I 42.5 N (Standard)">CEM I 42.5 N (Standard-Portlandzement)</option>
                    <option value="Werktrockenmörtel (Zugelassen)">Werkstrockenmörtel (werksgemischt nach EAD)</option>
                  </select>
                  <p className="text-[10px] text-slate-500">Chloridgehalt strikt ≤ 0,10 M-%</p>
                </div>
              </div>

              {/* 4 Soll-Ist KPI Karten nach DIN EN 447 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {/* 1. Fließmaß / Trichter */}
                <div className={`p-3 rounded-xl border space-y-1 ${
                  groutCalculations.flowValid ? 'bg-white border-home-grau/30' : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between text-xs text-text-main/70">
                    <span className="font-semibold uppercase tracking-wider">Fließvermögen (Trichterverfahren DIN EN 445)</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      groutCalculations.flowValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {groutCalculations.flowValid ? 'Normkonform' : 'Abweichung!'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-slate-900">{formatDeWert(groutCalculations.flowTimeT0)}</span>
                    <span className="text-xs text-slate-500">s (t₀)</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5 border-t border-slate-200 pt-1.5">
                    <div className="flex justify-between">
                      <span>Normbereich t₀:</span>
                      <strong className="font-mono">t₀, t₃₀ ≤ 25 s</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Nach 30 min (t₃₀):</span>
                      <strong className="font-mono">{formatDeWert(groutCalculations.flowTimeT30)} s (max. 28 s)</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Wasserabsondern (Bluten) */}
                <div className={`p-3 rounded-xl border space-y-1 ${
                  groutCalculations.bleedingValid ? 'bg-white border-home-grau/30' : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between text-xs text-text-main/70">
                    <span className="font-semibold uppercase tracking-wider">Wasserabsondern (3 h)</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      groutCalculations.bleedingValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {groutCalculations.bleedingValid ? 'Normkonform' : 'Gefahr Bluten!'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold font-mono ${
                      groutCalculations.bleedingValid ? 'text-slate-900' : 'text-rose-700'
                    }`}>
                      {formatDeWert(groutCalculations.bleeding3h)}
                    </span>
                    <span className="text-xs text-slate-500">% Vol.</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5 border-t border-slate-200 pt-1.5">
                    <div className="flex justify-between">
                      <span>Grenzwert DIN EN 447:</span>
                      <strong className="font-mono">≤ 0,30 %</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Wiederaufnahme 24 h:</span>
                      <strong className="font-mono text-emerald-700">100 % (Vollständig)</strong>
                    </div>
                  </div>
                </div>

                {/* 3. Volumenänderung (Quellen) */}
                <div className={`p-3 rounded-xl border space-y-1 ${
                  groutCalculations.expansionValid ? 'bg-white border-home-grau/30' : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-center justify-between text-xs text-text-main/70">
                    <span className="font-semibold uppercase tracking-wider">Volumenänderung (24 h)</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      groutCalculations.expansionValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {groutCalculations.expansionValid ? 'Kompensiert' : 'Schwindgefahr'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-slate-900">
                      {groutCalculations.expansion24h > 0 ? `+${formatDeWert(groutCalculations.expansion24h)}` : groutCalculations.expansion24h}
                    </span>
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5 border-t border-slate-200 pt-1.5">
                    <div className="flex justify-between">
                      <span>Normbereich:</span>
                      <strong className="font-mono">−1 % bis +5 %</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Wirkung Quellmittel:</span>
                      <span className="text-[10px] text-slate-500">Keine Schwindsäcke</span>
                    </div>
                  </div>
                </div>

                {/* 4. Druckfestigkeit & Passivierung */}
                <div className="p-3 rounded-xl bg-white border border-home-grau/30 space-y-1">
                  <div className="flex items-center justify-between text-xs text-text-main/70">
                    <span className="font-semibold uppercase tracking-wider">Druckfestigkeit / pH</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      Hochfest
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-shiraz">{formatDeWert(groutCalculations.fc28d)}</span>
                    <span className="text-xs text-slate-500">MPa (28 d)</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5 border-t border-slate-200 pt-1.5">
                    <div className="flex justify-between">
                      <span>Nach 7 Tagen (fc,7):</span>
                      <strong className="font-mono">{formatDeWert(groutCalculations.fc7d)} MPa (≥ 27)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Alkalische Passivierung:</span>
                      <strong className="font-mono text-emerald-700">pH 12.8 ≥ 12,5</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. INTERAKTIVER VERPRESSRECHNER FÜR SPANNGLIEDER */}
            <div className="p-5 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/15 pb-2">
                <div>
                  <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                    <Calculator className="text-shiraz h-4 w-4" />
                    Injektions- &amp; Materialmengen-Rechner für Spannglieder
                  </h5>
                  <p className="text-[11px] text-text-main/70">
                    Berechnung von Netto-Hohlraumvolumen, Zement-, Wasser- und Zusatzmittelbedarf je Spannglied
                  </p>
                </div>
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Länge: {formatDeWert(groutTendonLength)} m | {groutStrandCount} Litzen 150 mm²
                </span>
              </div>

              {/* Steuerregler: Spanngliedlänge, Litzenanzahl, Hüllrohr-Durchmesser */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                    <span>Spanngliedlänge (L):</span>
                    <span className="font-mono text-shiraz font-bold">{formatDeWert(groutTendonLength)} m</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={groutTendonLength}
                    onChange={(e) => setGroutTendonLength(Number(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>10 m</span>
                    <span>45 m (Standard)</span>
                    <span>120 m (Großbrücke)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                    <span>Litzenbelegung (Ap = {groutStrandCount * 150} mm²):</span>
                    <span className="font-mono text-shiraz font-bold">{groutStrandCount} Litzen</span>
                  </div>
                  <select
                    value={groutStrandCount}
                    onChange={(e) => setGroutStrandCount(Number(e.target.value))}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium outline-none focus:border-shiraz"
                  >
                    <option value={4}>4 Litzen (Hochbau / Unterzüge)</option>
                    <option value={7}>7 Litzen (Hallenbinder / Brücken)</option>
                    <option value={12}>12 Litzen (Standard ZTV-ING Brückenbau)</option>
                    <option value={19}>19 Litzen (Schwere Brückenhauptträger)</option>
                    <option value={22}>22 Litzen (Große Hohlkastenbrücken)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                    <span>Hüllrohr-Innendurchmesser (Di):</span>
                    <span className="font-mono text-shiraz font-bold">{formatDeWert(groutDuctDia)} mm</span>
                  </div>
                  <select
                    value={groutDuctDia}
                    onChange={(e) => setGroutDuctDia(Number(e.target.value))}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium outline-none focus:border-shiraz"
                  >
                    <option value={65}>Ø 65 mm (für 4–7 Litzen)</option>
                    <option value={75}>Ø 75 mm (für 7–12 Litzen)</option>
                    <option value={85}>Ø 85 mm (für 12–15 Litzen, ZTV-ING)</option>
                    <option value={100}>Ø 100 mm (für 19–22 Litzen)</option>
                    <option value={115}>Ø 115 mm (für 27–31 Litzen)</option>
                  </select>
                </div>
              </div>

              {/* Ergebnis-Raster Materialbedarf */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200 text-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Netto-Mörtelvolumen</span>
                  <span className="text-xl font-bold font-mono text-slate-800">{formatDeWert(groutCalculations.netVoidVolumeLiter)} Liter</span>
                  <span className="text-[10px] text-slate-500">Freier Hohlquerschnitt – zzgl. 10–20 % für Entlüftung, Leitungen und Überlauf</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Zementbedarf</span>
                  <span className="text-xl font-bold font-mono text-shiraz">{formatDeWert(groutCalculations.totalCementKg)} kg</span>
                  <span className="text-[10px] text-slate-500">ca. {formatDeWert(groutCalculations.cementBags25)} Säcke à 25 kg</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Wasserbedarf (w/z = {formatDeWert(groutWz)})</span>
                  <span className="text-xl font-bold font-mono text-blue-700">{formatDeWert(groutCalculations.totalWaterLiter)} Liter</span>
                  <span className="text-[10px] text-slate-500">Trinkwasserqualität</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Einpresshilfe ({formatDeWert(groutAdmixturePct)} %)</span>
                  <span className="text-xl font-bold font-mono text-purple-700">{formatDeWert(groutCalculations.totalAdmixtureKg)} kg</span>
                  <span className="text-[10px] text-slate-500">Quell- &amp; Fließmittel</span>
                </div>
              </div>

              {/* Technische Einpress-Richtwerte */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-amber-950">
                <div>
                  <strong>Einpressgeschwindigkeit:</strong>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    <strong>5 – 15 m/min</strong> (kontinuierlich, um Lufteinschlüsse laminar voranzuschieben).
                  </p>
                </div>
                <div>
                  <strong>Maximaler Einpressdruck:</strong>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    <strong>p ≤ 10 – 15 bar</strong> an der Presse; Nachdrücken mit <strong>5 bar für 1–2 min</strong>.
                  </p>
                </div>
                <div>
                  <strong>Entlüftungsstellen:</strong>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    An allen Scheitelpunkten (Hochpunkten) sowie alle <strong>≤ 30 m</strong> Entlüftungsrohre setzen!
                  </p>
                </div>
              </div>
            </div>

            {/* 3. HÜLLROHRSYSTEME IM DIREKTVERGLEICH: STAHL VS. KUNSTSTOFF */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <Layers className="text-shiraz h-4 w-4" />
                  Hüllrohr-Systemvergleich: Stahlwellblech (DIN EN 523) vs. Kunststoff-Wellrohr (fib Bulletin 75)
                </h5>
                <span className="text-[11px] text-slate-500">fib Category PL1, PL2 &amp; PL3</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-text-main border-b border-home-grau/30 font-semibold">
                      <th className="p-2.5">Eigenschaft</th>
                      <th className="p-2.5">Stahlwellrohr (DIN EN 523 / fib PL1)</th>
                      <th className="p-2.5 text-shiraz">Kunststoff-Wellrohr (HDPE/PP / fib PL2 &amp; PL3)</th>
                      <th className="p-2.5">Praxis-Auswirkung im Spannbeton</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold">Werkstoff &amp; Wanddicke</td>
                      <td className="p-2.5">Gefalztes, verzinktes Bandstahl (t ≈ 0,35–0,50 mm)</td>
                      <td className="p-2.5 font-semibold text-shiraz">Extrudiertes High-Density Polyethylen (HDPE / PP, t ≥ 2,0 mm)</td>
                      <td className="p-2.5 text-[11px]">Kunststoffrohre sind extrem schlagzäh und knicksicher.</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold">Reibungsbeiwert μ</td>
                      <td className="p-2.5 font-mono">0,18 – 0,22</td>
                      <td className="p-2.5 font-mono font-bold text-shiraz">0,12 – 0,14 (-35 %)</td>
                      <td className="p-2.5 text-[11px]">Erheblich geringere Reibungsverluste ΔP(μ) beim Spannen!</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold">Ungewollte Krümmung (Wobble k)</td>
                      <td className="p-2.5 font-mono">0,005 – 0,010 rad/m</td>
                      <td className="p-2.5 font-mono text-shiraz">0,004 – 0,007 rad/m</td>
                      <td className="p-2.5 text-[11px]">Steifere Geometrie verringert Wellenbildung beim Betonieren.</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold">Korrosionsschutzbarriere</td>
                      <td className="p-2.5">Verzinkung opfert sich; Rost bei Wassereintritt</td>
                      <td className="p-2.5 font-semibold text-emerald-700">sehr dicht gegen Chloride und Feuchte</td>
                      <td className="p-2.5 text-[11px]">Vollständige Kapselung des Spannstahls vor Tausalzen.</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold">Elektrische Isolierung (EIT)</td>
                      <td className="p-2.5 text-slate-500">Nicht möglich (leitfähig mit Beton)</td>
                      <td className="p-2.5 font-semibold text-emerald-700">Ja (Electrically Isolated Tendon, R ≥ 1 MΩ·m)</td>
                      <td className="p-2.5 text-[11px]">Ermöglicht zerstörungsfreie Dichtigkeits- &amp; Korrosionsüberwachung über Lebensdauer.</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold">Verschleiß bei Umlenkung</td>
                      <td className="p-2.5">Gefahr des Durchscheuerns bei hoher Pressung</td>
                      <td className="p-2.5 font-semibold text-shiraz">Sehr hohe Ermüdungs- und Abriebfestigkeit</td>
                      <td className="p-2.5 text-[11px]">Kein metallischer Reibkontakt Spanndraht / Hüllrohr.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. VERANKERUNGSMATERIALIEN, KORROSIONSSCHUTZFETTE & SCHUTZELEMENTE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: Keile & Keilmechanik */}
              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                  <Wrench className="h-4 w-4 text-shiraz" />
                  1. Spannkeile &amp; Ankerkörper
                </h5>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Die Verankerung hochfester Litzen (<InlineMath math="f_{pk} = 1860\text{ MPa}" />) stellt extreme Werkstoffanforderungen:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                  <li><strong>Einsatzgehärteter Sonderstahl:</strong> Z. B. 16MnCr5 mit <strong>Randschichthärte 58–62 HRC</strong> (krallt sich sicher in die Litzen) und <strong>zäh-elastischem Kern (ca. 35 HRC)</strong> gegen Sprödbruch.</li>
                  <li><strong>Mehrteilige Keile:</strong> 2-teilig oder 3-teilig mit elastischem Federring zur symmetrischen Krafteinleitung.</li>
                  <li><strong>Ankerplatten:</strong> Sphäroguss <strong>EN-GJS-400-15</strong> oder Schmiedestahl zur optimalen Lastverteilung in die Teilflächenzone.</li>
                </ul>
              </div>

              {/* Box 2: Korrosionsschutzfette für Monolitzen */}
              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-shiraz" />
                  2. Korrosionsschutzfette &amp; Monolitzen
                </h5>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Bei der <strong>Vorspannung ohne Verbund</strong> (z. B. Flachdecken im Hochbau) gleiten Monolitzen in einer PE-Hülle:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                  <li><strong>Spezialfett / Schutzwachs:</strong> Verseifungsfreie Kohlenwasserstofffette mit Korrosionsinhibitoren (<InlineMath math="\ge 45\,\text{g/m}" />).</li>
                  <li><strong>Temperaturbeständigkeit:</strong> Tropfpunkt <InlineMath math="\ge 85 - 100^{\circ}\text{C}" />, kälteflexibel bis -20 °C, keine Verharzung.</li>
                  <li><strong>PE-Schutzmantel:</strong> Nahtlos extrudiertes Polyethylen hoher Dichte (HDPE, Mindestwandstärke <InlineMath math="t \ge 1{,}0\,\text{mm}" />).</li>
                  <li><strong>Reibungsbeiwert:</strong> Extrem gering (<InlineMath math="\mu \approx 0{,}05 - 0{,}06" />).</li>
                </ul>
              </div>

              {/* Box 3: Dichtungskappen & Entlüfter */}
              <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-shiraz" />
                  3. Dichtungskappen &amp; Prüfstutzen
                </h5>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Dauerhafter Schutz der Verankerungs- und Entlüftungsstellen:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                  <li><strong>Permanente Ankerkappen:</strong> Druckfeste Schutzkappen aus PE oder korrosionsgeschütztem Guss mit O-Ring-Dichtung.</li>
                  <li><strong>Entlüftungsstutzen:</strong> Transparente PE-Schläuche an allen Hochpunkten zur optischen Kontrolle des blasenfreien Mörtelaustritts.</li>
                  <li><strong>Verschluss:</strong> Nach dem Abbinden werden Entlüfter bündig abgeschnitten und luft- und wasserdicht versiegelt.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeSubTab === 'kriechen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Clock className="text-shiraz h-5 w-5" />
                1. Kriechen des Betons (<InlineMath math="\varphi(t, t_0)" /> / Kriechzahl)
              </h4>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md">
                Verlustanteil: ca. 8–15 % von P₀
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 text-sm text-text-main/80 leading-relaxed">
                <p>
                  <strong>Was ist Kriechen?</strong> Unter einer anhaltenden mechanischen Dauer-Druckspannung 
                  staucht sich erhärteter Beton zeitabhängig weiter zusammen. Während die elastische Dehnung 
                  <InlineMath math="\varepsilon_{c,el}" /> im Moment der Lasteinleitung schlagartig auftritt, wächst die 
                  <strong>Kriechdehnung <InlineMath math="\varepsilon_{cc}(t)" /></strong> über Monate und Jahre kontinuierlich an, 
                  bis sie asymptotisch einem Endwert zustrebt.
                </p>
                <p>
                  Das Verhältnis der Kriechdehnung zur anfänglichen elastischen Dehnung wird als 
                  <strong> Kriechzahl <InlineMath math="\varphi(t, t_0)" /></strong> bezeichnet:
                </p>
                <div className="bg-off-white p-3 rounded-xl border border-home-grau/30 text-center">
                  <BlockMath math="\varphi(t, t_0) = \frac{\varepsilon_{cc}(t, t_0)}{\varepsilon_{c,el}(t_0)} \quad \Longrightarrow \quad \varepsilon_c(t) = \varepsilon_{c,el} \cdot \left[1 + \varphi(t, t_0)\right]" />
                </div>
                <p>
                  <strong>Typische Kriechzahlen nach DIN EN 1992-1-1:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-text-main/80">
                  <li><strong>Trockener Innenraum (RH 50 %):</strong> <InlineMath math="\varphi_\infty \approx 2{,}2 - 3{,}5" /></li>
                  <li><strong>Feuchtes Außenklima (RH 80 %):</strong> <InlineMath math="\varphi_\infty \approx 1{,}4 - 2{,}0" /></li>
                  <li><strong>Frühes Vorspannen (t₀ = 3 d):</strong> Kriechzahl um 30–50 % höher als bei t₀ = 28 d!</li>
                </ul>
              </div>

              {/* Mikrostruktur & Grafik */}
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-4">
                <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-shiraz" />
                  Mikrostruktureller Mechanismus im C-S-H-Gel
                </h5>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Zementstein besteht mikroskopisch aus kolloidalen <strong>Calciumsilicathydrat-Phasen (C-S-H)</strong>. In den Nanoporen 
                  befindet sich adsorbiertes Wasser („Schichtenwasser“). Unter ständiger Druckspannung laufen folgende Vorgänge ab:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-home-grau/20">
                    <strong className="text-text-main block mb-0.5">1. Umlagerung von Schichtenwasser (Seepage Theory):</strong>
                    Das adsorbierte Wasser wird aus den hoch komprimierten Bereichen zwischen den C-S-H-Lamellen langsam in lastfreie Gel- und Kapillarporen herausgepresst.
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-home-grau/20">
                    <strong className="text-text-main block mb-0.5">2. Viskoses Gleiten der C-S-H-Nanoblättchen:</strong>
                    Unter Scher- und Druckspannungen brechen elektrostatische Brückenbindungen auf; Kristallitpakete gleiten irreversibel aneinander ab.
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-home-grau/20">
                    <strong className="text-text-main block mb-0.5">3. Nichtlineares Kriechen bei Überlastung:</strong>
                    Liegt die Betondruckspannung über <InlineMath math="0{,}45 \cdot f_{ck}(t_0)" />, entstehen Mikrorisse im Gefüge. Es tritt unkontrolliertes, beschleunigtes Kriechen auf (Gefahr des Kriechbruchs!).
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Visualisierung Dehnungsverlauf */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                <span>Verformungs- und Dehnungsverlauf bei Be- und Entlastung:</span>
                <span className="font-mono text-[11px] text-slate-500">schematisch</span>
              </div>
              <div className="w-full overflow-x-auto">
                <svg viewBox="0 0 700 180" className="w-full h-44 min-w-[500px]">
                  <defs>
                    <marker id="arrow-axis" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  {/* Achsen */}
                  <line x1="60" y1="150" x2="660" y2="150" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-axis)" />
                  <line x1="60" y1="150" x2="60" y2="20" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-axis)" />
                  <text x="665" y="155" fontSize="11" fill="#64748b">Zeit t</text>
                  <text x="50" y="15" fontSize="11" fill="#64748b">Dehnung ε_c</text>

                  {/* Belastungszeitpunkt t0 */}
                  <line x1="120" y1="150" x2="120" y2="30" stroke="#94a3b8" strokeDasharray="3 3" />
                  <text x="110" y="166" fontSize="10" fill="#475569">t₀ (Spannen)</text>

                  {/* Entlastungszeitpunkt t1 */}
                  <line x1="420" y1="150" x2="420" y2="30" stroke="#94a3b8" strokeDasharray="3 3" />
                  <text x="410" y="166" fontSize="10" fill="#475569">t₁ (Entlastung)</text>

                  {/* Elastischer Sprung bei t0 */}
                  <line x1="120" y1="150" x2="120" y2="110" stroke="#3b82f6" strokeWidth="2.5" />
                  <text x="125" y="130" fontSize="10" fill="#2563eb" fontWeight="bold">ε_el (sofort)</text>

                  {/* Kriechkurve bis t1 */}
                  <path d="M 120 110 Q 220 55 420 45" fill="none" stroke="#8b1a4f" strokeWidth="3" />
                  <text x="240" y="60" fontSize="11" fill="#8b1a4f" fontWeight="bold">Kriechdehnung ε_cc(t) = φ · ε_el</text>

                  {/* Elastische Rückfederung bei t1 */}
                  <line x1="420" y1="45" x2="420" y2="85" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="428" y="70" fontSize="10" fill="#2563eb">Elastische Rückfederung</text>

                  {/* Kriecherholung und bleibende Verformung */}
                  <path d="M 420 85 Q 500 100 640 105" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="510" y="95" fontSize="10" fill="#c2410c">Kriecherholung</text>
                  <text x="520" y="125" fontSize="10" fill="#475569" fontWeight="bold">Bleibende plastische Dehnung</text>

                  {/* Horizontale Markierungen */}
                  <line x1="60" y1="105" x2="640" y2="105" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                </svg>
              </div>
            </div>

            {/* Didaktische Box: Schätzwerte vs. Rechenwerte für Kriechbeiwerte */}
            <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                <h5 className="font-bold text-xs text-amber-950 flex items-center gap-2 uppercase tracking-wide">
                  <Scale className="h-4 w-4 text-amber-800" />
                  Größenordnungen der Kriechbeiwerte: Schätzwerte vs. Rechenwerte nach EC2
                </h5>
                <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded border border-amber-300">
                  DIN EN 1992-1-1 Abs. 3.1.4 &amp; Anhang B
                </span>
              </div>

              {/* Erläuterung der Dehnungsumrechnung in Promille */}
              <div className="bg-white/90 p-3.5 rounded-lg border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                    <Activity className="h-3.5 w-3.5 text-amber-700" />
                    Zusammenhang: Dimensionslose Kriechzahl <InlineMath math="\varphi" /> &amp; Kriechdehnung <InlineMath math="\varepsilon_{cc}" /> in Promille (‰ bzw. mm/m)
                  </span>
                  <span className="text-[10px] font-mono font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    1 ‰ = 1 mm/m = 10⁻³ = 1000 µm/m
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  Die Kriechzahl <InlineMath math="\varphi(\infty, t_0)" /> ist dimensionslos und skaliert die elastische Anfangsdehnung <InlineMath math="\varepsilon_{\text{el}} = \sigma_c / E_{cm}" />.
                  Unter typischer Dauerlastspannung im Spannbeton (<InlineMath math="\sigma_c \approx 10 \dots 15\,\text{MPa}" />, <InlineMath math="E_{cm} \approx 33\,000 \dots 38\,000\,\text{MPa}" />) beträgt die elastische Stauchung rund <InlineMath math="\varepsilon_{\text{el}} \approx 0{,}28 \dots 0{,}43\,\text{‰}" />.
                  Daraus errechnet sich die zeitabhängige Kriechdehnung in Promille:
                </p>
                <div className="text-center font-mono text-[11px] py-1 bg-amber-50/60 rounded border border-amber-200/60">
                  <InlineMath math="\varepsilon_{cc}(\infty, t_0) = \varepsilon_{\text{el}} \cdot \varphi(\infty, t_0) = \frac{\sigma_c(t_0)}{E_{cm}} \cdot \varphi(\infty, t_0) \quad [\text{in ‰ bzw. mm/m}]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-950/90 leading-relaxed">
                {/* Linke Spalte: Praxis-Schätzwerte */}
                <div className="space-y-2.5">
                  <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    Praxis-Schätzwerte (Vordimensionierung):
                  </div>
                  <ul className="space-y-2 text-[11px]">
                    <li className="bg-white/60 p-2.5 rounded-lg border border-amber-200/70 space-y-0.5">
                      <div className="font-bold text-amber-950 flex items-center justify-between">
                        <span>Standard-Endkriechzahl (C30/37 bis C40/50):</span>
                        <span className="font-mono text-amber-800"><InlineMath math="\varphi_\infty \approx 2{,}0 \dots 2{,}5" /></span>
                      </div>
                      <div className="text-slate-700">
                        • Kriechdehnung: <strong className="text-amber-900 font-mono"><InlineMath math="\varepsilon_{cc} \approx 0{,}60 \dots 1{,}05\,\text{‰}" /></strong> (0,60 bis 1,05 mm/m)
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Gesamtstauchung (<InlineMath math="\varepsilon_{\text{el}} + \varepsilon_{cc}" />): <InlineMath math="\varepsilon_{c,\text{tot}} \approx 0{,}90 \dots 1{,}45\,\text{‰}" />
                      </div>
                    </li>

                    <li className="bg-white/60 p-2.5 rounded-lg border border-amber-200/70 space-y-0.5">
                      <div className="font-bold text-amber-950 flex items-center justify-between">
                        <span>Massive Brücken (<InlineMath math="h_0 \ge 500\,\text{mm}" />, Außenluft RH 80 %):</span>
                        <span className="font-mono text-amber-800"><InlineMath math="\varphi_\infty \approx 1{,}5 \dots 2{,}0" /></span>
                      </div>
                      <div className="text-slate-700">
                        • Kriechdehnung: <strong className="text-amber-900 font-mono"><InlineMath math="\varepsilon_{cc} \approx 0{,}40 \dots 0{,}80\,\text{‰}" /></strong> (0,40 bis 0,80 mm/m)
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Durch hohe wirksame Dicke und hohe Feuchte kriecht der Querschnitt deutlich langsamer und geringer.
                      </div>
                    </li>

                    <li className="bg-white/60 p-2.5 rounded-lg border border-amber-200/70 space-y-0.5">
                      <div className="font-bold text-amber-950 flex items-center justify-between">
                        <span>Schlanke Hochbaudecken (<InlineMath math="h_0 \le 150\,\text{mm}" />, Innenluft RH 50 %):</span>
                        <span className="font-mono text-amber-800"><InlineMath math="\varphi_\infty \approx 2{,}8 \dots 3{,}5" /></span>
                      </div>
                      <div className="text-slate-700">
                        • Kriechdehnung: <strong className="text-amber-900 font-mono"><InlineMath math="\varepsilon_{cc} \approx 0{,}80 \dots 1{,}45\,\text{‰}" /></strong> (0,80 bis 1,45 mm/m)
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Trockene Innenraumluft und dünne Querschnitte begünstigen starkes Austrocknungskriechen.
                      </div>
                    </li>

                    <li className="p-2 bg-amber-100/60 rounded border border-amber-300/60 text-[10.5px] text-amber-900">
                      <strong>Faustregel für Kriechverluste:</strong> Ca. <strong>8 % bis 15 %</strong> der Anfangsspannkraft <InlineMath math="P_0" /> gehen allein durch das Kriechen verloren (entspricht rund 120 bis 220 MPa Spannkraftverlust im Spannstahl).
                    </li>
                  </ul>
                </div>

                {/* Rechte Spalte: Normativer Rechenwert */}
                <div className="space-y-2.5">
                  <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Normativer Rechenwert (Eurocode 2 Ausführungsstatik):
                  </div>
                  <div className="bg-white/90 p-2.5 rounded border border-blue-200 font-mono text-[11px] text-blue-950 overflow-x-auto text-center space-y-1">
                    <div>
                      <InlineMath math="\varphi(\infty, t_0) = \varphi_{RH} \cdot \beta(f_{cm}) \cdot \beta(t_0)" />
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      Berechnung nach EC2 Gl. (B.1) / Anhang B
                    </div>
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5 text-[11px] text-blue-950/90">
                    <li>
                      <InlineMath math="\varphi_{RH} = 1 + \frac{1 - RH/100}{0{,}1 \cdot \sqrt[3]{h_0}}" /> (Feuchtebeiwert: 1,1 Außenluft bis 2,2 Innenraum).
                    </li>
                    <li>
                      <InlineMath math="\beta(f_{cm}) = \frac{16{,}8}{\sqrt{f_{cm}}}" /> (Festigkeitsbeiwert: C25/30 ca. 3,0; C45/55 ca. 2,3; C60/75 ca. 2,0).
                    </li>
                    <li>
                      <InlineMath math="\beta(t_0) = \frac{1}{0{,}1 + t_0^{0{,}2}}" /> (Spannalter: <InlineMath math="t_0 = 3\,\text{d}" /> → 0,74; <InlineMath math="t_0 = 7\,\text{d}" /> → 0,63; <InlineMath math="t_0 = 28\,\text{d}" /> → 0,49; <InlineMath math="t_0" /> vorher nach Gl. (B.9) an die Zementart anpassen).
                    </li>
                    <li>
                      <strong>Kriechmaß (spezifische Dehnung):</strong> <InlineMath math="C(\infty, t_0) = \frac{\varphi(\infty, t_0)}{E_{cm}} \approx 0{,}05 \dots 0{,}10\,\frac{\text{‰}}{\text{MPa}}" /> (bzw. <InlineMath math="50 \dots 100 \cdot 10^{-6}\text{ MPa}^{-1}" />).
                    </li>
                    <li>
                      <strong>Gültigkeitsgrenze:</strong> Nur linear bis <InlineMath math="\sigma_c \le 0{,}45 \cdot f_{ck}(t_0)" />; bei <InlineMath math="\sigma_c > 0{,}45 \cdot f_{ck}(t_0)" /> muss nichtlineares Kriechen angesetzt werden (<InlineMath math="\varphi_k = \varphi \cdot e^{1{,}5(k_\sigma - 0{,}45)}" />).
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Baustellen- & Praxisrelevanz */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-1">Auswirkung im Spannbeton:</span>
                Der Träger verkürzt sich über Jahre. Der Abstand zwischen den Verankerungen schrumpft. Die Vorspannstähle entspannen sich elastisch <InlineMath math="\rightarrow" /> <strong>massiver Spannkraftverlust</strong>!
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs">
                <span className="font-bold text-blue-900 block mb-1">Verformungsverdopplung:</span>
                Kriechen vergrößert Biegungen und Überhöhungen: <InlineMath math="\kappa_\infty = \kappa_0 \cdot (1 + \varphi)" />. Brückenfahrbahnen senken sich im Laufe von Jahrzehnten um Zentimeter ab.
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-900 block mb-1">Praxis-Vermeidung:</span>
                Spätes Vorspannen abwarten (<InlineMath math="t_0 \ge 7 - 14\text{ d}" />), Betondruck beim Spannen auf <InlineMath math="\sigma_c \le 0{,}60\, f_{ck}(t_0)" /> begrenzen (Längsrisse); nichtlineares Kriechen beginnt bereits ab <InlineMath math="0{,}45\, f_{ck}(t_0)" /> (EC2 5.10.2.2(5)).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: SCHWINDEN DES BETONS */}
      {activeSubTab === 'schwinden' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Droplets className="text-shiraz h-5 w-5" />
                2. Schwinden des Betons (<InlineMath math="\varepsilon_{cs}" /> / Autogen &amp; Trocknung)
              </h4>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-md">
                Verlustanteil: ca. 4–8 % von P₀
              </span>
            </div>

            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
              <p>
                <strong>Was ist Schwinden?</strong> Schwinden ist die <strong>vollkommen lastunabhängige Volumenverringerung</strong> des 
                Betons infolge von inneren chemischen Reaktionen und Feuchtigkeitsabgabe an die ungesättigte Umwelt. Im Gegensatz 
                zum Kriechen tritt Schwinden auch an völlig unbelasteten Bauteilen auf! Nach Eurocode 2 setzt sich das Gesamtschwindmaß 
                <InlineMath math="\varepsilon_{cs}" /> aus zwei physikalisch völlig unterschiedlichen Komponenten zusammen:
              </p>
              <div className="text-center my-3">
                <BlockMath math="\varepsilon_{cs}(t, t_s) = \varepsilon_{ca}(t) + \varepsilon_{cd}(t, t_s)" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Autogenes Schwinden */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-amber-600" />
                    A. Autogenes Schwinden (<InlineMath math="\varepsilon_{ca}" />)
                  </h5>
                  <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Chemisch</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Mechanismus:</strong> Bei der Hydratation von Zement nehmen die entstehenden Hydratationsprodukte (C-S-H, Portlandit) 
                  ein geringeres Volumen ein als die Ausgangsstoffe Zement und Wasser (<span className="italic">Le-Chatelier-Kontraktion</span>). 
                  Da im Kern kein Wasser von außen nachströmen kann, trocknet sich der Beton selbst aus („chemische Selbstaustrocknung“).
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                  <div>Endwert nach EC2:</div>
                  <div className="text-shiraz font-bold">
                    <InlineMath math="\varepsilon_{ca}(\infty) = 2{,}5 \cdot (f_{ck} - 10) \cdot 10^{-6}" />
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1">
                    C50/60: <InlineMath math="\varepsilon_{ca} \approx -0{,}10\text{ mm/m}" /> | C90/105: <InlineMath math="\varepsilon_{ca} \approx -0{,}20\text{ mm/m}" />
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  <strong>Besonderheit bei Spannbeton:</strong> Spannbeton wird meist mit C35/45–C50/60 (w/z ≈ 0,40–0,50) hergestellt; bei hochfesten Betonen mit niedrigem w/z ist das autogene Schwinden ausgeprägt und läuft bereits in den ersten Tagen ab.
                </p>
              </div>

              {/* Trocknungsschwinden */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    B. Trocknungsschwinden (<InlineMath math="\varepsilon_{cd}" />)
                  </h5>
                  <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Physikalisch</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Mechanismus:</strong> Diffusionsgesteuerte Feuchtigkeitsabgabe aus dem Porennetz an die ungesättigte Umgebungsluft. 
                  In den engen Kapillarporen (<InlineMath math="2 - 50\text{ nm}" />) bilden sich gekrümmte Menisken. Nach der 
                  <strong> Laplace-Gleichung</strong> entsteht im Porenwasser ein extremer kapillarer Unterdruck:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                  <div>Kapillardruck-Gleichung:</div>
                  <div className="text-blue-700 font-bold">
                    <InlineMath math="\Delta p = \frac{2 \cdot \gamma \cdot \cos\theta}{r_{kap}}" />
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1">
                    Dieser Unterdruck zieht das elastische C-S-H-Gefüge zusammen wie einen trocknenden Schwamm.
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  <strong>Einfluss der Bauteilabmessung:</strong> Das Trocknungsschwinden hängt massiv von der 
                  wirksamen Bauteildicke <InlineMath math="h_0 = 2 A_c / u" /> ab. Dicke Brückenkästen trocknen über 
                  Jahrzehnte hinweg aus, während dünne Stege bereits nach wenigen Monaten geschwunden sind.
                </p>
              </div>
            </div>

            {/* Zahlenbeispiel Spannkraftverlust aus Schwinden */}
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-amber-600" />
                Auswirkung auf den Spannstahl im Tragwerk (Zahlenbeispiel):
              </div>
              <p>
                Beträgt das Gesamtschwindmaß <InlineMath math="\varepsilon_{cs} = -0{,}35\text{ mm/m} = -0{,}00035" /> und der 
                Spannstahl-E-Modul <InlineMath math="E_p = 195.000\text{ N/mm}^2" />, so verkürzt sich das Bauteil lastfrei. 
                Da das Spannglied starr im Bauteil verankert ist, wird der Stahl um genau dieses Maß zusammengestaucht:
              </p>
              <div className="font-mono bg-white p-2.5 rounded border border-amber-200 font-bold text-center">
                <InlineMath math="\Delta\sigma_{p,s} = \varepsilon_{cs} \cdot E_p = 0{,}00035 \cdot 195.000\text{ N/mm}^2 = 68{,}25\text{ N/mm}^2" />
              </div>
              <p>
                Bei einer typischen Anfangsspannung von <InlineMath math="\sigma_{p0} = 1400\text{ N/mm}^2" /> entspricht allein der 
                Schwindverlust einem dauerhaften Spannungsverlust von rund <strong>5 %</strong>.
              </p>
            </div>

            {/* Didaktische Box: Schätzwerte vs. Rechenwerte für Schwindbeiwerte */}
            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 pb-2">
                <h5 className="font-bold text-xs text-blue-950 flex items-center gap-2 uppercase tracking-wide">
                  <Scale className="h-4 w-4 text-blue-800" />
                  Größenordnungen der Schwindbeiwerte: Schätzwerte vs. Rechenwerte nach EC2
                </h5>
                <span className="text-[11px] font-mono font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-300">
                  DIN EN 1992-1-1 Abs. 3.1.4 &amp; Anhang B.2
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-950/90 leading-relaxed">
                <div className="space-y-2">
                  <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    Praxis-Schätzwerte (Vordimensionierung):
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px]">
                    <li><strong>Gesamtschwindmaß:</strong> <InlineMath math="\varepsilon_{cs} \approx -0{,}35 \text{ bis } -0{,}40\,\text{mm/m}" /> (bzw. ‰).</li>
                    <li><strong>Feuchter Außenbereich (RH 80 %):</strong> <InlineMath math="\varepsilon_{cs} \approx -0{,}25 \text{ bis } -0{,}32\,\text{mm/m}" /> (‰).</li>
                    <li><strong>Trockener Innenbereich (RH 50 %):</strong> <InlineMath math="\varepsilon_{cs} \approx -0{,}45 \text{ bis } -0{,}55\,\text{mm/m}" /> (‰).</li>
                    <li><strong>Faustregel für Schwindverluste:</strong> Ca. 4 % bis 8 % der Anfangsspannkraft P₀ (entspricht ~60–100 MPa Spannungsabfall im Spannstahl).</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Normativer Rechenwert (Eurocode 2 Ausführungsstatik):
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-blue-200 font-mono text-[11px] text-blue-950 overflow-x-auto text-center">
                    <InlineMath math="\varepsilon_{cs}(\infty) = \varepsilon_{cd}(\infty) + \varepsilon_{ca}(\infty) = k_h \cdot \varepsilon_{cd,0} + 2{,}5(f_{ck}-10) \cdot 10^{-6}" />
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-blue-950/90">
                    <li><InlineMath math="k_h" /> (Geometriefaktor): 1,00 bei <InlineMath math="h_0 \le 100\,\text{mm}" /> bis 0,70 bei massigen Querschnitten (<InlineMath math="h_0 \ge 500\,\text{mm}" />).</li>
                    <li><InlineMath math="\varepsilon_{cd,0}" /> (Grundwert Trocknung): für C30/37 und RH = 50 %: Zement N ≈ 0,48 ‰, R ≈ 0,67 ‰, S ≈ 0,39 ‰ (Gl. B.11/B.12).</li>
                    <li><InlineMath math="\varepsilon_{ca}" /> (Autogenes Schwinden): C30/37 ~ -0,05 ‰; C60/75 ~ -0,125 ‰ (setzt sofort ein!).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: STAHLRELAXATION */}
      {activeSubTab === 'relaxation' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Zap className="text-shiraz h-5 w-5" />
                3. Relaxation des Spannstahls (<InlineMath math="\Delta\sigma_{pr}" /> / Spannungsabfall bei starrer Dehnung)
              </h4>
              <span className="text-xs font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-md">
                Verlustanteil: ca. 2–5 % von P₀
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 text-sm text-text-main/80 leading-relaxed">
                <p>
                  <strong>Was ist Relaxation?</strong> Während Kriechen die <em>Dehnungszunahme bei konstanter Spannung</em> beschreibt, 
                  ist die Relaxation das exakte Gegenstück: der <strong>Spannungsabfall im hochfesten Stahl bei festgehaltener, konstanter Dehnung</strong>:
                </p>
                <div className="bg-off-white p-3 rounded-xl border border-home-grau/30 text-center">
                  <BlockMath math="\varepsilon_p = \text{const.} \quad \Longrightarrow \quad \sigma_p(t) < \sigma_{p0}" />
                </div>
                <p>
                  <strong>Mikrostruktureller Vorgang im Kristallgitter:</strong> An der Presse höchstens <InlineMath math="\sigma_{p,max} = \min(0{,}80 f_{pk};\, 0{,}90 f_{p0{,}1k}) = 1440\text{ N/mm}^2" />, nach dem Verankern <InlineMath math="\sigma_{pm0} \le 1360\text{ N/mm}^2" /> (Y1860). Unter 
                  dieser immensen atomaren Spannung wandern Versetzungen (Gitterbaufehler) durch thermisch aktiviertes Versetzungsgleiten. Ein winziger Teil der elastischen Gitterdehnung wandelt sich mikroskopisch in bleibende plastische 
                  Verformung um <InlineMath math="\rightarrow" /> die makroskopische Zugspannung sinkt ab!
                </p>
              </div>

              {/* Relaxationsklassen nach Eurocode 2 */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-purple-700" />
                  Die 3 Relaxationsklassen (DIN EN 10138 / EC2)
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-900 mb-1">
                      <span>Klasse 1: Normale Relaxation</span>
                      <span className="text-red-700 font-mono">ρ₁₀₀₀ ≈ 8,0 %</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Kaltgezogene Drähte und Litzen ohne spezielle Thermobehandlung. Historischer Standard, heute kaum noch verwendet.</p>
                  </div>

                  <div className="p-3 bg-purple-50/70 rounded-lg border border-purple-200">
                    <div className="flex justify-between font-bold text-purple-950 mb-1">
                      <span>Klasse 2: Sehr niedrige Relaxation (Low-Relaxation)</span>
                      <span className="text-purple-800 font-mono font-bold">ρ₁₀₀₀ ≈ 2,5 %</span>
                    </div>
                    <p className="text-[11px] text-purple-900">
                      <strong>Heutiger Standard:</strong> Die Litzen werden nach dem Ziehen unter ständiger Zugspannung kurz auf ca. 350 °C erwärmt („thermisches Stabilisieren“). 
                      Versetzungen werden blockiert.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-900 mb-1">
                      <span>Klasse 3: Warmgewalzte Spannstähle</span>
                      <span className="text-amber-800 font-mono">ρ₁₀₀₀ ≈ 4,0 %</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Spannstäbe mit warm aufgewalztem Gewinde (z. B. Dywidag-Gewindestangen SAS).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Eurocode 2 Formel für Relaxation */}
            <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-100 space-y-3">
              <div className="font-bold text-purple-900 text-xs flex items-center justify-between">
                <span>Berechnung nach Eurocode 2 (DIN EN 1992-1-1 Gl. 3.29 für Klasse 2):</span>
                <span className="font-mono text-[11px] text-purple-700">t = Zeit in Stunden</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-purple-200 text-center font-mono text-xs overflow-x-auto">
                <BlockMath math="\frac{\Delta\sigma_{pr}}{\sigma_{pi}} = 0{,}66 \cdot \rho_{1000} \cdot e^{9{,}1 \mu} \cdot \left(\frac{t}{1000}\right)^{0{,}75 \cdot (1 - \mu)} \cdot 10^{-5}" />
              </div>
              <div className="text-[11px] text-slate-600 space-y-1">
                <p>wobei <InlineMath math="\mu = \sigma_{pi} / f_{pk}" /> das Ausnutzungsverhältnis der Vorspannung darstellt. Für den Endwert setzt EC2 3.3.2(8) <InlineMath math="t = 500\,000\text{ h} \approx 57\text{ Jahre}" /> in Gl. (3.28)–(3.30) ein; der Faktor gegenüber dem 1000-h-Wert hängt von μ ab (μ = 0,70 → ≈ 4,1; μ = 0,75 → ≈ 3,2; μ = 0,80 → ≈ 2,5). In Deutschland gelten die Relaxationswerte der abZ des Spannstahls:</p>
                <div className="font-bold text-purple-950 font-mono text-center">
                  <InlineMath math="\Delta\sigma_{pr,\infty} \approx 3{,}0 \cdot \Delta\sigma_{pr,1000}" />
                </div>
              </div>
            </div>

            {/* Warnbox Temperatureinfluss */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5 flex gap-3 items-start">
              <Thermometer className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Achtung: Exponentielle Zunahme bei Wärmebehandlung (Fertigteilwerk / Brand)!</strong>
                Die Diffusionsgeschwindigkeit im Stahl verdoppelt sich etwa alle 10–15 °C. Bei Wärmebehandlung (Dampfhärtung von Fertigteilen bei 60–80 °C zur Erhärtungsbeschleunigung) 
                nimmt die Relaxation deutlich zu; EC2 10.3.2.2 berücksichtigt dies über das temperaturäquivalente Alter <InlineMath math="t_{eq}" /> in Gl. (3.28)–(3.30).
              </div>
            </div>

            {/* Tabelle 2 nach DIN EN 1992-1-1 */}
            <div className="p-5 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-shiraz" />
                  Tabelle 2: Repräsentative mechanische Kennwerte für typische Spannstahllitzen (DIN EN 1992-1-1 / Zulassungen)
                </h5>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded">
                  z. B. Y1770S7 / Y1860S7 (St 1500/1770, St 1660/1860 nach abZ)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                      <th className="p-2.5">Eigenschaft des Spannstahls</th>
                      <th className="p-2.5">Symbol nach EC2</th>
                      <th className="p-2.5">Typischer Parameterwert</th>
                      <th className="p-2.5">Bedeutung für die Tragwerksbemessung</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold">Charakteristische Zugfestigkeit</td>
                      <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="f_{pk}" /></td>
                      <td className="p-2.5 font-mono font-bold text-slate-900">1770 – 1860 N/mm²</td>
                      <td className="p-2.5 text-[11px]">Bruchfestigkeitsgrenze im Grenzzustand der Tragfähigkeit (GZT)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold">0,1 %-Dehngrenze (Ersatzstreckgrenze)</td>
                      <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="f_{p0{,}1k}" /></td>
                      <td className="p-2.5 font-mono font-bold text-slate-900">1520 – 1600 N/mm²</td>
                      <td className="p-2.5 text-[11px]">Elastizitätsgrenze; maßgebend für zulässige Vorspannkraft beim Spannen</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold">Elastizitätsmodul (Litzen / Drähte)</td>
                      <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="E_p" /></td>
                      <td className="p-2.5 font-mono font-bold text-slate-900">ca. 195.000 N/mm²</td>
                      <td className="p-2.5 text-[11px]">Geringer als Stabstahl (205.000 N/mm²) infolge des Dralls der 7 Einzeldrähte</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold">Charakt. Dehnung bei Höchstlast</td>
                      <td className="p-2.5 font-mono text-shiraz font-bold"><InlineMath math="\varepsilon_{uk}" /></td>
                      <td className="p-2.5 font-mono font-bold text-slate-900">≥ 3,5 % (≥ 35 ‰)</td>
                      <td className="p-2.5 text-[11px]">Mindestduktilität zur Vorankündigung und Rotationsfähigkeit im Bruchzustand</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Didaktische Box: Schätzwerte vs. Rechenwerte für Stahlrelaxation */}
            <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/60 pb-2">
                <h5 className="font-bold text-xs text-purple-950 flex items-center gap-2 uppercase tracking-wide">
                  <Scale className="h-4 w-4 text-purple-800" />
                  Größenordnungen der Relaxationsbeiwerte: Schätzwerte vs. Rechenwerte nach EC2
                </h5>
                <span className="text-[11px] font-mono font-bold text-purple-900 bg-purple-100/80 px-2 py-0.5 rounded border border-purple-300">
                  DIN EN 1992-1-1 Abs. 3.3.2 &amp; DIN EN 10138
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-purple-950/90 leading-relaxed">
                <div className="space-y-2">
                  <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    Praxis-Schätzwerte (Vordimensionierung):
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px]">
                    <li><strong>1000-Stunden-Referenzverlust:</strong> <InlineMath math="\rho_{1000} = 2{,}5\,\%" /> für moderne Litzen der Klasse 2 (niedrige Relaxation).</li>
                    <li><strong>Alte Bauwerke / Draht:</strong> Klasse 1 mit <InlineMath math="\rho_{1000} = 8{,}0\,\%" /> (dreifacher Verlust!).</li>
                    <li><strong>Langzeit-Relaxationsverlust (500.000 h):</strong> Ca. das 2,5- bis 3,0-Fache des 1000-h-Werts (~4 % bis 7 % von <InlineMath math="\sigma_{p0}" />).</li>
                    <li><strong>Spannkraftverlust:</strong> Entspricht typischerweise 30 bis 60 MPa Spannungsabfall (~2–5 % von P₀).</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Normativer Rechenwert (Eurocode 2 Ausführungsstatik):
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-blue-200 font-mono text-[11px] text-blue-950 overflow-x-auto text-center">
                    <InlineMath math="\frac{\Delta\sigma_{pr}}{\sigma_{pi}} = 0{,}66 \cdot \rho_{1000} \cdot e^{9{,}1 \mu} \cdot \left(\frac{t}{1000}\right)^{0{,}75 (1-\mu)} \cdot 10^{-5}" />
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-blue-950/90">
                    <li><InlineMath math="\mu = \sigma_{pi} / f_{pk}" /> (Ausnutzungsgrad, typ. 0,70 bis 0,80). Die Formel reagiert <em>exponentiell</em> auf <InlineMath math="\mu" />!</li>
                    <li><InlineMath math="t" /> = 500.000 Stunden (~57 Jahre) als normativer Dauerstandswert.</li>
                    <li><strong>Wärmebehandlung:</strong> Bei Dampfhärtung (&gt; 50 °C) muss die Relaxation um bis zu Faktor 2 bis 3 erhöht werden!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: ELASTISCHE STAUCHUNG */}
      {activeSubTab === 'elastisch' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Layers className="text-shiraz h-5 w-5" />
                4. Elastische Stauchung des Betons &amp; E-Modul-Entwicklung
              </h4>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-md">
                Sofortverlust beim Spannen (t = 0)
              </span>
            </div>

            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
              <p>
                Wenn die Spannpresse die hohe Zugkraft an das Bauteil übergibt, wird der Beton schlagartig komprimiert. 
                Er verkürzt sich elastisch um die Dehnung <InlineMath math="\varepsilon_{c,el} = \sigma_{cp} / E_{cm}(t_0)" />. 
                Da der Spannstahl mit dem Beton in Verbindung steht, staucht sich auch der Stahl um exakt dasselbe Maß ein 
                und verliert unmittelbar einen Teil seiner Zugspannung.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bauweisen-Vergleich */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Vergleich nach Vorspannverfahren
                </h5>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1">A. Spannbettverfahren (sofortiger Verbund):</strong>
                    Spannstähle werden im Widerlager gespannt, Beton gegossen. Nach dem Erhärten wird das Spannglied durchtrennt. 
                    Der gesamte Betonquerschnitt wird <strong>schlagartig auf einmal gestaucht</strong>:
                    <div className="mt-1 font-mono text-blue-700 font-bold">
                      <InlineMath math="\Delta\sigma_{p,el} = \frac{E_p}{E_{cm}(t_0)} \cdot \sigma_{c,p0}" /> (100 % Stauchungsverlust)
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1">B. Nachträglicher Verbund (mehrere Spannglieder):</strong>
                    Die Spannglieder werden sukzessive nacheinander gespannt. Das 1. Spannglied erleidet den vollen Stauchungsverlust 
                    durch alle folgenden Spannglieder; das letzte Spannglied erleidet fast keinen Stauchungsverlust mehr. 
                    Im Mittel setzt man nach Eurocode 2 an:
                    <div className="mt-1 font-mono text-blue-700 font-bold">
                      <InlineMath math="\Delta\sigma_{p,el} = j \cdot \frac{E_p}{E_{cm}(t_0)} \cdot \sigma_{c},\quad j = \frac{n-1}{2n}\;(\text{EC2 Gl. 5.44; } n = \text{Anzahl nacheinander gespannter, gleicher Spannglieder})" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reife & E-Modul Entwicklung */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Einfluss der Betonreife beim Spannen (<InlineMath math="t_0" />)
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Weil der Beton zum Zeitpunkt des Vorspannens (<InlineMath math="t_0 = 3 - 7\text{ d}" />) noch nicht seine volle 
                  28-Tage-Festigkeit besitzt, ist auch sein Elastizitätsmodul <InlineMath math="E_{cm}(t_0)" /> signifikant niedriger:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-xs space-y-1.5">
                  <div className="text-slate-500 text-[10px]">Festigkeitsverlauf nach EC2 Kap. 3.1.2:</div>
                  <div className="text-shiraz font-bold">
                    <InlineMath math="f_{cm}(t) = \beta_{cc}(t) \cdot f_{cm},\; f_{ck}(t) = f_{cm}(t) - 8\,\text{MPa}" />
                  </div>
                  <div className="text-slate-500 text-[10px] pt-1 border-t border-slate-100">Zugehöriger E-Modul:</div>
                  <div className="text-blue-700 font-bold">
                    <InlineMath math="E_{cm}(t) = E_{cm} \cdot \left(\frac{f_{cm}(t)}{f_{cm}}\right)^{0{,}3}" />
                  </div>
                </div>
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900">
                  <strong>Planer-Tipp:</strong> Ein junger Beton mit niedrigem E-Modul verformt sich beim Vorspannen viel stärker elastisch. 
                  Dadurch steigen sowohl der Sofortverlust als auch das spätere Kriechen drastisch an!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: EC2-KOPPLUNGSFORMEL */}
      {activeSubTab === 'kopplung' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Scale className="text-shiraz h-5 w-5" />
                5. Die Eurocode 2 Kopplungsformel (Kriechen + Schwinden + Relaxation)
              </h4>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md">
                DIN EN 1992-1-1 Gl. (5.46)
              </span>
            </div>

            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed space-y-2">
              <p>
                <strong>Warum darf man die Verluste nicht einfach linear addieren?</strong>
              </p>
              <p className="text-xs">
                In der Realität beeinflussen sich Kriechen, Schwinden und Relaxation wechselseitig: 
                Das Kriechen und Schwinden des Betons verkürzt den Träger und entspannt dadurch das Spannglied. Durch die 
                <strong> sinkende Stahlspannung</strong> nimmt jedoch die treibende Triebkraft für die molekulare Stahlrelaxation massiv ab. 
                Umgekehrt führt der Relaxationsabfall zu einer Verringerung der Druckspannung im Beton, was wiederum das Kriechen dämpft.
              </p>
            </div>

            {/* Große Formel-Box */}
            <div className="bg-white text-text-main p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
              <div className="text-xs font-mono text-text-main/70 uppercase tracking-wider flex justify-between items-center">
                <span className="font-semibold">Normative Formel für zeitabhängige Gesamtverluste:</span>
                <span className="text-shiraz font-bold bg-shiraz/5 border border-shiraz/20 px-2 py-0.5 rounded">DIN EN 1992-1-1 Gl. (5.46)</span>
              </div>
              <div className="py-4 px-4 bg-white rounded-xl border border-home-grau/20 text-center overflow-x-auto text-text-main">
                <BlockMath math="\Delta\sigma_{p,c+s+r} = \frac{\varepsilon_{cs} \cdot E_p + 0{,}8 \cdot \Delta\sigma_{pr} + \frac{E_p}{E_{cm}} \cdot \varphi(t, t_0) \cdot \sigma_{c,QP}}{1 + \frac{E_p}{E_{cm}} \cdot \frac{A_p}{A_c} \cdot \left(1 + \frac{A_c \cdot e_p^2}{I_c}\right) \cdot \left(1 + 0{,}8 \cdot \varphi(t, t_0)\right)}" />
              </div>
            </div>

            {/* Formel-Aufschlüsselung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Der Zähler: Die antreibenden Primärverluste
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <strong className="text-blue-700 block">1. Schwind-Anteil: <InlineMath math="\varepsilon_{cs} \cdot E_p" /></strong>
                    Direkte Spannungsabnahme durch Betonverkürzung (typisch ca. 40–80 N/mm²).
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <strong className="text-amber-700 block">2. Kriech-Anteil: <InlineMath math="\varphi \cdot \alpha_p \cdot \sigma_{c,QP}" /></strong>
                    Spannungsabnahme durch das Dauerlast-Kriechen am Spanngliedschwerpunkt (oft der größte Einzelposten, ca. 80–180 N/mm²).
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <strong className="text-purple-700 block">3. Gedämpfte Relaxation: <InlineMath math="0{,}8 \cdot \Delta\sigma_{pr}" /></strong>
                    Faktor 0.8 berücksichtigt, dass die tatsächliche Relaxation geringer ausfällt, weil der Stahl durch Betonverkürzung entlastet wird!
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  Der Nenner: Der dämpfende Rückkopplungsfaktor
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Der Nenner ist <strong>stets größer als 1.0</strong> (typischerweise zwischen <strong>1,15 und 1.35</strong>). 
                  Er drückt mathematisch aus, dass:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5">
                  <li>der Querschnitt durch die Bewehrung <InlineMath math="A_p / A_c" /> versteift wird,</li>
                  <li>die Exzentrizität <InlineMath math="e_p^2 / I_c" /> elastische Schnittkraftumlagerungen erzeugt,</li>
                  <li>das Kriechen <InlineMath math="(1 + 0{,}8 \cdot \varphi)" /> die Spannungsabnahme dämpft.</li>
                </ul>
                <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-[11px] text-emerald-900 font-medium">
                  Ohne diesen Nenner würde man den zeitabhängigen Spannkraftverlust um 15–35 % überschätzen!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB: REIBUNG & KEILSCHLUPF */}
      {activeSubTab === 'mechanisch' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Compass className="text-shiraz h-5 w-5" />
                6. Mechanische Sofortverluste: Reibung im Hüllrohr &amp; Keilschlupf
              </h4>
              <span className="text-xs font-mono font-bold bg-zinc-100 text-zinc-800 border border-zinc-300 px-2.5 py-1 rounded-md">
                Nur bei nachträglichem Verbund
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reibung */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h5 className="font-bold text-sm text-slate-900">Reibungsverluste im Hüllrohr</h5>
                  <span className="text-[10px] font-mono bg-zinc-200 px-2 py-0.5 rounded">EC2 Gl. 5.45</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Beim Spannen reibt der Spannstahl an der Innenwand des Hüllkanals. Nach der Seilreibungsformel von Euler-Eytelwein 
                  fällt die Spannkraft mit zunehmender Entfernung <InlineMath math="x" /> von der Spannpresse exponentiell ab:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-xs">
                  <BlockMath math="\Delta P_\mu(x) = P_0 \cdot \left(1 - e^{-\mu \cdot (\theta + k \cdot x)}\right)" />
                </div>
                <div className="text-xs space-y-1 text-slate-600">
                  <div><strong>µ (Reibungsbeiwert):</strong> dimensionslos; Litze im Stahlhüllrohr 0,19 (EC2 Tab. 5.1), Kunststoffhüllrohre nach ETA, Monolitze ≈ 0,05–0,07.</div>
                  <div><strong>θ (Umlenkwinkel):</strong> Summe der planmäßigen Umlenkwinkel zwischen Spannanker und Stelle x in rad (unabhängig von Richtung und Vorzeichen).</div>
                  <div><strong>k (Wobble-Beiwert):</strong> Ungewollte Wellung des Rohres durch Montageungenauigkeiten (typ. 0.005–0.010 rad/m).</div>
                </div>
              </div>

              {/* Keilschlupf */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h5 className="font-bold text-sm text-slate-900">Verankerungsschlupf (Keileinzug)</h5>
                  <span className="text-[10px] font-mono bg-zinc-200 px-2 py-0.5 rounded">w ≈ 4–8 mm</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Wird die hydraulische Spannpresse nach Erreichen der Soll-Kraft gelöst, zieht die gewaltige Zugkraft die mehrteiligen 
                  konischen Verankerungskeile in den Ankerkörper hinein, bis die mechanische Klemmwirkung voll greift.
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-xs">
                  <BlockMath math="l_{set} = \sqrt{\frac{w \cdot E_p \cdot A_p}{p}}, \qquad \Delta P_{Anker} = 2 \cdot p \cdot l_{set}" />
                </div>
                <p className="text-xs text-slate-600">
                  Dieser <strong>Keilschlupf <InlineMath math="w" /></strong> führt im Nahbereich der Verankerung (über die 
                  Schlupfeintragungslänge <InlineMath math="L_{set}" />) zu einem signifikanten Kraftabfall. Bei kurzen Trägern 
                  (<InlineMath math="L < 15\text{ m}" />) kann der Keilschlupf über 10 % der Gesamtvorspannkraft vernichten, 
                  weshalb häufig überspannt wird – zulässig nur im Rahmen von σ_p,max (EC2 5.10.2.1(2): bis 0,95·f_p0,1k bei Kraftmessung mit ±5 % Genauigkeit).
                </p>
              </div>
            </div>

            {/* Didaktische Box: Schätzwerte vs. Rechenwerte für Reibung & Keilschlupf */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <h5 className="font-bold text-xs text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                  <Scale className="h-4 w-4 text-shiraz" />
                  Größenordnungen der Reibungs- &amp; Schlupfbeiwerte: Schätzwerte vs. Rechenwerte nach EC2
                </h5>
                <span className="text-[11px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300">
                  DIN EN 1992-1-1 Abs. 5.10.5 &amp; Zulassungen (ETA)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-800 leading-relaxed">
                <div className="space-y-2">
                  <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    Praxis-Schätzwerte (Vordimensionierung):
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px]">
                    <li><strong>Reibungsbeiwert μ:</strong> Standard-Stahlblechhüllrohr <InlineMath math="\mu \approx 0{,}19\,\text{rad}^{-1}" />; Kunststoffhüllrohr (PE/PP) <InlineMath math="\mu \approx 0{,}12 \dots 0{,}14\,\text{rad}^{-1}" />.</li>
                    <li><strong>Ungewollter Knickbeiwert k:</strong> <InlineMath math="k \approx 0{,}007\,\text{rad/m} \approx 0{,}4^\circ/\text{m}" /> (erfasst Rohrwellung/Durchhang beim Betonieren).</li>
                    <li><strong>Keilschlupf (Setzmaß w bzw. Δl_s):</strong> <InlineMath math="w \approx 5 \dots 7\,\text{mm}" /> bei Litzenkeilverankerungen; <InlineMath math="w \approx 1 \dots 2\,\text{mm}" /> bei Gewindestangen.</li>
                    <li><strong>Faustregel für mechanische Verluste:</strong> Ca. 5 % bis 15 % Spannkraftabfall in Feldmitte infolge Reibung; bei kurzen Bauteilen (&lt; 15 m) bis zu 20 % durch Keilschlupf!</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Normative Rechenwerte &amp; Verlegekriterien (EC2 Gl. 5.43 &amp; Zulassung):
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-blue-200 font-mono text-[11px] text-blue-950 overflow-x-auto text-center">
                    <InlineMath math="P(x) = P_0 \cdot e^{-\mu (\theta + k \cdot x)}" /> (EC2 Gl. 5.45; θ = Summe der planmäßigen Umlenkwinkel bis x)
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-blue-950/90">
                    <li><InlineMath math="\mu = 0{,}19\,\text{rad}^{-1}" /> (Norm-Rechenwert nach EC2 Tabelle 5.1 für gewellte Stahlrohre).</li>
                    <li><InlineMath math="k = 0{,}005 \dots 0{,}010\,\text{rad/m}" /> (Zulassungswert; bei starren dicken Hüllrohren kleiner als bei flexiblen).</li>
                    <li><strong>Schlupfeinflusslänge:</strong> <InlineMath math="l_{set} = \sqrt{\frac{w \cdot E_p A_p}{p}}" /> (p = Reibungsabfall je Längeneinheit) – innerhalb von l_set kehrt sich die Reibungsrichtung um.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB: VOLLSTÄNDIGE EUROCODE 2 BEISPIELRECHNUNG */}
      {activeSubTab === 'beispielrechnung' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/15 pb-4">
              <div>
                <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Calculator className="text-shiraz h-5 w-5" />
                  Musterrechnung nach DIN EN 1992-1-1: Zeitabhängige Gesamtverluste
                </h4>
                <p className="text-xs text-text-main/70 mt-1">
                  Vollständiges, verifiziertes Zahlenbeispiel nach EC2 Gl. (5.46) für einen 24-m-Spannbetonträger mit interaktiver Parametervariation
                </p>
              </div>
              <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Praxis-Zahlenbeispiel
              </span>
            </div>

            {/* Interaktive Parameter-Leiste */}
            <div className="p-4 bg-off-white/80 rounded-2xl border border-home-grau/30 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Activity size={14} className="text-shiraz" />
                  Echtzeit-Parameter der Beispielrechnung variieren:
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  * Verändere die Parameter, um deren direkten Einfluss auf die Kopplungsrechnung zu beobachten
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* 1. Betonfestigkeitsklasse */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Betonklasse:</label>
                  <select
                    value={exConcreteClass}
                    onChange={(e) => setExConcreteClass(e.target.value as any)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium font-mono"
                  >
                    <option value="C35/45">C35/45 (Ecm = 34.000 MPa)</option>
                    <option value="C45/55">C45/55 (Standard, Ecm = 36.000 MPa)</option>
                    <option value="C70/85">C70/85 (Hochfest, Ecm = 41.000 MPa)</option>
                  </select>
                </div>

                {/* 2. Spannalter t_0 */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Spannalter t₀ (Tage):</label>
                  <select
                    value={exSpanT0}
                    onChange={(e) => setExSpanT0(Number(e.target.value))}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium font-mono"
                  >
                    <option value={3}>3 Tage (sehr frühes Spannen)</option>
                    <option value={7}>7 Tage (Fertigteilwerk Standard)</option>
                    <option value={14}>14 Tage (Baustellenvorspannung)</option>
                    <option value={28}>28 Tage (spätes Spannen)</option>
                  </select>
                </div>

                {/* 3. Umgebungsfeuchte RH */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Relative Luftfeuchte (RH):</label>
                  <select
                    value={exSpanRH}
                    onChange={(e) => setExSpanRH(Number(e.target.value))}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium font-mono"
                  >
                    <option value={50}>RH = 50 % (Trockenes Innenklima)</option>
                    <option value={70}>RH = 70 % (Außenklima Standard)</option>
                    <option value={85}>RH = 85 % (Sehr feuchtes Klima / Küste)</option>
                  </select>
                </div>

                {/* 4. Nenn-Vorspannkraft P_0 */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Nennkraft P₀ an Presse:</label>
                  <select
                    value={exP0}
                    onChange={(e) => setExP0(Number(e.target.value))}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium font-mono"
                  >
                    <option value={3800}>3.800 kN (moderate Ausnutzung)</option>
                    <option value={4500}>4.500 kN (σ_p0 = 1250 MPa)</option>
                    <option value={5000}>5.000 kN (Standard, σ_p0 ≈ 1390 MPa)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bauteil-Steckbrief & Geometrie */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                  <Building size={14} className="text-shiraz" />
                  1. Tragwerk &amp; Querschnitt
                </span>
                <div className="space-y-1 text-text-main/80 font-mono">
                  <div className="flex justify-between"><span>Stützweite L:</span><span className="font-bold">24,00 m</span></div>
                  <div className="flex justify-between"><span>Betonfläche Ac:</span><span className="font-bold">500.000 mm²</span></div>
                  <div className="flex justify-between"><span>Trägheitsmoment Ic:</span><span className="font-bold">8,50 · 10¹⁰ mm⁴</span></div>
                  <div className="flex justify-between"><span>Exzentrizität ep:</span><span className="font-bold">450 mm (Mitte)</span></div>
                  <div className="flex justify-between"><span>Eigengewicht g:</span><span className="font-bold">12,5 kN/m</span></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                  <Zap size={14} className="text-shiraz" />
                  2. Spannglieder &amp; Stahl
                </span>
                <div className="space-y-1 text-text-main/80 font-mono">
                  <div className="flex justify-between"><span>Spannstahl:</span><span className="font-bold">Y1860 S7-15.7</span></div>
                  <div className="flex justify-between"><span>Anzahl Litzen:</span><span className="font-bold">2 × 12 = 24 Litzen</span></div>
                  <div className="flex justify-between"><span>Spannstahlfläche Ap:</span><span className="font-bold">3.600 mm²</span></div>
                  <div className="flex justify-between"><span>E-Modul Ep:</span><span className="font-bold">195.000 N/mm²</span></div>
                  <div className="flex justify-between"><span>Zugfestigkeit fpk:</span><span className="font-bold">1.860 N/mm²</span></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                  <Clock size={14} className="text-shiraz" />
                  3. Unmittelbare Verluste (t = t₀)
                </span>
                <div className="space-y-1 text-text-main/80 font-mono">
                  <div className="flex justify-between"><span>Nennvorspannung σ_p0:</span><span className="font-bold">{formatDeWert(exCalc.sigma_p0)} N/mm²</span></div>
                  <div className="flex justify-between"><span>Reibung + Schlupf + El.:</span><span className="font-bold text-amber-700">-{formatDeWert(exCalc.immediateLosses)} N/mm²</span></div>
                  <div className="flex justify-between"><span>Initialspannung σ_pm0:</span><span className="font-bold text-slate-900">{formatDeWert(exCalc.sigma_pm0)} N/mm²</span></div>
                  <div className="flex justify-between"><span>Initialkraft Pm0:</span><span className="font-bold text-slate-900">{formatDeWert(exCalc.Pm0)} kN</span></div>
                  <div className="flex justify-between"><span>Ausnutzung σ_pm0/fpk:</span><span className="font-bold">{formatDeZahl((exCalc.sigma_pm0 / 1860), 2)}</span></div>
                </div>
              </div>
            </div>

            {/* Schritt 1: Betonspannung in Spanngliedhöhe */}
            <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xs space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Schritt 1: Betonspannung in Spanngliedhöhe unter quasi-ständiger Last (σ_c,QP)
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Zur Ermittlung des Kriechverlusts wird die Betonlängsspannung <InlineMath math="\sigma_{c,QP}" /> am Spanngliedschwerpunkt (EC2 5.10.6; hier vereinfachend nur Eigengewicht, ohne g₂ + ψ₂·q) 
                unter der Kombination aus Initialvorspannkraft <InlineMath math="P_{m0}" /> und dem Eigengewichtsmoment 
                <InlineMath math="M_g = \frac{g \cdot L^2}{8} = \frac{12{,}5 \cdot 24^2}{8} = 900\text{ kNm}" /> in Feldmitte ermittelt:
              </p>
              <div className="p-3 bg-off-white/80 rounded-lg border border-home-grau/20 text-center font-mono text-xs overflow-x-auto">
                <BlockMath math={`\\sigma_{c,QP} = \\frac{P_{m0}}{A_c} + \\frac{P_{m0} \\cdot e_p^2}{I_c} - \\frac{M_g \\cdot e_p}{I_c} = \\frac{${formatDeTeXWert((exCalc.Pm0 * 1000))}}{500.000} + \\frac{${formatDeTeXWert((exCalc.Pm0 * 1000))} \\cdot 450^2}{8{,}5 \\cdot 10^{10}} - \\frac{900 \\cdot 10^6 \\cdot 450}{8{,}5 \\cdot 10^{10}} = ${exCalc.sig_c_p0}\\text{ N/mm²}`} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-center text-slate-600 pt-1">
                <div className="p-1.5 bg-slate-50 rounded border">Normalkraftanteil: +{formatDeZahl(((exCalc.Pm0 * 1000) / 500000), 2)} N/mm²</div>
                <div className="p-1.5 bg-slate-50 rounded border">Vorspann-Moment: +{formatDeZahl(((exCalc.Pm0 * 1000 * 450 * 450) / 8.5e10), 2)} N/mm²</div>
                <div className="p-1.5 bg-slate-50 rounded border">Eigengewichtsentlastung: -4,76 N/mm²</div>
              </div>
            </div>

            {/* Schritt 2: Die 3 zeitabhängigen Materialkennwerte */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Schritt 2: Die drei zeitabhängigen Primär-Kennwerte (EC2 Kap. 3)
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Kriechzahl */}
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <strong className="text-amber-900 font-bold uppercase tracking-wider">1. Kriechzahl φ(∞, t₀)</strong>
                    <span className="font-mono font-bold text-amber-950 text-base">{formatDeWert(exCalc.phi)}</span>
                  </div>
                  <p className="text-amber-950/80 leading-relaxed text-[11px]">
                    Berechnet nach DIN EN 1992-1-1 Anhang B mit wirksamer Bauteildicke <InlineMath math="h_0 = \frac{2 A_c}{u} = 278\text{ mm}" />, 
                    Spannalter <InlineMath math="t_0 = " /> {formatDeWert(exSpanT0)} d (Zement R) und <InlineMath math="RH = " /> {formatDeWert(exSpanRH)} %.
                  </p>
                  <div className="p-2 bg-white rounded border border-amber-200 text-center font-mono font-bold text-amber-900">
                    φ(∞, {formatDeWert(exSpanT0)}) = {formatDeWert(exCalc.phi)}
                  </div>
                </div>

                {/* Schwindmaß */}
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <strong className="text-blue-900 font-bold uppercase tracking-wider">2. Endschwindmaß ε_cs(∞)</strong>
                    <span className="font-mono font-bold text-blue-950 text-base">{formatDeZahl((exCalc.eps_cs * 1000), 2)} mm/m</span>
                  </div>
                  <p className="text-blue-950/80 leading-relaxed text-[11px]">
                    Summe aus autogenem Schwinden (<InlineMath math="\varepsilon_{ca} = " /> {formatDeWert(exCalc.eps_ca)} mm/m) und 
                    Trocknungsschwinden (<InlineMath math="\varepsilon_{cd} = " /> {formatDeWert(exCalc.eps_cd)} mm/m) nach Gl. (3.8).
                  </p>
                  <div className="p-2 bg-white rounded border border-blue-200 text-center font-mono font-bold text-blue-900">
                    ε_cs(∞) = {formatDeZahl((exCalc.eps_cs * 1000), 3)} · 10⁻³
                  </div>
                </div>

                {/* Relaxation */}
                <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <strong className="text-purple-900 font-bold uppercase tracking-wider">3. Stahlrelaxation Δσ_pr</strong>
                    <span className="font-mono font-bold text-purple-950 text-base">{formatDeWert(exCalc.delta_sig_pr)} N/mm²</span>
                  </div>
                  <p className="text-purple-950/80 leading-relaxed text-[11px]">
                    1000-Stunden-Referenzrelaxation nach DIN EN 1992-1-1 Gl. (3.29) für Klasse 2 (<InlineMath math="\rho_{1000} \le 2{,}5\%" />) 
                    bei Spannungsgrad <InlineMath math="\mu = " /> {formatDeZahl((exCalc.sigma_pm0 / 1860), 2)}.
                  </p>
                  <div className="p-2 bg-white rounded border border-purple-200 text-center font-mono font-bold text-purple-900">
                    Δσ_pr = {formatDeWert(exCalc.delta_sig_pr)} N/mm²
                  </div>
                </div>
              </div>
            </div>

            {/* Schritt 3: Kopplungsformel DIN EN 1992-1-1 Gl. (5.46) */}
            <div className="p-5 bg-white rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Schritt 3: Einsetzen in die Eurocode 2 Kopplungsformel (Gl. 5.46)
                </h5>
                <span className="text-[11px] font-mono text-shiraz font-bold">DIN EN 1992-1-1 Gl. (5.46)</span>
              </div>

              {/* Formelbox mit weißem Hintergrund */}
              <div className="p-4 bg-white rounded-xl border border-home-grau/30 text-center overflow-x-auto">
                <BlockMath math="\Delta\sigma_{p,c+s+r} = \frac{\varepsilon_{cs} \cdot E_p + 0{,}8 \cdot \Delta\sigma_{pr} + \frac{E_p}{E_{cm}} \cdot \varphi(t, t_0) \cdot \sigma_{c,QP}}{1 + \frac{E_p}{E_{cm}} \cdot \frac{A_p}{A_c} \cdot \left(1 + \frac{A_c \cdot e_p^2}{I_c}\right) \cdot \left(1 + 0{,}8 \cdot \varphi(t, t_0)\right)}" />
              </div>

              {/* Aufschlüsselung Zähler & Nenner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Zähler-Berechnung */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">
                    Der Zähler (Antreibende Primärverluste):
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                      <span>1. Schwindanteil (ε_cs · Ep):</span>
                      <span className="font-bold text-blue-700">+{formatDeWert(exCalc.term_schwinden)} N/mm²</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                      <span>2. Kriechanteil (φ · α_p · σ_cp0):</span>
                      <span className="font-bold text-amber-700">+{formatDeWert(exCalc.term_kriechen)} N/mm²</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                      <span>3. Gedämpfte Relaxation (0,8 · Δσ_pr):</span>
                      <span className="font-bold text-purple-700">+{formatDeWert(exCalc.term_relaxation)} N/mm²</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-100 rounded border border-slate-300 font-bold text-xs">
                      <span>ZÄHLER-SUMME:</span>
                      <span className="text-slate-900">{formatDeWert(exCalc.zaehler)} N/mm²</span>
                    </div>
                  </div>
                </div>

                {/* Nenner-Berechnung */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide">
                    Der Nenner (Rückstellende Systemsteifigkeit):
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                      <span>Modulverhältnis α_p = Ep/Ecm:</span>
                      <span className="font-bold">{formatDeZahl(exConc.alpha_p, 3)}</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                      <span>Geometriefaktor [1 + (Ac·ep²)/Ic]:</span>
                      <span className="font-bold">{formatDeWert(exCalc.k_geom)}</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                      <span>Kriechdämpfung [1 + 0,8 · φ]:</span>
                      <span className="font-bold">{formatDeZahl((1 + 0.8 * exCalc.phi), 3)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-100 rounded border border-slate-300 font-bold text-xs">
                      <span>NENNER-WERT:</span>
                      <span className="text-slate-900">{formatDeWert(exCalc.nenner)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rechenergebnis Kopplungsformel */}
              <div className="p-4 bg-shiraz/5 border border-shiraz/20 rounded-xl text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-shiraz block">
                  Ergebnis des gekoppelten Gesamtverlusts:
                </span>
                <div className="text-2xl font-black font-mono text-shiraz">
                  Δσ_p,c+s+r = {formatDeWert(exCalc.zaehler)} / {formatDeWert(exCalc.nenner)} = {formatDeWert(exCalc.delta_sig_csr)} N/mm²
                </div>
                <p className="text-[11px] text-text-main/70">
                  Durch die Kopplung mit dem Nenner ({formatDeWert(exCalc.nenner)}) fallen die tatsächlichen Gesamtverluste um 
                  <strong> {formatDeZahl(((1 - 1 / exCalc.nenner) * 100), 0)} % geringer</strong> aus als bei einer naiven linearen Addition!
                </p>
              </div>
            </div>

            {/* Schritt 4: Gesamtbilanz & Endvorspannkraft */}
            <div className="p-5 bg-white rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Schritt 4: Endzustand &amp; Verlustbilanz des Trägers
              </h5>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Nennkraft P₀ (Presse)</span>
                  <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">{formatDeWert(exP0)} kN</span>
                  <span className="text-[10px] text-slate-500">100 % (Ausgangswert)</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Initialkraft Pm0 (t₀)</span>
                  <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">{formatDeWert(exCalc.Pm0)} kN</span>
                  <span className="text-[10px] text-slate-500">nach Reibung &amp; Schlupf</span>
                </div>

                <div className="p-3 bg-shiraz/10 rounded-xl border border-shiraz/30">
                  <span className="text-[10px] uppercase font-bold text-shiraz block">Endvorspannkraft Pm,∞</span>
                  <span className="text-2xl font-black text-shiraz font-mono mt-0.5 block">{formatDeWert(exCalc.Pminf)} kN</span>
                  <span className="text-[10px] text-shiraz/80 font-bold">Verbleibend bei t=∞</span>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-[10px] uppercase font-bold text-rose-800 block">Gesamtverlust ΔP_ges</span>
                  <span className="text-xl font-black text-rose-900 font-mono mt-0.5 block">-{formatDeWert(exCalc.delta_P_total)} kN</span>
                  <span className="text-[10px] text-rose-700 font-bold">({formatDeWert(exCalc.loss_pct)} % von P₀)</span>
                </div>
              </div>

              {/* Verlust-Balkendiagramm visuell */}
              <div className="space-y-1.5 text-xs pt-1">
                <span className="font-bold text-slate-700 block">Aufschlüsselung der Gesamtverluste ({formatDeWert(exCalc.loss_pct)} %):</span>
                <div className="w-full h-7 bg-slate-100 rounded-xl overflow-hidden flex font-mono text-[10px] font-bold text-white text-center leading-7 shadow-xs">
                  <div 
                    className="bg-amber-600 transition-all duration-300" 
                    style={{ width: `${((exCalc.immediateLosses / exCalc.sigma_p0) * 100).toFixed(1)}%` }}
                    title={`Unmittelbar (Reibung/Schlupf/Elast.): -${formatDeZahl(((exCalc.immediateLosses / exCalc.sigma_p0) * 100), 1)} %`}
                  >
                    Unmittelbar ({formatDeZahl(((exCalc.immediateLosses / exCalc.sigma_p0) * 100), 0)}%)
                  </div>
                  <div 
                    className="bg-amber-500 transition-all duration-300" 
                    style={{ width: `${((exCalc.term_kriechen / exCalc.nenner / exCalc.sigma_p0) * 100).toFixed(1)}%` }}
                    title={`Kriechen: -${formatDeZahl(((exCalc.term_kriechen / exCalc.nenner / exCalc.sigma_p0) * 100), 1)} %`}
                  >
                    Kriechen
                  </div>
                  <div 
                    className="bg-blue-600 transition-all duration-300" 
                    style={{ width: `${((exCalc.term_schwinden / exCalc.nenner / exCalc.sigma_p0) * 100).toFixed(1)}%` }}
                    title={`Schwinden: -${formatDeZahl(((exCalc.term_schwinden / exCalc.nenner / exCalc.sigma_p0) * 100), 1)} %`}
                  >
                    Schwinden
                  </div>
                  <div 
                    className="bg-purple-600 transition-all duration-300" 
                    style={{ width: `${((exCalc.term_relaxation / exCalc.nenner / exCalc.sigma_p0) * 100).toFixed(1)}%` }}
                    title={`Relaxation: -${formatDeZahl(((exCalc.term_relaxation / exCalc.nenner / exCalc.sigma_p0) * 100), 1)} %`}
                  >
                    Rel.
                  </div>
                  <div 
                    className="bg-emerald-600 transition-all duration-300 flex-1"
                    title={`Verbleibende Vorspannkraft Pm,inf: ${formatDeZahl((100 - exCalc.loss_pct), 1)} %`}
                  >
                    Verbleibend: {formatDeZahl((100 - exCalc.loss_pct), 0)} %
                  </div>
                </div>
              </div>

              {/* Fazit Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-text-main/80 space-y-1 leading-relaxed">
                <strong className="text-slate-900 block">Ingenieurmäßiges Fazit aus dem Zahlenbeispiel:</strong>
                <p>
                  1. Im Beispiel gehen insgesamt <strong>{formatDeWert(exCalc.loss_pct)} %</strong> der Pressenkraft verloren (Sofortverluste plus zeitabhängige Verluste). Üblich sind zeitabhängig 10–20 % von P<sub>m0</sub> und insgesamt 20–30 % der Pressenkraft. 
                  Das ist im Spannbetonbau normal und wird bei der Festlegung von <InlineMath math="P_0" /> von vornherein einkalkuliert.
                </p>
                <p>
                  2. Der <strong>Kriechanteil</strong> ist fast immer der größte Einzelverlustposten. Ein späteres Vorspannen (z. B. bei <InlineMath math="t_0 = 14" /> oder 28 Tagen) 
                  oder die Wahl einer höheren Betonfestigkeitsklasse (C70/85) reduziert das Kriechen massiv und steigert die verbleibende Spannkraft spürbar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB: INTERAKTIVER SCHNELLRECHNER */}
      {activeSubTab === 'rechner' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Activity className="text-shiraz h-5 w-5" />
                Interaktiver Kennwerte- &amp; Verlust-Explorer
              </h4>
              <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-1 rounded">
                Echtzeit-Parameter-Sensitivität
              </span>
            </div>

            <p className="text-xs text-text-main/80">
              Verändern Sie die wesentlichen baustofflichen Einflussgrößen und beobachten Sie, wie Kriechzahl, 
              Schwindmaß und der resultierende Gesamtverlust im Zusammenspiel reagieren:
            </p>

            {/* Slider Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1 flex justify-between">
                  <span>Betonfestigkeit f_ck:</span>
                  <span className="text-shiraz font-mono font-bold">{formatDeWert(calcFck)} MPa</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="5"
                  value={calcFck}
                  onChange={(e) => setCalcFck(Number(e.target.value))}
                  className="w-full accent-shiraz"
                />
                <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                  <span>C30/37</span>
                  <span>C90/105</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1 flex justify-between">
                  <span>Vorspannalter t₀:</span>
                  <span className="text-shiraz font-mono font-bold">{formatDeWert(calcT0)} Tage</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="28"
                  step="1"
                  value={calcT0}
                  onChange={(e) => setCalcT0(Number(e.target.value))}
                  className="w-full accent-shiraz"
                />
                <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                  <span>2 d (Früh)</span>
                  <span>28 d (Spät)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1 flex justify-between">
                  <span>Luftfeuchte RH:</span>
                  <span className="text-shiraz font-mono font-bold">{formatDeWert(calcRH)} %</span>
                </label>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() => setCalcRH(50)}
                    className={`py-1 text-xs rounded font-medium border ${calcRH === 50 ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700 border-slate-200'}`}
                  >
                    50% Innen
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcRH(80)}
                    className={`py-1 text-xs rounded font-medium border ${calcRH === 80 ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700 border-slate-200'}`}
                  >
                    80% Außen
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1 flex justify-between">
                  <span>Relaxationsklasse:</span>
                  <span className="text-shiraz font-mono font-bold">ρ₁₀₀₀ = {formatDeWert(calcSteelLoss)}%</span>
                </label>
                <select
                  value={calcSteelLoss}
                  onChange={(e) => setCalcSteelLoss(Number(e.target.value))}
                  className="w-full text-xs bg-white border border-slate-300 rounded p-1.5 outline-none font-medium mt-1"
                >
                  <option value={2.5}>Klasse 2 (Low-Relax.) 2,5%</option>
                  <option value={4.0}>Klasse 3 (Spannstäbe) 4,0%</option>
                  <option value={8.0}>Klasse 1 (Normal) 8,0%</option>
                </select>
              </div>
            </div>

            {/* Ergebnis-Karten */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                <span className="text-xs text-amber-800 font-medium">Resultierende Kriechzahl φ(∞):</span>
                <div className="text-2xl font-bold font-mono text-amber-900">{formatDeZahl(estPhi, 2)}</div>
                <p className="text-[10px] text-amber-700">
                  {estPhi > 2.5 ? 'Hohes Kriechen (junger Beton / trockene Luft)' : 'Geringes Kriechen (günstig)'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                <span className="text-xs text-blue-800 font-medium">Gesamtschwindmaß ε_cs(∞):</span>
                <div className="text-2xl font-bold font-mono text-blue-900">{formatDeZahl((estEpsCs * 1000), 2)} mm/m</div>
                <p className="text-[10px] text-blue-700">
                  Entspricht {formatDeZahl((estEpsCs * 195000), 0)} N/mm² theoretischem Spannungsabfall
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
                <span className="text-xs text-purple-800 font-medium">Prognostizierter Gesamtverlust (c+s+r):</span>
                <div className="text-2xl font-bold font-mono text-purple-900">≈ {formatDeZahl(estCsrLossPct, 1)} %</div>
                <p className="text-[10px] text-purple-700">
                  Restspannkraft im Endzustand: ca. {formatDeZahl((100 - estCsrLossPct), 1)} % von P₀
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
