// Cluster-Nummer (I–VI) je Modul laut Modulübersicht (BAUM_GRUPPEN). Aus src/data/pruefvermerke.ts ausgelagert,
// weil sie die volle Registry braucht; genutzt nur im Admin-Bereich („Meine Module“) und in Tests.
import { BAUM_GRUPPEN } from '../registry/modules';

const CLUSTER_NR: Record<string, string> = { cluster_1: 'I', cluster_2: 'II', cluster_3: 'III', cluster_4: 'IV', cluster_5: 'V', cluster_6: 'VI' };
const CLUSTER_VON = new Map<string, string>(BAUM_GRUPPEN.flatMap(g => (g.knoten as readonly string[]).map(id => [id, CLUSTER_NR[g.cluster] ?? ''] as [string, string])));

/** Cluster-Nummer (I–VI) eines Moduls laut Modulübersicht, sonst '' */
export function clusterVon(id: string): string {
  return CLUSTER_VON.get(id) ?? '';
}
