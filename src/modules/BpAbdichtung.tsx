import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { fugenbandPruefung } from '@/src/calc/bauprodukte';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import { 
  Layers, 
  Split, 
  Activity, 
  Check, 
  Info, 
  ShieldAlert, 
  Hammer, 
  Droplet, 
  Wrench,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Calculator,
  ShieldCheck,
  FileText,
  LayoutGrid
} from 'lucide-react';
import inhalt from '@/content/bpabdichtung/BpAbdichtung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

export default function BpAbdichtung() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation'>('allgemein');
  const [activeSubTab, setActiveSubTab] = useState<'material' | 'fugen' | 'risse' | 'berater'>('material');
  
  // States for interactive DIN 18533 waterproofing advisor
  const [waterLoad, setWaterLoad] = useState<string>('bodenfeuchte');
  const [roomRequirement, setRoomRequirement] = useState<string>('hochwertig');

  // States for interactive Joint Sealings (Fugenbänder & Injektionsschläuche)
  const [fbJointType, setFbJointType] = useState<'arbeitsfuge' | 'dehnungsfuge'>('arbeitsfuge');
  const [fbWaterPressure, setFbWaterPressure] = useState<number>(3); // in m Wassersäule
  const [fbSlabThickness, setFbSlabThickness] = useState<number>(30); // in cm
  const [fbMaxAggregate, setFbMaxAggregate] = useState<16 | 32>(32); // Größtkorn in mm
  
  const [isLength, setIsLength] = useState<number>(8); // Injektionsschlauch Länge in m
  const [isConCover, setIsConCover] = useState<number>(10); // Betonüberdeckung in cm
  const [isFasteningInterval, setIsFasteningInterval] = useState<number>(15); // Befestigungsabstand in cm
  const [isMedium, setIsMedium] = useState<'acrylgel' | 'pur_harz' | 'ep_harz'>('acrylgel');

  // Calculation of advisor recommendations
  const getAdvisorRecommendation = () => {
    let waterClass = '';
    let waterDesc = '';
    let systemTitle = '';
    let systemDesc = '';
    let products = [] as string[];
    let guidelines = [] as string[];
    let techSpecs = [] as { label: string; value: string }[];

    switch (waterLoad) {
      case 'bodenfeuchte':
        waterClass = 'W1.1-E';
        waterDesc = inhalt.werte.bodenfeuchteUndNichtstauendesSickerwasse;
        break;
      case 'stauend':
        waterClass = 'W2.1-E';
        waterDesc = inhalt.werte.mäßigeEinwirkungVonAußen;
        break;
      case 'stauend_drain':
        waterClass = 'W1.2-E';
        waterDesc = inhalt.werte.bodenfeuchteUndNichtstauendesSickerwasse2;
        break;
      case 'drueckend_flach':
        waterClass = 'W2.1-E';
        waterDesc = inhalt.werte.mäßigeEinwirkungVonAußen2;
        break;
      case 'drueckend_tief':
        waterClass = 'W2.2-E';
        waterDesc = inhalt.werte.hoheEinwirkungVonAußen;
        break;
      case 'spritzwasser':
        waterClass = 'W4-E';
        waterDesc = inhalt.werte.spritzwasserAmWandsockelSowie;
        break;
    }

    if (waterLoad === 'spritzwasser') {
      systemTitle = inhalt.werte.flankenschutzSockelabdichtungFassadenübe;
      systemDesc = inhalt.werte.robusterSchutzAnErdberührten;
      products = inhalt.daten.getAdvisorRecommendation;
      techSpecs = inhalt.daten.getAdvisorRecommendation_2;
      guidelines = inhalt.daten.getAdvisorRecommendation_3;
    } else if (waterLoad === 'stauend' || waterLoad === 'drueckend_flach' || waterLoad === 'drueckend_tief') {
      if (roomRequirement === 'hochwertig') {
        systemTitle = inhalt.werte.kWanneSystemergänzungWu;
        systemDesc = inhalt.werte.hinterlaufstabileFrischbetonverbundfolie;
        products = inhalt.daten.getAdvisorRecommendation_4;
        techSpecs = inhalt.daten.getAdvisorRecommendation_5;
        guidelines = inhalt.daten.getAdvisorRecommendation_6;
      } else if (roomRequirement === 'standard') {
        systemTitle = inhalt.werte.moderneWeißeWanneWasserundurchlässiges;
        systemDesc = inhalt.werte.dasTragwerkÜbernimmtDie;
        products = inhalt.daten.getAdvisorRecommendation_7;
        techSpecs = inhalt.daten.getAdvisorRecommendation_8;
        guidelines = inhalt.daten.getAdvisorRecommendation_9;
      } else {
        systemTitle = inhalt.werte.betonkonstruktionOhneWuAnforderung;
        systemDesc = inhalt.werte.betonkonstruktionOhneBesondereDichtheits;
        products = inhalt.daten.getAdvisorRecommendation_10;
        techSpecs = inhalt.daten.getAdvisorRecommendation_11;
        guidelines = inhalt.daten.getAdvisorRecommendation_12;
      }
    } else {
      // Bodenfeuchte oder stauend + drain (W1.1-E oder W1.2-E)
      if (roomRequirement === 'hochwertig') {
        systemTitle = inhalt.werte.klassischeSchwarzeWanneMit;
        systemDesc = inhalt.werte.vollflächigDichteFlexibleAbdichtungsscha;
        products = inhalt.daten.getAdvisorRecommendation_13;
        techSpecs = inhalt.daten.getAdvisorRecommendation_14;
        guidelines = inhalt.daten.getAdvisorRecommendation_15;
      } else if (roomRequirement === 'standard') {
        systemTitle = inhalt.werte.schwarzeWanneStandardBitumen;
        systemDesc = inhalt.werte.hautabdichtungFürKellerNutzzonen;
        products = inhalt.daten.getAdvisorRecommendation_16;
        techSpecs = inhalt.daten.getAdvisorRecommendation_17;
        guidelines = [
          inhalt.werte.din18533Teil3
        ];
      } else {
        systemTitle = inhalt.werte.minimalFeuchteschutzBrauneWanne;
        systemDesc = inhalt.werte.kostengünstigerMineralischerFeuchteschut;
        products = inhalt.daten.getAdvisorRecommendation_18;
        techSpecs = [
          { label: inhalt.werte.mindestschichtdickeMds, value: '≥ 2,0 mm' }
        ];
        guidelines = inhalt.daten.getAdvisorRecommendation_19;
      }
    }

    return {
      waterClass,
      waterDesc,
      systemTitle,
      systemDesc,
      products,
      techSpecs,
      guidelines
    };
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        
        {/* Module Header */}
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /><MdText text={inhalt.texte.abdichtungenBauprodukte} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.regelkonformeAbdichtungssystemeFugentech} /></p>
        </div>

        {/* Primary Tabs (AP 3.8: ARIA-Reiter) */}
        <ModuleTabs
          label={inhalt.werte.bereicheAbdichtung}
          tabs={[
            { id: 'allgemein' as const, label: 'Basiswissen', icon: BookOpen },
            { id: 'praxis' as const, label: 'Praxisbeispiele', icon: CheckCircle2 },
            { id: 'innovation' as const, label: 'Zukunftstrends', icon: Lightbulb }
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6"
        >
        {activeTab === 'allgemein' ? (
          <>
            {/* Sub-Tab Navigation (zweite Ebene, ARIA-Reiter) */}
            <ModuleTabs
              label={inhalt.werte.themenBasiswissenAbdichtung}
              tabs={[
                { id: 'material' as const, label: inhalt.werte.materialienBaustoffe, icon: Layers },
                { id: 'fugen' as const, label: inhalt.werte.fugenKonstruktionMaterial, icon: Split },
                { id: 'risse' as const, label: inhalt.werte.risseVerpressungen, icon: Activity },
                { id: 'berater' as const, label: inhalt.werte.dinKlassenBeraterSysteme, icon: Calculator }
              ]}
              aktiv={activeSubTab}
              onWechsel={setActiveSubTab}
              className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6"
            >

        {/* TAB 1: MATERIALIEN */}
        {activeSubTab === 'material' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Informational Header for Deutsche Bauchemie e.V. Sealing Guidelines */}
            <div className="text-xs text-text-main hover:text-text-main bg-stone-50 p-4.5 rounded-xl border border-home-grau/30 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-shiraz bg-shiraz/10 px-2 py-0.5 rounded"><MdText text={inhalt.texte.planungsgrundlageDeutscheBauchemieE} /></span>
              <p className="leading-relaxed font-medium"><MdText text={inhalt.texte.erdberührteBauwerksabdichtungenSowieSock} /></p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* PMBC SECTION */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-shiraz tracking-wider uppercase bg-rose-50 px-2 py-0.5 rounded block w-max">Bitumensystem</span>
                  <h3 className="font-extrabold text-slate-800 text-sm lg:text-base"><MdText text={inhalt.texte.pmbcPolymermodifizierteBitumendickbeschi} /></h3>
                  <p className="text-xs text-slate-500 leading-normal"><MdText text={inhalt.texte.lösemittelfreieOrganischePastenAuf} /></p>
                  <ul className="text-[11px] text-slate-600 pl-1 list-none space-y-2">
                    <li className="flex items-start gap-1.5 border-t border-slate-100 pt-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.untergrundvorbereitungKratzspachtelungAu} /><i>Pinhole-Effekt</i><MdText text={inhalt.texte.blasenUndPorenbildungDurch} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.sollschichtdickeMessungW1E} /><span className="font-mono font-bold text-slate-800">≥ 3,0 mm</span><MdText text={inhalt.texte.w21EVerlangt} /><span className="font-mono font-bold text-slate-800">≥ 4,0 mm</span><MdText text={inhalt.texte.mitVollflächigerGewebeeinbettungSchichtd} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.flankenEckenbehandlungInneneckenUnd} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.witterungseinschränkungenVerarbeitungNur} /></span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-2.5 rounded text-[10px] text-slate-500 italic font-medium leading-tight"><MdText text={inhalt.texte.regelwerkRichtlinieFürDie} /></div>
              </div>

              {/* MDS SECTION */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-emerald-800 tracking-wider uppercase bg-emerald-50 px-2 py-0.5 rounded block w-max"><MdText text={inhalt.texte.mineralischesSystem} /></span>
                  <h3 className="font-extrabold text-slate-800 text-sm lg:text-base"><MdText text={inhalt.texte.mdsMineralischeDichtungsschlämmen} /></h3>
                  <p className="text-xs text-slate-500 leading-normal"><MdText text={inhalt.texte.zementgebundeneBauwerksabdichtungssystem} /></p>
                  <ul className="text-[11px] text-slate-600 pl-1 list-none space-y-2">
                    <li className="flex items-start gap-1.5 border-t border-slate-100 pt-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.untergrundsteuerungVornässenMineralische} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.schichtdickenRegularienJedeStelle} /><span className="font-mono font-bold text-slate-800">≥ 2,0 mm</span><MdText text={inhalt.texte.aufweisenDerEinbauErfolgt} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.schwindrissProphylaxeZuDicke} /></span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-2.5 rounded text-[10px] text-slate-500 italic font-medium leading-tight"><MdText text={inhalt.texte.regelwerkRichtlinieFürDie2} /></div>
              </div>

              {/* FPD SECTION (INNOVATIVE REAKTIVABDICHTUNGEN) */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-indigo-800 tracking-wider uppercase bg-indigo-50 px-2 py-0.5 rounded block w-max"><MdText text={inhalt.texte.hybridSystemZukunft} /></span>
                  <h3 className="font-extrabold text-slate-800 text-sm lg:text-base"><MdText text={inhalt.texte.fpdFlexiblePolymermodifizierteDickbeschi} /></h3>
                  <p className="text-xs text-slate-500 leading-normal"><MdText text={inhalt.texte.bitumenfreieFlexibleSchnellErhärtende} /></p>
                  <ul className="text-[11px] text-slate-600 pl-1 list-none space-y-2">
                    <li className="flex items-start gap-1.5 border-t border-slate-100 pt-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.haftungMultifunktionalitätGuteHaftung} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.bauökologieSystemvorteileLösemittelfreiG} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.musterSchichtdickenTrockenschichtdicke} /><span className="font-mono font-bold text-slate-800">≥ 2,0 mm</span><MdText text={inhalt.texte.beiW1EW4} /><span className="font-mono font-bold text-slate-800">≥ 3,0 mm</span><MdText text={inhalt.texte.einzuhaltenUndBauaufsichtlichZu} /></span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-2.5 rounded text-[10px] text-slate-500 italic font-medium leading-tight"><MdText text={inhalt.texte.regelwerkRichtlinieFürDie3} /></div>
              </div>
            </div>

            {/* SYNTHETISCHE & NATÜRLICHE SYSTEME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
                <span className="text-xs font-bold text-blue-700 tracking-wider uppercase block"><MdText text={inhalt.texte.synthetischeBahnenFlüssigkunststoff} /></span>
                <h3 className="font-extrabold text-slate-800 text-sm lg:text-base"><MdText text={inhalt.texte.kunststoffbahnenEpdmFpoPvc} /></h3>
                <p className="text-xs text-slate-500 leading-normal"><MdText text={inhalt.texte.rollenversiegelungenUndDichteHarzanstric} /></p>
                <ul className="list-disc list-inside text-xs text-slate-650 space-y-1.5 pl-1 leading-normal">
                  <li><MdText text={inhalt.texte.epdmFpoKunststoffbahnenEinlagige} /></li>
                  <li><MdText text={inhalt.texte.flüssigkunststoffeFlkPmmaPur} /></li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
                <span className="text-xs font-bold text-amber-800 tracking-wider uppercase block"><MdText text={inhalt.texte.mineralischerBentonitTonmineralien} /></span>
                <h3 className="font-extrabold text-slate-800 text-sm lg:text-base"><MdText text={inhalt.texte.trägergestützteQuelltonAbdichtungssystem} /></h3>
                <p className="text-xs text-slate-500 leading-normal"><MdText text={inhalt.texte.kompletterÖkologischerFeuchteschutzIm} /></p>
                <ul className="list-disc list-inside text-xs text-slate-650 space-y-1.5 pl-1 leading-normal">
                  <li><MdText text={inhalt.texte.bentonitbahnenBrauneWanneRobuste} /></li>
                  <li><MdText text={inhalt.texte.bentonitquellbänderBiegsameDichtbänderZu} /></li>
                </ul>
              </div>
            </div>

            <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 shadow-sm mt-4">
              <h3 className="font-bold text-text-main text-sm mb-3 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-shiraz" /><MdText text={inhalt.texte.bauaufsichtlichePrüfnachweiseLeistungsna} /></h3>
              <p className="text-xs text-text-main/70 mb-4 leading-relaxed"><MdText text={inhalt.texte.daVieleModerneBauwerksabdichtungen} /></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1 mb-1">
                    <FileText size={14} className="text-shiraz" /><MdText text={inhalt.texte.allgemeinesBauaufsichtlichesPrüfzeugnisA} /></span>
                  <p className="text-text-main/70 leading-normal"><MdText text={inhalt.texte.nachweisFürRegelungsbedürftigeBauprodukt} /></p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1 mb-1">
                    <FileText size={14} className="text-shiraz" /><MdText text={inhalt.texte.europäischeTechnischeBewertungEta} /></span>
                  <p className="text-text-main/70 leading-normal"><MdText text={inhalt.texte.wegbereiterFürCeKennzeichnungen} /></p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1 mb-1">
                    <FileText size={14} className="text-shiraz" /><MdText text={inhalt.texte.allgemeineBauaufsichtlicheZulassungAbz} /></span>
                  <p className="text-text-main/70 leading-normal"><MdText text={inhalt.texte.erteiltDurchDasDeutsche} /></p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1 mb-1">
                    <FileText size={14} className="text-shiraz" /><MdText text={inhalt.texte.wtaZertifikateMerkblätter} /></span>
                  <p className="text-text-main/70 leading-normal"><MdText text={inhalt.texte.merkblätterUndZertifizierungenDer} /></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FUGEN (KONSTRUKTION & MATERIAL) */}
        {activeSubTab === 'fugen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 flex items-start gap-3">
              <Info size={18} className="text-shiraz mt-0.5 shrink-0" />
              <div>
                <p className="leading-relaxed"><MdText text={inhalt.texte.fugenUnterteilenGroßeBauteile} /></p>
              </div>
            </div>

            {/* FUGEN-KONSTRUKTIONEN */}
            <div>
              <h3 className="font-extrabold text-sm text-text-main mb-3 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <Hammer size={16} className="text-shiraz" /><MdText text={inhalt.texte.t1FugenartenUndKonstruktive} /></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-home-grau/15 p-4 rounded-xl space-y-2">
                  <span className="text-xs uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">AF</span>
                  <h4 className="font-bold text-text-main text-xs"><MdText text={inhalt.texte.arbeitsfugenBetonierfugen} /></h4>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.schnittstelleZwischenZeitversetztenBeton} /></p>
                  <div className="p-2 bg-stone-50 rounded text-xs text-text-main/60"><MdText text={inhalt.texte.konstruktionAufrauungDerFuge} /></div>
                </div>

                <div className="border border-home-grau/15 p-4 rounded-xl space-y-2">
                  <span className="text-xs uppercase font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">BF / DF</span>
                  <h4 className="font-bold text-text-main text-xs"><MdText text={inhalt.texte.dehnungsBewegungsfugen} /></h4>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.trennenBauteileVollständigUm} /></p>
                  <div className="p-2 bg-stone-50 rounded text-xs text-text-main/60"><MdText text={inhalt.texte.konstruktionVollständigeEntkopplungAusge} /></div>
                </div>

                <div className="border border-home-grau/15 p-4 rounded-xl space-y-2">
                  <span className="text-xs uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">SF</span>
                  <h4 className="font-bold text-text-main text-xs"><MdText text={inhalt.texte.sollrissfugenSchrumpffugen} /></h4>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.querschnittsschwächungenZurGezieltenÖrtl} /></p>
                  <div className="p-2 bg-stone-50 rounded text-xs text-text-main/60"><MdText text={inhalt.texte.konstruktionEingelegteProfilleistenSchwä} /></div>
                </div>
              </div>
            </div>

            {/* FUGEN-MATERIALIEN */}
            <div>
              <h3 className="font-extrabold text-sm text-text-main mb-3 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <Layers size={16} className="text-shiraz" /><MdText text={inhalt.texte.t2FugenabdichtmaterialienEinbauprodukteIm} /></h3>

              <div className="space-y-3">
                <div className="flex flex-col md:flex-row border border-home-grau/15 rounded-xl overflow-hidden text-xs">
                  <div className="md:w-1/4 bg-stone-50 p-4 font-bold text-text-main border-r border-home-grau/10"><MdText text={inhalt.texte.fugenbänderPvcPElastomer} /></div>
                  <div className="md:w-3/4 p-4 space-y-2">
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.klassischeMechanischeAbdichtungFür} /></p>
                    <div className="flex flex-wrap gap-4 text-[10px] text-text-main/50">
                      <span><MdText text={inhalt.texte.materialienWeichpolyvinylchloridPvcP} /></span>
                      <span><MdText text={inhalt.texte.einbauSchweißverbindungAufDer} /></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row border border-home-grau/15 rounded-xl overflow-hidden text-xs">
                  <div className="md:w-1/4 bg-stone-50 p-4 font-bold text-text-main border-r border-home-grau/10">
                    Injektionsschläuche
                  </div>
                  <div className="md:w-3/4 p-4 space-y-2">
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.perforierteMitSpezialGewebe} /></p>
                    <div className="flex flex-wrap gap-4 text-[10px] text-text-main/50">
                      <span><MdText text={inhalt.texte.typEinfachinjektionssystemeOderMehrfach} /></span>
                      <span><MdText text={inhalt.texte.kombianwendungHäufigAlsRedundante} /></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row border border-home-grau/15 rounded-xl overflow-hidden text-xs">
                  <div className="md:w-1/4 bg-stone-50 p-4 font-bold text-text-main border-r border-home-grau/10"><MdText text={inhalt.texte.fugenblecheBeschichtet} /></div>
                  <div className="md:w-3/4 p-4 space-y-2">
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.verzinkteBlechstreifenMitEin} /></p>
                    <div className="flex flex-wrap gap-4 text-[10px] text-text-main/50">
                      <span><MdText text={inhalt.texte.vorteilSchnelleMontageAuf} /></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row border border-home-grau/15 rounded-xl overflow-hidden text-xs">
                  <div className="md:w-1/4 bg-stone-50 p-4 font-bold text-text-main border-r border-home-grau/10"><MdText text={inhalt.texte.quelldichtungenFugendichtstoffe} /></div>
                  <div className="md:w-3/4 p-4 space-y-2">
                    <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.quellbänderProfileAusBentonit} /></p>
                    <div className="flex flex-wrap gap-4 text-[10px] text-text-main/50">
                      <span><MdText text={inhalt.texte.wichtigQuellbänderBenötigenEine} /></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE COMPONENT 1: FUGENBAND PLANER */}
            <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                <Calculator className="text-shiraz" size={18} />
                <h4 className="font-extrabold text-sm text-text-main"><MdText text={inhalt.texte.t3InteraktiverFugenbandPlaner} /></h4>
              </div>
              <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.gebenSieDieBauteilabmessungen} /></p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Inputs */}
                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-3">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Fugenart</span>
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="fbJointType" 
                        checked={fbJointType === 'arbeitsfuge'} 
                        onChange={() => setFbJointType('arbeitsfuge')} 
                        className="accent-shiraz"
                      /><MdText text={inhalt.texte.arbeitsfugeStatisch} /></label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="fbJointType" 
                        checked={fbJointType === 'dehnungsfuge'} 
                        onChange={() => setFbJointType('dehnungsfuge')} 
                        className="accent-shiraz"
                      /><MdText text={inhalt.texte.dehnungsfugeBeweglich} /></label>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-3">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Wasserdruck</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Wassersäule:</span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(fbWaterPressure)} m</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      step="1"
                      value={fbWaterPressure}
                      onChange={(e) => setFbWaterPressure(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                    <div className="text-[10px] text-zinc-400">
                      ({formatDeZahl((fbWaterPressure * 0.1), 1)}<MdText text={inhalt.texte.barHydrostatischerDruck} /></div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-3">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Bauteildicke</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span><MdText text={inhalt.texte.wandSohldickeD} /></span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(fbSlabThickness)} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="60" 
                      step="5"
                      value={fbSlabThickness}
                      onChange={(e) => setFbSlabThickness(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                    <div className="text-[10px] text-zinc-400"><MdText text={inhalt.texte.empfohlenWandMin24} /></div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-3">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Betongrößtkorn</span>
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="fbMaxAggregate" 
                        checked={fbMaxAggregate === 16} 
                        onChange={() => setFbMaxAggregate(16)} 
                        className="accent-shiraz"
                      /><MdText text={inhalt.texte.gk16MmFeiner} /></label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="fbMaxAggregate" 
                        checked={fbMaxAggregate === 32} 
                        onChange={() => setFbMaxAggregate(32)} 
                        className="accent-shiraz"
                      /><MdText text={inhalt.texte.gk32MmStandard} /></label>
                  </div>
                </div>
              </div>

              {/* Fugenband Analysis calculations */}
              {(() => {
                // Erforderliche Breite determinieren nach DIN 18197 / DIN 18533
                // Rechenkern src/calc/bauprodukte.ts: Bandbreite je Wasserdruck und 3 · Größtkorn sind Lehrannahmen;
                // DIN 18197 bemisst über Diagramme aus Wasserdruck und Fugenverformung. Regel d ≥ a für innenliegende Bänder.
                const fb = fugenbandPruefung(fbJointType, fbWaterPressure, fbSlabThickness, fbMaxAggregate);
                const reqWidth = fb.breite;
                const bandDesignation = {
                  A200: inhalt.werte.a200BitumenkompatibelPvc, A240: inhalt.werte.a240PvcP, A320: inhalt.werte.a320PvcP,
                  D240: inhalt.werte.d240PvcP, D320: inhalt.werte.d320StandardPvc, FM400: inhalt.werte.fm400HochelastomerDehnfugenband,
                }[fb.typ];
                const isThicknessOk = fb.dickeOk;
                const minCoverFromGK = fb.minRandCm;
                const actualCoverEdge = fb.randCm;
                const isGkCoverOk = fb.randOk;

                return (
                  <div className="bg-white p-4 border border-zinc-200 rounded-lg space-y-3 text-xs">
                    <h5 className="font-bold text-zinc-800"><MdText text={inhalt.texte.prüfberichtFugenbandEignungNach} /></h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[11px] text-slate-800">
                      <div>
                        <span className="text-zinc-500 block"><MdText text={inhalt.texte.empfohleneMindestbreiteA} /></span>
                        <strong className="text-shiraz text-xs">{formatDeWert(reqWidth)} mm</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block"><MdText text={inhalt.texte.normativeProduktbezeichnung} /></span>
                        <strong className="text-zinc-800 text-xs">{bandDesignation}</strong>
                      </div>
                      <div className="border-t border-zinc-100 pt-1.5">
                        <span className="text-zinc-500 block"><MdText text={inhalt.texte.geforderteMindestdeckendicke} /></span>
                        <span>{formatDeWert(fb.dickeMinCm)}<MdText text={fb.typ === 'D320' || fb.typ === 'A320' ? inhalt.texte.cmSollD320 : inhalt.texte.cmSollDA} /></span>
                      </div>
                      <div className="border-t border-zinc-100 pt-1.5">
                        <span className="text-zinc-500 block"><MdText text={inhalt.texte.mindestRandabstandGrößtkornCheck} /></span>
                        <span>{formatDeZahl(minCoverFromGK, 1)} cm (3 · GK)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className={`p-2.5 rounded border text-[11px] leading-relaxed ${
                        isThicknessOk ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-200'
                      }`}>
                        {isThicknessOk ? (
                          <span><MdText text={inhalt.texte.bauteildickeKonformDieBauteildicke} />{formatDeWert(fbSlabThickness)}<MdText text={inhalt.texte.cmIstAusreichendGroß} />{formatDeWert(reqWidth)}<MdText text={inhalt.texte.mmVollständigBetoniertUnd} /></span>
                        ) : (
                          <span><MdText text={inhalt.texte.bauteilZuDünnDie} />{formatDeWert(fbSlabThickness)}<MdText text={inhalt.texte.cmReichtFürEin} />{formatDeWert(reqWidth)}<MdText text={inhalt.texte.mmBreitesFugenbandNicht} />{formatDeWert(fb.dickeMinCm)}<MdText text={inhalt.texte.cmDickeEinplanen} /></span>
                        )}
                      </div>

                      <div className={`p-2.5 rounded border text-[11px] leading-relaxed ${
                        isGkCoverOk ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {isGkCoverOk ? (
                          <span><MdText text={inhalt.texte.kornverkrallungGesichertRandabstandVon} />{formatDeZahl(actualCoverEdge, 1)}<MdText text={inhalt.texte.cmBietetGenügendFließraum} />{fbMaxAggregate}<MdText text={inhalt.texte.mmMinErforderlich} />{formatDeZahl(minCoverFromGK, 1)} cm).</span>
                        ) : (
                          <span><MdText text={inhalt.texte.engerEinbauraumDerFreiraum} />{fbMaxAggregate}<MdText text={inhalt.texte.mmKleineresGrößtkornWählen} /></span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* INTERACTIVE COMPONENT 2: INJEKTIONSSCHLAUCH PLANER */}
            <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                <Calculator className="text-shiraz" size={18} />
                <h4 className="font-extrabold text-sm text-text-main"><MdText text={inhalt.texte.t4InteraktiverInjektionsschlauchPlanungsp} /></h4>
              </div>
              <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.prüfenSieDieMachbarkeit} /></p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-2">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Schlauchkreislänge</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Länge:</span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(isLength)} m</span>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max="15" 
                      step="1"
                      value={isLength}
                      onChange={(e) => setIsLength(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                    <div className="text-[10px] text-zinc-400"><MdText text={inhalt.texte.standardrolleTypisch10M} /></div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-2">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Betonüberdeckung</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span><MdText text={inhalt.texte.abstandZumRand} /></span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(isConCover)} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="20" 
                      step="1"
                      value={isConCover}
                      onChange={(e) => setIsConCover(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                    <div className="text-[10px] text-zinc-400"><MdText text={inhalt.texte.wuRlFordertMin} /></div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-2">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Befestigungs-Abstand</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Clip-Intervall:</span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(isFasteningInterval)} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="30" 
                      step="2"
                      value={isFasteningInterval}
                      onChange={(e) => setIsFasteningInterval(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                    <div className="text-[10px] text-zinc-400"><MdText text={inhalt.texte.maxAbstandZurLagestabilität} /></div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-2">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Injektionsmedium</span>
                  <select aria-label="Injektionsmedium" 
                    value={isMedium}
                    onChange={(e) => setIsMedium(e.target.value as typeof isMedium)}
                    className="w-full text-xs p-1.5 border rounded-md mt-1 focus:outline-none focus:ring-1 focus:ring-shiraz"
                  >
                    <option value="acrylgel">Acrylatgel (re-injizierbar)</option>
                    <option value="pur_harz">PU-Injektionsharz (elastisch)</option>
                    <option value="ep_harz">Epoxidharz (starr/kraftschlüssig)</option>
                  </select>
                </div>
              </div>

              {/* Injektionsschlauch computation & analytical outputs */}
              {(() => {
                const isLengthOk = isLength <= 10;
                const isCoverOk = isConCover >= 8;
                const isFasteningOk = isFasteningInterval <= 15;

                let mediumDesc = '';
                if (isMedium === 'acrylgel') {
                  mediumDesc = inhalt.werte.acrylatgelHatEineSehr;
                } else if (isMedium === 'pur_harz') {
                  mediumDesc = inhalt.werte.polyurethanPurReagiertZäh;
                } else {
                  mediumDesc = inhalt.werte.epoxidharzEpHärtetVollkommen;
                }

                return (
                  <div className="bg-white p-4 border border-zinc-200 rounded-lg space-y-3 text-xs">
                    <h5 className="font-bold text-zinc-800"><MdText text={inhalt.texte.evaluierungDesInjektionssystems} /></h5>
                    
                    <div className="space-y-2">
                      {/* Check 1: Länge */}
                      <div className="flex items-start gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isLengthOk ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                          {isLengthOk ? 'KONFORM' : 'PROB-LÄNGE'}
                        </span>
                        <div className="text-[11px]">
                          <strong><MdText text={inhalt.texte.schlauchlänge} />{formatDeWert(isLength)} m):</strong>{' '}
                          {isLengthOk ? (
                            <span className="text-slate-600"><MdText text={inhalt.texte.sichererVerpressbarerKreislaufDer} /></span>
                          ) : (
                            <span className="text-red-800"><MdText text={inhalt.texte.kritischLangeSchlauchabschnitteLehrannah} /></span>
                          )}
                        </div>
                      </div>

                      {/* Check 2: Betonüberdeckung */}
                      <div className="flex items-start gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isCoverOk ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                          {isCoverOk ? 'KONFORM' : 'ABSPRENGGEFAHR'}
                        </span>
                        <div className="text-[11px]">
                          <strong><MdText text={inhalt.texte.betonüberdeckung} />{formatDeWert(isConCover)} cm):</strong>{' '}
                          {isCoverOk ? (
                            <span className="text-slate-600"><MdText text={inhalt.texte.sichererTiefenhaltKeineBeschädigung} /></span>
                          ) : (
                            <span className="text-red-800"><MdText text={inhalt.texte.achtungAusbrücheBeiGeringer} />{formatDeWert(isConCover)}<MdText text={inhalt.texte.cmKannDerInjektionsdruck} /></span>
                          )}
                        </div>
                      </div>

                      {/* Check 3: Clips */}
                      <div className="flex items-start gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isFasteningOk ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-700'}`}>
                          {isFasteningOk ? 'STABIL' : 'LAGEMANGEL'}
                        </span>
                        <div className="text-[11px]">
                          <strong><MdText text={inhalt.texte.montageabstand} />{formatDeWert(isFasteningInterval)} cm):</strong>{' '}
                          {isFasteningOk ? (
                            <span className="text-slate-600"><MdText text={inhalt.texte.derSchlauchFließtUnd} /></span>
                          ) : (
                            <span className="text-amber-800"><MdText text={inhalt.texte.ungesicherteLageDurchWeite} /></span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 p-2.5 bg-indigo-50/50 rounded text-[11px] text-indigo-950 leading-relaxed font-sans border border-indigo-100"><MdText text={inhalt.texte.wirkungsweiseDesInjektionsmediums} />{mediumDesc}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* PRAXIS-WARNUNG */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-2 text-xs">
              <ShieldAlert className="text-red-700 mt-0.5 shrink-0" size={16} />
              <div>
                <strong className="text-red-950 font-bold block"><MdText text={inhalt.texte.fehlerrisikoFugenbänder} /></strong>
                <p className="text-red-900 leading-relaxed mt-0.5"><MdText text={inhalt.texte.fugenbänderNeigenBeimBetoneinbau} /></p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: RISSE & VERPRESSUNGEN */}
        {activeSubTab === 'risse' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 flex items-start gap-3">
              <Droplet size={18} className="text-shiraz mt-0.5 shrink-0" />
              <div>
                <p className="leading-relaxed"><MdText text={inhalt.texte.risseImStahlbetonSind} /></p>
              </div>
            </div>

            {/* RISSMERKMALE & ANALYSE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-home-grau/15 p-4 rounded-xl space-y-3">
                <h4 className="font-bold text-text-main text-sm lg:text-base border-b border-home-grau/10 pb-1.5 flex items-center gap-1">
                  <Activity size={14} className="text-shiraz" /><MdText text={inhalt.texte.risseigenschaftenFürDieInjektionsauswahl} /></h4>
                <div className="space-y-2 text-sm text-text-main/70">
                  <p><MdText text={inhalt.texte.bevorEinVerpressstoffGewählt} /></p>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li><MdText text={inhalt.texte.feuchtigkeitszustandTrockenFeuchtWasserf} /></li>
                    <li><MdText text={inhalt.texte.zweckDerMaßnahmeDehnfähiges} /></li>
                    <li><MdText text={inhalt.texte.rissbreitenschwankungDynamischBeanspruch} /></li>
                  </ul>
                </div>
              </div>

              <div className="border border-home-grau/15 p-4 rounded-xl space-y-3">
                <h4 className="font-bold text-text-main text-sm lg:text-base border-b border-home-grau/10 pb-1.5 flex items-center gap-1">
                  <Wrench size={14} className="text-shiraz" /> Einbau-Packertechnik
                </h4>
                <div className="space-y-2 text-sm text-text-main/70">
                  <p><MdText text={inhalt.texte.packerLeitenDieInjektionsflüssigkeit} /></p>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li><MdText text={inhalt.texte.bohrpackerSchraubpackerSchrägVersetzt} /></li>
                    <li><MdText text={inhalt.texte.klebepackerOberflächenpackerWerdenDirekt} /></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* INJEKTIONSSTOFFE IM DETAILED VERGLEICH */}
            <div>
              <h3 className="font-extrabold text-sm text-text-main mb-3"><MdText text={inhalt.texte.die4KernInjektionsstoffe} /></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                <div className="bg-red-50/25 border border-red-200/50 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-red-700 bg-red-50 px-1.5 py-0.5 rounded tracking-wider">KRAFTSCHLÜSSIG</span>
                    <h5 className="font-extrabold text-text-main text-xs mt-1"><MdText text={inhalt.texte.epoxidharzeEp} /></h5>
                    <p className="text-[11px] text-text-main/60 leading-normal"><MdText text={inhalt.texte.hoheHaftfestigkeitAufTrockenen} /></p>
                  </div>
                  <div className="bg-white/80 p-2 rounded text-[10px] text-text-main/50 font-bold border border-home-grau/10"><MdText text={inhalt.texte.anwendungTrockenFeuchtTragwerksstabilisi} /></div>
                </div>

                <div className="bg-emerald-50/25 border border-emerald-200/50 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded tracking-wider"><MdText text={inhalt.texte.elastischDichtend} /></span>
                    <h5 className="font-extrabold text-text-main text-xs mt-1"><MdText text={inhalt.texte.polyurethanharzePur} /></h5>
                    <p className="text-[11px] text-text-main/60 leading-normal"><MdText text={inhalt.texte.elastischesHarzFürDehnfähiges} /></p>
                  </div>
                  <div className="bg-white/80 p-2 rounded text-[10px] text-text-main/50 font-bold border border-home-grau/10"><MdText text={inhalt.texte.anwendungWasserführendeRisseRisse} /></div>
                </div>

                <div className="bg-amber-50/25 border border-amber-200/50 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded tracking-wider"><MdText text={inhalt.texte.mineralischFüllend} /></span>
                    <h5 className="font-extrabold text-text-main text-xs mt-1"><MdText text={inhalt.texte.zementsuspensionenZs} /></h5>
                    <p className="text-[11px] text-text-main/60 leading-normal"><MdText text={inhalt.texte.feinstzementleimZurMineralischenAuffüllu} /></p>
                  </div>
                  <div className="bg-white/80 p-2 rounded text-[10px] text-text-main/50 font-bold border border-home-grau/10"><MdText text={inhalt.texte.anwendungHohlraumverfüllungDenkmalpflege} /></div>
                </div>

                <div className="bg-blue-50/25 border border-blue-200/50 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded tracking-wider"><MdText text={inhalt.texte.gelbildungExtern} /></span>
                    <h5 className="font-extrabold text-text-main text-xs mt-1"><MdText text={inhalt.texte.acrylatgeleAy} /></h5>
                    <p className="text-[11px] text-text-main/60 leading-normal"><MdText text={inhalt.texte.wasserquellfähigeGeleMitExtrem} /></p>
                  </div>
                  <div className="bg-white/80 p-2 rounded text-[10px] text-text-main/50 font-bold border border-home-grau/10"><MdText text={inhalt.texte.anwendungSchleierinjektionenErdseitigKel} /></div>
                </div>

              </div>
            </div>

            {/* GRAPHICAL STEP-BY-STEP DIALOGUE FOR THE SITE ENGINEER */}
            <div className="bg-stone-50 border border-home-grau/25 p-5 rounded-2xl space-y-3">
              <h4 className="font-bold text-xs text-text-main flex items-center gap-1.5">
                <Wrench className="text-shiraz" size={16} /><MdText text={inhalt.texte.ablaufDerAkutInjektion} /></h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] leading-relaxed">
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <strong className="block font-bold text-shiraz text-xs mb-1"><MdText text={inhalt.texte.t1Rissvorbereitung} /></strong><MdText text={inhalt.texte.rissverlaufReinigenLockereSchichten} /></div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <strong className="block font-bold text-shiraz text-xs mb-1"><MdText text={inhalt.texte.t2PackerSetzen} /></strong><MdText text={inhalt.texte.bohrstaubGründlichAusblasenSonst} /></div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <strong className="block font-bold text-shiraz text-xs mb-1"><MdText text={inhalt.texte.t3VordichtungPurSchaum} /></strong><MdText text={inhalt.texte.beiStarkemWasseraustrittVorinjizieren} /></div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <strong className="block font-bold text-shiraz text-xs mb-1"><MdText text={inhalt.texte.t4HauptinjektionDauerhaft} /></strong><MdText text={inhalt.texte.dauerhaftElastisches2kPolyurethanharz} /></div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PLANUNGSBERATER & SYSTEME */}
        {activeSubTab === 'berater' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300 font-sans">
            <div className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 flex items-start gap-3">
              <Calculator size={18} className="text-shiraz mt-0.5 shrink-0" />
              <div>
                <p className="leading-relaxed"><MdText text={inhalt.texte.interaktiverDin18533Planungsberater} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Questionnaires (5 columns) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Section 1: Water Load Situations */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
                  <h4 className="font-bold text-text-main text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-home-grau/10 pb-2">
                    <Droplet size={14} className="text-shiraz text-blue-500" /><MdText text={inhalt.texte.t1WasserverhältnisseBaugrund} /></h4>
                  <p className="text-[11px] text-text-main/60 leading-normal font-medium"><MdText text={inhalt.texte.welcheGeohydrologischenGewässerOder} /></p>
                  
                  <AuswahlGruppe label="Wasserverhältnisse" className="space-y-2 pt-1">
                    {inhalt.daten.BpAbdichtung.map((opt) => (
                      <button {...alsOption(waterLoad === opt.id)}
                        key={opt.id}
                        type="button"
                        onClick={() => setWaterLoad(opt.id)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all relative flex flex-col cursor-pointer ${
                          waterLoad === opt.id
                            ? 'bg-shiraz/5 border-shiraz text-text-main ring-1 ring-shiraz font-semibold shadow-sm'
                            : 'bg-white border-home-grau/25 text-text-main/80 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{opt.label}</span>
                          {waterLoad === opt.id && <Check size={12} className="text-shiraz shrink-0" />}
                        </div>
                        <span className="text-[10px] text-text-main/60 mt-0.5 leading-normal font-normal">{opt.detail}</span>
                      </button>
                    ))}
                  </AuswahlGruppe>
                </div>

                {/* Section 2: Room Requirements */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
                  <h4 className="font-bold text-text-main text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-home-grau/10 pb-2">
                    <LayoutGrid size={14} className="text-shiraz" /><MdText text={inhalt.texte.t2RaumnutzungAnforderungsklasse} /></h4>
                  <p className="text-[11px] text-text-main/60 leading-normal font-medium"><MdText text={inhalt.texte.welcherGradAnFeuchtetoleranz} /></p>
                  
                  <AuswahlGruppe label="Raumnutzung" className="space-y-2 pt-1">
                    {inhalt.daten.BpAbdichtung_2.map((opt) => (
                      <button {...alsOption(roomRequirement === opt.id)}
                        key={opt.id}
                        type="button"
                        onClick={() => setRoomRequirement(opt.id)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all relative flex flex-col cursor-pointer ${
                          roomRequirement === opt.id
                            ? 'bg-shiraz/5 border-shiraz text-text-main ring-1 ring-shiraz font-semibold shadow-sm'
                            : 'bg-white border-home-grau/25 text-text-main/80 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{opt.label}</span>
                          {roomRequirement === opt.id && <Check size={12} className="text-shiraz shrink-0" />}
                        </div>
                        <span className="text-[10px] text-text-main/60 mt-0.5 leading-normal font-normal">{opt.detail}</span>
                      </button>
                    ))}
                  </AuswahlGruppe>
                </div>

              </div>

              {/* Recommendation output (7 columns) */}
              <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-5">
                
                {/* Title block */}
                <div className="border-b border-home-grau/20 pb-4">
                  <span className="text-[10px] font-extrabold uppercase text-shiraz bg-shiraz/10 px-2 py-0.5 rounded tracking-wide inline-block mb-2"><MdText text={inhalt.texte.berechneteSystemempfehlungNachDin} /></span>
                  <h3 className="font-extrabold text-text-main text-lg leading-snug">
                    {(() => {
                      const res = getAdvisorRecommendation();
                      return res.systemTitle;
                    })()}
                  </h3>
                  <p className="text-xs text-text-main/70 mt-2 leading-relaxed">
                    {(() => {
                      const res = getAdvisorRecommendation();
                      return res.systemDesc;
                    })()}
                  </p>
                </div>

                {/* Normative classification badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-text-main/50 uppercase tracking-widest">Wasserbeanspruchungsklasse</span>
                      <span className="text-base font-black text-shiraz mt-1 block">
                        {(() => {
                          const res = getAdvisorRecommendation();
                          return res.waterClass;
                        })()}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-main/60 mt-1.5 leading-normal block">
                      {(() => {
                        const res = getAdvisorRecommendation();
                        return res.waterDesc;
                      })()}
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-text-main/50 uppercase tracking-widest"><MdText text={inhalt.texte.bauaufsichtlicheEinstufung} /></span>
                      <span className="text-sm font-black text-slate-800 block mt-1">
                        {roomRequirement === 'hochwertig' ? inhalt.werte.hochwertigKlasseA : roomRequirement === 'standard' ? inhalt.werte.standardKlasseB : inhalt.werte.einfachKlasseC}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-main/60 leading-relaxed mt-1.5 block">
                      {roomRequirement === 'hochwertig' 
                        ? inhalt.werte.feuchtstellenAufInnenflächenVertraglich 
                        : roomRequirement === 'standard' 
                          ? inhalt.werte.dunkleVerfärbungenAufWänden 
                          : inhalt.werte.lokaleTropfenbildungenUndFeuchte}
                    </span>
                  </div>
                </div>

                {/* Target Products */}
                <div>
                  <h4 className="font-extrabold text-xs text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-home-grau/10 pb-1">
                    <Layers size={14} className="text-shiraz" /><MdText text={inhalt.texte.zugelasseneSystemBauprodukteHerstellerne} /></h4>
                  <ul className="space-y-2 text-xs text-text-main/70">
                    {(() => {
                      const res = getAdvisorRecommendation();
                      return res.products.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 bg-stone-50/50 p-2.5 rounded border border-home-grau/10">
                          <Check size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ));
                    })()}
                  </ul>
                </div>

                {/* Technical Specifications */}
                <div>
                  <h4 className="font-extrabold text-xs text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-home-grau/10 pb-1">
                    <Wrench size={14} className="text-shiraz" /><MdText text={inhalt.texte.sollDimensionierungEinbaurichtlinien} /></h4>
                  <div className="bg-stone-50 border border-home-grau/15 rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-home-grau/15 bg-white">
                          <th className="p-2 font-bold text-text-main w-2/5"><MdText text={inhalt.texte.vorgeschriebenerParameter} /></th>
                          <th className="p-2 font-bold text-text-main w-3/5"><MdText text={inhalt.texte.technischeMindestanforderungWert} /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const res = getAdvisorRecommendation();
                          return res.techSpecs.map((spec, i) => (
                            <tr key={i} className="border-b border-home-grau/10 last:border-0 hover:bg-stone-100/50 bg-white/50">
                              <td className="p-2 text-text-main/80 font-bold">{spec.label}</td>
                              <td className="p-2 text-text-main/70">{spec.value}</td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Technical Standards references */}
                <div>
                  <h4 className="font-extrabold text-xs text-text-main uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <FileText size={14} className="text-shiraz" /><MdText text={inhalt.texte.konformitätAnwendbaresBaurecht} /></h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-text-main/60 pl-1 leading-normal">
                    {(() => {
                      const res = getAdvisorRecommendation();
                      return res.guidelines.map((g, i) => (
                        <li key={i}>{g}</li>
                      ));
                    })()}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        )}
            </ModuleTabs>
        </>
      ) : activeTab === 'praxis' ? (
        <PraxisTabContent moduleKey="bp_abdichtung" />
      ) : (
        <InnovationTabContent moduleKey="bp_abdichtung" />
      )}
        </ModuleTabs>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielNassschichtdickeEinerP}
          zielGleichung="d_{wet} = \frac{d_{dry}}{1 - V_{fl}/100}"
          normQuelle={inhalt.werte.din185333Mindesttrockenschichtdicke}
          schritte={inhalt.daten["BpAbdichtung.schritte"]}
          ergebnisHinweis={inhalt.werte.rund6MmNass}
        />
      </div>

      <ModulTest moduleId="bp_abdichtung" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Bauwerksabdichtung', url: 'https://de.wikipedia.org/wiki/Bauwerksabdichtung' },
          { title: 'Weiße Wanne', url: 'https://de.wikipedia.org/wiki/Wei%C3%9Fe_Wanne' }
        ]} 
        literatur={inhalt.daten["BpAbdichtung.literatur"]} 
        regelwerke={inhalt.daten["BpAbdichtung.regelwerke"]} 
        formeln={inhalt.daten["BpAbdichtung.formeln"]} 
      />
    </div>
  );
}
