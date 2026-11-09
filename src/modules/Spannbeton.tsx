import { formatDeZahl, formatDeWert, formatDeTeX, formatDeIntl } from '@/src/utils/numberFormat';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { RelatedModules } from '@/src/components/ui/RelatedModules';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { InlineMath } from 'react-katex';
// Reiter Grundprinzipien, Kennwerte und Dauerhaftigkeit je als eigener Chunk (Phase 5, AP 5.5 Nachtrag):
// Beim Aufruf erscheint der Reiter „0–100“; die übrigen (~60 % des Moduls) kommen beim ersten Zeigen auf die
// Reiterleiste bzw. beim Wechsel.
const ladePrinzipien = () => import('./spannbeton/SpannbetonPrinzipien');
const ladeKennwerte = () => import('./spannbeton/SpannbetonKennwerte');
const ladeDauerhaftigkeit = () => import('./spannbeton/SpannbetonDauerhaftigkeit');
const SpannbetonPrinzipien = React.lazy(ladePrinzipien);
const SpannbetonKennwerte = React.lazy(ladeKennwerte);
const SpannbetonDauerhaftigkeit = React.lazy(ladeDauerhaftigkeit);
const ladeReiter = (bereiche: readonly string[]) => {
  if (bereiche.includes('grundprinzipien')) void ladePrinzipien();
  if (bereiche.includes('kennwerte')) void ladeKennwerte();
  if (bereiche.includes('dauerhaftigkeit')) void ladeDauerhaftigkeit();
};
const Reiterplatz = () => <div className="min-h-screen" aria-busy="true" />;
import SpannbetonNullBisHundert from './spannbeton/SpannbetonNullBisHundert';
import { fckT, betaCc as betaCcT, EcmT, creep, shrinkage, relaxation, frictionSlip, timeDependentLoss, CONCRETE, pruefeSpannbeton, type RelaxationClass,
  E_SPANNSTAHL, SPANNSTAHL, RHO_1000, SPANNUNGSGRENZEN as SG, sigmaPMax, sigmaPm0Grenze } from '@/src/calc/spannbeton';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { hatFehler, ohneZahlen } from '@/src/calc/plausibilitaet';
