import inhalt from '@/content/holzbaubeta/daten.json';
import { holzKennwerte } from '@/src/data/kennwerte';
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

// Kennwerte zentral aus src/data/kennwerte.ts (DIN EN 338:2016, DIN EN 14080:2013)
const zeile = (klasse: string, type: string): WoodMaterial => {
  const k = holzKennwerte(klasse);
  if (!k) throw new Error(`Holzklasse ${klasse} fehlt in src/data/kennwerte.ts`);
  return { class: klasse, type, f_mk: k.fmk, f_t0k: k.ft0k, f_c0k: k.fc0k, f_vk: k.fvk, E_0mean: k.E0mean, E_005: k.E005, rho_k: k.rhok, rho_mean: k.rhoMean };
};

export const woodMaterials: WoodMaterial[] = [
  zeile('C24', inhalt.werte.nadelholzS10),
  zeile('C30', inhalt.werte.nadelholzS13),
  zeile('D30', inhalt.werte.laubholzEn3382016),
  zeile('D40', inhalt.werte.laubholzEn33820162),
  zeile('GL24h', inhalt.werte.brettschichtholzHomogen),
  zeile('GL28c', inhalt.werte.brettschichtholzKombiniert),
  zeile('GL30h', inhalt.werte.brettschichtholzHomogen2),
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
    uValue: 0.41, // nachgerechnet aus den Schichten (λ: BSP 0,13, Splitt 0,70, MW 0,035, CAF 1,2; R_si = 2 · 0,17), vorher 0,32 – Modulprüfung Tranche 10
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
    uValue: 0.16, // Lehrbeispiel, nicht klassifiziert; nachgerechnet nach DIN EN ISO 6946 mit Sparrenanteil 80/750 = 10,7 % (λ: KVH 0,13, flexible Holzfaser 0,038, Unterdeckplatte 0,045, Hanf 0,040, GKF 0,25; R_si = R_se = 0,10; R_T = (R′ + R″)/2 → U = 0,156), vorher 0,14 ohne Sparrenanteil – Umsetzung 02.11.2026 (NS4-HW-1)
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
