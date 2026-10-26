import React, { useState, useMemo } from 'react';
import { 
  Building2, Monitor, Calculator, Compass, Info, AlertTriangle, 
  Settings, LayoutGrid
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import inhalt from '@/content/bauwerkserfassung/Bauwerkserfassung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

type ErfassungReiter = 'grundlagen' | 'methoden' | 'leica_workflow' | 'tragwerksplanung';
const REITER: readonly ModulTab<ErfassungReiter>[] = [
  { id: 'grundlagen', label: inhalt.texte.grundlagenGenauigkeitsstufen.trim(), icon: Building2 },
  { id: 'methoden', label: inhalt.texte.messverfahrenImVergleich.trim(), icon: Compass },
  { id: 'leica_workflow', label: inhalt.texte.leicaPunktwolkenWorkflow.trim(), icon: Monitor },
  { id: 'tragwerksplanung', label: inhalt.texte.bimStatikRevitRstab.trim(), icon: Calculator },
];

export default function Bauwerkserfassung() {
  const [activeSubTab, setActiveSubTab] = useState<ErfassungReiter>('grundlagen');

  // Tab 1: Genauigkeitsstufe Selector
  const [selectedStufe, setSelectedStufe] = useState<number>(3); // Default level III (Denkmalpflege)

  // Tab 4: Dachstuhl Statik-Rechner (Timber Rafter with initial deformation e_0)
  const [rafterWidth, setRafterWidth] = useState<number>(100); // b in mm
  const [rafterHeight, setRafterHeight] = useState<number>(140); // h in mm
  const [spanLength, setSpanLength] = useState<number>(4000); // L in mm
  const [axialForce, setAxialForce] = useState<number>(15); // N_d in kN
  const [bendingLoad, setBendingLoad] = useState<number>(2.0); // q_d in kN/m
  const [initialDeformation, setInitialDeformation] = useState<number>(45); // e_0 in mm (visualized deflection)
  const [woodClass, setWoodClass] = useState<'C16' | 'C24' | 'C30' | 'D30'>('C24');

  // Wood parameters according to DIN EN 1995 (Eurocode 5)
  // Design strength values (f_m_d = f_m_k * k_mod / gamma_M)
  // Assuming k_mod = 0.9 (short-term load like snow), gamma_M = 1.3 (solid wood)
  const woodParams = useMemo(() => {
    const f_m_k = woodClass === 'C16' ? 16 : (woodClass === 'C24' ? 24 : (woodClass === 'C30' ? 30 : 30));
    const f_c_0_k = woodClass === 'C16' ? 17 : (woodClass === 'C24' ? 21 : (woodClass === 'C30' ? 23 : 23));
    const E_0_mean = woodClass === 'C16' ? 8000 : (woodClass === 'C24' ? 11000 : (woodClass === 'C30' ? 12000 : 12000));
    
    const k_mod = 0.9;
    const gamma_M = 1.3;
    
    return {
      f_m_d: (f_m_k * k_mod) / gamma_M, // Bending design stress
      f_c_0_d: (f_c_0_k * k_mod) / gamma_M, // Compression design stress
      E_0_mean
    };
  }, [woodClass]);

  // Combined compression + bending stress calculation including 2nd order theory approximation (verformungsabhängig)
  const staticsResults = useMemo(() => {
    const b = rafterWidth;
    const h = rafterHeight;
    const L = spanLength;
    const N_d = axialForce * 1000; // N
    const q_d = bendingLoad / 1000; // N/mm
    const e_0 = initialDeformation; // mm

    // Cross-section props
    const A = b * h; // mm^2
    const W = (b * Math.pow(h, 2)) / 6; // mm^3
    const I = (b * Math.pow(h, 3)) / 12; // mm^4

    // Primary stresses (idealized straight rafter)
    const M_q_d = (q_d * Math.pow(L, 2)) / 8; // Nmm (bending moment from transverse load)
    const sigma_m_d_primary = M_q_d / W; // N/mm^2 (primary bending stress)
    const sigma_c_d = N_d / A; // N/mm^2 (direct axial compression stress)

    // Secondary stresses due to measured deformation e_0 (1st order eccentricity)
    const M_e_d = N_d * e_0; // Nmm (eccentricity moment)
    const sigma_m_d_eccentric = M_e_d / W; // N/mm^2 (bending stress from eccentricity)

    // Euler buckling load (approximation for premium effect)
    const E = woodParams.E_0_mean;
    const N_crit = (Math.pow(Math.PI, 2) * E * I) / Math.pow(L, 2); // Euler Buckling Load in N
    
    // Magnification factor (1 / (1 - N_d / N_crit)) for second-order premium effect
    const alpha_crit = N_crit / N_d;
    const magFactor = alpha_crit > 1 ? alpha_crit / (alpha_crit - 1) : 1.5;

    // Total moment of combined bends (with premium second-order expansion)
    const M_total = (M_q_d + M_e_d) * magFactor;
    const sigma_m_d_total = M_total / W;

    // Design verification following Eurocode 5 (EC5) formula:
    // sigma_c_d / f_c_0_d + sigma_m_d_total / f_m_d <= 1.0 (approximative)
    const limitRatio = (sigma_c_d / woodParams.f_c_0_d) + (sigma_m_d_total / woodParams.f_m_d);
    
    // Idealized ratio ignoring measured deformation
    const limitRatioIdeal = (sigma_c_d / woodParams.f_c_0_d) + ((M_q_d * magFactor) / W / woodParams.f_m_d);

    return {
      A,
      W,
      I,
      sigma_c_d,
      sigma_m_d_primary,
      sigma_m_d_eccentric,
      sigma_m_d_total,
      N_crit_kN: N_crit / 1000,
      magFactor,
      limitRatio: limitRatio * 100, // as percentage
      limitRatioIdeal: limitRatioIdeal * 100, // as percentage
      unsafeRatioDelta: (limitRatio - limitRatioIdeal) * 100 // dangerous error gap
    };
  }, [rafterWidth, rafterHeight, spanLength, axialForce, bendingLoad, initialDeformation, woodParams]);

  return (
    <div className="flex flex-col gap-6 w-full text-slate-800 animate-fade-in">
      
      {/* --- Unified Header: Modern Cockpit Theme --- */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Building2 size={20} className="text-shiraz" /><MdText text={inhalt.texte.bauwerkserfassungAufmaßtechniken} /></h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.methodenZurGeometrischenUnd} /></p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2 border-t border-home-grau/20">
          <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded w-fit font-medium font-sans">
            <Info size={12} />
            <span><MdText text={inhalt.texte.hinweisGiltFürDie} /></span>
          </div>
          <div className="bg-slate-50 border border-home-grau/30 px-4 py-2.5 rounded-lg text-xs font-mono text-slate-600 flex gap-4 items-center shrink-0">
            <span><MdText text={inhalt.texte.toleranzDin18202Din} /></span>
            <span><MdText text={inhalt.texte.leitfadenDenkmalpflegeRichtlinien} /></span>
          </div>
        </div>
      </div>

      <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeSubTab} onWechsel={setActiveSubTab} className="flex flex-col gap-6 [&>[role=tablist]]:bg-white [&>[role=tablist]]:p-1 [&>[role=tablist]]:rounded-xl [&>[role=tablist]]:shadow-sm [&>[role=tablist]]:border [&>[role=tablist]]:border-home-grau/30">

      {/* --- Tab 1: Grundlagen & Genauigkeitsstufen --- */}
      {activeSubTab === 'grundlagen' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <Building2 className="text-shiraz" size={20} /><MdText text={inhalt.texte.warumVerformungsgerechtesAufmaß} /></h2>
            <p className="text-slate-600 text-xs leading-relaxed max-w-4xl mb-6 font-sans"><MdText text={inhalt.texte.imNeubauWirdVon} /></p>

            {/* Interactive Level Explorer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {inhalt.daten.Bauwerkserfassung.map((stufe) => (
                <button
                  key={stufe.level}
                  type="button"
                  onClick={() => setSelectedStufe(stufe.level)}
                  className={`p-4 rounded-xl text-left border flex flex-col justify-between transition-all ${
                    selectedStufe === stufe.level
                      ? 'border-shiraz bg-shiraz/5 text-slate-900 shadow-md ring-2 ring-shiraz/20'
                      : 'border-home-grau/30 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border ${
                      selectedStufe === stufe.level ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-200 text-slate-600 border-home-grau/30'
                    }`}>
                      Stufe {formatDeWert(stufe.level)}
                    </span>
                    <h4 className="font-extrabold text-xs mt-3 text-slate-900">{stufe.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-1.5">
                      Toleranz: <strong className={selectedStufe === stufe.level ? 'text-shiraz' : 'text-slate-700'}>{stufe.tol}</strong>
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      Maßstab: {stufe.scale}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-home-grau/30 text-xs leading-relaxed text-slate-600 font-sans">
                    {stufe.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Visual Detail Panel based on selected Genauigkeitsstufe */}
            <div className="bg-slate-50/40 p-5 rounded-xl border border-home-grau/30 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <span className="font-sans w-2 h-2 rounded-full bg-shiraz inline-block"></span><MdText text={inhalt.texte.metrologischeDetailsZuStufe} />{formatDeWert(selectedStufe)}
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 pl-4 list-disc font-sans">
                  {selectedStufe === 1 && (
                    <>
                      <li><MdText text={inhalt.texte.genauigkeitseignungAusreichendFürMachbar} /></li>
                      <li><MdText text={inhalt.texte.typischeHandgeräteRollbandmaßGliedermaßs} /></li>
                      <li><MdText text={inhalt.texte.kritikpunkUnsicherBeiKomplexer} /></li>
                    </>
                  )}
                  {selectedStufe === 2 && (
                    <>
                      <li><MdText text={inhalt.texte.genauigkeitseignungStandardImUmbau} /></li>
                      <li><MdText text={inhalt.texte.gerätespektrumLaserEntfernungsmesserMit} /></li>
                      <li><MdText text={inhalt.texte.einsatzgrenzeDachstühleMitKrummem} /></li>
                    </>
                  )}
                  {selectedStufe === 3 && (
                    <>
                      <li><MdText text={inhalt.texte.genauigkeitseignungVonDenLandesdenkmaläm} /></li>
                      <li><MdText text={inhalt.texte.gerätespektrumTachymeterTotalstationZur} /></li>
                      <li><MdText text={inhalt.texte.besonderheitVerbiegungenUndKrumme} /></li>
                    </>
                  )}
                  {selectedStufe === 4 && (
                    <>
                      <li><MdText text={inhalt.texte.genauigkeitseignungPremiumAnalyseFür} /></li>
                      <li><MdText text={inhalt.texte.gerätespektrumTerrestrischeLaserscanSyst} /></li>
                      <li><MdText text={inhalt.texte.vorteilSchafftEineLückenlose} /></li>
                    </>
                  )}
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-home-grau/30 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono"><MdText text={inhalt.texte.messtechnischeVisualisierung} /></span>
                <div className="border border-home-grau/30 rounded bg-slate-50 p-3 text-xs font-mono text-slate-500">
                  <div className="flex justify-between border-b border-home-grau/30 pb-1.5 mb-1.5">
                    <span>Protokollierungsart:</span>
                    <span className="font-bold text-slate-800">
                      {selectedStufe <= 2 ? inhalt.werte.idealisiertOrthogonal : inhalt.werte.realitätsnahToleranzgerecht}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-home-grau/30 pb-1.5 mb-1.5">
                    <span><MdText text={inhalt.texte.vergleichAusführungstoleranzDin18202} /></span>
                    <span className="font-bold text-slate-800">
                      {selectedStufe === 1 && inhalt.werte.nANichtNachprüfbar}
                      {selectedStufe === 2 && inhalt.werte.grenzeSpalte516mm}
                      {selectedStufe === 3 && inhalt.werte.grenzeSpalte66mm}
                      {selectedStufe === 4 && inhalt.werte.hochpräziseSpezialtoleranz2mm}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500 font-sans mt-2">
                    {selectedStufe >= 3 ? inhalt.werte.durchDieVerortungDeformierter : inhalt.werte.achtungVerformungenVonBauteilen}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 2: Vergleich der Messverfahren --- */}
      {activeSubTab === 'methoden' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <Compass className="text-shiraz" size={20} /><MdText text={inhalt.texte.vorUndNachteileModerner} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieAuswahlDesOptimalen} /></p>
        </div>

        <div className="overflow-x-auto border border-home-grau/30 rounded-xl">
              <table className="min-w-full text-xs text-left bg-white font-sans">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-home-grau/30">
                  <tr>
                    <th className="p-3">Verfahren</th>
                    <th className="p-3"><MdText text={inhalt.texte.typischeGenauigkeit} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.geschwindigkeitVorOrt} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.aufarbeitungBüro} /></th>
                    <th className="p-3">Vorteile</th>
                    <th className="p-3">Herausforderungen/Nachteile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inhalt.daten.Bauwerkserfassung_2.map((item, idx) => (
                    <tr key={idx} className={`${item.bg} hover:bg-slate-50`}>
                      <td className="p-3 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3 font-mono text-indigo-700 font-bold">{item.tol}</td>
                      <td className="p-3">{item.speed}</td>
                      <td className="p-3 text-slate-600">{item.work}</td>
                      <td className="p-3 text-emerald-800 bg-emerald-50/20">{item.pros}</td>
                      <td className="p-3 text-amber-800 bg-amber-50/20">{item.cons}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 3: Leica BLK360 & Cyclone Registrierungs-Workflow --- */}
      {activeSubTab === 'leica_workflow' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <Monitor className="text-shiraz" size={20} /><MdText text={inhalt.texte.punktwolkenAufbereitungLeicaBlk360} /></h2>
            <p className="text-slate-600 text-xs leading-relaxed max-w-4xl mb-6 font-sans"><MdText text={inhalt.texte.umDatenAusEinem} /></p>

            {/* Step-by-Step Workflow Path */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {inhalt.daten.Bauwerkserfassung_3.map((w, idx) => (
                <div key={idx} className="bg-slate-50 border border-home-grau/30 rounded-xl p-4 relative hover:shadow-md transition-shadow">
                  <span className="text-3xl font-extrabold text-indigo-100 font-mono absolute top-2 right-4 leading-none">
                    {w.step}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-900 mt-2 font-sans flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-indigo-600 rounded inline-block"></span>
                    {w.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-600 mt-3 font-sans">
                    {w.detail}
          </p>
        </div>
              ))}
            </div>

            {/* Detailed Registration Insight Box */}
            <div className="bg-indigo-50/30 border border-indigo-150/60 rounded-xl p-5 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Settings size={14} /><MdText text={inhalt.texte.cloudToCloudC2c} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.inModernenErfassungenVerzichtet} /></p>
                <div className="space-y-2 text-xs text-slate-700 font-sans">
                  <div className="bg-white p-2.5 rounded border border-home-grau/30"><MdText text={inhalt.texte.überlappungskriteriumMindestens30Geometr} /></div>
                  <div className="bg-white p-2.5 rounded border border-home-grau/30"><MdText text={inhalt.texte.vorteilKeinZeitaufwendigesEinmessen} /></div>
                </div>
              </div>
              <div className="bg-white border border-home-grau/30 rounded-xl p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono"><MdText text={inhalt.texte.typischeExportformateFürCad} /></span>
                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between border-b pb-1.5 border-home-grau/30">
                    <strong className="text-slate-800 font-mono">.RCP / .RCS</strong>
                    <span className="text-slate-500 text-right"><MdText text={inhalt.texte.autodeskRecapPflichtFür} /></span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 border-home-grau/30">
                    <strong className="text-slate-800 font-mono">.LGS</strong>
                    <span className="text-slate-500 text-right"><MdText text={inhalt.texte.leicasUniversellesHochleistungPunktwolke} /></span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 border-home-grau/30">
                    <strong className="text-slate-800 font-mono">.E57</strong>
                    <span className="text-slate-500 text-right"><MdText text={inhalt.texte.herstellerneutralerAstmStandardHochkompa} /></span>
                  </div>
                  <div className="flex justify-between pb-1.5">
                    <strong className="text-slate-800 font-mono">.LAS / .LAZ</strong>
                    <span className="text-slate-500 text-right"><MdText text={inhalt.texte.standardFürGeländemodellePunktaufmaße} /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 4: BIM & Statik (Revit + RSTAB) --- */}
      {activeSubTab === 'tragwerksplanung' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <LayoutGrid className="text-shiraz" size={20} /><MdText text={inhalt.texte.datendurchgängigkeitVom3dScan} /></h2>
            <p className="text-slate-600 text-xs leading-relaxed max-w-4xl mb-6 font-sans"><MdText text={inhalt.texte.ausDerRegistriertenPunktwolke} /></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Revit Modeling Step */}
              <div className="bg-slate-50 border border-home-grau/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
                  <Monitor size={14} /><MdText text={inhalt.texte.t1BimModellierungIn} /></h3>
                <ul className="space-y-3 text-xs text-slate-600 pl-4 list-disc font-sans">
                  <li><MdText text={inhalt.texte.punktwolkenVerlinkungDieRcp} /></li>
                  <li><MdText text={inhalt.texte.schnittführungRevitErmöglichtEs} /></li>
                  <li><MdText text={inhalt.texte.modellierungsregelnModellierungVerformte} /></li>
                </ul>
              </div>

              {/* RSTAB Modeling Step */}
              <div className="bg-slate-50 border border-home-grau/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
                  <Calculator size={14} /><MdText text={inhalt.texte.t2StatischeErfassungIn} /></h3>
                <ul className="space-y-3 text-xs text-slate-600 pl-4 list-disc font-sans">
                  <li><MdText text={inhalt.texte.systemachsenexzentrizitätenInRstabWird} /></li>
                  <li><MdText text={inhalt.texte.theorieIiOrdnungBei} /></li>
                  <li><MdText text={inhalt.texte.nachweiseSpannungsUndStabilitätsnachweis} /></li>
                </ul>
              </div>
            </div>

            {/* --- CORE INTERACTIVE EC5 STATICS CALCULATOR --- */}
            <div className="border border-amber-200 bg-amber-50/15 rounded-xl p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1 rounded bg-amber-200/50 text-amber-800">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 font-sans"><MdText text={inhalt.texte.eurocode5HolzDachstuhlnachweis} /></h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5"><MdText text={inhalt.texte.sehenSieLiveWie} /></p>
        </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Inputs area */}
                <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-home-grau/30 space-y-4 text-xs font-sans">
                  <div className="border-b pb-2 mb-2 font-bold text-slate-800 uppercase text-xs tracking-wider text-indigo-900"><MdText text={inhalt.texte.tragwerkEinwirkungEurocode5} /></div>
                  
                  {/* Wood Selection */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1"><MdText text={inhalt.texte.holzkennwertklasseNh} /></label>
                    <select aria-label={inhalt.werte.holzkennwertklasseNh}
                      className="w-full bg-slate-50 border border-home-grau/30 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                      value={woodClass}
                      onChange={(e) => setWoodClass(e.target.value as typeof woodClass)}
                    >
                      <option value="C16">C16 (Standard-Nadelholz, f_m_k=16 MPa)</option>
                      <option value="C24">C24 (Konstruktionsvollholz, f_m_k=24 MPa)</option>
                      <option value="C30">C30 (Hochwertiges Vollholz, f_m_k=30 MPa)</option>
                      <option value="D30">D30 (Hartholz/Laubholz, f_m_k=30 MPa)</option>
                    </select>
                  </div>

                  {/* Geometric Input Dimensions */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5"><MdText text={inhalt.texte.breiteBMm} /></label>
                      <input aria-label={inhalt.werte.breiteBMm}
                        type="number" min="0"
                        className="w-full bg-slate-50 border border-home-grau/30 rounded p-1 font-mono font-bold text-right"
                        value={rafterWidth}
                        onChange={(e) => setRafterWidth(Math.max(40, parseInt(e.target.value) || 1))}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5"><MdText text={inhalt.texte.höheHMm} /></label>
                      <input aria-label="Höhe h (mm)"
                        type="number" min="0"
                        className="w-full bg-slate-50 border border-home-grau/30 rounded p-1 font-mono font-bold text-right"
                        value={rafterHeight}
                        onChange={(e) => setRafterHeight(Math.max(60, parseInt(e.target.value) || 1))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5"><MdText text={inhalt.texte.sparrenlängeLMm} /></label>
                    <input aria-label={inhalt.werte.sparrenlängeLMm}
                      type="number" min="0"
                      className="w-full bg-slate-50 border border-home-grau/30 rounded p-1 font-mono font-bold text-right"
                      value={spanLength}
                      onChange={(e) => setSpanLength(Math.max(1000, parseInt(e.target.value) || 1))}
                    />
                  </div>

                  {/* Forces Inputs */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-home-grau/30">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5 text-xs"><MdText text={inhalt.texte.axialdruckNDKn} /></label>
                      <input aria-label={inhalt.werte.axialdruckNDKn}
                        type="number" min="0"
                        className="w-full bg-slate-50 border border-home-grau/30 rounded p-1 font-mono font-bold text-right"
                        value={axialForce}
                        onChange={(e) => setAxialForce(Math.max(0, parseFloat(e.target.value) || 0))}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5 text-xs"><MdText text={inhalt.texte.biegelastQDKn} /></label>
                      <input aria-label={inhalt.werte.biegelastQDKn}
                        type="number" min="0"
                        step="0.1"
                        className="w-full bg-slate-50 border border-home-grau/30 rounded p-1 font-mono font-bold text-right"
                        value={bendingLoad}
                        onChange={(e) => setBendingLoad(Math.max(0, parseFloat(e.target.value) || 0))}
                      />
                    </div>
                  </div>

                  {/* INITIATOR e_0 DEFORMATION */}
                  <div className="pt-2 border-t border-home-grau/30">
                    <div className="flex justify-between font-semibold mb-1">
                      <span><MdText text={inhalt.texte.gemesseneVerformungE0} /></span>
                      <span className="text-shiraz font-mono font-bold">{formatDeWert(initialDeformation)} mm</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="120"
                      className="w-full accent-shiraz"
                      value={initialDeformation}
                      onChange={(e) => setInitialDeformation(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-slate-500 mt-0.5 leading-normal"><MdText text={inhalt.texte.dieserWertStehtFür} /></p>
                  </div>
                </div>

                {/* Outputs area */}
                <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between font-sans">
                  <div>
                    <div className="border-b pb-2 mb-3 font-bold text-slate-800 uppercase text-xs tracking-wider text-emerald-900"><MdText text={inhalt.texte.spannungsTragfähigkeitsnachweise} /></div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4 text-slate-600">
                      <div><MdText text={inhalt.texte.querschnittsflächeA} /><strong className="text-slate-800">{formatDeWert(staticsResults.A)} mm²</strong>
                      </div>
                      <div><MdText text={inhalt.texte.trägheitsmomentI} /><strong className="text-slate-800">{formatDeZahl(staticsResults.I / 10000, 1)} · 10⁴ mm⁴</strong>
                      </div>
                      <div><MdText text={inhalt.texte.spannungSigmaCD} /><strong className="text-slate-800">{formatDeZahl(staticsResults.sigma_c_d, 2)} N/mm²</strong>
                      </div>
                      <div><MdText text={inhalt.texte.sparrenAuslastungC24Ec5} /><strong className="text-slate-800">{formatDeZahl(woodParams.f_m_d, 1)} N/mm²</strong>
                      </div>
                    </div>

                    {/* Stress comparison bars */}
                    <div className="space-y-4 pt-1 mb-4">
                      {/* Idealized straight bar */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-600"><MdText text={inhalt.texte.statikNachIdealisiertemAufmaß} /></span>
                          <span className="font-mono text-emerald-700">{formatDeZahl(staticsResults.limitRatioIdeal, 1)} %</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, staticsResults.limitRatioIdeal)}%` }}
                          />
                        </div>
                      </div>

                      {/* Real deformed bar */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-900 font-bold"><MdText text={inhalt.texte.statikNachVerformungsgerechtemAufmaß} />{formatDeWert(initialDeformation)}mm)</span>
                          <span className={`font-mono font-bold ${staticsResults.limitRatio > 100 ? 'text-red-600' : 'text-amber-600'}`}>
                            {formatDeZahl(staticsResults.limitRatio, 1)} %
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              staticsResults.limitRatio > 100 ? 'bg-red-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, staticsResults.limitRatio)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stress delta message */}
                    <div className="p-3.5 rounded-lg border text-xs leading-normal">
                      {staticsResults.limitRatio > 100 ? (
                        <div className="text-red-800 border-red-200 bg-red-50 p-2 rounded"><MdText text={inhalt.texte.einsturzgefahrExzentrischDurchDen} />{formatDeZahl(staticsResults.sigma_m_d_eccentric, 2)}<MdText text={inhalt.texte.nMmÜberschreitetDas} /><strong>{formatDeZahl(staticsResults.limitRatio - 100, 1)} %</strong><MdText text={inhalt.texte.dieBerechnungMitIdealisierten} />{formatDeZahl(staticsResults.limitRatioIdeal, 1)}<MdText text={inhalt.texte.hätteEinVermeintlichSicheres} /></div>
                      ) : (
                        <div className="text-slate-700 border-indigo-100 bg-indigo-50/20 p-2 rounded"><MdText text={inhalt.texte.tragverhaltenStabilDasVerformte} />{formatDeZahl(staticsResults.limitRatio, 1)}<MdText text={inhalt.texte.dieAuslastungSteigtDurch} /><strong>{formatDeZahl(staticsResults.limitRatioIdeal, 1)} %</strong> auf <strong>{formatDeZahl(staticsResults.limitRatio, 1)} %</strong><MdText text={inhalt.texte.interaktionCDF} /></div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mt-4 leading-normal italic"><MdText text={inhalt.texte.berechnungsverfahrenNachDinEn} /></div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
      </ModuleTabs>

      {/* --- Module Footer --- */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1BiegeausnutzungEines}
        zielGleichung="\eta = \frac{\sigma_{m,d}}{f_{m,d}} = \frac{M_d / W}{k_{mod} \cdot f_{m,k} / \gamma_M}"
        schritte={inhalt.daten["Bauwerkserfassung.schritte"]}
        ergebnisHinweis={inhalt.werte.derTatsächlicheQuerschnittAus}
        normQuelle={inhalt.werte.dinEn19951}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2GemesseneVorverformung}
        zielGleichung="\left(\frac{\sigma_{c,0,d}}{f_{c,0,d}}\right)^2 + \frac{\sigma_{m,d}}{f_{m,d}} \le 1"
        schritte={inhalt.daten["Bauwerkserfassung.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dieGemesseneVerformungErhöht}
        normQuelle={inhalt.werte.dinEn199512}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bauwerkserfassung" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap8} 
        wikipedia={[
          { title: "Laserscanning", url: "https://de.wikipedia.org/wiki/Laserscanning" },
          { title: "Fotogrammetrie", url: "https://de.wikipedia.org/wiki/Fotogrammetrie" },
          { title: inhalt.werte.eurocode5Holzbau, url: "https://de.wikipedia.org/wiki/Eurocode_5" }
        ]}
        literatur={inhalt.daten["Bauwerkserfassung.literatur"]}
        regelwerke={inhalt.daten["Bauwerkserfassung.regelwerke"]}
        formeln={inhalt.daten["Bauwerkserfassung.formeln"]}
      />

    </div>
  );
}
