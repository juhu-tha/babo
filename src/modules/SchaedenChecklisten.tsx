import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  FileText,
  BookOpen,
  TrendingDown,
  ExternalLink,
  ShieldAlert,
  ClipboardList,
  AlertTriangle,
  Camera,
  Activity,
  FileWarning
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

interface ChecklistItem {
  id: string;
  task: string;
  description: string;
  ref: string;
  status: 'critical' | 'mandatory' | 'recommended';
}

interface ChecklistSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  items: ChecklistItem[];
}

const INITIAL_CHECKLISTS: Record<string, ChecklistSection> = {
  aufnahme: {
    id: 'aufnahme',
    title: '1. Schadensdiagnose & Bauaufnahme',
    description: 'Dokumentation des Schadensausmaßes und Feststellung der Schadensursachen vor Ort.',
    icon: TrendingDown,
    items: [
      {
        id: 'auf-1',
        task: 'Risskartierung & Rissbreitenmessung',
        description: 'Vollständige grafische Aufzeichnung aller Risse, Unterscheidung von oberflächennahen Schwindrissen zu strukturprägenden Trennrissen mittels Rissbreitenlupe.',
        ref: 'DAfStb-Richtlinie Instandhaltung von Betonbauteilen, Teil 1 / WTA',
        status: 'critical'
      },
      {
        id: 'auf-2',
        task: 'Hohlstellen- und Abplatzungsortung',
        description: 'Abklopfen der Betonoberfläche mit leichtem Hammergeräusch zur Identifizierung von verdeckten Delaminationen infolge korrodierender Bewehrung.',
        ref: 'TR Instandhaltung (DIBt) / DIN 1076 mit RI-EBW-PRÜF (Ingenieurbauwerke)',
        status: 'mandatory'
      },
      {
        id: 'auf-3',
        task: 'Carbonatisierungstiefe messtechnisch beurteilen',
        description: 'Auftragen einer Phenolphthalein-Lösung auf frische Bruch- oder Bohrkernproben zur Sichtbarmachung des pH-Wert-Abfalls.',
        ref: 'DIN EN 14630',
        status: 'critical'
      },
      {
        id: 'auf-4',
        task: 'Chloridprofil-Bohrmehlanalyse',
        description: 'Schichtenweises Abbohren von Betonmehl (z. B. 0–15 mm, 15–30 mm, 30–50 mm) zur photometrischen oder titrimetrischen Bestimmung des Chloridgehalts.',
        ref: 'DIN EN 14629 / DAfStb',
        status: 'critical'
      }
    ]
  },
  diagnostik: {
    id: 'diagnostik',
    title: '2. Zerstörungsfreie Prüfung & Sensorik',
    description: 'Messtechnische Tiefenanalyse und Rissüberwachung an geschädigten Bauteilen.',
    icon: Activity,
    items: [
      {
        id: 'diag-1',
        task: 'Potentialfeldmessung zur Korrosionsortung',
        description: 'Zerstörungsfreie Lokalisierung aktiver Bewehrungskorrosionsherde auf der Bauteiloberfläche mittels Kupfersulfat-Halbzelle (CSE).',
        ref: 'DGZfP-Merkblatt B 03 (2025)',
        status: 'critical'
      },
      {
        id: 'diag-2',
        task: 'LVDT-Wegaufnehmer für Rissmonitoring',
        description: 'Montage induktiver Wegaufnehmer oder Rissmonitore (Gipsschnittmarken, Glasplättchen) zur Erfassung thermischer oder lastbedingter Rissweitenänderungen.',
        ref: 'VDI 6200 / Bauwerksmonitoring',
        status: 'mandatory'
      },
      {
        id: 'diag-3',
        task: 'Bohrwiderstandsmessung (Resistograph) bei Holz',
        description: 'Prüfung verdeckter Holzfäule in Balkenauflagern und Stützenfüßen mittels 1,5 mm feiner Nadelmessung.',
        ref: 'DGZfP Merkblatt Holzprüfung',
        status: 'mandatory'
      },
      {
        id: 'diag-4',
        task: 'Endoskopische Hohlrauminspektion',
        description: 'Minimalinvasive optische Untersuchung von Hohlschichten, Spannkanälen und Deckenhohlräumen über 8–10 mm Bohrungen.',
        ref: 'ZfP-Bau Leitfaden',
        status: 'recommended'
      }
    ]
  },
  beweissicherung: {
    id: 'beweissicherung',
    title: '3. Beweissicherung & Schadenskataster',
    description: 'Gerichtsfeste Dokumentation nach VOB/B, BGB und Sachverständigenstandard.',
    icon: Camera,
    items: [
      {
        id: 'bew-1',
        task: 'Strukturiertes Schadenskataster anlegen',
        description: 'Tabellarische Erfassung aller Mängel & Schäden mit eindeutiger Bauteil-ID, Planverortung, Fotoreferenz und Dimensionierung.',
        ref: 'VOB/B § 4 Nr. 7 / AHO Heft 9',
        status: 'critical'
      },
      {
        id: 'bew-2',
        task: 'Beweissicherung vor Nachbarbebauung',
        description: 'Vollständige visuelle und messtechnische Zustandserfassung von Nachbargebäuden vor Ramm-, Bohr- oder Wasserhaltungsarbeiten.',
        ref: 'DIN 4150-3 (Erschütterungen)',
        status: 'critical'
      },
      {
        id: 'bew-3',
        task: 'Abgrenzung Planungs- vs. Ausführungsfehler',
        description: 'Fachliche Prüfung, ob der Schaden auf unzureichende Planung (z. B. fehlende Dehnfugen) oder handwerklichen Ausführungsfehler zurückzuführen ist.',
        ref: 'BGB § 633 / VOB/B § 13',
        status: 'mandatory'
      }
    ]
  },
  standsicherheit: {
    id: 'standsicherheit',
    title: '4. Standsicherheitsbewertung (VDI 6200)',
    description: 'Einstufung des Schädigungsgrades und Sofortmaßnahmen zur Gefahrenabwehr.',
    icon: ShieldAlert,
    items: [
      {
        id: 'st-1',
        task: 'Schadensstufe nach VDI 6200 ermitteln',
        description: 'Bewertung von Standsicherheit und Tragwerkssicherheit in Zustandsklassen (Zustandsnoten 1: sehr gut bis 4: ungenügend / unmittelbare Einsturzgefahr).',
        ref: 'VDI 6200 Blatt 1',
        status: 'critical'
      },
      {
        id: 'st-2',
        task: 'Sofortige Notsicherung veranlassen',
        description: 'Bei Erreichen von Schadensstufe 4: Sofortige Nutzungsuntersagung, Teilabsperrung und Einbau von temporären Notunterstützungen (Schwerlaststützen).',
        ref: 'Landesbauordnung (Gefahrenabwehr)',
        status: 'critical'
      },
      {
        id: 'st-3',
        task: 'Verkehrssicherheitsprüfung protokollieren',
        description: 'Prüfbericht mit Fristsetzung für vertiefte statische Nachrechnungen und Gutachten erstellen.',
        ref: 'VDI 6200 / RÜV',
        status: 'mandatory'
      }
    ]
  }
};

