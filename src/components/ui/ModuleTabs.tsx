import React, { useId, useRef } from 'react';

/**
 * Einheitliche Reiter für Module (Umsetzungsplan Phase 2, AP 2.8): ARIA-Tabs-Muster mit
 * Pfeiltasten (←/→, Pos1/Ende), „roving tabindex“ und zugehörigem Inhaltsbereich.
 *
 *   <ModuleTabs label="Bereiche" tabs={tabs} aktiv={tab} onWechsel={setTab}>
 *     {tab === 'a' && <A />}
 *   </ModuleTabs>
 */
export interface ModulTab<T extends string> {
  id: T;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;
  /** optionaler Kurzhinweis neben der Beschriftung (z. B. Anzahl oder Status), Teil des zugänglichen Namens */
  zusatz?: string;
}

interface Props<T extends string> {
  label: string;
  tabs: readonly ModulTab<T>[];
  aktiv: T;
  onWechsel: (id: T) => void;
  /** Darstellung: „pill“ (Standard, Schaltflächen) oder „kachel“ (Raster mit Symbol) */
  variante?: 'pill' | 'kachel';
  children?: React.ReactNode;
  className?: string;
  /** zusätzliche Klassen für den Inhaltsbereich (z. B. Abstände zwischen mehreren Blöcken) */
  panelKlasse?: string;
}

/** Zielreiter für eine Taste (←/→/↑/↓ zyklisch, Pos1/Ende); −1 = Taste nicht belegt. Exportiert für Tests. */
export function reiterZiel(taste: string, index: number, anzahl: number): number {
  if (anzahl <= 0) return -1;
  if (taste === 'ArrowRight' || taste === 'ArrowDown') return (index + 1) % anzahl;
  if (taste === 'ArrowLeft' || taste === 'ArrowUp') return (index - 1 + anzahl) % anzahl;
  if (taste === 'Home') return 0;
  if (taste === 'End') return anzahl - 1;
  return -1;
}

export function ModuleTabs<T extends string>({ label, tabs, aktiv, onWechsel, variante = 'pill', children, className = '', panelKlasse = '' }: Props<T>) {
  const basis = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, tabs.findIndex(t => t.id === aktiv));

  const taste = (e: React.KeyboardEvent) => {
    const ziel = reiterZiel(e.key, index, tabs.length);
    if (ziel < 0) return;
    e.preventDefault();
    onWechsel(tabs[ziel].id);
    refs.current[ziel]?.focus();
  };

  const listeKlasse = variante === 'kachel'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3'
    : 'flex flex-wrap gap-2';

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className={listeKlasse} onKeyDown={taste}>
        {tabs.map((t, i) => {
          const an = t.id === aktiv;
          const Icon = t.icon;
          const klasse = variante === 'kachel'
            ? `p-3.5 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-left h-full cursor-pointer ${an ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm' : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-700'}`
            : `px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${an ? 'bg-shiraz text-white border-shiraz shadow-md' : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'}`;
          return (
            <button
              key={t.id}
              ref={el => { refs.current[i] = el; }}
              type="button"
              role="tab"
              id={`${basis}-tab-${t.id}`}
              aria-selected={an}
              aria-controls={`${basis}-panel`}
              tabIndex={an ? 0 : -1}
              onClick={() => onWechsel(t.id)}
              className={klasse}
            >
              {Icon && <Icon size={variante === 'kachel' ? 18 : 16} aria-hidden={true} />}
              <span className={variante === 'kachel' ? 'text-xs font-bold leading-tight' : undefined}>{t.label}</span>
              {t.zusatz && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${an && variante === 'pill' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{t.zusatz}</span>
              )}
            </button>
          );
        })}
      </div>
      {children !== undefined && (
        <div role="tabpanel" id={`${basis}-panel`} aria-labelledby={`${basis}-tab-${aktiv}`} tabIndex={0} className={`focus:outline-none ${panelKlasse}`.trim()}>
          {children}
        </div>
      )}
    </div>
  );
}

export default ModuleTabs;
