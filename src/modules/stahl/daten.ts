import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import inhalt from '@/content/stahl/daten.json';
import { abminderungStahlBrand, stahlSpannungBeiDehnung, stahlKennlinienPunkte, stahlVerformungsphase, proportionalAnteil } from '@/src/calc/werkstoffmodelle';

export const steelGrades = {
  'S235': { fy: 235, fu: 360 },
  'S355': { fy: 355, fu: 470 },
  'S460': { fy: 460, fu: 540 },
  'S690': { fy: 690, fu: 770 },
  'B500B': { fy: 500, fu: 540 },
  'B500A': { fy: 500, fu: 525 },
  'Y1860': { fy: 1660, fu: 1860 },
  'SAS670': { fy: 670, fu: 800 },
};

export const corrosionClasses = inhalt.daten.corrosionClasses;

export const steelProperties = {
  rho: 7850, // kg/m³
  lambda: 50, // W/(mK) – vereinfachter Konstantwert; EC3-1-2: 54 W/(mK) bei 20 °C, temperaturabhängig
  alpha: 1.2e-5, // 1/K
  cp: 440, // J/(kgK)
  E: 210000, // MPa
  G: 81000, // MPa
  nu: 0.3 // Poissonzahl
};

// Abminderungsfaktoren DIN EN 1993-1-2, Tab. 3.1 – Rechenkern src/calc/werkstoffmodelle.ts
export const getReductionFactors = abminderungStahlBrand;

export interface ExtendedSteelGrade {
  id: string;
  name: string;
  sub: string;
  werkstoffnummer: string;
  category: 'baustahl' | 'bewehrung' | 'spannstahl' | 'edelstahl';
  categoryLabel: string;
  norm: string;
  fy: number; // MPa
  fu: number; // MPa
  description: string;
  applications: string[];
  advantages: string[];
  exampleObject: {
    name: string;
    description: string;
    location: string;
  };
  carbonContent: string;
  density: string;
  ductility: string;
  weldability: string;
}

export interface StructuralProfile {
  id: string;
  name: string;
  type: string;
  Wpl_y: number; // cm³
  Area: number; // cm²
  weight: number; // kg/m
  height: number; // mm
  width: number; // mm
}

