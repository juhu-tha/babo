import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Bookmark, 
  GraduationCap, 
  HelpCircle, 
  ChevronRight, 
  Printer, 
  Info,
  ThermometerSnowflake,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/bautagebuch/Bautagebuch.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

// Define the construction projects
interface ProjectTemplate {
  id: string;
  name: string;
  location: string;
  client: string;
  structuralEngineer: string;
  budget: string;
  timeline: string;
  description: string;
  defaultTasks: string[];
}

const PROJECTS: ProjectTemplate[] = inhalt.daten.PROJECTS;

// Structured Scenario Challenges
interface Scenario {
  id: string;
  name: string;
  title: string;
  description: string;
  date: string;
  tempMin: number;
  tempMax: number;
  weatherConditions: string[];
  objective: string;
  hints: string[];
}

const SCENARIOS: Scenario[] = inhalt.daten.SCENARIOS;

interface SavedDiary {
  id: string;
  projectId: string;
  projectName: string;
  berichtNummer: number;
  date: string;
  wetterTempMin: number;
  wetterTempMax: number;
  wetterBedingungen: string[];
  wetterEinfluss: string;
  arbeiterEigene: number;
  arbeiterSubStr: string;
  fortschritt: string;
  stoerungen: string;
  testingActive: string[];
  anweisungen: string;
  behinderung: boolean;
  behinderungDetails: string;
  bedenken: boolean;
  bedenkenDetails: string;
  score: number;
  grade: string;
  professorSummary: string;
  checklistChecks: { title: string; success: boolean; detail: string }[];
}

