import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface KopfEintrag {
  /** stabiler Schlüssel (z. B. 'lernziele') */
  id: string;
  /** Beschriftung der Schaltfläche */
  label: string;
  /** optionaler Zusatz in der Schaltfläche, z. B. Anzahl */
  zusatz?: string;
  icon: React.ReactNode;
  inhalt: React.ReactNode;
}

/**
 * Kopfleiste eines Fachmoduls (Entscheidung 28.10.2026): Lernziele, „Das Wichtigste in 5 Punkten“, „Ausprobieren“
 * und „Annahmen des Rechners“ als kleine Schaltflächen nebeneinander; standardmäßig alles eingeklappt, höchstens
 * ein Bereich offen. Die Bereiche bleiben im HTML (hidden), damit Vorrendern und Suche sie enthalten und Notizen
 * in „Ausprobieren“ beim Umschalten erhalten bleiben.
 */
export function ModulKopfLeiste({ eintraege }: { eintraege: readonly KopfEintrag[] }) {
  const [offen, setOffen] = useState<string | null>(null);
  const basis = useId();
  if (!eintraege.length) return null;
  const pid = (id: string) => `${basis}-${id}`;
  return (
    <div className="mb-4">
      <div role="group" aria-label="Hilfen zum Modul" className="flex flex-wrap gap-2">
        {eintraege.map(e => {
          const an = offen === e.id;
          return (
            <button key={e.id} type="button" aria-expanded={an} aria-controls={pid(e.id)}
              onClick={() => setOffen(an ? null : e.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                an ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-shiraz border-shiraz/30 hover:bg-shiraz/5'}`}>
              {e.icon}
              <span>{e.label}</span>
              {e.zusatz && <span className={an ? 'text-white' : 'text-text-main/70'}>({e.zusatz})</span>}
              <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${an ? 'rotate-180' : ''}`} />
            </button>
          );
        })}
      </div>
      {eintraege.map(e => (
        <section key={e.id} id={pid(e.id)} aria-label={e.label} hidden={offen !== e.id}
          className="mt-2 rounded-xl border border-home-grau/30 bg-white px-4 py-3 text-sm space-y-3">
          {e.inhalt}
        </section>
      ))}
    </div>
  );
}

export default ModulKopfLeiste;
