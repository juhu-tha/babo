import React, { useState } from 'react';
import { Activity, ArrowRight, Thermometer, Droplets, FlaskConical } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { motion } from 'framer-motion';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/formaenderungen/Formaenderungen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

const REITER = [
  { id: 'tabelle', label: inhalt.texte.systematikTabelle, icon: Activity },
  { id: 'visualisierung', label: inhalt.texte.interaktiveVisualisierung, icon: ArrowRight },
] as const;

export default function Formaenderungen() {
  const [activeTab, setActiveTab] = useState<'tabelle' | 'visualisierung'>('tabelle');
  const [activeVis, setActiveVis] = useState<string>('elastisch');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Activity className="text-shiraz" /><MdText text={inhalt.texte.einteilungDerFormänderungen} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.formänderungenDeformationenVonBaustoffen} /></p>
        </div>

      </div>

      <ModuleTabs label="Darstellung" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:mb-8">
      {activeTab === 'tabelle' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.einteilungDerFormänderungen2} /></h3>
          
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-off-white text-text-main">
                <tr>
                  <th className="border border-home-grau/30 px-4 py-3 bg-white"></th>
                  <th colSpan={2} className="border border-home-grau/30 px-4 py-3 text-center font-bold">spannungsabhängig</th>
                  <th className="border border-home-grau/30 px-4 py-3 text-center font-bold">spannungsunabhängig</th>
                </tr>
                <tr>
                  <th className="border border-home-grau/30 px-4 py-3 bg-white"></th>
                  <th className="border border-home-grau/30 px-4 py-2 text-center font-bold bg-home-grau/5"><MdText text={inhalt.texte.sofortAuftretend} /></th>
                  <th className="border border-home-grau/30 px-4 py-2 text-center font-bold bg-home-grau/5">zeitabhängig</th>
                  <th className="border border-home-grau/30 px-4 py-2 bg-white"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-home-grau/5">
                  <td className="border border-home-grau/30 px-4 py-4 font-bold w-1/4">
                    umkehrbar<br/>(reversibel)
                  </td>
                  <td className="border border-home-grau/30 px-4 py-4 w-1/4">
                    elastisch
                  </td>
                  <td className="border border-home-grau/30 px-4 py-4 w-1/4"><MdText text={inhalt.texte.verzögertElastischBrReversibler} /></td>
                  <td className="border border-home-grau/30 px-4 py-4 w-1/4"><MdText text={inhalt.texte.wärmedehnungBrFeuchtedehnungBr} /></td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="border border-home-grau/30 px-4 py-4 font-bold"><MdText text={inhalt.texte.nichtUmkehrbarBrIrreversibel} /></td>
                  <td className="border border-home-grau/30 px-4 py-4">
                    plastisch
                  </td>
                  <td className="border border-home-grau/30 px-4 py-4"><MdText text={inhalt.texte.viskosBrFließenIrreversibler} /></td>
                  <td className="border border-home-grau/30 px-4 py-4"><MdText text={inhalt.texte.chemischeDehnungBrSchrumpfen} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'visualisierung' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.visualisierungDerVerformungsarten} /></h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 flex flex-col gap-2">
              <div className="font-bold text-sm text-text-main mb-2">Spannungsabhängig</div>
              <button aria-pressed={activeVis === 'elastisch'} 
                onClick={() => setActiveVis('elastisch')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'elastisch' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              ><MdText text={inhalt.texte.elastischSofortReversibel} /></button>
              <button aria-pressed={activeVis === 'plastisch'} 
                onClick={() => setActiveVis('plastisch')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'plastisch' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              ><MdText text={inhalt.texte.plastischSofortIrreversibel} /></button>
              <button aria-pressed={activeVis === 'verzoegert'} 
                onClick={() => setActiveVis('verzoegert')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'verzoegert' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              ><MdText text={inhalt.texte.verzögertElastischZeitabhReversibel} /></button>
              <button aria-pressed={activeVis === 'viskos'} 
                onClick={() => setActiveVis('viskos')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'viskos' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              ><MdText text={inhalt.texte.viskosZeitabhIrreversibel} /></button>

              <div className="font-bold text-sm text-text-main mt-4 mb-2">Spannungsunabhängig</div>
              <button aria-pressed={activeVis === 'waerme'} 
                onClick={() => setActiveVis('waerme')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'waerme' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              >
                Wärmedehnung
              </button>
              <button aria-pressed={activeVis === 'feuchte'} 
                onClick={() => setActiveVis('feuchte')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'feuchte' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              >
                Feuchtedehnung
              </button>
              <button aria-pressed={activeVis === 'chemisch'} 
                onClick={() => setActiveVis('chemisch')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'chemisch' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              ><MdText text={inhalt.texte.chemischeDehnung} /></button>
            </div>

            <div className="md:col-span-3 bg-off-white rounded-xl border border-home-grau/30 p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
              
              {/* Visualisierungen */}
              {activeVis === 'elastisch' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-md">
                  <p className="text-center text-sm text-text-main/80"><MdText text={inhalt.texte.elastischeVerformungTrittSofort} /></p>
                  <div className="relative w-full h-32 flex items-center justify-center">
                    <motion.div 
                      className="w-32 h-32 bg-blue-400 rounded-lg shadow-md"
                      animate={{ 
                        scaleX: [1, 1.5, 1.5, 1],
                        scaleY: [1, 0.8, 0.8, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        times: [0, 0.2, 0.8, 1]
                      }}
                    />
                    <motion.div 
                      className="absolute top-0 flex flex-col items-center"
                      animate={{ opacity: [0, 1, 1, 0], y: [0, 10, 10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
                    >
                      <div className="text-shiraz font-bold">Kraft F</div>
                      <ArrowRight className="text-shiraz rotate-90" />
                    </motion.div>
                  </div>
                </div>
              )}

              {activeVis === 'plastisch' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-md">
                  <p className="text-center text-sm text-text-main/80"><MdText text={inhalt.texte.plastischeVerformungTrittSofort} /></p>
                  <div className="relative w-full h-32 flex items-center justify-center">
                    <motion.div 
                      className="w-32 h-32 bg-red-400 rounded-lg shadow-md"
                      animate={{ 
                        scaleX: [1, 1.5, 1.5, 1.5],
                        scaleY: [1, 0.8, 0.8, 0.8]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        times: [0, 0.2, 0.8, 1]
                      }}
                    />
                    <motion.div 
                      className="absolute top-0 flex flex-col items-center"
                      animate={{ opacity: [0, 1, 1, 0], y: [0, 10, 10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
                    >
                      <div className="text-shiraz font-bold">Kraft F</div>
                      <ArrowRight className="text-shiraz rotate-90" />
                    </motion.div>
                  </div>
                </div>
              )}

              {activeVis === 'verzoegert' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-md">
                  <p className="text-center text-sm text-text-main/80"><MdText text={inhalt.texte.verzögertElastischeVerformungNimmt} /></p>
                  <div className="relative w-full h-32 flex items-center justify-center">
                    <motion.div 
                      className="w-32 h-32 bg-purple-400 rounded-lg shadow-md"
                      animate={{ 
                        scaleX: [1, 1.1, 1.5, 1.5, 1.4, 1],
                        scaleY: [1, 0.95, 0.8, 0.8, 0.85, 1]
                      }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity,
                        times: [0, 0.1, 0.5, 0.6, 0.7, 1]
                      }}
                    />
                    <motion.div 
                      className="absolute top-0 flex flex-col items-center"
                      animate={{ opacity: [0, 1, 1, 1, 0, 0], y: [0, 10, 10, 10, 0, 0] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.1, 0.5, 0.6, 0.7, 1] }}
                    >
                      <div className="text-shiraz font-bold">Dauerlast F</div>
                      <ArrowRight className="text-shiraz rotate-90" />
                    </motion.div>
                  </div>
                </div>
              )}

              {activeVis === 'viskos' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-md">
                  <p className="text-center text-sm text-text-main/80"><MdText text={inhalt.texte.viskoseVerformungFließenNimmt} /></p>
                  <div className="relative w-full h-32 flex items-center justify-center">
                    <motion.div 
                      className="w-32 h-32 bg-orange-400 rounded-lg shadow-md"
                      animate={{ 
                        scaleX: [1, 1.1, 1.6, 1.6, 1.6],
                        scaleY: [1, 0.95, 0.7, 0.7, 0.7]
                      }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity,
                        times: [0, 0.1, 0.6, 0.7, 1]
                      }}
                    />
                    <motion.div 
                      className="absolute top-0 flex flex-col items-center"
                      animate={{ opacity: [0, 1, 1, 0, 0], y: [0, 10, 10, 0, 0] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.1, 0.6, 0.7, 1] }}
                    >
                      <div className="text-shiraz font-bold">Dauerlast F</div>
                      <ArrowRight className="text-shiraz rotate-90" />
                    </motion.div>
                  </div>
                </div>
              )}

              {activeVis === 'waerme' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-md">
                  <p className="text-center text-sm text-text-main/80"><MdText text={inhalt.texte.wärmedehnungSpannungsunabhängigeReversib} /></p>
                  <div className="relative w-full h-32 flex items-center justify-center">
                    <motion.div 
                      className="w-32 h-32 bg-red-300 rounded-lg shadow-md flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.3, 1.3, 1],
                        backgroundColor: ['#fca5a5', '#ef4444', '#ef4444', '#fca5a5']
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        times: [0, 0.4, 0.6, 1]
                      }}
                    >
                      <Thermometer className="text-white opacity-50" size={48} />
                    </motion.div>
                    <motion.div 
                      className="absolute -top-4 flex flex-col items-center"
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.6, 1] }}
                    >
                      <div className="text-shiraz font-bold bg-white/80 px-2 rounded"><MdText text={inhalt.texte.temperatur} /></div>
                    </motion.div>
                  </div>
                </div>
              )}

              {activeVis === 'feuchte' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-md">
                  <p className="text-center text-sm text-text-main/80"><MdText text={inhalt.texte.feuchtedehnungQuellenSchwindenSpannungsu} /></p>
                  <div className="relative w-full h-32 flex items-center justify-center">
                    <motion.div 
                      className="w-32 h-32 bg-blue-300 rounded-lg shadow-md flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.2, 1.2, 0.8, 0.8, 1],
                      }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity,
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                      }}
                    >
                      <Droplets className="text-white opacity-50" size={48} />
                    </motion.div>
                    <motion.div 
                      className="absolute -top-4 flex flex-col items-center"
                      animate={{ opacity: [0, 1, 0, 0, 1, 0] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
                    >
                      <div className="text-blue-600 font-bold bg-white/80 px-2 rounded"><MdText text={inhalt.texte.quellenSchwinden} /></div>
                    </motion.div>
                  </div>
                </div>
              )}

              {activeVis === 'chemisch' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-md">
                  <p className="text-center text-sm text-text-main/80"><MdText text={inhalt.texte.chemischeDehnungSpannungsunabhängigeMeis} /></p>
                  <div className="relative w-full h-32 flex items-center justify-center">
                    <motion.div 
                      className="w-32 h-32 bg-green-300 rounded-lg shadow-md flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.4, 1.4, 1.4],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        times: [0, 0.5, 0.8, 1]
                      }}
                    >
                      <FlaskConical className="text-white opacity-50" size={48} />
                    </motion.div>
                    <motion.div 
                      className="absolute -top-4 flex flex-col items-center"
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 0.8, 1] }}
                    >
                      <div className="text-green-700 font-bold bg-white/80 px-2 rounded"><MdText text={inhalt.texte.chemischeReaktion} /></div>
                    </motion.div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
      </ModuleTabs>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1WieViel}
        zielGleichung="\Delta l = \alpha_T \cdot \Delta T \cdot l"
        schritte={inhalt.daten["Formaenderungen.schritte"]}
        ergebnisHinweis={inhalt.werte.alsZugBeiAbkühlung}
        normQuelle={inhalt.werte.dinEn19921}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2KriechenEiner}
        zielGleichung="\varepsilon_{cc}(\infty,t_0) = \varphi(\infty,t_0) \cdot \frac{\sigma_c}{E_c}"
        schritte={inhalt.daten["Formaenderungen.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dieGesamtstauchungVerdreifachtSich}
        normQuelle={inhalt.werte.dinEn199212}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="formaenderungen" />

      <ModuleFooter 
        lastReviewed={inhalt.werte.oktober2026Ap5}
        wikipedia={[
          { title: 'Verformung', url: 'https://de.wikipedia.org/wiki/Verformung' },
          { title: inhalt.werte.kriechenWerkstoffe, url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
          { title: inhalt.werte.schwindenBeton, url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' }
        ]}
        literatur={inhalt.daten["Formaenderungen.literatur"]}
        regelwerke={inhalt.daten["Formaenderungen.regelwerke"]}
        formeln={inhalt.daten["Formaenderungen.formeln"]}
      />
    </div>
  );
} 