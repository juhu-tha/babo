import { useState, useMemo } from 'react';
import { Trees } from 'lucide-react';
import { abbrandQuerschnitt, bemesseDruckstab, bemesseQuerdruck, holzschraube, type AbbrandArt, type KLED, type Nutzungsklasse, type Querdruckfall } from '@/src/calc/holzbau';
import { bspSchwingung, BSP_AUFBAUTEN, type EiVerfahren, type Estrichart } from '@/src/calc/bspSchwingung';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { woodMaterials, dataholzConstructions } from './holzbaubeta/daten';
import { HOLZ_EN338, holzKennwerte } from '@/src/data/kennwerte';
import HolzbauInfo from './holzbaubeta/HolzbauInfo';
import HolzbauWerkstoffe from './holzbaubeta/HolzbauWerkstoffe';
import HolzbauKonstruktion from './holzbaubeta/HolzbauKonstruktion';
import HolzbauBemessung from './holzbaubeta/HolzbauBemessung';
import HolzbauVerbindung from './holzbaubeta/HolzbauVerbindung';
import HolzbauBauphysik from './holzbaubeta/HolzbauBauphysik';
import inhalt from '@/content/holzbaubeta/HolzbauBeta.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
  const shrinkageCoeffs: Record<string, { radial: number; tangential: number; longitudinal: number; label: string }> = inhalt.daten["HolzbauBeta.shrinkageCoeffs"];

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
  const [vibAufbau, setVibAufbau] = useState<string>('l5_150'); // Lagenaufbau (BSP_AUFBAUTEN)
  const [vibExtraMass, setVibExtraMass] = useState<number>(100); // kg/m² additional loads
  const [vibBreite, setVibBreite] = useState<number>(5.0); // Deckenbreite b_D in m
  const [vibEstrichDicke, setVibEstrichDicke] = useState<number>(0); // mm, 0 = Estrichsteifigkeit nicht ansetzen
  const [vibEstrichArt, setVibEstrichArt] = useState<Estrichart>('zement');
  const [vibVerfahren, setVibVerfahren] = useState<EiVerfahren>('gamma');

  // Derived Materials values
  const currentMaterial = useMemo(() => {
    return woodMaterials.find(m => m.class === woodClass) || woodMaterials[0];
  }, [woodClass]);

  // Derived calculations for added modules
  const qpResults = useMemo(() => {
    return bemesseQuerdruck({
      F: qpForce, b: qpB, l: qpL, fall: qpConfig as Querdruckfall, ueberstand: qpOverhang, fc90k: holzKennwerte(woodClass)?.fc90k ?? HOLZ_EN338.C24.fc90k, // DIN EN 338:2016 / EN 14080 (zentral)
      art: woodClass.startsWith('GL') ? 'bsh' : woodClass.startsWith('C') ? 'nadelvollholz' : 'laubholz',
      nkl: serviceClass as Nutzungsklasse, kled: loadDuration as KLED,
    });
  }, [woodClass, serviceClass, loadDuration, qpForce, qpB, qpL, qpConfig, qpOverhang]);

  // Holzschrauben nach DIN EN 1995-1-1, 8.7 (Rechenkern src/calc/holzbau.ts): Herausziehen (8.38)–(8.41), Abscheren (8.2.2)
  const connResults = useMemo(() => {
    const material = woodMaterials.find(m => m.class === connWoodClass) || woodMaterials[0];
    const r = holzschraube({ rhok: material.rho_k, d: connD, lef: connLef, alpha: connAngle, n: connCount, nkl: connServiceClass, kled: connLoadDuration });
    const utilAxial = r.F_ax_Rd_total_kN > 0 ? (connForce / r.F_ax_Rd_total_kN) * 100 : 0;
    const utilShear = r.F_v_Rd_total_kN > 0 ? (connForce / r.F_v_Rd_total_kN) * 100 : 0;
    return { ...r, utilAxial, utilShear, isAxialUnsafe: utilAxial > 100, isShearUnsafe: utilShear > 100 };
  }, [connWoodClass, connD, connLef, connAngle, connCount, connForce, connServiceClass, connLoadDuration]);

  // Abbrand mit reduziertem Querschnitt (Rechenkern src/calc/holzbau.ts, DIN EN 1995-1-2:2010-12, 4.2.2)
  const fireResults = useMemo(
    () => abbrandQuerschnitt(fireType as AbbrandArt, fireTime, fireB, fireH, fireSides === 4 ? 4 : 3),
    [fireTime, fireSides, fireB, fireH, fireType],
  );

  // Deckenschwingung Brettsperrholz (Rechenkern src/calc/bspSchwingung.ts)
  const vibResults = useMemo(() => bspSchwingung({
    spannweite: vibSpan, lagen: (BSP_AUFBAUTEN[vibAufbau] ?? BSP_AUFBAUTEN.l5_150).lagen, deckenbreite: vibBreite,
    zusatzmasse: vibExtraMass, estrichDicke: vibEstrichDicke, estrichArt: vibEstrichArt, verfahren: vibVerfahren,
  }), [vibSpan, vibAufbau, vibBreite, vibExtraMass, vibEstrichDicke, vibEstrichArt, vibVerfahren]);

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
              <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight"><MdText text={inhalt.texte.holzbauIngenieurholzbau} /></h2>
              <p className="text-xs text-text-main/60 font-semibold uppercase tracking-wider"><MdText text={inhalt.texte.referenzhandbuchTragwerksnachweiseNachEu} /></p>
            </div>
          </div>
          
          <div className="bg-slate-100 text-slate-800 border border-slate-200 py-1 px-3 rounded-full text-xs font-bold leading-none self-start md:self-auto shadow-xs"><MdText text={inhalt.texte.refInformationsdienstHolzDe} /></div>
        </div>

        <p className="text-sm text-text-main/75 max-w-4xl leading-relaxed"><MdText text={inhalt.texte.dasModulFasstKennwerte} /></p>
      </div>

      {/* RENDER DYNAMIC SUB-TABS BASED ON MAIN MENU SWITCH */}
      {activeSubTab === 'info' && <HolzbauInfo infoView={infoView} setInfoView={setInfoView} />}

      {activeSubTab === 'werkstoffe' && <HolzbauWerkstoffe activeConstruction={activeConstruction} dbSearch={dbSearch} dbTypeFilter={dbTypeFilter} filteredConstructions={filteredConstructions} selectedConst={selectedConst} setDbSearch={setDbSearch} setDbTypeFilter={setDbTypeFilter} setSelectedConst={setSelectedConst} setShreB={setShreB} setShreBDir={setShreBDir} setShreH={setShreH} setShreHDir={setShreHDir} setShreUEnd={setShreUEnd} setShreUStart={setShreUStart} setShreWoodType={setShreWoodType} shreB={shreB} shreBDir={shreBDir} shreH={shreH} shreHDir={shreHDir} shreUEnd={shreUEnd} shreUStart={shreUStart} shreWoodType={shreWoodType} shrinkResults={shrinkResults} />}

      {activeSubTab === 'konstruktion' && <HolzbauKonstruktion />}

      {activeSubTab === 'bemessung' && <HolzbauBemessung calculationResults={calculationResults} colB={colB} colH={colH} colLen={colLen} currentMaterial={currentMaterial} designLoad={designLoad} eulerCase={eulerCase} loadDuration={loadDuration} qpB={qpB} qpConfig={qpConfig} qpForce={qpForce} qpL={qpL} qpOverhang={qpOverhang} qpResults={qpResults} serviceClass={serviceClass} setColB={setColB} setColH={setColH} setColLen={setColLen} setDesignLoad={setDesignLoad} setEulerCase={setEulerCase} setLoadDuration={setLoadDuration} setQpB={setQpB} setQpConfig={setQpConfig} setQpForce={setQpForce} setQpL={setQpL} setQpOverhang={setQpOverhang} setServiceClass={setServiceClass} setWoodClass={setWoodClass} woodClass={woodClass} />}

      {activeSubTab === 'verbindung' && <HolzbauVerbindung connAngle={connAngle} connCount={connCount} connD={connD} connForce={connForce} connLef={connLef} connLoadDuration={connLoadDuration} connResults={connResults} connServiceClass={connServiceClass} connWoodClass={connWoodClass} setConnAngle={setConnAngle} setConnCount={setConnCount} setConnD={setConnD} setConnForce={setConnForce} setConnLef={setConnLef} setConnLoadDuration={setConnLoadDuration} setConnServiceClass={setConnServiceClass} setConnWoodClass={setConnWoodClass} />}

      {activeSubTab === 'bauphysik' && <HolzbauBauphysik fireB={fireB} fireH={fireH} fireResults={fireResults} fireSides={fireSides} fireTime={fireTime} fireType={fireType} setFireB={setFireB} setFireH={setFireH} setFireSides={setFireSides} setFireTime={setFireTime} setFireType={setFireType} vib={{ aufbau: vibAufbau, setAufbau: setVibAufbau, span: vibSpan, setSpan: setVibSpan, extraMass: vibExtraMass, setExtraMass: setVibExtraMass, breite: vibBreite, setBreite: setVibBreite, estrichDicke: vibEstrichDicke, setEstrichDicke: setVibEstrichDicke, estrichArt: vibEstrichArt, setEstrichArt: setVibEstrichArt, verfahren: vibVerfahren, setVerfahren: setVibVerfahren, ergebnis: vibResults }} />}

      {activeSubTab === 'bemessung' && (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielKnicknachweisEinerStüt}
          zielGleichung="N_{Ed} \le k_c \cdot A \cdot f_{c,0,d}, \quad f_{c,0,d} = k_{mod} \cdot \frac{f_{c,0,k}}{\gamma_M}"
          normQuelle={inhalt.werte.dinEn19951}
          schritte={inhalt.daten["HolzbauBeta.schritte"]}
          ergebnisHinweis={inhalt.werte.dieStützeIstAusreichend}
        />
      </div>
      )}

      <Querverweis ziel="normen_ausblick" titel={inhalt.werte.neueEurocodeGenerationErschienen} linkText={inhalt.werte.zumModulAusblickNeue}>
        <p><MdText text={inhalt.texte.maßgebendBleibenDieBauaufsichtlich} /></p>
      </Querverweis>

      <ModulTest moduleId="holzbau" />

      {/* COMPONENT FOOTER */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Holzbau', url: 'https://de.wikipedia.org/wiki/Holzbau' },
          { title: 'Brettsperrholz', url: 'https://de.wikipedia.org/wiki/Brettsperrholz' },
          { title: 'Brettschichtholz', url: 'https://de.wikipedia.org/wiki/Brettschichtholz' }
        ]}
        regelwerke={inhalt.daten["HolzbauBeta.regelwerke"]}
        literatur={inhalt.daten["HolzbauBeta.literatur"]}
        weblinks={inhalt.daten["HolzbauBeta.weblinks"]}
        formeln={inhalt.daten["HolzbauBeta.formeln"]}
      />

    </div>
  );
}
