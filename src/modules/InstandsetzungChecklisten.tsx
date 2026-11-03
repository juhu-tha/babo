import type { LucideIcon } from 'lucide-react';
import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  ClipboardList, 
  Shield,
  Search,
  Filter,
  RotateCcw,
  CheckCheck,
  Zap,
  Printer
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/instandsetzungchecklisten/InstandsetzungChecklisten.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

interface ChecklistItem {
  id: string;
  task: string;
  description: string;
  ref: string;
  tolerance: string;
  status: 'critical' | 'mandatory' | 'recommended';
}

interface ChecklistSection {
  id: string;
  title: string;
  phase: string;
  description: string;
  icon: LucideIcon;
  items: ChecklistItem[];
}

const INSTANDSETZUNG_CHECKLISTS: Record<string, ChecklistSection> = {
  planung: {
    id: 'planung',
    phase: 'Phase 1',
    title: inhalt.werte.t1VoruntersuchungSkpPlanungskonzept,
    description: inhalt.werte.diagnostikNachweisDerStandsicherheit,
    icon: ShieldCheck,
    items: [
      {
        id: 'plan-1',
        task: inhalt.werte.zertifiziertenSachkundigenPlanerSkp,
        description: inhalt.werte.beiStandsicherheitsrelevantenBetoninstan,
        ref: inhalt.werte.trInstandhaltungTeil1,
        tolerance: inhalt.werte.zertifikatNachAusbildungsbeiratSkp,
        status: 'critical'
      },
      {
        id: 'plan-2',
        task: inhalt.werte.karbonatisierungstiefeMitPhenolphthalein,
        description: inhalt.werte.bruchflächeAmBohrkernOder,
        ref: inhalt.werte.dinEn14630,
        tolerance: inhalt.werte.cNomDK,
        status: 'critical'
      },
      {
        id: 'plan-3',
        task: inhalt.werte.chloridTiefenstufenprofilImLabor,
        description: inhalt.werte.trockenbohrmehlentnahmeInTiefenstufen0,
        ref: inhalt.werte.dinEn14629Dafstb,
        tolerance: inhalt.werte.cKrit050,
        status: 'critical'
      },
      {
        id: 'plan-4',
        task: inhalt.werte.abreißfestigkeitDesAltbetonsPrüfen,
        description: inhalt.werte.haftzugprüfungAnRepräsentativenVorbereit,
        ref: 'DIN EN 1542',
        tolerance: inhalt.werte.mittelwert15N,
        status: 'critical'
      },
      {
        id: 'plan-5',
        task: inhalt.werte.statischeZwischenzuständeAbstützungNachw,
        description: inhalt.werte.tragwerksplanerischeFreigabeFürDen,
        ref: inhalt.werte.dinEn19921,
        tolerance: inhalt.werte.volleLastabtragungImZwischenzustand,
        status: 'critical'
      },
      {
        id: 'plan-6',
        task: inhalt.werte.instandsetzungsprinzipFestlegenDinEn,
        description: inhalt.werte.eindeutigeZuordnungDesKonzepts,
        ref: inhalt.werte.dinEn15049,
        tolerance: inhalt.werte.eindeutigeDokumentationImInstandsetzungs,
        status: 'mandatory'
      }
    ]
  },
  untergrund: {
    id: 'untergrund',
    phase: 'Phase 2',
    title: inhalt.werte.t2UntergrundvorbereitungBewehrungsentrost,
    description: inhalt.werte.vollständigerSchadensabtragFreilegungDer,
    icon: Layers,
    items: [
      {
        id: 'ug-1',
        task: inhalt.werte.geschädigtenBetonMitHdw,
        description: inhalt.werte.hochdruckwasserstrahlenMit1000,
        ref: inhalt.werte.ztvIngTeil3,
        tolerance: inhalt.werte.vollständigeEntfernungDesKarbonatisierte,
        status: 'critical'
      },
      {
        id: 'ug-2',
        task: inhalt.werte.bewehrungRundumFreilegenHinterstemmung,
        description: inhalt.werte.korrodiertenBewehrungsstahlSoweitFreileg,
        ref: inhalt.werte.trInstandhaltungDinEn,
        tolerance: inhalt.werte.mindestens15MmLichter,
        status: 'critical'
      },
      {
        id: 'ug-3',
        task: inhalt.werte.bewehrungsstahlMetallischBlankEntrosten,
        description: inhalt.werte.strahlenMitFestenStrahlmitteln,
        ref: inhalt.werte.dinEnIso8501,
        tolerance: inhalt.werte.reinheitsgradSa2Sauber,
        status: 'critical'
      },
      {
        id: 'ug-4',
        task: inhalt.werte.aktivenKorrosionsschutzAufBewehrung,
        description: inhalt.werte.unmittelbarNachDemStrahlen,
        ref: inhalt.werte.dinEn15047,
        tolerance: inhalt.werte.lückenloseSchichtOhneFehlstellen,
        status: 'critical'
      },
      {
        id: 'ug-5',
        task: inhalt.werte.betonuntergrundVornässenMattfeuchte,
        description: inhalt.werte.mindestens2Bis4,
        ref: inhalt.werte.dinEn150410,
        tolerance: inhalt.werte.mattfeuchtKeineGlanzstellenOder,
        status: 'mandatory'
      }
    ]
  },
  moertel: {
    id: 'moertel',
    phase: 'Phase 3',
    title: inhalt.werte.t3MörtelapplikationReprofilierungPcc,
    description: inhalt.werte.fachgerechtesMischenNassIn,
    icon: Wrench,
    items: [
      {
        id: 'moe-1',
        task: inhalt.werte.klimatischeEinbaubedingungenPrüfen,
        description: inhalt.werte.luftUndBauteiltemperaturSowie,
        ref: inhalt.werte.dinEn1504102,
        tolerance: inhalt.werte.bauteiltemperatur5CBis,
        status: 'critical'
      },
      {
        id: 'moe-2',
        task: inhalt.werte.haftbrückeFrischInFrisch,
        description: inhalt.werte.mineralischeOderKunststoffmodifizierteHa,
        ref: inhalt.werte.trInstandhaltungDinEn2,
        tolerance: inhalt.werte.nassInNassAuftrag,
        status: 'critical'
      },
      {
        id: 'moe-3',
        task: inhalt.werte.exaktesWasserMörtelVerhältnis,
        description: inhalt.werte.mischwasserMitGeeichtemMessbecher,
        ref: inhalt.werte.dinEn15043,
        tolerance: inhalt.werte.wasserzugabeExaktImHerstellergrenzbereic,
        status: 'mandatory'
      },
      {
        id: 'moe-4',
        task: inhalt.werte.schichtdickenbegrenzungJeArbeitsgangEinh,
        description: inhalt.werte.maximaleSchichtdickeJeMörtellage,
        ref: inhalt.werte.dinEn150432,
        tolerance: inhalt.werte.pccMeistMax20,
        status: 'mandatory'
      },
      {
        id: 'moe-5',
        task: inhalt.werte.nachbehandlungSofortBeginnenSchwindschut,
        description: inhalt.werte.unmittelbarNachDemGlätten,
        ref: inhalt.werte.dinEn13670Din,
        tolerance: inhalt.werte.mindestens5TageFeuchte,
        status: 'critical'
      }
    ]
  },
  os_riss: {
    id: 'os_riss',
    phase: 'Phase 4',
    title: inhalt.werte.t4OberflächenschutzOsRissinjektion,
    description: inhalt.werte.abdichtendeSchutzschichtenRissüberbrücku,
    icon: Shield,
    items: [
      {
        id: 'os-1',
        task: inhalt.werte.restfeuchteDesBetonuntergrundsMessen,
        description: inhalt.werte.vorDemAuftragVon,
        ref: inhalt.werte.din185604Din,
        tolerance: inhalt.werte.restfeuchte40Cm,
        status: 'critical'
      },
      {
        id: 'os-2',
        task: inhalt.werte.taupunktabstandFürBeschichtungenKontroll,
        description: inhalt.werte.oberflächentemperaturMitInfrarotthermome,
        ref: inhalt.werte.dinEnIso12944,
        tolerance: inhalt.werte.tOberflaecheTTaupunkt,
        status: 'critical'
      },
      {
        id: 'os-3',
        task: inhalt.werte.trockenschichtdickeDftDerOs,
        description: inhalt.werte.schichtdickenmessungKeilförmigerSchnittO,
        ref: inhalt.werte.dinEnIso2808,
        tolerance: inhalt.werte.keinEinzelwert80Der,
        status: 'mandatory'
      },
      {
        id: 'os-4',
        task: inhalt.werte.rissinjektionRissursacheFüllgutAbstimmen,
        description: inhalt.werte.ruhendeTrennrisseMitEpoxidharz,
        ref: inhalt.werte.dinEn15045,
        tolerance: inhalt.werte.fH30,
        status: 'critical'
      },
      {
        id: 'os-5',
        task: inhalt.werte.injektionsdruckBegrenzenSchutzVor,
        description: inhalt.werte.druckAmManometerDer,
        ref: inhalt.werte.ztvIngTeil32,
        tolerance: inhalt.werte.druckbegrenzungNachVorgabeDes,
        status: 'critical'
      },
      {
        id: 'os-6',
        task: inhalt.werte.packerabstandNachBauteildickeAnordnen,
        description: inhalt.werte.bohrpackerWechselseitigIm45,
        ref: inhalt.werte.dinEn150452,
        tolerance: inhalt.werte.packerabstandDeltaLBauteildicke,
        status: 'mandatory'
      }
    ]
  },
  kks_spezial: {
    id: 'kks_spezial',
    phase: 'Phase 5',
    title: inhalt.werte.t5KathodischerKorrosionsschutzKks,
    description: inhalt.werte.elektrochemischerSchutzCfkLamellen,
    icon: Zap,
    items: [
      {
        id: 'kks-1',
        task: inhalt.werte.elektrischeDurchgängigkeitDerBewehrung,
        description: inhalt.werte.widerstandsmessungZwischenAllenFreigeleg,
        ref: inhalt.werte.dinEnIso12696,
        tolerance: inhalt.werte.durchgangswiderstandR10,
        status: 'critical'
      },
      {
        id: 'kks-2',
        task: inhalt.werte.referenzelektrodenAnKorrosionsHotspots,
        description: inhalt.werte.einbauLanglebigerReferenzelektrodenManga,
        ref: inhalt.werte.dinEnIso126962,
        tolerance: inhalt.werte.mindestens2ReferenzelektrodenJe,
        status: 'mandatory'
      },
      {
        id: 'kks-3',
        task: inhalt.werte.t100MvDepolarisationskriteriumNachweisen,
        description: inhalt.werte.nachAbschaltenDesFremdstroms,
        ref: inhalt.werte.dinEnIso126963,
        tolerance: inhalt.werte.deltaEDepol100,
        status: 'critical'
      },
      {
        id: 'kks-4',
        task: inhalt.werte.cfkLamellenverklebungBetonoberflächenzug,
        description: inhalt.werte.vorDemAufklebenStatisch,
        ref: inhalt.werte.dibtZulassungCfkDafstb,
        tolerance: inhalt.werte.mittelwertFCtm1,
        status: 'critical'
      }
    ]
  },
  abnahme: {
    id: 'abnahme',
    phase: 'Phase 6',
    title: inhalt.werte.t6QualitätssicherungSivvDokumentation,
    description: inhalt.werte.bautagebuchAbreißversucheGewährleistungU,
    icon: ClipboardList,
    items: [
      {
        id: 'ab-1',
        task: inhalt.werte.bauüberwachungDurchFachkundigesPersonal,
        description: inhalt.werte.kontinuierlicheDokumentationAllerChargen,
        ref: inhalt.werte.trInstandhaltungTeil12,
        tolerance: inhalt.werte.täglicheLückenloseSignaturDurch,
        status: 'critical'
      },
      {
        id: 'ab-2',
        task: inhalt.werte.haftzugprüfungAmAusgehärtetenInstandsetz,
        description: inhalt.werte.bohrkerneBis5Mm,
        ref: inhalt.werte.dinEn1542Tr,
        tolerance: inhalt.werte.betaHz15,
        status: 'critical'
      },
      {
        id: 'ab-3',
        task: inhalt.werte.ebenheitUndRutschhemmungsklassePrüfen,
        description: inhalt.werte.beiBefahrbarenParkhausbeschichtungenOs,
        ref: inhalt.werte.din51130AsrA1,
        tolerance: inhalt.werte.einhaltungDerGefordertenR,
        status: 'mandatory'
      },
      {
        id: 'ab-4',
        task: inhalt.werte.inspektionsWartungsvertragDin31051,
        description: inhalt.werte.insbesondereBeiRissüberbrückendenBeschic,
        ref: inhalt.werte.din31051TrInstandhaltung,
        tolerance: inhalt.werte.schriftlicherWartungsplanMitJährlichem,
        status: 'recommended'
      }
    ]
  }
};

