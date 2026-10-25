import React, { useRef } from 'react';
import { ModuleTabs, type ModulTab } from './ModuleTabs';

/**
 * Zweistufige Reiter (Umsetzungsplan Phase 3, AP 3.8): höchstens 7 thematische Hauptreiter,
 * darunter – nur wenn eine Gruppe mehrere Bereiche bündelt – eine zweite Reiterleiste.
 * Der Zustand bleibt die bisherige Bereichs-ID (T), damit Sprungziele (z. B. localStorage,
 * „Zu den Protokollen“-Schaltflächen) unverändert funktionieren.
 *
 *   <GruppierteModuleTabs label="Bereiche" gruppen={gruppen} aktiv={tab} onWechsel={setTab}>
 *     {tab === 'a' && <A />}
 *   </GruppierteModuleTabs>
 */
export interface ModulTabGruppe<T extends string> {
  id: string;
  label: string;
  icon?: ModulTab<string>['icon'];
  /** Bereiche dieser Gruppe; bei genau einem Eintrag entfällt die zweite Ebene */
  mitglieder: readonly ModulTab<T>[];
}

interface Props<T extends string> {
  label: string;
  gruppen: readonly ModulTabGruppe<T>[];
  aktiv: T;
  onWechsel: (id: T) => void;
  children?: React.ReactNode;
  className?: string;
}

/** Gruppe, die den aktiven Bereich enthält (sonst die erste). Exportiert für Tests. */
export function aktiveGruppe<T extends string>(gruppen: readonly ModulTabGruppe<T>[], aktiv: T): ModulTabGruppe<T> {
  return gruppen.find(g => g.mitglieder.some(m => m.id === aktiv)) ?? gruppen[0];
}

/** Bereich beim Wechsel auf Gruppe gid: zuletzt dort gewählter Bereich, sonst der erste. Exportiert für Tests. */
export function zielBeiGruppenwechsel<T extends string>(gruppen: readonly ModulTabGruppe<T>[], gid: string, zuletzt: Readonly<Record<string, T>>): T | undefined {
  const g = gruppen.find(x => x.id === gid);
  if (!g) return undefined;
  return zuletzt[gid] ?? g.mitglieder[0]?.id;
}

export function GruppierteModuleTabs<T extends string>({ label, gruppen, aktiv, onWechsel, children, className = '' }: Props<T>) {
  const gruppe = aktiveGruppe(gruppen, aktiv);
  const zuletzt = useRef<Record<string, T>>({});
  zuletzt.current[gruppe.id] = aktiv;

  const hauptReiter = gruppen.map(g => ({ id: g.id, label: g.label, icon: g.icon }));
  const wechsleGruppe = (gid: string) => {
    const ziel = zielBeiGruppenwechsel(gruppen, gid, zuletzt.current);
    if (ziel !== undefined) onWechsel(ziel);
  };

  return (
    <ModuleTabs label={label} tabs={hauptReiter} aktiv={gruppe.id} onWechsel={wechsleGruppe} className={className}>
      {gruppe.mitglieder.length > 1 ? (
        <ModuleTabs
          label={`${gruppe.label}: Unterbereiche`}
          tabs={gruppe.mitglieder}
          aktiv={aktiv}
          onWechsel={onWechsel}
          className="mt-3 [&>[role=tablist]]:pl-3 [&>[role=tablist]]:border-l-4 [&>[role=tablist]]:border-shiraz/30"
        >
          {children}
        </ModuleTabs>
      ) : children}
    </ModuleTabs>
  );
}

export default GruppierteModuleTabs;
