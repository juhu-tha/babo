import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Layers, 
  Check, 
  Info, 
  AlertTriangle, 
  Building2, 
  Hammer, 
  Sliders, 
  Ruler, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  HelpCircle,
  FileCheck,
  CheckCircle2,
  BookmarkCheck,
  ChevronRight
} from 'lucide-react';

// Joint calculation parameters
interface SubstrateMaterial {
  name: string;
  alpha: number; // Thermal expansion coefficient in 10^-6 / K
  description: string;
}

interface SealantZgv {
  name: string;
  chemicalBase: string;
  zgv: number; // Zulässige Gesamtverformung in %
  description: string;
}

const SUBSTRATES: Record<string, SubstrateMaterial> = {
  concrete: { name: 'Normalbeton / Stahlbeton', alpha: 12, description: 'Tragender Baustoff mit mäßiger thermischer Ausdehnung.' },
  brick: { name: 'Ziegelmauerwerk / Klinker', alpha: 6, description: 'Geringe Formänderung bei Temperaturschwankungen.' },
  vulkan: { name: 'Porenbeton / Gasbeton', alpha: 8, description: 'Mittlere Dehnung, hochporöser, saugfähiger Untergrund.' },
  aluminium: { name: 'Aluminium (eloxiert / roh)', alpha: 23, description: 'Metalle weisen extreme thermische Bewegung auf.' },
  steel: { name: 'Konstruktionsstahl', alpha: 12, description: 'Verhält sich thermisch wie Beton (ideal für Verbundfugen).' },
  pvc: { name: 'Hart-PVC / Kunststoffprofile', alpha: 80, description: 'Enormer Ausdehnungskoeffizient, extrem bewegungsfreudig.' },
  wood: { name: 'Nadelholz (senkrecht zur Faser)', alpha: 35, description: 'Quellt und schwindet zusätzlich stark hygrisch.' }
};

const SEALANTS: Record<string, SealantZgv> = {
  pu_premium: { name: 'Premium Elastischer Polyurethan-Dichtstoff', chemicalBase: 'Polyurethan (PU)', zgv: 25, description: 'Klassiker für hohe mechanische Lasten (Fassaden, Bodenfugen nach DIN 18540).' },
  stp_hybrid: { name: 'Silanterminiertes Polymer (STP / Hybrid)', chemicalBase: 'MS-Polymer', zgv: 25, description: 'Breites Einsatzgebiet, blasenfreie Härtung, UV-stabil, überstreichbar.' },
  silicone: { name: 'Hochelastisches Bausilikon', chemicalBase: 'Silikon (SI)', zgv: 25, description: 'Höchste Witterungsbeständigkeit. Aber Achtung: nicht überstreichbar!' },
  acrylic: { name: 'Plastisch-elastisches Fugenacryl', chemicalBase: 'Acrylat-Dispersion', zgv: 12.5, description: 'Geringe Dehnfähigkeit. Ideal für Trockenbau-Innerecken mit geringer Dehnung.' },
  butyl: { name: 'Plastischer Butyldichtstoff', chemicalBase: 'Butylkautschuk', zgv: 5, description: 'Rein plastischer Schwundausgleich, härtet nicht aus, ideal für Überlappungen.' }
};

