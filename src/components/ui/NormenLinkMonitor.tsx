import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Filter, 
  Clock, 
  FileCheck, 
  Send, 
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CENTRAL_NORMEN_REGISTRY, NormRecord } from '@/src/data/centralNormenRegistry';
import { useTabContext } from '@/src/contexts/TabContext';

interface LinkCheckItem {
  id: string;
  name: string;
  url?: string;
  sourceModule: string;
  category: string;
  lastChecked: string;
  status: 'valid' | 'redirect' | 'attention';
  statusText: string;
}

const LIVE_LINK_AUDIT: LinkCheckItem[] = [
  { id: '1', name: 'DIN Media Normenportal (vormals Beuth)', url: 'https://www.dinmedia.de/', sourceModule: 'Regularien & ModuleFooter', category: 'Normen', lastChecked: '2026-10-19', status: 'valid', statusText: 'Erreichbar (Abruf 19.10.2026)' },
  { id: '2', name: 'DAfStb (Deutscher Ausschuss für Stahlbeton)', url: 'https://www.dafstb.de/', sourceModule: 'Beton & Forschung', category: 'Fachverbände', lastChecked: '2026-10-19', status: 'valid', statusText: 'Erreichbar (Abruf 19.10.2026)' },
  { id: '3', name: 'DIBt (Deutsches Institut für Bautechnik)', url: 'https://www.dibt.de/', sourceModule: 'Zertifizierung & Zulassungen', category: 'Bauaufsicht', lastChecked: '2026-10-19', status: 'valid', statusText: 'Erreichbar (Abruf 19.10.2026)' },
  { id: '4', name: 'VDZ (Verein Deutscher Zementwerke)', url: 'https://www.vdz-online.de/', sourceModule: 'Zementchemie & LCA', category: 'Industrie', lastChecked: '2026-10-19', status: 'valid', statusText: 'Erreichbar (Abruf 19.10.2026)' },
  { id: '5', name: 'DBV (Deutscher Beton- und Bautechnik-Verein)', url: 'https://www.betonverein.de/', sourceModule: 'Betonpraxis & Merkblätter', category: 'Praxis', lastChecked: '2026-10-19', status: 'attention', statusText: 'Automatischer Abruf gesperrt (robots.txt) – manuell prüfen' },
  { id: '6', name: 'LfU Bayern (Schadstoffratgeber Gebäuderückbau)', url: 'https://www.lfu.bayern.de/', sourceModule: 'Informationsquellen', category: 'Umwelt', lastChecked: '2026-10-19', status: 'valid', statusText: 'Erreichbar (Abruf 19.10.2026)' },
  { id: '7', name: 'WINGISonline (BG BAU)', sourceModule: 'Informationsquellen & Arbeitsschutz', category: 'Arbeitsschutz', lastChecked: '2026-10-19', status: 'attention', statusText: 'Automatischer Abruf gesperrt (robots.txt) – manuell prüfen' },
  { id: '8', name: 'DGNB Navigator (Deutsche Gesellschaft für Nachhaltiges Bauen)', url: 'https://www.dgnb-navigator.de/', sourceModule: 'Nachhaltigkeit & EPD', category: 'Zertifizierung', lastChecked: '2026-10-19', status: 'attention', statusText: 'Automatischer Abruf gesperrt (robots.txt) – manuell prüfen' },
  { id: '9', name: 'ÖKOBAUDAT (Bundesministerium BMWSB)', url: 'https://www.oekobaudat.de/', sourceModule: 'LCA & Nachhaltigkeit', category: 'Ökobilanz', lastChecked: '2026-10-19', status: 'valid', statusText: 'Erreichbar (Abruf 19.10.2026)' },
  { id: '10', name: 'Technische Hochschule Augsburg (THA) Portal app.tha.de', url: 'https://app.tha.de/', sourceModule: 'Studium THA', category: 'Hochschule', lastChecked: '2026-10-19', status: 'attention', statusText: 'Automatischer Abruf gesperrt (robots.txt) – manuell prüfen' }
];