export const extendedSteelGrades: ExtendedSteelGrade[] = [
  {
    id: 'S235',
    name: 'S235JR',
    sub: inhalt.werte.kostengünstigerAllrounderKlassischerBaus,
    werkstoffnummer: '1.0038',
    category: 'baustahl',
    categoryLabel: inhalt.werte.konventionellerBaustahl,
    norm: inhalt.werte.dinEn100252,
    fy: 235,
    fu: 360,
    description: inhalt.werte.derMeistgenutzteAllroundStahl,
    applications: [
      inhalt.werte.gewerblicheStandardhallenUndLandwirtscha,
      inhalt.werte.treppenkonstruktionenGeländerAbdeckblech,
      inhalt.werte.untergeordneteTragwerksteileVersteifungs,
      inhalt.werte.dachpfettenLeichteFassadenriegelUnd
    ],
    advantages: [
      inhalt.werte.überallSofortAbLager,
      inhalt.werte.sehrKostengünstigesVormaterial,
      inhalt.werte.fehlertoleranteUndUnkomplizierteSchweißb,
      inhalt.werte.hervorragendeKaltumformbarkeitUndZerspan
    ],
    exampleObject: {
      name: inhalt.werte.typischeAnwendungHallenUnd,
      description: inhalt.werte.zweigelenkrahmenUndPfettenGering,
      location: 'Lehrbeispiel'
    },
    carbonContent: '≤ 0,17 %',
    density: '7.850 kg/m³',
    ductility: inhalt.werte.sehrHochBruchdehnungA,
    weldability: inhalt.werte.hervorragendOhneSondermaßnahmen
  },
  {
    id: 'S355',
    name: 'S355J2+N',
    sub: inhalt.werte.dieUniverselleStandardgüteIm,
    werkstoffnummer: '1.0577',
    category: 'baustahl',
    categoryLabel: inhalt.werte.konventionellerBaustahl2,
    norm: inhalt.werte.dinEn1002522,
    fy: 355,
    fu: 470,
    description: inhalt.werte.dasUnangefochteneStandardarbeitstierIm,
    applications: [
      inhalt.werte.hochbelasteteRahmentragwerkeImGeschoss,
      inhalt.werte.straßenUndEisenbahnbrückenbauStandardisi,
      inhalt.werte.weitgespannteHallenoberlichterUndFachwer,
      inhalt.werte.fundamentUndGründungsstrukturenVon
    ],
    advantages: [
      inhalt.werte.höchsteWirtschaftlichkeitImNormalen,
      inhalt.werte.reduziertQuerschnittshöhenUndProfilgewic,
      inhalt.werte.sehrGuteEignungZur,
      inhalt.werte.ausgewogenesVerhältnisAusHoher
    ],
    exampleObject: {
      name: inhalt.werte.typischeAnwendungBrückenUnd,
      description: inhalt.werte.geschweißteHohlkastenUndI,
      location: 'Lehrbeispiel'
    },
    carbonContent: '≤ 0,20 %',
    density: '7.850 kg/m³',
    ductility: inhalt.werte.ausgezeichnetBruchdehnungA22,
    weldability: inhalt.werte.gutBeiDickenBlechen
  },
  {
    id: 'S460',
    name: 'S460N / M',
    sub: inhalt.werte.hochfesterFeinkornbaustahlFürSchlanke,
    werkstoffnummer: '1.8901 / 1.8827',
    category: 'baustahl',
    categoryLabel: inhalt.werte.hochfesterFeinkornbaustahl,
    norm: inhalt.werte.dinEn100253,
    fy: 460,
    fu: 540,
    description: inhalt.werte.einThermoMechanischGewalzter,
    applications: [
      inhalt.werte.hochhausVerbundstützenZurMinimierung,
      inhalt.werte.großbrückenbautenMitExtremenStützweiten,
      inhalt.werte.offshoreGründungskonstruktionenMonopiles,
      inhalt.werte.schlankeZuggliederUndHoch
    ],
    advantages: [
      inhalt.werte.enormerGewichtsvorteilBeiReinen,
      inhalt.werte.sehrHoheTieftemperaturzähigkeitBis,
      inhalt.werte.erlaubtVerringerteSchweißnahtdickenReduz,
      inhalt.werte.spezielleMetallischeReinheitMinimiert
    ],
    exampleObject: {
      name: inhalt.werte.typischeAnwendungHochBelastete,
      description: inhalt.werte.stützenInHochhäusernUnd,
      location: 'Lehrbeispiel'
    },
    carbonContent: '≤ 0,16 %',
    density: '7.850 kg/m³',
    ductility: inhalt.werte.gutBruchdehnungA17,
    weldability: inhalt.werte.gutVerlangtQualifizierteSchweißverfahren
  },
  {
    id: 'S690',
    name: 'S690QL',
    sub: inhalt.werte.höchstfesterWasservergüteterFeinkornbaus,
    werkstoffnummer: '1.8928',
    category: 'baustahl',
    categoryLabel: inhalt.werte.hochfesterVergütungsstahl,
    norm: inhalt.werte.dinEn100256,
    fy: 690,
    fu: 770,
    description: inhalt.werte.hochfesterStahlDerNach,
    applications: [
      inhalt.werte.höchstbelasteteHauptträgerVonMobilkranen,
      inhalt.werte.hochbeanspruchteBrückengelenkeUndHochfes,
      inhalt.werte.tunnelvortriebsmaschinenUndHochbelasterB,
      inhalt.werte.extremeHochhauskonstruktionenImSeismisch
    ],
    advantages: [
      inhalt.werte.maximaleGewichtseinsparungBeiSchweren,
      inhalt.werte.hervorragendGeeignetFürDynamisch,
      inhalt.werte.reduziertFundamentlastenUndTransportgewi,
      inhalt.werte.enormesEnergieeinsparpotenzialDurchMater
    ],
    exampleObject: {
      name: inhalt.werte.typischeAnwendungGewichtsoptimierteTragg,
      description: inhalt.werte.hochbelasteteGurteMobilkraneUnd,
      location: 'Lehrbeispiel'
    },
    carbonContent: inhalt.werte.t020ZusatzVon,
    density: '7.850 kg/m³',
    ductility: inhalt.werte.mäßigBisGutBruchdehnung,
    weldability: inhalt.werte.anspruchsvollStrikteEinhaltungVon
  },
  {
    id: 'Corten',
    name: inhalt.werte.s355j2wCortenst,
    sub: inhalt.werte.wetterfesterBaustahlMitSelbstschützender,
    werkstoffnummer: '1.8965',
    category: 'baustahl',
    categoryLabel: inhalt.werte.wetterfesterBaustahl,
    norm: inhalt.werte.dinEn100255,
    fy: 355,
    fu: 470,
    description: inhalt.werte.wetterfesterBaustahlDerKupfer,
    applications: [
      inhalt.werte.wartungsfreieFassadenbekleidungenImReprä,
      inhalt.werte.stahlbrückenbauwerkeImSchienennetzVollst,
      inhalt.werte.lärmschutzwändeDekorativeToreUnd,
      inhalt.werte.großskulpturenUndDenkmälerIm
    ],
    advantages: [
      inhalt.werte.kompletterWegfallVonLackierungs,
      inhalt.werte.sehrHoheUmweltfreundlichkeitDurch,
      inhalt.werte.charakteristischeLebendigeRotbraunOrange,
      inhalt.werte.statischÄquivalentZuStandardmäßigem
    ],
    exampleObject: {
      name: inhalt.werte.typischeAnwendungFassadenUnd,
      description: inhalt.werte.wetterfesterStahlBildetEine,
      location: 'Lehrbeispiel'
    },
    carbonContent: '≤ 0,16 %',
    density: '7.850 kg/m³',
    ductility: inhalt.werte.ausgezeichnetBruchdehnungA222,
    weldability: inhalt.werte.gutSchweißzusatzstoffeMüssenEbenfalls
  },
  {
    id: 'Edelstahl',
    name: inhalt.werte.t14404A4316l,
    sub: inhalt.werte.nichtrostenderSäureUndLochfraßbeständige,
    werkstoffnummer: '1.4404',
    category: 'edelstahl',
    categoryLabel: inhalt.werte.nichtrostenderEdelstahl,
    norm: inhalt.werte.dinEn100884,
    fy: 240,
    fu: 530,
    description: inhalt.werte.nichtrostenderAustenitischerChromNickel,
    applications: [
      inhalt.werte.fassadenbefestigungenKlinkertragankerUnd,
      inhalt.werte.tragendeDeckenhängerUndSchraubbolzen,
      inhalt.werte.abwasserbehandlungsanlagenKüstennaheInfr,
      inhalt.werte.chemischerLaborbauLebensmittelindustrieU
    ],
    advantages: [
      inhalt.werte.absoluterUndDauerhafterKorrosionsschutz,
      inhalt.werte.sehrGuteTieftemperatureigenschaftenAuch,
      inhalt.werte.magnetischExtremSchwachVöllig,
      inhalt.werte.keineZersetzungOderVerfärbung
    ],
    exampleObject: {
      name: inhalt.werte.schadensfallHallenbadUster1985,
      description: inhalt.werte.versagenVonDeckenabhängungenAus,
      location: inhalt.werte.usterSchweiz
    },
    carbonContent: inhalt.werte.t003ExtremAschearm,
    density: '7.980 kg/m³',
    ductility: inhalt.werte.herausragendBruchdehnungA40,
    weldability: inhalt.werte.sehrGutSchweißbarBenötigt
  },
  {
    id: 'B500B',
    name: inhalt.werte.b500bBetonstabstahl,
    sub: inhalt.werte.hochduktilerBewehrungsstahlFürDen,
    werkstoffnummer: '1.0439',
    category: 'bewehrung',
    categoryLabel: inhalt.werte.bewehrungsstahlHochduktilB,
    norm: inhalt.werte.din488Ec2,
    fy: 500,
    fu: 540, // f_tk = k · f_yk mit k ≥ 1,08
    description: inhalt.werte.warmgewalzterUndAusDer,
    applications: [
      inhalt.werte.biegeUndSchubbewehrungIn,
      inhalt.werte.hochbelasteteHochhausstützenUndRahmenkno,
      inhalt.werte.brückenüberbautenKappenUndWiderlager,
      inhalt.werte.tunnelinnenschalenUndSchutzbauwerke
    ],
    advantages: [
      inhalt.werte.garantierteHochduktilitätDehnungBei,
      inhalt.werte.hervorragenderVerbundbeiwertDurch2,
      inhalt.werte.ausgezeichneteKaltbiegbarkeitUmGenormte,
      inhalt.werte.problemloseEignungFürSchweißstöße
    ],
    exampleObject: {
      name: inhalt.werte.typischeAnwendungStabstahlIm,
      description: inhalt.werte.längsUndBügelbewehrungVon,
      location: 'Lehrbeispiel'
    },
    carbonContent: inhalt.werte.t022Cev0,
    density: '7.850 kg/m³',
    ductility: inhalt.werte.hochduktilKlasseBAgt,
    weldability: inhalt.werte.sehrGutSchweißbarNach
  },
  {
    id: 'B500A',
    name: inhalt.werte.b500aBetonstahlmatten,
    sub: inhalt.werte.normalduktilerBewehrungsstahlFürEbene,
    werkstoffnummer: '1.0438',
    category: 'bewehrung',
    categoryLabel: inhalt.werte.bewehrungsstahlNormalduktilA,
    norm: 'DIN 488-4',
    fy: 500,
    fu: 525,
    description: inhalt.werte.kaltgezogenerOderKaltgerippterBetonstahl,
    applications: [
      inhalt.werte.geschossdeckenplattenUndElementdeckenFil,
      inhalt.werte.nichtDrückendesWasserAbdichtende,
      inhalt.werte.bewehrungVonIndustrieestrichenUnd,
      inhalt.werte.fertigteilwerkeFürWandUnd
    ],
    advantages: [
      inhalt.werte.enormeVerlegegeschwindigkeitAufDer,
      inhalt.werte.hoheMaßgenauigkeitDerMaschenweiten,
      inhalt.werte.geringererVerlegeaufwandUndMinimierte,
      inhalt.werte.wirtschaftlicheMindestbewehrungZurRissbr
    ],
    exampleObject: {
      name: inhalt.werte.typischeAnwendungBetonstahlmatten,
      description: inhalt.werte.flächenbewehrungVonDeckenUnd,
      location: 'Lehrbeispiel'
    },
    carbonContent: inhalt.werte.t022Kaltverfestigt,
    density: '7.850 kg/m³',
    ductility: inhalt.werte.normalduktilKlasseAAgt,
    weldability: inhalt.werte.werkseitigPunktgeschweißtBaustellenschwe
  },
  {
    id: 'B500C',
    name: inhalt.werte.b500cErdbebenstahl,
    sub: inhalt.werte.seismischHochduktilerBewehrungsstabstahl,
    werkstoffnummer: '1.0440',
    category: 'bewehrung',
    categoryLabel: inhalt.werte.bewehrungsstahlHochduktilC,
    norm: inhalt.werte.dinEn19921,
    fy: 500,
    fu: 575, // k ≥ 1,15 (EN 1992-1-1, Anhang C)
    description: inhalt.werte.speziellerMikrolegierterOderThermomechan,
    applications: [
      inhalt.werte.erdbebensichereRahmenknotenStützenUnd,
      inhalt.werte.schutzbauwerkeBunkerUndKerntechnische,
      inhalt.werte.hochbelasteteBrückenpfeilerMitZyklischer,
      inhalt.werte.tunnelbautenImGebirgsdruckUnd
    ],
    advantages: [
      inhalt.werte.höchsteGarantiertePlastischeRotationskap,
      inhalt.werte.verhindertSprödesAbreißenDer,
      inhalt.werte.oberesStreckgrenzenverhältnisBegrenztFt,
      inhalt.werte.hervorragendeKaltbiegeeigenschaftenBeiEn
    ],
    exampleObject: {
      name: inhalt.werte.typischeAnwendungErdbebengebiete,
      description: inhalt.werte.bauteileMitPlanmäßigerPlastischer,
      location: 'Lehrbeispiel'
    },
    carbonContent: inhalt.werte.t022Cev02,
    density: '7.850 kg/m³',
    ductility: inhalt.werte.extremHochKlasseC,
    weldability: inhalt.werte.sehrGutSchweißbarNach2
  },
  {
    id: 'Y1860',
    name: inhalt.werte.y1860S7Spannlitze,
    sub: inhalt.werte.ultrahochfesterSpannstahlFürDen,
    werkstoffnummer: '1.8105',
    category: 'spannstahl',
    categoryLabel: inhalt.werte.spannstahlLitze,
    norm: inhalt.werte.abzDibtPren10138,
    fy: 1660, // Rp0.2 (fp0.1k = 1600 MPa)
    fu: 1860, // fpk
    description: inhalt.werte.patentierterMehrfachKaltgezogenerEutekto,
    applications: [
      inhalt.werte.interneUndExterneLängsvorspannung,
      inhalt.werte.vorgespannteFertigteilDachbinderUnd,
      inhalt.werte.spannbetonWindkrafttürmeHybridtürmeZur,
      inhalt.werte.vorgespannteFelsUndDauererdanker
    ],
    advantages: [
      inhalt.werte.nahezu5FacheStatische,
      inhalt.werte.verhindertBetonrissbildungUndEliminiert,
      inhalt.werte.extremNiedrigeRelaxationSpannkraftverlus,
      inhalt.werte.kompakterHüllrohrQuerschnittBei
    ],
    exampleObject: {
      name: inhalt.werte.typischeAnwendungLitzenspannglieder,
      description: inhalt.werte.interneUndExterneSpannglieder,
      location: 'Lehrbeispiel'
    },
    carbonContent: inhalt.werte.t080085,
    density: '7.850 kg/m³',
    ductility: inhalt.werte.begrenztElastoplastischAgt3,
    weldability: inhalt.werte.strengVerbotenJederLichtbogenkontakt
  },
  {
    id: 'SAS670',
    name: inhalt.werte.sas670Y1050Spannstab,
    sub: inhalt.werte.warmgewalzterGewindespannstahlFürGeotech,
    werkstoffnummer: '1.8010',
    category: 'spannstahl',
    categoryLabel: inhalt.werte.spannstahlGewindestab,
    norm: inhalt.werte.abzDibtPren101382,
    fy: 670,
    fu: 800,
    description: inhalt.werte.warmgewalzterMikrolegierterRundstahlMit,
    applications: [
      inhalt.werte.quervorspannungVonBrückenfahrbahnplatten,
      inhalt.werte.temporäreUndPermanenteBaugrubenaussteifu,
      inhalt.werte.zugankerImWasserbauSpundwandverankerunge,
      inhalt.werte.turmSegmentverspannungVonBeton
    ],
    advantages: [
      inhalt.werte.durchgehendesSchmutzunempfindlichesGrobg,
      inhalt.werte.hoheRobustheitGegenBaustellenbeschädigun,
      inhalt.werte.einfachesNachspannenOderEntspannen,
      inhalt.werte.hervorragendeDynamischeDauerschwingfesti
    ],
    exampleObject: {
      name: inhalt.werte.typischeAnwendungVerpressankerUnd,
      description: inhalt.werte.rückverankerungVonBaugrubenwändenFelsank,
      location: 'Lehrbeispiel'
    },
    carbonContent: '0,40 - 0,55 %',
    density: '7.850 kg/m³',
    ductility: inhalt.werte.gutAgt50,
    weldability: inhalt.werte.bedingtSchweißbarSonderverfahrenErforder
  }
];

