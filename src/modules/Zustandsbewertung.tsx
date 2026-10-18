import React, { useState } from 'react';
import { AlertTriangle, Search, Filter, FileText, CheckCircle, XCircle, Info, Sliders, Calculator, Award, Plus, Minus, BookOpen, Wrench, Shield, Clipboard, Eye, ClipboardCheck, ShieldCheck } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { formatDeZahl } from '@/src/utils/numberFormat';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';

const SCHADEN_KATEGORIEN = [
  { id: 'all', label: 'Alle Kategorien' },
  { id: 'beton', label: 'Betonbau' },
  { id: 'stahl', label: 'Stahlbau' },
  { id: 'holz', label: 'Holzbau' },
  { id: 'mauerwerk', label: 'Mauerwerk' }
];

const SCHAEDEN = [
  {
    id: 1,
    kategorie: 'beton',
    titel: 'Risse im Beton',
    beschreibung: 'Trennungsrisse, Biegerisse, Schwindrisse oder Setzungsrisse, die die Dauerhaftigkeit oder Tragfähigkeit beeinträchtigen können.',
    ursachen: ['Überlastung', 'Schwinden', 'Temperaturzwang', 'Baugrundsetzungen'],
    bewertung: 'Abhängig von Rissbreite, Tiefe und Rissursache. Risse > 0,3 mm (je nach Expositionsklasse) erfordern oft Instandsetzung.',
    massnahmen: ['Rissinjektion (kraftschlüssig oder dehnfähig)', 'Verstärkung', 'Ursachenbehebung']
  },
  {
    id: 2,
    kategorie: 'beton',
    titel: 'Bewehrungskorrosion',
    beschreibung: 'Rosten der Stahleinlagen, oft einhergehend mit Betonabplatzungen und Querschnittsverlust der Bewehrung.',
    ursachen: ['Karbonatisierung', 'Chlorideindringung (Tausalz)', 'Ungenügende Betondeckung'],
    bewertung: 'Kritisch für Tragfähigkeit und Dauerhaftigkeit. Querschnittsverlust muss statisch bewertet werden.',
    massnahmen: ['Betonersatz (Instandsetzungsprinzipien nach RiLi-SIB/TR Instandhaltung)', 'Kathodischer Korrosionsschutz (KKS)']
  },
  {
    id: 3,
    kategorie: 'stahl',
    titel: 'Korrosion von Stahlbauteilen',
    beschreibung: 'Flächenkorrosion, Lochfraß oder Kontaktkorrosion an Stahlträgern, Stützen oder Verbindungen.',
    ursachen: ['Fehlender/beschädigter Korrosionsschutz', 'Feuchtigkeit', 'Aggressive Umgebungsbedingungen'],
    bewertung: 'Ermittlung des Restquerschnitts erforderlich. Bei starkem Abtrag statische Nachrechnung.',
    massnahmen: ['Entrosten (Sandstrahlen)', 'Neuer Korrosionsschutz', 'Verstärkung oder Austausch']
  },
  {
    id: 4,
    kategorie: 'holz',
    titel: 'Holzzerstörende Pilze',
    beschreibung: 'Befall durch Echten Hausschwamm, Kellerschwamm oder Blättlinge, führt zu Braun- oder Weißfäule (Festigkeitsverlust).',
    ursachen: ['Erhöhte Holzfeuchte (> 20%)', 'Wasserschäden', 'Mangelhafte Belüftung'],
    bewertung: 'Sehr kritisch. Tragfähigkeit oft massiv reduziert. Hausschwamm erfordert spezielle Sanierung nach DIN 68800-4.',
    massnahmen: ['Ursache beheben (Trockenlegung)', 'Befallenes Holz großzügig entfernen (Gesundschnitt)', 'Chemischer Holzschutz (falls zulässig)']
  },
  {
    id: 5,
    kategorie: 'holz',
    titel: 'Holzzerstörende Insekten',
    beschreibung: 'Befall durch Hausbock, Nagekäfer (Holzwurm) oder Splintholzkäfer. Fraßgänge im Holzinneren.',
    ursachen: ['Ausreichende Holzfeuchte', 'Fehlender chemischer Holzschutz (bei gefährdeten Bauteilen)'],
    bewertung: 'Tragfähigkeitsverlust durch Querschnittsschwächung. Ausmaß oft äußerlich schwer erkennbar.',
    massnahmen: ['Heißluftverfahren', 'Begasung', 'Chemische Bekämpfung', 'Austausch stark geschädigter Hölzer']
  },
  {
    id: 6,
    kategorie: 'mauerwerk',
    titel: 'Feuchteschäden und Ausblühungen',
    beschreibung: 'Durchfeuchtung des Mauerwerks, oft begleitet von weißen Salzausblühungen an der Oberfläche.',
    ursachen: ['Fehlende/defekte Horizontalsperre', 'Schlagregen', 'Hygroskopische Feuchte durch Salze'],
    bewertung: 'Führt zu Frostschäden, Putzabplatzungen und reduzierter Wärmedämmung.',
    massnahmen: ['Nachträgliche Horizontalsperre (Injektion)', 'Sanierputzsysteme', 'Fassadenimprägnierung']
  },
  {
    id: 7,
    kategorie: 'mauerwerk',
    titel: 'Risse im Mauerwerk',
    beschreibung: 'Setzungsrisse (oft treppenförmig), thermische Risse oder Risse durch Überlastung.',
    ursachen: ['Ungleichmäßige Baugrundsetzungen', 'Temperaturdehnungen', 'Fehlende Dehnfugen'],
    bewertung: 'Unterscheidung zwischen statisch relevanten (trennenden) und oberflächlichen Rissen.',
    massnahmen: ['Vernadelung', 'Spiralanker', 'Rissverpressung', 'Unterfangung (bei Setzungen)']
  }
];

