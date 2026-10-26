import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { Mountain, Layers, Pickaxe, Activity, Grip, BookOpen } from 'lucide-react';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import inhalt from '@/content/gesteine/Gesteine.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

export default function Gesteine() {
  const [activeTab, setActiveTab] = useState<'arten' | 'eigenschaften' | 'kennwerte' | 'koernungen' | 'steckbrief'>('steckbrief');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Mountain className="text-shiraz" /> Gesteine
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.gesteinskörnungenBildenDasTragende} /></p>
        </div>

        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'steckbrief' as const, label: 'Baustoff-Steckbrief', icon: BookOpen },
            { id: 'arten' as const, label: inhalt.texte.gesteinsartenEntstehung, icon: Layers },
            { id: 'eigenschaften' as const, label: inhalt.texte.eigenschaftenAnwendung, icon: Pickaxe },
            { id: 'kennwerte' as const, label: inhalt.texte.technischeKennwertePrüfung, icon: Activity },
            { id: 'koernungen' as const, label: 'Gesteinskörnungen', icon: Grip },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20"
        >

        {activeTab === 'arten' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.gesteineWerdenNachIhrer} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.magmatiteErstarrungsgesteine} /></h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.entstehenDurchAbkühlungUnd} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li><MdText text={inhalt.texte.tiefengesteinePlutoniteLangsameAbkühlung} /></li>
                  <li><MdText text={inhalt.texte.ergussgesteineVulkaniteSchnelleAbkühlung} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.sedimentiteAblagerungsgesteine} /></h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.entstehenDurchVerwitterungTransport} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li><MdText text={inhalt.texte.klastischAusGesteinstrümmernSandstein} /></li>
                  <li><MdText text={inhalt.texte.chemischDurchAusfällungKalkstein} /></li>
                  <li><MdText text={inhalt.texte.biogenAusOrganischenResten} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.metamorphiteUmwandlungsgesteine} /></h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.entstehenAusÄlterenGesteinen} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li><MdText text={inhalt.texte.ausKalksteinMarmor} /></li>
                  <li><MdText text={inhalt.texte.ausSandsteinQuarzit} /></li>
                  <li><MdText text={inhalt.texte.ausTonsteinTonschieferBei} /></li>
                  <li><MdText text={inhalt.texte.ausGranitOrthogneis} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'eigenschaften' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.diePhysikalischenUndMechanischen} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.wichtigeEigenschaften} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.druckfestigkeitSehrHochBei} /></li>
                  <li><MdText text={inhalt.texte.rohdichtePorositätBestimmtDas} /></li>
                  <li><MdText text={inhalt.texte.verschleißwiderstandWichtigFürBodenbeläg} /></li>
                  <li><MdText text={inhalt.texte.witterungsbeständigkeitWiderstandGegenFr} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Anwendungsbereiche</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.granitPflastersteineBordsteineHochbelast} /></li>
                  <li><MdText text={inhalt.texte.basaltSchotterFürGleisbau} /></li>
                  <li><MdText text={inhalt.texte.kalksteinMarmorInnenraumgestaltungBöden} /></li>
                  <li><MdText text={inhalt.texte.sandsteinHistorischeBautenFassaden} /></li>
                  <li><MdText text={inhalt.texte.schieferDacheindeckungenFassadenbekleidu} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kennwerte' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.fürDieVerwendungVon} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.korngrößeKornform} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.korngrößenverteilungSieblinieBestimmtDur} /></li>
                  <li><MdText text={inhalt.texte.kornformkennzahlSiMassenanteilDer} /></li>
                  <li><MdText text={inhalt.texte.plattigkeitskennzahlFiAlternativerKennwe} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.festigkeitVerschleiß} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.losAngelesKoeffizientLa} /></li>
                  <li><MdText text={inhalt.texte.microDevalWertMde} /></li>
                  <li><MdText text={inhalt.texte.polierwiderstandPsvPolishedStone} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Dauerhaftigkeit</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.frostwiderstandPrüfungDurchFrost} /></li>
                  <li><MdText text={inhalt.texte.frostTausalzWiderstandVerschärfte} /></li>
                  <li><MdText text={inhalt.texte.alkaliKieselsäureReaktivitätAkr} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.dichteWasseraufnahme} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.rohdichteScheinbareDichteDichte} /></li>
                  <li><MdText text={inhalt.texte.wasseraufnahmeWaMasseDes} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'koernungen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.gesteinskörnungenFrüherZuschlagBilden} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.kornklassenBezeichnungen} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.gesteinsmehlFüllerKorngrößeD} /></li>
                  <li><MdText text={inhalt.texte.feineGesteinskörnungSandObere} /></li>
                  <li><MdText text={inhalt.texte.kiesSplittGrobeGesteinskörnung} /></li>
                  <li><MdText text={inhalt.texte.korngemischEineMischungVerschiedener} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.sieblinienKornzusammensetzung} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.idealsieblinienFullerEmpaMathematische} /></li>
                  <li><MdText text={inhalt.texte.regelsieblinienDin10452} /></li>
                  <li><MdText text={inhalt.texte.ausfallkörnungFehlenBestimmterMittlerer} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Herstellungsarten</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.natürlicheGesteinskörnungKiesSand} /></li>
                  <li><MdText text={inhalt.texte.gebrocheneGesteinskörnungSplittBrechsand} /></li>
                  <li><MdText text={inhalt.texte.rezyklierteGesteinskörnungRcAus} /></li>
                  <li><MdText text={inhalt.texte.künstlicheGesteinskörnungZB} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.spezifischeAnforderungen} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.betonGeringerHohlraumgehaltGute} /></li>
                  <li><MdText text={inhalt.texte.asphaltHoherPsvWert} /></li>
                  <li><MdText text={inhalt.texte.eisenbahnschotterHöchsteZähigkeitLa} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="gesteine" />
          </div>
        )}
        </ModuleTabs>
      </div>

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielKörnungszifferDerRegel}
        zielGleichung="k = \frac{1}{100} \sum R_i"
        normQuelle={inhalt.werte.sieblinieB16NachDin}
        schritte={inhalt.daten["Gesteine.schritte"]}
        ergebnisHinweis={inhalt.werte.kB16366}
      />

      <ModulTest moduleId="gesteine" />

      <ModuleFooter wikipedia={[
        { title: 'Gestein', url: 'https://de.wikipedia.org/wiki/Gestein' },
        { title: 'Gesteinskörnung', url: 'https://de.wikipedia.org/wiki/Gesteinsk%C3%B6rnung' }
      ]}
        literatur={inhalt.daten["Gesteine.literatur"]}
        regelwerke={inhalt.daten["Gesteine.regelwerke"]}
        formeln={inhalt.daten["Gesteine.formeln"]}
      />
    </div>
  );
} 