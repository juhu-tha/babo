import { formatDeIntl } from '@/src/utils/numberFormat';
import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, Sliders, Timer, FlaskConical } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions, LegendItem, Point } from 'chart.js';
import '@/src/lib/chartSetup';
import { simulate, T_RAMP, type Control, type LoadKey, type ModelKey } from '@/src/utils/rheologySim';

// ---------------------------------------------------------------------------
// Simulation rheologischer Modelle – Oberfläche zum validierten Rechenkern
// src/utils/rheologySim.ts. Einheiten: Spannung MPa (Bingham: Pa), Zeit s,
// Dehnung intern dimensionslos, Anzeige in ‰ (Bingham: Scherung γ in –).
// ---------------------------------------------------------------------------

type PresetKey =
  | 'beton' | 'spannstahl' | 'bitumen' | 'asphalt' | 'holz' | 'b500b' | 's355' | 'frischbeton' | 'svb';

const INFOS: Record<ModelKey, { name: string; desc: string }> = {
  hooke: { name: 'Hooke', desc: 'Reinelastisch' },
  newton: { name: 'Newton', desc: 'Reinviskose Flüssigkeit' },
  st_venant: { name: 'St. Venant', desc: 'Starr-plastisch' },
  prandtl: { name: 'Prandtl', desc: 'Elastisch-idealplastisch' },
  elasto_plastic: { name: 'Elasto-Plastisch mit Verfestigung', desc: 'Bilinear (E, f_y, E_t)' },
  maxwell: { name: 'Maxwell', desc: 'Viskoelastisch (Relaxation)' },
  kelvin: { name: 'Kelvin-Voigt', desc: 'Verzögert elastisch (Kriechen)' },
  zener: { name: 'Zener (SLS)', desc: 'Viskoelastischer Festkörper' },
  bingham: { name: 'Bingham', desc: 'Viskoplastisches Fluid (Frischbeton)' },
};

const LOADS: { key: LoadKey; label: string; title: string; icon: React.ReactNode }[] = [
  { key: 'kriechen', label: 'Kriechen', title: 'σ = σ0 von 1 bis 5 s, danach Rückkriechen',
    icon: <div className="w-8 h-4 border-t-2 border-r-2 border-l-2 border-b-0 mb-2 border-current" /> },
  { key: 'relaxieren', label: 'Relaxieren', title: 'ε = ε0 von 1 bis 7 s, danach ε = 0',
    icon: <svg aria-hidden="true" width="32" height="16" viewBox="0 0 32 16" className="mb-2 fill-none stroke-current" strokeWidth="2"><path d="M 0 16 L 4 16 L 4 2 Q 12 4 24 12 L 28 16 L 32 16" /></svg> },
  { key: 'dreieck', label: 'Dreieck', title: 'Dreieckförmige Be- und Entlastung (1–5 s)',
    icon: <svg aria-hidden="true" width="32" height="16" viewBox="0 0 32 16" className="mb-2 fill-none stroke-current" strokeWidth="2" strokeLinejoin="round"><path d="M 0 16 L 16 2 L 32 16" /></svg> },
  { key: 'sinus', label: 'Zyklisch', title: 'Zwei Sinuszyklen (T = 4 s) zwischen −Amplitude und +Amplitude',
    icon: <svg aria-hidden="true" width="32" height="16" viewBox="0 0 32 16" className="mb-2 fill-none stroke-current" strokeWidth="2"><path d="M 0 16 Q 8 2 16 9 T 32 0" /></svg> },
  { key: 'stufenweise', label: 'Stufen', title: 'Stufen 1/3 – 2/3 – 1 – 1/2 – 0 der Amplitude (bei 1, 3, 5, 7, 9 s)',
    icon: <svg aria-hidden="true" width="32" height="16" viewBox="0 0 32 16" className="mb-2 fill-none stroke-current" strokeWidth="2" strokeLinejoin="round"><path d="M 0 16 L 0 10 L 10 10 L 10 4 L 20 4 L 20 12 L 30 12 L 30 16" /></svg> },
  { key: 'impuls', label: 'Impuls', title: 'Drei Rechteckimpulse von je 0,5 s (bei 1, 4, 7 s)',
    icon: <svg aria-hidden="true" width="32" height="16" viewBox="0 0 32 16" className="mb-2 fill-none stroke-current" strokeWidth="2" strokeLinejoin="round"><path d="M 0 16 L 4 16 L 4 4 L 8 4 L 8 16 L 16 16 L 16 4 L 20 4 L 20 16 L 32 16" /></svg> },
];