import { NachErstemBild } from '@/src/components/ui/NachErstemBild';
import {
  Settings,
  Activity,
  Clock,
  Gauge,
  Thermometer,
  ShieldAlert,
  ShieldCheck,
  Database,
  Layers,
  Info,
  BookOpen,
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
import inhalt from '@/content/spannbeton/Spannbeton.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { useTabContext, type TabId } from '@/src/contexts/TabContext';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';
import { reglerName } from '@/src/lib/reglerName';

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

// Spannstahlkennwerte zentral (src/utils/ec2Spannbeton.ts: SPANNSTAHL, E_SPANNSTAHL nach EC2 3.3.6(3))
const STEEL_GRADES: Record<string, SteelData> = {
  'Y1770': { ...SPANNSTAHL.Y1770, Ep: E_SPANNSTAHL },
  'Y1860': { ...SPANNSTAHL.Y1860, Ep: E_SPANNSTAHL },
};

const REITER = [
  { id: 'null_bis_hundert', label: '0-100', icon: GraduationCap },
  { id: 'grundprinzipien', label: 'Grundprinzipien', icon: Compass },
  { id: 'kennwerte', label: inhalt.texte.baustoffkennwerteKriechenSchwindenRelaxa, icon: BookOpen },
  { id: 'rechner', label: inhalt.texte.querschnittsRechnerSpannungsverlauf, icon: Activity },
  { id: 'dauerhaftigkeit', label: inhalt.texte.dauerhaftigkeitKorrosionsschutz, icon: ShieldCheck },
] as const;
export type SpannbetonReiter = (typeof REITER)[number]['id'];

// Aufteilung in zwei Teilmodule (28.10.2026, src/registry/teilmodule.ts): Reiter → Route des Teilmoduls.
// Die Routen übergeben ihre Reiter über `bereiche` (src/routing/ModulInhalt.tsx).
export const SPANNBETON_TEIL: Readonly<Record<SpannbetonReiter, TabId>> = {
  null_bis_hundert: 'spannbeton_grundlagen', grundprinzipien: 'spannbeton_grundlagen', dauerhaftigkeit: 'spannbeton_grundlagen',
  kennwerte: 'spannbeton_kennwerte', rechner: 'spannbeton_kennwerte',
};
// Zielreiter beim Wechsel ins andere Teilmodul (z. B. „Zu den Baustoffkennwerten“ aus dem Reiter 0–100)
let naechsterReiter: SpannbetonReiter | undefined;

export default function Spannbeton({ bereiche }: { bereiche: readonly SpannbetonReiter[] }) {
  const { setActiveTab } = useTabContext();
  const reiter = REITER.filter(r => bereiche.includes(r.id));
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
  const [mainTab, setMainTab] = useState<SpannbetonReiter>(() => {
    const start = naechsterReiter && bereiche.includes(naechsterReiter) ? naechsterReiter : bereiche[0];
    naechsterReiter = undefined;
    return start;
  });
  // Reiter dieses Teilmoduls direkt zeigen, sonst das andere Teilmodul mit diesem Reiter öffnen
  const zeigeReiter = (r: SpannbetonReiter) => {
    if (bereiche.includes(r)) { setMainTab(r); return; }
    naechsterReiter = r;
    setActiveTab(SPANNBETON_TEIL[r]);
  };

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

  const eingabeHinweise = useMemo(() => pruefeSpannbeton({
    p0, b, h, ep, mG1, mPerm, mChar, concreteAge, spanLength, frictionCoeff, wobbleCoeff, totalCurvature, anchorSlip, nTendons,
  }), [p0, b, h, ep, mG1, mPerm, mChar, concreteAge, spanLength, frictionCoeff, wobbleCoeff, totalCurvature, anchorSlip, nTendons]);

  const materialResultsRoh = useMemo(() => {
    const conc = CONCRETE_CLASSES[concreteClass] || CONCRETE_CLASSES['C40/50'];
    const steel = STEEL_GRADES[steelGrade] || STEEL_GRADES['Y1860'];

    // 1. Querschnittsanalyse
    const ac = b * h; // mm²
    const ic = (b * Math.pow(h, 3)) / 12; // mm⁴
    const wTop = ic / (h / 2); // mm³
    const wBot = ic / (h / 2); // mm³

    // 2. Betonreife zum Zeitpunkt des Spannens t_0 (Maturity Calculation according to EC2)
    // Festigkeitsverlauf nach DIN EN 1992-1-1, Kap. 3.1.2(5) mit fckT()
    // β_cc(t_0) nach Gl. (3.2), s nach 3.1.2(6) – zentral (betaCc in src/utils/ec2Spannbeton.ts)
    const betaCc = betaCcT(concreteAge, cementType);
    const fck_t0 = fckT(conc.fck, concreteAge, cementType); // fcm(t) - 8 nach EC2 3.1.2(5)

    // E-Modul-Entwicklung im Alter t_0 nach EC2: Ecm(t_0) = (fcm(t_0)/fcm)^0.3 * Ecm
    // zentral EcmT() (Gl. 3.5); für t_0 ≥ 28 d höchstens E_cm (wie bisher: f_ck(t_0) = f_ck)
    const Ecm_t0 = Math.max(15000, concreteAge >= 28 ? conc.Ecm : EcmT(conc.fck, concreteAge, cementType)); // Untergrenze 15 000 N/mm² als Plausibilitätsgrenze

    // 3. Spannstahlfläche Ap aus der Pressenkraft P0 bei σ_p,max = min(0,80·f_pk; 0,90·f_p0,1k)
    //    (DIN EN 1992-1-1/NA, 5.10.2.1) – Nachweis σ_pm0 ≤ min(0,75·f_pk; 0,85·f_p0,1k) siehe unten
    const sigmaPmax = sigmaPMax(steel.fpk, steel.fp01k); // Gl. (5.41), zentral
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
    const rho1000 = RHO_1000[relaxationClass as RelaxationClass]; // EC2 3.3.2(6), zentral

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
    const isPm0Ok = sigmaPm0 <= sigmaPm0Grenze(steel.fpk, steel.fp01k); // Gl. (5.43), zentral

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
    const permCompStress_t0 = SG.betonVorspannen * fck_t0; // EC2 5.10.2.2(5): 0,60 · f_ck(t0)
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
    const permCompStressRare = SG.betonSelten * conc.fck; // EC2 7.2(2): 0,60 · f_ck
    const isRareStressOk = maxCompStress_char <= permCompStressRare;

    // 3. Quasi-ständige Kombination (Endzustand t = ∞): Kombination P_m∞ + M_perm
    const mPermNmm = mPerm * 1e6; // Nmm
    const sigmaMPermTop = (mPermNmm * (-h / 2)) / ic;
    const sigmaMPermBot = (mPermNmm * (h / 2)) / ic;
    const sigmaTotalTop_perm = sigmaN_inf + sigmaMPTop_inf + sigmaMPermTop;
    const sigmaTotalBot_perm = sigmaN_inf + sigmaMPBot_inf + sigmaMPermBot;
    const maxCompStress_perm = Math.max(Math.abs(sigmaTotalTop_perm), Math.abs(sigmaTotalBot_perm));
    const permCompStressQuasi = SG.betonQuasiStaendig * conc.fck; // EC2 7.2(3): 0,45 · f_ck (lineares Kriechen)
    const isQuasiStressOk = maxCompStress_perm <= permCompStressQuasi;

    // 4. Dekompressionsnachweis nach DIN EN 1992-1-1/NA (NCI zu 7.3.1, Tab. 7.1DE):
    // Beton um das Spannglied im Bereich von 100 mm oder h/10 (größerer Wert) überdrückt
    // (EN-Empfehlung: 25 mm). Maßgebend ist die größere Spannung an den Bereichsgrenzen ep ± d_dek,
    // jeweils auf den Querschnitt (± h/2) begrenzt; vereinfacht am ungerissenen Querschnitt (Zustand I).
    const dDekompression = Math.max(100, h / 10);
    const sigmaAt = (z: number) => sigmaN_inf + ((mPinf + mPermNmm) * z) / ic;
    const zTendonZoneA = Math.max(-h / 2, Math.min(h / 2, ep - dDekompression));
    const zTendonZoneB = Math.max(-h / 2, Math.min(h / 2, ep + dDekompression));
    const sigmaTendonZone_perm = Math.max(sigmaAt(zTendonZoneA), sigmaAt(zTendonZoneB));
    const sigmaTendonLevel_perm = sigmaN_inf + ((mPinf + mPermNmm) * ep) / ic;
    const isDecompressed = sigmaTendonZone_perm <= 0;

    // 5. Spannstahlspannungen
    const sigmaP_max_transfer = sigmaPm0Grenze(steel.fpk, steel.fp01k); // Gl. (5.43)
    const sigmaP_inf = (pEffInf * 1000) / ap;
    const sigmaP_perm_char = SG.spannstahlCharakteristisch * steel.fpk; // EC2 7.2(5): 0,75 · f_pk
    const sigmaP_perm_quasi = SG.spannstahlQuasiStaendig * steel.fpk; // NA DE, NCI zu 7.2(5): 0,65 · f_pk
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
  // Fehlerhinweis (z. B. |e_p| ≥ h/2): kein Zahlenergebnis und keine Nachweisaussage (vorher „✓ OK“ trotz Fehler;
  // Prüfung „Kein Ergebnis in der Anzeige“ 02.11.2026)
  const ergebnisGueltig = !hatFehler(eingabeHinweise);
  const materialResults = useMemo(() => (ergebnisGueltig ? materialResultsRoh : ohneZahlen(materialResultsRoh)), [ergebnisGueltig, materialResultsRoh]);

  // Diagramm-Daten präparieren
  const chartData = useMemo(() => {
    const { sigmaN, sigmaMPTop, sigmaMPBot, sigmaMEdTop, sigmaMEdBot, sigmaTotalTop, sigmaTotalBot } = materialResults;
    
    // Spannungsverläufe an den markanten Punkten: Oben (-h/2), Schwerpunkt (0), Unten (h/2)
    const heightLabels = ['Oben (-h/2)', 'Achse (0)', inhalt.werte.untenH2];
    
    return {
      labels: heightLabels,
      datasets: [
        {
          label: inhalt.werte.vorspannungNAnteil,
          data: [sigmaN, sigmaN, sigmaN],
          borderColor: '#94a3b8',
          borderDash: [5, 5],
          borderWidth: 1.5,
          tension: 0,
          pointRadius: 4,
        },
        {
          label: inhalt.werte.vorspannmomentMPAnteil,
          data: [sigmaMPTop, 0, sigmaMPBot],
          borderColor: '#475569',
          borderDash: [3, 3],
          borderWidth: 1.5,
          tension: 0,
          pointRadius: 4,
        },
        {
          label: timeState === 'short_term' ? inhalt.werte.eigengewichtMG1Anteil : inhalt.werte.charakteristischeLastMChar,
          data: [sigmaMEdTop, 0, sigmaMEdBot],
          borderColor: '#64748b',
          borderDash: [3, 3],
          borderWidth: 2,
          tension: 0,
          pointRadius: 4,
        },
        {
          label: inhalt.werte.gesamtspannungTotal,
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
          <Layers className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.spannbetonBemessungBaustoffkennwerteVors} /></h2>
        <div className="mt-3 text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p><MdText text={inhalt.texte.dieVorspannungBeaufschlagtDen} /></p>
        </div>

      </div>

      {/* Reiter-Chunks beim Überfahren/Fokussieren vorladen (wie bisher an der Reiterleiste) */}
      <div onPointerEnter={() => ladeReiter(bereiche)} onFocus={() => ladeReiter(bereiche)} onTouchStart={() => ladeReiter(bereiche)}>
      <ModuleTabs label="Bereiche Spannbeton" tabs={reiter} aktiv={mainTab} onWechsel={setMainTab} className="[&>[role=tablist]]:mb-6">
      {/* 0. TAB: 0-100 VORLESUNGS-LEITFADEN */}
      {bereiche.includes('null_bis_hundert') && mainTab === 'null_bis_hundert' && (
        <div className="animate-in fade-in duration-300">
          <SpannbetonNullBisHundert onNavigateTab={zeigeReiter} />
        </div>
      )}

      {/* 1. TAB: GRUNDPRINZIPIEN & TRAGWERKSTHEORIE */}
      {bereiche.includes('grundprinzipien') && mainTab === 'grundprinzipien' && (
        <div className="animate-in fade-in duration-300">
          <React.Suspense fallback={<Reiterplatz />}><SpannbetonPrinzipien /></React.Suspense>
        </div>
      )}

      {/* 2. TAB: BAUSTOFFKENNWERTE */}
      {bereiche.includes('kennwerte') && mainTab === 'kennwerte' && (
        <div className="animate-in fade-in duration-300">
          <React.Suspense fallback={<Reiterplatz />}><SpannbetonKennwerte /></React.Suspense>
        </div>
      )}

      {bereiche.includes('rechner') && mainTab === 'rechner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
        {/* Left Input Settings - Span 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Geometry & External Loading */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-shiraz uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/10 pb-2">
              <Settings className="h-4 w-4" /><MdText text={inhalt.texte.t1QuerschnittEinwirkung} /></h3>
            
            <Slider
              label={inhalt.werte.querschnittshöheH}
              value={h}
              min={300}
              max={2500}
              step={50}
              onChange={(e) => setH(Number(e.target.value))}
              unit="mm"
            />
            <Slider
              label={inhalt.werte.querschnittsbreiteB}
              value={b}
              min={150}
              max={1500}
              step={50}
              onChange={(e) => setB(Number(e.target.value))}
              unit="mm"
            />
            <Slider
              label={<FormulaText text={inhalt.werte.pressenkraftP0} />}
              value={p0}
              min={500}
              max={12000}
              step={100}
              onChange={(e) => setP0(Number(e.target.value))}
              unit="kN"
            />
            <p className="text-[10px] text-zinc-500 -mt-1"><MdText text={inhalt.texte.pressenkraftBeiPMax} />{formatDeZahl(materialResults.sigmaPmax, 0)}<MdText text={inhalt.texte.nMmAP} />{formatDeZahl(materialResults.ap, 0)} mm² ≈ {formatDeZahl((materialResults.ap / 150), 1)}<MdText text={inhalt.texte.litzen06150} /></p>
            <Slider
              label={<FormulaText text={inhalt.werte.exzentrizitätEPNach} />}
              value={ep}
              min={0}
              max={Math.floor(h / 2 - 60)} // Mindesteisenüberdeckung anrechnen
              step={10}
              onChange={(e) => setEp(Number(e.target.value))}
              unit="mm"
            />
            <div className="pt-2 border-t border-home-grau/15 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block"><MdText text={inhalt.texte.einwirkungenNachBemessungssituationEc2} /></span>
              <Slider
                label={<FormulaText text={inhalt.werte.mG1EigengewichtAb} />}
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
                label={<FormulaText text={inhalt.werte.mCharCharakteristischSelten} />}
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
              <Database className="h-4 w-4" /><MdText text={inhalt.texte.t2BaustoffklassenKennwerte} /></h3>

            {/* Concrete Class */}
            <div>
              <label className="block text-xs font-semibold text-text-main/75 mb-1.5 flex justify-between">
                <span><MdText text={inhalt.texte.betonfestigkeitsklasseDinEn206} /></span>
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
              <div className="text-[11px] font-bold text-text-main uppercase tracking-wider border-b border-zinc-200 pb-1 flex justify-between">
                <span><MdText text={inhalt.texte.betonreifeBeimSpannenT} /></span>
                <span className="text-shiraz text-[10px] font-bold"><MdText text={inhalt.texte.ec2Kap31} /></span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-text-main/70 mb-1">Zementklasse</label>
                  <select aria-label="Zementklasse"
                    value={cementType}
                    onChange={(e) => setCementType(e.target.value as typeof cementType)}
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
                    aria-label="Alter t₀"
                    aria-valuetext={`${formatDeWert(concreteAge)} d`}
                    onChange={(e) => setConcreteAge(Number(e.target.value))}
                    className="w-full accent-shiraz mt-1"
                  />
                </div>
              </div>
              <div className="text-[10px] text-zinc-650 dark:text-zinc-300 space-y-0.5 font-mono pt-1 border-t border-dashed border-zinc-200">
                <div className="flex justify-between">
                  <span><MdText text={inhalt.texte.minderungsfaktorCcT} /></span>
                  <span className="font-bold">{formatDeZahl(materialResults.betaCc, 3)}</span>
                </div>
                <div className="flex justify-between">
                  <span><MdText text={inhalt.texte.druckfestigkeitFCkT} /></span>
                  <strong className="text-shiraz">{formatDeZahl(materialResults.fck_t0, 1)} N/mm²</strong>
                </div>
                <div className="flex justify-between">
                  <span><MdText text={inhalt.texte.moduliertesECmT} /></span>
                  <strong className="text-slate-800">{formatDeWert(Math.round(materialResults.Ecm_t0))} N/mm²</strong>
                </div>
              </div>
            </div>

            {/* Prestressing Steel Class */}
            <div>
              <label className="block text-xs font-semibold text-text-main/75 mb-1.5 flex justify-between">
                <span><MdText text={inhalt.texte.spannstahlGüteAbzDes} /></span>
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
              <div className="font-bold text-text-main uppercase text-[10px] tracking-wider mb-1 block"><MdText text={inhalt.texte.aktiveMaterialkoeffizienten} /></div>
              <div className="flex justify-between border-b border-home-grau/10 pb-1">
                <span><MdText text={inhalt.texte.betonzugfestigkeitFCtm} /></span>
                <span className="font-bold text-shiraz">{formatDeZahl(materialResults.conc.fctm, 1)} N/mm²</span>
              </div>
              <div className="flex justify-between border-b border-home-grau/10 pb-1">
                <span><MdText text={inhalt.texte.betonEModulE} /></span>
                <span>{formatDeWert(materialResults.conc.Ecm)} N/mm²</span>
              </div>
              <div className="flex justify-between border-b border-home-grau/10 pb-1">
                <span><MdText text={inhalt.texte.t01GrenzeSpannstahl} /></span>
                <span>{formatDeWert(materialResults.steel.fp01k)} N/mm²</span>
              </div>
              <div className="flex justify-between">
                <span><MdText text={inhalt.texte.zugehörigerEModulE} /></span>
                <span>{formatDeWert(materialResults.steel.Ep)} N/mm²</span>
              </div>
            </div>
          </div>

          {/* Card 3: Boundary / Time & ENVIRONMENT */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-shiraz uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/10 pb-2">
              <Clock className="h-4 w-4" /><MdText text={inhalt.texte.t3ZeitstandUmweltVerluste} /></h3>

            {/* Time toggle */}
            <div>
              <label className="block text-xs font-semibold text-text-main/75 mb-1.5"><MdText text={inhalt.texte.betrachteterBetriebszeitpunkt} /></label>
              <AuswahlGruppe label="Betriebszeitpunkt" className="grid grid-cols-2 gap-2">
                <button {...alsOption(timeState === 'short_term')}
                  type="button"
                  onClick={() => setTimeState('short_term')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${timeState === 'short_term' ? 'bg-shiraz border-shiraz text-white shadow-sm' : 'bg-off-white border-home-grau/30 text-text-main hover:bg-home-grau/10'}`}
                ><MdText text={inhalt.texte.transferKurzzeitT0} /></button>
                <button {...alsOption(timeState === 'long_term')}
                  type="button"
                  onClick={() => setTimeState('long_term')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${timeState === 'long_term' ? 'bg-shiraz border-shiraz text-white shadow-sm' : 'bg-off-white border-home-grau/30 text-text-main hover:bg-home-grau/10'}`}
                ><MdText text={inhalt.texte.gebrauchsphaseLangzeitT} /></button>
              </AuswahlGruppe>
            </div>

            {/* Environment Humidity */}
            <div>
              <label className="block text-xs font-semibold text-text-main/75 mb-1.5"><MdText text={inhalt.texte.umfeldSzenarioLuftfeuchteRh} /></label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEnvironmentRH(50)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border transition ${environmentRH === 50 ? 'bg-shiraz border-shiraz text-white' : 'bg-off-white border-home-grau/30 text-text-main'}`}
                ><MdText text={inhalt.texte.trockenesInnenraumUmfeld} /><div className="text-[10px] opacity-80"><MdText text={inhalt.texte.rh50} />{formatDeZahl(creep(materialResults.conc.fck, concreteAge, cementType, materialResults.h0, 50), 2)}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setEnvironmentRH(80)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border transition ${environmentRH === 80 ? 'bg-shiraz border-shiraz text-white' : 'bg-off-white border-home-grau/30 text-text-main'}`}
                ><MdText text={inhalt.texte.feuchtesAußenUmfeld} /><div className="text-[10px] opacity-80"><MdText text={inhalt.texte.rh80} />{formatDeZahl(creep(materialResults.conc.fck, concreteAge, cementType, materialResults.h0, 80), 2)}</div>
                </button>
              </div>
            </div>

            {/* Relaxation Class */}
            <div>
              <label className="block text-xs font-semibold text-text-main/75 mb-1.5">Stahlrelaxationsklasse</label>
              <select aria-label="Stahlrelaxationsklasse"
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
              <Activity className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.t4SpanngliedReibungsverluste} /></h3>

            {/* Tendon System Select */}
            <div>
              <label className="block text-xs font-semibold text-text-main/75 mb-1.5 flex justify-between border-slate-100">
                <span>Spannglied-Verbundart</span>
              </label>
              <select aria-label="Spannglied-Verbundart"
                value={tendonSystem}
                onChange={(e) => setTendonSystem(e.target.value as typeof tendonSystem)}
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
                    <span><MdText text={inhalt.texte.trägerstützweiteL} /></span>
                    <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(spanLength)} m</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={spanLength}
                    aria-label={reglerName(inhalt.texte.trägerstützweiteL)}
                    aria-valuetext={`${formatDeWert(spanLength)} m`}
                    onChange={(e) => setSpanLength(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                </div>

                {/* Reibungsbeiwert µ */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span><MdText text={inhalt.texte.reibungsbeiwertEc2Tab5} /></span>
                    <span className="font-mono text-xs font-bold text-shiraz">{formatDeZahl(frictionCoeff, 2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.30"
                    step="0.01"
                    value={frictionCoeff}
                    aria-label={reglerName(inhalt.texte.reibungsbeiwertEc2Tab5)}
                    aria-valuetext={`${formatDeZahl(frictionCoeff, 2)}`}
                    onChange={(e) => setFrictionCoeff(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="text-[10px] text-zinc-500 flex justify-between">
                    <span>{formatDeZahl(0.05, 2)} Monolitze</span>
                    <span>{formatDeZahl(0.13, 2)} Plastik</span>
                    <span>{formatDeZahl(0.20, 2)}–{formatDeZahl(0.24, 2)} Metall</span>
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
                      aria-label="Wobble k"
                      aria-valuetext={`${formatDeZahl(wobbleCoeff, 4)}`}
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
                      aria-label="Krümmung θ"
                      aria-valuetext={`${formatDeZahl(totalCurvature, 2)} rad`}
                      onChange={(e) => setTotalCurvature(Number(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                  </div>
                </div>

                {/* Anzahl nacheinander gespannter Spannglieder n */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span><MdText text={inhalt.texte.anzahlNacheinanderGespannterSpannglieder} /></span>
                    <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(nTendons)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={nTendons}
                    aria-label={reglerName(inhalt.texte.anzahlNacheinanderGespannterSpannglieder)}
                    aria-valuetext={`${formatDeWert(nTendons)}`}
                    onChange={(e) => setNTendons(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <p className="text-[10px] text-zinc-400 leading-normal"><MdText text={inhalt.texte.elastischeVerkürzungMitJ} /></p>
                </div>
              </div>
            )}

            {/* Keilschlupf Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span><MdText text={inhalt.texte.verankerungsschlupfWKeilschlupf} /></span>
                <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(anchorSlip)} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={anchorSlip}
                aria-label={reglerName(inhalt.texte.verankerungsschlupfWKeilschlupf)}
                aria-valuetext={`${formatDeWert(anchorSlip)} mm`}
                onChange={(e) => setAnchorSlip(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <p className="text-[10px] text-zinc-400 leading-normal">
                {tendonSystem === 'pretensioning' 
                  ? inhalt.werte.spannbettDerKeilschlupfTritt
                  : inhalt.werte.nachträglicherVerbundErleidetBeim}
              </p>
            </div>
          </div>
        </div>

        {/* Right Outputs & Visualization - Span 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <EingabeHinweise hinweise={eingabeHinweise} />
          {/* Card A: Chart of stresses */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-home-grau/10 pb-2">
              <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Gauge className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.druckUndZugspannungsverlaufÜber} /></h3>
              <span className="text-xs px-2.5 py-1 rounded bg-shiraz/5 text-shiraz font-bold font-mono">
                {timeState === 'short_term' ? inhalt.werte.dauerT0Transfer : inhalt.werte.dauerTEndzustand}
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
                      title: inhalt.daten["Spannbeton.options.scales.x.title"],
                      grid: { color: (ctx) => ctx.tick.value === 0 ? '#A3113E' : '#e2e8f0', lineWidth: (ctx) => ctx.tick.value === 0 ? 2 : 1 }
                    },
                    y: {
                      reverse: true, // Oben ist h/2 negativ
                      title: { display: true, text: inhalt.werte.relativeFaserH2 }
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
            {ergebnisGueltig && <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className={`p-3 rounded-lg border ${materialResults.isCrackedTop ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                <div className="font-bold mb-1"><MdText text={inhalt.texte.obererRandH2} /></div>
                <div className="text-sm font-semibold">{formatDeZahl(materialResults.sigmaTotalTop, 2)} MPa</div>
                <div className="text-[10px] mt-1 opacity-80">
                  {materialResults.isCrackedTop 
                    ? `Zuggrenze f_ctm (${formatDeZahl(materialResults.conc.fctm, 1)} MPa) überschritten! Risse zu erwarten.` 
                    : materialResults.sigmaTotalTop > 0 
                      ? inhalt.werte.beschränkteZugspannungFCtm 
                      : inhalt.werte.komplettÜberdrücktZustandI}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${materialResults.isCrackedBot ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                <div className="font-bold mb-1"><MdText text={inhalt.texte.untererRandH2} /></div>
                <div className="text-sm font-semibold">{formatDeZahl(materialResults.sigmaTotalBot, 2)} MPa</div>
                <div className="text-[10px] mt-1 opacity-80">
                  {materialResults.isCrackedBot 
                    ? `Zuggrenze f_ctm (${formatDeZahl(materialResults.conc.fctm, 1)} MPa) überschritten! Risse zu erwarten.` 
                    : materialResults.sigmaTotalBot > 0 
                      ? inhalt.werte.beschränkteZugspannung 
                      : inhalt.werte.komplettÜberdrücktZustandI2}
                </div>
              </div>
            </div>}
          </div>

          <FormulaDerivationBox
            live
            title={timeState === 'short_term' ? inhalt.werte.ihrRechenwegRandspannungenBeim : inhalt.werte.ihrRechenwegRandspannungenIm}
            zielGleichung={`\\sigma_{o/u} = -\\frac{P}{A_c} \\pm \\frac{P \\cdot e_p}{W} \\mp \\frac{M}{W} = ${formatDeTeX(materialResults.sigmaTotalTop, 2)} \\;/\\; ${formatDeTeX(materialResults.sigmaTotalBot, 2)}\\,\\text{N/mm}^2`}
            normQuelle={inhalt.werte.dinEn19921}
            schritte={[
              {
                titel: 'Querschnittswerte',
                erklaerung: inhalt.werte.ungerissenerRechteckquerschnittZustandI,
                formel: `A_c = ${formatDeTeX(b, 0)} \\cdot ${formatDeTeX(h, 0)} = ${formatDeTeX(materialResults.ac, 0)}\\,\\text{mm}^2;\\quad W = \\frac{b \\cdot h^2}{6} = ${formatDeTeX(materialResults.wTop / 1e6, 2)} \\cdot 10^{6}\\,\\text{mm}^3`,
              },
              {
                titel: inhalt.werte.wirksameVorspannkraft,
                erklaerung: timeState === 'short_term'
                  ? `Nach den Sofortverlusten (Reibung, Keilschlupf, elastische Verkürzung) von zusammen ${formatDeZahl(materialResults.totalImmediateLossPct, 1)} %.`
                  : `Nach allen Verlusten (Sofortverluste sowie Kriechen, Schwinden und Relaxation) von zusammen ${formatDeZahl(materialResults.totalLossPct, 1)} %.`,
                formel: `P = ${formatDeTeX(p0, 0)} \\cdot \\left(1 - \\frac{${formatDeTeX(timeState === 'short_term' ? materialResults.totalImmediateLossPct : materialResults.totalLossPct, 2)}}{100}\\right) = ${formatDeTeX(materialResults.pEff, 0)}\\,\\text{kN}`,
              },
              {
                titel: inhalt.werte.spannungenAusDerVorspannung,
                erklaerung: inhalt.werte.zentrischerAnteilPA,
                formel: `\\sigma_N = -\\frac{${formatDeTeX(materialResults.pEff * 1000, 0)}}{${formatDeTeX(materialResults.ac, 0)}} = ${formatDeTeX(materialResults.sigmaN, 2)};\\quad \\sigma_{P,o/u} = \\pm\\frac{${formatDeTeX(materialResults.pEff * 1000, 0)} \\cdot ${formatDeTeX(ep, 0)}}{${formatDeTeX(materialResults.wTop, 0)}} = ${formatDeTeX(materialResults.sigmaMPTop, 2)} \\;/\\; ${formatDeTeX(materialResults.sigmaMPBot, 2)}\\,\\text{N/mm}^2`,
              },
              {
                titel: timeState === 'short_term' ? inhalt.werte.spannungenAusDemEigengewicht : inhalt.werte.spannungenAusDerCharakteristischen,
                erklaerung: timeState === 'short_term'
                  ? inhalt.werte.beimSpannenWirktNur
                  : inhalt.werte.imEndzustandWirdDas,
                formel: `\\sigma_{M,o/u} = \\mp\\frac{${formatDeTeX((timeState === 'short_term' ? mG1 : mChar) * 1e6, 0)}}{${formatDeTeX(materialResults.wTop, 0)}} = ${formatDeTeX(materialResults.sigmaMEdTop, 2)} \\;/\\; ${formatDeTeX(materialResults.sigmaMEdBot, 2)}\\,\\text{N/mm}^2`,
              },
              {
                titel: inhalt.werte.randspannungenDruckNegativ,
                erklaerung: `Superposition der Anteile. Grenzwert der Betondruckspannung: ${timeState === 'short_term' ? `0,60 · f_ck(t₀) = ${formatDeZahl(materialResults.permCompStress_t0, 1)}` : `0,60 · f_ck = ${formatDeZahl(materialResults.permCompStressRare, 1)}`} N/mm².`,
                formel: `\\sigma_o = ${formatDeTeX(materialResults.sigmaN, 2)} + ${formatDeTeX(materialResults.sigmaMPTop, 2)} + (${formatDeTeX(materialResults.sigmaMEdTop, 2)}) = ${formatDeTeX(materialResults.sigmaTotalTop, 2)};\\quad \\sigma_u = ${formatDeTeX(materialResults.sigmaN, 2)} + (${formatDeTeX(materialResults.sigmaMPBot, 2)}) + ${formatDeTeX(materialResults.sigmaMEdBot, 2)} = ${formatDeTeX(materialResults.sigmaTotalBot, 2)}\\,\\text{N/mm}^2`,
              },
            ]}
            ergebnisHinweis={`Oberer Rand ${formatDeZahl(materialResults.sigmaTotalTop, 2)} MPa, unterer Rand ${formatDeZahl(materialResults.sigmaTotalBot, 2)} MPa`}
          />

          {/* Card GZG: Spannungsbegrenzungen nach DIN EN 1992-1-1, 7.2 */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/10 pb-2">
              <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.gebrauchstauglichkeitGzgSpannungsbegrenz} /></h3>
              <span className="text-[11px] font-mono bg-slate-100 px-2.5 py-0.5 rounded text-slate-700 font-bold"><MdText text={inhalt.texte.dinEn19921} /></span>
            </div>

            {ergebnisGueltig ? (<>
            {/* 4 Status-Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className={`p-2.5 rounded-lg border ${materialResults.isTransferStressOk ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <div className="text-[10px] uppercase font-sans font-bold"><MdText text={inhalt.texte.t1TransferT0} /></div>
                <div className="text-sm font-bold mt-0.5">{formatDeZahl(materialResults.maxCompStress_t0, 1)} / {formatDeZahl(materialResults.permCompStress_t0, 1)} MPa</div>
                <div className="text-[10px] mt-1 font-sans">{materialResults.isTransferStressOk ? inhalt.werte.eingehalten : inhalt.werte.längsrissgefahrBeimSpannen}</div>
              </div>

              <div className={`p-2.5 rounded-lg border ${materialResults.isRareStressOk ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <div className="text-[10px] uppercase font-sans font-bold"><MdText text={inhalt.texte.t2SelteneLast0} /></div>
                <div className="text-sm font-bold mt-0.5">{formatDeZahl(materialResults.maxCompStress_char, 1)} / {formatDeZahl(materialResults.permCompStressRare, 1)} MPa</div>
                <div className="text-[10px] mt-1 font-sans">{materialResults.isRareStressOk ? inhalt.werte.eingehalten2 : inhalt.werte.längsrissgefahr}</div>
              </div>

              <div className={`p-2.5 rounded-lg border ${materialResults.isQuasiStressOk ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                <div className="text-[10px] uppercase font-sans font-bold"><MdText text={inhalt.texte.t3QuasiStändig0} /></div>
                <div className="text-sm font-bold mt-0.5">{formatDeZahl(materialResults.maxCompStress_perm, 1)} / {formatDeZahl(materialResults.permCompStressQuasi, 1)} MPa</div>
                <div className="text-[10px] mt-1 font-sans">{materialResults.isQuasiStressOk ? inhalt.werte.linearesKriechen : inhalt.werte.nichtlinearesKriechen}</div>
              </div>

              <div className={`p-2.5 rounded-lg border ${materialResults.isDecompressed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <div className="text-[10px] uppercase font-sans font-bold"><MdText text={inhalt.texte.t4DekompressionMax100} /></div>
                <div className="text-sm font-bold mt-0.5">{formatDeZahl(materialResults.sigmaTendonZone_perm, 2)} MPa</div>
                <div className="text-[10px] mt-1 font-sans">{materialResults.isDecompressed ? inhalt.werte.rissfreiÜberdrückt : inhalt.werte.zugspannungAmKabel}</div>
              </div>
            </div>

            {/* Tabelle 3 (GZG-Spannungsbegrenzungen nach DIN EN 1992-1-1) */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-2"><MdText text={inhalt.texte.nachweiskriteriumGzg} /></th>
                    <th className="p-2"><MdText text={inhalt.texte.zulässigeSpannungsgrenze} /></th>
                    <th className="p-2"><MdText text={inhalt.texte.relevanteEinwirkungskombination} /></th>
                    <th className="p-2"><MdText text={inhalt.texte.aktuellerWertNachweis} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2 font-semibold"><MdText text={inhalt.texte.spannzeitpunktTTransfer} /></td>
                    <td className="p-2 font-mono"><InlineMath math="\sigma_c \le 0{,}60 \cdot f_{ck}(t_0)" /> ({formatDeZahl(materialResults.permCompStress_t0, 1)} MPa)</td>
                    <td className="p-2"><InlineMath math="P_{m0} + M_{g1}" /> ({formatDeWert(mG1)} kNm)</td>
                    <td className="p-2 font-mono">{formatDeZahl(materialResults.maxCompStress_t0, 1)} MPa {materialResults.isTransferStressOk ? <span className="text-emerald-700 font-bold">✓ OK</span> : <span className="text-red-700 font-bold"><MdText text={inhalt.texte.überschritten} /></span>}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2 font-semibold"><MdText text={inhalt.texte.betondruckspannungLängsrisse} /></td>
                    <td className="p-2 font-mono"><InlineMath math="\sigma_c \le 0{,}60 \cdot f_{ck}" /> ({formatDeZahl(materialResults.permCompStressRare, 1)} MPa)</td>
                    <td className="p-2"><MdText text={inhalt.texte.charakteristischPMinftyM} />{formatDeWert(mChar)} kNm)</td>
                    <td className="p-2 font-mono">{formatDeZahl(materialResults.maxCompStress_char, 1)} MPa {materialResults.isRareStressOk ? <span className="text-emerald-700 font-bold">✓ OK</span> : <span className="text-red-700 font-bold"><MdText text={inhalt.texte.überschritten2} /></span>}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2 font-semibold"><MdText text={inhalt.texte.betondruckspannungKriechen} /></td>
                    <td className="p-2 font-mono"><InlineMath math="\sigma_c \le 0{,}45 \cdot f_{ck}" /> ({formatDeZahl(materialResults.permCompStressQuasi, 1)} MPa)</td>
                    <td className="p-2"><MdText text={inhalt.texte.quasiStändigPMinfty} />{formatDeWert(mPerm)} kNm)</td>
                    <td className="p-2 font-mono">{formatDeZahl(materialResults.maxCompStress_perm, 1)} MPa {materialResults.isQuasiStressOk ? <span className="text-emerald-700 font-bold">✓ OK</span> : <span className="text-amber-700 font-bold"><MdText text={inhalt.texte.nichtlinear} /></span>}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2 font-semibold"><MdText text={inhalt.texte.dekompressionSpanngliedhöheMax100} /></td>
                    <td className="p-2 font-mono"><MdText text={inhalt.texte.sigmaCLe0} /></td>
                    <td className="p-2">Quasi-ständig: <InlineMath math="P_{m\infty} + M_{perm}" /></td>
                    <td className="p-2 font-mono">{formatDeZahl(materialResults.sigmaTendonZone_perm, 2)} MPa {materialResults.isDecompressed ? <span className="text-emerald-700 font-bold"><MdText text={inhalt.texte.okÜberdrückt} /></span> : <span className="text-red-700 font-bold"><MdText text={inhalt.texte.zugspannungen} /></span>}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2 font-semibold"><MdText text={inhalt.texte.betonstahlspannungZustand} /></td>
                    <td className="p-2 font-mono"><InlineMath math="\sigma_s \le 0{,}80 \cdot f_{yk}" /> (400 MPa)</td>
                    <td className="p-2">Charakteristisch</td>
                    <td className="p-2 font-mono">
                      {materialResults.isCrackedBot ? (
                        <span className="text-amber-700 font-bold"><MdText text={inhalt.texte.zustandIiNachweisIm} /></span>
                      ) : (
                        <span className="text-emerald-700 font-bold"><MdText text={inhalt.texte.zustandIElastischSigma} /></span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2 font-semibold"><MdText text={inhalt.texte.spannstahlspannungEndzustandTInfty} /></td>
                    <td className="p-2 font-mono"><InlineMath math="\sigma_p \le 0{,}65 \cdot f_{pk}" /> ({formatDeZahl(materialResults.sigmaP_perm_quasi, 0)} MPa)</td>
                    <td className="p-2">Quasi-ständig: <InlineMath math="P_{m\infty} + M_{perm}" /></td>
                    <td className="p-2 font-mono">{formatDeZahl(materialResults.sigmaP_inf, 0)} MPa {materialResults.isSteelStressOk ? <span className="text-emerald-700 font-bold">✓ OK</span> : <span className="text-red-700 font-bold"><MdText text={inhalt.texte.überschritten3} /></span>}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            </>) : <p className="text-sm text-text-main">–</p>}
          </div>

          {/* Card B: Loss Breakdown Panel */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/10 pb-2">
              <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.spezifischeVorspannungsverlusteLossCalcu} /></h3>
              
              {/* Toggle tabs */}
              <ReiterLeiste label="Vorspannverluste" className="flex bg-slate-100 p-1 rounded-lg shrink-0">
                <button {...alsReiter(lossTab === 'overview', 'spannbeton-verlust', 'overview')}
                  type="button"
                  onClick={() => setLossTab('overview')}
                  className={`py-1 px-2.5 text-xs font-semibold rounded-md transition cursor-pointer select-none ${lossTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Übersicht
                </button>
                <button {...alsReiter(lossTab === 'calculations', 'spannbeton-verlust', 'calculations')}
                  type="button"
                  onClick={() => setLossTab('calculations')}
                  className={`py-1 px-2.5 text-xs font-semibold rounded-md transition cursor-pointer select-none ${lossTab === 'calculations' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                ><MdText text={inhalt.texte.rechengangEc2} /></button>
              </ReiterLeiste>
            </div>

            {lossTab === 'overview' ? (
              <div {...reiterPanel('spannbeton-verlust', lossTab)} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                {/* Force values overview */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-xs"><MdText text={inhalt.texte.nominaleSpannkraftP0} /></span>
                    <span className="font-bold font-mono">{formatDeWert(p0)} kN</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-600 border-b border-dashed border-slate-100 pb-1.5">
                    <span className="text-xs font-medium"><MdText text={inhalt.texte.nachSofortverlustenT0} /></span>
                    <span className="font-bold font-mono text-sm">{formatDeZahl(materialResults.pEff0, 0)} kN (-{formatDeZahl(materialResults.totalImmediateLossPct, 1)}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-shiraz">
                    <span className="text-xs font-bold"><MdText text={inhalt.texte.endzustandT} /></span>
                    <span className="font-bold font-mono text-base">{formatDeZahl(materialResults.pEffInf, 0)} kN (-{formatDeZahl(materialResults.totalLossPct, 1)}%)</span>
                  </div>
                  <div className="text-[11px] text-text-main/70 bg-off-white p-2.5 rounded border border-home-grau/20 font-mono space-y-1">
                    <p><MdText text={inhalt.texte.effektiverNutzgradImEndzustand} /><strong>{formatDeZahl(((materialResults.pEffInf / p0) * 100), 1)}%</strong> von P_0.</p>
                    <p className="text-[10px] text-slate-500"><MdText text={inhalt.texte.betondruckInSpanngliedhöheBeim} /><strong>{formatDeZahl(materialResults.sigmaCp0, 2)} N/mm²</strong></p>
                  </div>
                </div>

                {/* Loss itemized list */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="text-[10px] uppercase font-bold text-text-main/60 tracking-wider"><MdText text={inhalt.texte.itemisierteVerlusttreiber} /></div>
                  {materialResults.frictionLossPct > 0 && (
                    <div className="flex justify-between items-center bg-amber-50/20 p-2 rounded border border-amber-100">
                      <span className="font-sans font-medium text-slate-700"><MdText text={inhalt.texte.reibungSpanngliedHüllrohr} /></span>
                      <span className="font-bold text-amber-600">{formatDeZahl(materialResults.frictionLossPct, 1)}%</span>
                    </div>
                  )}
                  {materialResults.slipLossPct > 0 && (
                    <div className="flex justify-between items-center bg-zinc-50 p-2 rounded border border-zinc-200">
                      <span className="font-sans font-medium text-slate-700"><MdText text={inhalt.texte.verankerungsschlupfKeileinzug} /></span>
                      <span className="font-bold text-zinc-650 dark:text-zinc-300">{formatDeZahl(materialResults.slipLossPct, 1)}%</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded border border-blue-100">
                    <span className="font-sans font-medium text-slate-700"><MdText text={inhalt.texte.elastischeSofortverkürzungT0} /></span>
                    <span className="font-bold text-blue-600">{formatDeZahl(materialResults.elasticLossPct, 1)}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-amber-50/50 p-2 rounded border border-amber-100">
                    <span className="font-sans font-medium text-slate-700"><MdText text={inhalt.texte.schwindenBetonKriechen} /></span>
                    <span className="font-bold text-amber-700">{formatDeZahl(materialResults.lossCsPct, 1)}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-purple-50/50 p-2 rounded border border-purple-100">
                    <span className="font-sans font-medium text-slate-700"><MdText text={inhalt.texte.stahlrelaxation500000H} /></span>
                    <span className="font-bold text-purple-700">{formatDeZahl(materialResults.lossRPct, 1)}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-shiraz/5 p-2 rounded border border-shiraz/20 text-shiraz font-bold">
                    <span className="font-sans"><MdText text={inhalt.texte.gesamterVerlustanteil} /></span>
                    <span>{formatDeZahl(materialResults.totalLossPct, 1)}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div {...reiterPanel('spannbeton-verlust', lossTab)} className="space-y-4 font-mono text-xs animate-in fade-in duration-300">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 text-[10px] uppercase tracking-wider mb-2"><MdText text={inhalt.texte.t1GrundparameterInputs} /></div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                    <div><MdText text={inhalt.texte.spannungAnDerPresse} /><span className="font-bold text-slate-800">σ_p,max = {formatDeZahl(materialResults.sigmaP0, 0)} N/mm²</span></div>
                    <div><MdText text={inhalt.texte.nachSofortverlusten} /><span className={`font-bold ${materialResults.isPm0Ok ? 'text-slate-800' : 'text-red-600'}`}>σ_pm0 = {formatDeZahl(materialResults.sigmaPm0, 0)} N/mm²</span> (≤ {formatDeZahl(materialResults.sigmaP_max_transfer, 0)})</div>
                    <div><MdText text={inhalt.texte.wirksameDicke} /><span className="font-bold text-slate-800"><MdText text={inhalt.texte.h2aCU} />{formatDeZahl(materialResults.h0, 0)} mm</span></div>
                    <div>Nachweisschnitt: <span className="font-bold text-slate-800">x = L/2 = {formatDeZahl(materialResults.xSection, 1)} m</span></div>
                    <div><MdText text={inhalt.texte.verhältnisEModuln} /><span className="font-bold text-slate-800">α_p = {formatDeZahl(materialResults.alphaP_lt, 2)}</span></div>
                    <div><MdText text={inhalt.texte.berechneteStahlquerschnittsfläche} /><span className="font-bold text-slate-800">A_p ≈ {formatDeZahl(materialResults.ap, 0)} mm²</span></div>
                    <div><MdText text={inhalt.texte.exzentrizitätBruttoquerschnitt} /><span className="font-bold text-slate-800"><MdText text={inhalt.texte.zCpEP} />{formatDeWert(ep)} mm</span></div>
                  </div>
                </div>

                {/* Mechanische Verluste */}
                {(materialResults.frictionLossPct > 0 || materialResults.slipLossPct > 0) && (
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 space-y-2">
                    <div className="font-bold text-zinc-900 text-[10px] uppercase tracking-wider"><MdText text={inhalt.texte.t15MechanischeSofortverluste} /></div>
                    <p className="text-[10px] text-slate-600 font-sans italic"><MdText text={inhalt.texte.reibungNachEc25} /></p>
                    <div className="bg-white p-2.5 rounded border border-zinc-150 font-mono text-[11px] leading-relaxed space-y-1.5">
                      {materialResults.frictionLossPct > 0 && (
                        <div>Reibungsanteil: <span className="text-zinc-700 font-semibold">{formatDeZahl(materialResults.frictionLossPct, 2)}%</span> <span className="text-[10px] text-zinc-550"><MdText text={inhalt.texte.t1EXL} />{formatDeWert(materialResults.frictionCoeff)}, θ = {formatDeWert(materialResults.totalCurvature)} rad, k = {formatDeWert(materialResults.wobbleCoeff)}/m, x = {formatDeZahl(materialResults.xSection, 1)} m)</span></div>
                      )}
                      {materialResults.anchorSlip > 0 && (
                        <div>Keilschlupf-Anteil: <span className="text-zinc-700 font-semibold">{formatDeZahl(materialResults.slipLossPct, 2)}%</span> <span className="text-[10px] text-zinc-550"><MdText text={inhalt.texte.einflusslängeLSetW} />{formatDeZahl(materialResults.lSet, 1)} m{materialResults.lSet < materialResults.xSection ? inhalt.werte.xFeldmitteVomSchlupf : ''})</span></div>
                      )}
                      <div className="pt-1 border-t border-dashed border-zinc-200"><MdText text={inhalt.texte.summeMechanischeVerluste} /><strong className="text-shiraz">{formatDeZahl(materialResults.immediateTendonLossPct, 2)}%</strong></div>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-blue-50/30 rounded-lg border border-blue-100 space-y-2">
                  <div className="font-bold text-blue-900 text-[10px] uppercase tracking-wider"><MdText text={inhalt.texte.t2ElastischerSofortverlustKurzzeit} /></div>
                  <p className="text-[10px] text-slate-600 font-sans italic"><MdText text={inhalt.texte.verkürzungDesBetonsBeim} /></p>
                  <div className="bg-white p-2 rounded border border-blue-100/60 font-mono text-[11px] leading-relaxed space-y-1">
                    <div>Formel: <span className="text-blue-700 font-bold"><MdText text={inhalt.texte.pElJE} /></span></div>
                    <div>Rechnung: {formatDeZahl(materialResults.factorEl, 3)} · {formatDeIntl(materialResults.steel.Ep)} · ({formatDeZahl(materialResults.sigmaCp0, 2)} / {formatDeIntl(Math.round(materialResults.Ecm_t0))}) = <span className="font-bold text-blue-700">{formatDeZahl(materialResults.deltaSigmaP_el, 1)} N/mm²</span></div>
                    <div>Verlustwert: <span className="font-bold text-blue-700"> {formatDeZahl(materialResults.elasticLossPct, 2)} %</span> (entspricht {formatDeZahl((p0 * materialResults.elasticLossPct / 100), 1)}<MdText text={inhalt.texte.knKraftverlust} /></div>
                  </div>
                </div>

                <div className="p-3 bg-purple-50/30 rounded-lg border border-purple-100 space-y-2">
                  <div className="font-bold text-purple-900 text-[10px] uppercase tracking-wider"><MdText text={inhalt.texte.t3StahlrelaxationFürT} /></div>
                  <p className="text-[10px] text-slate-600 font-sans italic"><MdText text={inhalt.texte.reinerViskoelastischerSpannungsabfallDes} /></p>
                  <div className="bg-white p-2 rounded border border-purple-100/60 font-mono text-[11px] leading-relaxed space-y-1">
                    <div>Klasse {formatDeWert(relaxationClass)}: <span className="text-purple-700">ρ_1000 = {formatDeZahl((materialResults.rho1000 * 100), 1)} %</span><MdText text={inhalt.texte.pm0FPk} />{formatDeZahl((materialResults.sigmaPm0 / materialResults.steel.fpk), 3)}</div>
                    <div><MdText text={inhalt.texte.gl3283} /><span className="font-bold text-purple-700">Δσ_pr = {formatDeZahl(materialResults.deltaSigmaPr, 1)} N/mm²</span> ({formatDeZahl((materialResults.deltaSigmaPr / materialResults.sigmaPm0 * 100), 1)}<MdText text={inhalt.texte.vonPm0} /></div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/20 rounded-lg border border-amber-100 space-y-2">
                  <div className="font-bold text-amber-900 text-[10px] uppercase tracking-wider"><MdText text={inhalt.texte.t4LangzeitGesamtverlusteC} /></div>
                  <p className="text-[10px] text-slate-600 font-sans italic"><MdText text={inhalt.texte.interaktiveÜberlagerungVonBeton} /></p>
                  <div className="bg-white p-2.5 rounded border border-amber-150 font-mono text-[11.5px] leading-relaxed space-y-2">
                    <div className="text-[10.5px]">
                      <div>Eingangswerte: <span className="text-amber-800">φ(∞,t₀) = {formatDeZahl(materialResults.phi, 2)}, ε_cs(∞) = {formatDeZahl(materialResults.epsCsPermille, 3)} ‰, σ_c,QP = {formatDeZahl(materialResults.sigmaCQP, 2)} N/mm²</span><MdText text={inhalt.texte.pM0MPerm} /></div>
                      <div>Zählerwert: <span className="text-amber-800"><MdText text={inhalt.texte.csEP0} /></span></div>
                      <div className="pl-4">= ({formatDeZahl((materialResults.epsCs * 1000), 3)}·10⁻³ · {formatDeIntl(materialResults.steel.Ep)}) + (0,8 · {formatDeZahl(materialResults.deltaSigmaPr, 1)}) + ({formatDeZahl(materialResults.alphaP_lt, 2)} · {formatDeZahl(materialResults.phi, 2)} · {formatDeZahl(materialResults.sigmaCQP, 2)})</div>
                      <div className="pl-4 font-bold text-amber-850">= {formatDeZahl((materialResults.epsCs * materialResults.steel.Ep), 1)} + {formatDeZahl((0.8 * materialResults.deltaSigmaPr), 1)} + {formatDeZahl((materialResults.phi * materialResults.alphaP_lt * materialResults.sigmaCQP), 1)} = {formatDeZahl(materialResults.numerator, 1)} N/mm²</div>
                    </div>
                    <div className="text-[10.5px] border-t border-dashed border-slate-200 pt-1.5">
                      <div>Nenner-Struktur: <span className="text-amber-800"><MdText text={inhalt.texte.t1PAP} /></span></div>
                      <div className="pl-4">= 1 + {formatDeZahl(materialResults.alphaP_lt, 2)} · ({formatDeZahl(materialResults.ap, 0)} / {formatDeWert(materialResults.ac)}) · [1 + ({formatDeWert(materialResults.ac)} · {formatDeWert(Math.pow(ep, 2))}) / {Number.isFinite(materialResults.ic) ? materialResults.ic.toExponential(2) : '–'}] · (1 + 0,8 · {formatDeZahl(materialResults.phi, 2)})</div>
                      <div className="pl-4 font-bold text-amber-850">= {formatDeZahl(materialResults.denominator, 4)}</div>
                    </div>
                    <div className="border-t border-slate-200 pt-2 text-xs">
                      <div><MdText text={inhalt.texte.zeitabhängigerSummenverlustCS} /><span className="font-bold text-amber-800">Δσ_p,csr = {formatDeZahl(materialResults.deltaSigmaP_csr, 1)} N/mm²</span></div>
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
                  <div className="font-bold"><MdText text={inhalt.texte.achtungBetondruckBeimTransfer} /></div><MdText text={inhalt.texte.inAbwesenheitDesÄußeren} />{formatDeZahl(Math.abs(materialResults.sigmaN + materialResults.sigmaMPBot), 1)}<MdText text={inhalt.texte.mpaDasÜberschreitetDie} />{formatDeZahl(materialResults.permCompStress_t0, 1)}<MdText text={inhalt.texte.mpa060F} />{concreteClass}<MdText text={inhalt.texte.imAlterT} />{formatDeWert(concreteAge)}<MdText text={inhalt.texte.dGefahrVonDruckversagen} /></div>
              </div>
            )}

            {/* Quick Link to Material Explanations */}
            <div className="mt-4 p-4 bg-shiraz/5 border border-shiraz/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-text-main/80">
                <span className="font-bold text-shiraz block"><MdText text={inhalt.texte.didaktischeErklärungDerKenngrößen} /></span><MdText text={inhalt.texte.physikalischeWirkmechanismenMikrostruktu} /></div>
              <button
                type="button"
                onClick={() => zeigeReiter('kennwerte')}
                className="px-3.5 py-2 rounded-lg bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                <BookOpen size={14} /><MdText text={inhalt.texte.zuDenBaustoffkennwerten} /><ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card C: Schematic Principle SVGs */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
              <Info className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.schnittprinzipDesVorgespanntenTragwerks} /></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Schlaffe Bewehrung */}
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <div className="text-xs font-bold mb-2"><MdText text={inhalt.texte.stahlbetonSchlaffBewehrt} /></div>
                <svg role="img" aria-label="Stahlbeton, schlaff bewehrt: Balken unter Last mit Rissen" width="100%" height="110" viewBox="0 0 200 110">
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
                <div className="text-[11px] text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.unterÄußerenMomentenReißt} /></div>
              </div>

              {/* Spannbeton */}
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <div className="text-xs font-bold mb-2"><MdText text={inhalt.texte.spannbetonVorgespanntÜberdrückt} /></div>
                <svg role="img" aria-label="Spannbeton, vorgespannt: überdrückter Balken ohne Risse" width="100%" height="110" viewBox="0 0 200 110">
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
                <div className="text-[11px] text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.dieExzentrischeVorspannungErzeugt} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {bereiche.includes('dauerhaftigkeit') && mainTab === 'dauerhaftigkeit' && (
        <div className="animate-in fade-in duration-300">
          <React.Suspense fallback={<Reiterplatz />}><SpannbetonDauerhaftigkeit /></React.Suspense>
        </div>
      )}
      </ModuleTabs>
      </div>

      {/* unterhalb des Bildausschnitts: erst nach dem ersten Bild rendern (AP 5.5 Nachtrag) */}
      <NachErstemBild minHoehe="40rem">
      {/* Vernetzte Fachmodule & Querverweise */}
      <RelatedModules
        title={inhalt.werte.verwandteFachmoduleZuSpannbeton}
        subtitle={inhalt.werte.didaktischAbgestimmteModuleZu}
        modules={[
          {
            tab: 'festbeton',
            title: 'Festbetoneigenschaften',
            description: inhalt.werte.eModulDruckfestigkeitZugfestigkeit,
            tag: 'Grundlagen',
            badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
          },
          {
            tab: 'stahlbeton',
            title: inhalt.werte.stahlbetonbauEc2,
            description: inhalt.werte.biegebemessungQuerkraftRissbreitenbegren,
            tag: 'Bemessung',
            badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
          },
          {
            tab: 'stahl',
            title: inhalt.werte.spannstahlHochfesteStähle,
            description: inhalt.werte.drahtUndLitzenstähleY1860s7,
            tag: 'Werkstoffe',
            badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
          },
          {
            tab: 'korrosion',
            title: inhalt.werte.spannungsrisskorrosionSpanngliedbrüche,
            description: inhalt.werte.gefahrenDurchWasserstoffversprödungUnd,
            tag: 'Dauerhaftigkeit',
            badgeColor: 'bg-pink-50 text-pink-700 border-pink-200'
          },
          {
            tab: 'instandhaltung',
            title: inhalt.werte.stahlbetonSpannbetoninstandsetzung,
            description: inhalt.werte.zustandsanalyseRissinjektionKathodischer,
            tag: 'Instandhaltung',
            badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
          },
          {
            tab: 'rechnung_stahlbeton',
            title: inhalt.werte.musterrechnungStahlbeton,
            description: inhalt.werte.schrittFürSchrittBiegebemessung,
            tag: 'Praxisrechnung',
            badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
          }
        ]}
      />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026KorrekturpaketSpannbeton}
        weblinks={[
          { title: inhalt.werte.betonWikiSpannbetonbau, url: 'https://beton.wiki/index.php?title=Spannbeton' },
          { title: inhalt.werte.zementMerkblattH9Spannbeton, url: 'https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/' }
        ]}
        wikipedia={[
          { title: 'Spannbeton', url: 'https://de.wikipedia.org/wiki/Spannbeton' },
          inhalt.daten["Spannbeton.wikipedia.1"],
          { title: 'Spannstahl', url: 'https://de.wikipedia.org/wiki/Spannstahl' }
        ]}
        regelwerke={inhalt.daten["Spannbeton.regelwerke"]}
        literatur={inhalt.daten["Spannbeton.literatur"]}
        formeln={inhalt.daten["Spannbeton.formeln"]}
      />
      </NachErstemBild>
    </div>
  );
}
