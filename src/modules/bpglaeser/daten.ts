import inhalt from '@/content/bpglaeser/daten.json';
// Types and Interfaces
export interface GlassProduct {
  id: string;
  name: string;
  shortName: string;
  standard: string;
  thicknessRange: string;
  typicalThickness: string;
  production: string;
  safetyCategory: 'Normalglas' | 'Sicherheitsglas (ESG)' | 'Verbundsicherheitsglas (VSG)' | 'Teilvorgespannt (TVG)' | 'Sonderglas';
  coatingBedampfung: string;
  gasFilling: string;
  uValueRange: string; // W/(m²K)
  gValueRange: string;
  soundRw: string; // dB
  pricePerSqm: string; // €/m² (Großhandel/Einbaufertig)
  applications: string[];
  pros: string[];
  cons: string[];
  normen: string[];
}

export interface WindowType {
  id: string;
  name: string;
  frameMaterial: 'Holz' | 'Kunststoff (PVC)' | 'Aluminium' | 'Holz-Aluminium' | 'Stahl (Schlankprofil)';
  glazingType: string;
  typicalUw: number; // W/(m²K)
  soundProtectionClass: string; // SSK 1 bis 6
  airTightnessClass: string; // Klasse 1-4 (DIN EN 12207)
  waterTightnessClass: string; // 1A-9A, Exxx (DIN EN 12208)
  windResistanceClass: string; // C1-C5, B1-B5 (DIN EN 12210)
  resistanceClassRC: string; // RC 1 N bis RC 3 / RC 4
  typicalPricePerSqm: number; // €/m² inkl. Flügel & Beschläge
  pros: string[];
  cons: string[];
  normen: string[];
}

