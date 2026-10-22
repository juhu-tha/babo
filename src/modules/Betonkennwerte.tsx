import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Calculator, 
  BookOpen, 
  Activity, 
  ShieldCheck, 
  TrendingDown, 
  Clock, 
  Droplets, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Scale,
  Compass,
  Sparkles,
  GitCommit
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';

// ----------------------------------------------------------------------
// EC2 TABELLE 3.1: FESTIGKEITS- UND VERFORMUNGSEIGENSCHAFTEN FÜR BETON
// (DIN EN 1992-1-1:2011-01 & NA:2013-04)
// ----------------------------------------------------------------------
export interface ConcreteClassData {
  name: string;
  fck: number;      // MPa (Zylinder)
  fckCube: number;  // MPa (150 mm Würfel)
  fcm: number;      // MPa
  fctm: number;     // MPa
  fctk005: number;  // MPa
  fctk095: number;  // MPa
  Ecm: number;      // GPa
  epsC1: number;    // ‰
  epsCu1: number;   // ‰
  epsC2: number;    // ‰
  epsCu2: number;   // ‰
  n: number;        // Exponent Parabel-Rechteck
  epsC3: number;    // ‰
  epsCu3: number;   // ‰
}

export const EC2_CONCRETE_CLASSES: ConcreteClassData[] = [
  { name: 'C12/15', fck: 12, fckCube: 15, fcm: 20, fctm: 1.6, fctk005: 1.1, fctk095: 2.0, Ecm: 27, epsC1: 1.8, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C16/20', fck: 16, fckCube: 20, fcm: 24, fctm: 1.9, fctk005: 1.3, fctk095: 2.5, Ecm: 29, epsC1: 1.9, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C20/25', fck: 20, fckCube: 25, fcm: 28, fctm: 2.2, fctk005: 1.5, fctk095: 2.9, Ecm: 30, epsC1: 2.0, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C25/30', fck: 25, fckCube: 30, fcm: 33, fctm: 2.6, fctk005: 1.8, fctk095: 3.3, Ecm: 31, epsC1: 2.1, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C30/37', fck: 30, fckCube: 37, fcm: 38, fctm: 2.9, fctk005: 2.0, fctk095: 3.8, Ecm: 33, epsC1: 2.2, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C35/45', fck: 35, fckCube: 45, fcm: 43, fctm: 3.2, fctk005: 2.2, fctk095: 4.2, Ecm: 34, epsC1: 2.25, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C40/50', fck: 40, fckCube: 50, fcm: 48, fctm: 3.5, fctk005: 2.5, fctk095: 4.6, Ecm: 35, epsC1: 2.3, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C45/55', fck: 45, fckCube: 55, fcm: 53, fctm: 3.8, fctk005: 2.7, fctk095: 4.9, Ecm: 36, epsC1: 2.4, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C50/60', fck: 50, fckCube: 60, fcm: 58, fctm: 4.1, fctk005: 2.9, fctk095: 5.3, Ecm: 37, epsC1: 2.45, epsCu1: 3.5, epsC2: 2.0, epsCu2: 3.5, n: 2.0, epsC3: 1.75, epsCu3: 3.5 },
  { name: 'C55/67', fck: 55, fckCube: 67, fcm: 63, fctm: 4.2, fctk005: 3.0, fctk095: 5.5, Ecm: 38, epsC1: 2.5, epsCu1: 3.1, epsC2: 2.2, epsCu2: 3.1, n: 1.75, epsC3: 1.8, epsCu3: 3.1 },
  { name: 'C60/75', fck: 60, fckCube: 75, fcm: 68, fctm: 4.4, fctk005: 3.1, fctk095: 5.7, Ecm: 39, epsC1: 2.6, epsCu1: 2.9, epsC2: 2.3, epsCu2: 2.9, n: 1.6, epsC3: 1.9, epsCu3: 2.9 },
  { name: 'C70/85', fck: 70, fckCube: 85, fcm: 78, fctm: 4.6, fctk005: 3.2, fctk095: 6.0, Ecm: 41, epsC1: 2.7, epsCu1: 2.7, epsC2: 2.4, epsCu2: 2.7, n: 1.45, epsC3: 2.0, epsCu3: 2.7 },
  { name: 'C80/95', fck: 80, fckCube: 95, fcm: 88, fctm: 4.8, fctk005: 3.4, fctk095: 6.3, Ecm: 42, epsC1: 2.8, epsCu1: 2.6, epsC2: 2.5, epsCu2: 2.6, n: 1.4, epsC3: 2.2, epsCu3: 2.6 },
  { name: 'C90/105', fck: 90, fckCube: 105, fcm: 98, fctm: 5.0, fctk005: 3.5, fctk095: 6.6, Ecm: 44, epsC1: 2.8, epsCu1: 2.6, epsC2: 2.6, epsCu2: 2.6, n: 1.4, epsC3: 2.3, epsCu3: 2.6 },
  { name: 'C100/115', fck: 100, fckCube: 115, fcm: 108, fctm: 5.2, fctk005: 3.6, fctk095: 6.8, Ecm: 45, epsC1: 2.8, epsCu1: 2.6, epsC2: 2.6, epsCu2: 2.6, n: 1.4, epsC3: 2.3, epsCu3: 2.6 }
];

interface Ec2ParameterSkizzeProps {
  baseConcrete: typeof EC2_CONCRETE_CLASSES[0];
  calcResults: any;
  cementClass: 'S' | 'N' | 'R';
  aggregateType: 'quarzit' | 'kalkstein' | 'sandstein' | 'basalt';
  relativeHumidity: number;
  areaAc: number;
  perimeterU: number;
  loadingAgeT0: number;
  curingDaysTs: number;
  targetAgeT: number;
  axialStressSigmaC: number;
  ambientTempT: number;
  elementHeightH: number;
  elementLengthL: number;
}

