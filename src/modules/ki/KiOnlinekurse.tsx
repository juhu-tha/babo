import React, { useState, useMemo } from 'react';
import { 
  Video, 
  Play, 
  ExternalLink, 
  Code, 
  Cpu, 
  Database, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Terminal, 
  Clock, 
  Award, 
  Info, 
  Copy, 
  Check,
  Server,
  Layers,
  Lightbulb,
  Youtube
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/ki/KiOnlinekurse.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface OnlineCourse {
  id: string;
  title: string;
  channel: string;
  category: 'python' | 'ml_visual' | 'rag_nlp' | 'lokal_mcp' | 'hochschule';
  categoryLabel: string;
  badgeColor: string;
  url: string;
  duration: string;
  level: 'Einsteiger (0 Vorwissen)' | 'Fortgeschrittene Grundlagen' | 'Praxis & Projekt';
  summary: string;
  justification: string;
  constructionTransfer: string;
  highlightTopics: string[];
  recommendedStart: string;
}

const COURSES: OnlineCourse[] = [
  // 1. Python Grundlagen
  {
    id: 'felix_python',
    title: inhalt.werte.pythonKomplettkursFürAnfänger,
    channel: inhalt.werte.programmierenLernenFelixSchweilm,
    category: 'python',
    categoryLabel: inhalt.werte.pythonGrundlagen,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    duration: inhalt.werte.ca4StundenKompaktkurs,
    level: 'Einsteiger (0 Vorwissen)',
    summary: inhalt.werte.didaktischStrukturierterFehlerfreierEins,
    justification: inhalt.werte.ingenieurstudentenOhneVorkenntnisseLerne,
    constructionTransfer: inhalt.werte.unerlässlichFürDasEinlesen,
    highlightTopics: [inhalt.werte.variablenDatentypen, inhalt.werte.dateizugriffOpenReadWrite, inhalt.werte.funktionenModule, inhalt.werte.fehlerbehandlungTryExcept],
    recommendedStart: inhalt.werte.kapitel1Bis6
  },
  {
    id: 'morpheus_datascience',
    title: inhalt.werte.pythonFürDataScience,
    channel: inhalt.werte.morpheusTutorials,
    category: 'python',
    categoryLabel: inhalt.werte.pythonDataScience,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    url: 'https://www.youtube.com/playlist?list=PLNmsVeXQZj7rx5r9H5y4Vq_26_a8dI6Yc',
    duration: inhalt.werte.playlistCa6Stunden,
    level: 'Fortgeschrittene Grundlagen',
    summary: inhalt.werte.fokussiertAufNumerischeDatenanalyse,
    justification: inhalt.werte.bauingenieureArbeitenFastNie,
    constructionTransfer: inhalt.werte.automatisierteSieblinienberechnungenRegr,
    highlightTopics: [inhalt.werte.numpyArraysMatrizenrechnung, inhalt.werte.pandasDataframeFilterung, inhalt.werte.diagrammeMitMatplotlib, inhalt.werte.exportNachExcelCsv],
    recommendedStart: inhalt.werte.numpyGrundlagenPandasDataframes
  },

  // 2. ML & Visualisierung
  {
    id: 'statquest_de',
    title: inhalt.werte.statquestMachineLearningNeuronale,
    channel: inhalt.werte.statquestMitJoshStarmer,
    category: 'ml_visual',
    categoryLabel: inhalt.werte.mlMatheVisuell,
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
    url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF',
    duration: inhalt.werte.modulareVideoHäppchenJe,
    level: 'Einsteiger (0 Vorwissen)',
    summary: inhalt.werte.dieWeltweitGefeiertsteVisuelle,
    justification: inhalt.werte.entzaubertDieAngeblicheBlack,
    constructionTransfer: inhalt.werte.verständnisDafürWieEin,
    highlightTopics: [inhalt.werte.lineareNichtlineareRegression, inhalt.werte.neuronaleNetzeSchrittFür, inhalt.werte.backpropagationGradientDescent, inhalt.werte.transformerAttentionMechanismus],
    recommendedStart: inhalt.werte.videoNeuronaleNetzeDie
  },
  {
    id: '3blue1brown_de',
    title: inhalt.werte.wasIstEinNeuronales,
    channel: inhalt.werte.t3blue1brownDeutscheVersion,
    category: 'ml_visual',
    categoryLabel: inhalt.werte.mathematischeÄsthetik,
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
    url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',
    duration: inhalt.werte.t4TeiligeMeisterserieCa,
    level: 'Fortgeschrittene Grundlagen',
    summary: inhalt.werte.visuellAtemberaubendeMathematischeAnimat,
    justification: inhalt.werte.bietetDasTiefsteIntuitive,
    constructionTransfer: inhalt.werte.grundlegendFürDasVerständnis,
    highlightTopics: [inhalt.werte.matrizenmultiplikationInNetzen, inhalt.werte.gradientenabstiegImVektorraum, inhalt.werte.aktivierungsfunktionenReluSigmoid, inhalt.werte.featureMapsBeiBildanalysen],
    recommendedStart: inhalt.werte.kapitel1AberWas
  },

  // 3. RAG, NLP & Vektordatenbanken
  {
    id: 'dahlitz_rag',
    title: inhalt.werte.eigeneDokumenteBefragenMit,
    channel: inhalt.werte.florianDahlitzPythonAi,
    category: 'rag_nlp',
    categoryLabel: inhalt.werte.ragVektordatenbanken,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    url: 'https://docs.langchain.com/oss/python/langchain/rag',
    duration: inhalt.werte.tutorialReiheCa2,
    level: 'Praxis & Projekt',
    summary: inhalt.werte.schrittFürSchrittAnleitung,
    justification: inhalt.werte.ragIstDieKerntechnologie,
    constructionTransfer: inhalt.werte.direktÜbertragbarBauenSie,
    highlightTopics: [inhalt.werte.textChunkingOverlapStrategien, inhalt.werte.sentenceTransformersEmbeddings, inhalt.werte.vektorspeicherChromadbFaiss, inhalt.werte.promptAugmentierungMitKontext],
    recommendedStart: inhalt.werte.tutorialPdfQA
  },
  {
    id: 'heise_nlp',
    title: inhalt.werte.wieLlmsTokensEmbeddings,
    channel: inhalt.werte.heiseOnlineCT,
    category: 'rag_nlp',
    categoryLabel: inhalt.werte.nlpTokenisierung,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    url: 'https://developers.google.com/machine-learning/crash-course/llm/transformers?hl=de',
    duration: inhalt.werte.fokussierteSendungenJe30,
    level: 'Einsteiger (0 Vorwissen)',
    summary: inhalt.werte.technischFundierteJournalistischNeutrale,
    justification: inhalt.werte.idealZurVorbereitungAuf,
    constructionTransfer: inhalt.werte.grundlageFürDieRechtlich,
    highlightTopics: [inhalt.werte.tokenÖkonomieKontextfenster, inhalt.werte.datensicherheitBeiCloudApis, inhalt.werte.halluzinationsursachenEntropie, 'Training & Instruction-Tuning'],
    recommendedStart: inhalt.werte.cTUplinkGroße
  },

  // 4. Lokale KI & MCP
  {
    id: 'jens_polomski_local',
    title: inhalt.werte.lokaleKiKomplettKostenlos,
    channel: inhalt.werte.jensPolomskiKiMensch,
    category: 'lokal_mcp',
    categoryLabel: inhalt.werte.lokaleKiDatenschutz,
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    url: 'https://lmstudio.ai/docs/app',
    duration: inhalt.werte.praxisTutorialsJe15,
    level: 'Einsteiger (0 Vorwissen)',
    summary: inhalt.werte.kompakteSchrittFürSchritt,
    justification: inhalt.werte.bauunternehmenUndBehördenVerbieten,
    constructionTransfer: inhalt.werte.betreibenSieEinenVöllig,
    highlightTopics: [inhalt.werte.ggufFormateQuantisierungQ4, inhalt.werte.vramHardwareanforderungenRtx, inhalt.werte.systemPromptsFürLokale, inhalt.werte.restApiSchnittstelleFür],
    recommendedStart: inhalt.werte.tutorialLmStudioIn
  },
  {
    id: 'mcp_architektur_de',
    title: inhalt.werte.modelContextProtocolMcp,
    channel: inhalt.werte.kiDeveloperWorkflowsDe,
    category: 'lokal_mcp',
    categoryLabel: inhalt.werte.mcpAgentenSchnittstellen,
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    url: 'https://modelcontextprotocol.io/docs/learn/architecture',
    duration: inhalt.werte.überblickWalkthroughCa45,
    level: 'Praxis & Projekt',
    summary: inhalt.werte.einführungInDasOffene,
    justification: inhalt.werte.mcpIstDieZukunft,
    constructionTransfer: inhalt.werte.anbindungEinesLokalenPython,
    highlightTopics: [inhalt.werte.jsonRpcSchnittstellenstandard, inhalt.werte.mcpTransporte, inhalt.werte.filesystemSqliteMcpServer, inhalt.werte.sicherheitsbarrierenBerechtigungen],
    recommendedStart: inhalt.werte.videoWasIstMcp
  },

  // 5. Hochschul- & Zertifikatskurse
  {
    id: 'kicampus_ingenieure',
    title: inhalt.werte.kiCampusDieLernplattform,
    channel: inhalt.werte.kiCampusGefördertVom,
    category: 'hochschule',
    categoryLabel: inhalt.werte.offiziellerHochschulMooc,
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    url: 'https://ki-campus.org/',
    duration: inhalt.werte.mehrwöchigeKurseMitLeistungsnachweis,
    level: 'Einsteiger (0 Vorwissen)',
    summary: inhalt.werte.offiziellAkkreditiertePlattformDer,
    justification: inhalt.werte.höchsteAkademischeQualitätWissenschaftli,
    constructionTransfer: inhalt.werte.idealZurVorbereitungAuf2,
    highlightTopics: [inhalt.werte.einführungInDieKi, inhalt.werte.verantwortungsvollerUmgangMitDaten, inhalt.werte.mathematischeFundamente, inhalt.werte.zertifikatEctsAnerkennung],
    recommendedStart: inhalt.werte.kursDrMedKi
  }
];

export default function KiOnlinekurse() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return COURSES.filter(course => {
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      const matchesSearch = searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.constructionTransfer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.highlightTopics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  // Code snippet for quick engineering starter
  const pythonStarterCode = inhalt.werte.baustoffboardStarterSkriptDatenanalyse;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonStarterCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Video className="text-shiraz" /><MdText text={inhalt.texte.onlinekurseVideoLernpfadeFür} /></h2>
            <p className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.kuratierteDeutschsprachigeTutorialsYoutu} /></p>
          </div>
          <div className="flex items-center gap-2 bg-shiraz/10 text-shiraz px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 self-start md:self-auto">
            <Award size={15} /><MdText text={inhalt.texte.akademischPraxisgeprüft} /></div>
        </div>

        {/* EINFÜHRUNGSBOX */}
        <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 mt-5 leading-relaxed space-y-3">
          <p><MdText text={inhalt.texte.imBauingenieurwesenGehtEs} /></p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-white p-3 rounded-lg border border-home-grau/20 flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block"><MdText text={inhalt.texte.t100DeutschEinsteigergerecht} /></strong>
                <span className="text-slate-500"><MdText text={inhalt.texte.klareErklärungenOhneAblenkenden} /></span>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-home-grau/20 flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block"><MdText text={inhalt.texte.direkterBauTransfer} /></strong>
                <span className="text-slate-500"><MdText text={inhalt.texte.jedesTutorialWirdMit} /></span>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-home-grau/20 flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block"><MdText text={inhalt.texte.gegenDieTutorialHell} /></strong>
                <span className="text-slate-500"><MdText text={inhalt.texte.kompakteZeitfensterMitSofort} /></span>
              </div>
            </div>
          </div>
        </div>

        {/* 5-STUFEN-FAHRPLAN (LEARNING ROADMAP) */}
        <div className="mt-8 pt-6 border-t border-home-grau/20">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="text-shiraz" size={18} />
            <h3 className="text-base font-bold text-slate-800"><MdText text={inhalt.texte.der5StufenLernpfad} /></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Stufe 1</span>
                  <Code size={16} className="text-emerald-600" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 mb-1">Python-Basics</h4>
                <p className="text-xxs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.variablenSchleifenCsvImporte} /></p>
              </div>
              <span className="text-xxs font-semibold text-slate-500 mt-3 pt-2 border-t border-slate-200"><MdText text={inhalt.texte.empfehlungFelixSchweilm} /></span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">Stufe 2</span>
                  <Database size={16} className="text-teal-600" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 mb-1"><MdText text={inhalt.texte.numpyPandas} /></h4>
                <p className="text-xxs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.messwertmatrizenSieblinienFilterungRiesi} /></p>
              </div>
              <span className="text-xxs font-semibold text-slate-500 mt-3 pt-2 border-t border-slate-200"><MdText text={inhalt.texte.empfehlungMorpheus} /></span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">Stufe 3</span>
                  <Cpu size={16} className="text-sky-600" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 mb-1"><MdText text={inhalt.texte.mlVisuellVerstehen} /></h4>
                <p className="text-xxs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.regressionenKünstlicheNeuronaleNetze} /></p>
              </div>
              <span className="text-xxs font-semibold text-slate-500 mt-3 pt-2 border-t border-slate-200"><MdText text={inhalt.texte.empfehlungStatquestDe} /></span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Stufe 4</span>
                  <Terminal size={16} className="text-amber-600" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 mb-1"><MdText text={inhalt.texte.ragVektorsuche} /></h4>
                <p className="text-xxs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.eigenePdfNormenUnd} /></p>
              </div>
              <span className="text-xxs font-semibold text-slate-500 mt-3 pt-2 border-t border-slate-200"><MdText text={inhalt.texte.empfehlungFlorianDahlitz} /></span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">Stufe 5</span>
                  <Server size={16} className="text-purple-600" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 mb-1"><MdText text={inhalt.texte.lokaleKiMcp} /></h4>
                <p className="text-xxs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.modelleOfflinePerLm} /></p>
              </div>
              <span className="text-xxs font-semibold text-slate-500 mt-3 pt-2 border-t border-slate-200"><MdText text={inhalt.texte.empfehlungJensPolomskiMcp} /></span>
            </div>

          </div>
        </div>

        {/* FILTER & SUCHE */}
        <div className="mt-8 pt-6 border-t border-home-grau/20 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            <button aria-pressed={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            ><MdText text={inhalt.texte.alleKurse} />{COURSES.length})
            </button>
            <button aria-pressed={selectedCategory === 'python'}
              onClick={() => setSelectedCategory('python')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'python'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            ><MdText text={inhalt.texte.pythonDataScience} /></button>
            <button aria-pressed={selectedCategory === 'ml_visual'}
              onClick={() => setSelectedCategory('ml_visual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'ml_visual'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            ><MdText text={inhalt.texte.mlMatheVisuell} /></button>
            <button aria-pressed={selectedCategory === 'rag_nlp'}
              onClick={() => setSelectedCategory('rag_nlp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'rag_nlp'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            ><MdText text={inhalt.texte.ragVektordatenbanken} /></button>
            <button aria-pressed={selectedCategory === 'lokal_mcp'}
              onClick={() => setSelectedCategory('lokal_mcp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'lokal_mcp'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            ><MdText text={inhalt.texte.lokaleKiMcp2} /></button>
            <button aria-pressed={selectedCategory === 'hochschule'}
              onClick={() => setSelectedCategory('hochschule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'hochschule'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            ><MdText text={inhalt.texte.hochschuleZertifikate} /></button>
          </div>

          <div className="relative min-w-[240px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={inhalt.werte.themaToolOderDozent}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-shiraz bg-white text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* KURS-KARTEN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          {filteredCourses.map(course => (
            <div 
              key={course.id}
              className="bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/90 p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* OBERE ZEILE: BADGES & KANAL */}
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                  <span className={`text-xxs px-2.5 py-1 rounded-full font-bold border ${course.badgeColor}`}>
                    {course.categoryLabel}
                  </span>
                  <div className="flex items-center gap-2 text-xxs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" /> {course.duration}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 font-bold">{course.level}</span>
                  </div>
                </div>

                {/* TITEL & DOZENT */}
                <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                  {course.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-shiraz font-semibold mb-3">
                  <Youtube size={14} className="text-red-600" /> {course.channel}
                </div>

                {/* ZUSAMMENFASSUNG */}
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {course.summary}
                </p>

                {/* BEGRÜNDUNG (WARUM FÜR INGENIEURE) */}
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 mb-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xxs font-bold text-slate-800 uppercase tracking-wider">
                    <Sparkles size={12} className="text-amber-500" /><MdText text={inhalt.texte.warumFürBauingenieureAusgewählt} /></div>
                  <p className="text-xxs text-slate-600 leading-relaxed">
                    {course.justification}
                  </p>
                </div>

                {/* KONKRETER BAU-TRANSFER */}
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70 mb-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xxs font-bold text-amber-900 uppercase tracking-wider">
                    <Lightbulb size={12} className="text-amber-600" /><MdText text={inhalt.texte.konkreterBauTransfer} /></div>
                  <p className="text-xxs text-amber-950/80 leading-relaxed font-medium">
                    {course.constructionTransfer}
                  </p>
                </div>

                {/* HIGHLIGHT TOPICS */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {course.highlightTopics.map((topic, i) => (
                    <span key={i} className="text-xxs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* FOOTER-LEISTE MIT LINK */}
              <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between gap-3">
                <div className="text-xxs text-slate-500 truncate max-w-[260px]">
                  <strong>Start:</strong> {course.recommendedStart}
                </div>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-shiraz hover:bg-shiraz/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm hover:shadow shrink-0 cursor-pointer"
                >
                  <Play size={13} className="fill-white" /><MdText text={inhalt.texte.zumKursVideo} /><ExternalLink size={12} />
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* INTERAKTIVER STARTER-CODE BLOCK */}
        <div className="mt-10 bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="text-emerald-400" size={18} />
                <h3 className="text-sm font-bold text-white tracking-wide"><MdText text={inhalt.texte.sofortStarterPythonDatenanalyse} /></h3>
              </div>
              <p className="text-xs text-slate-400 mt-1"><MdText text={inhalt.texte.kopiereDiesenCodeDirekt} /><a href="https://colab.research.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline hover:text-emerald-300"><MdText text={inhalt.texte.googleColab} /></a><MdText text={inhalt.texte.oderIhrLokalesJupyter} /></p>
            </div>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition-all shrink-0 cursor-pointer"
            >
              {copiedSnippet ? (
                <>
                  <Check size={14} className="text-emerald-400" /> Kopiert!
                </>
              ) : (
                <>
                  <Copy size={14} /><MdText text={inhalt.texte.codeKopieren} /></>
              )}
            </button>
          </div>

          <pre className="text-xxs font-mono bg-slate-950 p-4 rounded-xl overflow-x-auto text-slate-300 border border-slate-800/80 leading-relaxed max-h-72">
            <code>{pythonStarterCode}</code>
          </pre>
        </div>

        {/* METHODISCHE EMPFEHLUNG: VERMEIDUNG DER "TUTORIAL HELL" */}
        <div className="mt-8 bg-blue-50/70 p-5 rounded-2xl border border-blue-200/80 space-y-3">
          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
            <Info size={16} className="text-blue-700" /><MdText text={inhalt.texte.ingenieurDidaktikWieMan} /></h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-blue-950/80">
            <div>
              <strong className="block text-blue-900 mb-1"><MdText text={inhalt.texte.t1NichtNurPassiv} /></strong>
              <span><MdText text={inhalt.texte.öffnenSieParallelZum} /></span>
            </div>
            <div>
              <strong className="block text-blue-900 mb-1"><MdText text={inhalt.texte.t2EigenePrüfdatenEinsetzen} /></strong>
              <span><MdText text={inhalt.texte.ersetzenSieDieBeispieldaten} /></span>
            </div>
            <div>
              <strong className="block text-blue-900 mb-1"><MdText text={inhalt.texte.t3VibeCodingAls} /></strong>
              <span><MdText text={inhalt.texte.verstehenSieEineFehlermeldung} /></span>
            </div>
          </div>
        </div>

      </div>

      {/* MODULE FOOTER */}
      <ModuleFooter
        wikipedia={[
          { title: inhalt.werte.maschinellesLernen, url: 'https://de.wikipedia.org/wiki/Maschinelles_Lernen' },
          { title: inhalt.werte.pythonProgrammiersprache, url: 'https://de.wikipedia.org/wiki/Python_(Programmiersprache)' },
          { title: inhalt.werte.retrievalAugmentedGeneration, url: 'https://de.wikipedia.org/wiki/Retrieval-Augmented_Generation' },
          { title: inhalt.werte.künstlicheIntelligenz, url: 'https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz' }
        ]}
        literatur={inhalt.daten["KiOnlinekurse.literatur"]}
        regelwerke={inhalt.daten["KiOnlinekurse.regelwerke"]}
        weblinks={inhalt.daten["KiOnlinekurse.weblinks"]}
        formeln={inhalt.daten["KiOnlinekurse.formeln"]}
      />
    </div>
  );
}