export default function InstandsetzungChecklisten() {
  const [activeSubTab, setActiveSubTab] = useState<string>('planung');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'mandatory' | 'recommended'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentSection = INSTANDSETZUNG_CHECKLISTS[activeSubTab];

  // Calculate statistics across all sections
  const totalStats = useMemo(() => {
    let totalCount = 0;
    let completedCount = 0;
    let criticalCount = 0;
    let criticalCompleted = 0;

    Object.values(INSTANDSETZUNG_CHECKLISTS).forEach((sec) => {
      sec.items.forEach((it) => {
        totalCount++;
        if (checkedItems[it.id]) completedCount++;
        if (it.status === 'critical') {
          criticalCount++;
          if (checkedItems[it.id]) criticalCompleted++;
        }
      });
    });

    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { totalCount, completedCount, criticalCount, criticalCompleted, percent };
  }, [checkedItems]);

  // Filtered items in the current section
  const filteredItems = useMemo(() => {
    return currentSection.items.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSearch = searchQuery.trim() === '' || 
        item.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tolerance.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [currentSection, statusFilter, searchQuery]);

  // Section completion helper
  const getSectionProgress = (secId: string) => {
    const sec = INSTANDSETZUNG_CHECKLISTS[secId];
    if (!sec) return { done: 0, total: 0, percent: 0 };
    const done = sec.items.filter((it) => checkedItems[it.id]).length;
    const total = sec.items.length;
    const percent = Math.round((done / total) * 100);
    return { done, total, percent };
  };

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const markAllInSection = (secId: string) => {
    const sec = INSTANDSETZUNG_CHECKLISTS[secId];
    const newChecked = { ...checkedItems };
    sec.items.forEach((it) => {
      newChecked[it.id] = true;
    });
    setCheckedItems(newChecked);
  };

  const resetAllInSection = (secId: string) => {
    const sec = INSTANDSETZUNG_CHECKLISTS[secId];
    const newChecked = { ...checkedItems };
    sec.items.forEach((it) => {
      delete newChecked[it.id];
    });
    setCheckedItems(newChecked);
  };

  const resetEverything = () => {
    setCheckedItems({});
  };

  return (
    <div className="flex flex-col gap-6 w-full py-4 animate-in fade-in duration-300">
      
      {/* Header Info-Bereich */}
      <div className="bg-white text-text-main rounded-2xl p-6 border border-home-grau/30 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
              <ClipboardList className="text-shiraz" size={24} /><MdText text={inhalt.texte.interaktiveInstandsetzungsChecklistenQua} /></h2>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.baustellenprotokollNachTrInstandhaltung} /></p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border border-home-grau/30 text-xs font-semibold text-text-main hover:bg-off-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title={inhalt.werte.aktuelleChecklisteDruckenOder}
            >
              <Printer size={14} /><MdText text={inhalt.texte.druckenPdf} /></button>
            <button
              onClick={resetEverything}
              className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-700 bg-rose-50/50 hover:bg-rose-100 flex items-center gap-1.5 transition-colors cursor-pointer"
              title={inhalt.werte.alleMarkierungenZurücksetzen}
            >
              <RotateCcw size={14} /><MdText text={inhalt.texte.allesLeeren} /></button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 p-4 rounded-xl bg-off-white border border-home-grau/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 mb-2 font-medium">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900"><MdText text={inhalt.texte.gesamtfortschrittInstandsetzung} /></span>
              <span className="font-mono text-shiraz font-bold">
                {totalStats.completedCount} von {totalStats.totalCount}<MdText text={inhalt.texte.prüfpunkten} />{formatDeWert(totalStats.percent)} %)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span><MdText text={inhalt.texte.kritischePunkte} />{formatDeWert(totalStats.criticalCompleted)} / {totalStats.criticalCount}</span>
            </div>
          </div>
          
          <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-home-grau/30">
            <div 
              className="h-full bg-gradient-to-r from-shiraz to-emerald-600 transition-all duration-300"
              style={{ width: `${totalStats.percent}%` }}
            ></div>
          </div>
        </div>

        {/* Sub-Tabs Selector (Phasen) */}
        <ReiterLeiste label="Phase" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mt-4">
          {Object.values(INSTANDSETZUNG_CHECKLISTS).map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSubTab === sec.id;
            const prog = getSectionProgress(sec.id);

            return (
              <button {...alsReiter(isActive, 'instandsetzung-checkliste', sec.id)}
                key={sec.id}
                onClick={() => setActiveSubTab(sec.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {sec.phase}
                    </span>
                    <Icon size={14} className={isActive ? 'text-white' : 'text-shiraz'} />
                  </div>
                  <span className={`text-xs font-bold block line-clamp-1 ${isActive ? 'text-white' : 'text-text-main'}`}>
                    {sec.title.split('. ')[1]}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-[10px] font-mono">
                  <span className={isActive ? 'text-white/80' : 'text-slate-500'}>
                    {formatDeWert(prog.done)}/{formatDeWert(prog.total)} erledigt
                  </span>
                  <span className={`font-bold ${
                    prog.percent === 100 ? (isActive ? 'text-emerald-300' : 'text-emerald-600') : ''
                  }`}>
                    {formatDeWert(prog.percent)}%
                  </span>
                </div>
              </button>
            );
          })}
        </ReiterLeiste>
      </div>

      {/* Filter & Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder={inhalt.werte.prüfpunktNormOderGrenzwert}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-home-grau/30 focus:outline-hidden focus:border-shiraz bg-off-white/50"
            />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Löschen
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AuswahlGruppe label="Filter Status" className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter size={12} /> Status:
          </span>
          <button {...alsOption(statusFilter === 'all')}
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-shiraz text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Alle
          </button>
          <button {...alsOption(statusFilter === 'critical')}
            onClick={() => setStatusFilter('critical')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'critical' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          ><MdText text={inhalt.texte.nurZwingend} /></button>
          <button {...alsOption(statusFilter === 'mandatory')}
            onClick={() => setStatusFilter('mandatory')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'mandatory' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Normativ
          </button>
          </AuswahlGruppe>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button
            onClick={() => markAllInSection(currentSection.id)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <CheckCheck size={13} /><MdText text={inhalt.texte.phaseAbhaken} /></button>
          <button
            onClick={() => resetAllInSection(currentSection.id)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw size={13} /> Zurücksetzen
          </button>
        </div>
      </div>

      {/* Items Section */}
      <div {...reiterPanel('instandsetzung-checkliste', activeSubTab)} className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-home-grau/20 pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-shiraz bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {currentSection.phase}
              </span>
              <h3 className="font-bold text-base text-slate-900">{currentSection.title}</h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">{currentSection.description}</p>
          </div>
          
          <div className="text-xs font-mono bg-off-white px-3 py-1.5 rounded-lg border border-home-grau/30 text-slate-700 shrink-0">
            <strong>{currentSection.items.filter((it) => checkedItems[it.id]).length}</strong> von {currentSection.items.length}<MdText text={inhalt.texte.punktenErfüllt} /></div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-off-white rounded-xl border border-home-grau/20 text-xs"><MdText text={inhalt.texte.keinePrüfpunkteFürDie} /></div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isDone = !!checkedItems[item.id];

              return (
                <div 
                  key={item.id} 
                  onClick={() => toggleItem(item.id)}
                  className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                    isDone 
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-xs' 
                      : 'bg-off-white border-home-grau/25 hover:border-shiraz/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isDone}
                      aria-label={item.task}
                      onChange={() => {}} // handled by parent div onClick
                      className="mt-0.5 w-4 h-4 rounded text-shiraz focus:ring-shiraz cursor-pointer shrink-0 accent-shiraz"
                    />
                    
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'critical' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          item.status === 'mandatory' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {item.status === 'critical' ? inhalt.werte.zwingendStandsicherheit :
                           item.status === 'mandatory' ? 'Regelwerkskonform' : 'Empfohlen'}
                        </span>
                        
                        <h4 className={`font-bold text-sm ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {item.task}
                        </h4>
                      </div>
                      
                      <p className={`leading-relaxed text-xs ${isDone ? 'text-slate-500' : 'text-slate-700'}`}>
                        {item.description}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px]">
                        <span className="text-slate-500"><MdText text={inhalt.texte.toleranzSollwert} /><span className="font-mono text-slate-800 font-semibold">{item.tolerance}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex md:flex-col items-end justify-between md:justify-center gap-1 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                    <span className="text-[11px] font-mono bg-white px-2.5 py-1 rounded border border-home-grau/30 text-slate-700 whitespace-nowrap shadow-2xs">
                      {item.ref}
                    </span>
                    {isDone && (
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Erledigt
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1TaupunktprüfungVor}
        zielGleichung="\theta_d = \frac{b \cdot \gamma}{a - \gamma}, \quad \gamma = \ln\varphi + \frac{a \cdot \theta}{b + \theta}"
        schritte={inhalt.daten["InstandsetzungChecklisten.schritte"]}
        ergebnisHinweis={inhalt.werte.messungUndDokumentationVon}
        normQuelle={inhalt.werte.dinEnIso129442}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2AuswertungVon}
        zielGleichung="\bar{f} = \frac{1}{n}\sum f_i, \quad f_{min}"
        schritte={inhalt.daten["InstandsetzungChecklisten.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dieErforderlichenWerteHängen}
        normQuelle={inhalt.werte.dinEn1542Tr2}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="instandsetzung_checklisten" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap12}
        weblinks={inhalt.daten["InstandsetzungChecklisten.weblinks"]}
        wikipedia={[
          { title: "Betoninstandsetzung", url: "https://de.wikipedia.org/wiki/Betoninstandsetzung" },
          { title: "Bauüberwachung", url: "https://de.wikipedia.org/wiki/Objekt%C3%BCberwachung" },
          { title: "Instandhaltung", url: "https://de.wikipedia.org/wiki/Instandhaltung" }
        ]}
        literatur={inhalt.daten["InstandsetzungChecklisten.literatur"]}
        regelwerke={inhalt.daten["InstandsetzungChecklisten.regelwerke"]}
        formeln={inhalt.daten["InstandsetzungChecklisten.formeln"]}
      />
    </div>
  );
}
