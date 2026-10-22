import React, { useState } from 'react';
import { ModuleFooter } from '../components/ui/ModuleFooter';
import { ConceptTooltip } from '@/src/components/ui/ConceptTooltip';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { 
  ClipboardCheck, 
  Droplets, 
  AlertTriangle, 
  TrendingDown, 
  Beaker, 
  Compass, 
  Activity, 
  Layers, 
  BookOpen, 
  ChevronRight, 
  Info,
  Sliders,
  Flame,
  Wrench,
  Sparkles,
  RefreshCw,
  Calendar,
  Grid,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { formatDeZahl, formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';

interface ExposureDetails {
  title: string;
  description: string;
  subclasses: Array<{ key: string; name: string; maxWz: number; minClass: string; cementNote?: string; example: string }>;
  moistureAssoc: string;
  rebarRecCover: string;
}

const curingTable: Record<string, Record<string, number>> = {
  '5_9': { schnell: 3, mittel: 6, langsam: 10, sehr_langsam: 15 },
  '10_14': { schnell: 2, mittel: 4, langsam: 7, sehr_langsam: 10 },
  '15_24': { schnell: 1, mittel: 2, langsam: 4, sehr_langsam: 5 },
  'ge_25': { schnell: 1, mittel: 2, langsam: 2, sehr_langsam: 3 },
};

const steelCovers: Record<string, Record<string, number>> = {
  '6_10':  { XC1: 20, XC2_3: 35, XC4: 35, XD_XS: 40 },
  '10_14': { XC1: 25, XC2_3: 35, XC4: 40, XD_XS: 55 },
  '16_20': { XC1: 30, XC2_3: 35, XC4: 40, XD_XS: 55 },
  '25':    { XC1: 35, XC2_3: 35, XC4: 40, XD_XS: 55 },
  '28':    { XC1: 40, XC2_3: 40, XC4: 40, XD_XS: 55 },
  '32':    { XC1: 45, XC2_3: 45, XC4: 45, XD_XS: 55 },
  '40':    { XC1: 50, XC2_3: 50, XC4: 50, XD_XS: 55 },
};

const exposureCategoryData: Record<string, ExposureDetails> = {
  XC: {
    title: 'Karbonatisierung (Bewehrungskorrosion)',
    description: 'Korrosion der Bewehrung, verursacht durch die Reaktion des Betons mit Kohlenstoffdioxid aus der Umluft.',
    subclasses: [
      { key: 'XC1', name: 'Trocken oder ständig nass', maxWz: 0.75, minClass: 'C16/20 oder C20/25', example: 'Innenräume (Wohnräume), Beton unter Wasser.' },
      { key: 'XC2', name: 'Nass, selten trocken', maxWz: 0.65, minClass: 'C25/30', example: 'Gründungskonstruktionen, Fundamente ohne Frost.' },
      { key: 'XC3', name: 'Mäßige Feuchte', maxWz: 0.65, minClass: 'C25/30', example: 'Vordächer, offene Hallen, feuchte Innenräume.' },
      { key: 'XC4', name: 'Wechselnd nass und trocken', maxWz: 0.60, minClass: 'C25/30', example: 'Außenbauteile mit direkter Beregnung.' },
    ],
    moistureAssoc: 'Feuchtigkeitsklasse unabhängig von der XC-Klasse festlegen: WO z. B. trockene Innenbauteile und überdachte Außenbauteile; WF z. B. ständig nasse, bewitterte oder erdberührte Bauteile und Innenbauteile mit hoher Luftfeuchte. | XC2, XC3, XC4 -> WF',
    rebarRecCover: 'XC1: 20-30 mm | XC2_3: 25-35 mm | XC4: 35-40 mm'
  },
  XF: {
    title: 'Frost / Frost-Tausalz-Angriff',
    description: 'Zerstörung des Zementsteins durch Frostwechsel bei mäßiger oder hoher Wassersättigung, teils verschlimmert durch Tausalze.',
    subclasses: [
      { key: 'XF1', name: 'Mäßige Sättigung ohne Taumittel', maxWz: 0.60, minClass: 'C25/30', example: 'Außenbauteile vertikal (Spritzwasserbereich ausgeschlossen).' },
      { key: 'XF2', name: 'Mäßige Sättigung mit Taumittel', maxWz: 0.50, minClass: 'C35/45 (od. C25/30 LP)', cementNote: 'Bei ZTV-ING gilt w/z ≤ 0.50 + C25/30 mit LP', example: 'Spritzwasserbereich von Straßen, Betonfertigteile an Flugplätzen.' },
      { key: 'XF3', name: 'Hohe Sättigung ohne Taumittel', maxWz: 0.50, minClass: 'C35/45 (od. C25/30 LP)', example: 'Horizontale Bauteile im Freien (Dächer), Brüstungen, Wasserbehälter im Frostbereich.' },
      { key: 'XF4', name: 'Hohe Sättigung mit Taumittel', maxWz: 0.50, minClass: 'C35/45 LP (od. C30/37 LP)', cementNote: 'Luftporenbildner (LP) zwingend erforderlich, außer bei sehr langsamer Hydratation.', example: 'Fahrbahnbeton auf Brücken, Parkdecks ohne OS-Beschichtung.' },
    ],
    moistureAssoc: 'XF1 -> WF | XF2, XF3, XF4 -> WA (bzw. WS bei Fahrbahnen)',
    rebarRecCover: 'XF1: 35-40 mm | XF2_3_4: 40-55 mm'
  },
  XD_XS: {
    title: 'Chloride aus Taumittel (XD) / Meerwasser (XS)',
    description: 'Bewehrungskorrosion infolge von eingedrungenen Chlorid-Ionen (ohne direkten Meerwasserkontakt bei XD). Extreme Lochfraßgefahr!',
    subclasses: [
      { key: 'XD1', name: 'Mäßige Feuchte (Salzsprühnebel)', maxWz: 0.55, minClass: 'C30/37', example: 'Parkhausstützen, Decken über Stellplätzen, Wände im Sprühbereich.' },
      { key: 'XD2', name: 'Nass, selten trocken (Sole)', maxWz: 0.50, minClass: 'C35/45 (od. C30/37 Anhang F)', example: 'Schwimmbäder mit chloriertem Wasser, Industrieanlagen mit Sole.' },
      { key: 'XD3', name: 'Wechselnd nass/trocken (Direktbefahrung)', maxWz: 0.50, minClass: 'C35/45 (od. C35/45 LP)', cementNote: 'ZTV-ING verlangt w/z ≤ 0.50 + Luftporenbildner. Parkhaus-Fahrbahnen direkt befahren.', example: 'Parkdecks, hochbelastete Talsperren-Brücken.' },
      { key: 'XS1', name: 'Salzhaltige Luft', maxWz: 0.55, minClass: 'C30/37', example: 'Bauten in Küstennähe (Außenbereich).' },
      { key: 'XS2', name: 'Ständig unter Wasser', maxWz: 0.50, minClass: 'C35/45', example: 'Hafenmolen, Gründungsbauteile im Meer.' },
      { key: 'XS3', name: 'Wechselnd (Tidenhub/Spritzwasser)', maxWz: 0.50, minClass: 'C35/45', example: 'Spritzwasser-Bereich an Hafenanlagen, Tidenzone.' },
    ],
    moistureAssoc: 'XD1, XS1 -> WF | XD2, XD3, XS2, XS3 -> WA',
    rebarRecCover: 'XD/XS: Generell 40-55 mm empfohlen'
  },
  XA: {
    title: 'Chemischer Angriff (Säuren, Sulfate, Kohlensäure)',
    description: 'Beton- oder Bewehrungsangriff durch gelöste Schadstoffe in Böden, Grundwasser oder Industrieumgebungen.',
    subclasses: [
      { key: 'XA1', name: 'Schwach angreifend', maxWz: 0.60, minClass: 'C25/30', example: 'Güllebehälter im Agrarbereich, Kläranlagen (Teilbereiche), mäßig saure Böden.' },
      { key: 'XA2', name: 'Mäßig angreifend / Sulfate', maxWz: 0.50, minClass: 'C35/45 (od. C30/37 Anhang F)', cementNote: 'Ab 600 mg/l Sulfat im Wasser: Flugasche (30%) oder SR-Zement gefordert. ZTV-ING fordert w/z ≤ 0.50.', example: 'Fundamente in sulfathaltigen Böden (Gipskeuper), Klärbecken.' },
      { key: 'XA3', name: 'Stark angreifend (PH < 4.5)', maxWz: 0.45, minClass: 'C35/45', cementNote: 'Immer SR-Zement zwingend erforderlich + zusätzliche Schutzmaßnahmen wie Beschichtungen!', example: 'Industrieabwasser-Anlagen, Kühltürme mit Rauchgaseinleitung, Futtersilos.' },
    ],
    moistureAssoc: 'XA1 -> WF | XA2, XA3 -> WA',
    rebarRecCover: 'XA1: 35-40 mm | XA2_3: 40-55 mm'
  },
  XM: {
    title: 'Mechanischer Verschleiß',
    description: 'Oberflächenabrieb durch schleifende, rollende oder prallende mechanische Beanspruchungen.',
    subclasses: [
      { key: 'XM1', name: 'Mäßige Beanspruchung', maxWz: 0.55, minClass: 'C30/37', cementNote: 'XM1-Betone können durch bauseitiges, pünktliches Flügelglätten mechanisch auf XM2 gehärtet werden.', example: 'Garagenböden, Befahrbare Hallen für PKW.' },
      { key: 'XM2', name: 'Schwere Beanspruchung', maxWz: 0.50, minClass: 'C35/45 (od. C30/37 + Flügelglätten)', cementNote: 'Bei luft- oder vollgummibereiften Gabelstaplern. Widerstandsfähige Körnung nötig.', example: 'Industrieböden, Lagerhallen mit Staplerverkehr.' },
      { key: 'XM3', name: 'Extrem schwere Beanspruchung', maxWz: 0.45, minClass: 'C35/45', cementNote: 'Betonstahlrollen-Einsatz, Kettenfahrzeuge, Tosbecken. Empfehlung: Separater Hartstoff-Industriestrich (nach DIN 18560-7)!', example: 'Kettenfahrzeug-Hallen, Schredderanlagen-Böden.' },
    ],
    moistureAssoc: 'XM1 -> WF | XM2, XM3 -> WA / WS bei dynamischer Auflast',
    rebarRecCover: 'XC-Abhängig + Verschleiß-Vorsorgemaßnahme'
  },
  AKR: {
    title: 'Alkali-Kieselsäure-Reaktion FEUCHTEKLASSEN (AKR)',
    description: 'Gefahr des "Betonkrebses" durch quellfähiges Alkali-Kieselgel bei Wasserzutritt und reaktivem Gesteinskorn.',
    subclasses: [
      { key: 'WO', name: 'Trocken / Ohne Feuchtezufuhr', maxWz: 1.0, minClass: 'Jeder tragfähige Beton', example: 'Trockene Innenbauteile von Gebäuden (Wohnräume, Büros).' },
      { key: 'WF', name: 'Feucht / Ständige Feuchtezufuhr', maxWz: 0.65, minClass: 'XC2 - XC4, XF1, XA1 Bereich', example: 'Außenbauteile ohne Salzbelastung, Feuchträume, WU-Baukörper.' },
      { key: 'WA', name: 'Feucht + Tausalz / Meerwasser', maxWz: 0.50, minClass: 'XD, XS, XA2, XA3, XF2, XF4 Bereich', example: 'Brückenpfeiler, Bauteile mit Meerwasserkontakt, Parkdeckauffahrten.' },
      { key: 'WS', name: 'Feucht + Taumittel + Dyn. Last', maxWz: 0.45, minClass: 'C30/37 oder C35/45', cementNote: 'ZTV-Decke Bestimmungen beachten. Aggregat E1 Klasse nutzen.', example: 'Betonfahrbahnen auf Bundesautobahnen, Rollbahnen auf Flughäfen.' },
    ],
    moistureAssoc: 'WO, WF, WA, WS repräsentieren die Feuchtbedingungen der AKR-Gefährdung.',
    rebarRecCover: 'Bewehrungsüberdeckung durch übergeordnete Expositionsklassen geregelt'
  },
  XO: {
    title: 'Kein Angriffsrisiko (Unbewehrt)',
    description: 'Beton ohne Bewehrung, der keinerlei chemischem, mechanischem oder Frostangriff ausgesetzt ist.',
    subclasses: [
      { key: 'XO', name: 'Kein Risiko', maxWz: 1.0, minClass: 'C8/10 bis C16/20', example: 'Unbewehrte Fundamente (frostfrei gegründet), Magerbetone, Sauberkeitsschichten.' }
    ],
    moistureAssoc: 'WO',
    rebarRecCover: 'Keine Bewehrung vorhanden'
  }
};

function ConcreteThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'beton');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 mt-8">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Beton im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den verschiedenen Beton-Lehrbereichen:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe / Betonpraxis */}
        <button
          onClick={() => setActiveTab('betonpraxis')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Betontechnologie & Praxis</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Expositionsklassen-Konfigurator, Nachbehandlungsrechner & Betondeckung.
          </span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_beton')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Betonzulassung (Bauprodukt)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Transport- vs. Baustellenbeton, WPK-Überwachung, Ü-Zeichen & Abnahme.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={handleDauerhaftigkeitClick}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Dauerhaftigkeit & Schäden</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Karbonatisierung, Frost-Tausalz-Angriff, AKR-Treiben & Bewehrungskorrosion.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

interface BetonpraxisProps {
  initialSubTab?: 'diagnostik' | 'zusammenhalt' | 'einbau' | 'nachbehandlung' | 'krell_tabelle' | 'festigkeit';
}

export default function Betonpraxis({ initialSubTab }: BetonpraxisProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState<'diagnostik' | 'zusammenhalt' | 'einbau' | 'nachbehandlung' | 'krell_tabelle' | 'festigkeit'>(initialSubTab || 'diagnostik');

  // Interactive states for Tab 2: Zusammenhaltevermögen Calculator
  const [calcW, setCalcW] = useState<number>(175);
  const [calcMK, setCalcMK] = useState<number>(380);
  const [calcFK, setCalcFK] = useState<number>(420);
  const [slowHydration, setSlowHydration] = useState<boolean>(false);

  // Interactive states for Tab 2: Site Water addition Simulator
  const [waterAddition, setWaterAddition] = useState<number>(10); // l/m³
  const [airAddition, setAirAddition] = useState<number>(0); // Vol-%

  // Interactive states for Tab 3: Setting walkable time
  const [tempWalk, setTempWalk] = useState<number>(20); // °C

  // Interactive states for Tab 4: Core testing DIN EN 13791
  const [fck, setFck] = useState<number>(30); // MPa
  const [concreteVol, setConcreteVol] = useState<number>(45); // m³
  const [coresTested, setCoresTested] = useState<number>(3); 

  // Interactive states for Tab 5: Nachbehandlung
  const [curingTemp, setCuringTemp] = useState<'5_9' | '10_14' | '15_24' | 'ge_25'>('15_24');
  const [curingStrength, setCuringStrength] = useState<'schnell' | 'mittel' | 'langsam' | 'sehr_langsam'>('mittel');
  const [curingExposure, setCuringExposure] = useState<'x0_xc1' | 'standard' | 'erhoeht'>('standard');

  // Interactive states for Tab 5: Betonierbarkeit
  const [groesstkorn, setGroesstkorn] = useState<8 | 16 | 32>(16);

  // Interactive states for Tab 6: WU-Richtlinie
  const [wuBauteil, setWuBauteil] = useState<'waende' | 'bodenplatte' | 'daech'>('waende');
  const [wuBk, setWuBk] = useState<'bk1' | 'bk2'>('bk1');
  const [wuBauweise, setWuBauweise] = useState<'ortbeton' | 'element' | 'fertigteil'>('ortbeton');

  // Interactive states for Tab 6: Krell-Tabelle & Footnotes
  const [krellCategory, setKrellCategory] = useState<'XC' | 'XF' | 'XD_XS' | 'XA' | 'XM' | 'AKR' | 'XO'>('XC');
  const [rebarDiameter, setRebarDiameter] = useState<string>('16_20');

  // --- Calculations for Zusammenhaltevermögen ---
  const kValue = calcMK > 0 ? (calcW - 70) / calcMK : 0;
  
  let kResultText = '';
  let kResultClass = '';
  let kAdvice = '';

  if (kValue <= 0.25) {
    kResultText = 'Sehr klebrig / Kaum bis kein Bluten (≤ 0.25)';
    kResultClass = 'bg-yellow-50 text-yellow-800 border-yellow-200';
    kAdvice = 'Der Beton klebt stark. Nahezu keine Wasserabgabe nach oben. Achtung beim Verdichten: Putscher/Stochern reicht meist nicht aus! Gefahr von eingeschlossenem Luftgehalt (bis zu 4-6% Gesamtluft möglich). Unbedingt sorgfältig mit der Rüttelflasche verdichten.';
  } else if (kValue <= 0.27) {
    kResultText = 'Klebend / Geringes Bluten (≤ 0.27)';
    kResultClass = 'bg-green-50 text-green-800 border-green-200';
    kAdvice = 'Beton hat ein vermindertes Bluten und eine geringere Wasseranreicherung oben. Gute Verarbeitungseigenschaft für geneigte Flächen, benötigt aber gewissenhafte Verdichtung.';
  } else if (kValue <= 0.31) {
    kResultText = 'Normales Zusammenhaltevermögen (~0.30)';
    kResultClass = 'bg-sky-50 text-sky-800 border-sky-100';
    kAdvice = 'Übliches Bluten von ca. 3 bis 5 l/m³ (bzw. 0,5 Vol.-%). Bietet ein ausgewogenes Verhalten für übliche Hochbauteile bei 20°C.';
  } else if (kValue <= 0.34) {
    kResultText = 'Mäßige Wasseranreicherung oben ("normal / dünn") (≥ 0.33)';
    kResultClass = 'bg-orange-50 text-orange-800 border-orange-200';
    kAdvice = 'Mäßige bis deutliche Wasserbewegung nach oben. Gefahr von Wasseranreicherung unter Bewehrungen oder an der Oberfläche. Achten Sie auf eine adäquate Rüttelzeit und vermeiden Sie stehendes Oberflächenwasser vor dem Oberflächenfinish.';
  } else {
    kResultText = 'Deutliches Bluten / Läuft stark aus ("dünn") (≥ 0.35)';
    kResultClass = 'bg-red-50 text-red-800 border-red-200';
    kAdvice = 'Erhebliche Gefahr einer unkontrollierten Entmischung und starker Wasseranreicherung an der Oberfläche. Hohe Gefahr von Schwindrissen/Netzrissen und minderfester Betonschicht an der Oberfläche. Mehlkornanteil erhöhen oder w/z-Wert reduzieren!';
  }

  // --- Calculations for site water addition --
  const predictedFlowIncrease = (waterAddition / 2.25) * 10; // +10mm flow spread for every 2 to 2.5 l/m³
  const predictedStrengthLoss = (waterAddition / 10) * 3.5; // -3 to -4 N/mm² for 10 l/m³
  const predictedShrinkageIncrease = (waterAddition / 10) * 0.1; // +0.1 mm/m for 10 l/m³
  const waterBleedingOut = waterAddition / 2; // half of added water bleeds out!

  // --- Calculations for air content change ---
  const predictedAirStrengthLoss = airAddition * 2; // -2 N/mm² per 1 Vol-%

  // --- Walkability calculations based on temperature ---
  // Baseline is at 20°C -> 4 hours for walkable (Trittfestigkeit)
  // 30°C is 60% of baseline (2.4h), 10°C is 200% (8h), 5°C is 400% (16h)
  let walkTimeFactor = 1.0;
  if (tempWalk >= 30) {
    walkTimeFactor = 0.6;
  } else if (tempWalk >= 20) {
    // interpolate between 20°C (1.0) and 30°C (0.6)
    walkTimeFactor = 1.0 - ((tempWalk - 20) / 10) * 0.4;
  } else if (tempWalk >= 10) {
    // interpolate between 10°C (2.0) and 20°C (1.0)
    walkTimeFactor = 2.0 - ((tempWalk - 10) / 10) * 1.0;
  } else if (tempWalk >= 5) {
    // interpolate between 5°C (4.0) and 10°C (2.0)
    walkTimeFactor = 4.0 - ((tempWalk - 5) / 5) * 2.0;
  } else {
    // Below 5°C reaction slows down drastically
    walkTimeFactor = 4.0 + ((5 - tempWalk) * 0.8);
  }
  const calcSettingTimeHours = 4 * walkTimeFactor;

  // --- Calculations for Bohrkernprüfung DIN EN 13791 ---
  // BK_min >= 0.85 * (fck - 4)
  const reqBkMin = 0.85 * (fck - 4);
  const coreNeedsCount = concreteVol <= 30 ? (coresTested <= 4 ? 2 : 4) : (coresTested <= 4 ? 3 : 5);
  // Median requirements:
  // 2 - 4 cores: Median BK >= 0.85 * (fck + 1)
  // 5 - 6 cores: Median BK >= 0.85 * (fck + 2)
  const reqBkMedian = coresTested <= 4 ? 0.85 * (fck + 1) : 0.85 * (fck + 2);

  // --- Calculations for WU-Richtlinie ---
  const getWuMindestdicke = (): { dicke: number; core?: number; comment: string } => {
    if (wuBauteil === 'waende') {
      if (wuBk === 'bk1') {
        if (wuBauweise === 'ortbeton') return { dicke: 240, comment: 'Mindestdicke bei Ortbetonwänden nach WU-Richtlinie. Wichtig: Größtkorn ≤ 16 mm einhalten!' };
        if (wuBauweise === 'element') return { dicke: 240, core: 120, comment: 'Elementwand (3-schichtig): 240 mm Gesamtdicke mit mind. 120 mm Ortbetonkern.' };
        return { dicke: 200, comment: 'Fertigteilwand: Sehr dichte Werksherstellung ermöglicht die Reduktion auf 200 mm.' };
      } else { // BK2
        if (wuBauweise === 'ortbeton') return { dicke: 240, comment: 'Ortbetonwand bei Bodenfeuchte. Unter besonderen baustellenspezifischen Maßnahmen auf 200 mm reduzierbar (nach Fußnote 1).' };
        if (wuBauweise === 'element') return { dicke: 240, core: 120, comment: 'Elementwand (BK 2): 240 mm Gesamtdicke mit 120 mm Ortbetonkern. Reduzierung bedingt möglich.' };
        return { dicke: 100, comment: 'Fertigteil BK 2: Sehr schlanke Bauweise ab 100 mm baupraktisch zulässig.' };
      }
    } else if (wuBauteil === 'bodenplatte') {
      if (wuBk === 'bk1') {
        if (wuBauweise === 'ortbeton') return { dicke: 250, comment: 'Standard-Bodenplatte bei drückendem Wasser. Erhöhte Rissbreitenbeschränkung vorsehen.' };
        if (wuBauweise === 'element') return { dicke: 250, comment: 'Nicht üblich für tragende Bodenplatten (Elementbauweise bezieht sich primär auf Wände).' };
        return { dicke: 200, comment: 'WU-Fertigteil-Bodenplatte: Minderung auf 200 mm unter kontrollierten Bedingungen.' };
      } else { // BK2
        if (wuBauweise === 'ortbeton') return { dicke: 150, comment: 'Optimierte Dicke von 150 mm ausreichend bei reiner Bodenfeuchtigkeit.' };
        if (wuBauweise === 'element') return { dicke: 150, comment: 'Bodenplatten werden nicht in Elementwandbauweise realisiert.' };
        return { dicke: 100, comment: 'Schlanke Fertigteilplatte von 100 mm bei BK 2 (z.B. Garagenböden) möglich.' };
      }
    } else { // daech (Dächer)
      if (wuBk === 'bk1') {
        if (wuBauweise === 'ortbeton') return { dicke: 200, comment: 'Flachdächer ohne zusätzliche Dichtungsbahn (Ortbeton): Erhöhte Dichtungskritikalität.' };
        if (wuBauweise === 'element') return { dicke: 240, core: 180, comment: 'Elementdecke/Dach: 240 mm Gesamtdicke mit 180 mm Ortbeton-Aufbeton.' };
        return { dicke: 180, comment: 'Werks-Fertigteil für WU-Dächer: 180 mm Dicke.' };
      } else { // BK2
        if (wuBauweise === 'ortbeton') return { dicke: 180, comment: 'WU-Flachdach bei Schutz gegen stehendes Wasser.' };
        if (wuBauweise === 'element') return { dicke: 220, core: 160, comment: 'Elementdecke BK 2: 220 mm Gesamtdicke mit 160 mm Kern.' };
        return { dicke: 160, comment: 'Fertigteil BK 2: 160 mm Dicke.' };
      }
    }
  };

  return (
    <div id="betonpraxis-root" className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ClipboardCheck className="text-shiraz" /> Betonpraxis (nach Dr. Krell, 2022)
          <span className="text-xs bg-shiraz/10 text-shiraz font-mono font-bold px-2 py-0.5 rounded">
            Regelwerk-Handkarte + Anhang
          </span>
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Praxisnahe Tipps, Grenzwerte, Regelwerks-Anhang und mathematische Daumenregeln zur Frisch- und Festbetonsteuerung.
          </p>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex border-b border-home-grau/30 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
        <button
          onClick={() => setActiveSubTab('diagnostik')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeSubTab === 'diagnostik' ? 'border-shiraz text-shiraz' : 'border-transparent text-text-main/60 hover:text-text-main'
          }`}
        >
          <Beaker size={15} />
          Frischbeton-Diagnostik
        </button>
        <button
          onClick={() => setActiveSubTab('zusammenhalt')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeSubTab === 'zusammenhalt' ? 'border-shiraz text-shiraz' : 'border-transparent text-text-main/60 hover:text-text-main'
          }`}
        >
          <Droplets size={15} />
          Zusammenhalt &amp; Wasser-Sim
        </button>
        <button
          onClick={() => setActiveSubTab('einbau')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeSubTab === 'einbau' ? 'border-shiraz text-shiraz' : 'border-transparent text-text-main/60 hover:text-text-main'
          }`}
        >
          <Wrench size={15} />
          Einbau &amp; Industrieboden
        </button>
        <button
          onClick={() => setActiveSubTab('nachbehandlung')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeSubTab === 'nachbehandlung' ? 'border-shiraz text-shiraz' : 'border-transparent text-text-main/60 hover:text-text-main'
          }`}
        >
          <Calendar size={15} />
          Nachbehandlung &amp; Betonierbarkeit
        </button>
        <button
          onClick={() => setActiveSubTab('krell_tabelle')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeSubTab === 'krell_tabelle' ? 'border-shiraz text-shiraz' : 'border-transparent text-text-main/60 hover:text-text-main'
          }`}
        >
          <Grid size={15} />
          Krell-Tabelle &amp; WU
        </button>
        <button
          onClick={() => setActiveSubTab('festigkeit')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeSubTab === 'festigkeit' ? 'border-shiraz text-shiraz' : 'border-transparent text-text-main/60 hover:text-text-main'
          }`}
        >
          <Activity size={15} />
          ID-Prüfung &amp; Bohrkerne
        </button>
      </div>

      {/* SUB-TAB 1: Frischbeton-Diagnostik */}
      {activeSubTab === 'diagnostik' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* Card 1: Ausbreitmaß & Feinmörtel */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-2">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <Compass size={18} className="text-shiraz" />
              Beobachtungen über die Norm (DIN) hinaus
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-off-white rounded-lg border border-home-grau/15 space-y-2">
                <span className="text-xs font-bold uppercase text-shiraz block">Ausbreitmaß beobachten</span>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Beim Messen des Ausbreitmaßes nicht nur auf den Millimeter-Wert achten:
                </p>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-1 pl-1">
                  <li>
                    <strong>Wasser- oder Leimrand:</strong> Optimal ist <span className="text-shiraz font-bold">kein oder maximal 3 mm</span> Rand. Ein größerer Rand zeigt ein mangelndes Wasserhaltevermögen des Betons an.
                  </li>
                  <li>
                    <strong>Grobkornverteilung:</strong> Keine Anreicherung von grobem Gestein am Randbereich. Dies signalisiert ein unzureichendes Zusammenhaltevermögen (Entmischungstendenz).
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-off-white rounded-lg border border-home-grau/15 space-y-2">
                <span className="text-xs font-bold uppercase text-shiraz block">Das Ausbreitmaß-Klassenarchiv</span>
                <p className="text-xs text-text-main/80">
                  Die standardisierten Konsistenzklassen nach DIN EN 206:
                </p>
                <div className="grid grid-cols-2 gap-1 text-xs font-mono mt-1">
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded">F1: ≤ 340 mm (steif)</div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded">F2: 350-410 (plastisch)</div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded">F3: 420-480 (weich)</div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded">F4: 490-550 (sehr weich)</div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded">F5: 560-620 (fließfähig)</div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded">F6: 630-700 (sehr fließf.)</div>
                  <div className="bg-white px-2 py-0.5 border border-home-grau/10 rounded col-span-2 text-center text-shiraz font-bold">SVB: &gt; 700 mm (selbstverdichtend)</div>
                </div>
              </div>
            </div>

            {/* Spezieller Test: Rütteln im Eimer */}
            <div className="p-4 bg-shiraz/5 border border-shiraz/10 rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-text-main flex items-center gap-1.5">
                <Sparkles size={16} className="text-shiraz animate-pulse" />
                Spezialtest: Oberflächenbeurteilung im 10-Liter-Eimer
              </h4>
              <p className="text-xs text-text-main/80">
                Zur schnellen Untersuchung der Entmischungs- und Klebrigkeitstendenzen auf der Baustelle oder im Labor:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <div className="font-bold text-shiraz mb-1">1. Versuchsaufbau</div>
                  Einen standardmäßigen 10 l Eimer bis ca. 5 cm unter den Rand befüllen und auf dem Rütteltisch positionieren.
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <div className="font-bold text-shiraz mb-1">2. Blasenaufstieg</div>
                  Bestimmen Sie die Aufstiegsdauer großer Blasen beim Rütteln. Je zäher/klebriger der Beton, desto länger dauert es. Mehr Luftporen (Lunker) sind zu erwarten.
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                  <div className="font-bold text-shiraz mb-1">3. Fingertest</div>
                  Nach 30 Sek. Rütteln abstellen. Mit dem Handschuh-Finger von oben nach dem ersten Grobkorn tasten. Liegt dieses tiefer als <span className="font-bold text-red-600">3 mm</span>, besteht akute Entmischungsgefahr!
                </div>
              </div>

              <div className="bg-red-50/50 p-2.5 rounded border border-red-200/50 flex gap-2 items-start mt-2">
                <AlertTriangle size={15} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-900">
                  <strong>Folge von zu viel Feinmörtel oben:</strong> Anreicherung an jeder Einbaulage, Netzrisse an der Oberseite durch signifikant erhöhtes Schwindverhalten.
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Rohdichte & Luftgehalt */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <Layers size={18} className="text-shiraz" />
              Dichte &amp; Luftgehalt
            </h3>

            {/* Rohdichte-Bewertung */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-text-main/60 block">Frischbetonrohdichte bewerten</span>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Vergleichen Sie die gemessene Frischrohdichte sofort mit der Soll-Frischrohdichte der Erstprüfung:
              </p>
              
              <div className="space-y-1.5 text-xs">
                <div className="bg-red-50 border border-red-100 p-2.5 rounded">
                  <span className="font-bold text-red-800 block">Abweichung &gt; +0,02 kg/l</span>
                  Hinweis auf eine Überverdichtung des Betons. Einbaugefahr!
                </div>
                <div className="bg-orange-50 border border-orange-100 p-2.5 rounded">
                  <span className="font-bold text-orange-850 block">Abweichung &gt; -0,02 kg/l (zu niedrig)</span>
                  Gefahr von erhöhter Porosität: Entspricht ca. <span className="font-bold">10 l/m³ Luft</span> oder alternativ <span className="font-bold">15 kg/m³ unzulässigem Zusatzwasser</span>.
                </div>
              </div>
            </div>

            {/* Luftgehalt */}
            <div className="p-3 bg-yellow-50/20 border border-yellow-200/50 rounded-lg space-y-2">
              <span className="text-xs font-bold uppercase text-yellow-800 block">Luftgehalt bestimmen</span>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Selbst ohne Luftporen-Bildner (LP) verbleiben bei sachgerechter Verdichtung üblicherweise <strong>0,5 bis 3,5 Vol.-% Luft</strong> (deutlich schwankend von den standardmäßig im Rezeptentwurf angenommenen 1,5 Vol.-%).
              </p>
              <div className="text-xs text-text-main/70 bg-white p-2 rounded border border-home-grau/10">
                <strong>Achtung:</strong> Betone mit geringem w/z-Wert und mehlkornreiche (klebrige) Betone halten Luftblasen stark fest. Nicht „kaputt-rütteln“ oder unkontrolliert Feinstoff abschneiden!
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: Zusammenhalt & Wasser-Sim */}
      {activeSubTab === 'zusammenhalt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          
          {/* Card 1: Zusammenhaltevermögen Calculator */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Activity size={18} className="text-shiraz" />
                Kennwert Zusammenhalt: (w - 70) / MK
              </h3>
              
              <p className="text-xs text-text-main/80">
                Gibt Aufschluss über das Frischbetonbluten und Schwindkraftverhalten. 
                Besonders mehlkornarme Betone weisen zu wenig Wasserbindevermögen auf.
              </p>

              <div className="space-y-3 bg-off-white p-4 rounded-xl border border-home-grau/30">
                {/* Inputs */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="font-semibold text-text-main">Wassergehalt w</label>
                    <span className="font-mono text-xs">{formatDeWert(calcW)} kg/m³</span>
                  </div>
                  <input 
                    type="range" 
                    min="140" 
                    max="240" 
                    value={calcW} 
                    onChange={(e) => setCalcW(Number(e.target.value))} 
                    className="w-full accent-shiraz"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="font-semibold text-text-main">Mehlkorn MK (Partikel &lt; 0,125 mm)</label>
                    <span className="font-mono text-xs">{formatDeWert(calcMK)} kg/m³</span>
                  </div>
                  <input 
                    type="range" 
                    min="250" 
                    max="500" 
                    value={calcMK} 
                    onChange={(e) => setCalcMK(Number(e.target.value))} 
                    className="w-full accent-shiraz"
                  />
                  <span className="text-xs text-text-main/50 block">Beinhaltet Zement, Flugasche, Kalksteinmehl und Feinstsand.</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-home-grau/10">
                  <input 
                    type="checkbox" 
                    id="slow_hydr" 
                    checked={slowHydration}
                    onChange={(e) => setSlowHydration(e.target.checked)}
                    className="rounded text-shiraz focus:ring-shiraz"
                  />
                  <label htmlFor="slow_hydr" className="text-xs font-semibold text-text-main/80 cursor-pointer">
                    Späte Gefügebildung (Kaltes Wetter, Verzögerer VZ)
                  </label>
                </div>
              </div>
            </div>

            {/* Calculations Output */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between bg-shiraz/5 p-3 rounded-lg border border-shiraz/10">
                <span className="text-xs font-bold text-shiraz block uppercase">Zusammenhalte-Kennwert:</span>
                <span className="text-xl font-mono font-bold text-shiraz">
                  {formatDeZahl(kValue, 3)}
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${kResultClass} text-xs space-y-1`}>
                <span className="font-bold uppercase tracking-wider block text-xs">
                  Diagnose Frischbeton (<ConceptTooltip termKey="bluten" fallbackText="Blutungsneigung" />):
                </span>
                <p className="font-bold">{kResultText}</p>
                <p className="leading-relaxed opacity-90 mt-1">{kAdvice}</p>
                {slowHydration && (
                  <div className="mt-2 text-xs bg-white/50 p-1.5 rounded border border-current opacity-80">
                    <strong>Achtung Zusatzfaktor:</strong> Durch Verzögerer oder Winterkälte tritt das Bluten verzögert auf. Mit erhöhtem Oberflächenwasser-Blutungsrand ist zu rechnen!
                  </div>
                )}
              </div>

              {/* Formel-Herleitungs-Box für das Zusammenhaltevermögen */}
              <FormulaDerivationBox
                title="Herleitung: Zusammenhaltevermögen k-Wert & Mehlkornbedarf"
                zielGleichung="k = \\frac{w - 70}{mk} \\le 0{,}30"
                normQuelle="DBV-Merkblatt Frischbeton & Walz-Zusammenhaltekriterium"
                ergebnisHinweis={`Aktueller Rechenwert: k = ${formatDeZahl(kValue, 3)} bei w = ${calcW} l/m³ und mk = ${calcMK} kg/m³`}
                schritte={[
                  {
                    titel: "1. Wirksamen Wassergehalt w erfassen",
                    erklaerung: "Gesamtwasser abzüglich der Eigenfeuchte der Gesteinskörnung. Hier maßgebend für die Schmierfilmbildung.",
                    formel: `w = ${calcW}\\text{ l/m}^3`,
                    einheit: "l/m³"
                  },
                  {
                    titel: "2. Mehlkorngehalt mk bilanzieren",
                    erklaerung: "Summe aus Zement z, Betonzusatzstoffen (z. B. Flugasche, Silikastaub) und dem Feinstanteil der Gesteinskörnung < 0,125 mm.",
                    formel: `mk = z + f_{\\text{Zusatz}} + g_{<0{,}125} = ${calcMK}\\text{ kg/m}^3`,
                    einheit: "kg/m³"
                  },
                  {
                    titel: "3. Überschusswasser-Quotient berechnen",
                    erklaerung: "Die empirische Konstante 70 l/m³ beschreibt das an den Kornoberflächen adhäsiv gebundene Wasser. Das verbleibende freie Wasser bestimmt die Stabilität.",
                    formel: `k = \\frac{${formatDeTeXWert(calcW)} - 70}{${formatDeTeXWert(calcMK)}} = \\frac{${formatDeTeXWert(calcW - 70)}}{${formatDeTeXWert(calcMK)}} = ${formatDeZahl(kValue, 3)}`,
                    einheit: "[-]"
                  },
                  {
                    titel: "4. Grenzwertprüfung & Baupraxis",
                    erklaerung: "Optimal ist k ≈ 0,27 bis 0,31. Bei k > 0,33 droht signifikante Wasserabsonderung; bei k ≤ 0,25 ist der Beton klebrig und schwer entlüftbar.",
                    formel: "k_{\\text{ziel}} \\approx 0{,}30 \\quad (\\text{Zielbereich für Pump- \\& Sichtbeton})"
                  }
                ]}
              />
            </div>
          </div>

          {/* Card 2: Site Water addition Simulator */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Sliders size={18} className="text-shiraz" />
                Interaktiver Baustellen-Wasser- &amp; Luftmengen-Simulator
              </h3>
              <p className="text-xs text-text-main/80">
                Geben Sie unerlaubte Wasserzugaben oder abweichende Luftporenanteile ein, um die fatalen Auswirkungen auf Festigkeiten und Schwinddehnungen zu kalkulieren.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50/20 p-4 rounded-xl border border-red-100 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-red-800 uppercase block">Extra Wasser auf der Baustelle</span>
                    <p className="text-xs text-text-main/70">
                      Zusatzwasser verändert den w/z-Wert und verschlechtert alle Dauerhaftigkeitswerte extrem.
                    </p>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-text-main">Zusatzwassergehalt</span>
                      <span className="font-mono text-red-700 font-bold">{formatDeWert(waterAddition)} Liter/m³</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="40" 
                      step="5"
                      value={waterAddition}
                      onChange={(e) => setWaterAddition(Number(e.target.value))}
                      className="w-full accent-red-700"
                    />
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setWaterAddition(20)} 
                        className="text-xs bg-red-800 text-white font-bold py-1 px-2 rounded-lg hover:bg-red-900 transition-colors w-full animate-in"
                      >
                        Setzen Sie "20 l/m³" (Verbotenes Maß)
                      </button>
                      <button 
                        onClick={() => setWaterAddition(0)} 
                        className="text-xs bg-home-grau/20 text-text-main py-1 px-2 rounded-lg hover:bg-home-grau/30 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-50/20 p-4 rounded-xl border border-sky-100 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-sky-800 uppercase block">Luftgehaltsabweichung</span>
                    <p className="text-xs text-text-main/70">
                      Jedes zusätzliche Prozent Porenluft mindert die Druckfestigkeit des erhärteten Betons im Bauteil.
                    </p>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-text-main">Porengehalt-Differenz</span>
                      <span className="font-mono text-sky-700 font-bold">+{formatDeWert(airAddition)} Vol.-%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      step="0.5"
                      value={airAddition}
                      onChange={(e) => setAirAddition(Number(e.target.value))}
                      className="w-full accent-sky-700"
                    />
                    <button 
                      onClick={() => setAirAddition(0)} 
                      className="text-xs bg-home-grau/20 text-text-main py-1 px-2 rounded-lg hover:bg-home-grau/30 transition-colors w-full"
                    >
                      Luft-Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated outputs */}
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
              <span className="text-xs font-bold text-text-main/80 uppercase block mb-3 border-b border-home-grau/10 pb-1">
                Simuliertes Resultat (Kombinierte Defizite):
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-home-grau/10">
                  <div className="text-xs text-text-main/50 font-semibold uppercase">Ausbreitmaß-Änderung</div>
                  <div className="text-sm font-bold text-green-700 font-mono">
                    +{formatDeZahl(predictedFlowIncrease, 0)} mm
                  </div>
                  <span className="text-xs text-text-main/40 block">Flüssiger Konsistenzfluss</span>
                </div>
                
                <div className="bg-white p-2.5 rounded-lg border border-home-grau/10">
                  <div className="text-xs text-text-main/50 font-semibold uppercase">Freigesetztes Blutungswasser</div>
                  <div className="text-sm font-bold text-orange-700 font-mono">
                    {formatDeZahl(waterBleedingOut, 1)} l/m³
                  </div>
                  <span className="text-xs text-text-main/40 block">Tritt als Oberflächenwasser aus</span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-home-grau/10">
                  <div className="text-xs text-text-main/50 font-semibold uppercase">Druckfestigkeitsverlust (Δf)</div>
                  <div className="text-sm font-bold text-red-650 font-mono">
                    -{formatDeZahl(predictedStrengthLoss + predictedAirStrengthLoss, 1)} N/mm²
                  </div>
                  <span className="text-xs text-text-main/40 block">(Wasser {formatDeZahl(predictedStrengthLoss, 1)} + Luft {formatDeZahl(predictedAirStrengthLoss, 1)})</span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-home-grau/10">
                  <div className="text-xs text-text-main/50 font-semibold uppercase">Schwinddehnungs-Plus</div>
                  <div className="text-sm font-bold text-purple-700 font-mono">
                    +{formatDeZahl(predictedShrinkageIncrease, 2)} mm/m
                  </div>
                  <span className="text-xs text-text-main/40 block">Erzeugt erhebliche Zusatzrisse</span>
                </div>
              </div>

              {waterAddition >= 20 && (
                <div className="bg-red-900 border border-red-950 text-white rounded-lg p-3 text-xs flex gap-2 items-start mt-4">
                  <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block text-red-200">Kritischer Fehler: Verbotene Wasserzugabe (≥ 20 l/m³)!</strong>
                    <ul className="list-disc list-inside space-y-1 text-red-105">
                      <li><strong>Druckfestigkeit:</strong> Fällt um &gt; -8 N/mm² ab. Ein Konformitätstest scheitert fast immer (alle Würfel fallen durch).</li>
                      <li><strong>Wasserläufer &amp; Entmischung:</strong> Sand- und Feinanteile sammeln sich oben, Grobkorn sinkt stark ab.</li>
                      <li><strong>Schwinden &amp; Risse:</strong> Schwindanstieg +0,2 mm/m (deutlich mehr, tiefere und breitere Netzrisse).</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 3: Einbau & Industrieboden */}
      {activeSubTab === 'einbau' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* Card 1: Settingwalkability Calculator */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <Flame size={18} className="text-shiraz" />
              Erstarren &amp; Trittfestigkeit (Walkability)
            </h3>
            <p className="text-xs text-text-main/80">
              Abschätzung der Erstarrungs- und Walkability-Dauer von üblichen Bauwerksbetonen (w/z um 0.55, CEM I / CEM II 32.5 R / 42.5 N) in Abhängigkeit der Umgebungstemperatur. Base-Richtwert bei 20°C: ca. 4 bis 5 Stunden.
            </p>

            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-text-main">Umgebungstemperatur</span>
                <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(tempWalk)} °C</span>
              </div>
              <input 
                type="range" 
                min="-5" 
                max="35" 
                value={tempWalk} 
                onChange={(e) => setTempWalk(Number(e.target.value))} 
                className="w-full accent-shiraz"
              />
              
              <div className="grid grid-cols-2 gap-2 text-center text-xs mt-2 font-mono">
                <button onClick={() => setTempWalk(30)} className="bg-white p-1 rounded hover:bg-home-grau/10 border border-home-grau/10">30°C (Sommer)</button>
                <button onClick={() => setTempWalk(20)} className="bg-white p-1 rounded hover:bg-home-grau/10 border border-home-grau/10">20°C (Standard)</button>
                <button onClick={() => setTempWalk(10)} className="bg-white p-1 rounded hover:bg-home-grau/10 border border-home-grau/10">10°C (Herbst)</button>
                <button onClick={() => setTempWalk(5)} className="bg-white p-1 rounded hover:bg-home-grau/10 border border-home-grau/10">5°C (Kälte/Winter)</button>
              </div>
            </div>

            <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/10 space-y-2 text-center text-xs">
              <span className="text-xs font-bold uppercase text-shiraz block">Erwartete Dauer bis zur Trittfestigkeit:</span>
              <div className="text-2xl font-bold text-shiraz font-mono">
                {formatDeZahl(calcSettingTimeHours, 1)} Stunden
              </div>
              <p className="text-xs text-text-main/60">
                (Faktor gegenüber Standard-Referenz: {formatDeZahl((walkTimeFactor * 100), 0)}%)
              </p>
            </div>

            {/* Spezifische Erstarrenregeln */}
            <div className="text-xs bg-yellow-50/25 border border-yellow-200/50 p-3 rounded-lg space-y-1">
              <div className="font-bold text-yellow-800">Sollwerte für Temperatur-Verhalten:</div>
              <p className="text-xs text-text-main/85 leading-relaxed">
                • <strong>30°C:</strong> Nur 60% der Zeit (~2,5 h) - Rasantes Vorgehen gefordert!<br />
                • <strong>20°C:</strong> 100% (~4 h)<br />
                • <strong>10°C:</strong> 200% (~8 h) - Verzögertes Ausschalen bedenken.<br />
                • <strong>5°C:</strong> 400% (~16 h) - Frostschutz-Heizung/Matten einplanen.
              </p>
            </div>
          </div>

          {/* Card 2: Einbaufehler & Rassel-Effekte */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <AlertTriangle size={18} className="text-shiraz" />
              Einbau &amp; Verdichtungskonzepte
            </h3>
            
            <p className="text-xs text-text-main/80 leading-relaxed">
              Mangelhafte mechanische Rüttelarbeit führt auch bei dünnflüssigen Konsistenzen (F5) zu Luftporengehalten im Kern von 4% bis 6%.
            </p>

            <div className="space-y-3 text-xs text-text-main/80">
              <div className="p-3 bg-off-white/80 rounded border border-home-grau/15">
                <span className="font-bold text-shiraz block mb-1">Der "Rüttelpatsch-Effekt" bei F5</span>
                Durch das Abziehen mit einer Rüttelpatsche bei weichem Beton wird oft nur die oberste Schicht (ca. 1 cm) hoch verdichtet und versiegelt. Aufsteigendes Blutungswasser sowie feine Verdichtungsblasen sammeln sich dicht darunter:
                <ul className="list-disc list-inside mt-2 space-y-1 ml-1 text-text-main/70 text-xs">
                  <li>Einzelne größere Ansammlungen bilden <strong>Glättblasen</strong> (&lt;10 cm runder Hohlraum).</li>
                  <li>Viele Bläschen bilden dünne, extrem rissanfällige <strong>flächige Hohllagen</strong>.</li>
                </ul>
              </div>

              <div className="p-3 bg-off-white/80 rounded border border-home-grau/15">
                <span className="font-bold text-shiraz block mb-1">Mörtelanreicherung durch Fehlverdichten</span>
                <p className="text-xs leading-relaxed">
                  • <strong>Überrütteln:</strong> Flasche zu lange an einer Position belassen führt zu wasserreichen, labilen Zonen um die Flasche. Risiko für Wasserläufer und Netzrisse.<br />
                  • <strong>Treiben/Fallenlassen:</strong> Das ungleiche Weiterpumpen oder Kippen des Betons führt zum Absieben des Grobkorns. Die mörtelreichen Zonen schwinden und bluten extrem.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Industrieboden-Engineering */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <Wrench size={18} className="text-shiraz" />
              Industrieboden-Datenblatt (C30/37)
            </h3>
            
            <p className="text-xs text-text-main/80">
              Gegenüberstellung des theoretischen DBV-Anforderungsrahmens und des präziseren Krell-Consult Empfehlungskatalogs für makellose Flügelglättung.
            </p>

            <div className="space-y-4">
              <div className="border border-home-grau/30 text-xs rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 font-bold bg-off-white p-2 border-b border-home-grau/30">
                  <span>Parameter</span>
                  <span>DBV Limit</span>
                  <span className="text-shiraz">Krell Empfehlung</span>
                </div>
                
                <div className="grid grid-cols-3 p-2 border-b border-home-grau/10">
                  <span className="font-semibold">Mehlkorn MK</span>
                  <span>360-400 kg/m³</span>
                  <span className="text-shiraz font-bold">~ 360 kg/m³</span>
                </div>

                <div className="grid grid-cols-3 p-2 border-b border-home-grau/10">
                  <span className="font-semibold">Feinstkorn FK</span>
                  <span>≤ 430 kg/m³</span>
                  <span className="text-shiraz font-bold">≤ 430 kg/m³</span>
                </div>

                <div className="grid grid-cols-3 p-2">
                  <span className="font-semibold">Wasser</span>
                  <span>≤ 180 kg/m³</span>
                  <span className="text-shiraz font-bold">165 - 175 kg/m³</span>
                </div>
              </div>

              <div className="bg-red-50 border border-red-150 p-3 rounded-xl text-xs space-y-1.5 leading-relaxed">
                <span className="font-bold text-red-800 block uppercase text-xs">Achtung XM3-Einstreu bei C35/45:</span>
                Die in DIN 1045-2 dargelegte Theorie, XM3-Einstreubaustoffe direkt frisch in einen C35/45 (w/z ≤ 0,45) einzuarbeiten, is <span className="text-red-700 font-bold">baupraktisch nicht realisierbar (XM2-Flügelglatten-Einsatz)</span>.
                <div className="text-xs font-bold text-text-main bg-white p-2 rounded border border-red-200 mt-1.5">
                  Empfehlung: Nachträglicher Verbund-Industrieestrich nach DIN 18560-7 (nicht frisch auf frisch!).
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 5: Nachbehandlung & Betonierbarkeit */}
      {activeSubTab === 'nachbehandlung' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          
          {/* Curing Duration Calculator */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Calendar size={18} className="text-shiraz" />
                Dauer der Mindestnachbehandlung (Tage)
              </h3>
              <p className="text-xs text-text-main/80 font-medium">
                Berechnet die Mindestanzahl an Tagen, an denen der Frischbeton feucht gehalten und geschützt werden muss (nach DIN 1045-3 / DIN EN 13670, ergänzt durch Krell).
              </p>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-4">
                {/* 1. Exposures */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-main block">1. Expositionsklasse &amp; Schutzbedürfnis</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCuringExposure('x0_xc1')}
                      className={`p-2.5 text-xs font-semibold rounded-lg border transition-all ${
                        curingExposure === 'x0_xc1'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-home-grau/5'
                      }`}
                    >
                      X0, XC1 (Trocken / Kein Risiko)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCuringExposure('standard')}
                      className={`p-2.5 text-xs font-semibold rounded-lg border transition-all ${
                        curingExposure === 'standard'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-home-grau/5'
                      }`}
                    >
                      XC2, XC3, XC4, XF1, XA1 (Standard)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCuringExposure('erhoeht')}
                      className={`p-2.5 text-xs font-semibold rounded-lg border transition-all ${
                        curingExposure === 'erhoeht'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-home-grau/5'
                      }`}
                    >
                      XD, XS, XF2-4, XA2-3, XM (Erhöht)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 2. Festigkeitsentwicklung */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-main block">2. Festigkeitsentwicklung (r-Wert)</label>
                    <select
                      value={curingStrength}
                      onChange={(e) => setCuringStrength(e.target.value as any)}
                      className="w-full text-xs p-2 border border-home-grau/30 rounded"
                    >
                      <option value="schnell">Schnell (r ≥ 0,50)</option>
                      <option value="mittel">Mittel (r ≥ 0,30)</option>
                      <option value="langsam">Langsam (r ≥ 0,15)</option>
                      <option value="sehr_langsam">Sehr langsam (r &lt; 0,15)</option>
                    </select>
                    <span className="text-xs text-text-main/50 block">Abhängig von Zementsorte und w/z-Wert.</span>
                  </div>

                  {/* 3. Witterung/Temperatur */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-main block">3. Bauteiloberflächentemperaturen</label>
                    <select
                      value={curingTemp}
                      onChange={(e) => setCuringTemp(e.target.value as any)}
                      className="w-full text-xs p-2 border border-home-grau/30 rounded"
                    >
                      <option value="5_9">5 °C bis 9 °C (Winterlich kühl)</option>
                      <option value="10_14">10 °C bis 14 °C (Übergangszeit)</option>
                      <option value="15_24">15 °C bis 24 °C (Standardklima)</option>
                      <option value="ge_25">≥ 25 °C (Sommerliche Wärme)</option>
                    </select>
                    <span className="text-xs text-text-main/50 block">Wichtig: Kerntemperatur soll stets über 5 °C liegen.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated outputs */}
            <div className="pt-4 space-y-4">
              <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/15 text-center space-y-1">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Mindestdauer der Nachbehandlung:</span>
                <div className="text-xl font-bold text-shiraz font-mono leading-tight">
                  {curingExposure === 'x0_xc1' ? (
                    <span className="text-xs block py-1 font-semibold">Keine harten Festigkeitsvorgaben (Bis Trittfestigkeit, ca. 12-24 Std.)</span>
                  ) : (
                    <span>
                      {curingExposure === 'erhoeht' 
                        ? `${Math.ceil((curingTable[curingTemp]?.[curingStrength] || 1) * 1.5)} Tage`
                        : `${curingTable[curingTemp]?.[curingStrength] || 0} Tage`
                      }
                    </span>
                  )}
                </div>
                {curingExposure === 'erhoeht' && (
                  <span className="text-xs text-red-700 font-semibold block">
                    (Inklusive +50% Sicherheitsaufschlag für hoch-aggressive Angriffsstufen)
                  </span>
                )}
              </div>

              {/* Einbautemperaturen Frischbeton */}
              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-lg text-xs space-y-1">
                <span className="font-bold text-amber-800 uppercase text-xs block">Einbautemperaturen des Frischbetons:</span>
                <ul className="list-disc list-inside space-y-1 text-text-main/85 text-xs">
                  <li><strong>Bei 5 - 9 °C:</strong> Mindestens <strong className="text-shiraz font-mono">4 Tage</strong> Curing erforderlich (ZTV-ING verdoppelt auf 8 Tage!)</li>
                  <li><strong>Bei 10 - 14 °C:</strong> Mindestens <strong className="text-shiraz font-mono">2 Tage</strong> Curing erforderlich (ZTV-ING verdoppelt auf 4 Tage!)</li>
                  <li><strong>Bei ≥ 15 °C:</strong> Mindestens <strong className="text-shiraz font-mono">1 Tag</strong> Curing ausreichend (ZTV-ING verdoppelt auf 2 Tage!)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Aggregate / Clearance Card */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Sliders size={18} className="text-shiraz" />
                Betonierbarkeit vs. Größtkorn
              </h3>
              <p className="text-xs text-text-main/80">
                Zur Verhinderung von Kiesnestern und fehlerhaften Hohlräumen muss der lichte Abstand zwischen Bewehrungsmatten bzw. Schalen auf das maximale Gesteinskorn abgestimmt sein.
              </p>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3">
                <label className="text-xs font-bold text-text-main block">Selektiertes Größtkorn der Gesteinskörnung:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[8, 16, 32].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setGroesstkorn(size as any)}
                      className={`py-2 px-3 text-xs font-mono font-bold rounded-lg border transition-all ${
                        groesstkorn === size
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:bg-home-grau/5'
                      }`}
                    >
                      GK {formatDeWert(size)} mm
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive dimensional infographic visualizer */}
              <div className="border border-home-grau/15 p-4 rounded-xl bg-gradient-to-b from-white to-home-grau/5 flex flex-col items-center">
                <div className="w-full flex items-center justify-between px-2 mb-2">
                  <span className="text-xs uppercase font-mono font-bold text-text-main/50">Infografik: Reibungsloser Durchfluss</span>
                  <span className="text-xs font-bold text-shiraz font-mono">Min. lichte Weite: {groesstkorn === 8 ? '12 cm' : groesstkorn === 16 ? '14 cm' : '18 cm'}</span>
                </div>
                
                {/* Visual grid rendering of rebars */}
                <div className="w-full h-24 bg-off-white rounded-lg relative overflow-hidden flex items-center justify-center border border-home-grau/10">
                  {/* Left rebar */}
                  <div className="w-4 h-full bg-slate-400 absolute left-8 border-r border-home-grau/30 shadow-sm flex items-center justify-center">
                    <div className="w-full h-full bg-repeat-y opacity-30" style={{ backgroundImage: 'linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.15) 55%, transparent 60%)', backgroundSize: '100% 12px' }}></div>
                  </div>
                  {/* Right rebar */}
                  <div className="w-4 h-full bg-slate-400 absolute right-8 border-l border-home-grau/30 shadow-sm flex items-center justify-center">
                    <div className="w-full h-full bg-repeat-y opacity-30" style={{ backgroundImage: 'linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.15) 55%, transparent 60%)', backgroundSize: '100% 12px' }}></div>
                  </div>

                  {/* Flow dimension arrow */}
                  <div className="absolute left-12 right-12 h-0.5 bg-red-400 flex items-center justify-between px-1">
                    <span className="text-xs text-red-650 bg-white px-2 py-0.5 rounded border border-red-200 leading-none -mt-3.5 font-bold font-mono">
                      {groesstkorn === 8 ? '≥ 12 cm' : groesstkorn === 16 ? '≥ 14 cm' : '≥ 18 cm'}
                    </span>
                  </div>

                  {/* Simulated bouncing aggregate shapes to demonstrate size clearance */}
                  <div className="flex gap-2 justify-center z-10 transition-all duration-350">
                    <div className={`rounded-full bg-stone-500 border border-stone-400 shadow-inner ${groesstkorn === 8 ? 'w-4 h-4' : groesstkorn === 16 ? 'w-6 h-6' : 'w-9 h-9'}`}></div>
                    <div className={`rounded-full bg-stone-700 border border-stone-600 shadow-inner mt-2 ${groesstkorn === 8 ? 'w-3 h-3' : groesstkorn === 16 ? 'w-4 h-4' : 'w-7 h-7'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aggregate Notes */}
            <div className="bg-shiraz/5 border border-shiraz/10 rounded-lg p-3.5 text-xs space-y-1.5 mt-2">
              <div className="font-bold text-shiraz flex items-center gap-1">
                <Info size={14} />
                Regelwerks-Handkarte Zusatzhinweis:
              </div>
              <ul className="list-disc list-inside text-xs text-text-main/80 space-y-1">
                <li><strong>Anschlussmischung:</strong> Bei wandständigen Betonarbeiten Anschlussmischung mit maximal 8 mm Größtkorn vorsehen!</li>
                <li><strong>Spezialregel WU:</strong> Bei Elementwänden oder dünnen WU-Wänden ist das Gesteins-Größtkorn zwingend auf ≤ 16 mm zu begrenzen.</li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 6: Krell-Tabelle & WU-Richtlinie */}
      {activeSubTab === 'krell_tabelle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          
          {/* Expositionsklassen Matrix */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-12">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <Grid size={18} className="text-shiraz" />
              Krell-Tabelle: Interaktives Expositions- &amp; Feuchtigkeitsregelwerk
            </h3>
            
            {/* Category selection */}
            <div className="flex flex-wrap gap-1 p-1 bg-off-white border border-home-grau/15 rounded-xl">
              {[
                { id: 'XC', label: 'Karbonatisierung (XC)' },
                { id: 'XF', label: 'Frost-Angriff (XF)' },
                { id: 'XD_XS', label: 'Chloride/See (XD/XS)' },
                { id: 'XA', label: 'Chem. Angriff (XA)' },
                { id: 'XM', label: 'Verschleiß (XM)' },
                { id: 'AKR', label: 'AKR-Feucht (W...)' },
                { id: 'XO', label: 'Kein Risiko (X0)' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setKrellCategory(cat.id as any)}
                  className={`flex-1 py-1 px-2.5 text-xs font-semibold rounded-lg transition-all ${
                    krellCategory === cat.id
                      ? 'bg-shiraz text-white shadow-sm'
                      : 'text-text-main/70 hover:text-text-main hover:bg-white/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Main Category Display Card */}
            {(() => {
              const details = exposureCategoryData[krellCategory];
              if (!details) return null;
              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gradient-to-b from-white to-off-white p-4 rounded-xl border border-home-grau/15">
                  
                  {/* Left Specs & Subclasses */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Katalog-Grenzdaten</span>
                      <h4 className="font-bold text-base text-text-main mt-0.5 flex items-center gap-1.5">
                        <ConceptTooltip 
                          termKey={krellCategory === 'XC' ? 'karbonatisierung' : krellCategory === 'AKR' ? 'akr' : 'krell_tabelle'} 
                          fallbackText={details.title}
                        >
                          {details.title}
                        </ConceptTooltip>
                      </h4>
                      <p className="text-xs text-text-main/70 mt-1 leading-relaxed">{details.description}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-text-main/50 uppercase block">Regel-Angriffsstufen im Detail</span>
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {details.subclasses.map((cls) => (
                          <div key={cls.key} className="p-3 bg-white border border-home-grau/10 rounded-lg text-xs space-y-1 hover:border-shiraz/35 transition-colors">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-bold text-shiraz text-sm px-1.5 py-0.5 bg-shiraz/5 border border-shiraz/15 rounded font-mono">{cls.key}</span>
                              <span className="font-bold text-text-main font-mono text-xs bg-slate-50 px-2 py-0.5 rounded border border-home-grau/10">Min. Güteklasse: {cls.minClass}</span>
                              <span className="font-bold text-red-700 font-mono text-xs bg-red-50/50 px-2 py-0.5 rounded border border-red-100">max w/z: {formatDeZahl(cls.maxWz, 2)}</span>
                            </div>
                            <p className="font-semibold text-text-main mt-1">{cls.name}</p>
                            <p className="text-xs text-text-main/60 italic mt-0.5">Praxis-Beispiel: {cls.example}</p>
                            {cls.cementNote && (
                              <p className="text-xs text-amber-800 font-medium bg-amber-50/40 p-1.5 border border-amber-200 rounded mt-1.5 flex gap-1 items-start">
                                <Info size={11} className="flex-shrink-0 mt-0.5" />
                                <span>{cls.cementNote}</span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Concrete Cover (Bewehrungsüberdeckung) Finder */}
                  <div className="bg-white p-4 rounded-xl border border-home-grau/15 flex flex-col justify-between">
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Bewehrungs-Überdeckung</span>
                      <p className="text-xs text-text-main/70 leading-relaxed">
                        Findet das nach DIN 1045-2 geforderte Nennmaß der Betonüberdeckung <span className="font-mono bg-slate-50 border border-home-grau/30 rounded px-1 text-shiraz">c_nom [mm]</span> basierend auf dem gewählten Stabdurchmesser und der Expositions-Belastung:
                      </p>

                      <div className="space-y-3 bg-off-white p-3 rounded-lg border border-home-grau/15">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-text-main/80 block">Stabdurchmesser (Eisen):</label>
                          <select
                            value={rebarDiameter}
                            onChange={(e) => setRebarDiameter(e.target.value)}
                            className="w-full text-xs p-1.5 bg-white border border-home-grau/30 rounded"
                          >
                            <option value="6_10">Ø 6 bis 10 mm (Leichte Matten)</option>
                            <option value="10_14">Ø 10 bis 14 mm</option>
                            <option value="16_20">Ø 16 bis 20 mm</option>
                            <option value="25">Ø 25 mm</option>
                            <option value="28">Ø 28 mm</option>
                            <option value="32">Ø 32 mm</option>
                            <option value="40">Ø 40 mm (Rundstahl)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-text-main/80 block">Gegenüberstellung c_nom:</label>
                          <div className="grid grid-cols-2 gap-1 text-xs font-mono font-bold text-center">
                            <span className="bg-white p-1 rounded border border-home-grau/10">XC1 (Trocken)</span>
                            <span className="bg-white p-1 rounded border border-home-grau/10">XC2/3 (Feucht)</span>
                            <span className="bg-white p-1 rounded border border-home-grau/10">XC4 (Beregnung)</span>
                            <span className="bg-white p-1 rounded border border-home-grau/10">XD/XS (Chloride)</span>
                          </div>
                        </div>
                      </div>

                      {/* Display covers */}
                      <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-lg">
                        <span className="text-xs font-bold text-text-main/50 uppercase block">Ermittelte Überdeckung c_nom:</span>
                        <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-center">
                          <div className="bg-white p-2 rounded border border-home-grau/10">
                            <div className="text-xs font-sans text-text-main/60">XC1</div>
                            <div className="text-sm font-bold text-slate-800">{formatDeWert(steelCovers[rebarDiameter]?.XC1 || 20)} mm</div>
                          </div>
                          <div className="bg-white p-2 rounded border border-home-grau/10">
                            <div className="text-xs font-sans text-text-main/60">XC2/3</div>
                            <div className="text-sm font-bold text-slate-800">{formatDeWert(steelCovers[rebarDiameter]?.XC2_3 || 35)} mm</div>
                          </div>
                          <div className="bg-white p-2 rounded border border-home-grau/10">
                            <div className="text-xs font-sans text-text-main/60">XC4</div>
                            <div className="text-sm font-bold text-slate-800">{formatDeWert(steelCovers[rebarDiameter]?.XC4 || 35)} mm</div>
                          </div>
                          <div className="bg-white p-2 rounded border border-home-grau/10">
                            <div className="text-xs font-sans text-text-main/60">XD / XS</div>
                            <div className="text-sm font-bold text-shiraz font-mono">{formatDeWert(steelCovers[rebarDiameter]?.XD_XS || 40)} mm</div>
                          </div>
                        </div>
                        <span className="text-xs text-text-main/50 mt-1.5 block text-center italic leading-normal">
                          Grenzmaß c_nom = Mindestüberdeckung c_min + Vorhaltemaß Δc_dev (10 mm)
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-home-grau/10 text-xs space-y-1 text-text-main/70 font-medium">
                      <div><strong>Zugeordnete Feuchtigkeitsklasse:</strong> {details.moistureAssoc}</div>
                      <div><strong>Gütebereich (c_min):</strong> {details.rebarRecCover}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Footnotes of Krell table */}
            <div className="p-4 bg-amber-50/40 border border-amber-200/50 rounded-xl space-y-3">
              <span className="text-xs font-bold text-amber-800 uppercase block tracking-wider">Ausgewählte Erleichterungen &amp; Sonderregelungen:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text-main/80 leading-relaxed">
                <div className="space-y-1 bg-white/40 p-2.5 rounded-lg border border-amber-200/20">
                  <strong className="block mb-1">① DAfStb Massenbeton &amp; z-Grenze:</strong>
                  <p className="text-xs text-text-main/75 leading-relaxed">
                    XA1: z ≤ 240 kg/m³ und f_c ≤ 40 N/mm² zur Minderung der Wärmeentwicklung. Erleichterung: Erleichterung nach DIN 1045-2 für langsam und sehr langsam erhärtende Betone (r &lt; 0,30): Mindestdruckfestigkeitsklasse eine Klasse niedriger, der höchstzulässige w/z-Wert bleibt unverändert – XD2/XS2, XF2/XF3 ohne LP und XA2: w/z ≤ 0,50 und C30/37 statt C35/45; XD3/XS3: w/z ≤ 0,45 und C30/37 statt C35/45. Die Festigkeit wird dabei weiterhin nach 28 Tagen nachgewiesen und XA2.
                  </p>
                </div>
                <div className="space-y-1 bg-white/40 p-2.5 rounded-lg border border-amber-200/20">
                  <strong className="block mb-1">② DIN 1045-2 Anhang F Regel:</strong>
                  <p className="text-xs text-text-main/75 leading-relaxed">
                    Spezielle Erleichterungen für Chloride (XD2, XS2, XA2 sowie XF2/3) ohne Luftporen (LP): Mit langsamerer/sehr langsamer Hydratation sind (w/z)_eq ≤ 0,50 und Güte C30/37 zulässig.
                  </p>
                </div>
                <div className="space-y-1 bg-white/40 p-2.5 rounded-lg border border-amber-200/20">
                  <strong className="block mb-1">③/⑥ WU-Richtlinie &amp; SR-Cemente:</strong>
                  <p className="text-xs text-text-main/75 leading-relaxed">
                    • WU nach DIN 1045 erlaubt (w/z)_eq ≤ 0,60 – aber nach schärferer WU-Richtlinie bei BK1 zwingend ≤ 0,55.<br />
                    • Sulfate: bis 600 mg/l (Standardzement), &gt; 600 mg/l (Zusatz von Flugasche oder SR-Zement), &gt; 1500 mg/l (zwingend SR-Zement vorgeschrieben).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* WU-Richtlinie section */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-12">
            <div className="flex items-center gap-3 pb-2 border-b border-home-grau/10">
              <div className="w-8 h-8 bg-sky-500 text-white rounded-lg flex items-center justify-center">
                <Droplets size={16} />
              </div>
              <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  WU-Richtlinie: Empfohlene Mindestdicken für w/z ≤ 0,55
                </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Vorgeschriebene mechanische Grenzmaße zur Wasserdichtigkeit flächiger Betonbauteile nach Dr. Krell Regelwerk.
          </p>
        </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Selectors */}
              <div className="space-y-3 bg-off-white p-4 rounded-xl border border-home-grau/30 text-xs">
                {/* Member */}
                <div className="space-y-1 row-span-1">
                  <label className="font-bold text-text-main">Auszuführendes Bauteil:</label>
                  <div className="flex gap-1">
                    {[
                      { id: 'waende', label: 'Wände' },
                      { id: 'bodenplatte', label: 'Bodenplatte' },
                      { id: 'daech', label: 'Dächer' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWuBauteil(item.id as any)}
                        className={`flex-1 py-1.5 px-2 font-semibold text-center text-xs rounded transition-all ${
                          wuBauteil === item.id
                            ? 'bg-shiraz text-white'
                            : 'bg-white hover:bg-slate-50 text-text-main/70 border border-home-grau/15 animate-in'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Class */}
                <div className="space-y-1">
                  <label className="font-bold text-text-main">Beanspruchungs-Gruppe (BK):</label>
                  <div className="flex gap-1">
                    {[
                      { id: 'bk1', label: 'BK 1 (Drückend)' },
                      { id: 'bk2', label: 'BK 2 (Feucht)' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWuBk(item.id as any)}
                        className={`flex-1 py-1.5 px-2 font-semibold text-center text-xs rounded transition-all ${
                          wuBk === item.id
                            ? 'bg-shiraz text-white'
                            : 'bg-white hover:bg-slate-50 text-text-main/70 border border-home-grau/15 animate-in'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-text-main/50 block mt-1">BK 1: Drückendes und aufstauendes Wasser | BK 2: Natürliche Bodenfeuchtigkeit, Sickerwasser.</span>
                </div>

                {/* Bauweise */}
                <div className="space-y-1">
                  <label className="font-bold text-text-main">Bauverfahren / Konstruktionsweise:</label>
                  <div className="flex gap-1">
                    {[
                      { id: 'ortbeton', label: 'Ortbeton' },
                      { id: 'element', label: 'Elementwand' },
                      { id: 'fertigteil', label: 'Fertigteil' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWuBauweise(item.id as any)}
                        className={`flex-1 py-1.5 px-1 font-semibold text-center text-xs rounded transition-all ${
                          wuBauweise === item.id
                            ? 'bg-shiraz text-white'
                            : 'bg-white hover:bg-slate-50 text-text-main/70 border border-home-grau/15 animate-in'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Outputs display */}
              <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                {(() => {
                  const result = getWuMindestdicke();
                  return (
                    <div className="bg-sky-50/40 border border-sky-150 p-4 rounded-xl flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-xs uppercase font-bold text-sky-800 tracking-wider block">Empfehlung der WU-Richtlinie</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-sky-900 font-mono">{formatDeWert(result.dicke)} mm</span>
                          {result.core && (
                            <span className="text-sm text-sky-700 font-semibold font-mono">({formatDeWert(result.core)} mm Kernbeton)</span>
                          )}
                        </div>
                        <p className="text-xs text-text-main/80 mt-1 leading-relaxed font-semibold">{result.comment}</p>
                      </div>

                      <div className="text-xs text-text-main/60 bg-white p-2 border border-sky-100 rounded mt-3.5 leading-normal">
                        <strong>Ecke-Ausnahme (Fußnote 1):</strong> Unter Anwendung strenger Qualitätssicherungen und riss-beschränkender Bewehrungsverfahren kann Ortbeton bei BK 2 baustellenspezifisch auf bis zu <strong>200 mm</strong> reduziert werden.
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 4: ID-Prüfung & Bohrkerne */}
      {activeSubTab === 'festigkeit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          
          {/* Bohrkernprüfungs-Rechner */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Layers size={18} className="text-shiraz" />
                Bohrkern-Prüfungsrechner (DIN EN 13791:2020-02)
              </h3>
              
              <p className="text-xs text-text-main/80">
                Konformitäts- und Beständigkeitskontrollen an Bestandsbauteilen mittels mechanischer Entnahme von Bohrkernen (BK).
              </p>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-main block">Nominale Festigkeit f_ck</label>
                  <select 
                    value={fck} 
                    onChange={(e) => setFck(Number(e.target.value))} 
                    className="w-full text-xs p-2 border border-home-grau/30 rounded"
                  >
                    <option value={20}>C20/25 (fck=20)</option>
                    <option value={25}>C25/30 (fck=25)</option>
                    <option value={30}>C30/37 (fck=30)</option>
                    <option value={35}>C35/45 (fck=35)</option>
                    <option value={40}>C40/50 (fck=40)</option>
                    <option value={45}>C45/55 (fck=45)</option>
                    <option value={50}>C50/60 (fck=50)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-main block">Betonvolumen (Baustelle)</label>
                  <div className="relative">
                    <input 
                      type="number" min="0" 
                      value={concreteVol} 
                      onChange={(e) => setConcreteVol(Number(e.target.value))} 
                      className="w-full text-xs p-2 border border-home-grau/30 rounded pr-8"
                    />
                    <span className="absolute right-2 top-2 text-xs text-home-grau font-bold">m³</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-main block">Kerne insgesamt</label>
                  <select 
                    value={coresTested} 
                    onChange={(e) => setCoresTested(Number(e.target.value))} 
                    className="w-full text-xs p-2 border border-home-grau/30 rounded"
                  >
                    <option value={2}>2 bis 4 Kerne</option>
                    <option value={5}>5 bis 6 Kerne</option>
                    <option value={7}>7+ Kerne (Statistisch)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <span className="text-xs font-bold text-text-main/80 uppercase block">Anforderungen an Bohrkern-Einzelwerte:</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-home-grau/15 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-shiraz">1. Ungünstigster Einzelwert BK_min</span>
                    <p className="text-xs text-text-main/60 mt-0.5">Kleinster Einzelwert der Bohrkerndruckfestigkeit (Druckprüfung am Bohrkern nach DIN EN 12504-1, umgerechnet auf den Referenzkörper)., ermittelt an der schwächsten Stelle.</p>
                  </div>
                  <div className="mt-3">
                    <span className="text-xs text-text-main/50 font-bold font-mono">Formel: ≥ 0,85 * (f_ck - 4)</span>
                    <div className="text-lg font-bold text-shiraz font-mono mt-1">≥ {formatDeZahl(reqBkMin, 2)} N/mm²</div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-home-grau/15 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-shiraz">2. Mittelwert f_m(n),is</span>
                    <p className="text-xs text-text-main/60 mt-0.5">Mittelwert-Anforderung basierend auf der Bohrkernanzahl.</p>
                  </div>
                  <div className="mt-3">
                    <span className="text-xs text-text-main/50 font-bold font-mono mb-1 block">
                      {coresTested <= 4 ? 'Für 2-4 Kerne: ≥ 0.85 * (f_ck + 1)' : 'Für 5-6 Kerne: ≥ 0.85 * (f_ck + 2)'}
                    </span>
                    <div className="text-lg font-bold text-shiraz font-mono">≥ {formatDeZahl(reqBkMedian, 2)} N/mm²</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-250 text-xs text-yellow-900 leading-relaxed">
                <strong>Anzahl- und Baustellenvorschriften:</strong> Bis {concreteVol <= 30 ? '30 m³' : '30 m³'}: Es werden mindestens <strong>{concreteVol <= 30 ? 2 : 3} Kerne</strong> benötigt. 
                {concreteVol > 30 ? ' Da das eingebaute Volumen > 30 m³ beträgt, müssen zusätzlich Kerne prioritär aus dem Medianbereich / Mittelfeld entnommen werden (Identitätsprüfung).' : ' Reine Einzelwertkontrolle ausreichend.'}
              </div>
            </div>
          </div>

          {/* TB-Werk vs Baustelle */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4 lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <BookOpen size={18} className="text-shiraz" />
                Festigkeits-Konformitätsprüfungen
              </h3>
              
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-2">
                  <span className="font-bold text-shiraz text-xs flex items-center gap-1">
                    <ChevronRight size={14} />
                    Transportbetonwerk (TB-Werk)
                  </span>
                  <p className="text-xs text-text-main/80 block leading-relaxed font-mono">
                    <strong>Konformitätsnachweis standard:</strong> <br />
                    Mittelwert von 3 Probekörpern (3er-Mittel): <br />
                    <span className="text-shiraz font-bold">f_ci,3 ≥ f_ck + 4 N/mm²</span> <br />
                    Oder fortlaufend über das statistische 15er-Mittel nach DIN EN 206.
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-2">
                  <span className="font-bold text-shiraz text-xs flex items-center gap-1">
                    <ChevronRight size={14} />
                    Baustellen-Identitätsprüfung (Annahme)
                  </span>
                  <div className="text-xs text-text-main/80 leading-relaxed font-mono space-y-1">
                    <p>Zweck: Zweifelsfreie Klärung der Betonlieferungs-Identität vor Ort.</p>
                    <p>• <strong>3er- bis 4er-Mittel:</strong> f_ci ≥ f_ck + 1 N/mm²</p>
                    <p>• <strong>5er- bis 6er-Mittel:</strong> f_ci ≥ f_ck + 2 N/mm²</p>
                    <p>• <strong>Ab 7 Werte:</strong> Statistische Gesamtauswertung zulässig.</p>
                    <p className="text-red-700 bg-red-50 text-xs p-2 rounded leading-normal border border-red-100 font-sans font-bold">
                      Jeder einzelne Probekörper-Einzelwert muss zwingend ≥ (f_ck - 4) N/mm² sein!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-home-grau/15 text-xs text-text-main/60 flex items-start gap-1.5">
              <Info size={15} className="text-shiraz flex-shrink-0 mt-0.5" />
              <span>Vergiss beim Bohrkern-Ausbau nicht den sofortigen sorgfältigen Verschluss der Bohrlöcher und die Protokollierung der Festbetonrohdichten.</span>
            </div>
          </div>

        </div>
      )}

      <ConcreteThematicLinks current="baustoff" />

      {/* Module Footer standard integration */}
      <ModuleFooter 
        weblinks={[
          { title: 'Beton.org: Planungshilfen und Zement-Merkblätter', url: 'https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/' },
          { title: 'Beton.wiki: Praxiswissen Beton', url: 'https://beton.wiki/' }
        ]}
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Expositionsklasse', url: 'https://de.wikipedia.org/wiki/Expositionsklasse' },
          { title: 'Nachbehandlung' }
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton: Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN EN 13670:2010-06 / DIN 1045-3:2023-08 (Ausführung von Tragwerken aus Beton - Nachbehandlung und Einbau)' },
          { title: 'DIN 1045-1000:2023-08 (Zusammenarbeit bei Planung, Herstellung und Bauausführung - BBQ)' },
          { title: 'DIN EN 13791:2020-02 (Bewertung der Druckfestigkeit von Beton in Bauwerken oder in Bauwerksteilen)' },
          { title: 'DBV-Merkblätter: Sichtbeton (2015), Industrieböden, Betondeckung (Deutscher Beton- und Bautechnik-Verein E.V.)', url: 'https://www.betonverein.de/' }
        ]}
        literatur={[
          'Krell, J.: Beton 2022 - Vordenken statt Nachbessern, Krell-Consult, Hilden.',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Verein Deutscher Zementwerke (VDZ): Zement-Taschenbuch (51. Ausgabe 2008, Verlag Bau+Technik)'
        ]}
        formeln={[
          {
            formel: 'K = \\frac{w - 70}{MK}',
            erklaerung: 'Mehlkorn-Zusammenhalte-Kennwert (nach Dr. Jürgen Krell). Zeigt das zu erwartende Frischbeton-Blutverhalten bei 20°C ambienter Lagerung.',
            quelle: 'Krell (2022)'
          },
          {
            formel: 'f_{ct,eff,td} = 0{,}75 \\dots 0{,}85 \\cdot f_{ctm,28d}',
            erklaerung: 'Vorgabe für langsame Hydratationsfestigkeitsentwicklung zur Bestimmung des frühen Zwangsriss-Risikos am Bauteil.',
            quelle: 'DIN EN 1992-1-1'
          }
        ]}
      />
    </div>
  );
}
