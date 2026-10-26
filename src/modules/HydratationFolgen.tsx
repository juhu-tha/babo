import React, { useState } from 'react';
import { Flame, Layers, Activity, BookOpen, ShieldAlert, Cpu } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import IntegrationVerformungen from './IntegrationVerformungen';
import Hydratation from './Hydratation';
import Praxisbeispiele from './Praxisbeispiele';
import Eigenspannungen from './Eigenspannungen';
import KriechenSchwinden from './KriechenSchwinden';
import MassigeBauteile from './MassigeBauteile';
import HydratationRissberechnung from './HydratationRissberechnung';
import HydratationPruefverfahren from './HydratationPruefverfahren';
import inhalt from '@/content/hydratationfolgen/HydratationFolgen.json';
import { MdText } from '@/src/components/inhalt/MdText';

type HydratationReiter = 'IntegrationVerformungen' | 'Hydratation' | 'Praxisbeispiele' | 'Eigenspannungen' | 'KriechenSchwinden' | 'MassigeBauteile' | 'HydratationRissberechnung' | 'HydratationPruefverfahren';

// Reiter (AP 3.8): 7 Hauptreiter in Reihenfolge des Lernpfads; „Zwang & Risse“ und der präzise
// Rissnachweis teilen sich einen Reiter (zweite Ebene). Labor-Prüfverfahren hat eigene Reiter und bleibt Hauptreiter.
const GRUPPEN: readonly ModulTabGruppe<HydratationReiter>[] = [
  { id: 'uebersicht_g', label: inhalt.werte.übersichtZusammenhänge, icon: BookOpen, mitglieder: [{ id: 'IntegrationVerformungen', label: inhalt.werte.übersichtZusammenhänge2 }] },
  { id: 'hydratation_g', label: inhalt.werte.hydratationReife, icon: Activity, mitglieder: [{ id: 'Hydratation', label: inhalt.werte.hydratationReife2 }] },
  { id: 'pruef_g', label: 'Labor-Prüfverfahren', icon: Activity, mitglieder: [{ id: 'HydratationPruefverfahren', label: 'Labor-Prüfverfahren' }] },
  { id: 'eigen_g', label: 'Eigenspannungen', icon: Flame, mitglieder: [{ id: 'Eigenspannungen', label: 'Eigenspannungen' }] },
  { id: 'massig_g', label: inhalt.werte.massigeBauteile, icon: Layers, mitglieder: [{ id: 'MassigeBauteile', label: inhalt.werte.massigeBauteile2 }] },
  { id: 'risse_g', label: inhalt.werte.zwangRisse, icon: ShieldAlert, mitglieder: [
    { id: 'Praxisbeispiele', label: inhalt.werte.zwangRisse2, icon: ShieldAlert },
    { id: 'HydratationRissberechnung', label: inhalt.werte.präziserRissnachweisEc2, icon: Cpu },
  ] },
  { id: 'kriechen_g', label: inhalt.werte.kriechenSchwinden, icon: Layers, mitglieder: [{ id: 'KriechenSchwinden', label: inhalt.werte.kriechenSchwinden2 }] },
];

export default function HydratationFolgen() {
  const [activeTab, setActiveTab] = useState<HydratationReiter>('IntegrationVerformungen');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Flame className="text-shiraz" /><MdText text={inhalt.texte.hydratationReifeVerformungen} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.exothermeReaktionswärmeentwicklungFestig} /></p>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-xs">
            <strong className="mr-1">Lernpfad:</strong>
            {GRUPPEN.map((g, i) => (
              <React.Fragment key={g.id}>
                {i > 0 && <span className="text-text-main/40">→</span>}
                <button onClick={() => setActiveTab(g.mitglieder[0].id)} className="underline decoration-dotted hover:text-shiraz cursor-pointer">
                  {i + 1}. {g.mitglieder.map(m => m.label.replace(inhalt.werte.präziserRissnachweisEc22, 'Rissnachweis')).join(' + ')}
                </button>
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Reiter: 7 Hauptreiter, Rissnachweis als zweite Ebene unter „Zwang & Risse“ (AP 3.8) */}
        <GruppierteModuleTabs
          label={inhalt.werte.hydratationFolgenBereiche}
          gruppen={GRUPPEN}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="mt-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20"
        >
        <div className="mt-6">
          {activeTab === 'IntegrationVerformungen' && <IntegrationVerformungen />}
          {activeTab === 'Hydratation' && <Hydratation />}
          {activeTab === 'Praxisbeispiele' && <Praxisbeispiele />}
          {activeTab === 'HydratationRissberechnung' && <HydratationRissberechnung />}
          {activeTab === 'Eigenspannungen' && <Eigenspannungen />}
          {activeTab === 'KriechenSchwinden' && <KriechenSchwinden />}
          {activeTab === 'MassigeBauteile' && <MassigeBauteile />}
          {activeTab === 'HydratationPruefverfahren' && <HydratationPruefverfahren />}
        </div>
        </GruppierteModuleTabs>
      </div>

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielReifegradNachSaul}
        zielGleichung="M = \sum (T_i - T_0) \cdot \Delta t_i, \quad T_0 = -10\,^{\circ}\text{C}"
        normQuelle={inhalt.werte.saul1951AstmC1074}
        schritte={inhalt.daten["HydratationFolgen.schritte"]}
        ergebnisHinweis={inhalt.werte.t48HBei10}
      />

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielAdiabatischeTemperatur}
        zielGleichung="\Delta T_{ad} = \frac{z \cdot Q}{c \cdot \rho}"
        normQuelle={inhalt.werte.wärmebilanzLehrwerteRichtwerteDafstb}
        schritte={inhalt.daten["HydratationFolgen.schritte_2"]}
        ergebnisHinweis={inhalt.werte.rund45KBei}
      />

      <ModulTest moduleId="hydratation_folgen" />

      <ModuleFooter
        weblinks={[
          { title: inhalt.werte.betonWikiHydratation, url: "https://beton.wiki/index.php?title=Hydratation" },
          { title: inhalt.werte.betonWikiRisse, url: "https://beton.wiki/index.php?title=Risse" }
        ]}
        wikipedia={[
          { title: 'Zementstein', url: 'https://de.wikipedia.org/wiki/Zementstein' },
          { title: 'Zwangspannung', url: 'https://de.wikipedia.org/wiki/Zwangspannung' },
          { title: 'Hydratationswärme', url: 'https://de.wikipedia.org/wiki/Hydratationsw%C3%A4rme' },
          { title: 'Schwinden', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' },
          { title: 'Kriechen', url: 'https://de.wikipedia.org/wiki/Kriechen' }
        ]}
        regelwerke={inhalt.daten["HydratationFolgen.regelwerke"]}
        literatur={inhalt.daten["HydratationFolgen.literatur"]}
        formeln={inhalt.daten["HydratationFolgen.formeln"]}
      />
    </div>
  );
}