/** Zeitpunkte der Lastsprünge je Lastfall (für das Ausblenden von Spannungsspitzen). */
const EDGES: Record<LoadKey, number[]> = {
  kriechen: [1, 5], relaxieren: [1, 7], dreieck: [], sinus: [], stufenweise: [1, 3, 5, 7, 9], impuls: [1, 1.5, 4, 4.5, 7, 7.5],
};

const PRESETS: { key: PresetKey; label: string; apply: Partial<State> }[] = [
  { key: 'beton', label: 'Normalbeton C30/37 (Kriechen)', apply: { model: 'zener', load: 'kriechen', E_GPa: 33, phi: 2.0, tau: 3, sigma0: 10 } },
  { key: 'spannstahl', label: 'Spannstahl Y1860 (Relaxation)', apply: { model: 'zener', load: 'relaxieren', E_GPa: 195, phi: 0.03, tau: 2, eps0_pm: 6.7 } },
  { key: 'bitumen', label: 'Bitumen 50/70 (Gebrauchstemperatur)', apply: { model: 'maxwell', load: 'relaxieren', E_GPa: 0.1, tau: 2, sigma0: 0.5, eps0_pm: 5 } },
  { key: 'asphalt', label: 'Asphaltbeton AC 11 (20 °C)', apply: { model: 'zener', load: 'kriechen', E_GPa: 6, phi: 1.5, tau: 2, sigma0: 1 } },
  { key: 'holz', label: 'Nadelholz C24 (NKL 1)', apply: { model: 'zener', load: 'kriechen', E_GPa: 11, phi: 0.6, tau: 3, sigma0: 5 } },
  { key: 'b500b', label: 'Betonstahl B500B', apply: { model: 'elasto_plastic', load: 'dreieck', control: 'stress', E_GPa: 200, fy: 500, Et_pct: 1, sigma0: 540 } },
  { key: 's355', label: 'Baustahl S355 (zyklisch)', apply: { model: 'prandtl', load: 'sinus', control: 'strain', E_GPa: 210, fy: 355, eps0_pm: 4 } },
  { key: 'frischbeton', label: 'Frischbeton F3', apply: { model: 'bingham', load: 'kriechen', tau0_Pa: 500, mu_Pas: 50, tauAmp_Pa: 800 } },
  { key: 'svb', label: 'Selbstverdichtender Beton (SVB)', apply: { model: 'bingham', load: 'kriechen', tau0_Pa: 30, mu_Pas: 80, tauAmp_Pa: 100 } },
];

interface State {
  model: ModelKey;
  load: LoadKey;
  control: Control;
  E_GPa: number;      // E bzw. Sofortmodul E0 = E1 + E2 (Zener)
  tau: number;        // Relaxations-/Retardationszeit [s]
  etaN_GPas: number;  // Newton: Viskosität [GPa·s]
  phi: number;        // Zener: Kriechzahl φ = E2/E1
  fy: number;         // Fließgrenze [MPa]
  Et_pct: number;     // Tangentenmodul in % von E
  sigma0: number;     // Spannungsamplitude [MPa]
  eps0_pm: number;    // Dehnungsamplitude [‰]
  tau0_Pa: number;    // Bingham: Fließgrenze [Pa]
  mu_Pas: number;     // Bingham: plastische Viskosität [Pa·s]
  tauAmp_Pa: number;  // Bingham: Scherspannung [Pa]
  gamma0: number;     // Bingham: Scherung [–]
}

const INITIAL: State = {
  model: 'maxwell', load: 'relaxieren', control: 'stress',
  E_GPa: 30, tau: 2, etaN_GPas: 60, phi: 1.5, fy: 20, Et_pct: 2, sigma0: 15, eps0_pm: 1,
  tau0_Pa: 500, mu_Pas: 50, tauAmp_Pa: 800, gamma0: 1,
};

// Logarithmischer Regler E 0,1 … 210 GPa
const E_MIN = 0.1, E_MAX = 210;
const eToPos = (e: number) => (Math.log10(e / E_MIN) / Math.log10(E_MAX / E_MIN)) * 1000;
const posToE = (p: number) => {
  const v = E_MIN * Math.pow(E_MAX / E_MIN, p / 1000);
  return v >= 10 ? Math.round(v) : v >= 1 ? Math.round(v * 10) / 10 : Math.round(v * 100) / 100;
};

const de = (v: number, d = 3) => formatDeIntl(v, { maximumFractionDigits: d });

