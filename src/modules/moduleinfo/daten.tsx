// Ausgelagert aus src/modules/ModuleInfo.tsx (AP 5.2)
import type React from 'react';
import {
  Layers,
  ClipboardCheck,
  BookOpen,
  FileText,
  Globe,
  Scale,
  FlaskConical,
  ShieldAlert,
  FileSearch,
  Microscope,
  Beaker,
  BarChart3,
  Mountain,
  LayoutGrid,
  Trees,
  Flame,
  Maximize,
  Award,
  TrendingUp,
  Monitor,
  Search,
  RefreshCw,
  Landmark,
  Compass,
  History,
  Trash2,
  Recycle,
  AlertTriangle,
  Volume2,
  Thermometer,
  Activity,
  Box,
  GitCommit,
  Droplets,
  FileCheck,
  Factory,
  FileWarning,
  TrendingDown,
  Wrench,
  GraduationCap,
  Sparkles,
  Terminal,
  Calculator,
  Waves,
  Network
} from 'lucide-react';
import inhalt from '@/content/moduleinfo/daten.json';

// Inline Custom SVG Helper Icons
export interface HilfsIconProps { size?: number | string; className?: string }
/** Lucide-Icon oder eines der Hilfs-Icons unten */
export type ModulInfoIcon = React.ComponentType<HilfsIconProps>;

export const TableIcon = (props: HilfsIconProps) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M12 3v18" />
    <path d="M3 12h18" />
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
);

export const LeafIcon = (props: HilfsIconProps) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z" />
    <path d="M9 22v-4" />
  </svg>
);

export const CircleDashedIcon = (props: HilfsIconProps) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M10.1 2.18a10 10 0 0 0-4.82 2.72" />
    <path d="M2.5 11a10 10 0 0 0 .68 4.2" />
    <path d="M5.14 19.5a10 10 0 0 0 4.18 2.62" />
    <path d="M14 21.8a10 10 0 0 0 4.3-1.6" />
    <path d="M20.2 16.2c.4-.7.8-1.5 1-2.3" />
    <path d="M21.8 10a10 10 0 0 0-1.6-4.3" />
    <path d="M17.3 3.1a10 10 0 0 0-3.3-1" />
  </svg>
);

export const QrCodeIcon = (props: HilfsIconProps) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 12h.01" />
    <path d="M16 12h.01" />
    <path d="M21 12h.01" />
    <path d="M12 16v.01" />
    <path d="M12 21v.01" />
  </svg>
);

export const Building2Icon = (props: HilfsIconProps) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
    <path d="M18 22H4" />
    <path d="M20 22h-2" />
    <path d="M14 6h2" />
    <path d="M14 10h2" />
    <path d="M14 14h2" />
    <path d="M14 18h2" />
    <path d="M8 6h2" />
    <path d="M8 10h2" />
    <path d="M8 14h2" />
    <path d="M8 18h2" />
  </svg>
);

export interface SubmoduleItem {
  title: string;
  icon: ModulInfoIcon;
  purpose: string;
  standards: string;
  useCase: string;
}

export interface GroupData {
  title: string;
  tagline: string;
  icon: ModulInfoIcon;
  basicsTitle: string;
  basicsDesc1: string;
  basicsDesc2: string;
  basicsCards: { title: string; desc: string }[];
  submodules: SubmoduleItem[];
  didacticCards: { title: string; desc: string }[];
  appStudents: string;
  appProfessionals: string;
  wikipedia: { title: string; url?: string }[];
  literatur: string[];
  regelwerke: { title: string; url?: string }[];
  formeln: { formel: string; erklaerung: string; quelle: string }[];
}

