import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Scale, 
  ShieldAlert, 
  FileWarning, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  BookOpen, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Cpu, 
  FileText, 
  Flame, 
  Leaf, 
  ShieldCheck, 
  ChevronRight,
  Info,
  RefreshCw,
  Sliders,
  Database,
  GraduationCap
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import KiDeklarationGuide from '@/src/modules/ki/KiDeklarationGuide';

interface LimitationCase {
  id: string;
  category: 'norm' | 'rechnung' | 'geometrie' | 'kontext';
  title: string;
  problemDescription: string;
  kiClaim: string;
  realityCheck: string;
  normReference: string;
  preventionGuideline: string;
}

const LIMITATION_CASES: LimitationCase[] = [
  {
    id: 'case_ec2_safety',
    category: 'norm',
    title: 'Erfundene Teilsicherheitsbeiwerte im Betonbau',
    problemDescription: 'LLMs neigen dazu, Sicherheitsbeiwerte aus alten Vornormen, US-amerikanischen ACI-Codes oder frei assoziierten Zahlwerten zusammenzusetzen.',
    kiClaim: '"Für die Bemessung im Grenzzustand der Tragfähigkeit (ULS) nach DIN EN 1992-1-1 beträgt der Teilsicherheitsbeiwert für Beton γ_c = 1,35 und für Betonstahl γ_s = 1,10."',
    realityCheck: 'FALSCH und lebensgefährlich! Nach DIN EN 1992-1-1 (EC2) i. V. m. dem deutschen Nationalen Anhang (NA) gilt für die ständige und vorübergehende Bemessungssituation ausnahmslos: γ_c = 1,50 (Beton) und γ_s = 1,15 (Betonstahl). Ein Beiwert von 1,35 unterschätzt das Einsturzrisiko massiv!',
    normReference: 'DIN EN 1992-1-1:2011-01, Abs. 2.4.2.4 & NA Tabelle 2.1N',
    preventionGuideline: 'Niemals Zahlenwerte von Sicherheitsbeiwerten oder Abminderungsfaktoren (wie α_cc = 0,85 nach deutschem NA statt 1,0 nach EC2 Basisnorm) ungeprüft aus LLM-Antworten übernehmen.'
  },
  {
    id: 'case_unit_drift',
    category: 'rechnung',
    title: 'Einheiten-Konfusionsfalle (N/mm² vs. kN/cm² vs. MN/m²)',
    problemDescription: 'Große Sprachmodelle berechnen nicht deterministisch symbolisch, sondern sagen Zeichenfolgen wahrscheinlichkeitsbasiert voraus. Bei physikalischen Einheitenpotenzen treten häufig Fehler im Faktor 10, 1.000 oder 10.000 auf.',
    kiClaim: '"Bei einer Normalspannung von σ = 25 N/mm² auf eine Fläche von A = 0,15 m² beträgt die resultierende Druckkraft N = 25 × 0,15 = 3,75 kN."',
    realityCheck: 'FATALER RECHENFEHLER! 25 N/mm² = 25.000 kN/m². Multipliziert mit A = 0,15 m² ergibt sich eine Druckkraft von N = 3.750 kN (also das 1.000-fache!). Ein Bauteil, das auf 3,75 kN ausgelegt wird, versagt sofort.',
    normReference: 'Mechanische Grundgleichung: N = σ · A',
    preventionGuideline: 'Physikalische Berechnungen zwingend über symbolische Software (Python, Mathcad, Excel) oder durch LLMs erstellte, aber separat ausgeführte Skripte berechnen lassen.'
  },
  {
    id: 'case_norm_obsolete',
    category: 'norm',
    title: 'Zitieren veralteter / zurückgezogener Normen',
    problemDescription: 'Trainingsdatensätze enthalten historische Baufachbücher, alte Foreneinträge und veraltete DIN-Normen. Das LLM "weiß" ohne Retrieval nicht, welche Normausgabe heute gilt.',
    kiClaim: '"Die Abdichtung erdberührter Bauteile gegen Bodenfeuchte erfolgt gemäß DIN 18195-4."',
    realityCheck: 'VERALTET! Die DIN 18195 wurde bereits im Juli 2017 grundlegend umstrukturiert. Erdberührte Bauwerksabdichtungen werden heute verbindlich nach der Normenreihe DIN 18533 (Teile 1 bis 3) geregelt. Die alte DIN 18195 fungiert nur noch als Bezeichnungs- und Begriffsnorm.',
    normReference: 'DIN 18533-1:2017-07 (Abdichtung von erdberührten Bauteilen)',
    preventionGuideline: 'Jede zitierte Norm in der aktuellen Baunormen-Datenbank (z. B. DIN Media / Beuth, Perinorm) auf Gültigkeitsstatus und Ausgabedatum gegenprüfen.'
  },
  {
    id: 'case_context_blindness',
    category: 'kontext',
    title: 'Lost-in-the-Middle bei 120-seitigen Baugrundgutachten',
    problemDescription: 'Wird ein komplettes Baugrund- oder Schadensgutachten als PDF in ein LLM geladen, werden kritische Fußnoten oder geotechnische Sondierungsanomalien in der Mitte des Dokuments systematisch "überlesen".',
    kiClaim: '"Das Baugrundgutachten bescheinigt durchgehend gut tragfähigen Kies mit einem zulässigen Sohlwiderstand von σ_zul = 350 kN/m²."',
    realityCheck: 'GEFÄHRLICHE AUSLASSUNG! Auf Seite 67, Absatz 4.3.2 stand im Kleingedruckten: "Im Bereich der Aufschlüsse BK 3 und BK 4 wurde in 2,5 m Tiefe eine organische Schluff- und Torflinse (Mächtigkeit 1,2 m) angetroffen, die zwingend einen Bodenaustausch erfordert."',
    normReference: 'DIN 4020 / DIN EN 1997-2 (Geotechnische Untersuchungen)',
    preventionGuideline: 'Dokumente in logische Abschnitte zerlegen, gezieltes RAG (Retrieval Augmented Generation) mit genauer Quellenfundstelle einfordern und Gutachten-Fazite immer manuell lesen.'
  }
];

