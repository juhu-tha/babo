import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Table, 
  FileJson,
  Calendar,
  Building,
  Hash,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  Leaf,
  Wrench
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { 
  LabProtocolRecord, 
  exportToCSV, 
  exportToJSON, 
  openPrintableReport 
} from '@/src/utils/labExportUtils';
import { 
  getStoredLabProtocols, 
  clearStoredLabProtocols, 
  saveStoredLabProtocol 
} from '@/src/utils/studyStorage';

export const LabProtocolManager: React.FC = () => {
  const { setActiveTab } = useTabContext();
  const [protocols, setProtocols] = useState<LabProtocolRecord[]>([]);
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>(null);

  useEffect(() => {
    loadProtocols();
  }, []);

  const loadProtocols = () => {
    const list = getStoredLabProtocols();
    setProtocols(list);
    if (list.length > 0 && !selectedProtocolId) {
      setSelectedProtocolId(list[0].id);
    }
  };

  const handleClearAll = () => {
    if (confirm('Möchten Sie alle gespeicherten Labor-Protokolle unwiderruflich löschen?')) {
      clearStoredLabProtocols();
      setProtocols([]);
      setSelectedProtocolId(null);
    }
  };

  const selectedProtocol = protocols.find(p => p.id === selectedProtocolId);

  // Export full table to CSV
  const handleExportAllCSV = () => {
    if (protocols.length === 0) return;
    const headers = [
      'Protokoll-ID',
      'Zeitstempel',
      'Prüfung',
      'Norm',
      'Material',
      'Geometrie',
      'Max. Spannung (MPa)',
      'E-Modul (GPa)',
      'Integrität-Status',
      'Prüfsumme / Hash'
    ];
    const rows = protocols.map(p => [
      p.id,
      p.timestamp,
      p.testTitle,
      p.norm,
      p.specimen.material,
      p.specimen.geometry,
      p.metrics['Max. Spannung (MPa)'] || '',
      p.metrics['E-Modul (GPa)'] || '',
      p.status,
      p.integrityHash
    ]);
    exportToCSV(`THA_Labor_Messreihe_${Date.now()}`, headers, rows);
  };

  // Export selected to JSON
  const handleExportSelectedJSON = () => {
    if (!selectedProtocol) return;
    exportToJSON(`Laborprotokoll_${selectedProtocol.id}`, selectedProtocol);
  };

  // Export all to JSON
  const handleExportAllJSON = () => {
    if (protocols.length === 0) return;
    exportToJSON(`THA_Labor_Gesamtdatenbank_${Date.now()}`, protocols);
  };

  // Printable official document
  const handlePrintSelected = () => {
    if (!selectedProtocol) return;

    const metricsRows = Object.entries(selectedProtocol.metrics)
      .map(([k, v]) => `<tr><th style="width:40%">${k}</th><td><strong>${v}</strong></td></tr>`)
      .join('');

    const paramsRows = Object.entries(selectedProtocol.parameters)
      .map(([k, v]) => `<tr><th style="width:40%">${k}</th><td>${v}</td></tr>`)
      .join('');

    const notesItems = selectedProtocol.validationNotes
      .map(n => `<li>${n}</li>`)
      .join('');

    const statusBadgeClass = 
      selectedProtocol.status === 'Gültig' ? 'badge-success' :
      selectedProtocol.status === 'Plausibel' ? 'badge-warning' : 'badge-danger';

    const html = `
      <div class="header-bar">
        <div>
          <h1 class="header-title">THA Prüflaboratorium – Amtlicher Labor-Prüfbericht</h1>
          <div class="header-sub">Fakultät für Architektur und Bauwesen • Baustoffprüfung nach DIN EN &amp; ISO</div>
        </div>
        <div>
          <span class="badge ${statusBadgeClass}">Status: ${selectedProtocol.status}</span>
        </div>
      </div>

      <div class="metric-box">
        <table style="margin:0">
          <tr>
            <th style="width:25%">Prüfvorgang:</th>
            <td><strong>${selectedProtocol.testTitle}</strong></td>
            <th style="width:25%">Normengrundlage:</th>
            <td>${selectedProtocol.norm}</td>
          </tr>
          <tr>
            <th>Protokoll-ID:</th>
            <td><code>${selectedProtocol.id}</code></td>
            <th>Datum / Uhrzeit:</th>
            <td>${selectedProtocol.timestamp}</td>
          </tr>
          <tr>
            <th>Prüfer / Operator:</th>
            <td>${selectedProtocol.operator}</td>
            <th>Messpunkte-Anzahl:</th>
            <td>${selectedProtocol.dataPointsCount} Stützstellen</td>
          </tr>
        </table>
      </div>

      <h3 style="font-size:14px; margin-top:20px; color:#0f172a">1. Probekörper &amp; Geometrie</h3>
      <table>
        <tr>
          <th>Material:</th>
          <td><strong>${selectedProtocol.specimen.material}</strong></td>
          <th>Körperform:</th>
          <td>${selectedProtocol.specimen.geometry}</td>
        </tr>
        <tr>
          <th>Soll-Abmessungen:</th>
          <td>${selectedProtocol.specimen.dimensions}</td>
          <th>Vorbehandlung / Lagerung:</th>
          <td>${selectedProtocol.specimen.conditioning || 'Standard 20 °C / 65 % r.F.'}</td>
        </tr>
      </table>

      <h3 style="font-size:14px; margin-top:20px; color:#0f172a">2. Versuchsparameter</h3>
      <table>
        ${paramsRows}
      </table>

      <h3 style="font-size:14px; margin-top:20px; color:#0f172a">3. Ermittelte Werkstoff-Kennwerte (Prüfergebnisse)</h3>
      <table>
        ${metricsRows}
      </table>

      <h3 style="font-size:14px; margin-top:20px; color:#0f172a">4. Plausibilitäts- &amp; Test-Integritätsprüfung</h3>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:6px; font-size:12px;">
        <ul style="margin:0; padding-left:18px;">
          ${notesItems}
        </ul>
      </div>

      <div style="margin-top:24px; padding-top:16px; border-top:1px solid #cbd5e1; display:flex; justify-content:space-between; align-items:flex-end;">
        <div>
          <div style="font-size:10px; color:#64748b; margin-bottom:4px;">Kryptografische Prüfsumme (SHA-256 Integritäts-Signatur):</div>
          <span class="hash-code">${selectedProtocol.integrityHash}</span>
        </div>
        <div style="text-align:right; font-size:11px; color:#64748b;">
          Digitale Prüfbericht-Validierung • THA Labor-Informations- und Management-System
        </div>
      </div>
    `;

    openPrintableReport(html, `Laborbericht_${selectedProtocol.id}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-home-grau/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono uppercase bg-shiraz/10 text-shiraz px-2 py-0.5 rounded border border-shiraz/20">
              Phase 2: Labor-Integrität &amp; Dokumentation
            </span>
          </div>
          <h3 className="text-lg font-bold text-text-main mt-1 flex items-center gap-2">
            <FileText className="text-shiraz" size={20} />
            Labor-Protokolle &amp; Export-Zentrale
          </h3>
          <p className="text-xs text-text-main/70 mt-0.5">
            Automatische Aufzeichnung virtueller Prüfungen mit Plausibilitätsprüfung, kryptografischer Prüfsumme und Multi-Format-Export.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportAllCSV}
            disabled={protocols.length === 0}
            className="px-3 py-2 bg-off-white hover:bg-slate-100 text-text-main text-xs font-bold rounded-xl border border-home-grau/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Alle gespeicherten Versuche als Excel/CSV exportieren"
          >
            <Table size={14} className="text-emerald-700" /> CSV-Tabelle
          </button>
          <button
            onClick={handleExportAllJSON}
            disabled={protocols.length === 0}
            className="px-3 py-2 bg-off-white hover:bg-slate-100 text-text-main text-xs font-bold rounded-xl border border-home-grau/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Gesamte Datenbank als JSON exportieren"
          >
            <FileJson size={14} className="text-blue-600" /> JSON-Archiv
          </button>
          {protocols.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-2 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
              title="Alle Protokolle löschen"
            >
              <Trash2 size={14} /> Leeren
            </button>
          )}
        </div>
      </div>

      {protocols.length === 0 ? (
        <div className="bg-off-white/80 p-8 rounded-2xl border border-home-grau/30 flex flex-col items-center justify-center text-center">
          <Activity size={48} className="text-home-grau/40 mb-3" />
          <h4 className="text-sm font-bold text-text-main">Noch keine Labor-Protokolle aufgezeichnet</h4>
          <p className="text-xs text-text-main/70 max-w-md mt-1 mb-4">
            Führen Sie im Tab <strong>Festbeton &amp; Mechanik</strong> einen Druckversuch, Zugversuch oder E-Modul-Test durch und klicke anschließend auf <em>„Messung im Prüfprotokoll archivieren“</em>.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-shiraz font-bold bg-white px-3 py-1.5 rounded-lg border border-shiraz/20 shadow-xs">
            <Sparkles size={14} /> Plausibilitätsprüfungen und Prüfsummen werden automatisch generiert.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left list of protocols */}
          <div className="lg:col-span-4 flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1">
            <span className="text-[11px] font-bold text-text-main/60 uppercase tracking-wider mb-1">
              Gespeicherte Versuchsreihen ({protocols.length})
            </span>
            {protocols.map(p => {
              const isSelected = p.id === selectedProtocolId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProtocolId(p.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 text-left ${
                    isSelected
                      ? 'bg-shiraz/5 border-shiraz shadow-xs'
                      : 'bg-white border-home-grau/25 hover:border-home-grau/60 hover:bg-off-white/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                      {p.testTitle}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      p.status === 'Gültig' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      p.status === 'Plausibel' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-text-main/60">
                    <span>{p.specimen.material}</span>
                    <span>•</span>
                    <span>{p.timestamp.split(',')[0]}</span>
                  </div>

                  <div className="text-[10px] font-mono text-text-main/50 truncate">
                    {p.integrityHash}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Protocol Details & Actions */}
          {selectedProtocol ? (
            <div className="lg:col-span-8 bg-off-white/50 p-6 rounded-2xl border border-home-grau/30 flex flex-col gap-5">
              {/* Detailed header & action buttons */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-home-grau/20 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-text-main/50 uppercase">
                    ID: {selectedProtocol.id}
                  </span>
                  <h4 className="text-base font-bold text-text-main flex items-center gap-2 mt-0.5">
                    {selectedProtocol.testTitle}
                  </h4>
                  <span className="text-xs text-text-main/70">
                    Normative Prüfgrundlage: <strong>{selectedProtocol.norm}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintSelected}
                    className="px-3 py-2 bg-shiraz hover:bg-shiraz/90 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer size={14} /> Prüfbericht drucken / PDF
                  </button>
                  <button
                    onClick={handleExportSelectedJSON}
                    className="p-2 bg-white hover:bg-slate-100 text-text-main text-xs font-bold rounded-xl border border-home-grau/30 transition-all cursor-pointer"
                    title="Diesen Datensatz als JSON exportieren"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>

              {/* Integrity status pill */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                selectedProtocol.status === 'Gültig' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' :
                selectedProtocol.status === 'Plausibel' ? 'bg-amber-50/70 border-amber-200 text-amber-900' :
                'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}>
                {selectedProtocol.status === 'Gültig' ? (
                  <CheckCircle2 className="text-emerald-700 shrink-0 mt-0.5" size={18} />
                ) : (
                  <AlertTriangle className="text-amber-800 shrink-0 mt-0.5" size={18} />
                )}
                <div className="text-xs flex-1">
                  <div className="font-bold mb-1">
                    Test-Integritätsstatus: {selectedProtocol.status}
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {selectedProtocol.validationNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                  <div className="mt-2 text-[10px] font-mono opacity-80">
                    Kryptografische Signatur: <strong>{selectedProtocol.integrityHash}</strong>
                  </div>
                </div>
              </div>

              {/* Specimen & Parameters Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-home-grau/25">
                  <h5 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5 text-shiraz">
                    <Building size={14} /> Probekörper
                  </h5>
                  <div className="text-xs space-y-1 text-text-main/80">
                    <div>Material: <strong>{selectedProtocol.specimen.material}</strong></div>
                    <div>Prüfkörperform: <strong>{selectedProtocol.specimen.geometry}</strong></div>
                    <div>Abmessungen: <strong>{selectedProtocol.specimen.dimensions}</strong></div>
                    <div>Lagerung: <strong>{selectedProtocol.specimen.conditioning || 'Standard (20 °C)'}</strong></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/25">
                  <h5 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5 text-shiraz">
                    <Activity size={14} /> Kennwerte &amp; Messgrößen
                  </h5>
                  <div className="text-xs space-y-1 text-text-main/80">
                    {Object.entries(selectedProtocol.metrics).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span>{k}:</span>
                        <strong className="font-mono">{v}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Parameters table */}
              <div className="bg-white p-4 rounded-xl border border-home-grau/25">
                <h5 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5 text-slate-700">
                  <Layers size={14} /> Spezifische Versuchsparameter
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {Object.entries(selectedProtocol.parameters).map(([k, v]) => (
                    <div key={k} className="bg-off-white/80 p-2 rounded-lg border border-home-grau/20">
                      <span className="text-[10px] text-text-main/60 block">{k}</span>
                      <strong className="text-text-main font-mono">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interdisziplinärer Transfer & Weiterverwendung (Phase 3) */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-home-grau/25 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5 text-shiraz">
                    <Sparkles size={14} /> Interdisziplinärer Transfer &amp; Weiterverwendung
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/50 bg-white px-2 py-0.5 rounded border border-home-grau/20">
                    Phase 3 Brücke
                  </span>
                </div>
                <p className="text-xs text-text-main/75 leading-relaxed">
                  Nutzen Sie die ermittelten Messwerte dieses Probekörpers (<strong className="font-semibold text-text-main">{selectedProtocol.specimen.material}</strong>, {selectedProtocol.testTitle}) direkt in den angeschlossenen Bemessungs-, Ökobilanzierungs- oder Sanierungsmodulen:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setActiveTab('oekobilanz_lca')}
                    className="p-2.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 rounded-lg border border-home-grau/20 text-xs font-medium text-left flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Leaf size={14} className="text-emerald-600" /> Ökobilanz (LCA)
                    </span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => setActiveTab('festbeton_statistik')}
                    className="p-2.5 bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-900 rounded-lg border border-home-grau/20 text-xs font-medium text-left flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Activity size={14} className="text-middle-blue" /> Statistische Konformität
                    </span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => setActiveTab('instandsetzung_info')}
                    className="p-2.5 bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-900 rounded-lg border border-home-grau/20 text-xs font-medium text-left flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Wrench size={14} className="text-shiraz" /> Instandsetzung / Bestand
                    </span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
