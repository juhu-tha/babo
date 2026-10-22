import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  ShieldCheck, 
  Download, 
  Terminal, 
  Copy, 
  CheckCircle2, 
  Sliders, 
  Layers, 
  Lock, 
  WifiOff, 
  Coins, 
  Database,
  Code,
  Gauge
} from 'lucide-react';
import ModelBenchmarkMatrix from '@/src/modules/ki/ModelBenchmarkMatrix';

interface RecommendedModel {
  name: string;
  creator: string;
  sizeParam: string;
  minVram: string;
  quantization: string;
  engineeringStrength: string;
  huggingFaceSearch: string;
  recommendedRole: string;
}

const LOCAL_MODELS: RecommendedModel[] = [
  {
    name: 'Qwen3 14B',
    creator: 'Alibaba Cloud / Qwen',
    sizeParam: '14,8 Milliarden Parameter',
    minVram: '10–12 GB VRAM (oder 16 GB Unified Memory)',
    quantization: 'Q5_K_M oder Q4_K_M',
    engineeringStrength: 'Herausragendes deutsches Sprachverständnis, exzellente Mathematik- und Normeninterpretation (DIN/EC), robust in technischen Tabellen.',
    huggingFaceSearch: 'Qwen/Qwen3-14B-GGUF',
    recommendedRole: 'Der ideale Allrounder für mittelgroße Ingenieurbüros (Baugutachten, Textanalysen, Normenvergleiche).'
  },
  {
    name: 'Qwen2.5-Coder 32B Instruct',
    creator: 'Alibaba Cloud / Qwen',
    sizeParam: '32,8 Milliarden Parameter',
    minVram: '20–24 GB VRAM (z. B. RTX 3090/4090/5090) oder 36+ GB Mac',
    quantization: 'Q4_K_M',
    engineeringStrength: 'Spitzenklasse bei Python, MATLAB, Pandas, IFC-BIM-Parsing und Automatisierungsskripten im Bauwesen.',
    huggingFaceSearch: 'bartowski/Qwen2.5-Coder-32B-Instruct-GGUF',
    recommendedRole: 'Fokus Vibe Coding & Automatisierung (Prüfmaschinen-Auswertungen, Grasshopper/Rhino-Skripte).'
  },
  {
    name: 'Llama 3.3 70B Instruct',
    creator: 'Meta AI',
    sizeParam: 'ca. 70 Milliarden Parameter',
    minVram: '40–48 GB VRAM (2x RTX 3090/4090 oder 64+ GB Mac Studio)',
    quantization: 'Q4_K_M',
    engineeringStrength: 'Stark bei längeren Argumentationsketten und Gutachtentexten; erreicht in Benchmarks nicht durchgängig das Niveau aktueller Cloud-Spitzenmodelle.',
    huggingFaceSearch: 'bartowski/Llama-3.3-70B-Instruct-GGUF',
    recommendedRole: 'High-End-Workstation für gerichtliche Baugutachter und anspruchsvolle Forschungsgruppen.'
  },
  {
    name: 'DeepSeek-R1-Distill-Qwen-14B',
    creator: 'DeepSeek / Open Source',
    sizeParam: '14 Milliarden Parameter',
    minVram: '10–12 GB VRAM',
    quantization: 'Q4_K_M',
    engineeringStrength: 'Explizite Denkketten (<think>-Blöcke) vor der Antwort. Ideal für logische Plausibilitätsprüfungen mechanischer Gleichungen.',
    huggingFaceSearch: 'bartowski/DeepSeek-R1-Distill-Qwen-14B-GGUF',
    recommendedRole: 'Analytische Prüfung statischer Konzepte und formaler Nachweisketten.'
  },
  {
    name: 'Llama 3.1 8B Instruct',
    creator: 'Meta AI',
    sizeParam: 'ca. 8 Milliarden Parameter',
    minVram: '6–8 GB VRAM (läuft auf fast jedem modernen Ingenieur-Laptop)',
    quantization: 'Q4_K_M oder Q5_K_M',
    engineeringStrength: 'Extrem schnell (45-65 Tokens/s), minimaler Ressourcenverbrauch, gut für Baustellennotizen, Rechtschreibung und Zusammenfassungen.',
    huggingFaceSearch: 'bartowski/Meta-Llama-3.1-8B-Instruct-GGUF',
    recommendedRole: 'Mobile Baustellenbegleitung auf dem Laptop im Baucontainer ohne Internet.'
  }
];