export const structuralProfiles: StructuralProfile[] = [
  { id: 'IPE200', name: 'IPE 200', type: inhalt.werte.schmalerITräger, Wpl_y: 220.6, Area: 28.48, weight: 22.4, height: 200, width: 100 },
  { id: 'IPE300', name: 'IPE 300', type: inhalt.werte.schmalerITräger2, Wpl_y: 628.4, Area: 53.81, weight: 42.2, height: 300, width: 150 },
  { id: 'HEB200', name: 'HEB 200', type: inhalt.werte.breitflanschträgerSchwer, Wpl_y: 642.5, Area: 78.08, weight: 61.3, height: 200, width: 200 },
  { id: 'HEB300', name: 'HEB 300', type: inhalt.werte.breitflanschträgerSchwer2, Wpl_y: 1869.0, Area: 149.12, weight: 117.0, height: 300, width: 300 }
];

export interface SteelCurveDefinition {
  id: string;
  name: string;
  sub: string;
  werkstoffnummer: string;
  norm: string;
  color: string;
  category: 'baustahl' | 'hochfest' | 'sonder';
  categoryLabel: string;
  E: number; // MPa
  fy: number; // MPa (Streckgrenze fy bzw. Rp0.2)
  fu: number; // MPa (Zugfestigkeit)
  A: number; // % (Bruchdehnung)
  sh_strain: number; // % (Dehnung am Beginn der Kaltverfestigung)
  fu_strain: number; // % (Gleichmaßdehnung bei Höchstlast)
  frac_stress: number; // MPa (Bruchspannung nach Einschnürung)
  yieldType: 'ausgeprägt' | 'stetig';
  description: string;
  mechanism: string;
}

