import type { Dispatch, SetStateAction } from 'react';
import { Scale, Calculator, Info, Settings, CheckCircle2 } from 'lucide-react';
import { formatDeZahl } from '@/src/utils/numberFormat';
import inhalt from '@/content/messenpruefen/BegriffeTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { werkzeugToleranz } from '@/src/calc/pruefverfahren';

export interface BegriffeTabProps {
  setSelectedTool: Dispatch<SetStateAction<"meterstab" | "messschieber" | "laser" | "risslupe" | "nivellier">>;
  setToolInputValue: Dispatch<SetStateAction<number>>;
  selectedTool: "meterstab" | "messschieber" | "laser" | "risslupe" | "nivellier";
  toolInputValue: number;
}

export function BegriffeTab({ setSelectedTool, setToolInputValue, selectedTool, toolInputValue }: BegriffeTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
      <Settings className="text-shiraz" size={20} /><MdText text={inhalt.texte.kalibrierenJustierenEichenVergleichen} /></h2>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p><MdText text={inhalt.texte.imAlltäglichenLaborbetriebWerden} /></p>
    </div>
    
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* Kalibrieren */}
          <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 hover:bg-white transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">Kalibrieren</span>
                <span className="text-[10px] text-slate-400 font-mono"><MdText text={inhalt.texte.keinEingriff} /></span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans"><MdText text={inhalt.texte.zusammenhangErmitteln} /></h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans"><MdText text={inhalt.texte.ermittelnDerMessabweichungZwischen} /></p>
              <blockquote className="border-l-2 border-shiraz/40 pl-2.5 text-[11px] text-slate-600 italic mt-3 font-sans"><MdText text={inhalt.texte.beispielKalibrierungDesKraftmesssystems} /></blockquote>
            </div>
            <div className="mt-4 pt-3.5 border-t border-home-grau/30 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <CheckCircle2 size={12} className="text-emerald-500" /><MdText text={inhalt.texte.dokumentiertSystematischeAbweichung} /></div>
          </div>
    
          {/* Justieren */}
          <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 hover:bg-white transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">Justieren</span>
                <span className="text-[10px] text-slate-400 font-mono">Geräte-Eingriff</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans">Sollwertharmonisierung</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans"><MdText text={inhalt.texte.einstellenOderAbgleichenEines} /></p>
              <blockquote className="border-l-2 border-shiraz/40 pl-2.5 text-[11px] text-slate-600 italic mt-3 font-sans"><MdText text={inhalt.texte.beispielProgrammierenUndJustieren} /></blockquote>
            </div>
            <div className="mt-4 pt-3.5 border-t border-home-grau/30 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <CheckCircle2 size={12} className="text-blue-500" /><MdText text={inhalt.texte.verändertDasGeräteverhaltenDauerhaft} /></div>
          </div>
    
          {/* Eichen */}
          <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 hover:bg-white transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">Eichen</span>
                <span className="text-[10px] text-slate-400 font-mono"><MdText text={inhalt.texte.gesetzlichePflicht} /></span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans"><MdText text={inhalt.texte.amtlichePrüfung} /></h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans"><MdText text={inhalt.texte.gesetzlichVorgeschriebenePrüfungUnd} /></p>
              <blockquote className="border-l-2 border-shiraz/40 pl-2.5 text-[11px] text-slate-600 italic mt-3 font-sans"><MdText text={inhalt.texte.beispielEichungDerFahrzeugwaage} /></blockquote>
            </div>
            <div className="mt-4 pt-3.5 border-t border-home-grau/30 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <CheckCircle2 size={12} className="text-amber-500" /><MdText text={inhalt.texte.eichmarkeMitAblaufDer} /></div>
          </div>
    
        </div>
      </div>
    
      {/* Table Comparison Overview */}
      <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-900 mb-3 font-sans"><MdText text={inhalt.texte.direkterKriterienVergleich} /></h3>
        <table className="min-w-full text-xs text-left text-slate-700">
          <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 border-b border-home-grau/30">
            <tr>
              <th className="py-2.5 px-3"><MdText text={inhalt.texte.eigenschaftKriterium} /></th>
              <th className="py-2.5 px-3">Kalibrieren</th>
              <th className="py-2.5 px-3">Justieren</th>
              <th className="py-2.5 px-3">Eichen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            <tr>
              <td className="py-2.5 px-3 font-semibold text-slate-800"><MdText text={inhalt.texte.eingriffAmMessgerät} /></td>
              <td className="py-2.5 px-3 text-slate-600"><MdText text={inhalt.texte.neinNurErmittlungUnd} /></td>
              <td className="py-2.5 px-3 text-slate-600 font-semibold text-blue-700"><MdText text={inhalt.texte.jaMechanischeElektronischeJustage} /></td>
              <td className="py-2.5 px-3 text-slate-600"><MdText text={inhalt.texte.eventuellFallsJustageWährend} /></td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-slate-800"><MdText text={inhalt.texte.werDarfEsDurchführen} /></td>
              <td className="py-2.5 px-3 text-slate-600"><MdText text={inhalt.texte.beliebigeGeschulteStelleDakks} /></td>
              <td className="py-2.5 px-3 text-slate-600"><MdText text={inhalt.texte.prüfgerätBetreiberServiceTechniker} /></td>
              <td className="py-2.5 px-3 text-slate-600 font-semibold text-amber-700"><MdText text={inhalt.texte.eichbehördeOderStaatlichAnerkannte} /></td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-slate-800"><MdText text={inhalt.texte.rechtlicheBzwNormativeGrundlage} /></td>
              <td className="py-2.5 px-3 text-slate-600"><MdText text={inhalt.texte.vertragQmDinEn} /></td>
              <td className="py-2.5 px-3 text-slate-600"><MdText text={inhalt.texte.nutzerSpezifikationHerstellerWartungshan} /></td>
              <td className="py-2.5 px-3 text-slate-600 font-semibold text-amber-700"><MdText text={inhalt.texte.messUndEichgesetzMesseg} /></td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-slate-800"><MdText text={inhalt.texte.resultatBeleg} /></td>
              <td className="py-2.5 px-3 text-slate-600"><MdText text={inhalt.texte.kalibrierscheinMesswerteUnsicherheiten} /></td>
              <td className="py-2.5 px-3 text-slate-600"><MdText text={inhalt.texte.gerätIstSollwertjustiertJustierprotokoll} /></td>
              <td className="py-2.5 px-3 text-slate-600"><MdText text={inhalt.texte.eichmarkeNeugeräteKonformitätsbewertungM} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    
      {/* Sektion: Genauigkeit von Messverfahren im Bauwesen */}
      <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
          <Scale size={20} className="text-indigo-600" /><MdText text={inhalt.texte.genauigkeitToleranzgrenzenGängigerMessve} /></h3>
        <p className="text-slate-600 text-xs leading-relaxed max-w-4xl mb-6 font-sans"><MdText text={inhalt.texte.jedesMessverfahrenUnterliegtSystematisch} /></p>
    
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Linkes Menü: Messgeräte */}
          <div className="lg:col-span-4 space-y-2">
            {[
              { id: 'meterstab', label: inhalt.werte.zollstockMeterstab, sub: inhalt.werte.euGenauigkeitsklasseIiMid },
              { id: 'messschieber', label: inhalt.werte.messschieberSchieblehre, sub: inhalt.werte.dinEnIso13385 },
              { id: 'laser', label: 'Laser-Entfernungsmesser', sub: 'ISO 16331-1' },
              { id: 'risslupe', label: inhalt.werte.risslupeRissmikroskop, sub: 'Schadensdiagnostik' },
              { id: 'nivellier', label: inhalt.werte.baunivellierOptischDigital, sub: inhalt.werte.dinIso171232 },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTool(t.id as "laser" | "meterstab" | "messschieber" | "risslupe" | "nivellier");
                  // Default values fitted to the tool range
                  if (t.id === 'meterstab') setToolInputValue(2000);
                  else if (t.id === 'messschieber') setToolInputValue(120);
                  else if (t.id === 'laser') setToolInputValue(15000);
                  else if (t.id === 'risslupe') setToolInputValue(0.3);
                  else if (t.id === 'nivellier') setToolInputValue(50000);
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedTool === t.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                        : 'border-home-grau/30 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
              >
                <div className="font-bold text-xs">{t.label}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.sub}</div>
              </button>
            ))}
          </div>
    
          {/* Detail-Panel auf der rechten Seite */}
          <div className="lg:col-span-8 border border-home-grau/30 rounded-xl p-5 bg-slate-50/40 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-home-grau/30 pb-3 mb-4 font-sans">
                <span className="text-sm font-bold text-slate-900">
                  {selectedTool === 'meterstab' && inhalt.werte.meterstabZBHolz}
                  {selectedTool === 'messschieber' && inhalt.werte.taschenmessschieberSchieblehre}
                  {selectedTool === 'laser' && inhalt.werte.handLaserentfernungsmesserDistanzer}
                  {selectedTool === 'risslupe' && inhalt.werte.präzisionsRisslupeTaschenmikroskop}
                  {selectedTool === 'nivellier' && inhalt.werte.optischMechanischesBauNivelliergerät}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200 py-0.5 px-2 rounded">
                  {selectedTool === 'meterstab' && inhalt.werte.toleranzklasseIi}
                  {selectedTool === 'messschieber' && inhalt.werte.dinEnIso133852}
                  {selectedTool === 'laser' && 'ISO 16331-1'}
                  {selectedTool === 'risslupe' && 'ZfP-Methodik'}
                  {selectedTool === 'nivellier' && inhalt.werte.dinIso1712322}
                </span>
              </div>
    
              <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase"><MdText text={inhalt.texte.auflösungAblesbarkeit} /></span>
                  <strong className="text-slate-800 text-xs mt-0.5 block">
                    {selectedTool === 'meterstab' && inhalt.werte.t10MmSkalenteilung}
                    {selectedTool === 'messschieber' && inhalt.werte.t005MmAnalog}
                    {selectedTool === 'laser' && inhalt.werte.t10MmInterne}
                    {selectedTool === 'risslupe' && inhalt.werte.t005MmMessskala}
                    {selectedTool === 'nivellier' && inhalt.werte.t05MmBis}
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase"><MdText text={inhalt.texte.fehlergrenzeTypisch} /></span>
                  <strong className="text-slate-800 text-xs mt-0.5 block font-mono">
                    {selectedTool === 'meterstab' && inhalt.werte.t0302}
                    {selectedTool === 'messschieber' && inhalt.werte.t003MmBis}
                    {selectedTool === 'laser' && inhalt.werte.t10005}
                    {selectedTool === 'risslupe' && inhalt.werte.t005MmAblesegrenze}
                    {selectedTool === 'nivellier' && inhalt.werte.t15MmStandardabweichung}
                  </strong>
                </div>
              </div>
    
              {/* Interaktiver Toleranz-Rechner */}
              <div className="bg-indigo-50/40 border border-indigo-150/60 rounded-lg p-4 mb-4">
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Calculator size={14} className="text-indigo-600" /><MdText text={inhalt.texte.interaktiverToleranzSchätzer} /></h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {selectedTool === 'meterstab' && inhalt.werte.zielMesslängeMm}
                      {selectedTool === 'messschieber' && inhalt.werte.zylinderdurchmesserDMm}
                      {selectedTool === 'laser' && inhalt.werte.raumdiagonaleLMm}
                      {selectedTool === 'risslupe' && inhalt.werte.rissbreiteWMm}
                      {selectedTool === 'nivellier' && inhalt.werte.entfernungZurNivellierlatteMm}
                    </label>
                    <input
                      type="number" min="0"
                      step={selectedTool === 'risslupe' ? '0.05' : '10'}
                      value={toolInputValue}
                      onChange={(e) => setToolInputValue(Math.max(0.01, parseFloat(e.target.value) || 0))}
                      className="w-full bg-white border border-home-grau/30 rounded px-2.5 py-1 text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="bg-white p-2.5 rounded border border-indigo-100 flex flex-col justify-center">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase"><MdText text={inhalt.texte.fehlergrenzeBzwStandardabweichung} /></span>
                    <span className="text-xs font-mono font-extrabold text-indigo-700">
                      {/* Rechenkern src/calc/pruefverfahren.ts (werkzeugToleranz) */}
                      <>± {formatDeZahl(werkzeugToleranz(selectedTool, toolInputValue), 2)} mm</>
                    </span>
                  </div>
                </div>
              </div>
    
              <div className="space-y-2 font-sans">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono"><MdText text={inhalt.texte.häufigeFehlerquellenImBaubetrieb} /></span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-[11px] text-slate-600">
                  {selectedTool === 'meterstab' && (
                    <>
                      <li><MdText text={inhalt.texte.parallaxenfehlerSchiefesAblesenVon} /></li>
                      <li><MdText text={inhalt.texte.gelenkverschleißAbgenutzteFedergelenkeEr} /></li>
                      <li><MdText text={inhalt.texte.thermischesVerhaltenHolzDehnt} /></li>
                      <li><MdText text={inhalt.texte.geneigteMesslinieSchräglageDes} /></li>
                    </>
                  )}
                  {selectedTool === 'messschieber' && (
                    <>
                      <li><MdText text={inhalt.texte.verkanteterMessschenkelFührtZu} /></li>
                      <li><MdText text={inhalt.texte.messdruckÜberhöhterHanddruckBiegt} /></li>
                      <li><MdText text={inhalt.texte.schmutzpartikelBetonstaubOderTrennmittel} /></li>
                      <li><MdText text={inhalt.texte.abgenutzteSchneidenRundungDer} /></li>
                    </>
                  )}
                  {selectedTool === 'laser' && (
                    <>
                      <li><MdText text={inhalt.texte.zieloberflächeStrukturierterSpritzbetonS} /></li>
                      <li><MdText text={inhalt.texte.lufteinflussStarkerBaustaubOder} /></li>
                      <li><MdText text={inhalt.texte.ausrichtungszitternFreihandmessungenBeiE} /></li>
                      <li><MdText text={inhalt.texte.fremdlichtDirekteSonneneinstrahlungÜberl} /></li>
                    </>
                  )}
                  {selectedTool === 'risslupe' && (
                    <>
                      <li><MdText text={inhalt.texte.schattenwurfSchlechtAusgeleuchteteRisse} /></li>
                      <li><MdText text={inhalt.texte.schrägaufsichtKippenDerLupe} /></li>
                      <li><MdText text={inhalt.texte.subjektiverFehlerSchätzenZwischen} /></li>
                      <li><MdText text={inhalt.texte.verschmutzungAusgebrocheneRisskantenKrat} /></li>
                    </>
                  )}
                  {selectedTool === 'nivellier' && (
                    <>
                      <li><MdText text={inhalt.texte.dosenlibelleFehljustierungOderSchlampige} /></li>
                      <li><MdText text={inhalt.texte.messlattenKippungSchrägStehende} /></li>
                      <li><MdText text={inhalt.texte.refraktionFlimmernFlirrendeHitze} /></li>
                      <li><MdText text={inhalt.texte.vibrationenBaustellenverkehrZB} /></li>
                    </>
                  )}
                </ul>
              </div>
            </div>
    
            <div className="mt-4 pt-3.5 border-t border-home-grau/30 text-[10px] text-slate-500 font-sans leading-relaxed flex items-center gap-1.5">
              <Info size={12} className="text-slate-400 shrink-0" />
              <span><MdText text={inhalt.texte.einsatzgebietRelevanz} />{selectedTool === 'meterstab' && inhalt.werte.standardmäßigVerwendetFürGrobe}
                {selectedTool === 'messschieber' && inhalt.werte.unerlässlichImLaborFür}
                {selectedTool === 'laser' && inhalt.werte.gutGeeignetFürVerformungsgerechte}
                {selectedTool === 'risslupe' && inhalt.werte.wichtigesHandwerkszeugBeiBauzustandsanal}
                {selectedTool === 'nivellier' && inhalt.werte.bestandteilVonDeformationsmessungenDurch}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
