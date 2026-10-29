import type { Dispatch, SetStateAction } from 'react';
import { FileCode, Sliders, Code, AlertTriangle, Table, CheckSquare } from 'lucide-react';
import { formatDeZahl, formatDeWert, formatDeIntl } from '@/src/utils/numberFormat';
import inhalt from '@/content/ki/LlmPraxisTeile/MarkdownTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../../../components/ui/Auswahlgruppe';

export interface MarkdownTabProps {
  markdownView: "vergleich" | "syntax" | "rechner";
  setMarkdownView: Dispatch<SetStateAction<"vergleich" | "syntax" | "rechner">>;
  calcDocPages: number;
  setCalcDocPages: Dispatch<SetStateAction<number>>;
  calcDocType: "pdf_scan" | "pdf_text" | "word_docx" | "markdown";
  setCalcDocType: Dispatch<SetStateAction<"pdf_scan" | "pdf_text" | "word_docx" | "markdown">>;
  tokenStats: { totalTokens: number; costInputStandard: number; costCached: number; contextUsagePercent: number; };
}

export function MarkdownTab({ markdownView, setMarkdownView, calcDocPages, setCalcDocPages, calcDocType, setCalcDocType, tokenStats }: MarkdownTabProps) {
  return (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                      <FileCode size={20} className="text-shiraz" /><MdText text={inhalt.texte.markdownMdAlsNativer} /></h3>
                    <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.warumMarkdownDasMit} /></p>
                  </div>
    
                  {/* View toggle */}
                  <ReiterLeiste label="Ansicht Markdown" className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button {...alsReiter(markdownView === 'vergleich', 'markdown-ansicht', 'vergleich')}
                      onClick={() => setMarkdownView('vergleich')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${markdownView === 'vergleich' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    >
                      Warum .md?
                    </button>
                    <button {...alsReiter(markdownView === 'syntax', 'markdown-ansicht', 'syntax')}
                      onClick={() => setMarkdownView('syntax')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${markdownView === 'syntax' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    >
                      Ingenieur-Syntax
                    </button>
                    <button {...alsReiter(markdownView === 'rechner', 'markdown-ansicht', 'rechner')}
                      onClick={() => setMarkdownView('rechner')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${markdownView === 'rechner' ? 'bg-white shadow text-shiraz font-bold' : 'text-slate-600'}`}
                    ><MdText text={inhalt.texte.tokenKostenRechner} /></button>
                  </ReiterLeiste>
                </div>
    
                {/* VIEW 1: REASONS FOR MARKDOWN */}
                {markdownView === 'vergleich' && (
                  <div {...reiterPanel('markdown-ansicht', markdownView)} className="space-y-5 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-1.5">
                        <div className="text-shiraz font-black text-xl">1.</div>
                        <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.t6080Tokenersparnis} /></h4>
                        <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.keineUnsichtbarenXmlTags} /></p>
                      </div>
    
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-1.5">
                        <div className="text-shiraz font-black text-xl">2.</div>
                        <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.perfekteHierarchie} /></h4>
                        <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.überschriftenMit} /><code className="font-mono text-xs">#</code>, <code className="font-mono text-xs">##</code><MdText text={inhalt.texte.signalisierenDenAttentionHeads} /></p>
                      </div>
    
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-1.5">
                        <div className="text-shiraz font-black text-xl">3.</div>
                        <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.robusteTabellen} /></h4>
                        <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.markdownPipes} /><code className="font-mono text-xs">| A | B |</code><MdText text={inhalt.texte.werdenSpaltenUndZeilengetreu} /></p>
                      </div>
    
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-1.5">
                        <div className="text-shiraz font-black text-xl">4.</div>
                        <h4 className="font-bold text-sm text-text-main">LaTeX-Kompatibilität</h4>
                        <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.mathematischeFormelnWerdenNahtlos} /><code className="font-mono text-xs">$...$</code><MdText text={inhalt.texte.eingebettetUndFehlerfreiInterpretiert} /></p>
                      </div>
                    </div>
    
                    {/* SIDE-BY-SIDE COMPARISON: OCR VS CLEAN MARKDOWN */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600"><MdText text={inhalt.texte.liveVergleichSchlechterPdf} /></h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2 font-mono text-[11px] text-rose-900">
                          <div className="font-bold text-rose-800 flex items-center justify-between">
                            <span><MdText text={inhalt.texte.schlechterPdfTextOcr} /></span>
                            <span className="text-[10px] bg-rose-200/60 px-1.5 py-0.5 rounded"><MdText text={inhalt.texte.t1400Tokens} /></span>
                          </div>
                          <p className="leading-relaxed bg-white/80 p-2.5 rounded border border-rose-200/60"><MdText text={inhalt.texte.headerBaugrundinstitutMuster} /></p>
                          <span className="text-[10px] text-rose-700 block"><MdText text={inhalt.texte.gefahrFragmenteImTabellenumbruch} /></span>
                        </div>
    
                        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2 font-mono text-[11px] text-emerald-900">
                          <div className="font-bold text-emerald-800 flex items-center justify-between">
                            <span><MdText text={inhalt.texte.reinesMarkdownMd} /></span>
                            <span className="text-[10px] bg-emerald-200/60 px-1.5 py-0.5 rounded"><MdText text={inhalt.texte.t280Tokens80} /></span>
                          </div>
                          <p className="leading-relaxed bg-white/80 p-2.5 rounded border border-emerald-200/60"><MdText text={inhalt.texte.schicht2QuartärKies} /></p>
                          <span className="text-[10px] text-emerald-700 block"><MdText text={inhalt.texte.vorteilPerfekteMaschinelleLesbarkeit} /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
    
                {/* VIEW 2: SYNTAX-GUIDE FÜR BAUINGENIEURE */}
                {markdownView === 'syntax' && (
                  <div {...reiterPanel('markdown-ansicht', markdownView)} className="space-y-4 animate-in fade-in duration-200 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                        <span className="font-bold text-text-main flex items-center gap-1.5">
                          <Table size={14} className="text-shiraz" /><MdText text={inhalt.texte.tabellenMitAusrichtungEinheiten} /></span>
                        <pre className="p-2.5 bg-white border border-home-grau/30 text-text-main rounded font-mono text-[11px] overflow-x-auto">
    {inhalt.werte.bauteilBetonDickeCm}
                        </pre>
                      </div>
    
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                        <span className="font-bold text-text-main flex items-center gap-1.5">
                          <Code size={14} className="text-shiraz" /><MdText text={inhalt.texte.formelsatzNachEurocode} /></span>
                        <pre className="p-2.5 bg-white border border-home-grau/30 text-text-main rounded font-mono text-[11px] overflow-x-auto">
    {inhalt.werte.bemessungswertDerBetondruckfestigkeitF}
                        </pre>
                      </div>
    
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                        <span className="font-bold text-text-main flex items-center gap-1.5">
                          <AlertTriangle size={14} className="text-amber-600" /><MdText text={inhalt.texte.bedenkenGefahrenhinweise} /></span>
                        <pre className="p-2.5 bg-white border border-home-grau/30 text-text-main rounded font-mono text-[11px] overflow-x-auto">
    {inhalt.werte.vobBBedenkenhinweisGem}
                        </pre>
                      </div>
    
                      <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 space-y-2">
                        <span className="font-bold text-text-main flex items-center gap-1.5">
                          <CheckSquare size={14} className="text-emerald-600" /> Baustellen-Abnahmechecklisten
                        </span>
                        <pre className="p-2.5 bg-white border border-home-grau/30 text-text-main rounded font-mono text-[11px] overflow-x-auto">
    {inhalt.werte.xBewehrungsabnahmeAchseA}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
    
                {/* VIEW 3: TOKEN- & KOSTEN-RECHNER */}
                {markdownView === 'rechner' && (
                  <div {...reiterPanel('markdown-ansicht', markdownView)} className="p-5 bg-off-white rounded-2xl border border-home-grau/20 space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                        <Sliders size={16} className="text-shiraz" /><MdText text={inhalt.texte.interaktiverFormatTokenKostenrechner} /></h4>
                      <span className="text-xs text-text-main/60"><MdText text={inhalt.texte.vergleichDokumentgrößeVsModell} /></span>
                    </div>
    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-text-main/80 block mb-1">
                          Dokumentenumfang: <strong className="text-shiraz font-mono">{calcDocPages} Seiten</strong>
                        </label>
                        <input 
                          type="range" 
                          min={5} 
                          max={150} 
                          step={5} 
                          value={calcDocPages} 
                          onChange={(e) => setCalcDocPages(Number(e.target.value))}
                          className="w-full accent-shiraz cursor-pointer" 
                        />
                        <div className="flex justify-between text-[10px] text-text-main/50 mt-1">
                          <span><MdText text={inhalt.texte.t5SeitenKurzbericht} /></span>
                          <span>75 S.</span>
                          <span><MdText text={inhalt.texte.t150SBaugrundgutachten} /></span>
                        </div>
                      </div>
    
                      <div>
                        <label className="text-xs font-semibold text-text-main/80 block mb-1">Eingabeformat:</label>
                        <AuswahlGruppe label="Eingabeformat" className="grid grid-cols-2 gap-2">
                          <button {...alsOption(calcDocType === 'pdf_scan')}
                            onClick={() => setCalcDocType('pdf_scan')}
                            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                          calcDocType === 'pdf_scan' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30'
                        }`}
                          ><MdText text={inhalt.texte.pdfScanOcr} /></button>
                          <button {...alsOption(calcDocType === 'pdf_text')}
                            onClick={() => setCalcDocType('pdf_text')}
                            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                          calcDocType === 'pdf_text' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30'
                        }`}
                          ><MdText text={inhalt.texte.pdfDigital} /></button>
                          <button {...alsOption(calcDocType === 'word_docx')}
                            onClick={() => setCalcDocType('word_docx')}
                            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                          calcDocType === 'word_docx' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30'
                        }`}
                          ><MdText text={inhalt.texte.wordDocx} /></button>
                          <button {...alsOption(calcDocType === 'markdown')}
                            onClick={() => setCalcDocType('markdown')}
                            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                          calcDocType === 'markdown' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-text-main border-home-grau/30'
                        }`}
                          ><MdText text={inhalt.texte.markdownMd} /></button>
                        </AuswahlGruppe>
                      </div>
                    </div>
    
                    {/* STATS TILES */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3 bg-white rounded-xl border border-home-grau/20">
                        <span className="text-[10px] uppercase font-bold text-text-main/60 block"><MdText text={inhalt.texte.geschätzteToken} /></span>
                        <span className="text-lg font-black text-text-main font-mono">
                          {formatDeIntl(tokenStats.totalTokens)}
                        </span>
                      </div>
    
                      <div className="p-3 bg-white rounded-xl border border-home-grau/20">
                        <span className="text-[10px] uppercase font-bold text-text-main/60 block"><MdText text={inhalt.texte.auslastung200kKontext} /></span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${tokenStats.contextUsagePercent > 80 ? 'bg-rose-500' : tokenStats.contextUsagePercent > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${tokenStats.contextUsagePercent}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono font-bold text-text-main">{formatDeWert(tokenStats.contextUsagePercent)}%</span>
                        </div>
                      </div>
    
                      <div className="p-3 bg-white rounded-xl border border-home-grau/20">
                        <span className="text-[10px] uppercase font-bold text-text-main/60 block"><MdText text={inhalt.texte.kostenStandard} /></span>
                        <span className="text-lg font-black text-shiraz font-mono">
                          ${formatDeZahl(tokenStats.costInputStandard, 3)}
                        </span>
                      </div>
    
                      <div className="p-3 bg-white rounded-xl border border-home-grau/20">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block"><MdText text={inhalt.texte.mitPromptCaching} /></span>
                        <span className="text-lg font-black text-emerald-700 font-mono">
                          ${formatDeZahl(tokenStats.costCached, 3)} (-90%)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
  );
}