export default function Zustandsbewertung() {
  const [activeTab, setActiveTab] = useState<'din1076' | 'vdi6200' | 'datenbank' | 'rechner'>('din1076');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [calculatorTab, setCalculatorTab] = useState<'quick' | 'matrix'>('quick');
  const [zustandsnoteInput, setZustandsnoteInput] = useState<number>(2.2);
  const [sScore, setSScore] = useState<number>(2);
  const [vScore, setVScore] = useState<number>(1);
  const [dScore, setDScore] = useState<number>(3);
  const [additionalCount, setAdditionalCount] = useState<number>(1);

  const filteredSchaeden = SCHAEDEN.filter(s => {
    const matchesCategory = activeCategory === 'all' || s.kategorie === activeCategory;
    const matchesSearch = s.titel.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.beschreibung.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Navigation header */}
      <div className="flex border-b border-home-grau/30 overflow-x-auto">
        <button
          className={`px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'din1076' ? 'border-shiraz text-shiraz' : 'border-transparent text-home-grau hover:text-text-main'
          }`}
          onClick={() => setActiveTab('din1076')}
        >
          <BookOpen size={16} /> DIN 1076 (Brücken & Ingenieurbauten)
        </button>
        <button
          className={`px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'vdi6200' ? 'border-shiraz text-shiraz' : 'border-transparent text-home-grau hover:text-text-main'
          }`}
          onClick={() => setActiveTab('vdi6200')}
        >
          <AlertTriangle size={16} /> VDI 6200 (Standsicherheit im Hochbau)
        </button>
        <button
          className={`px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'datenbank' ? 'border-shiraz text-shiraz' : 'border-transparent text-home-grau hover:text-text-main'
          }`}
          onClick={() => setActiveTab('datenbank')}
        >
          <Search size={16} /> Typische Bauschäden
        </button>
        <button
          className={`px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'rechner' ? 'border-shiraz text-shiraz' : 'border-transparent text-home-grau hover:text-text-main'
          }`}
          onClick={() => setActiveTab('rechner')}
        >
          <Calculator size={16} /> Notenrechner & Konverter
        </button>
      </div>

      {/* TAB Content 1: DIN 1076 */}
      {activeTab === 'din1076' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-shiraz" size={28} />
              <h2 className="text-2xl font-bold text-text-main">Überwachung & Prüfung nach DIN 1076</h2>
            </div>
            <p className="text-text-main/80 mb-6 text-sm leading-relaxed">
              Die deutsche Norm <strong>DIN 1076</strong> "Ingenieurbauwerke im Zuge von Straßen und Wegen - Überwachung und Prüfung" regelt die systematische Überprüfung der Verkehrssicherheit, Standsicherheit und Dauerhaftigkeit von Ingenieurbauwerken wie Brücken, Tunneln, Trogbauwerken, Stützwänden und Lärmschutzwänden im öffentlichen Straßennetz. Sie bildet das Fundament der staatlichen Brückenüberwachung in Deutschland.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-shiraz text-white flex items-center justify-center font-bold text-sm">H</div>
                  <h4 className="font-bold text-text-main text-sm">Hauptprüfung (H)</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  <strong>Alle 6 Jahre:</strong> Eingehende, handnahe Prüfung aller Bauteile unter Zuhilfenahme von Prüfgeräten (Hubsteiger, Brückenuntersichtsgeräte) und Messtechnik durch einen besonders qualifizierten Prüfingenieur. Alle Risse, Hohlstellen, Chloridwerte und Carbonatisierungstiefen werden exakt analysiert.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-shiraz text-white flex items-center justify-center font-bold text-sm">E</div>
                  <h4 className="font-bold text-text-main text-sm">Einfache Prüfung (E)</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  <strong>3 Jahre nach Hauptprüfung:</strong> Eine Funktions- und Sichtprüfung ohne schwere Hilfs- und Zugangsgeräte (Zwischenprüfung). Es wird kontrolliert, ob seit der letzten Hauptprüfung neue Schäden entstanden sind oder sich dokumentierte Verschlechterungen beschleunigt haben.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-bold text-sm">B</div>
                  <h4 className="font-bold text-text-main text-sm">Besichtigung (B)</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  <strong>Jährlich (außer im H/E-Jahr):</strong> Grobe Funktionsprüfung und allgemeine Sichtkontrolle durch geschulte Techniker oder Meister der Straßenbauverwaltung. Ziel ist das Entdecken offensichtlicher neuer Risse, Fugenschäden, Auswaschungen oder Betonausbrüche.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-bold text-sm">L</div>
                  <h4 className="font-bold text-text-main text-sm">Laufende Beobachtung (L)</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  <strong>Vierteljährlich:</strong> Kontinuierliche Überwachung durch das Straßenunterhaltungspersonal (Straßenwärter) im Zuge ihrer regulären Kontrollfahrten. Dokumentiert werden plötzliche Anomalien wie Anfahrschäden, akute Setzungen oder Hochwasserbeeinflussungen.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">S</div>
                  <h4 className="font-bold text-text-main text-sm">Sonderprüfung (S)</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  <strong>Anlassbezogen:</strong> Eingehende Bauwerksprüfung unabhängig von den Regelintervallen nach außergewöhnlichen Ereignissen wie Orkanen, Erdbeben, extremen Schwerlasttransporten oder Schiffsanprall, um unbemerkt entstandene Strukturschäden auszuschließen.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#7c3aed] text-white flex items-center justify-center font-bold text-sm">P</div>
                  <h4 className="font-bold text-text-main text-sm">Bauabnahme- / Gewährleistungs-P</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  <strong>Vor Übergabe / Ablauf Gewährleistung:</strong> Ausgeführt unmittelbar vor der Verkehrsübergabe des Neubaus (Abnahmeprüfung) und ca. 10–12 Monate vor Ablauf der vertraglichen Gewährleistungsfrist (oft 4 oder 5 Jahre), um Baumängel rechtzeitig anzuzeigen.
                </p>
              </div>
            </div>
          </div>

          {/* RI-EBW-PRÜF Zustandsnoten */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="font-bold text-lg text-text-main mb-4">Bauwerksbewertung (Zustandsnoten nach RI-EBW-PRÜF)</h3>
            <p className="text-sm text-text-main/80 mb-6">
              Die Bewertung eines Ingenieurbauwerks erfolgt in Deutschland standardisiert über das IT-System <strong>SIB-Bauwerke</strong> auf Grundlage der Richtlinie <strong>RI-EBW-PRÜF</strong>. Die Note ist ein mathematisch-objektiver Indikator für den Handlungs- und Sanierungsbedarf.
            </p>

            <div className="space-y-3">
              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="w-full md:w-32 bg-emerald-500 text-white font-mono font-bold text-center py-3 rounded-lg flex flex-col justify-center items-center shrink-0">
                  <span className="text-2xl">1.0 - 1.4</span>
                  <span className="text-xs uppercase font-bold tracking-wider">Sehr gut</span>
                </div>
                <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/15 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-main font-semibold leading-relaxed">
                    Das Bauwerksbauteil weist keine oder nur unerhebliche Mängel auf. Standsicherheit, Verkehrssicherheit und Dauerhaftigkeit sind vollumfänglich und ohne Einschränkung gegeben.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="w-full md:w-32 bg-lime-500 text-text-main font-mono font-bold text-center py-3 rounded-lg flex flex-col justify-center items-center shrink-0">
                  <span className="text-2xl">1.5 - 1.9</span>
                  <span className="text-xs uppercase font-bold tracking-wider">Gut</span>
                </div>
                <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/15 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-main font-semibold leading-relaxed">
                    Geringe Mängel vorhanden (z.B. oberflächlicher Algenbewuchs, minimale Ausblühungen). Standsicherheit und Verkehrssicherheit sind unbeeinträchtigt. Die Dauerhaftigkeit kann langfristig gemindert werden.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="w-full md:w-32 bg-yellow-400 text-text-main font-mono font-bold text-center py-3 rounded-lg flex flex-col justify-center items-center shrink-0">
                  <span className="text-2xl">2.0 - 2.4</span>
                  <span className="text-xs uppercase font-bold tracking-wider">Befriedigend</span>
                </div>
                <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/15 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-main font-semibold leading-relaxed">
                    Mittlere Mängel erkennbar (z.B. oberflächennahe Trennrisse im Beton, Moosbildung). Standsicherheit und Verkehrssicherheit sind gegeben. Die Dauerhaftigkeit ist örtlich beeinträchtigt. Sanierungsmaßnahmen sind mittelfristig einzuplanen (Beobachtungsstatus).
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="w-full md:w-32 bg-orange-400 text-white font-mono font-bold text-center py-3 rounded-lg flex flex-col justify-center items-center shrink-0">
                  <span className="text-2xl">2.5 - 2.9</span>
                  <span className="text-xs uppercase font-bold tracking-wider">Ausreichend</span>
                </div>
                <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/15 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-main font-semibold leading-relaxed">
                    Größere Mängel im Einzelnen oder erhebliche Häufung kleinerer Schäden (z.B. tiefe carbonatisierte Risse, beginnende großflächige Korrosion). Die Standsicherheit und Verkehrssicherheit sind kurzfristig gegeben, jedoch ist die Dauerhaftigkeit akut gefährdet. Rechtzeitige Planung der Sanierung geboten.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="w-full md:w-32 bg-orange-600 text-white font-mono font-bold text-center py-3 rounded-lg flex flex-col justify-center items-center shrink-0">
                  <span className="text-2xl">3.0 - 3.4</span>
                  <span className="text-xs uppercase font-bold tracking-wider">Mangelhaft</span>
                </div>
                <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/15 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-main font-semibold leading-relaxed">
                    Schwere Mängel beeinträchtigen das Bauteil (z.B. klaffende Risse & Abplatzungen an der Zugbewehrung, starker Querschnittsentzug an Elementen). Die Standsicherheit und/oder die Verkehrssicherheit sind erheblich beeinträchtigt. Eine zeitnahe Instandsetzung ist zwingend erforderlich.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="w-full md:w-32 bg-red-600 text-white font-mono font-bold text-center py-3 rounded-lg flex flex-col justify-center items-center shrink-0">
                  <span className="text-2xl">3.5 - 4.0</span>
                  <span className="text-xs uppercase font-bold tracking-wider">Ungenügend</span>
                </div>
                <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/15 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-main font-semibold leading-relaxed">
                    Kritischer Zustand! Sehr schwere Mängel gefährden die Standsicherheit (z.B. Versagen von Spanngliedern, akuter Bruchverdacht, herabfallende große Betonteile über Verkehrswegen). Die Standsicherheit ist nicht mehr rechnerisch nachgewiesen. Sofortige Sperrung oder Lastbeschränkung (z.B. Tonnagebegrenzung) ist unumgänglich.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Neu: Einzelnoten (0-4) und Bewertungsschema */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="font-bold text-lg text-text-main mb-4 flex items-center gap-2">
              <ClipboardCheck className="text-shiraz" size={22} />
              Mängel-Einzelnoten (0 - 4) &amp; Bewertungsschema nach RI-EBW-PRÜF / DIN 1076
            </h3>
            <p className="text-sm text-text-main/80 mb-6 leading-relaxed">
              Sowohl nach <strong>DIN 1076 (RI-EBW-PRÜF)</strong> als auch nach <strong>VDI 6200</strong> werden einzelne Schäden und Abweichungen an Bauteilen strukturiert erfasst. Dabei wird jeder Mangel bezüglich der drei Hauptkriterien <strong>Standsicherheit (S)</strong>, <strong>Verkehrssicherheit (V)</strong> und <strong>Dauerhaftigkeit (D)</strong> in eine Schadensklasse von <strong>0 bis 4 (Mängel-Einzelnote)</strong> eingestuft.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold font-mono text-xs">0</span>
                  <h4 className="font-extrabold text-emerald-800 text-xs">Unbedeutend</h4>
                </div>
                <p className="text-xs text-emerald-950/80 leading-relaxed">Kein oder nur ein vernachlässigbar kleiner Mangel. Keine Auswirkungen auf Standsicherheit, Verkehrssicherheit oder Dauerhaftigkeit.</p>
                <div className="text-xs text-emerald-700 italic mt-1.5 font-semibold">Maßnahme: Keine nötig.</div>
              </div>

              <div className="p-3.5 bg-lime-50 rounded-xl border border-lime-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-6 h-6 rounded-full bg-lime-500 text-text-main flex items-center justify-center font-bold font-mono text-xs">1</span>
                  <h4 className="font-extrabold text-lime-800 text-xs">Geringer Mangel</h4>
                </div>
                <p className="text-xs text-lime-900/80 leading-relaxed">Kleinerer, lokaler Mangel. Keine Beeinträchtigung von S oder V. Extrem langfristige, geringe Auswirkung auf D.</p>
                <div className="text-xs text-lime-700 italic mt-1.5 font-semibold">Maßnahme: Laufende Beobachtung.</div>
              </div>

              <div className="p-3.5 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-6 h-6 rounded-full bg-yellow-400 text-text-main flex items-center justify-center font-bold font-mono text-xs">2</span>
                  <h4 className="font-extrabold text-yellow-800 text-xs">Mäßiger Mangel</h4>
                </div>
                <p className="text-xs text-yellow-900/80 leading-relaxed">Deutlicher Mangel (z.B. flache Betonabplatzung, Flugrost). Keine Gefährdung für S/V, Dauerhaftigkeit D mittelfristig reduziert.</p>
                <div className="text-xs text-yellow-700 italic mt-1.5 font-semibold">Maßnahme: Mittelfristige Sanierung.</div>
              </div>

              <div className="p-3.5 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold font-mono text-xs">3</span>
                  <h4 className="font-extrabold text-orange-850 text-xs">Schwerer Mangel</h4>
                </div>
                <p className="text-xs text-orange-900/80 leading-relaxed">Schwerwiegender Mangel. S oder V sind spürbar eingeschränkt. D ist akut gefährdet. Handnahe statische Begutachtung ratsam.</p>
                <div className="text-xs text-orange-700 italic mt-1.5 font-semibold">Maßnahme: Kurzfristige Sanierung.</div>
              </div>

              <div className="p-3.5 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold font-mono text-xs">4</span>
                  <h4 className="font-extrabold text-red-800 text-xs">Sehr schwer</h4>
                </div>
                <p className="text-xs text-red-900/80 leading-relaxed">Sehr schwerer Mangel mit akutem Traglast- oder Sicherheitsverlust. Gefahr im Verzug. Standsicherheit rechnerisch nicht erfüllt.</p>
                <div className="text-xs text-red-700 italic mt-1.5 font-semibold">Maßnahme: Sofortmaßnahmen (Sperrung).</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-shiraz text-xs text-text-main/80 space-y-2 mt-4 leading-relaxed">
              <div className="font-bold text-shiraz flex items-center gap-1.5">
                <Sliders size={15} />
                Das Bewertungsschema zur Gesamtbauwerksnote
              </div>
              <p>
                Um aus den S-V-D Einzelnoten (0-4) die finale, stufenlose <strong>Gesamt-Zustandsnote (1,0 bis 4,0)</strong> für ein Bauwerk zu ermitteln, sieht die Richtlinie ein klares Verknüpfungsschema vor:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><strong>Maximalwert-Prinzip (Anker):</strong> Die Note basiert primär auf dem schlechtesten Einzelwert (S, V oder D) des kritischsten Bauteils. Hat ein tragendes Teil in Standsicherheit (S) die Einzelnote 3, verankert dies die Gesamtnote direkt im Bereich ab 3,0 (Mangelhaft).</li>
                <li><strong>Mängelakkumulation (Gewichtungsfaktor):</strong> Haben weitere Bauteile zusätzliche Mängel (z. B. zusätzliche Gehobene Mängel der Note 2 in Dauerhaftigkeit), addieren sich diese nach einem mathematischen Schlüssel auf. Jeder relevante Nebenmangel erhöht die Gesamtnote inkrementell (im Schnitt um <strong>+0,1 bis +0,2</strong>), bis die absolute Obergrenze von 4,0 erreicht ist.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB Content 2: VDI 6200 */}
      {activeTab === 'vdi6200' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-shiraz" size={28} />
              <h2 className="text-2xl font-bold text-text-main">Überprüfung nach VDI 6200</h2>
            </div>
            <p className="text-text-main/80 mb-6 text-sm leading-relaxed">
              Die Richtlinie <strong>VDI 6200 "Standsicherheit von Bauwerken - Regelmäßige Überprüfung"</strong> regelt im Hoch- und Industriebau (im Gegensatz zur DIN 1076 für Straßeninfrastruktur) die regelmäßige und methodische Prüfung der Standsicherheit. Sie dient Eigentümern zur Entlastung bei der zivilrechtlichen Verkehrssicherungspflicht nach § 823 BGB.
            </p>

            <h3 className="font-bold text-lg text-text-main mb-4">Prüfungsarten nach VDI 6200</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-shiraz mb-2">Begehung</h4>
                <p className="text-xs text-text-main/80 leading-relaxed">Regelmäßige Sichtkontrolle durch sachkundige Personen (z.B. eingewiesene Haustechniker, Eigentümer). Erkennen von offensichtlichen Mängeln, starken Rissen, großem Bewuchs, Feuchtpunkte oder Verformungen.</p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-shiraz mb-2">Inspektion</h4>
                <p className="text-xs text-text-main/80 leading-relaxed">Eingehende Sichtprüfung durch fachkundige Personen (z.B. Tragwerksplaner mit Berufserfahrung). Systematische Erfassung aller Bauteile, Protokollierung, ggf. vereinfachte Messungen des Rissfortschritts oder der Holznässe.</p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-shiraz mb-2">Eingehende Überprüfung</h4>
                <p className="text-xs text-text-main/80 leading-relaxed">Detaillierte, tiefgreifende Bauwerksuntersuchung durch besonders fachkundige Personen (z.B. staatlich anerkannte Sachverständige). Häufiger Einsatz zerstörungsfreier Prüfverfahren (ZfP), Endoskopie, Bauteilöffnungen oder rechnerischer Standsicherheitsnachweise.</p>
              </div>
            </div>

            <h4 className="font-bold text-md text-text-main mb-3 mt-6 border-t border-home-grau/30 pt-4">Matrix: Wer prüft wann, was, wie und warum?</h4>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-home-grau/10 text-text-main">
                  <tr>
                    <th className="px-4 py-2 border border-home-grau/30 rounded-tl-lg">Aspekt</th>
                    <th className="px-4 py-2 border border-home-grau/30">Begehung</th>
                    <th className="px-4 py-2 border border-home-grau/30">Inspektion</th>
                    <th className="px-4 py-2 border border-home-grau/30 rounded-tr-lg">Eingehende Überprüfung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main">
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold text-shiraz">Wer? (Qualifikation)</td>
                    <td className="px-4 py-3 border border-home-grau/30"><strong>Sachkundige Person:</strong> Eingewiesenes Personal, Hausmeister, Eigentümer. Keine formale Ingenieurausbildung nötig.</td>
                    <td className="px-4 py-3 border border-home-grau/30"><strong>Fachkundige Person:</strong> Bauingenieur/Architekt mit mind. 3 Jahren Berufserfahrung im konstruktiven Ingenieurbau.</td>
                    <td className="px-4 py-3 border border-home-grau/30"><strong>Besonders fachkundige Person:</strong> Prüfingenieur, Sachverständiger (z.B. VDI-Zertifikat) mit &gt;5 Jahren spezifischer Erfahrung.</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold text-shiraz">Wann? (Intervall)</td>
                    <td className="px-4 py-3 border border-home-grau/30">Oft jährlich oder halbjährlich (abhängig von Schadensfolgeklasse CC).</td>
                    <td className="px-4 py-3 border border-home-grau/30">Alle 2 bis 5 Jahre (z.B. CC2: alle 3 bis 5 Jahre).</td>
                    <td className="px-4 py-3 border border-home-grau/30">Alle 6 bis 15 Jahre (z.B. CC2: alle 12 bis 15 Jahre) oder anlassbezogen (nach auffälligen Inspektionen).</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold text-shiraz">Was? (Umfang)</td>
                    <td className="px-4 py-3 border border-home-grau/30">Offensichtliche Mängel, grobe Risse, Feuchtigkeitsschäden, extreme Verformungen, Bauteilbewuchs.</td>
                    <td className="px-4 py-3 border border-home-grau/30">Systematische und messtechnische Erfassung aller tragenden und sicherheitsrelevanten Bauteile, Kartierung von Rissbreiten und Rissfortschritt.</td>
                    <td className="px-4 py-3 border border-home-grau/30">Detaillierte Materialprüfung (Karbonatisierungstiefe, Chloridprofile, Festigkeit, Bewehrungsscan), Bauteilöffnungen und ggf. statische Nachrechnung.</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold text-shiraz">Wie? (Methode)</td>
                    <td className="px-4 py-3 border border-home-grau/30">Einfache Sichtprüfung vom begehbaren Boden aus (ohne technische Hilfsmittel).</td>
                    <td className="px-4 py-3 border border-home-grau/30">Handnahe Sichtprüfung mithilfe von Leitern, Arbeitsbühnen, einfachem Werkzeug (z.B. Klopfhammer, Risslineal).</td>
                    <td className="px-4 py-3 border border-home-grau/30">Zerstörungsfreie Prüfverfahren (ZfP), Endoskopie, Magnetinduktive Bewehrungsortung, Ultraschallprüfung, Bohrkernentnahmen.</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold text-shiraz">Warum? (Ziel)</td>
                    <td className="px-4 py-3 border border-home-grau/30">Früherkennung offensichtlicher akuter Gefahren zur Verkehrssicherung.</td>
                    <td className="px-4 py-3 border border-home-grau/30">Detaillierte Beurteilung der Standsicherheit und Dauerhaftigkeit, Ermittlung des Instandsetzungsbedarfs.</td>
                    <td className="px-4 py-3 border border-home-grau/30">Ermittlung tieferer Schadensursachen, Resttragfähigkeitsberechnung, finale Vorbereitung des Instandsetzungskonstrukts.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="font-bold text-lg text-text-main mb-4">Wichtige Bewertungs-Säulen (S, V, D) nach VDI 6200</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-shiraz text-white flex items-center justify-center font-bold">S</div>
                  <h4 className="font-bold text-text-main text-sm">Standsicherheit</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Tragfähigkeit und Verformungsverhalten der lasttragenden Struktur. Querschnittsschwächungen, Risse in den Zugzonen oder fehlgeschlagene Verbindungen an Statikelementen haben direkte Relevanz auf die Sicherheit vor Einsturz.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-bold">V</div>
                  <h4 className="font-bold text-text-main text-sm">Verkehrssicherheit / Gebrauchstauglichkeit</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  unmittelbare mechanische Gefahren für Nutzer und Unbefugte. Typische Klassiker sind akute herabfallende Betonteile (Betonabplatzung an Fassaden durch Frost/Rost), lose Brüstungsgeländer oder scharfkantige Treppenstufen.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">D</div>
                  <h4 className="font-bold text-text-main text-sm">Dauerhaftigkeit</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Fortschreitender Verschleiß und langfristiges Korrosions- oder Materialermüdungsrisiko. Ein feiner Carbonatisierungsriss im Beton gefährdet akut noch keine Standsicherheit, vernichtet aber ohne präventiven Schutz langfristig die Bewehrung.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="font-bold text-lg text-text-main mb-4">Schadensfolgeklassen (CC) nach DIN EN 1990</h3>
            <p className="text-sm text-text-main/80 mb-4">
              Die VDI 6200 koppelt die Inspektionsabstände direkt an die Schadensfolgeklassen (Consequence Classes, CC) nach DIN EN 1990.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-text-main mb-2 text-sm">CC1 / RC1 (Niedrige Folgen)</h4>
                <p className="text-text-main/80 mb-2 leading-relaxed">Geringes Risiko für Menschenleben. Kleine wirtschaftliche, umwelttechnische oder soziale Versagensfolgen.</p>
                <p className="text-text-main/60 italic">Beispiele: Landwirtschaftliche Lagerspeicher, unbeheizte Schuppen, Gewächshäuser.</p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 border-l-4 border-l-[#0284c7]">
                <h4 className="font-bold text-text-main mb-2 text-sm">CC2 / RC2 (Mittlere Folgen)</h4>
                <p className="text-text-main/80 mb-2 leading-relaxed">Mittleres Risiko für Menschenleben. Beträchtliche wirtschaftliche Schäden im Falle eines Bauteilversagens.</p>
                <p className="text-text-main/60 italic">Beispiele: Reguläre Wohn- und Bürogebäude, Standard-Industriehallen, Einkaufszentren unter mittlerer Größe.</p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 border-l-4 border-l-shiraz">
                <h4 className="font-bold text-text-main mb-2 text-sm">CC3 / RC3 (Hohe Folgen)</h4>
                <p className="text-text-main/80 mb-2 leading-relaxed">Extremes Risiko für Menschenleben. Enorme wirtschaftliche, gesellschaftliche oder umweltbezogene Folgeverluste.</p>
                <p className="text-text-main/60 italic">Beispiele: Große Sporttribünen, Krankenhäuser, Hochhäuser ab 60m, Bahnhöfe, Kernkraftwerke, große Schulen.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="font-bold text-lg text-text-main mb-4">Robustheitsklassen (RK) des Tragwerks nach VDI 6200</h3>
            <p className="text-sm text-text-main/80 mb-4">
              Neben den Versagensfolgen spielt die Tragwerkkonstruktion und ihre Unempfindlichkeit gegenüber unerwarteten Schädigungen (Robustheit) eine tragende Rolle bei der Definition der notwendigen Überwachungsabstände.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-6">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 border-t-4 border-t-red-550">
                <h4 className="font-bold text-text-main mb-2 text-sm">RK1 - Geringe Robustheit / Sensibel</h4>
                <p className="text-text-main/80 mb-2 leading-relaxed">Tragwerke ohne Redundanz. Ein begrenztes lokales Versagen eines einzelnen Bauteils (etwa eines Binders) führt unweigerlich zu einem fortschreitenden Versagen oder Kompletteinsturz.</p>
                <p className="text-text-main/60 italic">Beispiele: Holzbinder-Dachtragwerke mit Einfeldträgern, weitgespannte Hallendächer ohne Tragreserven.</p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 border-t-4 border-t-[#0284c7]">
                <h4 className="font-bold text-text-main mb-2 text-sm">RK2 - Mittlere Robustheit</h4>
                <p className="text-text-main/80 mb-2 leading-relaxed">Standardbauten mit normaler Redundanz. Ein lokales Versagen einzelner untergeordneter Tragelemente führt dank Lastumlagerung nicht direkt zum katastrophalen Einsturz.</p>
                <p className="text-text-main/60 italic">Beispiele: Geschossbauten in konventioneller Skelettbauweise, Mehrfeld-Rahmensysteme in Stahl oder Stahlbeton.</p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 border-t-4 border-t-emerald-600">
                <h4 className="font-bold text-text-main mb-2 text-sm">RK3 - Hohe Robustheit / Redundant</h4>
                <p className="text-text-main/80 mb-2 leading-relaxed">Tragwerke mit ausgeprägter statischer Redundanz und hoher Unempfindlichkeit gegenüber punktuellem Versagen. Zahlreiche alternative Lastpfade verhindern Verfall.</p>
                <p className="text-text-main/60 italic">Beispiele: Monolithisch verbundene Raumzellensysteme, räumlich dichte Tragwerksgitter, gekoppelte Wandscheiben.</p>
              </div>
            </div>

            <h4 className="font-bold text-md text-text-main mb-3">Verschneidungsmatrix: Ermittlung der Prüfklasse (PK 1 - PK 4)</h4>
            <p className="text-xs text-text-main/80 mb-4 leading-relaxed">
              Die Kombination der Schadensfolgeklasse (CC) und Robustheitsklasse (RK) steuert die Einordnung in eine der vier <strong>Prüfklassen (PK)</strong>. Höhere Prüfklassen erfordern deutlich kürzere Überwachungsabstände:
            </p>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#8c1d40]/10 text-text-main">
                  <tr>
                    <th className="px-4 py-2 border border-home-grau/30">Schadensfolgeklasse \ Robustheit</th>
                    <th className="px-4 py-2 border border-home-grau/30 font-bold text-emerald-600">RK3 (Erhöht robust)</th>
                    <th className="px-4 py-2 border border-home-grau/30 font-bold text-[#0284c7]">RK2 (Normal robust)</th>
                    <th className="px-4 py-2 border border-home-grau/30 font-bold text-red-500">RK1 (Gering robust)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main font-semibold">
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold">CC1 (Geringe Folgen)</td>
                    <td className="px-4 py-3 border border-home-grau/30 text-emerald-700 bg-emerald-50">PK 1 (Gering)</td>
                    <td className="px-4 py-3 border border-home-grau/30 text-emerald-700 bg-emerald-50">PK 1 (Gering)</td>
                    <td className="px-4 py-3 border border-home-grau/30 text-[#0284c7] bg-sky-50 font-medium">PK 2 (Mitte)</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold">CC2 (Mittlere Folgen)</td>
                    <td className="px-4 py-3 border border-home-grau/30 text-[#0284c7] bg-sky-50 font-medium">PK 2 (Mitte)</td>
                    <td className="px-4 py-3 border border-home-grau/30 text-orange-700 bg-orange-50 font-medium">PK 3 (Erhöht)</td>
                    <td className="px-4 py-3 border border-home-grau/30 text-red-700 bg-red-50 font-bold">PK 4 (Sehr hoch)</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold">CC3 (Hohe Folgen)</td>
                    <td className="px-4 py-3 border border-home-grau/30 text-orange-700 bg-orange-50 font-medium">PK 3 (Erhöht)</td>
                    <td className="px-4 py-3 border border-home-grau/30 text-red-700 bg-red-50 font-bold">PK 4 (Sehr hoch)</td>
                    <td className="px-4 py-3 border border-home-grau/30 text-red-700 bg-red-50 font-bold">PK 4 (Sehr hoch)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB Content 3: Schadensdatenbank */}
      {activeTab === 'datenbank' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardCheck className="text-shiraz" size={28} />
              <h2 className="text-2xl font-bold text-text-main">Typische Bauschäden & Schadensbilder</h2>
            </div>
            <p className="text-text-main/80 mb-6 text-sm leading-relaxed">
              Eine Übersicht häufig anzutreffender Schadensbilder an Tragwerkstrukturen aus Beton, Stahl, Holz und Mauerwerk mit deren Ursachen, bautechnischen Bewertungen und den dafür vorgesehenen Instandsetzungsmaßnahmen.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-home-grau" size={20} />
                <input
                  type="text"
                  placeholder="Schadensbilder durchsuchen..."
                  className="w-full pl-10 pr-4 py-2 border border-home-grau/30 rounded-lg text-sm text-text-main focus:outline-none focus:border-shiraz"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {SCHADEN_KATEGORIEN.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-shiraz text-white'
                        : 'bg-off-white text-text-main hover:bg-home-grau/20 border border-home-grau/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSchaeden.map(schaden => (
                <div key={schaden.id} className="border border-home-grau/30 rounded-xl p-5 hover:border-shiraz/50 transition-all bg-off-white shadow-xs">
                  <div className="flex justify-between items-start mb-3 border-b border-home-grau/10 pb-2">
                    <h3 className="font-extrabold text-base text-text-main">{schaden.titel}</h3>
                    <span className="text-xs font-bold uppercase tracking-wider text-shiraz bg-shiraz/10 border border-shiraz/15 px-2.5 py-0.5 rounded">
                      {SCHADEN_KATEGORIEN.find(c => c.id === schaden.kategorie)?.label}
                    </span>
                  </div>
                  <p className="text-xs text-text-main/80 mb-4 leading-relaxed">{schaden.beschreibung}</p>
                  
                  <div className="space-y-3.5 pt-2 border-t border-home-grau/30">
                    <div>
                      <div className="text-xs font-extrabold text-text-main/50 uppercase tracking-wider mb-1">Häufige Ursachen:</div>
                      <ul className="list-disc list-inside text-xs text-text-main/90 space-y-0.5">
                        {schaden.ursachen.map((u, i) => <li key={i}>{u}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-text-main/50 uppercase tracking-wider mb-1">Bewertung (VDI 6200 / DIN 1076):</div>
                      <p className="text-xs text-text-main">{schaden.bewertung}</p>
                    </div>
                    
                    {/* Maßnahmen / Instandsetzungsverfahren in deep black text as requested */}
                    <div className="bg-white p-3 rounded-lg border border-home-grau/15 mt-2 shadow-2xs">
                      <div className="text-xs font-extrabold text-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5 border-b border-home-grau/30 pb-1">
                        <Wrench size={12} className="text-shiraz" />
                        Instandsetzungsverfahren / Maßnahmen:
                      </div>
                      <ul className="list-disc pl-4 text-xs text-black font-semibold space-y-1.5 leading-relaxed">
                        {schaden.massnahmen.map((m, i) => (
                          <li key={i} className="text-black">
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
              {filteredSchaeden.length === 0 && (
                <div className="col-span-full text-center py-12 text-home-grau italic text-xs">
                  Keine typischen Bauschäden für diese Suchkriterien in der Wissensdatenbank gefunden.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB Content 4: Notenrechner */}
      {activeTab === 'rechner' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* VDI 6200 Zustandsnoten- & Schulnoten-Konverter */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Calculator className="text-shiraz" size={28} />
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Notenrechner &amp; Schulnoten-Konverter</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Interaktive Umrechnung der Bauwerksnote (VDI 6200 / DIN 1076) in das klassische Schulnotensystem (1–6)
          </p>
        </div>
              </div>

              <div className="flex border border-home-grau/30 rounded-lg p-1 bg-off-white">
                <button
                  onClick={() => setCalculatorTab('quick')}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    calculatorTab === 'quick'
                      ? 'bg-shiraz text-white shadow-sm'
                      : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Sliders size={14} />
                    Schnellkonverter
                  </div>
                </button>
                <button
                  onClick={() => setCalculatorTab('matrix')}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    calculatorTab === 'matrix'
                      ? 'bg-shiraz text-white shadow-sm'
                      : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <FileText size={14} />
                    S-V-D Einzelprüfung
                  </div>
                </button>
              </div>
            </div>

            {/* Dynamic calculation states & helper helper */}
            {(() => {
              const calculatedZustandsnote = Math.min(
                4.0,
                Math.max(1.0, Math.max(sScore, vScore, dScore) + additionalCount * 0.1)
              );
              const finalZustandsnote = Math.round(calculatedZustandsnote * 10) / 10;
              const currentZ = calculatorTab === 'quick' ? zustandsnoteInput : finalZustandsnote;

              // Linear scaling from [1.0, 4.0] Zustandsnote to [1.0, 6.0] Schulnote
              // Formula: N = 1.0 + (Z - 1.0) / 3 * 5
              const interpolatedSchulnote = Math.max(1.0, Math.min(6.0, Math.round((1.0 + ((currentZ - 1.0) / 3) * 5) * 10) / 10));

              const getSchulnoteInfo = (zn: number) => {
                if (zn >= 1.0 && zn <= 1.4) {
                  return {
                    grade: 1,
                    label: 'Sehr Gut',
                    color: 'bg-emerald-500 text-white',
                    borderCol: 'border-emerald-500',
                    textColor: 'text-emerald-700',
                    desc: 'Sehr guter Bauwerkszustand. Keine oder nur äußerst marginale Mängel erkennbar. Die Standsicherheit, Verkehrssicherheit und Dauerhaftigkeit sind vollumfänglich gegeben.',
                    action: 'Normale Überwachung gem. Regelintervall der VDI 6200 bzw. DIN 1076.'
                  };
                } else if (zn >= 1.5 && zn <= 1.9) {
                  return {
                    grade: 2,
                    label: 'Gut',
                    color: 'bg-[#84cc16] text-[#1a3804]',
                    borderCol: 'border-[#84cc16]',
                    textColor: 'text-lime-700',
                    desc: 'Guter Bauwerkszustand. Kleinere Verschleißerscheinungen oder oberflächliche Schäden, welche die Tragwirkung und allgemeine Stabilität nicht beeinflussen.',
                    action: 'Beobachtung im Rahmen regulärer Begehungen, Behebung bei turnusmäßiger Wartung.'
                  };
                } else if (zn >= 2.0 && zn <= 2.4) {
                  return {
                    grade: 3,
                    label: 'Befriedigend',
                    color: 'bg-yellow-400 text-text-main',
                    borderCol: 'border-yellow-400',
                    textColor: 'text-yellow-600',
                    desc: 'Befriedigender Bauwerkszustand. Mängel vorhanden, welche die Dauerhaftigkeit (D) beeinträchtigen können, aber die Standsicherheit (S) und Verkehrssicherheit (V) sind zurzeit gewährleistet.',
                    action: 'Instandsetzungsmaßnahmen mittelfristig einplanen, Schadensausbreitung beobachten.'
                  };
                } else if (zn >= 2.5 && zn <= 2.9) {
                  return {
                    grade: 4,
                    label: 'Ausreichend',
                    color: 'bg-orange-400 text-white',
                    borderCol: 'border-orange-400',
                    textColor: 'text-orange-600',
                    desc: 'Ausreichender Bauwerkszustand. Größere Mängel. Die Standsicherheit und Verkehrssicherheit sind kurzfristig gegeben, jedoch ist die Dauerhaftigkeit der Bauteile akut gefährdet.',
                    action: 'Planung von Instandsetzungen in naher Zukunft, engere Überwachungsabstände.'
                  };
                } else if (zn >= 3.0 && zn <= 3.4) {
                  return {
                    grade: 5,
                    label: 'Mangelhaft',
                    color: 'bg-orange-600 text-white',
                    borderCol: 'border-orange-600',
                    textColor: 'text-orange-700',
                    desc: 'Mangelhafter Bauwerkszustand. Deutliche Einschränkung der Standsicherheit (S) oder der Verkehrssicherheit (V).',
                    action: 'Feinere statisch-konstruktive Bauwerksuntersuchung sowie kurzfristige Instandsetzung anfordern.'
                  };
                } else {
                  return {
                    grade: 6,
                    label: 'Ungenügend',
                    color: 'bg-red-600 text-white',
                    borderCol: 'border-red-600',
                    textColor: 'text-red-600',
                    desc: 'Kritischer Zustand / Gefahr im Verzug. Akute Gefährdung der Standsicherheit oder Verkehrssicherheit des Gebäudes oder des öffentlichen Verkehrsraums.',
                    action: 'Sofortige Notmaßnahmen: Sperrung der betroffenen Bereiche, provisorische Abstützung, Sicherung lockerer Bauteile.'
                  };
                }
              };

              const noteInfo = getSchulnoteInfo(currentZ);

              // Preset options
              const loadPreset = (s: number, v: number, d: number, add: number) => {
                setSScore(s);
                setVScore(v);
                setDScore(d);
                setAdditionalCount(add);
              };

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* INPUT PANEL */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {calculatorTab === 'quick' ? (
                      <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-bold text-text-main flex items-center gap-1.5">
                            <Sliders size={16} className="text-shiraz" />
                            Manuelle Baustoff- / Bauwerksnote (Zustandsnote)
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 bg-shiraz/10 text-shiraz rounded-full">
                            DIN 1076 / VDI 6200
                          </span>
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-semibold text-text-main/60">1,0 (Sehr gut)</span>
                            <div className="text-3xl font-black text-shiraz">{formatDeZahl(currentZ, 1)}</div>
                            <span className="text-xs font-semibold text-text-main/60">4,0 (Ungenügend)</span>
                          </div>

                          <input
                            type="range"
                            min="1.0"
                            max="4.0"
                            step="0.1"
                            value={zustandsnoteInput}
                            onChange={(e) => setZustandsnoteInput(parseFloat(e.target.value))}
                            className="w-full h-2 rounded-lg cursor-pointer bg-slate-200 accent-shiraz"
                          />

                          <div className="grid grid-cols-4 gap-1 text-xs text-center text-text-main/50 font-semibold">
                            <div>1.0 (Optimal)</div>
                            <div>2.0 (Befriedigend)</div>
                            <div>3.0 (Kritisch)</div>
                            <div>4.0 (Gefahr!)</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-5">
                        <div className="flex justify-between items-center pb-2 border-b border-home-grau/10">
                          <span className="text-sm font-bold text-text-main flex items-center gap-1.5">
                            <FileText size={16} className="text-shiraz" />
                            S, V, D Einstufungs-Matrix (VDI)
                          </span>
                          <span className="text-xs font-bold text-text-main/60 bg-home-grau/10 px-2 py-0.5 rounded uppercase">
                            VDI Rechner
                          </span>
                        </div>

                        {/* S, V, D Radio Matrix */}
                        {[
                          {
                            key: 's',
                            label: 'S - Standsicherheit',
                            icon: 'S',
                            desc: 'Auswirkung auf Tragfähigkeit und Bauteileigengewicht.',
                            currVal: sScore,
                            setVal: setSScore
                          },
                          {
                            key: 'v',
                            label: 'V - Verkehrssicherheit bzw. Gebrauchstauglichkeit',
                            icon: 'V',
                            desc: 'Unmittelbare Gefahr für Nutzer durch herabfallende Teile o.ä.',
                            currVal: vScore,
                            setVal: setVScore
                          },
                          {
                            key: 'd',
                            label: 'D - Dauerhaftigkeit',
                            icon: 'D',
                            desc: 'Restnutzungsdauer- & Verschleißrisiko (z.B. Korrosion).',
                            currVal: dScore,
                            setVal: setDScore
                          }
                        ].map((row) => (
                          <div key={row.key} className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-xs font-bold text-text-main">{row.label}</span>
                                <p className="text-xs text-text-main/60 leading-tight">{row.desc}</p>
                              </div>
                              <span className="text-xs font-bold bg-shiraz text-white px-2 py-0.5 rounded">
                                Wert: {row.currVal}
                              </span>
                            </div>

                            <div className="grid grid-cols-4 gap-1.5">
                              {[1, 2, 3, 4].map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => row.setVal(v)}
                                  className={`py-1.5 px-1 rounded-md text-xs font-bold transition-all border ${
                                    row.currVal === v
                                      ? 'bg-shiraz/10 border-shiraz text-shiraz scale-102 font-black'
                                      : 'bg-white border-home-grau/25 text-text-main hover:bg-home-grau/5'
                                  }`}
                                >
                                  Stufe {v}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Additional Mängel count */}
                        <div className="pt-3 border-t border-home-grau/10 flex justify-between items-center">
                          <div>
                            <span className="text-xs font-bold text-text-main">Weitere Nebenmängel (+0.1 je Mangel)</span>
                            <p className="text-xs text-text-main/60 leading-tight">Geringfügige Fehler addieren sich auf</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={additionalCount <= 0}
                              onClick={() => setAdditionalCount(prev => prev - 1)}
                              className="w-7 h-7 bg-white border border-home-grau/30 rounded flex items-center justify-center text-text-main hover:bg-home-grau/5 disabled:opacity-40"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-text-main">{additionalCount}</span>
                            <button
                              type="button"
                              disabled={additionalCount >= 5}
                              onClick={() => setAdditionalCount(prev => prev + 1)}
                              className="w-7 h-7 bg-white border border-home-grau/30 rounded flex items-center justify-center text-text-main hover:bg-home-grau/5 disabled:opacity-40"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Quick Presets */}
                        <div className="pt-3 border-t border-home-grau/10">
                          <div className="text-xs font-bold uppercase text-text-main/50 mb-2">Prüfszenarien laden:</div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => loadPreset(1, 1, 1, 0)}
                              className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded hover:bg-emerald-100 transition-colors"
                            >
                              Neubau (Note 1,0)
                            </button>
                            <button
                              type="button"
                              onClick={() => loadPreset(1, 1, 2, 2)}
                              className="text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                            >
                              Normaler Verschleiß (Note 2,2)
                            </button>
                            <button
                              type="button"
                              onClick={() => loadPreset(2, 2, 3, 3)}
                              className="text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200 px-2 py-1 rounded hover:bg-yellow-100 transition-colors"
                            >
                              Sanierungsstau (Note 3,3)
                            </button>
                            <button
                              type="button"
                              onClick={() => loadPreset(4, 2, 4, 1)}
                              className="text-xs font-semibold bg-red-50 text-red-800 border border-red-200 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                            >
                              Gefahr im Verzug (Note 4,0)
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* EDUCATIONAL FORMULA GRAPHIC */}
                    <div className="p-4 rounded-xl bg-shiraz/5 border border-shiraz/10 text-xs text-text-main/85 space-y-1.5 leading-snug">
                      <div className="font-bold flex items-center gap-1 text-shiraz">
                        <Info size={14} />
                        Hintergrund &amp; Herkunft:
                      </div>
                      <p>
                        Im deutschen Bauingenieurwesen orientiert sich die VDI 6200- und die DIN 1076-Zustandsnote an den klassischen Schulnotenkategorien (6 Stufen). Zur exakten mathematischen Herleitung wird folgende lineare Skalierung verwendet:
                      </p>
                      <div className="bg-white/80 p-2 rounded-md font-mono text-center text-xs border border-home-grau/15 text-text-main my-2">
                        <span className="font-bold text-shiraz">Schulnote</span> = 1,0 + ( <span className="font-bold">Zustandsnote</span> - 1,0 ) / 3 * 5
                      </div>
                      <p className="text-xs text-text-main/70">
                        Dadurch wird die Bauwerks-Skala von [1,0; 4,0] perfekt auf das bewährte Notenspektrum von [1,0; 6,0] abgebildet (1 = Sehr gut, 6 = Ungenügend).
                      </p>
                    </div>
                  </div>

                  {/* OUTPUT DISPLAY */}
                  <div className="lg:col-span-5 flex flex-col justify-between border border-home-grau/30 rounded-xl bg-off-white p-5 space-y-5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Award size={18} className="text-shiraz" />
                        <span className="text-sm font-bold text-text-main">Berechnungs- &amp; Konverterergebnis</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-lg border border-home-grau/15 text-center shadow-xs">
                          <div className="text-xs font-bold text-text-main/50 uppercase tracking-wide font-sans">Bauwerksnote</div>
                          <div className="text-3xl font-black text-text-main mt-1 font-mono">{formatDeZahl(currentZ, 1)}</div>
                          <div className="text-xs font-semibold text-text-main/60 mt-1 uppercase">VDI 6200 / DIN 1076</div>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-home-grau/15 text-center shadow-xs">
                          <div className="text-xs font-bold text-text-main/50 uppercase tracking-wide font-sans">Schulnote (Äquiv.)</div>
                          <div className={`text-3xl font-black mt-1 font-mono text-shiraz`}>{formatDeZahl(interpolatedSchulnote, 1)}</div>
                          <div className="text-xs font-semibold text-text-main/60 mt-1 uppercase">Schulnotensystem</div>
                        </div>
                      </div>

                      {/* Verbal Classification school grade */}
                      <div className={`p-4 rounded-xl border-l-4 ${noteInfo.borderCol} bg-white space-y-2 shadow-xs`}>
                        <div className="flex justify-between items-center flex-wrap gap-1">
                          <div className="text-xs font-bold uppercase text-text-main/50">Wertung:</div>
                          <div className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${noteInfo.color}`}>
                            {noteInfo.label} (Kategorie {noteInfo.grade})
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-text-main leading-relaxed">
                            {noteInfo.desc}
                          </span>
                        </div>
                      </div>

                      {/* Concrete Engineering action line */}
                      <div className="p-3.5 bg-shiraz/5 rounded-xl border border-shiraz/10 space-y-1">
                        <div className="text-xs font-bold uppercase text-shiraz tracking-wider font-sans">Erforderliche Maßnahmen:</div>
                        <p className="text-xs text-text-main/90 leading-snug">{noteInfo.action}</p>
                      </div>

                      {/* RI-EBW-PRÜF SIBs-Eskalationsprotokoll */}
                      {(() => {
                        // Check KO-Criteria
                        const isKOSafety = sScore === 4;
                        const isKOTraffic = vScore === 4;
                        const zn = currentZ;

                        let stufe = 0;
                        let label = "Normalbetrieb";
                        let color = "bg-emerald-50/60 text-emerald-950 border-emerald-250";
                        let iconColor = "text-emerald-600";
                        let alertText = "Bauwerk befindet sich im ordnungsgemäßen Regelbetrieb. Keine sicherheitsrelevanten Abweichungen.";
                        let timeFrame = "Nächste Hauptprüfung gem. DIN 1076 in 6 Jahren.";
                        let protocol = [
                          "Regelmäßige einfache Sichtprüfungen durch den Baulastträger.",
                          "Regelmäßige Hauptprüfungen alle 6 Jahre durch Sachkundige nach DIN 1076.",
                          "Fortlaufende Datenpflege im bayerischen IT-System SIB-Bauwerke."
                        ];

                        if (isKOSafety || isKOTraffic || zn >= 3.5) {
                          stufe = 5;
                          label = "Stufe 5: Rote Alarmstufe (Gefahr im Verzug)";
                          color = "bg-red-50 text-red-950 border-red-500 ring-2 ring-red-200 animate-pulse";
                          iconColor = "text-red-600 animate-bounce";
                          alertText = isKOSafety 
                            ? "K.O.-KRITERIUM STANDSICHERHEIT ERREICHT! Akute Einsturzgefahr droht bei Standsicherheit = Stufe 4." 
                            : isKOTraffic 
                              ? "K.O.-KRITERIUM VERKEHRSSICHERHEIT ERREICHT! Akute Gefahr für Leib und Leben von Verkehrsteilnehmern durch herabfallende Teile."
                              : "Sehr kritischer Bauwerkszustand mit akuter Beeinträchtigung der Standsicherheit.";
                          timeFrame = "Sofortige Teil- oder Vollsperrung (binnen 3 Std.), bautechnische Notsicherungsmaßnahmen.";
                          protocol = [
                            "Sofortige Sperrung des Bauwerks oder intensive Lastbegrenzung (z.B. Tonnagebegrenzung).",
                            "Einleitung von Not-Abstützungen (Traggerüst / Hilfsunterstützungen).",
                            "Eskalationsmeldung an die Landesbaudirektion Bayern & Zentralstelle BMDV.",
                            "Konstruktiver Standsicherheitsnachweis durch staatlich anerkannten Prüfstatiker."
                          ];
                        } else if (zn >= 3.0 && zn < 3.5) {
                          stufe = 4;
                          label = "Stufe 4: Akute Gefährdung (Mangelhaft)";
                          color = "bg-orange-50 text-orange-950 border-orange-400";
                          iconColor = "text-orange-700";
                          alertText = "Deutliche Mängel an standsicherheitsrelevanten Tragelementen. Schnelles Handeln erforderlich.";
                          timeFrame = "Einfache Sonderprüfung nach DIN 1076 innerhalb von 3 bis 6 Monaten.";
                          protocol = [
                            "Detaillierte Sonderprüfung (z.B. Ultraschall- oder Endoskopiemessungen an Spanngliedern).",
                            "Aufstellung eines bautechnischen Instandsetzungsentwurfs nach RI-EBW-PRÜF.",
                            "Provisorische Sicherungsmaßnahmen (z.B. Abfangnetze gegen Betonabplatzungen).",
                            "Kürzung der turnusmäßigen Überwachungsintervalle um mindestens 50%."
                          ];
                        } else if (zn >= 2.5 && zn < 3.0) {
                          stufe = 3;
                          label = "Stufe 3: Erhöhte Priorität (Präventions-Eskalation)";
                          color = "bg-yellow-50 text-yellow-950 border-yellow-350";
                          iconColor = "text-yellow-700";
                          alertText = "Größere Mängel beeinträchtigen die Dauerhaftigkeit des Ingenieurbauwerks erheblich.";
                          timeFrame = "Sanierungsplanung und Bauvergabe innerhalb der nächsten 12 bis 18 Monate.";
                          protocol = [
                            "Objektbezogene baudynamische Schadensanalysen (ZfP-Prüfungen).",
                            "Aufnahme des Objekts in das mittelfristige Erhaltungsprogramm des Baulastträgers.",
                            "Installation temporärer bauphysikalischer Messwertaufnehmer (z.B. Riss-Monitoring)."
                          ];
                        } else if (zn >= 2.0 && zn < 2.5) {
                          stufe = 2;
                          label = "Stufe 2: Planerischer Beobachtungskreis";
                          color = "bg-lime-50/50 text-lime-950 border-lime-300";
                          iconColor = "text-lime-700";
                          alertText = "Mängel vorhanden, welche die Dauerhaftigkeit des Baustoff-Gefüges beeinträchtigen.";
                          timeFrame = "Instandsetzungsmaßnahmen mittelfristig einplanen (2 bis 5 Jahre).";
                          protocol = [
                            "Fortlaufende Erfassung und Vermessung der Rissfortschritte bei Begehungen.",
                            "Lokale Sanierungsmaßnahmen (z.B. Erneuerung von schadhaften Dehnfugen, Epoxidharz-Injektionen).",
                            "Dokumentation im IT-System SIB-Bauwerke."
                          ];
                        } else if (zn >= 1.5 && zn < 2.0) {
                          stufe = 1;
                          label = "Stufe 1: Frühe Verschleiß-Beobachtung";
                          color = "bg-emerald-50/30 text-emerald-950 border-emerald-150";
                          iconColor = "text-emerald-700";
                          alertText = "Geringfügige Verschleißmängel ohne unmittelbare statische Auswirkung am Bauteil.";
                          timeFrame = "Instandhaltung bei regulären Wartungszyklen.";
                          protocol = [
                            "Fotografische Erfassung auffälliger Abplatzungen oder Flecken zur Verlaufskontrolle.",
                            "Instandhaltung von Entwässerungspfaden und Reinigung der Brückenlager.",
                            "Verbleib im standardmäßigen DIN 1076 Prüfzyklus."
                          ];
                        }

                        return (
                          <div className={`p-4 rounded-xl border space-y-3 shadow-3xs transition-all ${color}`} id="ri-ebw-escalation-card">
                            <div className="flex justify-between items-center flex-wrap gap-2 border-b border-home-grau/10 pb-2">
                              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                <ShieldCheck size={11} className={iconColor} />
                                RI-EBW-PRÜF Eskalations-Logik
                              </span>
                              <span className="text-xs font-bold font-mono px-2 py-0.5 bg-black/10 rounded-full">
                                {label}
                              </span>
                            </div>
                            
                            <div className="space-y-1.5">
                              <p className="text-xs font-bold leading-snug">{alertText}</p>
                              
                              <div className="text-xs space-y-1">
                                <div className="font-semibold text-black/65 block">Rechtliche Frist &amp; Handlungsrahmen:</div>
                                <div className="bg-white/60 p-1.5 rounded text-black font-semibold border border-black/5">
                                  ⏱️ {timeFrame}
                                </div>
                              </div>
                              
                              <div className="space-y-1 text-xs pt-1">
                                <span className="font-bold text-black/60 uppercase block">Amtliches SIB-Überwachungsprotokoll:</span>
                                <ul className="space-y-1 list-none pl-0">
                                  {protocol.map((step, i) => (
                                    <li key={i} className="flex items-start gap-1.5 leading-snug">
                                      <span className="text-shiraz font-bold shrink-0 mt-0.5">▪</span>
                                      <span className="text-black/80 font-medium">{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* VISUAL SCALE OF SCHOOL GRADES */}
                    <div className="pt-4 border-t border-home-grau/10 space-y-2">
                      <div className="flex justify-between items-center text-xs text-text-main/60 font-bold">
                        <span>Sehr gut (1)</span>
                        <span>Befriedigend (3)</span>
                        <span>Ungenügend (6)</span>
                      </div>

                      {/* Custom progress marker along the scale */}
                      <div className="relative h-3 bg-home-grau/15 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-600 transition-all duration-300"
                          style={{ width: '100%' }}
                        />
                        {/* The indicator bar */}
                        <div
                          className="absolute top-0 bottom-0 w-2 bg-text-main border-2 border-white rounded-full transition-all duration-300 -translate-x-1/2"
                          style={{ left: `${((interpolatedSchulnote - 1.0) / 5.0) * 100}%` }}
                        />
                      </div>
                    </div>

                  </div>

                </div>
              );
            })()}
          </div>
        </div>
      )}

      <ModuleFooter 
        wikipedia={[
          { title: 'Bauwerksüberwachung', url: 'https://de.wikipedia.org/wiki/Bauwerks%C3%BCberwachung' },
          { title: 'Standsicherheit', url: 'https://de.wikipedia.org/wiki/Standsicherheit' }
        ]}
        regelwerke={[
          { title: 'DIN 1076 (Ingenieurbauwerke im Zuge von Straßen und Wegen - Überwachung und Prüfung)', url: 'https://www.beuth.de/' },
          { title: 'VDI 6200 (Standsicherheit von Bauwerken - Regelmäßige Überprüfung)', url: 'https://www.vdi.de/' },
          { title: 'RI-EBW-PRÜF (Richtlinie zur einheitlichen Erfassung, Bewertung und Aufzeichnung der Ergebnisse der Bauwerksprüfungen nach DIN 1076)', url: 'https://www.bmdv.bund.de/' },
          { title: 'DAfStb-Richtlinien zur Bauwerkserhaltung & Instandhaltung', url: 'https://www.dafstb.de/' }
        ]}
        literatur={[
          'Bundesministerium für Digitales und Verkehr (BMDV): SIB-Bauwerke Programmdokumentation',
          'VDI-Gesellschaft Bauen und Gebäudetechnik: VDI 6200 Blatt 1',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
            formel: 'Z_N = \\text{Basisnote} + \\sum \\Delta Z_i \\quad (1.0 \\le Z_N \\le 4.0)',
            erklaerung: 'Zustandsnotenermittlung ZN nach RI-EBW-PRÜF: Bewertung von Standsicherheit (S), Verkehrssicherheit (V) und Dauerhaftigkeit (D). Noten von 1.0 (sehr gut) bis 4.0 (ungenügend / sofortiger Handlungsbedarf).',
            quelle: 'RI-EBW-PRÜF / DIN 1076'
          },
          {
            formel: '\\beta = \\frac{\\mu_R - \\mu_S}{\\sqrt{\\sigma_R^2 + \\sigma_S^2}} \\ge \\beta_{\\text{target}} = 3.8 \\quad (P_f = \\Phi(-\\beta))',
            erklaerung: 'Zuverlässigkeitsindex beta für die Tragfähigkeit (ULS) nach DIN EN 1990 bei der rechnerischen Zustandsbewertung bestehender Tragwerke (Zielwert beta = 3.8 für 50 Jahre Bezugszeitraum).',
            quelle: 'DIN EN 1990 Anhang B'
          }
        ]}
      />
    </div>
  );
}