export const steelCurveDefinitions: SteelCurveDefinition[] = [
  {
    id: 'S235',
    name: 'S235JR',
    sub: inhalt.werte.klassischerUnlegierterBaustahl,
    werkstoffnummer: '1.0038',
    norm: inhalt.werte.dinEn1002523,
    color: '#2563eb', // Blau
    category: 'baustahl',
    categoryLabel: inhalt.werte.konventionellerBaustahl3,
    E: 210000,
    fy: 235,
    fu: 360,
    A: 26.0,
    sh_strain: 2.2,
    fu_strain: 15.0,
    frac_stress: 260,
    yieldType: 'ausgeprägt',
    description: inhalt.werte.sehrBreitesLüdersFließplateau,
    mechanism: inhalt.werte.cottrellAtmosphärenBlockierenVersetzunge
  },
  {
    id: 'S355',
    name: 'S355J2+N',
    sub: inhalt.werte.europäischerStandardIngenieurbaustahl,
    werkstoffnummer: '1.0577',
    norm: inhalt.werte.dinEn1002524,
    color: '#A3113E', // Shiraz
    category: 'baustahl',
    categoryLabel: inhalt.werte.konventionellerBaustahl4,
    E: 210000,
    fy: 355,
    fu: 510,
    A: 22.0,
    sh_strain: 1.8,
    fu_strain: 13.0,
    frac_stress: 370,
    yieldType: 'ausgeprägt',
    description: inhalt.werte.dasUnangefochteneArbeitstier51,
    mechanism: inhalt.werte.normalisierendesGlühenErzeugtFeines
  },
  {
    id: 'S460',
    name: 'S460N/M',
    sub: inhalt.werte.feinkornbaustahlFürSchlankeTragwerke,
    werkstoffnummer: '1.8901',
    norm: inhalt.werte.dinEn1002532,
    color: '#d97706', // Bernstein
    category: 'baustahl',
    categoryLabel: inhalt.werte.konventionellerBaustahl5,
    E: 210000,
    fy: 460,
    fu: 600,
    A: 17.0,
    sh_strain: 1.1,
    fu_strain: 10.0,
    frac_stress: 460,
    yieldType: 'ausgeprägt',
    description: inhalt.werte.kürzeresFließplateauMikrolegiertMit,
    mechanism: inhalt.werte.feinkornhärtungHallPetchBeziehung
  },
  {
    id: 'S690',
    name: 'S690QL',
    sub: inhalt.werte.wasservergüteterHochfesterBaustahl,
    werkstoffnummer: '1.8928',
    norm: inhalt.werte.dinEn1002562,
    color: '#7c3aed', // Violett
    category: 'hochfest',
    categoryLabel: inhalt.werte.hochfesterFeinkornbaustahl2,
    E: 210000,
    fy: 690,
    fu: 820,
    A: 14.0,
    sh_strain: 0.53,
    fu_strain: 7.5,
    frac_stress: 660,
    yieldType: 'stetig',
    description: inhalt.werte.keinAusgeprägtesFließplateauMehr,
    mechanism: inhalt.werte.wasserabschreckenUndAnlassenErzeugen
  },
  {
    id: 'S960',
    name: 'S960QL',
    sub: inhalt.werte.ultrahochfesterVergütungsstahl,
    werkstoffnummer: '1.8933',
    norm: inhalt.werte.dinEn1002563,
    color: '#b91c1c', // Dunkelrot
    category: 'hochfest',
    categoryLabel: inhalt.werte.hochfesterFeinkornbaustahl3,
    E: 210000,
    fy: 960,
    fu: 1050,
    A: 10.0,
    sh_strain: 0.66,
    fu_strain: 5.0,
    frac_stress: 880,
    yieldType: 'stetig',
    description: inhalt.werte.extremSteilerElastischerAnstieg,
    mechanism: inhalt.werte.ultrafeinesMartensitBainitGefüge
  },
  {
    id: 'B500B',
    name: inhalt.werte.betonstahlB500b,
    sub: inhalt.werte.hochduktilerBewehrungsstabstahl,
    werkstoffnummer: '1.0439',
    norm: inhalt.werte.din488Ec22,
    color: '#059669', // Smaragdgrün
    category: 'sonder',
    categoryLabel: inhalt.werte.bewehrungsSpannstahl,
    E: 205000,
    fy: 500,
    fu: 560,
    A: 12.0,
    sh_strain: 0.6,
    fu_strain: 5.0,
    frac_stress: 480,
    yieldType: 'ausgeprägt',
    description: inhalt.werte.normBewehrungsstahlDuktilitätsklasseB,
    mechanism: inhalt.werte.thermexVerfahrenRandschichtvergütungAus
  },
  {
    id: 'Y1860',
    name: inhalt.werte.spannstahlY1860,
    sub: inhalt.werte.kaltgezogene7DrähtigeSpannlitze,
    werkstoffnummer: '1.8105',
    norm: inhalt.werte.abzDibtPren101383,
    color: '#0284c7', // Helles Blau
    category: 'sonder',
    categoryLabel: inhalt.werte.bewehrungsSpannstahl2,
    E: 195000,
    fy: 1660, // Rp0.2 (fp0.1k = 1600 MPa)
    fu: 1860, // fpk
    A: 4.0, // Agt >= 3.5 %
    sh_strain: 1.05,
    fu_strain: 3.5,
    frac_stress: 1650,
    yieldType: 'stetig',
    description: inhalt.werte.höchsteStatischeZugfestigkeitIm,
    mechanism: inhalt.werte.patentierterMehrfachKaltgezogenerEutekto2
  },
  {
    id: 'B500A',
    name: inhalt.werte.betonstahlB500aMatten,
    sub: inhalt.werte.normalduktilerMattenstahlDin488,
    werkstoffnummer: '1.0438',
    norm: 'DIN 488-4',
    color: '#10b981', // Helles Grün
    category: 'sonder',
    categoryLabel: inhalt.werte.bewehrungsSpannstahl3,
    E: 205000,
    fy: 500,
    fu: 525,
    A: 6.0,
    sh_strain: 0.35,
    fu_strain: 2.5,
    frac_stress: 470,
    yieldType: 'stetig',
    description: inhalt.werte.kaltgezogenerBetonstahlFürLagermatten,
    mechanism: inhalt.werte.kaltverformungDurchZiehenUnd
  },
  {
    id: 'SAS670',
    name: inhalt.werte.spannstabSas670,
    sub: inhalt.werte.warmgewalzterGewindespannstahlY1050,
    werkstoffnummer: '1.8010',
    norm: inhalt.werte.abzDibtPren101384,
    color: '#0ea5e9', // Sky Blue
    category: 'sonder',
    categoryLabel: inhalt.werte.bewehrungsSpannstahl4,
    E: 205000,
    fy: 670,
    fu: 800,
    A: 10.0,
    sh_strain: 0.8,
    fu_strain: 5.0,
    frac_stress: 720,
    yieldType: 'stetig',
    description: inhalt.werte.mikrolegierterWarmgewalzterGewindestabFü,
    mechanism: inhalt.werte.feinkörnigesFerritPerlitGefüge
  },
  {
    id: 'Edelstahl',
    name: inhalt.werte.edelstahl14404,
    sub: inhalt.werte.austenitischerChromNickelMolybdän,
    werkstoffnummer: inhalt.werte.t14404316l,
    norm: inhalt.werte.dinEn1008842,
    color: '#ec4899', // Pink
    category: 'sonder',
    categoryLabel: inhalt.werte.nichtrostenderEdelstahl2,
    E: 200000,
    fy: 240, // Rp0.2
    fu: 580,
    A: 45.0,
    sh_strain: 0.32,
    fu_strain: 30.0,
    frac_stress: 420,
    yieldType: 'stetig',
    description: inhalt.werte.typischesRambergOsgoodVerhalten,
    mechanism: inhalt.werte.kubischFlächenzentriertesKfzAustenitgitt
  }
];

