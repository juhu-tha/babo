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
import inhalt from '@/content/ki/LokaleKI.json';
import { MdText } from '@/src/components/inhalt/MdText';

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

const LOCAL_MODELS: RecommendedModel[] = inhalt.daten.LOCAL_MODELS;

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
              <Server className="text-shiraz" /><MdText text={inhalt.texte.lokaleKiLmStudio} /></h3>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.hoheDatensouveränitätOhneCloud} /></p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xxs font-extrabold uppercase rounded-full tracking-wider flex items-center gap-1.5">
            <Lock size={13} className="text-emerald-600" /><MdText text={inhalt.texte.offlineDatensparsam} /></span>
        </div>

        {/* SUB-TABS */}
        <div className="flex flex-wrap gap-2 pt-5 border-b border-home-grau/20 mt-2">
          <button aria-pressed={activeSubTab === 'anleitung'}
            onClick={() => setActiveSubTab('anleitung')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'anleitung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Download size={14} /><MdText text={inhalt.texte.t1LmStudioSchritt} /></button>
          <button aria-pressed={activeSubTab === 'warum'}
            onClick={() => setActiveSubTab('warum')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'warum'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <ShieldCheck size={14} /><MdText text={inhalt.texte.t2WarumLokalIm} /></button>
          <button aria-pressed={activeSubTab === 'modelle'}
            onClick={() => setActiveSubTab('modelle')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'modelle'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Database size={14} /><MdText text={inhalt.texte.t3ModellEmpfehlungenGguf} /></button>
          <button aria-pressed={activeSubTab === 'benchmark'}
            onClick={() => setActiveSubTab('benchmark')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'benchmark'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Gauge size={14} /><MdText text={inhalt.texte.t4BenchmarkingCloudVs} /></button>
          <button aria-pressed={activeSubTab === 'server'}
            onClick={() => setActiveSubTab('server')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'server'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Terminal size={14} /><MdText text={inhalt.texte.t5LokalerServerApi} /></button>
          <button aria-pressed={activeSubTab === 'hardware'}
            onClick={() => setActiveSubTab('hardware')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'hardware'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Cpu size={14} /><MdText text={inhalt.texte.t6HardwareDimensionierung} /></button>
          <button aria-pressed={activeSubTab === 'rechner'}
            onClick={() => setActiveSubTab('rechner')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'rechner'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Sliders size={14} /><MdText text={inhalt.texte.t7VramEignungsrechner} /></button>
        </div>
      </div>

      {/* TAB 1: SCHRITT FÜR SCHRITT ANLEITUNG LM STUDIO */}
      {activeSubTab === 'anleitung' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-6">
            <div>
              <h4 className="font-bold text-base text-text-main flex items-center gap-2">
                <Download className="text-shiraz" /><MdText text={inhalt.texte.praxisleitfadenVonNullZur} /></h4>
              <p className="text-xs text-text-main/70 mt-1">
                LM Studio (<a href="https://lmstudio.ai" target="_blank" rel="noreferrer" className="text-shiraz font-bold underline">lmstudio.ai</a><MdText text={inhalt.texte.istDasBenutzerfreundlichsteWerkzeug} /></p>
            </div>

            {/* DIE 5 SCHRITTE */}
            <div className="space-y-4">
              
              {/* SCHRITT 1 */}
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                  <div className="w-6 h-6 rounded-lg bg-shiraz text-white flex items-center justify-center text-xxs font-bold">1</div>
                  <span><MdText text={inhalt.texte.installationStartVonLm} /></span>
                </div>
                <p className="text-xxs text-text-main/70 leading-relaxed pl-8"><MdText text={inhalt.texte.ladenSieDenInstaller} /></p>
              </div>

              {/* SCHRITT 2 */}
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                  <div className="w-6 h-6 rounded-lg bg-shiraz text-white flex items-center justify-center text-xxs font-bold">2</div>
                  <span><MdText text={inhalt.texte.modellSuchenHerunterladenLupen} /></span>
                </div>
                <p className="text-xxs text-text-main/70 leading-relaxed pl-8"><MdText text={inhalt.texte.klickenSieInDer} /><code className="bg-white px-1.5 py-0.5 rounded border font-mono">Qwen3-14B-GGUF</code> oder <code className="bg-white px-1.5 py-0.5 rounded border font-mono">Llama-3.1-8B-Instruct-GGUF</code><MdText text={inhalt.texte.einLmStudioDurchsucht} /></p>
              </div>

              {/* SCHRITT 3 */}
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                  <div className="w-6 h-6 rounded-lg bg-shiraz text-white flex items-center justify-center text-xxs font-bold">3</div>
                  <span><MdText text={inhalt.texte.dieRichtigeQuantisierungGguf} /></span>
                </div>
                <div className="text-xxs text-text-main/70 leading-relaxed pl-8 space-y-2">
                  <p><MdText text={inhalt.texte.rechtsErscheintEineListe} /></p>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-xxs"><MdText text={inhalt.texte.faustregelFürBauingenieureQ4} /></div>
                </div>
              </div>

              {/* SCHRITT 4 */}
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                  <div className="w-6 h-6 rounded-lg bg-shiraz text-white flex items-center justify-center text-xxs font-bold">4</div>
                  <span><MdText text={inhalt.texte.gpuOffloadAktivierenChat} /></span>
                </div>
                <p className="text-xxs text-text-main/70 leading-relaxed pl-8"><MdText text={inhalt.texte.wechselnSieInDas} /></p>
              </div>

              {/* SCHRITT 5 */}
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                  <div className="w-6 h-6 rounded-lg bg-shiraz text-white flex items-center justify-center text-xxs font-bold">5</div>
                  <span><MdText text={inhalt.texte.systemPromptFürBauingenieure} /></span>
                </div>
                <div className="text-xxs text-text-main/70 leading-relaxed pl-8 space-y-2">
                  <p><MdText text={inhalt.texte.hinterlegenSieUnterSystem} /></p>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/20 font-mono text-xxs text-text-main/80 relative">
                    <button
                      onClick={() => handleCopy(inhalt.werte.duBistEinHochpräziser, 'prompt_sys')}
                      className="absolute right-2 top-2 px-2 py-1 bg-shiraz text-white rounded text-xxxs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'prompt_sys' ? <CheckCircle2 size={10} /> : <Copy size={10} />}
                      {copiedId === 'prompt_sys' ? 'Kopiert' : 'Kopieren'}
                    </button><MdText text={inhalt.texte.duBistEinHochpräziser} /></div>
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
              <h4 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t100GeheimhaltungDsgvo} /></h4>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.bauherrennamenPrivateGrundrisseKostenkal} /></p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <WifiOff size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.baustellenOfflineFähig} /></h4>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.funktioniertImBaucontainerOhne} /></p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Coins size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t0ApiAbokosten} /></h4>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.keineMonatlichenProAbos} /></p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Database size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.reproduzierbarkeitBeständigkeit} /></h4>
              <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.cloudAnbieterÄndernModelle} /></p>
            </div>

          </div>

          {/* VERGLEICHSTABELLE: CLOUD VS LOKAL */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <Layers className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.systemvergleichCloudLlmsVs} /></h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/30 bg-off-white text-text-main">
                    <th className="p-3 font-bold">Kriterium</th>
                    <th className="p-3 font-bold text-amber-900"><MdText text={inhalt.texte.cloudKiChatgptClaude} /></th>
                    <th className="p-3 font-bold text-emerald-900"><MdText text={inhalt.texte.lokaleKiLmStudio2} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-xxs">
                  <tr>
                    <td className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.datenschutzVertraulichkeit} /></td>
                    <td className="p-3 text-red-700 font-medium"><MdText text={inhalt.texte.datenVerlassenDasBüro} /></td>
                    <td className="p-3 text-emerald-700 font-bold"><MdText text={inhalt.texte.t100BürointernLuftspaltAir} /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-text-main">Internetverbindung</td>
                    <td className="p-3 text-text-main/70"><MdText text={inhalt.texte.zwingendDauerhaftOnline} /></td>
                    <td className="p-3 text-emerald-700 font-bold"><MdText text={inhalt.texte.vollständigOfflinefähigBaustelleTunnel} /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-text-main">Hardwareanforderung</td>
                    <td className="p-3 text-emerald-700 font-bold"><MdText text={inhalt.texte.geringLäuftAufJedem} /></td>
                    <td className="p-3 text-amber-700 font-medium"><MdText text={inhalt.texte.benötigtGpuMitVram} /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.modellGrößeRawIq} /></td>
                    <td className="p-3 text-emerald-700 font-bold"><MdText text={inhalt.texte.riesigMehrereHundertMilliarden} /></td>
                    <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.sehrHochBei14b} /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.laufendeKosten} /></td>
                    <td className="p-3 text-text-main/70"><MdText text={inhalt.texte.ca20200Monat} /></td>
                    <td className="p-3 text-emerald-700 font-bold"><MdText text={inhalt.texte.t0LizenzkostenNurBürostrom} /></td>
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
                <Database className="text-shiraz" /><MdText text={inhalt.texte.dieBestenOpenSource} /></h4>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.kopiereDenHuggingFace} /></p>
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
                        {copiedId === model.name ? inhalt.werte.suchtextKopiert : inhalt.werte.huggingfaceIdKopieren}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed">
                    {model.engineeringStrength}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xxs">
                    <div className="p-2.5 bg-white rounded-xl border border-home-grau/20">
                      <span className="text-text-main/50 block font-semibold mb-0.5"><MdText text={inhalt.texte.empfohlenerVram} /></span>
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
                <Terminal className="text-shiraz" /><MdText text={inhalt.texte.lmStudioAlsLokaler} /></h4>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.lmStudioEnthältEinen} /><code className="font-mono bg-off-white px-1.5 py-0.5 rounded border">http://localhost:1234/v1</code><MdText text={inhalt.texte.angebundenWerdenVölligKostenlos} /></p>
            </div>

            {/* ANLEITUNG SERVER-START */}
            <div className="p-4 bg-off-white rounded-2xl border border-home-grau/20 space-y-2 text-xs text-text-main/80">
              <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.serverInLmStudio} /></h5>
              <ol className="list-decimal list-inside space-y-1 text-xxs pl-1 text-text-main/70">
                <li><MdText text={inhalt.texte.klickenSieLinksAuf} /></li>
                <li><MdText text={inhalt.texte.wählenSieObenDas} /></li>
                <li><MdText text={inhalt.texte.klickenSieAufDen} /></li>
                <li><MdText text={inhalt.texte.derServerLauschtNun} /><code className="font-mono text-text-main bg-white px-1 rounded">http://localhost:1234/v1</code>.</li>
              </ol>
            </div>

            {/* PYTHON INTEGRATIONS-CODE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                  <Code size={14} className="text-shiraz" /><MdText text={inhalt.texte.pythonCodeAutomatischeBetonprüfungs} /></span>
                <button
                  onClick={() => handleCopy(inhalt.werte.fromOpenaiImportOpenai, 'python_code')}
                  className={`px-3 py-1.5 rounded-xl text-xxs font-bold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                    copiedId === 'python_code'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz'
                  }`}
                >
                  {copiedId === 'python_code' ? <CheckCircle2 size={12} className="text-white" /> : <Copy size={12} />}
                  {copiedId === 'python_code' ? inhalt.werte.codeKopiert : inhalt.werte.skriptKopieren}
                </button>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xxs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <pre>{inhalt.werte.fromOpenaiImportOpenai2}</pre>
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
                <Cpu className="text-shiraz" /><MdText text={inhalt.texte.hardwareKaufberatungFürIngenieurbüros} /></h4>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.lokaleSprachmodelleBenötigenVor} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <span className="text-xxs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.optionAWindowsPc} /></span>
                <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.nvidiaGeforceRtxCuda} /></h5>
                <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.derGoldstandardFürMaximale} /></p>
                <ul className="text-xxs text-text-main/80 space-y-1 pt-1 list-disc list-inside">
                  <li><MdText text={inhalt.texte.rtx4060Ti16} /></li>
                  <li><MdText text={inhalt.texte.rtx4070TiSuper} /></li>
                  <li><MdText text={inhalt.texte.rtx3090409024} /></li>
                </ul>
              </div>

              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <span className="text-xxs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.optionBAppleMac} /></span>
                <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.macStudioMacbookPro} /></h5>
                <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.geheimtippFürRiesenModelle} /></p>
                <ul className="text-xxs text-text-main/80 space-y-1 pt-1 list-disc list-inside">
                  <li><MdText text={inhalt.texte.derGemeinsameSpeicherUnified} /></li>
                  <li><MdText text={inhalt.texte.macStudioMit64} /></li>
                  <li><MdText text={inhalt.texte.flüsterleiseUndExtremStromsparend} /></li>
                </ul>
              </div>

              <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-2">
                <span className="text-xxs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.optionCReinerCpu} /></span>
                <h5 className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.bestehendeBüroPcsOhne} /></h5>
                <p className="text-xxs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.möglichÜberAvx2Befehlssätze} /></p>
                <ul className="text-xxs text-text-main/80 space-y-1 pt-1 list-disc list-inside">
                  <li><MdText text={inhalt.texte.t7bModelleLaufenMit} /></li>
                  <li><MdText text={inhalt.texte.fürGelegentlicheÜbersetzungenOder} /></li>
                  <li><MdText text={inhalt.texte.empfehlungMindestens32Gb} /></li>
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
                <Sliders className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.hardwareModellEignungsrechner} /></h4>
              <p className="text-xxs text-text-main/70 mt-0.5"><MdText text={inhalt.texte.wählenSieIhreVorhandene} /></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {inhalt.daten.LokaleKI.map((hw) => (
              <button
                key={hw.id}
                onClick={() => setSelectedHardware(hw.id as typeof selectedHardware)}
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
              <CheckCircle2 className="text-emerald-600 w-4 h-4" /><MdText text={inhalt.texte.leistungsprognoseFürIhreAuswahl} /></h5>

            {selectedHardware === 'laptop_8gb' && (
              <div className="space-y-2 text-xs text-text-main/80">
                <p><MdText text={inhalt.texte.maximaleModellklasse7bBis} /></p>
                <p><MdText text={inhalt.texte.geschwindigkeitSehrSchnell40} /></p>
                <p><MdText text={inhalt.texte.eignungFürBauaufgabenSehr} /></p>
              </div>
            )}

            {selectedHardware === 'desktop_16gb' && (
              <div className="space-y-2 text-xs text-text-main/80">
                <p><MdText text={inhalt.texte.maximaleModellklasse14bParameter} /></p>
                <p><MdText text={inhalt.texte.geschwindigkeitFlüssig2540} /></p>
                <p><MdText text={inhalt.texte.eignungFürBauaufgabenDer} /></p>
              </div>
            )}

            {selectedHardware === 'workstation_24gb' && (
              <div className="space-y-2 text-xs text-text-main/80">
                <p><MdText text={inhalt.texte.maximaleModellklasse32bParameter} /></p>
                <p><MdText text={inhalt.texte.geschwindigkeitHoch3045} /></p>
                <p><MdText text={inhalt.texte.eignungFürBauaufgabenSpitzenklasse} /></p>
              </div>
            )}

            {selectedHardware === 'mac_studio_64gb' && (
              <div className="space-y-2 text-xs text-text-main/80">
                <p><MdText text={inhalt.texte.maximaleModellklasse70bParameter} /></p>
                <p><MdText text={inhalt.texte.geschwindigkeitAngenehmesLesetempo15} /></p>
                <p><MdText text={inhalt.texte.eignungFürBauaufgabenLeistungsstarke} /></p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