export const GLASS_PRODUCTS: GlassProduct[] = [
  {
    id: 'floatglas',
    name: inhalt.werte.floatglasSpiegelglasNormalglas,
    shortName: 'Floatglas',
    standard: inhalt.werte.dinEn5722,
    thicknessRange: inhalt.werte.t2MmBis25,
    typicalThickness: inhalt.werte.t4Mm6Mm,
    production: inhalt.werte.kontinuierlicherFloatProzessAufschmelzen,
    safetyCategory: 'Normalglas',
    coatingBedampfung: inhalt.werte.unbeschichtetOderPyrolytischeHartbeschic,
    gasFilling: inhalt.werte.entfälltEinzelscheibe,
    uValueRange: inhalt.werte.ug575,
    gValueRange: inhalt.werte.g0820,
    soundRw: inhalt.werte.rw2834Db,
    pricePerSqm: inhalt.werte.t1845M,
    applications: [
      inhalt.werte.basisglasFürAlleWeiterveredelten,
      inhalt.werte.möbelbauBilderrahmenInnenraumRegalböden,
      inhalt.werte.gewächshäuserEinfacheInnenverglasungenOh
    ],
    pros: [
      inhalt.werte.absolutPlaneVerzerrungsfreieOberfläche,
      inhalt.werte.sehrWirtschaftlicheMassenfertigung,
      inhalt.werte.ausgezeichneteLichttransmissionV90
    ],
    cons: [
      inhalt.werte.geringeBiegezugfestigkeitFK,
      inhalt.werte.gefährlicherSchollenbruchMitMesserscharf,
      inhalt.werte.sehrEmpfindlichGegenüberThermischen
    ],
    normen: [inhalt.werte.dinEn57222, inhalt.werte.dinEn5721]
  },
  {
    id: 'esg',
    name: inhalt.werte.einscheibensicherheitsglasEsgEsgH,
    shortName: 'ESG / ESG-H',
    standard: inhalt.werte.dinEn121501,
    thicknessRange: inhalt.werte.t3MmBis19,
    typicalThickness: inhalt.werte.t6Mm8Mm,
    production: inhalt.werte.thermischesVorspannenErhitzenEiner,
    safetyCategory: 'Sicherheitsglas (ESG)',
    coatingBedampfung: inhalt.werte.vorDemVorspannenAufgebrachte,
    gasFilling: inhalt.werte.entfälltAlsEinzelscheibeIm,
    uValueRange: inhalt.werte.ug56W,
    gValueRange: inhalt.werte.g082Unbeschichtet,
    soundRw: inhalt.werte.rw3136Db,
    pricePerSqm: inhalt.werte.t4595MEsg,
    applications: [
      inhalt.werte.ganzglastürenDuschkabinenTrennwände,
      inhalt.werte.außenscheibenVonIsoliergläsernBei,
      inhalt.werte.punktgehalteneFassadengläserSeitenUnd
    ],
    pros: [
      inhalt.werte.hoheCharakteristischeBiegezugfestigkeitF,
      inhalt.werte.temperaturwechselbeständigkeitBisT200,
      inhalt.werte.krümelbruchZerfälltBeiÜberlastung
    ],
    cons: [
      inhalt.werte.nachDemVorspannenNicht,
      inhalt.werte.alsEinfachscheibeKeineResttragfähigkeit,
      inhalt.werte.gefahrVonSpontanbrüchenDurch
    ],
    normen: [inhalt.werte.dinEn1215012, inhalt.werte.dinEn141791, inhalt.werte.din1800812]
  },
  {
    id: 'tvg',
    name: inhalt.werte.teilvorgespanntesGlasTvg,
    shortName: 'TVG',
    standard: inhalt.werte.dinEn18631,
    thicknessRange: inhalt.werte.t4MmBis12,
    typicalThickness: inhalt.werte.t6Mm8Mm2,
    production: inhalt.werte.ähnlichWieEsgErhitzt,
    safetyCategory: 'Teilvorgespannt (TVG)',
    coatingBedampfung: inhalt.werte.vorspannbareDünnschichtenAnalogEsg,
    gasFilling: inhalt.werte.entfälltMonolithisch,
    uValueRange: inhalt.werte.ug56W2,
    gValueRange: 'g ≈ 0,82',
    soundRw: inhalt.werte.rw3236Db,
    pricePerSqm: inhalt.werte.t55110M,
    applications: [
      inhalt.werte.zwingendeBasiskomponenteFürVerbundsicher,
      inhalt.werte.überkopfverglasungenVordächerBegehbareGl
    ],
    pros: [
      inhalt.werte.charakteristischeBiegezugfestigkeitFK,
      inhalt.werte.temperaturbeständigBisT100,
      inhalt.werte.grobscholligesBruchbildMitVerkeilung
    ],
    cons: [
      inhalt.werte.giltAlsEinzelscheibeNicht,
      inhalt.werte.darfNachDerThermobehandlung
    ],
    normen: [inhalt.werte.dinEn186312, inhalt.werte.din1800813]
  },
  {
    id: 'vsg',
    name: inhalt.werte.verbundsicherheitsglasVsg,
    shortName: 'VSG',
    standard: inhalt.werte.dinEnIso12543,
    thicknessRange: inhalt.werte.t6MmBisÜber,
    typicalThickness: inhalt.werte.t8Mm44,
    production: inhalt.werte.zweiOderMehrereGlasscheiben,
    safetyCategory: 'Verbundsicherheitsglas (VSG)',
    coatingBedampfung: inhalt.werte.lowEBeschichtungenAuf,
    gasFilling: inhalt.werte.entfälltMonolithisch2,
    uValueRange: inhalt.werte.ug525,
    gValueRange: inhalt.werte.g0750,
    soundRw: inhalt.werte.rw3544Db,
    pricePerSqm: inhalt.werte.t75220MBei,
    applications: [
      inhalt.werte.absturzsicherndeVerglasungenNachDin,
      inhalt.werte.überkopfUndDachverglasungenNach,
      inhalt.werte.einbruchBeschussUndSprengwirkungshemmend
    ],
    pros: [
      inhalt.werte.hervorragendeSplitterbindungScherbenHaft,
      inhalt.werte.hoheResttragfähigkeitBesondersBei,
      inhalt.werte.hervorragenderUvSchutzFolie,
      inhalt.werte.signifikanteSchallschutzverbesserungDurc
    ],
    cons: [
      inhalt.werte.höheresEigengewichtErfordertStärkere,
      inhalt.werte.offeneKantenMüssenVor
    ],
    normen: [inhalt.werte.dinEnIso125432, inhalt.werte.dinEn14449, 'DIN EN 356', inhalt.werte.din1800814]
  },
  {
    id: 'isolierglas_2fach',
    name: inhalt.werte.t2ScheibenWärmedämmIsolierglas,
    shortName: inhalt.werte.t2FachIsolierglas,
    standard: inhalt.werte.dinEn12791,
    thicknessRange: inhalt.werte.t20MmBis32,
    typicalThickness: inhalt.werte.t24MmAufbau4,
    production: inhalt.werte.zweiScheibenFloatglasOder,
    safetyCategory: 'Normalglas',
    coatingBedampfung: inhalt.werte.lowEWärmefunktionsschichtNanometerdünne,
    gasFilling: inhalt.werte.argon90ImScheibenzwischenraum,
    uValueRange: inhalt.werte.ug111,
    gValueRange: inhalt.werte.g0600,
    soundRw: inhalt.werte.rw3134Db,
    pricePerSqm: inhalt.werte.t65110M,
    applications: [
      inhalt.werte.standardAltbausanierungDenkmalpflegeUnbe,
      inhalt.werte.leichteFensterkonstruktionenMitSchmalen
    ],
    pros: [
      inhalt.werte.geringesGewichtNurCa,
      inhalt.werte.geringeRahmenbautiefeErforderlichAuch,
      inhalt.werte.sehrGünstigerAnschaffungspreis
    ],
    cons: [
      inhalt.werte.erfülltDieEnergetischenAnforderungen,
      inhalt.werte.spürbarKühlereInnereScheibenoberfläche,
      inhalt.werte.kondensatbildungAnDenScheibenrändern
    ],
    normen: ['DIN EN 1279', 'DIN EN 673', inhalt.werte.gmodgVormalsGeg]
  },
  {
    id: 'isolierglas_3fach',
    name: inhalt.werte.t3ScheibenWärmeschutzIsolierglas,
    shortName: inhalt.werte.t3FachIsolierglas,
    standard: inhalt.werte.dinEn127912,
    thicknessRange: inhalt.werte.t36MmBis52,
    typicalThickness: inhalt.werte.t44MmAufbau4,
    production: inhalt.werte.dreiScheibenMitZweifachem,
    safetyCategory: 'Normalglas',
    coatingBedampfung: inhalt.werte.zweiLowESchichten,
    gasFilling: inhalt.werte.argon90LiefertUg,
    uValueRange: inhalt.werte.ug050,
    gValueRange: inhalt.werte.g0500,
    soundRw: inhalt.werte.rw3438Db,
    pricePerSqm: inhalt.werte.t95175M,
    applications: [
      inhalt.werte.aktuellerStandDerTechnik,
      inhalt.werte.wohnungsbauModerneVerwaltungsUnd
    ],
    pros: [
      inhalt.werte.sehrGuterWärmeschutzHalbiert,
      inhalt.werte.hoheInnereOberflächentemperatur17,
      inhalt.werte.keineKondensatbildungImInnenraum
    ],
    cons: [
      inhalt.werte.hohesGewichtCa30,
      inhalt.werte.geringererGWertWeniger,
      inhalt.werte.gelegentlichesBeschlagenAufDer
    ],
    normen: ['DIN EN 1279', inhalt.werte.dinEnIso10077, inhalt.werte.gmodgVormalsGeg2]
  },
  {
    id: 'sonnenschutzglas',
    name: inhalt.werte.sonnenschutzIsolierglasSelektivglas,
    shortName: 'Sonnenschutzglas',
    standard: inhalt.werte.dinEn1279Din,
    thicknessRange: inhalt.werte.t28MmBis54,
    typicalThickness: inhalt.werte.t44MmAufbauZ,
    production: inhalt.werte.spezielleMetallischeInterferenzschichten,
    safetyCategory: 'Normalglas',
    coatingBedampfung: inhalt.werte.hochselektiveBeschichtungAufPosition,
    gasFilling: 'Argon 90 %',
    uValueRange: inhalt.werte.ug061,
    gValueRange: inhalt.werte.g0220,
    soundRw: inhalt.werte.rw3642Db,
    pricePerSqm: inhalt.werte.t140260M,
    applications: [
      inhalt.werte.großflächigeGlasfassadenBürogebäudeSüd,
      inhalt.werte.wintergärtenGlasüberdachungenOhneMechani
    ],
    pros: [
      inhalt.werte.verhindertSommerlicheÜberhitzungNach,
      inhalt.werte.senktDieBetriebsUnd,
      inhalt.werte.hoheFarbneutralitätBeiModernen
    ],
    cons: [
      inhalt.werte.geringereSolareWärmegewinneIn,
      inhalt.werte.leichtReduzierteTageslichttransmissionV,
      inhalt.werte.höhererBeschaffungspreis
    ],
    normen: ['DIN EN 410', 'DIN EN 1279', 'DIN 4108-2']
  },
  {
    id: 'vakuumisolierglas',
    name: inhalt.werte.vakuumIsolierglasVigUltra,
    shortName: inhalt.werte.vakuumglasVig,
    standard: inhalt.werte.iso199161Din,
    thicknessRange: inhalt.werte.t6MmBis12,
    typicalThickness: inhalt.werte.t83Mm4,
    production: inhalt.werte.zweiGlasscheibenMitHoch,
    safetyCategory: 'Normalglas',
    coatingBedampfung: inhalt.werte.doppelteLowEBeschichtung,
    gasFilling: inhalt.werte.hochvakuum10MbarEliminiert,
    uValueRange: inhalt.werte.ug040,
    gValueRange: inhalt.werte.g0550,
    soundRw: inhalt.werte.rw3639Db,
    pricePerSqm: inhalt.werte.t320580M,
    applications: [
      inhalt.werte.denkmalgeschützteBautenEnergetischeSanie,
      inhalt.werte.schlankeSchiebeflügelUndFiligrane,
      inhalt.werte.kühlmöbelbauUndSchienenfahrzeuge
    ],
    pros: [
      inhalt.werte.sensationellGeringeBautiefeNur,
      inhalt.werte.geringesGewichtNur20,
      inhalt.werte.guteSchalldämmungBezogenAuf
    ],
    cons: [
      inhalt.werte.nochHoheHerstellkostenUnd,
      inhalt.werte.mikroStützkörperAusNächster,
      inhalt.werte.sehrStrengeMaßtoleranzenBei
    ],
    normen: ['ISO 19916-1', inhalt.werte.abzAbgDesDibt]
  }
];

