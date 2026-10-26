// Ausgelagert aus src/modules/ki/KiUeberblick.tsx (AP 5.2)
import React from 'react';
import {
  Cpu,
  Layers,
  Database,
  Search,
  CheckCircle2,
  Bot,
  FileText,
  Zap,
  Info
} from 'lucide-react';
import inhalt from '@/content/ki/ueberblick/PipelineTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface PipelineTabProps {
  pipelineStep: number;
  setPipelineStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function PipelineTab({ pipelineStep, setPipelineStep }: PipelineTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header der Pipeline */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2">
            <Database className="text-shiraz" size={20} /><MdText text={inhalt.texte.enterpriseRagDer6} /></h3>
          <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold"><MdText text={inhalt.texte.datenschutzIpSchutzBy} /></span>
        </div>
        <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.inEinemIngenieurOder} /></p>

        {/* Klickbare Prozesskette (Schritte 1 bis 6) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3">
          {[
            { step: 1, label: inhalt.werte.t1DatenParsing, icon: FileText, sub: inhalt.werte.pdfWordExcelGaeb },
            { step: 2, label: '2. Chunking', icon: Layers, sub: inhalt.werte.abschnitteMetadaten },
            { step: 3, label: inhalt.werte.t3Embeddings, icon: Cpu, sub: inhalt.werte.textInVektoren },
            { step: 4, label: inhalt.werte.t4VectorDb, icon: Database, sub: inhalt.werte.qdrantPgvector },
            { step: 5, label: inhalt.werte.t5RetrievalRerank, icon: Search, sub: inhalt.werte.semantischeSuche },
            { step: 6, label: inhalt.werte.t6FirmenTool, icon: Bot, sub: inhalt.werte.chatUiRechte }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setPipelineStep(item.step)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                pipelineStep === item.step
                  ? 'bg-shiraz text-white border-shiraz shadow-md ring-2 ring-shiraz/20'
                  : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-mono font-bold opacity-80">Stufe {item.step}</span>
                <item.icon size={15} />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight">{item.label}</div>
                <div className={`text-[10px] mt-0.5 truncate ${pipelineStep === item.step ? 'text-white/80' : 'text-text-main/60'}`}>
                  {item.sub}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detaillierte Darstellung des ausgewählten Schritts */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
        {pipelineStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                01
              </span>
              <div>
                <h4 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.schritt1DatenerfassungBereinigung} /></h4>
                <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.vomChaotischenNetzlaufwerkZu} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main flex items-center gap-1.5">
                  <FileText size={15} className="text-shiraz" /><MdText text={inhalt.texte.dieBautechnischeRealität} /></h5>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dateienImBauwesenSind} /></p>
                <ul className="space-y-1 list-disc list-inside text-text-main/70">
                  <li><MdText text={inhalt.texte.pdfsBaugrundgutachtenMitSchichtenverzeic} /></li>
                  <li><MdText text={inhalt.texte.excelXlsxStoffraumrechnungenBetonprüfzeu} /></li>
                  <li><MdText text={inhalt.texte.wordDocxBaustellenberichteBautagebücher} /></li>
                  <li><MdText text={inhalt.texte.spezialformateGaebX83D83} /></li>
                </ul>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main flex items-center gap-1.5">
                  <Zap size={15} className="text-amber-600" /><MdText text={inhalt.texte.dieParsingHerausforderungLösung} /></h5>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.standardTextExtraktorenVersagen} /></p>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-slate-700 leading-normal"><MdText text={inhalt.texte.werkzeugeLlamaparseUnstructuredIo} /><pre className="text-[10px] font-mono bg-slate-50 p-2 mt-1 rounded border border-slate-200">
