import React from 'react';
import { Waves, ArrowRight, AlertTriangle, Settings } from 'lucide-react';

export default function Pumpbeton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Waves className="text-shiraz" /> Pumpen von Beton
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Das Fördern von Beton mittels Betonpumpen ist heute die Standardmethode auf vielen Baustellen. 
            Damit der Beton pumpbar ist, muss er spezielle rheologische Eigenschaften aufweisen. 
            Das Kernprinzip des Pumpens beruht auf der Ausbildung einer <strong>Gleitschicht</strong> (Schmierfilm) an der Rohrwandung.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gleitschicht & Mechanismus */}
        <div className="border border-home-grau/30 rounded-2xl p-6 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <ArrowRight className="text-shiraz" size={20} />
            Wirkprinzip: Die Gleitschicht
          </h3>
          <p className="text-sm text-text-main/80 mb-4">
            Beim Pumpen bewegt sich der Beton als kompakter "Pfropfen" (Plug-Flow) durch das Förderrohr. 
            Die Reibung entsteht fast ausschließlich in einer 1-3 mm dünnen Schicht an der Rohrwandung.
          </p>
          <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
            <li><strong>Zusammensetzung:</strong> Die Gleitschicht besteht aus Wasser, Zement und feinsten Sandpartikeln (Zementleim/Mörtel).</li>
            <li><strong>Entstehung:</strong> Durch den Pumpdruck wird Wasser und Leim an die Rohrwandung gepresst (Scherinduzierte Partikelmigration).</li>
            <li><strong>Bedeutung:</strong> Ohne intakte Gleitschicht kommt es zu extrem hoher Reibung und zum "Stopfer" (Blockade).</li>
          </ul>
        </div>

        {/* Anforderungen an den Beton */}
        <div className="border border-home-grau/30 rounded-2xl p-6 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Settings className="text-shiraz" size={20} />
            Anforderungen an die Rezeptur
          </h3>
          <p className="text-sm text-text-main/80 mb-4">
            Nicht jeder Beton ist pumpbar. Die Mischung muss stabil sein und darf unter Druck nicht entmischen oder ausbluten.
          </p>
          <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
            <li><strong>Mehlkorngehalt:</strong> Ausreichend Feinstoffe (Zement + Zusatzstoffe + Feinsand &lt; 0,125 mm) sind zwingend erforderlich für die Gleitschichtbildung (oft &gt; 350-400 kg/m³).</li>
            <li><strong>Kornzusammensetzung:</strong> Eine stetige Sieblinie (z.B. AB) ist optimal. Ausfallkörnungen neigen eher zum Entmischen unter Druck.</li>
            <li><strong>Konsistenz:</strong> Meist F3 bis F5 (weich bis fließfähig). Zu steifer Beton lässt sich schwer ansaugen, zu flüssiger Beton neigt zum Entmischen.</li>
            <li><strong>Wasserhaltevermögen:</strong> Der Beton darf das Wasser unter dem Pumpdruck nicht abgeben (Bluten), sonst "verhungert" die Gleitschicht.</li>
          </ul>
        </div>
      </div>

      {/* Risiken und Probleme */}
      <div className="border border-home-grau/30 bg-off-white rounded-2xl p-6">
        <h3 className="font-bold text-text-main text-lg mb-3 flex items-center gap-2">
          <AlertTriangle className="text-shiraz" size={20} />
          Typische Probleme beim Pumpen (Stopfer)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
            <h4 className="font-bold text-text-main text-sm mb-1">Verbluten (Bleeding)</h4>
            <p className="text-xs text-text-main/70">
              Unter hohem Druck wird das Wasser aus dem Beton gepresst und fließt vorweg. Zurück bleibt ein trockener, unpumpbarer Kies-Sand-Pfropfen. Ursache: Zu wenig Mehlkorn oder schlechtes Wasserhaltevermögen.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
            <h4 className="font-bold text-text-main text-sm mb-1">Anpumpen (Schmieren)</h4>
            <p className="text-xs text-text-main/70">
              Bevor der eigentliche Beton gepumpt wird, muss das Rohr mit einer Schmiermischung (Zementschlämme oder spezieller Vorlaufmörtel) benetzt werden. Fehlt diese, entzieht das trockene Rohr dem ersten Beton das Wasser.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
            <h4 className="font-bold text-text-main text-sm mb-1">Rohrleitungs-Geometrie</h4>
            <p className="text-xs text-text-main/70">
              Zu viele enge Bögen, Querschnittsverengungen oder undichte Kupplungen (Druckverlust, Wasserverlust) führen zu stark erhöhtem Pumpdruck und Blockaden.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm">
        <h3 className="font-bold text-text-main mb-4">Typische Mischungszusammensetzung (pro m³)</h3>
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
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 320 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zusatzstoff (z.B. Flugasche zur Erhöhung des Mehlkorns)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 50 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Wasser (w/z ~0,50 - 0,55)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 175 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Gesteinskörnung (ausreichend Mehlkorn, gute Rundkörnigkeit)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1800 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Fließmittel</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">nach Bedarf</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
