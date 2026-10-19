import React, { useState } from 'react';
import { Activity, ArrowRight, Thermometer, Droplets, FlaskConical } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { motion } from 'framer-motion';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

export default function Formaenderungen() {
  const [activeTab, setActiveTab] = useState<'tabelle' | 'visualisierung'>('tabelle');
  const [activeVis, setActiveVis] = useState<string>('elastisch');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Activity className="text-shiraz" /> Einteilung der Formänderungen
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Formänderungen (Deformationen) von Baustoffen lassen sich systematisch nach ihrer Ursache (spannungsabhängig vs. spannungsunabhängig), 
            ihrem zeitlichen Verlauf (sofort vs. zeitabhängig) und ihrer Reversibilität (umkehrbar vs. nicht umkehrbar) einteilen.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'tabelle' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('tabelle')}
          >
            <Activity size={16} /> Systematik (Tabelle)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'visualisierung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('visualisierung')}
          >
            <ArrowRight size={16} /> Interaktive Visualisierung
          </button>
        </div>
      </div>

      {activeTab === 'tabelle' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Einteilung der Formänderungen</h3>
          
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
                  <th className="border border-home-grau/30 px-4 py-2 text-center font-bold bg-home-grau/5">sofort auftretend</th>
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
                  <td className="border border-home-grau/30 px-4 py-4 w-1/4">
                    verzögert elastisch<br/>
                    (reversibler Kriechanteil)
                  </td>
                  <td className="border border-home-grau/30 px-4 py-4 w-1/4">
                    Wärmedehnung<br/>
                    Feuchtedehnung<br/>
                    (Schwinden, Quellen – bei Beton teils irreversibel)
                  </td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="border border-home-grau/30 px-4 py-4 font-bold">
                    nicht umkehrbar<br/>(irreversibel)
                  </td>
                  <td className="border border-home-grau/30 px-4 py-4">
                    plastisch
                  </td>
                  <td className="border border-home-grau/30 px-4 py-4">
                    viskos<br/>
                    (Fließen, irreversibler Kriechanteil)
                  </td>
                  <td className="border border-home-grau/30 px-4 py-4">
                    chemische Dehnung<br/>
                    (Schrumpfen, Treiben)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'visualisierung' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Visualisierung der Verformungsarten</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 flex flex-col gap-2">
              <div className="font-bold text-sm text-text-main mb-2">Spannungsabhängig</div>
              <button 
                onClick={() => setActiveVis('elastisch')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'elastisch' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              >
                Elastisch (sofort, reversibel)
              </button>
              <button 
                onClick={() => setActiveVis('plastisch')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'plastisch' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              >
                Plastisch (sofort, irreversibel)
              </button>
              <button 
                onClick={() => setActiveVis('verzoegert')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'verzoegert' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              >
                Verzögert elastisch (zeitabh., reversibel)
              </button>
              <button 
                onClick={() => setActiveVis('viskos')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'viskos' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              >
                Viskos (zeitabh., irreversibel)
              </button>

              <div className="font-bold text-sm text-text-main mt-4 mb-2">Spannungsunabhängig</div>
              <button 
                onClick={() => setActiveVis('waerme')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'waerme' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              >
                Wärmedehnung
              </button>
              <button 
                onClick={() => setActiveVis('feuchte')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'feuchte' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              >
                Feuchtedehnung
              </button>
              <button 
                onClick={() => setActiveVis('chemisch')}
                className={`p-3 text-left rounded-lg text-sm transition-colors ${activeVis === 'chemisch' ? 'bg-shiraz text-white' : 'bg-off-white hover:bg-home-grau/20'}`}
              >
                Chemische Dehnung
              </button>
            </div>

            <div className="md:col-span-3 bg-off-white rounded-xl border border-home-grau/30 p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
              
              {/* Visualisierungen */}
              {activeVis === 'elastisch' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-md">
                  <p className="text-center text-sm text-text-main/80">
                    <strong>Elastische Verformung:</strong> Tritt sofort bei Belastung auf und verschwindet sofort nach Entlastung vollständig.
                  </p>
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
                  <p className="text-center text-sm text-text-main/80">
                    <strong>Plastische Verformung:</strong> Tritt sofort bei Belastung auf, bleibt aber nach Entlastung dauerhaft bestehen.
                  </p>
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
                  <p className="text-center text-sm text-text-main/80">
                    <strong>Verzögert elastische Verformung:</strong> Nimmt unter konstanter Last mit der Zeit zu und bildet sich nach Entlastung mit der Zeit wieder zurück (reversibler Anteil des Kriechens).
                  </p>
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
                  <p className="text-center text-sm text-text-main/80">
                    <strong>Viskose Verformung (Fließen):</strong> Nimmt unter konstanter Last mit der Zeit zu und bleibt nach Entlastung bestehen. Zusammen mit dem verzögert elastischen Anteil bildet sie das <em>Kriechen</em>.
                  </p>
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
                  <p className="text-center text-sm text-text-main/80">
                    <strong>Wärmedehnung:</strong> Spannungsunabhängige, reversible Längen- bzw. Volumenänderung durch Temperaturänderung: Δl = α_T · ΔT · l.
                  </p>
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
                      <div className="text-shiraz font-bold bg-white/80 px-2 rounded">+ Temperatur</div>
                    </motion.div>
                  </div>
                </div>
              )}

              {activeVis === 'feuchte' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-md">
                  <p className="text-center text-sm text-text-main/80">
                    <strong>Feuchtedehnung (Quellen/Schwinden):</strong> Spannungsunabhängige Volumenänderung durch Feuchtigkeitsaufnahme (Quellen) oder -abgabe (Schwinden). Beim Beton ist ein Teil des ersten Trocknungsschwindens irreversibel.
                  </p>
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
                      <div className="text-blue-600 font-bold bg-white/80 px-2 rounded">Quellen / Schwinden</div>
                    </motion.div>
                  </div>
                </div>
              )}

              {activeVis === 'chemisch' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-md">
                  <p className="text-center text-sm text-text-main/80">
                    <strong>Chemische Dehnung:</strong> Spannungsunabhängige, meist irreversible Volumenänderung durch chemische Reaktionen (z. B. chemisches Schrumpfen bei der Hydratation, Treiben durch Ettringit- oder AKR-Bildung).
                  </p>
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
                      <div className="text-green-700 font-bold bg-white/80 px-2 rounded">Chemische Reaktion</div>
                    </motion.div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Wie viel verlängert sich eine 30 m lange Betonwand im Sommer?"
        zielGleichung="\Delta l = \alpha_T \cdot \Delta T \cdot l"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Wandlänge 30 m ohne Fuge, Temperaturdifferenz zwischen Winter- und Sommerzustand 40 K, Wärmedehnzahl von Beton nach DIN EN 1992-1-1, 3.1.3: 10 · 10⁻⁶ 1/K.', formel: 'l = 30\\,000\\,\\text{mm},\\quad \\Delta T = 40\\,\\text{K}' },
          { titel: 'Längenänderung', erklaerung: 'Einsetzen:', formel: '\\Delta l = 10 \\cdot 10^{-6} \\cdot 40 \\cdot 30\\,000 = 12\\,\\text{mm}' },
          { titel: 'Behinderung', erklaerung: 'Wäre die Dehnung vollständig behindert, entstünde (ohne Kriechen, E = 33 000 N/mm²) die Spannung:', formel: '\\sigma = E \\cdot \\alpha_T \\cdot \\Delta T = 33\\,000 \\cdot 4 \\cdot 10^{-4} = 13{,}2\\,\\text{N/mm}^2' }
        ]}
        ergebnisHinweis="Als Zug bei Abkühlung liegen 13,2 N/mm² weit über der Betonzugfestigkeit (≈ 3 N/mm²) – deshalb Fugen oder Bewehrung zur Rissbreitenbegrenzung."
        normQuelle="DIN EN 1992-1-1, 3.1.3 (α_T = 10 · 10⁻⁶ 1/K)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Kriechen einer Stütze unter Dauerlast"
        zielGleichung="\varepsilon_{cc}(\infty,t_0) = \varphi(\infty,t_0) \cdot \frac{\sigma_c}{E_c}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'C30/37, E_cm = 33 000 N/mm², Dauerspannung σ_c = 10 N/mm², Endkriechzahl φ = 2,0 (aus DIN EN 1992-1-1, Bild 3.1).', formel: 'E_c = 1{,}05 \\cdot E_{cm} = 34\\,650\\,\\text{N/mm}^2' },
          { titel: 'Elastische Dehnung', erklaerung: 'Sofortige Stauchung bei Belastung:', formel: '\\varepsilon_{el} = \\frac{10}{34\\,650} = 0{,}29\\,\\text{‰}' },
          { titel: 'Kriechdehnung', erklaerung: 'Zeitabhängiger Zuwachs bis t = ∞:', formel: '\\varepsilon_{cc} = 2{,}0 \\cdot 0{,}29 = 0{,}58\\,\\text{‰}' }
        ]}
        ergebnisHinweis="Die Gesamtstauchung verdreifacht sich durch Kriechen auf etwa 0,87 ‰ – eine 3 m hohe Stütze verkürzt sich um rund 2,6 mm (zuzüglich Schwinden)."
        normQuelle="DIN EN 1992-1-1, 3.1.4, Gl. (3.6)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="formaenderungen" />

      <ModuleFooter 
        lastReviewed="Oktober 2026 (AP 5 Mechanik: Systematik der Formänderungen, Kriechen und Schwinden nach DIN EN 1992-1-1 geprüft; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Verformung', url: 'https://de.wikipedia.org/wiki/Verformung' },
          { title: 'Kriechen (Werkstoffe)', url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
          { title: 'Schwinden (Beton)', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Neville, A. M.: Properties of Concrete. 5th ed., Harlow: Pearson 2011',
          'Grübl, P.; Weigler, H.; Karl, S.: Beton – Arten, Herstellung und Eigenschaften. 2. Aufl., Berlin: Ernst & Sohn 2001'
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (3.1.4 und Anhang B: Kriechen und Schwinden)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' },
          { title: 'DIN EN 12390-16 (EN 12390-16:2019; Prüfung von Festbeton – Bestimmung des Schwindens von Beton)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12390-16' }
        ]}
        formeln={[
          {
            formel: '\\varepsilon_{\\text{ges}}(t) = \\varepsilon_{\\text{el}} + \\varepsilon_{cc}(t, t_0) + \\varepsilon_{cs}(t, t_s) + \\varepsilon_{th}(t)',
            erklaerung: 'Gesamtverformung eines lastbeanspruchten Betonbauteils: Summe aus elastischer Dehnung ε_el, Kriechdehnung ε_cc, Gesamtschwinddehnung ε_cs (Autogen- + Trocknungsschwinden) und thermischer Dehnung ε_th.',
            quelle: 'DIN EN 1992-1-1 Abs. 3.1.4'
          },
          {
            formel: '\\varepsilon_{cc}(t, t_0) = \\frac{\\sigma_c(t_0)}{E_{c}(t_0)} \\cdot \\varphi(t, t_0)',
            erklaerung: 'Kriechdehnung zum Zeitpunkt t infolge einer Dauerlastspannung σ_c bei Erstbelastung t_0 mit Kriechzahl φ(t, t0).',
            quelle: 'DIN EN 1992-1-1, Gl. 3.6 (mit Ec = 1,05·Ecm)'
          }
        ]}
      />
    </div>
  );
} 