export function NormenLinkMonitor() {
  const { setActiveTab } = useTabContext();
  const [activeSubTab, setActiveSubTab] = useState<'normen' | 'links' | 'report'>('normen');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSimulatingCheck, setIsSimulatingCheck] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Form states for reporting outdated content
  const [reportModule, setReportModule] = useState('');
  const [reportNormOrUrl, setReportNormOrUrl] = useState('');
  const [reportDetail, setReportDetail] = useState('');

  const normenList = Object.values(CENTRAL_NORMEN_REGISTRY);

  const filteredNormen = normenList.filter(norm => {
    const matchesSearch = norm.code.toLowerCase().includes(search.toLowerCase()) || 
                          norm.title.toLowerCase().includes(search.toLowerCase()) ||
                          norm.beschreibung.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || norm.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredLinks = LIVE_LINK_AUDIT.filter(link => {
    return link.name.toLowerCase().includes(search.toLowerCase()) ||
           link.sourceModule.toLowerCase().includes(search.toLowerCase()) ||
           link.category.toLowerCase().includes(search.toLowerCase());
  });

  const handleRunAudit = () => {
    setIsSimulatingCheck(true);
    setTimeout(() => {
      setIsSimulatingCheck(false);
    }, 1200);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Norm- oder Link-Meldung BaustoffBoard: ${reportModule}`);
    const body = encodeURIComponent(
      `Meldung über veraltete Norm oder defekten Link:\n\n` +
      `Modul: ${reportModule}\n` +
      `Betroffene Norm / URL: ${reportNormOrUrl}\n` +
      `Beschreibung / Vorschlag für Aktualisierung:\n${reportDetail}\n\n` +
      `Gemeldet über BaustoffBoard Normen- & Link-Monitor`
    );
    window.location.href = `mailto:juergen.huber@tha.de?subject=${subject}&body=${body}`;
    setReportSuccess(true);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-home-grau/30 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-5">
        <div>
          <div className="flex items-center gap-2 text-shiraz font-mono text-xs uppercase tracking-wider font-extrabold mb-1">
            <ShieldCheck size={16} /> Qualitätssicherung & Aktualitätskontrolle
          </div>
          <h2 className="text-2xl font-bold text-text-main">
            Normen- &amp; Link-Aktualitätsmonitor
          </h2>
          <p className="text-xs text-text-main/70 mt-1 max-w-2xl">
            Zentrales Verzeichnis für DIN-, EN- und ISO-Normenstände sowie der Prüfstand der wichtigsten verlinkten Fachportale. Die Prüfungen erfolgen redaktionell zum angegebenen Datum; die App selbst prüft Links nicht live.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isSimulatingCheck}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={isSimulatingCheck ? "animate-spin" : ""} />
          {isSimulatingCheck ? "Ansicht wird aktualisiert …" : "Ansicht aktualisieren"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-off-white p-4 rounded-2xl border border-home-grau/30">
          <span className="text-[11px] font-bold text-text-main/60 uppercase block">Geführte Kernnormen</span>
          <span className="text-2xl font-black text-text-main mt-1 block">{normenList.length}</span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 size={12} /> {normenList.filter(n => n.status === 'gueltig').length} gültig · {normenList.filter(n => n.status === 'ersetzt').length} zurückgezogen
          </span>
        </div>
        <div className="bg-off-white p-4 rounded-2xl border border-home-grau/30">
          <span className="text-[11px] font-bold text-text-main/60 uppercase block">In Überarbeitung (EC 2. Gen)</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {normenList.filter(n => n.status === 'in_ueberarbeitung').length}
          </span>
          <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-1">
            <Clock size={12} /> neue Fassung erschienen oder in Arbeit
          </span>
        </div>
        <div className="bg-off-white p-4 rounded-2xl border border-home-grau/30">
          <span className="text-[11px] font-bold text-text-main/60 uppercase block">Geprüfte Weblinks</span>
          <span className="text-2xl font-black text-text-main mt-1 block">{LIVE_LINK_AUDIT.length}</span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 size={12} /> {LIVE_LINK_AUDIT.filter(l => l.status === 'valid').length} erreichbar · {LIVE_LINK_AUDIT.filter(l => l.status !== 'valid').length} manuell prüfen
          </span>
        </div>
        <div className="bg-off-white p-4 rounded-2xl border border-home-grau/30">
          <span className="text-[11px] font-bold text-text-main/60 uppercase block">Audit-Zyklus</span>
          <span className="text-sm font-black text-text-main mt-1 block">Bei jeder Revision</span>
          <span className="text-[11px] text-text-main/60 font-semibold mt-1 block">
            Letzte Prüfung: 19.10.2026
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-home-grau/20 gap-2">
        <button
          onClick={() => setActiveSubTab('normen')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
            activeSubTab === 'normen'
              ? 'bg-shiraz text-white shadow-xs'
              : 'text-text-main/70 hover:text-text-main hover:bg-slate-50'
          }`}
        >
          Zentrales Normenverzeichnis ({normenList.length})
        </button>
        <button
          onClick={() => setActiveSubTab('links')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
            activeSubTab === 'links'
              ? 'bg-shiraz text-white shadow-xs'
              : 'text-text-main/70 hover:text-text-main hover:bg-slate-50'
          }`}
        >
          Link-Checker &amp; Quellen ({LIVE_LINK_AUDIT.length})
        </button>
        <button
          onClick={() => setActiveSubTab('report')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
            activeSubTab === 'report'
              ? 'bg-shiraz text-white shadow-xs'
              : 'text-text-main/70 hover:text-text-main hover:bg-slate-50'
          }`}
        >
          Änderung / Veraltete Norm melden
        </button>
      </div>

      {/* SUB-TAB 1: NORMENVERZEICHNIS */}
      {activeSubTab === 'normen' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 text-text-main/40" size={15} />
              <input
                type="text"
                placeholder="Norm, Titel oder Modul suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-home-grau/30 bg-off-white focus:outline-none focus:border-shiraz"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
              <Filter size={14} className="text-text-main/50 shrink-0" />
              {[
                { id: 'all', label: 'Alle Gewerke' },
                { id: 'beton', label: 'Beton & Zement' },
                { id: 'holz', label: 'Holzbau' },
                { id: 'metall', label: 'Stahl' },
                { id: 'mauerwerk', label: 'Mauerwerk' },
                { id: 'bauphysik', label: 'Bauphysik' },
                { id: 'nachhaltigkeit', label: 'LCA / EPD' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all border ${
                    categoryFilter === cat.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNormen.map((norm) => (
              <div 
                key={norm.id} 
                className="bg-off-white p-5 rounded-2xl border border-home-grau/30 hover:border-home-grau/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-mono text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-md border border-home-grau/30 shadow-3xs">
                      {norm.code}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border ${
                      norm.status === 'gueltig' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {norm.status === 'gueltig' ? 'Aktuell gültig' : 'In Überarbeitung'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-text-main leading-snug mb-1">
                    {norm.title}
                  </h3>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3">
                    {norm.beschreibung}
                  </p>
                </div>

                <div className="border-t border-home-grau/20 pt-3 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-text-main/60">
                    <Clock size={12} />
                    <span>Stand: <strong>{norm.ausgabeStand}</strong></span>
                  </div>

                  <a 
                    href={norm.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-shiraz hover:underline flex items-center gap-1"
                  >
                    DIN Media Eintrag <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LINK-MONITOR */}
      {activeSubTab === 'links' && (
        <div className="space-y-4">
          <div className="text-xs text-text-main/70 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-950 font-bold block mb-0.5">Redaktionelle Link-Prüfung</strong>
              Die wichtigsten Portale (DIBt, LfU, BG Bau, DIN Media, Hochschuldienste) werden bei jeder inhaltlichen Revision abgerufen; das Datum steht in der Spalte „Geprüft“. Seiten, die automatische Abrufe sperren, sind zur manuellen Prüfung markiert. Normlinks führen auf die DIN-Media-Suche, damit sie auch bei neuen Ausgaben gültig bleiben.
            </div>
          </div>

          <div className="overflow-x-auto border border-home-grau/30 rounded-2xl">
            <table className="w-full text-left text-xs text-text-main">
              <thead className="bg-slate-50 border-b border-home-grau/20 text-text-main/70 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3.5">Bezeichnung &amp; Ziel</th>
                  <th className="p-3.5">Kategorie</th>
                  <th className="p-3.5">Eingebunden in Modul</th>
                  <th className="p-3.5">Letzter Audit</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20">
                {filteredLinks.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      {item.url ? (
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-shiraz hover:underline font-mono text-[11px] flex items-center gap-1 mt-0.5"
                        >
                          {item.url} <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                          Offline / Fachrecherche vor Ort
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-text-main/80 font-medium">{item.category}</td>
                    <td className="p-3.5 text-text-main/70">{item.sourceModule}</td>
                    <td className="p-3.5 text-text-main/60 font-mono">{item.lastChecked}</td>
                    <td className="p-3.5 text-right">
                      {item.status === 'valid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 size={11} /> {item.statusText}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle size={11} /> {item.statusText}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REPORT OUTDATED NORM OR BROKEN LINK */}
      {activeSubTab === 'report' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p>
              Haben Sie in einer Lehrveranstaltung, einer Normenausgabe oder auf einer Baustelle eine aktualisierte Norm entdeckt (z. B. neuen Normentwurf oder Ersetzung)? Teilen Sie uns dies bitte kurz mit, damit das BaustoffBoard für alle Studierenden auf dem neuesten Stand bleibt.
            </p>
          </div>

          {reportSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
              <h3 className="font-bold text-base">Vielen Dank für Ihre Meldung!</h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Ihr Hinweis wurde über das E-Mail-Programm an die Modulbetreuung übergeben und wird beim nächsten Revisionszyklus geprüft und eingepflegt.
              </p>
              <button
                onClick={() => setReportSuccess(false)}
                className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 cursor-pointer"
              >
                Weitere Meldung verfassen
              </button>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-text-main block mb-1">
                  Betroffenes Modul im BaustoffBoard:
                </label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Betontechnologie, Kalk, Bauphysik, EPD..."
                  value={reportModule}
                  onChange={(e) => setReportModule(e.target.value)}
                  className="w-full p-3 rounded-xl border border-home-grau/30 text-xs bg-off-white focus:outline-none focus:border-shiraz"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-main block mb-1">
                  Normenkennung oder Weblink:
                </label>
                <input
                  type="text"
                  required
                  placeholder="z.B. DIN EN 1992-1-1:2023 oder Link zur Fachgesellschaft..."
                  value={reportNormOrUrl}
                  onChange={(e) => setReportNormOrUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-home-grau/30 text-xs bg-off-white focus:outline-none focus:border-shiraz"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-main block mb-1">
                  Beschreibung der Neuerung / Grund der Meldung:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Welche Änderung hat stattgefunden? Wurde die Norm ersetzt oder ist ein Link nicht mehr erreichbar?"
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-home-grau/30 text-xs bg-off-white focus:outline-none focus:border-shiraz resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Send size={15} />
                Aktualisierungsmeldung vorbereiten &amp; absenden
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
