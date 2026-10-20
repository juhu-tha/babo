import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ClipboardList, 
  Trees, 
  Shield, 
  TrendingUp, 
  FileText,
  Search,
  Filter,
  RotateCcw,
  CheckCheck,
  Zap,
  Printer,
  Sparkles,
  Info
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

interface ChecklistItem {
  id: string;
  task: string;
  description: string;
  ref: string;
  tolerance: string;
  status: 'critical' | 'mandatory' | 'recommended';
}

interface ChecklistSection {
  id: string;
  title: string;
  phase: string;
  description: string;
  icon: any;
  items: ChecklistItem[];
}

const INSTANDSETZUNG_CHECKLISTS: Record<string, ChecklistSection> = {
  planung: {
    id: 'planung',
    phase: 'Phase 1',
    title: '1. Voruntersuchung & SKP-Planungskonzept',
    description: 'Diagnostik, Nachweis der Standsicherheit und Festlegung der Instandsetzungsprinzipien.',
    icon: ShieldCheck,
    items: [
      {
        id: 'plan-1',
        task: 'Zertifizierten Sachkundigen Planer (SKP) bestellen',
        description: 'Bei standsicherheitsrelevanten Betoninstandsetzungen schreibt die TR Instandhaltung (DIBt / MVV TB) die Beauftragung eines nachgewiesen fachkundigen Planers zwingend vor.',
        ref: 'TR Instandhaltung Teil 1 / MVV TB',
        tolerance: 'Zertifikat nach Ausbildungsbeirat SKP / GUEP',
        status: 'critical'
      },
      {
        id: 'plan-2',
        task: 'Karbonatisierungstiefe mit Phenolphthalein messen',
        description: 'Bruchfläche am Bohrkern oder Meißelausbruch mit 1%iger alkoholischer Phenolphthalein-Lösung besprühen. Farbwechsel zu Violett zeigt unkarbonatisierten Beton (pH > 9,0).',
        ref: 'DIN EN 14630',
        tolerance: 'c_nom - d_k >= 10 mm Restdeckung',
        status: 'critical'
      },
      {
        id: 'plan-3',
        task: 'Chlorid-Tiefenstufenprofil im Labor ermitteln',
        description: 'Trockenbohrmehlentnahme in Tiefenstufen (0-10 mm, 10-20 mm, 20-30 mm etc.) und potentiometrische Titration des säurelöslichen Chlorids im Labor.',
        ref: 'DIN EN 14629 / DAfStb-Heft 510',
        tolerance: 'C_krit <= 0,50 M.-% / Zement (Normalbeton) bzw. 0,20 M.-% (Spannbeton)',
        status: 'critical'
      },
      {
        id: 'plan-4',
        task: 'Abreißfestigkeit des Altbetons prüfen',
        description: 'Haftzugprüfung an repräsentativen, vorbereiteten Stellen durchführen (Kernbohrung 50 mm Durchmesser).',
        ref: 'DIN EN 1542',
        tolerance: 'Mittelwert >= 1,5 N/mm²; kleinster Einzelwert >= 1,0 N/mm²',
        status: 'critical'
      },
      {
        id: 'plan-5',
        task: 'Statische Zwischenzustände & Abstützung nachweisen',
        description: 'Tragwerksplanerische Freigabe für den Bauteilquerschnitt unter Berücksichtigung des temporären Betonabtrags (HDW). Ggf. Einbau hydraulischer Schwerlastsprieße.',
        ref: 'DIN EN 1992-1-1 / DIN EN 1504-10',
        tolerance: 'Volle Lastabtragung im Zwischenzustand gesichert',
        status: 'critical'
      },
      {
        id: 'plan-6',
        task: 'Instandsetzungsprinzip festlegen (DIN EN 1504-9; früher Rili-SIB W, C, R, K)',
        description: 'Eindeutige Zuordnung des Konzepts zu den Prinzipien der DIN EN 1504-9 bzw. TR Instandhaltung (z.B. Prinzip R bei Carbonatisierung, Prinzip K/KKS bei Chloriden).',
        ref: 'DIN EN 1504-9 / TR Instandhaltung',
        tolerance: 'Eindeutige Dokumentation im Instandsetzungsplan',
        status: 'mandatory'
      }
    ]
  },
  untergrund: {
    id: 'untergrund',
    phase: 'Phase 2',
    title: '2. Untergrundvorbereitung & Bewehrungsentrostung',
    description: 'Vollständiger Schadensabtrag, Freilegung der Bewehrung und Verbundsicherung.',
    icon: Layers,
    items: [
      {
        id: 'ug-1',
        task: 'Geschädigten Beton mit HDW abtragen',
        description: 'Hochdruckwasserstrahlen mit 1.000 bis 2.000 bar bis zum gesunden Kernbeton. Keine Mikrorissbildung durch Meißelschläge im Restgefüge.',
        ref: 'ZTV-ING Teil 3 / TR Instandhaltung',
        tolerance: 'Vollständige Entfernung des karbonatisierten/chloridbelasteten Betons',
        status: 'critical'
      },
      {
        id: 'ug-2',
        task: 'Bewehrung rundum freilegen (Hinterstemmung)',
        description: 'Korrodierten Bewehrungsstahl soweit freilegen, dass der Reprofilierungsmörtel die Stäbe vollflächig umschließen kann.',
        ref: 'TR Instandhaltung / DIN EN 1504-10',
        tolerance: 'Mindestens 15 mm lichter Abstand hinter dem Bewehrungsstab',
        status: 'critical'
      },
      {
        id: 'ug-3',
        task: 'Bewehrungsstahl metallisch blank entrosten',
        description: 'Strahlen mit festen Strahlmitteln auf den normativen Reinheitsgrad. Zunder, Rostnarben und Chloridnester restlos entfernen.',
        ref: 'DIN EN ISO 8501-1 / ISO 12944-4',
        tolerance: 'Reinheitsgrad Sa 2 ½ (sauber, schattenfrei)',
        status: 'critical'
      },
      {
        id: 'ug-4',
        task: 'Aktiven Korrosionsschutz auf Bewehrung applizieren',
        description: 'Unmittelbar nach dem Strahlen (max. 2–4 Stunden, vor Einsetzen von Flugrost!) zementgebundene oder epoxidharzmodifizierte Schutzschicht in 2 Lagen auftragen.',
        ref: 'DIN EN 1504-7',
        tolerance: 'Lückenlose Schicht ohne Fehlstellen (min. 2x Auftrag)',
        status: 'critical'
      },
      {
        id: 'ug-5',
        task: 'Betonuntergrund vornässen (Mattfeuchte)',
        description: 'Mindestens 2 bis 4 Stunden vor dem Mörtelauftrag intensiv wässern. Unmittelbar vor der Applikation darf die Oberfläche mattfeucht sein, jedoch kein stehendes Wasser aufweisen.',
        ref: 'DIN EN 1504-10 / ZTV-ING',
        tolerance: 'Mattfeucht, keine Glanzstellen oder Wasserfilme',
        status: 'mandatory'
      }
    ]
  },
  moertel: {
    id: 'moertel',
    phase: 'Phase 3',
    title: '3. Mörtelapplikation & Reprofilierung (PCC/SPCC)',
    description: 'Fachgerechtes Mischen, Nass-in-Nass-Verarbeitung und Schwindriss-Vermeidung.',
    icon: Wrench,
    items: [
      {
        id: 'moe-1',
        task: 'Klimatische Einbaubedingungen prüfen',
        description: 'Luft- und Bauteiltemperatur sowie relative Feuchte messen. Keine Verarbeitung bei Frost, drohendem Regen oder starker direkter Sonneneinstrahlung.',
        ref: 'DIN EN 1504-10 / Herstellerdatenblatt',
        tolerance: 'Bauteiltemperatur >= +5 °C bis +30 °C; Taupunktabstand >= 3 K',
        status: 'critical'
      },
      {
        id: 'moe-2',
        task: 'Haftbrücke frisch-in-frisch einarbeiten',
        description: 'Mineralische oder kunststoffmodifizierte Haftbrücke mit harter Bürste intensiv in den mattfeuchten Betonuntergrund einmassieren. Nicht antrocknen lassen!',
        ref: 'TR Instandhaltung / DIN EN 1504-3',
        tolerance: 'Nass-in-Nass-Auftrag des Reparaturmörtels (vor Filmverfilmung)',
        status: 'critical'
      },
      {
        id: 'moe-3',
        task: 'Exaktes Wasser-Mörtel-Verhältnis & Zwangsmischer',
        description: 'Mischwasser mit geeichtem Messbecher dosieren. Verwendung von Zwangsmischern oder Doppelquirlen; Mischzeit mind. 3 Minuten einhalten.',
        ref: 'DIN EN 1504-3 / DBV-Merkblatt',
        tolerance: 'Wasserzugabe exakt im Herstellergrenzbereich (+- 2 %)',
        status: 'mandatory'
      },
      {
        id: 'moe-4',
        task: 'Schichtdickenbegrenzung je Arbeitsgang einhalten',
        description: 'Maximale Schichtdicke je Mörtellage beachten, um Eigenspannungen und Absacken zu verhindern. Bei Mehlagenauftrag vorherige Lage aufrauen.',
        ref: 'DIN EN 1504-3 / ZTV-ING',
        tolerance: 'PCC meist max. 20-40 mm je Lage; SPCC bis 60 mm',
        status: 'mandatory'
      },
      {
        id: 'moe-5',
        task: 'Nachbehandlung sofort beginnen (Schwindschutz)',
        description: 'Unmittelbar nach dem Glätten/Abreiben vor Wind und Sonne schützen. Abdecken mit PE-Folien oder feuchten Jutetüchern für mindestens 5 bis 7 Tage.',
        ref: 'DIN EN 13670 / DIN EN 1504-10',
        tolerance: 'Mindestens 5 Tage feuchte Nachbehandlung (7 Tage bei Kälte)',
        status: 'critical'
      }
    ]
  },
  os_riss: {
    id: 'os_riss',
    phase: 'Phase 4',
    title: '4. Oberflächenschutz (OS) & Rissinjektion',
    description: 'Abdichtende Schutzschichten, Rissüberbrückung und Füllgüter nach DIN EN 1504-5.',
    icon: Shield,
    items: [
      {
        id: 'os-1',
        task: 'Restfeuchte des Betonuntergrunds messen',
        description: 'Vor dem Auftrag von Reaktionsharzbeschichtungen (OS 8, OS 11): Restfeuchte mit CM-Gerät (Calciumcarbid-Methode) oder Darrprobe bestimmen.',
        ref: 'DIN 18560-4 / DIN EN 1504-2',
        tolerance: 'Restfeuchte <= 4,0 CM-% (epoxidharztauglicher Untergrund)',
        status: 'critical'
      },
      {
        id: 'os-2',
        task: 'Taupunktabstand für Beschichtungen kontrollieren',
        description: 'Oberflächentemperatur mit Infrarotthermometer und Luftklima mit Hygrometer messen. Die Stahloberfläche/Betonoberfläche muss wärmer als der Taupunkt sein.',
        ref: 'DIN EN ISO 12944-7 / DIN EN 1504-10',
        tolerance: 'T_oberflaeche >= T_taupunkt + 3 Kelvin; rel. Feuchte <= 85 %',
        status: 'critical'
      },
      {
        id: 'os-3',
        task: 'Trockenschichtdicke (DFT) der OS-Schicht prüfen',
        description: 'Schichtdickenmessung (keilförmiger Schnitt oder Ultraschallmessung). Anwendung des 80/20-Kriteriums nach ISO 12944 bzw. DIN EN 1504-2.',
        ref: 'DIN EN ISO 2808 / DIN V 18026',
        tolerance: 'Kein Einzelwert < 80 % der Nenndicke; Mittelwert >= Sollwert',
        status: 'mandatory'
      },
      {
        id: 'os-4',
        task: 'Rissinjektion: Rissursache & Füllgut abstimmen',
        description: 'Ruhende Trennrisse mit Epoxidharz (Klasse F, kraftschlüssig), dynamische Risse mit Polyurethan (Klasse D, dehnfähig) verpressen.',
        ref: 'DIN EN 1504-5 / ZTV-ING',
        tolerance: 'f_h >= 3,0 MPa bei Kraftschluss; Bruchdehnung > 10 % bei Dehnfähigkeit',
        status: 'critical'
      },
      {
        id: 'os-5',
        task: 'Injektionsdruck begrenzen (Schutz vor Hydrofraktur)',
        description: 'Druck am Manometer der Injektionspumpe streng kontrollieren, um unkontrollierte Betonabplatzungen und neue Rissbildung zu verhindern.',
        ref: 'ZTV-ING Teil 3 / DIN EN 1504-5',
        tolerance: 'Druckbegrenzung nach Vorgabe des SKP (i. d. R. max. 10–20 bar bei Niederdruck, bauteilabhängig)',
        status: 'critical'
      },
      {
        id: 'os-6',
        task: 'Packerabstand nach Bauteildicke anordnen',
        description: 'Bohrpacker wechselseitig im 45°-Winkel setzen. Der Packerabstand richtet sich nach der Bauteildicke h.',
        ref: 'DIN EN 1504-5',
        tolerance: 'Packerabstand Delta_l = Bauteildicke h / 2 (+- 5 cm)',
        status: 'mandatory'
      }
    ]
  },
  kks_spezial: {
    id: 'kks_spezial',
    phase: 'Phase 5',
    title: '5. Kathodischer Korrosionsschutz (KKS) & Spezialverfahren',
    description: 'Elektrochemischer Schutz, CFK-Lamellen und Rissüberbrückungsnachweise.',
    icon: Zap,
    items: [
      {
        id: 'kks-1',
        task: 'Elektrische Durchgängigkeit der Bewehrung nachweisen',
        description: 'Widerstandsmessung zwischen allen freigelegten Bewehrungselementen vor Montage des KKS-Systems.',
        ref: 'DIN EN ISO 12696',
        tolerance: 'Durchgangswiderstand R < 1,0 Ohm zwischen beliebigen Stäben',
        status: 'critical'
      },
      {
        id: 'kks-2',
        task: 'Referenzelektroden an Korrosions-Hotspots platzieren',
        description: 'Einbau langlebiger Referenzelektroden (Mangandioxid MnO2 oder Ag/AgCl) im Bereich der höchsten Chloridkonzentrationen zur Dauerüberwachung.',
        ref: 'DIN EN ISO 12696 / DBV-Merkblatt KKS',
        tolerance: 'Mindestens 2 Referenzelektroden je Schutzbereich/Zone',
        status: 'mandatory'
      },
      {
        id: 'kks-3',
        task: '100-mV-Depolarisationskriterium nachweisen',
        description: 'Nach Abschalten des Fremdstroms muss die Potentialverschiebung über einen Zeitraum von 24 bis 72 Stunden gemessen werden.',
        ref: 'DIN EN ISO 12696',
        tolerance: 'Delta E_depol >= 100 mV nach 24 bis 72 Stunden',
        status: 'critical'
      },
      {
        id: 'kks-4',
        task: 'CFK-Lamellenverklebung: Betonoberflächenzugfestigkeit',
        description: 'Vor dem Aufkleben statisch tragender Carbonfaserlamellen muss der Betonuntergrund kugelgestrahlt und auf Haftzugfestigkeit geprüft werden.',
        ref: 'DIBt Zulassung CFK / DAfStb-Richtlinie',
        tolerance: 'Mittelwert f_ctm >= 1,5 N/mm²; kein Einzelwert < 1,2 N/mm²',
        status: 'critical'
      }
    ]
  },
  abnahme: {
    id: 'abnahme',
    phase: 'Phase 6',
    title: '6. Qualitätssicherung, SIVV-Dokumentation & Abnahme',
    description: 'Bautagebuch, Abreißversuche, Gewährleistung und Instandhaltungsverträge.',
    icon: ClipboardList,
    items: [
      {
        id: 'ab-1',
        task: 'Bauüberwachung durch fachkundiges Personal (z. B. SIVV-Schein) & lückenloses Bautagebuch',
        description: 'Kontinuierliche Dokumentation aller Chargennummern, Mischungsverhältnisse, Wetterdaten, Taupunktdifferenzen und Schichtdicken im Instandsetzungsprotokoll.',
        ref: 'TR Instandhaltung Teil 1 & 2 / DBV-SIVV',
        tolerance: 'Tägliche lückenlose Signatur durch fachkundiges Personal (z. B. SIVV-Fachkraft)',
        status: 'critical'
      },
      {
        id: 'ab-2',
        task: 'Haftzugprüfung am ausgehärteten Instandsetzungssystem',
        description: 'Bohrkerne bis 5 mm in den Altbeton einbohren und Prüfstempel aufkleben. Bruchbild analysieren (Bruch muss im Altbeton liegen, nicht in der Fuge!).',
        ref: 'DIN EN 1542 / TR Instandhaltung',
        tolerance: 'beta_hz >= 1,5 N/mm²; mindestens 80 % Betonbruch im Grundkörper',
        status: 'critical'
      },
      {
        id: 'ab-3',
        task: 'Ebenheit und Rutschhemmungsklasse prüfen',
        description: 'Bei befahrbaren Parkhausbeschichtungen (OS 8 / OS 11): Prüfung der Rutschhemmung (z.B. R11/R12 nach DIN 51130) und Verdrängungsraum (V4).',
        ref: 'DIN 51130 / ASR A1.5',
        tolerance: 'Einhaltung der geforderten R-Klasse (R11 / V4)',
        status: 'mandatory'
      },
      {
        id: 'ab-4',
        task: 'Inspektions- & Wartungsvertrag (DIN 31051) übergeben',
        description: 'Insbesondere bei rissüberbrückenden Beschichtungen und KKS-Systemen: Übergabe eines verbindlichen Wartungs- und Inspektionsplanes an den Bauherrn zur Absicherung der Gewährleistung.',
        ref: 'DIN 31051 / TR Instandhaltung',
        tolerance: 'Schriftlicher Wartungsplan mit jährlichem Inspektionsintervall',
        status: 'recommended'
      }
    ]
  }
};

