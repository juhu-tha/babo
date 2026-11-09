import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { PaintRoller, Layers, Droplets, Grid, Hammer, Box } from 'lucide-react';
import inhalt from '@/content/ausbau/Ausbau.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

type AusbauReiter = 'trockenbau' | 'anstrich' | 'abdichtung' | 'keramik' | 'estriche' | 'kleben';
const REITER: readonly ModulTab<AusbauReiter>[] = [
  { id: 'trockenbau', label: 'Trockenbau', icon: Layers },
  { id: 'estriche', label: inhalt.texte.estricheBöden.trim(), icon: Box },
  { id: 'keramik', label: inhalt.texte.keramikFliesen.trim(), icon: Grid },
  { id: 'anstrich', label: 'Anstrichsysteme', icon: PaintRoller },
  { id: 'abdichtung', label: 'Abdichtungen', icon: Droplets },
  { id: 'kleben', label: 'Kleben', icon: Hammer },
];

export default function Ausbau() {
  const [activeTab, setActiveTab] = useState<AusbauReiter>('trockenbau');

  return (
    <div className="flex flex-col gap-8">
      {/* Modulüberschrift nach der Regel „Modultitel“ (docs/architektur.md) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.ausbauModultitel} /></h2>
        <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.ausbauModulEinleitung} /></p>
      </div>
      <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-8 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        {activeTab === 'trockenbau' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          Trockenbau
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.derTrockenbauUmfasstRaumbegrenzende} /></p>
        </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.gipskartonplattenGkb} /></h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.bestehenAusEinemGipskern} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li><MdText text={inhalt.texte.standardGkbFürNormale} /></li>
                  <li><MdText text={inhalt.texte.imprägniertGkbiFürFeuchträume} /></li>
                  <li><MdText text={inhalt.texte.feuerschutzGkfMitGlasfasern} /></li>
                </ul>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Gipsfaserplatten</h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.bestehenAusEinemGemisch} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li><MdText text={inhalt.texte.höhereMechanischeFestigkeitAls} /></li>
                  <li><MdText text={inhalt.texte.bessererSchallschutzDurchHöhere} /></li>
                  <li><MdText text={inhalt.texte.wenigerFeuchteempfindlichAlsGkb} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'estriche' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text-main"><MdText text={inhalt.texte.estricheBöden2} /></h2>
            <p className="text-text-main/80"><MdText text={inhalt.texte.estricheDienenAlsUntergrund} /></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.zementestrichCt} /></h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.derAmHäufigstenVerwendete} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li><MdText text={inhalt.texte.unempfindlichGegenFeuchtigkeitAuch} /></li>
                  <li><MdText text={inhalt.texte.hoheFestigkeit} /></li>
                  <li><MdText text={inhalt.texte.neigtZumSchwindenFugen} /></li>
                  <li><MdText text={inhalt.texte.langeTrocknungszeitBelegreife} /></li>
                </ul>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.calciumsulfatestrichCa} /></h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.bindemittelIstCalciumsulfatAnhydrit} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li><MdText text={inhalt.texte.sehrSchwindarmGroßeFugenlose} /></li>
                  <li><MdText text={inhalt.texte.umschließtHeizrohreAlsFließestrich} /></li>
                  <li><MdText text={inhalt.texte.empfindlichGegenFeuchtigkeitNicht} /></li>
                </ul>
              </div>
            </div>
            <div className="my-6">
              <FormulaDerivationBox
                title={inhalt.werte.anwendungsbeispielLängenänderungEinesHei}
                zielGleichung="\Delta L = L_0 \cdot \alpha_T \cdot \Delta T + L_0 \cdot \varepsilon_{cs}"
                normQuelle={inhalt.werte.tUndCsAls}
                schritte={inhalt.daten["Ausbau.schritte"]}
                ergebnisHinweis={inhalt.werte.rund3MmDehnung}
              />
            </div>


            <h3 className="text-xl font-bold text-text-main mt-4 border-t border-home-grau/30 pt-6">Bodenbeläge</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.parkettLaminat} /></h4>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.holzbasierteBelägeParkettBesteht} /></p>
                <div className="text-sm text-text-main/70"><MdText text={inhalt.texte.verlegungSchwimmendMitTrittschalldämmung} /></div>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.elastischeBeläge} /></h4>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.dazuGehörenPvcPolyvinylchlorid} /></p>
                <div className="text-sm text-text-main/70"><MdText text={inhalt.texte.eigenschaftenFußwarmUndPflegeleicht} /></div>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.textileBeläge} /></h4>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.teppichbödenAusSynthetischenFasern} /></p>
                <div className="text-sm text-text-main/70"><MdText text={inhalt.texte.eigenschaftenSehrGuteSchallabsorption} /></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keramik' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text-main"><MdText text={inhalt.texte.keramikFliesen2} /></h2>
            <p className="text-text-main/80"><MdText text={inhalt.texte.keramischeFliesenUndPlatten} /></p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Steingut</h3>
                <div className="text-xs font-bold text-home-grau uppercase mb-2"><MdText text={inhalt.texte.wasseraufnahme10} /></div>
                <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.poröserScherbenLeichtZu} /></p>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Steinzeug</h3>
                <div className="text-xs font-bold text-home-grau uppercase mb-2"><MdText text={inhalt.texte.wasseraufnahme3} /></div>
                <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.dichtGesinterterScherbenHohe} /></p>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Feinsteinzeug</h3>
                <div className="text-xs font-bold text-home-grau uppercase mb-2"><MdText text={inhalt.texte.wasseraufnahme05} /></div>
                <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.sehrDichtGesintertSehr} /></p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'anstrich' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text-main">Anstrichsysteme</h2>
            <p className="text-text-main/80"><MdText text={inhalt.texte.anstricheDienenDemSchutz} /></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Dispersionsfarben</h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.bindemittelKunstharzeSindAls} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li><MdText text={inhalt.texte.meistverwendeteInnenwandfarbe} /></li>
                  <li><MdText text={inhalt.texte.wasserverdünnbarGeruchsarm} /></li>
                  <li><MdText text={inhalt.texte.bildetEinenFilmAuf} /></li>
                </ul>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.silikatfarbenMineralfarben} /></h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.bindemittelIstKaliwasserglasTrocknen} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li><MdText text={inhalt.texte.verbindenSichUnlösbarMit} /></li>
                  <li><MdText text={inhalt.texte.sehrDiffusionsoffenAtmungsaktiv} /></li>
                  <li><MdText text={inhalt.texte.natürlichAlkalischSchimmelhemmend} /></li>
                  <li><MdText text={inhalt.texte.nurAufMineralischenUntergründen} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'abdichtung' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text-main">Abdichtungen</h2>
            <p className="text-text-main/80"><MdText text={inhalt.texte.bauwerksabdichtungenSchützenDasGebäude} /></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.bituminöseAbdichtungen} /></h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.bitumenWirdAlsRückstand} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li><MdText text={inhalt.texte.bitumenbahnenWerdenGeflämmtOder} /></li>
                  <li><MdText text={inhalt.texte.pmbcPolymerbitumendickbeschichtungSpacht} /></li>
                </ul>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.kunststoffUndElastomerbahnen} /></h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.hochpolymereBahnenZB} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li><MdText text={inhalt.texte.meistEinlagigeVerlegungFlachdach} /></li>
                  <li><MdText text={inhalt.texte.verbindungDurchHeißluftschweißenOder} /></li>
                  <li><MdText text={inhalt.texte.sehrFlexibelUndWitterungsbeständig} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kleben' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text-main"><MdText text={inhalt.texte.klebenSchäumenImBauwesen} /></h2>
            <p className="text-text-main/80"><MdText text={inhalt.texte.klebenIstEinStoffschlüssiges} /></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Dispersionsklebstoffe</h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.bindemittelInWasserDispergiert} /></p>
                <div className="text-sm text-text-main/70"><MdText text={inhalt.texte.einsatzBodenbelägePvcTeppich} /></div>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Reaktionsharzklebstoffe</h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.abbindenDurchChemischeReaktion} /></p>
                <div className="text-sm text-text-main/70"><MdText text={inhalt.texte.einsatzHochfesteVerbindungenStrukturelle} /></div>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.zementäreKleber} /></h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.hydraulischAbbindendZementWasser} /></p>
                <div className="text-sm text-text-main/70"><MdText text={inhalt.texte.einsatzFliesenkleberNatursteinWdvs} /></div>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.bauschaumMontageschaum} /></h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.meistPolyurethanPuSchaum} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li><MdText text={inhalt.texte.t1KSchaumBenötigt} /></li>
                  <li><MdText text={inhalt.texte.t2KSchaumHärtet} /></li>
                  <li><MdText text={inhalt.texte.einsatzFensterUndTürenmontage} /></li>
                  <li><MdText text={inhalt.texte.achtungNichtUvBeständig} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      </ModuleTabs>

      <ModulTest moduleId="ausbau" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Trockenbau', url: 'https://de.wikipedia.org/wiki/Trockenbau' },
          { title: 'Estrich', url: 'https://de.wikipedia.org/wiki/Estrich' },
          { title: 'Fliese', url: 'https://de.wikipedia.org/wiki/Fliese' },
          { title: 'Bauschäumen', url: 'https://de.wikipedia.org/wiki/Montageschaum' }
        ]}
        literatur={inhalt.daten["Ausbau.literatur"]}
        regelwerke={inhalt.daten["Ausbau.regelwerke"]}
        formeln={inhalt.daten["Ausbau.formeln"]}
      />
    </div>
  );
} 