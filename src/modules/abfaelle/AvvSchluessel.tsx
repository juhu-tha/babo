import { List, AlertTriangle, ClipboardList } from 'lucide-react';
import inhalt from '@/content/abfaelle/AvvSchluessel.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function AvvSchluessel() {
  return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <List className="w-5 h-5 text-emerald-600" /><MdText text={inhalt.texte.abfallartenNachAvvKapitel} /></h3>
        <p className="text-gray-700"><MdText text={inhalt.texte.dieAbfallverzeichnisVerordnungAvv} /></p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.mineralischeAbfälle1701} /></h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li><MdText text={inhalt.texte.beton170101} /></li>
              <li><MdText text={inhalt.texte.ziegel170102} /></li>
              <li><MdText text={inhalt.texte.fliesenZiegelUndKeramik} /></li>
              <li><MdText text={inhalt.texte.gemische170107} /></li>
            </ul>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.holzGlasUndKunststoff} /></h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li><MdText text={inhalt.texte.holz170201} /></li>
              <li><MdText text={inhalt.texte.glas170202} /></li>
              <li><MdText text={inhalt.texte.kunststoff170203} /></li>
            </ul>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.metalle1704} /></h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li><MdText text={inhalt.texte.kupferBronzeMessing17} /></li>
              <li><MdText text={inhalt.texte.aluminium170402} /></li>
              <li><MdText text={inhalt.texte.eisenUndStahl17} /></li>
            </ul>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.weitereWichtigeGruppen} /></h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li><MdText text={inhalt.texte.bitumengemische1703Strikte} /></li>
              <li><MdText text={inhalt.texte.bodenUndSteine17} /></li>
              <li><MdText text={inhalt.texte.dämmmaterial1706Oft} /></li>
            </ul>
          </div>
        </div>

        {/* Spiegeleinträge */}
        <div className="mt-6 bg-slate-50 p-5 rounded-xl border border-home-grau/30">
          <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-shiraz" /><MdText text={inhalt.texte.spiegeleinträgeGefährlicheVsNicht} /></h4>
          <p className="text-sm text-slate-600 mb-3"><MdText text={inhalt.texte.vieleAbfallartenInDer} /></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded border border-home-grau/30">
              <div className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.beispielGemischteBauUnd} /></div>
              <ul className="space-y-1">
                <li><span className="font-mono font-bold">17 09 03*</span><MdText text={inhalt.texte.dieGefährlicheStoffeEnthalten} /></li>
                <li><span className="font-mono font-bold">17 09 04</span><MdText text={inhalt.texte.mitAusnahmeDerjenigenDie} /></li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded border border-home-grau/30">
              <div className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.beispielBodenUndSteine} /></div>
              <ul className="space-y-1">
                <li><span className="font-mono font-bold">17 05 03*</span><MdText text={inhalt.texte.dieGefährlicheStoffeEnthalten2} /></li>
                <li><span className="font-mono font-bold">17 05 04</span><MdText text={inhalt.texte.mitAusnahmeDerjenigenDie2} /></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Checkliste: Abfallrechtliche Einstufung */}
        <div className="mt-8 bg-slate-50/50 p-6 rounded-xl border border-home-grau/30 shadow-sm">
          <h4 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.checklisteKorrekteAbfallrechtlicheEinstu} /></h4>
          <p className="text-xs text-slate-600 mb-6"><MdText text={inhalt.texte.dieserSystematischeLeitfadenUnterstützt} /></p>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                1
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2"><MdText text={inhalt.texte.getrennthaltungspflichtPrüfen8Gewabfv} /></h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.klärenSieVorabOb} /></p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                2
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2"><MdText text={inhalt.texte.erstzuordnungNachAvvKapitel} /></h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.ordnenSieDenAbfall} /><span className="font-mono bg-slate-50 border px-1 rounded font-bold text-slate-800">17 01 01</span><MdText text={inhalt.texte.fürBetonOder} /><span className="font-mono bg-slate-50 border px-1 rounded font-bold text-slate-800">17 05 04</span><MdText text={inhalt.texte.fürBodenSteineZu} /></p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                3
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2"><MdText text={inhalt.texte.vorhandenseinVonGefahrstoffenPrüfen} /></h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.prüfenSieObHinweise} /></p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                4
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2"><MdText text={inhalt.texte.spiegeleinträgeAnalyseanforderungIdentif} /></h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.wennDieAbfallartEin} /><span className="font-mono bg-slate-50 border px-1 rounded font-bold text-slate-800">17 05 03* / 17 05 04</span> oder <span className="font-mono bg-slate-50 border px-1 rounded font-bold text-slate-800">17 09 03* / 17 09 04</span><MdText text={inhalt.texte.veranlassenSieRechtzeitigEine} /></p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                5
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2"><MdText text={inhalt.texte.abfallschlüsselFinalFestlegenDeklarieren} /></h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.legenSieBasierendAuf} /></p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                6
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2"><MdText text={inhalt.texte.transportUndÜbergabeDokumentieren} /></h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.übergebenSieDenAbfall} /></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
