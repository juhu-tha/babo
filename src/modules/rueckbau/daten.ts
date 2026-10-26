import inhalt from '@/content/rueckbau/daten.json';
// Define TS Types for the components
export interface Pollutant {
  name: string;
  chemical: string;
  foundIn: string;
  probability: 'Sehr hoch' | 'Hoch' | 'Mittel' | 'Gering';
  handling: string;
  rules: string;
}

export interface EraData {
  title: string;
  description: string;
  dominantMaterials: string[];
  pollutants: Pollutant[];
}

export const baustoffRecyclingData = inhalt.daten.baustoffRecyclingData;
