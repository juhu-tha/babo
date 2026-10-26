import inhalt from '@/content/bauwerksuntersuchung/diagnoseData.json';
// diagnoseData.ts
// Fachspezifische Datenbasis für Bauwerksdiagnostik:
// 1. Notwendige Anzahl Prüfungen / Prüfpunkte & Entnahmestellen (Normative Stichprobenregeln)
// 2. Proben- und Prüfstellenkonditionierung (Vorbereitung, Vorlagerung & Fehlervermeidung)
// 3. Relevante Normen und Regelwerke (mit Monats-/Jahresausgaben und DIN Media Verweisen)
// 4. Interpretation und bautechnische Anwendung der Ergebnisse (Ingenieurpraxis, Statik & Instandsetzung)

export interface StandardReference {
  code: string;
  title: string;
  date: string;
  url?: string;
  scope: string;
}

export interface ThresholdItem {
  parameter: string;
  wert: string;
  einheit: string;
  status: 'ok' | 'warn' | 'crit';
  bewertung: string;
  massnahme: string;
}

export interface MethodDiagnoseInfo {
  id: string;
  samplingPoints: {
    titel: string;
    normVorgabe: string;
    mindestAnzahl: string;
    rasterMass: string;
    auswahlKriterien: string[];
    statistischeBegruendung: string;
  };
  conditioning: {
    titel: string;
    oberflaeche: string;
    klimaUndFeuchte: string;
    vorbereitungLabor: string;
    kritischeFehlerVermeidung: string[];
  };
  standards: StandardReference[];
  interpretation: {
    titel: string;
    kerndiagnose: string;
    grenzwerte: ThresholdItem[];
    tragwerksAuswirkung: string;
    instandsetzungsKonsequenz: string;
    praxisFallbeispiel: string;
  };
}

