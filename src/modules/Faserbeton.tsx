import React from 'react';
import { Activity, Layers, Settings, Map, ShieldCheck } from 'lucide-react';

export default function Faserbeton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Activity className="text-shiraz" /> Faserbeton
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>Durch die gezielte Zugabe von Fasern in die Frischbetonmischung lassen sich die Zug- und Biegezugfestigkeit sowie die Dauerhaftigkeit stark verbessern. Das spröde Materialverhalten wird hierbei duktiler.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Layers className="text-shiraz" size={20} />
            Ausgangsstoffe
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Standard-Betonausgangsstoffe plus die Beimischung von Fasern: Stahlfasern, Polymerfasern (PP, PVA), Glasfasern (AR-Glas) oder Carbonfasern. Fasertyp und -dosierung hängen vom Zweck ab (Brandschutz vs. Tragfähigkeit).
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Settings className="text-shiraz" size={20} />
            Herstellung
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Fasern werden meist am Ende des Mischprozesses im Werk oder auf der Baustelle im Fahrmischer zugegeben (sorgfältiges Einmischen, um »Igelbildung« zu vermeiden).
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Activity className="text-shiraz" size={20} />
            Eigenschaften
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Verbessertes Nachriss-Zugverhalten (Duktilität). Das spröde Versagen des Betons wird durch die Rissüberbrückung der Fasern in ein zäheres Nachrissverhalten umgewandelt.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Map className="text-shiraz" size={20} />
            Anwendungsgebiete
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Industrieböden, Spritzbeton für den Tunnelbau, Sohlplatten, Betonfertigteile und als konstruktiver Brandschutz (Mikro-PP-Fasern, die bei Hitze schmelzen und Porenraum für Dampfdruck freigeben).
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm lg:col-span-2">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <ShieldCheck className="text-shiraz" size={20} />
            Dauerhaftigkeit
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Bei Stahlfasern kann es an der Bauteiloberfläche bei Rissen zu leichten Roststellen kommen (optischer Mangel). Kunststoff- und Glasfasern sind in der Regel rostfrei. Alkalibeständiges (AR) Glas ist bei Glasfasern Pflicht.
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
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 340 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Stahlfasern</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 35 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Sand/Kies</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1800 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">w/z</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 0,50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
