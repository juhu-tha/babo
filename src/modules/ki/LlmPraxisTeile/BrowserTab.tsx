import type { Dispatch, SetStateAction } from 'react';
import { Terminal, Globe, CheckCircle2, Search, ShieldCheck } from 'lucide-react';
import inhalt from '@/content/ki/LlmPraxisTeile/BrowserTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface BrowserTabProps {
  browserEngine: "deep_research" | "chat_suche" | "agent_suche";
  setBrowserEngine: Dispatch<SetStateAction<"deep_research" | "chat_suche" | "agent_suche">>;
}

export function BrowserTab({ browserEngine, setBrowserEngine }: BrowserTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <Globe size={20} className="text-shiraz" /><MdText text={inhalt.texte.browserNutzungWebGrounding} /></h3>
            <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.wieSieEchtzeitSuchwerkzeuge} /></p>
          </div>
    
          {/* Browser Engine Toggle */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button aria-pressed={browserEngine === 'deep_research'}
              onClick={() => setBrowserEngine('deep_research')}
              className={`px-3 py-1.5 rounded-lg transition-all ${browserEngine === 'deep_research' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
            ><MdText text={inhalt.texte.suchassistentDeepResearch} /></button>
            <button aria-pressed={browserEngine === 'chat_suche'}
              onClick={() => setBrowserEngine('chat_suche')}
              className={`px-3 py-1.5 rounded-lg transition-all ${browserEngine === 'chat_suche' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
            ><MdText text={inhalt.texte.websucheImChat} /></button>
            <button aria-pressed={browserEngine === 'agent_suche'}
              onClick={() => setBrowserEngine('agent_suche')}
              className={`px-3 py-1.5 rounded-lg transition-all ${browserEngine === 'agent_suche' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
            ><MdText text={inhalt.texte.websucheImAgenten} /></button>
          </div>
        </div>
    
        {/* ENGINE EXPLANATION */}
        <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs">
          {browserEngine === 'deep_research' && (
            <div className="space-y-1.5">
              <span className="font-bold text-text-main flex items-center gap-1.5">
                <Search size={14} className="text-blue-600" /><MdText text={inhalt.texte.suchassistentDeepResearchSynthese} /></span>
              <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.idealFürWissenschaftlicheLiteraturrecher} /></p>
            </div>
          )}
    
          {browserEngine === 'chat_suche' && (
            <div className="space-y-1.5">
              <span className="font-bold text-text-main flex items-center gap-1.5">
                <Globe size={14} className="text-emerald-600" /><MdText text={inhalt.texte.websucheImChatFactChecking} /></span>
              <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.hervorragendZurSchnellenÜberprüfung} /></p>
            </div>
          )}
    
          {browserEngine === 'agent_suche' && (
            <div className="space-y-1.5">
              <span className="font-bold text-text-main flex items-center gap-1.5">
                <Terminal size={14} className="text-amber-600" /><MdText text={inhalt.texte.websucheImAgentenGezielter} /></span>
              <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.ruftBeiUnklarenNormentexten} /></p>
            </div>
          )}
        </div>
    
        {/* SEARCH OPERATORS TABLE FOR CIVIL ENGINEERING */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.gezielteSuchOperatorenGoogle} /></h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
              <div className="font-mono font-bold text-shiraz bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.siteDibtDeZulassungsnr} /></div>
              <div className="font-bold text-text-main"><MdText text={inhalt.texte.dibtZulassungenVerifizieren} /></div>
              <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.suchtAusschließlichAufDen} /></p>
            </div>
    
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
              <div className="font-mono font-bold text-shiraz bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.siteOekobaudatDeBaustoff} /></div>
              <div className="font-bold text-text-main"><MdText text={inhalt.texte.ökobilanzdatenEpdAbrufen} /></div>
              <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.findetVerifizierteEpdDatensätze} /></p>
            </div>
    
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
              <div className="font-mono font-bold text-shiraz bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.filetypePdfTechnischesMerkblatt} /></div>
              <div className="font-bold text-text-main"><MdText text={inhalt.texte.herstellerdatenblätterFiltern} /></div>
              <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.filtertMarketingtexteHerausUnd} /></p>
            </div>
          </div>
        </div>
    
        {/* CHECKLIST AGAINST HALLUCINATIONS */}
        <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 space-y-3">
          <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" /><MdText text={inhalt.texte.der4StufenSicherheitscheck} /></h4>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div><MdText text={inhalt.texte.t1ZitationszwangMitUrl} /><p className="text-text-main/70"><MdText text={inhalt.texte.instruierenSieDieKi} /></p>
              </div>
            </div>
    
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div><MdText text={inhalt.texte.t2BlindtextVerbotNegativ} /><p className="text-text-main/70"><MdText text={inhalt.texte.wennDuDenGenauen} /></p>
              </div>
            </div>
    
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div><MdText text={inhalt.texte.t3RechnenImmerMit} /><p className="text-text-main/70"><MdText text={inhalt.texte.reineSprachmodelleRechnenPer} /></p>
              </div>
            </div>
    
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div><MdText text={inhalt.texte.t4ZweiModellValidierung} /><p className="text-text-main/70"><MdText text={inhalt.texte.lassenSieEinenStatischen} /></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
