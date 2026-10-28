import React, { useState, useEffect, useRef } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { RelatedModules } from '@/src/components/ui/RelatedModules';
import { Querverweis } from '@/src/components/ui/Querverweis';
import ReactMarkdown from 'react-markdown';
import { useTabContext } from '@/src/contexts/TabContext';
import ToolsFuerThesen from '@/src/modules/ki/ToolsFuerThesen';
import FehlerRechtEthik from '@/src/modules/ki/FehlerRechtEthik';
import LokaleKI from '@/src/modules/ki/LokaleKI';
import LlmPraxis from '@/src/modules/ki/LlmPraxis';
import KiOnlinekurse from '@/src/modules/ki/KiOnlinekurse';
import KiGlossar from '@/src/modules/ki/KiGlossar';
import KiUeberblick from '@/src/modules/ki/KiUeberblick';
import Systemarchitektur from '@/src/modules/ki/Systemarchitektur';
import { 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Terminal, 
  Compass, 
  MessageSquare, 
  Copy, 
  Lightbulb, 
  ExternalLink,
  ChevronRight,
  Target,
  Loader2,
  ShieldAlert,
  Server,
  Video
} from 'lucide-react';
import { KI_FUNKTION_AKTIV, KI_HINWEIS_AUS } from '@/src/data/kiSchalter';
import inhalt from '@/content/kibaustoffe/KiBaustoffe.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

interface PromptTemplate {
  title: string;
  material: string;
  objective: string;
  promptText: string;
  explanation: string;
}

const promptPresetMaterials = inhalt.daten.promptPresetMaterials;

const promptObjectives = inhalt.daten.promptObjectives;

const promptFormats = inhalt.daten.promptFormats;

const promptTonalities = inhalt.daten.promptTonalities;

// Generates dynamic prompt based on selection of 4 categories
function generateCustomPrompt(materialId: string, objectiveId: string, formatId: string, toneId: string): { promptText: string; explanation: string } {
  let materialName = "";
  let matSubject = "";
  switch (materialId) {
    case 'beton':
      materialName = inhalt.werte.recyclingBetonRcBeton;
      matSubject = inhalt.werte.einsatzImHochbauExpositionsklassen;
      break;
    case 'fliesenkleber':
      materialName = inhalt.werte.kunststoffmodifizierterZementärerDünnbet;
      matSubject = inhalt.werte.verlegungVonGroßformatfliesenAuf;
      break;
    case 'bsh':
      materialName = inhalt.werte.brettschichtholzBshGl24hDin;
      matSubject = inhalt.werte.einsatzInChemischAggressiver;
      break;
    default:
      materialName = "Standardbaustoff";
      matSubject = inhalt.werte.reguläreBauanwendung;
  }

  // 2. Objective / Role / Task instructions
  let role = "";
  let task = "";
  switch (objectiveId) {
    case 'norm':
      role = inhalt.werte.prüfsachverständigerFürBaustoffeIm;
      task = `Überprüfen Sie die baurechtliche Konformität des folgenden Materials:
Baustoff: ${materialName} (${matSubject})
- Führen Sie alle harmonisierten Prüf- und Anforderungsnormen an (z. B. DIN, EN, ISO).
- Analysieren Sie Leistungserklärungen (DoP), CE-Kennzeichnungen und bauaufsichtliche Zulassungen (abZ).
- Heben Sie kritische Kennwerte (Festigkeitsklassen, Schwindmaß etc.) hervor.`;
      break;
    case 'schaden':
      role = inhalt.werte.unabhängigerSchadengutachterImBauwesen;
      task = `Führen Sie eine präventive Schadensanalyse und mikromechanische Ursachenforschung durch für:
Baustoff/Einsatzszenario: ${materialName} (${matSubject})
- Untersuchen Sie chemische Alterung (z.B. Carbonatisierung, Weichmacherverlust, Alkalitreiben) und physikalische Risiken.
- Definieren Sie zerstörungsfreie oder laboratoriumstechnische Prüfverfahren (z.B. Dünnschliffmikroskopie, REM, FTIR-Spektroskopie) zum klaren Nachweis.`;
      break;
    case 'nachhaltig':
      role = inhalt.werte.dgnbAuditorUndFachexperte;
      task = `Erstellen Sie ein Optimierungskonzept zur CO2-Reduktion bzw. Ressourceneinsparung für:
Baustoff/Einsatzszenario: ${materialName} (${matSubject})
- Optimieren Sie die Lebenszyklus-Module A1-A3 (Rohstoffe/Herstellung), C3 (Rückbau) und D (Recyclingpotenzial).
- Schätzen Sie das Treibhauspotenzial (GWP in kg CO2-eq) ab und schlagen Sie konkrete Ersatzstoffe vor.`;
      break;
    default:
      role = inhalt.werte.bautechnischerBerater;
      task = `Analysieren Sie den Baustoff ${materialName} im Kontext von ${matSubject}.`;
  }

  // 3. Output Format instructions
  let formatDesc = "";
  switch (formatId) {
    case 'report':
      formatDesc = inhalt.werte.präsentierenSieDieAntwort;
      break;
    case 'bullets':
      formatDesc = inhalt.werte.gebenSieDieErgebnisse;
      break;
    case 'code':
      formatDesc = inhalt.werte.ergänzenSieDasErgebnis;
      break;
    default:
      formatDesc = inhalt.werte.formatierenSieDieAntwort;
  }

  // 4. Tone / Target Audience instructions
  let toneDesc = "";
  switch (toneId) {
    case 'scientific':
      toneDesc = inhalt.werte.wählenSieEinenHochgradig;
      break;
    case 'pragmatic':
      toneDesc = inhalt.werte.formulierenSieDieAntwort;
      break;
    case 'didactic':
      toneDesc = inhalt.werte.wählenSieDiePerspektive;
      break;
    default:
      toneDesc = inhalt.werte.schreibenSieSachbezogen;
  }

  const promptText = `Rolle: Sie agieren als ${role}.

Aufgabe und Kontext:
${task}

Formatvorgabe des Beitrags:
${formatDesc}

Tonalität & Zielgruppe:
${toneDesc}

Wichtig: Verweisen Sie explizit auf Baustoffeigenschaften und deutsches/europäisches Regelwerk. Nehmen Sie direkten Bezug auf die Praxis oder Nutzung beim Lernen.`;

  const explanation = `Dieser Prompt kombiniert perfekt die vier Säulen des Prompt Engineering:
1. **Spezifischer Baustoff-Kontext: ${materialName}**
2. **Fachspezifische Aufgabenstellung (Rolle & Task für ${objectiveId})**
3. **Erwartetes Ausgabe-Format: ${formatId}**
4. **Angepasste Tonalität: ${toneId}**
Er erzeugt hochpräzise Antworten frei von leerem Marketing-Slang.`;

  return { promptText, explanation };
}

