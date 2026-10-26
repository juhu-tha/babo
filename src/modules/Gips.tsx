import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Box, Layers, Activity, ArrowRight, ArrowDown, ArrowLeft, BookOpen } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import inhalt from '@/content/gips/Gips.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

export default function Gips() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'festigkeit' | 'bestaendigkeit' | 'steckbrief'>('steckbrief');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="text-shiraz" /> Gips
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.gipsCalciumsulfatIstEin} /></p>
        </div>

        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'steckbrief' as const, label: 'Baustoff-Steckbrief', icon: BookOpen },
            { id: 'grundlagen' as const, label: inhalt.texte.grundlagenHydratation, icon: Layers },
            { id: 'festigkeit' as const, label: 'Festigkeitsbildung', icon: Activity },
            { id: 'bestaendigkeit' as const, label: inhalt.texte.beständigkeitNormen, icon: Box },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6"
        >

        {activeTab === 'grundlagen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.gipsCalciumsulfatIstEin2} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.herstellungBrennen} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.rohstoffCalciumsulfatDihydratCaso} /></li>
                  <li><MdText text={inhalt.texte.beimErhitzenCa100} /><BlockMath math="CaSO_4 \cdot 2H_2O \rightarrow CaSO_4 \cdot 0{,}5H_2O + 1{,}5H_2O" /></li>
                  <li><MdText text={inhalt.texte.beiHöherenTemperaturen180} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.abbindeprozessReaktion} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.lösenDasAusGebranntem} /></li>
                  <li><MdText text={inhalt.texte.kristallisationAusDerÜbersättigten} /></li>
                  <li><strong>Reaktionsgleichung:</strong> <br/><BlockMath math="CaSO_4 \cdot 0{,}5H_2O + 1{,}5H_2O \rightarrow CaSO_4 \cdot 2H_2O" /></li>
                  <li><MdText text={inhalt.texte.volumenänderungDasMaterialDehnt} /></li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 mt-6 shadow-sm">
              <h3 className="font-bold text-shiraz text-lg mb-6 text-center"><MdText text={inhalt.texte.derGipskreislauf} /></h3>
              
              <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-4">
                 {/* Top row */}
                 <div className="flex justify-between items-center w-full relative z-10">
                    <div className="bg-off-white border-2 border-home-grau/30 p-4 rounded-xl w-40 text-center shadow-sm">
                       <div className="font-bold text-text-main mb-1">Gipsstein</div>
                       <div className="text-xs text-text-main/70 font-mono">CaSO₄·2H₂O</div>
                       <div className="text-[10px] text-text-main/50 mt-1">Dihydrat</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                       <div className="text-xs font-bold text-shiraz bg-white px-2 mb-1">Brennen</div>
                       <div className="text-[10px] text-text-main/60"><MdText text={inhalt.texte.t15HO} /></div>
                       <ArrowRight className="text-home-grau" />
                    </div>
                    
                    <div className="bg-white border-2 border-shiraz/50 p-4 rounded-xl w-40 text-center shadow-md relative">
                       <div className="absolute -top-3 -right-3 bg-shiraz text-white text-[10px] font-bold px-2 py-1 rounded-full">Bindemittel</div>
                       <div className="font-bold text-shiraz mb-1">Stuckgips</div>
                       <div className="text-xs text-text-main/70 font-mono">CaSO₄·0,5H₂O</div>
                       <div className="text-[10px] text-text-main/50 mt-1">Halbhydrat</div>
                    </div>
                 </div>
                 
                 {/* Right vertical arrow */}
                 <div className="flex w-full justify-end pr-16 relative z-0 -my-2">
                    <div className="flex flex-col items-center mr-[16px]">
                       <div className="text-xs font-bold text-shiraz bg-white px-2 mt-2 mb-1"><MdText text={inhalt.texte.wasserHO} /></div>
                       <div className="text-[10px] text-text-main/60">Anmischen</div>
                       <ArrowDown className="text-home-grau mt-2" />
                    </div>
                 </div>
                 
                 {/* Bottom row */}
                 <div className="flex justify-between items-center w-full relative z-10">
                    <div className="flex flex-col items-center invisible w-40">
                       {/* Placeholder for layout */}
                    </div>
                    
                    <div className="flex flex-col items-center w-full">
                       <ArrowLeft className="text-home-grau mb-1" />
                       <div className="text-xs font-bold text-shiraz bg-white px-2 mt-1"><MdText text={inhalt.texte.abbindenHydratation} /></div>
                       <div className="text-[10px] text-text-main/60"><MdText text={inhalt.texte.kristallisationWärme} /></div>
                    </div>
                    
                    <div className="bg-off-white border-2 border-home-grau/30 p-4 rounded-xl w-40 text-center shadow-sm">
                       <div className="font-bold text-text-main mb-1"><MdText text={inhalt.texte.erhärteterGips} /></div>
                       <div className="text-xs text-text-main/70 font-mono">CaSO₄·2H₂O</div>
                       <div className="text-[10px] text-text-main/50 mt-1">Dihydrat-Kristallgefüge</div>
                    </div>
                 </div>
                 
              </div>
            </div>

          </div>
        )}

        {activeTab === 'festigkeit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.dieMechanischenEigenschaftenUnd} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.mechanismusDerErhärtung} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.kristallverfilzungDieFestigkeitEntsteht} /></li>
                  <li><MdText text={inhalt.texte.keineChemischeVernetzungIm} /></li>
                  <li><MdText text={inhalt.texte.dieFestigkeitIstSofort} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.einflussfaktorenDerFestigkeit} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.porositätFürDieVerarbeitbarkeit} /></li>
                  <li><MdText text={inhalt.texte.wGWertEin} /></li>
                  <li><MdText text={inhalt.texte.feuchtegehaltGipsVerliertIm} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bestaendigkeit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.gipsIstHervorragendFür} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.wasserUndFeuchtebeständigkeit} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.löslichkeitCalciumsulfatIstIn} /></li>
                  <li><MdText text={inhalt.texte.trockenbereichGipsbaustoffeEignenSich} /></li>
                  <li><MdText text={inhalt.texte.feuchträumeInStarkFeuchtebelasteten} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.brandschutzBaulicherBrandschutz} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.kristallwasserGipsEnthältIm} /></li>
                  <li><MdText text={inhalt.texte.endothermeReaktionImBrandfall} /></li>
                  <li><MdText text={inhalt.texte.feuerschutzplattenGkfBesitzenEine} /></li>
                </ul>
              </div>

               <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 md:col-span-2">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.chemischeUnverträglichkeiten} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.ettringittreibenGipsDarfNicht} /></li>
                  <li><MdText text={inhalt.texte.korrosionAnMetallenGips} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="gips" />
          </div>
        )}
        </ModuleTabs>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielWasserbedarfUndPorosit}
          zielGleichung="\text{CaSO}_4 \cdot \tfrac{1}{2}\,\text{H}_2\text{O} + 1\tfrac{1}{2}\,\text{H}_2\text{O} \rightarrow \text{CaSO}_4 \cdot 2\,\text{H}_2\text{O}"
          normQuelle={inhalt.werte.stöchiometrieDichtenAlsLehrwerte}
          schritte={inhalt.daten["Gips.schritte"]}
          ergebnisHinweis={inhalt.werte.rundDieHälfteDes}
        />
      </div>

      <ModulTest moduleId="gips" />

      <ModuleFooter wikipedia={[
        { title: 'Gips', url: 'https://de.wikipedia.org/wiki/Gips' },
        { title: 'Gipskarton', url: 'https://de.wikipedia.org/wiki/Gipskarton' },
        { title: 'Calciumsulfat', url: 'https://de.wikipedia.org/wiki/Calciumsulfat' }
      ]}
        literatur={inhalt.daten["Gips.literatur"]}
        regelwerke={inhalt.daten["Gips.regelwerke"]}
        formeln={inhalt.daten["Gips.formeln"]}
      />
    </div>
  );
}
