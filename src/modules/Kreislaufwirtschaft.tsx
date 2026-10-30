import React, { useState, useMemo } from 'react';
import { 
  Recycle, RotateCcw, Box, ArrowRight, ArrowDown, 
  Calculator, Building2, AlertTriangle, Layers, ClipboardCheck, 
  Building, Globe, FileSpreadsheet, Plus, Trash2, Activity 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { formatDeZahl, formatDeWert, formatDeIntl } from '@/src/utils/numberFormat';
import inhalt from '@/content/kreislaufwirtschaft/Kreislaufwirtschaft.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

export interface DeconstructionComponent {
  id: string;
  name: string;
  quantity: number;
  unit: 'Stk' | 'm²' | 't';
  category: 'Metall' | 'Holz' | 'Mineralisch' | 'Technik' | 'Sonstiges';
  connectionType: 'geschraubt' | 'gesteckt' | 'genagelt_geklemmt' | 'geklebt_vergossen';
  hazardousSubstance: 'none' | 'asbest' | 'kMF' | 'pCB_pCP' | 'unclear';
  targetChannel: 'reuse' | 'recycle' | 'disposal';
  weightKgPerUnit: number;
}

export default function Kreislaufwirtschaft() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'abfaelle' | 'probleme' | 'rueckbauplanung' | 'zirkularitaet'>('grundlagen');
  const [activeStrategy, setActiveStrategy] = useState<number>(1);

  // Urban Mining Index (UMI) & Circularity Index (MCI) Calculator State Variables
  const [umiReuseIn, setUmiReuseIn] = useState<number>(10);
  const [umiRecyclingIn, setUmiRecyclingIn] = useState<number>(30);
  const [umiRenewableIn, setUmiRenewableIn] = useState<number>(20);
  const [umiReuseOut, setUmiReuseOut] = useState<number>(40);
  const [umiRecyclingOut, setUmiRecyclingOut] = useState<number>(35);

  const [mciRecycledIn, setMciRecycledIn] = useState<number>(25);
  const [mciReusedIn, setMciReusedIn] = useState<number>(15);
  const [mciRecycledOut, setMciRecycledOut] = useState<number>(30);
  const [mciReusedOut, setMciReusedOut] = useState<number>(12);
  const [lifespan, setLifespan] = useState<number>(60);
  const [avgLifespan, setAvgLifespan] = useState<number>(50);
  const [intensity, setIntensity] = useState<number>(1.2);
  const [avgIntensity, setAvgIntensity] = useState<number>(1.0);

  // Derived calculations for UMI & MCI
  const umiInputRate = Math.min(100, umiReuseIn + umiRecyclingIn + umiRenewableIn);
  const umiOutputRate = Math.min(100, umiReuseOut + umiRecyclingOut);
  const umiTotal = (umiInputRate * 0.5) + (umiOutputRate * 0.5);

  const V = 1 - (mciRecycledIn + mciReusedIn) / 100;
  const W = 1 - (mciRecycledOut + mciReusedOut) / 100;
  const lfi = Math.max(0, Math.min(1, (V + W) / 2));
  const utility = (lifespan / (avgLifespan || 1)) * (intensity / (avgIntensity || 1));
  const f_u = utility > 0 ? (0.9 / utility) : 0.9; // F(X) = 0,9/X nach Ellen MacArthur Foundation/Granta (2015), wie formeln.1
  const circularityIndex = Math.max(0, Math.min(100, (1 - lfi * f_u) * 100));

  // Rückbauplanung & Re-Use (DIN SPEC 91484 & DIN SPEC 91525) States
  const [auditComponents, setAuditComponents] = useState<DeconstructionComponent[]>([
    {
      id: 'item-1',
      name: inhalt.werte.aluminiumGlasFassadenelementePfosten,
      quantity: 120,
      unit: 'Stk',
      category: 'Metall',
      connectionType: 'geschraubt',
      hazardousSubstance: 'none',
      targetChannel: 'reuse',
      weightKgPerUnit: 180
    },
    {
      id: 'item-2',
      name: inhalt.werte.innentürenHolzMassivKiefer,
      quantity: 45,
      unit: 'Stk',
      category: 'Holz',
      connectionType: 'geschraubt',
      hazardousSubstance: 'none',
      targetChannel: 'reuse',
      weightKgPerUnit: 35
    },
    {
      id: 'item-3',
      name: inhalt.werte.historischeGussgliederheizkörperRetroSti,
      quantity: 30,
      unit: 'Stk',
      category: 'Technik',
      connectionType: 'geschraubt',
      hazardousSubstance: 'none',
      targetChannel: 'reuse',
      weightKgPerUnit: 80
    },
    {
      id: 'item-4',
      name: inhalt.werte.teppichfliesenFaserstoffBitumenschicht,
      quantity: 450,
      unit: 'm²',
      category: 'Sonstiges',
      connectionType: 'geklebt_vergossen',
      hazardousSubstance: 'none',
      targetChannel: 'recycle',
      weightKgPerUnit: 4.5
    },
    {
      id: 'item-5',
      name: inhalt.werte.bshUnterzügeUndDeckenbalken,
      quantity: 12,
      unit: 'Stk',
      category: 'Holz',
      connectionType: 'gesteckt',
      hazardousSubstance: 'none',
      targetChannel: 'reuse',
      weightKgPerUnit: 750
    },
    {
      id: 'item-6',
      name: 'Asbestzement-Balkonbrüstungsplatten',
      quantity: 80,
      unit: 'm²',
      category: 'Mineralisch',
      connectionType: 'geschraubt',
      hazardousSubstance: 'asbest',
      targetChannel: 'disposal',
      weightKgPerUnit: 18
    }
  ]);

  // Form states for adding new components
  const [newCompName, setNewCompName] = useState('');
  const [newCompQty, setNewCompQty] = useState(10);
  const [newCompUnit, setNewCompUnit] = useState<'Stk' | 'm²' | 't'>('Stk');
  const [newCompCat, setNewCompCat] = useState<'Metall' | 'Holz' | 'Mineralisch' | 'Technik' | 'Sonstiges'>('Metall');
  const [newCompConn, setNewCompConn] = useState<'geschraubt' | 'gesteckt' | 'genagelt_geklemmt' | 'geklebt_vergossen'>('geschraubt');
  const [newCompHaz, setNewCompHaz] = useState<'none' | 'asbest' | 'kMF' | 'pCB_pCP' | 'unclear'>('none');
  const [newCompWeight, setNewCompWeight] = useState(50);

  // DIN SPEC 91484 Pre-Demolition Audit Checklist
  const [dinPreDemChecklist, setDinPreDemChecklist] = useState({
    researchDone: true,
    inspectionDone: true,
    substancesSampled: true,
    reuseInventoryCreated: true,
    reportingAccepted: false
  });

  // Concular integration states
  const [concularConnected, setConcularConnected] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingMatchedCount, setMatchingMatchedCount] = useState(0);
  const [showPayloadSchema, setShowPayloadSchema] = useState(false);

  // Helper functions for Rückbauplanung
  const addAuditComponent = () => {
    if (!newCompName.trim()) return;
    const newComp: DeconstructionComponent = {
      id: `item-${Date.now()}`,
      name: newCompName,
      quantity: newCompQty,
      unit: newCompUnit,
      category: newCompCat,
      connectionType: newCompConn,
      hazardousSubstance: newCompHaz,
      targetChannel: newCompHaz !== 'none' ? 'disposal' : 'reuse',
      weightKgPerUnit: newCompWeight
    };
    setAuditComponents([...auditComponents, newComp]);
    setNewCompName('');
    if (concularConnected) {
      setMatchingMatchedCount(prev => prev + 1);
    }
  };

  const removeAuditComponent = (id: string) => {
    setAuditComponents(auditComponents.filter(c => c.id !== id));
  };

  const updateAuditComponent = (id: string, field: keyof DeconstructionComponent, value: DeconstructionComponent[keyof DeconstructionComponent]) => {
    setAuditComponents(auditComponents.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        if (field === 'hazardousSubstance' && value !== 'none') {
          updated.targetChannel = 'disposal';
        } else if (field === 'hazardousSubstance' && value === 'none' && updated.targetChannel === 'disposal') {
          updated.targetChannel = 'reuse';
        }
        return updated;
      }
      return c;
    }));
  };

  const runConcularMatching = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      setConcularConnected(true);
      const reusables = auditComponents.filter(c => c.hazardousSubstance === 'none' && c.targetChannel === 'reuse').length;
      setMatchingMatchedCount(reusables);
    }, 1250);
  };

  const auditStats = useMemo(() => {
    let totalWeightTons = 0;
    let totalReusableWeightTons = 0;
    let totalAvoidedCo2Kg = 0;
    let estimatedRevenueEur = 0;
    let hazardCount = 0;

    auditComponents.forEach((comp) => {
      const weightKg = comp.quantity * comp.weightKgPerUnit;
      const weightTons = weightKg / 1000;
      totalWeightTons += weightTons;

      const isHazardous = comp.hazardousSubstance !== 'none';
      if (isHazardous) {
        hazardCount += 1;
      }

      let connectionRatingFactor = 0;
      if (comp.connectionType === 'geschraubt') connectionRatingFactor = 0.95;
      else if (comp.connectionType === 'gesteckt') connectionRatingFactor = 0.90;
      else if (comp.connectionType === 'genagelt_geklemmt') connectionRatingFactor = 0.50;
      else connectionRatingFactor = 0.05;

      if (!isHazardous && comp.targetChannel === 'reuse') {
        totalReusableWeightTons += weightTons * connectionRatingFactor;

        // Vermiedene Herstellungsemissionen je kg Bauteil bei Wiederverwendung [kg CO₂-Äq./kg], Erlöse je Stück [€]: gerundete
        // Lehrwerte des Rückbau-Audits ohne Datenbankbezug (Durchsicht B 29.10.2026, DSB-KD-1)
        let embodiedCarbonFactor = 0.8;
        if (comp.category === 'Metall') embodiedCarbonFactor = 4.3;
        else if (comp.category === 'Holz') embodiedCarbonFactor = 1.45;
        else if (comp.category === 'Technik') embodiedCarbonFactor = 3.5;
        else if (comp.category === 'Mineralisch') embodiedCarbonFactor = 0.15;
        
        totalAvoidedCo2Kg += weightKg * embodiedCarbonFactor * connectionRatingFactor;

        let estimatedValuePerUnit = 25;
        if (comp.category === 'Metall') estimatedValuePerUnit = 110;
        else if (comp.category === 'Holz') estimatedValuePerUnit = 48;
        else if (comp.category === 'Technik') estimatedValuePerUnit = 65;
        else if (comp.category === 'Mineralisch') estimatedValuePerUnit = 15;

        estimatedRevenueEur += comp.quantity * estimatedValuePerUnit * connectionRatingFactor;
      } else if (!isHazardous && comp.targetChannel === 'recycle') {
        const recycleCarbonFactor = comp.category === 'Metall' ? 1.0 : 0.08;
        totalAvoidedCo2Kg += weightKg * recycleCarbonFactor;
        estimatedRevenueEur += comp.quantity * 1.5; // Lehrwert: Erlös Recycling je Stück [€]
      } else if (isHazardous) {
        estimatedRevenueEur -= comp.quantity * 12;
      }
    });

    const averageReuseQuota = totalWeightTons > 0 
      ? (totalReusableWeightTons / totalWeightTons) * 100 
      : 0;

    return {
      totalWeightTons,
      totalReusableWeightTons,
      totalAvoidedCo2Kg,
      estimatedRevenueEur: Math.round(estimatedRevenueEur),
      hazardCount,
      averageReuseQuota,
      totalComponentsCount: auditComponents.length
    };
  }, [auditComponents]);

  const strategies = inhalt.daten["Kreislaufwirtschaft.strategies"];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <RotateCcw className="text-shiraz animate-spin-slow" /><MdText text={inhalt.texte.kreislaufwirtschaftCircularEconomy} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieKreislaufwirtschaftImBauwesen} /></p>
        </div>

        <ModuleTabs
          label={inhalt.werte.bereicheKreislaufwirtschaft}
          tabs={[
            { id: 'grundlagen' as const, label: inhalt.werte.rStrategienUrbanMining, icon: RotateCcw },
            { id: 'abfaelle' as const, label: inhalt.werte.massenAufbereitung, icon: Building2 },
            { id: 'probleme' as const, label: inhalt.werte.stoffverbündeSchadstoffe, icon: AlertTriangle },
            { id: 'rueckbauplanung' as const, label: inhalt.werte.rückbauplanungReUse, icon: ClipboardCheck },
            { id: 'zirkularitaet' as const, label: 'Zirkularitäts-Indizes', icon: Calculator }
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          variante="kachel"
          className="flex flex-col gap-6 [&>[role=tablist]]:p-4 [&>[role=tablist]]:bg-slate-50/50 dark:[&>[role=tablist]]:bg-slate-800/40 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:border [&>[role=tablist]]:border-rose-100"
        >
        {activeTab === 'grundlagen' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            {/* R-Strategien */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw size={20} className="text-shiraz" /><MdText text={inhalt.texte.dieRStrategienHierarchie} /></h3>
              
              <div className="flex flex-col items-center w-full gap-2 mt-2">
                {strategies.map((s, index) => (
                  <React.Fragment key={s.id}>
                    <button type="button" aria-expanded={activeStrategy === s.id} aria-controls={`r-strategie-${s.id}`}
                      onClick={() => setActiveStrategy(s.id)}
                      className={`relative py-3 px-4 rounded-xl flex items-center justify-between text-white font-bold transition-all duration-300 w-full hover:-translate-y-0.5 shadow-sm ${activeStrategy === s.id ? s.activeColor : s.bgColor}`}
                      style={{ maxWidth: `${100 - index * 6}%` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-sm">{formatDeWert(s.id)}</div>
                        <span className="text-left text-sm sm:text-base">{s.name}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium hidden sm:block truncate ml-2">{s.label}</span>
                    </button>
                    {activeStrategy === s.id && (
                      <div id={`r-strategie-${s.id}`} className={`w-full my-2 p-5 rounded-2xl border shadow-inner animate-in fade-in slide-in-from-top-2 duration-300 ${s.panelBg}`}>
                        <h4 className={`font-bold text-lg mb-2 flex items-center gap-2 ${s.textColor}`}>
                          {s.name} <span className="text-sm font-normal opacity-70">({s.label})</span>
                        </h4>
                        <p className={`text-sm mb-4 leading-relaxed ${s.textColor}/80`}>{s.description}</p>
                        <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                          <strong className={`block text-xs uppercase tracking-wider mb-2 font-bold ${s.textColor}`}><MdText text={inhalt.texte.typischeAnwendungsbeispiele} /></strong>
                          <ul className={`list-disc list-inside text-sm space-y-1.5 ${s.textColor}/90`}>
                            {s.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Urban Mining & Design */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <Recycle size={20} className="text-shiraz" /><MdText text={inhalt.texte.qualitätenDesRecyclings} /></h3>
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-home-grau/30 p-3 rounded-lg text-sm">
                    <strong className="text-slate-800"><MdText text={inhalt.texte.downcyclingWertminderung} /></strong>
                    <p className="text-slate-600 mt-1"><MdText text={inhalt.texte.dasMaterialWirdVerwertet} /><span className="text-shiraz font-medium">Beispiel:</span><MdText text={inhalt.texte.hochwertigerBauschuttAusBetonmauerwerk} /></p>
                  </div>
                  <div className="bg-sky-50 border border-sky-200 p-3 rounded-lg text-sm">
                    <strong className="text-sky-800"><MdText text={inhalt.texte.recyclingGleichwertig} /></strong>
                    <p className="text-sky-600 mt-1"><MdText text={inhalt.texte.dasMaterialWirdAufbereitet} /><span className="text-shiraz font-medium">Beispiel:</span><MdText text={inhalt.texte.stahlschrottWirdOhneQualitätsverlust} /></p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-sm">
                    <strong className="text-emerald-800"><MdText text={inhalt.texte.upcyclingWertsteigerung} /></strong>
                    <p className="text-emerald-600 mt-1"><MdText text={inhalt.texte.dasAbfallendeMaterialWird} /><span className="text-shiraz font-medium">Beispiel:</span><MdText text={inhalt.texte.alteGerüstbohlenOderAbgerissene} /></p>
                  </div>
                </div>
              </div>
              <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <Box size={20} className="text-shiraz" /><MdText text={inhalt.texte.urbanMiningGebäuderessourcenpässe} /></h3>
                <p className="text-sm text-slate-700 mb-3"><MdText text={inhalt.texte.betrachtetDieGebauteUmwelt} /></p>
                <ul className="text-sm text-slate-500 space-y-2 list-disc list-inside">
                  <li><MdText text={inhalt.texte.gebäudepassMaterialpassZB} /></li>
                  <li><MdText text={inhalt.texte.rückbaukatasterErfassungVonGebäuden} /></li>
                  <li><MdText text={inhalt.texte.sekundärrohstoffeAktiveNutzungVon} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'abfaelle' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="text-shiraz" /><MdText text={inhalt.texte.anfallendeBaustoffmassenVerwertungswege} /></h2>
              <p className="text-sm text-slate-700"><MdText text={inhalt.texte.bauUndAbbruchabfälleStellen} /></p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-slate-900 mb-2"><MdText text={inhalt.texte.bodenaushubBodenSteine} /></h4>
                  <div className="text-lg font-bold text-slate-900 mb-1"><MdText text={inhalt.texte.ca130MioT} /></div>
                  <p className="text-sm text-slate-700"><MdText text={inhalt.texte.verwertungswegeVorrangigVerfüllungVon} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-slate-900 mb-2"><MdText text={inhalt.texte.bauschuttMineralisch} /></h4>
                  <div className="text-lg font-bold text-slate-900 mb-1"><MdText text={inhalt.texte.ca60MioT} /></div>
                  <p className="text-sm text-slate-700"><MdText text={inhalt.texte.verwertungswegeRecyclingbaustoffeStraßen} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-slate-900 mb-2"><MdText text={inhalt.texte.straßenaufbruchAsphalt} /></h4>
                  <div className="text-lg font-bold text-slate-900 mb-1"><MdText text={inhalt.texte.ca20MioT} /></div>
                  <p className="text-sm text-slate-700"><MdText text={inhalt.texte.verwertungswegeAsphaltrecyclingSehrHohe} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 lg:col-span-3">
                  <h4 className="font-bold text-slate-900 mb-2"><MdText text={inhalt.texte.sonstigeBauabfälleGipsHolz} /></h4>
                  <div className="text-lg font-bold text-slate-900 mb-1"><MdText text={inhalt.texte.ca15MioT} /></div>
                  <p className="text-sm text-slate-700"><MdText text={inhalt.texte.verwertungswegeMetalleVollständigesRecyc} /></p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="text-shiraz" /><MdText text={inhalt.texte.aufbereitungsverfahrenNachMaterialien} /></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-stone-500 p-4 rounded-xl">
                  <h4 className="font-bold text-stone-800 mb-2 border-b border-stone-200 pb-2"><MdText text={inhalt.texte.mineralischeBaustoffeBetonMauerwerk} /></h4>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li><MdText text={inhalt.texte.verfahrenBrechenBackenbrecherPrallmühle} /></li>
                    <li><MdText text={inhalt.texte.verwertungsquoteSehrHoch90} /></li>
                  </ul>
                </div>
                <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-indigo-500 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-800 mb-2 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.metalleStahlbetonAluProfilbahnen} /></h4>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li><MdText text={inhalt.texte.verfahrenMagnetabscheidungEisenmetalleWi} /></li>
                    <li><MdText text={inhalt.texte.verwertungsquoteNahe100Metalle} /></li>
                  </ul>
                </div>
                <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 p-4 rounded-xl">
                  <h4 className="font-bold text-amber-900 mb-2 border-b border-amber-200 pb-2"><MdText text={inhalt.texte.bauholzHolzwerkstoffe} /></h4>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li><MdText text={inhalt.texte.verfahrenSchreddernAltholzverordnungKlas} /></li>
                    <li><MdText text={inhalt.texte.verwertungsquoteHoheErfassungAber} /></li>
                  </ul>
                </div>
                <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-blue-500 p-4 rounded-xl">
                  <h4 className="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-2"><MdText text={inhalt.texte.kunststoffeDämmstoffe} /></h4>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li><MdText text={inhalt.texte.verfahrenZerkleinerungExtrusionWerkstoff} /></li>
                    <li><MdText text={inhalt.texte.verwertungsquoteImBaubereichOft} /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'probleme' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            
            <div className="bg-white rounded-2xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="text-shiraz" /><MdText text={inhalt.texte.problematischeStoffverbündeBauweisen} /></h2>
              <p className="text-sm text-slate-700"><MdText text={inhalt.texte.dieModerneBauweiseHat} /></p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <div className="flex items-center gap-2 text-torch-red font-bold mb-2">
                    <ArrowDown size={18} /><MdText text={inhalt.texte.verbundbauweiseHemmtZirkularität} /></div>
                  <p className="text-sm text-slate-500 mb-3"><MdText text={inhalt.texte.stoffeWerdenNassIn} /></p>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    <li><MdText text={inhalt.texte.wärmedämmverbundsystemeWdvsVerklebterEps} /></li>
                    <li><MdText text={inhalt.texte.ortbetonNassestricheMonolithischeVerbind} /></li>
                    <li><MdText text={inhalt.texte.verklebteBodenbelägeTeppichePvc} /></li>
                    <li><MdText text={inhalt.texte.verbundwerkstoffeGfkCfkFaserverstärkte} /></li>
                  </ul>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                    <ArrowRight size={18} /><MdText text={inhalt.texte.designForDisassemblyDfd} /></div>
                  <p className="text-sm text-emerald-800/80 mb-3"><MdText text={inhalt.texte.konstruierenFürDenRückbau} /></p>
                  <ul className="list-disc list-inside text-xs text-emerald-800/80 space-y-1">
                    <li><MdText text={inhalt.texte.trockeneVerbindungenVerschraubungenVerbo} /></li>
                    <li><MdText text={inhalt.texte.modularesBauenVorfertigungIm} /></li>
                    <li><MdText text={inhalt.texte.trennschichtenEinbauVonDefinierten} /></li>
                    <li><MdText text={inhalt.texte.sichtbareLeitungsführungInstallationenTg} /></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-shiraz" /><MdText text={inhalt.texte.störUndSchadstoffe} /></h2>
              <p className="text-sm text-slate-700"><MdText text={inhalt.texte.diePräsenzVonSchadstoffen} /></p>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-900 mb-1"><MdText text={inhalt.texte.historischeBauschadstoffeAsbestPcb} /></h4>
                  <p className="text-sm text-slate-500 mb-2"><MdText text={inhalt.texte.inGebäudenDieVor} /></p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-2 rounded border border-home-grau/30 text-xs">
                      <strong className="text-shiraz">Asbest:</strong><MdText text={inhalt.texte.inFaserzementplattenBrandschutzklappenFl} /></div>
                    <div className="bg-white p-2 rounded border border-home-grau/30 text-xs">
                      <strong className="text-shiraz">PAK:</strong><MdText text={inhalt.texte.teerhaltigeKlebstoffeUnterParkett} /></div>
                    <div className="bg-white p-2 rounded border border-home-grau/30 text-xs">
                      <strong className="text-shiraz">PCB / PCP:</strong><MdText text={inhalt.texte.fugenmassenElastischeDichtstoffeAlte} /></div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-900 mb-1"><MdText text={inhalt.texte.additiveUndStörstoffeIn} /></h4>
                  <p className="text-sm text-slate-500 mb-2"><MdText text={inhalt.texte.auchNeuereMaterialienKönnen} /></p>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    <li><MdText text={inhalt.texte.hbcdHexabromcyclododecanFlammschutzmitte} /></li>
                    <li><MdText text={inhalt.texte.gipsImBetonrecyclingSchon} /></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'rueckbauplanung' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* Info Banner on Concular and Standards */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-3">
                <Recycle className="text-shiraz animate-spin" size={20} /><MdText text={inhalt.texte.rückbauplanungKreislaufwirtschaftImBauwe} /></h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4"><MdText text={inhalt.texte.umDenRohstoffverbrauchUnd} /></p>

              {/* Standards Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
                  <h4 className="font-bold text-xs text-shiraz mb-1.5 flex items-center gap-1">
                    <ClipboardCheck size={14} /><MdText text={inhalt.texte.dinSpec91484Erkundung} /></h4>
                  <p className="text-[11px] text-slate-500 leading-normal"><MdText text={inhalt.texte.beschreibtDasStandardisierteVerfahren} /></p>
                </div>

                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
                  <h4 className="font-bold text-xs text-purple-700 mb-1.5 flex items-center gap-1">
                    <Building size={14} /><MdText text={inhalt.texte.dinSpec91525Materialpass} /></h4>
                  <p className="text-[11px] text-slate-500 leading-normal"><MdText text={inhalt.texte.definiertKriterienZurBewertung} /></p>
                </div>

                <div className="p-4 bg-rose-50/40 border border-shiraz/10 rounded-xl">
                  <h4 className="font-bold text-xs text-shiraz mb-1.5 flex items-center gap-1">
                    <Globe size={14} /><MdText text={inhalt.texte.concularVermittlung} /></h4>
                  <p className="text-[11px] text-slate-500 leading-normal"><MdText text={inhalt.texte.ermöglichtDurchDigitaleBestandserfassung} /></p>
                </div>
              </div>
            </div>

            {/* Catalog & Simulation Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Hand: Audited Items Catalog (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* DIN Audit Checklist progress indicator */}
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <ClipboardCheck size={14} className="text-shiraz" /><MdText text={inhalt.texte.prüfphasenNachDinSpec} /></h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { key: 'researchDone', label: inhalt.werte.t1HistRecherche, desc: inhalt.werte.archivBauaktePrüfen },
                      { key: 'inspectionDone', label: inhalt.werte.t2BegehungVorOrt, desc: inhalt.werte.visuelleBestandsaufnahme },
                      { key: 'substancesSampled', label: inhalt.werte.t3Schadstoffanalyse, desc: inhalt.werte.gefahrgutProbenahme },
                      { key: 'reuseInventoryCreated', label: inhalt.werte.t4ReUseInventar, desc: inhalt.werte.verbindungstypErfassen },
                      { key: 'reportingAccepted', label: inhalt.werte.t5Erkundungsbericht, desc: inhalt.werte.offizielleFreigabe }
                    ].map((phase) => (
                      <button
                        key={phase.key}
                        onClick={() => {
                          setDinPreDemChecklist({
                            ...dinPreDemChecklist,
                            [phase.key]: !dinPreDemChecklist[phase.key as keyof typeof dinPreDemChecklist]
                          });
                        }}
                        className={`p-2.5 rounded-lg border text-left transition-all/150 flex flex-col justify-between cursor-pointer ${
                          dinPreDemChecklist[phase.key as keyof typeof dinPreDemChecklist]
                            ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900 shadow-sm'
                            : 'border-home-grau/30 bg-white hover:bg-slate-50 text-slate-400'
                        }`}
                      >
                        <span className="text-[14px] leading-none shrink-0 block font-bold mb-1.5">
                          {dinPreDemChecklist[phase.key as keyof typeof dinPreDemChecklist] ? '✓' : '○'}
                        </span>
                        <div>
                          <div className="text-[10px] font-bold leading-tight">{phase.label}</div>
                          <div className="text-[8px] opacity-75 mt-0.5 leading-normal">{phase.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Material Assessment Component Table */}
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-home-grau/30 pb-2 flex-wrap gap-2">
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <FileSpreadsheet size={16} className="text-shiraz animate-pulse" /><MdText text={inhalt.texte.erkunderDatenblattBauteilInventar} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.erfassenUndBewertenSie} /></p>
        </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded"><MdText text={inhalt.texte.erfassteGattungen} />{auditComponents.length}
                    </span>
                  </div>

                  {/* Grid Header */}
                  <div className="hidden md:grid grid-cols-12 gap-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <div className="col-span-4"><MdText text={inhalt.texte.bauteilnameKategorie} /></div>
                    <div className="col-span-2 text-center">Wege/Kanal</div>
                    <div className="col-span-2 text-center"><MdText text={inhalt.texte.fügungsartDin91525} /></div>
                    <div className="col-span-2 text-center">Schadstoffstatus</div>
                    <div className="col-span-1 text-right">Menge</div>
                    <div className="col-span-1 text-center">Aktion</div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2.5">
                    {auditComponents.map((comp) => {
                      const isHazardous = comp.hazardousSubstance !== 'none';
                      return (
                        <div
                          key={comp.id}
                          className={`p-3 border rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center transition-all ${
                            isHazardous
                              ? 'bg-rose-50/30 border-rose-200 text-rose-900'
                              : comp.connectionType === 'geklebt_vergossen'
                              ? 'bg-slate-50/60 border-home-grau/30 text-slate-600'
                              : 'bg-white border-home-grau/30 hover:border-home-grau/30 shadow-sm'
                          }`}
                        >
                          {/* Title & Category Info */}
                          <div className="col-span-12 md:col-span-4 flex flex-col gap-0.5">
                            <strong className="text-xs text-slate-900 font-bold leading-snug">{comp.name}</strong>
                            <span className="text-[9px] font-mono uppercase font-bold text-slate-400">
                              {comp.category} &bull; {formatDeWert(comp.weightKgPerUnit)} kg/{comp.unit}
                            </span>
                          </div>

                          {/* Lifecycle/Recycling channel */}
                          <div className="col-span-6 md:col-span-2">
                            <label className="block md:hidden text-[9px] font-bold text-slate-400 uppercase mb-0.5 font-mono"><MdText text={inhalt.texte.materiellesZielverfahren} /></label>
                            <select aria-label={inhalt.werte.materiellesZielverfahren}
                              disabled={isHazardous}
                              value={comp.targetChannel}
                              onChange={(e) => updateAuditComponent(comp.id, 'targetChannel', e.target.value)}
                              className="w-full text-xs font-medium p-1 border border-home-grau/30 rounded-md bg-white text-slate-800 disabled:opacity-50"
                            >
                              <option value="reuse">Re-Use (Wiederverwendung)</option>
                              <option value="recycle">Recycling (Verwertung)</option>
                              <option value="disposal">Disposal (Sonderdeponie)</option>
                            </select>
                          </div>

                          {/* Connection separability (Dry-joint / modularity assessment) */}
                          <div className="col-span-6 md:col-span-2">
                            <label className="block md:hidden text-[9px] font-bold text-slate-400 uppercase mb-0.5 font-mono">Verbindungsklasse</label>
                            <select aria-label="Verbindungsklasse"
                              value={comp.connectionType}
                              onChange={(e) => updateAuditComponent(comp.id, 'connectionType', e.target.value)}
                              className="w-full text-xs font-semibold p-1 border border-home-grau/30 rounded-md bg-white text-slate-800"
                            >
                              <option value="geschraubt">Geschraubt (Klasse A)</option>
                              <option value="gesteckt">Gesteckt / Bolzen (Klasse B)</option>
                              <option value="genagelt_geklemmt">Genagelt / Geklemmt (Klasse C)</option>
                              <option value="geklebt_vergossen">Geklebt / Vergossen (Klasse D)</option>
                            </select>
                          </div>

                          {/* Pre-scrutinized hazards */}
                          <div className="col-span-6 md:col-span-2">
                            <label className="block md:hidden text-[9px] font-bold text-slate-400 uppercase mb-0.5 font-mono">Schadstoffe</label>
                            <select aria-label="Schadstoffe"
                              value={comp.hazardousSubstance}
                              onChange={(e) => updateAuditComponent(comp.id, 'hazardousSubstance', e.target.value)}
                              className={`w-full text-xs font-bold p-1 border rounded-md bg-white ${
                                isHazardous ? 'text-shiraz border-rose-300' : 'text-slate-800 border-home-grau/30'
                              }`}
                            >
                              <option value="none">Schadstofffrei</option>
                              <option value="asbest">Asbest-behaftet</option>
                              <option value="kMF">Künstliche Mineralfaser (KMF)</option>
                              <option value="pCB_pCP">PCB- / PCP-behaftet</option>
                              <option value="unclear">Klärungsbedarf (Labor)</option>
                            </select>
                          </div>

                          {/* Quantity */}
                          <div className="col-span-4 md:col-span-1 md:text-right">
                            <label className="block md:hidden text-[9px] font-bold text-slate-400 uppercase mb-0.5">Menge</label>
                            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {formatDeWert(comp.quantity)} {comp.unit}
                            </span>
                          </div>

                          {/* Removal button */}
                          <div className="col-span-2 md:col-span-1 text-center">
                            <button
                              onClick={() => removeAuditComponent(comp.id)}
                              className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 cursor-pointer"
                              title={inhalt.werte.bauteilLöschen}
                            >
                              <Trash2 size={14} className="mx-auto" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add New Component Manual Audit Form (DIN SPEC Standard) */}
                  <div className="mt-4 pt-4 border-t border-home-grau/30 bg-slate-50/40 p-4 rounded-2xl border border-home-grau/30 flex flex-col gap-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block"><MdText text={inhalt.texte.neuesBauteilManuellAuditieren} /></span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                      <div className="lg:col-span-4">
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1"><MdText text={inhalt.texte.bauteilnameBezeichnung} /></label>
                        <input
                          type="text"
                          placeholder={inhalt.werte.zBStahlträgerHeb}
                          value={newCompName}
                          onChange={(e) => setNewCompName(e.target.value)}
                          className="w-full text-xs p-2 border border-home-grau/30 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-shiraz"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Kategorie</label>
                        <select aria-label="Kategorie"
                          value={newCompCat}
                          onChange={(e) => setNewCompCat(e.target.value as typeof newCompCat)}
                          className="w-full text-xs p-2 border border-home-grau/30 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-shiraz"
                        >
                          <option value="Metall">Metall (Aluminium/Stahl)</option>
                          <option value="Holz">Nachwachsend (Holz)</option>
                          <option value="Mineralisch">Mineralisch (Beton/Ziegel)</option>
                          <option value="Technik">Haustechnik (TGA)</option>
                          <option value="Sonstiges">Sonstige Baustoffe</option>
                        </select>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Fügungsart</label>
                        <select aria-label="Fügungsart"
                          value={newCompConn}
                          onChange={(e) => setNewCompConn(e.target.value as typeof newCompConn)}
                          className="w-full text-xs p-2 border border-home-grau/30 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-shiraz"
                        >
                          <option value="geschraubt">Geschraubt (demontabel)</option>
                          <option value="gesteckt">Gesteckt (leicht trennbar)</option>
                          <option value="genagelt_geklemmt">Genagelt / Geklemmt</option>
                          <option value="geklebt_vergossen">Geklebt / Vergossen</option>
                        </select>
                      </div>

                      <div className="lg:col-span-1">
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Menge</label>
                        <input aria-label="Menge"
                          type="number"
                          min="1"
                          value={newCompQty}
                          onChange={(e) => setNewCompQty(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full text-xs p-1.5 border border-home-grau/30 rounded-lg text-center bg-white font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-shiraz"
                        />
                      </div>

                      <div className="lg:col-span-1">
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Einheit</label>
                        <select aria-label="Einheit"
                          value={newCompUnit}
                          onChange={(e) => setNewCompUnit(e.target.value as typeof newCompUnit)}
                          className="w-full text-xs p-1.5 border border-home-grau/30 rounded-lg bg-white text-slate-900 focus:outline-none"
                        >
                          <option value="Stk">Stk</option>
                          <option value="m²">m²</option>
                          <option value="t">t</option>
                        </select>
                      </div>

                      <div className="lg:col-span-2 flex items-end">
                        <button
                          onClick={addAuditComponent}
                          className="bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs p-2.5 rounded-lg flex items-center gap-1.5 w-full justify-center shrink-0 cursor-pointer select-none transition-all"
                        >
                          <Plus size={14} /> Auditieren
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Hand: Concular API sync & matching metrics */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Concular matching core dashboard */}
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-home-grau/30 pb-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1">
                      <Globe className="text-shiraz" size={14} /><MdText text={inhalt.texte.concularApiIntegrationsHub} /></h4>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase ${
                      concularConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {concularConnected ? inhalt.werte.apiConnected : 'Disconnected'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-normal leading-relaxed"><MdText text={inhalt.texte.übertragenSieDenBauteilkatalog} /></p>

                  {concularConnected ? (
                    /* Connected State Screen */
                    <div className="bg-emerald-50/50 p-4 border border-emerald-200 rounded-xl space-y-3.5 animate-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-emerald-100 rounded text-emerald-700 font-bold text-xs select-none">
                          ✓
                        </div>
                        <div>
                          <strong className="text-xs text-emerald-900 block font-bold leading-none"><MdText text={inhalt.texte.abgleichMitMarktplatzActive} /></strong>
                          <span className="text-[9px] text-emerald-500 font-mono mt-0.5 block"><MdText text={inhalt.texte.endpointApiConcularDe} /></span>
                        </div>
                      </div>

                      {/* API Stats Matches */}
                      <div className="grid grid-cols-2 gap-2 text-center text-xs font-normal">
                        <div className="bg-white p-2 border border-home-grau/30 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase font-mono"><MdText text={inhalt.texte.nachfrageMatches} /></span>
                          <strong className="text-sm font-bold text-emerald-700 block mt-0.5">{matchingMatchedCount} Bauteile</strong>
                        </div>
                        <div className="bg-white p-2 border border-home-grau/30 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase font-mono">Emissionszertifikat</span>
                          <strong className="text-sm font-bold text-emerald-700 block mt-0.5"><MdText text={inhalt.texte.scope3Ready} /></strong>
                        </div>
                      </div>

                      <button
                        onClick={() => setConcularConnected(false)}
                        className="text-[10px] font-bold text-slate-400 block mx-auto hover:text-red-500 transition-colors cursor-pointer"
                      ><MdText text={inhalt.texte.kopplungTrennen} /></button>
                    </div>
                  ) : (
                    /* Disconnected State Screen */
                    <div className="bg-slate-50 p-4 border border-home-grau/30 rounded-xl flex flex-col gap-3">
                      <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 text-center text-xs text-slate-500 flex flex-col gap-1 items-center justify-center">
                        <AlertTriangle size={18} className="text-shiraz" />
                        <span><MdText text={inhalt.texte.keineAktiveBauteilvermittlungVerknüpft} /></span>
                      </div>

                      <button
                        disabled={isMatching}
                        onClick={runConcularMatching}
                        className="bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs p-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm select-none cursor-pointer disabled:opacity-50"
                      >
                        {isMatching ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                            <span><MdText text={inhalt.texte.matchingLäuft} /></span>
                          </>
                        ) : (
                          <>
                            <Globe size={14} />
                            <span><MdText text={inhalt.texte.vermittlungAktivierenConcularSync} /></span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Show simulated JSON API Request payloads */}
                  <div className="border-t border-home-grau/30 pt-3">
                    <button
                      onClick={() => setShowPayloadSchema(!showPayloadSchema)}
                      className="text-xs text-shiraz font-bold flex items-center justify-between w-full hover:underline cursor-pointer select-none"
                    >
                      <span>{showPayloadSchema ? '▼' : '►'}<MdText text={inhalt.texte.entwicklerApiJsonSchema} /></span>
                      <span className="text-[9px] uppercase tracking-wider font-mono font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-home-grau/30">JSON-Payload</span>
                    </button>

                    {showPayloadSchema && (
                      <div className="mt-3 space-y-2 animate-in slide-in-from-top-1 duration-200">
                        <p className="text-[10px] text-slate-400 leading-normal"><MdText text={inhalt.texte.diesesStrukturierteJsonPayload} /></p>
                        <pre className="bg-off-white border border-home-grau/30 text-text-main p-3 rounded-lg text-[9px] overflow-x-auto select-all font-mono leading-normal shadow-inner max-h-56">
{`{
  "api_version": "2026.1",
  "auth_header": "Bearer cnc_live_84b39a...",
  "audit_standard": "DIN_SPEC_91484",
  "valuation_standard": "DIN_SPEC_91525",
  "project_reference": "praxis-abbruch-dgnb2026",
  "total_components": ${auditComponents.length},
  "export_date": "2026-05-27T18:30Z",
  "components": [
${auditComponents.slice(0, 2).map(c => `    {
      "component_id": "${c.id}",
      "label": "${c.name}",
      "quantity": ${c.quantity},
      "unit": "${c.unit === 'Stk' ? 'pcs' : c.unit}",
      "material_class": "${c.category.toLowerCase()}",
      "connection_separability_grade": "${c.connectionType === 'geschraubt' ? inhalt.werte.gradeAScrewed : c.connectionType === 'gesteckt' ? inhalt.werte.gradeBUnmated : inhalt.werte.gradeDGlued}",
      "hazardous_status": "${c.hazardousSubstance === 'none' ? 'free_of_hazards' : 'contaminated'}",
      "calculated_carbon_offset_kg": ${Math.round(c.quantity * c.weightKgPerUnit * (c.category === 'Metall' ? 4.3 : 1.45))}
    }`).join(',\n')}
    ...
  ]
}`}
                        </pre>
                      </div>
                    )}
                  </div>

                </div>

                {/* Dynamic Scorecard for Rückbauplanung */}
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-home-grau/30 pb-1 flex items-center gap-1">
                    <Activity size={12} className="text-shiraz" /><MdText text={inhalt.texte.ressourcenUndVermittlungsbilanz} /></h4>

                  <div className="space-y-3">
                    
                    {/* Total Weight Audited */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/30 flex justify-between items-center">
                      <div>
                        <strong className="text-xs text-slate-900 block leading-tight"><MdText text={inhalt.texte.masseImBaubestand} /></strong>
                        <span className="text-[10px] text-slate-400"><MdText text={inhalt.texte.kumuliertesGewichtDesInventars} /></span>
                      </div>
                      <strong className="text-[15px] font-mono text-slate-900 font-bold">
                        {formatDeZahl(auditStats.totalWeightTons, 2)} t
                      </strong>
                    </div>

                    {/* Re-Use Quote */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/30 flex justify-between items-center">
                      <div>
                        <strong className="text-xs text-slate-900 block leading-tight"><MdText text={inhalt.texte.reUseQuoteNach} /></strong>
                        <span className="text-[10px] text-slate-400"><MdText text={inhalt.texte.gezielteZirkularitätDin91525} /></span>
                      </div>
                      <strong className="text-[15px] font-mono text-shiraz font-bold">
                        {formatDeZahl(auditStats.averageReuseQuota, 1)} %
                      </strong>
                    </div>

                    {/* Carbon Offset Certification */}
                    <div className="bg-indigo-50/50 p-3 border border-indigo-200 rounded-xl flex justify-between items-center">
                      <div>
                        <strong className="text-xs text-indigo-900 block leading-tight"><MdText text={inhalt.texte.vermeidbareScope3Co} /></strong>
                        <span className="text-[10px] text-indigo-500"><MdText text={inhalt.texte.durchVermitteltenReUse} /></span>
                      </div>
                      <strong className="text-[15px] font-mono text-indigo-700 font-bold">
                        ~ {formatDeZahl(auditStats.totalAvoidedCo2Kg / 1000, 2)} t CO₂-eq
                      </strong>
                    </div>

                    {/* Financial Salvage Valuation (Ertragspotenzial) */}
                    <div className="bg-emerald-50/50 p-3 border border-emerald-200 rounded-xl flex justify-between items-center">
                      <div>
                        <strong className="text-xs text-emerald-950 block leading-tight"><MdText text={inhalt.texte.geschätztesMarktwertPotenzial} /></strong>
                        <span className="text-[10px] text-emerald-500"><MdText text={inhalt.texte.restwertErlösAufConcular} /></span>
                      </div>
                      <strong className={`text-[15px] font-mono font-bold ${
                        auditStats.estimatedRevenueEur >= 0 ? 'text-emerald-700' : 'text-shiraz'
                      }`}>
                        {auditStats.estimatedRevenueEur >= 0 ? '+' : ''}{formatDeIntl(auditStats.estimatedRevenueEur)} €
                      </strong>
                    </div>

                  </div>

                  {/* Audit hazard alerts block */}
                  {auditStats.hazardCount > 0 && (
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex gap-1.5 items-start mt-1">
                      <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-rose-800 leading-normal font-normal"><MdText text={inhalt.texte.achtungEsWurdenSind} />{auditStats.hazardCount}<MdText text={inhalt.texte.komponentenspezifischeSchadstoffeZB} /></p>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        )}

        {activeTab === 'zirkularitaet' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {/* Urban Mining Index (UMI) Calculator */}
            <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-4">
              <div className="border-b border-home-grau/25 pb-3">
                <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
                  <Building2 size={20} className="text-shiraz" /><MdText text={inhalt.texte.urbanMiningIndexUmi} /></h3>
                <p className="text-xs text-text-main/70 mt-1 leading-relaxed"><MdText text={inhalt.texte.bewertetDieKreislauffähigkeitEines} /></p>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/20">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-main/60 block mb-2 font-bold"><MdText text={inhalt.texte.preUseQualitätInput} /></span>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 font-medium text-text-main">
                          <span><MdText text={inhalt.texte.wiederverwendeteBauteileReuse} /></span>
                          <InfoTooltip text={inhalt.werte.bauteileDieEinsZu} />
                        </div>
                        <span className="font-mono font-bold text-xs">{formatDeWert(umiReuseIn)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={umiReuseIn} 
                        onChange={(e) => setUmiReuseIn(Number(e.target.value))}
                        className="w-full accent-shiraz h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 font-medium text-text-main">
                          <span><MdText text={inhalt.texte.recyclingmaterialienSekundär} /></span>
                          <InfoTooltip text={inhalt.werte.baustoffeMitEchtemPost} />
                        </div>
                        <span className="font-mono font-bold text-xs">{formatDeWert(umiRecyclingIn)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={umiRecyclingIn} 
                        onChange={(e) => setUmiRecyclingIn(Number(e.target.value))}
                        className="w-full accent-shiraz h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 font-medium text-text-main">
                          <span><MdText text={inhalt.texte.erneuerbareRohstoffeNawaro} /></span>
                          <InfoTooltip text={inhalt.werte.biogeneNachwachsendeRohstoffeAus} />
                        </div>
                        <span className="font-mono font-bold text-xs">{formatDeWert(umiRenewableIn)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={umiRenewableIn} 
                        onChange={(e) => setUmiRenewableIn(Number(e.target.value))}
                        className="w-full accent-shiraz h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div className="text-[10px] text-text-main/50 text-right font-medium"><MdText text={inhalt.texte.zirkuläreInputRate} /><span className="font-bold text-text-main">{formatDeWert(umiInputRate)}%</span> (max. 100%)</div>
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/20">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-main/60 block mb-2 font-bold font-bold"><MdText text={inhalt.texte.postUseQualitätOutput} /></span>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 font-medium text-text-main">
                          <span><MdText text={inhalt.texte.demontierbarkeitReUsePotential} /></span>
                          <InfoTooltip text={inhalt.werte.bauteileDieZerstörungsfreiDemontiert} />
                        </div>
                        <span className="font-mono font-bold text-xs">{formatDeWert(umiReuseOut)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={umiReuseOut} 
                        onChange={(e) => setUmiReuseOut(Number(e.target.value))}
                        className="w-full accent-shiraz h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 font-medium text-text-main">
                          <span>Kreislauf-Recyclingfähigkeit</span>
                          <InfoTooltip text={inhalt.werte.werkstoffeDieDurchSortenreine} />
                        </div>
                        <span className="font-mono font-bold text-xs">{formatDeWert(umiRecyclingOut)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={umiRecyclingOut} 
                        onChange={(e) => setUmiRecyclingOut(Number(e.target.value))}
                        className="w-full accent-shiraz h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div className="text-[10px] text-text-main/50 text-right font-medium"><MdText text={inhalt.texte.zirkuläreOutputRate} /><span className="font-bold text-text-main">{formatDeWert(umiOutputRate)}%</span> (max. 100%)</div>
                  </div>
                </div>

                <div className="p-4 bg-shiraz/5 rounded-xl border border-shiraz/20">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-text-main text-sm font-bold"><MdText text={inhalt.texte.gewichteterUrbanMiningIndex} /></span>
                      <span className="text-[10px] text-text-main/60"><MdText text={inhalt.texte.mittelwertAusInputQuote} /></span>
                    </div>
                    <span className={`text-2xl font-mono font-bold ${umiTotal >= 50 ? 'text-green-600' : 'text-amber-500'}`}>
                      {formatDeZahl(umiTotal, 1)} %
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${umiTotal >= 65 ? 'bg-green-600' : umiTotal >= 35 ? 'bg-amber-500' : 'bg-red-500'}`} 
                      style={{ width: `${umiTotal}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-text-main/70 bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                <strong className="block text-text-main mb-1 text-xs font-bold"><MdText text={inhalt.texte.hintergrundDgnbNachweis} /></strong><MdText text={inhalt.texte.derUmiIstEin} /></div>
            </div>

            {/* Circularity Index (MCI) Calculator */}
            <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-4">
              <div className="border-b border-home-grau/25 pb-3">
                <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
                  <Calculator size={20} className="text-purple-700" /><MdText text={inhalt.texte.zirkularitätsindexMci} /></h3>
                <p className="text-xs text-text-main/70 mt-1 leading-relaxed"><MdText text={inhalt.texte.derMaterialCircularityIndicator} /></p>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/20 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-text-main/50 block font-bold"><MdText text={inhalt.texte.zustromInput} /></span>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-text-main">RC-Anteil</span>
                        <span className="font-mono font-bold text-xs">{formatDeWert(mciRecycledIn)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={mciRecycledIn} 
                        onChange={(e) => setMciRecycledIn(Number(e.target.value))}
                        className="w-full accent-purple-700 h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-text-main"><MdText text={inhalt.texte.reUseBauteile} /></span>
                        <span className="font-mono font-bold text-xs">{formatDeWert(mciReusedIn)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={mciReusedIn} 
                        onChange={(e) => setMciReusedIn(Number(e.target.value))}
                        className="w-full accent-purple-700 h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-text-main/50 block font-bold"><MdText text={inhalt.texte.rückstromOutput} /></span>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-text-main">Recyclingquote</span>
                        <span className="font-mono font-bold text-xs">{formatDeWert(mciRecycledOut)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={mciRecycledOut} 
                        onChange={(e) => setMciRecycledOut(Number(e.target.value))}
                        className="w-full accent-purple-700 h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-text-main">Wiederverwendung</span>
                        <span className="font-mono font-bold text-xs">{formatDeWert(mciReusedOut)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={mciReusedOut} 
                        onChange={(e) => setMciReusedOut(Number(e.target.value))}
                        className="w-full accent-purple-700 h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/20">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-main/60 block mb-2 flex items-center gap-1 font-bold"><MdText text={inhalt.texte.nutzungskoeffizientUtility} /><InfoTooltip text={inhalt.werte.setztDieGeplanteLebensdauer} />
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-text-main mb-1">Gebäude-Lebensdauer</label>
                      <div className="flex items-center gap-1.5">
                        <input aria-label="Gebäude-Lebensdauer" 
                          type="number" min="0" 
                          value={lifespan} 
                          onChange={(e) => setLifespan(Number(e.target.value))}
                          className="w-full p-1.5 border border-home-grau/30 rounded-lg text-xs font-bold"
                        />
                        <span className="text-xs text-text-main/60 font-medium">a</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text-main mb-1 font-bold"><MdText text={inhalt.texte.branchenSchnitt} /></label>
                      <div className="flex items-center gap-1.5">
                        <input aria-label={inhalt.werte.branchenSchnitt} 
                          type="number" min="0" 
                          value={avgLifespan} 
                          onChange={(e) => setAvgLifespan(Number(e.target.value))}
                          className="w-full p-1.5 border border-home-grau/30 rounded-lg text-xs"
                        />
                        <span className="text-xs text-text-main/60 font-medium">a</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-text-main mb-1 font-bold">Nutzungshäufigkeit</label>
                      <input aria-label="Nutzungshäufigkeit" 
                        type="number" min="0" 
                        step="0.1"
                        value={intensity} 
                        onChange={(e) => setIntensity(Number(e.target.value))}
                        className="w-full p-1.5 border border-home-grau/30 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text-main mb-1 font-bold"><MdText text={inhalt.texte.branchenIntensität} /></label>
                      <input aria-label={inhalt.werte.branchenIntensität} 
                        type="number" min="0" 
                        step="0.1"
                        value={avgIntensity} 
                        onChange={(e) => setAvgIntensity(Number(e.target.value))}
                        className="w-full p-1.5 border border-home-grau/30 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-text-main text-sm font-bold"><MdText text={inhalt.texte.materialCircularityIndicatorMci} /></span>
                      <span className="text-[10px] text-text-main/60"><MdText text={inhalt.texte.formel1LfiF} /></span>
                    </div>
                    <span className={`text-2xl font-mono font-bold ${circularityIndex >= 50 ? 'text-green-600' : 'text-amber-500'}`}>
                      {formatDeZahl(circularityIndex, 1)} %
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${circularityIndex >= 65 ? 'bg-green-600' : circularityIndex >= 35 ? 'bg-amber-500' : 'bg-red-500'}`} 
                      style={{ width: `${circularityIndex}%` }}
                    ></div>
                  </div>
                  <div className="mt-2.5 text-[10px] text-text-main/60 grid grid-cols-2 gap-2 border-t border-purple-100 pt-2 font-medium">
                    <div><MdText text={inhalt.texte.linearerFlussFaktorLfi} /><span className="font-mono text-xs font-bold text-text-main">{formatDeZahl(lfi * 100, 1)} %</span></div>
                    <div><MdText text={inhalt.texte.nutzungsfaktorX} /><span className="font-mono text-xs font-bold text-text-main">{formatDeZahl(utility, 2)}</span></div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-text-main/70 bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                <strong className="block text-text-main mb-1 text-xs font-bold"><MdText text={inhalt.texte.mciBedeutungInDer} /></strong><MdText text={inhalt.texte.derMciWurde2015} /></div>
            </div>
          </div>
        )}
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1MaterialCircularity}
        zielGleichung="\text{MCI} = 1 - \text{LFI} \cdot \frac{0{,}9}{X}"
        schritte={inhalt.daten["Kreislaufwirtschaft.schritte"]}
        ergebnisHinweis={inhalt.werte.langeNutzungWirktSo}
        normQuelle={inhalt.werte.ellenMacarthurFoundationGranta}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2VerwertungsquoteEines}
        zielGleichung="Q_{\text{stofflich}} = \frac{m_{\text{Recycling}} + m_{\text{Verfüllung}}}{m_{\text{gesamt}}}"
        schritte={inhalt.daten["Kreislaufwirtschaft.schritte_2"]}
        ergebnisHinweis={inhalt.werte.hochwertigIstErstDie}
        normQuelle={inhalt.werte.krwg14Abfallrahmenrichtlinie2008}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="kreislauf_dpp" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap7} 
        wikipedia={[
          { title: 'Kreislaufwirtschaft', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaft' },
          { title: inhalt.werte.urbanMining, url: 'https://de.wikipedia.org/wiki/Urban_Mining' }
        ]}
        regelwerke={inhalt.daten["Kreislaufwirtschaft.regelwerke"]}
        literatur={inhalt.daten["Kreislaufwirtschaft.literatur"]}
        formeln={inhalt.daten["Kreislaufwirtschaft.formeln"]}
      />
    </div>
  );
}
