import React, { useState } from 'react';
import Lebensdauern from './Lebensdauern';
import LCC from './LCC';
import Preisentwicklung from './Preisentwicklung';
import { Clock, Coins, TrendingUp } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/lebenszykluskosten/LebenszyklusKosten.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function LebenszyklusKosten() {
  const [activeTab, setActiveTab ] = useState<'Lebensdauern' | 'LCC' | 'Preisentwicklung'>('Lebensdauern');

  const tabs = [
    { id: 'Lebensdauern' as const, label: 'Bauteillebensdauern', icon: Clock },
    { id: 'LCC' as const, label: inhalt.werte.lebenszykluskostenLcc, icon: Coins },
    { id: 'Preisentwicklung' as const, label: 'Baukostenentwicklung', icon: TrendingUp }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Coins className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.lebenszykluskostenLccBauteillebensdauern} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
            <p><MdText text={inhalt.texte.berechnungNachBarwertmethodeKapitalwert} /></p>
          </div>
        </div>

        <ModuleTabs
          label={inhalt.werte.bereicheLebenszykluskosten}
          tabs={tabs}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          variante="kachel"
          className="[&>[role=tablist]]:p-4 [&>[role=tablist]]:bg-slate-50/50 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/30 [&>[role=tabpanel]]:p-6"
        >
          {activeTab === 'Lebensdauern' && <Lebensdauern />}
          {activeTab === 'LCC' && <LCC />}
          {activeTab === 'Preisentwicklung' && <Preisentwicklung />}
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1BarwertJährlicher}
        zielGleichung="BW = C \cdot \frac{1 - (1 + r)^{-T}}{r}"
        schritte={inhalt.daten["LebenszyklusKosten.schritte"]}
        ergebnisHinweis={inhalt.werte.ohneAbzinsungWärenEs}
        normQuelle={inhalt.werte.iso1568652017}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2ErsatzinvestitionFür}
        zielGleichung="BW = \frac{C_t}{(1 + r)^t}"
        schritte={inhalt.daten["LebenszyklusKosten.schritte_2"]}
        ergebnisHinweis={inhalt.werte.langlebigeBauteileMitSpäten}
        normQuelle={inhalt.werte.iso15686520172}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="lebenszyklus_kosten" />

      <ModuleFooter 
        lastReviewed={inhalt.werte.oktober2026Ap7} 
        wikipedia={[
          { title: 'Lebenszykluskostenrechnung', url: 'https://de.wikipedia.org/wiki/Lebenszykluskostenrechnung' },
          { title: 'Barwert', url: 'https://de.wikipedia.org/wiki/Barwert' },
          { title: 'Baupreisindex', url: 'https://de.wikipedia.org/wiki/Baupreisindex' }
        ]}
        literatur={inhalt.daten["LebenszyklusKosten.literatur"]}
        regelwerke={inhalt.daten["LebenszyklusKosten.regelwerke"]}
        formeln={inhalt.daten["LebenszyklusKosten.formeln"]}
      />
    </div>
  );
}
