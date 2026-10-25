export interface MaterialDefinition {
  id: string;
  name: string;
  category: string;
  unit: "m³" | "t";
  densityKg: number; // kg per unit
  gwpA1A3: number;   // kg CO2-eq per unit (includes biogenic negative if organic)
  gwpC: number;      // kg CO2-eq per unit (re-release at End of Life)
  gwpD: number;      // kg CO2-eq per unit reference credit
  biogenicContent: number; // Amount of stored biogenic CO2 included in A1-A3
  umiScore: number;  // Urban Mining Index in % (stofflicher Verwertungsanteil)
  penrt: number;     // Primärenergie nicht-erneuerbar in MJ je Einheit
  description: string;
  defaultCircularQuota: number; // standardmäßiger kreislauffähiger Stoffanteil in %
  substitutesPrimary: string;   // verdrängter Primärwerkstoff
  defaultRecoveryType: 'high_grade' | 'downcycling' | 'reuse' | 'thermal';
}

export const MATERIAL_DATABASE: MaterialDefinition[] = [
  {
    id: "beton-cem1",
    name: "Normalbeton C25/30 (CEM I)",
    category: "Mineralisch (Massivbau)",
    unit: "m³",
    densityKg: 2400,
    gwpA1A3: 245,
    gwpC: 15,
    gwpD: -8,
    biogenicContent: 0,
    umiScore: 65,
    penrt: 1100,
    description: "Klassischer Konstruktionsbeton mit hohem Zementklinker-Anteil. Verursacht starke CO₂-Emissionen bei der Klinkerentsäuerung.",
    defaultCircularQuota: 65,
    substitutesPrimary: "Primärkies / Schottertragschicht im Erdbau",
    defaultRecoveryType: "downcycling"
  },
  {
    id: "beton-cem3",
    name: "Klimaschonender Beton (CEM III/A - Hüttensand)",
    category: "Mineralisch (Massivbau)",
    unit: "m³",
    densityKg: 2400,
    gwpA1A3: 135,
    gwpC: 15,
    gwpD: -8,
    biogenicContent: 0,
    umiScore: 70,
    penrt: 780,
    description: "Beton mit hohem Hüttensand-Substitut. Reduziert die Herstellungs-Emissionen (A1-A3) um rund 45%.",
    defaultCircularQuota: 70,
    substitutesPrimary: "Primärkies & Schotter",
    defaultRecoveryType: "downcycling"
  },
  {
    id: "beton-cem2-cm",
    name: "Klinkereffizienter Beton C25/30 (CEM II/C-M S-LL)",
    category: "Mineralisch (Massivbau)",
    unit: "m³",
    densityKg: 2400,
    gwpA1A3: 155,
    gwpC: 15,
    gwpD: -9,
    biogenicContent: 0,
    umiScore: 68,
    penrt: 850,
    description: "Moderner Zementtyp nach DIN EN 197-5 mit reduziertem Klinkeranteil durch kombinierte Zumahlung von Hüttensand und Kalksteinmehl.",
    defaultCircularQuota: 68,
    substitutesPrimary: "Primärkies & Splitte",
    defaultRecoveryType: "downcycling"
  },
  {
    id: "rc-beton",
    name: "Recyclingbeton RC-C25/30 (Typ 1, min. 25% RC)",
    category: "Mineralisch (Zirkulär)",
    unit: "m³",
    densityKg: 2350,
    gwpA1A3: 145,
    gwpC: 14,
    gwpD: -22,
    biogenicContent: 0,
    umiScore: 88,
    penrt: 760,
    description: "Beton mit rezyklierter Gesteinskörnung nach DIN 1045-2 / Ersatzbaustoffverordnung (EBV). Schont Primärkies und erhöht Modul D Gutschriften.",
    defaultCircularQuota: 88,
    substitutesPrimary: "Primärkies & Neuzement (Kreislaufbeton)",
    defaultRecoveryType: "high_grade"
  },
  {
    id: "geopolymer-beton",
    name: "Zementfreier Geopolymer-Beton (alkaliaktiviert)",
    category: "Mineralisch (Zirkulär)",
    unit: "m³",
    densityKg: 2350,
    gwpA1A3: 85,
    gwpC: 12,
    gwpD: -15,
    biogenicContent: 0,
    umiScore: 80,
    penrt: 520,
    description: "Innovative Bindemittelmatrix ohne Portlandklinker auf Basis aktivierter Schlacken/Flugaschen mit bis zu 65% Treibhausgaseinsparung.",
    defaultCircularQuota: 80,
    substitutesPrimary: "Primärgesteinskörnung",
    defaultRecoveryType: "downcycling"
  },
  {
    id: "ziegel",
    name: "Hintermauerziegel (unverfüllt)",
    category: "Mineralisch (Massivbau)",
    unit: "m³",
    densityKg: 800,
    gwpA1A3: 165,
    gwpC: 8,
    gwpD: -5,
    biogenicContent: 0,
    umiScore: 55,
    penrt: 950,
    description: "Gebranntes Tonmaterial. Sehr langlebig, aber wärmeintensiver Brennprozess mit fossilen Energieträgern.",
    defaultCircularQuota: 55,
    substitutesPrimary: "Ziegelbruch / Pflasterbettung / Schotter",
    defaultRecoveryType: "downcycling"
  },
  {
    id: "baustahl",
    name: "Baustahl (Profilstahl / Bewehrung)",
    category: "Metallisch",
    unit: "t",
    densityKg: 7850,
    gwpA1A3: 1100, // 1.1 kg CO2-eq per kg
    gwpC: 45,
    gwpD: -750, // High recycling recovery credits
    biogenicContent: 0,
    umiScore: 95,
    penrt: 18500,
    description: "Konstruktionsstahl. Enormer spezifischer Energiebedarf bei Herstellung, dafür sehr gut kreislauffähig (Modul D Gutschrift).",
    defaultCircularQuota: 95,
    substitutesPrimary: "Primär-Rohstahl (Hochofen-Route / Koks)",
    defaultRecoveryType: "high_grade"
  },
  {
    id: "kvh",
    name: "Konstruktionsvollholz (Nadelholz)",
    category: "Nachwachsend (Holzbau)",
    unit: "m³",
    densityKg: 500,
    gwpA1A3: -740, // Lehrwert: biogener Kohlenstoff nach DIN EN 16449 (500 kg/m³ bei u = 12 %: ca. -820 kg CO2) + ca. 80 kg fossile Herstellung
    gwpC: 820,    // Freisetzung des biogenen Kohlenstoffs bei thermischer Verwertung (Modul C3)
    gwpD: -180,   // Energy recovery credit (thermal substitutes)
    biogenicContent: 820,
    umiScore: 85,
    penrt: 1650,
    description: "Nadelholz technisch getrocknet. Speichert große Mengen biogenen Kohlenstoffs (negativer A1-A3-Wert!), welcher am Lebensende emittiert wird.",
    defaultCircularQuota: 85,
    substitutesPrimary: "Fossile Brennstoffe / Sekundär-Holzwerkstoffe",
    defaultRecoveryType: "thermal"
  },
  {
    id: "clt",
    name: "Brettsperrholz / Massivholzelement (CLT)",
    category: "Nachwachsend (Holzbau)",
    unit: "m³",
    densityKg: 520,
    gwpA1A3: -720, // Lehrwert: biogener Kohlenstoff nach DIN EN 16449 (520 kg/m³ bei u = 12 %: ca. -850 kg CO2) + ca. 130 kg fossile Herstellung (Kleben, Pressen)
    gwpC: 850,
    gwpD: -190,
    biogenicContent: 850,
    umiScore: 80,
    penrt: 2100,
    description: "Kreuzweise verleimte Schichten. Hervorragend geeignet für tragende Wände und Deckenplatten im modernen ökologischen Holzwohnbau.",
    defaultCircularQuota: 80,
    substitutesPrimary: "Wiederverwendung / Spanplatten / Fernwärme",
    defaultRecoveryType: "thermal"
  },
  {
    id: "hbv-decke",
    name: "Holz-Beton-Verbundelement (HBV mit CLT + CEM III)",
    category: "Hybridkonstruktion",
    unit: "m³",
    densityKg: 1100,
    gwpA1A3: -95,
    gwpC: 380,
    gwpD: -120,
    biogenicContent: 340,
    umiScore: 78,
    penrt: 2600,
    description: "Kombination aus Holz auf Zug und Aufbeton auf Druck. Hoher Schall- und Brandschutz bei reduzierter Betondicke und CO₂-Speicherung.",
    defaultCircularQuota: 78,
    substitutesPrimary: "Mischverwertung (Holz thermisch / Beton RC)",
    defaultRecoveryType: "downcycling"
  },
  {
    id: "lehm-bauplatte",
    name: "Lehmbauplatte / Stampflehm (zirkulär)",
    category: "Naturbaustoffe",
    unit: "m³",
    densityKg: 1400,
    gwpA1A3: 28,
    gwpC: 2,
    gwpD: -12,
    biogenicContent: 0,
    umiScore: 98,
    penrt: 180,
    description: "Ungebrannter Tonlehm mit Pflanzenfasern. Nahezu emissionsfreie Herstellung, hervorragende Feuchtepufferung und 100% zirkulär reversibel.",
    defaultCircularQuota: 98,
    substitutesPrimary: "Neulehm / Gipsplatten (100% Reversibel)",
    defaultRecoveryType: "reuse"
  },
  {
    id: "hanfkalk",
    name: "Hanfkalk / Kalkhanf (Monolithisch)",
    category: "Naturbaustoffe",
    unit: "m³",
    densityKg: 420,
    gwpA1A3: -185,
    gwpC: 45,
    gwpD: -40,
    biogenicContent: 220,
    umiScore: 92,
    penrt: 410,
    description: "Mischung aus Hanfschäben und hydraulischem Baukalk. Verhält sich als dauerhafter Kohlenstoffspeicher mit hoher Dämmleistung.",
    defaultCircularQuota: 92,
    substitutesPrimary: "Bodenverbesserer / Gesteinskörnung für Kalkmörtel",
    defaultRecoveryType: "downcycling"
  },
  {
    id: "eps-daemmung",
    name: "EPS-Hartschaumplatte (Styropor)",
    category: "Wärmedämmung (Fossil)",
    unit: "m³",
    densityKg: 20,
    gwpA1A3: 78,
    gwpC: 58,    // Incineration at End of Life releases carbon
    gwpD: -25,
    biogenicContent: 0,
    umiScore: 25,
    penrt: 1850,
    description: "Polystyrol-Dämmplatte. Günstig und hochgedämmt, jedoch erdölbasiert und mit thermischer Entsorgungslast.",
    defaultCircularQuota: 25,
    substitutesPrimary: "Müllverbrennung (fossile Dampfgewinnung)",
    defaultRecoveryType: "thermal"
  },
  {
    id: "zellulose",
    name: "Einblasdämmung Zellulose (Altpapier)",
    category: "Wärmedämmung (Ökologisch)",
    unit: "m³",
    densityKg: 45,
    gwpA1A3: -115, // Biogenic offset in paper pulp
    gwpC: 130,
    gwpD: -35,
    biogenicContent: 130,
    umiScore: 85,
    penrt: 220,
    description: "Dämmstoff aus zerkleinertem Altpapier. Geringe Aufbereitungsenergie und sehr gute Einbindung biogener Kohlenstoffspeicher.",
    defaultCircularQuota: 85,
    substitutesPrimary: "Biomasse-Verwertung / Nachnutzung",
    defaultRecoveryType: "thermal"
  },
  {
    id: "holzfaser-daemmung",
    name: "Holzfaserdämmplatte (Druckfest)",
    category: "Wärmedämmung (Ökologisch)",
    unit: "m³",
    densityKg: 140,
    gwpA1A3: -190,
    gwpC: 230,
    gwpD: -70,
    biogenicContent: 230,
    umiScore: 85,
    penrt: 1100,
    description: "Druckfeste Dämmung aus Restholzfasern für Dach, Wand und Putzträger. Sehr guter sommerlicher Hitzeschutz durch hohe Wärmespeicherkapazität.",
    defaultCircularQuota: 85,
    substitutesPrimary: "Kaskadennutzung / Biomasse-Heizwerk",
    defaultRecoveryType: "thermal"
  },
  {
    id: "schaumglas",
    name: "Schaumglasschotter (100% Recyclingglas)",
    category: "Dämmung & Gründung (Zirkulär)",
    unit: "m³",
    densityKg: 160,
    gwpA1A3: 42,
    gwpC: 5,
    gwpD: -28,
    biogenicContent: 0,
    umiScore: 95,
    penrt: 580,
    description: "Druckfeste lastabtragende Perimeterdämmung unter Bodenplatten. Hergestellt aus 100% Altglas, unverrottbar und vollständig wiedergewinnbar.",
    defaultCircularQuota: 95,
    substitutesPrimary: "Neuglas / XPS-Perimeterdämmung",
    defaultRecoveryType: "reuse"
  },
  {
    id: "strohballen",
    name: "Strohballendämmung (Baustroh ETA)",
    category: "Naturbaustoffe",
    unit: "m³",
    densityKg: 110,
    gwpA1A3: -140,
    gwpC: 155,
    gwpD: -25,
    biogenicContent: 155,
    umiScore: 90,
    penrt: 95,
    description: "Landwirtschaftliches Nebenprodukt. Extrem geringe Herstellenergie, hervorragende CO₂-Senke und bauaufsichtlich zugelassen.",
    defaultCircularQuota: 90,
    substitutesPrimary: "Kompostierung / Humusaufbau / Biogas",
    defaultRecoveryType: "reuse"
  }
];

