import { AlertTriangle, Scale, Leaf } from 'lucide-react';
import { formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import inhalt from '@/content/abfaelle/Altlasten.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface AltlastenProps {
  bbodNutzungsart: string;
  setBbodNutzungsart: React.Dispatch<React.SetStateAction<string>>;
}

export default function Altlasten({ bbodNutzungsart, setBbodNutzungsart }: AltlastenProps) {
    const bbodData: Record<string, { title: string; unit: string; values: Record<string, number> }> = inhalt.daten["Altlasten.bbodData"];

    const selectedBbod = bbodData[bbodNutzungsart] || bbodData.wohngebiet;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <div className="border-b border-home-grau/30 pb-4">
          <h3 className="text-2xl font-bold text-slate-850 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-shiraz" /><MdText text={inhalt.texte.altlastenBodenschutzBbodschgBbodschv} /></h3>
          <p className="text-slate-500 text-sm mt-1"><MdText text={inhalt.texte.dasBundesBodenschutzgesetzBbodschg} /></p>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative mb-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-shiraz mb-2 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /><MdText text={inhalt.texte.die3GesetzlichenWirkungspfade} /></h4>
              <p className="text-xs text-gray-700 mb-3 leading-relaxed"><MdText text={inhalt.texte.schadstoffeImBodenWerden} /></p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 font-semibold font-medium">
                <li><MdText text={inhalt.texte.bodenMenschDirekterKontakt} /></li>
                <li><MdText text={inhalt.texte.bodenNutzpflanzeSchadstofftransferAus} /></li>
                <li><MdText text={inhalt.texte.bodenGrundwasserSchadstoffauswaschungDur} /></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <Scale className="w-4 h-4 text-slate-500" /><MdText text={inhalt.texte.prüfVsMaßnahmenwerte} /></h4>
              <p className="text-xs text-gray-700 mb-2 leading-relaxed"><MdText text={inhalt.texte.dieVerordnungUnterscheidetScharf} /></p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 leading-relaxed font-semibold font-medium">
                <li>
                  <strong className="text-slate-800"><MdText text={inhalt.texte.prüfwerteTriggers} /></strong><MdText text={inhalt.texte.beiÜberschreitungBestehtEin} /></li>
                <li>
                  <strong className="text-shiraz"><MdText text={inhalt.texte.maßnahmenwerteActionLimits} /></strong><MdText text={inhalt.texte.beiÜberschreitungBestehtUnmittelbare} /></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive BBodSchV Prüfwerte Selector */}
        <div className="p-5 bg-white border border-home-grau/30 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1"><MdText text={inhalt.texte.bbodschvPrüfwerteKatalog} /></h4>
              <p className="text-xs text-slate-500 leading-relaxed"><MdText text={inhalt.texte.nutzenSieDenInteraktiven} /></p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1"><MdText text={inhalt.texte.szenarioNutzungspfad} /></label>
                <select aria-label={inhalt.werte.szenarioNutzungspfad}
                  className="w-full text-xs font-mono bg-slate-50 border border-home-grau/30 rounded-lg p-2.5 outline-none focus:border-home-grau/30"
                  value={bbodNutzungsart}
                  onChange={(e) => setBbodNutzungsart(e.target.value)}
                >
                  <option value="spielplatz">Boden-Mensch: Kinderspielplätze</option>
                  <option value="wohngebiet">Boden-Mensch: Wohngebiete</option>
                  <option value="park">Boden-Mensch: Park- und Freizeitanlagen</option>
                  <option value="industrie">Boden-Mensch: Industrie- und Gewerbeflächen</option>
                  <option value="grundwasser">Boden-Grundwasser: Sickerwasserpfad</option>
                  <option value="nutzpflanze">Boden-Nutzpflanze: Landwirtschaft / Gärten</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-xs text-slate-500"><MdText text={inhalt.texte.wirkungspfadLogikDieWerte} /></div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="border-b border-home-grau/30 pb-2 flex justify-between items-center">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">{selectedBbod.title}</span>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-500">{selectedBbod.unit}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(selectedBbod.values).map(([contaminant, value]) => (
                <div key={contaminant} className="p-3 bg-slate-50/50 rounded-xl border border-home-grau/30 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{contaminant}</span>
                  <span className="font-mono font-extrabold text-slate-900 bg-white border border-home-grau/30 px-2.5 py-1 rounded shadow-xs">≤ {formatDeWert(value)}</span>
                </div>
              ))}
            </div>

            {bbodNutzungsart === 'grundwasser' && (
              <div className="mt-3 p-3 bg-indigo-50 border border-indigo-150 rounded-xl text-xs text-indigo-900 leading-relaxed font-semibold"><MdText text={inhalt.texte.pfasMeilenstein2023Unter} /></div>
            )}
          </div>
        </div>

        {/* Physikalischer Bodenschutz */}
        <div className="p-5 bg-white border border-home-grau/30 rounded-2xl shadow-md space-y-4">
          <h4 className="font-bold text-slate-950 text-sm flex items-center gap-11.5">
            <Leaf className="w-5 h-5 text-emerald-600 inline mr-2" /><MdText text={inhalt.texte.physikalischerBodenschutzAufBaustellen} /></h4>
          <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.nebenDerChemischenSchadstoffbelastung} /></p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 space-y-2 border border-home-grau/30">
              <h5 className="font-bold text-slate-900"><MdText text={inhalt.texte.t1VermeidungVonBodenschäden} /></h5>
              <ul className="space-y-1.5 text-slate-600 font-medium">
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.bodendruckReduzieren} /></strong><MdText text={inhalt.texte.verwendungVonKettenlaufwerkenBreitreifen} /></li>
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.hydrologischeGrenzwerteEinhalten} /></strong><MdText text={inhalt.texte.keineBefahrungVonWeichen} /></li>
                <li>• <strong className="text-slate-800">Mutterbodenschutz:</strong><MdText text={inhalt.texte.abtragDesOberbodensMutterboden} /></li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 space-y-2 border border-home-grau/30">
              <h5 className="font-bold text-slate-900"><MdText text={inhalt.texte.t2BodenkundlicheBaubegleitungBbb} /></h5>
              <ul className="space-y-1.5 text-slate-600 font-medium">
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.wannErforderlich} /></strong><MdText text={inhalt.texte.gesetzlichEmpfohlenUndOft} /></li>
                <li>• <strong className="text-slate-800"><MdText text={inhalt.texte.aufgabeDerBbb} /></strong><MdText text={inhalt.texte.freigabeVonFahrtrassenFestlegen} /></li>
                <li>• <strong className="text-slate-800">Wiederherstellungspflicht:</strong><MdText text={inhalt.texte.nachBauabschlussMussVerdichtetes} /></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-xl mb-6">
          <h4 className="font-bold text-indigo-900 mb-2"><MdText text={inhalt.texte.bodenmaterialklassenZKlassenBm} /></h4>
          <p className="text-sm text-indigo-900 mb-3 leading-relaxed"><MdText text={inhalt.texte.bodenUndBauabfälleWerden} /></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-indigo-100">
              <h5 className="font-bold text-indigo-800 text-sm mb-1"><MdText text={inhalt.texte.ersatzbaustoffvAktuellBmKlassen} /></h5>
              <p className="text-xs text-indigo-900 mb-2"><MdText text={inhalt.texte.nachDerSeitAug} /></p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-indigo-900">
                <li><strong className="text-indigo-800 font-bold"><MdText text={inhalt.texte.bm0Bm0} /></strong><MdText text={inhalt.texte.unbelastetesBisGeringfügigVerändertes} /></li>
                <li><strong className="text-indigo-800 font-bold">BM-F1:</strong><MdText text={inhalt.texte.bodenmaterialMitEtwasMehr} /></li>
                <li><strong className="text-indigo-800 font-bold"><MdText text={inhalt.texte.bmF2BmF3} /></strong><MdText text={inhalt.texte.zunehmendeSchadstoffgehalteErfordernOft} /></li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded-lg border border-indigo-100">
              <h5 className="font-bold text-indigo-800 text-sm mb-1"><MdText text={inhalt.texte.lagaM20HistorischBodenverwertung} /></h5>
              <p className="text-xs text-indigo-900 mb-2"><MdText text={inhalt.texte.langeZeitDasStandardwerk} /></p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-indigo-900">
                <li><strong className="text-indigo-800 font-bold"><MdText text={inhalt.texte.z0Z0} /></strong><MdText text={inhalt.texte.uneingeschränktVerwertbarUnbelasteterErd} /></li>
                <li><strong className="text-indigo-800 font-bold"><MdText text={inhalt.texte.z11Z} /></strong><MdText text={inhalt.texte.eingeschränktVerwertbarerBodenMit} /></li>
                <li><strong className="text-indigo-800 font-bold">Z 2:</strong><MdText text={inhalt.texte.eingeschränktVerwertbarMitDefinierten} /></li>
                <li><strong className="text-indigo-800 font-bold">&gt; Z 2:</strong><MdText text={inhalt.texte.meistDeponierungAufDk} /></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-1.5">
            <Scale className="w-5 h-5 text-slate-600" /><MdText text={inhalt.texte.stufenweiserAblaufDerAltlastenbearbeitun} /></h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="text-shiraz font-bold text-xl mb-1">1.</div>
                <div className="font-bold text-xs mb-1.5"><MdText text={inhalt.texte.historischeErkundung} /></div>
                <div className="text-xs text-gray-600 leading-relaxed"><MdText text={inhalt.texte.rechercheInBauaktenArchiven} /></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="text-shiraz font-bold text-xl mb-1">2.</div>
                <div className="font-bold text-xs mb-1.5"><MdText text={inhalt.texte.orientierendeUntersuchung} /></div>
                <div className="text-xs text-gray-600 leading-relaxed font-semibold"><MdText text={inhalt.texte.ersteBohrungenRammkernessSchürfe} /></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="text-shiraz font-bold text-xl mb-1">3.</div>
                <div className="font-bold text-xs mb-1.5">Detailuntersuchung</div>
                <div className="text-xs text-gray-600 leading-relaxed font-semibold"><MdText text={inhalt.texte.exakte3dAbgrenzungDes} /></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="text-shiraz font-bold text-xl mb-1">4.</div>
                <div className="font-bold text-xs mb-1.5"><MdText text={inhalt.texte.sanierungSicherung} /></div>
                <div className="text-xs text-gray-600 leading-relaxed font-semibold"><MdText text={inhalt.texte.bodenaustauschAushubVerfüllungBodenlufta} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
