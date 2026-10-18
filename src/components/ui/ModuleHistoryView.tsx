import React, { useState } from 'react';
import { History, Milestone, Compass, BookOpen, Scale, ShieldCheck, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { GroupHistory, HistoryMilestone } from '@/src/data/moduleHistoryData';

interface ModuleHistoryViewProps {
  history: GroupHistory;
  accentColor?: string; // default shiraz
}

export default function ModuleHistoryView({ history, accentColor = 'text-shiraz' }: ModuleHistoryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Normung', 'Technologie', 'Paradigmenwechsel', 'Recht & Regularien', 'Werkstoffwende', 'Sicherheit'];

  const filteredMilestones = history.milestones.filter(m => {
    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  });

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Normung':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Technologie':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Paradigmenwechsel':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Recht & Regularien':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Werkstoffwende':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Sicherheit':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* LEAD INTRO CARD */}
      <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-shiraz uppercase tracking-wider block">Historische Entwicklung &amp; Normenwandel</span>
              <h3 className="text-base font-bold text-text-main">
                Chronik: {history.title}
              </h3>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
            {history.milestones.length} maßgebliche Epochen &amp; Meilensteine
          </span>
        </div>

        <p className="text-sm text-text-main/80 leading-relaxed">
          {history.leadSummary}
        </p>

        {/* Filter Bar */}
        <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-home-grau/15">
          <span className="text-xs font-semibold text-text-main/60 flex items-center gap-1 mr-1">
            <Filter size={13} /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-shiraz text-white border-shiraz shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {cat === 'all' ? 'Alle Meilensteine' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* TIMELINE VIEW */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-home-grau/40">
        {filteredMilestones.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Node Dot */}
            <div className="absolute -left-6 sm:-left-8 top-4 w-4 h-4 rounded-full bg-white border-3 border-shiraz shadow-xs transform -translate-x-1/2 group-hover:scale-125 transition-transform" />

            {/* Content Card */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs hover:border-shiraz/50 transition-all space-y-3">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/15 pb-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-shiraz/10 text-shiraz border border-shiraz/20">
                    {item.era}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getCategoryBadgeClass(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                {item.keyReference && (
                  <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                    Ref: {item.keyReference}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="text-base font-bold text-text-main group-hover:text-shiraz transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed mt-1.5">
                  {item.description}
                </p>
              </div>

              {/* Impact Box */}
              <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 text-xs text-text-main/85 space-y-1">
                <span className="font-bold text-shiraz flex items-center gap-1.5 uppercase text-[10.5px] tracking-wide">
                  <CheckCircle2 size={14} className="text-shiraz" />
                  Auswirkung auf die heutige Bau- &amp; Planungspraxis:
                </span>
                <p className="leading-relaxed pl-5">
                  {item.impact}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* KEY TAKEAWAY FOOTER CARD */}
      <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30 shadow-xs flex items-start gap-3.5">
        <div className="p-2.5 bg-shiraz text-white rounded-xl shrink-0 mt-0.5">
          <Compass className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-text-main">
            Historisches Fazit für die moderne Ingenieurpraxis
          </h4>
          <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
            {history.keyTakeaway}
          </p>
        </div>
      </div>
    </div>
  );
}
