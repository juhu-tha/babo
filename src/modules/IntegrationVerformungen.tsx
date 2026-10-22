import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Network, ThermometerSun, Layers, Activity, Timer, ArrowRight, AlertTriangle } from 'lucide-react';

export default function IntegrationVerformungen() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
          <Network className="text-shiraz" /> Ganzheitliches Modell: Frühes Betonalter & Rissbildung
        </h2>
        
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30">
            <p>
              Die Module <strong>Hydratation</strong>, <strong>Eigenspannungen</strong>, <strong>Zwang</strong> und <strong>Kriechen/Schwinden</strong> betrachten jeweils Teilaspekte desselben komplexen Vorgangs. 
              In der Realität laufen diese Prozesse im <em>frühen Betonalter</em> (den ersten Tagen und Wochen nach dem Betonieren) gleichzeitig ab und beeinflussen sich gegenseitig.
            </p>
          </div>

          <section>
            <h3 className="text-lg font-bold text-home-prim mb-4">Das physikalische Netzwerk</h3>
            
            {/* Visual Flow Diagram */}
            <div className="relative p-6 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl border border-home-grau/30 overflow-hidden">
              <div className="flex flex-col gap-6 md:gap-8">
                
                {/* Ursache */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center relative z-10">
                  <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-xl w-64 shadow-sm flex flex-col items-center text-center">
                    <ThermometerSun className="text-orange-500 mb-2" size={32} />
                    <h4 className="font-bold text-orange-900">1. Hydratation</h4>
                    <p className="text-xs text-orange-700 mt-1">Zement + Wasser reagiert. Es entsteht Wärme (Aufheizphase) und chemisches Schwinden.</p>
                  </div>
                </div>
                
                <div className="hidden md:flex justify-center -my-4 relative z-0">
                  <div className="h-10 w-0.5 bg-gray-300"></div>
                </div>

                {/* Mechanismus */}
                <div className="flex flex-col md:flex-row gap-4 items-start justify-center relative z-10">
                  <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl w-64 shadow-sm flex flex-col items-center text-center">
                    <Layers className="text-blue-500 mb-2" size={32} />
                    <h4 className="font-bold text-blue-900">2. Volumenänderung & Zwang</h4>
                    <p className="text-xs text-blue-700 mt-1">Beton dehnt sich aus (Wärme) und zieht sich zusammen (Abkühlung, Schwinden). Bauteilgeometrie oder Untergrund behindern (Zwang) diese freie Bewegung.</p>
                  </div>

                  <div className="flex items-center justify-center self-center md:px-4 py-2 md:py-0">
                    <ArrowRight className="text-gray-400 rotate-90 md:rotate-0" />
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-xl w-64 shadow-sm flex flex-col items-center text-center">
                    <Activity className="text-purple-500 mb-2" size={32} />
                    <h4 className="font-bold text-purple-900">3. Spannungsaufbau (Eigenspannungen)</h4>
                    <p className="text-xs text-purple-700 mt-1">Durch den Zwang und ungleichmäßige Temperaturverteilung (außen kalt, innen heiß) entstehen Zug- und Druckspannungen im Querschnitt.</p>
                  </div>
                </div>

                <div className="hidden md:flex justify-center -my-4 relative z-0">
                  <div className="h-10 border-l-2 border-dashed border-gray-300"></div>
                </div>

                {/* Relaxation & Result */}
                <div className="flex flex-col md:flex-row gap-4 items-start justify-center relative z-10">
                  <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-xl w-64 shadow-sm flex flex-col items-center text-center">
                    <Timer className="text-emerald-500 mb-2" size={32} />
                    <h4 className="font-bold text-emerald-900">4. Kriechen & Relaxation</h4>
                    <p className="text-xs text-emerald-700 mt-1">Der junge Beton reagiert auf die Spannungen viskoelastisch. Er kriecht, wodurch sich die aufgebauten Zugspannungen abbauen (Relaxation wirkt entspannend!).</p>
                  </div>

                  <div className="flex items-center justify-center self-center md:px-4 py-2 md:py-0">
                    <ArrowRight className="text-gray-400 rotate-90 md:rotate-0" />
                  </div>

                  <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl w-64 shadow-sm flex flex-col items-center text-center">
                    <AlertTriangle className="text-red-500 mb-2" size={32} />
                    <h4 className="font-bold text-red-900">5. Rissrisiko-Bewertung</h4>
                    <p className="text-xs text-red-700 mt-1">Spannung σ(t) {`>`} Zugfestigkeit f_ct(t) = Riss! Die Rissbreitensteuerung erfolgt über die Bewehrung.</p>
                  </div>
                </div>
                
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30">
                 <h4 className="font-bold text-indigo-800 mb-2">Wie die Module besser genutzt werden:</h4>
                 <ul className="text-sm text-gray-700 space-y-2 list-disc pl-4">
                   <li><strong>Isolierte Betrachtung:</strong> Nutzen Sie die Einzelmodule (z.B. Kriechen), um die rein physikalischen Formeln und Abhängigkeiten (z.B. von der Luftfeuchte) zu berechnen (nach Eurocode).</li>
                   <li><strong>Vernetzte Betrachtung:</strong> Nutzen Sie das Modul <em>Zwang & Risse</em>. Dort sind die Formeln aus Hydratation, Festigkeitsentwicklung und Relaxation bereits zu einer integrativen Zeitsimulation zusammengeführt.</li>
                 </ul>
               </div>
               <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30">
                 <h4 className="font-bold text-indigo-800 mb-2">Ansätze zur Optimierung im Projekt:</h4>
                 <ul className="text-sm text-gray-700 space-y-2 list-disc pl-4">
                   <li>Zement mit niedrigen Hydratationswärmen verwenden, um Ursprung 1 zu dämpfen.</li>
                   <li>Gleitfolien unter Bodenplatten (verringert Zwang), um Schritt 2 zu entschärfen.</li>
                   <li>Betonage im Sommer ggf. nachts (geringere Bauteil-Temperaturgradienten).</li>
                 </ul>
               </div>
            </div>

          </section>

        </div>
      </div>
      
      <ModuleFooter 
        wikipedia={[
          { title: 'Hydratation (Zement)', url: 'https://de.wikipedia.org/wiki/Hydratation' },
          { title: 'Zwangspannung', url: 'https://de.wikipedia.org/wiki/Zwangspannung' },
          { title: 'Kriechen und Schwinden von Beton' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1 (Eurocode 2: Bemessung und Konstruktion von Stahlbetontragwerken - Rissbegrenzung)' },
          { title: 'DAfStb-Heft 600: Erläuterungen zu Eurocode 2 (Kap. 7: Gebrauchstauglichkeit)', url: 'https://www.dafstb.de/' },
          { title: 'DAfStb-Richtlinie: Massige Bauteile aus Beton', url: 'https://www.dafstb.de/' },
          { title: 'DIN EN 13670 / DIN 1045-3 (Ausführung von Tragwerken aus Beton)' }
        ]}
        literatur={[
          'Rostásy, F. S.; Krauß, M.; Budelmann, H.: Planungshilfen zur Beherrschung von Zwang in massigen Bauteilen (Heft 483 DAfStb, Beuth Verlag)',
          'Stark, J.; Wicht, B.: Dauerhaftigkeit von Beton (Springer Vieweg)',
          'Breitenbücher, R.: Zwangsspannungen und Rissbildung im jungen Beton (Beton- und Stahlbetonbau)'
        ]}
        formeln={[
          {
            formel: '\\sigma_{ct}(t) = E_{cm}(t) \\cdot \\left[ \\alpha_T \\cdot \\Delta T(t) + \\epsilon_{cs}(t) \\right] \\cdot R \\cdot k_{relax}(t)',
            erklaerung: 'Integraler Spannungsaufbau im jungen Beton unter Berücksichtigung von thermischer Dehnung, Schwinden, Festhaltungsgrad R und viskoelastischer Kriech-Relaxation.',
            quelle: 'DAfStb Heft 483 / Eurocode 2'
          },
          {
            formel: '\\eta_{riss} = \\frac{\\sigma_{ct}(t)}{f_{ct,eff}(t)} \\le 1{,}0',
            erklaerung: 'Rissrisiko-Kriterium: Übersteigt die Zwangspannung die zu diesem Zeitpunkt verfügbare effektive Betonzugfestigkeit, bildet sich ein Trennriss.',
            quelle: 'DIN EN 1992-1-1'
          }
        ]}
      />
    </div>
  );
}
