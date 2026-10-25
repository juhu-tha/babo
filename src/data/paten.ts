/**
 * Paten-Zuordnung je Cluster der Modulübersicht (Umsetzungsplan Phase 6, AP 6.6).
 *
 * Die Patin bzw. der Pate eines Clusters koordiniert die fachliche Prüfung der Module dieses Clusters
 * (Prüfvermerke in src/data/pruefvermerke.ts). AUSZUFÜLLEN durch Prof. Dr.-Ing. Jürgen Huber –
 * leere Zeichenkette = noch nicht vergeben. Nur Namen eintragen, deren Veröffentlichung die
 * betreffende Person zugestimmt hat (die Zuordnung ist im Admin-Bereich sichtbar und Teil des Quelltexts).
 */
export type ClusterNr = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export interface PatenEintrag {
  /** Name der Patin / des Paten, leer = offen */
  pate: string;
  /** Vertretung, leer = keine */
  vertretung: string;
}

export const CLUSTER_NAMEN: Record<ClusterNr, string> = {
  I: 'Grundlagen & Labor',
  II: 'Materialien & Produkte',
  III: 'Entwurf & Bemessung',
  IV: 'Bestand & Nachhaltigkeit',
  V: 'Digitales & Praxis',
  VI: 'Studium & Lehre',
};

export const PATEN_JE_CLUSTER: Record<ClusterNr, PatenEintrag> = {
  I: { pate: '', vertretung: '' },
  II: { pate: '', vertretung: '' },
  III: { pate: '', vertretung: '' },
  IV: { pate: '', vertretung: '' },
  V: { pate: '', vertretung: '' },
  VI: { pate: '', vertretung: '' },
};

export function istClusterNr(c: string): c is ClusterNr {
  return c in PATEN_JE_CLUSTER;
}

/** Pate eines Clusters oder '' */
export function pateVon(cluster: string): string {
  return istClusterNr(cluster) ? PATEN_JE_CLUSTER[cluster].pate : '';
}
