import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Play, RotateCcw, ShieldCheck, Check, Download, FileText, Target, Crosshair, AlertTriangle } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { LabProtocolRecord, exportToCSV, generateIntegrityChecksum } from '@/src/utils/labExportUtils';
import { saveStoredLabProtocol } from '@/src/utils/studyStorage';
import { rueckprallLehrkurve, rueckprallRichtungskorrektur, rueckprallMesssatz } from '@/src/calc/bauwerksuntersuchung';

type ImpactAngle = 'horizontal' | 'downward' | 'upward';
type ConcreteAge = '28d' | '1year' | 'bestand_alt';

export default function SchmidtHammerSimulator() {
  const [targetClass, setTargetClass] = useState<'C20/25' | 'C25/30' | 'C30/37' | 'C35/45' | 'C50/60'>('C30/37');
  const [impactAngle, setImpactAngle] = useState<ImpactAngle>('horizontal');
  const [isCarbonated, setIsCarbonated] = useState<boolean>(false);
  const [concreteAge, setConcreteAge] = useState<ConcreteAge>('28d');

  // 9 Grid measurement values (null = not tested yet)
  const [measurements, setMeasurements] = useState<(number | null)[]>(Array(9).fill(null));
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [isStriking, setIsStriking] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Erwarteter Rückprallwert je Klasse (Runde 5): so gewählt, dass die einheitliche Lehrkurve 0,0125·R^2,22 etwa die mittlere
  // Würfeldruckfestigkeit f_ck,cube + 8 N/mm² ergibt (C30/37: R = 40 → 45 N/mm²); vorher auf die Labor-Kurve 0,027·R^1,85 abgestimmt
  const baseR = useMemo(() => {
    switch (targetClass) {
      case 'C20/25': return 35;
      case 'C25/30': return 37;
      case 'C30/37': return 40;
      case 'C35/45': return 43;
      case 'C50/60': return 48;
    }
  }, [targetClass]);

  // Schlagwinkel α (Proceq-Konvention): nach oben +90° (R zu hoch → Abzug), nach unten −90° (R zu niedrig → Zuschlag).
  // Korrektur ΔR(R, α) zentral nach Herstellerformel Original Schmidt Typ N (src/calc/bauwerksuntersuchung.ts, Entscheidung 27.10.)
  const alpha = impactAngle === 'horizontal' ? 0 : impactAngle === 'upward' ? 90 : -90;
  // Abgelesener Rohwert, dessen Korrektur den Klassenwert baseR ergibt: R_roh + ΔR(R_roh) = baseR (Fixpunkt, 3 Schritte)
  const rohBasisR = useMemo(() => {
    let r = baseR;
    for (let k = 0; k < 3; k++) r = baseR - rueckprallRichtungskorrektur(r, alpha);
    return r;
  }, [baseR, alpha]);

  // Carbonation increase (hard outer skin)
  const carbDeltaR = isCarbonated ? 4.5 : 0;

  // Simulate striking point i
  const strikePoint = (idx: number) => {
    if (measurements[idx] !== null || isStriking) return;

    setActivePointIndex(idx);
    setIsStriking(true);

    setTimeout(() => {
      // Add natural variability (+/- 2.5) and potential aggregate/void anomaly
      const randomNoise = (Math.random() - 0.5) * 4.8;
      // 8 % Wahrscheinlichkeit für einen Treffer auf Pore (Ausreißer nach unten) oder großes Korn (nach oben) – hitting an air pore (outlier down) or hard aggregate grain (outlier up)
      const anomaly = Math.random() < 0.08 ? (Math.random() > 0.5 ? 9 : -10) : 0;

      const rawR = Math.round(rohBasisR + carbDeltaR + randomNoise + anomaly);
      const boundedR = Math.max(15, Math.min(85, rawR));

      setMeasurements(prev => {
        const next = [...prev];
        next[idx] = boundedR;
        return next;
      });

      setIsStriking(false);
    }, 400);
  };

  // Run full automatic 9-point series
  const runFullSeries = () => {
    setMeasurements(Array(9).fill(null));
    let i = 0;
    const interval = setInterval(() => {
      if (i < 9) {
        strikePoint(i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 450);
  };

  const handleReset = () => {
    setMeasurements(Array(9).fill(null));
    setActivePointIndex(null);
    setIsStriking(false);
    setSavedSuccess(false);
  };

  // Statistical evaluation of current valid measurements
  const stats = useMemo(() => {
    const valid = measurements.filter((m): m is number => m !== null);
    if (valid.length === 0) {
      return { count: 0, median: 0, mean: 0, stdDev: 0, correctedR: 0, estFck: 0, outliers: [] as number[], seriesInvalid: false };
    }

    // DIN EN 12504-2: Kennwert ist der Median. Weichen mehr als 20 % der Einzelwerte um mehr als 6 Einheiten
    // vom Median ab, ist der ganze Messsatz zu verwerfen; Einzelwerte werden nicht gestrichen (zentraler Kern, Umsetzung 29.10.)
    const satz = rueckprallMesssatz(valid);
    const median = satz.median;
    const outliers = satz.abweichend;
    const seriesInvalid = satz.verworfen;

    const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
    const variance = valid.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (valid.length > 1 ? valid.length - 1 : 1);
    const stdDev = Math.sqrt(variance);

    // Winkelkorrektur auf horizontale Schlagrichtung, angewendet auf den Median
    let correctedR = median + rueckprallRichtungskorrektur(median, alpha);
    if (isCarbonated) {
      correctedR = correctedR * 0.85; // Lehrannahme – in der Praxis Kalibrierung an Vergleichsbohrkernen (DIN EN 13791)
    }

    // Festigkeitsschätzung: einheitliche Lehrkurve aus src/calc/bauwerksuntersuchung.ts (0,0125·R^2,22, keine Normkurve; Runde 5)
    const estFck = rueckprallLehrkurve(correctedR);

    return {
      count: valid.length,
      median,
      mean,
      stdDev,
      correctedR,
      estFck,
      outliers,
      seriesInvalid
    };
  }, [measurements, alpha, isCarbonated]);

  const handleArchive = () => {
    if (stats.count < 9) return;

    const newRecord: LabProtocolRecord = {
      id: `PROTO-SCHMIDT-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }),
      testTitle: `Zerstörungsfreie Härteprüfung (Schmidt-Rückprallhammer Typ N) an ${targetClass}`,
      norm: 'DIN EN 12504-2 / DIN EN 13791',
      operator: 'ZfP-Prüfung (Lehrsimulation)',
      specimen: {
        material: `Betonbauteil (${targetClass})`,
        geometry: 'Prüfbereich 300 × 300 mm (9-Punkte-Raster)',
        dimensions: 'Messpunktabstand ≥ 25 mm (DIN EN 12504-2)',
        conditioning: isCarbonated ? 'Karbonatisiert (dk > 5 mm)' : 'Unkarbonatisiert (dk = 0 mm)'
      },
      parameters: {
        'Gerätetyp': 'Schmidt-Rückprallhammer Typ N (Schlagenergie W = 2,207 Nm)',
        'Stoßrichtung': impactAngle === 'horizontal' ? 'Horizontal (0°)' : impactAngle === 'downward' ? 'Vertikal nach unten (-90°)' : 'Vertikal nach oben (+90°)',
        'Messpunkte': '9 Punkte im Quadratraster',
        'Karbonatisierungszustand': isCarbonated ? 'Ja (Lehrannahme: Faktor 0,85 angewandt)' : 'Nein'
      },
      metrics: {
        'Messwert-Median': formatDeZahl(stats.median, 1),
        'Mittelwert R': formatDeZahl(stats.mean, 1),
        'Standardabweichung s': formatDeZahl(stats.stdDev, 2),
        'Korrigierter Rückprallwert R_korr (aus Median)': formatDeZahl(stats.correctedR, 1),
        'Schätzwert Druckfestigkeit, Lehr-Näherung (MPa)': formatDeZahl(stats.estFck, 1),
        'Werte mit > 6 Einheiten Abweichung vom Median': formatDeWert(stats.outliers.length)
      },
      status: stats.seriesInvalid ? 'Ungültig' : 'Plausibel',
      validationNotes: [
        stats.seriesInvalid
          ? 'Mehr als 20 % der Einzelwerte weichen um mehr als 6 Einheiten vom Median ab: Messsatz nach DIN EN 12504-2 verwerfen und wiederholen (Schwelle vorläufig, am Normtext zu bestätigen).'
          : 'Messreihe mit 9 Schlägen; Verwerfungskriterium nach DIN EN 12504-2 nicht erfüllt, Median ist gültiger Kennwert.',
        `Schätzwert ${formatDeZahl(stats.estFck, 1)} MPa aus einer Lehr-Näherung – eine Festigkeitsaussage erfordert die Kalibrierung an Bohrkernen nach DIN EN 13791.`
      ],
      integrityHash: generateIntegrityChecksum(`schmidt|${targetClass}|${impactAngle}|${isCarbonated}|${measurements.join(',')}|${Date.now()}`),
      dataPointsCount: stats.count
    };

    saveStoredLabProtocol(newRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Parameter Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                <Target size={18} className="text-shiraz" /> 1. Prüfungs-Setup
              </h3>
              <span className="text-[11px] font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full">
                DIN EN 12504-2
              </span>
            </div>

            {/* Target Concrete Class */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider">Erwartete Festigkeitsklasse</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['C20/25', 'C25/30', 'C30/37', 'C35/45', 'C50/60'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => { setTargetClass(c); handleReset(); }}
                    className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
                      targetClass === c
                        ? 'bg-shiraz text-white border-shiraz shadow-xs'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Impact Angle Selection */}
            <div className="space-y-2 pt-2 border-t border-home-grau/20">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider">Stoßrichtung (Winkelkorrektur)</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'horizontal', label: 'Horizontal (0°)', sub: 'Wand / Stütze (Standard ΔR = 0)' },
                  { id: 'downward', label: 'Vertikal nach unten (-90°)', sub: 'Deckenoberseite / Bodenplatte (ΔR ≈ +3,0)' },
                  { id: 'upward', label: 'Vertikal nach oben (+90°)', sub: 'Deckenuntersicht (ΔR ≈ −3,5)' }
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setImpactAngle(a.id as ImpactAngle); handleReset(); }}
                    className={`p-2.5 text-xs rounded-xl border transition-all cursor-pointer flex flex-col text-left ${
                      impactAngle === a.id
                        ? 'bg-shiraz/10 border-shiraz text-shiraz font-bold shadow-xs'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100'
                    }`}
                  >
                    <span>{a.label}</span>
                    <span className="text-[10px] font-normal opacity-75">{a.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Carbonation Factor Toggle */}
            <div className="space-y-2 pt-2 border-t border-home-grau/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-main uppercase tracking-wider">Karbonatisierung (dk &gt; 5 mm)</label>
                <input
                  type="checkbox"
                  checked={isCarbonated}
                  onChange={e => { setIsCarbonated(e.target.checked); handleReset(); }}
                  className="w-4 h-4 accent-shiraz cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-text-main/70 bg-off-white p-2.5 rounded-lg border border-home-grau/20">
                Karbonatisierter Beton bildet harte Calcit-Krusten (<InlineMath math="\text{CaCO}_3" />), wodurch der Rückprallwert scheinbar steigt (hier simuliert: +4,5 Skalenteile). Die Simulation verwendet als Lehrannahme den Faktor 0,85; in der Praxis wird der Einfluss über Vergleichsbohrkerne nach DIN EN 13791 kalibriert.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-home-grau/20">
              <button
                onClick={runFullSeries}
                disabled={isStriking || stats.count === 9}
                className="flex-1 py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play size={14} /> Automatische 9er-Reihe
              </button>
              <button
                onClick={handleReset}
                disabled={stats.count === 0}
                aria-label="Messreihe zurücksetzen"
                title="Messreihe zurücksetzen"
                className="py-3 px-3 bg-off-white hover:bg-slate-200 text-text-main border border-home-grau/30 rounded-xl font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right 3x3 Grid & Schmidt Hammer Graphics (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
            
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-home-grau/20 gap-3">
              <div>
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <Crosshair size={18} className="text-shiraz" /> 2. Beton-Prüffeld (3×3 Messpunktraster nach DIN EN 12504-2)
                </h3>
                <p className="text-xs text-text-main/70">
                  Klicken Sie direkt auf die 9 Messpunkte, um den Schmidt-Hammer manuell auszulösen.
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                stats.count === 0 ? 'bg-slate-100 text-slate-700' :
                stats.count < 9 ? 'bg-amber-100 text-amber-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {stats.count === 0 ? 'Bereit für Messung' : stats.count < 9 ? `${stats.count} / 9 Punkte gemessen` : 'Messreihe vollständig'}
              </span>
            </div>

            {/* Interactive Grid & Device Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-4 flex-1">
              
              {/* 3x3 Concrete Wall Grid (6 cols) */}
              <div className="md:col-span-6 bg-stone-300 p-5 rounded-2xl border-2 border-stone-400 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                {/* Concrete Texture overlay */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px]"></div>

                <div className="relative z-10 w-full max-w-[280px] aspect-square grid grid-cols-3 gap-3 p-3 bg-stone-200/90 rounded-xl border border-stone-400 shadow-md">
                  {measurements.map((val, idx) => {
                    const isTested = val !== null;
                    const isOutlier = val !== null && stats.outliers.includes(val);

                    return (
                      <button
                        key={idx}
                        onClick={() => strikePoint(idx)}
                        disabled={isTested || isStriking}
                        className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold transition-all relative cursor-pointer ${
                          !isTested
                            ? 'bg-stone-100/90 hover:bg-amber-100 border-stone-400 text-stone-500 hover:scale-105 shadow-sm'
                            : isOutlier
                            ? 'bg-red-100 border-red-500 text-red-700 shadow-md'
                            : 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-md'
                        }`}
                      >
                        <span className="text-[10px] text-stone-400 absolute top-1 left-1.5">#{idx + 1}</span>
                        {isTested ? (
                          <>
                            <span className="text-lg">{formatDeWert(val)}</span>
                            <span className="text-[9px] uppercase font-sans">
                              {isOutlier ? 'Ausreißer' : 'R-Wert'}
                            </span>
                          </>
                        ) : (
                          <Crosshair size={18} className="text-stone-400 group-hover:text-shiraz" />
                        )}

                        {activePointIndex === idx && isStriking && (
                          <div className="absolute inset-0 rounded-xl border-4 border-amber-500 animate-ping"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 text-[11px] text-stone-700 font-bold z-10">
                  Prüffeldabmessung: 300 × 300 mm (Punktabstand 50 mm)
                </div>
              </div>

              {/* Schmidt Hammer Instrument Terminal (6 cols) */}
              <div className="md:col-span-6 flex flex-col justify-between">
                
                {/* Instrument Drawing Banner */}
                <div className="bg-off-white text-text-main p-4 rounded-xl border border-home-grau/30 shadow-inner flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest">
                      Schmidt-Rückprallhammer Typ N
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">W = 2,207 Nm</span>
                  </div>

                  {/* Hammer Scale Graphic */}
                  <div className="w-full bg-white rounded-lg p-2.5 border border-home-grau/30 flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-600">
                      <span>R=10</span>
                      <span>20</span>
                      <span>30</span>
                      <span>40</span>
                      <span>50</span>
                      <span>60</span>
                      <span>R=70</span>
                    </div>
                    {/* Scale bar with indicator */}
                    <div className="w-full h-3 bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 rounded-full relative overflow-hidden shadow-inner">
                      {stats.mean > 0 && (
                        <div
                          className="absolute top-0 bottom-0 w-1.5 bg-white border border-black shadow-md transition-all duration-300"
                          style={{ left: `${Math.max(0, Math.min(100, ((stats.mean - 10) / 60) * 100))}%` }}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live Statistics Cards */}
                <div className="grid grid-cols-2 gap-2 my-2 text-xs">
                  <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-text-main/60 block text-[10px] uppercase font-bold">Median R</span>
                    <strong className="text-base text-text-main font-mono">{formatDeZahl(stats.median, 1)}</strong>
                  </div>
                  <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-text-main/60 block text-[10px] uppercase font-bold">Mittelwert R</span>
                    <strong className="text-base text-shiraz font-mono">{formatDeZahl(stats.mean, 1)}</strong>
                  </div>
                  <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-text-main/60 block text-[10px] uppercase font-bold">Streuung s</span>
                    <strong className="text-base text-text-main font-mono">{formatDeZahl(stats.stdDev, 2)}</strong>
                  </div>
                  <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-text-main/60 block text-[10px] uppercase font-bold">Korrigierter Rkorr</span>
                    <strong className="text-base text-emerald-700 font-mono">{formatDeZahl(stats.correctedR, 1)}</strong>
                  </div>
                </div>

                {/* In-situ Strength Result Banner */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-900 block">Schätzwert Druckfestigkeit (Lehr-Näherung)</span>
                    <span className="text-xl font-bold font-mono text-emerald-800">
                      {stats.count >= 9 ? `${formatDeZahl(stats.estFck, 1)} MPa` : '— (9 Punkte nötig)'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-200/80 px-2.5 py-1 rounded-lg">
                    {stats.count >= 9 ? `Entspricht ${targetClass}` : 'Ausstehend'}
                  </span>
                </div>
              </div>
            </div>

            {/* Outliers warning */}
            {stats.outliers.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-amber-700 shrink-0" />
                <span>
                  <strong>{formatDeWert(stats.outliers.length)} Einzelwert(e)</strong> weichen um mehr als 6 Einheiten vom Median ab. Nach DIN EN 12504-2 ist der Messsatz zu verwerfen, wenn das mehr als 20 % der Werte betrifft (Schwelle vorläufig){stats.seriesInvalid ? ' – hier der Fall: Messreihe wiederholen.' : ' – hier nicht der Fall; der Median bleibt gültig.'}
                </span>
              </div>
            )}

            {/* Protocol Archive Toolbar */}
            {stats.count === 9 && (
              <div className="mt-2 p-4 bg-off-white rounded-xl border border-home-grau/30 flex flex-wrap items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs text-text-main">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Messreihe nach DIN EN 12504-2 vollständig validiert.</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleArchive}
                    disabled={savedSuccess}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      savedSuccess
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-shiraz hover:bg-shiraz/90 text-white shadow-sm'
                    }`}
                  >
                    {savedSuccess ? (
                      <>
                        <Check size={14} /> Im Protokoll archiviert!
                      </>
                    ) : (
                      <>
                        <FileText size={14} /> Messreihe archivieren
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      const rows = measurements.map((m, idx) => [`Punkt_${idx + 1}`, `${m}`]);
                      exportToCSV(`Schmidt_${targetClass}`, ['Messpunkt', 'R_Wert'], rows);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-text-main text-xs font-bold rounded-xl border border-home-grau/30 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} /> CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
