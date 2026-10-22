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
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

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
    description: 'Vorbereitung, Dokumentation des Schadensausmaßes und Feststellung der Schadensursachen vor Ort.',
    icon: TrendingDown,
    items: [
      {
        id: 'auf-0',
        task: 'Unterlagen vorab sichten',
        description: 'Bauwerksbuch, Bestandspläne, Statik, frühere Prüfberichte und Nutzungsänderungen beschaffen und auswerten.',
        ref: 'VDI 6200 (Bauwerksbuch)',
        status: 'mandatory'
      },
      {
        id: 'auf-00',
        task: 'Arbeitsschutz und Schadstoffverdacht vor Bauteilöffnung',
        description: 'Bei Baujahr vor 1993 Asbest, PCB und PAK als Verdacht prüfen; Schutzmaßnahmen vor dem Öffnen von Bauteilen festlegen.',
        ref: 'GefStoffV / TRGS 519, 524',
        status: 'critical'
      },
      {
        id: 'auf-000',
        task: 'Sofortmaßnahmen-Check',
        description: 'Verkehrssicherung bei herabfallenden Teilen, Absperrungen und Notabstützungen prüfen, bevor die eigentliche Aufnahme beginnt.',
        ref: '§ 823 BGB / LBO',
        status: 'critical'
      },
      {
        id: 'auf-1',
        task: 'Risskartierung & Rissbreitenmessung',
        description: 'Vollständige grafische Aufzeichnung aller Risse, Unterscheidung von oberflächennahen Schwindrissen zu strukturprägenden Trennrissen mittels Risslupe bzw. Rissbreitenmaßstab.',
        ref: 'TR Instandhaltung (DIBt)',
        status: 'critical'
      },
      {
        id: 'auf-1b',
        task: 'Fotodokumentation mit Randbedingungen',
        description: 'Fotos mit Maßstab, Datum und Planbezug; Witterung, Bauteiltemperatur und relative Luftfeuchte bei der Aufnahme protokollieren.',
        ref: 'Sachverständigenpraxis',
        status: 'mandatory'
      },
      {
        id: 'auf-2',
        task: 'Hohlstellen- und Abplatzungsortung',
        description: 'Abklopfen der Betonoberfläche mit einem leichten Hammer zur Identifizierung verdeckter Delaminationen infolge korrodierender Bewehrung.',
        ref: 'TR Instandhaltung / DIN 1076:2026-01',
        status: 'mandatory'
      },
      {
        id: 'auf-3',
        task: 'Karbonatisierungstiefe messtechnisch beurteilen',
        description: 'Auftragen einer Phenolphthalein-Lösung auf frische Bruch- oder Bohrkernflächen zur Sichtbarmachung des pH-Wert-Abfalls.',
        ref: 'DIN EN 14630',
        status: 'critical'
      },
      {
        id: 'auf-4',
        task: 'Chloridprofil-Bohrmehlanalyse',
        description: 'Schichtenweises Abbohren von Betonmehl (z. B. 0–15, 15–30, 30–50 mm) und Bestimmung des Chloridgehalts bezogen auf Zement. Orientierung: < 0,2 unkritisch, 0,2–0,5 Beobachtung, ≥ 0,5 M.-% Korrosion wahrscheinlich – Einzelfallbewertung.',
        ref: 'DIN EN 14629 / TR Instandhaltung',
        status: 'critical'
      },
      {
        id: 'auf-5',
        task: 'Feuchtemessung',
        description: 'Zerstörungsfreie Messung als Vorscan, Darr- bzw. CM-Methode als Referenz.',
        ref: 'DIN EN ISO 12570',
        status: 'mandatory'
      },
      {
        id: 'auf-6',
        task: 'Verformungs- und Durchbiegungsmessung',
        description: 'Nivellement oder Tachymetrie an maßgebenden Bauteilen, Vergleich mit Soll-Geometrie und Vorwerten.',
        ref: 'Vermessung / VDI 6200',
        status: 'recommended'
      },
      {
        id: 'auf-7',
        task: 'Probenahme mit Protokoll',
        description: 'Probenahmeprotokoll (Ort, Tiefe, Verfahren, Lagerung) führen und Rückstellproben aufbewahren.',
        ref: 'DIN EN 12504-1 / Laborpraxis',
        status: 'mandatory'
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
        id: 'diag-2a',
        task: 'Rissmarken (qualitativ)',
        description: 'Gipsmarken oder Glasplättchen zeigen nur, ob sich ein Riss bewegt – keine Messwerte.',
        ref: 'Sachverständigenpraxis',
        status: 'recommended'
      },
      {
        id: 'diag-2',
        task: 'Rissmonitore / LVDT mit Temperaturmessung (quantitativ)',
        description: 'Induktive Wegaufnehmer oder Rissmonitore mit gleichzeitiger Bauteiltemperaturmessung, um thermische von lastbedingten bzw. fortschreitenden Rissbewegungen zu trennen.',
        ref: 'VDI 6200 / Bauwerksmonitoring',
        status: 'mandatory'
      },
      {
        id: 'diag-3',
        task: 'Bohrwiderstandsmessung (Resistograph) bei Holz',
        description: 'Prüfung verdeckter Holzfäule in Balkenauflagern und Stützenfüßen mittels feiner Bohrnadel (Ø ca. 1,5–3 mm); Auswertung relativ (Profilvergleich), Pilzart nur über Laboranalyse.',
        ref: 'DIN 68800-4 (Verfahren nicht genormt)',
        status: 'mandatory'
      },
      {
        id: 'diag-4',
        task: 'Endoskopische Hohlrauminspektion',
        description: 'Minimalinvasive optische Untersuchung von Hohlschichten, Spannkanälen und Deckenhohlräumen über 8–10 mm Bohrungen.',
        ref: 'DGZfP-Merkblatt B 06',
        status: 'recommended'
      }
    ]
  },
  beweissicherung: {
    id: 'beweissicherung',
    title: '3. Beweissicherung & Schadenskataster',
    description: 'Beweissichernde Dokumentation nach VOB/B, BGB und Sachverständigenstandard.',
    icon: Camera,
    items: [
      {
        id: 'bew-1',
        task: 'Strukturiertes Schadenskataster anlegen',
        description: 'Tabellarische Erfassung aller Mängel & Schäden mit eindeutiger Bauteil-ID, Planverortung, Fotoreferenz und Abmessungen; Zustandsfeststellung nach § 650g BGB nutzen.',
        ref: 'VOB/B § 4 Abs. 7, § 13 / BGB § 650g',
        status: 'critical'
      },
      {
        id: 'bew-2',
        task: 'Beweissicherung vor Nachbarbebauung',
        description: 'Vollständige visuelle und messtechnische Zustandserfassung von Nachbargebäuden vor Ramm-, Bohr- oder Wasserhaltungsarbeiten; ggf. selbstständiges Beweisverfahren (§§ 485 ff. ZPO).',
        ref: 'DIN 4123 / DIN 4150-2, -3',
        status: 'critical'
      },
      {
        id: 'bew-3',
        task: 'Abgrenzung Planungs- vs. Ausführungsfehler',
        description: 'Fachliche Prüfung, ob der Schaden auf unzureichende Planung (z. B. fehlende Dehnfugen) oder einen Ausführungsfehler zurückzuführen ist.',
        ref: 'BGB § 633 / VOB/B § 13',
        status: 'mandatory'
      },
      {
        id: 'bew-4',
        task: 'Ursachenhypothesen und Abgrenzung',
        description: 'Ursachenhypothesen dokumentieren und Mangel, Schaden und hinzunehmende Unregelmäßigkeit voneinander abgrenzen.',
        ref: 'Oswald/Abel',
        status: 'mandatory'
      }
    ]
  },
  standsicherheit: {
    id: 'standsicherheit',
    title: '4. Standsicherheitsbewertung (VDI 6200)',
    description: 'Bewertung des Bauwerkszustands und Sofortmaßnahmen zur Gefahrenabwehr.',
    icon: ShieldAlert,
    items: [
      {
        id: 'st-1',
        task: 'Bewertung und Zustandsnote dokumentieren',
        description: 'Bewertung und Zustandsnote nach VDI 6200 Blatt 1.1:2026-06 (Musterprüfbericht) dokumentieren, mit Maßnahmenempfehlung und Frist.',
        ref: 'VDI 6200 Blatt 1.1',
        status: 'critical'
      },
      {
        id: 'st-2',
        task: 'Sofortige Notsicherung veranlassen',
        description: 'Bei Gefahr für Leib und Leben (schlechteste Bewertungsstufe): Nutzungsbeschränkung bzw. Absperrung, Information des Eigentümers und ggf. der Bauaufsicht (Art. 54 BayBO / § 58 MBO), Notabstützung.',
        ref: 'LBO (Gefahrenabwehr)',
        status: 'critical'
      },
      {
        id: 'st-3',
        task: 'Verkehrssicherheitsprüfung protokollieren',
        description: 'Prüfbericht mit Fristsetzung für vertiefte statische Nachrechnungen und Gutachten erstellen. RÜV: Richtlinie für die Überwachung der Verkehrssicherheit von baulichen Anlagen des Bundes (BMVBS 2008, nur Bundesbauten); ARGEBAU-Hinweise 09/2006.',
        ref: 'VDI 6200 / RÜV / ARGEBAU',
        status: 'mandatory'
      }
    ]
  }
};

