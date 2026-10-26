import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Box, Layers, Activity, BookOpen } from 'lucide-react';
import { BlockMath } from 'react-katex';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { ConceptTooltip } from '@/src/components/ui/ConceptTooltip';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import inhalt from '@/content/kalk/Kalk.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Kalk() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'festigkeit' | 'bestaendigkeit' | 'steckbrief'>('steckbrief');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="text-shiraz" /> Kalk
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.baukalkIstEinesDer} /></p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button aria-pressed={activeTab === 'steckbrief'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Baustoff-Steckbrief
          </button>
          <button aria-pressed={activeTab === 'grundlagen'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'grundlagen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('grundlagen')}
          >
            <Layers size={16} /><MdText text={inhalt.texte.technischerKalkkreislauf} /></button>
          <button aria-pressed={activeTab === 'festigkeit'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'festigkeit' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('festigkeit')}
          >
            <Activity size={16} /><MdText text={inhalt.texte.festigkeitsbildungErhärtung} /></button>
          <button aria-pressed={activeTab === 'bestaendigkeit'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'bestaendigkeit' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('bestaendigkeit')}
          >
            <Box size={16} /><MdText text={inhalt.texte.eigenschaftenNormen} /></button>
        </div>

        {activeTab === 'grundlagen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.baukalkCalciumcarbonatCalciumhydroxidGeh} /></p>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-4"><MdText text={inhalt.texte.derTechnischeKalkkreislauf} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white rounded-xl border border-home-grau/25 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.t1Brennen} /><ConceptTooltip termKey="kalzinieren" fallbackText="Kalzinieren" />)</h4>
                    <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.natürlicherKalksteinWirdBei} /></p>
                  </div>
                  <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 text-center overflow-x-auto">
                    <BlockMath math="\mathrm{CaCO}_3 \xrightarrow{\approx 900-1100^{\circ}\text{C}} \mathrm{CaO} + \mathrm{CO}_2 \uparrow" />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-home-grau/25 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.t2LöschenHydratisieren} /></h4>
                    <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.zugabeVonWasserFührt} /></p>
                  </div>
                  <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 text-center overflow-x-auto">
                    <BlockMath math="\mathrm{CaO} + \mathrm{H}_2\mathrm{O} \longrightarrow \mathrm{Ca(OH)}_2 + \text{Wärme} \quad (\Delta H < 0)" />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-home-grau/25 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.t3AbbindenKarbonatisierung} /></h4>
                    <p className="text-sm text-text-main/70 mb-3"><MdText text={inhalt.texte.erhärtungErfolgtNurWenn} /></p>
                  </div>
                  <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 text-center overflow-x-auto">
                    <BlockMath math="\mathrm{Ca(OH)}_2 + \mathrm{CO}_2 \xrightarrow{\text{Porenfeuchte}} \mathrm{CaCO}_3 + \mathrm{H}_2\mathrm{O}" />
                  </div>
                </div>
              </div>

              {/* Formel-Herleitungs-Box für den thermodynamischen Kalkkreislauf */}
              <div className="mt-6">
                <FormulaDerivationBox
                  title={inhalt.werte.thermodynamischeHerleitungEnergieEnthalp}
                  zielGleichung="\Delta H_R^0 = +178{,}2\text{ kJ/mol} \quad (\text{Brennen}) \;\longleftrightarrow\; \Delta H_R^0 = -65{,}2\text{ kJ/mol} \quad (\text{Löschen})"
                  normQuelle={inhalt.werte.thermochemischeStandardwerteLehrbuchwert}
                  ergebnisHinweis={inhalt.werte.vollständigerChemischEnergetischerZyklus}
                  schritte={inhalt.daten["Kalk.schritte"]}
                />
              </div>
            </div>
            
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
               <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.artenVonBaukalk} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.kurzzeichenNachDinEn} /></li>
                  <li><MdText text={inhalt.texte.luftkalkeWeißkalkDolomitkalkErhärten} /></li>
                  <li><MdText text={inhalt.texte.wasserkalkHydraulischerKalkHl} /></li>
                </ul>
            </div>
          </div>
        )}

        {activeTab === 'festigkeit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.dieFestigkeitsbildungVonLuftkalk} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.mechanismusDerErhärtung} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.karbonatisierungDieGelöstenCalciumhydrox} /></li>
                  <li><MdText text={inhalt.texte.wasserAlsKatalysatorDieser} /></li>
                  <li><MdText text={inhalt.texte.dieseKristalleVerfilzenBeim} /></li>
                </ul>
              </div>

               <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Festigkeitsentwicklung</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.langsamerProzessDieCo} /></li>
                  <li><MdText text={inhalt.texte.geringereEndfestigkeitReineLuftkalkmörte} /></li>
                  <li><MdText text={inhalt.texte.plastizitätVerformbarkeitWegenDer} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bestaendigkeit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.kalkZeichnetSichDurch} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.hygienischeUndBauphysikalischeFunktion} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.alkalitätDesinfektionBaukalkIst} /></li>
                  <li><MdText text={inhalt.texte.feuchtemanagementKalkputzeOhneKunstharzz} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.chemischeBeständigkeit} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.frostgefahrBeimAbbindenWenn} /></li>
                  <li><MdText text={inhalt.texte.saurerRegenSoDie} /></li>
                </ul>
              </div>

               <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 md:col-span-2">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.sicherheitArbeitsschutz} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.ätzendeWirkungUngelöschterBranntkalk} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="kalk" />
          </div>
        )}
      </div>

      <ModulTest moduleId="kalk" />

      <ModuleFooter wikipedia={[
        { title: 'Kalk', url: 'https://de.wikipedia.org/wiki/Kalk' },
        { title: 'Kalkmörtel', url: 'https://de.wikipedia.org/wiki/Kalkm%C3%B6rtel' },
        { title: 'Baukalk', url: 'https://de.wikipedia.org/wiki/Baukalk' }
      ]}
        literatur={inhalt.daten["Kalk.literatur"]}
        normIds={['DIN_EN_459_1', 'DIN_EN_998', 'DIN_EN_13914']}
        regelwerke={inhalt.daten["Kalk.regelwerke"]}
        formeln={inhalt.daten["Kalk.formeln"]}
      />
    </div>
  );
}
