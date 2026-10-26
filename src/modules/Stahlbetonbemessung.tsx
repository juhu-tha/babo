import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Box, 
  Scissors, 
  Columns, 
  CircleDashed, 
  GitCommit,
  Layers,
  Activity,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import SpannungDehnung from './SpannungDehnung';
import Biegebemessung from './Biegebemessung';
import Querkraftbemessung from './Querkraftbemessung';
import Stuetzenbemessung from './Stuetzenbemessung';
import Durchstanzen from './Durchstanzen';
import Verankerungslaenge from './Verankerungslaenge';
import Rissbreite from './Rissbreite';
import StahlbetonNullBisHundert from './stahlbeton/StahlbetonNullBisHundert';
import inhalt from '@/content/stahlbetonbemessung/Stahlbetonbemessung.json';
import { MdText } from '@/src/components/inhalt/MdText';

export type BemessungSubTab = 
  | 'null_bis_hundert'
  | 'spannung'
  | 'biegebemessung' 
  | 'querkraftbemessung' 
  | 'stuetzenbemessung' 
  | 'durchstanzen' 
  | 'verankerungslaenge'
  | 'rissbreite'
  | 'ec2_generation2';


// Formeln je Reiter (aus den Unterrechnern zusammengeführt)
const FORMELN_JE_REITER: Partial<Record<BemessungSubTab, { formel: string; erklaerung: string; quelle?: string }[]>> = inhalt.daten.FORMELN_JE_REITER;

