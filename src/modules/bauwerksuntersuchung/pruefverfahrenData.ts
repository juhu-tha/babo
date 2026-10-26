import inhalt from '@/content/bauwerksuntersuchung/pruefverfahrenData.json';
export interface PruefverfahrenDetail {
  id: string;
  name: string;
  shortName: string;
  category: 'zfp' | 'minimalinvasiv' | 'zerstoerend';
  categoryLabel: string;
  badge: string;
  standard: string;
  principle: string;
  formula: string;
  formulaExplanation: string;
  steps: string[];
  pros: string[];
  cons: string[];
  referenceValues: string;
  interactiveType: 'schmidthammer' | 'ultraschall' | 'potentialfeld' | 'covermeter' | 'karsten' | 'bohrmehl' | 'haftabzug' | 'bohrkern' | 'bohrwiderstand' | 'impact_echo' | 'karbonatisierung' | 'darrmethode';
}

export const PRUEFVERFAHREN_LIST: PruefverfahrenDetail[] = [
  // 1. BOHRWIDERSTAND (GOLD STANDARD AUS DEM VORBILD)
  {
    id: 'bohrwiderstand',
    name: inhalt.werte.bohrprofilWiderstandsmessungResistograph,
    shortName: inhalt.werte.bohrwiderstandHolz,
    category: 'minimalinvasiv',
    categoryLabel: inhalt.werte.minimalinvasivesPrüfverfahren,
    badge: 'Nadel-Torque',
    standard: inhalt.werte.nichtGenormtBewertungNach,
    principle: inhalt.werte.mechanischEnergetischeDichteanalyseVon,
    formula: 'M_{\\text{Bohr}}(z) = c_1 \\cdot \\rho_{\\text{local}}(z) \\cdot A_{\\text{Nadel}} + f_{\\text{friction}}(z)',
    formulaExplanation: inhalt.werte.dasGemesseneBohrdrehmomentM,
    steps: [
      inhalt.werte.visuelleVoruntersuchungDesTragenden,
      inhalt.werte.messgerätResistographExaktRechtwinklig,
      inhalt.werte.sicherstellenDassDieFeine,
      inhalt.werte.bohrvorgangStartenAutomatischGeregelter,
      inhalt.werte.echtzeitKurvendiagnoseAufDem,
      inhalt.werte.verschließenDesWinzigenEinstichlochs
    ],
    pros: [
      inhalt.werte.extremGeringerEingriffMinimales,
      inhalt.werte.erfasstDenGesamtenQuerschnitt,
      inhalt.werte.ermöglichtEineQuantitativeAussage
    ],
    cons: [
      inhalt.werte.nadeldriftAnSchrägenÄsten,
      inhalt.werte.mantelreibungNimmtMitZunehmender,
      inhalt.werte.erfordertFundierteHolzartenkenntnisseZur
    ],
    referenceValues: inhalt.werte.gesundesNadelholzFichteKiefer,
    interactiveType: 'bohrwiderstand'
  },

  // 2. COVERMETER / BEWEHRUNGSSUCHGERÄT
  {
    id: 'covermeter',
    name: inhalt.werte.elektromagnetischeBetondeckungsmessungCo,
    shortName: 'Bewehrungssuchgerät',
    category: 'zfp',
    categoryLabel: inhalt.werte.zerstörungsfreiePrüfungZfpNdt,
    badge: 'Wirbelstrom',
    standard: inhalt.werte.dinEn19921,
    principle: inhalt.werte.elektromagnetischeInduktionNachDem,
    formula: 'U_{\\text{ind}}(c) = K_0 \\cdot \\frac{\\emptyset^{a} \\cdot f}{(c + z_0)^b} \\quad \\implies \\quad c = \\left( \\frac{K_0 \\cdot \\emptyset^a \\cdot f}{U_{\\text{ind}}} \\right)^{1/b} - z_0',
    formulaExplanation: inhalt.werte.dieInduzierteSensorspannungU,
    steps: [
      inhalt.werte.betonoberflächeImUntersuchungsbereichVon,
      inhalt.werte.messgerätAbseitsMetallischerEinflüsse,
      inhalt.werte.sensorsondeMäanderförmigOderIm,
      inhalt.werte.peakSignalMaximalerSignalausschlag,
      inhalt.werte.prüfkopfUm90Drehen,
      inhalt.werte.betondeckungswerteCNomIm
    ],
    pros: [
      inhalt.werte.vollkommenZerstörungsfreiBeliebigOft,
      inhalt.werte.extremSchnelleFlächigeKartierung,
      inhalt.werte.ermöglichtVerlässlicheAussagenÜber
    ],
    cons: [
      inhalt.werte.kopplungseffekteBeiEngLiegenden,
      inhalt.werte.magnetischeZuschlägeZB,
      inhalt.werte.physikalischeEindringtiefeIstKonstruktio
    ],
    referenceValues: inhalt.werte.mindestbetondeckungCMinNach,
    interactiveType: 'covermeter'
  },

  // 3. RÜCKPRALLHAMMER (SCHMIDT-HAMMER)
  {
    id: 'schmidthammer',
    name: inhalt.werte.rückprallhammerPrüfungNachSchmidt,
    shortName: 'Rückprallhammer',
    category: 'zfp',
    categoryLabel: inhalt.werte.zerstörungsfreiePrüfungZfpNdt2,
    badge: inhalt.werte.kinetischerImpuls,
    standard: inhalt.werte.dinEn125042,
    principle: inhalt.werte.messungDesElastischenRückpralls,
    formula: 'R = \\frac{s_{\\text{rebound}}}{s_{\\text{max}}} \\cdot 100 \\quad \\implies \\quad f_{c,\\text{is}} = \\alpha \\cdot R^\\beta \\cdot k_{\\text{carb}} \\cdot k_{\\text{angle}}',
    formulaExplanation: inhalt.werte.rIstDieDimensionslose,
    steps: [
      inhalt.werte.messstelleAuswählenEbenerDichter,
      inhalt.werte.oberflächeMitDemBeiliegenden,
      inhalt.werte.gerätSenkrechtZurOberfläche,
      inhalt.werte.schlagbolzenLöstAusTaste,
      inhalt.werte.mindestens9Bis12,
      inhalt.werte.ausreißerEliminierenWerteMit
    ],
    pros: [
      inhalt.werte.sehrRascheUndKostengünstige,
      inhalt.werte.geringsteSpurenAnDer,
      inhalt.werte.hervorragendGeeignetZurAbgrenzung
    ],
    cons: [
      inhalt.werte.erfasstNurEineRandzone,
      inhalt.werte.karbonatisierterRandbetonTäuschtEine,
      inhalt.werte.trefferAufGrobeGesteinskörner
    ],
    referenceValues: inhalt.werte.rückprallwertRTypN,
    interactiveType: 'schmidthammer'
  },

  // 4. ULTRASCHALL-LAUFZEITMESSUNG
  {
    id: 'ultraschall',
    name: inhalt.werte.mehrkanalUltraschallLaufzeitmessungUs,
    shortName: inhalt.werte.ultraschallBeton,
    category: 'zfp',
    categoryLabel: inhalt.werte.zerstörungsfreiePrüfungZfpNdt3,
    badge: inhalt.werte.akustischeWellen,
    standard: inhalt.werte.dinEn125044,
    principle: inhalt.werte.piezoelektrischeImpulslaufzeitmessungVon,
    formula: 'v_p = \\frac{s}{\\Delta t} \\quad \\implies \\quad E_{\\text{dyn}} = \\rho \\cdot v_p^2 \\cdot \\frac{(1 + \\nu)(1 - 2\\nu)}{1 - \\nu}',
    formulaExplanation: inhalt.werte.vPIstDie,
    steps: [
      inhalt.werte.messanordnungFestlegenDirektesVerfahren,
      inhalt.werte.koppelmediumUltraschallgelVaselineOder,
      inhalt.werte.sendeUndEmpfangsköpfeKoaxial,
      inhalt.werte.akustischenImpulsTriggernUnd,
      inhalt.werte.schallgeschwindigkeitVPS,
      inhalt.werte.imRasterprofilSchallgeschwindigkeitsTomo
    ],
    pros: [
      inhalt.werte.zerstörungsfreieDetektionVerborgenerGefü,
      inhalt.werte.direkteQuantitativeBestimmungDes,
      inhalt.werte.inKombinationMitDem
    ],
    cons: [
      inhalt.werte.stahlbewehrungLeitetSchallMit,
      inhalt.werte.oberflächenkopplungIstEmpfindlichGegen,
      inhalt.werte.feuchterBetonWeistHöhere
    ],
    referenceValues: inhalt.werte.schallgeschwindigkeitVPIm,
    interactiveType: 'ultraschall'
  },

  // 5. POTENTIALFELDMESSUNG
  {
    id: 'potentialfeld',
    name: inhalt.werte.elektrochemischePotentialfeldmessungHalb,
    shortName: 'Potentialfeldmessung',
    category: 'zfp',
    categoryLabel: inhalt.werte.zerstörungsfreiePrüfungZfpNdt4,
    badge: inhalt.werte.halbzelleKorrosion,
    standard: inhalt.werte.dgzfpMerkblattB03,
    principle: inhalt.werte.elektrochemischeLokalisierungAktivKorrod,
    formula: 'E_{\\text{cell}} = E_{\\text{Ref}} - E_{\\text{Stahl}} = E^0 - \\frac{R \\cdot T}{z \\cdot F} \\ln\\left( \\frac{a_{\\text{Fe}^{2+}}}{a_{\\text{Fe}}} \\right) - I \\cdot R_{\\Omega}',
    formulaExplanation: inhalt.werte.eCellIstDas,
    steps: [
      inhalt.werte.lokalenBewehrungsanschlussHerstellenAn,
      inhalt.werte.prüfflächeImRasterZ,
      inhalt.werte.betonoberflächeAusreichendVornässenTrink,
      inhalt.werte.referenzelektrodeZBCu,
      inhalt.werte.potentialwertInMvAm,
      inhalt.werte.erstellenEinerFlächigenFarb
    ],
    pros: [
      inhalt.werte.einzigesZerstörungsfreiesVerfahrenZur,
      inhalt.werte.sehrHoheFlächenleistungMit,
      inhalt.werte.ermöglichtGezielteMinimalinvasiveInstand
    ],
    cons: [
      inhalt.werte.erfordertDiePunktuelleFreilegung,
      inhalt.werte.trockenerBetonBlockiertDen,
      inhalt.werte.liefertAusschließlichDieKorrosionswahrsc
    ],
    referenceValues: inhalt.werte.potentialwerteGegenCuCuso,
    interactiveType: 'potentialfeld'
  },

  // 6. GEORADAR (GPR)
  {
    id: 'georadar',
    name: inhalt.werte.georadarGprGroundPenetrating,
    shortName: inhalt.werte.georadarGpr,
    category: 'zfp',
    categoryLabel: inhalt.werte.zerstörungsfreiePrüfungZfpNdt5,
    badge: inhalt.werte.radarwellenBScan,
    standard: inhalt.werte.astmD643219Dgzfp,
    principle: inhalt.werte.elektromagnetischeImpulsreflexionsmessun,
    formula: 'v = \\frac{c_0}{\\sqrt{\\varepsilon_r}} \\quad \\implies \\quad z = v \\cdot \\frac{t}{2} = \\frac{c_0 \\cdot t}{2 \\cdot \\sqrt{\\varepsilon_r}}',
    formulaExplanation: inhalt.werte.vIstDieAusbreitungsgeschwindigkeit,
    steps: [
      inhalt.werte.messbereichRasternUndScanbahnen,
      inhalt.werte.gprAntenneZB,
      inhalt.werte.antenneGleichmäßigMitKontinuierlicher,
      inhalt.werte.echtzeitRadargrammBeobachtenPunktuelle,
      inhalt.werte.permittivitätRKalibrierenZ,
      inhalt.werte.t3dVolumendatensätzeCScans
    ],
    pros: [
      inhalt.werte.extremHoheMessgeschwindigkeitUnd,
      inhalt.werte.decktSpanngliederHüllrohreFußbodenheizun,
      inhalt.werte.hoheRäumlicheAuflösungIm
    ],
    cons: [
      inhalt.werte.starkFeuchterOderSalzkontaminierter,
      inhalt.werte.engmaschigeObereBewehrungslagenSchirmen,
      inhalt.werte.unterscheidungZwischenMetallischenUnd
    ],
    referenceValues: inhalt.werte.relativePermittivitätRLuft,
    interactiveType: 'schmidthammer'
  },

  // 7. IMPACT-ECHO VERFAHREN
  {
    id: 'impact_echo',
    name: inhalt.werte.impactEchoVerfahrenResonanzfrequenzanaly,
    shortName: 'Impact-Echo',
    category: 'zfp',
    categoryLabel: inhalt.werte.zerstörungsfreiePrüfungZfpNdt6,
    badge: inhalt.werte.resonanzDicke,
    standard: inhalt.werte.dgzfpMerkblattB11,
    principle: inhalt.werte.kurzzeitSchallanregungUndSpektralanalyse,
    formula: 'f_{\\text{peak}} = \\frac{\\beta_T \\cdot v_p}{2 \\cdot d} \\quad \\implies \\quad d = \\frac{\\beta_T \\cdot v_p}{2 \\cdot f_{\\text{peak}}}',
    formulaExplanation: inhalt.werte.fPeakIstDie,
    steps: [
      inhalt.werte.messpunktAufEbenerBetonfläche,
      inhalt.werte.piezoelektrischenBreitbandWegaufnehmerNa,
      inhalt.werte.mitDemFederstahlkugelImpaktor,
      inhalt.werte.aufzeichnungDesZeitsignalsDer,
      inhalt.werte.automatischeTransformationInDen,
      inhalt.werte.resonanzpeakFPeakIdentifizieren
    ],
    pros: [
      inhalt.werte.einseitigeZugänglichkeitGenügtVollkommen,
      inhalt.werte.präziseDickenmessungOhneKernbohrung,
      inhalt.werte.unempfindlichGegenüberDichtLiegenden
    ],
    cons: [
      inhalt.werte.erfordertDieGenaueKenntnis,
      inhalt.werte.sehrOberflächennaheDelaminationen3,
      inhalt.werte.schlagenergieUndKugelgrößeMüssen
    ],
    referenceValues: inhalt.werte.plattendickenresonanzFürEine30,
    interactiveType: 'impact_echo'
  },

  // 8. KARBONATISIERUNGS-INDIKATORTEST
  {
    id: 'karbonatisierung',
    name: inhalt.werte.karbonatisierungsTiefenmessungPhenolphth,
    shortName: 'Phenolphthalein-Test',
    category: 'minimalinvasiv',
    categoryLabel: inhalt.werte.minimalinvasivesPrüfverfahren2,
    badge: inhalt.werte.phIndikatorChemie,
    standard: inhalt.werte.dinEn14630Bestimmung,
    principle: inhalt.werte.farbindikatorbasiertePhWertAnalyse,
    formula: '\\text{Ca(OH)}_2 + \\text{CO}_2 \\xrightarrow{} \\text{CaCO}_3 + \\text{H}_2\\text{O} \\quad \\implies \\quad d_k(t) = k_{\\text{carb}} \\cdot \\sqrt{t}',
    formulaExplanation: inhalt.werte.dieKarbonatisierungsreaktionVerbrauchtCa,
    steps: [
      inhalt.werte.messstelleAuswählenUndDurch,
      inhalt.werte.bruchflächeSofortMitÖlfreier,
      inhalt.werte.t1IgeAlkoholischePhenolphthalein,
      inhalt.werte.reaktionszeitVonCa60,
      inhalt.werte.karbonatisierungstiefeDKAls,
      inhalt.werte.mittelwertDKMean
    ],
    pros: [
      inhalt.werte.sehrAnschaulichesKontrastreichesPrüferge,
      inhalt.werte.sehrGeringeMaterialUnd,
      inhalt.werte.ermöglichtÜberDasWurzelsystem
    ],
    cons: [
      inhalt.werte.erfordertZwingendEineMechanische,
      inhalt.werte.verschleppterBohrstaubKannDie,
      inhalt.werte.beiVollständigWassergesättigtemBeton
    ],
    referenceValues: inhalt.werte.sicherheitskriteriumDKMax,
    interactiveType: 'karbonatisierung'
  },

  // 9. BOHRKERNENTNAHME (DRUCKFESTIGKEIT)
  {
    id: 'bohrkern',
    name: inhalt.werte.zylindrischeBohrkernentnahmeDruckprüfung,
    shortName: inhalt.werte.bohrkernDruckfestigkeit,
    category: 'zerstoerend',
    categoryLabel: inhalt.werte.zerstörendesLaborprüfverfahren,
    badge: 'Referenzprüfung',
    standard: inhalt.werte.dinEn125041,
    principle: inhalt.werte.echtesPhysikalischesReferenzprüfverfahre,
    formula: 'f_{c,\\text{is}} = \\frac{F_{\\text{max}}}{A_c} \\quad \\implies \\quad f_{c,\\text{cube150}} = k_{\\text{shape}} \\cdot f_{c,\\text{is}}',
    formulaExplanation: inhalt.werte.fCIsIst,
    steps: [
      inhalt.werte.bewehrungVorabMittelsCovermeter,
      inhalt.werte.bohrlafetteMitDübelankerOder,
      inhalt.werte.wasserkühlungAnschließenUndDiamantbohrkr,
      inhalt.werte.bohrkernAmGrundAbscheren,
      inhalt.werte.imLaborDieStirnflächen,
      inhalt.werte.druckversuchNachDinEn
    ],
    pros: [
      inhalt.werte.anerkanntesReferenzverfahrenFürFestigkei,
      inhalt.werte.liefertUngestörtesProbenmaterialFür,
      inhalt.werte.ermöglichtDieVerbindlicheKalibrierung
    ],
    cons: [
      inhalt.werte.zerstörenderEingriffErfordertStatische,
      inhalt.werte.gefahrVonQuerschnittsfehlernBei,
      inhalt.werte.bewehrungstrefferImBohrkernVerfälschen
    ],
    referenceValues: inhalt.werte.druckfestigkeitsklassenNachDinEn,
    interactiveType: 'bohrkern'
  },

  // 10. BOHRMEHLANALYSE (CHLORIDPROFIL)
  {
    id: 'bohrmehl',
    name: inhalt.werte.tiefengestaffelteBohrmehlanalyseChloridd,
    shortName: inhalt.werte.bohrmehlanalyseChloride,
    category: 'zerstoerend',
    categoryLabel: inhalt.werte.zerstörendesLaborFeldprüfverfahren,
    badge: inhalt.werte.lochfraßTitration,
    standard: inhalt.werte.dinEn14629Chloridgehalt,
    principle: inhalt.werte.quantitativeErfassungDerTiefenverteilung,
    formula: '\\text{Cl}^{-}_{\\text{Gew.-\\% bez. auf Zement}} = \\frac{V_{\\text{AgNO}_3} \\cdot c_{\\text{AgNO}_3} \\cdot M_{\\text{Cl}}}{m_{\\text{Einwaage}} \\cdot f_{\\text{Zement}}} \\cdot 100',
    formulaExplanation: inhalt.werte.vAgno3IstDas,
    steps: [
      inhalt.werte.messpunkteImChloridbelastetenSprüh,
      inhalt.werte.bohrtiefenstufenFestlegenZB,
      inhalt.werte.ersteStufeAbbohrenBohrmehl,
      inhalt.werte.bohrlochVorBeginnDer,
      inhalt.werte.probenFraktionsweiseInGasdichte,
      inhalt.werte.laboranalyseDurchführenSäureaufschlussFi
    ],
    pros: [
      inhalt.werte.einzigeMethodeZurErstellung,
      inhalt.werte.geringeQuerschnittsschwächungKleineBohrl,
      inhalt.werte.ermöglichtDenNachweisOb
    ],
    cons: [
      inhalt.werte.aufwendigeZeitverzögerteNasschemischeLab,
      inhalt.werte.unsauberesAussaugenZwischenDen,
      inhalt.werte.derZementgehaltDesAltbetons
    ],
    referenceValues: inhalt.werte.einNormativerKritischerChloridgehalt,
    interactiveType: 'bohrmehl'
  },

  // 11. HAFTABZUGSPRÜFUNG
  {
    id: 'haftabzug',
    name: inhalt.werte.haftabzugsprüfungAbreißversuch,
    shortName: 'Haftzugprüfung',
    category: 'zerstoerend',
    categoryLabel: inhalt.werte.zerstörendesPrüfverfahren,
    badge: 'Abreißkraft',
    standard: inhalt.werte.dinEn1542Messung,
    principle: inhalt.werte.mechanischePrüfungDerAbreißfestigkeit,
    formula: 'f_{ct} = \\frac{4 \\cdot F_{\\text{break}}}{\\pi \\cdot d^2} \\quad \\implies \\quad f_{ct} = \\frac{F_{\\text{break}}}{A_{\\text{Stempel}}}',
    formulaExplanation: inhalt.werte.fCtIstDie,
    steps: [
      inhalt.werte.prüfflächeReinigenLeichtAnschleifen,
      inhalt.werte.prüfstempel50MmMit,
      inhalt.werte.nachAushärtungDesKlebers,
      inhalt.werte.abreißprüfgerätZugkraftfreiUndZentrisch,
      inhalt.werte.lastStetigUndStoßfrei,
      inhalt.werte.bruchlastFBreakAm
    ],
    pros: [
      inhalt.werte.imRahmenDerQualitätssicherung,
      inhalt.werte.eindeutigeAussageÜberDie,
      inhalt.werte.direkteUnterscheidungZwischenWerkstoffve
    ],
    cons: [
      inhalt.werte.nichtZentrischerSchrägerKraftangriff,
      inhalt.werte.erfordertMehrmaligeBaustellenanfahrtenKl,
      inhalt.werte.zerstörtDieOberflächeLokal
    ],
    referenceValues: inhalt.werte.anforderungenNachTrInstandhaltung,
    interactiveType: 'haftabzug'
  },

  // 12. KARSTENSCHES PRÜFRÖHRCHEN
  {
    id: 'karsten',
    name: inhalt.werte.karstenschesPrüfröhrchenKapillareWassera,
    shortName: inhalt.werte.karstenschesRöhrchen,
    category: 'minimalinvasiv',
    categoryLabel: inhalt.werte.minimalinvasivesPrüfverfahren3,
    badge: inhalt.werte.wasseraufnahmeFassade,
    standard: inhalt.werte.rilemIi4Wta,
    principle: inhalt.werte.messtechnischeErfassungDerKapillaren,
    formula: 'w_{\\text{kap}} = \\frac{\\Delta V \\cdot \\rho_w}{A \\cdot \\sqrt{t}} \\quad \\left[ \\frac{\\text{kg}}{\\text{m}^2 \\cdot \\sqrt{\\text{h}}} \\right]',
    formulaExplanation: inhalt.werte.wKapIstDer,
    steps: [
      inhalt.werte.prüfstelleAnDerFassade,
      inhalt.werte.plastischenKittZB,
      inhalt.werte.prüfröhrchenFestGegenDen,
      inhalt.werte.wasserVorsichtigÜberEine,
      inhalt.werte.stoppuhrStartenUndDen,
      inhalt.werte.messwerteInEinDiagramm
    ],
    pros: [
      inhalt.werte.extremEinfacheZerstörungsfreieUnd,
      inhalt.werte.hervorragendGeeignetZurÜberprüfung,
      inhalt.werte.simuliertRealitätsnahDenWasserandrang
    ],
    cons: [
      inhalt.werte.sehrEmpfindlichGegenUndichtigkeiten,
      inhalt.werte.nichtAnwendbarAufExtrem,
      inhalt.werte.starkAbhängigVonDer
    ],
    referenceValues: inhalt.werte.fassadenBeurteilungNachW,
    interactiveType: 'karsten'
  },

  // 13. FASEROPTISCHE ENDOSKOPIE
  {
    id: 'endoskopie',
    name: inhalt.werte.faseroptischeEndoskopieVideoskopie,
    shortName: inhalt.werte.videoskopieEndoskopie,
    category: 'minimalinvasiv',
    categoryLabel: inhalt.werte.minimalinvasivesPrüfverfahren4,
    badge: inhalt.werte.optikHohlraum,
    standard: inhalt.werte.din1076IngenieurbauwerkePrüfung,
    principle: inhalt.werte.direkteOptischeVisualisierungVerborgener,
    formula: 'B_{\\text{sicht}} = 2 \\cdot d_{\\text{objekt}} \\cdot \\tan\\left( \\frac{\\theta_{\\text{FOV}}}{2} \\right)',
    formulaExplanation: inhalt.werte.bSichtIstDer,
    steps: [
      inhalt.werte.bohrpunktSorgfältigAuswählenAbseits,
      inhalt.werte.kleinstbohrungMitScharfemHartmetallbohre,
      inhalt.werte.bohrstaubVollständigMitEiner,
      inhalt.werte.videoskopSondeVorsichtigEinschieben,
      inhalt.werte.systematischerKameraschwenkRisssucheVerp,
      inhalt.werte.bohrlochMitMineralischemInjektionsmörtel
    ],
    pros: [
      inhalt.werte.bietetEinUnverfälschtesHochauflösendes,
      inhalt.werte.minimalerQuerschnittseingriffBohrlochgrö,
      inhalt.werte.unverzichtbarZurKontrolleVon
    ],
    cons: [
      inhalt.werte.staubigeOderFeuchteHohlräume,
      inhalt.werte.liefertImmerNurPunktuelle,
      inhalt.werte.ausleuchtungstiefeInGroßenHohlräumen
    ],
    referenceValues: inhalt.werte.typischeEinsatzgebieteÜberprüfungDer,
    interactiveType: 'bohrwiderstand'
  },

  // 14. GRAVIMETRISCHE DARR-METHODE
  {
    id: 'darrmethode',
    name: inhalt.werte.gravimetrischeDarrMethodeFeuchtereferenz,
    shortName: inhalt.werte.darrMethodeFeuchte,
    category: 'zerstoerend',
    categoryLabel: inhalt.werte.zerstörendesLaborReferenzverfahren,
    badge: inhalt.werte.referenzFeuchte,
    standard: inhalt.werte.dinEnIso12570,
    principle: inhalt.werte.absolutesPhysikalischesReferenzprüfverfa,
    formula: 'u_{\\text{Masse-\\%}} = \\frac{m_{\\text{feucht}} - m_{\\text{trocken}}}{m_{\\text{trocken}}} \\cdot 100 \\quad [\\text{M.-\\%}]',
    formulaExplanation: inhalt.werte.uMasseIstDer,
    steps: [
      inhalt.werte.probenahmeMindestens50100,
      inhalt.werte.probenstückeSofortInDiffusionsdichte,
      inhalt.werte.imLaborEinwaageDer,
      inhalt.werte.probeImBelüftetenTrockenschrank,
      inhalt.werte.nachDemTrocknenIm,
      inhalt.werte.trockenmasseMTrockenWiegen
    ],
    pros: [
      inhalt.werte.unerlässlichesReferenzverfahrenZurEichun,
      inhalt.werte.bezugsverfahrenAberNichtStörungsfrei,
      inhalt.werte.giltAlsReferenzverfahrenFür
    ],
    cons: [
      inhalt.werte.zerstörendesVerfahrenMitProbenahmeaufwan,
      inhalt.werte.mehrtägigeTrocknungsdauerBisZur,
      inhalt.werte.organischVergüteteBaustoffeZ
    ],
    referenceValues: inhalt.werte.praktischeFeuchtewerteImFestbeton,
    interactiveType: 'darrmethode'
  }
];
