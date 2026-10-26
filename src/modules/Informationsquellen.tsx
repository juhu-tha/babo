import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  Building2, 
  Database, 
  Layers, 
  Info, 
  CheckCircle2, 
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { OerEncyclopedia } from '@/src/components/ui/OerEncyclopedia';
import { NormenLinkMonitor } from '@/src/components/ui/NormenLinkMonitor';
import inhalt from '@/content/informationsquellen/Informationsquellen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

// Robust, comprehensive evaluation data
interface DBRecord {
  id: string;
  name: string;
  category: 'Allgemein' | 'Baustoffe & Produkte' | 'Tragwerk & Holz' | 'Bauphysik & Altbau' | 'Schadstoffe & Praxis' | 'Nachhaltigkeit';
  discipline: string;
  publisher: string;
  accessibility: string;
  url?: string;
  isBeta?: boolean;
  standards: string[];
  evaluation: string;
  benefits: string[];
  relevance: string;
  tip: string;
}

const FREE_DATABASES: DBRecord[] = [
  {
    id: 'lfu_schadstoff',
    name: inhalt.werte.schadstoffratgeberGebäuderückbau,
    category: 'Schadstoffe & Praxis',
    discipline: inhalt.werte.laborAuswertung,
    publisher: inhalt.werte.bayerischesLandesamtFürUmwelt,
    accessibility: inhalt.werte.t100KostenfreiÖffentlichZugänglich,
    url: 'https://www.lfu.bayern.de/',
    standards: [inhalt.werte.vdi6202Blatt1, 'TRGS 519', 'LAbgBauVO'],
    evaluation: inhalt.werte.einHerausragendesFachbezogenesHilfsmitte,
    benefits: [
      inhalt.werte.genaueHandlungsanweisungZurSachgerechten,
      inhalt.werte.systematischeFührungZurSchadstoffkataste,
      inhalt.werte.praktischerLaborberichtÜbersetzerFür
    ],
    relevance: inhalt.werte.präventiverBauschutzUndVerhinderung,
    tip: inhalt.werte.unverzichtbarVorSanierungsOder
  },
  {
    id: 'wingis',
    name: inhalt.werte.wingisonlineGisbau,
    category: 'Schadstoffe & Praxis',
    discipline: 'PRAXISWISSEN',
    publisher: inhalt.werte.berufsgenossenschaftDerBauwirtschaftBg,
    accessibility: inhalt.werte.freiZugänglichAnmeldefreiOnline,
    standards: ['TRGS 500', 'GefStoffV', 'ArbSchG'],
    evaluation: inhalt.werte.dasFührendeGefahrstoffInformationssystem,
    benefits: [
      inhalt.werte.abfrageÜberStandardisierteGiscodes,
      inhalt.werte.exakteHandlungshilfenZuPsa,
      inhalt.werte.dokumentationsVorlagenZurGesetzlichen
    ],
    relevance: inhalt.werte.täglicherArbeitsschutzAufMontage,
    tip: inhalt.werte.bauleiterKönnenHierSofort
  },
  {
    id: 'weba',
    name: inhalt.werte.webaWebPortalBauphysikalische,
    category: 'Bauphysik & Altbau',
    discipline: inhalt.werte.bauphysikBauschäden,
    publisher: inhalt.werte.universitätStuttgartLehrstuhlFür,
    accessibility: inhalt.werte.kostenfreiesForschungsportal,
    url: 'https://www.uni-stuttgart.de/',
    standards: ['DIN 4108', 'WTA-Merkblätter', 'GEG'],
    evaluation: inhalt.werte.entwickeltVonBauphysikForschenden,
    benefits: [
      inhalt.werte.exemplarischeDetailzeichnungenSanierungs,
      inhalt.werte.widerstandsfähigeFeuchteschutzKonzepteZu,
      inhalt.werte.wissenschaftlichAbgesicherteKonstruktion
    ],
    relevance: inhalt.werte.thermischeErtüchtigungVonAltbauten,
    tip: inhalt.werte.hervorragendGeeignetZumStudium
  },
  {
    id: 'wecobis',
    name: 'WECOBIS',
    category: 'Baustoffe & Produkte',
    discipline: inhalt.werte.baustoffeDauerhaftigkeit,
    publisher: inhalt.werte.bundesinstitutFürBauStadt,
    accessibility: inhalt.werte.vollständigKostenfreiUndProduktneutral,
    url: 'https://www.wecobis.de/',
    standards: [inhalt.werte.dgnbKriterien, inhalt.werte.bnbSteckbriefe],
    evaluation: inhalt.werte.dasStaatlicheÖkologischeBaustoffinformat,
    benefits: [
      inhalt.werte.vollständigeProduktneutralitätZumSchutz,
      inhalt.werte.ausschreibungstexteZurMaterialökologisch,
      inhalt.werte.alterungsschutzUndEmissionsprofileÜber
    ],
    relevance: inhalt.werte.nachhaltigeWerkstoffwahlVermeidungFlücht,
    tip: inhalt.werte.nutzenSieDieTextlichen
  },
  {
    id: 'oekobaudat',
    name: 'ÖKOBAUDAT',
    category: 'Baustoffe & Produkte',
    discipline: inhalt.werte.bauprodukteEpd,
    publisher: inhalt.werte.bundesministeriumFürWohnenStadtentwicklu,
    accessibility: inhalt.werte.freiZugänglicheXmlCsv,
    url: 'https://www.oekobaudat.de/',
    standards: [inhalt.werte.dinEn15804, inhalt.werte.iso1404044],
    evaluation: inhalt.werte.dieOffizielleVerbindlicheReferenzdatenba,
    benefits: [
      inhalt.werte.verbindlichFürBnbBewertungen,
      inhalt.werte.umfangreicheExportschnittstellenFürPlanu,
      inhalt.werte.güteüberwachteDatensätzeVonHerstellern
    ],
    relevance: inhalt.werte.grundlageJederQualifiziertenGebäude,
    tip: inhalt.werte.erleichtertDieBerechnungDes
  },
  {
    id: 'bmwsb_portal',
    name: inhalt.werte.informationsportalNachhaltigesBauen,
    category: 'Allgemein',
    discipline: 'ALLGEMEIN',
    publisher: inhalt.werte.bundesministeriumFürWohnenStadtentwicklu2,
    accessibility: inhalt.werte.offiziellesBundesportalFreiZugänglich,
    url: 'https://www.nachhaltigesbauen.de/',
    standards: [inhalt.werte.leitfadenNachhaltigesBauen, 'GEG'],
    evaluation: inhalt.werte.dieZentraleÜbergeordneteAnlaufstelle,
    benefits: [
      inhalt.werte.offizielleStaatlicheLeitfädenZur,
      inhalt.werte.arbeitshilfenUndWerkzeugeFür,
      inhalt.werte.zusammenfassungAllerGesetzlichenUnd
    ],
    relevance: inhalt.werte.strategischesVerständnisFürRechtliche,
    tip: inhalt.werte.hervorragenderRechtlichBelastbarerEinsti
  },
  {
    id: 'bnb',
    name: inhalt.werte.bewertungssystemNachhaltigesBauenBnb,
    category: 'Allgemein',
    discipline: 'GRUNDLAGEN',
    publisher: inhalt.werte.bundesministeriumFürWohnenStadtentwicklu3,
    accessibility: inhalt.werte.kostenloseKriterienSteckbriefe,
    url: 'https://www.bnb-nachhaltigesbauen.de/',
    standards: ['BNB-Zertifizierungssystem'],
    evaluation: inhalt.werte.dasBnbIstEin,
    benefits: [
      inhalt.werte.vollständigTransparenteKriteriensteckbri,
      inhalt.werte.standardisierteBerechnungsmethodenFürLeb,
      inhalt.werte.konkreteZielwerteFürTreibhausgase
    ],
    relevance: inhalt.werte.strukturierteGanzheitlicheLebenszyklusan,
    tip: inhalt.werte.nutzenSieDieSteckbriefe
  },
  {
    id: 'beton_tech',
    name: inhalt.werte.betonOrgBetontechnologie,
    category: 'Tragwerk & Holz',
    discipline: 'BETONTECHNOLOGIE',
    publisher: inhalt.werte.informationszentrumBetonGmbh,
    accessibility: inhalt.werte.freiesBranchenUndKompetenzportal,
    url: 'https://www.beton.org/',
    standards: ['DIN EN 206', 'DIN 1045'],
    evaluation: inhalt.werte.dieTechnologischeEnzyklopädieRund,
    benefits: [
      inhalt.werte.kostenfreieHochkarätigeMerkblätterDer,
      inhalt.werte.mischungsrechnerUndAnleitungenZur,
      inhalt.werte.hilfsmittelZurQualitätssicherungAuf
    ],
    relevance: inhalt.werte.sichereAuslegungUndBaustellengerechte,
    tip: inhalt.werte.dieDortigenMerkblätterDer
  },
  {
    id: 'beton_stahl',
    name: inhalt.werte.betonOrgArchitekturpreisStahlbetonbau,
    category: 'Tragwerk & Holz',
    discipline: 'STAHLBETONBAU',
    publisher: inhalt.werte.informationszentrumBetonGmbhBund,
    accessibility: inhalt.werte.freieProjektdatenbank,
    url: 'https://www.architekturpreis-beton.de/',
    standards: ['Tragwerksentwurf', inhalt.werte.statischeDetailplanung],
    evaluation: inhalt.werte.dokumentiertBautechnischHerausragendeMit,
    benefits: [
      inhalt.werte.umfangreichesBildUndSchnittarchiv,
      inhalt.werte.detaillierteTragwerkanalysenDurchTragwer,
      inhalt.werte.inspirationFürInnovativeBetonkonstruktio
    ],
    relevance: inhalt.werte.syntheseAusHochbauästhetikMinimiertem,
    tip: inhalt.werte.idealZurRechercheInnovativer
  },
  {
    id: 'holz_mechanik',
    name: inhalt.werte.informationsdienstHolz,
    category: 'Tragwerk & Holz',
    discipline: inhalt.werte.mechanikBiogeneBaustoffe,
    publisher: inhalt.werte.holzbauDeutschlandFachverbandHolz,
    accessibility: inhalt.werte.kostenfreiesDownloadarchivAllerHolzbaute,
    url: 'https://informationsdienst-holz.de/',
    standards: [inhalt.werte.eurocode5DinEn, 'DIN 4102-4'],
    evaluation: inhalt.werte.dieNationalFührendeEnzyklopädie,
    benefits: [
      inhalt.werte.geprüfteMechanischStatischeDetailkatalog,
      inhalt.werte.detaillierteFachinformationenZuBiologisc,
      inhalt.werte.verifizierteRichtlinienZumÖkologischen
    ],
    relevance: inhalt.werte.co2SchonungDurchBiogene,
    tip: inhalt.werte.nutzenSieDieSchriftenreihe
  },
  {
    id: 'elca_lca',
    name: inhalt.werte.elcaThruDeDigitales,
    category: 'Nachhaltigkeit',
    discipline: inhalt.werte.nachhaltigkeitDigitales,
    publisher: inhalt.werte.bmwsbElcaUmweltbundesamtPrtr,
    accessibility: inhalt.werte.kostenloseWebanwendungenDerBundesrepubli,
    url: 'https://www.bauteileditor.de/',
    standards: [inhalt.werte.dinEn15978, 'PRTR-Verordnung'],
    evaluation: inhalt.werte.einAufeinanderAbgestimmtesDigitales,
    benefits: [
      inhalt.werte.elcaLeichtBedienbarerKostenloser,
      inhalt.werte.thruDeOffeneRecherche,
      inhalt.werte.exaktesTrackingVonEnergieträgern
    ],
    relevance: inhalt.werte.verknüpfungVonPlanungswerkzeugenMit,
    tip: inhalt.werte.mitElcaKönnenSemesterarbeiten
  },
  {
    id: 'bestand_portal',
    name: inhalt.werte.fachportalBauenImBestand,
    category: 'Bauphysik & Altbau',
    discipline: inhalt.werte.bauenImBestand,
    publisher: inhalt.werte.baunetzWissenEditorialTeam,
    accessibility: inhalt.werte.freiZugänglichWerbefinanziertRedaktionel,
    url: 'https://www.baunetzwissen.de/bauen-im-bestand',
    standards: ['Baualtersstufen', 'Denkmalrecht'],
    evaluation: inhalt.werte.eineDerRenommiertestenPlanungsdatenbanke,
    benefits: [
      inhalt.werte.detaillierteBaugeschichtsanalytischeErkl,
      inhalt.werte.dokumentierteKonstruktiveKnackpunkteMode,
      inhalt.werte.verknüpfungVonTragwerksfragenMit
    ],
    relevance: inhalt.werte.architektonischeInspirationZurCo2,
    tip: inhalt.werte.dientAlsIdealeArgumentationshilfe
  },
  {
    id: 'uba_publikationen',
    name: inhalt.werte.ubaPublikationenBauschädenSchadstoffe,
    category: 'Schadstoffe & Praxis',
    discipline: inhalt.werte.bauschädenInstandsetzung,
    publisher: inhalt.werte.umweltbundesamtUbaDeutschland,
    accessibility: inhalt.werte.kostenloseForschungsberichteMerkblätterU,
    url: 'https://www.umweltbundesamt.de/publikationen',
    standards: [inhalt.werte.ausschussZurGesundheitlichenBewertung],
    evaluation: inhalt.werte.dieBundesweiteWissenschaftlicheInstanz,
    benefits: [
      inhalt.werte.wissenschaftlichFundierteSanierungsschwe,
      inhalt.werte.umfangreicheLeitfädenZumUmweltschonenden,
      inhalt.werte.fachbücherUndStudienZum
    ],
    relevance: inhalt.werte.rechtsUndGesundheitssichereSanierung,
    tip: inhalt.werte.prüfenSieVorSanierungsanlagen
  },
  {
    id: 'madaster_germany',
    name: inhalt.werte.madasterDeutschlandMaterialkatasterCircu,
    category: 'Nachhaltigkeit',
    discipline: inhalt.werte.zirkuläresBauenDigitalisierung,
    publisher: inhalt.werte.madasterServicesGermanyGmbh,
    accessibility: inhalt.werte.zentralesOnlineKatasterFür,
    url: 'https://madaster.de/',
    standards: [inhalt.werte.dinEn159782, inhalt.werte.dgnbKriteriumEnv1, inhalt.werte.qngAnforderung],
    evaluation: inhalt.werte.dasGlobaleKatasterFür,
    benefits: [
      inhalt.werte.digitalerGebäuderessourcenpassNachEu,
      inhalt.werte.messungVonZirkularitätCo,
      inhalt.werte.automatischerImportVonIfc
    ],
    relevance: inhalt.werte.werterhaltUndUrbanMining,
    tip: inhalt.werte.unverzichtbarZurErfüllungDer
  },
  {
    id: 'concular_portal',
    name: inhalt.werte.concularZirkuläreMaterialvermittlungÖkob,
    category: 'Nachhaltigkeit',
    discipline: inhalt.werte.sekundärbaustoffePraxis,
    publisher: inhalt.werte.concularGmbh,
    accessibility: inhalt.werte.plattformFürZirkuläresBauen,
    url: 'https://concular.de/',
    standards: ['VDI 6210', inhalt.werte.dinSpec91484],
    evaluation: inhalt.werte.führendeDeutschePlattformFür,
    benefits: [
      inhalt.werte.gezielteIdentifikationUndPrüfung,
      inhalt.werte.coUndKosteneinsparungsberechnungIm,
      inhalt.werte.rechtlichBelastbareBegleitungBei
    ],
    relevance: inhalt.werte.reduktionVonPrimärrohstoffenUnd,
    tip: inhalt.werte.idealZurVorbereitungVon
  },
  {
    id: 'dgnb_navigator',
    name: inhalt.werte.dgnbNavigatorBauproduktePlattform,
    category: 'Baustoffe & Produkte',
    discipline: inhalt.werte.baustoffeDauerhaftigkeit2,
    publisher: inhalt.werte.deutscheGesellschaftFürNachhaltiges,
    accessibility: inhalt.werte.öffentlichUndKostenfreiRecherchierbar,
    url: 'https://www.dgnb-navigator.de/',
    standards: [inhalt.werte.dgnbZertifizierungssystem, inhalt.werte.dinEn158042],
    evaluation: inhalt.werte.dieUmfassendeBaustoffUnd,
    benefits: [
      inhalt.werte.direkteZuordnungDerBauprodukte,
      inhalt.werte.vollständigeEpdsSicherheitsdatenblätterU,
      inhalt.werte.filterungNachRegionalenProdukten
    ],
    relevance: inhalt.werte.schnelleAuswahlNachweislichNachhaltiger,
    tip: inhalt.werte.prüfenSieHierBaustoffe
  },
  {
    id: 'fraunhofer_irb',
    name: inhalt.werte.fraunhoferIrbBaufachinformation,
    category: 'Allgemein',
    discipline: inhalt.werte.bauforschungTechnik,
    publisher: inhalt.werte.fraunhoferInformationszentrumRaumUnd,
    accessibility: inhalt.werte.zentraleForschungsUndLiteraturdatenbank,
    url: 'https://www.baufachinformation.de/',
    standards: ['Zukunft Bau', 'Bauforschungsberichte'],
    evaluation: inhalt.werte.dieFührendeFachdatenbankFür,
    benefits: [
      inhalt.werte.umfassendesVerzeichnisVonBauforschungsbe,
      inhalt.werte.bauschadensfälleMitDetaillierterFehlerur,
      inhalt.werte.verbindungVonBaustoffkundeMit
    ],
    relevance: inhalt.werte.standDerTechnikUnd,
    tip: inhalt.werte.hervorragendGeeignetFürRecherchen
  }
];