function Ec2ParameterSkizze({
  baseConcrete,
  calcResults,
  cementClass,
  aggregateType,
  relativeHumidity,
  areaAc,
  perimeterU,
  loadingAgeT0,
  curingDaysTs,
  targetAgeT,
  axialStressSigmaC,
  ambientTempT,
}: Ec2ParameterSkizzeProps) {
  const isNonlinear = calcResults.isNonlinearCreep;
  const stressRatio = calcResults.fckT0 > 0 ? (axialStressSigmaC / calcResults.fckT0) : 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-home-grau/30 p-4 sm:p-5 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-home-grau/20">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-shiraz/10 text-shiraz">
            <Compass size={18} />
          </span>
          <div>
            <h4 className="font-bold text-sm text-text-main dark:text-slate-100 flex items-center gap-2">
              Systemskizze: Einwirkende Größen, Bauteilgeometrie &amp; Zeitparameter (Abschnitt 1 – 6)
            </h4>
            <p className="text-[11px] text-text-main/70 dark:text-slate-400">
              Veranschaulichung der normativen Zusammenhänge nach DIN EN 1992-1-1 (EC2) mit aktuellen Werten
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-home-grau/25 text-shiraz">
            {baseConcrete.name} · h₀ = {formatDeZahl(calcResults.h0, 0)} mm
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto bg-white dark:bg-slate-950 rounded-xl border border-home-grau/25 p-2 sm:p-3">
        <svg 
          viewBox="0 0 940 370" 
          className="w-full min-w-[760px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Arrowhead Markers */}
            <marker id="arrow-shiraz" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#8c1d40" />
            </marker>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
            </marker>
            <marker id="arrow-slate" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
            </marker>

            {/* Linear Gradients */}
            <linearGradient id="concreteTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="concreteLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="concreteRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>

          {/* ============================================================ */}
          {/* LINKER BEREICH: ISOMETRISCHER BAUTEILQUERSCHNITT Ac & LAST   */}
          {/* ============================================================ */}
          <g transform="translate(10, 10)">
            {/* Section Header */}
            <text x="170" y="20" textAnchor="middle" className="text-xs font-bold fill-slate-800 dark:fill-slate-100 font-sans" fontSize="12" fontWeight="700">
              Bauteilquerschnitt Ac, Umfang u &amp; Last σc
            </text>

            {/* Lastpfeile sigma_c (nach unten auf Deckfläche) */}
            <g>
              <line x1="170" y1="42" x2="170" y2="78" stroke="#8c1d40" strokeWidth="2.5" markerEnd="url(#arrow-shiraz)" />
              <line x1="120" y1="58" x2="120" y2="92" stroke="#8c1d40" strokeWidth="2" markerEnd="url(#arrow-shiraz)" />
              <line x1="220" y1="58" x2="220" y2="92" stroke="#8c1d40" strokeWidth="2" markerEnd="url(#arrow-shiraz)" />
              
              {/* Lastbeschriftung σ_c */}
              <rect x="90" y="28" width="160" height="20" rx="4" fill="#8c1d40" fillOpacity="0.1" stroke="#8c1d40" strokeWidth="1" />
              <text x="170" y="42" textAnchor="middle" fill="#8c1d40" fontSize="11" fontWeight="bold" fontFamily="monospace">
                σc = {formatDeZahl(axialStressSigmaC, 1)} MPa (Druck)
              </text>
            </g>

            {/* Isometrischer Beton-Prismenkörper */}
            {/* Deckfläche: Ac (Raute) */}
            <polygon 
              points="170,82 255,116 170,150 85,116" 
              fill="url(#concreteTopGrad)" 
              stroke="#475569" 
              strokeWidth="1.5" 
            />
            
            {/* Text auf Deckfläche: Ac */}
            <text x="170" y="118" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold">
              Ac = {formatDeZahl(areaAc, 2)} m²
            </text>
            <text x="170" y="132" textAnchor="middle" fill="#475569" fontSize="9">
              (Betonquerschnitt)
            </text>

            {/* Linke Vorderseite */}
            <polygon 
              points="85,116 170,150 170,260 85,226" 
              fill="url(#concreteLeftGrad)" 
              stroke="#475569" 
              strokeWidth="1.5" 
            />

            {/* Rechte Vorderseite */}
            <polygon 
              points="170,150 255,116 255,226 170,260" 
              fill="url(#concreteRightGrad)" 
              stroke="#475569" 
              strokeWidth="1.5" 
            />

            {/* Kantenakzente & Umfang u */}
            <path 
              d="M 85,116 L 170,150 L 255,116" 
              fill="none" 
              stroke="#0284c7" 
              strokeWidth="2.5" 
              strokeDasharray="4 2" 
            />

            {/* Diffusions- / Verdunstungspfeile nach außen (Umgebungsfeuchte RH) */}
            <g opacity="0.85">
              {/* Links */}
              <path d="M 68,170 Q 52,166 40,172" fill="none" stroke="#0284c7" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
              <path d="M 72,205 Q 56,201 44,207" fill="none" stroke="#0284c7" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
              {/* Rechts */}
              <path d="M 270,170 Q 286,166 298,172" fill="none" stroke="#0284c7" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
              <path d="M 266,205 Q 282,201 294,207" fill="none" stroke="#0284c7" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
              
              <text x="35" y="160" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">RH = {formatDeWert(relativeHumidity)}%</text>
              <text x="35" y="174" textAnchor="middle" fill="#0369a1" fontSize="9">T = {formatDeWert(ambientTempT)}°C</text>

              <text x="305" y="160" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">H₂O-Diffusion</text>
              <text x="305" y="174" textAnchor="middle" fill="#0369a1" fontSize="9">Trocknung</text>
            </g>

            {/* Maßkette: Wirksame Bauteildicke h0 */}
            <g transform="translate(0, 275)">
              <rect x="45" y="0" width="250" height="42" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <text x="170" y="16" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
                h₀ = 2·Ac / u = {formatDeZahl(calcResults.h0, 0)} mm
              </text>
              <text x="170" y="32" textAnchor="middle" fill="#64748b" fontSize="9.5">
                Umfang u = {formatDeZahl(perimeterU, 1)} m · Diffusionsfaktor kh = {formatDeZahl(calcResults.kh, 2)}
              </text>
            </g>

            {/* Kriechregime-Indikator Badge */}
            <g transform="translate(45, 324)">
              <rect 
                x="0" 
                y="0" 
                width="250" 
                height="24" 
                rx="6" 
                fill={isNonlinear ? '#fef3c7' : '#ecfdf5'} 
                stroke={isNonlinear ? '#f59e0b' : '#10b981'} 
                strokeWidth="1" 
              />
              <text 
                x="125" 
                y="16" 
                textAnchor="middle" 
                fill={isNonlinear ? '#92400e' : '#065f46'} 
                fontSize="10" 
                fontWeight="bold"
              >
                {isNonlinear 
                  ? `Nichtlinear: kσ = ${formatDeZahl(stressRatio, 2)} > 0,45 (Gl. 3.7)` 
                  : `Linear: σc ≤ 0,45·fck(t₀) = ${formatDeZahl(calcResults.stressLimitLin, 1)} MPa`}
              </text>
            </g>
          </g>

          {/* Trennlinie vertikal */}
          <line x1="365" y1="20" x2="365" y2="350" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* ============================================================ */}
          {/* RECHTER BEREICH: CHRONOLOGISCHER ZEITSTRAHL (t0, ts, t)      */}
          {/* ============================================================ */}
          <g transform="translate(385, 10)">
            <text x="270" y="20" textAnchor="middle" className="text-xs font-bold fill-slate-800 dark:fill-slate-100 font-sans" fontSize="12" fontWeight="700">
              Reife-, Schwind- &amp; Belastungschronologie (Abschnitte 1, 5 &amp; 6)
            </text>

            {/* Hauptzeitachse */}
            <line x1="20" y1="130" x2="520" y2="130" stroke="#475569" strokeWidth="2.5" markerEnd="url(#arrow-slate)" />
            <text x="525" y="134" fill="#475569" fontSize="11" fontWeight="bold">Zeit t</text>

            {/* 1. Punkt: t = 0 (Betonage) */}
            <g transform="translate(30, 130)">
              <circle cx="0" cy="0" r="5" fill="#8c1d40" />
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#8c1d40" strokeWidth="2" />
              <text x="0" y="24" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">t = 0</text>
              <text x="0" y="37" textAnchor="middle" fill="#64748b" fontSize="9">Betonage</text>
              
              {/* Notiz oben: autogenes Schwinden beginnt */}
              <rect x="-40" y="-72" width="80" height="52" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <text x="0" y="-55" textAnchor="middle" fill="#8c1d40" fontSize="9" fontWeight="bold">Abschnitt 5</text>
              <text x="0" y="-42" textAnchor="middle" fill="#0f172a" fontSize="8.5">ε_ca(t) Start</text>
              <text x="0" y="-28" textAnchor="middle" fill="#64748b" fontSize="8">s = {cementClass === 'R' ? '0,20 (R)' : cementClass === 'S' ? '0,38 (S)' : '0,25 (N)'}</text>
            </g>

            {/* 2. Punkt: t_s (Nachbehandlungsende) */}
            <g transform="translate(130, 130)">
              <circle cx="0" cy="0" r="5" fill="#0284c7" />
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#0284c7" strokeWidth="2" />
              <text x="0" y="24" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="bold">ts = {formatDeWert(curingDaysTs)} d</text>
              <text x="0" y="37" textAnchor="middle" fill="#64748b" fontSize="9">Ausschalung</text>

              {/* Notiz oben: Trocknungsschwinden beginnt */}
              <rect x="-45" y="-72" width="90" height="52" rx="5" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1" />
              <text x="0" y="-55" textAnchor="middle" fill="#0284c7" fontSize="9" fontWeight="bold">Trocknung</text>
              <text x="0" y="-42" textAnchor="middle" fill="#0f172a" fontSize="8.5">ε_cd(t, ts) Start</text>
              <text x="0" y="-28" textAnchor="middle" fill="#0369a1" fontSize="8">k_h = {formatDeZahl(calcResults.kh, 2)}</text>
            </g>

            {/* 3. Punkt: t_0 (Erstbelastung) */}
            <g transform="translate(250, 130)">
              <circle cx="0" cy="0" r="6" fill="#8c1d40" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#8c1d40" strokeWidth="2" />
              <text x="0" y="24" textAnchor="middle" fill="#8c1d40" fontSize="11" fontWeight="bold">t₀ = {formatDeWert(loadingAgeT0)} d</text>
              <text x="0" y="37" textAnchor="middle" fill="#64748b" fontSize="9">Erstbelastung</text>

              {/* Notiz oben: Kriechen beginnt */}
              <rect x="-50" y="-76" width="100" height="56" rx="5" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1" />
              <text x="0" y="-59" textAnchor="middle" fill="#8c1d40" fontSize="9" fontWeight="bold">Abschnitt 6</text>
              <text x="0" y="-46" textAnchor="middle" fill="#0f172a" fontSize="8.5">Last σc einleiten</text>
              <text x="0" y="-33" textAnchor="middle" fill="#8c1d40" fontSize="8">Kriechen φ(t,t₀) Start</text>
            </g>

            {/* 4. Punkt: 28 d Normreife */}
            <g transform="translate(360, 130)">
              <circle cx="0" cy="0" r="4.5" fill="#475569" />
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#475569" strokeWidth="1.5" />
              <text x="0" y="24" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="bold">t = 28 d</text>
              <text x="0" y="37" textAnchor="middle" fill="#64748b" fontSize="9">Normreife</text>

              {/* Notiz oben: 28d Nennwerte */}
              <rect x="-42" y="-72" width="84" height="52" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <text x="0" y="-55" textAnchor="middle" fill="#334155" fontSize="9" fontWeight="bold">Abschnitt 1–3</text>
              <text x="0" y="-42" textAnchor="middle" fill="#0f172a" fontSize="8.5">fck = {formatDeWert(baseConcrete.fck)} MPa</text>
              <text x="0" y="-28" textAnchor="middle" fill="#64748b" fontSize="8">Ecm = {formatDeZahl(calcResults.Ecm, 0)} MPa</text>
            </g>

            {/* 5. Punkt: t (Zielalter z.B. Endzustand) */}
            <g transform="translate(470, 130)">
              <circle cx="0" cy="0" r="5" fill="#059669" />
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#059669" strokeWidth="2" />
              <text x="0" y="24" textAnchor="middle" fill="#059669" fontSize="11" fontWeight="bold">t = {targetAgeT >= 365 ? `${formatDeWert(Math.round(targetAgeT/365))} a` : `${formatDeWert(targetAgeT)} d`}</text>
              <text x="0" y="37" textAnchor="middle" fill="#64748b" fontSize="9">Endzustand</text>

              {/* Notiz oben: Endwerte */}
              <rect x="-50" y="-76" width="100" height="56" rx="5" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1" />
              <text x="0" y="-59" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="bold">Langzeit-Werte</text>
              <text x="0" y="-46" textAnchor="middle" fill="#0f172a" fontSize="8.5">φ(t,t₀) = {formatDeZahl(calcResults.phiFinal, 2)}</text>
              <text x="0" y="-33" textAnchor="middle" fill="#059669" fontSize="8">ε_cs = {formatDeZahl(calcResults.epsCs * 1000, 2)} ‰</text>
            </g>

            {/* Wirkungsbereiche darunter (Brackets & Phasen) */}
            <g transform="translate(0, 185)">
              {/* Autogenes Schwinden (0 bis t) */}
              <rect x="30" y="0" width="440" height="20" rx="4" fill="#8c1d40" fillOpacity="0.08" stroke="#8c1d40" strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="250" y="14" textAnchor="middle" fill="#8c1d40" fontSize="9.5" fontWeight="bold">
                1. Autogenes Schwinden ε_ca(t) = β_as(t) · 2,5·(f_ck - 10)·10⁻⁶
              </text>

              {/* Trocknungsschwinden (ts bis t) */}
              <rect x="130" y="26" width="340" height="20" rx="4" fill="#0284c7" fillOpacity="0.08" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="300" y="40" textAnchor="middle" fill="#0284c7" fontSize="9.5" fontWeight="bold">
                2. Trocknungsschwinden ε_cd(t, ts) = β_ds(t, ts) · kh · ε_cd,0
              </text>

              {/* Kriechen unter Dauerlast (t0 bis t) */}
              <rect x="250" y="52" width="220" height="20" rx="4" fill="#059669" fillOpacity="0.08" stroke="#059669" strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="360" y="66" textAnchor="middle" fill="#059669" fontSize="9.5" fontWeight="bold">
                3. Kriechen ε_cc(t, t₀) = φ(t, t₀) · σc / Ec
              </text>

              {/* Summenformel Gesamtstauchung */}
              <rect x="30" y="80" width="440" height="26" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <text x="250" y="97" textAnchor="middle" fill="#1e293b" fontSize="10.5" fontWeight="bold">
                Gesamtverformung: ε_tot(t) = ε_ci + ε_cc(t, t₀) + ε_cd(t, ts) + ε_ca(t)
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Kompakte 6-teilige Formelsammlungs-Matrix darunter */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3 pt-3 border-t border-home-grau/20 text-xs">
        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-home-grau/25 shadow-2xs">
          <span className="text-[10px] text-shiraz font-bold block">① Druckfestigkeit</span>
          <span className="font-mono font-bold text-text-main dark:text-slate-100">{formatDeWert(baseConcrete.fck)} / {formatDeWert(baseConcrete.fcm)} MPa</span>
          <span className="text-[10px] text-text-main/60 block">s = {cementClass === 'R' ? '0,20' : cementClass === 'S' ? '0,38' : '0,25'}</span>
        </div>

        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-home-grau/25 shadow-2xs">
          <span className="text-[10px] text-shiraz font-bold block">② Zugfestigkeit</span>
          <span className="font-mono font-bold text-text-main dark:text-slate-100">{formatDeZahl(calcResults.fctm, 2)} MPa</span>
          <span className="text-[10px] text-text-main/60 block">fctk;0,05 = {formatDeZahl(calcResults.fctk005, 2)}</span>
        </div>

        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-home-grau/25 shadow-2xs">
          <span className="text-[10px] text-shiraz font-bold block">③ E-Modul &amp; G</span>
          <span className="font-mono font-bold text-text-main dark:text-slate-100">{formatDeZahl(calcResults.Ecm / 1000, 1)} GPa</span>
          <span className="text-[10px] text-text-main/60 block">αE = {formatDeZahl(calcResults.alphaE, 2)} ({aggregateType})</span>
        </div>

        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-home-grau/25 shadow-2xs">
          <span className="text-[10px] text-shiraz font-bold block">④ Dehnungen σ-ε</span>
          <span className="font-mono font-bold text-text-main dark:text-slate-100">{formatDeWert(baseConcrete.epsC1)} / {formatDeWert(baseConcrete.epsCu1)} ‰</span>
          <span className="text-[10px] text-text-main/60 block">εc2 = {formatDeWert(baseConcrete.epsC2)} ‰</span>
        </div>

        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-home-grau/25 shadow-2xs">
          <span className="text-[10px] text-shiraz font-bold block">⑤ Schwinden</span>
          <span className="font-mono font-bold text-text-main dark:text-slate-100">{formatDeZahl(calcResults.epsCs * 1000, 2)} ‰</span>
          <span className="text-[10px] text-text-main/60 block">h₀ = {formatDeZahl(calcResults.h0, 0)} mm</span>
        </div>

        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-home-grau/25 shadow-2xs">
          <span className="text-[10px] text-shiraz font-bold block">⑥ Kriechen</span>
          <span className="font-mono font-bold text-text-main dark:text-slate-100">φ = {formatDeZahl(calcResults.phiFinal, 2)}</span>
          <span className="text-[10px] text-text-main/60 block">Ec,eff = {formatDeZahl(calcResults.EcEff / 1000, 1)} GPa</span>
        </div>
      </div>
    </div>
  );
}

