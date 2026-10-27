// Inhaltsbereich: ordnet jeder Modul-ID (src/registry/modules.ts) die darzustellende
// Komponente zu. Alle Fachmodule werden per React.lazy nachgeladen (Phase 5, AP 5.2/5.4).
// Die Strings '<modul-id>' müssen hier auffindbar bleiben (tests/registry.test.ts).
// `React.lazy` hier = lazySofort (Vorladen ohne Platzhalter für vorgerenderte Seiten, Z52)
import { SofortReact as React } from './sofortLaden';
import type { TabId } from '../contexts/TabContext';

// Lazy loaded modules
const SommerlicherWaermeschutz = React.lazy(() => import('../modules/SommerlicherWaermeschutz'));
const MembranenETFE = React.lazy(() => import('../modules/MembranenETFE'));
const KorrosionsschutzBeschichtungen = React.lazy(() => import('../modules/KorrosionsschutzBeschichtungen'));
const KeramikZiegel = React.lazy(() => import('../modules/KeramikZiegel'));
const StahlbauEC3 = React.lazy(() => import('../modules/StahlbauEC3'));
const Vorlesungen = React.lazy(() => import('../modules/Vorlesungen'));
const Lehrveranstaltungen = React.lazy(() => import('../modules/Lehrveranstaltungen'));
const NachhaltigkeitDatenRegeln = React.lazy(() => import('../modules/NachhaltigkeitDatenRegeln'));
const OekobilanzLCA = React.lazy(() => import('../modules/OekobilanzLCA'));
const ZertifizierungSiegel = React.lazy(() => import('../modules/ZertifizierungSiegel'));
const LebenszyklusKosten = React.lazy(() => import('../modules/LebenszyklusKosten'));
const RessourcenUmwelt = React.lazy(() => import('../modules/RessourcenUmwelt'));
const Kreislaufwirtschaft = React.lazy(() => import('../modules/Kreislaufwirtschaft'));
const BimBaustoffe = React.lazy(() => import('../modules/BimBaustoffe'));
const Materialdatenbanken = React.lazy(() => import('../modules/Materialdatenbanken'));
const Materialpaesse = React.lazy(() => import('../modules/Materialpaesse'));
const DppEpd = React.lazy(() => import('../modules/DppEpd'));
const KiBaustoffe = React.lazy(() => import('../modules/KiBaustoffe'));
const KiUebungen = React.lazy(() => import('../modules/KiUebungen'));
const Beispielrechnungen = React.lazy(() => import('../modules/Beispielrechnungen'));
const Startseite = React.lazy(() => import('../modules/Startseite'));
const Admin = React.lazy(() => import('../modules/Admin'));
const Anleitung = React.lazy(() => import('../modules/Anleitung'));
const Modulstruktur = React.lazy(() => import('../modules/Modulstruktur'));
const Feedback = React.lazy(() => import('../modules/Feedback'));
const Frischbeton = React.lazy(() => import('../modules/Frischbeton'));
const FestbetonStatistik = React.lazy(() => import('../modules/FestbetonStatistik'));
const Sicherheitskonzept = React.lazy(() => import('../modules/Sicherheitskonzept'));
const Qualitaetssicherung = React.lazy(() => import('../modules/Qualitaetssicherung'));
const Betonpraxis = React.lazy(() => import('../modules/Betonpraxis'));
const Expositionsklassen = React.lazy(() => import('../modules/Expositionsklassen'));
const Korrosion = React.lazy(() => import('../modules/Korrosion'));
const SpannungDehnung = React.lazy(() => import('../modules/SpannungDehnung'));
const Holz = React.lazy(() => import('../modules/Holz'));
const Hydratation = React.lazy(() => import('../modules/Hydratation'));
const IntegrationVerformungen = React.lazy(() => import('../modules/IntegrationVerformungen'));
const KriechenSchwinden = React.lazy(() => import('../modules/KriechenSchwinden'));
const Rissbreite = React.lazy(() => import('../modules/Rissbreite'));
const Nachbehandlung = React.lazy(() => import('../modules/Nachbehandlung'));
const Festbeton = React.lazy(() => import('../modules/Festbeton'));
const Betonkennwerte = React.lazy(() => import('../modules/Betonkennwerte'));
const Materialkennwerte = React.lazy(() => import('../modules/Materialkennwerte'));
const Regularien = React.lazy(() => import('../modules/Regularien'));
const Festigkeitsberechnungen = React.lazy(() => import('../modules/Festigkeitsberechnungen'));
const Mauerwerk = React.lazy(() => import('../modules/Mauerwerk'));
const Erdbau = React.lazy(() => import('../modules/Erdbau'));
const Glas = React.lazy(() => import('../modules/Glas'));
const Bauphysik = React.lazy(() => import('../modules/Bauphysik'));
const Schallschutz = React.lazy(() => import('../modules/Schallschutz'));
const Grundlagen = React.lazy(() => import('../modules/Grundlagen'));
const BetonInfo = React.lazy(() => import('../modules/BetonInfo'));
const ModuleInfo = React.lazy(() => import('../modules/ModuleInfo'));
const BetonAZ = React.lazy(() => import('../modules/BetonAZ'));
const Bindemittel = React.lazy(() => import('../modules/Bindemittel'));
const Mischungsberechnung = React.lazy(() => import('../modules/Mischungsberechnung'));
const ZfP = React.lazy(() => import('../modules/ZfP'));
const HistorischeMaterialkennwerte = React.lazy(() => import('../modules/HistorischeMaterialkennwerte'));
const HistorischeBauweisen = React.lazy(() => import('../modules/HistorischeBauweisen'));
const HistorischeBauprodukte = React.lazy(() => import('../modules/HistorischeBauprodukte'));
const Stahlbetoninstandhaltung = React.lazy(() => import('../modules/Stahlbetoninstandhaltung').then(module => ({ default: module.Stahlbetoninstandhaltung })));
const Asphalt = React.lazy(() => import('../modules/Asphalt'));
const MaterialitaetArchitektur = React.lazy(() => import('../modules/MaterialitaetArchitektur'));
const Kombinationen = React.lazy(() => import('../modules/Kombinationen'));
const Lehm = React.lazy(() => import('../modules/Lehm'));
const BpLehmbauprodukte = React.lazy(() => import('../modules/BpLehmbauprodukte'));
const BpBaustoffindustrie = React.lazy(() => import('../modules/BpBaustoffindustrie'));
const BpInnovationen = React.lazy(() => import('../modules/BpInnovationen'));
const Kunststoffe = React.lazy(() => import('../modules/Kunststoffe'));
const Brandschutz = React.lazy(() => import('../modules/Brandschutz'));
const Energieausweis = React.lazy(() => import('../modules/Energieausweis'));
const Bruchmechanik = React.lazy(() => import('../modules/Bruchmechanik'));
const SchadreaktionenBeton = React.lazy(() => import('../modules/SchadreaktionenBeton'));
const ZwangCalculator = React.lazy(() => import('../modules/Zwang').then(module => ({ default: module.ZwangCalculator })));
const Eigenspannungen = React.lazy(() => import('../modules/Eigenspannungen'));
const Recyclingbeton = React.lazy(() => import('../modules/Recyclingbeton'));
const Bodenmechanik = React.lazy(() => import('../modules/Bodenmechanik'));
const WUBauwerke = React.lazy(() => import('../modules/WUBauwerke'));
const Baustatik = React.lazy(() => import('../modules/Baustatik'));
const Knicken = React.lazy(() => import('../modules/Knicken'));
const MechanischeKenngroessen = React.lazy(() => import('../modules/MechanischeKenngroessen'));
const HydratationFolgen = React.lazy(() => import('../modules/HydratationFolgen'));
const Sonderbetone = React.lazy(() => import('../modules/Sonderbetone'));
const Stahlbetonbemessung = React.lazy(() => import('../modules/Stahlbetonbemessung'));
const ForschungTransfer = React.lazy(() => import('../modules/ForschungTransfer'));
const Impressum = React.lazy(() => import('../modules/Impressum'));
const Versionen = React.lazy(() => import('../modules/Versionen'));
const Bauchemie = React.lazy(() => import('../modules/Bauchemie').then(module => ({ default: module.Bauchemie })));
const Aufgaben = React.lazy(() => import('../modules/Aufgaben'));
const Praxisbeispiele = React.lazy(() => import('../modules/Praxisbeispiele'));
const EModul = React.lazy(() => import('../modules/EModul'));
const Carbonbeton = React.lazy(() => import('../modules/Carbonbeton'));
const Waermeeigenschaften = React.lazy(() => import('../modules/Waermeeigenschaften'));
const Spannbeton = React.lazy(() => import('../modules/Spannbeton'));
const Stahl = React.lazy(() => import('../modules/Stahl'));
const BpStahlbauprofile = React.lazy(() => import('../modules/BpStahlbauprofile'));
const Glossar = React.lazy(() => import('../modules/Glossar'));
const Dauerhaftigkeit = React.lazy(() => import('../modules/Dauerhaftigkeit'));
const Holzkorrosion = React.lazy(() => import('../modules/Holzkorrosion'));
const Metallkorrosion = React.lazy(() => import('../modules/Metallkorrosion'));
const WeitereOrganik = React.lazy(() => import('../modules/WeitereOrganik'));
const Schadstoffe = React.lazy(() => import('../modules/Schadstoffe'));
const AltholzUrbanMining = React.lazy(() => import('../modules/AltholzUrbanMining'));
const PfasBaustoffe = React.lazy(() => import('../modules/PfasBaustoffe'));
const Ressourceneffizienz = React.lazy(() => import('../modules/Ressourceneffizienz'));
const BodenMaterialAufbereitung = React.lazy(() => import('../modules/BodenMaterialAufbereitung'));
const Abfaelle = React.lazy(() => import('../modules/Abfaelle'));
const Materialoptimierung = React.lazy(() => import('../modules/Materialoptimierung'));
const NachhaltigkeitChecklisten = React.lazy(() => import('../modules/NachhaltigkeitChecklisten'));
const Rueckbau = React.lazy(() => import('../modules/Rueckbau'));
const RueckbauChecklisten = React.lazy(() => import('../modules/RueckbauChecklisten'));
const BestandChecklisten = React.lazy(() => import('../modules/BestandChecklisten'));
const DauerhaftigkeitChecklisten = React.lazy(() => import('../modules/DauerhaftigkeitChecklisten'));
const SchaedenChecklisten = React.lazy(() => import('../modules/SchaedenChecklisten'));
const SchutzGrundlagen = React.lazy(() => import('../modules/SchutzGrundlagen'));
const InstandsetzungMaterialien = React.lazy(() => import('../modules/InstandsetzungMaterialien'));
const InstandsetzungChecklisten = React.lazy(() => import('../modules/InstandsetzungChecklisten'));
const Zustandsbewertung = React.lazy(() => import('../modules/Zustandsbewertung'));
const WTA = React.lazy(() => import('../modules/WTA'));
const Denkmalpflege = React.lazy(() => import('../modules/Denkmalpflege'));
const Modernisierung = React.lazy(() => import('../modules/Modernisierung'));
const Bestand = React.lazy(() => import('../modules/Bestand'));
const Bauwerkserfassung = React.lazy(() => import('../modules/Bauwerkserfassung'));
const Informationsquellen = React.lazy(() => import('../modules/Informationsquellen'));
const Fortbildungen = React.lazy(() => import('../modules/Fortbildungen'));
const Feuchteschutz = React.lazy(() => import('../modules/Feuchteschutz'));
const Bauwerksuntersuchung = React.lazy(() => import('../modules/Bauwerksuntersuchung'));
const Bauwerksunters_Monitoring = React.lazy(() => import('../modules/Bauwerksunters_Monitoring'));
const Metalle = React.lazy(() => import('../modules/Metalle'));
const Ausbau = React.lazy(() => import('../modules/Ausbau'));
const Innenausbau = React.lazy(() => import('../modules/Innenausbau'));
const BpTrockenbau = React.lazy(() => import('../modules/BpTrockenbau'));
const BpMauerwerk = React.lazy(() => import('../modules/BpMauerwerk'));
const BpVerkehrswegebau = React.lazy(() => import('../modules/BpVerkehrswegebau'));
const BpBeton = React.lazy(() => import('../modules/BpBeton'));
const BpBetonfertigteile = React.lazy(() => import('../modules/BpBetonfertigteile'));
const BpBetonwaren = React.lazy(() => import('../modules/BpBetonwaren'));
const BpAbdichtung = React.lazy(() => import('../modules/BpAbdichtung'));
const BpDaemmung = React.lazy(() => import('../modules/BpDaemmung'));
const BpPutzEstrich = React.lazy(() => import('../modules/BpPutzEstrich'));
const BpHolzprodukte = React.lazy(() => import('../modules/BpHolzprodukte'));
const BpDachFassade = React.lazy(() => import('../modules/BpDachFassade'));
const BpBefestigung = React.lazy(() => import('../modules/BpBefestigung'));
const BpKunststoffe = React.lazy(() => import('../modules/BpKunststoffe'));
const BpKlebstoffe = React.lazy(() => import('../modules/BpKlebstoffe'));
const BpFarbenLacke = React.lazy(() => import('../modules/BpFarbenLacke'));
const BpMineralisch = React.lazy(() => import('../modules/BpMineralisch'));
const BpGlaeser = React.lazy(() => import('../modules/BpGlaeser'));
const BpMetallisch = React.lazy(() => import('../modules/BpMetallisch'));
const BpBetonzusatzmittel = React.lazy(() => import('../modules/BpBetonzusatzmittel'));
const BpRechtliches = React.lazy(() => import('../modules/BpRechtliches'));
const HerstellungEinbau = React.lazy(() => import('../modules/HerstellungEinbau'));
const Sichtbeton = React.lazy(() => import('../modules/Sichtbeton'));
const Labor = React.lazy(() => import('../modules/Labor'));
const MechanischePruefungen = React.lazy(() => import('../modules/MechanischePruefungen'));
const MessenPruefen = React.lazy(() => import('../modules/MessenPruefen'));
const Analytik = React.lazy(() => import('../modules/Analytik'));
const Probenahme = React.lazy(() => import('../modules/Probenahme'));
const Bauschaeden = React.lazy(() => import('../modules/Bauschaeden'));
const TypischeBauschaeden = React.lazy(() => import('../modules/TypischeBauschaeden'));
const MaterialSchaedenGross = React.lazy(() => import('../modules/MaterialSchaedenGross'));
const Statistik = React.lazy(() => import('../modules/Statistik'));
const Literatur = React.lazy(() => import('../modules/Literatur'));
const Baustoffkunde = React.lazy(() => import('../modules/Baustoffkunde'));
const Baustoffkenngroessen = React.lazy(() => import('../modules/Baustoffkenngroessen'));
const Leichtbeton = React.lazy(() => import('../modules/Leichtbeton'));
const Spritzbeton = React.lazy(() => import('../modules/Spritzbeton'));
const Einheiten = React.lazy(() => import('../modules/Einheiten'));
const Holzwerkstoffe = React.lazy(() => import('../modules/Holzwerkstoffe'));
const Materialmodelle = React.lazy(() => import('../modules/Materialmodelle'));
const PutzeMoertel = React.lazy(() => import('../modules/PutzeMoertel'));
const Gesteine = React.lazy(() => import('../modules/Gesteine'));
const Sonstiges = React.lazy(() => import('../modules/Sonstiges'));
const Gips = React.lazy(() => import('../modules/Gips'));
const Kalk = React.lazy(() => import('../modules/Kalk'));
const Daemmstoffe = React.lazy(() => import('../modules/Daemmstoffe'));
const Software = React.lazy(() => import('../modules/Software'));
const OnlineTools = React.lazy(() => import('../modules/OnlineTools'));
const Formaenderungen = React.lazy(() => import('../modules/Formaenderungen'));
const DaemmungVergleich = React.lazy(() => import('../modules/DaemmungVergleich'));
const InnovativeWerkstoffe = React.lazy(() => import('../modules/InnovativeWerkstoffe'));
const Biokohlebeton = React.lazy(() => import('../modules/Biokohlebeton'));
const Schnellkarbonatisierung = React.lazy(() => import('../modules/Schnellkarbonatisierung'));
const Lebensdauerbemessung = React.lazy(() => import('../modules/Lebensdauerbemessung'));
const NormenAusblick = React.lazy(() => import('../modules/NormenAusblick'));
const Praxiswissen = React.lazy(() => import('../modules/Praxiswissen'));
const Bautagebuch = React.lazy(() => import('../modules/Bautagebuch'));
const WeiterTHA = React.lazy(() => import('../modules/WeiterTHA'));
const TtzWeiterbildungspfad = React.lazy(() => import('../components/weiterbildung/TtzWeiterbildungspfad'));
const StudiumTHA = React.lazy(() => import('../modules/StudiumTHA'));
const Nawaro = React.lazy(() => import('../modules/Nawaro'));
const HolzbauBeta = React.lazy(() => import('../modules/HolzbauBeta'));
const ThesenProjekte = React.lazy(() => import('../modules/ThesenProjekte'));
const Kuriositaeten = React.lazy(() => import('../modules/Kuriositaeten'));
const Datenschutz = React.lazy(() => import('../modules/Datenschutz'));
const Barrierefreiheit = React.lazy(() => import('../modules/Barrierefreiheit'));
const LaborSicherheit = React.lazy(() => import('../modules/LaborSicherheit'));
const LaborPotentialmessung = React.lazy(() => import('../modules/laborhandouts/Potentialmessung'));
const LaborAuslagerung = React.lazy(() => import('../modules/laborhandouts/Auslagerung'));
const LaborFrischbeton = React.lazy(() => import('../modules/laborhandouts/FrischbetonHandout'));
const LaborDruckfestigkeit = React.lazy(() => import('../modules/laborhandouts/DruckfestigkeitWuerfel'));
const LaborMoertelprismen = React.lazy(() => import('../modules/laborhandouts/Moertelprismen'));