export function KlebstoffBerater() {
  const [activeSubTab, setActiveSubTab] = useState<'rechner' | 'untergrund' | 'regeln'>('rechner');

  // Input States for Fugendimensionierung
  const [subA, setSubA] = useState<string>('concrete');
  const [subB, setSubB] = useState<string>('concrete');
  const [componentLength, setComponentLength] = useState<number>(6.5); // meters
  const [tempDelta, setTempDelta] = useState<number>(80); // Kelvin (standard is 80K for Central Europe exterior)
  const [selectedSealant, setSelectedSealant] = useState<string>('pu_premium');
  const [mountingTolerance, setMountingTolerance] = useState<number>(5); // mm

  // Substrate-Matrix Selected States
  const [matrixSub, setMatrixSub] = useState<string>('concrete');

  // 1. Calculations: Thermal Expansion and Joint Width according to DIN 18540 with herstellerneutral formulas
  const calcResults = useMemo(() => {
    const matA = SUBSTRATES[subA] || SUBSTRATES.concrete;
    const matB = SUBSTRATES[subB] || SUBSTRATES.concrete;
    const sealant = SEALANTS[selectedSealant] || SEALANTS.pu_premium;

    // Standard formula: ΔL = L * (α_A/2 + α_B/2) * 10^-6 * ΔT * 10^3 (to get mm)
    const avgAlpha = (matA.alpha + matB.alpha) / 2;
    const deltaL = componentLength * avgAlpha * tempDelta * 0.001; // in mm

    // Required functional width: w_func = (ΔL / (ZGV / 100))
    const zgvFraction = sealant.zgv / 100;
    const wFunc = zgvFraction > 0 ? (deltaL / zgvFraction) : 0;

    // Total target joint width: b = w_func + mounting_tolerance
    const rawTargetWidth = wFunc + mountingTolerance;
    // According to DIN 18540, the minimum width for outdoor joints is 10 mm.
    const calculatedWidth = Math.max(10, Math.ceil(rawTargetWidth));

    // Dynamic Joint Depth formulation:
    // b <= 10mm -> t = 10mm
    // 10mm < b <= 15mm -> t = 10 to 12mm
    // b > 15mm -> t = b/2 to b/1.5 (we use standard DIN rule: t = b/2 + 2mm)
    let calculatedDepth = 10;
    if (calculatedWidth <= 10) {
      calculatedDepth = 8;
    } else if (calculatedWidth <= 15) {
      calculatedDepth = 10;
    } else {
      calculatedDepth = Math.round(calculatedWidth / 2) + 2;
    }

    // Required PE Backer Rod size (Hinterfüllschnur)
    // Needs to be 25-30% larger than joint width to sit in place tightly
    const rawRod = calculatedWidth * 1.25;
    const recommendedRod = Math.ceil(rawRod / 5) * 5; // round to nearest 5mm (typical commercially herstellerneutral diameters: 6, 10, 15, 20, 25, 30, 40 mm)

    return {
      deltaL,
      wFunc,
      calculatedWidth,
      calculatedDepth,
      recommendedRod,
      avgAlpha
    };
  }, [subA, subB, componentLength, tempDelta, selectedSealant, mountingTolerance]);

  // Advisor logic for Substrate Pretreatment based on scientific physical requirements (independent of specific manufacturers, herstellerneutral)
  const pretreatInstructions = useMemo(() => {
    switch (matrixSub) {
      case 'concrete':
        return {
          cleaner: 'Abrasive Reinigung mit Drahtbürste, ölfreie Druckluft zum Ausblasen oder Entstauben.',
          primer: 'Tiefenwirksamer, feuchtigkeitshärtender Kresol-Polyurethan-Primer (Porenabsperrend, verfestigend für mineralische Poren)',
          flashTime: '30 bis 60 Minuten (zwingend erforderlich, damit Lösemittel vollständig entweichen)',
          advise: 'Beton muss mindestens 28 Tage alt sein und die Feuchte < 4 Gew.-% betragen. Zementschlämme vorher mechanisch mittels Schleifen entfernen!'
        };
      case 'brick':
        return {
          cleaner: 'Trockenes Abbürsten, Staubsaugen. Keine feuchte Reinigung!',
          primer: 'Spezifischer, lösungsmittelhaltiger Reaktionsgrundstoff auf Epoxid- oder Polyurethanbasis.',
          flashTime: '45 bis 60 Minuten.',
          advise: 'Fugenflanken müssen fest und frei von bröseligem Mörtel sein. Instabile Fugen ausmeißeln und mit Reparaturmörtel (Klasse R3 nach DIN EN 1504-3) vorsanieren.'
        };
      case 'vulkan':
        return {
          cleaner: 'Gründliches Ausblasen und Absaugen. Sehr empfindlich gegen Feuchtigkeitsansammlung.',
          primer: 'Hochelastische Kunstharzgrundierung auf Silan- oder Acrylbasis mit extrem hohem Eindringvermögen.',
          flashTime: '60 Minuten.',
          advise: 'Porenbeton saugt Bindemittel extrem stark auf. Ein fehlender Primer führt zum "Verhungern" der Klebefuge, da das flüssige Polymer in die Poren weggesaugt wird.'
        };
      case 'aluminium':
        return {
          cleaner: 'Isopropanol-basierter Spezialreiniger. Reinigung mit zwei Tüchern (1. Nass wischen, 2. Trocken reiben, kein Antrocknen lassen!).',
          primer: 'Nicht zwingend erforderlich bei STP-Hybridpolymeren, jedoch dringend empfohlen bei hoher Feuchtebelastung (Haftaktivator auf Silanbasis aufreiben).',
          flashTime: '10 bis 15 Minuten (sehr flüchtig).',
          advise: 'Eloxierschichten dürfen nicht mit abrasiven Vliesen beschädigt werden. Rohes Aluminium hat eine labile Oxidschicht und erfordert mechanisches Anschleifen vor dem Reinigen.'
        };
      case 'steel':
        return {
          cleaner: 'Entrosten bis zum metallischen Glanz (Klasse Sa 2½ nach DIN EN ISO 12944-4), danach Entfetten mit Aceton.',
          primer: 'Aktiver Korrosionsschutzprimer (Zinkphosphatgrundierung) oder 2K-Epoxid-Haftvermittler.',
          flashTime: '30 bis 45 Minuten.',
          advise: 'Im Außenbereich führt Feuchtigkeitsunterwanderung am Dichtstoffrand zu Rostsprengung. Daher ist der Randzonenkorrosionsschutz von existentieller Bedeutung.'
        };
      case 'pvc':
        return {
          cleaner: 'Kunststoffreiniger auf Alkoholbasis (kein Aceton oder Ethylacetat verwenden, da diese Kunststoffe anlösen!).',
          primer: 'Spezifischer Kunststoff-Haftvermittler (Primer für thermoplastische Polymere).',
          flashTime: '20 bis 30 Minuten.',
          advise: 'Infolge der enormen Weichmacherwanderung in Standard-PVC können Verbindungen anreißen. Nutzen Sie weichmacherbeständige STP- oder Silikonsysteme.'
        };
      case 'wood':
        return {
          cleaner: 'Schleifen der Fugenflanke in Faserrichtung, sorgfältiges Absaugen.',
          primer: 'Wässriger oder alkoholbasierter Holzgrundierprimer (sperrt Holzinhaltsstoffe wie Gerbsäure ab).',
          flashTime: '45 bis 90 Minuten.',
          advise: 'Holzfeuchte darf bei Zuweisung maximal 15 % betragen, da es sonst zu starkem hygrischen Schwinden und Abreißen kommt.'
        };
      default:
        return {
          cleaner: 'Universal-Lösemittelreiniger.',
          primer: 'Standardprimer.',
          flashTime: '30 Minuten.',
          advise: ''
        };
    }
  }, [matrixSub]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Intro Box */}
      <div className="bg-gradient-to-r from-shiraz/5 to-blue-500/5 p-5 rounded-2xl border border-shiraz/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Calculator className="text-shiraz" size={18} /> Rechner- &amp; Expertensystem: Kleb- und Dichtstofftechnik
          </h3>
          <p className="text-xs text-text-main/70 mt-1">
            Wissenschaftliche Auswertung von Fugenbewegungen nach DIN 18540, Flankenvorbehandlung und herstellerneutralen Systemregeln.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-250">
          <BookmarkCheck size={14} className="text-shiraz" /> Lehr-Referenz Klebstofftechnik (z. B. Fachhandbuch/Fibel als Beispiel)
        </div>
      </div>

      {/* Sub Tabs Selection */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('rechner')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'rechner' 
              ? 'border-shiraz text-shiraz font-extrabold bg-shiraz/5' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders size={14} /> Fugen-Dimensions-Rechner (DIN 18540)
        </button>
        <button
          onClick={() => setActiveSubTab('untergrund')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'untergrund' 
              ? 'border-shiraz text-shiraz font-extrabold bg-shiraz/5' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={14} /> Untergrund &amp; Primer-Matrix
        </button>
        <button
          onClick={() => setActiveSubTab('regeln')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'regeln' 
              ? 'border-shiraz text-shiraz font-extrabold bg-shiraz/5' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles size={14} /> Die 5 goldenen Kleb-Regeln
        </button>
      </div>

      {/* SUB-TAB 1: CALCULATOR */}
      {activeSubTab === 'rechner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inputs Column */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PARAMETER FÜR DIE BAUTEILSIMULATION</span>
            
            {/* Component Materials Selector */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Bauteil A Material</label>
                <select
                  value={subA}
                  onChange={(e) => setSubA(e.target.value)}
                  className="w-full text-xs font-bold p-1 border border-slate-200 rounded focus:ring-1 focus:ring-shiraz text-slate-700 bg-white"
                >
                  {Object.entries(SUBSTRATES).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 font-mono">α: {formatDeWert(SUBSTRATES[subA].alpha)} × 10⁻⁶/K</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Bauteil B Material</label>
                <select
                  value={subB}
                  onChange={(e) => setSubB(e.target.value)}
                  className="w-full text-xs font-bold p-1 border border-slate-200 rounded focus:ring-1 focus:ring-shiraz text-slate-700 bg-white"
                >
                  {Object.entries(SUBSTRATES).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 font-mono">α: {formatDeWert(SUBSTRATES[subB].alpha)} × 10⁻⁶/K</span>
              </div>
            </div>

            {/* Slider: Length of component */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Bauteillänge / Fugenabstand L</span>
                <span className="font-mono text-xs text-shiraz">{formatDeZahl(componentLength, 1)} Meter</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={componentLength}
                onChange={(e) => setComponentLength(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded appearance-none cursor-pointer accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block font-normal text-right">Abstand zwischen den Dehnfugen.</span>
            </div>

            {/* Temperature Delta Slider */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Temperaturspanne ΔT</span>
                <span className="font-mono text-xs text-shiraz">{formatDeWert(tempDelta)} K (°C)</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={tempDelta}
                onChange={(e) => setTempDelta(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded appearance-none cursor-pointer accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block font-normal">
                Standard außen in Mitteleuropa: <strong>80 K</strong> (z.B. -20°C Winter bis +60°C Bauteiltemperatur Sommertag).
              </span>
            </div>

            {/* Sealant material selection */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Fugendichtstoffklasse &amp; Flexibilität</label>
              <select
                value={selectedSealant}
                onChange={(e) => setSelectedSealant(e.target.value)}
                className="w-full text-xs font-bold p-2 border border-slate-200 rounded focus:ring-1 focus:ring-shiraz text-slate-700 bg-white"
              >
                {Object.entries(SEALANTS).map(([key, val]) => (
                  <option key={key} value={key}>{val.name} ({formatDeWert(val.zgv)}% ZGV)</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 italic leading-snug">
                {SEALANTS[selectedSealant].description}
              </p>
            </div>

            {/* Mounting Tolerance */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Einbautoleranz (Handwerkliche Abweichung)</label>
              <select
                value={mountingTolerance}
                onChange={(e) => setMountingTolerance(parseInt(e.target.value))}
                className="w-full text-xs font-bold p-2 border border-slate-200 rounded focus:ring-1 focus:ring-shiraz text-slate-700 bg-white"
              >
                <option value={0}>0 mm (Laborbedingungen)</option>
                <option value={3}>3 mm (Präzise Fertigteilmontage)</option>
                <option value={5}>5 mm (Standard-Hochbau DIN 18540)</option>
                <option value={8}>8 mm (Erhöhte Abweichungen / Toleranzen)</option>
              </select>
            </div>

          </div>

          {/* Graphical representation / Output Column */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Dyn Fuge graphic */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-[230px]">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  Maßstabsunabhängige Fugen-Dehnquerschnitts-Grafik
                </span>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Zeigt die unentbehrliche <strong>PE-Hinterfüllschnur</strong> zur Verhinderung der Dreipunkthaftung sowie das berechnete Breiten-Tiefen-Verhältnis (Adhäsionsflanken grün).
                </p>
              </div>

              {/* Fuge Visual Element */}
              <div className="relative flex items-stretch h-[100px] border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                
                {/* Flanke Links */}
                <div className="w-[28%] bg-slate-300 border-r-4 border-emerald-600 flex flex-col items-center justify-center p-1 text-center select-none">
                  <span className="text-[10px] font-black text-slate-800 leading-none">{SUBSTRATES[subA].name.split(' (')[0].split(' /')[0]}</span>
                  <span className="text-[8px] text-slate-500 font-mono mt-1">Grenzfläche A</span>
                </div>

                {/* Fugenraum */}
                <div className="flex-1 flex flex-col items-center justify-end relative pb-2 bg-slate-50">
                  
                  {/* Dichtstoff (Hundeknochen / Bogenprofil) */}
                  <div className="absolute inset-x-2 top-0 bottom-4 bg-sky-200 border-b border-sky-400 rounded-b-[40%] flex flex-col items-center justify-center z-10 opacity-90 shadow-inner">
                    <span className="text-[10px] font-black text-sky-950 leading-none">Dichtstoff</span>
                    <span className="text-[9px] font-mono font-bold text-sky-800 mt-1">t = {formatDeWert(calcResults.calculatedDepth)} mm</span>
                  </div>

                  {/* Hinterfüllschnur PE */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-slate-300 border-2 border-slate-400 shadow-xs flex items-center justify-center z-0">
                    <span className="text-[8px] font-bold text-slate-600 text-center font-mono leading-none">PE<br />Ø{formatDeWert(calcResults.recommendedRod)}</span>
                  </div>

                  {/* Dimension marker */}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[9px] font-mono font-bold text-slate-500 border-t border-dashed border-slate-300 bg-white/40 z-20">
                    <span>Fugen-Nennbreite b =</span>
                    <span>{formatDeWert(calcResults.calculatedWidth)} mm</span>
                  </div>

                </div>

                {/* Flanke Rechts */}
                <div className="w-[28%] bg-slate-300 border-l-4 border-emerald-600 flex flex-col items-center justify-center p-1 text-center select-none">
                  <span className="text-[10px] font-black text-slate-800 leading-none">{SUBSTRATES[subB].name.split(' (')[0].split(' /')[0]}</span>
                  <span className="text-[8px] text-slate-500 font-mono mt-1">Grenzfläche B</span>
                </div>

              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-bold">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" /> Grüne Flanke = Adhäsionsbereich</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-sky-200 rounded-full" /> Blau = Elastischer Dichtstoff</span>
                <span>Untergrundkontakt entkoppelt!</span>
              </div>

            </div>

            {/* Calculations Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Thermisches Delta (ΔL)</span>
                <div className="my-1.5 flex items-baseline gap-1">
                  <span className="text-xl font-mono font-bold text-slate-800">{formatDeZahl(calcResults.deltaL, 2)}</span>
                  <span className="text-[9.5px] text-slate-500 font-bold font-mono">mm</span>
                </div>
                <span className="text-[9.5px] text-slate-500 leading-tight">Rein physikalische Ausdehnung der Bauteile.</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Dehnbestimmte Breite</span>
                <div className="my-1.5 flex items-baseline gap-1">
                  <span className="text-xl font-mono font-bold text-shiraz">{formatDeZahl(calcResults.wFunc, 1)}</span>
                  <span className="text-[9.5px] text-slate-500 font-bold font-mono">mm</span>
                </div>
                <span className="text-[9.5px] text-slate-500 leading-tight">Breite ohne Einbautoleranz. (ZGV berücksichtigt)</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Nennmaß der Fuge (b)</span>
                <div className="my-1.5 flex items-baseline gap-0.5">
                  <span className="text-xl font-mono font-black text-emerald-700">~{formatDeWert(calcResults.calculatedWidth)}</span>
                  <span className="text-[9.5px] text-emerald-800 font-bold font-mono">mm</span>
                </div>
                <span className="text-[9.5px] text-slate-500 leading-tight">Zu planendes Nennmaß (DIN 18540, gerundet).</span>
              </div>
            </div>

            {/* Dimensioning Rules text details */}
            <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs leading-relaxed text-slate-700 font-normal">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider block flex items-center gap-1">
                <Info size={14} className="text-shiraz" /> Baupraktische Rechnertipps nach DIN 18540 &amp; IVD
              </h4>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                <li>
                  <strong>Tiefen-Breiten-Verhältnis:</strong> Bei Bauwerksfugen darf die Fugentiefe (t) niemals größer sein als die Fugenbreite (b). Bei Fugen über 15 mm gilt die Standardregel: <strong>t = b/2 + 2 mm</strong> oder maximal 15 mm Fugenmitte-Tiefe, um Eigenspannungen gering zu halten.
                </li>
                <li>
                  <strong>Hinterfüllung:</strong> Die PE-Rundschnur dichtet den Fugenboden ab und sorgt für das optimale, leicht taillierte Profil des Dichtstoffbettes, das Spannungsspitzen auf mechanischen Flanken perfekt dämpft.
                </li>
                <li>
                  <strong>Warnung Dreipunkthaftung:</strong> Ohne Hinterfüllschnur haftet der Dichtstoff am Fugenboden. Bei Bauteilbewegungen entstehen so enorme, mehrachsige Ausreißkräfte – der Kleber reißt an den Rändern sofort ab (Adhäsionsbruch).
                </li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 2: SUBSTRATE MATRIX */}
      {activeSubTab === 'untergrund' && (
        <div className="space-y-4">
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              Interaktive herstellerneutrale Vorbehandlungs- &amp; Primer-Matrix
            </span>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              Jeder Baustoff besitzt spezifische oberflächenchemische Eigenschaften. Wählen Sie einen Untergrund aus, um nach bauchemischen Prinzipien die notwendigen Vorbereitungsschritte und Haftvermittler zu bestimmen:
            </p>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {Object.entries(SUBSTRATES).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setMatrixSub(key)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    matrixSub === key
                      ? 'bg-shiraz text-white border-shiraz shadow-inner scale-[1.01]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {val.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs space-y-2">
              <span className="text-[10px] font-extrabold text-shiraz uppercase tracking-wider block">1. REINIGUNG &amp; AKTIVIERUNG</span>
              <p className="text-xs font-semibold text-slate-800">{pretreatInstructions.cleaner}</p>
              <p className="text-[11.5px] text-slate-500 font-normal leading-normal">
                Reinigt die Poren bzw. entfettet metallische Oberflächen von Zieh- und Transportfetten.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs space-y-2">
              <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider block">2. HAFTVERMITTLER (PRIMER)</span>
              <p className="text-xs font-semibold text-slate-800">{pretreatInstructions.primer}</p>
              <p className="text-[11.5px] text-slate-500 font-normal leading-normal">
                Sichert die Adhäsion und bildet eine kovalente Brücke bei dauerhafter Feuchtigkeits- oder Frost-Witterungseinwirkung.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs space-y-2">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">3. ABSCHLUSS-WARTEZEIT &amp; TIPPS</span>
              <p className="text-xs font-semibold text-slate-800">Ablüftzeit: {pretreatInstructions.flashTime}</p>
              <p className="text-[11.5px] text-slate-500 font-normal leading-normal">
                Das vorzeitige Fugenschließen schließt Lösungsmittelgasgase ein – Blasenbildung und Haftungsverlust sind die Folge.
              </p>
            </div>

          </div>

          {pretreatInstructions.advise && (
            <div className="p-4 bg-amber-50/50 border border-amber-250 text-amber-950 rounded-xl flex gap-3 text-xs lead-normal font-normal">
              <AlertTriangle className="text-amber-700 shrink-0 h-4.5 w-4.5 mt-0.5" />
              <div>
                <strong>Praxis-Warnhinweis für Spezialisten:</strong> {pretreatInstructions.advise}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: THE 5 GOLDEN RULES */}
      {activeSubTab === 'regeln' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          <div className="bg-white p-4.5 rounded-xl border border-slate-205 shadow-xs flex flex-col justify-between font-normal">
            <div>
              <span className="text-xl font-black text-shiraz/35 font-mono block leading-none mb-1">01</span>
              <h4 className="text-xs font-bold text-slate-800 mb-1 leading-tight">Drahttrocken &amp; Schichtfrei</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Der Fugenuntergrund muss tragfähig und frei von Zementschlämme, Rost oder alter Farbschicht sein. Mechanische Reinigung geht vor Chemie!
              </p>
            </div>
            <div className="border-t border-slate-100 pt-2.5 mt-2.5 text-[10px] text-slate-400 font-mono">
              Tragfähigkeit (DIN 18540)
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-xl border border-slate-205 shadow-xs flex flex-col justify-between font-normal">
            <div>
              <span className="text-xl font-black text-blue-800/35 font-mono block leading-none mb-1">02</span>
              <h4 className="text-xs font-bold text-slate-800 mb-1 leading-tight">Glutheiß entfettet (Zwei-Tuch Methodik)</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Metalle/Glas mit unverdünntem Reiniger abwischen und sofort trocken nachreiben. Kein Ablüften des Drecks erlauben!
              </p>
            </div>
            <div className="border-t border-slate-100 pt-2.5 mt-2.5 text-[10px] text-slate-400 font-mono">
              Entfettung (IVD 9)
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-xl border border-slate-205 shadow-xs flex flex-col justify-between font-normal">
            <div>
              <span className="text-xl font-black text-amber-800/35 font-mono block leading-none mb-1">03</span>
              <h4 className="text-xs font-bold text-slate-800 mb-1 leading-tight">Ablüftzeiten zwingend stoppen</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Die chemische Veresterung der Primer benötigt die vorgeschriebene Wartezeit, um Blasenbildung im verlegten Dichtstoff auszuschalten.
              </p>
            </div>
            <div className="border-t border-slate-100 pt-2.5 mt-2.5 text-[10px] text-slate-400 font-mono">
              Flash-off Phasen
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-xl border border-slate-205 shadow-xs flex flex-col justify-between font-normal">
            <div>
              <span className="text-xl font-black text-emerald-800/35 font-mono block leading-none mb-1">04</span>
              <h4 className="text-xs font-bold text-slate-800 mb-1 leading-tight">Flankenhaftung rein eloxieren</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                3-Punkt-Behinderung im Fugenboden verhindern. PE-Rundschnur elastisch einschieben, ohne deren geschlossenzellige Außenhaut zu ritzen.
              </p>
            </div>
            <div className="border-t border-slate-100 pt-2.5 mt-2.5 text-[10px] text-slate-400 font-mono">
              Fugenbodenfreiheit
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-xl border border-slate-205 shadow-xs flex flex-col justify-between font-normal">
            <div>
              <span className="text-xl font-black text-slate-800/35 font-mono block leading-none mb-1">05</span>
              <h4 className="text-xs font-bold text-slate-800 mb-1 leading-tight">Perfekt abgezogenes Profil</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Nur neutrale Spezialglättmittel verwenden. Zu viel Seifenwasser wäscht Dispersionen aus und führt zur Verfärbung oder vorzeitiger Alterung.
              </p>
            </div>
            <div className="border-t border-slate-100 pt-2.5 mt-2.5 text-[10px] text-slate-400 font-mono">
              Oberflächenfinishing
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