export const WINDOW_TYPES: WindowType[] = [
  {
    id: 'kunststoff_fenster',
    name: inhalt.werte.kunststoffFensterPvcU,
    frameMaterial: 'Kunststoff (PVC)',
    glazingType: inhalt.werte.t3FachWärmeschutzglasUg,
    typicalUw: 0.85,
    soundProtectionClass: 'SSK 2 bis SSK 5 (bis 45 dB)',
    airTightnessClass: 'Klasse 4',
    waterTightnessClass: 'Klasse 9A (bis 600 Pa)',
    windResistanceClass: 'Klasse C5',
    resistanceClassRC: 'RC 2 / RC 3',
    typicalPricePerSqm: 280,
    pros: [
      inhalt.werte.sehrWirtschaftlichesPreisLeistungs,
      inhalt.werte.pflegeleichtUndWitterungsbeständigKein,
      inhalt.werte.hervorragendeThermischeRahmendämmungDurc,
      inhalt.werte.t100RecycelbarerPvcKern
    ],
    cons: [
      inhalt.werte.größereProfilansichtsbreitenAlsAluminium,
      inhalt.werte.höhereThermischeLängenausdehnungErforder,
      inhalt.werte.statischBegrenztBeiÜberhohen
    ],
    normen: [inhalt.werte.dinEn12608, 'RAL-GZ 716', inhalt.werte.dinEn143511]
  },
  {
    id: 'holz_fenster',
    name: inhalt.werte.massivholzFensterKieferLärche,
    frameMaterial: 'Holz',
    glazingType: inhalt.werte.t3FachIsolierglasUg,
    typicalUw: 0.88,
    soundProtectionClass: 'SSK 2 bis SSK 5',
    airTightnessClass: 'Klasse 4',
    waterTightnessClass: 'Klasse 9A',
    windResistanceClass: 'Klasse C4',
    resistanceClassRC: 'RC 2 / RC 3',
    typicalPricePerSqm: 420,
    pros: [
      inhalt.werte.nachwachsenderRohstoffSpeichertBiogenen,
      inhalt.werte.natürlicheWohnatmosphäreHervorragendeHap,
      inhalt.werte.hoheEigensteifigkeitUndSehr,
      inhalt.werte.problemlosReparierbarUndFarblich
    ],
    cons: [
      inhalt.werte.regelmäßigerWartungsaufwandLasurenOder,
      inhalt.werte.feuchteempfindlichBeiMangelhafterWassera
    ],
    normen: [inhalt.werte.dinEn1435112, 'DIN 68121', inhalt.werte.vffMerkblattHo01]
  },
  {
    id: 'holz_alu_fenster',
    name: inhalt.werte.holzAluminiumVerbundfensterPremium,
    frameMaterial: 'Holz-Aluminium',
    glazingType: inhalt.werte.t3FachIsolierglasUg2,
    typicalUw: 0.78,
    soundProtectionClass: 'SSK 3 bis SSK 5 (bis 47 dB)',
    airTightnessClass: 'Klasse 4',
    waterTightnessClass: 'Klasse E900',
    windResistanceClass: 'Klasse C5',
    resistanceClassRC: 'RC 2 / RC 3',
    typicalPricePerSqm: 580,
    pros: [
      inhalt.werte.kombiniertDieVorteileBeider,
      inhalt.werte.wartungsarmAnDerBewitterten,
      inhalt.werte.hinterlüfteteAluVorsatzschaleVerhindert,
      inhalt.werte.höchsteLebensdauer4050
    ],
    cons: [
      inhalt.werte.höhereInvestitionskostenCa40,
      inhalt.werte.aufwendigereFertigungUndDemontage
    ],
    normen: [inhalt.werte.dinEn1435113, 'VFF HO.03']
  },
  {
    id: 'alu_fenster',
    name: inhalt.werte.aluminiumFensterMitThermischer,
    frameMaterial: 'Aluminium',
    glazingType: inhalt.werte.t3FachIsolierglasOder,
    typicalUw: 0.92,
    soundProtectionClass: 'SSK 3 bis SSK 5',
    airTightnessClass: 'Klasse 4',
    waterTightnessClass: 'Klasse E900',
    windResistanceClass: 'Klasse C5',
    resistanceClassRC: inhalt.werte.rc2BisRc,
    typicalPricePerSqm: 520,
    pros: [
      inhalt.werte.sehrSchlankeRahmenprofileUnd,
      inhalt.werte.hoheSteifigkeitFürRaumhohe,
      inhalt.werte.korrosionsbeständigUndFormstabilKein,
      inhalt.werte.thermischGetrennteProfileMit
    ],
    cons: [
      inhalt.werte.höhererPrimärenergieaufwandBeiDer,
      inhalt.werte.kühlereRahmenhaptikImInnenraum
    ],
    normen: [inhalt.werte.dinEn1435114, 'DIN 17615', 'RAL-GZ 695']
  },
  {
    id: 'kastenfenster',
    name: inhalt.werte.denkmalKastenfensterZweischaligVerbundka,
    frameMaterial: 'Holz',
    glazingType: inhalt.werte.außenFloatRestaurierungsglas4,
    typicalUw: 1.10,
    soundProtectionClass: 'SSK 4 bis SSK 6 (bis 52 dB - Weltklasse!)',
    airTightnessClass: 'Klasse 3-4',
    waterTightnessClass: 'Klasse 7A',
    windResistanceClass: 'Klasse B3',
    resistanceClassRC: inhalt.werte.rc1NBis,
    typicalPricePerSqm: 850,
    pros: [
      inhalt.werte.gutDenkmalverträglichHistorischeProfilan,
      inhalt.werte.herausragenderSchallschutzDurchGroßen,
      inhalt.werte.optimierteNatürlichePufferzoneGegen
    ],
    cons: [
      inhalt.werte.hoheAnschaffungsUndRestaurierungskosten,
      inhalt.werte.reinigungsaufwandVerdoppeltVierScheibeno,
      inhalt.werte.großeWandstärkenErforderlich
    ],
    normen: ['DIN 68121', inhalt.werte.wtaMerkblätterFenster, inhalt.werte.denkmalschutzgesetzeDerLänder]
  }
];
