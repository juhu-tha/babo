import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  
  
  
  Building2, 
  Leaf, 
  AlertTriangle, 
  Layers, 
  Wrench, 
  FileText, 
  Download, 
  Calendar, 
  ArrowRight,
  Search
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { useTabContext, TabId } from '@/src/contexts/TabContext';
import LecturePollSession from '@/src/components/polls/LecturePollSession';
import { SERVER_FUNKTIONEN } from '@/src/data/betriebsart';
import RueckmeldungPerMail from '@/src/components/feedback/RueckmeldungPerMail';
import inhalt from '@/content/vorlesungen/Vorlesungen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

export type VorlesungTab = 
  | 'bauen_im_bestand'
  | 'nachhaltiges_bauen'
  | 'bauschaeden'
  | 'baustoffkunde'
  | 'instandhaltung';

interface VorlesungenProps {
  forceTab?: VorlesungTab;
}


export default function Vorlesungen({ forceTab }: VorlesungenProps) {
  const { setActiveTab } = useTabContext();
  const [activeSubTab, setActiveSubTab] = useState<VorlesungTab>(forceTab || 'bauen_im_bestand');
  // Direct QR Code scan listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pollParam = params.get('poll') as VorlesungTab;
      if (pollParam && ['bauen_im_bestand', 'nachhaltiges_bauen', 'bauschaeden', 'baustoffkunde', 'instandhaltung'].includes(pollParam)) {
        setActiveSubTab(pollParam);
      }
    }
  }, []);

  // Sync with forceTab prop when external tab change occurs
  useEffect(() => {
    if (forceTab) {
      setActiveSubTab(forceTab);
    }
  }, [forceTab]);

  // -------------------------------------------------------------------------
  // VORLESUNGSBEREICH (öffentlich; Entscheidung E5 vom 23.10.2026: keine Scheinsperre)
  // -------------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <GraduationCap className="text-shiraz h-6 w-6" /><MdText text={inhalt.texte.vorlesungenLehrveranstaltungenTha} /></h2>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.fakultätFürArchitekturUnd} /></p>
          </div>
        </div>

        {/* Introduction Teaser Box */}
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed mb-6">
          <p>
            Willkommen im digitalen Vorlesungsbereich des BaustoffBoards. Hier finden Sie die Vorlesungsgliederungen,
            die passenden Fachmodule und die Live-Abstimmungen zu den fünf Kernfächern: 
            <strong><MdText text={inhalt.texte.bauenImBestand} /></strong>, <strong><MdText text={inhalt.texte.nachhaltigesBauen} /></strong>, <strong>Bauschäden</strong>, 
            <strong> Baustoffkunde</strong> und <strong>Instandhaltung</strong>.
          </p>
        </div>

        {/* Tab-Navigation for Submodules */}
        <ReiterLeiste label="Vorlesungsbereiche" className="flex flex-wrap gap-2 pb-1 border-b border-home-grau/20">

          <button {...alsReiter(activeSubTab === 'bauen_im_bestand', 'vorlesung-bereich', 'bauen_im_bestand')}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'bauen_im_bestand'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveSubTab('bauen_im_bestand')}
          >
            <Building2 size={16} /><MdText text={inhalt.texte.t1BauenImBestand} /></button>

          <button {...alsReiter(activeSubTab === 'nachhaltiges_bauen', 'vorlesung-bereich', 'nachhaltiges_bauen')}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'nachhaltiges_bauen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveSubTab('nachhaltiges_bauen')}
          >
            <Leaf size={16} /><MdText text={inhalt.texte.t2NachhaltigesBauen} /></button>

          <button {...alsReiter(activeSubTab === 'bauschaeden', 'vorlesung-bereich', 'bauschaeden')}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'bauschaeden'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveSubTab('bauschaeden')}
          >
            <AlertTriangle size={16} /><MdText text={inhalt.texte.t3Bauschäden} /></button>

          <button {...alsReiter(activeSubTab === 'baustoffkunde', 'vorlesung-bereich', 'baustoffkunde')}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'baustoffkunde'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveSubTab('baustoffkunde')}
          >
            <Layers size={16} /><MdText text={inhalt.texte.t4Baustoffkunde} /></button>

          <button {...alsReiter(activeSubTab === 'instandhaltung', 'vorlesung-bereich', 'instandhaltung')}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'instandhaltung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveSubTab('instandhaltung')}
          >
            <Wrench size={16} /><MdText text={inhalt.texte.t5Instandhaltung} /></button>
        </ReiterLeiste>
      </div>



      {/* ===================================================================== */}
      {/* TAB 1: VORLESUNG BAUEN IM BESTAND                                     */}
      {/* ===================================================================== */}
      {activeSubTab === 'bauen_im_bestand' && (
        <div {...reiterPanel('vorlesung-bereich', activeSubTab)}><LectureModuleView
          lectureId="bauen_im_bestand"
          title={inhalt.werte.vorlesungBauenImBestand}
          subtitle={inhalt.werte.bestandserfassungHistorischeWerkstoffeZf}
          icon={Building2}
          modulDetails={inhalt.daten["Vorlesungen.modulDetails"]}
          relatedBoardTab="bestand"
          relatedBoardTabLabel={inhalt.werte.zumFachmodulBauenIm}
          units={inhalt.daten["Vorlesungen.units"]}
        /></div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: VORLESUNG NACHHALTIGES BAUEN                                   */}
      {/* ===================================================================== */}
      {activeSubTab === 'nachhaltiges_bauen' && (
        <div {...reiterPanel('vorlesung-bereich', activeSubTab)}><LectureModuleView
          lectureId="nachhaltiges_bauen"
          title={inhalt.werte.vorlesungNachhaltigesBauen}
          subtitle={inhalt.werte.ökobilanzierungLcaUnSdgs}
          icon={Leaf}
          modulDetails={inhalt.daten["Vorlesungen.modulDetails_2"]}
          relatedBoardTab="nachhaltigkeit_daten_regeln"
          relatedBoardTabLabel={inhalt.werte.zumFachmodulNachhaltigkeitDaten}
          units={inhalt.daten["Vorlesungen.units_2"]}
        /></div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: VORLESUNG BAUSCHÄDEN                                           */}
      {/* ===================================================================== */}
      {activeSubTab === 'bauschaeden' && (
        <div {...reiterPanel('vorlesung-bereich', activeSubTab)}><LectureModuleView
          lectureId="bauschaeden"
          title={inhalt.werte.vorlesungBauschädenSchadensanalyse}
          subtitle={inhalt.werte.forensischeBauschadensbegutachtungUrsach}
          icon={AlertTriangle}
          modulDetails={inhalt.daten["Vorlesungen.modulDetails_3"]}
          relatedBoardTab="bauschaeden"
          relatedBoardTabLabel={inhalt.werte.zumFachmodulBauschädenZustandsbewertung}
          units={inhalt.daten["Vorlesungen.units_3"]}
        /></div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: VORLESUNG BAUSTOFFKUNDE                                        */}
      {/* ===================================================================== */}
      {activeSubTab === 'baustoffkunde' && (
        <div {...reiterPanel('vorlesung-bereich', activeSubTab)}><LectureModuleView
          lectureId="baustoffkunde"
          title={inhalt.werte.vorlesungBaustoffkunde}
          subtitle={inhalt.werte.chemischPhysikalischeGrundlagenMineralis}
          icon={Layers}
          modulDetails={inhalt.daten["Vorlesungen.modulDetails_4"]}
          relatedBoardTab="baustoffkunde"
          relatedBoardTabLabel={inhalt.werte.zumFachmodulBaustoffeBauprodukte}
          units={inhalt.daten["Vorlesungen.units_4"]}
        /></div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: VORLESUNG INSTANDHALTUNG                                       */}
      {/* ===================================================================== */}
      {activeSubTab === 'instandhaltung' && (
        <div {...reiterPanel('vorlesung-bereich', activeSubTab)}><LectureModuleView
          lectureId="instandhaltung"
          title={inhalt.werte.vorlesungInstandhaltungVonBauwerken}
          subtitle={inhalt.werte.bauwerkserhaltungSchutzUndInstandsetzung}
          icon={Wrench}
          modulDetails={inhalt.daten["Vorlesungen.modulDetails_5"]}
          relatedBoardTab="instandhaltung"
          relatedBoardTabLabel={inhalt.werte.zumFachmodulSchutzInstandsetzung}
          units={inhalt.daten["Vorlesungen.units_5"]}
        /></div>
      )}

      {/* Standardized ModuleFooter according to Styleguide */}
      <ModuleFooter
        wikipedia={[
          { title: inhalt.werte.bauingenieurwesenStudium, url: 'https://de.wikipedia.org/wiki/Bauingenieurwesen' },
          { title: inhalt.werte.bauenImBestand, url: 'https://de.wikipedia.org/wiki/Bauen_im_Bestand' },
          { title: inhalt.werte.nachhaltigesBauen, url: 'https://de.wikipedia.org/wiki/Nachhaltiges_Bauen' },
          { title: 'Bauschaden', url: 'https://de.wikipedia.org/wiki/Bauschaden' },
          { title: 'Instandhaltung', url: 'https://de.wikipedia.org/wiki/Instandhaltung' }
        ]}
        literatur={inhalt.daten["Vorlesungen.literatur"]}
        regelwerke={inhalt.daten["Vorlesungen.regelwerke"]}
        formeln={[]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// HELPER COMPONENT FOR STANDARDIZED LECTURE SUBMODULE VIEW
// ---------------------------------------------------------------------------
interface LectureModuleViewProps {
  lectureId: 'bauen_im_bestand' | 'nachhaltiges_bauen' | 'bauschaeden' | 'baustoffkunde' | 'instandhaltung';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  modulDetails: {
    sws: number | string;
    ects: number;
    semester: string;
    pruefung: string;
    dozent: string;
  };
  relatedBoardTab: TabId;
  relatedBoardTabLabel: string;
  units: Array<{ nr: number; title: string; topic: string }>;
}

function LectureModuleView({
  lectureId,
  title,
  subtitle,
  icon: Icon,
  modulDetails,
  relatedBoardTab,
  relatedBoardTabLabel,
  units
}: LectureModuleViewProps) {
  const { setActiveTab } = useTabContext();
  const [unitSearch, setUnitSearch] = useState<string>('');

  const filteredUnits = units.filter(
    (u) =>
      u.title.toLowerCase().includes(unitSearch.toLowerCase()) ||
      u.topic.toLowerCase().includes(unitSearch.toLowerCase()) ||
      `einheit ${formatDeWert(u.nr)}`.includes(unitSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 mb-2">
              <Icon size={14} /> Vorlesungsmodul
            </div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-600 mt-1">{subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab(relatedBoardTab)}
            className="self-start sm:self-center py-2 px-4 rounded-xl text-xs font-bold bg-shiraz text-white hover:bg-shiraz/90 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            {relatedBoardTabLabel} <ArrowRight size={14} />
          </button>
        </div>

        {/* Module Key Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-home-grau/20 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Umfang</span>
            <strong className="text-sm font-bold text-slate-900 mt-0.5 block">{modulDetails.sws} SWS</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Leistungspunkte</span>
            <strong className="text-sm font-bold text-shiraz mt-0.5 block">{formatDeWert(modulDetails.ects)} ECTS</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Turnus</span>
            <strong className="text-sm font-bold text-slate-900 mt-0.5 block">{modulDetails.semester}</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Prüfungsform</span>
            <strong className="text-xs font-bold text-slate-900 mt-0.5 block truncate" title={modulDetails.pruefung}>
              {modulDetails.pruefung}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block"><MdText text={inhalt.texte.lehrstuhlDozentur} /></span>
            <strong className="text-xs font-bold text-slate-900 mt-0.5 block truncate" title={modulDetails.dozent}>
              {modulDetails.dozent}
            </strong>
          </div>
        </div>
      </div>

      {/* Live-Abstimmung (Kick-Off / 1. Vorlesungsstunde) – braucht /api/polls, im statischen Betrieb ausgeblendet */}
      {SERVER_FUNKTIONEN && <LecturePollSession lectureId={lectureId} lectureTitle={title} />}
      {/* statt Live-Abstimmung im statischen Betrieb: Rückmeldung per E-Mail (src/data/rueckmeldung.ts) */}
      {!SERVER_FUNKTIONEN && <RueckmeldungPerMail modultitel={title} className="px-1 print:hidden" />}

      {/* Materials & Download Placeholder Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Download className="text-shiraz" size={18} /><MdText text={inhalt.texte.vorlesungsunterlagenSkripteDownloads} /></h4>
            <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.begleitmaterialienFürImmatrikulierteStud} /></p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-bold">
            WS 2026/27
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <FileText className="text-blue-600" size={20} />
                <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">
                  PDF-Skript
                </span>
              </div>
              <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.vollständigesVorlesungsskript} /></strong>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.umfassendesLehrskriptMitTheoriekapiteln} /></p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono"><MdText text={inhalt.texte.inVorbereitung} /></span>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200 text-slate-600 cursor-not-allowed"
                disabled
              >
                Download
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <FileText className="text-amber-600" size={20} />
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">
                  Folien
                </span>
              </div>
              <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.vorlesungsfoliensatzKapitel114} /></strong>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.präsentationsfolienDerVorlesungMit} /></p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono"><MdText text={inhalt.texte.inVorbereitung2} /></span>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200 text-slate-600 cursor-not-allowed"
                disabled
              >
                Download
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <FileText className="text-emerald-600" size={20} />
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                  Übungsblätter
                </span>
              </div>
              <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.übungsaufgabenKlausurhinweise} /></strong>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.semesterbegleitendeRechenUndVerständnisü} /></p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono"><MdText text={inhalt.texte.inVorbereitung3} /></span>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200 text-slate-600 cursor-not-allowed"
                disabled
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus / Semester Plan (14 Lecture Units) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="text-shiraz" size={18} /><MdText text={inhalt.texte.vorlesungsgliederungSemesterplan14Lehrei} /></h4>
            <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.thematischeÜbersichtAller14} /></p>
          </div>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder={inhalt.werte.vorlesungsthemaSuchen}
              value={unitSearch}
              onChange={(e) => setUnitSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-shiraz"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredUnits.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200"><MdText text={inhalt.texte.keineVorlesungseinheitenFürDen} /></div>
          ) : (
            filteredUnits.map((unit) => (
              <div
                key={unit.nr}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {String(unit.nr).padStart(2, '0')}
                  </span>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">{unit.title}</strong>
                    <span className="text-[11px] text-slate-600 block mt-0.5 leading-relaxed">
                      {unit.topic}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                    90 min
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200"><MdText text={inhalt.texte.inVorbereitung4} /></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
