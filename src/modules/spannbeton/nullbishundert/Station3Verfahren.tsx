import type { Dispatch, SetStateAction } from 'react';
import { ArrowRight, ArrowLeft, BookOpen, Info } from 'lucide-react';
import { InlineMath } from 'react-katex';

export interface Station3VerfahrenProps {
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function Station3Verfahren({ setActiveStep }: Station3VerfahrenProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-home-grau/20 pb-4">
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
          Lektion 3 von 6 • 40% bis 60%
        </span>
        <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
          Die 4 Vorspannverfahren nach DIN EN 1992-1-1
        </h3>
        <p className="text-sm text-text-main/80 mt-1">
          Verfahrenstechnische Differenzierung: Sofortiger Verbund, nachträglicher Verbund, ohne Verbund und externe Vorspannung.
        </p>
      </div>
    
      {/* Sachliche Einführung */}
      <div className="bg-off-white border-l-4 border-shiraz p-5 rounded-r-xl shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg text-shiraz shrink-0 mt-0.5 border border-home-grau/20">
            <BookOpen size={20} />
          </div>
          <div className="text-sm text-text-main leading-relaxed space-y-2">
            <p className="font-bold text-slate-900">
              Verfahrenstechnische Differenzierung:
            </p>
            <p>
              Die Krafteinleitung und der Verbundmechanismus zwischen Spannstahl und Betonkörper bestimmen 
              die bautechnischen Verfahren im Spannbetonbau. Je nach statischer Anforderung, 
              Bauwerksabmessung und Fertigungsort kommen vier genormte bzw. geregelte Verfahren zur Ausführung.
            </p>
          </div>
        </div>
      </div>
    
      {/* 4-Spalten-Vergleich */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Verfahren 1 */}
        <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Werksproduktion
              </span>
            </div>
            <h4 className="font-bold text-xs text-text-main">
              1. Sofortiger Verbund (Spannbett)
            </h4>
            <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
              <p>
                <strong>Fertigungsablauf:</strong> Spannstahldrähte oder -litzen werden im Fertigteilwerk 
                in langen Spannbetten gegen externe Widerlager vorgespannt. Nach Erreichen der Übertragungsfestigkeit 
                wird der Stahl entspannt und durchtrennt.
              </p>
              <p>
                <strong>Krafteinleitung:</strong> Rein über Verbundspannungen und den Hoyer-Effekt. 
                Keine Endverankerungen im Bauteil nötig; Krafteinleitung über die Übertragungslänge <InlineMath math="l_{pt}" /> (EC2 8.10.2.2).
              </p>
            </div>
          </div>
          <div className="p-2 bg-blue-50/70 rounded-lg border border-blue-200 text-[10px] text-blue-900 font-medium">
            <strong>Typische Bauteile:</strong> Hohlplattendecken, Spannbetonschwellen, TT-Dachplatten.
          </div>
        </div>
    
        {/* Verfahren 2 */}
        <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Ortbeton & Brücken
              </span>
            </div>
            <h4 className="font-bold text-xs text-text-main">
              2. Nachträglicher Verbund (Hüllrohre)
            </h4>
            <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
              <p>
                <strong>Fertigungsablauf:</strong> Wellrohre (Stahlblech oder Kunststoff) werden vor dem 
                Betonieren verlegt. Nach dem Erhärten werden Litzenbündel eingezogen, gegen den Beton gespannt und verankert.
              </p>
              <p>
                <strong>Verbund & Schutz:</strong> Die Rohre werden mit Zementmörtel (DIN EN 447) hohlraumfrei injiziert, 
                wodurch der Dehnungsverbund und der alkalische Korrosionsschutz entstehen.
              </p>
            </div>
          </div>
          <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-200 text-[10px] text-amber-900 font-medium">
            <strong>Typische Bauteile:</strong> Großbrücken (Freivorbau, Taktschiebeverfahren), weitgespannte Träger.
          </div>
        </div>
    
        {/* Verfahren 3 */}
        <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Hochbau & Flachdecken
              </span>
            </div>
            <h4 className="font-bold text-xs text-text-main">
              3. Ohne Verbund (Monolitzen mit PE)
            </h4>
            <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
              <p>
                <strong>Fertigungsablauf:</strong> Einzelne Litzen sind werkseitig mit Korrosionsschutzfett 
                und nahtlosem PE-HD-Mantel umhüllt. Sie werden wie Bewehrung verlegt und direkt einbetoniert.
              </p>
              <p>
                <strong>Mechanik:</strong> Kein lokaler Dehnungsverbund; Dehnungsänderungen verteilen sich über die 
                gesamte freie Länge. Injektionsarbeiten entfallen vollständig.
              </p>
            </div>
          </div>
          <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-200 text-[10px] text-emerald-900 font-medium">
            <strong>Typische Bauteile:</strong> Punktgestützte Flachdecken im Hochbau, Parkhausdecken, Behälter.
          </div>
        </div>
    
        {/* Verfahren 4 */}
        <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                Hohlkasten & Verstärkung
              </span>
            </div>
            <h4 className="font-bold text-xs text-text-main">
              4. Externe Vorspannung
            </h4>
            <div className="text-xs text-text-main/80 space-y-2 mt-2 leading-relaxed">
              <p>
                <strong>Fertigungsablauf:</strong> Spannglieder verlaufen außerhalb des Betonquerschnitts 
                (z. B. im Inneren von Hohlkästen oder zwischen Stegen) und sind nur an diskreten Umlenkblöcken und Endquerträgern verankert.
              </p>
              <p>
                <strong>Vorteile:</strong> Dünnere Betonstege, keine Hüllrohrschwächung, visuelle Inspektion auf voller Länge möglich, 
                einfacher Austausch oder Nachspannen im Bedarfsfall.
              </p>
            </div>
          </div>
          <div className="p-2 bg-purple-50/70 rounded-lg border border-purple-200 text-[10px] text-purple-900 font-medium">
            <strong>Typische Bauteile:</strong> Hohlkastenbrücken, Ertüchtigung & Verstärkung von Bestandsbrücken.
          </div>
        </div>
      </div>
    
      {/* Querschnitts-Phasen Info */}
      <div className="bg-off-white p-4 rounded-xl border border-home-grau/25 space-y-2">
        <h5 className="font-bold text-xs text-text-main flex items-center gap-2">
          <Info size={15} className="text-shiraz" />
          Querschnittsphasen im Zeitablauf
        </h5>
        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <span className="font-bold text-slate-900 block">1. Bruttoquerschnitt <InlineMath math="A_c" /></span>
            <span className="text-slate-600 text-[11px]">Reine Betonabmessungen vor Einlegen bzw. Aussparen von Hüllrohren.</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <span className="font-bold text-slate-900 block">2. Nettoquerschnitt <InlineMath math="A_n = A_c - A_{Kanal}" /></span>
            <span className="text-slate-600 text-[11px]">Gilt im Vorspannzustand <InlineMath math="t=0" /> bei noch unverpressten Hüllrohren.</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <span className="font-bold text-slate-900 block">3. Ideeller Querschnitt <InlineMath math="A_i" /></span>
            <span className="text-slate-600 text-[11px]">Gilt nach dem Verpressen für spätere Einwirkungen (<InlineMath math="A_i = A_c + (\alpha-1)A_p" />), bezogen auf den Bruttoquerschnitt (Hüllrohr verpresst); bei sofortigem Verbund gilt der ideelle Querschnitt bereits ab Spannkraftübertragung.</span>
          </div>
        </div>
      </div>
    
      {/* Navigation */}
      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex justify-between items-center">
        <button
          type="button"
          onClick={() => setActiveStep(1)}
          className="px-3.5 py-2 bg-white text-text-main hover:bg-slate-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-home-grau/30 cursor-pointer"
        >
          <ArrowLeft size={14} /> Zurück zu Kapitel 2
        </button>
        <button
          type="button"
          onClick={() => setActiveStep(3)}
          className="px-4 py-2 bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          Weiter zu Kapitel 4 <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
