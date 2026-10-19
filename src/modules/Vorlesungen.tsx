import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Lock, 
  Unlock, 
  KeyRound, 
  Building2, 
  Leaf, 
  AlertTriangle, 
  Layers, 
  Wrench, 
  BookOpen, 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Search
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { useTabContext, TabId } from '@/src/contexts/TabContext';
import LecturePollSession from '@/src/components/polls/LecturePollSession';

export type VorlesungTab = 
  | 'ueberblick'
  | 'bauen_im_bestand'
  | 'nachhaltiges_bauen'
  | 'bauschaeden'
  | 'baustoffkunde'
  | 'instandhaltung';

interface VorlesungenProps {
  forceTab?: VorlesungTab;
}

const PASSWORD_REQUIRED = 'tha_ws26';
const STORAGE_KEY = 'tha_vorlesungen_auth_v1';

export default function Vorlesungen({ forceTab }: VorlesungenProps) {
  const { setActiveTab } = useTabContext();
  const [activeSubTab, setActiveSubTab] = useState<VorlesungTab>(forceTab || 'ueberblick');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('poll')) return true; // Direct QR scan unlocks poll mode
      }
      return localStorage.getItem(STORAGE_KEY) === 'unlocked';
    } catch {
      return false;
    }
  });

  // Direct QR Code scan listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pollParam = params.get('poll') as VorlesungTab;
      if (pollParam && ['bauen_im_bestand', 'nachhaltiges_bauen', 'bauschaeden', 'baustoffkunde', 'instandhaltung'].includes(pollParam)) {
        setActiveSubTab(pollParam);
        setIsUnlocked(true);
      }
    }
  }, []);

  // Sync with forceTab prop when external tab change occurs
  useEffect(() => {
    if (forceTab) {
      setActiveSubTab(forceTab);
    }
  }, [forceTab]);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput.trim() === PASSWORD_REQUIRED) {
      setIsUnlocked(true);
      setAuthError(null);
      setPasswordInput('');
      try {
        localStorage.setItem(STORAGE_KEY, 'unlocked');
      } catch {
        // Ignore storage errors
      }
    } else {
      setAuthError('Falsches Passwort. Bitte prüfen Sie Ihre Eingabe (Hinweis: tha_ws26).');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPasswordInput('');
    setAuthError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  // -------------------------------------------------------------------------
  // PASSWORD GATE (LOCKED STATE)
  // -------------------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[550px] p-4 animate-in fade-in duration-300">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-home-grau/30 max-w-lg w-full text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 mb-6">
            <GraduationCap size={16} />
            Technische Hochschule Augsburg (THA)
          </div>

          <div className="w-16 h-16 bg-shiraz/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-shiraz border border-shiraz/20">
            <Lock size={32} />
          </div>

          <h2 className="text-2xl font-bold text-text-main mb-2">
            Vorlesungen — Geschützter Bereich
          </h2>
          <p className="text-sm text-text-main/70 mb-6 leading-relaxed">
            Dieser Bereich enthält Vorlesungsunterlagen, Skripte, Vorlesungsfolien und Übungsmaterialien der Lehrveranstaltungen. 
            Bitte geben Sie das Vorlesungspasswort für das laufende Semester ein.
          </p>

          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (authError) setAuthError(null);
                }}
                placeholder="Passwort eingeben..."
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-home-grau/40 bg-slate-50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-shiraz/30 focus:border-shiraz transition-all text-center tracking-wide"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-1 rounded"
              >
                {showPassword ? 'Verbergen' : 'Anzeigen'}
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-shiraz text-white hover:bg-shiraz/90 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound size={16} /> Vorlesungen freischalten
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-home-grau/20 text-xs text-text-main/60 flex flex-col gap-1.5">
            <p>
              Passwort für Studierende des Semesters: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-800 font-bold">tha_ws26</code>
            </p>
            <p className="text-[11px] text-slate-400">
              Bei Fragen wenden Sie sich an die Modulverantwortlichen der Fakultät für Architektur und Bauwesen.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // UNLOCKED STATE: MAIN LECTURES WORKSPACE
  // -------------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <GraduationCap className="text-shiraz h-6 w-6" />
              Vorlesungen &amp; Lehrveranstaltungen (THA)
            </h2>
            <p className="text-xs text-text-main/70 mt-1">
              Fakultät für Architektur und Bauwesen • Technische Hochschule Augsburg • Wintersemester 2026/2027
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Unlock size={14} /> Freigeschaltet
            </span>
            <button
              type="button"
              onClick={handleLock}
              className="px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              title="Bereich wieder mit Passwort sperren"
            >
              Sperren
            </button>
          </div>
        </div>

        {/* Introduction Teaser Box */}
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed mb-6">
          <p>
            Willkommen im digitalen Vorlesungsbereich des Baustoffboards. Hier finden Studierende alle begleitenden Unterlagen, 
            Vorlesungsgliederungen, Folien, Skripte und Semesterübungen zu den fünf Kernfächern: 
            <strong> Bauen im Bestand</strong>, <strong>Nachhaltiges Bauen</strong>, <strong>Bauschäden</strong>, 
            <strong> Baustoffkunde</strong> und <strong>Instandhaltung</strong>.
          </p>
        </div>

        {/* Tab-Navigation for Submodules */}
        <div className="flex flex-wrap gap-2 pb-1 border-b border-home-grau/20">
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'ueberblick'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveSubTab('ueberblick')}
          >
            <BookOpen size={16} /> Übersicht &amp; Termine
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'bauen_im_bestand'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveSubTab('bauen_im_bestand')}
          >
            <Building2 size={16} /> 1. Bauen im Bestand
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'nachhaltiges_bauen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveSubTab('nachhaltiges_bauen')}
          >
            <Leaf size={16} /> 2. Nachhaltiges Bauen
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'bauschaeden'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveSubTab('bauschaeden')}
          >
            <AlertTriangle size={16} /> 3. Bauschäden
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'baustoffkunde'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveSubTab('baustoffkunde')}
          >
            <Layers size={16} /> 4. Baustoffkunde
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'instandhaltung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveSubTab('instandhaltung')}
          >
            <Wrench size={16} /> 5. Instandhaltung
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 0: ÜBERSICHT & LEHRVERANSTALTUNGEN                                */}
      {/* ===================================================================== */}
      {activeSubTab === 'ueberblick' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Semester</span>
              <strong className="text-xl font-extrabold text-slate-900 block mt-1">WS 2026 / 2027</strong>
              <p className="text-xs text-slate-500 mt-2">
                Vorlesungszeit: Oktober 2026 – Februar 2027. Prüfungsphase im Februar 2027.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fakultät</span>
              <strong className="text-xl font-extrabold text-shiraz block mt-1">Architektur &amp; Bauwesen</strong>
              <p className="text-xs text-slate-500 mt-2">
                Technische Hochschule Augsburg (THA) • Studiengänge Bachelor &amp; Master Bauingenieurwesen.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Lehrmodule</span>
              <strong className="text-xl font-extrabold text-slate-900 block mt-1">5 Vorlesungsfächer</strong>
              <p className="text-xs text-slate-500 mt-2">
                Bauen im Bestand, Nachhaltigkeit, Bauschäden, Baustoffkunde &amp; Instandhaltung.
              </p>
            </div>
          </div>

          {/* Module Cards Grid */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main mb-4 flex items-center gap-2">
              <BookOpen className="text-shiraz" size={20} /> Die Vorlesungsmodule im Überblick
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: 'bauen_im_bestand' as VorlesungTab,
                  title: 'Bauen im Bestand',
                  ects: '5 ECTS',
                  sws: '1/2 SWS',
                  icon: Building2,
                  desc: 'Bauaufnahme, historische Baustoffe, Genauigkeitsstufen nach Koldewey, DBV-Merkblatt und EN 1990-2:2026.',
                  targetTab: 'bestand'
                },
                {
                  id: 'nachhaltiges_bauen' as VorlesungTab,
                  title: 'Nachhaltiges Bauen',
                  ects: '5 ECTS',
                  sws: '2 SWS',
                  icon: Leaf,
                  desc: 'Ökobilanzierung (LCA), UN-SDGs, EU-Taxonomie, EPBD 2024/1275, Stoffströme, EPD und Digitaler Produktpass.',
                  targetTab: 'nachhaltigkeit_daten_regeln'
                },
                {
                  id: 'bauschaeden' as VorlesungTab,
                  title: 'Bauschäden',
                  ects: '5 ECTS',
                  sws: '1/2 SWS',
                  icon: AlertTriangle,
                  desc: 'Bauschadensanalyse, Ursache-Wirkung-Kausalketten, Rissdiagnose, Baugrund- und Feuchteschäden.',
                  targetTab: 'bauschaeden'
                },
                {
                  id: 'baustoffkunde' as VorlesungTab,
                  title: 'Baustoffkunde',
                  ects: '6 ECTS',
                  sws: '2-4 SWS',
                  icon: Layers,
                  desc: 'Grundlagen mineralischer, metallischer und organischer Baustoffe, Bauchemie, Bindemittel und Laborversuche.',
                  targetTab: 'baustoffe'
                },
                {
                  id: 'instandhaltung' as VorlesungTab,
                  title: 'Instandhaltung',
                  ects: '5 ECTS',
                  sws: '4 SWS',
                  icon: Wrench,
                  desc: 'Schutz und Instandsetzung von Stahlbeton, WTA-Richtlinien, Betoninstandhaltungsrichtlinie und Monitoring.',
                  targetTab: 'instandhaltung'
                }
              ].map((mod) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.id}
                    className="p-5 rounded-xl border border-home-grau/30 bg-slate-50/50 hover:bg-slate-50 hover:border-shiraz/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center font-bold">
                          <Icon size={18} />
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                          <span className="px-2 py-0.5 rounded bg-white border border-slate-200">{mod.ects}</span>
                          <span className="px-2 py-0.5 rounded bg-white border border-slate-200">{mod.sws}</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{mod.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{mod.desc}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => setActiveSubTab(mod.id)}
                        className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-shiraz text-white hover:bg-shiraz/90 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Vorlesungsbereich öffnen <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 1: VORLESUNG BAUEN IM BESTAND                                     */}
      {/* ===================================================================== */}
      {activeSubTab === 'bauen_im_bestand' && (
        <LectureModuleView
          lectureId="bauen_im_bestand"
          title="Vorlesung: Bauen im Bestand"
          subtitle="Bestandserfassung, historische Werkstoffe, ZfP-Diagnostik und probabilistische Nachrechnung (EN 1990-2:2026)"
          icon={Building2}
          modulDetails={{
            sws: '1/2',
            ects: 5,
            semester: 'Wintersemester',
            pruefung: 'Schriftliche Klausur (90 min)',
            dozent: 'Professur für Bauwerkserhaltung & Tragwerksdiagnose'
          }}
          relatedBoardTab="bestand"
          relatedBoardTabLabel="Zum Fachmodul Bauen im Bestand (Altbauatlas & Kennwerte)"
          units={[
            { nr: 1, title: 'Einführung & baupolitischer Rahmen', topic: 'Graue Energie, Adaptive Reuse, Paradigmenwechsel vom Entwerfen zum Diagnostizieren' },
            { nr: 2, title: 'Bauaufnahme & Archivrecherche', topic: 'Koldewey-Genauigkeitsstufen 1–4, Imperfektionen und Theorie II. Ordnung, Dendrochronologie' },
            { nr: 3, title: 'Schadenskartierung & Kausalkette', topic: 'Systematische Schadensanalyse, Trennung konstruktiver und hygrothermischer Schadensursachen' },
            { nr: 4, title: 'Zerstörungsfreie Prüfung (ZfP)', topic: 'Radar, Ultraschall-Echo, Impact-Echo und magnetische Bewehrungsortung' },
            { nr: 5, title: 'Holzdiagnostik & Bohrwiderstandsmessung', topic: 'Resistograph (1,5–3 mm Nadel, Vorschub bis 1500 mm/min), Jahrringkurven, Restquerschnitt' },
            { nr: 6, title: 'Mauerwerksdiagnose & Flachpressenversuche', topic: 'Single Flat-Jack (in-situ Normalspannung) und Double Flat-Jack (E-Modul und Druckfestigkeit)' },
            { nr: 7, title: 'Hygrophysikalische Diagnose', topic: 'Karstensches Prüfrohr (10 cm Wassersäule / 1000 Pa), 3D-Transport, Pleyers-Röhrchen' },
            { nr: 8, title: 'Historische Mauerwerksbaustoffe', topic: 'DIN 105 Historie, 1957 Farbkennzeichnung (grüner Balken 150 vs. weißer Balken 250 Hartbrandziegel)' },
            { nr: 9, title: 'Historische Betonstähle', topic: 'BSt 22/34 (glatt, Hakenpflicht), BSt 34/50 (Profilstahl), BSt 42/50 Torstahl (R. Schmidt 1936, Kaltverdrillung)' },
            { nr: 10, title: 'Historische Eisenwerkstoffe', topic: 'Gusseisen (reduzierter E-Modul 80–140 GPa, Knicken), Puddelstahl (Anisotropie), Flussstahl St 37' },
            { nr: 11, title: 'Bauordnungsrecht & Bestandsschutz', topic: 'Rechtmäßige Errichtung, Erlöschensgründe, WTA-Merkblätter (Referate 1–11)' },
            { nr: 12, title: 'Statische Nachweise im Bestand', topic: 'Grenzen des semiprobabilistischen Konzepts (β = 3,8), rechnerische Bestrafung im Bestand' },
            { nr: 13, title: 'DBV-Merkblatt Modifizierte Teilsicherheitsbeiwerte', topic: 'Abminderung von γ_c auf 1,30 und γ_G auf 1,20 bei duktilem Biegezugversagen' },
            { nr: 14, title: 'Eurocode EN 1990-2:2026 & Bayes\'sches Updating', topic: 'Preliminary vs. Detailed Assessment, Formel f_yd = f_ym · exp(-α_R β V_f - 0,5 V_f²)' }
          ]}
        />
      )}

      {/* ===================================================================== */}
      {/* TAB 2: VORLESUNG NACHHALTIGES BAUEN                                   */}
      {/* ===================================================================== */}
      {activeSubTab === 'nachhaltiges_bauen' && (
        <LectureModuleView
          lectureId="nachhaltiges_bauen"
          title="Vorlesung: Nachhaltiges Bauen"
          subtitle="Ökobilanzierung (LCA), UN-SDGs, EU-Taxonomie, EPBD 2024/1275, Zirkuläre Stoffströme & Digitaler Produktpass"
          icon={Leaf}
          modulDetails={{
            sws: 2,
            ects: 5,
            semester: 'Wintersemester',
            pruefung: 'Projektarbeit mit Präsentation & Kolloquium',
            dozent: 'Professur für Nachhaltiges Bauen & Bauphysik'
          }}
          relatedBoardTab="nachhaltigkeit_daten_regeln"
          relatedBoardTabLabel="Zum Fachmodul Nachhaltigkeit: Daten & Regeln"
          units={[
            { nr: 1, title: 'Globale Umweltkennzahlen des Bauens', topic: 'THG-Emissionen (~40 %), Rohstoffabbau (>50 %), deutsches Bauabfallaufkommen (220–230 Mio. t)' },
            { nr: 2, title: 'Internationale Klimapolitik & Konferenzen', topic: 'UN-Klimakonferenzen (Kyoto, Paris 1,5°C-Ziel, COP 28 Dubai), European Green Deal' },
            { nr: 3, title: 'Die 17 UN-SDGs im Bauingenieurwesen', topic: 'SDG 11 (Städte), SDG 12 (Kreislauf), SDG 13 (Klimaschutz), SDG 9 (Innovation)' },
            { nr: 4, title: 'EU-Taxonomie-Verordnung (EU 2020/852)', topic: '6 Umweltziele, DNSH-Prinzip (Do No Significant Harm), Substantial Contribution, CapEx/OpEx' },
            { nr: 5, title: 'EU-Gebäuderichtlinie (EPBD 2024/1275)', topic: 'Stufenplan 2028/2030, Nullemissionsgebäude (ZEB), Whole-Life Carbon Pflicht' },
            { nr: 6, title: 'Ökobilanzierung (LCA) nach DIN EN 15978', topic: 'Lebenszyklusphasen A1–A3, A4–A5, B1–B7, C1–C4, Modul D, funktionelle Einheit' },
            { nr: 7, title: 'Wirkungsindikatoren & Treibhauspotenzial', topic: 'GWP-total, GWP-fossil, GWP-biogenic, GWP-luluc, Primärenergie PE-gesamt' },
            { nr: 8, title: 'Umweltproduktdeklarationen (EPD)', topic: 'DIN EN 15804+A2, Typ-III-Deklarationen, generische (ÖKOBAUDAT) vs. spezifische EPDs (IBU)' },
            { nr: 9, title: 'Digitaler Produktpass (DPP) & Materialpässe', topic: 'EU-Ökodesign ESPR, novellierte BauPVO (CPR), Madaster Circularity Index (CI)' },
            { nr: 10, title: 'Design for Disassembly & Zirkuläres Konstruieren', topic: 'Trennungsverbindungen, Kaskadennutzung, Urban Mining und Rezyklat-Betone' },
            { nr: 11, title: 'Ersatzbaustoffverordnung (EBV) & KrWG', topic: 'Qualitätsklassen RC-1 bis RC-3, Bodenmaterial BM-0 bis BM-F3, Katasterpflicht ab 250 m³' },
            { nr: 12, title: 'Suffizienz & Gebäudetyp E (§ 650o BGB)', topic: 'Einfaches Bauen, rechtlich belastbare Abweichung von DIN-Komfortnormen' },
            { nr: 13, title: 'Zertifizierungssysteme (DGNB / BNB / LEED / QNG)', topic: 'Kriterienmatrizen, Lebenszykluskosten LCC, KFN-Förderung des Bundes' },
            { nr: 14, title: 'CRREM Decarbonization Pathway', topic: '1,5°C-Pfad für Bestandsgebäude, Stranded Assets Risiko und Brown Discount' }
          ]}
        />
      )}

      {/* ===================================================================== */}
      {/* TAB 3: VORLESUNG BAUSCHÄDEN                                           */}
      {/* ===================================================================== */}
      {activeSubTab === 'bauschaeden' && (
        <LectureModuleView
          lectureId="bauschaeden"
          title="Vorlesung: Bauschäden & Schadensanalyse"
          subtitle="Forensische Bauschadensbegutachtung, Ursachenforschung, Rissmechanik und Baugrundschäden"
          icon={AlertTriangle}
          modulDetails={{
            sws: '1/2',
            ects: 5,
            semester: 'Wintersemester',
            pruefung: 'Klausur (90 min) & Schadensgutachten-Hausarbeit',
            dozent: 'Professur für Bauschäden, Bauwerkserhaltung & Baustoffprüfung'
          }}
          relatedBoardTab="bauschaeden"
          relatedBoardTabLabel="Zum Fachmodul Bauschäden & Zustandsbewertung"
          units={[
            { nr: 1, title: 'Einführung in das Bausachverständigenwesen', topic: 'Mangel vs. Schaden (§ 633 BGB), anerkannte Regeln der Technik (a.R.d.T.), Gutachtenaufbau' },
            { nr: 2, title: 'Methodik der Schadensdokumentation', topic: 'Kausalkette Ursache–Wirkung, Schadenskartierung, Probenahmepläne und Messraster' },
            { nr: 3, title: 'Rissursachen & Rissmechanik im Massivbau', topic: 'Frühschwinden, Hydratationswärme, Zwangsspannungen, Biege- und Querkraftrisse' },
            { nr: 4, title: 'Feuchteschäden & Bauwerksabdichtung', topic: 'Aufsteigende Feuchte, drückendes Grundwasser, Schlagregen, Kondensation, Schimmelpilze' },
            { nr: 5, title: 'Baugrund- und Gründungsbedingte Schäden', topic: 'Ungleichförmige Setzungen, Grundbruch, Schrumpfung bindiger Böden, Setzungsrisse' },
            { nr: 6, title: 'Schäden an Mauerwerksbauten', topic: 'Fehlender Mauerwerksverband, Überbindemaße, Schalensturz-Probleme, Frostabsprengungen' },
            { nr: 7, title: 'Schäden an Holztragwerken', topic: 'Echter Hausschwamm (Serpula lacrymans), Nassfäule, Nagekäfer, Hausbock, Feuchtestau' },
            { nr: 8, title: 'Schadensreaktionen im Beton', topic: 'Alkali-Kieselsäure-Reaktion (AKR), Ettringittreiben, Frost-Tausalz-Angriff, Treibmineralien' },
            { nr: 9, title: 'Bewehrungskorrosion & Lochfraß', topic: 'Karbonatisierung des Betons, chloridinduzierter Lochfraß, Potentialfeldmessung' },
            { nr: 10, title: 'Fassaden-, Putz- und WDVS-Schäden', topic: 'Haftzugversagen, Dübelabzeichnungen, Veralgung, Abriss an Anschlüssen, Brandrisiken' },
            { nr: 11, title: 'Flachdach- und Dachschäden', topic: 'Dampfsperrenversagen, stehendes Wasser, UV-Degradation von Bitumen- und Kunststoffbahnen' },
            { nr: 12, title: 'Zustandsbewertung nach VDI 6200', topic: 'Schadensklassen, Überwachungsstufen (Begehung, Inspektion, eingehende Überprüfung)' },
            { nr: 13, title: 'Historische Großschäden & Einstürze', topic: 'Bad Reichenhall (Leimholzversagen), Kongresshalle Berlin (Spannungsrisskorrosion)' },
            { nr: 14, title: 'Forensische Messtechnik & Messtechnik-Praxis', topic: 'Rissmonitoring (Rissmessklemmen, Schallemission), Schiedsgutachten und Beweissicherung' }
          ]}
        />
      )}

      {/* ===================================================================== */}
      {/* TAB 4: VORLESUNG BAUSTOFFKUNDE                                        */}
      {/* ===================================================================== */}
      {activeSubTab === 'baustoffkunde' && (
        <LectureModuleView
          lectureId="baustoffkunde"
          title="Vorlesung: Baustoffkunde"
          subtitle="Chemisch-physikalische Grundlagen mineralischer, metallischer und organischer Baustoffe"
          icon={Layers}
          modulDetails={{
            sws: '2-4',
            ects: 6,
            semester: 'Wintersemester',
            pruefung: 'Klausur (120 min) & Laborpraktikum mit Protokollabnahme',
            dozent: 'Professur für Baustoffkunde & Bauchemie'
          }}
          relatedBoardTab="baustoffkunde"
          relatedBoardTabLabel="Zum Fachmodul Baustoffe & Bauprodukte"
          units={[
            { nr: 1, title: 'Einführung & Kenngrößen der Baustoffe', topic: 'Rohdichte, Reindichte, Porosität, Wasseraufnahme, Festigkeitsdefinitionen' },
            { nr: 2, title: 'Physikalisch-chemische Bindungsarten', topic: 'Atom- und Molekülbindungen, Kristallgitter, amorphe Gefüge, Phasendiagramme' },
            { nr: 3, title: 'Mineralische Bindemittel: Baukalk & Gips', topic: 'Kalkkreislauf (Brennen, Löschen, Erhärten), Luftkalke, hydraulische Kalke, Calciumsulfatphasen' },
            { nr: 4, title: 'Zementchemie & Zementherstellung', topic: 'Klinkerbrennen, Klinkerphasen C3S, C2S, C3A, C4AF, Zementarten nach DIN EN 197-1' },
            { nr: 5, title: 'Hydratation des Zements', topic: 'CSH-Phasenbildung, Portlandit, Wärmeentwicklung, Porenstruktur des Zementsteins' },
            { nr: 6, title: 'Gesteinskörnungen für Mörtel & Beton', topic: 'DIN EN 12620, Sieblinien (A/B/C-Kurven nach DIN 1045-2), Kornform, Schüttdichte, Feinanteile' },
            { nr: 7, title: 'Betonchemie & Zusatzmittel', topic: 'Fließmittel (PCE), Luftporenbildner, Verzögerer, Beschleuniger, Zusatzstoffe (Flugasche, Silikastaub)' },
            { nr: 8, title: 'Frisch- & Festbetoneigenschaften', topic: 'Konsistenzprüfungen, w/z-Wert-Gesetz nach Walz, Druckfestigkeitsklassen C, E-Modul' },
            { nr: 9, title: 'Künstliche & natürliche Steine', topic: 'Ziegel, Kalksandstein, Porenbeton, magmatische, metamorphe und sedimentäre Natursteine' },
            { nr: 10, title: 'Eisen- und Stahlwerkstoffe', topic: 'Eisen-Kohlenstoff-Diagramm (EKD), Gefügearten (Ferrit, Perlit, Austenit, Martensit), Baustähle' },
            { nr: 11, title: 'Nichteisenmetalle & Metallkorrosion', topic: 'Aluminium, Kupfer, Zink, elektrochemische Spannungsreihe, Kontaktkorrosion' },
            { nr: 12, title: 'Holz als biologischer Werkstoff', topic: 'Aufbau des Holzes, Früh-/Spätholz, Feuchtegehalt, Fasersättigung, Schwinden und Quellen' },
            { nr: 13, title: 'Kunststoffe & Bitumen im Bauwesen', topic: 'Thermoplaste, Duroplaste, Elastomere, Dämmstoffe (EPS, XPS, Mineralwolle), Bitumenprüfungen' },
            { nr: 14, title: 'Zukunftswerkstoffe & Recycling', topic: 'Geopolymere, Carbonbeton, Lehmbaustoffe nach DIN 18940, Rezyklat-Gesteinskörnungen' }
          ]}
        />
      )}

      {/* ===================================================================== */}
      {/* TAB 5: VORLESUNG INSTANDHALTUNG                                       */}
      {/* ===================================================================== */}
      {activeSubTab === 'instandhaltung' && (
        <LectureModuleView
          lectureId="instandhaltung"
          title="Vorlesung: Instandhaltung von Bauwerken"
          subtitle="Bauwerkserhaltung, Schutz- und Instandsetzungsprinzipien nach DIN EN 1504, RL SIB & WTA"
          icon={Wrench}
          modulDetails={{
            sws: 4,
            ects: 5,
            semester: 'Wintersemester',
            pruefung: 'Klausur (90 min) & Instandsetzungskonzept-Übungsnachweis',
            dozent: 'Professur für Bautenschutz, Instandhaltung & Betoninstandsetzung'
          }}
          relatedBoardTab="instandhaltung"
          relatedBoardTabLabel="Zum Fachmodul Schutz & Instandsetzung"
          units={[
            { nr: 1, title: 'Grundlagen der Bauwerksinstandhaltung', topic: 'Begriffe nach DIN 31051: Wartung, Inspektion, Instandsetzung, Verbesserung, Lebenszyklus' },
            { nr: 2, title: 'Regelwerke der Betoninstandhaltung', topic: 'DIN EN 1504 Teile 1–10, DAfStb-Richtlinie Schutz und Instandsetzung (RL SIB), TR Instandhaltung DIBt' },
            { nr: 3, title: 'Zustandsanalyse & Instandsetzungskonzept', topic: 'Befundung, Schadensursachen, statische Relevanz, Instandhaltungsziel und Restnutzungsdauer' },
            { nr: 4, title: 'Schutzprinzipien der DIN EN 1504-9', topic: 'Prinzipien 1–11: Oberflächenschutz, Feuchtesteuerung, Betonersatz, Tragwerksverstärkung' },
            { nr: 5, title: 'Untergrundvorbereitung für Instandsetzungen', topic: 'Höchstdruckwasserstrahlen (HDW), Kugelstrahlen, Fräsen, Abreißfestigkeit des Betonuntergrunds' },
            { nr: 6, title: 'Betonersatzsysteme (Mörtel & Betone)', topic: 'PCC (Polymer-Zement-Beton), SPCC (Spritzmörtel), ECC (Epoxidharzmörtel), Schwindkompensation' },
            { nr: 7, title: 'Oberflächenschutzsysteme (OS 1 bis OS 11)', topic: 'Hydrophobierung (OS 1), Imprägnierung (OS 2), rissüberbrückende Beschichtungen (OS 4, OS 5, OS 8, OS 11)' },
            { nr: 8, title: 'Rissinstandsetzung im Betonbau', topic: 'Rissfüllstoffe: Epoxidharz (kraftschlüssig), Polyurethanharz (abdichtend elastisch), Zementsuspension' },
            { nr: 9, title: 'Korrosionsschutz der Bewehrung', topic: 'Realkalisierung, kathodischer Korrosionsschutz (KKS) nach DIN EN ISO 12696, Opferanoden' },
            { nr: 10, title: 'Nachträgliche Tragwerksverstärkung', topic: 'CFK-Lamellen (aufgeklebte Kohlenstofffaserverbundwerkstoffe), Spritzbetonverstärkung, Zusatzbewehrung' },
            { nr: 11, title: 'Instandsetzung von Mauerwerk & Fugen', topic: 'WTA-Merkblätter Mauerwerksinjektion, Spiralanker, Entsalzungskompressen, Sanierputzsysteme' },
            { nr: 12, title: 'Instandhaltung von Holz- und Fachwerkkonstruktionen', topic: 'Zimmermannsmäßige Holzverbindungen, Anblattungen, Epoxidharz-Holzergänzung, Holzschutz nach WTA' },
            { nr: 13, title: 'Qualitätssicherung & Eigenüberwachung', topic: 'SIVV-Schein-Voraussetzungen, Baustellenprüfungen, Haftzugprüfungen, Schichtdickenmessungen' },
            { nr: 14, title: 'Bauwerksmonitoring (SHM) & Langzeitwartung', topic: 'Dauerüberwachung mit Sensorik, Korrosionssensoren, Faseroptik, Instandhaltungsmanagement' }
          ]}
        />
      )}

      {/* Standardized ModuleFooter according to Styleguide */}
      <ModuleFooter
        wikipedia={[
          { title: 'Bauingenieurwesen Studium', url: 'https://de.wikipedia.org/wiki/Bauingenieurwesen' },
          { title: 'Bauen im Bestand', url: 'https://de.wikipedia.org/wiki/Bauen_im_Bestand' },
          { title: 'Nachhaltiges Bauen', url: 'https://de.wikipedia.org/wiki/Nachhaltiges_Bauen' },
          { title: 'Bauschaden', url: 'https://de.wikipedia.org/wiki/Bauschaden' },
          { title: 'Instandhaltung', url: 'https://de.wikipedia.org/wiki/Instandhaltung' }
        ]}
        literatur={[
          'Modulhandbuch Bachelor Bauingenieurwesen (Fakultät für Architektur und Bauwesen, THA)',
          'Modulhandbuch Master Bauingenieurwesen (Fakultät für Architektur und Bauwesen, THA)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde (Springer Vieweg)',
          'Holschemacher, K.: Entwurfs- und Berechnungshilfen für Bauingenieure (Ernst & Sohn)'
        ]}
        regelwerke={[
          { title: 'Rahmenprüfungsordnung der Technischen Hochschule Augsburg (THA)', url: 'https://www.tha.de/' },
          { title: 'DIN EN 1990: Eurocode - Grundlagen der Tragwerksplanung', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1990' },
          { title: 'EN 1990-2:2026: Eurocode - Bewertung bestehender Tragwerke', url: 'https://www.dinmedia.de/de/suche?q=EN+1990-2' }
        ]}
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
            className="self-start sm:self-center py-2 px-4 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-shiraz transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
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
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Lehrstuhl / Dozentur</span>
            <strong className="text-xs font-bold text-slate-900 mt-0.5 block truncate" title={modulDetails.dozent}>
              {modulDetails.dozent}
            </strong>
          </div>
        </div>
      </div>

      {/* Live Audience Response Poll (Kick-Off / 1. Vorlesungsstunde) */}
      <LecturePollSession lectureId={lectureId} lectureTitle={title} />

      {/* Materials & Download Placeholder Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Download className="text-shiraz" size={18} /> Vorlesungsunterlagen, Skripte &amp; Downloads
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Begleitmaterialien für immatrikulierte Studierende des Semesters.
            </p>
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
              <strong className="text-xs font-bold text-slate-900 block">Vollständiges Vorlesungsskript</strong>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Umfassendes Lehrskript mit Theoriekapiteln, Abbildungen, Quellennachweisen und Formelsammlung.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">In Vorbereitung</span>
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
              <strong className="text-xs font-bold text-slate-900 block">Vorlesungsfoliensatz (Kapitel 1–14)</strong>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Präsentationsfolien der Vorlesung mit Merksätzen, Bildbeispielen und Praxisexkursen.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">In Vorbereitung</span>
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
              <strong className="text-xs font-bold text-slate-900 block">Übungsaufgaben &amp; Klausurhinweise</strong>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Semesterbegleitende Rechen- und Verständnisübungen mit Musterlösungen zur Klausurvorbereitung.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">In Vorbereitung</span>
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
              <Calendar className="text-shiraz" size={18} /> Vorlesungsgliederung &amp; Semesterplan (14 Lehreinheiten)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Thematische Übersicht aller 14 Termine des Semesters mit Kerninhalten und Lernzielen.
            </p>
          </div>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Vorlesungsthema suchen..."
              value={unitSearch}
              onChange={(e) => setUnitSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-shiraz"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredUnits.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              Keine Vorlesungseinheiten für den Suchbegriff gefunden.
            </div>
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
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    In Vorbereitung
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