export default function SchaedenChecklisten() {
  const [activeSubTab, setActiveSubTab] = useState<string>('aufnahme');
  const currentSection = INITIAL_CHECKLISTS[activeSubTab];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-4 animate-in fade-in duration-300">
      
      {/* Header Info-Bereich */}
      <div className="bg-white text-text-main rounded-2xl p-6 border border-home-grau/30 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <FileWarning className="text-shiraz" /> Checklisten: Bauschadensdiagnostik &amp; Bauaufnahme
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Systematische Prüflisten für Sachverständige, Gutachter und Bauleiter: Von der optischen Riss- und Hohlstellenkartierung über moderne zerstörungsfreie Prüfverfahren (ZfP) bis hin zur gerichtsfesten Beweissicherung und VDI-6200-Standsicherheitsprüfung.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          {Object.values(INITIAL_CHECKLISTS).map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSubTab === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => setActiveSubTab(sec.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-shiraz'} />
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-text-main'}`}>
                    {sec.title.split('. ')[1]}
                  </span>
                </div>
                <span className={`text-[11px] line-clamp-1 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                  {sec.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">{currentSection.title}</h3>
            <p className="text-xs text-slate-500">{currentSection.description}</p>
          </div>
          <span className="text-xs font-mono bg-off-white px-2.5 py-1 rounded border border-home-grau/30 text-slate-600">
            {currentSection.items.length} Prüfpunkte
          </span>
        </div>

        <div className="space-y-3">
          {currentSection.items.map((item) => (
            <div key={item.id} className="p-4 bg-off-white rounded-xl border border-home-grau/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'critical' ? 'bg-rose-100 text-rose-800' :
                    item.status === 'mandatory' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status === 'critical' ? 'Kritisch / Zwingend' :
                     item.status === 'mandatory' ? 'Standard' : 'Empfohlen'}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{item.task}</h4>
                </div>
                <p className="text-slate-700 leading-relaxed max-w-3xl">{item.description}</p>
              </div>

              <div className="shrink-0 text-right sm:text-right">
                <span className="text-[11px] font-mono bg-white px-2.5 py-1 rounded border border-home-grau/30 text-slate-600 inline-block">
                  {item.ref}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <ModuleFooter
        wikipedia={[
          { title: "Bauschaden", url: "https://de.wikipedia.org/wiki/Bauschaden" },
          { title: "Zerstörungsfreie Prüfung im Bauwesen", url: "https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Pr%C3%BCfung_im_Bauwesen" }
        ]}
        literatur={[
          'Frössel, F. (2018): Bauschadens-Sammlung: Schadensanalysen für die Praxis (Forum Verlag)',
          'Ruhnau, R. (2020): Risse in Betonbauteilen: Ursachen, Vermeidung und Sanierung (DIN Media)'
        ]}
        regelwerke={[
          { title: 'VDI 6200 (Standsicherheit von Bauwerken - Regelmäßige Überprüfung)', url: 'https://www.vdi.de/' },
          { title: 'DGZfP-Merkblätter (Zerstörungsfreie Prüfungen im Bauwesen)', url: 'https://www.dgzfp.de/' },
          { title: 'VOB/B § 13 (Mängelansprüche)', url: 'https://www.gesetze-im-internet.de/' }
        ]}
        formeln={[]}
      />
    </div>
  );
}
