import inhalt from '@/content/materialschaedengross/daten.json';
export interface DamageCaseStudy {
  id: string;
  name: string;
  subTitle: string;
  category: 'bruecken' | 'hallen' | 'infrastruktur' | 'hochbau';
  year: string;
  location: string;
  structureType: string;
  keyMaterialMechanism: string;
  summary: string;
  typischeBauschaedenLink?: {
    subTab: 'feuchtigkeit' | 'risse' | 'korrosion' | 'unvertraeglichkeiten' | 'tief_ingenieurbau' | 'analysator';
    label: string;
    description: string;
  };
  sources: {
    title: string;
    institutionOrAuthor: string;
    details: string;
    url?: string;
  }[];
  projectData: {
    baujahr: string;
    schadensdatum: string;
    ort: string;
    tragwerkstyp: string;
    beteiligteBaustoffe: string[];
    spannweiteAbmessungen: string;
    opferZahlen: string;
    gesamtschaden: string;
  };
  historie: {
    phase: string;
    zeitraum: string;
    details: string;
  }[];
  ursachen: {
    titel: string;
    kategorie: 'Material/Werkstoff' | 'Planung/Statik' | 'Ausführung' | 'Unterhalt/Monitoring' | 'Umwelteinfluss';
    beschreibung: string;
    formelOrMechanismus?: string;
  }[];
  folgen: {
    bereich: string;
    auswirkung: string;
    normativeKonsequenz: string;
  }[];
  lessonsLearned: string[];
  quellenlage?: string;
}

