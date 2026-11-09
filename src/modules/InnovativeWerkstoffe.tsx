import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Layers, Lightbulb, Box, Sparkles, Cpu, Check, Zap, Coins, Leaf, Scale, Settings, Activity, ChevronRight, AlertCircle, Info, HelpCircle, Wrench, CheckCircle2 } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import inhalt from '@/content/innovativewerkstoffe/InnovativeWerkstoffe.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

interface MaterialProfile {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  co2Index: number; // relativer Lehrindex (Schätzung), Normalbeton = 100
  costIndex: number; // 100-500 (relative to standard concrete = 100)
  strength: string; // Compressive/Tensile description
  advantages: string[];
  disadvantages: string[];
  specs: Record<string, string>;
  details: string;
}

const FUTURE_MATERIALS: MaterialProfile[] = [
  {
    id: '3dcp',
    name: inhalt.werte.t3dBetondruck3dcp3d,
    category: inhalt.werte.digitaleFertigungsverfahren,
    shortDesc: inhalt.werte.schichtweiserSchichtweiserSchalungsfreie,
    co2Index: 65, // Saves CO2 because material is only printed where statically required (topology optimization)
    costIndex: 140, // High equipment cost, but saves human labor, scaffolding, and wood waste
    strength: inhalt.werte.hoheDruckfestigkeitImSchichtverbund,
    advantages: [
      inhalt.werte.kompletterWegfallKonventionellerSchalarb,
      inhalt.werte.unbegrenzteGeometrischeGestaltungsfreihe,
      inhalt.werte.topologieoptimierungMaterialWirdNur,
      inhalt.werte.digitalerProzessDirektesDrucken
    ],
    disadvantages: [
      inhalt.werte.ausgeprägteFestigkeitsanisotropieDieHaft,
      inhalt.werte.integrationVonBewehrungenSchub,
      inhalt.werte.sehrStringenteFeuchtigkeitsUnd
    ],
    specs: {
      'Druckgeschwindigkeit': inhalt.werte.t10Bis30Cm,
      'Größtkorn des Mörtels': inhalt.werte.t2Bis4Mm,
      'Pumpendruck': inhalt.werte.bisZu120Bar,
      'Typische Schichtstärke': inhalt.werte.t10Bis30Mm,
      'Statischer Nachweis': inhalt.werte.bislangOftEinzelfallprüfungenZie
    },
    details: inhalt.werte.der3dConcretePrinting
  },
  {
    id: 'carbon',
    name: inhalt.werte.carbonbetonTextilbetonC,
    category: inhalt.werte.innovativeBewehrungssysteme,
    shortDesc: inhalt.werte.ersatzVonKorrosionsanfälligemBaustahl,
    co2Index: 35, // Thick steel covers aren't needed. Saved concrete saves massive CO2.
    costIndex: 250, // Carbon is expensive but requires a fraction of concrete weight
    strength: inhalt.werte.sehrHoheZugfestigkeitDer,
    advantages: [
      inhalt.werte.vollkommeneKorrosionsfreiheitDieDünne,
      inhalt.werte.filigraneBauteilgeometrienBauteildickenK,
      inhalt.werte.instandsetzungsMeilensteinPerfektZur,
      inhalt.werte.hoheErwarteteDauerhaftigkeitKeine
    ],
    disadvantages: [
      inhalt.werte.hoheMaterialkostenBeiDer,
      inhalt.werte.derzeitHoherEnergieaufwandBei,
      inhalt.werte.keinAusgeprägtesFließverhaltenSprödes
    ],
    specs: {
      'Zugfestigkeit Faser': inhalt.werte.ca3000Bis,
      'Elastizitätsmodul': inhalt.werte.ca230000Bis,
      'Notwendige Betondeckung': inhalt.werte.nur10Bis15,
      'Betonmatrix': inhalt.werte.feinkornbetonMitOptimiertemFließverhalte,
      'CO₂-Reduktionspotenzial': inhalt.werte.bisZu50Einsparung
    },
    details: inhalt.werte.daCarbonNichtRostet
  },
  {
    id: 'uhpc',
    name: inhalt.werte.ultraHighPerformanceConcrete,
    category: inhalt.werte.gefügeoptimierteBetone,
    shortDesc: inhalt.werte.ultrahochfesterBetonMitExtrem,
    co2Index: 50, // Very strong, so you need much less volume. Net CO2 is low.
    costIndex: 280, // Requires dense packing additives and high amount of binders
    strength: inhalt.werte.extremeDruckfestigkeitVon150,
    advantages: [
      inhalt.werte.tragfähigkeitImBereichVon,
      inhalt.werte.extremDichtePackungVerwehrt,
      inhalt.werte.schnittbegrenzungFiligransteBrückentragw
    ],
    disadvantages: [
      inhalt.werte.erhöhterZementleimgehaltUndFeinstfüller,
      inhalt.werte.sehrSprödesBruchverhaltenMuss,
      inhalt.werte.strengsteQualitätskontrollenBeimMischpro
    ],
    specs: {
      'Druckfestigkeit (28d)': inhalt.werte.t150Bis230N,
      'w/z-Wert (Wasser-Zement)': inhalt.werte.extremNiedrig015,
      'Zusatzstoffe': inhalt.werte.silikastaubMikrosilikaQuarzmehlAls,
      'Stahlfaser-Bewehrung': inhalt.werte.t1Bis3Vol,
      'Frost-Tausalz-Resistenz': inhalt.werte.absolutUnempfindlichKeinNennenswerter
    },
    details: inhalt.werte.dieSehrHohenFestigkeiten
  },
  {
    id: 'ilb',
    name: inhalt.werte.infraleichtbetonIlb,
    category: inhalt.werte.gefügeoptimierteBetone2,
    shortDesc: inhalt.werte.hochwärmedämmenderKonstruktionsbetonMitE,
    co2Index: 60, // Monolithic, replaces multi-layered walls and synthetic insulation boards (WDVS)
    costIndex: 125, // Slightly more expensive than aggregate concrete but saves insulation layer installer labor
    strength: inhalt.werte.geringeBisMittlereTragfähigkeit,
    advantages: [
      inhalt.werte.vollständigMonolithischesBauenWand,
      inhalt.werte.keineSynthetischenWärmedämmverbundsystem,
      inhalt.werte.sehrGuterPhysikalischerBrandschutz,
      inhalt.werte.glatteVisuelleSichtbetonoberflächeAußen
    ],
    disadvantages: [
      inhalt.werte.statischBegrenztAufgrundDer,
      inhalt.werte.erhöhteWasseraufnahmeDurchPoröse,
      inhalt.werte.besondereSorgfaltBeiVerdichtung
    ],
    specs: {
      'Trockenrohdichte': inhalt.werte.t650Bis800Kg,
      'Wärmeleitfähigkeit (λ)': inhalt.werte.t015Bis0,
      'Druckfestigkeitsklasse': inhalt.werte.unterhalbDerRohdichtenNach,
      'Zuschläge': inhalt.werte.blähmaterialienBlähglasRecyceltesAltglas,
      'Bewehrung': inhalt.werte.stahlbewehrungMitKorrosionsschutzbeschic
    },
    details: inhalt.werte.infraleichtbetonLöstDasDilemma
  },
  {
    id: 'bio_lc3',
    name: inhalt.werte.ökologischeBindemittelLcGeopolymere,
    category: inhalt.werte.nachhaltigeBindemittelKreislauf,
    shortDesc: inhalt.werte.zukunftsweisendeKlinkerAlternativenCo,
    co2Index: 20, // Huge carbon reduction of 40-80%
    costIndex: 115, // Cost-competitive once factories are optimized, currently slight premium
    strength: inhalt.werte.sehrGuteFestigkeitseigenschaften30,
    advantages: [
      inhalt.werte.erheblicheVerbesserungDerÖkobilanz,
      inhalt.werte.verwendungVonRegionalenAbfallstoffen,
      inhalt.werte.hervorragendeWiderstandskraftGegenSäureb
    ],
    disadvantages: [
      inhalt.werte.teilweiseSchnelleErstarrungszeitenBei,
      inhalt.werte.aktivatorlösungenWieWasserglasSind,
      inhalt.werte.langzeitverhaltenImHinblickAuf
    ],
    specs: {
      'CO₂-Einsparung (LC³)': inhalt.werte.t30Bis45Im,
      'Zusammensetzung LC³': inhalt.werte.klinkeranteilHalbiertRestCalcinierter,
      'Zementfreier Geopolymer': inhalt.werte.alkalischAktivierteFlugascheFly,
      'Hydratationswärme': inhalt.werte.sehrGeringSehrGut,
      'Normung': inhalt.werte.lcArtigeZementeAls
    },
    details: inhalt.werte.derLcZementLimestone
  }
];