export const METHOD_DIAGNOSE_DETAILS: Record<string, MethodDiagnoseInfo> = {
  // 1. BOHRWIDERSTAND (HOLZ)
  bohrwiderstand: {
    id: 'bohrwiderstand',
    samplingPoints: {
      titel: inhalt.werte.bohrwiderstandsmessungHolzresistographie,
      normVorgabe: inhalt.werte.verfahrenNichtGenormtBewertung,
      mindestAnzahl: inhalt.werte.mind23Bohrungen,
      rasterMass: inhalt.werte.bohrungsabstandMind3050,
      auswahlKriterien: [
        inhalt.werte.auflagerbereicheInAußenwändenTaupunktunt,
        inhalt.werte.nasszellenunterzügeKüchenUndSanitärberei,
        inhalt.werte.sichtbareFeuchtefleckenPilzfruchtkörperO,
        inhalt.werte.bereicheMaximalerQuerkraftUnd
      ],
      statistischeBegruendung: inhalt.werte.holzIstEinInhomogener
    },
    conditioning: {
      titel: inhalt.werte.probenUndPrüfstellenkonditionierungHolz,
      oberflaeche: inhalt.werte.entfernenVonLosemPutz,
      klimaUndFeuchte: inhalt.werte.holzfeuchteUVorabMittels,
      vorbereitungLabor: inhalt.werte.nichtErforderlichVorOrt,
      kritischeFehlerVermeidung: [
        inhalt.werte.bohrungNichtDurchAstknoten,
        inhalt.werte.nadelbiegungBeiStarkVerhärtetem,
        inhalt.werte.nadelverschleißKontrollierenStumpfeNadel
      ]
    },
    standards: [
      {
        code: inhalt.werte.din6880042020,
        title: inhalt.werte.holzschutzBekämpfendeMaßnahmenBohrwiders,
        date: '2020-12',
        scope: inhalt.werte.bewertungUndBekämpfungVon
      },
      {
        code: inhalt.werte.dinEn3382016,
        title: inhalt.werte.bauholzFürTragendeZwecke,
        date: '2016-07',
        scope: inhalt.werte.zuordnungVonRohdichteBiegefestigkeit
      },
      {
        code: inhalt.werte.din68800420202,
        title: inhalt.werte.holzschutzTeil4Bekämpfende,
        date: '2020-12',
        scope: inhalt.werte.regelwerkFürSchadensbegrenzungUnd
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationStatischeResttragfähigkeit,
      kerndiagnose: inhalt.werte.auswertungDesDrehmomentprofilsZur,
      grenzwerte: [
        { parameter: inhalt.werte.restquerschnittAEffA, wert: '> 85 %', einheit: '%', status: 'ok', bewertung: inhalt.werte.vollTragfähig, massnahme: inhalt.werte.keineStatischeVerstärkungFeuchteursache },
        { parameter: inhalt.werte.restquerschnittAEffA2, wert: '65–85 %', einheit: '%', status: 'warn', bewertung: inhalt.werte.tragfähigkeitEingeschränkt, massnahme: inhalt.werte.statischeNachrechnungGgfSeitliche },
        { parameter: inhalt.werte.restquerschnittAEffA3, wert: '< 65 %', einheit: '%', status: 'crit', bewertung: inhalt.werte.orientierungErheblicherQuerschnittsverlu, massnahme: inhalt.werte.ggfNotabstützungRückschnittUnd }
      ],
      tragwerksAuswirkung: inhalt.werte.dasWiderstandsmomentWB,
      instandsetzungsKonsequenz: inhalt.werte.konstruktiverHolzschutzNachDin,
      praxisFallbeispiel: inhalt.werte.historischeHolzbalkendeckeBj1905
    }
  },

  // 2. COVERMETER (BETONDECKUNG)
  covermeter: {
    id: 'covermeter',
    samplingPoints: {
      titel: inhalt.werte.elektromagnetischeBetondeckungsmessungCo,
      normVorgabe: inhalt.werte.dinEn19921,
      mindestAnzahl: inhalt.werte.mind2030Messwerte,
      rasterMass: inhalt.werte.flächenraster1010Cm,
      auswahlKriterien: [
        inhalt.werte.bauteileMitHoherUmweltbeanspruchung,
        inhalt.werte.stützenkantenBalkenunterseitenUndAuskrag,
        inhalt.werte.zonenMitSichtbarenRostfahnen,
        inhalt.werte.bereicheInDenenSchalungstoleranzen
      ],
      statistischeBegruendung: inhalt.werte.das5QuantilDer
    },
    conditioning: {
      titel: inhalt.werte.prüfstellenkonditionierungStörquelleneli,
      oberflaeche: inhalt.werte.trockeneSaubereBetonoberflächeEntfernen,
      klimaUndFeuchte: inhalt.werte.oberflächentrockenKeineWasserfilmeKönnen,
      vorbereitungLabor: inhalt.werte.nichtErforderlichInSitu,
      kritischeFehlerVermeidung: [
        inhalt.werte.magnetitOderEisenschlackehaltigeGesteins,
        inhalt.werte.mehrlagigeBewehrungOderEnge,
        inhalt.werte.stabdurchmesserDSMuss
      ]
    },
    standards: [
      {
        code: inhalt.werte.dinEn199212,
        title: inhalt.werte.eurocode2BemessungUnd,
        date: '2011-01',
        scope: inhalt.werte.definitionVonCMin
      },
      {
        code: inhalt.werte.dbvMerkblattBetondeckung,
        title: inhalt.werte.betondeckungUndBewehrungDeutscher,
        date: '2015-12',
        url: 'https://www.betonverein.de/',
        scope: inhalt.werte.verbindlicheVorgabenZurStatistischen
      },
      {
        code: inhalt.werte.dgzfpMerkblattB02,
        title: inhalt.werte.zerstörungsfreieOrtungVonBewehrung,
        date: '2014-06',
        url: 'https://www.dgzfp.de/',
        scope: inhalt.werte.praxisleitfadenFürElektromagnetischeUnd
      }
    ],
    interpretation: {
      titel: inhalt.werte.statistischeAuswertung5Quantil,
      kerndiagnose: inhalt.werte.vergleichDes5Quantils,
      grenzwerte: [
        { parameter: inhalt.werte.cAct005, wert: inhalt.werte.cActCMin, einheit: 'mm', status: 'ok', bewertung: inhalt.werte.vollständigerKorrosionsschutz, massnahme: inhalt.werte.standardWartungKeineSondermaßnahmen },
        { parameter: inhalt.werte.cAct0052, wert: inhalt.werte.cMinCAct, einheit: 'mm', status: 'warn', bewertung: inhalt.werte.vorhaltemaßUnterschritten, massnahme: inhalt.werte.engmaschigeÜberwachungHydrophobierendeIm },
        { parameter: inhalt.werte.cAct0053, wert: inhalt.werte.cActCMin2, einheit: 'mm', status: 'crit', bewertung: inhalt.werte.depassivierungsgefahrBrandschutzmangel, massnahme: inhalt.werte.aufbringenVonZusätzlichemBetonersatzmört }
      ],
      tragwerksAuswirkung: inhalt.werte.geringeBetondeckungFührtBei,
      instandsetzungsKonsequenz: inhalt.werte.dibtTrInstandhaltungFehlende,
      praxisFallbeispiel: inhalt.werte.parkhausStützenBj1982
    }
  },

  // 3. SCHMIDT-HAMMER (RÜCKPRALLHAMMER)
  schmidthammer: {
    id: 'schmidthammer',
    samplingPoints: {
      titel: inhalt.werte.rückprallhammerPrüfungNachSchmidt,
      normVorgabe: inhalt.werte.dinEn125042,
      mindestAnzahl: inhalt.werte.mind910Rückprallwerte,
      rasterMass: inhalt.werte.prüfstellenabstandMind25Mm,
      auswahlKriterien: [
        inhalt.werte.homogeneBauteilabschnitteDesselbenBetoni,
        inhalt.werte.prüfstellenNichtNäherAls,
        inhalt.werte.freieZonenOhneHohlstellen
      ],
      statistischeBegruendung: inhalt.werte.derMedianOderMittelwert
    },
    conditioning: {
      titel: inhalt.werte.prüfflächenkonditionierungStoßwinkelKorr,
      oberflaeche: inhalt.werte.entfernenDerKarbonatisiertenZementschläm,
      klimaUndFeuchte: inhalt.werte.prüfflächeMussLufttrockenSein,
      vorbereitungLabor: inhalt.werte.vorUndNachJeder,
      kritischeFehlerVermeidung: [
        inhalt.werte.karbonatisierteOberflächenNichtUngeschli,
        inhalt.werte.stoßrichtungBeachtenBeiAbweichung,
        inhalt.werte.dünneBauteile100Mm
      ]
    },
    standards: [
      {
        code: inhalt.werte.dinEn1250422,
        title: inhalt.werte.prüfungVonBetonIn,
        date: '2021-08',
        scope: inhalt.werte.prüfvorschriftFürRückprallhämmerVom
      },
      {
        code: inhalt.werte.dinEn137912020,
        title: inhalt.werte.bewertungDerDruckfestigkeitVon,
        date: '2020-02',
        scope: inhalt.werte.normativeUmrechnungVonRückprallwerten
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationHomogenitätsanalyseFestigk,
      kerndiagnose: inhalt.werte.primärZurDetektionVon,
      grenzwerte: [
        { parameter: inhalt.werte.rückprallwertRTypN, wert: 'R ≥ 40', einheit: '-', status: 'ok', bewertung: inhalt.werte.sehrHoheOberflächenhärteTyp, massnahme: inhalt.werte.normalerTragwerksbestandteil },
        { parameter: inhalt.werte.rückprallwertRTypN2, wert: '28 ≤ R < 40', einheit: '-', status: 'warn', bewertung: inhalt.werte.mittlereFestigkeitTypC16, massnahme: inhalt.werte.bohrkernKalibrierungZurStatischen },
        { parameter: inhalt.werte.rückprallwertRTypN3, wert: 'R < 28', einheit: '-', status: 'crit', bewertung: inhalt.werte.geringeFestigkeitOderGefügestörung, massnahme: inhalt.werte.verdachtAufFehlmischungFrostschaden }
      ],
      tragwerksAuswirkung: inhalt.werte.berechnungDesInSitu,
      instandsetzungsKonsequenz: inhalt.werte.dientDerRäumlichenEingrenzung,
      praxisFallbeispiel: inhalt.werte.brückenpfeilerNachBrandSchmidt
    }
  },

  // 4. ULTRASCHALL (BETON)
  ultraschall: {
    id: 'ultraschall',
    samplingPoints: {
      titel: inhalt.werte.ultraschallImpulslaufzeitmessungDinEn,
      normVorgabe: inhalt.werte.dinEn125044,
      mindestAnzahl: inhalt.werte.direkteDurchschallungMind3,
      rasterMass: inhalt.werte.raster2020Cm,
      auswahlKriterien: [
        inhalt.werte.zweiseitigZugänglicheBauteileWände,
        inhalt.werte.verdachtAufInnereEntmischungen,
        inhalt.werte.tiefeRisseZurBestimmung,
        inhalt.werte.frostTausalzGeschädigteGefügebereiche
      ],
      statistischeBegruendung: inhalt.werte.dieUltraschallgeschwindigkeitVL
    },
    conditioning: {
      titel: inhalt.werte.kopplungSensoranpressungWegmessung,
      oberflaeche: inhalt.werte.entfernenLoserPartikelEbene,
      klimaUndFeuchte: inhalt.werte.feuchtigkeitErhöhtDieUltraschallgeschwin,
      vorbereitungLabor: inhalt.werte.elektronischeNullpunktKalibrierungDer,
      kritischeFehlerVermeidung: [
        inhalt.werte.parallelZurBewehrungVerlaufende,
        inhalt.werte.unzureichenderAnpressdruckErzeugtPhasenv,
        inhalt.werte.weglängeLMussMillimetergenau
      ]
    },
    standards: [
      {
        code: inhalt.werte.dinEn1250442,
        title: inhalt.werte.prüfungVonBetonIn2,
        date: '2021-08',
        scope: inhalt.werte.verfahrenZurDirektenHalb
      },
      {
        code: inhalt.werte.dgzfpMerkblattB04,
        title: inhalt.werte.ultraschallverfahrenZurZerstörungsfreien,
        date: '2012-05',
        url: 'https://www.dgzfp.de/',
        scope: inhalt.werte.richtlinieZurMessungElastischer
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationVonVL,
      kerndiagnose: inhalt.werte.hoheGeschwindigkeitenIndizierenEin,
      grenzwerte: [
        { parameter: inhalt.werte.schallgeschwindigkeitVL, wert: '> 4.200 m/s', einheit: 'm/s', status: 'ok', bewertung: inhalt.werte.ausgezeichneteGefügequalitätDichtHochfes, massnahme: inhalt.werte.keineMängel },
        { parameter: inhalt.werte.schallgeschwindigkeitVL2, wert: inhalt.werte.t35004200, einheit: 'm/s', status: 'ok', bewertung: inhalt.werte.guterNormalbeton, massnahme: inhalt.werte.regelkonformeFestigkeit },
        { parameter: inhalt.werte.schallgeschwindigkeitVL3, wert: inhalt.werte.t30003500, einheit: 'm/s', status: 'warn', bewertung: inhalt.werte.mäßigeQualitätMikrorisse, massnahme: inhalt.werte.prüfungAufFrostschädenOder },
        { parameter: inhalt.werte.schallgeschwindigkeitVL4, wert: '< 3.000 m/s', einheit: 'm/s', status: 'crit', bewertung: inhalt.werte.starkZerrüttetesGefügeHohlraum, massnahme: inhalt.werte.instandsetzungsbedarfRissinjektionOderBe }
      ],
      tragwerksAuswirkung: inhalt.werte.ermittlungDesDynamischenElastizitätsmodu,
      instandsetzungsKonsequenz: inhalt.werte.dientDerErfolgskontrolleBei,
      praxisFallbeispiel: inhalt.werte.staumauerMitFrostTausalz
    }
  },

  // 5. POTENTIALFELDMESSUNG
  potentialfeld: {
    id: 'potentialfeld',
    samplingPoints: {
      titel: inhalt.werte.elektrochemischePotentialfeldmessungHalb,
      normVorgabe: inhalt.werte.dgzfpMerkblattB03,
      mindestAnzahl: inhalt.werte.flächendeckendesRasterMind50,
      rasterMass: inhalt.werte.rastermaß1515Cm,
      auswahlKriterien: [
        inhalt.werte.horizontaleUndGeneigteFlächen,
        inhalt.werte.stützenfüßeInTiefgaragenSpritzwasserbere,
        inhalt.werte.spritzwasserbereicheAnMeerwasserbauwerke
      ],
      statistischeBegruendung: inhalt.werte.korrosionImStahlbetonBildet
    },
    conditioning: {
      titel: inhalt.werte.vorbefeuchtungBewehrungskontaktÜbergangs,
      oberflaeche: inhalt.werte.entfernenVonIsolierendenBeschichtungen,
      klimaUndFeuchte: inhalt.werte.vorbefeuchtenDerBetonoberflächeMind,
      vorbereitungLabor: inhalt.werte.kalibrierungDerReferenzelektrodeKupfer,
      kritischeFehlerVermeidung: [
        inhalt.werte.elektrischeDurchgängigkeitDesBewehrungsn,
        inhalt.werte.trockenerBetonFührtZu,
        inhalt.werte.sauerstoffmangelBeiDauerwassergesättigte
      ]
    },
    standards: [
      {
        code: inhalt.werte.dgzfpMerkblattB032,
        title: inhalt.werte.merkblattFürElektrochemischePotenzialmes,
        date: '2018-06',
        url: 'https://www.dgzfp.de/',
        scope: inhalt.werte.standardisiertesPrüfUndBewertungsverfahr
      },
      {
        code: inhalt.werte.astmC87615,
        title: inhalt.werte.standardTestMethodFor,
        date: '2015-11',
        url: 'https://www.astm.org/',
        scope: inhalt.werte.internationaleSchwellenwertKlassifikatio
      },
      {
        code: inhalt.werte.dinEnIso12696,
        title: inhalt.werte.kathodischerKorrosionsschutzVonStahl,
        date: '2022-09',
        scope: inhalt.werte.regelwerkFürMessungenVor
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationNachAstmC876,
      kerndiagnose: inhalt.werte.dieAbsolutePotentiallageUnd,
      grenzwerte: [
        { parameter: inhalt.werte.uCseVsCu, wert: '> -200 mV', einheit: 'mV', status: 'ok', bewertung: inhalt.werte.korrosionswahrscheinlichkeit10Passiv, massnahme: inhalt.werte.keineInstandsetzungErforderlich },
        { parameter: inhalt.werte.uCseVsCu2, wert: inhalt.werte.t200Bis350Mv, einheit: 'mV', status: 'warn', bewertung: inhalt.werte.ungewisserÜbergangsbereichKorrosionsbegi, massnahme: inhalt.werte.bohrmehlanalyseAufChloridgehaltAn },
        { parameter: inhalt.werte.uCseVsCu3, wert: '< -350 mV', einheit: 'mV', status: 'crit', bewertung: inhalt.werte.korrosionswahrscheinlichkeit90AktiveKorr, massnahme: inhalt.werte.schadensflächeFreilegenBetonabtragBis },
        { parameter: inhalt.werte.gradientDeltaUDelta, wert: '> 100 mV/m', einheit: 'mV/m', status: 'crit', bewertung: inhalt.werte.scharferMakroelementKorrosionsherd, massnahme: inhalt.werte.akuteLochfraßgefahrSofortigeInstandsetzu }
      ],
      tragwerksAuswirkung: inhalt.werte.chloridinduzierteLochfraßkorrosionKannBi,
      instandsetzungsKonsequenz: inhalt.werte.ermöglichtEineZentimetergenaueKartierung,
      praxisFallbeispiel: inhalt.werte.tiefgaragendeckeBj19901
    }
  },

  // 6. BOHRMEHLANALYSE (CHLORIDE)
  bohrmehl: {
    id: 'bohrmehl',
    samplingPoints: {
      titel: inhalt.werte.tiefengestaffelteBohrmehlanalyseDinEn,
      normVorgabe: inhalt.werte.dinEn14629Dbv,
      mindestAnzahl: inhalt.werte.mind35Entnahmestellen,
      rasterMass: inhalt.werte.tiefenstufung05Mm,
      auswahlKriterien: [
        inhalt.werte.stellenMitExtremNegativen,
        inhalt.werte.tiefeRisseUndArbeitsfugen,
        inhalt.werte.stützenUndWandfüßeTausalz,
        inhalt.werte.ungeschädigteReferenzstelleZurErmittlung
      ],
      statistischeBegruendung: inhalt.werte.dasDiffusionsprofilNachFick
    },
    conditioning: {
      titel: inhalt.werte.trockenbohrungAbsaugungLaborsäureaufschl,
      oberflaeche: inhalt.werte.entfernenVonLosemSchmutz,
      klimaUndFeuchte: inhalt.werte.ausschließlichTrockenbohrenMitSchlagbohr,
      vorbereitungLabor: inhalt.werte.trocknungDesBohrmehlsBei,
      kritischeFehlerVermeidung: [
        inhalt.werte.vermischungDerTiefenstufenZwingend,
        inhalt.werte.bohrerNichtAnBewehrungsstahl,
        inhalt.werte.zementgehaltDesBetonsMuss
      ]
    },
    standards: [
      {
        code: inhalt.werte.dinEn146292007,
        title: inhalt.werte.produkteUndSystemeFür,
        date: '2007-06',
        scope: inhalt.werte.genormtesLaborprüfverfahrenFürSäureaufsc
      },
      {
        code: inhalt.werte.dibtTrInstandhaltung,
        title: inhalt.werte.technischeRegelInstandhaltungVon,
        date: '2020-05',
        url: 'https://www.dibt.de/',
        scope: inhalt.werte.definitionDesKritischenKorrosionsauslöse
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationDiffusionsprofilKorrosions,
      kerndiagnose: inhalt.werte.liegtDerChloridgehaltAn,
      grenzwerte: [
        { parameter: inhalt.werte.chloridAnBewehrungStahlbeton, wert: inhalt.werte.t05MBez, einheit: 'M.-%', status: 'ok', bewertung: inhalt.werte.keineDepassivierung, massnahme: inhalt.werte.präventiverSchutzOberflächenschutzNach },
        { parameter: inhalt.werte.chloridAnBewehrungStahlbeton2, wert: inhalt.werte.t050080, einheit: 'M.-%', status: 'warn', bewertung: inhalt.werte.kritischerSchwellenwertErreichtÜberschri, massnahme: inhalt.werte.chloridabtragOderKksInstallation },
        { parameter: inhalt.werte.chloridAnBewehrungStahlbeton3, wert: '> 0,80 M.-%', einheit: 'M.-%', status: 'crit', bewertung: inhalt.werte.hohesLochfraßQuerschnittsverlustrisiko, massnahme: inhalt.werte.instandsetzungsprinzipNachTrInstandhaltu },
        { parameter: inhalt.werte.chloridAnSpannstahlSpannbeton, wert: inhalt.werte.deutlichNiedrigerAlsBei, einheit: 'M.-%', status: 'crit', bewertung: inhalt.werte.gefahrVonSpannungsrisskorrosion, massnahme: inhalt.werte.sofortigeStatischeÜberprüfungSpanngliede }
      ],
      tragwerksAuswirkung: inhalt.werte.imGegensatzZuKarbonatisierungskorrosion,
      instandsetzungsKonsequenz: inhalt.werte.trInstandhaltungDibtPrinzip,
      praxisFallbeispiel: inhalt.werte.rampenbauwerkParkhausBohrmehlanalyseZeig
    }
  },

  // 7. KARBONATISIERUNG (PHENOLPHTHALEIN)
  karbonatisierung: {
    id: 'karbonatisierung',
    samplingPoints: {
      titel: inhalt.werte.karbonatisierungsTiefenmessungDinEn,
      normVorgabe: inhalt.werte.dinEn14630Din,
      mindestAnzahl: inhalt.werte.mind35Prüfstellen,
      rasterMass: inhalt.werte.messstellenÜberBauteilhöheVerteilt,
      auswahlKriterien: [
        inhalt.werte.außenbauteileUnterAtmosphärischerEinwirk,
        inhalt.werte.bauteileMitGeringerPlanmäßiger,
        inhalt.werte.oberflächenMitBeginnendenLängsrissen
      ],
      statistischeBegruendung: inhalt.werte.dieKarbonatisierungsfrontVerläuftWellenf
    },
    conditioning: {
      titel: inhalt.werte.bruchstellenherstellungIndikatoranwendun,
      oberflaeche: inhalt.werte.ausschließlichFrischHergestellteBruchflä,
      klimaUndFeuchte: inhalt.werte.prüfflächeSofortMitSauberer,
      vorbereitungLabor: inhalt.werte.herstellungDerIndikatorlösung1,
      kritischeFehlerVermeidung: [
        inhalt.werte.ablesungMussInnerhalbVon,
        inhalt.werte.gesteinskörnerNichtMitmessenNur,
        inhalt.werte.feinskalierteRisslupeOderMessschieber
      ]
    },
    standards: [
      {
        code: inhalt.werte.dinEn146302007,
        title: inhalt.werte.produkteUndSystemeFür2,
        date: '2007-01',
        scope: inhalt.werte.verbindlichePrüfvorschriftInGanz
      },
      {
        code: inhalt.werte.dinEn2062021,
        title: inhalt.werte.betonTeil1Festlegung,
        date: '2021-06',
        scope: inhalt.werte.definitionDerExpositionsklassenXc1
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationPassivierungsreserveWurzel,
      kerndiagnose: inhalt.werte.vergleichDerKarbonatisierungstiefeD,
      grenzwerte: [
        { parameter: inhalt.werte.restpassivierungsreserveCDK, wert: '> 15 mm', einheit: 'mm', status: 'ok', bewertung: inhalt.werte.ausreichenderPassivierungsschutzFürJahrz, massnahme: inhalt.werte.keineInstandsetzung },
        { parameter: inhalt.werte.restpassivierungsreserveCDK2, wert: '5–15 mm', einheit: 'mm', status: 'warn', bewertung: inhalt.werte.depassivierungsfrontNähertSichBewehrung, massnahme: inhalt.werte.prognoseMitDK },
        { parameter: inhalt.werte.restpassivierungsreserveCDK3, wert: inhalt.werte.t5MmBzw0, einheit: 'mm', status: 'crit', bewertung: inhalt.werte.bewehrungDepassiviertRostgefahr, massnahme: inhalt.werte.betonersatzOderCarbonatisierungsbremsend }
      ],
      tragwerksAuswirkung: inhalt.werte.depassivierungFührtBeiFeuchter,
      instandsetzungsKonsequenz: inhalt.werte.dibtTrInstandhaltungReprofilierung,
      praxisFallbeispiel: inhalt.werte.wohnanlageBaujahr1974Balkonbrüstungen
    }
  },

  // 8. BOHRKERN (DRUCKFESTIGKEIT)
  bohrkern: {
    id: 'bohrkern',
    samplingPoints: {
      titel: inhalt.werte.zylindrischeBohrkernentnahmeDruckprüfung,
      normVorgabe: inhalt.werte.dinEn125041,
      mindestAnzahl: inhalt.werte.statistischeAuswertungAb8,
      rasterMass: inhalt.werte.gleichmäßigÜberDenPrüfbereich,
      auswahlKriterien: [
        inhalt.werte.statischGeringerBeanspruchteQuerschnitts,
        inhalt.werte.vorabOrtungDerBewehrung,
        inhalt.werte.ausschlussVonBereichenMit
      ],
      statistischeBegruendung: inhalt.werte.dinEn1379120202
    },
    conditioning: {
      titel: inhalt.werte.konditionierungAblängenStirnflächenbearb,
      oberflaeche: inhalt.werte.entnahmeMitDiamantbesetzterKernbohrkrone,
      klimaUndFeuchte: inhalt.werte.lagerungskonditionierungGemDinEn,
      vorbereitungLabor: inhalt.werte.ablängenAufSchlankheitH,
      kritischeFehlerVermeidung: [
        inhalt.werte.querliegendeBewehrungsstäbeImKern,
        inhalt.werte.beschädigteAusgebrocheneKernränderFühren,
        inhalt.werte.belastungsgeschwindigkeitNormgerechtAuf0
      ]
    },
    standards: [
      {
        code: inhalt.werte.dinEn1250412,
        title: inhalt.werte.prüfungVonBetonIn3,
        date: '2019-09',
        scope: inhalt.werte.entnahmeUndProbenaufbereitung
      },
      {
        code: inhalt.werte.dinEn1379120203,
        title: inhalt.werte.bewertungDerDruckfestigkeitVon2,
        date: '2020-02',
        scope: inhalt.werte.bestimmungDerCharakteristischenIn
      },
      {
        code: inhalt.werte.dinEn123903,
        title: inhalt.werte.prüfungVonFestbetonTeil,
        date: '2019-10',
        scope: inhalt.werte.durchführungDerDruckprüfungAuf
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationFCkIs,
      kerndiagnose: inhalt.werte.nachDinEn13791,
      grenzwerte: [
        { parameter: inhalt.werte.fCkIsF, wert: '≥ 0,85', einheit: '-', status: 'ok', bewertung: inhalt.werte.volleTragfähigkeitNachgewiesen, massnahme: inhalt.werte.keineTragfähigkeitsminderung },
        { parameter: inhalt.werte.fCkIsF2, wert: '0,75–0,85', einheit: '-', status: 'warn', bewertung: inhalt.werte.geringeAbweichungVonPlanwerten, massnahme: inhalt.werte.statischeNachrechnungMitTatsächlichem },
        { parameter: inhalt.werte.fCkIsF3, wert: '< 0,75', einheit: '-', status: 'crit', bewertung: inhalt.werte.erheblicheFestigkeitsunterschreitung, massnahme: inhalt.werte.lastbeschränkungOderErtüchtigungMit }
      ],
      tragwerksAuswirkung: inhalt.werte.direkteEingangsgrößeFürDie,
      instandsetzungsKonsequenz: inhalt.werte.belastbareKlärungVonGewährleistungs,
      praxisFallbeispiel: inhalt.werte.umnutzungEinesIndustriegebäudesBj
    }
  },

  // 9. HAFTABZUGSPRÜFUNG
  haftabzug: {
    id: 'haftabzug',
    samplingPoints: {
      titel: inhalt.werte.haftabzugsprüfungAbreißversuchDinEn,
      normVorgabe: inhalt.werte.dinEn1542Ztv,
      mindestAnzahl: inhalt.werte.mind35Prüfstellen2,
      rasterMass: inhalt.werte.prüfstellenabstandMind200Mm,
      auswahlKriterien: [
        inhalt.werte.vorbereiteteUntergründeVorApplikation,
        inhalt.werte.applizierteInstandsetzungssystemeZurAbna,
        inhalt.werte.zonenMitUnterschiedlicherUntergrundvorbe
      ],
      statistischeBegruendung: inhalt.werte.dieAbreißfestigkeitUnterliegtHoher
    },
    conditioning: {
      titel: inhalt.werte.kernbohrungKlebungZuggeschwindigkeit,
      oberflaeche: inhalt.werte.trockeneSaubereStaubUnd,
      klimaUndFeuchte: inhalt.werte.objekttemperaturMind5C,
      vorbereitungLabor: inhalt.werte.ringnutBohrenKernbohrung50,
      kritischeFehlerVermeidung: [
        inhalt.werte.schiefAufgeklebterStempelOder,
        inhalt.werte.bruchImKlebstoffBruchtyp,
        inhalt.werte.laststeigerungsrateMussExakt0
      ]
    },
    standards: [
      {
        code: inhalt.werte.dinEn15421999,
        title: inhalt.werte.produkteUndSystemeFür3,
        date: '1999-07',
        scope: inhalt.werte.genormtePrüfvorschriftFürUntergrund
      },
      {
        code: inhalt.werte.ztvIngTeil3,
        title: inhalt.werte.zusätzlicheTechnischeVertragsbedingungen,
        date: '2021-03',
        url: 'https://www.bast.de/',
        scope: inhalt.werte.erhöhteAnforderungenFürBrücken
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationAbreißfestigkeitBruchbilda,
      kerndiagnose: inhalt.werte.dieBewertungErfolgtImmer,
      grenzwerte: [
        { parameter: inhalt.werte.fCtMeanUntergrund, wert: inhalt.werte.t15NMm, einheit: 'N/mm²', status: 'ok', bewertung: inhalt.werte.tragfähigerUntergrundFürPcc, massnahme: inhalt.werte.freigabeFürReprofilierung },
        { parameter: inhalt.werte.fCtMeanUntergrund2, wert: 'systemabhängig', einheit: 'N/mm²', status: 'ok', bewertung: inhalt.werte.anforderungJeOsSystem, massnahme: inhalt.werte.freigabeNurBeiEinhaltung },
        { parameter: inhalt.werte.fCtMeanUntergrund3, wert: '< 1,5 N/mm²', einheit: 'N/mm²', status: 'crit', bewertung: inhalt.werte.ungenügendeAbreißfestigkeitMürberBeton, massnahme: inhalt.werte.weitererBetonabtragErforderlichZ },
        { parameter: inhalt.werte.bruchbildABVerbundfuge, wert: inhalt.werte.t50Fugenbruch, einheit: '%', status: 'crit', bewertung: inhalt.werte.mangelhafteHaftungDesInstandsetzungsmört, massnahme: inhalt.werte.mangelRückbauDerInstandsetzungsschicht }
      ],
      tragwerksAuswirkung: inhalt.werte.beiSchubUndBiegung,
      instandsetzungsKonsequenz: inhalt.werte.qualitätssicherungsschrittVorJederBeschi,
      praxisFallbeispiel: inhalt.werte.tiefgaragenbodenNachKugelstrahlen5
    }
  },

  // 10. KARSTENSCHES RÖHRCHEN (KAPILLARE WASSERAUFNAHME)
  karsten: {
    id: 'karsten',
    samplingPoints: {
      titel: inhalt.werte.karstenschesPrüfröhrchenRilemIi,
      normVorgabe: inhalt.werte.rilemIi4Din,
      mindestAnzahl: inhalt.werte.mind35Prüfstellen3,
      rasterMass: inhalt.werte.messstellenInSockelzoneFassadenmitte,
      auswahlKriterien: [
        inhalt.werte.fassadenputzeVorUndNach,
        inhalt.werte.historischesZiegelUndNatursteinmauerwerk,
        inhalt.werte.bereicheMitSichtbarenFeuchteflecken
      ],
      statistischeBegruendung: inhalt.werte.fassadenWeisenMikroklimatischeZonen
    },
    conditioning: {
      titel: inhalt.werte.abdichtungPrüfflüssigkeitZeitabstände,
      oberflaeche: inhalt.werte.oberflächeTrockenUndStaubfrei,
      klimaUndFeuchte: inhalt.werte.messungBeiTrockenemWetter,
      vorbereitungLabor: inhalt.werte.befestigungDesPrüfröhrchensMit,
      kritischeFehlerVermeidung: [
        inhalt.werte.undichtigkeitDesKnetringsFührt,
        inhalt.werte.direkteSonneneinstrahlungVermeidenErwärm,
        inhalt.werte.ablesungenInFestenZeitintervallen
      ]
    },
    standards: [
      {
        code: inhalt.werte.dinEn163022013,
        title: inhalt.werte.erhaltungDesKulturellenErbes,
        date: '2013-05',
        scope: inhalt.werte.offizielleEuropäischeNormFür
      },
      {
        code: inhalt.werte.wtaMerkblatt45,
        title: inhalt.werte.beurteilungVonMauerwerkMauerwerksdiagnos,
        date: '2020-04',
        url: 'https://www.wta-international.org/',
        scope: inhalt.werte.richtlinieZurBewertungVon
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationWasseraufnahmekoeffizientW,
      kerndiagnose: inhalt.werte.dieWasseraufnahmeNach60,
      grenzwerte: [
        { parameter: inhalt.werte.wasserverlustNach60Min, wert: '< 0,5 ml', einheit: 'ml', status: 'ok', bewertung: inhalt.werte.wasserabweisendW02, massnahme: inhalt.werte.sehrGuterSchlagregenschutzWirksame },
        { parameter: inhalt.werte.wasserverlustNach60Min2, wert: '0,5–3,0 ml', einheit: 'ml', status: 'warn', bewertung: 'Wasserhemmend', massnahme: inhalt.werte.normaleSchlagregenbeanspruchungTolerierb },
        { parameter: inhalt.werte.wasserverlustNach60Min3, wert: '> 3,0 ml', einheit: 'ml', status: 'crit', bewertung: inhalt.werte.sauggfähigWasserdurchlässig, massnahme: inhalt.werte.gefahrVonDurchfeuchtungUnd }
      ],
      tragwerksAuswirkung: inhalt.werte.ständigeDurchfeuchtungVonMauerwerk,
      instandsetzungsKonsequenz: inhalt.werte.dientDerErfolgskontrolleVon,
      praxisFallbeispiel: inhalt.werte.historischeSchlossfassadeKalksandsteinKa
    }
  },

  // 11. DARR-METHODE (FEUCHTEREFERENZ)
  darrmethode: {
    id: 'darrmethode',
    samplingPoints: {
      titel: inhalt.werte.gravimetrischeDarrMethodeDin,
      normVorgabe: inhalt.werte.dinEnIso12570,
      mindestAnzahl: inhalt.werte.mind3ProbenJe,
      rasterMass: inhalt.werte.tiefengestaffelteEntnahmeZB,
      auswahlKriterien: [
        inhalt.werte.estrichbödenVorBelegungMit,
        inhalt.werte.durchfeuchteteAußenwändeKellerwändeUnd,
        inhalt.werte.kalibrierreferenzFürCmGeräte
      ],
      statistischeBegruendung: inhalt.werte.dieDarrMethodeIst
    },
    conditioning: {
      titel: inhalt.werte.probenentnahmeTransportbehälterTrocknung,
      oberflaeche: inhalt.werte.entnahmeDurchStemmenMeißeln,
      klimaUndFeuchte: inhalt.werte.sofortigesLuftdichtesVerpackenDer,
      vorbereitungLabor: inhalt.werte.einwaageMFeuchtAuf,
      kritischeFehlerVermeidung: [
        inhalt.werte.hochtourigesBohrenErzeugtReibungswärme,
        inhalt.werte.gipshaltigeBaustoffeNiemalsBei,
        inhalt.werte.heißeProbenVorDer
      ]
    },
    standards: [
      {
        code: inhalt.werte.dinEnIso125702,
        title: inhalt.werte.wärmeUndFeuchtetechnischesVerhalten,
        date: '2000-04',
        scope: inhalt.werte.internationalesReferenzverfahrenFürAlle
      },
      {
        code: inhalt.werte.din1856012021,
        title: inhalt.werte.estricheImBauwesenTeil,
        date: '2021-02',
        scope: inhalt.werte.definitionDerBelegreifeGrenzwerte
      },
      {
        code: inhalt.werte.wtaMerkblatt411,
        title: inhalt.werte.messungDerFeuchteVon,
        date: '2016-08',
        url: 'https://www.wta-international.org/',
        scope: inhalt.werte.praxisleitfadenFürVergleichendeFeuchteme
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationMassebezogeneFeuchteU,
      kerndiagnose: inhalt.werte.berechnungDesFeuchtegehaltsU,
      grenzwerte: [
        { parameter: inhalt.werte.zementestrichUnbeheiztCmMethode, wert: '≤ 2,0 CM-%', einheit: 'CM-%', status: 'ok', bewertung: inhalt.werte.belegreifFürAlleBeläge, massnahme: inhalt.werte.freigabeFürBodenbelagsarbeiten },
        { parameter: inhalt.werte.zementestrichBeheiztCmMethode, wert: '≤ 1,8 CM-%', einheit: 'CM-%', status: 'ok', bewertung: inhalt.werte.belegreifBeiFußbodenheizung, massnahme: inhalt.werte.freigabeNachAufheizprotokoll },
        { parameter: inhalt.werte.calciumsulfatestrichCmMethode, wert: inhalt.werte.t05CmBeheizt, einheit: 'CM-%', status: 'ok', bewertung: 'Belegreif', massnahme: 'Freigabe.' },
        { parameter: inhalt.werte.betonVorBeschichtungOs, wert: '> 4,0 M.-%', einheit: 'M.-%', status: 'crit', bewertung: inhalt.werte.überfeuchtetFürDichteEpoxidharze, massnahme: inhalt.werte.osmoseBlasenbildungsgefahrBautrocknungFo }
      ],
      tragwerksAuswirkung: inhalt.werte.hoheBauteilfeuchteBegünstigtSchimmelbild,
      instandsetzungsKonsequenz: inhalt.werte.entscheidungskriteriumFürVertikalUnd,
      praxisFallbeispiel: inhalt.werte.neubauGewerbehalleZementestrichNach
    }
  },

  // 12. GEORADAR (GPR)
  georadar: {
    id: 'georadar',
    samplingPoints: {
      titel: inhalt.werte.georadarMessungGprGround,
      normVorgabe: inhalt.werte.astmD643219Dgzfp,
      mindestAnzahl: inhalt.werte.linienrasterMind510,
      rasterMass: inhalt.werte.raster1010Cm,
      auswahlKriterien: [
        inhalt.werte.ortungVonSpanngliedernHüllrohren,
        inhalt.werte.detektionVonHohlräumenHinter,
        inhalt.werte.dickenbestimmungVonFundamentenUnd,
        inhalt.werte.ortungHistorischerHolzbalkenlagenUnter
      ],
      statistischeBegruendung: inhalt.werte.radargrammeBScansZeigen
    },
    conditioning: {
      titel: inhalt.werte.oberflächenführungAntennenpolarisationKa,
      oberflaeche: inhalt.werte.glatteHindernisfreieOberflächeFür,
      klimaUndFeuchte: inhalt.werte.trockenerBetonBevorzugtNasse,
      vorbereitungLabor: inhalt.werte.ermittlungDerRelativenDielektrizitätskon,
      kritischeFehlerVermeidung: [
        inhalt.werte.dichteObereBewehrungslageMatten,
        inhalt.werte.falschKalibriertesEpsilonR,
        inhalt.werte.metallischeLeitungenErzeugenMehrfachrefl
      ]
    },
    standards: [
      {
        code: inhalt.werte.dgzfpMerkblattB10,
        title: inhalt.werte.georadarImBauwesenGrundlagen,
        date: '2015-11',
        url: 'https://www.dgzfp.de/',
        scope: inhalt.werte.leitfadenFürZerstörungsfreieRadarprüfung
      },
      {
        code: inhalt.werte.astmD643219,
        title: inhalt.werte.standardGuideForUsing,
        date: '2019-06',
        url: 'https://www.astm.org/',
        scope: inhalt.werte.internationaleNormFürGpr
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationRadargrammReflexionenSchic,
      kerndiagnose: inhalt.werte.diePhasenumkehrUndAmplitude,
      grenzwerte: [
        { parameter: inhalt.werte.reflexionshyperbelMetall, wert: inhalt.werte.hoheAmplitudePhasenumkehr, einheit: '-', status: 'ok', bewertung: inhalt.werte.bewehrungsstabSpanngliedGeortet, massnahme: inhalt.werte.lageUndÜberdeckungDokumentieren },
        { parameter: inhalt.werte.signaldämpfungFeuchterBereich, wert: inhalt.werte.starkerAmplitudenabfall, einheit: 'dB', status: 'warn', bewertung: inhalt.werte.wasseransammlungChloridkontamination, massnahme: inhalt.werte.bohrmehlanalyseZurVerifikationVeranlasse },
        { parameter: inhalt.werte.unterbrechungSohlenreflexion, wert: 'Hohlraumhyperbel', einheit: '-', status: 'crit', bewertung: inhalt.werte.ausspülungHohlstelleUnterBauteil, massnahme: inhalt.werte.verfüllungDurchZementsuspensionsInjektio }
      ],
      tragwerksAuswirkung: inhalt.werte.verhindertDasVersehentlicheDurchtrennen,
      instandsetzungsKonsequenz: inhalt.werte.zerstörungsfreieVorerkundungVorStatische,
      praxisFallbeispiel: inhalt.werte.brückenbauwerkVorEinbauNeuer
    }
  },

  // 13. IMPACT-ECHO
  impact_echo: {
    id: 'impact_echo',
    samplingPoints: {
      titel: inhalt.werte.impactEchoVerfahrenResonanzfrequenzanaly,
      normVorgabe: inhalt.werte.astmC138315Dgzfp,
      mindestAnzahl: inhalt.werte.punktmessungenImRaster20,
      rasterMass: inhalt.werte.messpunkteEntlangVermuteterDelaminations,
      auswahlKriterien: [
        inhalt.werte.einseitigZugänglicheMassiveBauteile,
        inhalt.werte.verdachtAufDelaminationenUnter,
        inhalt.werte.prüfungDesVerpresszustandsVon
      ],
      statistischeBegruendung: inhalt.werte.dasFrequenzspektrumFftLiefert
    },
    conditioning: {
      titel: inhalt.werte.schlagimpulsWandlerkontaktRauschunterdrü,
      oberflaeche: inhalt.werte.festeEbeneBetonoberflächeLose,
      klimaUndFeuchte: inhalt.werte.trockeneOberflächeAkustischerKontakt,
      vorbereitungLabor: inhalt.werte.auswahlDesKugelimpulsorsStahlkugeln,
      kritischeFehlerVermeidung: [
        inhalt.werte.zuGroßerImpulsorkugeldurchmesserRegt,
        inhalt.werte.mehrfachanschlagPrellenDesImpulsors,
        inhalt.werte.sensorMussUnmittelbarNeben
      ]
    },
    standards: [
      {
        code: inhalt.werte.astmC138315,
        title: inhalt.werte.standardTestMethodFor2,
        date: '2015-05',
        url: 'https://www.astm.org/',
        scope: inhalt.werte.usUndWeltweiterStandard
      },
      {
        code: inhalt.werte.dgzfpMerkblattB11,
        title: inhalt.werte.dasImpactEchoVerfahren,
        date: '2011-09',
        url: 'https://www.dgzfp.de/',
        scope: inhalt.werte.deutscheAnwendungsrichtlinie
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationFftFrequenzpeaksResonanzdi,
      kerndiagnose: inhalt.werte.einEinzelfrequenzpeakBeiSoll,
      grenzwerte: [
        { parameter: inhalt.werte.resonanzpeakFP, wert: inhalt.werte.fPVP, einheit: 'kHz', status: 'ok', bewertung: inhalt.werte.intaktesBauteilVolleWanddicke, massnahme: inhalt.werte.keineSchäden },
        { parameter: inhalt.werte.höhererFrequenzpeakFP, wert: inhalt.werte.dCalc07, einheit: 'kHz', status: 'crit', bewertung: inhalt.werte.innereDelaminationTrennrissIn, massnahme: inhalt.werte.instandsetzungsbereichMarkierenRissverpr },
        { parameter: inhalt.werte.niedrigeFrequenzenFlexuralMode, wert: 'Plattenschwingung', einheit: 'kHz', status: 'crit', bewertung: inhalt.werte.großflächigeHohlstelleDichtUnter, massnahme: inhalt.werte.hohlstelleAbtragenUndNeu }
      ],
      tragwerksAuswirkung: inhalt.werte.nichtVerpressteSpannkanäleGefährden,
      instandsetzungsKonsequenz: inhalt.werte.auffindenVonUnverpresstenSpanngliedabsch,
      praxisFallbeispiel: inhalt.werte.tunnelinnenschaleDicke40Cm
    }
  },

  // 14. ENDOSKOPIE / VIDEOSKOPIE
  endoskopie: {
    id: 'endoskopie',
    samplingPoints: {
      titel: inhalt.werte.faseroptischeEndoskopieVideoskopieDin,
      normVorgabe: inhalt.werte.din1076WtaMerkblatt,
      mindestAnzahl: inhalt.werte.mind24Bohrungen,
      rasterMass: inhalt.werte.minimalinvasiveZugangsbohrung8Bis,
      auswahlKriterien: [
        inhalt.werte.zweischaligesMauerwerkZustandDer,
        inhalt.werte.holzbalkenköpfeInGeschlossenenDeckenkons,
        inhalt.werte.spannbetonKastenträgerUndNicht,
        inhalt.werte.entwässerungsleitungenUndEinbaukästen
      ],
      statistischeBegruendung: inhalt.werte.ermöglichtDieDirekteVisuelle
    },
    conditioning: {
      titel: inhalt.werte.bohrlochherstellungStaubabsaugungBeleuch,
      oberflaeche: inhalt.werte.saubereBohrungMitScharfem,
      klimaUndFeuchte: inhalt.werte.feuchtigkeitsfilmAufDerEndoskoplinse,
      vorbereitungLabor: inhalt.werte.sondenkalibrierungWeißabgleichDerVideoka,
      kritischeFehlerVermeidung: [
        inhalt.werte.bohrmehlImBohrlochNicht,
        inhalt.werte.knickradienDerFlexiblenGlasfasersonde,
        inhalt.werte.elektrischeLeitungenVorDem
      ]
    },
    standards: [
      {
        code: inhalt.werte.din1076202601,
        title: inhalt.werte.ingenieurbauwerkeImZugeVon,
        date: '2026-01',
        scope: inhalt.werte.prüfvorschriftFürNichtBegehbare
      },
      {
        code: inhalt.werte.wtaMerkblatt29,
        title: inhalt.werte.mauerwerksinstandsetzungSchadensanalyseU,
        date: '2019-03',
        url: 'https://www.wta-international.org/',
        scope: inhalt.werte.zustandserfassungVonZweischaligemMauerwe
      }
    ],
    interpretation: {
      titel: inhalt.werte.interpretationVisuelleSchadensklassifika,
      kerndiagnose: inhalt.werte.qualitativeUndHalbQuantitative,
      grenzwerte: [
        { parameter: inhalt.werte.drahtankerZweischaligesMauerwerk, wert: inhalt.werte.rostfreiVerzinkt, einheit: '-', status: 'ok', bewertung: inhalt.werte.standsicherheitDerVorsatzschaleGegeben, massnahme: inhalt.werte.reguläreÜberwachung },
        { parameter: inhalt.werte.drahtankerZweischaligesMauerwerk2, wert: inhalt.werte.blattrostStarkKorrodiert, einheit: '-', status: 'crit', bewertung: inhalt.werte.verankerungsverlustEinsturzgefahrVorsatz, massnahme: inhalt.werte.nachträglicherEinbauVonEdelstahl },
        { parameter: 'Holzbalkenkopf', wert: inhalt.werte.myzelWeißfäuleSichtbar, einheit: '-', status: 'crit', bewertung: inhalt.werte.aktiverPilzbefallImAuflager, massnahme: inhalt.werte.öffnungDerDeckeSanierung }
      ],
      tragwerksAuswirkung: inhalt.werte.verrosteteDrahtankerFührenBei,
      instandsetzungsKonsequenz: inhalt.werte.gezielteStatischeErtüchtigungMit,
      praxisFallbeispiel: inhalt.werte.schulgebäudeBj1972Mit
    }
  }
};

// -------------------------------------------------------------
// Normative Stichproben- & Planungs-Presets für den interaktiven Planer
// -------------------------------------------------------------
export interface SamplingPreset {
  id: string;
  name: string;
  bauteilTyp: string;
  flaeche: number; // m²
  pruefaufgabe: string;
  empfohleneVerfahren: string[];
  /** nur beim Holz-Preset gepflegt; derzeit nicht angezeigt */
  mindestAnzahlBohrwiderstand?: string;
  mindestUmfang: {
    bohrkerne: number;
    zfpMesspunkte: number;
    bohrmehlStellen: number;
    haftzugStempel: number;
    rasterMass: string;
  };
  normativeBegruendung: string;
  konditionierungsFokus: string;
}

export const SAMPLING_PRESETS: SamplingPreset[] = inhalt.daten.SAMPLING_PRESETS;
