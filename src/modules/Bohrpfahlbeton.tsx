import React from 'react';
import { Layers, Settings, Activity, Map, Drill } from 'lucide-react';
import inhalt from '@/content/bohrpfahlbeton/Bohrpfahlbeton.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Bohrpfahlbeton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Drill className="text-shiraz" /> Bohrpfahlbeton
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.bohrpfahlbetonIstEinSpezieller} /></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Layers className="text-shiraz" size={20} />
            Anforderungen
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed"><MdText text={inhalt.texte.bohrpfahlbetonMussÜberExtrem} /></p>
          <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
            <li><MdText text={inhalt.texte.hoherMehlkorngehaltFürOptimales} /></li>
            <li><MdText text={inhalt.texte.sicheresUndVollständigesUmschließen} /></li>
            <li><MdText text={inhalt.texte.keinEntmischenOderBlockieren} /></li>
              <li><MdText text={inhalt.texte.mindestzementgehalt325KgM} /></li>
          </ul>
        </div>

        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Settings className="text-shiraz" size={20} /><MdText text={inhalt.texte.herstellungEinbau} /></h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed"><MdText text={inhalt.texte.beimEinbauUnterWasser} /></p>
          <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
            <li><MdText text={inhalt.texte.dasBetonierrohrReichtBis} /></li>
            <li><MdText text={inhalt.texte.derBetonDrücktDas} /></li>
            <li><MdText text={inhalt.texte.eineGleichmäßigeZufuhrOhne} /></li>
          </ul>
        </div>

        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Activity className="text-shiraz" size={20} /><MdText text={inhalt.texte.eigenschaftenFrischbeton} /></h3>
          <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.esWerdenStarkFließfähige} /></p>
        </div>

        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Map className="text-shiraz" size={20} />
            Anwendungsgebiete
          </h3>
          <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.tiefgründungenAllerArtStützen} /></p>
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
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right"><MdText text={inhalt.texte.t350380Kg} /></td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.wasserWZ0} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 180 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.gesteinskörnungGrößtkornMax16} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1750 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.zusatzmittelVerzögererFürLange} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">nach Bedarf</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