export default function Stahlbetonbemessung({ initialTab }: { initialTab?: BemessungSubTab }) {
  const { activeTab, setActiveTab } = useTabContext();

  // Determine initial subtab based on prop, activeTab or window hash
  const getInitialSubTab = (): BemessungSubTab => {
    if (initialTab) return initialTab;
    if ((activeTab as string) === 'null_bis_hundert') return 'null_bis_hundert';
    if (activeTab === 'spannung') return 'spannung';
    if (activeTab === 'querkraftbemessung') return 'querkraftbemessung';
    if (activeTab === 'stuetzenbemessung') return 'stuetzenbemessung';
    if (activeTab === 'durchstanzen') return 'durchstanzen';
    if (activeTab === 'verankerungslaenge') return 'verankerungslaenge';
    if (activeTab === 'rissbreite') return 'rissbreite';
    if (activeTab === 'biegebemessung') return 'biegebemessung';

    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.toLowerCase().replace(/^#/, '');
      if (h.includes('0-100') || h.includes('null_bis_hundert') || h.includes('guide')) return 'null_bis_hundert';
      if (h.includes('spannung') || h.includes('dehnung')) return 'spannung';
      if (h.includes('querkraft')) return 'querkraftbemessung';
      if (h.includes('stuetz')) return 'stuetzenbemessung';
      if (h.includes('durchstanz')) return 'durchstanzen';
      if (h.includes('verankerung')) return 'verankerungslaenge';
      if (h.includes('riss')) return 'rissbreite';
      if (h.includes('bieg')) return 'biegebemessung';
    }
    return 'null_bis_hundert';
  };

  const [currentTab, setCurrentTab] = useState<BemessungSubTab>(getInitialSubTab);

  // Sync state if initialTab or activeTab changes from outside (e.g. search, quiz, cross-link)
  useEffect(() => {
    if (initialTab) setCurrentTab(initialTab);
    else if ((activeTab as string) === 'null_bis_hundert') setCurrentTab('null_bis_hundert');
    else if (activeTab === 'spannung') setCurrentTab('spannung');
    else if (activeTab === 'querkraftbemessung') setCurrentTab('querkraftbemessung');
    else if (activeTab === 'stuetzenbemessung') setCurrentTab('stuetzenbemessung');
    else if (activeTab === 'durchstanzen') setCurrentTab('durchstanzen');
    else if (activeTab === 'verankerungslaenge') setCurrentTab('verankerungslaenge');
    else if (activeTab === 'rissbreite') setCurrentTab('rissbreite');
    else if (activeTab === 'biegebemessung') setCurrentTab('biegebemessung');
  }, [initialTab, activeTab]);

  // Reiter (AP 3.8): 5 Hauptbereiche; die GZT-Bauteilnachweise bilden die zweite Ebene.
  // Zustand bleibt die bisherige Unterreiter-ID, damit Routen wie #querkraftbemessung weiter passen.
  const gruppen: readonly ModulTabGruppe<BemessungSubTab>[] = [
    { id: 'einstieg_g', label: '0-100', icon: GraduationCap, mitglieder: [{ id: 'null_bis_hundert', label: '0-100' }] },
    { id: 'werkstoff_g', label: inhalt.werte.t1SpannungDehnung, icon: Activity, mitglieder: [{ id: 'spannung', label: inhalt.werte.t1SpannungDehnung2 }] },
    { id: 'gzt_g', label: inhalt.werte.t26NachweiseIm, icon: Box, mitglieder: [
      { id: 'biegebemessung', label: inhalt.werte.t2Biegebemessung, icon: Box },
      { id: 'querkraftbemessung', label: inhalt.werte.t3Querkraftbemessung, icon: Scissors },
      { id: 'stuetzenbemessung', label: inhalt.werte.t4Stützenbemessung, icon: Columns },
      { id: 'durchstanzen', label: inhalt.werte.t5Durchstanzen, icon: CircleDashed },
      { id: 'verankerungslaenge', label: inhalt.werte.t6Verankerungslänge, icon: GitCommit },
    ] },
    { id: 'gzg_g', label: inhalt.werte.t7RissbreiteGzg, icon: Layers, mitglieder: [{ id: 'rissbreite', label: inhalt.werte.t7RissbreiteGzg2 }] },
    { id: 'ec2neu_g', label: inhalt.werte.t8Eurocode22, icon: Sparkles, mitglieder: [{ id: 'ec2_generation2', label: inhalt.werte.t8Eurocode222 }] },
  ];

  const handleTabChange = (tab: BemessungSubTab) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', `#${tab}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Central Header & Tab Selector Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Calculator className="text-shiraz h-6 w-6" /><MdText text={inhalt.texte.stahlbetonDinEn1992} /></h2>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.integrierteWerkstoffgesetzeSpannungDehnu} /></p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap"><MdText text={inhalt.texte.dinEn19921} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p><MdText text={inhalt.texte.zentralesBerechnungsmodulFürDen} /></p>
        </div>
      </div>

      {/* Reiter: 5 Hauptbereiche, GZT-Nachweise mit zweiter Ebene (AP 3.8) */}
      <GruppierteModuleTabs
        label={inhalt.werte.stahlbetonThemen}
        gruppen={gruppen}
        aktiv={currentTab}
        onWechsel={handleTabChange}
        className="[&>[role=tablist]]:bg-white [&>[role=tablist]]:p-4 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:shadow-sm [&>[role=tablist]]:border [&>[role=tablist]]:border-home-grau/30"
      >
      {/* Render Active Sub-Module */}
      <div className="transition-all duration-200 mt-6">
        {currentTab === 'null_bis_hundert' && (
          <div className="animate-in fade-in duration-200">
            <StahlbetonNullBisHundert onNavigateTab={(tab) => handleTabChange(tab)} />
          </div>
        )}

        {currentTab === 'spannung' && (
          <div className="animate-in fade-in duration-200">
            <SpannungDehnung />
          </div>
        )}

        {currentTab === 'biegebemessung' && (
          <div className="animate-in fade-in duration-200">
            <Biegebemessung />
          </div>
        )}

        {currentTab === 'querkraftbemessung' && (
          <div className="animate-in fade-in duration-200">
            <Querkraftbemessung />
          </div>
        )}

        {currentTab === 'stuetzenbemessung' && (
          <div className="animate-in fade-in duration-200">
            <Stuetzenbemessung />
          </div>
        )}

        {currentTab === 'durchstanzen' && (
          <div className="animate-in fade-in duration-200">
            <Durchstanzen />
          </div>
        )}

        {currentTab === 'verankerungslaenge' && (
          <div className="animate-in fade-in duration-200">
            <Verankerungslaenge />
          </div>
        )}

        {currentTab === 'rissbreite' && (
          <div className="animate-in fade-in duration-200">
            <Rissbreite />
          </div>
        )}
        {currentTab === 'ec2_generation2' && (
          <div className="animate-in fade-in duration-200 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block"><MdText text={inhalt.texte.normenentwicklungStand2026} /></span>
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mt-0.5">
                  <Sparkles className="text-amber-500 h-5 w-5" /><MdText text={inhalt.texte.t2GenerationDesEurocode} /></h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200"><MdText text={inhalt.texte.europäischeHarmonisierung} /></span>
            </div>

            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.die2GenerationDes} /></p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Querkraft */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t1GeänderteQuerkraftbemessung} /></span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white rounded border border-home-grau/20 font-bold">V_Rd,c</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.ablösungDesAltenEmpirischen} /></p>
                <div className="p-2 bg-white rounded text-[11px] font-mono text-center border border-home-grau/15"><MdText text={inhalt.texte.vRdCTau} /></div>
              </div>

              {/* Durchstanzen */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t2DurchstanzmodellCsct} /></span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white rounded border border-home-grau/20 font-bold"><MdText text={inhalt.texte.vRdCStütze} /></span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.vereinheitlichtesDurchstanzmodellBasiere} /></p>
                <div className="p-2 bg-white rounded text-[11px] font-mono text-center border border-home-grau/15"><MdText text={inhalt.texte.rundschnitt05D} /></div>
              </div>

              {/* ERC */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t3ExpositionsWiderstandErc} /></span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-bold"><MdText text={inhalt.texte.exposureResistance} /></span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.einführungVonExposureResistance} /></p>
                <div className="p-2 bg-white rounded text-[11px] font-mono text-center border border-home-grau/15"><MdText text={inhalt.texte.cNomCMin} /></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs text-text-main/80 space-y-2">
              <div className="font-bold text-text-main flex items-center gap-2">
                <Calculator size={15} className="text-shiraz" /><MdText text={inhalt.texte.vergleichendeÜbergangsregelungImDeutsche} /></div>
              <p className="text-[11px] leading-relaxed text-text-main/70"><MdText text={inhalt.texte.dieBemessungsprogrammeUndNachweise} /></p>
            </div>
          </div>
        )}
      </div>
      </GruppierteModuleTabs>

      <ModulTest moduleId="stahlbeton" />

      <ModuleFooter
        wikipedia={[
          { title: 'Stahlbeton', url: 'https://de.wikipedia.org/wiki/Stahlbeton' },
          { title: 'Eurocode 2', url: 'https://de.wikipedia.org/wiki/Eurocode_2' },
          { title: 'Betonstahl', url: 'https://de.wikipedia.org/wiki/Betonstahl' },
          { title: 'Durchstanzen', url: 'https://de.wikipedia.org/wiki/Durchstanzen' }
        ]}
        regelwerke={inhalt.daten["Stahlbetonbemessung.regelwerke"]}
        literatur={inhalt.daten["Stahlbetonbemessung.literatur"]}
        formeln={FORMELN_JE_REITER[currentTab] ?? []}
      />
    </div>
  );
}
