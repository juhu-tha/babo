import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import React, { useState } from 'react';
import { Layers, Mountain } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';

export default function Leichtbeton() {
  const [dichte, setDichte] = useState(1.4);

  // estimate compressive strength based on density (very rough linear approx for learning)
  const fc = Math.max(2, (dichte - 0.8) * 35); 
  const lambda = Math.max(0.15, (dichte - 0.4) * 0.4); // thermal conductivity

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Leichtbeton (LB)
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Konstruktionsleichtbeton (Rohdichte 800 bis 2000 kg/m³) zeichnet sich durch ein poriges Gefüge aus. 
            Dies wird durch offenporige Gesteinskörnung (z. B. Bims, Blähton) erreicht. Porenbeton ist ein eigenes, dampfgehärtetes Bauprodukt und kein Leichtbeton nach DIN EN 206. Leichtbeton vereint Tragfähigkeit mit verbesserter Wärmedämmung.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-home-grau/30 shadow-sm">
          <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
            <Mountain className="w-5 h-5 text-shiraz" /> Eigenschaften &amp; Bemessung
          </h3>
          <p className="text-sm text-text-main/80 mb-4">
            Bei Leichtbeton ist das Korn oft weicher als die Zementsteinmatrix. Der Bruch verläuft 
            daher i. d. R. mitten durch das Korn. Dichte und Festigkeit korrelieren stark miteinander.
          </p>
          <div className="bg-off-white border border-home-grau/20 rounded-xl p-4 mb-4">
            <div className="text-sm text-shiraz font-semibold mb-2"><FormulaText text="\eta_E = ( \rho / 2200 )^2" /></div>
            <p className="text-xs text-text-main/70">
              Modifikationsbeiwert für den E-Modul. Wegen der weichen Körner hat Leichtbeton 
              einen geringeren E-Modul als Normalbeton gleicher Druckfestigkeit.
            </p>
          </div>
          <div className="bg-off-white border border-home-grau/20 rounded-xl p-4">
            <div className="text-sm text-shiraz font-semibold mb-2"><FormulaText text="\eta_1 = 0.40 + 0.60 \cdot (\rho / 2200)" /></div>
            <p className="text-xs text-text-main/70">
              Abminderung der Zugfestigkeit im Vergleich zu Normalbeton. Formeln nach Eurocode 2 (DIN EN 1992-1-1).
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-home-grau/30 shadow-sm relative overflow-hidden">
          <h3 className="text-lg font-bold text-text-main mb-4 relative z-10">Dichte-Abhängigkeit (Näherung)</h3>
          
          <div className="space-y-6 relative z-10">
            <div>
              <label className="text-sm font-medium text-text-main flex justify-between mb-2">
                <span>Rohdichte <FormulaText text="\rho" /></span>
                <span className="text-shiraz font-bold">{formatDeZahl(dichte, 2)} kg/dm³</span>
              </label>
              <input 
                type="range" min="0.8" max="2.0" step="0.1"
                value={dichte}
                onChange={(e) => setDichte(parseFloat(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
              <div className="flex justify-between text-xs text-home-grau mt-1">
                <span>Leicht</span><span>Schwer</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-home-grau/20 p-4 rounded-xl text-center">
                <div className="text-xs text-text-main/70 mb-1 font-semibold uppercase tracking-wider">Geschätzte Festigkeit</div>
                <div className="text-2xl font-bold text-shiraz"><FormulaText text={`\\approx ${formatDeTeX(fc, 1)}`} /> <span className="text-sm">MPa</span></div>
              </div>
              <div className="bg-slate-50 border border-home-grau/20 p-4 rounded-xl text-center">
                <div className="text-xs text-text-main/70 mb-1 font-semibold uppercase tracking-wider">Wärmeleitfähigkeit <FormulaText text="\lambda" /></div>
                <div className="text-2xl font-bold text-slate-800"><FormulaText text={`\\approx ${formatDeTeX(lambda, 2)}`} /> <span className="text-sm">W/(m·K)</span></div>
              </div>
            </div>
            <p className="text-[10px] text-text-main/50 text-center">
              Achtung: Dies sind stark vereinfachte empirische Zusammenhänge zur Veranschaulichung der Zielkonflikte (Tragfähigkeit vs. Dämmwirkung).
            </p>
          </div>
        </div>
      
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 md:col-span-2">
          <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">Beispielrezeptur (Richtwerte)</h3>
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
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 380 kg/m³</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Wasser</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 170 kg/m³</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Leichtzuschlag</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 600 kg/m³</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">w/z</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 0,45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    
      <ModuleFooter
        weblinks={[
          { title: 'Beton.wiki: Leichtbeton', url: 'https://beton.wiki/index.php?title=Leichtbeton' },
          { title: "Zement-Merkblatt B14: Leichtbeton", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }
        ]}
        wikipedia={[
          { title: 'Leichtbeton', url: 'https://de.wikipedia.org/wiki/Leichtbeton' },
          { title: 'Porenbeton', url: 'https://de.wikipedia.org/wiki/Porenbeton' }
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Leichtbetonklassen LC8/9 bis LC80/88, Rohdichteklassen D1.0 bis D2.0)' },
          { title: 'DIN EN 1992-1-1:2023-08 (Eurocode 2 - Abschnitt 11: Leichtbeton)' },
          { title: 'DIN EN 13055:2016-11 (Leichte Gesteinskörnungen)' },
          { title: 'DBV-Merkblatt: Konstruktionsleichtbeton:2017-09', url: 'https://www.betonverein.de/' }
        ]}
        literatur={[
          'Grübl, P.; Weigler, H.; Karl, S. (2001): Beton - Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
          'Faust, R. (2003): Konstruktiver Leichtbeton (Bauverlag)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
            formel: '\\eta_E = \\left( \\frac{\\rho}{2200} \\right)^2',
            erklaerung: 'Modifikationsbeiwert η_E nach DIN EN 1992-1-1 Abschnitt 11 für den Elastizitätsmodul von Leichtbeton: E_{lcm} = \\eta_E \\cdot E_{cm}.',
            quelle: 'DIN EN 1992-1-1 Abs. 11.3.2'
          },
          {
            formel: '\\eta_1 = 0{,}40 + 0{,}60 \\cdot \\frac{\\rho}{2200}',
            erklaerung: 'Abminderungsfaktor η_1 für Zugfestigkeiten von Leichtbeton infolge der reduzierten Kornfestigkeit des porigen Gefüges.',
            quelle: 'DIN EN 1992-1-1 Abs. 11.3.1'
          },
          {
            formel: 'f_{lctm} = \\eta_1 \\cdot f_{ctm}',
            erklaerung: 'Mittlere axiale Zugfestigkeit von Leichtbeton bezogen auf die Festigkeit eines Normalbetons gleicher Druckfestigkeitsklasse.',
            quelle: 'DIN EN 1992-1-1 Tab. 11.3.1'
          }
        ]}
      />
</div>
  );
}