import inhalt from '@/content/expositionsklassen/daten.json';
// Ausgelagert aus src/modules/Expositionsklassen.tsx (AP 5.2)

// ============================================================================
// NORMATIVE DATENBANK: DIN EN 206:2021-06 & DIN 1045-2:2023-08 (Tab. F.2.1/F.2.2)
// Werte abgeglichen mit src/data/standards/din1045_2.ts
// ============================================================================

export interface NormExposureClass {
  code: string;
  family: 'X0' | 'XC' | 'XD' | 'XS' | 'XF' | 'XA' | 'XM';
  title: string;
  description: string;
  examples: string;
  maxWzEq: number | null; // null bedeutet keine normative Begrenzung
  minStrengthClass: string;
  minCement: number | null; // kg/m³ (DIN 1045-2, Tab. F.2.1/F.2.2)
  minAirContent?: {
    dmax32: number;
    dmax16: number;
    dmax8: number;
  };
  requiresAirEntrainment?: boolean;
  minCoverDurMm: number | null; // Betonstahl, DIN EN 1992-1-1/NA:2013-04 Tab. 4.4DE; null = keine eigene Anforderung
  /** Alternative ohne Luftporen (XF2, XF3; DIN 1045-2, Tab. F.2.1) – Schalter im Hüllwertrechner (T3-EX-1) */
  ohneLp?: { maxWzEq: number; minStrengthClass: string; minCement: number };
  specialNotes?: string;
}

