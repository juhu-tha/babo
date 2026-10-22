import React from 'react';
import { useTabContext } from '@/src/contexts/TabContext';
import { Waves, ArrowRight } from 'lucide-react';

export default function Pumpbeton() {
  const { setActiveTab } = useTabContext();
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

      <div className="border border-home-grau/30 rounded-2xl p-6 bg-white shadow-sm text-sm text-text-main/80 flex flex-col gap-3">
        <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
          <ArrowRight className="text-shiraz" size={20} />
          Kurzfassung
        </h3>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Gleitschicht:</strong> Der Beton bewegt sich als Pfropfen; die Reibung entsteht in einer dünnen Leim-/Mörtelschicht an der Rohrwand.</li>
          <li><strong>Mehlkorn:</strong> Ausreichend Feinstoffe (Zement, Zusatzstoffe, Feinsand ≤ 0,125 mm) für die Gleitschicht und das Wasserhaltevermögen.</li>
          <li><strong>Konsistenz:</strong> meist F3 bis F5; stetige Sieblinie gegen Entmischen unter Druck.</li>
          <li><strong>Stopfer:</strong> durch Bluten unter Druck, fehlenden Vorlaufmörtel oder ungünstige Leitungsführung.</li>
        </ul>
        <p className="flex flex-wrap items-center gap-1">
          Ausführlich mit Rechenbeispiel zum Förderdruck:
          <button onClick={() => setActiveTab('herstellung_einbau')} className="underline decoration-dotted hover:text-shiraz cursor-pointer font-semibold">Herstellung &amp; Einbau</button>
        </p>
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