export const MODULES_DATA: Record<string, GroupData> = {
  grundlagen: {
    title: 'Bauingenieur-Grundlagen',
    tagline: inhalt.werte.mathematischePhysikalischeUndChemische,
    icon: Scale,
    basicsTitle: inhalt.werte.wissenschaftlicheSäulenDesBauingenieurwe,
    basicsDesc1: inhalt.werte.jedesBauwerkBasiertAuf,
    basicsDesc2: inhalt.werte.durchDasErfassenElementarer,
    basicsCards: inhalt.daten["MODULES_DATA.grundlagen.basicsCards"],
    submodules: [
      { title: 'Einheiten', icon: Scale, purpose: inhalt.werte.umrechnerUndErklärungenFür, standards: inhalt.werte.din13011Din, useCase: inhalt.werte.umrechnenVonPascalBar },
      { title: 'Kennwerte', icon: TableIcon, purpose: inhalt.werte.schnellübersichtCharakteristischerBausto, standards: inhalt.werte.albertAHrsgSchneider, useCase: inhalt.werte.ablesenDesElastizitätsmodulsVon },
      { title: 'Baustoffkenngrößen', icon: Layers, purpose: inhalt.werte.physikalischeKennziffernWiePorosität, standards: inhalt.werte.dinEnIso10456, useCase: inhalt.werte.bestimmungDerPorositätAus },
      { title: 'Bauchemie', icon: FlaskConical, purpose: inhalt.werte.hydratationZusatzmittelChemischeAngriffe, standards: inhalt.werte.dinEn206Din, useCase: inhalt.werte.berechnungDesKorrosionskritischenCarbona },
      { title: 'Eurocode', icon: ShieldAlert, purpose: inhalt.werte.einführungInDasSemiprobabilistische, standards: inhalt.werte.dinEn1990Eurocode, useCase: inhalt.werte.ermittlungDerMaßgebendenEinwirkungskombi },
      { title: 'Baustoffkunde', icon: Layers, purpose: inhalt.werte.systematischeKlassifikationAllerWerkstof, standards: inhalt.werte.dinEnNormengruppenWendehorst, useCase: inhalt.werte.grundlagenorientierteWerkstoffauswahlNac },
      { title: 'Regulatives', icon: Scale, purpose: inhalt.werte.übersichtÜberBaurechtlicheRegelungen, standards: inhalt.werte.baupvoEu20243110, useCase: inhalt.werte.prüfenDerNotwendigkeitEiner }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.grundlagen.didacticCards"],
    appStudents: inhalt.werte.zurVorbereitungAufKlausuren,
    appProfessionals: inhalt.werte.schnellesNachschlagenVonSicherheitsbeiwe,
    wikipedia: [
      { title: inhalt.werte.internationalesEinheitensystem, url: 'https://de.wikipedia.org/wiki/Internationales_Einheitensystem' },
      { title: 'Eurocode', url: 'https://de.wikipedia.org/wiki/Eurocode' }
    ],
    literatur: inhalt.daten["MODULES_DATA.grundlagen.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.grundlagen.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.grundlagen.formeln"]
  },
  labor: {
    title: inhalt.werte.laborSensorikAnalytik,
    tagline: inhalt.werte.praxisnahePrüfverfahrenModerneBauwerksdi,
    icon: Microscope,
    basicsTitle: inhalt.werte.qualitätssicherungDurchMesstechnischeVer,
    basicsDesc1: inhalt.werte.ingenieurbaustoffeUndBauwerkeUnterliegen,
    basicsDesc2: inhalt.werte.durchKontrollierteZerstörungBiegezug,
    basicsCards: inhalt.daten["MODULES_DATA.labor.basicsCards"],
    submodules: [
      { title: inhalt.werte.probenahmeErkundung, icon: FileSearch, purpose: inhalt.werte.repräsentativeBeprobungVonHaufwerken, standards: inhalt.werte.lagaPn98Din, useCase: inhalt.werte.planungVonBohrkernUnd },
      { title: inhalt.werte.messenPrüfen, icon: Scale, purpose: inhalt.werte.messtechnischeBegriffeKalibrierenJustier, standards: inhalt.werte.jcgm100GumIso, useCase: inhalt.werte.unsicherheitsbudgetEinerDruckprüfungUnd },
      { title: inhalt.werte.analytikDiagnostik, icon: Microscope, purpose: inhalt.werte.chemischeUndMineralogischeLaborverfahren, standards: inhalt.werte.dinEn14629Din, useCase: inhalt.werte.nachweisVonEttringitNadeln },
      { title: inhalt.werte.mechanischePrüfungen, icon: ClipboardCheck, purpose: inhalt.werte.durchführungZerstörenderFestigkeitsprüfu, standards: inhalt.werte.dinEn123903, useCase: inhalt.werte.ermittlungDer28Tage },
      { title: inhalt.werte.virtuelleVersuche, icon: Beaker, purpose: inhalt.werte.lehrsimulationenVonStandardversuchenMit, standards: inhalt.werte.dinEn12390Din, useCase: inhalt.werte.ermittlungDerSpannungsDehnungs },
      { title: inhalt.werte.statistikAuswertung, icon: BarChart3, purpose: inhalt.werte.berechnungVonVertrauensbereichenQuantilw, standards: inhalt.werte.dinEn1990Anhang, useCase: inhalt.werte.berechnungDerCharakteristischen5 },
      { title: inhalt.werte.festbetonStatistik, icon: BarChart3, purpose: inhalt.werte.interaktiveKonformitätskontrolleUndStati, standards: inhalt.werte.dinEn206Tab, useCase: inhalt.werte.prüfungDerKonformitätskriterienFür }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.labor.didacticCards"],
    appStudents: inhalt.werte.hilftStudierendenLaborpraktikaVirtuell,
    appProfessionals: inhalt.werte.unterstütztPrüfingenieureUndBetonprüfer,
    wikipedia: [
      { title: inhalt.werte.zerstörungsfreiePrüfung, url: 'https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Pr%C3%BCfung' },
      { title: 'Normalverteilung', url: 'https://de.wikipedia.org/wiki/Normalverteilung' }
    ],
    literatur: inhalt.daten["MODULES_DATA.labor.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.labor.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.labor.formeln"]
  },
  baustoffe: {
    title: inhalt.werte.baustoffkundeImDetail,
    tagline: inhalt.werte.dasGesamteSpektrumKlassischer,
    icon: Mountain,
    basicsTitle: inhalt.werte.vomNatursteinBisZum,
    basicsDesc1: inhalt.werte.dieBaustoffkundeVermitteltEin,
    basicsDesc2: inhalt.werte.wirGliedernDenStoffraum,
    basicsCards: inhalt.daten["MODULES_DATA.baustoffe.basicsCards"],
    submodules: [
      { title: 'Gesteine', icon: Mountain, purpose: inhalt.werte.eigenschaftenUndHerkunftNatürlicher, standards: inhalt.werte.dinEn12620Din, useCase: inhalt.werte.bestimmungDerFrostbeständigkeitVon },
      { title: 'Mauerwerk', icon: LayoutGrid, purpose: inhalt.werte.zusammenwirkenVonMauersteinenKalksandste, standards: inhalt.werte.dinEn1996Eurocode, useCase: inhalt.werte.berechnungDerTragfähigkeitVon },
      { title: inhalt.werte.putzeMörtel, icon: Layers, purpose: inhalt.werte.unterscheidungVonBaugipsenLuftkalk, standards: inhalt.werte.dinEn9981, useCase: inhalt.werte.auswahlDesRichtigenAußenputzes },
      { title: 'Gips', icon: Box, purpose: inhalt.werte.calciumsulfatBindemittelHalbhydratAnhydr, standards: inhalt.werte.dinEn13279, useCase: inhalt.werte.gipsputzUndEstrichauslegungMit },
      { title: 'Kalk', icon: Box, purpose: inhalt.werte.kalkkreislaufVomKalksteinÜber, standards: 'DIN EN 459', useCase: inhalt.werte.einsatzHochdiffusionsoffenerKalkmörtelIm },
      { title: 'Lehmbau', icon: Box, purpose: inhalt.werte.heutigeRenaissanceÖkologischerLehmsteine, standards: inhalt.werte.din18945Din18948, useCase: inhalt.werte.sichererEntwurfVonStampflehmbauteilen },
      { title: inhalt.werte.erdbauBöden, icon: Mountain, purpose: inhalt.werte.bodenmechanischeKlassifikationVerdichtun, standards: inhalt.werte.din18196Din18127, useCase: inhalt.werte.festlegungDesOptimalenWassergehalts },
      { title: inhalt.werte.glasImBauwesen, icon: Maximize, purpose: inhalt.werte.floatglasThermischVorgespanntesGlas, standards: inhalt.werte.din18008GlasIm, useCase: inhalt.werte.tragfähigkeitsnachweisAbsturzsichernderS },
      { title: inhalt.werte.stahlMetallbau, icon: Flame, purpose: inhalt.werte.eisenKohlenstoffDiagrammGefügebeeinfluss, standards: inhalt.werte.dinEn10025Eurocode, useCase: inhalt.werte.plastischeMomenttragfähigkeitVonS355 },
      { title: inhalt.werte.metalleNeMetalle, icon: Flame, purpose: inhalt.werte.aluminiumKupferZinkBlei, standards: inhalt.werte.dinEn485Din, useCase: inhalt.werte.vermeidungVonKontaktkorrosionZwischen },
      { title: inhalt.werte.holzHolzwerkstoffe, icon: Trees, purpose: inhalt.werte.anisotropieHolzfeuchteQuellenUnd, standards: inhalt.werte.dinEn1995Eurocode, useCase: inhalt.werte.bemessungVonBrettschichtholzträgern },
      { title: inhalt.werte.biogeneBaustoffeNawaro, icon: LeafIcon, purpose: inhalt.werte.nachwachsendeRohstoffeStrohballenbauHanf, standards: inhalt.werte.ökobaudatDibtZulassungen, useCase: inhalt.werte.ökobilanziellOptimierteHolzrahmenbauwand },
      { title: inhalt.werte.asphaltBitumen, icon: Layers, purpose: inhalt.werte.viskoelastischesVerhaltenBitumenprüfunge, standards: inhalt.werte.ztvAsphaltStbDin, useCase: inhalt.werte.optimierungVonDeckschichtenMit },
      { title: inhalt.werte.kunststoffeImBauwesen, icon: Box, purpose: inhalt.werte.thermoplasteDuroplasteElastomereFür, standards: inhalt.werte.dinEnIso1043, useCase: inhalt.werte.wahlDesGeeignetenRohrwerkstoffs },
      { title: 'Dämmstoffe', icon: Box, purpose: inhalt.werte.vergleichOrganischerAnorganischerUnd, standards: inhalt.werte.din410810Gmodg, useCase: inhalt.werte.dämmdickeFürEinenZiel },
      { title: inhalt.werte.ausbauAbdichtung, icon: Layers, purpose: inhalt.werte.bauwerksabdichtungenGegenBodenfeuchteUnd, standards: inhalt.werte.din18533Din18181, useCase: inhalt.werte.auslegungEinerZweilagigenBitumenbahnenab },
      { title: inhalt.werte.werkstoffKombinationenFaserverbund, icon: Layers, purpose: inhalt.werte.schichtenaufbautenTragenDämmenSchützen, standards: inhalt.werte.dinEn15042, useCase: inhalt.werte.auslegungUndBauphysikalischePrüfung },
      { title: inhalt.werte.sonstigeInnovationen, icon: Sparkles, purpose: inhalt.werte.phasenwechselmaterialienLeichtzuschlägeA, standards: inhalt.werte.dinEn13055Din, useCase: inhalt.werte.vakuumisolationspaneeleBeiBegrenzterAufb }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.baustoffe.didacticCards"],
    appStudents: inhalt.werte.begleitungVonBaustoffvorlesungenVom,
    appProfessionals: inhalt.werte.nachschlagewerkFürTragwerksplanungUnd,
    wikipedia: [
      { title: 'Baustoff', url: 'https://de.wikipedia.org/wiki/Baustoff' },
      { title: 'Werkstoffkunde', url: 'https://de.wikipedia.org/wiki/Werkstoffwissenschaft' }
    ],
    literatur: inhalt.daten["MODULES_DATA.baustoffe.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.baustoffe.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.baustoffe.formeln"]
  },
  bauprodukte: {
    title: inhalt.werte.bauproduktrechtSpezifikation,
    tagline: inhalt.werte.zulassungssystemeKonformitätsbewertungen,
    icon: Award,
    basicsTitle: inhalt.werte.sicherheitImHarmonisiertenEuropäischen,
    basicsDesc1: inhalt.werte.bauprodukteDürfenNurVerwendet,
    basicsDesc2: inhalt.werte.behandeltWerdenCeKennzeichnung,
    basicsCards: inhalt.daten["MODULES_DATA.bauprodukte.basicsCards"],
    submodules: [
      { title: 'Baustoffindustrie', icon: Factory, purpose: inhalt.werte.wertschöpfungskettenRohstoffgewinnungEne, standards: inhalt.werte.bbsBundesverbandBaustoffeSteine, useCase: inhalt.werte.analyseVonCo2Minderungskostenpfaden },
      { title: inhalt.werte.ceVsÜMvv, icon: Scale, purpose: inhalt.werte.abgrenzungZwischenEuropäischerBaupvo, standards: inhalt.werte.musterbauordnungMbo16b25, useCase: inhalt.werte.klärenObFürEin },
      { title: 'AVCP-Systeme', icon: ShieldAlert, purpose: inhalt.werte.aufschlüsselungDerSystemeZur, standards: inhalt.werte.baupvoEu202431102, useCase: inhalt.werte.prüfablaufFürTragendenBaustahl },
      { title: inhalt.werte.konformitätAuditierung, icon: Award, purpose: inhalt.werte.ablaufVonAuditsDurch, standards: inhalt.werte.dinEnIsoIec, useCase: inhalt.werte.vorbereitungEinerFertigteilwerksprüfungZ },
      { title: inhalt.werte.normenarbeitImBauwesen, icon: BookOpen, purpose: inhalt.werte.prozessDerNormenentwicklungCen, standards: inhalt.werte.din820Normungsarbeit, useCase: inhalt.werte.klärungDesUnterschiedsZwischen },
      { title: inhalt.werte.betonFrischFestBetonwaren, icon: Layers, purpose: inhalt.werte.spezifikationenVonTransportbetonPflaster, standards: inhalt.werte.dinEn206Din2, useCase: inhalt.werte.ausschreibungFrostTausalzbeständigerBeto },
      { title: 'Betonfertigteile', icon: Box, purpose: inhalt.werte.spannbetonHohldielenElementdeckenDoppelw, standards: inhalt.werte.dinEn1168Din, useCase: inhalt.werte.bemessungUndMontagekontrolleVon },
      { title: inhalt.werte.mauerwerkDachFassade, icon: LayoutGrid, purpose: inhalt.werte.mauersteineDachziegelBetondachsteineVorg, standards: inhalt.werte.dinEn771Din, useCase: inhalt.werte.auswahlWindlastbeständigerFassadenbeklei },
      { title: inhalt.werte.verkehrswegebauRsto1224, icon: Layers, purpose: inhalt.werte.asphalttragschichtenAsphaltbinderDecksch, standards: inhalt.werte.rsto1224Ztv, useCase: inhalt.werte.dimensionierungDesStraßenoberbausNach },
      { title: inhalt.werte.tiefbauBahnbauTunnel, icon: Mountain, purpose: inhalt.werte.kanalrohreSchachtbauwerkeGleisschotterDb, standards: inhalt.werte.dinEn1610Ztv, useCase: inhalt.werte.festlegungDerBetonzusammensetzungFür },
      { title: inhalt.werte.trockenbauPutzEstrich, icon: Layers, purpose: inhalt.werte.gipsplattenMetallständerwändeZementCalci, standards: inhalt.werte.din18180Din18560, useCase: inhalt.werte.prüfungDerBelegreifeVon },
      { title: inhalt.werte.abdichtungenDämmstoffe, icon: ShieldAlert, purpose: inhalt.werte.bitumenUndKunststoffbahnenMineralische, standards: inhalt.werte.din18531Din18535, useCase: inhalt.werte.auswahlDesAbdichtungsaufbausFür },
      { title: inhalt.werte.befestigungstechnikBauchemie, icon: Wrench, purpose: inhalt.werte.mechanischeUndChemischeDübelsysteme, standards: inhalt.werte.eotaEad330232Din, useCase: inhalt.werte.bemessungVonSchwerlastVerbundankern },
      { title: inhalt.werte.gläserFenstertechnik, icon: Maximize, purpose: inhalt.werte.floatEsgTvgUnd, standards: inhalt.werte.dinEn1279Din, useCase: inhalt.werte.wärmeschutzUndAbsturzsicherungBei },
      { title: inhalt.werte.werkstoffspezifischeProdukte, icon: Trees, purpose: inhalt.werte.spezifikationenFürVollholzBsh, standards: inhalt.werte.dinEn14080Din, useCase: inhalt.werte.überprüfungDerKonformitätsnachweiseFür }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.bauprodukte.didacticCards"],
    appStudents: inhalt.werte.einführungInDasBauproduktenrecht,
    appProfessionals: inhalt.werte.überblickFürPlanendeHerstellende,
    wikipedia: [
      { title: 'Bauproduktenverordnung', url: 'https://de.wikipedia.org/wiki/Bauproduktenverordnung' },
      { title: 'Musterbauordnung', url: 'https://de.wikipedia.org/wiki/Musterbauordnung' }
    ],
    literatur: inhalt.daten["MODULES_DATA.bauprodukte.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.bauprodukte.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.bauprodukte.formeln"]
  },
  beton: {
    title: 'Betontechnologie',
    tagline: inhalt.werte.wissenschaftlicheLeitgrundlageGefügechem,
    icon: Box,
    basicsTitle: inhalt.werte.wissenschaftlicheGrundlagenDerBetontechn,
    basicsDesc1: inhalt.werte.betontechnologieBefasstSichMit,
    basicsDesc2: inhalt.werte.zielIstEsDen,
    basicsCards: inhalt.daten["MODULES_DATA.beton.basicsCards"],
    submodules: [
      { title: 'Beton A-Z', icon: BookOpen, purpose: inhalt.werte.integriertesNachschlagewerkFürFachbegrif, standards: 'DIN EN 206', useCase: inhalt.werte.schnellesKlärenVonBegriffen },
      { title: 'Grundlagen', icon: Layers, purpose: inhalt.werte.tabellarischeÜbersichtenAllerNormativen, standards: inhalt.werte.dinEn206Din3, useCase: inhalt.werte.bestimmungVonMaxW },
      { title: 'Bindemittel', icon: Factory, purpose: inhalt.werte.chemischerAufbauKinetikUnd, standards: inhalt.werte.dinEn1971, useCase: inhalt.werte.bewertungDerPuzzolanischenReaktion },
      { title: 'Mischungsberechnung', icon: Calculator, purpose: inhalt.werte.interaktiverEntwurfsUndOptimierungsrechn, standards: 'DIN 1045-2', useCase: inhalt.werte.berechnungVonZementbedarfWasserverbrauch },
      { title: inhalt.werte.herstellungEinbau, icon: Factory, purpose: inhalt.werte.transportbetonLogistischeSteuerungVerdic, standards: inhalt.werte.dinEn13670Ztv, useCase: inhalt.werte.festlegungVonEinbauUnd },
      { title: 'Frischbeton', icon: Waves, purpose: inhalt.werte.prüfverfahrenZurFrischbetoncharakterisie, standards: inhalt.werte.dinEn12350, useCase: inhalt.werte.qualitätskontrolleAufDerBaustelle },
      { title: inhalt.werte.hydratationFolgen, icon: Network, purpose: inhalt.werte.exothermeHydratationswärmeentwicklungEig, standards: 'DAfStb-Richtlinien', useCase: inhalt.werte.ermittlungDesRissrisikosIn },
      { title: 'Nachbehandlung', icon: Droplets, purpose: inhalt.werte.auswahlDerNachbehandlungsmethodenUnd, standards: 'DIN 1045-3', useCase: inhalt.werte.ermittlungNotwendigerTageFür },
      { title: 'Festbeton', icon: Box, purpose: inhalt.werte.physikalischMechanischeEigenschaftenDes, standards: inhalt.werte.dinEn12390, useCase: inhalt.werte.nachweisDer28Tage }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.beton.didacticCards"],
    appStudents: inhalt.werte.vorbereitungAufVorlesungenKlausuren,
    appProfessionals: inhalt.werte.praxisleitfadenFürMischungsentwürfeE,
    wikipedia: [
      { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
      { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' }
    ],
    literatur: inhalt.daten["MODULES_DATA.beton.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.beton.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.beton.formeln"]
  },
  holzbau: {
    title: inhalt.werte.holzbauIngenieurholzbau,
    tagline: inhalt.werte.konstruktiverIngenieurholzbauWerkstoffke,
    icon: Trees,
    basicsTitle: inhalt.werte.wissenschaftlicheSäulenDesIngenieurholzb,
    basicsDesc1: inhalt.werte.holzIstEinNachwachsender,
    basicsDesc2: inhalt.werte.moderneHolzwerkstoffeWieBrettschichtholz,
    basicsCards: inhalt.daten["MODULES_DATA.holzbau.basicsCards"],
    submodules: [
      { title: inhalt.werte.werkstoffeDataholz, icon: Trees, purpose: inhalt.werte.charakteristischeFestigkeitenVonVollholz, standards: inhalt.werte.dinEn338En, useCase: inhalt.werte.auswahlVonLamellenUnd },
      { title: 'Konstruktionsweisen', icon: LayoutGrid, purpose: inhalt.werte.holzrahmenbauMassivholzbauCltUnd, standards: inhalt.werte.mholzbaurlInformationsdienstHolz, useCase: inhalt.werte.systementscheidungFürGeschossdeckenUnd },
      { title: inhalt.werte.bemessungEc5, icon: Calculator, purpose: inhalt.werte.stabilitätsnachweiseFürDruckstäbeUnd, standards: inhalt.werte.dinEn19951, useCase: inhalt.werte.ermittlungVonKnickbeiwertK },
      { title: inhalt.werte.verbindungenAnschlüsse, icon: GitCommit, purpose: inhalt.werte.johansenTheorieFürStabdübel, standards: inhalt.werte.dinEn199512, useCase: inhalt.werte.berechnungVonAbscherUnd },
      { title: inhalt.werte.bauphysikBrandschutz, icon: Flame, purpose: inhalt.werte.bemessungImBrandfallMit, standards: inhalt.werte.dinEn199513, useCase: inhalt.werte.nachweisDerTragfähigkeitIm }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.holzbau.didacticCards"],
    appStudents: inhalt.werte.begleitungVonHolzbauvorlesungenIm,
    appProfessionals: inhalt.werte.überblickUndRechenbeispieleFür,
    wikipedia: [
      { title: 'Holzbau', url: 'https://de.wikipedia.org/wiki/Holzbau' },
      { title: 'Brettschichtholz', url: 'https://de.wikipedia.org/wiki/Brettschichtholz' }
    ],
    literatur: inhalt.daten["MODULES_DATA.holzbau.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.holzbau.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.holzbau.formeln"]
  },
  stahlbeton: {
    title: inhalt.werte.tragwerksplanungImMassivbau,
    tagline: inhalt.werte.grenzzuständeDerTragfähigkeitUnd,
    icon: GitCommit,
    basicsTitle: inhalt.werte.dasVerbundverhaltenImMassivbau,
    basicsDesc1: inhalt.werte.derMassivbauStahlbetonSpannbeton,
    basicsDesc2: inhalt.werte.inDiesemBerechnungsUnd,
    basicsCards: inhalt.daten["MODULES_DATA.stahlbeton.basicsCards"],
    submodules: [
      { title: 'Rissbreite', icon: GitCommit, purpose: inhalt.werte.kontrolleDerRechnerischenRissbreiten, standards: inhalt.werte.dinEn19921, useCase: inhalt.werte.auslegungEinerDeckenplatteBzgl },
      { title: 'Spannung-Dehnung', icon: Activity, purpose: inhalt.werte.gegenüberstellungDerParabelRechteck, standards: inhalt.werte.dinEn199212, useCase: inhalt.werte.bestimmungDerBetondehnungAn },
      { title: 'Biegebemessung', icon: Box, purpose: inhalt.werte.querschnittsbemessungVonRechteckquerschn, standards: inhalt.werte.dinEn199213, useCase: inhalt.werte.schnittgrößenbasierteBerechnungDerTragbe },
      { title: 'Querkraftbemessung', icon: Box, purpose: inhalt.werte.tragfähigkeitsnachweisFürQuerkräfteBerec, standards: inhalt.werte.dinEn199214, useCase: inhalt.werte.nachweisDerDruckstrebenfestigkeitVrd },
      { title: 'Stützenbemessung', icon: Box, purpose: inhalt.werte.interaktionsdiagrammFürBiegungMit, standards: inhalt.werte.dinEn199215, useCase: inhalt.werte.tragfähigkeitsnachweisEinerSchlankenPend },
      { title: 'Durchstanzen', icon: CircleDashedIcon, purpose: inhalt.werte.abschätzungDesDurchstanzkriteriumsAn, standards: inhalt.werte.dinEn199216, useCase: inhalt.werte.dimensionierungEinerDurchstanzbewehrungZ },
      { title: 'Verankerungslänge', icon: GitCommit, purpose: inhalt.werte.berechnungDesGrundwertesDer, standards: inhalt.werte.dinEn199217, useCase: inhalt.werte.ermittlungDesNotwendigenÜbergreifungssto },
      { title: 'Spannbeton', icon: GitCommit, purpose: inhalt.werte.prinzipienDesVorgespanntenBetons, standards: inhalt.werte.dinEn199218, useCase: inhalt.werte.tragfähigkeitssteigerungSchlankerBrücken },
      { title: 'WU-Bauwerke', icon: Droplets, purpose: inhalt.werte.wasserundurchlässigeBetonbauteileWeißeWa, standards: inhalt.werte.dafstbWuRichtlinie, useCase: inhalt.werte.rissbreitennachweisZurErzielungVon },
      { title: 'Carbonbeton', icon: Layers, purpose: inhalt.werte.hochfesteTextileHochleistungsbewehrungen, standards: inhalt.werte.dafstbRichtlinieNichtmetallischeBewehrun, useCase: inhalt.werte.instandstellungEinerSchadhaftenFußgänger }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.stahlbeton.didacticCards"],
    appStudents: inhalt.werte.begleitetVorlesungenImMassivbau,
    appProfessionals: inhalt.werte.plausibilitätsprüfungUndVordimensionieru,
    wikipedia: [
      { title: 'Stahlbeton', url: 'https://de.wikipedia.org/wiki/Stahlbeton' },
      { title: 'Spannbeton', url: 'https://de.wikipedia.org/wiki/Spannbeton' }
    ],
    literatur: inhalt.daten["MODULES_DATA.stahlbeton.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.stahlbeton.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.stahlbeton.formeln"]
  },
  mechanik: {
    title: inhalt.werte.werkstoffmechanikFestigkeitslehre,
    tagline: inhalt.werte.deformationenFließkriterienFiniteAnsätze,
    icon: Activity,
    basicsTitle: inhalt.werte.mechanischesVerhaltenUnterBelastung,
    basicsDesc1: inhalt.werte.dasModulBehandeltDie,
    basicsDesc2: inhalt.werte.wirBetrachtenElastischeVerformung,
    basicsCards: inhalt.daten["MODULES_DATA.mechanik.basicsCards"],
    submodules: [
      { title: inhalt.werte.mechanischeKenngrößen, icon: Activity, purpose: inhalt.werte.spannungDehnungQuerdehnzahlDehn, standards: inhalt.werte.dinEnIso6892, useCase: inhalt.werte.verlängerungEinesZugstabsUnd },
      { title: 'Formänderungen', icon: Activity, purpose: inhalt.werte.lastunabhängigeUndZeitabhängigeVerformun, standards: inhalt.werte.dinEn199219, useCase: inhalt.werte.bemessungVonDehnfugenUnd },
      { title: 'Materialmodelle', icon: Activity, purpose: inhalt.werte.mathematischeModellierungVonElastoplasti, standards: inhalt.werte.dinEn1992110, useCase: inhalt.werte.einstellungElastischPlastischerVerfestig },
      { title: inhalt.werte.eModulMikromechanik, icon: Activity, purpose: inhalt.werte.ermittlungDesElastizitätsmodulsAus, standards: inhalt.werte.dinEnIso527, useCase: inhalt.werte.bestimmungDesHomogenisiertenQuer },
      { title: 'Festigkeit', icon: TrendingUp, purpose: inhalt.werte.festigkeitskennwerteImVergleichSpezifisc, standards: inhalt.werte.dinEn1992111, useCase: inhalt.werte.materialvergleichÜberDieReißlänge },
      { title: 'Baustatik', icon: Activity, purpose: inhalt.werte.auflagerkräfteUndSchnittgrößenN, standards: inhalt.werte.technischeMechanikEinwirkungenNach, useCase: inhalt.werte.momentenmaximumUnterEinzellastUnd },
      { title: inhalt.werte.knickenEuler, icon: TrendingUp, purpose: inhalt.werte.stabilitätsversagenSchlankerStäbeUnter, standards: inhalt.werte.dinEn19931, useCase: inhalt.werte.ermittlungDerKritischenEuler },
      { title: 'Bruchmechanik', icon: ShieldAlert, purpose: inhalt.werte.spannungsintensitätsfaktorenKKonzeptEner, standards: inhalt.werte.iso12737MetalleFib, useCase: inhalt.werte.abschätzungDerKritischenRisslänge },
      { title: 'Bodenmechanik', icon: Mountain, purpose: inhalt.werte.konsistenzgrenzenUndBodengruppenScherfes, standards: inhalt.werte.dinEn19971, useCase: inhalt.werte.berechnungDesAktivenErddrucks }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.mechanik.didacticCards"],
    appStudents: inhalt.werte.interaktivesRepetitoriumFürTechnische,
    appProfessionals: inhalt.werte.hilfeBeiPlausibilitätsprüfungenVon,
    wikipedia: [
      { title: 'Festigkeitslehre', url: 'https://de.wikipedia.org/wiki/Festigkeitslehre' },
      { title: 'Baustatik', url: 'https://de.wikipedia.org/wiki/Baustatik' }
    ],
    literatur: inhalt.daten["MODULES_DATA.mechanik.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.mechanik.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.mechanik.formeln"]
  },
  bauphysik: {
    title: inhalt.werte.gebäudeBauphysikBrandschutz,
    tagline: inhalt.werte.stationärerUndInstationärerWärme,
    icon: Thermometer,
    basicsTitle: inhalt.werte.behaglichkeitDauerhaftigkeitFunktionssch,
    basicsDesc1: inhalt.werte.dieBauphysikGestaltetDas,
    basicsDesc2: inhalt.werte.dieInteraktivenModuleOptimieren,
    basicsCards: inhalt.daten["MODULES_DATA.bauphysik.basicsCards"],
    submodules: [
      { title: inhalt.werte.bauphysikGrundlagen, icon: Thermometer, purpose: inhalt.werte.uWertTemperaturverlaufTemperaturfaktor, standards: inhalt.werte.dinEnIso6946, useCase: inhalt.werte.nachweisEinerGedämmtenAußenwand },
      { title: inhalt.werte.thermischeEigenschaften, icon: Flame, purpose: inhalt.werte.wärmeleitfähigkeitenDämmdickenSpezifisch, standards: inhalt.werte.din41084Din, useCase: inhalt.werte.erforderlicheDämmdickeFürDie },
      { title: inhalt.werte.feuchteschutzTauwasser, icon: Droplets, purpose: inhalt.werte.stationäreTransportrechnungVonWasserdamp, standards: inhalt.werte.din410832024, useCase: inhalt.werte.nachweisDerTauwasserfreiheitIm },
      { title: inhalt.werte.dämmungImVergleich, icon: Thermometer, purpose: inhalt.werte.vorUndNachteileVon, standards: inhalt.werte.din41083Wta, useCase: inhalt.werte.sanierungskonzeptFürEineErhaltenswerte },
      { title: 'Schallschutz', icon: Volume2, purpose: inhalt.werte.luftschalldämmungEinschaligerMassivbaute, standards: inhalt.werte.din410912, useCase: inhalt.werte.dimensionierungEinerMassivenWohnungstren },
      { title: 'Brandschutz', icon: Flame, purpose: inhalt.werte.brandverhaltenA1BisB3, standards: inhalt.werte.din4102DinEn, useCase: inhalt.werte.einordnungEinesDämmstoffsAls },
      { title: 'Energieausweis', icon: FileCheck, purpose: inhalt.werte.ermittlungVonEndUnd, standards: inhalt.werte.gmodgVormalsGegDin, useCase: inhalt.werte.erstellungDesEnergiebedarfsausweisesFür }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.bauphysik.didacticCards"],
    appStudents: inhalt.werte.unterstützungBeiBauphysikalischenÜbungen,
    appProfessionals: inhalt.werte.orientierungFürEnergieberatungArchitektu,
    wikipedia: [
      { title: 'Bauphysik', url: 'https://de.wikipedia.org/wiki/Bauphysik' },
      { title: 'Wärmedurchgangskoeffizient', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient' }
    ],
    literatur: inhalt.daten["MODULES_DATA.bauphysik.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.bauphysik.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.bauphysik.formeln"]
  },
  nachhaltigkeit: {
    title: inhalt.werte.ökologieGebäudezertifizierung,
    tagline: inhalt.werte.lebenszyklusanalysenLcaCo2Äquivalente,
    icon: Globe,
    basicsTitle: inhalt.werte.nachhaltigesBauenAlsKernkompetenz,
    basicsDesc1: inhalt.werte.dieMaterialwahlBeeinflusstDie,
    basicsDesc2: inhalt.werte.wirAnalysierenTreibhausgaspotenzialeGwp,
    basicsCards: inhalt.daten["MODULES_DATA.nachhaltigkeit.basicsCards"],
    submodules: [
      { title: inhalt.werte.datenRegeln, icon: Globe, purpose: inhalt.werte.globaleKennzahlenRechtsrahmenEpbd, standards: inhalt.werte.epbdEu20241275, useCase: inhalt.werte.prüfungObEinNeubau },
      { title: 'Materialoptimierung', icon: LeafIcon, purpose: inhalt.werte.wegeZurCo2Reduzierung, standards: inhalt.werte.dinEn15804A2, useCase: inhalt.werte.reduzierungDesCarbonFußabdrucks },
      { title: inhalt.werte.ökobilanzierungLca, icon: LeafIcon, purpose: inhalt.werte.berechnungDesTreibhausgaspotenzialsGwp, standards: inhalt.werte.dinEnIso14040, useCase: inhalt.werte.erstellungEinerÖkobilanzFür },
      { title: inhalt.werte.zertifizierungDeklarationen, icon: Award, purpose: inhalt.werte.aufbauVonUmweltproduktdeklarationenEpds, standards: inhalt.werte.iso1402414025Dgnb, useCase: inhalt.werte.heraussuchenDerPrimärenergieZahlen },
      { title: 'Kreislaufwirtschaft', icon: RefreshCw, purpose: inhalt.werte.zirkuläresBauenLanglebigkeitSortenreiner, standards: inhalt.werte.krwgEbvEsprEu, useCase: inhalt.werte.entwurfEinerSchraubbarenDemontierbaren },
      { title: inhalt.werte.ressourcenUmwelt, icon: Factory, purpose: inhalt.werte.analyseStofflicherGlobalerRessourcenents, standards: inhalt.werte.ökobaudatDinEn16449, useCase: inhalt.werte.erfassungDesPenrtVerbrauchs },
      { title: inhalt.werte.lebenszyklusKosten, icon: TrendingUp, purpose: inhalt.werte.barwertmethodeLccKünftigeErsatzinvestiti, standards: inhalt.werte.iso1568652017, useCase: inhalt.werte.berechnungDesLebenszyklusBarwertvorteils },
      { title: 'Nachhaltigkeits-Checklisten', icon: ClipboardCheck, purpose: inhalt.werte.strukturiertePrüffragenZuDgnb, standards: inhalt.werte.dgnbQngHandbücher, useCase: inhalt.werte.auditVorbereitungFürDie }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.nachhaltigkeit.didacticCards"],
    appStudents: inhalt.werte.orientierungFürIntegrierteEntwurfskonzep,
    appProfessionals: inhalt.werte.überblickFürAuditorenUnd,
    wikipedia: [
      { title: inhalt.werte.nachhaltigesBauen, url: 'https://de.wikipedia.org/wiki/Nachhaltiges_Bauen' },
      { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' }
    ],
    literatur: inhalt.daten["MODULES_DATA.nachhaltigkeit.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.nachhaltigkeit.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.nachhaltigkeit.formeln"]
  },
  digitales: {
    title: inhalt.werte.digitalisierungImBauwesen,
    tagline: inhalt.werte.buildingInformationModelingBim,
    icon: Monitor,
    basicsTitle: inhalt.werte.derDigitaleZwillingAls,
    basicsDesc1: inhalt.werte.digitaleMethodenHelfenInformationen,
    basicsDesc2: inhalt.werte.wirErfassenBimKlassen,
    basicsCards: inhalt.daten["MODULES_DATA.digitales.basicsCards"],
    submodules: [
      { title: inhalt.werte.bimFürBaustoffe, icon: Monitor, purpose: inhalt.werte.semantischeDatenanreicherungInCad, standards: inhalt.werte.iso1673912024, useCase: inhalt.werte.zuweisungEinerBrandschutzrelevantenRohdi },
      { title: 'Materialdatenbanken', icon: Search, purpose: inhalt.werte.anbindungExternerStoffdatenquellenWie, standards: inhalt.werte.ökobaudatEn15804A2, useCase: inhalt.werte.automatischerImportDerWärmeleitfähigkeit },
      { title: 'Materialpässe', icon: FileText, purpose: inhalt.werte.materialUndGebäuderessourcenpässeZ, standards: inhalt.werte.mciEllenMacarthurFoundation, useCase: inhalt.werte.berechnungDesZirkularitätsIndex },
      { title: inhalt.werte.digitalerProduktpassDpp, icon: QrCodeIcon, purpose: inhalt.werte.digitalerProduktpassDerSchrittweise, standards: inhalt.werte.verordnungEu20241781, useCase: inhalt.werte.scannenEinesBaustoffQr },
      { title: inhalt.werte.llmPraxisChatKi, icon: Terminal, purpose: inhalt.werte.effizienterEinsatzVonLlmAssistenten, standards: inhalt.werte.modelContextProtocolMcp, useCase: inhalt.werte.vorstrukturierungVonVobBedenkenhinweisen }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.digitales.didacticCards"],
    appStudents: inhalt.werte.vermitteltGrundlagenDerDigitalen,
    appProfessionals: inhalt.werte.nachschlagewerkFürBimManagement,
    wikipedia: [
      { title: inhalt.werte.buildingInformationModeling, url: 'https://de.wikipedia.org/wiki/Building_Information_Modeling' },
      { title: inhalt.werte.industrieFoundationClasses, url: 'https://de.wikipedia.org/wiki/Industry_Foundation_Classes' }
    ],
    literatur: inhalt.daten["MODULES_DATA.digitales.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.digitales.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.digitales.formeln"]
  },
  bestand: {
    title: inhalt.werte.bauenImBestandDenkmalpflege,
    tagline: inhalt.werte.altbausanierungDenkmalpflegepraxisGmodgA,
    icon: Building2Icon,
    basicsTitle: inhalt.werte.erhaltGrauerEnergieDurch,
    basicsDesc1: inhalt.werte.rundZweiDrittelDes,
    basicsDesc2: inhalt.werte.wirStellenDenAltbauatlas,
    basicsCards: inhalt.daten["MODULES_DATA.bestand.basicsCards"],
    submodules: [
      { title: 'Altbauatlas', icon: Building2Icon, purpose: inhalt.werte.klassifizierungTypischerSchadensmechanis, standards: inhalt.werte.bekanntmachungDerRegelnZur, useCase: inhalt.werte.sanierungFeuchterKellerdeckenAus },
      { title: 'Bauwerkserfassung', icon: Compass, purpose: inhalt.werte.zusammenstellungVonHandaufmaß3d, standards: inhalt.werte.ecksteinEmpfehlungenFürBaudokumentatione, useCase: inhalt.werte.erstellungEinerZentimetergenauenPunktwol },
      { title: 'Denkmalpflege', icon: Landmark, purpose: inhalt.werte.denkmalschutzgesetzlicheVorgabenReversib, standards: inhalt.werte.chartaVonVenedigWta, useCase: inhalt.werte.rekonstruktionEinesBarockenLuftkalk },
      { title: inhalt.werte.modernisierungGmodg, icon: RefreshCw, purpose: inhalt.werte.vorgabenDesGebäudemodernisierungsgesetze, standards: inhalt.werte.gmodg3537Anlage, useCase: inhalt.werte.nachweisDerWirtschaftlichkeitVon },
      { title: inhalt.werte.bauwerksdiagnoseZfpKatalog, icon: Search, purpose: inhalt.werte.systematischeVorOrtZustandserfassung, standards: inhalt.werte.dgzfpMerkblätterReiheB, useCase: inhalt.werte.zustandserfassungEinerTiefgarageUnd },
      { title: inhalt.werte.historischeKennwerte, icon: History, purpose: inhalt.werte.materialkennwerteAlterBaustoffeWie, standards: inhalt.werte.dbvMerkblätterBauenIm, useCase: inhalt.werte.tragfähigkeitsnachweisEinerIndustriehall },
      { title: inhalt.werte.historischeBauweisen, icon: BookOpen, purpose: inhalt.werte.epochenspezifischeTragsystemeWieHolzbalk, standards: inhalt.werte.wtaMerkblätterDenkmalbauArchive, useCase: inhalt.werte.ertüchtigungUndStatischeBegutachtung },
      { title: inhalt.werte.historischeBauprodukte, icon: Layers, purpose: inhalt.werte.rezepturenBrandgradeUndSchadensanfälligk, standards: inhalt.werte.historischeDinNormenarchive, useCase: inhalt.werte.identifikationVonRomanzementUnd },
      { title: 'Bestand-Checklisten', icon: ClipboardCheck, purpose: inhalt.werte.systematischeBegehungsbögenZurZustandser, standards: inhalt.werte.wtaVdi6200, useCase: inhalt.werte.strukturierteVorOrtBegehung }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.bestand.didacticCards"],
    appStudents: inhalt.werte.begleitungVonProjektarbeitenIn,
    appProfessionals: inhalt.werte.orientierungFürTragwerksplanungUnd,
    wikipedia: [
      { title: inhalt.werte.bauenImBestand, url: 'https://de.wikipedia.org/wiki/Bauen_im_Bestand' },
      { title: 'Denkmalschutz', url: 'https://de.wikipedia.org/wiki/Denkmalschutz' }
    ],
    literatur: inhalt.daten["MODULES_DATA.bestand.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.bestand.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.bestand.formeln"]
  },
  rueckbau: {
    title: inhalt.werte.rückbauAbfälleSchadstoffe,
    tagline: inhalt.werte.gefahrstoffdetektionEntsorgungswegeUrban,
    icon: Trash2,
    basicsTitle: inhalt.werte.schadstofffreieKreislaufwirtschaftImTief,
    basicsDesc1: inhalt.werte.derGeordneteRückbauHat,
    basicsDesc2: inhalt.werte.diesesModulDecktDas,
    basicsCards: inhalt.daten["MODULES_DATA.rueckbau.basicsCards"],
    submodules: [
      { title: inhalt.werte.rückbauMaterial, icon: Recycle, purpose: inhalt.werte.rückbaukonzepteVorerkundungDerAbbruchsub, standards: inhalt.werte.dinSpec914842023, useCase: inhalt.werte.ausarbeitungEinesRückbauUnd },
      { title: inhalt.werte.bodenMaterialaufbereitung, icon: Recycle, purpose: inhalt.werte.bodenwaschanlagenBrecherUndSiebtechnik, standards: inhalt.werte.ersatzbaustoffvLagaPn98, useCase: inhalt.werte.konzeptionEinerMobilenBrecheranlage },
      { title: inhalt.werte.abfälleAltlasten, icon: Trash2, purpose: inhalt.werte.zuordnungNachAbfallverzeichnisVerordnung, standards: inhalt.werte.ersatzbaustoffverordnungEbvDeponieverord, useCase: inhalt.werte.klassifizierungTeerhaltigenStraßenaufbru },
      { title: inhalt.werte.schadUndGefahrstoffe, icon: AlertTriangle, purpose: inhalt.werte.erkennungUndSanierungswegeVon, standards: inhalt.werte.gefstoffv5a11aTrgs, useCase: inhalt.werte.planungVonSchutzmaßnahmenBeim },
      { title: 'Ressourceneffizienz', icon: LeafIcon, purpose: inhalt.werte.urbanMiningMaterialkatasterZirkularitäts, standards: inhalt.werte.kreislaufwirtschaftsgesetzKrwg14Vdi, useCase: inhalt.werte.berechnungDerMassenbilanzUnd },
      { title: 'Rückbau-Checklisten', icon: ClipboardCheck, purpose: inhalt.werte.prüflistenFürSchadstofferkundungEntsorgu, standards: inhalt.werte.gewabfv8Trgs519, useCase: inhalt.werte.freigabeprotokollVorAbbruchbeginnMit }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.rueckbau.didacticCards"],
    appStudents: inhalt.werte.einführungInRückbauSchadstoffsanierung,
    appProfessionals: inhalt.werte.arbeitshilfeFürRückbauplanungEntsorgungs,
    wikipedia: [
      { title: 'Kreislaufwirtschaftsgesetz', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaftsgesetz' },
      { title: 'Asbestsanierung', url: 'https://de.wikipedia.org/wiki/Asbestsanierung' }
    ],
    literatur: inhalt.daten["MODULES_DATA.rueckbau.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.rueckbau.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.rueckbau.formeln"]
  },
  dauerhaftigkeit: {
    title: inhalt.werte.dauerhaftigkeitKorrosionschemie,
    tagline: inhalt.werte.vermeidungVonFrostTau,
    icon: ShieldAlert,
    basicsTitle: inhalt.werte.lebensdauerbegrenzendeSchädigungsprozess,
    basicsDesc1: inhalt.werte.jedesBauwerkAltertUnter,
    basicsDesc2: inhalt.werte.dasModulBehandeltWerkstoffübergreifende,
    basicsCards: inhalt.daten["MODULES_DATA.dauerhaftigkeit.basicsCards"],
    submodules: [
      { title: inhalt.werte.prinzipienKonzepte, icon: ShieldAlert, purpose: inhalt.werte.werkstoffübergreifendeSäulenKonstruktive, standards: inhalt.werte.dinEn1990Eurocode2, useCase: inhalt.werte.planungVonDauerhaftDurchlüfteten },
      { title: 'Stahlbeton-Karbonatisierung', icon: ShieldAlert, purpose: inhalt.werte.quadratischesZeitgesetzDesCo, standards: inhalt.werte.dinEn2062021, useCase: inhalt.werte.sollIstAbgleichDer },
      { title: inhalt.werte.betonkorrosiveSchadensbilder, icon: ShieldAlert, purpose: inhalt.werte.innereUndÄußereTreibprozesse, standards: inhalt.werte.dafstbAlkaliRichtlinie2013, useCase: inhalt.werte.auswahlEinesSehrDichten },
      { title: inhalt.werte.korrosionDerMetalle, icon: ShieldAlert, purpose: inhalt.werte.anodischeUndKathodischeRedoxvorgänge, standards: inhalt.werte.dinEnIso12944, useCase: inhalt.werte.bimetallVerträglichkeitsbewertungVonVerb },
      { title: inhalt.werte.holzbiologischerAbbau, icon: ShieldAlert, purpose: inhalt.werte.physiologischerBefallDurchHolzzerstörend, standards: inhalt.werte.din688001Bis, useCase: inhalt.werte.bestimmungDerPassendenKernholzart },
      { title: 'Asphalt-Viskoelastizität', icon: ShieldAlert, purpose: inhalt.werte.oxidativeAlterungsprozesseAsphalteneErhö, standards: inhalt.werte.ztvAsphaltStbTl, useCase: inhalt.werte.einsatzPolymerModifizierterElastomerbitu },
      { title: inhalt.werte.spannungsrisseInPolymeren, icon: ShieldAlert, purpose: inhalt.werte.physikalischeUndChemischeAlterung, standards: inhalt.werte.isoRandspezifikationenDvsRichtlinien, useCase: inhalt.werte.auslegungUndKonstruktiveTrennung },
      { title: inhalt.werte.natursteinMauerwerkserhalt, icon: ShieldAlert, purpose: inhalt.werte.kryptofloreszenzSalzkristallisationUnter, standards: inhalt.werte.wtaMerkblätterWissenschaftlichTechnische, useCase: inhalt.werte.konzeptionVonMakroporösenSanierputzsyste },
      { title: inhalt.werte.esgGlasbruchHydrolyse, icon: ShieldAlert, purpose: inhalt.werte.glaskorrosionDurchStehendeNässe, standards: inhalt.werte.dinEn14179Din, useCase: inhalt.werte.ausschreibungUndQualitätssicherungDes },
      { title: 'Dauerhaftigkeit-Checklisten', icon: ClipboardCheck, purpose: inhalt.werte.systematischePrüflistenZuExpositionsklas, standards: inhalt.werte.dinEn1990Din, useCase: inhalt.werte.dauerhaftigkeitsAuditInDer }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.dauerhaftigkeit.didacticCards"],
    appStudents: inhalt.werte.vorbereitungAufVertiefungsprüfungenIn,
    appProfessionals: inhalt.werte.wissensbasisFürGutachtenTragwerks,
    wikipedia: [
      { title: 'Korrosion', url: 'https://de.wikipedia.org/wiki/Korrosion' },
      { title: 'Passivierung', url: 'https://de.wikipedia.org/wiki/Passivierung' },
      { title: 'Alkali-Kieselsäure-Reaktion', url: 'https://de.wikipedia.org/wiki/Alkali-Kiesels%C3%A4ure-Reaktion' },
      { title: 'Holzschutz', url: 'https://de.wikipedia.org/wiki/Holzschutz' }
    ],
    literatur: inhalt.daten["MODULES_DATA.dauerhaftigkeit.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.dauerhaftigkeit.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.dauerhaftigkeit.formeln"]
  },
  schaeden: {
    title: inhalt.werte.mängelSchädenImBauwesen,
    tagline: inhalt.werte.mängelUndSchadensursachenSystematisch,
    icon: FileWarning,
    basicsTitle: inhalt.werte.wissenschaftlicheMängelUndSchadensanalys,
    basicsDesc1: inhalt.werte.planungsfehlerAusführungsmängelOderÜberm,
    basicsDesc2: inhalt.werte.wirBehandelnBaurechtlichePflichten,
    basicsCards: inhalt.daten["MODULES_DATA.schaeden.basicsCards"],
    submodules: [
      { title: inhalt.werte.rechtGrundlagen, icon: FileWarning, purpose: inhalt.werte.rechtlicheEinordnungVonBaumängeln, standards: inhalt.werte.vobB13Mängelansprüche, useCase: inhalt.werte.durchführungEinerMangelfreienBeweissiche },
      { title: inhalt.werte.typischeBauschädenMängel, icon: TrendingDown, purpose: inhalt.werte.systematischerSchadensUndMängelatlas, standards: 'Bauschadens-Kataloge', useCase: inhalt.werte.ursachenermittlungBeiSchrägenRissen },
      { title: inhalt.werte.tragwerksmonitoringSensorikShm, icon: Activity, purpose: inhalt.werte.kontinuierlicheSchwingungsUndVerformungs, standards: inhalt.werte.vdi6200Din1076, useCase: inhalt.werte.messtechnischeRissbreitenüberwachungLvdt },
      { title: inhalt.werte.zustandsbewertungVdi6200, icon: ClipboardCheck, purpose: inhalt.werte.überprüfungBestehenderTragwerkeNach, standards: inhalt.werte.vdi6200Vdi6200, useCase: inhalt.werte.vorbereitungDerRegelmäßigenSichtprüfung },
      { title: inhalt.werte.großeMaterialschädenEinstürze, icon: AlertTriangle, purpose: inhalt.werte.forensischeFallstudienHistorischerKatast, standards: inhalt.werte.dafstbAlkaliRichtlinieVdi, useCase: inhalt.werte.analyseWerkstoffbedingterEinsturzursache },
      { title: inhalt.werte.mängelSchadensChecklisten, icon: FileText, purpose: inhalt.werte.strukturierteErfassungsbögenUndPrüfliste, standards: inhalt.werte.vdi6200VobB, useCase: inhalt.werte.beweissicherndeDokumentationVonMängeln }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.schaeden.didacticCards"],
    appStudents: inhalt.werte.einführungInDieArbeit,
    appProfessionals: inhalt.werte.digitalerLeitfadenFürBausachverständige,
    wikipedia: [
      { title: 'Bauschaden', url: 'https://de.wikipedia.org/wiki/Bauschaden' },
      { title: inhalt.werte.baustatischePrüfung, url: 'https://de.wikipedia.org/wiki/Pr%C3%BCfingenieur_f%C3%BCr_Baustatik' }
    ],
    literatur: inhalt.daten["MODULES_DATA.schaeden.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.schaeden.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.schaeden.formeln"]
  },
  instandsetzung: {
    title: inhalt.werte.schutzInstandsetzung,
    tagline: inhalt.werte.bauwerkserhaltungSchutzprinzipienNachDin,
    icon: Wrench,
    basicsTitle: inhalt.werte.dauerhafteBauwerkserhaltungSanierungstec,
    basicsDesc1: inhalt.werte.bestehendeBausubstanzZuSchützen,
    basicsDesc2: inhalt.werte.vomNormativenInstandsetzungsrahmenNach,
    basicsCards: inhalt.daten["MODULES_DATA.instandsetzung.basicsCards"],
    submodules: [
      { title: inhalt.werte.schutzInstandsGrundlagen, icon: Layers, purpose: inhalt.werte.europäischeInstandsetzungsprinzipienPass, standards: inhalt.werte.dinEn15049, useCase: inhalt.werte.festlegungDesSanierungsprinzipsW },
      { title: inhalt.werte.instandsetzungNachMaterial, icon: Trees, purpose: inhalt.werte.werkstoffspezifischerSchutzUndReparatur, standards: inhalt.werte.din68800Iso12944, useCase: inhalt.werte.planungVonHolzprothesenAn },
      { title: 'Stahlbetoninstandhaltung', icon: Wrench, purpose: inhalt.werte.instandsetzungskonzepteUntergrundvorbere, standards: inhalt.werte.trInstandhaltungDibtNachfolgerin, useCase: inhalt.werte.ausschreibungVonPccMörtel },
      { title: inhalt.werte.bauwerksabdichtungInjektion, icon: Droplets, purpose: inhalt.werte.nachträglicheBauwerksabdichtungErdberühr, standards: inhalt.werte.din18533DinEn, useCase: inhalt.werte.sanierungEinerFeuchtenTiefgaragen },
      { title: 'WTA-Merkblätter', icon: FileText, purpose: inhalt.werte.richtlinienZurMauerwerksinstandsetzungSa, standards: inhalt.werte.wtaMerkblätter29, useCase: inhalt.werte.vorgabeDerHorizontalsperrendosierungNach },
      { title: 'Instandsetzungs-Checklisten', icon: ClipboardCheck, purpose: inhalt.werte.prüfformulareFürSachkundigePlaner, standards: inhalt.werte.trInstandhaltungDinEn, useCase: inhalt.werte.überprüfungDerMattfeuchteUnd }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.instandsetzung.didacticCards"],
    appStudents: inhalt.werte.vermitteltGrundlagenFürDie,
    appProfessionals: inhalt.werte.praxisleitfadenFürSachkundigePlaner,
    wikipedia: [
      { title: 'Betoninstandsetzung', url: 'https://de.wikipedia.org/wiki/Betoninstandsetzung' },
      { title: 'Korrosionsschutz', url: 'https://de.wikipedia.org/wiki/Korrosionsschutz' },
      { title: 'Holzschutz', url: 'https://de.wikipedia.org/wiki/Holzschutz' }
    ],
    literatur: inhalt.daten["MODULES_DATA.instandsetzung.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.instandsetzung.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.instandsetzung.formeln"]
  },
  praxiswissen: {
    title: inhalt.werte.baubetriebKalkulationKarriere,
    tagline: inhalt.werte.ausschreibungenBauleitungVorOrt,
    icon: Wrench,
    basicsTitle: inhalt.werte.erfolgreichesUmsetzenAufBaustelle,
    basicsDesc1: inhalt.werte.einDetailMussWirtschaftlich,
    basicsDesc2: inhalt.werte.wirVermittelnKenntnisseZur,
    basicsCards: inhalt.daten["MODULES_DATA.praxiswissen.basicsCards"],
    submodules: [
      { title: inhalt.werte.planungAusschreibung, icon: ClipboardCheck, purpose: inhalt.werte.erstellungVonLeistungsverzeichnissenLv, standards: inhalt.werte.vobAAusschreibungsordnung, useCase: inhalt.werte.verfassenEinerFehlerfreienVob },
      { title: inhalt.werte.bauleitungBaustelle, icon: Wrench, purpose: inhalt.werte.bautagebuchFührenBauablaufsteuerungAbnah, standards: inhalt.werte.vobBAusführungArbschg, useCase: inhalt.werte.durchführungEinerFörmlichenMängelrüge },
      { title: 'Bautagebuch', icon: ClipboardCheck, purpose: inhalt.werte.rechtlichBelastbareBaubetrieblicheDokume, standards: inhalt.werte.hoai2021Anlage10, useCase: inhalt.werte.dokumentationVonSchlechtwetterereignisse },
      { title: inhalt.werte.produktherstellungQs, icon: Factory, purpose: inhalt.werte.abläufeInZementBeton, standards: inhalt.werte.dinEn206Din4, useCase: inhalt.werte.optimierungDesVerdichtungszyklusIn },
      { title: inhalt.werte.karrierestartSoftSkills, icon: GraduationCap, purpose: inhalt.werte.tippsZumBerufseinstiegIn, standards: inhalt.werte.baukagBayernFortbildungsordnungDer, useCase: inhalt.werte.vorbereitungAufDieAufnahme },
      { title: inhalt.werte.weiterbildungAnDerTha, icon: Award, purpose: inhalt.werte.masterUndZertifikatsprogrammeAn, standards: inhalt.werte.akkreditierungsratDqrStufe7, useCase: inhalt.werte.berufsbegleitendeWeiterbildungImProjektm },
      { title: inhalt.werte.studiumAnDerTha, icon: GraduationCap, purpose: inhalt.werte.studiengängeBauingenieurwesenEnergieeffi, standards: inhalt.werte.modulhandbücherTha, useCase: inhalt.werte.orientierungFürStudieninteressierteUnd },
      { title: inhalt.werte.thesenForschungsprojekte, icon: BookOpen, purpose: inhalt.werte.themenkatalogeFürBachelorUnd, standards: inhalt.werte.wissenschaftlicheRichtlinien, useCase: inhalt.werte.findungEinesPraxisrelevantenThemas },
      { title: inhalt.werte.kuriositätenFundstücke, icon: Sparkles, purpose: inhalt.werte.ungewöhnlicheBaustoffphänomeneHistorisch, standards: 'Baustoff-Fachgeschichte', useCase: inhalt.werte.anschaulichesLehrbeispielÜberRömischen }
    ],
    didacticCards: inhalt.daten["MODULES_DATA.praxiswissen.didacticCards"],
    appStudents: inhalt.werte.bereitetAufDenBaustellenalltag,
    appProfessionals: inhalt.werte.orientierungFürBerufseinsteigendeIn,
    wikipedia: [
      { title: inhalt.werte.vergabeUndVertragsordnungFür, url: 'https://de.wikipedia.org/wiki/Vergabe-_und_Vertragsordnung_f%C3%BCr_Bauleistungen' },
      { title: 'Bauleitung', url: 'https://de.wikipedia.org/wiki/Bauleitung' }
    ],
    literatur: inhalt.daten["MODULES_DATA.praxiswissen.literatur"],
    regelwerke: inhalt.daten["MODULES_DATA.praxiswissen.regelwerke"],
    formeln: inhalt.daten["MODULES_DATA.praxiswissen.formeln"]
  }
};
