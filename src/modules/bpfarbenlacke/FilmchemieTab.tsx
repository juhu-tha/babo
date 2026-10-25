import type { Dispatch, SetStateAction } from 'react';
import { REACTION_MECHANISMS } from './daten';
import { AlertTriangle, Atom, Layers } from 'lucide-react';

export interface FilmchemieTabProps {
  setSelectedMech: Dispatch<SetStateAction<string>>;
  selectedMech: string;
}

export function FilmchemieTab({ setSelectedMech, selectedMech }: FilmchemieTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
        <h3 className="font-bold text-shiraz text-base mb-2">Makromolekulare Lackchemie &amp; Filmbildung</h3>
        <p className="mb-3">
          Lacke bestehen nicht nur aus farbgebenden Pigmenten; ihre tatsächliche Funktion beruht auf der Verknüpfung winziger Monomere und Oligomere zu riesigen Polymernetzwerken. Dieser Übergang vom flüssigen in den festen Zustand bestimmt die mechanischen und chemischen Resistenzen des Baustoffs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-white p-4 rounded-lg border border-home-grau/20">
          <div>
            <h5 className="font-bold text-text-main text-xs uppercase tracking-wider mb-1">Physikalische Filmbildung</h5>
            <p className="text-xs text-text-main/70">
              Reines Trocknen durch das Verdunsten flüchtiger organischer Lösemittel oder Wasser. Die Polymerketten liegen bereits voll funktional vor und "verknäueln" sich lediglich mechanisch. Reversibel löslich (z.B. Dispersionsfarben, Chlorkautschuksysteme).
            </p>
          </div>
          <div>
            <h5 className="font-bold text-shiraz text-xs uppercase tracking-wider mb-1">Chemische Filmbildung</h5>
            <p className="text-xs text-text-main/70">
              Irreversible chemische Reaktion während der Verarbeitungsphase. Durch Autoxidation, Polyaddition oder lichtinitiierte Polymerisation vernetzen sich Moleküle dreidimensional über kovalente Hauptvalenzbindungen. Nicht wieder anlösbar (z.B. Polyurethane, Epoxide, Silikate).
            </p>
          </div>
        </div>
      </div>
    
      {/* Interaktiver Selektor für Härtungsmechanismen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Linke Leiste (Navigation der Mechanismen) */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <div className="text-xs font-bold text-text-main/50 uppercase tracking-widest pl-2 mb-1">Mechanismen der Lehre (VCI)</div>
          {Object.entries(REACTION_MECHANISMS).map(([key, mech]) => (
            <button
              key={key}
              onClick={() => setSelectedMech(key)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 w-full ${
                        selectedMech === key
                          ? 'bg-shiraz/5 border-shiraz text-text-main shadow-xs'
                          : 'bg-white border-home-grau/25 text-text-main/75 hover:bg-stone-50 hover:border-home-grau/40'
                      }`}
            >
              <Atom className={`mt-0.5 flex-none ${selectedMech === key ? 'text-shiraz' : 'text-text-main/40'}`} size={18} />
              <div>
                <div className="font-bold text-sm">{mech.name}</div>
                <div className="text-xs text-text-main/50 mt-0.5">{mech.type}</div>
              </div>
            </button>
          ))}
          
          {/* Physikalische Erklärung der Lichtstreuung */}
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
            <h5 className="font-bold flex items-center gap-1.5"><Layers size={14} className="text-amber-800" /> Streukraft-Exkurs (Brechzahl)</h5>
            <p className="leading-relaxed">
              Die Deckkraft weißer Pigmente beruht auf dem Unterschied ihrer Brechzahl zum Bindemittel (<span className="font-mono">n ≈ 1,5</span>). 
              <strong>Titandioxid (Rutil)</strong> besitzt mit <span className="font-mono">n = 2,7</span> das größte Deckvermögen. 
              Füllstoffe wie <strong>Kreide</strong> (<span className="font-mono">n = 1,6</span>) erscheinen im Bindemittel fast transparent und dienen primär der Füllvolumen-Erhöhung.
            </p>
          </div>
        </div>
    
        {/* Rechte Detailanzeige */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-home-grau/30 shadow-xs p-6 space-y-6">
          {(() => {
            const mech = REACTION_MECHANISMS[selectedMech];
            return (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
                  <div>
                    <span className="text-xs font-bold text-shiraz uppercase tracking-widest bg-shiraz/10 px-2 py-0.5 rounded-sm">
                      {mech.type}
                    </span>
                    <h4 className="text-xl font-bold text-text-main mt-1.5">{mech.name}</h4>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-stone-100 text-stone-700 font-mono px-2.5 py-1 rounded">
                      VCI-Lehrfolie {selectedMech === 'oxidative' ? '03/04' : selectedMech === 'epoxy' ? '06/07' : selectedMech === 'polyurethane' ? '08' : selectedMech === 'silicate' ? '12' : '15'}
                    </span>
                  </div>
                </div>
    
                {/* Chemische Partner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                    <span className="text-[10px] font-bold text-text-main/50 uppercase block mb-1">Reaktive Edukte (Bindungspartner)</span>
                    <span className="text-xs font-medium text-text-main/90 leading-relaxed">{mech.reactants}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                    <span className="text-[10px] font-bold text-text-main/50 uppercase block mb-1">Katalysatoren / Reaktions-Initiatoren</span>
                    <span className="text-xs font-medium text-text-main/90 leading-relaxed">{mech.catalysts}</span>
                  </div>
                </div>
    
                {/* Molekülgleichung */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block">Chemische Struktur- und Vernetzungs-Gleichung</span>
                  <pre className="font-mono text-xs p-4 bg-stone-900 text-stone-200 rounded-xl overflow-x-auto whitespace-pre leading-relaxed border border-stone-850 shadow-inner">
                    {mech.molecularReaction}
                  </pre>
                </div>
    
                {/* Beschreibung */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block">Prozessbeschreibung (Mikroskopische Ebene)</span>
                  <p className="text-sm text-text-main/80 leading-relaxed bg-off-white/40 p-3 rounded-lg border border-home-grau/10">
                    {mech.description}
                  </p>
                </div>
    
                {/* Verarbeitungsvorschriften */}
                <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200/60 space-y-3">
                  <h5 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                    <AlertTriangle className="text-amber-700" size={18} />
                    Kritische Ausführungs- &amp; Verarbeitungsregeln für Bauproﬁs:
                  </h5>
                  <ul className="list-disc list-inside text-xs text-amber-900 space-y-1.5 pl-1 leading-relaxed">
                    {mech.processingRules.map((rule, idx) => (
                      <li key={idx} className="align-top">
                        <span className="font-medium">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
    
                {/* Herstellerneutrale Bausysteme */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block">Herstellerneutrale Systeme &amp; Erzeugnisse im Hoch- &amp; Tiefbau</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mech.neutralProducts.map((p, pIdx) => (
                      <div key={pIdx} className="p-4 rounded-xl border border-home-grau/20 bg-white shadow-3xs space-y-1 hover:border-shiraz/40 transition-colors">
                        <div className="font-bold text-shiraz text-xs">{p.title}</div>
                        <p className="text-xs text-text-main/70 leading-normal">{p.desc}</p>
                        <div className="text-[10px] text-text-main/40 mt-1 font-mono">{p.norms}</div>
                      </div>
                    ))}
                  </div>
                </div>
    
                {/* Interaktiver Phasen-Visualisierer */}
                <div className="border-t border-home-grau/20 pt-5">
                  <div className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block mb-3">Phasen der Trocknung und Filmbildung (Schematisch)</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-stone-50 p-3.5 rounded-lg border border-home-grau/15 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-shiraz">Phase 1: Nassauftrag</span>
                        <p className="text-[11px] text-text-main/70 mt-1 leading-normal">Bindemittel, Pigmente und Lösemittelmoleküle sind homogen verteilt und frei gleitend.</p>
                      </div>
                      <div className="h-10 bg-white rounded border border-home-grau/20 mt-3 relative overflow-hidden flex items-center justify-around px-2">
                        <div className="absolute top-0 inset-x-0 h-1 bg-sky-300 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-shiraz"></div>
                        <div className="w-2 h-2 rounded-full bg-stone-400"></div>
                        <div className="w-3 h-3 rounded-full bg-sky-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      </div>
                    </div>
    
                    <div className="bg-stone-50 p-3.5 rounded-lg border border-home-grau/15 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-shiraz">Phase 2: Verdampfung &amp; Start</span>
                        <p className="text-[11px] text-text-main/70 mt-1 leading-normal">Trägerstoff entweicht. Erste Vernetzungspunkte oder Kettenverhakungen entstehen.</p>
                      </div>
                      <div className="h-10 bg-white rounded border border-home-grau/20 mt-3 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute -top-3 text-[10px] text-sky-400 animate-bounce">↑ ↑ ↑</div>
                        <div className="flex gap-1.5 items-center">
                          <div className="w-2 h-2 rounded-full bg-shiraz animate-ping"></div>
                          <span className="text-[9px] font-mono text-stone-400">⚡</span>
                          <div className="w-2.5 h-2.5 rounded-full bg-shiraz"></div>
                        </div>
                      </div>
                    </div>
    
                    <div className="bg-stone-50 p-3.5 rounded-lg border border-home-grau/15 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-shiraz">Phase 3: Ausgehärtet</span>
                        <p className="text-[11px] text-text-main/70 mt-1 leading-normal">Ein räumlich vermaschter, unlöslicher Farbfilm haftet fest auf dem Untergrund.</p>
                      </div>
                      <div className="h-10 bg-shiraz/10 rounded border border-shiraz/30 mt-3 relative overflow-hidden flex items-center justify-center">
                        <div className="w-11/12 h-0.5 bg-shiraz absolute"></div>
                        <div className="w-11/12 h-0.5 bg-shiraz absolute rotate-12"></div>
                        <div className="w-11/12 h-0.5 bg-shiraz absolute -rotate-12"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-shiraz border border-white z-10"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-shiraz border border-white z-10 ml-6"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-shiraz border border-white z-10 mr-6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
