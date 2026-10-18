import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { RefreshCcw, Layers, Settings, Activity, Map, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Schleuderbeton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <RefreshCcw className="text-shiraz" /> Schleuderbeton
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>Das Schleuderbetonverfahren nutzt hohe Fliehkräfte in rotierenden Rohrformen, um den Beton massiv zu verdichten und überschüssiges Anmachwasser auszupressen. So entstehen hochfeste, extrem dichte Bauteile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Layers className="text-shiraz" size={20} />
            Ausgangsstoffe
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Meist sehr feste zementreiche Mischungen, Größtkorn auf den Querschnitt oder die Bewehrungsanordnung abgestimmt.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Settings className="text-shiraz" size={20} />
            Herstellung
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Fließfähiger oder plastischer Beton wird in rotierende, röhrenförmige Schalungen eingebracht. Durch starke Fliehkräfte beim schnellen Drehen (Schleudern) wird der Beton extrem verdichtet. Überschüssiges Wasser wird nach innen gedrückt (geringer w/z-Wert entsteht).
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Activity className="text-shiraz" size={20} />
            Eigenschaften
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Sehr hohe Festigkeit, extrem dichte und glatte Oberfläche, hohes E-Modul und reduzierte Kriech- und Schwindverformung durch den ausgepressten Wasseranteil.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Map className="text-shiraz" size={20} />
            Anwendungsgebiete
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Maste (Strom-, Beleuchtungs-, Fahrleitungsmaste), Rohre (Abwasserkanäle), architektonische Stützen (Rundstützen).
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm lg:col-span-2">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <ShieldCheck className="text-shiraz" size={20} />
            Dauerhaftigkeit
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Sehr dauerhaft durch die hohe Dichte (gefördert durch den Fliehkraft-Verdichtungsprozess), hoher Abriebwiderstand in Rohren.
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
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 450 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Wasser (nach Schleudern)</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 140 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Flugasche</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 50 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">w/z</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">&lt; 0,35</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ModuleFooter
        weblinks={[
          { title: 'Beton.wiki: Schleuderbeton', url: 'https://beton.wiki/index.php?title=Schleuderbeton' },
          { title: "Zement-Taschenbuch (VDZ)", url: "https://www.vdz-online.de/publikationen/zement-taschenbuch" }
        ]}
        wikipedia={[
          { title: 'Schleuderbeton', url: 'https://de.wikipedia.org/wiki/Schleuderbeton' },
          { title: 'Zentrifugalkraft', url: 'https://de.wikipedia.org/wiki/Zentrifugalkraft' }
        ]}
        regelwerke={[
          { title: 'DIN EN 12843 (Betonfertigteile - Maste)', url: 'https://www.beuth.de/' },
          { title: 'DIN EN 1916 / DIN V 1201 (Rohre und Formstücke aus Beton, Stahlfaserbeton und Stahlbeton)', url: 'https://www.beuth.de/' },
          { title: 'DIN EN 206 / DIN 1045-2 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.beuth.de/' }
        ]}
        literatur={[
          'Grübl, P.; Weigler, H.; Karl, S. (2001): Beton - Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Beton-Kalender: Fertigteile und Spannbetonmaste (Ernst & Sohn)'
        ]}
        formeln={[
          {
            formel: 'a_z = \\omega^2 \\cdot r = (2 \\pi \\cdot n)^2 \\cdot r \\quad (\\approx 20 - 50\\,g)',
            erklaerung: 'Zentrifugalbeschleunigung während der Schleuderphase bei Drehzahl n und Radius r zur mechanischen Wasserabpressung und Entlüftung.',
            quelle: 'Grübl et al. (2001)'
          },
          {
            formel: '(w/z)_{\\text{eff}} = (w/z)_0 - \\frac{\\Delta m_w}{z} \\quad (\\approx 0.30 - 0.35)',
            erklaerung: 'Effektiver w/z-Wert des erhärtenden Rohrkörpers nach radialem Auspressen und Abfließen des Schlempewassers Δm_w zum Rohrinnenraum.',
            quelle: 'DIN EN 12843'
          }
        ]}
      />
    </div>
  );
}
