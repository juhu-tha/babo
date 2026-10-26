/**
 * Modul-Registry für den Einstieg (Umsetzungsplan Phase 5, AP 5.5 Nachtrag): Menü, Kopfzeile, Routing.
 * Daten aus ./kernDaten.ts (im Build vorab ausgewertet, s. scripts/registryKern.ts). Meta-Beschreibungen,
 * Suchbegriffe und Baum-Kurztexte stehen in ./modules.ts; Beschreibungen und Suchbegriffe kommen als eigene
 * Auszüge bei Bedarf (ladeBeschreibungen, ladeSuchbegriffe).
 */
import { KERN_ZEILEN, KERN_ALIASE, KERN_GRUPPEN } from './kernDaten';
import type { ModulId, AliasId, NavGruppe, ModulTyp, NavGruppeDef } from './modules';

export interface ModulKern {
  id: ModulId;
  label: string;
  icon: string;
  gruppe?: NavGruppe;
  /** baum.titel (Titel in der Modulübersicht) */
  titel?: string;
  /** baum.typ */
  typ?: ModulTyp;
}

export const MODUL_KERN: ReadonlyMap<string, ModulKern> = new Map(KERN_ZEILEN.map(([id, label, icon, gruppe, titel, typ]) => [id, {
  id: id as ModulId, label, icon,
  ...(gruppe ? { gruppe: gruppe as NavGruppe } : {}),
  ...(titel ? { titel } : {}),
  ...(typ ? { typ: typ as ModulTyp } : {}),
}]));

export const TAB_ALIASES = KERN_ALIASE as Readonly<Record<AliasId, ModulId>>;

/** Menügruppen in Anzeigereihenfolge (wie NAV_TAB_GRUPPEN in ./modules.ts) */
export const NAV_TAB_GRUPPEN: NavGruppeDef[] = KERN_GRUPPEN.map(name => ({
  name: name as NavGruppe,
  tabs: [...MODUL_KERN.values()].filter(m => m.gruppe === name).map(m => ({ id: m.id, label: m.label, icon: m.icon })),
}));

/** Meta-Beschreibungen bzw. Suchbegriffe bei Bedarf laden (Auszüge ./metaDaten.ts, ./suchDaten.ts) */
export const ladeBeschreibungen = (): Promise<Record<string, string>> => import('./metaDaten').then(m => m.TAB_DESCRIPTIONS);
export const ladeSuchbegriffe = (): Promise<Record<string, string[]>> => import('./suchDaten').then(m => m.TAB_KEYWORDS);