export default function Bautagebuch() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('carbon-beton');
  const [activeTab, setActiveTab] = useState<'editor' | 'scenarios' | 'saved' | 'guide'>('guide');
  
  // Form State
  const [berichtNummer, setBerichtNummer] = useState<number>(12);
  const [dateStr, setDateStr] = useState<string>('2026-06-07');
  const [tempMin, setTempMin] = useState<number>(18);
  const [tempMax, setTempMax] = useState<number>(24);
  const [selectedWeather, setSelectedWeather] = useState<string[]>(['Sunny']);
  const [weatherEinfluss, setWeatherEinfluss] = useState<string>(inhalt.werte.keineBeeinflussung);
  const [arbeiterEigene, setArbeiterEigene] = useState<number>(4);
  const [arbeiterSubStr, setArbeiterSubStr] = useState<string>(
    inhalt.werte.bauunternehmungMüllerGmbh1
  );
  const [fortschritt, setFortschritt] = useState<string>(
    inhalt.werte.deckeÜberUgBewehrungsabnahme
  );
  const [stoerungen, setStoerungen] = useState<string>('');
  const [selectedTesting, setSelectedTesting] = useState<string[]>([]);
  const [anweisungen, setAnweisungen] = useState<string>('');
  
  // VOB / Claims States
  const [behinderung, setBehinderung] = useState<boolean>(false);
  const [behinderungDetails, setBehinderungDetails] = useState<string>('');
  const [bedenken, setBedenken] = useState<boolean>(false);
  const [bedenkenDetails, setBedenkenDetails] = useState<string>('');

  // Assessment Feedback
  const [reviewResult, setReviewResult] = useState<SavedDiary | null>(null);
  const [savedDiaries, setSavedDiaries] = useState<SavedDiary[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bau_bautagebuch_diaries');
      if (stored) {
        setSavedDiaries(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load saved diaries", e);
    }
  }, []);

  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    const proj = PROJECTS.find(p => p.id === id);
    if (proj) {
      setFortschritt(`Arbeiten an: ${proj.defaultTasks[0]} heute durchgeführt. QS-Kontrollen eingeleitet.`);
    }
    setActiveScenarioId(null);
  };

  const handleLoadScenario = (scenario: Scenario) => {
    setActiveScenarioId(scenario.id);
    setDateStr('2026-06-07'); // Default date format for input
    setBerichtNummer(Math.floor(Math.random() * 30) + 1);
    setTempMin(scenario.tempMin);
    setTempMax(scenario.tempMax);
    setSelectedWeather(scenario.weatherConditions);
    setWeatherEinfluss(scenario.tempMin < 5 ? 'Beeinträchtigung' : inhalt.werte.keineBeeinflussung2);
    setFortschritt('');
    // Lösungsfelder starten leer: Die Aufgabe steht in der Szenariobeschreibung, gelöst wird im Editor.
    setStoerungen('');
    setAnweisungen('');
    setBehinderung(false);
    setBehinderungDetails('');
    setBedenken(false);
    setBedenkenDetails('');
    setSelectedTesting([]);
    setReviewResult(null);
    setActiveTab('editor');
  };

  const toggleWeather = (condition: string) => {
    if (selectedWeather.includes(condition)) {
      setSelectedWeather(selectedWeather.filter(c => c !== condition));
    } else {
      setSelectedWeather([...selectedWeather, condition]);
    }
  };

  const toggleTesting = (test: string) => {
    if (selectedTesting.includes(test)) {
      setSelectedTesting(selectedTesting.filter(t => t !== test));
    } else {
      setSelectedTesting([...selectedTesting, test]);
    }
  };

  // Run structured evaluation rules according to German Standards (VOB, HOAI Lph 8, DIN 1045)
  const handleAnalyzeAndSubmit = () => {
    const checks: { title: string; success: boolean; detail: string }[] = [];
    let score = 100; // start with full score, deduct on issues

    // Check 1: General descriptors filled in
    if (!fortschritt || fortschritt.trim().length < 15) {
      score -= 20;
      checks.push(inhalt.daten.handleAnalyzeAndSubmit);
    } else {
      checks.push(inhalt.daten.handleAnalyzeAndSubmit_2);
    }

    // Check 2: Weather and Temperature Analysis
    if (tempMin === undefined || tempMax === undefined || tempMin > tempMax) {
      score -= 10;
      checks.push(inhalt.daten.handleAnalyzeAndSubmit_3);
    } else {
      checks.push({
        title: inhalt.werte.temperaturangabenVorhanden,
        success: true,
        detail: `Temperaturspektrum von ${formatDeWert(tempMin)}°C bis ${formatDeWert(tempMax)}°C dokumentiert.`
      });
    }

    // Checking Concrete Winter Concreting rules (critical for civil engineering students)
    const mentionsConcrete = fortschritt.toLowerCase().includes('beton') || workerDescribesConcrete(arbeiterSubStr) || fortschritt.toLowerCase().includes('platte') || fortschritt.toLowerCase().includes('decke');
    if (tempMin < 5 && mentionsConcrete) {
      const handlesWinterMat = fortschritt.toLowerCase().includes('matte') || fortschritt.toLowerCase().includes('folie') || fortschritt.toLowerCase().includes('thermomatte') || fortschritt.toLowerCase().includes('winter') || fortschritt.toLowerCase().includes('heiz') || fortschritt.toLowerCase().includes('curing') || fortschritt.toLowerCase().includes('temperatur');
      
      if (!handlesWinterMat) {
        score -= 25;
        checks.push({
          title: inhalt.werte.winterbaumaßnahmenNachDin1045,
          success: false,
          detail: `Kritischer Fehler! Bei Bauteil- und Außentemperaturen unter +5°C (${formatDeWert(tempMin)}°C) darf Beton nicht unbeaufsichtigt und ungeschützt erhärten. Sie müssen explizit Frostschutzmaßnahmen (Thermodecken, Folien o.ä.) im Bautagebuch anordnen.`
        });
      } else {
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_4);
      }

      // Check concrete testing for cold weather
      const testingConcreteTemp = selectedTesting.includes(inhalt.werte.frischbetontemperaturGemessen);
      if (!testingConcreteTemp) {
        score -= 15;
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_5);
      } else {
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_6);
      }
    }

    // Check 3: Active Scenario Specific Rules
    if (activeScenarioId === 'schlechtwetter') {
      // Must deny water addition
      const deniedWater = fortschritt.toLowerCase().includes('wasser') || stoerungen.toLowerCase().includes('wasser') || fortschritt.toLowerCase().includes('fm') || fortschritt.toLowerCase().includes('fließmittel') || stoerungen.toLowerCase().includes('untersagt') || stoerungen.toLowerCase().includes('fließkraft');
      if (!deniedWater) {
        score -= 15;
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_7);
      } else {
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_8);
      }
    }

    if (activeScenarioId === 'claim_conflict') {
      if (!bedenken) {
        score -= 30;
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_9);
      } else if (!bedenkenDetails || bedenkenDetails.trim().length < 15) {
        score -= 15;
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_10);
      } else {
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_11);
      }
    }

    if (activeScenarioId === 'delay_excavator') {
      if (!behinderung) {
        score -= 30;
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_12);
      } else if (!behinderungDetails || behinderungDetails.trim().length < 15) {
        score -= 15;
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_13);
      } else {
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_14);
      }
    }

    // Check 4: CM-testing for Concrete/Estrich
    const mentionsEstrich = fortschritt.toLowerCase().includes('estrich') || fortschritt.toLowerCase().includes('belegreif') || FortschrittDescribesFloor(fortschritt);
    if (mentionsEstrich && selectedProjectId === 'mensa-sanierung') {
      const ranCMTest = selectedTesting.includes(inhalt.werte.cmMessungDurchgeführt);
      if (!ranCMTest) {
        score -= 15;
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_15);
      } else {
        checks.push(inhalt.daten.handleAnalyzeAndSubmit_16);
      }
    }

    // Check 5: General Personnel Logging
    if (!arbeiterSubStr || arbeiterSubStr.trim().length < 10) {
      score -= 10;
      checks.push(inhalt.daten.handleAnalyzeAndSubmit_17);
    } else {
      checks.push(inhalt.daten.handleAnalyzeAndSubmit_18);
    }

    // Standardize score bounds
    score = Math.max(10, Math.min(100, score));

    // Calculate German Grade system (1.0 = Sehr gut, 5.0 = Mangelhaft)
    let grade = '5.0';
    let summaryText = '';
    if (score >= 95) {
      grade = '1.0';
      summaryText = inhalt.werte.herausragendeLeistungIhrBautagebuch;
    } else if (score >= 88) {
      grade = '1.7';
      summaryText = inhalt.werte.sehrGuteAusarbeitungAlle;
    } else if (score >= 80) {
      grade = '2.3';
      summaryText = inhalt.werte.guteBauleiterqualitätDerBericht;
    } else if (score >= 70) {
      grade = '3.0';
      summaryText = inhalt.werte.durchsetzungsfähigAberMitMerklichen;
    } else if (score >= 60) {
      grade = '4.0';
      summaryText = inhalt.werte.ausreichendGeradeNochBestanden;
    } else {
      grade = '5.0';
      summaryText = inhalt.werte.mangelhaftIhrBerichtIst;
    }

    const review: SavedDiary = {
      id: Math.random().toString(36).substr(2, 9),
      projectId: selectedProjectId,
      projectName: selectedProject.name,
      berichtNummer,
      date: dateStr,
      wetterTempMin: tempMin,
      wetterTempMax: tempMax,
      wetterBedingungen: selectedWeather,
      wetterEinfluss: weatherEinfluss,
      arbeiterEigene,
      arbeiterSubStr,
      fortschritt,
      stoerungen,
      testingActive: selectedTesting,
      anweisungen,
      behinderung,
      behinderungDetails,
      bedenken,
      bedenkenDetails,
      score,
      grade,
      professorSummary: summaryText,
      checklistChecks: checks
    };

    setReviewResult(review);

    // Append to local state list & save
    const updated = [review, ...savedDiaries];
    setSavedDiaries(updated);
    try {
      localStorage.setItem('bau_bautagebuch_diaries', JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  };

  const handleDeleteDiary = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedDiaries.filter(d => d.id !== id);
    setSavedDiaries(updated);
    try {
      localStorage.setItem('bau_bautagebuch_diaries', JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
    if (reviewResult && reviewResult.id === id) {
      setReviewResult(null);
    }
  };

  const handleResetForm = () => {
    setBerichtNummer(12);
    setTempMin(18);
    setTempMax(24);
    setSelectedWeather(['Sunny']);
    setWeatherEinfluss(inhalt.werte.keineBeeinflussung3);
    setArbeiterEigene(4);
    setArbeiterSubStr(inhalt.werte.bauunternehmungMüllerGmbh12);
    const proj = PROJECTS.find(p => p.id === selectedProjectId);
    setFortschritt(proj ? `Arbeiten an: ${proj.defaultTasks[0]} heute durchgeführt.` : '');
    setStoerungen('');
    setSelectedTesting([]);
    setAnweisungen('');
    setBehinderung(false);
    setBehinderungDetails('');
    setBedenken(false);
    setBedenkenDetails('');
    setReviewResult(null);
    setActiveScenarioId(null);
  };

  function workerDescribesConcrete(txt: string) {
    if (!txt) return false;
    const l = txt.toLowerCase();
    return l.includes('beton') || l.includes('polier') || l.includes('misch');
  }

  function FortschrittDescribesFloor(txt: string) {
    if (!txt) return false;
    const l = txt.toLowerCase();
    return l.includes('estrich') || l.includes('boden') || l.includes('feucht') || l.includes('cm-');
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8" id="bautagebuch-root">
      
      {/* HEADER HERO AREA */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/30 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-shiraz/10 rounded-xl text-shiraz">
              <ClipboardList size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                Bautagebuch
              </h2>
              <p className="text-xs text-slate-500 font-mono"><MdText text={inhalt.texte.hoaiLeistungsphase8Objektüberwachung} /></p>
            </div>
          </div>
        </div>

        <ModuleTabs
          label={inhalt.werte.bereicheBautagebuch}
          tabs={[
            { id: 'guide' as const, label: inhalt.texte.leitfadenVobRegeln },
            { id: 'scenarios' as const, label: 'Lernszenarien' },
            { id: 'editor' as const, label: inhalt.texte.berichtErstellen },
            { id: 'saved' as const, label: `${inhalt.texte.gespeicherteBerichte}${savedDiaries.length})` },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:mb-6"
        >
        {/* INFO BOX */}
        <div className="bg-slate-50 rounded-xl p-4 border border-home-grau/30 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-text-main font-semibold"><MdText text={inhalt.texte.projektSteckbriefWählenBaustellenprojekt} /></p>
            <p className="text-xs text-slate-600"><MdText text={inhalt.texte.jedesProjektFordertUnterschiedliche} /></p>
          </div>
          <div className="flex gap-2 flex-wrap" id="project-selector-group">
            {PROJECTS.map(proj => (
              <button
                key={proj.id}
                onClick={() => handleSelectProject(proj.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedProjectId === proj.id
                    ? 'bg-shiraz text-white border-shiraz shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                id={`btn-proj-${proj.id}`}
              >
                {proj.id === 'carbon-beton' ? inhalt.werte.carbonbeton : proj.id === 'mensa-sanierung' ? inhalt.werte.mensaUmbau : '🏢 Parkhaus'}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Project Overview Card */}
        <div className="bg-stone-50 border border-stone-200 p-5 rounded-xl shadow-xs mb-8 text-stone-900">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-stone-550 font-bold border-b border-stone-200 pb-0.5 block"><MdText text={inhalt.texte.aktivesBauprojekt} /></span>
              <h3 className="text-base font-extrabold tracking-tight text-slate-900 mt-1">{selectedProject.name}</h3>
              <p className="text-xs text-slate-700 mt-1 font-medium leading-relaxed">{selectedProject.description}</p>
            </div>
            <div className="bg-stone-100 p-2.5 rounded-lg border border-stone-200 font-mono text-xs space-y-1 text-stone-800">
              <div><strong>Ort:</strong> {selectedProject.location}</div>
              <div><strong>Tragwerksplaner:</strong> {selectedProject.structuralEngineer}</div>
              <div><strong>Verfahrenswerte:</strong> {selectedProject.budget} &bull; {selectedProject.timeline}</div>
            </div>
          </div>
        </div>

        {/* ACTIVE LAYOUTS BASING ON SELECTED TAB */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.leitfadenDasVobBautagebuch} /></h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <div className="p-4 bg-off-white border-l-4 border-shiraz rounded-r-xl space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Info size={16} className="text-shiraz" /><MdText text={inhalt.texte.wasIstEinBautagebuch} /></h4>
                  <p><MdText text={inhalt.texte.einBautagebuchIstDie} /></p>
                </div>
                
                <h4 className="font-bold text-slate-900"><MdText text={inhalt.texte.die4UnverzichtbarenPflichtinhalte} /></h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><MdText text={inhalt.texte.witterungMindestUndHöchsttemperaturen} /></li>
                  <li><MdText text={inhalt.texte.personalGewerkeAnzahlDer} /></li>
                  <li><MdText text={inhalt.texte.tagesleistungBaufortschrittRäumlichGenau} /></li>
                  <li><MdText text={inhalt.texte.abweichungenStörungenEventuelleVerzögeru} /></li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="bg-rose-50/40 border border-shiraz/20 p-5 rounded-2xl space-y-4">
                  <h4 className="font-bold text-shiraz flex items-center gap-1.5 text-sm">
                    <AlertTriangle size={18} /><MdText text={inhalt.texte.baurechtlicheKernfehlerBeiUnvollständige} /></h4>
                  <div className="space-y-3 font-medium text-xs sm:text-sm text-slate-800">
                    <div>
                      <span className="text-shiraz font-bold"><MdText text={inhalt.texte.t1BeweisnotImStreitfall} /></span>
                      <p className="text-xs text-slate-700 mt-1"><MdText text={inhalt.texte.kannDieBauüberwachungKeine} /></p>
                    </div>
                    <div>
                      <span className="text-shiraz font-bold"><MdText text={inhalt.texte.t2VerlustVonVerzugs} /></span>
                      <p className="text-xs text-slate-700 mt-1"><MdText text={inhalt.texte.ohneSchriftlicheBehinderungsanzeigeWerde} /></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-home-grau/30 pt-4 flex justify-between items-center">
              <span className="text-xs text-slate-500 italic"><MdText text={inhalt.texte.interaktivesPraxismodulThAugsburg} /></span>
              <button
                onClick={() => setActiveTab('scenarios')}
                className="px-5 py-2.5 bg-shiraz text-white rounded-xl text-xs font-bold hover:bg-shiraz/90 shadow-sm transition-all flex items-center gap-2"
                id="btn-start-scenarios"
              ><MdText text={inhalt.texte.weiterZuDenLernszenarien} /><ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900"><MdText text={inhalt.texte.studierendenLernszenarienBaustellenHerau} /></h3>
              <p className="text-xs text-slate-600"><MdText text={inhalt.texte.realeKonfliktsituationenAufDer} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SCENARIOS.map(scenario => {
                return (
                  <div 
                    key={scenario.id} 
                    className="bg-white border border-home-grau/30 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all shadow-xxs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {scenario.name}
                        </span>
                        <span className="text-xs font-bold text-shiraz">Szenario</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{scenario.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed leading-relaxed line-clamp-4">
                        {scenario.description}
                      </p>
                    </div>

                    <div className="border-t border-home-grau/10 pt-3 space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block mb-1">Prüfungsziel:</span>
                        <p className="text-xs text-slate-700">{scenario.objective}</p>
                      </div>
                      <button
                        onClick={() => handleLoadScenario(scenario)}
                        className="w-full py-2 bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-600 transition-all flex items-center justify-center gap-1.5"
                        id={`btn-load-scenario-${scenario.id}`}
                      ><MdText text={inhalt.texte.szenarioStarten} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.archivierteBewerteteTagesberichte} />{savedDiaries.length})
            </h3>
            {savedDiaries.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-4">
                <Bookmark size={48} className="mx-auto text-slate-300" />
                <p className="text-sm font-medium"><MdText text={inhalt.texte.bislangWurdenKeineTagesprotokolle} /></p>
                <button
                  onClick={() => setActiveTab('scenarios')}
                  className="px-4 py-2 bg-shiraz text-white rounded-xl text-xs font-bold hover:bg-shiraz/90 transition-all"
                  id="btn-view-scenarios-empty"
                ><MdText text={inhalt.texte.zuDenLernszenarien} /></button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedDiaries.map((diary) => (
                  <div 
                    key={diary.id}
                    onClick={() => { setReviewResult(diary); setActiveTab('editor'); }}
                    className="p-5 bg-white border border-home-grau/30 rounded-2xl hover:border-slate-400 transition-all cursor-pointer shadow-xxs flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                          Bericht #{diary.berichtNummer}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <Calendar size={12} /> {diary.date}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {diary.projectName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1 italic">
                        <strong>Tätigkeiten:</strong> {diary.fortschritt}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <span><MdText text={inhalt.texte.minMaxTemp} />{formatDeWert(diary.wetterTempMin)}°C - {formatDeWert(diary.wetterTempMax)}°C</span>
                        {diary.behinderung && <span className="text-rose-600 font-bold"><MdText text={inhalt.texte.behinderungAktiv} /></span>}
                        {diary.bedenken && <span className="text-amber-600 font-bold"><MdText text={inhalt.texte.bedenkenAngemeldet} /></span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-xs text-slate-500 font-bold block">PROFESSOR-NOTE</span>
                        <span className={`text-xl font-extrabold font-mono  ${
                          diary.score >= 80 ? 'text-emerald-700' : diary.score >= 60 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {diary.grade}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteDiary(diary.id, e)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-all rounded-lg hover:bg-rose-50"
                        title={inhalt.werte.berichtLöschen}
                        id={`btn-delete-${diary.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-home-grau/30 pb-4 flex-wrap gap-2">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>VOB-Tageserfassung</span>
                  {activeScenarioId && (
                    <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded uppercase"><MdText text={inhalt.texte.szenarioModusAktiv} /></span>
                  )}
                </h3>
                <p className="text-xs text-slate-600"><MdText text={inhalt.texte.tragenSieAlleRelevanten} /></p>
                {activeScenarioId && (
                  <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2 max-w-2xl">
                    <strong>Lage:</strong> {SCENARIOS.find(sc => sc.id === activeScenarioId)?.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-xxs"
                  id="btn-reset-form"
                >
                  <RotateCcw size={13} /> Zurücksetzen
                </button>
                {reviewResult && (
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-slate-750 border border-slate-800 text-white hover:bg-slate-650 text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-xxs"
                    id="btn-print-active-diary"
                  >
                    <Printer size={13} /> PDF-Druckansicht
                  </button>
                )}
              </div>
            </div>

            {/* TWIN PANEL LAYOUT: LEFT FORM, RIGHT REALTIME PROFESSOR FEEDBACK */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT FORM BLOCK (8 columns) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. REPORT IDENTITY */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-home-grau/30 space-y-4">
                  <span className="text-xs text-shiraz font-bold font-mono tracking-widest uppercase block border-b border-home-grau/30 pb-1"><MdText text={inhalt.texte.t1AllgemeineBerichtangaben} /></span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.berichtsnummerFortlaufend} /></label>
                      <input 
                        type="number" min="1"
                        id="form-bericht-nummer"
                        value={berichtNummer}
                        onChange={(e) => setBerichtNummer(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.datumDerAufzeichnung} /></label>
                      <input 
                        type="date"
                        id="form-date"
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.innereBauleitungMitarbeiter} /></label>
                      <input 
                        type="number" min="0"
                        id="form-eigene-arbeiter"
                        value={arbeiterEigene}
                        onChange={(e) => setArbeiterEigene(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. WEATHER BLOCK */}
                <div className="p-5 rounded-2xl border border-home-grau/30 space-y-4">
                  <div className="flex justify-between items-center border-b border-home-grau/30 pb-1">
                    <span className="text-xs text-shiraz font-bold font-mono tracking-widest uppercase block"><MdText text={inhalt.texte.t2WitterungUndKlimatologische} /></span>
                    <span className="text-xs font-mono text-slate-400 font-medium"><MdText text={inhalt.texte.dinEn13670Din} /></span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.temperaturMinC} /></label>
                      <div className="flex items-center gap-2">
                        <input aria-label={inhalt.werte.temperaturMinC} 
                          type="range" 
                          min="-10" 
                          max="45" 
                          step="0.5"
                          value={tempMin}
                          onChange={(e) => setTempMin(Number(e.target.value))}
                          className="w-full accent-shiraz"
                        />
                        <span className="text-xs font-mono font-bold shrink-0 w-12 text-right">{formatDeWert(tempMin)} &deg;C</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.temperaturMaxC} /></label>
                      <div className="flex items-center gap-2">
                        <input aria-label={inhalt.werte.temperaturMaxC} 
                          type="range" 
                          min="-10" 
                          max="45" 
                          step="0.5"
                          value={tempMax}
                          onChange={(e) => setTempMax(Number(e.target.value))}
                          className="w-full accent-shiraz"
                        />
                        <span className="text-xs font-mono font-bold shrink-0 w-12 text-right">{formatDeWert(tempMax)} &deg;C</span>
                      </div>
                    </div>
                  </div>

                  {/* Warn zones alert indicator */}
                  {tempMin < 5 && (
                    <div className="p-3 bg-rose-50 border border-shiraz/20 rounded-lg flex items-start gap-1.5">
                      <ThermometerSnowflake className="text-shiraz shrink-0 mt-0.5" size={16} />
                      <div className="text-xs text-rose-950 font-medium"><MdText text={inhalt.texte.frostgefahrNachbehandlungspflichtMinTemp} /></div>
                    </div>
                  )}

                  {/* Conditions toggle */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2"><MdText text={inhalt.texte.witterungsbedingungenAuswahl} /></label>
                    <div className="flex flex-wrap gap-1.5" id="weather-checkbox-group">
                      {['Sunny', 'Cloudy', 'Rain', 'Snow', 'Frost', 'Stormy'].map(cond => {
                        const active = selectedWeather.includes(cond);
                        return (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => toggleWeather(cond)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                              active
                                ? 'bg-shiraz border-shiraz text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                            id={`btn-weather-${cond}`}
                          >
                            {cond === 'Sunny' ? '☀️ Sonnig' : 
                             cond === 'Cloudy' ? '☁️ Bewölkt' : 
                             cond === 'Rain' ? '🌧️ Regen' : 
                             cond === 'Snow' ? inhalt.werte.schneefall : 
                             cond === 'Frost' ? '🥶 Frost' : inhalt.werte.windSturm}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Operational impact */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.einflussAufDieBaustelle} /></label>
                    <select
                      id="form-weather-einfluss"
                      value={weatherEinfluss}
                      onChange={(e) => setWeatherEinfluss(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-bold"
                    >
                      <option value="Keine Beeinflussung">Keine Beeinflussung der Arbeiten</option>
                      <option value="Beeinträchtigung">Einzelne Beeinträchtigungen (Geräte gedrosselt)</option>
                      <option value="Schnittstellenstopp">Teilweiser Arbeitsstopp bei Außenarbeiten</option>
                      <option value="Arbeitsstopp">Ganztägiger witterungsbedingter Arbeitsausfall</option>
                    </select>
                  </div>
                </div>

                {/* 3. MANPOWER & SUBCONTRACTORS */}
                <div className="p-5 rounded-2xl border border-home-grau/30 space-y-4">
                  <span className="text-xs text-shiraz font-bold font-mono tracking-widest uppercase block border-b border-home-grau/30 pb-1"><MdText text={inhalt.texte.t3FremdfirmenSubunternehmerPersonalstärke} /></span>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.fremdfirmenVerzeichnisMitarbeiterPro} /></label>
                    <textarea
                      id="form-arbeiter-sub"
                      rows={3}
                      value={arbeiterSubStr}
                      onChange={(e) => setArbeiterSubStr(e.target.value)}
                      placeholder="z.B. Müller Erdbau GmbH: 1 Polier, 3 Baggerfahrer&#10;TGA Elektro Schmidt: 2 Monteure"
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-800 font-mono"
                    />
                    <p className="text-xs text-slate-600 mt-1"><MdText text={inhalt.texte.gebenSieDasExakte} /></p>
                  </div>
                </div>

                {/* 4. PERFORMANCE & TESTS */}
                <div className="p-5 rounded-2xl border border-home-grau/30 space-y-4">
                  <span className="text-xs text-shiraz font-bold font-mono tracking-widest uppercase block border-b border-home-grau/30 pb-1"><MdText text={inhalt.texte.t4AusgeführteTagesleistungQualitätsprüfun} /></span>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.tagesarbeitBaufortschrittSchnittstellenG} /></label>
                    <textarea
                      id="form-fortschritt"
                      rows={4}
                      value={fortschritt}
                      onChange={(e) => setFortschritt(e.target.value)}
                      placeholder={inhalt.werte.beschreibenSieRäumlichPräzise}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-800 leading-relaxed font-semibold placeholder:font-normal"
                    />
                    
                    {/* Prompt sub tasks suggestion to help students */}
                    <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                        <ClipboardList size={11} className="text-shiraz" /><MdText text={inhalt.texte.vorgeschlageneTätigkeitenFürDieses} /></p>
                      <div className="flex flex-wrap gap-1">
                        {selectedProject.defaultTasks.map((t, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              const spacer = fortschritt ? '\n' : '';
                              setFortschritt(prev => prev + spacer + t + '.');
                            }}
                            className="bg-white border border-slate-200 text-slate-900 rounded-md px-2 py-1 text-xs hover:bg-slate-100 hover:border-slate-300 transition-all text-left font-medium"
                          >
                            + {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quality tests selector */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5"><MdText text={inhalt.texte.eingeleiteteGüteprüfungenSchnelltestsGew} /></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="testing-checkbox-group">
                      {[
                        inhalt.werte.frischbetontemperaturGemessen2,
                        inhalt.werte.ausbreitversuchDurchgeführt,
                        inhalt.werte.probekörperWürfelZylinderGegossen,
                        inhalt.werte.cmMessungDurchgeführt2,
                        inhalt.werte.haftzugprüfungVorgenommen,
                        inhalt.werte.holzfeuchtigkeitsbestimmungGemessen
                      ].map(test => {
                        const active = selectedTesting.includes(test);
                        return (
                          <button
                            key={test}
                            type="button"
                            onClick={() => toggleTesting(test)}
                            className={`p-2 rounded-lg text-left text-xs font-bold border transition-all flex items-center justify-between ${
                              active
                                ? 'bg-shiraz text-white border-shiraz shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                            id={`btn-test-${test.replace(/\s+/g, '-').toLowerCase()}`}
                          >
                            <span>{test}</span>
                            <span className="text-white font-bold">{active ? '✓' : '+'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 5. VOB/B INFRINGEMENTS & VERBAL DIRECTIVES */}
                <div className="p-5 rounded-2xl border border-home-grau/30 space-y-4">
                  <div className="flex justify-between items-center border-b border-home-grau/30 pb-1">
                    <span className="text-xs text-shiraz font-bold font-mono tracking-widest uppercase block"><MdText text={inhalt.texte.t5BesondereVorkommnisseBaurechtliches} /></span>
                    <span className="text-xs font-mono text-slate-400 font-bold"><MdText text={inhalt.texte.vobB46} /></span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.mündlicheAnweisungenBaustellenbeschlüsse} /></label>
                    <input 
                      type="text"
                      id="form-anweisungen"
                      value={anweisungen}
                      onChange={(e) => setAnweisungen(e.target.value)}
                      placeholder={inhalt.werte.werHatWasVeranlasst}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.unvorhergeseheneStörungenHavarienGerätes} /></label>
                    <input 
                      type="text"
                      id="form-stoerungen"
                      value={stoerungen}
                      onChange={(e) => setStoerungen(e.target.value)}
                      placeholder={inhalt.werte.zBRohrbruchIm}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>

                  {/* Trigger Claims Switches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-rose-50/20 border border-rose-100 rounded-xl space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          id="form-check-behinderung"
                          checked={behinderung}
                          onChange={(e) => setBehinderung(e.target.checked)}
                          className="rounded border-slate-300 text-shiraz focus:ring-shiraz uppercase"
                        />
                        <span className="text-xs font-bold text-rose-800"><MdText text={inhalt.texte.formelleBehinderungsanzeigeErforderlich} /></span>
                      </label>
                      {behinderung && (
                        <input 
                          type="text"
                          id="form-behinderung-details"
                          value={behinderungDetails}
                          onChange={(e) => setBehinderungDetails(e.target.value)}
                          placeholder={inhalt.werte.begründungNach6Abs}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium/80"
                        />
                      )}
                    </div>

                    <div className="p-3 bg-amber-50/20 border border-amber-100 rounded-xl space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          id="form-check-bedenken"
                          checked={bedenken}
                          onChange={(e) => setBedenken(e.target.checked)}
                          className="rounded border-slate-300 text-shiraz focus:ring-shiraz uppercase"
                        />
                        <span className="text-xs font-bold text-amber-800"><MdText text={inhalt.texte.bedenkenanmeldungErhebenSicherheitsaussc} /></span>
                      </label>
                      {bedenken && (
                        <input 
                          type="text"
                          id="form-bedenken-details"
                          value={bedenkenDetails}
                          onChange={(e) => setBedenkenDetails(e.target.value)}
                          placeholder={inhalt.werte.technischeBedenkenNach4}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium/80"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* ANALYZE SUBMIT BUTTON */}
                <button
                  type="button"
                  onClick={handleAnalyzeAndSubmit}
                  className="w-full py-4 bg-shiraz text-white hover:bg-shiraz/90 font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
                  id="btn-submit-diary"
                >
                  <Plus size={18} /><MdText text={inhalt.texte.bautagebuchÜberprüfenArchivieren} /></button>

              </div>

              {/* RIGHT FEEDBACK BLOCK (5 columns) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. EDUCATIONAL ASSESSMENT CARD */}
                <div className="bg-slate-50 border border-home-grau/30 rounded-2xl p-5 space-y-4 shadow-xxs">
                  <div className="flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <GraduationCap className="text-shiraz" size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block font-bold"><MdText text={inhalt.texte.virtuelleProfessurAuswertungFeedback} /></span>
                  </div>

                  {!reviewResult ? (
                    <div className="text-center py-12 text-slate-500 space-y-3">
                      <HelpCircle size={40} className="mx-auto text-slate-300 animate-pulse" />
                      <p className="text-xs font-bold text-slate-700"><MdText text={inhalt.texte.wartenAufBerichtsabgabe} /></p>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto"><MdText text={inhalt.texte.tragenSieIhreWerte} /></p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      
                      {/* Score Badge */}
                      <div className="bg-white p-4 rounded-xl border border-home-grau/30 text-center space-y-1 shadow-xxs">
                        <span className="text-xs text-slate-600 font-extrabold uppercase"><MdText text={inhalt.texte.erhobenePrüfungsnote} /></span>
                        <div className={`text-4xl font-extrabold font-mono ${
                          reviewResult.score >= 80 ? 'text-emerald-700' : reviewResult.score >= 60 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {reviewResult.grade}
                        </div>
                        <p className="text-xs font-medium text-slate-600">Soll-Akkreditierungsgrad: {formatDeWert(reviewResult.score)}<MdText text={inhalt.texte.t100Punkte} /></p>
                      </div>

                      {/* Prof assessment commentary */}
                      <div className="bg-white p-3 rounded-xl border border-home-grau/30 italic text-xs text-slate-700 leading-relaxed font-medium">
                        &ldquo;{reviewResult.professorSummary}&rdquo;
                      </div>

                      {/* Rule Checks accordion */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-600 uppercase block tracking-wider">Ergebnis-Einzelprüfung</span>
                        
                        <div className="space-y-1.5" id="rule-check-results">
                          {reviewResult.checklistChecks.map((check, idx) => (
                            <div 
                              key={idx} 
                              className={`p-3 rounded-lg border text-xs flex gap-2 ${
                                check.success 
                                  ? 'bg-emerald-50/40 border-emerald-100 text-slate-900' 
                                  : 'bg-rose-50/50 border-rose-100 text-slate-900'
                              }`}
                            >
                              <span className="text-sm shrink-0">{check.success ? '✓' : '⚠️'}</span>
                              <div>
                                <span className="font-bold block text-slate-900">{check.title}</span>
                                <p className="text-xs text-slate-500 mt-0.5">{check.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                       {/* Scenario hint helper */}
                      {activeScenarioId && (
                        <div className="bg-amber-50 border border-amber-300 text-amber-950 p-4 rounded-xl space-y-1.5 shadow-xxs">
                          <span className="text-xs uppercase tracking-wider text-amber-800 font-extrabold block"><MdText text={inhalt.texte.szenarioHinweiseLösungen} /></span>
                          <p className="text-xs text-amber-900 font-bold"><MdText text={inhalt.texte.empfohleneBaustoffParameter} /></p>
                          <ul className="list-disc pl-4 text-xs text-stone-800 space-y-1.5">
                            {SCENARIOS.find(s => s.id === activeScenarioId)?.hints.map((hint, idx) => (
                              <li key={idx} className="leading-relaxed">{hint}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* 2. PRINT DESIGN CERTIFICATE (Only displays when report is submitted) */}
                {reviewResult && (
                  <div className="p-5 border border-stone-200 bg-stone-55 rounded-2xl relative overflow-hidden space-y-4 shadow-xxs bg-stone-50">
                    <div className="absolute top-0 right-0 p-4 bg-stone-900/5 text-stone-400 select-none pointer-events-none transform rotate-12">
                      <ShieldCheck size={120} className="opacity-[0.04]" />
                    </div>
                    
                    <div className="space-y-1.5 z-10 relative">
                      <span className="text-xs text-stone-600 font-bold uppercase block tracking-widest font-mono"><MdText text={inhalt.texte.vobAusdruckVorschau} /></span>
                      <h4 className="font-extrabold text-[#0f172a] text-sm flex items-center gap-1.5">
                        <CheckCircle className="text-emerald-600" size={16} /><MdText text={inhalt.texte.tagesberichtGerichtsicherZertifiziert} /></h4>
                      <p className="text-xs text-stone-700 leading-relaxed"><MdText text={inhalt.texte.dieserTagesbericht} /><strong>{reviewResult.berichtNummer}</strong> vom <strong>{reviewResult.date}</strong><MdText text={inhalt.texte.fürDasProjekt} /><strong>{selectedProject.name}</strong><MdText text={inhalt.texte.wurdeInDerDatenbank} /></p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handlePrint}
                        className="flex-1 py-2 bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-600 transition-all flex items-center justify-center gap-1.5"
                        id="btn-print"
                      >
                        <Printer size={13} /><MdText text={inhalt.texte.berichtDruckenPdf} /></button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}
        </ModuleTabs>

      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1AusschalfristBei}
        zielGleichung="t_{Ausschal} \ge t_{min} \cdot f_T,\quad f_T = \frac{30}{\bar T + 10}"
        schritte={inhalt.daten["Bautagebuch.schritte"]}
        ergebnisHinweis={inhalt.werte.ohneDokumentierteTemperaturenIst}
        normQuelle={inhalt.werte.reifegradansatzNachSaulDin}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2FestigkeitsentwicklungAus}
        zielGleichung="r = \frac{f_{cm,2}}{f_{cm,28}}"
        schritte={inhalt.daten["Bautagebuch.schritte_2"]}
        ergebnisHinweis={inhalt.werte.festigkeitsentwicklungUndTemperaturGehör}
        normQuelle={inhalt.werte.dinEn206Din}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="px_bautagebuch" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap15}
        wikipedia={[
          { title: 'Bautagebuch', url: 'https://de.wikipedia.org/wiki/Bautagebuch' },
          { title: 'Objektüberwachung', url: 'https://de.wikipedia.org/wiki/Objekt%C3%BCberwachung' },
          { title: 'Behinderungsanzeige', url: 'https://de.wikipedia.org/wiki/Behinderungsanzeige' }
        ]}
        literatur={inhalt.daten["Bautagebuch.literatur"]}
        regelwerke={inhalt.daten["Bautagebuch.regelwerke"]}
        formeln={inhalt.daten["Bautagebuch.formeln"]}
      />

      {/* PRINT STYLING INJECTED VIA MEDIA QUERY FOR HIGH CONTRAST BLACK & WHITE PAPER OUTPUT */}
      <style>{inhalt.werte.mediaPrintBodyBackground}</style>

    </div>
  );
}
