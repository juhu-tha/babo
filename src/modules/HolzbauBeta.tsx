import React, { useState, useMemo } from 'react';
import { 
  Trees, 
  Calculator, 
  GitCommit, 
  Flame, 
  Info, 
  Layers, 
  Volume2, 
  ShieldAlert, 
  Scale, 
  ArrowRight, 
  Search, 
  Droplets, 
  CheckCircle2, 
  AlertTriangle,
  Table,
  Wrench,
  History
} from 'lucide-react';
import { bemesseDruckstab, bemesseQuerdruck, type KLED, type Nutzungsklasse, type Querdruckfall } from '@/src/calc/holzbau';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert, formatDeTeXWert, formatDeTeX } from '@/src/utils/numberFormat';
import ModuleHistoryView from '@/src/components/ui/ModuleHistoryView';
import { MODULE_HISTORY_DATA } from '@/src/data/moduleHistoryData';

interface SubTabProps {
  activeSubTab: string;
}

// Solid timber & engineered wood database for Tab 2
interface WoodMaterial {
  class: string;
  type: string; // KVH, BSH, Vollholz, etc.
  f_mk: number; // charakteristische Biegefestigkeit N/mm²
  f_t0k: number; // Zugfestigkeit parallel N/mm²
  f_c0k: number; // Druckfestigkeit parallel N/mm²
  f_vk: number; // charakteristische Scherfestigkeit N/mm²
  E_0mean: number; // mittlerer Elastizitätsmodul N/mm²
  E_005: number; // 5%-Quantil E-Modul N/mm²
  rho_k: number; // charakteristische Rohdichte kg/m³
  rho_mean: number; // mittlere Rohdichte kg/m³
}

const woodMaterials: WoodMaterial[] = [
  { class: 'C24', type: 'Nadelholz (S10)', f_mk: 24, f_t0k: 14.5, f_c0k: 21, f_vk: 4.0, E_0mean: 11000, E_005: 7400, rho_k: 350, rho_mean: 420 },
  { class: 'C30', type: 'Nadelholz (S13)', f_mk: 30, f_t0k: 19, f_c0k: 24, f_vk: 4.0, E_0mean: 12000, E_005: 8000, rho_k: 380, rho_mean: 460 },
  { class: 'D30', type: 'Laubholz (EN 338:2016)', f_mk: 30, f_t0k: 18, f_c0k: 24, f_vk: 3.9, E_0mean: 11000, E_005: 9200, rho_k: 530, rho_mean: 640 },
  { class: 'D40', type: 'Laubholz (EN 338:2016)', f_mk: 40, f_t0k: 24, f_c0k: 27, f_vk: 4.2, E_0mean: 13000, E_005: 10900, rho_k: 550, rho_mean: 660 },
  { class: 'GL24h', type: 'Brettschichtholz (homogen)', f_mk: 24, f_t0k: 19.2, f_c0k: 24, f_vk: 3.5, E_0mean: 11500, E_005: 9600, rho_k: 385, rho_mean: 420 },
  { class: 'GL28c', type: 'Brettschichtholz (kombiniert)', f_mk: 28, f_t0k: 19.5, f_c0k: 24, f_vk: 3.5, E_0mean: 12500, E_005: 10400, rho_k: 390, rho_mean: 430 },
  { class: 'GL30h', type: 'Brettschichtholz (homogen)', f_mk: 30, f_t0k: 24, f_c0k: 30, f_vk: 3.5, E_0mean: 13600, E_005: 11300, rho_k: 430, rho_mean: 480 },
];

// dataholz.eu construction database
interface DataholzConstruction {
  id: string;
  name: string;
  type: 'Aussenwand' | 'Innenwand' | 'Decke' | 'Dach';
  structure: string; // Kurzbeschreibung Aufbau
  uValue: number; // W/(m²K)
  fireClass: string; // z.B. REI 60, REI 90, EI 30
  soundRating: number; // Rw in dB
  components: string[];
}

const dataholzConstructions: DataholzConstruction[] = [
  {
    id: 'aw_hfr_01',
    name: 'Außenwand in Holzrahmenbauweise',
    type: 'Aussenwand',
    structure: 'Putzträgerplatte + Holzständer (160 mm Steinwolle) + Hanf-Faserplatte + Gipsfaserplatte raumseitig',
    uValue: 0.18,
    fireClass: 'REI 60',
    soundRating: 48,
    components: [
      'Silikonharzputz mit Gewebearmierung (10 mm)',
      'Holzfaserdämmplatte Typ HFD-Putzträger (40 mm)',
      'Konstruktionsvollholz-Ständer b/h = 60/160 mm e = 62,5 cm, ausgefacht mit Mineralwolle',
      'OSB/3-Platte als Dampfbremse & aussteifende Plattenlage (15 mm, Fugen luftdicht abgeklebt)',
      'Installationsebene unterkonstruiert, ausgefacht mit Holzfaserdämmstoff (40 mm)',
      'Gipsfaserplatte Typ GF als raumseitige Beplankung (12,5 mm)'
    ]
  },
  {
    id: 'aw_clt_01',
    name: 'Außenwand in Massivholzbauweise (CLT / BSP)',
    type: 'Aussenwand',
    structure: 'Verkleideter CLT-Kern (90 mm 3-schichtig) + Holzfaser-WDVS (160 mm) + mineralischer Putz',
    uValue: 0.16,
    fireClass: 'REI 90 (Kapselkriterium K₂30)',
    soundRating: 51,
    components: [
      'Außenputzsystem mineralisch (12 mm)',
      'Holzfaserdämmplatte HFD-U (160 mm)',
      'Brettsperrholz-Wandelement CLT (90 mm, 3 Schichten kreuzweise verklebt)',
      'Installationsebene unterkonstruiert mit Justierschwingen (50 mm), gedämmt mit Hanffaser',
      'Doppelte Gipsplattenbeplankung Gipsfaser / Gipskarton (2 x 12,5 mm)'
    ]
  },
  {
    id: 'de_clt_01',
    name: 'Geschossdecke Brettsperrholz mit Estrich',
    type: 'Decke',
    structure: 'CLT-Tragschale (140 mm) + gebundene Splittschüttung (60 mm) + Trittschalldämmung + Heizestrich',
    uValue: 0.32,
    fireClass: 'REI 60 / REI 90 (klassifiziert ab 140 mm CLT)',
    soundRating: 62,
    components: [
      'Anhydrit-Fließestrich als Heizestrich (65 mm)',
      'PE-Feldtrennfolie',
      'Trittschalldämmplatte Mineralwolle Typ TDPT (30 mm, s\' ≤ 15 MN/m³)',
      'Gebundene schwere Splittschüttung als Masse-Lage zur Tiefton-Dämpfung (60 mm, ca. 120 kg/m²)',
      'Rieselschutzpapier',
      'Brettsperrholz-Deckenplatte CLT (140 mm, 5 Schichten, Sichtqualität unten)'
    ]
  },
  {
    id: 'da_sd_01',
    name: 'Steildach mit Zwischen- und Untersparrendämmung',
    type: 'Dach',
    structure: 'Ziegeldeck + Unterdachbahn + Sparren (200 mm Holzfaser) + Klimamembran + raumseitige Gipsfaser',
    uValue: 0.14,
    fireClass: 'REI 30',
    soundRating: 46,
    components: [
      'Dachziegel / Betondachsteine',
      'Traglattung und Konterlattung (Hinterlüftungsebene, 40/60 mm)',
      'Unterdeckplatte aus Holzfasern, wasserableitend Typ HFD-UD (35 mm)',
      'Konstruktionsvollholz-Konstruktionssparren 80/200 mm, e = 75 cm, Gefach ausgedämmt mit flexibler Holzfaser (200 mm)',
      'Feuchtevariable Dampfbremse (s_d-Wert feuchteabhängig, z. B. 0,5 bis 5 m; ermöglicht sommerliche Rücktrocknung)',
      'Unterkonstruktion gedämmt mit Hanfmatten (40 mm)',
      'Gipskarton-Feuerschutzplatte Typ GKF raumseitig (15 mm)'
    ]
  }
];

