import React, { useState } from 'react';
import { Waves, Gauge, Thermometer, Layers } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import Ausbreitversuch from './Ausbreitversuch';
import Frischbetondruck from './Frischbetondruck';
import Frischbetontemperatur from './Frischbetontemperatur';

export default function Frischbeton() {
  const [activeTab, setActiveTab] = useState<'Ausbreitversuch' | 'Frischbetondruck' | 'Frischbetontemperatur'>('Ausbreitversuch');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Waves className="text-shiraz" /> Frischbeton &amp; Baustellenprüfungen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Prüfung, Konsistenzbestimmung, Schalungsdruckberechnung nach DIN 18218 und Frischbetontemperaturprognosen. Der Frischbetonzustand entscheidet maßgeblich über Verarbeitbarkeit, Entmischungsstabilität und Dauerhaftigkeit des späteren Festbetongefüges.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button 
            onClick={() => setActiveTab('Ausbreitversuch')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Ausbreitversuch' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Layers size={16} /> Ausbreitmaß &amp; Konsistenz
          </button>
          <button 
            onClick={() => setActiveTab('Frischbetondruck')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Frischbetondruck' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Gauge size={16} /> Frischbetondruck (DIN 18218)
          </button>
          <button 
            onClick={() => setActiveTab('Frischbetontemperatur')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Frischbetontemperatur' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Thermometer size={16} /> Frischbetontemperatur
          </button>
        </div>

        <div>
          {activeTab === 'Ausbreitversuch' && <Ausbreitversuch />}
          {activeTab === 'Frischbetondruck' && <Frischbetondruck />}
          {activeTab === 'Frischbetontemperatur' && <Frischbetontemperatur />}
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Frischbeton', url: 'https://de.wikipedia.org/wiki/Frischbeton' },
          { title: 'Konsistenz (Beton)', url: 'https://de.wikipedia.org/wiki/Konsistenz_(Beton)' },
          { title: 'Schalung (Beton)', url: 'https://de.wikipedia.org/wiki/Schalung_(Beton)' }
        ]}
        literatur={[
          'Grübl, P.; Weigler, H.; Siebel, E.: Beton: Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 12350-1 bis 12350-7:2019-09 (Prüfung von Frischbeton)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12350-1' },
          { title: 'DIN 18218:2010-01 (Frischbetondruck auf vertikale Schalungen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+18218' },
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton: Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+206' },
          { title: 'DIN EN 13670:2010-06 / DIN 1045-3:2023-08 (Ausführung von Tragwerken aus Beton)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13670' }
        ]}
        formeln={[
          {
            formel: 'T_{\\text{Misch}} = \\frac{\\sum (m_i \\cdot c_i \\cdot T_i)}{\\sum (m_i \\cdot c_i)} \\quad [^{\\circ}\\text{C}]',
            erklaerung: 'Mischungstemperatur des Frischbetons aus den spezifischen Wärmekapazitäten ci, Massen mi und Ausgangstemperaturen Ti der Komponenten Zement, Gesteinskörnung und Zugabewasser.',
            quelle: 'DIN EN 206 / DBV-Merkblatt Betontemperatur'
          },
          {
            formel: '\\sigma_{hk,\\text{max}} = \\min\\left(\\gamma_c \\cdot h_s, \\; \\alpha_k \\cdot (v \\cdot t_E + d_s)\\right) \\quad [\\text{kN/m}^2]',
            erklaerung: 'Charakteristischer horizontaler Schalungsdruck σhk,max nach DIN 18218 in Abhängigkeit von Steiggeschwindigkeit v, Erstarrungsendzeit tE und Schalungshöhe hs.',
            quelle: 'DIN 18218:2010-01'
          }
        ]}
      />
    </div>
  );
}
