import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { RelatedModules } from '@/src/components/ui/RelatedModules';
import { Line } from 'react-chartjs-2';
import { InlineMath, BlockMath } from 'react-katex';
import SpannbetonKennwerte from './spannbeton/SpannbetonKennwerte';
import SpannbetonDauerhaftigkeit from './spannbeton/SpannbetonDauerhaftigkeit';
import SpannbetonPrinzipien from './spannbeton/SpannbetonPrinzipien';
import SpannbetonNullBisHundert from './spannbeton/SpannbetonNullBisHundert';
import { fckT, creep, shrinkage, relaxation, frictionSlip, timeDependentLoss, CONCRETE, type RelaxationClass } from '@/src/utils/ec2Spannbeton';
import {
  Settings,
  Activity,
  Sparkles,
  Clock,
  Gauge,
  Thermometer,
  ShieldAlert,
  ShieldCheck,
  Database,
  Layers,
  ArrowBigRight,
  Info,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Compass,
  GraduationCap
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ConcreteData {
  fck: number;      // charakteristische Zylinderdruckfestigkeit (N/mm²)
  fck_cube: number; // charakteristische Würfeldruckfestigkeit (N/mm²)
  fctm: number;     // mittlere axiale Zugfestigkeit (N/mm²)
  Ecm: number;      // Elastizitätsmodul (N/mm²)
}

// Betonkennwerte aus DIN EN 1992-1-1, Tab. 3.1 (zentral in ec2Spannbeton.ts gepflegt); Spannbeton ab C30/37
const CONCRETE_CLASSES: Record<string, ConcreteData & { label: string }> = Object.fromEntries(
  Object.values(CONCRETE)
    .filter(c => c.fck >= 30)
    .map(c => [c.id, { fck: c.fck, fck_cube: c.fck_cube, fctm: c.fctm, Ecm: c.Ecm, label: c.name }])
);

interface SteelData {
  fpk: number;    // charakteristische Zugfestigkeit (N/mm²)
  fp01k: number;  // charakteristische 0.1%-Dehngrenze (N/mm²)
  Ep: number;     // Elastizitätsmodul des Spannstahls (N/mm²)
}

const STEEL_GRADES: Record<string, SteelData> = {
  'Y1770': { fpk: 1770, fp01k: 1520, Ep: 195000 },
  'Y1860': { fpk: 1860, fp01k: 1600, Ep: 195000 },
};

export default function Spannbeton() {
  // Geometric & Force States
  const [p0, setP0] = useState(3200); // kN (Nenn-Vorspannkraft)
  const [h, setH] = useState(1000); // mm
  const [b, setB] = useState(400); // mm
  const [ep, setEp] = useState(350); // mm (Exzentrizität nach unten positiv)
  const [mG1, setMG1] = useState<number>(780); // kNm (Eigengewicht, wirkt ab Spannzeitpunkt t0)
  const [mPerm, setMPerm] = useState<number>(1100); // kNm (Quasi-ständig: g1 + g2 + ψ2·q)
  const [mChar, setMChar] = useState<number>(1400); // kNm (Charakteristisch / selten: g + q)

  // Material selection states
  const [concreteClass, setConcreteClass] = useState<string>('C45/55');
  const [steelGrade, setSteelGrade] = useState<string>('Y1860');
  const [relaxationClass, setRelaxationClass] = useState<number>(2); // Class 2: sehr niedrig
  const [environmentRH, setEnvironmentRH] = useState<number>(50); // 50% = Innenraum/trocken, 80% = Außenklima/feucht
  const [timeState, setTimeState] = useState<'short_term' | 'long_term'>('short_term'); // t=0 vs t=inf
  const [lossTab, setLossTab] = useState<'overview' | 'calculations'>('overview');
  const [mainTab, setMainTab] = useState<'null_bis_hundert' | 'grundprinzipien' | 'kennwerte' | 'rechner' | 'dauerhaftigkeit'>('null_bis_hundert');

  // Advanced material-relevant components for professional prestressed concrete calculation
  const [cementType, setCementType] = useState<'R' | 'N' | 'S'>('R'); // R: schnell, N: normal, S: langsam erhärtend
  const [concreteAge, setConcreteAge] = useState<number>(7); // t_0 in Tagen beim Spannen
  const [tendonSystem, setTendonSystem] = useState<'bonded' | 'unbonded' | 'pretensioning'>('bonded');
  const [frictionCoeff, setFrictionCoeff] = useState<number>(0.20); // mu (Stahl in Stahlhüllrohr = 0.20)
  const [wobbleCoeff, setWobbleCoeff] = useState<number>(0.005); // k in rad/m 
  const [spanLength, setSpanLength] = useState<number>(25); // m (Gesamtlänge des Trägers)
  const [totalCurvature, setTotalCurvature] = useState<number>(0.15); // theta in rad
  const [anchorSlip, setAnchorSlip] = useState<number>(4); // w in mm (Standard Keilschlupf)
  const [nTendons, setNTendons] = useState<number>(4); // Anzahl nacheinander gespannter Spannglieder

  const materialResults = useMemo(() => {
    const conc = CONCRETE_CLASSES[concreteClass] || CONCRETE_CLASSES['C40/50'];
    const steel = STEEL_GRADES[steelGrade] || STEEL_GRADES['Y1860'];

    // 1. Querschnittsanalyse
    const ac = b * h; // mm²
    const ic = (b * Math.pow(h, 3)) / 12; // mm⁴
    const wTop = ic / (h / 2); // mm³
    const wBot = ic / (h / 2); // mm³

    // 2. Betonreife zum Zeitpunkt des Spannens t_0 (Maturity Calculation according to EC2)
    // Festigkeitsverlauf nach DIN EN 1992-1-1, Kap. 3.1.2(5) mit fckT()
    const sMap = { R: 0.20, N: 0.25, S: 0.38 };
    const s = sMap[cementType];
    const betaCc = Math.exp(s * (1 - Math.sqrt(28 / concreteAge)));
    const fck_t0 = fckT(conc.fck, concreteAge, cementType); // fcm(t) - 8 nach EC2 3.1.2(5)

    // E-Modul-Entwicklung im Alter t_0 nach EC2: Ecm(t_0) = (fcm(t_0)/fcm)^0.3 * Ecm
    const fcm = conc.fck + 8;
    const fcm_t0 = fck_t0 + 8;
    const Ecm_t0 = Math.max(15000, Math.pow(fcm_t0 / fcm, 0.3) * conc.Ecm);

    // 3. Spannstahlfläche Ap aus der Pressenkraft P0 bei σ_p,max = min(0,80·f_pk; 0,90·f_p0,1k)
    //    (DIN EN 1992-1-1/NA, 5.10.2.1) – Nachweis σ_pm0 ≤ min(0,75·f_pk; 0,85·f_p0,1k) siehe unten
    const sigmaPmax = Math.min(0.80 * steel.fpk, 0.90 * steel.fp01k);
    const sigmaP0 = sigmaPmax; // Bezugsspannung an der Presse für alle %-Angaben
    const ap = (p0 * 1000) / sigmaP0; // mm²

    // Nachweisschnitt: Feldmitte x = L/2 (bei einseitigem Spannen ungünstigster Feldquerschnitt)
    const xSection = spanLength / 2;

    // 4. Reibung + Keilschlupf nach EC2 5.10.5.2/5.10.5.3 (nur Spannglieder mit nachträglichem Verbund / ohne Verbund)
    const isPost = tendonSystem !== 'pretensioning';
    const fs = isPost
      ? frictionSlip(p0, ap, steel.Ep, frictionCoeff, totalCurvature, wobbleCoeff, spanLength, anchorSlip, xSection)
      : null;
    const frictionLossPct = fs ? fs.lossPctFriction : 0;
    const slipLossPct = fs ? fs.lossPctSlip : 0;
    const deltaSigmaSlip = fs ? fs.delta_sigma_slip : 0;
    const lSet = fs ? fs.l_set : 0;

    const immediateTendonLossPct = frictionLossPct + slipLossPct;
    const p0_after_immediate = p0 * (1 - immediateTendonLossPct / 100);

    // Betonspannung in Spanngliedhöhe beim Spannen (P + Eigengewicht g1), Druck positiv
    const sigmaCp0 = Math.max(0,
      (p0_after_immediate * 1000) / ac + ((p0_after_immediate * 1000) * Math.pow(ep, 2)) / ic - (mG1 * 1e6 * ep) / ic);

    // 5. Elastische Verkürzung (EC2 5.10.5.1):
    //    Spannbett: alle Litzen gleichzeitig → j = 1; nachträglich, n Spannglieder nacheinander → j = (n−1)/(2n)
    const deltaSigmaP_el_full = steel.Ep * (sigmaCp0 / Ecm_t0);
    const factorEl = tendonSystem === 'pretensioning' ? 1.0 : (nTendons <= 1 ? 0 : (nTendons - 1) / (2 * nTendons));
    const deltaSigmaP_el = deltaSigmaP_el_full * factorEl;
    const elasticLossPct = (deltaSigmaP_el / sigmaP0) * 100;

    const totalImmediateLossPct = immediateTendonLossPct + elasticLossPct;
    const pm0 = p0 * (1 - totalImmediateLossPct / 100);
    const sigmaPm0 = (pm0 * 1000) / ap;

    // 6. Zeitabhängige Verluste nach EC2 5.10.6, Gl. (5.46)
    //    φ(∞,t0) und ε_cs(∞) nach Anhang B / 3.1.4 mit h0 = 2·Ac/u (Rechteck, u = 2·(b+h))
    const h0 = (2 * ac) / (2 * (b + h));
    const phi = creep(conc.fck, concreteAge, cementType, h0, environmentRH);
    const shr = shrinkage(conc.fck, cementType, h0, environmentRH);
    const epsCs = shr.eps_cs * 1e-3; // m/m

    // Relaxation Gl. (3.28)–(3.30) für t = 500 000 h (≈ 57 Jahre), Ausgangsspannung σ_pm0
    const relax = relaxation(sigmaPm0, steel.fpk, relaxationClass as RelaxationClass, 500000);
    const deltaSigmaPr = relax.delta_sigma_pr;
    const rho1000 = relaxationClass === 1 ? 0.08 : relaxationClass === 2 ? 0.025 : 0.04;

    // Betonspannung in Spanngliedhöhe unter quasi-ständiger Last (P_m0 + M_perm), Druck positiv
    const sigmaCQP = Math.max(0,
      (pm0 * 1000) / ac + ((pm0 * 1000) * Math.pow(ep, 2)) / ic - (mPerm * 1e6 * ep) / ic);

    const alphaP_lt = steel.Ep / conc.Ecm;
    const tdl = timeDependentLoss(steel.Ep, conc.Ecm, ap, ac, ic, ep, phi, shr.eps_cs, deltaSigmaPr, sigmaCQP);
    const numerator = tdl.numerator;
    const denominator = tdl.denominator;
    const deltaSigmaP_csr = tdl.delta_sigma_p_csr;
    const lossCsrPct = (deltaSigmaP_csr / sigmaP0) * 100;

    // Gesamte Verluste (keine künstliche Kappe – unplausible Eingaben werden als Warnung angezeigt)
    const totalLossPct = totalImmediateLossPct + lossCsrPct;
    const csrLossPct = lossCsrPct;
    const isLossHigh = totalLossPct > 35;
    const isPm0Ok = sigmaPm0 <= Math.min(0.75 * steel.fpk, 0.85 * steel.fp01k);

    // Effektive Spannkräfte
    const pEff0 = p0 * (1 - totalImmediateLossPct / 100); // Nach allen Sofortverlusten (t = t0)
    const pEffInf = p0 * (1 - totalLossPct / 100);  // Langzeit nach allen Verlusten (t = ∞)

    // 1. Spannzeitpunkt t0 (Transfer): Kombination P_m0 + M_g1
    const mP0 = -(pEff0 * 1000) * ep; // Nmm
    const mG1Nmm = mG1 * 1e6; // Nmm
    const sigmaN_t0 = -(pEff0 * 1000) / ac;
    const sigmaMPTop_t0 = (mP0 * (-h / 2)) / ic; // Zug oben (+)
    const sigmaMPBot_t0 = (mP0 * (h / 2)) / ic;  // Druck unten (-)
    const sigmaMG1Top = (mG1Nmm * (-h / 2)) / ic; // Druck oben (-)
    const sigmaMG1Bot = (mG1Nmm * (h / 2)) / ic;  // Zug unten (+)
    const sigmaTotalTop_t0 = sigmaN_t0 + sigmaMPTop_t0 + sigmaMG1Top;
    const sigmaTotalBot_t0 = sigmaN_t0 + sigmaMPBot_t0 + sigmaMG1Bot;
    const maxCompStress_t0 = Math.max(Math.abs(sigmaTotalTop_t0), Math.abs(sigmaTotalBot_t0));
    const permCompStress_t0 = 0.60 * fck_t0; // EC2 5.10.2.2: 0.60 * f_ck(t0)
    const isTransferStressOk = maxCompStress_t0 <= permCompStress_t0;

    // 2. Charakteristische Kombination (Endzustand t = ∞): Kombination P_m∞ + M_char
    const mPinf = -(pEffInf * 1000) * ep; // Nmm
    const mCharNmm = mChar * 1e6; // Nmm
    const sigmaN_inf = -(pEffInf * 1000) / ac;
    const sigmaMPTop_inf = (mPinf * (-h / 2)) / ic;
    const sigmaMPBot_inf = (mPinf * (h / 2)) / ic;
    const sigmaMCharTop = (mCharNmm * (-h / 2)) / ic;
    const sigmaMCharBot = (mCharNmm * (h / 2)) / ic;
    const sigmaTotalTop_char = sigmaN_inf + sigmaMPTop_inf + sigmaMCharTop;
    const sigmaTotalBot_char = sigmaN_inf + sigmaMPBot_inf + sigmaMCharBot;
    const maxCompStress_char = Math.max(Math.abs(sigmaTotalTop_char), Math.abs(sigmaTotalBot_char));
    const permCompStressRare = 0.60 * conc.fck; // EC2 7.2: 0.60 * f_ck
    const isRareStressOk = maxCompStress_char <= permCompStressRare;

    // 3. Quasi-ständige Kombination (Endzustand t = ∞): Kombination P_m∞ + M_perm
    const mPermNmm = mPerm * 1e6; // Nmm
    const sigmaMPermTop = (mPermNmm * (-h / 2)) / ic;
    const sigmaMPermBot = (mPermNmm * (h / 2)) / ic;
    const sigmaTotalTop_perm = sigmaN_inf + sigmaMPTop_inf + sigmaMPermTop;
    const sigmaTotalBot_perm = sigmaN_inf + sigmaMPBot_inf + sigmaMPermBot;
    const maxCompStress_perm = Math.max(Math.abs(sigmaTotalTop_perm), Math.abs(sigmaTotalBot_perm));
    const permCompStressQuasi = 0.45 * conc.fck; // EC2 7.2: 0.45 * f_ck (lineares Kriechen)
    const isQuasiStressOk = maxCompStress_perm <= permCompStressQuasi;

    // 4. Dekompressionsnachweis nach EC2 (Betonspannung in Spanngliedhöhe ± Bereich nach EC2 Tab. 7.1N):
    // Unter quasi-ständiger Einwirkung in Spanngliedzone z = ep + 25mm (bis max h/2):
    const zTendonZone = Math.min(h / 2, ep + 25);
    const sigmaTendonZone_perm = sigmaN_inf + ((mPinf + mPermNmm) * zTendonZone) / ic;
    const sigmaTendonLevel_perm = sigmaN_inf + ((mPinf + mPermNmm) * ep) / ic;
    const isDecompressed = sigmaTendonZone_perm <= 0;

    // 5. Spannstahlspannungen
    const sigmaP_max_transfer = Math.min(0.75 * steel.fpk, 0.85 * steel.fp01k);
    const sigmaP_inf = (pEffInf * 1000) / ap;
    const sigmaP_perm_char = 0.75 * steel.fpk;
    const sigmaP_perm_quasi = 0.65 * steel.fpk;
    const isSteelStressOk = sigmaP_inf <= sigmaP_perm_quasi;
    const isSteelCharStressOk = sigmaP_inf <= sigmaP_perm_char;

    // Aktive Werte für Diagramm und Randfaserkarten
    const isShortTerm = timeState === 'short_term';
    const pEff = isShortTerm ? pEff0 : pEffInf;
    const sigmaN = isShortTerm ? sigmaN_t0 : sigmaN_inf;
    const sigmaMPTop = isShortTerm ? sigmaMPTop_t0 : sigmaMPTop_inf;
    const sigmaMPBot = isShortTerm ? sigmaMPBot_t0 : sigmaMPBot_inf;
    const sigmaMEdTop = isShortTerm ? sigmaMG1Top : sigmaMCharTop;
    const sigmaMEdBot = isShortTerm ? sigmaMG1Bot : sigmaMCharBot;
    const sigmaTotalTop = isShortTerm ? sigmaTotalTop_t0 : sigmaTotalTop_char;
    const sigmaTotalBot = isShortTerm ? sigmaTotalBot_t0 : sigmaTotalBot_char;

    // Warnflaggen
    const isOvercompressedTransfer = !isTransferStressOk;
    const isCrackedTop = sigmaTotalTop > conc.fctm;
    const isCrackedBot = sigmaTotalBot_char > conc.fctm; // Unter Vollast Zustand II

    return {
      ac, ic, wTop, wBot, ap, sigmaP0,
      sigmaCp0, phi, epsCs, rho1000,
      elasticLossPct, csrLossPct, totalLossPct,
      pEff0, pEffInf, pEff,
      sigmaN, sigmaMPTop, sigmaMPBot, sigmaMEdTop, sigmaMEdBot,
      sigmaTotalTop, sigmaTotalBot,
      sigmaTotalTop_t0, sigmaTotalBot_t0,
      sigmaTotalTop_char, sigmaTotalBot_char,
      sigmaTotalTop_perm, sigmaTotalBot_perm,
      maxCompStress_t0, maxCompStress_char, maxCompStress_perm,
      permCompStress_t0, permCompStressRare, permCompStressQuasi,
      isTransferStressOk, isRareStressOk, isQuasiStressOk,
      sigmaP_max_transfer, sigmaP_inf, sigmaP_perm_char, sigmaP_perm_quasi,
      isSteelStressOk, isSteelCharStressOk,
      sigmaTendonZone_perm, sigmaTendonLevel_perm, isDecompressed,
      isOvercompressedTransfer, isCrackedTop, isCrackedBot,
      deltaSigmaP_el, deltaSigmaPr, deltaSigmaP_csr, alphaP_lt,
      // Neue Parameter exposen für UI:
      cementType, concreteAge, betaCc, fck_t0, Ecm_t0, 
      tendonSystem, frictionCoeff, wobbleCoeff, spanLength, totalCurvature, anchorSlip,
      frictionLossPct, slipLossPct, deltaSigmaSlip, totalImmediateLossPct, immediateTendonLossPct,
      sigmaPmax, sigmaPm0, pm0, h0, lSet, xSection, sigmaCQP, numerator, denominator, factorEl,
      isLossHigh, isPm0Ok, nTendons, epsCsPermille: shr.eps_cs,
      lossCsPct: ((tdl.lossShrinkage + tdl.lossCreep) / sigmaP0) * 100,
      lossRPct: (tdl.lossRelaxation / sigmaP0) * 100,
      conc, steel,
      mG1, mPerm, mChar
    };
  }, [
    p0, h, b, ep, mG1, mPerm, mChar, concreteClass, steelGrade, relaxationClass, environmentRH, timeState,
    cementType, concreteAge, tendonSystem, frictionCoeff, wobbleCoeff, spanLength, totalCurvature, anchorSlip, nTendons
  ]);

  // Diagramm-Daten präparieren
  const chartData = useMemo(() => {
    const { sigmaN, sigmaMPTop, sigmaMPBot, sigmaMEdTop, sigmaMEdBot, sigmaTotalTop, sigmaTotalBot } = materialResults;
    
    // Spannungsverläufe an den markanten Punkten: Oben (-h/2), Schwerpunkt (0), Unten (h/2)
    const heightLabels = ['Oben (-h/2)', 'Achse (0)', 'Unten (+h/2)'];
    
    return {
      labels: heightLabels,
      datasets: [
        {
          label: 'Vorspannung (N-Anteil)',
          data: [sigmaN, sigmaN, sigmaN],
          borderColor: '#94a3b8',
          borderDash: [5, 5],
          borderWidth: 1.5,
          tension: 0,
          pointRadius: 4,
        },
        {
          label: 'Vorspannmoment (M_p-Anteil)',
          data: [sigmaMPTop, 0, sigmaMPBot],
          borderColor: '#475569',
          borderDash: [3, 3],
          borderWidth: 1.5,
          tension: 0,
          pointRadius: 4,
        },
        {
          label: timeState === 'short_term' ? 'Eigengewicht (M_g1-Anteil)' : 'Charakteristische Last (M_char-Anteil)',
          data: [sigmaMEdTop, 0, sigmaMEdBot],
          borderColor: '#64748b',
          borderDash: [3, 3],
          borderWidth: 2,
          tension: 0,
          pointRadius: 4,
        },
        {
          label: 'Gesamtspannung (Total)',
          data: [sigmaTotalTop, sigmaN, sigmaTotalBot],
          borderColor: '#A3113E', // Shiraz/Red Accent
          backgroundColor: 'rgba(139, 26, 79, 0.08)',
          borderWidth: 3,
          tension: 0,
          pointRadius: 6,
          fill: true
        }
      ]
    };
  }, [materialResults]);

  return (
    <div className="space-y-8">
      {/* Intro Header & Tabs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz h-5 w-5" />
          Spannbeton: Bemessung, Baustoffkennwerte &amp; Vorspannungsverluste
        </h2>
        <div className="mt-3 text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p>
            Die Vorspannung beaufschlagt den Betonquerschnitt mit einer künstlichen Druckkraft. Dadurch werden die materialspezifisch 
            schwachen <strong>Beton-Zugspannungen</strong> aus äußeren Einwirkungen gezielt überdrückt. Dieses Modul verbindet mechanische 
            Schnittgrößen-Überlagerungen mit normkonformen Materialkennwerten von hochfestem Beton und hochelastischem Spannstahl 
            inklusive zeitabhängiger Vorspannungsverluste (Kriechen, Schwinden und Stahlrelaxation).
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-1 border-b border-home-grau/20 mt-6">
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              mainTab === 'null_bis_hundert' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('null_bis_hundert')}
          >
            <GraduationCap size={16} /> 0-100
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              mainTab === 'grundprinzipien' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('grundprinzipien')}
          >
            <Compass size={16} /> Grundprinzipien
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              mainTab === 'kennwerte' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('kennwerte')}
          >
            <BookOpen size={16} /> Baustoffkennwerte (Kriechen, Schwinden, Relaxation)
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              mainTab === 'rechner' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('rechner')}
          >
            <Activity size={16} /> Querschnitts-Rechner &amp; Spannungsverlauf
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              mainTab === 'dauerhaftigkeit' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('dauerhaftigkeit')}
          >
            <ShieldCheck size={16} /> Dauerhaftigkeit &amp; Korrosionsschutz
          </button>
        </div>
      </div>

      {/* 0. TAB: 0-100 VORLESUNGS-LEITFADEN */}
      {mainTab === 'null_bis_hundert' && (
        <div className="animate-in fade-in duration-300">
          <SpannbetonNullBisHundert onNavigateTab={(tab) => setMainTab(tab)} />
        </div>
      )}

      {/* 1. TAB: GRUNDPRINZIPIEN & TRAGWERKSTHEORIE */}
      {mainTab === 'grundprinzipien' && (
        <div className="animate-in fade-in duration-300">
          <SpannbetonPrinzipien />
        </div>
      )}

      {/* 2. TAB: BAUSTOFFKENNWERTE */}
      {mainTab === 'kennwerte' && (
        <div className="animate-in fade-in duration-300">
          <SpannbetonKennwerte />
        </div>
      )}

      {mainTab === 'rechner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
        {/* Left Input Settings - Span 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Geometry & External Loading */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-shiraz uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/10 pb-2">
              <Settings className="h-4 w-4" />
              1. Querschnitt & Einwirkung
            </h3>
            
            <Slider
              label="Querschnittshöhe (h)"
              value={h}
              min={300}
              max={2500}
              step={50}
              onChange={(e) => setH(Number(e.target.value))}
              unit="mm"
            />
            <Slider
              label="Querschnittsbreite (b)"
              value={b}
              min={150}
              max={1500}
              step={50}
              onChange={(e) => setB(Number(e.target.value))}
              unit="mm"
            />
            <Slider
              label={<FormulaText text="Pressenkraft (P_0)" />}
              value={p0}
              min={500}
              max={12000}
              step={100}
              onChange={(e) => setP0(Number(e.target.value))}
              unit="kN"
            />
            <p className="text-[10px] text-zinc-500 -mt-1">
              Pressenkraft bei σ_p,max = {formatDeZahl(materialResults.sigmaPmax, 0)} N/mm² → A_p = {formatDeZahl(materialResults.ap, 0)} mm² ≈ {formatDeZahl((materialResults.ap / 150), 1)} Litzen 0,6″ (150 mm²)
            </p>
            <Slider
              label={<FormulaText text="Exzentrizität (e_p) nach unten" />}
              value={ep}
              min={0}
              max={Math.floor(h / 2 - 60)} // Mindesteisenüberdeckung anrechnen
              step={10}
              onChange={(e) => setEp(Number(e.target.value))}
              unit="mm"
            />
            <div className="pt-2 border-t border-home-grau/15 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Einwirkungen nach Bemessungssituation (EC2):
              </span>
              <Slider
                label={<FormulaText text="M_{g1} (Eigengewicht ab t_0)" />}
                value={mG1}
                min={0}
                max={3000}
                step={25}
                onChange={(e) => setMG1(Number(e.target.value))}
                unit="kNm"
              />
              <Slider
                label={<FormulaText text="M_{perm} (quasi-ständig: g_1+g_2+\psi_2 q)" />}
                value={mPerm}
                min={0}
                max={6000}
                step={50}
                onChange={(e) => setMPerm(Number(e.target.value))}
                unit="kNm"
              />
              <Slider
                label={<FormulaText text="M_{char} (charakteristisch / selten: g+q)" />}
                value={mChar}
                min={0}
                max={10000}
                step={50}
                onChange={(e) => setMChar(Number(e.target.value))}
                unit="kNm"
              />
            </div>
          </div>

          {/* Card 2: Material Parameters Selector */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-shiraz uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/10 pb-2">
              <Database className="h-4 w-4" />
              2. Baustoffklassen &amp; Kennwerte
            </h3>

            {/* Concrete Class */}
            <div>
              <label className="block text-xs font-semibold text-text-main/75 mb-1.5 flex justify-between">
                <span>Betonfestigkeitsklasse (DIN EN 206)</span>
                <span className="text-shiraz font-mono font-bold">f_ck = {formatDeWert(materialResults.conc.fck)} MPa</span>
              </label>
              <select
                value={concreteClass}
                onChange={(e) => setConcreteClass(e.target.value)}
                className="w-full text-sm bg-off-white border border-home-grau/30 rounded-lg p-2.5 outline-none focus:border-shiraz text-text-main font-medium"
              >
                {Object.keys(CONCRETE_CLASSES).map(cls => (
                  <option key={cls} value={cls}>{CONCRETE_CLASSES[cls].label}</option>
                ))}
              </select>
            </div>

            {/* Concrete Maturity & Prestressing Age */}
            <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/15 space-y-3">
              <div className="text-[11px] font-bold text-text-main uppercase tracking-wider border-b border-zinc-205 pb-1 flex justify-between">
                <span>Betonreife beim Spannen (t₀)</span>
                <span className="text-shiraz text-[10px] font-bold">EC2 Kap. 3.1.2</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-text-main/70 mb-1">Zementklasse</label>
                  <select
                    value={cementType}
                    onChange={(e) => setCementType(e.target.value as any)}
                    className="w-full text-xs bg-white border border-home-grau/30 rounded p-1 outline-none text-text-main font-medium focus:ring-1 focus:ring-shiraz"
                  >
                    <option value="R">Klasse R (Schnell)</option>
                    <option value="N">Klasse N (Normal)</option>
                    <option value="S">Klasse S (Langsam)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-main/70 mb-1 flex justify-between">
                    <span>Alter t₀:</span>
                    <span className="text-shiraz font-mono">{formatDeWert(concreteAge)} d</span>
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={28}
                    step={1}
                    value={concreteAge}
                    onChange={(e) => setConcreteAge(Number(e.target.value))}
                    className="w-full accent-shiraz mt-1"
                  />
                </div>
              </div>
              <div className="text-[10px] text-zinc-650 space-y-0.5 font-mono pt-1 border-t border-dashed border-zinc-200">
                <div className="flex justify-between">
                  <span>Minderungsfaktor β_cc(t₀):</span>
                  <span className="font-bold">{formatDeZahl(materialResults.betaCc, 3)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Druckfestigkeit f_ck(t₀):</span>
                  <strong className="text-shiraz">{formatDeZahl(materialResults.fck_t0, 1)} N/mm²</strong>
                </div>
                <div className="flex justify-between">
                  <span>Moduliertes E_cm(t₀):</span>
                  <strong className="text-slate-800">{formatDeWert(Math.round(materialResults.Ecm_t0))} N/mm²</strong>
                </div>
              </div>
            </div>

            {/* Prestressing Steel Class */}
            <div>
              <label className="block text-xs font-semibold text-text-main/75 mb-1.5 flex justify-between">
                <span>Spannstahl-Güte (abZ des DIBt)</span>
                <span className="text-shiraz font-mono font-bold">f_pk = {formatDeWert(materialResults.steel.fpk)} MPa</span>
              </label>
              <select
                value={steelGrade}
                onChange={(e) => setSteelGrade(e.target.value)}
                className="w-full text-sm bg-off-white border border-home-grau/30 rounded-lg p-2.5 outline-none focus:border-shiraz text-text-main font-medium"
              >
                {Object.keys(STEEL_GRADES).map(grade => (
                  <option key={grade} value={grade}>{grade} (Litzenspannstahl)</option>
                ))}
              </select>
            </div>

            {/* Material Parameters Table */}
            <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/20 text-xs text-text-main/90 space-y-2 font-mono">
              <div className="font-bold text-text-main uppercase text-[10px] tracking-wider mb-1 block">Aktive Materialkoeffizienten:</div>
              <div className="flex justify-between border-b border-home-grau/10 pb-1">
                <span>Betonzugfestigkeit f_ctm:</span>
                <span className="font-bold text-shiraz">{formatDeZahl(materialResults.conc.fctm, 1)} N/mm²</span>
              </div>
              <div className="flex justify-between border-b border-home-grau/10 pb-1">
                <span>Beton E-Modul E_cm:</span>
                <span>{formatDeWert(materialResults.conc.Ecm)} N/mm²</span>
              </div>
              <div className="flex justify-between border-b border-home-grau/10 pb-1">
                <span>0,1%-Grenze Spannstahl f_p0.1k:</span>
                <span>{formatDeWert(materialResults.steel.fp01k)} N/mm²</span>
              </div>
              <div className="flex justify-between">
                <span>Zugehöriger E-Modul E_p:</span>
                <span>{formatDeWert(materialResults.steel.Ep)} N/mm²</span>
              </div>
            </div>
          </div>

          {/* Card 3: Boundary / Time & ENVIRONMENT */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-shiraz uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/10 pb-2">
              <Clock className="h-4 w-4" />
              3. Zeitstand & Umwelt (Verluste)
            </h3>

            {/* Time toggle */}
            <div>
              <label className="block text-xs font-semibold text-text-main/75 mb-1.5">Betrachteter Betriebszeitpunkt</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTimeState('short_term')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${timeState === 'short_term' ? 'bg-shiraz border-shiraz text-white shadow-sm' : 'bg-off-white border-home-grau/30 text-text-main hover:bg-home-grau/10'}`}
                >
                  Transfer (Kurzzeit t=0)
                </button>
                <button
                  type="button"
                  onClick={() => setTimeState('long_term')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${timeState === 'long_term' ? 'bg-shiraz border-shiraz text-white shadow-sm' : 'bg-off-white border-home-grau/30 text-text-main hover:bg-home-grau/10'}`}
                >
                  Gebrauchsphase (Langzeit t=∞)
                </button>
              </div>
            </div>

            {/* Environment Humidity */}
            <div>
              <label className="block text-xs font-semibold text-text-main/75 mb-1.5">Umfeld-Szenario / Luftfeuchte (RH)</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEnvironmentRH(50)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border transition ${environmentRH === 50 ? 'bg-zinc-800 border-zinc-800 text-white' : 'bg-off-white border-home-grau/30 text-text-main'}`}
                >
                  Trockenes Innenraum-Umfeld
                  <div className="text-[10px] opacity-80">RH = 50 % → φ = {formatDeZahl(creep(materialResults.conc.fck, concreteAge, cementType, materialResults.h0, 50), 2)}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setEnvironmentRH(80)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border transition ${environmentRH === 80 ? 'bg-zinc-800 border-zinc-800 text-white' : 'bg-off-white border-home-grau/30 text-text-main'}`}
                >
                  Feuchtes Außen-Umfeld
                  <div className="text-[10px] opacity-80">RH = 80 % → φ = {formatDeZahl(creep(materialResults.conc.fck, concreteAge, cementType, materialResults.h0, 80), 2)}</div>
                </button>
              </div>
            </div>

            {/* Relaxation Class */}
            <div>
              <label className="block text-xs font-semibold text-text-main/75 mb-1.5">Stahlrelaxationsklasse</label>
              <select
                value={relaxationClass}
                onChange={(e) => setRelaxationClass(Number(e.target.value))}
                className="w-full text-xs bg-off-white border border-home-grau/30 rounded-lg p-2.5 outline-none font-medium"
              >
                <option value={1}>Klasse 1 (normale Relaxation, Drähte/Litzen) ρ₁₀₀₀ = 8 %</option>
                <option value={2}>Klasse 2 (niedrige Relaxation, Standard-Litzen) ρ₁₀₀₀ = 2,5 %</option>
                <option value={3}>Klasse 3 (warmgewalzte/vergütete Stäbe) ρ₁₀₀₀ = 4 %</option>
              </select>
            </div>
          </div>

          {/* Card 4: Spanngliedsystem & Reibungsverluste */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-shiraz uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/10 pb-2">
              <Activity className="h-4 w-4 text-shiraz" />
              4. Spannglied- &amp; Reibungsverluste
            </h3>

            {/* Tendon System Select */}
            <div>
              <label className="block text-xs font-semibold text-text-main/75 mb-1.5 flex justify-between border-slate-100">
                <span>Spannglied-Verbundart</span>
              </label>
              <select
                value={tendonSystem}
                onChange={(e) => setTendonSystem(e.target.value as any)}
                className="w-full text-xs bg-off-white border border-home-grau/30 rounded-lg p-2.5 outline-none font-medium text-text-main"
              >
                <option value="bonded">Nachträglicher Verbund (bonded post-tensioned)</option>
                <option value="unbonded">Ohne Verbund (unbonded post-tensioned / Monolitzen)</option>
                <option value="pretensioning">Vorspannung im Spannbett (pre-tensioned)</option>
              </select>
            </div>

            {tendonSystem !== 'pretensioning' && (
              <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                {/* Trägerstützweite L */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Trägerstützweite (L):</span>
                    <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(spanLength)} m</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={spanLength}
                    onChange={(e) => setSpanLength(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                </div>

                {/* Reibungsbeiwert µ */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Reibungsbeiwert (µ) [EC2 Tab. 5.1]:</span>
                    <span className="font-mono text-xs font-bold text-shiraz">{formatDeZahl(frictionCoeff, 2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.30"
                    step="0.01"
                    value={frictionCoeff}
                    onChange={(e) => setFrictionCoeff(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="text-[10px] text-zinc-500 flex justify-between">
                    <span>0.05 Monolitze</span>
                    <span>0.13 Plastik</span>
                    <span>0,20-0.24 Metall</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-1">
                  {/* Ungewollte Umlenkung k */}
                  <div>
                    <label className="block text-[10px] font-bold text-text-main/70 mb-1 flex justify-between">
                      <span>Wobble k:</span>
                      <span className="font-mono text-shiraz">{formatDeZahl(wobbleCoeff, 4)}</span>
                    </label>
                    <input
                      type="range"
                      min="0.001"
                      max="0.012"
                      step="0.001"
                      value={wobbleCoeff}
                      onChange={(e) => setWobbleCoeff(Number(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                  </div>

                  {/* Umlenkwinkel theta */}
                  <div>
                    <label className="block text-[10px] font-bold text-text-main/70 mb-1 flex justify-between">
                      <span>Krümmung θ:</span>
                      <span className="font-mono text-shiraz">{formatDeZahl(totalCurvature, 2)} rad</span>
                    </label>
                    <input
                      type="range"
                      min="0.00"
                      max="1.00"
                      step="0.05"
                      value={totalCurvature}
                      onChange={(e) => setTotalCurvature(Number(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                  </div>
                </div>

                {/* Anzahl nacheinander gespannter Spannglieder n */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Anzahl nacheinander gespannter Spannglieder (n):</span>
                    <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(nTendons)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={nTendons}
                    onChange={(e) => setNTendons(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <p className="text-[10px] text-zinc-400 leading-normal">Elastische Verkürzung mit j = (n−1)/(2n); n = 1 → kein Verlust, da der Beton vor dem Verkeilen verkürzt ist.</p>
                </div>
              </div>
            )}

            {/* Keilschlupf Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Verankerungsschlupf (w) [Keilschlupf]:</span>
                <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(anchorSlip)} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={anchorSlip}
                onChange={(e) => setAnchorSlip(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <p className="text-[10px] text-zinc-400 leading-normal">
                {tendonSystem === 'pretensioning' 
                  ? 'Spannbett: Der Keilschlupf tritt an den Widerlagern vor dem Betonieren auf und wird durch Überspannen ausgeglichen – im Bauteil wird er daher nicht angesetzt.'
                  : 'Nachträglicher Verbund erleidet beim Loslassen der Presse ca. 4–6 mm Schlupf vor dem mechanischen Verkeilen. Maßgebend ist der Wert der Zulassung/ETA des Spannverfahrens.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Outputs & Visualization - Span 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card A: Chart of stresses */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-home-grau/10 pb-2">
              <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Gauge className="h-4 w-4 text-shiraz" />
                Druck- und Zugspannungsverlauf über die Höhe
              </h3>
              <span className="text-xs px-2.5 py-1 rounded bg-shiraz/5 text-shiraz font-bold font-mono">
                {timeState === 'short_term' ? 'Dauer: t = 0 (Transfer)' : 'Dauer: t = ∞ (Endzustand)'}
              </span>
            </div>

            <div className="h-80 relative">
              <Line 
                data={chartData} 
                options={{
                  indexAxis: 'y', // Horizontal bauchiges Diagramm
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      title: { display: true, text: 'Querschnittsspannung [MPa] (Druck -, Zug +)' },
                      grid: { color: (ctx) => ctx.tick.value === 0 ? '#A3113E' : '#e2e8f0', lineWidth: (ctx) => ctx.tick.value === 0 ? 2 : 1 }
                    },
                    y: {
                      reverse: true, // Oben ist h/2 negativ
                      title: { display: true, text: 'Relative Faser (h/2)' }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { boxWidth: 12, font: { size: 11 } }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${formatDeZahl(context.parsed.x, 2)} MPa`
                      }
                    }
                  }
                }} 
              />
            </div>

            {/* Quick state indicators */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className={`p-3 rounded-lg border ${materialResults.isCrackedTop ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                <div className="font-bold mb-1">Oberer Rand (h/2 = Oben)</div>
                <div className="text-sm font-semibold">{formatDeZahl(materialResults.sigmaTotalTop, 2)} MPa</div>
                <div className="text-[10px] mt-1 opacity-80">
                  {materialResults.isCrackedTop 
                    ? `Zuggrenze f_ctm (${formatDeZahl(materialResults.conc.fctm, 1)} MPa) überschritten! Risse zu erwarten.` 
                    : materialResults.sigmaTotalTop > 0 
                      ? `Beschränkte Zugspannung (f_ctm ungerissen).` 
                      : 'Komplett überdrückt (Zustand I).'}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${materialResults.isCrackedBot ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                <div className="font-bold mb-1">Unterer Rand (h/2 = Unten)</div>
                <div className="text-sm font-semibold">{formatDeZahl(materialResults.sigmaTotalBot, 2)} MPa</div>
                <div className="text-[10px] mt-1 opacity-80">
                  {materialResults.isCrackedBot 
                    ? `Zuggrenze f_ctm (${formatDeZahl(materialResults.conc.fctm, 1)} MPa) überschritten! Risse zu erwarten.` 
                    : materialResults.sigmaTotalBot > 0 
                      ? 'Beschränkte Zugspannung.' 
                      : 'Komplett überdrückt (Zustand I).'}
                </div>
              </div>
            </div>
          </div>

          {/* Card GZG: Spannungsbegrenzungen nach DIN EN 1992-1-1, 7.2 */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/10 pb-2">
              <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-shiraz" />
                Gebrauchstauglichkeit (GZG): Spannungsbegrenzungen (DIN EN 1992-1-1 Abs. 7.2)
              </h3>
              <span className="text-[11px] font-mono bg-slate-100 px-2.5 py-0.5 rounded text-slate-700 font-bold">
                DIN EN 1992-1-1, 7.2
              </span>
            </div>

            {/* 4 Status-Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className={`p-2.5 rounded-lg border ${materialResults.isTransferStressOk ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <div className="text-[10px] uppercase font-sans font-bold">1. Transfer t₀ (0,60 fck(t₀))</div>
                <div className="text-sm font-bold mt-0.5">{formatDeZahl(materialResults.maxCompStress_t0, 1)} / {formatDeZahl(materialResults.permCompStress_t0, 1)} MPa</div>
                <div className="text-[10px] mt-1 font-sans">{materialResults.isTransferStressOk ? '✓ Eingehalten' : '✗ Längsrissgefahr beim Spannen!'}</div>
              </div>

              <div className={`p-2.5 rounded-lg border ${materialResults.isRareStressOk ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <div className="text-[10px] uppercase font-sans font-bold">2. Seltene Last (0,60 fck)</div>
                <div className="text-sm font-bold mt-0.5">{formatDeZahl(materialResults.maxCompStress_char, 1)} / {formatDeZahl(materialResults.permCompStressRare, 1)} MPa</div>
                <div className="text-[10px] mt-1 font-sans">{materialResults.isRareStressOk ? '✓ Eingehalten' : '✗ Längsrissgefahr!'}</div>
              </div>

              <div className={`p-2.5 rounded-lg border ${materialResults.isQuasiStressOk ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                <div className="text-[10px] uppercase font-sans font-bold">3. Quasi-ständig (0,45 fck)</div>
                <div className="text-sm font-bold mt-0.5">{formatDeZahl(materialResults.maxCompStress_perm, 1)} / {formatDeZahl(materialResults.permCompStressQuasi, 1)} MPa</div>
                <div className="text-[10px] mt-1 font-sans">{materialResults.isQuasiStressOk ? '✓ Lineares Kriechen' : '⚠ Nichtlineares Kriechen!'}</div>
              </div>

              <div className={`p-2.5 rounded-lg border ${materialResults.isDecompressed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <div className="text-[10px] uppercase font-sans font-bold">4. Dekompression (±25 mm)</div>
                <div className="text-sm font-bold mt-0.5">{formatDeZahl(materialResults.sigmaTendonZone_perm, 2)} MPa</div>
                <div className="text-[10px] mt-1 font-sans">{materialResults.isDecompressed ? '✓ Rissfrei überdrückt' : '✗ Zugspannung am Kabel!'}</div>
              </div>
            </div>

            {/* Tabelle 3 (GZG-Spannungsbegrenzungen nach DIN EN 1992-1-1) */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-2">Nachweiskriterium (GZG)</th>
                    <th className="p-2">Zulässige Spannungsgrenze</th>
                    <th className="p-2">Relevante Einwirkungskombination</th>
                    <th className="p-2">Aktueller Wert &amp; Nachweis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2 font-semibold">Spannzeitpunkt t₀ (Transfer)</td>
                    <td className="p-2 font-mono"><InlineMath math="\sigma_c \le 0{,}60 \cdot f_{ck}(t_0)" /> ({formatDeZahl(materialResults.permCompStress_t0, 1)} MPa)</td>
                    <td className="p-2"><InlineMath math="P_{m0} + M_{g1}" /> ({formatDeWert(mG1)} kNm)</td>
                    <td className="p-2 font-mono">{formatDeZahl(materialResults.maxCompStress_t0, 1)} MPa {materialResults.isTransferStressOk ? <span className="text-emerald-700 font-bold">✓ OK</span> : <span className="text-red-700 font-bold">✗ Überschritten</span>}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2 font-semibold">Betondruckspannung (Längsrisse)</td>
                    <td className="p-2 font-mono"><InlineMath math="\sigma_c \le 0{,}60 \cdot f_{ck}" /> ({formatDeZahl(materialResults.permCompStressRare, 1)} MPa)</td>
                    <td className="p-2">Charakteristisch: <InlineMath math="P_{m\infty} + M_{char}" /> ({formatDeWert(mChar)} kNm)</td>
                    <td className="p-2 font-mono">{formatDeZahl(materialResults.maxCompStress_char, 1)} MPa {materialResults.isRareStressOk ? <span className="text-emerald-700 font-bold">✓ OK</span> : <span className="text-red-700 font-bold">✗ Überschritten</span>}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2 font-semibold">Betondruckspannung (Kriechen)</td>
                    <td className="p-2 font-mono"><InlineMath math="\sigma_c \le 0{,}45 \cdot f_{ck}" /> ({formatDeZahl(materialResults.permCompStressQuasi, 1)} MPa)</td>
                    <td className="p-2">Quasi-ständig: <InlineMath math="P_{m\infty} + M_{perm}" /> ({formatDeWert(mPerm)} kNm)</td>
                    <td className="p-2 font-mono">{formatDeZahl(materialResults.maxCompStress_perm, 1)} MPa {materialResults.isQuasiStressOk ? <span className="text-emerald-700 font-bold">✓ OK</span> : <span className="text-amber-700 font-bold">⚠ Nichtlinear</span>}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2 font-semibold">Dekompression (Spanngliedhöhe ± 25 mm)</td>
                    <td className="p-2 font-mono"><InlineMath math="\sigma_c \le 0" /> (Druckzone um Kabel)</td>
                    <td className="p-2">Quasi-ständig: <InlineMath math="P_{m\infty} + M_{perm}" /></td>
                    <td className="p-2 font-mono">{formatDeZahl(materialResults.sigmaTendonZone_perm, 2)} MPa {materialResults.isDecompressed ? <span className="text-emerald-700 font-bold">✓ OK (überdrückt)</span> : <span className="text-red-700 font-bold">✗ Zugspannungen!</span>}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2 font-semibold">Betonstahlspannung (Zustand)</td>
                    <td className="p-2 font-mono"><InlineMath math="\sigma_s \le 0{,}80 \cdot f_{yk}" /> (400 MPa)</td>
                    <td className="p-2">Charakteristisch</td>
                    <td className="p-2 font-mono">
                      {materialResults.isCrackedBot ? (
                        <span className="text-amber-700 font-bold">Zustand II – Nachweis im gerissenen Zustand erforderlich (hier nicht abgedeckt)</span>
                      ) : (
                        <span className="text-emerald-700 font-bold">✓ Zustand I (elastisch, <InlineMath math="\sigma_u \le f_{ctm}" />)</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2 font-semibold">Spannstahlspannung (Endzustand <InlineMath math="t=\infty" />)</td>
                    <td className="p-2 font-mono"><InlineMath math="\sigma_p \le 0{,}65 \cdot f_{pk}" /> ({formatDeZahl(materialResults.sigmaP_perm_quasi, 0)} MPa)</td>
                    <td className="p-2">Quasi-ständig: <InlineMath math="P_{m\infty} + M_{perm}" /></td>
                    <td className="p-2 font-mono">{formatDeZahl(materialResults.sigmaP_inf, 0)} MPa {materialResults.isSteelStressOk ? <span className="text-emerald-700 font-bold">✓ OK</span> : <span className="text-red-700 font-bold">✗ Überschritten</span>}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Card B: Loss Breakdown Panel */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/10 pb-2">
              <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-shiraz" />
                Spezifische Vorspannungsverluste (Loss Calculations)
              </h3>
              
              {/* Toggle tabs */}
              <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setLossTab('overview')}
                  className={`py-1 px-2.5 text-xs font-semibold rounded-md transition cursor-pointer select-none ${lossTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Übersicht
                </button>
                <button
                  type="button"
                  onClick={() => setLossTab('calculations')}
                  className={`py-1 px-2.5 text-xs font-semibold rounded-md transition cursor-pointer select-none ${lossTab === 'calculations' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Rechengang (EC2)
                </button>
              </div>
            </div>

            {lossTab === 'overview' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                {/* Force values overview */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-xs">Nominale Spannkraft P_0 (Vollwert):</span>
                    <span className="font-bold font-mono">{formatDeWert(p0)} kN</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-600 border-b border-dashed border-slate-100 pb-1.5">
                    <span className="text-xs font-medium">Nach Sofortverlusten (t = 0):</span>
                    <span className="font-bold font-mono text-sm">{formatDeZahl(materialResults.pEff0, 0)} kN (-{formatDeZahl(materialResults.totalImmediateLossPct, 1)}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-shiraz">
                    <span className="text-xs font-bold">Endzustand (t = ∞):</span>
                    <span className="font-bold font-mono text-base">{formatDeZahl(materialResults.pEffInf, 0)} kN (-{formatDeZahl(materialResults.totalLossPct, 1)}%)</span>
                  </div>
                  <div className="text-[11px] text-text-main/70 bg-off-white p-2.5 rounded border border-home-grau/20 font-mono space-y-1">
                    <p>Effektiver Nutzgrad im Endzustand: <strong>{formatDeZahl(((materialResults.pEffInf / p0) * 100), 1)}%</strong> von P_0.</p>
                    <p className="text-[10px] text-slate-500">Betondruck in Spanngliedhöhe beim Spannen (P + g₁): <strong>{formatDeZahl(materialResults.sigmaCp0, 2)} N/mm²</strong></p>
                  </div>
                </div>

                {/* Loss itemized list */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="text-[10px] uppercase font-bold text-text-main/60 tracking-wider">Itemisierte Verlusttreiber:</div>
                  {materialResults.frictionLossPct > 0 && (
                    <div className="flex justify-between items-center bg-amber-50/20 p-2 rounded border border-amber-100">
                      <span className="font-sans font-medium text-slate-700">Reibung (Spannglied/Hüllrohr):</span>
                      <span className="font-bold text-amber-600">{formatDeZahl(materialResults.frictionLossPct, 1)}%</span>
                    </div>
                  )}
                  {materialResults.slipLossPct > 0 && (
                    <div className="flex justify-between items-center bg-zinc-50 p-2 rounded border border-zinc-200">
                      <span className="font-sans font-medium text-slate-700">Verankerungsschlupf (Keileinzug):</span>
                      <span className="font-bold text-zinc-650">{formatDeZahl(materialResults.slipLossPct, 1)}%</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded border border-blue-100">
                    <span className="font-sans font-medium text-slate-700">Elastische Sofortverkürzung (t=0):</span>
                    <span className="font-bold text-blue-600">{formatDeZahl(materialResults.elasticLossPct, 1)}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-amber-50/50 p-2 rounded border border-amber-100">
                    <span className="font-sans font-medium text-slate-700">Schwinden &amp; Beton-Kriechen:</span>
                    <span className="font-bold text-amber-700">{formatDeZahl(materialResults.lossCsPct, 1)}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-purple-50/50 p-2 rounded border border-purple-100">
                    <span className="font-sans font-medium text-slate-700">Stahlrelaxation (500 000 h):</span>
                    <span className="font-bold text-purple-700">{formatDeZahl(materialResults.lossRPct, 1)}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-shiraz/5 p-2 rounded border border-shiraz/20 text-shiraz font-bold">
                    <span className="font-sans">Gesamter Verlustanteil:</span>
                    <span>{formatDeZahl(materialResults.totalLossPct, 1)}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-xs animate-in fade-in duration-300">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 text-[10px] uppercase tracking-wider mb-2">1. Grundparameter (Inputs)</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                    <div>Spannung an der Presse: <span className="font-bold text-slate-800">σ_p,max = {formatDeZahl(materialResults.sigmaP0, 0)} N/mm²</span></div>
                    <div>Nach Sofortverlusten: <span className={`font-bold ${materialResults.isPm0Ok ? 'text-slate-800' : 'text-red-600'}`}>σ_pm0 = {formatDeZahl(materialResults.sigmaPm0, 0)} N/mm²</span> (≤ {formatDeZahl(materialResults.sigmaP_max_transfer, 0)})</div>
                    <div>Wirksame Dicke: <span className="font-bold text-slate-800">h₀ = 2A_c/u = {formatDeZahl(materialResults.h0, 0)} mm</span></div>
                    <div>Nachweisschnitt: <span className="font-bold text-slate-800">x = L/2 = {formatDeZahl(materialResults.xSection, 1)} m</span></div>
                    <div>Verhältnis E-Moduln: <span className="font-bold text-slate-800">α_p = {formatDeZahl(materialResults.alphaP_lt, 2)}</span></div>
                    <div>Berechnete Stahlquerschnittsfläche: <span className="font-bold text-slate-800">A_p ≈ {formatDeZahl(materialResults.ap, 0)} mm²</span></div>
                    <div>Exzentrizität (Bruttoquerschnitt): <span className="font-bold text-slate-800">z_cp = e_p = {formatDeWert(ep)} mm</span></div>
                  </div>
                </div>

                {/* Mechanische Verluste */}
                {(materialResults.frictionLossPct > 0 || materialResults.slipLossPct > 0) && (
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 space-y-2">
                    <div className="font-bold text-zinc-900 text-[10px] uppercase tracking-wider">1.5 Mechanische Sofortverluste im Spannglied (Reibung &amp; Schlupf)</div>
                    <p className="text-[10px] text-slate-600 font-sans italic">Reibung nach EC2 5.10.5.2 und Keilschlupf nach 5.10.5.3, jeweils im Nachweisschnitt x = L/2 bei einseitigem Spannen.</p>
                    <div className="bg-white p-2.5 rounded border border-zinc-150 font-mono text-[11px] leading-relaxed space-y-1.5">
                      {materialResults.frictionLossPct > 0 && (
                        <div>Reibungsanteil: <span className="text-zinc-700 font-semibold">{formatDeZahl(materialResults.frictionLossPct, 2)}%</span> <span className="text-[10px] text-zinc-550">(1 − e^(−μ·(θ·x/L + k·x)), μ = {formatDeWert(materialResults.frictionCoeff)}, θ = {formatDeWert(materialResults.totalCurvature)} rad, k = {formatDeWert(materialResults.wobbleCoeff)}/m, x = {formatDeZahl(materialResults.xSection, 1)} m)</span></div>
                      )}
                      {materialResults.anchorSlip > 0 && (
                        <div>Keilschlupf-Anteil: <span className="text-zinc-700 font-semibold">{formatDeZahl(materialResults.slipLossPct, 2)}%</span> <span className="text-[10px] text-zinc-550">(Einflusslänge l_set = √(w·E_p/p) = {formatDeZahl(materialResults.lSet, 1)} m{materialResults.lSet < materialResults.xSection ? ' < x → Feldmitte vom Schlupf nicht betroffen' : ''})</span></div>
                      )}
                      <div className="pt-1 border-t border-dashed border-zinc-200">Summe mechanische Verluste: <strong className="text-shiraz">{formatDeZahl(materialResults.immediateTendonLossPct, 2)}%</strong></div>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-blue-50/30 rounded-lg border border-blue-100 space-y-2">
                  <div className="font-bold text-blue-900 text-[10px] uppercase tracking-wider">2. Elastischer Sofortverlust (Kurzzeit t=0)</div>
                  <p className="text-[10px] text-slate-600 font-sans italic">Verkürzung des Betons beim Spannen. Spannbett: alle Litzen gleichzeitig (j = 1). Nachträglicher Verbund: n Spannglieder nacheinander, j = (n−1)/(2n) (EC2 5.10.5.1).</p>
                  <div className="bg-white p-2 rounded border border-blue-100/60 font-mono text-[11px] leading-relaxed space-y-1">
                    <div>Formel: <span className="text-blue-700 font-bold">Δσ_p,el = j · E_p · σ_c / E_cm(t₀)</span></div>
                    <div>Rechnung: {formatDeZahl(materialResults.factorEl, 3)} · {materialResults.steel.Ep.toLocaleString('de-DE')} · ({formatDeZahl(materialResults.sigmaCp0, 2)} / {Math.round(materialResults.Ecm_t0).toLocaleString('de-DE')}) = <span className="font-bold text-blue-700">{formatDeZahl(materialResults.deltaSigmaP_el, 1)} N/mm²</span></div>
                    <div>Verlustwert: <span className="font-bold text-blue-700"> {formatDeZahl(materialResults.elasticLossPct, 2)} %</span> (entspricht {formatDeZahl((p0 * materialResults.elasticLossPct / 100), 1)} kN Kraftverlust)</div>
                  </div>
                </div>

                <div className="p-3 bg-purple-50/30 rounded-lg border border-purple-100 space-y-2">
                  <div className="font-bold text-purple-900 text-[10px] uppercase tracking-wider">3. Stahlrelaxation für t = 500 000 h (DIN EN 1992-1-1, 3.3.2)</div>
                  <p className="text-[10px] text-slate-600 font-sans italic">Reiner viskoelastischer Spannungsabfall des Stahldrahtes bei konstanter Dehnung.</p>
                  <div className="bg-white p-2 rounded border border-purple-100/60 font-mono text-[11px] leading-relaxed space-y-1">
                    <div>Klasse {formatDeWert(relaxationClass)}: <span className="text-purple-700">ρ_1000 = {formatDeZahl((materialResults.rho1000 * 100), 1)} %</span>, μ = σ_pm0/f_pk = {formatDeZahl((materialResults.sigmaPm0 / materialResults.steel.fpk), 3)}</div>
                    <div>Gl. (3.28)–(3.30): <span className="font-bold text-purple-700">Δσ_pr = {formatDeZahl(materialResults.deltaSigmaPr, 1)} N/mm²</span> ({formatDeZahl((materialResults.deltaSigmaPr / materialResults.sigmaPm0 * 100), 1)} % von σ_pm0)</div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/20 rounded-lg border border-amber-100 space-y-2">
                  <div className="font-bold text-amber-900 text-[10px] uppercase tracking-wider">4. Langzeit-Gesamtverluste (c + s + r) nach Eurocode 2</div>
                  <p className="text-[10px] text-slate-600 font-sans italic">Interaktive Überlagerung von Beton-Schwinden, Dauer-Kriechen unter Last und der stahlbezogenen Relaxation.</p>
                  <div className="bg-white p-2.5 rounded border border-amber-150 font-mono text-[11.5px] leading-relaxed space-y-2">
                    <div className="text-[10.5px]">
                      <div>Eingangswerte: <span className="text-amber-800">φ(∞,t₀) = {formatDeZahl(materialResults.phi, 2)}, ε_cs(∞) = {formatDeZahl(materialResults.epsCsPermille, 3)} ‰, σ_c,QP = {formatDeZahl(materialResults.sigmaCQP, 2)} N/mm²</span> (P_m0 + M_perm, Anhang B)</div>
                      <div>Zählerwert: <span className="text-amber-800">ε_cs·E_p + 0,8·Δσ_pr + α_p·φ·σ_c,QP</span></div>
                      <div className="pl-4">= ({formatDeZahl((materialResults.epsCs * 1000), 3)}·10⁻³ · {materialResults.steel.Ep.toLocaleString('de-DE')}) + (0,8 · {formatDeZahl(materialResults.deltaSigmaPr, 1)}) + ({formatDeZahl(materialResults.alphaP_lt, 2)} · {formatDeZahl(materialResults.phi, 2)} · {formatDeZahl(materialResults.sigmaCQP, 2)})</div>
                      <div className="pl-4 font-bold text-amber-850">= {formatDeZahl((materialResults.epsCs * materialResults.steel.Ep), 1)} + {formatDeZahl((0.8 * materialResults.deltaSigmaPr), 1)} + {formatDeZahl((materialResults.phi * materialResults.alphaP_lt * materialResults.sigmaCQP), 1)} = {formatDeZahl(materialResults.numerator, 1)} N/mm²</div>
                    </div>
                    <div className="text-[10.5px] border-t border-dashed border-slate-200 pt-1.5">
                      <div>Nenner-Struktur: <span className="text-amber-800">1 + α_p·(A_p / A_c) · [1 + (A_c · z_cp²) / I_c] · (1 + 0,8·φ)</span></div>
                      <div className="pl-4">= 1 + {formatDeZahl(materialResults.alphaP_lt, 2)} · ({formatDeZahl(materialResults.ap, 0)} / {formatDeWert(materialResults.ac)}) · [1 + ({formatDeWert(materialResults.ac)} · {formatDeWert(Math.pow(ep, 2))}) / {materialResults.ic.toExponential(2)}] · (1 + 0,8 · {formatDeZahl(materialResults.phi, 2)})</div>
                      <div className="pl-4 font-bold text-amber-850">= {formatDeZahl(materialResults.denominator, 4)}</div>
                    </div>
                    <div className="border-t border-slate-200 pt-2 text-xs">
                      <div>Zeitabhängiger Summenverlust (c+s+r): <span className="font-bold text-amber-800">Δσ_p,csr = {formatDeZahl(materialResults.deltaSigmaP_csr, 1)} N/mm²</span></div>
                      <div>Langzeitverlust-Prozent: <span className="font-bold text-amber-800">{formatDeZahl(materialResults.csrLossPct, 2)} %</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Warn-Banner if overcompressed */}
            {materialResults.isOvercompressedTransfer && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg flex gap-2 items-start animate-in zoom-in duration-300">
                <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Achtung: Betondruck beim Transfer überschritten!</div>
                  In Abwesenheit des äußeren Biegemoments (z.B. im unbelasteten Zustand direkt nach dem Spannen) beträgt der 
                  Druck am unteren Rand {formatDeZahl(Math.abs(materialResults.sigmaN + materialResults.sigmaMPBot), 1)} MPa. Das 
                  überschreitet die zulässige Druckspannung von {formatDeZahl(materialResults.permCompStress_t0, 1)} MPa (0,60·f_ck(t₀)) für {concreteClass} im Alter t₀ = {formatDeWert(concreteAge)} d. 
                  Gefahr von Druckversagen, Absplitterung oder massiven unzulässigen Kriechverformungen!
                </div>
              </div>
            )}

            {/* Quick Link to Material Explanations */}
            <div className="mt-4 p-4 bg-shiraz/5 border border-shiraz/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-text-main/80">
                <span className="font-bold text-shiraz block">Didaktische Erklärung der Kenngrößen:</span>
                Physikalische Wirkmechanismen, Mikrostrukturen und Formeln von Kriechen, Schwinden und Relaxation.
              </div>
              <button
                type="button"
                onClick={() => setMainTab('kennwerte')}
                className="px-3.5 py-2 rounded-lg bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                <BookOpen size={14} /> Zu den Baustoffkennwerten <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card C: Schematic Principle SVGs */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
              <Info className="h-4 w-4 text-shiraz" />
              Schnittprinzip des vorgespannten Tragwerks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Schlaffe Bewehrung */}
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <div className="text-xs font-bold mb-2">Stahlbeton (schlaff bewehrt)</div>
                <svg width="100%" height="110" viewBox="0 0 200 110">
                  <defs>
                    <marker id="arrow-black" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
                    </marker>
                  </defs>
                  {/* Last */}
                  <path d="M 100 10 L 100 25" stroke="#1e293b" strokeWidth="2" markerEnd="url(#arrow-black)" />
                  <text x="105" y="18" fontSize="9" fill="#1e293b">Last M_k</text>
                  
                  {/* Durchbiegender Balken */}
                  <path d="M 20 35 Q 100 65 180 35 L 180 65 Q 100 95 20 65 Z" fill="#cbd5e1" stroke="#94a3b8" />
                  {/* Schlaffe Bewehrung */}
                  <path d="M 30 60 Q 100 85 170 60" fill="none" stroke="#A3113E" strokeWidth="2" strokeDasharray="3 2" />
                  {/* Risse */}
                  <path d="M 80 90 L 80 75 M 100 95 L 100 75 M 120 90 L 120 75" stroke="#475569" strokeWidth="1.5" />
                </svg>
                <div className="text-[11px] text-text-main/70 text-center mt-2">
                  Unter äußeren Momenten reißt die Zugzone (Zustand II). Nur der Bewehrungsstahl übernimmt Zug. Große Verformungen.
                </div>
              </div>

              {/* Spannbeton */}
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <div className="text-xs font-bold mb-2">Spannbeton (vorgespannt / überdrückt)</div>
                <svg width="100%" height="110" viewBox="0 0 200 110">
                  <defs>
                    <marker id="arrow-black-2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
                    </marker>
                    <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                  </defs>
                  {/* Last */}
                  <path d="M 100 10 L 100 25" stroke="#1e293b" strokeWidth="2" markerEnd="url(#arrow-black-2)" />
                  
                  {/* Gerader Balken */}
                  <rect x="20" y="35" width="160" height="30" fill="#cbd5e1" stroke="#94a3b8" />
                  {/* Spannglied (exzentrisch) */}
                  <path d="M 20 50 Q 100 75 180 50" fill="none" stroke="#475569" strokeWidth="2" />
                  
                  {/* Vorspannkraefte */}
                  <path d="M 0 50 L 20 50" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow-blue)" />
                  <path d="M 200 50 L 180 50" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow-blue)" />
                  
                  {/* Umlenkkraefte */}
                  <path d="M 100 65 L 100 45" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
                </svg>
                <div className="text-[11px] text-text-main/70 text-center mt-2">
                  Die exzentrische Vorspannung erzeugt eine entgegengesetzte Überhöhung. Der Querschnitt bleibt rissfrei bzw. die Rissbreiten bleiben begrenzt (Zustand I).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {mainTab === 'dauerhaftigkeit' && (
        <div className="animate-in fade-in duration-300">
          <SpannbetonDauerhaftigkeit />
        </div>
      )}

      {/* Vernetzte Fachmodule & Querverweise */}
      <RelatedModules
        title="Verwandte Fachmodule zu Spannbeton &amp; Materialverhalten"
        subtitle="Didaktisch abgestimmte Module zu Betontechnologie, Festigkeitsnachweisen und Tragwerksinstandhaltung"
        modules={[
          {
            tab: 'festbeton',
            title: 'Festbetoneigenschaften',
            description: 'E-Modul, Druckfestigkeit, Zugfestigkeit und Spannungs-Dehnungs-Linien nach EC2.',
            tag: 'Grundlagen',
            badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
          },
          {
            tab: 'stahlbeton',
            title: 'Stahlbetonbau (EC2)',
            description: 'Biegebemessung, Querkraft, Rissbreitenbegrenzung und Mindestbewehrung.',
            tag: 'Bemessung',
            badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
          },
          {
            tab: 'stahl',
            title: 'Spannstahl & Hochfeste Stähle',
            description: 'Draht- und Litzenstähle (Y1860S7), Spannungs-Dehnungs-Linie, Streckgrenze und Relaxation.',
            tag: 'Werkstoffe',
            badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
          },
          {
            tab: 'korrosion',
            title: 'Spannungsrisskorrosion & Spanngliedbrüche',
            description: 'Gefahren durch Wasserstoffversprödung und Depassivierung hochfester Spannstähle.',
            tag: 'Dauerhaftigkeit',
            badgeColor: 'bg-pink-50 text-pink-700 border-pink-200'
          },
          {
            tab: 'instandhaltung',
            title: 'Stahlbeton- & Spannbetoninstandsetzung',
            description: 'Zustandsanalyse, Rissinjektion, kathodischer Korrosionsschutz und Nachverankerung.',
            tag: 'Instandhaltung',
            badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
          },
          {
            tab: 'rechnung_stahlbeton',
            title: 'Musterrechnung Stahlbeton',
            description: 'Schritt-für-Schritt-Biegebemessung nach Eurocode 2 mit interaktiven Zahlenbeispielen.',
            tag: 'Praxisrechnung',
            badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
          }
        ]}
      />

      <ModuleFooter
        lastReviewed="Oktober 2026 (Korrekturpaket Spannbeton eingearbeitet; fachliche Freigabe durch den Autor ausstehend)"
        weblinks={[
          { title: 'Beton.wiki: Spannbetonbau', url: 'https://beton.wiki/index.php?title=Spannbeton' },
          { title: 'Zement-Merkblatt H9: Spannbeton', url: 'https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/' }
        ]}
        wikipedia={[
          { title: 'Spannbeton', url: 'https://de.wikipedia.org/wiki/Spannbeton' },
          { title: 'Kriechen und Schwinden von Beton', url: 'https://de.wikipedia.org/wiki/Kriechen_und_Schwinden_von_Beton' },
          { title: 'Spannstahl', url: 'https://de.wikipedia.org/wiki/Spannstahl' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit DIN EN 1992-1-1/NA:2013-04 + NA/A1:2015-12 (Eurocode 2, bauaufsichtlich eingeführt über MVV TB)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+1992-1-1' },
          { title: 'DIN EN 1992-2:2010-12 mit DIN EN 1992-2/NA:2013-04 (Betonbrücken) sowie ZTV-ING Teil 3', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+1992-2' },
          { title: 'DIN EN 1992-1-1:2025-09 (Deutsche Fassung EN 1992-1-1:2023, 2. Generation; ersetzt formal DIN EN 1992-1-1:2011-01, DIN EN 1992-2 und DIN EN 1992-3 – bauaufsichtlich noch nicht eingeführt)', url: 'https://www.dinmedia.de/de/norm/din-en-1992-1-1/374296420' },
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton: Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+1045-2' },
          { title: 'Spannstahl: allgemeine bauaufsichtliche Zulassungen (abZ) des DIBt; EN 10138 nur als Entwurf (prEN 10138-1 bis -4), nicht harmonisiert', url: 'https://www.dibt.de/' },
          { title: 'DIN EN 445 / 446 / 447 (Einpressmörtel für Spannglieder: Prüfverfahren, Einpressverfahren, Anforderungen) – Ausgaben manuell prüfen', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+447' },
          { title: 'DIN EN 523 (Hüllrohre aus Bandstahl für Spannglieder) – Ausgabe manuell prüfen', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+523' },
          { title: 'fib Bulletin 75 (2014): Polymer-duct systems for internal bonded post-tensioning', url: 'https://www.fib-international.org/' },
          { title: 'Spannverfahren: Europäische Technische Bewertungen (ETA) bzw. abZ des jeweiligen Systems', url: 'https://www.dibt.de/' },
          { title: 'BMVI: Handlungsanweisung Spannungsrisskorrosion (Ankündigungsverhalten) und Nachrechnungsrichtlinie für Straßenbrücken im Bestand', url: 'https://www.bast.de/' },
          { title: 'DGZfP-Merkblätter zur zerstörungsfreien Prüfung im Bauwesen (Ultraschall, Radar, Streufeld) – Nummern/Ausgaben manuell prüfen', url: 'https://www.dgzfp.de/' }
        ]}
        literatur={[
          'Zilch, K.; Zehetmaier, G. (2010): Bemessung im konstruktiven Betonbau (Springer Vieweg)',
          'Mehlhorn, G.; Curbach, M. (2014): Handbuch Brückenbau (Ernst & Sohn)',
          'Leonhardt, F. (1980): Vorlesungen über Massivbau - Teil 5: Spannbeton (Springer Verlag)'
        ]}
        formeln={[
          {
            erklaerung: "Zeitliche Entwicklung der Zylinderdruckfestigkeit f_cm(t): s = Zementbeiwert (0.20 für R, 0.25 für N, 0.38 für S), t = Betonalter in Tagen.",
            formel: "f_{cm}(t) = \\beta_{cc}(t) \\cdot f_{cm} = \\exp\\left\\{ s \\cdot \\left[1 - \\left(\\frac{28}{t}\\right)^{1/2}\\right] \\right\\} \\cdot f_{cm}",
            quelle: "DIN EN 1992-1-1 Gl. (3.1) & (3.2)"
          },
          {
            erklaerung: "Zeitliche Entwicklung des Elastizitätsmoduls E_cm(t) in Abhängigkeit der erreichten Druckfestigkeit f_cm(t).",
            formel: "E_{cm}(t) = \\left(\\frac{f_{cm}(t)}{f_{cm}}\\right)^{0{,}3} \\cdot E_{cm}",
            quelle: "DIN EN 1992-1-1 Gl. (3.5)"
          },
          {
            erklaerung: "Nichtlineare Spannungs-Dehnungs-Linie des Betons unter Druck: η = ε_c / ε_c1, k = 1.05 · E_cm · |ε_c1| / f_cm.",
            formel: "\\frac{\\sigma_c}{f_{cm}} = \\frac{k \\cdot \\eta - \\eta^2}{1 + (k - 2) \\cdot \\eta}",
            quelle: "DIN EN 1992-1-1 Gl. (3.14)"
          },
          {
            erklaerung: "Mehraxiale Teilflächenbelastung in der Verankerungszone: A_c0 = Belastungsfläche unter der Ankerplatte, A_c1 = rechnerische Verteilungsfläche.",
            formel: "F_{Rdu} = A_{c0} \\cdot f_{cd} \\cdot \\sqrt{\\frac{A_{c1}}{A_{c0}}} \\le 3{,}0 \\cdot f_{cd} \\cdot A_{c0}",
            quelle: "DIN EN 1992-1-1 Gl. (6.63)"
          },
          {
            erklaerung: "Spannung aus zentrischer Vorspannung (Normalkraft): P_eff = Effektive Vorspannkraft [N], A_c = Betonquerschnittsfläche [mm²].",
            formel: "\\sigma_{P,N} = \\frac{-P_{eff}}{A_c}",
            quelle: "DIN EN 1992-1-1"
          },
          {
            erklaerung: "Spannung aus exzentrischer Vorspannung (Biegemoment): e_p = Exzentrizität [mm], I_c = Flächenträgheitsmoment [mm⁴], z = Faserabstand [mm].",
            formel: "\\sigma_{P,M}(z) = \\frac{-P_{eff} \\cdot e_p}{I_c} \\cdot z",
            quelle: "DIN EN 1992-1-1"
          },
          {
            erklaerung: "Elastischer Stauchungsverlust des Betons beim Spannen: Ep = E-Modul Spannstahl, Ecm(t0) = E-Modul des Betons zum Vorspannzeitpunkt t0, σ_cp0 = Betondruckspannung in Spanngliedhöhe.",
            formel: "\\Delta\\sigma_{p,el} = \\frac{E_p}{E_{cm}(t_0)} \\cdot \\sigma_{c,p0}",
            quelle: "DIN EN 1992-1-1 Gl. (5.44)"
          },
          {
            erklaerung: "Autogenes Schwinden bei t=∞ als Funktion der charakteristischen Zylinderdruckfestigkeit fck.",
            formel: "\\varepsilon_{ca}(\\infty) = 2{,}5 \\cdot (f_{ck} - 10) \\cdot 10^{-6}",
            quelle: "DIN EN 1992-1-1 Gl. (3.12)"
          },
          {
            erklaerung: "Stahlrelaxation nach 1000 Stunden bei 20 °C für Low-Relaxation Litzen (Klasse 2): ρ1000 ≈ 2,5 %, μ = σ_pi / f_pk.",
            formel: "\\frac{\\Delta\\sigma_{pr}}{\\sigma_{pi}} = 0{,}66 \\cdot \\rho_{1000} \\cdot e^{9{,}1 \\cdot \\mu} \\cdot \\left(\\frac{t}{1000}\\right)^{0{,}75 \\cdot (1 - \\mu)} \\cdot 10^{-5}",
            quelle: "DIN EN 1992-1-1 Gl. (3.29)"
          },
          {
            erklaerung: "Zeitabhängige Verluste infolge Kriechen (φ), Schwinden (ε_cs) und Relaxation (Δσ_pr); σ_c,QP = Betonspannung in Spanngliedhöhe unter quasi-ständiger Last inkl. Vorspannung, z_cp = Abstand Spannglied–Schwerachse.",
            formel: "\\Delta\\sigma_{p,c+s+r} = \\frac{\\varepsilon_{cs} \\cdot E_p + 0{,}8 \\cdot \\Delta\\sigma_{pr} + \\alpha_p \\cdot \\varphi(t,t_0) \\cdot \\sigma_{c,QP}}{1 + \\alpha_p \\cdot \\frac{A_p}{A_c} \\cdot \\left(1 + \\frac{A_c}{I_c} z_{cp}^2\\right) \\cdot \\left[1 + 0{,}8 \\cdot \\varphi(t,t_0)\\right]}",
            quelle: "DIN EN 1992-1-1 Gl. (5.46)"
          },
          {
            erklaerung: "Reibungsverluste im Hüllrohr: μ = Reibungsbeiwert (dimensionslos), θ = Summe der planmäßigen Umlenkwinkel bis x, k = ungewollter Umlenkwinkel je Länge.",
            formel: "\\Delta P(x) = P_0 \\cdot \\left(1 - e^{-\\mu \\cdot (\\theta + k \\cdot x)}\\right)",
            quelle: "DIN EN 1992-1-1 Gl. (5.45)"
          },
          {
            erklaerung: "Umlenkkraft einer parabelförmigen Spanngliedführung: P = Vorspannkraft, f = Parabelstich, L = Stützweite.",
            formel: "u(x) = \\frac{8 \\cdot P \\cdot f}{L^2}",
            quelle: "F. Leonhardt (Spannbeton)"
          },
          {
            erklaerung: "Maximal zulässige Vorspannkraft beim Spannen an der Presse: f_pk = Zugfestigkeit, f_p0.1k = 0,1%-Dehngrenze.",
            formel: "\\sigma_{p,max} = \\min\\left(0{,}80 \\cdot f_{pk}; \\; 0{,}90 \\cdot f_{p0{,}1k}\\right)",
            quelle: "DIN EN 1992-1-1 Gl. (5.41)"
          },
          {
            erklaerung: "Maximal zulässige Spannung im Spannstahl unmittelbar nach dem Verankern (Transfer t0).",
            formel: "\\sigma_{p,m0} = \\min\\left(0{,}75 \\cdot f_{pk}; \\; 0{,}85 \\cdot f_{p0{,}1k}\\right)",
            quelle: "DIN EN 1992-1-1 Gl. (5.43)"
          }
        ]}
      />
    </div>
  );
}
