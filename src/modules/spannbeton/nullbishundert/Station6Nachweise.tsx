import type { Dispatch, SetStateAction } from 'react';
import { ArrowRight, ArrowLeft, BookOpen, Activity, Compass, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import { InlineMath } from 'react-katex';

export interface Station6NachweiseProps {
  setQuizAnswers: Dispatch<SetStateAction<{ [key: string]: number | null; }>>;
  quizAnswers: { [key: string]: number | null; };
  onNavigateTab: ((tab: "grundprinzipien" | "kennwerte" | "rechner" | "dauerhaftigkeit") => void) | undefined;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function Station6Nachweise({ setQuizAnswers, quizAnswers, onNavigateTab, setActiveStep }: Station6NachweiseProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-home-grau/20 pb-4">
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-md">
          Lektion 6 von 6 • 95% bis 100%
        </span>
        <h3 className="text-xl md:text-2xl font-black text-text-main mt-2">
          Eurocode 2 Nachweiskonzept & Die 5 wesentlichen Bemessungsregeln
        </h3>
        <p className="text-sm text-text-main/80 mt-1">
          Überblick über Grenzzustände (GZT / GZG) und systematische Nutzung der Berechnungsreiter dieses Moduls.
        </p>
      </div>
    
      {/* Die 5 Bemessungsregeln */}
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
        <h4 className="font-bold text-sm text-shiraz flex items-center gap-2 uppercase tracking-wider">
          <Sparkles size={16} /> Die 5 wesentlichen Bemessungs- und Nachweisregeln
        </h4>
        <div className="grid sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">1</span>
              Vorzeichenkonvention nach DIN EN 1992-1-1
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Im Massivbau ist Druckspannung <strong>negativ (-)</strong> und Zugspannung <strong>positiv (+)</strong>. 
              Ein im unteren Querschnittsbereich liegendes Spannglied (<InlineMath math="e_p > 0" />) erzeugt an der Unterseite Druck: 
              <InlineMath math="\sigma = -P/A - (P \cdot e_p)/W" />.
            </p>
          </div>
    
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">2</span>
              Zeitabhängige Vorspannkraftzustände
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Es ist stets zwischen dem Zustand <InlineMath math="t=0" /> (unmittelbar nach Verankern, Reibung und Keilschlupf, <InlineMath math="P_0" />) 
              und dem Zustand <InlineMath math="t=\infty" /> (nach Abzug aller Kriech-, Schwind- und Relaxationsverluste, <InlineMath math="P_\infty \approx 0{,}80\dots 0{,}85 P_{m0}" />; zeitabhängige Verluste typisch 10–20 % von <InlineMath math="P_{m0}" />, Gesamtverluste inkl. Reibung/Schlupf 20–30 % der Pressenkraft) zu unterscheiden.
            </p>
          </div>
    
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">3</span>
              Dekompressionsnachweis (GZG)
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Zum Schutz der Spannglieder vor Korrosion verlangt EC2 je nach Expositionsklasse den Dekompressionsnachweis (Tab. 7.1N bzw. NA Tab. 7.1DE): Der Beton um das Spannglied muss unter der maßgebenden Kombination überdrückt bleiben (XC2–XC4: quasi-ständig, XD/XS: häufig). EN: Spannglied mind. <InlineMath math="25\,\text{mm}" /> innerhalb der Druckzone; NA(DE): Beton um das Spannglied im Bereich von 100 mm bzw. h/10 überdrückt (der größere Bereich ist maßgebend).
            </p>
          </div>
    
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-shiraz text-white flex items-center justify-center text-[10px] font-mono">4</span>
              Günstige Querkraftwirkung der Vorspannung
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Geneigte Spannglieder erzeugen eine vertikale Kraftkomponente <InlineMath math="V_p = P \cdot \sin \alpha" />, 
              die direkt querkraftentlastend wirkt. Zusätzlich erhöht die Längsdruckspannung <InlineMath math="\sigma_{cp}" /> die Betonschubtragfähigkeit <InlineMath math="V_{Rd,c}" />.
            </p>
          </div>
    
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1 sm:col-span-2">
            <div className="font-bold text-amber-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[10px] font-mono">5</span>
              Berücksichtigung der elastischen und kriechenden Überhöhung (Camber)
            </div>
            <p className="text-amber-900 text-[11px] leading-relaxed">
              Unter alleinigem Eigengewicht wölben sich stark vorgespannte Bauteile nach oben auf. 
              Diese Überhöhung vergrößert sich zeitabhängig durch Beton-Kriechen und ist bei Anschlüssen 
              nichttragender Trennwände und Fußbodenaufbauten planerisch zu berücksichtigen.
            </p>
          </div>
        </div>
      </div>
    
      {/* Interaktiver Wissens-Check */}
      <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
          <span className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
            <HelpCircle size={15} className="text-shiraz" /> Wissensprüfung: Grundkonzepte des Spannbetonbaus
          </span>
          <span className="text-[10px] font-mono font-bold text-text-main/70 bg-white px-2 py-0.5 rounded border border-home-grau/20">
            8 Fachfragen (EC2)
          </span>
        </div>
    
        {/* Frage 1 */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-text-main">
            Frage 1: Warum kann normaler Betonstahl B500 nicht als Vorspannbewehrung eingesetzt werden?
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q1: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q1 === 1
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              A) Er besitzt keinen ausreichenden alkalischen Korrosionsschutz im Beton.
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q1: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q1 === 2
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              B) Die elastische Dehngrenze ist so niedrig, dass Kriechen und Schwinden fast die gesamte Spannkraft aufbrauchen.
            </button>
          </div>
          {quizAnswers.q1 === 2 && (
            <p className="text-[11px] text-emerald-700 font-medium">
              ✓ Richtig: Die zeitabhängige Betonstauchung von typisch 1,0–1,5 ‰ baut rund 200–300 N/mm² des B500 ab – das sind etwa 46–70 % der elastischen Dehnung bei f_yd = 435 N/mm² (2,175 ‰).
            </p>
          )}
          {quizAnswers.q1 === 1 && (
            <p className="text-[11px] text-red-600 font-medium">
              ✗ Nicht zutreffend: Der Passivierungsschutz ist identisch; die Ursache ist rein dehnungsmechanischer Natur.
            </p>
          )}
        </div>
    
        {/* Frage 2 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main">
            Frage 2: Welcher Zustand wird durch die Load-Balancing-Methode nach T. Y. Lin erreicht?
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q2: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q2 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              A) Die vertikale Umlenkkraft kompensiert das Eigengewicht, sodass der Träger unter ständiger Last nur zentrischen Druck erfährt.
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q2: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q2 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              B) Die Querkräfte an den Auflagern werden auf null reduziert.
            </button>
          </div>
          {quizAnswers.q2 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium">
              ✓ Richtig: Bei vollständigem Lastausgleich (<InlineMath math="u = g" />) heben sich Durchbiegung und Biegespannungen unter Eigengewicht auf.
            </p>
          )}
          {quizAnswers.q2 === 2 && (
            <p className="text-[11px] text-red-600 font-medium">
              ✗ Falsch: Die Umlenkkraft entlastet zwar das Feld, die Vertikallasten müssen aber weiterhin über die Auflager abgetragen werden.
            </p>
          )}
        </div>
    
        {/* Frage 3 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main">
            Frage 3: Welche Größe steht in Gl. (5.46) des Eurocode 2 im Kriechterm?
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q3: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q3 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              A) <InlineMath math="\sigma_{c,QP}" /> in Spanngliedhöhe (unter quasi-ständiger Einwirkung)
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q3: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q3 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              B) <InlineMath math="\sigma_{c,p0}" /> am äußersten Querschnittsrand
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q3: 3 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q3 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              C) <InlineMath math="f_{ctm}" /> (mittlere Betonzugfestigkeit)
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q3: 4 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q3 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              D) <InlineMath math="\sigma_{pm0}" /> (zulässige Vorspannung zum Spannzeitpunkt)
            </button>
          </div>
          {quizAnswers.q3 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium">
              ✓ Richtig: In Gl. (5.46) geht exakt die Betondruckspannung <InlineMath math="\sigma_{c,QP}" /> in Höhe des Spanngliedschwerpunkts unter der quasi-ständigen Einwirkungskombination ein.
            </p>
          )}
          {quizAnswers.q3 && quizAnswers.q3 !== 1 && (
            <p className="text-[11px] text-red-600 font-medium">
              ✗ Falsch: Für das Kriechen des Verbundbetons ist allein die Betonspannung in Spanngliedachse unter quasi-ständiger Last maßgebend.
            </p>
          )}
        </div>
    
        {/* Frage 4 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main">
            Frage 4: Warum ist der Nenner von Gl. (5.46) im EC2 größer als 1?
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q4: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q4 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              A) Rückkopplungseffekt: Durch den Spannkraftverlust sinkt die Betondruckspannung, wodurch das weitere Kriechen gebremst wird.
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q4: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q4 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              B) Als pauschaler Teilsicherheitsbeiwert gegen Spanndrahtbruch.
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q4: 3 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q4 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              C) Berücksichtigung der Querdehnungszahl des Stahls.
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q4: 4 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q4 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              D) Erhöhung des Verlusts infolge dynamischer Ermüdungslasten.
            </button>
          </div>
          {quizAnswers.q4 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium">
              ✓ Richtig: Der Nenner <InlineMath math="1 + \frac{E_p}{E_{cm}}\frac{A_p}{A_c}(1 + \frac{A_c}{I_c}z_{cp}^2)[1 + 0{,}8\varphi]" /> bildet die elastisch-viskose Rückkopplung zwischen Stahl und Beton exakt ab.
            </p>
          )}
          {quizAnswers.q4 && quizAnswers.q4 !== 1 && (
            <p className="text-[11px] text-red-600 font-medium">
              ✗ Falsch: Der Nenner ist ein rein elastomechanischer Verbundterm, der die dämpfende Rückkopplung abbildet.
            </p>
          )}
        </div>
    
        {/* Frage 5 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main">
            Frage 5: Ab welcher Betondruckspannung ist nach DIN EN 1992-1-1 nichtlineares Kriechen anzusetzen?
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q5: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q5 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              A) <InlineMath math="|\sigma_c| > 0{,}45 \cdot f_{ck}(t_0)" />
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q5: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q5 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              B) <InlineMath math="|\sigma_c| > 0{,}60 \cdot f_{ck}" />
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q5: 3 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q5 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              C) <InlineMath math="|\sigma_c| > 0{,}85 \cdot f_{cd}" />
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q5: 4 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q5 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              D) <InlineMath math="|\sigma_c| > 1{,}00 \cdot f_{ctm}" />
            </button>
          </div>
          {quizAnswers.q5 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium">
              ✓ Richtig: Nach EC2 3.1.4(4) muss bei Druckspannungen über <InlineMath math="0{,}45 f_{ck}(t_0)" /> das nichtlineare Kriechen mit dem Vergrößerungsbeiwert <InlineMath math="\exp(1{,}5(k_\sigma - 0{,}45))" /> berücksichtigt werden.
            </p>
          )}
          {quizAnswers.q5 && quizAnswers.q5 !== 1 && (
            <p className="text-[11px] text-red-600 font-medium">
              ✗ Falsch: <InlineMath math="0{,}60 f_{ck}" /> ist die Grenze zur Vermeidung von Längsrissen unter charakteristischer Last; für lineares Kriechen gilt strikt <InlineMath math="0{,}45 f_{ck}(t_0)" />.
            </p>
          )}
        </div>
    
        {/* Frage 6 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main">
            Frage 6: Was versteht man unter einer „konkordanten“ Spanngliedführung?
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q6: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q6 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              A) Spanngliedführung bei statisch unbestimmten Systemen, die keine Zwangsschnittgrößen (<InlineMath math="M_{P,2} = 0" />) und Auflagerreaktionen hervorruft.
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q6: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q6 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              B) Eine rein zentrische Spanngliedführung in der Schwerachse des Trägers.
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q6: 3 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q6 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              C) Eine Spanngliedführung mit über alle Felder konstantem Krümmungsradius.
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q6: 4 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q6 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              D) Parallele Führung von schlaffer Bewehrung und Spanngliedern.
            </button>
          </div>
          {quizAnswers.q6 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium">
              ✓ Richtig: Bei konkordanten Spanngliedern entspricht die Verkrümmungslinie einer Biegelinie infolge eines zulässigen Lastfalls; sekundäre Zwangsmomente <InlineMath math="M_{P,2}" /> treten nicht auf.
            </p>
          )}
          {quizAnswers.q6 && quizAnswers.q6 !== 1 && (
            <p className="text-[11px] text-red-600 font-medium">
              ✗ Falsch: Konkordanz bezieht sich spezifisch auf das Verschwinden von statisch unbestimmten Zwangsschnittgrößen (<InlineMath math="M_{P,2} = 0" />).
            </p>
          )}
        </div>
    
        {/* Frage 7 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main">
            Frage 7: Welcher physikalische Effekt bestimmt maßgeblich die Einflusslänge des Keilschlupfs <InlineMath math="l_{set}" />?
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q7: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q7 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              A) Die Reibung zwischen Spannglied und Hüllrohr (<InlineMath math="l_{set} = \sqrt{w \cdot E_p \cdot A_p / p}" />)
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q7: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q7 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              B) Die Druckfestigkeit des Betons unter der Ankerplatte
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q7: 3 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q7 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              C) Der thermische Ausdehnungskoeffizient des Keilstahls
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q7: 4 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q7 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              D) Die Hydratationswärme des Einpressmörtels
            </button>
          </div>
          {quizAnswers.q7 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium">
              ✓ Richtig: Die Umkehr der Reibungskraft beim Einziehen der Keile baut den Schlupfverlust über die Schlupflänge <InlineMath math="l_{set}" /> kontinuierlich ab.
            </p>
          )}
          {quizAnswers.q7 && quizAnswers.q7 !== 1 && (
            <p className="text-[11px] text-red-600 font-medium">
              ✗ Falsch: Die Schlupfeinflusslänge wird primär durch den Reibungsverlustgradienten <InlineMath math="p" /> entlang des Hüllrohrs begrenzt.
            </p>
          )}
        </div>
    
        {/* Frage 8 */}
        <div className="space-y-2 pt-2 border-t border-home-grau/15">
          <p className="text-xs font-bold text-text-main">
            Frage 8: Warum ist vergüteter Spannstahl in älteren Bestandsbrücken besonders kritisch?
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q8: 1 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q8 === 1
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              A) Hohe Anfälligkeit für wasserstoffinduzierte Spannungsrisskorrosion (SpRK) mit plötzlichem Sprödbruch ohne Vorankündigung.
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q8: 2 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q8 === 2
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              B) Er neigt bei Frost zu starkem thermischen Schrumpfen.
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q8: 3 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q8 === 3
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              C) Fehlende Zinkbeschichtung führt zu sofortiger Flächenkorrosion.
            </button>
            <button
              type="button"
              onClick={() => setQuizAnswers(prev => ({ ...prev, q8: 4 }))}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      quizAnswers.q8 === 4
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-800'
                    }`}
            >
              D) Er besitzt eine unzureichende Ermüdungsfestigkeit bei Windschwingungen.
            </button>
          </div>
          {quizAnswers.q8 === 1 && (
            <p className="text-[11px] text-emerald-700 font-medium">
              ✓ Richtig: Vergütete Stähle (z. B. Neptun, Hennigsdorfer) versagen unter korrosiver Feuchte oft schlagartig ohne sichtbare Rissbildung; dafür existiert die BMVI-Handlungsanweisung.
            </p>
          )}
          {quizAnswers.q8 && quizAnswers.q8 !== 1 && (
            <p className="text-[11px] text-red-600 font-medium">
              ✗ Falsch: Die Gefahr liegt in der gefürchteten wasserstoffinduzierten Spannungsrisskorrosion (SpRK) mit schlagartigem Sprödbruch.
            </p>
          )}
        </div>
      </div>
    
      {/* Übersicht und Weiterleitung in die Fachreiter (Helle Ausführung gemäß GEMINI.md) */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-shiraz uppercase tracking-wider font-mono">
            Leitfaden abgeschlossen • 100 % Wissensstand
          </span>
          <h4 className="text-lg md:text-xl font-bold text-text-main mt-1">
            Werkzeugübersicht: Die Berechnungsreiter des Moduls
          </h4>
          <p className="text-xs md:text-sm text-text-main/80 mt-1 max-w-2xl leading-relaxed">
            Nutzen Sie die spezialisierten Reiter dieses Moduls zur vertiefenden Untersuchung 
            und quantitativen Bemessung:
          </p>
        </div>
    
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {onNavigateTab && (
            <>
              <button
                type="button"
                onClick={() => onNavigateTab('grundprinzipien')}
                className="p-4 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <Compass className="text-shiraz mb-2" size={20} />
                  <span className="font-bold text-xs block text-text-main">1. Grundprinzipien</span>
                  <span className="text-[11px] text-text-main/70 mt-1 block">
                    Dehnungssimulator, Einfeldträger-Vergleich & Tragwerkstheorie.
                  </span>
                </div>
                <span className="text-[10px] text-shiraz font-bold mt-3 flex items-center gap-1">
                  Öffnen <ArrowRight size={10} />
                </span>
              </button>
    
              <button
                type="button"
                onClick={() => onNavigateTab('kennwerte')}
                className="p-4 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <BookOpen className="text-shiraz mb-2" size={20} />
                  <span className="font-bold text-xs block text-text-main">2. Baustoffkennwerte</span>
                  <span className="text-[11px] text-text-main/70 mt-1 block">
                    Kriechen, Schwinden & Stahlrelaxation nach EC2.
                  </span>
                </div>
                <span className="text-[10px] text-shiraz font-bold mt-3 flex items-center gap-1">
                  Öffnen <ArrowRight size={10} />
                </span>
              </button>
    
              <button
                type="button"
                onClick={() => onNavigateTab('rechner')}
                className="p-4 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <Activity className="text-shiraz mb-2" size={20} />
                  <span className="font-bold text-xs block text-text-main">3. Querschnitts-Rechner</span>
                  <span className="text-[11px] text-text-main/70 mt-1 block">
                    Spannungsdreiecke, Bewehrungsgrad & Rissmomente.
                  </span>
                </div>
                <span className="text-[10px] text-shiraz font-bold mt-3 flex items-center gap-1">
                  Öffnen <ArrowRight size={10} />
                </span>
              </button>
    
              <button
                type="button"
                onClick={() => onNavigateTab('dauerhaftigkeit')}
                className="p-4 bg-off-white hover:bg-slate-100 rounded-xl border border-home-grau/30 text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <ShieldCheck className="text-shiraz mb-2" size={20} />
                  <span className="font-bold text-xs block text-text-main">4. Dauerhaftigkeit</span>
                  <span className="text-[11px] text-text-main/70 mt-1 block">
                    Expositionsklassen, Betondeckung & Korrosionsschutz.
                  </span>
                </div>
                <span className="text-[10px] text-shiraz font-bold mt-3 flex items-center gap-1">
                  Öffnen <ArrowRight size={10} />
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    
      {/* Navigation */}
      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 flex justify-start items-center">
        <button
          type="button"
          onClick={() => setActiveStep(4)}
          className="px-3.5 py-2 bg-white text-text-main hover:bg-slate-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-home-grau/30 cursor-pointer"
        >
          <ArrowLeft size={14} /> Zurück zu Kapitel 5
        </button>
      </div>
    </div>
  );
}
