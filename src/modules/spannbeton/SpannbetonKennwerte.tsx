import { useState, useMemo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import BeiwerteKatalog from './BeiwerteKatalog';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import {
  CONCRETE,
  E_SPANNSTAHL,
  SPANNSTAHL,
  LITZE,
  betaCc,
  SPANNUNGSGRENZEN,
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
import { dehnungsKennwerte, fcdBeton, FCD_MODUL } from '@/src/data/kennwerte';
import { KENNWERT_REITER } from './kennwerte/daten';
import type { KennwertBereich, KennwertReiter } from './kennwerte/daten';
import KennwerteBeton from './kennwerte/KennwerteBeton';
import KennwerteEinpressmoertel from './kennwerte/KennwerteEinpressmoertel';
import KennwerteKriechen from './kennwerte/KennwerteKriechen';
import KennwerteSchwinden from './kennwerte/KennwerteSchwinden';
import KennwerteRelaxation from './kennwerte/KennwerteRelaxation';
import KennwerteBeispielrechnung from './kennwerte/KennwerteBeispielrechnung';
import KennwerteRechner from './kennwerte/KennwerteRechner';
import inhalt from '@/content/spannbeton/SpannbetonKennwerte.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
  const [groutCementType, setGroutCementType] = useState<string>(inhalt.werte.cemI525);
  const [groutDuctType, setGroutDuctType] = useState<'plastic_fib' | 'steel_en523' | 'unbonded_grease'>('plastic_fib');
  const [groutDuctDia, setGroutDuctDia] = useState<number>(85); // mm Innendurchmesser
  const [groutStrandCount, setGroutStrandCount] = useState<number>(12); // z.B. 12 oder 19 Litzen à 150mm²
  const [groutTendonLength, setGroutTendonLength] = useState<number>(45); // m Spanngliedlänge

  const groutCalculations = useMemo(() => {
    // 1. Querschnitt & Hohlraumvolumen
    const ductArea = Math.PI * Math.pow(groutDuctDia / 2, 2); // mm²
    const strandArea = groutStrandCount * LITZE.Ap; // mm² (zentral LITZE.Ap = 150 mm² je 0,6″-Litze)
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
    const cementBags25 = Math.ceil(totalCementKg / 25); // Sackware 25 kg (Annahme der Mengenermittlung)

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
    'C30/37': { fck: CONCRETE['C30/37'].fck, fck_cube: CONCRETE['C30/37'].fck_cube, fcm: CONCRETE['C30/37'].fcm, fctm: CONCRETE['C30/37'].fctm, fctk005: CONCRETE['C30/37'].fctk_005, fctk095: CONCRETE['C30/37'].fctk_095, Ecm: CONCRETE['C30/37'].Ecm, eps_c1: CONCRETE['C30/37'].eps_c1, eps_cu1: CONCRETE['C30/37'].eps_cu1, eps_c2: CONCRETE['C30/37'].eps_c2, eps_cu2: CONCRETE['C30/37'].eps_cu2, typicalUse: inhalt.werte.üblicheUntergrenzeNachträglicherVerbund, prestressSuitability: inhalt.werte.zulässigFürModerateVorspannung },
    'C35/45': { fck: CONCRETE['C35/45'].fck, fck_cube: CONCRETE['C35/45'].fck_cube, fcm: CONCRETE['C35/45'].fcm, fctm: CONCRETE['C35/45'].fctm, fctk005: CONCRETE['C35/45'].fctk_005, fctk095: CONCRETE['C35/45'].fctk_095, Ecm: CONCRETE['C35/45'].Ecm, eps_c1: CONCRETE['C35/45'].eps_c1, eps_cu1: CONCRETE['C35/45'].eps_cu1, eps_c2: CONCRETE['C35/45'].eps_c2, eps_cu2: CONCRETE['C35/45'].eps_cu2, typicalUse: inhalt.werte.hallenbauStandardSpannbeton, prestressSuitability: inhalt.werte.häufigerStandardImHochbau },
    'C40/50': { fck: CONCRETE['C40/50'].fck, fck_cube: CONCRETE['C40/50'].fck_cube, fcm: CONCRETE['C40/50'].fcm, fctm: CONCRETE['C40/50'].fctm, fctk005: CONCRETE['C40/50'].fctk_005, fctk095: CONCRETE['C40/50'].fctk_095, Ecm: CONCRETE['C40/50'].Ecm, eps_c1: CONCRETE['C40/50'].eps_c1, eps_cu1: CONCRETE['C40/50'].eps_cu1, eps_c2: CONCRETE['C40/50'].eps_c2, eps_cu2: CONCRETE['C40/50'].eps_cu2, typicalUse: inhalt.werte.fertigteileBrückenüberbauten, prestressSuitability: inhalt.werte.sehrGutGeeignetFür },
    'C45/55': { fck: CONCRETE['C45/55'].fck, fck_cube: CONCRETE['C45/55'].fck_cube, fcm: CONCRETE['C45/55'].fcm, fctm: CONCRETE['C45/55'].fctm, fctk005: CONCRETE['C45/55'].fctk_005, fctk095: CONCRETE['C45/55'].fctk_095, Ecm: CONCRETE['C45/55'].Ecm, eps_c1: CONCRETE['C45/55'].eps_c1, eps_cu1: CONCRETE['C45/55'].eps_cu1, eps_c2: CONCRETE['C45/55'].eps_c2, eps_cu2: CONCRETE['C45/55'].eps_cu2, typicalUse: inhalt.werte.üblichImBrückenbauZtv, prestressSuitability: inhalt.werte.deutscherStandardFürSpannbetonbrücken },
    'C50/60': { fck: CONCRETE['C50/60'].fck, fck_cube: CONCRETE['C50/60'].fck_cube, fcm: CONCRETE['C50/60'].fcm, fctm: CONCRETE['C50/60'].fctm, fctk005: CONCRETE['C50/60'].fctk_005, fctk095: CONCRETE['C50/60'].fctk_095, Ecm: CONCRETE['C50/60'].Ecm, eps_c1: CONCRETE['C50/60'].eps_c1, eps_cu1: CONCRETE['C50/60'].eps_cu1, eps_c2: CONCRETE['C50/60'].eps_c2, eps_cu2: CONCRETE['C50/60'].eps_cu2, typicalUse: inhalt.werte.hochbeanspruchteHohlkastenbrückenEisenba, prestressSuitability: inhalt.werte.hervorragendSehrGeringesKriechen },
    'C55/67': { fck: CONCRETE['C55/67'].fck, fck_cube: CONCRETE['C55/67'].fck_cube, fcm: CONCRETE['C55/67'].fcm, fctm: CONCRETE['C55/67'].fctm, fctk005: CONCRETE['C55/67'].fctk_005, fctk095: CONCRETE['C55/67'].fctk_095, Ecm: CONCRETE['C55/67'].Ecm, eps_c1: CONCRETE['C55/67'].eps_c1, eps_cu1: CONCRETE['C55/67'].eps_cu1, eps_c2: CONCRETE['C55/67'].eps_c2, eps_cu2: CONCRETE['C55/67'].eps_cu2, typicalUse: inhalt.werte.hochfesterBetonAbC55, prestressSuitability: inhalt.werte.sehrHoheSteifigkeitGeringe },
    'C60/75': { fck: CONCRETE['C60/75'].fck, fck_cube: CONCRETE['C60/75'].fck_cube, fcm: CONCRETE['C60/75'].fcm, fctm: CONCRETE['C60/75'].fctm, fctk005: CONCRETE['C60/75'].fctk_005, fctk095: CONCRETE['C60/75'].fctk_095, Ecm: CONCRETE['C60/75'].Ecm, eps_c1: CONCRETE['C60/75'].eps_c1, eps_cu1: CONCRETE['C60/75'].eps_cu1, eps_c2: CONCRETE['C60/75'].eps_c2, eps_cu2: CONCRETE['C60/75'].eps_cu2, typicalUse: inhalt.werte.weitgespannteBrückenTaktschiebeverfahren, prestressSuitability: inhalt.werte.sehrHoheFrühfestigkeit },
    'C70/85': { fck: CONCRETE['C70/85'].fck, fck_cube: CONCRETE['C70/85'].fck_cube, fcm: CONCRETE['C70/85'].fcm, fctm: CONCRETE['C70/85'].fctm, fctk005: CONCRETE['C70/85'].fctk_005, fctk095: CONCRETE['C70/85'].fctk_095, Ecm: CONCRETE['C70/85'].Ecm, eps_c1: CONCRETE['C70/85'].eps_c1, eps_cu1: CONCRETE['C70/85'].eps_cu1, eps_c2: CONCRETE['C70/85'].eps_c2, eps_cu2: CONCRETE['C70/85'].eps_cu2, typicalUse: inhalt.werte.hochleistungsbetonHpcSchlankePylone, prestressSuitability: inhalt.werte.extremSteifKriechzahlUnter },
    'C80/95': { fck: CONCRETE['C80/95'].fck, fck_cube: CONCRETE['C80/95'].fck_cube, fcm: CONCRETE['C80/95'].fcm, fctm: CONCRETE['C80/95'].fctm, fctk005: CONCRETE['C80/95'].fctk_005, fctk095: CONCRETE['C80/95'].fctk_095, Ecm: CONCRETE['C80/95'].Ecm, eps_c1: CONCRETE['C80/95'].eps_c1, eps_cu1: CONCRETE['C80/95'].eps_cu1, eps_c2: CONCRETE['C80/95'].eps_c2, eps_cu2: CONCRETE['C80/95'].eps_cu2, typicalUse: inhalt.werte.höchstleistungsbauteileGroßbrücken, prestressSuitability: inhalt.werte.sehrGeringeRelaxationKriechverformung },
    'C90/105': { fck: CONCRETE['C90/105'].fck, fck_cube: CONCRETE['C90/105'].fck_cube, fcm: CONCRETE['C90/105'].fcm, fctm: CONCRETE['C90/105'].fctm, fctk005: CONCRETE['C90/105'].fctk_005, fctk095: CONCRETE['C90/105'].fctk_095, Ecm: CONCRETE['C90/105'].Ecm, eps_c1: CONCRETE['C90/105'].eps_c1, eps_cu1: CONCRETE['C90/105'].eps_cu1, eps_c2: CONCRETE['C90/105'].eps_c2, eps_cu2: CONCRETE['C90/105'].eps_cu2, typicalUse: inhalt.werte.ultrahochfesterBetonFürExtrembauten, prestressSuitability: inhalt.werte.sonderzulassungErforderlichSehrSprödes }
  };

  const activeMatData = concDatabase[matGrade] || concDatabase['C45/55'];

  const matMaturity = useMemo(() => {
    // Äquivalentes Betonalter unter Temperatur T nach Arrhenius (EC2 Gl. B.10):
    const t_eff = tempAdjustedAge(matAgeDays, matTemp);

    // beta_cc(t) nach DIN EN 1992-1-1 Gl. (3.2), s nach 3.1.2(6) – zentral (betaCc)
    const beta_cc = betaCc(Math.max(0.1, t_eff), matCement as CementClass);

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
    const fcd_28 = Number(fcdBeton(activeMatData.fck, FCD_MODUL.spannbetonKennwerte).toFixed(1));
    const fcd_t = Number(fcdBeton(fck_t, FCD_MODUL.spannbetonKennwerte).toFixed(1));

    // Reifegrad bezogen auf 28-Tage-fck:
    const maturity_pct = Number(((fck_t / activeMatData.fck) * 100).toFixed(1));

    // Spannfreigabe ab 70 % bzw. 80 % von f_ck: Lehrannahme (die Mindestfestigkeit beim Spannen legt die Zulassung/ETA
    // des Spannverfahrens fest):
    const releaseReady = maturity_pct >= 70;
    const releaseOptimum = maturity_pct >= 80;

    // Maximal zulässige Betondruckspannung beim Vorspannen (EC2 Abs. 5.10.2.2(5), zentral SPANNUNGSGRENZEN):
    const sigma_c_zul = Number((SPANNUNGSGRENZEN.betonVorspannen * fck_t).toFixed(1));

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
    const k = (1.05 * Ecm * (eps_c1 / 1000)) / fcm; // Gl. (3.14): k = 1,05·E_cm·|ε_c1|/f_cm

    const points: { eps: number; sigma: number; sigma_parabel: number }[] = [];
    const steps = 40;
    const fcd = matMaturity.fcd_t;
    const fckVal = activeMatData.fck;
    // Tab. 3.1 zentral (src/data/kennwerte.ts): Klassenwerte, über C90/105 gehalten (Runde 5, Z55)
    const { ec2: eps_c2, ecu2: eps_cu2, n } = dehnungsKennwerte(fckVal);

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
    // Kennwerte zentral aus Tab. 3.1 (CONCRETE), α_p = E_p/E_cm mit E_p = 195 000 N/mm² (EC2 3.3.6(3))
    const c = CONCRETE[exConcreteClass] ?? CONCRETE['C45/55'];
    return { fck: c.fck, fcm: c.fcm, Ecm: c.Ecm, alpha_p: E_SPANNSTAHL / c.Ecm };
  }, [exConcreteClass]);

  const exCalc = useMemo(() => {
    const Ap = 2 * 12 * LITZE.Ap; // mm² (2 × 12 Litzen à 150 mm² = 3600 mm²)
    const Ac = 500000; // mm²
    const Ic = 8.5e10; // mm⁴
    const ep = 450; // mm
    const Ep = E_SPANNSTAHL; // N/mm², zentral
    const fpk = SPANNSTAHL.Y1860.fpk; // N/mm², zentral

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
    // Gl. (3.29), Klasse 2 (ρ_1000 = 2,5 %), t = 500 000 h → t/1000 = 500
    const delta_sig_pr = Number((0.66 * 2.5 * Math.exp(9.1 * mu) * Math.pow(500, 0.75 * (1 - mu)) * 1e-5 * sigma_pm0).toFixed(1));

    // DIN EN 1992-1-1 Gl. (5.46)
    // Zähler
    const term_schwinden = eps_cs * Ep;
    const term_kriechen = phi * exConc.alpha_p * sig_c_p0;
    const term_relaxation = 0.8 * delta_sig_pr; // Gl. (5.46): 0,8·Δσ_pr
    const zaehler = term_schwinden + term_kriechen + term_relaxation;

    // Nenner
    const k_geom = 1 + (Ac * ep * ep) / Ic;
    const nenner = 1 + exConc.alpha_p * (Ap / Ac) * k_geom * (1 + 0.8 * phi); // Gl. (5.46): Nenner mit [1 + 0,8·φ]

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

  // Überschlag für den Explorer (Lehrnäherung, vorläufig – keine Normformel; Durchsicht A 29.10.2026, DSA-SB-7):
  // φ(∞) als Potenzansatz in t_0 und f_ck (an Anhang B für h_0 ≈ 300 mm angelehnt), ε_cs(∞) als Pauschalwert je Klima;
  // genaue Werte nach Anhang B in den Reitern Kriechen, Schwinden und Beispielrechnung.
  const estPhi = calcRH === 50 
    ? Math.max(1.8, 3.2 * Math.pow(calcT0, -0.22) * (45 / calcFck)) // Näherung RH 50 %
    : Math.max(1.2, 2.0 * Math.pow(calcT0, -0.20) * (45 / calcFck)); // Näherung RH 80 %
  const estEpsCs = calcRH === 50 ? 0.00038 : 0.00022; // m/m, Lehrwert (Näherung)
  const approxInitialPrestress = 1350; // N/mm², Lehrannahme: σ_pm0 nach Sofortverlusten (unter 1 360 N/mm² nach Gl. 5.43)
  // Näherung: Verlust in % ≈ 3,8·φ + 0,7·ε_cs·E_p/σ_pm0·100 + 0,8·Δσ_pr/σ_pm0 (Faktoren 3,8 und 0,7: Lehrannahme, vorläufig)
  const estCsrLossPct = Math.min(30, Math.max(8, (estPhi * 3.8 + estEpsCs * E_SPANNSTAHL / approxInitialPrestress * 100 * 0.7 + calcSteelLoss * 0.8)));

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <BookOpen className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.baustoffkennwertePhänomeneImSpannbetonba} /></h3>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.physikalischeWirkmechanismenMikrostruktu} /></p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap"><MdText text={inhalt.texte.eurocode2Kap3} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p>
            Im konventionellen Stahlbetonbau werden Risse in der Zugzone bewusst toleriert (Zustand II). Im 
            <strong> Spannbetonbau</strong> hingegen wird das Tragwerk durch künstlich aufgebrachte Druckspannungen so überdrückt, 
            dass Zugspannungen unter Betriebsbelastung vermieden oder strikt begrenzt werden (Zustand I). Das Gelingen 
            dieses Prinzips hängt vollständig von der <strong><MdText text={inhalt.texte.dauerhaftenBeherrschungDerBaustoffverfor} /></strong> ab: 
            Kriechen und Schwinden des Betons sowie die molekulare Relaxation des Spannstahls führen über die Lebensdauer 
            zu unvermeidlichen Spannkraftverlusten: zeitabhängig typisch <strong><MdText text={inhalt.texte.t10Bis20Von} /></strong>, insgesamt inkl. Reibung und Schlupf <strong><MdText text={inhalt.texte.t20Bis30Der} /></strong>.
          </p>
        </div>

      </div>

      {/* Reiter: 7 Bereiche (AP 3.8) */}
      <ModuleTabs
        label={inhalt.werte.baustoffkennwerteImSpannbetonbauBereiche}
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
                <Layers className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.t4ElastischeStauchungDes} /></h4>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.sofortverlustBeimSpannenT} /></span>
            </div>

            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
              <p><MdText text={inhalt.texte.wennDieSpannpresseDie} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bauweisen-Vergleich */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800"><MdText text={inhalt.texte.vergleichNachVorspannverfahren} /></h5>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.aSpannbettverfahrenSofortigerVerbund} /></strong><MdText text={inhalt.texte.spannstähleWerdenImWiderlager} /><div className="mt-1 font-mono text-blue-700 font-bold"><MdText text={inhalt.texte.deltasigmaPElFrac} /></div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.bNachträglicherVerbundMehrere} /></strong><MdText text={inhalt.texte.dieSpanngliederWerdenSukzessive} /><div className="mt-1 font-mono text-blue-700 font-bold">
                      <InlineMath math="\Delta\sigma_{p,el} = j \cdot \frac{E_p}{E_{cm}(t_0)} \cdot \sigma_{c},\quad j = \frac{n-1}{2n}\;(\text{EC2 Gl. 5.44; } n = \text{Anzahl nacheinander gespannter, gleicher Spannglieder})" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reife & E-Modul Entwicklung */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800"><MdText text={inhalt.texte.einflussDerBetonreifeBeim} /></h5>
                <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.weilDerBetonZum} /></p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-xs space-y-1.5">
                  <div className="text-slate-500 text-[10px]"><MdText text={inhalt.texte.festigkeitsverlaufNachEc2Kap} /></div>
                  <div className="text-shiraz font-bold">
                    <InlineMath math="f_{cm}(t) = \beta_{cc}(t) \cdot f_{cm},\; f_{ck}(t) = f_{cm}(t) - 8\,\text{MPa}" />
                  </div>
                  <div className="text-slate-500 text-[10px] pt-1 border-t border-slate-100"><MdText text={inhalt.texte.zugehörigerEModul} /></div>
                  <div className="text-blue-700 font-bold">
                    <InlineMath math="E_{cm}(t) = E_{cm} \cdot \left(\frac{f_{cm}(t)}{f_{cm}}\right)^{0{,}3}" />
                  </div>
                </div>
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900"><MdText text={inhalt.texte.planerTippEinJunger} /></div>
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
                <Scale className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.t5DieEurocode2} /></h4>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.dinEn19921} /></span>
            </div>

            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed space-y-2">
              <p><MdText text={inhalt.texte.warumDarfManDie} /></p>
              <p className="text-xs">
                In der Realität beeinflussen sich Kriechen, Schwinden und Relaxation wechselseitig: 
                Das Kriechen und Schwinden des Betons verkürzt den Träger und entspannt dadurch das Spannglied. Durch die 
                <strong><MdText text={inhalt.texte.sinkendeStahlspannung} /></strong> nimmt jedoch die treibende Triebkraft für die molekulare Stahlrelaxation massiv ab. 
                Umgekehrt führt der Relaxationsabfall zu einer Verringerung der Druckspannung im Beton, was wiederum das Kriechen dämpft.
              </p>
            </div>

            {/* Große Formel-Box */}
            <div className="bg-white text-text-main p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
              <div className="text-xs font-mono text-text-main/70 uppercase tracking-wider flex justify-between items-center">
                <span className="font-semibold"><MdText text={inhalt.texte.normativeFormelFürZeitabhängige} /></span>
                <span className="text-shiraz font-bold bg-shiraz/5 border border-shiraz/20 px-2 py-0.5 rounded"><MdText text={inhalt.texte.dinEn199212} /></span>
              </div>
              <div className="py-4 px-4 bg-white rounded-xl border border-home-grau/20 text-center overflow-x-auto text-text-main">
                <BlockMath math="\Delta\sigma_{p,c+s+r} = \frac{\varepsilon_{cs} \cdot E_p + 0{,}8 \cdot \Delta\sigma_{pr} + \frac{E_p}{E_{cm}} \cdot \varphi(t, t_0) \cdot \sigma_{c,QP}}{1 + \frac{E_p}{E_{cm}} \cdot \frac{A_p}{A_c} \cdot \left(1 + \frac{A_c \cdot e_p^2}{I_c}\right) \cdot \left(1 + 0{,}8 \cdot \varphi(t, t_0)\right)}" />
              </div>
            </div>

            {/* Formel-Aufschlüsselung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /><MdText text={inhalt.texte.derZählerDieAntreibenden} /></h5>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <strong className="text-blue-700 block"><MdText text={inhalt.texte.t1SchwindAnteilVarepsilon} /></strong><MdText text={inhalt.texte.direkteSpannungsabnahmeDurchBetonverkürz} /></div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <strong className="text-amber-700 block"><MdText text={inhalt.texte.t2KriechAnteilVarphi} /></strong><MdText text={inhalt.texte.spannungsabnahmeDurchDasDauerlast} /></div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <strong className="text-purple-700 block"><MdText text={inhalt.texte.t3GedämpfteRelaxation0} /></strong><MdText text={inhalt.texte.faktor08Berücksichtigt} /></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-amber-600" /><MdText text={inhalt.texte.derNennerDerDämpfende} /></h5>
                <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.derNennerIstStets} /></p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5">
                  <li><MdText text={inhalt.texte.derQuerschnittDurchDie} /></li>
                  <li><MdText text={inhalt.texte.dieExzentrizitätEP} /></li>
                  <li><MdText text={inhalt.texte.dasKriechen10} /></li>
                </ul>
                <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-[11px] text-emerald-900 font-medium"><MdText text={inhalt.texte.ohneDiesenNennerWürde} /></div>
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
                <Compass className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.t6MechanischeSofortverlusteReibung} /></h4>
              <span className="text-xs font-mono font-bold bg-zinc-100 text-zinc-800 border border-zinc-300 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.nurBeiNachträglichemVerbund} /></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reibung */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h5 className="font-bold text-sm text-slate-900"><MdText text={inhalt.texte.reibungsverlusteImHüllrohr} /></h5>
                  <span className="text-[10px] font-mono bg-zinc-200 px-2 py-0.5 rounded"><MdText text={inhalt.texte.ec2Gl545} /></span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.beimSpannenReibtDer} /></p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-xs">
                  <BlockMath math="\Delta P_\mu(x) = P_0 \cdot \left(1 - e^{-\mu \cdot (\theta + k \cdot x)}\right)" />
                </div>
                <div className="text-xs space-y-1 text-slate-600">
                  <div><MdText text={inhalt.texte.reibungsbeiwertDimensionslosLitzeIm} /></div>
                  <div><MdText text={inhalt.texte.umlenkwinkelSummeDerPlanmäßigen} /></div>
                  <div><MdText text={inhalt.texte.kWobbleBeiwertUngewollte} /></div>
                </div>
              </div>

              {/* Keilschlupf */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h5 className="font-bold text-sm text-slate-900"><MdText text={inhalt.texte.verankerungsschlupfKeileinzug} /></h5>
                  <span className="text-[10px] font-mono bg-zinc-200 px-2 py-0.5 rounded">w ≈ 4–8 mm</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.wirdDieHydraulischeSpannpresse} /></p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-xs">
                  <BlockMath math="l_{set} = \sqrt{\frac{w \cdot E_p \cdot A_p}{p}}, \qquad \Delta P_{Anker} = 2 \cdot p \cdot l_{set}" />
                </div>
                <p className="text-xs text-slate-600"><MdText text={inhalt.texte.dieserKeilschlupfWFührt} /></p>
              </div>
            </div>

            {/* Didaktische Box: Schätzwerte vs. Rechenwerte für Reibung & Keilschlupf */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <h5 className="font-bold text-xs text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                  <Scale className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.größenordnungenDerReibungsSchlupfbeiwert} /></h5>
                <span className="text-[11px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300"><MdText text={inhalt.texte.dinEn199213} /></span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-800 leading-relaxed">
                <div className="space-y-2">
                  <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span><MdText text={inhalt.texte.praxisSchätzwerteVordimensionierung} /></div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px]">
                    <li><MdText text={inhalt.texte.reibungsbeiwertStandardStahlblechhüllroh} /></li>
                    <li><MdText text={inhalt.texte.ungewollterKnickbeiwertKK} /></li>
                    <li><MdText text={inhalt.texte.keilschlupfSetzmaßWBzw} /></li>
                    <li><MdText text={inhalt.texte.faustregelFürMechanischeVerluste} /></li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span><MdText text={inhalt.texte.normativeRechenwerteVerlegekriterienEc2} /></div>
                  <div className="bg-white/80 p-2 rounded border border-blue-200 font-mono text-[11px] text-blue-950 overflow-x-auto text-center"><MdText text={inhalt.texte.pXP0} /></div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-blue-950/90">
                    <li><MdText text={inhalt.texte.mu019Text} /></li>
                    <li><MdText text={inhalt.texte.k0005Dots} /></li>
                    <li><MdText text={inhalt.texte.schlupfeinflusslängeLSetSqrt} /></li>
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
