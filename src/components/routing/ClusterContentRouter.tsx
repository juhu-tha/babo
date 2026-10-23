import React from 'react';

// Lazy loaded modules - Cluster I: Grundlagen, Mechanik, Physik & Labor
const Grundlagen = React.lazy(() => import('@/src/modules/Grundlagen'));
const Einheiten = React.lazy(() => import('@/src/modules/Einheiten'));
const Baustoffkunde = React.lazy(() => import('@/src/modules/Baustoffkunde'));
const Baustoffkenngroessen = React.lazy(() => import('@/src/modules/Baustoffkenngroessen'));
const Materialkennwerte = React.lazy(() => import('@/src/modules/Materialkennwerte'));
const Bauchemie = React.lazy(() => import('@/src/modules/Bauchemie').then(module => ({ default: module.Bauchemie })));
const Sicherheitskonzept = React.lazy(() => import('@/src/modules/Sicherheitskonzept'));
const Regularien = React.lazy(() => import('@/src/modules/Regularien'));
const Labor = React.lazy(() => import('@/src/modules/Labor'));
const Probenahme = React.lazy(() => import('@/src/modules/Probenahme'));
const MessenPruefen = React.lazy(() => import('@/src/modules/MessenPruefen'));
const Analytik = React.lazy(() => import('@/src/modules/Analytik'));
const MechanischePruefungen = React.lazy(() => import('@/src/modules/MechanischePruefungen'));
const Statistik = React.lazy(() => import('@/src/modules/Statistik'));
const FestbetonStatistik = React.lazy(() => import('@/src/modules/FestbetonStatistik'));
const Baustatik = React.lazy(() => import('@/src/modules/Baustatik'));
const Bruchmechanik = React.lazy(() => import('@/src/modules/Bruchmechanik'));
const Knicken = React.lazy(() => import('@/src/modules/Knicken'));
const Materialmodelle = React.lazy(() => import('@/src/modules/Materialmodelle'));
const Bodenmechanik = React.lazy(() => import('@/src/modules/Bodenmechanik'));
const EModul = React.lazy(() => import('@/src/modules/EModul'));
const Bauphysik = React.lazy(() => import('@/src/modules/Bauphysik'));
const Feuchteschutz = React.lazy(() => import('@/src/modules/Feuchteschutz'));
const Schallschutz = React.lazy(() => import('@/src/modules/Schallschutz'));
const Brandschutz = React.lazy(() => import('@/src/modules/Brandschutz'));
const Energieausweis = React.lazy(() => import('@/src/modules/Energieausweis'));
const Waermeeigenschaften = React.lazy(() => import('@/src/modules/Waermeeigenschaften'));
const DaemmungVergleich = React.lazy(() => import('@/src/modules/DaemmungVergleich'));