export default function InstandsetzungChecklisten() {
  const [activeSubTab, setActiveSubTab] = useState<string>('planung');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'mandatory' | 'recommended'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentSection = INSTANDSETZUNG_CHECKLISTS[activeSubTab];

  // Calculate statistics across all sections
  const totalStats = useMemo(() => {
    let totalCount = 0;
    let completedCount = 0;
    let criticalCount = 0;
    let criticalCompleted = 0;

    Object.values(INSTANDSETZUNG_CHECKLISTS).forEach((sec) => {
      sec.items.forEach((it) => {
        totalCount++;
        if (checkedItems[it.id]) completedCount++;
        if (it.status === 'critical') {
          criticalCount++;
          if (checkedItems[it.id]) criticalCompleted++;
        }
      });
    });

    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { totalCount, completedCount, criticalCount, criticalCompleted, percent };
  }, [checkedItems]);

  // Filtered items in the current section
  const filteredItems = useMemo(() => {
    return currentSection.items.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSearch = searchQuery.trim() === '' || 
        item.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tolerance.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [currentSection, statusFilter, searchQuery]);

  // Section completion helper
  const getSectionProgress = (secId: string) => {
    const sec = INSTANDSETZUNG_CHECKLISTS[secId];
    if (!sec) return { done: 0, total: 0, percent: 0 };
    const done = sec.items.filter((it) => checkedItems[it.id]).length;
    const total = sec.items.length;
    const percent = Math.round((done / total) * 100);
    return { done, total, percent };
  };

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const markAllInSection = (secId: string) => {
    const sec = INSTANDSETZUNG_CHECKLISTS[secId];
    const newChecked = { ...checkedItems };
    sec.items.forEach((it) => {
      newChecked[it.id] = true;
    });
    setCheckedItems(newChecked);
  };

  const resetAllInSection = (secId: string) => {
    const sec = INSTANDSETZUNG_CHECKLISTS[secId];
    const newChecked = { ...checkedItems };
    sec.items.forEach((it) => {
      delete newChecked[it.id];
    });
    setCheckedItems(newChecked);
  };

  const resetEverything = () => {
    setCheckedItems({});
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-4 animate-in fade-in duration-300">
      
      {/* Header Info-Bereich */}
      <div className="bg-white text-text-main rounded-2xl p-6 border border-home-grau/30 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
              <ClipboardList className="text-shiraz" size={24} /> 
              Interaktive Instandsetzungs-Checklisten &amp; Qualitätssicherung
            </h2>
            <p className="text-xs text-text-main/70 mt-1">
              Baustellenprotokoll nach TR Instandhaltung (DIBt), DIN EN 1504-10, ZTV-ING und SIVV-Richtlinien
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border border-home-grau/30 text-xs font-semibold text-text-main hover:bg-off-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Aktuelle Checkliste drucken oder als PDF speichern"
            >
              <Printer size={14} /> Drucken / PDF
            </button>
            <button
              onClick={resetEverything}
              className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-700 bg-rose-50/50 hover:bg-rose-100 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Alle Markierungen zurücksetzen"
            >
              <RotateCcw size={14} /> Alles leeren
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 p-4 rounded-xl bg-off-white border border-home-grau/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 mb-2 font-medium">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Gesamtfortschritt Instandsetzung:</span>
              <span className="font-mono text-shiraz font-bold">
                {totalStats.completedCount} von {totalStats.totalCount} Prüfpunkten ({formatDeWert(totalStats.percent)} %)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span>Kritische Punkte: {formatDeWert(totalStats.criticalCompleted)} / {totalStats.criticalCount}</span>
            </div>
          </div>
          
          <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-home-grau/30">
            <div 
              className="h-full bg-gradient-to-r from-shiraz to-emerald-600 transition-all duration-300"
              style={{ width: `${totalStats.percent}%` }}
            ></div>
          </div>
        </div>

        {/* Sub-Tabs Selector (Phasen) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mt-4">
          {Object.values(INSTANDSETZUNG_CHECKLISTS).map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSubTab === sec.id;
            const prog = getSectionProgress(sec.id);

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
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {sec.phase}
                    </span>
                    <Icon size={14} className={isActive ? 'text-white' : 'text-shiraz'} />
                  </div>
                  <span className={`text-xs font-bold block line-clamp-1 ${isActive ? 'text-white' : 'text-text-main'}`}>
                    {sec.title.split('. ')[1]}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-[10px] font-mono">
                  <span className={isActive ? 'text-white/80' : 'text-slate-500'}>
                    {formatDeWert(prog.done)}/{formatDeWert(prog.total)} erledigt
                  </span>
                  <span className={`font-bold ${
                    prog.percent === 100 ? (isActive ? 'text-emerald-300' : 'text-emerald-600') : ''
                  }`}>
                    {formatDeWert(prog.percent)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Prüfpunkt, Norm oder Grenzwert durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-home-grau/30 focus:outline-hidden focus:border-shiraz bg-off-white/50"
            />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Löschen
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter size={12} /> Status:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-shiraz text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setStatusFilter('critical')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'critical' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            Nur Zwingend
          </button>
          <button
            onClick={() => setStatusFilter('mandatory')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'mandatory' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Normativ
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button
            onClick={() => markAllInSection(currentSection.id)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <CheckCheck size={13} /> Phase abhaken
          </button>
          <button
            onClick={() => resetAllInSection(currentSection.id)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw size={13} /> Zurücksetzen
          </button>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-home-grau/20 pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-shiraz bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {currentSection.phase}
              </span>
              <h3 className="font-bold text-base text-slate-900">{currentSection.title}</h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">{currentSection.description}</p>
          </div>
          
          <div className="text-xs font-mono bg-off-white px-3 py-1.5 rounded-lg border border-home-grau/30 text-slate-700 shrink-0">
            <strong>{currentSection.items.filter((it) => checkedItems[it.id]).length}</strong> von {currentSection.items.length} Punkten erfüllt
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-off-white rounded-xl border border-home-grau/20 text-xs">
            Keine Prüfpunkte für die gewählten Filterkriterien gefunden.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isDone = !!checkedItems[item.id];

              return (
                <div 
                  key={item.id} 
                  onClick={() => toggleItem(item.id)}
                  className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                    isDone 
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-xs' 
                      : 'bg-off-white border-home-grau/25 hover:border-shiraz/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {}} // handled by parent div onClick
                      className="mt-0.5 w-4 h-4 rounded text-shiraz focus:ring-shiraz cursor-pointer shrink-0 accent-shiraz"
                    />
                    
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'critical' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          item.status === 'mandatory' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {item.status === 'critical' ? 'Zwingend / Standsicherheit' :
                           item.status === 'mandatory' ? 'Regelwerkskonform' : 'Empfohlen'}
                        </span>
                        
                        <h4 className={`font-bold text-sm ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {item.task}
                        </h4>
                      </div>
                      
                      <p className={`leading-relaxed text-xs ${isDone ? 'text-slate-500' : 'text-slate-700'}`}>
                        {item.description}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px]">
                        <span className="text-slate-500">
                          <strong>Toleranz / Sollwert:</strong> <span className="font-mono text-slate-800 font-semibold">{item.tolerance}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex md:flex-col items-end justify-between md:justify-center gap-1 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                    <span className="text-[11px] font-mono bg-white px-2.5 py-1 rounded border border-home-grau/30 text-slate-700 whitespace-nowrap shadow-2xs">
                      {item.ref}
                    </span>
                    {isDone && (
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Erledigt
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Taupunktprüfung vor Beschichtungsarbeiten"
        zielGleichung="\theta_d = \frac{b \cdot \gamma}{a - \gamma}, \quad \gamma = \ln\varphi + \frac{a \cdot \theta}{b + \theta}"
        schritte={[
          { titel: 'Klima', erklaerung: 'Lufttemperatur 15 °C, relative Luftfeuchte 80 %; Magnus-Konstanten a = 17,62, b = 243,12 °C:', formel: '\\gamma = \\ln 0{,}80 + \\frac{17{,}62 \\cdot 15}{258{,}12} = 0{,}801' },
          { titel: 'Taupunkt', erklaerung: 'Einsetzen:', formel: '\\theta_d = \\frac{243{,}12 \\cdot 0{,}801}{17{,}62 - 0{,}801} = 11{,}6\\,\\text{°C}' },
          { titel: 'Freigabe', erklaerung: 'Oberflächentemperatur 13 °C; gefordert mindestens Taupunkt + 3 K:', formel: '13 < 11{,}6 + 3 = 14{,}6 \\Rightarrow \\text{nicht beschichten}' }
        ]}
        ergebnisHinweis="Messung und Dokumentation von Luft-, Oberflächentemperatur und Feuchte gehören in das Bautagebuch; bei Unterschreitung ist zu temperieren oder die Arbeit zu verschieben."
        normQuelle="DIN EN ISO 12944-7; TR Instandhaltung"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Auswertung von Haftzugprüfungen am Untergrund"
        zielGleichung="\bar{f} = \frac{1}{n}\sum f_i, \quad f_{min}"
        schritte={[
          { titel: 'Messwerte', erklaerung: 'Fünf Abreißversuche nach DIN EN 1542 in N/mm²: 1,8; 1,6; 1,2; 1,9; 1,7.', formel: '\\sum f_i = 8{,}2' },
          { titel: 'Mittelwert', erklaerung: 'Einsetzen:', formel: '\\bar{f} = 8{,}2 / 5 = 1{,}64\\,\\text{N/mm}^2 \\ge 1{,}5' },
          { titel: 'Kleinstwert', erklaerung: 'Vergleich mit dem Einzelwert:', formel: 'f_{min} = 1{,}2\\,\\text{N/mm}^2 \\ge 1{,}0 \\Rightarrow \\text{Untergrund geeignet}' }
        ]}
        ergebnisHinweis="Die erforderlichen Werte hängen vom Instandsetzungsprodukt und dessen Anwendungsbereich ab (Instandhaltungsplan des sachkundigen Planers, TR Instandhaltung Teil 2) – die Werte 1,5/1,0 N/mm² sind übliche Anhaltswerte."
        normQuelle="DIN EN 1542; TR Instandhaltung (DIBt)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="instandsetzung_checklisten" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 12 Schutz & Instandsetzung: Ausführungs- und Prüfkriterien, Quellen geprüft; fachliche Freigabe durch den Autor ausstehend)"
        weblinks={[
          { title: "DIBt - Technische Regel Instandhaltung von Betonbauwerken", url: "https://www.dibt.de" },
          { title: "Bundesgütegemeinschaft Instandsetzung von Betonbauwerken e.V. (BÜV)", url: "https://www.buev.de" },
          { title: "Deutscher Beton- und Bautechnik-Verein (DBV) - SIVV-Schein", url: "https://www.betonverein.de" }
        ]}
        wikipedia={[
          { title: "Betoninstandsetzung", url: "https://de.wikipedia.org/wiki/Betoninstandsetzung" },
          { title: "Bauüberwachung", url: "https://de.wikipedia.org/wiki/Bau%C3%BCberwachung" },
          { title: "Instandhaltung", url: "https://de.wikipedia.org/wiki/Instandhaltung" }
        ]}
        literatur={[
          'Raupach, M.; Orlowsky, J.: Erhaltung von Betonbauwerken. Wiesbaden: Vieweg+Teubner 2008',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Zilch, K.; Zehetmaier, G.: Bemessung im konstruktiven Betonbau (Springer Vieweg)'
        ]}
        regelwerke={[
          { title: 'TR Instandhaltung (DIBt Technische Regel Instandhaltung von Betonbauwerken Teil 1 und 2)', url: 'https://www.dibt.de/' },
          { title: 'DIN EN 1504-10 (Anwendung von Produkten und Systemen auf der Baustelle und Qualitätsüberwachung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1504-10' },
          { title: 'ZTV-ING Teil 3: Massivbau, Betoninstandsetzung (BASt)', url: 'https://www.bast.de/' },
          { title: 'DIN EN ISO 12696 (Kathodischer Korrosionsschutz von Stahl in Beton)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+12696' }
        ]}
        formeln={[
          {
            formel: '\\beta_{hz} \\ge 1{,}5\\,\\text{N/mm}^2 \\quad (\\text{Einzelwert} \\ge 1{,}0\\,\\text{N/mm}^2)',
            erklaerung: 'Übliche Anhaltswerte der Abreißfestigkeit des Betonuntergrundes (Prüfung nach DIN EN 1542) vor dem Auftrag von Mörteln bzw. Beschichtungen; maßgebend sind die Anforderungen im Instandhaltungsplan nach TR Instandhaltung.',
            quelle: 'DIN EN 1542 / TR Instandhaltung'
          },
          {
            formel: 'T_{\\text{Oberfläche}} \\ge T_{\\text{Taupunkt}} + 3\\,\\text{K}',
            erklaerung: 'Sicherheitsabstand zur Taupunkttemperatur zur Vermeidung von Betauung und Haftungsversagen bei Beschichtungsarbeiten.',
            quelle: 'DIN EN ISO 12944-7'
          }
        ]}
      />
    </div>
  );
}
