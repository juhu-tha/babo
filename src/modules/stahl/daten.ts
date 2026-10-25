import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import inhalt from '@/content/stahl/daten.json';

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

// EC3 Part 1-2 Reduction factors for Carbon Steel
export const getReductionFactors = (temp: number) => {
  const temps = [20, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
  const ky = [1.0, 1.0, 1.0, 1.0, 1.0, 0.78, 0.47, 0.23, 0.11, 0.06, 0.04, 0.02, 0.0];
  const kE = [1.0, 1.0, 0.9, 0.8, 0.7, 0.6, 0.31, 0.13, 0.09, 0.0675, 0.045, 0.0225, 0.0];

  if (temp <= 20) return { ky: 1.0, kE: 1.0 };
  if (temp >= 1200) return { ky: 0.0, kE: 0.0 };

  for (let i = 0; i < temps.length - 1; i++) {
    if (temp >= temps[i] && temp <= temps[i + 1]) {
      const t = (temp - temps[i]) / (temps[i + 1] - temps[i]);
      return {
        ky: ky[i] + t * (ky[i + 1] - ky[i]),
        kE: kE[i] + t * (kE[i + 1] - kE[i])
      };
    }
  }
  return { ky: 1.0, kE: 1.0 };
};

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

// Berechnet die physikalisch konsistente Spannung sigma [MPa] bei beliebiger Dehnung eps [%]
export const calculateSteelStressAtStrain = (steel: SteelCurveDefinition, eps: number): number => {
  if (eps <= 0) return 0;
  if (eps > steel.A) return 0; // Nach Bruch keine Spannung

  if (steel.yieldType === 'ausgeprägt') {
    const eps_el = (steel.fy / steel.E) * 100; // in %
    if (eps <= eps_el) {
      return steel.E * (eps / 100);
    }
    // Fließplateau (Lüders-Bereich)
    if (eps <= steel.sh_strain) {
      return steel.fy;
    }
    // Kaltverfestigungsbereich bis fu bei Gleichmaßdehnung fu_strain
    if (eps <= steel.fu_strain) {
      const t = (eps - steel.sh_strain) / (steel.fu_strain - steel.sh_strain);
      // t in [0, 1]: parabolischer Übergang mit horizontaler Tangente bei fu
      return steel.fy + (steel.fu - steel.fy) * (2 * t - t * t);
    }
    // Einschnürbereich bis zum Bruch
    const t = (eps - steel.fu_strain) / (steel.A - steel.fu_strain);
    return steel.fu - (steel.fu - steel.frac_stress) * t;
  } else {
    // Stetiger Fließübergang (Ramberg-Osgood / Vergütet / Kaltgezogen / Edelstahl)
    const s_prop = (steel.id === 'Edelstahl' ? 0.65 : 0.75) * steel.fy;
    const eps_prop = (s_prop / steel.E) * 100;
    const eps_p02 = (steel.fy / steel.E) * 100 + 0.2;

    if (eps <= eps_prop) {
      return steel.E * (eps / 100);
    }

    if (eps <= eps_p02) {
      const t = (eps - eps_prop) / (eps_p02 - eps_prop);
      // Glatter degressiver Übergang von s_prop exakt zu fy (Rp0,2)
      return s_prop + (steel.fy - s_prop) * (1 - Math.pow(1 - t, 1.6));
    }

    if (eps <= steel.fu_strain) {
      const t = (eps - eps_p02) / (steel.fu_strain - eps_p02);
      // Verfestigung von fy zu fu mit horizontaler Tangente bei fu
      return steel.fy + (steel.fu - steel.fy) * (2 * t - t * t);
    }

    // Einschnürbereich bis zum Bruch bei A
    const t = (eps - steel.fu_strain) / (steel.A - steel.fu_strain);
    return steel.fu - (steel.fu - steel.frac_stress) * t;
  }
};

// Liefert den qualitativen Zustand der Verformung
export const getSteelDeformationPhase = (steel: SteelCurveDefinition, eps: number) => {
  if (eps <= 0) return { phase: 'Ruhezustand', text: inhalt.werte.unbelastet0Mpa, color: 'text-slate-500 bg-slate-100' };
  if (eps > steel.A) return inhalt.daten.getSteelDeformationPhase;

  if (steel.yieldType === 'ausgeprägt') {
    const eps_el = (steel.fy / steel.E) * 100;
    if (eps <= eps_el) {
      return { 
        phase: inhalt.werte.t1ElastischerBereich, 
        text: `Reversibel nach Hooke (E = ${formatDeWert(steel.E)} MPa)`, 
        color: 'text-blue-700 bg-blue-100' 
      };
    }
    if (eps <= steel.sh_strain) {
      return { 
        phase: inhalt.werte.t2FließplateauLüdersbänder, 
        text: `Spannung verharrt konstant bei fy = ${formatDeWert(steel.fy)} MPa`, 
        color: 'text-amber-700 bg-amber-100' 
      };
    }
  } else {
    const s_prop = (steel.id === 'Edelstahl' ? 0.65 : 0.75) * steel.fy;
    const eps_prop = (s_prop / steel.E) * 100;
    const eps_p02 = (steel.fy / steel.E) * 100 + 0.2;

    if (eps <= eps_prop) {
      return { 
        phase: inhalt.werte.t1ElastischerBereich2, 
        text: `Reversibel nach Hooke bis Proportionalitätsgrenze (~${formatDeZahl(s_prop, 0)} MPa)`, 
        color: 'text-blue-700 bg-blue-100' 
      };
    }
    if (eps <= eps_p02) {
      return { 
        phase: inhalt.werte.t2FließübergangDehngrenze, 
        text: `Elastisch-plastischer Übergang bis Rp0,2 = ${formatDeWert(steel.fy)} MPa`, 
        color: 'text-purple-700 bg-purple-100' 
      };
    }
  }

  if (eps <= steel.fu_strain) {
    return { 
      phase: inhalt.werte.t3KaltverfestigungPlastisch, 
      text: `Plastische Reserve durch Versetzungsaufstau bis fu = ${formatDeWert(steel.fu)} MPa`, 
      color: 'text-emerald-700 bg-emerald-100' 
    };
  }

  return { 
    phase: inhalt.werte.t4EinschnürungLokaleVerengung, 
    text: `Lokale Querschnittsreduktion bis zur Bruchdehnung A = ${formatDeWert(steel.A)} %`, 
    color: 'text-rose-700 bg-rose-100' 
  };
};

// Generiert die Punktreihe für Chart.js streng monoton steigend ohne Schleifen und Rücksprünge
export const generateSteelCurveDataPoints = (steel: SteelCurveDefinition) => {
  const points: { x: number; y: number }[] = [];
  const xSet = new Set<number>();

  const addPoint = (x: number) => {
    if (x >= 0 && x <= steel.A) {
      xSet.add(Number(x.toFixed(3)));
    }
  };

  addPoint(0);

  const eps_el = (steel.fy / steel.E) * 100;
  const eps_p02 = eps_el + 0.2;
  const s_prop = (steel.id === 'Edelstahl' ? 0.65 : 0.75) * steel.fy;
  const eps_prop = (s_prop / steel.E) * 100;

  // 1. Sehr dichte Abtastung im elastischen Bereich & Fließbeginn
  const elasticEnd = steel.yieldType === 'ausgeprägt' ? steel.sh_strain : eps_p02;
  const fineLimit = Math.min(steel.A, elasticEnd + 0.3);

  for (let e = 0.02; e <= fineLimit; e += 0.02) {
    addPoint(e);
  }

  // Wichtige Stützstellen einfügen
  if (steel.yieldType === 'ausgeprägt') {
    addPoint(eps_el);
    addPoint(eps_el + 0.015); // ReH Peak
    addPoint(eps_el + 0.04);  // Rückkehr zu ReL
    addPoint(steel.sh_strain);
  } else {
    addPoint(eps_prop);
    addPoint(eps_p02);
  }

  // 2. Kaltverfestigung
  const midStep = steel.fu_strain > 15 ? 0.4 : 0.2;
  for (let e = fineLimit; e <= steel.fu_strain; e += midStep) {
    addPoint(e);
  }
  addPoint(steel.fu_strain);

  // 3. Einschnürbereich
  const postStep = (steel.A - steel.fu_strain) > 10 ? 0.5 : 0.25;
  for (let e = steel.fu_strain + postStep; e <= steel.A; e += postStep) {
    addPoint(e);
  }
  addPoint(steel.A);

  // Exakt aufsteigend nach x sortieren
  const sortedX = Array.from(xSet).sort((a, b) => a - b);

  for (const x of sortedX) {
    if (steel.yieldType === 'ausgeprägt') {
      const eps_el_val = (steel.fy / steel.E) * 100;
      if (Math.abs(x - (eps_el_val + 0.015)) < 0.006) {
        points.push({ x, y: Number((steel.fy * 1.035).toFixed(1)) });
        continue;
      }
    }
    const y = calculateSteelStressAtStrain(steel, x);
    points.push({ x, y: Number(y.toFixed(1)) });
  }

  return points;
};
