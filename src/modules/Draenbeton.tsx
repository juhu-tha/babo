import React from 'react';
import { Droplets, Layers, Settings, Activity, Map, ShieldCheck } from 'lucide-react';

export default function Draenbeton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Droplets className="text-shiraz" /> Dränbeton (Offenporiger Beton)
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>Dränbeton (Einkornbeton) wird als hohlraumreicher Beton ausgeführt. Sein charakteristisches, offenporiges Gefüge wird durch den Verzicht auf feine Gesteinskörnung (Sand) erreicht, wodurch Wasser ungehindert abfließen kann.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Layers className="text-shiraz" size={20} />
            Ausgangsstoffe
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Einkörnige Gesteinskörnungen (z.B. 4/8 oder 8/16 mm) ohne oder mit sehr geringem Sandanteil, Zement und Wasser. Oft Einsatz von Polymerzusätzen zur Erhöhung der Haftung an den Kontaktpunkten.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Settings className="text-shiraz" size={20} />
            Herstellung
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Vorsichtiges Mischen, um Zementleim nicht abzuwaschen. Beim Einbau nur leicht verdichten (häufig mit leichten Rüttelbohlen oder Walzen), um das Hohlraumgefüge (oft 15-25 %) nicht zu zerstören.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Activity className="text-shiraz" size={20} />
            Eigenschaften
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Sehr hohe Wasserdurchlässigkeit, schallabsorbierend. Geringere Druckfestigkeiten, da die Körner nur an den Kontaktpunkten durch Zementleim verbunden sind.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Map className="text-shiraz" size={20} />
            Anwendungsgebiete
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Wasserdurchlässige Verkehrsflächen (z.B. Parkplätze), Lärmschutzwände, Hinterfüllungen zur Drainage an Bauwerken, Tennissplätze, Tragschichten unter Pflaster.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm lg:col-span-2">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <ShieldCheck className="text-shiraz" size={20} />
            Dauerhaftigkeit
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Frost-Tausalz-Widerstand ist ein kritisches Thema, da das Porengefüge offen ist und eiskaltes, salzhaltiges Wasser im Winter eindringen kann. Der Einsatz spezieller Frost-Tausalz-beständiger Rezepturen ist nötig.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="font-bold text-text-main text-lg mb-4">Beispielrezeptur (Richtwerte)</h3>
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
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 250 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Sand</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">0 kg/m³ (Einkorn)</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Kies 4/8</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1550 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">w/z</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 0,38</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
