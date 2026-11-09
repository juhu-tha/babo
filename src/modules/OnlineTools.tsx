import React, { useState, useMemo } from 'react';
import { formatDeZahl } from '@/src/utils/numberFormat';
import { 
  ExternalLink, 
  Search, 
  Layers, 
  Activity, 
  Leaf, 
  Box, 
  Globe, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  Code
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import inhalt from '@/content/onlinetools/OnlineTools.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';
import { ErgebnisAnsage } from '@/src/components/ui/ErgebnisAnsage';

interface ToolItem {
  id: string;
  name: string;
  category: 'statik' | 'bauphysik' | 'holzbau' | 'lca' | 'bim' | 'geotechnik';
  categoryLabel: string;
  language: 'DT' | 'ENG' | 'DT / ENG';
  accessType: 'Direkt im Web' | 'Kostenlose Cloud' | 'Freeware / Open Source' | 'Offizielle Behörde / API';
  recommendationBadge?: 'Standard im Büro' | 'Didaktisch wertvoll' | 'Forschung & Master' | 'Offizieller Standard';
  url?: string;
  shortDesc: string;
  detailedFeatures: string[];
  standards: string;
  institutionOrAuthor: string;
}

const ONLINE_TOOLS: ToolItem[] = [
  // 1. Statik & Strukturmechanik
  {
    id: 'mastan2',
    name: inhalt.werte.mastan2WebMastan,
    category: 'statik',
    categoryLabel: inhalt.werte.statikTragwerk,
    language: 'ENG',
    accessType: 'Freeware / Open Source',
    recommendationBadge: 'Didaktisch wertvoll',
    url: 'https://www.mastan2.com/',
    shortDesc: inhalt.werte.interaktive1d2d3d,
    detailedFeatures: [
      inhalt.werte.lineareUndGeometrischNichtlineare,
      inhalt.werte.elastoPlastischeGelenkbildungUnd,
      inhalt.werte.modaleEigenwertanalyseUndStabilitätsnach,
      inhalt.werte.lehrstuhlerprobtDurchProfMcguire
    ],
    standards: inhalt.werte.aiscEurocode3Konform,
    institutionOrAuthor: inhalt.werte.bucknellUniversityProfR
  },
  {
    id: 'skyciv_beam',
    name: inhalt.werte.skycivFreeBeamTruss,
    category: 'statik',
    categoryLabel: inhalt.werte.statikTragwerk2,
    language: 'DT / ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Standard im Büro',
    url: 'https://skyciv.com/free-beam-calculator/',
    shortDesc: inhalt.werte.schnelleEinfeldUndMehrfeldträgerberechnu,
    detailedFeatures: [
      inhalt.werte.visualisierungVonBiegemomentenQuerkraft,
      inhalt.werte.punktDreiecksUndStreckenlasten,
      inhalt.werte.spannungsnachweisFürStandardStahl,
      inhalt.werte.keineInstallationNötigLäuft
    ],
    standards: inhalt.werte.eurocodeAiscAs,
    institutionOrAuthor: inhalt.werte.skycivCloudStructuralEngineering
  },
  {
    id: 'dlubal_cross_section',
    name: inhalt.werte.dlubalOnlineQuerschnittswerte,
    category: 'statik',
    categoryLabel: inhalt.werte.statikTragwerk3,
    language: 'DT / ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Standard im Büro',
    url: 'https://www.dlubal.com/de/querschnittswerte/',
    shortDesc: inhalt.werte.querschnittsUndProfilwertdatenbankFür,
    detailedFeatures: [
      inhalt.werte.exakteQuerschnittswerteAIy,
      inhalt.werte.klassifizierungNachEurocode3,
      inhalt.werte.interaktiveSpannungsermittlungBeiKombini,
      inhalt.werte.kostenloseNutzungOhneRegistrierung
    ],
    standards: inhalt.werte.dinEn19931,
    institutionOrAuthor: inhalt.werte.dlubalSoftwareGmbh
  },
  {
    id: 'dlubal_geozones',
    name: inhalt.werte.dlubalGeoZoneTool,
    category: 'statik',
    categoryLabel: inhalt.werte.statikTragwerk4,
    language: 'DT / ENG',
    accessType: 'Direkt im Web',
    url: 'https://www.dlubal.com/en/support-and-learning/service/geo-zone-tool-snow-wind-and-seismic-zone-maps',
    recommendationBadge: 'Standard im Büro',
    shortDesc: inhalt.werte.standortbezogeneDigitaleAbfrageVon,
    detailedFeatures: [
      inhalt.werte.genaueErmittlungDerCharakteristischen,
      inhalt.werte.inklusiveGeländehöheÜberNormalnull,
      inhalt.werte.erdbebenzonenUndUntergrundklassenNach,
      inhalt.werte.direkteKartenverortungPerPostleitzahl
    ],
    standards: inhalt.werte.dinEn19911,
    institutionOrAuthor: inhalt.werte.dlubalSoftwareGmbh2
  },
  {
    id: 'calcpad',
    name: inhalt.werte.calcpadParametrischeStatikMath,
    category: 'statik',
    categoryLabel: inhalt.werte.statikTragwerk5,
    language: 'ENG',
    accessType: 'Freeware / Open Source',
    recommendationBadge: 'Standard im Büro',
    url: 'https://calcpad.eu/',
    shortDesc: inhalt.werte.openSourcePlattformFür,
    detailedFeatures: [
      inhalt.werte.parametrischeEingabeMathematischerText,
      inhalt.werte.umfangreicheModellbibliothekFürEurocode,
      inhalt.werte.erzeugungProfessionellerPrüffähigerStati,
      inhalt.werte.desktopAnwendungSowieKostenlose
    ],
    standards: inhalt.werte.eurocodes0Bis8,
    institutionOrAuthor: inhalt.werte.calcpadCommunityOpenSource
  },
  {
    id: 'eurocode_applied',
    name: 'EurocodeApplied.com',
    category: 'statik',
    categoryLabel: inhalt.werte.statikTragwerk6,
    language: 'ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Didaktisch wertvoll',
    url: 'https://eurocodeapplied.com/',
    shortDesc: inhalt.werte.kostenloseWebApplikationenZur,
    detailedFeatures: [
      inhalt.werte.ec0LastkombinationsgeneratorFürStändige,
      inhalt.werte.ec1WindUndSchneelastzonenermittlung,
      inhalt.werte.ec2BiegungMitLängskraft,
      inhalt.werte.transparenteRechenwegeMitGleichungsrefer
    ],
    standards: inhalt.werte.dinEn1990Din,
    institutionOrAuthor: inhalt.werte.eurocodeappliedPlatform
  },

  // 2. Bauphysik & Feuchteschutz
  {
    id: 'ubakus',
    name: inhalt.werte.ubakusEhemalsUWert,
    category: 'bauphysik',
    categoryLabel: inhalt.werte.bauphysikFeuchteschutz,
    language: 'DT / ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Standard im Büro',
    url: 'https://www.ubakus.de/',
    shortDesc: inhalt.werte.verbreiteterOnlineRechnerFür,
    detailedFeatures: [
      inhalt.werte.berechnungDesWärmedurchgangskoeffiziente,
      inhalt.werte.periodischesFeuchteschutzverfahrenNachDi,
      inhalt.werte.sommerlicherHitzeschutzPhasenverschiebun,
      inhalt.werte.riesigeBaustoffdatenbankMitHerstellerspe
    ],
    standards: inhalt.werte.dinEnIso6946,
    institutionOrAuthor: inhalt.werte.ubakusRalfPlag
  },
  {
    id: 'lbnl_therm',
    name: inhalt.werte.lbnlTherm2dHeat,
    category: 'bauphysik',
    categoryLabel: inhalt.werte.bauphysikFeuchteschutz2,
    language: 'ENG',
    accessType: 'Freeware / Open Source',
    recommendationBadge: 'Forschung & Master',
    url: 'https://windows.lbl.gov/software/therm',
    shortDesc: inhalt.werte.t2dWärmestromFiniteElemente,
    detailedFeatures: [
      inhalt.werte.exakteFiniteElementeSimulation,
      inhalt.werte.berechnungDesLängenbezogenenWärmedurchga,
      inhalt.werte.ermittlungDesMinimalenTemperaturfaktors,
      inhalt.werte.wissenschaftlichValidiertUndWeltweit
    ],
    standards: inhalt.werte.dinEnIso10211,
    institutionOrAuthor: inhalt.werte.lawrenceBerkeleyNationalLaboratory
  },
  {
    id: 'onebuilding_weather',
    name: inhalt.werte.climateOnebuildingEpwWeather,
    category: 'bauphysik',
    categoryLabel: inhalt.werte.bauphysikFeuchteschutz3,
    language: 'ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Forschung & Master',
    url: 'https://climate.onebuilding.org/',
    shortDesc: inhalt.werte.globaleStündlicheWetterdatensätzeEpw,
    detailedFeatures: [
      inhalt.werte.kostenloseBereitstellungWeltweiterTestre,
      inhalt.werte.stündlicheWerteFürAußentemperatur,
      inhalt.werte.essentiellFürInstationäreGeg,
      inhalt.werte.openSourceUndFrei
    ],
    standards: inhalt.werte.ashraeIso159274,
    institutionOrAuthor: inhalt.werte.onebuildingConsortium
  },
  {
    id: 'wufi_light',
    name: inhalt.werte.fraunhoferIbpWufiWärme,
    category: 'bauphysik',
    categoryLabel: inhalt.werte.bauphysikFeuchteschutz4,
    language: 'DT / ENG',
    accessType: 'Freeware / Open Source',
    recommendationBadge: 'Forschung & Master',
    url: 'https://wufi.de/',
    shortDesc: inhalt.werte.verbreitetesSimulationsprogrammFürDen,
    detailedFeatures: [
      inhalt.werte.berechnungInstationärerFeuchteprofileUnt,
      inhalt.werte.exakterNachweisVonTrocknungsverhalten,
      inhalt.werte.umfassendeBaustoffdatenbankMitGemessenen,
      inhalt.werte.kostenloseEinstiegsversionenWufiLight
    ],
    standards: inhalt.werte.dinEn15026Wta,
    institutionOrAuthor: inhalt.werte.fraunhoferInstitutFürBauphysik
  },

  // 3. Holzbau & Holzwerkstoffe
  {
    id: 'dataholz',
    name: inhalt.werte.dataholzEuBauteilkatalogHolzbau,
    category: 'holzbau',
    categoryLabel: 'Holzbau',
    language: 'DT',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Standard im Büro',
    url: 'https://www.dataholz.eu/',
    shortDesc: inhalt.werte.onlineBauteilkatalogDerHolzforschung,
    detailedFeatures: [
      inhalt.werte.wandDeckenUndDachaufbauten,
      inhalt.werte.ökologischeKennwerteJeAufbau,
      inhalt.werte.herstellerneutralAnerkennungInDeutschen,
      inhalt.werte.schichtaufbautenDirektAlsPdf
    ],
    standards: inhalt.werte.dinEn19951,
    institutionOrAuthor: inhalt.werte.holzforschungAustriaHfa
  },

  // 4. LCA & Ökobilanzierung
  {
    id: 'oekobaudat',
    name: inhalt.werte.ökobaudatPlattform,
    category: 'lca',
    categoryLabel: inhalt.werte.lcaÖkobilanz,
    language: 'DT / ENG',
    accessType: 'Offizielle Behörde / API',
    recommendationBadge: 'Offizieller Standard',
    url: 'https://www.oekobaudat.de/',
    shortDesc: inhalt.werte.offizielleBundesdatenbankFürStandardisie,
    detailedFeatures: [
      inhalt.werte.über1500Geprüfte,
      inhalt.werte.lebenszyklusphasenA1A3Herstellung,
      inhalt.werte.öffentlicheRestApiFür,
      inhalt.werte.verpflichtendeGrundlageFürQng
    ],
    standards: inhalt.werte.dinEn15804A2,
    institutionOrAuthor: inhalt.werte.bundesministeriumFürWohnenStadtentwicklu
  },
  {
    id: 'wecobis',
    name: inhalt.werte.wecobisÖkologischesBaustoffportal,
    category: 'lca',
    categoryLabel: inhalt.werte.lcaÖkobilanz2,
    language: 'DT',
    accessType: 'Offizielle Behörde / API',
    recommendationBadge: 'Offizieller Standard',
    url: 'https://www.wecobis.de/',
    shortDesc: inhalt.werte.offiziellesBaustoffinformationssystemDes,
    detailedFeatures: [
      inhalt.werte.fundierteInformationenZuEmissionen,
      inhalt.werte.baustoffgruppenVonRohbauBis,
      inhalt.werte.verknüpfungMitDemBewertungssystem,
      inhalt.werte.fundierteLeitfädenZurSchadstoffvermeidun
    ],
    standards: inhalt.werte.bnbKriterienAgbbBewertungsschema,
    institutionOrAuthor: inhalt.werte.bmwsbBundesinstitutFürBau
  },
  {
    id: 'ec3_tool',
    name: inhalt.werte.ec3ToolEmbodiedCarbon,
    category: 'lca',
    categoryLabel: inhalt.werte.lcaÖkobilanz3,
    language: 'ENG',
    accessType: 'Kostenlose Cloud',
    recommendationBadge: 'Standard im Büro',
    url: 'https://www.buildingtransparency.org/',
    shortDesc: inhalt.werte.cloudPlattformZurQuantifizierung,
    detailedFeatures: [
      inhalt.werte.umfangreicheDatenbankDigitalisierterEpds,
      inhalt.werte.vergleichVonAlternativenBetonrezepturen,
      inhalt.werte.exportVonBauteilEmissionswerten,
      inhalt.werte.kostenlosFürPlanerBauherren
    ],
    standards: inhalt.werte.iso14025En15804,
    institutionOrAuthor: inhalt.werte.buildingTransparency
  },
  {
    id: 'openlca',
    name: inhalt.werte.openlcaSoftwareDaten,
    category: 'lca',
    categoryLabel: inhalt.werte.lcaÖkobilanz4,
    language: 'DT / ENG',
    accessType: 'Freeware / Open Source',
    recommendationBadge: 'Forschung & Master',
    url: 'https://www.openlca.org/',
    shortDesc: inhalt.werte.openSourceSoftwareFür,
    detailedFeatures: [
      inhalt.werte.vollständigeModellierungVonStoff,
      inhalt.werte.kompatibelMitEcoinventGabi,
      inhalt.werte.detaillierteSensitivitätsanalysenUndPara,
      inhalt.werte.t100OpenSourceOhne
    ],
    standards: inhalt.werte.iso14040Iso14044,
    institutionOrAuthor: inhalt.werte.greendeltaBerlin
  },
  {
    id: 'madaster_platform',
    name: inhalt.werte.madasterMaterialPassportPlatform,
    category: 'lca',
    categoryLabel: inhalt.werte.lcaÖkobilanz5,
    language: 'DT / ENG',
    accessType: 'Kostenlose Cloud',
    recommendationBadge: 'Standard im Büro',
    url: 'https://madaster.de/',
    shortDesc: inhalt.werte.kommerziellePlattformFürMaterialpässe,
    detailedFeatures: [
      inhalt.werte.automatisierteGenerierungDigitalerMateri,
      inhalt.werte.berechnungDesMadasterCircularity,
      inhalt.werte.toxizitätsbewertungUndNachweisRückbaubar,
      inhalt.werte.bimIntegrationFürIfc
    ],
    standards: inhalt.werte.dinEn15978Ellen,
    institutionOrAuthor: inhalt.werte.madasterGermanyServicesGmbh
  },
  {
    id: 'concular_materials',
    name: inhalt.werte.concularZirkulärerMarktplatzBaustoffpass,
    category: 'lca',
    categoryLabel: inhalt.werte.lcaÖkobilanz6,
    language: 'DT',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Standard im Büro',
    url: 'https://concular.de/',
    shortDesc: inhalt.werte.anbieterFürZirkuläresBauen,
    detailedFeatures: [
      inhalt.werte.preDemolitionAuditZur,
      inhalt.werte.marktplatzFürSekundärbaustoffeMit,
      inhalt.werte.einsparungsrechnerFürCoEmissionen,
      inhalt.werte.unterstützungBeiDerErfüllung
    ],
    standards: inhalt.werte.vdi6210DinSpec,
    institutionOrAuthor: inhalt.werte.concularGmbh
  },

  // 5. BIM & IFC
  {
    id: 'openbim_viewer',
    name: inhalt.werte.openbimIfcWebViewer,
    category: 'bim',
    categoryLabel: inhalt.werte.bimGeodaten,
    language: 'ENG',
    accessType: 'Direkt im Web',
    recommendationBadge: 'Standard im Büro',
    url: 'https://thatopen.com/',
    shortDesc: inhalt.werte.webglBasierterOpenbimViewer,
    detailedFeatures: [
      inhalt.werte.direktesLadenUndRendern,
      inhalt.werte.hierarchischeInspektionVonIfcproject,
      inhalt.werte.prüfungVonEigenschaftssätzenProperty,
      inhalt.werte.integrierteMesswerkzeugeFürAbstände
    ],
    standards: inhalt.werte.buildingsmartIfc4Ifc2x3,
    institutionOrAuthor: inhalt.werte.thatOpenCompanyOpen
  },
  {
    id: 'bim_portal_bund',
    name: inhalt.werte.bimPortalDesBundes,
    category: 'bim',
    categoryLabel: inhalt.werte.bimGeodaten2,
    language: 'DT',
    accessType: 'Offizielle Behörde / API',
    url: 'https://www.bimdeutschland.de/',
    recommendationBadge: 'Offizieller Standard',
    shortDesc: inhalt.werte.zentralePlattformDerBundesrepublik,
    detailedFeatures: [
      inhalt.werte.einheitlicheMerkmalskatalogeZurAttribuie,
      inhalt.werte.musterAuftraggeberInformationsanforderun,
      inhalt.werte.schnittstellenFürDieAutomatisierte,
      inhalt.werte.kostenlosBereitgestelltFürDie
    ],
    standards: inhalt.werte.bimDeutschlandDinEn,
    institutionOrAuthor: inhalt.werte.bundesministeriumFürDigitalesUnd
  },
  {
    id: 'geoportal_bund',
    name: inhalt.werte.geoportalDeOpenGeodata,
    category: 'bim',
    categoryLabel: inhalt.werte.bimGeodaten3,
    language: 'DT',
    accessType: 'Offizielle Behörde / API',
    recommendationBadge: 'Standard im Büro',
    url: 'https://www.geoportal.de/',
    shortDesc: inhalt.werte.offiziellerZugangZuAmtlichen,
    detailedFeatures: [
      inhalt.werte.amtlicheLuftbilderOrthofotosUnd,
      inhalt.werte.hochwasserrisikoUndÜberschwemmungsgebiet,
      inhalt.werte.wmsWfsGeodiensteZur,
      inhalt.werte.fundamentaleGrundlageFürBaugrunderkundun
    ],
    standards: inhalt.werte.inspireRichtlinieOpenData,
    institutionOrAuthor: inhalt.werte.bundesamtFürKartographieUnd
  },

  // 6. Geotechnik & Baustofflabore
  {
    id: 'nist_vcctl',
    name: inhalt.werte.nistVirtualCementAnd,
    category: 'geotechnik',
    categoryLabel: inhalt.werte.geotechnikBaustofflabore,
    language: 'ENG',
    accessType: 'Freeware / Open Source',
    recommendationBadge: 'Forschung & Master',
    url: 'https://www.nist.gov/services-resources/software/vcctl-software',
    shortDesc: inhalt.werte.simulationssoftwareDesUsAmerikanischen,
    detailedFeatures: [
      inhalt.werte.simulationDerHydratationskinetikVon,
      inhalt.werte.mikrostrukturmodellierungUndPorenraumver,
      inhalt.werte.berechnungVonFestigkeitsentwicklungUnd,
      inhalt.werte.wissenschaftlichesReferenzmodellFürBinde
    ],
    standards: inhalt.werte.astmAciStandards,
    institutionOrAuthor: inhalt.werte.nationalInstituteOfStandards
  },
];

interface ApiCodeSnippet {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  prerequisites: string;
  code: string;
  explanation: string;
  benefit: string;
}

const API_SNIPPETS: ApiCodeSnippet[] = inhalt.daten.API_SNIPPETS;

export default function OnlineTools() {
  const [currentView, setCurrentView] = useState<'matrix' | 'api_lab'>('matrix');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    return ONLINE_TOOLS.filter(tool => {
      const matchCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.detailedFeatures.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tool.standards.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.institutionOrAuthor.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header & Intro */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-main"><MdText text={inhalt.texte.empfohleneOnlineToolsWebrechner} /></h2>
              <p className="text-sm text-text-main/70"><MdText text={inhalt.texte.kuratiertePraxiserprobteUndKostenlose} /></p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-off-white px-3 py-1.5 rounded-xl border border-home-grau/30 text-xs text-text-main/80 font-medium">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span><MdText text={inhalt.texte.t100GeprüfteFachquellenNormbezug} /></span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed"><MdText text={inhalt.texte.dieseFachübersichtBündeltNützliche} /></div>

        {/* View Switcher: Matrix vs. API Lab */}
        <ReiterLeiste label="Ansicht Online-Werkzeuge" className="flex flex-wrap gap-2 pt-2 border-t border-home-grau/20">
          <button {...alsReiter(currentView === 'matrix', 'onlinetools-ansicht', 'matrix')}
            onClick={() => setCurrentView('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              currentView === 'matrix'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
            }`}
          >
            <Layers size={14} />
            <span><MdText text={inhalt.texte.kuratierteWebrechnerMatrix} />{ONLINE_TOOLS.length} Tools)</span>
          </button>
          <button {...alsReiter(currentView === 'api_lab', 'onlinetools-ansicht', 'api_lab')}
            onClick={() => setCurrentView('api_lab')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              currentView === 'api_lab'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
            }`}
          >
            <Terminal size={14} />
            <span><MdText text={inhalt.texte.apiSchnittstellenLabPython} /></span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">NEU</span>
          </button>
        </ReiterLeiste>
      </div>

      {currentView === 'matrix' && (
        <div {...reiterPanel('onlinetools-ansicht', currentView)} className="flex flex-col gap-8">
          {/* Filter & Search Bar */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search input */}
            <ErgebnisAnsage text={`${formatDeZahl(filteredTools.length, 0)} ${filteredTools.length === 1 ? 'Werkzeug' : 'Werkzeuge'} gefunden`} />
            <div className="relative flex-1 min-w-[240px]">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder={inhalt.werte.nachToolStichwortNorm}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-off-white rounded-xl border border-home-grau/30 text-text-main placeholder:text-text-main/40 focus:outline-none focus:border-shiraz transition-all"
              />
            </div>

            {/* Category selector */}
            <AuswahlGruppe label="Kategorie" className="flex flex-wrap gap-2 items-center">
              <button {...alsOption(selectedCategory === 'all')}
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                Alle ({ONLINE_TOOLS.length})
              </button>
              <button {...alsOption(selectedCategory === 'statik')}
                onClick={() => setSelectedCategory('statik')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'statik'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              ><MdText text={inhalt.texte.statikTragwerk} /></button>
              <button {...alsOption(selectedCategory === 'bauphysik')}
                onClick={() => setSelectedCategory('bauphysik')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'bauphysik'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                Bauphysik
              </button>
              <button {...alsOption(selectedCategory === 'holzbau')}
                onClick={() => setSelectedCategory('holzbau')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'holzbau'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              >
                Holzbau
              </button>
              <button {...alsOption(selectedCategory === 'lca')}
                onClick={() => setSelectedCategory('lca')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'lca'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              ><MdText text={inhalt.texte.lcaÖkobilanz} /></button>
              <button {...alsOption(selectedCategory === 'bim')}
                onClick={() => setSelectedCategory('bim')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'bim'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              ><MdText text={inhalt.texte.bimGeodaten} /></button>
              <button {...alsOption(selectedCategory === 'geotechnik')}
                onClick={() => setSelectedCategory('geotechnik')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedCategory === 'geotechnik'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-off-white text-text-main/80 border-home-grau/30 hover:bg-slate-100'
                }`}
              ><MdText text={inhalt.texte.geotechnikLabor} /></button>
            </AuswahlGruppe>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTools.map((tool) => (
              <div 
                key={tool.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-3">
                  {/* Header inside Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {tool.categoryLabel}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/50">
                          {tool.language}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                          {tool.accessType}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                        {tool.name}
                      </h3>
                    </div>

                    {tool.recommendationBadge && (
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs ${
                        tool.recommendationBadge === 'Standard im Büro' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        tool.recommendationBadge === 'Offizieller Standard' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                        tool.recommendationBadge === 'Didaktisch wertvoll' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        'bg-cyan-100 text-cyan-900 border border-cyan-300'
                      }`}>
                        ★ {tool.recommendationBadge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="text-sm text-text-main/85 leading-relaxed">
                    <FormulaText text={tool.shortDesc} />
                  </div>

                  {/* Features List */}
                  <div className="bg-off-white/80 p-3.5 rounded-xl border border-home-grau/25 mt-1">
                    <span className="text-xs font-bold text-slate-700 block mb-2"><MdText text={inhalt.texte.kernfunktionenStärken} /></span>
                    <ul className="space-y-1.5">
                      {tool.detailedFeatures.map((feat, idx) => (
                        <li key={idx} className="text-xs text-text-main/75 flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                          <span><FormulaText text={feat} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Meta & External Button */}
                <div className="mt-5 pt-4 border-t border-home-grau/20 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-text-main/60">
                    <span className="block font-medium text-slate-700">Normen: {tool.standards}</span>
                    <span className="block text-[11px]">Herausgeber: {tool.institutionOrAuthor}</span>
                  </div>

                  {tool.url ? (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-shiraz hover:bg-shiraz/90 text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <span>Tool öffnen</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-xl border border-slate-200"><MdText text={inhalt.texte.fachinformationOffline} /></span>
                  )}
                </div>
              </div>
            ))}

            {filteredTools.length === 0 && (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-home-grau/30 text-text-main/60">
                <Search size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="font-medium"><MdText text={inhalt.texte.keineWerkzeugeFürDie} /></p>
                <p className="text-xs mt-1"><MdText text={inhalt.texte.setzenSieDenSuchbegriff} /></p>
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === 'api_lab' && (
        <div {...reiterPanel('onlinetools-ansicht', currentView)} className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Terminal className="text-shiraz" size={20} /><MdText text={inhalt.texte.apiSchnittstellenLabPython2} /></h2>
            <p className="text-sm text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.moderneBauingenieureUndArchitekten} /></p>
          </div>

          <div className="space-y-6">
            {API_SNIPPETS.map((snippet) => (
              <div 
                key={snippet.id} 
                className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-home-grau/20 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-shiraz/10 text-shiraz border border-shiraz/20">
                        {snippet.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {snippet.prerequisites}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-text-main">
                      {snippet.title}
                    </h3>
                    <p className="text-xs text-text-main/70 mt-0.5">
                      {snippet.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyCode(snippet.id, snippet.code)}
                    className="shrink-0 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-home-grau/30 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedId === snippet.id ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-700"><MdText text={inhalt.texte.codeKopiert} /></span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="text-shiraz" />
                        <span><MdText text={inhalt.texte.codeKopieren} /></span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Body */}
                <div className="p-6 bg-white text-text-main overflow-x-auto font-mono text-xs leading-relaxed">
                  <pre>{snippet.code}</pre>
                </div>

                {/* Explanations & Benefit */}
                <div className="p-5 bg-off-white border-t border-home-grau/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                      <Code size={13} className="text-shiraz" /><MdText text={inhalt.texte.didaktischeFunktionsweise} /></span>
                    <p className="text-text-main/80 leading-relaxed">
                      {snippet.explanation}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-800 block mb-1 flex items-center gap-1">
                      <Sparkles size={13} className="text-emerald-600" /><MdText text={inhalt.texte.praxisnutzenFürStudiumBüro} /></span>
                    <p className="text-text-main/80 leading-relaxed">
                      {snippet.benefit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Didaktische Tipps für das Studium & Ingenieurbüro */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Sparkles className="text-shiraz" size={18} /><MdText text={inhalt.texte.bestPracticeWorkflowKombination} /></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text-main/80">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Activity size={14} className="text-shiraz" /><MdText text={inhalt.texte.t1VorbemessungPlausibilität} /></h4>
            <p className="leading-relaxed"><MdText text={inhalt.texte.nutzenSieOnlineRechner} /></p>
          </div>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Leaf size={14} className="text-shiraz" /><MdText text={inhalt.texte.t2ÖkobilanzBaustoffwahl} /></h4>
            <p className="leading-relaxed"><MdText text={inhalt.texte.verknüpfenSieDasBaustoffboard} /></p>
          </div>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Box size={14} className="text-shiraz" /><MdText text={inhalt.texte.t3BauphysikDetailausbildung} /></h4>
            <p className="leading-relaxed"><MdText text={inhalt.texte.schichtaufbautenAusDemBaustoffboard} /></p>
          </div>
        </div>
      </div>

      {/* Standardisierter Footer */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1KontrollrechnungFür}
        zielGleichung="M_{Ed} = \frac{q_{Ed} L^2}{8}, \quad w = \frac{5 q L^4}{384 E I}"
        schritte={inhalt.daten["OnlineTools.schritte"]}
        ergebnisHinweis={inhalt.werte.liefertDasProgrammStark}
        normQuelle={inhalt.werte.dinEn199512}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2BemessungslastEiner}
        zielGleichung="q_{Ed} = 1{,}35 \cdot g_k + 1{,}5 \cdot q_k"
        schritte={inhalt.daten["OnlineTools.schritte_2"]}
        ergebnisHinweis={inhalt.werte.onlineRechnerVerlangenOft}
        normQuelle={inhalt.werte.dinEn1990Mit}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="online_tools" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap13}
        wikipedia={[
          { title: 'Bausoftware', url: 'https://de.wikipedia.org/wiki/Bausoftware' },
          { title: inhalt.werte.buildingInformationModeling, url: 'https://de.wikipedia.org/wiki/Building_Information_Modeling' },
          { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/Lebenszyklusanalyse' }
        ]}
        literatur={inhalt.daten["OnlineTools.literatur"]}
        regelwerke={inhalt.daten["OnlineTools.regelwerke"]}
        weblinks={inhalt.daten["OnlineTools.weblinks"]}
        formeln={inhalt.daten["OnlineTools.formeln"]}
      />
    </div>
  );
}
