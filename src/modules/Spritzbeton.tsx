import { formatDeWert } from '@/src/utils/numberFormat';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import React, { useState } from 'react';
import { Waves, Zap } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';

export default function Spritzbeton() {
  const [schichtdicke, setSchichtdicke] = useState(5);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Waves className="text-shiraz" /> Spritzbeton (Shotcrete)
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Spritzbeton ist Beton, der in einer geschlossenen Schlauchleitung zur Einbaustelle gefördert wird
            und dort durch Aufspritzen aufgetragen und durch die Aufprallenergie gleichzeitig verdichtet wird.
            Dabei wird zwischen dem Trockenspritzverfahren (Wasserzugabe an der Düse) und dem Nassspritzverfahren 
            (Fertiger Frischbeton wird gespritzt) unterschieden.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-home-grau/30 shadow-sm">
          <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-shiraz" /> Besonderheiten &amp; Technologie
          </h3>
          <ul className="space-y-4 mb-6">
            <li className="flex gap-3 text-sm text-text-main/80">
              <span className="text-shiraz font-bold mt-0.5">•</span>
              <div>
                <strong>Erstarrungsbeschleuniger:</strong> 
                <p className="mt-1">Damit der Beton nicht abfällt (besonders über Kopf), werden an der Düse Erstarrungsbeschleuniger zudosiert, die ein "Blitz-Erstarren" bewirken.</p>
              </div>
            </li>
            <li className="flex gap-3 text-sm text-text-main/80">
              <span className="text-shiraz font-bold mt-0.5">•</span>
              <div>
                <strong>Der Rückprall:</strong> 
                <p className="mt-1">Ein Teil des Materials prallt von der Applikationsfläche ab. Gröbere Körnung prallt stärker ab (bis zu 30%). Dadurch wird die verbleibende Schicht fettreicher an Zement, was zu hohem Schwinden führt.</p>
              </div>
            </li>
            <li className="flex gap-3 text-sm text-text-main/80">
              <span className="text-shiraz font-bold mt-0.5">•</span>
              <div>
                <strong>Bauweisen:</strong> 
                <p className="mt-1">Tunnelbau (Neue Österreichische Tunnelbauweise), Baugrubensicherung, Instandsetzung (Reprofilierung), Freiformarchitektur (Skateparks).</p>
              </div>
            </li>
          </ul>

          <div className="bg-off-white border border-home-grau/20 rounded-xl p-4">
            <div className="text-sm text-shiraz mb-2 font-bold">Trocken- vs. Nassspritzen</div>
            <p className="text-xs text-text-main/70 leading-relaxed">
              <strong>Trocken:</strong> + Geringerer Aufwand bei kleinen Mengen, + Beliebig lange Unterbrechungen, - Hohe Staubentwicklung, - Geringere Leistung.<br/>
              <strong>Nass:</strong> + Hohe Spritzleistung, + Konstantes W/Z-Verhältnis, + Weniger Rückprall und Staub.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
           <div className="relative z-10 w-full">
            <h3 className="text-lg font-bold text-text-main mb-6 text-center">Applikations-Visualisierung</h3>
            
            <div className="flex justify-center mb-10">
              <div className="relative w-48 h-48">
                {/* Wall Backing */}
                <div className="absolute inset-y-0 right-0 w-8 bg-slate-300 rounded-r-xl border-y border-r border-home-grau/30"></div>
                
                {/* Sprayed Layer */}
                <div 
                  className="absolute inset-y-0 right-8 bg-slate-500 rounded-l-md transition-all duration-300 border-y border-l border-home-grau/30"
                  style={{ width: `${schichtdicke * 4}px` }}
                >
                   {/* Texture dots representing aggregates */}
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                </div>

                {/* Hose */}
                <div className="absolute top-1/2 -left-12 -translate-y-1/2 w-24 h-4 bg-slate-800 rounded-l-full border border-home-grau/30 z-20">
                  <div className="absolute right-0 w-4 h-6 -translate-y-1 bg-shiraz outline outline-2 outline-white rounded-sm"></div>
                </div>
                
                {/* Spray cones */}
                <div className="absolute top-1/2 left-12 h-32 w-24 -translate-y-1/2 z-10" style={{
                  background: 'linear-gradient(90deg, rgba(148, 163, 184, 0.8) 0%, rgba(148, 163, 184, 0) 100%)',
                  clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)'
                }}></div>
              </div>
            </div>

            <div className="px-4">
              <label className="text-sm font-medium text-text-main flex justify-between mb-2">
                <span>Dicke pro Lage</span>
                <span className="text-shiraz font-bold">{formatDeWert(schichtdicke)} cm</span>
              </label>
              <input 
                type="range" min="1" max="15" step="1"
                value={schichtdicke}
                onChange={(e) => setSchichtdicke(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
              <p className="text-xs text-home-grau text-center mt-3">
                Übliche Schichtdicken pro Spritzgang liegen zwischen 3 und 10 cm. 
                Größere Dicken erfordern Erstarrungsbeschleuniger und Bewehrung.
              </p>
            </div>
           </div>
        </div>
      
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 md:col-span-2">
          <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">Beispielrezeptur (Richtwerte)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[300px]">
              <thead>
                <tr className="border-b-2 border-home-grau/30 bg-off-white">
                  <th className="py-2.5 px-3 text-sm font-semibold text-text-main">Komponente</th>
                  <th className="py-2.5 px-3 text-sm font-semibold text-text-main text-right">Menge</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zement</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 400 kg/m³</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Beschleuniger</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 20 kg/m³</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Sand/Kies</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1600 kg/m³</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">w/z</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 0,45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    
      <ModuleFooter
        weblinks={[
          { title: 'Beton.wiki: Spritzbeton', url: 'https://beton.wiki/index.php?title=Spritzbeton' },
          { title: "Zement-Merkblatt B19: Spritzbeton", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }
        ]}
        wikipedia={[
          { title: 'Spritzbeton', url: 'https://de.wikipedia.org/wiki/Spritzbeton' },
          { title: 'Neue Österreichische Tunnelbaumethode', url: 'https://de.wikipedia.org/wiki/Neue_%C3%96sterreichische_Tunnelbaumethode' }
        ]}
        regelwerke={[
          { title: 'DIN EN 14487-1 / -2 (Spritzbeton - Teil 1: Begriffe, Festlegungen und Konformität; Teil 2: Ausführung)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+14487-1' },
          { title: 'DIN 18551 (Spritzbeton; Herstellung und Güteüberwachung)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+18551' },
          { title: 'DIN 18314 (VOB/C: Spritzbetonarbeiten)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+18314' },
          { title: 'ÖBV-Richtlinie Spritzbeton (Klassen J1, J2, J3 zur Frühfestigkeit)', url: 'https://www.bautechnik.pro/' }
        ]}
        literatur={[
          'Maidl, B. (2014): Tunnelbau im Spreng- und Spritzbetonvortrieb (Springer Vieweg)',
          'Kusterle, W. et al.: Spritzbetontechnologie (Ernst & Sohn, Beton-Kalender)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
            formel: 'R = \\frac{m_{\\text{Rückprall}}}{m_{\\text{Gesamtförderung}}} \\cdot 100\\,\\%',
            erklaerung: 'Rückprallquote R: Anteil des von der Wand oder Decke abprallenden Materials (Trockenspritzen ca. 15-30 %, Nassspritzen ca. 5-15 %).',
            quelle: 'DIN EN 14487-2'
          },
          {
            formel: 'E_{\\text{kin}} = \\frac{1}{2} m \\cdot v^2 \\quad (v \\approx 20 - 30\\,\\text{m/s})',
            erklaerung: 'Kinetische Aufprallenergie an der Spritzdüse, die zur selbsttätigen Gefügeverdichtung des Frischbetons an der Schalungs-/Felswand führt.',
            quelle: 'ÖBV-Richtlinie Spritzbeton'
          }
        ]}
      />
</div>
  );
}