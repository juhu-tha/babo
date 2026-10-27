import { ClipboardList, List, Recycle, ShieldCheck, Database, Search, AlertTriangle, Scale } from 'lucide-react';
import React from 'react';
import inhalt from '@/content/abfaelle/Checklisten.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../../components/ui/Auswahlgruppe';

interface ChecklistenProps {
  activeChecklistSubTab: "einstufung" | "mineralik" | "rueckbau" | "deponie" | "probenahme" | "gefahrstoffe";
  setActiveChecklistSubTab: React.Dispatch<React.SetStateAction<"einstufung" | "mineralik" | "rueckbau" | "deponie" | "probenahme" | "gefahrstoffe">>;
}

export default function Checklisten({ activeChecklistSubTab, setActiveChecklistSubTab }: ChecklistenProps) {
  return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
            <ClipboardList className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.praxisChecklistenFürAbfälle} /></h3>
          <p className="text-sm text-slate-600 leading-relaxed font-normal"><MdText text={inhalt.texte.kompakteUndRechtlichBelastbare} /></p>
        </div>

        {/* Sub-Tabs / Reiter */}
        <ReiterLeiste label="Checklisten" className="flex flex-wrap gap-2 border-b border-home-grau/20 pb-4">
          {[
            { id: 'einstufung', label: inhalt.werte.t1Abfalleinstufung, icon: List, desc: inhalt.werte.krwgAvvGewabfv },
            { id: 'mineralik', label: inhalt.werte.t2Ersatzbaustoffe, icon: Recycle, desc: inhalt.werte.ebvEinbau },
            { id: 'rueckbau', label: inhalt.werte.t3RückbauAudit, icon: ShieldCheck, desc: inhalt.werte.vdi6202Abbruch },
            { id: 'deponie', label: inhalt.werte.t4Deponierung, icon: Database, desc: inhalt.werte.depvDkZuordnung },
            { id: 'probenahme', label: inhalt.werte.t5Probenahme, icon: Search, desc: inhalt.werte.lagaPn98Din },
            { id: 'gefahrstoffe', label: inhalt.werte.t6GefahrstoffePsa, icon: AlertTriangle, desc: inhalt.werte.trgs519521524 }
          ].map((subTab) => {
            const Icon = subTab.icon;
            const isActive = activeChecklistSubTab === subTab.id;
            return (
              <button {...alsReiter(isActive, 'abfall-checkliste', subTab.id)}
                key={subTab.id}
                onClick={() => setActiveChecklistSubTab(subTab.id as "probenahme" | "rueckbau" | "deponie" | "gefahrstoffe" | "einstufung" | "mineralik")}
                className={`flex-1 min-w-[150px] p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-shiraz/5 border-shiraz shadow-sm ring-1 ring-shiraz/35'
                          : 'bg-white border-home-grau/30 hover:bg-slate-50'
                      }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <Icon size={16} className={isActive ? 'text-shiraz' : 'text-slate-500'} />
                  <span className={`text-xs font-bold ${isActive ? 'text-shiraz' : 'text-slate-800'}`}>
                    {subTab.label}
                  </span>
                </div>
                <span className="text-xs text-slate-500 block leading-tight font-medium">
                  {subTab.desc}
                </span>
              </button>
            );
          })}
        </ReiterLeiste>

        {/* Checklist Content */}
        <div className="bg-white rounded-2xl border border-home-grau/30 p-6 space-y-6">
          {activeChecklistSubTab === 'einstufung' && (
            <div {...reiterPanel('abfall-checkliste', activeChecklistSubTab)} className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.leitfadenZurRechtlichBelastbaren} /></h4>
                <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.rechtlicheZuordnungBestimmungGefährliche} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inhalt.daten.Checklisten.map((item) => (
                  <div key={item.step} className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 hover:border-shiraz/20 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs font-mono">
                          {item.step}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs">
                          {item.title}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono font-medium text-slate-400">
                      <span><MdText text={inhalt.texte.statusBeachtungspflichtig} /></span>
                      <span className="text-shiraz">{item.ref}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChecklistSubTab === 'mineralik' && (
            <div {...reiterPanel('abfall-checkliste', activeChecklistSubTab)} className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Recycle className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.qualitätssicherungWiedereinbauMineralisc} /></h4>
                <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.voraussetzungenFürDenRechtskonformen} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inhalt.daten.Checklisten_2.map((item) => (
                  <div key={item.step} className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 hover:border-shiraz/20 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs font-mono">
                          {item.step}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs">
                          {item.title}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono font-medium text-slate-400">
                      <span><MdText text={inhalt.texte.statusBeachtungspflichtig2} /></span>
                      <span className="text-shiraz">{item.ref}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChecklistSubTab === 'rueckbau' && (
            <div {...reiterPanel('abfall-checkliste', activeChecklistSubTab)} className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.selektiverRückbauPreDemolition} /></h4>
                <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.systematischerProjektablaufFürAbbruch} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inhalt.daten.Checklisten_3.map((item) => (
                  <div key={item.step} className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 hover:border-shiraz/20 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs font-mono">
                          {item.step}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs">
                          {item.title}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono font-medium text-slate-400">
                      <span><MdText text={inhalt.texte.statusBeachtungspflichtig3} /></span>
                      <span className="text-shiraz">{item.ref}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChecklistSubTab === 'deponie' && (
            <div {...reiterPanel('abfall-checkliste', activeChecklistSubTab)} className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Database className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.deponierungsverfahrenDeklarationsgrundla} /></h4>
                <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.ablaufplanungZurRechtskonformenAnnahme} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inhalt.daten.Checklisten_4.map((item) => (
                  <div key={item.step} className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 hover:border-shiraz/20 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs font-mono">
                          {item.step}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs">
                          {item.title}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono font-medium text-slate-400">
                      <span><MdText text={inhalt.texte.statusBeachtungspflichtig4} /></span>
                      <span className="text-shiraz">{item.ref}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChecklistSubTab === 'probenahme' && (
            <div {...reiterPanel('abfall-checkliste', activeChecklistSubTab)} className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Search className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.repräsentativeProbenahmeLagaPn} /></h4>
                <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.sicherstellungDerRepräsentativitätBei} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inhalt.daten.Checklisten_5.map((item) => (
                  <div key={item.step} className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 hover:border-shiraz/20 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs font-mono">
                          {item.step}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs">
                          {item.title}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono font-medium text-slate-400">
                      <span><MdText text={inhalt.texte.statusBeachtungspflichtig5} /></span>
                      <span className="text-shiraz">{item.ref}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChecklistSubTab === 'gefahrstoffe' && (
            <div {...reiterPanel('abfall-checkliste', activeChecklistSubTab)} className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.gefahrstoffeArbeitsschutzPsaAsbest} /></h4>
                <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.sicherheitstechnischeSchutzmaßnahmenBehö} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inhalt.daten.Checklisten_6.map((item) => (
                  <div key={item.step} className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 hover:border-shiraz/20 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs font-mono">
                          {item.step}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs text-shiraz-900">
                          {item.title}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono font-medium text-slate-400">
                      <span><MdText text={inhalt.texte.statusBeachtungspflichtig6} /></span>
                      <span className="text-shiraz">{item.ref}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
}