export default function Betonkennwerte() {
  const [activeTab, setActiveTab] = useState<'rechner' | 'tabelle' | 'zeit_theorie' | 'praxis' | 'ausblick2025' | 'test'>('rechner');

  // Interactive Calculator State
  const [selectedClassIdx, setSelectedClassIdx] = useState<number>(4); // C30/37 (Default)
  const [cementClass, setCementClass] = useState<'S' | 'N' | 'R'>('N');
  const [aggregateType, setAggregateType] = useState<'quarzit' | 'kalkstein' | 'sandstein' | 'basalt'>('quarzit');
  const [relativeHumidity, setRelativeHumidity] = useState<number>(65); // %
  const [areaAc, setAreaAc] = useState<number>(0.20); // m²
  const [perimeterU, setPerimeterU] = useState<number>(1.8); // m
  const [elementHeightH, setElementHeightH] = useState<number>(300); // mm (für Biegezug f_ctm,fl)
  const [curingDaysTs, setCuringDaysTs] = useState<number>(3); // d
  const [loadingAgeT0, setLoadingAgeT0] = useState<number>(28); // d
  const [targetAgeT, setTargetAgeT] = useState<number>(18250); // 50 Jahre (18250 d)
  const [ambientTempT, setAmbientTempT] = useState<number>(20); // °C
  const [axialStressSigmaC, setAxialStressSigmaC] = useState<number>(8.0); // MPa
  const [elementLengthL, setElementLengthL] = useState<number>(12.0); // m

  // Quiz state for Tab 5
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  // Selected base class
  const baseConcrete = EC2_CONCRETE_CLASSES[selectedClassIdx];

  // ----------------------------------------------------------------------
  // DETERMINISTISCHE FORMELBERECHNUNG NACH DER REFERENZ-FORMELSAMMLUNG
  // (DIN EN 1992-1-1:2011-01 in Verbindung mit DIN EN 1992-1-1/NA:2013-04)
  // ----------------------------------------------------------------------
  const calcResults = useMemo(() => {
    const fck = baseConcrete.fck;
    
    // 1. Druckfestigkeit (Abschnitt 3.1.2 & 3.1.6)
    // f_cm = f_ck + 8 [MPa]
    const fcm = fck + 8;
    
    // Bemessungswert f_cd nach deutschem NA (alpha_cc = 0.85, gamma_c = 1.50)
    const alphaCc = 0.85;
    const gammaC = 1.50;
    const fcd = (alphaCc * fck) / gammaC;

    // Zementkoeffizient s für Festigkeitsentwicklung (Gl. 3.2):
    // 0.20 für Klasse R, 0.25 für Klasse N, 0.38 für Klasse S
    let s = 0.25;
    if (cementClass === 'S') s = 0.38;
    else if (cementClass === 'R') s = 0.20;

    // Temperaturkorrektur für Betonalter nach Anhang B.3:
    // t_T = sum( exp[ - (4000 / (273 + T) - 13.65) ] * delta_t )
    const tempFactor = Math.exp(-((4000 / (273 + ambientTempT)) - 13.65));
    const t0Temp = Math.max(0.1, loadingAgeT0 * tempFactor);
    const tTemp = Math.max(0.1, targetAgeT * tempFactor);

    // Festigkeitsentwicklung f_cm(t) = beta_cc(t) * f_cm
    const betaCcT0 = Math.exp(s * (1 - Math.sqrt(28 / t0Temp)));
    const fcmT0 = betaCcT0 * fcm;
    const fckT0 = Math.max(0, fcmT0 - 8);

    const betaCcT = Math.exp(s * (1 - Math.sqrt(28 / tTemp)));
    const fcmT = betaCcT * fcm;
    const fckT = Math.max(0, fcmT - 8);

    // 2. Zugfestigkeit (Abschnitt 3.1.2, 3.1.6 & 3.1.8)
    // f_ctm nach Tabelle 3.1:
    let fctm = 0;
    if (fck <= 50) {
      fctm = 0.30 * Math.pow(fck, 2 / 3);
    } else {
      fctm = 2.12 * Math.log(1 + fcm / 10);
    }
    const fctk005 = 0.70 * fctm;
    const fctk095 = 1.30 * fctm;
    const alphaCt = 0.85;
    const fctd = (alphaCt * fctk005) / gammaC;

    // Biegezugfestigkeit f_ctm,fl nach Gl. (3.23) mit h in mm
    const hMm = Math.max(50, elementHeightH);
    const scaleFactor = Math.max(1.0, 1.6 - hMm / 1000);
    const fctmFl = scaleFactor * fctm;

    // Spaltzugfestigkeit f_ct,sp nach Gl. (3.3): f_ctm ~ 0.90 * f_ct,sp
    const fctSp = fctm / 0.90;

    // Zeitliche Entwicklung der Zugfestigkeit nach Gl. (3.4):
    // f_ctm(t) = (beta_cc(t))^alpha * f_ctm mit alpha = 1.0 für t < 28 d, alpha = 2/3 für t >= 28 d
    const alphaExponent = targetAgeT < 28 ? 1.0 : (2 / 3);
    const fctmT = Math.pow(betaCcT, alphaExponent) * fctm;

    // 3. Elastizitätsmodul, Querdehnzahl & Schubmodul (Abschnitt 3.1.3)
    let alphaE = 1.0;
    if (aggregateType === 'basalt') alphaE = 1.2;
    else if (aggregateType === 'kalkstein') alphaE = 0.9;
    else if (aggregateType === 'sandstein') alphaE = 0.7;

    const Ecm = 22000 * Math.pow(fcm / 10, 0.3) * alphaE; // MPa
    const Ec0 = 1.05 * Ecm; // Tangentenmodul im Ursprung (Gl. Abs. 3.1.4(2))
    const EcmT0 = Math.pow(betaCcT0, 0.3) * Ecm; // E_cm(t0) nach Gl. (3.5)
    const EcmT = Math.pow(betaCcT, 0.3) * Ecm;   // E_cm(t) nach Gl. (3.5)

    // Schubmodul G_cm mit Querdehnzahl nu = 0.20 (ungerissen)
    const nuUngerissen = 0.20;
    const Gcm = Ecm / (2 * (1 + nuUngerissen)); // ~ 0.417 * E_cm

    // 4. Spannungs-Dehnungs-Linie Kennwerte (Abschnitt 3.1.5 & 3.1.7)
    // Dehnung bei Höchstspannung eps_c1 nach Tab. 3.1
    const epsC1 = Math.min(2.8, 0.7 * Math.pow(fcm, 0.31)); // ‰
    let epsCu1 = 3.5; // ‰
    if (fck > 50) {
      epsCu1 = 2.8 + 27 * Math.pow((98 - fcm) / 100, 4);
    }
    const kPlastizitaet = (1.05 * Ecm * (epsC1 / 1000)) / (fcm / 1000); // Gl. 3.14

    // Parabel-Rechteck Kennwerte nach Tab. 3.1
    let epsC2 = 2.0;
    let epsCu2 = 3.5;
    let exponentN = 2.0;
    if (fck > 50) {
      epsC2 = 2.0 + 0.085 * Math.pow(fck - 50, 0.53);
      epsCu2 = 2.6 + 35 * Math.pow((90 - fck) / 100, 4);
      exponentN = 1.4 + 23.4 * Math.pow((90 - fck) / 100, 4);
    }

    // 5. Schwinden des Betons (Abschnitt 3.1.4 & Anhang B.2)
    // Wirksame Bauteildicke h_0 = 2 * Ac / u in mm (Gl. 3.6)
    const AcMm2 = Math.max(0.001, areaAc) * 1e6;
    const uMm = Math.max(0.01, perimeterU) * 1e3;
    const h0 = Math.min(1500, Math.max(20, (2 * AcMm2) / uMm));

    // Autogenes Schwinden eps_ca(t) (Gl. 3.11 - 3.13)
    const epsCaInfty = 2.5 * Math.max(0, fck - 10) * 1e-6;
    const betaAs = 1 - Math.exp(-0.2 * Math.sqrt(Math.max(0, targetAgeT)));
    const epsCa = betaAs * epsCaInfty;

    // Trocknungsschwinden eps_cd(t, ts) (Gl. 3.9, 3.10 & B.11, B.12)
    let alphaDs1 = 4;
    let alphaDs2 = 0.12;
    if (cementClass === 'S') { alphaDs1 = 3; alphaDs2 = 0.13; }
    else if (cementClass === 'R') { alphaDs1 = 6; alphaDs2 = 0.11; }

    const RH = Math.min(100, Math.max(20, relativeHumidity));
    const betaRH = 1.55 * (1 - Math.pow(RH / 100, 3));
    const epsCd0 = 0.85 * ((220 + 110 * alphaDs1) * Math.exp(-alphaDs2 * (fcm / 10))) * 1e-6 * betaRH;

    // Geometriebeiwert k_h (Tabelle 3.3)
    let kh = 1.0;
    if (h0 <= 100) kh = 1.0;
    else if (h0 <= 200) kh = 1.0 - ((h0 - 100) / 100) * 0.15;
    else if (h0 <= 300) kh = 0.85 - ((h0 - 200) / 100) * 0.10;
    else if (h0 <= 500) kh = 0.75 - ((h0 - 300) / 200) * 0.05;
    else kh = 0.70;

    const deltaTds = Math.max(0, targetAgeT - curingDaysTs);
    const betaDs = deltaTds / (deltaTds + 0.04 * Math.sqrt(Math.pow(h0, 3)));
    const epsCd = betaDs * kh * epsCd0;

    // Gesamtschwinden eps_cs
    const epsCs = epsCd + epsCa;
    const deltaLShrinkMm = epsCs * (elementLengthL * 1000);

    // 6. Kriechen des Betons (Abschnitt 3.1.4 & Anhang B.1)
    // Feuchtebeiwert phi_RH
    let phiRH = 1.0;
    let alpha1 = 1.0;
    let alpha2 = 1.0;
    let alpha3 = 1.0;
    if (fcm <= 35) {
      phiRH = 1 + (1 - RH / 100) / (0.10 * Math.cbrt(h0));
    } else {
      alpha1 = Math.pow(35 / fcm, 0.7);
      alpha2 = Math.pow(35 / fcm, 0.2);
      alpha3 = Math.pow(35 / fcm, 0.5);
      phiRH = (1 + ((1 - RH / 100) / (0.10 * Math.cbrt(h0))) * alpha1) * alpha2;
    }

    const betaFcm = 16.8 / Math.sqrt(Math.max(1, fcm));

    // Modifiziertes Belastungsalter t_0,eff nach Gl. B.9 & B.10
    let alphaCementMod = 0;
    if (cementClass === 'S') alphaCementMod = -1;
    else if (cementClass === 'R') alphaCementMod = 1;

    const t0Eff = Math.max(
      0.5,
      t0Temp * Math.pow((9 / (2 + Math.pow(t0Temp, 1.2))) + 1, alphaCementMod)
    );
    const betaT0 = 1 / (0.1 + Math.pow(t0Eff, 0.20));

    // Grundkriechzahl phi_0
    const phi0 = phiRH * betaFcm * betaT0;

    // Zeitverlauf des Kriechens beta_c(t, t0) (Gl. B.7 & B.8)
    let betaH = 1.5 * (1 + Math.pow(0.012 * RH, 18)) * h0 + 250;
    if (fcm <= 35) {
      betaH = Math.min(1500, betaH);
    } else {
      betaH = Math.min(1500 * alpha3, 1.5 * (1 + Math.pow(0.012 * RH, 18)) * h0 + 250 * alpha3);
    }

    const deltaTcreep = Math.max(0, targetAgeT - loadingAgeT0);
    const betaC = Math.pow(deltaTcreep / (betaH + deltaTcreep), 0.3);
    const phiLinear = phi0 * betaC;

    // Nichtlineares Kriechen bei hohen Spannungen:
    // 0.45 * fck(t0) < sigma_c <= 0.60 * fck(t0) nach Gl. (3.7)
    // k_sigma = sigma_c / fck(t0)
    const stressLimitLin = 0.45 * fckT0;
    const stressLimitMax = 0.60 * fckT0;
    const isNonlinearCreep = axialStressSigmaC > stressLimitLin;
    
    let kSigma = 0;
    let phiFinal = phiLinear;
    if (fckT0 > 0) {
      kSigma = axialStressSigmaC / fckT0;
      if (isNonlinearCreep) {
        // Exponentielle Vergrößerung nach Gl. (3.7): phi_k = phi * exp( 1.5 * (k_sigma - 0.45) )
        phiFinal = phiLinear * Math.exp(1.5 * (kSigma - 0.45));
      }
    }

    // Kriechdehnung eps_cc nach Abschnitt 6:
    // eps_cc = phi * sigma_c / E_c = phi * sigma_c / (1.05 * E_cm)
    const epsCc = (phiFinal * axialStressSigmaC) / Ec0;
    const deltaLCreepMm = epsCc * (elementLengthL * 1000);

    // Effektiver E-Modul für Langzeitverformungen (Abs. 7.4.3, Gl. 7.20):
    // E_c,eff = E_cm / (1 + phi)
    const EcEff = Ecm / (1 + phiFinal);

    // Relaxierter Modul für Zwangsbeanspruchungen (rho ~ 0.8):
    const rhoRelax = 0.80;
    const EcEffZwang = Ecm / (1 + rhoRelax * phiFinal);

    // 8. 2. Generation EC2 (DIN EN 1992-1-1:2025-09) Vorab-Berechnung
    const kE2025 = 9500;
    const Ecm2025 = kE2025 * Math.pow(fcm, 1 / 3); // MPa
    const etaFc2025 = Math.min(1.0, Math.pow(40 / Math.max(1, fck), 1 / 3));

    return {
      fck,
      fcm,
      fcd,
      s,
      betaCcT0,
      fcmT0,
      fckT0,
      betaCcT,
      fcmT,
      fckT,
      fctm,
      fctk005,
      fctk095,
      fctd,
      fctmFl,
      fctSp,
      fctmT,
      alphaE,
      Ecm,
      Ec0,
      EcmT0,
      EcmT,
      Gcm,
      epsC1,
      epsCu1,
      kPlastizitaet,
      epsC2,
      epsCu2,
      exponentN,
      h0,
      kh,
      epsCd0,
      epsCd,
      epsCa,
      epsCs,
      deltaLShrinkMm,
      phi0,
      phiLinear,
      phiFinal,
      isNonlinearCreep,
      stressLimitLin,
      stressLimitMax,
      kSigma,
      epsCc,
      deltaLCreepMm,
      EcEff,
      EcEffZwang,
      Ecm2025,
      etaFc2025
    };
  }, [selectedClassIdx, cementClass, aggregateType, relativeHumidity, areaAc, perimeterU, elementHeightH, curingDaysTs, loadingAgeT0, targetAgeT, ambientTempT, axialStressSigmaC, elementLengthL, baseConcrete]);

  // Quiz-Fragen zur Überprüfung (Stufe 4 des Lehrpfads)
  const QUIZ_ITEMS = [
    {
      q: 'Aus welcher einzigen primären Eingangsgröße leitet Eurocode 2 (DIN EN 1992-1-1) sämtliche mechanischen Kennwerte für Normalbeton ab?',
      options: [
        'Aus dem Zementgehalt in kg/m³.',
        'Aus der 28-Tage-Zylinderdruckfestigkeit fck (in MPa bzw. N/mm²).',
        'Aus der Frischbetonkonsistenz (Ausbreitmaß).',
        'Aus dem statischen Elastizitätsmodul Ecm.'
      ],
      correct: 1,
      feedback: 'Vollkommen richtig! Wie in Abschnitt 1 der Norm und Formelsammlung definiert, basieren alle Kennwerte (fcm, fcd, fctm, Ecm, Dehnungen, Kriech- und Schwindbeiwerte) auf der 28-Tage-Zylinderdruckfestigkeit fck.'
    },
    {
      q: 'Welche Gleichung gilt nach EC2 Gl. (3.7) für das nichtlineare Kriechen, wenn die Dauerspannung σc den Grenzwert 0,45·fck(t₀) übersteigt?',
      options: [
        'φk(t, t0) = φ(t, t0) · (1 + k_sigma)',
        'φk(t, t0) = φ(t, t0) · exp( 1,5 · (k_sigma - 0,45) ) mit k_sigma = σc / fck(t0)',
        'φk(t, t0) = φ(t, t0) / 0,45',
        'Die Kriechzahl verdoppelt sich pauschal um den Faktor 2,0.'
      ],
      correct: 1,
      feedback: 'Exakt! Nach EC2 Abschnitt 3.1.4(4) und Gl. (3.7) führt eine hohe Beanspruchung zu Gefügemikrorissen, die die Kriechzahl über die Exponentialfunktion exp[1,5·(k_sigma - 0,45)] vergrößern.'
    },
    {
      q: 'Welcher Gesteinsbeiwert αE ist nach Tabelle 3.1 für quarzitische Gesteinskörnung bzw. für Sandstein anzusetzen?',
      options: [
        'Quarzit: αE = 1,2 ; Sandstein: αE = 1,0',
        'Quarzit: αE = 1,0 ; Sandstein: αE = 0,7 (-30 % Steifigkeit)',
        'Quarzit: αE = 0,9 ; Sandstein: αE = 1,2 (+20 % Steifigkeit)',
        'Alle Gesteinsarten haben nach Eurocode 2 denselben E-Modul (αE = 1,0).'
      ],
      correct: 1,
      feedback: 'Richtig! Quarzit bildet den Standardwert mit αE = 1,0. Sandstein weist infolge hoher Kornporosität eine um 30 % geringere Steifigkeit auf (αE = 0,7), während Basalt den E-Modul um ca. +20 % steigert (αE = 1,2).'
    },
    {
      q: 'Wie berechnet sich der effektive Elastizitätsmodul für Langzeitverformungen nach EC2 Abs. 7.4.3 (Gl. 7.20)?',
      options: [
        'Ec,eff = Ecm · (1 - φ)',
        'Ec,eff = Ecm / (1 + φ(t, t0))',
        'Ec,eff = Ecm · φ(t, t0)',
        'Ec,eff = 1,05 · Ecm / (1 + 2·φ)'
      ],
      correct: 1,
      feedback: 'Richtig! Durch das Kriechen nimmt die elastische Ersatzsteifigkeit um den Faktor (1 + φ) ab: Ec,eff = Ecm / (1 + φ(t, t0)). Für Schwindzwang kann mit dem Relaxationsbeiwert ρ ≈ 0,8 gerechnet werden.'
    }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-2">
      
      {/* 1. Header & Lead Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-home-grau/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-shiraz/10 text-shiraz">
                <Sliders size={22} />
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-text-main">
                Betonkennwerte nach Eurocode 2 (DIN EN 1992-1-1)
              </h2>
            </div>
            <p className="text-xs text-text-main/60 mt-1">
              Vollständige Berechnung mechanischer &amp; zeitabhängiger Parameter nach Abs. 3.1 &amp; Anhang B (inkl. DIN EN 1992-1-1/NA)
            </p>
          </div>
          <div className="flex items-center gap-2 bg-off-white px-3 py-1.5 rounded-xl border border-home-grau/25 text-xs">
            <span className="font-bold text-slate-700">Normengeneration:</span>
            <span className="font-mono text-shiraz font-semibold">EC2 (2011/2013) &amp; EC2 Gen 2 (2025)</span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Die Berechnung sämtlicher Kennwerte für Normalbeton (<strong>C12/15 bis C100/115</strong>) basiert im Eurocode 2 auf einer einzigen primären Eingangsgröße: der <strong>charakteristischen 28-Tage-Zylinderdruckfestigkeit <InlineMath math="f_{ck}" /></strong>. Dieses Modul implementiert die vollständige Gleichungsfolge der bauaufsichtlich eingeführten Normengeneration (DIN EN 1992-1-1 mit NA) für Tragfähigkeits- und Gebrauchstauglichkeitsnachweise (GZT/GZG) sowie zeitabhängige Verformungen aus Schwinden und Kriechen.
          </p>
        </div>

        {/* 4-Stufen-Lehrpfad Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-4 mt-2">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'rechner' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('rechner')}
          >
            <Calculator size={15} /> 1. Interaktiver Kennwertrechner
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'tabelle' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('tabelle')}
          >
            <BookOpen size={15} /> 2. EC2 Tabelle 3.1 Matrix
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'zeit_theorie' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('zeit_theorie')}
          >
            <Activity size={15} /> 3. Zeitverläufe &amp; Theorie
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <ShieldCheck size={15} /> 4. Ingenieurpraxis &amp; GZG
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'ausblick2025' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('ausblick2025')}
          >
            <Sparkles size={15} /> 5. Neuerungen EC2 Gen 2 (2025)
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'test' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('test')}
          >
            <CheckCircle2 size={15} /> 6. Wissenstest
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: INTERAKTIVER EC2 KENNWERTRECHNER                               */}
      {/* ===================================================================== */}
      {activeTab === 'rechner' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          
          {/* Eingabe-Steuerung Dashboard */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Sliders size={18} className="text-shiraz" />
              1. Parameter der Formelsammlung einstellen (Abschnitt 1 – 6)
            </h3>

            {/* Interaktive Systemskizze aller Formelsammlungs-Parameter */}
            <Ec2ParameterSkizze
              baseConcrete={baseConcrete}
              calcResults={calcResults}
              cementClass={cementClass}
              aggregateType={aggregateType}
              relativeHumidity={relativeHumidity}
              areaAc={areaAc}
              perimeterU={perimeterU}
              loadingAgeT0={loadingAgeT0}
              curingDaysTs={curingDaysTs}
              targetAgeT={targetAgeT}
              axialStressSigmaC={axialStressSigmaC}
              ambientTempT={ambientTempT}
              elementHeightH={elementHeightH}
              elementLengthL={elementLengthL}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Betonklasse */}
              <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
                <label className="text-xs font-bold text-slate-700">Betonfestigkeitsklasse</label>
                <select 
                  className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-bold text-shiraz focus:ring-1 focus:ring-shiraz"
                  value={selectedClassIdx}
                  onChange={(e) => setSelectedClassIdx(Number(e.target.value))}
                >
                  {EC2_CONCRETE_CLASSES.map((c, idx) => (
                    <option key={c.name} value={idx}>
                      {c.name} (f_ck = {formatDeWert(c.fck)} MPa, Würfel = {formatDeWert(c.fckCube)} MPa)
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500">
                  {baseConcrete.fck <= 50 ? 'Normalbeton (≤ C50/60)' : 'Hochfester Beton (> C50/60)'}
                </span>
              </div>

              {/* Zementklasse */}
              <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
                <label className="text-xs font-bold text-slate-700">Zementbeiwert s (Abschnitt 1)</label>
                <select 
                  className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-shiraz"
                  value={cementClass}
                  onChange={(e) => setCementClass(e.target.value as any)}
                >
                  <option value="S">Klasse S (s = 0,38 - CEM 32,5 N)</option>
                  <option value="N">Klasse N (s = 0,25 - CEM 32,5 R, CEM 42,5 N)</option>
                  <option value="R">Klasse R (s = 0,20 - CEM 42,5 R, CEM 52,5 N/R)</option>
                </select>
                <span className="text-[10px] text-slate-500">Steuert β_cc(t), Schwindbeiwerte α_ds1/2 &amp; t_0,eff</span>
              </div>

              {/* Gesteinskörnung */}
              <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
                <label className="text-xs font-bold text-slate-700">Gesteinskörnung α_E (Abschnitt 3)</label>
                <select 
                  className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-shiraz"
                  value={aggregateType}
                  onChange={(e) => setAggregateType(e.target.value as any)}
                >
                  <option value="quarzit">Quarzit (α_E = 1,00 - Regelfall)</option>
                  <option value="kalkstein">Kalkstein (α_E = 0,90; -10 %)</option>
                  <option value="sandstein">Sandstein (α_E = 0,70; -30 %)</option>
                  <option value="basalt">Basalt / dichter Kalkstein (α_E = 1,20; +20 %)</option>
                </select>
                <span className="text-[10px] text-slate-500">E_cm = 22.000 · (f_cm/10)^0,3 · α_E [MPa]</span>
              </div>

              {/* Relative Luftfeuchte */}
              <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Luftfeuchte RH (Abschnitt 5 &amp; 6)</label>
                  <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(relativeHumidity)} %</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  step="5"
                  value={relativeHumidity}
                  onChange={(e) => setRelativeHumidity(Number(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Innenraum ~50 %, feuchtes Freiland ~80 %</span>
              </div>

              {/* Querschnittsfläche Ac */}
              <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
                <label className="text-xs font-bold text-slate-700">Querschnittsfläche A_c [m²]</label>
                <input 
                  type="number" 
                  step="0.05"
                  min="0.01"
                  max="10.0"
                  value={areaAc}
                  onChange={(e) => setAreaAc(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                  className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-slate-500">Betonfläche für wirksame Dicke h₀</span>
              </div>

              {/* Trocknender Umfang u */}
              <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
                <label className="text-xs font-bold text-slate-700">Umfang u (Austrocknung) [m]</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  max="30.0"
                  value={perimeterU}
                  onChange={(e) => setPerimeterU(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-slate-500">
                  h₀ = 2·Ac/u = <strong>{formatDeZahl(calcResults.h0, 0)} mm</strong> (kh = {formatDeZahl(calcResults.kh, 2)})
                </span>
              </div>

              {/* Belastungsalter t0, Nachbehandlung ts & Temperatur */}
              <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
                <label className="text-xs font-bold text-slate-700">Erstbelastung t₀ / Nachbeh. ts [d]</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    min="1" 
                    max="365"
                    value={loadingAgeT0}
                    onChange={(e) => setLoadingAgeT0(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-1/2 bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
                    title="Alter bei Erstbelastung t0 in Tagen"
                  />
                  <input 
                    type="number" 
                    min="1" 
                    max="30"
                    value={curingDaysTs}
                    onChange={(e) => setCuringDaysTs(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-1/2 bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
                    title="Ende der Nachbehandlung ts in Tagen"
                  />
                </div>
                <span className="text-[10px] text-slate-500">t₀ = {formatDeWert(loadingAgeT0)} d (Last), ts = {formatDeWert(curingDaysTs)} d (Curing)</span>
              </div>

              {/* Einwirkende Dauerspannung σ_c */}
              <div className="flex flex-col gap-1.5 bg-off-white p-3.5 rounded-xl border border-home-grau/25">
                <label className="text-xs font-bold text-slate-700">Dauerspannung σ_c [MPa]</label>
                <input 
                  type="number" 
                  step="0.5"
                  min="0"
                  max="60"
                  value={axialStressSigmaC}
                  onChange={(e) => setAxialStressSigmaC(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="bg-white border border-home-grau/40 rounded-lg p-2 text-xs font-mono font-bold"
                />
                <span className={`text-[10px] ${calcResults.isNonlinearCreep ? 'text-amber-800 font-bold' : 'text-slate-500'}`}>
                  Grenzspannung linear: 0,45·fck(t₀) = {formatDeZahl(calcResults.stressLimitLin, 1)} MPa
                </span>
              </div>

            </div>

            {/* Zusätzliche Zeile: Bauteilhöhe für Biegezug & Umgebungstemperatur */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-home-grau/15">
              <div className="flex items-center justify-between bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-xs">
                <span className="text-slate-700 font-medium">Bauteildicke h (Biegezug f_ctm,fl):</span>
                <div className="flex items-center gap-1.5">
                  <input 
                    type="number" 
                    min="50" 
                    max="3000" 
                    step="50" 
                    value={elementHeightH} 
                    onChange={(e) => setElementHeightH(Math.max(50, parseInt(e.target.value) || 50))}
                    className="w-20 bg-white border border-home-grau/40 rounded p-1 text-xs font-mono font-bold text-right"
                  />
                  <span className="text-slate-500">mm</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-xs">
                <span className="text-slate-700 font-medium">Umgebungstemperatur T (Anhang B.3):</span>
                <div className="flex items-center gap-1.5">
                  <input 
                    type="number" 
                    min="-10" 
                    max="60" 
                    step="1" 
                    value={ambientTempT} 
                    onChange={(e) => setAmbientTempT(parseInt(e.target.value) || 20)}
                    className="w-16 bg-white border border-home-grau/40 rounded p-1 text-xs font-mono font-bold text-right"
                  />
                  <span className="text-slate-500">°C</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-xs">
                <span className="text-slate-700 font-medium">Bauteillänge L (Längenverkürzung):</span>
                <div className="flex items-center gap-1.5">
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    step="1" 
                    value={elementLengthL} 
                    onChange={(e) => setElementLengthL(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-16 bg-white border border-home-grau/40 rounded p-1 text-xs font-mono font-bold text-right"
                  />
                  <span className="text-slate-500">m</span>
                </div>
              </div>
            </div>

          </div>

          {/* Warnmeldung: Nichtlineares Kriechen nach Gl. 3.7 */}
          {calcResults.isNonlinearCreep && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start gap-3 shadow-xs">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Nachweis nach EC2 Abschnitt 3.1.4(4) &amp; Gl. (3.7): Nichtlineares Kriechen aktiv!</strong>
                <p className="mt-1">
                  Die einwirkende Dauerdruckspannung <InlineMath math={`\\sigma_c = ${formatDeZahl(axialStressSigmaC, 1)}\\text{ MPa}`} /> liegt über der Linearitätsgrenze von <InlineMath math={`0{,}45 \\cdot f_{ck}(t_0) = ${formatDeZahl(calcResults.stressLimitLin, 1)}\\text{ MPa}`} /> (mit <InlineMath math={`k_\\sigma = \\sigma_c / f_{ck}(t_0) = ${formatDeZahl(calcResults.kSigma, 2)}`} />). Die Kriechzahl vergrößert sich exponentiell:
                </p>
                <div className="mt-2 font-mono font-bold bg-white/80 p-2 rounded border border-amber-200 inline-block">
                  <InlineMath math={`\\varphi_k(t, t_0) = \\varphi(t, t_0) \\cdot \\exp\\left(1{,}5 \\cdot (k_\\sigma - 0{,}45)\\right) = ${formatDeZahl(calcResults.phiLinear, 2)} \\cdot \\exp(${formatDeZahl(1.5 * (calcResults.kSigma - 0.45), 3)}) = ${formatDeZahl(calcResults.phiFinal, 2)}`} />
                </div>
              </div>
            </div>
          )}

          {/* 4 Primäre Ergebnisblöcke der Formelsammlung */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* BLOCK 1: DRUCKFESTIGKEIT (Abschnitt 1) */}
            <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-home-grau/20 mb-2.5">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Scale size={14} className="text-shiraz" /> 1. Druckfestigkeit
                  </span>
                  <span className="text-[10px] font-mono bg-shiraz/10 text-shiraz px-1.5 py-0.2 rounded font-bold">
                    {baseConcrete.name}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Zylinder <InlineMath math="f_{ck}" /> (28 d):</span>
                    <strong className="font-mono text-slate-900">{formatDeWert(calcResults.fck)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Würfel <InlineMath math="f_{ck,\text{cube}}" />:</span>
                    <strong className="font-mono text-slate-900">{formatDeWert(baseConcrete.fckCube)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Mittelwert <InlineMath math="f_{cm} = f_{ck} + 8" />:</span>
                    <strong className="font-mono text-slate-900">{formatDeWert(calcResults.fcm)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100 bg-emerald-50/60 px-1 rounded">
                    <span className="text-emerald-950 font-bold">Bemessung <InlineMath math="f_{cd} = \frac{\alpha_{cc} f_{ck}}{\gamma_c}" />:</span>
                    <strong className="font-mono text-emerald-800">{formatDeZahl(calcResults.fcd, 2)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Festigkeit bei <InlineMath math="t_0" /> (<InlineMath math="f_{cm}(t_0)" />):</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fcmT0, 1)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Zylinder bei <InlineMath math="t_0" /> (<InlineMath math="f_{ck}(t_0)" />):</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fckT0, 1)} MPa</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                <InlineMath math="\alpha_{cc} = 0{,}85" /> (NA-DE), <InlineMath math="\gamma_c = 1{,}50" />
              </div>
            </div>

            {/* BLOCK 2: ZUGFESTIGKEIT (Abschnitt 2) */}
            <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-home-grau/20 mb-2.5">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <GitCommit size={14} className="text-blue-600" /> 2. Zugfestigkeit
                  </span>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-bold">
                    Gl. 3.2 – 3.23
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Mittelwert <InlineMath math="f_{ctm}" />:</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fctm, 2)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">5%-Fraktil <InlineMath math="f_{ctk;0{,}05}" />:</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fctk005, 2)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">95%-Fraktil <InlineMath math="f_{ctk;0{,}95}" />:</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fctk095, 2)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100 bg-blue-50/60 px-1 rounded">
                    <span className="text-blue-950 font-bold">Bemessung <InlineMath math="f_{ctd}" />:</span>
                    <strong className="font-mono text-blue-900">{formatDeZahl(calcResults.fctd, 2)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Biegezug <InlineMath math="f_{ctm,fl}" /> ({formatDeWert(elementHeightH)} mm):</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fctmFl, 2)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Spaltzug <InlineMath math="f_{ct,sp} \approx \frac{f_{ctm}}{0{,}9}" />:</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.fctSp, 2)} MPa</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                <InlineMath math="\alpha_{ct} = 0{,}85" /> (NA-DE), <InlineMath math="\gamma_c = 1{,}50" />
              </div>
            </div>

            {/* BLOCK 3: E-MODUL & STEIFIGKEIT (Abschnitt 3) */}
            <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-home-grau/20 mb-2.5">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Compass size={14} className="text-indigo-600" /> 3. E-Modul &amp; Steifigkeit
                  </span>
                  <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-bold">
                    α_E = {formatDeZahl(calcResults.alphaE, 2)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Sekantenmodul <InlineMath math="E_{cm}" /> (28 d):</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.Ecm, 0)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Tangentenmodul <InlineMath math="E_c = 1{,}05 E_{cm}" />:</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.Ec0, 0)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">E-Modul bei <InlineMath math="t_0" /> (<InlineMath math="E_{cm}(t_0)" />):</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.EcmT0, 0)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Schubmodul <InlineMath math="G_{cm}" /> (<InlineMath math="\nu = 0{,}2" />):</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.Gcm, 0)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100 bg-indigo-50/60 px-1 rounded">
                    <span className="text-indigo-950 font-bold">Eff. Kriechmodul <InlineMath math="E_{c,\text{eff}}" />:</span>
                    <strong className="font-mono text-indigo-900 font-bold">{formatDeZahl(calcResults.EcEff, 0)} MPa</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Zwang-Relaxiert (<InlineMath math="\rho = 0{,}8" />):</span>
                    <strong className="font-mono text-indigo-900">{formatDeZahl(calcResults.EcEffZwang, 0)} MPa</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                Wärmedehnung: <InlineMath math="\alpha_T = 10 \cdot 10^{-6}\text{ K}^{-1}" />
              </div>
            </div>

            {/* BLOCK 4: SCHWINDEN & KRIECHEN (Abschnitt 5 & 6) */}
            <div className="bg-white p-4 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-home-grau/20 mb-2.5">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <TrendingDown size={14} className="text-rose-600" /> 4. Schwinden &amp; Kriechen
                  </span>
                  <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded font-bold">
                    Anhang B
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Trocknungsschwinden <InlineMath math="\varepsilon_{cd}" />:</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.epsCd * 1000, 3)} ‰</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Autogenes Schwinden <InlineMath math="\varepsilon_{ca}" />:</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.epsCa * 1000, 3)} ‰</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100 bg-rose-50/60 px-1 rounded">
                    <span className="text-rose-950 font-bold">Gesamtschwinden <InlineMath math="\varepsilon_{cs}" />:</span>
                    <strong className="font-mono text-rose-800 font-bold">{formatDeZahl(calcResults.epsCs * 1000, 3)} ‰</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Grundkriechzahl <InlineMath math="\varphi_0" />:</span>
                    <strong className="font-mono text-slate-900">{formatDeZahl(calcResults.phi0, 2)}</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100 bg-amber-50/60 px-1 rounded">
                    <span className="text-amber-950 font-bold">Kriechzahl <InlineMath math="\varphi(t, t_0)" />:</span>
                    <strong className="font-mono text-amber-900 font-bold">{formatDeZahl(calcResults.phiFinal, 2)}</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">Verkürzung ({formatDeWert(elementLengthL)} m gesamt):</span>
                    <strong className="font-mono text-slate-900">ΔL = -{formatDeZahl(calcResults.deltaLShrinkMm + calcResults.deltaLCreepMm, 2)} mm</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                Schwindanteil: -{formatDeZahl(calcResults.deltaLShrinkMm, 2)} mm | Kriechanteil: -{formatDeZahl(calcResults.deltaLCreepMm, 2)} mm
              </div>
            </div>

          </div>

          {/* Formel-Herleitungsbox für Schwinden & Kriechen nach EC2 */}
          <FormulaDerivationBox
            title="Normative Herleitung: Schwind- und Kriechmodell nach EC2 Anhang B"
            zielGleichung="\varepsilon_{cs}(t, t_s) = \varepsilon_{cd}(t, t_s) + \varepsilon_{ca}(t), \quad \varphi(t, t_0) = \varphi_0 \cdot \beta_c(t, t_0)"
            normQuelle="DIN EN 1992-1-1:2011-01 (Abschnitt 3.1.4 & Anhang B)"
            schritte={[
              {
                titel: "1. Trocknungsschwinden und wirksame Bauteildicke",
                formel: "h_0 = \\frac{2 \\cdot A_c}{u}, \\quad \\varepsilon_{cd}(t, t_s) = \\beta_{ds}(t, t_s) \\cdot k_h \\cdot \\varepsilon_{cd,0}",
                erklaerung: "Das Trocknungsschwinden beschreibt den kapillaren Feuchtigkeitsverlust an die Umgebungsatmosphäre. k_h berücksichtigt die Verlangsamung bei größerem Diffusionsweg (h_0)."
              },
              {
                titel: "2. Autogenes Schwinden (Selbstaustrocknung)",
                formel: "\\varepsilon_{ca}(t) = \\beta_{as}(t) \\cdot 2{,}5 \\cdot (f_{ck} - 10) \\cdot 10^{-6}, \\quad \\beta_{as}(t) = 1 - \\exp(-0{,}2 \\cdot t^{0{,}5})",
                erklaerung: "Infolge der chemischen Hydratationskontraktion (Le-Chatelier-Effekt) verzehren C-S-H-Phasen Porenwasser. Bei hochfestem Beton mit geringem w/z-Wert dominiert diese Komponente."
              },
              {
                titel: "3. Kriechzahl und Feuchteeinfluss",
                formel: "\\varphi_0 = \\varphi_{RH} \\cdot \\beta(f_{cm}) \\cdot \\beta(t_0) = \\left[1 + \\frac{1 - RH/100}{0{,}10 \\cdot \\sqrt[3]{h_0}}\\right] \\cdot \\frac{16{,}8}{\\sqrt{f_{cm}}} \\cdot \\frac{1}{0{,}1 + t_{0,\\text{eff}}^{0{,}20}}",
                erklaerung: "Kriechen ist viskoses Gleiten der C-S-H-Schichten unter äußerer Dauerlast. Je jünger der Beton bei Erstbelastung (t_0) und je feuchter das Milieu, desto geringer ist die Kriechzahl."
              }
            ]}
          />

        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: VOLLSTÄNDIGE EC2 TABELLE 3.1 MATRIX                            */}
      {/* ===================================================================== */}
      {activeTab === 'tabelle' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-home-grau/20 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  DIN EN 1992-1-1 Tabelle 3.1: Festigkeits- und Verformungseigenschaften
                </h3>
                <p className="text-xs text-slate-500">
                  Vergleichende Übersicht aller 15 genormten Betonfestigkeitsklassen von Normal- bis Ultra-Hochleistungsbeton
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold font-mono">
                  Abschnitt 7 der Formelsammlung
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                    <th className="py-2.5 px-3 font-bold">Klasse</th>
                    <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="f_{ck}" /> [MPa]</th>
                    <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="f_{ck,\text{cube}}" /></th>
                    <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="f_{cm}" /></th>
                    <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="f_{cd}" /> (DE)</th>
                    <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="f_{ctm}" /></th>
                    <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="f_{ctk,0{,}05}" /></th>
                    <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="E_{cm}" /> [GPa]</th>
                    <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="\varepsilon_{c1}" /> [‰]</th>
                    <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="\varepsilon_{cu1}" /> [‰]</th>
                    <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="\varepsilon_{c2}" /> [‰]</th>
                    <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="\varepsilon_{cu2}" /> [‰]</th>
                    <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="n" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {EC2_CONCRETE_CLASSES.map((c, idx) => {
                    const isSelected = idx === selectedClassIdx;
                    const isHighStrength = c.fck > 50;
                    const fcdVal = (0.85 * c.fck) / 1.50;

                    return (
                      <tr 
                        key={c.name}
                        onClick={() => setSelectedClassIdx(idx)}
                        className={`cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-shiraz/10 font-semibold' 
                            : isHighStrength 
                              ? 'bg-rose-50/30 hover:bg-rose-50/70' 
                              : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                          {c.name}
                          {isHighStrength && (
                            <span className="text-[9px] bg-rose-200 text-rose-800 px-1 py-0.2 rounded font-extrabold uppercase">
                              HFB
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono text-right text-slate-800">{formatDeWert(c.fck)}</td>
                        <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeWert(c.fckCube)}</td>
                        <td className="py-2 px-3 font-mono text-right text-slate-800">{formatDeWert(c.fcm)}</td>
                        <td className="py-2 px-3 font-mono text-right text-emerald-800 font-bold">{formatDeZahl(fcdVal, 1)}</td>
                        <td className="py-2 px-3 font-mono text-right text-slate-800">{formatDeZahl(c.fctm, 1)}</td>
                        <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeZahl(c.fctk005, 1)}</td>
                        <td className="py-2 px-3 font-mono text-right text-slate-900 font-bold">{formatDeWert(c.Ecm)}</td>
                        <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeZahl(c.epsC1, 2)}</td>
                        <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeZahl(c.epsCu1, 1)}</td>
                        <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeZahl(c.epsC2, 2)}</td>
                        <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeZahl(c.epsCu2, 1)}</td>
                        <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeZahl(c.n, 2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-off-white rounded-xl border border-home-grau/20 text-xs text-slate-600 leading-relaxed">
              <strong>Hinweis zu Hochleistungsbetonen (&gt; C50/60):</strong> Beachten Sie das veränderte Verformungsverhalten. Die Bruchdehnung <InlineMath math="\varepsilon_{cu2}" /> sinkt von 3,5 ‰ kontinuierlich auf bis zu 2,6 ‰ ab (spröderes Bruchverhalten), und der Exponent des Parabel-Rechteck-Diagramms <InlineMath math="n" /> sinkt von 2,0 auf 1,4.
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: THEORETISCHE GRUNDLAGEN & ZEITFUNKTIONEN                       */}
      {/* ===================================================================== */}
      {activeTab === 'zeit_theorie' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Zeitliche Festigkeitsentwicklung */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-shiraz" /> Festigkeitsentwicklung β_cc(t) (Abschnitt 1)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Die Druckfestigkeit wächst mit fortschreitender Zementhydratation. Nach EC2 Abs. 3.1.2 berechnet sich der Mittelwert zum Zeitpunkt <InlineMath math="t" /> [Tage] nach:
                </p>
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/25 text-center my-2 overflow-x-auto">
                  <BlockMath math="f_{cm}(t) = \beta_{cc}(t) \cdot f_{cm}" />
                  <BlockMath math="\beta_{cc}(t) = \exp\left\{ s \cdot \left[1 - \left(\frac{28}{t}\right)^{0{,}5}\right] \right\}" />
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 mt-3">
                  <li>&bull; <strong>s = 0,20:</strong> Klasse R (CEM 42,5 R, CEM 52,5 N/R)</li>
                  <li>&bull; <strong>s = 0,25:</strong> Klasse N (CEM 32,5 R, CEM 42,5 N)</li>
                  <li>&bull; <strong>s = 0,38:</strong> Klasse S (CEM 32,5 N)</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Zeitliche Entwicklung der Zugfestigkeit nach Gl. (3.4): <InlineMath math="f_{ctm}(t) = (\beta_{cc}(t))^{\alpha} \cdot f_{ctm}" /> (<InlineMath math="\alpha = 1{,}0" /> für <InlineMath math="t < 28\text{ d}" />, <InlineMath math="\alpha = 2/3" /> für <InlineMath math="t \ge 28\text{ d}" />).
              </div>
            </div>

            {/* Box 2: Spannungs-Dehnungs-Gesetze */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
                  <Activity size={16} className="text-indigo-600" /> Spannungs-Dehnungs-Linien (Abschnitt 4)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Für die Querschnittsbemessung im Grenzzustand der Tragfähigkeit (GZT) stellt EC2 das <strong>Parabel-Rechteck-Diagramm</strong> bereit (Gl. 3.17 – 3.20):
                </p>
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/25 text-center my-2 overflow-x-auto">
                  <BlockMath math="\sigma_c = \begin{cases} f_{cd} \cdot \left[ 1 - \left(1 - \frac{\varepsilon_c}{\varepsilon_{c2}}\right)^n \right] & \text{für } 0 \le \varepsilon_c \le \varepsilon_{c2} \ f_{cd} & \text{für } \varepsilon_{c2} \le \varepsilon_c \le \varepsilon_{cu2} \end{cases}" />
                </div>
                <div className="text-xs text-slate-700 mt-2">
                  Für Normalbeton gilt: <InlineMath math="\varepsilon_{c2} = 2{,}0\,\text{‰}" />, <InlineMath math="\varepsilon_{cu2} = 3{,}5\,\text{‰}" />, <InlineMath math="n = 2{,}0" /> (reine quadratische Parabel).
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Nichtlineare Beziehung für Verformungsberechnungen (Gl. 3.14): <InlineMath math="\frac{\sigma_c}{f_{cm}} = \frac{k \cdot \eta - \eta^2}{1 + (k - 2) \cdot \eta}" />
              </div>
            </div>

          </div>

          {/* Detaillierter Vergleich der Schwindarten */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h4 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
              <Droplets size={18} className="text-rose-600" />
              Trocknungsschwinden vs. Autogenes Schwinden (Physikalischer Mechanismus)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="block text-slate-900 font-bold mb-1 text-sm">
                  1. Trocknungsschwinden ε_cd(t) (Abschnitt 5)
                </strong>
                <p>
                  Entsteht durch den physikalischen Wasserverlust des Betons an eine ungesättigte Umgebung (relative Luftfeuchte RH &lt; 100 %). Durch das Verdunsten von Meniskuswasser in den Kapillarporen entstehen enorme Kapillarkräfte (Unterdruck), die die Porenwände zusammenziehen.
                </p>
                <div className="mt-2 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
                  <InlineMath math="\varepsilon_{cd}(t, t_s) = \beta_{ds}(t, t_s) \cdot k_h \cdot \varepsilon_{cd,0}" />
                </div>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="block text-slate-900 font-bold mb-1 text-sm">
                  2. Autogenes Schwinden ε_ca(t) (Abschnitt 5)
                </strong>
                <p>
                  Tritt vollkommen ohne Wasserverlust an die Außenwelt auf (sogar unter lückenloser Versiegelung oder unter Wasser). Ursache ist die <strong>chemische Kontraktion (Le-Chatelier)</strong>: Das Volumen der Hydratationsprodukte (C-S-H) ist um ca. 8–10 % kleiner als die Summe der Ausgangsvolumina von Zement und Wasser.
                </p>
                <div className="mt-2 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
                  <InlineMath math="\varepsilon_{ca}(\infty) = 2{,}5 \cdot (f_{ck} - 10) \cdot 10^{-6}, \quad \beta_{as}(t) = 1 - \exp(-0{,}2 \cdot t^{0{,}5})" />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: INGENIEURPRAXIS & GRENZZUSTÄNDE (GZG / GZT)                    */}
      {/* ===================================================================== */}
      {activeTab === 'praxis' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck size={18} className="text-shiraz" />
              Relevanz der Betonkennwerte in der Tragwerksplanung
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Die normativen Kennwerte nach EC2 steuern nicht nur die Querschnittstragfähigkeit im GZT, sondern maßgeblich die Gebrauchstauglichkeitsnachweise (GZG) sowie baupraktische Bauzustände:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3">
              
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <strong className="text-slate-900 font-bold block mb-1 text-sm">1. Durchbiegungsnachweis (GZG)</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Langzeitverformungen von Decken und Trägern werden durch das Kriechen um den Faktor <InlineMath math="(1 + \varphi)" /> vergrößert. Die Berechnung erfolgt über den effektiven Kriechmodul:
                  </p>
                  <div className="my-2 p-2 bg-white rounded border border-slate-200 text-center font-mono">
                    <InlineMath math="E_{c,\text{eff}} = \frac{E_{cm}}{1 + \varphi(t, t_0)}" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Bei Schwindzwang: <InlineMath math="E_{c,\text{eff,Zwang}} = \frac{E_{cm}}{1 + 0{,}8 \cdot \varphi}" />
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-200">
                  DIN EN 1992-1-1 Abs. 7.4.3 (Gl. 7.20)
                </span>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <strong className="text-slate-900 font-bold block mb-1 text-sm">2. Mindestbewehrung für Rissbreite</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Zur Begrenzung der Rissbreite infolge abfließender Hydratationswärme oder Schwindzwang muss die Mindestbewehrung die Zugkraft bei Erstrissbildung aufnehmen:
                  </p>
                  <div className="my-2 p-2 bg-white rounded border border-slate-200 text-center font-mono">
                    <InlineMath math="A_{s,\text{min}} \cdot \sigma_s = k_c \cdot k \cdot f_{ct,\text{eff}} \cdot A_{ct}" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-200">
                  DIN EN 1992-1-1 Abs. 7.3.2
                </span>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <strong className="text-slate-900 font-bold block mb-1 text-sm">3. Bauwerksdiagnose nach DIN EN 13791</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Die In-situ-Druckfestigkeit <InlineMath math="f_{ck,\text{is}}" /> aus Bohrkernen ist bauartbedingt ca. 15 % geringer als die Standard-Zylinderfestigkeit aus dem Labor (Probekörperlagerung unter Wasser):
                  </p>
                  <div className="my-2 p-2 bg-white rounded border border-slate-200 text-center font-mono">
                    <InlineMath math="f_{ck,\text{is}} = 0{,}85 \cdot f_{ck}" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-200">
                  DIN EN 13791:2020-02
                </span>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: AUSBLICK EUROCODE 2 DER 2. GENERATION (2025/2026)              */}
      {/* ===================================================================== */}
      {activeTab === 'ausblick2025' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-home-grau/20">
              <Sparkles size={20} className="text-shiraz" />
              <h3 className="font-bold text-slate-900 text-base">
                Abschnitt 8: Wesentliche Neuerungen in Eurocode 2 der 2. Generation (DIN EN 1992-1-1:2025-09)
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              In der 2. Generation des Eurocode 2 (Abschnitt 5.1 &amp; Anhang B) wurden zentrale Formulierungen für hochfeste Betone, alternative Bindemittel und Klinkerersatzstoffe präzisiert:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <strong className="block text-slate-900 font-bold text-sm">1. Neuer E-Modul-Ansatz</strong>
                <p className="text-slate-600 leading-relaxed">
                  Die Gleichung basiert nun auf der 3. Wurzel der mittleren Druckfestigkeit:
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center font-mono">
                  <InlineMath math="E_{cm} = k_E \cdot f_{cm}^{1/3}" />
                </div>
                <p className="text-slate-500 text-[11px]">
                  Mit dem Gesteinsbeiwert <InlineMath math="k_E = 9500" /> für Quarzit. Aktueller Rechnerwert für {baseConcrete.name}: <strong>{formatDeZahl(calcResults.Ecm2025, 0)} MPa</strong> (vs. {formatDeZahl(calcResults.Ecm, 0)} MPa im EC2 1. Gen).
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <strong className="block text-slate-900 font-bold text-sm">2. Kontinuierlicher Sprödigkeitsfaktor</strong>
                <p className="text-slate-600 leading-relaxed">
                  Anstelle des sprunghaften Einsetzens ab C55/67 wird der stetige Faktor eingeführt:
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center font-mono">
                  <InlineMath math="\eta_{fc} = \left(\frac{40}{f_{ck}}\right)^{1/3} \le 1{,}0" />
                </div>
                <p className="text-slate-500 text-[11px]">
                  Aktueller Wert für {baseConcrete.name}: <strong>{formatDeZahl(calcResults.etaFc2025, 3)}</strong>.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <strong className="block text-slate-900 font-bold text-sm">3. Konsistente Kriech-/Schwindteilung</strong>
                <p className="text-slate-600 leading-relaxed">
                  Einheitliche Aufspaltung in Grund- und Trocknungskomponenten:
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center font-mono space-y-1">
                  <div><InlineMath math="\varepsilon_{cs} = \varepsilon_{cbs} + \varepsilon_{cds}" /></div>
                  <div><InlineMath math="\varphi = \varphi_{bc} + \varphi_{dc}" /></div>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Bessere Modellierung von CEM II/III-Betonen und Flugasche/Silica-Zusätzen.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 6: WISSENSTEST & SELBSTKONTROLLE (STUFE 4)                       */}
      {/* ===================================================================== */}
      {activeTab === 'test' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center justify-between pb-4 border-b border-home-grau/20 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-shiraz" />
                  Stufe 4: Didaktischer Wissenstest zu EC2-Betonkennwerten
                </h3>
                <p className="text-xs text-slate-500">
                  Überprüfen Sie Ihr Verständnis zu Normformeln, Kriechmechanismen und Grenzwerten mit begründetem Feedback
                </p>
              </div>
              <button
                onClick={() => setQuizAnswers({})}
                className="px-3 py-1.5 rounded-lg border border-home-grau/30 hover:bg-slate-50 text-xs text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw size={12} /> Zurücksetzen
              </button>
            </div>

            <div className="space-y-6">
              {QUIZ_ITEMS.map((item, qIdx) => {
                const selected = quizAnswers[qIdx];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === item.correct;

                return (
                  <div key={qIdx} className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-3">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      Frage {formatDeWert(qIdx + 1)}: {item.q}
                    </h4>

                    <div className="grid grid-cols-1 gap-2">
                      {item.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-white border-home-grau/30 text-slate-800 hover:bg-slate-50';
                        if (isAnswered) {
                          if (optIdx === item.correct) {
                            btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                          } else if (selected === optIdx) {
                            btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                          } else {
                            btnStyle = 'bg-white/60 border-slate-200 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isAnswered}
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                            className={`p-3 rounded-lg border text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                          >
                            <span className="font-mono font-bold text-slate-500 shrink-0">
                              {String.fromCharCode(65 + optIdx)})
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isAnswered && optIdx === item.correct && (
                              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                            )}
                            {isAnswered && selected === optIdx && optIdx !== item.correct && (
                              <XCircle size={16} className="text-rose-700 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className={`p-3 rounded-lg text-xs leading-relaxed border ${
                        isCorrect 
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                          : 'bg-rose-50/80 border-rose-200 text-rose-900'
                      }`}>
                        <strong>{isCorrect ? '✓ Richtig!' : '✗ Leider nicht richtig.'}</strong> {item.feedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. Standardisierter Modul-Footer (DIN-Normen OHNE LINKS gemäß System-Direktive) */}
      <ModuleFooter 
        regelwerke={[
          { title: 'DIN EN 1992-1-1:2011-01 / A1:2015-03 (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken - Allgemeine Bemessungsregeln und Regeln für den Hochbau)' },
          { title: 'DIN EN 1992-1-1/NA:2013-04 (Nationaler Anhang - National festgelegte Parameter - Eurocode 2)' },
          { title: 'DIN EN 1992-1-1:2025-09 (Eurocode 2 - Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken - Teil 1-1: Allgemeine Regeln; Deutsche Fassung EN 1992-1-1:2023)' },
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN EN 13791:2020-02 (Bewertung der Druckfestigkeit von Beton in Bauwerken oder in Bauwerksteilen)' },
          { title: 'DAfStb-Heft 600: Erläuterungen zu DIN EN 1992-1-1 und DIN EN 1992-1-1/NA (Deutscher Ausschuss für Stahlbeton)' }
        ]}
        literatur={[
          'Zilch, K.; Zehetmaier, G.: Bemessung im konstruktiven Betonbau nach DIN 1045-1 und EN 1992-1-1. 2. Aufl., Berlin: Springer 2010',
          'Wendehorst Baustoffkunde: Grundlagen, Baustoffe und Werkstoffprüfung. 37. Aufl., Springer Vieweg 2024',
          'DAfStb-Heft 525: Erläuterungen zu DIN 1045-1 (Deutscher Ausschuss für Stahlbeton)',
          'FIB Model Code for Concrete Structures 2010 (fib Bulletin 65/66)'
        ]}
        weblinks={[
          { title: 'InformationsZentrum Beton (IZB) – Technische Tabellen', url: 'https://www.beton.org/' }
        ]}
        formeln={
          activeTab === 'rechner' || activeTab === 'zeit_theorie'
            ? [
                {
                  formel: 'f_{cm} = f_{ck} + 8\\,\\text{MPa}, \\quad f_{cd} = \\alpha_{cc} \\cdot \\frac{f_{ck}}{\\gamma_c}',
                  erklaerung: 'Mittelwert und Bemessungswert der Zylinderdruckfestigkeit nach EC2 (in DE: \\alpha_{cc} = 0,85; \\gamma_c = 1,50).',
                  quelle: 'DIN EN 1992-1-1 Abs. 3.1.2 & 3.1.6'
                },
                {
                  formel: 'E_{cm} = 22000 \\cdot \\left(\\frac{f_{cm}}{10}\\right)^{0{,}3} \\cdot \\alpha_E\\,\\text{MPa}',
                  erklaerung: 'Sekantenmodul der Elastizität mit Korrekturbeiwert \\alpha_E für Gesteinskörnungen (Quarzit 1,0; Kalkstein 0,9; Sandstein 0,7; Basalt 1,2).',
                  quelle: 'DIN EN 1992-1-1 Tab. 3.1'
                },
                {
                  formel: '\\varepsilon_{cs}(t, t_s) = \\varepsilon_{cd}(t, t_s) + \\varepsilon_{ca}(t), \\quad \\varphi(t, t_0) = \\varphi_0 \\cdot \\beta_c(t, t_0)',
                  erklaerung: 'Gesamtschwinden (Trocknungsschwinden + autogenes Schwinden) und Kriechzahlverlauf in Abhängigkeit von h_0 = 2·A_c/u und der relativen Luftfeuchte.',
                  quelle: 'DIN EN 1992-1-1 Abs. 3.1.4 & Anhang B'
                },
                {
                  formel: '\\varphi_{k}(t, t_0) = \\varphi(t, t_0) \\cdot \\exp\\left(1{,}5 \\cdot (k_{\\sigma} - 0{,}45)\\right) \\quad \\text{mit } k_{\\sigma} = \\frac{\\sigma_c}{f_{ck}(t_0)}',
                  erklaerung: 'Nichtlineare Kriechvergrößerung bei hohen Dauerdruckspannungen \\sigma_c > 0,45·f_{ck}(t_0).',
                  quelle: 'DIN EN 1992-1-1 Gl. (3.7)'
                }
              ]
            : []
        }
      />
    </div>
  );
}
