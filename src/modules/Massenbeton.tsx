import React from 'react';
import { useTabContext } from '@/src/contexts/TabContext';
import { ThermometerSun, Cuboid, Flame, ArrowDownToLine } from 'lucide-react';
import inhalt from '@/content/massenbeton/Massenbeton.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Massenbeton() {
  const { setActiveTab } = useTabContext();
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Cuboid className="text-shiraz" /><MdText text={inhalt.texte.massenbetonMassigerBeton} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.vonMassivenBauteilenSpricht} /></p>
        </div>
      </div>

      <p className="text-sm text-text-main/80 flex flex-wrap items-center gap-1 -mt-4"><MdText text={inhalt.texte.temperaturverlaufRechenbeispielZurAdiaba} /><button onClick={() => setActiveTab('hydratation_folgen')} className="underline decoration-dotted hover:text-shiraz cursor-pointer font-semibold"><MdText text={inhalt.texte.hydratationFolgenMassigeBauteile} /></button><MdText text={inhalt.texte.mindestabmessungNachDafstbRichtlinie} /></p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <Flame className="text-shiraz" size={20} /><MdText text={inhalt.texte.dieHydratationswärmeProblematik} /></h3>
          <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.beimAbbindenVonBeton} /></p>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
            <li><MdText text={inhalt.texte.temperaturgradientDerKernWird} /></li>
            <li><MdText text={inhalt.texte.risseEntstehenÄußerlichDurch} /></li>
            <li><MdText text={inhalt.texte.typischesAuftretenInBodenplatten} /></li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <ThermometerSun className="text-shiraz" size={20} /><MdText text={inhalt.texte.maßnahmenMischungsentwurf} /></h3>
          <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.umSchädenInMassigen} /></p>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
            <li><MdText text={inhalt.texte.nutzungVonZementenMit} /></li>
            <li><MdText text={inhalt.texte.zementgehaltMinimierenDafürEinsatz} /></li>
            <li><MdText text={inhalt.texte.aktiveKühlungDurchKühlrohrsysteme} /></li>
            <li><MdText text={inhalt.texte.vorkühlenDerAusgangsstoffeKühlmittel} /></li>
          </ul>
        </div>
      </div>

      <div className="bg-shiraz/5 p-6 rounded-2xl border border-shiraz/15 text-text-main flex gap-4 items-start shadow-sm">
        <ArrowDownToLine className="shrink-0 mt-1 text-shiraz" />
        <div>
          <h4 className="font-bold mb-2 text-shiraz"><MdText text={inhalt.texte.dieWalzbetonAlternativeRcc} /></h4>
          <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.vorAllemImStaudammbau} /></p>
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
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 260 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.zusatzstoffFlugascheReaktionsträge} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 80 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.wasserWZ0} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 150 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.gesteinskörnungGrößtkornBis32} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1950 kg</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
