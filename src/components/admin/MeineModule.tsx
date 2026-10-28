import React, { useMemo, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { FACHMODULE, PRUEF_STATUS_TEXT, datumDe, pruefvermerkFuer, type PruefStatus } from '@/src/data/pruefvermerke';
import { clusterVon } from '@/src/data/modulCluster';
import { CLUSTER_NAMEN, PATEN_JE_CLUSTER, istClusterNr, pateVon } from '@/src/data/paten';
import { formatDeGanzzahl } from '@/src/utils/numberFormat';

/**
 * Admin-Ansicht „Meine Module“ (Umsetzungsplan Phase 6, AP 6.6): alle Fachmodule mit Prüfvermerk,
 * filterbar nach Cluster, Pate und Status, mit offenen Punkten. Daten: src/data/pruefvermerke.ts
 * und src/data/paten.ts (Pflege per Pull Request).
 */
const OHNE_PATE = '__ohne__';

export function MeineModule() {
  const [cluster, setCluster] = useState('');
  const [pate, setPate] = useState('');
  const [status, setStatus] = useState<'' | PruefStatus>('');
  const [suche, setSuche] = useState('');

  const zeilen = useMemo(() => FACHMODULE.map(m => {
    const c = clusterVon(m.id);
    return { id: m.id, titel: m.titel ?? m.label, cluster: c, pate: pateVon(c), vermerk: pruefvermerkFuer(m.id) ?? { status: 'offen' as const } };
  }), []);

  const paten = useMemo(() => [...new Set(Object.values(PATEN_JE_CLUSTER).map(p => p.pate).filter(Boolean))].sort(), []);
  const q = suche.trim().toLowerCase();
  const sichtbar = zeilen.filter(z =>
    (!cluster || z.cluster === cluster) &&
    (!pate || (pate === OHNE_PATE ? !z.pate : z.pate === pate)) &&
    (!status || z.vermerk.status === status) &&
    (!q || z.titel.toLowerCase().includes(q) || z.id.includes(q)));
  const zaehle = (s: PruefStatus) => sichtbar.filter(z => z.vermerk.status === s).length;

  const feld = 'px-3 py-2 rounded-lg border border-home-grau/30 bg-white text-sm';
  return (
    <div className="space-y-5">
      <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
        <p>
          Fachliche Prüfvermerke aller Fachmodule. Gepflegt werden sie in <code className="font-mono text-xs">src/data/pruefvermerke.ts</code>,
          die Paten je Cluster in <code className="font-mono text-xs">src/data/paten.ts</code> (jeweils per Pull Request).
          Wählen Sie unter „Pate“ Ihren Namen, um nur Ihre Module zu sehen.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-bold text-text-main space-y-1">
          <span className="block">Cluster</span>
          <select value={cluster} onChange={e => setCluster(e.target.value)} className={`${feld} w-full`}>
            <option value="">alle Cluster</option>
            {Object.entries(CLUSTER_NAMEN).map(([nr, name]) => <option key={nr} value={nr}>{nr} · {name}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-text-main space-y-1">
          <span className="block">Pate</span>
          <select value={pate} onChange={e => setPate(e.target.value)} className={`${feld} w-full`}>
            <option value="">alle</option>
            {paten.map(p => <option key={p} value={p}>{p}</option>)}
            <option value={OHNE_PATE}>ohne Pate</option>
          </select>
        </label>
        <label className="text-xs font-bold text-text-main space-y-1">
          <span className="block">Status</span>
          <select value={status} onChange={e => setStatus(e.target.value as '' | PruefStatus)} className={`${feld} w-full`}>
            <option value="">alle</option>
            {(Object.keys(PRUEF_STATUS_TEXT) as PruefStatus[]).map(s => <option key={s} value={s}>{PRUEF_STATUS_TEXT[s]}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-text-main space-y-1">
          <span className="block">Modul suchen</span>
          <input type="search" value={suche} onChange={e => setSuche(e.target.value)} className={`${feld} w-full`} placeholder="Titel oder ID" />
        </label>
      </div>

      <p className="text-xs text-text-main/70" aria-live="polite">
        <ClipboardList size={14} className="inline mr-1" aria-hidden="true" />
        {formatDeGanzzahl(sichtbar.length)} Module · {formatDeGanzzahl(zaehle('geprueft'))} geprüft · {formatDeGanzzahl(zaehle('re-review'))} Nachprüfung · {formatDeGanzzahl(zaehle('offen'))} ausstehend
        {paten.length === 0 && ' · Paten noch nicht eingetragen (src/data/paten.ts)'}
      </p>

      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Prüfvermerke der Fachmodule">
        <table className="w-full text-left text-xs border border-home-grau/20 rounded-lg">
          <thead className="bg-off-white border-b border-home-grau/20">
            <tr>
              <th scope="col" className="p-2.5 font-bold">Modul</th>
              <th scope="col" className="p-2.5 font-bold">Cluster</th>
              <th scope="col" className="p-2.5 font-bold">Pate</th>
              <th scope="col" className="p-2.5 font-bold">Status</th>
              <th scope="col" className="p-2.5 font-bold">Geprüft am / von</th>
              <th scope="col" className="p-2.5 font-bold">Offene Punkte</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-home-grau/15">
            {sichtbar.map(z => (
              <tr key={z.id}>
                <td className="p-2.5"><span className="font-semibold">{z.titel}</span><br /><span className="font-mono text-text-main/60">{z.id}</span></td>
                <td className="p-2.5">{z.cluster}{istClusterNr(z.cluster) ? ` · ${CLUSTER_NAMEN[z.cluster]}` : ''}</td>
                <td className="p-2.5">{z.pate || '–'}</td>
                <td className="p-2.5">{PRUEF_STATUS_TEXT[z.vermerk.status]}</td>
                <td className="p-2.5">{z.vermerk.am ? `${datumDe(z.vermerk.am)}${z.vermerk.von ? ` · ${z.vermerk.von}` : ''}` : '–'}</td>
                <td className="p-2.5">
                  {z.vermerk.offenePunkte?.length
                    ? <ul className="list-disc pl-4 space-y-0.5">{z.vermerk.offenePunkte.map((p, i) => <li key={i}>{p}</li>)}</ul>
                    : '–'}
                </td>
              </tr>
            ))}
            {sichtbar.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center text-text-main/60">Keine Module für diese Auswahl.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MeineModule;
