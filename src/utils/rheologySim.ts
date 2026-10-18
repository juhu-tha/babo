// rheologySim.ts — Rechenkern "Simulation Rheologischer Modelle" (BaustoffBoard)
// Reiner TypeScript-Code ohne React-Abhängigkeit. Einheiten: Spannung MPa, Zeit s,
// Moduln MPa, Viskosität MPa·s, Dehnung dimensionslos (Anzeige in ‰ = ×1000).
// Energiedichten: MPa = MJ/m³ = N·mm/mm³ (Anzeige in kJ/m³ = ×1000).

export type ModelKey =
  | 'hooke' | 'newton' | 'st_venant' | 'prandtl' | 'elasto_plastic'
  | 'maxwell' | 'kelvin' | 'zener' | 'bingham';

export type LoadKey = 'kriechen' | 'relaxieren' | 'dreieck' | 'sinus' | 'stufenweise' | 'impuls';

export type Control = 'stress' | 'strain';

export interface RheoParams {
  E: number;      // Federsteifigkeit E bzw. Sofortmodul E1+E2 beim Zener-Modell [MPa]
  E1?: number;    // Zener: Gleichgewichtsfeder E1 [MPa] (falls gesetzt, überschreibt Aufteilung)
  E2?: number;    // Zener: Feder im Maxwell-Ast E2 [MPa]
  eta: number;    // Viskosität η bzw. plastische Viskosität μp [MPa·s]
  fy: number;     // Fließgrenze f_y bzw. τ0 [MPa]
  Et: number;     // Tangentenmodul E_t nach Fließbeginn [MPa] (0 ≤ Et < E)
  sigma0: number; // Spannungsamplitude σ0 [MPa] (kraftgesteuerte Lastfälle)
  eps0: number;   // Dehnungsamplitude ε0 [-] (weggesteuerte Lastfälle, z. B. 0.002 = 2 ‰)
}

export interface RheoResult {
  t: number[];
  sigma: (number | null)[];
  eps: (number | null)[];
  control: Control;
  failed: boolean;          // Traglastversagen (unbegrenztes Fließen) unter Kraftsteuerung
  tFail: number | null;
  W_ext: number;            // zugeführte Formänderungsarbeit ∫σ dε [MPa = MJ/m³]
  W_stored: number;         // am Ende noch gespeicherte (elastische) Energie [MJ/m³]
  W_diss: number;           // dissipierte Arbeit = W_ext − W_stored [MJ/m³]
  closedCycle: boolean;     // Endzustand ≈ Anfangszustand → W_diss = Hysteresefläche
  times: { label: string; value: number | null }[]; // charakteristische Zeiten
  relax: null | {
    sigmaStart: number;     // Spannung direkt nach Aufbringen der Dehnung
    sigmaEnd: number;       // Spannung am Ende der Haltephase
    R: number;              // Relaxationsgrad [%]
    sigmaInf: number | null;// theoretischer Endwert σ∞
  };
  spikePeak: number | null; // Spannungsspitze bei Dehnungssprung (Newton/Kelvin/Bingham)
}

export const DT = 0.01;      // Zeitschritt [s]
export const T_END = 10;     // Simulationsdauer [s]
export const T_RAMP = 0.05;  // Anstiegszeit eines "Sprungs" [s] (endliche Rate statt Dirac)
export const NSUB = 10;      // Unterschritte je Ausgabeschritt
const h = DT / NSUB;

