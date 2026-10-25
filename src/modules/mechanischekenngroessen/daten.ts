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
    name: 'Baustahl S235JR',
    kategorie: 'Metall',
    E: 210000,
    nu: 0.30,
    fy: 235,
    fu: 360,
    epsBreak: 26.0,
    dichte: 7850,
    alphaT: 12.0,
    phiKriechen: 0.0, // bei Raumtemperatur vernachlässigbar
    epsSchwinden: 0.0,
    beschreibung: 'Duktiler Standard-Baustahl mit ausgeprägter Fließgrenze, konstanter Dehnsteifigkeit und hoher Verformungsreserve.'
  },
  s355: {
    id: 's355',
    name: 'Baustahl S355J2',
    kategorie: 'Metall',
    E: 210000,
    nu: 0.30,
    fy: 355,
    fu: 510,
    epsBreak: 22.0,
    dichte: 7850,
    alphaT: 12.0,
    phiKriechen: 0.0,
    epsSchwinden: 0.0,
    beschreibung: 'Höherfester Konstruktionsbaustahl für schlanke Tragwerke im Hoch- und Brückenbau mit identischem E-Modul wie S235.'
  },
  beton_c30: {
    id: 'beton_c30',
    name: 'Normalbeton C30/37',
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
    beschreibung: 'Sprödes, heterogenes Mehrphasenmaterial. Zeigt ausgeprägtes Kriechen und Schwinden über Monate bis Jahre.'
  },
  holz_c24: {
    id: 'holz_c24',
    name: 'Nadelholz C24 (parallel)',
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
    beschreibung: 'Anisotroper Naturbaustoff mit hoher spezifischer Steifigkeit längs zur Faser und Feuchtekriechen (k_def).'
  },
  alu_6060: {
    id: 'alu_6060',
    name: 'Aluminium EN AW-6060 T6',
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
    beschreibung: 'Leichtmetall mit geringem E-Modul (1/3 des Stahls), aber hervorragender Korrosionsbeständigkeit.'
  },
  glas_float: {
    id: 'glas_float',
    name: 'Bauglas (Kalk-Natron-Floatglas)',
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
    beschreibung: 'Vollkommen linear-elastisches, ideal sprödes Material ohne plastische Fließzone und ohne Kriechverformung.'
  },
  cfk_lamelle: {
    id: 'cfk_lamelle',
    name: 'CFK-Lamelle (Carbonfaserverstärkt)',
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
    beschreibung: 'Hochleistungs-Verbundwerkstoff für die nachträgliche Bauwerksverstärkung im Bestand mit extrem geringer Relaxation.'
  }
};
