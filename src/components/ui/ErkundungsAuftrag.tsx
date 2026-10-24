import React, { useId, useState } from 'react';
import { ChevronDown, FlaskConical, Eye, EyeOff } from 'lucide-react';
import type { Erkundung } from '@/src/data/erkundung';

/**
 * Box „Ausprobieren“ für Rechner-Module (Umsetzungsplan Phase 3, AP 3.7):
 * 2–3 Vorhersagefragen. Studierende notieren zuerst ihre Erwartung, prüfen sie im Rechner
 * und blenden dann die Auflösung ein. Die Notizen bleiben nur im Speicher der Seite.
 */
export function ErkundungsAuftrag({ daten }: { daten: Erkundung }) {
  const [offen, setOffen] = useState(false);
  const [sichtbar, setSichtbar] = useState<Record<number, boolean>>({});
  const [notiz, setNotiz] = useState<Record<number, string>>({});
  const id = useId();
  return (
    <section aria-label="Ausprobieren" className="mb-4 rounded-xl border border-home-grau/30 bg-white text-sm">
      <button type="button" aria-expanded={offen} aria-controls={id} onClick={() => setOffen(!offen)}
        className="w-full flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-left">
        <span className="flex items-center gap-2 font-bold text-shiraz"><FlaskConical size={16} aria-hidden="true" /> Ausprobieren</span>
        <span className="text-xs text-text-main/70">{daten.auftraege.length} Vorhersagen zum Rechner</span>
        <ChevronDown size={16} aria-hidden="true" className={`ml-auto transition-transform ${offen ? 'rotate-180' : ''}`} />
      </button>
      {offen && (
        <div id={id} className="px-4 pb-4 pt-1 border-t border-home-grau/20 space-y-4">
          <p className="text-xs text-text-main/80">Notieren Sie zuerst Ihre Erwartung, prüfen Sie sie im Rechner und vergleichen Sie dann mit der Auflösung.</p>
          <ol className="space-y-4 list-decimal pl-5">
            {daten.auftraege.map((a, i) => (
              <li key={i} className="space-y-2">
                <p className="font-semibold text-text-main">{a.frage}</p>
                {a.hinweis && <p className="text-xs text-text-main/70">{a.hinweis}</p>}
                <label className="block">
                  <span className="sr-only">Ihre Erwartung zu Auftrag {i + 1}</span>
                  <textarea rows={2} value={notiz[i] ?? ''} onChange={e => setNotiz({ ...notiz, [i]: e.target.value })}
                    placeholder="Meine Erwartung …"
                    className="w-full rounded-lg border border-home-grau/40 bg-off-white px-3 py-2 text-xs" />
                </label>
                <button type="button" aria-expanded={!!sichtbar[i]} onClick={() => setSichtbar({ ...sichtbar, [i]: !sichtbar[i] })}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-shiraz underline underline-offset-2">
                  {sichtbar[i] ? <EyeOff size={13} aria-hidden="true" /> : <Eye size={13} aria-hidden="true" />}
                  {sichtbar[i] ? 'Auflösung ausblenden' : 'Auflösung zeigen'}
                </button>
                {sichtbar[i] && <p className="rounded-lg bg-off-white border border-home-grau/30 px-3 py-2 text-xs leading-relaxed">{a.aufloesung}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

export default ErkundungsAuftrag;
