import inhalt from '@/content/nachhaltigkeit/AnhangUebungen.json';
import { MdText } from '@/src/components/inhalt/MdText';


export default function AnhangUebungen() {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 3</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1"><MdText text={inhalt.texte.klausurrelevanteÜbungsaufgabenMitMusterl} /></h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.testenSieIhrRechnerisches} /></p>

        <div className="space-y-5">
          {/* Aufgabe 1 */}
          <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
            <div className="flex gap-2.5 items-start">
              <span className="px-2 py-0.5 bg-shiraz/10 text-shiraz border border-shiraz/20 font-bold font-mono text-[10px] rounded uppercase mt-0.5">A 1</span>
              <div className="space-y-0.5">
                <strong className="text-slate-900 text-xs font-bold block"><MdText text={inhalt.texte.unterschiedDeklarierteVsFunktionelle} /></strong>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1"><MdText text={inhalt.texte.erläuternSieDenFachlichen} /></p>
              </div>
            </div>

            <details className="mt-3 ml-7 group">
              <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                <span className="group-open:hidden"><MdText text={inhalt.texte.lösungswegEinblenden} /></span>
                <span className="hidden group-open:inline"><MdText text={inhalt.texte.lösungswegAusblenden} /></span>
              </summary>
              <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-medium space-y-2">
                <div>
                  <span className="font-bold underline"><MdText text={inhalt.texte.deklarierteEinheit} /></span><MdText text={inhalt.texte.bezugsgrößeEinerEpdAuf} /></div>
                <div>
                  <span className="font-bold underline"><MdText text={inhalt.texte.funktionelleEinheit} /></span><MdText text={inhalt.texte.legtKonkreteFunktionMit} /></div>
              </div>
            </details>
          </div>

          {/* Aufgabe 2 */}
          <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
            <div className="flex gap-2.5 items-start">
              <span className="px-2 py-0.5 bg-shiraz/10 text-shiraz border border-shiraz/20 font-bold font-mono text-[10px] rounded uppercase mt-0.5">A 2</span>
              <div className="space-y-0.5">
                <strong className="text-slate-900 text-xs font-bold block"><MdText text={inhalt.texte.modulZuordnungImGebäudelebenszyklus} /></strong>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1"><MdText text={inhalt.texte.ordnenSieDieFolgenden} /></p>
              </div>
            </div>

            <details className="mt-3 ml-7 group">
              <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                <span className="group-open:hidden"><MdText text={inhalt.texte.lösungswegEinblenden2} /></span>
                <span className="hidden group-open:inline"><MdText text={inhalt.texte.lösungswegAusblenden2} /></span>
              </summary>
              <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-semibold space-y-1 font-mono">
                <div><MdText text={inhalt.texte.austauschDerHolzfensterNach} /></div>
                <div><MdText text={inhalt.texte.kraftstoffverbrauchDesBaggersIm} /></div>
                <div><MdText text={inhalt.texte.jährlicherHeizwärmebedarfDerNutzer} /></div>
                <div><MdText text={inhalt.texte.coBindungDurchCarbonatisierung} /></div>
                <div><MdText text={inhalt.texte.gutschriftFürVerwertbarenBewehrungsstahl} /></div>
              </div>
            </details>
          </div>

          {/* Aufgabe 3 */}
          <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
            <div className="flex gap-2.5 items-start">
              <span className="px-2 py-0.5 bg-shiraz/10 text-shiraz border border-shiraz/20 font-bold font-mono text-[10px] rounded uppercase mt-0.5">A 3</span>
              <div className="space-y-0.5">
                <strong className="text-slate-900 text-xs font-bold block"><MdText text={inhalt.texte.rechnerischeGwpMassenbilanzEiner} /></strong>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1"><MdText text={inhalt.texte.gegebenIstEineTragende} /></p>
              </div>
            </div>

            <details className="mt-3 ml-7 group">
              <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                <span className="group-open:hidden"><MdText text={inhalt.texte.lösungswegEinblenden3} /></span>
                <span className="hidden group-open:inline"><MdText text={inhalt.texte.lösungswegAusblenden3} /></span>
              </summary>
              <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-medium space-y-3.5">
                <div>
                  <strong className="font-bold underline block mb-1"><MdText text={inhalt.texte.detaillierteRechenschrittAkkumulation} /></strong>

                  <div className="space-y-2">
                    <div>
                      <span className="font-bold"><MdText text={inhalt.texte.t1VolumenDerDeckenplatte} /></span>
                      <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono"><MdText text={inhalt.texte.vDA0} /></div>
                    </div>

                    <div>
                      <span className="font-bold"><MdText text={inhalt.texte.t2MasseDesReinen} /></span>
                      <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono"><MdText text={inhalt.texte.masseBeton022} /></div>
                    </div>

                    <div>
                      <span className="font-bold"><MdText text={inhalt.texte.t3GwpDesBetonanteils} /></span>
                      <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono text-red-800"><MdText text={inhalt.texte.gwpBeton550Kg} /></div>
                    </div>

                    <div>
                      <span className="font-bold"><MdText text={inhalt.texte.t4MasseDesBewehrungsstahls} /></span>
                      <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono"><MdText text={inhalt.texte.masseStahl022} /></div>
                    </div>

                    <div>
                      <span className="font-bold"><MdText text={inhalt.texte.t5GwpDesStahlanteils} /></span>
                      <div className="p-2 bg-white rounded border border-stone-200 mt-1 font-mono text-red-800"><MdText text={inhalt.texte.gwpStahl22Kg} /></div>
                    </div>

                    <div>
                      <span className="font-bold"><MdText text={inhalt.texte.t6SummationZumGesamt} /></span>
                      <div className="p-2 bg-emerald-100/50 rounded border border-emerald-300 mt-1 font-mono font-bold text-emerald-950 text-xs"><MdText text={inhalt.texte.gwpGesamtGwpBeton} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Aufgabe 4 */}
          <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
            <div className="flex gap-2.5 items-start">
              <span className="px-2 py-0.5 bg-slate-900 text-white font-bold font-mono text-[10px] rounded uppercase mt-0.5" style={{ backgroundColor: '#1e293b' }}>A 4</span>
              <div className="space-y-0.5">
                <strong className="text-slate-900 text-xs font-bold block"><MdText text={inhalt.texte.lcaTransferReduzierungVon} /></strong>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1"><MdText text={inhalt.texte.derBerechneteLebenszyklusTreibhauswert} /></p>
              </div>
            </div>

            <details className="mt-3 ml-7 group">
              <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                <span className="group-open:hidden"><MdText text={inhalt.texte.lösungswegEinblenden4} /></span>
                <span className="hidden group-open:inline"><MdText text={inhalt.texte.lösungswegAusblenden4} /></span>
              </summary>
              <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-medium space-y-2.5">
                <ol className="list-decimal pl-4 space-y-2">
                  <li><MdText text={inhalt.texte.austauschDesStandardbetonsA1} /></li>
                  <li><MdText text={inhalt.texte.einplanungLanglebigerBauteilschichtenB4} /></li>
                  <li><MdText text={inhalt.texte.einbindungRegenerativerEnergiekomponente} /></li>
                </ol>
              </div>
            </details>
          </div>

          {/* Aufgabe 5 */}
          <div className="bg-slate-50/50 p-5 rounded-xl border border-stone-200/80">
            <div className="flex gap-2.5 items-start">
              <span className="px-2 py-0.5 bg-slate-900 text-white font-bold font-mono text-[10px] rounded uppercase mt-0.5" style={{ backgroundColor: '#1e293b' }}>A 5</span>
              <div className="space-y-0.5">
                <strong className="text-slate-900 text-xs font-bold block"><MdText text={inhalt.texte.kritischesDenkenBewertungVon} /></strong>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1"><MdText text={inhalt.texte.einDämmstoffherstellerBewirbtSein} /></p>
              </div>
            </div>

            <details className="mt-3 ml-7 group">
              <summary className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center gap-1.5 select-none hover:text-emerald-800">
                <span className="group-open:hidden"><MdText text={inhalt.texte.lösungswegEinblenden5} /></span>
                <span className="hidden group-open:inline"><MdText text={inhalt.texte.lösungswegAusblenden5} /></span>
              </summary>
              <div className="mt-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-150 animate-in slide-in-from-top-1 duration-150 text-[11px] text-emerald-950 leading-relaxed font-medium space-y-2.5">
                <strong className="block font-bold mb-1"><MdText text={inhalt.texte.kritischesPrüfgitterFürDie} /></strong>
                <ol className="list-decimal pl-4 space-y-1.5">
                  <li><MdText text={inhalt.texte.modulumfangBeziehtSichDer} /></li>
                  <li><MdText text={inhalt.texte.biogenerTrickWurdeHier} /></li>
                  <li><MdText text={inhalt.texte.modulDUnzulässigVerrechnet} /></li>
                  <li><MdText text={inhalt.texte.fehlendeFunktionelleGleichwertigkeitDeck} /></li>
                  <li><MdText text={inhalt.texte.versteckteTransportlastenA4C2} /></li>
                </ol>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
}
