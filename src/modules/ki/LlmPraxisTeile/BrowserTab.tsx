import type { Dispatch, SetStateAction } from 'react';
import { Terminal, Globe, CheckCircle2, Search, ShieldCheck } from 'lucide-react';

export interface BrowserTabProps {
  browserEngine: "perplexity" | "chatgpt_search" | "claude_search";
  setBrowserEngine: Dispatch<SetStateAction<"perplexity" | "chatgpt_search" | "claude_search">>;
}

export function BrowserTab({ browserEngine, setBrowserEngine }: BrowserTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <Globe size={20} className="text-shiraz" /> Browser-Nutzung &amp; Web-Grounding: Normenrecherche ohne Halluzinationen
            </h3>
            <p className="text-xs text-text-main/70">
              Wie Sie Echtzeit-Suchwerkzeuge mit gezielten Suchfiltern einsetzen, um stets den tagesaktuellen Stand der Bautechnik zu verifizieren
            </p>
          </div>
    
          {/* Browser Engine Toggle */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button aria-pressed={browserEngine === 'perplexity'}
              onClick={() => setBrowserEngine('perplexity')}
              className={`px-3 py-1.5 rounded-lg transition-all ${browserEngine === 'perplexity' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
            >
              Perplexity / Deep Research
            </button>
            <button aria-pressed={browserEngine === 'chatgpt_search'}
              onClick={() => setBrowserEngine('chatgpt_search')}
              className={`px-3 py-1.5 rounded-lg transition-all ${browserEngine === 'chatgpt_search' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
            >
              ChatGPT Search
            </button>
            <button aria-pressed={browserEngine === 'claude_search'}
              onClick={() => setBrowserEngine('claude_search')}
              className={`px-3 py-1.5 rounded-lg transition-all ${browserEngine === 'claude_search' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
            >
              Claude Web Search
            </button>
          </div>
        </div>
    
        {/* ENGINE EXPLANATION */}
        <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs">
          {browserEngine === 'perplexity' && (
            <div className="space-y-1.5">
              <span className="font-bold text-text-main flex items-center gap-1.5">
                <Search size={14} className="text-blue-600" /> Perplexity &amp; Deep Research: Synthese aus 30+ Primärquellen
              </span>
              <p className="text-text-main/70 leading-relaxed">
                Ideal für wissenschaftliche Literaturrecherchen und neue bauaufsichtliche Zulassungen. Deep Research führt mehrstufige Suchketten aus, filtert Werbetexte heraus und belegt jede Aussage mit Fußnoten und direkten DOI/URL-Nachweisen.
              </p>
            </div>
          )}
    
          {browserEngine === 'chatgpt_search' && (
            <div className="space-y-1.5">
              <span className="font-bold text-text-main flex items-center gap-1.5">
                <Globe size={14} className="text-emerald-600" /> ChatGPT Search: Interaktives Fact-Checking mit Karten &amp; News
              </span>
              <p className="text-text-main/70 leading-relaxed">
                Hervorragend zur schnellen Überprüfung von Baustoffpreisen, Hersteller-Lieferzeiten oder regionalen Verwaltungsvorschriften der Bundesländer (z. B. VV TB Bayern).
              </p>
            </div>
          )}
    
          {browserEngine === 'claude_search' && (
            <div className="space-y-1.5">
              <span className="font-bold text-text-main flex items-center gap-1.5">
                <Terminal size={14} className="text-amber-600" /> Claude Web Search: Gezielter Abruf während der Code- &amp; Dokumentenerstellung
              </span>
              <p className="text-text-main/70 leading-relaxed">
                Ruft bei unklaren Normentexten oder fehlenden API-Parametern selbstständig die Dokumentation ab und bettet die verifizierten Daten direkt in Ihre Markdown-Berichte oder Berechnungen ein.
              </p>
            </div>
          )}
        </div>
    
        {/* SEARCH OPERATORS TABLE FOR CIVIL ENGINEERING */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-text-main">
            Gezielte Such-Operatoren (Google Dorks) für Bau-Recherchen im LLM
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
              <div className="font-mono font-bold text-shiraz bg-white p-2 rounded border border-home-grau/20">
                site:dibt.de [Zulassungsnr]
              </div>
              <div className="font-bold text-text-main">DIBt-Zulassungen verifizieren</div>
              <p className="text-text-main/70 leading-relaxed">
                Sucht ausschließlich auf den Servern des Deutschen Instituts für Bautechnik nach allgemeinen bauaufsichtlichen Zulassungen (abZ) oder Bauartgenehmigungen (aBG).
              </p>
            </div>
    
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
              <div className="font-mono font-bold text-shiraz bg-white p-2 rounded border border-home-grau/20">
                site:oekobaudat.de [Baustoff]
              </div>
              <div className="font-bold text-text-main">Ökobilanzdaten (EPD) abrufen</div>
              <p className="text-text-main/70 leading-relaxed">
                Findet verifizierte EPD-Datensätze und Treibhauspotenziale (GWP A1-A3) für konkrete Baustoffe auf der Bundesplattform ÖKOBAUDAT.
              </p>
            </div>
    
            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
              <div className="font-mono font-bold text-shiraz bg-white p-2 rounded border border-home-grau/20">
                filetype:pdf "Technisches Merkblatt" [Produkt]
              </div>
              <div className="font-bold text-text-main">Herstellerdatenblätter filtern</div>
              <p className="text-text-main/70 leading-relaxed">
                Filtert Marketingtexte heraus und erzwingt das Herunterladen des reinen technischen Datenblatts (Verarbeitungstemperatur, Festigkeit, Mischungsverhältnis).
              </p>
            </div>
          </div>
        </div>
    
        {/* CHECKLIST AGAINST HALLUCINATIONS */}
        <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 space-y-3">
          <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" /> Der 4-Stufen-Sicherheitscheck gegen Halluzinationen
          </h4>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>1. Zitationszwang mit URL verlangen:</strong>
                <p className="text-text-main/70">Instruieren Sie die KI: <em>"Nenne mir zu jedem Normen-Grenzwert die exakte Normentabelle und verlinke die Primärquelle per Websuche."</em></p>
              </div>
            </div>
    
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>2. Blindtext-Verbot (Negativ-Constraint):</strong>
                <p className="text-text-main/70"><em>"Wenn du den genauen Wert nach DIN EN 1992 nicht kennst, rate nicht, sondern sage explizit: 'Wert muss im Original-Normblatt nachgeschlagen werden'."</em></p>
              </div>
            </div>
    
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>3. Rechnen immer mit Python-Tool:</strong>
                <p className="text-text-main/70">Reine Sprachmodelle rechnen per Token-Wahrscheinlichkeit. Zwingen Sie das Modell per Code-Interpreter oder Vorrechnung per Hand zur Plausibilitätsprüfung.</p>
              </div>
            </div>
    
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>4. Zwei-Modell-Validierung (Cross-Checking):</strong>
                <p className="text-text-main/70">Lassen Sie einen statischen Nachweis von Claude formulieren und übergeben Sie die Lösung an ChatGPT (Reasoning-Modus) mit dem Prompt: <em>"Finde den Rechenfehler in diesem statischen Nachweis."</em></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
