import React, { useState, useMemo } from 'react';
import { Leaf, Activity, Recycle, FileText, ShieldCheck, Scale, Award, Info, Search, GraduationCap, Calculator, HelpCircle, Milestone } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { BlockMath, InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import IngenieurbauLCA from './lca/IngenieurbauLCA';

// Comprehensive EPD Reference Database representing realistic German ÖKOBAUDAT entries for students
const REFERENZEN_EPD = [
  {
    id: 'beton-cem1',
    name: 'Normalbeton C25/30 (CEM I)',
    category: 'Mineralisch',
    einheit: '1 m³',
    density: 2400,
    lambda: 2.10,
    gwp_fossil: 245.0,
    gwp_biogenic: 0.0,
    gwp_total: 245.0,
    penrt: 1850.0,
    ap: 0.45,
    ep: 0.12,
    pcr: 'EN 15804 - Beton',
    quelle: 'ÖKOBAUDAT / DB-Eintrag 2023',
    beschreibung: 'Konventioneller Konstruktionsbeton auf Portlandzementbasis. Hoher Zementklinker-Anteil führt zu ausgeprägtem CO₂-Fußabdruck.'
  },
  {
    id: 'beton-rc',
    name: 'RC-Beton C25/30 (Soll-Rezeptur)',
    category: 'Mineralisch',
    einheit: '1 m³',
    density: 2350,
    lambda: 1.95,
    gwp_fossil: 195.0,
    gwp_biogenic: 0.0,
    gwp_total: 195.0,
    penrt: 1420.0,
    ap: 0.35,
    ep: 0.09,
    pcr: 'EN 15804 - Beton',
    quelle: 'ÖKOBAUDAT / Klimaschutzbetone',
    beschreibung: 'Ressourcenschonender Beton mit ≥ 30 % rezyklierter Gesteinskörnung und klinkerreduziertem Zement (CEM III/A). Geringeres GWP.'
  },
  {
    id: 'ziegel-unfilled',
    name: 'Hochlochziegel (ungefüllt)',
    category: 'Mineralisch',
    einheit: '1 m³',
    density: 800,
    lambda: 0.45,
    gwp_fossil: 220.0,
    gwp_biogenic: 0.0,
    gwp_total: 220.0,
    penrt: 2500.0,
    ap: 1.05,
    ep: 0.20,
    pcr: 'EN 15804 - Mauerziegel',
    quelle: 'DGNB / ÖKOBAUDAT',
    beschreibung: 'Großformatiger Tonziegel für tragende Außenwände. Der Brennprozess ist hochgradig erdgasintensiv (hohes GWP und PENRT).'
  },
  {
    id: 'ziegel-perlite',
    name: 'Wärmedämmziegel (Perlite-gefüllt)',
    category: 'Mineralisch',
    einheit: '1 m³',
    density: 680,
    lambda: 0.07,
    gwp_fossil: 290.0,
    gwp_biogenic: 0.0,
    gwp_total: 290.0,
    penrt: 3100.0,
    ap: 1.25,
    ep: 0.24,
    pcr: 'EN 15804 - Mauerziegel',
    quelle: 'ÖKOBAUDAT / Hersteller-EPD',
    beschreibung: 'Monolithischer Außenwandziegel, dessen Kammern mit vulkanischem Dämmgestein (Perlite) befüllt sind. Sehr guter U-Wertersatz.'
  },
  {
    id: 'bsh-softwood',
    name: 'Brettschichtholz (BSH, Fichte)',
    category: 'Holz',
    einheit: '1 m³',
    density: 480,
    lambda: 0.13,
    gwp_fossil: 110.0,
    gwp_biogenic: -760.0,
    gwp_total: -650.0,
    penrt: 3100.0,
    ap: 0.85,
    ep: 0.21,
    pcr: 'EN 15804 - Nadelholz',
    quelle: 'Holz-Forschung Austria EPD',
    beschreibung: 'Maschinengetrocknetes und geleimtes Konstruktionsholz. Fungiert durch das Holzwachstum als temporäre CO₂-Senke im Einbauzustand.'
  },
  {
    id: 'holzfaser-daemmung',
    name: 'Holzfaserdämmplatte (WF-Dämmung)',
    category: 'Dämmstoffe',
    einheit: '1 m³',
    density: 160,
    lambda: 0.045,
    gwp_fossil: 85.0,
    gwp_biogenic: -240.0,
    gwp_total: -155.0,
    penrt: 1600.0,
    ap: 0.65,
    ep: 0.15,
    pcr: 'EN 15804 - Holzwerkstoffe',
    quelle: 'ÖKOBAUDAT / IBU 2024',
    beschreibung: 'Naturfaser-Wärmedämmplatte aus Sägeresthölzern. Hohes biogenes Speicherpotenzial kombiniert mit sehr gutem sommerlichen Hitzeschutz.'
  },
  {
    id: 'mineralwolle-glass',
    name: 'Glaswolle-Dämmplatte',
    category: 'Dämmstoffe',
    einheit: '1 m³',
    density: 50,
    lambda: 0.035,
    gwp_fossil: 48.0,
    gwp_biogenic: 0.0,
    gwp_total: 48.0,
    penrt: 1250.0,
    ap: 0.42,
    ep: 0.08,
    pcr: 'EN 15804 - Mineralwolle',
    quelle: 'Muster-EPD / Dämmstoffverband',
    beschreibung: 'Anorganischer mineralischer Dämmstoff. Sehr hoher Recyclinganteil (Altglas), langlebig und nicht brennbar (Brandschutzklasse A1).'
  },
  {
    id: 'eps-polystyrol',
    name: 'EPS-Hartschaumplatte',
    category: 'Dämmstoffe',
    einheit: '1 m³',
    density: 20,
    lambda: 0.040,
    gwp_fossil: 65.0,
    gwp_biogenic: 0.0,
    gwp_total: 65.0,
    penrt: 1850.0,
    ap: 0.22,
    ep: 0.05,
    pcr: 'EN 15804 - Schaumkunststoffe',
    quelle: 'ÖKOBAUDAT',
    beschreibung: 'Synthetischer, erdölbasierter Schaumstoffdämmstoff. Sehr leicht, hydrophob, aber hoher fossiler Primärenergiebedarf (PENRT) und schwer trennbar im WDVS.'
  },
  {
    id: 'baustahl-recycled',
    name: 'Baustahl (Elektroofenroute - 100% RC)',
    category: 'Metalle',
    einheit: '1 t',
    density: 7850,
    lambda: 50.0,
    gwp_fossil: 480.0,
    gwp_biogenic: 0.0,
    gwp_total: 480.0,
    penrt: 4800.0,
    ap: 1.15,
    ep: 0.28,
    pcr: 'EN 15804 - Baustähle',
    quelle: 'Bau-EPD GmbH / Eco Steel',
    beschreibung: 'Sekundärstahl, hergestellt durch das Einschmelzen von Stahlschrott im Elektrolichtbogenofen mit europäischem Strommix. Sehr niedriges GWP.'
  },
  {
    id: 'baustahl-primary',
    name: 'Baustahl (Hochofenroute - Primär)',
    category: 'Metalle',
    einheit: '1 t',
    density: 7850,
    lambda: 50.0,
    gwp_fossil: 1850.0,
    gwp_biogenic: 0.0,
    gwp_total: 1850.0,
    penrt: 19500.0,
    ap: 4.85,
    ep: 1.12,
    pcr: 'EN 15804 - Baustähle',
    quelle: 'Durchschnittswert WorldSteel',
    beschreibung: 'Primärstahl, erzeugt über den klassischen Kohle-Hochofen und Konverter. Extrem energieintensiv, führt zu enormer atmosphärischer CO₂-Erhöhung.'
  }
];

export default function LCA() {
  const [activeTab, setActiveTab] = useState<'normen' | 'phasen' | 'indikatoren' | 'epd-db' | 'ingenieurbau' | 'student-guide'>('normen');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [selectedEpdId, setSelectedEpdId] = useState<string>('beton-cem1');

  // Student guide specific state
  const [guideTopic, setGuideTopic] = useState<'produkt' | 'gebaeude' | 'ingenieurbau'>('produkt');
  
  // Interactive student calculator state
  const [calcMaterialId, setCalcMaterialId] = useState<string>('beton-cem1');
  const [calcQuantity, setCalcQuantity] = useState<number>(10);
  const [calcDistance, setCalcDistance] = useState<number>(150);
  const [calcTransportType, setCalcTransportType] = useState<'lkw-heavy' | 'lkw-light' | 'strom-lkw' | 'h2-lkw' | 'zug'>('lkw-heavy');

  // Compute LCA student calculator results
  const calcResults = useMemo(() => {
    const selectedMat = REFERENZEN_EPD.find(m => m.id === calcMaterialId) || REFERENZEN_EPD[0];
    
    const isVolumeBased = selectedMat.einheit.includes('m³');
    const materialQuantityText = isVolumeBased ? `${formatDeWert(calcQuantity)} m³` : `${formatDeWert(calcQuantity)} t`;
    
    // Weight calculation for transport (in tonnes)
    const weightInTonnes = isVolumeBased 
      ? (calcQuantity * selectedMat.density) / 1000 
      : calcQuantity;
      
    // GWP A1-A3
    const gwpA1A3 = selectedMat.gwp_total * calcQuantity;
    
    // Transport factor (kg CO2-eq per tonne-km)
    // Heavy truck: 0.02, Light truck: 0.08, E-Truck: 0.004, H2-Truck: 0.003, train: 0.005
    let transportFactor = 0.02;
    if (calcTransportType === 'lkw-light') transportFactor = 0.08;
    else if (calcTransportType === 'strom-lkw') transportFactor = 0.004;
    else if (calcTransportType === 'h2-lkw') transportFactor = 0.003;
    else if (calcTransportType === 'zug') transportFactor = 0.005;
    
    // GWP A4 (transport) = weightInTonnes * distance * factor
    const gwpA4 = weightInTonnes * calcDistance * transportFactor;
    
    const totalGwp = gwpA1A3 + gwpA4;
    const penrtTotal = selectedMat.penrt * calcQuantity;
    
    return {
      materialName: selectedMat.name,
      materialQuantityText,
      weightInTonnes,
      gwpA1A3,
      gwpA4,
      totalGwp,
      penrtTotal,
      isWood: selectedMat.category === 'Holz' || selectedMat.id.includes('holz')
    };
  }, [calcMaterialId, calcQuantity, calcDistance, calcTransportType]);

  // Filter EPDs
  const filteredEpds = REFERENZEN_EPD.filter(epd => {
    const matchesSearch = epd.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          epd.beschreibung.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || epd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedEpdItem = REFERENZEN_EPD.find(e => e.id === selectedEpdId) || REFERENZEN_EPD[0];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Intro section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Leaf className="text-shiraz animate-pulse" />
          Ökobilanzierung (LCA) im Bauwesen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Ökobilanzierung (Life Cycle Assessment, LCA) ist eine genormte wissenschaftliche Methode zur Erfassung und Bewertung sämtlicher Stoff- und Energieströme, die ein Gebäude oder Bauprodukt im Verlauf seines Produktlebenszyklus in Anspruch nimmt – von der Wiege bis zur Bahre (<strong>Cradle-to-Grave</strong>) oder idealerweise von der Wiege bis zur Wiege (<strong>Cradle-to-Cradle</strong>).
          </p>
        </div>

        {/* Tab Selection */}
        <div className="mt-6 p-4 bg-slate-50/50 rounded-2xl border border-rose-100 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { id: 'normen' as const, label: 'Zertifizierung & Deklarationen', icon: Award },
              { id: 'phasen' as const, label: 'Lebenszyklusphasen (A-D)', icon: Recycle },
              { id: 'indikatoren' as const, label: 'Umweltindikatoren', icon: Activity },
              { id: 'epd-db' as const, label: 'EPD-Musterdatenbank', icon: FileText },
              { id: 'ingenieurbau' as const, label: 'DIN EN 17472 (Ingenieurbau)', icon: Milestone },
              { id: 'student-guide' as const, label: 'Studierenden-Leitfaden', icon: GraduationCap }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center h-full cursor-pointer ${
                    isActive 
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm' 
                      : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-shiraz' : 'text-slate-500'} />
                  <span className="text-xs font-bold leading-tight">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab 1: Normen */}
      {activeTab === 'normen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-350">
          
          {/* ISO Rules Column */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 font-normal">
            <h3 className="font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <Scale size={18} className="text-shiraz" />
              1. Der globale Rahmen: ISO 14040 / 14044
            </h3>
            <p className="text-xs text-slate-800 leading-relaxed">
              Die Rahmennormen <strong>DIN EN ISO 14040</strong> (Prinzipien und Rahmenbedingungen) und <strong>DIN EN ISO 14044</strong> (Anforderungen und Anleitungen) deklarieren firmenunabhängig, wie Produkte bilanziert werden müssen. Sie fordern zwingend eine Struktur aus vier Phasen:
            </p>
            <div className="space-y-3 pt-1">
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-xs">
                <strong className="text-shiraz block mb-1">Phase I: Goal and Scope (Ziel- und Rahmenfestlegung)</strong>
                Zentrale Definition der Rechenregeln, der <strong>Räumlichen und zeitlichen Systemgrenze</strong> (z.B. 50 Jahre Betrachtung) und der <strong>funktionellen Einheit (Functional Unit)</strong>, auf die sich das gesamte mathematische Modell bezieht (z.B. "Bereitstellung von 1 m² Tragwand, die eine Last von 150 kN trägt und U-Wert ≤ 0,20 aufweist").
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-xs">
                <strong className="text-shiraz block mb-1">Phase II: Life Cycle Inventory (Sachbilanz, LCI)</strong>
                Reines mathematisches Mengen-Soll-Konto: Erfassung aller benötigten Inputs (z.B. Kilowattstunden Strom, kg Eisenerz, Liter Diesel) und aller erzeugten materiellen Outputs (Zementstaub, Abwasser, Methanemissionen) entlang der Rohstoffkette.
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-xs">
                <strong className="text-shiraz block mb-1">Phase III: Life Cycle Impact Assessment (Wirkungsabschätzung)</strong>
                Die mathematische Konvertierung von Rohstoffbilanzmengen in konkrete, verständliche Umweltwirkungen über sogenannte Charakterisierungsfaktoren (z.B. wird die Emission von 1 kg gasförmigem Methan mit dem Charakterisierungsfaktor GWP100 (IPCC AR5: 28) multipliziert).
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-xs">
                <strong className="text-shiraz block mb-1">Phase IV: Interpretation (Auswertung)</strong>
                Schlussfolgerung, Definition herrschender Hotspots und Optimierungsmaßnahmen im Materialentwurf.
              </div>
            </div>
          </div>

          {/* Construction specific norms */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 font-normal">
            <h3 className="font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <Award size={18} className="text-shiraz" />
              2. Bauspezifische Regelwerke (EN 15804 / EN 15978 / EN 17472)
            </h3>
            <p className="text-xs text-slate-800 leading-relaxed">
              Weil Bauwerke extrem langlebig und komplex gefügt sind, differenziert das europäische Normungskomitee CEN/TC 350 nach Bauwerkstyp und Betrachtungsebene (unter der gemeinsamen Dachnorm DIN EN 15643):
            </p>

            <div className="space-y-4 pt-1">
              <div className="border-l-4 border-shiraz pl-3 text-xs">
                <strong className="text-slate-900 block font-bold">DIN EN 15804 (Bauprodukt-Ebene)</strong>
                <span className="text-slate-700 leading-relaxed block mt-1">
                  EN 15804+A2 ist die Kern-Produktkategorieregel (Core-PCR) für EPDs von Bauprodukten; Programmbetreiber wie das IBU ergänzen produktspezifische PCR. Hintergrunddatenbanken z. B. ÖKOBAUDAT, ecoinvent, LCA for Experts.
                </span>
              </div>

              <div className="border-l-4 border-home-grau/30 pl-3 text-xs">
                <strong className="text-slate-900 block font-bold">DIN EN 15978 (Gebäude-Ebene / Hochbau)</strong>
                <span className="text-slate-700 leading-relaxed block mt-1">
                  Beschreibt die Rechenmethode zur Bilanzierung von Gebäuden über <strong>50 Jahre Betrachtungszeitraum</strong> unter Summierung aller materiellen EPD-Anteile (Massenbilanz) und der prognostizierten Betriebsenergien (Modul B6).
                </span>
              </div>

              <div className="border-l-4 border-amber-600 pl-3 text-xs bg-amber-50/40 p-2.5 rounded-r-lg">
                <strong className="text-slate-900 block font-bold flex items-center gap-1.5">
                  <Milestone size={13} className="text-amber-700" />
                  DIN EN 17472:2022-09 (Ingenieurbauwerke &amp; Infrastruktur)
                </strong>
                <span className="text-slate-700 leading-relaxed block mt-1">
                  Europäisches Pendant zu EN 15978 für Brücken, Tunnel, Straßen, Bahntrassen und Wasserbauten. Wesentliche Spezifika: Betrachtungszeitraum typisch <strong>80–100+ Jahre</strong> (DIN EN 1990 Auslegungskategorie 5), Dominanz periodischer Bauteilaustauschzyklen (Lager, Fahrbahnübergänge, Asphaltschichten, Korrosionsschutz B2–B5) sowie Quantifizierung von <strong>baustellenbedingten Stau- und Nutzeremissionen (Modul B8)</strong>.
                </span>
              </div>

              <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-200 mt-2 text-xs font-normal">
                <strong className="text-emerald-900 block font-bold mb-1">Qualitätssiegel Nachhaltiges Gebäude (QNG – Stand 2026)</strong>
                Zentrales staatliches Gütesiegel des BMWSB für die KfW-Förderung (Klimafreundlicher Neubau KFN). Das QNG fordert den quantitativen Nachweis der Lebenszyklus-Treibhausgasemissionen (Module A1–C4) und des Primärenergieaufwands (PENRT) über 50 Jahre:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Wohngebäude (WG23, ab 01.01.2023):</strong> QNG-Plus &le; 24 kg CO₂-Äq./(m² NRF·a) und PENRT &le; 96 kWh/(m² NRF·a) · QNG-Premium &le; 20 kg CO₂-Äq./(m² NRF·a) und PENRT &le; 64 kWh/(m² NRF·a).</li>
                  <li><strong>Nichtwohngebäude (NW23):</strong> projektspezifischer Anforderungswert nach dem QNG-Anhangdokument „LCA-Anforderungswert Nichtwohngebäude“ (abhängig von Nutzung und Gebäudetyp).</li>
                  <li><strong>Wichtig:</strong> Gutschriften aus Modul D (Recyclingpotenziale) dürfen nicht mit den Lasten der Phasen A–C verrechnet werden, sondern müssen als gesonderter Informationswert deklariert werden!</li>
                </ul>
              </div>

              {/* CPR Novelle 2024/3110 Box */}
              <div className="bg-blue-50 text-blue-950 p-4 rounded-xl border border-blue-200 text-xs font-normal space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <FileText size={14} className="text-blue-700" />
                  <span>EU-Bauproduktenverordnung (CPR-Novelle / Verordnung (EU) 2024/3110)</span>
                </div>
                <p className="leading-relaxed text-blue-900/90">
                  Seit 2025/2026 novellierter Rechtsrahmen für alle europäischen Bauprodukte mit direkter Relevanz für die Ökobilanzierung:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-blue-900/90">
                  <li><strong>Digitaler Produktpass (DPP):</strong> Maschinenlesbare Bereitstellung aller Material- und Umweltdaten über QR-Code/RFID direkt am Bauteil.</li>
                  <li><strong>Kombinierte DoPC (Declaration of Performance and Conformity):</strong> Pflicht zur Ausweisung von Umweltindikatoren (insb. GWP nach DIN EN 15804+A2) neben den mechanischen Leistungsdaten.</li>
                  <li><strong>AVCP-System 3+:</strong> Einführung eines eigenen Konformitätssystems zur amtlichen Validierung von Ökobilanzen und Umweltdeklarationen durch notifizierte Prüfstellen.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Lebenszyklusphasen */}
      {activeTab === 'phasen' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-350 font-normal">
          <div className="border-b border-home-grau/30 pb-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Recycle className="text-shiraz" />
              Lebenszyklusmodule eines Gebäudes nach DIN EN 15804
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Die Ökobilanz trennt zeitbasierte Abschnitte, um Verschiebungen von Umweltproblemen zu identifizieren.
            </p>
          </div>

          {/* Matrix Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-shiraz tracking-widest block mb-1">A1 - A3</span>
                <strong className="text-slate-900 block text-sm font-bold border-b border-slate-200 pb-1 mb-2">Herstellungsphase</strong>
                <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc pl-4 font-normal">
                  <li><strong>A1:</strong> Rohstoffgewinnung (z.B. Tonabbau, Eisenerzförderung).</li>
                  <li><strong>A2:</strong> Transport zum Herstellerwerk.</li>
                  <li><strong>A3:</strong> Produktion im Werk (Brennöfen, Fräsmaschinen).</li>
                </ul>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-3 select-none">"Cradle-to-Gate" (Werkstor)</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-shiraz tracking-widest block mb-1">A4 - A5</span>
                <strong className="text-slate-900 block text-sm font-bold border-b border-slate-200 pb-1 mb-2">Errichtungsphase</strong>
                <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc pl-4 font-normal">
                  <li><strong>A4:</strong> Transport des fertigen Bauprodukts zur Baustelle.</li>
                  <li><strong>A5:</strong> Einbauvorgang (Kräne, Mörteln, Schaltafelabfälle).</li>
                </ul>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-3 select-none">Einbau im Objekt</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-shiraz tracking-widest block mb-1">B1 - B7</span>
                <strong className="text-slate-900 block text-sm font-bold border-b border-slate-200 pb-1 mb-2">Nutzungsphase</strong>
                <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc pl-4 font-normal">
                  <li><strong>B1-B5:</strong> Nutzung am Bauteil, Instandhaltung, Reparatur (Austauschzyklen).</li>
                  <li><strong>B6:</strong> Betriebsenergiebedarf (Heizen, Kühlen, Hilfsstrom).</li>
                  <li><strong>B7:</strong> Betriebswassereinsatz (Trinkwasser).</li>
                </ul>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-3 select-none">Nutzung (oft 50 Jahre)</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-shiraz tracking-widest block mb-1">C1 - C4</span>
                <strong className="text-slate-900 block text-sm font-bold border-b border-slate-200 pb-1 mb-2">Entsorgungsphase</strong>
                <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc pl-4 font-normal">
                  <li><strong>C1:</strong> Rückbau und kontrollierter Abriss des Gebäudes.</li>
                  <li><strong>C2:</strong> Transport zur Recyclinganlage/Deponie.</li>
                  <li><strong>C3:</strong> Abfallaufbereitung (Brecheranlagen).</li>
                  <li><strong>C4:</strong> Beseitigung (Deponierung).</li>
                </ul>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-3 select-none">"End-of-Life" (Lebensende)</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-shiraz tracking-widest block mb-1">Modul D</span>
                <strong className="text-slate-900 block text-sm font-bold border-b border-slate-200 pb-1 mb-2">Nutzungspotenziale</strong>
                <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc pl-4 font-normal">
                  <li><strong>Recyclinggutschriften:</strong> Substitutionsgutschriften für die Erzeugung von Sekundärbaustoffen.</li>
                  <li><strong>Energetische Gutschriften:</strong> Verwertungsgutschriften durch Müllverbrennungs-Wärmeauskopplung.</li>
                </ul>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-3 select-none">Außerhalb der Systemgrenze</span>
            </div>

          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 text-xs text-slate-700 space-y-3 leading-relaxed">
            <h4 className="font-bold text-shiraz">Kritische wissenschaftliche Schnittstellen &quot;GWP-Biogenic&quot;</h4>
            <p>
              Ein wiederkehrender Streitpunkt in der akademischen Ökobilanzierung ist die Bilanzierung von Holzprodukten. Fichten- oder Tannenholz lagert während des biologischen Wachstums atmosphärisches Kohlendioxid (<InlineMath math="\text{CO}_2" />) per Photosynthese als Zellstoff ein. In der EPD wird dies als <strong>hochgradig negatives GWP-biogenic in Phase A1-A3</strong> verbucht (ca. <InlineMath math="-700 \text{ bis } -800 \text{ kg CO}_2\text{-eq pro m³}" />). Das Gebäude startet rechentechnisch als CO₂-Senke.
            </p>
            <p className="border-l-2 border-shiraz pl-3">
              <strong>Die Fallstricke am Lebensende:</strong> Da jede Massebilanz zu Null aufgehen muss, fordert das Kreislaufprinzip (EN 15804) die modellhafte Rückführung dieser GWP-Menge in der Entsorgungsphase (Modul C3/C4). Wenn ein Holzprodukt nach 50 Jahren energetisch verwertet (verbrannt) wird, muss die eingelagerte CO₂-Menge als <strong>GWP-fossil/biogen in Modul C vollends positiv zurückerfasst</strong> werden. Im Nettoergebnis über den Gesamtlebenszyklus (A+B+C+D) verbleibt der energetische Vorteil durch die Gutschrift in Modul D, die biogene Kohlenstoffspeicherung an sich ist jedoch ein zeitlich befristeter Netto-Null-Effekt.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Indikatoren */}
      {activeTab === 'indikatoren' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 animate-in fade-in duration-350">
          <div className="border-b border-home-grau/30 pb-2">
            <h3 className="text-lg font-bold text-slate-900">Die normierten Umweltindikatoren nach EN 15804</h3>
            <p className="text-xs text-slate-500 mt-0.5">Eine Ökobilanz betrachtet weit mehr als nur Treibhausgase (Carbon Footprinting).</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-home-grau/30 shadow-sm">
            <table className="w-full text-left border-collapse text-xs font-normal">
              <thead>
                <tr className="bg-slate-50 text-slate-900 border-b border-home-grau/30 font-bold">
                  <th className="p-3 font-bold">Code</th>
                  <th className="p-3 font-bold">Akronym &amp; Name</th>
                  <th className="p-3 font-bold">Phänomenologische Erklärung / Umweltschadensbild</th>
                  <th className="p-3 font-bold">Einheit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20 text-slate-700 leading-relaxed font-normal">
                <tr className="bg-shiraz/5">
                  <td className="p-3 font-mono font-bold text-shiraz">GWP-total</td>
                  <td className="p-3 font-bold">Global Warming Potential (Treibhauspotenzial)</td>
                  <td className="p-3">Globaler anthropogener Treibhauseffekt. Summe aus Klimawirkung fossiler Gase, biogener Quellen und Forstbewirtschaftung. Bindet atmosphärische Infrarotstrahlung.</td>
                  <td className="p-3 font-mono font-bold text-shiraz">kg CO₂-eq</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold">ODP</td>
                  <td className="p-3 font-bold">Ozone Depletion Potential (Ozonabbaupotenzial)</td>
                  <td className="p-3">Zerstörungsrate der stratosphärischen Ozonschicht (Ozonloch) durch flüchtige halogenierte Kohlenwasserstoffe (FCKW, Halone), wodurch vermehrt schädliche UV-B-Strahlung die Erdoberfläche erreicht.</td>
                  <td className="p-3 font-mono">kg CFC-11-eq</td>
                </tr>
                <tr className="bg-amber-50/20">
                  <td className="p-3 font-mono font-bold text-amber-900">AP</td>
                  <td className="p-3 font-bold text-amber-950">Acidification Potential (Versauerungspotenzial)</td>
                  <td className="p-3 text-amber-950">Erhöhung der Wasserstoffionen-Konzentration in Waldböden und Binnengewässern durch Schwefeldioxid (<InlineMath math="\text{SO}_2" />) und Stickoxide (&quot;Saurer Regen&quot;). Führt zu Waldsterben.</td>
                  <td className="p-3 font-mono text-amber-900">mol H⁺-eq</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold">EP-freshwater</td>
                  <td className="p-3 font-bold">Eutrophication Potential (Überdüngung Süßwasser)</td>
                  <td className="p-3">Eintrag von limitierenden Phosphat-Nährstoffen in stehende und fließende Gewässer. Führt zu Algenblüten, Gewässerkippen und Fischsterben.</td>
                  <td className="p-3 font-mono">kg PO₄-eq</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 font-mono font-style">POCP</td>
                  <td className="p-3 font-bold">Photochemical Ozone Creation Potential (Sommersmog)</td>
                  <td className="p-3">Bildung korrosiver Photooxidantien (Bodennahes Ozon) durch Reaktion von flüchtigen Kohlenwasserstoffen (VOC) mit Stickoxiden unter Sonneneinstrahlungs-Katalyse. Atembeschwerden.</td>
                  <td className="p-3 font-mono">kg NMVOC-eq</td>
                </tr>
                <tr className="bg-indigo-50/10">
                  <td className="p-3 font-mono font-bold text-indigo-900">PENRT</td>
                  <td className="p-3 font-bold text-indigo-950">Primary Energy Non-Renewable Total</td>
                  <td className="p-3 text-indigo-950">Gesamter fossiler und nuklearer Energieträgereinsatz (Erdöl, Erdgas, Kohle, Uran) zur thermischen/stofflichen Nutzung. Maßstab für Ressourcenerschöpfung.</td>
                  <td className="p-3 font-mono text-indigo-900">MJ</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold">PERE</td>
                  <td className="p-3 font-bold">Primary Energy Renewable</td>
                  <td className="p-3">Verbrauch von Primärenergieträgern aus unerschöpflichen Umweltquellen (Sonne, Wind, Wasserkraft, biogene Festbrennstoffe). Indikator für Energieeffizienz.</td>
                  <td className="p-3 font-mono">MJ</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mathematical Section */}
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 mt-4 font-normal">
            <h4 className="font-bold text-slate-900 text-sm mb-2">Mathematischer Rechenalgorithmus eines Gebäude-LCA</h4>
            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              Für ein komplettes Bauwerk berechnet sich die Gesamtwirkung eines bestimmten Umweltindikators <InlineMath math="I_{Ges}" /> (z.B. GWP-Emissionsfracht) als Vektorprodukt aus den Bauteil-Massen <InlineMath math="m_i" /> (aus der Massenermittlung) und den spezifischen EPD-Koeffizienten <InlineMath math="e_i" />:
            </p>
            <div className="flex justify-center my-4">
              <BlockMath math="I_{Ges} = \sum_{i=1}^{n} \left( m_i \cdot e_{i, \text{Herstellung}} \right) + I_{\text{Ersatz}} + I_{\text{Betrieb}} + I_{\text{Rückbau}} + I_{\text{Modul D}}" />
            </div>
            <div className="text-[11px] text-slate-500 leading-normal space-y-1 mt-2">
              <div>&bull; <InlineMath math="m_i" />: Eingebaute Werkstoffmasse oder Bauteilvolumen (z.B. <InlineMath math="85 \text{ m³}" /> RC-Beton).</div>
              <div>&bull; <InlineMath math="e_{i, \text{Herstellung}}" />: Spezifischer EPD-Faktor für A1-A3 aus der ÖKOBAUDAT (z.B. <InlineMath math="195 \text{ kg CO}_2\text{-eq / m³}" />).</div>
              <div>&bull; <InlineMath math="I_{\text{Ersatz}}" />: Aufsummierter Materialaufwand durch Verschleiß und regelmäßigen Austausch während der Nutzungszeit (z.B. Erneuerung Dachabdichtung alle 25 Jahre).</div>
              <div>&bull; <InlineMath math="I_{\text{Betrieb}}" />: Rechnungsenergie-Footprint der Heizungs-/Lüftungsanlagen über die Lebensdauer (z.B. 50 Jahre).</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: EPD Database Inspector */}
      {activeTab === 'epd-db' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-350 font-normal">
          
          {/* List and search bar (5-cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">Referenz-Materialdatenbank</h4>
              
              {/* Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Material suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-home-grau/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-shiraz bg-white"
                />
              </div>

              {/* Category selector */}
              <div className="flex flex-wrap gap-1">
                {['Alle', 'Mineralisch', 'Holz', 'Dämmstoffe', 'Metalle'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-colors ${
                      selectedCategory === cat
                        ? 'bg-shiraz text-white border-shiraz'
                        : 'bg-slate-50 text-slate-500 border-home-grau/30 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-home-grau/30 shadow-sm max-h-[450px] overflow-y-auto divide-y divide-home-grau/15">
              {filteredEpds.length > 0 ? (
                filteredEpds.map((epd) => (
                  <button
                    key={epd.id}
                    onClick={() => setSelectedEpdId(epd.id)}
                    className={`w-full p-3 text-left transition-colors flex flex-col gap-1 ${
                      selectedEpdId === epd.id ? 'bg-shiraz/5 border-l-4 border-shiraz' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 leading-tight">{epd.name}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0">{epd.category}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-normal">
                      <span>Dekl. Einheit: <strong>{epd.einheit}</strong></span>
                      <span className="font-mono text-shiraz font-bold">GWP: {formatDeWert(epd.gwp_total)} kg CO₂-eq</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  Keine Materialien gefunden...
                </div>
              )}
            </div>
          </div>

          {/* EPD Factsheet display (7-cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 h-full flex flex-col justify-between">
              
              <div>
                <div className="border-b border-home-grau/30 pb-3 mb-4 flex justify-between items-start">
                  <h3 className="text-xl font-bold text-text-main flex items-center gap-2">{selectedEpdItem.name}</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Typenklasse: {selectedEpdItem.category}
          </p>
        </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                    <ShieldCheck size={12} /> Verifiziert PCR
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-6 bg-slate-50 p-3 rounded-lg border border-home-grau/30">
                  {selectedEpdItem.beschreibung}
                </p>

                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3 border-b border-home-grau/30 pb-1 flex items-center gap-1">
                  <Activity size={12} className="text-shiraz" />
                  Ökobilanz-Kernindikatoren (Modul A1-A3)
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-home-grau/30 text-center">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">GWP Gesamt</span>
                    <strong className="text-xs font-mono font-bold text-shiraz mt-1 block">{formatDeWert(selectedEpdItem.gwp_total)}</strong>
                    <span className="text-[9px] text-slate-400 block">kg CO₂-eq / {selectedEpdItem.einheit}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-home-grau/30 text-center">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Fossiles GWP</span>
                    <strong className="text-xs font-mono font-bold text-slate-900 mt-1 block">{formatDeWert(selectedEpdItem.gwp_fossil)}</strong>
                    <span className="text-[9px] text-slate-400 block">kg CO₂-eq / {selectedEpdItem.einheit}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-home-grau/30 text-center">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Primärenergie</span>
                    <strong className="text-xs font-mono font-bold text-indigo-700 mt-1 block">{formatDeWert(selectedEpdItem.penrt)}</strong>
                    <span className="text-[9px] text-slate-400 block">MJ / {selectedEpdItem.einheit}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-home-grau/30 text-center">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Versauerung</span>
                    <strong className="text-xs font-mono font-bold text-slate-900 mt-1 block">{formatDeZahl(selectedEpdItem.ap, 3)}</strong>
                    <span className="text-[9px] text-slate-400 block">mol H⁺-eq / {selectedEpdItem.einheit}</span>
                  </div>

                </div>

                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3 border-b border-home-grau/30 pb-1 flex items-center gap-1">
                  <Info size={12} className="text-shiraz" />
                  Metadaten &amp; bauphysikalische Deklaration
                </h4>

                <div className="space-y-2 text-xs font-normal">
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-slate-500">Anwendbare PCR-Zulassungsregel:</span>
                    <span className="font-mono font-semibold">{selectedEpdItem.pcr}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-slate-500">Amtliche Datenquelle:</span>
                    <span className="font-mono font-semibold">{selectedEpdItem.quelle}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-slate-500">Spezifische Rohdichte:</span>
                    <span className="font-mono font-semibold">{formatDeWert(selectedEpdItem.density)} kg/m³</span>
                  </div>
                  <div className="flex justify-between pb-1.5">
                    <span className="text-slate-500">Wärmeleitfähigkeit (Wärmeleitzahl λ):</span>
                    <span className="font-mono font-semibold text-shiraz font-bold">{formatDeZahl(selectedEpdItem.lambda, 3)} W/(m·K)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-3 border-t border-home-grau/30 bg-slate-50 p-3 rounded-lg border text-[10px] text-slate-500 leading-normal flex items-start gap-1.5">
                <Info size={14} className="text-shiraz shrink-0 mt-0.5" />
                <span>
                  <strong>Anwendungstipp für Berechnungen:</strong> Will man dieses Material in einem Wandaufbau einsetzen, berechnen wir die Schichtmasse pro Quadrater: <InlineMath math="m = \text{Dicke [m]} \times 1\text{m} \times 1\text{m} \times \text{Rohdichte [kg/m³]}" />. Diese Masse multipliziert man mit den obigen indizierten EPD-Koeffizienten.
                </span>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Tab 5: DIN EN 17472 (Ingenieurbauwerke & Infrastruktur) */}
      {activeTab === 'ingenieurbau' && (
        <div className="animate-in fade-in duration-300">
          <IngenieurbauLCA />
        </div>
      )}

      {/* Tab 6: Student Guide Component */}
      {activeTab === 'student-guide' && (
        <div className="space-y-6 animate-in fade-in duration-350">
          
          {/* Main Info Banner */}
          <div className="bg-white border border-home-grau/30 p-6 rounded-2xl flex flex-col gap-3 shadow-sm">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              <GraduationCap className="text-shiraz" size={24} /> Akademischer Leitfaden zur Ökobilanzierung (LCA)
            </h3>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Ein strukturierter Begleiter für Bachelor-, Master- und Promotionsarbeiten. Lernen Sie die normkonforme Erstellung von Ökobilanzen nach DIN EN 15804 (Bauprodukte), DIN EN 15978 (Gebäude) und für langlebige Infrastrukturbauten (Ingenieurbauwerke).
              </p>
            </div>
          </div>

          {/* Guide Subtabs Selectors */}
          <div className="bg-white border border-home-grau/30 rounded-xl p-4 shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-3 font-mono">
              Untersuchungsgegenstand wählen:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'produkt' as const, title: 'LCA für Bauprodukte', desc: 'DIN EN 15804 + A2 (EPD Erstellung)', color: 'border-l-indigo-500' },
                { id: 'gebaeude' as const, title: 'LCA für Gebäude', desc: 'DIN EN 15978 & QNG-Anforderungen', color: 'border-l-emerald-500' },
                { id: 'ingenieurbau' as const, title: 'LCA für Ingenieurbauwerke', desc: '100 Jahre Nutzungsdauer & Brücken/Tunnel', color: 'border-l-amber-500' }
              ].map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setGuideTopic(topic.id)}
                  className={`text-left p-3.5 rounded-xl border border-l-4 transition-all hover:bg-slate-50 relative ${topic.color} ${
                    guideTopic === topic.id 
                    ? 'bg-slate-50/70 text-slate-950 font-bold border-home-grau/30 shadow-sm' 
                    : 'bg-white border-home-grau/30 text-slate-600'
                  }`}
                >
                  <strong className="text-xs block text-slate-900 font-bold">{topic.title}</strong>
                  <span className="text-[10px] text-slate-400 block font-normal mt-0.5 leading-tight">{topic.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guide Main Flow Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Steps Flow (8-cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {guideTopic === 'produkt' && (
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
                  <div className="border-b pb-3.5">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider font-mono">Modul 1: Bauprodukte</span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-0.5 font-sans">
                      Erstellung einer Umweltproduktdeklaration (EPD) nach ISO 14025 &amp; EN 15804
                    </h4>
                  </div>

                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">1</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Festlegung der Funktionellen / Deklarierten Einheit</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Bevor Daten erhoben werden, muss der physikalische Bezug feststehen. Bei Bauprodukten unterscheidet man:
                        </p>
                        <ul className="text-[11px] list-disc pl-4 text-slate-500 space-y-1 my-1">
                          <li><strong>Deklarierte Einheit:</strong> Reiner Stoffbezug ohne spezifische Wandfunktion (z.B. <InlineMath math="1 \text{ m³}" /> Normalbeton oder <InlineMath math="1 \text{ t}" /> Angewandter Baustahl).</li>
                          <li><strong>Funktionelle Einheit:</strong> Bezieht sich auf eine Bauteilleistung über einen Zeithorizont (z.B. &quot;Bereitstellung von 1 m² Tragwand mit U-Wert ≤ 0,25 W/m²K über 50 Jahre&quot;).</li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">2</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Deklaration der Systemgrenzen (Modul-Szenarien)</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Soll die EPD nur die Herstellung deklarieren oder den ganzen Lebensweg umfassen? Seit der Novelle der <strong>DIN EN 15804+A2</strong> ist &quot;Cradle-to-Gate mit Optionen&quot; der absolute Standard:
                        </p>
                        <div className="bg-slate-50 p-3 rounded-lg border text-[11px] text-slate-600 font-sans my-2">
                          <strong>Mitzuführende Pflichtmodule:</strong> Herstellung (A1–A3), Entsorgungsphase (C1–C4) und die potenziellen Gutschriften außerhalb der Systemgrenze (Modul D). Die Module A4 (Transport), A5 (Einbau) und B1–B7 (Nutzung) sind in reinen Produkt-EPDs meist optional.
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">3</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Sachbilanz [LCI - Life Cycle Inventory]</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Zelluläre Datenanalyse aller Inputs und Outputs. Für ein Betonwerk bedeutet das: Erfassung aller verbrauchten Tonnen Klinker, aller kWh Strom für die Mischer, des Dieselverbrauchs der Radlader sowie aller emittierten Gase und Abwässer pro deklarierte Einheit.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">4</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Wirkungsabschätzung [LCIA] &amp; PCR-Verifizierung</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Die Datenströme werden über wissenschaftliche Wirkungsindikatoren übersetzt:
                        </p>
                        <div className="flex justify-center my-2">
                          <BlockMath math="\text{Umweltwirkung (z.B. GWP)} = \sum \left( \text{Stoffmenge} \times \text{Charakterisierungsfaktor} \right)" />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Die Berechnung erfolgt über standardisierte Software (z.B. SimaPro, GaBi). Der fertige Bericht durchläuft danach ein unabhängiges Expertenprüfverfahren (Verifizierungsrat des IBU - Instituts für Bauen und Umwelt e.V.) zur Freigabe als fertige EPD.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {guideTopic === 'gebaeude' && (
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
                  <div className="border-b pb-3.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider font-mono">Modul 2: Gebäude-LCA</span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-0.5 font-sans">
                      Ökobilanzierung kompletter Hochbauten nach DIN EN 15978 und QNG-Kriterien
                    </h4>
                  </div>

                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">1</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Gebäudedaten &amp; Bezugshorizont festlegen (NRF / BGF)</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Der Bezugsmaßstab für Hochbauten im QNG ist die Netto-Raumfläche NRF (R) nach DIN 277:2021-08; andere Systeme verwenden teils die Brutto-Grundfläche (BGF). Der standardisierte Betrachtungszeitraum für die Lebenszyklussimulation beträgt im deutschen QNG-System ausnahmslos <strong>50 Jahre</strong>.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">2</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Massenermittlung und Bauteilgliederung (BIM-As-Built)</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Gewinnung aller physikalischen Bauteildaten des Gebäudes. Nach DIN 276 werden die Massen den Kostengruppen (KG 300 Baukonstruktion und KG 400 Technische Anlagen) zugeordnet. Ein exaktes BIM-Modell ermöglicht hierbei die automatisierte Übergabe der Kubaturen von Fundamenten, Außenwänden, Decken, Fenstern und Fußbodenaufbauten.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">3</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Zuweisung der BBSR-Nutzungsdauern (Austauschzyklen)</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Nicht alle Bauteile halten 50 Jahre. Für die Nutzungsphase (Module B3/B4) müssen die offiziellen Lebensdauern des BBSR (Bundesinstitut für Bau-, Stadt- und Raumforschung) herangezogen werden:
                        </p>
                        <div className="bg-slate-50 p-3 rounded-lg border text-[11px] text-slate-600 font-mono my-2 space-y-1">
                          <div>&bull; Tragendes Stahlbetonskelett: &gt; 50 Jahre (0 Austausche nötig)</div>
                          <div>&bull; Außenfenster (Holz/Alu): 25 Jahre (1 Austausch im Jahr 25 nötig)</div>
                          <div>&bull; Elastische Flachdachabdichtung: 20 Jahre (2 Austausche in 50 Jahren nötig)</div>
                        </div>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">4</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Datenverknüpfung mit der ÖKOBAUDAT</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Jeder Bauteilmasse wird ihr spezifischer EPD-Kennwert aus der deutschen Referenzdatenbank ÖKOBAUDAT zugeordnet. Es werden die Module A1–A3, C3, C4 und D flächendeckend summiert.
                        </p>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">5</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Bilanzierung der Betriebsenergie (Modul B6)</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Ausweisung des prognostizierten jährlichen Endenergiebedarfs für Heizung, Kühlung, Lüftung, Warmwasserbereitung und Hilfsstrom gem. Gebäudeenergiegesetz (GEG) über das Rechenverfahren der DIN V 18599. Multipliziert mit dem spezifischen künftigen Emissionsfaktor des deutschen Strom-/Gas-/Fernwärmemixes.
                        </p>
                      </div>
                    </div>

                    {/* Step 6 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">6</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Synthese &amp; Abgleich mit den QNG-Schwellenwerten</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Die aufsummierten Lebenszyklus-Emissionen (<InlineMath math="\text{GWP}_{105}" /> in kg CO₂-eq pro m² NRF und Jahr) werden mit den harten Grenzschranken des QNG-Siegels (Plus/Premium) abgeglichen, um die staatliche KfW-Förderung freizugeben.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {guideTopic === 'ingenieurbau' && (
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
                  <div className="border-b pb-3.5">
                    <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider font-mono">Modul 3: Ingenieurbauwerke</span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-0.5 font-sans">
                      Ökobilanzierung von Brücken, Tunneln und Stützwänden (Sonderregelungen)
                    </h4>
                  </div>

                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-amber-100 border border-amber-200 text-amber-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">1</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Festlegung des regulativen Bezugsmaßstabs (100 Jahre Nutzungsdauer)</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Im Gegensatz zum Hochbau (50 Jahre) schreibt der Leitfaden für Straßenbahn- und Eisenbahnbrücken sowie für Tunnelkonstruktionen eine theoretische Nutzungsdauer von <strong>100 Jahren</strong> vor. Dies verschiebt die Lebenszyklusbewertung deutlich.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-amber-100 border border-amber-200 text-amber-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">2</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Fokus auf Primärsubstanz (Dominanz von Beton und Stahl)</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Im Ingenieurbau dominieren massive Strukturen. Instandhaltungsmassen dünner Ausbauschichten sind vernachlässigbar. Über 95% der grauen Emissionen lagern in:
                        </p>
                        <ul className="text-[11px] list-disc pl-4 text-slate-500 space-y-1 my-1">
                          <li><strong>Unterbauten:</strong> Pfahlgründungen, massive Pfeiler und Widerlager aus schlagzähem Beton C30/37 oder C35/45.</li>
                          <li><strong>Überbauten:</strong> Spannbetonhohlkasten, Verbundträger mit massivem Baustahlschnitt und Vorspannstählen.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-amber-100 border border-amber-200 text-amber-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">3</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Erfassung bautechnischer Prozesse (Modul A5)</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Während der Baustellenprozess im Hochbau energetisch oft kaum ins Gewicht fällt, fordert der Brücken- und Tunnelbau eine detaillierte Ausarbeitung von Modul A5:
                        </p>
                        <div className="bg-slate-50 p-2.5 rounded border text-[11px] text-slate-600 leading-normal my-1">
                          Erfassung des Treibstoffbedarfs schwerer Großgeräte, Transport von Rammgeräten, Aufwand für temporäre Hilfsgerüste, Spundwände, Spritzbetonsicherungen und Schalwagenfahrten im Tunnelvortrieb.
                        </div>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 bg-amber-100 border border-amber-200 text-amber-700 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm">4</div>
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-950 block font-bold">Instandhaltungsszenarien und Bauwerkserneuerung (B3–B5)</strong>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          Aufgrund der harten Witterungsbelastung und mechanischen Beanspruchung fallen periodische Instandhaltungen stark ins Gewicht. Im Rechenmodell über 100 Jahre müssen folgende Zyklen veranschlagt werden:
                        </p>
                        <div className="bg-slate-50 p-3 rounded-lg border text-[11px] text-slate-600 font-mono my-2 space-y-1">
                          <div>&bull; Fahrbahnbelag (Asphalt): Austausch alle 15–20 Jahre (ca. 5 Erneuerungen)</div>
                          <div>&bull; Brückenkappen und Abdichtungen: Erneuerung alle 30–35 Jahre</div>
                          <div>&bull; Brückenlager und Fahrbahnübergänge: Austausch alle 25–30 Jahre</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Student Deliverables checklist (4-cols) */}
            <div className="lg:col-span-4 bg-white border border-home-grau/30 p-5 rounded-2xl shadow-sm space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-shiraz" />
                Checkliste für Studienarbeiten
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Folgende Leistungsbestandteile müssen Sie in einer typischen seminar- oder abschlussbezogenen Ökobilanzierung dokumentieren:
              </p>

              <div className="space-y-2.5 text-xs">
                {[
                  { check: true, text: 'Definierte Ziel- & Systemgrenzen' },
                  { check: true, text: 'Verteilte BBSR-Austauschzyklen' },
                  { check: true, text: 'Vollständige Massenauszugsliste' },
                  { check: true, text: 'ÖKOBAUDAT Kennwert-Referenzen' },
                  { check: true, text: 'Ausweisung GWP, PENRT und AP' },
                  { check: true, text: 'Auswertungs- & Optimierungsbericht' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded border border-home-grau/30">
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                    <span className="text-[11px] text-slate-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-shiraz/5 border border-shiraz/10 p-3.5 rounded-xl text-[10.5px] text-slate-700 leading-relaxed">
                <h5 className="font-bold text-shiraz mb-1">💡 Korrekte Zitierweise:</h5>
                <span>
                  &quot;Sämtliche Ökobilanzwerte (GWP, PENRT) stammen aus den verifizierten Umweltproduktdeklarationen (EPDs) der ÖKOBAUDAT (Jahr 2023/2024), berechnet nach DIN EN 15804.&quot;
                </span>
              </div>
            </div>

          </div>

          {/* Dynamic Interactive Student Calculator Section */}
          <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm">
            <div className="border-b pb-3 mb-5">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 font-sans">
                <Calculator className="text-shiraz" size={18} /> Interaktiver Ökobilanz-Übungsrechner (Phasen A1-A4)
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-sans">
                Modellieren Sie spielerisch den Treibhausgas-Impact (GWP) eines Bauteils durch Auswahl des Baustoffs, der Menge und des Transportweges zur fiktiven Baustelle.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Inputs Box (5-cols) */}
              <div className="lg:col-span-5 bg-slate-50 border border-home-grau/30 rounded-xl p-4 md:p-5 space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Simulations-Steuerung</span>

                {/* Input 1: Material selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-slate-700">1. Baustoff-Datensatz (EPD):</label>
                  <select aria-label="1. Baustoff-Datensatz (EPD)"
                    value={calcMaterialId}
                    onChange={(e) => setCalcMaterialId(e.target.value)}
                    className="w-full text-xs p-2 border border-home-grau/30 bg-white rounded-lg focus:ring-1 focus:ring-shiraz focus:outline-none"
                  >
                    {REFERENZEN_EPD.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.name} ({mat.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Input 2: Quantity slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-700">
                    <label>2. Menge:</label>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border">
                      {formatDeWert(calcQuantity)} {REFERENZEN_EPD.find(m => m.id === calcMaterialId)?.einheit.split(' ')[1] || 'Einheiten'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="150"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>1</span>
                    <span>150</span>
                  </div>
                </div>

                {/* Input 3: Transport slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-700">
                    <label>3. Distanz zur Baustelle (A4):</label>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border">{formatDeWert(calcDistance)} km</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={calcDistance}
                    onChange={(e) => setCalcDistance(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>10 km</span>
                    <span>1000 km</span>
                  </div>
                </div>

                {/* Input 4: Transport Medium */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-slate-700">4. Transportmittel (A4):</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-center text-[9.5px]">
                    {[
                      { id: 'lkw-heavy' as const, label: 'Diesel-LKW 40t', detail: 'Euro 6 (0,020 kg/tkm)' },
                      { id: 'lkw-light' as const, label: 'Diesel-LKW 7,5t', detail: 'Nahverkehr (0,080 kg/tkm)' },
                      { id: 'strom-lkw' as const, label: 'Elektro-LKW (eTruck)', detail: 'Ökostrom-Laden (0,004 kg/tkm)' },
                      { id: 'h2-lkw' as const, label: 'Wasserstoff-LKW', detail: 'H2-Brennstoffzelle (0,003 kg/tkm)' },
                      { id: 'zug' as const, label: 'Güterzug (Bahn)', detail: 'E-Schienengüter (0,005 kg/tkm)' }
                    ].map((trans) => (
                      <button
                        key={trans.id}
                        type="button"
                        onClick={() => setCalcTransportType(trans.id)}
                        className={`p-2 rounded-lg border transition-all flex flex-col items-center justify-center ${
                          calcTransportType === trans.id
                          ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold'
                          : 'bg-white border-home-grau/30 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-bold leading-tight">{trans.label}</span>
                        <span className="text-[7.5px] text-slate-400 leading-none mt-0.5">{trans.detail}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Outputs Box (7-cols) */}
              <div className="lg:col-span-7 bg-white border border-home-grau/30 rounded-xl p-5 md:p-6 space-y-6 flex flex-col justify-between">
                
                {/* Result header cards */}
                <div>
                  <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Berechnete Treibhausgasbilanz</span>
                      <h5 className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">
                        Objekt: {calcResults.materialQuantityText} x {calcResults.materialName}
                      </h5>
                    </div>
                    <div className="bg-slate-100 rounded px-2.5 py-1 text-center font-mono">
                      <span className="text-[9px] text-slate-400 block leading-none font-bold">BRUTTOGEWICHT</span>
                      <strong className="text-xs text-slate-700 font-bold block mt-0.5">{formatDeZahl(calcResults.weightInTonnes, 2)} t</strong>
                    </div>
                  </div>

                  {/* Impact split */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-center">
                    
                    <div className="bg-slate-50 border border-home-grau/30 p-3 rounded-lg flex flex-col justify-center">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">A1-A3 Herstellung</span>
                      <strong className={`text-sm font-mono font-bold mt-1 ${calcResults.gwpA1A3 < 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {formatDeZahl(calcResults.gwpA1A3, 1)}
                      </strong>
                      <span className="text-[8.5px] text-slate-400 block font-mono">kg CO₂-eq</span>
                    </div>

                    <div className="bg-slate-50 border border-home-grau/30 p-2.5 rounded-lg flex flex-col justify-center">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">A4 Transportdistanz</span>
                      <strong className="text-sm font-mono font-bold text-amber-700 mt-1">
                        {formatDeZahl(calcResults.gwpA4, 1)}
                      </strong>
                      <span className="text-[8.5px] text-slate-400 block font-mono">kg CO₂-eq</span>
                    </div>

                    <div className="bg-shiraz/5 border border-shiraz/10 p-3 rounded-lg flex flex-col justify-center">
                      <span className="text-[9px] uppercase font-bold text-shiraz tracking-wider block">Gesamt GWP (A1-A4)</span>
                      <strong className={`text-base font-mono font-black mt-0.5 ${calcResults.totalGwp < 0 ? 'text-emerald-700' : 'text-shiraz'}`}>
                        {formatDeZahl(calcResults.totalGwp, 1)}
                      </strong>
                      <span className="text-[8.5px] text-slate-400 block font-mono">kg CO₂-eq</span>
                    </div>

                  </div>

                  {/* Visualization of GWP breakdown (Stacked Bar) */}
                  <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-home-grau/30">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block">Emissionen-Anteil Verteilung (GWP)</span>
                    
                    {calcResults.totalGwp > 0 ? (
                      <div>
                        {/* Relative width breakdown */}
                        <div className="h-5 rounded-md overflow-hidden flex w-full my-1.5 relative border border-home-grau/30">
                          {/* A1-A3 Bar (min clamped) */}
                          <div 
                            className="bg-slate-400 text-[9px] text-white font-mono font-bold flex items-center justify-center transition-all duration-300 hover:opacity-90 cursor-pointer"
                            style={{ width: `${Math.max(10, (calcResults.gwpA1A3 / calcResults.totalGwp) * 100)}%` }}
                            title={`A1-A3: ${formatDeZahl(calcResults.gwpA1A3, 1)} kg`}
                          >
                            {((calcResults.gwpA1A3 / calcResults.totalGwp) * 100) > 15 ? 'A1-A3' : ''}
                          </div>
                          {/* A4 Bar (transport) */}
                          <div 
                            className="bg-amber-500 text-[9px] text-white font-mono font-bold flex items-center justify-center transition-all duration-300 hover:opacity-90 cursor-pointer"
                            style={{ width: `${Math.max(10, (calcResults.gwpA4 / calcResults.totalGwp) * 100)}%` }}
                            title={`A4: ${formatDeZahl(calcResults.gwpA4, 1)} kg`}
                          >
                            {((calcResults.gwpA4 / calcResults.totalGwp) * 100) > 15 ? 'A4' : ''}
                          </div>
                        </div>
                        <div className="flex gap-4 justify-between text-[9px] text-slate-400 font-mono">
                          <span className="flex gap-1 items-center">
                            <span className="w-2 h-2 rounded bg-slate-400 inline-block" /> Herstellung: {formatDeWert(Math.round((calcResults.gwpA1A3 / calcResults.totalGwp) * 100))}%
                          </span>
                          <span className="flex gap-1 items-center">
                            <span className="w-2 h-2 rounded bg-amber-500 inline-block" /> Transport: {formatDeWert(Math.round((calcResults.gwpA4 / calcResults.totalGwp) * 100))}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10.5px] leading-relaxed text-emerald-800 p-2 bg-emerald-50 rounded border border-emerald-100 font-sans">
                        🌳 <strong>Kohlenstoffspeicher-Szenario:</strong> Aufgrund des biogenen Anteils ist der Gesamtwert negativ. Im realen Lebenszyklus wird dieser CO₂-Vorteil am Lebensende (Modul C3) wieder positiv freigesetzt (Massen-Null-Ausgleich).
                      </div>
                    )}
                  </div>
                </div>

                {/* dynamic tutor response advice */}
                <div className="mt-4 p-4 bg-indigo-50/40 border border-indigo-150 rounded-xl flex gap-3 items-start text-xs text-slate-700">
                  <HelpCircle size={16} className="text-indigo-650 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-bold text-indigo-950 block">💡 Tutor-Optimierungsberatung:</strong>
                    {calcResults.isWood ? (
                      <p className="leading-relaxed">
                        Sehr gute Holzwahl! Durch die Kohlenstoffspeicherung weist Brettschichtholz eine unschlagbare A1-A3-Bilanz auf. Beachten Sie jedoch, dass bei weiten Transportwegen (z.B. {formatDeWert(calcDistance)} km) mit Kleintransportern der Transportfaktor (A4) den Umweltvorteil stark schmälert. Versuchen Sie stets, dezentrales Nadelholz aus maximal 50-100 km Umkreis zu spezifizieren.
                      </p>
                    ) : (
                      <div>
                        {calcResults.gwpA4 > (calcResults.gwpA1A3 * 0.3) ? (
                          <p className="leading-relaxed">
                            Achtung! Die Transport-Emissionen (Modul A4) betragen über 30 % der Herstellungsfracht. Bei großen Entfernungen ({formatDeWert(calcDistance)} km) ist ein Umstieg von LKW auf die <strong>Schienen-Bahnfracht</strong> angeraten, um die Transportfracht um ca. 75 % zu minimieren, oder lerne, Baustoffwerke im Regionalradius zu bemühen.
                          </p>
                        ) : (
                          <p className="leading-relaxed">
                            Die Transportfracht ist gut gedeckelt. Die größte Stellschraube liegt hier in der Klinkerminderung des Materials selbst. Ein Umstieg von klassischen CEM I-Betonen auf CEM III/A Klimabeispiele (z.B. RC-Betonsysteme) senkt den Footprint (A1-A3) Ihres Tragwerkes sofort und anstrengungslos um ca. 20 %.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
              
            </div>

            {/* Methodical Warning / Equivalent Performance Tip */}
            <div className="mt-6 p-4.5 bg-amber-50/40 border border-amber-200/50 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center text-xs shadow-sm">
              <div className="bg-amber-100/50 text-amber-800 p-2.5 rounded-lg border border-amber-200/40 shrink-0">
                <Scale size={20} />
              </div>
              <div className="space-y-1">
                <strong className="text-amber-950 font-bold block text-[11.5px] font-sans">
                  ⚠️ Methodischer Grundsatz: Deklarierte Einheit vs. Funktionelle Einheit &amp; Leistungsfähigkeit
                </strong>
                <p className="text-slate-600 leading-relaxed text-[11px] font-sans">
                  <strong>Wichtiger Hinweis zum Baustoffvergleich:</strong> Vergleichen Sie verschiedene Baustoffe (z.B. <InlineMath math="1\text{ m³}" /> Brettschichtholz vs. <InlineMath math="1\text{ m³}" /> Normalbeton) niemals unreflektiert auf Basis ihres reinen Volumens (<InlineMath math="\text{m³}" />) oder ihrer reinen Masse (<InlineMath math="\text{kg, t}" />). Für einen normenkonformen Vergleich müssen Sie stets die <strong>funktionelle Einheit</strong> mit <strong>gleicher Leistungsfähigkeit (funktionale Äquivalenz)</strong> betrachten. Ein Quadratmeter Außenwand aus Beton benötigt für den gleichen Wärmeschutz (U-Wert) einen völlig anderen Dämmstoff-Schichtaufbau als eine Holztafelwand. Auch statisch müssen die Schichten so dimensioniert sein, dass sie dieselbe Traglast über die geforderte Nutzungsdauer (z.B. 50 oder 100 Jahre) abtragen können.
                </p>
              </div>
            </div>

            {/* Praxis-Download Callout: Transportbeton Excel Arbeitsmappe */}
            <div className="mt-6 p-5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 shrink-0">
                  <Calculator size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                    Excel-Arbeitsmappe (.xlsx): Ökobilanzierung Transportbeton
                  </h4>
                  <p className="text-emerald-800/80 text-xxs mt-0.5 max-w-xl">
                    Interaktive Berechnungsdatei für Studierende mit dynamischen Formeln (CEM I vs. CEM III/A vs. RC-Beton), ÖKOBAUDAT-Faktoren und einer DGNB-Optimierungsaufgabe (850 m³ Bodenplatte).
                  </p>
                </div>
              </div>
              <a
                href="#transportbeton-excel"
                onClick={(e) => {
                  e.preventDefault();
                  import('@/src/modules/lca/TransportbetonExcelExport').then(m => m.generateTransportbetonExcel());
                }}
                className="shrink-0 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <FileText size={15} />
                <span>Excel-Übung herunterladen</span>
              </a>
            </div>

          </div>

        </div>
      )}

      <ModuleFooter
        wikipedia={[
          { title: 'Ökobilanz (LCA)', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' },
          { title: 'Umweltproduktdeklaration (EPD)', url: 'https://de.wikipedia.org/wiki/Environmental_Product_Declaration' }
        ]}
        literatur={[
          'Borrmann, A. et al.: Handbuch Building Information Modeling (Springer Vieweg)',
          'Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen (BMWSB): QNG Rechenregeln für die Ökobilanzierung'
        ]}
        normIds={['DIN_EN_15804', 'DIN_EN_15978', 'DIN_EN_17472']}
        regelwerke={[
          { title: 'DIN EN ISO 14040:2021-02 / 14044:2021-02 (Ökobilanz - Grundsätze und Rahmenbedingungen)' },
          { title: 'DIN EN 15804:2022-03+A2:2019 (Nachhaltigkeit von Bauwerken - EPD)' },
          { title: 'DIN EN 15978:2012-10 (Bewertung der umweltbezogenen Qualität von Gebäuden)' },
          { title: 'DIN EN 17472:2022-09 (Bewertung der Nachhaltigkeit von Ingenieurbauwerken - Berechnungsmethoden)' },
          { title: 'QNG Handbuch: Bilanzierungsregeln für Gebäude-Ökobilanzen', url: 'https://www.qng.info/' }
        ]}
        weblinks={[
          { title: 'ÖKOBAUDAT Plattform – Offizielle BMWSB EPD-Datenbank', url: 'https://www.oekobaudat.de/' },
          { title: 'WECOBIS – Ökologisches Baustoffinformationssystem', url: 'https://www.wecobis.de/' },
          { title: 'EC3 Tool – Building Transparency (Embodied Carbon)', url: 'https://www.buildingtransparency.org/' },
          { title: 'openLCA – Open-Source Software für Lebenszyklusanalysen', url: 'https://www.openlca.org/' }
        ]}
        formeln={[
          {
            formel: 'GWP_{\\text{gesamt}} = \\sum_i \\left( m_i \\cdot gwp_{\\text{spec},i} \\right) + \\sum_j \\left( m_j \\cdot d_j \\cdot e_{\\text{trans},j} \\right) \\quad [\\text{kg CO}_2\\text{-eq}]',
            erklaerung: 'Gesamt-Treibhauspotenzial der Herstellungs- und Transportphasen (A1-A3 und A4) gemäß DIN EN 15804.',
            quelle: 'DIN EN 15804 / DIN EN 15978'
          },
          {
            formel: 'GWP_{\\text{Gebäude}} = \\frac{\\sum_{k} GWP_k}{NRF \\cdot t_{\\text{ref}}} \\le GWP_{\\text{Grenzwert}} \\quad [\\text{kg CO}_2\\text{-eq/(m}^2\\cdot\\text{a)}]',
            erklaerung: 'Auf Nettoraumfläche (NRF nach DIN 277) und Referenznutzungszeitraum tref (z.B. 50 Jahre) normierter Treibhausgaswert für das Qualitätssiegel Nachhaltiges Gebäude (QNG).',
            quelle: 'QNG Anhang 3.1.3'
          },
          {
            formel: 'GWP_{\\text{Ing}} = \\frac{\\text{GWP}_{\\text{A1-A5}} + \\sum_{k} \\text{GWP}_{\\text{B2-B5},k} + \\text{GWP}_{\\text{B8}} + \\text{GWP}_{\\text{C1-C4}}}{A_{\\text{Deck}} \\cdot t_{\\text{ref}}} \\quad [\\text{kg CO}_2\\text{-eq/(m}^2\\cdot\\text{a)}]',
            erklaerung: 'Lebenszyklus-Treibhausgasbilanzierung von Ingenieurbauwerken nach DIN EN 17472 über 80 bis 100 Jahre (DIN EN 1990) unter Berücksichtigung von periodischen Austauschzyklen (B2-B5) und baustellenbedingten Stau- und Nutzeremissionen (Modul B8).',
            quelle: 'DIN EN 17472:2022-09'
          }
        ]}
      />
    </div>
  );
}
