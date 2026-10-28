/**
 * Zuordnung der Quizfragen zu Modulen, Menügruppen und Clustern (Umsetzungsplan Phase 3, AP 3.1).
 * clusterId und clusterName werden NICHT mehr in quiz.json gepflegt, sondern hier aus der
 * Modul-Registry abgeleitet. tests/quiz.test.ts prüft, dass jede Frage zugeordnet werden kann.
 */
import { MODUL_KERN, TAB_ALIASES } from '../registry/kern';
import type { ModulId } from '../registry/modules';
import { META_CLUSTERS } from './metaClusters';

/** Quiz-moduleIds, die keine eigene Route sind → Route, in der die Inhalte stehen */
export const QUIZ_MODUL_ROUTE: Readonly<Record<string, ModulId>> = {
  beton: 'beton_info',
  massivbau: 'stahlbeton_info',
  holzbau: 'holzbau_info',
  typische_bauschaeden: 'schadensbilder',
  zustandsbewertung: 'vdi6200',
  ce_kennzeichnung: 'bp_recht_grundlagen',
  bp_recht: 'bp_recht_grundlagen',
  bp_verkehrswegebau: 'bp_verkehr_rsto',
  kriechen_schwinden: 'hydratation_folgen',
  eigenspannungen: 'hydratation_folgen',
  ki_baustoffe: 'ki_ueberblick',
};

export type ClusterNummer = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export function quizRoute(moduleId: string): ModulId | undefined {
  const aliase: Readonly<Record<string, ModulId>> = TAB_ALIASES;
  const id = QUIZ_MODUL_ROUTE[moduleId] ?? aliase[moduleId] ?? moduleId;
  return MODUL_KERN.has(id) ? (id as ModulId) : undefined;
}

/** Routen ohne Menügruppe (nur per Direktlink erreichbar) mit eigenem Selbsttest → Route, deren Menügruppe und Cluster gelten */
export const QUIZ_GRUPPE_VON: Readonly<Record<string, ModulId>> = {
  zwang: 'hydratation_folgen',
};

export function quizGruppe(moduleId: string): string | undefined {
  const r = quizRoute(moduleId);
  return r ? MODUL_KERN.get(QUIZ_GRUPPE_VON[r] ?? r)?.gruppe : undefined;
}

export function quizCluster(moduleId: string): { id: ClusterNummer; name: string } | undefined {
  const g = quizGruppe(moduleId);
  const c = g ? META_CLUSTERS.find(m => m.groupNames.includes(g)) : undefined;
  return c ? { id: c.number as ClusterNummer, name: c.name } : undefined;
}

/**
 * Routen, deren Komponente keinen eigenen <ModulTest moduleId="<route>"> enthält (geteilte Komponenten wie
 * Beispielrechnungen, BpVerkehrswegebau, HolzbauBeta). Für sie blendet App.tsx den Selbsttest unter dem Modul ein.
 * tests/quiz.test.ts prüft, dass jede Frage in genau einem Selbsttest erscheint.
 */
export const MODULTEST_IN_APP: ReadonlySet<string> = new Set([
  'beton_info', 'betonkennwerte', 'bp_recht_grundlagen', 'bp_recht_konformitaet',
  'bp_verkehr_asphalt', 'bp_verkehr_bahn', 'bp_verkehr_betondecken', 'bp_verkehr_bitumen', 'bp_verkehr_pruefung',
  'bp_verkehr_rsto', 'bp_verkehr_tiefbau', 'bp_verkehr_tunnel',
  'holzbau_bauphysik', 'holzbau_bemessung', 'holzbau_konstruktion', 'holzbau_verbindung', 'holzbau_werkstoffe',
  'rechnung_bestand', 'rechnung_beton', 'rechnung_brandschutz', 'rechnung_holzbau', 'rechnung_mauerwerk',
  'rechnung_nachhaltigkeit', 'rechnung_schallschutz', 'rechnung_stahlbeton', 'rechnung_u_wert',
  'spannbeton_grundlagen', 'spannbeton_kennwerte', 'stahlbeton_info',
  'labor_sicherheit', 'zwang',
]);
