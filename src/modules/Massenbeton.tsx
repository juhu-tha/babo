import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import React from 'react';
import { ThermometerSun, Cuboid, Flame, ArrowDownToLine } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';

export default function Massenbeton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Cuboid className="text-shiraz" /> Massenbeton (Massiger Beton)
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Von massiven Bauteilen spricht man in der Regel ab einer Dicke von ca. 0,80 m bis 1,00 m (je nach Bauteiltyp und Betonmischung). 
            Aufgrund des großen Volumens im Verhältnis zur Oberfläche kann die Hydratationswärme des Zements im Kern des Bauteils nur sehr langsam abfließen.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <Flame className="text-shiraz" size={20} /> Die Hydratationswärme-Problematik
          </h3>
          <p className="text-sm text-text-main/80">
            Beim Abbinden von Beton entsteht Wärme. In massigen Bauteilen führt dies zu Rissen durch Zwangsspannungen:
          </p>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
            <li><strong>Temperaturgradient:</strong> Der Kern wird stark erwärmt (dehnt sich aus), die Randbereiche kühlen ab (wollen sich zusammenziehen).</li>
            <li>Risse entstehen äußerlich durch Eigenspannungen und innerlich bei zentrischem Zwang in der Abkühlphase.</li>
            <li>Typisches Auftreten in Bodenplatten, Fundamenten, Schleusen und Talsperren.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <ThermometerSun className="text-shiraz" size={20} /> Maßnahmen & Mischungsentwurf
          </h3>
          <p className="text-sm text-text-main/80">
            Um Schäden in massigen Bauteilen entgegenzuwirken, muss die Wärmeentwicklung begrenzt werden:
          </p>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
            <li>Nutzung von <strong>Zementen mit niedriger Wärmeentwicklung</strong> (Zusatz LH: "Low Heat"). Flugaschereiche Zemente (z.B. CEM III).</li>
            <li>Zementgehalt minimieren, dafür Einsatz von ungebrochener Gesteinskörnung & Fließmitteln.</li>
            <li>Aktive Kühlung durch <strong>Kühlrohrsysteme</strong> im Kern (flüssigkeitsbasiert).</li>
            <li>Vorkühlen der Ausgangsstoffe (Kühlmittel, Scherbeneis).</li>
          </ul>
        </div>
      </div>

      <div className="bg-shiraz/5 p-6 rounded-2xl border border-shiraz/15 text-text-main flex gap-4 items-start shadow-sm">
        <ArrowDownToLine className="shrink-0 mt-1 text-shiraz" />
        <div>
          <h4 className="font-bold mb-2 text-shiraz">Die "Walzbeton"-Alternative (RCC)</h4>
          <p className="text-sm text-text-main/80 leading-relaxed">
            Vor allem im Staudammbau wird Walzbeton (Roller Compacted Concrete) genutzt. Er ist extrem erdfeucht, hat einen minimalen Zementgehalt (fast keine Wärmeentwicklung) und wird wie im Erdbau in Lagen eingebaut und mittels Vibrationswalzen abverdichtet. Dies ist eine spezielle Unterart des Massenbetons für extreme Volumina.
          </p>
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
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zement (z.B. CEM III/B mit niedriger Hydratationswärme)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 260 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zusatzstoff (Flugasche reaktionsträge)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 80 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Wasser (w/b ~0,50 - 0,60)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 150 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Gesteinskörnung (Größtkorn bis 32 mm oder 63 mm)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1950 kg</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ModuleFooter
        weblinks={[
          { title: 'Beton.wiki: Massige Bauteile', url: 'https://beton.wiki/index.php?title=Massige_Bauteile' },
          { title: "Zement-Merkblatt B11: Massige Bauteile aus Beton", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }
        ]}
        wikipedia={[
          { title: 'Massiger Beton' },
          { title: 'Walzbeton', url: 'https://de.wikipedia.org/wiki/Walzbeton' }
        ]}
        regelwerke={[
          { title: 'DAfStb-Richtlinie: Massige Bauteile aus Beton', url: 'https://www.dafstb.de/' },
          { title: 'DIN EN 197-1 (Zemente mit niedriger Hydratationswärme LH / sehr niedriger Hydratationswärme VLH)' },
          { title: 'DIN EN 1992-1-1 / DIN EN 1992-3 (Rissbreitenbegrenzung infolge früher Zwangskräfte)' }
        ]}
        literatur={[
          'DAfStb Heft 555: Erläuterungen zur DAfStb-Richtlinie Massige Bauteile aus Beton (Beuth Verlag)',
          'Grübl, P.; Weigler, H.; Karl, S. (2001): Beton - Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
            formel: '\\Delta T_{\\text{ad}} = \\frac{z \\cdot Q_{H,7d}}{c_c \\cdot \\rho_c} \\approx \\frac{z \\cdot 250\\,\\text{kJ/kg}}{1{,}0\\,\\text{kJ/(kg}\\cdot\\text{K)} \\cdot 2400\\,\\text{kg/m}^3}',
            erklaerung: 'Adiabater Temperaturanstieg ΔT_ad infolge Zementhydratation im Bauteilkern ohne äußere Wärmeabfuhr.',
            quelle: 'DAfStb-Richtlinie Massige Bauteile'
          },
          {
            formel: '\\Delta T_{\\text{Kern-Rand}} \\le 15 - 20\\,\\text{K}',
            erklaerung: 'Kritische Begrenzung der Temperaturdifferenz zwischen Bauteilkern und Oberfläche zur Vermeidung von Trennrissen durch Eigenspannungen.',
            quelle: 'DAfStb Heft 555'
          }
        ]}
      />
    </div>
  );
}
