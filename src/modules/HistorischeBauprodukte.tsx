import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  Layers, 
  BookOpen, 
  Info, 
  Calendar,
  Search,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';
import inhalt from '@/content/historischebauprodukte/HistorischeBauprodukte.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

interface HistoricProduct {
  id: string;
  name: string;
  epochId: 'vorkrieg' | 'nachkrieg' | 'spaetmoderne' | 'moderne';
  epochLabel: string;
  years: string;
  composition: string;
  application: string;
  characteristics: string;
  riskClass: 'none' | 'low' | 'medium' | 'high';
  riskDetail?: string;
  actionDetail?: string;
}

const HISTORIC_PRODUCTS: HistoricProduct[] = [
  // --- VORKRIEGSZEIT & HISTORISCHER BESTAND (BIS 1945) ---
  {
    id: 'roman_cement',
    name: inhalt.werte.römischerZementRomanCement,
    epochId: 'vorkrieg',
    epochLabel: inhalt.werte.vorkriegszeitHistorisch,
    years: 'bis 1945',
    composition: inhalt.werte.natürlicherTonhaltigerMergelsteinMergelk,
    application: inhalt.werte.zierelementeFassadenstuckOrnamentgussSch,
    characteristics: inhalt.werte.sehrSchnelleErstarrungszeitOft,
    riskClass: 'none'
  },
  {
    id: 'gusseisen',
    name: inhalt.werte.gusseisenGrauguss,
    epochId: 'vorkrieg',
    epochLabel: inhalt.werte.vorkriegszeitHistorisch2,
    years: 'bis 1945',
    composition: inhalt.werte.eisenKohlenstoffLegierungMit,
    application: inhalt.werte.historischeStützenGusseiserneGewölbe,
    characteristics: inhalt.werte.hoheDruckfestigkeitAberSehr,
    riskClass: 'low',
    riskDetail: inhalt.werte.gefahrDesPlötzlichenSprödbruchs,
    actionDetail: inhalt.werte.zugspannungszonenSindKonstruktivZu
  },
  {
    id: 'schweisseisen',
    name: inhalt.werte.schweißeisenPuddelstahl,
    epochId: 'vorkrieg',
    epochLabel: inhalt.werte.vorkriegszeitHistorisch3,
    years: 'bis 1945',
    composition: inhalt.werte.eisenMitExtremNiedrigem,
    application: inhalt.werte.deckenITrägerPreußische,
    characteristics: inhalt.werte.hervorragendSchmiedbarUndFeuerschweißbar,
    riskClass: 'low',
    riskDetail: inhalt.werte.schichtungDesFasergefügesKann,
    actionDetail: inhalt.werte.korrosionsschutzIntaktHaltenKonstruktive
  },
  {
    id: 'flussstahl_historisch',
    name: inhalt.werte.historischerFlussstahlSmStahl,
    epochId: 'vorkrieg',
    epochLabel: inhalt.werte.vorkriegszeitHistorisch4,
    years: 'bis 1945',
    composition: inhalt.werte.imSiemensMartinVerfahren,
    application: inhalt.werte.walzprofileITrägerU,
    characteristics: inhalt.werte.zähesMaterialverhaltenImVergleich,
    riskClass: 'low',
    riskDetail: inhalt.werte.jeNachHerstellungsverfahrenInsb,
    actionDetail: inhalt.werte.vorSanierungsOderSchweißarbeiten
  },
  {
    id: 'reichsformat_ziegel',
    name: inhalt.werte.mauerziegelImReichsformat,
    epochId: 'vorkrieg',
    epochLabel: inhalt.werte.vorkriegszeitHistorisch5,
    years: 'bis 1945',
    composition: inhalt.werte.gebrannterTonOderLehm,
    application: inhalt.werte.tragendesMauerwerkAußenwändeGewölbebaute,
    characteristics: inhalt.werte.hoheRohdichteCa1,
    riskClass: 'none',
    riskDetail: inhalt.werte.keineChemischenSchadstoffeGefahr,
    actionDetail: inhalt.werte.feuchtigkeitsUndSalzgehaltAnalysieren
  },
  {
    id: 'holzzement_dach',
    name: inhalt.werte.holzzementDeckungFrühesFlachdach,
    epochId: 'vorkrieg',
    epochLabel: inhalt.werte.vorkriegszeitHistorisch6,
    years: 'bis 1945',
    composition: inhalt.werte.mehrlagigePappenUndPapierabdichtung,
    application: inhalt.werte.flachdächerVonHistorischenFabriken,
    characteristics: inhalt.werte.sehrZähesAlterungsbeständigesAbdichtungs,
    riskClass: 'high',
    riskDetail: inhalt.werte.enthältExtremHoheKonzentrationen,
    actionDetail: inhalt.werte.rückbauUndAbbruchDürfen
  },
  {
    id: 'kork_daemm_bitumen',
    name: inhalt.werte.bituminierteTeerimprägnierteKorkplatten,
    epochId: 'vorkrieg',
    epochLabel: inhalt.werte.vorkriegszeitHistorisch7,
    years: 'bis 1945',
    composition: inhalt.werte.natürlichesKorkschrotGepresstUnd,
    application: inhalt.werte.wärmedämmungFürKühlhäuserDeckenisolierun,
    characteristics: inhalt.werte.dunkelbrauneBisPechschwarzePlatten,
    riskClass: 'medium',
    riskDetail: inhalt.werte.beiTeergebundenenKorkplattenExtrem,
    actionDetail: inhalt.werte.probenahmeZurUnterscheidungZwischen
  },
  {
    id: 'bleirohre_sanitaer',
    name: 'Blei-Trinkwasserleitungen',
    epochId: 'vorkrieg',
    epochLabel: inhalt.werte.vorkriegszeitHistorisch8,
    years: 'bis 1973',
    composition: inhalt.werte.weichesDuktilesBleiMetall,
    application: inhalt.werte.trinkwasserSteigleitungenHausanschlussle,
    characteristics: inhalt.werte.hervorragendeMechanischeVerformbarkeitLe,
    riskClass: 'high',
    riskDetail: inhalt.werte.auswaschungVonToxischemBlei,
    actionDetail: inhalt.werte.trinkwasseranalyseVeranlassenNach17
  },
  {
    id: 'kupferschlackesteine_pflaster',
    name: inhalt.werte.kupferschlackePflastersteineMansfelderPl,
    epochId: 'vorkrieg',
    epochLabel: inhalt.werte.vorkriegszeitHistorisch9,
    years: 'bis 1945',
    composition: inhalt.werte.silikatischesSchmelzproduktKupferschlack,
    application: inhalt.werte.pflasterungVonStraßenRinnsteinen,
    characteristics: inhalt.werte.pechschwarzBisDunkelblauGlänzend,
    riskClass: 'low',
    riskDetail: inhalt.werte.enthältHerstellungsbedingtErheblicheGeha,
    actionDetail: inhalt.werte.mechanischeBearbeitungSägenSchleifen
  },
  {
    id: 'luftkalk',
    name: inhalt.werte.historischerLuftkalkmörtel,
    epochId: 'vorkrieg',
    epochLabel: inhalt.werte.vorkriegszeitHistorisch10,
    years: 'bis 1945',
    composition: inhalt.werte.calciumhydroxidGelöschterBaukalkGemischt,
    application: inhalt.werte.mauermörtelUndPutzeAn,
    characteristics: inhalt.werte.sehrElastischNiedrigerE,
    riskClass: 'none'
  },
  {
    id: 'rabitz',
    name: inhalt.werte.rabitzSystemDrahtputz,
    epochId: 'vorkrieg',
    epochLabel: inhalt.werte.vorkriegszeitHistorisch11,
    years: 'bis 1945',
    composition: inhalt.werte.trägergewebeAusVerzinktemEisendraht,
    application: inhalt.werte.abgehängteDeckenFeuerhemmendeTrägerverkl,
    characteristics: inhalt.werte.ermöglichteDenÜbergangZu,
    riskClass: 'low',
    riskDetail: inhalt.werte.substanzrisikoDurchFortschreitendeDrahtk,
    actionDetail: inhalt.werte.tragfähigkeitUndRostbefallDer
  },
  {
    id: 'linoleum_alt',
    name: inhalt.werte.klassischesLinoleumKorklinoleum,
    epochId: 'vorkrieg',
    epochLabel: inhalt.werte.vorkriegszeitHistorisch12,
    years: 'bis 1945',
    composition: inhalt.werte.oxidiertesLeinölLinoxynNaturharze,
    application: inhalt.werte.flächigerBodenbelagInHistorischen,
    characteristics: inhalt.werte.fußwarmElastischSchallminderndSchwer,
    riskClass: 'none',
    riskDetail: inhalt.werte.keineChemischenSchadstoffeJedoch,
    actionDetail: inhalt.werte.nurFeuchtWischenNicht
  },

  // --- NACHKRIEGSZEIT & WIEDERAUFBAU (1945-1969) ---
  {
    id: 'isteg_stahl',
    name: inhalt.werte.istegStahlZweistabBetonstahl,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau,
    years: '1945 - 1960',
    composition: inhalt.werte.zweiKaltMiteinanderVerdrillte,
    application: inhalt.werte.bewehrungsstahlFürDeckenplattenBalkontra,
    characteristics: inhalt.werte.durchDieKaltverdrillungReckgradverfestig,
    riskClass: 'medium',
    riskDetail: inhalt.werte.aufgrundDerGlattenStaboberfläche,
    actionDetail: inhalt.werte.beiStatischenNachrechnungenIm
  },
  {
    id: 'torstahl_gerippt',
    name: inhalt.werte.torstahlKaltgerippterTorsionsstahl,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau2,
    years: '1950 - 1980',
    composition: inhalt.werte.warmgewalzterBetonstahlMitSchrägen,
    application: inhalt.werte.standardBewehrungFürSchlaff,
    characteristics: inhalt.werte.erreichtHoheStreckgrenzenVon,
    riskClass: 'low',
    riskDetail: inhalt.werte.dieKaltverfestigungGehtBei,
    actionDetail: inhalt.werte.schweißarbeitenAnHistorischemTorstahl
  },
  {
    id: 'thomas_stahl',
    name: inhalt.werte.thomasStahlWindgefrischterProfilstahl,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau3,
    years: '1945 - 1970',
    composition: inhalt.werte.imThomasKonverterDurch,
    application: inhalt.werte.stahlprofileITrägerU,
    characteristics: inhalt.werte.guteStatischeTragfähigkeitIm,
    riskClass: 'medium',
    riskDetail: inhalt.werte.extremeAnfälligkeitFürAlterungsversprödu,
    actionDetail: inhalt.werte.dasSchweißenVonThomas
  },
  {
    id: 'truemmerbeton',
    name: inhalt.werte.trümmerbetonKlinkerbeton,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau4,
    years: '1945 - 1969',
    composition: inhalt.werte.zementleimMitZuschlägenAus,
    application: inhalt.werte.inSituGegosseneWände,
    characteristics: inhalt.werte.hohePorositätStarkSchwankende,
    riskClass: 'medium',
    riskDetail: inhalt.werte.erhöhteGefahrVonSulfatinduziertem,
    actionDetail: inhalt.werte.bauteilfeuchtigkeitMinimierenKorrosionss
  },
  {
    id: 'huettenstein',
    name: inhalt.werte.hüttensteineSchlackenbetonblock,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau5,
    years: '1945 - 1969',
    composition: inhalt.werte.granulierteHochofenschlackeHüttensandUnd,
    application: inhalt.werte.mauerwerkFürTragendeUnd,
    characteristics: inhalt.werte.guteWärmedämmungUndSchalldämmung,
    riskClass: 'none'
  },
  {
    id: 'schwemmstein',
    name: 'Bimsbeton-Schwemmsteine',
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau6,
    years: '1945 - 1969',
    composition: inhalt.werte.natürlicherPoröserVulkankiesBims,
    application: inhalt.werte.ausfachungVonFachwerkbautenWärmedämmende,
    characteristics: inhalt.werte.sehrGeringeRohdichte0,
    riskClass: 'none'
  },
  {
    id: 'eternit_asbest',
    name: inhalt.werte.asbestzementEternitDachplatten,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau7,
    years: '1945 - 1969',
    composition: inhalt.werte.portlandzementMitCa10,
    application: inhalt.werte.weitVerbreiteteDacheindeckungenWellasbes,
    characteristics: inhalt.werte.extremWitterungsbeständigFrostfestUnbren,
    riskClass: 'high',
    riskDetail: inhalt.werte.freisetzungLungengängigerStarkKarzinogen,
    actionDetail: inhalt.werte.abbruchUndInstandhaltungsarbeitenUnterli
  },
  {
    id: 'asbest_rohre',
    name: inhalt.werte.asbestzementRohreDruckAbwasserleitung,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau8,
    years: '1945 - 1969',
    composition: inhalt.werte.faserzementmatrixMitCa12,
    application: inhalt.werte.kanalisationsrohreEntwässerungsleitungen,
    characteristics: inhalt.werte.extremGlatteInnenflächenHervorragende,
    riskClass: 'high',
    riskDetail: inhalt.werte.sehrHohesFreisetzungspotenzialVon,
    actionDetail: inhalt.werte.rückbauImErdreichNur
  },
  {
    id: 'glasbausteine',
    name: inhalt.werte.glasbausteineDickglasHohlkörper,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau9,
    years: '1945 - 1969',
    composition: inhalt.werte.zweiZusammengeschmolzeneHalbschalenAus,
    application: inhalt.werte.lichtbänderInTreppenhäusernFluren,
    characteristics: inhalt.werte.lichtdurchlässigAberBlickdichtBietet,
    riskClass: 'none',
    riskDetail: inhalt.werte.keineMaterialschadstoffeAusEnergetischer,
    actionDetail: inhalt.werte.beiEnergetischenSanierungenDurch
  },
  {
    id: 'plexiglas_pmma_alt',
    name: inhalt.werte.frühesPlexiglasPmmaAcrylglas,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau10,
    years: '1945 - 1969',
    composition: inhalt.werte.polymethylmethacrylatPmmaEinSynthetische,
    application: inhalt.werte.lichtkuppelnAufFlachdächernIndustrieverg,
    characteristics: inhalt.werte.sehrHoheLichttransmission92,
    riskClass: 'low',
    riskDetail: inhalt.werte.starkeVersprödungFührtZu,
    actionDetail: inhalt.werte.regelmäßigePrüfungAufTrübungen
  },
  {
    id: 'alu_profile_alt',
    name: inhalt.werte.aluminiumStrangpressprofileUngedämmt,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau11,
    years: '1945 - 1969',
    composition: inhalt.werte.aluminiumMagnesiumSiliziumLegierungen,
    application: inhalt.werte.schaufensteranlagenFensterrahmenVorhangf,
    characteristics: inhalt.werte.sehrLeichtWitterungsbeständigDurch,
    riskClass: 'low',
    riskDetail: inhalt.werte.extremeKältebrückeFührtZu,
    actionDetail: inhalt.werte.aluminiumprofileKonstruktivVonAlkalische
  },
  {
    id: 'gitterziegel_nachkrieg',
    name: inhalt.werte.früheHochlochGitterziegel,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau12,
    years: '1950 - 1975',
    composition: inhalt.werte.stranggepressterTonMitRasterförmig,
    application: inhalt.werte.tragendesUndNichttragendesAußenmauerwerk,
    characteristics: inhalt.werte.rohdichteCa10,
    riskClass: 'none',
    riskDetail: inhalt.werte.keineSchadstoffeHoheSprödigkeit,
    actionDetail: inhalt.werte.nachträglicheVerankerungenImMauerwerk
  },
  {
    id: 'schiefer_kunst_asbest',
    name: inhalt.werte.asbesthaltigerKunstschieferFassadenplatt,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau13,
    years: '1950 - 1990',
    composition: inhalt.werte.gepressterPortlandzementMitCa,
    application: inhalt.werte.schuppenbekleidungenAnGiebelnFassadenver,
    characteristics: inhalt.werte.sehrGeringePlattendickeCa,
    riskClass: 'high',
    riskDetail: inhalt.werte.starkesGefahrenpotentialDurchAllmähliche,
    actionDetail: inhalt.werte.oberflächenbearbeitungBeschichtungOderRe
  },
  {
    id: 'gipskarton_asbest_brandschutz',
    name: inhalt.werte.asbesthaltigeBrandschutzGipskartonplatte,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau14,
    years: '1960 - 1980',
    composition: inhalt.werte.gipskernUmhülltVonEiner,
    application: inhalt.werte.ummantelungVonStahlstützenHolzträgern,
    characteristics: inhalt.werte.ermöglichteExtremLeichteF30,
    riskClass: 'high',
    riskDetail: inhalt.werte.asbestfasernLiegenHierIn,
    actionDetail: inhalt.werte.sanierungUndAbbruchDürfen
  },
  {
    id: 'strohbauplatte_solomit',
    name: inhalt.werte.strohbauplattenLeichtbauplattenSolomit,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau15,
    years: '1945 - 1970',
    composition: inhalt.werte.mechanischStarkGepresstesRoggen,
    application: inhalt.werte.nichttragendeLeichteTrennwändePutzträger,
    characteristics: inhalt.werte.hervorragendeSchalldämmeigenschaftenUndG,
    riskClass: 'low',
    riskDetail: inhalt.werte.beiFeuchtigkeitsbelastungDrohenRapide,
    actionDetail: inhalt.werte.bauteileAbsolutTrockenHalten
  },
  {
    id: 'kmf_alt',
    name: inhalt.werte.künstlicheMineralfasernAltAlte,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau16,
    years: inhalt.werte.vor1996HergestelltEinbau,
    composition: inhalt.werte.synthetischHergestellteGlasigeSilikatfas,
    application: inhalt.werte.zwischensparrendämmungImDachTrittschallp,
    characteristics: inhalt.werte.gelbeGrüneOderBräunliche,
    riskClass: 'high',
    riskDetail: inhalt.werte.dieFasernWeisenEine,
    actionDetail: inhalt.werte.sanierungUndRückbauUnterliegen
  },
  {
    id: 'vinyl_asbest_flexplatten',
    name: inhalt.werte.vinylAsbestFliesenCushion,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau17,
    years: '1955 - 1985',
    composition: inhalt.werte.polyvinylchloridPvcHomogenGefüllt,
    application: inhalt.werte.fußbodenbelägeInStarkBeanspruchten,
    characteristics: inhalt.werte.extremVerschleißfestZähElastisch,
    riskClass: 'high',
    riskDetail: inhalt.werte.vinylAsbestFliesenSind,
    actionDetail: inhalt.werte.keinUnkontrolliertesHerausreißenAbschabe
  },
  {
    id: 'teer_parkettkleber_schwarz',
    name: inhalt.werte.teerPechParkettkleberSchwarzkleber,
    epochId: 'nachkrieg',
    epochLabel: inhalt.werte.nachkriegszeitWiederaufbau18,
    years: '1945 - 1970',
    composition: inhalt.werte.steinkohlenteerpechOftVermischtMit,
    application: inhalt.werte.vollflächigeVerklebungVonStabparkett,
    characteristics: inhalt.werte.pechschwarzeBisDunkelbrauneZäh,
    riskClass: 'high',
    riskDetail: inhalt.werte.enthältExtremHoheGehalte,
    actionDetail: inhalt.werte.probenahmeAufPakUnd
  },

  // --- SPÄTMODERNE & PLATTENBAU (1970-1989) ---
  {
    id: 'spannstahl_hennigsdorfer',
    name: inhalt.werte.hennigsdorferSpannstahlSt140,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau,
    years: '1970 - 1989',
    composition: inhalt.werte.ölschlussvergüteterSpannstahlSt140,
    application: inhalt.werte.spannbetonträgerHpSchalenelementeVorgefe,
    characteristics: inhalt.werte.extremHoheZugfestigkeitStreckgrenze,
    riskClass: 'high',
    riskDetail: inhalt.werte.massiveGefahrVonPlötzlichem,
    actionDetail: inhalt.werte.bauwerksprüfungUndFeuchteüberwachungBei
  },
  {
    id: 'porenbeton',
    name: inhalt.werte.porenbetonYtongPlansteineGasbeton,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau2,
    years: '1970 - 1989',
    composition: inhalt.werte.feinGemahlenerQuarzsandKalk,
    application: inhalt.werte.massivesWärmedämmendesAußenmauerwerkLeic,
    characteristics: inhalt.werte.extremLeichteVerarbeitungSägbar,
    riskClass: 'none'
  },
  {
    id: 'kalksandstein',
    name: inhalt.werte.kalksandsteinKsSichtmauerwerk,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau3,
    years: '1970 - 1989',
    composition: inhalt.werte.mischungAusKalkhydratCa,
    application: inhalt.werte.tragendeInnenwändeZweischaligesVerblendm,
    characteristics: inhalt.werte.sehrHoheRohdichteUnd,
    riskClass: 'none'
  },
  {
    id: 'gipsfaserplatten',
    name: inhalt.werte.gipsfaserplattenFermacell,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau4,
    years: '1970 - 1989',
    composition: inhalt.werte.homogenesGemischAusNaturgips,
    application: inhalt.werte.trockenbauwändeDachgeschossausbauBrandsc,
    characteristics: inhalt.werte.deutlichHöhereBiegezugfestigkeitStoßfest,
    riskClass: 'none'
  },
  {
    id: 'spannbetontraeger',
    name: inhalt.werte.spannbetonFertigteilBinder,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau5,
    years: '1970 - 1989',
    composition: inhalt.werte.hochfesterKonstruktionsbetonBewehrtMit,
    application: inhalt.werte.dachträgerFürWeitgespannteIndustriehalle,
    characteristics: inhalt.werte.ermöglichtExtremSchlankeBauteilquerschni,
    riskClass: 'low',
    riskDetail: inhalt.werte.gefahrVonSpannungsrisskorrosionBei,
    actionDetail: inhalt.werte.regelmäßigeVisuelleBauwerksprüfungRissmo
  },
  {
    id: 'magnesit_steinholz',
    name: inhalt.werte.magnesitestrichSteinholzBöden,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau6,
    years: '1970 - 1989',
    composition: inhalt.werte.kaustischesMagnesiumoxidVermischtMit,
    application: inhalt.werte.fugenloseFußbödenInIndustriehallen,
    characteristics: inhalt.werte.geringesEigengewichtElastischFußwarm,
    riskClass: 'low',
    riskDetail: inhalt.werte.beiFeuchtigkeitseinflussDissoziiertDas,
    actionDetail: inhalt.werte.trockenHaltenBeiSanierung
  },
  {
    id: 'fckw_pur_hartschaum',
    name: inhalt.werte.fckwHaltigerPurHartschaum,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau7,
    years: '1970 - 1989',
    composition: inhalt.werte.polyurethanHartschaumPurAufgeschäumt,
    application: inhalt.werte.aufdachdämmungenSteildachdämmungenFlachd,
    characteristics: inhalt.werte.sehrGuteThermischeIsolationswirkung,
    riskClass: 'medium',
    riskDetail: inhalt.werte.enthältOzonschädigendeFckwZellgase,
    actionDetail: inhalt.werte.sanierungUndAbbruchMüssen
  },
  {
    id: 'heraklith_tektalan',
    name: inhalt.werte.holzwolleMehrschichtplattenTektalan,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau8,
    years: '1970 - 1989',
    composition: inhalt.werte.dreischichtigeVerbundplatteMitBeidseitig,
    application: inhalt.werte.wärmedämmungUndSchallschutzAn,
    characteristics: inhalt.werte.hervorragendePutzhaftungMechanischHoch,
    riskClass: 'low',
    riskDetail: inhalt.werte.beiPlattenVor1990,
    actionDetail: inhalt.werte.prüfungDerKernschichtVor
  },
  {
    id: 'poroton_ziegel',
    name: inhalt.werte.porosierteHochlochziegelPoroton,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau9,
    years: inhalt.werte.seitDen1960erJahren,
    composition: inhalt.werte.feinerTonVermischtMit,
    application: inhalt.werte.monolithischesEinschaligesAußenmauerwerk,
    characteristics: inhalt.werte.niedrigeRohdichteCa0,
    riskClass: 'none',
    riskDetail: inhalt.werte.keineSchadstoffeErhöhteRissempfindlichke,
    actionDetail: inhalt.werte.putzsystemeMüssenElastischUnd
  },
  {
    id: 'urea_formal_schaum',
    name: inhalt.werte.ureaFormaldehydOrtschaumUf,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau10,
    years: '1970 - 1990',
    composition: inhalt.werte.harnstoffFormaldehydKunstharzDas,
    application: inhalt.werte.nachträglicheEinblasBzwKerndämmung,
    characteristics: inhalt.werte.sehrLeichterWeißerFeinzelliger,
    riskClass: 'medium',
    riskDetail: inhalt.werte.durchHydrolytischeSpaltungDes,
    actionDetail: inhalt.werte.raumluftMessungAufFormaldehyd
  },
  {
    id: 'bitumenwellplatte',
    name: inhalt.werte.bitumenWellplattenDachwellplatte,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau11,
    years: '1970 - 1995',
    composition: inhalt.werte.gepressteOrganischeZellstoffUnd,
    application: inhalt.werte.einfacheDacheindeckungenFürSchuppen,
    characteristics: inhalt.werte.sehrGeringesEigengewichtCa,
    riskClass: 'low',
    riskDetail: inhalt.werte.zwarAsbestfreiDochÄltere,
    actionDetail: inhalt.werte.plattenTrockenSchneidenVerboten
  },
  {
    id: 'pcb_fugendicht_thiokol',
    name: inhalt.werte.pcbHaltigeFugendichtungsmassenThiokol,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau12,
    years: '1970 - 1980',
    composition: inhalt.werte.elastischeMeistZweikomponentigeFugendich,
    application: inhalt.werte.dehnungsfugenImBetonfertigteilbauPlatten,
    characteristics: inhalt.werte.dauerelastischHervorragendAlterungsUnd,
    riskClass: 'high',
    riskDetail: inhalt.werte.pcbGastKontinuierlichAus,
    actionDetail: inhalt.werte.raumluftUndSubstanzanalysenVeranlassen
  },
  {
    id: 'pcp_lindan_holzschutz',
    name: inhalt.werte.schadstoffbelasteteHolzschutzmittelPcpLi,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau13,
    years: '1965 - 1989',
    composition: inhalt.werte.chemischeHolzschutzmittelGelöstIn,
    application: inhalt.werte.großflächigerVorbeugenderUndBekämpfender,
    characteristics: inhalt.werte.ziehtTiefInDas,
    riskClass: 'high',
    riskDetail: inhalt.werte.pcpUndLindanDunsten,
    actionDetail: inhalt.werte.hausstaubHolzUndRaumluftuntersuchung
  },
  {
    id: 'sokalit_asbest_ddr',
    name: inhalt.werte.ddrLeichtbauplattenSokalitBaufan,
    epochId: 'spaetmoderne',
    epochLabel: inhalt.werte.spätmodernePlattenbau14,
    years: '1970 - 1989',
    composition: inhalt.werte.gipsOderMineralischGebundene,
    application: inhalt.werte.ddrSystembautenZB,
    characteristics: inhalt.werte.sehrGeringeRohdichteFeuerhemmend,
    riskClass: 'high',
    riskDetail: inhalt.werte.besitztEineSchwacheBis,
    actionDetail: inhalt.werte.absolutesBohrUndBearbeitungsverbot
  },

  // --- MODERNE & ÖKOLOGISCHER WANDEL (AB 1990) ---
  {
    id: 'faserzement_modern',
    name: inhalt.werte.asbestfreieFaserzementplattenEternitNeu,
    epochId: 'moderne',
    epochLabel: inhalt.werte.moderneÖkologischerWandel,
    years: 'ab 1990',
    composition: inhalt.werte.portlandzementBewehrtMitSynthetischen,
    application: inhalt.werte.moderneVorgehängteHinterlüfteteFassaden,
    characteristics: inhalt.werte.absolutAsbestfreiGesundheitlichVöllig,
    riskClass: 'none'
  },
  {
    id: 'faserzement_rohr_neu',
    name: inhalt.werte.faserzementrohreAsbestfrei,
    epochId: 'moderne',
    epochLabel: inhalt.werte.moderneÖkologischerWandel2,
    years: 'ab 1990',
    composition: inhalt.werte.homogenesGemischAusZementleim,
    application: inhalt.werte.lüftungsleitungenAbwasserkanäleKabelschu,
    characteristics: inhalt.werte.freiVonGesundheitsgefährdendemAsbest,
    riskClass: 'none',
    riskDetail: inhalt.werte.keineSchadstoffrisikenMechanischJedoch,
    actionDetail: inhalt.werte.beimEinbauImErdreich
  },
  {
    id: 'holzweichfaser',
    name: inhalt.werte.holzweichfaserDämmplattenHfd,
    epochId: 'moderne',
    epochLabel: inhalt.werte.moderneÖkologischerWandel3,
    years: 'ab 1990',
    composition: inhalt.werte.ausNadelholzGewonnenesHolzfasergewebe,
    application: inhalt.werte.aufsparrendämmungInnendämmungVonAußenwän,
    characteristics: inhalt.werte.sehrGuterSommerlicherWärmeschutz,
    riskClass: 'none'
  },
  {
    id: 'brettsperrholz',
    name: inhalt.werte.brettsperrholzBspClt,
    epochId: 'moderne',
    epochLabel: inhalt.werte.moderneÖkologischerWandel4,
    years: 'ab 1990',
    composition: inhalt.werte.mehrschichtigRechtwinkligKreuzweiseVerkl,
    application: inhalt.werte.tragendeWandDeckenUnd,
    characteristics: inhalt.werte.extremHoheStatischeBelastbarkeit,
    riskClass: 'none'
  },
  {
    id: 'eps_daemmung',
    name: inhalt.werte.epsHartschaumplattenStyropor,
    epochId: 'moderne',
    epochLabel: inhalt.werte.moderneÖkologischerWandel5,
    years: 'ab 1990',
    composition: inhalt.werte.expandiertesPolystyrolEpsBis,
    application: inhalt.werte.wärmedämmverbundsystemeWdvsTrittschalldä,
    characteristics: inhalt.werte.sehrLeichtKostengünstigSehr,
    riskClass: 'medium',
    riskDetail: inhalt.werte.beiAltEpsPlatten,
    actionDetail: inhalt.werte.hbcdHaltigeDämmstoffeSind
  },
  {
    id: 'alu_verbundplatten',
    name: inhalt.werte.aluminiumVerbundplattenAlucobondTyp,
    epochId: 'moderne',
    epochLabel: inhalt.werte.moderneÖkologischerWandel6,
    years: 'ab 1990',
    composition: inhalt.werte.sandwichstrukturBestehendAusZwei,
    application: inhalt.werte.vorgehängteHinterlüfteteFassadenbekleidu,
    characteristics: inhalt.werte.extremPlanHervorragendesVerhältnis,
    riskClass: 'medium',
    riskDetail: inhalt.werte.fassadenplattenDerErstenGenerationen,
    actionDetail: inhalt.werte.imZugeVonSanierungen
  }
];

