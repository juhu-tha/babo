import inhalt from '@/content/interactivelcacalc/daten.json';
import type { LcaBaustoff } from '@/src/calc/lca';
export interface MaterialDefinition {
  id: string;
  name: string;
  category: string;
  unit: "m³" | "t";
  densityKg: number; // kg per unit
  gwpA1A3: number;   // kg CO2-eq per unit (includes biogenic negative if organic)
  gwpC: number;      // kg CO2-eq per unit (re-release at End of Life)
  gwpD: number;      // kg CO₂-Äq. je Einheit, Referenz-Gutschrift für defaultRecoveryType und defaultCircularQuota
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
    name: inhalt.werte.normalbetonC2530Cem,
    category: inhalt.werte.mineralischMassivbau,
    unit: "m³",
    densityKg: 2400,
    gwpA1A3: 245,
    gwpC: 15,
    gwpD: -8,
    biogenicContent: 0,
    umiScore: 65,
    penrt: 1100,
    description: inhalt.werte.klassischerKonstruktionsbetonMitHohem,
    defaultCircularQuota: 65,
    substitutesPrimary: inhalt.werte.primärkiesSchottertragschichtImErdbau,
    defaultRecoveryType: "downcycling"
  },
  {
    id: "beton-cem3",
    name: inhalt.werte.klimaschonenderBetonCemIii,
    category: inhalt.werte.mineralischMassivbau2,
    unit: "m³",
    densityKg: 2400,
    gwpA1A3: 135,
    gwpC: 15,
    gwpD: -8,
    biogenicContent: 0,
    umiScore: 70,
    penrt: 780,
    description: inhalt.werte.betonMitHohemHüttensand,
    defaultCircularQuota: 70,
    substitutesPrimary: inhalt.werte.primärkiesSchotter,
    defaultRecoveryType: "downcycling"
  },
  {
    id: "beton-cem2-cm",
    name: inhalt.werte.klinkereffizienterBetonC2530,
    category: inhalt.werte.mineralischMassivbau3,
    unit: "m³",
    densityKg: 2400,
    gwpA1A3: 155,
    gwpC: 15,
    gwpD: -9,
    biogenicContent: 0,
    umiScore: 68,
    penrt: 850,
    description: inhalt.werte.modernerZementtypNachDin,
    defaultCircularQuota: 68,
    substitutesPrimary: inhalt.werte.primärkiesSplitte,
    defaultRecoveryType: "downcycling"
  },
  {
    id: "rc-beton",
    name: inhalt.werte.recyclingbetonRcC2530,
    category: inhalt.werte.mineralischZirkulär,
    unit: "m³",
    densityKg: 2350,
    gwpA1A3: 145,
    gwpC: 14,
    gwpD: -22,
    biogenicContent: 0,
    umiScore: 88,
    penrt: 760,
    description: inhalt.werte.betonMitRezyklierterGesteinskörnung,
    defaultCircularQuota: 88,
    substitutesPrimary: inhalt.werte.primärkiesNeuzementKreislaufbeton,
    defaultRecoveryType: "high_grade"
  },
  {
    id: "geopolymer-beton",
    name: inhalt.werte.zementfreierGeopolymerBetonAlkaliaktivie,
    category: inhalt.werte.mineralischZirkulär2,
    unit: "m³",
    densityKg: 2350,
    gwpA1A3: 85,
    gwpC: 12,
    gwpD: -15,
    biogenicContent: 0,
    umiScore: 80,
    penrt: 520,
    description: inhalt.werte.innovativeBindemittelmatrixOhnePortlandk,
    defaultCircularQuota: 80,
    substitutesPrimary: "Primärgesteinskörnung",
    defaultRecoveryType: "downcycling"
  },
  {
    id: "ziegel",
    name: inhalt.werte.hintermauerziegelUnverfüllt,
    category: inhalt.werte.mineralischMassivbau4,
    unit: "m³",
    densityKg: 800,
    gwpA1A3: 165,
    gwpC: 8,
    gwpD: -5,
    biogenicContent: 0,
    umiScore: 55,
    penrt: 950,
    description: inhalt.werte.gebranntesTonmaterialSehrLanglebig,
    defaultCircularQuota: 55,
    substitutesPrimary: inhalt.werte.ziegelbruchPflasterbettungSchotter,
    defaultRecoveryType: "downcycling"
  },
  {
    id: "baustahl",
    name: inhalt.werte.baustahlProfilstahlBewehrung,
    category: "Metallisch",
    unit: "t",
    densityKg: 7850,
    gwpA1A3: 1100, // 1.1 kg CO2-eq per kg
    gwpC: 45,
    gwpD: -750, // High recycling recovery credits
    biogenicContent: 0,
    umiScore: 95,
    penrt: 18500,
    description: inhalt.werte.konstruktionsstahlEnormerSpezifischerEne,
    defaultCircularQuota: 95,
    substitutesPrimary: inhalt.werte.primärRohstahlHochofenRoute,
    defaultRecoveryType: "high_grade"
  },
  {
    id: "kvh",
    name: inhalt.werte.konstruktionsvollholzNadelholz,
    category: inhalt.werte.nachwachsendHolzbau,
    unit: "m³",
    densityKg: 500,
    gwpA1A3: -740, // Lehrwert: biogener Kohlenstoff nach DIN EN 16449 (500 kg/m³ bei u = 12 %: ca. -820 kg CO2) + ca. 80 kg fossile Herstellung
    gwpC: 820,    // Freisetzung des biogenen Kohlenstoffs bei thermischer Verwertung (Modul C3)
    gwpD: -180,   // Energy recovery credit (thermal substitutes)
    biogenicContent: 820,
    umiScore: 85,
    penrt: 1650,
    description: inhalt.werte.nadelholzTechnischGetrocknetSpeichert,
    defaultCircularQuota: 85,
    substitutesPrimary: inhalt.werte.fossileBrennstoffeSekundärHolzwerkstoffe,
    defaultRecoveryType: "thermal"
  },
  {
    id: "clt",
    name: inhalt.werte.brettsperrholzMassivholzelementClt,
    category: inhalt.werte.nachwachsendHolzbau2,
    unit: "m³",
    densityKg: 520,
    gwpA1A3: -720, // Lehrwert: biogener Kohlenstoff nach DIN EN 16449 (520 kg/m³ bei u = 12 %: ca. -850 kg CO2) + ca. 130 kg fossile Herstellung (Kleben, Pressen)
    gwpC: 850,
    gwpD: -190,
    biogenicContent: 850,
    umiScore: 80,
    penrt: 2100,
    description: inhalt.werte.kreuzweiseVerleimteSchichtenHervorragend,
    defaultCircularQuota: 80,
    substitutesPrimary: inhalt.werte.wiederverwendungSpanplattenFernwärme,
    defaultRecoveryType: "thermal"
  },
  {
    id: "hbv-decke",
    name: inhalt.werte.holzBetonVerbundelementHbv,
    category: "Hybridkonstruktion",
    unit: "m³",
    densityKg: 1100,
    gwpA1A3: -95,
    gwpC: 380,
    gwpD: -120,
    biogenicContent: 340,
    umiScore: 78,
    penrt: 2600,
    description: inhalt.werte.kombinationAusHolzAuf,
    defaultCircularQuota: 78,
    substitutesPrimary: inhalt.werte.mischverwertungHolzThermischBeton,
    defaultRecoveryType: "downcycling"
  },
  {
    id: "lehm-bauplatte",
    name: inhalt.werte.lehmbauplatteStampflehmZirkulär,
    category: "Naturbaustoffe",
    unit: "m³",
    densityKg: 1400,
    gwpA1A3: 28,
    gwpC: 2,
    gwpD: -12,
    biogenicContent: 0,
    umiScore: 98,
    penrt: 180,
    description: inhalt.werte.ungebrannterTonlehmMitPflanzenfasern,
    defaultCircularQuota: 98,
    substitutesPrimary: inhalt.werte.neulehmGipsplatten100Reversibel,
    defaultRecoveryType: "reuse"
  },
  {
    id: "hanfkalk",
    name: inhalt.werte.hanfkalkKalkhanfMonolithisch,
    category: "Naturbaustoffe",
    unit: "m³",
    densityKg: 420,
    gwpA1A3: -185,
    gwpC: 45,
    gwpD: -40,
    biogenicContent: 220,
    umiScore: 92,
    penrt: 410,
    description: inhalt.werte.mischungAusHanfschäbenUnd,
    defaultCircularQuota: 92,
    substitutesPrimary: inhalt.werte.bodenverbessererGesteinskörnungFürKalkmö,
    defaultRecoveryType: "downcycling"
  },
  {
    id: "eps-daemmung",
    name: inhalt.werte.epsHartschaumplatteStyropor,
    category: inhalt.werte.wärmedämmungFossil,
    unit: "m³",
    densityKg: 20,
    gwpA1A3: 78,
    gwpC: 58,    // Incineration at End of Life releases carbon
    gwpD: -25,
    biogenicContent: 0,
    umiScore: 25,
    penrt: 1850,
    description: inhalt.werte.polystyrolDämmplatteGünstigUnd,
    defaultCircularQuota: 25,
    substitutesPrimary: inhalt.werte.müllverbrennungFossileDampfgewinnung,
    defaultRecoveryType: "thermal"
  },
  {
    id: "zellulose",
    name: inhalt.werte.einblasdämmungZelluloseAltpapier,
    category: inhalt.werte.wärmedämmungÖkologisch,
    unit: "m³",
    densityKg: 45,
    gwpA1A3: -115, // Biogenic offset in paper pulp
    gwpC: 130,
    gwpD: -35,
    biogenicContent: 130,
    umiScore: 85,
    penrt: 220,
    description: inhalt.werte.dämmstoffAusZerkleinertemAltpapier,
    defaultCircularQuota: 85,
    substitutesPrimary: inhalt.werte.biomasseVerwertungNachnutzung,
    defaultRecoveryType: "thermal"
  },
  {
    id: "holzfaser-daemmung",
    name: inhalt.werte.holzfaserdämmplatteDruckfest,
    category: inhalt.werte.wärmedämmungÖkologisch2,
    unit: "m³",
    densityKg: 140,
    gwpA1A3: -190,
    gwpC: 230,
    gwpD: -70,
    biogenicContent: 230,
    umiScore: 85,
    penrt: 1100,
    description: inhalt.werte.druckfesteDämmungAusRestholzfasern,
    defaultCircularQuota: 85,
    substitutesPrimary: inhalt.werte.kaskadennutzungBiomasseHeizwerk,
    defaultRecoveryType: "thermal"
  },
  {
    id: "schaumglas",
    name: inhalt.werte.schaumglasschotter100Recyclingglas,
    category: inhalt.werte.dämmungGründungZirkulär,
    unit: "m³",
    densityKg: 160,
    gwpA1A3: 42,
    gwpC: 5,
    gwpD: -28,
    biogenicContent: 0,
    umiScore: 95,
    penrt: 580,
    description: inhalt.werte.druckfesteLastabtragendePerimeterdämmung,
    defaultCircularQuota: 95,
    substitutesPrimary: inhalt.werte.neuglasXpsPerimeterdämmung,
    defaultRecoveryType: "reuse"
  },
  {
    id: "strohballen",
    name: inhalt.werte.strohballendämmungBaustrohEta,
    category: "Naturbaustoffe",
    unit: "m³",
    densityKg: 110,
    gwpA1A3: -140,
    gwpC: 155,
    gwpD: -25,
    biogenicContent: 155,
    umiScore: 90,
    penrt: 95,
    description: inhalt.werte.landwirtschaftlichesNebenproduktExtremGe,
    defaultCircularQuota: 90,
    substitutesPrimary: inhalt.werte.kompostierungHumusaufbauBiogas,
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
  /** Nutzungsdauer [a] für B4; fehlt sie, gilt der BNB-Wert aus src/calc/lca.ts */
  nutzungsdauer?: number;
}

