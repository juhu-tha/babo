import React from 'react';
import { useTabContext } from '@/src/contexts/TabContext';
import { ThermometerSun, Cuboid, Flame, ArrowDownToLine } from 'lucide-react';

export default function Massenbeton() {
  const { setActiveTab } = useTabContext();
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

      <p className="text-sm text-text-main/80 flex flex-wrap items-center gap-1 -mt-4">
        Temperaturverlauf, Rechenbeispiel zur adiabatischen Erwärmung und Simulation:
        <button onClick={() => setActiveTab('hydratation_folgen')} className="underline decoration-dotted hover:text-shiraz cursor-pointer font-semibold">Hydratation &amp; Folgen → Massige Bauteile</button>
        (Mindestabmessung nach DAfStb-Richtlinie Massige Bauteile: 0,80 m)
      </p>

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
            <li>Nutzung von <strong>Zementen mit niedriger Wärmeentwicklung</strong> (Zusatz LH: "Low Heat"). Hüttensandreiche (CEM III) oder flugaschehaltige Zemente.</li>
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
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zement (z.B. CEM III/B mit niedriger Hydratationswärme)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 260 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zusatzstoff (Flugasche reaktionsträge)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 80 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Wasser (w/z ≈ 0,58)</td>
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
    </div>
  );
}