// Strikte normative Expositionsklassen nach DIN 1045-2 Tabelle F.2.1 & F.2.2
export const NORMATIVE_EXPOSURE_CLASSES: NormExposureClass[] = [
  // X0: Kein Angriffsrisiko
  {
    code: 'X0',
    family: 'X0',
    title: inhalt.werte.keinAngriffsrisiko,
    description: inhalt.werte.betonOhneBewehrungOder,
    examples: inhalt.werte.unbewehrteFundamenteOhneFrost,
    maxWzEq: null,
    minStrengthClass: 'C8/10',
    minCement: null,
    minCoverDurMm: null,
    specialNotes: inhalt.werte.beiBewehrtemBetonIn
  },

  // XC: Bewehrungskorrosion durch Karbonatisierung
  {
    code: 'XC1',
    family: 'XC',
    title: inhalt.werte.trockenOderStändigNass,
    description: inhalt.werte.bauteileInInnenräumenMit,
    examples: inhalt.werte.innenräumeVonWohnungenUnd,
    maxWzEq: 0.75,
    minStrengthClass: 'C16/20',
    minCement: 240,
    minCoverDurMm: 10,
    specialNotes: inhalt.werte.cDevDarfBei
  },
  {
    code: 'XC2',
    family: 'XC',
    title: inhalt.werte.nassSeltenTrocken,
    description: inhalt.werte.teileVonWasserbehälternGründungsbauteile,
    examples: inhalt.werte.fundamenteImFeuchtenErdreich,
    maxWzEq: 0.75,
    minStrengthClass: 'C16/20',
    minCement: 240,
    minCoverDurMm: 20,
    specialNotes: inhalt.werte.anforderungenAnDenBeton
  },
  {
    code: 'XC3',
    family: 'XC',
    title: inhalt.werte.mäßigeFeuchte,
    description: inhalt.werte.bauteileZuDenenDie,
    examples: inhalt.werte.offeneHallenVordächerViehställe,
    maxWzEq: 0.65,
    minStrengthClass: 'C20/25',
    minCement: 260,
    minCoverDurMm: 20
  },
  {
    code: 'XC4',
    family: 'XC',
    title: inhalt.werte.wechselndNassUndTrocken,
    description: inhalt.werte.außenbauteileMitDirekterBeregnung,
    examples: inhalt.werte.außenwändeBalkoneFreiBewitterte,
    maxWzEq: 0.60,
    minStrengthClass: 'C25/30',
    minCement: 280,
    minCoverDurMm: 25
  },

  // XD: Chloride aus Taumitteln (außer Meerwasser)
  {
    code: 'XD1',
    family: 'XD',
    title: inhalt.werte.mäßigeFeuchteSprühnebel,
    description: inhalt.werte.bauteiloberflächenDieChloridhaltigemSprü,
    examples: inhalt.werte.wändeUndDeckenVon,
    maxWzEq: 0.55,
    minStrengthClass: 'C30/37',
    minCement: 300,
    minCoverDurMm: 40
  },
  {
    code: 'XD2',
    family: 'XD',
    title: inhalt.werte.nassSeltenTrockenSole,
    description: inhalt.werte.bauteileDieChloridhaltigenIndustrieabwäs,
    examples: inhalt.werte.schwimmbeckenMitSoleMeerwasserzusatz,
    maxWzEq: 0.50,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: 40,
    specialNotes: inhalt.werte.beiLuftporenbetonZB
  },
  {
    code: 'XD3',
    family: 'XD',
    title: inhalt.werte.wechselndNassUndTrocken2,
    description: inhalt.werte.teileVonBrückenUnd,
    examples: inhalt.werte.fahrbahndeckenVonParkhäusernOhne,
    maxWzEq: 0.45,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: 40,
    specialNotes: inhalt.werte.fürBefahreneParkdecksRissvermeidende
  },

  // XS: Chloride aus Meerwasser
  {
    code: 'XS1',
    family: 'XS',
    title: inhalt.werte.salzhaltigeLuftKüstennähe,
    description: inhalt.werte.bauteileInKüstennäheDie,
    examples: inhalt.werte.fassadenUndTragwerkeAn,
    maxWzEq: 0.55,
    minStrengthClass: 'C30/37',
    minCement: 300,
    minCoverDurMm: 40
  },
  {
    code: 'XS2',
    family: 'XS',
    title: inhalt.werte.ständigUnterMeerwasser,
    description: inhalt.werte.teileVonMeeresbauwerkenDauerhaft,
    examples: inhalt.werte.pfeilerUndGründungenIm,
    maxWzEq: 0.50,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: 40
  },
  {
    code: 'XS3',
    family: 'XS',
    title: inhalt.werte.tideSpritzUndBrandungszone,
    description: inhalt.werte.bauteileImGezeitenwechselUnd,
    examples: inhalt.werte.kaimauernMolenköpfeLeuchtturmfundamente,
    maxWzEq: 0.45,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: 40
  },

  // XF: Frost- und Frost-Tausalz-Angriff
  {
    code: 'XF1',
    family: 'XF',
    title: inhalt.werte.mäßigeSättigungOhneTaumittel,
    description: inhalt.werte.vertikaleAußenflächenDieRegen,
    examples: inhalt.werte.fassadenwändeAußenstützenOhneTaumittelei,
    maxWzEq: 0.60,
    minStrengthClass: 'C25/30',
    minCement: 280,
    minCoverDurMm: null,
    specialNotes: inhalt.werte.keineKünstlichenLuftporenErforderlich
  },
  {
    code: 'XF2',
    family: 'XF',
    title: inhalt.werte.mäßigeSättigungMitTaumittel,
    description: inhalt.werte.vertikaleBauteileImSprühnebelbereich,
    examples: inhalt.werte.spritzwasserbereichVonStützwändenAn,
    maxWzEq: 0.55,
    minStrengthClass: 'C25/30',
    minCement: 300,
    requiresAirEntrainment: true,
    minAirContent: { dmax32: 4.0, dmax16: 4.5, dmax8: 5.5 },
    ohneLp: { maxWzEq: 0.50, minStrengthClass: 'C35/45', minCement: 320 },
    minCoverDurMm: null,
    specialNotes: inhalt.werte.alternativOhneLpW
  },
  {
    code: 'XF3',
    family: 'XF',
    title: inhalt.werte.hoheSättigungOhneTaumittel,
    description: inhalt.werte.horizontaleAußenbauteileMitWasseransamml,
    examples: inhalt.werte.freiBewitterteDeckenBrüstungsabdeckungen,
    maxWzEq: 0.55,
    minStrengthClass: 'C25/30',
    minCement: 300,
    requiresAirEntrainment: true,
    minAirContent: { dmax32: 4.0, dmax16: 4.5, dmax8: 5.5 },
    ohneLp: { maxWzEq: 0.50, minStrengthClass: 'C35/45', minCement: 320 },
    minCoverDurMm: null,
    specialNotes: inhalt.werte.alternativOhneLpW2
  },
  {
    code: 'XF4',
    family: 'XF',
    title: inhalt.werte.hoheSättigungMitTaumittel,
    description: inhalt.werte.horizontaleBauteileMitDirekter,
    examples: inhalt.werte.direktBefahreneFahrbahnenVon,
    maxWzEq: 0.50,
    minStrengthClass: 'C30/37',
    minCement: 320,
    requiresAirEntrainment: true,
    minAirContent: { dmax32: 4.0, dmax16: 4.5, dmax8: 5.5 },
    minCoverDurMm: null,
    specialNotes: inhalt.werte.nurAlsLuftporenbetonZulässig
  },

  // XA: Chemischer Angriff nach DIN EN 206 Tabelle 2
  {
    code: 'XA1',
    family: 'XA',
    title: inhalt.werte.chemischSchwachAngreifend,
    description: inhalt.werte.natürlicheBödenUndGrundwässer,
    examples: inhalt.werte.fundamenteInSchwachSauren,
    maxWzEq: 0.60,
    minStrengthClass: 'C25/30',
    minCement: 280,
    minCoverDurMm: null
  },
  {
    code: 'XA2',
    family: 'XA',
    title: inhalt.werte.chemischMäßigAngreifend,
    description: inhalt.werte.bödenUndGrundwässerMit,
    examples: inhalt.werte.klärbeckenGüllebehälterErdbauwerkeIn,
    maxWzEq: 0.50,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: null,
    specialNotes: inhalt.werte.beiSo600Mg
  },
  {
    code: 'XA3',
    family: 'XA',
    title: inhalt.werte.chemischStarkAngreifend,
    description: inhalt.werte.starkSaureBödenPh,
    examples: inhalt.werte.industrieabwasserkanäleKühltürmeBiogasan,
    maxWzEq: 0.45,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: null,
    specialNotes: inhalt.werte.srZementBeiSulfatangriff
  },

  // XM: Mechanischer Verschleiß nach DIN 1045-2
  {
    code: 'XM1',
    family: 'XM',
    title: inhalt.werte.mäßigeVerschleißbeanspruchung,
    description: inhalt.werte.flächenMitLuftbereiftemVerkehr,
    examples: inhalt.werte.garagenParkdecksZufahrtenVon,
    maxWzEq: 0.55,
    minStrengthClass: 'C30/37',
    minCement: 300,
    minCoverDurMm: null
  },
  {
    code: 'XM2',
    family: 'XM',
    title: inhalt.werte.schwereVerschleißbeanspruchung,
    description: inhalt.werte.flächenBefahrenVonLuft,
    examples: inhalt.werte.industriehallenbödenMitRegelmäßigemGabel,
    maxWzEq: 0.55,
    minStrengthClass: 'C30/37',
    minCement: 300,
    minCoverDurMm: null,
    specialNotes: inhalt.werte.mitOberflächenbehandlungZB
  },
  {
    code: 'XM3',
    family: 'XM',
    title: inhalt.werte.sehrSchwereVerschleißbeanspruchung,
    description: inhalt.werte.flächenMitKettenfahrzeugenStahlrollen,
    examples: inhalt.werte.panzerhallenUmschlaghallenFürSchrott,
    maxWzEq: 0.45,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: null,
    specialNotes: inhalt.werte.hartstoffeNachDin1100
  }
];

