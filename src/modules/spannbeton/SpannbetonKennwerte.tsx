import { useState, useMemo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import BeiwerteKatalog from './BeiwerteKatalog';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
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
} from '@/src/calc/spannbeton';
import { ShieldAlert, CheckCircle2, BookOpen, Layers, Scale, Compass } from 'lucide-react';
import { KENNWERT_REITER } from './kennwerte/daten';
import type { KennwertBereich, KennwertReiter } from './kennwerte/daten';
import KennwerteBeton from './kennwerte/KennwerteBeton';
import KennwerteEinpressmoertel from './kennwerte/KennwerteEinpressmoertel';
import KennwerteKriechen from './kennwerte/KennwerteKriechen';
import KennwerteSchwinden from './kennwerte/KennwerteSchwinden';
import KennwerteRelaxation from './kennwerte/KennwerteRelaxation';
import KennwerteBeispielrechnung from './kennwerte/KennwerteBeispielrechnung';
import KennwerteRechner from './kennwerte/KennwerteRechner';

export default function SpannbetonKennwerte() {
  const [activeSubTab, setActiveSubTab] = useState<KennwertReiter>('beton_r');
  const zeige = (b: KennwertBereich) => KENNWERT_REITER.find(r => r.id === activeSubTab)?.bereiche.includes(b) ?? false;

  // Concrete Material States (Festigkeit, E-Modul, Reife, Zugfestigkeit, Gestein)
  const [matGrade, setMatGrade] = useState<string>('C45/55');
  const [matCement, setMatCement] = useState<'R' | 'N' | 'S'>('R');
  const [matAgeDays, setMatAgeDays] = useState<number>(7);
  const [matTemp, setMatTemp] = useState<number>(20); // °C
  const [matAggregate, setMatAggregate] = useState<'quarzit' | 'basalt' | 'kalkstein' | 'sandstein'>('quarzit');
  const [matBeamHeight, setMatBeamHeight] = useState<number>(400); // mm Querschnittshöhe für fctm,fl

  // Einpressmörtel & Systembaustoffe States (DIN EN 447, Hüllrohre, Fette, Keile)
  const [groutWz, setGroutWz] = useState<number>(0.36); // Wasserzementwert
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

    // Faktor für die Art der Gesteinskörnung nach EC2 Abs. 3.1.3(2)
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

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p>
            Im konventionellen Stahlbetonbau werden Risse in der Zugzone bewusst toleriert (Zustand II). Im 
            <strong> Spannbetonbau</strong> hingegen wird das Tragwerk durch künstlich aufgebrachte Druckspannungen so überdrückt, 
            dass Zugspannungen unter Betriebsbelastung vermieden oder strikt begrenzt werden (Zustand I). Das Gelingen 
            dieses Prinzips hängt vollständig von der <strong>dauerhaften Beherrschung der Baustoffverformungen</strong> ab: 
            Kriechen und Schwinden des Betons sowie die molekulare Relaxation des Spannstahls führen über die Lebensdauer 
            zu unvermeidlichen Spannkraftverlusten: zeitabhängig typisch <strong>10 % bis 20 % von P<sub>m0</sub></strong>, insgesamt inkl. Reibung und Schlupf <strong>20 % bis 30 % der Pressenkraft</strong>.
          </p>
        </div>

      </div>

      {/* Reiter: 7 Bereiche (AP 3.8) */}
      <ModuleTabs
        label="Baustoffkennwerte im Spannbetonbau: Bereiche"
        tabs={KENNWERT_REITER}
        aktiv={activeSubTab}
        onWechsel={setActiveSubTab}
        className="[&>[role=tablist]]:bg-white [&>[role=tablist]]:p-4 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:shadow-sm [&>[role=tablist]]:border [&>[role=tablist]]:border-home-grau/30"
      >
      <div className="mt-6 space-y-6">
      {/* 0. TAB: BEIWERTE-KATALOG (SCHÄTZ- VS. RECHENWERTE) */}
      {zeige('beiwerte') && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <BeiwerteKatalog />
        </div>
      )}

      {/* 0. TAB: BETON-MATERIALEIGENSCHAFTEN */}
      {zeige('beton') && <KennwerteBeton activeMatData={activeMatData} concDatabase={concDatabase} matAgeDays={matAgeDays} matAggregate={matAggregate} matBeamHeight={matBeamHeight} matCement={matCement} matGrade={matGrade} matMaturity={matMaturity} matTemp={matTemp} setMatAgeDays={setMatAgeDays} setMatAggregate={setMatAggregate} setMatBeamHeight={setMatBeamHeight} setMatCement={setMatCement} setMatGrade={setMatGrade} setMatTemp={setMatTemp} stressStrainCurvePoints={stressStrainCurvePoints} />}

      {/* 0b. TAB: EINPRESSMÖRTEL & SYSTEMBAUSTOFFE */}
      {zeige('einpressmoertel') && <KennwerteEinpressmoertel groutAdmixturePct={groutAdmixturePct} groutCalculations={groutCalculations} groutCementType={groutCementType} groutDuctDia={groutDuctDia} groutStrandCount={groutStrandCount} groutTendonLength={groutTendonLength} groutWz={groutWz} setGroutAdmixturePct={setGroutAdmixturePct} setGroutCementType={setGroutCementType} setGroutDuctDia={setGroutDuctDia} setGroutStrandCount={setGroutStrandCount} setGroutTendonLength={setGroutTendonLength} setGroutWz={setGroutWz} />}
      {zeige('kriechen') && <KennwerteKriechen />}

      {/* 2. TAB: SCHWINDEN DES BETONS */}
      {zeige('schwinden') && <KennwerteSchwinden />}

      {/* 3. TAB: STAHLRELAXATION */}
      {zeige('relaxation') && <KennwerteRelaxation />}

      {/* 4. TAB: ELASTISCHE STAUCHUNG */}
      {zeige('elastisch') && (
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
      {zeige('kopplung') && (
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
      {zeige('mechanisch') && (
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
      {zeige('beispielrechnung') && <KennwerteBeispielrechnung exCalc={exCalc} exConc={exConc} exConcreteClass={exConcreteClass} exP0={exP0} exSpanRH={exSpanRH} exSpanT0={exSpanT0} setExConcreteClass={setExConcreteClass} setExP0={setExP0} setExSpanRH={setExSpanRH} setExSpanT0={setExSpanT0} />}

      {/* 7. TAB: INTERAKTIVER SCHNELLRECHNER */}
      {zeige('rechner') && <KennwerteRechner calcFck={calcFck} calcRH={calcRH} calcSteelLoss={calcSteelLoss} calcT0={calcT0} estCsrLossPct={estCsrLossPct} estEpsCs={estEpsCs} estPhi={estPhi} setCalcFck={setCalcFck} setCalcRH={setCalcRH} setCalcSteelLoss={setCalcSteelLoss} setCalcT0={setCalcT0} />}
      </div>
      </ModuleTabs>
    </div>
  );
}
