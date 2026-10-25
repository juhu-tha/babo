import { ZEMENT_DATA } from '@/src/calc/mischung';
import inhalt from '@/content/mischungsberechnung/daten.json';

export const zementData = ZEMENT_DATA;

export const festigkeitsklassen = ['32.5 N', '32.5 R', '42.5 N', '42.5 R', '52.5 N', '52.5 R'];

export const KONSISTENZ_DATA: Record<string, { label: string, waterMod: number }> = {
  'C0': { label: inhalt.werte.c0SehrSteif, waterMod: -40 },
  'C1': { label: 'C1 (steif)', waterMod: -30 },
  'C2': { label: inhalt.werte.c2Plastisch, waterMod: -15 },
  'C3': { label: 'C3 (weich)', waterMod: 0 },
  'F1': { label: 'F1 (steif)', waterMod: -30 },
  'F2': { label: inhalt.werte.f2Plastisch, waterMod: -15 },
  'F3': { label: inhalt.werte.f3WeichStandard, waterMod: 0 },
  'F4': { label: inhalt.werte.f4SehrWeich, waterMod: 15 },
  'F5': { label: inhalt.werte.f5Fließfähig, waterMod: 30 },
  'F6': { label: inhalt.werte.f6SehrFließfähig, waterMod: 45 },
};

export const KORN_WATER_BASE: Record<number, number> = {
  8: 210,
  16: 190,
  32: 175
};

export const BAUTEILE = inhalt.daten.BAUTEILE;

export const EXPOSITIONSKLASSEN: Record<string, { name: string, desc: string, wZ: number, minFestigkeit: string, minZement: number, minFestigkeitNum: number, cMin?: number, maxZement?: number }> = inhalt.daten.EXPOSITIONSKLASSEN;

export const allExpClasses = Object.keys(EXPOSITIONSKLASSEN);

export type Rezeptur = {
  name: string;
  zementArt: string;
  zementFestigkeit: string;
  zement: number;
  wz: number;
  fa: number;
  sf: number;
  hues: number;
  zusatzmittel: number;
  luft: number;
  groesstkorn: 8 | 16 | 32;
  f04: number;
  f48: number;
  f816: number;
  f1632: number;
  stahlfaser?: number;
  ppFaser?: number;
};

export const rezepturen: Record<string, Rezeptur> = {
  'Hochbau (Standard)': {
    name: inhalt.werte.hochbauStandard, zementArt: 'CEM II/A', zementFestigkeit: '32.5 R', zement: 300, wz: 0.60, fa: 0, sf: 0, hues: 0, zusatzmittel: 0, luft: 2.0, groesstkorn: 16, f04: 45, f48: 20, f816: 35, f1632: 0, stahlfaser: 0, ppFaser: 0
  },
  'Stahlfaserbeton (Industrieboden)': {
    name: inhalt.werte.stahlfaserbetonIndustrieboden, zementArt: 'CEM I', zementFestigkeit: '42.5 N', zement: 340, wz: 0.48, fa: 40, sf: 0, hues: 0, zusatzmittel: 2.5, luft: 1.5, groesstkorn: 16, f04: 45, f48: 25, f816: 30, f1632: 0, stahlfaser: 35, ppFaser: 0
  },
  'Tunnelbeton (Brandschutz PP-Faser)': {
    name: inhalt.werte.tunnelbetonBrandschutzPpFaser, zementArt: 'CEM I', zementFestigkeit: '42.5 R', zement: 360, wz: 0.44, fa: 50, sf: 0, hues: 0, zusatzmittel: 3.5, luft: 2.0, groesstkorn: 16, f04: 45, f48: 20, f816: 35, f1632: 0, stahlfaser: 0, ppFaser: 1.5
  },
  'Ingenieurbau (Brücke)': {
    name: inhalt.werte.ingenieurbauBrücke, zementArt: 'CEM I', zementFestigkeit: '42.5 N', zement: 340, wz: 0.45, fa: 0, sf: 0, hues: 0, zusatzmittel: 2, luft: 2.0, groesstkorn: 32, f04: 35, f48: 15, f816: 20, f1632: 30, stahlfaser: 0, ppFaser: 0
  },
  'Bohrpfahl': {
    name: 'Bohrpfahl', zementArt: 'CEM III/A', zementFestigkeit: '32.5 N', zement: 380, wz: 0.55, fa: 0, sf: 0, hues: 0, zusatzmittel: 3, luft: 2.0, groesstkorn: 16, f04: 45, f48: 20, f816: 35, f1632: 0, stahlfaser: 0, ppFaser: 0
  },
  'Massenbeton': {
    name: 'Massenbeton', zementArt: 'CEM III/B', zementFestigkeit: '32.5 N', zement: 280, wz: 0.55, fa: 0, sf: 0, hues: 0, zusatzmittel: 0, luft: 2.0, groesstkorn: 32, f04: 35, f48: 15, f816: 20, f1632: 30, stahlfaser: 0, ppFaser: 0
  },
  'Spritzbeton': {
    name: 'Spritzbeton', zementArt: 'CEM I', zementFestigkeit: '42.5 R', zement: 400, wz: 0.45, fa: 0, sf: 0, hues: 0, zusatzmittel: 4, luft: 2.0, groesstkorn: 8, f04: 60, f48: 40, f816: 0, f1632: 0, stahlfaser: 40, ppFaser: 0
  },
  'Straßendecken': {
    name: 'Straßendecken', zementArt: 'CEM I', zementFestigkeit: '42.5 N', zement: 350, wz: 0.45, fa: 0, sf: 0, hues: 0, zusatzmittel: 1, luft: 4.5, groesstkorn: 32, f04: 30, f48: 15, f816: 25, f1632: 30, stahlfaser: 0, ppFaser: 0
  },
  'SVB (Selbstverdichtend)': {
    name: inhalt.werte.svbSelbstverdichtend, zementArt: 'CEM I', zementFestigkeit: '42.5 R', zement: 380, wz: 0.40, fa: 100, sf: 0, hues: 0, zusatzmittel: 6, luft: 2.0, groesstkorn: 16, f04: 50, f48: 20, f816: 30, f1632: 0, stahlfaser: 0, ppFaser: 0
  },
  'Leichtbeton (LC20/22)': {
    name: inhalt.werte.leichtbetonLc2022, zementArt: 'CEM I', zementFestigkeit: '42.5 N', zement: 350, wz: 0.50, fa: 0, sf: 0, hues: 0, zusatzmittel: 3, luft: 3.0, groesstkorn: 16, f04: 40, f48: 30, f816: 30, f1632: 0, stahlfaser: 0, ppFaser: 0
  },
  'Infraleichtbeton (ILC)': {
    name: inhalt.werte.infraleichtbetonIlc, zementArt: 'CEM I', zementFestigkeit: '52.5 R', zement: 400, wz: 0.45, fa: 0, sf: 30, hues: 0, zusatzmittel: 5, luft: 4.0, groesstkorn: 16, f04: 30, f48: 35, f816: 35, f1632: 0, stahlfaser: 0, ppFaser: 0
  },
  'UHPC': {
    name: 'UHPC', zementArt: 'CEM I', zementFestigkeit: '52.5 R', zement: 700, wz: 0.20, fa: 0, sf: 150, hues: 0, zusatzmittel: 20, luft: 1.5, groesstkorn: 8, f04: 100, f48: 0, f816: 0, f1632: 0, stahlfaser: 120, ppFaser: 0
  }
};

export const FEUCHTIGKEITSKLASSEN = inhalt.daten.FEUCHTIGKEITSKLASSEN;