type Epoche = 'all' | 'vorkrieg' | 'nachkrieg' | 'spaetmoderne' | 'moderne';

/** Reiter je Epoche (Z53: Gliederung langer Module über ModuleTabs); der Zeitraum steht im Reitertitel */
const EPOCHEN_TABS: readonly ModulTab<Epoche>[] = [
  { id: 'all', label: `${inhalt.werte.alleEpochen} · Gesamtkatalog` },
  { id: 'vorkrieg', label: `${inhalt.werte.vorkriegszeitHistorisch13} · bis 1945` },
  { id: 'nachkrieg', label: `${inhalt.werte.nachkriegszeitWiederaufbau19} · ${inhalt.werte.t19451969Fokus}` },
  { id: 'spaetmoderne', label: `${inhalt.werte.spätmodernePlattenbau15} · ${inhalt.werte.t19701989Fokus}` },
  { id: 'moderne', label: `${inhalt.werte.moderneÖkoWandel} · ab 1990` },
];

export default function HistorischeBauprodukte() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEpoch, setSelectedEpoch] = useState<Epoche>('nachkrieg');

  const filteredProducts = useMemo(() => {
    return HISTORIC_PRODUCTS.filter((prod) => {
      const matchesSearch = 
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.composition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.application.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.characteristics.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEpoch = selectedEpoch === 'all' || prod.epochId === selectedEpoch;

      return matchesSearch && matchesEpoch;
    });
  }, [searchTerm, selectedEpoch]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Intro Header Card following styleguide */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 id="hist-bauprodukte-title" className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" size={24} /><MdText text={inhalt.texte.historischeBauprodukteNachEpochen} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed font-light">
          <p><MdText text={inhalt.texte.imAltbestandKonfrontierenUns} /></p>
        </div>
      </div>

      {/* Einziger Bereich: Material-Steckbriefe (AP 2.8: Überschrift statt Reiterleiste mit nur einem Reiter) */}
      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 -mb-4">
        <h3 className="px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border shadow-md bg-shiraz text-white border-shiraz">
          <BookOpen size={16} aria-hidden={true} /> Material-Steckbriefe
        </h3>
      </div>

      {/* Epoch Navigation System within Steckbriefe */}
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-5">
            
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={14} className="text-shiraz" /><MdText text={inhalt.texte.historischeEinordnungEpocheWählen} /></h3>
              <p className="text-xs text-slate-500 font-light"><MdText text={inhalt.texte.wählenSieEineEpoche} /></p>
            </div>

            {/* Reiter je Epoche (Z53: ModuleTabs); Zeitraum steht im Reiter */}
            <ModuleTabs label={inhalt.texte.historischeEinordnungEpocheWählen.trim()} tabs={EPOCHEN_TABS} aktiv={selectedEpoch} onWechsel={setSelectedEpoch} className="flex flex-col gap-5">
            <div className="flex flex-col gap-8">

            {/* Search input inside epoch panel */}
            <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder={inhalt.werte.produktInhaltsstoffeOderAnwendung}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs p-2.5 pl-9 rounded-xl border border-home-grau/30 focus:border-shiraz focus:ring-1 focus:ring-shiraz focus:outline-none bg-white text-text-main"
                />
                <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
              <div className="text-[10px] text-slate-500 font-mono italic"><MdText text={inhalt.texte.gefundeneProdukteInDieser} />{filteredProducts.length}
              </div>
            </div>

          {/* Material Steckbriefe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Informational Diagnostics banner */}
            <div className="md:col-span-2 bg-[#fcf8f2] border border-amber-100 p-4 rounded-xl flex items-start gap-3">
              <Info className="text-amber-800 shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-amber-900 leading-relaxed font-light"><MdText text={inhalt.texte.baubiologischeKonstruktiveDiagnostikIm} /><p className="mt-1"><MdText text={inhalt.texte.imZugeDesWiederaufbaus} /></p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="md:col-span-2 bg-white p-12 rounded-2xl border border-home-grau/30 text-center text-slate-400 text-xs"><MdText text={inhalt.texte.keineHistorischenBauprodukteGefunden} /></div>
            ) : (
              filteredProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 hover:shadow-md hover:border-shiraz/30 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2 border-b border-home-grau/10 pb-3">
                      <div>
                        <h3 className="font-extrabold text-text-main text-base group-hover:text-shiraz transition-colors">
                          {prod.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9px] font-mono font-bold uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {prod.epochLabel}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-shiraz bg-shiraz/5 border border-shiraz/10 px-2.5 py-1 rounded-md shrink-0">
                        {prod.years}
                      </span>
                    </div>

                    <div className="space-y-3.5 text-xs text-text-main/80 leading-relaxed font-light">
                      <p>
                        <strong className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-0.5"><MdText text={inhalt.texte.zusammensetzungInhaltsstoffe} /></strong> 
                        {prod.composition}
                      </p>
                      <p>
                        <strong className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-0.5"><MdText text={inhalt.texte.typischeEinbauorte} /></strong> 
                        {prod.application}
                      </p>
                      <p>
                        <strong className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-0.5"><MdText text={inhalt.texte.eigenschaftenGefüge} /></strong> 
                        {prod.characteristics}
                      </p>
                    </div>
                  </div>

                  {/* Conditionally display risk warning details */}
                  {prod.riskClass !== 'none' && (
                    <div className={`mt-5 p-4 rounded-xl border text-xs space-y-2 ${
                      prod.riskClass === 'high' 
                        ? 'bg-red-50/50 border-red-200/60 text-red-950' 
                        : prod.riskClass === 'medium'
                        ? 'bg-amber-50/50 border-amber-200/60 text-amber-950'
                        : 'bg-blue-50/50 border-blue-200/60 text-blue-950'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider">
                        <ShieldAlert className={prod.riskClass === 'high' ? 'text-red-700' : 'text-amber-700'} size={14} />
                        <span><MdText text={inhalt.texte.bautechnischeGefahrenRisikenSchadstoffe} /></span>
                      </div>
                      <p className="font-light leading-relaxed">{prod.riskDetail}</p>
                      
                      {prod.actionDetail && (
                        <div className="pt-2 border-t border-red-200/45">
                          <strong className="font-bold text-[10px] tracking-wider uppercase block mb-0.5"><MdText text={inhalt.texte.instandhaltungPrüfungSanierungsmethode} /></strong>
                          <p className="font-light leading-relaxed text-slate-700">{prod.actionDetail}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {prod.riskClass === 'none' && (
                    <div className="mt-5 p-3.5 bg-green-50/45 border border-green-150 text-green-950 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle className="text-green-700 shrink-0" size={14} />
                      <span className="font-light"><MdText text={inhalt.texte.klassischesBauproduktWeitgehendUnbedenkl} /></span>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
            </div>
            </ModuleTabs>
          </div>
        </div>

      {/* standard module footer conforming to styleguide */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1PcbRaumluftmessung}
        zielGleichung="c_{PCB} \;\text{vs.}\; \text{RW I} = 80 \;\text{bzw.}\; \text{RW II} = 800\,\text{ng/m}^3"
        schritte={inhalt.daten["HistorischeBauprodukte.schritte"]}
        ergebnisHinweis={inhalt.werte.fürDioxinähnlichePcbUnd}
        normQuelle={inhalt.werte.pcbRichtlinieFassungSeptember}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2BleiwerteIm}
        zielGleichung="c_{Pb} \le 10\,\mu\text{g/l}"
        schritte={inhalt.daten["HistorischeBauprodukte.schritte_2"]}
        ergebnisHinweis={inhalt.werte.ab12012028}
        normQuelle={inhalt.werte.trinkwv202317Abs}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="historische_bauprodukte" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap8} 
        wikipedia={[
          { title: 'Bimsbeton', url: 'https://de.wikipedia.org/wiki/Bims' },
          { title: 'Porenbeton', url: 'https://de.wikipedia.org/wiki/Porenbeton' },
          { title: 'Kalksandstein', url: 'https://de.wikipedia.org/wiki/Kalksandstein' },
          { title: 'Gipsfaserplatte', url: 'https://de.wikipedia.org/wiki/Gipsfaserplatte' },
          { title: 'Brettsperrholz', url: 'https://de.wikipedia.org/wiki/Brettsperrholz' },
          { title: 'Faserzement', url: 'https://de.wikipedia.org/wiki/Faserzement' },
          { title: 'Thomas-Verfahren', url: 'https://de.wikipedia.org/wiki/Thomas-Verfahren' },
          { title: 'Spannungsrisskorrosion', url: 'https://de.wikipedia.org/wiki/Spannungsrisskorrosion' },
          { title: inhalt.werte.polychlorierteBiphenyle, url: 'https://de.wikipedia.org/wiki/Polychlorierte_Biphenyle' },
          { title: 'Pentachlorphenol', url: 'https://de.wikipedia.org/wiki/Pentachlorphenol' }
        ]}
        literatur={inhalt.daten["HistorischeBauprodukte.literatur"]}
        regelwerke={inhalt.daten["HistorischeBauprodukte.regelwerke"]}
        formeln={inhalt.daten["HistorischeBauprodukte.formeln"]}
      />
    </div>
  );
}