export interface CustomRow {
  id: string;
  materialId: string;
  quantity: number;
  circularQuota: number; // dynamischer kreislauffähiger Stoffanteil in % (0 - 100%)
  sortingRate: number;   // Sortenreinheit / Rückbautrennbarkeit in % (0 - 100%)
  recoveryType: 'high_grade' | 'downcycling' | 'reuse' | 'thermal';
}

export interface ScenarioPreset {
  name: string;
  description: string;
  badge: string;
  bgClass: string;
  borderClass: string;
  bgDarkClass: string;
  bgf: number;
  buildingType: "wohnbau" | "nichtwohnbau";
  rows: { 
    materialId: string; 
    quantity: number;
    circularQuota?: number;
    sortingRate?: number;
    recoveryType?: 'high_grade' | 'downcycling' | 'reuse' | 'thermal';
  }[];
}

export const PRESETS: ScenarioPreset[] = [
  {
    name: "Szenario A: Konventioneller Massivbau",
    description: "Klassische Ziegelaußenwand (36,5 cm) mit Stahlbetondecken (CEM I) und EPS-Dämmung. Geringe Zirkularitätsquoten.",
    badge: "Fossil-Mineralisch",
    bgClass: "bg-rose-50/40 border-rose-100",
    borderClass: "border-rose-200",
    bgDarkClass: "dark:bg-red-950/20 dark:border-rose-900/30",
    bgf: 140,
    buildingType: "wohnbau",
    rows: [
      { materialId: "beton-cem1", quantity: 36, circularQuota: 35, sortingRate: 75, recoveryType: "downcycling" },
      { materialId: "ziegel", quantity: 45, circularQuota: 25, sortingRate: 70, recoveryType: "downcycling" },
      { materialId: "baustahl", quantity: 2.5, circularQuota: 90, sortingRate: 85, recoveryType: "high_grade" },
      { materialId: "eps-daemmung", quantity: 16, circularQuota: 15, sortingRate: 50, recoveryType: "thermal" }
    ]
  },
  {
    name: "Szenario B: Klinkerreduzierter Massivbau",
    description: "Ressourcenschonende Massivbauweise mit CEM III/A-Hüttensandbeton, RC-Beton und Zellulosedämmung.",
    badge: "Klinkeroptimiert ⚡",
    bgClass: "bg-amber-50/40 border-amber-100",
    borderClass: "border-amber-200",
    bgDarkClass: "dark:bg-amber-950/20 dark:border-amber-900/30",
    bgf: 140,
    buildingType: "wohnbau",
    rows: [
      { materialId: "beton-cem3", quantity: 22, circularQuota: 70, sortingRate: 85, recoveryType: "downcycling" },
      { materialId: "rc-beton", quantity: 16, circularQuota: 88, sortingRate: 90, recoveryType: "high_grade" },
      { materialId: "ziegel", quantity: 40, circularQuota: 60, sortingRate: 80, recoveryType: "downcycling" },
      { materialId: "baustahl", quantity: 2.2, circularQuota: 95, sortingRate: 95, recoveryType: "high_grade" },
      { materialId: "zellulose", quantity: 20, circularQuota: 85, sortingRate: 85, recoveryType: "thermal" }
    ]
  },
  {
    name: "Szenario C: Moderner Holz-Hybridbau",
    description: "Brettsperrholz-Wände (CLT), Holz-Beton-Verbunddecken (HBV) und Holzfaserdämmung mit hoher Kaskadennutzung.",
    badge: "Biogen-Hybrid 🌿",
    bgClass: "bg-emerald-50/40 border-emerald-100",
    borderClass: "border-emerald-200",
    bgDarkClass: "dark:bg-emerald-950/20 dark:border-emerald-900/30",
    bgf: 140,
    buildingType: "wohnbau",
    rows: [
      { materialId: "beton-cem3", quantity: 10, circularQuota: 70, sortingRate: 85, recoveryType: "downcycling" },
      { materialId: "hbv-decke", quantity: 18, circularQuota: 78, sortingRate: 80, recoveryType: "downcycling" },
      { materialId: "clt", quantity: 22, circularQuota: 85, sortingRate: 90, recoveryType: "reuse" },
      { materialId: "kvh", quantity: 6, circularQuota: 90, sortingRate: 92, recoveryType: "reuse" },
      { materialId: "baustahl", quantity: 0.8, circularQuota: 98, sortingRate: 98, recoveryType: "high_grade" },
      { materialId: "holzfaser-daemmung", quantity: 18, circularQuota: 85, sortingRate: 85, recoveryType: "thermal" }
    ]
  },
  {
    name: "Szenario D: Zirkulärer Lehm- & Naturbaustoffbau",
    description: "Konsequente Kreislaufbauweise aus Holzständer, Lehmbauplatten, Hanfkalk und Schaumglasschotter. Maximale Modul-D-Gutschriften.",
    badge: "100% Zirkulär ♻️",
    bgClass: "bg-teal-50/40 border-teal-100",
    borderClass: "border-teal-200",
    bgDarkClass: "dark:bg-teal-950/20 dark:border-teal-900/30",
    bgf: 140,
    buildingType: "wohnbau",
    rows: [
      { materialId: "schaumglas", quantity: 25, circularQuota: 95, sortingRate: 95, recoveryType: "reuse" },
      { materialId: "kvh", quantity: 14, circularQuota: 95, sortingRate: 95, recoveryType: "reuse" },
      { materialId: "lehm-bauplatte", quantity: 15, circularQuota: 98, sortingRate: 98, recoveryType: "reuse" },
      { materialId: "hanfkalk", quantity: 24, circularQuota: 92, sortingRate: 90, recoveryType: "downcycling" },
      { materialId: "strohballen", quantity: 20, circularQuota: 90, sortingRate: 90, recoveryType: "reuse" },
      { materialId: "baustahl", quantity: 0.3, circularQuota: 98, sortingRate: 98, recoveryType: "high_grade" }
    ]
  }
];
