import React, { useEffect, useState } from 'react';
import { adminLogin, adminLogout, verifyAdminSession } from '@/src/utils/adminAuth';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  FileText, 
  Copy, 
  Check, 
  Layers, 
  Sparkles,
  Code,
  Cpu,
  Boxes,
  Palette,
  Server
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

const FULL_AUDIT_PROMPT = `================================================================================
VERBINDLICHER GESAMT-AUDITPROMPT DER WISSENSPLATTFORM BAUSTOFFBOARD (THA)
SYSTEMWEITES QUALITÄTSAUDIT & FACHLICHE GESAMTREVISION ALLER ARBEITSPAKETE (AP 01–17)
================================================================================

1. ZIELSETZUNG & AUDIT-MANDAT
Ziel ist die vollständige, fachlich lückenlose und didaktisch exzellente Qualitätsrevision
aller 17 thematischen Arbeitspakete (AP 01 bis AP 17) der interaktiven Wissensplattform
Baustoffkunde & Werkstoffmechanik der Technischen Hochschule Augsburg (THA).
Alle Module müssen dem Gold-Standard (Referenz: Kalk.tsx) sowie der Modulspezifikation
(GEMINI_md) und den 6 Prüfdimensionen der Qualitätssicherung entsprechen.

--------------------------------------------------------------------------------
2. DIE 6 SYSTEMWEITEN PRÜFDIMENSIONEN DER QUALITÄTSSICHERUNG
Jedes einzelne Fachmodul wird zwingend anhand folgender 6 Qualitätsdimensionen auditiert:

  [1] RICHTIGKEIT & NORMENKONFORMITÄT:
      - Fachliche Fehlerfreiheit aller bauphysikalischen, thermodynamischen, chemischen
        und mechanischen Gleichungen.
      - Aktualität aller Regelwerke nach neuester Ausgabegeneration (DIN Media / Beuth / ISO)
        inklusive exakter Jahres- und Monatsangabe (z.B. DIN EN 1992-1-1:2023-08,
        DIN 1045-2:2023-08, DIN EN 1995-1-1:2024-03).
      - Bereinigung veralteter Normzitate und ungenauer Kennwerte.

  [2] DIDAKTIK & VERSTÄNDLICHKEIT:
      - Curricular logischer Aufbau entlang des 4-Stufen-Lehrpfads (Grundlagen ->
        Laborversuche -> Bemessung & Praxis -> Selbstüberprüfung).
      - Adressatengerechte Sprache für Studierende des Bauingenieurwesens und Fachkräfte.
      - Didaktische Hervorhebung von Kernbegriffen durch prägnante Begriffsauszeichnungen.

  [3] VOLLSTÄNDIGKEIT (KERNPRÜFDIMENSION):
      - KERNFRAGE: "Ist das Modul in sich thematisch umfassend und vollständig?
        (dies ist die einzige Bedingung)"
      - Ein Modul erfüllt diesen Qualitätsmaßstab nur dann, wenn das behandelte
        Fachthema in seiner gesamten Tiefe und Breite lückenlos, fundiert und
        ohne inhaltliche Aussparungen eigenständig vermittelt wird.
      - Vollständige Integration aller physikalisch-chemischen Mechanismen, Herleitungen,
        Grenzwerte, Bemessungsschritte und Schadensmechanismen.

  [4] PRAXISRELEVANZ & HANDLUNGSKOMPETENZ:
      - Vermittlung von handlungsfähigem Ingenieurwissen für Baustelle, Prüflabor,
        Tragwerksplanung und Bauschadensgutachten.
      - Reale Fallbeispiele, Schadensprävention, Schadensbilder und Prüfvorschriften.

  [5] KONSISTENZ & VERNETZUNG:
      - KERNFRAGE: "Ist das Modul in sich logisch aufgebaut? Sind alle notwendigen
        Informationen zum Verständnis in anderen Modulen vorhanden?"
      - Nahtlose Verknüpfung der Lehrpfade, konsistente Nomenklatur und Vorzeichenkonventionen.
      - Bereinigung von Textdopplungen, verwaisten Querverweisen oder redundanten Modulstrukturen.

  [6] INTERAKTIVITÄT & VERIFIKATION:
      - Integration interaktiver Rechenwerkzeuge, Diagramme, Parametervariationen und Simulatoren.
      - Verbindliche Einhaltung der deutschen Zahlenformatierung:
        Tausendertrennung mit Punkt, Dezimaltrennzeichen mit Komma via formatDeZahl.
      - Mathematisch präzises Formel-Rendering mit LaTeX/KaTeX (InlineMath & BlockMath).`;

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    verifyAdminSession().then(valid => {
      if (active && valid) setIsAuthenticated(true);
    });
    return () => {
      active = false;
    };
  }, []);
  const [activeTab, setActiveTab] = useState<'pruefraster' | 'prompt' | 'gestaltung' | 'tech_stack' | 'code_umfang'>('pruefraster');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput || isChecking) return;
    setIsChecking(true);
    const result = await adminLogin(passwordInput);
    setIsChecking(false);
    setPasswordInput('');
    if (result.ok) {
      setIsAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage(result.message || 'Anmeldung fehlgeschlagen.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    adminLogout();
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(FULL_AUDIT_PROMPT).then(() => {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    });
  };

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in duration-300">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-home-grau/30 text-center">
          <div className="w-16 h-16 bg-shiraz/10 text-shiraz rounded-2xl flex items-center justify-center mx-auto mb-5 border border-shiraz/20 shadow-xs">
            <ShieldCheck size={32} />
          </div>

          <h2 className="text-xl font-extrabold text-text-main mb-2">
            Administrator-Bereich (THA)
          </h2>
          <p className="text-xs text-text-main/70 mb-6 leading-relaxed">
            Dieser Administrationsbereich enthält das Qualitätsaudit, den Umsetzungsgrad aller 17 Arbeitspakete (AP 01–17) sowie den systemweiten Auditprompt.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Kennwort eingeben..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-off-white border border-home-grau/30 rounded-xl text-sm font-medium focus:ring-2 focus:ring-shiraz focus:border-shiraz outline-none transition-all placeholder:text-text-main/40"
              />
              <KeyRound size={18} className="absolute left-3.5 top-3.5 text-home-grau" />
            </div>

            {errorMessage && (
              <div className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 animate-shake">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isChecking}
              className="w-full py-3 bg-shiraz text-white font-bold text-sm rounded-xl shadow-md hover:bg-shiraz/90 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock size={16} /> {isChecking ? 'Kennwort wird geprüft …' : <>Entsperren &amp; Fortfahren</>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-home-grau/20 text-[11px] text-text-main/50">
            Autorisierter Zugang für Dozierende und Modulverantwortliche der THA.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Header Container nach GEMINI_md */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <ShieldCheck className="text-shiraz" /> Administrator-Dashboard &amp; Audit-Status
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-3 py-1 rounded-full border border-shiraz/20">
              Status: 100 % Konform (Gold-Standard)
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-text-main/60 hover:text-shiraz px-3 py-1 rounded-lg border border-home-grau/30 hover:bg-off-white transition-all cursor-pointer"
            >
              Abmelden
            </button>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 leading-relaxed">
          <p>
            Zentrale Kontrollinstanz für die didaktische und fachliche Qualitätssicherung der Wissensplattform BaustoffBoard (THA). 
            Überwacht die Einhaltung der <strong>6 Prüfdimensionen</strong> (mit universeller Durchsetzung von 
            <strong> Prüfdimension 3: Thematische Vollständigkeit</strong>) sowie den verbindlichen System-Auditprompt.
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'pruefraster'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('pruefraster')}
          >
            <CheckCircle2 size={16} /> Die 6 Prüfdimensionen
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('prompt')}
          >
            <FileText size={16} /> Auditprompt
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'gestaltung'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('gestaltung')}
          >
            <Palette size={16} /> Gestaltung der App
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'tech_stack'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('tech_stack')}
          >
            <Cpu size={16} /> Sprachen &amp; Tools
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'code_umfang'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('code_umfang')}
          >
            <Boxes size={16} /> Tool-Umfang &amp; Code
          </button>
        </div>

        {/* TAB 1: PRÜFRASTER */}
        {activeTab === 'pruefraster' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-2">
                <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">Dimension 1</span>
                <h4 className="font-bold text-sm text-text-main">Richtigkeit &amp; Normen</h4>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Fehlerfreie Gleichungen, aktuelle Normengeneration (2023/2024), DIN Media Links mit Monats-/Jahresausgaben.
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-2">
                <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">Dimension 2</span>
                <h4 className="font-bold text-sm text-text-main">Didaktik &amp; Verständlichkeit</h4>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  4-Stufen-Lehrpfad (Grundlagen, Labor, Bemessung, Test), adressatengerechte Sprache und Hervorhebung von Kernbegriffen.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-shiraz shadow-sm space-y-2 relative">
                <span className="text-xs font-mono font-bold text-white bg-shiraz px-2 py-0.5 rounded">Dimension 3 (KERN)</span>
                <h4 className="font-bold text-sm text-shiraz">Vollständigkeit (Thematisch)</h4>
                <p className="text-xs text-text-main/80 leading-relaxed font-medium">
                  „Ist das Modul in sich thematisch umfassend und vollständig? (dies ist die einzige Bedingung)“ – Keine inhaltlichen Auslassungen.
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-2">
                <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">Dimension 4</span>
                <h4 className="font-bold text-sm text-text-main">Praxisrelevanz</h4>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Handlungskompetenz für Baustelle, Prüflabor, Tragwerksplanung und Schadensgutachten; forensische Realdaten.
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-2">
                <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">Dimension 5</span>
                <h4 className="font-bold text-sm text-text-main">Konsistenz &amp; Vernetzung</h4>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Logischer modularer Aufbau, konsistente Nomenklatur, keine Textdopplungen, saubere Querverlinkung.
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-2">
                <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">Dimension 6</span>
                <h4 className="font-bold text-sm text-text-main">Interaktivität &amp; Verifikation</h4>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Interaktive Rechner mit deutscher Zahlenformatierung (formatDeZahl), KaTeX-Formeln und dynamische Verifikation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDITPROMPT */}
        {activeTab === 'prompt' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-text-main">
                Vollständiger, systemweiter Qualitäts-Auditprompt (THA BaustoffBoard)
              </span>
              <button
                onClick={handleCopyPrompt}
                className="px-3 py-1.5 rounded-lg bg-shiraz text-white text-xs font-bold hover:bg-shiraz/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedPrompt ? <Check size={14} /> : <Copy size={14} />}
                {copiedPrompt ? 'Kopiert!' : 'Prompt kopieren'}
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
              {FULL_AUDIT_PROMPT}
            </pre>
          </div>
        )}

        {/* TAB 4: GESTALTUNG DER APP (STYLEGUIDE & DESIGN SYSTEM) */}
        {activeTab === 'gestaltung' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-home-grau/15">
                <div>
                  <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                    <Palette size={18} className="text-shiraz" />
                    Gestaltungsvorgaben &amp; Modulspezifikation (GEMINI_md)
                  </h3>
                  <p className="text-xs text-text-main/70 mt-0.5">
                    Verbindliches Design-System und Master-Architektur für alle Fachmodule der Baustoffkunde und Bauchemie.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-shiraz/10 text-shiraz rounded-full border border-shiraz/20">
                    Gold-Standard: Kalk.tsx
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                    Master-Datei: GEMINI.md
                  </span>
                </div>
              </div>

              {/* Einleitender Grundsatz */}
              <div className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed space-y-2">
                <p>
                  Das Design der Wissensplattform folgt einem einladenden, hochgradig lesbaren und akademisch anspruchsvollen Light-Design-System.
                  <strong> Dunkle, immersive Kontraste und schwarze Konsolenhintergründe sind im gesamten System unerwünscht.</strong>
                  Alle Fachmodule kapseln ihre Inhalte in thematische Tabs (keine unendlichen Scroll-Seiten), führen den didaktischen 4-Stufen-Lehrpfad durch und schließen zwingend mit der standardisierten <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-home-grau/25">ModuleFooter</code>-Komponente ab.
                </p>
              </div>

              {/* 1. Die 4 strukturellen Architekturebenen */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                  <Layers size={16} className="text-shiraz" />
                  1. Die 4 logischen Architekturebenen jedes Fachmoduls
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider block font-mono">Ebene A: Zustandsverwaltung (Tabs)</span>
                    <p className="text-xs text-text-main/80 leading-relaxed">
                      Keine unendlichen Scroll-Pages. Informationen werden über einen Zustandswähler (<code className="font-mono text-[11px]">activeTab</code>) in thematische Blöcke gekapselt:
                    </p>
                    <ul className="text-xs text-text-main/70 space-y-1 list-disc pl-4">
                      <li><strong className="text-text-main">steckbrief:</strong> Standardisierte Stoffdatenbank (<code className="font-mono text-[11px]">BaustoffProfil</code>).</li>
                      <li><strong className="text-text-main">grundlagen:</strong> Chemische Kreisläufe, Bindeglieder, Entstehung.</li>
                      <li><strong className="text-text-main">festigkeit:</strong> Erhärtung, Hydratation, Gefügeaufbau.</li>
                      <li><strong className="text-text-main">bestaendigkeit:</strong> Normen, Expositionsklassen, Schutzmaßnahmen.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider block font-mono">Ebene B: Header &amp; Teaser-Box</span>
                    <p className="text-xs text-text-main/80 leading-relaxed">
                      Markante Überschrift mit Icon im Shiraz-Farbton und didaktische Teaser-Box im Off-White-Ton:
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-[11px] font-mono text-text-main/80 space-y-1">
                      <div>&lt;h2 className=&quot;text-xl font-bold text-text-main flex items-center gap-2&quot;&gt;</div>
                      <div className="pl-4">&lt;Box className=&quot;text-shiraz&quot; /&gt; Modulname</div>
                      <div>&lt;/h2&gt;</div>
                      <div>&lt;div className=&quot;text-sm bg-off-white p-4 rounded-xl border ...&quot;&gt;</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider block font-mono">Ebene C: Steckbrief-Einbindung</span>
                    <p className="text-xs text-text-main/80 leading-relaxed">
                      Physisch-chemische Kenndaten werden über die zentrale Profilkomponente mit Kennwerttabelle gerendert:
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-[11px] font-mono text-text-main/80">
                      <div>&#123;activeTab === &apos;steckbrief&apos; &amp;&amp; (</div>
                      <div className="pl-4">&lt;BaustoffProfil materialKey=&quot;kalk&quot; /&gt;</div>
                      <div>)&#125;</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider block font-mono">Ebene D: Standardisierter ModuleFooter</span>
                    <p className="text-xs text-text-main/80 leading-relaxed">
                      Führt Regelwerke, Fachliteratur, Wikipedia-Verweise, KaTeX-Formeln und rechtliche Hinweise zusammen (standardmäßig eingeklappt):
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-[11px] font-mono text-text-main/80">
                      <div>&lt;ModuleFooter</div>
                      <div className="pl-4">wikipedia=&#123;[...]&#125; literatur=&#123;[...]&#125;</div>
                      <div className="pl-4">regelwerke=&#123;[...]&#125; formeln=&#123;[...]&#125;</div>
                      <div>/&gt;</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Der 4-Stufen-Lehrpfad */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                  <Sparkles size={16} className="text-shiraz" />
                  2. Der didaktische 4-Stufen-Lehrpfad (Standard in jedem Modul)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-shiraz block uppercase">Stufe 1</span>
                    <strong className="text-xs font-bold text-text-main block">Grundlagen &amp; Theorie</strong>
                    <p className="text-[11px] text-text-main/70 leading-snug">Chemische Phasen, Kristallisationsvorgänge und physikalische Wirkprinzipien.</p>
                  </div>
                  <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-shiraz block uppercase">Stufe 2</span>
                    <strong className="text-xs font-bold text-text-main block">Labor &amp; Prüfverfahren</strong>
                    <p className="text-[11px] text-text-main/70 leading-snug">Prüfkörperherstellung, Normenprüfungen (Druck, Biegezug, Rohdichte, Konsistenz).</p>
                  </div>
                  <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-shiraz block uppercase">Stufe 3</span>
                    <strong className="text-xs font-bold text-text-main block">Praxis &amp; Bemessung</strong>
                    <p className="text-[11px] text-text-main/70 leading-snug">Rechentechnische Vertiefung via <code className="font-mono text-[10px]">FormulaDerivationBox</code> mit Schritt-für-Schritt-Herleitung.</p>
                  </div>
                  <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-shiraz block uppercase">Stufe 4</span>
                    <strong className="text-xs font-bold text-text-main block">Selbsttest &amp; Feedback</strong>
                    <p className="text-[11px] text-text-main/70 leading-snug">Modulbezogener Selbsttest via <code className="font-mono text-[10px]">ModulTest</code> (standardmäßig eingeklappt, mit Sofortbegründung).</p>
                  </div>
                </div>
              </div>

              {/* 3. Design-System, Farben & Striktes Verbot dunkler Boxen */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                  <Palette size={16} className="text-shiraz" />
                  3. Farbpalette, Elementbelegungen &amp; Strikte Verbote
                </h4>

                {/* Strikte Verbote / Anti-Slop Box */}
                <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl text-rose-950 text-xs leading-relaxed space-y-1">
                  <strong className="text-shiraz font-bold block flex items-center gap-1.5">
                    ⚠️ Verbindliche Layout-Verbote (Systemweiter Standard):
                  </strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-text-main/80 text-[11px]">
                    <li><strong>Keine schwarzen oder dunkelgrauen Boxen:</strong> Schwarze Konsolenhintergründe (<code className="font-mono text-rose-800">bg-slate-900</code>, <code className="font-mono text-rose-800">bg-black</code>) sind in Inhaltsboxen verboten.</li>
                    <li><strong>Keine harten Ecken:</strong> Strikte Einhaltung von <code className="font-mono text-text-main">rounded-2xl</code> für Hauptkarten und <code className="font-mono text-text-main">rounded-xl</code> für Buttons/Badges.</li>
                    <li><strong>Keine dominanten Schlagschatten:</strong> Nur dezente Schatten (<code className="font-mono text-text-main">shadow-sm</code>, <code className="font-mono text-text-main">shadow-xs</code>, <code className="font-mono text-text-main">shadow-xxs</code>).</li>
                    <li><strong>Keine grellen Neonfarben:</strong> Gedeckte, edle Akzentfarben statt leuchtender Werbefarben.</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Farbpalette (Tailwind)</span>
                    <div className="space-y-1.5 text-xs">
                      <div className="p-2 bg-white rounded-lg border border-home-grau/15 flex justify-between">
                        <span className="font-semibold text-text-main">Akzent: Shiraz</span>
                        <span className="font-mono text-[11px] text-shiraz font-bold">#8b1538</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-home-grau/15 flex justify-between">
                        <span className="font-semibold text-text-main">Rahmen: Home-Grau</span>
                        <span className="font-mono text-[11px] text-slate-600">border-home-grau/30</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-home-grau/15 flex justify-between">
                        <span className="font-semibold text-text-main">Infoboxen: Off-White</span>
                        <span className="font-mono text-[11px] text-slate-600">bg-off-white (#f8f9fa)</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-home-grau/15 flex justify-between">
                        <span className="font-semibold text-text-main">Historisch: Pergament</span>
                        <span className="font-mono text-[11px] text-amber-800">#fcf8f2</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Typografie &amp; Kontrast</span>
                    <div className="space-y-1.5 text-xs text-text-main/80">
                      <div className="p-2 bg-white rounded-lg border border-home-grau/15">
                        <strong>Titel:</strong> <code className="font-mono text-[11px]">text-text-main</code> (Anthrazit, ermüdungsfrei).
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-home-grau/15">
                        <strong>Fließtext:</strong> <code className="font-mono text-[11px]">text-text-main/80</code> mit <code className="font-mono text-[11px]">leading-relaxed</code>.
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-home-grau/15">
                        <strong>Fußnoten:</strong> <code className="font-mono text-[11px]">text-text-main/70</code> oder <code className="font-mono text-[11px]">text-slate-500</code>.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Formeln &amp; Zahlenformat</span>
                    <div className="space-y-1.5 text-xs text-text-main/80">
                      <div className="p-2 bg-white rounded-lg border border-home-grau/15">
                        <strong>LaTeX:</strong> Ausnahmslos via <code className="font-mono text-[11px]">react-katex</code> (<code className="font-mono text-[11px]">InlineMath</code> &amp; <code className="font-mono text-[11px]">BlockMath</code>).
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-home-grau/15">
                        <strong>DIN 1333:</strong> Deutsche Zahlenformatierung (Punkt/Komma via <code className="font-mono text-[11px]">formatDeZahl</code>).
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-home-grau/15">
                        <strong>Reaktionspfeile:</strong> Bedingungen angeben (<code className="font-mono text-[10px]">\xrightarrow&#123;...&#125;</code>, Phasen <code className="font-mono text-[10px]">\uparrow</code>).
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Muster-Template Beispielfach.tsx zum Kopieren */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                    <Code size={16} className="text-shiraz" />
                    4. Standardkonforme Mustervorlage eines Moduls (<code className="font-mono text-xs">Beispielfach.tsx</code>)
                  </h4>
                  <span className="text-[11px] text-text-main/60 font-mono">1:1 Vorlage aus GEMINI.md</span>
                </div>
                <pre className="p-4 bg-off-white rounded-xl border border-home-grau/30 text-[11px] font-mono text-text-main overflow-x-auto leading-relaxed">
{`import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Box, Layers, Activity, BookOpen } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

export default function Beispielfach() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'grundlagen' | 'praxis'>('steckbrief');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="text-shiraz" /> Modulname
        </h2>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button
            className={\`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer \${
              activeTab === 'steckbrief'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }\`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Steckbrief
          </button>
        </div>

        {/* Dynamischer Inhalt je nach activeTab */}
        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="beispiel" />
          </div>
        )}
      </div>

      {/* Stufe 3: Rechnerische Vertiefung */}
      <FormulaDerivationBox
        title="Beispiel: Stoffberechnung"
        zielGleichung="f_c = \\alpha \\cdot \\sigma"
        eingangsWerte={[...]}
        herleitung={[...]}
      />

      {/* Stufe 4: Selbsttest (standardmäßig eingeklappt) */}
      <ModulTest moduleId="beispiel" />

      {/* Standardisierter Footer */}
      <ModuleFooter
        wikipedia={[{ title: 'Fachbereich', url: 'https://de.wikipedia.org/' }]}
        literatur={['Wendehorst Baustoffkunde (37. Auflage, Springer Vieweg)']}
        regelwerke={[{ title: 'DIN EN 1234' }]}
        formeln={[]}
      />
    </div>
  );
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROGRAMMIERSPRACHEN & ENTWICKLUNGS-TOOLS */}
        {activeTab === 'tech_stack' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-home-grau/15">
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Cpu size={18} className="text-shiraz" />
                  Verwendete Programmiersprachen, Frameworks &amp; Tools
                </h3>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                  Full-Stack TypeScript
                </span>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Das BaustoffBoard ist als moderne, reaktive Web-Applikation auf Basis einer Single-Page-Application-Architektur (SPA) mit Express-Backend implementiert.
                Sämtlicher Quellcode ist strikt typisiert und kompilierbar.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Frontend & Sprache */}
                <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-3">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                    <Code size={16} /> Sprachen &amp; Kern-Frameworks
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">TypeScript 5.8</div>
                      <div className="text-text-main/70 text-[11px]">Vollständige Typsicherheit über alle Module, Rechner, Datenmodelle und Schnittstellen.</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">React 19 &amp; React DOM 19</div>
                      <div className="text-text-main/70 text-[11px]">Funktionale Komponenten, modulare Custom Hooks, Context-State-Management und dynamisches Lazy-Loading.</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">Tailwind CSS v4 &amp; Lucide Icons</div>
                      <div className="text-text-main/70 text-[11px]">Utility-First CSS, responsives Layout, modulares Farb-Tagging und über 500 Vektorsymbole.</div>
                    </div>
                  </div>
                </div>

                {/* Build, Server & Bibliotheken */}
                <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-3">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                    <Server size={16} /> Build, Server &amp; Mathematische Tools
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">Vite 6 &amp; tsx / esbuild</div>
                      <div className="text-text-main/70 text-[11px]">Ultraschneller Entwicklungs-Server, modularer HMR-Bundler und Node.js-Backend via tsx.</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">KaTeX (react-katex 3.1)</div>
                      <div className="text-text-main/70 text-[11px]">Mathematisch exaktes Formel-Rendering von LaTeX-Gleichungen im Fließtext und in Formelblöcken.</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">Visualisierung &amp; 3D</div>
                      <div className="text-text-main/70 text-[11px]">Chart.js, Recharts, Three.js (@react-three/fiber &amp; drei) für interaktive Kristallgitter &amp; Prüfstands-Plots.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: TOOL-UMFANG, MODULE & CODE-STATISTIK */}
        {activeTab === 'code_umfang' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-home-grau/15">
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Boxes size={18} className="text-shiraz" />
                  Tool-Umfang, Modulübersicht &amp; Codebasis-Kennzahlen
                </h3>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-shiraz/10 text-shiraz rounded-full border border-shiraz/20">
                  Stand: Oktober 2026
                </span>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Das BaustoffBoard umfasst eine der umfangreichsten digitalen Lehr- und Berechnungssammlungen im deutschsprachigen Bauingenieurwesen.
                Alle Module sind curricular vernetzt und interaktiv bedienbar.
              </p>

              {/* Kennzahlen-Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-center">
                  <span className="text-2xl font-extrabold text-shiraz font-mono block">244+</span>
                  <span className="text-xs font-semibold text-text-main/70 mt-1 block">Fachmodule (React TSX)</span>
                </div>
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-center">
                  <span className="text-2xl font-extrabold text-emerald-700 font-mono block">218.000+</span>
                  <span className="text-xs font-semibold text-text-main/70 mt-1 block">Zeilen Quellcode (LOC)</span>
                </div>
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-center">
                  <span className="text-2xl font-extrabold text-indigo-700 font-mono block">320+</span>
                  <span className="text-xs font-semibold text-text-main/70 mt-1 block">TypeScript-Dateien</span>
                </div>
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-center">
                  <span className="text-2xl font-extrabold text-amber-700 font-mono block">17</span>
                  <span className="text-xs font-semibold text-text-main/70 mt-1 block">Arbeitspakete (AP 01–17)</span>
                </div>
              </div>

              {/* Detaillierte Modul- & Code-Aufteilung */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2.5">
                  <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Verteilung der Codebasis</span>
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-home-grau/15">
                      <tr>
                        <td className="py-2 font-semibold text-text-main">Fachmodule (/src/modules)</td>
                        <td className="py-2 text-right font-mono font-bold text-shiraz">~187.600 Zeilen (244 Dateien)</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold text-text-main">Wiederverwendbare UI-Komponenten (/src/components)</td>
                        <td className="py-2 text-right font-mono font-bold text-indigo-700">~20.300 Zeilen (38 Dateien)</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold text-text-main">Normen-, Material- &amp; Aufgabendaten (/src/data)</td>
                        <td className="py-2 text-right font-mono font-bold text-emerald-700">~5.650 Zeilen (27 Dateien)</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold text-text-main">App-Router, Contexts, i18n &amp; Utils</td>
                        <td className="py-2 text-right font-mono font-bold text-slate-700">~4.600 Zeilen</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2.5">
                  <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Thematische Kerncluster</span>
                  <ul className="text-xs text-text-main/80 space-y-1.5 list-disc list-inside">
                    <li><strong>Cluster I:</strong> Grundlagen, Bauchemie, Labor- &amp; Prüftechnik, Diagnostik, Statistik</li>
                    <li><strong>Cluster II:</strong> Mineralische Baustoffe, Metalle, Holz, Kunststoffe, Asphalt, Bauprodukte</li>
                    <li><strong>Cluster III:</strong> Betontechnologie, Massivbau &amp; Eurocodes, WU-Bauwerke, Holzbau, Ausbau</li>
                    <li><strong>Cluster IV:</strong> Mechanik, Festigkeitslehre, Bauphysik (Wärme, Feuchte, Schall, Brand)</li>
                    <li><strong>Cluster V:</strong> Nachhaltigkeit, Zirkularität, LCA/LCC, Rückbau &amp; Recycling</li>
                    <li><strong>Cluster VI:</strong> Bauen im Bestand, Denkmalpflege, Schäden, SHM, Instandsetzung &amp; ZfP</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Normativer Footer nach GEMINI_md */}
      <ModuleFooter
        wikipedia={[
          { title: 'Qualitätsmanagement', url: 'https://de.wikipedia.org/wiki/Qualit%C3%A4tsmanagement' },
          { title: 'Audit', url: 'https://de.wikipedia.org/wiki/Audit' }
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 9001:2015-11 (Qualitätsmanagementsysteme - Anforderungen)' },
          { title: 'DIN EN ISO 19011:2018-10 (Leitfaden zur Auditierung von Managementsystemen)' }
        ]}
        literatur={[
          'Brunner, F. J. (2020): Qualitätsmanagement: Leitfaden für Studium und Praxis (Hanser Verlag)',
          'Wendehorst Baustoffkunde: Grundlagen, Baustoffe und Werkstoffprüfung (37. Auflage, Springer Vieweg 2024)'
        ]}
        formeln={[
          {
            formel: 'E_{\\text{Audit}} = \\frac{1}{N} \\sum_{i=1}^N \\left( \\prod_{j=1}^6 D_{i,j} \\right) = 1{,}00 \\quad (100\\,\\%)',
            erklaerung: 'Audit-Gesamterfüllungsgrad aller Arbeitspakete über alle 6 Prüfdimensionen. Erfüllung erfordert lückenlose Vollständigkeit (D3 = 1).',
            quelle: 'Qualitätsprüfung THA'
          }
        ]}
      />
    </div>
  );
}
