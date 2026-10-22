import React from 'react';
import { ArrowRight, BookOpen, Layers, Calculator, Sparkles } from 'lucide-react';
import { useTabContext, TabId } from '@/src/contexts/TabContext';

export interface RelatedModuleLink {
  tab: TabId;
  title: string;
  description: string;
  tag?: string;
  badgeColor?: string;
}

interface RelatedModulesProps {
  currentTab?: string;
  modules: RelatedModuleLink[];
  title?: string;
  subtitle?: string;
}

export function RelatedModules({
  modules,
  title = "Verwandte Fachmodule & Weiterführende Vertiefung",
  subtitle = "Didaktisch vernetzte Querverweise zur Vertiefung theoretischer Grundlagen, Nachweisführung und Laborpraxis"
}: RelatedModulesProps) {
  const { setActiveTab } = useTabContext();

  if (!modules || modules.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 mt-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/20 pb-3">
        <div>
          <h3 className="text-base font-bold text-text-main flex items-center gap-2">
            <Sparkles className="text-shiraz h-5 w-5" />
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-text-main/70 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
          Vernetztes Lernen
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {modules.map((m, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setActiveTab(m.tab);
              // scroll to top smoothly
              const container = document.getElementById('scroll-container');
              if (container) {
                container.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="group text-left p-3.5 rounded-xl border border-home-grau/25 bg-off-white hover:bg-white hover:border-shiraz/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-text-main group-hover:text-shiraz transition-colors line-clamp-1">
                  {m.title}
                </span>
                {m.tag && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${m.badgeColor || 'bg-slate-200/70 text-slate-700'}`}>
                    {m.tag}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-main/75 line-clamp-2 leading-relaxed">
                {m.description}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-shiraz font-medium">
              <span>Jetzt öffnen</span>
              <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
export default RelatedModules;
