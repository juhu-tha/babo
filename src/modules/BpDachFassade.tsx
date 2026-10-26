import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Layers, BookOpen, CheckCircle2, Lightbulb, Calculator, Sparkles, ShieldCheck, AlertTriangle, BadgeCheck } from 'lucide-react';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InlineMath } from 'react-katex';
import { Querverweis } from '@/src/components/ui/Querverweis';
import inhalt from '@/content/bpdachfassade/BpDachFassade.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

export default function BpDachFassade() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation' | 'fenster_rechner'>('allgemein');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white dark:bg-slate-900 text-text-main dark:text-slate-100 p-6 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-800">
        <h2 className="text-xl font-bold text-text-main dark:text-slate-100 flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.dachFassadeFensterBauprodukte} /></h2>
        <div className="text-sm text-text-main/80 dark:text-slate-350 bg-off-white dark:bg-slate-950/40 p-4 rounded-xl border border-home-grau/30 dark:border-slate-800 mt-3 animate-in fade-in">
          <p><MdText text={inhalt.texte.dachUndFassadensystemeSowie} /></p>
        </div>

        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'allgemein' as const, label: 'Basiswissen', icon: BookOpen },
            { id: 'fenster_rechner' as const, label: inhalt.texte.fensterUWertUw, icon: Calculator },
            { id: 'praxis' as const, label: 'Praxisbeispiele', icon: CheckCircle2 },
            { id: 'innovation' as const, label: 'Zukunftstrends', icon: Lightbulb },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:dark:border-slate-800 [&>[role=tablist]]:my-6"
        >

        {activeTab === 'allgemein' ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300 font-sans">
            <div className="text-sm text-text-main/80 dark:text-slate-300 bg-off-white dark:bg-slate-950/40 p-4 rounded-xl border border-home-grau/30 dark:border-slate-800">
              <p><MdText text={inhalt.texte.produkteZurHerstellungDer} /></p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white dark:bg-slate-950/30 p-5 rounded-xl border border-home-grau/30 dark:border-slate-800">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.geneigtesDachBeläge} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 dark:text-slate-300 space-y-2">
                  <li><MdText text={inhalt.texte.tondachziegelGebrannterTonDin} /></li>
                  <li><MdText text={inhalt.texte.betondachsteineAusZementSand} /></li>
                  <li><MdText text={inhalt.texte.schieferNatürlichesMetamorphesGestein} /></li>
                  <li><MdText text={inhalt.texte.metallbedachungenTitanzinkDinEn} /></li>
                </ul>
              </div>
              <div className="bg-off-white dark:bg-slate-950/30 p-5 rounded-xl border border-home-grau/30 dark:border-slate-800">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.vorgehängteHinterlüfteteFassadeVhf} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 dark:text-slate-300 space-y-2">
                  <li><MdText text={inhalt.texte.faserzementplattenFaserarmierteZementste} /></li>
                  <li><MdText text={inhalt.texte.hplPlattenHighPressure} /></li>
                  <li><MdText text={inhalt.texte.aluminiumVerbundplattenZweiDünne} /></li>
                  <li><MdText text={inhalt.texte.hinterlüfteterRaumMin2} /></li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-off-white dark:bg-slate-950/30 p-5 rounded-xl border border-home-grau/30 dark:border-slate-800">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.moderneFensterFunktionsglas} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 dark:text-slate-300 space-y-2">
                  <li><MdText text={inhalt.texte.mehrscheibenIsolierglasMigBesteht} /></li>
                  <li><MdText text={inhalt.texte.lowEBeschichtungHauchdünne} /></li>
                  <li><MdText text={inhalt.texte.randverbundWarmeKanteHochisolierende} /></li>
                  <li><MdText text={inhalt.texte.sonnenschutzgläserSpezielleMetalloxidsch} /></li>
                </ul>
              </div>
              <div className="bg-off-white dark:bg-slate-950/30 p-5 rounded-xl border border-home-grau/30 dark:border-slate-800">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.fassadenBefestigungsSondersysteme} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 dark:text-slate-300 space-y-2">
                  <li><MdText text={inhalt.texte.pfostenRiegelFassadeSkelettbauweise} /></li>
                  <li><MdText text={inhalt.texte.vakuumIsolationsPaneeleVip} /></li>
                  <li><MdText text={inhalt.texte.vorsichtBeiVipPlatten} /></li>
                  <li><MdText text={inhalt.texte.befestigungskonsolenThermischGetrennteWa} /></li>
                </ul>
              </div>
            </div>
          
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-home-grau/30 dark:border-slate-800 shadow-sm mt-8 bg-slate-50/50 dark:bg-slate-950/20">
              <h3 className="font-bold text-home-prim text-lg mb-2 flex items-center gap-2"><MdText text={inhalt.texte.marktübersichtTypischerSystemlösungenFür} /></h3>
              <p className="text-xs text-text-main/60 dark:text-slate-400 mb-4 italic"><MdText text={inhalt.texte.hinweisZurHerstellerneutralitätDie} /></p>
              <ul className="list-disc list-inside text-sm text-text-main/70 dark:text-slate-350 space-y-2.5 font-normal">
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200"><MdText text={inhalt.texte.dachsteineUndZiegelDin} /></span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1"><MdText text={inhalt.texte.hochverdichteteBetonDachsteineUnd} /></span>
                  </li>
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200"><MdText text={inhalt.texte.hinterlüfteteFassadensysteme} /></span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1"><MdText text={inhalt.texte.systemlösungenFürDieVorgehängte} /></span>
                  </li>
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Faserzementplatten:</span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1"><MdText text={inhalt.texte.universellEinsetzbareVerbundplattenAus} /></span>
                  </li>
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200"><MdText text={inhalt.texte.titanzinkdeckungDinEn988} /></span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1"><MdText text={inhalt.texte.langlebigeWalzzinkBedachungUnd} /></span>
                  </li>
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Aluminium-Stehfalzsysteme:</span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1"><MdText text={inhalt.texte.hohlUndStehfalzprofilbahnenAus} /></span>
                  </li>
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">HPL-Verbundplatten:</span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1"><MdText text={inhalt.texte.unterHochdruckGepressteDuroplast} /></span>
                  </li>
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Aluminium-Pfosten-Riegel-Systeme:</span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1"><MdText text={inhalt.texte.schnittstellenProfilkonstruktionenAusStr} /></span>
                  </li>
              </ul>
            </div>
          </div>
        ) : activeTab === 'fenster_rechner' ? (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <Querverweis ziel="bp_glaeser" titel={inhalt.werte.fensterUWertU} linkText={inhalt.werte.zumUWRechner}>
              <p><MdText text={inhalt.texte.dasGebäudemodernisierungsgesetzGmodgVorm} /></p>
              <p><MdText text={inhalt.texte.derInteraktiveRechnerMit} /></p>
            </Querverweis>
          </div>
        ) : activeTab === 'praxis' ? (
          <PraxisTabContent moduleKey="bp_dach_fassade" />
        ) : (
          <InnovationTabContent moduleKey="bp_dach_fassade" />
        )}
        </ModuleTabs>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielUWEines}
          zielGleichung="U_w = \frac{A_g U_g + A_f U_f + l_g \Psi_g}{A_g + A_f}"
          normQuelle={inhalt.werte.dinEnIso10077}
          schritte={inhalt.daten["BpDachFassade.schritte"]}
          ergebnisHinweis={inhalt.werte.uW087}
        />
      </div>

      <ModulTest moduleId="bp_dach_fassade" />

      <ModuleFooter 
        wikipedia={[ 
          { title: "Mehrscheiben-Isolierglas", url: "https://de.wikipedia.org/wiki/Mehrscheiben-Isolierglas" }, 
          { title: inhalt.werte.vorgehängteHinterlüfteteFassade, url: "https://de.wikipedia.org/wiki/Vorgeh%C3%A4ngte_hinterl%C3%BCftete_Fassade" },
          { title: "Wärmedurchgangskoeffizient", url: "https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient" }
        ]} 
        literatur={inhalt.daten["BpDachFassade.literatur"]} 
        regelwerke={inhalt.daten["BpDachFassade.regelwerke"]} 
        formeln={inhalt.daten["BpDachFassade.formeln"]} 
      />
    </div>
  );
}

