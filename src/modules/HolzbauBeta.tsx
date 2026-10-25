import { useState, useMemo } from 'react';
import { Trees } from 'lucide-react';
import { bemesseDruckstab, bemesseQuerdruck, KMOD, type KLED, type Nutzungsklasse, type Querdruckfall } from '@/src/calc/holzbau';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { woodMaterials, dataholzConstructions } from './holzbaubeta/daten';
import HolzbauInfo from './holzbaubeta/HolzbauInfo';
import HolzbauWerkstoffe from './holzbaubeta/HolzbauWerkstoffe';
import HolzbauKonstruktion from './holzbaubeta/HolzbauKonstruktion';
import HolzbauBemessung from './holzbaubeta/HolzbauBemessung';
import HolzbauVerbindung from './holzbaubeta/HolzbauVerbindung';
import HolzbauBauphysik from './holzbaubeta/HolzbauBauphysik';

interface SubTabProps {
  activeSubTab: string;
}

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
  const [connServiceClass, setConnServiceClass] = useState<Nutzungsklasse>(1); // NKL der Verbindung
  const [connLoadDuration, setConnLoadDuration] = useState<KLED>('mtl'); // KLED der maßgebenden Einwirkung

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

    // k_mod nach DIN EN 1995-1-1, Tab. 3.1 aus gewählter NKL und KLED der Verbindung
    const k_mod = KMOD[connServiceClass][connLoadDuration];
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
      k_mod,
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
  }, [connWoodClass, connD, connLef, connAngle, connCount, connForce, connServiceClass, connLoadDuration]);

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
      {activeSubTab === 'info' && <HolzbauInfo infoView={infoView} setInfoView={setInfoView} />}

      {activeSubTab === 'werkstoffe' && <HolzbauWerkstoffe activeConstruction={activeConstruction} dbSearch={dbSearch} dbTypeFilter={dbTypeFilter} filteredConstructions={filteredConstructions} selectedConst={selectedConst} setDbSearch={setDbSearch} setDbTypeFilter={setDbTypeFilter} setSelectedConst={setSelectedConst} setShreB={setShreB} setShreBDir={setShreBDir} setShreH={setShreH} setShreHDir={setShreHDir} setShreUEnd={setShreUEnd} setShreUStart={setShreUStart} setShreWoodType={setShreWoodType} shreB={shreB} shreBDir={shreBDir} shreH={shreH} shreHDir={shreHDir} shreUEnd={shreUEnd} shreUStart={shreUStart} shreWoodType={shreWoodType} shrinkResults={shrinkResults} />}

      {activeSubTab === 'konstruktion' && <HolzbauKonstruktion />}

      {activeSubTab === 'bemessung' && <HolzbauBemessung calculationResults={calculationResults} colB={colB} colH={colH} colLen={colLen} currentMaterial={currentMaterial} designLoad={designLoad} eulerCase={eulerCase} loadDuration={loadDuration} qpB={qpB} qpConfig={qpConfig} qpForce={qpForce} qpL={qpL} qpOverhang={qpOverhang} qpResults={qpResults} serviceClass={serviceClass} setColB={setColB} setColH={setColH} setColLen={setColLen} setDesignLoad={setDesignLoad} setEulerCase={setEulerCase} setLoadDuration={setLoadDuration} setQpB={setQpB} setQpConfig={setQpConfig} setQpForce={setQpForce} setQpL={setQpL} setQpOverhang={setQpOverhang} setServiceClass={setServiceClass} setWoodClass={setWoodClass} woodClass={woodClass} />}

      {activeSubTab === 'verbindung' && <HolzbauVerbindung connAngle={connAngle} connCount={connCount} connD={connD} connForce={connForce} connLef={connLef} connLoadDuration={connLoadDuration} connResults={connResults} connServiceClass={connServiceClass} connWoodClass={connWoodClass} setConnAngle={setConnAngle} setConnCount={setConnCount} setConnD={setConnD} setConnForce={setConnForce} setConnLef={setConnLef} setConnLoadDuration={setConnLoadDuration} setConnServiceClass={setConnServiceClass} setConnWoodClass={setConnWoodClass} />}

      {activeSubTab === 'bauphysik' && <HolzbauBauphysik fireB={fireB} fireH={fireH} fireResults={fireResults} fireSides={fireSides} fireTime={fireTime} fireType={fireType} setFireB={setFireB} setFireH={setFireH} setFireSides={setFireSides} setFireTime={setFireTime} setFireType={setFireType} setVibCltThick={setVibCltThick} setVibExtraMass={setVibExtraMass} setVibSpan={setVibSpan} vibCltThick={vibCltThick} vibExtraMass={vibExtraMass} vibResults={vibResults} vibSpan={vibSpan} />}

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
          { title: 'DIN EN 1995-1-1:2010-12 + A2:2014-07 mit DIN EN 1995-1-1/NA:2013-08 (Eurocode 5, Teil 1-1; bauaufsichtlich eingeführt); Neue Ausgabe 2026-09 erschienen; bauaufsichtlich noch nicht eingeführt' },
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