// Cluster II: Materialien & Bauprodukte
const Gesteine = React.lazy(() => import('@/src/modules/Gesteine'));
const Mauerwerk = React.lazy(() => import('@/src/modules/Mauerwerk'));
const PutzeMoertel = React.lazy(() => import('@/src/modules/PutzeMoertel'));
const Gips = React.lazy(() => import('@/src/modules/Gips'));
const Kalk = React.lazy(() => import('@/src/modules/Kalk'));
const Lehm = React.lazy(() => import('@/src/modules/Lehm'));
const Erdbau = React.lazy(() => import('@/src/modules/Erdbau'));
const Glas = React.lazy(() => import('@/src/modules/Glas'));
const Stahl = React.lazy(() => import('@/src/modules/Stahl'));
const Metalle = React.lazy(() => import('@/src/modules/Metalle'));
const Holz = React.lazy(() => import('@/src/modules/Holz'));
const Holzwerkstoffe = React.lazy(() => import('@/src/modules/Holzwerkstoffe'));
const Asphalt = React.lazy(() => import('@/src/modules/Asphalt'));
const Kunststoffe = React.lazy(() => import('@/src/modules/Kunststoffe'));
const Daemmstoffe = React.lazy(() => import('@/src/modules/Daemmstoffe'));
const Kombinationen = React.lazy(() => import('@/src/modules/Kombinationen'));
const Nawaro = React.lazy(() => import('@/src/modules/Nawaro'));
const Sonstiges = React.lazy(() => import('@/src/modules/Sonstiges'));
const BpRechtliches = React.lazy(() => import('@/src/modules/BpRechtliches'));
const BpTrockenbau = React.lazy(() => import('@/src/modules/BpTrockenbau'));
const BpBeton = React.lazy(() => import('@/src/modules/BpBeton'));
const BpBetonfertigteile = React.lazy(() => import('@/src/modules/BpBetonfertigteile'));
const BpBetonwaren = React.lazy(() => import('@/src/modules/BpBetonwaren'));
const BpMauerwerk = React.lazy(() => import('@/src/modules/BpMauerwerk'));
const BpVerkehrswegebau = React.lazy(() => import('@/src/modules/BpVerkehrswegebau'));
const BpAbdichtung = React.lazy(() => import('@/src/modules/BpAbdichtung'));
const BpDaemmung = React.lazy(() => import('@/src/modules/BpDaemmung'));
const BpPutzEstrich = React.lazy(() => import('@/src/modules/BpPutzEstrich'));
const BpHolzprodukte = React.lazy(() => import('@/src/modules/BpHolzprodukte'));
const BpDachFassade = React.lazy(() => import('@/src/modules/BpDachFassade'));
const BpBefestigung = React.lazy(() => import('@/src/modules/BpBefestigung'));
const BpKunststoffe = React.lazy(() => import('@/src/modules/BpKunststoffe'));
const BpKlebstoffe = React.lazy(() => import('@/src/modules/BpKlebstoffe'));
const BpFarbenLacke = React.lazy(() => import('@/src/modules/BpFarbenLacke'));
const BpMineralisch = React.lazy(() => import('@/src/modules/BpMineralisch'));
const BpGlaeser = React.lazy(() => import('@/src/modules/BpGlaeser'));
const BpMetallisch = React.lazy(() => import('@/src/modules/BpMetallisch'));
const BpBetonzusatzmittel = React.lazy(() => import('@/src/modules/BpBetonzusatzmittel'));
const BpStahlbauprofile = React.lazy(() => import('@/src/modules/BpStahlbauprofile'));
const BpLehmbauprodukte = React.lazy(() => import('@/src/modules/BpLehmbauprodukte'));
const BpBaustoffindustrie = React.lazy(() => import('@/src/modules/BpBaustoffindustrie'));
const BpInnovationen = React.lazy(() => import('@/src/modules/BpInnovationen'));

// Cluster III: Entwurf & Bemessung (Beton, Massivbau, Holzbau, Innenausbau)
const BetonAZ = React.lazy(() => import('@/src/modules/BetonAZ'));
const Bindemittel = React.lazy(() => import('@/src/modules/Bindemittel'));
const Mischungsberechnung = React.lazy(() => import('@/src/modules/Mischungsberechnung'));
const HerstellungEinbau = React.lazy(() => import('@/src/modules/HerstellungEinbau'));
const Frischbeton = React.lazy(() => import('@/src/modules/Frischbeton'));
const HydratationFolgen = React.lazy(() => import('@/src/modules/HydratationFolgen'));
const Nachbehandlung = React.lazy(() => import('@/src/modules/Nachbehandlung'));
const Festbeton = React.lazy(() => import('@/src/modules/Festbeton'));
const Sichtbeton = React.lazy(() => import('@/src/modules/Sichtbeton'));
const Sonderbetone = React.lazy(() => import('@/src/modules/Sonderbetone'));
const InnovativeWerkstoffe = React.lazy(() => import('@/src/modules/InnovativeWerkstoffe'));
const Qualitaetssicherung = React.lazy(() => import('@/src/modules/Qualitaetssicherung'));
const Betonpraxis = React.lazy(() => import('@/src/modules/Betonpraxis'));
const Rissbreite = React.lazy(() => import('@/src/modules/Rissbreite'));
const SpannungDehnung = React.lazy(() => import('@/src/modules/SpannungDehnung'));
const Stahlbetonbemessung = React.lazy(() => import('@/src/modules/Stahlbetonbemessung'));
const Spannbeton = React.lazy(() => import('@/src/modules/Spannbeton'));
const WUBauwerke = React.lazy(() => import('@/src/modules/WUBauwerke'));
const Carbonbeton = React.lazy(() => import('@/src/modules/Carbonbeton'));
const HolzbauBeta = React.lazy(() => import('@/src/modules/HolzbauBeta'));
const Innenausbau = React.lazy(() => import('@/src/modules/Innenausbau'));
const Ausbau = React.lazy(() => import('@/src/modules/Ausbau'));
const ZwangCalculator = React.lazy(() => import('@/src/modules/Zwang').then(module => ({ default: module.ZwangCalculator })));
const Eigenspannungen = React.lazy(() => import('@/src/modules/Eigenspannungen'));
const KriechenSchwinden = React.lazy(() => import('@/src/modules/KriechenSchwinden'));
const Festigkeitsberechnungen = React.lazy(() => import('@/src/modules/Festigkeitsberechnungen'));

