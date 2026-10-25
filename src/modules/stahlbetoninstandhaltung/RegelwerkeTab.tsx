// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import React from 'react';
import { BookOpen } from 'lucide-react';
import { szenarien } from './daten';

export interface RegelwerkeTabProps {
  selectedScenario: string;
  setSelectedScenario: React.Dispatch<React.SetStateAction<string>>;
}

export default function RegelwerkeTab({ selectedScenario, setSelectedScenario }: RegelwerkeTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border-y border-r border-l-4 border-shiraz border-home-grau/20 p-4 rounded-xl">
        <h3 className="font-bold text-shiraz flex items-center gap-2 text-base">
          <BookOpen size={20} />
          Regelwerke in Deutschland: Wer regelt was und ab wann ist es gültig?
        </h3>
        <p className="text-text-main mt-2 text-sm leading-relaxed">
          Bei der Betoninstandsetzung treffen europäisches Produktrecht, deutsches Bauordnungsrecht (Öffentliches Recht) und Zivilrecht (Verträge) aufeinander. Das Verständnis über Rangordnung und Gültigkeitsbereich schützt Planer und Ausführende vor massiven Haftungsrisiken.
        </p>
      </div>

      {/* Die drei Hauptpfeiler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TR Instandhaltung */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-[#475569] bg-sky-50 border border-sky-100 rounded-full px-2.5 py-0.5 inline-block mb-3">
              Staatlich / Gesetzlich (Standsicherheit)
            </div>
            <h4 className="text-lg font-bold text-text-main mb-2">TR Instandhaltung</h4>
            <p className="text-xs text-home-grau mb-3 leading-relaxed">
              Herausgegeben vom Deutschen Institut für Bautechnik (DIBt). Regelt die statische Planung und standsicherheitsrelevante Ausführung.
            </p>
            <div className="border-t border-home-grau/30 pt-3 mt-2 space-y-2">
              <span className="text-xs font-bold text-shiraz block">Gliederung / Struktur:</span>
              <ul className="text-xs space-y-1 text-text-main list-disc pl-4">
                <li><strong>Teil 1:</strong> Anwendungsbereich und Planung der Instandhaltung (Grundsätze, Standsicherheitsrelevanz, Schadensanalyse, Instandsetzungskonzept, Sachkundiger Planer SKP).</li>
                <li><strong>Teil 2:</strong> Merkmale von Produkten oder Systemen für die Instandsetzung und Regelungen für deren Verwendung (Leistungsanforderungen mit Bezug auf DIN EN 1504-2 bis -7).</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-home-grau/30">
            <div className="bg-sky-50 text-sky-950 p-2.5 rounded text-xs">
              <strong>Gültigkeit:</strong> Bauaufsichtlich verbindlich nach Einführung in der jeweiligen Landes-Verwaltungsvorschrift Technische Baubestimmungen. Jeder Eingriff in die tragende Struktur eines Bauwerks muss dieser Technischen Regel genügen. Löst das bauaufsichtliche Mandat der alten SIB-Richtlinie ab.
            </div>
          </div>
        </div>

        {/* DAfStb RiLi-SIB */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 inline-block mb-3">
              Historisch / Anerkannte Technikregel
            </div>
            <h4 className="text-lg font-bold text-text-main mb-2">Historisch: Instandsetzungsprinzipien der DAfStb-Rili-SIB (2001)</h4>
            <p className="text-xs text-home-grau mb-3 leading-relaxed">
              Vom Deutschen Ausschuss für Stahlbeton. Jahrzehntelang das Referenzwerk der Instandsetzung für Material, Ausführung und Entwurf.
            </p>
            <div className="border-t border-home-grau/30 pt-3 mt-2 space-y-2">
              <span className="text-xs font-bold text-shiraz block">Gliederung / Struktur:</span>
              <ul className="text-xs space-y-1 text-text-main list-disc pl-4">
                <li><strong>Teil 1:</strong> Allgemeine Regelungen und Planungsgrundsätze.</li>
                <li><strong>Teil 2:</strong> Bauprodukte und Anwendung.</li>
                <li><strong>Teil 3:</strong> Anforderungen an die Betriebe und Überwachung der Ausführung.</li>
                <li><strong>Teil 4:</strong> Prüfverfahren.</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-home-grau/30">
            <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded text-xs">
              <strong>Gültigkeit: Nicht mehr bauaufsichtlich</strong>, aber weiterhin privatrechtlich (Anerkannte Regel der Technik für kosmetische/rein gebrauchstaugliche Sanierungen) relevant, solange kein Standsicherheitsrisiko vorliegt (z.B. optische Betonausbesserung ohne Einbezug von bewehrungsrelevanten Tragteilen).
            </div>
          </div>
        </div>

        {/* DIN EN 1504 */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-purple-700 bg-purple-50 border border-purple-100 rounded-full px-2.5 py-0.5 inline-block mb-3">
              Europäische Produktnorm
            </div>
            <h4 className="text-lg font-bold text-text-main mb-2">DIN EN 1504 Reihe</h4>
            <p className="text-xs text-home-grau mb-3 leading-relaxed">
              Harmonisierte europäische Norm. Regelt ausschließlich Eigenschaften, Prüfung und Deklaration der verwendeten Baustoffe/Systeme.
            </p>
            <div className="border-t border-home-grau/30 pt-3 mt-2 space-y-2">
              <span className="text-xs font-bold text-shiraz block">Gliederung / Struktur:</span>
              <ul className="text-xs space-y-1 text-text-main list-disc pl-4">
                <li><strong>Teile 1-8:</strong> Definitionen für Oberflächenschutz (-2), Mörtel (-3), Statische Lastübertragung (-4), Rissinjektion (-5), Verankerung (-6).</li>
                <li><strong>Teil 9:</strong> Allgemeine Prinzipien der Planung einer Instandsetzung (rein informativ).</li>
                <li><strong>Teil 10:</strong> Baustellenanwendung und Qualitätsbewertung der Produkte.</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-home-grau/30">
            <div className="bg-purple-50 text-purple-950 p-2.5 rounded text-xs">
              <strong>Gültigkeit: Ständig anwendbar für Produkte.</strong> Sie harmonisiert den Handel in der EU (CE-Kennzeichen). Sie regelt jedoch <em>nicht</em> die zulässige Bemessung, den standsicherheitsrelevanten Bauwerksentwurf oder die nationale Bauausführung in Deutschland!
            </div>
          </div>
        </div>
      </div>

      {/* Interaktiver Szenarien-Check */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Regelwerks-Kollision: Welches Regelwerk greift wann?</h3>
  <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
    <p>
      Wählen Sie ein praxisnahes Beispiel aus, um zu überprüfen, welches Regelwerk vorrangig greift und welche Pflichten entstehen.
    </p>
  </div>
          <div className="shrink-0">
            <select 
              value={selectedScenario} 
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="p-2 border border-home-grau/30 rounded-lg text-xs font-bold text-text-main bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-shiraz"
            >
              {szenarien.map((sz) => (
                <option key={sz.id} value={sz.id}>{sz.title}</option>
              ))}
            </select>
          </div>
        </div>

        {szenarien.filter(s => s.id === selectedScenario).map((sz) => (
          <div key={sz.id} className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-sm space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/30 pb-3">
              <span className="font-bold text-sm text-text-main">{sz.title}</span>
              <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded inline-block border ${sz.badgeColor}`}>
                {sz.regulatoryAnswer}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-off-white/60 p-3.5 rounded-lg border border-home-grau/10">
                <span className="font-bold text-shiraz block mb-1">Schadenfall / Aufgabenstellung:</span>
                <p className="text-text-main leading-relaxed">{sz.problem}</p>
              </div>
              <div className="bg-off-white/60 p-3.5 rounded-lg border border-home-grau/10">
                <span className="font-bold text-emerald-700 block mb-1">Rechtliche & normative Einstufung:</span>
                <p className="text-text-main leading-relaxed">{sz.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chronologische Übersicht */}
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
        <h3 className="font-bold text-text-main text-base mb-4">Chronologische / Vertragliche Klarstellung</h3>
        <div className="space-y-3.5 text-xs text-text-main">
          <p>
            Im Falle einer <strong>Abweichung</strong> zwischen den Richtlinien gilt folgende Daumenregel:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-3 bg-red-50/40 rounded-lg border border-red-100">
              <span className="font-bold text-red-800 block mb-1">1. Standsicherheitsrelevante Bauteile (Gesetzliche Pflicht)</span>
              Die <strong>TR Instandhaltung</strong> steht über allen anderen Regeln. Eine Abminderung oder Abweichung von ihren Vorgaben ohne bauaufsichtliche Zustimmung ist unzulässig.
            </div>
            <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100">
              <span className="font-bold text-emerald-800 block mb-1">2. Vertraglicher Soll-Zustand (Privatwirtschaftlich)</span>
              Liegt keine statische Relevanz vor, kann die ungeschmälerte <strong>DAfStb SIB</strong> als detaillierte Fachregel vereinbart werden, solange sie das Sicherheitsziel der TR nicht gefährdet.
            </div>
            <div className="p-3 bg-purple-50/40 rounded-lg border border-purple-100">
              <span className="font-bold text-purple-800 block mb-1">3. Produkt-Eigenschaften (CE-Zeichen)</span>
              Alle eingesetzten Mörtel, Anstriche und Injektionen müssen zwingend nach <strong>DIN EN 1504</strong> geprüft sein. Nationale Sonderanforderungen müssen über entsprechende Zusatzprüfungen deklariert sein.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
