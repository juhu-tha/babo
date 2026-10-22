import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Waves, Layers, Settings, Activity, Map, ShieldCheck } from 'lucide-react';

export default function UwBeton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Waves className="text-shiraz" /> Unterwasserbeton
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>Unterwasserbeton wird direkt im Wasser eingebaut, ohne dass sich die Mischung entmischt oder der Zementleim ausgewaschen wird. Erfordert hochgradig kohäsive Mischungen und spezielle Einbauverfahren (Contractor-Verfahren).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Layers className="text-shiraz" size={20} />
            Ausgangsstoffe
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Zusätze (Stabilisierer, Unterwasser-Compoundmischungen) erhöhen den Kohäsionszusammenhalt des Betons stark (er wird fließfähig, aber wäscht nicht aus). Mehlkornreiche Mischungen.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Settings className="text-shiraz" size={20} />
            Herstellung
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Einbau über Contractor-Verfahren (Pumprohr zwingend ständig im frischen Beton eingetaucht lassen), um das Risiko von Entmischung und dem Auswaschen der Zementleim-Paste durch Strömungen zu verhindern.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Activity className="text-shiraz" size={20} />
            Eigenschaften
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Stark kohäsiv, fließfähig, entmischungsresistent und selbstverdichtend.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Map className="text-shiraz" size={20} />
            Anwendungsgebiete
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Gründungen und Sohlen von Bauwerken im Grundwasser (z.B. Baugruben), Hafen- und Brückenbau in Flüssen, Dammbauwerke.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm lg:col-span-2">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <ShieldCheck className="text-shiraz" size={20} />
            Dauerhaftigkeit
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Wird oft durch Sulfate und Strömungsabrieb beansprucht. Wenn er korrekt, ohne Auswaschung eingebracht wurde, bietet er eine Dauerhaftigkeit ähnlich normalgefertigtem Beton.
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
                <td className="py-2 px-3 text-sm text-text-main font-medium">Zement (CEM III)</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 400 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Sand</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 800 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Stabilisierer</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 2 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">w/z</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 0,45</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ModuleFooter
        weblinks={[
          { title: 'Beton.wiki: Unterwasserbeton', url: 'https://beton.wiki/index.php?title=Unterwasserbeton' },
          { title: "Zement-Merkblatt B10: Unterwasserbeton", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }
        ]}
        wikipedia={[
          { title: 'Unterwasserbeton', url: 'https://de.wikipedia.org/wiki/Unterwasserbeton' },
          { title: 'Hydrostatischer Druck', url: 'https://de.wikipedia.org/wiki/Hydrostatischer_Druck' }
        ]}
        regelwerke={[
          { title: 'DIN EN 206 / DIN 1045-2 (Abschnitt Unterwasserbeton, Mindestzementgehalt 350-380 kg/m³)' },
          { title: 'ZTV-W LB 215 (Zusätzliche Technische Vertragsbedingungen im Wasserbau - Wasserbauwerke aus Beton)', url: 'https://izw.baw.de/' },
          { title: 'DBV-Merkblatt: Unterwasserbeton (Schütt- und Pumprohrverfahren / Contractor)', url: 'https://www.betonverein.de/' }
        ]}
        literatur={[
          'Bundesanstalt für Wasserbau (BAW): Richtlinie Unterwasserbeton für Trog- und Sohlenbauwerke',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Grübl, P.; Weigler, H.; Karl, S.: Beton - Arten, Herstellung und Eigenschaften (Ernst & Sohn)'
        ]}
        formeln={[
          {
            formel: 'p_{\\text{Beton}} = \\rho_c \\cdot g \\cdot h_c > p_{\\text{Wasser}} = \\rho_w \\cdot g \\cdot h_w',
            erklaerung: 'Hydrostatisches Druckgleichgewicht beim Contractor-Verfahren: Das Betongewicht im Schüttrohr muss den äußeren Wasserdruck überwinden, um kontinuierlichen Austritt sicherzustellen.',
            quelle: 'DBV-Merkblatt Unterwasserbeton'
          },
          {
            formel: 'h_{\\text{Eintauch}} \\ge 1{,}5 - 2{,}0\\,\\text{m}',
            erklaerung: 'Mindesteintauchtiefe des Schüttrohres im frischen Betonbett, um den direkten Kontakt des frischen Zementleims mit dem umgebenden Wasser zu verhindern.',
            quelle: 'ZTV-W LB 215'
          }
        ]}
      />
    </div>
  );
}
