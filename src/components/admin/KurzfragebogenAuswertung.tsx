import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { adminAuthHeaders } from '@/src/utils/adminAuth';
import { KF_ITEMS, KF_SKALA, semesterText } from '@/src/data/kurzfragebogen';
import { formatDeGanzzahl, formatDeZahl } from '@/src/utils/numberFormat';

/** Auswertung des anonymen Kurzfragebogens im Admin-Bereich (Umsetzungsplan Phase 6, AP 6.9) */
interface ItemStat { verteilung: number[]; n: number; mittelwert: number | null }
interface SemesterStat { teilnahmen: number; items: Record<string, ItemStat>; freitexte: string[] }
interface Antwort { aktuell: string; semester: Record<string, SemesterStat> }

export function KurzfragebogenAuswertung() {
  const [daten, setDaten] = useState<Antwort | null>(null);
  const [fehler, setFehler] = useState('');
  const [semester, setSemester] = useState('');
  const [laedt, setLaedt] = useState(false);

  const laden = async () => {
    setLaedt(true);
    setFehler('');
    try {
      const res = await fetch('/api/feedback/stats', { headers: adminAuthHeaders(), cache: 'no-store' });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setFehler(d.error || 'Auswertung nicht verfügbar.'); return; }
      const a = d as Antwort;
      setDaten(a);
      setSemester(s => s || (a.semester[a.aktuell] ? a.aktuell : Object.keys(a.semester).sort().pop() ?? a.aktuell));
    } catch {
      setFehler('Server nicht erreichbar.');
    } finally {
      setLaedt(false);
    }
  };

  useEffect(() => { void laden(); }, []);

  const sem = daten?.semester[semester];
  const alleSemester = daten ? Object.keys(daten.semester).sort().reverse() : [];

  return (
    <div className="space-y-5">
      <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
        <p>
          Zählwerte des anonymen Kurzfragebogens je Semester (Skala 1 = {KF_SKALA[0]} bis 5 = {KF_SKALA[4]}).
          Freitexte sind ohne Zeitpunkt und ohne Zuordnung zu den Bewertungen gespeichert. Die Daten liegen in einer
          Datei im Server-Container und gehen bei einem Neustart oder einer neuen Revision verloren.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs font-bold text-text-main space-y-1">
          <span className="block">Semester</span>
          <select value={semester} onChange={e => setSemester(e.target.value)} className="px-3 py-2 rounded-lg border border-home-grau/30 bg-white text-sm">
            {alleSemester.length === 0 && <option value="">noch keine Daten</option>}
            {alleSemester.map(s => <option key={s} value={s}>{semesterText(s)}</option>)}
          </select>
        </label>
        <button type="button" onClick={() => void laden()} disabled={laedt} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-home-grau/30 text-xs font-bold cursor-pointer hover:bg-off-white">
          <RefreshCw size={14} aria-hidden="true" /> {laedt ? 'Lädt …' : 'Aktualisieren'}
        </button>
      </div>
      {fehler && <p role="alert" className="text-xs font-bold text-red-700">{fehler}</p>}
      {daten && !sem && !fehler && <p className="text-sm text-text-main/70">Für dieses Semester liegen noch keine Antworten vor.</p>}
      {sem && (
        <>
          <p className="text-sm font-semibold">{formatDeGanzzahl(sem.teilnahmen)} Teilnahmen im {semesterText(semester)}</p>
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Verteilung je Aussage">
            <table className="w-full text-left text-xs border border-home-grau/20 rounded-lg">
              <thead className="bg-off-white border-b border-home-grau/20">
                <tr>
                  <th scope="col" className="p-2.5 font-bold">Aussage</th>
                  {[1, 2, 3, 4, 5].map(w => <th key={w} scope="col" className="p-2.5 font-bold text-right">{formatDeGanzzahl(w)}</th>)}
                  <th scope="col" className="p-2.5 font-bold text-right">n</th>
                  <th scope="col" className="p-2.5 font-bold text-right">Mittelwert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/15">
                {KF_ITEMS.map(i => {
                  const st = sem.items[i.id];
                  return (
                    <tr key={i.id}>
                      <td className="p-2.5">{i.text}</td>
                      {[0, 1, 2, 3, 4].map(k => <td key={k} className="p-2.5 text-right">{formatDeGanzzahl(st?.verteilung[k] ?? 0)}</td>)}
                      <td className="p-2.5 text-right">{formatDeGanzzahl(st?.n ?? 0)}</td>
                      <td className="p-2.5 text-right">{st?.mittelwert == null ? '–' : formatDeZahl(st.mittelwert, 2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <section className="space-y-2">
            <h4 className="text-sm font-bold">Freitexte ({formatDeGanzzahl(sem.freitexte.length)})</h4>
            {sem.freitexte.length === 0
              ? <p className="text-xs text-text-main/70">Keine Freitexte.</p>
              : <ul className="space-y-2">{sem.freitexte.map((t, i) => <li key={i} className="p-3 rounded-lg border border-home-grau/20 bg-white text-xs whitespace-pre-wrap">{t}</li>)}</ul>}
          </section>
        </>
      )}
    </div>
  );
}

export default KurzfragebogenAuswertung;