/** Normierte Lastfunktion g(t) ∈ [-1, 1]; wird mit σ0 bzw. ε0 multipliziert. */
export function loadShape(load: LoadKey, t: number): number {
  const ramp = (a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  switch (load) {
    case 'kriechen':    return ramp(1, 1 + T_RAMP) - ramp(5, 5 + T_RAMP);          // 1 s … 5 s
    case 'relaxieren':  return ramp(1, 1 + T_RAMP) - ramp(7, 7 + T_RAMP);          // 1 s … 7 s
    case 'dreieck':     return t < 1 ? 0 : t < 3 ? (t - 1) / 2 : t < 5 ? 1 - (t - 3) / 2 : 0;
    case 'sinus':       return t < 1 || t >= 9 ? 0 : Math.sin(((t - 1) * Math.PI) / 2); // 2 Zyklen, T = 4 s
    case 'stufenweise': {
      const lv = [0, 1 / 3, 2 / 3, 1, 0.5, 0];                                       // Stufen bei 1,3,5,7,9 s
      const edges = [1, 3, 5, 7, 9];
      let g = 0;
      edges.forEach((e, k) => { g += (lv[k + 1] - lv[k]) * ramp(e, e + T_RAMP); });
      return g;
    }
    case 'impuls': {
      let g = 0;
      for (const a of [1, 4, 7]) g += ramp(a, a + T_RAMP) - ramp(a + 0.5, a + 0.5 + T_RAMP);
      return g;
    }
  }
}

export function controlFor(load: LoadKey, cyclicControl: Control): Control {
  if (load === 'kriechen') return 'stress';
  if (load === 'relaxieren') return 'strain';
  return cyclicControl; // Dreieck/Zyklisch/Stufen/Impuls: wählbar
}

export function simulate(model: ModelKey, load: LoadKey, p: RheoParams, cyclicControl: Control = 'stress'): RheoResult {
  const control = controlFor(load, cyclicControl);
  const n = Math.round(T_END / DT);
  const t: number[] = [], sig: (number | null)[] = [], eps: (number | null)[] = [];

  const E = Math.max(1e-9, p.E);
  const eta = Math.max(1e-9, p.eta);
  const fy = Math.max(1e-9, p.fy);
  const Et = Math.min(Math.max(0, p.Et), 0.999 * E);
  const H = (E * Et) / (E - Et);                       // plastischer Verfestigungsmodul (Feder parallel zum Reibelement)
  const E1 = p.E1 ?? 0.4 * E, E2 = p.E2 ?? 0.6 * E;    // Zener
  const tauS_Z = eta / E2;                              // Relaxationszeit Zener (ε = konst.)
  const tauE_Z = (eta * (E1 + E2)) / (E1 * E2);         // Retardationszeit Zener (σ = konst.)

  // Zustandsgrößen
  let e = 0, s = 0;        // aktuelle Dehnung / Spannung
  let ev = 0;              // viskose Dehnung (Maxwell, Zener-Maxwell-Ast)
  let ep = 0, alpha = 0;   // plastische Dehnung, Rückspannung (kinematische Verfestigung)
  let failed = false, tFail: number | null = null;
  let W = 0, spikePeak: number | null = null;

  const plasticFail = (ss: number) => (model === 'st_venant' || model === 'prandtl') && Math.abs(ss) > fy * (1 + 1e-9);

  for (let i = 0; i <= n; i++) {
    const ti = i * DT;
    t.push(+ti.toFixed(4));
    const g = loadShape(load, ti);

    if (i === 0) { sig.push(0); eps.push(0); continue; }
    if (failed) { sig.push(control === 'stress' ? p.sigma0 * g : null); eps.push(null); continue; }

    for (let k = 1; k <= NSUB && !failed; k++) {   // Unterschritte für genaue Fließ-/Energiebilanz
    const tk = ti - DT + k * h;
    const gk = loadShape(load, tk);
    const s0 = s, e0 = e;

    if (control === 'stress') {
      const sNew = p.sigma0 * gk;
      const sMid = 0.5 * (s0 + sNew);
      switch (model) {
        case 'hooke':   e = sNew / E; break;
        case 'newton':  e = e0 + (sMid / eta) * h; break;
        case 'maxwell': ev += (sMid / eta) * h; e = sNew / E + ev; break;
        case 'kelvin': {
          const a = Math.exp(-h * E / eta);
          e = e0 * a + (sMid / E) * (1 - a); break;
        }
        case 'zener': {  // εv → σ/E1 mit Retardationszeit tauE_Z, ε = (σ + E2·εv)/(E1+E2)
          const a = Math.exp(-h / tauE_Z);
          ev = ev * a + (sMid / E1) * (1 - a);
          e = (sNew + E2 * ev) / (E1 + E2); break;
        }
        case 'bingham': {
          const over = Math.abs(sMid) - fy;
          if (over > 0) e = e0 + Math.sign(sMid) * (over / eta) * h; break;
        }
        case 'st_venant':
          if (plasticFail(sNew)) { failed = true; tFail = +tk.toFixed(3); } break; // starr: ε bleibt
        case 'prandtl':
          if (plasticFail(sNew)) { failed = true; tFail = +tk.toFixed(3); } else e = sNew / E + ep; break;
        case 'elasto_plastic': {
          const xi = sNew - alpha, f = Math.abs(xi) - fy;
          if (f > 0) { const d = (f / H) * Math.sign(xi); ep += d; alpha += H * d; }
          e = sNew / E + ep; break;
        }
      }
      s = sNew;
    } else {
      const eNew = p.eps0 * gk;
      const rate = (eNew - e0) / h;
      switch (model) {
        case 'hooke':   s = E * eNew; break;
        case 'newton':  s = eta * rate; break;
        case 'maxwell': {   // exakte Lösung für konstante Rate im Schritt
          const tau = eta / E, a = Math.exp(-h / tau);
          s = s0 * a + eta * rate * (1 - a); break;
        }
        case 'kelvin':  s = E * eNew + eta * rate; break;
        case 'zener': {
          const a = Math.exp(-h / tauS_Z);
          const sM0 = s0 - E1 * e0;                       // Spannung im Maxwell-Ast
          const sM = sM0 * a + eta * rate * (1 - a);
          ev = eNew - sM / E2;
          s = E1 * eNew + sM; break;
        }
        case 'bingham':
          s = Math.abs(rate) > 1e-12 ? Math.sign(rate) * fy + eta * rate
                                     : Math.min(fy, Math.max(-fy, s0)); break; // in Ruhe: Restspannung bleibt „eingefroren" (|σ| ≤ τ0)
        case 'st_venant':
          s = Math.abs(rate) > 1e-12 ? Math.sign(rate) * fy : s0; break;
        case 'prandtl': {
          const tr = E * (eNew - ep), f = Math.abs(tr) - fy;
          if (f > 0) { ep += (f / E) * Math.sign(tr); s = Math.sign(tr) * fy; } else s = tr; break;
        }
        case 'elasto_plastic': {
          const tr = E * (eNew - ep), xi = tr - alpha, f = Math.abs(xi) - fy;
          if (f > 0) { const dg = f / (E + H), sg = Math.sign(xi); ep += dg * sg; alpha += H * dg * sg; s = tr - E * dg * sg; }
          else s = tr; break;
        }
      }
      e = eNew;
      if ((model === 'newton' || model === 'kelvin' || model === 'bingham') && Math.abs(rate) > 1e-12)
        spikePeak = Math.max(spikePeak ?? 0, Math.abs(s));
    }

    if (!failed) W += 0.5 * (s0 + s) * (e - e0);
    }
    if (failed) { sig.push(s); eps.push(null); continue; }
    sig.push(s); eps.push(e);
  }

  // gespeicherte Energie im Endzustand
  let Ws = 0;
  if (!failed) switch (model) {
    case 'hooke': case 'maxwell': case 'prandtl': Ws = (s * s) / (2 * E); break;
    case 'kelvin': Ws = 0.5 * E * e * e; break;
    case 'zener': Ws = 0.5 * E1 * e * e + 0.5 * E2 * (e - ev) ** 2; break;
    case 'elasto_plastic': Ws = (s * s) / (2 * E) + (H > 0 ? (alpha * alpha) / (2 * H) : 0); break;
    default: Ws = 0;
  }
  const scaleS = Math.max(1e-9, Math.abs(control === 'stress' ? p.sigma0 : E * p.eps0));
  const closedCycle = !failed && Math.abs(s) < 1e-3 * scaleS && Math.abs(e) < 1e-3 * Math.max(1e-12, Math.abs(p.eps0 || p.sigma0 / E));

  // Relaxationskennwerte (Haltephase 1,06 s … 7 s)
  let relax: RheoResult['relax'] = null;
  if (load === 'relaxieren') {
    // Ein Zeitschritt nach Ende der Rampe, damit keine Spannungsspitze (Kelvin, Newton, Bingham) als Startwert gilt
    const iS = Math.round((1 + T_RAMP) / DT) + 1, iE = Math.round(7 / DT);
    const sS = (sig[iS] as number) ?? 0, sE = (sig[iE] as number) ?? 0;
    const sigmaInf =
      model === 'hooke' || model === 'kelvin' ? E * p.eps0 :
      model === 'maxwell' || model === 'newton' ? 0 :
      model === 'zener' ? E1 * p.eps0 :
      model === 'prandtl' ? Math.min(E * p.eps0, fy) :
      model === 'elasto_plastic' ? sS : model === 'st_venant' || model === 'bingham' ? sS : null;
    relax = { sigmaStart: sS, sigmaEnd: sE, R: Math.abs(sS) > 1e-12 ? ((sS - sE) / sS) * 100 : 0, sigmaInf };
  }

  const times: RheoResult['times'] = [];
  if (model === 'maxwell') times.push({ label: 'Relaxationszeit τ = η/E', value: eta / E });
  if (model === 'kelvin') times.push({ label: 'Retardationszeit τ = η/E', value: eta / E });
  if (model === 'zener') {
    times.push({ label: 'Relaxationszeit τ_σ = η/E₂', value: tauS_Z });
    times.push({ label: 'Retardationszeit τ_ε = η(E₁+E₂)/(E₁E₂)', value: tauE_Z });
  }

  return { t, sigma: sig, eps, control, failed, tFail, W_ext: W, W_stored: Ws, W_diss: W - Ws,
           closedCycle, times, relax, spikePeak };
}