type DruckReiter = 'verfahren' | 'rheologie' | 'bemessung' | 'bewehrung' | 'simulator';
const DRUCK_REITER: readonly ModulTab<DruckReiter>[] = [
  { id: 'verfahren', label: inhalt.texte.t1Druckverfahren.trim(), icon: Layers },
  { id: 'rheologie', label: inhalt.texte.t2RheologieEigenschaften.trim(), icon: Activity },
  { id: 'bemessung', label: inhalt.texte.t3StandsicherheitNachweise.trim(), icon: Scale },
  { id: 'bewehrung', label: inhalt.texte.t4Bewehrungstechniken.trim(), icon: Wrench },
  { id: 'simulator', label: inhalt.texte.t5InteraktiverSimulator.trim(), icon: Cpu },
];

type InnovativReiter = 'katalog' | 'druck' | 'finder' | 'vergleich' | 'trends';
const REITER: readonly ModulTab<InnovativReiter>[] = [
  { id: 'katalog', label: 'Material-Spezifikationen', icon: Layers },
  { id: 'druck', label: inhalt.texte.t3dBetondruck3dcp.trim(), icon: Cpu },
  { id: 'finder', label: 'Baustoff-Wegweiser', icon: Settings },
  { id: 'vergleich', label: inhalt.texte.coKostenTradeOff.trim(), icon: Scale },
  { id: 'trends', label: inhalt.texte.smartMaterialsTrends.trim(), icon: Sparkles },
];

