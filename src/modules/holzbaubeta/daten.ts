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
  { class: 'C24', type: 'Nadelholz (S10)', f_mk: 24, f_t0k: 14.5, f_c0k: 21, f_vk: 4.0, E_0mean: 11000, E_005: 7400, rho_k: 350, rho_mean: 420 },
  { class: 'C30', type: 'Nadelholz (S13)', f_mk: 30, f_t0k: 19, f_c0k: 24, f_vk: 4.0, E_0mean: 12000, E_005: 8000, rho_k: 380, rho_mean: 460 },
  { class: 'D30', type: 'Laubholz (EN 338:2016)', f_mk: 30, f_t0k: 18, f_c0k: 24, f_vk: 3.9, E_0mean: 11000, E_005: 9200, rho_k: 530, rho_mean: 640 },
  { class: 'D40', type: 'Laubholz (EN 338:2016)', f_mk: 40, f_t0k: 24, f_c0k: 27, f_vk: 4.2, E_0mean: 13000, E_005: 10900, rho_k: 550, rho_mean: 660 },
  { class: 'GL24h', type: 'Brettschichtholz (homogen)', f_mk: 24, f_t0k: 19.2, f_c0k: 24, f_vk: 3.5, E_0mean: 11500, E_005: 9600, rho_k: 385, rho_mean: 420 },
  { class: 'GL28c', type: 'Brettschichtholz (kombiniert)', f_mk: 28, f_t0k: 19.5, f_c0k: 24, f_vk: 3.5, E_0mean: 12500, E_005: 10400, rho_k: 390, rho_mean: 430 },
  { class: 'GL30h', type: 'Brettschichtholz (homogen)', f_mk: 30, f_t0k: 24, f_c0k: 30, f_vk: 3.5, E_0mean: 13600, E_005: 11300, rho_k: 430, rho_mean: 480 },
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
    name: 'Außenwand in Holzrahmenbauweise',
    type: 'Aussenwand',
    structure: 'Putzträgerplatte + Holzständer (160 mm Steinwolle) + Hanf-Faserplatte + Gipsfaserplatte raumseitig',
    uValue: 0.18,
    fireClass: 'REI 60',
    soundRating: 48,
    components: [
      'Silikonharzputz mit Gewebearmierung (10 mm)',
      'Holzfaserdämmplatte Typ HFD-Putzträger (40 mm)',
      'Konstruktionsvollholz-Ständer b/h = 60/160 mm e = 62,5 cm, ausgefacht mit Mineralwolle',
      'OSB/3-Platte als Dampfbremse & aussteifende Plattenlage (15 mm, Fugen luftdicht abgeklebt)',
      'Installationsebene unterkonstruiert, ausgefacht mit Holzfaserdämmstoff (40 mm)',
      'Gipsfaserplatte Typ GF als raumseitige Beplankung (12,5 mm)'
    ]
  },
  {
    id: 'aw_clt_01',
    name: 'Außenwand in Massivholzbauweise (CLT / BSP)',
    type: 'Aussenwand',
    structure: 'Verkleideter CLT-Kern (90 mm 3-schichtig) + Holzfaser-WDVS (160 mm) + mineralischer Putz',
    uValue: 0.16,
    fireClass: 'REI 90 (Kapselkriterium K₂30)',
    soundRating: 51,
    components: [
      'Außenputzsystem mineralisch (12 mm)',
      'Holzfaserdämmplatte HFD-U (160 mm)',
      'Brettsperrholz-Wandelement CLT (90 mm, 3 Schichten kreuzweise verklebt)',
      'Installationsebene unterkonstruiert mit Justierschwingen (50 mm), gedämmt mit Hanffaser',
      'Doppelte Gipsplattenbeplankung Gipsfaser / Gipskarton (2 x 12,5 mm)'
    ]
  },
  {
    id: 'de_clt_01',
    name: 'Geschossdecke Brettsperrholz mit Estrich',
    type: 'Decke',
    structure: 'CLT-Tragschale (140 mm) + gebundene Splittschüttung (60 mm) + Trittschalldämmung + Heizestrich',
    uValue: 0.32,
    fireClass: 'REI 60 / REI 90 (klassifiziert ab 140 mm CLT)',
    soundRating: 62,
    components: [
      'Anhydrit-Fließestrich als Heizestrich (65 mm)',
      'PE-Feldtrennfolie',
      'Trittschalldämmplatte Mineralwolle Typ TDPT (30 mm, s\' ≤ 15 MN/m³)',
      'Gebundene schwere Splittschüttung als Masse-Lage zur Tiefton-Dämpfung (60 mm, ca. 120 kg/m²)',
      'Rieselschutzpapier',
      'Brettsperrholz-Deckenplatte CLT (140 mm, 5 Schichten, Sichtqualität unten)'
    ]
  },
  {
    id: 'da_sd_01',
    name: 'Steildach mit Zwischen- und Untersparrendämmung',
    type: 'Dach',
    structure: 'Ziegeldeck + Unterdachbahn + Sparren (200 mm Holzfaser) + Klimamembran + raumseitige Gipsfaser',
    uValue: 0.14,
    fireClass: 'REI 30',
    soundRating: 46,
    components: [
      'Dachziegel / Betondachsteine',
      'Traglattung und Konterlattung (Hinterlüftungsebene, 40/60 mm)',
      'Unterdeckplatte aus Holzfasern, wasserableitend Typ HFD-UD (35 mm)',
      'Konstruktionsvollholz-Konstruktionssparren 80/200 mm, e = 75 cm, Gefach ausgedämmt mit flexibler Holzfaser (200 mm)',
      'Feuchtevariable Dampfbremse (s_d-Wert feuchteabhängig, z. B. 0,5 bis 5 m; ermöglicht sommerliche Rücktrocknung)',
      'Unterkonstruktion gedämmt mit Hanfmatten (40 mm)',
      'Gipskarton-Feuerschutzplatte Typ GKF raumseitig (15 mm)'
    ]
  }
];
