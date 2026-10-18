import React from 'react';
import { Clock, GitPullRequest, Milestone, ListChecks, Calendar, Tag, HardDrive } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { VERSION_HISTORY, CURRENT_VERSION } from '@/src/data/versionData';

export default function Versionen() {
  return (
    <div className="space-y-8 animate-in fade-in duration-350">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className="border-b border-slate-200 p-6 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-shiraz/10 border border-shiraz/20 p-2.5 rounded-xl text-shiraz shadow-sm shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-2"><Clock className="text-shiraz" />
                Changelog &amp; Revisionshistorie
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dokumentationsprotokoll und kontinuierliche Weiterentwicklung der akademischen Plattform.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-mono font-medium">
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
            <span>Aktueller Stand: {CURRENT_VERSION.version} ({CURRENT_VERSION.date})</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="p-6 pb-0">
          <div className="text-sm text-slate-700 bg-slate-50 p-5 rounded-xl border border-slate-200/80 leading-relaxed font-sans">
            <p className="flex items-start gap-2">
              <Milestone className="w-4 h-4 text-shiraz shrink-0 mt-0.5" />
              <span>
                Dieses Dokument verzeichnet alle Meilensteine, gesetzlichen Aktualisierungen sowie funktionalen Verbesserungen des Lernboards. 
                Die Versionsgeschichte wird bei jeder inhaltlichen Überarbeitung automatisch aktualisiert, um Studierenden und Lehrenden der 
                <strong> TH Augsburg</strong> einen verlässlichen und zeitlich präzisen Stand der angebotenen Regeln, Berechnungen und Normenverweise zu gewährleisten.
              </span>
            </p>
          </div>
        </div>

        {/* Timeline body */}
        <div className="p-6 space-y-8">
          <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-8">
            {VERSION_HISTORY.map((item, index) => (
              <div key={item.version} className="relative group animate-in fade-in slide-in-from-left-2 duration-300">
                {/* Visual Node */}
                <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white transition-colors flex items-center justify-center ${
                  index === 0 
                  ? 'border-shiraz ring-4 ring-shiraz/10' 
                  : 'border-slate-400'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-shiraz' : 'bg-slate-400'}`} />
                </div>

                {/* Card Container */}
                <div className={`p-5 rounded-xl border transition-shadow ${
                  index === 0 
                  ? 'bg-off-white border-shiraz/40 shadow-xs ring-1 ring-shiraz/20' 
                  : 'bg-white border-slate-200 hover:shadow-xs'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {item.version}
                      </span>
                      <h3 className="font-bold text-slate-900 font-sans text-sm sm:text-base">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Changes List */}
                  <div className="space-y-1.5 mt-2.5 pl-1">
                    <ul className="list-none space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {item.changes.map((change, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2">
                          <span className="text-shiraz font-bold mt-0.5 shrink-0 select-none">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Versionsverwaltung', url: 'https://de.wikipedia.org/wiki/Versionsverwaltung' },
          { title: 'Semantic Versioning', url: 'https://de.wikipedia.org/wiki/Semantic_Versioning' }
        ]}
        literatur={[
          'Sommerville, I.: Software Engineering (Pearson Studium)',
          'Preston-Werner, T.: Semantic Versioning 2.0.0 Spezifikation'
        ]}
        regelwerke={[
          { title: 'SemVer 2.0.0 (Semantic Versioning Specification)', url: 'https://semver.org/' },
          { title: 'DIN EN ISO 9001 (Qualitätsmanagementsysteme - Dokumentierte Information)', url: 'https://www.beuth.de/' }
        ]}
        hideFormeln={true}
      />
    </div>
  );
}
