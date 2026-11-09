import React from 'react';
import { ArrowRight, Grid } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { DIN1045_2_EXPOSITIONSKLASSEN } from '@/src/data/standards/din1045_2';
import { springeZu } from './Querverweis';

/**
 * Kompakte Kurzkarte der Expositionsklassen (AP 3.9).
 * Die vollständigen Klassen, Grenzwerte und Beispiele stehen ausschließlich im Modul
 * „Expositionsklassen“ (Route #expositionsklassen); andere Module betten nur diese Karte ein.
 * Klassencodes und -namen stammen aus der zentralen Normdatenbank (src/data/standards/din1045_2.ts).
 */
const GRUPPEN: { praefix: string; titel: string; bedeutung: string }[] = [
  { praefix: 'X0', titel: 'X0', bedeutung: 'Kein Korrosions- oder Angriffsrisiko (nur Beton ohne Bewehrung).' },
  { praefix: 'XC', titel: 'XC', bedeutung: 'Bewehrungskorrosion durch Karbonatisierung.' },
  { praefix: 'XD', titel: 'XD', bedeutung: 'Bewehrungskorrosion durch Chloride, ausgenommen Meerwasser (z. B. Taumittel).' },
  { praefix: 'XS', titel: 'XS', bedeutung: 'Bewehrungskorrosion durch Chloride aus Meerwasser.' },
  { praefix: 'XF', titel: 'XF', bedeutung: 'Frostangriff mit oder ohne Taumittel.' },
  { praefix: 'XA', titel: 'XA', bedeutung: 'Chemischer Angriff durch Böden, Grundwasser oder Abwässer.' },
  { praefix: 'XM', titel: 'XM', bedeutung: 'Verschleißbeanspruchung der Oberfläche (nationale Ergänzung DIN 1045-2).' },
];

export interface ExpositionsKurzkarteProps {
  /** Optionaler Einleitungssatz, der den Bezug zum einbettenden Modul herstellt */
  hinweis?: React.ReactNode;
  className?: string;
}

export function ExpositionsKurzkarte({ hinweis, className = '' }: ExpositionsKurzkarteProps) {
  const { setActiveTab } = useTabContext();
  const klassen = Object.values(DIN1045_2_EXPOSITIONSKLASSEN);
  return (
    <div className={`bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm ${className}`} data-kurzkarte="expositionsklassen">
      <h3 className="font-bold text-text-main flex items-center gap-2 mb-1 wie-h4">
        <Grid size={16} className="text-shiraz" /> Kurzkarte Expositionsklassen (DIN EN 206 / DIN 1045-2)
      </h3>
      <p className="text-xs text-text-main/70 leading-relaxed mb-3">
        {hinweis ?? 'Überblick über die Klassengruppen. Grenzwerte (w/z, Mindestfestigkeit, Zementgehalt, Luftporen) und Beispiele stehen im Modul Expositionsklassen.'}
      </p>
      <div className="divide-y divide-home-grau/15 border border-home-grau/20 rounded-lg overflow-hidden">
        {GRUPPEN.map(g => {
          const codes = klassen.filter(k => k.code.startsWith(g.praefix));
          return (
            <div key={g.praefix} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 px-3 py-2 text-xs bg-off-white/40">
              <span className="font-mono font-bold text-shiraz w-10 shrink-0">{g.titel}</span>
              <span className="flex-1 text-text-main/80">{g.bedeutung}</span>
              <span className="flex flex-wrap gap-1">
                {codes.map(k => (
                  <span key={k.code} title={`${k.code}: ${k.name}`} className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white border border-home-grau/30 text-text-main/80">
                    {k.code}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-text-main/60 mt-2">
        Zusätzlich ist für die Alkali-Kieselsäure-Reaktion eine Feuchtigkeitsklasse (WO, WF, WA, WS) festzulegen.
      </p>
      <button
        type="button"
        onClick={() => springeZu(setActiveTab, 'expositionsklassen')}
        className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-shiraz text-white text-xs font-bold hover:bg-shiraz/90 transition-colors cursor-pointer"
      >
        Zum Modul Expositionsklassen <ArrowRight size={14} />
      </button>
    </div>
  );
}

export default ExpositionsKurzkarte;
