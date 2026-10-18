import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import React from 'react';
import { Anchor, ShieldAlert, Weight, Scale } from 'lucide-react';

export default function Schwerbeton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Weight className="text-shiraz" /> Schwerbeton
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Schwerbeton ist definiert als Beton mit einer Trockenrohdichte von mehr als <strong>2.600 kg/m³</strong> (bzw. &gt; 2,6 kg/dm³).
            Durch den Einsatz spezieller Gesteinskörnungen mit hoher Eigenmasse lassen sich spezielle physikalische Eigenschaften wie erhöhter Strahlenschutz oder hohes Gewichts- zu Volumengewicht generieren.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <Scale className="text-shiraz" size={20} /> Mischungsentwurf
          </h3>
          <p className="text-sm text-text-main/80">
            Zur Erreichung der hohen Dichte werden als Zuschlagstoffe Gesteins- und Metallkörnungen mit hoher Rohdichte verwendet. Übliche Beispiele:
          </p>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
            <li><strong>Baryt (Schwerspat):</strong> Rohdichte ~ 4.200 kg/m³</li>
            <li><strong>Magnetit, Hämatit (Eisenerze):</strong> Rohdichte ~ 4.500 bis 5.000 kg/m³</li>
            <li><strong>Stahlschrott, Bleischrot:</strong> Höchste Rohdichten bis über 7.000 kg/m³ (jedoch anspruchsvoll in der Verarbeitung bzgl. Entmischung)</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <Anchor className="text-shiraz" size={20} /> Anwendungsgebiete
          </h3>
          <p className="text-sm text-text-main/80">
            Die hohe Dichte bringt spezifische Nutzungsmöglichkeiten mit sich:
          </p>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
            <li><strong>Ballast und Gegengewichte:</strong> Bei Brücken, Kränen oder Schiffen.</li>
            <li><strong>Auftriebssicherung:</strong> Bei Bauwerken im Grundwasser (z.B. Tunnelsohlen, dichte Wannen).</li>
            <li><strong>Beschuss-Sicherheit:</strong> Im Schutzraumbau (Tresore).</li>
          </ul>
        </div>
      </div>

      <div className="bg-off-white p-6 rounded-2xl border border-home-grau/30 flex gap-4 items-start">
        <ShieldAlert className="shrink-0 mt-1 text-shiraz" />
        <div>
          <h4 className="font-bold text-text-main mb-2">Strahlenschutzbeton</h4>
          <p className="text-sm text-text-main/80 leading-relaxed">
            Eine primäre Anwendung von Schwerbeton ist der Abschirmungsbau (Krankenhäuser mit Röntgengeräten, Strahlentherapie, Kernkraftwerke oder Castor-Behälter). 
            Die hohe Massendichte schwächt Gammastrahlung ab, während oft noch zusätzlich Wasserstoffhaltige Bestandteile (wie Kristallwasser im Zuschlag oder viel Zementleim) eingebracht werden, um Neutronenstrahlung effektiv abzubremsen.
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
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zement</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 350 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Wasser</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 160 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Schwere Gesteinskörnung (z.B. Baryt, Magnetit)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 2800 kg (je nach Dichte)</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Fließmittel</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">nach Bedarf</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ModuleFooter
        weblinks={[
          { title: 'Beton.wiki: Schwerbeton', url: 'https://beton.wiki/index.php?title=Schwerbeton' },
          { title: "Verein Deutscher Zementwerke (VDZ): Zement-Taschenbuch", url: "https://www.vdz-online.de/publikationen/zement-taschenbuch" }
        ]}
        wikipedia={[
          { title: 'Schwerbeton', url: 'https://de.wikipedia.org/wiki/Schwerbeton' },
          { title: 'Strahlenschutz', url: 'https://de.wikipedia.org/wiki/Strahlenschutz' }
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Schwerbeton mit Trockenrohdichte > 2600 kg/m³)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN 25413-1:1995-10 (Strahlenschutzbeton - Teil 1: Baustoffe für Strahlenschutzbeton)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN 6847-2:2008-03 (Medizinische Elektronenbeschleuniger-Anlagen - Baulicher Strahlenschutz)', url: 'https://www.dinmedia.de/' }
        ]}
        literatur={[
          'Grübl, P.; Weigler, H.; Karl, S. (2001): Beton - Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Schultze, N.: Strahlenschutz im Hochbau (Bauverlag)'
        ]}
        formeln={[
          {
            formel: 'I(x) = I_0 \\cdot e^{-\\mu \\cdot x} = I_0 \\cdot 2^{-x / d_{1/2}}',
            erklaerung: 'Lambert-Beersches Schwächungsgesetz für Gammastrahlung: Je höher der lineare Schwächungskoeffizient μ (proportional zur Materialdichte ρ), desto geringer die erforderliche Halbwertsdicke d_1/2.',
            quelle: 'DIN 25413-1'
          },
          {
            formel: '\\rho_{\\text{dry}} > 2600\\,\\text{kg/m}^3 \\quad (\\text{typisch } 3200 - 4500\\,\\text{kg/m}^3)',
            erklaerung: 'Normative Definition von Schwerbeton nach DIN EN 206 unter Verwendung hochdichter Gesteinskörnungen (Baryt, Magnetit, Hämatit).',
            quelle: 'DIN EN 206'
          }
        ]}
      />
    </div>
  );
}
