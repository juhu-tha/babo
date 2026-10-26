import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  History, 
  Sparkles, 
  Layers, 
  Activity, 
  Compass, 
  Wind,
  Droplet,
  Dumbbell,
  Waves,
  Mountain,
  Anchor,
  BookOpen
} from 'lucide-react';
import inhalt from '@/content/kuriositaeten/Kuriositaeten.json';
import { MdText } from '@/src/components/inhalt/MdText';

type KurioReiter = 'pantheon' | 'burjkhalifa' | 'eiffel' | 'olympia' | 'uhpc' | 'selfhealing' | 'reinforcement' | 'giantconcrete' | 'gotthard' | 'seawater';

// Reiter (AP 3.8): 4 thematische Hauptbereiche statt 10 Einzelreitern; die Bauwerke bilden die zweite Ebene
const GRUPPEN: readonly ModulTabGruppe<KurioReiter>[] = [
  { id: 'antike_g', label: inhalt.werte.antikeBetone, icon: Compass, mitglieder: [
    { id: 'pantheon', label: 'Pantheon-Kuppel', icon: Compass },
    { id: 'selfhealing', label: inhalt.werte.römischeRissheilung, icon: Activity },
    { id: 'seawater', label: inhalt.werte.seekaisAntik, icon: Anchor },
  ] },
  { id: 'stahl_g', label: inhalt.werte.stahlSeileVerbund, icon: Layers, mitglieder: [
    { id: 'eiffel', label: 'Eiffelturm-Stahl', icon: Layers },
    { id: 'reinforcement', label: inhalt.werte.verbundMonier, icon: Dumbbell },
    { id: 'olympia', label: inhalt.werte.olympiadachSeilnetz, icon: Wind },
  ] },
  { id: 'hochleistung_g', label: 'Hochleistungsbeton', icon: Sparkles, mitglieder: [
    { id: 'burjkhalifa', label: inhalt.werte.burjKhalifaRheologie, icon: Droplet },
    { id: 'uhpc', label: 'UHPC-Gefüge', icon: Sparkles },
  ] },
  { id: 'gross_g', label: inhalt.werte.massenTunnelbeton, icon: Mountain, mitglieder: [
    { id: 'giantconcrete', label: inhalt.werte.massenbetonTalsperre, icon: Waves },
    { id: 'gotthard', label: inhalt.werte.gotthardSpritzbeton, icon: Mountain },
  ] },
];