type KiReiter = 'system' | 'prompting' | 'llmpraxis' | 'ressourcen' | 'thesen' | 'recht_ethik' | 'lokal' | 'onlinekurse';

// Reiter (AP 3.8): 7 Hauptreiter statt 8; nur die reinen Linksammlungen (KI-Seiten, Onlinekurse)
// teilen sich einen Reiter mit zweiter Ebene. Bereiche mit eigener Reiterleiste (Systemarchitektur,
// LLM-Praxis, Thesen, Recht & Ethik, Lokale KI) bleiben Hauptreiter, damit höchstens 2 Ebenen entstehen.
const KI_GRUPPEN: readonly ModulTabGruppe<KiReiter>[] = [
  { id: 'system_g', label: inhalt.werte.aSystemarchitektur, icon: Cpu, mitglieder: [{ id: 'system', label: inhalt.werte.aSystemarchitektur2 }] },
  { id: 'prompting_g', label: inhalt.werte.bPromptingPraxis, icon: MessageSquare, mitglieder: [{ id: 'prompting', label: inhalt.werte.bPromptingPraxis2 }] },
  { id: 'llmpraxis_g', label: inhalt.werte.cLlmPraxisChatKi, icon: Terminal, mitglieder: [{ id: 'llmpraxis', label: inhalt.werte.cLlmPraxisChatKi2 }] },
  { id: 'thesen_g', label: inhalt.werte.dToolsFürThesen, icon: BookOpen, mitglieder: [{ id: 'thesen', label: inhalt.werte.dToolsFürThesen2 }] },
  { id: 'recht_g', label: inhalt.werte.eFehlerRechtEthik, icon: ShieldAlert, mitglieder: [{ id: 'recht_ethik', label: inhalt.werte.eFehlerRechtEthik2 }] },
  { id: 'lokal_g', label: inhalt.werte.fLokaleKiLm, icon: Server, mitglieder: [{ id: 'lokal', label: inhalt.werte.fLokaleKiLm2 }] },
  { id: 'ressourcen_g', label: inhalt.werte.gHKiSeiten, icon: Compass, mitglieder: [
    { id: 'ressourcen', label: inhalt.werte.gUnabhängigeKiSeiten, icon: Compass },
    { id: 'onlinekurse', label: inhalt.werte.hOnlinekurse, icon: Video },
  ] },
];

/** Reiterleiste nur ohne festen Einsprung (forceTab); sonst wird der Inhalt unverändert durchgereicht. */
function KiReiterRahmen({ zeigen, aktiv, onWechsel, children }: { zeigen: boolean; aktiv: KiReiter; onWechsel: (t: KiReiter) => void; children: React.ReactNode }) {
  if (!zeigen) return <>{children}</>;
  return (
    <GruppierteModuleTabs
      label={inhalt.werte.kiInDerBaustoffkunde}
      gruppen={KI_GRUPPEN}
      aktiv={aktiv}
      onWechsel={onWechsel}
      className="my-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20"
    >
      <div className="mt-6">{children}</div>
    </GruppierteModuleTabs>
  );
}

