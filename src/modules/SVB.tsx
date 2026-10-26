import React from 'react';
import { Layers, Droplets, ArrowDownToLine, MoveHorizontal } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import inhalt from '@/content/svb/SVB.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function SVB() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Droplets className="text-shiraz" /><MdText text={inhalt.texte.selbstverdichtenderBetonSvb} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.selbstverdichtenderBetonSvbEngl} /></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" size={20} /><MdText text={inhalt.texte.prinzipDerSvbMischung} /></h3>
          <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.damitDerBetonNicht} /></p>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
            <li><MdText text={inhalt.texte.hoherMehlkorngehaltErhöhteZugabe} /></li>
            <li><MdText text={inhalt.texte.leistungsstarkeFließmittelFmPolycarboxyl} /></li>
            <li><MdText text={inhalt.texte.angepassteGesteinskörnungGeringererGrößt} /><FormulaText text="D_{max}" /> 16 mm).</li>
            <li><MdText text={inhalt.texte.ggfStabilisiererStUm} /></li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <MoveHorizontal className="text-shiraz" size={20} /><MdText text={inhalt.texte.prüfverfahrenFrischbeton} /></h3>
          <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.anstelleDesAusbreitmaßesFür} /></p>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
            <li><MdText text={inhalt.texte.setzfließmaßDinEn12350} /></li>
            <li><MdText text={inhalt.texte.vTrichterVersuchDin} /></li>
            <li><MdText text={inhalt.texte.blockierringLKastenDin} /></li>
          </ul>
        </div>
      </div>

      <div className="bg-off-white p-6 rounded-2xl border border-home-grau/30 flex gap-4 items-start">
        <ArrowDownToLine className="shrink-0 mt-1 text-shiraz" />
        <div>
          <h4 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.einsatzgebieteUndVorteile} /></h4>
          <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.häufigEingesetztBeiSehr} /></p>
        </div>
      </div>

            
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm">
        <h3 className="font-bold text-text-main mb-4"><MdText text={inhalt.texte.typischeMischungszusammensetzungProM} /></h3>
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
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.zementZBCem} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 380 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.zusatzstoffZBKalksteinmehl} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 180 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.wasserWZ0} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 170 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.gesteinskörnungOptimierteSieblinie} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1650 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.hochleistungsfließmittelPce} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right"><MdText text={inhalt.texte.hoheDosierung15} /></td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