export const DAMAGE_CASES: DamageCaseStudy[] = [
  {
    id: 'bad_reichenhall',
    name: inhalt.werte.einsturzDerEishalleBad,
    subTitle: inhalt.werte.kollapsUnterSchneelastInfolge,
    category: 'hallen',
    year: '2006',
    location: inhalt.werte.badReichenhallBayernDeutschland,
    structureType: inhalt.werte.dachtragwerkAusBrettschichtholzKastenträ,
    keyMaterialMechanism: inhalt.werte.ureaFormaldehydLeimversagenUf,
    summary: inhalt.werte.am2Januar2006,
    projectData: {
      baujahr: '1971–1973',
      schadensdatum: inhalt.werte.t02Januar2006Ca,
      ort: inhalt.werte.badReichenhallBerchtesgadenerLand,
      tragwerkstyp: inhalt.werte.dachkonstruktionAusBrettschichtholzHaupt,
      beteiligteBaustoffe: [inhalt.werte.brettschichtholzBshFichte, inhalt.werte.ureaFormaldehydHarzleimNicht, inhalt.werte.mineralwolleDämmungDurchnässt],
      spannweiteAbmessungen: inhalt.werte.hallengrößeCa75M,
      opferZahlen: inhalt.werte.t15Todesopfer34Verletzte,
      gesamtschaden: inhalt.werte.vollständigerTotalschadenStrafrechtliche
    },
    historie: [
      {
        phase: inhalt.werte.t1PlanungErrichtung1971,
        zeitraum: '1971–1973',
        details: inhalt.werte.errichtungDerEishalleFür
      },
      {
        phase: inhalt.werte.t2BetriebsphaseKondensatakkumulation1974,
        zeitraum: '1974–2005',
        details: inhalt.werte.überJahrzehnteDrangFeuchtwarme
      },
      {
        phase: inhalt.werte.t3IgnorierteWarnsignaleMängelberichte,
        zeitraum: '2000–2005',
        details: inhalt.werte.wiederholtTropfteKondenswasserVon
      },
      {
        phase: inhalt.werte.t4KatastrophalerEinsturz02,
        zeitraum: '02.01.2006',
        details: inhalt.werte.nachStarkemSchneefallLag
      }
    ],
    ursachen: [
      {
        titel: inhalt.werte.hydrolytischerZerfallDesHarnstoff,
        kategorie: 'Material/Werkstoff',
        beschreibung: inhalt.werte.harnstoffFormaldehydPolymereUrea,
        formelOrMechanismus: '-\\text{NH}-\\text{CH}_2-\\text{NH}- + \\text{H}_2\\text{O} \\xrightarrow{\\text{pH} < 5, \\, \\text{Feuchte}} -\\text{NH}_2 + \\text{HCHO} + \\text{H}_2\\text{N}-'
      },
      {
        titel: inhalt.werte.bauphysikalischeFehldimensionierungDampf,
        kategorie: 'Planung/Statik',
        beschreibung: inhalt.werte.fehlendeOderDurchPerforationen,
        formelOrMechanismus: 'p_i > p_e \\implies g = -\\delta_0 \\cdot \\frac{\\Delta p}{s_d} \\quad \\text{(permanenter Feuchtestrom in Hohlträger)}'
      },
      {
        titel: inhalt.werte.mängelInKonstruktionUnd,
        kategorie: 'Ausführung',
        beschreibung: inhalt.werte.nachDenErmittlungenLagen
      },
      {
        titel: inhalt.werte.fehlendeRegelmäßigeBauwerksprüfungPrüfde,
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: inhalt.werte.zumUnglückszeitpunktGabEs
      }
    ],
    folgen: [
      {
        bereich: inhalt.werte.regelwerkeNormung,
        auswirkung: inhalt.werte.klebstoffeFürTragendeHolzbauteile,
        normativeKonsequenz: inhalt.werte.dinEn19951
      },
      {
        bereich: inhalt.werte.bauwerksinspektionStandsicherheit,
        auswirkung: inhalt.werte.argebauHinweiseFürDie,
        normativeKonsequenz: inhalt.werte.vdi6200BegehungInspektion
      },
      {
        bereich: inhalt.werte.rechtsprechungJustiz,
        auswirkung: inhalt.werte.strafverfahrenWegenFahrlässigerTötung,
        normativeKonsequenz: inhalt.werte.bghUrtV12
      }
    ],
    lessonsLearned: [
      inhalt.werte.inDauernassbereichenOderEishallen,
      inhalt.werte.versteckteHohlkastenträgerOhneInspektion,
      inhalt.werte.sonderbautenMitGroßenSpannweiten
    ],
    quellenlage: inhalt.werte.gutachtenImStrafverfahrenNicht,
    typischeBauschaedenLink: {
      subTab: 'feuchtigkeit',
      label: inhalt.werte.feuchtigkeitTauwasserausfallSchimmel,
      description: inhalt.werte.bauphysikalischeFeuchteakkumulationTaupu
    },
    sources: [
      {
        title: inhalt.werte.eishalleBadReichenhallÜbersicht,
        institutionOrAuthor: 'Wikipedia',
        details: inhalt.werte.sekundärquelleDieGutachtenSelbst
      },
      {
        title: inhalt.werte.bghUrteilVom12,
        institutionOrAuthor: 'Bundesgerichtshof',
        details: inhalt.werte.revisionsentscheidungImStrafverfahrenAuf
      },
      {
        title: inhalt.werte.hinweiseFürDieÜberprüfung,
        institutionOrAuthor: inhalt.werte.argebauBauministerkonferenz,
        details: inhalt.werte.fassungSeptember2006Grundlage
      },
      {
        title: inhalt.werte.standsicherheitVonBauwerkenRegelmäßige,
        institutionOrAuthor: inhalt.werte.vereinDeutscherIngenieureVdi,
        details: inhalt.werte.empfehlungZurPeriodischenÜberprüfung,
        url: 'https://www.vdi.de/richtlinien/details/vdi-6200-standsicherheit-von-bauwerken-regelmaessige-ueberpruefung'
      }
    ]
  },
  {
    id: 'polcevera_genua',
    name: inhalt.werte.einsturzDesPolceveraViadukts,
    subTitle: inhalt.werte.katastrophalesVersagenKorrodierterSpanns,
    category: 'bruecken',
    year: '2018',
    location: inhalt.werte.genuaLigurienItalien,
    structureType: inhalt.werte.schrägkabelbrückeSpannbetonbrückeNachDem,
    keyMaterialMechanism: inhalt.werte.fortgeschritteneKorrosionQuerschnittsver,
    summary: inhalt.werte.am14August2018,
    projectData: {
      baujahr: '1963–1967',
      schadensdatum: inhalt.werte.t14August2018Ca,
      ort: inhalt.werte.genuaAutostradaA10,
      tragwerkstyp: inhalt.werte.spannbetonSchrägseilbrückeMitDreibein,
      beteiligteBaustoffe: [inhalt.werte.hochfesterSpannstahlPatentstahldraht, 'Portlandzementbeton', inhalt.werte.injektionsmörtelZementleimMitHohlräumen],
      spannweiteAbmessungen: inhalt.werte.gesamtlänge1182M,
      opferZahlen: inhalt.werte.t43Todesopfer16Verletzte,
      gesamtschaden: inhalt.werte.mehrereHundertMillionenEuro
    },
    historie: [
      {
        phase: inhalt.werte.t1InnovationEntwurfMorandi,
        zeitraum: '1963–1967',
        details: inhalt.werte.riccardoMorandiEntwarfEine
      },
      {
        phase: inhalt.werte.t2AggressivesMeeresUnd,
        zeitraum: '1970–1993',
        details: inhalt.werte.dieBrückeLagDirekt
      },
      {
        phase: inhalt.werte.t3InjektionsdefiziteUnvollständigerVerpre,
        zeitraum: '1995–2018',
        details: inhalt.werte.untersuchungenZeigtenVerpressfehlerHohlr
      },
      {
        phase: inhalt.werte.t4ReißenderBruchPylonkollaps,
        zeitraum: '14.08.2018',
        details: inhalt.werte.eineAbspannungDesSystems
      }
    ],
    ursachen: [
      {
        titel: inhalt.werte.korrosionDerSpannstahllitzenIn,
        kategorie: 'Material/Werkstoff',
        beschreibung: inhalt.werte.fortgeschritteneKorrosionMitQuerschnitts
      },
      {
        titel: inhalt.werte.injektionsfehlerHohlräumeInDen,
        kategorie: 'Ausführung',
        beschreibung: inhalt.werte.unvollständigesVerpressenDerVertikalen,
        formelOrMechanismus: '\\text{pH-Wert sinkt von } > 12{,}5 \\text{ auf } < 9 \\implies \\text{Depassivierung des Stahls}'
      },
      {
        titel: inhalt.werte.mangelndeRedundanzDesTragsystems,
        kategorie: 'Planung/Statik',
        beschreibung: inhalt.werte.dieKonstruktionBesaßNur,
        formelOrMechanismus: '\\text{Redundanzgrad } R = 0 \\implies \\text{Kein alternativer Lastabtragungspfad}'
      },
      {
        titel: inhalt.werte.verdeckteSpanngliederOhneZfp,
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: inhalt.werte.dieDickeBetonummantelungVerhinderte
      }
    ],
    folgen: [
      {
        bereich: inhalt.werte.brückenbauKonstruktionsprinzipien,
        auswirkung: inhalt.werte.vollständigeÄchtungMonolithischBetonumma,
        normativeKonsequenz: inhalt.werte.fibModelCodeDin
      },
      {
        bereich: inhalt.werte.brückeninspektionMonitoring,
        auswirkung: inhalt.werte.verschärfungDerBrückenprüfungenIn,
        normativeKonsequenz: inhalt.werte.din1076Neuausgabe2026
      },
      {
        bereich: 'Infrastrukturpolitik',
        auswirkung: inhalt.werte.rücknahmeVonAutobahnkonzessionenMassive,
        normativeKonsequenz: inhalt.werte.neubauDesViadottoGenova
      }
    ],
    lessonsLearned: [
      inhalt.werte.tragwerkeMüssenRedundantAusgelegt,
      inhalt.werte.spannbetonbauteileMüssenFürZerstörungsfr,
      inhalt.werte.schrägseileUndSpanngliederMüssen
    ],
    quellenlage: inhalt.werte.berichtDerMinisteriellenKommission,
    typischeBauschaedenLink: {
      subTab: 'tief_ingenieurbau',
      label: inhalt.werte.tiefIngenieurbauBrückenschäden,
      description: inhalt.werte.zerstörungsfreiePrüfverfahrenZfpInjektio
    },
    sources: [
      {
        title: inhalt.werte.relazioneTecnicaDellaCommissione,
        institutionOrAuthor: inhalt.werte.ministeroDelleInfrastruttureE,
        details: inhalt.werte.berichtDerMinisteriellenUntersuchungskom,
        url: 'https://de.wikipedia.org/wiki/Polcevera-Viadukt'
      },
      {
        title: inhalt.werte.onceUponATime,
        institutionOrAuthor: inhalt.werte.calviGMEt,
        details: inhalt.werte.fachaufsatzZuEntwurfZustand,
        url: 'https://www.tandfonline.com/doi/abs/10.1080/10168664.2018.1558033'
      },
      {
        title: inhalt.werte.fibBulletin89Acceptance,
        institutionOrAuthor: inhalt.werte.internationalFederationForStructural,
        details: inhalt.werte.internationaleRichtlinieFürSchrägkabel
      }
    ]
  },
  {
    id: 'carolabrücke_dresden',
    name: inhalt.werte.teileinsturzDerCarolabrückeDresden,
    subTitle: inhalt.werte.wasserstoffinduzierteSpannungsrisskorros,
    category: 'bruecken',
    year: '2024',
    location: inhalt.werte.dresdenSachsenDeutschland,
    structureType: inhalt.werte.spannbetonHohlkastenbrückeMitVouten,
    keyMaterialMechanism: inhalt.werte.wasserstoffinduzierteSpannungsrisskorros2,
    summary: inhalt.werte.inDerNachtZum,
    projectData: {
      baujahr: '1967–1971',
      schadensdatum: inhalt.werte.t11September2024Ca,
      ort: inhalt.werte.dresdenElbeüberquerungB170,
      tragwerkstyp: inhalt.werte.spannbetonDurchlaufträgerMitVeränderlich,
      beteiligteBaustoffe: [inhalt.werte.ddrSpannstahlSt140, inhalt.werte.b450Portlandzementbeton, inhalt.werte.einpressmörtelSpanngliederInDer],
      spannweiteAbmessungen: inhalt.werte.hauptöffnungÜberDerElbe,
      opferZahlen: inhalt.werte.keinePersonenschädenEinsturzErfolgte,
      gesamtschaden: inhalt.werte.verlustDerBrückenhälfteSchifffahrtssperr
    },
    historie: [
      {
        phase: inhalt.werte.t1BauwerkserrichtungMitHennigsdorfer,
        zeitraum: '1967–1971',
        details: inhalt.werte.dieCarolabrückeGaltAls
      },
      {
        phase: inhalt.werte.t2SanierungsmaßnahmenDerZüge,
        zeitraum: '2019–2023',
        details: inhalt.werte.dieZügeAUnd
      },
      {
        phase: inhalt.werte.t3ErmüdungUndSukzessive,
        zeitraum: '1971–2024',
        details: inhalt.werte.ausgehendVonDenIn
      },
      {
        phase: inhalt.werte.t4VersagenImStützquerschnitt,
        zeitraum: '11.09.2024',
        details: inhalt.werte.dasVersagenTratIm
      }
    ],
    ursachen: [
      {
        titel: inhalt.werte.wasserstoffinduzierteSpannungsrisskorros3,
        kategorie: 'Material/Werkstoff',
        beschreibung: inhalt.werte.derVerwendeteVergüteteHennigsdorfer,
        formelOrMechanismus: '\\text{H}^+ + e^- \\rightarrow \\text{H}_{\\text{ad}} \\xrightarrow{\\text{Diffusion}} \\text{Gitterversprödung an Korngrenzen}'
      },
      {
        titel: inhalt.werte.anrisseInDerBauzeit,
        kategorie: 'Ausführung',
        beschreibung: inhalt.werte.langeUnverpressteSpanngliederIn
      },
      {
        titel: inhalt.werte.fehlendesAnkündigungsverhaltenImStützber,
        kategorie: 'Planung/Statik',
        beschreibung: inhalt.werte.amStrompfeilerDVerhinderte
      },
      {
        titel: inhalt.werte.grenzenDerVisuellenBrückenprüfung,
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: inhalt.werte.dieSpannungsrisskorrosionLiefUnsichtbar
      }
    ],
    folgen: [
      {
        bereich: inhalt.werte.bundesweiteBrückenüberprüfung,
        auswirkung: inhalt.werte.überprüfungVonSpannbetonbrückenMit,
        normativeKonsequenz: inhalt.werte.handlungsanweisungZurÜberprüfungUnd
      },
      {
        bereich: inhalt.werte.zfpDauermonitoring,
        auswirkung: inhalt.werte.verstärkterEinsatzVonSchallemissionsmoni,
        normativeKonsequenz: inhalt.werte.einsatzVonSchallemissionsanalyseSea
      },
      {
        bereich: inhalt.werte.verkehrsStädtebau,
        auswirkung: inhalt.werte.vollständigerAbrissVonBrückenzug,
        normativeKonsequenz: inhalt.werte.ersatzneubauInPlanungAktueller
      }
    ],
    lessonsLearned: [
      inhalt.werte.bauwerkeMitSpannungsrisskorrosionsgefähr,
      inhalt.werte.visuelleBrückenprüfungenStoßenBei,
      inhalt.werte.schädenAusDerBauzeit
    ],
    quellenlage: inhalt.werte.gutachtenImAuftragDer,
    typischeBauschaedenLink: {
      subTab: 'korrosion',
      label: inhalt.werte.korrosionBetonschäden,
      description: inhalt.werte.spannungsrisskorrosionDepassivierungDesB
    },
    sources: [
      {
        title: inhalt.werte.ersterZwischenberichtZumEinsturz,
        institutionOrAuthor: inhalt.werte.landeshauptstadtDresdenProfDr,
        details: inhalt.werte.zwischenbericht2024GutachtenKurzfassung,
        url: 'https://de.wikipedia.org/wiki/Carolabr%C3%BCcke_(Dresden)'
      },
      {
        title: inhalt.werte.handlungsanweisungZurÜberprüfungUnd2,
        institutionOrAuthor: inhalt.werte.bmvbs2011HeuteBmv,
        details: inhalt.werte.nachweisDesAnkündigungsverhaltensFür,
        url: 'https://bmdv.bund.de/'
      }
    ]
  },
  {
    id: 'silver_bridge',
    name: inhalt.werte.einsturzDerSilverBridge,
    subTitle: inhalt.werte.sprödbruchEinerEinzigenAugenstab,
    category: 'bruecken',
    year: '1967',
    location: inhalt.werte.pointPleasantWestVirginia,
    structureType: inhalt.werte.kettenhängebrückeMitAugenstäbenEyebar,
    keyMaterialMechanism: inhalt.werte.spannungskorrosionUndSchwingungsrisskorr,
    summary: inhalt.werte.am15Dezember1967,
    projectData: {
      baujahr: '1928',
      schadensdatum: inhalt.werte.t15Dezember1967Ca,
      ort: inhalt.werte.pointPleasantWestVirginia2,
      tragwerkstyp: inhalt.werte.augenstabKettenhängebrückeMitVersteifung,
      beteiligteBaustoffe: [inhalt.werte.wärmebehandelterKohlenstoffstahlAisi1060, 'Kettenbolzen'],
      spannweiteAbmessungen: inhalt.werte.hauptstützweite213MGesamtlänge,
      opferZahlen: inhalt.werte.t46Todesopfer9Schwerverletzte,
      gesamtschaden: inhalt.werte.vollständigerBrückenverlustNeuordnungDer
    },
    historie: [
      {
        phase: inhalt.werte.t1PionierbauwerkMitNeuartigem,
        zeitraum: '1928',
        details: inhalt.werte.dieBrückeWurdeStatt
      },
      {
        phase: inhalt.werte.t2VerkehrszunahmeLkwGewichte,
        zeitraum: '1930–1967',
        details: inhalt.werte.dasVerkehrsaufkommenUndDie
      },
      {
        phase: inhalt.werte.t3MikrorissbildungImBolzenloch,
        zeitraum: inhalt.werte.ca19501967,
        details: inhalt.werte.imInnerenDesAuges
      },
      {
        phase: inhalt.werte.t4SchlagartigerSprödbruch15,
        zeitraum: '15.12.1967',
        details: inhalt.werte.beiNiedrigenAußentemperaturen1
      }
    ],
    ursachen: [
      {
        titel: inhalt.werte.bruchmechanischerSprödbruchKI,
        kategorie: 'Material/Werkstoff',
        beschreibung: inhalt.werte.derVerwendeteStahlBesaß,
        formelOrMechanismus: 'K_I = Y \\cdot \\sigma \\cdot \\sqrt{\\pi a} \\ge K_{Ic} \\implies \\text{katastrophales instabiles Risswachstum}'
      },
      {
        titel: inhalt.werte.fehlendeRedundanzBruchkritischerBauteil,
        kategorie: 'Planung/Statik',
        beschreibung: inhalt.werte.einTragsystemAusNur,
        formelOrMechanismus: '\\text{FCM-Klassifizierung: Kein Sekundärtragpfad vorhanden}'
      },
      {
        titel: inhalt.werte.unzugänglicheBolzenverbindung,
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: inhalt.werte.derRissBefandSich
      }
    ],
    folgen: [
      {
        bereich: inhalt.werte.usBundesgesetzePrüfvorschriften,
        auswirkung: inhalt.werte.verabschiedungDesFederalAid,
        normativeKonsequenz: inhalt.werte.nbisNationalBridgeInspection
      },
      {
        bereich: inhalt.werte.werkstoffkundeBruchmechanik,
        auswirkung: inhalt.werte.rasanterAufstiegDerLinearen,
        normativeKonsequenz: inhalt.werte.astmNormenZurBruchzähigkeit
      }
    ],
    lessonsLearned: [
      inhalt.werte.hochfesteStähleDürfenNiemals,
      inhalt.werte.konstruktionenMüssenSoAusgelegt,
      inhalt.werte.brückenOhneRedundanzFracture
    ],
    quellenlage: inhalt.werte.amtlicherUntersuchungsberichtNtsbHar,
    typischeBauschaedenLink: {
      subTab: 'risse',
      label: inhalt.werte.risseSprödbruchVerformungen,
      description: inhalt.werte.spannungsintensitätKiElastischeBruchmech
    },
    sources: [
      {
        title: inhalt.werte.highwayAccidentReportCollapse,
        institutionOrAuthor: inhalt.werte.nationalTransportationSafetyBoard,
        details: inhalt.werte.offiziellerUsBundesuntersuchungsberichtZ,
        url: 'https://de.wikipedia.org/wiki/Silver_Bridge'
      },
      {
        title: inhalt.werte.analysisOfTheEyebar,
        institutionOrAuthor: inhalt.werte.nationalBureauOfStandards,
        details: inhalt.werte.grundlegendeMetallurgischeUndBruchmechan
      },
      {
        title: inhalt.werte.nationalBridgeInspectionStandards,
        institutionOrAuthor: inhalt.werte.federalHighwayAdministrationFhwa,
        details: inhalt.werte.historischeEinführungBundesweiterPrüfvor,
        url: 'https://www.fhwa.dot.gov/bridge/nbis.cfm'
      }
    ]
  },
  {
    id: 'kongresshalle_berlin',
    name: inhalt.werte.teileinsturzDerKongresshalleBerlin,
    subTitle: inhalt.werte.korrosionVonSpanngliedernIm,
    category: 'hallen',
    year: '1980',
    location: inhalt.werte.berlinTiergartenDeutschland,
    structureType: inhalt.werte.hängedachSchalenkonstruktionSattelfläche,
    keyMaterialMechanism: inhalt.werte.korrosionDerSpanngliederIm,
    summary: inhalt.werte.am21Mai1980,
    projectData: {
      baujahr: '1956–1957',
      schadensdatum: inhalt.werte.t21Mai1980Ca,
      ort: inhalt.werte.berlinTiergartenJohnFoster,
      tragwerkstyp: inhalt.werte.sattelförmigGekrümmtesHängedachHyperboli,
      beteiligteBaustoffe: [inhalt.werte.vergüteterSpannstahl, inhalt.werte.b225B300Beton, 'Zementeinpressmörtel'],
      spannweiteAbmessungen: inhalt.werte.bogenspannweiteCa60M,
      opferZahlen: inhalt.werte.t1TodesopferEinRundfunkjournalist,
      gesamtschaden: inhalt.werte.einsturzDesSüdbogensAufwändiger
    },
    historie: [
      {
        phase: inhalt.werte.t1BauAlsSymbol,
        zeitraum: '1956–1957',
        details: inhalt.werte.usBeitragZurInternationalen
      },
      {
        phase: inhalt.werte.t2ZwängungenUnvollständigeFugenabdichtung,
        zeitraum: '1958–1979',
        details: inhalt.werte.zwischenDerDachhautUnd
      },
      {
        phase: inhalt.werte.t3BruchDerSpannglieder,
        zeitraum: '21.05.1980',
        details: inhalt.werte.dieKorrodiertenSpanngliederBrachen
      }
    ],
    ursachen: [
      {
        titel: inhalt.werte.korrosionDerSpanngliederIm2,
        kategorie: 'Material/Werkstoff',
        beschreibung: inhalt.werte.wasserGelangteÜberRisse
      },
      {
        titel: inhalt.werte.injektionsmängelFehlstellenImVerpressmör,
        kategorie: 'Ausführung',
        beschreibung: inhalt.werte.dieSpannstahlSpanngliederWaren
      },
      {
        titel: inhalt.werte.nichtBerücksichtigteZwangsbeanspruchunge,
        kategorie: 'Planung/Statik',
        beschreibung: inhalt.werte.dieStatischeKopplungZwischen
      }
    ],
    folgen: [
      {
        bereich: inhalt.werte.spannstahlzulassungenInDeutschland,
        auswirkung: inhalt.werte.verschärfteAnforderungenAnDas,
        normativeKonsequenz: inhalt.werte.din4227SpannbetonAnforderungen
      },
      {
        bereich: inhalt.werte.wiederaufbauDenkmalpflege,
        auswirkung: inhalt.werte.wiederaufbauMitModifizierterKonstruktion,
        normativeKonsequenz: inhalt.werte.eröffnungAlsHausDer
      }
    ],
    lessonsLearned: [
      inhalt.werte.spanngliederMüssenVollständigVerpresst,
      inhalt.werte.kombinierteTragwerkeHängedachBiegesteife,
      inhalt.werte.zwangAnÜbergängenZwischen
    ],
    quellenlage: inhalt.werte.gutachten1980NichtFrei,
    typischeBauschaedenLink: {
      subTab: 'korrosion',
      label: inhalt.werte.korrosionBetonschäden2,
      description: inhalt.werte.passivierungDepassivierungUndKorrosion
    },
    sources: [
      {
        title: inhalt.werte.gutachtenÜberDieUrsachen,
        institutionOrAuthor: inhalt.werte.gutachterUAProf,
        details: inhalt.werte.gutachten1980LinkÜbersichtsartikel,
        url: 'https://de.wikipedia.org/wiki/Haus_der_Kulturen_der_Welt'
      },
      {
        title: inhalt.werte.versagenVonBauwerkenBand,
        institutionOrAuthor: inhalt.werte.scheerJErnstSohn,
        details: inhalt.werte.fallsammlungMitDarstellungDer
      }
    ]
  },
  {
    id: 'sankt_marx_wien',
    name: inhalt.werte.einsturzDerReichsbrückeWien,
    subTitle: inhalt.werte.schlagartigerEinsturzDesHauptstromfeldes,
    category: 'bruecken',
    year: '1976',
    location: inhalt.werte.wienÖsterreich,
    structureType: inhalt.werte.kettenbrückeInSichVerankerte,
    keyMaterialMechanism: inhalt.werte.fortschreitendeZerrüttungDesUnbewehrten,
    summary: inhalt.werte.amSonntagmorgenDes1,
    projectData: {
      baujahr: '1934–1937',
      schadensdatum: inhalt.werte.t01August1976Zwischen,
      ort: inhalt.werte.wienDonauÜberquerung,
      tragwerkstyp: inhalt.werte.kettenbrückeMitAnDen,
      beteiligteBaustoffe: [inhalt.werte.stampfbetonImPfeilerkern, 'Granit-Verblendmauerwerk', inhalt.werte.hochfesterBaustahl],
      spannweiteAbmessungen: inhalt.werte.hauptspannweite2412M,
      opferZahlen: inhalt.werte.t1Todesopfer,
      gesamtschaden: inhalt.werte.verlustDerWichtigstenDonau
    },
    historie: [
      {
        phase: inhalt.werte.t1BauInWirtschaftlicher,
        zeitraum: '1934–1937',
        details: inhalt.werte.errichtungDerBrückeWährend
      },
      {
        phase: inhalt.werte.t2KriegseinwirkungenÜberflutungen1945,
        zeitraum: '1945–1975',
        details: inhalt.werte.t1945EntgingDieBrücke
      },
      {
        phase: inhalt.werte.t3VersagenDesStrompfeilers,
        zeitraum: '01.08.1976',
        details: inhalt.werte.derPfeilerUnterDem
      }
    ],
    ursachen: [
      {
        titel: inhalt.werte.zerrüttungDesPfeilersockelsUnd,
        kategorie: 'Material/Werkstoff',
        beschreibung: inhalt.werte.unbewehrterBetonsockelUmhülltVon
      },
      {
        titel: inhalt.werte.täuschungDurchIntakteNaturstein,
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: inhalt.werte.vonAußenWirkteDer
      },
      {
        titel: inhalt.werte.ungünstigeKonstruktiveRandbedingungen,
        kategorie: 'Planung/Statik',
        beschreibung: inhalt.werte.schlankePfeilerMitKleiner
      }
    ],
    folgen: [
      {
        bereich: inhalt.werte.österreichischesEuropäischesBrückenprüfw,
        auswirkung: inhalt.werte.einführungSystematischerUntersuchungenVo,
        normativeKonsequenz: inhalt.werte.rvs130311
      },
      {
        bereich: inhalt.werte.stadtentwicklungWien,
        auswirkung: inhalt.werte.planungUndBauDer,
        normativeKonsequenz: inhalt.werte.neubauMitUBahn
      }
    ],
    lessonsLearned: [
      inhalt.werte.verblendeteBauteileZB,
      inhalt.werte.minderwertigerUnbewehrterFüllbetonIn,
      inhalt.werte.wasserzutrittInPfeilerkerneMuss
    ],
    quellenlage: inhalt.werte.berichtDerUntersuchungskommission1976,
    typischeBauschaedenLink: {
      subTab: 'tief_ingenieurbau',
      label: inhalt.werte.tiefIngenieurbau,
      description: inhalt.werte.pfeilerkerneGründungsUndSubstruktionssch
    },
    sources: [
      {
        title: inhalt.werte.berichtDerSachverständigenkommissionZur,
        institutionOrAuthor: inhalt.werte.magistratDerStadtWien,
        details: inhalt.werte.untersuchungsberichtDerKommissionLink,
        url: 'https://de.wikipedia.org/wiki/Reichsbr%C3%BCcke'
      },
      {
        title: inhalt.werte.richtlinienUndVorschriftenFür,
        institutionOrAuthor: inhalt.werte.österreichischeForschungsgesellschaftStr,
        details: inhalt.werte.regelwerkZurSystematischenBauwerksprüfun,
        url: 'https://www.fsv.at/'
      }
    ]
  },
  {
    id: 'akr_bahnschwellen_garmisch',
    name: inhalt.werte.alkaliKieselsäureReaktionAkr,
    subTitle: inhalt.werte.betonkrebsDurchAlkalireaktiveGesteinskör,
    category: 'infrastruktur',
    year: '2022',
    location: inhalt.werte.burgrainBeiGarmischPartenkirchen,
    structureType: inhalt.werte.spannbetonGleisschwellenB70Schwellen,
    keyMaterialMechanism: inhalt.werte.alkaliKieselsäureReaktionAkr2,
    summary: inhalt.werte.am3Juni2022,
    projectData: {
      baujahr: inhalt.werte.herstellungDerSchwellen2006,
      schadensdatum: inhalt.werte.t03Juni202212,
      ort: inhalt.werte.burgrainBeiGarmischPartenkirchen2,
      tragwerkstyp: inhalt.werte.spannbetonschwellenTypB70,
      beteiligteBaustoffe: [inhalt.werte.portlandzementMitHohemWirksamen, inhalt.werte.alkalireaktiveKieselsäureGesteinskörnung, inhalt.werte.spannstahlSt15701770],
      spannweiteAbmessungen: inhalt.werte.schwellenlänge260M,
      opferZahlen: inhalt.werte.t5Todesopfer16Schwer,
      gesamtschaden: inhalt.werte.hunderteMillionenEuroFür
    },
    historie: [
      {
        phase: inhalt.werte.t1ProduktionZulassungDer,
        zeitraum: '2000–2007',
        details: inhalt.werte.fürDieAutomatisierteFertigung
      },
      {
        phase: inhalt.werte.t2InkubationszeitGelGenese,
        zeitraum: '2007–2021',
        details: inhalt.werte.dieSchwellenLagenIm
      },
      {
        phase: inhalt.werte.t3SchwellenversagenAusreißkräfte2021,
        zeitraum: '2021–2022',
        details: inhalt.werte.derQuelldruckÜberschrittDie
      },
      {
        phase: inhalt.werte.t4EntgleisungBurgrain03,
        zeitraum: '03.06.2022',
        details: inhalt.werte.derZugEntgleisteIn
      }
    ],
    ursachen: [
      {
        titel: inhalt.werte.alkaliKieselsäureReaktionAkr3,
        kategorie: 'Material/Werkstoff',
        beschreibung: inhalt.werte.reaktionDerAlkalihydroxideNa,
        formelOrMechanismus: '\\equiv\\!\\text{Si}-\\text{O}-\\text{Si}\\!\\equiv + 2\\text{OH}^- \\rightarrow 2[\\equiv\\!\\text{Si}-\\text{O}]^- + \\text{H}_2\\text{O} \\xrightarrow{+ \\text{Na}^+/\\text{K}^+} \\text{Expansives Quellgel}'
      },
      {
        titel: inhalt.werte.überlagerungVonVorspannungUnd,
        kategorie: 'Planung/Statik',
        beschreibung: inhalt.werte.dieInLängsrichtungWirkende,
        formelOrMechanismus: 'p_{\\text{Quellung}} > f_{ctm} \\implies \\text{Längsspaltung entlang der Spanndrahtebene}'
      },
      {
        titel: inhalt.werte.fehlendeFrüherkennungBeiRoutine,
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: inhalt.werte.messzügeErfassenVorrangigGeometriedaten
      },
      {
        titel: inhalt.werte.sekundäreEttringitbildungSeb,
        kategorie: 'Material/Werkstoff',
        beschreibung: inhalt.werte.nebenDerAkrIdentifizierte
      }
    ],
    folgen: [
      {
        bereich: inhalt.werte.bundesweitesNotprogrammDeutscheBahn,
        auswirkung: inhalt.werte.bundesweitePrüfungVonBetonschwellen,
        normativeKonsequenz: inhalt.werte.austauschprogrammDerDbInfrago
      },
      {
        bereich: inhalt.werte.regelwerkeNormungBetontechnologie,
        auswirkung: inhalt.werte.dieDafstbAlkaliRichtlinie,
        normativeKonsequenz: inhalt.werte.dafstbRichtlinieVorbeugendeMaßnahmen
      },
      {
        bereich: inhalt.werte.zfpInspektionstechnik,
        auswirkung: inhalt.werte.dieSchädenWarenVon,
        normativeKonsequenz: inhalt.werte.anpassungDerInspektionspraxisIm
      }
    ],
    lessonsLearned: [
      inhalt.werte.treibendeReaktionenAkrSeb,
      inhalt.werte.fürHochdynamischBeanspruchteBetonbauteil,
      inhalt.werte.verdeckteRisseImSchotterbett
    ],
    quellenlage: inhalt.werte.zwischenberichteDerBeu2023,
    typischeBauschaedenLink: {
      subTab: 'korrosion',
      label: inhalt.werte.korrosionBetonkrebsAkr,
      description: inhalt.werte.alkaliKieselsäureReaktionKieselsäure
    },
    sources: [
      {
        title: inhalt.werte.untersuchungsberichtZurZugentgleisungBei,
        institutionOrAuthor: inhalt.werte.bundesstelleFürEisenbahnunfalluntersuchu,
        details: inhalt.werte.zwischenberichteVersion10,
        url: 'https://de.wikipedia.org/wiki/Eisenbahnunfall_von_Burgrain'
      },
      {
        title: inhalt.werte.dafstbRichtlinieVorbeugendeMaßnahmen2,
        institutionOrAuthor: inhalt.werte.deutscherAusschussFürStahlbeton,
        details: inhalt.werte.klassifizierungDerFeuchteklassenWo,
        url: 'https://www.dafstb.de/'
      }
    ]
  },
  {
    id: 'hyatt_regency_walkway',
    name: inhalt.werte.einsturzDerHyattRegency,
    subTitle: inhalt.werte.schubversagenVonAufhängungsbolzenNach,
    category: 'hochbau',
    year: '1981',
    location: inhalt.werte.kansasCityMissouriUsa,
    structureType: inhalt.werte.abgehängteFußgängerbrückenStegeIm,
    keyMaterialMechanism: inhalt.werte.querzugscherungUndDurchstanzversagenDer,
    summary: inhalt.werte.am17Juli1981,
    projectData: {
      baujahr: '1978–1980',
      schadensdatum: inhalt.werte.t17Juli1981Ca,
      ort: inhalt.werte.kansasCityMissouriUsa2,
      tragwerkstyp: inhalt.werte.schwebendeStahlstegeLängeCa,
      beteiligteBaustoffe: [inhalt.werte.baustahlAstmA36, inhalt.werte.kastenträgerAusZweiVerschweißten, inhalt.werte.hochfesteStahlGewindestangen],
      spannweiteAbmessungen: inhalt.werte.spannweite365M,
      opferZahlen: inhalt.werte.t114TodesopferÜber180,
      gesamtschaden: inhalt.werte.einesDerTeuerstenSchadensereignisse
    },
    historie: [
      {
        phase: inhalt.werte.t1UrsprünglichePlanungDes,
        zeitraum: '1978',
        details: inhalt.werte.derUrsprünglicheEntwurfSah
      },
      {
        phase: inhalt.werte.t2VerhängnisvolleWerkstattänderung1979,
        zeitraum: '1979',
        details: inhalt.werte.derStahlbaufertigerHavensSteel
      },
      {
        phase: inhalt.werte.t3VerdopplungDerBelastung,
        zeitraum: '1980–1981',
        details: inhalt.werte.durchDieKopplungMusste
      },
      {
        phase: inhalt.werte.t4DurchstanzversagenBeimTeetanz,
        zeitraum: '17.07.1981',
        details: inhalt.werte.rund1600Menschen
      }
    ],
    ursachen: [
      {
        titel: inhalt.werte.detailänderungVerdoppeltLokaleAuflagerla,
        kategorie: 'Planung/Statik',
        beschreibung: inhalt.werte.imOriginalentwurfTrugDie,
        formelOrMechanismus: 'P_{\\text{original}} = P_4 \\quad \\longrightarrow \\quad P_{\\text{ausgeführt}} = P_4 + P_2 \\approx 2 \\cdot P_4'
      },
      {
        titel: inhalt.werte.querzugscherungUndFlanschdurchstanzen,
        kategorie: 'Material/Werkstoff',
        beschreibung: inhalt.werte.derKastenträgerAusZwei,
        formelOrMechanismus: '\\tau = \\frac{P_{\\text{komb}}}{A_{\\text{Scher,Flansch}}} > f_u \\quad \\text{(Stanzscherversagen)}'
      },
      {
        titel: inhalt.werte.verletzungVonPrüfUnd,
        kategorie: 'Ausführung',
        beschreibung: inhalt.werte.dieWerkstattzeichnungWurdeWeder
      }
    ],
    folgen: [
      {
        bereich: inhalt.werte.berufsethikIngenieurverantwortung,
        auswirkung: inhalt.werte.entzugDerBerufszulassungFür,
        normativeKonsequenz: inhalt.werte.asceCodeOfEthics
      },
      {
        bereich: 'Stahlbau-Bemessungsrichtlinien',
        auswirkung: inhalt.werte.verpflichtendeStatischePrüfungUnd,
        normativeKonsequenz: inhalt.werte.aiscSteelConstructionManual
      }
    ],
    lessonsLearned: [
      inhalt.werte.scheinbarKleineKonstruktiveFertigungsänd,
      inhalt.werte.punktförmigeKrafteinleitungenInDünnwandi,
      inhalt.werte.vierAugenPrinzipUnd
    ],
    quellenlage: inhalt.werte.amtlicherUntersuchungsberichtNbsBuilding,
    typischeBauschaedenLink: {
      subTab: 'risse',
      label: inhalt.werte.risseVerformungenKnotenversagen,
      description: inhalt.werte.scherspannungenStanzscherversagenUndÜber
    },
    sources: [
      {
        title: inhalt.werte.investigationOfTheKansas,
        institutionOrAuthor: inhalt.werte.nationalBureauOfStandards2,
        details: inhalt.werte.umfassenderTechnischerUntersuchungsberic
      },
      {
        title: inhalt.werte.aiscCodeOfStandard,
        institutionOrAuthor: inhalt.werte.americanInstituteOfSteel,
        details: inhalt.werte.festlegungDerVerantwortlichkeitenZwische,
        url: 'https://www.aisc.org/'
      },
      {
        title: inhalt.werte.ethicsInEngineeringThe,
        institutionOrAuthor: inhalt.werte.americanSocietyOfCivil,
        details: inhalt.werte.grundlegendeFallstudieZurBerufsethik
      }
    ]
  },
  {
    id: 'stava_dammbruch',
    name: inhalt.werte.katastropheVonStavaBruch,
    subTitle: inhalt.werte.verflüssigungVonSchlämmenUnd,
    category: 'infrastruktur',
    year: '1985',
    location: inhalt.werte.stavaGemeindeTeseroFleimstal,
    structureType: inhalt.werte.aufgespülteAbsetzbeckenDämmeFür,
    keyMaterialMechanism: inhalt.werte.bodenmechanischeScherverflüssigungStatic,
    summary: inhalt.werte.am19Juli1985,
    projectData: {
      baujahr: inhalt.werte.t1961UnteresBecken1969,
      schadensdatum: inhalt.werte.t19Juli1985Ca,
      ort: inhalt.werte.stavaBeiTeseroTrentino,
      tragwerkstyp: inhalt.werte.upstreamTailingsDämmeHöhe,
      beteiligteBaustoffe: [inhalt.werte.fluoritFlotationsbergeSchluffUnd, 'Porenwasser', inhalt.werte.drainagerohreGebrochen],
      spannweiteAbmessungen: inhalt.werte.dammhöheKombiniertCa34,
      opferZahlen: inhalt.werte.t268TodesopferHunderteZerstörte,
      gesamtschaden: inhalt.werte.vollständigeAuslöschungZweierTalsiedlung
    },
    historie: [
      {
        phase: inhalt.werte.t1ImprovisierterDammaufbau1961,
        zeitraum: '1961–1975',
        details: inhalt.werte.dämmeWurdenImSogenannten
      },
      {
        phase: inhalt.werte.t2DrainagekollapsEinstau1980,
        zeitraum: '1980–1985',
        details: inhalt.werte.dieInnerenAbflussUnd
      },
      {
        phase: inhalt.werte.t3BruchDesOberen,
        zeitraum: inhalt.werte.t1907198512,
        details: inhalt.werte.infolgeDesExtremHohen
      }
    ],
    ursachen: [
      {
        titel: inhalt.werte.spontaneScherverflüssigungStaticLiquefac,
        kategorie: 'Material/Werkstoff',
        beschreibung: inhalt.werte.wassergesättigteLockerGelagerteSchluff,
        formelOrMechanismus: '\\tau_f = c\' + (\\sigma - u) \\cdot \\tan\\varphi\' \\xrightarrow{u \\rightarrow \\sigma} \\tau_f \\approx 0'
      },
      {
        titel: inhalt.werte.unzulässigeDammneigungUpstreamSchüttung,
        kategorie: 'Planung/Statik',
        beschreibung: inhalt.werte.aufbauEinesDammesAuf
      },
      {
        titel: inhalt.werte.mangelndesPorenwasserdruckMonitoring,
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: inhalt.werte.esGabKeinePiezometer
      }
    ],
    folgen: [
      {
        bereich: inhalt.werte.internationaleTalsperrenUndTailings,
        auswirkung: inhalt.werte.weltweiteNeubewertungVonTailings,
        normativeKonsequenz: inhalt.werte.icoldGuidelinesOnTailings
      },
      {
        bereich: inhalt.werte.bodenmechanikGeotechnik,
        auswirkung: inhalt.werte.forschungsschwerpunktZuZyklischerUnd,
        normativeKonsequenz: inhalt.werte.fürAbsetzbeckenMaßgeblichBergrecht
      }
    ],
    lessonsLearned: [
      inhalt.werte.wassergesättigteSchluffeUndFlotationsber,
      inhalt.werte.dasUpstreamVerfahrenFür,
      inhalt.werte.entwässerungsleitungenInErdbauwerkenMüss
    ],
    quellenlage: inhalt.werte.gerichtsverfahrenInItalien10,
    typischeBauschaedenLink: {
      subTab: 'tief_ingenieurbau',
      label: inhalt.werte.tiefIngenieurbauGeotechnik,
      description: inhalt.werte.porenwasserdruckScherfestigkeitNachMohr
    },
    sources: [
      {
        title: inhalt.werte.theStavaTailingsDams,
        institutionOrAuthor: inhalt.werte.fondazioneStava1985Onlus,
        details: inhalt.werte.offizielleDokumentationUndGeotechnische,
        url: 'https://www.stava1985.it/'
      },
      {
        title: inhalt.werte.staticLiquefactionOfFine,
        institutionOrAuthor: inhalt.werte.internationalCommissionOnLarge,
        details: inhalt.werte.bulletin121TailingsDams,
        url: 'https://www.icold-cigb.org/'
      },
      {
        title: inhalt.werte.bodenmechanischeSchadensmechanismenImErd,
        institutionOrAuthor: inhalt.werte.deutscheGesellschaftFürGeotechnik,
        details: inhalt.werte.fachpublikationZurVerflüssigungUnd
      }
    ]
  },
  {
    id: 'schiersteiner_bruecke',
    name: inhalt.werte.havarieDerSchiersteinerBrücke,
    subTitle: inhalt.werte.pfeilerschiefstellungDerVorlandbrückeMom,
    category: 'bruecken',
    year: '2015',
    location: inhalt.werte.wiesbadenMainzRheinlandPfalz,
    structureType: inhalt.werte.vorlandbrückeMombachStahlbetonPlattenbal,
    keyMaterialMechanism: inhalt.werte.auflockerungDesBaugrundsDurch,
    summary: inhalt.werte.am10Februar2015,
    projectData: {
      baujahr: '1959–1962',
      schadensdatum: inhalt.werte.t1011Februar2015,
      ort: inhalt.werte.wiesbadenSchiersteinMainzMombach,
      tragwerkstyp: inhalt.werte.vorlandbrückeAlsStahlbetonPlattenbalken,
      beteiligteBaustoffe: [inhalt.werte.stahlbetonÜberbauUndStützen, inhalt.werte.rheinsedimenteSandKies, inhalt.werte.gewiPfähleNeubau],
      spannweiteAbmessungen: inhalt.werte.gesamtlängeDerRheinquerungCa,
      opferZahlen: inhalt.werte.keinePersonenschädenSofortigeSperrung,
      gesamtschaden: inhalt.werte.vollsperrungBis1204
    },
    historie: [
      {
        phase: inhalt.werte.t1ErrichtungInDen,
        zeitraum: '1959–1962',
        details: inhalt.werte.errichtungDerRheinquerungMit
      },
      {
        phase: inhalt.werte.t2BauarbeitenFürDen,
        zeitraum: inhalt.werte.februar2015,
        details: inhalt.werte.inDerNäheDes
      },
      {
        phase: inhalt.werte.t3Pfeilerschiefstellung1002,
        zeitraum: '10.02.2015',
        details: inhalt.werte.setzungenUnterDemFundament
      },
      {
        phase: inhalt.werte.t4AnhebenUndEingeschränkte,
        zeitraum: inhalt.werte.februarApril2015,
        details: inhalt.werte.anfangApril2015Wurde
      }
    ],
    ursachen: [
      {
        titel: inhalt.werte.baugrundauflockerungDurchNachbararbeiten,
        kategorie: 'Umwelteinfluss',
        beschreibung: inhalt.werte.nachDemGutachtenEntstanden
      },
      {
        titel: inhalt.werte.lückenhafteBestandsstatikGründungsunterl,
        kategorie: 'Planung/Statik',
        beschreibung: inhalt.werte.dieAuswirkungenDerPfahlherstellung
      }
    ],
    folgen: [
      {
        bereich: inhalt.werte.baugrubenNachbarbauwerkeAnBrücken,
        auswirkung: inhalt.werte.empfehlungBeiArbeitenAn,
        normativeKonsequenz: inhalt.werte.dinEn19971
      },
      {
        bereich: 'Infrastruktur-Beschleunigung',
        auswirkung: inhalt.werte.derFallTrugZur,
        normativeKonsequenz: inhalt.werte.brückenmodernisierungsprogrammDesBundes
      }
    ],
    lessonsLearned: [
      inhalt.werte.tiefbauarbeitenNebenBestandsgründungenEr,
      inhalt.werte.sofortigeSperrungBeiAuffälligen,
      inhalt.werte.verkehrsadernMitHoherNetzbedeutung
    ],
    quellenlage: inhalt.werte.gutachtenFürDenLandesbetrieb,
    typischeBauschaedenLink: {
      subTab: 'tief_ingenieurbau',
      label: inhalt.werte.tiefIngenieurbauGründungen,
      description: inhalt.werte.setzungenBaugrubenUndSicherung
    },
    sources: [
      {
        title: inhalt.werte.gutachtenZurUrsacheDer,
        institutionOrAuthor: inhalt.werte.imAuftragDesLandesbetriebs,
        details: inhalt.werte.ergebnisAuflockerungenImBaugrund,
        url: 'https://de.wikipedia.org/wiki/Schiersteiner_Br%C3%BCcke'
      },
      {
        title: inhalt.werte.din4123AusschachtungenGründungen,
        institutionOrAuthor: inhalt.werte.deutschesInstitutFürNormung,
        details: inhalt.werte.normativeVorgabenZurSicherung,
        url: 'https://www.din.de/'
      }
    ]
  }
];
