import React, { useState } from 'react';
import LCA from './LCA';
import Nachhaltigkeit from './Nachhaltigkeit';
import InteractiveLCACalc from './InteractiveLCACalc';
import TransportbetonLcaUebung from './lca/TransportbetonLcaUebung';
import IngenieurbauLCA from './lca/IngenieurbauLCA';
import { Leaf, BookOpen, Calculator, FileSpreadsheet, Milestone } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import inhaltJson from '@/content/oekobilanzlca/OekobilanzLCA.json';
import { MdText } from '@/src/components/inhalt/MdText';

export type LcaTeil = 'grundlagen' | 'rechner' | 'ingenieurbau' | 'regulatorik';
type LcaTab = 'LCA' | 'InteractiveCalc' | 'Ingenieurbau' | 'TransportbetonExcel' | 'Praxiswerkstatt' | 'Regulatorik';

/** Ökobilanzierung, aufgeteilt in vier Module (AP 3.8): Grundlagen, Rechner & QNG, Ingenieurbau, Rechtsrahmen & Praxis.
 *  Der Inhalt jedes Reiters steht beim Teil (Z53: Ansichtsumfang je Modul-ID in tests/kurzfassung.test.ts messbar). */
const TEILE: Record<LcaTeil, { titel: string; text: React.ReactNode; tabs: { id: LcaTab; label: string; icon: typeof Leaf; inhalt: React.ReactNode }[]; moduleId: string }> = {
  grundlagen: {
    titel: inhaltJson.werte.ökobilanzierungLcaGrundlagen,
    text: <><MdText text={inhaltJson.texte.normenLebenszyklusphasenABis} /></>,
    tabs: [{ id: 'LCA', label: inhaltJson.werte.ökobilanzierungLcaGrundlagen2, icon: BookOpen, inhalt: <LCA /> }],
    moduleId: 'oekobilanz_lca',
  },
  rechner: {
    titel: inhaltJson.werte.lcaRechnerQngNachweis,
    text: <><MdText text={inhaltJson.texte.coBilanzVonGebäudevarianten} /></>,
    tabs: [
      { id: 'InteractiveCalc', label: inhaltJson.werte.interaktiverCoRechnerModul, icon: Calculator, inhalt: <InteractiveLCACalc /> },
      { id: 'Praxiswerkstatt', label: inhaltJson.werte.wandaufbauQngNachweisLeitfaden, icon: Leaf, inhalt: <Nachhaltigkeit bereiche={['wandkonfigurator', 'qng_nachweis', 'leitfaden']} /> },
      { id: 'TransportbetonExcel', label: inhaltJson.werte.excelÜbungTransportbetonDownload, icon: FileSpreadsheet, inhalt: <TransportbetonLcaUebung /> },
    ],
    moduleId: 'lca_rechner',
  },
  ingenieurbau: {
    titel: inhaltJson.werte.lcaImIngenieurbauDin,
    text: <><MdText text={inhaltJson.texte.ökobilanzVonIngenieurbauwerkenUnd} /></>,
    tabs: [{ id: 'Ingenieurbau', label: inhaltJson.werte.dinEn17472Ingenieurbau, icon: Milestone, inhalt: <IngenieurbauLCA /> }],
    moduleId: 'lca_ingenieurbau',
  },
  regulatorik: {
    titel: inhaltJson.werte.rechtsrahmenCrremPraxis,
    text: <><MdText text={inhaltJson.texte.hierarchischesRechtsrahmenKompendiumBaup} /></>,
    tabs: [{ id: 'Regulatorik', label: inhaltJson.werte.crremRechtsrahmenPraxis, icon: Leaf, inhalt: <Nachhaltigkeit bereiche={['crrem_regulatorik', 'praxis_innovationen']} /> }],
    moduleId: 'lca_regulatorik',
  },
};

/** Eine Fußzeile je Modul (Nachstichprobe 29.10.2026): Der LCA-Rechner hat keine eigene Fußzeile mehr; seine Literatur,
 *  Formeln und die zusätzlichen Regelwerke stehen im Teil „rechner“ in der modulweiten Fußzeile.
 *  Klammern um die Verweise beim Spread: das Einbetten (scripts/inhaltEinbetten.ts) ersetzt nur Verweise ohne Punkt davor. */