// Chemische Grenzwerte nach DIN EN 206 Tabelle 2
export const CHEMICAL_LIMITS_XA = inhalt.daten.CHEMICAL_LIMITS_XA;

// Feuchtigkeitsklassen für Alkali-Kieselsäure-Reaktion (AKR) nach Alkali-Richtlinie / DIN 1045-2 Anhang D
export const MOISTURE_CLASSES_AKR = inhalt.daten.MOISTURE_CLASSES_AKR;

// ============================================================================
// INTERAKTIVE GRAFISCHE DARSTELLUNG: GEBÄUDESCHNITT & BETONDECKUNG (EC2)
// DIN EN 206 / DIN 1045-2 / DIN EN 1992-1-1 (Eurocode 2)
// ============================================================================

export interface BuildingZoneInfo {
  id: string;
  title: string;
  subtitle: string;
  classes: string[];
  feuchteklasse: 'WO' | 'WF' | 'WA' | 'WS';
  minStrength: string;
  maxWz: number;
  minCement: number;
  cMinDur: number;
  cNom: number;
  mechanism: string;
  practicalTips: string;
  normRef: string;
}

export const BUILDING_ZONES: BuildingZoneInfo[] = [
  {
    id: 'tiefgarage',
    title: inhalt.werte.tiefgaragenBodenplatteFahrgasse,
    subtitle: inhalt.werte.chlorideintragDurchPkwSchneematsch,
    classes: ['XD3', 'XF4', 'XM1'],
    feuchteklasse: 'WA',
    minStrength: 'C35/45',
    maxWz: 0.45,
    minCement: 320,
    cMinDur: 40,
    cNom: 55,
    mechanism: inhalt.werte.lochfraßkorrosionDurchTausalzChloride,
    practicalTips: inhalt.werte.zusätzlicheSchutzmaßnahmenFürBefahrene,
    normRef: inhalt.werte.din10452Tab
  },
  {
    id: 'balkon',
    title: inhalt.werte.auskragenderBalkonVordach,
    subtitle: inhalt.werte.direkterSchlagregenZyklischeTrocknung,
    classes: ['XC4', 'XF1'],
    feuchteklasse: 'WF',
    minStrength: 'C25/30',
    maxWz: 0.60,
    minCement: 280,
    cMinDur: 25,
    cNom: 40,
    mechanism: inhalt.werte.wechselndeDurchfeuchtungBeschleunigtDie,
    practicalTips: inhalt.werte.gefälle15Zur,
    normRef: inhalt.werte.din10452Tab2
  },
  {
    id: 'dach',
    title: inhalt.werte.flachdachAttikaDachterrasse,
    subtitle: inhalt.werte.horizontaleFreibewitterungPfützenbildung,
    classes: ['XC4', 'XF3'],
    feuchteklasse: 'WF',
    minStrength: 'C25/30',
    maxWz: 0.55,
    minCement: 300,
    cMinDur: 25,
    cNom: 40,
    mechanism: inhalt.werte.starkeDurchfeuchtungDurchStehendes,
    practicalTips: inhalt.werte.gefälleZurEntwässerungEinplanen,
    normRef: inhalt.werte.din10452Tab3
  },
  {
    id: 'rampe',
    title: inhalt.werte.freieTiefgaragenEinfahrtsrampe,
    subtitle: inhalt.werte.direkteTaumittelstreuungFrostTau,
    classes: ['XD3', 'XF4', 'XM2'],
    feuchteklasse: 'WA',
    minStrength: 'C35/45',
    maxWz: 0.45,
    minCement: 320,
    cMinDur: 40,
    cNom: 55,
    mechanism: inhalt.werte.extremerKombinationsangriffTaumitteleins,
    practicalTips: inhalt.werte.xf4LuftporenbetonErforderlichXm2,
    normRef: inhalt.werte.din10452Tab4
  },
  {
    id: 'innen',
    title: inhalt.werte.wohnBüroräumeDeckenWände,
    subtitle: inhalt.werte.trockenesInnenraumklimaRh30,
    classes: ['XC1'],
    feuchteklasse: 'WO',
    minStrength: 'C16/20',
    maxWz: 0.75,
    minCement: 240,
    cMinDur: 10,
    cNom: 20,
    mechanism: inhalt.werte.wegenGeringerPorenfeuchteIst,
    practicalTips: inhalt.werte.statischOftC2025,
    normRef: inhalt.werte.din10452Tab5
  },
  {
    id: 'fundament',
    title: inhalt.werte.kelleraußenwandFundamentplatteImBaugrund,
    subtitle: inhalt.werte.dauerfeuchtesErdreichLangzeitigNass,
    classes: ['XC2', 'XA1'],
    feuchteklasse: 'WF',
    minStrength: 'C25/30',
    maxWz: 0.60,
    minCement: 280,
    cMinDur: 20,
    cNom: 35,
    mechanism: inhalt.werte.ständigeFeuchteVerhindertKarbonatisierun,
    practicalTips: inhalt.werte.betonierenGegenUnebeneFlächen,
    normRef: inhalt.werte.din10452Tab6
  },
  {
    id: 'industrie',
    title: inhalt.werte.industriebodenSchachtAuffangbecken,
    subtitle: inhalt.werte.chemischerAngriffSulfate600,
    classes: ['XA2', 'XM2'],
    feuchteklasse: 'WF',
    minStrength: 'C35/45',
    maxWz: 0.50,
    minCement: 320,
    cMinDur: 20,
    cNom: 35,
    mechanism: inhalt.werte.sulfationenReagierenMitCalciumaluminathy,
    practicalTips: inhalt.werte.beiSo600Mg2,
    normRef: inhalt.werte.din10452Tab7
  },
  {
    id: 'kueste',
    title: inhalt.werte.kaimauerGezeitenzoneMeerwasser,
    subtitle: inhalt.werte.meerwasserchloridSprühnebelBrandungTiden,
    classes: ['XS3', 'XF4'],
    feuchteklasse: 'WA',
    minStrength: 'C35/45',
    maxWz: 0.45,
    minCement: 320,
    cMinDur: 40,
    cNom: 55,
    mechanism: inhalt.werte.massiveZufuhrVonMeerwasserchloriden,
    practicalTips: inhalt.werte.cMinDur40,
    normRef: inhalt.werte.din10452Tab8
  }
];
