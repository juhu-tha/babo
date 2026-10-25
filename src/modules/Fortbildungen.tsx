import React, { useState, useMemo } from 'react';
import { 
  Award, 
  HelpCircle, 
  CheckCircle, 
  Users, 
  ArrowRight, 
  GraduationCap, 
  Check, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  Zap,
  Hammer
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/fortbildungen/Fortbildungen.json';
import { MdText } from '@/src/components/inhalt/MdText';

// Types representing specialized certifications
type CertificateID = 
  | 'eschein' 
  | 'sivv' 
  | 'skp' 
  | 'kks' 
  | 'duesenfuehrer' 
  | 'trgs519' 
  | 'trgs524' 
  | 'trgs521'
  | 'sfi'
  | 'wood_protection'
  | 'masonry_restoration'
  | 'mold_remediation'
  | 'heritage_energy'
  | 'sigeko'
  | 'crack_injection'
  | 'thermography'
  | 'waterproofing'
  | 'drone_inspection'
  | 'building_damage_expert';

interface Certificate {
  id: CertificateID;
  title: string;
  abbreviation: string;
  authority: string;
  scope: string; // Brief visual summary
  legalBase: string;
  targetGroup: string;
  duration: string;
  validity: string;
  difficulty: 'Hoch' | 'Mittel' | 'Sehr Hoch';
  prerequisites: string[];
  modules: string[];
  relevance: string;
  category: 'beton' | 'schadstoffe' | 'denkmal' | 'bauphysik' | 'baubetrieb';
}

const categories = [
  { id: 'all', name: inhalt.werte.alleBereiche },
  { id: 'beton', name: 'Betontechnologie' },
  { id: 'schadstoffe', name: inhalt.werte.schadstoffeUmwelt },
  { id: 'denkmal', name: inhalt.werte.baubestandDenkmal },
  { id: 'bauphysik', name: inhalt.werte.bauphysikDiagnostik },
  { id: 'baubetrieb', name: inhalt.werte.baubetriebSicherheit },
] as const;

export default function Fortbildungen() {
  const [activeCertId, setActiveCertId] = useState<CertificateID>('eschein');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Path finder states
  const [userBackground, setUserBackground] = useState<string>('');
  const [userGoal, setUserGoal] = useState<string>('');

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const filtered = Object.values(certs).filter(
      (c) => catId === 'all' || c.category === catId
    );
    if (filtered.length > 0) {
      setActiveCertId(filtered[0].id);
    }
  };

  const certs: Record<CertificateID, Certificate> = {
    eschein: {
      id: 'eschein',
      title: inhalt.werte.erweiterteTechnologischeAusbildungIm,
      abbreviation: inhalt.werte.eScheinBetontechnologe,
      authority: inhalt.werte.deutscherBetonUndBautechnik,
      scope: inhalt.werte.nachweisFortgeschrittenerBetontechnologi,
      legalBase: inhalt.werte.din104532023,
      targetGroup: inhalt.werte.architektenPlanerBauingenieureBauleiter,
      duration: inhalt.werte.mehrwöchigerLehrgangMitSchriftlicher,
      validity: inhalt.werte.regelungenZuGültigkeitUnd,
      difficulty: 'Hoch',
      prerequisites: [
        inhalt.werte.bauingenieurArchitekturstudiumDiplomB,
        inhalt.werte.oderAusbildungAlsStaatlich,
        inhalt.werte.oderBauhandwerksmeisterZB,
        inhalt.werte.nachweisÜberGrundlegendeBetontechnologis
      ],
      modules: [
        inhalt.werte.zementGesteinskörnungenBetonzusatzstoffe,
        inhalt.werte.anforderungenAnFrischUnd,
        inhalt.werte.betonmischungsberechnungNachNeuestenDbv,
        inhalt.werte.besondereBetonprüfverfahrenZB,
        inhalt.werte.herstellenVonBetonAuf,
        inhalt.werte.sonderbetoneZBLeichtbeton,
        inhalt.werte.konstruktionsregelnFürSchwindUnd
      ],
      relevance: inhalt.werte.aufBaustellenMitAnspruchsvollen,
      category: 'beton'
    },
    sivv: {
      id: 'sivv',
      title: inhalt.werte.schützenInstandsetzenVerbindenUnd,
      abbreviation: inhalt.werte.sivvScheinKolonneFachkraft,
      authority: inhalt.werte.ausbildungsbeiratSachkundigePlanerUnd,
      scope: inhalt.werte.nachweisDerPraktischenUnd,
      legalBase: inhalt.werte.instandhaltungsRichtlinieDesDafstb,
      targetGroup: inhalt.werte.vorarbeiterPoliereKolonnenführerAnwenden,
      duration: inhalt.werte.lehrgangMitTheoretischerUnd,
      validity: inhalt.werte.regelungenZuGültigkeitUnd2,
      difficulty: 'Mittel',
      prerequisites: [
        inhalt.werte.erfolgreichAbgeschlosseneGewerblichTechn,
        inhalt.werte.mindestens3JahreBerufspraxis,
        inhalt.werte.ausnahmegenehmigungFürQuereinsteigerMit
      ],
      modules: [
        inhalt.werte.grundlagenDesKorrosionsschutzesVon,
        inhalt.werte.untergrundvorbereitungHochdruckwasserstr,
        inhalt.werte.verbindungstechnikenVerpressenUndVerfuge,
        inhalt.werte.korrosionsbeschichtungUndHaftbrückenmört,
        inhalt.werte.instandsetzungsmörtelInHandapplikationPc,
        inhalt.werte.verarbeitungUndAufbringenVon,
        inhalt.werte.faserverstärkteKunststofflamellenCfkLame
      ],
      relevance: inhalt.werte.qualitätssicherungBeiDerBetoninstandsetz,
      category: 'beton'
    },
    skp: {
      id: 'skp',
      title: inhalt.werte.sachkundigerPlanerFürSchutz,
      abbreviation: inhalt.werte.sachkundigerPlanerSkpQp,
      authority: inhalt.werte.ausbildungsbeiratSachkundigePlanerBeim,
      scope: inhalt.werte.höchstePlanerischeZertifizierungsstufeFü,
      legalBase: inhalt.werte.trInstandhaltungDesDeutschen,
      targetGroup: inhalt.werte.freischaffendeUndAngestellteTragwerkspla,
      duration: inhalt.werte.ausbildungslehrgangInMehrerenZeitlichen,
      validity: inhalt.werte.unbefristetWobeiFortbildungspflichtenDer,
      difficulty: 'Sehr Hoch',
      prerequisites: [
        inhalt.werte.abschlussEinesStudiumsDes,
        inhalt.werte.mindestens3JahreNachgewiesene,
        inhalt.werte.eScheinOderVertiefte
      ],
      modules: [
        inhalt.werte.zustandserfassungUndSchadensursachenEing,
        inhalt.werte.zerstörungsfreieDiagnoseverfahrenZB,
        inhalt.werte.erstellenVonHerstellerneutralenSanierung,
        inhalt.werte.tragfähigkeitsprüfungKorrodierterBauteil,
        inhalt.werte.nachträglicheVerstärkungskonzepteCfkVerg,
        inhalt.werte.auswahlGeeigneterBaustoffeZementmörtel,
        inhalt.werte.rechtlicheVerantwortungUndHaftung
      ],
      relevance: inhalt.werte.dieRichtlinienFordernDass,
      category: 'beton'
    },
    kks: {
      id: 'kks',
      title: inhalt.werte.kathodischerKorrosionsschutzImBetonbau,
      abbreviation: inhalt.werte.kksFachkraftSektorBeton,
      authority: inhalt.werte.fkksFachverbandKathodischerKorrosionssch,
      scope: inhalt.werte.spezialausbildungZurPlanungErrichtung,
      legalBase: inhalt.werte.dinEnIso15257,
      targetGroup: inhalt.werte.elektrochemikerWerkstoffwissenschaftlerB,
      duration: inhalt.werte.gestuftNachKompetenzstufenDer,
      validity: inhalt.werte.befristetRezertifizierungNachDen,
      difficulty: 'Sehr Hoch',
      prerequisites: [
        inhalt.werte.ingenieurtechnischeAusbildungOderElektro,
        inhalt.werte.langjährigePraktischeMitarbeitBei,
        inhalt.werte.bestandenesLevelZertifikatDes
      ],
      modules: [
        inhalt.werte.physikalischChemischeUndElektrochemische,
        inhalt.werte.messungUndAuswertungVon,
        inhalt.werte.systemeFremdstromanodenZB,
        inhalt.werte.auslegungVonTransformatorUnd,
        inhalt.werte.störspannungenUndVagabundierendeStröme,
        inhalt.werte.installationInbetriebnahmeMesstechnische
      ],
      relevance: inhalt.werte.kksIsBeiChloridbelasteten,
      category: 'beton'
    },
    duesenfuehrer: {
      id: 'duesenfuehrer',
      title: inhalt.werte.zertifikatFürSpritzbetonDüsenführer,
      abbreviation: inhalt.werte.spritzbetonScheinDüsenführer,
      authority: inhalt.werte.deutscherBetonUndBautechnik2,
      scope: inhalt.werte.qualifikationsnachweisFürDasManuelle,
      legalBase: inhalt.werte.din18551SpritzbetonNationaler,
      targetGroup: inhalt.werte.bauhandwerkerTunnelbauerSpezialtiefbauer,
      duration: inhalt.werte.t5TageKompaktkursTheoretischer,
      validity: inhalt.werte.unbefristetWobeiArbeitsschutzUnterweisun,
      difficulty: 'Mittel',
      prerequisites: [
        inhalt.werte.absolvierteGesellenprüfungImBauhauptgewe,
        inhalt.werte.mindestens1JahrNachgewiesene
      ],
      modules: [
        inhalt.werte.maschinentechnikDerFörderungTrocken,
        inhalt.werte.strömungsmechanikDerFörderleitungUnd,
        inhalt.werte.einflussfaktorenDesRückprallsRebound,
        inhalt.werte.richtigesAuftragenInSchichten,
        inhalt.werte.arbeitsschutzAtemschutzEntstaubungHandha,
        inhalt.werte.sonderspritzbetoneZBStahlfaserverstärkte
      ],
      relevance: inhalt.werte.qualitativUnzureichendGespritzterBeton,
      category: 'beton'
    },
    trgs519: {
      id: 'trgs519',
      title: inhalt.werte.sachkundenachweisFürAsbestAbbruch,
      abbreviation: inhalt.werte.trgs519AsbestSchein,
      authority: inhalt.werte.staatlichesGewerbeaufsichtsamtBezirksreg,
      scope: inhalt.werte.gesetzlichVorgeschriebeneSachkundeZum,
      legalBase: inhalt.werte.gefahrstoffverordnungGefstoffvTechnische,
      targetGroup: inhalt.werte.objektplanerBaustoffprüferDenkmalschütze,
      duration: inhalt.werte.mehrtägigerBehördlichAnerkannterLehrgang,
      validity: inhalt.werte.t6JahreMussVor,
      difficulty: 'Mittel',
      prerequisites: [
        inhalt.werte.keineAkademischenVoraussetzungenMindesta,
        inhalt.werte.fürDieTatsächlicheAusführung
      ],
      modules: [
        inhalt.werte.eigenschaftenVonAsbestsortenChrysotil,
        inhalt.werte.gesetzlicheVorgabenAnzeigeUnd,
        inhalt.werte.messtechnischeRaumluftüberwachungVorUnd,
        inhalt.werte.schutzmaßnahmenBeiArbeitenAn,
        inhalt.werte.errichtungVonUnterdruckbereichenSchleuse,
        inhalt.werte.entsorgungAsbesthaltigerSonderabfälle
      ],
      relevance: inhalt.werte.beimBauenImAltbestand,
      category: 'schadstoffe'
    },
    trgs524: {
      id: 'trgs524',
      title: inhalt.werte.sicherheitUndGesundheitsschutzBei,
      abbreviation: inhalt.werte.trgs524DguvRegel,
      authority: inhalt.werte.berufsgenossenschaftenBgBauStaatlich,
      scope: inhalt.werte.sachkundenachweisFürBauleiterPlaner,
      legalBase: inhalt.werte.trgs524TechnischeRegel,
      targetGroup: inhalt.werte.sigekoSicherheitsUndGesundheitsschutzkoo,
      duration: inhalt.werte.t2Bis5Tage,
      validity: inhalt.werte.unbefristetRegelmäßigeBetrieblicheNachpr,
      difficulty: 'Mittel',
      prerequisites: [
        inhalt.werte.erfahrungImErdbauOder,
        inhalt.werte.fachkenntnisseImArbeitsschutzZ
      ],
      modules: [
        inhalt.werte.gefahrstoffanalyseKontaminierterStandort,
        inhalt.werte.erstellungVonDetailliertenArbeits,
        inhalt.werte.messtechnischeGasdetektionImArbeitsberei,
        inhalt.werte.festlegungDerSchwarzWeiß,
        inhalt.werte.gefahrenpräventionBezüglichBrandUnd,
        inhalt.werte.umweltschonenderUmgangMitKontaminiertem
      ],
      relevance: inhalt.werte.dieserScheinIstUnabdingbar,
      category: 'schadstoffe'
    },
    trgs521: {
      id: 'trgs521',
      title: inhalt.werte.abbruchSanierungsUndInstandhaltungsarbei,
      abbreviation: inhalt.werte.trgs521KmfSchein,
      authority: inhalt.werte.berufsgenossenschaftenUndStaatlichAnerka,
      scope: inhalt.werte.regeltSchutzmaßnahmenUndArbeitsmedizinis,
      legalBase: inhalt.werte.trgs521MineralfasernGefahrstoffverordnun,
      targetGroup: inhalt.werte.bauleiterArchitektenEnergieberaterTrocke,
      duration: inhalt.werte.t1TagKompaktlehrgangInklusive,
      validity: inhalt.werte.unbefristetAuffrischungenBezüglichGefahr,
      difficulty: 'Mittel',
      prerequisites: [
        inhalt.werte.mindestalter18Jahre,
        inhalt.werte.eignungsnachweisFürAtemschutzgeräteG26
      ],
      modules: [
        inhalt.werte.faserklassifizierungAlteKrebserzeugendeW,
        inhalt.werte.staubarmeDemontagetechnikenBefeuchtenMit,
        inhalt.werte.erforderlichePersönlicheSchutzausrüstung,
        inhalt.werte.sackverpackungVorTransportSowie,
        inhalt.werte.einrichtenStaubarmerSanierungsbereicheUn
      ],
      relevance: inhalt.werte.alteGesundheitlichBedenklicheMineralfase,
      category: 'schadstoffe'
    },
    sfi: {
      id: 'sfi',
      title: inhalt.werte.schweißfachingenieurInternationalWelding,
      abbreviation: inhalt.werte.sfiIweSchweißaufsicht,
      authority: inhalt.werte.dvsDeutscherVerbandFür,
      scope: inhalt.werte.weltweitAnerkanntesSpitzenzertifikatZur,
      legalBase: inhalt.werte.dinEnIso14731,
      targetGroup: inhalt.werte.tragwerksplanerImMetallUnd,
      duration: inhalt.werte.sehrUmfangreich3Module,
      validity: inhalt.werte.unbefristetKontinuierlicheWeiterbildungM,
      difficulty: 'Sehr Hoch',
      prerequisites: [
        inhalt.werte.abgeschlossenesAnerkanntesIngenieurstudi,
        inhalt.werte.zulassungsprüfungBeiDerAnerkannter
      ],
      modules: [
        inhalt.werte.schweißverfahrenUndDerenPhysik,
        inhalt.werte.werkstoffeUndIhrMetallurgisches,
        inhalt.werte.konstruktionUndBerechnungGeschweißter,
        inhalt.werte.werkstoffprüfungDesSchmelzbadsRöntgenprü,
        inhalt.werte.auslegungUndQualitätskontrolleIm
      ],
      relevance: inhalt.werte.verantwortlicherIngenieurImSinne,
      category: 'baubetrieb'
    },
    wood_protection: {
      id: 'wood_protection',
      title: inhalt.werte.sachkundigerFürHolzschutzAm,
      abbreviation: inhalt.werte.sachkundenachweisHolzschutzDin68800,
      authority: inhalt.werte.deutscherHolzUndBautenschutzverband,
      scope: inhalt.werte.spezialisierterNachweisZurFachgerechten,
      legalBase: inhalt.werte.din688004Vorbeugende,
      targetGroup: inhalt.werte.denkmalpflegerArchitektenGutachterBauing,
      duration: inhalt.werte.ca80UnterrichtsstundenZzgl,
      validity: inhalt.werte.lebenslangGültigWobeiRegelmäßige,
      difficulty: 'Hoch',
      prerequisites: [
        inhalt.werte.kandidatAusDemBauhauptgewerbe,
        inhalt.werte.mindestens3JahreBerufserfahrung
      ],
      modules: [
        inhalt.werte.biologischeBestimmungHolzzerstörenderPil,
        inhalt.werte.erkennungUndDifferenzierungVon,
        inhalt.werte.mechanischeThermischeHeißluftverfahrenUn,
        inhalt.werte.sanierungVonHausschwammbefallenemMauerwe,
        inhalt.werte.untersuchungsmethodenSchadenskartierungU,
        inhalt.werte.gefahrstoffverordnungGesetzlicheAnwendun
      ],
      relevance: inhalt.werte.derScheinIstRechtlich,
      category: 'denkmal'
    },
    masonry_restoration: {
      id: 'masonry_restoration',
      title: inhalt.werte.zertifizierterFachplanerFürBauwerkserhal,
      abbreviation: inhalt.werte.fachplanerMauerwerkWta,
      authority: inhalt.werte.wtaEVWissenschaftlich,
      scope: inhalt.werte.höchsteHerstellerneutraleWeiterbildungIm,
      legalBase: inhalt.werte.wtaMerkblätterReferatMauerwerk,
      targetGroup: inhalt.werte.tragwerksplanerGutachterFürBauwerksschäd,
      duration: inhalt.werte.modularesAufbaustudiumCa45,
      validity: inhalt.werte.gültigkeitUndFortbildungspflichtenNach,
      difficulty: 'Hoch',
      prerequisites: [
        inhalt.werte.studienabschlussImBauingenieurwesenBauph,
        inhalt.werte.oderAnerkannterRestauratorIm
      ],
      modules: [
        inhalt.werte.grundlagenDerBauphysikalischenFeuchtigke,
        inhalt.werte.untersuchungVonSchädlichenSalzanreicheru,
        inhalt.werte.mauerwerkstrockenlegungMechanischeHorizo,
        inhalt.werte.sanierungVonStatischenMauerwerksrissen,
        inhalt.werte.historischeBindemittelUndMörtelrezepture,
        inhalt.werte.sanierputzSystemeNachWta
      ],
      relevance: inhalt.werte.historischesMauerwerkReagiertHochgradig,
      category: 'denkmal'
    },
    mold_remediation: {
      id: 'mold_remediation',
      title: inhalt.werte.sachkundenachweisFürDieErkennung,
      abbreviation: inhalt.werte.schimmelSachkundeTüvWta,
      authority: inhalt.werte.verbandDerTüvE,
      scope: inhalt.werte.nachweisDerFachtechnischenUnd,
      legalBase: inhalt.werte.schimmelpilzLeitfadenDesUmweltbundesamte,
      targetGroup: inhalt.werte.bauleiterSchadensgutachterMalermeisterTr,
      duration: inhalt.werte.t3Bis5Tage,
      validity: inhalt.werte.unbefristetRegelmäßigeEintägigeRefresher,
      difficulty: 'Mittel',
      prerequisites: [
        inhalt.werte.fachlicheAusbildungImBau,
        inhalt.werte.sichererUmgangMitGrundlegendem
      ],
      modules: [
        inhalt.werte.mikrobiologieUnterscheidungVonSchimmelpi,
        inhalt.werte.messtechnischeErfassungDerBauwerkshygrot,
        inhalt.werte.ursachenanalyseVonSchimmelbildungWärmebr,
        inhalt.werte.schadensklassifizierungKategorie1Bis,
        inhalt.werte.sanierungskonzepteErrichtungStaubdichter,
        inhalt.werte.desinfektionUndReinigungMit
      ],
      relevance: inhalt.werte.beimNachträglichenEinbauDichter,
      category: 'schadstoffe'
    },
    heritage_energy: {
      id: 'heritage_energy',
      title: inhalt.werte.energieberaterFürBaudenkmaleUnd,
      abbreviation: inhalt.werte.energieberaterDenkmalDenaWta,
      authority: inhalt.werte.denaDeutscheEnergieAgentur,
      scope: inhalt.werte.zertifizierterSachverständigerZurThermis,
      legalBase: inhalt.werte.gebäudemodernisierungsgesetzGmodgGeänder,
      targetGroup: inhalt.werte.architektenBauphysikerTragwerksplanerGel,
      duration: inhalt.werte.spezifischesAufbaustudiumCa160,
      validity: inhalt.werte.t3JahreVerlängerungDurch,
      difficulty: 'Sehr Hoch',
      prerequisites: [
        inhalt.werte.zulassungAlsRegulärerDena,
        inhalt.werte.bauhauptstudienabschlussOderHandwerklich
      ],
      modules: [
        inhalt.werte.einflussHistorischerBaustoffeLehm,
        inhalt.werte.simulationsverfahrenFürKapillaraktiveInn,
        inhalt.werte.denkmalpflegerischeKernkriterienFassaden,
        inhalt.werte.wärmebrückenberechnungAnHolzbalkenauflag,
        inhalt.werte.konzeptionierungBehutsamerAnlagentechnik,
        inhalt.werte.beantragungUndNachweisführungGeförderter
      ],
      relevance: inhalt.werte.standardmäßigeAußendämmungenWdvsSind,
      category: 'denkmal'
    },
    sigeko: {
      id: 'sigeko',
      title: inhalt.werte.sicherheitsUndGesundheitsschutzkoordinat,
      abbreviation: inhalt.werte.sigekoRab30,
      authority: inhalt.werte.bauBerufsgenossenschaftenBgStaatlich,
      scope: inhalt.werte.zulassungZurGesetzlichVorgeschriebenen,
      legalBase: inhalt.werte.verordnungÜberSicherheitUnd,
      targetGroup: inhalt.werte.bauleiterProjektsteuererArchitektenBauin,
      duration: inhalt.werte.lehrgängeZuArbeitsschutzfachlichenUnd,
      validity: inhalt.werte.unbefristetFortlaufendeInformelleAktuali,
      difficulty: 'Mittel',
      prerequisites: [
        inhalt.werte.baufachlicheBerufsausbildungTechnikerMei,
        inhalt.werte.mindestens2JahreEinschlägige
      ],
      modules: [
        inhalt.werte.grundlagenDesArbeitsschutzrechtsArbschg,
        inhalt.werte.erstellungDesGesetzlichGeforderten,
        inhalt.werte.entwurfDerUnterlagenFür,
        inhalt.werte.koordinierungsmethodikInDerPlanungsphase,
        inhalt.werte.praktischerArbeitsschutzAufBaustellen,
        inhalt.werte.haftungsrechtlicheVerpflichtungenUndStra
      ],
      relevance: inhalt.werte.sobaldBeschäftigteMehrererFirmen,
      category: 'baubetrieb'
    },
    crack_injection: {
      id: 'crack_injection',
      title: inhalt.werte.fachkraftFürDasFüllen,
      abbreviation: inhalt.werte.injektionsScheinRissverpressung,
      authority: inhalt.werte.akademienDerBauwirtschaftDbv,
      scope: inhalt.werte.zertifizierterNachweisZurFachgerechten,
      legalBase: inhalt.werte.trInstandhaltungDesDibt,
      targetGroup: inhalt.werte.sanierungshandwerkerPoliereKolonnenführe,
      duration: inhalt.werte.praxisorientierterLehrgangMitApplikation,
      validity: inhalt.werte.regelungenZuGültigkeitUnd3,
      difficulty: 'Mittel',
      prerequisites: [
        inhalt.werte.erfolgreichAbsolvierterSivvSchein,
        inhalt.werte.oderEineAbgeschlosseneAusbildung
      ],
      modules: [
        inhalt.werte.einteilungVonHaarrissenGefügestörungen,
        inhalt.werte.materialeigenschaftenVonInjektionsstoffe,
        inhalt.werte.mechanischeBohrpackertechnikVsKlebe,
        inhalt.werte.maschinentechnikWirkungsweisenVon1,
        inhalt.werte.sanierungsmethodenKraftschlüssigesVerbin,
        inhalt.werte.qualitätssicherungÜberwachungDerBauteilt
      ],
      relevance: inhalt.werte.verpressungenImRissbereichHängen,
      category: 'beton'
    },
    thermography: {
      id: 'thermography',
      title: inhalt.werte.zertifizierterThermografDerStufe,
      abbreviation: inhalt.werte.bauthermografDinEnIso,
      authority: inhalt.werte.zertifizierungsstellenNachDinEn,
      scope: inhalt.werte.nachweisDerMesstechnischenUnd,
      legalBase: inhalt.werte.dinEnIso9712,
      targetGroup: inhalt.werte.energieberaterBauphysikerGebäudeDiagnost,
      duration: inhalt.werte.jeStufe4080,
      validity: inhalt.werte.t5JahreVerlängerungDurch,
      difficulty: 'Hoch',
      prerequisites: [
        inhalt.werte.nachweisÜberAusreichendesSehvermögen,
        inhalt.werte.praktischeErfahrungszeitenImBereich
      ],
      modules: [
        inhalt.werte.physikalischeGrundlagenDerInfrarotstrahl,
        inhalt.werte.messtechnischeParameterBestimmungDes,
        inhalt.werte.bauphysikalischeZusammenhängeWärmewiders,
        inhalt.werte.einflussVonLuftströmungenUnd,
        inhalt.werte.gerätekundeDetektorauflösungNetdWellenlä,
        inhalt.werte.erstellungNormgerechterThermografischerB
      ],
      relevance: inhalt.werte.gutachterlicheThermografieberichteSindVo,
      category: 'bauphysik'
    },
    waterproofing: {
      id: 'waterproofing',
      title: inhalt.werte.zertifizierterFachplanerUndSachverständi,
      abbreviation: inhalt.werte.abdichtungsPlanerDhbvTüv,
      authority: inhalt.werte.deutscherHolzUndBautenschutzverband2,
      scope: inhalt.werte.spezialisierterSachkundeUndPlanernachwei,
      legalBase: inhalt.werte.din18531BisDin,
      targetGroup: inhalt.werte.architektenTragwerksplanerBeratendeIngen,
      duration: inhalt.werte.speziallehrgangInMehrerenFachblöcken,
      validity: inhalt.werte.unbefristetKontinuierlicheAnpassungsfort,
      difficulty: 'Hoch',
      prerequisites: [
        inhalt.werte.ingenieurtechnischeBauausbildungOderHand,
        inhalt.werte.mindestens2JahreNachgewiesene
      ],
      modules: [
        inhalt.werte.wasserbeanspruchungsklassenW1EBis,
        inhalt.werte.moderneAbdichtungsstoffeKunststoffmodifi,
        inhalt.werte.detailplanungFürDieBauausführung,
        inhalt.werte.bauwerksbeurteilungenBeiDrückendemWasser,
        inhalt.werte.nachträglicheSchleierinjektionenUndInnen
      ],
      relevance: inhalt.werte.wassereintritteUndFeuchteKeller,
      category: 'bauphysik'
    },
    drone_inspection: {
      id: 'drone_inspection',
      title: inhalt.werte.euFernpilotenzeugnisA2Für,
      abbreviation: inhalt.werte.drohneninspektorA2Lba,
      authority: inhalt.werte.luftfahrtBundesamtLbaAnerkannte,
      scope: inhalt.werte.rechtlicherUndPraktischerBefähigungsnach,
      legalBase: inhalt.werte.euVerordnung2019947,
      targetGroup: inhalt.werte.gebäudediagnostikerBrückenprüfingenieure,
      duration: inhalt.werte.t34TageTheorie,
      validity: inhalt.werte.t5JahreVerlängerungNach,
      difficulty: 'Mittel',
      prerequisites: [
        inhalt.werte.vorgeschalteterEuKompetenznachweisA1,
        inhalt.werte.erklärungDerAbsolvierungEines,
        inhalt.werte.haftpflichtVersicherungsschutzFürFlugger
      ],
      modules: [
        inhalt.werte.aerodynamischeWindschattenUndTurbulenzef,
        inhalt.werte.lbaRichtlinienBezüglichDes,
        inhalt.werte.grundlagenDerBildgestütztenBauwerks,
        inhalt.werte.sicherheitsNotfallsteuerungenUndSignalst,
        inhalt.werte.datenschutzrechtlicheAspekteDsgvoBei
      ],
      relevance: inhalt.werte.dieInspektionHoherSchornsteine,
      category: 'bauphysik'
    },
    building_damage_expert: {
      id: 'building_damage_expert',
      title: inhalt.werte.zertifizierterSachverständigerFürSchäden,
      abbreviation: inhalt.werte.bauschadensGutachterIhkIso,
      authority: inhalt.werte.ihkPersonenzertifizierungsstellenNachDin,
      scope: inhalt.werte.höchststufeDerBautechnischenZertifizieru,
      legalBase: inhalt.werte.t36GewoÖffentlicheBestellung,
      targetGroup: inhalt.werte.freiberuflicheBausachverständigePlanende,
      duration: inhalt.werte.modularesStudiumÜberCa,
      validity: inhalt.werte.personenzertifikateNachDinEn,
      difficulty: 'Sehr Hoch',
      prerequisites: [
        inhalt.werte.abgeschlossenesIngenieurOderArchitekturs,
        inhalt.werte.oderQualifizierterHandwerksmeisterZ
      ],
      modules: [
        inhalt.werte.werkvertragsrechtUndMängelzuweisungNach,
        inhalt.werte.schadensmechanikThermischHygrischeBauwer,
        inhalt.werte.bautechnischeBauwerksdiagnostikRissbreit,
        inhalt.werte.dachUndBauwerksabdichtungskonstruktionen,
        inhalt.werte.gutachtenmethodikUnabhängigkeitNachvollz
      ],
      relevance: inhalt.werte.gerichtlicheBeweisbeschlüsseUndVersicher,
      category: 'baubetrieb'
    }
  };

  // Profile-Based Certificate Finder
  const recommendedCerts = useMemo(() => {
    if (!userBackground || !userGoal) return [];
    
    const recs: { cert: Certificate; reason: string }[] = [];
    
    if (userBackground === 'engineer') {
      if (userGoal === 'sanierung') {
        recs.push({ cert: certs.skp, reason: inhalt.werte.alsBauingenieurIstDer });
        recs.push({ cert: certs.eschein, reason: inhalt.werte.derEScheinBildet });
        recs.push({ cert: certs.building_damage_expert, reason: inhalt.werte.derBauschadensGutachterIhk });
      } else if (userGoal === 'bauleitung') {
        recs.push({ cert: certs.eschein, reason: inhalt.werte.alsBauüberwachendeIngenieurinOder });
        recs.push({ cert: certs.trgs519, reason: inhalt.werte.beiSanierungsbauleitungenImAltbestand });
        recs.push({ cert: certs.sigeko, reason: inhalt.werte.derSigekoScheinRab });
      } else if (userGoal === 'stahlbau') {
        recs.push({ cert: certs.sfi, reason: inhalt.werte.imKonstruktivenIngenieurbauStahlbrückenb });
      } else if (userGoal === 'spezialwerke') {
        recs.push({ cert: certs.kks, reason: inhalt.werte.fürDieDauerhafteInstandhaltung });
      } else if (userGoal === 'holzschutz') {
        recs.push({ cert: certs.wood_protection, reason: inhalt.werte.derSachkundenachweisFürHolzschutz });
      } else if (userGoal === 'schadstoffe') {
        recs.push({ cert: certs.trgs519, reason: inhalt.werte.derAsbestScheinTrgs });
        recs.push({ cert: certs.trgs524, reason: inhalt.werte.fürArbeitenImKontaminierten });
        recs.push({ cert: certs.trgs521, reason: inhalt.werte.mitDerFachkundeNach });
        recs.push({ cert: certs.mold_remediation, reason: inhalt.werte.dieSchimmelSachkundeLiefert });
      } else if (userGoal === 'denkmal_energie') {
        recs.push({ cert: certs.heritage_energy, reason: inhalt.werte.alsDenaGelisteterEnergieberater });
        recs.push({ cert: certs.masonry_restoration, reason: inhalt.werte.dieWtaInstandsetzungsplanungLiefert });
      } else if (userGoal === 'baustellen_sicherheit') {
        recs.push({ cert: certs.sigeko, reason: inhalt.werte.alsPlanerIngenieurQualifiziert });
      } else if (userGoal === 'rissinjektion') {
        recs.push({ cert: certs.skp, reason: inhalt.werte.planerischeEntwürfeBauteilauswahlenUnd });
        recs.push({ cert: certs.crack_injection, reason: inhalt.werte.derHandwerklicheInjektionsscheinVermitte });
      } else if (userGoal === 'bauwerk_diagnose') {
        recs.push({ cert: certs.thermography, reason: inhalt.werte.erwirbEinAnerkanntesBauthermografen });
        recs.push({ cert: certs.drone_inspection, reason: inhalt.werte.derGroßeDrohnenführerscheinA2 });
      } else if (userGoal === 'abdichtung') {
        recs.push({ cert: certs.waterproofing, reason: inhalt.werte.alsZertifizierterFachplanerFür });
        recs.push({ cert: certs.masonry_restoration, reason: inhalt.werte.ergänzeWtaSpezialwissenFür });
      }
    } else if (userBackground === 'handwerker') {
      if (userGoal === 'sanierung') {
        recs.push({ cert: certs.sivv, reason: inhalt.werte.alsMaurermeisterPolierOder });
        recs.push({ cert: certs.duesenfuehrer, reason: inhalt.werte.spritzbetonAufzubringenVerlangtÄußerste });
      } else if (userGoal === 'bauleitung') {
        recs.push({ cert: certs.sivv, reason: inhalt.werte.polierenImBestandWird });
        recs.push({ cert: certs.trgs519, reason: inhalt.werte.werAsbesthaltigeGefahrstoffeZ });
      } else if (userGoal === 'holzschutz') {
        recs.push({ cert: certs.wood_protection, reason: inhalt.werte.alsAusführenderHandwerkerZ });
      } else if (userGoal === 'schadstoffe') {
        recs.push({ cert: certs.trgs519, reason: inhalt.werte.trgs519Anlage3 });
        recs.push({ cert: certs.trgs521, reason: inhalt.werte.derKmfScheinSichert });
        recs.push({ cert: certs.mold_remediation, reason: inhalt.werte.dieSchimmelpilzSanierungssachkundeBerech });
      } else if (userGoal === 'baustellen_sicherheit') {
        recs.push({ cert: certs.sigeko, reason: inhalt.werte.mitBaufachlichemHintergrundAls });
      } else if (userGoal === 'rissinjektion') {
        recs.push({ cert: certs.crack_injection, reason: inhalt.werte.derRissinjektionScheinIst });
        recs.push({ cert: certs.sivv, reason: inhalt.werte.fürQualifizierteInjektionenRissbelastete });
      } else if (userGoal === 'bauwerk_diagnose') {
        recs.push({ cert: certs.drone_inspection, reason: inhalt.werte.befliegeKomplexeSteildachflächenOder });
      } else if (userGoal === 'abdichtung') {
        recs.push({ cert: certs.waterproofing, reason: inhalt.werte.bautenschützerUndSanierungshandwerkerWei });
        recs.push({ cert: certs.crack_injection, reason: inhalt.werte.sieFührenHochdruckverpressendeRissabdich });
      } else {
        recs.push({ cert: certs.sivv, reason: inhalt.werte.zurWeiterbildungImHandwerk });
      }
    } else if (userBackground === 'student') {
      recs.push({ cert: certs.eschein, reason: inhalt.werte.studierendeDesBauingenieurwesensKönnen });
      recs.push({ cert: certs.skp, reason: inhalt.werte.berufszielInstandsetzungsplanungBereiten });
      
      if (userGoal === 'holzschutz') {
        recs.push({ cert: certs.wood_protection, reason: inhalt.werte.bietetArchitekturUndBaustudierenden });
      } else if (userGoal === 'schadstoffe') {
        recs.push({ cert: certs.trgs524, reason: inhalt.werte.altlastenUndGeotechnikSind });
        recs.push({ cert: certs.trgs521, reason: inhalt.werte.wichtigesKompaktFachwissenFür });
      } else if (userGoal === 'denkmal_energie') {
        recs.push({ cert: certs.heritage_energy, reason: inhalt.werte.idealerEinstiegBereitsWährend });
      } else if (userGoal === 'bauwerk_diagnose') {
        recs.push({ cert: certs.thermography, reason: inhalt.werte.nutzenSieThermografischeQualifikationen });
      } else if (userGoal === 'abdichtung') {
        recs.push({ cert: certs.waterproofing, reason: inhalt.werte.vertiefenSieIhrWissen });
      }
    }
    
    return recs;
  }, [userBackground, userGoal]);

  const filteredCerts = useMemo(() => {
    return Object.values(certs).filter(cert => {
      if (selectedCategory === 'all') return true;
      return cert.category === selectedCategory;
    });
  }, [selectedCategory, certs]);

  const activeCert = certs[activeCertId];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header and overview */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Award className="text-shiraz" /><MdText text={inhalt.texte.relevanteFortbildungenScheineQualifikati} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.detailliertesUndUmfassendesVerzeichnis} /></p>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/25 flex gap-3 leading-relaxed">
          <GraduationCap className="text-shiraz shrink-0 mt-0.5" size={20} />
          <p><MdText text={inhalt.texte.imDeutschenBauwesenSind} /></p>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100/70 rounded-xl border border-home-grau/30">
          {categories.map((cat) => {
            const count = cat.id === 'all' 
              ? Object.keys(certs).length 
              : Object.values(certs).filter(c => c.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-text-main/70 hover:text-text-main hover:bg-stone-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-stone-200 text-text-main/60'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic selector interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* List of Certificates */}
          <div className="lg:col-span-4 flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 block">Zertifizierungsauswahl:</span>
            {filteredCerts.map((cert) => {
              const isActive = activeCertId === cert.id;
              return (
                <button aria-pressed={isActive}
                  key={cert.id}
                  onClick={() => setActiveCertId(cert.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex justify-between items-center gap-2 ${
                    isActive
                      ? 'bg-shiraz text-white border-shiraz shadow-md'
                      : 'bg-stone-50/50 border-home-grau/25 hover:bg-stone-50 text-text-main'
                  }`}
                >
                  <div className="flex flex-col gap-0.5 min-w-0 pr-1">
                    <span className={`text-[9px] uppercase font-mono tracking-widest ${isActive ? 'text-white/80' : 'text-shiraz font-bold'}`}>
                      {cert.authority}
                    </span>
                    <span className="font-bold truncate">{cert.abbreviation}</span>
                  </div>
                  <ArrowRight size={14} className={`shrink-0 transition-transform ${isActive ? 'translate-x-1' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Certificate Detail View */}
          <div className="lg:col-span-8 bg-stone-50 border border-home-grau/30 p-5 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-home-grau/30 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold bg-shiraz/10 text-shiraz px-2 py-0.5 rounded-md">
                    Herausgeber: {activeCert.authority}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500">SCHWIERIGKEIT:</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${
                      activeCert.difficulty === 'Sehr Hoch' ? 'bg-red-600' :
                      activeCert.difficulty === 'Hoch' ? 'bg-orange-600' : 'bg-teal-600'
                    }`}>
                      {activeCert.difficulty}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-text-main mt-2 leading-tight">
                  {activeCert.title}
                </h3>
                <p className="text-xs sm:text-sm text-shiraz font-semibold mt-1 font-mono">
                  Kurzformel/Titel: {activeCert.abbreviation}
                </p>
              </div>

              {/* Detailed specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-gray-900 font-bold border-b pb-1">
                    <FileText size={14} className="text-shiraz" /><MdText text={inhalt.texte.gesetzlicheNormativeVerknüpfung} /></div>
                  <p className="text-gray-750 leading-relaxed text-xs sm:text-sm">{activeCert.legalBase}</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-gray-900 font-bold border-b pb-1">
                    <Users size={14} className="text-shiraz" /> Zielpublikum
                  </div>
                  <p className="text-gray-750 leading-relaxed text-xs sm:text-sm">{activeCert.targetGroup}</p>
                </div>
              </div>

              {/* Scope & Syllabus */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wide"><MdText text={inhalt.texte.ausbildungsnutzenStudieninhalte} /></h4>
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic border-l-2 border-shiraz pl-2">
                    "{activeCert.scope}"
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-750 list-none pl-0">
                    {activeCert.modules.map((m, idx) => (
                      <li key={idx} className="flex gap-1.5 items-start">
                        <Check size={14} className="text-emerald-600 block mt-0.5 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Requirements & Validity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wide mb-1.5">Zulassungsvoraussetzungen</h4>
                  <ul className="space-y-1 text-xs sm:text-sm text-gray-750 pl-0 list-none">
                    {activeCert.prerequisites.map((p, idx) => (
                      <li key={idx} className="flex gap-1.5 items-start">
                        <span className="w-1.5 h-1.5 bg-shiraz rounded-full mt-1.5 shrink-0"></span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wide mb-1.5"><MdText text={inhalt.texte.gültigkeitRezertifizierung} /></h4>
                  <div className="p-3 bg-stone-100 rounded-xl space-y-2 text-xs sm:text-sm border border-gray-200">
                    <div className="flex justify-between items-center text-[11px] font-mono border-b pb-1">
                      <span className="font-bold text-gray-500">DAUER:</span>
                      <span className="text-gray-900">{activeCert.duration}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="font-bold text-gray-500">FRIST:</span>
                      <span className="text-red-700 font-bold">{activeCert.validity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Practice relevance info */}
              <div className="bg-indigo-50 border border-indigo-200/50 p-4 rounded-xl flex gap-2.5 text-xs sm:text-sm text-indigo-900">
                <AlertTriangle className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                <div className="space-y-0.5">
                  <span className="font-bold block text-indigo-950"><MdText text={inhalt.texte.bedeutungFürDiePraxis} /></span>
                  <p className="leading-relaxed">{activeCert.relevance}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Path finder widget */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-2 mb-4 border-b border-home-grau/30 pb-3">
          <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg"><Sparkles size={18} /></span>
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.qualifizierungsPfadfinderWelcheAusbildun} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.gebenSieIhrenHintergrund} /></p>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Inputs */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5"><MdText text={inhalt.texte.t1IhrBeruflicherAkademischer} /></label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => { setUserBackground('engineer'); setUserGoal(''); }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                    userBackground === 'engineer'
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                      : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-mono">🎓</span><MdText text={inhalt.texte.absolventBauingenieurWerkstoffwissenscha} /></button>
                <button
                  onClick={() => { setUserBackground('handwerker'); setUserGoal(''); }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                    userBackground === 'handwerker'
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                      : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-mono">🛠️</span><MdText text={inhalt.texte.handwerkerMeisterPolierQuereinsteiger} /></button>
                <button
                  onClick={() => { setUserBackground('student'); setUserGoal(''); }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                    userBackground === 'student'
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                      : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-mono font-bold">📖</span><MdText text={inhalt.texte.studierenderDerArchitekturBauingenieurwe} /></button>
              </div>
            </div>

            {userBackground && (
              <div className="animate-in fade-in duration-300">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5"><MdText text={inhalt.texte.t2IhrPrimäresEinsatz} /></label>
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  
                  {/* Shared/Universal goals tailored contextually */}
                  <button aria-pressed={userGoal === 'sanierung'}
                    onClick={() => setUserGoal('sanierung')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'sanierung'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.betonbauParkhausBrückeninstandsetzungLei} /></span>
                    <Hammer size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'bauleitung'}
                    onClick={() => setUserGoal('bauleitung')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'bauleitung'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.bauüberwachungAufAnspruchsvollenSanierun} /></span>
                    <Zap size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'holzschutz'}
                    onClick={() => setUserGoal('holzschutz')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'holzschutz'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.historischenHolzbauDachstühleSanieren} /></span>
                    <Hammer size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'schadstoffe'}
                    onClick={() => setUserGoal('schadstoffe')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'schadstoffe'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.schadstoffsanierungInnenraumhygieneAsbes} /></span>
                    <Zap size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'rissinjektion'}
                    onClick={() => setUserGoal('rissinjektion')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'rissinjektion'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.rissabdichtungenHarzinjektionenFachgerec} /></span>
                    <Hammer size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'baustellen_sicherheit'}
                    onClick={() => setUserGoal('baustellen_sicherheit')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'baustellen_sicherheit'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.sicherheitskoordinationNachBaustellvSige} /></span>
                    <Zap size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'bauwerk_diagnose'}
                    onClick={() => setUserGoal('bauwerk_diagnose')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'bauwerk_diagnose'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.bauwerksdiagnostikInspektionMesstechnikZ} /></span>
                    <Zap size={12} className="shrink-0 text-shiraz" />
                  </button>
                  <button aria-pressed={userGoal === 'abdichtung'}
                    onClick={() => setUserGoal('abdichtung')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      userGoal === 'abdichtung'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                        : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.bauwerksabdichtungenFeuchtigkeitsschutzP} /></span>
                    <Hammer size={12} className="shrink-0 text-shiraz" />
                  </button>

                  {/* Engineer exclusivities */}
                  {userBackground === 'engineer' && (
                    <>
                      <button aria-pressed={userGoal === 'stahlbau'}
                        onClick={() => setUserGoal('stahlbau')}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          userGoal === 'stahlbau'
                            ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                            : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                        }`}
                      >
                        <span><MdText text={inhalt.texte.stahlbauSchweißaufsichtNachDin} /></span>
                        <Zap size={12} className="shrink-0 text-shiraz" />
                      </button>
                      <button aria-pressed={userGoal === 'spezialwerke'}
                        onClick={() => setUserGoal('spezialwerke')}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          userGoal === 'spezialwerke'
                            ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                            : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                        }`}
                      >
                        <span><MdText text={inhalt.texte.elektrochemischenKksSchutzFür} /></span>
                        <Zap size={12} className="shrink-0 text-shiraz" />
                      </button>
                      <button aria-pressed={userGoal === 'denkmal_energie'}
                        onClick={() => setUserGoal('denkmal_energie')}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          userGoal === 'denkmal_energie'
                            ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                            : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                        }`}
                      >
                        <span><MdText text={inhalt.texte.energetischeSanierungHistorischerBaudenk} /></span>
                        <Zap size={12} className="shrink-0 text-shiraz" />
                      </button>
                    </>
                  )}

                  {userBackground === 'student' && (
                    <button aria-pressed={userGoal === 'denkmal_energie'}
                      onClick={() => setUserGoal('denkmal_energie')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        userGoal === 'denkmal_energie'
                          ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                          : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                      }`}
                    >
                      <span><MdText text={inhalt.texte.energetischeSanierungHistorischerBaudenk2} /></span>
                      <Zap size={12} className="shrink-0 text-shiraz" />
                    </button>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Recommendation Area */}
          <div className="md:col-span-7 bg-stone-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col justify-center min-h-[350px]">
            {userBackground && userGoal ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block"><MdText text={inhalt.texte.unsereAnalyseZertifizierungspfad} /></span>
                <h4 className="font-bold text-sm text-gray-900 border-b pb-1.5 flex items-center gap-1.55">
                  <CheckCircle size={16} className="text-emerald-600" /><MdText text={inhalt.texte.empfohleneQualifikationsnachweiseZusatzs} /></h4>
                
                {recommendedCerts.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {recommendedCerts.map((rec, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
                        <div className="flex justify-between items-center">
                          <strong className="text-xs text-shiraz block">{rec.cert.abbreviation}</strong>
                          <span className="text-[9px] font-mono text-gray-600 bg-gray-100 rounded px-1.5 py-0.5">{rec.cert.authority}</span>
                        </div>
                        <p className="text-[11px] text-gray-800 leading-relaxed font-semibold mt-1">
                          {rec.cert.title}
                        </p>
                        <p className="text-[10.5px] text-gray-550 leading-relaxed mt-1 bg-stone-50 p-2.5 rounded border border-gray-100 italic">
                          "{rec.reason}"
                        </p>
                        <button 
                          onClick={() => setActiveCertId(rec.cert.id)}
                          className="text-[9.5px] font-bold text-shiraz hover:underline flex items-center gap-1 mt-1.5"
                        ><MdText text={inhalt.texte.detailsImVerzeichnisAnsehen} /><ArrowRight size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic"><MdText text={inhalt.texte.keineDirektenSpezifikationsübereinstimmu} /></p>
                )}
              </div>
            ) : (
              <div className="text-center text-home-grau flex flex-col items-center justify-center gap-2">
                <HelpCircle size={36} className="text-gray-300" />
                <p className="font-medium text-xs"><MdText text={inhalt.texte.pfadfinderInaktiv} /></p>
                <p className="text-[11px] max-w-sm leading-relaxed text-gray-500"><MdText text={inhalt.texte.bitteWählenSieLinks} /></p>
              </div>
            )}
          </div>

        </div>
      </div>

      <ModuleFooter 
        weblinks={inhalt.daten["Fortbildungen.weblinks"]} 
        wikipedia={[
          { title: "Betontechnologe" },
          { title: "Hausschwamm", url: "https://de.wikipedia.org/wiki/Echter_Hausschwamm" },
          { title: inhalt.werte.kathodischerKorrosionsschutz, url: "https://de.wikipedia.org/wiki/Kathodischer_Korrosionsschutz" }
        ]} 
        literatur={inhalt.daten["Fortbildungen.literatur"]} 
        regelwerke={inhalt.daten["Fortbildungen.regelwerke"]} 
        formeln={inhalt.daten["Fortbildungen.formeln"]} 
      />
    </div>
  );
}
