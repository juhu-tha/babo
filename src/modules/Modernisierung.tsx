import React, { useState, useMemo } from 'react';
import { 
  RefreshCw, 
  Leaf, 
  Target, 
  Zap, 
  Layers, 
  Settings, 
  Calculator, 
  AlertTriangle, 
  Info, 
  Scale, 
  CheckCircle2, 
  FileText, 
  Coins 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert, formatDeTeX, formatDeTeXWert } from '@/src/utils/numberFormat';
import { GMODG_ANLAGE7, savings, dRequired, CO2_ERDGAS, type Bauteil, type FxBauteil } from '@/src/utils/bestandKern';
import inhalt from '@/content/modernisierung/Modernisierung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

type TabKey = 'begriffe' | 'nachruestpflichten' | 'bauphysik' | 'gebaeudetechnik' | 'isfp';

interface BuildingComponentLimit {
  id: string;
  name: string;
  limitU: number; // W/(m²K) – aus GMODG_ANLAGE7
  bauteil: Bauteil;
  /** nur bei Anlage-7-Sammelbauteilen mit unterschiedlichem F_x (Steildach / oberste Geschossdecke) */
  fxBauteil?: FxBauteil;
  typicalOldU: number;
  description: string;
}

const GMODG_COMPONENT_LIMITS: BuildingComponentLimit[] = [
  { 
    id: 'wall', 
    name: inhalt.werte.außenwandPutzWdvsBekleidung, 
    bauteil: 'aussenwand',
    limitU: GMODG_ANLAGE7.aussenwand, 
    typicalOldU: 1.40,
    description: inhalt.werte.außenwändeGegenAußenluftAnlage
  },
  { 
    id: 'roof_pitched', 
    name: inhalt.werte.steildachSystemgrenze, 
    bauteil: 'steildach_oGD',
    fxBauteil: 'steildach',
    limitU: GMODG_ANLAGE7.steildach_oGD, 
    typicalOldU: 1.20,
    description: inhalt.werte.steildächerGaubenFx
  },
  { 
    id: 'top_ceiling', 
    name: inhalt.werte.obersteGeschossdeckeUnbeheizterDachraum, 
    bauteil: 'steildach_oGD',
    fxBauteil: 'oberste_geschossdecke',
    limitU: GMODG_ANLAGE7.steildach_oGD, 
    typicalOldU: 1.20,
    description: inhalt.werte.obersteGeschossdeckenFx
  },
  { 
    id: 'roof_flat', 
    name: 'Flachdach', 
    bauteil: 'flachdach',
    limitU: GMODG_ANLAGE7.flachdach, 
    typicalOldU: 1.10,
    description: inhalt.werte.flachdächerGegenAußenluftInklusive
  },
  { 
    id: 'basement_ceiling', 
    name: inhalt.werte.kellerdeckeGegenUnbeheiztErdreich, 
    bauteil: 'kellerdecke_erdreich',
    limitU: GMODG_ANLAGE7.kellerdecke_erdreich, 
    typicalOldU: 1.50,
    description: inhalt.werte.deckenNachUntenGegen
  },
  { 
    id: 'windows', 
    name: inhalt.werte.fensterFenstertürenUw, 
    bauteil: 'fenster',
    limitU: GMODG_ANLAGE7.fenster, 
    typicalOldU: 2.80,
    description: inhalt.werte.vertikaleFensterImWohnungsbestand
  }
];

interface InsulationMaterial {
  name: string;
  wlg: number; // W/mK
  costPerM3: number; // Euro/m³
  co2Eq: number; // kg CO2-eq/m³
  ecoclass: string;
}

const INSULATION_MATERIALS: Record<string, InsulationMaterial> = inhalt.daten.INSULATION_MATERIALS;

const REITER: readonly ModulTab<TabKey>[] = [
  { id: 'begriffe', label: inhalt.texte.sanremoSystematikMerkhilfe.trim(), icon: Target },
  { id: 'nachruestpflichten', label: inhalt.texte.gmodgPflichtenGrenzwerte.trim(), icon: Scale },
  { id: 'bauphysik', label: inhalt.texte.uWertAmortisationsRechner.trim(), icon: Calculator },
  { id: 'gebaeudetechnik', label: inhalt.texte.heizungstechnikBioTreppe.trim(), icon: Leaf },
  { id: 'isfp', label: inhalt.texte.sanierungsfahrplanIsfp.trim(), icon: FileText },
];

