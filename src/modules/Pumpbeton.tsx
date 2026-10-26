import React from 'react';
import { useTabContext } from '@/src/contexts/TabContext';
import { Waves, ArrowRight } from 'lucide-react';
import inhalt from '@/content/pumpbeton/Pumpbeton.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Pumpbeton() {
  const { setActiveTab } = useTabContext();
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Waves className="text-shiraz" /><MdText text={inhalt.texte.pumpenVonBeton} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.dasFördernVonBeton} /></p>
        </div>
      </div>

      <div className="border border-home-grau/30 rounded-2xl p-6 bg-white shadow-sm text-sm text-text-main/80 flex flex-col gap-3">
        <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
          <ArrowRight className="text-shiraz" size={20} />
          Kurzfassung
        </h3>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><MdText text={inhalt.texte.gleitschichtDerBetonBewegt} /></li>
          <li><MdText text={inhalt.texte.mehlkornAusreichendFeinstoffeZement} /></li>
          <li><MdText text={inhalt.texte.konsistenzMeistF3Bis} /></li>
          <li><MdText text={inhalt.texte.stopferDurchBlutenUnter} /></li>
        </ul>
        <p className="flex flex-wrap items-center gap-1"><MdText text={inhalt.texte.ausführlichMitRechenbeispielZum} /><button onClick={() => setActiveTab('herstellung_einbau')} className="underline decoration-dotted hover:text-shiraz cursor-pointer font-semibold"><MdText text={inhalt.texte.herstellungEinbau} /></button>
        </p>
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
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 320 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.zusatzstoffZBFlugasche} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 50 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.wasserWZ0} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 175 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.gesteinskörnungAusreichendMehlkornGute} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1800 kg</td>
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