interface KiBaustoffeProps {
  forceTab?: 'ueberblick' | 'system' | 'prompting' | 'anwendungen' | 'llmpraxis' | 'ressourcen' | 'thesen' | 'recht_ethik' | 'lokal' | 'onlinekurse';
}

export default function KiBaustoffe({ forceTab }: KiBaustoffeProps = {}) {
  if (forceTab === 'ueberblick') {
    return <KiUeberblick />;
  }
  return <KiBaustoffeInhalt forceTab={forceTab} />;
}

function KiBaustoffeInhalt({ forceTab }: KiBaustoffeProps) {
  const { setActiveTab: oeffneModul } = useTabContext();

  const [localActiveTab, setLocalActiveTab] = useState<KiReiter>('system');
  const activeTab = forceTab || localActiveTab;
  const setActiveTab = (tab: KiReiter) => {
    if (!forceTab) {
      setLocalActiveTab(tab);
    }
  };

  // Prompting & Interactive AI State
  const [selectedMaterial, setSelectedMaterial] = useState<string>('beton');
  const [selectedObjective, setSelectedObjective] = useState<string>('norm');
  const [selectedFormat, setSelectedFormat] = useState<string>('report');
  const [selectedTonality, setSelectedTonality] = useState<string>('scientific');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  
  const [customPromptText, setCustomPromptText] = useState<string>('');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [apiMode, setApiMode] = useState<'live' | 'simulated' | null>(null);
  const [hinweisBestaetigt, setHinweisBestaetigt] = useState<boolean>(false);

  // Zuletzt erzeugter Vorlagen-Prompt und ggf. zurückgehaltener neuer Vorschlag (bei bearbeitetem Text)
  const lastPresetPrompt = useRef<string>('');
  const [pendingPresetPrompt, setPendingPresetPrompt] = useState<string | null>(null);

  // Prompt bei Vorlagenwechsel nur überschreiben, wenn der Text seit der letzten Vorlage unverändert ist
  useEffect(() => {
    const generated = generateCustomPrompt(selectedMaterial, selectedObjective, selectedFormat, selectedTonality).promptText;
    if (customPromptText === '' || customPromptText === lastPresetPrompt.current) {
      setCustomPromptText(generated);
      setPendingPresetPrompt(null);
    } else {
      setPendingPresetPrompt(generated);
    }
    lastPresetPrompt.current = generated;
    // customPromptText bewusst nicht in den Abhängigkeiten: nur Vorlagenwechsel lösen den Abgleich aus
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMaterial, selectedObjective, selectedFormat, selectedTonality]);

  const uebernehmeVorlage = () => {
    if (pendingPresetPrompt !== null) setCustomPromptText(pendingPresetPrompt);
    setPendingPresetPrompt(null);
  };

  // Handler to call backend Gemini proxy
  const handleRunAiPrompt = async () => {
    setIsLoadingAi(true);
    setAiOutput(null);
    setApiMode(null);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Systemanweisung legt der Server fest (keine Personifizierung, AI Act Art. 50)
        body: JSON.stringify({ prompt: customPromptText, hinweisBestaetigt })
      });
      const data = await res.json();
      if (data.error) {
        setAiOutput(`### ❌ Fehler bei der Anfrage\n\n${data.error}\n\n${data.details || ''}`);
        setApiMode('simulated');
      } else {
        setAiOutput(data.text);
        setApiMode(data.status); // 'live' or 'simulated'
      }
    } catch (err) {
      setAiOutput(`### ❌ Fehler\n\nVerbindung zum lokalen Server fehlgeschlagen: ${err instanceof Error ? err.message : String(err)}`);
      setApiMode('simulated');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const currentCustomPrompt = generateCustomPrompt(selectedMaterial, selectedObjective, selectedFormat, selectedTonality);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(customPromptText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Useful AI sites list
  const aiResources = inhalt.daten["KiBaustoffeInhalt.aiResources"];

  // Dynamic header based on tab
  let title = inhalt.werte.künstlicheIntelligenzKiIn;
  let description = inhalt.werte.werkzeugeWieLlmsMaschinelles;

  if (activeTab === 'system') {
    title = "Systemarchitektur";
    description = inhalt.werte.schrittweiseErklärungAllerSchlüsseltechn;
  } else if (activeTab === 'prompting') {
    title = inhalt.werte.promptingPraxisFürIngenieure;
    description = inhalt.werte.nutzenSieDenInteraktiven;
  } else if (activeTab === 'llmpraxis') {
    title = inhalt.werte.llmPraxisEffizienteAnwendung;
    description = inhalt.werte.masterWorkflowsFürBauingenieure;
  } else if (activeTab === 'thesen') {
    title = inhalt.werte.toolsFürThesenBachelor;
    description = inhalt.werte.wissenschaftlichesArbeitenImBauingenieur;
  } else if (activeTab === 'recht_ethik') {
    title = inhalt.werte.fehlerAnwendungsgrenzenRechtEthik;
    description = inhalt.werte.sicherheitsUndHaftungsrisikenVon;
  } else if (activeTab === 'lokal') {
    title = inhalt.werte.lokaleKiLmStudio;
    description = inhalt.werte.betreibenSieLeistungsstarkeOpen;
  } else if (activeTab === 'ressourcen') {
    title = inhalt.werte.unabhängigeKiRessourcenVerzeichnisse;
    description = inhalt.werte.eineKuratierteSammlungUnabhängiger;
  } else if (activeTab === 'onlinekurse') {
    title = inhalt.werte.onlinekurseVideoLernpfadeFür;
    description = inhalt.werte.kuratierteDeutschsprachigeTutorialsYoutu;
  }

  return (
    <div className="flex flex-col gap-8">
      
      {/* HEADER INFO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Sparkles className="text-shiraz animate-pulse" /> {title}
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            {description}
          </p>
        </div>

        {/* Hands-on-Übungen zur Master-Vorlesung (AP 6.5) */}
        <Querverweis ziel="ki_uebungen" titel={inhalt.werte.handsOnÜbungenZum} linkText={inhalt.werte.zuDenSechsÜbungen} className="mt-4">
          <p><MdText text={inhalt.texte.zuJedemThemenblockLlm} /></p>
        </Querverweis>

        {/* INTERAKTIVES EINSTEIGER-GLOSSAR */}
        <div className="mt-5">
          <KiGlossar initialExpanded={!forceTab || activeTab === 'system'} />
        </div>

        {/* PRIMARY TABS (AP 3.8: 7 Hauptreiter, zweite Ebene nur für KI-Seiten & Onlinekurse) */}
        <KiReiterRahmen zeigen={!forceTab} aktiv={localActiveTab} onWechsel={setActiveTab}>
        {/* TAB 1: SYSTEMARCHITEKTUR */}
        {activeTab === 'system' && (
          <Systemarchitektur />
        )}

        {/* TAB 2: PROMPTING */}
        {activeTab === 'prompting' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <h3 className="font-extrabold text-base text-slate-800"><MdText text={inhalt.texte.professionellesPromptEngineeringIm} /></h3>
              <p className="text-xs text-text-main/70 leading-relaxed font-normal"><MdText text={inhalt.texte.künstlicheIntelligenzIstNur} /></p>
            </div>

            {/* INTERACTIVE BUILDER ZONE */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Target size={14} className="text-shiraz" /><MdText text={inhalt.texte.interaktiverBaustoffPromptGenerator} /></h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                {/* Selector 1: Material */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-black text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.t1BaustoffBauprodukt} /></label>
                  <AuswahlGruppe label="Baustoff" className="space-y-2">
                    {promptPresetMaterials.map((mat) => (
                      <button {...alsOption(selectedMaterial === mat.id)}
                        key={mat.id}
                        onClick={() => setSelectedMaterial(mat.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                          selectedMaterial === mat.id 
                            ? 'bg-shiraz text-white border-shiraz shadow-md font-bold' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-bold block text-xs truncate">{mat.name}</span>
                          <span className={`text-[10px] block truncate ${selectedMaterial === mat.id ? 'text-white/70' : 'text-slate-400 font-normal'}`}>{mat.description}</span>
                        </div>
                        <ChevronRight size={14} className={`flex-shrink-0 ml-1 ${selectedMaterial === mat.id ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    ))}
                  </AuswahlGruppe>
                </div>

                {/* Selector 2: Objective */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-black text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.t2ZielsetzungAufgabe} /></label>
                  <AuswahlGruppe label="Zielsetzung" className="space-y-2">
                    {promptObjectives.map((obj) => (
                      <button {...alsOption(selectedObjective === obj.id)}
                        key={obj.id}
                        onClick={() => setSelectedObjective(obj.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                          selectedObjective === obj.id 
                            ? 'bg-shiraz text-white border-shiraz shadow-md font-bold' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-bold block text-xs truncate">{obj.name}</span>
                          <span className={`text-[10px] block truncate ${selectedObjective === obj.id ? 'text-white/70' : 'text-slate-400 font-normal'}`}>{obj.desc}</span>
                        </div>
                        <ChevronRight size={14} className={`flex-shrink-0 ml-1 ${selectedObjective === obj.id ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    ))}
                  </AuswahlGruppe>
                </div>

                {/* Selector 3: Format */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-black text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.t3FormatAusgabeformat} /></label>
                  <AuswahlGruppe label="Ausgabeformat" className="space-y-2">
                    {promptFormats.map((fmt) => (
                      <button {...alsOption(selectedFormat === fmt.id)}
                        key={fmt.id}
                        onClick={() => setSelectedFormat(fmt.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                          selectedFormat === fmt.id 
                            ? 'bg-shiraz text-white border-shiraz shadow-md font-bold' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-bold block text-xs truncate">{fmt.name}</span>
                          <span className={`text-[10px] block truncate ${selectedFormat === fmt.id ? 'text-white/70' : 'text-slate-400 font-normal'}`}>{fmt.desc}</span>
                        </div>
                        <ChevronRight size={14} className={`flex-shrink-0 ml-1 ${selectedFormat === fmt.id ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    ))}
                  </AuswahlGruppe>
                </div>

                {/* Selector 4: Tonality */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-black text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.t4TonalitätZielgruppe} /></label>
                  <AuswahlGruppe label="Tonalität" className="space-y-2">
                    {promptTonalities.map((tone) => (
                      <button {...alsOption(selectedTonality === tone.id)}
                        key={tone.id}
                        onClick={() => setSelectedTonality(tone.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                          selectedTonality === tone.id 
                            ? 'bg-shiraz text-white border-shiraz shadow-md font-bold' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-bold block text-xs truncate">{tone.name}</span>
                          <span className={`text-[10px] block truncate ${selectedTonality === tone.id ? 'text-white/70' : 'text-slate-400 font-normal'}`}>{tone.desc}</span>
                        </div>
                        <ChevronRight size={14} className={`flex-shrink-0 ml-1 ${selectedTonality === tone.id ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    ))}
                  </AuswahlGruppe>
                </div>

              </div>

              {/* GENERATED PROMPT PREVIEW & LIVE RUN CONSOLE */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal size={12} className="text-slate-500" /><MdText text={inhalt.texte.modellInputDirektIm} /></span>
                    <button
                      onClick={handleCopyPrompt}
                      className="bg-white hover:bg-slate-50 text-slate-700 hover:text-shiraz px-3 py-1.5 rounded-lg border border-slate-200 transition-all text-xxs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={12} />
                      {copySuccess ? "Kopiert!" : inhalt.werte.inDieZwischenablage}
                    </button>
                  </div>
                  
                  {pendingPresetPrompt !== null && (
                    <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2" role="status">
                      <span><MdText text={inhalt.texte.sieHabenDenPrompt} /></span>
                      <span className="flex gap-2">
                        <button type="button" onClick={uebernehmeVorlage} className="px-2.5 py-1 rounded-lg bg-shiraz text-white font-bold"><MdText text={inhalt.texte.vorlageÜbernehmen} /></button>
                        <button type="button" onClick={() => setPendingPresetPrompt(null)} className="px-2.5 py-1 rounded-lg border border-amber-300 bg-white font-bold"><MdText text={inhalt.texte.eigenenTextBehalten} /></button>
                      </span>
                    </div>
                  )}

                  {/* Editable prompt text area */}
                  <textarea
                    rows={8}
                    value={customPromptText}
                    maxLength={4000}
                    aria-label={inhalt.werte.promptHöchstens4000}
                    onChange={(e) => setCustomPromptText(e.target.value)}
                    className="p-5 font-mono text-xs leading-relaxed bg-off-white text-text-main overflow-y-auto whitespace-pre-wrap outline-none border-none focus:ring-0 resize-y max-h-80 select-all"
                  />

                  {/* Footer with run button – nur bei eingeschalteter KI-Funktion (src/data/kiSchalter.ts) */}
                  {KI_FUNKTION_AKTIV ? (
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <label className="flex items-start gap-2 text-xs text-slate-700 font-medium max-w-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hinweisBestaetigt}
                        onChange={(e) => setHinweisBestaetigt(e.target.checked)}
                        className="mt-0.5 accent-shiraz"
                      />
                      <span><MdText text={inhalt.texte.derPromptWirdZur} /><button type="button" onClick={() => oeffneModul('datenschutz')} className="underline text-shiraz">Datenschutzerklärung</button>.
                      </span>
                    </label>
                    <button
                      onClick={handleRunAiPrompt}
                      disabled={isLoadingAi || !hinweisBestaetigt}
                      className="bg-shiraz hover:bg-shiraz-dark text-white px-5 py-2.5 rounded-xl transition-all text-xs font-black flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isLoadingAi ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-white" />
                          <span><MdText text={inhalt.texte.geminiGeneriert} /></span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} className="text-amber-300" />
                          <span><MdText text={inhalt.texte.analyseLiveAusführen} /></span>
                        </>
                      )}
                    </button>
                  </div>
                  ) : (
                    <p role="note" className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-700 font-medium">{KI_HINWEIS_AUS}</p>
                  )}

                  <div className="p-4 bg-amber-50/50 border-t border-slate-200 text-xxs text-amber-950 font-normal">
                    <div className="flex gap-1.5 items-center font-bold text-amber-900 mb-1">
                      <Lightbulb size={12} />
                      <span><MdText text={inhalt.texte.didaktischerHintergrund} /></span>
                    </div>
                    {currentCustomPrompt.explanation}
                  </div>
                </div>

                {/* LIVE GEMINI OUTPUT CARD */}
                {KI_FUNKTION_AKTIV && (isLoadingAi || aiOutput) && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-off-white text-text-main px-5 py-3 border-b border-home-grau/30 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Cpu size={14} className="text-shiraz animate-pulse" />
                        <span className="text-xs font-bold font-mono">KI-Kernel-Terminal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLoadingAi ? (
                          <span className="bg-white text-slate-700 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-lg border border-home-grau/30 flex items-center gap-1">
                            <Loader2 size={10} className="animate-spin" /> Verarbeite...
                          </span>
                        ) : apiMode === 'live' ? (
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-lg border border-emerald-200"><MdText text={inhalt.texte.kiGeneriertGoogleGemini} /></span>
                        ) : (
                          <span className="bg-amber-50 text-amber-800 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-lg border border-amber-200"><MdText text={inhalt.texte.demoModus} /></span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 bg-stone-50/50 min-h-[140px] leading-relaxed">
                      {isLoadingAi ? (
                        <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-400">
                          <Loader2 size={32} className="animate-spin text-shiraz" />
                          <p className="text-xs font-medium animate-pulse text-slate-500"><MdText text={inhalt.texte.dieKiGoogleGemini} /></p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {apiMode === 'live' && (
                            <p role="note" className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"><MdText text={inhalt.texte.kiGenerierteAntwortGoogle} /></p>
                          )}
                          <div className="prose prose-slate max-w-none text-xs text-text-main/90 font-normal space-y-4 markdown-body">
                            <ReactMarkdown>{aiOutput || ''}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ADVANCED PROMPTING TIPS */}
              <div className="mt-8 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Lightbulb size={16} className="text-amber-500" /><MdText text={inhalt.texte.goldeneRegelnPromptHacks} /></h4>
                <p className="text-xs text-text-main/70 leading-relaxed font-normal"><MdText text={inhalt.texte.ergänzendZumPromptGenerator} /></p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-amber-50/[0.22] border border-amber-200/55 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-950 bg-amber-50/70 p-1.5 rounded-lg border border-amber-100">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-black">1</span>
                      <span><MdText text={inhalt.texte.stelleRückfragenVorDer} /></span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal"><MdText text={inhalt.texte.verhindernSieFalscheAnnahmen} /></p>
                    <div className="p-2.5 bg-white rounded-xl border border-amber-100 font-mono text-[9.5px] text-slate-700 select-all"><MdText text={inhalt.texte.bevorDuMitDer} /></div>
                  </div>

                  <div className="p-4 bg-emerald-50/[0.18] border border-emerald-200/40 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-black">2</span>
                      <span><MdText text={inhalt.texte.regelwerkeAbsätzeKritischVerifizieren} /></span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal"><MdText text={inhalt.texte.llmsHalluzinierenGelegentlichNormnummern} /></p>
                    <div className="p-2.5 bg-white rounded-xl border border-emerald-100/80 font-mono text-[9.5px] text-slate-700 select-all"><MdText text={inhalt.texte.erstelleDenEntwurfGehe} /></div>
                  </div>

                  <div className="p-4 bg-indigo-50/[0.2] border border-indigo-200/40 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 bg-indigo-50/70 p-1.5 rounded-lg border border-indigo-100">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] flex items-center justify-center font-black">3</span>
                      <span><MdText text={inhalt.texte.chainOfThoughtHerleitungsschritte} /></span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal"><MdText text={inhalt.texte.fehlerBeiMathematischenBerechnungen} /></p>
                    <div className="p-2.5 bg-white rounded-xl border border-indigo-100/80 font-mono text-[9.5px] text-slate-700 select-all"><MdText text={inhalt.texte.berechneMirDiePackungsdichte} /></div>
                  </div>

                  <div className="p-4 bg-rose-50/[0.18] border border-rose-200/40 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-950 bg-rose-50/70 p-1.5 rounded-lg border border-rose-100">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-[10px] flex items-center justify-center font-black">4</span>
                      <span><MdText text={inhalt.texte.referenzvorgabenBestimmenFewShot} /></span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal"><MdText text={inhalt.texte.fütternSieDieKi} /></p>
                    <div className="p-2.5 bg-white rounded-xl border border-rose-100/80 font-mono text-[9.5px] text-slate-700 select-all"><MdText text={inhalt.texte.schreibeEinTechnischesGutachten} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LLM-PRAXIS */}
        {activeTab === 'llmpraxis' && (
          <LlmPraxis embedded={true} />
        )}

        {/* TAB 6: TOOLS FÜR THESEN (BACHELOR- & MASTERARBEITEN) */}
        {activeTab === 'thesen' && (
          <ToolsFuerThesen />
        )}

        {/* TAB 7: FEHLER, RECHT & ETHIK */}
        {activeTab === 'recht_ethik' && (
          <FehlerRechtEthik />
        )}

        {/* TAB 8: LOKALE KI (LM STUDIO) */}
        {activeTab === 'lokal' && (
          <LokaleKI />
        )}

        {/* TAB 9: RESSOURCEN */}
        {activeTab === 'ressourcen' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <h3 className="font-extrabold text-base text-slate-800"><MdText text={inhalt.texte.unabhängigeKiAnwendungenIm} /></h3>
              <p className="text-xs text-text-main/70 leading-relaxed font-normal"><MdText text={inhalt.texte.verwendenSieFürIhre} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiResources.map((res) => (
                <div key={res.name} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className={`text-xxs font-extrabold px-2.5 py-1 rounded-full uppercase ${res.iconCircle}`}>
                        {res.name.split(' (')[0]}
                      </span>
                      <a 
                        href={res.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-slate-400 hover:text-shiraz transition-colors cursor-pointer"
                        title={inhalt.werte.websiteÖffnen}
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    
                    <h4 className="font-extrabold text-sm text-slate-800">{res.name}</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed font-normal">{res.description}</p>
                    
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xxs font-normal text-slate-800 leading-normal">
                      <span className="font-bold text-shiraz uppercase tracking-wider text-[9px] block mb-0.5"><MdText text={inhalt.texte.praxisNutzenImBauwesen} /></span>
                      {res.baucase}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: ONLINEKURSE & YOUTUBE-LERNPFADE */}
        {activeTab === 'onlinekurse' && (
          <KiOnlinekurse />
        )}
        </KiReiterRahmen>

      </div>

      {/* Vernetzte Fachmodule & Querverweise */}
      <RelatedModules
        title={inhalt.werte.verwandteDigitalisierungsPlanungsmodule}
        subtitle={inhalt.werte.didaktischVernetzteQuerverweiseZu}
        modules={[
          {
            tab: 'ki_uebungen',
            title: inhalt.werte.handsOnÜbungenMaster,
            description: inhalt.werte.sechsCodeFreieSelbstlernübungen,
            tag: 'Übung',
            badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
          },
          {
            tab: 'bim_baustoffe',
            title: inhalt.werte.bimMaterialdatenIfc,
            description: inhalt.werte.ifc4Ifc43Klassifikation,
            tag: 'Digitales',
            badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200'
          },
          {
            tab: 'statistik',
            title: inhalt.werte.datenanalyseStatistik,
            description: inhalt.werte.gaußNormalverteilungKonfidenzintervalleU,
            tag: 'Methodik',
            badgeColor: 'bg-sky-50 text-sky-700 border-sky-200'
          },
          {
            tab: 'thesen_projekte',
            title: inhalt.werte.thesenSemesterprojekte,
            description: inhalt.werte.themenkatalogFürBachelorUnd,
            tag: 'Forschung',
            badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
          },
          {
            tab: 'oekobilanz_lca',
            title: inhalt.werte.ökobilanzierungLcaEpd,
            description: inhalt.werte.gwpBerechnungNachDin,
            tag: 'Nachhaltigkeit',
            badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
          },
          {
            tab: 'messen_pruefen',
            title: inhalt.werte.messenPrüfenSensorik,
            description: inhalt.werte.sensorenDmsUndDigitale,
            tag: 'Labor',
            badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
          },
          {
            tab: 'software',
            title: inhalt.werte.engineeringSoftwareTools,
            description: inhalt.werte.übersichtÜberFeSoftware,
            tag: 'Werkzeuge',
            badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
          }
        ]}
      />

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      {activeTab === 'system' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1KosinusÄhnlichkeit}
        zielGleichung="\cos\theta = \frac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte"]}
        ergebnisHinweis={inhalt.werte.hoheÄhnlichkeitHeißtNur}
        normQuelle={inhalt.werte.grundlagenInformationRetrievalIso}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2AusgabeEines}
        zielGleichung="y = \sigma(z) = \frac{1}{1 + e^{-z}},\quad z = \sum w_i x_i + b"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_2"]}
        ergebnisHinweis={inhalt.werte.einNetzBestehtAus}
        normQuelle={inhalt.werte.goodfellowBengioCourvilleDeep}
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_system" />
        </>
      )}
      {activeTab === 'prompting' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1TokenUnd}
        zielGleichung="K = \frac{n_{in}}{10^6} \cdot p_{in} + \frac{n_{out}}{10^6} \cdot p_{out}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_3"]}
        ergebnisHinweis={inhalt.werte.tarifeÄndernSichHäufig}
        normQuelle={inhalt.werte.anbieterPreislistenStand10}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2KontextfensterBudget}
        zielGleichung="n_{frei} = n_{ctx} - n_{sys} - n_{res}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_4"]}
        ergebnisHinweis={inhalt.werte.auchWennEinDokument}
        normQuelle="Lehrbeispiel"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_prompting" />
        </>
      )}
      {activeTab === 'llmpraxis' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1FehlerquoteAus}
        zielGleichung="\hat p = \frac{k}{n}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_5"]}
        ergebnisHinweis={inhalt.werte.schonEineKleineFehlerquote}
        normQuelle={inhalt.werte.lehrbeispielPrüfpflichtNachBgb}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2MehrheitsentscheidAus}
        zielGleichung="P_{Mehrheit} = p^3 + 3p^2(1-p)"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_6"]}
        ergebnisHinweis={inhalt.werte.mehrfachabfragenErhöhenDieZuverlässigkei}
        normQuelle={inhalt.werte.lehrbeispielBinomialverteilung}
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_llmpraxis" />
        </>
      )}
      {activeTab === 'thesen' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1PrecisionUnd}
        zielGleichung="P = \frac{TP}{TP + FP},\quad R = \frac{TP}{TP + FN}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_7"]}
        ergebnisHinweis={inhalt.werte.einViertelDerRelevanten}
        normQuelle="Lehrbeispiel"
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2BestimmtheitsmaßEines}
        zielGleichung="R^2 = 1 - \frac{SS_{res}}{SS_{tot}}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_8"]}
        ergebnisHinweis={inhalt.werte.inDerAbschlussarbeitSind}
        normQuelle={inhalt.werte.prüfungsordnungDerHochschuleLehrbeispiel}
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_thesen" />
        </>
      )}
      {activeTab === 'recht_ethik' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1FristenDer}
        zielGleichung="\Delta t = t_{Anwendung} - t_{heute}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_9"]}
        ergebnisHinweis={inhalt.werte.dieVerschiebungBetrifftDie}
        normQuelle={inhalt.werte.verordnungEu20241689}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2BußgeldrahmenNach}
        zielGleichung="B_{max} = \max\left(20\ \text{Mio. EUR};\ 0{,}04 \cdot U\right)"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_10"]}
        ergebnisHinweis={inhalt.werte.dasSindObergrenzenFür}
        normQuelle={inhalt.werte.verordnungEu2016679}
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_recht_ethik" />
        </>
      )}
      {activeTab === 'lokal' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1SpeicherbedarfEines}
        zielGleichung="M \approx \frac{N \cdot b}{8} + M_{KV}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_11"]}
        ergebnisHinweis={inhalt.werte.derKontextCacheWächst}
        normQuelle={inhalt.werte.ggufLlamaCppDokumentation}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2WirkungDer}
        zielGleichung="\frac{M_{Q4}}{M_{FP16}} = \frac{4{,}85}{16}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_12"]}
        ergebnisHinweis={inhalt.werte.quantisierungKostetEtwasGenauigkeit}
        normQuelle="Lehrbeispiel"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_lokal" />
        </>
      )}
      {activeTab === 'ressourcen' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1UnsicherheitEines}
        zielGleichung="u = 1{,}96 \cdot \sqrt{\frac{p(1-p)}{n}}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_13"]}
        ergebnisHinweis={inhalt.werte.ranglistenUnabhängigerKiSeiten}
        normQuelle={inhalt.werte.lehrbeispielBinomialverteilung2}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2StrombedarfUnd}
        zielGleichung="E = P \cdot t,\quad CO_2 = E \cdot f"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_14"]}
        ergebnisHinweis={inhalt.werte.dieRechnungErfasstNur}
        normQuelle={inhalt.werte.umweltbundesamtCoEmissionsfaktorenFür}
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_ressourcen" />
        </>
      )}
      {activeTab === 'onlinekurse' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1EinSchritt}
        zielGleichung="w_{neu} = w - \eta \cdot \frac{\partial L}{\partial w}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_15"]}
        ergebnisHinweis={inhalt.werte.zuGroßeLernratenLassen}
        normQuelle={inhalt.werte.goodfellowBengioCourvilleDeep2}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2LernzeitFür}
        zielGleichung="t_{ges} = t_{Video} \cdot f_{\text{Ü}}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_16"]}
        ergebnisHinweis={inhalt.werte.ohneEigeneProgrammierübungenBleibt}
        normQuelle={inhalt.werte.lehrbeispielEctsLeitfaden}
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_onlinekurse" />
        </>
      )}
      {activeTab === 'anwendungen' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1FestigkeitsprognoseMit}
        zielGleichung="f_{c,pred} = a - b \cdot (w/z)"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_17"]}
        ergebnisHinweis={inhalt.werte.einPrognosemodellErsetztKeine}
        normQuelle={inhalt.werte.dinEn206Din}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2ModellgüteMit}
        zielGleichung="MAE = \frac{1}{n}\sum |e_i|,\quad RMSE = \sqrt{\frac{1}{n}\sum e_i^2}"
        schritte={inhalt.daten["KiBaustoffeInhalt.schritte_18"]}
        ergebnisHinweis={inhalt.werte.derRmseGewichtetGroße}
        normQuelle="Lehrbeispiel"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_baustoffe" />
        </>
      )}

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap14} 
        wikipedia={[
          { title: inhalt.werte.künstlicheIntelligenz, url: 'https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz' },
          { title: inhalt.werte.maschinellesLernen, url: 'https://de.wikipedia.org/wiki/Maschinelles_Lernen' }
        ]} 
        literatur={inhalt.daten["KiBaustoffeInhalt.literatur"]} 
        regelwerke={inhalt.daten["KiBaustoffeInhalt.regelwerke"]} 
        formeln={inhalt.daten["KiBaustoffeInhalt.formeln"]} 
      />
    </div>
  );
}