// Existing categorical associations for the secondary view
const DETAILED_VERBAENDE = inhalt.daten.DETAILED_VERBAENDE;

export default function Informationsquellen() {
  const [activeSubTab, setActiveSubTab] = useState<'evaluation' | 'verbaende' | 'oer_enzyklopaedie' | 'monitor'>('evaluation');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  
  // 1. Dynamic filtering of evaluated repositories
  const filteredDBs = FREE_DATABASES.filter(db => {
    const matchesSearch = db.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          db.publisher.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          db.evaluation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          db.discipline.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Alle' || db.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Alle', 'Allgemein', inhalt.werte.baustoffeProdukte, inhalt.werte.tragwerkHolz, inhalt.werte.bauphysikAltbau, inhalt.werte.schadstoffePraxis, 'Nachhaltigkeit'];

  return (
    <div className="flex flex-col gap-6" id="fachdatenbanken-modul">
      
      {/* Header introduction component */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-shiraz" size={28} />
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.fachdatenbankenInfoPortale} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.umfassendeEvaluationDeutscherKostenfreie} /></p>
        </div>
        </div>
        <p className="text-text-main/80 text-sm leading-relaxed max-w-4xl"><MdText text={inhalt.texte.dieBewältigungNachhaltigerBau} /></p>

      </div>

      <ModuleTabs
        label={inhalt.werte.bereicheInformationsquellen}
        tabs={[
          { id: 'evaluation' as const, label: inhalt.texte.t1DatenbankEvaluation, icon: Database },
          { id: 'verbaende' as const, label: inhalt.texte.t2ZusätzlicheFachverbändeVerbände, icon: Building2 },
          { id: 'oer_enzyklopaedie' as const, label: inhalt.texte.t3OerEnzyklopädie, icon: BookOpen },
          { id: 'monitor' as const, label: inhalt.texte.t4NormenLinkAktualitätsmonitor, icon: ShieldCheck },
        ]}
        aktiv={activeSubTab}
        onWechsel={setActiveSubTab}
        className="flex flex-col gap-6"
      >
      {/* VIEW 1: Database Evaluation Directory */}
      {activeSubTab === 'evaluation' && (
        <div className="space-y-6">
          
          {/* Filters card */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-home-grau" size={16} />
              <input
                type="text"
                placeholder={inhalt.werte.suchenSieNachSystemen}
                className="w-full pl-9 pr-4 py-2 border border-home-grau/30 rounded-lg focus:outline-none focus:border-shiraz bg-off-white text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Horizontal Categories */}
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition-all ${
                    selectedCategory === cat
                      ? 'bg-shiraz text-white border-shiraz'
                      : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-home-grau/10'
                  }`}
                >
                  {cat === 'Alle' ? inhalt.werte.alleDisziplinen : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Listings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDBs.map((db) => (
              <div 
                key={db.id} 
                className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm hover:border-shiraz/35 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  
                  {/* Title & Metadata row */}
                  <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-home-grau/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-shiraz">
                          {db.name}
                        </h4>
                        {db.isBeta && (
                          <span className="bg-rose-100 text-rose-800 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-xs">
                            BETA
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-semibold text-shiraz uppercase tracking-wider block mt-0.5">
                        {db.discipline}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold shrink-0">
                      {db.category}
                    </span>
                  </div>

                  {/* Institution publisher */}
                  <div className="bg-slate-50 border border-home-grau/30 p-2.5 rounded-lg mb-4 flex items-center gap-2 text-[11px] text-slate-600">
                    <Building2 size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider leading-none"><MdText text={inhalt.texte.herausgeberBetreiber} /></span>
                      <strong className="text-slate-800 font-semibold">{db.publisher}</strong>
                    </div>
                  </div>

                  {/* Core Evaluation statement */}
                  <p className="text-xs text-text-main/80 leading-relaxed font-normal mb-4">
                    {db.evaluation}
                  </p>

                  {/* Bullet Benefits List */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Kernvorteile:</span>
                    {db.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-text-main">
                        <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Standard reference badges */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {db.standards.map((std, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-800 border border-indigo-100 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {std}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Footer bar with URL trigger and tip */}
                <div className="mt-4 pt-3 border-t border-home-grau/10 flex flex-col gap-2 bg-slate-50/50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                  <div className="text-[10px] text-slate-500 italic flex gap-1 items-start leading-normal">
                    <Info size={12} className="text-shiraz shrink-0 mt-0.5" />
                    <div>
                      <strong>Praxis-Bezug:</strong> {db.relevance}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-200/50 p-1 px-1.5 rounded text-center">
                      {db.accessibility}
                    </span>
                    {db.url ? (
                      <a 
                        href={db.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-white border border-home-grau/30 hover:border-shiraz/50 rounded-lg text-[11px] font-bold text-slate-800 hover:text-shiraz transition-all shadow-sm"
                      ><MdText text={inhalt.texte.datenbankÖffnen} /><ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-slate-50 border border-home-grau/20 rounded-lg text-[11px] font-medium text-slate-500"><MdText text={inhalt.texte.informationFachliteratur} /></span>
                    )}
                  </div>
                </div>

              </div>
            ))}
            {filteredDBs.length === 0 && (
              <div className="col-span-1 lg:col-span-2 bg-white p-12 text-center rounded-2xl border border-home-grau/30 text-home-grau text-xs"><MdText text={inhalt.texte.keinePassendenInformationsportaleFür} />{searchQuery}<MdText text={inhalt.texte.gefundenInDerEvaluation} /></div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: Association list */}
      {activeSubTab === 'verbaende' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
          <div className="border-b border-home-grau/10 pb-4">
            <h3 className="text-lg font-bold text-text-main"><MdText text={inhalt.texte.ergänzendeDeutscheFachverbändePortale} /></h3>
            <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.nebenStaatlichenPortalenBieten} /></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DETAILED_VERBAENDE.map((cat, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider border-b border-home-grau/25 pb-1 flex items-center gap-1.5">
                  <Layers size={14} /> {cat.kategorie}
                </h4>
                
                <div className="space-y-3">
                  {cat.items.map((item, itemIdx) => (
                    <a
                      key={itemIdx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-4 bg-off-white border border-home-grau/15 hover:border-shiraz/30 hover:bg-white rounded-xl transition-all shadow-xs"
                    >
                      <div className="font-bold text-xs text-slate-800 flex items-center justify-between gap-1 mb-1 group-hover:text-shiraz">
                        <span>{item.name}</span>
                        <ExternalLink size={12} className="text-slate-400 group-hover:text-shiraz" />
                      </div>
                      <p className="text-[11px] text-slate-600 leading-normal font-normal">
                        {item.beschreibung}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'oer_enzyklopaedie' && (
        <OerEncyclopedia />
      )}

      {activeSubTab === 'monitor' && (
        <NormenLinkMonitor />
      )}

      </ModuleTabs>

      {/* Footer list */}
      <ModuleFooter 
        wikipedia={[
          { title: inhalt.werte.umweltproduktdeklarationEpd },
          { title: inhalt.werte.gefahrstoffverordnungGefstoffv, url: 'https://de.wikipedia.org/wiki/Gefahrstoffverordnung' },
          { title: inhalt.werte.urbanMining, url: 'https://de.wikipedia.org/wiki/Urban_Mining' }
        ]}
        normIds={['DIN_EN_15804', 'GEG_2024']}
        regelwerke={inhalt.daten["Informationsquellen.regelwerke"]}
        literatur={inhalt.daten["Informationsquellen.literatur"]}
        weblinks={inhalt.daten["Informationsquellen.weblinks"]}
        formeln={inhalt.daten["Informationsquellen.formeln"]}
      />
    </div>
  );
}
