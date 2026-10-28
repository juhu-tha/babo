import React from 'react';
import { teilmodulFamilie } from '../../registry/teilmodule';
import { MODUL_KERN } from '../../registry/kern';
import { modulPfad } from '../../routing/pfad';

/**
 * Navigation zwischen den Teilmodulen eines aufgeteilten Moduls (src/registry/teilmodule.ts, 28.10.2026):
 * „Teil 1 von 2“ mit Links auf alle Teile, der aktuelle Teil mit aria-current. Echte Links (/modul/<id>),
 * damit vorgerenderte Seiten und Suchmaschinen die Teile verbinden; in der App wechselt ein Klick die Route.
 */
export function TeilmodulNavigation({ aktiv, oeffne }: { aktiv: string; oeffne: (id: string) => void }) {
  const familie = teilmodulFamilie(aktiv);
  if (!familie) return null;
  const nr = familie.teile.indexOf(aktiv) + 1;
  return (
    <nav aria-label="Teilmodule dieses Themas" className="mb-3 flex flex-wrap items-center gap-2 text-xs">
      <span className="font-semibold text-text-main/80">Teil {nr} von {familie.teile.length}:</span>
      <ol className="flex flex-wrap gap-2">
        {familie.teile.map((id, i) => {
          const an = id === aktiv;
          return (
            <li key={id}>
              <a href={modulPfad(id)} aria-current={an ? 'page' : undefined}
                onClick={e => { e.preventDefault(); if (!an) oeffne(id); }}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 font-semibold transition-colors ${
                  an ? 'bg-shiraz/10 text-shiraz border-shiraz' : 'bg-white text-text-main border-home-grau/40 hover:border-shiraz hover:text-shiraz'}`}>
                <span aria-hidden="true">{i + 1}.</span>
                <span>{MODUL_KERN.get(id)?.label ?? id}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default TeilmodulNavigation;
