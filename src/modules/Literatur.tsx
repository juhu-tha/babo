import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Library, 
  ExternalLink, 
  Search, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/literatur/Literatur.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

interface LiteratureEntry {
  id: string;
  title: string;
  subtitle?: string;
  authors: string;
  yearOrEdition: string;
  publisher: string;
  category: 'allgemein' | 'beton' | 'stahl' | 'holz' | 'mauerwerk' | 'bauphysik' | 'nachhaltigkeit' | 'journale';
  categoryLabel: string;
  badge: 'Standardwerk' | 'Grundlagenlehrbuch' | 'Bemessungspraxis' | 'Forschung & Vertiefung' | 'Fachjournal';
  isbnOrDoi?: string;
  url?: string;
  description: string;
  coreTopics: string[];
}

const LITERATURE_DATABASE: LiteratureEntry[] = [
  // 1. Allgemeine Baustoffkunde & Werkstoffwissenschaften
  {
    id: 'wendehorst_baustoffkunde',
    title: inhalt.werte.wendehorstBaustoffkunde,
    subtitle: inhalt.werte.grundlagenBaustoffeOberflächenschutzUnd,
    authors: inhalt.werte.nerothGVollenschaarD,
    yearOrEdition: inhalt.werte.t27Auflage2011,
    publisher: inhalt.werte.viewegTeubnerWiesbaden,
    category: 'allgemein',
    categoryLabel: inhalt.werte.allgemeineBaustoffkunde,
    badge: 'Standardwerk',
    isbnOrDoi: inhalt.werte.isbn97838351,
    url: 'https://link.springer.com/book/10.1007/978-3-8348-9919-4',
    description: inhalt.werte.dasUnangefochteneGrundlagenUnd,
    coreTopics: ['Bindemittel', 'Beton', 'Metalle', 'Kunststoffe', 'Holzwerkstoffe', 'Prüfverfahren', 'Dauerhaftigkeit']
  },
  {
    id: 'scholz_baustoffkenntnis',
    title: 'Baustoffkenntnis',
    subtitle: inhalt.werte.eigenschaftenHerstellungNormungUnd,
    authors: inhalt.werte.scholzWBegrFortgeführt,
    yearOrEdition: inhalt.werte.t18Auflage2016,
    publisher: inhalt.werte.bundesanzeigerVerlagWernerKöln,
    category: 'allgemein',
    categoryLabel: inhalt.werte.allgemeineBaustoffkunde2,
    badge: 'Standardwerk',
    isbnOrDoi: inhalt.werte.isbn97838462,
    description: inhalt.werte.enzyklopädischesLehrUndNachschlagewerk,
    coreTopics: ['Natursteine', 'Gesteinskörnungen', 'Kalk & Gips', inhalt.werte.bitumenAsphalt, 'Gefügekunde', 'Werkstoffprüfung']
  },
  {
    id: 'bendix_baustoffkunde',
    title: inhalt.werte.physikImBauwesen,
    subtitle: inhalt.werte.einEinführendesLehrbuchMit,
    authors: inhalt.werte.krawietzRHeimkeW,
    yearOrEdition: '2021',
    publisher: inhalt.werte.carlHanserVerlagMünchen,
    category: 'allgemein',
    categoryLabel: inhalt.werte.allgemeineBaustoffkunde3,
    badge: 'Grundlagenlehrbuch',
    isbnOrDoi: inhalt.werte.isbn9783446,
    description: inhalt.werte.einführendesLehrbuchZuDen,
    coreTopics: ['Mechanik', 'Wärme', 'Feuchte', 'Akustik', 'Rechenbeispiele']
  },
  {
    id: 'bargel_werkstoffkunde',
    title: 'Werkstoffkunde',
    subtitle: inhalt.werte.metalleKeramikenPolymereUnd,
    authors: inhalt.werte.bargelHJSchulze,
    yearOrEdition: inhalt.werte.t12Auflage2018,
    publisher: inhalt.werte.springerViewegBerlinHeidelberg,
    category: 'allgemein',
    categoryLabel: inhalt.werte.allgemeineBaustoffkunde4,
    badge: 'Forschung & Vertiefung',
    isbnOrDoi: inhalt.werte.isbn9783662,
    url: 'https://link.springer.com/book/10.1007/978-3-662-48629-0',
    description: inhalt.werte.dasKlassischeWerkstoffwissenschaftlicheS,
    coreTopics: ['Kristallographie', 'Eisen-Kohlenstoff-Diagramm', 'Bruchmechanik', 'Gefügelehre', 'Wärmebehandlung']
  },

  // 2. Betontechnologie, Zement & Bindemittel
  {
    id: 'locher_zement',
    title: inhalt.werte.zementGrundlagenDerHerstellung,
    subtitle: inhalt.werte.chemischeReaktionenKlinkermineralogieUnd,
    authors: inhalt.werte.locherFW,
    yearOrEdition: '2000',
    publisher: inhalt.werte.verlagBauTechnikDüsseldorf,
    category: 'beton',
    categoryLabel: inhalt.werte.betonZementBindemittel,
    badge: 'Standardwerk',
    isbnOrDoi: inhalt.werte.isbn97837640,
    description: inhalt.werte.dasReferenzwerkSchlechthinZur,
    coreTopics: [inhalt.werte.klinkerphasenC3sC2s, 'Hydratation', 'Erhärtungskinetik', 'Sulfatwiderstand', 'Zementchemie']
  },
  {
    id: 'stark_dauerhaftigkeit_beton',
    title: inhalt.werte.dauerhaftigkeitVonBeton,
    subtitle: inhalt.werte.umweltbeanspruchungenSchadensmechanismen,
    authors: inhalt.werte.starkJWichtB,
    yearOrEdition: inhalt.werte.t2Auflage2013,
    publisher: inhalt.werte.springerViewegBerlinHeidelberg2,
    category: 'beton',
    categoryLabel: inhalt.werte.betonZementBindemittel2,
    badge: 'Standardwerk',
    isbnOrDoi: inhalt.werte.isbn9783642,
    url: 'https://doi.org/10.1007/978-3-642-35278-2',
    description: inhalt.werte.tiefgründigeWissenschaftlicheAnalyseAlle,
    coreTopics: ['Karbonatisierung', 'Chloridkorrosion', 'AKR', 'Frost-Tau-Widerstand', 'Instandsetzung']
  },
  {
    id: 'beton_kalender',
    title: inhalt.werte.betonKalenderJahresreihen,
    subtitle: inhalt.werte.schwerpunkteDauerhaftigkeitHochleistungs,
    authors: inhalt.werte.bergmeisterKFingerloosF,
    yearOrEdition: inhalt.werte.jährlichNeuErscheinendeAusgabe,
    publisher: inhalt.werte.wilhelmErnstSohnBerlin,
    category: 'beton',
    categoryLabel: inhalt.werte.betonZementBindemittel3,
    badge: 'Bemessungspraxis',
    url: 'https://www.ernst-und-sohn.de/beton-kalender',
    description: inhalt.werte.zweibändigesHandbuchFürTragwerksplanung,
    coreTopics: ['Eurocode 2', 'Expositionsklassen', 'Rissbreitenbeschränkung', 'UHPC', 'Fertigteile']
  },
  {
    id: 'vdz_zement_taschenbuch',
    title: 'Zement-Taschenbuch',
    subtitle: inhalt.werte.praxiswissenZementUndBeton,
    authors: inhalt.werte.vereinDeutscherZementwerkeVdz,
    yearOrEdition: inhalt.werte.erscheinungsverlauf19492008Letzte,
    publisher: inhalt.werte.verlagBauTechnikDüsseldorf2,
    category: 'beton',
    categoryLabel: inhalt.werte.betonZementBindemittel4,
    badge: 'Standardwerk',
    description: inhalt.werte.dasKompakteTaschenbuchDer,
    coreTopics: ['CEM-Klassifikation', 'Wasserzementwert', 'Sieblinien', 'Konsistenzprüfung', 'Nachbehandlung']
  },

  // 3. Metallbau, Stahl & Korrosionsschutz
  {
    id: 'stahlbau_kalender',
    title: inhalt.werte.stahlbauKalenderJahresreihen,
    subtitle: inhalt.werte.schwerpunkteEurocode3Werkstoffauswahl,
    authors: inhalt.werte.kuhlmannUHrsg,
    yearOrEdition: inhalt.werte.jährlicheAusgabeErnstSohn,
    publisher: inhalt.werte.wilhelmErnstSohnBerlin2,
    category: 'stahl',
    categoryLabel: inhalt.werte.stahlMetalleKorrosionsschutz,
    badge: 'Bemessungspraxis',
    url: 'https://www.ernst-und-sohn.de/stahlbau-kalender',
    description: inhalt.werte.dasZentraleStandardnachschlagewerkFür,
    coreTopics: ['DIN EN 1993', inhalt.werte.dinEn10025, inhalt.werte.wetterfesteStähle, 'Feuerverzinken', 'Ermüdung']
  },
  {
    id: 'iser_merkblaetter',
    title: inhalt.werte.dokumentationenMerkblätterNichtrostender,
    subtitle: inhalt.werte.korrosionsverhaltenWerkstoffwahlUndVerar,
    authors: inhalt.werte.informationsstelleEdelstahlRostfreiIser,
    yearOrEdition: inhalt.werte.aktuelleFachpublikationenIserDüsseldorf,
    publisher: inhalt.werte.iserDüsseldorf,
    category: 'stahl',
    categoryLabel: inhalt.werte.stahlMetalleKorrosionsschutz2,
    badge: 'Standardwerk',
    url: 'https://www.edelstahl-rostfrei.de/',
    description: inhalt.werte.umfassendeWissenschaftlichFundierteRicht,
    coreTopics: [inhalt.werte.edelstahlA2A4, 'CRC-Klassen', inhalt.werte.lochfraßindexPren, 'Spannungsrisskorrosion', 'Fließregel']
  },

  // 4. Holzbau & Nachwachsende Baustoffe
  {
    id: 'neuhaus_holzbau',
    title: inhalt.werte.ingenieurholzbauGrundlagenBemessungNach,
    subtitle: inhalt.werte.holzwerkstoffeHolzschutzVerbindungenUnd,
    authors: 'Neuhaus, H.',
    yearOrEdition: inhalt.werte.neuauflage2026Vorauflage4,
    publisher: inhalt.werte.springerViewegWiesbaden,
    category: 'holz',
    categoryLabel: inhalt.werte.holzbauBiogeneWerkstoffe,
    badge: 'Standardwerk',
    isbnOrDoi: inhalt.werte.isbn9783658,
    description: inhalt.werte.umfassendesLehrbuchÜberDas,
    coreTopics: ['Anisotropie', inhalt.werte.eurocode5DinEn, inhalt.werte.holzschutzDin68800, inhalt.werte.brettsperrholzClt, 'Kriechen']
  },
  {
    id: 'infodienst_holz_schriften',
    title: inhalt.werte.informationsdienstHolzSchriftenreihe,
    subtitle: inhalt.werte.konstruktionsdetailsBrandUndSchallschutz,
    authors: inhalt.werte.informationsvereinHolzEV,
    yearOrEdition: inhalt.werte.umfangreicheFachschriftenreiheLaufendAkt,
    publisher: inhalt.werte.informationsdienstHolzBerlin,
    category: 'holz',
    categoryLabel: inhalt.werte.holzbauBiogeneWerkstoffe2,
    badge: 'Bemessungspraxis',
    url: 'https://informationsdienst-holz.de/',
    description: inhalt.werte.dieBedeutendsteDeutschsprachigeSchriften,
    coreTopics: [inhalt.werte.brandschutzImHolzbau, 'Schallschutz', inhalt.werte.mehrgeschossigerHolzbau, 'Holz-Beton-Verbund']
  },

  // 5. Mauerwerksbau, Mörtel & mineralische Bindemittel
  {
    id: 'mauerwerk_kalender',
    title: inhalt.werte.mauerwerkKalenderJahresreihen,
    subtitle: inhalt.werte.schwerpunkteEurocode6Steine,
    authors: inhalt.werte.jägerWHrsg,
    yearOrEdition: inhalt.werte.jährlicheAusgabeErnstSohn2,
    publisher: inhalt.werte.wilhelmErnstSohnBerlin3,
    category: 'mauerwerk',
    categoryLabel: inhalt.werte.mauerwerkSteineMörtel,
    badge: 'Bemessungspraxis',
    url: 'https://www.ernst-und-sohn.de/mauerwerk-kalender',
    description: inhalt.werte.dasMaßgeblicheNachschlagewerkFür,
    coreTopics: ['Eurocode 6', 'Mauerziegel', 'Kalksandstein', 'Porenbeton', 'Dünnbettmörtel', 'Schubfestigkeit']
  },

  // 6. Bauphysik, Energieeffizienz & Bauwerkserhaltung
  {
    id: 'wendehorst_bauphysik',
    title: inhalt.werte.lohmeyerPraktischeBauphysik,
    subtitle: inhalt.werte.eineEinführungMitBerechnungsbeispielen,
    authors: inhalt.werte.willemsWMU,
    yearOrEdition: inhalt.werte.auflage2024,
    publisher: inhalt.werte.springerViewegWiesbaden2,
    category: 'bauphysik',
    categoryLabel: inhalt.werte.bauphysikEnergieeffizienz,
    badge: 'Standardwerk',
    isbnOrDoi: inhalt.werte.isbn97836582,
    url: 'https://link.springer.com/book/10.1007/978-3-658-42604-0',
    description: inhalt.werte.etabliertesLehrbuchDerBauphysik,
    coreTopics: ['U-Wert-Berechnung', 'DIN 4108', 'Glaser-Diagramm', 'GEG', inhalt.werte.schallschutzDin4109, 'Wärmebrücken']
  },

  // 7. Nachhaltigkeit, Ökobilanzierung & Zirkuläres Bauen
  {
    id: 'hillebrandt_kreislauf',
    title: inhalt.werte.atlasRecyclingGebäudeAls,
    subtitle: inhalt.werte.manualeZurZirkulärenArchitektur,
    authors: inhalt.werte.hillebrandtARieglerFloors,
    yearOrEdition: '2018',
    publisher: inhalt.werte.editionDetailMünchen,
    category: 'nachhaltigkeit',
    categoryLabel: inhalt.werte.nachhaltigkeitZirkuläresBauen,
    badge: 'Standardwerk',
    isbnOrDoi: inhalt.werte.isbn978395553,
    description: inhalt.werte.dasWegweisendeFachbuchZum,
    coreTopics: [inhalt.werte.urbanMining, inhalt.werte.designForDeconstruction, 'Sortenreinheit', 'Materialpass', inhalt.werte.graueEnergie]
  },
  {
    id: 'essig_oekologische_baustoffkunde',
    title: inhalt.werte.zertifizierungssystemeFürGebäude,
    subtitle: inhalt.werte.nachhaltigkeitBewertenInternationalerSys,
    authors: inhalt.werte.ebertTEßigN,
    yearOrEdition: '2010',
    publisher: inhalt.werte.editionDetailMünchen2,
    category: 'nachhaltigkeit',
    categoryLabel: inhalt.werte.nachhaltigkeitZirkuläresBauen2,
    badge: 'Standardwerk',
    isbnOrDoi: inhalt.werte.isbn9783920034,
    description: inhalt.werte.vergleichInternationalerZertifizierungss,
    coreTopics: ['DGNB', 'BNB', 'LEED', 'BREEAM', 'Systemvergleich']
  },

  // 8. Glasbau, Fenstertechnik & Fassaden (Neu)
  {
    id: 'feldmann_kasper_glasbau',
    title: inhalt.werte.glasFürTragendeBauteile,
    authors: inhalt.werte.feldmannMKasperR,
    yearOrEdition: '2012',
    publisher: inhalt.werte.wernerVerlagKöln,
    category: 'allgemein',
    categoryLabel: inhalt.werte.glasFenstertechnik,
    badge: 'Bemessungspraxis',
    isbnOrDoi: inhalt.werte.isbn97838041,
    description: inhalt.werte.dasMassgeblichePraxishandbuchFür,
    coreTopics: ['DIN 18008', inhalt.werte.esgVsgTvg, 'Pendelschlagprüfung', 'Klimalasten', 'Absturzsicherung']
  },
  {
    id: 'wurm_glass_structures',
    title: inhalt.werte.glassStructuresDesignAnd,
    subtitle: inhalt.werte.konstruktiveGlasarchitekturPunkthalterun,
    authors: 'Wurm, J.',
    yearOrEdition: '2007',
    publisher: inhalt.werte.birkhäuserBasel,
    category: 'allgemein',
    categoryLabel: inhalt.werte.glasFenstertechnik2,
    badge: 'Standardwerk',
    isbnOrDoi: inhalt.werte.isbn97837643,
    description: inhalt.werte.internationalesGrundlagenwerkZurKonstruk,
    coreTopics: [inhalt.werte.structuralGlazing, 'Glasfassaden', 'Schalenstrukturen', 'Punkthalterungen']
  },

  // 9. Straßen- & Verkehrswegebau (Neu)
  {
    id: 'wendehorst_strassenbau',
    title: inhalt.werte.straßenbauStraßenbautechnik,
    authors: inhalt.werte.velskeSMentleinH,
    yearOrEdition: '2009',
    publisher: inhalt.werte.wernerVerlagKöln2,
    category: 'allgemein',
    categoryLabel: inhalt.werte.verkehrswegebauInfrastruktur,
    badge: 'Standardwerk',
    isbnOrDoi: inhalt.werte.isbn978380412,
    description: inhalt.werte.lehrbuchZuStraßenbauUnd,
    coreTopics: ['Oberbau', 'Asphaltbauweisen', 'Betonbauweisen', 'Baustoffe', 'RStO']
  },

  // 10. Fachzeitschriften & Internationale Journale
  {
    id: 'journal_beton_stahlbetonbau',
    title: inhalt.werte.betonUndStahlbetonbau,
    subtitle: inhalt.werte.internationaleFachzeitschriftFürMassivba,
    authors: inhalt.werte.wissenschaftlicherBeiratHerausgeber,
    yearOrEdition: inhalt.werte.monatlichErscheinendeZeitschriftErnst,
    publisher: inhalt.werte.wilhelmErnstSohnBerlin4,
    category: 'journale',
    categoryLabel: inhalt.werte.fachzeitschriftenJournale,
    badge: 'Fachjournal',
    isbnOrDoi: inhalt.werte.issn00059900,
    url: 'https://onlinelibrary.wiley.com/journal/14371006',
    description: inhalt.werte.führendesDeutschsprachigesFachorganFür,
    coreTopics: ['Peer-Reviewed', 'Massivbauforschung', inhalt.werte.co2ArmerBeton, 'Zustandsanalyse', 'Monitoring']
  },
  {
    id: 'journal_nbau',
    title: inhalt.werte.nbauNachhaltigBauen,
    subtitle: inhalt.werte.fachzeitschriftFürZirkuläresPlanen,
    authors: inhalt.werte.redaktionExpertenbeiratNbau,
    yearOrEdition: inhalt.werte.zweimonatlichErnstSohnWiley,
    publisher: inhalt.werte.ernstSohnWileyBerlin,
    category: 'journale',
    categoryLabel: inhalt.werte.fachzeitschriftenJournale2,
    badge: 'Fachjournal',
    url: 'https://nbau.org/',
    description: inhalt.werte.zukunftsweisendeFachzeitschriftFürDen,
    coreTopics: ['Zirkularität', 'ESG-Reporting', 'Sekundärrohstoffe', 'Taxonomie', 'Klimaneutralität']
  },
  {
    id: 'journal_ccr',
    title: inhalt.werte.cementAndConcreteResearch,
    subtitle: inhalt.werte.thePremierInternationalJournal,
    authors: inhalt.werte.scrivenerKEtAl,
    yearOrEdition: inhalt.werte.monatlichPeerReviewedElsevier,
    publisher: inhalt.werte.elsevierScienceOxford,
    category: 'journale',
    categoryLabel: inhalt.werte.fachzeitschriftenJournale3,
    badge: 'Fachjournal',
    isbnOrDoi: inhalt.werte.issn00088846,
    url: 'https://www.sciencedirect.com/journal/cement-and-concrete-research',
    description: inhalt.werte.dasInternationalEinflussreichsteWissensc,
    coreTopics: [inhalt.werte.globalImpact, 'LC3-Zemente', 'C-S-H-Nanostruktur', inhalt.werte.alkaliActivatedMaterials, 'Microscopy']
  },
  {
    id: 'journal_materials_and_structures',
    title: inhalt.werte.materialsAndStructuresRilem,
    subtitle: inhalt.werte.internationalUnionOfLaboratories,
    authors: inhalt.werte.rilemInternational,
    yearOrEdition: inhalt.werte.erscheintKontinuierlichSpringerNature,
    publisher: inhalt.werte.springerDordrecht,
    category: 'journale',
    categoryLabel: inhalt.werte.fachzeitschriftenJournale4,
    badge: 'Fachjournal',
    isbnOrDoi: inhalt.werte.issn13595997,
    url: 'https://link.springer.com/journal/11527',
    description: inhalt.werte.offiziellesJournalDesInternationalen,
    coreTopics: [inhalt.werte.rilemRecommendations, 'ZfP-Prüfmethoden', 'Rheologie', 'Langzeitbeständigkeit']
  }
];

