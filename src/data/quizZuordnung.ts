/**
 * Zuordnung der Quizfragen zu Modulen, Menügruppen und Clustern (Umsetzungsplan Phase 3, AP 3.1).
 * clusterId und clusterName werden NICHT mehr in quiz.json gepflegt, sondern hier aus der
 * Modul-Registry abgeleitet. tests/quiz.test.ts prüft, dass jede Frage zugeordnet werden kann.
 */
import { MODUL_BY_ID, TAB_ALIASES, type ModulId } from '../registry/modules';
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
  zfp: 'bauwerksuntersuchung',
  ki_baustoffe: 'ki_ueberblick',
  materialitaet_architektur: 'kombinationen',
};

export type ClusterNummer = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export function quizRoute(moduleId: string): ModulId | undefined {
  const aliase: Readonly<Record<string, ModulId>> = TAB_ALIASES;
  const id = QUIZ_MODUL_ROUTE[moduleId] ?? aliase[moduleId] ?? moduleId;
  return MODUL_BY_ID.has(id) ? (id as ModulId) : undefined;
}

export function quizGruppe(moduleId: string): string | undefined {
  const r = quizRoute(moduleId);
  return r ? MODUL_BY_ID.get(r)?.gruppe : undefined;
}

export function quizCluster(moduleId: string): { id: ClusterNummer; name: string } | undefined {
  const g = quizGruppe(moduleId);
  const c = g ? META_CLUSTERS.find(m => m.groupNames.includes(g)) : undefined;
  return c ? { id: c.number as ClusterNummer, name: c.name } : undefined;
}
