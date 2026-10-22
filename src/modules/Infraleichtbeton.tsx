import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Sunset, Layers, Settings, Activity, Map, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Infraleichtbeton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Sunset className="text-shiraz" /> Infraleichtbeton (ILB)
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>Durch sehr leichte Gesteinskörnungen (z. B. Blähglas) ermöglicht Infraleichtbeton eine drastische Gewichtsreduktion und extrem hohe Wärmedämmung, sodass wärmebrückenfreie, einschalige Wandkonstruktionen möglich werden.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Layers className="text-shiraz" size={20} />
            Ausgangsstoffe
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Sehr leichte Zuschlagsstoffe (Blähglas, Blähton, Aerogele), Zement und eventuell Mikrohohlkugeln. Ziel-Rohdichte oft unter 800 kg/m³.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Settings className="text-shiraz" size={20} />
            Herstellung
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Feine Gesteinskörper und empfindliche Leichtzuschläge dürfen beim Mischen nicht zerquetscht werden. Vornässen der leichten Zuschläge ist wichtig für den (inneren) Wasserhaushalt.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Activity className="text-shiraz" size={20} />
            Eigenschaften
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Ausreichende Tragfähigkeit für mehrgeschossigen Wohnungsbau bei gleichzeitig extrem guter Wärmedämmung. Monolithische Wandaufbauten (ohne WDVS) sind möglich.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Map className="text-shiraz" size={20} />
            Anwendungsgebiete
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Monolithische (einschalige) wärmedämmende Außenwände von Bauwerken, Leichtbauelemente.
          </p>
        </div>
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm lg:col-span-2">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <ShieldCheck className="text-shiraz" size={20} />
            Dauerhaftigkeit
          </h3>
          <p className="text-sm text-text-main/80 mb-4 leading-relaxed">
            Sehr gut, jedoch muss die wärmedämmende Außenhülle oft durch Hydrophobierung oder wasserabweisenden Anstrich/Putz vor Durchfeuchtung geschützt werden, um die Langlebigkeit der Dämmeigenschaften zu sichern.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="font-bold text-text-main text-lg mb-4">Beispielrezeptur (Richtwerte)</h3>
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
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 350 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Blähglas / Aerogele</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 300 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">Frischbetonrohdichte</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 800 kg/m³</td>
              </tr>
              <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                <td className="py-2 px-3 text-sm text-text-main font-medium">w/z</td>
                <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 0,43</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ModuleFooter
        weblinks={[
          { title: 'Beton.wiki: Infraleichtbeton', url: 'https://beton.wiki/index.php?title=Infraleichtbeton' },
          { title: "Zement-Taschenbuch (VDZ)", url: "https://www.vdz-online.de/publikationen/zement-taschenbuch" }
        ]}
        wikipedia={[
          { title: 'Leichtbeton', url: 'https://de.wikipedia.org/wiki/Leichtbeton' }
        ]}
        regelwerke={[
          { title: 'DIBt: Vorhabenbezogene Bauartgenehmigung (vBG) / Zustimmung im Einzelfall (ZiE)', url: 'https://www.dibt.de/' },
          { title: 'DIN EN 206 / DIN 1045-2 (Rohdichteklassen D0.8 und D1.0)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+206' },
          { title: 'DAfStb-Richtlinie: Beton mit rezykliertem oder leichtem Zuschlag', url: 'https://www.dafstb.de/' }
        ]}
        literatur={[
          'Schlaich, M.; Hückler, A. (2018): Infraleichtbeton - Tragend, dämmend, monolithisch (Ernst & Sohn, Beton-Kalender 2018)',
          'Hückler, A. (2016): Trag- und Verformungsverhalten von Infraleichtbeton (Dissertation, TU Berlin)'
        ]}
        formeln={[
          {
            formel: '\\rho_{dry} < 800\\,\\text{kg/m}^3',
            erklaerung: 'Trockenrohdichtekriterium für Infraleichtbeton (ILB), welcher unterhalb der genormten Leichtbeton-Dichteklassen der DIN EN 206 (D1.0 bis D2.0) liegt.',
            quelle: 'TU Berlin / Schlaich (2018)'
          },
          {
            formel: '\\lambda_{10,dry} \\approx 0{,}12 - 0{,}18\\,\\text{W/(m}\\cdot\\text{K)}',
            erklaerung: 'Sehr niedrige Bemessungswerte der Wärmeleitfähigkeit ermöglichen monolithische Außenwände (U-Wert < 0,24 W/(m²K) bei Wandstärken um 40-50 cm) ohne Zusatzdämmung.',
            quelle: 'Schlaich & Hückler (2018)'
          }
        ]}
      />
    </div>
  );
}