export default function SchaedenChecklisten() {
  const [activeSubTab, setActiveSubTab] = useState<string>('aufnahme');
  const currentSection = INITIAL_CHECKLISTS[activeSubTab];

  return (
    <div className="flex flex-col gap-6 w-full py-4 animate-in fade-in duration-300">
      
      {/* Header Info-Bereich */}
      <div className="bg-white text-text-main rounded-2xl p-6 border border-home-grau/30 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <FileWarning className="text-shiraz" /> Checklisten: Bauschadensdiagnostik &amp; Bauaufnahme
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Systematische Prüflisten für Sachverständige, Gutachter und Bauleiter: Von der optischen Riss- und Hohlstellenkartierung über moderne zerstörungsfreie Prüfverfahren (ZfP) bis hin zur beweissichernden Dokumentation und VDI-6200-Standsicherheitsprüfung.
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
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Ist der Riss aktiv? Auswertung einer Rissmarke"
        zielGleichung="\dot{w} = \frac{w_2 - w_1}{\Delta t}"
        schritte={[
          { titel: 'Messung', erklaerung: 'Rissbreite bei Setzen der Marke 0,20 mm, nach sechs Monaten 0,26 mm:', formel: '\\Delta w = 0{,}06\\,\\text{mm}' },
          { titel: 'Rate', erklaerung: 'Bezogen auf ein Jahr:', formel: '\\dot{w} = \\frac{0{,}06}{0{,}5} = 0{,}12\\,\\text{mm/a}' },
          { titel: 'Bewertung', erklaerung: 'Bewegung über die jahreszeitliche Schwankung hinaus deutet auf eine aktive Ursache:', formel: '\\dot{w} > 0 \\Rightarrow \\text{Ursache klären, vor Verpressen}' }
        ]}
        ergebnisHinweis="Messungen über mindestens einen Jahreszyklus mit Temperaturaufzeichnung auswerten; nur ruhende Risse dürfen kraftschlüssig verpresst werden (TR Instandhaltung)."
        normQuelle="TR Instandhaltung (DIBt); DBV-Merkblatt Begrenzung der Rissbildung"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Feuchtegehalt einer Mauerwerksprobe (Darrmethode)"
        zielGleichung="u_m = \frac{m_f - m_d}{m_d} \cdot 100\,\%"
        schritte={[
          { titel: 'Wägung', erklaerung: 'Bohrmehlprobe feucht 85,0 g, nach Trocknung bei 105 °C 80,2 g:', formel: 'm_f = 85{,}0\\,\\text{g}, \\; m_d = 80{,}2\\,\\text{g}' },
          { titel: 'Feuchtegehalt', erklaerung: 'Massebezogen:', formel: 'u_m = \\frac{85{,}0 - 80{,}2}{80{,}2} \\cdot 100 = 6{,}0\\,\\%' },
          { titel: 'Durchfeuchtungsgrad', erklaerung: 'Bei einer maximalen Wasseraufnahme von 15,0 M.-%:', formel: 'DFG = \\frac{6{,}0}{15{,}0} = 40\\,\\%' }
        ]}
        ergebnisHinweis="Erst der Durchfeuchtungsgrad erlaubt den Vergleich verschiedener Baustoffe. Gips- oder salzhaltige Proben können bei 105 °C Kristallwasser verlieren – dann bei 40 °C trocknen."
        normQuelle="WTA-Merkblatt 4-11"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="schaeden_checklisten" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 11 Mängel & Schäden: Referenzen VOB/B 2016, BGB, DIN 1076:2026-01, VDI 6200 geprüft; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: "Bauschaden", url: "https://de.wikipedia.org/wiki/Bauschaden" },
          { title: "Zerstörungsfreie Prüfung im Bauwesen", url: "https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Pr%C3%BCfung_im_Bauwesen" }
        ]}
        literatur={[
          'Zimmermann, G. (Hrsg.): Bauschadens-Sammlung. Fraunhofer IRB Verlag',
          'Oswald, R.; Abel, R.: Hinzunehmende Unregelmäßigkeiten bei Gebäuden. Springer Vieweg',
          'Lohmeyer, G.; Ebeling, K.: Weiße Wannen einfach und sicher. Verlag Bau+Technik'
        ]}
        regelwerke={[
          { title: 'VDI 6200:2010-02 (Standsicherheit von Bauwerken – Regelmäßige Überprüfung); Blatt 1.1:2026-06', url: 'https://www.vdi.de/' },
          { title: 'DGZfP-Merkblätter (Zerstörungsfreie Prüfungen im Bauwesen)', url: 'https://www.dgzfp.de/' },
          { title: 'VOB/B (Fassung 2016, weiterhin gültig) § 13 Mängelansprüche', url: 'https://www.bauprofessor.de/vob/' },
          { title: 'BGB §§ 633–634a (Mängelrechte und Verjährung beim Werkvertrag)', url: 'https://www.gesetze-im-internet.de/bgb/__634a.html' }
        ]}
        formeln={[]}
      />
    </div>
  );
}
