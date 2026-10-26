import inhalt from '@/content/nachhaltigkeitdatenregeln/daten.json';
export interface SdgItem {
  num: number;
  title: string;
  fullName: string;
  englishTitle: string;
  badgeBg: string;
  bauRelevant: boolean;
  relevanceLabel?: string;
  baupraxis: string;
  measures: string[];
}

export const ALL_17_SDGS: SdgItem[] = inhalt.daten.ALL_17_SDGS;