/** Baustoff der Lehrdatenbank als Eingabe für den Rechenkern src/calc/lca.ts */
export function alsLcaBaustoff(m: MaterialDefinition): LcaBaustoff {
  return {
    id: m.id, einheit: m.unit, rohdichte: m.densityKg, gwpA1A3: m.gwpA1A3, gwpC: m.gwpC, gwpD: m.gwpD,
    biogen: m.biogenicContent, penrt: m.penrt, refKreislaufquote: m.defaultCircularQuota, refVerwertung: m.defaultRecoveryType,
  };
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
    name: inhalt.werte.szenarioAKonventionellerMassivbau,
    description: inhalt.werte.klassischeZiegelaußenwand365,
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
    name: inhalt.werte.szenarioBKlinkerreduzierterMassivbau,
    description: inhalt.werte.ressourcenschonendeMassivbauweiseMitCem,
    badge: inhalt.werte.klinkeroptimiert,
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
    name: inhalt.werte.szenarioCModernerHolz,
    description: inhalt.werte.brettsperrholzWändeCltHolz,
    badge: inhalt.werte.biogenHybrid,
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
    name: inhalt.werte.szenarioDZirkulärerLehm,
    description: inhalt.werte.konsequenteKreislaufbauweiseAusHolzständ,
    badge: inhalt.werte.t100Zirkulär,
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