// Spannung sigma [MPa] bei Dehnung eps [%] – Rechenkern src/calc/werkstoffmodelle.ts
export const calculateSteelStressAtStrain = (steel: SteelCurveDefinition, eps: number): number => stahlSpannungBeiDehnung(steel, eps);

// Liefert den qualitativen Zustand der Verformung
export const getSteelDeformationPhase = (steel: SteelCurveDefinition, eps: number) => {
  // Phasengrenzen aus dem Rechenkern, Texte aus content/stahl/daten.json
  switch (stahlVerformungsphase(steel, eps)) {
    case 'ruhe': return { phase: 'Ruhezustand', text: inhalt.werte.unbelastet0Mpa, color: 'text-slate-500 bg-slate-100' };
    case 'bruch': return inhalt.daten.getSteelDeformationPhase;
    case 'elastisch': return steel.yieldType === 'ausgeprägt'
      ? { phase: inhalt.werte.t1ElastischerBereich, text: `Reversibel nach Hooke (E = ${formatDeWert(steel.E)} MPa)`, color: 'text-blue-700 bg-blue-100' }
      : { phase: inhalt.werte.t1ElastischerBereich2, text: `Reversibel nach Hooke bis Proportionalitätsgrenze (~${formatDeZahl(proportionalAnteil(steel) * steel.fy, 0)} MPa)`, color: 'text-blue-700 bg-blue-100' };
    case 'fliessplateau': return { phase: inhalt.werte.t2FließplateauLüdersbänder, text: `Spannung verharrt konstant bei fy = ${formatDeWert(steel.fy)} MPa`, color: 'text-amber-700 bg-amber-100' };
    case 'fliessuebergang': return { phase: inhalt.werte.t2FließübergangDehngrenze, text: `Elastisch-plastischer Übergang bis Rp0,2 = ${formatDeWert(steel.fy)} MPa`, color: 'text-purple-700 bg-purple-100' };
    case 'verfestigung': return { phase: inhalt.werte.t3KaltverfestigungPlastisch, text: `Plastische Reserve durch Versetzungsaufstau bis fu = ${formatDeWert(steel.fu)} MPa`, color: 'text-emerald-700 bg-emerald-100' };
    default: return { phase: inhalt.werte.t4EinschnürungLokaleVerengung, text: `Lokale Querschnittsreduktion bis zur Bruchdehnung A = ${formatDeWert(steel.A)} %`, color: 'text-rose-700 bg-rose-100' };
  }
};

// Punktreihe für Chart.js, streng monoton in x – Rechenkern src/calc/werkstoffmodelle.ts
export const generateSteelCurveDataPoints = (steel: SteelCurveDefinition) => stahlKennlinienPunkte(steel);