// Cluster IV: Bestand & Nachhaltigkeit
const Bestand = React.lazy(() => import('@/src/modules/Bestand'));
const Bauwerkserfassung = React.lazy(() => import('@/src/modules/Bauwerkserfassung'));
const Bauwerksuntersuchung = React.lazy(() => import('@/src/modules/Bauwerksuntersuchung'));
const HistorischeMaterialkennwerte = React.lazy(() => import('@/src/modules/HistorischeMaterialkennwerte'));
const HistorischeBauweisen = React.lazy(() => import('@/src/modules/HistorischeBauweisen'));
const HistorischeBauprodukte = React.lazy(() => import('@/src/modules/HistorischeBauprodukte'));
const Schadstoffe = React.lazy(() => import('@/src/modules/Schadstoffe'));
const Ressourceneffizienz = React.lazy(() => import('@/src/modules/Ressourceneffizienz'));
const Zustandsbewertung = React.lazy(() => import('@/src/modules/Zustandsbewertung'));
const Abfaelle = React.lazy(() => import('@/src/modules/Abfaelle'));
const Rueckbau = React.lazy(() => import('@/src/modules/Rueckbau'));
const BodenMaterialAufbereitung = React.lazy(() => import('@/src/modules/BodenMaterialAufbereitung'));
const RueckbauChecklisten = React.lazy(() => import('@/src/modules/RueckbauChecklisten'));
const BestandChecklisten = React.lazy(() => import('@/src/modules/BestandChecklisten'));
const WTA = React.lazy(() => import('@/src/modules/WTA'));
const Denkmalpflege = React.lazy(() => import('@/src/modules/Denkmalpflege'));
const Modernisierung = React.lazy(() => import('@/src/modules/Modernisierung'));
const Dauerhaftigkeit = React.lazy(() => import('@/src/modules/Dauerhaftigkeit'));
const DauerhaftigkeitChecklisten = React.lazy(() => import('@/src/modules/DauerhaftigkeitChecklisten'));
const Korrosion = React.lazy(() => import('@/src/modules/Korrosion'));
const Holzkorrosion = React.lazy(() => import('@/src/modules/Holzkorrosion'));
const Metallkorrosion = React.lazy(() => import('@/src/modules/Metallkorrosion'));
const WeitereOrganik = React.lazy(() => import('@/src/modules/WeitereOrganik'));
const SchadreaktionenBeton = React.lazy(() => import('@/src/modules/SchadreaktionenBeton'));
const Bauschaeden = React.lazy(() => import('@/src/modules/Bauschaeden'));
const TypischeBauschaeden = React.lazy(() => import('@/src/modules/TypischeBauschaeden'));
const MaterialSchaedenGross = React.lazy(() => import('@/src/modules/MaterialSchaedenGross'));
const Bauwerksunters_Monitoring = React.lazy(() => import('@/src/modules/Bauwerksunters_Monitoring'));
const SchaedenChecklisten = React.lazy(() => import('@/src/modules/SchaedenChecklisten'));
const SchutzGrundlagen = React.lazy(() => import('@/src/modules/SchutzGrundlagen'));
const Stahlbetoninstandhaltung = React.lazy(() => import('@/src/modules/Stahlbetoninstandhaltung').then(module => ({ default: module.Stahlbetoninstandhaltung })));
const InstandsetzungMaterialien = React.lazy(() => import('@/src/modules/InstandsetzungMaterialien'));
const InstandsetzungChecklisten = React.lazy(() => import('@/src/modules/InstandsetzungChecklisten'));
const Materialoptimierung = React.lazy(() => import('@/src/modules/Materialoptimierung'));
const NachhaltigkeitDatenRegeln = React.lazy(() => import('@/src/modules/NachhaltigkeitDatenRegeln'));
const NachhaltigkeitChecklisten = React.lazy(() => import('@/src/modules/NachhaltigkeitChecklisten'));
const OekobilanzLCA = React.lazy(() => import('@/src/modules/OekobilanzLCA'));
const ZertifizierungSiegel = React.lazy(() => import('@/src/modules/ZertifizierungSiegel'));
const LebenszyklusKosten = React.lazy(() => import('@/src/modules/LebenszyklusKosten'));
const RessourcenUmwelt = React.lazy(() => import('@/src/modules/RessourcenUmwelt'));
const Kreislaufwirtschaft = React.lazy(() => import('@/src/modules/Kreislaufwirtschaft'));
const Formaenderungen = React.lazy(() => import('@/src/modules/Formaenderungen'));

