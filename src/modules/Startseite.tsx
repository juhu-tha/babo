import React from 'react';
import { 
  AlertTriangle, 
  GraduationCap, 
  BookOpen, 
  Lightbulb, 
  ArrowRight, 
  Info, 
  ShieldAlert,
  Clock,
  Tag,
  Landmark
} from 'lucide-react';
import { useTabContext } from '../contexts/TabContext';
import { useLanguage } from '../contexts/LanguageContext';
import { APP_VERSION, STAND_DE } from '../data/stand';
import { META_CLUSTERS } from '../data/metaClusters';
import { NAV_TAB_GRUPPEN, MODUL_KERN } from '../registry/kern';
import type { ModulId } from '../registry/modules';

export default function Startseite() {
  const { setActiveTab } = useTabContext();
  const { language } = useLanguage();
  const zuletzt: string[] = (() => {
    try { return (JSON.parse(localStorage.getItem('baustoffboard_recent') || '[]') as string[]).filter(id => id !== 'start' && MODUL_KERN.has(id)).slice(0, 4); } catch { return []; }
  })();
  // Einstieg je Cluster: erstes Modul der ersten Gruppe (meist „Modulinfos“), Phase 2 AP 2.10
  const einstieg = (gruppen: string[]): ModulId | undefined => NAV_TAB_GRUPPEN.find(g => gruppen.includes(g.name))?.tabs[0]?.id;

  return (
    <div className="flex flex-col gap-8 w-full mt-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-home-grau/30 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-shiraz/10 rounded-full flex items-center justify-center mb-4">
          <GraduationCap size={40} className="text-shiraz" />
        </div>

        <h2 className="text-3xl font-bold text-text-main mb-4">
          {language === 'en' ? 'Welcome to BaustoffBoard' : 'Willkommen im BaustoffBoard'}
        </h2>
        <p className="text-lg text-text-main/80 mb-6 max-w-2xl">
          {language === 'en' 
            ? 'Interactive learning and knowledge platform for building materials, mechanics, existing structures, circular economy, sustainable construction & more.' 
            : 'Interaktive Lern- und Wissensplattform für Baustoffkunde, Werkstoffmechanik, Bauen im Bestand, Kreislaufwirtschaft, Nachhaltiges Bauen & Co.'}
          <br /><span className="text-sm font-bold">Prof. Dr.-Ing. Jürgen Huber - TH Augsburg</span>
          <br /><span className="text-xs text-text-main/50 block mt-1 italic">"Chabos wissen was das BaBo ist"</span>
        </p>

        {/* Versionsanzeige mit Verlinkung zum Changelog - unterhalb von Chabos platziert */}
        <div className="mb-8">
          <button
            onClick={() => setActiveTab('versionen')}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500 hover:text-shiraz transition-colors cursor-pointer"
            title="Zum Changelog & zur Revisionshistorie"
          >
            <Tag size={13} className="text-slate-400" />
            <span>Version {APP_VERSION} ({STAND_DE})</span>
          </button>
        </div>
        
        {/* Einstieg in die Themen (Phase 2, AP 2.10) */}
        <section aria-labelledby="einstieg-titel" className="w-full text-left mb-8">
          <h3 id="einstieg-titel" className="text-lg font-bold text-text-main mb-3">{language === 'en' ? 'Start with a topic' : 'Einstieg nach Themen'}</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="list">
            {META_CLUSTERS.map(c => {
              const ziel = einstieg(c.groupNames);
              const Icon = c.icon;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    disabled={!ziel}
                    onClick={() => ziel && setActiveTab(ziel)}
                    className="w-full h-full text-left p-4 rounded-xl border border-home-grau/30 bg-off-white hover:border-shiraz hover:bg-shiraz/5 transition-colors flex gap-3 items-start"
                  >
                    <span className="p-2 rounded-lg bg-white border border-home-grau/20 shrink-0"><Icon size={18} className="text-shiraz" aria-hidden="true" /></span>
                    <span>
                      <span className="block font-bold text-text-main">{c.number}: {c.name}</span>
                      <span className="block text-sm text-text-main/75 mt-0.5">{c.shortDesc}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {/* Lernpfade nur, solange die Gruppe aktiv ist (INAKTIVE_GRUPPEN in src/registry/modules.ts) */}
          {MODUL_KERN.has('lehrveranstaltungen') && (
          <p className="mt-3 text-sm text-text-main/80">
            {language === 'en' ? 'Following a course? ' : 'Sie besuchen eine Lehrveranstaltung? '}
            <button type="button" onClick={() => setActiveTab('lehrveranstaltungen')} className="font-bold text-shiraz underline underline-offset-2 hover:text-shiraz/80">
              {language === 'en' ? 'Learning paths by course' : 'Lernpfade nach Lehrveranstaltung'}
            </button>
          </p>
          )}
          {zuletzt.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-bold text-text-main mb-2">{language === 'en' ? 'Recently visited' : 'Zuletzt besucht'}</h4>
              <div className="flex flex-wrap gap-2">
                {zuletzt.map(id => (
                  <button key={id} type="button" onClick={() => setActiveTab(id as ModulId)} className="px-3 py-1.5 rounded-lg border border-home-grau/30 bg-white text-sm text-text-main hover:border-shiraz hover:text-shiraz">
                    {MODUL_KERN.get(id)?.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="flex flex-col gap-6 w-full">
          <div className="bg-shiraz/5 border border-shiraz/20 p-6 rounded-xl text-left">
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-shiraz shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-bold text-shiraz mb-2">Hinweise zur Nutzung</h3>
                <p className="text-text-main/80 leading-relaxed">
                  Das BaustoffBoard dient <span className="underline">ausschließlich zu Lehr- und Übungszwecken</span>. Deshalb können hier Vereinfachungen getroffen worden sein, die nicht vollumfänglich Normanforderungen und der Realität entsprechen. Das BaustoffBoard ist <strong>kein</strong> Ersatz für Lehrveranstaltungen, Lehrbücher oder Normen! - es wird <span className="underline">keinerlei Haftung</span> für Ergebnisse übernommen!{' '}
                  <button
                    onClick={() => {
                      const el = document.getElementById('engineering-disclaimer');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center justify-center p-1 rounded-md text-shiraz hover:bg-shiraz/10 transition-all align-middle cursor-pointer -mt-0.5"
                    title="Zum Haftungsausschluss (Engineering Disclaimer)"
                    aria-label="Zum Haftungsausschluss (Engineering Disclaimer)"
                  >
                    <ArrowRight size={16} className="transition-transform hover:translate-x-0.5" />
                  </button>
                  <br /><br />
                  Das Dashboard wird kontinuierlich erweitert und verbessert - und erhebt keinen Anspruch auf Vollständigkeit!<br />
                  <span>Bitte Fehler sowie Verbesserungsvorschläge bei Prof. Huber melden – vielen Dank!</span>{' '}
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className="inline-flex items-center justify-center p-1 rounded-md text-shiraz hover:bg-shiraz/10 transition-all align-middle cursor-pointer -mt-0.5"
                    title="Zum Feedback- & Fehlermelde-Modul"
                    aria-label="Zum Feedback- & Fehlermelde-Modul"
                  >
                    <ArrowRight size={16} className="transition-transform hover:translate-x-0.5" />
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-home-grau/5 border border-home-grau/20 p-6 rounded-xl text-left">
            <div className="flex items-start gap-4">
              <Info className="text-home-grau shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-bold text-text-main mb-2">Datenschutz &amp; Speicherung</h3>
                <p className="text-text-main/80 leading-relaxed">
                  Ergebnisse können modular via &quot;PDF Export&quot; und CSV-Tabellen exportiert werden. Eingaben bleiben in Ihrem Browser (localStorage) und werden nicht an uns übertragen. Hinweise zum Hosting siehe <button onClick={() => setActiveTab('datenschutz')} className="text-shiraz font-bold hover:underline inline-flex items-center">Datenschutz</button>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-800 flex items-start gap-4">
          <div className="p-3 bg-off-white dark:bg-slate-800 rounded-lg text-home-grau dark:text-slate-400">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold text-text-main dark:text-slate-100 mb-2">Interaktives Lernen</h3>
            <p className="text-sm text-text-main/70 dark:text-slate-400">Nutzen Sie die Module im Menü oben, um Materialverhalten interaktiv zu simulieren und zu verstehen.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-800 flex items-start gap-4">
          <div className="p-3 bg-off-white dark:bg-slate-800 rounded-lg text-home-grau dark:text-slate-400">
            <Lightbulb size={24} />
          </div>
          <div>
            <h3 className="font-bold text-text-main dark:text-slate-100 mb-2">Theorie & Praxis</h3>
            <p className="text-sm text-text-main/70 dark:text-slate-400">Jedes Modul enthält Erklärungen für Studierende sowie Verweise auf die relevanten Normen und Regelwerke.</p>
          </div>
        </div>
        <div 
          onClick={() => setActiveTab('anleitung')}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-800 hover:border-shiraz/40 transition-all cursor-pointer flex items-start gap-4 group"
        >
          <div className="p-3 bg-shiraz/10 rounded-lg text-shiraz group-hover:bg-shiraz group-hover:text-white transition-colors">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-text-main dark:text-slate-100 group-hover:text-shiraz transition-colors">
                Kompakte &amp; aktuelle Informationsquelle
              </h3>
            </div>
            <p className="text-sm text-text-main/70 dark:text-slate-400">
              Kompakte und aktuelle Informationsquelle zu baustoffkundlichen Themen, Bauteilen und bauchemischen Grundlagen nach neuester Normengeneration.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-home-grau/5 dark:bg-slate-900/40 border border-home-grau/20 dark:border-slate-800 p-6 rounded-xl text-left">
        <div className="flex items-start gap-4">
          <ShieldAlert className="text-home-grau dark:text-slate-400 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-bold text-text-main dark:text-slate-100 mb-2">Projektabgrenzung</h3>
            <p className="text-text-main/80 dark:text-slate-300 leading-relaxed font-medium">
              "Dies ist ein reines 'Nebenbei'-Projekt und wurde/wird ohne jegliche Bereitstellung von Förder- oder Industriemitteln erstellt."
            </p>
          </div>
        </div>
      </div>

      {/* Wichtiger Hinweis zur Haftung (Engineering Disclaimer) */}
      <div id="engineering-disclaimer" className="p-5 bg-amber-50/70 border border-amber-200/90 rounded-2xl space-y-2 text-left shadow-xs scroll-mt-8">
        <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2">
          <ShieldAlert size={18} className="text-amber-700 shrink-0" />
          Wichtiger Hinweis zur Haftung (Engineering Disclaimer)
        </h4>
        <p className="text-xs text-amber-950 leading-relaxed font-medium">
          &bdquo;Wichtiger Hinweis zur Haftung: Alle auf dem BaustoffBoard bereitgestellten Informationen, Richtwerte, Datenbanken, Checklisten und interaktiven Berechnungsmodule (insb. zu Tragwerksplanung, Betontechnologie, Bauphysik, Chloriddiffusion und Instandsetzung) dienen ausschließlich akademischen Lehr-, Forschungs- und unverbindlichen Vorbemessungszwecken. Sie ersetzen in keinem Fall eine projektbezogene Baugrund-, Baustoff- oder Schadstoffuntersuchung, eine bauaufsichtlich geprüfte statische Berechnung, einen bauphysikalischen Nachweis oder eine Fachplanung durch einen Sachkundigen Planer (SKP) im Sinne der jeweiligen Landesbauordnung (BayBO / MBO) und der Technischen Baubestimmungen (MVV TB). Jegliche Haftung für unmittelbare oder mittelbare Schäden aus der Anwendung der Tools im Bau- oder Planungsbetrieb ist ausgeschlossen.&ldquo;
        </p>
      </div>

      <div className="mt-8 text-sm text-text-main/60 flex flex-col items-center gap-1.5">
        <p>&copy; Prof. Huber / THA</p>
        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1">
          <button
            onClick={() => setActiveTab('versionen')}
            className="text-xs text-text-main/50 hover:text-shiraz hover:underline inline-flex items-center gap-1.5 font-mono cursor-pointer transition-colors"
            title="Changelog & Revisionshistorie öffnen"
          >
            <Clock size={12} />
            <span>BaustoffBoard {APP_VERSION} • Stand: {STAND_DE}</span>
          </button>
          <span className="text-text-main/30">•</span>
          <button
            onClick={() => setActiveTab('admin')}
            className="text-xs text-text-main/60 hover:text-shiraz hover:underline inline-flex items-center gap-1.5 font-semibold cursor-pointer transition-colors"
            title="Admin-Bereich öffnen (Anmeldung für Dozierende)"
          >
            <ShieldAlert size={12} className="text-shiraz" />
            <span>Admin-Bereich</span>
          </button>
          <span className="text-text-main/30" aria-hidden="true">•</span>
          <button
            type="button"
            onClick={() => setActiveTab('forschung_transfer')}
            className="text-xs text-text-main/70 hover:text-shiraz hover:underline inline-flex items-center gap-1.5 font-semibold cursor-pointer transition-colors"
          >
            <Landmark size={12} className="text-shiraz" aria-hidden="true" />
            <span>Forschung und Transfer</span>
          </button>
        </div>
      </div>
    </div>
  );
}

