import React, { useState } from 'react';
import { 
  GraduationCap, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  Scale
} from 'lucide-react';
import inhalt from '@/content/ki/KiDeklarationGuide.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function KiDeklarationGuide() {
  const [studentName, setStudentName] = useState<string>(inhalt.werte.maxMustermann);
  const [matrikelNr, setMatrikelNr] = useState<string>('1234567');
  const [thesisTitle, setThesisTitle] = useState<string>(inhalt.werte.ökobilanzierungUndFestigkeitsentwicklung);
  const [degreeProgram, setDegreeProgram] = useState<string>(inhalt.werte.bauingenieurwesenBEngM);
  const [advisorName, setAdvisorName] = useState<string>(inhalt.werte.profDrIngJürgen);
  const [selectedTools, setSelectedTools] = useState<string[]>(['NotebookLM', 'DeepL', inhalt.werte.pythonCursor]);
  const [copied, setCopied] = useState<boolean>(false);

  const toggleTool = (tool: string) => {
    setSelectedTools(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const declarationText = `EIGENSTÄNDIGKEITSERKLÄRUNG & KI-DOKUMENTATION
Fakultät für Architektur und Bauwesen – Technische Hochschule Augsburg (THA) (THA)

Verfasser/in: ${studentName} (Matrikel-Nr.: ${matrikelNr})
Studiengang: ${degreeProgram}
Erstprüfer/in: ${advisorName}
Titel der Arbeit: "${thesisTitle}"

1. ERKLÄRUNG ZUR EIGENSTÄNDIGKEIT
Ich versichere hiermit wahrheitsgemäß, dass ich die vorliegende Arbeit selbstständig verfasst und keine anderen als die angegebenen Quellen und Hilfsmittel benutzt habe. Alle Ausführungen, die wörtlich oder sinngemäß übernommen wurden, sind als solche kenntlich gemacht.

2. TRANSPARENTE OFFENLEGUNG GENERATIVER KI-WERKZEUGE
Zur Unterstützung des Arbeitsprozesses wurden generative KI-Werkzeuge in folgendem Umfang eingesetzt:

Verwendete KI-Systeme: ${selectedTools.join(', ')}

Art und Zweck der Unterstützung:
a) Sprachliche Optimierung: Überprüfung von Grammatik, Satzbau und Rechtschreibung deutscher sowie englischer Textpassagen (DeepL / LLM).
b) Literatur-Recherche & Synthese: Auffinden relevanter Fachliteratur und Zusammenfassung von Open-Access-Quellen unter Verifikation der Primärquellen (z. B. NotebookLM / Elicit).
c) Code-Generierung & Datenanalyse: Erstellung und Debugging von Python-Skripten (Pandas, Matplotlib) zur graphischen Aufbereitung der im Labor ermittelten Druckversuchsdaten (Zwick/Roell).

3. INGENIEURMÄSSIGE VERANTWORTUNG & KONTROLLE
Mir ist bewusst, dass Sprachmodelle statistisch bedingte Fehler und Halluzinationen erzeugen können. Sämtliche durch KI-Systeme generierten Textvorschläge, Zitate, mathematischen Gleichungen und physikalischen Kennwerte (wie Druckfestigkeiten, w/z-Werte und Sicherheitsbeiwerte) wurden von mir eigenhändig anhand der geltenden Normen (DIN EN 206, DIN 1045-2, Eurocode 2) auf Richtigkeit und Plausibilität überprüft.

Ich trage als alleinige/r Autor/in die volle inhaltliche und wissenschaftliche Verantwortung für alle Teile der Arbeit.

Ort, Datum: Augsburg, den ${new Date().toLocaleDateString('de-DE')}

___________________________________________________
Unterschrift Verfasser/in`;

  const handleCopy = () => {
    navigator.clipboard.writeText(declarationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-home-grau/20">
        <div>
          <h4 className="font-bold text-base text-text-main flex items-center gap-2">
            <GraduationCap className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.leitfadenFormularKiDeklaration} /></h4>
          <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.dfgKonformeUndHochschulsichere} /></p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-shiraz text-white hover:bg-shiraz/90 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            {copied ? 'Kopiert!' : inhalt.werte.vorlageKopieren}
          </button>
        </div>
      </div>

      {/* Konfigurator für das Formular */}
      <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30 space-y-4">
        <h5 className="font-bold text-xs text-text-main uppercase tracking-wider text-slate-500"><MdText text={inhalt.texte.t1IndividuelleArbeitsparameterEingeben} /></h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-xxs font-bold text-text-main/70 block mb-1"><MdText text={inhalt.texte.nameDerDesStudierenden} /></label>
            <input aria-label={inhalt.werte.nameDerDesStudierenden} 
              type="text" 
              value={studentName} 
              onChange={e => setStudentName(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-home-grau/30 text-xs"
            />
          </div>
          <div>
            <label className="text-xxs font-bold text-text-main/70 block mb-1">Matrikelnummer:</label>
            <input aria-label="Matrikelnummer" 
              type="text" 
              value={matrikelNr} 
              onChange={e => setMatrikelNr(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-home-grau/30 text-xs"
            />
          </div>
          <div>
            <label className="text-xxs font-bold text-text-main/70 block mb-1">Studiengang:</label>
            <input aria-label="Studiengang" 
              type="text" 
              value={degreeProgram} 
              onChange={e => setDegreeProgram(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-home-grau/30 text-xs"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xxs font-bold text-text-main/70 block mb-1"><MdText text={inhalt.texte.themaTitelDerAbschlussarbeit} /></label>
            <input aria-label={inhalt.werte.themaTitelDerAbschlussarbeit} 
              type="text" 
              value={thesisTitle} 
              onChange={e => setThesisTitle(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-home-grau/30 text-xs"
            />
          </div>
          <div>
            <label className="text-xxs font-bold text-text-main/70 block mb-1"><MdText text={inhalt.texte.erstprüferProfessor} /></label>
            <input aria-label={inhalt.werte.erstprüferProfessor} 
              type="text" 
              value={advisorName} 
              onChange={e => setAdvisorName(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-home-grau/30 text-xs"
            />
          </div>
        </div>

        {/* Tool-Auswahl Checkboxen */}
        <div>
          <label className="text-xxs font-bold text-text-main/70 block mb-1.5"><MdText text={inhalt.texte.eingesetzteKiToolsAuswählen} /></label>
          <div className="flex flex-wrap gap-2">
            {['NotebookLM', 'ChatGPT', 'Claude', 'DeepL', inhalt.werte.elicitConsensus, inhalt.werte.pythonCursor2, inhalt.werte.lmStudioLokal].map(t => (
              <button
                key={t}
                onClick={() => toggleTool(t)}
                className={`px-3 py-1 rounded-lg text-xxs font-bold transition-all border cursor-pointer ${
                  selectedTools.includes(t)
                    ? 'bg-shiraz text-white border-shiraz shadow-xs'
                    : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                }`}
              >
                {selectedTools.includes(t) ? '✓ ' : '+ '} {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vorschau des Formulars (Druckfertig) */}
      <div className="space-y-2">
        <h5 className="font-bold text-xs text-text-main flex items-center justify-between">
          <span><MdText text={inhalt.texte.druckreifeDeklarationsvorlageAlsAnhang} /></span>
          <span className="text-xxs text-slate-400 font-mono"><MdText text={inhalt.texte.dinA4Konform} /></span>
        </h5>
        <div className="p-5 bg-white border-2 border-dashed border-slate-300 rounded-2xl">
          <pre className="text-xxs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-all">
            {declarationText}
          </pre>
        </div>
      </div>

      {/* 3 Goldene Prüfungsregeln */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
          <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
            <CheckCircle2 size={14} className="text-emerald-600" /><MdText text={inhalt.texte.t1ErlaubtGefördert} /></div>
          <p className="text-xxs text-emerald-950 leading-relaxed"><MdText text={inhalt.texte.recherchehilfeKorrekturlesenProgrammiere} /></p>
        </div>

        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
          <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
            <AlertTriangle size={14} className="text-amber-600" /><MdText text={inhalt.texte.t2Deklarationspflichtig} /></div>
          <p className="text-xxs text-amber-950 leading-relaxed"><MdText text={inhalt.texte.jedeKiGestützteTextüberarbeitung} /></p>
        </div>

        <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 space-y-1">
          <div className="font-bold text-red-900 flex items-center gap-1.5 text-xs">
            <Scale size={14} className="text-red-600" /><MdText text={inhalt.texte.t3Täuschungsversuch0Punkte} /></div>
          <p className="text-xxs text-red-950 leading-relaxed"><MdText text={inhalt.texte.vollständigesGenerierenGanzerKapitel} /></p>
        </div>
      </div>

    </div>
  );
}