export default function Modernisierung() {
  const [activeTab, setActiveTab] = useState<TabKey>('begriffe');

  // Simulator-State in Tab 3 (Bauphysik)
  const [selectedComponentId, setSelectedComponentId] = useState<string>('wall');
  const [selectedMaterialKey, setSelectedMaterialKey] = useState<string>('eps_032');
  const [originalU, setOriginalU] = useState<number>(1.40); // W/(m²K)
  const [thicknessMm, setThicknessMm] = useState<number>(140); // mm
  const [componentArea, setComponentArea] = useState<number>(160); // m²
  const [energyPriceKwh, setEnergyPriceKwh] = useState<number>(0.12); // €/kWh
  const [hgtVal, setHgtVal] = useState<number>(3500); // Kd/a (Gradtagzahl G_t20/15, standortabhängig)
  const [etaSys, setEtaSys] = useState<number>(0.9); // Anlagennutzungsgrad η_sys
  const [sowiesoAktiv, setSowiesoAktiv] = useState<boolean>(false); // Gerüst/Putz fällt ohnehin an (Kopplungsprinzip)

  const activeComponent = GMODG_COMPONENT_LIMITS.find(c => c.id === selectedComponentId) || GMODG_COMPONENT_LIMITS[0];
  const activeMaterial = INSULATION_MATERIALS[selectedMaterialKey] || INSULATION_MATERIALS.eps_032;

  // Bauphysikalische & ökonomische Berechnungen
  const simResults = useMemo(() => {
    const R_orig = 1 / Math.max(0.1, originalU);
    const d_m = thicknessMm / 1000;
    const R_ins = d_m / activeMaterial.wlg;
    const R_tot = R_orig + R_ins;
    const newU = 1 / R_tot;
    const deltaU = Math.max(0, originalU - newU);

    // Gesetzliche Konformität nach § 36 GModG (Anlage 7)
    const isCompliant = newU <= activeComponent.limitU + 1e-9;
    const dReqMm = isCompliant ? 0 : Math.ceil(dRequired(newU, activeComponent.limitU, activeMaterial.wlg) * 1000);

    // Investitionskosten Dämmstoff + Montageanteil (ca. 85 €/m² für Gerüst/Putz/Unterbau)
    const materialCost = (d_m * activeMaterial.costPerM3) * componentArea;
    const baseLaborCost = 85 * componentArea; // Montage, Gerüst, Armierung, Putz
    const totalInvestEuro = materialCost + baseLaborCost;

    // Einsparung mit Temperatur-Korrekturfaktor Fx (DIN V 4108-6) und Anlagenaufwand η_sys;
    // Amortisation auf energiebedingte Mehrkosten (ohne Sowieso-Kosten)
    const sav = savings({
      uOld: originalU, uNew: newU, A: componentArea, bauteil: activeComponent.bauteil, fxBauteil: activeComponent.fxBauteil, Gt: hgtVal,
      etaSys, price: energyPriceKwh, co2: CO2_ERDGAS, invest: totalInvestEuro,
      sowiesoKosten: sowiesoAktiv ? baseLaborCost : 0
    });
    const annualKwhSaved = sav.qEnd;
    const annualEuroSaved = sav.euro;
    const amortizationYears = Number.isFinite(sav.amortisation) ? sav.amortisation : 99;
    const annualCo2KgSaved = sav.co2kg;
    const fx = sav.fx;
    const mehrkosten = sav.mehrkosten;

    return {
      R_orig,
      R_ins,
      R_tot,
      newU,
      deltaU,
      isCompliant,
      annualKwhSaved,
      annualEuroSaved,
      totalInvestEuro,
      amortizationYears,
      annualCo2KgSaved,
      dReqMm, fx, mehrkosten,
      qNutz: sav.qNutz, materialCost, baseLaborCost
    };
  }, [originalU, thicknessMm, componentArea, activeMaterial, activeComponent, energyPriceKwh, hgtVal, etaSys, sowiesoAktiv]);

  const handleSelectComponent = (comp: BuildingComponentLimit) => {
    setSelectedComponentId(comp.id);
    setOriginalU(comp.typicalOldU);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-6 border-b border-home-grau/30 pb-6" id="modernisierung-header">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <RefreshCw className="text-shiraz" size={24} /><MdText text={inhalt.texte.modernisierungGebäudemodernisierungsgese} /></h2>
            <span className="text-xs font-mono bg-shiraz/10 text-shiraz border border-shiraz/25 px-3 py-1 rounded-full font-bold"><MdText text={inhalt.texte.rechtsstand29072026} /></span>
          </div>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
            <p><MdText text={inhalt.texte.wissenschaftlicheUndBaupraktischeGrundla} /></p>
          </div>

          {/* GModG Reform-Infobox */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-3">
            <Info className="text-amber-700 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1"><MdText text={inhalt.texte.kerninhalteDerGmodgNovelle} /><p className="leading-relaxed text-amber-900"><MdText text={inhalt.texte.t1EntfallDesStarren} /></p>
            </div>
          </div>
        </div>

        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6">

        {/* TAB 1: SANREMO-SYSTEMATIK & BEGRIFFE */}
        {activeTab === 'begriffe' && (
          <div className="space-y-6 animate-in fade-in duration-200" id="content-begriffe">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.dasAkronymSanremoSanierung} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-shiraz flex items-center gap-1.5 text-sm uppercase tracking-wider mb-2">
                    <Target size={18} /><MdText text={inhalt.texte.t1SanierungReparatur} /></h3>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.systematischeBeseitigungErheblicherBaute} /></p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-[11px] font-mono border text-slate-700"><MdText text={inhalt.texte.typischeMaßnahmenBetoninstandsetzungNach} /></div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-shiraz flex items-center gap-1.5 text-sm uppercase tracking-wider mb-2">
                    <RefreshCw size={18} /><MdText text={inhalt.texte.t2RenovierungSchönung} /></h3>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.optischeUndOberflächlicheErneuerung} /></p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-[11px] font-mono border text-slate-700"><MdText text={inhalt.texte.typischeMaßnahmenSchönheitsreparaturenNe} /></div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-shiraz flex items-center gap-1.5 text-sm uppercase tracking-wider mb-2">
                    <Layers size={18} /><MdText text={inhalt.texte.t3ModernisierungAufwertung} /></h3>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.baulicheMaßnahmenZurNachhaltigen} /></p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-[11px] font-mono border text-slate-700"><MdText text={inhalt.texte.typischeMaßnahmenFassadendämmungWdvs} /></div>
              </div>

            </div>

            {/* Steuerliche Abgrenzung nach EStG */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/25 space-y-3">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Coins size={16} className="text-shiraz" /><MdText text={inhalt.texte.steuerrechtlicheEinstufungErhaltungsaufw} /></h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80 leading-relaxed">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.erhaltungsaufwandSofortabzug} /></strong><MdText text={inhalt.texte.aufwendungenZurOrdnungsgemäßenInstandhal} /></div>
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
                  <strong className="text-amber-950 block mb-1"><MdText text={inhalt.texte.anschaffungsnaheHerstellungskosten6Abs} /></strong><MdText text={inhalt.texte.instandsetzungsUndModernisierungsmaßnahm} /></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GMODG NACHRÜST- & SANIERUNGSPFLICHTEN */}
        {activeTab === 'nachruestpflichten' && (
          <div className="space-y-6 animate-in fade-in duration-200" id="content-nachruestpflichten">
            
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
              <h3 className="font-bold text-text-main flex items-center gap-1.5 text-base">
                <Scale className="text-shiraz" size={20} /><MdText text={inhalt.texte.gesetzlicheNachrüstUndSanierungspflichte} /></h3>
              <p className="text-xs text-text-main/70 mt-1 leading-relaxed"><MdText text={inhalt.texte.dasGebäudemodernisierungsgesetzGmodgBis} /></p>
            </div>

            {/* Die 3 unbedingten Nachrüstpflichten */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-rose-50 text-shiraz flex items-center justify-center font-bold font-mono text-sm">1</span>
                    <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.dämmungObersteGeschossdecke35} /></h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4"><MdText text={inhalt.texte.begehbareSowieNichtBegehbare} /></p>
                </div>
                <div className="bg-slate-100 p-2.5 rounded text-[11px] font-mono border"><MdText text={inhalt.texte.grenzwert35GmodgU} /></div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-rose-50 text-shiraz flex items-center justify-center font-bold font-mono text-sm">2</span>
                    <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.dämmungWärmeführenderLeitungen69} /></h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4"><MdText text={inhalt.texte.ungedämmteZugänglicheHeizungsUnd} /></p>
                </div>
                <div className="bg-slate-100 p-2.5 rounded text-[11px] font-mono border"><MdText text={inhalt.texte.dämmschichtdickeBeiLambda0} /></div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-rose-50 text-shiraz flex items-center justify-center font-bold font-mono text-sm">3</span>
                    <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.rechtsstandHeizkesselBisher72} /></h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4"><MdText text={inhalt.texte.gestrichenWurdenDasBetriebsverbot} /></p>
                </div>
                <div className="bg-slate-100 p-2.5 rounded text-[11px] font-mono border"><MdText text={inhalt.texte.gmodgNeuregelungKeinPauschales} /></div>
              </div>

            </div>

            {/* Ausnahme für Selbstnutzer & Eigentümerwechsel */}
            <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950 leading-relaxed flex items-start gap-3">
              <Info className="text-emerald-700 shrink-0 mt-0.5" size={18} />
              <div><MdText text={inhalt.texte.befreiungFürAltEigentümer} /></div>
            </div>

            {/* Bedingte Pflicht: 10-%-Regel und Bauteil-Grenzwerte nach § 36 GModG */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/25 space-y-4">
              <div>
                <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-shiraz" /><MdText text={inhalt.texte.bedingteSanierungspflichtDie10} /></h4>
                <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.werdenAnEinemBestehenden} /></p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 border-b border-home-grau/30">
                      <th className="p-3 font-bold"><MdText text={inhalt.texte.bauteilAußenhülle} /></th>
                      <th className="p-3 font-bold"><MdText text={inhalt.texte.maxUWertNach} /></th>
                      <th className="p-3 font-bold"><MdText text={inhalt.texte.altbestandTypischVor1977} /></th>
                      <th className="p-3 font-bold"><MdText text={inhalt.texte.erforderlicheDämmstärkeCa} /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium"><MdText text={inhalt.texte.außenwandPutzWdvsBekleidung} /></td>
                      <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.u024W} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.t120180} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.t1214CmWlg} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium"><MdText text={inhalt.texte.steildachObersteGeschossdecke} /></td>
                      <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.u024W2} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.t100160} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.t1416CmWlg} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium"><MdText text={inhalt.texte.flachdachWarmUmkehrdach} /></td>
                      <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.u020W} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.t090140} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.t1618CmWlg} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium"><MdText text={inhalt.texte.fensterBalkonFenstertüren} /></td>
                      <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.uw130W} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.t270320} /></td>
                      <td className="p-3 font-mono">3-fach-Wärmeschutzverglasung</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium">Dachflächenfenster</td>
                      <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.uw140W} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.t250300} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.moderneDachfensterelemente} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium"><MdText text={inhalt.texte.kellerdeckeDeckeGegenErdreich} /></td>
                      <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.u030W} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.t130170} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.t1012CmWlg} /></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium"><MdText text={inhalt.texte.außentürenHauseingangstüren} /></td>
                      <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.ud180W} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.t300450} /></td>
                      <td className="p-3 font-mono"><MdText text={inhalt.texte.gedämmteTürblätterMitDichtung} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Umsetzung 30.10.2026 (DSC-DM-2): Dämmdicken Wand/Dach richtig zugeordnet und aus der Formel hergeleitet */}
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.daemmdickeHerleitung} /></p>
            </div>

          </div>
        )}

        {/* TAB 3: BAUPHYSIK- & AMORTISATIONS-RECHNER */}
        {activeTab === 'bauphysik' && (
          <div className="space-y-6 animate-in fade-in duration-200" id="content-bauphysik">
            
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl flex flex-col lg:flex-row gap-6 justify-between items-start">
              <div className="max-w-2xl space-y-2">
                <h3 className="font-bold text-text-main flex items-center gap-1.5 text-base">
                  <Calculator className="text-shiraz" size={20} /><MdText text={inhalt.texte.bauphysikalischeUWertAmortisations} /></h3>
                <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.berechnungDesWärmedurchgangskoeffiziente} /></p>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-home-grau/25 shadow-xs font-mono text-[11px] text-text-main space-y-1">
                <div><InlineMath math="R_T = R_{si} + \frac{1}{U_0} + \frac{d}{\lambda} + R_{se}" /></div>
                <div><InlineMath math="U_{\text{neu}} = \frac{1}{R_T} \le U_{\text{max, GModG}}" /></div>
              </div>
            </div>

            {/* Bauteil-Wahl */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-main/70 uppercase tracking-wide block"><MdText text={inhalt.texte.zuSanierendesBauteilWählen} /></span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
                {GMODG_COMPONENT_LIMITS.filter(c => c.id !== 'windows').map(comp => (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => handleSelectComponent(comp)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedComponentId === comp.id 
                        ? 'bg-shiraz text-white border-shiraz shadow-sm font-bold' 
                        : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                    }`}
                  >
                    <div className="text-xs truncate">{comp.name.split('(')[0]}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedComponentId === comp.id ? 'text-white/80' : 'text-slate-500'}`}>
                      GModG-Limit: {formatDeWert(comp.limitU)} W/m²K
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Parameter-Eingabe (Links) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-home-grau/30 space-y-4">
                <h4 className="font-bold text-sm text-text-main pb-2 border-b border-home-grau/20 flex items-center gap-1.5">
                  <Settings size={16} className="text-shiraz" /> Sanierungsparameter
                </h4>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span><MdText text={inhalt.texte.ausgangsUWertBestand} /></span>
                    <span className="text-shiraz font-mono font-bold">{formatDeZahl(originalU, 2)} W/(m²K)</span>
                  </label>
                  <input
                    type="range"
                    min="0.50"
                    max="2.50"
                    step="0.05"
                    value={originalU}
                    onChange={(e) => setOriginalU(parseFloat(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span><MdText text={inhalt.texte.t050Teilsaniert} /></span>
                    <span><MdText text={inhalt.texte.t140StandardAltbau} /></span>
                    <span><MdText text={inhalt.texte.t250VollziegelUngedämmt} /></span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span>Dämmstoff:</span>
                    <span className="text-shiraz font-mono font-bold">WLG {formatDeWert(activeMaterial.wlg * 1000)} ({formatDeZahl(activeMaterial.wlg, 3)})</span>
                  </label>
                  <select
                    className="w-full p-2.5 border border-home-grau/35 rounded-xl text-xs bg-white focus:outline-none"
                    value={selectedMaterialKey}
                    onChange={(e) => setSelectedMaterialKey(e.target.value)}
                  >
                    {Object.entries(INSULATION_MATERIALS).map(([key, mat]) => (
                      <option key={key} value={key}>{mat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span><MdText text={inhalt.texte.dämmstoffdickeD} /></span>
                    <span className="text-shiraz font-mono font-bold">{formatDeWert(thicknessMm)} mm</span>
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="300"
                    step="10"
                    value={thicknessMm}
                    onChange={(e) => setThicknessMm(parseInt(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>40 mm</span>
                    <span><MdText text={inhalt.texte.t140MmStandard} /></span>
                    <span><MdText text={inhalt.texte.t300MmPassivhaus} /></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-main/80 block"><MdText text={inhalt.texte.bauteilflächeA} /></label>
                    <div className="flex items-center gap-1.5">
                      <input aria-label={inhalt.werte.bauteilfläche}
                        type="number"
                        min="20"
                        max="1000"
                        value={componentArea}
                        onChange={(e) => setComponentArea(Math.max(1, Number(e.target.value)))}
                        className="w-full p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold"
                      />
                      <span className="text-xs text-slate-500 font-mono">m²</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-main/80 block">Energiepreis:</label>
                    <div className="flex items-center gap-1.5">
                      <input aria-label="Energiepreis"
                        type="number"
                        step="0.01"
                        min="0.05"
                        max="0.50"
                        value={energyPriceKwh}
                        onChange={(e) => setEnergyPriceKwh(Math.max(0.01, Number(e.target.value)))}
                        className="w-full p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold"
                      />
                      <span className="text-xs text-slate-500 font-mono">€/kWh</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-main/80 block"><MdText text={inhalt.texte.gradtagzahlGT2015} /></label>
                    <div className="flex items-center gap-1.5">
                      <input aria-label="Gradtagzahl "
                        type="number"
                        min="2000"
                        max="5500"
                        step="50"
                        value={hgtVal}
                        onChange={(e) => setHgtVal(Math.min(5500, Math.max(2000, Number(e.target.value) || 3500)))}
                        className="w-full p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold"
                      />
                      <span className="text-xs text-slate-500 font-mono">Kd/a</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-main/80 block"><MdText text={inhalt.texte.anlagennutzungsgradEtaSys} /></label>
                    <div className="flex items-center gap-1.5">
                      <input aria-label="Anlagennutzungsgrad "
                        type="number"
                        min="0.5"
                        max="4"
                        step="0.05"
                        value={etaSys}
                        onChange={(e) => setEtaSys(Math.min(4, Math.max(0.5, Number(e.target.value) || 0.9)))}
                        className="w-full p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold"
                      />
                      <span className="text-xs text-slate-500 font-mono">–</span>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-[11px] text-text-main/80 cursor-pointer">
                  <input type="checkbox" checked={sowiesoAktiv} onChange={(e) => setSowiesoAktiv(e.target.checked)} className="mt-0.5 accent-shiraz" />
                  <span><MdText text={inhalt.texte.gerüstPutzFallenOhnehin} /></span>
                </label>

              </div>

              {/* Ergebnisse & Prüfbericht (Rechts) */}
              <div className="lg:col-span-7 bg-slate-50 border border-home-grau/25 p-5 rounded-xl flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-text-main pb-2 border-b border-home-grau/20 flex items-center justify-between">
                    <span><MdText text={inhalt.texte.berechnungsberichtAmortisation} /></span>
                    <span className="text-xs font-mono text-slate-500 font-normal">G_t20/15 = {formatDeWert(hgtVal)}<MdText text={inhalt.texte.kdAFX} />{formatDeZahl(simResults.fx, 1)} · η = {formatDeZahl(etaSys, 2)}</span>
                  </h4>
                  
                  {/* 4 Kennwerte */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Ausgangs-U</span>
                      <span className="font-mono font-bold text-sm text-text-main mt-0.5 block">{formatDeZahl(originalU, 2)}</span>
                      <span className="text-[9px] text-slate-400">W/(m²K)</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block"><MdText text={inhalt.texte.neuerUWert} /></span>
                      <span className={`font-mono font-bold text-sm mt-0.5 block ${simResults.isCompliant ? 'text-emerald-700' : 'text-red-700'}`}>
                        {formatDeZahl(simResults.newU, 3)}
                      </span>
                      <span className="text-[9px] text-slate-400">W/(m²K)</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Kostenersparnis</span>
                      <span className="font-mono font-bold text-sm text-emerald-700 mt-0.5 block">
                        {formatDeZahl(simResults.annualEuroSaved, 0)} €/a
                      </span>
                      <span className="text-[9px] text-slate-400">~{formatDeZahl(simResults.annualKwhSaved, 0)} kWh/a</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Amortisation</span>
                      <span className="font-mono font-bold text-sm text-shiraz mt-0.5 block">
                        ~{formatDeZahl(simResults.amortizationYears, 1)} a
                      </span>
                      <span className="text-[9px] text-slate-400">auf {formatDeZahl(simResults.mehrkosten, 0)}<MdText text={inhalt.texte.mehrkosten} /></span>
                    </div>
                  </div>

                  {/* Detaillierte Formel-Zwischenschritte */}
                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 mt-4 space-y-1 text-xs">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.physikalischeZwischenschritteDinEn} /></span>
                    <div className="text-[11.5px] font-mono text-slate-700 space-y-1 overflow-x-auto py-1">
                      <div><MdText text={inhalt.texte.rBestand1} />{formatDeZahl(originalU, 2)} = {formatDeZahl(simResults.R_orig, 3)} m²K/W</div>
                      <div>R_Dämmung = {formatDeWert(thicknessMm / 1000)} m / {formatDeWert(activeMaterial.wlg)} = {formatDeZahl(simResults.R_ins, 3)} m²K/W</div>
                      <div>R_Gesamt = {formatDeZahl(simResults.R_orig, 3)} + {formatDeZahl(simResults.R_ins, 3)} = {formatDeZahl(simResults.R_tot, 3)} m²K/W</div>
                      <div className="text-shiraz font-bold">U_neu = 1 / {formatDeZahl(simResults.R_tot, 3)} = {formatDeZahl(simResults.newU, 3)} W/(m²K)</div>
                    </div>
                  </div>
                </div>

                {/* Konformitäts-Ampel nach § 36 GModG */}
                <div className={`p-4 rounded-xl border ${
                  simResults.isCompliant 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs' 
                    : 'bg-red-50 border-red-300 text-red-950 shadow-xs'
                }`}>
                  <div className="flex items-start gap-3">
                    {simResults.isCompliant ? (
                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                    ) : (
                      <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
                    )}
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider">
                        {simResults.isCompliant 
                          ? `GMODG-KONFORM (§ 36 GModG eingehalten: U ≤ ${formatDeZahl(activeComponent.limitU, 2)} W/(m²K))` 
                          : `GMODG-GRENZWERT ÜBERSCHRITTEN (Zulässig: U ≤ ${formatDeZahl(activeComponent.limitU, 2)} W/(m²K))`}
                      </h4>
                      <p className="text-xs mt-1 opacity-90 leading-normal">
                        {simResults.isCompliant 
                          ? `Der berechnete U-Wert von ${formatDeZahl(simResults.newU, 3)} W/(m²K) unterschreitet den gesetzlichen Grenzwert von ${formatDeZahl(activeComponent.limitU, 2)} W/(m²K) für ${activeComponent.name}. Die Sanierung spart ca. ${formatDeZahl(simResults.annualCo2KgSaved, 0)} kg CO₂ pro Jahr ein.`
                          : `Achtung: Der Bauteil-U-Wert von ${formatDeZahl(simResults.newU, 3)} W/(m²K) liegt über dem Höchstwert von ${formatDeZahl(activeComponent.limitU, 2)} W/(m²K) nach § 36 GModG. Erhöhen Sie die Dämmstoffdicke um mindestens ${formatDeWert(simResults.dReqMm)} mm oder wählen Sie einen Dämmstoff mit geringerer Wärmeleitfähigkeit (z. B. WLG 032 oder 024).`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live-Rechenweg (AP 3.7) mit den aktuellen Simulator-Eingaben */}
                <FormulaDerivationBox
                  live
                  title={inhalt.werte.ihrRechenwegEinsparungUnd}
                  zielGleichung="t_A = \frac{K_{\text{Mehr}}}{\Delta U \cdot A \cdot F_x \cdot G_t \cdot 24/1000 \,/\, \eta \cdot p}"
                  schritte={[
                    {
                      titel: inhalt.werte.uWertNachDer,
                      erklaerung: `Zusätzlicher Wärmedurchlasswiderstand der ${formatDeZahl(thicknessMm, 0)} mm dicken Dämmschicht (λ = ${formatDeWert(activeMaterial.wlg)} W/(mK)):`,
                      formel: `U_{neu} = \\frac{1}{\\frac{1}{${formatDeTeX(originalU, 2)}} + \\frac{${formatDeTeXWert(thicknessMm / 1000)}}{${formatDeTeXWert(activeMaterial.wlg)}}} = ${formatDeTeX(simResults.newU, 3)}\\,\\text{W/(m}^2\\text{K)}`
                    },
                    {
                      titel: inhalt.werte.eingesparteNutzwärme,
                      erklaerung: `Mit Temperatur-Korrekturfaktor F_x = ${formatDeZahl(simResults.fx, 1)} und Gradtagzahl G_t = ${formatDeWert(hgtVal)} Kd/a (24 h/d, Umrechnung in kWh):`,
                      formel: `Q_N = (${formatDeTeX(originalU, 2)} - ${formatDeTeX(simResults.newU, 3)}) \\cdot ${formatDeTeX(componentArea, 0)} \\cdot ${formatDeTeX(simResults.fx, 1)} \\cdot ${formatDeTeX(hgtVal, 0)} \\cdot \\frac{24}{1000} = ${formatDeTeX(simResults.qNutz, 0)}\\,\\text{kWh/a}`
                    },
                    {
                      titel: inhalt.werte.endenergieUndKosten,
                      erklaerung: `Geteilt durch den Anlagennutzungsgrad η = ${formatDeZahl(etaSys, 2)}, multipliziert mit dem Energiepreis:`,
                      formel: `Q_E = \\frac{${formatDeTeX(simResults.qNutz, 0)}}{${formatDeTeX(etaSys, 2)}} = ${formatDeTeX(simResults.annualKwhSaved, 0)}\\,\\text{kWh/a} \\;\\Rightarrow\\; ${formatDeTeX(simResults.annualKwhSaved, 0)} \\cdot ${formatDeTeX(energyPriceKwh, 2)} = ${formatDeTeX(simResults.annualEuroSaved, 0)}\\,\\text{EUR/a}`
                    },
                    {
                      titel: inhalt.werte.energiebedingteMehrkosten,
                      erklaerung: sowiesoAktiv
                        ? inhalt.werte.gerüstPutzUndMontage
                        : inhalt.werte.dämmstoffPlusMontage85,
                      formel: sowiesoAktiv
                        ? `K_{\\text{Mehr}} = ${formatDeTeX(simResults.totalInvestEuro, 0)} - ${formatDeTeX(simResults.baseLaborCost, 0)} = ${formatDeTeX(simResults.mehrkosten, 0)}\\,\\text{EUR}`
                        : `K_{\\text{Mehr}} = ${formatDeTeX(simResults.materialCost, 0)} + ${formatDeTeX(simResults.baseLaborCost, 0)} = ${formatDeTeX(simResults.mehrkosten, 0)}\\,\\text{EUR}`
                    },
                    {
                      titel: inhalt.werte.statischeAmortisationszeit,
                      erklaerung: inhalt.werte.mehrkostenGeteiltDurchDie,
                      formel: `t_A = \\frac{${formatDeTeX(simResults.mehrkosten, 0)}}{${formatDeTeX(simResults.annualEuroSaved, 0)}} = ${formatDeTeX(simResults.amortizationYears, 1)}\\,\\text{a}`
                    }
                  ]}
                  ergebnisHinweis={inhalt.werte.statischeBetrachtungEineDynamische}
                  normQuelle={inhalt.werte.dinEnIso6946}
                />

              </div>
            </div>

          </div>
        )}

        {/* TAB 4: HEIZUNGSTECHNIK & BIO-TREPPE (GMODG) */}
        {activeTab === 'gebaeudetechnik' && (
          <div className="space-y-6 animate-in fade-in duration-200" id="content-technik">
            
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
              <h3 className="font-bold text-text-main flex items-center gap-1.5 text-base">
                <Leaf className="text-shiraz" size={20} /><MdText text={inhalt.texte.heizungstechnikBioTreppeBeg} /></h3>
              <p className="text-xs text-text-main/70 mt-1 leading-relaxed"><MdText text={inhalt.texte.mitDemGebäudemodernisierungsgesetzGmodg} /></p>
            </div>

            {/* Die gesetzliche Bio-Treppe */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-text-main border-b border-home-grau/15 pb-2 flex items-center gap-2">
                <Zap size={16} className="text-shiraz" /><MdText text={inhalt.texte.dieGesetzlicheBioTreppe} /></h4>
              <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.werNachDem29} /></p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Ab 2029</span>
                  <strong className="text-sm text-text-main block mt-1">mind. 10 %</strong>
                  <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.erneuerbarerBrennstoff} /></span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Ab 2030</span>
                  <strong className="text-sm text-text-main block mt-1">mind. 15 %</strong>
                  <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.erneuerbarerBrennstoff2} /></span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Ab 2035</span>
                  <strong className="text-sm text-text-main block mt-1">mind. 30 %</strong>
                  <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.erneuerbarerBrennstoff3} /></span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Ab 2040</span>
                  <strong className="text-sm text-text-main block mt-1">mind. 60 %</strong>
                  <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.erneuerbarerBrennstoff4} /></span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">Ziel 2045</span>
                  <strong className="text-sm text-emerald-950 block mt-1">100 %</strong>
                  <span className="text-[10px] text-emerald-700"><MdText text={inhalt.texte.keineStufeDerBio} /></span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-normal flex items-start gap-2">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                <div><MdText text={inhalt.texte.wirtschaftlicheKostenfalleDerEinbau} /></div>
              </div>
            </div>

            {/* Technologievergleich & BEG Förderung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-text-main border-b border-home-grau/15 pb-2"><MdText text={inhalt.texte.erfüllungsoptionenImÜberblick} /></h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={16} />
                    <div><MdText text={inhalt.texte.elektrischeWärmepumpeLuftWasser} /></div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={16} />
                    <div><MdText text={inhalt.texte.wärmenetzFernwärmeanschlussVollständigeE} /></div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={16} />
                    <div><MdText text={inhalt.texte.biomasseHolzpelletsScheitholzHohe} /></div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={16} />
                    <div><MdText text={inhalt.texte.hybridHeizungWärmepumpeZur} /></div>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-text-main border-b border-home-grau/15 pb-2"><MdText text={inhalt.texte.begFörderstrukturFürHeizungstausch} /></h4>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.überDieBundesförderungFür} /></p>
                <div className="space-y-1.5 text-xs text-text-main/80">
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg border">
                    <span><MdText text={inhalt.texte.t30Grundförderung} /></span>
                    <strong className="font-mono"><MdText text={inhalt.texte.fürAlleEigentümer} /></strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg border">
                    <span><MdText text={inhalt.texte.t20Klimageschwindigkeitsbonus} /></span>
                    <strong className="font-mono"><MdText text={inhalt.texte.nurSelbstnutzerTauschVon} /></strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg border">
                    <span><MdText text={inhalt.texte.t30Einkommensbonus} /></span>
                    <strong className="font-mono"><MdText text={inhalt.texte.haushaltseinkommen40000A} /></strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg border">
                    <span><MdText text={inhalt.texte.t5Effizienzbonus} /></span>
                    <strong className="font-mono"><MdText text={inhalt.texte.fürErdwärmeOderNatürliches} /></strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-emerald-50 text-emerald-950 rounded-lg border border-emerald-300 font-bold">
                    <span><MdText text={inhalt.texte.maximalerFördersatz} /></span>
                    <span className="font-mono"><MdText text={inhalt.texte.t70Max21000} /></span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: SANIERUNGSFAHRPLAN (ISFP) */}
        {activeTab === 'isfp' && (
          <div className="space-y-6 animate-in fade-in duration-200" id="content-isfp">
            
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
              <h3 className="font-bold text-text-main flex items-center gap-1.5 text-base">
                <FileText className="text-shiraz" size={20} /><MdText text={inhalt.texte.derIndividuelleSanierungsfahrplanIsfp} /></h3>
              <p className="text-xs text-text-main/70 mt-1 leading-relaxed"><MdText text={inhalt.texte.derIndividuelleSanierungsfahrplanIsfp2} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-text-main border-b border-home-grau/15 pb-2"><MdText text={inhalt.texte.dieGoldeneSanierungsregelHülle} /></h4>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.wirdZuerstDieHeizung} /></p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border flex items-start gap-2">
                    <span className="font-bold text-shiraz font-mono">1.</span>
                    <div><MdText text={inhalt.texte.schritt1ObersteGeschossdecke} /></div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border flex items-start gap-2">
                    <span className="font-bold text-shiraz font-mono">2.</span>
                    <div><MdText text={inhalt.texte.schritt2AußenwanddämmungFenster} /></div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border flex items-start gap-2">
                    <span className="font-bold text-shiraz font-mono">3.</span>
                    <div><MdText text={inhalt.texte.schritt3HeizungstauschAuf} /></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-text-main border-b border-home-grau/15 pb-2"><MdText text={inhalt.texte.derIsfpBonusIn} /></h4>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.fürMaßnahmenAnDer} /></p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-rose-50/50 rounded-xl border border-shiraz/20">
                    <strong className="text-shiraz block mb-0.5"><MdText text={inhalt.texte.t5IsfpZuschussbonus} /></strong>
                    <span className="text-slate-700"><MdText text={inhalt.texte.derRegelfördersatzFürHüllmaßnahmen} /></span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
                    <strong className="text-emerald-950 block mb-0.5"><MdText text={inhalt.texte.verdopplungDesFörderbudgets} /></strong>
                    <span className="text-emerald-900"><MdText text={inhalt.texte.dieMaximalAnrechenbarenAusgaben} /></span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        </ModuleTabs>
      </div>

      {/* Structured Footer nach RULE[GEMINI_md] */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1ErforderlicheDämmdicke}
        zielGleichung="d_{erf} = \lambda \cdot \left(\frac{1}{U_{max}} - \frac{1}{U_{alt}}\right)"
        schritte={inhalt.daten["Modernisierung.schritte"]}
        ergebnisHinweis={inhalt.werte.diePflichtGreiftNur}
        normQuelle={inhalt.werte.gmodg3637Und}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2EnergieeinsparungUnd}
        zielGleichung="\Delta Q_E = \frac{\Delta U \cdot A \cdot F_x \cdot G_{t20/15} \cdot 24}{1000 \cdot \eta_{sys}}"
        schritte={inhalt.daten["Modernisierung.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dieKopplungAnOhnehin}
        normQuelle={inhalt.werte.vdi4710Vdi2067}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="modernisierung" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap8} 
        wikipedia={[
          { title: "Gebäudeenergiegesetz", url: "https://de.wikipedia.org/wiki/Geb%C3%A4udemodernisierungsgesetz" },
          { title: "Wärmedurchgangskoeffizient", url: "https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient" },
          { title: "Wärmedämmung", url: "https://de.wikipedia.org/wiki/W%C3%A4rmed%C3%A4mmung" },
          { title: "Wärmepumpe", url: "https://de.wikipedia.org/wiki/W%C3%A4rmepumpe" }
        ]} 
        literatur={inhalt.daten["Modernisierung.literatur"]} 
        regelwerke={inhalt.daten["Modernisierung.regelwerke"]} 
        formeln={inhalt.daten["Modernisierung.formeln"]} 
      />
    </div>
  );
}