// Cluster V: Digitales, Praxis & Infos
const BimBaustoffe = React.lazy(() => import('@/src/modules/BimBaustoffe'));
const Materialdatenbanken = React.lazy(() => import('@/src/modules/Materialdatenbanken'));
const Materialpaesse = React.lazy(() => import('@/src/modules/Materialpaesse'));
const DppEpd = React.lazy(() => import('@/src/modules/DppEpd'));
const KiBaustoffe = React.lazy(() => import('@/src/modules/KiBaustoffe'));
const Praxiswissen = React.lazy(() => import('@/src/modules/Praxiswissen'));
const Bautagebuch = React.lazy(() => import('@/src/modules/Bautagebuch'));
const Glossar = React.lazy(() => import('@/src/modules/Glossar'));
const Informationsquellen = React.lazy(() => import('@/src/modules/Informationsquellen'));
const Fortbildungen = React.lazy(() => import('@/src/modules/Fortbildungen'));
const Literatur = React.lazy(() => import('@/src/modules/Literatur'));
const Kuriositaeten = React.lazy(() => import('@/src/modules/Kuriositaeten'));
const Software = React.lazy(() => import('@/src/modules/Software'));
const OnlineTools = React.lazy(() => import('@/src/modules/OnlineTools'));

// Cluster VI: Studium, Allgemein & Information
const Startseite = React.lazy(() => import('@/src/modules/Startseite'));
const Anleitung = React.lazy(() => import('@/src/modules/Anleitung'));
const Modulstruktur = React.lazy(() => import('@/src/modules/Modulstruktur'));
const Feedback = React.lazy(() => import('@/src/modules/Feedback'));
const Impressum = React.lazy(() => import('@/src/modules/Impressum'));
const Versionen = React.lazy(() => import('@/src/modules/Versionen'));
const Aufgaben = React.lazy(() => import('@/src/modules/Aufgaben'));
const Beispielrechnungen = React.lazy(() => import('@/src/modules/Beispielrechnungen'));
const StudiumTHA = React.lazy(() => import('@/src/modules/StudiumTHA'));
const WeiterTHA = React.lazy(() => import('@/src/modules/WeiterTHA'));
const ThesenProjekte = React.lazy(() => import('@/src/modules/ThesenProjekte'));
const Vorlesungen = React.lazy(() => import('@/src/modules/Vorlesungen'));

// Modulinfos
const BetonInfo = React.lazy(() => import('@/src/modules/BetonInfo'));
const ModuleInfo = React.lazy(() => import('@/src/modules/ModuleInfo'));

interface ClusterContentRouterProps {
  activeTab: string;
}

