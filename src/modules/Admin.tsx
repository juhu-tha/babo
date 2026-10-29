import React, { Suspense, useEffect, useState } from 'react';
import { adminLogin, adminLogout, verifyAdminSession } from '@/src/utils/adminAuth';
import { FragenFreigabe } from '@/src/components/admin/FragenFreigabe';
import { MeineModule } from '@/src/components/admin/MeineModule';
import { KurzfragebogenAuswertung } from '@/src/components/admin/KurzfragebogenAuswertung';
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
  Server,
  ClipboardCheck,
  GraduationCap,
  Truck,
  ListChecks,
  FlaskConical,
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { GUTACHTEN_27_10, notenMittel } from '@/src/data/audit/gutachten';
import { datumDe } from '@/src/data/pruefvermerke';
import { META_CLUSTERS } from '@/src/data/metaClusters';
import { formatDeZahl } from '@/src/utils/numberFormat';
import type { AuditAnsicht } from '@/src/components/admin/audit/AuditBereich';

// Audit-Bereich und erzeugte Kennzahlen (virtual:audit-daten) nur bei Bedarf laden – eigener Chunk, nicht im Admin-Chunk
const AuditBereich = React.lazy(() => import('@/src/components/admin/audit/AuditBereich'));

function AuditLaden({ ansicht }: { ansicht: AuditAnsicht }) {
  return (
    <Suspense fallback={<p className="text-xs text-text-main/70" role="status">Audit-Daten werden geladen …</p>}>
      <AuditBereich ansicht={ansicht} />
    </Suspense>
  );
}

const FULL_AUDIT_PROMPT = `================================================================================
GESAMT-AUDITPROMPT BAUSTOFFBOARD (THA) – PRÜFRASTER STAND 27.10.2026
Re-Review der Plattform nach dem Raster des Gutachtens (6 Kategorien, Zielbild „sehr gut“)
================================================================================

1. AUFTRAG
Unabhängiges Re-Review des aktuellen Stands von origin/main der Lehr- und Lernplattform
BaustoffBoard (Baustoffkunde, Werkstoffmechanik, Bauen im Bestand, Nachhaltiges Bauen) der
Technischen Hochschule Augsburg. Ergebnis: Note je Kategorie (1,0–5,0) mit Kurzbegründung,
belegt durch tatsächlich ausgeführte Prüfungen und Stichproben, sowie die Top-10-Maßnahmen
nach Wirkung. Zielbild „sehr gut“: Note 1,0–1,3 in allen sechs Kategorien.
Nur Ergebnisse berichten, die tatsächlich gelaufen sind; Abweichungen zum letzten Gutachten
(Admin → Audit → „Gutachten“) ausdrücklich nennen.

--------------------------------------------------------------------------------
2. DIE 6 KATEGORIEN DES GUTACHTENS

  [1] TECHNIK
      - Lokale Prüfungen (GitHub Actions gesperrt): npx tsc --noEmit · npm test ·
        npm run -s check:formeln · npm run -s check:zahlen ·
        node scripts/qa/check-verwaist.mjs --strict · node scripts/qa/check-any.mjs ·
        npm run -s build (inkl. Vorrendern) · node scripts/qa/check-bundle.mjs (Budget Einstieg).
      - Sicherheit: CSP (Report-Only oder scharf), keine Geheimnisse im Frontend,
        Admin-Kennwort nur serverseitig; Doku-Drift (docs/architektur.md, README).

  [2] RECHNER
      - Stichproben: Ergebnisse der Rechenkerne (src/calc) unabhängig nachrechnen.
      - Normbezug, Eingabegrenzen (plausibilitaet.ts), Grenzen-Einträge (rechnerGrenzen.ts),
        Fuzz-Tests; Werte „vorläufig, Normprüfung ausstehend“ zählen (Admin → Audit → „Prüfpunkte“).

  [3] DIDAKTIK
      - Lernziele, Kurzfassung, Selbsttest, Erkundungsaufträge „Ausprobieren“, Grenzen.
      - Quiz: Freigabestand (verified), Prüflisten je Cluster, Widersprüche Frage ↔ Modul ↔
        Rechenkern, Längenhinweis (richtige Antwort am längsten), normRef.
      - Prüfvermerke der Fachmodule (src/data/pruefvermerke.ts).

  [4] BEDIENUNG UND BARRIEREFREIHEIT
      - axe (WCAG 2.1 A/AA, zusätzlich target-size WCAG 2.2) hell, dunkel und mobil.
      - Reiter als role="tablist" (ModuleTabs, ≤ 7 je Leiste, höchstens 2 Ebenen),
        sichtbarer Fokusrahmen, Mindestgröße 24 × 24 px; manuelle BITV-Stichprobe.

  [5] RECHT
      - Impressum, Datenschutzerklärung (Speicherdauer, Auftragsverarbeiter, Speicher-Register),
        Barrierefreiheitserklärung, Lizenz und Rechteinhaberschaft, Restrisiko Normtabellen
        (Normtexte nicht abschreiben, nur öffentlich zugängliche Quellen).

  [6] PROFIL
      - Seite „Forschung und Transfer“: Projekte, Publikationen, ORCID/DOI, Labor, TTZ.

--------------------------------------------------------------------------------
3. FACHLICHE PRÜFDIMENSIONEN JE MODUL (Reiter „Die 6 Prüfdimensionen“)
  Richtigkeit und Normenstand · Didaktik · Vollständigkeit · Praxisrelevanz ·
  Konsistenz und Vernetzung · Interaktivität und Verifikation (deutsches Zahlenformat
  über formatDeZahl, Formeln mit KaTeX).

--------------------------------------------------------------------------------
4. REGELN
  - Werte nur aus öffentlich zugänglichen Quellen; ist der Normtext (NA DE) zur Bestätigung
    nötig, Wert als „vorläufig, Normprüfung ausstehend“ kennzeichnen und als offenen Prüfpunkt
    nennen (Normteil, Abschnitt/Tabelle).
  - Ergebnisse neutral formulieren (Lehr- und Vorbemessungswerkzeug).
  - Ausgabe: Notentabelle, Top-10-Maßnahmen mit Status, offene Zulieferungen.`;

