import type { Dispatch, SetStateAction } from 'react';
import { Recycle } from 'lucide-react';
import { baustoffRecyclingData } from './daten';
import { formatDeWert } from '@/src/utils/numberFormat';
import inhalt from '@/content/rueckbau/BaustoffrecyclingTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface BaustoffrecyclingTabProps {
  setSelectedRecyclingMaterial: Dispatch<SetStateAction<number>>;
  selectedRecyclingMaterial: number;
}

export function BaustoffrecyclingTab({ setSelectedRecyclingMaterial, selectedRecyclingMaterial }: BaustoffrecyclingTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
        <h3 className="text-base font-bold text-text-main mb-1 flex items-center gap-1.5">
          <Recycle size={18} className="text-shiraz" /><MdText text={inhalt.texte.recyclingfähigkeitEinzelnerBaustoffeNach} /></h3>
        <p className="text-xs text-text-main/70 mb-4 max-w-4xl"><MdText text={inhalt.texte.gemäßDerGewerbeabfallverordnungGewabfv} /></p>
    
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Selector List */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold text-text-main/50 uppercase tracking-wider block mb-1">Baustoffauswahl</span>
            <div className="space-y-1.5">
              {baustoffRecyclingData.map((mat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedRecyclingMaterial(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        selectedRecyclingMaterial === idx
                          ? 'bg-shiraz/5 border-shiraz/50 shadow-sm'
                          : 'bg-off-white border-home-grau/10 hover:bg-home-grau/5'
                      }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-xs font-bold text-text-main block leading-tight">{mat.name}</span>
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-home-grau/30 flex-shrink-0">AVV {mat.avv}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-1.5">
                    <span className="text-xs text-text-main/60">{mat.subtitle}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold uppercase transition-transform ${
                          mat.rating.includes('Sehr hoch')
                            ? 'bg-emerald-100 text-emerald-800'
                            : mat.rating.includes('Hoch')
                            ? 'bg-emerald-50 text-emerald-700'
                            : mat.rating.includes('Mittel')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-50 text-red-800'
                        }`}>
                      {mat.rating.split(' ')[0]}
                    </span>
                  </div>
                  
                  {/* Linear progress preview */}
                  <div className="h-1 bg-slate-200 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                            mat.percentage > 80 ? 'bg-emerald-500' : mat.percentage > 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                      style={{ width: `${mat.percentage}%` }}
                    ></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
    
          {/* Right Detail Panel */}
          <div className="lg:col-span-8 bg-off-white p-6 rounded-xl border border-home-grau/15 flex flex-col justify-between">
            <div>
              {/* Title and Rating header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/15">
                <div>
                  <h4 className="text-base font-bold text-shiraz">{baustoffRecyclingData[selectedRecyclingMaterial].name}</h4>
                  <p className="text-xs text-text-main/60 mt-0.5 italic">{baustoffRecyclingData[selectedRecyclingMaterial].subtitle}</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-home-grau/10 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-text-main/60 font-bold">RECYCLING-QUOTE</div>
                    <div className="text-sm font-mono font-bold text-shiraz">{formatDeWert(baustoffRecyclingData[selectedRecyclingMaterial].percentage)}%</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-shiraz/5 border border-shiraz/20 flex items-center justify-center text-xs font-bold text-shiraz">
                    {formatDeWert(baustoffRecyclingData[selectedRecyclingMaterial].percentage)}%
                  </div>
                </div>
              </div>
    
              {/* Detailed Information blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 rounded-xl border border-home-grau/10 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Aufbereitungsmethode</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">{baustoffRecyclingData[selectedRecyclingMaterial].process}</p>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-home-grau/10 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block"><MdText text={inhalt.texte.typischeVerwertungspfade} /></span>
                  <ul className="space-y-1.5 pt-0.5">
                    {baustoffRecyclingData[selectedRecyclingMaterial].useCases.map((useCase, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-normal">
                        <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
    
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-red-50/40 p-4 rounded-xl border border-red-200/50 space-y-1">
                  <span className="text-xs font-bold text-red-800 uppercase tracking-widest block"><MdText text={inhalt.texte.störstoffrisikoSensibilität} /></span>
                  <p className="text-xs text-red-950 leading-relaxed font-sans">{baustoffRecyclingData[selectedRecyclingMaterial].risks}</p>
                </div>
    
                <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-200/40 space-y-1">
                  <span className="text-xs font-bold text-indigo-800 uppercase tracking-widest block"><MdText text={inhalt.texte.rechtlicheNormierungBeachtung} /></span>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {baustoffRecyclingData[selectedRecyclingMaterial].regulations || inhalt.werte.fälltUnterDieAllgemeinen}
                  </p>
                </div>
              </div>
            </div>
    
            <div className="mt-6 pt-4 border-t border-home-grau/10 bg-slate-50/75 p-3 rounded-lg flex items-center justify-between text-xs text-slate-600">
              <span className="font-bold uppercase tracking-wider"><MdText text={inhalt.texte.abfallschlüsselAvv} /></span>
              <span className="font-mono font-bold text-shiraz bg-white border border-shiraz/20 px-2 py-0.5 rounded">AVV {baustoffRecyclingData[selectedRecyclingMaterial].avv}</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* Table summary of all materials for quick overview */}
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm overflow-x-auto">
        <h4 className="text-sm font-bold text-text-main mb-1"><MdText text={inhalt.texte.vergleichendeRecyclingmatrixFürBaustoffe} /></h4>
        <p className="text-xs text-text-main/60 mb-4"><MdText text={inhalt.texte.umfassendeZusammenstellungAllerRecycling} /></p>
        <table className="min-w-full text-xs text-left text-text-main">
          <thead className="bg-slate-50 uppercase text-xs text-text-main/60 border-b border-home-grau/25">
            <tr>
              <th className="py-2.5 px-3">Baustoff</th>
              <th className="py-2.5 px-3">AVV-Code</th>
              <th className="py-2.5 px-3">Quote (%)</th>
              <th className="py-2.5 px-3">Einstufung</th>
              <th className="py-2.5 px-3">Hauptstörstoffe</th>
              <th className="py-2.5 px-3"><MdText text={inhalt.texte.verwertungsklasseRechtliches} /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-home-grau/10">
            {baustoffRecyclingData.map((mat, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-bold text-slate-800">{mat.name}</td>
                <td className="py-2.5 px-3 font-mono text-xs text-slate-500">{mat.avv}</td>
                <td className="py-2.5 px-3 font-semibold text-shiraz">{formatDeWert(mat.percentage)}%</td>
                <td className="py-2.5 px-3">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-bold uppercase ${
                        mat.rating.includes('Sehr hoch')
                          ? 'bg-emerald-100 text-emerald-800'
                          : mat.rating.includes('Hoch')
                          ? 'bg-emerald-50 text-emerald-700'
                          : mat.rating.includes('Mittel')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-50 text-red-800'
                      }`}>
                    {mat.rating}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-red-900 text-xs max-w-[200px] truncate" title={mat.risks}>{mat.risks}</td>
                <td className="py-2.5 px-3 text-slate-600 text-xs max-w-[250px] truncate" title={mat.regulations || inhalt.werte.gewabfvStandard}>
                  {mat.regulations || inhalt.werte.gewabfvGetrennthaltungspflicht}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
      {/* Spezialthema: Bodenaufbereitung & Qualitätssicherung */}
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-home-grau/25 pb-3">
          <div className="p-2 bg-emerald-50 text-emerald-750 rounded-lg">
            <Recycle size={20} />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900"><MdText text={inhalt.texte.bodenErdaushubaufbereitungVerfahrenVorsc} /></h4>
            <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.stofflicheErholungVonKontaminierten} /></p>
          </div>
        </div>
    
        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.dieWiederverwendungVonBodenähnlichen} /></p>
    
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Verfahren Panel */}
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 space-y-3">
            <h5 className="font-bold text-xs text-slate-900 border-b border-home-grau/20 pb-1 uppercase tracking-wider text-slate-500"><MdText text={inhalt.texte.t1Aufbereitungsverfahren} /></h5>
            <ul className="space-y-3.5 text-xs text-slate-700">
              <li className="space-y-0.5">
                <strong className="text-slate-950 font-bold block"><MdText text={inhalt.texte.nassmechanischeBodenwaschVerfahren} /></strong>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.prallwäscheTrenntKontaminierteFeinfrakti} /></p>
              </li>
              <li className="space-y-0.5">
                <strong className="text-slate-950 font-bold block"><MdText text={inhalt.texte.thermischeDesorptionsanlagenDrehrohr} /></strong>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.beiErhitzungAuf350} /></p>
              </li>
              <li className="space-y-0.5">
                <strong className="text-slate-950 font-bold block"><MdText text={inhalt.texte.biologischeMietenaufbereitungBioremediat} /></strong>
                <p className="text-xs text-slate-650 leading-normal"><MdText text={inhalt.texte.mikrobiellerAbbauLeichtFlüchtiger} /></p>
              </li>
            </ul>
          </div>
    
          {/* Vorschriften Panel */}
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 space-y-3">
            <h5 className="font-bold text-xs text-slate-900 border-b border-home-grau/20 pb-1 uppercase tracking-wider text-slate-500"><MdText text={inhalt.texte.t2GesetzlicheVorschriften} /></h5>
            <ul className="space-y-3.5 text-xs text-slate-700">
              <li className="space-y-0.5">
                <strong className="text-slate-950 font-bold block"><MdText text={inhalt.texte.ebvGüteUndEinbauklassen} /></strong>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.gereinigteBödenWerdenJe} /></p>
              </li>
              <li className="space-y-0.5">
                <strong className="text-slate-950 font-bold block"><MdText text={inhalt.texte.bundesBodenschutzverordnungBbodschv} /></strong>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.trittInKraftWenn} /></p>
              </li>
              <li className="space-y-0.5">
                <strong className="text-slate-950 font-bold block"><MdText text={inhalt.texte.ersatzbaustoffregisterMeldepflicht22} /></strong>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.einbauerstatterMüssenEinbautenMineralisc} /></p>
              </li>
            </ul>
          </div>
    
          {/* Qualitätssicherung Panel */}
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 space-y-3">
            <h5 className="font-bold text-xs text-slate-900 border-b border-home-grau/20 pb-1 uppercase tracking-wider text-slate-500"><MdText text={inhalt.texte.t3QualitätssicherungGüteüberwachung} /></h5>
            <ul className="space-y-3.5 text-xs text-slate-700">
              <li className="space-y-0.5">
                <strong className="text-slate-950 font-bold block"><MdText text={inhalt.texte.werkseigeneProduktionskontrolleWpk} /></strong>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.dasAufbereitungswerkFührtKontinuierliche} /></p>
              </li>
              <li className="space-y-0.5">
                <strong className="text-slate-950 font-bold block"><MdText text={inhalt.texte.fremdüberwachungPrüfstellen} /></strong>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.unabhängigeStaatlichAnerkanntePrüfinstit} /></p>
              </li>
              <li className="space-y-0.5">
                <strong className="text-slate-950 font-bold block"><MdText text={inhalt.texte.gütegemeinschaftenZertifikate} /></strong>
                <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.etablierteVerbändeZB} /></p>
              </li>
            </ul>
          </div>
        </div>
    
        <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-200/60 text-xs font-semibold flex items-start gap-2">
          <span className="p-1 px-1.5 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded text-xs font-mono leading-none flex-shrink-0">TIPP</span>
          <p className="leading-relaxed"><MdText text={inhalt.texte.interaktiveBerechnungenUndTiefergehende} /></p>
        </div>
      </div>
    </div>
  );
}