export default function LokaleKI() {
  const [activeSubTab, setActiveSubTab] = useState<'warum' | 'anleitung' | 'modelle' | 'benchmark' | 'hardware' | 'server' | 'rechner'>('anleitung');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Hardware Calculator
  const [selectedHardware, setSelectedHardware] = useState<'laptop_8gb' | 'desktop_16gb' | 'workstation_24gb' | 'mac_studio_64gb'>('desktop_16gb');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER INFO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <Server className="text-shiraz" /> Lokale KI &amp; LM Studio im Ingenieurbüro
            </h3>
            <p className="text-xs text-text-main/70 mt-1">
              Hohe Datensouveränität ohne Cloud-Übermittlung (DSGVO-Pflichten bleiben bestehen), offlinefähig auf der Baustelle – Schritt-für-Schritt-Praxisanleitung für LM Studio.
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xxs font-extrabold uppercase rounded-full tracking-wider flex items-center gap-1.5">
            <Lock size={13} className="text-emerald-600" /> Offline &amp; datensparsam
          </span>
        </div>

        {/* SUB-TABS */}
        <div className="flex flex-wrap gap-2 pt-5 border-b border-home-grau/20 mt-2">
          <button
            onClick={() => setActiveSubTab('anleitung')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'anleitung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Download size={14} /> 1. LM Studio Schritt-für-Schritt
          </button>
          <button
            onClick={() => setActiveSubTab('warum')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'warum'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <ShieldCheck size={14} /> 2. Warum Lokal im Bauwesen?
          </button>
          <button
            onClick={() => setActiveSubTab('modelle')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'modelle'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Database size={14} /> 3. Modell-Empfehlungen (GGUF)
          </button>
          <button
            onClick={() => setActiveSubTab('benchmark')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'benchmark'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Gauge size={14} /> 4. Benchmarking (Cloud vs. Lokal)
          </button>
          <button
            onClick={() => setActiveSubTab('server')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'server'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Terminal size={14} /> 5. Lokaler Server (API-Anbindung)
          </button>
          <button
            onClick={() => setActiveSubTab('hardware')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'hardware'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Cpu size={14} /> 6. Hardware-Dimensionierung
          </button>
          <button
            onClick={() => setActiveSubTab('rechner')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'rechner'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Sliders size={14} /> 7. VRAM- &amp; Eignungsrechner
          </button>
        </div>
      </div>

      {/* TAB 1: SCHRITT FÜR SCHRITT ANLEITUNG LM STUDIO */}
      {activeSubTab === 'anleitung' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-6">
            <div>
              <h4 className="font-bold text-base text-text-main flex items-center gap-2">
                <Download className="text-shiraz" /> Praxisleitfaden: Von Null zur lokalen KI in 10 Minuten
              </h4>
              <p className="text-xs text-text-main/70 mt-1">
                LM Studio (<a href="https://lmstudio.ai" target="_blank" rel="noreferrer" className="text-shiraz font-bold underline">lmstudio.ai</a>) ist das benutzerfreundlichste Werkzeug, um Open-Source-LLMs lokal auf Windows, macOS oder Linux ohne Programmierkenntnisse auszuführen.
              </p>
            </div>

            {/* DIE 5 SCHRITTE */}
            <div className="space-y-4">
              
              {/* SCHRITT 1 */}
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                  <div className="w-6 h-6 rounded-lg bg-shiraz text-white flex items-center justify-center text-xxs font-bold">1</div>
                  <span>Installation &amp; Start von LM Studio</span>
                </div>
                <p className="text-xxs text-text-main/70 leading-relaxed pl-8">
                  Laden Sie den Installer von <strong>lmstudio.ai</strong> für Ihr Betriebssystem herunter (Windows Installer mit CUDA-Unterstützung für NVIDIA GPUs, oder Apple Silicon DMG für Mac M1/M2/M3/M4). Führe das Setup aus. Es sind keine Python-Installationen oder Terminal-Befehle erforderlich.
                </p>
              </div>

              {/* SCHRITT 2 */}
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                  <div className="w-6 h-6 rounded-lg bg-shiraz text-white flex items-center justify-center text-xxs font-bold">2</div>
                  <span>Modell suchen &amp; herunterladen (Lupen-Symbol)</span>
                </div>
                <p className="text-xxs text-text-main/70 leading-relaxed pl-8">
                  Klicken Sie in der linken Seitenleiste auf das <strong>Lupen-Symbol (Search)</strong>. Geben Sie ins Suchfeld z. B. <code className="bg-white px-1.5 py-0.5 rounded border font-mono">Qwen2.5-14B-Instruct-GGUF</code> oder <code className="bg-white px-1.5 py-0.5 rounded border font-mono">Llama-3.1-8B-Instruct-GGUF</code> ein. LM Studio durchsucht live die Hugging Face Modell-Datenbank.
                </p>
              </div>

              {/* SCHRITT 3 */}
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                  <div className="w-6 h-6 rounded-lg bg-shiraz text-white flex items-center justify-center text-xxs font-bold">3</div>
                  <span>Die richtige Quantisierung (GGUF) wählen</span>
                </div>
                <div className="text-xxs text-text-main/70 leading-relaxed pl-8 space-y-2">
                  <p>
                    Rechts erscheint eine Liste verschiedener Quantisierungsstufen. Wählen Sie im Zweifel stets <strong>Q4_K_M</strong> (4-Bit Medium) oder <strong>Q5_K_M</strong> (5-Bit Medium).
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-xxs">
                    <strong>Faustregel für Bauingenieure:</strong> Q4_K_M halbiert den RAM/VRAM-Bedarf des Modells gegenüber dem Original bei nur ca. 1-2 % Qualitätsverlust. Farbindikatoren in LM Studio (Grün = passt komplett in Ihren VRAM, Gelb = benötigt teilweise CPU-RAM, Rot = zu groß) warnen Sie vor Systemüberlastung.
                  </div>
                </div>
              </div>

              {/* SCHRITT 4 */}
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                  <div className="w-6 h-6 rounded-lg bg-shiraz text-white flex items-center justify-center text-xxs font-bold">4</div>
                  <span>GPU Offload aktivieren (Chat-Reiter)</span>
                </div>
                <p className="text-xxs text-text-main/70 leading-relaxed pl-8">
                  Wechseln Sie in das <strong>Chat-Fenster</strong> (Sprechblasen-Symbol) und wählen Sie oben das heruntergeladene Modell aus. Klappen Sie rechts die <em>Model Parameters</em> auf: Setzen Sie <strong>GPU Offload</strong> auf <em>Max</em> (alle Layer auf die Grafikkarte). Erhöhen Sie das Kontextfenster (Context Length) bei Bedarf auf 8.192 oder 16.384 Tokens für lange Leistungsverzeichnisse.
                </p>
              </div>

              {/* SCHRITT 5 */}
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                  <div className="w-6 h-6 rounded-lg bg-shiraz text-white flex items-center justify-center text-xxs font-bold">5</div>
                  <span>System-Prompt für Bauingenieure hinterlegen</span>
                </div>
                <div className="text-xxs text-text-main/70 leading-relaxed pl-8 space-y-2">
                  <p>Hinterlegen Sie unter "System Prompt" eine feste Ingenieur-Persona:</p>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/20 font-mono text-xxs text-text-main/80 relative">
                    <button
                      onClick={() => handleCopy(`Du bist ein hochpräziser Fachberater für Baustoffkunde, Tragwerksplanung und Bauphysik im deutschen Bauwesen.
Antworte stets nach den verbindlichen Normenreihen (DIN EN 1992 Eurocode 2, DIN EN 206, DIN 1045, DIN 18533, DIN 4108).
Verwende ausschließlich das metrische SI-Einheitensystem (kN, MN, N/mm², kg/m³).
Kennzeichne Schätzungen klar als solche. Erfinde niemals Normenabsätze oder Sicherheitsbeiwerte.`, 'prompt_sys')}
                      className="absolute right-2 top-2 px-2 py-1 bg-shiraz text-white rounded text-xxxs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'prompt_sys' ? <CheckCircle2 size={10} /> : <Copy size={10} />}
                      {copiedId === 'prompt_sys' ? 'Kopiert' : 'Kopieren'}
                    </button>
                    "Du bist ein hochpräziser Fachberater für Baustoffkunde, Tragwerksplanung und Bauphysik im deutschen Bauwesen. Antworte stets nach den verbindlichen Normenreihen (DIN EN 1992, DIN EN 206, DIN 1045, DIN 18533). Verwende ausschließlich metrische SI-Einheiten. Erfinde niemals Normenabsätze."
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WARUM LOKALE KI IM BAUWESEN? */}
      {activeSubTab === 'warum' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Lock size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main">100 % Geheimhaltung &amp; DSGVO</h4>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                Bauherrennamen, private Grundrisse, Kostenkalkulationen und Bietereinheitspreise verlassen zu keinem Zeitpunkt Ihr Büro. Kein Cloud-Upload, kein Tracking, kein Modelltraining durch Dritte.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <WifiOff size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main">Baustellen- &amp; Offline-Fähig</h4>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                Funktioniert im Baucontainer ohne WLAN, im Rohbau-Keller ohne Mobilfunkempfang oder im ICE. Sie können jederzeit Normvergleiche und Textauswertungen ohne Latenz durchführen.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Coins size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main">0 € API- &amp; Abokosten</h4>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                Keine monatlichen Pro-Abos für jeden Mitarbeiter, keine Token-Gebühren bei der Massenverarbeitung von 500-seitigen Baugrundgutachten. Einmalige Hardware-Anschaffung statt wiederkehrender Lizenzkosten.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Database size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main">Reproduzierbarkeit &amp; Beständigkeit</h4>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                Cloud-Anbieter ändern Modelle im Hintergrund ("Drift"). Ein lokal gespeichertes Modell (z. B. Qwen 3.8 14B Q5) liefert auch in 5 Jahren bei der Überprüfung eines Schadensgutachtens dieselben konsistenten Ergebnisse.
              </p>
            </div>

          </div>

          {/* VERGLEICHSTABELLE: CLOUD VS LOKAL */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <Layers className="text-shiraz w-4 h-4" /> Systemvergleich: Cloud-LLMs vs. Lokale Ingenieur-Workstation
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/30 bg-off-white text-text-main">
                    <th className="p-3 font-bold">Kriterium</th>
                    <th className="p-3 font-bold text-amber-900">Cloud-KI (ChatGPT / Claude / Gemini)</th>
                    <th className="p-3 font-bold text-emerald-900">Lokale KI (LM Studio / Ollama)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-xxs">
                  <tr>
                    <td className="p-3 font-bold text-text-main">Datenschutz &amp; Vertraulichkeit</td>
                    <td className="p-3 text-red-700 font-medium">Daten verlassen das Büro; AVV / DPA zwingend erforderlich</td>
                    <td className="p-3 text-emerald-700 font-bold">100 % bürointern (Luftspalt/Air-Gapped möglich)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-text-main">Internetverbindung</td>
                    <td className="p-3 text-text-main/70">Zwingend dauerhaft online</td>
                    <td className="p-3 text-emerald-700 font-bold">Vollständig offlinefähig (Baustelle, Tunnel, Flugzeug)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-text-main">Hardwareanforderung</td>
                    <td className="p-3 text-emerald-700 font-bold">Gering (läuft auf jedem Browser/Handy)</td>
                    <td className="p-3 text-amber-700 font-medium">Benötigt GPU mit VRAM (8–24 GB) oder Apple Silicon</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-text-main">Modell-Größe &amp; "Raw IQ"</td>
                    <td className="p-3 text-emerald-700 font-bold">Riesig (mehrere hundert Milliarden Parameter)</td>
                    <td className="p-3 text-text-main/80">Sehr hoch bei 14B–70B Modellen, für 95 % aller Büroaufgaben ausreichend</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-text-main">Laufende Kosten</td>
                    <td className="p-3 text-text-main/70">ca. 20–200 €/Monat pro Nutzer bzw. API-Token-Kosten (Stand 10/2026, Tarife prüfen)</td>
                    <td className="p-3 text-emerald-700 font-bold">0 € Lizenzkosten (nur Bürostrom)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MODELL-EMPFEHLUNGEN */}
      {activeSubTab === 'modelle' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
            <div>
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Database className="text-shiraz" /> Die besten Open-Source-Modelle für Bauingenieure
              </h4>
              <p className="text-xs text-text-main/70 mt-1">
                Kopiere den Hugging-Face-Suchbegriff und füge ihn direkt in das Suchfeld von LM Studio ein.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {LOCAL_MODELS.map((model) => (
                <div key={model.name} className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-text-main">{model.name}</span>
                        <span className="text-xxs px-2 py-0.5 rounded-md bg-shiraz/10 text-shiraz font-bold">
                          {model.sizeParam}
                        </span>
                      </div>
                      <span className="text-xxs text-text-main/60 block mt-0.5">Entwickler: {model.creator}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(model.huggingFaceSearch, model.name)}
                        className={`px-3 py-1.5 rounded-xl text-xxs font-bold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                          copiedId === model.name
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz'
                        }`}
                      >
                        {copiedId === model.name ? <CheckCircle2 size={13} className="text-white" /> : <Copy size={13} />}
                        {copiedId === model.name ? 'Suchtext kopiert!' : 'HuggingFace ID kopieren'}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed">
                    {model.engineeringStrength}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xxs">
                    <div className="p-2.5 bg-white rounded-xl border border-home-grau/20">
                      <span className="text-text-main/50 block font-semibold mb-0.5">Empfohlener VRAM:</span>
                      <span className="font-bold text-text-main">{model.minVram}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-home-grau/20">
                      <span className="text-text-main/50 block font-semibold mb-0.5">Quantisierung:</span>
                      <span className="font-bold text-text-main font-mono">{model.quantization}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-home-grau/20">
                      <span className="text-text-main/50 block font-semibold mb-0.5">Haupteinsatzgebiet:</span>
                      <span className="font-bold text-shiraz">{model.recommendedRole}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: BENCHMARKING CLOUD VS LOKAL */}
      {activeSubTab === 'benchmark' && (
        <div className="space-y-6">
          <ModelBenchmarkMatrix />
        </div>
      )}

      {/* TAB 4: LOKALER SERVER & API-ANBINDUNG */}
      {activeSubTab === 'server' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-5">
            <div>
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Terminal className="text-shiraz" /> LM Studio als lokaler OpenAI-kompatibler API-Server
              </h4>
              <p className="text-xs text-text-main/70 mt-1">
                LM Studio enthält einen vollwertigen lokalen HTTP-Server. Jedes Werkzeug, das mit der OpenAI-API spricht (Cursor, VS Code Cline/Roo, Python, Excel-Makros), kann direkt an <code className="font-mono bg-off-white px-1.5 py-0.5 rounded border">http://localhost:1234/v1</code> angebunden werden – völlig kostenlos und privat.
              </p>
            </div>

            {/* ANLEITUNG SERVER-START */}
            <div className="p-4 bg-off-white rounded-2xl border border-home-grau/20 space-y-2 text-xs text-text-main/80">
              <h5 className="font-bold text-xs text-text-main">Server in LM Studio aktivieren:</h5>
              <ol className="list-decimal list-inside space-y-1 text-xxs pl-1 text-text-main/70">
                <li>Klicken Sie links auf das <strong>Doppelpfeil- / Server-Symbol (&lt;-&gt;)</strong>.</li>
                <li>Wählen Sie oben das geladene Modell aus (z. B. Qwen 3.8 Coder 32B).</li>
                <li>Klicken Sie auf den grünen Button <strong>"Start Server"</strong>.</li>
                <li>Der Server lauscht nun auf Port 1234: <code className="font-mono text-text-main bg-white px-1 rounded">http://localhost:1234/v1</code>.</li>
              </ol>
            </div>

            {/* PYTHON INTEGRATIONS-CODE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                  <Code size={14} className="text-shiraz" /> Python-Code: Automatische Betonprüfungs-Auswertung via Localhost
                </span>
                <button
                  onClick={() => handleCopy(`from openai import OpenAI

# Verbinde zum lokalen LM Studio Server (kein API-Key erforderlich)
client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="lm-studio"
)

prompt = """
Folgende Druckfestigkeiten [N/mm²] wurden an 150mm Probewürfeln nach 28 Tagen gemessen:
[34.2, 36.8, 32.5, 38.1, 35.0, 33.9]
Zielklasse: C25/30.
Berechne f_cm, Standardabweichung s und f_ck. Ist das Konformitätskriterium nach DIN EN 206 erfüllt?
"""

response = client.chat.completions.create(
    model="qwen2.5-14b-instruct",
    messages=[
        {"role": "system", "content": "Du bist ein präziser Baustoff-Prüfingenieur."},
        {"role": "user", "content": prompt}
    ],
    temperature=0.1
)

print(response.choices[0].message.content)`, 'python_code')}
                  className={`px-3 py-1.5 rounded-xl text-xxs font-bold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                    copiedId === 'python_code'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz'
                  }`}
                >
                  {copiedId === 'python_code' ? <CheckCircle2 size={12} className="text-white" /> : <Copy size={12} />}
                  {copiedId === 'python_code' ? 'Code kopiert!' : 'Skript kopieren'}
                </button>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xxs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <pre>{`from openai import OpenAI

# Verbinde zum lokalen LM Studio Server (kein API-Key erforderlich)
client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="lm-studio"
)

response = client.chat.completions.create(
    model="local-model",
    messages=[
        {"role": "system", "content": "Du bist ein präziser Baustoff-Prüfingenieur nach DIN EN 206."},
        {"role": "user", "content": "Prüfe f_cm für Messwerte: 34.2, 36.8, 32.5, 38.1 N/mm² für C25/30."}
    ],
    temperature=0.1
)

print(response.choices[0].message.content)`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: HARDWARE-DIMENSIONIERUNG */}
      {activeSubTab === 'hardware' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-5">
            <div>
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Cpu className="text-shiraz" /> Hardware-Kaufberatung für Ingenieurbüros
              </h4>
              <p className="text-xs text-text-main/70 mt-1">
                Lokale Sprachmodelle benötigen vor allem eines: <strong>schnellen Speicher (VRAM)</strong>. Die Rechenleistung der GPU bestimmt die Geschwindigkeit (Tokens/Sekunde), die VRAM-Größe bestimmt, wie schlau das Modell sein kann.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <span className="text-xxs font-bold text-shiraz uppercase tracking-wider">Option A: Windows PC / Workstation</span>
                <h5 className="font-bold text-xs text-text-main">NVIDIA GeForce RTX (CUDA)</h5>
                <p className="text-xxs text-text-main/70 leading-relaxed">
                  Der Goldstandard für maximale Rechengeschwindigkeit.
                </p>
                <ul className="text-xxs text-text-main/80 space-y-1 pt-1 list-disc list-inside">
                  <li><strong>RTX 4060 Ti 16 GB:</strong> Günstigster Einstieg in 14B Modelle (~450 €).</li>
                  <li><strong>RTX 4070 Ti Super 16 GB:</strong> Hohe Geschwindigkeit für 14B Modelle (~850 €).</li>
                  <li><strong>RTX 3090 / 4090 24 GB:</strong> Betreibt 32B Coder-Modelle mit Leichtigkeit (~1.000–1.800 €).</li>
                </ul>
              </div>

              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <span className="text-xxs font-bold text-shiraz uppercase tracking-wider">Option B: Apple Mac (Unified Memory)</span>
                <h5 className="font-bold text-xs text-text-main">Mac Studio / MacBook Pro (M-Serie)</h5>
                <p className="text-xxs text-text-main/70 leading-relaxed">
                  Geheimtipp für Riesen-Modelle (70B) zum unschlagbaren Preis pro Gigabyte RAM.
                </p>
                <ul className="text-xxs text-text-main/80 space-y-1 pt-1 list-disc list-inside">
                  <li>Der gemeinsame Speicher (Unified Memory) wird komplett als VRAM genutzt!</li>
                  <li><strong>Mac Studio mit 64 oder 128 GB RAM:</strong> Führt mühelos 70B Modelle aus. Bei NVIDIA bräuchte man dafür sonst zwei teure Profi-Karten.</li>
                  <li>Flüsterleise und extrem stromsparend im Dauerbetrieb.</li>
                </ul>
              </div>

              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <span className="text-xxs font-bold text-shiraz uppercase tracking-wider">Option C: Reiner CPU-Betrieb</span>
                <h5 className="font-bold text-xs text-text-main">Bestehende Büro-PCs ohne Grafikkarte</h5>
                <p className="text-xxs text-text-main/70 leading-relaxed">
                  Möglich über AVX2-Befehlssätze, jedoch deutlich langsamer.
                </p>
                <ul className="text-xxs text-text-main/80 space-y-1 pt-1 list-disc list-inside">
                  <li>7B-Modelle laufen mit ca. 5–10 Tokens/Sekunde (lesbar).</li>
                  <li>Für gelegentliche Übersetzungen oder Zusammenfassungen völlig ausreichend.</li>
                  <li>Empfehlung: Mindestens 32 GB DDR4/DDR5 Arbeitsspeicher im Dual-Channel-Modus.</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 6: VRAM- & EIGNUNGSRECHNER */}
      {activeSubTab === 'rechner' && (
        <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/20">
            <div>
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Sliders className="text-shiraz w-4 h-4" /> Hardware- &amp; Modell-Eignungsrechner
              </h4>
              <p className="text-xxs text-text-main/70 mt-0.5">
                Wählen Sie Ihre vorhandene Hardware-Ausstattung und prüfen Sie sofort, welche Modellgrößen flüssig laufen.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'laptop_8gb', title: 'Standard Laptop', vram: '6–8 GB VRAM / 16 GB RAM', desc: 'Typischer Bauleiter-Laptop mit RTX 3050/4050 oder Mac mit 16 GB' },
              { id: 'desktop_16gb', title: 'CAD-Workstation', vram: '12–16 GB VRAM', desc: 'Desktop-PC mit RTX 4060Ti/4070 oder Mac mit 24–36 GB RAM' },
              { id: 'workstation_24gb', title: 'High-End Workstation', vram: '24 GB VRAM (RTX 3090/4090)', desc: 'Dedizierte Berechnungs-Workstation im Statikbüro' },
              { id: 'mac_studio_64gb', title: 'Mac Studio / Server', vram: '64–128 GB Unified RAM', desc: 'Apple M2/M3 Max/Ultra mit 64+ GB Speicher' },
            ].map((hw) => (
              <button
                key={hw.id}
                onClick={() => setSelectedHardware(hw.id as any)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedHardware === hw.id
                    ? 'bg-shiraz/10 text-shiraz border-shiraz font-bold shadow-xs'
                    : 'bg-off-white text-text-main/80 border-home-grau/20 hover:border-shiraz/40'
                }`}
              >
                <div className="font-bold text-xs mb-1">{hw.title}</div>
                <div className="text-xxs text-shiraz font-mono mb-1">{hw.vram}</div>
                <div className="text-xxxs text-text-main/60 leading-snug">{hw.desc}</div>
              </button>
            ))}
          </div>

          {/* ERGEBNIS-ANZEIGE */}
          <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-4">
            <h5 className="font-bold text-xs text-text-main flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600 w-4 h-4" /> Leistungsprognose für Ihre Auswahl:
            </h5>

            {selectedHardware === 'laptop_8gb' && (
              <div className="space-y-2 text-xs text-text-main/80">
                <p><strong>Maximale Modellklasse:</strong> 7B bis 8B Parameter (z. B. <em>Llama 3.1 8B Q4_K_M</em> oder <em>Qwen3 8B Q5_K_M</em>).</p>
                <p><strong>Geschwindigkeit:</strong> Sehr schnell (40–60 Tokens/s auf GPU).</p>
                <p><strong>Eignung für Bauaufgaben:</strong> Sehr gut für Textzusammenfassungen, Protokolle, Baustellen-Notizen und einfache Skripte. Für komplexe Tragwerksüberprüfungen oder tiefgehende statische Ableitungen sind größere Modelle empfohlen.</p>
              </div>
            )}

            {selectedHardware === 'desktop_16gb' && (
              <div className="space-y-2 text-xs text-text-main/80">
                <p><strong>Maximale Modellklasse:</strong> 14B Parameter (z. B. <em>Qwen3 14B Q5_K_M</em> oder <em>DeepSeek-R1-Distill 14B Q4_K_M</em>).</p>
                <p><strong>Geschwindigkeit:</strong> Flüssig (25–40 Tokens/s).</p>
                <p><strong>Eignung für Bauaufgaben:</strong> <strong>Der "Sweet Spot" für Ingenieurbüros!</strong> Exzellentes Verständnis von DIN-Normen, meistert Baugutachten, komplexe bauphysikalische Zusammenhänge und mehrstufige Auswertungen.</p>
              </div>
            )}

            {selectedHardware === 'workstation_24gb' && (
              <div className="space-y-2 text-xs text-text-main/80">
                <p><strong>Maximale Modellklasse:</strong> 32B Parameter (z. B. <em>Qwen2.5-Coder 32B Q4_K_M</em>).</p>
                <p><strong>Geschwindigkeit:</strong> Hoch (30–45 Tokens/s auf RTX 4090/5090).</p>
                <p><strong>Eignung für Bauaufgaben:</strong> Spitzenklasse bei Python-Skripten, Automatisierung von Laborprüfmaschinen, IFC-BIM-Datenverarbeitung und formelmäßigen Herleitungen.</p>
              </div>
            )}

            {selectedHardware === 'mac_studio_64gb' && (
              <div className="space-y-2 text-xs text-text-main/80">
                <p><strong>Maximale Modellklasse:</strong> 70B Parameter (z. B. <em>Llama 3.3 70B Q4_K_M</em> oder <em>Qwen2.5 72B</em>).</p>
                <p><strong>Geschwindigkeit:</strong> Angenehmes Lesetempo (15–22 Tokens/s).</p>
                <p><strong>Eignung für Bauaufgaben:</strong> <strong>Leistungsstarke Modelle auf dem Schreibtisch.</strong> Hohe Argumentationskraft (Abstand zu Cloud-Spitzenmodellen im Einzelfall testen), geeignet für Schiedsgutachten, wissenschaftliche Publikationen und anspruchsvollste juristisch-technische Analysen ohne Cloud.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
