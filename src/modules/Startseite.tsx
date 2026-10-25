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
  Tag
} from 'lucide-react';
import { useTabContext } from '../contexts/TabContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CURRENT_VERSION } from '../data/versionData';
import { META_CLUSTERS } from '../data/metaClusters';
import { NAV_TAB_GRUPPEN, MODUL_BY_ID, type ModulId } from '../registry/modules';
import inhalt from '@/content/startseite/Startseite.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Startseite() {
  const { setActiveTab } = useTabContext();
  const { language } = useLanguage();
  const zuletzt: string[] = (() => {
    try { return (JSON.parse(localStorage.getItem('baustoffboard_recent') || '[]') as string[]).filter(id => id !== 'start' && MODUL_BY_ID.has(id)).slice(0, 4); } catch { return []; }
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
          {language === 'en' ? inhalt.werte.welcomeToBaustoffboard : inhalt.werte.willkommenImBaustoffboard}
        </h2>
        <p className="text-lg text-text-main/80 mb-6 max-w-2xl">
          {language === 'en' 
            ? inhalt.werte.interactiveLearningAndKnowledge 
            : inhalt.werte.interaktiveLernUndWissensplattform}
          <br /><span className="text-sm font-bold"><MdText text={inhalt.texte.profDrIngJürgen} /></span>
          <br /><span className="text-xs text-text-main/50 block mt-1 italic"><MdText text={inhalt.texte.chabosWissenWasDas} /></span>
        </p>

        {/* Versionsanzeige mit Verlinkung zum Changelog - unterhalb von Chabos platziert */}
        <div className="mb-8">
          <button
            onClick={() => setActiveTab('versionen')}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500 hover:text-shiraz transition-colors cursor-pointer"
            title={inhalt.werte.zumChangelogZurRevisionshistorie}
          >
            <Tag size={13} className="text-slate-400" />
            <span>Version {CURRENT_VERSION.version} ({CURRENT_VERSION.date})</span>
          </button>
        </div>
        
        {/* Einstieg in die Themen (Phase 2, AP 2.10) */}
        <section aria-labelledby="einstieg-titel" className="w-full text-left mb-8">
          <h3 id="einstieg-titel" className="text-lg font-bold text-text-main mb-3">{language === 'en' ? inhalt.werte.startWithATopic : inhalt.werte.einstiegNachThemen}</h3>
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
          {zuletzt.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-bold text-text-main mb-2">{language === 'en' ? inhalt.werte.recentlyVisited : inhalt.werte.zuletztBesucht}</h4>
              <div className="flex flex-wrap gap-2">
                {zuletzt.map(id => (
                  <button key={id} type="button" onClick={() => setActiveTab(id as ModulId)} className="px-3 py-1.5 rounded-lg border border-home-grau/30 bg-white text-sm text-text-main hover:border-shiraz hover:text-shiraz">
                    {MODUL_BY_ID.get(id)?.label}
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
                <h3 className="text-lg font-bold text-shiraz mb-2"><MdText text={inhalt.texte.hinweiseZurNutzung} /></h3>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dasBaustoffboardDient} /><span className="underline"><MdText text={inhalt.texte.ausschließlichZuLehrUnd} /></span><MdText text={inhalt.texte.deshalbKönnenHierVereinfachungen} /><span className="underline"><MdText text={inhalt.texte.keinerleiHaftung} /></span><MdText text={inhalt.texte.fürErgebnisseÜbernommen} /><button
                    onClick={() => {
                      const el = document.getElementById('engineering-disclaimer');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center justify-center p-1 rounded-md text-shiraz hover:bg-shiraz/10 transition-all align-middle cursor-pointer -mt-0.5"
                    title={inhalt.werte.zumHaftungsausschlussEngineeringDisclaim}
                    aria-label={inhalt.werte.zumHaftungsausschlussEngineeringDisclaim2}
                  >
                    <ArrowRight size={16} className="transition-transform hover:translate-x-0.5" />
                  </button><MdText text={inhalt.texte.brBrDasDashboard} /><span><MdText text={inhalt.texte.bitteFehlerSowieVerbesserungsvorschläge} /></span>{' '}
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className="inline-flex items-center justify-center p-1 rounded-md text-shiraz hover:bg-shiraz/10 transition-all align-middle cursor-pointer -mt-0.5"
                    title={inhalt.werte.zumFeedbackFehlermeldeModul}
                    aria-label={inhalt.werte.zumFeedbackFehlermeldeModul2}
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
                <h3 className="text-lg font-bold text-text-main mb-2"><MdText text={inhalt.texte.datenschutzSpeicherung} /></h3>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.ergebnisseKönnenModularVia} /><button onClick={() => setActiveTab('datenschutz')} className="text-shiraz font-bold hover:underline inline-flex items-center">Datenschutz</button>.
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
            <h3 className="font-bold text-text-main dark:text-slate-100 mb-2"><MdText text={inhalt.texte.interaktivesLernen} /></h3>
            <p className="text-sm text-text-main/70 dark:text-slate-400"><MdText text={inhalt.texte.nutzenSieDieModule} /></p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-800 flex items-start gap-4">
          <div className="p-3 bg-off-white dark:bg-slate-800 rounded-lg text-home-grau dark:text-slate-400">
            <Lightbulb size={24} />
          </div>
          <div>
            <h3 className="font-bold text-text-main dark:text-slate-100 mb-2"><MdText text={inhalt.texte.theoriePraxis} /></h3>
            <p className="text-sm text-text-main/70 dark:text-slate-400"><MdText text={inhalt.texte.jedesModulEnthältErklärungen} /></p>
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
              <h3 className="font-bold text-text-main dark:text-slate-100 group-hover:text-shiraz transition-colors"><MdText text={inhalt.texte.kompakteAktuelleInformationsquelle} /></h3>
            </div>
            <p className="text-sm text-text-main/70 dark:text-slate-400"><MdText text={inhalt.texte.kompakteUndAktuelleInformationsquelle} /></p>
          </div>
        </div>
      </div>

      <div className="bg-home-grau/5 dark:bg-slate-900/40 border border-home-grau/20 dark:border-slate-800 p-6 rounded-xl text-left">
        <div className="flex items-start gap-4">
          <ShieldAlert className="text-home-grau dark:text-slate-400 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-bold text-text-main dark:text-slate-100 mb-2">Projektabgrenzung</h3>
            <p className="text-text-main/80 dark:text-slate-300 leading-relaxed font-medium"><MdText text={inhalt.texte.diesIstEinReines} /></p>
          </div>
        </div>
      </div>

      {/* Wichtiger Hinweis zur Haftung (Engineering Disclaimer) */}
      <div id="engineering-disclaimer" className="p-5 bg-amber-50/70 border border-amber-200/90 rounded-2xl space-y-2 text-left shadow-xs scroll-mt-8">
        <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2">
          <ShieldAlert size={18} className="text-amber-700 shrink-0" /><MdText text={inhalt.texte.wichtigerHinweisZurHaftung} /></h4>
        <p className="text-xs text-amber-950 leading-relaxed font-medium"><MdText text={inhalt.texte.wichtigerHinweisZurHaftung2} /></p>
      </div>

      <div className="mt-8 text-sm text-text-main/60 flex flex-col items-center gap-1.5">
        <p><MdText text={inhalt.texte.profHuberTha} /></p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('versionen')}
            className="text-xs text-text-main/50 hover:text-shiraz hover:underline inline-flex items-center gap-1.5 font-mono cursor-pointer transition-colors"
            title={inhalt.werte.changelogRevisionshistorieÖffnen}
          >
            <Clock size={12} />
            <span>BaustoffBoard {CURRENT_VERSION.version} • Stand: {CURRENT_VERSION.date}</span>
          </button>
          <span className="text-text-main/30">•</span>
          <button
            onClick={() => setActiveTab('admin')}
            className="text-xs text-text-main/60 hover:text-shiraz hover:underline inline-flex items-center gap-1.5 font-semibold cursor-pointer transition-colors"
            title={inhalt.werte.adminBereichÖffnenAnmeldung}
          >
            <ShieldAlert size={12} className="text-shiraz" />
            <span>Admin-Bereich</span>
          </button>
        </div>
      </div>
    </div>
  );
}