export default function Kuriositaeten() {
  const [activeCurioTab, setActiveCurioTab] = useState<KurioReiter>('pantheon');

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* HEADER WITH INTRO */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm" id="curio-header">
        <div className="flex items-center gap-3 mb-3">
          <History className="text-shiraz" size={28} />
          <h2 className="text-2xl font-sans font-bold tracking-tight text-slate-900"><MdText text={inhalt.texte.bautechnischeMeilensteineHistorischeWerk} /></h2>
        </div>
        <p className="text-sm text-slate-650 leading-relaxed max-w-4xl"><MdText text={inhalt.texte.wissenschaftlicheAufbereitungBaustofflic} /></p>
      </div>

      {/* NAVIGATION FOR REKORDE / KURIOSITÄTEN (AP 3.8: 4 Bereiche, Bauwerke als zweite Ebene) */}
      <GruppierteModuleTabs
        label={inhalt.werte.meilensteineBereiche}
        gruppen={GRUPPEN}
        aktiv={activeCurioTab}
        onWechsel={setActiveCurioTab}
        className="[&>[role=tablist]]:bg-white [&>[role=tablist]]:p-4 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:shadow-sm [&>[role=tablist]]:border [&>[role=tablist]]:border-slate-200"
      >
      {/* CORE CONTENT LAYOUTS WITHOUT CALCULATORS */}
      <div className="mt-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[450px]" id="curio-content">
        
        {/* 1. PANTHEON ROM */}
        {activeCurioTab === 'pantheon' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🏛️</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900"><MdText text={inhalt.texte.tragwerksanalyseDesKuppeltragwerksAus} /></h3>
                <p className="text-xs text-slate-550 font-mono"><MdText text={inhalt.texte.errichtungszeitraumCa118128} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p><MdText text={inhalt.texte.dasPantheonBesitztDie} /></p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2"><MdText text={inhalt.texte.werkstofftechnischeMaßnahmeDensitätsgrad} /></h4>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.dieZusammensetzungDesRömischen} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><MdText text={inhalt.texte.dichteStufenDerHistorischen} /></p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-650 font-mono text-[11px]">
                    <li><MdText text={inhalt.texte.kuppelbasisTravertinBasaltRohwichte} /></li>
                    <li><MdText text={inhalt.texte.mittlereRingsegmenteZiegelbruchTuffstein} /></li>
                    <li><MdText text={inhalt.texte.kuppelkroneOculushöheBimssteinVulkanisch} /></li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.rechnerischeAbschätzungDerEigenlastentla} /></span>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.lehrmodellMitVereinfachtenAnnahmen} /></p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold"><MdText text={inhalt.texte.t1RefModellHomogene} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.angenommenesKuppelvolumenV4} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.referenzdichteBasaltbeton2400} /></div>
                    <div className="text-slate-800 font-bold"><MdText text={inhalt.texte.gesamteigenlastGV10} /></div>
                    <div className="text-red-650 text-[11px] leading-tight mt-1"><MdText text={inhalt.texte.mechanischerHintergrundInEiner} /></div>

                    <div className="border-t border-slate-200 my-2 pt-2 text-emerald-800 font-bold"><MdText text={inhalt.texte.t2IstModellUniforme} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.volumenanteiligeMassenberechnung} /></div>
                    <ul className="list-disc pl-4 text-slate-600 text-[11px]">
                      <li><MdText text={inhalt.texte.unteresDrittel1500} /></li>
                      <li><MdText text={inhalt.texte.mittleresDrittel1500} /></li>
                      <li><MdText text={inhalt.texte.oberesSegment1500} /></li>
                    </ul>
                    <div className="text-slate-850 font-bold"><MdText text={inhalt.texte.effektiveStrukturmasseGReal} /></div>
                    <div className="text-emerald-700 font-bold block text-[11px] mt-1"><MdText text={inhalt.texte.resultierendeMassereduktion} />{formatDeZahl(((10800 - 7425) / 10800 * 100), 1)}<MdText text={inhalt.texte.t3375TEntlastung} /></div>
                  </div>
                  <p className="text-xs text-slate-650 italic"><MdText text={inhalt.texte.dieKuppelWeistTatsächlich} /></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. BURJ KHALIFA */}
        {activeCurioTab === 'burjkhalifa' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🏢</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900"><MdText text={inhalt.texte.rheologischeOptimierungZurHochdruck} /></h3>
                <p className="text-xs text-slate-550 font-mono"><MdText text={inhalt.texte.pumprekord2008VertikaleFörderhöhe} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p><MdText text={inhalt.texte.dieVertikaleBetonförderungBeim} /></p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2"><MdText text={inhalt.texte.problemstellungStrömungsreibungHydratati} /></h4>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.beiSignifikantenSteighöhenAkkumulieren} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><MdText text={inhalt.texte.eingesetzteVerfahrensUndWerkstofftechnol} /></p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-650 [list-style-type:square]">
                    <li><MdText text={inhalt.texte.thermodynamischeSteuerungMittelsSchuppen} /></li>
                    <li><MdText text={inhalt.texte.fließmitteloptimierungPolycarboxylatethe} /></li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.ermittlungDesArbeitsförderdrucksAm} /></span>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.lehrrechnungDerReibungsbeiwertIst} /></p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold"><MdText text={inhalt.texte.rechnerischeDruckprojektionH606} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.förderhöheH606M} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.beschleunigungskonstanteG981} /></div>
                    <div className="text-slate-700 font-bold"><MdText text={inhalt.texte.t1HydrostatischerDruckanteilP} /></div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3"><MdText text={inhalt.texte.pHydroGH} /></div>
                    <div className="text-slate-700 font-bold mt-2"><MdText text={inhalt.texte.t2HydrodynamischerReibungsdruckverlustP} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.angenommenerSpezifischerReibungsverlustI} /></div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3"><MdText text={inhalt.texte.pReibung606M} /></div>
                    <div className="text-slate-700 font-bold mt-2"><MdText text={inhalt.texte.t3ErforderlicherArbeitsbetriebsdruckAn} /></div>
                    <div className="text-slate-900 font-bold text-sm text-[13px]"><MdText text={inhalt.texte.pGesamtPHydro} /></div>
                  </div>
                  <p className="text-xs text-slate-650 italic leading-snug"><MdText text={inhalt.texte.drückeDieserGrößenordnungErfordern} /></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. EIFFELTURM */}
        {activeCurioTab === 'eiffel' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🗼</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900"><MdText text={inhalt.texte.gefügeanalyseUndKorrosionsverhaltenVon} /></h3>
                <p className="text-xs text-slate-550 font-mono"><MdText text={inhalt.texte.errichtung1889KonstruktionswerkstoffPudd} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p><MdText text={inhalt.texte.obwohlDieTragkonstruktionDes} /></p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2"><MdText text={inhalt.texte.einflußSilikatischerPhaseneinschlüsseAuf} /></h4>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.beimHeuteWeitgehendDurch} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><MdText text={inhalt.texte.mechanismusDerElektrochemischenKorrosion} /></p>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans"><MdText text={inhalt.texte.eindringendeOxidationsfrontenSauerstoffU} /></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.masserechnerischeAbschätzungDesKorrosion} /></span>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.vergleichendeAnalyseDesTheoretischen} /></p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold"><MdText text={inhalt.texte.theoretischerMassenverlustUngeschützt} /></div>
                    <div className="text-slate-650"><MdText text={inhalt.texte.eisenfachwerkmasseM07} /></div>
                    <div className="text-slate-650"><MdText text={inhalt.texte.exponierteAußenflächeAExp} /></div>
                    <div className="text-slate-650"><MdText text={inhalt.texte.abtragsrateUnlegierterStahlKategorie} /></div>
                    
                    <div className="text-slate-700 font-bold border-t pt-2"><MdText text={inhalt.texte.schadensausmaßNach135Jahren} /></div>
                    <div className="text-red-650 leading-snug"><MdText text={inhalt.texte.lineareHochrechnungAlsObere} /></div>

                    <div className="text-emerald-800 font-bold border-t pt-2"><MdText text={inhalt.texte.einflussZyklischerOberflächenbeschichtun} /></div>
                    <div className="text-slate-650 leading-snug"><MdText text={inhalt.texte.derAnstrichWirdEtwa} /></div>
                    <div className="text-emerald-700 font-bold text-[11px] leading-tight mt-1"><MdText text={inhalt.texte.fazitRegelmäßigeInstandhaltungDes} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. OLYMPIASTADION */}
        {activeCurioTab === 'olympia' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🎪</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900"><MdText text={inhalt.texte.tragwerksverhaltenUndFormfindungWeitgesp} /></h3>
                <p className="text-xs text-slate-550 font-mono"><MdText text={inhalt.texte.baujahr1972EntwurfBehnisch} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p><MdText text={inhalt.texte.dasZeltdachDesOlympiastadions} /></p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2"><MdText text={inhalt.texte.numerischeFormfindungMittelsSeifenhaut} /></h4>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.dieBestimmungDerGeometrischen} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><MdText text={inhalt.texte.tragprinzipDerAntiklasticitätSattelkrümm} /></p>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans"><MdText text={inhalt.texte.derRäumlicheVerlaufTeilt} /></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.rechnerischeAbschätzungDerAerodynamische} /></span>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.zurBeurteilungDesGlobalen} /></p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold"><MdText text={inhalt.texte.aerodynamischesLastmodell} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.strömungsgeschwindigkeitV120Km} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.luftdichteLuft125} /></div>
                    <div className="text-slate-700 font-bold mt-2"><MdText text={inhalt.texte.t1GeschwindigkeitsdruckQGemäß} /></div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]"><MdText text={inhalt.texte.q05Luft} /></div>
                    <div className="text-slate-750 font-bold mt-2"><MdText text={inhalt.texte.t2EinwirkendeLinienlastF} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.lehrrechnungMitAngenommenerEinflussbreit} /></div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]"><MdText text={inhalt.texte.fSogQL} /></div>
                  </div>
                  <p className="text-xs text-slate-650 italic leading-snug"><MdText text={inhalt.texte.dieVorspannungDesSeilnetzes} /></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. ULTRA-HOCHFESTER BETON (UHPC) */}
        {activeCurioTab === 'uhpc' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🧪</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900"><MdText text={inhalt.texte.gefügeEngineeringUndTragmechanismen} /></h3>
                <p className="text-xs text-slate-550 font-mono"><MdText text={inhalt.texte.technologischerEntwicklungsstandDruckfes} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p><MdText text={inhalt.texte.gewöhnlicherNormalbetonWeistCharakterist} /></p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2"><MdText text={inhalt.texte.physikalischeFüllwirkungPuzzolanischeAkt} /></h4>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.dasPrimäreWirkprinzipVon} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><MdText text={inhalt.texte.rissüberbrückungsverhaltenMittelsMikrost} /></p>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans"><MdText text={inhalt.texte.daUhpcInfolgeDes} /></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.komparativeStatischeQuerschnittsbemessun} /></span>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.vereinfachterLehrvergleichNurBetonquersc} /></p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold"><MdText text={inhalt.texte.t1RefModellCo} /></div>
                    <div className="text-slate-650"><MdText text={inhalt.texte.bemessungswertFCd0} /></div>
                    <div className="text-slate-650"><MdText text={inhalt.texte.erforderlicheGeometrischeQuerschnittsflä} /></div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]"><MdText text={inhalt.texte.aNEdF} /></div>
                    <div className="text-slate-800 font-bold"><MdText text={inhalt.texte.erforderlicherKreisdurchmesserD0} /></div>

                    <div className="text-emerald-800 font-bold border-t pt-2"><MdText text={inhalt.texte.t2VergleichUhpcF} /></div>
                    <div className="text-slate-650"><MdText text={inhalt.texte.bemessungswertFCd02} /></div>
                    <div className="text-slate-650"><MdText text={inhalt.texte.erforderlicheGeometrischeQuerschnittsflä2} /></div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]"><MdText text={inhalt.texte.aUhpc5000} /></div>
                    <div className="text-emerald-700 font-bold"><MdText text={inhalt.texte.erforderlicherKreisdurchmesserDUhpc} /></div>
                  </div>
                  <p className="text-xs text-slate-650 italic"><MdText text={inhalt.texte.dieErforderlicheQuerschnittsflächeSinkt} /></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. RÖMISCHER SELBSTHEILUNGSBETON */}
        {activeCurioTab === 'selfhealing' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🐚</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900"><MdText text={inhalt.texte.kristallineReaktivitätUndAutogene} /></h3>
                <p className="text-xs text-slate-550 font-mono"><MdText text={inhalt.texte.mineralogischerBefundReaktionsaktivatorU} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p><MdText text={inhalt.texte.dasUnbewehrteOpusCaementicium} /></p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2"><MdText text={inhalt.texte.verfahrenstechnischesPrinzipDesHeißmisch} /></h4>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.dieEntstehungDieserReaktiven} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><MdText text={inhalt.texte.mehrstufigeReaktiveVerschlusskinematik} /></p>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans"><MdText text={inhalt.texte.beiMikroskopischenGefügerissenWird} /></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.stöchiometrischeReaktionsmechanik} /></span>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.formelmäßigeDarstellungDerHydratphasenge} /></p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-3 font-mono text-xs">
                    <div className="text-shiraz font-bold"><MdText text={inhalt.texte.reaktionskinetikCaoPuffer} /></div>
                    <div>
                      <span className="text-slate-700 font-bold block"><MdText text={inhalt.texte.t1AuflösungsphaseAmFeuchten} /></span>
                      <code className="text-[11px] block bg-slate-50 p-1 border rounded text-slate-800 my-1"><MdText text={inhalt.texte.caoH2oCa} /></code>
                    </div>
                    <div>
                      <span className="text-slate-700 font-bold block"><MdText text={inhalt.texte.t2PhasenfällungDurchAtmosphärische} /></span>
                      <code className="text-[11px] block bg-slate-50 p-1 border rounded text-slate-800 my-1"><MdText text={inhalt.texte.caOh2Co} /></code>
                    </div>
                    <div className="border-t pt-2 space-y-1">
                      <div className="text-slate-650 font-bold"><MdText text={inhalt.texte.wirksamkeitsspektrumDerGefügeselbstheilu} /></div>
                      <div className="text-emerald-800 text-[11px]"><MdText text={inhalt.texte.imVersuchVonSeymour} /></div>
                      <div className="text-slate-600 text-[10px] italic leading-tight mt-1"><MdText text={inhalt.texte.zumVergleichBeiÜblichem} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. VERBUNDQUERSCHNITT MONIER */}
        {activeCurioTab === 'reinforcement' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">💪</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900"><MdText text={inhalt.texte.phasenkopplungUndWerkstoffphysikalischeV} /></h3>
                <p className="text-xs text-slate-550 font-mono"><MdText text={inhalt.texte.geschichtlicheEvolutionAb1867} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p><MdText text={inhalt.texte.josephMoniersEntwicklungDes} /></p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2"><MdText text={inhalt.texte.physikalischeKoinzidenzDieThermo} /></h4>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.dieDauerhafteIntegritätEines} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 font-mono text-[11px]">
                  <p className="font-sans font-bold text-slate-800"><MdText text={inhalt.texte.vergleichDerAusdehnungskoeffizientenIm} /></p>
                  <div><MdText text={inhalt.texte.festigkeitsrelevanterBewehrungsstahlT12} /></div>
                  <div><MdText text={inhalt.texte.erhärteterHydratphasenzementsteinT10} /></div>
                  <p className="font-sans text-slate-650 text-[11px] mt-2"><MdText text={inhalt.texte.dadurchExpandierenUndKontrahieren} /></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.beanspruchungsverhaltenImZustandIi} /></span>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.betonBesitztEineGeringe} /></p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs text-slate-750">
                    <div className="text-shiraz font-bold"><MdText text={inhalt.texte.mechanischerZustandIiBiegezugzone} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.unterÜberschreitungDerZugrissgrenze} /></div>
                    
                    <div className="bg-slate-50 p-2 rounded text-[11px] leading-relaxed italic border mt-2"><MdText text={inhalt.texte.werkstoffParameterEinPlanmäßiges} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. DREI-SCHLUCHTEN-TALSPERRE */}
        {activeCurioTab === 'giantconcrete' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🌊</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900"><MdText text={inhalt.texte.thermischesBeanspruchungsverhaltenUndHyd} /></h3>
                <p className="text-xs text-slate-550 font-mono"><MdText text={inhalt.texte.fertigstellungStaumauer2006Gesamtanlage} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p><MdText text={inhalt.texte.dieDreiSchluchtenTalsperre} /></p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2"><MdText text={inhalt.texte.entstehungKritischerThermischerKern} /></h4>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.überschreitetDieTemperaturdifferenzT} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><MdText text={inhalt.texte.verfahrenstechnologischeSteuerungsmaßnah} /></p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-650 [list-style-type:circle]">
                    <li><MdText text={inhalt.texte.klinkerreduzierteBindemittelrezepturenEr} /></li>
                    <li><MdText text={inhalt.texte.aktiveBauteilinnenkühlungRohrkühlungIn} /></li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.thermodynamischeAbschätzungDesTemperatur} /></span>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.berechnungDerAdiabatenErwärmung} /></p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold"><MdText text={inhalt.texte.adiabatischePeaktemperaturprojektion} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.massenanteilBindemittelC260} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.spezifischeHydratationswärmeCemI} /></div>
                    <div className="text-slate-700 font-bold mt-2"><MdText text={inhalt.texte.t1FreigesetzteThermischeEnergie} /></div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]"><MdText text={inhalt.texte.qTotal260Kg} /></div>
                    <div className="text-slate-720 font-bold mt-2"><MdText text={inhalt.texte.t2TheoretischerAdiabatischerTemperaturans} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.spezifischeWärmekapazitätVonFrischbeton} /></div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]"><MdText text={inhalt.texte.tQTotalCp} /></div>
                    <div className="text-slate-900 border-t pt-2 font-bold leading-snug"><MdText text={inhalt.texte.resultierendeBauteilkerntemperaturImSomm} /></div>
                  </div>
                  <p className="text-xs text-slate-650 italic"><MdText text={inhalt.texte.rohrkühlungGekühlteAusgangsstoffeUnd} /></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. GOTTHARD-TUNNEL */}
        {activeCurioTab === 'gotthard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🏔️</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900"><MdText text={inhalt.texte.geomechanischeSpannungszuständeUndSpritz} /></h3>
                <p className="text-xs text-slate-550 font-mono"><MdText text={inhalt.texte.eröffnung2016GebirgsüberlagerungBis} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p><MdText text={inhalt.texte.aufgrundEinerGesteinsüberdeckungVon} /></p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2"><MdText text={inhalt.texte.erstarrungskatalyseDesSpritzbetonsAn} /></h4>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.zurSicherungDerFirste} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><MdText text={inhalt.texte.chemischeWirkungsunterschiedeModifiziert} /></p>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans"><MdText text={inhalt.texte.historischWeitVerbreiteteAlkalireiche} /></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.modellgestützteErmittlungDesRadialen} /></span>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.mathematischeAbschätzungDesPrimären} /></p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold"><MdText text={inhalt.texte.statischesGebirsLastmodell} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.überlagerungshöheH2000} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.mittlereSpezifischeWichteDes} /></div>
                    <div className="text-slate-700 font-bold mt-2"><MdText text={inhalt.texte.t1VertikalePrimärspannungDes} /></div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]"><MdText text={inhalt.texte.vH2000} /></div>
                    <div className="text-slate-700 font-bold mt-2"><MdText text={inhalt.texte.t2RechnerischErforderlicherRadialer} /></div>
                    <div className="text-slate-600"><MdText text={inhalt.texte.lehrannahmeDurchDieGewölbewirkung} /></div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]"><MdText text={inhalt.texte.pRad005} /></div>
                  </div>
                  <p className="text-xs text-slate-650 italic leading-snug"><MdText text={inhalt.texte.derTatsächlicheAusbauwiderstandErgibt} /></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. RÖMISCHE SEEKAI-PUZZOLANE */}
        {activeCurioTab === 'seawater' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">⚓</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900"><MdText text={inhalt.texte.langzeitbeständigkeitVonRömischemSeebeto} /></h3>
                <p className="text-xs text-slate-550 font-mono"><MdText text={inhalt.texte.werkstoffalter2000Jahre} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p><MdText text={inhalt.texte.unterMarinenExpositionsbedingungenUnterl} /></p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2"><MdText text={inhalt.texte.puzzolanischeReaktionsinduktionDurchHydr} /></h4>
                  <p className="text-xs text-slate-650"><MdText text={inhalt.texte.dieHistorischeMischungBeruht} /></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><MdText text={inhalt.texte.kristallgitterbildungUndPorenverriegelun} /></p>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans"><MdText text={inhalt.texte.derInfiltrationsprozessFördertDas} /></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.komparativeDegradationsUndVerwitterungsa} /></span>
                  <p className="text-xs text-slate-650 leading-tight"><MdText text={inhalt.texte.qualitativerVergleichUnterMeerwassereinw} /></p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-3 font-mono text-xs">
                    <div>
                      <span className="text-red-650 font-bold block border-b pb-1"><MdText text={inhalt.texte.t1ModernesPortlandbetonsysCem} /></span>
                      <div className="text-[11px] text-slate-600 leading-normal mt-1"><MdText text={inhalt.texte.auslaugungVonCalciumhydroxidCa} /></div>
                      <div className="text-red-700 font-bold text-[11px] mt-1"><MdText text={inhalt.texte.moderneBauwerkeWerdenÜblicherweise} /></div>
                    </div>
                    
                    <div className="border-t pt-2">
                      <span className="text-emerald-800 font-bold block border-b pb-1"><MdText text={inhalt.texte.t2AntikesOpusCaementicium} /></span>
                      <div className="text-[11px] text-slate-600 leading-normal mt-1"><MdText text={inhalt.texte.dieNachträglichGewachsenenKristalle} /></div>
                      <div className="text-emerald-700 font-bold text-[11px] mt-1"><MdText text={inhalt.texte.ergebnisHafenbautenSindSeit} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      </GruppierteModuleTabs>

      {/* FOOTER & REFERENCES */}
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="kuriositaeten" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap16}
        wikipedia={[
          { title: inhalt.werte.pantheonRom, url: 'https://de.wikipedia.org/wiki/Pantheon_(Rom)' },
          { title: inhalt.werte.burjKhalifa, url: 'https://de.wikipedia.org/wiki/Burj_Khalifa' },
          { title: inhalt.werte.eiffelturmUndPuddelstahlTechnik, url: 'https://de.wikipedia.org/wiki/Eiffelturm' },
          { title: inhalt.werte.olympiastadionMünchenZeltdachkonstruktio, url: 'https://de.wikipedia.org/wiki/Olympiastadion_M%C3%BCnchen#Zeltdachkonstruktion' },
          { title: inhalt.werte.ultrahochfesterBetonUhpc, url: 'https://de.wikipedia.org/wiki/Ultrahochfester_Beton' },
          { title: inhalt.werte.opusCaementiciumRömischerBeton, url: 'https://de.wikipedia.org/wiki/Opus_caementicium' },
          { title: inhalt.werte.stahlbetonJosephMonier, url: 'https://de.wikipedia.org/wiki/Stahlbeton' },
          { title: 'Drei-Schluchten-Talsperre', url: 'https://de.wikipedia.org/wiki/Drei-Schluchten-Talsperre' },
          { title: 'Gotthard-Basistunnel', url: 'https://de.wikipedia.org/wiki/Gotthard-Basistunnel' },
          inhalt.daten["Kuriositaeten.wikipedia.9"]
        ]}
        literatur={inhalt.daten["Kuriositaeten.literatur"]}
        regelwerke={inhalt.daten["Kuriositaeten.regelwerke"]}
        formeln={inhalt.daten["Kuriositaeten.formeln"]}
      />
    </div>
  );
}
