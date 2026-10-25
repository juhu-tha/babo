// Ausgelagert aus src/modules/ki/KiUeberblick.tsx (AP 5.2)
import React from 'react';
import {
  Cpu,
  Layers,
  Database,
  Search,
  CheckCircle2,
  Bot,
  FileText,
  Zap,
  Info
} from 'lucide-react';

export interface PipelineTabProps {
  pipelineStep: number;
  setPipelineStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function PipelineTab({ pipelineStep, setPipelineStep }: PipelineTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header der Pipeline */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2">
            <Database className="text-shiraz" size={20} />
            Enterprise RAG: Der 6-Stufen-Weg von Firmen-Dateien zum internen KI-Tool
          </h3>
          <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
            Datenschutz & IP-Schutz by Design
          </span>
        </div>
        <p className="text-xs text-text-main/80 leading-relaxed">
          In einem Ingenieur- oder Bauunternehmen liegen hunderttausende Seiten wertvolles Wissen verstreut: <strong>Baugrundgutachten (PDF)</strong>, <strong>Mischungsberechnungen (Excel)</strong>, <strong>Baustellenprotokolle (Word)</strong>, <strong>Leistungsverzeichnisse (GAEB)</strong> und <strong>BIM-Modelle (IFC)</strong>. Wie baut man daraus ein System, das Mitarbeitern verlässliche, sekundenschnelle Antworten mit Quellenangabe liefert, ohne dass sensible Firmendaten ins öffentliche Internet abfließen?
        </p>

        {/* Klickbare Prozesskette (Schritte 1 bis 6) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3">
          {[
            { step: 1, label: '1. Daten & Parsing', icon: FileText, sub: 'PDF, Word, Excel, GAEB' },
            { step: 2, label: '2. Chunking', icon: Layers, sub: 'Abschnitte & Metadaten' },
            { step: 3, label: '3. Embeddings', icon: Cpu, sub: 'Text in Vektoren' },
            { step: 4, label: '4. Vector DB', icon: Database, sub: 'Qdrant / pgvector' },
            { step: 5, label: '5. Retrieval & Rerank', icon: Search, sub: 'Semantische Suche' },
            { step: 6, label: '6. Firmen-Tool', icon: Bot, sub: 'Chat-UI & Rechte' }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setPipelineStep(item.step)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                pipelineStep === item.step
                  ? 'bg-shiraz text-white border-shiraz shadow-md ring-2 ring-shiraz/20'
                  : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-mono font-bold opacity-80">Stufe {item.step}</span>
                <item.icon size={15} />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight">{item.label}</div>
                <div className={`text-[10px] mt-0.5 truncate ${pipelineStep === item.step ? 'text-white/80' : 'text-text-main/60'}`}>
                  {item.sub}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detaillierte Darstellung des ausgewählten Schritts */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
        {pipelineStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                01
              </span>
              <div>
                <h4 className="text-base font-bold text-text-main">
                  Schritt 1: Datenerfassung, Bereinigung & multimodales Parsing
                </h4>
                <p className="text-xs text-text-main/60">Vom chaotischen Netzlaufwerk zu sauberem, lesbarem Text und Tabellen</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main flex items-center gap-1.5">
                  <FileText size={15} className="text-shiraz" />
                  Die bautechnische Realität:
                </h5>
                <p className="text-text-main/80 leading-relaxed">
                  Dateien im Bauwesen sind hochgradig heterogen:
                </p>
                <ul className="space-y-1 list-disc list-inside text-text-main/70">
                  <li><strong>PDFs:</strong> Baugrundgutachten mit Schichtenverzeichnissen, statische Berechnungen mit Kopfzeilen.</li>
                  <li><strong>Excel (.xlsx):</strong> Stoffraumrechnungen, Betonprüfzeugnisse, Kostenermittlungen nach DIN 276.</li>
                  <li><strong>Word (.docx):</strong> Baustellenberichte, Bautagebücher, VOB-Bedenkenhinweise.</li>
                  <li><strong>Spezialformate:</strong> GAEB (.x83, .d83) für Ausschreibungen, IFC für BIM-Attribute.</li>
                </ul>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main flex items-center gap-1.5">
                  <Zap size={15} className="text-amber-600" />
                  Die Parsing-Herausforderung & Lösung:
                </h5>
                <p className="text-text-main/80 leading-relaxed">
                  Standard-Text-Extraktoren versagen bei Tabellen (z. B. Spalten werden zu Brei vermischt). 
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-slate-700 leading-normal">
                  <strong>Werkzeuge:</strong> <code>LlamaParse</code>, <code>Unstructured.io</code> oder <code>PyMuPDF4LLM</code> wandeln PDF-Tabellen in sauberes Markdown um:
                  <pre className="text-[10px] font-mono bg-slate-50 p-2 mt-1 rounded border border-slate-200">
| Schicht | Bodenart | Reibungswinkel φ | Kohäsion c |
| 1       | Auffüllung | 27.5°           | 0 kN/m²   |
| 2       | Geschiebemergel | 32.5°      | 15 kN/m²  |
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {pipelineStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                02
              </span>
              <div>
                <h4 className="text-base font-bold text-text-main">
                  Schritt 2: Intelligentes Chunking & Metadaten-Anreicherung
                </h4>
                <p className="text-xs text-text-main/60">Zerschneiden in verdauliche Sinneinheiten mit vollständigem Steckbrief</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main flex items-center gap-1.5">
                  <Layers size={15} className="text-shiraz" />
                  Warum Chunking unverzichtbar ist:
                </h5>
                <p className="text-text-main/80 leading-relaxed">
                  Ein 80-seitiges Gutachten kann nicht als Ganzes an die Vektordatenbank übergeben werden. Die semantische Suche funktioniert nur, wenn einzelne Sinnabschnitte (typ. <strong>400–800 Tokens</strong> ≈ 1–2 Buchseiten) mit 10–15% Überlappung (Overlap) erzeugt werden. Der Overlap verhindert, dass Sätze an der Schnittkante zerrissen werden.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main flex items-center gap-1.5">
                  <Info size={15} className="text-blue-600" />
                  Der Schlüssel: Metadaten anhängen!
                </h5>
                <p className="text-text-main/80 leading-relaxed">
                  Jeder Chunk erhält unsichtbare Metadaten-Tags. Nur so kann der Chat später filtern:
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 font-mono text-[10px] text-slate-800">
                  <code>
                    {`{`}
                    <br />&nbsp;&nbsp;projekt_id: "BV-2024-Tiefgarage-Nord",
                    <br />&nbsp;&nbsp;dokument_typ: "Baugrundgutachten",
                    <br />&nbsp;&nbsp;bauwerks_teil: "Untergeschoss_2",
                    <br />&nbsp;&nbsp;gueltig_ab: "2024-03-15",
                    <br />&nbsp;&nbsp;sicherheitsstufe: "vertraulich"
                    <br />{`}`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

        {pipelineStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                03
              </span>
              <div>
                <h4 className="text-base font-bold text-text-main">
                  Schritt 3: Vektorisierung durch moderne Embedding-Modelle
                </h4>
                <p className="text-xs text-text-main/60">Übersetzung menschlicher Baubegriffe in hochdimensionale Geometrie</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-text-main/80">
              <p>
                Ein Computer kann Texte nicht wie ein Mensch "verstehen". Ein <strong>Embedding-Modell</strong> (z. B. <code>text-embedding-3-large</code> von OpenAI oder das quelloffene <code>bge-m3</code> / <code>nomic-embed-text</code> für lokalen Offline-Betrieb) liest den Text-Chunk und wandelt ihn in eine Liste von 1.536 bis 3.072 Zahlen (Vektor) um.
              </p>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-1">
                <div className="text-slate-400"># Text: "Frost-Tausalz-Angriff auf Brückenkappe mit Taumitteln"</div>
                <div className="text-emerald-400">Embedding: [0.0421, -0.1983, 0.8124, 0.0039, ..., -0.4412] (3072 Dimensionen)</div>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 text-blue-950">
                <strong>Der Clou der Semantik:</strong> Die Suchanfrage <em>"Taumittelschäden Parkhaus"</em> erhält einen mathematisch fast identischen Vektor wie der Absatz <em>"Expositionsklasse XF4 und Taumittelbeanspruchung"</em>. Die Suchmaschine findet den Absatz, obwohl völlig unterschiedliche Wörter verwendet wurden!
              </div>
            </div>
          </div>
        )}

        {pipelineStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                04
              </span>
              <div>
                <h4 className="text-base font-bold text-text-main">
                  Schritt 4: Speicherung & Indexierung in der Vektordatenbank
                </h4>
                <p className="text-xs text-text-main/60">Das Spezial-Archiv für Millionen von Datenpunkten im Firmennetzwerk</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main">Qdrant / Milvus</h5>
                <p className="text-text-main/70">
                  Hochperformante, quelloffene Vektordatenbanken. Lassen sich als Docker-Container auf dem firmeneigenen Server installieren (100% On-Premises ohne Cloud-Zwang).
                </p>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Beste Wahl für On-Prem</span>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main">PostgreSQL mit pgvector</h5>
                <p className="text-text-main/70">
                  Falls das Büro bereits eine SQL-Datenbank besitzt: <code>pgvector</code> erweitert Postgres um Vektorsuche. Spart neue Serverinfrastruktur und verbindet SQL-Tabellen direkt mit Vektoren.
                </p>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Standard für IT-Abteilungen</span>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <h5 className="font-bold text-text-main">Hybrid Search (HNSW + BM25)</h5>
                <p className="text-text-main/70">
                  Im Bauwesen unverzichtbar: Vektorsuche für Bedeutungen kombiniert mit exakter Keyword-Suche (BM25) für Normbezeichnungen (z. B. exakte Treffer bei Eingabe von <em>"DIN 18195"</em>).
                </p>
                <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">Ingenieur-Empfehlung</span>
              </div>
            </div>
          </div>
        )}

        {pipelineStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                05
              </span>
              <div>
                <h4 className="text-base font-bold text-text-main">
                  Schritt 5: Fragestellung, Vektorsuche & Re-Ranking
                </h4>
                <p className="text-xs text-text-main/60">Wie die treffendsten 3–5 Absätze aus 500.000 Seiten herausgefiltert werden</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-text-main/80">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-home-grau/30 space-y-1">
                  <span className="font-bold text-slate-800">1. Nutzer stellt Frage</span>
                  <p className="text-text-main/70">
                    "Welche Gründungsempfehlung gab der Gutachter für Bauabschnitt 2 bei bindigem Boden?"
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-home-grau/30 space-y-1">
                  <span className="font-bold text-slate-800">2. Schnelle Vektorsuche</span>
                  <p className="text-text-main/70">
                    Die Vector DB sucht per Kosinus-Ähnlichkeit die 25 ähnlichsten Chunks in Millisekunden heraus.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-home-grau/30 space-y-1">
                  <span className="font-bold text-slate-800">3. Re-Ranking (Präzisionsfilter)</span>
                  <p className="text-text-main/70">
                    Ein Cross-Encoder-Modell (z. B. <em>Cohere Rerank</em> oder <em>bge-reranker</em>) prüft die 25 Chunks detailliert und wählt die besten 3 Treffer aus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {pipelineStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                06
              </span>
              <div>
                <h4 className="text-base font-bold text-text-main">
                  Schritt 6: Generierung, Prompt-Injektion & Rollenberechtigungen
                </h4>
                <p className="text-xs text-text-main/60">Die fertige, quellenbelegte Antwort im Chatfenster oder Revit-Plugin</p>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-text-main/80">
              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2 font-mono text-[10.5px]">
                <span className="text-purple-400 block font-sans font-bold"># Was das LLM hinter den Kulissen als Prompt erhält:</span>
                <div className="text-slate-300">
                  System-Prompt: "Du bist der interne KI-Ingenieur-Assistent der Firma Bauplan GmbH. Antworte AUSSCHLIESSLICH basierend auf folgenden verifizierten Dokumentenauszügen. Nenne stets Dokumentname und Seitenzahl. Wenn die Information nicht enthalten ist, antworte ehrlich: 'Dazu liegen keine internen Projektdaten vor'."
                </div>
                <div className="text-emerald-400">
                  Kontext: [Quelle: Gutachten_BV2024_Nord.pdf, S. 24: "Für Bauabschnitt 2 wird eine Pfahlgründung mit Ortbeton-Rüttelpfählen Ø 60 cm empfohlen..."]
                </div>
                <div className="text-amber-300">
                  Frage: "Welche Gründung wurde für Bauabschnitt 2 empfohlen?"
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1.5">
                  <h5 className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 size={15} />
                    Rollen- und Rechtemanagement (RBAC):
                  </h5>
                  <p className="text-emerald-950/80">
                    Vor der Suche prüft das System die Identität des Mitarbeiters: Praktikanten und externe Nachunternehmer dürfen nur freigegebene Normen und Projektordner durchsuchen, während Geschäftsführer auch interne Honorare und Nachtragsverhandlungen abfragen können.
                  </p>
                </div>

                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1.5">
                  <h5 className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Bot size={15} />
                    Endnutzer-Schnittstellen:
                  </h5>
                  <p className="text-blue-950/80">
                    Das Tool läuft als internes Web-Chatportal (z. B. <em>OpenWebUI</em> / <em>LibreChat</em>), als Bot in Microsoft Teams oder als direktes Add-In in Autodesk Revit und Word zur automatischen Baubeschreibung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
