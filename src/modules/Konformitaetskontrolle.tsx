import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Calculator, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  Printer, 
  Info, 
  X,
  FileText,
  ClipboardCheck,
  BookOpen
} from 'lucide-react';
import inhalt from '@/content/konformitaetskontrolle/Konformitaetskontrolle.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

interface ConcreteClass {
  name: string;
  fck_cyl: number;
  fck_cube: number;
}

const CONCRETE_CLASSES: ConcreteClass[] = [
  { name: 'C8/10', fck_cyl: 8, fck_cube: 10 },
  { name: 'C12/15', fck_cyl: 12, fck_cube: 15 },
  { name: 'C16/20', fck_cyl: 16, fck_cube: 20 },
  { name: 'C20/25', fck_cyl: 20, fck_cube: 25 },
  { name: 'C25/30', fck_cyl: 25, fck_cube: 30 },
  { name: 'C30/37', fck_cyl: 30, fck_cube: 37 },
  { name: 'C35/45', fck_cyl: 35, fck_cube: 45 },
  { name: 'C40/50', fck_cyl: 40, fck_cube: 50 },
  { name: 'C45/55', fck_cyl: 45, fck_cube: 55 },
  { name: 'C50/60', fck_cyl: 50, fck_cube: 60 },
  { name: 'C55/67', fck_cyl: 55, fck_cube: 67 },
  { name: 'C60/75', fck_cyl: 60, fck_cube: 75 },
  { name: 'C70/85', fck_cyl: 70, fck_cube: 85 },
  { name: 'C80/95', fck_cyl: 80, fck_cube: 95 },
  { name: 'C90/105', fck_cyl: 90, fck_cube: 105 },
  { name: 'C100/115', fck_cyl: 100, fck_cube: 115 },
];

