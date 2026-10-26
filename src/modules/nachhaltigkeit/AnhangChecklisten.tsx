import { AlertTriangle } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import inhalt from '@/content/nachhaltigkeit/AnhangChecklisten.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface AnhangChecklistenProps {
  checklistState: Record<string, boolean>;
  setChecklistState: Dispatch<SetStateAction<Record<string, boolean>>>;
}

export default function AnhangChecklisten({ checklistState, setChecklistState }: AnhangChecklistenProps) {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 2</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1"><MdText text={inhalt.texte.checklistenKlausurklassikerFehlerprävent} /></h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.studienerfolgeHängenMeistDavon} /></p>

        <div className="space-y-3.5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5"><MdText text={inhalt.texte.checklisteProduktökobilanzEpdNutzung} /></h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {inhalt.daten.AnhangChecklisten.map((item) => (
              <label 
                key={item.id} 
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all select-none ${
                            checklistState[item.id] 
                              ? 'bg-emerald-50/40 border-emerald-300 text-slate-800' 
                              : 'bg-slate-50/50 border-stone-200/80 text-slate-600 hover:bg-slate-50'
                          }`}
              >
                <input 
                  type="checkbox" 
                  checked={!!checklistState[item.id]} 
                  onChange={() => setChecklistState(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className="mt-1 accent-emerald-600 rounded shadow-inner"
                />
                <span className="text-[11px] leading-relaxed font-medium">{item.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3.5 pt-4 border-t border-stone-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5"><MdText text={inhalt.texte.checklisteGebäudeökobilanzQng} /></h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {inhalt.daten.AnhangChecklisten_2.map((item) => (
              <label 
                key={item.id} 
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all select-none ${
                            checklistState[item.id] 
                              ? 'bg-emerald-50/40 border-emerald-300 text-slate-800' 
                              : 'bg-slate-50/50 border-stone-200/80 text-slate-600 hover:bg-slate-50'
                          }`}
              >
                <input 
                  type="checkbox" 
                  checked={!!checklistState[item.id]} 
                  onChange={() => setChecklistState(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className="mt-1 accent-emerald-600 rounded shadow-inner"
                />
                <span className="text-[11px] leading-relaxed font-medium">{item.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h4 className="text-xs font-bold text-red-950 uppercase tracking-widest flex items-center gap-1.5">
            <AlertTriangle size={15} className="text-red-700" /><MdText text={inhalt.texte.die12HäufigstenFehleingaben} /></h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {inhalt.daten.AnhangChecklisten_3.map((item) => (
              <div key={item.no} className="bg-slate-50/50 p-4 rounded-xl border border-stone-200 flex gap-3">
                <span className="w-6 h-6 bg-red-100 border border-red-250 text-red-800 font-bold font-mono text-xs rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  {item.no}
                </span>
                <div className="space-y-1">
                  <strong className="text-xs font-bold text-slate-900 block">{item.title}</strong>
                  <div className="text-[10px] text-red-950 font-medium leading-relaxed bg-red-50/30 p-1.5 rounded border border-red-100">
                    <span className="font-bold"><MdText text={inhalt.texte.typischerFehler} /></span> {item.err}
                  </div>
                  <div className="text-[10px] text-emerald-950 font-medium leading-relaxed bg-emerald-50/30 p-1.5 rounded border border-emerald-100">
                    <span className="font-bold"><MdText text={inhalt.texte.richtigeLösung} /></span> {item.sol}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
