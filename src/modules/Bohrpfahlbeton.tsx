import React from 'react';
import { Layers, Settings, Activity, Map, Drill } from 'lucide-react';

export default function Bohrpfahlbeton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Drill className="text-shiraz" /> Bohrpfahlbeton
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Bohrpfahlbeton ist ein spezieller Transportbeton für den Spezialtiefbau, der zur Herstellung von Bohrpfählen (oft im Bereich von Grundwasser) eingesetzt wird. Er muss über einen längeren Zeitraum sehr gut fließfähig bleiben, ohne sich zu entmischen.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Layers className="text-shiraz" size={20} />
            Anforderungen
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Bohrpfahlbeton muss über extrem gute Frischbetoneigenschaften verfügen. Die Rezeptur wird speziell auf längere Verarbeitbarkeitszeiten eingestellt:
          </p>
          <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
            <li>Hoher Mehlkorngehalt für optimales Zusammenhaltungsvermögen (Kohäsion).</li>
            <li>Sicheres und vollständiges Umschließen der Bewehrungskörbe.</li>
            <li>Kein Entmischen oder Blockieren (Stopfer) während des Einbaus.</li>
              <li>Mindestzementgehalt, höchster w/z-Wert und Mindestfeinanteil sind in DIN EN 1536 geregelt (Werte manuell prüfen).</li>
          </ul>
        </div>

        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Settings className="text-shiraz" size={20} />
            Herstellung & Einbau
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Beim Einbau unter Wasser oder unter stützender Bentonit-Suspension erfolgt dieser in der Regel mit dem Contractor-Verfahren:
          </p>
          <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
            <li>Das Betonierrohr reicht bis auf den Grund der Bohrung.</li>
            <li>Der Beton drückt das Grundwasser bzw. die Stützflüssigkeit von unten nach oben aus dem Bohrloch (kein freies Fallen, kein Auswaschen).</li>
            <li>Eine gleichmäßige Zufuhr ohne Unterbrechungen ist kritisch.</li>
          </ul>
        </div>

        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Activity className="text-shiraz" size={20} />
            Eigenschaften (Frischbeton)
          </h3>
          <p className="text-sm text-text-main/80 leading-relaxed">
            Es werden stark fließfähige (Konsistenz oft F5 oder F6), weiche bis flüssige Gemische gefordert. Typische Größtkörnungen liegen bei 16 oder 32 mm, angepasst an die engen Maschenweiten der Bewehrungskörbe und die Überdeckung.
          </p>
        </div>

        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Map className="text-shiraz" size={20} />
            Anwendungsgebiete
          </h3>
          <p className="text-sm text-text-main/80 leading-relaxed">
            Tiefgründungen aller Art: Stützen von Hochhausfundamenten, Brückenpfeiler, Lärmschutzwände, Hangsicherungen, sowie überschnittene Bohrpfahlwände als wasserundurchlässige Baugrubenumschließung.
          </p>
        </div>
      </div>
            
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm">
        <h3 className="font-bold text-text-main mb-4">Typische Mischungszusammensetzung (pro m³, Lehrbeispiel)</h3>
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
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 350 - 380 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Wasser (w/z ~0,50)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 180 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Gesteinskörnung (Größtkorn max. 16 mm oder 32 mm)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1750 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zusatzmittel (Verzögerer für lange Verarbeitbarkeit, oft &gt; 4h)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">nach Bedarf</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
