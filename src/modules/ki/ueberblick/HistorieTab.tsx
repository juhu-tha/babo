// Ausgelagert aus src/modules/ki/KiUeberblick.tsx (AP 5.2)
import { Clock } from 'lucide-react';

export default function HistorieTab() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Clock className="text-shiraz" size={20} />
          Die Evolution der Bau-Informatik: Von Lochkarten zu KI-Agenten
        </h3>
        <p className="text-xs text-text-main/70">
          Der Weg der Bauingenieure zur künstlichen Intelligenz in fünf historischen Phasen:
        </p>
      </div>

      <div className="relative border-l-2 border-shiraz/30 ml-3 md:ml-4 space-y-8 pl-5 md:pl-7 pt-2">
        {/* Phase 1 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-white border-4 border-shiraz shadow-sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">1960er – 1980er</span>
            <h4 className="font-bold text-sm text-text-main">Die Anfänge: Statische Rechenprogramme & Expertensysteme</h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Einführung von Großrechnern und ersten Finite-Elemente-Programmen (FEM). Ingenieure bauten <strong>regelbasierte Expertensysteme</strong>: Gigantische Sammlungen von Wenn-Dann-Regeln (z.B. "WENN Durchbiegung &gt; l/500 DANN vergrößere Trägerhöhe"). Diese Systeme konnten nicht lernen und brachen bei unvorhergesehenen Fällen zusammen.
          </p>
          <div className="text-[11px] text-text-main/60 bg-off-white p-2 rounded-lg border border-home-grau/20">
            <strong>Meilenstein:</strong> Erste CAD-Systeme ersetzen das Reißbrett; DIN-Vorgaben werden in starre Programmabläufe gegossen.
          </div>
        </div>

        {/* Phase 2 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-white border-4 border-slate-400 shadow-sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">1990er – 2000er</span>
            <h4 className="font-bold text-sm text-text-main">Erste Neuronale Netze & Genetische Algorithmen</h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Erste akademische Versuche mit künstlichen neuronalen Netzen an Universitäten: Vorhersage der 28-Tage-Betondruckfestigkeit aus Mischungsdaten. <strong>Genetische Algorithmen</strong> wurden populär, um Fachwerke auf minimales Stahlgewicht bei maximaler Steifigkeit zu optimieren.
          </p>
          <div className="text-[11px] text-text-main/60 bg-off-white p-2 rounded-lg border border-home-grau/20">
            <strong>Grenze damals:</strong> Geringe Rechenleistung und fehlende digitale Datensätze beschränkten KI auf Forschungslabore.
          </div>
        </div>

        {/* Phase 3 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-white border-4 border-slate-400 shadow-sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">2010 – 2020</span>
            <h4 className="font-bold text-sm text-text-main">BIM-Reife, Drohnen & Computer Vision</h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Der weltweite Durchbruch von <strong>Deep Learning</strong> (angetrieben durch Grafikkarten / GPUs): Drohnen befliegen Brückenbauwerke und Algorithmen (Convolutional Neural Networks) erkennen Risse, Abplatzungen und Rostfahnen vollautomatisch. Building Information Modeling (BIM) liefert erstmals strukturierte 3D-Daten.
          </p>
          <div className="text-[11px] text-text-main/60 bg-off-white p-2 rounded-lg border border-home-grau/20">
            <strong>Meilenstein:</strong> Automatisierte Baufortschrittskontrolle durch Abgleich von 3D-Laserscans mit dem BIM-Soll-Modell.
          </div>
        </div>

        {/* Phase 4 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-white border-4 border-shiraz shadow-sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">2022 – 2024</span>
            <h4 className="font-bold text-sm text-text-main">Die Generative-KI-Revolution (LLMs & RAG)</h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Mit ChatGPT, Claude und Gemini erreicht KI die Büro- und Planungsebene. Ingenieure nutzen KI zur Analyse hunderter Seiten Gutachten, zum Schreiben von Python-Auswerteskripten und zur Prüfung von Ausschreibungstexten nach VOB. <strong>RAG-Systeme</strong> lösen das Problem der Halluzination bei Normen.
          </p>
          <div className="text-[11px] text-text-main/60 bg-off-white p-2 rounded-lg border border-home-grau/20">
            <strong>Paradigmenwechsel:</strong> Softwareentwicklung wird durch "Vibe Coding" und KI-Assistenten demokratisiert.
          </div>
        </div>

        {/* Phase 5 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-emerald-100 shadow-sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Ab 2025</span>
            <h4 className="font-bold text-sm text-text-main">Autonome Workflows, PINNs & Agenten-Schwärme</h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Der Übergang von reinen Chat-Bots zu <strong>autonomen Agenten</strong>: Systeme, die mit Statik-APIs interagieren, physik-informierte neuronale Netze (PINNs), die FEM-Berechnungen in Echtzeit beschleunigen, und geschlossene Regelkreise im 3D-Betondruck.
          </p>
        </div>
      </div>
    </div>
  );
}
