import { MoveHorizontal, Compass, Scale } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

export default function Steifigkeiten() {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Karte 1: Dehnsteifigkeit EA */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                <MoveHorizontal className="text-shiraz" size={18} /> 1. Dehnsteifigkeit (<InlineMath math="EA" />)
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                Die Dehnsteifigkeit (auch Längs- oder Normalkraftsteifigkeit) ist das Produkt aus 
                <strong> Materialsteifigkeit (<InlineMath math="E" />)</strong> und <strong>Querschnittsfläche (<InlineMath math="A" />)</strong>. 
                Sie bestimmt den Widerstand eines Bauteils gegen axiale Dehnung oder Stauchung unter Normalkraft.
              </p>

              <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4 space-y-2">
                <div className="text-xs font-bold text-text-main">Definition &amp; Einheiten:</div>
                <BlockMath math="EA = E \cdot A \quad [\text{N}, \text{ kN}, \text{ MN}]" />
                <div className="text-xs font-bold text-text-main pt-1">Verlängerung eines Zugstabs:</div>
                <BlockMath math="\Delta L = \frac{N \cdot L_0}{EA} \iff N = \left(\frac{EA}{L_0}\right) \cdot \Delta L = c \cdot \Delta L" />
              </div>

              <div className="space-y-2 text-xs text-text-main/80">
                <div><strong>Tragwerksplanerische Bedeutung:</strong></div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-text-main/75">
                  <li><strong>Federsteifigkeit (<InlineMath math="c" />):</strong> Ein Stab wirkt axial wie eine Feder mit Steifigkeit <InlineMath math="c = \frac{EA}{L_0}" />.</li>
                  <li><strong>Fachwerke &amp; Seile:</strong> Bei Fachwerkträgern, Hängebrücken und Abspannseilen bestimmt ausschließlich <InlineMath math="EA" /> die Systemdurchbiegung.</li>
                  <li><strong>Temperaturzwang:</strong> Ein an beiden Enden festgehaltener Stab erfährt bei Erwärmung eine Zwangsdruckkraft <InlineMath math="N_{\Delta T} = -EA \cdot \alpha_T \cdot \Delta T" />.</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono">
              Differentialgleichung des Dehnstabs: (EA · u'(x))' + n(x) = 0
            </div>
          </div>

          {/* Karte 2: Biegesteifigkeit EI */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                <Compass className="text-shiraz" size={18} /> 2. Biegesteifigkeit (<InlineMath math="EI" />)
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                Die Biegesteifigkeit ist das Produkt aus <strong>Elastizitätsmodul (<InlineMath math="E" />)</strong> und 
                dem <strong>Flächenträgheitsmoment (<InlineMath math="I" />)</strong> des Querschnitts bezüglich der neutralen Biegeachse. 
                Sie definiert den Widerstand eines Balkens gegen Verkrümmung unter Biegemoment.
              </p>

              <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4 space-y-2">
                <div className="text-xs font-bold text-text-main">Momenten-Krümmungs-Beziehung (Bernoulli-Balken):</div>
                <BlockMath math="\kappa(x) = -w''(x) = \frac{M(x)}{EI} \quad [\text{N}\cdot\text{mm}^2 = \text{kNm}^2]" />
                <div className="text-xs font-bold text-text-main pt-1">Durchbiegung Einfeldträger (Einzellast F in Feldmitte):</div>
                <BlockMath math="w_{\max} = \frac{F \cdot L^3}{48 \cdot EI}" />
              </div>

              <div className="space-y-2 text-xs text-text-main/80">
                <div><strong>Flächenträgheitsmomente Standardquerschnitte:</strong></div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-text-main/75 font-mono">
                  <li>Rechteck (b × h): I_y = (b · h³) / 12 (Höhe h geht in der 3. Potenz ein!)</li>
                  <li>Kreis (Ø d): I = (π · d⁴) / 64</li>
                  <li>Kreisrohr: I = π · (D⁴ - d⁴) / 64</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono">
              Balken-Differentialgleichung 4. Ordnung: EI · w''''(x) = q(x)
            </div>
          </div>

        </div>

        {/* Gegenüberstellung Tabelle */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <Scale className="text-shiraz" size={18} /> Direkter Systemvergleich: EA vs. EI
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/30">
                <tr>
                  <th className="p-3">Kriterium</th>
                  <th className="p-3">Dehnsteifigkeit (EA)</th>
                  <th className="p-3">Biegesteifigkeit (EI)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20">
                <tr>
                  <td className="p-3 font-bold text-text-main">Schnittgröße</td>
                  <td className="p-3 font-mono">Normalkraft N(x)</td>
                  <td className="p-3 font-mono">Biegemoment M(x)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-text-main">Verzerrungsgröße</td>
                  <td className="p-3 font-mono">Längsdehnung ε(x) = u'(x)</td>
                  <td className="p-3 font-mono">Krümmung κ(x) = -w''(x)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-text-main">Geometrieeinfluss</td>
                  <td className="p-3">Linear mit der Fläche (<InlineMath math="A \propto h" />)</td>
                  <td className="p-3">Kubisch mit der Bauteilhöhe (<InlineMath math="I \propto h^3" />)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-text-main">Maßgebend für</td>
                  <td className="p-3">Stützenstauchung, Zugbänder, Seile, Baugrundsetzung</td>
                  <td className="p-3">Deckendurchbiegung, Trägerüberhöhung, Euler-Knicken (<InlineMath math="F_K = \frac{\pi^2 EI}{l_k^2}" />)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
}
