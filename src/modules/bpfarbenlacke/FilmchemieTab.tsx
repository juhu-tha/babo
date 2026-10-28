import type { Dispatch, SetStateAction } from 'react';
import { REACTION_MECHANISMS } from './daten';
import { AlertTriangle, Atom, Layers } from 'lucide-react';
import inhalt from '@/content/bpfarbenlacke/FilmchemieTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface FilmchemieTabProps {
  setSelectedMech: Dispatch<SetStateAction<string>>;
  selectedMech: string;
}

export function FilmchemieTab({ setSelectedMech, selectedMech }: FilmchemieTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
        <h3 className="font-bold text-shiraz text-base mb-2"><MdText text={inhalt.texte.makromolekulareLackchemieFilmbildung} /></h3>
        <p className="mb-3"><MdText text={inhalt.texte.lackeBestehenNichtNur} /></p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-white p-4 rounded-lg border border-home-grau/20">
          <div>
            <h5 className="font-bold text-text-main text-xs uppercase tracking-wider mb-1"><MdText text={inhalt.texte.physikalischeFilmbildung} /></h5>
            <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.reinesTrocknenDurchDas} /></p>
          </div>
          <div>
            <h5 className="font-bold text-shiraz text-xs uppercase tracking-wider mb-1"><MdText text={inhalt.texte.chemischeFilmbildung} /></h5>
            <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.irreversibleChemischeReaktionWährend} /></p>
          </div>
        </div>
      </div>
    
      {/* Interaktiver Selektor für Härtungsmechanismen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Linke Leiste (Navigation der Mechanismen) */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <div className="text-xs font-bold text-text-main/50 uppercase tracking-widest pl-2 mb-1"><MdText text={inhalt.texte.mechanismenDerLehreVci} /></div>
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
            <h5 className="font-bold flex items-center gap-1.5"><Layers size={14} className="text-amber-800" /><MdText text={inhalt.texte.streukraftExkursBrechzahl} /></h5>
            <p className="leading-relaxed"><MdText text={inhalt.texte.dieDeckkraftWeißerPigmente} /><span className="font-mono">n ≈ 1,5</span><MdText text={inhalt.texte.titandioxidRutilBesitztMit} /><span className="font-mono">n = 2,7</span><MdText text={inhalt.texte.dasGrößteDeckvermögenFüllstoffe} /><span className="font-mono">n = 1,6</span><MdText text={inhalt.texte.erscheinenImBindemittelFast} /></p>
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
                    <span className="text-[10px] font-bold text-text-main/50 uppercase block mb-1"><MdText text={inhalt.texte.reaktiveEdukteBindungspartner} /></span>
                    <span className="text-xs font-medium text-text-main/90 leading-relaxed">{mech.reactants}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                    <span className="text-[10px] font-bold text-text-main/50 uppercase block mb-1"><MdText text={inhalt.texte.katalysatorenReaktionsInitiatoren} /></span>
                    <span className="text-xs font-medium text-text-main/90 leading-relaxed">{mech.catalysts}</span>
                  </div>
                </div>
    
                {/* Molekülgleichung */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block"><MdText text={inhalt.texte.chemischeStrukturUndVernetzungs} /></span>
                  <pre className="font-mono text-xs p-4 bg-off-white text-text-main rounded-xl overflow-x-auto whitespace-pre leading-relaxed border border-home-grau/30 shadow-inner">
                    {mech.molecularReaction}
                  </pre>
                </div>
    
                {/* Beschreibung */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block"><MdText text={inhalt.texte.prozessbeschreibungMikroskopischeEbene} /></span>
                  <p className="text-sm text-text-main/80 leading-relaxed bg-off-white/40 p-3 rounded-lg border border-home-grau/10">
                    {mech.description}
                  </p>
                </div>
    
                {/* Verarbeitungsvorschriften */}
                <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200/60 space-y-3">
                  <h5 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                    <AlertTriangle className="text-amber-700" size={18} /><MdText text={inhalt.texte.kritischeAusführungsVerarbeitungsregelnF} /></h5>
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
                  <span className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block"><MdText text={inhalt.texte.herstellerneutraleSystemeErzeugnisseIm} /></span>
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
                  <div className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block mb-3"><MdText text={inhalt.texte.phasenDerTrocknungUnd} /></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-stone-50 p-3.5 rounded-lg border border-home-grau/15 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-shiraz"><MdText text={inhalt.texte.phase1Nassauftrag} /></span>
                        <p className="text-[11px] text-text-main/70 mt-1 leading-normal"><MdText text={inhalt.texte.bindemittelPigmenteUndLösemittelmoleküle} /></p>
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
                        <span className="text-xs font-bold text-shiraz"><MdText text={inhalt.texte.phase2VerdampfungStart} /></span>
                        <p className="text-[11px] text-text-main/70 mt-1 leading-normal"><MdText text={inhalt.texte.trägerstoffEntweichtErsteVernetzungspunk} /></p>
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
                        <span className="text-xs font-bold text-shiraz"><MdText text={inhalt.texte.phase3Ausgehärtet} /></span>
                        <p className="text-[11px] text-text-main/70 mt-1 leading-normal"><MdText text={inhalt.texte.einRäumlichVermaschterUnlöslicher} /></p>
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
