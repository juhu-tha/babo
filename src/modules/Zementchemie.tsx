import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Box, BookOpen, Calculator, Sparkles, Layers, Microscope, Clock, Play, RotateCcw, Activity } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

ChartJS.register(LinearScale, ArcElement, Tooltip, Legend);

function GefuegebildungSimulator() {
  const [timeStageIndex, setTimeStageIndex] = useState(3); // 0..5
  const [wzRatio, setWzRatio] = useState(0.50);
  const [cementType, setCementType] = useState<'CEM_I' | 'CEM_III'>('CEM_I');
  const [isPlaying, setIsPlaying] = useState(false);

  const stages = [
    {
      id: '0min',
      timeLabel: '0 Minuten (Frisch gemischt)',
      hours: 0,
      phaseTitle: 'Phase 1: Initial- und Lösungsphase',
      alpha: 2,
      strengthMPa: 0,
      porosityPercent: 62,
      heatJg: 25,
      desc: 'Zementkörner (Alit C₃S, Belit C₂S, Aluminat C₃A) werden mit Anmachwasser benetzt. Schnelle Freisetzung von Ca²⁺- und OH⁻-Ionen in die Porenlösung. An der Klinkeroberfläche bildet sich ein erster dünner Belag aus Ettringitkristallen durch Reaktion von C₃A mit Calciumsulfat (Gips).'
    },
    {
      id: '2h',
      timeLabel: '2 Stunden (Ruhephase / Induktion)',
      hours: 2,
      phaseTitle: 'Phase 2: Induktionsperiode (Dormant Period)',
      alpha: 6,
      strengthMPa: 0,
      porosityPercent: 58,
      heatJg: 55,
      desc: 'Niedrige chemische Reaktionsgeschwindigkeit. Die Hydratationsreaktion verharrt temporär, da sich eine quasi-passivierende Schicht gebildet hat. Der Frischbeton bleibt verarbeitbar, pumpfähig und verdichtungswillig (Offenzeit).'
    },
    {
      id: '10h',
      timeLabel: '10 Stunden (Erstarrungsbeginn & -ende)',
      hours: 10,
      phaseTitle: 'Phase 3: Beschleunigungsperiode',
      alpha: 22,
      strengthMPa: 4.5,
      porosityPercent: 44,
      heatJg: 160,
      desc: 'Kritische Übersättigung der Porenlösung erreicht. Massives Auskristallisieren von faserigem Calciumsilicathydrat-Gel (C-S-H) auf der Klinkeroberfläche. Sechseckige Portlandit-Tafeln (CH, Ca(OH)₂) wachsen im Porenraum. Der Zementleim verliert seine Plastizität und erstarrt.'
    },
    {
      id: '24h',
      timeLabel: '24 Stunden (1 Tag – Frühe Erhärtung)',
      hours: 24,
      phaseTitle: 'Phase 4: Diffusionsgesteuertes Wachstum',
      alpha: 48,
      strengthMPa: 18.0,
      porosityPercent: 32,
      heatJg: 270,
      desc: 'C-S-H-Nadeln wachsen brückenartig von den Klinkeroberflächen in den freien Porenraum („Igel“-Struktur). Erste feste Verkrallung der Körner untereinander. Die Hydratation wird diffusionskontrolliert, da Wasser durch die wachsende C-S-H-Schale diffundieren muss.'
    },
    {
      id: '7d',
      timeLabel: '7 Tage (Fortgeschrittenes Gefüge)',
      hours: 168,
      phaseTitle: 'Phase 5: Porenraum-Segmentierung',
      alpha: 74,
      strengthMPa: 38.5,
      porosityPercent: 21,
      heatJg: 350,
      desc: 'Weitgehende Verfilzung der C-S-H-Phasen. Kapillarporen werden segmentiert und in isolierte Gelporen umgewandelt. Die Durchlässigkeit für Wasser und Schadstoffe sinkt um mehrere Zehnerpotenzen. Der Beton erreicht ca. 70 % seiner 28-Tage-Normfestigkeit.'
    },
    {
      id: '28d',
      timeLabel: '28 Tage (Dichtes Endgefüge)',
      hours: 672,
      phaseTitle: 'Phase 6: Ausgereifter Zementstein',
      alpha: 88,
      strengthMPa: 52.0,
      porosityPercent: 14,
      heatJg: 395,
      desc: 'Hochdichtes Zementsteingefüge mit minimalem Anteil an durchgehenden Kapillarporen. Monosulfat-Bildung. Bei niedrigem w/z-Wert verbleiben unhydratisierte Klinkerreste als fester Mikrozuschlag. Erreichen der normativen Charakteristischen Druckfestigkeit fck.'
    }
  ];

  const currentStage = stages[timeStageIndex];

  // Adjust values based on w/z-Wert and cement type
  const effectivePorosity = useMemo(() => {
    // higher w/z -> higher residual porosity
    const wzFactor = (wzRatio - 0.40) * 35;
    return Math.max(5, Math.min(75, currentStage.porosityPercent + wzFactor));
  }, [currentStage, wzRatio]);

  const effectiveStrength = useMemo(() => {
    // Walz formula / Powers: fc ~ (1 - porosity)^3
    const factor = cementType === 'CEM_I' ? 1.0 : (timeStageIndex <= 2 ? 0.7 : 1.08);
    const wzPenalty = Math.pow(0.50 / wzRatio, 1.8);
    return formatDeZahl(currentStage.strengthMPa * factor * wzPenalty, 1);
  }, [currentStage, cementType, wzRatio]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Intro Box */}
      <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
        <p>
          <strong>Interaktive Mikroskopie-Simulation:</strong> Verfolgen Sie das Wachstum der festigkeitsbildenden 
          Calciumsilicathydrat-Phasen (C-S-H-Gel), der hexagonalen Portlandit-Platten (<InlineMath math="Ca(OH)_2" />) 
          und der nadeligen Ettringit-Büschel (<InlineMath math="AFt" />) im wassergefüllten Porenraum. 
          Stellen Sie den Hydratationszeitpunkt und den <InlineMath math="w/z" />-Wert ein, um das Zementsteingefüge live zu analysieren.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/20 pb-2">
              <Clock size={16} className="text-shiraz" /> 1. Reaktionszeit &amp; Phasen
            </h3>

            {/* Stage Selector Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-text-main">Hydratationszeit:</span>
                <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">
                  {currentStage.timeLabel}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={timeStageIndex}
                onChange={(e) => setTimeStageIndex(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <div className="flex justify-between text-[10px] text-text-main/60 mt-1 font-mono">
                <span>0 min</span>
                <span>2 h</span>
                <span>10 h</span>
                <span>24 h</span>
                <span>7 d</span>
                <span>28 d</span>
              </div>
            </div>

            {/* Quick Stage Buttons */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {stages.map((st, idx) => (
                <button
                  key={st.id}
                  onClick={() => setTimeStageIndex(idx)}
                  className={`py-1.5 px-2 text-[11px] rounded-lg border font-medium transition-all cursor-pointer ${
                    timeStageIndex === idx
                      ? 'bg-shiraz text-white border-shiraz shadow-xs font-bold'
                      : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100'
                  }`}
                >
                  {st.id}
                </button>
              ))}
            </div>

            {/* w/z Value Slider */}
            <div className="pt-3 border-t border-home-grau/20 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-text-main">Wasserzementwert (w/z):</span>
                <span className="font-mono font-bold text-text-main bg-slate-100 px-2 py-0.5 rounded">
                  {formatDeZahl(wzRatio, 2)}
                </span>
              </div>
              <input
                type="range"
                min={0.35}
                max={0.65}
                step={0.05}
                value={wzRatio}
                onChange={(e) => setWzRatio(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <p className="text-[10px] text-text-main/60">
                {wzRatio <= 0.42
                  ? 'Niedriger w/z: Dichtes Gefüge, sehr geringe Kapillarporosität, hohe Dauerhaftigkeit.'
                  : wzRatio <= 0.50
                  ? 'Standard w/z nach DIN EN 206 (XC3 / XC4).'
                  : 'Hoher w/z: Hoher Überschuss an nicht chemisch gebundenem Wasser erzeugt offene Kapillarporen.'}
              </p>
            </div>

            {/* Cement Type Selector */}
            <div className="pt-3 border-t border-home-grau/20 space-y-1.5 text-xs">
              <span className="font-bold text-text-main block">Zementkategorie:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCementType('CEM_I')}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                    cementType === 'CEM_I'
                      ? 'bg-shiraz/10 text-shiraz border-shiraz font-bold'
                      : 'bg-off-white text-text-main border-home-grau/30'
                  }`}
                >
                  <span className="block font-bold text-xs">CEM I (Portland)</span>
                  <span className="text-[10px] opacity-75">Schnelles Alit-Wachstum</span>
                </button>
                <button
                  onClick={() => setCementType('CEM_III')}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                    cementType === 'CEM_III'
                      ? 'bg-shiraz/10 text-shiraz border-shiraz font-bold'
                      : 'bg-off-white text-text-main border-home-grau/30'
                  }`}
                >
                  <span className="block font-bold text-xs">CEM III (Hochofen)</span>
                  <span className="text-[10px] opacity-75">Latent-hydraulisch dicht</span>
                </button>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-home-grau/20">
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Hydratationsgrad α</span>
                <span className="text-xl font-mono font-bold text-shiraz">{formatDeWert(currentStage.alpha)} %</span>
              </div>
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Druckfestigkeit fc</span>
                <span className="text-xl font-mono font-bold text-emerald-600">{effectiveStrength} MPa</span>
              </div>
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Kapillarporosität</span>
                <span className="text-xl font-mono font-bold text-text-main">{formatDeZahl(effectivePorosity, 1)} %</span>
              </div>
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Hydratationswärme Q</span>
                <span className="text-xl font-mono font-bold text-amber-600">{formatDeWert(currentStage.heatJg)} J/g</span>
              </div>
            </div>

          </div>
        </div>

        {/* Visualizer Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
            
            <div className="flex items-center justify-between pb-3 border-b border-home-grau/20 mb-3">
              <div>
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <Microscope size={18} className="text-shiraz" /> 2. REM-Gefügebild (Rasterelektronenmikroskopie)
                </h3>
                <span className="text-xs text-text-main/70 font-medium">{currentStage.phaseTitle}</span>
              </div>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                Vergrößerung: 5.000×
              </span>
            </div>

            {/* SVG Microstructure Viewport */}
            <div className="relative w-full aspect-4/3 max-h-[360px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
              
              {/* REM Reticle / Circular Viewport */}
              <svg width="100%" height="100%" viewBox="0 0 500 360" className="select-none">
                <defs>
                  {/* Pore water background gradient */}
                  <radialGradient id="waterGrad" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor={timeStageIndex <= 2 ? '#0284c7' : '#0f172a'} stopOpacity={Math.max(0.15, 0.7 - timeStageIndex * 0.1)} />
                    <stop offset="100%" stopColor="#020617" />
                  </radialGradient>
                  
                  {/* Clinker grain pattern */}
                  <radialGradient id="clinkerGrad" cx="40%" cy="40%" r="55%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="70%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#334155" />
                  </radialGradient>

                  {/* Portlandite Plate gradient */}
                  <linearGradient id="chPlateGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.75" />
                  </linearGradient>
                </defs>

                {/* Pore space background */}
                <rect width="500" height="360" fill="url(#waterGrad)" />

                {/* Substrate Pore Space Label */}
                <text x="250" y="30" fill="#94a3b8" fontSize="10" className="font-mono" textAnchor="middle" opacity="0.6">
                  {timeStageIndex <= 1 ? 'Wassergefüllter Kapillarporenraum (w/z = ' + formatDeZahl(wzRatio, 2) + ')' : 'Fortschreitende Gefügeverdichtung (C-S-H Verfilzung)'}
                </text>

                {/* 1. Clinker Grain Left (Alit C3S dominant) */}
                <g transform="translate(110, 190)">
                  {/* Clinker Core (shrinks as hydration advances) */}
                  <circle
                    cx="0"
                    cy="0"
                    r={Math.max(22, 65 - timeStageIndex * 7)}
                    fill="url(#clinkerGrad)"
                    stroke="#1e293b"
                    strokeWidth="2"
                  />
                  <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    C₃S
                  </text>

                  {/* Radiating C-S-H Needle Fringes (Igel-Struktur) */}
                  {timeStageIndex >= 1 && (
                    <g opacity={Math.min(1, 0.3 + timeStageIndex * 0.16)}>
                      {Array.from({ length: 32 }).map((_, i) => {
                        const angle = (i * 360) / 32;
                        const rad = (angle * Math.PI) / 180;
                        const innerR = Math.max(22, 65 - timeStageIndex * 7);
                        const needleLen = 8 + timeStageIndex * 8.5;
                        const x1 = Math.cos(rad) * innerR;
                        const y1 = Math.sin(rad) * innerR;
                        const x2 = Math.cos(rad) * (innerR + needleLen);
                        const y2 = Math.sin(rad) * (innerR + needleLen);
                        return (
                          <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={timeStageIndex >= 4 ? '#38bdf8' : '#7dd3fc'}
                            strokeWidth={timeStageIndex >= 3 ? 2.5 : 1.5}
                            strokeLinecap="round"
                          />
                        );
                      })}
                    </g>
                  )}
                </g>

                {/* 2. Clinker Grain Right (Belit C2S dominant) */}
                <g transform="translate(380, 160)">
                  <circle
                    cx="0"
                    cy="0"
                    r={Math.max(26, 58 - timeStageIndex * 5.5)}
                    fill="url(#clinkerGrad)"
                    stroke="#1e293b"
                    strokeWidth="2"
                  />
                  <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    C₂S
                  </text>

                  {/* Radiating C-S-H Needle Fringes */}
                  {timeStageIndex >= 2 && (
                    <g opacity={Math.min(1, 0.2 + timeStageIndex * 0.15)}>
                      {Array.from({ length: 28 }).map((_, i) => {
                        const angle = (i * 360) / 28;
                        const rad = (angle * Math.PI) / 180;
                        const innerR = Math.max(26, 58 - timeStageIndex * 5.5);
                        const needleLen = 6 + timeStageIndex * 7;
                        const x1 = Math.cos(rad) * innerR;
                        const y1 = Math.sin(rad) * innerR;
                        const x2 = Math.cos(rad) * (innerR + needleLen);
                        const y2 = Math.sin(rad) * (innerR + needleLen);
                        return (
                          <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={timeStageIndex >= 4 ? '#38bdf8' : '#7dd3fc'}
                            strokeWidth={timeStageIndex >= 3 ? 2.5 : 1.5}
                            strokeLinecap="round"
                          />
                        );
                      })}
                    </g>
                  )}
                </g>

                {/* 3. Smaller Clinker Grain Bottom Center */}
                <g transform="translate(240, 290)">
                  <circle
                    cx="0"
                    cy="0"
                    r={Math.max(14, 40 - timeStageIndex * 4.5)}
                    fill="url(#clinkerGrad)"
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                  <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    C₃A
                  </text>
                </g>

                {/* Interlocking C-S-H Bridging Network in the Central Pore Throat */}
                {timeStageIndex >= 3 && (
                  <g opacity={timeStageIndex >= 4 ? 0.9 : 0.6}>
                    <line x1="175" y1="185" x2="320" y2="165" stroke="#38bdf8" strokeWidth={timeStageIndex >= 4 ? 3.5 : 2} strokeDasharray="3 2" />
                    <line x1="165" y1="215" x2="225" y2="270" stroke="#38bdf8" strokeWidth={timeStageIndex >= 4 ? 3.5 : 2} strokeDasharray="3 2" />
                    <line x1="335" y1="190" x2="265" y2="275" stroke="#38bdf8" strokeWidth={timeStageIndex >= 4 ? 3.5 : 2} strokeDasharray="3 2" />
                    
                    {timeStageIndex >= 4 && (
                      <>
                        <line x1="185" y1="160" x2="310" y2="140" stroke="#0284c7" strokeWidth="2.5" />
                        <line x1="200" y1="210" x2="300" y2="210" stroke="#0284c7" strokeWidth="2.5" />
                      </>
                    )}
                  </g>
                )}

                {/* Hexagonal Portlandite (CH, Ca(OH)2) Crystal Plates */}
                {timeStageIndex >= 2 && (
                  <g opacity={Math.min(1, (timeStageIndex - 1) * 0.28)}>
                    {/* Plate 1 */}
                    <polygon
                      points="230,120 255,108 275,122 270,148 245,160 225,145"
                      fill="url(#chPlateGrad)"
                      stroke="#eab308"
                      strokeWidth="1.5"
                    />
                    <text x="250" y="137" fill="#713f12" fontSize="9" fontWeight="bold" textAnchor="middle">
                      CH
                    </text>

                    {/* Plate 2 (smaller) */}
                    {timeStageIndex >= 3 && (
                      <polygon
                        points="160,80 178,72 192,82 188,100 170,108 156,98"
                        fill="url(#chPlateGrad)"
                        stroke="#eab308"
                        strokeWidth="1.2"
                      />
                    )}
                  </g>
                )}

                {/* Ettringite Needle Clusters (AFt) */}
                {timeStageIndex >= 1 && (
                  <g opacity="0.85">
                    <line x1="260" y1="220" x2="285" y2="205" stroke="#f472b6" strokeWidth="1.8" />
                    <line x1="262" y1="225" x2="290" y2="220" stroke="#f472b6" strokeWidth="1.8" />
                    <line x1="258" y1="228" x2="280" y2="238" stroke="#f472b6" strokeWidth="1.8" />
                    <line x1="255" y1="222" x2="270" y2="200" stroke="#f472b6" strokeWidth="1.8" />
                    <text x="285" y="248" fill="#f472b6" fontSize="8" fontWeight="bold">
                      AFt
                    </text>
                  </g>
                )}

                {/* Scale Bar bottom left */}
                <g transform="translate(30, 325)">
                  <line x1="0" y1="0" x2="60" y2="0" stroke="#ffffff" strokeWidth="2.5" />
                  <line x1="0" y1="-4" x2="0" y2="4" stroke="#ffffff" strokeWidth="2" />
                  <line x1="60" y1="-4" x2="60" y2="4" stroke="#ffffff" strokeWidth="2" />
                  <text x="30" y="14" fill="#ffffff" fontSize="9" className="font-mono" textAnchor="middle">
                    10 µm
                  </text>
                </g>

                {/* Stage watermark badge */}
                <g transform="translate(410, 325)">
                  <rect x="-40" y="-12" width="110" height="20" rx="4" fill="#0f172a" stroke="#334155" />
                  <text x="15" y="2" fill="#38bdf8" fontSize="10" className="font-mono" fontWeight="bold" textAnchor="middle">
                    t = {currentStage.timeLabel.split(' ')[0]} {currentStage.timeLabel.split(' ')[1]}
                  </text>
                </g>
              </svg>
            </div>

            {/* Dynamic Stage Explanation Box */}
            <div className="mt-3 p-3.5 bg-off-white rounded-xl border border-home-grau/25 text-xs text-text-main/80 space-y-1.5">
              <span className="font-bold text-text-main block text-sm">{currentStage.phaseTitle}</span>
              <p className="leading-relaxed">{currentStage.desc}</p>
            </div>

            {/* Phase Mineral Legend */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-home-grau/20 text-xs">
              <span className="font-bold text-text-main/70 text-[11px] uppercase tracking-wider">Legende:</span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-slate-500 border border-slate-700 inline-block"></span> Klinkerkorn (C₃S/C₂S)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-1 bg-sky-400 inline-block"></span> C-S-H Nadeln (Gel)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 bg-amber-400 border border-amber-600 inline-block transform rotate-12"></span> Portlandit (CH)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-1 bg-pink-400 inline-block"></span> Ettringit (AFt)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 bg-sky-900 border border-sky-700 inline-block"></span> Porenlösung
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

function ReaktionenSection() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
        <p>
          Betonzusatzstoffe (z.B. Flugasche, Hüttensand, Kalksteinmehl) werden dem Beton zugegeben, um gezielt Verarbeitbarkeit, Dichte, Dauerhaftigkeit oder Wärmeentwicklung zu steuern und Zementklinker einzusparen (CO₂-Minderung nach dem k-Wert-Konzept). Je nach chemisch-mineralogischem Aufbau werden vier Wirkungsmechanismen unterschieden.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hydraulisch */}
        <div className="border border-blue-200 rounded-xl p-5 bg-blue-50/40 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
              1. Hydraulische Erhärtung
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed mb-3">
              Erhärten sowohl an der Luft als auch unter Wasser selbstständig nach Zugabe von Wasser durch Bildung wasserunlöslicher Calciumsilicathydrat-Phasen (C-S-H).
            </p>
          </div>
          <div className="bg-white/90 p-3 rounded-lg text-xs text-text-main/80 border border-blue-150">
            <strong>Beispiel:</strong> Portlandzementklinker, hydraulische Kalke nach DIN EN 459.
          </div>
        </div>

        {/* Latent-hydraulisch */}
        <div className="border border-emerald-200 rounded-xl p-5 bg-emerald-50/40 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-emerald-900 text-base mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
              2. Latent-hydraulische Erhärtung
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed mb-3">
              Besitzen grundsätzlich hydraulisches Abbindevermögen, benötigen jedoch zur Auflösung des glasigen Silicatnetzwerks einen alkalischen oder sulfatischen Aktivator (z. B. <InlineMath math="Ca(OH)_2" /> oder <InlineMath math="SO_4^{2-}" /> aus dem Zement).
            </p>
          </div>
          <div className="bg-white/90 p-3 rounded-lg text-xs text-text-main/80 border border-emerald-150">
            <strong>Beispiel:</strong> Hüttensandmehl (granulierte Hochofenschlacke) nach DIN EN 15167.
          </div>
        </div>

        {/* Puzzolanisch */}
        <div className="border border-amber-200 rounded-xl p-5 bg-amber-50/40 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-amber-900 text-base mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
              3. Puzzolanische Erhärtung
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed mb-3">
              Reagieren nicht eigenständig mit Wasser, sondern binden das bei der Klinkerhydratation freiwerdende Calciumhydroxid (Portlandit, <InlineMath math="Ca(OH)_2" />) stöchiometrisch zu weiterem festigkeitsbildenden C-S-H-Gel ab.
            </p>
          </div>
          <div className="bg-white/90 p-3 rounded-lg text-xs text-text-main/80 border border-amber-150">
            <strong>Beispiel:</strong> Steinkohlenflugasche (DIN EN 450), Silikastaub (DIN EN 13263), Trass, calciniertes Tonmehl (Metakaolin).
          </div>
        </div>

        {/* Inert */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
              4. Inerte Gesteinsmehle (Füllereffekt)
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed mb-3">
              Nehmen chemisch kaum an der Zementhydratation teil. Sie optimieren die Kornpackungsdichte (Mikro-Füllereffekt), verbessern den Zementleimgehalt und dienen als Kristallisationskeime für C-S-H-Keimwachstum.
            </p>
          </div>
          <div className="bg-white/90 p-3 rounded-lg text-xs text-text-main/80 border border-slate-200">
            <strong>Beispiel:</strong> Kalksteinmehl (DIN EN 12620 / DIN EN 197-1), Quarzmehl.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Zementchemie() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'bogue' | 'gefluege' | 'zusatzstoffe'>('bogue');
  const [cao, setCao] = useState(65.0);
  const [sio2, setSio2] = useState(21.0);
  const [al2o3, setAl2o3] = useState(5.5);
  const [fe2o3, setFe2o3] = useState(3.0);
  const [so3, setSo3] = useState(2.5);

  const results = useMemo(() => {
    // Bogue-Rechnung (vereinfachte Formeln für Portlandzementklinker)
    // C = CaO, S = SiO2, A = Al2O3, F = Fe2O3
    
    let c3s = 0, c2s = 0, c3a = 0, c4af = 0;
    const afRatio = al2o3 / fe2o3;

    if (afRatio >= 0.64) {
      c3s = 4.071 * cao - 7.600 * sio2 - 6.718 * al2o3 - 1.430 * fe2o3 - 2.852 * so3;
      c2s = 2.867 * sio2 - 0.7544 * c3s;
      c3a = 2.650 * al2o3 - 1.692 * fe2o3;
      c4af = 3.043 * fe2o3;
    } else {
      c3s = 4.071 * cao - 7.600 * sio2 - 4.479 * al2o3 - 2.859 * fe2o3 - 2.852 * so3;
      c2s = 2.867 * sio2 - 0.7544 * c3s;
      c3a = 0;
      c4af = 2.100 * al2o3 + 1.702 * fe2o3;
    }

    // Normierung auf 0 falls negativ (kann bei extremen Eingaben passieren)
    c3s = Math.max(0, c3s);
    c2s = Math.max(0, c2s);
    c3a = Math.max(0, c3a);
    c4af = Math.max(0, c4af);

    const sum = c3s + c2s + c3a + c4af;
    
    // Gips/Anhydrit (CSH2) wird aus SO3 gebildet, hier vereinfacht als Rest
    const rest = Math.max(0, 100 - sum);

    return { c3s, c2s, c3a, c4af, rest, sum, afRatio };
  }, [cao, sio2, al2o3, fe2o3, so3]);

  const pieChartData = {
    labels: ['Alit (C₃S)', 'Belit (C₂S)', 'Aluminat (C₃A)', 'Ferrit (C₄AF)', 'Gips/Nebenbestandteile'],
    datasets: [{
      data: [
        results.c3s, 
        results.c2s, 
        results.c3a, 
        results.c4af, 
        results.rest
      ],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#9ca3af'],
    }]
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2 mb-4">
          <Box className="text-shiraz" /> Zementchemie
          <InfoTooltip text="Berechnung der potenziellen Klinkerphasen aus der chemischen Analyse nach Bogue." />
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
          <p>
            Klinkerphasen nach Bogue, Hydratationskinetik und Reaktionsmechanismen mineralischer Bindemittel und Betonzusatzstoffe nach DIN EN 197-1.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Steckbrief
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'bogue' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('bogue')}
          >
            <Calculator size={16} /> Klinkerberechnung &amp; Hydratation (Bogue)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'gefluege' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('gefluege')}
          >
            <Microscope size={16} /> Gefügebildung &amp; C-S-H Simulator
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zusatzstoffe' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zusatzstoffe')}
          >
            <Sparkles size={16} /> Reaktion von Zusatzstoffen
          </button>
        </div>

        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="zement" />
          </div>
        )}

        {activeTab === 'bogue' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-3">
              <p>
                <strong>Didaktischer Leitfaden (DIN EN 197-1):</strong> Portlandzementklinker besteht hauptsächlich aus vier Klinkermineralen: Alit (<InlineMath math="C_3S" />), Belit (<InlineMath math="C_2S" />), Aluminat (<InlineMath math="C_3A" />) und Ferrit (<InlineMath math="C_4AF" />). Die quantitativen Massenanteile werden mittels der <strong>Bogue-Rechnung</strong> aus der oxidischen Zusammensetzung errechnet.
              </p>
              <div className="border-t border-home-grau/30 pt-3 mt-2 space-y-2">
                <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">Hydratations-Hauptreaktionen (Stöchiometrie)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                    <span className="font-semibold block mb-1">1. Alit-Hydratation (<InlineMath math="C_3S" /> - Frühfestigkeit):</span>
                    <div className="my-1.5 overflow-x-auto">
                      <BlockMath math="2\,C_3S + 6\,H_2O \rightarrow C_3S_2H_3\,\text{(C-S-H-Gel)} + 3\,Ca(OH)_2\,\text{(Portlandit)}" />
                    </div>
                    <span className="text-[11px] text-text-main/70 block mt-1">Sorgt für die charakterbildende Festigkeitsentwicklung in den ersten 7 Tagen. Wasser-Zement-Wert (<InlineMath math="w/z" />) steuert die Gefügedichte.</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                    <span className="font-semibold block mb-1">2. Belit-Hydratation (<InlineMath math="C_2S" /> - Spätfestigkeit):</span>
                    <div className="my-1.5 overflow-x-auto">
                      <BlockMath math="2\,C_2S + 4\,H_2O \rightarrow C_3S_2H_3\,\text{(C-S-H-Gel)} + Ca(OH)_2\,\text{(Portlandit)}" />
                    </div>
                    <span className="text-[11px] text-text-main/70 block mt-1">Reagiert langsamer; verantwortlich für die kontinuierliche Festigkeitszunahme ab Tag 28 und chemische Beständigkeit.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Chemische Analyse (Oxide in M.-%)</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <Slider info="Calciumoxid (CaO) Parameter" label={<FormulaText text="Calciumoxid (CaO)" />} min={55} max={70} step={0.1} value={cao} unit="%" onChange={(e) => setCao(Number(e.target.value))} />
                    <Slider info="Siliciumdioxid (SiO_2) Parameter" label={<FormulaText text="Siliciumdioxid (SiO_2)" />} min={15} max={25} step={0.1} value={sio2} unit="%" onChange={(e) => setSio2(Number(e.target.value))} />
                    <Slider info="Aluminiumoxid (Al_2O_3) Parameter" label={<FormulaText text="Aluminiumoxid (Al_2O_3)" />} min={2} max={8} step={0.1} value={al2o3} unit="%" onChange={(e) => setAl2o3(Number(e.target.value))} />
                    <Slider info="Eisen(III)-oxid (Fe_2O_3) Parameter" label={<FormulaText text="Eisen(III)-oxid (Fe_2O_3)" />} min={0} max={6} step={0.1} value={fe2o3} unit="%" onChange={(e) => setFe2o3(Number(e.target.value))} />
                    <Slider info="Schwefeltrioxid (SO_3) Parameter" label={<FormulaText text="Schwefeltrioxid (SO_3)" />}  min={0} max={4} step={0.1} value={so3} unit="%" onChange={(e) => setSo3(Number(e.target.value))} />
                  </div>
                  
                  <div className="mt-4 text-xs text-text-main/70 flex justify-between font-mono">
                    <span>Summe der Oxide: {formatDeZahl((cao + sio2 + al2o3 + fe2o3 + so3), 1)} %</span>
                    {cao + sio2 + al2o3 + fe2o3 + so3 > 100 && <span className="text-red-500 font-bold">Summe &gt; 100%!</span>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-shiraz text-white p-6 rounded-xl shadow-md">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Klinkerphasen nach Bogue</h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-2">
                    <div>
                      <div className="text-white/80 text-sm mb-1 flex items-center gap-1">
                        <span>Alit (<InlineMath math="C_3S" />)</span>
                        <InfoTooltip text="Tricalciumsilicat: Schnelle Erhärtung, hohe Frühfestigkeit, hohe Hydratationswärme." />
                      </div>
                      <div className="text-3xl font-bold text-blue-200">{formatDeZahl(results.c3s, 1)} %</div>
                    </div>
                    <div>
                      <div className="text-white/80 text-sm mb-1 flex items-center gap-1">
                        <span>Belit (<InlineMath math="C_2S" />)</span>
                        <InfoTooltip text="Dicalciumsilicat: Langsame Erhärtung, hohe Endfestigkeit, geringe Hydratationswärme." />
                      </div>
                      <div className="text-3xl font-bold text-emerald-200">{formatDeZahl(results.c2s, 1)} %</div>
                    </div>
                    <div>
                      <div className="text-white/80 text-sm mb-1 flex items-center gap-1">
                        <span>Aluminat (<InlineMath math="C_3A" />)</span>
                        <InfoTooltip text="Tricalciumaluminat: Sehr schnelle Reaktion, Erstarrungsregelung durch Sulfat nötig. Sulfatempfindlich (Ettringittreiben)." />
                      </div>
                      <div className="text-3xl font-bold text-amber-200">{formatDeZahl(results.c3a, 1)} %</div>
                    </div>
                    <div>
                      <div className="text-white/80 text-sm mb-1 flex items-center gap-1">
                        <span>Ferrit (<InlineMath math="C_4AF" />)</span>
                        <InfoTooltip text="Tetracalciumaluminatferrit: Graue Farbe des Zements, wirkt als Flussmittel beim Brennen." />
                      </div>
                      <div className="text-3xl font-bold text-rose-200">{formatDeZahl(results.c4af, 1)} %</div>
                    </div>
                  </div>
                </div>

                <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                  <h3 className="font-bold text-sm mb-4 text-text-main uppercase tracking-wider">Zusammensetzung (Massen-%)</h3>
                  <div className="h-[230px]">
                    <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>

                {/* Schematische Darstellung */}
                <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                  <h3 className="font-bold text-sm mb-4 text-text-main uppercase tracking-wider">Schematische Klinkerkorn-Struktur</h3>
                  <div className="relative w-full h-48 bg-white rounded-lg border border-home-grau/30 overflow-hidden flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                      {/* Klinkerkorn */}
                      <circle cx="200" cy="100" r="80" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                      
                      {/* Alit (C3S) - Blau */}
                      <path d="M 160 60 Q 180 40 210 50 Q 230 70 200 90 Q 170 80 160 60 Z" fill="#93c5fd" opacity="0.8" />
                      <path d="M 220 120 Q 250 110 260 140 Q 240 160 210 150 Q 190 130 220 120 Z" fill="#93c5fd" opacity="0.8" />
                      <path d="M 140 110 Q 150 140 130 160 Q 110 140 120 120 Q 130 100 140 110 Z" fill="#93c5fd" opacity="0.8" />
                      
                      {/* Belit (C2S) - Grün */}
                      <circle cx="150" cy="80" r="15" fill="#86efac" opacity="0.8" />
                      <circle cx="240" cy="80" r="12" fill="#86efac" opacity="0.8" />
                      <circle cx="180" cy="140" r="18" fill="#86efac" opacity="0.8" />
                      <circle cx="170" cy="110" r="10" fill="#86efac" opacity="0.8" />

                      {/* Aluminat (C3A) - Gelb */}
                      <path d="M 190 60 L 200 70 L 190 80 L 180 70 Z" fill="#fde047" opacity="0.9" />
                      <path d="M 230 100 L 240 110 L 230 120 L 220 110 Z" fill="#fde047" opacity="0.9" />
                      <path d="M 140 140 L 150 150 L 140 160 L 130 150 Z" fill="#fde047" opacity="0.9" />

                      {/* Ferrit (C4AF) - Rot */}
                      <rect x="200" y="100" width="15" height="15" fill="#fca5a5" opacity="0.9" transform="rotate(45 200 100)" />
                      <rect x="160" y="130" width="12" height="12" fill="#fca5a5" opacity="0.9" transform="rotate(30 160 130)" />
                      <rect x="210" y="70" width="10" height="10" fill="#fca5a5" opacity="0.9" transform="rotate(15 210 70)" />

                      {/* Legende */}
                      <rect x="20" y="20" width="10" height="10" fill="#93c5fd" />
                      <text x="35" y="30" fontSize="10" fill="#334155">Alit (C<tspan baselineShift="sub" fontSize="7">3</tspan>S)</text>
                      
                      <rect x="20" y="40" width="10" height="10" fill="#86efac" />
                      <text x="35" y="50" fontSize="10" fill="#334155">Belit (C<tspan baselineShift="sub" fontSize="7">2</tspan>S)</text>

                      <rect x="20" y="60" width="10" height="10" fill="#fde047" />
                      <text x="35" y="70" fontSize="10" fill="#334155">Aluminat (C<tspan baselineShift="sub" fontSize="7">3</tspan>A)</text>

                      <rect x="20" y="80" width="10" height="10" fill="#fca5a5" />
                      <text x="35" y="90" fontSize="10" fill="#334155">Ferrit (C<tspan baselineShift="sub" fontSize="7">4</tspan>AF)</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gefluege' && (
          <div className="animate-in fade-in duration-300">
            <GefuegebildungSimulator />
          </div>
        )}

        {activeTab === 'zusatzstoffe' && (
          <div className="animate-in fade-in duration-300">
            <ReaktionenSection />
          </div>
        )}
      </div>
      
      <ModuleFooter 
        wikipedia={[
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' },
          { title: 'Portlandzementklinker', url: 'https://de.wikipedia.org/wiki/Portlandzementklinker' },
          { title: 'Bogue-Berechnung', url: 'https://de.wikipedia.org/wiki/Bogue-Berechnung' }
        ]}
        regelwerke={[
          { title: 'DIN EN 197-1 (Zement - Zusammensetzung, Anforderungen und Konformitätskriterien von Normalzement)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+197-1' },
          { title: 'DIN EN 197-5 (Portland-Kompositzement CEM II/C-M und Kompositzement CEM VI)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+197-5' },
          { title: 'DIN EN 196-2 (Prüfverfahren für Zement - Chemische Analyse von Zement)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+196-2' }
        ]}
        literatur={[
          'Bogue, R. H. (1929): Calculation of the compounds in Portland cement. Industrial & Engineering Chemistry, 1(4), S. 192-197',
          'Taylor, H. F. W. (1997): Cement Chemistry (2. Auflage, Thomas Telford Publishing)',
          'Stark, J.; Wicht, B. (2013): Zement und Schnellzemente - Chemie, Hydratation und Anwendung (Springer Vieweg)',
          'Verein Deutscher Zementwerke (VDZ): Zement-Taschenbuch (52. Ausgabe, Verlag Bau+Technik)'
        ]}
        formeln={[
          {
            formel: 'KSt = \\frac{100 \\cdot \\text{CaO}}{2{,}8 \\cdot \\text{SiO}_2 + 1{,}1 \\cdot \\text{Al}_2\\text{O}_3 + 0{,}7 \\cdot \\text{Fe}_2\\text{O}_3}',
            erklaerung: 'Kalkstandard KSt (nach Kühl): Kennwert zur Beurteilung des Rohmehlversatzes beim Brennen von Klinker. Typischer Zielbereich liegt bei 90 bis 102.',
            quelle: 'DIN EN 196-2 / VDZ Zement-Taschenbuch'
          },
          {
            formel: 'w/z = \\frac{m_w}{m_z}',
            erklaerung: 'Wasser-Zement-Wert: Verhältnis aus wirksamer Wassermasse zu Zementmasse. Bestimmt maßgeblich Kapillarporosität und Endfestigkeit nach Walz.',
            quelle: 'DIN EN 206 / DIN 1045-2'
          },
          {
            formel: '\\text{C}_3\\text{S} = 4.071 \\cdot \\text{CaO} - 7.600 \\cdot \\text{SiO}_2 - 6.718 \\cdot \\text{Al}_2\\text{O}_3 - 1.430 \\cdot \\text{Fe}_2\\text{O}_3 - 2.852 \\cdot \\text{SO}_3',
            erklaerung: 'Bogue-Gleichung für Tricalciumsilicat (Alit, C3S in M.-%) bei einem Al2O3/Fe2O3-Verhältnis >= 0.64. Maßgebend für die Frühfestigkeit.',
            quelle: 'Bogue, R. H. (1929) / DIN EN 196-2'
          },
          {
            formel: '\\text{C}_2\\text{S} = 2.867 \\cdot \\text{SiO}_2 - 0{,}7544 \\cdot \\text{C}_3\\text{S}',
            erklaerung: 'Bogue-Gleichung für Dicalciumsilicat (Belit, C2S in M.-%). Verantwortlich für die kontinuierliche Nacherhärtung ab Tag 28.',
            quelle: 'Bogue, R. H. (1929)'
          },
          {
            formel: '\\text{C}_3\\text{A} = 2.650 \\cdot \\text{Al}_2\\text{O}_3 - 1.692 \\cdot \\text{Fe}_2\\text{O}_3',
            erklaerung: 'Bogue-Gleichung für Tricalciumaluminat (C3A in M.-%). Schnelle Hydratationswärmeentwicklung, primäre Angriffsstelle für Sulfattreiben (Ettringitbildung).',
            quelle: 'Bogue, R. H. (1929)'
          },
          {
            formel: '\\text{C}_4\\text{AF} = 3.043 \\cdot \\text{Fe}_2\\text{O}_3',
            erklaerung: 'Bogue-Gleichung für Tetracalciumaluminatferrit (Brownmillerit, C4AF in M.-%). Verleiht Zement die typische Graufärbung und wirkt als Schmelzphase beim Sintern.',
            quelle: 'Bogue, R. H. (1929)'
          },
          {
            formel: 'SiO_2 + Ca(OH)_2 + H_2O \\rightarrow C-S-H',
            erklaerung: 'Puzzolanische Sekundärreaktion: Reaktives Siliciumdioxid aus Zusatzstoffen (z. B. Flugasche, Silikastaub, Metakaolin) reagiert mit freigesetztem Portlandit zu festigkeitsbildendem C-S-H-Gel.',
            quelle: 'Taylor: Cement Chemistry'
          },
          {
            formel: 'w/(z + k \\cdot f) \\le (w/z)_{\\text{max}}',
            erklaerung: 'k-Wert-Konzept nach DIN EN 206 / DIN 1045-2: Rechnerische Anrechnung von Flugasche oder Silikastaub auf den Mindestzementgehalt und den maximalen äquivalenten Wasser-Bindemittel-Wert.',
            quelle: 'DIN EN 206'
          }
        ]}
      />
    </div>
  );
}
