import React, { useState } from 'react';
import { Box, Layers, BookOpen } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import inhalt from '@/content/daemmstoffe/Daemmstoffe.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Daemmstoffe() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'info'>('steckbrief');

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="w-5 h-5 text-shiraz" />
          Dämmstoffe
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.materialienZurWärmedämmungDeren} /></p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-2">
          <button aria-pressed={activeTab === 'steckbrief'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Baustoff-Steckbrief
          </button>
          <button aria-pressed={activeTab === 'info'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
              activeTab === 'info' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('info')}
          >
            <Layers size={16} /><MdText text={inhalt.texte.materialienDämmung} /></button>
        </div>

        {activeTab === 'info' && (
          <div className="p-6 space-y-8 animate-in fade-in duration-300">
            
            {/* Mineralische Dämmstoffe */}
            <section>
              <h3 className="text-xl font-bold text-home-prim mb-4"><MdText text={inhalt.texte.anorganischMineralischeDämmstoffe} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.mineralwolleGlaswolleSteinwolle} /></h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.rohstoffeAltglasGlaswolleBzw} /></li>
                    <li><MdText text={inhalt.texte.wärmeleitfähigkeit00320} /></li>
                    <li><MdText text={inhalt.texte.brandschutzNichtBrennbarA1} /></li>
                    <li><MdText text={inhalt.texte.eigenschaftenHochDampfdiffusionsoffen1} /></li>
                  </ul>
                </div>
                
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.schaumglasCellularGlass} /></h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.rohstoffeAufgeschäumtesAltglasMit} /></li>
                    <li><MdText text={inhalt.texte.wärmeleitfähigkeit00360} /></li>
                    <li><MdText text={inhalt.texte.brandschutzNichtBrennbarA12} /></li>
                    <li><MdText text={inhalt.texte.eigenschaftenAbsolutWasserUnd} /></li>
                    <li><MdText text={inhalt.texte.einsatzPerimeterdämmungUnterLastabtragen} /></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Synthetische Dämmstoffe */}
            <section>
              <h3 className="text-xl font-bold text-home-prim mb-4"><MdText text={inhalt.texte.organischSynthetischeDämmstoffe} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.epsExpandiertesPolystyrolStyropor} /></h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.strukturAufgeschäumtesGranulatBesteht} /></li>
                    <li><MdText text={inhalt.texte.wärmeleitfähigkeit00310} /></li>
                    <li><MdText text={inhalt.texte.brandschutzMitFlammschutzmittelnEuroklas} /></li>
                    <li><MdText text={inhalt.texte.einsatzStandardImWdvs} /></li>
                  </ul>
                </div>

                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.xpsExtrudiertesPolystyrolStyrodur} /></h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.strukturGeschlossenzelligeSchaumstruktur} /></li>
                    <li><MdText text={inhalt.texte.wärmeleitfähigkeit003202} /></li>
                    <li><MdText text={inhalt.texte.eigenschaftenHoheDruckfestigkeitWasserab} /></li>
                    <li><MdText text={inhalt.texte.einsatzPerimeterdämmungUmkehrdächerFrost} /></li>
                  </ul>
                </div>

                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.purPirPolyurethanHartschaum} /></h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.wärmeleitfähigkeit00220} /></li>
                    <li><MdText text={inhalt.texte.brandschutzBrennbarAberNicht} /></li>
                    <li><MdText text={inhalt.texte.vorteilSehrSchlankeAufbauten} /></li>
                    <li><MdText text={inhalt.texte.einsatzAufsparrendämmungFlachdach} /></li>
                  </ul>
                </div>
                
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.vakuumisolationspaneeleVip} /></h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.prinzipEvakuierterKernAus} /></li>
                    <li><MdText text={inhalt.texte.wärmeleitfähigkeit00040} /></li>
                    <li><MdText text={inhalt.texte.nachteilDarfNichtBeschädigt} /></li>
                    <li><MdText text={inhalt.texte.einsatzWennExtremWenig} /></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Naturdämmstoffe */}
            <section>
              <h3 className="text-xl font-bold text-home-prim mb-4"><MdText text={inhalt.texte.nachwachsendeNaturdämmstoffe} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.holzfaserZellulose} /></h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.wärmeleitfähigkeit00380} /></li>
                    <li><MdText text={inhalt.texte.sommerlicherWärmeschutzSehrGut} /></li>
                    <li><MdText text={inhalt.texte.verarbeitungAlsPlattenOder} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.hanfJuteSchafwolle} /></h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.besonderheitSchafwolleKannViel} /></li>
                    <li><MdText text={inhalt.texte.umweltSehrGuteCo} /></li>
                  </ul>
                </div>
              </div>
            </section>

          </div>
        )}

        {activeTab === 'steckbrief' && (
          <div className="p-6 animate-in fade-in duration-300">
            <BaustoffProfil materialKey="daemmstoffe" />
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielErforderlicheDämmstoff}
          zielGleichung="d_D = \lambda_D \cdot \left(\frac{1}{U_{Ziel}} - R_{si} - R_{se} - \sum \frac{d_i}{\lambda_i}\right)"
          normQuelle={inhalt.werte.dinEnIso6946}
          schritte={inhalt.daten["Daemmstoffe.schritte"]}
          ergebnisHinweis={inhalt.werte.dieWärmeleitfähigkeitBestimmtDie}
        />
      </div>

      <ModulTest moduleId="daemmstoffe" />

      <ModuleFooter
        wikipedia={[
          { title: 'Wärmedämmung', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmed%C3%A4mmung' },
          { title: 'Dämmstoff', url: 'https://de.wikipedia.org/wiki/D%C3%A4mmstoff' }
        ]}
        literatur={inhalt.daten["Daemmstoffe.literatur"]}
        regelwerke={inhalt.daten["Daemmstoffe.regelwerke"]}
        weblinks={inhalt.daten["Daemmstoffe.weblinks"]}
        formeln={inhalt.daten["Daemmstoffe.formeln"]}
      />
    </div>
  );
}
