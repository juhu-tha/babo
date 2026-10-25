import inhalt from '@/content/holzbaubeta/daten.json';
// Solid timber & engineered wood database for Tab 2
export interface WoodMaterial {
  class: string;
  type: string; // KVH, BSH, Vollholz, etc.
  f_mk: number; // charakteristische Biegefestigkeit N/mm²
  f_t0k: number; // Zugfestigkeit parallel N/mm²
  f_c0k: number; // Druckfestigkeit parallel N/mm²
  f_vk: number; // charakteristische Scherfestigkeit N/mm²
  E_0mean: number; // mittlerer Elastizitätsmodul N/mm²
  E_005: number; // 5%-Quantil E-Modul N/mm²
  rho_k: number; // charakteristische Rohdichte kg/m³
  rho_mean: number; // mittlere Rohdichte kg/m³
}

export const woodMaterials: WoodMaterial[] = [
  { class: 'C24', type: inhalt.werte.nadelholzS10, f_mk: 24, f_t0k: 14.5, f_c0k: 21, f_vk: 4.0, E_0mean: 11000, E_005: 7400, rho_k: 350, rho_mean: 420 },
  { class: 'C30', type: inhalt.werte.nadelholzS13, f_mk: 30, f_t0k: 19, f_c0k: 24, f_vk: 4.0, E_0mean: 12000, E_005: 8000, rho_k: 380, rho_mean: 460 },
  { class: 'D30', type: inhalt.werte.laubholzEn3382016, f_mk: 30, f_t0k: 18, f_c0k: 24, f_vk: 3.9, E_0mean: 11000, E_005: 9200, rho_k: 530, rho_mean: 640 },
  { class: 'D40', type: inhalt.werte.laubholzEn33820162, f_mk: 40, f_t0k: 24, f_c0k: 27, f_vk: 4.2, E_0mean: 13000, E_005: 10900, rho_k: 550, rho_mean: 660 },
  { class: 'GL24h', type: inhalt.werte.brettschichtholzHomogen, f_mk: 24, f_t0k: 19.2, f_c0k: 24, f_vk: 3.5, E_0mean: 11500, E_005: 9600, rho_k: 385, rho_mean: 420 },
  { class: 'GL28c', type: inhalt.werte.brettschichtholzKombiniert, f_mk: 28, f_t0k: 19.5, f_c0k: 24, f_vk: 3.5, E_0mean: 12500, E_005: 10400, rho_k: 390, rho_mean: 430 },
  { class: 'GL30h', type: inhalt.werte.brettschichtholzHomogen2, f_mk: 30, f_t0k: 24, f_c0k: 30, f_vk: 3.5, E_0mean: 13600, E_005: 11300, rho_k: 430, rho_mean: 480 },
];

// dataholz.eu construction database
export interface DataholzConstruction {
  id: string;
  name: string;
  type: 'Aussenwand' | 'Innenwand' | 'Decke' | 'Dach';
  structure: string; // Kurzbeschreibung Aufbau
  uValue: number; // W/(m²K)
  fireClass: string; // z.B. REI 60, REI 90, EI 30
  soundRating: number; // Rw in dB
  components: string[];
}

export const dataholzConstructions: DataholzConstruction[] = [
  {
    id: 'aw_hfr_01',
    name: inhalt.werte.außenwandInHolzrahmenbauweise,
    type: 'Aussenwand',
    structure: inhalt.werte.putzträgerplatteHolzständer160Mm,
    uValue: 0.18,
    fireClass: 'REI 60',
    soundRating: 48,
    components: [
      inhalt.werte.silikonharzputzMitGewebearmierung10,
      inhalt.werte.holzfaserdämmplatteTypHfdPutzträger,
      inhalt.werte.konstruktionsvollholzStänderBH,
      inhalt.werte.osb3PlatteAls,
      inhalt.werte.installationsebeneUnterkonstruiertAusgef,
      inhalt.werte.gipsfaserplatteTypGfAls
    ]
  },
  {
    id: 'aw_clt_01',
    name: inhalt.werte.außenwandInMassivholzbauweiseClt,
    type: 'Aussenwand',
    structure: inhalt.werte.verkleideterCltKern90,
    uValue: 0.16,
    fireClass: 'REI 90 (Kapselkriterium K₂30)',
    soundRating: 51,
    components: [
      inhalt.werte.außenputzsystemMineralisch12Mm,
      inhalt.werte.holzfaserdämmplatteHfdU160,
      inhalt.werte.brettsperrholzWandelementClt90,
      inhalt.werte.installationsebeneUnterkonstruiertMitJus,
      inhalt.werte.doppelteGipsplattenbeplankungGipsfaserGi
    ]
  },
  {
    id: 'de_clt_01',
    name: inhalt.werte.geschossdeckeBrettsperrholzMitEstrich,
    type: 'Decke',
    structure: inhalt.werte.cltTragschale140Mm,
    uValue: 0.32,
    fireClass: 'REI 60 / REI 90 (klassifiziert ab 140 mm CLT)',
    soundRating: 62,
    components: [
      inhalt.werte.anhydritFließestrichAlsHeizestrich,
      'PE-Feldtrennfolie',
      inhalt.werte.trittschalldämmplatteMineralwolleTypTdpt,
      inhalt.werte.gebundeneSchwereSplittschüttungAls,
      'Rieselschutzpapier',
      inhalt.werte.brettsperrholzDeckenplatteClt140
    ]
  },
  {
    id: 'da_sd_01',
    name: inhalt.werte.steildachMitZwischenUnd,
    type: 'Dach',
    structure: inhalt.werte.ziegeldeckUnterdachbahnSparren200,
    uValue: 0.14,
    fireClass: 'REI 30',
    soundRating: 46,
    components: [
      inhalt.werte.dachziegelBetondachsteine,
      inhalt.werte.traglattungUndKonterlattungHinterlüftung,
      inhalt.werte.unterdeckplatteAusHolzfasernWasserableit,
      inhalt.werte.konstruktionsvollholzKonstruktionssparre,
      inhalt.werte.feuchtevariableDampfbremseSD,
      inhalt.werte.unterkonstruktionGedämmtMitHanfmatten,
      inhalt.werte.gipskartonFeuerschutzplatteTypGkf
    ]
  }
];
