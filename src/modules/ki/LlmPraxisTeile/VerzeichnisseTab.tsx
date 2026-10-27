import type { Dispatch, SetStateAction } from 'react';
import { FolderTree, FileCode, Copy, Check } from 'lucide-react';
import inhalt from '@/content/ki/LlmPraxisTeile/VerzeichnisseTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface VerzeichnisseTabProps {
  dirProjectType: "bauleitung" | "pruefstatik" | "masterarbeit";
  setDirProjectType: Dispatch<SetStateAction<"bauleitung" | "pruefstatik" | "masterarbeit">>;
  copyToClipboard: (text: string, key: string) => void;
  copiedKey: string | null;
}

export function VerzeichnisseTab({ dirProjectType, setDirProjectType, copyToClipboard, copiedKey }: VerzeichnisseTabProps) {
  return (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                      <FolderTree size={20} className="text-shiraz" /><MdText text={inhalt.texte.projektverzeichnisseAnweisungsdateiLeitfaden} /></h3>
                    <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.strukturierteDatenhaltungFürReibungslose} /></p>
                  </div>
    
                  {/* Project Type Selector */}
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button aria-pressed={dirProjectType === 'bauleitung'}
                      onClick={() => setDirProjectType('bauleitung')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${dirProjectType === 'bauleitung' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    ><MdText text={inhalt.texte.bauleitungVob} /></button>
                    <button aria-pressed={dirProjectType === 'pruefstatik'}
                      onClick={() => setDirProjectType('pruefstatik')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${dirProjectType === 'pruefstatik' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    ><MdText text={inhalt.texte.prüfstatikEc2} /></button>
                    <button aria-pressed={dirProjectType === 'masterarbeit'}
                      onClick={() => setDirProjectType('masterarbeit')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${dirProjectType === 'masterarbeit' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    ><MdText text={inhalt.texte.masterarbeitLabor} /></button>
                  </div>
                </div>
    
                {/* DYNAMIC FOLDER TREE PER SCENARIO */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-950 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 space-y-1">
                    <div className="text-emerald-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FolderTree size={14} /> 
                        {dirProjectType === 'bauleitung' ? 'BV_Wohnanlage_Augsburg_Bauleitung/' : dirProjectType === 'pruefstatik' ? 'BV_Gewerbepark_Tragwerksplanung/' : 'Masterarbeit_Recyclingbeton_THA/'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal"><MdText text={inhalt.texte.iso8601Nomenklatur} /></span>
                    </div>
    
                    <div className="pt-2 text-slate-300">
                      <div className="pl-2">├── 📄 <span className="text-emerald-300 font-bold">PROJEKTANWEISUNGEN.md</span> <span className="text-slate-500"><MdText text={inhalt.texte.zentraleBüroProjektrichtlinien} /></span></div>
                      <div className="pl-2">├── 📄 <span className="text-amber-300 font-bold">.cursorrules</span> <span className="text-slate-500"><MdText text={inhalt.texte.codingFormelstandardsFürKi} /></span></div>
                      
                      {dirProjectType === 'bauleitung' && (
                        <>
                          <div className="pl-2">├── 📁 <span className="text-amber-300">01_vertrag_vob/</span></div>
                          <div className="pl-6"><MdText text={inhalt.texte.bauvertragEckdatenMd} /></div>
                          <div className="pl-6"><MdText text={inhalt.texte.leistungsverzeichnisKurzMd} /></div>
                          <div className="pl-2">├── 📁 <span className="text-amber-300">02_bautagebuch/</span></div>
                          <div className="pl-6"><MdText text={inhalt.texte.t20260312Bodenplatte} /></div>
                          <div className="pl-6"><MdText text={inhalt.texte.t20260313Stuetzen} /></div>
                          <div className="pl-2">├── 📁 <span className="text-amber-300">03_lieferscheine/</span></div>
                          <div className="pl-6"><MdText text={inhalt.texte.t20260312Beton} /></div>
                          <div className="pl-2">└── 📁 <span className="text-amber-300">04_maengel_behinderung/</span></div>
                          <div className="pl-6"><MdText text={inhalt.texte.maengellisteRohbauMd} /></div>
                          <div className="pl-6"><MdText text={inhalt.texte.vobBedenkenanmeldungenMd} /></div>
                        </>
                      )}
    
                      {dirProjectType === 'pruefstatik' && (
                        <>
                          <div className="pl-2">├── 📁 <span className="text-amber-300">01_grundlagen_lasten/</span></div>
                          <div className="pl-6"><MdText text={inhalt.texte.lastannahmenDinEn1991} /></div>
                          <div className="pl-6"><MdText text={inhalt.texte.baugrundschichtenEc7Md} /></div>
                          <div className="pl-2">├── 📁 <span className="text-amber-300">02_baustoffe/</span></div>
                          <div className="pl-6"><MdText text={inhalt.texte.betonStahlKennwerteMd} /><span className="text-slate-500"><MdText text={inhalt.texte.c3545B500b} /></span></div>
                          <div className="pl-2">├── 📁 <span className="text-amber-300">03_bauteile/</span></div>
                          <div className="pl-6"><MdText text={inhalt.texte.deckeOg1DurchstanzenMd} /></div>
                          <div className="pl-6"><MdText text={inhalt.texte.stuetzenbemessungKnickenMd} /></div>
                          <div className="pl-2">└── 📁 <span className="text-amber-300">04_positionsplaene/</span></div>
                          <div className="pl-6"><MdText text={inhalt.texte.posUebersichtAbmessungenMd} /></div>
                        </>
                      )}
    
                      {dirProjectType === 'masterarbeit' && (
                        <>
                          <div className="pl-2">├── 📁 <span className="text-amber-300">01_expose_literatur/</span></div>
                          <div className="pl-6"><MdText text={inhalt.texte.forschungsfragenMd} /></div>
                          <div className="pl-6"><MdText text={inhalt.texte.literaturMatrixMd} /></div>
                          <div className="pl-2">├── 📁 <span className="text-amber-300">02_labor_messdaten/</span></div>
                          <div className="pl-6"><MdText text={inhalt.texte.druckversuch28dCsv} /></div>
                          <div className="pl-6"><MdText text={inhalt.texte.spaltzugversucheCsv} /></div>
                          <div className="pl-2">├── 📁 <span className="text-amber-300">03_skripte_python/</span></div>
                          <div className="pl-6"><MdText text={inhalt.texte.auswertungRegressionPy} /></div>
                          <div className="pl-6"><MdText text={inhalt.texte.sieblinienPlotterPy} /></div>
                          <div className="pl-2">└── 📁 <span className="text-amber-300">04_manuskript/</span></div>
                          <div className="pl-6"><MdText text={inhalt.texte.kapitel04ErgebnisseMd} /></div>
                        </>
                      )}
                    </div>
                  </div>
    
                  {/* EXPLANATION OF DIRECTORY LAYOUT & RULES */}
                  <div className="space-y-3 flex flex-col justify-between text-xs">
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.dieGoldenenVerzeichnisRegeln} /></h4>
                      
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-home-grau/20">
                        <strong className="text-shiraz"><MdText text={inhalt.texte.t1AnweisungsdateiIm} /></strong>
                        <p className="text-text-main/70 mt-0.5"><MdText text={inhalt.texte.wirdVonAgentenGeladen} /></p>
                      </div>
    
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-home-grau/20">
                        <strong className="text-text-main"><MdText text={inhalt.texte.t2KuratierteAuszügeStatt} /></strong>
                        <p className="text-text-main/70 mt-0.5"><MdText text={inhalt.texte.legeNichtDasKomplette} /></p>
                      </div>
    
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-home-grau/20">
                        <strong className="text-text-main"><MdText text={inhalt.texte.t3Iso8601Dateinamen} /></strong>
                        <p className="text-text-main/70 mt-0.5"><MdText text={inhalt.texte.verwendeStets} /><code className="font-mono">YYYY-MM-DD_thema.md</code><MdText text={inhalt.texte.llmsVerstehenZeitlicheAbfolgen} /></p>
                      </div>
                    </div>
    
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900"><MdText text={inhalt.texte.proTippProjektbereiche} /><code className="font-mono">PROJEKTANWEISUNGEN.md</code><MdText text={inhalt.texte.direktInDieProject} /></div>
                  </div>
                </div>
    
                {/* READY-TO-USE VORLAGE PROJEKTANWEISUNGSDATEI */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-shiraz flex items-center gap-1.5">
                      <FileCode size={15} /><MdText text={inhalt.texte.vollständigeBüroVorlageAnweisungsdatei} /></span>
                    <button
                      onClick={() => copyToClipboard(inhalt.werte.anweisungsdateiIngenieurbüroRichtlinien, 'anweisungsdatei_voll')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-shiraz hover:text-white rounded text-xxs font-bold flex items-center gap-1 transition-all"
                    >
                      {copiedKey === 'anweisungsdatei_voll' ? <Check size={12} /> : <Copy size={12} />}
                      <span><MdText text={inhalt.texte.anweisungsdateiKopieren} /></span>
                    </button>
                  </div>
    
                  <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
    {inhalt.werte.anweisungsdateiIngenieurbüroRichtlinien2}
                  </pre>
                </div>
              </div>
            </div>
  );
}
