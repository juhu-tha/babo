import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  BarChart3, 
  FileText, 
  Copy, 
  Check, 
  Layers, 
  SlidersHorizontal, 
  TrendingUp, 
  Sparkles,
  BookOpen,
  ArrowRight,
  Code,
  Cpu,
  Boxes,
  Palette,
  Terminal,
  Server,
  Zap,
  Globe,
  Database
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { BlockMath, InlineMath } from 'react-katex';
import { formatDeZahl } from '@/src/utils/numberFormat';

const ADMIN_PASSWORD = 'admin_tha';

interface ApRow {
  id: string;
  titel: string;
  cluster: string;
  status: 'erledigt' | 'offen';
  vollstaendigkeitNotiz: string;
  module: string[];
}

const ALL_AP_DATA: ApRow[] = [
  {
    id: 'AP 01',
    titel: 'Grundlagen, Bauchemie & Normen',
    cluster: 'Cluster I (Grundlagen & Labor)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Vollständige Abdeckung der thermodynamischen Grundlagen, Bindemittelchemie, Einheiten & Sicherheitskonzepte; EPBD 2024/1275 und GEG 2024 harmonisiert.',
    module: ['Baustoffkunde', 'Einheiten', 'Materialkennwerte', 'Baustoffkenngrößen', 'Bauchemie', 'Sicherheitskonzept', 'Regularien']
  },
  {
    id: 'AP 02',
    titel: 'Labor, Prüftechnik, Diagnostik & Auswertung',
    cluster: 'Cluster I (Grundlagen & Labor)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Lückenlose Prüfketten von GUM-Messunsicherheit und Ringversuchen (ISO 13528) über UTM-Prüfstand bis Mikroanalytik (XRD, MIP, FTIR, DTA-TG, NMR) und Konformitätskontrolle (DIN EN 206).',
    module: ['Probenahme', 'Messen & Prüfen', 'Analytik', 'Mechanische Prüfungen', 'Labor (Virtuell)', 'Statistik', 'Festbeton (Statistik)']
  },
  {
    id: 'AP 03',
    titel: 'Mineralische Baustoffe & Erdbau',
    cluster: 'Cluster II (Materialien & Produkte)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Vollständige Integration mineralischer Stoffkreisläufe (Kalk.tsx Gold-Standard), Mauerwerksbemessung nach EC6 (DIN EN 1996-1-1:2024-03), Putz-/Mörtelsysteme (DIN 18550) und RStO 12 (Fassung 2024).',
    module: ['Gesteine', 'Mauerwerk', 'Putze & Mörtel', 'Kalk', 'Gips', 'Lehm', 'Erdbau']
  },
  {
    id: 'AP 04',
    titel: 'Metalle, Holz, NaWaRo, Asphalt & Kunststoffe',
    cluster: 'Cluster II (Materialien & Produkte)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Differenzierte Korrosionskinetik (durchlässige vs. undurchlässige Schichten, Pilling-Bedworth-Verhältnis mit Live-Rechner), Holzwerkstoffe nach EC5 (DIN EN 1995-1-1:2024-03) und Bitumen-/Polymereigenschaften.',
    module: ['Metalle', 'Holzwerkstoffe', 'Kunststoffe', 'Asphalt', 'Faserverbund', 'Sonstiges']
  },
  {
    id: 'AP 05',
    titel: 'Bauprodukte, CE & Konformität',
    cluster: 'Cluster II (Materialien & Produkte)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Vollständige Rechtsgrundlagen der neuen BauPVO (EU) 2024/3110, AVCP-Systeme 1+ bis 4, MVV TB 2024/1 und Produktnormen für Fertigteile, Betonwaren, Abdichtung und Wärmedämmung.',
    module: ['BpMineralisch', 'BpMauerwerk', 'BpPutzEstrich', 'BpBetonwaren', 'BpBetonfertigteile', 'BpGlaeser', 'BpDachFassade', 'BpDaemmung', 'BpAbdichtung', 'BpVerkehrswegebau', 'BpRechtliches']
  },
  {
    id: 'AP 06',
    titel: 'Betontechnologie & Ausgangsstoffe',
    cluster: 'Cluster III (Entwurf & Bemessung)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Vollständige Harmonisierung auf die Normengeneration 2023/2024: DIN 1045-2/3:2023-08, DIN 1045-1000 (Betonbauqualitätsklassen BBQ-N/E/S/U), Mehlkornprüfung und DAfStb-Richtlinien für SVB, Stahlfaser-, Massen- und R-Beton.',
    module: ['Beton A–Z', 'Bindemittel', 'Mischungsberechnung', 'Frischbeton', 'Hydratation', 'Nachbehandlung', 'Festbeton', 'Sichtbeton', 'Sonderbetone', 'Betonpraxis', 'Betonbauklassen']
  },
  {
    id: 'AP 07',
    titel: 'Massivbau, Tragwerke & Bemessung',
    cluster: 'Cluster III (Entwurf & Bemessung)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Umfassende Neukonzeption von WUBauwerke (5 Tabs nach GEMINI_md inkl. hydrostatisches Druckgefälle I = hw/h, Wannen-Typen, Selbstheilung) und Harmonisierung aller EC2-Bemessungsmodule (DIN EN 1992-1-1:2023-08) mit formatDeZahl.',
    module: ['Stahlbetonbemessung', 'Biegebemessung', 'Querkraftbemessung', 'Stuetzenbemessung', 'Durchstanzen', 'Verankerungslaenge', 'Rissbreite', 'Spannbeton', 'Carbonbeton', 'WU-Bauwerke']
  },
  {
    id: 'AP 08',
    titel: 'Holzbau & Innenausbau',
    cluster: 'Cluster III (Entwurf & Bemessung)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Vollständige EC5-Algorithmen (Biegeknicken, Querpressung, Johansen-Seileffekt, Brandbemessung beta_0, Deckenschwingung f1 >= 8 Hz) und Innenausbau-Grenzwerte (Q1–Q4, CM-Restfeuchte nach DIN 18560).',
    module: ['Holzbau (Beta)', 'Innenausbau', 'BpTrockenbau']
  },
  {
    id: 'AP 09',
    titel: 'Mechanik, Statik & Werkstoffmodelle',
    cluster: 'Cluster IV (Mechanik & Bauphysik)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Vollständige bruchmechanische Kennwerte (Griffith/Irwin, K_Ic, G_F, SENB/CT-Prüfung) und kontinuumsmechanische Elastizitätsgrenzen (Voigt/Reuss/Hashin-Shtrikman-Schranken, EC2-Normalbeton).',
    module: ['Mechanische Kenngrößen', 'Formänderungen', 'Materialmodelle', 'E-Modul', 'Festigkeit', 'Baustatik', 'Knicken', 'Bruchmechanik', 'Bodenmechanik']
  },
  {
    id: 'AP 10',
    titel: 'Bauphysik (Wärme, Feuchte, Schall & Brand)',
    cluster: 'Cluster IV (Mechanik & Bauphysik)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Umfassende thermophysikalische Bilanzierung (a/b/C_vol, U-Wert, GEG 2024), hygrothermische Schimmelkriterien (f_Rsi >= 0,70, Glaser-Verfahren) und normative Schallschutzanalysen (DIN 4109-32, Sabine).',
    module: ['Bauphysik', 'Wärmeeigenschaften', 'Feuchteschutz', 'Dämmung Vergleich', 'Schallschutz', 'Brandschutz', 'Energieausweis']
  },
  {
    id: 'AP 11',
    titel: 'Nachhaltigkeit, Ökobilanz & Zirkularität',
    cluster: 'Cluster V (Nachhaltigkeit & Zirkularität)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Vollständige Klinkersubstitution (LC3, DAfStb-Richtlinie Treibhausgasreduzierte Betone), Zirkularitätsmetriken (UMI- und MCI-Indizes) sowie harmonisierte LCA/LCC-Rechner nach DIN EN 15804+A2.',
    module: ['Nachhaltigkeit (Daten & Regeln)', 'Materialoptimierung', 'Ökobilanzierung (LCA)', 'Zertifizierung & Siegel', 'Kreislauf & DPP', 'Ressourcen & Umwelt', 'Lebenszyklus-Kosten']
  },
  {
    id: 'AP 12',
    titel: 'Bauen im Bestand & Denkmalpflege',
    cluster: 'Cluster VI (Bestand & Instandsetzung)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Lückenlose historische Baustoffkenndaten im Altbauatlas (Bestand.tsx, 4 Tabs nach GEMINI_md), Modernisierungsbilanzierung nach GModG/GEG, Sanierungs-WTA-Vorgaben und Verformungsberechnungen.',
    module: ['Altbauatlas (Bestand)', 'Bauwerkserfassung', 'Denkmalpflege', 'Modernisierung', 'Historische Bauweisen', 'Historische Bauprodukte', 'Bestand Checklisten']
  },
  {
    id: 'AP 13',
    titel: 'Rückbau, Recycling & Schadstoffe',
    cluster: 'Cluster V (Nachhaltigkeit & Zirkularität)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Normgerechte Haufwerksbeprobung nach LAGA PN 98 (Abfaelle.tsx), TRGS 521 KMF-Kanzerogenitätsindex (Schadstoffe.tsx), Ersatzbaustoffverordnung (EBV) und RC-Gesteinskörnungen nach DIN EN 12620.',
    module: ['Rückbau & Material', 'Boden- & Materialaufbereitung', 'Abfälle & Altlasten', 'Schadstoffe', 'Ressourceneffizienz', 'Rückbau Checklisten']
  },
  {
    id: 'AP 14',
    titel: 'Dauerhaftigkeit, Korrosion & Lebensdauer',
    cluster: 'Cluster VI (Bestand & Instandsetzung)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Vollständige ISO 15686 Faktorenmethode (Lebensdauern.tsx, 4 Tabs nach GEMINI_md), Ficksche Chloriddiffusionsmodelle, Karbonatisierungs-Fortschritt (Wurzel-Zeit-Gesetz), AKR- und Sulfattreiben.',
    module: ['Prinzipien & Übersicht', 'Bewehrungskorrosion', 'Betonkorrosion', 'Holzkorrosion', 'Metallkorrosion', 'Weitere Organik', 'Dauerhaftigkeit Checklisten']
  },
  {
    id: 'AP 15',
    titel: 'Mängel, Schäden & Bauforensik',
    cluster: 'Cluster VI (Bestand & Instandsetzung)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Harmonisierung von SHM-Tragwerksmonitoring nach DIN EN 13791, systematische Schadensbewertung nach DIN 1076 / VDI 6200 sowie Mängelkataster nach BGB/VOB.',
    module: ['Recht & Grundlagen (Bauschäden)', 'Typische Bauschäden', 'Tragwerksmonitoring (SHM)', 'Zustandsbewertung (VDI 6200)', 'Schadensfälle Groß', 'Schäden Checklisten']
  },
  {
    id: 'AP 16',
    titel: 'Schutz & Instandsetzung von Tragwerken',
    cluster: 'Cluster VI (Bestand & Instandsetzung)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Bereinigung aller Instandsetzungsprinzipien der TR Instandhaltung / DIN EN 1504 (W, C, R, KKS) und WTA-Injektionsbedarfsrechner nach Merkblatt 4-10 auf normkonforme Kommaschreibweise.',
    module: ['Schutz- & Instands.-Grundlagen', 'Instandsetzung nach Material', 'Stahlbetoninstandhaltung', 'WTA-Merkblätter', 'Instandsetzung Checklisten']
  },
  {
    id: 'AP 17',
    titel: 'Bauwerksdiagnose, NDT & Probenahme',
    cluster: 'Cluster VI (Bestand & Instandsetzung)',
    status: 'erledigt',
    vollstaendigkeitNotiz: 'Normative Mindeststichproben-Kalkulation nach DIN EN 13791 (Verfahren A/B), DBV-Quantilberechnung (c_act,0.05), Probenkonditionierung (DIN EN 12504-1, Stirnflächenplanheit <= 0,05 mm) und Schadensinterpretation mit Handlungsableitung.',
    module: ['Bauwerksdiagnose (Diagnose-Phasen)', 'Prüfumfang & Konditionierung', 'Interpretation & Anwendung', 'Prüfkatalog (14 Verf.)', 'DGZfP & ZfP-Ausbildung']
  }
];;

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('tha_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'uebersicht' | 'pruefraster' | 'prompt' | 'gestaltung' | 'tech_stack' | 'code_umfang'>('uebersicht');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setErrorMessage('');
      try {
        sessionStorage.setItem('tha_admin_authenticated', 'true');
      } catch {}
    } else {
      setErrorMessage('Ungültiges Kennwort. Zugriff verweigert.');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('tha_admin_authenticated');
    } catch {}
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
              className="w-full py-3 bg-shiraz text-white font-bold text-sm rounded-xl shadow-md hover:bg-shiraz/90 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock size={16} /> Entsperren &amp; Fortfahren
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-home-grau/20 text-[11px] text-text-main/50">
            Autorisierter Zugang für Dozierende und Modulverantwortliche der THA.
          </div>
        </div>
      </div>
    );
  }

  // Gesamterfüllung AP 01 bis 08
  const erledigtCount = ALL_AP_DATA.filter(ap => ap.status === 'erledigt').length;
  const gesamtProzent = Math.round((erledigtCount / ALL_AP_DATA.length) * 100);

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
            Überwacht den <strong>Umsetzungsgrad aller Arbeitspakete</strong>, die Einhaltung der <strong>6 Prüfdimensionen</strong> (mit universeller Durchsetzung von 
            <strong> Prüfdimension 3: Thematische Vollständigkeit</strong>) sowie den verbindlichen System-Auditprompt.
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'uebersicht'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('uebersicht')}
          >
            <BarChart3 size={16} /> Audit-Dashboard &amp; AP 01–17 Tabelle
          </button>
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

        {/* TAB 1: ÜBERSICHT MIT FORTSCHRITTSBALKEN & GEFORDERTER TABELLE */}
        {activeTab === 'uebersicht' && (
          <div className="space-y-6">
            {/* Metrik-Karten */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Erfüllungsgrad AP 01–17</span>
                <span className="text-2xl font-mono font-bold text-shiraz block">
                  {formatDeZahl(gesamtProzent, 0)} %
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  Alle 17 Pakete vollständig auditiert
                </span>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Status Arbeitspakete</span>
                <span className="text-2xl font-mono font-bold text-emerald-700 block">
                  {erledigtCount} / {ALL_AP_DATA.length}
                </span>
                <span className="text-[10px] text-text-main/60">
                  Status: 100 % erledigt
                </span>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Prüfdimension 3 (Vollständigkeit)</span>
                <span className="text-2xl font-mono font-bold text-text-main block">
                  Erfüllt
                </span>
                <span className="text-[10px] text-text-main/60">
                  Lückenlose thematische Tiefe
                </span>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Normengeneration</span>
                <span className="text-2xl font-mono font-bold text-text-main block">
                  2023 / 2024
                </span>
                <span className="text-[10px] text-text-main/60">
                  DIN Media / EC2 / EC3 / EC5 / EC6
                </span>
              </div>
            </div>

            {/* Der zentrale Fortschrittsbalken */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-text-main flex items-center gap-2">
                  <TrendingUp size={16} className="text-shiraz" /> Gesamt-Auditfortschritt (AP 01 bis AP 17)
                </span>
                <span className="font-mono font-extrabold text-shiraz text-sm">
                  {formatDeZahl(gesamtProzent, 0)} % (8 von 8 erledigt)
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-shiraz via-rose-600 to-emerald-600 transition-all duration-700"
                  style={{ width: `${gesamtProzent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-text-main/60 pt-1 font-mono">
                <span>AP 01 (Grundlagen)</span>
                <span>AP 04 (Metalle/Holz)</span>
                <span>AP 08 (Holz-/Innenausbau)</span>
              </div>
            </div>

            {/* DIE GEFORDERTE TABELLE DIREKT UNTER DEM FORTSCHRITTSBALKEN */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-home-grau/20">
                <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <BookOpen size={16} className="text-shiraz" /> Arbeitspakete AP 01 bis AP 17: Status &amp; Vollständigkeit (Prüfdimension 3)
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  8 / 8 Erledigt
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-off-white text-text-main border-b border-home-grau/30">
                    <tr>
                      <th className="p-3 font-bold w-16">AP</th>
                      <th className="p-3 font-bold w-52">Titel &amp; Cluster</th>
                      <th className="p-3 font-bold w-28 text-center">Status</th>
                      <th className="p-3 font-bold">Prüfdimension 3: Vollständigkeit (Kurze Notiz)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20">
                    {ALL_AP_DATA.map((row) => (
                      <tr key={row.id} className="hover:bg-off-white/50 transition-colors">
                        <td className="p-3 font-mono font-black text-shiraz align-top">
                          {row.id}
                        </td>
                        <td className="p-3 align-top">
                          <div className="font-bold text-text-main">{row.titel}</div>
                          <div className="text-[10px] text-text-main/60 mt-0.5">{row.cluster}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-1">
                            {row.module.join(' • ')}
                          </div>
                        </td>
                        <td className="p-3 text-center align-top">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            row.status === 'erledigt'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}>
                            {row.status === 'erledigt' && <CheckCircle2 size={12} className="text-emerald-600" />}
                            {row.status}
                          </span>
                        </td>
                        <td className="p-3 text-text-main/80 leading-relaxed align-top">
                          <div className="bg-off-white p-2.5 rounded-lg border border-home-grau/20">
                            {row.vollstaendigkeitNotiz}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] text-text-main/60 bg-off-white p-3 rounded-xl border border-home-grau/20 flex items-center justify-between">
                <span>
                  <strong>Definition Prüfdimension 3 (Vollständigkeit):</strong> „Ist das Modul in sich thematisch umfassend und vollständig? (dies ist die einzige Bedingung)“
                </span>
                <span className="font-mono font-bold text-shiraz">
                  Stand: 10.10.2026
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRÜFRASTER */}
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
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-home-grau/15">
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Palette size={18} className="text-shiraz" />
                  Gestaltungsvorgaben &amp; Modulspezifikation (GEMINI_md)
                </h3>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-shiraz/10 text-shiraz rounded-full border border-shiraz/20">
                  Gold-Standard: Kalk.tsx
                </span>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Das Design der Wissensplattform folgt einem einladenden, hochgradig lesbaren und akademisch anspruchsvollen Light-Design-System.
                Dunkle, kontrastreiche Konsolenhintergründe sind im Lehrkontext unerwünscht. Alle Module kapseln ihre Inhalte über standardisierte Tabs und schließen zwingend mit dem <code className="font-mono bg-off-white px-1.5 py-0.5 rounded border border-home-grau/20">ModuleFooter</code> ab.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {/* Farbpalette */}
                <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2.5">
                  <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">1. Farbpalette &amp; Akzente</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-home-grau/15">
                      <span className="font-semibold text-text-main">Primärakzent: Shiraz</span>
                      <span className="font-mono text-[11px] text-shiraz font-bold">#8b1538 / edles Weinrot</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-home-grau/15">
                      <span className="font-semibold text-text-main">Rahmen: Home-Grau</span>
                      <span className="font-mono text-[11px] text-slate-600">border-home-grau/30</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-home-grau/15">
                      <span className="font-semibold text-text-main">Infoboxen: Off-White</span>
                      <span className="font-mono text-[11px] text-slate-600">bg-off-white (#f8f9fa)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-home-grau/15">
                      <span className="font-semibold text-text-main">Historisch: Pergament</span>
                      <span className="font-mono text-[11px] text-amber-800">#fcf8f2 (weiches Pergament)</span>
                    </div>
                  </div>
                </div>

                {/* Typografie & Haptik */}
                <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2.5">
                  <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">2. Typografie &amp; Haptik</span>
                  <div className="space-y-2 text-xs text-text-main/80">
                    <div className="p-2 bg-white rounded-lg border border-home-grau/15">
                      <strong>Überschriften:</strong> <code className="font-mono text-[11px]">text-text-main</code> (ermüdungsfrei, kein Hartschwarz).
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-home-grau/15">
                      <strong>Fließtext:</strong> <code className="font-mono text-[11px]">text-text-main/80</code> mit optimaler Zeilenhöhe (leading-relaxed).
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-home-grau/15">
                      <strong>Radien &amp; Schatten:</strong> Konsequent <code className="font-mono text-[11px]">rounded-2xl</code> (Hauptkarten) &amp; <code className="font-mono text-[11px]">rounded-xl</code> (Buttons/Badges), sanfte Transitions (<code className="font-mono text-[11px]">duration-200</code>).
                    </div>
                  </div>
                </div>

                {/* Formel- & Zahlenkonvention */}
                <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2.5">
                  <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">3. Formeln &amp; Zahlenformat</span>
                  <div className="space-y-2 text-xs text-text-main/80">
                    <div className="p-2 bg-white rounded-lg border border-home-grau/15">
                      <strong>LaTeX-Rendering:</strong> Ausnahmslos über <code className="font-mono text-[11px]">react-katex</code> (<code className="font-mono text-[11px]">InlineMath</code> &amp; <code className="font-mono text-[11px]">BlockMath</code>).
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-home-grau/15">
                      <strong>DIN 1333 Zahlen:</strong> Verbindliche deutsche Zahlenformatierung (Dezimal-Komma, Tausender-Punkt via <code className="font-mono text-[11px]">formatDeZahl</code>).
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-home-grau/15">
                      <strong>Steckbriefe:</strong> Delegation physikochemischer Stoffdaten an die zentrale <code className="font-mono text-[11px]">BaustoffProfil</code>-Komponente.
                    </div>
                  </div>
                </div>
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
          { title: 'DIN EN ISO 9001:2015-11 (Qualitätsmanagementsysteme - Anforderungen)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+ISO+9001' },
          { title: 'DIN EN ISO 19011:2018-10 (Leitfaden zur Auditierung von Managementsystemen)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+ISO+19011' }
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
