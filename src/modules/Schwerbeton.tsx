import React from 'react';
import { Anchor, ShieldAlert, Weight, Scale } from 'lucide-react';
import inhalt from '@/content/schwerbeton/Schwerbeton.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Schwerbeton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Weight className="text-shiraz" /> Schwerbeton
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.schwerbetonIstDefiniertAls} /></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <Scale className="text-shiraz" size={20} /> Mischungsentwurf
          </h3>
          <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.zurErreichungDerHohen} /></p>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
            <li><MdText text={inhalt.texte.barytSchwerspatRohdichte4} /></li>
            <li><MdText text={inhalt.texte.magnetitHämatitEisenerzeRohdichte} /></li>
            <li><MdText text={inhalt.texte.stahlschrottBleischrotHöchsteRohdichten} /></li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <Anchor className="text-shiraz" size={20} /> Anwendungsgebiete
          </h3>
          <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.dieHoheDichteBringt} /></p>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
            <li><MdText text={inhalt.texte.ballastUndGegengewichteBei} /></li>
            <li><MdText text={inhalt.texte.auftriebssicherungBeiBauwerkenIm} /></li>
            <li><MdText text={inhalt.texte.beschussSicherheitImSchutzraumbau} /></li>
          </ul>
        </div>
      </div>

      <div className="bg-off-white p-6 rounded-2xl border border-home-grau/30 flex gap-4 items-start">
        <ShieldAlert className="shrink-0 mt-1 text-shiraz" />
        <div>
          <h4 className="font-bold text-text-main mb-2">Strahlenschutzbeton</h4>
          <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.einePrimäreAnwendungVon} /></p>
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
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zement</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 350 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Wasser</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 160 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.schwereGesteinskörnungZB} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right"><MdText text={inhalt.texte.t2800KgJeNach} /></td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Fließmittel</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">nach Bedarf</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
