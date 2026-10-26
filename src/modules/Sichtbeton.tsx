import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { useTabContext } from '@/src/contexts/TabContext';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Eye, Layers, Grid, Droplets } from 'lucide-react';
import inhalt from '@/content/sichtbeton/Sichtbeton.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Sichtbeton() {
  // Eingebettet in Sonderbetone: Quellenblock dort zentral
  const { activeTab: aktiverReiter } = useTabContext();
  const eingebettet = aktiverReiter === 'sonderbetone';
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Eye className="text-shiraz" /> Sichtbeton
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.alsSichtbetonBezeichnetMan} /><span className="block mt-2 text-xs"><MdText text={inhalt.texte.lernpfad1Sichtbetonklassen2} /></span>
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        {/* Sichtbetonklassen */}
        <div>
          <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Layers className="text-shiraz" size={20} /><MdText text={inhalt.texte.sichtbetonklassenNachDbvVdz} /></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
              <div className="font-bold text-lg text-shiraz mb-1">SB 1</div>
              <div className="text-xs font-bold text-home-grau uppercase mb-2"><MdText text={inhalt.texte.geringeAnforderungen} /></div>
              <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.zBKellerwändeGewerbliche} /></p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
              <div className="font-bold text-lg text-shiraz mb-1">SB 2</div>
              <div className="text-xs font-bold text-home-grau uppercase mb-2"><MdText text={inhalt.texte.normaleAnforderungen} /></div>
              <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.zBTreppenhäuserStützmauern} /></p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm ring-1 ring-shiraz/30">
              <div className="font-bold text-lg text-shiraz mb-1">SB 3</div>
              <div className="text-xs font-bold text-home-grau uppercase mb-2"><MdText text={inhalt.texte.hoheAnforderungen} /></div>
              <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.zBFassadenRepräsentative} /></p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
              <div className="font-bold text-lg text-shiraz mb-1">SB 4</div>
              <div className="text-xs font-bold text-home-grau uppercase mb-2"><MdText text={inhalt.texte.besondersHoheAnford} /></div>
              <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.repräsentativeBauteileMitExtremen} /></p>
            </div>
          </div>
        </div>

        {/* Einflussfaktoren */}
        <div className="mt-2">
          <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Grid className="text-shiraz" size={20} /><MdText text={inhalt.texte.entscheidendeEinflussfaktoren} /></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-home-grau/30 rounded-xl p-5 bg-off-white">
              <h4 className="font-bold text-text-main text-md mb-2"><MdText text={inhalt.texte.t1Schalungshaut} /></h4>
              <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.dieSchalungIstDer} /></p>
              <ul className="list-disc list-inside text-xs text-text-main/70 space-y-1">
                <li><MdText text={inhalt.texte.saugendZBSägeraues} /></li>
                <li><MdText text={inhalt.texte.nichtSaugendZB} /></li>
                <li><MdText text={inhalt.texte.fugenbildUndAnkerlöcherMüssen} /></li>
              </ul>
            </div>

            <div className="border border-home-grau/30 rounded-xl p-5 bg-off-white">
              <h4 className="font-bold text-text-main text-md mb-2"><MdText text={inhalt.texte.t2Trennmittel} /></h4>
              <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.verhindertDasAnhaftenDes} /></p>
              <ul className="list-disc list-inside text-xs text-text-main/70 space-y-1">
                <li><MdText text={inhalt.texte.mussExtremDünnUnd} /></li>
                <li><MdText text={inhalt.texte.zuVielTrennmittelFührt} /></li>
                <li><MdText text={inhalt.texte.mussAufDieSchalungshaut} /></li>
              </ul>
            </div>

            <div className="border border-home-grau/30 rounded-xl p-5 bg-off-white">
              <h4 className="font-bold text-text-main text-md mb-2"><MdText text={inhalt.texte.t3Betonzusammensetzung} /></h4>
              <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.dieRezepturMussEin} /></p>
              <ul className="list-disc list-inside text-xs text-text-main/70 space-y-1">
                <li><MdText text={inhalt.texte.ausreichendMehlkornZementZusatzstoffe} /></li>
                <li><MdText text={inhalt.texte.gleichbleibendeZementsorteUndGesteinskör} /></li>
                <li><MdText text={inhalt.texte.konsistenzMussDasEntweichen} /></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Typische Mängel */}
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Droplets className="text-shiraz" size={20} /><MdText text={inhalt.texte.typischeOptischeBeeinträchtigungen} /></h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <strong className="text-sm text-text-main"><MdText text={inhalt.texte.lunkerPoren} /></strong>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.lufteinschlüsseAnDerOberfläche} /></p>
            </div>
            <div>
              <strong className="text-sm text-text-main"><MdText text={inhalt.texte.marmorierungenWolkenbildung} /></strong>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.helligkeitsunterschiedeEntstehenDurchUnt} /></p>
            </div>
            <div>
              <strong className="text-sm text-text-main">Kiesnester:</strong>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.stellenAnDenenDer} /></p>
            </div>
            <div>
              <strong className="text-sm text-text-main">Rostfahnen:</strong>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.verfärbungenDurchKorrodierendeBewehrung} /></p>
            </div>
          </div>
        </div>

      </div>

            
      <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
        <h3 className="font-semibold text-text-main mb-3"><MdText text={inhalt.texte.typischeMischungszusammensetzungProM} /></h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[300px]">
            <thead>
              <tr className="border-b-2 border-home-grau/30 bg-home-grau/5">
                <th className="py-2 px-3 text-sm font-semibold text-text-main">Komponente</th>
                <th className="py-2 px-3 text-sm font-semibold text-text-main text-right">Menge</th>
              </tr>
            </thead>
            <tbody>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-home-grau/5 transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.zementZBCem} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 350 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-home-grau/5 transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.wasserWZ0} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 175 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-home-grau/5 transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.gesteinskörnungHoherMehlkorngehaltFür} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1850 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-home-grau/5 transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium"><MdText text={inhalt.texte.zusatzmittelFließmittel} /></td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">nach Bedarf</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielBetondeckungEinerSicht}
        zielGleichung="c_{nom} = c_{min} + \Delta c_{dev}, \quad c_{min} = \max(c_{min,b};\; c_{min,dur};\; 10\,\text{mm})"
        normQuelle={inhalt.werte.dinEn19921}
        schritte={inhalt.daten["Sichtbeton.schritte"]}
        ergebnisHinweis={inhalt.werte.cNom40Mm}
      />

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielPorenflächenanteilEine}
        zielGleichung="A_{Poren} = \frac{\sum A_{Pore,i}}{A_{Messfeld}} \cdot 100\,\%"
        normQuelle={inhalt.werte.auswertungAnErprobungsflächenLehrwerte}
        schritte={inhalt.daten["Sichtbeton.schritte_2"]}
        ergebnisHinweis={inhalt.werte.porenflächenanteil024Lehrwerte}
      />

      <ModulTest moduleId="sichtbeton" />

      {!eingebettet && (
      <ModuleFooter
        weblinks={[
          { title: inhalt.werte.betonWikiSichtbeton, url: 'https://beton.wiki/index.php?title=Sichtbeton' },
          { title: inhalt.werte.zementMerkblattH8, url: "https://www.baunetzwissen.de/beton/tipps/planungshilfen/h-8--sichtbeton-techniken-der-flaechengestaltung-741365" }
        ]}
        wikipedia={[
          { title: 'Sichtbeton', url: 'https://de.wikipedia.org/wiki/Sichtbeton' },
          { title: inhalt.werte.schalungBeton, url: 'https://de.wikipedia.org/wiki/Schalung_(Beton)' }
        ]}
        regelwerke={inhalt.daten["Sichtbeton.regelwerke"]}
        literatur={inhalt.daten["Sichtbeton.literatur"]}
        formeln={inhalt.daten["Sichtbeton.formeln"]}
      />
      )}
    </div>
  );
}