export default function Literatur() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('alle');

  const categories = [
    { key: 'alle', label: 'Alle Werke' },
    { key: 'allgemein', label: inhalt.werte.allgBaustoffkunde },
    { key: 'beton', label: inhalt.werte.betonZement },
    { key: 'stahl', label: inhalt.werte.stahlMetalle },
    { key: 'holz', label: inhalt.werte.holzBiogen },
    { key: 'mauerwerk', label: 'Mauerwerk' },
    { key: 'bauphysik', label: 'Bauphysik' },
    { key: 'nachhaltigkeit', label: inhalt.werte.nachhaltigkeitLca },
    { key: 'journale', label: 'Fachzeitschriften' }
  ];

  const filteredLiterature = useMemo(() => {
    return LITERATURE_DATABASE.filter(item => {
      const matchesCategory = selectedCategory === 'alle' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.authors.toLowerCase().includes(q) ||
        item.publisher.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.coreTopics.some(t => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col gap-8" id="literatur-standardwerke-modul">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Library className="text-shiraz" size={24} /><MdText text={inhalt.texte.literaturStandardwerkeDerBaustofflehre} /></h2>
            <p className="text-xs text-home-grau mt-1"><MdText text={inhalt.texte.kuratierteWissenschaftlicheFachbibliothe} /></p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-shiraz/10 text-shiraz rounded-full text-xs font-bold border border-shiraz/20">
              {filteredLiterature.length} von {LITERATURE_DATABASE.length} Werken
            </span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p><MdText text={inhalt.texte.fundierteIngenieurentscheidungenUndWisse} /></p>
        </div>

        {/* Suchfeld und Kategoriefilter */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-home-grau" size={18} />
            <input 
              type="text"
              placeholder={inhalt.werte.suchenSieNachTitel}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-off-white border border-home-grau/30 rounded-xl text-sm text-text-main placeholder-home-grau focus:outline-none focus:ring-2 focus:ring-shiraz/40 focus:border-shiraz transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-home-grau hover:text-text-main font-semibold px-2 py-0.5 rounded"
              >
                Zurücksetzen
              </button>
            )}
          </div>

          {/* Kategorien-Tabs */}
          <AuswahlGruppe label="Kategorie" className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button {...alsOption(selectedCategory === cat.key)}
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  selectedCategory === cat.key
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </AuswahlGruppe>
        </div>
      </div>

      {/* Ergebnis-Raster */}
      {filteredLiterature.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-home-grau/30 text-center">
          <BookOpen className="text-home-grau mx-auto mb-3 opacity-50" size={40} />
          <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.keineLiteraturtrefferGefunden} /></h3>
          <p className="text-sm text-home-grau mt-1"><MdText text={inhalt.texte.versuchenSieEinenAllgemeineren} /></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLiterature.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 hover:border-shiraz/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Tag / Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-off-white border border-home-grau/25 text-text-main/80">
                    {item.categoryLabel}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    item.badge === 'Standardwerk' 
                      ? 'bg-shiraz/10 text-shiraz border border-shiraz/30' 
                      : item.badge === 'Bemessungspraxis' 
                        ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                        : item.badge === 'Fachjournal'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                </div>

                {/* Titel & Autoren */}
                <h3 className="text-base font-bold text-text-main leading-snug">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-text-main/70 mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                )}

                <div className="mt-2.5 text-xs text-shiraz font-semibold flex items-center gap-1.5">
                  <GraduationCap size={14} className="shrink-0" />
                  <span>{item.authors}</span>
                </div>

                <div className="text-[11px] text-home-grau mt-1">
                  {item.yearOrEdition} • {item.publisher}
                </div>

                {/* Beschreibung */}
                <p className="text-xs text-text-main/80 mt-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Themen-Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-home-grau/15">
                  {item.coreTopics.map((topic, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="text-[10px] px-2 py-0.5 bg-off-white text-text-main/70 rounded-md border border-home-grau/20"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fußleiste mit ISBN und externem Link */}
              <div className="mt-4 pt-3 border-t border-home-grau/20 flex items-center justify-between text-xs">
                <span className="text-[11px] text-home-grau font-mono">
                  {item.isbnOrDoi || 'Peer-Reviewed'}
                </span>
                {item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-shiraz hover:underline font-bold flex items-center gap-1"
                  ><MdText text={inhalt.texte.verlagQuelle} /><ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zitier- & Recherchehinweise für wissenschaftliche Arbeiten */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Sparkles className="text-shiraz" size={18} /><MdText text={inhalt.texte.leitfadenZumWissenschaftlichenZitieren} /></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text-main/80">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-shiraz" /><MdText text={inhalt.texte.t1PrimärquellenDinNormen} /></h4>
            <p className="leading-relaxed"><MdText text={inhalt.texte.zitierenSieBautechnischeKenndaten} /></p>
          </div>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Layers size={14} className="text-shiraz" /><MdText text={inhalt.texte.t2EpdsÖkobilanzdaten} /></h4>
            <p className="leading-relaxed"><MdText text={inhalt.texte.fürLebenszyklusanalysenUndÖkobilanzierun} /></p>
          </div>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.t3ZitierstandardNachDin} /></h4>
            <p className="leading-relaxed"><MdText text={inhalt.texte.verwendenSieFürAbschlussarbeiten} /></p>
          </div>
        </div>
      </div>

      {/* Standardisierter Modul-Footer */}
      <ModuleFooter
        wikipedia={[
          { title: 'Fachliteratur', url: 'https://de.wikipedia.org/wiki/Fachliteratur' },
          { title: 'Baustoff', url: 'https://de.wikipedia.org/wiki/Baustoff' },
          { title: inhalt.werte.wendehorstBautechnischeZahlentafeln, url: 'https://de.wikipedia.org/wiki/Wendehorst_Bautechnische_Zahlentafeln' }
        ]}
        literatur={inhalt.daten["Literatur.literatur"]}
        regelwerke={inhalt.daten["Literatur.regelwerke"]}
        weblinks={inhalt.daten["Literatur.weblinks"]}
        formeln={inhalt.daten["Literatur.formeln"]}
      />
    </div>
  );
}