export default function InnovativeWerkstoffe() {
  const [activeSubTab, setActiveSubTab] = useState<InnovativReiter>('katalog');
  const [selectedMat, setSelectedMat] = useState<string>('3dcp');
  
  // 3DCP Simulator State
  const [printSpeed, setPrintSpeed] = useState<number>(1.2); // vertical rise rate in m/h
  const [thixotropy, setThixotropy] = useState<number>(5.0); // Athix in Pa/min
  const [concreteDensity, setConcreteDensity] = useState<number>(2100); // density in kg/m3
  const [targetHeight, setTargetHeight] = useState<number>(2.0); // target height in m
  const [initialYield, setInitialYield] = useState<number>(350); // initial yield stress tau_00 in Pa
  const [layerThickness3d, setLayerThickness3d] = useState<number>(20); // layer thickness in mm
  const [layerWidth3d, setLayerWidth3d] = useState<number>(80); // layer width in mm
  const [useAccelerator, setUseAccelerator] = useState<boolean>(true); // nozzle accelerator active?
  const [structuralShape, setStructuralShape] = useState<'straight' | 'rounded' | 'folded'>('rounded'); // wall shape
  const [druckSubTab, setDruckSubTab] = useState<DruckReiter>('verfahren');

  // Decision Tool State
  const [reqProperty, setReqProperty] = useState<string>('co2');
  const [spanLength, setSpanLength] = useState<string>('mittel');
  const [exposure, setExposure] = useState<string>('bewitterung');
  const [formFreedom, setFormFreedom] = useState<string>('hoch');
  const [calcResult, setCalcResult] = useState<{ bestId: string; reason: string; rating: Record<string, number> } | null>(null);

  const selectedMaterialData = FUTURE_MATERIALS.find(m => m.id === selectedMat) || FUTURE_MATERIALS[0];

  // Material evaluation logic
  function calculateBestMaterial() {
    const scores: Record<string, number> = {
      '3dcp': 50,
      'carbon': 50,
      'uhpc': 50,
      'ilb': 50,
      'bio_lc3': 50
    };

    // Evaluate property focus
    if (reqProperty === 'co2') {
      scores.bio_lc3 += 35;
      scores.carbon += 25;
      scores.ilb += 15;
    } else if (reqProperty === 'strength') {
      scores.uhpc += 40;
      scores.carbon += 30;
    } else if (reqProperty === 'insulation') {
      scores.ilb += 45;
    } else if (reqProperty === 'automation') {
      scores['3dcp'] += 45;
    }

    // Evaluate span / dimensions
    if (spanLength === 'gross') {
      scores.uhpc += 25;
      scores.carbon += 25;
      scores.ilb -= 30; // too weak for long spans
      scores['3dcp'] -= 10;
    } else if (spanLength === 'gering') {
      scores.ilb += 10;
      scores['3dcp'] += 15;
    }

    // Evaluate exposure environment
    if (exposure === 'aggressiv') {
      scores.carbon += 30; // no rust!
      scores.uhpc += 25; // dense matrix
      scores.bio_lc3 += 20; // acid resistant
      scores.ilb -= 20; // highly porous
    } else if (exposure === 'bauwerk_innen') {
      scores.ilb += 15;
      scores['3dcp'] += 10;
    }

    // Evaluate geometry
    if (formFreedom === 'hoch') {
      scores['3dcp'] += 40;
      scores.carbon += 15; // thin, wrap around forms
      scores.uhpc -= 5;
    }

    // Find highest
    let bestId = 'bio_lc3';
    let maxScore = -999;
    Object.entries(scores).forEach(([id, score]) => {
      if (score > maxScore) {
        maxScore = score;
        bestId = id;
      }
    });

    // Custom reasons
    let reason = '';
    if (bestId === '3dcp') {
      reason = inhalt.werte.aufgrundIhrerAnforderungAn;
    } else if (bestId === 'carbon') {
      reason = inhalt.werte.fürSchlankeFiligraneStrukturen;
    } else if (bestId === 'uhpc') {
      reason = inhalt.werte.extremeLastenUndDichte;
    } else if (bestId === 'ilb') {
      reason = inhalt.werte.wennMonolithischeSichtbetonwandUnd;
    } else {
      reason = inhalt.werte.daIhrePrioritätAbsolut;
    }

    // Normalize out of 5 stars
    const normalizedRatings: Record<string, number> = {};
    Object.entries(scores).forEach(([id, score]) => {
      const stars = Math.min(5, Math.max(1, Math.round((score / 130) * 5 * 10) / 10)); // Darstellungsfaktor: Punktzahl 130 = 5 Sterne
      normalizedRatings[id] = stars;
    });

    setCalcResult({ bestId, reason, rating: normalizedRatings });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Sparkles className="text-shiraz" /><MdText text={inhalt.texte.innovativeWerkstoffeZukunftstechnologien} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
          <p><MdText text={inhalt.texte.dieTransformationDesBauwesens} /></p>
        </div>
      </div>

      {/* Sub Tabs */}
      <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeSubTab} onWechsel={setActiveSubTab} className="flex flex-col gap-8 [&>[role=tablist]]:bg-slate-50 [&>[role=tablist]]:p-1.5 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:border [&>[role=tablist]]:border-home-grau/30 [&>[role=tablist]]:shadow-sm">

      {/* Main Content Areas */}
      <div className="min-h-[450px]">
        {activeSubTab === 'druck' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Secondary chapter pills */}
            <ModuleTabs label={inhalt.werte.reiterDruck} tabs={DRUCK_REITER} aktiv={druckSubTab} onWechsel={setDruckSubTab} className="space-y-8 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">

            {/* Chapter 1: Druckverfahren */}
            {druckSubTab === 'verfahren' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-350">
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2 font-mono">
                      <span className="bg-indigo-50 p-1.5 rounded-lg">01</span><MdText text={inhalt.texte.strangextrusionsverfahren3dcp} /></div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3"><MdText text={inhalt.texte.kontinuierlicheBetonextrusion} /></h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4"><MdText text={inhalt.texte.dasAmWeitestenVerbreitete} /></p>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                        <div><MdText text={inhalt.texte.konstruktionsgeschwindigkeitSehrHoheAufb} /></div>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                        <div><MdText text={inhalt.texte.skalierbarkeitGanzeHauswändeWerden} /></div>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={14} />
                        <div><MdText text={inhalt.texte.limitierungSichtbareLagenstrukturLagenop} /></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-6 font-mono text-xs text-slate-600">
                    <span className="font-bold text-slate-800 block mb-1"><MdText text={inhalt.texte.typischeParameter} /></span><MdText text={inhalt.texte.düsengröße2050Mm} /></div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2 font-mono">
                      <span className="bg-indigo-50 p-1.5 rounded-lg">02</span><MdText text={inhalt.texte.partikelbettverfahrenBinderJetting} /></div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3"><MdText text={inhalt.texte.selektivesBindenSandBinder} /></h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4"><MdText text={inhalt.texte.hierbeiWirdEineDünne} /></p>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                        <div><MdText text={inhalt.texte.filigraneFormenÜberhängeKomplexe} /></div>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                        <div><MdText text={inhalt.texte.oberflächenqualitätNahezuStufenloseStein} /></div>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={14} />
                        <div><MdText text={inhalt.texte.limitierungNurInSpeziellen} /></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-6 font-mono text-xs text-slate-600">
                    <span className="font-bold text-slate-800 block mb-1"><MdText text={inhalt.texte.typischeParameter2} /></span><MdText text={inhalt.texte.auflösung10Mm} /></div>
                </div>
              </div>
            )}

            {/* Chapter 2: Rheologie & Frischbeton */}
            {druckSubTab === 'rheologie' && (
              <div className="space-y-6 animate-in fade-in duration-350">
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-600" /><MdText text={inhalt.texte.frischbetonRheologieDas3dcp} /></h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-150">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono uppercase block w-max mb-2"><MdText text={inhalt.texte.anforderung1} /></span>
                      <h4 className="font-bold text-slate-900 text-sm mb-1"><MdText text={inhalt.texte.pumpbarkeitExtrudierbarkeit} /></h4>
                      <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dasMaterialMussUnter} /></p>
                      <div className="py-2">
                        <InlineMath math="\eta_{dynamisch} \ll 50\text{ Pa}\cdot\text{s}" />
                      </div>
                    </div>

                    <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-150">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-orange-100 text-orange-850 rounded font-mono uppercase block w-max mb-2"><MdText text={inhalt.texte.anforderung2} /></span>
                      <h4 className="font-bold text-slate-900 text-sm mb-1"><MdText text={inhalt.texte.standfestigkeitBuildability} /></h4>
                      <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.unmittelbarNachDemAustreten} /></p>
                      <div className="py-2">
                        <InlineMath math="\tau_{base} \ge \tau_{statisch,0}" />
                      </div>
                    </div>

                    <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-150">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-850 rounded font-mono uppercase block w-max mb-2">Lösung</span>
                      <h4 className="font-bold text-slate-900 text-sm mb-1"><MdText text={inhalt.texte.smarteThixotropieZeitViskosität} /></h4>
                      <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.einsatzStrukturviskoserBindemittelIm} /></p>
                      <div className="py-2">
                        <InlineMath math="\tau_0(t) = \tau_{0{,}0} + A_{thix} \cdot t" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fcf8f2] p-6 rounded-2xl border border-amber-200">
                  <h4 className="font-bold text-amber-900 text-sm mb-3 flex items-center gap-1.5">
                    <AlertCircle className="text-amber-700 shrink-0" size={16} /><MdText text={inhalt.texte.fugenanisotropieKaltfugenProblemInterlay} /></h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
                    <div>
                      <p className="mb-2"><MdText text={inhalt.texte.imGegensatzZuGegossenem} /></p>
                      <ul className="list-disc pl-4 space-y-1 mb-2">
                        <li><MdText text={inhalt.texte.oberflächenverdunstungLiegtDieZeitspanne} /></li>
                        <li><MdText text={inhalt.texte.mikroKaltfugenStaubOder} /></li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-amber-100">
                      <span className="font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.phänomenologischeVerbundprüfung} /></span>
                      <p className="text-xs text-slate-600 mb-2"><MdText text={inhalt.texte.laborprüfungenZeigenWieDas} /></p>
                      <BlockMath math="f_{t,interlayer} = \beta_{fugenfactor} \cdot f_{t,bulk} \quad (\beta_{fugen} \approx 0{,}4\text{ bis }0{,}85)" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 3: Standsicherheit & Nachweise */}
            {druckSubTab === 'bemessung' && (
              <div className="space-y-6 animate-in fade-in duration-350">
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Scale size={18} className="text-indigo-600" /><MdText text={inhalt.texte.mechanischeVersagensartenWährendDes} /></h3>
                  <p className="text-sm text-slate-600 leading-relaxed"><MdText text={inhalt.texte.solangeDerBetonIm} /></p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-indigo-900 text-sm mb-2 flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-indigo-600" /><MdText text={inhalt.texte.t1PlastischesFließversagenPlastic} /></h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3"><MdText text={inhalt.texte.dieAmBauteilfußWirkende} /></p>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 mt-2 font-mono text-xs">
                        <div className="font-bold text-slate-800 mb-1"><MdText text={inhalt.texte.grenzbedingungNachTresca} /></div>
                        <BlockMath math="\tau_{0,base}(t) \ge \tau_{req} = \frac{\rho \cdot g \cdot H}{\sqrt{3}}" />
                        <span className="text-[10px] text-slate-500 block mt-1"><MdText text={inhalt.texte.hierbeiIstRhoDie} /></span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-indigo-900 text-sm mb-2 flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-indigo-600" /><MdText text={inhalt.texte.t2ElastischesKnickenElastic} /></h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3"><MdText text={inhalt.texte.durchGeometrischeSchlankheitKrümmungssch} /></p>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 mt-2 font-mono text-xs">
                        <div className="font-bold text-slate-800 mb-1"><MdText text={inhalt.texte.kritischeHöheNachGreenhill} /></div>
                        <BlockMath math="H_{cr} = \left( \frac{7{,}837 \cdot E(t) \cdot I(b)}{\rho \cdot g \cdot A} \right)^{1/3}" />
                        <span className="text-[10px] text-slate-500 block mt-1"><MdText text={inhalt.texte.dieGeometrischeTrägheitWird} /></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-shiraz/5 border border-shiraz/20 p-6 rounded-2xl text-text-main">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest block font-mono mb-2"><MdText text={inhalt.texte.ingenieurpraxisRegelwerk} /></span>
                  <h4 className="text-base font-bold mb-2"><MdText text={inhalt.texte.normativeSituationTeilsicherheitskonzept} /></h4>
                  <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.daFürDen3d} /></p>
                </div>
              </div>
            )}

            {/* Chapter 4: Bewehrungsverfahren */}
            {druckSubTab === 'bewehrung' && (
              <div className="space-y-6 animate-in fade-in duration-350">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Option 1: Lost formwork */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <span className="bg-violet-50 text-violet-700 font-mono text-xs px-2 py-0.5 rounded">Option A</span><MdText text={inhalt.texte.ausgießenVonGedrucktenSchalungskernen} /></h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4"><MdText text={inhalt.texte.dasAmHäufigstenPraktizierte} /></p>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                        <li><MdText text={inhalt.texte.kompatibelMitStandardmäßigemBauordnungsr} /></li>
                        <li><MdText text={inhalt.texte.verwendungVonKlassischemKostengünstigem} /></li>
                        <li><MdText text={inhalt.texte.statischerVerbundnachweisErfolgtNach} /></li>
                      </ul>
                    </div>
                    <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 mt-4 text-[11px] text-violet-850"><MdText text={inhalt.texte.anwendungTragendeWandscheibenSchlanke} /></div>
                  </div>

                  {/* Option 2: Nozzle Fiber Feed */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <span className="bg-violet-50 text-violet-700 font-mono text-xs px-2 py-0.5 rounded">Option B</span><MdText text={inhalt.texte.drahtFasermitextrusionInNozzle} /></h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4"><MdText text={inhalt.texte.einHochautomatisierterHighTech} /></p>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                        <li><MdText text={inhalt.texte.t100AutomatisierterGesamtprozess} /></li>
                        <li><MdText text={inhalt.texte.direkterEintragVonZugfestigkeit} /></li>
                        <li><MdText text={inhalt.texte.schwierigBeiSehrEngen} /></li>
                      </ul>
                    </div>
                    <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 mt-4 text-[11px] text-violet-850"><MdText text={inhalt.texte.anwendungFreitragendeBrückenbögenSchalen} /></div>
                  </div>

                  {/* Option 3: Textile mesh */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <span className="bg-violet-50 text-violet-700 font-mono text-xs px-2 py-0.5 rounded">Option C</span><MdText text={inhalt.texte.manuelleEinbettungVonTextilgittern} /></h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4"><MdText text={inhalt.texte.derDruckprozessHältIn} /></p>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                        <li><MdText text={inhalt.texte.hervorragendeZugkraftverteilungImPlatten} /></li>
                        <li><MdText text={inhalt.texte.korrosionsunanfälligUndExtremSchlank} /></li>
                        <li><MdText text={inhalt.texte.vollflächigerVerbundUnterBeachtung} /></li>
                      </ul>
                    </div>
                    <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 mt-4 text-[11px] text-violet-850"><MdText text={inhalt.texte.anwendungModulareBalkonplattenDekorative} /></div>
                  </div>

                  {/* Option 4: Post Tensioning */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <span className="bg-violet-50 text-violet-700 font-mono text-xs px-2 py-0.5 rounded">Option D</span><MdText text={inhalt.texte.nachträglicheExterneVorspannungPost} /></h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4"><MdText text={inhalt.texte.inDasBauteilWerden} /></p>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                        <li><MdText text={inhalt.texte.führtDasGesamteBauteil} /></li>
                        <li><MdText text={inhalt.texte.verhindertDasAuftretenVon} /></li>
                        <li><MdText text={inhalt.texte.exzellentFürZerlegbareUnd} /></li>
                      </ul>
                    </div>
                    <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 mt-4 text-[11px] text-violet-850"><MdText text={inhalt.texte.anwendungSegmentbrückenSchlankVorgespann} /></div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 5: Interactive Simulator */}
            {druckSubTab === 'simulator' && (() => {
              // Physics Calculation Engine
              const gVal = 9.81;
              const effectiveAthix = useAccelerator ? (thixotropy + 150) : thixotropy;
              const effectiveInitial = useAccelerator ? (initialYield + 1200) : initialYield;
              
              // elapsed time inside the bottom layers in minutes to reach height H:
              const baseTimeMins = (targetHeight / printSpeed) * 60;
              const developedYieldBase = effectiveInitial + effectiveAthix * baseTimeMins;
              const developedYieldBaseKPa = developedYieldBase / 1000;
              
              const requiredYieldBase = (concreteDensity * gVal * targetHeight) / Math.sqrt(3);
              const requiredYieldBaseKPa = requiredYieldBase / 1000;
              
              const sfPlasticVal = developedYieldBase / requiredYieldBase;
              
              // Elastic Buckling
              // Lehrannahme: E ≈ 1200 · τ_0 für jungen Mörtel (grobe Näherung, nicht normativ)
              const E_mod_base = 1200 * developedYieldBase; // in Pa
              const b_m = layerWidth3d / 1000; // width of layer in m
              const shapeFactor = structuralShape === 'straight' ? 1.0 : structuralShape === 'rounded' ? 4.0 : 8.0;
              
              // simplified self-weight elastic buckling height for column of thickness b:
              // 0,653 = 7,837/12 (Suiker 2018: H_cr = (7,837·E·I/(ρ·g·A))^(1/3) mit I/A = b²/12 für die Rechteckwand)
              const H_critical_buckling = Math.pow((0.653 * E_mod_base * b_m * b_m * shapeFactor) / (concreteDensity * gVal), 1/3); // Faktor 7,837/12
              const sfBucklingVal = H_critical_buckling / targetHeight;
              
              // Overall State evaluation
              const isStable = sfPlasticVal >= 1.3 && sfBucklingVal >= 1.3;
              const isCritical = (sfPlasticVal >= 1.0 && sfPlasticVal < 1.3) || (sfBucklingVal >= 1.0 && sfBucklingVal < 1.3);
              const isFailed = sfPlasticVal < 1.0 || sfBucklingVal < 1.0;

              return (
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-8 animate-in duration-300">
                  <div className="border-b border-home-grau/20 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Cpu size={18} className="text-indigo-600 animate-spin" /><MdText text={inhalt.texte.standsicherheitsUndFrischbetonversagensS} /></h3>
                    <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.simulierenSieMathematischExakt} /></p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Controls Col (Left) */}
                    <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block font-mono mb-2">Parameter-Steuerung</span>
                      
                      {/* Sub-block 1: Geometrie */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Druckhöhe: {formatDeZahl(targetHeight, 2)} m</label>
                        <input
                          type="range"
                          min="0.5"
                          max="4.0"
                          step="0.1"
                          value={targetHeight}
                          aria-label="Druckhöhe"
                          aria-valuetext={`${formatDeZahl(targetHeight, 2)} m`}
                          onChange={(e) => setTargetHeight(parseFloat(e.target.value))}
                          className="w-full text-indigo-600 accent-indigo-600 cursor-pointer"
                        />
                        <span className="text-[9px] text-slate-400 font-mono"><MdText text={inhalt.texte.bereich05Bis} /></span>
                      </div>

                      {/* Sub-block 2: Print rate */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.steigratePrintSpeed} />{formatDeZahl(printSpeed, 1)} m/h</label>
                        <input
                          type="range"
                          min="0.2"
                          max="2.5"
                          step="0.1"
                          value={printSpeed}
                          aria-label="Steigrate"
                          aria-valuetext={`${formatDeZahl(printSpeed, 1)} m/h`}
                          onChange={(e) => setPrintSpeed(parseFloat(e.target.value))}
                          className="w-full text-indigo-600 accent-indigo-600 cursor-pointer"
                        />
                        <span className="text-[9px] text-slate-400 font-mono"><MdText text={inhalt.texte.vertikaleSteigrateProStunde} /></span>
                      </div>

                      {/* Sub-block 3: Thixotropy */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Thixotropierate: {formatDeZahl(thixotropy, 1)} Pa/min</label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          step="0.5"
                          value={thixotropy}
                          aria-label="Thixotropierate"
                          aria-valuetext={`${formatDeZahl(thixotropy, 1)} Pa/min`}
                          onChange={(e) => setThixotropy(parseFloat(e.target.value))}
                          className="w-full text-indigo-600 accent-indigo-600 cursor-pointer"
                        />
                        <span className="text-[9px] text-slate-400 font-mono"><MdText text={inhalt.texte.gefügeRuheaufbaurateStandardmörtelOhne} /></span>
                      </div>

                      {/* Sub-block 4: Layer Dimensions */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Lagenbreite: {formatDeWert(layerWidth3d)} mm</label>
                          <input
                            type="range"
                            min="40"
                            max="180"
                            value={layerWidth3d}
                            aria-label="Lagenbreite"
                            aria-valuetext={`${formatDeWert(layerWidth3d)} mm`}
                            onChange={(e) => setLayerWidth3d(parseInt(e.target.value))}
                            className="w-full text-indigo-600 accent-indigo-600 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-0.5 font-sans">Dichte: {formatDeWert(concreteDensity)} kg/m³</label>
                          <input
                            type="range"
                            min="1800"
                            max="2400"
                            step="50"
                            value={concreteDensity}
                            aria-label="Dichte"
                            aria-valuetext={`${formatDeWert(concreteDensity)} kg/m³`}
                            onChange={(e) => setConcreteDensity(parseInt(e.target.value))}
                            className="w-full text-indigo-600 accent-indigo-600 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Sub-block 5: Shape */}
                      <div className="pt-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1.5"><MdText text={inhalt.texte.bauteilverlaufStabilitätsform} /></label>
                        <AuswahlGruppe label="Bauteilverlauf" className="grid grid-cols-3 gap-2">
                          <button {...alsOption(structuralShape === 'straight')}
                            onClick={() => setStructuralShape('straight')}
                            className={`px-2 py-1.5 rounded-lg font-bold text-[10px] text-center transition-all cursor-pointer ${
                              structuralShape === 'straight'
                                ? 'bg-indigo-650 text-white shadow-sm ring-1 ring-indigo-500'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Gerade Wand
                          </button>
                          <button {...alsOption(structuralShape === 'rounded')}
                            onClick={() => setStructuralShape('rounded')}
                            className={`px-2 py-1.5 rounded-lg font-bold text-[10px] text-center transition-all cursor-pointer ${
                              structuralShape === 'rounded'
                                ? 'bg-indigo-650 text-white shadow-sm ring-1 ring-indigo-500'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Kreisförmig
                          </button>
                          <button {...alsOption(structuralShape === 'folded')}
                            onClick={() => setStructuralShape('folded')}
                            className={`px-2 py-1.5 rounded-lg font-bold text-[10px] text-center transition-all cursor-pointer ${
                              structuralShape === 'folded'
                                ? 'bg-indigo-650 text-white shadow-sm ring-1 ring-indigo-500'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          ><MdText text={inhalt.texte.gewelltFolded} /></button>
                        </AuswahlGruppe>
                      </div>

                      {/* Sub-block 6: Accelerator */}
                      <div className="pt-3 border-t border-slate-200">
                        <label className="relative flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={useAccelerator}
                            onChange={(e) => setUseAccelerator(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <div className="text-xs">
                            <span className="font-bold text-slate-800 block">Düsentechnik-Schnellbeschleuniger</span>
                            <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.injektionVonAlkalisilikatenWasserglas} /></span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Simulation Output Area (Right) */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                      {/* Overall Status Banner */}
                      <div className={`p-4 rounded-xl border flex gap-3 ${
                        isStable ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                        isCritical ? 'bg-amber-50 text-amber-950 border-amber-300' :
                        'bg-rose-50 text-rose-950 border-rose-300 font-bold'
                      }`}>
                        <div className="text-2xl mt-0.5">
                          {isStable ? '✓' : isCritical ? '⚠' : '✗'}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">
                            {isStable ? inhalt.werte.druckvorgangStabilSafe :
                             isCritical ? inhalt.werte.achtungGrenzwertigStandsicher :
                             inhalt.werte.einsturzStatischesVersagen}
                          </h4>
                          <p className="text-xs leading-relaxed mt-1">
                            {isStable ? inhalt.werte.dieFestigkeitWächstSchneller :
                             isCritical ? inhalt.werte.sehrGeringerSicherheitspufferEs :
                             sfPlasticVal < 1.0 
                               ? inhalt.werte.dasMörtelgewichtDrücktDen
                               : inhalt.werte.bauteilVersagtSchlagartigDurch}
                          </p>
                        </div>
                      </div>

                      <ErgebnisAnsage text={kurzzeile(isStable ? inhalt.werte.druckvorgangStabilSafe : isCritical ? inhalt.werte.achtungGrenzwertigStandsicher : inhalt.werte.einsturzStatischesVersagen,
                        ansageWert('SF plastisch', sfPlasticVal, 2), ansageWert('SF Knicken', sfBucklingVal, 2))} />
                      {/* Numerical Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-mono block"><MdText text={inhalt.texte.dauerDruckprozess} /></span>
                          <span className="text-lg font-extrabold text-slate-800 font-mono">
                            {formatDeWert(Math.floor(baseTimeMins / 60))} h {formatDeWert(Math.round(baseTimeMins % 60))} min
                          </span>
                          <span className="text-[9px] text-slate-400 block mt-1 font-mono"><MdText text={inhalt.texte.alterDer1Schicht} /></span>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-mono block"><MdText text={inhalt.texte.fußFließgrenzeErreicht} /></span>
                          <span className="text-lg font-extrabold text-slate-800 font-mono">
                            {formatDeZahl(developedYieldBaseKPa, 2)} kPa
                          </span>
                          <span className="text-[9px] text-slate-400 block mt-1 font-mono">Nötig: ≥ {formatDeZahl(requiredYieldBaseKPa, 2)} kPa</span>
                        </div>
                      </div>

                      {/* Safety Factors Visualization */}
                      <div className="space-y-4">
                        {/* SF Plastic */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-700"><MdText text={inhalt.texte.plastischeFließStandsicherheitTragfähigk} /></span>
                            <span className={`font-mono font-bold ${sfPlasticVal >= 1.3 ? 'text-emerald-600' : sfPlasticVal >= 1.0 ? 'text-amber-600' : 'text-rose-600'}`}>
                              SF_p = {formatDeZahl(sfPlasticVal, 2)} {sfPlasticVal >= 1.3 ? '(Sicher)' : sfPlasticVal >= 1.0 ? '(Grenzwertig)' : '(Versagen)'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${sfPlasticVal >= 1.3 ? 'bg-emerald-500' : sfPlasticVal >= 1.0 ? 'bg-amber-400' : 'bg-rose-500'}`}
                              style={{ width: `${Math.min(100, (sfPlasticVal / 2.0) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono block"><MdText text={inhalt.texte.minimaleBautechnischeSicherheit1} /></span>
                        </div>

                        {/* SF Elastic */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-700"><MdText text={inhalt.texte.elastischeKnickstabilitätBiegesteifigkei} /></span>
                            <span className={`font-mono font-bold ${sfBucklingVal >= 1.3 ? 'text-emerald-600' : sfBucklingVal >= 1.0 ? 'text-amber-600' : 'text-rose-600'}`}>
                              SF_k = {formatDeZahl(sfBucklingVal, 2)} {sfBucklingVal >= 1.3 ? '(Sicher)' : sfBucklingVal >= 1.0 ? '(Mäßig)' : '(Knicken)'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${sfBucklingVal >= 1.3 ? 'bg-emerald-500' : sfBucklingVal >= 1.0 ? 'bg-amber-400' : 'bg-rose-500'}`}
                              style={{ width: `${Math.min(100, (sfBucklingVal / 2.0) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono block"><MdText text={inhalt.texte.kritischeKnickhöhe} />{formatDeZahl(H_critical_buckling, 2)} m</span>
                        </div>
                      </div>

                      {/* Educational Recommendations Context */}
                      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-150">
                        <h5 className="font-bold text-indigo-900 text-xs mb-1.5 flex items-center gap-1">
                          <Lightbulb size={13} className="text-indigo-600" /><MdText text={inhalt.texte.didaktischeHandlungsempfehlungen} /></h5>
                        <ul className="text-[11px] text-indigo-950 space-y-1 leading-relaxed list-inside list-disc">
                          {isFailed && (
                            <>
                              <li><MdText text={inhalt.texte.aktivierenSieDenSchnellbeschleuniger} /></li>
                              <li><MdText text={inhalt.texte.ändernSieDenBauteilverlauf} /></li>
                            </>
                          )}
                          {isCritical && (
                            <li><MdText text={inhalt.texte.umDenKnappenSicherheitsspielraum} /></li>
                          )}
                          {isStable && (
                            <li><MdText text={inhalt.texte.sehrGutesDesignSie} /></li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            </ModuleTabs>
          </div>
        )}

        {activeSubTab === 'katalog' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {/* Left selector col */}
            <div className="space-y-2 lg:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono mb-2"><MdText text={inhalt.texte.werkstoffAuswählen} /></span>
              
              <AuswahlGruppe label="Werkstoff" className="space-y-2.5">
                {FUTURE_MATERIALS.map((mat) => (
                  <button {...alsOption(selectedMat === mat.id)}
                    key={mat.id}
                    onClick={() => setSelectedMat(mat.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-full relative ${
                      selectedMat === mat.id
                        ? 'bg-white border-indigo-650 ring-1 ring-indigo-500 shadow-md transform translate-x-1'
                        : 'bg-white border-home-grau/30 hover:border-home-grau/30 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono uppercase ${
                          mat.category.includes('Fertigung') ? 'bg-orange-50 text-orange-800' :
                          mat.category.includes('Bewehrung') ? 'bg-indigo-50 text-indigo-800' :
                          mat.category.includes('Bindemittel') ? 'bg-emerald-50 text-emerald-800' :
                          'bg-sky-50 text-sky-850'
                        }`}>
                          {mat.category}
                        </span>
                        
                        <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold font-mono">
                          <Leaf size={10} /> CO₂: -{formatDeWert(100 - mat.co2Index)}%
                        </span>
                      </div>
                      
                      <h4 className="font-extrabold text-sm text-slate-900">{mat.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">{mat.shortDesc}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-home-grau/30 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                      <span>Kostenindex: {formatDeWert(mat.costIndex)}%</span>
                      <span className="text-indigo-600 flex items-center gap-0.5">Details <ChevronRight size={10} /></span>
                    </div>
                  </button>
                ))}
              </AuswahlGruppe>
            </div>

            {/* Right details col */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-home-grau/30 shadow-sm space-y-6">
                
                {/* Header section */}
                <div className="border-b border-home-grau/30 pb-4">
                  <span className="text-xs font-bold text-indigo-600 block mb-1 font-mono uppercase">{selectedMaterialData.category}</span>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedMaterialData.name}</h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">{selectedMaterialData.shortDesc}</p>
                </div>

                {/* Rating bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1"><Leaf className="w-4 h-4 text-emerald-600" /><MdText text={inhalt.texte.coMinderungLehrindex} /></span>
                      <span className="font-bold font-mono text-emerald-800">-{formatDeWert(100 - selectedMaterialData.co2Index)}<MdText text={inhalt.texte.schätzung} /></span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${100 - selectedMaterialData.co2Index}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-tight font-semibold"><MdText text={inhalt.texte.coEinsparpotenzialGegenüberStandardbeton} /></span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1"><Coins className="w-4 h-4 text-slate-500" /><MdText text={inhalt.texte.relativerKostenindex} /></span>
                      <span className="font-bold font-mono text-slate-800">{formatDeWert(selectedMaterialData.costIndex)}<MdText text={inhalt.texte.referenz100} /></span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.min(100, (selectedMaterialData.costIndex / 300) * 100)}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-tight font-semibold"><MdText text={inhalt.texte.anschaffungskostenExklVerringerteFolgeau} /></span>
                  </div>
                </div>

                {/* Technical detailed description */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-widest font-mono mb-2 flex items-center gap-1.5 wie-h5">
                    <Activity className="w-4 h-4 text-indigo-500" /><MdText text={inhalt.texte.funktionsweiseTechnologie} /></h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100 font-semibold">
                    {selectedMaterialData.details}
                  </p>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-widest font-mono mb-2.5 flex items-center gap-1 wie-h5">✔ Vorteile</h4>
                    <ul className="space-y-2">
                      {selectedMaterialData.advantages.map((adv, idx) => (
                        <li key={idx} className="text-xs text-emerald-800 leading-snug flex items-start gap-1 font-semibold">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50/30 p-4 rounded-2xl border border-red-100">
                    <h4 className="font-bold text-red-950 text-xs uppercase tracking-widest font-mono mb-2.5 flex items-center gap-1 wie-h5"><MdText text={inhalt.texte.limitierungenRisiken} /></h4>
                    <ul className="space-y-2">
                      {selectedMaterialData.disadvantages.map((dis, idx) => (
                        <li key={idx} className="text-xs text-red-800 leading-snug flex items-start gap-1 font-semibold">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span>{dis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical specification table */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-widest font-mono mb-2.5 flex items-center gap-1 wie-h5"><Box size={14} className="text-slate-500" /><MdText text={inhalt.texte.technischeKennwerteKennzahlen} /></h4>
                  <div className="border border-home-grau/30 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-home-grau/30">
                          <th className="p-2.5 font-bold text-slate-700">Parameter</th>
                          <th className="p-2.5 font-bold text-slate-700"><MdText text={inhalt.texte.kennzahlRichtwert} /></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {Object.entries(selectedMaterialData.specs).map(([param, value]) => (
                          <tr key={param} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-medium text-slate-600">{param}</td>
                            <td className="p-2.5 font-bold text-slate-900 font-mono">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'finder' && (
          <div className="bg-white p-6 rounded-3xl border border-home-grau/30 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-home-grau/30 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5"><HelpCircle className="text-indigo-600" /><MdText text={inhalt.texte.interaktiverBaustoffWegweiser} /></h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium"><MdText text={inhalt.texte.suchenSieEinPassendes} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controls Column */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5"><MdText text={inhalt.texte.t1HauptBauzielAnforderung} /></label>
                  <select aria-label={inhalt.werte.t1HauptBauzielAnforderung}
                    value={reqProperty}
                    onChange={(e) => setReqProperty(e.target.value)}
                    className="w-full text-xs bg-white border border-home-grau/30 p-2.5 rounded-lg font-semibold text-slate-700 outline-none focus:border-indigo-500"
                  >
                    <option value="co2">CO₂-Minimierung &amp; Ökobiologie (LC³, Recyceltes Blähglas, Geopolymere)</option>
                    <option value="strength">Maximale Traglast &amp; Verringerter Bauraum (UHPC, Carbonbeton)</option>
                    <option value="insulation">Monolithische Hülle mit integrierter Wärmedämmung (Infraleichtbeton)</option>
                    <option value="automation">Automatisierte Errichtung ohne Einschalungsketten (3DCP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5"><MdText text={inhalt.texte.t2DimensionSpannweite} /></label>
                  <AuswahlGruppe label="Spannweite" className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'gering', label: 'Gering', note: inhalt.werte.zBWändeStützen },
                      { id: 'mittel', label: 'Mittel', note: inhalt.werte.standarddecken8m },
                      { id: 'gross', label: 'Groß', note: inhalt.werte.großspannbrückenHallen }
                    ].map((s) => (
                      <button {...alsOption(spanLength === s.id)}
                        key={s.id}
                        type="button"
                        onClick={() => setSpanLength(s.id)}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          spanLength === s.id
                            ? 'bg-indigo-650 text-white border-indigo-650 font-bold'
                            : 'bg-white border-home-grau/30 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs font-bold">{s.label}</div>
                        <div className="text-[9px] opacity-75">{s.note}</div>
                      </button>
                    ))}
                  </AuswahlGruppe>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5"><MdText text={inhalt.texte.t3ExpositionChemischeBeanspruchung} /></label>
                  <select aria-label={inhalt.werte.t3ExpositionChemischeBeanspruchung}
                    value={exposure}
                    onChange={(e) => setExposure(e.target.value)}
                    className="w-full text-xs bg-white border border-home-grau/30 p-2.5 rounded-lg font-semibold text-slate-700 outline-none focus:border-indigo-500"
                  >
                    <option value="bauwerk_innen">Trockener Innenraum – keine Frost- oder Korrosionsgefahr durch Feuchte (XC1)</option>
                    <option value="bewitterung">Freie Außen-Bewitterung - Carbonatisierung &amp; Regenlauf (XC3/XC4/XF1)</option>
                    <option value="aggressiv">Aggressive Medien - Streusalz / Abwasser / Tausalz (XD3/XS3/XA2)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5"><MdText text={inhalt.texte.t4GeometrischeKomplexität} /></label>
                  <div className="flex gap-4 text-xs font-semibold">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="geom"
                        checked={formFreedom === 'mittel'}
                        onChange={() => setFormFreedom('mittel')}
                        className="accent-indigo-600"
                      />
                      <span><MdText text={inhalt.texte.klassischOrthogonalFlachwandBalken} /></span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="geom"
                        checked={formFreedom === 'hoch'}
                        onChange={() => setFormFreedom('hoch')}
                        className="accent-indigo-600"
                      />
                      <span><MdText text={inhalt.texte.organischeFreiformenSkulpturenWellen} /></span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={calculateBestMaterial}
                  className="w-full py-3 bg-shiraz hover:bg-shiraz/90 text-white rounded-xl text-xs font-bold hover:shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Activity size={14} className="animate-pulse" /><MdText text={inhalt.texte.eignungBerechnenMaterialVorschlagen} /></button>
              </div>

              {/* Recommendation column */}
              <div className="border border-home-grau/30 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                {calcResult ? (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="border-b border-indigo-100 pb-2.5">
                      <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono uppercase">Top-Empfehlung</span>
                      <h4 className="text-xl font-bold text-slate-900 mt-1">{FUTURE_MATERIALS.find(m => m.id === calcResult.bestId)?.name}</h4>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl font-semibold border border-home-grau/30">
                      {calcResult.reason}
                    </p>

                    <div>
                      <h5 className="font-bold text-xs text-slate-500 uppercase tracking-widest font-mono mb-2"><MdText text={inhalt.texte.gesamtesEignungsprofilSzenarioEinstufung} /></h5>
                      <div className="space-y-2">
                        {FUTURE_MATERIALS.map((m) => {
                          const stars = calcResult.rating[m.id] || 1;
                          const isBest = m.id === calcResult.bestId;
                          return (
                            <div key={m.id} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                              isBest ? 'bg-indigo-50/50 border-indigo-200 font-bold' : 'bg-white border-home-grau/30'
                            }`}>
                              <span className="text-slate-800 tracking-tight block max-w-[200px] truncate">{m.name.split(' (')[0]}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] font-mono text-slate-400 font-bold">({formatDeWert(stars)}/5)</span>
                                <div className="flex gap-0.5 text-amber-500">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={i < Math.round(stars) ? 'opacity-100' : 'opacity-20'}>★</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <Info size={40} className="text-indigo-200 mb-3" />
                    <h4 className="font-bold text-sm text-slate-800 mb-1"><MdText text={inhalt.texte.keinEignungsergebnisBerechnet} /></h4>
                    <p className="text-xs max-w-xs leading-normal"><MdText text={inhalt.texte.klickenSieLinksAuf} /></p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-home-grau/30 text-[10px] text-slate-400 leading-normal font-semibold font-medium"><MdText text={inhalt.texte.statischerHinweisDieseEmpfehlung} /></div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'vergleich' && (
          <div className="bg-white p-6 rounded-3xl border border-home-grau/30 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-home-grau/30 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5"><Scale className="text-indigo-600" /><MdText text={inhalt.texte.coKostenAbwägungTrade} /></h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-semibold"><MdText text={inhalt.texte.dieAuswahlInnovativerWerkstoffe} /></p>
            </div>

            <div className="overflow-x-auto border border-home-grau/30 rounded-2xl shadow-xs">
              <table className="w-full text-xs text-left divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr className="divide-x divide-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Werkstoff</th>
                    <th className="p-3 text-center"><MdText text={inhalt.texte.relativeCoBelastung} /></th>
                    <th className="p-3 text-center"><MdText text={inhalt.texte.relativeErrichtungskosten} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.typischeMindestdicke} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.primärerTragmechanismus} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.biegesteifigkeitDuktilität} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {/* Standard concrete reference */}
                  <tr className="bg-slate-50/70 border-b border-home-grau/30 font-semibold font-medium text-slate-500">
                    <td className="p-3 font-bold text-slate-700"><MdText text={inhalt.texte.stahlbetonStandardC3037} /></td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded font-mono bg-slate-200 text-slate-700 font-bold text-[10px]"><MdText text={inhalt.texte.t100Referenz} /></span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded font-mono bg-slate-200 text-slate-700 font-bold text-[10px]"><MdText text={inhalt.texte.t100Referenz2} /></span>
                    </td>
                    <td className="p-3 font-mono">200 - 300 mm</td>
                    <td className="p-3"><MdText text={inhalt.texte.verbundwirkungBetonFängtDruck} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.sehrDuktilDurchStahlfließen} /></td>
                  </tr>

                  {FUTURE_MATERIALS.map((mat) => (
                    <tr key={mat.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{mat.name.split(' (')[0]}</div>
                        <span className="text-[10px] text-slate-400 font-semibold">{mat.category}</span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`px-2 py-0.5 rounded font-mono font-extrabold text-[10px] ${
                            mat.co2Index < 40 ? 'bg-emerald-100 text-emerald-800' :
                            mat.co2Index < 60 ? 'bg-teal-100 text-teal-850' :
                            'bg-lime-100 text-lime-850'
                          }`}>
                            {formatDeWert(mat.co2Index)}% (-{formatDeWert(100 - mat.co2Index)}%)
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`px-2 py-0.5 rounded font-mono font-extrabold text-[10px] ${
                            mat.costIndex > 200 ? 'bg-red-100 text-red-800' :
                            mat.costIndex > 130 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-850'
                          }`}>
                            {formatDeWert(mat.costIndex)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-semibold font-mono text-slate-800">{mat.specs['Notwendige Betondeckung'] || mat.specs['Typische Schichtstärke'] || inhalt.werte.bauteilabhängigCa40100mm}</td>
                      <td className="p-3 text-slate-600 font-semibold leading-tight">{mat.strength.split('.')[0]}</td>
                      <td className="p-3 text-red-900/90 font-semibold font-medium leading-tight">{mat.disadvantages.find(d => d.includes('Versagen') || d.includes('spröd')) || inhalt.werte.gutKontrollierbarMitAngepasster}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-2xl text-[11px] text-indigo-950 font-semibold flex items-start gap-2 leading-relaxed">
              <Sparkles className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <div><MdText text={inhalt.texte.instandsetzungsTippWährendDie} /></div>
            </div>
          </div>
        )}

        {activeSubTab === 'trends' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Smart Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-5 rounded-3xl border border-home-grau/30 shadow-sm space-y-3 relative overflow-hidden">
                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-150 text-orange-600 w-fit">
                  <Cpu size={20} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm"><MdText text={inhalt.texte.formgedächtnislegierungenSma} /></h4>
                <p className="text-xs text-slate-600 leading-normal font-semibold"><MdText text={inhalt.texte.metalleMetalleZB} /></p>
                <div className="pt-2 border-t border-home-grau/30 text-[10px] text-slate-500 font-semibold font-medium leading-relaxed"><MdText text={inhalt.texte.anwendungVorspannenVonBetonbauteilen} /></div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-home-grau/30 shadow-sm space-y-3 relative overflow-hidden">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-150 text-emerald-600 w-fit">
                  <Leaf size={20} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm"><MdText text={inhalt.texte.selbstheilenderBetonSelfHealing} /></h4>
                <p className="text-xs text-slate-600 leading-normal font-semibold"><MdText text={inhalt.texte.einmischenVonBakteriensporenZ} /></p>
                <div className="pt-2 border-t border-home-grau/30 text-[10px] text-slate-400 font-semibold font-medium leading-relaxed"><MdText text={inhalt.texte.heilungsEffektDringtDurch} /></div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-home-grau/30 shadow-sm space-y-3 relative overflow-hidden">
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-150 text-sky-600 w-fit">
                  <Zap size={20} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm"><MdText text={inhalt.texte.photokatalytischerBeton} /></h4>
                <p className="text-xs text-slate-600 leading-normal font-semibold"><MdText text={inhalt.texte.fotokatalytischeVeredelungDerSichtbetonm} /></p>
                <div className="pt-2 border-t border-home-grau/30 text-[10px] text-slate-400 font-semibold font-medium leading-relaxed"><MdText text={inhalt.texte.abgasreinigungUnterEinflussVon} /></div>
              </div>

            </div>

            {/* Pilzmyzel & Bio-Concrete Section */}
            <div className="bg-white p-6 rounded-3xl border border-home-grau/30 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-1.5 text-indigo-650 font-bold text-xs uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4 text-indigo-500" /><MdText text={inhalt.texte.biologischeWerkstoffeDerZukunft} /></div>
                <h4 className="text-xl font-bold text-slate-900"><MdText text={inhalt.texte.pilzmyzelBioKompositeIm} /></h4>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold"><MdText text={inhalt.texte.forschendeNutzenDasFadenförmige} /></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1.5 font-semibold leading-relaxed">
                  <div><MdText text={inhalt.texte.vorteil100KompostierbarVorteil} /></div>
                  <div><MdText text={inhalt.texte.fokusAkkreditierteForschungenFür} /></div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-home-grau/30 text-slate-700 text-xs text-center space-y-2">
                <span className="font-mono text-[9px] uppercase font-bold text-slate-400">Kreislaufökologie</span>
                <div className="text-4xl">🍄</div>
                <div className="font-bold text-slate-900">Pilzmyzel-Dämmung</div>
                <div className="text-[10px] text-slate-500 font-medium"><MdText text={inhalt.texte.besteWärmeleitfähigkeitCa0} /></div>
              </div>
            </div>
          </div>
        )}
      </div>
      </ModuleTabs>

      {/* Module Footer */}
      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielErforderlicheFließgren}
        zielGleichung="\tau_{req} = \frac{\rho \cdot g \cdot H}{\sqrt{3}}"
        normQuelle={inhalt.werte.roussel2018FließkriteriumNach}
        schritte={inhalt.daten["InnovativeWerkstoffe.schritte"]}
        ergebnisHinweis={inhalt.werte.req238Kpa}
      />

      <ModulTest moduleId="innovative_werkstoffe" />

      <ModuleFooter 
        wikipedia={[
          { title: "3D-Betondruck" },
          { title: "Carbonbeton", url: "https://de.wikipedia.org/wiki/Carbonbeton" },
          { title: inhalt.werte.ultrahochfesterBeton, url: "https://de.wikipedia.org/wiki/Ultrahochfester_Beton" }
        ]}
        literatur={inhalt.daten["InnovativeWerkstoffe.literatur"]}
        regelwerke={inhalt.daten["InnovativeWerkstoffe.regelwerke"]}
        formeln={inhalt.daten["InnovativeWerkstoffe.formeln"]}
      />
    </div>
  );
}