export function ModulInhalt({ activeTab }: { activeTab: TabId }) {
  // reine Funktion ohne Hooks: vorladenFuer(ModulInhalt({ activeTab })) lädt die Komponente des Moduls vor
  return (
    <>
    {activeTab === 'start' && <Startseite />}
    {activeTab === 'nachhaltigkeit_daten_regeln' && <NachhaltigkeitDatenRegeln />}
    {activeTab === 'materialoptimierung' && <Materialoptimierung />}
    {activeTab === 'nachhaltigkeit_checklisten' && <NachhaltigkeitChecklisten />}
    {activeTab === 'oekobilanz_lca' && <OekobilanzLCA teil="grundlagen" />}
    {activeTab === 'lca_rechner' && <OekobilanzLCA teil="rechner" />}
    {activeTab === 'lca_ingenieurbau' && <OekobilanzLCA teil="ingenieurbau" />}
    {activeTab === 'lca_regulatorik' && <OekobilanzLCA teil="regulatorik" />}
    {activeTab === 'zertifizierung_siegel' && <ZertifizierungSiegel />}
    {activeTab === 'lebenszyklus_kosten' && <LebenszyklusKosten />}
    {activeTab === 'ressourcen_umwelt' && <RessourcenUmwelt />}
    {activeTab === 'kreislauf_dpp' && <Kreislaufwirtschaft />}
    {activeTab === 'bim_baustoffe' && <BimBaustoffe />}
    {activeTab === 'materialdatenbanken' && <Materialdatenbanken />}
    {activeTab === 'materialpaesse' && <Materialpaesse />}
    {activeTab === 'dpp' && <DppEpd view="dpp" />}
    {activeTab === 'ki_baustoffe' && <KiBaustoffe />}
    {activeTab === 'ki_ueberblick' && <KiBaustoffe forceTab="ueberblick" />}
    {activeTab === 'ki_system' && <KiBaustoffe forceTab="system" />}
    {activeTab === 'ki_prompting' && <KiBaustoffe forceTab="prompting" />}
    {activeTab === 'ki_llmpraxis' && <KiBaustoffe forceTab="llmpraxis" />}
    {activeTab === 'ki_thesen' && <KiBaustoffe forceTab="thesen" />}
    {activeTab === 'ki_recht_ethik' && <KiBaustoffe forceTab="recht_ethik" />}
    {activeTab === 'ki_lokal' && <KiBaustoffe forceTab="lokal" />}
    {activeTab === 'ki_ressourcen' && <KiBaustoffe forceTab="ressourcen" />}
    {activeTab === 'ki_onlinekurse' && <KiBaustoffe forceTab="onlinekurse" />}
    {activeTab === 'ki_uebungen' && <KiUebungen />}
    {activeTab === 'rechnung_u_wert' && <Beispielrechnungen forceTab="u_wert" />}
    {activeTab === 'rechnung_beton' && <Beispielrechnungen forceTab="beton" />}
    {activeTab === 'rechnung_stahlbeton' && <Beispielrechnungen forceTab="stahlbeton" />}
    {activeTab === 'rechnung_holzbau' && <Beispielrechnungen forceTab="holzbau" />}
    {activeTab === 'rechnung_mauerwerk' && <Beispielrechnungen forceTab="mauerwerk" />}
    {activeTab === 'rechnung_nachhaltigkeit' && <Beispielrechnungen forceTab="nachhaltigkeit" />}
    {activeTab === 'rechnung_bestand' && <Beispielrechnungen forceTab="bestand" />}
    {activeTab === 'rechnung_schallschutz' && <Beispielrechnungen forceTab="schallschutz" />}
    {activeTab === 'rechnung_brandschutz' && <Beispielrechnungen forceTab="brandschutz" />}
    {activeTab === 'impressum' && <Impressum />}
    {activeTab === 'forschung_transfer' && <ForschungTransfer />}
    {activeTab === 'datenschutz' && <Datenschutz />}
    {activeTab === 'barrierefreiheit' && <Barrierefreiheit />}
    {activeTab === 'versionen' && <Versionen />}
    {activeTab === 'einheiten' && <Einheiten />}
    {activeTab === 'baustoffkunde' && <Baustoffkunde />}
    {activeTab === 'baustoffkenngroessen' && <Baustoffkenngroessen />}
    {activeTab === 'formaenderungen' && <Formaenderungen />}
    {activeTab === 'analytik' && <Analytik />}
    {activeTab === 'labor' && <Labor />}
    {activeTab === 'mechanische_pruefungen' && <MechanischePruefungen />}
    {activeTab === 'messen_pruefen' && <MessenPruefen />}
    {activeTab === 'probenahme' && <Probenahme />}
    {activeTab === 'statistik' && <Statistik />}
    {activeTab === 'admin' && <Admin />}
    {activeTab === 'anleitung' && <Anleitung />}
    {(activeTab === 'modulstruktur' || (activeTab as string) === 'moduluebersicht') && <Modulstruktur />}
    {activeTab === 'software' && <Software />}
    {activeTab === 'online_tools' && <OnlineTools />}
    {activeTab.startsWith('aufgaben') && <Aufgaben />}
    {activeTab === 'feedback' && <Feedback />}
    {activeTab === 'beton_info' && <BetonInfo />}
    {activeTab === 'grundlagen_info' && <ModuleInfo group="grundlagen" />}
    {activeTab === 'labor_info' && <ModuleInfo group="labor" />}
    {activeTab === 'baustoffe_info' && <ModuleInfo group="baustoffe" />}
    {activeTab === 'bauprodukte_info' && <ModuleInfo group="bauprodukte" />}
    {activeTab === 'stahlbeton_info' && <ModuleInfo group="stahlbeton" />}
    {activeTab === 'mechanik_info' && <ModuleInfo group="mechanik" />}
    {activeTab === 'bauphysik_info' && <ModuleInfo group="bauphysik" />}
    {activeTab === 'nachhaltigkeit_info' && <ModuleInfo group="nachhaltigkeit" />}
    {activeTab === 'digitales_info' && <ModuleInfo group="digitales" />}
    {activeTab === 'bestand_info' && <ModuleInfo group="bestand" />}
    {activeTab === 'rueckbau_info' && <ModuleInfo group="rueckbau" />}
    {activeTab === 'dauerhaftigkeit_info' && <ModuleInfo group="dauerhaftigkeit" />}
    {activeTab === 'schaeden_info' && <ModuleInfo group="schaeden" />}
    {activeTab === 'instandsetzung_info' && <ModuleInfo group="instandsetzung" />}
    {activeTab === 'praxiswissen_info' && <ModuleInfo group="praxiswissen" />}
    {activeTab === 'beton_a_z' && <BetonAZ />}
    {activeTab === 'grundlagen' && <Grundlagen />}
    {activeTab === 'bindemittel' && <Bindemittel />}
    {activeTab === 'mischungsberechnung' && <Mischungsberechnung />}
    {activeTab === 'frischbeton' && <Frischbeton />}
    {activeTab === 'herstellung_einbau' && <HerstellungEinbau />}
    {activeTab === 'hydratation_folgen' && <HydratationFolgen />}
    {activeTab === 'nachbehandlung' && <Nachbehandlung />}
    {activeTab === 'festbeton' && <Festbeton />}
    {activeTab === 'betonkennwerte' && <Betonkennwerte />}
    {activeTab === 'sichtbeton' && <Sichtbeton />}
    {activeTab === 'festbeton_statistik' && <FestbetonStatistik />}
    {activeTab === 'labor_potentialmessung' && <LaborPotentialmessung />}
    {activeTab === 'labor_auslagerung' && <LaborAuslagerung />}
    {activeTab === 'labor_frischbeton' && <LaborFrischbeton />}
    {activeTab === 'labor_druckfestigkeit' && <LaborDruckfestigkeit />}
    {activeTab === 'labor_moertelprismen' && <LaborMoertelprismen />}
    {activeTab === 'sicherheitskonzept' && <Sicherheitskonzept />}
    {activeTab === 'sonderbetone' && <Sonderbetone />}
    {activeTab === 'innovative_werkstoffe' && <InnovativeWerkstoffe />}
    {activeTab === 'biokohlebeton' && <Biokohlebeton />}
    {activeTab === 'qualitaetssicherung' && <Qualitaetssicherung />}
    {activeTab === 'betonpraxis' && <Betonpraxis />}
    {activeTab === 'expositionsklassen' && <Expositionsklassen />}
    {activeTab === 'korrosion' && <Korrosion />}
    {activeTab === 'schnellkarbonatisierung' && <Schnellkarbonatisierung />}
    {activeTab === 'lebensdauerbemessung' && <Lebensdauerbemessung />}
    {activeTab === 'schadreaktionen_beton' && <SchadreaktionenBeton />}
    {activeTab === 'zwang' && <ZwangCalculator />}
    {activeTab === 'eigenspannungen' && <Eigenspannungen />}
    {activeTab === 'kriechen' && <KriechenSchwinden />}
    {activeTab === 'wu-bauwerke' && <WUBauwerke />}

    {activeTab === 'materialkennwerte' && <Materialkennwerte />}
    {activeTab === 'holz' && <Holz />}
    {activeTab === 'holzwerkstoffe' && <Holzwerkstoffe />}
    {activeTab === 'festigkeit' && <Festigkeitsberechnungen />}
    {(activeTab === 'stahlbeton_bemessung' || activeTab === 'spannung' || activeTab === 'biegebemessung' || activeTab === 'querkraftbemessung' || activeTab === 'stuetzenbemessung' || activeTab === 'durchstanzen' || activeTab === 'verankerungslaenge' || activeTab === 'rissbreite') && (
    <Stahlbetonbemessung
    initialTab={
    activeTab === 'spannung'
    ? 'spannung'
    : activeTab === 'querkraftbemessung'
    ? 'querkraftbemessung'
    : activeTab === 'stuetzenbemessung'
    ? 'stuetzenbemessung'
    : activeTab === 'durchstanzen'
    ? 'durchstanzen'
    : activeTab === 'verankerungslaenge'
    ? 'verankerungslaenge'
    : activeTab === 'rissbreite'
    ? 'rissbreite'
    : activeTab === 'biegebemessung'
    ? 'biegebemessung'
    : 'spannung'
    }
    />
    )}
    {activeTab === 'erdbau' && <Erdbau />}
    {activeTab === 'stahl' && <Stahl />}
    {activeTab === 'bp_stahlbauprofile' && <BpStahlbauprofile />}
    {activeTab === 'mauerwerk' && <Mauerwerk />}
    {activeTab === 'keramik_ziegel' && <KeramikZiegel />}
    {activeTab === 'glas' && <Glas />}
    {activeTab === 'asphalt' && <Asphalt />}
    {activeTab === 'putzemoertel' && <PutzeMoertel />}
    {activeTab === 'gesteine' && <Gesteine />}
    {activeTab === 'bauchemie' && <Bauchemie />}
    {activeTab === 'materialitaet_architektur' && <MaterialitaetArchitektur />}
    {(activeTab === 'kombinationen' || activeTab === 'faserverbund') && (
    <Kombinationen initialTab={activeTab === 'faserverbund' ? 'faserverbund' : undefined} />
    )}
    {activeTab === 'kunststoffe' && <Kunststoffe />}
    {activeTab === 'membranen_etfe' && <MembranenETFE />}
    {activeTab === 'nawaro' && <Nawaro />}
    {activeTab === 'lehm' && <Lehm />}
    {activeTab === 'bp_lehmbauprodukte' && <BpLehmbauprodukte />}
    {activeTab === 'bp_baustoffindustrie' && <BpBaustoffindustrie />}
    {activeTab === 'bp_innovationen' && <BpInnovationen />}
    {activeTab === 'metalle' && <Metalle />}
    {activeTab === 'innenausbau' && <Innenausbau />}
    {activeTab === 'ausbau' && <Ausbau />}
    {activeTab === 'gips' && <Gips />}
    {activeTab === 'kalk' && <Kalk />}
    {activeTab === 'daemmstoffe' && <Daemmstoffe />}
    {activeTab === 'bp_rechtliches' && <BpRechtliches />}
    {activeTab === 'bp_recht_grundlagen' && <BpRechtliches isEmbedded={false} activeSubTab="grundlagen" />}
    {activeTab === 'bp_recht_avcp' && <BpRechtliches isEmbedded={false} activeSubTab="avcp" />}
    {activeTab === 'bp_recht_konformitaet' && <BpRechtliches isEmbedded={false} activeSubTab="begriffe" />}
    {activeTab === 'bp_recht_normen' && <BpRechtliches isEmbedded={false} activeSubTab="normenarbeit" />}
    {activeTab === 'bp_trockenbau' && <BpTrockenbau />}
    {activeTab === 'bp_beton' && <BpBeton />}
    {activeTab === 'bp_betonfertigteile' && <BpBetonfertigteile />}
    {activeTab === 'bp_betonwaren' && <BpBetonwaren />}
    {activeTab === 'bp_mauerwerk' && <BpMauerwerk />}
    {activeTab === 'bp_verkehrswegebau' && <BpVerkehrswegebau />}
    {activeTab === 'bp_verkehr_rsto' && <BpVerkehrswegebau initialTab="rsto_rechner" />}
    {activeTab === 'bp_verkehr_asphalt' && <BpVerkehrswegebau initialTab="vergleich" />}
    {activeTab === 'bp_verkehr_bitumen' && <BpVerkehrswegebau initialTab="bindemittel" />}
    {activeTab === 'bp_verkehr_pruefung' && <BpVerkehrswegebau initialTab="prueftechnik" />}
    {activeTab === 'bp_verkehr_betondecken' && <BpVerkehrswegebau initialTab="betondecken" />}
    {activeTab === 'bp_verkehr_tiefbau' && <BpVerkehrswegebau initialTab="tiefbau" />}
    {activeTab === 'bp_verkehr_bahn' && <BpVerkehrswegebau initialTab="bahnbau" />}
    {activeTab === 'bp_verkehr_tunnel' && <BpVerkehrswegebau initialTab="tunnelbau" />}
    {activeTab === 'bp_abdichtung' && <BpAbdichtung />}
    {activeTab === 'bp_daemmung' && <BpDaemmung />}
    {activeTab === 'bp_putz_estrich' && <BpPutzEstrich />}
    {activeTab === 'bp_holzprodukte' && <BpHolzprodukte />}
    {activeTab === 'bp_dach_fassade' && <BpDachFassade />}
    {activeTab === 'bp_befestigung' && <BpBefestigung />}
    {activeTab === 'bp_kunststoffe' && <BpKunststoffe />}
    {activeTab === 'bp_klebstoffe' && <BpKlebstoffe />}
    {activeTab === 'bp_farben_lacke' && <BpFarbenLacke />}
    {activeTab === 'bp_mineralisch' && <BpMineralisch />}
    {activeTab === 'bp_glaeser' && <BpGlaeser />}
    {activeTab === 'bp_metallisch' && <BpMetallisch />}
    {activeTab === 'bp_betonzusatzmittel' && <BpBetonzusatzmittel />}
    {activeTab === 'sonstiges' && <Sonstiges />}
    {activeTab === 'mechanische_kenngroessen' && <MechanischeKenngroessen />}
    {activeTab === 'materialmodelle' && <Materialmodelle />}
    {activeTab === 'bruchmechanik' && <Bruchmechanik />}
    {activeTab === 'knicken' && <Knicken />}
    {activeTab === 'stahlbau_ec3' && <StahlbauEC3 />}
    {activeTab === 'baustatik' && <Baustatik />}
    {activeTab === 'bodenmechanik' && <Bodenmechanik />}
    {activeTab === 'bauphysik' && <Bauphysik />}
    {activeTab === 'feuchteschutz' && <Feuchteschutz />}
    {activeTab === 'sommerlicher_waermeschutz' && <SommerlicherWaermeschutz />}
    {activeTab === 'schallschutz' && <Schallschutz />}
    {activeTab === 'brandschutz' && <Brandschutz />}
    {activeTab === 'energieausweis' && <Energieausweis />}
    {activeTab === 'emodul' && <EModul />}
    {activeTab === 'carbonbeton' && <Carbonbeton />}

    {/* Holzbau */}
    {activeTab === 'holzbau_info' && <HolzbauBeta activeSubTab="info" />}
    {activeTab === 'holzbau_werkstoffe' && <HolzbauBeta activeSubTab="werkstoffe" />}
    {activeTab === 'holzbau_konstruktion' && <HolzbauBeta activeSubTab="konstruktion" />}
    {activeTab === 'holzbau_bemessung' && <HolzbauBeta activeSubTab="bemessung" />}
    {activeTab === 'holzbau_verbindung' && <HolzbauBeta activeSubTab="verbindung" />}
    {activeTab === 'holzbau_bauphysik' && <HolzbauBeta activeSubTab="bauphysik" />}

    {activeTab === 'waermeeigenschaften' && <Waermeeigenschaften />}
    {activeTab === 'daemmung_vergleich' && <DaemmungVergleich />}
    {activeTab === 'spannbeton' && <Spannbeton />}
    {/* Info */}
    {activeTab === 'glossar' && <Glossar />}
    {activeTab === 'regularien' && <Regularien />}
    {activeTab === 'normen_ausblick' && <NormenAusblick />}
    {activeTab === 'fortbildungen' && <Fortbildungen />}
    {activeTab === 'informationsquellen' && <Informationsquellen />}
    {activeTab === 'literatur' && <Literatur />}

    {/* Bauen im Bestand */}
    {activeTab === 'bestand' && <Bestand />}

    {activeTab === 'bauwerkserfassung' && <Bauwerkserfassung />}
    {activeTab === 'zfp' && <Bauwerksuntersuchung />}
    {activeTab === 'bauwerksuntersuchung' && <Bauwerksuntersuchung />}
    {activeTab === 'historisch' && <HistorischeMaterialkennwerte />}
    {activeTab === 'historische_bauweisen' && <HistorischeBauweisen />}
    {activeTab === 'historische_bauprodukte' && <HistorischeBauprodukte />}
    {activeTab === 'schadstoffe' && <Schadstoffe />}
    {activeTab === 'altholz_urban_mining' && <AltholzUrbanMining />}
    {activeTab === 'pfas_baustoffe' && <PfasBaustoffe />}
    {activeTab === 'ressourceneffizienz' && <Ressourceneffizienz />}
    {activeTab === 'vdi6200' && <Zustandsbewertung />}
    {activeTab === 'abfaelle' && <Abfaelle />}
    {activeTab === 'rueckbau' && <Rueckbau />}
    {activeTab === 'boden_materialaufbereitung' && <BodenMaterialAufbereitung />}
    {activeTab === 'rueckbau_checklisten' && <RueckbauChecklisten />}
    {activeTab === 'bestand_checklisten' && <BestandChecklisten />}
    {activeTab === 'wta' && <WTA />}
    {activeTab === 'denkmalpflege' && <Denkmalpflege />}
    {activeTab === 'modernisierung' && <Modernisierung />}

    {/* Nachhaltigkeit & Digitales */}













    {/* Lebenszyklus */}
    {activeTab === 'dauerhaftigkeit' && <Dauerhaftigkeit />}
    {activeTab === 'dauerhaftigkeit_checklisten' && <DauerhaftigkeitChecklisten />}
    {activeTab === 'holzkorrosion' && <Holzkorrosion />}
    {activeTab === 'metallkorrosion' && <Metallkorrosion />}
    {activeTab === 'korrosionsschutz_beschichtungen' && <KorrosionsschutzBeschichtungen />}
    {activeTab === 'weitere_organik' && <WeitereOrganik />}
    {/* Schäden */}
    {activeTab === 'bauschaeden' && <Bauschaeden />}
    {activeTab === 'schadensbilder' && <TypischeBauschaeden />}
    {activeTab === 'material_schaeden_gross' && <MaterialSchaedenGross />}
    {activeTab === 'bauwerksunters_monitoring' && <Bauwerksunters_Monitoring />}
    {activeTab === 'schaeden_checklisten' && <SchaedenChecklisten />}

    {/* Schutz & Instandsetzung */}
    {activeTab === 'schutz_grundlagen' && <SchutzGrundlagen />}
    {activeTab === 'instandhaltung' && <Stahlbetoninstandhaltung />}
    {(activeTab === 'instandsetzung_materialien' || activeTab === 'instandsetzung_holz' || activeTab === 'instandsetzung_metalle' || activeTab === 'instandsetzung_kunststoffe' || activeTab === 'instandsetzung_asphalt' || activeTab === 'instandsetzung_mauerwerk') && (
    <InstandsetzungMaterialien
    initialMaterial={
    activeTab === 'instandsetzung_holz' ? 'holz' :
    activeTab === 'instandsetzung_metalle' ? 'metalle' :
    activeTab === 'instandsetzung_kunststoffe' ? 'kunststoffe' :
    activeTab === 'instandsetzung_asphalt' ? 'asphalt' :
    activeTab === 'instandsetzung_mauerwerk' ? 'mauerwerk' : undefined
    }
    />
    )}
    {activeTab === 'instandsetzung_checklisten' && <InstandsetzungChecklisten />}

    {/* Praxiswissen */}
    {activeTab === 'px_planung' && <Praxiswissen />}
    {activeTab === 'px_bauleitung' && <Praxiswissen />}
    {activeTab === 'px_bautagebuch' && <Bautagebuch />}
    {activeTab === 'px_produktion' && <Praxiswissen />}
    {activeTab === 'px_karriere' && <Praxiswissen />}
    {(activeTab === 'weiter_tha' || activeTab === 'weiter_bauing' || activeTab === 'weiter_pm' || activeTab === 'weiter_ausbau' || activeTab === 'weiter_fassade' || activeTab === 'weiter_holzbau' || activeTab === 'weiter_ttz' || activeTab === 'weiter_mapr') && <WeiterTHA />}
    {activeTab === 'ttz_weiterbildung' && <TtzWeiterbildungspfad />}
    {(activeTab === 'vl_ueberblick' || activeTab === 'vl_bauen_im_bestand' || activeTab === 'vl_nachhaltiges_bauen' || activeTab === 'vl_bauschaeden' || activeTab === 'vl_baustoffkunde' || activeTab === 'vl_instandhaltung') && (
    <Vorlesungen
    forceTab={
    activeTab === 'vl_nachhaltiges_bauen'
    ? 'nachhaltiges_bauen'
    : activeTab === 'vl_bauschaeden'
    ? 'bauschaeden'
    : activeTab === 'vl_baustoffkunde'
    ? 'baustoffkunde'
    : activeTab === 'vl_instandhaltung'
    ? 'instandhaltung'
    : 'bauen_im_bestand'
    }
    />
    )}
    {/* Lernpfade je Lehrveranstaltung (AP 6.1), Daten in src/data/lernpfade.ts */}
    {activeTab === 'lehrveranstaltungen' && <Lehrveranstaltungen />}
    {(activeTab === 'lv_baustoffkunde' || activeTab === 'lv_bauen_im_bestand' || activeTab === 'lv_aryc' || activeTab === 'lv_wpf_nachhaltiges_bauen' || activeTab === 'lv_vnhb' || activeTab === 'lv_ki_master' || activeTab === 'lv_zert_ausbau_bestand') && <Lehrveranstaltungen kursId={activeTab} />}
    {activeTab === 'studium_tha' && <StudiumTHA />}
    {activeTab === 'thesen_projekte' && <ThesenProjekte />}
    {activeTab === 'kuriositaeten' && <Kuriositaeten />}
    {activeTab === 'labor_sicherheit' && <LaborSicherheit />}
    </>
  );
}

export default ModulInhalt;