const RECHNER_FUSS = {
  literatur: inhaltJson.daten["OekobilanzLCA.literatur_rechner"],
  regelwerke: inhaltJson.daten["OekobilanzLCA.regelwerke_rechner"],
  formeln: inhaltJson.daten["OekobilanzLCA.formeln_rechner"],
};

export default function OekobilanzLCA({ teil = 'grundlagen' }: { teil?: LcaTeil }) {
  const t = TEILE[teil];
  const [activeTab, setActiveTab] = useState<LcaTab>(t.tabs[0].id);
  const tabs = t.tabs;
  const inhalt = (
    <div className="p-6">
      {tabs.find(x => x.id === activeTab)?.inhalt}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Leaf className="w-5 h-5 text-shiraz animate-pulse" />
            {t.titel}
          </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>{t.text}</p>
        </div>
        </div>

        {tabs.length > 1 ? (
          <ModuleTabs label={inhaltJson.werte.bereicheDerÖkobilanzierung} tabs={tabs} aktiv={activeTab} onWechsel={setActiveTab} variante="kachel" className="[&>[role=tablist]]:p-4 [&>[role=tablist]]:bg-slate-50/50 dark:[&>[role=tablist]]:bg-slate-800/40 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/30">
            {inhalt}
          </ModuleTabs>
        ) : inhalt}
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      {teil === 'grundlagen' && (
      <FormulaDerivationBox
        title={inhaltJson.werte.beispielZementanteilAmGwp}
        zielGleichung="\text{GWP}_{A1\text{–}A3} \approx m_Z \cdot \text{GWP}_Z + \text{GWP}_{\text{Rest}}"
        schritte={inhaltJson.daten["OekobilanzLCA.schritte"]}
        ergebnisHinweis={inhaltJson.werte.derZementVerursacht80}
        normQuelle={inhaltJson.werte.dinEn15804A2}
      />
      )}
      {teil === 'rechner' && (
      <FormulaDerivationBox
        title={inhaltJson.werte.beispielQngNachweisDer}
        zielGleichung="\text{GWP}_{\text{spez}} = \frac{\text{GWP}_{\text{Konstruktion}} + \text{GWP}_{\text{Betrieb}}}{\text{NRF} \cdot 50\,\text{a}}"
        schritte={inhaltJson.daten["OekobilanzLCA.schritte_2"]}
        ergebnisHinweis={inhaltJson.werte.gutschriftenAusModulD}
        normQuelle={inhaltJson.werte.qngHandbuchAnlage3}
      />

      )}

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId={t.moduleId} />

      <ModuleFooter
        lastReviewed={inhaltJson.werte.oktober2026Ap7} 
        wikipedia={[
          { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' },
          { title: 'Treibhauspotenzial', url: 'https://de.wikipedia.org/wiki/Treibhauspotenzial' },
          { title: inhaltJson.werte.graueEnergie, url: 'https://de.wikipedia.org/wiki/Graue_Energie' },
          { title: inhaltJson.werte.umweltproduktdeklarationEpd, url: 'https://de.wikipedia.org/wiki/Environmental_Product_Declaration' }
        ]}
        literatur={teil === 'rechner' ? [...(inhaltJson.daten["OekobilanzLCA.literatur"]), ...RECHNER_FUSS.literatur] : inhaltJson.daten["OekobilanzLCA.literatur"]}
        normIds={['DIN_EN_15804', 'DIN_EN_15978', 'DIN_EN_17472']}
        regelwerke={teil === 'rechner' ? [...(inhaltJson.daten["OekobilanzLCA.regelwerke"]), ...RECHNER_FUSS.regelwerke] : inhaltJson.daten["OekobilanzLCA.regelwerke"]}
        weblinks={inhaltJson.daten["OekobilanzLCA.weblinks"]}
        formeln={teil === 'rechner' ? [...(inhaltJson.daten["OekobilanzLCA.formeln"]), ...RECHNER_FUSS.formeln] : inhaltJson.daten["OekobilanzLCA.formeln"]}
      />
    </div>
  );
}