type AdminTab = 'gutachten' | 'zulieferungen' | 'umsetzungsplan' | 'ffreigabe' | 'pruefliste'
  | 'pruefraster' | 'prompt' | 'gestaltung' | 'tech_stack' | 'code_umfang' | 'fragenfreigabe' | 'meine_module' | 'kurzfragebogen';

/** Reiter, deren Inhalt der lazy geladene Audit-Bereich zeigt */
const AUDIT_REITER: Partial<Record<AdminTab, AuditAnsicht>> = {
  gutachten: 'gutachten', zulieferungen: 'zulieferungen', umsetzungsplan: 'umsetzungsplan', ffreigabe: 'ffreigabe', pruefliste: 'pruefliste',
};

const ADMIN_GRUPPEN: readonly ModulTabGruppe<AdminTab>[] = [
  { id: 'audit', label: 'Audit', icon: ClipboardCheck, mitglieder: [
    { id: 'gutachten', label: 'Gutachten 27.10.', icon: GraduationCap },
    { id: 'zulieferungen', label: 'Zulieferungen', icon: Truck },
    { id: 'umsetzungsplan', label: 'Umsetzungsplan', icon: Layers },
    { id: 'ffreigabe', label: 'Prüfpunkte F-Freigabe', icon: FlaskConical },
    { id: 'pruefliste', label: 'Prüflisten', icon: ListChecks },
  ] },
  { id: 'pruefung', label: 'Prüfung & Freigabe', icon: CheckCircle2, mitglieder: [
    { id: 'pruefraster', label: 'Die 6 Prüfdimensionen', icon: CheckCircle2 },
    { id: 'prompt', label: 'Auditprompt', icon: FileText },
    { id: 'fragenfreigabe', label: 'Fragenfreigabe', icon: ShieldCheck },
  ] },
  { id: 'app', label: 'App & Code', icon: Cpu, mitglieder: [
    { id: 'gestaltung', label: 'Gestaltung der App', icon: Palette },
    { id: 'tech_stack', label: 'Sprachen & Tools', icon: Cpu },
    { id: 'code_umfang', label: 'Tool-Umfang & Code', icon: Boxes },
  ] },
  { id: 'auswertung', label: 'Module & Rückmeldungen', icon: Layers, mitglieder: [
    { id: 'meine_module', label: 'Meine Module', icon: Layers },
    { id: 'kurzfragebogen', label: 'Kurzfragebogen', icon: FileText },
  ] },
];

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
  const [activeTab, setActiveTab] = useState<AdminTab>('gutachten');
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
            Dieser Administrationsbereich enthält das Gutachten mit Maßnahmen, die Zulieferungen, den Umsetzungsplan (Phasen 0–6), die Prüfpunkte „F-Freigabe“, die Quiz-Prüflisten und den Auditprompt.
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
              Gutachten {datumDe(GUTACHTEN_27_10.datum)}: Mittel {formatDeZahl(notenMittel(), 1)} · Ziel ≤ 1,3
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
            Qualitätssicherung der Plattform BaustoffBoard (THA): <strong>Audit</strong> mit Gutachten, Zulieferungen, Umsetzungsplan,
            Prüfpunkten „F-Freigabe“ und Quiz-Prüflisten (Zählungen beim Build aus dem Quelltext erzeugt), dazu
            <strong> Prüfung &amp; Freigabe</strong> (Prüfdimensionen, Auditprompt, Fragenfreigabe), <strong>App &amp; Code</strong> und
            <strong> Module &amp; Rückmeldungen</strong>.
          </p>
        </div>

        {/* Reiter: 13 Bereiche in 4 Gruppen (AP 3.8: höchstens 7 je Zeile, 2 Ebenen) */}
        <GruppierteModuleTabs
          label="Bereiche der Administration"
          gruppen={ADMIN_GRUPPEN}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&_[role=tablist]]:mb-4"
        >
        {/* AUDIT: Gutachten, Zulieferungen, Umsetzungsplan, Prüfpunkte F-Freigabe, Prüflisten (lazy) */}
        {AUDIT_REITER[activeTab] && <AuditLaden ansicht={AUDIT_REITER[activeTab]!} />}

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
                Auditprompt nach dem Prüfraster des Gutachtens (Stand {datumDe(GUTACHTEN_27_10.datum)})
              </span>
              <button
                onClick={handleCopyPrompt}
                className="px-3 py-1.5 rounded-lg bg-shiraz text-white text-xs font-bold hover:bg-shiraz/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedPrompt ? <Check size={14} /> : <Copy size={14} />}
                {copiedPrompt ? 'Kopiert!' : 'Prompt kopieren'}
              </button>
            </div>

            <pre tabIndex={0} aria-label="Auditprompt" className="p-4 bg-off-white text-text-main border border-home-grau/30 rounded-xl text-xs font-mono overflow-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
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
                  Das Design der Wissensplattform folgt einem gut lesbaren, hellen Design-System; der Dunkelmodus (AP 2.4) setzt dieselben Farbvariablen dunkel um.
                  <strong> Schwarze Konsolenhintergründe in Inhaltsboxen sind unerwünscht</strong> – Kontraste nach WCAG 2.1 AA in beiden Modi.
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
                      Keine unendlichen Scroll-Pages. Informationen werden über die gemeinsame Reiterleiste <code className="font-mono text-[11px]">ModuleTabs</code> (role=&quot;tablist&quot;, Pfeiltasten, höchstens 7 Reiter je Zeile, sonst <code className="font-mono text-[11px]">GruppierteModuleTabs</code>) und den Zustand <code className="font-mono text-[11px]">activeTab</code> in thematische Blöcke gekapselt:
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
                  <span className="text-[11px] text-text-main/60 font-mono">Vorlage wie GEMINI.md, Abschnitt 4 (ModuleTabs, content/-JSON)</span>
                </div>
                <pre className="p-4 bg-off-white rounded-xl border border-home-grau/30 text-[11px] font-mono text-text-main overflow-x-auto leading-relaxed">
{`import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { MdText } from '@/src/components/inhalt/MdText';
import { Box, BookOpen, Layers, Calculator } from 'lucide-react';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
// Fachtexte liegen in content/<modul>/<Datei>.json (AP 5.3, docs/architektur.md „Inhalte bearbeiten“):
// texte = Markdown-Fließtext (<MdText>), werte = kurze Zeichenketten (Labels, aria-label), daten = Listen/Tabellen.
// Schlüssel nie umbenennen; neue Texte dort ergänzen oder nachträglich scripts/inhalt-auslagern.ts laufen lassen.
import inhalt from "@/content/beispielfach/Beispielfach.json";

type Reiter = 'steckbrief' | 'grundlagen' | 'praxis';

export default function Beispielfach() {
  const [activeTab, setActiveTab] = useState<Reiter>('steckbrief');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="text-shiraz" /> <MdText text={inhalt.texte.modulname} />
        </h2>

        {/* Reiter: gemeinsame Komponente (role="tablist", Pfeiltasten, ≤ 7 Reiter je Zeile;
            mehr Reiter → GruppierteModuleTabs, Muster in Abfaelle.tsx) */}
        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'steckbrief' as const, label: inhalt.werte.steckbrief, icon: BookOpen },
            { id: 'grundlagen' as const, label: inhalt.werte.grundlagen, icon: Layers },
            { id: 'praxis' as const, label: inhalt.werte.praxis, icon: Calculator },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:my-6"
        >
          {activeTab === 'steckbrief' && (
            <div className="animate-in fade-in duration-300">
              <BaustoffProfil materialKey="beispiel" />
            </div>
          )}
          {activeTab === 'grundlagen' && <MdText text={inhalt.texte.grundlagenEinleitung} />}
          {activeTab === 'praxis' && (
            /* Stufe 3: Rechnerische Vertiefung */
            <FormulaDerivationBox
              title={inhalt.werte.beispielStoffberechnung}
              zielGleichung="f_c = \\alpha \\cdot \\sigma"
              eingangsWerte={[...]}
              herleitung={inhalt.daten['Beispielfach.herleitung']}
            />
          )}
        </ModuleTabs>
      </div>

      {/* Stufe 4: Selbsttest (standardmäßig eingeklappt) */}
      <ModulTest moduleId="beispiel" />

      {/* Standardisierter Footer – Listen ebenfalls aus content/ */}
      <ModuleFooter
        wikipedia={inhalt.daten['Beispielfach.wikipedia']}
        literatur={inhalt.daten['Beispielfach.literatur']}
        regelwerke={inhalt.daten['Beispielfach.regelwerke']}
        formeln={inhalt.daten['Beispielfach.formeln']}
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
                Das BaustoffBoard ist eine Single-Page-Application mit Express-Server (server.ts), Pfad-Routing /modul/&lt;id&gt; und vorgerenderten Modulseiten.
                Der Quellcode ist durchgehend typisiert (explizite any: 0). Die Versionen unten stammen aus package.json und werden beim Build gelesen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Frontend & Sprache */}
                <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-3">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                    <Code size={16} /> Sprachen &amp; Kern-Frameworks
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">TypeScript</div>
                      <div className="text-text-main/70 text-[11px]">Vollständige Typsicherheit über alle Module, Rechner, Datenmodelle und Schnittstellen.</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">React &amp; React DOM</div>
                      <div className="text-text-main/70 text-[11px]">Funktionale Komponenten, modulare Custom Hooks, Context-State-Management und dynamisches Lazy-Loading.</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">Tailwind CSS &amp; Lucide Icons</div>
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
                      <div className="font-bold text-text-main">Vite, tsx &amp; esbuild</div>
                      <div className="text-text-main/70 text-[11px]">Entwicklungs-Server und Build; eigene Vite-Plugins (Fragenpool, Modulkopf, Registry-Auszug, Vorrendern, Audit-Daten).</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">KaTeX (react-katex)</div>
                      <div className="text-text-main/70 text-[11px]">Formelsatz im Fließtext und in Formelblöcken; wird erst bei Bedarf geladen.</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">Visualisierung &amp; 3D</div>
                      <div className="text-text-main/70 text-[11px]">Chart.js, Recharts, Three.js (@react-three/fiber &amp; drei) für interaktive Kristallgitter &amp; Prüfstands-Plots.</div>
                    </div>
                  </div>
                </div>

                {/* Server, Betrieb & Qualitätssicherung */}
                <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-3">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                    <Server size={16} /> Server &amp; Betrieb
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">Express (server.ts)</div>
                      <div className="text-text-main/70 text-[11px]">Auslieferung der vorgerenderten Seiten, Sicherheits-Header (CSP), Admin-Anmeldung serverseitig.</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">Gemini (@google/genai)</div>
                      <div className="text-text-main/70 text-[11px]">Nur serverseitig, mit Tageslimit; der Schlüssel gelangt nicht ins Frontend.</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">Betrieb</div>
                      <div className="text-text-main/70 text-[11px]">Cloud Run (Frankfurt) mit Load Balancer geplant – Anleitung docs/betrieb-cloud-run.md.</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-3">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                    <CheckCircle2 size={16} /> Qualitätssicherung
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">Tests (npm test)</div>
                      <div className="text-text-main/70 text-[11px]">tsx-Testskripte in tests/ – Rechenkerne mit Literaturfällen und Fuzz-Tests, Registry, Inhalte, Quiz.</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/15">
                      <div className="font-bold text-text-main">QA-Skripte (scripts/qa)</div>
                      <div className="text-text-main/70 text-[11px]">KaTeX-Formeln, Zahlformat, verwaiste Dateien, any, Bundle-Budget; axe und Mobil-Layout mit Playwright (lokal).</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <AuditLaden ansicht="pakete" />
          </div>
        )}

                {activeTab === 'fragenfreigabe' && <FragenFreigabe />}
        {activeTab === 'meine_module' && <MeineModule />}
        {activeTab === 'kurzfragebogen' && <KurzfragebogenAuswertung />}

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
                  Stand: aktueller Build
                </span>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Umfang der Plattform: Module, Rechenkerne, Tests, Quizfragen und Codebasis – alle Zahlen beim Build aus dem Quelltext ermittelt.
              </p>

              {/* Kennzahlen aus dem Quelltext (scripts/auditDaten.ts, beim Build erzeugt) */}
              <AuditLaden ansicht="kennzahlen" />

              <div className="grid grid-cols-1 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2.5">
                  <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Thematische Kerncluster</span>
                  {/* aus src/data/metaClusters.ts (Menügruppen je Cluster), nicht von Hand */}
                  <ul className="text-xs text-text-main/80 space-y-1.5 list-disc list-inside">
                    {META_CLUSTERS.map(c => (
                      <li key={c.number}><strong>Cluster {c.number} · {c.name}:</strong> {c.groupNames.join(', ')}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        </GruppierteModuleTabs>
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
            formel: '\\bar{N} = \\frac{1}{6} \\sum_{k=1}^{6} N_k',
            erklaerung: 'Ungewichteter Mittelwert der Noten N_k der sechs Gutachten-Kategorien (Technik, Rechner, Didaktik, Bedienung/Barrierefreiheit, Recht, Profil); Zielbild „sehr gut“: jede Note ≤ 1,3.',
            quelle: 'Gutachten 27.10.2026 (Admin → Audit)'
          }
        ]}
      />
    </div>
  );
}
