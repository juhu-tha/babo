// Ausgelagert aus src/modules/ki/KiUeberblick.tsx (AP 5.2)
import { CheckCircle2, AlertTriangle, ShieldAlert, TrendingUp, Check } from 'lucide-react';
import { InlineMath } from 'react-katex';

export default function StandTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 4 Praxisfelder */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <TrendingUp className="text-shiraz" size={20} />
          Wo KI heute in der Baupraxis tatsächlich Mehrwert stiftet
        </h3>
        <p className="text-xs text-text-main/70">
          Vier etablierte Einsatzbereiche, die bereits heute in modernen Ingenieurbüros und auf Baustellen genutzt werden:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">01</span>
              <h4 className="font-bold text-sm text-text-main">Material- & Rezepturoptimierung</h4>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Entwicklung klinkerreduzierter Zemente (CEM II/C, CEM VI) und RC-Betone. Machine-Learning-Modelle sagen Festigkeitsentwicklung, Hydratationswärme und Schwinden anhand von Gesteins- und Zusatzmittelkombinationen präzise vorher – und sparen hunderte zeitaufwendige Laborversuche.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">Nutzen: Schnellere Zulassungen, bis zu 40% CO₂-Einsparung</div>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">02</span>
              <h4 className="font-bold text-sm text-text-main">Visuelle Bauwerksdiagnose & Drohnen</h4>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Automatisierte Schadenserkennung nach DIN 1076 oder VDI 6200. Hochauflösende Kamerabilder von Brückenunterbauten oder Kühltürmen werden per Convolutional Neural Networks (CNNs) auf Risse, Ausblühungen und Betonabplatzungen gescannt und ins Schadenskataster eingepflegt.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">Nutzen: 80% Zeitersparnis bei der Vor-Ort-Risskartierung</div>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">03</span>
              <h4 className="font-bold text-sm text-text-main">Dokumenten- & Ausschreibungsprüfung</h4>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed">
              RAG-gestützte LLMs prüfen Leistungsverzeichnisse (LV), Baugrundgutachten und Verträge nach VOB/B. Widersprüche zwischen Leistungsbeschreibung und statischen Vorbemerkungen werden in Minuten aufgespürt, bevor teure Nachträge auf der Baustelle entstehen.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">Nutzen: Nachtragsrisiken drastisch reduzieren</div>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">04</span>
              <h4 className="font-bold text-sm text-text-main">Predictive Maintenance & SHM-Sensorik</h4>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Strukturierte Schwingungsanalyse an bestehenden Tragwerken. Algorithmen lernen das "gesunde" Schwingungsverhalten einer Brücke unter Temperatur- und Verkehrslast. Weicht die Eigenfrequenz plötzlich ab, schlägt die KI Alarm, bevor ein Riss mit bloßem Auge sichtbar ist.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">Nutzen: Frühwarnsystem zur Einsturzprävention</div>
          </div>
        </div>
      </div>

      {/* Ehrliche Matrix: Was funktioniert vs. Was sind die Grenzen */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <ShieldAlert className="text-amber-600" size={20} />
          Reifegrad-Check: Was funktioniert verlässlich – und was nicht?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2.5">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-700" />
              Bereits praxistauglich & verlässlich:
            </h4>
            <ul className="space-y-1.5 text-emerald-800 list-disc list-inside leading-snug">
              <li><strong>Texterfassung & Strukturierung:</strong> Zusammenfassung von Protokollen, GAEB-Dateien, Gutachten.</li>
              <li><strong>Code & Automatisierung:</strong> Erstellung von Python-Skripten für Plotter, Excel-Makros, Statik-Schnittstellen.</li>
              <li><strong>Bilderkennung:</strong> Auffinden von Rissen, Abplatzungen und geometrischen Abweichungen in Punktwolken.</li>
              <li><strong>Normenrecherche mit RAG:</strong> Auffinden exakter Paragraphen in kuratierten Normensammlungen.</li>
              <li><strong>Vorentwurfsvarianten:</strong> Generieren vieler Gebäudegeometrien zur Beschattungs- und Windoptimierung.</li>
            </ul>
          </div>

          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2.5">
            <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle size={16} className="text-rose-700" />
              Aktuelle Grenzen & No-Gos:
            </h4>
            <ul className="space-y-1.5 text-rose-800 list-disc list-inside leading-snug">
              <li><strong>Keine ungeprüfte Statik:</strong> Eine KI haftet nicht nach BGB/HOAI. Jede statische Berechnung muss von einem bauvorlageberechtigten Ingenieur gegengezeichnet werden.</li>
              <li><strong>Blackbox-Problem:</strong> Neuronale Netze können meist nicht begründen, <em>warum</em> sie eine Festigkeit vorhersagen (mangelnde Nachvollziehbarkeit).</li>
              <li><strong>Halluzinationen bei Zahlen:</strong> Reines LLM ohne RAG erfindet bei Spezialnormen mitunter fiktive Beiwerte (<InlineMath math="\gamma_c" />, <InlineMath math="\alpha_{cc}" />).</li>
              <li><strong>Datenschutz & Betriebsgeheimnis:</strong> Keine vertraulichen Pläne in öffentliche Cloud-Chats hochladen (Lösung: Lokale LLMs oder Enterprise-Lizenzen).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