function Param({ label, value, unit, info, min, max, step, onChange, display }: {
  label: React.ReactNode; value: number; unit: string; info?: React.ReactNode;
  min: number; max: number; step: number; onChange: (v: number) => void; display?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center gap-2">
        <label className="text-sm font-medium text-text-main">{label}</label>
        <span className="text-sm font-bold text-shiraz whitespace-nowrap">{display ?? de(value)} {unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-home-grau/30 rounded-lg appearance-none cursor-pointer accent-shiraz" />
      {info && <div className="text-[11px] text-text-main/60 leading-snug">{info}</div>}
    </div>
  );
}

export function RheologySimulator({ renderCircuit }: { renderCircuit?: (model: ModelKey, name: string) => React.ReactNode } = {}) {
  const [s, setS] = useState<State>(INITIAL);
  const [hystScaleMode, setHystScaleMode] = useState<'autoMax' | 'zoom'>('autoMax');
  const set = (patch: Partial<State>) => setS(prev => ({ ...prev, ...patch }));

  const isBingham = s.model === 'bingham';
  const control: Control = s.load === 'kriechen' ? 'stress' : s.load === 'relaxieren' ? 'strain' : s.control;
  const cyclic = s.load !== 'kriechen' && s.load !== 'relaxieren';

  // Abgeleitete Kennwerte
  const E = s.E_GPa * 1000; // MPa
  const phiEff = Math.max(0.01, s.phi);
  const E1 = E / (1 + phiEff), E2 = (E * phiEff) / (1 + phiEff);
  const eta = s.model === 'zener' ? s.tau * E2 : s.model === 'newton' ? s.etaN_GPas * 1000 : s.tau * E; // MPa·s
  const Et = (s.Et_pct / 100) * E;
  const H = Et < E ? (E * Et) / (E - Et) : Infinity;

  const result = useMemo(() => {
    if (isBingham) {
      // Einheitenneutraler Kern: Werte in Pa bzw. Pa·s übergeben
      return simulate('bingham', s.load, {
        E: 1, eta: Math.max(1e-6, s.mu_Pas), fy: Math.max(1e-6, s.tau0_Pa), Et: 0,
        sigma0: s.tauAmp_Pa, eps0: s.gamma0,
      }, control);
    }
    return simulate(s.model, s.load, {
      E, E1, E2, eta, fy: s.fy, Et, sigma0: s.sigma0, eps0: s.eps0_pm / 1000,
    }, control);
  }, [s, E, E1, E2, eta, Et, control, isBingham]);

  // Anzeige-Skalierung
  const epsScale = isBingham ? 1 : 1000;               // ‰ bzw. –
  const sigUnit = isBingham ? 'Pa' : 'MPa';
  const epsUnit = isBingham ? '–' : '‰';
  const sigName = isBingham ? 'Scherspannung τ' : 'Spannung σ';
  const epsName = isBingham ? 'Scherung γ' : 'Dehnung ε';
  const energyFactor = isBingham ? 1 : 1000;           // MPa → kJ/m³ ; Pa → J/m³
  const energyUnit = isBingham ? 'J/m³' : 'kJ/m³';

  const sigPts = result.t.map((t, i) => ({ x: t, y: result.sigma[i] as number | null }));
  const epsPts = result.t.map((t, i) => ({ x: t, y: result.eps[i] === null ? null : (result.eps[i] as number) * epsScale }));
  const sePts = result.t
    .map((_, i) => (result.eps[i] === null || result.sigma[i] === null ? null : { x: (result.eps[i] as number) * epsScale, y: result.sigma[i] as number }))
    .filter((p): p is { x: number; y: number } => p !== null);

  // Spannungsspitzen beim Dehnungssprung ausblenden (Achse auf 1,2-fachen Wert außerhalb der Rampen begrenzen)
  const sigAxis = useMemo(() => {
    const edges = EDGES[s.load];
    let maxAll = 0, maxOut = 0, minOut = 0;
    result.t.forEach((t, i) => {
      const v = result.sigma[i];
      if (v === null) return;
      maxAll = Math.max(maxAll, Math.abs(v));
      const nearEdge = edges.some(e => t >= e - 1e-9 && t <= e + T_RAMP + 0.06);
      if (!nearEdge) { maxOut = Math.max(maxOut, v); minOut = Math.min(minOut, v); }
    });
    const clip = result.spikePeak !== null && maxAll > 1.5 * Math.max(Math.abs(maxOut), Math.abs(minOut), 1e-9);
    if (!clip) return { clip: false as const };
    const span = Math.max(Math.abs(maxOut), Math.abs(minOut), 1e-9);
    return { clip: true as const, max: maxOut > 0 ? maxOut * 1.2 : span * 0.2, min: minOut < 0 ? minOut * 1.2 : 0 };
  }, [result, s.load]);

  const hyst = useMemo(() => {
    if (!sePts.length) return null;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of sePts) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); }
    if (sigAxis.clip) { maxY = Math.min(maxY, sigAxis.max); minY = Math.max(minY, sigAxis.min); }
    const sx = Math.max(1e-6, maxX - minX), sy = Math.max(1e-6, maxY - minY);
    if (hystScaleMode === 'autoMax') {
      return { minX: Math.min(0, minX - 0.05 * sx), maxX: Math.max(0, maxX + 0.05 * sx), minY: Math.min(0, minY - 0.05 * sy), maxY: Math.max(0, maxY + 0.05 * sy), peakX: maxX, peakY: maxY };
    }
    return { minX: minX - 0.05 * sx, maxX: maxX + 0.05 * sx, minY: minY - 0.05 * sy, maxY: maxY + 0.05 * sy, peakX: maxX, peakY: maxY };
  }, [sePts, hystScaleMode, sigAxis]);

  const tick = (v: string | number) => (typeof v === 'number' ? de(v) : v);
  const baseOptions: ChartOptions<'line'> = {
    responsive: true, maintainAspectRatio: false, animation: false, locale: 'de-DE', spanGaps: false,
    elements: { line: { borderWidth: 2.5, tension: 0 }, point: { radius: 0 } },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (c) => `${c.dataset.label || ''}: ${de(c.parsed.y as number)} (x = ${de(c.parsed.x as number)})` } },
    },
  };
  const timeAxis = {
    type: 'linear' as const, min: 0, max: 10,
    title: { display: true, text: 'Zeit t (s)', color: '#1e293b', font: { size: 12, weight: 'bold' as const } },
    ticks: { stepSize: 1, color: '#475569', font: { size: 11 }, callback: tick },
    grid: { color: 'rgba(0,0,0,0.06)' },
  };

  const failLine = result.failed && result.tFail !== null
    ? [{ label: 'Traglastversagen', data: [{ x: result.tFail, y: Math.min(0, ...epsPts.map(p => p.y ?? 0)) }, { x: result.tFail, y: Math.max(...epsPts.map(p => p.y ?? 0), 1e-6) * 1.1 }],
        borderColor: '#dc2626', borderDash: [6, 4], borderWidth: 1.5, fill: false }]
    : [];

  const relax = result.relax;
  const times = result.times;
  const plasticNoRelax = ['hooke', 'newton', 'st_venant', 'prandtl', 'elasto_plastic', 'bingham'].includes(s.model);
  const sigma0Exceeds = (s.model === 'prandtl' || s.model === 'st_venant') && control === 'stress' && s.sigma0 > s.fy;

  return (
    <div className="flex flex-col gap-8">
      {/* Modellwahl */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(INFOS) as ModelKey[]).map(m => (
          <button key={m} type="button" onClick={() => set({ model: m })}
            className={`px-4 py-2.5 rounded-2xl text-left transition-all duration-200 cursor-pointer ${s.model === m ? 'bg-shiraz text-white shadow-md font-bold' : 'bg-off-white text-text-main border border-home-grau/30 hover:border-shiraz hover:bg-white'}`}>
            <div className="text-xs font-bold leading-tight">{INFOS[m].name}</div>
            <div className={`text-[10px] mt-0.5 ${s.model === m ? 'text-white/80' : 'text-text-main/60'}`}>{INFOS[m].desc}</div>
          </button>
        ))}
      </div>

      {/* Werkstoff-Presets */}
      <div className="bg-off-white border border-home-grau/30 rounded-2xl p-4 space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-text-main/70 flex items-center gap-1.5">
          <FlaskConical size={14} className="text-shiraz" /> Werkstoff-Presets (zeitgeraffte Lehrwerte)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button key={p.key} type="button" onClick={() => set(p.apply)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-home-grau/30 hover:border-shiraz hover:text-shiraz cursor-pointer">
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-text-main/60">
          Zeitachse didaktisch gerafft – reale Kriech- und Relaxationszeiten liegen bei Stunden bis Jahren; Spannstahlrelaxation verläuft real annähernd log-linear in der Zeit.
        </p>
      </div>

      {/* Warnungen */}
      {result.failed && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="text-amber-700 shrink-0 mt-0.5" size={16} />
          <div>
            <strong>Traglastversagen bei t = {de(result.tFail ?? 0, 2)} s:</strong> Unter Kraftsteuerung kann das Modell ohne Verfestigung keine Spannung
            <InlineMath math="|\sigma| > f_y" /> aufnehmen – die Dehnung wächst unbegrenzt (ε → ∞). Für Nachfließen mit Verfestigung das Modell
            <strong> „Elasto-Plastisch mit Verfestigung“</strong> wählen oder auf weggesteuert umstellen.
          </div>
        </div>
      )}
      {!result.failed && sigma0Exceeds && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">Hinweis: σ₀ &gt; f_y – unter Kraftsteuerung tritt Traglastversagen ein.</div>
      )}

      {/* Einwirkungen & Parameter */}
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-text-main uppercase tracking-widest text-xs flex items-center gap-2">
          <Sliders size={14} className="text-shiraz" /> Einwirkungen &amp; Parameter
        </h3>
        <div className={`grid grid-cols-1 gap-6 ${renderCircuit ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {LOADS.map(l => (
                <button key={l.key} type="button" onClick={() => set({ load: l.key })} title={l.title}
                  className={`flex flex-col items-center justify-center py-4 border rounded-2xl transition-all cursor-pointer ${s.load === l.key ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-sm' : 'border-home-grau/30 text-text-main/60 bg-off-white hover:bg-white'}`}>
                  {l.icon}
                  <span className="text-[10px] uppercase tracking-wider">{l.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-text-main/70">Steuerung:</span>
              {cyclic ? (
                <div className="inline-flex rounded-lg border border-home-grau/30 bg-slate-100 p-0.5">
                  {(['stress', 'strain'] as Control[]).map(c => (
                    <button key={c} type="button" onClick={() => set({ control: c })}
                      className={`px-2.5 py-1 rounded-md cursor-pointer ${s.control === c ? 'bg-shiraz text-white font-bold' : 'text-slate-600'}`}>
                      {c === 'stress' ? 'kraftgesteuert' : 'weggesteuert'}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-text-main/70">{control === 'stress' ? 'kraftgesteuert (Kriechversuch)' : 'weggesteuert (Relaxationsversuch)'}</span>
              )}
            </div>
          </div>

          <div className="space-y-4 bg-white p-5 rounded-3xl border border-home-grau/30 shadow-sm">
            {isBingham ? (
              <>
                {control === 'stress' ? (
                  <Param label={<>Scherspannung <InlineMath math="\tau" /></>} value={s.tauAmp_Pa} unit="Pa" min={10} max={3000} step={10} onChange={v => set({ tauAmp_Pa: v })} />
                ) : (
                  <Param label={<>Scherung <InlineMath math="\gamma_0" /></>} value={s.gamma0} unit="–" min={0.1} max={5} step={0.1} onChange={v => set({ gamma0: v })} />
                )}
                <Param label={<>Fließgrenze <InlineMath math="\tau_0" /></>} value={s.tau0_Pa} unit="Pa" min={0} max={2000} step={10} onChange={v => set({ tau0_Pa: v })} />
                <Param label={<>plastische Viskosität <InlineMath math="\mu_p" /></>} value={s.mu_Pas} unit="Pa·s" min={5} max={300} step={5} onChange={v => set({ mu_Pas: v })}
                  info="Bingham-Körper in Scherung: γ̇ = (|τ| − τ₀)/μp für |τ| > τ₀." />
              </>
            ) : (
              <>
                {control === 'stress' ? (
                  <Param label={<>Spannungsamplitude <InlineMath math="\sigma_0" /></>} value={s.sigma0} unit="MPa" min={0.1} max={800} step={0.1} onChange={v => set({ sigma0: v })} />
                ) : (
                  <Param label={<>aufgeprägte Dehnung <InlineMath math="\varepsilon_0" /></>} value={s.eps0_pm} unit="‰" min={0.1} max={10} step={0.1} onChange={v => set({ eps0_pm: v })} />
                )}
                {s.model !== 'newton' && s.model !== 'st_venant' && (
                  <Param label={s.model === 'zener' ? <>Sofortmodul <InlineMath math="E_0 = E_1 + E_2" /></> : <>Elastizitätsmodul <InlineMath math="E" /></>}
                    value={Math.round(eToPos(s.E_GPa))} display={de(s.E_GPa, 2)} unit="GPa" min={0} max={1000} step={1} onChange={v => set({ E_GPa: posToE(v) })} />
                )}
                {(s.model === 'maxwell' || s.model === 'kelvin' || s.model === 'zener') && (
                  <Param label={<>{s.model === 'kelvin' ? 'Retardationszeit' : 'Relaxationszeit'} <InlineMath math={s.model === 'zener' ? '\\tau_\\sigma' : '\\tau'} /></>}
                    value={s.tau} unit="s" min={0.5} max={10} step={0.1} onChange={v => set({ tau: v })}
                    info={<>abgeleitet: η = {de(eta / 1000, 2)} GPa·s{s.model === 'zener' ? ' (η = τ_σ·E₂)' : ' (η = τ·E)'}</>} />
                )}
                {s.model === 'zener' && (
                  <Param label={<>Kriechzahl <InlineMath math="\varphi = E_2/E_1" /></>} value={s.phi} unit="" min={0} max={4} step={0.01} onChange={v => set({ phi: v })}
                    info={<>E₁ = E₀/(1+φ) = {de(E1 / 1000, 2)} GPa, E₂ = E₀·φ/(1+φ) = {de(E2 / 1000, 2)} GPa; ε∞ = (1+φ)·ε_el</>} />
                )}
                {s.model === 'newton' && (
                  <Param label={<>Viskosität <InlineMath math="\eta" /></>} value={s.etaN_GPas} unit="GPa·s" min={1} max={500} step={1} onChange={v => set({ etaN_GPas: v })} />
                )}
                {(s.model === 'st_venant' || s.model === 'prandtl' || s.model === 'elasto_plastic') && (
                  <Param label={<>Fließgrenze <InlineMath math="f_y" /></>} value={s.fy} unit="MPa" min={5} max={600} step={1} onChange={v => set({ fy: v })} />
                )}
                {s.model === 'elasto_plastic' && (
                  <Param label={<>Tangentenmodul <InlineMath math="E_t" /></>} value={s.Et_pct} unit="% von E" min={0} max={10} step={0.1} onChange={v => set({ Et_pct: v })}
                    info={<>E_t = {de(Et, 0)} MPa; H = E·E_t/(E−E_t) = {Number.isFinite(H) ? de(H, 0) : '∞'} MPa (Feder parallel zum Reibelement)</>} />
                )}
              </>
            )}
          </div>
          {renderCircuit && renderCircuit(s.model, INFOS[s.model].name)}
        </div>
      </div>

      {/* Relaxations-Cockpit */}
      {s.load === 'relaxieren' && relax && (
        <div className="bg-purple-50/70 border border-purple-200 rounded-3xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200/60 pb-3">
            <h4 className="text-sm font-bold text-purple-950 tracking-wide flex items-center gap-1.5">
              <Timer size={16} className="text-purple-700" /> Live-Cockpit Spannungsrelaxation (ε = konst.)
            </h4>
            <span className="text-xs font-mono font-semibold text-purple-900 px-3 py-1 rounded-full border border-purple-300">Modell: {INFOS[s.model].name}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {[
              { k: `Aufgeprägte ${isBingham ? 'Scherung γ₀' : 'Dehnung ε₀'}`, v: isBingham ? `${de(s.gamma0, 2)} –` : `${de(s.eps0_pm, 2)} ‰` },
              { k: 'Anfangsspannung σ(t = 1,06 s)', v: `${de(relax.sigmaStart, 2)} ${sigUnit}` },
              { k: 'Restspannung σ(t = 7 s)', v: `${de(relax.sigmaEnd, 2)} ${sigUnit}` },
              { k: 'Relaxationsgrad R', v: `${de(relax.R, 1)} %`, sub: 'R = (σ_Start − σ_Ende)/σ_Start' },
              { k: 'theoretischer Endwert σ∞', v: relax.sigmaInf === null ? '—' : `${de(relax.sigmaInf, 2)} ${sigUnit}` },
            ].map(c => (
              <div key={c.k} className="bg-white p-3 rounded-2xl border border-purple-100 shadow-sm text-center">
                <span className="text-[10px] text-text-main/70 block font-semibold">{c.k}</span>
                <span className="font-mono font-bold text-base text-purple-900 block mt-1">{c.v}</span>
                {c.sub && <span className="text-[10px] text-slate-500 font-mono">{c.sub}</span>}
              </div>
            ))}
          </div>
          <div className="text-xs text-purple-950">
            <strong>Charakteristische Zeiten: </strong>
            {plasticNoRelax || times.length === 0
              ? '— (keine zeitabhängige Relaxation)'
              : times.map(t => `${t.label} = ${t.value === null ? '—' : de(t.value, 2) + ' s'}`).join(' · ')}
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-purple-100 text-xs text-text-main/80 leading-relaxed space-y-1.5">
            <div className="font-bold text-purple-950">Physikalischer Befund zum Modell „{INFOS[s.model].name}“:</div>
            <RelaxText model={s.model} />
          </div>
        </div>
      )}

      {/* Diagramme */}
      <div className="flex flex-col gap-6">
        <h3 className="font-bold text-text-main uppercase tracking-widest text-xs flex items-center gap-2">
          <Activity size={14} className="text-shiraz" /> Simulations-Ergebnisse
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="h-[300px] bg-white border border-home-grau/30 shadow-sm rounded-3xl p-5 flex flex-col">
            <div className="text-xs font-bold text-shiraz tracking-wider mb-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-shiraz" /> {sigName}(t)
            </div>
            {sigAxis.clip && result.spikePeak !== null && (
              <div className="text-[10px] text-amber-800 mb-1">
                Spannungsspitze beim Dehnungssprung ≈ {de(result.spikePeak, 1)} {sigUnit} (abgeschnitten; ideal ein Dirac-Impuls, hier Anstiegszeit 0,05 s)
              </div>
            )}
            <div className="grow w-full relative">
              <Line data={{ datasets: [{ label: `${sigName} (${sigUnit})`, data: sigPts, borderColor: '#A3113E', backgroundColor: 'rgba(163,17,62,0.12)', fill: true }] } as ChartData<'line', (Point | { x: number; y: number | null })[]>}
                options={{ ...baseOptions, scales: { x: timeAxis, y: {
                  title: { display: true, text: `${sigName} (${sigUnit})`, color: '#A3113E', font: { size: 12, weight: 'bold' } },
                  ticks: { color: '#64748b', font: { size: 11 }, callback: tick }, grid: { color: 'rgba(0,0,0,0.06)' },
                  ...(sigAxis.clip ? { min: sigAxis.min, max: sigAxis.max } : {}),
                } } }} />
            </div>
          </div>
          <div className="h-[300px] bg-white border border-home-grau/30 shadow-sm rounded-3xl p-5 flex flex-col">
            <div className="text-xs font-bold text-emerald-700 tracking-wider mb-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-600" /> {epsName}(t)
            </div>
            {result.failed && <div className="text-[10px] text-red-700 mb-1">{isBingham ? 'γ' : 'ε'} → ∞ (unbegrenztes Fließen) ab t = {de(result.tFail ?? 0, 2)} s</div>}
            <div className="grow w-full relative">
              <Line data={{ datasets: [{ label: `${epsName} (${epsUnit})`, data: epsPts, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.12)', fill: true }, ...failLine] } as ChartData<'line', (Point | { x: number; y: number | null })[]>}
                options={{ ...baseOptions, scales: { x: timeAxis, y: {
                  title: { display: true, text: `${epsName} (${epsUnit})`, color: '#059669', font: { size: 12, weight: 'bold' } },
                  ticks: { color: '#64748b', font: { size: 11 }, callback: tick }, grid: { color: 'rgba(0,0,0,0.06)' },
                } } }} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-home-grau/30 shadow-sm rounded-3xl p-5 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold text-blue-700 tracking-wider">{sigName}–{epsName}-Diagramm (Arbeit und Hysterese)</span>
            <div className="inline-flex rounded-lg border border-home-grau/30 bg-slate-100 p-0.5 text-xs font-medium">
              {(['autoMax', 'zoom'] as const).map(m => (
                <button key={m} type="button" onClick={() => setHystScaleMode(m)}
                  className={`px-2.5 py-1 rounded-md cursor-pointer ${hystScaleMode === m ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'}`}>
                  {m === 'autoMax' ? 'Auto-Max [0 → Max]' : 'Fokus-Zoom [Min → Max]'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono mb-3" title={isBingham ? '1 Pa = 1 J/m³' : '1 N/mm² = 1 MJ/m³ = 1000 kJ/m³'}>
            <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md">W_ext = ∫σ dε = {de(result.W_ext * energyFactor, 2)} {energyUnit}</span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">davon gespeichert W_el = {de(result.W_stored * energyFactor, 2)} {energyUnit}</span>
            <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md">
              dissipiert W_diss = {de(result.W_diss * energyFactor, 2)} {energyUnit}{result.closedCycle ? ' (= Hysteresefläche ∮σ dε)' : ''}
            </span>
            {!result.closedCycle && <span className="text-slate-500">offener Pfad – keine Hysteresefläche</span>}
          </div>
          <div className="h-[320px] w-full relative">
            <Line data={{ datasets: [
                { label: `${sigName}–${epsName}`, data: sePts, borderColor: '#2563eb', fill: false },
                ...(sePts.length ? [
                  { label: 'Start', data: [sePts[0]], pointRadius: 6, pointBackgroundColor: '#16a34a', borderColor: '#16a34a', showLine: false },
                  { label: 'Ende', data: [sePts[sePts.length - 1]], pointRadius: 6, pointBackgroundColor: '#dc2626', borderColor: '#dc2626', showLine: false },
                ] : []),
              ] } as ChartData<'line', (Point | { x: number; y: number | null })[]>}
              options={{ ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: true, labels: { filter: (i: LegendItem) => i.text === 'Start' || i.text === 'Ende', boxWidth: 10 } } },
                scales: {
                  x: { type: 'linear', min: hyst?.minX, max: hyst?.maxX,
                    title: { display: true, text: `${epsName} (${epsUnit})`, color: '#1e293b', font: { size: 12, weight: 'bold' } },
                    ticks: { color: '#475569', font: { size: 11 }, callback: tick, includeBounds: false }, grid: { color: 'rgba(0,0,0,0.06)' } },
                  y: { min: hyst?.minY, max: hyst?.maxY,
                    title: { display: true, text: `${sigName} (${sigUnit})`, color: '#2563eb', font: { size: 12, weight: 'bold' } },
                    ticks: { color: '#64748b', font: { size: 11 }, callback: tick, includeBounds: false }, grid: { color: 'rgba(0,0,0,0.06)' } },
                } }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RelaxText({ model }: { model: ModelKey }) {
  switch (model) {
    case 'maxwell':
      return <p>Bei t = 1 s wird die Dehnung ε₀ aufgebracht; die Feder übernimmt sofort σ₀ = E·ε₀. Unter konstanter Dehnung fließt der Dämpfer (<InlineMath math="\dot{\varepsilon}_D = \sigma/\eta" />) und entlastet die Feder: <InlineMath math="\sigma(t) = \sigma_0 \cdot e^{-(t-t_0)/\tau}" /> mit τ = η/E. Die Spannung relaxiert vollständig gegen null. Beim Zurückfahren auf ε = 0 entsteht eine Druckspannung, die ebenfalls abklingt.</p>;
    case 'kelvin':
      return <p className="text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200"><strong>Kelvin-Voigt kann nicht relaxieren:</strong> Feder und Dämpfer liegen parallel und erfahren dieselbe Dehnung. Bei konstanter Dehnung ist <InlineMath math="\dot{\varepsilon} = 0" />, der Dämpfer ist kraftlos und die Feder hält die volle Spannung (R = 0 %). Zusätzlich erfordert das sprunghafte Aufbringen der Dehnung eine unendlich große Dämpferkraft – in der Simulation als Spannungsspitze bei endlicher Anstiegszeit (0,05 s) sichtbar.</p>;
    case 'zener':
      return <p><InlineMath math="\sigma(t) = E_1 \varepsilon_0 + E_2 \varepsilon_0 \, e^{-(t-t_0)/\tau_\sigma}" /> mit τ_σ = η/E₂. Endwert <InlineMath math="\sigma_\infty = E_1 \varepsilon_0 = \sigma_0/(1+\varphi)" />. Unter Kriechlast ist die Retardationszeit τ_ε = η(E₁+E₂)/(E₁E₂) größer als τ_σ.</p>;
    case 'hooke':
      return <p>Reinelastischer Körper: reversibel ohne Dämpfung und Energieverluste. Die Spannung folgt dem Dehnungssprung (<InlineMath math="\sigma = E \cdot \varepsilon_0" />) und bleibt zeitlich unverändert.</p>;
    case 'newton':
      return <p>Ein Dehnungssprung erfordert eine unendliche Dehnrate (Dirac-Spannungsimpuls). Mit endlicher Anstiegszeit Δt wird σ = η·ε₀/Δt. In Ruhe (<InlineMath math="\dot{\varepsilon} = 0" />) ist σ = 0.</p>;
    case 'st_venant':
      return <p>Starr-plastisch: Solange |σ| &lt; f_y, keine Verformung. Bei weggesteuerter Verformung gleitet das Element mit |σ| = f_y; in Ruhe bleibt die Spannung (|σ| ≤ f_y) eingefroren.</p>;
    case 'prandtl':
      return <p>Ist ε₀ &gt; ε_y = f_y/E, wird die Spannung auf f_y begrenzt; es entsteht die plastische Dehnung ε_p = ε₀ − ε_y. Beim Zurückfahren auf ε = 0 verbleibt eine Eigenspannung σ = −E·ε_p (begrenzt auf −f_y). Keine Zeitabhängigkeit, daher keine Relaxation im eigentlichen Sinn.</p>;
    case 'elasto_plastic':
      return <p>Bei ε₀ &gt; ε_y steigt die Spannung entlang des Tangentenmoduls: <InlineMath math="\sigma = f_y + E_t (\varepsilon_0 - \varepsilon_y)" />. Keine Viskosität, daher keine zeitabhängige Relaxation. Beim Zurückfahren auf ε = 0 entsteht die Eigenspannung σ = σ_max − E·ε₀; Rückfließen (Bauschinger) setzt ein, sobald |σ − α| = f_y mit der Rückspannung α = H·ε_p.</p>;
    case 'bingham':
      return <p>Viskoplastisches Fluid: Fließen nur, solange |τ| &gt; τ₀, dann <InlineMath math="\dot{\gamma} = (|\tau| - \tau_0)/\mu_p" />. In Ruhe bleibt eine Restspannung |τ| ≤ τ₀ bestehen.</p>;
  }
}
