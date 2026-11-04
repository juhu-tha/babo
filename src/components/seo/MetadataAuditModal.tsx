import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import type { MetaCluster } from '@/src/data/metaClusters';
import { MODUL_KERN } from '@/src/registry/kern';
import { 
  Search, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ExternalLink, 
  FileSpreadsheet,
  Copy,
  Check,
  Globe
} from 'lucide-react';

export interface MetadataAuditItem {
  id: string;
  label: string;
  group: string;
  clusterId: string;
  clusterName: string;
  title: string;
  description: string;
  hasCustomDescription: boolean;
  length: number;
  status: 'optimal' | 'long' | 'short' | 'missing';
  statusText: string;
}

interface MetadataAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabGroups: readonly { name: string; tabs: readonly { id: string; label: string }[] }[];
  tabDescriptions: Record<string, string>;
  groupToCluster: Record<string, Pick<MetaCluster, 'id' | 'number' | 'name'>>;
  onSelectTab: (tabId: string) => void;
}

export const MetadataAuditModal: React.FC<MetadataAuditModalProps> = ({
  isOpen,
  onClose,
  tabGroups,
  tabDescriptions,
  groupToCluster,
  onSelectTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'optimal' | 'long' | 'short' | 'missing'>('all');
  const [copied, setCopied] = useState(false);

  // Compile all audit items
  const allItems: MetadataAuditItem[] = useMemo(() => {
    const list: MetadataAuditItem[] = [];

    tabGroups.forEach((group) => {
      const cluster = groupToCluster[group.name];
      const clusterId = cluster ? cluster.id : 'allgemein';
      const clusterName = cluster ? `${cluster.number}: ${cluster.name}` : (group.name === 'Allgemein' ? 'Allgemein' : group.name);

      group.tabs.forEach((tab) => {
        // Skip visual divider items
        if (tab.id.startsWith('divider_')) return;

        const title = `BaustoffBoard THA - ${MODUL_KERN.get(tab.id)?.titel ?? tab.label}`;
        const desc = tabDescriptions[tab.id];
        const hasCustom = !!desc;
        const len = desc ? desc.length : 0;

        let status: 'optimal' | 'long' | 'short' | 'missing' = 'optimal';
        let statusText = 'Optimal (100–165 Z.)';

        if (!hasCustom) {
          status = 'missing';
          statusText = 'Fehlt (Fallback aktiv)';
        } else if (len < 100) {
          status = 'short';
          statusText = `Kurz (${formatDeWert(len)} Z. < 100)`;
        } else if (len > 165) {
          status = 'long';
          statusText = `Lang (${formatDeWert(len)} Z. > 165)`;
        }

        list.push({
          id: tab.id,
          label: tab.label,
          group: group.name,
          clusterId,
          clusterName,
          title,
          description: desc || 'Interaktives Fachportal BaustoffBoard der TH Augsburg für Baustoffkunde, Werkstoffprüfung, Tragwerkslehre, Bauphysik und kreislaufgerechten Rückbau.',
          hasCustomDescription: hasCustom,
          length: len,
          status,
          statusText
        });
      });
    });

    return list;
  }, [tabGroups, tabDescriptions, groupToCluster]);

  // Statistics
  const stats = useMemo(() => {
    const total = allItems.length;
    const optimal = allItems.filter(i => i.status === 'optimal').length;
    const long = allItems.filter(i => i.status === 'long').length;
    const short = allItems.filter(i => i.status === 'short').length;
    const missing = allItems.filter(i => i.status === 'missing').length;
    const custom = allItems.filter(i => i.hasCustomDescription).length;
    return { total, optimal, long, short, missing, custom };
  }, [allItems]);

  // Clusters list for dropdown
  const clusterOptions = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach(i => set.add(i.clusterName));
    return Array.from(set);
  }, [allItems]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Cluster filter
      if (selectedCluster !== 'all' && item.clusterName !== selectedCluster) return false;

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = item.id.toLowerCase().includes(q);
        const matchLabel = item.label.toLowerCase().includes(q);
        const matchGroup = item.group.toLowerCase().includes(q);
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchId && !matchLabel && !matchGroup && !matchTitle && !matchDesc) return false;
      }

      return true;
    });
  }, [allItems, selectedCluster, statusFilter, searchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['TabID', 'Modulname', 'Gruppe', 'Cluster', 'Seitentitel (Title)', 'Meta-Description', 'Zeichenlaenge', 'Status'];
    const rows = filteredItems.map(item => [
      `"${item.id}"`,
      `"${item.label.replace(/"/g, '""')}"`,
      `"${item.group.replace(/"/g, '""')}"`,
      `"${item.clusterName.replace(/"/g, '""')}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      item.length,
      `"${item.statusText}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `baustoffboard_seo_metadaten_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy JSON summary
  const handleCopyJSON = () => {
    const exportData = filteredItems.map(item => ({
      id: item.id,
      label: item.label,
      group: item.group,
      cluster: item.clusterName,
      title: item.title,
      description: item.description,
      length: item.length,
      status: item.statusText
    }));
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-home-grau/30 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden text-text-main dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-home-grau/20 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/60 dark:bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center shrink-0">
              <Globe size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-text-main dark:text-slate-100 leading-tight">
                  SEO-Metadaten Prüfung aller Module
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-shiraz/10 text-shiraz font-bold border border-shiraz/20">
                  {formatDeWert(stats.total)} Module
                </span>
              </div>
              <p className="text-xs text-text-main/70 dark:text-slate-400 mt-0.5">
                Vollständige Übersicht aller Tabs mit HTML-Seitentiteln (<code className="text-shiraz font-bold">document.title</code>) und Meta-Descriptions (<code className="text-shiraz font-bold">&lt;meta name="description"&gt;</code>).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl border border-home-grau/30 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-off-white dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Als CSV-Tabelle exportieren"
            >
              <FileSpreadsheet size={14} className="text-shiraz" />
              <span className="hidden sm:inline">CSV Export</span>
            </button>
            <button
              onClick={handleCopyJSON}
              className="px-3 py-1.5 rounded-xl border border-home-grau/30 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-off-white dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Gefilterte Daten als JSON kopieren"
            >
              {copied ? <Check size={14} className="text-shiraz" /> : <Copy size={14} />}
              <span className="hidden sm:inline">{copied ? 'Kopiert!' : 'JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-text-main/70 hover:text-text-main dark:text-slate-400 dark:hover:text-white hover:bg-home-grau/10 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Schließen"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 border-b border-home-grau/15 dark:border-slate-800 bg-off-white/40 dark:bg-slate-950/40 shrink-0 text-xs">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-home-grau/20 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-mono block">Gesamt-Module</span>
            <span className="text-lg font-bold font-mono text-text-main dark:text-slate-100">{formatDeWert(stats.total)}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5">100% Titel definiert</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-home-grau/20 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-mono block">Eigene Description</span>
            <span className="text-lg font-bold font-mono text-shiraz">{formatDeWert(stats.custom)} / {formatDeWert(stats.total)}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{formatDeZahl(((stats.custom / stats.total) * 100), 0)}% Abdeckung</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-home-grau/20 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono block">Optimal (100–165 Z.)</span>
            <span className="text-lg font-bold font-mono text-text-main dark:text-slate-100">{formatDeWert(stats.optimal)}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Google Best Practice</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-home-grau/20 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono block">Lang (&gt;165 Zeichen)</span>
            <span className="text-lg font-bold font-mono text-text-main dark:text-slate-100">{formatDeWert(stats.long)}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Wird in SERP gekürzt</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-home-grau/20 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-mono block">Kurz (&lt;100 Z.) / Fehlt</span>
            <span className="text-lg font-bold font-mono text-slate-700 dark:text-slate-300">{formatDeWert(stats.short + stats.missing)}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{stats.missing === 0 ? 'Kein Fehlt-Fehler' : `${formatDeWert(stats.missing)} ohne Tag`}</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-home-grau/15 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center rounded-xl border border-home-grau/25 dark:border-slate-700 p-0.5 bg-off-white dark:bg-slate-800 text-xs">
              {[
                { id: 'all', label: `Alle (${allItems.length})` },
                { id: 'optimal', label: `Optimal (${formatDeWert(stats.optimal)})` },
                { id: 'long', label: `Lang (${formatDeWert(stats.long)})` },
                { id: 'short', label: `Kurz (${formatDeWert(stats.short)})` },
                { id: 'missing', label: `Fehlt (${formatDeWert(stats.missing)})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as typeof statusFilter)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-shiraz text-white font-bold shadow-2xs'
                      : 'text-text-main/80 dark:text-slate-300 hover:text-text-main'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Cluster Dropdown */}
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="p-1.5 rounded-xl border border-home-grau/25 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-text-main dark:text-slate-200 focus:outline-hidden"
            >
              <option value="all">Alle Cluster &amp; Bereiche</option>
              {clusterOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-text-main/40 dark:text-slate-500" size={14} />
            <input
              type="text"
              placeholder="Tab-ID, Titel oder Beschreibung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-home-grau/25 dark:border-slate-700 bg-off-white/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-shiraz focus:outline-hidden text-text-main dark:text-slate-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Main Table Scroll Container */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-home-grau/25 dark:border-slate-700 z-10 text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3 w-44">Tab-ID &amp; Modul</th>
                <th className="py-2.5 px-3 w-40">Gruppe / Cluster</th>
                <th className="py-2.5 px-3 w-56">Seitentitel (<code className="font-mono">title</code>)</th>
                <th className="py-2.5 px-3 min-w-72">Meta-Description</th>
                <th className="py-2.5 px-3 w-28 text-center">Länge (Zeichen)</th>
                <th className="py-2.5 px-3 w-32 text-center">Status</th>
                <th className="py-2.5 px-3 w-20 text-center">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-home-grau/15 dark:divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 italic">
                    Keine Module für diese Filterkriterien gefunden.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
                  let icon = <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />;

                  if (item.status === 'long') {
                    badgeClass = 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
                    icon = <AlertCircle size={12} className="text-blue-600 shrink-0" />;
                  } else if (item.status === 'short') {
                    badgeClass = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
                    icon = <AlertTriangle size={12} className="text-amber-600 shrink-0" />;
                  } else if (item.status === 'missing') {
                    badgeClass = 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
                    icon = <X size={12} className="text-rose-600 shrink-0" />;
                  }

                  return (
                    <tr 
                      key={item.id}
                      className="hover:bg-off-white/80 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <td className="py-2.5 px-3 text-center text-[11px] font-mono text-slate-400">
                        {idx + 1}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-bold text-text-main dark:text-slate-100 leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[10px] font-mono text-shiraz mt-0.5">
                          #{item.id}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[11px] text-text-main dark:text-slate-200">
                          {item.group}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]" title={item.clusterName}>
                          {item.clusterName}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="text-[11px] font-medium text-slate-800 dark:text-slate-200 leading-snug break-words">
                          {item.title}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="text-[11px] text-text-main/80 dark:text-slate-300 leading-relaxed font-sans break-words">
                          {item.description}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          item.length >= 100 && item.length <= 165
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : (item.length > 165 ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300')
                        }`}>
                          {item.length} Z.
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                          {icon}
                          <span>{item.statusText}</span>
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectTab(item.id);
                            onClose();
                          }}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-shiraz hover:text-white dark:bg-slate-800 dark:hover:bg-shiraz text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1 group-hover:shadow-2xs"
                          title={`Modul '${item.label}' öffnen`}
                        >
                          <span>Öffnen</span>
                          <ExternalLink size={10} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3 border-t border-home-grau/20 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div>
            Angezeigt: <strong className="text-text-main dark:text-slate-200">{filteredItems.length}</strong> von <strong className="text-text-main dark:text-slate-200">{allItems.length}</strong> Modulen
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Empfohlene Google-Länge: <strong>120 – 160 Zeichen</strong></span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-shiraz text-white rounded-lg font-bold text-xs hover:bg-shiraz/90 cursor-pointer"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
