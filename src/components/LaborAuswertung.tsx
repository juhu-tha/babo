import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { 
  Microscope, 
  Droplets, 
  Search, 
  Filter, 
  Activity, 
  ShieldAlert, 
  Check, 
  Info, 
  ChevronRight, 
  Compass, 
  Layers, 
  Clock, 
  Calculator, 
  BookOpen,
  Table,
  FileJson,
  Printer
} from 'lucide-react';
import { exportToCSV, exportToJSON, openPrintableReport } from '@/src/utils/labExportUtils';

interface MethodItem {
  verfahren: string;
  zielgroese: string;
  normen: string;
  zerstoerungsfrei: 'Ja' | 'Nein (Probe)' | 'Nein (Pulver)' | 'Nein (Bohrkern)' | 'Nein (Wasserprobe)' | 'Bedingt (Laserablation)';
}

export default function LaborAuswertung() {
  const [activeTab, setActiveTab] = useState<'bericht' | 'rechner' | 'kompass' | 'tabelle'>('bericht');
  
  // Section index for reading view
  const [selectedSection, setSelectedSection] = useState<number>(1);

  // Search & filter for methods matrix
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNdt, setFilterNdt] = useState<'all' | 'jdt' | 'notndt'>('all');

  // Calculator states: Isotopenhydrologie
  const [deltaD, setDeltaD] = useState<number>(-55.0);
  const [delta18O, setDelta18O] = useState<number>(-8.2);

  // Calculator states: Abwasser Tracer
  const [gadolinium, setGadolinium] = useState<'none' | 'elevated'>('none');
  const [mst, setMst] = useState<'none' | 'human' | 'animal'>('none');

  // Diagnostic Kompass selection
  const [selectedTopic, setSelectedTopic] = useState<string>('akr');

  // Isotope output calculations
  const isotopeResults = useMemo(() => {
    const dExzess = deltaD - 8 * delta18O;
    const expectedDeltaD_GMWL = 8 * delta18O + 10;
    
    let diagnosis = '';
    let description = '';
    let category: 'condensate' | 'meteoric' | 'evaporated' = 'meteoric';

    if (dExzess > 10) {
      category = 'condensate';
      diagnosis = 'Tauwasser- / Kondensat-Herkunft';
      description = `Erhöhter Deuterium-Exzess (d = ${formatDeZahl(dExzess, 1)} ‰ > 10 ‰). Das kann auf Kondensat aus der Raumluft hindeuten (z. B. an Wärmebrücken oder bei unzureichender Lüftung), ist aber kein Beweis: Die Einordnung ist nur im Vergleich mit Referenzproben (Leitungswasser, Niederschlag vor Ort) belastbar.`;
    } else if (dExzess < 5) {
      category = 'evaporated';
      diagnosis = 'Verdunstetes Oberflächenwasser';
      description = `Niedriger Deuterium-Exzess (d = ${formatDeZahl(dExzess, 1)} ‰) und Abweichung von der globalen meteorischen Wasserlinie (GMWL). Deutet auf stehendes Wasser hin, welches bereits über längere Zeit verdunstet ist. Typisch für flache Pfützen, stehendes Sickerwasser auf Decken oder Altleckagen.`;
    } else {
      category = 'meteoric';
      diagnosis = 'Meteorisches Wasser (Leitungswasser oder Niederschlag)';
      description = `Normaler Deuterium-Exzess (d = ${formatDeZahl(dExzess, 1)} ‰). Das Wasser liegt nahe der meteorischen Wasserlinie. Kann frischer Regenwasser-Eintrag oder ein herkömmlicher Leitungswasserschaden sein. Zur genaueren Trennung sind Referenzproben des örtlichen Leitungswassers und Niederschlags heranzuziehen.`;
    }

    return {
      dExzess,
      expectedDeltaD_GMWL,
      diagnosis,
      description,
      category
    };
  }, [deltaD, delta18O]);

  // Wastewater source diagnostics
  const tracerResults = useMemo(() => {
    let source = '';
    let iconColor = 'text-green-600 bg-green-50 border-green-200';
    let details = '';

    if (gadolinium === 'elevated' && mst === 'human') {
      source = 'Fäkalhaltiges kommunales Abwasser';
      iconColor = 'text-shiraz bg-shiraz/5 border-shiraz/20';
      details = 'Starker Doppelhinweis: Die Kombination aus anthropogenem Gadolinium (Rückstand von MRT-Kontrastmitteln) und humanspezifischen Bakterienmarkern (Bacteroidales-qPCR) spricht deutlich dafür, dass das Schadenswasser aus Abwasserleitungen stammt (z. B. Rohrbrüche unter der Bodenplatte, Rückstauschäden).';
    } else if (gadolinium === 'none' && mst === 'animal') {
      source = 'Tierische Kontamination / Oberflächenabfluss';
      iconColor = 'text-slate-700 bg-slate-100 border-slate-200';
      details = 'Nachweis von fäkalen Bakterienspuren tierischen Ursprungs ohne menschliche Medikamentenspuren. Deutet auf Belastung durch Wildtiere hin (z. B. Marderbefall im Dachstuhl, Taubenkot in Kehlen oder Sickerwasser im ungeschützten Erdreich), schließt jedoch einen Schaden an Abwasserleitungen des Hauses weitgehend aus.';
    } else if (gadolinium === 'elevated' && mst === 'none') {
      source = 'Kanalisations-Sickerwasser (stark verdünnt)';
      iconColor = 'text-shiraz bg-shiraz/5 border-shiraz/20';
      details = 'Anwesenheit des MRT-Kontrastmittels Gadolinium deutet auf Abwasserbeteiligung hin, während fäkale Bakteriengene unter der Nachweisgrenze liegen (z. B. durch natürliche Filtration im Boden bei weiter entfernten Rohrleitungsleckagen oder starke Desinfektion/Chlorierung).';
    } else if (gadolinium === 'none' && mst === 'human') {
      source = 'Frisches Grauwasser oder Fäkalieneintritt';
      iconColor = 'text-shiraz bg-shiraz/5 border-shiraz/20';
      details = 'Humane Bacteroidales-DNA nachgewiesen, aber kein Gadolinium. Kann auf Fäkalwasser ohne nennenswerte Mischung mit klinischen Abwässern hindeuten oder Grauwasser aus Waschmaschinen/Handwaschbecken.';
    } else {
      source = 'Reines Schadenswasser (Frei von Abwassereffekten)';
      iconColor = 'text-slate-900 bg-slate-100 border-slate-300';
      details = 'Weder Gadolinium noch fäkale DNA-Sequenzen nachweisbar. Das spricht für Leitungswasser (Frischwasserleck) oder unbelastetes Niederschlagswasser; eine Abwasserbeteiligung unterhalb der Nachweisgrenzen ist nicht ausgeschlossen.';
    }

    return { source, iconColor, details };
  }, [gadolinium, mst]);

  // Database of Methods (from Section 8)
  const verfahrensMatrix: MethodItem[] = [
    {
      verfahren: 'Isotopenanalyse (d-Exzess)',
      zielgroese: 'Hinweise auf Kondensat, Verdunstung oder meteorisches Wasser (Vergleich mit Referenzproben)',
      normen: 'Stand der Wissenschaft / Isotopenhydrologie',
      zerstoerungsfrei: 'Nein (Probe)'
    },
    {
      verfahren: 'Gadolinium-Check',
      zielgroese: 'Hinweis auf Abwasseranteil im Schadenswasser (anthropogener Tracer; Leitungswasser-Referenz nötig)',
      normen: 'ICP-MS Analytik / Stand der Spurenstoffvorgaben',
      zerstoerungsfrei: 'Nein (Wasserprobe)'
    },
    {
      verfahren: 'Phenolphthalein-Test',
      zielgroese: 'Karbonatisierungstiefe; grobe Abschätzung frischer vs. alter Risse',
      normen: 'DIN EN 14630',
      zerstoerungsfrei: 'Nein (Probe)'
    },
    {
      verfahren: 'Dünnschliffmikroskopie',
      zielgroese: 'Nachweis von AKR, Thaumasit-Bildung und mineralogische Analyse historischer Mörtel',
      normen: 'ASTM C856, DAfStb Alkali-Richtlinie',
      zerstoerungsfrei: 'Nein (Bohrkern)'
    },
    {
      verfahren: 'Thermogravimetrie (TGA)',
      zielgroese: 'Mörtelanalysen (Hydraulischer Bindemittelfaktor), Carbonatsubstanz, organische Zuschläge',
      normen: 'Fachliteratur Mörtelanalytik; vgl. DIN EN 196-2 (chemische Analyse)',
      zerstoerungsfrei: 'Nein (Pulver)'
    },
    {
      verfahren: 'GC-MS (Wischproben / Material)',
      zielgroese: 'Forensik von Fogging-Ablagerungen (Phthalate, SVOCs), PCB, PAK und Holzschutzmitteln',
      normen: 'VDI 4300 Blatt 1/2, VDI 4301',
      zerstoerungsfrei: 'Nein (Probe)'
    },
    {
      verfahren: 'REM / EDX',
      zielgroese: 'Asbestnachweis (kleinste Faserstrukturen < 3µm), Salzelementierung, Gefügezerfall',
      normen: 'VDI 3866 Blatt 5, ISO 14966',
      zerstoerungsfrei: 'Nein (Probe)'
    },
    {
      verfahren: 'Impakt-Echo-Verfahren',
      zielgroese: 'Zerstörungsfreie Dickenmessung, Ortung von Delaminationen und Kiesnestern',
      normen: 'ASTM C1383; DGZfP-Merkblätter (Fachausschuss ZfP im Bauwesen)',
      zerstoerungsfrei: 'Ja'
    },
    {
      verfahren: 'LIBS (Handheld Laser)',
      zielgroese: 'Mobiles Elementmapping vor Ort (z. B. Chloridgehalte, Schwefel, Zementmatrix)',
      normen: 'Fachliteratur (z. B. BAM); kein genormtes Verfahren',
      zerstoerungsfrei: 'Bedingt (Laserablation)'
    },
    {
      verfahren: 'DNA-Analytik (qPCR)',
      zielgroese: 'Microbial Source Tracking (Genotypisierung Fäkalien), Schimmelpilz-Artenidentifikation',
      normen: 'VDI 4300 Blatt 10 / Molekularbiologischer Standard',
      zerstoerungsfrei: 'Nein (Probe)'
    }
  ];

  // Filter logic for methods
  const filteredVerfahren = useMemo(() => {
    return verfahrensMatrix.filter(item => {
      const matchSearch = item.verfahren.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.zielgroese.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.normen.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterNdt === 'all') return matchSearch;
      if (filterNdt === 'jdt') {
        return matchSearch && (item.zerstoerungsfrei === 'Ja' || item.zerstoerungsfrei === 'Bedingt (Laserablation)');
      }
      if (filterNdt === 'notndt') {
        return matchSearch && item.zerstoerungsfrei.startsWith('Nein');
      }
      return matchSearch;
    });
  }, [searchQuery, filterNdt]);

  const reportSections = [
    {
      id: 1,
      title: "1. Einleitung",
      subtitle: "Der Wandel von der Inaugenscheinnahme zur forensischen Bauwerksdiagnostik",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Die Beurteilung von Gebäudeschäden hat sich in den letzten Dekaden von einer handwerklich-empirischen Praxis zu einer hochspezialisierten, naturwissenschaftlich fundierten Disziplin entwickelt. Während in der Vergangenheit die visuelle Inspektion und einfache haptische Prüfungen oft als hinreichend erachtet wurden, erfordern die zunehmende Komplexität moderner Verbundbaustoffe, die verschärften bauphysikalischen Anforderungen an die Gebäudehülle sowie die Notwendigkeit einer belastbaren Beweisführung in Haftungsfragen eine tiefgehende analytische Durchdringung der Schadensmechanismen.
          </p>
          <div className="bg-slate-50 border-l-4 border-shiraz p-4 rounded-r-xl">
            <h4 className="font-bold text-slate-800 text-sm mb-1">Causa Proxima</h4>
            <p className="text-sm text-slate-600">
              Gebäudeschäden manifestieren sich oft als das Endstadium schleichender physikalischer oder chemischer Prozesse, deren Ursprung tief im mikrostrukturellen Gefüge der Werkstoffe liegt. Feuchtigkeit ist dabei der zentrale Treiber, sei es als Transportmedium für schädliche Salze, als Reaktionspartner bei der Karbonatisierung oder als Auslöser für biologischen Befall. Die Herausforderung besteht darin, nicht nur das Symptom zu dokumentieren, sondern die <strong>Causa proxima</strong> – die unmittelbare Ursache – möglichst eindeutig zu identifizieren.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "2. Feuchtediagnostik",
      subtitle: "Isotopenhydrologie und physikalische Tracer-Methoden",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Die korrekte Identifikation der Feuchtequelle ist der kritischste Schritt in der Schadenssanierung, da Fehldiagnosen zu ineffektiven und kostspieligen Sackgassen führen.
          </p>
          <div className="relative overflow-hidden bg-gradient-to-r from-middle-blue/5 to-shiraz/5 p-5 rounded-2xl border border-middle-blue/10">
            <h4 className="font-bold text-text-main flex items-center gap-2 mb-2">
              <Droplets className="text-middle-blue shrink-0 animate-pulse" />
              Isotopenhydrologie: Der physikalische Fingerabdruck des Wassers
            </h4>
            <p className="text-sm text-slate-700 mb-3 leading-relaxed">
              Die Isotopenanalyse basiert auf der physikalischen Tatsache, dass Wassermoleküle in verschiedenen isotopischen Konfigurationen auftreten (<InlineMath math="^1H, ^2H, ^{16}O, ^{18}O" />) und stabilen Fraktionierungsgesetzen unterliegen.
            </p>
            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/50 mb-3 text-center">
              <div className="text-xs font-mono text-slate-500 uppercase font-bold">Globale Meteorische Wasserlinie (GMWL)</div>
              <div className="text-lg font-extrabold text-slate-850 font-mono py-1">
                <BlockMath math="\delta D = 8 \cdot \delta^{18}O + 10" />
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Kopplung des Wasserstoff- und Sauerstoff-Abweichungsverhältnisses vom Ozean-Standard VSMOW.</div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Deuterium-Exzess (<InlineMath math="d = \delta D - 8 \cdot \delta^{18}O" />):</strong> Verdunstung senkt den d-Wert typischerweise unter den Wert der GMWL (10 ‰). Für Kondenswasser werden in Fallstudien teils erhöhte d-Werte beschrieben. Belastbar wird die Aussage erst im Vergleich mit Referenzproben (Leitungswasser, Niederschlag, ggf. Raumluftfeuchte) – sie ist ein Indiz, kein Einzelbeweis für „Lüftungsverhalten vs. Baumangel“.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h5 className="font-bold text-slate-850 text-xs mb-1.5 uppercase tracking-wider text-middle-blue">Gadolinium-Check (MRT-Marker)</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anthropogenes Gadolinium (aus MRT-Kontrastmitteln) passiert Kläranlagen weitgehend unverändert und ist ein Hinweis auf Abwasser. Achtung: Wo Trinkwasser aus Uferfiltrat gewonnen wird, kann es auch im Leitungswasser vorkommen – daher immer eine Leitungswasser-Referenzprobe untersuchen.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h5 className="font-bold text-slate-850 text-xs mb-1.5 uppercase tracking-wider text-middle-blue">Microbial Source Tracking (qPCR)</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Genetische Identifizierung wirtspezifischer Darmbakterien (z. B. Bacteroidales) ermöglicht die Unterscheidung, ob Fäkalstoffe überwiegend menschlicher (Abwasser) oder tierischer (z. B. Marder, Tauben) Herkunft sind.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "3. Betonchemie",
      subtitle: "Karbonatisierung, Chloridkorrosion, AKR und Sulfatangriff",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Beton ist ein reaktives System, dessen mineralische Stabilität durch atmosphärische und wässrige Einflüsse tiefgreifend kompromittiert werden kann.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="text-xs font-bold text-shiraz uppercase tracking-wider mb-2">Karbonatisierung</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reaktion von Calciumhydroxid mit <InlineMath math="CO_2" /> senkt den alkalischen pH-Wert von ca. 12,5 auf unter 9, wodurch der Passivierungsschutz der Stahlbewehrung erlischt. Bestimmung erfolgt mittels Phenolphthalein-Farbumschlagsversuch an frischen Bruchflächen.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="text-xs font-bold text-shiraz uppercase tracking-wider mb-2">AKR "Betonkrebs"</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Die zerstörende Alkali-Kieselsäure-Reaktion entsteht durch alkalische Porenlösung mit reaktiver Kieselsäure (Gesteinszuschlag). Quellfähiges Alkalisilikatgel treibt das Gefüge von innen auf. Nachweis per Dünnschliffmikroskopie oder Uranylacetat-UV-Fluoreszenz.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="text-xs font-bold text-shiraz uppercase tracking-wider mb-2">Sulfatangriff</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eindringendes Sulfat treibt Ettringit aus (hoher Kristallisationsdruck) oder zerstört das C-S-H-Gel direkt unter Bildung von weichem, bindungslosem Thaumasit. Unterscheidung erfordert EDX/XRD zur Detektion der silikatischen Sulfatphase.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "4. Mineralogie & Mörtel",
      subtitle: "Feinstrukturanalytik, XRD, TGA und Asbest-Forensik",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Die mikrostrukturelle Zusammensetzung lässt sich nur oberhalb makroskopischer Skalen physikalisch-chemisch entschlüsseln.
          </p>
          <div className="space-y-3">
            <div className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <Layers className="text-indigo-600 shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-xs text-slate-800">Thermogravimetrische Analyse (TGA) & Historischer Mörtel:</strong>
                <p className="text-xs text-slate-600 mt-1">
                  Die Probe wird kontrolliert erhitzt (bis 1000 °C), während die kontinuierliche Präzisionswaage Massenverluste misst. Durch gezieltes Entweichen von Hydratwasser und Carbonat-<InlineMath math="CO_2" /> lassen sich Bindemittelart und -anteile abschätzen – wichtig für die Denkmalpflege und die Auswahl verträglicher Reparaturmörtel.
                </p>
              </div>
            </div>
            <div className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <Microscope className="text-indigo-600 shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-xs text-slate-800">Rasterelektronenmikroskopie (REM/EDX) & Asbest:</strong>
                <p className="text-xs text-slate-600 mt-1">
                  Standardverfahren nach VDI 3866 Blatt 5 für Asbest in Putzen, Spachtelmassen oder Fliesenklebern. EDX-Punktanalysen bestimmen die Elementzusammensetzung und unterscheiden Chrysotil- oder Amphibolfasern von anderen Fasern (z. B. Glas- oder Zellulosefasern) und nadeligen Gipskristallen.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "5. Schadstoff-Forensik",
      subtitle: "Innenraumbelastungen, Fogging und Brandrückstandsanalytik",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Gebäudeschäden wirken sich oft nicht nur auf die Tragstruktur aus, sondern belasten die Gesundheit der Bewohner durch toxische Auswaschungen und Emissionen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-800 border-b border-rose-200 pb-1 flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-rose-600" />
                "Fogging" (Black Magic Dust)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Plötzliche Schwarzstaubablagerungen auf Wandfarben und Heizkörpern resultieren aus schwerflüchtigen organischen Verbindungen (SVOC), primär Weichmachern (Phthalaten), die als Klebefilm wirken. Gaschromatographie mit Massenspektrometrie (GC-MS) hilft, SVOC-Ablagerungen von Ruß (Kerzen, Tabakrauch) abzugrenzen.
              </p>
            </div>
            <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-800 border-b border-rose-200 pb-1 flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-rose-600" />
                Dauerelastische Fugenmassen (PCB & PAK)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                In Bauten der 1950er bis 1970er Jahre können Fugenmassen PCB (und teils PAK) enthalten. Die molekulare Forensik per GC-MS ist unerlässlich, um Primärquellen von nachträglich kontaminierten Sekundärquellen (Wandputz, Möbel) abzugrenzen und den Sanierungsplan zu definieren.
              </p>
            </div>
            <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-800 border-b border-rose-200 pb-1 flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-rose-600" />
                Holzschutzmittel (PCP, Lindan)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Altholzbelastungen in historischen Dachstühlen erfordern präzise GC-MS/ECD Analysen zum Schutz von Zimmerern und zur korrekten umweltgerechten Schadstoff-Deklaration gemäß Altholzverordnung Klasse A IV.
              </p>
            </div>
            <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-800 border-b border-rose-200 pb-1 flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-rose-600" />
                PCDD/F (Dioxine & Furane) nach Bränden
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bei Kabelbränden aus PVC synthetisieren sich Dioxine und Furane im Rußfilm. Wischproben und Analysen nach der Richtlinie zur Brandschadensanierung (VdS 2357) bilden die Grundlage für die Entscheidung über Reinigung, Sanierung oder Rückbau.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "6. Forensische Datierung",
      subtitle: "Die zeitliche Einordnung von Schäden für Versicherungen",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Die Frage, <em>wann</em> ein Schaden entstanden ist (z. B. vor oder nach Versicherungswechsel, Starkregen-Ereignis), entscheidet über die finanzielle Deckungspflicht.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-850 text-xs">
                <Clock className="text-slate-500" size={16} /> Rissalterbestimmung per Karbonatisierung
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bruchflächen frisch gerissenen Betons sind hochalkalisch. Erst im Laufe der Jahre dringt atmosphärisches Kohlendioxid in den Rissspalt ein und senkt pH-Wert-Grenzen ab. Der Farbumschlagstest an Rissflanken gibt grobe Hinweise, ob ein Riss erst kürzlich entstanden oder schon älter ist; die Karbonatisierung im Riss hängt stark von Rissbreite und Feuchte ab.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-850 text-xs">
                <Compass className="text-slate-500" size={16} /> Forensische Palynologie (Pollenanalyse)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ergänzendes Verfahren zur Feuchtedatierung. Angetrocknete Ablagerungen eines Wasserschadens können die zur Zeit des Wassereintritts fliegenden Pollen enthalten. Das Pollenspektrum (z. B. hohe Anteile von Birkenpollen) kann Hinweise auf die Jahreszeit des Eintritts geben.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "7. Zukunftstrends & ZfP",
      subtitle: "LIBS Handhelds, Sensor Fusion und Künstliche Intelligenz",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Die Kombination aus Mobilität und digitaler Verknüpfung verändert die Bauwerksdiagnostik vor Ort.
          </p>
          <div className="bg-slate-550 text-slate-800 bg-slate-100 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <Layers className="text-shiraz" size={16} />
              LIBS (Laser-Induced Breakdown Spectroscopy)
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Tragbare Handspektrometer ermöglichen die sofortige Elementanalyse direkt auf der Baustelle mittels minimalst-invasiver Laserablation. In kurzer Zeit lassen sich Chlorid-Tiefenprofile (z. B. an Bohrkernschnittflächen) erstellen oder Salzbelastungen eingrenzen; für quantitative Werte ist eine Kalibrierung erforderlich.
            </p>
            <h4 className="font-bold text-sm flex items-center gap-2">
              <Activity className="text-shiraz" size={16} />
              Sensor Fusion & KI
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Forschungsansätze koppeln Kamera- und Thermografiedaten (z. B. per Drohne) mit Impakt-Echo- und Georadar-Messungen. Verfahren des maschinellen Lernens führen diese Datensätze zusammen, um Hohlstellen, Delaminationen oder Korrosionsbereiche zu lokalisieren – der Stand ist überwiegend Forschung.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white border border-home-grau/30 rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-[10px] font-mono uppercase bg-shiraz/10 text-shiraz border border-shiraz/20 rounded px-2 py-0.5 inline-block font-bold mb-1.5">
            Wissenschaftliche Analytik
          </div>
          <h2 className="text-xl font-bold font-sans text-slate-900 tracking-tight">
            Labor &amp; Schadensdiagnostik
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Forensische Baustoffanalysen, Isotopenhydrologie, Spurenstoffe und Schadstoffdetektion bei Gebäudeschäden
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('bericht')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bericht'
                ? 'bg-shiraz text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BookOpen size={13} /> Fachübersicht
          </button>
          <button
            onClick={() => setActiveTab('rechner')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rechner'
                ? 'bg-shiraz text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Calculator size={13} /> Isotopen- &amp; Wasser-Rechner
          </button>
          <button
            onClick={() => setActiveTab('kompass')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kompass'
                ? 'bg-shiraz text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Compass size={13} /> Schadens-Kompass
          </button>
          <button
            onClick={() => setActiveTab('tabelle')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tabelle'
                ? 'bg-shiraz text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Layers size={13} /> Verfahrensdatenbank
          </button>
        </div>
      </div>

      {/* --------------------- TAB 1: RESEARCH REPORT --------------------- */}
      {activeTab === 'bericht' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[500px]">
          {/* Index Sidebar list */}
          <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2 shadow-inner">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold px-1.5 mb-1">Berichtsgliederung</span>
            {reportSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`py-2 px-3 text-left text-xs font-semibold rounded-lg flex items-center justify-between border transition-all cursor-pointer ${
                  selectedSection === sec.id
                    ? 'bg-white border-shiraz/55 text-shiraz font-bold shadow-sm pl-4'
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-b-slate-100'
                }`}
              >
                <span>{sec.title}</span>
                <ChevronRight size={13} className={`transition-transform duration-200 ${selectedSection === sec.id ? 'translate-x-1 text-shiraz' : 'opacity-40'}`} />
              </button>
            ))}
            
            <div className="mt-auto pt-4 border-t border-slate-200">
              <div className="bg-slate-100/80 p-3 rounded-lg border border-slate-200 flex gap-2">
                <Info size={14} className="text-slate-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-normal">
                  Klicken Sie auf ein Kapitel, um die chemischen, physikalischen und mineralogischen Methoden der Fachübersicht abzurufen.
                </p>
              </div>
            </div>
          </div>

          {/* Reading Display Pane */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-150 pb-3">
                <h3 className="text-base font-bold text-slate-850 font-sans tracking-tight">
                  {reportSections[selectedSection - 1].title}
                </h3>
                <p className="text-xs text-slate-400 font-medium italic mt-0.5">
                  {reportSections[selectedSection - 1].subtitle}
                </p>
              </div>

              <div className="text-sm text-slate-700 font-sans leading-relaxed">
                {reportSections[selectedSection - 1].content}
              </div>
            </div>

            {/* Custom Interactive Quick-Alert Box */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Interaktiver Link</span>
                <p className="text-xs text-slate-600 font-semibold">Testen Sie die Methoden im virtuellen Isotopenrechner!</p>
              </div>
              <button
                onClick={() => setActiveTab('rechner')}
                className="px-3.5 py-1.5 bg-shiraz text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-shiraz-active transition-all cursor-pointer shadow-sm"
              >
                <Calculator size={13} /> Rechner ausführen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------- TAB 2: FORENSIC CALCULATORS --------------------- */}
      {activeTab === 'rechner' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-800">
          
          {/* Box 1: Isotopen-Exzess-Bestimmung */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <div className="p-1.5 bg-middle-blue/15 text-middle-blue rounded-lg">
                  <Droplets size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-850">Isotopen-Fingerabdruck (2.1)</h3>
                  <p className="text-[10px] text-slate-400">Verbindung von Wasserstoff (<InlineMath math="d" />-Exzess) und Sauerstoffisotopen</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Tragen Sie die gemessenen Delta-Abweichungsverhältnisse <InlineMath math="\delta\text{D}" /> und <InlineMath math="\delta^{18}\text{O}" /> des getroffenen Schadenswassers ein, um Hinweise auf die Herkunft (Kondensat vs. Regen/Leitungswasser) zu erhalten – stets im Vergleich mit Referenzproben.
              </p>

              {/* Slider for Oxygen-18 */}
              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600 flex items-center gap-1">Sauerstoff-Isotop (<InlineMath math="\delta^{18}\text{O}" />)</span>
                    <span className="font-mono font-bold bg-slate-100 px-1.5 rounded">{formatDeZahl(delta18O, 2)} ‰</span>
                  </div>
                  <input 
                    type="range" 
                    min="-20.0" 
                    max="0.0" 
                    step="0.1" 
                    value={delta18O}
                    onChange={(e) => setDelta18O(parseFloat(e.target.value))}
                    className="w-full accent-middle-blue"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>-20 ‰ (Schweres Abreichern)</span>
                    <span>0 ‰ (Ozean-Mittel)</span>
                  </div>
                </div>

                {/* Slider for Deuterium */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600 flex items-center gap-1">Wasserstoff-Isotop (<InlineMath math="\delta\text{D}" />)</span>
                    <span className="font-mono font-bold bg-slate-100 px-1.5 rounded">{formatDeZahl(deltaD, 1)} ‰</span>
                  </div>
                  <input 
                    type="range" 
                    min="-150.0" 
                    max="10.0" 
                    step="1" 
                    value={deltaD}
                    onChange={(e) => setDeltaD(parseInt(e.target.value))}
                    className="w-full accent-middle-blue"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>-150 ‰ (Stark verarmt)</span>
                    <span>10 ‰</span>
                  </div>
                </div>
              </div>

              {/* Formula & Evaluation UI */}
              <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1">Berechneter Deuterium-Exzess (<InlineMath math="d" />)</div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-xl font-black font-mono ${
                    isotopeResults.dExzess > 10 ? 'text-blue-700' :
                    isotopeResults.dExzess < 5 ? 'text-amber-700' : 'text-emerald-700'
                  }`}>
                    {formatDeZahl(isotopeResults.dExzess, 2)} ‰
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    (GMWL-Erwartung für dieselbe <InlineMath math="\delta^{18}\text{O}" /> wäre: {formatDeZahl(isotopeResults.expectedDeltaD_GMWL, 1)} ‰)
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnostic Output */}
            <div className={`mt-4 p-4 border rounded-xl animate-in zoom-in-95 duration-150 ${
              isotopeResults.category === 'condensate' ? 'bg-blue-50 border-blue-200 text-blue-900' :
              isotopeResults.category === 'evaporated' ? 'bg-amber-50 border-amber-200 text-amber-900' :
              'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex gap-2 items-start justify-between">
                <div className="flex gap-2 items-start">
                  <Check className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider">Ergebnis: {isotopeResults.diagnosis}</div>
                    <p className="text-xs leading-relaxed mt-1 opacity-90">{isotopeResults.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const html = `
                      <div class="header-bar">
                        <div>
                          <h1 class="header-title">Lehrsimulation – Isotopenrechner</h1>
                          <div class="header-sub">Übungsauswertung: Deuterium-Exzess (kein Prüfbericht, nicht gutachterlich verwendbar)</div>
                        </div>
                        <div>
                          <span class="badge badge-warning">Simulation</span>
                        </div>
                      </div>

                      <div class="metric-box">
                        <table style="margin:0">
                          <tr>
                            <th style="width:30%">Sauerstoff-Isotop &delta;<sup>18</sup>O:</th>
                            <td><strong>${formatDeZahl(delta18O, 2)} &permil;</strong> (VSMOW-Standard)</td>
                          </tr>
                          <tr>
                            <th>Wasserstoff-Isotop &delta;D:</th>
                            <td><strong>${formatDeZahl(deltaD, 1)} &permil;</strong></td>
                          </tr>
                          <tr>
                            <th>Berechneter d-Exzess:</th>
                            <td><strong style="color:#1e293b; font-size:16px;">${formatDeZahl(isotopeResults.dExzess, 2)} &permil;</strong></td>
                          </tr>
                          <tr>
                            <th>GMWL-Referenz:</th>
                            <td>${formatDeZahl(isotopeResults.expectedDeltaD_GMWL, 1)} &permil;</td>
                          </tr>
                        </table>
                      </div>

                      <h3 style="font-size:14px; margin-top:20px; color:#0f172a">Interpretation (Lehrbeispiel)</h3>
                      <table>
                        <tr>
                          <th style="width:25%">Klassifikation:</th>
                          <td><strong>${isotopeResults.diagnosis}</strong></td>
                        </tr>
                        <tr>
                          <th>Begründung:</th>
                          <td>${isotopeResults.description}</td>
                        </tr>
                      </table>
                    `;
                    openPrintableReport(html, `Isotopen_Diagnosebericht_${Date.now()}`);
                  }}
                  className="px-2 py-1 bg-white/80 hover:bg-white text-slate-800 text-[11px] font-bold rounded border border-slate-300 shadow-2xs flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Übungsauswertung drucken oder als PDF sichern"
                >
                  <Printer size={12} /> Drucken / PDF
                </button>
              </div>
            </div>

          </div>

          {/* Box 2: Fäkal- & Abwasser Tracer Finder */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <div className="p-1.5 bg-shiraz/15 text-shiraz rounded-lg">
                  <Microscope size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-850">Abwasser Tracer-Entscheider (2.2)</h3>
                  <p className="text-[10px] text-slate-400">Interaktive Korrelation molekularbiologischer und metallischer Marker</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Wenn Feuchtigkeit in Wänden oder Bodenplatten unklarer Herkunft ist, liefern diese beiden Marker (Gadolinium & qPCR) Hinweise auf Abwasser- bzw. Fäkalbeteiligung.
              </p>

              <div className="space-y-4 pt-1">
                {/* Gadolinium Select */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">Anthropogenes Gadolinium (Gd)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setGadolinium('none')}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        gadolinium === 'none'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Klinisch unauffällig
                    </button>
                    <button
                      onClick={() => setGadolinium('elevated')}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        gadolinium === 'elevated'
                          ? 'bg-rose-50 border-rose-300 text-rose-850 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Erhöht gemessen (Kontrastmittel)
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 italic block mt-1.5">
                    Hinweis auf Abwasseranteil; Vergleich mit einer Leitungswasser-Referenzprobe erforderlich.
                  </span>
                </div>

                {/* qPCR Bacteroidales Select */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block mb-2">Microbial Source qPCR (Wirts-Genotyp)</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setMst('none')}
                      className={`py-2 px-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                        mst === 'none'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Bakterienfrei
                    </button>
                    <button
                      onClick={() => setMst('human')}
                      className={`py-2 px-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                        mst === 'human'
                          ? 'bg-rose-50 border-rose-300 text-rose-850'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Humane Sequenzen
                    </button>
                    <button
                      onClick={() => setMst('animal')}
                      className={`py-2 px-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                        mst === 'animal'
                          ? 'bg-amber-50 border-amber-300 text-amber-850'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Tierische Sequenzen
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 italic block mt-1.5">
                    Genanalytische Differenzierung über wirtsspezifische Marker (z. B. HF183 für humane Bacteroides).
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnostic Output */}
            <div className={`mt-4 p-4 border rounded-xl animate-in zoom-in-95 duration-150 ${tracerResults.iconColor}`}>
              <div className="flex gap-2 items-start">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">Tracer-Status: {tracerResults.source}</div>
                  <p className="text-xs leading-relaxed mt-1 opacity-90">{tracerResults.details}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* --------------------- TAB 3: DIAGNOSTIC COMPASS --------------------- */}
      {activeTab === 'kompass' && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-slate-800 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Compass className="text-shiraz" size={20} />
            <div>
              <h3 className="font-bold text-base text-slate-850">Schadens- &amp; Materialanalyse-Kompass</h3>
              <p className="text-xs text-slate-500">Forensische Verfahrenszuweisung nach Schadensbildern des Berichts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Sidebar select buttons */}
            <div className="md:col-span-1.5 flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold px-1">Betreffende Bauteile</span>
              
              <button
                onClick={() => setSelectedTopic('akr')}
                className={`p-2.5 text-left text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedTopic === 'akr'
                    ? 'bg-white border-shiraz text-shiraz shadow-sm'
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                "Betonkrebs" (AKR / Opalflint)
              </button>

              <button
                onClick={() => setSelectedTopic('sulfat')}
                className={`p-2.5 text-left text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedTopic === 'sulfat'
                    ? 'bg-white border-shiraz text-shiraz shadow-sm'
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                Ettringit / Thaumasit (Sulfat)
              </button>

              <button
                onClick={() => setSelectedTopic('mörtel')}
                className={`p-2.5 text-left text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedTopic === 'mörtel'
                    ? 'bg-white border-shiraz text-shiraz shadow-sm'
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                Hist. Mörtel (TGA-Hydraulik)
              </button>

              <button
                onClick={() => setSelectedTopic('asbest')}
                className={`p-2.5 text-left text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedTopic === 'asbest'
                    ? 'bg-white border-shiraz text-shiraz shadow-sm'
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                Asbest (Fliesenkleber, Putze)
              </button>

              <button
                onClick={() => setSelectedTopic('toxine')}
                className={`p-2.5 text-left text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedTopic === 'toxine'
                    ? 'bg-white border-shiraz text-shiraz shadow-sm'
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                Fogging &amp; Weichmacher (Phthalate)
              </button>

              <button
                onClick={() => setSelectedTopic('fugen')}
                className={`p-2.5 text-left text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedTopic === 'fugen'
                    ? 'bg-white border-shiraz text-shiraz shadow-sm'
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                PCB &amp; PAK in elastischen Fugen
              </button>

              <button
                onClick={() => setSelectedTopic('pollen')}
                className={`p-2.5 text-left text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedTopic === 'pollen'
                    ? 'bg-white border-shiraz text-shiraz shadow-sm'
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                Schadensdatierung (Pollen)
              </button>
            </div>

            {/* Comprehensive Detail View */}
            <div className="md:col-span-2.5 bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              
              {selectedTopic === 'akr' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-sm text-slate-800">Alkali-Kieselsäure-Reaktion (AKR) / "Betonkrebs"</h4>
                    <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-700 px-1.5 rounded uppercase">Beton zerstörend</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ausgelöst durch Kontakt reaktiver Gesteinskörner (Kieselsäure wie Flint oder Opalsandstein) mit dem hochalkalischen Medium der Porenlösung. Bildet quellfähiges Gel, welches das Betongefüge zerreißt.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="font-bold block text-slate-700 mb-1">Untersuchungsmethode:</span>
                      <strong>Dünnschliffmikroskopie</strong> (25–30 µm Dicke) an Bohrkernen zur Schadgel-Kartierung unter polarisiertem Licht.
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="font-bold block text-slate-700 mb-1">Vor-Ort-Schnelltest:</span>
                      <strong>Uranylacetat-Fluoreszenz</strong>: Der Gelschnelltest fluoresziert gelb-grün unter UV-Licht-Ausleuchtung.
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Relevante Normen: DAfStb Alkali-Richtlinie / ASTM C856</div>
                </div>
              )}

              {selectedTopic === 'sulfat' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-sm text-slate-800">Sulfatangriff: Ettringit vs. Thaumasit</h4>
                    <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-700 px-1.5 rounded">Mikro-Schadensanalyse</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Exogener Sulfateintrag erzeugt zerstörenden Kristallisationsdruck durch späte Ettringitbildung. Bei Bauteiltemperaturen unter etwa 15 °C kann sich bei Anwesenheit von Carbonat <strong>Thaumasit</strong> bilden: Die C-S-H-Phasen werden zersetzt, der Zementstein wird zu einer weichen, breiigen Masse ohne Bindekraft.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="font-bold block text-slate-700 mb-1">Analytische Abgrenzung:</span>
                      Zur Abgrenzung von Ettringit wird Silicium in der sulfathaltigen Phase nachgewiesen, z. B. mit <strong>EDX</strong>-Elementmapping, ergänzt durch XRD.
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="font-bold block text-slate-700 mb-1">Herkunftsermittlung:</span>
                      <strong>Schwefel-Isotopenanalyse (<InlineMath math="\delta^{34}S" />)</strong> zur Klärung, ob die Quelle pyritisches Sedimentgestein oder Düngemitteleintritt ist.
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Relevante Normen: DIN EN ISO 10304 / Richtlinien Baustoffmikroskopie</div>
                </div>
              )}

              {selectedTopic === 'mörtel' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-sm text-slate-800">Historische Mörtel ("Reverse Engineering")</h4>
                    <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 px-1.5 rounded">Denkmalpflege</span>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed">
                    Bei historischen Bauten ist Portlandzementmörtel in der Regel ungeeignet: Er ist zu steif und kann bauschädliche Salze (Sulfate, Alkalien) eintragen. Daher wird das historische Bindemittel im Labor analysiert, um einen verträglichen Reparaturmörtel zu wählen.
                  </p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-slate-700 text-xs">
                    <span className="font-extrabold text-indigo-950 block mb-1">Thermogravimetrische Analyse (TGA) &amp; XRD:</span>
                    Eine Mörtelprobe wird kontrolliert bis 1000 °C erhitzt. Der gemessene Masseverlust durch die Abspaltung von chemisch gebundenem Wasser (Abbindung hydraulischer Phase, Gips, Ettringit) und die CO₂-Abspaltung aus Calcit bei 600–800 °C erlauben eine Abschätzung von Bindemittelart und Bindemittelanteil (Störgröße: kalkhaltige Gesteinskörnung).
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Relevante Regelwerke: Fachliteratur Mörtelanalytik; WTA-Merkblätter (z. B. 2-9 Sanierputzsysteme)</div>
                </div>
              )}

              {selectedTopic === 'asbest' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-sm text-slate-800">Mineralischer Asbestfaser-Nachweis</h4>
                    <span className="text-[10px] font-mono font-bold bg-red-50 text-red-700 px-1.5 rounded">Gesundheits-Schutz</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Versteckte asbesthaltige Klebemassen unter alten Fliesen, Putzschüttungen oder Brandschutzplatten stellen bei Rückbauarbeiten eine enorme Gesundheitsgefahr dar, da die feinen Fasern lungengängig sind (WHO-Fasern: Länge &gt; 5 µm, Durchmesser &lt; 3 µm, Länge/Durchmesser &gt; 3 : 1).
                  </p>
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-150 text-xs space-y-2">
                    <div className="font-bold text-slate-750">Goldstandard: Rasterelektronenmikroskopie (REM/EDX)</div>
                    <p className="text-slate-600 leading-relaxed">
                      Ermöglicht die Identifizierung von Fasern unter 3 Mikrometern Durchmesser. Die angeschlossene Punkt-Elementanalyse (EDX) unterscheidet Chrysotil und Amosit von Gipsnadeln oder Glasfasern.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Umfeldvorgabe: VDI 3866 Blatt 5 / LAGA M 23 Regelwerke</div>
                </div>
              )}

              {selectedTopic === 'toxine' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-sm text-slate-800">"Fogging" &amp; Phthalat-Ausgasungen (SVOC)</h4>
                    <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 px-1.5 rounded">Innenraumhygiene</span>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed">
                    Das plötzliche Phänomen von schwarzen, fettigen Schmierfilmen auf Decken und Wohnungsecken ("Black Magic Dust") sorgt oft für Mieterstreitigkeiten. Ursache sind meist schwerflüchtige Weichmacher (Phthalate im Weich-PVC aus Tapeten, Bodenbelägen) kombiniert mit Raumluftströmen und Feinstaub.
                  </p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-xs">
                    <span className="font-bold block text-indigo-950 mb-1">GC-MS Analyse (Gaschromatographie):</span>
                    Präzise chemische Trennung von Wischproben. Grenzt Weichmacher- und SVOC-Ablagerungen gegen gewöhnlichen Ruß (Kerzen, Tabakrauch) ab.
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Relevante Normen: VDI 4300 Blatt 1/2 / VDI 4301 / Innenraumvorgaben</div>
                </div>
              )}

              {selectedTopic === 'fugen' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-sm text-slate-800">PCB &amp; PAK in dauerelastischen Fugen</h4>
                    <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-700 px-1.5 rounded">Primär- vs. Sekundärquelle</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Polychlorierte Biphenyle (PCB) wurden bis in die 1970er Jahre als Weichmacher in dauerelastischen Fugenmassen eingesetzt (in Deutschland in offenen Anwendungen ab 1978 untersagt). Die Moleküle diffundieren schleichend über Jahrzehnte in angrenzende Bauteile (Beton, Farbanstriche, Mobiliar).
                  </p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-xs text-slate-700">
                    <span className="font-bold block text-slate-800 mb-1">Sanierungsforensik per GC-MS:</span>
                    Der Sanierungsumfang richtet sich nach der Abgrenzung von Primärquellen (Originalfuge mit teils &gt; 10.000 mg/kg PCB) zu sekundär kontaminierten Tragbauteilen (z.B. belasteter Umgebungsputz), um teure Staubablagerungen und Falschentsorgungen im Rückbau zu steuern.
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Relevante Regelwerke: PCB-Richtlinie der Länder / VDI 4300 Blatt 2</div>
                </div>
              )}

              {selectedTopic === 'pollen' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-sm text-slate-800">Forensische Palynologie &amp; Rissalter</h4>
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-1.5 rounded">Datierung</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Naturwissenschaftliche Verfahren können Indizien liefern, wann Feuchtigkeit eingetragen wurde – sie ersetzen aber keine Gesamtwürdigung durch einen Sachverständigen.
                  </p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-xs space-y-1 text-slate-700">
                    <div>
                      <strong>Pollenanalyse im Schadschlamm:</strong>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Angetrocknete Rückstände von Wasserschäden können die zur Zeit des Eintritts fliegenden Pollen enthalten. Die mikroskopische Bestimmung des Pollenspektrums (z. B. hoher Anteil von Birkenpollen) kann auf einen Eintritt während der Blütezeit hindeuten und mit Wetterdaten (Starkregen) abgeglichen werden.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Stand der Forschung (kein genormtes Verfahren)</div>
                </div>
              )}

              {/* Action Prompt */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 text-right">
                <span className="text-[10px] text-slate-400 font-mono italic">
                  Auswahl: {selectedTopic.toUpperCase()} Diagnostik-Modul aktiv
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --------------------- TAB 4: METHODS TABLE DATABASE --------------------- */}
      {activeTab === 'tabelle' && (
        <div className="space-y-4 text-slate-800">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Verfahren, Zielgröße, Normen durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-shiraz focus:border-shiraz"
              />
            </div>

            {/* Filter buttons & Exports */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 px-2 flex items-center gap-1">
                  <Filter size={11} /> ZfP / NDT:
                </span>
                <button
                  onClick={() => setFilterNdt('all')}
                  className={`px-2 py-1 text-[10px] font-bold rounded ${
                    filterNdt === 'all' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Alle
                </button>
                <button
                  onClick={() => setFilterNdt('jdt')}
                  className={`px-2 py-1 text-[10px] font-bold rounded ${
                    filterNdt === 'jdt' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Zerstörungsfrei
                </button>
                <button
                  onClick={() => setFilterNdt('notndt')}
                  className={`px-2 py-1 text-[10px] font-bold rounded ${
                    filterNdt === 'notndt' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Zerstörend
                </button>
              </div>

              {/* Export Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const headers = ['Verfahren', 'Zielgroesse', 'Normen', 'Zerstoerungsfrei'];
                    const rows = filteredVerfahren.map(v => [v.verfahren, v.zielgroese, v.normen, v.zerstoerungsfrei]);
                    exportToCSV('THA_Bauwerksdiagnostik_Methodenmatrix', headers, rows);
                  }}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                  title="Gefilterte Verfahrensmatrix als CSV exportieren"
                >
                  <Table size={13} className="text-emerald-700" /> CSV
                </button>
                <button
                  onClick={() => {
                    exportToJSON('THA_Bauwerksdiagnostik_Methodenmatrix', filteredVerfahren);
                  }}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                  title="Gefilterte Matrix als JSON exportieren"
                >
                  <FileJson size={13} className="text-blue-600" /> JSON
                </button>
              </div>
            </div>
          </div>

          {/* Tabular Output */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Verfahren</th>
                  <th className="py-3 px-4">Zielgröße / Anwendungsbereich</th>
                  <th className="py-3 px-4">Relevante Normen / Richtlinien</th>
                  <th className="py-3 px-4 text-center">Zerstörungsfrei? (NDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredVerfahren.length > 0 ? (
                  filteredVerfahren.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-850 font-sans">{item.verfahren}</td>
                      <td className="py-3 px-4 text-slate-600 text-slate-600 leading-normal">{item.zielgroese}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[10px]">{item.normen}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block border ${
                          item.zerstoerungsfrei === 'Ja'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : item.zerstoerungsfrei === 'Bedingt (Laserablation)'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-rose-50 border-rose-200 text-rose-700'
                        }`}>
                          {item.zerstoerungsfrei}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                      Keine passenden diagnostischen Verfahren gefunden. Passen Sie die Filter an.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
            <span>Verfahrensmatrix (Abschnitt 8)</span>
            <span>Angezeigte Einträge: {filteredVerfahren.length} / {verfahrensMatrix.length}</span>
          </div>
        </div>
      )}

      {/* --------------------- SECTION 10: CONCLUSIO / FAZIT BAR --------------------- */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/45 p-4.5 text-slate-800 space-y-2 mt-2">
        <h4 className="font-bold text-xs uppercase text-indigo-950 flex items-center gap-1.5 leading-none">
          <BookOpen size={14} className="text-indigo-600" />
          10. Fazit der Fachübersicht
        </h4>
        <p className="text-xs text-slate-650 leading-relaxed">
          Die moderne Bauwerksdiagnostik ist eine forensische Wissenschaft, die weit über das bloße Messen von Feuchtigkeit hinausgeht. Die Integration von Isotopen-Exzess-Bestimmung und Abwasser-Tracern (Gadolinium) liefert wichtige Indizien zur Unterscheidung von Kondensat, Leckagen und Fäkalwasser – belastbar im Zusammenspiel mit Referenzproben und weiteren Befunden. Verfahren wie TGA und Impakt-Echo erlauben den tiefen Blick in die chemische Geschichte und physikalische Integrität des Materials, während die Schadstoffanalytik gesundheitliche Risiken (Asbest, Fogging, Brandlasten) quantifiziert. Mit dem Einzug von KI, Sensor Fusion und LIBS steht die Branche vor einem Sprung in die digitale Echtzeit-Überwachung und hocheffiziente Vor-Ort-Diagnostik.
        </p>
      </div>

    </div>
  );
}