export default function ClusterContentRouter({ activeTab }: ClusterContentRouterProps) {
  // General & Dashboard
  if (activeTab === 'start') return <Startseite />;
  if (activeTab === 'anleitung') return <Anleitung />;
  if (activeTab === 'modulstruktur') return <Modulstruktur />;
  if (activeTab === 'feedback') return <Feedback />;
  if (activeTab === 'versionen') return <Versionen />;
  if (activeTab === 'impressum') return <Impressum />;

  // Modulinfos
  if (activeTab === 'beton_info') return <BetonInfo />;
  if (activeTab === 'grundlagen_info') return <ModuleInfo group="grundlagen" />;
  if (activeTab === 'labor_info') return <ModuleInfo group="labor" />;
  if (activeTab === 'baustoffe_info') return <ModuleInfo group="baustoffe" />;
  if (activeTab === 'bauprodukte_info') return <ModuleInfo group="bauprodukte" />;
  if (activeTab === 'stahlbeton_info') return <ModuleInfo group="stahlbeton" />;
  if (activeTab === 'mechanik_info') return <ModuleInfo group="mechanik" />;
  if (activeTab === 'bauphysik_info') return <ModuleInfo group="bauphysik" />;
  if (activeTab === 'nachhaltigkeit_info') return <ModuleInfo group="nachhaltigkeit" />;
  if (activeTab === 'digitales_info') return <ModuleInfo group="digitales" />;
  if (activeTab === 'bestand_info') return <ModuleInfo group="bestand" />;
  if (activeTab === 'rueckbau_info') return <ModuleInfo group="rueckbau" />;
  if (activeTab === 'dauerhaftigkeit_info') return <ModuleInfo group="dauerhaftigkeit" />;
  if (activeTab === 'schaeden_info') return <ModuleInfo group="schaeden" />;
  if (activeTab === 'instandsetzung_info') return <ModuleInfo group="instandsetzung" />;
  if (activeTab === 'praxiswissen_info') return <ModuleInfo group="praxiswissen" />;

  // Cluster I: Grundlagen, Mechanik & Labor
  if (activeTab === 'einheiten') return <Einheiten />;
  if (activeTab === 'baustoffkunde') return <Baustoffkunde />;
  if (activeTab === 'baustoffkenngroessen') return <Baustoffkenngroessen />;
  if (activeTab === 'materialkennwerte') return <Materialkennwerte />;
  if (activeTab === 'bauchemie') return <Bauchemie />;
  if (activeTab === 'sicherheitskonzept') return <Sicherheitskonzept />;
  if (activeTab === 'regularien') return <Regularien />;
  if (activeTab === 'probenahme') return <Probenahme />;
  if (activeTab === 'messen_pruefen') return <MessenPruefen />;
  if (activeTab === 'analytik') return <Analytik />;
  if (activeTab === 'mechanische_pruefungen') return <MechanischePruefungen />;
  if (activeTab === 'labor') return <Labor />;
  if (activeTab === 'statistik') return <Statistik />;
  if (activeTab === 'festbeton_statistik') return <FestbetonStatistik />;
  if (activeTab === 'baustatik') return <Baustatik />;
  if (activeTab === 'bruchmechanik') return <Bruchmechanik />;
  if (activeTab === 'knicken') return <Knicken />;
  if (activeTab === 'materialmodelle') return <Materialmodelle />;
  if (activeTab === 'bodenmechanik') return <Bodenmechanik />;
  if (activeTab === 'emodul') return <EModul />;
  if (activeTab === 'bauphysik') return <Bauphysik />;
  if (activeTab === 'feuchteschutz') return <Feuchteschutz />;
  if (activeTab === 'schallschutz') return <Schallschutz />;
  if (activeTab === 'brandschutz') return <Brandschutz />;
  if (activeTab === 'energieausweis') return <Energieausweis />;
  if (activeTab === 'waermeeigenschaften') return <Waermeeigenschaften />;
  if (activeTab === 'daemmung_vergleich') return <DaemmungVergleich />;

  // Cluster II: Baustoffe & Bauprodukte
  if (activeTab === 'gesteine') return <Gesteine />;
  if (activeTab === 'mauerwerk') return <Mauerwerk />;
  if (activeTab === 'putzemoertel') return <PutzeMoertel />;
  if (activeTab === 'gips') return <Gips />;
  if (activeTab === 'kalk') return <Kalk />;
  if (activeTab === 'lehm') return <Lehm />;
  if (activeTab === 'erdbau') return <Erdbau />;
  if (activeTab === 'glas') return <Glas />;
  if (activeTab === 'stahl') return <Stahl />;
  if (activeTab === 'metalle') return <Metalle />;
  if (activeTab === 'holz') return <Holz />;
  if (activeTab === 'holzwerkstoffe') return <Holzwerkstoffe />;
  if (activeTab === 'asphalt') return <Asphalt />;
  if (activeTab === 'kunststoffe') return <Kunststoffe />;
  if (activeTab === 'daemmstoffe') return <Daemmstoffe />;
  if (activeTab === 'kombinationen' || activeTab === 'faserverbund' || activeTab === 'materialitaet_architektur') {
    return <Kombinationen initialTab={activeTab === 'faserverbund' ? 'faserverbund' : undefined} />;
  }
  if (activeTab === 'nawaro') return <Nawaro />;
  if (activeTab === 'sonstiges') return <Sonstiges />;
  if (activeTab === 'bp_rechtliches') return <BpRechtliches />;
  if (activeTab === 'bp_recht_grundlagen') return <BpRechtliches isEmbedded={false} activeSubTab="grundlagen" />;
  if (activeTab === 'bp_recht_avcp') return <BpRechtliches isEmbedded={false} activeSubTab="avcp" />;
  if (activeTab === 'bp_recht_konformitaet') return <BpRechtliches isEmbedded={false} activeSubTab="begriffe" />;
  if (activeTab === 'bp_recht_normen') return <BpRechtliches isEmbedded={false} activeSubTab="normenarbeit" />;
  if (activeTab === 'bp_trockenbau') return <BpTrockenbau />;
  if (activeTab === 'bp_beton') return <BpBeton />;
  if (activeTab === 'bp_betonfertigteile') return <BpBetonfertigteile />;
  if (activeTab === 'bp_betonwaren') return <BpBetonwaren />;
  if (activeTab === 'bp_mauerwerk') return <BpMauerwerk />;
  if (activeTab === 'bp_verkehrswegebau') return <BpVerkehrswegebau />;
  if (activeTab === 'bp_verkehr_rsto') return <BpVerkehrswegebau initialTab="rsto_rechner" />;
  if (activeTab === 'bp_verkehr_asphalt') return <BpVerkehrswegebau initialTab="vergleich" />;
  if (activeTab === 'bp_verkehr_bitumen') return <BpVerkehrswegebau initialTab="bindemittel" />;
  if (activeTab === 'bp_verkehr_pruefung') return <BpVerkehrswegebau initialTab="prueftechnik" />;
  if (activeTab === 'bp_verkehr_betondecken') return <BpVerkehrswegebau initialTab="betondecken" />;
  if (activeTab === 'bp_verkehr_tiefbau') return <BpVerkehrswegebau initialTab="tiefbau" />;
  if (activeTab === 'bp_verkehr_bahn') return <BpVerkehrswegebau initialTab="bahnbau" />;
  if (activeTab === 'bp_verkehr_tunnel') return <BpVerkehrswegebau initialTab="tunnelbau" />;
  if (activeTab === 'bp_abdichtung') return <BpAbdichtung />;
  if (activeTab === 'bp_daemmung') return <BpDaemmung />;
  if (activeTab === 'bp_putz_estrich') return <BpPutzEstrich />;
  if (activeTab === 'bp_holzprodukte') return <BpHolzprodukte />;
  if (activeTab === 'bp_dach_fassade') return <BpDachFassade />;
  if (activeTab === 'bp_befestigung') return <BpBefestigung />;
  if (activeTab === 'bp_kunststoffe') return <BpKunststoffe />;
  if (activeTab === 'bp_klebstoffe') return <BpKlebstoffe />;
  if (activeTab === 'bp_farben_lacke') return <BpFarbenLacke />;
  if (activeTab === 'bp_mineralisch') return <BpMineralisch />;
  if (activeTab === 'bp_glaeser') return <BpGlaeser />;
  if (activeTab === 'bp_metallisch') return <BpMetallisch />;
  if (activeTab === 'bp_betonzusatzmittel') return <BpBetonzusatzmittel />;
  if (activeTab === 'bp_stahlbauprofile') return <BpStahlbauprofile />;
  if (activeTab === 'bp_lehmbauprodukte') return <BpLehmbauprodukte />;
  if (activeTab === 'bp_baustoffindustrie') return <BpBaustoffindustrie />;
  if (activeTab === 'bp_innovationen') return <BpInnovationen />;

  // Cluster III: Entwurf & Bemessung
  if (activeTab === 'beton_a_z') return <BetonAZ />;
  if (activeTab === 'grundlagen') return <Grundlagen />;
  if (activeTab === 'bindemittel') return <Bindemittel />;
  if (activeTab === 'mischungsberechnung') return <Mischungsberechnung />;
  if (activeTab === 'herstellung_einbau') return <HerstellungEinbau />;
  if (activeTab === 'frischbeton') return <Frischbeton />;
  if (activeTab === 'hydratation_folgen') return <HydratationFolgen />;
  if (activeTab === 'nachbehandlung') return <Nachbehandlung />;
  if (activeTab === 'festbeton') return <Festbeton />;
  if (activeTab === 'sichtbeton') return <Sichtbeton />;
  if (activeTab === 'sonderbetone') return <Sonderbetone />;
  if (activeTab === 'innovative_werkstoffe') return <InnovativeWerkstoffe />;
  if (activeTab === 'qualitaetssicherung') return <Qualitaetssicherung />;
  if (activeTab === 'betonpraxis') return <Betonpraxis />;
  if (
    activeTab === 'stahlbeton_bemessung' ||
    activeTab === 'spannung' ||
    activeTab === 'biegebemessung' ||
    activeTab === 'querkraftbemessung' ||
    activeTab === 'stuetzenbemessung' ||
    activeTab === 'durchstanzen' ||
    activeTab === 'verankerungslaenge' ||
    activeTab === 'rissbreite'
  ) {
    return (
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
    );
  }
  if (activeTab === 'spannbeton') return <Spannbeton />;
  if (activeTab === 'wu-bauwerke') return <WUBauwerke />;
  if (activeTab === 'carbonbeton') return <Carbonbeton />;
  if (activeTab === 'zwang') return <ZwangCalculator />;
  if (activeTab === 'eigenspannungen') return <Eigenspannungen />;
  if (activeTab === 'kriechen') return <KriechenSchwinden />;
  if (activeTab === 'festigkeit') return <Festigkeitsberechnungen />;
  if (activeTab === 'innenausbau') return <Innenausbau />;
  if (activeTab === 'ausbau') return <Ausbau />;
  if (activeTab === 'holzbau_info') return <HolzbauBeta activeSubTab="info" />;
  if (activeTab === 'holzbau_werkstoffe') return <HolzbauBeta activeSubTab="werkstoffe" />;
  if (activeTab === 'holzbau_konstruktion') return <HolzbauBeta activeSubTab="konstruktion" />;
  if (activeTab === 'holzbau_bemessung') return <HolzbauBeta activeSubTab="bemessung" />;
  if (activeTab === 'holzbau_verbindung') return <HolzbauBeta activeSubTab="verbindung" />;
  if (activeTab === 'holzbau_bauphysik') return <HolzbauBeta activeSubTab="bauphysik" />;

  // Cluster IV: Bestand & Nachhaltigkeit
  if (activeTab === 'bestand') return <Bestand />;
  if (activeTab === 'bauwerkserfassung') return <Bauwerkserfassung />;
  if (activeTab === 'zfp' || activeTab === 'bauwerksuntersuchung') return <Bauwerksuntersuchung />;
  if (activeTab === 'historisch') return <HistorischeMaterialkennwerte />;
  if (activeTab === 'historische_bauweisen') return <HistorischeBauweisen />;
  if (activeTab === 'historische_bauprodukte') return <HistorischeBauprodukte />;
  if (activeTab === 'schadstoffe') return <Schadstoffe />;
  if (activeTab === 'ressourceneffizienz') return <Ressourceneffizienz />;
  if (activeTab === 'vdi6200') return <Zustandsbewertung />;
  if (activeTab === 'abfaelle') return <Abfaelle />;
  if (activeTab === 'rueckbau') return <Rueckbau />;
  if (activeTab === 'boden_materialaufbereitung') return <BodenMaterialAufbereitung />;
  if (activeTab === 'rueckbau_checklisten') return <RueckbauChecklisten />;
  if (activeTab === 'bestand_checklisten') return <BestandChecklisten />;
  if (activeTab === 'wta') return <WTA />;
  if (activeTab === 'denkmalpflege') return <Denkmalpflege />;
  if (activeTab === 'modernisierung') return <Modernisierung />;
  if (activeTab === 'dauerhaftigkeit') return <Dauerhaftigkeit />;
  if (activeTab === 'dauerhaftigkeit_checklisten') return <DauerhaftigkeitChecklisten />;
  if (activeTab === 'korrosion') return <Korrosion />;
  if (activeTab === 'holzkorrosion') return <Holzkorrosion />;
  if (activeTab === 'metallkorrosion') return <Metallkorrosion />;
  if (activeTab === 'weitere_organik') return <WeitereOrganik />;
  if (activeTab === 'schadreaktionen_beton') return <SchadreaktionenBeton />;
  if (activeTab === 'bauschaeden') return <Bauschaeden />;
  if (activeTab === 'schadensbilder') return <TypischeBauschaeden />;
  if (activeTab === 'material_schaeden_gross') return <MaterialSchaedenGross />;
  if (activeTab === 'bauwerksunters_monitoring') return <Bauwerksunters_Monitoring />;
  if (activeTab === 'schaeden_checklisten') return <SchaedenChecklisten />;
  if (activeTab === 'schutz_grundlagen') return <SchutzGrundlagen />;
  if (activeTab === 'instandhaltung') return <Stahlbetoninstandhaltung />;
  if (activeTab === 'instandsetzung_materialien' || activeTab === 'instandsetzung_holz' || activeTab === 'instandsetzung_metalle' || activeTab === 'instandsetzung_kunststoffe' || activeTab === 'instandsetzung_asphalt' || activeTab === 'instandsetzung_mauerwerk') {
    return (
      <InstandsetzungMaterialien
        initialMaterial={
          activeTab === 'instandsetzung_holz' ? 'holz' :
          activeTab === 'instandsetzung_metalle' ? 'metalle' :
          activeTab === 'instandsetzung_kunststoffe' ? 'kunststoffe' :
          activeTab === 'instandsetzung_asphalt' ? 'asphalt' :
          activeTab === 'instandsetzung_mauerwerk' ? 'mauerwerk' : undefined
        }
      />
    );
  }
  if (activeTab === 'instandsetzung_checklisten') return <InstandsetzungChecklisten />;
  if (activeTab === 'nachhaltigkeit_daten_regeln') return <NachhaltigkeitDatenRegeln />;
  if (activeTab === 'materialoptimierung') return <Materialoptimierung />;
  if (activeTab === 'nachhaltigkeit_checklisten') return <NachhaltigkeitChecklisten />;
  if (activeTab === 'oekobilanz_lca') return <OekobilanzLCA />;
  if (activeTab === 'zertifizierung_siegel') return <ZertifizierungSiegel />;
  if (activeTab === 'lebenszyklus_kosten') return <LebenszyklusKosten />;
  if (activeTab === 'ressourcen_umwelt') return <RessourcenUmwelt />;
  if (activeTab === 'kreislauf_dpp') return <Kreislaufwirtschaft />;
  if (activeTab === 'formaenderungen') return <Formaenderungen />;

  // Cluster V: Digitales, Praxis & Infos
  if (activeTab === 'bim_baustoffe') return <BimBaustoffe />;
  if (activeTab === 'materialdatenbanken') return <Materialdatenbanken />;
  if (activeTab === 'materialpaesse') return <Materialpaesse />;
  if (activeTab === 'dpp') return <DppEpd view="dpp" />;
  if (activeTab === 'ki_baustoffe') return <KiBaustoffe />;
  if (activeTab === 'ki_ueberblick') return <KiBaustoffe forceTab="ueberblick" />;
  if (activeTab === 'ki_system') return <KiBaustoffe forceTab="system" />;
  if (activeTab === 'ki_prompting') return <KiBaustoffe forceTab="prompting" />;
  if (activeTab === 'ki_llmpraxis') return <KiBaustoffe forceTab="llmpraxis" />;
  if (activeTab === 'ki_thesen') return <KiBaustoffe forceTab="thesen" />;
  if (activeTab === 'ki_recht_ethik') return <KiBaustoffe forceTab="recht_ethik" />;
  if (activeTab === 'ki_lokal') return <KiBaustoffe forceTab="lokal" />;
  if (activeTab === 'ki_ressourcen') return <KiBaustoffe forceTab="ressourcen" />;
  if (activeTab === 'ki_onlinekurse') return <KiBaustoffe forceTab="onlinekurse" />;
  if (activeTab === 'px_planung' || activeTab === 'px_bauleitung' || activeTab === 'px_produktion' || activeTab === 'px_karriere') {
    return <Praxiswissen />;
  }
  if (activeTab === 'px_bautagebuch') return <Bautagebuch />;
  if (activeTab === 'glossar') return <Glossar />;
  if (activeTab === 'informationsquellen') return <Informationsquellen />;
  if (activeTab === 'fortbildungen') return <Fortbildungen />;
  if (activeTab === 'literatur') return <Literatur />;
  if (activeTab === 'kuriositaeten') return <Kuriositaeten />;
  if (activeTab === 'software') return <Software />;
  if (activeTab === 'online_tools') return <OnlineTools />;

  // Cluster VI: Studium & Rechnungen
  if (activeTab.startsWith('aufgaben')) return <Aufgaben />;
  if (activeTab === 'rechnung_u_wert') return <Beispielrechnungen forceTab="u_wert" />;
  if (activeTab === 'rechnung_beton') return <Beispielrechnungen forceTab="beton" />;
  if (activeTab === 'rechnung_stahlbeton') return <Beispielrechnungen forceTab="stahlbeton" />;
  if (activeTab === 'rechnung_holzbau') return <Beispielrechnungen forceTab="holzbau" />;
  if (activeTab === 'rechnung_mauerwerk') return <Beispielrechnungen forceTab="mauerwerk" />;
  if (activeTab === 'rechnung_nachhaltigkeit') return <Beispielrechnungen forceTab="nachhaltigkeit" />;
  if (activeTab === 'rechnung_bestand') return <Beispielrechnungen forceTab="bestand" />;
  if (activeTab === 'rechnung_schallschutz') return <Beispielrechnungen forceTab="schallschutz" />;
  if (activeTab === 'rechnung_brandschutz') return <Beispielrechnungen forceTab="brandschutz" />;
  if (activeTab.startsWith('rechnung')) return <Beispielrechnungen />;
  if (activeTab === 'studium_tha') return <StudiumTHA />;
  if (activeTab.startsWith('weiter')) return <WeiterTHA />;
  if (activeTab === 'thesen_projekte') return <ThesenProjekte />;
  if (
    activeTab === 'vl_ueberblick' ||
    activeTab === 'vl_bauen_im_bestand' ||
    activeTab === 'vl_nachhaltiges_bauen' ||
    activeTab === 'vl_bauschaeden' ||
    activeTab === 'vl_baustoffkunde' ||
    activeTab === 'vl_instandhaltung'
  ) {
    return (
      <Vorlesungen
        forceTab={
          activeTab === 'vl_bauen_im_bestand'
            ? 'bauen_im_bestand'
            : activeTab === 'vl_nachhaltiges_bauen'
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
    );
  }

  // Fallback to Startseite
  return <Startseite />;
}
