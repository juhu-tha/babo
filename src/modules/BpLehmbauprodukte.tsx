import { formatDeZahl, formatDeTeX, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  Layers, 
  BookOpen, 
  Droplets, 
  ShieldCheck, 
  CheckCircle2, 
  HardHat, 
  Calculator, 
  AlertTriangle, 
  Sparkles
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { BlockMath } from 'react-katex';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

interface LoamStandardInfo {
  id: string;
  norm: string;
  title: string;
  classes: string;
  density: string;
  strength: string;
  rules: string;
  application: string;
  pros: string[];
}

const LOAM_STANDARDS_DB: LoamStandardInfo[] = [
  {
    id: 'stein',
    norm: 'DIN 18945',
    title: 'Lehmsteine',
    classes: 'Anwendungsklassen nach DIN 18945: AK Ia (verputztes, bewittertes Außenmauerwerk von Sichtfachwerk), AK Ib (durchgängig verputztes, bewittertes Außenmauerwerk), AK II (verkleidetes, witterungsgeschütztes Außenmauerwerk und Innenmauerwerk), AK III (trockene Anwendungen) – sie beschreiben die Feuchtebeanspruchung, nicht die Tragfähigkeit.',
    density: '0,90 - 2,20 g/cm³ (Leicht- bis Schwersysteme)',
    strength: 'Druckfestigkeitsklassen nach DIN 18945: 2 – 2,5 – 3 – 4 – 5 – 6 (mittlere Steindruckfestigkeit in N/mm²); die charakteristische Mauerwerksdruckfestigkeit fk ergibt sich nach DIN 18940 aus Steinklasse und Mörtel.',
    rules: 'Müssen trocken gelagert und vor Feuchtigkeit geschützt werden. Werden im Verband mit Dünnbett- oder Normalmörtel vermauert.',
    application: 'Ausfachung von historischen Fachwerkhäusern, Bau von schweren, wärmespeichernden Innenwänden, tragendes Mauerwerk nach DIN 18940.',
    pros: [
      'Guter Schallschutz bei hohen Rohdichten',
      'Hervorragendes Raumklimaregulationsverhalten (Wasseraufnahmevermögen WSIII)',
      'Einfach mit Handwerkzeugen säg- und bearbeitbar'
    ]
  },
  {
    id: 'moertel',
    norm: 'DIN 18946',
    title: 'Lehmmauermörtel',
    classes: 'Lehmmauermörtel nach DIN 18946:2024-03 (Normal-, Leicht- und Dünnbettmörtel; Festigkeitsklassen z. B. M 2,5 mit Druckfestigkeit ≥ 2,5 N/mm²)',
    density: '1,40 - 1,80 g/cm³',
    strength: 'Druckfestigkeitsklassen nach DIN 18946 (z. B. M 2,5: ≥ 2,5 N/mm²)',
    rules: 'Bindet nur über die Tonminerale; Zusätze wie Zement oder Kalk sind nicht zulässig, sonst geht die Wiederverarbeitbarkeit verloren.',
    application: 'Vermauern von Lehmsteinen, Verfüllen von historischen Fugen im Fachwerkbestand.',
    pros: [
      'Lange Verarbeitungszeit (erhärtet nur durch Trocknen)',
      'Kann bei Bedarf durch bloßes Hinzufügen von Wasser wieder verflüssigt werden',
      'Absolut materialschonend (salz- und säurefrei, schützt historisches Holz)'
    ]
  },
  {
    id: 'putz',
    norm: 'DIN 18947',
    title: 'Lehmputzmörtel',
    classes: 'Anforderungsklassen: S I (Standard-Lehmputzmörtel), S II (Putze für erhöhte mechanische Belastung)',
    density: '1,20 - 1,70 g/cm³',
    strength: 'Biegezugfestigkeit: Klasse I (≥ 0,3 MPa), Klasse II (≥ 0,4 MPa)',
    rules: 'Mehrlagiger Auftrag empfohlen. Rissempfindlichkeit durch Faserzugabe (Stroh, Flachs, Tierhaare) oder Gewebearmierung (Jute, Glasfaser) verringern.',
    application: 'Innenputz auf mineralischen Untergründen (Ziegel, Beton, KS) oder Holzfaser- und Lehmbauplatten.',
    pros: [
      'Bindet keine Schadstoffe, absorbiert luftgetragene Gerüche und Rauch',
      'Puffert Schwankungen der Raumluftfeuchte (Sorptionsklassen nach DIN 18947)',
      'Hält angrenzende Holzbauteile trocken'
    ]
  },
  {
    id: 'platte',
    norm: 'DIN 18948',
    title: 'Lehmbauplatten',
    classes: 'Typen: LPL1 (Reine Lehmplatten), LPL2 (Faser- oder Schilfrohr-armiert), LPL3 (Gipskarton-Alternative)',
    density: '0,80 - 1,40 g/cm³',
    strength: 'Biegebeanspruchung: Bruchkraft ≥ 100 N pro 10 mm Plattenstärke',
    rules: 'Montage auf Holz- oder Metall-Unterkonstruktionen im Trockenbauverfahren mittels Tellerkopfschrauben.',
    application: 'Ökologischer, atmungsaktiver Trockenbau bei Trennwänden, Deckenabhängungen, Vorsatzschalen und Sanierungen.',
    pros: [
      'Verbessert den Schallschutz durch zusätzliche Masse',
      'Je nach Produkt ohne synthetische Bindemittel',
      'Sofort trocken montierbar, wodurch wochenlange Bau-Trocknungszeiten entfallen'
    ]
  }
];

export default function BpLehmbauprodukte() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'standards' | 'bemessung' | 'dauerhaftigkeit'>('steckbrief');
  const [selectedStandard, setSelectedStandard] = useState<string>('stein');

  // Load-bearing structural calculator states (following real simplified DIN 18940 / EC6 calculations)
  const [height, setHeight] = useState<number>(2.75); // m
  const [thickness, setThickness] = useState<number>(30); // cm (24, 30, 36.5)
  const [strengthClass, setStrengthClass] = useState<number>(2); // FK 2, 3, or 4
  const [holdsTopAndBottom, setHoldsTopAndBottom] = useState<boolean>(true); // held on both ends
  const [designLoad, setDesignLoad] = useState<number>(35); // kN/m

  // Calculations for structural checker
  const effectiveHeightBeiwert = holdsTopAndBottom ? 0.75 : 1.0;
  const effectiveHeight = height * effectiveHeightBeiwert;
  const slenderness = (effectiveHeight * 100) / thickness; // lambda = h_e / t_ef

  // Lehrannahme: Schlankheitsgrenze 21 (Wert nach DIN 18940 manuell prüfen)
  const isSlendernessOk = slenderness <= 21;

  // Approximate design strength for loam masonry according to DIN 18940
  // Safe design compressive strength f_d based on strength classes matching real codes:
  // Safety factor gamma_M = 2.0
  const getFk = (fkClass: number) => {
    // Druckfestigkeitsklassen nach DIN 18945: 2 bis 6 N/mm²
    // fk nach DIN 18940 aus Steinklasse und Normalmörtel M10/M15
    if (fkClass === 2) return 0.9;
    if (fkClass === 2.5) return 1.1;
    if (fkClass === 3) return 1.3;
    if (fkClass === 4) return 1.6;
    if (fkClass === 5) return 1.9;
    if (fkClass === 6) return 2.2;
    return 1.3;
  };

  const f_k = getFk(strengthClass);
  const f_d = f_k / 2.0; // N/mm² (gamma_M = 2.0)

  // Reduction factor for eccentricity and buckling Phi
  // Phi = 0.85 * (1 - (lambda / 24)^2)
  const phi = Math.max(0, 0.85 * (1 - Math.pow(slenderness / 24, 2)));

  // Ultimate axial capacity N_Rd in kN per meter of wall:
  // N_Rd = Phi * t (in m) * f_d (in N/mm² * 1000 to convert to kN/m²)
  const wallThicknessM = thickness / 100;
  const n_Rd = phi * wallThicknessM * (f_d * 1000); // kN/m
  const isCapacityOk = isSlendernessOk && designLoad <= n_Rd;

  const currentStandard = LOAM_STANDARDS_DB.find(s => s.id === selectedStandard) || LOAM_STANDARDS_DB[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Industrielle Lehmbauprodukte (Bauprodukte)
        </h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 mb-6">
          <p>
            Der moderne Lehmbau verbindet traditionelle, kreislauffähige Baustoffqualitäten mit industrieller Präzision und Normensicherheit. 
            Durch die Produktnormen DIN 18945–18948 und die Bemessungsnorm DIN 18940 (2023) ist tragendes Lehmsteinmauerwerk im Anwendungsbereich der Norm ohne Einzelfallgenehmigung möglich; andere Bauweisen (z. B. tragender Stampflehm) benötigen weiterhin vBG bzw. ZiE.
          </p>
        </div>

        {/* Primary Tabs Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button aria-pressed={activeTab === 'steckbrief'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Baustoff-Steckbrief
          </button>
          <button aria-pressed={activeTab === 'standards'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'standards' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('standards')}
          >
            <Layers size={16} /> DIN-Produktnormen
          </button>
          <button aria-pressed={activeTab === 'bemessung'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'bemessung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('bemessung')}
          >
            <Calculator size={16} /> Tragfähigkeit (DIN 18940)
          </button>
          <button aria-pressed={activeTab === 'dauerhaftigkeit'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'dauerhaftigkeit' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('dauerhaftigkeit')}
          >
            <Droplets size={16} /> Feuchteschutz &amp; Konstruktion
          </button>
        </div>

        {/* Tab 1: Steckbrief */}
        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="lehmbau" />
          </div>
        )}

        {/* Tab 2: DIN Standards Explorer */}
        {activeTab === 'standards' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Selector list */}
              <div className="lg:col-span-1 flex flex-col gap-2">
                {LOAM_STANDARDS_DB.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedStandard(item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1 items-start cursor-pointer ${
                      selectedStandard === item.id
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm'
                        : 'bg-white border-home-grau/30 text-text-main/80 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">
                      {item.norm}
                    </span>
                    <span className="text-sm mt-1">{item.title}</span>
                  </button>
                ))}
              </div>

              {/* Main Detail panel */}
              <div className="lg:col-span-3 bg-slate-50/50 p-6 rounded-2xl border border-home-grau/25 space-y-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-home-grau/20 pb-4 gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                      <Sparkles className="text-shiraz w-5 h-5" /> DIN-Klassifizierung: {currentStandard.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-600 mt-1">Produktnorm: {currentStandard.norm}</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shrink-0 self-start md:self-center">
                    <ShieldCheck size={14} /> Amtlich geregelt
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
                    <h4 className="text-xs font-bold text-text-main/70 uppercase tracking-wider mb-1">Qualitativ-Klassen</h4>
                    <p className="text-sm text-text-main leading-relaxed">{currentStandard.classes}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
                    <h4 className="text-xs font-bold text-text-main/70 uppercase tracking-wider mb-1">Technische Rohdichten</h4>
                    <p className="text-sm text-text-main leading-relaxed">{currentStandard.density}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
                    <h4 className="text-xs font-bold text-text-main/70 uppercase tracking-wider mb-1">Festigkeitsbereiche</h4>
                    <p className="text-sm text-text-main leading-relaxed">{currentStandard.strength}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
                    <h4 className="text-xs font-bold text-text-main/70 uppercase tracking-wider mb-1">Einsatzgebiete</h4>
                    <p className="text-sm text-text-main leading-relaxed">{currentStandard.application}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs">
                  <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider mb-2">Spezifische Verarbeitungsvorschrift</h4>
                  <p className="text-sm text-text-main/90 leading-relaxed font-sans">{currentStandard.rules}</p>
                </div>

                <div className="space-y-2 mt-4">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Werkstoffliche Vorteile</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentStandard.pros.map((pro, index) => (
                      <div key={index} className="bg-emerald-50/40 p-3 rounded-lg border border-emerald-500/15 flex gap-2 items-start">
                        <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={15} />
                        <span className="text-xs font-medium text-emerald-950 leading-normal">{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Load-bearing structural checker DIN 18940 */}
        {activeTab === 'bemessung' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-50 border border-home-grau/30 p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-text-main flex items-center gap-1.5 text-base">
                <Calculator className="text-shiraz" size={20} /> Tragfähigkeitsprüfung nach DIN 18940 (Mauerwerksbemessung)
              </h3>
              <p className="text-xs text-text-main/70 mt-1">
                Ermitteln Sie die maximale Tragfähigkeit von massiven Innen- und geschützten Außenwänden aus genormten Lehmplansteinen unter mäßiger horizontaler Halterung im vereinfachten Berechnungskonzept.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input section */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-home-grau/30 space-y-4">
                <h4 className="font-bold text-sm text-text-main pb-2 border-b border-home-grau/20">Eingabeparameter</h4>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span>Lichte Wandhöhe (h):</span>
                    <span className="text-shiraz">{formatDeZahl(height, 2)} m</span>
                  </label>
                  <input
                    type="range"
                    min="2.0"
                    max="3.5"
                    step="0.05"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>2,00 m</span>
                    <span>3,50 m</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span>Wandstärke (t):</span>
                    <span className="text-shiraz">{formatDeWert(thickness)} cm</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[24, 30, 36.5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setThickness(val)}
                        className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          thickness === val
                            ? 'bg-shiraz text-white border-shiraz shadow-xs'
                            : 'bg-white border-home-grau/25 text-text-main hover:bg-slate-50'
                        }`}
                      >
                        {formatDeWert(val)} cm
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span>Festigkeitsklasse (FK):</span>
                    <span className="text-shiraz">Klasse {formatDeWert(strengthClass)}</span>
                  </label>
                  <div className="grid grid-cols-6 gap-1">
                    {[2, 2.5, 3, 4, 5, 6].map((val) => (
                      <button
                        key={val}
                        onClick={() => setStrengthClass(val)}
                        className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          strengthClass === val
                            ? 'bg-shiraz text-white border-shiraz shadow-xs'
                            : 'bg-white border-home-grau/25 text-text-main hover:bg-slate-50'
                        }`}
                      >
                        {formatDeWert(val)}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 leading-normal block pt-1">
                    Charakteristische Mauerwerksdruckfestigkeit f<sub>k</sub> = {formatDeZahl(getFk(strengthClass), 1)} N/mm² (nach DIN 18940)
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-main/80 block">Oben &amp; unten horizontal gehalten?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input
                        type="radio"
                        checked={holdsTopAndBottom === true}
                        onChange={() => setHoldsTopAndBottom(true)}
                        className="accent-shiraz"
                      />
                      <span>Ja (Slab-Halterung, β = 0,75)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input
                        type="radio"
                        checked={holdsTopAndBottom === false}
                        onChange={() => setHoldsTopAndBottom(false)}
                        className="accent-shiraz"
                      />
                      <span>Nein (Frei/Auskragend, β = 1,0)</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1 pt-1 border-t border-home-grau/10">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span>Bemessungslast (N<sub>Ed</sub>):</span>
                    <span className="text-amber-800 font-bold">{formatDeWert(designLoad)} kN/m</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={designLoad}
                    onChange={(e) => setDesignLoad(parseInt(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>10 kN/m</span>
                    <span>100 kN/m</span>
                  </div>
                </div>
              </div>

              {/* Output analysis panel */}
              <div className="lg:col-span-2 bg-slate-50 border border-home-grau/25 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-text-main pb-2 border-b border-home-grau/20">Standsicherheits-Konstruktionsbericht</h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 block">Knicklänge h<sub>ef</sub></span>
                      <span className="font-mono font-bold text-sm text-text-main">{formatDeZahl(effectiveHeight, 2)} m</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 block">Schlankheitsgrad λ</span>
                      <span className="font-mono font-bold text-sm text-text-main">{formatDeZahl(slenderness, 1)}</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 block">Reduktionsbeiwert &Phi;</span>
                      <span className="font-mono font-bold text-sm text-text-main">{formatDeZahl(phi, 3)}</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 block">Erhöhung f<sub>d</sub></span>
                      <span className="font-mono font-bold text-sm text-text-main">{formatDeZahl((f_d * 1000), 0)} kN/m²</span>
                    </div>
                  </div>

                  {/* Math representation */}
                  <div className="bg-white p-4 rounded-xl border border-home-grau/20 mt-5 space-y-3">
                    <h5 className="text-xs font-bold text-slate-600">Rechnerischer Festigkeitsbezug (LaTeX):</h5>
                    <div className="text-[13px] overflow-x-auto py-1">
                      <BlockMath math={`h_{ef} = \\beta \\cdot h = ${formatDeTeX(effectiveHeightBeiwert, 2)} \\cdot ${formatDeTeX(height, 2)} = ${formatDeTeX(effectiveHeight, 2)}\\text{ m}`} />
                      <BlockMath math={`\\lambda = \\frac{h_{ef}}{t} = \\frac{${formatDeTeX(effectiveHeight, 2)}}{${formatDeTeX(wallThicknessM, 3)}} = ${formatDeTeX(slenderness, 1)} \\leq 21`} />
                      <BlockMath math={`N_{Rd} = \\Phi \\cdot t \\cdot f_d = ${formatDeTeX(phi, 3)} \\cdot ${formatDeTeX(wallThicknessM, 3)} \\text{ m} \\cdot ${f_d * 1000} \\text{ kN/m}^2 = ${formatDeTeX(n_Rd, 1)} \\text{ kN/m}`} />
                    </div>
                  </div>
                </div>

                {/* Verification result box */}
                <div className={`mt-5 p-4 rounded-xl border ${
                  isCapacityOk 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs' 
                    : 'bg-red-50 border-red-300 text-red-950 shadow-xs'
                }`}>
                  <div className="flex items-start gap-3">
                    {isCapacityOk ? (
                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5 w-6 h-6 animate-bounce" />
                    ) : (
                      <AlertTriangle className="text-red-500 shrink-0 mt-0.5 w-6 h-6 animate-pulse" />
                    )}
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">
                        {isSlendernessOk ? (
                          isCapacityOk 
                            ? 'Tragfähigkeitsnachweis ERFÜLLT' 
                            : 'TRAGFÄHIGKEIT NICHT ERFÜLLT'
                        ) : 'SCHLANKHEIT GREIFT NICHT (Überschritten!)'}
                      </h4>
                      <p className="text-xs leading-normal opacity-90">
                        {isSlendernessOk ? (
                          isCapacityOk 
                            ? `Die bemessene Wandstärke von ${thickness} cm hält mit einer rechnerischen Wandkapazität von ${formatDeZahl(n_Rd, 1)} kN/m der Traglast von ${designLoad} kN/m einwandfrei stand.`
                            : `Die berechnete Wandtragfähigkeit beträgt nur ${formatDeZahl(n_Rd, 1)} kN/m. Dies reicht für die äußere Belastung von ${designLoad} kN/m nicht aus!`
                        ) : `Der berechnete Schlankheitsgrad beträgt ${formatDeZahl(slenderness, 1)}, der über dem im Rechner angesetzten Grenzwert 21 liegt (Lehrannahme, Grenzwert nach DIN 18940 manuell prüfen). Erhöhen Sie die Wanddicke.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Feuchteschutz & Konstruktion */}
        {activeTab === 'dauerhaftigkeit' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Da Lehm rein physikalisch bindet und wasserlöslich ist, ist der konstruktive Feuchteschutz entscheidend. Mit einfachen Regeln („guter Stiefel und guter Hut“) sind Lehmbauten sehr dauerhaft.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col gap-3">
                <h3 className="font-bold text-shiraz flex items-center gap-1.5 text-sm uppercase tracking-wider">
                  <ShieldCheck size={18} /> 1. Spritzwasserschutz („Der Stiefel“)
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed flex-1">
                  Der sensible Fußpunkt der Lehmwand im erdberührten Sockelbereich muss zwingend aus wasserfesten Baustoffen (z. B. Beton, Mauerwerk aus Klinker, Schaumglas) hergestellt werden.
                </p>
                <div className="bg-slate-100 p-3 rounded-lg text-[11px] font-mono border text-slate-700">
                  <strong>Vorgabe (DIN 18940 / WTA):</strong> Sockelhöhe min. 30 cm über Geländeoberfläche im fertigen Zustand.
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col gap-3">
                <h3 className="font-bold text-shiraz flex items-center gap-1.5 text-sm uppercase tracking-wider">
                  <HardHat size={18} /> 2. Niederschlagsschutz („Der Hut“)
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed flex-1">
                  Gegen direkten Schlagregen sind breite architektonische Schutzflächen unerlässlich, damit Lehmoberflächen nicht ausgewaschen werden.
                </p>
                <div className="bg-slate-100 p-3 rounded-lg text-[11px] font-mono border text-slate-700">
                  <strong>Schutzmaßnahme:</strong> Großzügige Dachüberstände. Alternativ hydrophobe Bekleidungen oder Holzverschalungen.
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col gap-3">
                <h3 className="font-bold text-shiraz flex items-center gap-1.5 text-sm uppercase tracking-wider">
                  <Droplets size={18} /> 3. Diffusionsoffenheit („Die Lunge“)
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed flex-1">
                  Lehmwände müssen diffusionsoffen und sorptionsfähig bleiben. Diffusionsdichte Folien, Dispersions- oder Kunstharzbeschichtungen sind ungeeignet.
                </p>
                <div className="bg-slate-100 p-3 rounded-lg text-[11px] font-mono border text-slate-700">
                  <strong>Kompatibilität:</strong> Sumpfkalkfarben, Rein-Silikatfarben oder spezielle, diffusionsoffene Lehm-Designputze.
                </div>
              </div>
            </div>

            <div className="bg-amber-50/50 border-l-4 border-l-amber-500 p-4 rounded-xl flex gap-3 text-sm text-stone-900 mt-4 shadow-3xs">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-sm">Feuchtebegrenzung:</strong> Lehmbauteile dürfen nicht dauerhaft hoher Feuchte oder stehendem Wasser ausgesetzt sein, da Festigkeit und Schimmelresistenz mit steigendem Wassergehalt sinken (Anwendungsgrenzen nach DIN 18940 beachten).
              </div>
            </div>
          </div>
        )}
      </div>

      <ModulTest moduleId="bp_lehmbauprodukte" />

      {/* Structured Footer */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Lehmbau', url: 'https://de.wikipedia.org/wiki/Lehmbau' },
          { title: 'Lehmstein', url: 'https://de.wikipedia.org/wiki/Lehmstein' }
        ]}
        weblinks={[
          { title: 'Dachverband Lehm e. V.', url: 'https://www.dachverband-lehm.de/' }
        ]}
        literatur={[
          'Minke, Gernot: Handbuch Lehmbau - Baustoffkunde, Techniken und Architektur (Ökobuch Verlag)',
          'Dachverband Lehm e. V. (Hrsg.): Lehmbau Regeln – Begriffe, Baustoffe, Bauteile. 3., überarb. Aufl., Wiesbaden: Vieweg+Teubner 2009',
          'Dachverband Lehm e. V.: Technische Merkblätter TM01 Anforderungen an Lehmputz als Bauteil (2. Aufl., Juni 2014), TM05 Qualitätsüberwachung von Baulehm (Juni 2011), TM06 Lehmdünnlagenbeschichtungen (Juni 2015)'
        ]}
        regelwerke={[
          { title: 'DIN 18940:2023-06: Tragendes Lehmsteinmauerwerk – Konstruktion, Bemessung und Ausführung' },
          { title: 'DIN 18945:2024-03: Lehmsteine - Anforderungen, Prüfung und Kennzeichnung' },
          { title: 'DIN 18946:2024-03: Lehmmauermörtel - Anforderungen, Prüfung und Kennzeichnung' },
          { title: 'DIN 18947:2024-03: Lehmputzmörtel - Anforderungen, Prüfung und Kennzeichnung' },
          { title: 'DIN 18948:2024-03: Lehmplatten - Anforderungen, Prüfung und Kennzeichnung' }
        ]}
        formeln={[
          {
            formel: '\\lambda = \\frac{h_{ef}}{t} \\leq 21',
            erklaerung: 'Schlankheit der Wand (Grenzwert 21 als Lehrannahme; maßgebender Wert nach DIN 18940 manuell prüfen).',
            quelle: 'DIN 18940 Kap. 6.2'
          },
          {
            formel: 'N_{Rd} = \\Phi \\cdot t \\cdot f_d',
            erklaerung: 'Bemessungswert des vertikalen Tragwiderstands pro Längeneinheit unter Berücksichtigung von Ausbiegungen.',
            quelle: 'DIN 18940 Kap. 6.1'
          }
        ]}
      />
    </div>
  );
}
