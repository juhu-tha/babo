import React from 'react';
import { Factory, Droplets, Zap, Activity } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/ressourcenemissionen/RessourcenEmissionen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { gwpJeKg } from '@/src/data/gwpLehrwerte';
import { formatDeZahl } from '@/src/utils/numberFormat';

export default function RessourcenEmissionen() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Factory className="text-shiraz" /><MdText text={inhalt.texte.produktionsbedingteRessourcenverbräucheE} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieBaustoffherstellungIstHochgradig} /></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col items-center text-center">
            <Zap className="text-amber-500 w-10 h-10 mb-3" />
            <h3 className="font-bold text-lg mb-2">Energieverbrauch</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.derSinterprozessZB} /></p>
        </div>
          </div>
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col items-center text-center">
            <Activity className="text-shiraz w-10 h-10 mb-3" />
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">CO₂-Emissionen</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.nebenBrennstoffbedingtenEmissionenMachen} /></p>
        </div>
          </div>
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col items-center text-center">
            <Droplets className="text-blue-500 w-10 h-10 mb-3" />
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.ressourcenWasser} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.sandKiesKalksteinUnd} /></p>
        </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-text-main mt-8 mb-4"><MdText text={inhalt.texte.emissionsvergleichWesentlicherBaustoffe} /></h3>
        <div className="overflow-x-auto bg-white rounded-xl border border-home-grau/30 shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-off-white border-b-2 border-home-grau/30">
                <th className="p-3 font-bold">Baustoff</th>
                <th className="p-3 font-bold">Herstellungsprozess</th>
                <th className="p-3 font-bold"><MdText text={inhalt.texte.typischesGwpKgCo} /></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-home-grau/10">
                <td className="p-3 font-bold text-shiraz">Portlandzementklinker</td>
                <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.brennenVonKalksteinTon} /></td>
                <td className="p-3 font-mono">~ 0,85</td>
              </tr>
              <tr className="border-b border-home-grau/10 bg-off-white/30">
                <td className="p-3 font-bold text-shiraz"><MdText text={inhalt.texte.baustahlPrimär} /></td>
                <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.eisenerzreduktionImHochofenBof} /></td>
                <td className="p-3 font-mono">~ 2,00 - 2,50</td>
              </tr>
              <tr className="border-b border-home-grau/10">
                <td className="p-3 font-bold"><MdText text={inhalt.texte.baustahlSekundär} /></td>
                <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.schrottschmelzeImElektrolichtbogenofenEa} /></td>
                <td className="p-3 font-mono">~ 0,40 - 0,60</td>
              </tr>
              <tr className="border-b border-home-grau/10 bg-off-white/30">
                <td className="p-3 font-bold"><MdText text={inhalt.texte.aluminiumPrimär} /></td>
                <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.bauxitAbbauSchmelzflusselektrolyseHoher} /></td>
                <td className="p-3 font-mono">~ 14,00 - 20,00</td>
              </tr>
              <tr className="border-b border-home-grau/10">
                <td className="p-3 font-bold">Konstruktionsvollholz</td>
                <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.holzeinschlagSägenTechnischeTrocknung} /></td>
                <td className="p-3 font-mono">~ 0,10 - {formatDeZahl(gwpJeKg('kvh').fossil, 2)}</td>{/* obere Grenze = zentraler Lehrwert GWP_LEHRWERTE.kvh (fossil 80 kg/m³ bei 500 kg/m³); Umsetzung 02.11.2026 (NS4-RU-1) */}
              </tr>
              <tr className="border-b border-home-grau/10 bg-off-white/30">
                <td className="p-3 font-bold">Mauerziegel</td>
                <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.toneLehmFormenBrennen} /></td>
                <td className="p-3 font-mono">~ 0,20 - 0,30</td>
              </tr>
              <tr>
                <td className="p-3 font-bold"><MdText text={inhalt.texte.gesteinskörnungNatürlich} /></td>
                <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.abbauBrechenKlassieren} /></td>
                <td className="p-3 font-mono">~ 0,005 - 0,01</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-main/50 mt-2 text-right"><MdText text={inhalt.texte.werteSindIndikativUnd} /></p>

        <h3 className="text-xl font-bold text-text-main mt-8 mb-4"><MdText text={inhalt.texte.dekarbonisierungsstrategienBeispielZemen} /></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-home-grau/30 p-4 rounded-xl bg-off-white">
            <h4 className="font-bold text-shiraz"><MdText text={inhalt.texte.t1KlinkereffizienzKlinkerersatz} /></h4>
            <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.ersetzenVonCoIntensivem} /></p>
          </div>
          <div className="border border-home-grau/30 p-4 rounded-xl bg-off-white">
            <h4 className="font-bold text-shiraz"><MdText text={inhalt.texte.t2AlternativeBrennstoffe} /></h4>
            <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.austauschFossilerBrennstoffeKohle} /></p>
          </div>
          <div className="border border-home-grau/30 p-4 rounded-xl bg-off-white">
            <h4 className="font-bold text-shiraz"><MdText text={inhalt.texte.t3CcusCarbonCapture} /></h4>
            <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.daRundZweiDrittel} /></p>
          </div>
          <div className="border border-home-grau/30 p-4 rounded-xl bg-off-white">
            <h4 className="font-bold text-shiraz"><MdText text={inhalt.texte.t4BetoneffizienzRecycling} /></h4>
            <p className="text-sm text-text-main/80 mt-1"><MdText text={inhalt.texte.materialgerechtesSchlankesKonstruierenVe} /></p>
          </div>
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Kohlendioxid-Emission' },
          { title: 'Treibhauspotenzial', url: 'https://de.wikipedia.org/wiki/Treibhauspotential' },
          { title: 'Ressourceneffizienz', url: 'https://de.wikipedia.org/wiki/Ressourceneffizienz' }
        ]}
        literatur={inhalt.daten["RessourcenEmissionen.literatur"]}
        regelwerke={inhalt.daten["RessourcenEmissionen.regelwerke"]}
        formeln={inhalt.daten["RessourcenEmissionen.formeln"]}
      />
    </div>
  );
}