export default function FehlerRechtEthik() {
  const [activeSubTab, setActiveSubTab] = useState<'grenzen' | 'haftung' | 'datenschutz' | 'ethik' | 'simulator' | 'deklaration'>('grenzen');
  const [selectedCase, setSelectedCase] = useState<string>('case_ec2_safety');
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  // Risk Calculator State
  const [useCaseType, setUseCaseType] = useState<'vorbemessung' | 'ausfuehrung' | 'text' | 'recherche'>('ausfuehrung');
  const [dataConfidentiality, setDataConfidentiality] = useState<'oeffentlich' | 'intern' | 'geheim'>('geheim');
  const [humanReviewLevel, setHumanReviewLevel] = useState<'keine' | 'stichprobe' | 'vollpruefung'>('stichprobe');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 2500);
  };

  const getRiskScore = () => {
    let score = 0;
    if (useCaseType === 'ausfuehrung') score += 40;
    if (useCaseType === 'vorbemessung') score += 25;
    if (useCaseType === 'recherche') score += 10;
    if (useCaseType === 'text') score += 5;

    if (dataConfidentiality === 'geheim') score += 35;
    if (dataConfidentiality === 'intern') score += 20;
    if (dataConfidentiality === 'oeffentlich') score += 0;

    if (humanReviewLevel === 'keine') score += 35;
    if (humanReviewLevel === 'stichprobe') score += 15;
    if (humanReviewLevel === 'vollpruefung') score -= 20;

    return Math.max(5, Math.min(100, score));
  };

  const riskScore = getRiskScore();
  const currentCase = LIMITATION_CASES.find(c => c.id === selectedCase) || LIMITATION_CASES[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER INFO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <ShieldAlert className="text-shiraz" /> Fehler, Anwendungsgrenzen, Recht &amp; Ethik
            </h3>
            <p className="text-xs text-text-main/70 mt-1">
              Verantwortungsvolle Ingenieurpraxis: Vermeidung von Halluzinationen, BGB-Werkvertragsrecht, Urheberrecht, DSGVO und EU AI Act im Bauwesen.
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-xxs font-extrabold uppercase rounded-full tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={13} className="text-red-600" /> Kritische Sicherheitszone
          </span>
        </div>

        {/* SUB-TABS */}
        <div className="flex flex-wrap gap-2 pt-5 border-b border-home-grau/20 mt-2">
          <button
            onClick={() => setActiveSubTab('grenzen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'grenzen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <FileWarning size={14} /> 1. Technische Grenzen &amp; Halluzinationen
          </button>
          <button
            onClick={() => setActiveSubTab('haftung')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'haftung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Scale size={14} /> 2. BGB-Haftung &amp; EU AI Act
          </button>
          <button
            onClick={() => setActiveSubTab('datenschutz')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'datenschutz'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Lock size={14} /> 3. Datenschutz &amp; Geschäftsgeheimnis
          </button>
          <button
            onClick={() => setActiveSubTab('ethik')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'ethik'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Leaf size={14} /> 4. Ethik, Ökologie &amp; Bias
          </button>
          <button
            onClick={() => setActiveSubTab('simulator')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'simulator'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Sliders size={14} /> 5. Interaktiver Risiko-Check
          </button>
          <button
            onClick={() => setActiveSubTab('deklaration')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeSubTab === 'deklaration'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <GraduationCap size={14} /> 6. KI-Deklaration &amp; Thesen
          </button>
        </div>
      </div>

      {/* TAB 1: FEHLER & ANWENDUNGSGRENZEN */}
      {activeSubTab === 'grenzen' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-700 w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs text-amber-900 leading-relaxed">
                <h4 className="font-bold text-sm text-amber-950">Die Grundfalle: Statistische Wahrscheinlichkeit ist kein physikalischer Beweis</h4>
                <p>
                  Große Sprachmodelle (LLMs wie ChatGPT, Claude, Gemini) besitzen kein inhärentes Verständnis von Statik, Baustoffmechanik oder Schwerkraft. Sie generieren Tokens (Wort- und Zahlenbausteine) ausschließlich nach <strong>statistischer Plausibilität</strong>. Eine falsche Gleichung, die wie eine Normenformel aussieht, wird mit derselben sprachlichen Überzeugungskraft ausgegeben wie ein physikalisches Naturgesetz.
                </p>
              </div>
            </div>
          </div>

          {/* INTERAKTIVER FALLVERGLEICH */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/20">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <FileWarning className="text-shiraz w-4 h-4" /> Realitäts-Check: Konkrete Bauingenieur-Fehler der KI
              </h4>
              <span className="text-xxs text-text-main/60">Wählen Sie einen Praxisfall:</span>
            </div>

            {/* Fall-Auswahl */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {LIMITATION_CASES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCase(c.id)}
                  className={`p-3 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                    selectedCase === c.id
                      ? 'bg-shiraz/10 text-shiraz border-shiraz font-bold shadow-xs'
                      : 'bg-off-white text-text-main/80 border-home-grau/20 hover:border-shiraz/40'
                  }`}
                >
                  <div className="text-xxs uppercase tracking-wider text-text-main/50 mb-1">
                    {c.category === 'norm' && 'Normungs-Falle'}
                    {c.category === 'rechnung' && 'Einheiten-Falle'}
                    {c.category === 'kontext' && 'Kontext-Falle'}
                    {c.category === 'geometrie' && 'Geometrie-Falle'}
                  </div>
                  <div className="line-clamp-2 leading-snug">{c.title}</div>
                </button>
              ))}
            </div>

            {/* Fall-Detailansicht */}
            <div className="p-5 bg-off-white rounded-2xl border border-home-grau/30 space-y-4">
              <div>
                <h5 className="font-bold text-sm text-text-main">{currentCase.title}</h5>
                <p className="text-xs text-text-main/70 mt-1">{currentCase.problemDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* KI Behauptung */}
                <div className="p-4 bg-red-50/70 rounded-xl border border-red-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-red-800 font-bold text-xs uppercase tracking-wider">
                    <XCircle size={14} className="text-red-600" /> Was die KI behauptete (Halluzination)
                  </div>
                  <div className="text-xs text-red-950 font-mono bg-white/80 p-3 rounded-lg border border-red-200 leading-relaxed italic">
                    {currentCase.kiClaim}
                  </div>
                </div>

                {/* Realitäts-Check */}
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Was die Norm/Physik vorschreibt (Realität)
                  </div>
                  <div className="text-xs text-emerald-950 bg-white/80 p-3 rounded-lg border border-emerald-200 leading-relaxed">
                    {currentCase.realityCheck}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-text-main block mb-0.5">Fundstelle &amp; Normenbezug:</span>
                  <span className="text-text-main/70 font-mono text-xxs">{currentCase.normReference}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-shiraz block mb-0.5">Präventions-Regel:</span>
                  <span className="text-text-main/80 text-xxs">{currentCase.preventionGuideline}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ÜBERSICHT DER 5 FATALEN ANWENDUNGSGRENZEN */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h5 className="font-bold text-xs text-text-main">Keine Rechensicherheit bei Gleitkommazahlen</h5>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                Sprachmodelle verwechseln Potenzen und Einheiten (z. B. Umrechnung von <InlineMath math="\text{MN/m}^2" /> in <InlineMath math="\text{kN/cm}^2" />). <strong>Regel:</strong> Berechnungen immer in Python-Code oder Formelblättern ausführen, niemals im Chat-Fließtext.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h5 className="font-bold text-xs text-text-main">Kein räumliches 3D-Vorstellungsvermögen</h5>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                LLMs können Bewehrungsführungen, Verankerungslängen bei räumlichen Knoten oder Kollisionen von Leitungen im BIM-Modell nicht zuverlässig durch reinen Text beurteilen. Die geometrische Integrität muss immer im CAD visualisiert werden.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h5 className="font-bold text-xs text-text-main">Stichtags-Blindheit (Cut-off Date)</h5>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                Modelle kennen baurechtliche Novellierungen (z. B. neue Landesbauordnungen, GEG-Aktualisierungen oder Ersatzbaustoffverordnung EBV) erst nach dem Nachtrainieren. Ohne RAG (Sucherweiterung) werden veraltete Vorschriften zitiert.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h5 className="font-bold text-xs text-text-main">Bestätigungs-Verzerrung (Sycophancy)</h5>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                Fragt ein Ingenieur: <em>"Reicht ein C20/25 für eine frostbeanspruchte Tiefgaragenrampe XF4?"</em>, neigt das Modell dazu, dem Nutzer zuzustimmen, statt ihn vor dem massiven Bauschaden zu warnen. <strong>Gegenmittel:</strong> Immer neutral und ergebnisoffen prompten!
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                05
              </div>
              <h5 className="font-bold text-xs text-text-main">Pseudowissenschaftliche Quellenangaben</h5>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                Sprachmodelle erfinden bei Bedarf Autorennamen, Zeitschriftentitel, Bandnummern und DOIs, die täuschend echt klingen. Jede zitierte Quelle muss in CrossRef, Google Scholar oder Zotero auf physische Existenz geprüft werden.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                06
              </div>
              <h5 className="font-bold text-xs text-text-main">Keine Intuition für Versagensmechanismen</h5>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                Ein erfahrener Tragwerksplaner "sieht", wenn eine Verformung unplausibel ist oder ein Sprödbruch droht. Der KI fehlt die haptische Erfahrung von Prüfkörpern im Druckversuch. Die Plausibilitätsprüfung bleibt unersetzbar menschlich.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BGB-HAFTUNG & EU AI ACT */}
      {activeSubTab === 'haftung' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* BGB & HOAI HAFTUNG */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-home-grau/20">
                <Scale className="text-shiraz w-5 h-5" />
                <h4 className="font-bold text-sm text-text-main">BGB-Werkvertragsrecht &amp; HOAI-Sorgfaltspflichten</h4>
              </div>

              <div className="space-y-3 text-xs text-text-main/80 leading-relaxed">
                <p>
                  Im deutschen Zivilrecht gilt ein unumstößlicher Grundsatz: <strong>Der Planer schuldet den Werkerfolg (§ 631 BGB)</strong>.
                </p>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                  <h5 className="font-bold text-xs text-text-main">1. Keine Exkulpation durch Software oder KI</h5>
                  <p className="text-xxs text-text-main/70 leading-relaxed">
                    Der Bundesgerichtshof (BGH) hat in ständiger Rechtsprechung klargestellt: Verlässt sich der Architekt oder Tragwerksplaner blind auf Computerberechnungen oder Softwareprogramme (wie FE-Software oder KI), entlastet ihn das im Schadensfall zu 0 %. Fehler der Software werden ihm als <strong>eigenes Verschulden</strong> zugerechnet.
                  </p>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                  <h5 className="font-bold text-xs text-text-main">2. Verstoß gegen die anerkannten Regeln der Technik (a.R.d.T.)</h5>
                  <p className="text-xxs text-text-main/70 leading-relaxed">
                    Wird ein Bauwerk basierend auf einer fehlerhaften KI-Statik mangelhaft errichtet, liegt ein Sachmangel nach § 633 BGB vor. Der Bauherr hat Anspruch auf Nacherfüllung, Minderung oder Schadensersatz – im schlimmsten Fall bis zur Bausumme.
                  </p>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                  <h5 className="font-bold text-xs text-text-main">3. Berufshaftpflichtversicherung in Gefahr</h5>
                  <p className="text-xxs text-text-main/70 leading-relaxed">
                    Übernimmt ein Ingenieur ungeprüft KI-Ergebnisse ohne ingenieurmäßige Plausibilitätskontrolle, werten Versicherer dies als <strong>grobe Fahrlässigkeit</strong>. Die Berufshaftpflichtversicherung kann Regressansprüche geltend machen oder die Deckung verweigern.
                  </p>
                </div>
              </div>
            </div>

            {/* EU AI ACT IM BAUWESEN */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-home-grau/20">
                <ShieldCheck className="text-shiraz w-5 h-5" />
                <h4 className="font-bold text-sm text-text-main">Der EU AI Act (Verordnung (EU) 2024/1689)</h4>
              </div>

              <div className="space-y-3 text-xs text-text-main/80 leading-relaxed">
                <p>
                  Die am 1. August 2024 in Kraft getretene europäische KI-Verordnung stuft KI-Systeme in vier Risikoklassen ein. Für das Bauwesen ergeben sich gravierende Pflichten:
                </p>

                <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-red-900">Hochrisiko-KI-Systeme (High-Risk)</span>
                    <span className="text-xxs px-2 py-0.5 bg-red-200 text-red-800 rounded-md font-bold">Anhang III</span>
                  </div>
                  <p className="text-xxs text-red-950/80 leading-relaxed">
                    KI-Systeme, die als <strong>Sicherheitsbauteile für kritische Infrastrukturen</strong> eingesetzt werden (z. B. autonome Risserkennung an Brücken, Betrieb kritischer Infrastruktur (z. B. Überwachung und Steuerung von Straßentunneln), Tunnelüberwachung), fallen unter strenge Konformitätsbewertungsverfahren, Risikomanagement- und CE-Kennzeichnungspflichten.
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-900">Transparenzpflichten (Art. 50)</span>
                    <span className="text-xxs px-2 py-0.5 bg-amber-200 text-amber-800 rounded-md font-bold">Verbindlich</span>
                  </div>
                  <p className="text-xxs text-amber-950/80 leading-relaxed">
                    Nutzer müssen transparent darüber informiert werden, wenn Inhalte (Pläne, Gutachten, Textdokumente) von KI generiert oder wesentlich modifiziert wurden. In wissenschaftlichen Arbeiten (Bachelor/Master) ist dies Prüfungsbestandteil.
                  </p>
                </div>

                <div className="p-3.5 bg-off-white border border-home-grau/20 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-text-main">Menschliche Aufsicht (Human-in-the-Loop)</span>
                    <span className="text-xxs px-2 py-0.5 bg-slate-200 text-slate-800 rounded-md font-bold">Art. 14</span>
                  </div>
                  <p className="text-xxs text-text-main/70 leading-relaxed">
                    Ein Bauingenieur muss technisch in der Lage sein, die Ausgaben des KI-Systems zu verstehen, kritisch zu bewerten und jederzeit eigenständig zu überstimmen oder abzuschalten. Eine vollübertragene automatische Freigabe von Bauanträgen ist gesetzwidrig.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* VORLAGE: HAFTUNGS-AUSSCHLUSS IN GUTACHTEN */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-home-grau/20">
              <h5 className="font-bold text-xs text-text-main flex items-center gap-2">
                <FileText className="text-shiraz w-4 h-4" /> Musterklausel: Transparenzhinweis für Planungsbüros
              </h5>
              <button
                onClick={() => handleCopy(`Hinweis zum Einsatz computergestützter KI-Systeme:
Die in diesem Bericht/Gutachten enthaltenen Vorrecherchen und Textentwürfe wurden teilweise unter Heranziehung von Softwarewerkzeugen mit künstlicher Intelligenz erarbeitet. Sämtliche ingenieurtechnische Berechnungen, Normprüfungen nach DIN/Eurocode und gutachterliche Schlussfolgerungen wurden durch den unterzeichnenden Ingenieur persönlich plausibilisiert, fachtechnisch verifiziert und eigenverantwortlich freigegeben.`, 'klausel')}
                className={`px-3 py-1.5 rounded-xl text-xxs font-bold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                  copiedTextId === 'klausel'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz'
                }`}
              >
                {copiedTextId === 'klausel' ? (
                  <>
                    <CheckCircle2 size={13} className="text-white" /> Kopiert!
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Klausel kopieren
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-xxs text-text-main/80 font-serif italic leading-relaxed">
              "Die in diesem Bericht enthaltenen Vorrecherchen wurden teilweise unter Heranziehung von Softwarewerkzeugen mit künstlicher Intelligenz erarbeitet. Sämtliche ingenieurtechnische Berechnungen, Normprüfungen nach DIN/Eurocode und gutachterliche Schlussfolgerungen wurden durch den unterzeichnenden Ingenieur persönlich plausibilisiert, fachtechnisch verifiziert und eigenverantwortlich freigegeben."
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATENSCHUTZ & GESCHÄFTSGEHEIMNIS */}
      {activeSubTab === 'datenschutz' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                <Lock size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main">1. DSGVO &amp; Personenbezogene Daten</h4>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                Bauherrennamen, Adressen, Grundbuchauszüge oder private Grundrisse von Einfamilienhäusern sind personenbezogene Daten nach Art. 4 DSGVO.
              </p>
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-150 text-xxs text-red-900 leading-snug">
                <strong>Verstoß:</strong> Wer Pläne mit Namen der Bauherren in ungesicherte Public-Cloud-LLMs hochlädt, begeht einen meldepflichtigen Datenschutzverstoß (Art. 33 DSGVO). Bußgelder bis zu 20 Mio. € drohen.
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShieldAlert size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main">2. Betriebsgeheimnisse (§ 2 GeschGehG)</h4>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                Eigene UHPC-Mischungsrezepturen, geheime Zusatzmittelkombinationen, firmeninterne Einheitspreise und Kalkulationszuschläge sind geschützte Geschäftsgeheimnisse.
              </p>
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-150 text-xxs text-amber-900 leading-snug">
                <strong>Gefahr:</strong> Werden Daten in Standard-Accounts von Cloud-Tools eingegeben, können diese zum Nachtrainieren verwendet werden. Mitbewerber könnten die Rezeptur über Chat-Prompts abfragen!
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <h4 className="font-bold text-xs text-text-main">3. Urheberrecht an KI-Ergebnissen</h4>
              <p className="text-xxs text-text-main/70 leading-relaxed">
                Nach deutschem Urheberrecht (§ 2 Abs. 2 UrhG) sind nur <em>persönliche geistige Schöpfungen eines Menschen</em> urheberrechtlich geschützt.
              </p>
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-150 text-xxs text-blue-900 leading-snug">
                <strong>Rechtsfolge:</strong> Rein von einer KI generierte CAD-Skizzen, Texte oder Statik-Reports genießen keinen Urheberrechtsschutz. Sie sind gemeinfrei und können von Mitbewerbern legal kopiert werden.
              </div>
            </div>

          </div>

          {/* DATENSCHUTZ-CHECKLISTE FÜR INGENIEURBÜROS */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <ShieldCheck className="text-shiraz w-4 h-4" /> Datenschutz-Checkliste für den Büroalltag
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-main block">Training Opt-Out aktivieren:</strong>
                  <span className="text-text-main/70 text-xxs">
                    In den Einstellungen von ChatGPT ("Data Controls &gt; Improve the model for everyone: OFF") oder Claude / API-Nutzung sicherstellen, dass Kundenprojekte nicht für das Modelltraining verwendet werden.
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-main block">Anonymisierung vor Upload:</strong>
                  <span className="text-text-main/70 text-xxs">
                    In Leistungsverzeichnissen und Baugrundberichten Flurstücksnummern, Kundennamen, Bauherrenanschriften und Firmenlogos vor dem Upload mit PDF-Schwärzungstools unkenntlich machen.
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-main block">Enterprise- oder Team-Verträge mit DPA (AVV):</strong>
                  <span className="text-text-main/70 text-xxs">
                    Niemals kostenfreie Privat-Accounts für vertrauliche Mandantendaten nutzen. Bei Cloud-Nutzung zwingend einen Auftragsverarbeitungsvertrag (Data Processing Agreement) nach Art. 28 DSGVO mit dem Anbieter abschließen.
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-main block">Lokale LLMs als Goldstandard:</strong>
                  <span className="text-text-main/70 text-xxs">
                    Für streng vertrauliche Großprojekte, Sabotage-relevante Bauten (KRITIS) oder patentierte Baustoffentwicklungen ausschließlich lokale Modelle (via LM Studio / Ollama) auf büroeigener Hardware betreiben.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ETHIK, ÖKOLOGIE & BIAS */}
      {activeSubTab === 'ethik' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* ÖKOLOGISCHER FUSSABDRUCK */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-home-grau/20">
                <Leaf className="text-emerald-700 w-5 h-5" />
                <h4 className="font-bold text-sm text-text-main">Ökobilanz von KI vs. Baustoff-Einsparung</h4>
              </div>

              <div className="space-y-3 text-xs text-text-main/80 leading-relaxed">
                <p>
                  Im Zeitalter des nachhaltigen Bauens muss der Energie- und Ressourcenhunger von KI-Rechenzentren kritisch mit dem bautechnischen Nutzen abgewogen werden:
                </p>

                <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-150 space-y-1">
                  <div className="font-bold text-xs text-red-950 flex items-center gap-1.5">
                    <Flame size={14} className="text-red-600" /> Ressourcenverbrauch von Cloud-LLMs
                  </div>
                  <p className="text-xxs text-red-900/80 leading-relaxed">
                    Eine einzige komplexe Frontier-Reasoning-Anfrage (z. B. o4-mini, Claude 5 Extended Thinking oder Gemini 3.8 Flash Thinking) verbraucht schätzungsweise das 10- bis 30-fache an elektrischer Energie im Vergleich zu einer Standard-Suche, zuzüglich Hunderten Millilitern Kühlwasser in Hyperscale-Rechenzentren. Unüberlegtes "Dauerspammen" von Prompts hat messbare CO₂-Folgen.
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-150 space-y-1">
                  <div className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                    <Leaf size={14} className="text-emerald-600" /> Der positive Hebel: KI-Baustoffoptimierung
                  </div>
                  <p className="text-xxs text-emerald-900/80 leading-relaxed">
                    Wenn KI eingesetzt wird, um die Klinker-Ersatzstoffe (calcined clays, Hochofenschlacke) in einer Betonrezeptur zu maximieren oder durch Topologieoptimierung 30 % Betonvolumen in einer Decke einzusparen, spart das Gigawattstunden an grauer Energie ein. Der Netto-Nutzen im Bauwesen ist gigantisch – sofern KI zielgerichtet eingesetzt wird.
                  </p>
                </div>
              </div>
            </div>

            {/* KULTURELLER & NORMATIVER BIAS */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-home-grau/20">
                <Cpu className="text-shiraz w-5 h-5" />
                <h4 className="font-bold text-sm text-text-main">Normativer Bias &amp; Anglo-Amerikanische Dominanz</h4>
              </div>

              <div className="space-y-3 text-xs text-text-main/80 leading-relaxed">
                <p>
                  Fast alle führenden Frontier-Modelle wurden überwiegend auf englischsprachigen Internetquellen trainiert:
                </p>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5">
                  <strong className="text-text-main block">1. ACI / ASTM statt DIN EN / Eurocode:</strong>
                  <p className="text-xxs text-text-main/70 leading-relaxed">
                    Modelle schlagen standardmäßig US-Konzepte vor (z. B. psi statt MPa, US-Bewehrungsnummern #4 statt Ø12, oder ACI 318 Nachweise), wenn im Prompt nicht explizit "gemäß DIN EN 1992-1-1 und deutschem Nationalen Anhang" gefordert wird.
                  </p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5">
                  <strong className="text-text-main block">2. Verantwortungsdiffusion auf der Baustelle:</strong>
                  <p className="text-xxs text-text-main/70 leading-relaxed">
                    "Die KI hat gesagt, das hält!" – Drohende Entmündigung junger Bauleiter. Wenn Berechnungen als unfehlbare "Black Box" wahrgenommen werden, schwindet das Gespür für Baurisiken und handwerkliche Fehler.
                  </p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5">
                  <strong className="text-text-main block">3. Urheberrechtliche Ausbeutung von Fachliteratur:</strong>
                  <p className="text-xxs text-text-main/70 leading-relaxed">
                    Modelle basieren auf teuren Fachbüchern (Wendehorst, Schneider Bautabellen), ohne dass Autoren oder Verlage angemessen vergütet werden. Als Studierende und Ingenieure bleibt der Kauf und das Studium von Originalnormen Pflicht.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: INTERAKTIVER RISIKO-RECHNER */}
      {activeSubTab === 'simulator' && (
        <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/20">
            <div>
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Sliders className="text-shiraz w-4 h-4" /> Interaktiver Haftungs- &amp; Risiko-Check
              </h4>
              <p className="text-xxs text-text-main/70 mt-0.5">
                Konfigurieren Sie Ihr geplantes Vorhaben und ermitteln Sie sofort den rechtlichen Gefährdungsgrad sowie empfohlene Schutzmaßnahmen.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xxs text-text-main/60">Risiko-Index:</span>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                riskScore > 65
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : riskScore > 35
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {riskScore} / 100 ({riskScore > 65 ? 'HOCH' : riskScore > 35 ? 'MITTEL' : 'GERING'})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Faktor 1: Anwendungsart */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
              <label className="text-xs font-bold text-text-main block">1. Anwendungsbereich im Bauprojekt</label>
              <div className="space-y-1.5">
                {[
                  { id: 'ausfuehrung', label: 'Ausführungsstatik / Bewehrung', desc: 'Sicherheitsrelevant für Leib und Leben' },
                  { id: 'vorbemessung', label: 'Vorbemessung / Grobkalkulation', desc: 'Wirtschaftliches Risiko bei Fehlern' },
                  { id: 'recherche', label: 'Literatur- & Normrecherche', desc: 'Wissenssuche & Ideenfindung' },
                  { id: 'text', label: 'Textformatierung / Rechtschreibung', desc: 'Reine Sprache ohne Fachgehalt' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setUseCaseType(item.id as any)}
                    className={`w-full p-2.5 rounded-lg text-left text-xxs transition-all border cursor-pointer ${
                      useCaseType === item.id
                        ? 'bg-shiraz text-white border-shiraz font-bold'
                        : 'bg-white text-text-main border-home-grau/20 hover:border-shiraz/40'
                    }`}
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className={useCaseType === item.id ? 'text-white/80' : 'text-text-main/60'}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Faktor 2: Datenvertraulichkeit */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
              <label className="text-xs font-bold text-text-main block">2. Vertraulichkeit der Eingabedaten</label>
              <div className="space-y-1.5">
                {[
                  { id: 'geheim', label: 'Streng geheim / Mandantendaten', desc: 'Bauherren-Namen, Grundrisse, Kosten, Mischrezepturen' },
                  { id: 'intern', label: 'Bürointern ohne Personenbezug', desc: 'Allgemeine Planungsunterlagen ohne Klarnamen' },
                  { id: 'oeffentlich', label: 'Öffentliche Forschungsdaten', desc: 'Frei publizierte Papers, Vorlesungsfolien' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDataConfidentiality(item.id as any)}
                    className={`w-full p-2.5 rounded-lg text-left text-xxs transition-all border cursor-pointer ${
                      dataConfidentiality === item.id
                        ? 'bg-shiraz text-white border-shiraz font-bold'
                        : 'bg-white text-text-main border-home-grau/20 hover:border-shiraz/40'
                    }`}
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className={dataConfidentiality === item.id ? 'text-white/80' : 'text-text-main/60'}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Faktor 3: Menschliche Kontrolle */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
              <label className="text-xs font-bold text-text-main block">3. Ingenieurmäßige Prüfung (Human-in-the-Loop)</label>
              <div className="space-y-1.5">
                {[
                  { id: 'vollpruefung', label: '100% Zeile-für-Zeile Vollprüfung', desc: 'Nachrechnung mit Taschenrechner/Statiksoftware' },
                  { id: 'stichprobe', label: 'Plausibilitäts-Stichprobe', desc: 'Schneller Blick auf Größenordnungen' },
                  { id: 'keine', label: 'Keine manuelle Nachprüfung', desc: 'Direkte Übernahme in den Plan / Bericht' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setHumanReviewLevel(item.id as any)}
                    className={`w-full p-2.5 rounded-lg text-left text-xxs transition-all border cursor-pointer ${
                      humanReviewLevel === item.id
                        ? 'bg-shiraz text-white border-shiraz font-bold'
                        : 'bg-white text-text-main border-home-grau/20 hover:border-shiraz/40'
                    }`}
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className={humanReviewLevel === item.id ? 'text-white/80' : 'text-text-main/60'}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ERGEBNIS-EMPFOHLENE MASSNAHMEN */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            riskScore > 65
              ? 'bg-red-50/80 border-red-200 text-red-950'
              : riskScore > 35
              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
              : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          }`}>
            <h5 className="font-bold text-xs mb-1 flex items-center gap-1.5">
              {riskScore > 65 ? (
                <>
                  <XCircle className="text-red-600" size={16} /> AKUTES HAFTUNGS- UND COMPLIANCE-RISIKO
                </>
              ) : riskScore > 35 ? (
                <>
                  <AlertTriangle className="text-amber-600" size={16} /> ERHÖHTE AUFMERKSAMKEIT &amp; PRÜFPFLICHT ERFORDERLICH
                </>
              ) : (
                <>
                  <CheckCircle2 className="text-emerald-600" size={16} /> UNKRITISCHER, KONFORMER EINSATZBEREICH
                </>
              )}
            </h5>
            <p className="text-xxs">
              {riskScore > 65 && 'Der Einsatz von Cloud-LLMs in diesem Modus birgt massive rechtliche und sicherheitsrelevante Gefahren. Empfehlung: Sofortige Umstellung auf ein lokales LLM (LM Studio), vollständige Schwärzung aller Klarnamen und zwingende 100%-Vollprüfung aller Berechnungen durch einen bauvorlageberechtigten Ingenieur!'}
              {riskScore > 35 && riskScore <= 65 && 'Dieser Einsatz ist zulässig, erfordert jedoch klare bürointerne Schutzmaßnahmen: Training-Opt-Out in der KI-Plattform aktivieren, Mandantendaten anonymisieren und alle Normen- und Tabellenwerte manuell im Originalregelwerk gegenprüfen.'}
              {riskScore <= 35 && 'Sehr gutes Risikoprofil. Der KI-Einsatz dient als reine Assistenz für sprachliche oder explorative Aufgaben. Die persönliche Schöpfung und ingenieurmäßige Fachkontrolle bleiben gewahrt.'}
            </p>
          </div>

        </div>
      )}

      {/* TAB 6: KI-DEKLARATION & LEHRVERANSTALTUNGEN */}
      {activeSubTab === 'deklaration' && (
        <div className="space-y-6">
          <KiDeklarationGuide />
        </div>
      )}

    </div>
  );
}