export default function HolzbauBeta({ activeSubTab = 'info' }: SubTabProps) {
  // Info Tab Switcher State
  const [infoView, setInfoView] = useState<'uebersicht' | 'historie'>('uebersicht');

  // Database States
  const [dbTypeFilter, setDbTypeFilter] = useState<string>('all');
  const [dbSearch, setDbSearch] = useState<string>('');
  const [selectedConst, setSelectedConst] = useState<string>('aw_hfr_01');

  // Eurocode 5 Calculator States
  const [woodClass, setWoodClass] = useState<string>('C24');
  const [serviceClass, setServiceClass] = useState<number>(1); // NKL 1, 2, 3
  const [loadDuration, setLoadDuration] = useState<string>('mtl'); // stnd, lg, mtl, krt, sfs
  const [colB, setColB] = useState<number>(120); // mm
  const [colH, setColH] = useState<number>(160); // mm
  const [colLen, setColLen] = useState<number>(3.0); // m
  const [eulerCase, setEulerCase] = useState<number>(2); // Euler-Fall 1 Kragarm, 2 gelenkig, 3 eingespannt–gelenkig, 4 beidseitig eingespannt
  const [designLoad, setDesignLoad] = useState<number>(50); // kN

  // --- NEW MODULE STATES AND CALCULATIONS ---
  // 1. Swelling & Shrinking States (Holzfeuchte)
  const [shreWoodType, setShreWoodType] = useState<string>('fichte');
  const [shreUStart, setShreUStart] = useState<number>(20);
  const [shreUEnd, setShreUEnd] = useState<number>(12);
  const [shreB, setShreB] = useState<number>(120);
  const [shreH, setShreH] = useState<number>(240);
  const [shreBDir, setShreBDir] = useState<string>('radial');
  const [shreHDir, setShreHDir] = useState<string>('tangential');

  // Swelling/Shrinking coefficients database (per 1% moisture change below FSP ~ 30%)
  const shrinkageCoeffs: Record<string, { radial: number; tangential: number; longitudinal: number; label: string }> = {
    fichte: { radial: 0.19, tangential: 0.33, longitudinal: 0.01, label: 'Fichte / Tanne (Nadelholz)' },
    kiefer: { radial: 0.19, tangential: 0.36, longitudinal: 0.01, label: 'Kiefer (Nadelholz)' },
    laerche: { radial: 0.18, tangential: 0.38, longitudinal: 0.01, label: 'Lärche (Nadelholz)' },
    buche: { radial: 0.20, tangential: 0.40, longitudinal: 0.01, label: 'Buche (Laubholz)' },
    eiche: { radial: 0.15, tangential: 0.28, longitudinal: 0.01, label: 'Eiche (Laubholz)' }
  };

  const shrinkResults = useMemo(() => {
    const coeffs = shrinkageCoeffs[shreWoodType] || shrinkageCoeffs.fichte;
    
    // Wood moisture limit at fiber saturation point (Fasersättigungsbereich - approx 30%)
    const u1 = Math.min(30, Math.max(0, shreUStart));
    const u2 = Math.min(30, Math.max(0, shreUEnd));
    const deltaU = u2 - u1; // positive = swelling, negative = shrinking

    const alpha_b = shreBDir === 'radial' ? coeffs.radial : shreBDir === 'tangential' ? coeffs.tangential : coeffs.longitudinal;
    const alpha_h = shreHDir === 'radial' ? coeffs.radial : shreHDir === 'tangential' ? coeffs.tangential : coeffs.longitudinal;

    // delta Dimension = Dim_init * alpha * delta_u / 100
    const deltaB = shreB * (alpha_b * (deltaU / 100));
    const deltaH = shreH * (alpha_h * (deltaU / 100));

    const finalB = shreB + deltaB;
    const finalH = shreH + deltaH;

    return {
      coeffs,
      deltaU,
      alpha_b,
      alpha_h,
      deltaB,
      deltaH,
      finalB,
      finalH,
      isShrink: deltaU < 0,
      isSwell: deltaU > 0,
      isNoChange: deltaU === 0
    };
  }, [shreWoodType, shreUStart, shreUEnd, shreB, shreH, shreBDir, shreHDir]);

  // 2. Querpressung (Bearing pressure perp. to grain) States
  const [qpForce, setQpForce] = useState<number>(30); // F_c90_d in kN
  const [qpB, setQpB] = useState<number>(100); // beam width in mm
  const [qpL, setQpL] = useState<number>(120); // support length in mm
  const [qpConfig, setQpConfig] = useState<string>('schwelle'); // schwelle, traeger_ende, pfosten_riegel, clt_plate
  const [qpOverhang, setQpOverhang] = useState<boolean>(true); // overhang left/right

  // 3. Spax- / Holzschrauben-Verbindungsrechner nach Eurocode 5
  const [connWoodClass, setConnWoodClass] = useState<string>('C24');
  const [connD, setConnD] = useState<number>(8); // mm (d)
  const [connLef, setConnLef] = useState<number>(80); // mm (l_ef thread penetration)
  const [connAngle, setConnAngle] = useState<number>(90); // deg (45 or 90)
  const [connCount, setConnCount] = useState<number>(4); // number of screws
  const [connForce, setConnForce] = useState<number>(15); // V_Ed Design Shear in kN

  // 4. Brandschutz-Abbrand-Rechner
  const [fireTime, setFireTime] = useState<number>(30); // minutes
  const [fireSides, setFireSides] = useState<number>(4); // 3 or 4 sides
  const [fireB, setFireB] = useState<number>(120); // mm
  const [fireH, setFireH] = useState<number>(240); // mm
  const [fireType, setFireType] = useState<string>('nadel'); // nadel, laub, clt

  // 5. Decken-Schwingung nach Eurocode 5 (Gebrauchstauglichkeit)
  const [vibSpan, setVibSpan] = useState<number>(4.8); // Span in m
  const [vibCltThick, setVibCltThick] = useState<number>(120); // CLT thickness in mm
  const [vibExtraMass, setVibExtraMass] = useState<number>(100); // kg/m² additional loads

  // Derived Materials values
  const currentMaterial = useMemo(() => {
    return woodMaterials.find(m => m.class === woodClass) || woodMaterials[0];
  }, [woodClass]);

  // Derived calculations for added modules
  const qpResults = useMemo(() => {
    const fc90kMap: Record<string, number> = { C24: 2.5, C30: 2.7, D30: 8.0, D40: 8.8, GL24h: 2.5, GL28c: 2.5, GL30h: 2.5 };
    return bemesseQuerdruck({
      F: qpForce, b: qpB, l: qpL, fall: qpConfig as Querdruckfall, ueberstand: qpOverhang, fc90k: fc90kMap[woodClass] ?? 2.5,
      art: woodClass.startsWith('GL') ? 'bsh' : woodClass.startsWith('C') ? 'nadelvollholz' : 'laubholz',
      nkl: serviceClass as Nutzungsklasse, kled: loadDuration as KLED,
    });
  }, [woodClass, serviceClass, loadDuration, qpForce, qpB, qpL, qpConfig, qpOverhang]);

  const connResults = useMemo(() => {
    const material = woodMaterials.find(m => m.class === connWoodClass) || woodMaterials[0];
    const rho_k = material.rho_k;

    // 1. Axial Withdrawal Capacity F_ax,Rk
    const f_ax_k = 12.0; // N/mm² Lehrwert – reale Werte nach ETA der Schraube
    const rad = (connAngle * Math.PI) / 180;
    const factor_alpha = 1.0 / (1.2 * Math.pow(Math.cos(rad), 2) + Math.pow(Math.sin(rad), 2));
    const factor_density = Math.pow(rho_k / 350, 0.8);

    const f_ax_alpha_k = f_ax_k * factor_alpha * factor_density; // N/mm²
    const F_ax_Rk_single_N = f_ax_alpha_k * connD * connLef; // N
    const F_ax_Rk_total_N = connCount * F_ax_Rk_single_N;
    const F_ax_Rk_total_kN = F_ax_Rk_total_N / 1000;

    const k_mod = 0.8;
    const F_ax_Rd_total_kN = (k_mod * F_ax_Rk_total_kN) / 1.3;

    // 2. Shear Capacity (with rope effect)
    const f_h_k = 0.082 * (1 - 0.01 * connD) * rho_k; // N/mm²
    const f_uk = 400; // N/mm²
    const M_y_Rk = 0.3 * f_uk * Math.pow(connD, 2.6); // Nmm

    const F_v_Rk_1 = f_h_k * connLef * connD; 
    const johansen_2 = 1.15 * Math.sqrt(2 * M_y_Rk * f_h_k * connD);
    // Seileffekt F_ax,Rk/4, für Schrauben auf 100 % des Johansen-Anteils begrenzt (EC5 8.2.2)
    const rope_effect = Math.min(0.25 * F_ax_Rk_single_N, johansen_2);
    const F_v_Rk_2 = johansen_2 + rope_effect;

    const F_v_Rk_single_N = Math.min(F_v_Rk_1, F_v_Rk_2);
    const F_v_Rk_total_N = connCount * F_v_Rk_single_N;
    const F_v_Rk_total_kN = F_v_Rk_total_N / 1000;
    const F_v_Rd_total_kN = (k_mod * F_v_Rk_total_kN) / 1.3;

    const utilAxial = (connForce / F_ax_Rd_total_kN) * 100;
    const utilShear = (connForce / F_v_Rd_total_kN) * 100;

    return {
      rho_k,
      factor_alpha,
      f_ax_alpha_k,
      F_ax_Rk_total_kN,
      F_ax_Rd_total_kN,
      f_h_k,
      M_y_Rk,
      rope_effect,
      F_v_Rk_total_kN,
      F_v_Rd_total_kN,
      utilAxial,
      utilShear,
      isAxialUnsafe: utilAxial > 100,
      isShearUnsafe: utilShear > 100
    };
  }, [connWoodClass, connD, connLef, connAngle, connCount, connForce]);

  const fireResults = useMemo(() => {
    // ideelle Abbrandrate beta_n inkl. Eckausrundung (DIN EN 1995-1-2, Tab. 3.1)
    let beta_0 = 0.80; // Nadel-Vollholz
    if (fireType === 'bsh') beta_0 = 0.70; // Nadelholz-BSH
    if (fireType === 'laub') beta_0 = 0.55; // Laubholz rho_k >= 450
    if (fireType === 'clt') beta_0 = 0.65; // eindimensional, Lehrannahme (ohne Lagenabfall)

    const d_char0 = beta_0 * fireTime; // mm
    const k_0 = Math.min(1, fireTime / 20); // ungeschützte Oberfläche
    const d_0 = 7.0; // mm Schicht ohne Festigkeit
    const d_ef = d_char0 + k_0 * d_0; // mm

    let b_fi = fireB;
    let h_fi = fireH;

    if (fireSides === 4) {
      b_fi = Math.max(0, fireB - 2 * d_ef);
      h_fi = Math.max(0, fireH - 2 * d_ef);
    } else { 
      b_fi = Math.max(0, fireB - 2 * d_ef);
      h_fi = Math.max(0, fireH - d_ef);
    }

    const A_0 = fireB * fireH; // mm²
    const W_y0 = (fireB * Math.pow(fireH, 2)) / 6; // mm³

    const A_fi = b_fi * h_fi; // mm²
    const W_yfi = b_fi > 0 && h_fi > 0 ? (b_fi * Math.pow(h_fi, 2)) / 6 : 0; // mm³

    const areaLossPercent = A_0 > 0 ? ((A_0 - A_fi) / A_0) * 100 : 100;
    const stiffnessLossPercent /* Verlust an Widerstandsmoment W (nicht EI) */ = W_y0 > 0 ? ((W_y0 - W_yfi) / W_y0) * 100 : 100;

    return {
      beta_0,
      d_char0,
      d_ef,
      b_fi,
      h_fi,
      A_0,
      W_y0,
      A_fi,
      W_yfi,
      areaLossPercent,
      stiffnessLossPercent,
      isCollapsed: b_fi <= 0 || h_fi <= 0
    };
  }, [fireTime, fireSides, fireB, fireH, fireType]);

  const vibResults = useMemo(() => {
    const e_mean = 11000; // N/mm² standard for CLT (C24 laminations) = 1.1e10 N/m²
    const h_m = vibCltThick / 1000; // m
    const inertia_L = (1.0 * Math.pow(h_m, 3)) / 12; // m⁴
    const ei_L = e_mean * 1e6 * inertia_L; // E-Modul (N/m²) * Inertia (m⁴)

    const woodDensity = 450; // kg/m³
    const cltSelfMass = woodDensity * h_m; // kg/m²
    const totalMass = cltSelfMass + vibExtraMass; // kg/m²

    const freq_1 = (Math.PI / (2 * Math.pow(vibSpan, 2))) * Math.sqrt(ei_L / totalMass);
    const isCompliant = freq_1 > 8.0;

    return {
      cltSelfMass,
      totalMass,
      ei_L,
      inertia_L,
      freq_1,
      isCompliant
    };
  }, [vibSpan, vibCltThick, vibExtraMass]);

  // Eurocode 5 Knicknachweis (Rechenkern src/calc/holzbau.ts)
  const calculationResults = useMemo(() => bemesseDruckstab({
    b: colB, h: colH, laenge: colLen, eulerFall: eulerCase as 1 | 2 | 3 | 4, nEd: designLoad,
    fc0k: currentMaterial.f_c0k, E005: currentMaterial.E_005, brettschichtholz: currentMaterial.class.startsWith('GL'),
    nkl: serviceClass as Nutzungsklasse, kled: loadDuration as KLED,
  }), [currentMaterial, serviceClass, loadDuration, colB, colH, colLen, eulerCase, designLoad]);

  // Dataholz filtered items
  const filteredConstructions = useMemo(() => {
    return dataholzConstructions.filter(c => {
      const matchesType = dbTypeFilter === 'all' || c.type === dbTypeFilter;
      const matchesSearch = c.name.toLowerCase().includes(dbSearch.toLowerCase()) || 
                            c.structure.toLowerCase().includes(dbSearch.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [dbTypeFilter, dbSearch]);

  const activeConstruction = useMemo(() => {
    return dataholzConstructions.find(c => c.id === selectedConst) || dataholzConstructions[0];
  }, [selectedConst]);

  return (
    <div className="flex flex-col gap-8">
      {/* MODULE MAIN BRANDING */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-shiraz/10 rounded-2xl text-shiraz border border-shiraz/20 shadow-sm">
              <Trees size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight">
                Holzbau (Ingenieurholzbau)
              </h2>
              <p className="text-xs text-text-main/60 font-semibold uppercase tracking-wider">
                Referenzhandbuch &amp; Tragwerksnachweise nach Eurocode 5 (DIN EN 1995-1-1)
              </p>
            </div>
          </div>
          
          <div className="bg-slate-100 text-slate-800 border border-slate-200 py-1 px-3 rounded-full text-xs font-bold leading-none self-start md:self-auto shadow-xs">
            Ref: informationsdienst-holz.de &amp; dataholz.eu
          </div>
        </div>

        <p className="text-sm text-text-main/75 max-w-4xl leading-relaxed">
          Das Modul fasst Kennwerte der Holzwerkstoffe, Konstruktionsweisen, Bauphysik und Brandschutz zusammen und enthält vereinfachte Rechner nach Eurocode 5. Die Rechner dienen der Lehre und ersetzen keine Tragwerksplanung.
        </p>
      </div>

      {/* RENDER DYNAMIC SUB-TABS BASED ON MAIN MENU SWITCH */}
      {activeSubTab === 'info' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_info">
          
          {/* Sub-Navigation between Übersicht and Historie */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 border border-home-grau/25 rounded-xl w-fit">
            <button aria-pressed={infoView === 'uebersicht'}
              onClick={() => setInfoView('uebersicht')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                infoView === 'uebersicht'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'text-text-main/80 hover:text-text-main hover:bg-white/60'
              }`}
            >
              <Info size={14} />
              Fachportale &amp; Systemvorteile
            </button>
            <button aria-pressed={infoView === 'historie'}
              onClick={() => setInfoView('historie')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                infoView === 'historie'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'text-text-main/80 hover:text-text-main hover:bg-white/60'
              }`}
            >
              <History size={14} />
              Historie &amp; Normenwandel
            </button>
          </div>

          {infoView === 'uebersicht' ? (
            <>
              {/* Reference sources grids */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-shiraz/50 transition-all flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-black text-shiraz tracking-widest block mb-1">Netzwerk Deutschland</span>
                    <h3 className="font-extrabold text-text-main text-base mb-2">Informationsdienst Holz</h3>
                    <p className="text-xs text-text-main/70 leading-relaxed">
                      Fachinformationen des Informationsvereins Holz (Reihe „holzbau handbuch“) zu Konstruktion, Bemessung, Brand-, Schall- und Feuchteschutz.
                    </p>
                  </div>
                  <a 
                    href="https://informationsdienst-holz.de/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-shiraz hover:underline font-bold text-xs flex items-center gap-1 mt-2 group"
                  >
                    Zur Plattform <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-black text-amber-800 tracking-widest block mb-1">Prüfzeugnisse &amp; Details</span>
                    <h3 className="font-extrabold text-text-main text-base mb-2">dataholz.eu</h3>
                    <p className="text-xs text-text-main/70 leading-relaxed">
                      Frei zugänglicher Bauteilkatalog der Holzforschung Austria mit herstellerneutralen Wand-, Decken- und Dachaufbauten und deren bauphysikalischen und brandschutztechnischen Kennwerten (in Österreich von den Baubehörden als Nachweis anerkannt; in Deutschland kein bauaufsichtlicher Verwendbarkeitsnachweis, nur Planungshilfe).
                    </p>
                  </div>
                  <a 
                    href="https://www.dataholz.eu/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-amber-800 hover:text-amber-950 font-bold text-xs flex items-center gap-1 mt-2 group"
                  >
                    Zur Plattform <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-black text-amber-800 tracking-widest block mb-1">Wissenschaft &amp; Praxis</span>
                    <h3 className="font-extrabold text-text-main text-base mb-2">Institut für Holzbau</h3>
                    <p className="text-xs text-text-main/70 leading-relaxed">
                      Die Leitinstitution für Fortbildung und Standardisierung im zukunftsfähigen Massivholzbau. Vermittelt komprimiertes Fachwissen zu konstruktiven Regeln, Normenentwicklungen der Landesbauordnungen (LBO) und Holzbaurichtlinien (HBrR).
                    </p>
                  </div>
                  <a 
                    href="https://www.institut-holzbau.de/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-amber-800 hover:text-amber-950 font-bold text-xs flex items-center gap-1 mt-2 group"
                  >
                    Zur Plattform <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

              </div>

              {/* Interactive Core Knowledge Cards */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-off-white flex flex-col gap-4">
                <h3 className="font-black text-text-main text-base flex items-center gap-2">
                  <Layers size={18} className="text-amber-800" /> Planungsrelevante Systemvorteile im modernen Hochbau
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex gap-3">
                    <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-text-main">Vorkonditionierung &amp; Vorfertigung (Just-in-Time)</h4>
                      <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                        Wand- und Deckensysteme werden witterungsgeschützt im Werk CNC-gesteuert abgebunden und inklusive Installationsebene vorbereitet. Das verkürzt die Montagezeit vor Ort und verringert das Risiko von Baufeuchte.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex gap-3">
                    <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-text-main">Leichtgewicht mit hoher spezifischer Festigkeit</h4>
                      <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                        Holz hat im Verhältnis zu seiner Dichte eine hohe Festigkeit parallel zur Faser. Das ist z. B. bei Aufstockungen günstig, wenn der Bestand nur geringe Zusatzlasten aufnehmen kann.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex gap-3">
                    <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-text-main">Zirkularität und Schadstofffreiheit</h4>
                      <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                        Lösbar verbundene (geschraubte, gesteckte) Bauteile lassen sich zerstörungsarm rückbauen und wiederverwenden; danach folgen stoffliche und zuletzt energetische Verwertung (Kaskadennutzung).
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex gap-3">
                    <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-text-main">Integrierter sommerlicher Hitzeschutz</h4>
                      <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                        Holzwände kombiniert mit zellulosischer oder faserbasierter Einblasdämmung können wegen der hohen Wärmespeicherfähigkeit der Dämmstoffe große Phasenverschiebungen erreichen (Größenordnung 10 h, aufbauabhängig) und dämpfen die Temperaturamplitude – günstig für den sommerlichen Wärmeschutz.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 flex gap-3 leading-relaxed">
                <AlertTriangle size={18} className="text-amber-700 flex-shrink-0" />
                <div>
                  <strong>Hinweis:</strong> Die Landesbauordnungen wurden für den mehrgeschossigen Holzbau schrittweise geöffnet. Die Muster-Holzbaurichtlinie (MHolzBauRL 2024, veröffentlicht in den Amtlichen Mitteilungen des DIBt 2025/2) regelt Bauteile in Holzbauweise für die Gebäudeklassen 4 und 5. Maßgebend ist die jeweilige Landesfassung (Einführung über die Landes-VV TB).
                </div>
              </div>
            </>
          ) : (
            <ModuleHistoryView history={MODULE_HISTORY_DATA.holzbau} accentColor="text-amber-800" />
          )}

        </div>
      )}

      {activeSubTab === 'werkstoffe' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_materials">
          
          {/* Section: Standard Timber Grades */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
            <h3 className="font-black text-text-main text-base flex items-center gap-2 border-b border-home-grau/20 pb-2">
              <Table size={18} className="text-amber-800" /> Charakteristische Festigkeitswerte nach DIN EN 338 &amp; EN 14080 (Voll- vs. Leimholz)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-home-grau/5 border-b border-home-grau/20">
                    <th className="py-2.5 px-3 font-semibold text-text-main">Klasse</th>
                    <th className="py-2.5 px-3 font-semibold text-text-main">Materialtyp</th>
                    <th className="py-2.5 px-3 font-semibold text-emerald-800">f_m,k (Biegung)</th>
                    <th className="py-2.5 px-3 font-semibold text-text-main">f_t,0,k (Zug l.)</th>
                    <th className="py-2.5 px-3 font-semibold text-text-main">f_c,0,k (Druck l.)</th>
                    <th className="py-2.5 px-3 font-semibold text-text-main">f_v,k (Scheren)</th>
                    <th className="py-2.5 px-3 font-semibold text-text-main">E_0,mean (E-Modul)</th>
                    <th className="py-2.5 px-3 font-semibold text-text-main">ρ_k (charakt.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/10">
                  {woodMaterials.map(m => (
                    <tr key={m.class} className="hover:bg-off-white/50">
                      <td className="py-2 px-3 font-bold text-text-main font-mono">{m.class}</td>
                      <td className="py-2 px-3 text-text-main/80 font-medium">{m.type}</td>
                      <td className="py-2 px-3 font-bold text-emerald-700 font-mono">{formatDeWert(m.f_mk)} N/mm²</td>
                      <td className="py-2 px-3 font-mono text-text-main/70">{formatDeWert(m.f_t0k)} N/mm²</td>
                      <td className="py-2 px-3 font-mono text-text-main/70">{formatDeWert(m.f_c0k)} N/mm²</td>
                      <td className="py-2 px-3 font-mono text-text-main/70">{formatDeWert(m.f_vk)} N/mm²</td>
                      <td className="py-2 px-3 font-mono text-text-main/70">{formatDeWert(m.E_0mean)} N/mm²</td>
                      <td className="py-2 px-3 font-mono text-text-main/70">{formatDeWert(m.rho_k)} kg/m³</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-text-main/50 leading-relaxed font-medium">
              *Hinweis: charakteristische Werte (5%-Quantilwerte. Zur Bemessung müssen diese mit <InlineMath math="k_{mod}" /> modifiziert und durch den materialspezifischen Teilsicherheitsbeiwert <InlineMath math="\gamma_{M}" /> geteilt werden).
            </p>
          </div>

          {/* Section: dataholz.eu Explorer */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black text-amber-800 tracking-wider">Planungs-Tool</span>
                <span className="text-[10px] font-bold text-emerald-700 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">dataholz.eu Lizenz-Standard</span>
              </div>
              <h3 className="font-extrabold text-text-main text-base mt-1">Interaktiver dataholz.eu Bauteilexplorer</h3>
              <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                Beispielaufbauten zur Lehre, angelehnt an Bauteilkataloge wie dataholz.eu. Kennwerte sind Richtwerte – für die Planung gelten die klassifizierten Originaleinträge.
              </p>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-off-white p-3.5 rounded-xl border border-home-grau/20">
              <div className="flex flex-wrap gap-2">
                <button aria-pressed={dbTypeFilter === 'all'}
                  onClick={() => setDbTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbTypeFilter === 'all' 
                      ? 'bg-text-main text-white border-text-main' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  Alle Bauteile
                </button>
                <button aria-pressed={dbTypeFilter === 'Aussenwand'}
                  onClick={() => setDbTypeFilter('Aussenwand')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbTypeFilter === 'Aussenwand' 
                      ? 'bg-amber-800 text-white border-amber-800' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  Außenwände
                </button>
                <button aria-pressed={dbTypeFilter === 'Decke'}
                  onClick={() => setDbTypeFilter('Decke')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbTypeFilter === 'Decke' 
                      ? 'bg-amber-800 text-white border-amber-800' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  Geschossdecken
                </button>
                <button aria-pressed={dbTypeFilter === 'Dach'}
                  onClick={() => setDbTypeFilter('Dach')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbTypeFilter === 'Dach' 
                      ? 'bg-amber-800 text-white border-amber-800' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  Dächer
                </button>
              </div>

              {/* Search */}
              <div className="relative max-w-xs w-full">
                <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-home-grau" />
                <input
                  type="text"
                  placeholder="Aufbauten filtern..."
                  value={dbSearch}
                  onChange={(e) => setDbSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1 border border-home-grau/30 rounded-lg text-text-main bg-white"
                />
              </div>
            </div>

            {/* Split Details view */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Item Buttons (span 5) */}
              <div className="lg:col-span-5 flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2">
                {filteredConstructions.map(c => (
                  <button aria-pressed={selectedConst === c.id}
                    key={c.id}
                    onClick={() => setSelectedConst(c.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                      selectedConst === c.id
                        ? 'bg-amber-50/50 border-amber-600 ring-1 ring-amber-600 shadow-xs'
                        : 'bg-white border-home-grau/25 hover:border-home-grau/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-text-main leading-tight">{c.name}</span>
                      <span className="text-[8px] font-black uppercase text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                        {c.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-main/60 line-clamp-1">{c.structure}</p>
                    <div className="flex justify-between items-center text-[10px] text-text-main/40 mt-1 font-mono font-medium">
                      <span>U-Wert: {formatDeWert(c.uValue)} W/(m²K)</span>
                      <span>Brand: {c.fireClass}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Detail Sheet (span 7) */}
              <div className="lg:col-span-7 bg-off-white p-5 rounded-xl border border-home-grau/35 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Schnittaufbau und bauphysikalische Parameter</span>
                  <h4 className="font-extrabold text-sm text-text-main mt-0.5">{activeConstruction.name}</h4>
                  <p className="text-xs text-text-main/60 leading-normal mt-1">{activeConstruction.structure}</p>
                </div>

                {/* Rating blocks */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-xs text-center">
                    <span className="text-[9px] text-text-main/40 font-bold block">Wärmeschutz (U)</span>
                    <span className="font-mono text-xs font-black text-emerald-700 block mt-0.5">{formatDeWert(activeConstruction.uValue)} W/(m²K)</span>
                  </div>
                  
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-xs text-center">
                    <span className="text-[9px] text-text-main/40 font-bold block">Brandschutzklasse</span>
                    <span className="font-mono text-xs font-black text-rose-700 block mt-0.5">{activeConstruction.fireClass}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-xs text-center">
                    <span className="text-[9px] text-text-main/40 font-bold block">Schallschutz (Rw)</span>
                    <span className="font-mono text-xs font-black text-blue-700 block mt-0.5">{formatDeWert(activeConstruction.soundRating)} dB</span>
                  </div>
                </div>

                {/* Layer configurations List */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase text-text-main/50">Schichtenverlauf (von Außen nach Innen):</span>
                  <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {activeConstruction.components.map((layer, index) => (
                      <div key={index} className="flex gap-2 text-xs bg-white p-2 rounded border border-home-grau/10">
                        <span className="w-5 h-5 bg-home-grau/10 rounded font-mono font-bold text-[10px] flex items-center justify-center text-text-main/70 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-text-main/80 leading-normal">{layer}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* NEW INTERACTIVE: Hygroskopie & Dimensionsänderung Rechner */}
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
            <div>
              <span className="text-xs uppercase font-black text-amber-800 tracking-wider">Werkstoffprüfung &amp; Holzphysik</span>
              <h3 className="font-extrabold text-text-main text-base mt-1 flex items-center gap-2">
                <Droplets size={20} className="text-blue-600" /> Holzfeuchte &amp; Schwind-/Quellverhalten Rechner
              </h3>
              <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                Holz ist ein hygroskopischer Baustoff. Unterhalb des Fasersättigungspunkts (<InlineMath math="u_{fs} \approx 30\%" />) führt Feuchtigkeitsaufnahme zum Quellen und Abgabe zum Schwinden. Durch die Anisotropie des Holzes unterscheidet sich das Dehnungsmaß in radialer, tangentialer und longitudinaler Richtung erheblich. Die hinterlegten differentiellen Schwind- und Quellmaße (% je % Holzfeuchteänderung) sind Richtwerte; die Literatur streut je nach Herkunft und Rohdichte. Als Rechenwert für Nadelholz quer zur Faser wird häufig 0,24 %/% angesetzt (DIN 1052; Fundstelle im NA zu EC5 manuell prüfen).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Parameter Inputs (span 5) */}
              <div className="lg:col-span-5 flex flex-col gap-4 bg-off-white p-4 rounded-xl border border-home-grau/20">
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-main">Eingabeparameter</h4>

                {/* Species Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Hölzer / Holzart</label>
                  <select aria-label="Hölzer / Holzart"
                    value={shreWoodType}
                    onChange={(e) => setShreWoodType(e.target.value)}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                  >
                    <option value="fichte">Fichte / Tanne (Standard Nadelholz)</option>
                    <option value="kiefer">Kiefer</option>
                    <option value="laerche">Lärche (Beliebt im Außenbereich)</option>
                    <option value="buche">Buche (Sehr starkes Quellen/Schwinden)</option>
                    <option value="eiche">Eiche (Träges Feuchteverhalten)</option>
                  </select>
                </div>

                {/* Moisture values slider or numeric */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Anfangsfeuchte u₁ (%)</label>
                    <input aria-label="Anfangsfeuchte u₁ (%)"
                      type="number"
                      min="0"
                      max="40"
                      value={shreUStart}
                      onChange={(e) => setShreUStart(Math.max(0, parseInt(e.target.value) || 0))}
                      className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Ziel-Endfeuchte u₂ (%)</label>
                    <input aria-label="Ziel-Endfeuchte u₂ (%)"
                      type="number"
                      min="0"
                      max="40"
                      value={shreUEnd}
                      onChange={(e) => setShreUEnd(Math.max(0, parseInt(e.target.value) || 0))}
                      className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white font-bold"
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Breite b (mm)</label>
                    <input aria-label="Breite b (mm)"
                      type="number" min="0"
                      value={shreB}
                      onChange={(e) => setShreB(Math.max(1, parseInt(e.target.value) || 0))}
                      className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Höhe h (mm)</label>
                    <input aria-label="Höhe h (mm)"
                      type="number" min="0"
                      value={shreH}
                      onChange={(e) => setShreH(Math.max(1, parseInt(e.target.value) || 0))}
                      className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white font-semibold"
                    />
                  </div>
                </div>

                {/* Ring structure orientations */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Ringausricht. Breite</label>
                    <select aria-label="Ringausricht. Breite"
                      value={shreBDir}
                      onChange={(e) => setShreBDir(e.target.value)}
                      className="border border-home-grau/30 bg-white text-xs p-1.5 rounded-lg text-text-main"
                    >
                      <option value="radial">Radial stehend (gering)</option>
                      <option value="tangential">Tangential liegend (stark)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Ringausricht. Höhe</label>
                    <select aria-label="Ringausricht. Höhe"
                      value={shreHDir}
                      onChange={(e) => setShreHDir(e.target.value)}
                      className="border border-home-grau/30 bg-white text-xs p-1.5 rounded-lg text-text-main"
                    >
                      <option value="radial">Radial stehend (gering)</option>
                      <option value="tangential">Tangential liegend (stark)</option>
                      <option value="longitudinal">Longitudinal / Axial (kaum)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Outputs and 2D Visualizer (span 7) */}
              <div className="lg:col-span-7 bg-blue-50/20 border border-blue-200/50 p-5 rounded-xl flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block mb-1">Berechnungsergebnisse</span>
                  <p className="text-xs text-text-main/80 font-semibold mb-2">
                    Berechnete Kennwerte für <span className="text-amber-800 font-bold">{shrinkResults.coeffs.label}</span>:
                  </p>

                  <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-home-grau/15">
                    <div className="text-xs">
                      <span className="text-text-main/50 font-bold block text-[10px] uppercase">Schwindkoeffizienten α:</span>
                      <div>&bull; Breite (<span className="font-mono text-[11px] font-bold">{shreBDir}</span>): <span className="font-mono font-bold">{formatDeWert(shrinkResults.alpha_b)}%</span></div>
                      <div>&bull; Höhe (<span className="font-mono text-[11px] font-bold">{shreHDir}</span>): <span className="font-mono font-bold">{formatDeWert(shrinkResults.alpha_h)}%</span></div>
                    </div>
                    <div className="text-xs border-l border-home-grau/10 pl-3">
                      <span className="text-text-main/50 font-bold block text-[10px] uppercase">Feuchteänderung:</span>
                      <div className="font-medium text-text-main">
                        <span className="font-mono font-bold text-blue-800">{formatDeWert(shreUStart)}%</span> zu <span className="font-mono font-bold text-blue-800">{formatDeWert(shreUEnd)}%</span> (<InlineMath math={`\\Delta u = ${formatDeTeXWert(shrinkResults.deltaU)}\\%`} />)
                      </div>
                      {(shreUStart > 30 || shreUEnd > 30) ? (
                        <span className="text-[9px] text-amber-700 bg-amber-50 px-1 rounded block leading-tight mt-1">
                          *Über Fasersättigung (~30%) erfolgt keine Maßänderung!
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-white p-3 rounded-lg border border-home-grau/10 text-center">
                      <span className="text-[10px] text-text-main/50 font-black block">Änderung Breite Δb</span>
                      <span className={`text-sm font-mono font-black ${shrinkResults.deltaB < 0 ? 'text-rose-700' : shrinkResults.deltaB > 0 ? 'text-emerald-700' : 'text-stone-500'}`}>
                        {formatDeZahl(shrinkResults.deltaB, 2)} mm
                      </span>
                      <span className="text-[10px] text-text-main/40 block mt-0.5">({formatDeZahl(shrinkResults.finalB, 1)} mm)</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/10 text-center">
                      <span className="text-[10px] text-text-main/50 font-black block">Änderung Höhe Δh</span>
                      <span className={`text-sm font-mono font-black ${shrinkResults.deltaH < 0 ? 'text-rose-700' : shrinkResults.deltaH > 0 ? 'text-emerald-700' : 'text-stone-500'}`}>
                        {formatDeZahl(shrinkResults.deltaH, 2)} mm
                      </span>
                      <span className="text-[10px] text-text-main/40 block mt-0.5">({formatDeZahl(shrinkResults.finalH, 1)} mm)</span>
                    </div>
                  </div>
                </div>

                {/* 2D Contour Visualizer representing wood cells contraction */}
                <div className="border border-home-grau/20 bg-white p-4 rounded-xl flex flex-col items-center justify-center gap-2">
                  <span className="text-[9px] text-text-main/40 font-bold uppercase tracking-wider block">Maßstabsbereinigte 2D Querschnittsänderung</span>
                  
                  {/* Visualizer SVG */}
                  <div className="relative w-44 h-28 border border-dashed border-stone-300 rounded flex items-center justify-center bg-stone-50/50">
                    {/* Reference (original dim, gray outline) */}
                    <div className="absolute w-[80px] h-[60px] border-2 border-stone-400 bg-transparent opacity-20 block rounded" />
                    
                    {/* Actual/Final dim (colored block) */}
                    <div 
                      className={`border-2 duration-300 rounded transition-all ${
                        shrinkResults.isShrink 
                          ? 'bg-rose-50 border-rose-600 shadow-sm' 
                          : shrinkResults.isSwell 
                          ? 'bg-emerald-50 border-emerald-600 shadow-sm' 
                          : 'bg-stone-100 border-stone-600'
                      }`}
                      style={{
                        width: `${Math.max(10, 80 * (shrinkResults.finalB / (shreB || 1)))}px`,
                        height: `${Math.max(10, 60 * (shrinkResults.finalH / (shreH || 1)))}px`
                      }}
                    />

                    {/* Quick indicator arrows */}
                    <span className="absolute bottom-[2px] right-2 text-[9px] font-mono font-bold text-text-main/50">
                      Original: {formatDeWert(shreB)}x{formatDeWert(shreH)}
                    </span>
                  </div>

                  <p className="text-[10px] text-text-main/70 text-center italic leading-tight">
                    {shrinkResults.isShrink ? (
                      <span className="text-rose-800 font-bold">&bull; Das Holz schwindet. Es kommt zu Fugenbildung, Schwindrissen oder Verzug!</span>
                    ) : shrinkResults.isSwell ? (
                      <span className="text-emerald-800 font-bold">&bull; Das Holz quillt auf. Auf ausreichenden Dehnungsabstand achten!</span>
                    ) : (
                      <span>&bull; Keine Dimensionsänderung (Gleichgewicht).</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'konstruktion' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_konstruktion">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col gap-3">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Bauweise A</span>
              <h3 className="font-extrabold text-text-main text-base">Holzrahmen- &amp; Holztafelbau</h3>
              <p className="text-xs text-text-main/70 leading-relaxed">
                Stabförmiges Tragwerk aus Konstruktionsvollholz (KVH, e = 62,5 cm Raster), das durch aussteifende Holzwerkstoffplatten (OSB, Gipsfaser) die statische Scheiben- und Trageigenschaft erhält. Dazwischen liegt die Kern-Wärmedämmung.
              </p>
              <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-100/60 mt-2">
                <strong>Einsatz:</strong> Einfamilienhäuser, hocheffiziente Passivhauswände, Aufstockungen.
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col gap-3">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Bauweise B</span>
              <h3 className="font-extrabold text-text-main text-base">Massivholzbau (BSP / CLT)</h3>
              <p className="text-xs text-text-main/70 leading-relaxed">
                Flächige, mehrschichtige Tragwerke aus kreuzweise verklebten Brettlagen (Brettsperrholz). Trägt zweiachsig als Platte oder Scheibe (Rollschub in den Querlagen beachten) und hat eine höhere Masse als Rahmenbauteile.
              </p>
              <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-100/60 mt-2">
                <strong>Einsatz:</strong> Mehrgeschossiger Wohnungsbau (Gebäudeklasse 4 &amp; 5), Schachtwände, monolithische Deckenplatten.
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col gap-3">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Bauweise C</span>
              <h3 className="font-extrabold text-text-main text-base">Holzskelettbau (Pfosten-Riegel-Bauweise)</h3>
              <p className="text-xs text-text-main/70 leading-relaxed">
                Pfosten-Riegel-System unter Verwendung von Brettschichtholz (BSH/Leimholz) für weitspannende Riegelträger und schwere Druckstützen. Die Fassadenausfachung erfolgt getrennt (großflächige Glasflächen oder eingehängte Tafelsysteme).
              </p>
              <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-100/60 mt-2">
                <strong>Einsatz:</strong> Gewerbe- und Industriebauten, Messehallen, moderne großflächige Bürogebäude.
              </div>
            </div>

          </div>

          {/* Interactive Layered Diagram for CLT Floor */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col md:flex-row gap-6">
            
            <div className="flex flex-col gap-4 max-w-md w-full">
              <h3 className="font-black text-text-main text-sm flex items-center gap-2">
                <Layers size={16} className="text-amber-800" /> Detailaufbau: Massivholz-Geschossdecke (dataholz.eu)
              </h3>
              <p className="text-xs text-text-main/70 leading-relaxed">
                Eine gebundene Splittschüttung (60 mm) erhöht die flächenbezogene Masse der Decke deutlich. Das verringert die im Holzbau typische tieffrequente Trittschallübertragung (&lt; 100 Hz).
              </p>

              <div className="flex flex-col gap-1.5 text-xs text-text-main/80">
                <div className="flex gap-2 items-center"><span className="w-2.5 h-2.5 bg-[#4f46e5] rounded" /> Anhydrit-Heizestrich (65 mm)</div>
                <div className="flex gap-2 items-center"><span className="w-2.5 h-2.5 bg-[#3b82f6] rounded" /> Trittschalldämmung TDPT (30 mm)</div>
                <div className="flex gap-2 items-center"><span className="w-2.5 h-2.5 bg-[#78716c] rounded" /> Gebundene schwere Tragschüttung (60 mm, Masse-Lage)</div>
                <div className="flex gap-2 items-center"><span className="w-2.5 h-2.5 bg-[#d97706] rounded" /> Brettsperrholz-Kern CLT (140 mm)</div>
              </div>
            </div>

            {/* Simulated 2D Render of Floor stack */}
            <div className="flex-grow flex flex-col gap-1 bg-off-white/50 p-4 rounded-xl border border-home-grau/25 min-h-[180px] justify-center">
              <div className="w-full bg-[#4f46e5] text-white text-[10px] font-mono p-1 text-center font-bold tracking-wider rounded-t-lg">Estrich (65 mm)</div>
              <div className="w-full bg-[#1d4ed8] text-white text-[10px] font-mono p-1.5 text-center font-bold tracking-wider">Trittschallminderung (30 mm)</div>
              <div className="w-full bg-[#78716c] text-white text-[10px] font-mono p-2.5 text-center font-bold tracking-wider">Schüttungsmasse zur Trittschall-Dämpfung (60 mm, gebunden)</div>
              <div className="w-full bg-[#b45309] text-white text-[10px] font-mono p-4 text-center font-black tracking-wider rounded-b-lg">
                BSP / CLT Brettsperrholz-Tragscheibe (140 mm 5-lagig)
                <div className="flex justify-around mt-1">
                  <span className="border-t border-white/50 w-full text-[8px] italic">Sichtqualität-Unterseite</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {activeSubTab === 'bemessung' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_bemessung">
          
          <div className="bg-amber-50 text-amber-950 p-4 rounded-xl border border-amber-200">
            <h3 className="font-bold text-sm text-amber-900 mb-1 flex items-center gap-2">
              <Calculator size={18} /> Statischer Nachweis nach Eurocode 5 (DIN EN 1995-1-1)
            </h3>
            <p className="text-xs text-amber-900/80">
              Schlanke Druckstäbe werden nach dem Ersatzstabverfahren (DIN EN 1995-1-1, 6.3.2) nachgewiesen. Der Rechner ermittelt k_c für die schwache Achse bei zentrischem Druck.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Controls Parameters Box (span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-4 border border-home-grau/30 p-5 rounded-xl bg-white shadow-xs">
              <h4 className="font-bold text-text-main text-xs uppercase tracking-wider border-b border-home-grau/25 pb-2">Stützen-Parameter</h4>
              
              {/* Parameter Row 1: Wood class */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main">Holzart / Festigkeitsklasse</label>
                <select aria-label="Holzart / Festigkeitsklasse" 
                  value={woodClass} 
                  onChange={(e) => setWoodClass(e.target.value)}
                  className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                >
                  <option value="C24">KVH / Vollholz C24</option>
                  <option value="C30">Vollholz C30 (Tragfähig)</option>
                  <option value="GL24h">Brettschichtholz GL24h (Balken standard)</option>
                  <option value="GL28c">Brettschichtholz GL28c (Kombiniert)</option>
                  <option value="GL30h">BHS GL30h (Hochleistung)</option>
                </select>
                <span className="text-[10px] text-text-main/50 font-mono">f_c,0,k = {formatDeWert(currentMaterial.f_c0k)} N/mm², E_mean = {formatDeWert(currentMaterial.E_0mean)} N/mm²</span>
              </div>

              {/* Parameter Row 2: Service class */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Nutzungsklasse (NKL)</label>
                  <select aria-label="Nutzungsklasse (NKL)" 
                    value={serviceClass} 
                    onChange={(e) => setServiceClass(parseInt(e.target.value))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-medium"
                  >
                    <option value={1}>NKL 1 (Beheizter Innenraum)</option>
                    <option value={2}>NKL 2 (Überdachter Außenraum)</option>
                    <option value={3}>NKL 3 (Freie Bewitterung)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">KLED (Lastdauer)</label>
                  <select aria-label="KLED (Lastdauer)" 
                    value={loadDuration} 
                    onChange={(e) => setLoadDuration(e.target.value)}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-medium"
                  >
                    <option value="stnd">Ständig (z. B. Eigengewicht)</option>
                    <option value="lg">Lang (z. B. Deckenschüttung)</option>
                    <option value="mtl">Mittel (z. B. Nutzlasten)</option>
                    <option value="krt">Kurz (z. B. Schneelasten)</option>
                    <option value="sfs">Sehr kurz (z. B. Windböen)</option>
                  </select>
                </div>
              </div>

              {/* Parameter Row 3: Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Stützenbreite b (mm)</label>
                  <input aria-label="Stützenbreite b (mm)" 
                    type="number" min="0" 
                    value={colB} 
                    onChange={(e) => setColB(Math.max(60, parseInt(e.target.value) || 60))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Stützenhöhe h (mm)</label>
                  <input aria-label="Stützenhöhe h (mm)" 
                    type="number" min="0" 
                    value={colH} 
                    onChange={(e) => setColH(Math.max(60, parseInt(e.target.value) || 60))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                  />
                </div>
              </div>

              {/* Length and Euler conditions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Stützenlänge L (m)</label>
                  <input aria-label="Stützenlänge L (m)" 
                    type="number" min="0" 
                    step="0.1"
                    value={colLen} 
                    onChange={(e) => setColLen(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Lagerung (Euler)</label>
                  <select aria-label="Lagerung (Euler)" 
                    value={eulerCase} 
                    onChange={(e) => setEulerCase(parseInt(e.target.value))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-medium"
                  >
                    <option value={1}>Euler-Fall 1: Kragarm, unten eingespannt (β = 2,0)</option>
                    <option value={2}>Euler-Fall 2: beidseitig gelenkig (β = 1,0)</option>
                    <option value={3}>Euler-Fall 3: eingespannt / gelenkig (β = 0,7)</option>
                    <option value={4}>Euler-Fall 4: beidseitig eingespannt (β = 0,5)</option>
                  </select>
                </div>
              </div>

              {/* Design Axial Load input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main text-emerald-800">Einwirkende Druckkraft N_Ed (kN)</label>
                <div className="relative">
                  <input aria-label="Einwirkende Druckkraft N_Ed (kN)" 
                    type="number" min="0" 
                    value={designLoad} 
                    onChange={(e) => setDesignLoad(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-black"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 font-mono text-[10px] font-bold text-text-main/50">kN</span>
                </div>
              </div>

            </div>

            {/* Right Results Sheet (span 7) */}
            <div className="lg:col-span-7 bg-off-white p-5 rounded-xl border border-home-grau/35 flex flex-col justify-between gap-5">
              
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Statische Nachweisergebnisse</span>
                <h3 className="font-extrabold text-text-main text-base mt-2">Biegungsknicken um die schwache Achse</h3>
              </div>

              {/* Static Equations Card */}
              <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2 shadow-xs">
                <div className="text-xs text-text-main/70">
                  <span className="font-bold text-text-main block">1. Bemessungsfestigkeit <InlineMath math="f_{c,0,d}" />:</span>
                  <div className="my-1 text-center bg-off-white py-1 rounded border border-home-grau/10">
                    <InlineMath math={`f_{c,0,d} = k_{mod} \\times \\frac{f_{c,0,k}}{\\gamma_{M}} = ${calculationResults.k_mod} \\times \\frac{${currentMaterial.f_c0k}}{${calculationResults.gamma_M}} = ${formatDeZahl(calculationResults.f_c0d, 2)}\\text{ N/mm}^2`} />
                  </div>
                </div>

                <div className="text-xs text-text-main/70">
                  <span className="font-bold text-text-main block">2. Bezogene Schlankheit <InlineMath math="\lambda_{rel,z}" /> und Knickbeiwert <InlineMath math="k_{c,z}" />:</span>
                  <div className="text-xs text-text-main/80 space-y-1 mt-1 leading-normal">
                    <div>&bull; Wirksame Länge <InlineMath math="l_{ef}" />: <span className="font-mono">{formatDeZahl(calculationResults.l_ef, 0)} mm</span></div>
                    <div>&bull; Schlankheitsgrad <InlineMath math="\lambda_z" />: <span className="font-mono">{formatDeZahl(calculationResults.lambda_z, 2)}</span> (Grenzschlankheit nach EC5 = 120)</div>
                    <div>&bull; Bezogene Schlankheit <InlineMath math="\lambda_{rel,z}" />: <span className="font-mono font-bold text-text-main">{formatDeZahl(calculationResults.lambda_rel_z, 3)}</span></div>
                    <div>&bull; Knickminderungsbeiwert <InlineMath math="k_{c,z}" />: <span className="font-mono font-bold text-amber-800">{formatDeZahl(calculationResults.k_cz, 4)}</span></div>
                  </div>
                </div>

                <div className="text-xs text-text-main/70">
                  <span className="font-bold text-text-main block">3. Knick-Widerstandskraft <InlineMath math="F_{c,R,d}" />:</span>
                  <div className="my-1 text-center bg-off-white py-1 rounded border border-home-grau/10">
                    <InlineMath math={`F_{c,R,d} = k_{c,z} \\times A \\times f_{c,0,d} = ${formatDeZahl(calculationResults.k_cz, 4)} \\times ${formatDeZahl(calculationResults.A, 0)}\\text{ mm}^2 \\times ${formatDeZahl(calculationResults.f_c0d, 2)}\\text{ N/mm}^2 = ${formatDeZahl(calculationResults.F_c_R_d_kN, 1)}\\text{ kN}`} />
                  </div>
                </div>
              </div>

              <EingabeHinweise hinweise={calculationResults.hinweise} />
              {/* Performance Indicator Gauge */}
              <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-main">Auslastungsnachweis (N_Ed / F_c,R,d)</span>
                  <span className={`text-sm font-black font-mono px-2 py-0.5 rounded ${
                    calculationResults.isUnsafe ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {formatDeZahl(calculationResults.utilization, 1)}% {calculationResults.isUnsafe ? 'NICHT TRAGFÄHIG' : 'ERFÜLLT'}
                  </span>
                </div>

                {/* Bar representation */}
                <div className="w-full bg-home-grau/20 h-4 rounded-full overflow-hidden relative shadow-inner">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      calculationResults.isUnsafe ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.min(100, calculationResults.utilization)}%` }}
                  />
                  {/* limit marker */}
                  <div className="absolute right-[0%] top-0 bottom-0 border-l-2 border-danger/60 w-1" />
                </div>

                {calculationResults.isUnsafe && (
                  <div className="flex gap-2 text-rose-900 border border-rose-200 bg-rose-50 p-2 text-[11px] rounded-lg mt-3 leading-normal">
                    <ShieldAlert size={14} className="text-rose-600 flex-shrink-0" />
                    <span>
                      <strong>Achtung:</strong> Die Druckkraft überschreitet die Knicktragfähigkeit. Querschnitt vergrößern oder Knicklänge verringern (z. B. Zwischenhalterung).
                    </span>
                  </div>
                )}
              </div>

              <FormulaDerivationBox
                live
                title="Ihr Rechenweg: Knicknachweis mit den aktuellen Eingaben"
                zielGleichung={`\\frac{N_{Ed}}{k_c \\cdot A \\cdot f_{c,0,d}} = \\frac{${formatDeTeX(designLoad, 1)}}{${formatDeTeX(calculationResults.F_c_R_d_kN, 1)}} = ${formatDeTeX(calculationResults.utilization, 1)}\\,\\%`}
                normQuelle="DIN EN 1995-1-1 mit NA (DE), 6.3.2"
                schritte={[
                  {
                    titel: 'Bemessungswert der Druckfestigkeit',
                    erklaerung: `${currentMaterial.class}, Nutzungsklasse ${formatDeZahl(serviceClass, 0)}: k_mod = ${formatDeZahl(calculationResults.k_mod, 2)}, γ_M = 1,3.`,
                    formel: `f_{c,0,d} = \\frac{${formatDeTeX(calculationResults.k_mod, 2)} \\cdot ${formatDeTeX(currentMaterial.f_c0k, 1)}}{${formatDeTeX(calculationResults.gamma_M, 1)}} = ${formatDeTeX(calculationResults.f_c0d, 2)}\\,\\text{N/mm}^2`,
                  },
                  {
                    titel: 'Knicklänge und Schlankheit',
                    erklaerung: `Euler-Fall ${formatDeZahl(eulerCase, 0)} mit β = ${formatDeZahl(calculationResults.l_ef / (colLen * 1000), 1)}; maßgebend ist der kleinere Trägheitsradius.`,
                    formel: `l_{ef} = ${formatDeTeX(calculationResults.l_ef / (colLen * 1000), 1)} \\cdot ${formatDeTeX(colLen * 1000, 0)} = ${formatDeTeX(calculationResults.l_ef, 0)}\\,\\text{mm};\\quad i = \\frac{${formatDeTeX(Math.min(colB, colH), 0)}}{\\sqrt{12}} = ${formatDeTeX(Math.min(calculationResults.iy, calculationResults.iz), 1)}\\,\\text{mm};\\quad \\lambda = ${formatDeTeX(calculationResults.lambda_z, 1)}`,
                  },
                  {
                    titel: 'Bezogene Schlankheit',
                    erklaerung: `Mit E_0,05 = ${formatDeZahl(calculationResults.E_05, 0)} N/mm².`,
                    formel: `\\lambda_{rel} = \\frac{\\lambda}{\\pi} \\sqrt{\\frac{f_{c,0,k}}{E_{0{,}05}}} = \\frac{${formatDeTeX(calculationResults.lambda_z, 1)}}{\\pi} \\sqrt{\\frac{${formatDeTeX(currentMaterial.f_c0k, 1)}}{${formatDeTeX(calculationResults.E_05, 0)}}} = ${formatDeTeX(calculationResults.lambda_rel_z, 3)}`,
                  },
                  {
                    titel: 'Knickbeiwert',
                    erklaerung: calculationResults.lambda_rel_z <= 0.3
                      ? 'λ_rel ≤ 0,3: Kein Knickeinfluss, k_c = 1,0.'
                      : `Imperfektionsbeiwert β_c = ${currentMaterial.class.startsWith('GL') ? '0,1 (Brettschichtholz)' : '0,2 (Vollholz)'}.`,
                    formel: calculationResults.lambda_rel_z <= 0.3
                      ? 'k_c = 1{,}0'
                      : `k = 0{,}5 \\,[1 + ${currentMaterial.class.startsWith('GL') ? '0{,}1' : '0{,}2'} \\cdot (${formatDeTeX(calculationResults.lambda_rel_z, 3)} - 0{,}3) + ${formatDeTeX(calculationResults.lambda_rel_z, 3)}^2] = ${formatDeTeX(0.5 * (1 + (currentMaterial.class.startsWith('GL') ? 0.1 : 0.2) * (calculationResults.lambda_rel_z - 0.3) + calculationResults.lambda_rel_z ** 2), 3)};\\quad k_c = ${formatDeTeX(calculationResults.k_cz, 4)}`,
                  },
                  {
                    titel: 'Knicktragfähigkeit und Ausnutzung',
                    erklaerung: calculationResults.isUnsafe ? 'Die Ausnutzung liegt über 100 %: Der Nachweis ist nicht erfüllt.' : 'Die Ausnutzung liegt unter 100 %: Der Nachweis ist erfüllt.',
                    formel: `F_{c,R,d} = ${formatDeTeX(calculationResults.k_cz, 4)} \\cdot ${formatDeTeX(calculationResults.A, 0)} \\cdot ${formatDeTeX(calculationResults.f_c0d, 2)} \\cdot 10^{-3} = ${formatDeTeX(calculationResults.F_c_R_d_kN, 1)}\\,\\text{kN};\\quad \\eta = \\frac{${formatDeTeX(designLoad, 1)}}{${formatDeTeX(calculationResults.F_c_R_d_kN, 1)}} = ${formatDeTeX(calculationResults.utilization, 1)}\\,\\%`,
                  },
                ]}
                ergebnisHinweis={`Ausnutzung ${formatDeZahl(calculationResults.utilization, 1)} % (${calculationResults.isUnsafe ? 'nicht erfüllt' : 'erfüllt'})`}
              />

            </div>

          </div>

          {/* NEW INTERACTIVE: Querpressungsnachweis nach EC5 6.1.5 */}
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
            <div>
              <span className="text-xs uppercase font-black text-amber-800 tracking-wider">Ergänzender Tragfähigkeitsnachweis</span>
              <h3 className="font-extrabold text-text-main text-base mt-1 flex items-center gap-2">
                <Scale size={20} className="text-amber-800" /> Querpressungsnachweis nach Eurocode 5 (DIN EN 1995-1-1 Abs. 6.1.5)
              </h3>
              <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                Wird Holz quer zur Faserrichtung druckbelastet (z.B. Schwellenauflager, Stützenfüße, Balkenköpfe), ist die Festigkeit deutlich geringer als parallel zur Faser. Eurocode 5 erlaubt die Berücksichtigung von Lastverteilungseffekten des überstehenden Holzes durch eine wirksame Kontaktlänge <InlineMath math="l_{ef}" /> und eine Auflagerverstärkung <InlineMath math="k_{c,90}" />.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column Input panel (span 5) */}
              <div className="lg:col-span-5 flex flex-col gap-4 bg-off-white p-4 rounded-xl border border-home-grau/20">
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-main">Auflager-Geometrie</h4>

                {/* Configuration */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Auflagertyp &amp; Beanspruchungsart</label>
                  <select aria-label="Auflagertyp &amp; Beanspruchungsart"
                    value={qpConfig}
                    onChange={(e) => setQpConfig(e.target.value)}
                    className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                  >
                    <option value="schwelle">Kontinuierliche Lagerung, Schwelle (k_c,90 = 1,25 Vollholz / 1,5 BSH)</option>
                    <option value="pfosten_riegel">Einzelauflager, l₁ ≥ 2h (k_c,90 = 1,5 Vollholz / 1,75 BSH, l ≤ 400 mm)</option>
                    <option value="traeger_ende">Allgemeiner Fall (k_c,90 = 1,0)</option>
                    <option value="clt_plate">Brettsperrholz (Wert nach ETA; hier 1,0 als Lehrannahme)</option>
                  </select>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Auflagerbreite b (mm)</label>
                    <input aria-label="Auflagerbreite b (mm)"
                      type="number" min="0"
                      value={qpB}
                      onChange={(e) => setQpB(Math.max(40, parseInt(e.target.value) || 40))}
                      className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Auflagerlänge l (mm)</label>
                    <input aria-label="Auflagerlänge l (mm)"
                      type="number" min="0"
                      value={qpL}
                      onChange={(e) => setQpL(Math.max(40, parseInt(e.target.value) || 40))}
                      className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                    />
                  </div>
                </div>

                {/* Overhang switch */}
                <div className="flex items-center justify-between border-t border-home-grau/10 pt-2.5">
                  <span className="text-xs font-bold text-text-main">Überstehende Holzfasern (&gt; 150mm)?</span>
                  <button
                    onClick={() => setQpOverhang(!qpOverhang)}
                    type="button"
                    className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition-all ${
                      qpOverhang
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-white text-text-main/50 border-home-grau/25'
                    }`}
                  >
                    {qpOverhang ? 'Ja (+30/60 mm l_ef)' : 'Nein (l_ef = l)'}
                  </button>
                </div>

                {/* Load */}
                <div className="flex flex-col gap-1 border-t border-home-grau/10 pt-2.5">
                  <label className="text-xs font-bold text-emerald-800">Querpressende Einwirkung F_c,90,d (kN)</label>
                  <div className="relative">
                    <input aria-label="Querpressende Einwirkung F_c,90,d (kN)"
                      type="number" min="0"
                      value={qpForce}
                      onChange={(e) => setQpForce(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-black"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 font-mono text-[10px] text-text-main/50 font-bold">kN</span>
                  </div>
                </div>
              </div>

              {/* Right Column result panel (span 7) */}
              <div className="lg:col-span-7 bg-amber-50/20 border border-amber-200/50 p-5 rounded-xl flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-1">Druckfestigkeitsnachweis</span>
                  <h4 className="font-extrabold text-sm text-text-main">Querpressung senkrecht zur Holzfaser</h4>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-3 shadow-xs">
                  {/* Step 1 */}
                  <div className="text-xs text-text-main/80 space-y-1">
                    <span className="font-bold text-text-main block">1. Wirksame Auflagerfläche <InlineMath math="A_{ef}" />:</span>
                    <p className="text-[11px] leading-relaxed">
                      Länge <InlineMath math="l" /> wird erhöht um bis zu 30 mm je Überhangseite. Wirksame Länge: <span className="font-bold font-mono text-amber-800">{formatDeWert(qpResults.l_ef)} mm</span>
                    </p>
                    <div className="my-1 bg-[#fef3c7]/20 p-1.5 rounded border border-[#fef3c7] text-center font-mono text-[11px]">
                      <InlineMath math={`A_{ef} = b \\times l_{ef} = ${formatDeTeXWert(qpB)} \\times ${formatDeTeXWert(qpResults.l_ef)} = ${formatDeTeXWert(qpResults.A_ef)}\\text{ mm}^2`} />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="text-xs text-text-main/80 space-y-1">
                    <span className="font-bold text-text-main block">2. Bemessungsquerpressfestigkeit <InlineMath math="f_{c,90,d}" />:</span>
                    <p className="text-[11px] leading-relaxed">
                      Wert für Holzart <span className="font-bold">{woodClass}</span> (<InlineMath math={`f_{c,90,k} = ${qpResults.f_c90k}\\text{ N/mm}^2`} />) modifiziert mit <InlineMath math={`k_{mod} = ${formatDeTeXWert(calculationResults.k_mod)}`} />:
                    </p>
                    <div className="my-1 bg-[#fef3c7]/20 p-1.5 rounded border border-[#fef3c7] text-center font-mono text-[11px]">
                      <InlineMath math={`f_{c,90,d} = ${calculationResults.k_mod} \\times \\frac{${qpResults.f_c90k}}{${qpResults.gamma_M}} = ${formatDeZahl(qpResults.f_c90d, 2)}\\text{ N/mm}^2`} />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="text-xs text-text-main/80 space-y-1">
                    <span className="font-bold text-text-main block">3. Spannung und Tragwiderstands-Vergleich:</span>
                    <div className="text-[11px] space-y-1 bg-stone-50 p-2 rounded border border-stone-200">
                      <div>&bull; Vorhandene Pressung <InlineMath math="\sigma_{c,90,d}" />: <span className="font-mono font-bold text-text-main">{formatDeZahl(qpResults.sigma_c90d, 2)} N/mm²</span></div>
                      <div>&bull; Zulässige Pressung <InlineMath math="k_{c,90} \cdot f_{c,90,d}" />: <span className="font-mono font-bold text-emerald-800">{formatDeZahl(qpResults.k_c90 * qpResults.f_c90d, 2)} N/mm²</span></div>
                      <div>&bull; Max. Einwirkungskraft <InlineMath math="F_{c,90,Rd}" />: <span className="font-mono font-bold text-amber-900">{formatDeZahl(qpResults.F_c90Rd_kN, 1)} kN</span></div>
                    </div>
                  </div>
                </div>

                <EingabeHinweise hinweise={qpResults.hinweise} />
                {/* Performance Indicator */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-main">Ausnutzungsgrad (σ_c,90,d / k_c,90 * f_c,90,d)</span>
                    <span className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                      qpResults.isUnsafe ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {formatDeZahl(qpResults.utilization, 1)}% {qpResults.isUnsafe ? 'ÜBERLASTET' : 'ERFÜLLT'}
                    </span>
                  </div>

                  <div className="w-full bg-home-grau/20 h-3 rounded-full overflow-hidden relative shadow-inner">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        qpResults.isUnsafe ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(100, qpResults.utilization)}%` }}
                    />
                  </div>

                  {qpResults.isUnsafe && (
                    <div className="flex gap-2 text-rose-900 border border-rose-200 bg-rose-50 p-2 text-[10px] rounded-lg mt-2 leading-relaxed">
                      <ShieldAlert size={14} className="text-rose-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Querdruck überschritten:</strong> Es drohen große Eindrückungen. Auflagerlänge <InlineMath math="l" /> oder Breite vergrößern bzw. Auflager verstärken (z. B. Vollgewindeschrauben).
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'verbindung' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_connections">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">Stab- / Scherverbindungen</span>
              <h3 className="font-extrabold text-text-main text-base">Stabdübel- und Bolzenanschlüsse</h3>
              <p className="text-xs text-text-main/70 leading-relaxed">
                Klassische ingenieurmäßige Verbindungstechnik mit metallischen stabförmigen Elementen. Nach der maßgebenden <strong>Johansen-Theorie</strong> im Eurocode 5 hängen die Abscher-Grenzlasten vom Fließmoment des Stahls sowie der Lochleibungsfestigkeit des Holzes ab. Bei Überlastung bildet sich im Stahl ein plastisches Fließgelenk, während sich das Holz lokal quer- und längskomprimiert (Duktiles Versagen).
              </p>
              <div className="text-[11px] font-medium leading-normal bg-amber-50 p-3 rounded-lg border border-amber-100/50 mt-2">
                <strong>Anordnungsregel (DIN EN 1995-1-1 8.5):</strong> Mindestabstände parallel und rechtwinklig zur Faser verhindern das Aufspalten des Holzes, z. B. für Stabdübel <InlineMath math="a_1 \ge (3 + 2|\cos\alpha|) \cdot d" /> und <InlineMath math="a_2 \ge 3 \cdot d" /> (Tab. 8.5).
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">Holzbauschrauben</span>
              <h3 className="font-extrabold text-text-main text-base">Vollgewindeschrauben &amp; Zugverbindungen</h3>
              <p className="text-xs text-text-main/70 leading-relaxed">
                Vollgewindeschrauben sind im Brettsperrholz- und Ingenieurholzbau weit verbreitet. Sie übertragen über die gesamte Gewindelänge hohe Axialkräfte. Unter 45° eingedreht, wird die Scherkraft überwiegend als Axialkraft (Zug/Druck) in der Schraube abgetragen; die Bemessung erfolgt nach ETA.
              </p>
              <div className="text-[11px] font-medium leading-normal bg-amber-50 p-3 rounded-lg border border-amber-100/50 mt-2">
                <strong>Ingenieurvorteil:</strong> Schnelle Montage, in Nadelholz meist ohne Vorbohren (nach ETA), und bei geneigter Anordnung hohe Steifigkeit (geringer Schlupf).
              </div>
            </div>

          </div>

          {/* Interactive Johansen failure modes visualizer */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
            <h3 className="font-black text-sm text-text-main flex items-center gap-2 border-b border-home-grau/20 pb-2">
              <GitCommit size={16} className="text-amber-800" /> Johansen-Versagensmechanismen in einschnittigen Holz-Holz-Fugen
            </h3>
            
            <p className="text-xs text-text-main/70 max-w-3xl">
              Eurocode 5 unterscheidet mathematisch zwischen rein spröden (Lochleibungsbruch) und hochduktilen (Bildung ein- oder zweier Fließgelenke des Metallstifts im Fugenschnitt) Versagensformen.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="border border-home-grau/20 p-4 rounded-xl bg-off-white text-center flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-danger font-bold block">Modus A: Reine Leibung</span>
                <span className="w-12 h-16 bg-[#e2e8f0] border-2 border-amber-800/40 relative flex items-center justify-center rounded">
                  <span className="absolute w-2 h-14 bg-stone-700/80 -rotate-3" />
                </span>
                <p className="text-[11px] text-text-main/60 mt-1 leading-normal">Holz leibt lokal komplett aus, der Verbindungsstift verformt sich jedoch nicht plastisch (Dickes Blech / Geringe Krafteinleitung).</p>
              </div>

              <div className="border border-home-grau/20 p-4 rounded-xl bg-off-white text-center flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold block">Modus B: Ein Fließgelenk</span>
                <span className="w-12 h-16 bg-[#e2e8f0] border-2 border-amber-800/40 relative flex items-center justify-center rounded">
                  <span className="absolute w-2 h-14 bg-stone-700/80 skew-x-12" />
                </span>
                <p className="text-[11px] text-text-main/60 mt-1 leading-normal">Der Verbindungsbolzen verformt sich an der Scherfuge unter Ausbildung eines einzelnen plastischen Knickpunkts (mittlere Zähigkeit).</p>
              </div>

              <div className="border border-home-grau/20 p-4 rounded-xl bg-off-white text-center flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold block">Modus C: Zwei Fließgelenke</span>
                <span className="w-12 h-16 bg-[#e2e8f0] border-2 border-amber-800/40 relative flex items-center justify-center rounded">
                  <span className="absolute w-2 h-14 bg-stone-700/80 rounded" style={{ transform: 'rotate(10deg) skewY(15deg)' }} />
                </span>
                <p className="text-[11px] text-text-main/60 mt-1 leading-normal">Im Stift bilden sich beidseits zwei Fließgelenke aus. Maximal duktiles Tragverhalten bei optimal ausgenutztem Verbund.</p>
              </div>
            </div>

          </div>

          {/* NEW INTERACTIVE: Schrauben-Berechnung nach EC5 Abs. 8.7 */}
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
            <div>
              <span className="text-xs uppercase font-black text-amber-800 tracking-wider">Verbindungsmittelprüfung &amp; Ingenieurpraxis</span>
              <h3 className="font-extrabold text-text-main text-base mt-1 flex items-center gap-2">
                <Wrench size={20} className="text-amber-800" /> Vollgewindeschrauben-Grenztragfähigkeitsrechner (EC5)
              </h3>
              <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                Berechnen Sie die charakt. und bemessungsrelevante Tragfähigkeit einer Schraubengruppe unter Axialzug (Herausziehen) oder rechtwinkliger Scherspannung. Der Rechner wertet den Einfluss der Holzrohdichte <InlineMath math="\rho_k" />, der wirksamen Gewindeeinschraublänge <InlineMath math="l_{ef}" /> und den Seileffekt (Rope effect) nach der Johansen-Grenzlasttheorie aus.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column Controls (span 5) */}
              <div className="lg:col-span-5 flex flex-col gap-4 bg-off-white p-4 rounded-xl border border-home-grau/20">
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-main">Verbindungs-Parameter</h4>

                {/* Wood density selector */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Gegenholz-Materialklasse (Dichte)</label>
                  <select aria-label="Gegenholz-Materialklasse (Dichte)"
                    value={connWoodClass}
                    onChange={(e) => setConnWoodClass(e.target.value)}
                    className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                  >
                    <option value="C24">KVH / Vollholz C24 (ρ_k = 350 kg/m³)</option>
                    <option value="C30">Nadelholz C30 (ρ_k = 380 kg/m³)</option>
                    <option value="D30">Laubholz D30 (Buche/Eiche) (ρ_k = 530 kg/m³)</option>
                    <option value="D40">Laubholz D40 (ρ_k = 550 kg/m³)</option>
                    <option value="GL24h">BSH GL24h (ρ_k = 385 kg/m³)</option>
                    <option value="GL30h">BSH GL30h (ρ_k = 430 kg/m³)</option>
                  </select>
                </div>

                {/* Screw Dimensions */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Schrauben-Durchm. d (mm)</label>
                    <select aria-label="Schrauben-Durchm. d (mm)"
                      value={connD}
                      onChange={(e) => setConnD(parseInt(e.target.value) || 8)}
                      className="border border-home-grau/30 bg-white text-xs p-1.5 rounded-lg text-text-main font-semibold"
                    >
                      <option value={6}>d = 6,0 mm (Spax)</option>
                      <option value={8}>d = 8,0 mm (Standard Holzbau)</option>
                      <option value={10}>d = 10,0 mm (Schwerlast)</option>
                      <option value={12}>d = 12,0 mm (Extrem-Träger)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Gewindelänge l_ef (mm)</label>
                    <input aria-label="Gewindelänge l_ef (mm)"
                      type="number"
                      min="40"
                      max="300"
                      value={connLef}
                      onChange={(e) => setConnLef(Math.max(40, parseInt(e.target.value) || 40))}
                      className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Eindrehwinkel α</label>
                    <select aria-label="Eindrehwinkel α"
                      value={connAngle}
                      onChange={(e) => setConnAngle(parseInt(e.target.value) || 90)}
                      className="border border-home-grau/30 bg-white text-xs p-1.5 rounded-lg text-text-main"
                    >
                      <option value={90}>90° (Rechtwinklig)</option>
                      <option value={45}>45° (Schrägverschraubung)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Schraubenanzahl n</label>
                    <input aria-label="Schraubenanzahl n"
                      type="number"
                      min="1"
                      max="48"
                      value={connCount}
                      onChange={(e) => setConnCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-bold"
                    />
                  </div>
                </div>

                {/* Load */}
                <div className="flex flex-col gap-1 border-t border-home-grau/10 pt-2.5">
                  <label className="text-xs font-bold text-rose-800">Bemessungseinwirkung V_Ed (kN)</label>
                  <div className="relative">
                    <input aria-label="Bemessungseinwirkung V_Ed (kN)"
                      type="number" min="0"
                      value={connForce}
                      onChange={(e) => setConnForce(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-black"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 font-mono text-[10px] text-text-main/50 font-bold">kN</span>
                  </div>
                </div>
              </div>

              {/* Right Column Results (span 7) */}
              <div className="lg:col-span-7 bg-amber-50/20 border border-amber-200/50 p-5 rounded-xl flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-1">Verbindungskennwerte</span>
                  <h4 className="font-extrabold text-sm text-text-main">Tragwiderstände nach Ersatzformeln (Eurocode 5)</h4>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-3 shadow-xs text-xs">
                  {/* Pullout resistance */}
                  <div className="space-y-1">
                    <span className="font-black text-text-main flex justify-between items-center bg-off-white px-2 py-1 rounded">
                      <span>A: Axialer Ausziehwiderstand (F_ax,Rd):</span>
                      <span className="font-mono text-emerald-800">{formatDeZahl(connResults.F_ax_Rd_total_kN, 1)} kN</span>
                    </span>
                    <p className="text-[10px] text-text-main/60 pl-2 leading-relaxed">
                      Erhöhte Auszugsfestigkeit dank Dichteverhältnis <InlineMath math="(\rho_k/350)^{0{,}8}" />. Wirksamer Eindrehwinkel-Koeffizient <InlineMath math="1/(1{,}2\cos^2\alpha + \sin^2\alpha)" /> bei {formatDeWert(connAngle)}° beträgt <span className="font-bold">{formatDeZahl(connResults.factor_alpha, 3)}</span>{connResults.factor_alpha < 1 ? ' (Abminderung gegenüber 90°)' : ''}.
                    </p>
                  </div>

                  {/* Shear resistance */}
                  <div className="space-y-1 border-t border-home-grau/10 pt-2">
                    <span className="font-black text-text-main flex justify-between items-center bg-off-white px-2 py-1 rounded">
                      <span>B: Schertragfähigkeit (F_v,Rd):</span>
                      <span className="font-mono text-emerald-800">{formatDeZahl(connResults.F_v_Rd_total_kN, 1)} kN</span>
                    </span>
                    <p className="text-[10px] text-text-main/60 pl-2 leading-relaxed">
                      Lochleibungswiderstand des Holzes <InlineMath math="f_{h,k}" /> = {formatDeZahl(connResults.f_h_k, 1)} N/mm² mit zusätzlichem Tragbeiwert aus Seileffekt (Rope-Effect) = {formatDeZahl(connResults.rope_effect, 0)} N.
                    </p>
                  </div>
                </div>

                {/* Gauges */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Gauge Axial */}
                  <div className="bg-white p-3 rounded-xl border border-home-grau/15">
                    <span className="text-[10px] text-text-main/50 font-black block text-center uppercase tracking-wider">Ausnutzung Axial</span>
                    <span className={`text-base font-black font-mono block text-center mt-1 py-0.5 rounded ${
                      connResults.isAxialUnsafe ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {formatDeZahl(connResults.utilAxial, 1)}%
                    </span>
                    <div className="w-full bg-home-grau/15 h-2 rounded-full overflow-hidden mt-1.5">
                      <div
                        className={`h-full rounded-full ${connResults.isAxialUnsafe ? 'bg-rose-600' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, connResults.utilAxial)}%` }}
                      />
                    </div>
                  </div>

                  {/* Gauge Shear */}
                  <div className="bg-white p-3 rounded-xl border border-home-grau/15">
                    <span className="text-[10px] text-text-main/50 font-black block text-center uppercase tracking-wider">Ausnutzung Scherung</span>
                    <span className={`text-base font-black font-mono block text-center mt-1 py-0.5 rounded ${
                      connResults.isShearUnsafe ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {formatDeZahl(connResults.utilShear, 1)}%
                    </span>
                    <div className="w-full bg-home-grau/15 h-2 rounded-full overflow-hidden mt-1.5">
                      <div
                        className={`h-full rounded-full ${connResults.isShearUnsafe ? 'bg-rose-600' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, connResults.utilShear)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* General Status message */}
                {(connResults.isAxialUnsafe || connResults.isShearUnsafe) ? (
                  <div className="bg-rose-50 border border-rose-200 text-rose-900 p-2 text-[10px] rounded-lg leading-snug">
                    <strong>Tragfähigkeit nicht ausreichend:</strong> Durchmesser <InlineMath math="d" />, Anzahl <InlineMath math="n" /> oder Einschraubtiefe <InlineMath math="l_{ef}" /> erhöhen; bei Gruppen n_ef und Abstände beachten.
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 p-2 text-[10px] rounded-lg leading-snug">
                    <strong>Nachweis im Lehrmodell erfüllt:</strong> Herausziehen und Abscheren sind vereinfacht nachgewiesen (ohne n_ef, Abstände, Blockscherversagen; Schraubenwerte nach ETA).
                  </div>
                )}

                <FormulaDerivationBox
                  live
                  title="Ihr Rechenweg: Schraubenverbindung mit den aktuellen Eingaben"
                  zielGleichung={`F_{v,Rd} = \\frac{k_{mod} \\cdot n \\cdot F_{v,Rk}}{\\gamma_M} = ${formatDeTeX(connResults.F_v_Rd_total_kN, 1)}\\,\\text{kN};\\quad F_{ax,Rd} = ${formatDeTeX(connResults.F_ax_Rd_total_kN, 1)}\\,\\text{kN}`}
                  normQuelle="DIN EN 1995-1-1 mit NA (DE), 8.2 und 8.7 (Lehrmodell)"
                  schritte={[
                    {
                      titel: 'Ausziehfestigkeit',
                      erklaerung: `Lehrwert f_ax,k = 12 N/mm², Rohdichte ρ_k = ${formatDeZahl(connResults.rho_k, 0)} kg/m³, Einschraubwinkel ${formatDeZahl(connAngle, 0)}°.`,
                      formel: `f_{ax,\\alpha,k} = 12 \\cdot ${formatDeTeX(connResults.factor_alpha, 3)} \\cdot \\left(\\frac{${formatDeTeX(connResults.rho_k, 0)}}{350}\\right)^{0{,}8} = ${formatDeTeX(connResults.f_ax_alpha_k, 2)}\\,\\text{N/mm}^2`,
                    },
                    {
                      titel: 'Ausziehwiderstand der Gruppe',
                      erklaerung: 'Lehrmodell mit k_mod = 0,8 und γ_M = 1,3, ohne wirksame Anzahl n_ef.',
                      formel: `F_{ax,Rd} = \\frac{0{,}8 \\cdot ${formatDeTeX(connCount, 0)} \\cdot ${formatDeTeX(connResults.f_ax_alpha_k, 2)} \\cdot ${formatDeTeX(connD, 0)} \\cdot ${formatDeTeX(connLef, 0)}}{1{,}3} \\cdot 10^{-3} = ${formatDeTeX(connResults.F_ax_Rd_total_kN, 1)}\\,\\text{kN}`,
                    },
                    {
                      titel: 'Lochleibungsfestigkeit und Fließmoment',
                      erklaerung: 'Lochleibungsfestigkeit nach EC5 (Ansatz für vorgebohrte Hölzer), Fließmoment mit f_u,k = 400 N/mm².',
                      formel: `f_{h,k} = 0{,}082 \\cdot (1 - 0{,}01 \\cdot ${formatDeTeX(connD, 0)}) \\cdot ${formatDeTeX(connResults.rho_k, 0)} = ${formatDeTeX(connResults.f_h_k, 2)}\\,\\text{N/mm}^2;\\quad M_{y,Rk} = 0{,}3 \\cdot 400 \\cdot ${formatDeTeX(connD, 0)}^{2{,}6} = ${formatDeTeX(connResults.M_y_Rk, 0)}\\,\\text{Nmm}`,
                    },
                    {
                      titel: 'Schertragfähigkeit je Schraube',
                      erklaerung: `Kleinerer Wert aus Lochleibungsversagen und Fließgelenk-Mechanismus mit Seileffekt (${formatDeZahl(connResults.rope_effect, 0)} N).`,
                      formel: `F_{v,Rk} = \\min(${formatDeTeX(connResults.f_h_k * connLef * connD, 0)};\\; ${formatDeTeX(1.15 * Math.sqrt(2 * connResults.M_y_Rk * connResults.f_h_k * connD), 0)} + ${formatDeTeX(connResults.rope_effect, 0)}) = ${formatDeTeX((connResults.F_v_Rk_total_kN * 1000) / connCount, 0)}\\,\\text{N}`,
                    },
                    {
                      titel: 'Bemessungswerte und Ausnutzung',
                      erklaerung: `V_Ed = ${formatDeZahl(connForce, 1)} kN wird hier beiden Nachweisen gegenübergestellt.`,
                      formel: `F_{v,Rd} = \\frac{0{,}8 \\cdot ${formatDeTeX(connResults.F_v_Rk_total_kN, 2)}}{1{,}3} = ${formatDeTeX(connResults.F_v_Rd_total_kN, 1)}\\,\\text{kN};\\quad \\eta_v = ${formatDeTeX(connResults.utilShear, 1)}\\,\\%,\\; \\eta_{ax} = ${formatDeTeX(connResults.utilAxial, 1)}\\,\\%`,
                    },
                  ]}
                  ergebnisHinweis={`Ausnutzung Scherung ${formatDeZahl(connResults.utilShear, 1)} %, axial ${formatDeZahl(connResults.utilAxial, 1)} %`}
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'bauphysik' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_physics">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Fire Protection Box */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
              <h3 className="font-extrabold text-text-main text-base flex items-center gap-2 border-b border-home-grau/20 pb-2">
                <Flame size={18} className="text-amber-800 animate-pulse" /> Tragfähiger Brandschutz durch Verkohlung des Holzes
              </h3>
              
              <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
                <p>
                  Holz ist brennbar, brennt bei größeren Querschnitten aber mit annähernd konstanter Geschwindigkeit ab. Die entstehende Holzkohleschicht leitet Wärme schlecht und verzögert die Erwärmung des Restquerschnitts; unmittelbar hinter der Kohleschicht ist das Holz jedoch bereits erwärmt und geschwächt (berücksichtigt über d₀).
                </p>

                <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-200">
                  <h4 className="font-bold text-amber-900 mb-1">Standard-Abbrandraten nach DIN EN 1995-1-2:</h4>
                  <ul className="list-disc list-inside space-y-1 text-[11px] font-mono text-amber-950">
                    <li>Nadelholz (Vollholz / BSH): <InlineMath math="\beta_0 = 0{,}65;\; \beta_n = 0{,}80 \,/\, 0{,}70 \text{ mm/min}" /></li>
                    <li>Laubholz (<InlineMath math="\rho_k \ge 450" />): <InlineMath math="\beta_0 = 0{,}50;\; \beta_n = 0{,}55 \text{ mm/min}" /></li>
                    <li>Im Rechner wird β_n (inkl. Eckausrundung) verwendet; Brettsperrholz eindimensional mit β₀.</li>
                  </ul>
                </div>

                <div className="bg-off-white p-3 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-text-main block">Berechnung der ideellen Restquerschnitts-Tiefe d_ef:</span>
                  <div className="my-1 text-center font-mono font-bold text-text-main">
                    <InlineMath math="d_{ef} = \beta_n \cdot t + k_0 \cdot d_0" />
                  </div>
                  <span className="text-[10px] text-text-main/50 font-normal leading-normal block">
                    (mit <InlineMath math="d_0 = 7 \text{ mm}" /> als Schicht ohne Festigkeit, <InlineMath math="k_0 = \min(1;\, t/20)" /> bei ungeschützten Flächen; t = Branddauer in min).
                  </span>
                </div>
              </div>
            </div>

            {/* Acoustic Insulation Box */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
              <h3 className="font-extrabold text-text-main text-base flex items-center gap-2 border-b border-home-grau/20 pb-2">
                <Volume2 size={18} className="text-amber-800" /> Schallschutz, Entkopplung &amp; Schwingungen
              </h3>

              <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
                <p>
                  Aufgrund des geringen Eigengewichtes im Vergleich zum Stahlbetonbau ist der Schutz vor Schallübertragung die größte planerische Herausforderung im mehrgeschossigen Holzbau. 
                </p>

                <div className="bg-blue-50/50 p-3.5 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-1">Konstruktive Maßnahmen zur Trittschallminderung:</h4>
                  <p className="text-[11px] text-text-main/75 mt-1">
                    1. <strong>Masse-Zufuhr:</strong> Gebundene Splittschüttungen erhöhen die Masse der Decke; das mindert vor allem tieffrequenten Trittschall.
                  </p>
                  <p className="text-[11px] text-text-main/75 mt-1.5">
                    2. <strong>Akustische Entkopplung:</strong> Elastomerlager unter den Wandanschlüssen und Justierschwingen entkoppeln den Körperschall an Last-Umlagerungspunkten.
                  </p>
                </div>

                <div className="bg-off-white p-3 rounded-lg border border-home-grau/20">
                  <h4 className="font-black text-text-main text-xs mb-1">Gebrauchstauglichkeitsgrenzkriterium: Decken-Schwingung</h4>
                  <p className="text-text-main/75 leading-normal text-xs">
                    Eurocode 5 (7.3.3) verlangt für Wohnungsdecken einen Schwingungsnachweis: Das Verfahren gilt für Decken mit <InlineMath math="f_{1} > 8 \text{ Hz}" /> und begrenzt u. a. die Durchbiegung unter einer Einzellast von 1 kN (Grenzwert nach NA). Decken mit <InlineMath math="f_1 \le 8 \text{ Hz}" /> erfordern eine gesonderte Untersuchung.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* NEW INTERACTIVE: BRANDSCHUTZ- UND ABBRANDRECHNER */}
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
            <div>
              <span className="text-xs uppercase font-black text-rose-700 tracking-wider">Brandschutz &amp; Resttragfähigkeit</span>
              <h3 className="font-extrabold text-text-main text-base mt-1 flex items-center gap-2">
                <Flame size={20} className="text-rose-600 animate-pulse" /> Holz-Abbrandrechner &amp; Restquerschnitts-Visualisierer
              </h3>
              <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                Berechnen Sie den verbleibenden tragfähigen Holzquerschnitt im Brandfall nach Eurocode 5 (DIN EN 1995-1-2). Die poröse Kohleschicht (Pyrolysepfad) schützt das Kernholz vor Hitze, verringert aber den statisch wirksamen Querschnitt.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Params (span 5) */}
              <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4 bg-off-white p-4 rounded-xl border border-home-grau/20">
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-main">Brandschutz-Parameter</h4>

                {/* Fire wood type */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Materialtyp &amp; Abbrandrate</label>
                  <select aria-label="Materialtyp und Abbrandrate"
                    value={fireType}
                    onChange={(e) => setFireType(e.target.value)}
                    className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                  >
                    <option value="nadel">Nadel-Vollholz / KVH (β_n = 0,80 mm/min)</option>
                    <option value="bsh">Nadelholz-BSH (β_n = 0,70 mm/min)</option>
                    <option value="laub">Laubholz, ρ_k ≥ 450 kg/m³ (β_n = 0,55 mm/min)</option>
                    <option value="clt">Brettsperrholz (β₀ = 0,65 mm/min, Lehrannahme ohne Lagenabfall)</option>
                  </select>
                </div>

                {/* Exposure time & sides */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Brandbeanspruchung (min)</label>
                    <select aria-label="Brandbeanspruchung (min)"
                      value={fireTime}
                      onChange={(e) => setFireTime(parseInt(e.target.value) || 30)}
                      className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                    >
                      <option value={30}>t = 30 Min (REI 30)</option>
                      <option value={60}>t = 60 Min (REI 60)</option>
                      <option value={90}>t = 90 Min (REI 90)</option>
                      <option value={120}>t = 120 Min (REI 120)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-main">Brandseiten</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFireSides(3)}
                        type="button"
                        className={`flex-1 text-xs py-1.5 rounded-lg border font-bold transition-all ${
                          fireSides === 3
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-white text-text-main/50 border-home-grau/25'
                        }`}
                      >
                        3-seitig
                      </button>
                      <button
                        onClick={() => setFireSides(4)}
                        type="button"
                        className={`flex-1 text-xs py-1.5 rounded-lg border font-bold transition-all ${
                          fireSides === 4
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-white text-text-main/50 border-home-grau/25'
                        }`}
                      >
                        4-seitig
                      </button>
                    </div>
                  </div>
                </div>

                {/* Beam Dimensions */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Balkenbreite b (mm)</label>
                    <input aria-label="Balkenbreite b (mm)"
                      type="number" min="0"
                      value={fireB}
                      onChange={(e) => setFireB(Math.max(60, parseInt(e.target.value) || 60))}
                      className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-main">Balkenhöhe h (mm)</label>
                    <input aria-label="Balkenhöhe h (mm)"
                      type="number" min="0"
                      value={fireH}
                      onChange={(e) => setFireH(Math.max(60, parseInt(e.target.value) || 60))}
                      className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Outputs and 2D Restquerschnitt Illustration (span 7) */}
              <div className="lg:col-span-12 xl:col-span-7 bg-rose-50/10 border border-rose-200/40 p-5 rounded-xl flex flex-col justify-between gap-5">
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider block mb-1">Brandnachweis</span>
                  <p className="text-xs text-text-main/80 font-medium">
                    Nach <span className="font-bold">{formatDeWert(fireTime)} min</span> Brandeinwirkung mit <InlineMath math={`\\beta = ${formatDeTeXWert(fireResults.beta_0)}\\text{ mm/min}`} />:
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-2.5">
                    <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                      <span className="text-[9px] text-text-main/40 font-bold block uppercase">Verkohlte Schichttiefe d_ef</span>
                      <span className="font-mono text-base font-black text-rose-700">
                        {formatDeZahl(fireResults.d_ef, 1)} mm
                      </span>
                      <span className="text-[9px] text-text-main/50 block leading-tight mt-0.5">
                        ({formatDeZahl(fireResults.d_char0, 1)} mm Kohle + k₀ · 7 mm Zerrüttungsschicht, k₀ = min(1; t/20))
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                      <span className="text-[9px] text-text-main/40 font-bold block uppercase">Statischer Restquerschnitt</span>
                      {fireResults.isCollapsed ? (
                        <span className="font-mono text-sm font-black text-rose-600">KOMPLETT ZERSTÖRT</span>
                      ) : (
                        <span className="font-mono text-base font-black text-emerald-800">
                          {formatDeZahl(fireResults.b_fi, 0)} x {formatDeZahl(fireResults.h_fi, 0)} mm
                        </span>
                      )}
                      <span className="text-[9px] text-text-main/50 block leading-tight mt-0.5">
                        (Wirksam für Kaltbemessung nach EC5)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="text-xs bg-white p-2.5 rounded border border-home-grau/10 text-center">
                      <span className="text-text-main/50 font-semibold block text-[10px]">VERLUST QUERSCHNITTSFLÄCHE</span>
                      <span className="font-mono font-black text-rose-700 text-sm">{formatDeZahl(fireResults.areaLossPercent, 1)}%</span>
                    </div>
                    <div className="text-xs bg-white p-2.5 rounded border border-home-grau/10 text-center">
                      <span className="text-text-main/50 font-semibold block text-[10px]">VERLUST WIDERSTANDSMOMENT W</span>
                      <span className="font-mono font-black text-rose-700 text-sm">{formatDeZahl(fireResults.stiffnessLossPercent, 1)}%</span>
                    </div>
                  </div>
                </div>

                {/* 2D Charred section representation */}
                <div className="border border-home-grau/25 bg-white p-4 rounded-xl flex flex-col items-center justify-center gap-2">
                  <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider block">Querschnittsentwicklung (Grau: Vorher | Schwarz: Kohle | Orange: Tragfähig)</span>

                  <div className="relative w-44 h-28 border border-dashed border-stone-200 bg-stone-50 rounded flex items-center justify-center overflow-hidden">
                    {/* Charcoal/Burn block */}
                    <div className="absolute w-[90px] h-[65px] bg-stone-900/90 flex items-center justify-center rounded">
                      {/* Safe Inner timber */}
                      {!fireResults.isCollapsed ? (
                        <div 
                          className="bg-amber-600/90 border border-amber-300 flex items-center justify-center rounded text-[8px] text-white font-mono font-black text-center"
                          style={{
                            width: `${Math.max(5, 90 * (fireResults.b_fi / fireB))}px`,
                            height: `${Math.max(5, 65 * (fireResults.h_fi / fireH))}px`
                          }}
                        >
                          REST
                        </div>
                      ) : (
                        <span className="text-white text-[8px] font-black">X COLLAPSED</span>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-text-main/70 text-center leading-normal italic mt-1 max-w-sm">
                    {fireResults.stiffnessLossPercent < 50 ? (
                      <span className="text-emerald-800 font-bold">&bull; Restquerschnitt deutlich vorhanden – Nachweis mit k_mod,fi = 1,0 und γ_M,fi = 1,0 führen.</span>
                    ) : fireResults.isCollapsed ? (
                      <span className="text-rose-700 font-bold">&bull; Kein Restquerschnitt – Querschnitt für diese Branddauer unzureichend.</span>
                    ) : (
                      <span className="text-amber-700 font-bold">&bull; Starke Querschnittsminderung – Querschnitt vergrößern oder Bekleidung (Kapselung) vorsehen.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NEW INTERACTIVE: DECKEN-SCHWINGUNGSRECHNER (Vibration check) */}
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
            <div>
              <span className="text-xs uppercase font-black text-blue-700 tracking-wider">Akkustischer Komfort &amp; Tragsicherheit</span>
              <h3 className="font-extrabold text-text-main text-base mt-1 flex items-center gap-2">
                <Volume2 size={20} className="text-blue-600" /> CLT Decken-Schwingungs-Eigenfrequenzrechner
              </h3>
              <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                Leichte Holzdecken können durch Gehen spürbar angeregt werden. Der Rechner ermittelt die erste Eigenfrequenz eines Einfeldstreifens und vergleicht sie mit der Anwendungsgrenze von <InlineMath math="f_{1} > 8 \text{ Hz}" /> nach EC5 7.3.3. Vereinfachung: Biegesteifigkeit aus voller Plattendicke mit E = 11 000 N/mm² (Querlagen nicht abgemindert – Lehrannahme, liegt auf der unsicheren Seite).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Inputs (span 5) */}
              <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4 bg-off-white p-4 rounded-xl border border-home-grau/20">
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-main">Decken-Parameter</h4>

                {/* Span L */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-text-main">Deckenspannweite L (m)</label>
                    <span className="font-mono text-xs font-black text-blue-700">{formatDeZahl(vibSpan, 2)} m</span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="8.0"
                    step="0.1"
                    value={vibSpan}
                    onChange={(e) => setVibSpan(parseFloat(e.target.value))}
                    className="w-full accent-blue-700 cursor-pointer"
                  />
                </div>

                {/* CLT Thickness */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Brettsperrholz-Plattenstärke t (mm)</label>
                  <select aria-label="Brettsperrholz-Plattenstärke t (mm)"
                    value={vibCltThick}
                    onChange={(e) => setVibCltThick(parseInt(e.target.value) || 120)}
                    className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                  >
                    <option value={100}>t = 100 mm (3-lagig CLT)</option>
                    <option value={120}>t = 120 mm (5-lagig CLT standard)</option>
                    <option value={140}>t = 140 mm (5-lagig CLT)</option>
                    <option value={160}>t = 160 mm (5-lagig tragfähig)</option>
                    <option value={200}>t = 200 mm (7-lagig weitgespannt)</option>
                  </select>
                </div>

                {/* Extra Mass */}
                <div className="flex flex-col gap-1 border-t border-home-grau/10 pt-2.5">
                  <label className="text-xs font-bold text-text-main">Zusatzmasse (Estrich + Dämmung + Schüttung) (kg/m²)</label>
                  <input aria-label="Zusatzmasse (Estrich + Dämmung + Schüttung) (kg/m²)"
                    type="number"
                    min="10"
                    max="300"
                    value={vibExtraMass}
                    onChange={(e) => setVibExtraMass(Math.max(10, parseInt(e.target.value) || 10))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-bold"
                  />
                  <p className="text-[10px] text-stone-500 leading-snug">
                    *Tipp: Eine schwere Zementschüttung verbessert den Trittschall, reduziert jedoch die Schwingungs-Eigenfrequenz.
                  </p>
                </div>
              </div>

              {/* Outputs (span 7) */}
              <div className="lg:col-span-12 xl:col-span-7 bg-blue-50/20 border border-blue-200/50 p-5 rounded-xl flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block mb-1">Dynamische Eigenfrequenzermittlung</span>
                  <h4 className="font-extrabold text-sm text-text-main">Gebrauchstauglichkeitsnachweis EC5</h4>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-3 shadow-xs text-xs">
                  {/* Mass */}
                  <div className="flex justify-between items-center text-text-main/80">
                    <span>Auswertbare Decken-Eigenmasse g_0:</span>
                    <span className="font-mono font-bold text-text-main">{formatDeZahl(vibResults.cltSelfMass, 1)} kg/m²</span>
                  </div>
                  <div className="flex justify-between items-center text-text-main/80 border-b border-home-grau/10 pb-2">
                    <span>Gesamtmasse m_tot (inkl. Estrich):</span>
                    <span className="font-mono font-bold text-text-main">{formatDeZahl(vibResults.totalMass, 1)} kg/m²</span>
                  </div>

                  {/* Stiffness */}
                  <div className="space-y-1 pt-1 text-[11px] leading-relaxed">
                    <span className="font-bold text-text-main block">Biegesteifigkeit <InlineMath math="EI_L" /> (pro m Plattenbreite):</span>
                    <div className="bg-stone-50 p-1.5 rounded text-center border font-mono">
                      <InlineMath math={`EI_{L} = \\frac{11000 \\times 10^6 \\times 1{,}0 \\times ${formatDeTeXWert(vibCltThick / 1000)}^3}{12} = ${formatDeZahl(vibResults.ei_L / 1000, 0)}\\text{ kNm}^2/\\text{m}`} />
                    </div>
                  </div>

                  {/* Formula */}
                  <div className="space-y-1 pt-1 text-[11px] leading-relaxed">
                    <span className="font-bold text-text-main block">Grundfrequenz <InlineMath math="f_{1}" /> einer einfeldgelagerten BSP-Platte:</span>
                    <div className="bg-stone-50 p-1.5 rounded text-center border font-mono text-blue-900 font-bold text-xs">
                      <InlineMath math={`f_1 = \\frac{\\pi}{2 \\times L^2} \\times \\sqrt{\\frac{EI_{L}}{m}} = ${formatDeZahl(vibResults.freq_1, 2)}\\text{ Hz}`} />
                    </div>
                  </div>
                </div>

                {/* Status bar & gauge */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs text-center flex flex-col gap-1.5">
                  <span className="text-[10px] text-text-main/50 font-black uppercase tracking-wider block">Schwingungsnachweis (Kriterium &gt;= 8,0 Hz)</span>
                  <div className="flex items-center justify-center gap-3">
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full ${
                      vibResults.isCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {vibResults.isCompliant ? 'ERFÜLLT (Keine Komfortstörung)' : 'STÖRENDE RESONANZ (f1 < 8 Hz)'}
                    </span>
                    <span className="font-mono text-base font-black text-text-main">{formatDeZahl(vibResults.freq_1, 2)} Hz</span>
                  </div>
                  
                  {/* Indicator Warning */}
                  {!vibResults.isCompliant && (
                    <p className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-lg leading-relaxed mt-1">
                      <strong>Schwingungsgefahr:</strong> Die Frequenz liegt bei 8 Hz oder darunter; spürbare Schwingungen sind wahrscheinlich und eine gesonderte Untersuchung ist nötig. Plattendicke <InlineMath math="t" /> erhöhen oder Spannweite <InlineMath math="L" /> verringern.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'bemessung' && (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Knicknachweis einer Stütze C24 120/160 mm"
          zielGleichung="N_{Ed} \le k_c \cdot A \cdot f_{c,0,d}, \quad f_{c,0,d} = k_{mod} \cdot \frac{f_{c,0,k}}{\gamma_M}"
          normQuelle="DIN EN 1995-1-1 mit NA, 6.3.2 (Ersatzstabverfahren)"
          schritte={[
            { titel: '1. Gegeben', formel: 'b/h = 120/160\\,\\text{mm},\\; l_{ef} = 3{,}0\\,\\text{m},\\; N_{Ed} = 50\\,\\text{kN},\\; \\text{NKL 1, mittel: } k_{mod} = 0{,}8', erklaerung: 'Beidseitig gelenkig; Ausweichen um die schwache Achse.' },
            { titel: '2. Schlankheit', formel: 'i_z = \\frac{120}{\\sqrt{12}} = 34{,}6\\,\\text{mm};\\; \\lambda_z = \\frac{3000}{34{,}6} = 86{,}6', erklaerung: 'Maßgebend ist der kleinere Trägheitsradius.' },
            { titel: '3. Bezogene Schlankheit', formel: '\\lambda_{rel} = \\frac{\\lambda}{\\pi}\\sqrt{\\frac{f_{c,0,k}}{E_{0{,}05}}} = \\frac{86{,}6}{\\pi}\\sqrt{\\frac{21}{7400}} = 1{,}47', erklaerung: 'E_0,05 = 7400 N/mm² für C24.' },
            { titel: '4. Knickbeiwert', formel: 'k = 0{,}5\\,[1 + 0{,}2\\,(1{,}47 - 0{,}3) + 1{,}47^2] = 1{,}70;\\; k_c = \\frac{1}{1{,}70 + \\sqrt{1{,}70^2 - 1{,}47^2}} = 0{,}39', erklaerung: 'β_c = 0,2 für Vollholz.' },
            { titel: '5. Nachweis', formel: 'N_{Rd} = 0{,}39 \\cdot 19\\,200 \\cdot \\frac{0{,}8 \\cdot 21}{1{,}3} \\approx 97{,}6\\,\\text{kN} \\ge 50\\,\\text{kN}', erklaerung: 'Ausnutzung rund 51 %.' },
          ]}
          ergebnisHinweis="Die Stütze ist ausreichend; ohne Knicken (k_c = 1) läge die Tragfähigkeit bei rund 248 kN – durch die Schlankheit sinkt sie auf rund 40 %."
        />
      </div>
      )}

      <ModulTest moduleId="holzbau" />

      {/* COMPONENT FOOTER */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Holzbau', url: 'https://de.wikipedia.org/wiki/Holzbau' },
          { title: 'Brettsperrholz', url: 'https://de.wikipedia.org/wiki/Brettsperrholz' },
          { title: 'Brettschichtholz', url: 'https://de.wikipedia.org/wiki/Brettschichtholz' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1995-1-1:2010-12 + A2:2014-07 mit DIN EN 1995-1-1/NA:2013-08 (Eurocode 5, Teil 1-1)' },
          { title: 'DIN EN 1995-1-2:2010-12 mit NA (Eurocode 5, Teil 1-2: Brandfall)' },
          { title: 'DIN EN 338:2016-07 (Festigkeitsklassen Bauholz) und DIN EN 14080:2013-09 (Brettschichtholz)' },
          { title: 'Muster-Holzbaurichtlinie (MHolzBauRL), Fassung September 2024 (MVV TB 2025/1, lfd. Nr. A 2.2.1.4); Landesfassung gemäß jeweiliger VV TB' },
          { title: 'DIN EN 16351:2025-07 (Brettsperrholz – Anforderungen)' }
        ]}
        literatur={[
          'Informationsverein Holz (Hrsg.): holzbau handbuch, Reihen 1–5 (einzelne Hefte)',
          'Blaß, H. J.; Sandhaas, C.: Ingenieurholzbau – Grundlagen der Bemessung. Karlsruhe: KIT Scientific Publishing 2016',
          'Kaufmann, H.; Krötsch, S.; Winter, S.: Atlas Mehrgeschossiger Holzbau. München: Detail 2017',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        weblinks={[
          { title: 'dataholz.eu – Bauteilkatalog (Holzforschung Austria)', url: 'https://www.dataholz.eu' },
          { title: 'Informationsdienst Holz', url: 'https://informationsdienst-holz.de/' }
        ]}
        formeln={[
          {
            formel: 'f_1 = \\frac{\\pi}{2 \\cdot L^2} \\cdot \\sqrt{\\frac{(EI)_L}{m}} > 8\\,\\text{Hz}',
            erklaerung: 'Erste Eigenfrequenz eines gelenkig gelagerten Deckenstreifens; f₁ > 8 Hz ist Anwendungsgrenze des Nachweises nach EC5 7.3.3.',
            quelle: 'DIN EN 1995-1-1 Abs. 7.3'
          },
          {
            formel: 'd_{\\text{ef}} = d_{\\text{char,n}} + k_0 \\cdot d_0 = \\beta_n \\cdot t + k_0 \\cdot d_0',
            erklaerung: 'Ideelle Abbrandtiefe d_ef der Methode mit reduziertem Querschnitt (β_n = 0,8 Vollholz / 0,7 BSH, d₀ = 7 mm, k₀ = 1 ab 20 min).',
            quelle: 'DIN EN 1995-1-2'
          }
        ]}
      />

    </div>
  );
}