| Schicht | Bodenart | Reibungswinkel φ | Kohäsion c |
| 1       | Auffüllung | 27.5°           | 0 kN/m²   |
| 2       | Geschiebemergel | 32.5°      | 15 kN/m²  |
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {pipelineStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                02
              </span>
              <div>
                <h4 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.schritt2IntelligentesChunking} /></h4>
                <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.zerschneidenInVerdaulicheSinneinheiten} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main flex items-center gap-1.5">
                  <Layers size={15} className="text-shiraz" /><MdText text={inhalt.texte.warumChunkingUnverzichtbarIst} /></h5>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.ein80SeitigesGutachten} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main flex items-center gap-1.5">
                  <Info size={15} className="text-blue-600" /><MdText text={inhalt.texte.derSchlüsselMetadatenAnhängen} /></h5>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.jederChunkErhältUnsichtbare} /></p>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 font-mono text-[10px] text-slate-800">
                  <code><MdText text={inhalt.texte.brProjektIdBv} /></code>
                </div>
              </div>
            </div>
          </div>
        )}

        {pipelineStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                03
              </span>
              <div>
                <h4 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.schritt3VektorisierungDurch} /></h4>
                <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.übersetzungMenschlicherBaubegriffeIn} /></p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-text-main/80">
              <p><MdText text={inhalt.texte.einComputerKannTexte} /></p>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-1">
                <div className="text-slate-400"><MdText text={inhalt.texte.textFrostTausalzAngriff} /></div>
                <div className="text-emerald-400"><MdText text={inhalt.texte.embedding004210} /></div>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 text-blue-950"><MdText text={inhalt.texte.derClouDerSemantik} /></div>
            </div>
          </div>
        )}

        {pipelineStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                04
              </span>
              <div>
                <h4 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.schritt4SpeicherungIndexierung} /></h4>
                <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.dasSpezialArchivFür} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main"><MdText text={inhalt.texte.qdrantMilvus} /></h5>
                <p className="text-text-main/70"><MdText text={inhalt.texte.hochperformanteQuelloffeneVektordatenban} /></p>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded"><MdText text={inhalt.texte.besteWahlFürOn} /></span>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main"><MdText text={inhalt.texte.postgresqlMitPgvector} /></h5>
                <p className="text-text-main/70"><MdText text={inhalt.texte.fallsDasBüroBereits} /></p>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded"><MdText text={inhalt.texte.standardFürItAbteilungen} /></span>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main"><MdText text={inhalt.texte.hybridSearchHnswBm25} /></h5>
                <p className="text-text-main/70"><MdText text={inhalt.texte.imBauwesenUnverzichtbarVektorsuche} /></p>
                <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">Ingenieur-Empfehlung</span>
              </div>
            </div>
          </div>
        )}

        {pipelineStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                05
              </span>
              <div>
                <h4 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.schritt5FragestellungVektorsuche} /></h4>
                <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.wieDieTreffendsten3} /></p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-text-main/80">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-home-grau/30 space-y-1">
                  <span className="font-bold text-slate-800"><MdText text={inhalt.texte.t1NutzerStelltFrage} /></span>
                  <p className="text-text-main/70"><MdText text={inhalt.texte.welcheGründungsempfehlungGabDer} /></p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-home-grau/30 space-y-1">
                  <span className="font-bold text-slate-800"><MdText text={inhalt.texte.t2SchnelleVektorsuche} /></span>
                  <p className="text-text-main/70"><MdText text={inhalt.texte.dieVectorDbSucht} /></p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-home-grau/30 space-y-1">
                  <span className="font-bold text-slate-800"><MdText text={inhalt.texte.t3ReRankingPräzisionsfilter} /></span>
                  <p className="text-text-main/70"><MdText text={inhalt.texte.einCrossEncoderModell} /></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {pipelineStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                06
              </span>
              <div>
                <h4 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.schritt6GenerierungPrompt} /></h4>
                <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.dieFertigeQuellenbelegteAntwort} /></p>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-text-main/80">
              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2 font-mono text-[10.5px]">
                <span className="text-purple-400 block font-sans font-bold"><MdText text={inhalt.texte.wasDasLlmHinter} /></span>
                <div className="text-slate-300"><MdText text={inhalt.texte.systemPromptDuBist} /></div>
                <div className="text-emerald-400"><MdText text={inhalt.texte.kontextQuelleGutachtenBv2024} /></div>
                <div className="text-amber-300"><MdText text={inhalt.texte.frageWelcheGründungWurde} /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1.5">
                  <h5 className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 size={15} /><MdText text={inhalt.texte.rollenUndRechtemanagementRbac} /></h5>
                  <p className="text-emerald-950/80"><MdText text={inhalt.texte.vorDerSuchePrüft} /></p>
                </div>

                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1.5">
                  <h5 className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Bot size={15} />
                    Endnutzer-Schnittstellen:
                  </h5>
                  <p className="text-blue-950/80"><MdText text={inhalt.texte.dasToolLäuftAls} /></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
