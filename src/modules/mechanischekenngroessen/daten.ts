import inhalt from '@/content/mechanischekenngroessen/daten.json';
import { BAUSTAHL_EC3, E_BAUSTAHL } from '@/src/data/kennwerte';
export interface MaterialData {
  id: string;
  name: string;
  kategorie: 'Metall' | 'Mineralisch' | 'Organisch' | 'Verbund' | 'Glas';
  E: number; // MPa
  nu: number; // Querdehnzahl [-]
  fy: number; // Streckgrenze / Druckfestigkeit MPa
  fu: number; // Zugfestigkeit MPa
  epsBreak: number; // Bruchdehnung %
  dichte: number; // kg/m³
  alphaT: number; // 10^-6 / K
  phiKriechen?: number; // typische Kriechzahl
  epsSchwinden?: number; // typisches Endschwindmaß in ‰
  beschreibung: string;
}

export const MATERIALIEN: Record<string, MaterialData> = {
  s235: {
    id: 's235',
    name: inhalt.werte.baustahlS235jr,
    kategorie: 'Metall',
    E: E_BAUSTAHL,
    nu: 0.30,
    fy: BAUSTAHL_EC3.S235.fy,
    fu: BAUSTAHL_EC3.S235.fu,
    epsBreak: 26.0,
    dichte: 7850,
    alphaT: 12.0,
    phiKriechen: 0.0, // bei Raumtemperatur vernachlässigbar
    epsSchwinden: 0.0,
    beschreibung: inhalt.werte.duktilerStandardBaustahlMit
  },
  s355: {
    id: 's355',
    name: inhalt.werte.baustahlS355j2,
    kategorie: 'Metall',
    E: E_BAUSTAHL,
    nu: 0.30,
    fy: BAUSTAHL_EC3.S355.fy,
    fu: BAUSTAHL_EC3.S355.fu, // EN 1993-1-1 Tab. 3.1, t ≤ 40 mm (vorher 510)
    epsBreak: 22.0,
    dichte: 7850,
    alphaT: 12.0,
    phiKriechen: 0.0,
    epsSchwinden: 0.0,
    beschreibung: inhalt.werte.höherfesterKonstruktionsbaustahlFürSchla
  },
  beton_c30: {
    id: 'beton_c30',
    name: inhalt.werte.normalbetonC3037,
    kategorie: 'Mineralisch',
    E: 33000,
    nu: 0.20,
    fy: 38, // mittlere Zylinderdruckfestigkeit fcm
    fu: 2.9, // fctm
    epsBreak: 0.35, // Bruchdehnung Druck ca. 3,5 ‰
    dichte: 2400,
    alphaT: 10.0,
    phiKriechen: 2.2, // Kriechzahl φ ca. 2,0 bis 2,5
    epsSchwinden: -0.45, // ca. -0,45 ‰
    beschreibung: inhalt.werte.sprödesHeterogenesMehrphasenmaterialZeig
  },
  holz_c24: {
    id: 'holz_c24',
    name: inhalt.werte.nadelholzC24Parallel,
    kategorie: 'Organisch',
    E: 11000,
    nu: 0.05,
    fy: 21, // fc0k
    fu: 14.5, // ft0k
    epsBreak: 0.8,
    dichte: 420,
    alphaT: 5.0,
    phiKriechen: 0.8, // k_def Beiwert 0,6 bis 2,0
    epsSchwinden: -0.20, // hygroskopisches Schwindmaß parallel zur Faser
    beschreibung: inhalt.werte.anisotroperNaturbaustoffMitHoher
  },
  alu_6060: {
    id: 'alu_6060',
    name: inhalt.werte.aluminiumEnAw6060,
    kategorie: 'Metall',
    E: 70000,
    nu: 0.33,
    fy: 160, // Rp0,2
    fu: 215,
    epsBreak: 12.0,
    dichte: 2700,
    alphaT: 23.0,
    phiKriechen: 0.0,
    epsSchwinden: 0.0,
    beschreibung: inhalt.werte.leichtmetallMitGeringemE
  },
  glas_float: {
    id: 'glas_float',
    name: inhalt.werte.bauglasKalkNatronFloatglas,
    kategorie: 'Glas',
    E: 70000,
    nu: 0.23,
    fy: 800, // theoretische Druckfestigkeit
    fu: 45, // Biegezugfestigkeit Floatglas
    epsBreak: 0.1,
    dichte: 2500,
    alphaT: 9.0,
    phiKriechen: 0.0,
    epsSchwinden: 0.0,
    beschreibung: inhalt.werte.vollkommenLinearElastischesIdeal
  },
  cfk_lamelle: {
    id: 'cfk_lamelle',
    name: inhalt.werte.cfkLamelleCarbonfaserverstärkt,
    kategorie: 'Verbund',
    E: 165000,
    nu: 0.30,
    fy: 2800,
    fu: 2800,
    epsBreak: 1.7,
    dichte: 1600,
    alphaT: -0.2,
    phiKriechen: 0.05,
    epsSchwinden: 0.0,
    beschreibung: inhalt.werte.hochleistungsVerbundwerkstoffFürDie
  }
};
