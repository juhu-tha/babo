import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import { 
  Layers, 
  Split, 
  Activity, 
  Check, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Hammer, 
  Droplet, 
  Wrench,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Calculator,
  ShieldCheck,
  FileText,
  LayoutGrid
} from 'lucide-react';

export default function BpAbdichtung() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation'>('allgemein');
  const [activeSubTab, setActiveSubTab] = useState<'material' | 'fugen' | 'risse' | 'berater'>('material');
  
  // States for interactive DIN 18533 waterproofing advisor
  const [waterLoad, setWaterLoad] = useState<string>('bodenfeuchte');
  const [roomRequirement, setRoomRequirement] = useState<string>('hochwertig');

  // States for interactive Joint Sealings (Fugenbänder & Injektionsschläuche)
  const [fbJointType, setFbJointType] = useState<'arbeitsfuge' | 'dehnungsfuge'>('arbeitsfuge');
  const [fbWaterPressure, setFbWaterPressure] = useState<number>(3); // in m Wassersäule
  const [fbSlabThickness, setFbSlabThickness] = useState<number>(30); // in cm
  const [fbMaxAggregate, setFbMaxAggregate] = useState<16 | 32>(32); // Größtkorn in mm
  
  const [isLength, setIsLength] = useState<number>(8); // Injektionsschlauch Länge in m
  const [isConCover, setIsConCover] = useState<number>(10); // Betonüberdeckung in cm
  const [isFasteningInterval, setIsFasteningInterval] = useState<number>(15); // Befestigungsabstand in cm
  const [isMedium, setIsMedium] = useState<'acrylgel' | 'pur_harz' | 'ep_harz'>('acrylgel');

  // Calculation of advisor recommendations
  const getAdvisorRecommendation = () => {
    let waterClass = '';
    let waterDesc = '';
    let systemTitle = '';
    let systemDesc = '';
    let products = [] as string[];
    let guidelines = [] as string[];
    let techSpecs = [] as { label: string; value: string }[];

    switch (waterLoad) {
      case 'bodenfeuchte':
        waterClass = 'W1.1-E';
        waterDesc = 'Bodenfeuchte und nichtstauendes Sickerwasser bei hochdurchlässigen Böden (z. B. Sand, Kies).';
        break;
      case 'stauend':
        waterClass = 'W2.1-E';
        waterDesc = 'Mäßige Einwirkung von außen drückendem Wasser (aufstauendes Sickerwasser auf tonigen Böden ohne Drainage).';
        break;
      case 'stauend_drain':
        waterClass = 'W1.2-E';
        waterDesc = 'Bodenfeuchte und nichtstauendes Sickerwasser bei wenig durchlässigen Böden mit funktionstüchtiger Drainage nach DIN 4095.';
        break;
      case 'drueckend_flach':
        waterClass = 'W2.1-E';
        waterDesc = 'Mäßige Einwirkung von außen drückendem Wasser (Grundwasserstand dauerhaft ≤ 3,0 m über der Fundamentsohle).';
        break;
      case 'drueckend_tief':
        waterClass = 'W2.2-E';
        waterDesc = 'Hohe Einwirkung von außen drückendem Wasser (Grundwasserstand dauerhaft > 3,0 m über der Fundamentsohle).';
        break;
      case 'spritzwasser':
        waterClass = 'W4-E';
        waterDesc = 'Spritzwasser am Wandsockel sowie Kapillarwasser in und unter Wänden.';
        break;
    }

    if (waterLoad === 'spritzwasser') {
      systemTitle = 'Flankenschutz & Sockelabdichtung (Fassadenübergang)';
      systemDesc = 'Robuster Schutz an erdberührten Wandsockeln gegen herabspritzendes Regenwasser, aufsteigende Feuchte und Tausalze im Winter.';
      products = [
        'Flexible mineralische Dichtungsschlämme (MDS) als rissüberbrückender Feuchteschutz',
        'Zweikomponentige flexible polymermodifizierte Dickbeschichtung (FPD) im erdberührten Übergang',
        'Kapillarsperren (Dichtungsschlämmen oder Bitumenbahnen) unter der ersten Steinlage'
      ];
      techSpecs = [
        { label: 'Mindesthöhe', value: 'Min. 30 cm über geplanter Geländeoberkante (GOK)' },
        { label: 'Mindestschichtdicke (MDS)', value: 'Trockenschichtdicke ≥ 2,0 mm' },
        { label: 'Arbeitsgänge', value: 'Zweilagiger Auftrag mit Bürste, Schlämmkelle oder Spritzgerät' }
      ];
      guidelines = [
        'DIN 18533 Teil 1: Anforderungen an den Sockelbereich',
        'WTA-Merkblatt 4-6: Nachträgliche Abdichtung erdberührter Bauteile'
      ];
    } else if (waterLoad === 'stauend' || waterLoad === 'drueckend_flach' || waterLoad === 'drueckend_tief') {
      if (roomRequirement === 'hochwertig') {
        systemTitle = 'K-Wanne / Systemergänzung (WU-Beton + Frischbetonverbundfolie - FBV)';
        systemDesc = 'Hinterlaufstabile Frischbetonverbundfolie (FBV) auf einer dichten "Weißen Wanne" (Stahlbetontragwerk). Da WU-Beton Wasserdampfdiffusion im ständigen Kontakt mit drückendem Wasser nicht vollständig stoppen kann, sperrt das FBV-System jegliche Feuchtetransporte für sensible Wohn- und Arbeitsräume absolut ab.';
        products = [
          'Vlies- oder sandbeschichtete FPO-Dichtungsbahnen (Frischbetonverbundfolie)',
          'Hinterlaufschutz-Klebekomponenten (Zementleim-Verkrallung)',
          'System-Dichtbänder für Bauteilecken und Anschlüsse',
          'Wasserundurchlässiger Beton (WU-Beton) als tragendes, abdichtendes Primärtragwerk'
        ];
        techSpecs = [
          { label: 'Rissbreitenbegrenzung wk', value: 'Begrenzung auf ≤ 0,15 mm bis 0,20 mm zur Vermeidung freien Wasserdurchtritts' },
          { label: 'Wasserdiffusionswiderstand', value: 'Diffusionsoffene bis diffusionsdichte FPO-Bahnen verhindern Feuchtepeaks' },
          { label: 'Mindestdicke Betonsohle', value: '≥ 25 cm (empfohlen nach WU-Richtlinie)' }
        ];
        guidelines = [
          'WU-Richtlinie des DAfStb (Stahlbetonbauwerke für Wasserundurchlässigkeit)',
          'DBV-Merkblatt Frischbetonverbundsysteme (FBV)',
          'DIN 18533: Abdichtung erdberührter Bauteile'
        ];
      } else if (roomRequirement === 'standard') {
        systemTitle = 'Moderne "Weiße Wanne" (Wasserundurchlässiges Betonbauwerk)';
        systemDesc = 'Das Tragwerk übernimmt die statischen Lasten und dient gleichzeitig als Abdichtung (Primärsystem). Einteilig betoniert mit integrierten Arbeits- und Dehnungsfugen-Abdichtungen.';
        products = [
          'WU-Beton mit dichtem Zementsteingefüge und geringem Wasserbindemittelwert (w/z ≤ 0,55)',
          'Beschichtete Fugenbleche zur unverschlossenen Kriechwegverlängerung',
          'Hochelastische PVC-P Fugenbänder für Dehnungsfugen',
          'Injektionsschläuche im Betonierstoß zur nachträglichen Verpressung im Schadensfall'
        ];
        techSpecs = [
          { label: 'Rissbreitenbegrenzung wk', value: 'Nutzungsklasse A verlangt rechnerische Rissbeschränkung auf ≤ 0,20 mm' },
          { label: 'Mindestdicke Wand', value: '≥ 24 cm (besser 30 cm)' },
          { label: 'Kiesnestervermeidung', value: 'Sorgfältiger Rüttlereinsatz an den Bewehrungsflanken unabdingbar' }
        ];
        guidelines = [
          'Richtlinie Wasserundurchlässige Bauwerke aus Beton (WU-Richtlinie DAfStb)',
          'DIN EN 206 / DIN 1045-2: Tragwerke aus Beton'
        ];
      } else {
        systemTitle = 'Weiße Wanne (Einfaches Tragsystem / Nutzungsklasse C)';
        systemDesc = 'Betonkonstruktion ohne strenge Rissbreitenüberwachung für Lagerplätze mit vernachlässigbaren Dichtigkeitsansprüchen (z. B. offene Tiefgaragen).';
        products = [
          'WU-Beton (Standardgüte)',
          'Integrierte Fugenbleche oder Bentonit-Quellbänder in den Arbeitsfugen'
        ];
        techSpecs = [
          { label: 'Rissbreite wk', value: 'Rissbreiten bis zu 0,30 mm zulässig' },
          { label: 'Mindestdicke Wand', value: '≥ 24 cm' }
        ];
        guidelines = [
          'Standard-Tragwerksplanung nach DIN EN 1992-1-1'
        ];
      }
    } else {
      // Bodenfeuchte oder stauend + drain (W1.1-E oder W1.2-E)
      if (roomRequirement === 'hochwertig') {
        systemTitle = 'Klassische "Schwarze Wanne" mit Premium-Materialmix';
        systemDesc = 'Vollflächig dichte, flexible Abdichtungsschale auf der Außenseite von Beton- oder Mauerwerkswänden. Hervorragende Absicherung hochwertiger Kellerräume.';
        products = [
          'Zweilagige Polymerbitumen-Dickbeschichtung (PMBC) mit vollflächig eingebetteter Gittergewebeeinlage',
          'Umlaufendes Noppenschutzbahn-System mit aufkaschiertem Geotextilvlies zur Filterung von Feinstteilen',
          'Perimeterdämmung aus druckfestem und wasserabweisendem XPS (Extrudiertes Polystyrol)'
        ];
        techSpecs = [
          { label: 'Mindesttrockenschichtdicke', value: '≥ 4,0 mm (PMBC) bei stauendem Einbau' },
          { label: 'Rissüberbrückungsklasse', value: 'Rissüberbrückung nach DIN 18533 ≥ 0,4 mm' },
          { label: 'Gewebeschutz', value: 'Gewebe nimmt thermische Kontraktionesbewegungen des Untergrunds rissfrei auf' }
        ];
        guidelines = [
          'DIN 18533 Teil 3 (Stoffe für Bitumendickbeschichtungen)',
          'DIN 4095: Dränung zum Schutz von baulichen Anlagen'
        ];
      } else if (roomRequirement === 'standard') {
        systemTitle = 'Schwarze Wanne (Standard Bitumen- oder Mineralkomponente)';
        systemDesc = 'Hautabdichtung für Keller-Nutzzonen mit Standard-Feuchtigkeitssperre gegen Erdreichfeuchte.';
        products = [
          'Polymermodifizierte Dickbeschichtung (PMBC) oder rissüberbrückende Reaktivabdichtung (FPD)',
          'Mineralische Dichtungsschlämmen (MDS, flexibel) als Sockel- und Bodenabdichtungen'
        ];
        techSpecs = [
          { label: 'Mindesttrockenschichtdicke', value: '≥ 3,0 mm' },
          { label: 'Untergrundqualität', value: 'Frei von Graten, Löcher spachteln (Kratzspachtelung)' }
        ];
        guidelines = [
          'DIN 18533 Teil 3'
        ];
      } else {
        systemTitle = 'Minimal-Feuchteschutz (Braune Wanne oder Starre MDS)';
        systemDesc = 'Kostengünstiger mineralischer Feuchteschutz für Abstellflächen.';
        products = [
          'Starre mineralische Dichtungsschlämmen (MDS) zur Absperrung kapillarer Feuchtebahnen',
          'Ökologischer Natriumbentonit als Braune Wanne (Quelltonschicht)'
        ];
        techSpecs = [
          { label: 'Mindestschichtdicke (MDS)', value: '≥ 2,0 mm' }
        ];
        guidelines = [
          'DIN 18533 Teil 1 / WTA-Richtlinien'
        ];
      }
    }

    return {
      waterClass,
      waterDesc,
      systemTitle,
      systemDesc,
      products,
      techSpecs,
      guidelines
    };
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        
        {/* Module Header */}
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /> Abdichtungen (Bauprodukte)
          </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Regelkonforme Abdichtungssysteme, Fugentechnik im Betonbau und professionelle Bauwerksinstandsetzung durch Rissinjektion.
          </p>
        </div>

        {/* Primary Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Basiswissen
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={16} /> Praxisbeispiele
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'innovation' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('innovation')}
          >
            <Lightbulb size={16} /> Zukunftstrends
          </button>
        </div>

        {activeTab === 'allgemein' ? (
          <>
            {/* Sub-Tab Navigation */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          {[
            { id: 'material', label: 'Materialien & Baustoffe', icon: <Layers size={14} /> },
            { id: 'fugen', label: 'Fugen (Konstruktion & Material)', icon: <Split size={14} /> },
            { id: 'risse', label: 'Risse & Verpressungen', icon: <Activity size={14} /> },
            { id: 'berater', label: 'DIN-Klassen-Berater & Systeme', icon: <Calculator size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-shiraz text-white border-shiraz shadow-md'
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: MATERIALIEN */}
        {activeSubTab === 'material' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Informational Header for Deutsche Bauchemie e.V. Sealing Guidelines */}
            <div className="text-xs text-text-main hover:text-text-main bg-stone-50 p-4.5 rounded-xl border border-home-grau/30 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">
                Planungsgrundlage: Deutsche Bauchemie e.V.
              </span>
              <p className="leading-relaxed font-medium">
                Erdberührte Bauwerksabdichtungen sowie Sockel- und Nassraumabdichtungen müssen nach den neuesten Normen und anerkannten Regeln der Technik geplant werden. Als herstellerneutrale Fachregeln gelten hierzu insbesondere die Richtlinien der <strong>Deutsche Bauchemie e.V.</strong> für die Stoffklassen <strong>PMBC</strong>, <strong>MDS</strong> und <strong>FPD</strong>.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* PMBC SECTION */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-shiraz tracking-wider uppercase bg-rose-50 px-2 py-0.5 rounded block w-max">Bitumensystem</span>
                  <h3 className="font-extrabold text-slate-800 text-sm lg:text-base">PMBC (Polymermodifizierte Bitumendickbeschichtungen)</h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    Lösemittelfreie, organische Pasten auf Bitumenemulsionsbasis (früher KMB). Genormt in <strong>DIN 18533</strong>. Optimal für feuchtigkeitsdichte, hochflexible Rissüberbrückungen auf rauen mineralischen Untergründen.
                  </p>
                  <ul className="text-[11px] text-slate-600 pl-1 list-none space-y-2">
                    <li className="flex items-start gap-1.5 border-t border-slate-100 pt-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Untergrundvorbereitung (Kratzspachtelung):</strong> Auf Beton und Mauerwerk ist eine vollflächige Kratzspachtelung (Porenverschluss) zwingend vorgeschrieben. Dies verhindert wirksam den gefährlichen <i>Pinhole-Effekt</i> (Blasen- und Porenbildung durch thermische Ausgasungen der Poren bei Sonneneinstrahlung).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Sollschichtdicke &amp; Messung:</strong> W1-E / W4-E verlangen Trockenschichtdicke <span className="font-mono font-bold text-slate-800">≥ 3,0 mm</span>; W2.1-E verlangt <span className="font-mono font-bold text-slate-800">≥ 4,0 mm</span> mit vollflächiger Gewebeeinbettung. Schichtdickenkontrolle muss nass (mit Schichtdickenkamm) und trocken zerstörungsfrei oder per Keilschnittprüfung am Referenzkörper dokumentiert werden.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Flanken- &amp; Eckenbehandlung:</strong> Innenecken und Fundament-Wand-Übergänge dürfen nicht scharfkantig ausgeführt werden. Eine Hohlkehle (Radius 4 - 6 cm) aus Zementmörtel oder PMBC selbst ist vor dem Flächenauftrag herzustellen.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Witterungseinschränkungen:</strong> Verarbeitung nur bei Luft- und Wandtemperaturen von +5°C bis +30°C. Der frische Film ist vor Frost, Regen sowie direkter extremer Prallsonne zu schützen.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-2.5 rounded text-[10px] text-slate-500 italic font-medium leading-tight">
                  <strong>Regelwerk:</strong> "Richtlinie für die Planung u. Ausführung von Abdichtungen mit PMBC" (3. Ausgabe, Deutsche Bauchemie e.V.).
                </div>
              </div>

              {/* MDS SECTION */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-emerald-800 tracking-wider uppercase bg-emerald-50 px-2 py-0.5 rounded block w-max">Mineralisches System</span>
                  <h3 className="font-extrabold text-slate-800 text-sm lg:text-base">MDS (Mineralische Dichtungsschlämmen)</h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    Zementgebundene Bauwerksabdichtungssysteme mit sandigen Zuschlägen und dispergierten organischen Polymeradditiven. Hervorragend geeignet für starre bis zugfeste Feuchtigkeitsabsperrungen im erdberührten Verbund.
                  </p>
                  <ul className="text-[11px] text-slate-600 pl-1 list-none space-y-2">
                    <li className="flex items-start gap-1.5 border-t border-slate-100 pt-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Untergrundsteuerung (Vornässen):</strong> Mineralische Untergründe müssen unmittelbar vor dem MDS-Auftrag gründlich vorgenässt werden, bis sie matt-feucht sind (kein stehendes Wasser!). Ein trockener Untergrund entzieht der Schlämme Wasser, was zum "Aufbrennen" (Minderfestigkeiten und kreidendes Abstauben des Zements) führt.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Schichtdicken-Regularien:</strong> Jede Stelle des Abdichtungsfeldes muss eine Mindesttrockenschichtdicke von <span className="font-mono font-bold text-slate-800">≥ 2,0 mm</span> aufweisen. Der Einbau erfolgt porenfrei in mindestens zwei bis drei Arbeitsgängen per Schlämmbürste, Quast oder Kelle.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Schwindriss-Prophylaxe:</strong> Zu dicke Einzelaufträge (&gt; 2 mm pro Arbeitsgang) bergen akutes Risiko von Schwindrissen durch Schereigenspannungen. Die frisch fertiggestellte Dichtungsschlämme muss vor raschem Wind- und Sonnenentzug geschützt werden.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-2.5 rounded text-[10px] text-slate-500 italic font-medium leading-tight">
                  <strong>Regelwerk:</strong> "Richtlinie für die Planung u. Ausführung von Abdichtungen mit MDS" (4. Ausgabe, Deutsche Bauchemie e.V.).
                </div>
              </div>

              {/* FPD SECTION (INNOVATIVE REAKTIVABDICHTUNGEN) */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-indigo-800 tracking-wider uppercase bg-indigo-50 px-2 py-0.5 rounded block w-max">Hybrid-System (Zukunft)</span>
                  <h3 className="font-extrabold text-slate-800 text-sm lg:text-base">FPD (Flexible polymermodifizierte Dickbeschichtungen)</h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    Bitumenfreie, hochelastische, extrem schnellabbindende Hybrid-Flüssigabdichtungen. Sie vereinen die hohe Rissüberbrückungsfähigkeit von PMBC mit dem hochfesten Haftverbund mineralischer MDS-Schlämmen.
                  </p>
                  <ul className="text-[11px] text-slate-600 pl-1 list-none space-y-2">
                    <li className="flex items-start gap-1.5 border-t border-slate-100 pt-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Haftung &amp; Multifunktionalität:</strong> Außerordentliche, verkrallende Adhäsionswerte auf Beton, Stein, Metall, PVC und staubigen, bituminösen Altabdichtungsschichten im Bestand. Optimal für Sanierungen und Übergänge geeignet!</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Bauökologie &amp; Systemvorteile:</strong> Lösemittelfrei, geruchsneutral, UV-beständig und verputzfähig. Durch reaktive Selbsthärtung extrem schnelltrocknend und bereits nach wenigen Stunden regen- und druckfest beladefähig.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="text-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Muster-Schichtdicken:</strong> Trockenschichtdicke <span className="font-mono font-bold text-slate-800">≥ 2,0 mm</span> bei W1-E / W4-E. Unter mäßigem drückendem Wasser (W2.1-E) sind regelkonforme <span className="font-mono font-bold text-slate-800">≥ 3,0 mm</span> einzuhalten und bauaufsichtlich zu belegen (abP).</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-2.5 rounded text-[10px] text-slate-500 italic font-medium leading-tight">
                  <strong>Regelwerk:</strong> "Richtlinie für die Planung u. Ausführung von Abdichtungen mit FPD" (1. Ausgabe, Deutsche Bauchemie e.V.).
                </div>
              </div>
            </div>

            {/* SYNTHETISCHE & NATÜRLICHE SYSTEME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
                <span className="text-xs font-bold text-blue-700 tracking-wider uppercase block">SYNTHETISCHE BAHNEN &amp; FLÜSSIGKUNSTSTOFF</span>
                <h3 className="font-extrabold text-slate-800 text-sm lg:text-base">Kunststoffbahnen (EPDM, FPO, PVC) &amp; FLK</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Rollenversiegelungen und dichte Harzanstriche bieten nahtlose, witterungsbeständige Langzeitabsicherungen für Flachdächer und komplizierte TGA-Durchführungsgeometrien:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-650 space-y-1.5 pl-1 leading-normal">
                  <li><strong>EPDM &amp; FPO Kunststoffbahnen:</strong> Einlagige Rollenbahnen mit extremer Alterungsstabilität. EPDM-Kautschukbahnen weisen dauerhafte Dehnungsreserven von über 400 % auf.</li>
                  <li><strong>Flüssigkunststoffe (FLK - PMMA / PUR):</strong> Gemäß den FLK-Richtlinien der Deutschen Bauchemie ist eine <strong>vollflächige Vliesarmierung (Spezial-Polyestervlies)</strong> zwingend vorgeschrieben, die vollkommen blasenfrei in zwei Harzlagen nass-in-nass eingebettet wird. Dies garantiert sichere Rissüberbrückungen an komplexen Schnittstellen, Fensterbänken, Türschwellen und Gullys. Auf kritischen Untergründen (Asphalt, Metall) sind systemadäquate Primersysteme (Haftbrücken) einzusetzen.</li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
                <span className="text-xs font-bold text-amber-800 tracking-wider uppercase block">MINERALISCHER BENTONIT (TONMINERALIEN)</span>
                <h3 className="font-extrabold text-slate-800 text-sm lg:text-base">Trägergestützte Quellton-Abdichtungssysteme</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Kompletter ökologischer Feuchteschutz im Grundwasser- und Gründungsbereich durch quellfähige Mineralien ohne den Einsatz chemischer Lösungsmittel:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-650 space-y-1.5 pl-1 leading-normal">
                  <li><strong>Bentonitbahnen ("Braune Wanne"):</strong> Robuste Geotextilbahnen, zwischen deren Gewebeschichten pulverförmiges Natriumbentonit fest gekapselt ist. Unter Erdanpressdruck quillt das Bentonit bei Wasserkontakt und bildet eine extrem dichte, gelartige Tonschicht.</li>
                  <li><strong>Bentonitquellbänder:</strong> Biegsame Dichtbänder zur zuverlässigen Primär-Abdichtung in rauen Betonierarbeitsfugen.</li>
                </ul>
              </div>
            </div>

            <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 shadow-sm mt-4">
              <h3 className="font-bold text-text-main text-sm mb-3 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-shiraz" />
                Bauaufsichtliche Prüfnachweise &amp; Leistungsnachweise (Herstellerneutral)
              </h3>
              <p className="text-xs text-text-main/70 mb-4 leading-relaxed">
                Da viele moderne Bauwerksabdichtungen (wie Verbundabdichtungen, Frischbetonverbundfolien oder Quellbänder) im nationalen Regelwerk nicht abschließend genormt sind, verlangt die VOB/C im öffentlichen Bauwesen herstellerneutrale Konformitätsnachweise:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1 mb-1">
                    <FileText size={14} className="text-shiraz" /> allgemeines bauaufsichtliches Prüfzeugnis (abP)
                  </span>
                  <p className="text-text-main/70 leading-normal">
                    Nachweis für regelungsbedürftige Bauprodukte und Abdichtungssysteme mit geringem Risikopotenzial (z. B. flüssige Verbundabdichtungen im Bad oder Rissinjektionsmittel). Bestätigt die Brauchbarkeit anhand festgeschriebener Prüfverfahren.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1 mb-1">
                    <FileText size={14} className="text-shiraz" /> Europäische Technische Bewertung (ETA)
                  </span>
                  <p className="text-text-main/70 leading-normal">
                    Wegbereiter für CE-Kennzeichnungen von innovativen Abdichtungsprodukten ohne harmonisierte EN-Norm (z. B. hochelastische EPDM-Bahnen, Bentonitmembranen oder Flüssigkunststoffe mit langen Nutzungsdauern).
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1 mb-1">
                    <FileText size={14} className="text-shiraz" /> allgemeine bauaufsichtliche Zulassung (abZ)
                  </span>
                  <p className="text-text-main/70 leading-normal">
                    Erteilt durch das Deutsche Institut für Bautechnik (DIBt) für hochinnovative Sonderkonstruktionen (z. B. druckwasserdichte Rohrdurchführungen, bauwerksübergreifende Fugenkonstruktionen im Bahnbau).
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1 mb-1">
                    <FileText size={14} className="text-shiraz" /> WTA-Zertifikate &amp; Merkblätter
                  </span>
                  <p className="text-text-main/70 leading-normal">
                    Spezifische Zulassungen der Wissenschaftlich-Technischen Arbeitsgemeinschaft für Bauwerkserhaltung e.V., insbesondere relevant für Injektionsgele bei Kellerschleier- oder Mauerwerksinjektionen in der Denkmalsanierung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FUGEN (KONSTRUKTION & MATERIAL) */}
        {activeSubTab === 'fugen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 flex items-start gap-3">
              <Info size={18} className="text-shiraz mt-0.5 shrink-0" />
              <div>
                <p className="leading-relaxed">
                  Fugen unterteilen große Bauteile zur Rissvermeidung oder Bewegungskompensation. Im WU-Stahlbetonbau (Weiße Wanne) ist jede Fuge eine potenzielle Schwachstelle und muss mit geprüften Fugenabdichtungen fachgerecht gesichert werden.
                </p>
              </div>
            </div>

            {/* FUGEN-KONSTRUKTIONEN */}
            <div>
              <h3 className="font-extrabold text-sm text-text-main mb-3 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <Hammer size={16} className="text-shiraz" /> 1. Fugenarten und konstruktive Ausbildungen
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-home-grau/15 p-4 rounded-xl space-y-2">
                  <span className="text-xs uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">AF</span>
                  <h4 className="font-bold text-text-main text-xs">Arbeitsfugen (Betonierfugen)</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    Schnittstelle zwischen zeitversetzten Betonierabschnitten (z.B. Sohlplatte zu aufstehender Kellerwand). Keine Relativbewegungen erwünscht.
                  </p>
                  <div className="p-2 bg-stone-50 rounded text-xs text-text-main/60">
                    <strong>Konstruktion:</strong> Aufrauung der Fuge, Reinigung von Zementschlämmen zur Erzielung eines guten Verbunds.
                  </div>
                </div>

                <div className="border border-home-grau/15 p-4 rounded-xl space-y-2">
                  <span className="text-xs uppercase font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">BF / DF</span>
                  <h4 className="font-bold text-text-main text-xs">Dehnungs- &amp; Bewegungsfugen</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    Trennen Bauteile vollständig, um thermisch oder setzungsbedingte Bewegungen und Längenänderungen zwangsfrei abzubauen.
                  </p>
                  <div className="p-2 bg-stone-50 rounded text-xs text-text-main/60">
                    <strong>Konstruktion:</strong> Vollständige Entkopplung, ausgefüllt mit komprimierbarer Füllplatte (z.B. Styropor oder PE).
                  </div>
                </div>

                <div className="border border-home-grau/15 p-4 rounded-xl space-y-2">
                  <span className="text-xs uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">SF</span>
                  <h4 className="font-bold text-text-main text-xs">Sollrissfugen (Schrumpffugen)</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    Querschnittsschwächungen zur gezielten örtlichen Zuweisung des Schwindrisses. Verhindert unkontrollierte wilde Risse.
                  </p>
                  <div className="p-2 bg-stone-50 rounded text-xs text-text-main/60">
                    <strong>Konstruktion:</strong> Eingelegte Profilleisten schwächen die Wandstärke um min. 1/3. Im Kern sitzt ein Dichtelement.
                  </div>
                </div>
              </div>
            </div>

            {/* FUGEN-MATERIALIEN */}
            <div>
              <h3 className="font-extrabold text-sm text-text-main mb-3 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <Layers size={16} className="text-shiraz" /> 2. Fugenabdichtmaterialien &amp; Einbauprodukte im Überblick
              </h3>

              <div className="space-y-3">
                <div className="flex flex-col md:flex-row border border-home-grau/15 rounded-xl overflow-hidden text-xs">
                  <div className="md:w-1/4 bg-stone-50 p-4 font-bold text-text-main border-r border-home-grau/10">
                    Fugenbänder (PVC-P / Elastomer)
                  </div>
                  <div className="md:w-3/4 p-4 space-y-2">
                    <p className="text-text-main/70 leading-relaxed">
                      Klassische mechanische Abdichtung für Dehnungs- und Arbeitsfugen. Es gibt <strong>innenliegende</strong> Fugenbänder (durch Beton umschlossen) und <strong>außenliegende</strong> Fugenbänder (auf dem Erdreich oder Schalung aufliegend). Geregelt in <strong>DIN 18197</strong>.
                    </p>
                    <div className="flex flex-wrap gap-4 text-[10px] text-text-main/50">
                      <span><strong>Materialien:</strong> Weichpolyvinylchlorid (PVC-P) oder hochelastischer Kautschuk (SBR/EPDM für Dehnungsfugen).</span>
                      <span><strong>Einbau:</strong> Schweißverbindung auf der Baustelle mittels Schweißschwert erforderlich.</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row border border-home-grau/15 rounded-xl overflow-hidden text-xs">
                  <div className="md:w-1/4 bg-stone-50 p-4 font-bold text-text-main border-r border-home-grau/10">
                    Injektionsschläuche
                  </div>
                  <div className="md:w-3/4 p-4 space-y-2">
                    <p className="text-text-main/70 leading-relaxed">
                      Perforierte, mit Spezial-Gewebe umhüllte Kunststoffschläuche, die direkt mittig in der Arbeitsfuge auf dem ersten Betonierabschnitt fixiert werden. Sie dienen als &apos;Sicherheits-Backup&apos;: Zeigt die Fuge später eine Leckage, wird flüssiges Dichtungsharz über die stirnseitigen Schlauchenden eingepresst.
                    </p>
                    <div className="flex flex-wrap gap-4 text-[10px] text-text-main/50">
                      <span><strong>Typ:</strong> Einfachinjektionssysteme oder mehrfach injizierbare Varianten (über Vakuum).</span>
                      <span><strong>Kombianwendung:</strong> Häufig als redundante Zusatzabdichtung neben Fugenblechen.</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row border border-home-grau/15 rounded-xl overflow-hidden text-xs">
                  <div className="md:w-1/4 bg-stone-50 p-4 font-bold text-text-main border-r border-home-grau/10">
                    Fugenbleche (beschichtet)
                  </div>
                  <div className="md:w-3/4 p-4 space-y-2">
                    <p className="text-text-main/70 leading-relaxed">
                      Verzinkte Blechstreifen mit ein- oder beidseitiger Spezialbeschichtung (Bitumen oder thermoplastische Spezialbeschichtung). Sie verkleben dauerhaft mit dem Frischbeton und versperren kriechendem Sickerwasser den Kriechweg.
                    </p>
                    <div className="flex flex-wrap gap-4 text-[10px] text-text-main/50">
                      <span><strong>Vorteil:</strong> Schnelle Montage auf der oberen Bewehrungslage der Sohlplatte vor Wandbetonage.</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row border border-home-grau/15 rounded-xl overflow-hidden text-xs">
                  <div className="md:w-1/4 bg-stone-50 p-4 font-bold text-text-main border-r border-home-grau/10">
                    Quelldichtungen &amp; Fugendichtstoffe
                  </div>
                  <div className="md:w-3/4 p-4 space-y-2">
                    <p className="text-text-main/70 leading-relaxed">
                      <strong>Quellbänder:</strong> Biegetunnelelemente aus Bentonit oder Quellpolyurethan quellen bei Kontakt mit Feuchtigkeit auf und verpressen mechanisch den Hohlraum. 
                      <strong>Fugendichtstoffe:</strong> Hochelastische, einkomponentige Dichtstoffe (Polyurethan, MS-Polymer) für sichtbare Anschlussfugen an Fassaden und Böden.
                    </p>
                    <div className="flex flex-wrap gap-4 text-[10px] text-text-main/50">
                      <span><strong>Wichtig:</strong> Quellbänder benötigen mind. 8-10 cm dichte Betonüberdeckung zur Absicherung des Quelldrucks!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE COMPONENT 1: FUGENBAND PLANER */}
            <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                <Calculator className="text-shiraz" size={18} />
                <h4 className="font-extrabold text-sm text-text-main">3. Interaktiver Fugenband-Planer (DIN 18197 &amp; DIN 18533)</h4>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Geben Sie die Bauteilabmessungen und Wassereinwirkungen an, um die konforme Bandbreite und die Mindestbauteildicke nach DIN 18197 zu prüfen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Inputs */}
                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-3">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Fugenart</span>
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="fbJointType" 
                        checked={fbJointType === 'arbeitsfuge'} 
                        onChange={() => setFbJointType('arbeitsfuge')} 
                        className="accent-shiraz"
                      />
                      Arbeitsfuge (statisch)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="fbJointType" 
                        checked={fbJointType === 'dehnungsfuge'} 
                        onChange={() => setFbJointType('dehnungsfuge')} 
                        className="accent-shiraz"
                      />
                      Dehnungsfuge (beweglich)
                    </label>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-3">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Wasserdruck</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Wassersäule:</span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(fbWaterPressure)} m</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      step="1"
                      value={fbWaterPressure}
                      onChange={(e) => setFbWaterPressure(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                    <div className="text-[10px] text-zinc-400">
                      ({formatDeZahl((fbWaterPressure * 0.1), 1)} bar hydrostatischer Druck)
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-3">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Bauteildicke</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Wand-/Sohldicke (d):</span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(fbSlabThickness)} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="60" 
                      step="5"
                      value={fbSlabThickness}
                      onChange={(e) => setFbSlabThickness(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                    <div className="text-[10px] text-zinc-400">
                      Empfohlen Wand min. 24 cm
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-3">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Betongrößtkorn</span>
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="fbMaxAggregate" 
                        checked={fbMaxAggregate === 16} 
                        onChange={() => setFbMaxAggregate(16)} 
                        className="accent-shiraz"
                      />
                      GK 16 mm (feiner)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="fbMaxAggregate" 
                        checked={fbMaxAggregate === 32} 
                        onChange={() => setFbMaxAggregate(32)} 
                        className="accent-shiraz"
                      />
                      GK 32 mm (Standard)
                    </label>
                  </div>
                </div>
              </div>

              {/* Fugenband Analysis calculations */}
              {(() => {
                // Erforderliche Breite determinieren nach DIN 18197 / DIN 18533
                let reqWidth = 200; // in mm
                let bandDesignation = '';
                
                if (fbJointType === 'arbeitsfuge') {
                  if (fbWaterPressure <= 5) {
                    reqWidth = 200;
                    bandDesignation = 'A 200 (Bitumenkompatibel / PVC-P)';
                  } else if (fbWaterPressure <= 12) {
                    reqWidth = 240;
                    bandDesignation = 'A 240 (PVC-P) oder FM 250 (Hochelastomer)';
                  } else {
                    reqWidth = 320;
                    bandDesignation = 'A 320 (PVC-P) bzw. FM 350 (Elastomer-Spezial)';
                  }
                } else {
                  // Dehnungsfuge
                  if (fbWaterPressure <= 3) {
                    reqWidth = 240;
                    bandDesignation = 'D 240 (PVC-P) / FM 250 (Dehnungsfuge Elastomer)';
                  } else if (fbWaterPressure <= 8) {
                    reqWidth = 320;
                    bandDesignation = 'D 320 (Standard-PVC-P) oder FM 350';
                  } else {
                    reqWidth = 400;
                    bandDesignation = 'FM 400 (Hochelastomer-Dehnfugenband) / D 500';
                  }
                }

                // Check 1: Bauteildicke im Vergleich zur Bandbreite
                // Faustregel nach DIN 18197: Bandbreite (a) darf nicht größer sein als die Bauteildicke (d).
                // d (in cm) * 10 (in mm) >= reqWidth
                const isThicknessOk = (fbSlabThickness * 10) >= reqWidth;

                // Check 2: Betonüberdeckung & Größtkorn
                // Einbetonierungstiefe min. b_anker >= 3 * D_max
                const minCoverFromGK = (fbMaxAggregate * 3) / 10; // in cm
                // Der raue Abstand des Bandes vom Bauteilrand sollte min. reqWidth/2 betragen
                const actualCoverEdge = (fbSlabThickness - (reqWidth / 20)) / 2;
                const isGkCoverOk = actualCoverEdge >= minCoverFromGK;

                return (
                  <div className="bg-white p-4 border border-zinc-200 rounded-lg space-y-3 text-xs">
                    <h5 className="font-bold text-zinc-800">Prüfbericht Fugenband-Eignung nach DIN 18197:</h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[11px] text-slate-800">
                      <div>
                        <span className="text-zinc-500 block">Empfohlene Mindestbreite (a):</span>
                        <strong className="text-shiraz text-xs">{formatDeWert(reqWidth)} mm</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Normative Produktbezeichnung:</span>
                        <strong className="text-zinc-800 text-xs">{bandDesignation}</strong>
                      </div>
                      <div className="border-t border-zinc-100 pt-1.5">
                        <span className="text-zinc-500 block">Geforderte Mindestdeckendicke:</span>
                        <span>{formatDeWert(reqWidth / 10)} cm (Soll: d ≥ a)</span>
                      </div>
                      <div className="border-t border-zinc-100 pt-1.5">
                        <span className="text-zinc-500 block">Mindest-Randabstand (Größtkorn check):</span>
                        <span>{formatDeZahl(minCoverFromGK, 1)} cm (3 · GK)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className={`p-2.5 rounded border text-[11px] leading-relaxed ${
                        isThicknessOk ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-200'
                      }`}>
                        {isThicknessOk ? (
                          <span>✓ <strong>Bauteildicke konform:</strong> Die Bauteildicke von d = {formatDeWert(fbSlabThickness)} cm ist ausreichend groß, damit das Fugenband ({formatDeWert(reqWidth)} mm) vollständig betoniert und porenfrei ummantelt wird.</span>
                        ) : (
                          <span>✗ <strong>MANGELHAFT (Geometriefehler):</strong> Die Bauteildicke ({formatDeWert(fbSlabThickness)} cm) ist zu gering für ein {formatDeWert(reqWidth)} mm breites Fugenband! Wasser kann den Fugenrand leicht umfließen, Kiesnestergefahr! Mindestens {formatDeWert(reqWidth / 10)} cm Dicke einplanen.</span>
                        )}
                      </div>

                      <div className={`p-2.5 rounded border text-[11px] leading-relaxed ${
                        isGkCoverOk ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {isGkCoverOk ? (
                          <span>✓ <strong>Kornverkrallung gesichert:</strong> Randabstand von ca. {formatDeZahl(actualCoverEdge, 1)} cm bietet genügend Fließraum für Beton mit GK {fbMaxAggregate} mm (min. erforderlich: {formatDeZahl(minCoverFromGK, 1)} cm).</span>
                        ) : (
                          <span>⚠ <strong>VORSICHT BEIM BETONIEREN:</strong> Engpass an den Fugenbandflanken! Der Freiraum ist eng für GK {fbMaxAggregate} mm. Gefahr von Zementmangelstellen. Wechseln Sie auf GK 16 oder rütteln Sie besonders vorsichtig!</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* INTERACTIVE COMPONENT 2: INJEKTIONSSCHLAUCH PLANER */}
            <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                <Calculator className="text-shiraz" size={18} />
                <h4 className="font-extrabold text-sm text-text-main">4. Interaktiver Injektionsschlauch-Planungsplaner</h4>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Prüfen Sie die Machbarkeit und Detailierungsrichtlinien für Verpressschläuche, um Ausbrüche und mangelhafte Injektionen auf der Baustelle zu vermeiden.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-2">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Schlauchkreislänge</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Länge:</span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(isLength)} m</span>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max="15" 
                      step="1"
                      value={isLength}
                      onChange={(e) => setIsLength(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                    <div className="text-[10px] text-zinc-400">
                      Standardrolle typisch 10 m
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-2">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Betonüberdeckung</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Abstand zum Rand:</span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(isConCover)} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="20" 
                      step="1"
                      value={isConCover}
                      onChange={(e) => setIsConCover(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                    <div className="text-[10px] text-zinc-400">
                      WU-RL fordert min. 8-10 cm
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-2">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Befestigungs-Abstand</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Clip-Intervall:</span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(isFasteningInterval)} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="30" 
                      step="2"
                      value={isFasteningInterval}
                      onChange={(e) => setIsFasteningInterval(parseInt(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                    <div className="text-[10px] text-zinc-400">
                      Max. Abstand zur Lagestabilität
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 space-y-2">
                  <span className="font-bold text-[11px] text-shiraz uppercase tracking-wider block">Injektionsmedium</span>
                  <select 
                    value={isMedium}
                    onChange={(e) => setIsMedium(e.target.value as any)}
                    className="w-full text-xs p-1.5 border rounded-md mt-1 focus:outline-none focus:ring-1 focus:ring-shiraz"
                  >
                    <option value="acrylgel">Acrylatgel (re-injizierbar)</option>
                    <option value="pur_harz">PU-Injektionsharz (elastisch)</option>
                    <option value="ep_harz">Epoxidharz (starr/kraftschlüssig)</option>
                  </select>
                </div>
              </div>

              {/* Injektionsschlauch computation & analytical outputs */}
              {(() => {
                const isLengthOk = isLength <= 10;
                const isCoverOk = isConCover >= 8;
                const isFasteningOk = isFasteningInterval <= 15;

                let mediumDesc = '';
                if (isMedium === 'acrylgel') {
                  mediumDesc = 'Quellfähiges Acrylatgel bietet eine extrem niedrige Viskosität. Bei Verwendung von quellfähigen Gelen können Schläuche theroretisch mehrfach verpresst werden (sofern nachgespült / vakuumiert). optimal für dauerhafte Abdichtung.';
                } else if (isMedium === 'pur_harz') {
                  mediumDesc = 'Polyurethan (PUR) reagiert zäh-elastisch und bildet eine geschlossenzellige, wasserunlösliche Struktur. Es fängt dynamische Spannungsbewegungen in der Arbeitsfuge elastisch ab.';
                } else {
                  mediumDesc = 'Epoxidharz (EP) härtet vollkommen spröde und starr aus. Es stellt ein hohes mechanisches Verbundleistungsvermögen dar, kann aber bei witterungsbedingten Fugendehnungen schnell erneut reißen.';
                }

                return (
                  <div className="bg-white p-4 border border-zinc-200 rounded-lg space-y-3 text-xs">
                    <h5 className="font-bold text-zinc-800">Evaluierung des Injektionssystems:</h5>
                    
                    <div className="space-y-2">
                      {/* Check 1: Länge */}
                      <div className="flex items-start gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isLengthOk ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                          {isLengthOk ? 'KONFORM' : 'PROB-LÄNGE'}
                        </span>
                        <div className="text-[11px]">
                          <strong>Schlauchlänge ({formatDeWert(isLength)} m):</strong>{' '}
                          {isLengthOk ? (
                            <span className="text-slate-600">Sicherer verpressbarer Kreislauf. Der Fließdruck bleibt innerhalb des zulässigen Fensters der Verpresspumpe.</span>
                          ) : (
                            <span className="text-red-800"><strong>Kritisch!</strong> Schläuche über 10 m haben einen zu hohen Reibungswiderstand. Das Harz härtet vorn bereits aus, während hinten noch nichts ankommt! Fuge stückeln.</span>
                          )}
                        </div>
                      </div>

                      {/* Check 2: Betonüberdeckung */}
                      <div className="flex items-start gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isCoverOk ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                          {isCoverOk ? 'KONFORM' : 'ABSPRENGGEFAHR'}
                        </span>
                        <div className="text-[11px]">
                          <strong>Betonüberdeckung ({formatDeWert(isConCover)} cm):</strong>{' '}
                          {isCoverOk ? (
                            <span className="text-slate-600">Sicherer Tiefenhalt. Keine Beschädigung des Betonrandes beim Hochdruck-Füllvorgang.</span>
                          ) : (
                            <span className="text-red-800"><strong>Achtung Ausbrüche!</strong> Der Hochdruck von bis zu 100-150 bar kann dünne Plattenwände ({formatDeWert(isConCover)} cm) aufsprengen und unkontrolliert nach außen abplatzen lassen.</span>
                          )}
                        </div>
                      </div>

                      {/* Check 3: Clips */}
                      <div className="flex items-start gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isFasteningOk ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-700'}`}>
                          {isFasteningOk ? 'STABIL' : 'LAGEMANGEL'}
                        </span>
                        <div className="text-[11px]">
                          <strong>Montageabstand ({formatDeWert(isFasteningInterval)} cm):</strong>{' '}
                          {isFasteningOk ? (
                            <span className="text-slate-600">Der Schlauch fließt und treibt im zähen Betonstrom nicht auf (perfekter mittiger Sitz gewährleistet).</span>
                          ) : (
                            <span className="text-amber-800"><strong>Ungesicherte Lage!</strong> Durch weite Clipabstände kann der Schlauch aufschwimmen oder an die Außenwand rutschen, wodurch die dichte Betonschutzdecke unterschritten wird.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 p-2.5 bg-indigo-50/50 rounded text-[11px] text-indigo-950 leading-relaxed font-sans border border-indigo-100">
                      <strong>Wirkungsweise des Injektionsmediums:</strong> {mediumDesc}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* PRAXIS-WARNUNG */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-2 text-xs">
              <ShieldAlert className="text-red-700 mt-0.5 shrink-0" size={16} />
              <div>
                <strong className="text-red-950 font-bold block">Fehlerrisiko Fugenbänder:</strong>
                <p className="text-red-900 leading-relaxed mt-0.5">
                  Fugenbänder neigen beim Betoneinbau unter Rütteldruck zum Umknicken (&apos;Faltbildung&apos;). Wird der Beton nicht extrem sorgfältig an den Flanken gestochert, kommt es zu Kiesnestern direkt um das Band. Folge: Sickerwasser kriecht um das Fugenband herum direkt ins Gebäudeinnere!
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: RISSE & VERPRESSUNGEN */}
        {activeSubTab === 'risse' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 flex items-start gap-3">
              <Droplet size={18} className="text-shiraz mt-0.5 shrink-0" />
              <div>
                <p className="leading-relaxed">
                  Risse im Stahlbeton sind werkstofftypische Begleierscheinungen. Überschreiten sie das zulässige Maß (z.B. &gt; 0,2 mm bei WU-Konstruktionen), drohen Bewehrungskorrosion und Wasseraustritte. Die Sanierung erfolgt regelkonform durch <strong>Rissinjektion (Rissverpressung)</strong> nach der <strong>DIN EN 1504-5</strong>.
                </p>
              </div>
            </div>

            {/* RISSMERKMALE & ANALYSE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-home-grau/15 p-4 rounded-xl space-y-3">
                <h4 className="font-bold text-text-main text-sm lg:text-base border-b border-home-grau/10 pb-1.5 flex items-center gap-1">
                  <Activity size={14} className="text-shiraz" /> Risseigenschaften für die Injektionsauswahl
                </h4>
                <div className="space-y-2 text-sm text-text-main/70">
                  <p>Bevor ein Verpressstoff gewählt wird, muss der Zustand des Risses klassifiziert werden:</p>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li><strong>Feuchtigkeitszustand:</strong> Trocken, feucht, wasserführend oder unter hydrostatischem Druck stehend.</li>
                    <li><strong>Zweck der Maßnahme:</strong> Dehnfähiges, abdichtendes Schließen (Zäh-elastisch) vs. tragendes, wiederherstellendes Verbinden (Kraftschlüssig).</li>
                    <li><strong>Rissbreitenschwankung:</strong> Dynamisch beanspruchte Risse verlangen flexiblen Verschluss.</li>
                  </ul>
                </div>
              </div>

              <div className="border border-home-grau/15 p-4 rounded-xl space-y-3">
                <h4 className="font-bold text-text-main text-sm lg:text-base border-b border-home-grau/10 pb-1.5 flex items-center gap-1">
                  <Wrench size={14} className="text-shiraz" /> Einbau-Packertechnik
                </h4>
                <div className="space-y-2 text-sm text-text-main/70">
                  <p>Packer leiten die Injektionsflüssigkeit hochdrucksicher direkt in den Riss:</p>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li><strong>Bohrpacker (Schraubpacker):</strong> Schräg versetzt in einem Winkel von 45° bis zur Rissmitte gebohrte Metall- oder Kunststoffdübel. Für hohe Drücke (&gt;100 bar).</li>
                    <li><strong>Klebepacker (Oberflächenpacker):</strong> Werden direkt auf den gereinigten Rissspalt geklebt. Nur bei geringen Einpressdrücken (Niederdruckverfahren) verwendbar oder um mechanische Bauteilbeschädigungen zu vermeiden.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* INJEKTIONSSTOFFE IM DETAILED VERGLEICH */}
            <div>
              <h3 className="font-extrabold text-sm text-text-main mb-3">Die 4 Kern-Injektionsstoffe nach DIN EN 1504-5</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                <div className="bg-red-50/25 border border-red-200/50 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-red-700 bg-red-50 px-1.5 py-0.5 rounded tracking-wider">KRAFTSCHLÜSSIG</span>
                    <h5 className="font-extrabold text-text-main text-xs mt-1">Epoxidharze (EP)</h5>
                    <p className="text-[11px] text-text-main/60 leading-normal">
                      Hohe Haftfestigkeit auf trockenen Betonflanken. Stellt die statische Tragfähigkeit des Bauteils vollständig wieder her.
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded text-[10px] text-text-main/50 font-bold border border-home-grau/10">
                    Anwendung: Trocken/Feucht, Tragwerksstabilisierung
                  </div>
                </div>

                <div className="bg-emerald-50/25 border border-emerald-200/50 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded tracking-wider">ELASTISCH / DICHTEND</span>
                    <h5 className="font-extrabold text-text-main text-xs mt-1">Polyurethanharze (PUR)</h5>
                    <p className="text-[11px] text-text-main/60 leading-normal">
                      Zäh-elastischer Kunststoff. Reagiert stark quellend bei Wassereinfluss (Schaumbildung bei Akut-Leckagen), bleibt dauerhaft dehnfähig.
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded text-[10px] text-text-main/50 font-bold border border-home-grau/10">
                    Anwendung: Wasserführende Risse, Risse unter Bewegung
                  </div>
                </div>

                <div className="bg-amber-50/25 border border-amber-200/50 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded tracking-wider">MINERALISCH FÜLLEND</span>
                    <h5 className="font-extrabold text-text-main text-xs mt-1">Zementsuspensionen (ZS)</h5>
                    <p className="text-[11px] text-text-main/60 leading-normal">
                      Feinstzementleim zur mineralischen Auffüllung breiterer Risse, Poren und großer Fehlstellen im Verbund.
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded text-[10px] text-text-main/50 font-bold border border-home-grau/10">
                    Anwendung: Hohlraumverfüllung, Denkmalpflege, Mauerwerk
                  </div>
                </div>

                <div className="bg-blue-50/25 border border-blue-200/50 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded tracking-wider">GELBILDUNG EXTERN</span>
                    <h5 className="font-extrabold text-text-main text-xs mt-1">Acrylatgele (AY)</h5>
                    <p className="text-[11px] text-text-main/60 leading-normal">
                      Wasserquellfähige Gele mit extrem niedriger Viskosität. Dringen tief in feinste Kavernen und Mikrorisse ein.
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded text-[10px] text-text-main/50 font-bold border border-home-grau/10">
                    Anwendung: Schleierinjektionen (erdseitig), Kellerwandsanierung
                  </div>
                </div>

              </div>
            </div>

            {/* GRAPHICAL STEP-BY-STEP DIALOGUE FOR THE SITE ENGINEER */}
            <div className="bg-stone-50 border border-home-grau/25 p-5 rounded-2xl space-y-3">
              <h4 className="font-bold text-xs text-text-main flex items-center gap-1.5">
                <Wrench className="text-shiraz" size={16} /> Ablauf der Akut-Injektion (Wasserführender Riss)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] leading-relaxed">
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <strong className="block font-bold text-shiraz text-xs mb-1">1. Rissvorbereitung</strong>
                  Rissverlauf reinigen, lockere Schichten entfernen. Bohrungen schräg im 45°-Winkel versetzt anlegen, sodass Bohrkanal den Riss auf halber Bauteiltiefe schneidet.
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <strong className="block font-bold text-shiraz text-xs mb-1">2. Packer setzen</strong>
                  Bohrstaub gründlich ausblasen (sonst Verstopfungsgefahr!). Bohrpacker einsetzen und druckfest festziehen. Freie Rissbereiche oberflächlich abdämmen (Zementmörtel spachteln).
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <strong className="block font-bold text-shiraz text-xs mb-1">3. Vordichtung (PUR-Schaum)</strong>
                  Bei starkem Wasseraustritt: Vorinjizieren mit einkomponentigem PU-Schnellschaum. Nach Kontakt mit Wasser quillt dieser extrem schnell auf und stoppt den Wasserfluss zeitweise.
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <strong className="block font-bold text-shiraz text-xs mb-1">4. Hauptinjektion (Dauerhaft)</strong>
                  Dauerhaft elastisches 2K-Polyurethanharz durch die Packer pressen (von unten nach oben arbeiten). Sobald Harz am Nachbarpacker austritt, Pumpe umkoppeln. Nach Erhärtung Packer abschlagen.
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PLANUNGSBERATER & SYSTEME */}
        {activeSubTab === 'berater' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300 font-sans">
            <div className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 flex items-start gap-3">
              <Calculator size={18} className="text-shiraz mt-0.5 shrink-0" />
              <div>
                <p className="leading-relaxed">
                  <strong>Interaktiver DIN 18533 Planungsberater:</strong> Ermitteln Sie die normgerechte Wassereinwirkungsklasse (W-E) sowie Anforderungsklasse für Ihr Kellerbauteil und erhalten Sie eine herstellerneutrale, wissenschaftlich fundierte Produkt- und Systemempfehlung.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Questionnaires (5 columns) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Section 1: Water Load Situations */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
                  <h4 className="font-bold text-text-main text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-home-grau/10 pb-2">
                    <Droplet size={14} className="text-shiraz text-blue-500" />
                    1. Wasserverhältnisse &amp; Baugrund
                  </h4>
                  <p className="text-[11px] text-text-main/60 leading-normal font-medium">
                    Welche geohydrologischen Gewässer- oder Sickerwasserverhältnisse liegen am Gebäude an?
                  </p>
                  
                  <div className="space-y-2 pt-1">
                    {[
                      { id: 'bodenfeuchte', label: 'Bodenfeuchte / Sickerwasser', detail: 'Durchlässiger Kies-/Sandboden (W1.1-E). Kein stauendes Wasser.' },
                      { id: 'stauend_drain', label: 'Schwach durchlässig + Dränung nach DIN 4095', detail: 'Lehm-/Tonboden mit voll funktionsfähigem Drainagesystem (W1.2-E).' },
                      { id: 'stauend', label: 'Aufstauendes Sickerwasser (O-Drain)', detail: 'Wenig durchlässiger Lehmboden OHNE dränendes Leitungssystem (W2.1-E).' },
                      { id: 'drueckend_flach', label: 'Drückendes Grundwasser (≤ 3,0 m)', detail: 'Grundwasserstand liegt dauerhaft bis zu 3,0 m über Kellerebene (W2.1-E).' },
                      { id: 'drueckend_tief', label: 'Drückendes Grundwasser (> 3,0 m)', detail: 'Dauerhafter Wasserdruck bei tiefer Gründungssohle im Grundwasser (W2.2-E).' },
                      { id: 'spritzwasser', label: 'Spritzwasser im Sockelquerschnitt', detail: 'Oberflächenwasser und Spritzzone im Außen-Bodenanschluss (W4-E).' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setWaterLoad(opt.id)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all relative flex flex-col cursor-pointer ${
                          waterLoad === opt.id
                            ? 'bg-shiraz/5 border-shiraz text-text-main ring-1 ring-shiraz font-semibold shadow-sm'
                            : 'bg-white border-home-grau/25 text-text-main/80 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{opt.label}</span>
                          {waterLoad === opt.id && <Check size={12} className="text-shiraz shrink-0" />}
                        </div>
                        <span className="text-[10px] text-text-main/60 mt-0.5 leading-normal font-normal">{opt.detail}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Room Requirements */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
                  <h4 className="font-bold text-text-main text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-home-grau/10 pb-2">
                    <LayoutGrid size={14} className="text-shiraz" />
                    2. Raumnutzung &amp; Anforderungsklasse
                  </h4>
                  <p className="text-[11px] text-text-main/60 leading-normal font-medium">
                    Welcher Grad an Feuchtetoleranz oder Trockenheit ist vertraglich einzuhalten?
                  </p>
                  
                  <div className="space-y-2 pt-1">
                    {[
                      { id: 'hochwertig', label: 'Hochwertig (Anforderungsklasse A)', detail: 'Wohnräume, Einliegerwohnungen, Büros, Archive. Absolut staubtrocken, keine Feuchtstellen.' },
                      { id: 'standard', label: 'Standard (Anforderungsklasse B)', detail: 'Nutzungskeller, Technikräume, Werkbänke. Geringfügiger Feuchtefilm tolerierbar.' },
                      { id: 'kriechkeller', label: 'Gering (Anforderungsklasse C)', detail: 'Kriechkeller, Installationsgänge oder offene Tiefgaragen.' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRoomRequirement(opt.id)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all relative flex flex-col cursor-pointer ${
                          roomRequirement === opt.id
                            ? 'bg-shiraz/5 border-shiraz text-text-main ring-1 ring-shiraz font-semibold shadow-sm'
                            : 'bg-white border-home-grau/25 text-text-main/80 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{opt.label}</span>
                          {roomRequirement === opt.id && <Check size={12} className="text-shiraz shrink-0" />}
                        </div>
                        <span className="text-[10px] text-text-main/60 mt-0.5 leading-normal font-normal">{opt.detail}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recommendation output (7 columns) */}
              <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-5">
                
                {/* Title block */}
                <div className="border-b border-home-grau/20 pb-4">
                  <span className="text-[10px] font-extrabold uppercase text-shiraz bg-shiraz/10 px-2 py-0.5 rounded tracking-wide inline-block mb-2">
                    Berechnete Systemempfehlung nach DIN 18533
                  </span>
                  <h3 className="font-extrabold text-text-main text-lg leading-snug">
                    {(() => {
                      const res = getAdvisorRecommendation();
                      return res.systemTitle;
                    })()}
                  </h3>
                  <p className="text-xs text-text-main/70 mt-2 leading-relaxed">
                    {(() => {
                      const res = getAdvisorRecommendation();
                      return res.systemDesc;
                    })()}
                  </p>
                </div>

                {/* Normative classification badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-text-main/50 uppercase tracking-widest">Wassereinwirkungsklasse</span>
                      <span className="text-base font-black text-shiraz mt-1 block">
                        {(() => {
                          const res = getAdvisorRecommendation();
                          return res.waterClass;
                        })()}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-main/60 mt-1.5 leading-normal block">
                      {(() => {
                        const res = getAdvisorRecommendation();
                        return res.waterDesc;
                      })()}
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-text-main/50 uppercase tracking-widest">Bauaufsichtliche Einstufung</span>
                      <span className="text-sm font-black text-slate-800 block mt-1">
                        {roomRequirement === 'hochwertig' ? 'Hochwertig (Klasse A)' : roomRequirement === 'standard' ? 'Standard (Klasse B)' : 'Einfach (Klasse C)'}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-main/60 leading-relaxed mt-1.5 block">
                      {roomRequirement === 'hochwertig' 
                        ? 'Feuchtstellen auf Innenflächen vertraglich ausgeschlossen (Wohnen).' 
                        : roomRequirement === 'standard' 
                          ? 'Dunkle Verfärbungen auf Wänden zeitweise gestattet.' 
                          : 'Lokale Tropfenbildungen und feuchte Betonoberflächen unkritisch.'}
                    </span>
                  </div>
                </div>

                {/* Target Products */}
                <div>
                  <h4 className="font-extrabold text-xs text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-home-grau/10 pb-1">
                    <Layers size={14} className="text-shiraz" />
                    Zugelassene System-Bauprodukte (Herstellerneutral):
                  </h4>
                  <ul className="space-y-2 text-xs text-text-main/70">
                    {(() => {
                      const res = getAdvisorRecommendation();
                      return res.products.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 bg-stone-50/50 p-2.5 rounded border border-home-grau/10">
                          <Check size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ));
                    })()}
                  </ul>
                </div>

                {/* Technical Specifications */}
                <div>
                  <h4 className="font-extrabold text-xs text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-home-grau/10 pb-1">
                    <Wrench size={14} className="text-shiraz" />
                    Soll-Dimensionierung &amp; Einbaurichtlinien:
                  </h4>
                  <div className="bg-stone-50 border border-home-grau/15 rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-home-grau/15 bg-white">
                          <th className="p-2 font-bold text-text-main w-2/5">Vorgeschriebener Parameter</th>
                          <th className="p-2 font-bold text-text-main w-3/5">Technische Mindestanforderung / Wert</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const res = getAdvisorRecommendation();
                          return res.techSpecs.map((spec, i) => (
                            <tr key={i} className="border-b border-home-grau/10 last:border-0 hover:bg-stone-100/50 bg-white/50">
                              <td className="p-2 text-text-main/80 font-bold">{spec.label}</td>
                              <td className="p-2 text-text-main/70">{spec.value}</td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Technical Standards references */}
                <div>
                  <h4 className="font-extrabold text-xs text-text-main uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <FileText size={14} className="text-shiraz" />
                    Konformität &amp; anwendbares Baurecht:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-text-main/60 pl-1 leading-normal">
                    {(() => {
                      const res = getAdvisorRecommendation();
                      return res.guidelines.map((g, i) => (
                        <li key={i}>{g}</li>
                      ));
                    })()}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        )}
        </>
      ) : activeTab === 'praxis' ? (
        <PraxisTabContent moduleKey="bp_abdichtung" />
      ) : (
        <InnovationTabContent moduleKey="bp_abdichtung" />
      )}

      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Bauwerksabdichtung', url: 'https://de.wikipedia.org/wiki/Bauwerksabdichtung' },
          { title: 'Rissinjektion', url: 'https://de.wikipedia.org/wiki/Rissinjektion' },
          { title: 'Weiße Wanne', url: 'https://de.wikipedia.org/wiki/Wei%C3%9Fe_Wanne' },
          { title: 'Bitumen-Dickbeschichtung', url: 'https://de.wikipedia.org/wiki/Kunststoffmodifizierte_Bitumendickbeschichtung' }
        ]} 
        literatur={[ 
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Oswald, R.; Wilmes, K. (2018): Hohlraumfreie Verfüllungen und Rissinjektionen im Betonbau (Fraunhofer IRB Verlag)', 
          'Weber, H. (2020): Mauerwerksabdichtung und Kellersanierung (Expert Verlag)' 
        ]} 
        regelwerke={[ 
          { title: 'DIN 18533 (Abdichtung von erdberührten Bauteilen - Teile 1 bis 3)', url: 'https://www.dinmedia.de/de/suche?q=DIN+18533' }, 
          { title: 'DIN 18534 (Abdichtung von Innenräumen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+18534' },
          { title: 'DIN EN 1504-5 (Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken - Rissinjektion)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1504-5' },
          { title: 'DAfStb-Richtlinie Wasserundurchlässige Bauwerke aus Beton (WU-Richtlinie)', url: 'https://www.dafstb.de/' }
        ]} 
        formeln={[
          {
            formel: 'd_{\\text{dry}} = d_{\\text{wet}} \\cdot \\left(1 - \\frac{\\text{Flüchtige Anteile}}{100}\\right) \\ge d_{\\text{min,Norm}}',
            erklaerung: 'Trockenschichtdicke von polymermodifizierten Bitumendickbeschichtungen (PMBC): Muss nach DIN 18533 an jeder Stelle das normativ geforderte Mindestmaß (z.B. 3.0 bzw. 4,0 mm) einhalten.',
            quelle: 'DIN 18533-3'
          },
          {
            formel: 'p_{\\text{inj}} \\le 0{,}33 \\cdot f_{ctm} \\cdot 10 \\quad [\\text{bar}]',
            erklaerung: 'Richtwert für den maximalen Injektionsdruck bei Rissverpressungen zur Vermeidung von Gefügeschädigungen oder Sekundärrissen im Beton.',
            quelle: 'DIN EN 1504-5 / ZTV-ING'
          }
        ]} 
      />
    </div>
  );
}
