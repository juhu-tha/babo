import React, { useState, useMemo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl } from '@/src/utils/numberFormat';
import {
  Sliders,
  RotateCcw,
  Activity,
  Compass,
  Layers,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Gauge,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Scale,
  Minus,
  Plus,
  GitCommit,
  Check
} from 'lucide-react';

export type TendonTrajectoryType = 'centric' | 'straight_bottom' | 'parabolic';

export default function SpannbetonDehnungsAnimation() {
  // Träger- & Systemzustand (Manuelle Schieberegler-Steuerung)
  const [prestressForce, setPrestressForce] = useState<number>(1400); // P in kN
  const [loadQ, setLoadQ] = useState<number>(0); // q in kN/m (beginnt bei 0 kN/m)
  const [eccentricity, setEccentricity] = useState<number>(280); // e_p in mm (maximaler Hebelarm bzw. Parabelstich f)

  // NEU: Wählbare Spanngliedlage nach Nutzeranforderung:
  // a) zentrisch in Schwerachse
  // b) gerade unten mit Abstand Betondeckung
  // c) parabolisch entsprechend Momenteneinwirkung
  const [tendonTrajectory, setTendonTrajectory] = useState<TendonTrajectoryType>('parabolic');

  // Schnittort-Wahl: Feldmitte (x = L/2) vs. Auflager (x = 0)
  const [viewSection, setViewSection] = useState<'midspan' | 'support'>('midspan');

  // UI-Zustände
  const [activeDisplayMode, setActiveDisplayMode] = useState<'dehnung' | 'spannung' | 'superposition'>('dehnung');
  const [showExplanation, setShowExplanation] = useState<boolean>(true);

  // Feste Querschnitts- und Materialparameter (Einfeldträger L=20m, C40/50 nach DIN EN 1992-1-1)
  const L = 20.0; // m
  const b = 500.0; // mm
  const h = 1000.0; // mm
  const Ac = b * h; // 500.000 mm²
  const Ic = (b * Math.pow(h, 3)) / 12.0; // 41.666.666.667 mm⁴
  const Wc = (b * Math.pow(h, 2)) / 6.0; // 83.333.333 mm³
  const ku = h / 6.0; // 166.67 mm (Kernweite)
  const Ecm = 35000.0; // N/mm² (MPa)
  const fctm = 3.5; // N/mm² (axiale Betonzugfestigkeit)
  const fck = 40.0; // N/mm²

  // Berechnungen für den aktuellen Zustand abhängig von Spanngliedlage und Schnittposition
  const calc = useMemo(() => {
    // 1. Geometrische Exzentrizitäten nach Spanngliedlage
    let effectiveEpMid = 0; // mm in Feldmitte
    let effectiveEpSup = 0; // mm am Auflager
    let u_kN_m = 0; // Umlenkkraft in kN/m
    let w_u_m = 0; // Durchbiegung/Überhöhung aus Vorspannung

    if (tendonTrajectory === 'centric') {
      // a) Zentrisch in Schwerachse
      effectiveEpMid = 0;
      effectiveEpSup = 0;
      u_kN_m = 0;
      w_u_m = 0;
    } else if (tendonTrajectory === 'straight_bottom') {
      // b) Gerade unten mit Abstand Betondeckung (konstante Exzentrizität)
      effectiveEpMid = eccentricity;
      effectiveEpSup = eccentricity;
      u_kN_m = 0; // Keine Krümmung im Feld -> keine kontinuierlichen Umlenkkräfte
      // Durchbiegung aus konstantem Vormoment M_p = -P * e_p an beiden Enden:
      // w_u = (M_p * L^2) / (8 * E * I)
      const Mp_const = prestressForce * (eccentricity / 1000.0); // kNm
      w_u_m = (Mp_const * 1000.0 * Math.pow(L, 2)) / (8.0 * Ecm * 1e6 * (Ic * 1e-12));
    } else {
      // c) Parabolisch entsprechend Momenteneinwirkung
      effectiveEpMid = eccentricity;
      effectiveEpSup = 0; // Am Auflager zentrisch
      u_kN_m = (8.0 * prestressForce * (eccentricity / 1000.0)) / Math.pow(L, 2);
      // Durchbiegung aus kontinuierlicher Umlenkkraft u:
      const u_SI = u_kN_m * 1000.0; // N/m
      w_u_m = (5.0 * u_SI * Math.pow(L, 4)) / (384.0 * (Ecm * 1e6) * (Ic * 1e-12));
    }

    // Eigengewicht des Trägers g = 25 kN/m³ * b * h (500 x 1000 mm -> 12,5 kN/m)
    const beamG = (25.0 * b * h) / 1e6; // 12.5 kN/m
    const totalQ = beamG + loadQ; // Gesamte Streckenlast (Eigengewicht + Zusatzlast)

    // 2. Äußeres Lastmoment M_q aus Gesamteinwirkung (g + q)
    const Mq_mid = (totalQ * Math.pow(L, 2)) / 8.0; // kNm in Feldmitte
    const Mq_sup = 0; // kNm am Auflager

    // 3. Vormomente M_p
    const Mp_mid = -(prestressForce * (effectiveEpMid / 1000.0)); // kNm
    const Mp_sup = -(prestressForce * (effectiveEpSup / 1000.0)); // kNm

    // 4. Netto-Biegemomente
    const Mnet_mid = Mq_mid + Mp_mid;
    const Mnet_sup = Mq_sup + Mp_sup;

    // 5. Normalspannung aus zentrischer Vorspannkraft P (Druck = negativ)
    const sigma_N = -(prestressForce * 1000.0) / Ac; // MPa

    // 6. Schnittbezogene Werte (Feldmitte vs. Auflager)
    const isMidspan = viewSection === 'midspan';
    const activeEp = isMidspan ? effectiveEpMid : effectiveEpSup;
    const activeMq = isMidspan ? Mq_mid : Mq_sup;
    const activeMp = isMidspan ? Mp_mid : Mp_sup;
    const activeMnet = isMidspan ? Mnet_mid : Mnet_sup;

    // Biegespannungen aus aktivem Netto-Biegemoment
    const sigma_M_top = -(activeMnet * 1e6) / Wc; // MPa
    const sigma_M_bot = +(activeMnet * 1e6) / Wc; // MPa

    // Gesamtspannungen am betrachteten Querschnitt
    const sigma_top = sigma_N + sigma_M_top; // MPa
    const sigma_bot = sigma_N + sigma_M_bot; // MPa
    const sigma_max = Math.max(sigma_top, sigma_bot);
    const sigma_min = Math.min(sigma_top, sigma_bot);

    // Dehnungen in Promille (‰ = 10^-3)
    const eps_top = (sigma_top / Ecm) * 1000.0;
    const eps_bot = (sigma_bot / Ecm) * 1000.0;

    // Dehnung auf Spanngliedebene
    const sigma_tendon = sigma_N + (activeMnet * 1e6 / Ic) * activeEp;
    const eps_tendon = (sigma_tendon / Ecm) * 1000.0;

    // Einzelkomponenten der Dehnungsüberlagerung
    const eps_N = (sigma_N / Ecm) * 1000.0;
    const eps_Mp_top = -((activeMp * 1e6) / Wc / Ecm) * 1000.0;
    const eps_Mp_bot = +((activeMp * 1e6) / Wc / Ecm) * 1000.0;
    const eps_Mq_top = -((activeMq * 1e6) / Wc / Ecm) * 1000.0;
    const eps_Mq_bot = +((activeMq * 1e6) / Wc / Ecm) * 1000.0;

    // Nulldurchgang der Spannungs-/Dehnungsgeraden (x von Oberkante)
    let neutralAxisDepth = 0;
    const deltaSigma = sigma_bot - sigma_top;
    if (Math.abs(deltaSigma) > 1e-4) {
      neutralAxisDepth = (-sigma_top / deltaSigma) * h;
    } else {
      neutralAxisDepth = h / 2;
    }

    // Auflager-Sonderzustand für die Bewertung von Kopfzugrissen (bei gerader Spanngliedlage unten)
    const sigma_top_support = sigma_N - (Mp_sup * 1e6) / Wc; // = -P/Ac + P*ep/Wc
    const hasSupportHeadCracks = tendonTrajectory === 'straight_bottom' && sigma_top_support > fctm;

    // Durchbiegung der Biegelinie in Feldmitte
    const q_SI = totalQ * 1000.0; // N/m (Eigengewicht + Zusatzlast)
    const w_q_m = (5.0 * q_SI * Math.pow(L, 4)) / (384.0 * (Ecm * 1e6) * (Ic * 1e-12));
    const w_net_mm = (w_q_m - w_u_m) * 1000.0; // positiv = Durchbiegung nach unten, negativ = Überhöhung

    // Grenzwerte für Schnelltasten (bezogen auf Feldmitte)
    let P_dek = 0;
    let P_cr = 0;
    let P_bal = 0;
    if (effectiveEpMid > 0) {
      P_dek = (Mq_mid * 1000.0) / (ku + effectiveEpMid);
      P_cr = Math.max(0, (Mq_mid * 1000.0 - fctm * (Wc / 1000.0)) / (ku + effectiveEpMid));
      // Lastausgleich u = g + q: P_bal = (g + q) * L^2 / (8 * ep)
      P_bal = Math.round((totalQ * Math.pow(L, 2)) / (8.0 * (effectiveEpMid / 1000.0)));
    } else {
      // Zentrisch: sigma_u = -P/Ac + Mq/Wc
      P_dek = (Mq_mid * 1000.0 * Ac) / Wc;
      P_cr = Math.max(0, ((Mq_mid * 1000.0 / Wc) - fctm) * Ac);
      P_bal = 0;
    }

    // Riss- und Tragwerksstadium (physikalisch konsistent)
    let phaseKey: 'cracked' | 'limited' | 'decompressed' | 'full' | 'camber' | 'support_crack' = 'cracked';
    let phaseTitle = '';
    let phaseColor = '';
    let phaseBadge = '';

    if (hasSupportHeadCracks) {
      phaseKey = 'support_crack';
      phaseTitle = 'Gefahr: Kopfzugrisse am Auflager! (σ_o,Auflager > f_ctm)';
      phaseColor = 'text-red-800 bg-red-50 border-red-300';
      phaseBadge = 'bg-red-700 text-white';
    } else if (sigma_top <= 0 && sigma_bot <= 0) {
      // Voller Querschnitt überdrückt (reiner Druck an beiden Rändern)
      if (w_net_mm < -0.5) {
        phaseKey = 'camber';
        phaseTitle = '✓ Voll überdrückt mit Überhöhung (Zustand I: σ_o ≤ 0 und σ_u ≤ 0)';
        phaseColor = 'text-blue-900 bg-blue-50 border-blue-200';
        phaseBadge = 'bg-blue-600 text-white';
      } else {
        phaseKey = 'full';
        phaseTitle = '✓ Voll überdrückt (Zustand I: σ_o ≤ 0 und σ_u ≤ 0, homogener Druck)';
        phaseColor = 'text-emerald-800 bg-emerald-50 border-emerald-200';
        phaseBadge = 'bg-emerald-600 text-white';
      }
    } else if (sigma_max <= fctm) {
      phaseKey = 'limited';
      phaseTitle = 'Zustand I mit Zugspannungen (ungerissen, σ_max ≤ f_ctm)';
      phaseColor = 'text-amber-800 bg-amber-50 border-amber-200';
      phaseBadge = 'bg-amber-500 text-white';
    } else {
      phaseKey = 'cracked';
      phaseTitle = 'Rissbildung (Zustand II: σ_max > f_ctm)';
      phaseColor = 'text-red-700 bg-red-50 border-red-200';
      phaseBadge = 'bg-red-600 text-white';
    }

    return {
      effectiveEpMid,
      effectiveEpSup,
      activeEp,
      u_kN_m,
      w_u_m,
      Mq: activeMq,
      Mp: activeMp,
      Mnet: activeMnet,
      Mq_mid,
      Mp_mid,
      Mnet_mid,
      sigma_N,
      sigma_M_top,
      sigma_M_bot,
      sigma_top,
      sigma_bot,
      sigma_top_support,
      hasSupportHeadCracks,
      eps_top,
      eps_bot,
      eps_tendon,
      eps_N,
      eps_Mp_top,
      eps_Mp_bot,
      eps_Mq_top,
      eps_Mq_bot,
      neutralAxisDepth,
      P_dek,
      P_cr,
      P_bal,
      w_net_mm,
      phaseKey,
      phaseTitle,
      phaseColor,
      phaseBadge,
    };
  }, [prestressForce, loadQ, eccentricity, tendonTrajectory, viewSection]);

  // Handlers für manuelle Kraftanpassung
  const handleStep = (step: number) => {
    setPrestressForce((prev) => Math.max(0, Math.min(3000, Math.round((prev + step) / 10) * 10)));
  };

  const handleJumpTo = (force: number) => {
    setPrestressForce(Math.round(Math.max(0, Math.min(3000, force))));
  };

  const handleReset = () => {
    setPrestressForce(0);
    setLoadQ(0);
    setEccentricity(280);
    setTendonTrajectory('parabolic');
    setViewSection('midspan');
  };

  // SVG Dimensionen & Skalierungen
  const svgWidth = 460;
  const svgHeight = 260;
  const zeroX = 260; // x-Koordinate für ε = 0 ‰
  const scaleEps = 140; // 1 ‰ entspricht 140 Pixeln

  const topY = 30; // Oberkante des Querschnitts (z = -h/2)
  const botY = 220; // Unterkante des Querschnitts (z = +h/2)
  const midY = (topY + botY) / 2; // Schwerpunkt (z = 0)
  const tendonY = midY + (calc.activeEp / (h / 2)) * ((botY - topY) / 2); // Spanngliedposition im Querschnitt

  const topEpsX = zeroX + calc.eps_top * scaleEps;
  const botEpsX = zeroX + calc.eps_bot * scaleEps;
  const tendonEpsX = zeroX + calc.eps_tendon * scaleEps;

  // Nulldurchgang Y
  const neutralY = topY + (calc.neutralAxisDepth / h) * (botY - topY);

  // Längsschnitt-Verformung (amplifiziert für didaktische Erkennbarkeit)
  const beamDeflectPx = Math.max(-20, Math.min(25, calc.w_net_mm * 0.5));
  const beamCenterY = 55 + beamDeflectPx;

  return (
    <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
      {/* HEADER DER MANUELLEN ANALYSE */}
      <div className="border-b border-home-grau/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-shiraz text-white font-mono">
                Interaktiver Spannkraft- &amp; Lagen-Simulator
              </span>
              <span className="text-xs text-slate-500 font-mono">DIN EN 1992-1-1 / Eurocode 2</span>
            </div>
            <h3 className="text-lg font-bold text-text-main mt-1 flex items-center gap-2">
              <Compass className="text-shiraz h-5 w-5" />
              Spanngliedlage, Dehnungsüberlagerung &amp; Spannungsverteilung
            </h3>
            <p className="text-xs text-text-main/70 mt-0.5">
              Untersuchen Sie den Einfluss der Spanngliedlage (zentrisch vs. gerade unten vs. parabolisch) auf Dehnung <InlineMath math="\varepsilon(z)" />, Biegemomente, Umlenkkräfte <InlineMath math="u" /> und Kopfzugspannungen am Auflager.
            </p>
          </div>

          {/* Aktueller Tragwerkszustand Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-sans shadow-2xs ${calc.phaseColor}`}>
              {calc.phaseTitle}
            </span>
          </div>
        </div>
      </div>

      {/* 1. SELEKTOR DER SPANNGLIEDLAGE: a) Zentrisch, b) Gerade unten, c) Parabolisch */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <GitCommit size={15} className="text-shiraz" />
            Wahl der Spanngliedlage (Spanngliedführung im Träger):
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Tragwerkstheorie &amp; Vormomentenverlauf
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* a) Zentrisch */}
          <button
            type="button"
            onClick={() => setTendonTrajectory('centric')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              tendonTrajectory === 'centric'
                ? 'bg-shiraz text-white border-shiraz shadow-xs font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">a) Zentrisch in Schwerachse</span>
              {tendonTrajectory === 'centric' && <Check size={14} className="text-white" />}
            </div>
            <p className={`text-[10.5px] mt-1 leading-snug ${tendonTrajectory === 'centric' ? 'text-white/90' : 'text-slate-500'}`}>
              <InlineMath math="e_p = 0" /> über gesamte Länge. Reine Längsdruckkraft <InlineMath math="\sigma_N" />, kein Vormoment (<InlineMath math="M_P = 0" />), keine Umlenkkräfte (<InlineMath math="u = 0" />).
            </p>
          </button>

          {/* b) Gerade unten */}
          <button
            type="button"
            onClick={() => setTendonTrajectory('straight_bottom')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              tendonTrajectory === 'straight_bottom'
                ? 'bg-shiraz text-white border-shiraz shadow-xs font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">b) Gerade unten (Abstand Betondeckung)</span>
              {tendonTrajectory === 'straight_bottom' && <Check size={14} className="text-white" />}
            </div>
            <p className={`text-[10.5px] mt-1 leading-snug ${tendonTrajectory === 'straight_bottom' ? 'text-white/90' : 'text-slate-500'}`}>
              <InlineMath math="e_p = \text{konst.}" /> unten. Wirksames Vormoment im Feld, aber <strong>Gefahr von Kopfzugrissen am Auflager</strong> (<InlineMath math="M_q=0 \rightarrow \sigma_o > 0" />).
            </p>
          </button>

          {/* c) Parabolisch */}
          <button
            type="button"
            onClick={() => setTendonTrajectory('parabolic')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              tendonTrajectory === 'parabolic'
                ? 'bg-shiraz text-white border-shiraz shadow-xs font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">c) Parabolisch (Momenteneinwirkung)</span>
              {tendonTrajectory === 'parabolic' && <Check size={14} className="text-white" />}
            </div>
            <p className={`text-[10.5px] mt-1 leading-snug ${tendonTrajectory === 'parabolic' ? 'text-white/90' : 'text-slate-500'}`}>
              Spannglied folgt der Biegelinie. An Auflagern zentrisch (<InlineMath math="e_p=0" />), in Feldmitte maximaler Stich <InlineMath math="f" />. <strong>Gleichmäßige Umlenkkräfte <InlineMath math="u \uparrow" /> (Lastausgleich)!</strong>
            </p>
          </button>
        </div>
      </div>

      {/* HAUPT-STEUERUNG: MANUELLER SCHIEBEREGLER MIT FEINJUSTIERUNG & MEILENSTEINEN */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
        {/* Schieberegler Kopfzeile mit Tastatur/Schritt-Buttons & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-white text-text-main border border-slate-300 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Auf ungespannten Ausgangszustand zurücksetzen"
            >
              <RotateCcw size={13} /> Reset
            </button>

            {/* Schrittweise Tasten für präzises Austarieren */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300">
              <span className="text-[10px] text-slate-500 font-bold px-1">Schritte:</span>
              <button
                type="button"
                onClick={() => handleStep(-100)}
                className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
                title="-100 kN"
              >
                −100
              </button>
              <button
                type="button"
                onClick={() => handleStep(-25)}
                className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
                title="-25 kN"
              >
                −25
              </button>
              <button
                type="button"
                onClick={() => handleStep(+25)}
                className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
                title="+25 kN"
              >
                +25
              </button>
              <button
                type="button"
                onClick={() => handleStep(+100)}
                className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
                title="+100 kN"
              >
                +100
              </button>
            </div>
          </div>

          {/* Anzeige-Modus-Umschaltung */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300">
            <button
              type="button"
              onClick={() => setActiveDisplayMode('dehnung')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDisplayMode === 'dehnung'
                  ? 'bg-shiraz text-white shadow-2xs'
                  : 'text-text-main/70 hover:text-text-main'
              }`}
            >
              <Activity size={13} /> Dehnung <InlineMath math="\varepsilon(z)" />
            </button>
            <button
              type="button"
              onClick={() => setActiveDisplayMode('spannung')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDisplayMode === 'spannung'
                  ? 'bg-shiraz text-white shadow-2xs'
                  : 'text-text-main/70 hover:text-text-main'
              }`}
            >
              <Gauge size={13} /> Spannung <InlineMath math="\sigma(z)" />
            </button>
            <button
              type="button"
              onClick={() => setActiveDisplayMode('superposition')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDisplayMode === 'superposition'
                  ? 'bg-shiraz text-white shadow-2xs'
                  : 'text-text-main/70 hover:text-text-main'
              }`}
            >
              <Layers size={13} /> Superposition (<InlineMath math="N + M_p + M_q" />)
            </button>
          </div>
        </div>

        {/* DER ZENTRALE MANUELLE SCHIEBEREGLER: VORSPANNKRAFT P */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-shiraz" />
              <span className="text-sm font-bold text-slate-900">
                Vorspannkraft P manuell einstellen:
              </span>
              <span className="font-mono text-base font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded border border-shiraz/20">
                {formatDeZahl(prestressForce, 0)} kN
              </span>
              <span className="text-xs text-slate-500 font-mono">
                (σ_N = {formatDeZahl(calc.sigma_N, 2)} MPa, ε_N = {formatDeZahl(calc.eps_N, 3)} ‰)
              </span>
            </div>
            <div className="text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
              Ausnutzung <InlineMath math="\sigma_p / \sigma_{pm0,zul}" />: <strong>{formatDeZahl((prestressForce / 2720) * 100, 0)} %</strong> (bei 14 Litzen Y1860)
            </div>
          </div>

          {/* Der interaktive Schieberegler */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="3000"
              step="10"
              value={prestressForce}
              onChange={(e) => setPrestressForce(Number(e.target.value))}
              className="w-full accent-shiraz cursor-pointer h-3 bg-slate-200 rounded-lg transition-all"
            />
            {/* Skalen-Ticks */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
              <span>0 kN</span>
              <span>500 kN</span>
              <span>1.000 kN</span>
              <span>1.500 kN</span>
              <span>2.000 kN</span>
              <span>2.500 kN</span>
              <span>3.000 kN</span>
            </div>
          </div>

          {/* MEILENSTEIN-SCHNELLWAHL-BUTTONS */}
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-bold self-center mr-1">
              Grenzzustände direkt anspringen:
            </span>
            <button
              type="button"
              onClick={() => handleJumpTo(0)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                prestressForce === 0
                  ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              1. P = 0 kN (Ungespannt)
            </button>
            <button
              type="button"
              onClick={() => handleJumpTo(calc.P_cr)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                Math.abs(prestressForce - calc.P_cr) < 30
                  ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                  : 'bg-red-50 hover:bg-red-100 text-red-800 border-red-300'
              }`}
            >
              2. P_cr = {formatDeZahl(calc.P_cr, 0)} kN (Rissgrenze)
            </button>
            <button
              type="button"
              onClick={() => handleJumpTo(calc.P_dek)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                Math.abs(prestressForce - calc.P_dek) < 30
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              3. P_dek = {formatDeZahl(calc.P_dek, 0)} kN (Dekompressionspunkt)
            </button>
            {tendonTrajectory === 'parabolic' && (
              <button
                type="button"
                onClick={() => handleJumpTo(calc.P_bal)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  Math.abs(prestressForce - calc.P_bal) < 30
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-300'
                }`}
              >
                4. P_bal = {formatDeZahl(calc.P_bal, 0)} kN (Lastausgleich w=0)
              </button>
            )}
            <button
              type="button"
              onClick={() => handleJumpTo(2400)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                prestressForce === 2400
                  ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-300'
              }`}
            >
              5. P = 2.400 kN (hohe Vorspannung)
            </button>
          </div>
        </div>

        {/* NEBENPARAMETER: MANUELLE SCHIEBEREGLER FÜR LAST q & EXZENTRIZITÄT ep */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between text-slate-700 font-semibold mb-1">
              <span>Zusatzlast q (ohne Eigengewicht g = 12,5 kN/m):</span>
              <span className="font-mono text-slate-900 font-bold">{formatDeZahl(loadQ, 0)} kN/m</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={loadQ}
              onChange={(e) => setLoadQ(Number(e.target.value))}
              className="w-full accent-slate-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span>0 kN/m (Nur Eigengewicht)</span>
              <span>Gesamtmoment M_k (g + q) = {formatDeZahl(calc.Mq_mid, 0)} kNm</span>
              <span>50 kN/m</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between text-slate-700 font-semibold mb-1">
              <span>
                {tendonTrajectory === 'centric' 
                  ? 'Exzentrizität e_p (zentrisch gesperrt):' 
                  : tendonTrajectory === 'parabolic'
                  ? 'Parabelstich f (Tiefpunkt Feldmitte):'
                  : 'Spanngliedabstand e_p (unten):'}
              </span>
              <span className="font-mono text-slate-900 font-bold">
                {tendonTrajectory === 'centric' ? '0 mm' : `${formatDeZahl(eccentricity, 0)} mm`}
              </span>
            </div>
            <input
              type="range"
              min="150"
              max="380"
              step="10"
              value={eccentricity}
              disabled={tendonTrajectory === 'centric'}
              onChange={(e) => setEccentricity(Number(e.target.value))}
              className={`w-full cursor-pointer h-1.5 rounded-lg ${
                tendonTrajectory === 'centric' ? 'bg-slate-100 accent-slate-300 opacity-50' : 'bg-slate-200 accent-slate-600'
              }`}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span>150 mm</span>
              <span>Kernweite k_u = 167 mm</span>
              <span>380 mm (max. Betondeckung)</span>
            </div>
          </div>
        </div>
      </div>

      {/* HAUPTSTUFE: 2 VISUELLE ANALYSE-FELDER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LINKER BEREICH: EINFELDTRÄGER IM LÄNGSSCHNITT (SPAN 6) */}
        <div className="lg:col-span-6 bg-slate-50 p-4 rounded-xl border border-slate-200/90 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-700" />
              1. Längsschnitt: Spanngliedführung &amp; Lastwirkung
            </span>
            <span className="font-mono text-[11px] font-bold text-slate-600">
              L = {formatDeZahl(L, 1)} m | Querschnitt 500 × 1.000 mm
            </span>
          </div>

          {/* SVG LÄNGSSCHNITT DES EINFELDTRÄGERS */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <svg viewBox="0 0 620 155" className="w-full h-48">
              <defs>
                <marker id="arrowUpGreen" viewBox="0 0 10 10" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 6 L 5 0 L 10 6 z" fill="#059669" />
                </marker>
                <marker id="arrowDownDark" viewBox="0 0 10 10" refX="5" refY="7" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 0 0 L 5 6 L 10 0 z" fill="#64748b" />
                </marker>
              </defs>

              {/* Äußere Streckenlast q Pfeile oben */}
              {loadQ > 0 ? (
                <>
                  {[60, 120, 180, 240, 310, 380, 440, 500, 560].map((xPos) => (
                    <line
                      key={xPos}
                      x1={xPos}
                      y1={8}
                      x2={xPos}
                      y2={22}
                      stroke="#94a3b8"
                      strokeWidth="1.2"
                      markerEnd="url(#arrowDownDark)"
                    />
                  ))}
                  <text x="310" y="8" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">
                    Gleichlast q = {formatDeZahl(loadQ, 0)} kN/m
                  </text>
                </>
              ) : (
                <text x="310" y="14" textAnchor="middle" fontSize="9.5" fill="#94a3b8" fontStyle="italic">
                  q = 0 kN/m (Keine äußere Last – reine Wirkung der Vorspannung)
                </text>
              )}

              {/* Träger-Ober- und Unterkante (deformiert gemäß Biegelinie) */}
              <path
                d={`M 30,${24 + beamDeflectPx * 0.4} 
                    Q 310,${24 + beamDeflectPx} 590,${24 + beamDeflectPx * 0.4} 
                    L 590,${66 + beamDeflectPx * 0.4} 
                    Q 310,${66 + beamDeflectPx} 30,${66 + beamDeflectPx * 0.4} Z`}
                fill="#f1f5f9"
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Neutrale Schwerpunktachse (gestrichelt) */}
              <path
                d={`M 30,${45 + beamDeflectPx * 0.4} Q 310,${45 + beamDeflectPx} 590,${45 + beamDeflectPx * 0.4}`}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="4 3"
              />

              {/* DYNAMISCHE SPANNGLIEDFÜHRUNG JE NACH TYP */}
              {tendonTrajectory === 'centric' && (
                /* a) Zentrisch: Genau auf Schwerpunktachse */
                <>
                  <path
                    d={`M 30,${45 + beamDeflectPx * 0.4} Q 310,${45 + beamDeflectPx} 590,${45 + beamDeflectPx * 0.4}`}
                    fill="none"
                    stroke="#A3113E"
                    strokeWidth="3.0"
                  />
                  {/* Endanker mittig */}
                  <rect x="23" y={41 + beamDeflectPx * 0.4} width="7" height="9" fill="#1e293b" rx="1" />
                  <rect x="590" y={41 + beamDeflectPx * 0.4} width="7" height="9" fill="#1e293b" rx="1" />
                  <text x="310" y={45 + beamDeflectPx - 6} textAnchor="middle" fontSize="8.5" fill="#A3113E" fontWeight="bold">
                    Zentrisches Spannglied (e_p = 0, u = 0, reine Längskraft)
                  </text>
                </>
              )}

              {tendonTrajectory === 'straight_bottom' && (
                /* b) Gerade unten: Konstant exzentrisch */
                <>
                  {(() => {
                    const offsetPx = (eccentricity / 1000) * 45;
                    const yTendonLeft = 45 + offsetPx + beamDeflectPx * 0.4;
                    const yTendonMid = 45 + offsetPx + beamDeflectPx;
                    const yTendonRight = 45 + offsetPx + beamDeflectPx * 0.4;
                    return (
                      <>
                        <path
                          d={`M 30,${yTendonLeft} Q 310,${yTendonMid} 590,${yTendonRight}`}
                          fill="none"
                          stroke="#A3113E"
                          strokeWidth="3.0"
                        />
                        {/* Endanker unten */}
                        <rect x="23" y={yTendonLeft - 4} width="7" height="9" fill="#1e293b" rx="1" />
                        <rect x="590" y={yTendonRight - 4} width="7" height="9" fill="#1e293b" rx="1" />
                        <text x="310" y={yTendonMid - 6} textAnchor="middle" fontSize="8.5" fill="#A3113E" fontWeight="bold">
                          Gerades Spannglied unten (e_p = {formatDeZahl(eccentricity, 0)} mm = konst.)
                        </text>
                      </>
                    );
                  })()}
                </>
              )}

              {tendonTrajectory === 'parabolic' && (
                /* c) Parabolisch: Folgt der Momentenlinie */
                <>
                  {(() => {
                    const offsetPx = (eccentricity / 1000) * 45;
                    const tendonCenterY = 45 + offsetPx + beamDeflectPx;
                    return (
                      <>
                        <path
                          d={`M 30,${45 + beamDeflectPx * 0.4} Q 310,${tendonCenterY} 590,${45 + beamDeflectPx * 0.4}`}
                          fill="none"
                          stroke="#A3113E"
                          strokeWidth="2.8"
                        />
                        {/* Endanker mittig */}
                        <rect x="23" y={41 + beamDeflectPx * 0.4} width="7" height="9" fill="#1e293b" rx="1" />
                        <rect x="590" y={41 + beamDeflectPx * 0.4} width="7" height="9" fill="#1e293b" rx="1" />

                        {/* Umlenkkräfte u nach oben (grüne Pfeile) */}
                        {prestressForce > 200 && (
                          <>
                            {[170, 240, 310, 380, 450].map((xPos) => {
                              const arrowLen = Math.min(22, (prestressForce / 3000) * 22);
                              const localY = 45 + offsetPx * (1 - Math.pow((xPos - 310) / 280, 2)) + beamDeflectPx;
                              return (
                                <g key={xPos}>
                                  <line
                                    x1={xPos}
                                    y1={localY + 4}
                                    x2={xPos}
                                    y2={localY - arrowLen}
                                    stroke="#059669"
                                    strokeWidth="1.8"
                                    markerEnd="url(#arrowUpGreen)"
                                  />
                                </g>
                              );
                            })}
                            <text x="310" y={beamCenterY - 12} textAnchor="middle" fontSize="9" fill="#059669" fontWeight="bold">
                              Umlenkkräfte u = {formatDeZahl(calc.u_kN_m, 1)} kN/m ↑ (Lastausgleich)
                            </text>
                          </>
                        )}
                      </>
                    );
                  })()}
                </>
              )}

              {/* Auflager links (fest) */}
              <polygon points="30,75 20,95 40,95" fill="#94a3b8" />
              <line x1="15" y1="95" x2="45" y2="95" stroke="#64748b" strokeWidth="2" />

              {/* Auflager rechts (verschiebbar) */}
              <polygon points="590,75 580,95 600,95" fill="#94a3b8" />
              <circle cx="585" cy="99" r="3.5" fill="#64748b" />
              <circle cx="595" cy="99" r="3.5" fill="#64748b" />
              <line x1="575" y1="104" x2="605" y2="104" stroke="#64748b" strokeWidth="2" />

              {/* WARNUNG: Kopfzugrisse am Auflager bei gerader Lage unten */}
              {tendonTrajectory === 'straight_bottom' && calc.hasSupportHeadCracks && (
                <g>
                  {/* Risse oben links */}
                  <line x1="38" y1="24" x2="38" y2="38" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 1" />
                  <line x1="48" y1="24" x2="48" y2="35" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="3 1" />
                  {/* Risse oben rechts */}
                  <line x1="582" y1="24" x2="582" y2="38" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 1" />
                  <line x1="572" y1="24" x2="572" y2="35" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="3 1" />
                  <text x="310" y="140" textAnchor="middle" fontSize="9.5" fill="#dc2626" fontWeight="bold">
                    ⚠️ Unzulässige Kopfzugrisse an den Trägerenden! σ_o(Auflager) = +{formatDeZahl(calc.sigma_top_support, 1)} MPa &gt; {formatDeZahl(fctm, 1)} MPa
                  </text>
                </g>
              )}

              {/* Risse in Feldmitte, wenn sigma_bot > fctm */}
              {calc.sigma_bot > fctm && !calc.hasSupportHeadCracks && (
                <g>
                  {[-40, -20, 0, 20, 40].map((offset) => {
                    const crackHeight = Math.min(22, (calc.sigma_bot - fctm) * 2.5);
                    const crackBaseY = 66 + beamDeflectPx;
                    return (
                      <line
                        key={offset}
                        x1={310 + offset}
                        y1={crackBaseY}
                        x2={310 + offset}
                        y2={crackBaseY - crackHeight}
                        stroke="#dc2626"
                        strokeWidth="1.8"
                        strokeDasharray="2 1"
                      />
                    );
                  })}
                  <text x="310" y="125" textAnchor="middle" fontSize="9" fill="#dc2626" fontWeight="bold">
                    Zugrisse im Beton (Zustand II)! Betonzugfestigkeit überschritten ({formatDeZahl(calc.sigma_bot, 1)} &gt; {formatDeZahl(fctm, 1)} MPa)
                  </text>
                </g>
              )}

              {/* Rissfrei-Anzeige bei voller Überdrückung */}
              {calc.sigma_bot <= 0 && calc.sigma_top <= 0 && !calc.hasSupportHeadCracks && (
                <text x="310" y="125" textAnchor="middle" fontSize="9.5" fill="#059669" fontWeight="bold">
                  ✓ Voll überdrückt (Zustand I): σ_o ≤ 0 und σ_u ≤ 0.
                </text>
              )}
            </svg>
          </div>

          {/* KPI-LEISTE DES TRÄGERS */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Netto-Moment (Feld)</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {formatDeZahl(calc.Mnet_mid, 0)} kNm
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                (M_q = {formatDeZahl(calc.Mq_mid, 0)}, M_p = {formatDeZahl(calc.Mp_mid, 0)})
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Biegelinie Feldmitte</span>
              <span className={`font-mono font-bold text-sm flex items-center justify-center gap-1 ${
                calc.w_net_mm > 0 ? 'text-amber-800' : 'text-purple-800'
              }`}>
                {calc.w_net_mm > 0 ? (
                  <>
                    <ArrowDown size={14} className="text-amber-600" />
                    +{formatDeZahl(calc.w_net_mm, 1)} mm
                  </>
                ) : (
                  <>
                    <ArrowUp size={14} className="text-purple-600" />
                    {formatDeZahl(calc.w_net_mm, 1)} mm (Überhöhung)
                  </>
                )}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {Math.abs(calc.w_net_mm) < 1.0 ? 'Exakt horizontal' : calc.w_net_mm > 0 ? 'Durchbiegung ↓' : 'Überhöhung ↑'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                {viewSection === 'midspan' ? 'Unterrand σ_u (Feld)' : 'Oberrand σ_o (Auflager)'}
              </span>
              <span className={`font-mono font-bold text-sm ${
                (viewSection === 'midspan' ? calc.sigma_bot : calc.sigma_top) > fctm ? 'text-red-600' :
                (viewSection === 'midspan' ? calc.sigma_bot : calc.sigma_top) > 0 ? 'text-amber-600' : 'text-emerald-700'
              }`}>
                {viewSection === 'midspan'
                  ? (calc.sigma_bot > 0 ? `+${formatDeZahl(calc.sigma_bot, 2)}` : formatDeZahl(calc.sigma_bot, 2))
                  : (calc.sigma_top > 0 ? `+${formatDeZahl(calc.sigma_top, 2)}` : formatDeZahl(calc.sigma_top, 2))} MPa
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {(viewSection === 'midspan' ? calc.sigma_bot : calc.sigma_top) > 0 ? 'Zugspannung' : 'Druckspannung'}
              </span>
            </div>
          </div>
        </div>

        {/* RECHTER BEREICH: QUERSCHNITT & DYNAMISCHES DEHNUNGSDIAGRAMM (SPAN 6) */}
        <div className="lg:col-span-6 bg-slate-50 p-4 rounded-xl border border-slate-200/90 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-shiraz" />
              2. Querschnittsschnitt betrachten:
            </span>

            {/* Toggle Feldmitte vs. Auflager */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-300">
              <button
                type="button"
                onClick={() => setViewSection('midspan')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  viewSection === 'midspan'
                    ? 'bg-shiraz text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Feldmitte (x = L/2)
              </button>
              <button
                type="button"
                onClick={() => setViewSection('support')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  viewSection === 'support'
                    ? 'bg-shiraz text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Auflager (x = 0)
              </button>
            </div>
          </div>

          {/* SVG DEHNUNGS- UND SPANNUNGSDIAGRAMM */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            {activeDisplayMode === 'dehnung' && (
              <svg viewBox="0 0 470 260" className="w-full h-56">
                {/* 1. Querschnitt-Körper links (Breite b, Höhe h) */}
                <g transform="translate(15, 0)">
                  <rect x="0" y={topY} width="55" height={botY - topY} fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" rx="2" />
                  {/* Schwerachse z = 0 */}
                  <line x1="-5" y1={midY} x2="60" y2={midY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
                  <text x="63" y={midY + 3} fontSize="8" fill="#94a3b8" fontStyle="italic">z = 0</text>
                  {/* Spannglied-Kabel im Querschnitt */}
                  <circle cx="27" cy={tendonY} r="5" fill="#A3113E" stroke="#1e293b" strokeWidth="1.5" />
                  <line x1="-5" y1={tendonY} x2="60" y2={tendonY} stroke="#A3113E" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="63" y={tendonY + 3} fontSize="8" fill="#A3113E" fontWeight="bold">
                    e_p = {formatDeZahl(calc.activeEp, 0)}
                  </text>
                  {/* Maßketten */}
                  <text x="27" y={topY - 8} textAnchor="middle" fontSize="8" fill="#64748b">b = 500</text>
                  <line x1="0" y1={topY - 4} x2="55" y2={topY - 4} stroke="#cbd5e1" strokeWidth="1" />
                  <text x="-4" y={midY} textAnchor="middle" fontSize="8" fill="#64748b" transform={`rotate(-90 -4 ${midY})`}>h = 1000</text>
                </g>

                {/* 2. Dehnungs-Koordinatensystem */}
                <line x1={zeroX} y1={topY - 12} x2={zeroX} y2={botY + 20} stroke="#475569" strokeWidth="1.5" />
                <text x={zeroX} y={topY - 16} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">
                  ε = 0 ‰ (Nulllinie)
                </text>

                <line x1="90" y1={topY} x2="430" y2={topY} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="90" y1={botY} x2="430" y2={botY} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 2" />

                {/* Promille-Gitterlinien vertikal: -1.0‰, -0.5‰, +0.5‰ */}
                {[-1.0, -0.5, 0.5].map((gridVal) => {
                  const gx = zeroX + gridVal * scaleEps;
                  return (
                    <g key={gridVal}>
                      <line x1={gx} y1={topY} x2={gx} y2={botY} stroke="#f1f5f9" strokeWidth="1" />
                      <text x={gx} y={botY + 16} textAnchor="middle" fontSize="8" fill="#94a3b8">
                        {gridVal > 0 ? `+${gridVal}` : gridVal} ‰
                      </text>
                    </g>
                  );
                })}

                {/* 3. FLÄCHEN-SCHATTIERUNG DER DEHNUNGSVERTEILUNG */}
                {calc.eps_top < 0 && (
                  <polygon
                    points={
                      calc.eps_bot < 0
                        ? `${zeroX},${topY} ${topEpsX},${topY} ${botEpsX},${botY} ${zeroX},${botY}`
                        : `${zeroX},${topY} ${topEpsX},${topY} ${zeroX},${neutralY}`
                    }
                    fill="rgba(163, 17, 62, 0.18)"
                  />
                )}

                {calc.eps_bot > 0 && (
                  <polygon
                    points={`${zeroX},${neutralY} ${botEpsX},${botY} ${zeroX},${botY}`}
                    fill="rgba(239, 68, 68, 0.25)"
                  />
                )}

                {/* 4. DIE DYNAMISCHE DEHNUNGSGERADE */}
                <line
                  x1={topEpsX}
                  y1={topY}
                  x2={botEpsX}
                  y2={botY}
                  stroke="#A3113E"
                  strokeWidth="2.8"
                />

                {/* Oberrand-Dehnungspunkt */}
                <circle cx={topEpsX} cy={topY} r="4" fill="#A3113E" stroke="#ffffff" strokeWidth="1.5" />
                <line x1={zeroX} y1={topY} x2={topEpsX} y2={topY} stroke="#A3113E" strokeWidth="1.5" />
                <text x={topEpsX - 8} y={topY - 4} textAnchor="end" fontSize="9.5" fontWeight="bold" fill="#A3113E">
                  ε_o = {formatDeZahl(calc.eps_top, 3)} ‰ {calc.eps_top < 0 ? '(Druck)' : '(Zug!)'}
                </text>

                {/* Unterrand-Dehnungspunkt */}
                <circle cx={botEpsX} cy={botY} r="4" fill={calc.eps_bot > 0 ? '#dc2626' : '#059669'} stroke="#ffffff" strokeWidth="1.5" />
                <line x1={zeroX} y1={botY} x2={botEpsX} y2={botY} stroke={calc.eps_bot > 0 ? '#dc2626' : '#059669'} strokeWidth="1.5" />
                <text
                  x={botEpsX + (calc.eps_bot > 0 ? 8 : -8)}
                  y={botY + 5}
                  textAnchor={calc.eps_bot > 0 ? 'start' : 'end'}
                  fontSize="9.5"
                  fontWeight="bold"
                  fill={calc.eps_bot > 0 ? '#dc2626' : '#059669'}
                >
                  ε_u = {calc.eps_bot > 0 ? `+${formatDeZahl(calc.eps_bot, 3)}` : formatDeZahl(calc.eps_bot, 3)} ‰
                  {calc.eps_bot > 0 ? ' (Zug!)' : ' (Druck)'}
                </text>

                {/* Spanngliedebene Dehnungspunkt */}
                <circle cx={tendonEpsX} cy={tendonY} r="3" fill="#1e293b" />
                <text x={tendonEpsX + 8} y={tendonY + 3} fontSize="8" fill="#1e293b" fontStyle="italic">
                  ε_c(z_p) = {formatDeZahl(calc.eps_tendon, 3)} ‰
                </text>

                {/* Nulldurchgang / Neutrale Faser */}
                {calc.eps_top < 0 && calc.eps_bot > 0 && (
                  <g>
                    <line x1="90" y1={neutralY} x2="380" y2={neutralY} stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
                    <circle cx={zeroX} cy={neutralY} r="3.5" fill="#dc2626" />
                    <text x={zeroX + 8} y={neutralY - 3} fontSize="8.5" fill="#dc2626" fontWeight="bold">
                      Nulllinie: x = {formatDeZahl(calc.neutralAxisDepth, 0)} mm von Oberkante
                    </text>
                  </g>
                )}

                {/* Volle Überdrückung Hinweistext */}
                {calc.eps_bot <= 0 && calc.eps_top <= 0 && (
                  <g>
                    <rect x="280" y={midY - 14} width="175" height="28" fill="#f0fdf4" stroke="#86efac" rx="6" />
                    <text x="367" y={midY + 4} textAnchor="middle" fontSize="8.5" fill="#166534" fontWeight="bold">
                      Keine Zugdehnung im Querschnitt!
                    </text>
                  </g>
                )}
              </svg>
            )}

            {/* MODUS 2: SPANNUNGSVERTEILUNG σ(z) */}
            {activeDisplayMode === 'spannung' && (
              <svg viewBox="0 0 470 260" className="w-full h-56">
                <line x1={zeroX} y1={topY - 12} x2={zeroX} y2={botY + 20} stroke="#475569" strokeWidth="1.5" />
                <text x={zeroX} y={topY - 16} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">
                  σ = 0 MPa (Spannungsnulllinie)
                </text>

                {(() => {
                  const scaleSig = 4.5;
                  const topSigX = zeroX + calc.sigma_top * scaleSig;
                  const botSigX = zeroX + calc.sigma_bot * scaleSig;
                  const crSigX = zeroX + fctm * scaleSig;

                  return (
                    <>
                      {/* Betonzugfestigkeitslinie fctm */}
                      <line x1={crSigX} y1={topY} x2={crSigX} y2={botY} stroke="#f87171" strokeWidth="1" strokeDasharray="3 3" />
                      <text x={crSigX + 4} y={topY + 14} fontSize="8" fill="#dc2626">f_ctm = {formatDeZahl(fctm, 1)} MPa</text>

                      {/* Druckflächenfüllung */}
                      <polygon
                        points={`${zeroX},${topY} ${topSigX},${topY} ${botSigX < zeroX ? botSigX : zeroX},${botSigX < zeroX ? botY : neutralY} ${zeroX},${botSigX < zeroX ? botY : neutralY}`}
                        fill="rgba(5, 150, 105, 0.18)"
                      />

                      {/* Zugflächenfüllung */}
                      {calc.sigma_bot > 0 && (
                        <polygon
                          points={`${zeroX},${neutralY} ${botSigX},${botY} ${zeroX},${botY}`}
                          fill="rgba(239, 68, 68, 0.25)"
                        />
                      )}

                      {/* Spannungsgerade */}
                      <line x1={topSigX} y1={topY} x2={botSigX} y2={botY} stroke="#059669" strokeWidth="2.8" />
                      <circle cx={topSigX} cy={topY} r="4" fill="#059669" />
                      <circle cx={botSigX} cy={botY} r="4" fill={calc.sigma_bot > 0 ? '#dc2626' : '#059669'} />

                      <text x={topSigX - 8} y={topY - 4} textAnchor="end" fontSize="9.5" fontWeight="bold" fill={calc.sigma_top > 0 ? '#dc2626' : '#059669'}>
                        σ_o = {calc.sigma_top > 0 ? `+${formatDeZahl(calc.sigma_top, 2)}` : formatDeZahl(calc.sigma_top, 2)} MPa {calc.sigma_top > 0 ? '(Zug!)' : '(Druck)'}
                      </text>
                      <text
                        x={botSigX + (calc.sigma_bot > 0 ? 8 : -8)}
                        y={botY + 5}
                        textAnchor={calc.sigma_bot > 0 ? 'start' : 'end'}
                        fontSize="9.5"
                        fontWeight="bold"
                        fill={calc.sigma_bot > fctm ? '#dc2626' : calc.sigma_bot > 0 ? '#d97706' : '#059669'}
                      >
                        σ_u = {calc.sigma_bot > 0 ? `+${formatDeZahl(calc.sigma_bot, 2)}` : formatDeZahl(calc.sigma_bot, 2)} MPa
                      </text>
                    </>
                  );
                })()}
              </svg>
            )}

            {/* MODUS 3: SUPERPOSITION */}
            {activeDisplayMode === 'superposition' && (
              <div className="grid grid-cols-4 gap-2 text-center text-xs py-2">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 block">1. Längskraft P</span>
                  <div className="text-xs font-mono font-bold text-shiraz">
                    σ_N = {formatDeZahl(calc.sigma_N, 1)} MPa
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    ε_N = {formatDeZahl(calc.eps_N, 3)} ‰
                  </div>
                  <span className="text-[9px] text-slate-400 block">Zentrischer Druck über gesamten Querschnitt</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 block">2. Vormoment M_p</span>
                  <div className="text-xs font-mono font-bold text-purple-700">
                    M_p = {formatDeZahl(calc.Mp, 0)} kNm
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    σ_Mp = {formatDeZahl((-calc.Mp * 1e6) / Wc, 1)} MPa
                  </div>
                  <span className="text-[9px] text-slate-400 block">
                    {tendonTrajectory === 'centric' ? 'Kein Vormoment (ep = 0)' : 'Gegenkrümmung durch Exzentrizität'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 block">3. Lastmoment M_q</span>
                  <div className="text-xs font-mono font-bold text-slate-800">
                    M_q = +{formatDeZahl(calc.Mq, 0)} kNm
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    σ_Mq = {formatDeZahl((calc.Mq * 1e6) / Wc, 1)} MPa
                  </div>
                  <span className="text-[9px] text-slate-400 block">
                    {viewSection === 'support' ? 'Am Auflager M_q = 0' : 'Biegemoment aus Gleichlast q'}
                  </span>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-300 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-900 block">Σ Resultierende</span>
                  <div className="text-xs font-mono font-bold text-emerald-800">
                    σ_u = {formatDeZahl(calc.sigma_bot, 2)} MPa
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono">
                    ε_u = {formatDeZahl(calc.eps_bot, 3)} ‰
                  </div>
                  <span className="text-[9px] text-emerald-600 font-bold block">
                    {calc.sigma_bot <= 0 ? '✓ Voll überdrückt' : 'Zug am Unterrand'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* DETAIL-KENNZAHLEN DES QUERSCHNITTS */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Oberrand-Dehnung ε_o</span>
              <span className="font-mono font-bold text-shiraz text-sm">
                {formatDeZahl(calc.eps_top, 3)} ‰
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                (σ_o = {formatDeZahl(calc.sigma_top, 1)} MPa)
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Unterrand-Dehnung ε_u</span>
              <span className={`font-mono font-bold text-sm ${
                calc.eps_bot > 0 ? 'text-red-600' : 'text-emerald-700'
              }`}>
                {calc.eps_bot > 0 ? `+${formatDeZahl(calc.eps_bot, 3)}` : formatDeZahl(calc.eps_bot, 3)} ‰
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {calc.eps_bot <= 0 ? 'Voll überdrückt' : 'Zugdehnung'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Nulllinie Tiefe x</span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                {calc.sigma_top <= 0 && calc.sigma_bot <= 0
                  ? 'Außerhalb (Voll überdrückt)'
                  : calc.sigma_top > 0 && calc.sigma_bot > 0
                  ? 'Außerhalb (Vollzug)'
                  : `${formatDeZahl(calc.neutralAxisDepth, 0)} mm`}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {calc.sigma_top <= 0 && calc.sigma_bot <= 0
                  ? '100% Druckzone'
                  : calc.sigma_top > 0 && calc.sigma_bot <= 0
                  ? `${formatDeZahl(Math.max(0, Math.min(100, (1 - calc.neutralAxisDepth / h) * 100)), 0)}% Druckzone (unten)`
                  : `${formatDeZahl(Math.max(0, Math.min(100, (calc.neutralAxisDepth / h) * 100)), 0)}% Druckzone (oben)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DIDAKTISCHE SCHLÜSSELERKENNTNISSE NACH DIN EN 1992-1-1 */}
      <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Sparkles className="text-shiraz h-4 w-4" />
            Tragwerksmechanischer Vergleich der 3 Spanngliedlagen:
          </h4>
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-[11px] text-shiraz font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            {showExplanation ? 'Erläuterung einklappen' : 'Erläuterung ausklappen'}
          </button>
        </div>

        {showExplanation && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-slate-700 pt-1">
            <div className={`p-3 bg-white rounded-lg border space-y-1.5 ${tendonTrajectory === 'centric' ? 'border-shiraz shadow-xs' : 'border-slate-200'}`}>
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                a) Zentrisch in Schwerachse
              </span>
              <p>
                <strong>Prinzip:</strong> <InlineMath math="e_p = 0 \rightarrow M_P = 0" />. Reine Längsdruckspannung <InlineMath math="\sigma_N = -P/A_c" /> ohne Vorkrümmung und ohne Umlenkkräfte (<InlineMath math="u = 0" />).
              </p>
              <p className="text-[11px] text-slate-500">
                <strong>Einsatzgebiet:</strong> Reine Zugglieder (z. B. Hängestangen, Behälterringvorspannung, Pfähle). Bei Biegung ineffizient, da kein innerer Hebelarm zur Zugentlastung genutzt wird.
              </p>
            </div>

            <div className={`p-3 bg-white rounded-lg border space-y-1.5 ${tendonTrajectory === 'straight_bottom' ? 'border-shiraz shadow-xs' : 'border-slate-200'}`}>
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                b) Gerade unten (Abstand Betondeckung)
              </span>
              <p>
                <strong>Prinzip:</strong> <InlineMath math="e_p = \text{konst.}" />. Hohes entlastendes Vormoment in Feldmitte (<InlineMath math="-P \cdot e_p" />), jedoch <strong>konstant über die gesamte Trägerlänge</strong>.
              </p>
              <p className="text-[11px] text-red-800">
                <strong>Auflagerproblem:</strong> Da am Auflager <InlineMath math="M_q = 0" /> ist, erzeugt das Vormoment hohe <strong>Kopfzugspannungen an der Trägeroberseite</strong> (<InlineMath math="\sigma_o > 0" />). Abhilfe erfordert Hüllrohre („debonding“) oder Abbiegungen.
              </p>
            </div>

            <div className={`p-3 bg-white rounded-lg border space-y-1.5 ${tendonTrajectory === 'parabolic' ? 'border-shiraz shadow-xs' : 'border-slate-200'}`}>
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                c) Parabolisch (Momenteneinwirkung)
              </span>
              <p>
                <strong>Prinzip (Idealfall):</strong> Das Kabel folgt dem Parabelverlauf des Feldmoments. Am Auflager zentrisch (<InlineMath math="e_p = 0 \rightarrow \sigma_o = \sigma_N < 0" /> keine Kopfzugrisse!), in Feldmitte maximaler Stich <InlineMath math="f" />.
              </p>
              <p className="text-[11px] text-emerald-800">
                <strong>Lastausgleich:</strong> Die kontinuierlichen Umlenkkräfte <InlineMath math="u = 8 P f / L^2" /> heben die äußere Last <InlineMath math="q" /> direkt auf. Bei <InlineMath math="u = q" /> bleibt der Träger vollkommen eben!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
