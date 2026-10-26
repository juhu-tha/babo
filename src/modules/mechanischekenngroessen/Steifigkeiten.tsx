import { MoveHorizontal, Compass, Scale } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import inhalt from '@/content/mechanischekenngroessen/Steifigkeiten.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Steifigkeiten() {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Karte 1: Dehnsteifigkeit EA */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                <MoveHorizontal className="text-shiraz" size={18} /><MdText text={inhalt.texte.t1DehnsteifigkeitEa} /></h3>
              <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                Die Dehnsteifigkeit (auch Längs- oder Normalkraftsteifigkeit) ist das Produkt aus 
                <strong><MdText text={inhalt.texte.materialsteifigkeitE} /></strong> und <strong><MdText text={inhalt.texte.querschnittsflächeA} /></strong>. 
                Sie bestimmt den Widerstand eines Bauteils gegen axiale Dehnung oder Stauchung unter Normalkraft.
              </p>

              <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4 space-y-2">
                <div className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.definitionEinheiten} /></div>
                <BlockMath math="EA = E \cdot A \quad [\text{N}, \text{ kN}, \text{ MN}]" />
                <div className="text-xs font-bold text-text-main pt-1"><MdText text={inhalt.texte.verlängerungEinesZugstabs} /></div>
                <BlockMath math="\Delta L = \frac{N \cdot L_0}{EA} \iff N = \left(\frac{EA}{L_0}\right) \cdot \Delta L = c \cdot \Delta L" />
              </div>

              <div className="space-y-2 text-xs text-text-main/80">
                <div><MdText text={inhalt.texte.tragwerksplanerischeBedeutung} /></div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-text-main/75">
                  <li><MdText text={inhalt.texte.federsteifigkeitCEinStab} /></li>
                  <li><MdText text={inhalt.texte.fachwerkeSeileBeiFachwerkträgern} /></li>
                  <li><MdText text={inhalt.texte.temperaturzwangEinAnBeiden} /></li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.differentialgleichungDesDehnstabsEa} /></div>
          </div>

          {/* Karte 2: Biegesteifigkeit EI */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                <Compass className="text-shiraz" size={18} /><MdText text={inhalt.texte.t2BiegesteifigkeitEi} /></h3>
              <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.dieBiegesteifigkeitIstDas} /></p>

              <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4 space-y-2">
                <div className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.momentenKrümmungsBeziehungBernoulli} /></div>
                <BlockMath math="\kappa(x) = -w''(x) = \frac{M(x)}{EI} \quad [\text{N}\cdot\text{mm}^2 = \text{kNm}^2]" />
                <div className="text-xs font-bold text-text-main pt-1"><MdText text={inhalt.texte.durchbiegungEinfeldträgerEinzellastF} /></div>
                <BlockMath math="w_{\max} = \frac{F \cdot L^3}{48 \cdot EI}" />
              </div>

              <div className="space-y-2 text-xs text-text-main/80">
                <div><MdText text={inhalt.texte.flächenträgheitsmomenteStandardquerschni} /></div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-text-main/75 font-mono">
                  <li><MdText text={inhalt.texte.rechteckBHI} /></li>
                  <li><MdText text={inhalt.texte.kreisDID} /></li>
                  <li><MdText text={inhalt.texte.kreisrohrIDD} /></li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.balkenDifferentialgleichung4Ordnung} /></div>
          </div>

        </div>

        {/* Gegenüberstellung Tabelle */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <Scale className="text-shiraz" size={18} /><MdText text={inhalt.texte.direkterSystemvergleichEaVs} /></h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/30">
                <tr>
                  <th className="p-3">Kriterium</th>
                  <th className="p-3"><MdText text={inhalt.texte.dehnsteifigkeitEa} /></th>
                  <th className="p-3"><MdText text={inhalt.texte.biegesteifigkeitEi} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20">
                <tr>
                  <td className="p-3 font-bold text-text-main">Schnittgröße</td>
                  <td className="p-3 font-mono"><MdText text={inhalt.texte.normalkraftNX} /></td>
                  <td className="p-3 font-mono"><MdText text={inhalt.texte.biegemomentMX} /></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-text-main">Verzerrungsgröße</td>
                  <td className="p-3 font-mono"><MdText text={inhalt.texte.längsdehnungXUX} /></td>
                  <td className="p-3 font-mono"><MdText text={inhalt.texte.krümmungXWX} /></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-text-main">Geometrieeinfluss</td>
                  <td className="p-3"><MdText text={inhalt.texte.linearMitDerFläche} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.kubischMitDerBauteilhöhe} /></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.maßgebendFür} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.stützenstauchungZugbänderSeileBaugrundse} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.deckendurchbiegungTrägerüberhöhungEulerK} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
}