export default function Konformitaetskontrolle() {
  // State for the interactive simulator
  const [selectedClassNav, setSelectedClassNav] = useState<string>('C25/30');
  const [specimenType, setSpecimenType] = useState<'cube' | 'cylinder'>('cube');
  const [testMode, setTestMode] = useState<'anfang' | 'stetig' | 'identitaet'>('anfang');
  
  // Custom single value inputs
  const [singleValueInput, setSingleValueInput] = useState<string>('');
  
  // Custom multi/CSV import string
  const [csvInput, setCsvInput] = useState<string>('');
  
  // The list of compression test results
  const [testValues, setTestValues] = useState<number[]>([34.5, 33.0, 36.5, 32.8, 35.2]);

  // QA Protocol Mock state 
  const [protocolMeta, setProtocolMeta] = useState({
    project: inhalt.werte.beispielprojektBauteilStützeA1,
    contractor: inhalt.werte.musterbauGmbh,
    inspector: inhalt.werte.nNÜberwachungsstelle,
    date: '2026-06-10'
  });

  const selectedClass = CONCRETE_CLASSES.find(c => c.name === selectedClassNav) || CONCRETE_CLASSES[3];
  const fck = specimenType === 'cube' ? selectedClass.fck_cube : selectedClass.fck_cyl;

  // Presets load functions
  const loadPreset = (type: 'pass_anfang' | 'fail_mean_anfang' | 'fail_single_anfang' | 'pass_stetig' | 'fail_stetig' | 'pass_identitaet' | 'fail_identitaet') => {
    switch (type) {
      case 'pass_anfang':
        setTestValues([fck + 5.2, fck + 4.1, fck + 6.8, fck + 3.9, fck + 5.0]);
        setTestMode('anfang');
        break;
      case 'fail_mean_anfang':
        // Individual values above fck-4 but mean below fck+4
        setTestValues([fck + 1.2, fck + 1.8, fck + 0.5, fck + 2.1]);
        setTestMode('anfang');
        break;
      case 'fail_single_anfang':
        // High mean but one critical failure below fck-4
        setTestValues([fck + 12.0, fck - 4.5, fck + 8.2, fck + 9.5]);
        setTestMode('anfang');
        break;
      case 'pass_stetig': {
        // 15 values passing with realistic distribution
        const s = 3.5;
        const offset = 1.48 * s + 1.5;
        const vals = [0.2, -1.1, 1.9, 0.4, -0.6, 2.1, -1.8, 0.9, -0.3, 1.2, -0.9, 2.4, -2.2, 0.5, 1.1]
          .map(noise => Number((fck + offset + noise * 1.5).toFixed(1)));
        setTestValues(vals);
        setTestMode('stetig');
        break;
      }
      case 'fail_stetig': {
        // 15 values with high standard dev or low mean
        const vals = [fck + 3, fck - 1, fck + 4, fck + 1, fck - 2, fck + 6, fck - 3.8, fck + 2, fck - 0.5, fck + 5, fck - 1, fck + 0.8, fck - 3, fck + 4.5, fck - 1.2];
        setTestValues(vals);
        setTestMode('stetig');
        break;
      }
      case 'pass_identitaet':
        setTestValues([fck + 2.5, fck + 1.8, fck + 3.1]);
        setTestMode('identitaet');
        break;
      case 'fail_identitaet':
        setTestValues([fck + 0.2, fck - 0.5, fck + 0.7]);
        setTestMode('identitaet');
        break;
    }
  };

  // Predefined Concrete Examples for DIN EN 206 (No manual input required)
  const loadConcreteExample = (id: 1 | 2 | 3) => {
    if (id === 1) {
      // Scenario 1: Conform - Anfangsproduktion C25/30 - Cube
      setSelectedClassNav('C25/30');
      setSpecimenType('cube');
      setTestMode('anfang');
      setTestValues([34.8, 35.5, 36.2]);
    } else if (id === 2) {
      // Scenario 2: Conform - Stetige Produktion C30/37 - Cube
      setSelectedClassNav('C30/37');
      setSpecimenType('cube');
      setTestMode('stetig');
      setTestValues([41.5, 43.0, 39.5, 42.1, 40.8, 44.5, 38.9, 41.2, 43.1, 40.5, 42.0, 44.8, 39.2, 41.0, 42.5]);
    } else if (id === 3) {
      // Scenario 3: Non-Conform - Identitätsprüfung C30/37 - Cylinder
      setSelectedClassNav('C30/37');
      setSpecimenType('cylinder');
      setTestMode('identitaet');
      setTestValues([31.2, 28.5, 30.1]);
    }
  };

  // Add individual value
  const handleAddValue = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(singleValueInput.replace(',', '.'));
    if (!isNaN(val) && val > 0 && val < 200) {
      setTestValues(prev => [...prev, val]);
      setSingleValueInput('');
    }
  };

  // Import multi-values from CSV
  const handleCsvImport = () => {
    const cleaned = csvInput
      .split(/[\s,;]+/)
      .map(v => parseFloat(v.replace(',', '.')))
      .filter(v => !isNaN(v) && v > 0 && v < 200);
    
    if (cleaned.length > 0) {
      setTestValues(prev => [...prev, ...cleaned]);
      setCsvInput('');
    }
  };

  // Delete an item from values list
  const handleDeleteValue = (index: number) => {
    setTestValues(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all items
  const handleClearAll = () => {
    setTestValues([]);
  };

  // Calculation statistics engine
  const runCalculations = () => {
    const n = testValues.length;
    if (n === 0) {
      return {
        n: 0,
        mean: 0,
        stdDev: 0,
        stdDevUsed: 3.0,
        requiredMean: 0,
        requiredMin: fck - 4.0,
        minVal: 0,
        meanPassed: false,
        minPassed: false,
        isConform: false,
        msg: inhalt.werte.keinePrüfwerteVorhanden
      };
    }

    const mean = testValues.reduce((sum, v) => sum + v, 0) / n;
    
    // Sample variance and standard deviation with Bessel's correction (n - 1)
    let stdDev = 0;
    if (n > 1) {
      const variance = testValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (n - 1);
      stdDev = Math.sqrt(variance);
    }
    const stdDevUsed = Math.max(stdDev, 3.0);

    let requiredMean = fck + 4.0;
    const requiredMin = fck - 4.0;
    const minVal = Math.min(...testValues);

    let meanPassed = false;
    const minPassed = minVal >= requiredMin;
    let limitMessage = '';

    if (testMode === 'anfang') {
      requiredMean = fck + 4.0;
      meanPassed = mean >= requiredMean;
      if (n < 3) {
        limitMessage = `Achtung: Für die Anfangsproduktion sind mindestens n = 3 Messwerte normativ gefordert (aktuell: ${n}).`;
      }
    } else if (testMode === 'stetig') {
      requiredMean = fck + 1.48 * stdDevUsed; // Kriterium 1 stetige Herstellung, DIN EN 206, 8.2.1.3 (Faktor 1,48)
      meanPassed = mean >= requiredMean;
      if (n < 15) {
        limitMessage = `Achtung: Für stetige Produktion sind mindestens n = 15 Messergebnisse aus den letzten 12 Monaten gefordert (aktuell: ${n}).`;
      }
    } else if (testMode === 'identitaet') {
      if (n === 1) {
        requiredMean = fck; // No mean requirement for n = 1 in Identitätsprüfung
        meanPassed = true;
      } else if (n >= 2 && n <= 4) {
        requiredMean = fck + 1.0;
        meanPassed = mean >= requiredMean;
      } else {
        // n >= 5
        requiredMean = fck + 2.0;
        meanPassed = mean >= requiredMean;
      }
      if (n > 6) {
        limitMessage = inhalt.werte.hinweisIdentitätsprüfungenWerdenVor;
      }
    }

    const isConform = meanPassed && minPassed && (testMode === 'anfang' ? n >= 3 : testMode === 'stetig' ? n >= 15 : n >= 1);

    return {
      n,
      mean: Number(mean.toFixed(2)),
      stdDev: Number(stdDev.toFixed(2)),
      stdDevUsed: Number(stdDevUsed.toFixed(2)),
      requiredMean: Number(requiredMean.toFixed(2)),
      requiredMin,
      minVal: Number(minVal.toFixed(2)),
      meanPassed,
      minPassed,
      isConform,
      limitMessage
    };
  };

  const stats = runCalculations();

  // Draw coordinate points on our SVG chart
  // Y range represents strength limits. Auto-scale appropriately.
  const chartYMin = Math.max(0, Math.min(fck - 10, stats.minVal - 5));
  const chartYMax = Math.max(fck + 25, stats.mean + 15, ...testValues) + 5;
  const chartHeight = 220;
  const chartWidth = 560;
  const paddingX = 50;
  const paddingY = 30;

  const getSvgCoordinates = (index: number, val: number) => {
    // X scale depends on total indexes
    const count = Math.max(stats.n, 5);
    const x = paddingX + (index / (count - 1 || 1)) * (chartWidth - 2 * paddingX);
    
    // Y scale
    const yRatio = (val - chartYMin) / (chartYMax - chartYMin || 1);
    const y = chartHeight - paddingY - yRatio * (chartHeight - 2 * paddingY);
    return { x, y };
  };

  // Handle PDF / Print action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8 font-normal">
      
      {/* 1. Einleitender normativer Text & WPK */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2 mb-4">
          <CheckCircle2 className="text-shiraz" /><MdText text={inhalt.texte.produktionsUndKonformitätskontrolleNach} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 leading-relaxed">
          <p><MdText text={inhalt.texte.umDieSicherheitUnd} /></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WPK */}
          <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
            <h3 className="font-bold text-base text-text-main flex items-center gap-1.5 border-b pb-2 border-home-grau/20">
              <ClipboardCheck className="text-shiraz" size={18} /><MdText text={inhalt.texte.werkseigeneProduktionskontrolleWpk} /></h3>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieWerkseigeneProduktionskontrolleWpk} /></p>
            <ul className="list-disc pl-5 text-xs text-text-main/80 space-y-1.5">
              <li><MdText text={inhalt.texte.prüfungDerAusgangsstoffeEignungsprüfunge} /></li>
              <li><MdText text={inhalt.texte.dosierungsprüfungenJustierungVonWaagen} /></li>
              <li><MdText text={inhalt.texte.frischbetonüberwachungKonsistenzprüfunge} /></li>
              <li><MdText text={inhalt.texte.festbetonprüfungKontinuierlicheAbsicheru} /></li>
            </ul>
          </div>

          {/* Konformitätskriterien */}
          <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
            <h3 className="font-bold text-base text-text-main flex items-center gap-1.5 border-b pb-2 border-home-grau/20">
              <Calculator className="text-shiraz" size={18} /><MdText text={inhalt.texte.kriterienFürDruckfestigkeit} /></h3>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.betonGiltAlsKonform} /></p>
            <div className="space-y-2 text-xs">
              <div className="bg-white p-2 rounded border border-home-grau/20 font-sans">
                <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.mittelwertkriteriumFCm} /></strong>
                <ul className="list-none pl-0 space-y-1 text-[11px] text-text-main/90">
                  <li className="flex justify-between">
                    <span><MdText text={inhalt.texte.anfangsproduktionN3} /></span>
                    <span className="font-mono font-bold bg-stone-100 px-1 rounded"><MdText text={inhalt.texte.fCmFCk} /></span>
                  </li>
                  <li className="flex justify-between">
                    <span><MdText text={inhalt.texte.stetigeProduktionN15} /></span>
                    <span className="font-mono font-bold bg-stone-100 px-1 rounded"><MdText text={inhalt.texte.fCmFCk2} /></span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-2 rounded border border-home-grau/20 font-sans">
                <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.einzelwertkriteriumFCi} /></strong>
                <div className="flex justify-between items-center text-[11px]">
                  <span><MdText text={inhalt.texte.jedesEinzelergebnisImKollektiv} /></span>
                  <span className="font-mono font-bold bg-stone-100 px-1 rounded text-red-750"><MdText text={inhalt.texte.fCiFCk} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interaktiver Qualitätssicherungs- & Konformitäts-Simulator */}
      <section className="bg-white rounded-2xl border border-home-grau/30 shadow-md p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-home-grau/25 pb-4 gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-shiraz text-white rounded-lg text-xs font-mono font-bold">Labor-Konfigurator</span>
            <h3 className="text-lg font-bold text-text-main flex items-center gap-1.5 font-sans">
              <Sparkles className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.interaktiverSanierungsFestigkeitsprüferD} /></h3>
          </div>
          <span className="text-[10px] text-home-grau font-mono"><MdText text={inhalt.texte.standDinEn206} /></span>
        </div>

        {/* DIN EN 206 Examples Row (No manual input required) */}
        <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/20">
          <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <BookOpen className="text-shiraz w-4 h-4" /><MdText text={inhalt.texte.normativeFallbeispieleNachDin} /></span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Example 1 */}
            <button
              type="button"
              onClick={() => loadConcreteExample(1)}
              className="bg-white hover:bg-emerald-50/25 border border-emerald-300 hover:border-emerald-500 p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between shadow-3xs"
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-emerald-800"><MdText text={inhalt.texte.szenario1ErstanlaufC25} /></span>
                  <span className="bg-emerald-100 text-emerald-850 text-[9px] font-bold px-1.5 py-0.5 rounded font-sans">KONFORM</span>
                </div>
                <p className="text-[10px] text-text-main/70 leading-normal"><MdText text={inhalt.texte.eignungsprüfungAnfangsproduktion} /><span className="font-mono font-bold">n = 3</span><MdText text={inhalt.texte.fürDeckenbetonAlleEinzelwerte} /></p>
              </div>
              <div className="mt-2 text-[9.5px] font-mono font-bold text-slate-600 bg-stone-100/80 p-1 rounded"><MdText text={inhalt.texte.messwerte34835} /></div>
            </button>

            {/* Example 2 */}
            <button
              type="button"
              onClick={() => loadConcreteExample(2)}
              className="bg-white hover:bg-emerald-50/25 border border-emerald-300 hover:border-emerald-500 p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between shadow-3xs"
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-emerald-800"><MdText text={inhalt.texte.szenario2StatischeKontrolle} /></span>
                  <span className="bg-emerald-100 text-emerald-850 text-[9px] font-bold px-1.5 py-0.5 rounded font-sans">KONFORM</span>
                </div>
                <p className="text-[10px] text-text-main/70 leading-normal"><MdText text={inhalt.texte.stetigesProduktionskontrollverfahren} /><span className="font-mono font-bold">n = 15</span><MdText text={inhalt.texte.würfelDieStandardabweichungBeträgt} /></p>
              </div>
              <div className="mt-2 text-[9.5px] font-mono font-bold text-slate-600 bg-stone-100/80 p-1 rounded truncate"><MdText text={inhalt.texte.n15Mittel41} /></div>
            </button>

            {/* Example 3 */}
            <button
              type="button"
              onClick={() => loadConcreteExample(3)}
              className="bg-white hover:bg-rose-50/25 border border-rose-300 hover:border-rose-500 p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between shadow-3xs"
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-red-800"><MdText text={inhalt.texte.szenario3BaustellenZweifel} /></span>
                  <span className="bg-rose-100 text-rose-850 text-[9px] font-bold px-1.5 py-0.5 rounded font-sans">MANGELHAFT</span>
                </div>
                <p className="text-[10px] text-text-main/70 leading-normal"><MdText text={inhalt.texte.identitätsprüfungFürZylinder} /><span className="font-mono font-bold">n = 3</span><MdText text={inhalt.texte.einzelwerteLiegenÜberDem} /></p>
              </div>
              <div className="mt-2 text-[9.5px] font-mono font-bold text-red-800 bg-rose-50/50 p-1 rounded"><MdText text={inhalt.texte.messwerte31228} /></div>
            </button>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Controls and Inputs */}
          <div className="lg:col-span-5 space-y-6 bg-stone-50/70 p-5 rounded-2xl border border-home-grau/25">
            <div>
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest block border-b pb-1.5 border-home-grau/25 mb-4"><MdText text={inhalt.texte.t1SystemparameterNormprüfung} /></span>

              {/* Festigkeitsklasse */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-text-main block">Druckfestigkeitsklasse:</label>
                <select aria-label="Druckfestigkeitsklasse" 
                  value={selectedClassNav}
                  onChange={(e) => setSelectedClassNav(e.target.value)}
                  className="w-full bg-white border border-home-grau/30 rounded-lg p-2 font-mono font-bold text-slate-800"
                >
                  {CONCRETE_CLASSES.map(cls => (
                    <option key={cls.name} value={cls.name}>
                      {cls.name} (Zylinder: {formatDeWert(cls.fck_cyl)} / Würfel: {formatDeWert(cls.fck_cube)} N/mm²)
                    </option>
                  ))}
                </select>
              </div>

              {/* Prüfkörpertyp */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <span className="font-semibold text-text-main/80 block mb-1">Prüfkörper-Form:</span>
                  <AuswahlGruppe label="Prüfkörper-Form" className="flex rounded-lg border border-home-grau/35 overflow-hidden bg-white">
                    <button {...alsOption(specimenType === 'cube')}
                      type="button"
                      onClick={() => setSpecimenType('cube')}
                      className={`flex-1 py-1.5 text-center font-bold font-mono transition-all text-xs ${
                        specimenType === 'cube' ? 'bg-shiraz text-white' : 'text-slate-600'
                      }`}
                    ><MdText text={inhalt.texte.würfelFCkCube} /></button>
                    <button {...alsOption(specimenType === 'cylinder')}
                      type="button"
                      onClick={() => setSpecimenType('cylinder')}
                      className={`flex-1 py-1.5 text-center font-bold font-mono transition-all text-xs ${
                        specimenType === 'cylinder' ? 'bg-shiraz text-white' : 'text-slate-600'
                      }`}
                    ><MdText text={inhalt.texte.zylinderFCkCyl} /></button>
                  </AuswahlGruppe>
                </div>

                <div>
                  <span className="font-semibold text-text-main/80 block mb-1"><MdText text={inhalt.texte.charaktWertFCk} /></span>
                  <div className="bg-stone-100 border border-home-grau/30 rounded-lg p-1.5 text-center font-mono font-bold text-slate-800">
                    {formatDeWert(fck)} N/mm²
                  </div>
                </div>
              </div>

              {/* Prüfverfahren / Prüfverfahrensmodus */}
              <div className="space-y-1.5 mt-4 text-xs">
                <span className="font-bold text-text-main block"><MdText text={inhalt.texte.überwachungstypNachDinEn} /></span>
                <div className="grid grid-cols-1 gap-1 bg-white p-1 rounded-lg border border-home-grau/30">
                  <button
                    type="button"
                    onClick={() => { setTestMode('anfang'); }}
                    className={`p-2 rounded-md text-left text-[11px] font-bold transition-all flex justify-between items-center ${
                      testMode === 'anfang' ? 'bg-shiraz text-white' : 'text-slate-700 hover:bg-stone-50'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.anfangsproduktionN314} /></span>
                    <span className="font-mono text-[9px] opacity-80"><MdText text={inhalt.texte.fCmFCk3} /></span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => { setTestMode('stetig'); }}
                    className={`p-2 rounded-md text-left text-[11px] font-bold transition-all flex justify-between items-center ${
                      testMode === 'stetig' ? 'bg-shiraz text-white' : 'text-slate-700 hover:bg-stone-50'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.stetigeProduktionN152} /></span>
                    <span className="font-mono text-[9px] opacity-80"><MdText text={inhalt.texte.fCmFCk4} /></span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setTestMode('identitaet'); }}
                    className={`p-2 rounded-md text-left text-[11px] font-bold transition-all flex justify-between items-center ${
                      testMode === 'identitaet' ? 'bg-shiraz text-white' : 'text-slate-700 hover:bg-stone-50'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.identitätsprüfungKanalN1} /></span>
                    <span className="font-mono text-[9px] opacity-80"><MdText text={inhalt.texte.onSiteBaustelle} /></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Daten einspeisen */}
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest block border-b pb-1.5 border-home-grau/25"><MdText text={inhalt.texte.t2LabordatenEingeben} /></span>

              {/* Add single result */}
              <form onSubmit={handleAddValue} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-text-main"><MdText text={inhalt.texte.einzelwertFCiN} /></label>
                  <input
                    type="text"
                    placeholder="z. B. 34.2"
                    value={singleValueInput}
                    onChange={(e) => setSingleValueInput(e.target.value)}
                    className="w-full bg-white border border-home-grau/30 rounded-lg p-1.5 font-mono text-xs font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-shiraz hover:bg-shiraz-dark text-white rounded-lg p-1.5 px-3 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs border-0"
                >
                  <Plus size={14} /> Einfügen
                </button>
              </form>

              {/* Bulk-CSV import */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-main flex items-center gap-1"><MdText text={inhalt.texte.reiheEinpustenCsvKomma} /></label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={inhalt.werte.zB324}
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    className="flex-1 bg-white border border-home-grau/30 rounded-lg p-1.5 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleCsvImport}
                    className="bg-shiraz hover:bg-shiraz/90 text-white rounded-lg p-1.5 px-3 text-xs font-bold transition-colors cursor-pointer border-0 shrink-0"
                  >
                    Serie Laden
                  </button>
                </div>
              </div>

              {/* Fast presets */}
              <div className="space-y-1">
                <span className="text-[9.5px] font-bold text-slate-500 block uppercase tracking-wide"><MdText text={inhalt.texte.laborKurzkombinationenLadenSzenarioerklä} /></span>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => loadPreset(testMode === 'stetig' ? 'pass_stetig' : testMode === 'identitaet' ? 'pass_identitaet' : 'pass_anfang')}
                    className="bg-white border border-emerald-300 hover:border-emerald-500 text-emerald-800 text-[9.5px] rounded p-1 font-bold shadow-2xs"
                  ><MdText text={inhalt.texte.musterBestanden} /></button>
                  <button
                    type="button"
                    onClick={() => loadPreset(testMode === 'stetig' ? 'fail_stetig' : testMode === 'identitaet' ? 'fail_identitaet' : 'fail_mean_anfang')}
                    className="bg-white border border-orange-300 hover:border-orange-500 text-orange-850 text-[9.5px] rounded p-1 font-bold shadow-2xs"
                  ><MdText text={inhalt.texte.musterMittelwertFehler} /></button>
                  <button
                    type="button"
                    onClick={() => loadPreset('fail_single_anfang')}
                    className="bg-white border border-rose-300 hover:border-rose-500 text-rose-800 text-[9.5px] rounded p-1 font-bold shadow-2xs"
                  ><MdText text={inhalt.texte.musterAusreißerProblem} /></button>
                </div>
              </div>

              {/* Interactive Values list */}
              <div className="space-y-1.5 mt-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-text-main border-b border-home-grau/15 pb-1">
                  <span><MdText text={inhalt.texte.eingegebeneProbenN} />{testValues.length}):</span>
                  {testValues.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-red-750 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                    >
                      <RefreshCw size={10} /> Wischen
                    </button>
                  )}
                </div>

                {testValues.length === 0 ? (
                  <div className="text-center p-4 bg-white border border-dashed border-home-grau/25 rounded-xl text-xs text-home-grau font-semibold"><MdText text={inhalt.texte.keinePrüfkörperGelistetTragen} /></div>
                ) : (
                  <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1 bg-white rounded-lg border border-stone-200">
                    {testValues.map((val, idx) => (
                      <span 
                        key={idx}
                        className={`inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-xs font-mono font-bold border ${
                          val >= fck - 4 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-250' 
                            : 'bg-rose-50 text-rose-800 border-rose-250 animate-pulse'
                        }`}
                      >
                        {formatDeWert(val)}
                        <button
                          type="button"
                          onClick={() => handleDeleteValue(idx)}
                          className="w-3.5 h-3.5 rounded-full hover:bg-stone-200 flex items-center justify-center text-slate-500 hover:text-red-600 transition-colors cursor-pointer border-0 text-[10px] p-0"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Visualization and Results */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Conformity verdict banner */}
            {testValues.length === 0 ? (
              <div className="bg-[#f8fafc] border border-home-grau/35 rounded-2xl p-6 text-center text-sm font-semibold text-slate-600"><MdText text={inhalt.texte.gebenSieLinksFrischbetonprüfwerte} /></div>
            ) : (
              <div className="space-y-4">
                
                {/* Visual Status Result Card */}
                <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 justify-between items-start md:items-center shadow-xs ${
                  stats.isConform 
                    ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950' 
                    : 'bg-rose-50/50 border-rose-300 text-rose-950'
                }`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider block text-slate-500"><MdText text={inhalt.texte.sicherheitsbewertungNachDin1045} /></span>
                    <h4 className="text-xl font-bold flex items-center gap-1.5">
                      {stats.isConform ? (
                        <>
                          <CheckCircle2 className="text-emerald-600 shrink-0" size={22} /><MdText text={inhalt.texte.betonKonformBestanden} /></>
                      ) : (
                        <>
                          <AlertTriangle className="text-red-700 shrink-0" size={22} /><MdText text={inhalt.texte.betonNichtKonform} /></>
                      )}
                    </h4>
                    <p className="text-xs font-semibold leading-relaxed text-slate-700">
                      {stats.isConform 
                        ? `Die Probe-Ergebnisse weisen die geforderte Güte für ${selectedClass.name} auf. Der Beton ist statisch und bauseitig zugelassen.`
                        : inhalt.werte.gewährleistungsrisikoEinesOderMehrere}
                    </p>
                  </div>

                  <div className={`px-4 py-2 rounded-xl text-center border font-black uppercase tracking-wider scale-95 shrink-0 ${
                    stats.isConform ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-red-750 text-white border-red-700'
                  }`}>
                    {stats.isConform ? 'Zugelassen' : 'Gesperrt'}
                  </div>
                </div>

                {/* Alarm criteria list if fail */}
                {!stats.isConform && (
                  <div className="bg-rose-100/40 border border-rose-250 p-4 rounded-xl text-xs space-y-2">
                    <span className="font-bold text-red-800 block uppercase tracking-wide">Mängel-Aufschlüsselung:</span>
                    <ul className="space-y-1.5 list-none pl-0">
                      
                      {/* Check sample sizes */}
                      {testMode === 'anfang' && stats.n < 3 && (
                        <li className="flex gap-1.5 items-start font-semibold">
                          <X className="text-red-600 shrink-0 mt-0.5" size={14} />
                          <span><MdText text={inhalt.texte.probenzahlZuGeringFür} /><strong className="font-mono">{stats.n}</strong><MdText text={inhalt.texte.vonGeforderten3} /></span>
                        </li>
                      )}
                      
                      {testMode === 'stetig' && stats.n < 15 && (
                        <li className="flex gap-1.5 items-start font-semibold">
                          <X className="text-red-600 shrink-0 mt-0.5" size={14} />
                          <span><MdText text={inhalt.texte.probenzahlUngenügendFürStetigen} /><strong className="font-mono">{stats.n}</strong><MdText text={inhalt.texte.vonGeforderten15} /></span>
                        </li>
                      )}

                      {/* Check Mean criterion */}
                      {!stats.meanPassed && (
                        <li className="flex gap-1.5 items-start font-semibold text-rose-950">
                          <X className="text-red-600 shrink-0 mt-0.5" size={14} />
                          <span><MdText text={inhalt.texte.mittelwertkriteriumVerfehltDerGesamtmitt} /><strong className="font-mono">{formatDeWert(stats.mean)} N/mm²</strong><MdText text={inhalt.texte.liegtUnterDemNormativ} /><strong className="font-mono">{formatDeWert(stats.requiredMean)} N/mm²</strong><MdText text={inhalt.texte.fehlbetrag} />{formatDeZahl((stats.requiredMean - stats.mean), 2)} N/mm²).
                          </span>
                        </li>
                      )}

                      {/* Check Min individual criterion */}
                      {!stats.minPassed && (
                        <li className="flex gap-1.5 items-start font-semibold text-rose-950">
                          <X className="text-red-600 shrink-0 mt-0.5" size={14} />
                          <span><MdText text={inhalt.texte.einzelwertAusreißerGefundenMindestens} /><strong className="font-mono text-red-750">{formatDeWert(stats.minVal)} N/mm²</strong><MdText text={inhalt.texte.liegtUnterDerKritischen} /><strong className="font-mono">{formatDeWert(stats.requiredMin)} N/mm²</strong><MdText text={inhalt.texte.fCk4Das} /></span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Info and limit exceptions warnings */}
                {stats.limitMessage && (
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-lg text-[10.5px] leading-relaxed flex gap-2">
                    <Info className="text-amber-600 mt-0.5 shrink-0" size={14} />
                    <span>{stats.limitMessage}</span>
                  </div>
                )}

                {/* Tabular analysis data */}
                <div className="bg-white border border-home-grau/35 rounded-xl p-4 shadow-2xs space-y-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block"><MdText text={inhalt.texte.statistischeKennwerteDerSerie} /></span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    
                    <div className="bg-stone-50 border p-2.5 rounded-lg border-stone-200">
                      <span className="text-slate-500 text-[9px] uppercase font-bold block"><MdText text={inhalt.texte.probenzahlN} /></span>
                      <span className="text-lg font-mono font-black text-slate-800 mt-0.5 block">{stats.n}</span>
                      <span className="text-[9px] text-slate-400">Prüfkörper</span>
                    </div>

                    <div className="bg-stone-50 border p-2.5 rounded-lg border-stone-200">
                      <span className="text-slate-500 text-[9px] uppercase font-bold block"><MdText text={inhalt.texte.mittelwertFCm} /></span>
                      <span className={`text-lg font-mono font-black mt-0.5 block ${stats.meanPassed ? 'text-emerald-700' : 'text-red-700'}`}>{formatDeWert(stats.mean)}</span>
                      <span className="text-[9px] text-slate-500">Soll: &ge;<strong>{formatDeWert(stats.requiredMean)}</strong> N/mm²</span>
                    </div>

                    <div className="bg-stone-50 border p-2.5 rounded-lg border-stone-200">
                      <span className="text-slate-500 text-[9px] uppercase font-bold block"><MdText text={inhalt.texte.standardabweichungS} /></span>
                      <span className="text-lg font-mono font-black text-slate-800 mt-0.5 block">
                        {testValues.length > 1 ? stats.stdDev : '—'}
                      </span>
                      {testMode === 'stetig' ? (
                        <span className="text-[9px] text-slate-500">Angewandt: <strong>{formatDeWert(stats.stdDevUsed)}</strong> (mind. 3,0)</span>
                      ) : (
                        <span className="text-[9px] text-slate-400"><MdText text={inhalt.texte.inaktivBeiN15} /></span>
                      )}
                    </div>

                    <div className="bg-stone-50 border p-2.5 rounded-lg border-stone-200">
                      <span className="text-slate-500 text-[9px] uppercase font-bold block"><MdText text={inhalt.texte.minEinzelwert} /></span>
                      <span className={`text-lg font-mono font-black mt-0.5 block ${stats.minPassed ? 'text-slate-850' : 'text-red-700 animate-pulse'}`}>{formatDeWert(stats.minVal)}</span>
                      <span className="text-[9px] text-slate-500">Grenz: &ge;<strong>{formatDeWert(stats.requiredMin)}</strong> N/mm²</span>
                    </div>

                  </div>
                </div>

                {/* Interactive SVG Compression Graph */}
                <div className="bg-white border border-home-grau/35 rounded-xl p-4 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block"><MdText text={inhalt.texte.festigkeitsentwicklungGrenzwertSchnitt} /></span>
                    <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded font-mono font-semibold"><MdText text={inhalt.texte.einheitNMm} /></span>
                  </div>

                  <div className="w-full relative overflow-x-auto">
                    <svg 
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                      className="w-full min-w-[500px] h-auto text-slate-800"
                    >
                      {/* background grids */}
                      <rect x={paddingX} y={paddingY} width={chartWidth - 2 * paddingX} height={chartHeight - 2 * paddingY} fill="#f8fafc" />
                      
                      {/* lines for Y grid */}
                      {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
                        const val = chartYMin + ratio * (chartYMax - chartYMin);
                        const coord = getSvgCoordinates(0, val);
                        return (
                          <g key={i}>
                            <line 
                              x1={paddingX} 
                              y1={coord.y} 
                              x2={chartWidth - paddingX} 
                              y2={coord.y} 
                              stroke="#64748b" 
                              strokeWidth="0.5" 
                              strokeDasharray="2,3" 
                              opacity="0.25" 
                            />
                            <text 
                              x={paddingX - 8} 
                              y={coord.y + 3} 
                              textAnchor="end" 
                              className="font-mono text-[9px] text-[#1e293b] font-semibold"
                            >
                              {formatDeWert(Math.round(val))}
                            </text>
                          </g>
                        );
                      })}

                      {/* Shaded Red Warn-Zone below fck-4 */}
                      {(() => {
                        const limitY = getSvgCoordinates(0, stats.requiredMin).y;
                        const baselineY = getSvgCoordinates(0, chartYMin).y;
                        if (limitY < baselineY) {
                          return (
                            <rect 
                              x={paddingX} 
                              y={limitY} 
                              width={chartWidth - 2 * paddingX} 
                              height={baselineY - limitY} 
                              fill="rgba(225, 29, 72, 0.05)" 
                            />
                          );
                        }
                        return null;
                      })()}

                      {/* Guideline: Characteristic Value f_ck */}
                      {(() => {
                        const coord = getSvgCoordinates(0, fck);
                        return (
                          <g>
                            <line 
                              x1={paddingX} 
                              y1={coord.y} 
                              x2={chartWidth - paddingX} 
                              y2={coord.y} 
                              stroke="#334155" 
                              strokeWidth="1.5" 
                              strokeDasharray="4,4" 
                              opacity="0.8" 
                            />
                            <text 
                              x={chartWidth - paddingX + 5} 
                              y={coord.y + 3} 
                              className="font-mono text-[8.5px] text-emerald-800 font-bold"
                            >
                              f_ck ({formatDeWert(fck)})
                            </text>
                          </g>
                        );
                      })()}

                      {/* Guideline: Required individual min f_ck - 4 (Red danger line) */}
                      {(() => {
                        const coord = getSvgCoordinates(0, stats.requiredMin);
                        return (
                          <g>
                            <line 
                              x1={paddingX} 
                              y1={coord.y} 
                              x2={chartWidth - paddingX} 
                              y2={coord.y} 
                              stroke="#A3113E" 
                              strokeWidth="1.5" 
                              opacity="0.9" 
                            />
                            <text 
                              x={chartWidth - paddingX + 5} 
                              y={coord.y + 3} 
                              className="font-mono text-[8.5px] text-red-800 font-bold"
                            >
                              f_ck - 4 ({formatDeWert(stats.requiredMin)})
                            </text>
                          </g>
                        );
                      })()}

                      {/* Guideline: Required Mean f_cm,req */}
                      {testValues.length > 0 && (() => {
                        const coord = getSvgCoordinates(0, stats.requiredMean);
                        return (
                          <g>
                            <line 
                              x1={paddingX} 
                              y1={coord.y} 
                              x2={chartWidth - paddingX} 
                              y2={coord.y} 
                              stroke="#475569" 
                              strokeWidth="1" 
                              strokeDasharray="2,2" 
                              opacity="0.7" 
                            />
                            <text 
                              x={paddingX + 5} 
                              y={coord.y - 4} 
                              className="font-mono text-[8px] text-amber-700 font-bold"
                            >
                              Soll-Mittelwert ({formatDeWert(stats.requiredMean)})
                            </text>
                          </g>
                        );
                      })()}

                      {/* Guideline: Calculated Mean f_cm */}
                      {testValues.length > 0 && (() => {
                        const coord = getSvgCoordinates(0, stats.mean);
                        return (
                          <g>
                            <line 
                              x1={paddingX} 
                              y1={coord.y} 
                              x2={chartWidth - paddingX} 
                              y2={coord.y} 
                              stroke="#334155" 
                              strokeWidth="1.5" 
                              opacity="0.85" 
                            />
                            <text 
                              x={paddingX + 15} 
                              y={coord.y + 9} 
                              className="font-mono text-[8px] text-blue-800 font-bold bg-white-fade px-0.5"
                            >
                              Ist-Mittelwert f_cm ({formatDeWert(stats.mean)})
                            </text>
                          </g>
                        );
                      })()}

                      {/* Connective Line between nodes */}
                      {testValues.length > 1 && (() => {
                        const pathPoints = testValues.map((val, idx) => {
                          const { x, y } = getSvgCoordinates(idx, val);
                          return `${x},${y}`;
                        }).join(' ');
                        return (
                          <polyline 
                            fill="none" 
                            stroke="#cbd5e1" 
                            strokeWidth="1.5" 
                            points={pathPoints} 
                          />
                        );
                      })()}

                      {/* Nodes mapping the individual values */}
                      {testValues.map((val, idx) => {
                        const { x, y } = getSvgCoordinates(idx, val);
                        const isPass = val >= stats.requiredMin;
                        return (
                          <g key={idx} className="cursor-pointer group">
                            {/* vertical dashed drop line */}
                            <line 
                              x1={x} 
                              y1={y} 
                              x2={x} 
                              y2={chartHeight - paddingY} 
                              stroke="#94a3b8" 
                              strokeWidth="0.5" 
                              strokeDasharray="2,2" 
                            />
                            {/* Outer glowing halo on fail */}
                            {!isPass && (
                              <circle 
                                cx={x} 
                                cy={y} 
                                r="8" 
                                fill="rgba(225, 29, 72, 0.2)" 
                                className="animate-ping" 
                              />
                            )}
                            <circle 
                              cx={x} 
                              y={y} 
                              r="4" 
                              fill={isPass ? '#475569' : '#A3113E'} 
                              stroke="#ffffff" 
                              strokeWidth="1" 
                            />
                            <text 
                              x={x} 
                              y={y - 7} 
                              textAnchor="middle" 
                              className="font-mono text-[9px] font-black text-slate-700"
                            >
                              {formatDeWert(val)}
                            </text>
                            
                            {/* tick index on bottom X-axis */}
                            <text 
                              x={x} 
                              y={chartHeight - paddingY + 12} 
                              textAnchor="middle" 
                              className="font-mono text-[8.5px] text-[#0f172a] font-bold"
                            >
                              #{idx + 1}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Printable Lab Protocol Certificate Mockup */}
                <div className="bg-stone-50 border border-home-grau/25 rounded-2xl p-5 space-y-4 print:border-none print:shadow-none print:p-0" id="concrete-lab-protocol">
                  <div className="flex justify-between items-center border-b border-home-grau/25 pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={16} className="text-shiraz" /><MdText text={inhalt.texte.normPrüfprotokollGeneratorDin} /></span>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="bg-white hover:bg-stone-100 border border-home-grau/25 text-slate-700 rounded-lg py-1 px-2.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer size={12} /><MdText text={inhalt.texte.berichtDrucken} /></button>
                  </div>

                  {/* Input Metadata fields (Interactive) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] bg-white p-3.5 rounded-xl border border-home-grau/15">
                    <div className="space-y-1">
                      <span className="block text-home-grau font-semibold"><MdText text={inhalt.texte.bauvorhabenBauwerksabschnitt} /></span>
                      <input aria-label={inhalt.werte.bauvorhabenBauwerksabschnitt} 
                        type="text" 
                        value={protocolMeta.project}
                        onChange={(e) => setProtocolMeta({ ...protocolMeta, project: e.target.value })}
                        className="w-full bg-stone-50/70 border border-stone-200 rounded p-1 font-semibold text-slate-800" 
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-home-grau font-semibold"><MdText text={inhalt.texte.ausführendeUnternehmungBauleitung} /></span>
                      <input aria-label={inhalt.werte.ausführendeUnternehmungBauleitung} 
                        type="text" 
                        value={protocolMeta.contractor}
                        onChange={(e) => setProtocolMeta({ ...protocolMeta, contractor: e.target.value })}
                        className="w-full bg-stone-50/70 border border-stone-200 rounded p-1 font-semibold text-slate-800" 
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-home-grau font-semibold"><MdText text={inhalt.texte.konformitätsbeauftragterPrüfer} /></span>
                      <input aria-label={inhalt.werte.konformitätsbeauftragterPrüfer} 
                        type="text" 
                        value={protocolMeta.inspector}
                        onChange={(e) => setProtocolMeta({ ...protocolMeta, inspector: e.target.value })}
                        className="w-full bg-stone-50/70 border border-stone-200 rounded p-1 font-semibold text-slate-800" 
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-home-grau font-semibold"><MdText text={inhalt.texte.prüfdatumFestigkeitsAbnahme} /></span>
                      <input aria-label={inhalt.werte.prüfdatumFestigkeitsAbnahme} 
                        type="date" 
                        value={protocolMeta.date}
                        onChange={(e) => setProtocolMeta({ ...protocolMeta, date: e.target.value })}
                        className="w-full bg-stone-50/70 border border-stone-200 rounded p-1 font-semibold text-slate-800" 
                      />
                    </div>
                  </div>

                  <div className="text-[10px] leading-relaxed text-slate-500 italic bg-white p-3 rounded-xl border border-stone-150">
                    <p><MdText text={inhalt.texte.fremdüberwachungsHinweisDiesesPrüfprotok} /><strong>{selectedClass.name}</strong> ({specimenType === 'cube' ? 'Würfelprüfung' : 'Zylinderprüfung'}<MdText text={inhalt.texte.beiPrüfklasseÜk2Oder} /></p>
                  </div>
                </div>

              </div>
            )}
            
          </div>
        </div>
      </section>

    </div>
  );
}
