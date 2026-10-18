import React from 'react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Calculator } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function MischungsberechnungAnleitung() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2 mb-4">
          <Calculator className="text-shiraz" /> Schritt-für-Schritt Anleitung zur Mischungsberechnung
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-8">
          <p>
            Die Berechnung einer Betonmischung erfolgt iterativ und basiert auf der absoluten Volumenmethode (Stoffraumrechnung). 
            Ziel ist es, 1 m³ (1000 Liter) verdichteten Frischbeton so zusammenzusetzen, dass alle normativen und technologischen Anforderungen erfüllt werden.
          </p>
        </div>

        <div className="space-y-8">
          {/* Schritt 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-text-main mb-2">Anforderungen festlegen</h3>
              <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
                <p className="mb-2">
                  Zunächst müssen die Anforderungen an den Beton aus dem Tragwerksentwurf und den Umgebungsbedingungen abgeleitet werden:
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1 ml-2">
                  <li><strong>Expositionsklassen (z.B. XC4, XF1):</strong> Bestimmen den maximal zulässigen Wasserzementwert (w/z)eq, den Mindestzementgehalt und die Mindestdruckfestigkeitsklasse.</li>
                  <li><strong>Druckfestigkeitsklasse (z.B. C25/30):</strong> Geforderte Festigkeit für die Statik.</li>
                  <li><strong>Konsistenzklasse (z.B. F3):</strong> Erforderliche Verarbeitbarkeit für den Einbau.</li>
                  <li><strong>Größtkorn (z.B. 16 mm oder 32 mm):</strong> Abhängig von Bauteilabmessungen und Bewehrungsabstand.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Schritt 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              2
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main mb-2">Wasseranspruch abschätzen</h3>
              <p className="text-text-main/80 mb-2">
                Der Wasseranspruch hängt maßgeblich vom Größtkorn, der Kornform (rund/gebrochen) und der gewünschten Konsistenz ab.
              </p>
              <div className="bg-off-white p-4 rounded-lg border border-home-grau/30 text-sm text-text-main/80">
                <p className="mb-2"><strong>Faustwerte (für Konsistenz F3, rundes Korn):</strong></p>
                <ul className="list-disc list-inside ml-2">
                  <li>Größtkorn 8 mm: ca. 210 Liter/m³</li>
                  <li>Größtkorn 16 mm: ca. 190 Liter/m³</li>
                  <li>Größtkorn 32 mm: ca. 175 Liter/m³</li>
                </ul>
                <p className="mt-2 text-xs italic">Zusatzmittel (z.B. Fließmittel) können den Wasseranspruch deutlich reduzieren.
          </p>
        </div>
            </div>
          </div>

          {/* Schritt 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              3
            </div>
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Zementgehalt berechnen</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der Zementgehalt (z) wird aus dem abgeschätzten Wasseranspruch (w) und dem normativ geforderten maximalen Wasserzementwert (w/z) berechnet.
              </p>
              <div className="bg-off-white p-4 rounded-lg border border-home-grau/30 text-center font-mono text-shiraz mb-2">
                <FormulaText text="z = \frac{w}{(w/z)_{max}}" />
              </div>
              <p className="text-sm text-text-main/70">
                <strong>Wichtig:</strong> Der berechnete Wert muss mit dem normativen Mindestzementgehalt verglichen werden. Der größere der beiden Werte ist maßgebend.
          </p>
        </div>
          </div>

          {/* Schritt 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              4
            </div>
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Stoffraumrechnung (Volumenbilanz)</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Summe der Volumina aller Ausgangsstoffe muss exakt 1000 Liter (1 m³) ergeben. Das Volumen berechnet sich aus Masse geteilt durch Dichte.
              </p>
              <div className="bg-off-white p-4 rounded-lg border border-home-grau/30 text-center font-mono text-shiraz mb-2">
                <FormulaText text="V_{Zement} + V_{Wasser} + V_{Zusatzstoffe} + V_{Luft} + V_{Gestein} = 1000 \text{ Liter}" />
              </div>
              <p className="text-sm text-text-main/70 mb-2">
                Da Zement, Wasser und Luft (ca. 1.5 - 2.0 % bei Normalbeton) nun bekannt sind, kann das Volumen der Gesteinskörnung als Restgröße berechnet werden:
              </p>
              <div className="bg-off-white p-4 rounded-lg border border-home-grau/30 text-center font-mono text-shiraz">
                <FormulaText text="V_{Gestein} = 1000 - (V_{Zement} + V_{Wasser} + V_{Luft})" />
              </div>
            </div>
          </div>

          {/* Schritt 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              5
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main mb-2">Masse der Gesteinskörnung berechnen</h3>
              <p className="text-text-main/80 mb-2">
                Aus dem berechneten Volumen der Gesteinskörnung wird mit der Rohdichte des Gesteins (meist ca. 2.65 kg/dm³) die trockene Masse berechnet.
              </p>
              <div className="bg-off-white p-4 rounded-lg border border-home-grau/30 text-center font-mono text-shiraz mb-2">
                <FormulaText text="m_{Gestein, trocken} = V_{Gestein} \cdot \rho_{Gestein}" />
              </div>
              <p className="text-sm text-text-main/70">
                Diese Gesamtmasse wird dann anhand einer gewählten Sieblinie (z.B. A/B 16) auf die einzelnen Kornfraktionen (z.B. 0/4, 4/8, 8/16) aufgeteilt.
          </p>
        </div>
          </div>

          {/* Schritt 6 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              6
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main mb-2">Feuchtekorrektur</h3>
              <p className="text-text-main/80 mb-2">
                In der Praxis ist die Gesteinskörnung (besonders der Sand) feucht. Das darin enthaltene Wasser muss vom Zugabewasser abgezogen werden, und die Einwaage des Gesteins muss um das Wassergewicht erhöht werden.
              </p>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1 ml-2">
                <li><strong>Einwaage Gestein (feucht):</strong> <FormulaText text="m_{feucht} = m_{trocken} \cdot (1 + \frac{Feuchte [\%]}{100})" /></li>
                <li><strong>Zugabewasser:</strong> <FormulaText text="w_{Zugabe} = w_{gesamt} - \sum Wasser_{Gestein}" /></li>
              </ul>
            </div>
          </div>
          {/* Schritt 7 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              7
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main mb-2">Mehlkorngehalt überprüfen</h3>
              <p className="text-text-main/80 mb-2">
                Der Mehlkorngehalt (Alle Stoffe ≤ 0.125 mm, also Zement, Zusatzstoffe und der Feinanteil im Sand) ist wichtig für das Wasserhaltevermögen, die Verarbeitbarkeit (Pumpfähigkeit) und die Gefügedichtigkeit.
              </p>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1 ml-2">
                <li>Ein zu niedriger Mehlkorngehalt (&lt; 300 kg/m³) führt zu Entmischen und Bluten.</li>
                <li>Ein zu hoher Mehlkorngehalt erhöht den Schwind- und Kriechprozess sowie die Rissneigung. Nach DIN 1045-2 ist er nach oben hin begrenzt (je nach Größtkorn z. B. auf 500-600 kg/m³).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Wasserzementwert', url: 'https://de.wikipedia.org/wiki/Wasserzementwert' },
          { title: 'Sieblinie', url: 'https://de.wikipedia.org/wiki/Sieblinie' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Deutscher Beton- und Bautechnik-Verein (DBV): Merkblatt Betontechnische Daten',
          'Grübl, P., Weigler, H., Karl, S.: Beton – Arten, Herstellung und Eigenschaften (Ernst & Sohn)'
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Spannbeton - Teil 2: Beton)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 12620:2008-07 (Gesteinskörnungen für Beton)', url: 'https://www.dinmedia.de/' }
        ]}
        formeln={[
          {
            formel: 'V_{\\text{Zement}} + V_{\\text{Wasser}} + V_{\\text{Zusatz}} + V_{\\text{Luft}} + V_{\\text{Gestein}} = 1000\\,\\text{dm}^3',
            erklaerung: 'Stoffraumgleichung (Volumenbilanz) zur Zusammensetzung von genau 1 m³ (1000 Liter) verdichtetem Frischbeton.',
            quelle: 'DIN 1045-2:2023-08 / DIN EN 206:2021-06'
          },
          {
            formel: 'm_G = V_G \\cdot \\rho_{rd,G} = \\left(1000 - \\frac{z}{\\rho_z} - \\frac{w}{\\rho_w} - \\frac{f}{\\rho_f} - 10 \\cdot L\\right) \\cdot \\rho_{rd,G}',
            erklaerung: 'Berechnung der trockenen Gesteinskörnungsmasse m_G aus dem Reststoffraum V_G unter Abzug von Zement, Wasser, Zusatzstoffen und Porenluftgehalt L (in Vol.-%).',
            quelle: 'DBV-Merkblatt Beton'
          },
          {
            formel: 'w_{\\text{Zugabe}} = w_{\\text{soll}} - \\sum \\left( m_{G,i} \\cdot \\frac{h_i}{100} \\right)',
            erklaerung: 'Feuchtekorrektur des Zugabewassers unter Anrechnung der Eigenfeuchte h_i (in M.-%) der gelagerten Gesteinskörnungen.',
            quelle: 'DIN EN 206'
          }
        ]}
      />
    </div>
  );
}
