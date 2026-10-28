import { useState } from 'react';
import { useTabContext } from '../contexts/TabContext';
import {
  Info,
  Layers,
  BookOpen,
  FileText,
  Globe,
  FileSearch,
  Compass,
  History,
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import ModuleHistoryView from '@/src/components/ui/ModuleHistoryView';
import ModuleOverviewView from '@/src/components/ui/ModuleOverviewView';
import { MODULE_HISTORY_DATA } from '@/src/data/moduleHistoryData';
import { MODULES_DATA } from './moduleinfo/daten';
import { COMPREHENSIVE_RESOURCES } from './moduleinfo/ressourcen';

import type { TabId } from '@/src/contexts/TabContext';
import inhalt from '@/content/moduleinfo/ModuleInfo.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';
interface ModuleInfoProps {
  group: string;
}

export default function ModuleInfo({ group }: ModuleInfoProps) {
  const { setActiveTab } = useTabContext();
  const [activeSection, setActiveSection] = useState<'grundlagen' | 'ueberblick' | 'inhalte' | 'weiterfuehrend' | 'klassifizierung' | 'historie'>('grundlagen');
  const [laborStep, setLaborStep] = useState(0);

  const normalizedGroup = group.toLowerCase().replace('_info', '');
  const data = MODULES_DATA[normalizedGroup];
  const resources = COMPREHENSIVE_RESOURCES[normalizedGroup] || { websites: [], books: [], publications: [], dissertations: [] };
  const historyData = MODULE_HISTORY_DATA[normalizedGroup];

  if (!data) {
    return (
      <div className="bg-white dark:bg-slate-900 text-text-main dark:text-slate-100 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-800 p-12 text-center">
        <Info className="w-12 h-12 text-shiraz mx-auto mb-4" />
        <h3 className="text-lg font-bold text-text-main dark:text-slate-100 mb-2"><MdText text={inhalt.texte.modulinfosFürDiesesThema} /></h3>
        <p className="text-sm text-text-main/60 dark:text-slate-400"><MdText text={inhalt.texte.aktuellIstDiesesInformationsmodul} /></p>
      </div>
    );
  }

  const IconComponent = data.icon;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 text-text-main dark:text-slate-100 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-800 overflow-hidden">
        <div className="border-b border-home-grau/30 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-shiraz/10 rounded-xl text-shiraz">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main dark:text-slate-100">Bereich: {data.title}</h2>
              <p className="text-sm text-text-main/70 dark:text-slate-350">{data.tagline}</p>
            </div>
          </div>
        </div>

        {/* SECTION TABS */}
        <div className="border-b border-home-grau/30 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 p-2 sm:p-4 print:hidden">
          <ReiterLeiste label="Bereiche Modulinfo" className="flex flex-wrap gap-2">
            <button {...alsReiter(activeSection === 'grundlagen', 'modulinfo-bereich', 'grundlagen')}
              onClick={() => setActiveSection('grundlagen')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'grundlagen'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <Info size={14} />
              <span className="truncate">Modulbasis</span>
            </button>
            <button {...alsReiter(activeSection === 'ueberblick', 'modulinfo-bereich', 'ueberblick')}
              onClick={() => setActiveSection('ueberblick')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'ueberblick'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <Compass size={14} />
              <span className="truncate">Überblick</span>
            </button>
            <button {...alsReiter(activeSection === 'inhalte', 'modulinfo-bereich', 'inhalte')}
              onClick={() => setActiveSection('inhalte')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'inhalte'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <BookOpen size={14} />
              <span className="truncate">Lehrthemen</span>
            </button>
            <button {...alsReiter(activeSection === 'weiterfuehrend', 'modulinfo-bereich', 'weiterfuehrend')}
              onClick={() => setActiveSection('weiterfuehrend')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'weiterfuehrend'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <FileSearch size={14} />
              <span className="truncate">Quellen</span>
            </button>
            <button {...alsReiter(activeSection === 'historie', 'modulinfo-bereich', 'historie')}
              onClick={() => setActiveSection('historie')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'historie'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <History size={14} />
              <span className="truncate">Historie</span>
            </button>
            {normalizedGroup === 'baustoffe' && (
              <button {...alsReiter(activeSection === 'klassifizierung', 'modulinfo-bereich', 'klassifizierung')}
                onClick={() => setActiveSection('klassifizierung')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeSection === 'klassifizierung'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                <Layers size={14} />
                <span className="truncate">Systematik</span>
              </button>
            )}
          </ReiterLeiste>
        </div>

        {/* CONTENT PANEL */}
        <div className="p-6">
          {activeSection === 'grundlagen' && (
            <div {...reiterPanel('modulinfo-bereich', activeSection)} className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <FileText className="text-shiraz w-5 h-5" />
                  {data.basicsTitle}
                </h3>
                <p className="text-sm text-text-main/80 leading-relaxed">
                  {data.basicsDesc1}
                </p>
                <p className="text-sm text-text-main/80 leading-relaxed">
                  {data.basicsDesc2}
                </p>
              </div>

              {/* LABOR WORKFLOW DIRECTIVE (Interactive stepwise roadmap/Fahrplan) */}
              {normalizedGroup === 'labor' && (
                <div className="p-5 bg-stone-50 border border-home-grau/25 rounded-xl space-y-4">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block mb-0.5">Praxis-Fahrplan</span>
                    <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <Compass size={18} className="text-shiraz" /><MdText text={inhalt.texte.interaktiverSchrittFürSchritt} /></h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed"><MdText text={inhalt.texte.dieserChronologischeLeitfadenFührt} /></p>
                  </div>

                  {/* Flow Steps Buttons Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {inhalt.daten.ModuleInfo.map((step, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLaborStep(idx)}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                          laborStep === idx
                            ? 'bg-shiraz text-white border-shiraz shadow-sm ring-1 ring-shiraz hover:bg-shiraz/95'
                            : 'bg-white text-slate-800 border-home-grau/25 hover:bg-slate-50 hover:border-slate-350'
                        }`}
                      >
                        <span className={`text-[10px] font-black tracking-wider ${laborStep === idx ? 'text-white/80' : 'text-shiraz/80'}`}>{step.num}</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight truncate">{step.label}</span>
                          <span className={`text-[8.5px] leading-tight truncate mt-0.5 ${laborStep === idx ? 'text-white/70' : 'text-slate-450'}`}>{step.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Flow Step Card Content */}
                  <div className="bg-white p-4 rounded-lg border border-home-grau/25 shadow-inner">
                    {laborStep === 0 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">1</span><MdText text={inhalt.texte.schritt1NormgerechteProbenahme} /></h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded"><MdText text={inhalt.texte.dinEn125041} /></span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.keineLaborprüfungIstBesser} /></p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide"><MdText text={inhalt.texte.praxistippFürBohrkernentnahme} /></span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><MdText text={inhalt.texte.bewehrungOrtenVorDer} /></li>
                              <li><MdText text={inhalt.texte.mindestmaßBeachtenDerKerndurchmesser} /></li>
                              <li><MdText text={inhalt.texte.kernanzahlPlanenJePrüfbereich} /></li>
                            </ul>
                          </div>
                          <div className="p-3 bg-stone-50 border border-home-grau/15 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-shiraz block text-[10.5px]"><MdText text={inhalt.texte.lagaPn98Abfallbeprobung} /></span>
                              <p className="text-[10.5px] text-slate-600 leading-normal mt-1"><MdText text={inhalt.texte.umZBPak} /></p>
                            </div>
                            <div className="bg-white p-1.5 border border-home-grau/10 rounded text-[9.5px] font-mono text-slate-500 mt-2 text-center"><MdText text={inhalt.texte.mindestvolumenDerProbenAbhängig} /></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {laborStep === 1 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">2</span><MdText text={inhalt.texte.schritt2SensorApplikation} /></h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded"><MdText text={inhalt.texte.vdiVde2635Gum} /></span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.fürVerlässlicheMessdatenZ} /></p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide"><MdText text={inhalt.texte.dehnungsaufzeichnungDms} /></span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><MdText text={inhalt.texte.oberflächenvorbereitungDieBaustoffkontak} /></li>
                              <li><MdText text={inhalt.texte.brückenschaltungKonfigurierenVerwendenSi} /></li>
                              <li><MdText text={inhalt.texte.kalibrierfaktorKWertExakt} /></li>
                            </ul>
                          </div>
                          <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-indigo-900 block text-[10.5px]"><MdText text={inhalt.texte.messunsicherheitNachGumBipm} /></span>
                              <p className="text-[10.5px] text-indigo-950/80 leading-normal mt-1"><MdText text={inhalt.texte.messwerteOhneAngabeDer} /></p>
                            </div>
                            <div className="bg-white p-1.5 border border-indigo-100 rounded text-[9.5px] font-mono text-indigo-700 mt-2 text-center"><MdText text={inhalt.texte.gumErweiterteUnsicherheitU} /></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {laborStep === 2 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">3</span><MdText text={inhalt.texte.schritt3ZerstörendeMechanische} /></h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded"><MdText text={inhalt.texte.dinEn123903} /></span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.dieBestimmungDerFestigkeiten} /></p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide"><MdText text={inhalt.texte.prüfungsdurchführungFehlerminimierung} /></span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><MdText text={inhalt.texte.ebenheitSichernDieLastflächen} /></li>
                              <li><MdText text={inhalt.texte.lasteinleitungsrateSteuernBetonVerhält} /></li>
                              <li><MdText text={inhalt.texte.eModulZyklenDer} /></li>
                            </ul>
                          </div>
                          <div className="p-3 bg-red-50/50 border border-red-100 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-red-900 block text-[10.5px]">Spannungs-Dehnungs-Visualisierung</span>
                              <p className="text-[10.5px] text-red-950/80 leading-normal mt-1"><MdText text={inhalt.texte.imModulVirtuelleVersuche} /></p>
                            </div>
                            <div className="bg-white p-1.5 border border-red-100 rounded text-[9.5px] font-mono text-red-700 mt-2 text-center"><MdText text={inhalt.texte.bruchspannungBFMax} /></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {laborStep === 3 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">4</span><MdText text={inhalt.texte.schritt4MaterialanalytikChemophysikalisc} /></h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded">Methodenspektrum</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.makroskopischesMaterialverhaltenTragfähi} /></p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide">Analysen-Entscheidungsmatrix:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><MdText text={inhalt.texte.xrdFtirMineralogieMolekülbindungen} /></li>
                              <li><MdText text={inhalt.texte.tgaThermogravimetrieBestimmtDen} /></li>
                              <li><MdText text={inhalt.texte.rfaLipsElementeRfa} /></li>
                              <li><MdText text={inhalt.texte.gcMsOrganischeSchadstoffe} /></li>
                            </ul>
                          </div>
                          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-emerald-950 block text-[10.5px]"><MdText text={inhalt.texte.interaktiveDiagnostikSchnittstelle} /></span>
                              <p className="text-[10.5px] text-emerald-800 leading-normal mt-1"><MdText text={inhalt.texte.nutzenSieDasModul} /></p>
                            </div>
                            <div className="bg-white p-1.5 border border-emerald-100 rounded text-[9.5px] font-mono text-emerald-700 mt-2 text-center"><MdText text={inhalt.texte.chloridgrenze040Stahlbeton} /></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {laborStep === 4 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">5</span><MdText text={inhalt.texte.schritt5StatistischeAbsicherung} /></h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded"><MdText text={inhalt.texte.dinEn206Din} /></span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.keineEinzelfestigkeitEntscheidetAllein} /></p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide"><MdText text={inhalt.texte.statistischesHandwerkszeugFürKonstrukteu} /></span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><MdText text={inhalt.texte.ausreißertestNachGrubbsZeigt} /></li>
                              <li><MdText text={inhalt.texte.das5QuantilF} /></li>
                              <li><MdText text={inhalt.texte.konformitätNachEn206} /></li>
                            </ul>
                          </div>
                          <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-purple-950 block text-[10.5px]"><MdText text={inhalt.texte.statistikFestbetonModule} /></span>
                              <p className="text-[10.5px] text-purple-800 leading-normal mt-1"><MdText text={inhalt.texte.nutzenSieDieModule} /></p>
                            </div>
                            <div className="bg-white p-1.5 border border-purple-100 rounded text-[9.5px] font-mono text-purple-700 mt-2 text-center"><MdText text={inhalt.texte.statistikZielAusschaltquoten5} /></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {data.basicsCards.map((bc, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-home-grau/20 rounded-xl space-y-2">
                    <h4 className="font-bold text-sm text-text-main">{bc.title}</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed">
                      {bc.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* DIDACTIC PRINCIPLES */}
              {data.didacticCards && data.didacticCards.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-home-grau/15">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/60 flex items-center gap-1.5">
                    <CheckCircle className="text-emerald-600 w-4 h-4" /><MdText text={inhalt.texte.didaktischeLeitgedankenSchlüsselkonzepte} /></h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.didacticCards.map((dc, idx) => (
                      <div key={idx} className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Leitlinie {idx + 1}</span>
                        <h5 className="font-bold text-xs text-text-main">{dc.title}</h5>
                        <p className="text-[11px] text-text-main/75 leading-relaxed">{dc.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TARGET AUDIENCE SECTIONS */}
              {(data.appStudents || data.appProfessionals) && (
                <div className="space-y-3 pt-4 border-t border-home-grau/15">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/60 flex items-center gap-1.5">
                    <GraduationCap className="text-indigo-600 w-4 h-4" /><MdText text={inhalt.texte.zielgruppenPraxisEignung} /></h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.appStudents && (
                      <div className="p-4 bg-indigo-50/35 border border-indigo-100/60 rounded-xl space-y-1.5">
                        <h5 className="font-bold text-xs text-indigo-900 flex items-center gap-1"><MdText text={inhalt.texte.fürStudierendeLehre} /></h5>
                        <p className="text-[11px] text-indigo-950/80 leading-relaxed">
                          {data.appStudents}
                        </p>
                      </div>
                    )}
                    {data.appProfessionals && (
                      <div className="p-4 bg-slate-50 border border-home-grau/25 rounded-xl space-y-1.5">
                        <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1"><MdText text={inhalt.texte.fürPlanerBauingenieure} /></h5>
                        <p className="text-[11px] text-slate-800 leading-relaxed">
                          {data.appProfessionals}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'ueberblick' && (
            <div {...reiterPanel('modulinfo-bereich', activeSection)}><ModuleOverviewView groupKey={normalizedGroup} /></div>
          )}

          {activeSection === 'inhalte' && (
            <div {...reiterPanel('modulinfo-bereich', activeSection)} className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <BookOpen className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.gliederungDerLehrthemenInhalte} /></h3>
                <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.dieStrukturierungDiesesFachbereichs} /></p>
              </div>

              {/* ITERATING SUBMODULE DESCRIPTIONS */}
              {/* No scrollbars here, using natural high-contrast grid so it page-scrolls safely */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.submodules.map((m, idx) => {
                  const SubIcon = m.icon;
                  return (
                    <div key={idx} className="p-4 bg-white border border-home-grau/25 rounded-xl space-y-3 hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 border-b border-home-grau/15 pb-2 mb-1.5">
                          <SubIcon size={16} className="text-shiraz shrink-0" />
                          <h4 className="font-bold text-sm text-text-main line-clamp-1">{m.title}</h4>
                        </div>
                        <p className="text-[11px] text-text-main/80 leading-relaxed">
                          <strong className="text-text-main font-semibold">Zweck:</strong> {m.purpose}
                        </p>
                        {m.standards && (
                          <div className="text-[10px] text-indigo-700 bg-indigo-50/50 border border-indigo-100/50 px-2.5 py-1 rounded w-fit font-medium">
                            <span className="font-semibold">Regelwerk:</span> {m.standards}
                          </div>
                        )}
                        {m.useCase && (
                          <div className="text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/50 leading-relaxed transition-all">
                            <strong className="font-semibold text-slate-700 block mb-0.5">Praxis-Einsatz:</strong>
                            {m.useCase}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Standardisierter Druck-Fußzeilen-Bereich */}
              <div className="hidden print-footer">
                <span className="font-bold"><MdText text={inhalt.texte.quelleBaustoffboardThAugsburg} /></span>
                <span className="font-semibold"><MdText text={inhalt.texte.version2110} /></span>
                <span><MdText text={inhalt.texte.gedrucktAm} />{new Date().toLocaleString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })} Uhr</span>
              </div>

            </div>
          )}

          {activeSection === 'weiterfuehrend' && (
            <div {...reiterPanel('modulinfo-bereich', activeSection)} className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <Compass className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.umfangreicheWissenschaftlicheRessourcenF} /></h3>
                <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.diesesFachmodulGreiftAuf} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WEBSITES */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <Globe className="text-rose-600 w-4 h-4 shrink-0" /><MdText text={inhalt.texte.unabhängigeVerbändeFachportale} /></h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3"><MdText text={inhalt.texte.direktZugänglicheNeutraleFachinhalte} /></p>
                    <ul className="space-y-2.5">
                      {resources.websites.map((web, idx) => (
                        <li key={idx} className="text-xs">
                          {web.url ? (
                            <a href={web.url} target="_blank" rel="noopener noreferrer" className="font-bold text-shiraz hover:underline flex items-center gap-1">
                              {web.name} <span className="text-[10px]">↗</span>
                            </a>
                          ) : (
                            <span className="font-bold text-text-main flex items-center gap-1">
                              {web.name}
                            </span>
                          )}
                          <span className="text-text-main/70 block mt-0.5">{web.desc}</span>
                        </li>
                      ))}
                      {resources.websites.length === 0 && (
                        <li className="text-xs text-text-main/50 italic"><MdText text={inhalt.texte.keineFachportaleDirektGelistet} /></li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* TEXTBOOKS */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <BookOpen className="text-indigo-600 w-4 h-4 shrink-0" /><MdText text={inhalt.texte.wissenschaftlicheMonografienLehrbücher} /></h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3"><MdText text={inhalt.texte.inBibliothekenEtablierteStandardwerke} /></p>
                    <ul className="space-y-3 text-xs leading-relaxed text-text-main/80">
                      {resources.books.map((book, idx) => (
                        <li key={idx}>
                          <strong>{book.title}</strong>
                          <span className="block text-[11px] text-text-main/60 mt-0.5">{book.desc}</span>
                        </li>
                      ))}
                      {resources.books.length === 0 && (
                        <li className="text-xs text-text-main/50 italic"><MdText text={inhalt.texte.keineLehrbücherGelistet} /></li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* SCIENTIFIC PUBLICATIONS */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <FileText className="text-emerald-600 w-4 h-4 shrink-0" /><MdText text={inhalt.texte.wissenschaftlicheFachaufsätzePeerReviewe} /></h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3"><MdText text={inhalt.texte.internationaleWissenschaftlichePublikati} /></p>
                    <ul className="space-y-3 text-xs">
                      {resources.publications.map((pub, idx) => (
                        <li key={idx}>
                          <span className="font-bold text-emerald-800 block">{pub.journal}</span>
                          <span className="text-[11px] leading-relaxed text-text-main/70 mt-0.5">&quot;{pub.title}&quot; {pub.desc && `— ${pub.desc}`}</span>
                        </li>
                      ))}
                      {resources.publications.length === 0 && (
                        <li className="text-xs text-text-main/50 italic"><MdText text={inhalt.texte.keinePublikationsarbeitenAufgezeichnet} /></li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* DISSERTATIONS */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <GraduationCap className="text-amber-600 w-4 h-4 shrink-0" /><MdText text={inhalt.texte.dissertationenForschungsberichte} /></h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3"><MdText text={inhalt.texte.überDeutscheUniversitätsbibliothekenOffe} /></p>
                    <ul className="space-y-3 text-xs leading-relaxed text-text-main/80">
                      {resources.dissertations.map((diss, idx) => (
                        <li key={idx}>
                          <strong>{diss.title}</strong>
                          <span className="block text-[11px] text-text-main/60 mt-0.5">{diss.desc}</span>
                        </li>
                      ))}
                      {resources.dissertations.length === 0 && (
                        <li className="text-xs text-text-main/50 italic"><MdText text={inhalt.texte.keineDissertationenGelistet} /></li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'klassifizierung' && normalizedGroup === 'baustoffe' && (
            <div {...reiterPanel('modulinfo-bereich', activeSection)} className="space-y-6 animate-in fade-in duration-300">
              {/* WIKIPEDIA BAUSTOFF-RECHERCHE UND KLASSIFIZIERUNG */}
              <div className="bg-slate-50 border border-slate-300/80 p-6 rounded-xl text-left">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="text-shiraz" size={22} />
                  <h3 className="text-lg font-bold text-slate-800"><MdText text={inhalt.texte.baustoffKlassifizierungWikipediaRecherch} /></h3>
                </div>
                <p className="text-xs text-slate-600 mb-5 leading-relaxed"><MdText text={inhalt.texte.basierendAufDerWikipedia} /></p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Kolonne 1: Anorganische Baustoffe */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1.5"><MdText text={inhalt.texte.t1AnorganischeBaustoffe} /></h4>
                    
                    {/* Mineralisch */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2"><MdText text={inhalt.texte.aMineralischeBaustoffeBindemittel} /></span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Natursteine", tab: "gesteine" },
                          { name: "Lehm & Tone", tab: "lehm" },
                          { name: inhalt.werte.ziegelKlinker, tab: "mauerwerk" },
                          { name: inhalt.werte.ksPorenbeton, tab: "mauerwerk" },
                          { name: inhalt.werte.zementKalk, tab: "bindemittel" },
                          { name: inhalt.werte.gipsAnhydrit, tab: "gips" },
                          { name: inhalt.werte.mörtelPutze, tab: "putzemoertel" },
                          { name: "Betonprodukte", tab: "betonpraxis" },
                          { name: inhalt.werte.flachglasEsg, tab: "glas" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as TabId)}
                            className="text-[11px] bg-slate-100 hover:bg-shiraz/10 border border-slate-250 hover:border-shiraz/40 text-slate-700 hover:text-shiraz py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Metallisch */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2"><MdText text={inhalt.texte.bMetallischeBaustoffe} /></span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Baustahl", tab: "stahl" },
                          { name: "Bewehrungsstahl", tab: "korrosion" },
                          { name: "Gusseisen", tab: "metalle" },
                          { name: "Aluminium", tab: "metalle" },
                          { name: inhalt.werte.zinkKupfer, tab: "metalle" },
                          { name: inhalt.werte.bleiTitan, tab: "metalle" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as TabId)}
                            className="text-[11px] bg-slate-100 hover:bg-shiraz/10 border border-slate-250 hover:border-shiraz/40 text-slate-700 hover:text-shiraz py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Kolonne 2: Organische, Verbundstoffe & Biologisch-Lebendig */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1.5"><MdText text={inhalt.texte.t2OrganischeVerbundwerkstoffeMyzel} /></h4>

                    {/* Organische */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2"><MdText text={inhalt.texte.aOrganischeBaustoffe} /></span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Bauschnittholz", tab: "holz" },
                          { name: inhalt.werte.bshCltWerkstoffe, tab: "holzwerkstoffe" },
                          { name: inhalt.werte.bitumenAsphalt, tab: "asphalt" },
                          { name: inhalt.werte.duroThermoplaste, tab: "kunststoffe" },
                          { name: inhalt.werte.strohHanfDämmung, tab: "daemmstoffe" },
                          { name: inhalt.werte.korkNaturfasern, tab: "weitere_organik" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as TabId)}
                            className="text-[11px] bg-slate-100 hover:bg-shiraz/10 border border-slate-250 hover:border-shiraz/40 text-slate-700 hover:text-shiraz py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Verbundwerkstoffe */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2"><MdText text={inhalt.texte.bVerbundwerkstoffeComposites} /></span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Stahlbeton", tab: "labor" },
                          { name: "Carbonbeton", tab: "carbonbeton" },
                          { name: inhalt.werte.faserverbundFvk, tab: "faserverbund" },
                          { name: "Spannbeton: Grundlagen", tab: "spannbeton_grundlagen" },
                          { name: "Spannbeton: Kennwerte & Rechner", tab: "spannbeton_kennwerte" },
                          { name: "Gipskartonplatten", tab: "bp_trockenbau" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as TabId)}
                            className="text-[11px] bg-slate-100 hover:bg-shiraz/10 border border-slate-250 hover:border-shiraz/40 text-slate-700 hover:text-shiraz py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Living / Innovativ */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2"><MdText text={inhalt.texte.cLebendeBioBaustoffe} /></span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: inhalt.werte.weidenruteBaubotanik, tab: "weitere_organik" },
                          { name: inhalt.werte.pilzmyzelDämmplatten, tab: "weitere_organik" },
                          { name: inhalt.werte.bakteriellerBioBeton, tab: "innovative_werkstoffe" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as TabId)}
                            className="text-[11px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'historie' && (
            <div {...reiterPanel('modulinfo-bereich', activeSection)} className="animate-in fade-in duration-300">
              {historyData ? (
                <ModuleHistoryView history={historyData} />
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 text-center text-sm text-text-main/70"><MdText text={inhalt.texte.keineHistorischeChronikFür} /></div>
              )}
            </div>
          )}
        </div>
      </div>

      <ModuleFooter 
        wikipedia={data.wikipedia}
        literatur={data.literatur}
        regelwerke={data.regelwerke}
        formeln={data.formeln}
      />
    </div>
  );
}
