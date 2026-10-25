// Ausgelagert aus src/modules/Betonkennwerte.tsx (AP 5.2)
import { Compass } from 'lucide-react';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { EC2_CONCRETE_CLASSES } from './daten';

export interface Ec2ParameterSkizzeProps {
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

export function Ec2ParameterSkizze({
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
