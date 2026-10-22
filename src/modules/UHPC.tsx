import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Settings, Layers, Activity, Map, ShieldCheck } from 'lucide-react';

export default function UHPC() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Settings className="text-shiraz" /> Ultrahochfester Beton (UHPC)
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>Ultrahochfester Beton (UHPC) zeichnet sich durch extrem hohe Festigkeiten und ein enorm dichtes Gefüge aus. Er ermöglicht filigrane, sehr schlanke Tragwerke bei gleichzeitig überragender Dauerhaftigkeit.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Layers className="text-shiraz" size={20} />
            Ausgangsstoffe
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Sehr hoher Zementgehalt, hoher Anteil an feinsten Puzzolanen (z.B. Silikastaub), extrem niedriger w/z-Wert (oft &lt; 0,25), feines Korn (oft Größtkorn 8 mm oder geringer) und Einsatz von Hochleistungsfließmitteln.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Settings className="text-shiraz" size={20} />
            Herstellung
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Intensives Mischen in speziellen Zwangsmischern erforderlich, da die feinen Partikel extrem viel Mischenergie benötigen. Eine genaue Dosierung beim Fließmittel und der Eigenfeuchte der Zuschläge ist essenziell.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Activity className="text-shiraz" size={20} />
            Eigenschaften
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Extrem hohe Druckfestigkeit (&gt; 150 bis über 200 MPa), sehr hohe Dichtigkeit, nahezu keine Kapillarporen. Sehr sprödes Versagen, weshalb oft Fasern (Hochleistungsstahlfasern oder Carbon) zugegeben werden.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Map className="text-shiraz" size={20} />
            Anwendungsgebiete
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Schlanke Tragwerke, Brückenbau, Hochhausstützen, Tresorbau, Offshore-Konstruktionen, leichte und filigrane Betonfertigteile.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm lg:col-span-2">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <ShieldCheck className="text-shiraz" size={20} />
            Dauerhaftigkeit
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Hervorragende Dauerhaftigkeit durch das extrem dichte Gefüge. Sehr hoher Widerstand gegen Chloride, Carbonatisierung, Frost-Tausalz und chemischen Angriff.
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
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 800 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Mikrosilika</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 170 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Quarzmehl</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 200 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Stahlfasern</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 160 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">w/z</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">&lt; 0,22</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ModuleFooter
        weblinks={[
          { title: 'Beton.wiki: UHPC', url: 'https://beton.wiki/index.php?title=UHPC' },
          { title: "Zement-Taschenbuch (VDZ)", url: "https://www.vdz-online.de/publikationen/zement-taschenbuch" }
        ]}
        wikipedia={[
          { title: 'Ultrahochfester Beton', url: 'https://de.wikipedia.org/wiki/Ultrahochfester_Beton' },
          { title: 'Silikastaub', url: 'https://de.wikipedia.org/wiki/Silikastaub' }
        ]}
        regelwerke={[
          { title: 'DAfStb-Richtlinie Ultrahochfester Beton (UHPC)', url: 'https://www.dafstb.de/' },
          { title: 'NF P 18-470 (Bétons fibrés à ultra-hautes performances - Spécification, performance, production et conformité)', url: 'https://www.afnor.org/' },
          { title: 'DIBt: Grundsätze für Zulassungen von UHPC-Bauteilen', url: 'https://www.dibt.de/' }
        ]}
        literatur={[
          'DAfStb Heft 561 & 592: Ultrahochfester Beton (UHPC) - Grundlagen und Bemessung (Beuth Verlag)',
          'Fehling, E.; Schmidt, M.; Walraven, J. et al. (2014): Ultra-High Performance Concrete UHPC (Ernst & Sohn)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
            formel: 'f_{ck} \\ge 150\\,\\text{N/mm}^2 \\quad (f_{cm} > 165 - 200\\,\\text{N/mm}^2)',
            erklaerung: 'Festigkeitskriterium für ultrahochfesten Beton (Druckfestigkeitsklassen bis C175/190 oder UHPFRC) bei extrem dichter Packungsdichte.',
            quelle: 'DAfStb-Richtlinie UHPC'
          },
          {
            formel: 'w/z \\le 0{,}20 - 0{,}25 \\quad (w/(z + k \\cdot s) \\approx 0{,}18)',
            erklaerung: 'Extrem niedriger Wasserzementwert; das Porenwasser reicht nicht für vollständige Hydratation aus, Zementkerne wirken als mikrofeiner Festkörperfüllstoff.',
            quelle: 'Fehling et al. (2014)'
          }
        ]}
      />
    </div>
  );
}
