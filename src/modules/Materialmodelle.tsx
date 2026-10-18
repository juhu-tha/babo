import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Timer, 
  GitCommit, 
  RotateCw, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Info, 
  Sparkles, 
  BookOpen 
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Line } from 'react-chartjs-2';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { formatDeZahl } from '@/src/utils/numberFormat';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- SVG-ERSATZBILDER FÜR DIE MECHANISCH-RHEOLOGISCHEN MODELLE ---

const HookeShape = ({x, y, label = "E"}: {x:number, y:number, label?: string}) => (
  <g transform={`translate(${x},${y})`} className="stroke-middle-blue fill-none">
    <path d="M 0 20 L 20 20 L 25 10 L 35 30 L 45 10 L 55 30 L 65 10 L 75 30 L 80 20 L 100 20" strokeWidth="2" strokeLinejoin="round" />
    <text x="50" y="8" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">{label}</text>
  </g>
);

const NewtonShape = ({x, y, label = "η"}: {x:number, y:number, label?: string}) => (
  <g transform={`translate(${x},${y})`} className="stroke-middle-blue fill-none">
    <path d="M 0 20 L 30 20 M 30 10 L 60 10 M 30 30 L 60 30 M 30 10 L 30 30" strokeWidth="2" />
    <path d="M 50 12 L 50 28 M 50 20 L 100 20" strokeWidth="2" />
    <text x="45" y="8" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">{label}</text>
  </g>
);

const StVenantShape = ({x, y, label = "f_y"}: {x:number, y:number, label?: string}) => (
  <g transform={`translate(${x},${y})`} className="stroke-middle-blue fill-none">
    <path d="M 0 20 L 30 20 M 70 20 L 100 20" strokeWidth="2" />
    <rect x="30" y="10" width="40" height="20" strokeWidth="2" fill="white" />
    <path d="M 25 32 L 75 32" strokeWidth="2" />
    <path d="M 30 32 L 25 38 M 40 32 L 35 38 M 50 32 L 45 38 M 60 32 L 55 38 M 70 32 L 65 38" strokeWidth="1" />
    <text x="50" y="8" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">{label}</text>
  </g>
);

const ZenerShape = ({x, y}: {x:number, y:number}) => (
  <g transform={`translate(${x},${y})`} className="stroke-middle-blue fill-none">
    <path d="M 0 35 L 20 35 M 20 15 L 20 55 M 180 15 L 180 55 M 180 35 L 200 35" strokeWidth="2" />
    {/* Upper branch: Hooke E1 */}
    <line x1="20" y1="15" x2="50" y2="15" strokeWidth="1.5" />
    <HookeShape x={50} y={-5} label="E₁ (Parallel)" />
    <line x1="150" y1="15" x2="180" y2="15" strokeWidth="1.5" />
    {/* Lower branch: Maxwell (E2 + eta) */}
    <line x1="20" y1="55" x2="30" y2="55" strokeWidth="1.5" />
    <HookeShape x={30} y={35} label="E₂" />
    <NewtonShape x={110} y={35} label="η" />
    <line x1="170" y1="55" x2="180" y2="55" strokeWidth="1.5" />
    <text x="100" y="8" fontSize="8.5" fill="currentColor" stroke="none" textAnchor="middle">Feder E₁ (Gleichgewicht)</text>
    <text x="100" y="84" fontSize="8.5" fill="currentColor" stroke="none" textAnchor="middle">Maxwell-Ast (E₂ + η)</text>
  </g>
);

const ElastoPlasticShape = ({x, y}: {x:number, y:number}) => (
  <g transform={`translate(${x},${y})`} className="stroke-middle-blue fill-none">
    {/* Feder E in Reihe mit (Reibelement fy parallel zu Verfestigungsfeder Et) */}
    <path d="M 0 35 L 20 35" strokeWidth="2" />
    <HookeShape x={20} y={15} label="E (Elastisch)" />
    <path d="M 120 35 L 135 35 M 135 15 L 135 55 M 215 15 L 215 55 M 215 35 L 230 35" strokeWidth="2" />
    {/* Oberer Zweig: Reibelement fy */}
    <StVenantShape x={125} y={-5} label="f_y" />
    {/* Unterer Zweig: Verfestigungsfeder Et */}
    <HookeShape x={125} y={35} label="E_t" />
    <text x="70" y="12" fontSize="9" fill="currentColor" stroke="none" textAnchor="middle">Feder E</text>
    <text x="175" y="8" fontSize="8.5" fill="currentColor" stroke="none" textAnchor="middle">Reibelement f_y</text>
    <text x="175" y="84" fontSize="8.5" fill="currentColor" stroke="none" textAnchor="middle">Verfestigung E_t</text>
  </g>
);

const BinghamShape = ({x, y}: {x:number, y:number}) => (
  <g transform={`translate(${x},${y})`} className="stroke-middle-blue fill-none">
    <path d="M 0 35 L 25 35 M 25 15 L 25 55 M 145 15 L 145 55 M 145 35 L 170 35" strokeWidth="2" />
    {/* Oberer Zweig: Reibelement fy / tau_0 */}
    <StVenantShape x={35} y={-5} label="τ₀" />
    {/* Unterer Zweig: Dämpfer eta / mu_p */}
    <NewtonShape x={35} y={35} label="μ_p" />
    <text x="85" y="8" fontSize="9" fill="currentColor" stroke="none" textAnchor="middle">Fließgrenze τ₀</text>
    <text x="85" y="84" fontSize="9" fill="currentColor" stroke="none" textAnchor="middle">Plastische Viskosität μ_p</text>
  </g>
);

// =========================================================================
// SECTION: SIMULATION RHEOLOGISCHER MODELLE (INTERAKTIVER SIMULATOR)
// =========================================================================

function RheologySection() {
  const [model, setModel] = useState<'hooke'|'newton'|'st_venant'|'prandtl'|'elasto_plastic'|'maxwell'|'kelvin'|'zener'|'bingham'>('maxwell');
  const [E, setE] = useState(10);
  const [eta, setEta] = useState(20);
  const [fy, setFy] = useState(5);
  const [Et, setEt] = useState(2); // Verfestigungsmodul für Elasto-Plastisch mit Verfestigung
  const [sigma0, setSigma0] = useState(8);
  const [stressProfile, setStressProfile] = useState<'kriechen'|'relaxieren'|'dreieck'|'sinus'|'stufenweise'|'impuls'>('relaxieren');
  const [hystScaleMode, setHystScaleMode] = useState<'autoMax'|'zoom'>('autoMax');

  const { 
    t_labels, 
    sigDataPoints, 
    epsDataPoints, 
    sigEpsData, 
    tau, 
    eps0, 
    sigAtEnd, 
    sigDrop, 
    relaxPercent, 
    halfLife,
    dissEnergy_kJ_m3,
    yieldExceededWarning
  } = useMemo(() => {
    const dt = 0.05;
    const t_vals: number[] = [];
    const _tLabels: string[] = [];
    
    for (let t = 0; t <= 10.001; t += dt) {
      t_vals.push(t);
      if (Math.abs(t % 1) < 0.02 || Math.abs((t % 1) - 1) < 0.02) {
        _tLabels.push(t.toFixed(0));
      } else {
        _tLabels.push('');
      }
    }

    const sig_vals = new Array(t_vals.length).fill(0);
    const eps_vals = new Array(t_vals.length).fill(0);

    const effectiveE = Math.max(0.1, E || 1);
    const effectiveEta = Math.max(0.1, eta || 1);
    const effectiveEt = Math.max(0.01, Et || 1);
    const effectiveFy = Math.max(0.1, fy || 1);

    // Modell-spezifische Relaxationszeit tau
    let tau = effectiveEta / effectiveE;
    if (model === 'zener') {
      const E2 = effectiveE * 0.6;
      tau = effectiveEta / E2; // Spezifische SLS-Relaxationszeit
    }

    const eps0 = sigma0 / effectiveE; // Elastische Referenzdehnung
    let yieldExceededWarning = false;

    // -----------------------------------------------------------------
    // FALL 1: RELAXATION (Aufgeprägte Dehnung ε(t), Ermittlung σ(t))
    // -----------------------------------------------------------------
    if (stressProfile === 'relaxieren') {
      for (let i = 0; i < t_vals.length; i++) {
        const t = t_vals[i];
        
        // Vorgegebene Stufen-Dehnung von t = 1 s bis t = 7 s
        let currentEps = 0;
        if (t >= 1 && t < 7) {
          currentEps = eps0;
        } else {
          currentEps = 0;
        }
        eps_vals[i] = currentEps;

        // Spannungsantwort je nach Modell:
        if (model === 'hooke') {
          // Reines Hooke-Element: sigma = E * eps (reversibel, starr, keine Relaxation)
          sig_vals[i] = currentEps * effectiveE;
        } else if (model === 'newton') {
          // Reiner Dämpfer: sigma = eta * d_eps/dt (Spannungspeak beim Dehnungssprung, danach 0)
          if (t >= 1 && t < 1 + 2 * dt) sig_vals[i] = sigma0;
          else if (t >= 7 && t < 7 + 2 * dt) sig_vals[i] = -sigma0;
          else sig_vals[i] = 0;
        } else if (model === 'st_venant') {
          // Reibelement: Gleitet bei Überschreiten von fy, überträgt maximal fy
          sig_vals[i] = currentEps > 0 ? Math.min(sigma0, effectiveFy) : 0;
        } else if (model === 'prandtl') {
          // Prandtl-Modell (Elastisch-idealplastisch):
          // Bei Belastung: Federspannung steigt bis fy, Reibelement fließt ab fy (Spannung capped bei fy)
          // Bei Entlastung t >= 7: elastischer Rücksprung um E * eps0
          if (t >= 1 && t < 7) {
            sig_vals[i] = Math.min(sigma0, effectiveFy);
          } else if (t >= 7) {
            // Wenn plastisch geflossen (sigma0 > fy), bleibt nach Zwangsrückstellung auf eps=0 eine Eigenspannung
            const plasticStrain = Math.max(0, (sigma0 - effectiveFy) / effectiveE);
            const residualStress = plasticStrain > 0 ? -Math.min(effectiveFy, plasticStrain * effectiveE) : 0;
            sig_vals[i] = residualStress;
          } else {
            sig_vals[i] = 0;
          }
        } else if (model === 'elasto_plastic') {
          // Elasto-Plastisch mit Verfestigung (Bilineare Verfestigung Et):
          // Bei Dehnung eps0:
          const epsY = effectiveFy / effectiveE;
          if (t >= 1 && t < 7) {
            if (currentEps <= epsY) {
              sig_vals[i] = currentEps * effectiveE;
            } else {
              // Verfestigung: sigma = fy + Et * (eps - epsY)
              sig_vals[i] = effectiveFy + effectiveEt * (currentEps - epsY);
            }
          } else if (t >= 7) {
            // Nach elastischer Entlastung von eps0 auf 0:
            // Delta sigma = -E * eps0
            if (eps0 > epsY) {
              const peakStress = effectiveFy + effectiveEt * (eps0 - epsY);
              const unconstrainedResidual = peakStress - effectiveE * eps0;
              // Kinematische Rückfließgrenze bei -fy
              sig_vals[i] = Math.max(-effectiveFy, unconstrainedResidual);
            } else {
              sig_vals[i] = 0;
            }
          } else {
            sig_vals[i] = 0;
          }
        } else if (model === 'maxwell') {
          // Maxwell-Modell (Reihenschaltung Feder + Dämpfer):
          // d_sig/dt = - (E / eta) * sig -> sig(t) = sig0 * exp(-(t - 1) / tau)
          if (t >= 1 && t < 7) {
            sig_vals[i] = sigma0 * Math.exp(-(t - 1) / tau);
          } else if (t >= 7) {
            // Nach elastischer Entlastung bei t=7: elastischer Rücksprung um E * eps0
            const sigBeforeUnload = sigma0 * Math.exp(-(7 - 1) / tau);
            const sigAfterUnload = sigBeforeUnload - sigma0;
            sig_vals[i] = sigAfterUnload * Math.exp(-(t - 7) / tau);
          } else {
            sig_vals[i] = 0;
          }
        } else if (model === 'kelvin') {
          // Kelvin-Voigt-Modell: Feder E parallel zu Dämpfer eta
          // Bei konstanter Dehnung d_eps/dt = 0 -> sigma = E * eps = konst. Keine Relaxation möglich!
          sig_vals[i] = currentEps * effectiveE;
        } else if (model === 'zener') {
          // Standard Linear Solid (Zener-Modell in Maxwell-Form):
          // Parallele Feder E1 garantiert Gleichgewichtsrestspannung sigma_inf = eps0 * E1
          // Maxwell-Zweig (E2 + eta) relaxiert viskos
          const E1 = effectiveE * 0.4;
          const E2 = effectiveE * 0.6;
          const tauZener = effectiveEta / E2;
          if (t >= 1 && t < 7) {
            sig_vals[i] = eps0 * (E1 + E2 * Math.exp(-(t - 1) / tauZener));
          } else if (t >= 7) {
            const sigBeforeUnload = eps0 * (E1 + E2 * Math.exp(-(7 - 1) / tauZener));
            const sigAfterUnload = sigBeforeUnload - eps0 * effectiveE;
            sig_vals[i] = sigAfterUnload * Math.exp(-(t - 7) / tauZener);
          } else {
            sig_vals[i] = 0;
          }
        } else if (model === 'bingham') {
          // Bingham-Modell: Reibelement tau_0 parallel zu Dämpfer mu_p
          // Bei konstanter Dehnung d_eps/dt = 0 -> Dämpfer kraftlos, Reibelement hält maximal tau_0
          sig_vals[i] = currentEps > 0 ? Math.min(sigma0, effectiveFy) : 0;
        }
      }
    } else {
      // -----------------------------------------------------------------
      // FALL 2: AUFGEPRÄGTE SPANNUNG σ(t), ERMITTLUNG DER DEHNUNG ε(t)
      // -----------------------------------------------------------------
      const get_sigma = (time: number) => {
        if (stressProfile === 'kriechen') {
          return (time >= 1 && time < 5) ? sigma0 : 0;
        } else if (stressProfile === 'dreieck') {
          if (time < 1) return 0;
          if (time < 3) return sigma0 * (time - 1) / 2;
          if (time < 5) return sigma0 * (1 - (time - 3) / 2);
          return 0;
        } else if (stressProfile === 'sinus') {
          if (time < 1) return 0;
          if (time < 9) return sigma0 * Math.sin((time - 1) * Math.PI / 2);
          return 0;
        } else if (stressProfile === 'stufenweise') {
          if (time < 1) return 0;
          if (time < 3) return sigma0 * 0.33;
          if (time < 5) return sigma0 * 0.66;
          if (time < 7) return sigma0;
          if (time < 9) return sigma0 * 0.5;
          return 0;
        } else if (stressProfile === 'impuls') {
          if (time >= 1 && time < 1.5) return sigma0;
          if (time >= 4 && time < 4.5) return sigma0;
          if (time >= 7 && time < 7.5) return sigma0;
          return 0;
        }
        return 0;
      };

      for (let i = 0; i < t_vals.length; i++) {
        sig_vals[i] = get_sigma(t_vals[i]);
      }

      // Zustandsvariablen für kontinuierliche Zeitintegration:
      let eps_viscous = 0;     // Viskose Dehnung für Newton / Maxwell
      let eps_kelvin = 0;      // Kelvin-Voigt Dehnung
      let eps_zener_kv = 0;    // Zener verzögerter Ast
      let eps_bingham = 0;     // Bingham viskoplastische Dehnung
      
      // Zustand für Elasto-Plastisch mit Verfestigung (Kinematische Verfestigung / Bauschinger-Effekt)
      let alpha_backstress = 0; // Rückspannung (Kinematische Verschiebung der Fließfläche)
      let eps_plastic_ep = 0;   // Kumulierte plastische Dehnung

      const tau_kelvin = effectiveEta / effectiveE;
      const decay_kelvin = Math.exp(-dt / Math.max(0.0001, tau_kelvin));

      // Zener-Modell (Konsistente Maxwell-Zweig-Integration)
      // Sofortsteifigkeit E0 = E (bei t = 0), Langzeitsteifigkeit E_inf = E1 = 0.4 * E
      const E_zener1 = effectiveE * 0.4;
      const E_zener2 = effectiveE * 0.6;
      const tau_zener = effectiveEta / E_zener2;
      const decay_zener = Math.exp(-dt / Math.max(0.0001, tau_zener));

      for (let i = 0; i < t_vals.length; i++) {
        const sig = sig_vals[i];
        
        if (model === 'hooke') {
          // Reines Hooke-Element: Reversibel linear-elastisch
          eps_vals[i] = sig / effectiveE;
        } else if (model === 'newton') {
          // Reiner Dämpfer: Rein viskoses Fließen
          eps_viscous += (sig / effectiveEta) * dt;
          eps_vals[i] = eps_viscous;
        } else if (model === 'st_venant') {
          // St. Venant (Ideal-plastisches Reibelement ohne Verfestigung):
          // Bei Spannungssteuerung: Wenn |sigma| > fy, gibt es im reinen Reibelement kein statisches Gleichgewicht
          if (Math.abs(sig) > effectiveFy) {
            yieldExceededWarning = true;
          }
          // Zeigt Dehnungsverhalten: Starr bis fy, bei Überschreiten plastisches Fließen
          const sigCap = Math.min(Math.max(sig, -effectiveFy), effectiveFy);
          eps_vals[i] = (sigCap / effectiveE); // Symbolisch im elastischen Ersatzmaßstab
        } else if (model === 'prandtl') {
          // Prandtl-Modell (Elastisch-idealplastisch ohne Verfestigung):
          // Feder E in Reihe mit Reibelement fy
          if (Math.abs(sig) > effectiveFy) {
            yieldExceededWarning = true;
          }
          // Vor Überschreiten streng elastisch: eps = sig / E
          // Bei Überschreiten Fließplateau (Grenzlast)
          const sigCap = Math.min(Math.max(sig, -effectiveFy), effectiveFy);
          eps_vals[i] = sigCap / effectiveE;
        } else if (model === 'elasto_plastic') {
          // ELASTO-PLASTISCH MIT VERFESTIGUNG (1D Kinematische Verfestigung nach Prager/Ziegler):
          // Fließbedingung: F = |sig - alpha| - fy <= 0
          const trialStress = sig - alpha_backstress;
          const yieldFunction = Math.abs(trialStress) - effectiveFy;

          if (yieldFunction > 0) {
            // Plastisches Fließen mit Verfestigungsmodul Et:
            // Delta eps_p = (yieldFunction / Et) * sign(trialStress)
            const deltaEpsP = (yieldFunction / effectiveEt) * Math.sign(trialStress);
            eps_plastic_ep += deltaEpsP;
            alpha_backstress += effectiveEt * deltaEpsP;
          }

          // Gesamte Dehnung = elastische Dehnung (sig / E) + plastische Verfestigungsdehnung (eps_plastic_ep)
          eps_vals[i] = (sig / effectiveE) + eps_plastic_ep;

        } else if (model === 'maxwell') {
          // Maxwell-Modell: Feder E in Reihe mit Dämpfer eta
          // eps(t) = sig(t) / E + integral(sig / eta dt)
          eps_viscous += (sig / effectiveEta) * dt;
          eps_vals[i] = (sig / effectiveE) + eps_viscous;
        } else if (model === 'kelvin') {
          // Kelvin-Voigt-Modell: Feder E parallel zu Dämpfer eta
          // Analytisch exakte Exponential-Integration:
          eps_kelvin = eps_kelvin * decay_kelvin + (sig / effectiveE) * (1 - decay_kelvin);
          eps_vals[i] = eps_kelvin;
        } else if (model === 'zener') {
          // Standard Linear Solid (SLS):
          // Sofortige elastische Dehnung (sig / effectiveE) + verzögertes viskoelastisches Kriechen
          eps_zener_kv = eps_zener_kv * decay_zener + (sig / E_zener2) * (1 - decay_zener);
          eps_vals[i] = (sig / (effectiveE * 1.5)) + eps_zener_kv;
        } else if (model === 'bingham') {
          // Bingham-Körper (Viskoplastisch): Reibelement parallel zu Dämpfer
          // Unterhalb fy: kein Fließen (starr). Oberhalb fy: Fließen mit plastischer Viskosität eta
          if (Math.abs(sig) > effectiveFy) {
            const overstress = Math.abs(sig) - effectiveFy;
            eps_bingham += Math.sign(sig) * (overstress / effectiveEta) * dt;
          }
          eps_vals[i] = eps_bingham;
        }
      }
    }

    // Kennwerte der Spannungsrelaxation
    const idxBeforeUnload = Math.min(Math.floor(6.90 / dt), t_vals.length - 1);
    const sigAtEnd = sig_vals[idxBeforeUnload] || 0;
    const sigDrop = Math.max(0, sigma0 - sigAtEnd);
    const relaxPercent = sigma0 > 0 ? (sigDrop / sigma0) * 100 : 0;
    const halfLife = tau * Math.LN2;

    const sigDataPoints = t_vals.map((t, i) => ({ x: Number(t.toFixed(2)), y: Number(sig_vals[i].toFixed(3)) }));
    const epsDataPoints = t_vals.map((t, i) => ({ x: Number(t.toFixed(2)), y: Number(eps_vals[i].toFixed(4)) }));
    const sigEpsData = eps_vals.map((e, i) => ({ x: Number(e.toFixed(4)), y: Number(sig_vals[i].toFixed(3)) }));

    // Dissipationsarbeit / Hysteresefläche berechnen: W_diss = ∮ σ dε
    // σ in MPa (= 10^6 N/m²), ε einheitenlos (-) -> Produkt ist in MPa = 1000 kJ/m³ = 1 N/mm²
    let rawDissEnergy = 0;
    if (sigEpsData.length > 2) {
      for (let i = 0; i < sigEpsData.length - 1; i++) {
        rawDissEnergy += (sigEpsData[i].x * sigEpsData[i+1].y - sigEpsData[i+1].x * sigEpsData[i].y);
      }
      rawDissEnergy = Math.abs(rawDissEnergy) * 0.5;
    }
    // Umrechnung: 1 MPa·1 = 1000 kJ/m³ (korrekte physikalische Skalierung!)
    const dissEnergy_kJ_m3 = rawDissEnergy * 1000;

    return {
      t_labels: _tLabels,
      sigDataPoints,
      epsDataPoints,
      sigEpsData,
      tau,
      eps0,
      sigAtEnd,
      sigDrop,
      relaxPercent,
      halfLife,
      dissEnergy_kJ_m3,
      yieldExceededWarning
    };
  }, [model, E, eta, fy, Et, sigma0, stressProfile]);

  const sharedOptions = {
    responsive: true, 
    maintainAspectRatio: false,
    elements: {
      line: { borderWidth: 2.5, tension: 0.1 },
      point: { radius: 0 }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label || ''}: ${context.parsed.y}`
        }
      }
    }
  };

  const sigChartData = {
    datasets: [{
      label: 'Spannung (MPa)',
      data: sigDataPoints,
      borderColor: '#A3113E',
      backgroundColor: 'rgba(163, 17, 62, 0.12)',
      fill: true
    }]
  };

  const epsChartData = {
    datasets: [{
      label: 'Dehnung ε',
      data: epsDataPoints,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      fill: true
    }]
  };

  const sigEpsChartData = {
    datasets: [{
      label: 'σ-ε',
      data: sigEpsData,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.12)',
      fill: false
    }]
  };

  // Automatische Skalierung der Hysterese-Kurve (σ-ε)
  const hystLimits = useMemo(() => {
    if (!sigEpsData || sigEpsData.length === 0) return null;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of sigEpsData) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    const spanX = Math.max(0.0001, maxX - minX);
    const spanY = Math.max(0.1, maxY - minY);

    if (hystScaleMode === 'autoMax') {
      const axisMinX = minX < -0.001 ? Number((minX - spanX * 0.05).toFixed(4)) : 0;
      const axisMaxX = maxX > 0 ? Number((maxX * 1.05).toFixed(4)) : 0.05;
      const axisMinY = minY < -0.05 ? Number((minY - spanY * 0.05).toFixed(2)) : 0;
      const axisMaxY = maxY > 0 ? Number((maxY * 1.05).toFixed(2)) : 10;
      return {
        minX: axisMinX,
        maxX: axisMaxX,
        minY: axisMinY,
        maxY: axisMaxY,
        peakX: maxX,
        peakY: maxY,
        lowX: minX,
        lowY: minY
      };
    } else {
      const padX = spanX * 0.05;
      const padY = spanY * 0.05;
      return {
        minX: Number((minX - padX).toFixed(4)),
        maxX: Number((maxX + padX).toFixed(4)),
        minY: Number((minY - padY).toFixed(2)),
        maxY: Number((maxY + padY).toFixed(2)),
        peakX: maxX,
        peakY: maxY,
        lowX: minX,
        lowY: minY
      };
    }
  }, [sigEpsData, hystScaleMode]);

  const sigLimits = useMemo(() => {
    let minS = 0;
    let maxS = 1;
    for (const p of sigDataPoints) {
      if (p.y < minS) minS = p.y;
      if (p.y > maxS) maxS = p.y;
    }
    const span = Math.max(1, maxS - minS);
    return {
      min: Number((minS < 0 ? minS - span * 0.1 : 0).toFixed(1)),
      max: Number((maxS + span * 0.1).toFixed(1))
    };
  }, [sigDataPoints]);

  const epsLimits = useMemo(() => {
    let minE = 0;
    let maxE = 0.05;
    for (const p of epsDataPoints) {
      if (p.y < minE) minE = p.y;
      if (p.y > maxE) maxE = p.y;
    }
    const span = Math.max(0.01, maxE - minE);
    return {
      min: Number((minE < 0 ? minE - span * 0.1 : 0).toFixed(3)),
      max: Number((maxE + span * 0.1).toFixed(3))
    };
  }, [epsDataPoints]);

  const infos: Record<typeof model, { name: string; desc: string; category: string }> = {
    hooke: { name: 'Hooke', desc: 'Reinelastisch', category: 'Elastisch' },
    newton: { name: 'Newton', desc: 'Reinviskose Flüssigkeit', category: 'Viskos' },
    st_venant: { name: 'St. Venant', desc: 'Ideal-Plastisch', category: 'Plastisch' },
    prandtl: { name: 'Prandtl', desc: 'Elastisch-Idealplastisch', category: 'Elasto-Plastisch' },
    elasto_plastic: { name: 'Elasto-Plastisch mit Verfestigung', desc: 'Bilineare Verfestigung (E + fy + Et)', category: 'Elasto-Plastisch' },
    maxwell: { name: 'Maxwell', desc: 'Visko-Elastisch (Spannungsrelaxation)', category: 'Viskoelastisch' },
    kelvin: { name: 'Kelvin-Voigt', desc: 'Verzögert Elastisch (Kriechen / Retardation)', category: 'Viskoelastisch' },
    zener: { name: 'Zener (SLS)', desc: 'Standard Linear Solid (Viskoelastischer Festkörper)', category: 'Viskoelastisch' },
    bingham: { name: 'Bingham', desc: 'Viskoplastisches Fluid (Frischbeton / Mörtel)', category: 'Viskoplastisch' }
  };

  return (
    <div className="bg-white border-y border-home-grau/30 -mx-4 sm:mx-0 sm:rounded-3xl sm:border flex flex-col pt-8 mt-12 mb-8 relative overflow-hidden shadow-sm">
      
      {/* Background Decorator */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A3113E]/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/4"></div>

      <div className="px-4 md:px-8 flex flex-col gap-8 pb-8">
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Activity className="text-shiraz" /> Simulation Rheologischer Modelle
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
            <p>
              Interaktives Prüflabor für rheologische Ersatzmodelle der Baustoffkunde. Stelle Einwirkungen (Kriechen, Relaxation, zyklische Lasten) 
              und Materialparameter ein, um Spannungs- und Dehnungsantworten sowie die Hysteresefläche in Echtzeit zu analysieren.
            </p>
          </div>
        </div>
        
        {/* Model Selector */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(infos) as Array<keyof typeof infos>).map(m => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={`px-4 py-2.5 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                model === m 
                  ? 'bg-shiraz text-white shadow-md font-bold' 
                  : 'bg-off-white text-text-main border border-home-grau/30 hover:border-shiraz hover:bg-white'
              }`}
            >
              <div className="text-xs font-bold leading-tight">{infos[m].name}</div>
              <div className={`text-[10px] mt-0.5 ${model === m ? 'text-white/80' : 'text-text-main/60'}`}>{infos[m].desc}</div>
            </button>
          ))}
        </div>

        {/* Warnhinweis bei Prandtl / St. Venant ohne Verfestigung bei Überschreiten von fy */}
        {yieldExceededWarning && (model === 'prandtl' || model === 'st_venant') && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in">
            <AlertTriangle className="text-amber-700 shrink-0 mt-0.5" size={16} />
            <div>
              <strong>Fließgrenze <InlineMath math="f_y" /> überschritten (Traglastversagen):</strong> Im idealplastischen Modell <em>ohne</em> Verfestigung 
              kann das Bauteil unter reiner Kraftsteuerung keine Spannung <InlineMath math="\sigma > f_y" /> im statischen Gleichgewicht halten. 
              Um das reale Nachfließverhalten mit Verfestigung zu untersuchen, wähle das Modell <strong>„Elasto-Plastisch mit Verfestigung“</strong>.
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8 mt-2">
          
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-text-main uppercase tracking-widest text-xs flex items-center gap-2">
              <Sliders size={14} className="text-shiraz" /> Einwirkungen &amp; Parameter
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Belastungsprofil-Wähler */}
              <div className="h-full">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 h-full">
                  <button 
                    onClick={() => setStressProfile('kriechen')} 
                    className={`flex flex-col items-center justify-center py-4 border rounded-2xl transition-all cursor-pointer ${stressProfile === 'kriechen' ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-sm' : 'border-home-grau/30 text-text-main/60 bg-off-white hover:bg-white'}`}
                    title="Konstante Spannung σ = σ0 von t=1 bis 5 s (Kriechversuch)"
                  >
                    <div className="w-8 h-4 border-t-2 border-r-2 border-l-2 border-b-0 mb-2 border-current"></div>
                    <span className="text-[10px] uppercase tracking-wider">Kriechen</span>
                  </button>
                  <button 
                    onClick={() => setStressProfile('relaxieren')} 
                    className={`flex flex-col items-center justify-center py-4 border rounded-2xl transition-all cursor-pointer ${stressProfile === 'relaxieren' ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-sm' : 'border-home-grau/30 text-text-main/60 bg-off-white hover:bg-white'}`}
                    title="Konstante Dehnung ε = ε0 von t=1 bis 7 s (Relaxationsversuch)"
                  >
                    <svg width="32" height="16" viewBox="0 0 32 16" className="mb-2 fill-none stroke-current" strokeWidth="2">
                      <path d="M 0 16 L 4 16 L 4 2 Q 12 4 24 12 L 28 16 L 32 16" />
                    </svg>
                    <span className="text-[10px] uppercase tracking-wider">Relaxieren</span>
                  </button>
                  <button 
                    onClick={() => setStressProfile('dreieck')} 
                    className={`flex flex-col items-center justify-center py-4 border rounded-2xl transition-all cursor-pointer ${stressProfile === 'dreieck' ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-sm' : 'border-home-grau/30 text-text-main/60 bg-off-white hover:bg-white'}`}
                    title="Dreieckförmige Be- und Entlastung bis σ0"
                  >
                    <svg width="32" height="16" viewBox="0 0 32 16" className="mb-2 fill-none stroke-current" strokeWidth="2" strokeLinejoin="round"><path d="M 0 16 L 16 2 L 32 16" /></svg>
                    <span className="text-[10px] uppercase tracking-wider">Dreieck</span>
                  </button>
                  <button 
                    onClick={() => setStressProfile('sinus')} 
                    className={`flex flex-col items-center justify-center py-4 border rounded-2xl transition-all cursor-pointer ${stressProfile === 'sinus' ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-sm' : 'border-home-grau/30 text-text-main/60 bg-off-white hover:bg-white'}`}
                    title="Zyklische Wechselbeanspruchung (-σ0 bis +σ0, Bauschinger-Hysterese)"
                  >
                    <svg width="32" height="16" viewBox="0 0 32 16" className="mb-2 fill-none stroke-current" strokeWidth="2"><path d="M 0 16 Q 8 2 16 9 T 32 0" /></svg>
                    <span className="text-[10px] uppercase tracking-wider">Zyklisch</span>
                  </button>
                  <button 
                    onClick={() => setStressProfile('stufenweise')} 
                    className={`flex flex-col items-center justify-center py-4 border rounded-2xl transition-all cursor-pointer ${stressProfile === 'stufenweise' ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-sm' : 'border-home-grau/30 text-text-main/60 bg-off-white hover:bg-white'}`}
                    title="Stufenförmige Lasterhöhung und Rücklast"
                  >
                    <svg width="32" height="16" viewBox="0 0 32 16" className="mb-2 fill-none stroke-current" strokeWidth="2" strokeLinejoin="round"><path d="M 0 16 L 0 10 L 10 10 L 10 4 L 20 4 L 20 12 L 30 12 L 30 16" /></svg>
                    <span className="text-[10px] uppercase tracking-wider leading-tight text-center">Stufen-<br/>weise</span>
                  </button>
                  <button 
                    onClick={() => setStressProfile('impuls')} 
                    className={`flex flex-col items-center justify-center py-4 border rounded-2xl transition-all cursor-pointer ${stressProfile === 'impuls' ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-sm' : 'border-home-grau/30 text-text-main/60 bg-off-white hover:bg-white'}`}
                    title="Wiederholte Rechteck-Stoßimpulse"
                  >
                    <svg width="32" height="16" viewBox="0 0 32 16" className="mb-2 fill-none stroke-current" strokeWidth="2" strokeLinejoin="round"><path d="M 0 16 L 4 16 L 4 4 L 8 4 L 8 16 L 16 16 L 16 4 L 20 4 L 20 16 L 32 16" /></svg>
                    <span className="text-[10px] uppercase tracking-wider">Impuls</span>
                  </button>
                </div>
              </div>

              {/* Slider-Parameter */}
              <div className="space-y-4 bg-white p-5 rounded-3xl border border-home-grau/30 shadow-sm h-full flex flex-col justify-center">
                <Slider 
                  label={<FormulaText text={stressProfile === 'relaxieren' ? "Anfangsspannung \\sigma_0 (\\varepsilon_0 = \\sigma_0 / E)" : "Spannungsamplitude \\sigma_0"} />} 
                  min={1} 
                  max={20} 
                  step={1} 
                  value={sigma0} 
                  unit="MPa" 
                  onChange={e => setSigma0(Number(e.target.value))} 
                />
                
                {(model === 'hooke' || model === 'prandtl' || model === 'elasto_plastic' || model === 'maxwell' || model === 'kelvin' || model === 'zener') && (
                  <Slider label={<FormulaText text="Elastizitätsmodul E" />} min={1} max={50} step={1} value={E} unit="MPa" onChange={e => setE(Number(e.target.value))} />
                )}
                {(model === 'newton' || model === 'maxwell' || model === 'kelvin' || model === 'zener' || model === 'bingham') && (
                  <Slider label={<FormulaText text="Viskosität \\eta \\text{ bzw. } \\mu_p" />} min={5} max={100} step={5} value={eta} unit="MPa·s" onChange={e => setEta(Number(e.target.value))} />
                )}
                {(model === 'st_venant' || model === 'prandtl' || model === 'elasto_plastic' || model === 'bingham') && (
                  <Slider label={<FormulaText text="Fließgrenze f_y \\text{ bzw. } \\tau_0" />} min={1} max={20} step={1} value={fy} unit="MPa" onChange={e => setFy(Number(e.target.value))} />
                )}
                {model === 'elasto_plastic' && (
                  <Slider label={<FormulaText text="Verfestigungsmodul E_t (Tangentenmodul)" />} min={0.5} max={10} step={0.5} value={Et} unit="MPa" onChange={e => setEt(Number(e.target.value))} />
                )}
              </div>

              {/* Rheologisches Ersatzschaltbild (SVG) */}
              <div className="p-6 bg-white border border-home-grau/30 text-text-main rounded-3xl flex flex-col justify-center items-center shadow-sm relative overflow-hidden h-full">
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-text-main/60 font-bold">Ersatzschaltbild</span>
                  <span className="text-[10px] font-mono bg-off-white text-shiraz px-2 py-0.5 rounded border border-home-grau/30 font-bold">{infos[model].name}</span>
                </div>
                <div className="text-shiraz scale-[1.15] origin-center z-10 py-2">
                  {model === 'hooke' && <svg width="100" height="40" viewBox="0 0 100 40"><HookeShape x={0} y={0} /></svg>}
                  {model === 'newton' && <svg width="100" height="40" viewBox="0 0 100 40"><NewtonShape x={0} y={0} /></svg>}
                  {model === 'st_venant' && <svg width="100" height="40" viewBox="0 0 100 40"><StVenantShape x={0} y={0} /></svg>}
                  {model === 'prandtl' && <svg width="200" height="40" viewBox="0 0 200 40"><HookeShape x={0} y={0} /><StVenantShape x={100} y={0} /></svg>}
                  {model === 'elasto_plastic' && <svg width="230" height="90" viewBox="0 0 230 90"><ElastoPlasticShape x={0} y={0} /></svg>}
                  {model === 'maxwell' && <svg width="200" height="40" viewBox="0 0 200 40"><HookeShape x={0} y={0} /><NewtonShape x={100} y={0} /></svg>}
                  {model === 'kelvin' && (
                    <svg width="160" height="90" viewBox="0 0 160 90">
                      <path d="M 0 45 L 30 45 M 30 15 L 30 75 M 130 15 L 130 75 M 130 45 L 160 45" className="stroke-current" strokeWidth="2" fill="none" />
                      <HookeShape x={30} y={-5} /> 
                      <NewtonShape x={30} y={55} />
                    </svg>
                  )}
                  {model === 'zener' && (
                    <svg width="200" height="90" viewBox="0 0 200 90">
                      <ZenerShape x={0} y={0} />
                    </svg>
                  )}
                  {model === 'bingham' && (
                    <svg width="170" height="90" viewBox="0 0 170 90">
                      <BinghamShape x={0} y={0} />
                    </svg>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* RELAXATIONS-COCKPIT & ANALYTIK (wenn Profil = relaxieren) */}
          {stressProfile === 'relaxieren' && (
            <div className="bg-purple-50/70 border border-purple-200 rounded-3xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></div>
                  <h4 className="text-sm font-bold text-purple-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Timer size={16} className="text-purple-700" /> Live-Cockpit Spannungsrelaxation (ε = konst.)
                  </h4>
                </div>
                <span className="text-xs font-mono font-semibold bg-purple-150 text-purple-900 px-3 py-1 rounded-full border border-purple-300">
                  Modell: {infos[model].name}
                </span>
              </div>

              {/* 4 Live Kennwerte */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-2xl border border-purple-100 shadow-sm text-center">
                  <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Aufgeprägte Dehnung</span>
                  <span className="font-mono font-bold text-base text-purple-900 block mt-1">
                    {formatDeZahl(eps0 * 1000, 1)} ‰
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">ε₀ = σ₀ / E</span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-purple-100 shadow-sm text-center">
                  <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Relaxationszeit τ</span>
                  <span className="font-mono font-bold text-base text-shiraz block mt-1">
                    {formatDeZahl(tau, 2)} s
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {model === 'zener' ? 'τ_SLS = η / E₂' : 'τ = η / E (1/e-Zeit)'}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-purple-100 shadow-sm text-center">
                  <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Restspannung (t=6,9 s)</span>
                  <span className="font-mono font-bold text-base text-text-main block mt-1">
                    {formatDeZahl(sigAtEnd, 2)} MPa
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">vor Entlastungssprung</span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-purple-100 shadow-sm text-center">
                  <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Relaxationsgrad R</span>
                  <span className={`font-mono font-bold text-base block mt-1 ${relaxPercent > 50 ? 'text-emerald-700' : relaxPercent > 0 ? 'text-amber-700' : 'text-slate-600'}`}>
                    {formatDeZahl(relaxPercent, 1)} %
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Δσ = -{formatDeZahl(sigDrop, 2)} MPa</span>
                </div>
              </div>

              {/* Modell-spezifische physikalische Diagnose */}
              <div className="bg-white p-3.5 rounded-2xl border border-purple-100 text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                <div className="font-bold text-purple-950 flex items-center gap-1.5">
                  <span>Physikalischer Befund zum Modell „{infos[model].name}“:</span>
                </div>
                {model === 'maxwell' && (
                  <p>
                    <strong>Vollständige Spannungsrelaxation:</strong> Bei <InlineMath math="t=1\text{ s}" /> federt die Feder sofort mit <InlineMath math="\sigma_0" /> ein. 
                    Während der Standzeit unter konstanter Dehnung fließt der serielle Dämpfer mit <InlineMath math="\dot{\varepsilon}_D = \sigma / \eta" />, 
                    wodurch die Feder entlastet wird. Die Spannung sinkt asymptotisch gegen Null: 
                    <span className="font-mono text-purple-900 font-bold ml-1">σ(t) = σ₀ · exp(-t / τ)</span>.
                  </p>
                )}
                {model === 'kelvin' && (
                  <p className="text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                    <strong>Achtung – Kelvin-Voigt kann physikalisch NICHT relaxieren!</strong> Da Feder und Dämpfer parallel liegen, 
                    müssen beide dieselbe Dehnung erfahren. Bei konstanter Dehnung ist <InlineMath math="\dot{\varepsilon} = 0" />. 
                    Damit ist der Dämpfer kraftlos und die Hooke-Feder hält die volle Spannung unbegrenzt aufrecht (<span className="font-bold text-amber-950">Relaxationsgrad R = 0 %</span>).
                  </p>
                )}
                {model === 'zener' && (
                  <p>
                    <strong>Standard Linear Solid (SLS / Zener):</strong> Reale viskoelastische Festkörper (Spannstahl, Kunststoffe, Asphalt &amp; Beton) bauen unter 
                    Dauerdehnung nie 100 % ihrer Spannung ab. Die parallele Feder <InlineMath math="E_1" /> garantiert eine bleibende Gleichgewichtsspannung 
                    <InlineMath math="\sigma_\infty = E_1 \cdot \varepsilon_0 > 0" />, während der Maxwell-Zweig <InlineMath math="E_2 + \eta" /> die viskose Relaxation abbildet.
                  </p>
                )}
                {model === 'elasto_plastic' && (
                  <p>
                    <strong>Elasto-Plastisch mit Verfestigung:</strong> Bei Aufprägung von <InlineMath math="\varepsilon_0 > \varepsilon_y" /> steigt die Spannung 
                    über die Fließgrenze <InlineMath math="f_y" /> hinaus entlang des Verfestigungsmoduls <InlineMath math="E_t" /> auf 
                    <InlineMath math="\sigma = f_y + E_t \cdot (\varepsilon_0 - \varepsilon_y)" />. 
                    Da das Modell keine Viskosität besitzt, findet keine zeitabhängige Relaxation statt. Bei erzwungener Rückkehr auf <InlineMath math="\varepsilon = 0" /> entsteht eine Druck-Eigenspannung.
                  </p>
                )}
                {model === 'hooke' && (
                  <p>
                    <strong>Reinelastischer Körper:</strong> Reversibel ohne Dämpfung und Energieverluste. Die Spannung folgt starr dem Dehnungssprung (<InlineMath math="\sigma = E \cdot \varepsilon_0" />) 
                    und bleibt zeitlich unverändert.
                  </p>
                )}
                {model === 'newton' && (
                  <p>
                    <strong>Ideale viskose Flüssigkeit:</strong> Ein Dehnungssprung erfordert eine unendliche Dehngeschwindigkeit (Spannungsimpuls). 
                    Sobald die Dehnung ruht (<InlineMath math="\dot{\varepsilon} = 0" />), fällt die Spannung schlagartig auf Null ab.
                  </p>
                )}
                {(model === 'st_venant' || model === 'prandtl' || model === 'bingham') && (
                  <p>
                    <strong>Reibelement / Viskoplastizität:</strong> Die Spannung wird durch die plastische Fließgrenze <InlineMath math="f_y" /> nach oben begrenzt. 
                    Sobald das Reibelement gleitet, verbleibt nach Entlastung eine irreversible plastische Dehnung.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* DIAGRAMME: SPANNUNG σ(t), DEHNUNG ε(t) & HYSTERESE σ-ε */}
          <div className="flex flex-col gap-6">
            <h3 className="font-bold text-text-main uppercase tracking-widest text-xs flex items-center gap-2">
              <Activity size={14} className="text-shiraz" /> Simulations-Ergebnisse
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Plot 1: Spannung σ(t) */}
              <div className="h-[280px] bg-white border border-home-grau/30 shadow-sm rounded-3xl p-5 flex flex-col group transition-shadow hover:shadow-md">
                <div className="text-xs font-bold text-shiraz uppercase tracking-wider mb-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-shiraz"></div> Spannung σ(t) / Zeit
                </div>
                <div className="grow w-full relative">
                  <Line 
                    data={sigChartData} 
                    options={{
                      ...sharedOptions,
                      scales: {
                        x: { 
                          type: 'linear',
                          min: 0,
                          max: 10,
                          display: true, 
                          title: { 
                            display: true, 
                            text: 'Zeit t (s)', 
                            color: '#1e293b', 
                            font: { size: 12, weight: 'bold' } 
                          },
                          ticks: {
                            stepSize: 1,
                            color: '#475569',
                            font: { size: 11, weight: 'bold' },
                            callback: (val: any) => `${val} s`
                          },
                          grid: { color: 'rgba(0,0,0,0.06)' }
                        },
                        y: { 
                          display: true, 
                          title: { 
                            display: true, 
                            text: 'Spannung σ (MPa)', 
                            color: '#A3113E', 
                            font: { size: 12, weight: 'bold' } 
                          },
                          ticks: {
                            color: '#64748b',
                            font: { size: 11 },
                            callback: (val: any) => `${val} MPa`
                          },
                          suggestedMin: sigLimits.min,
                          suggestedMax: sigLimits.max,
                          grid: { color: 'rgba(0,0,0,0.06)' }
                        }
                      }
                    }} 
                  />
                </div>
              </div>

              {/* Plot 2: Dehnung ε(t) */}
              <div className="h-[280px] bg-white border border-home-grau/30 shadow-sm rounded-3xl p-5 flex flex-col group transition-shadow hover:shadow-md">
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-600"></div> Dehnung ε(t) / Zeit
                </div>
                <div className="grow w-full relative">
                  <Line 
                    data={epsChartData} 
                    options={{
                      ...sharedOptions,
                      scales: {
                        x: { 
                          type: 'linear',
                          min: 0,
                          max: 10,
                          display: true, 
                          title: { 
                            display: true, 
                            text: 'Zeit t (s)', 
                            color: '#1e293b', 
                            font: { size: 12, weight: 'bold' } 
                          },
                          ticks: {
                            stepSize: 1,
                            color: '#475569',
                            font: { size: 11, weight: 'bold' },
                            callback: (val: any) => `${val} s`
                          },
                          grid: { color: 'rgba(0,0,0,0.06)' }
                        },
                        y: { 
                          display: true, 
                          title: { 
                            display: true, 
                            text: 'Dehnung ε (-)', 
                            color: '#059669', 
                            font: { size: 12, weight: 'bold' } 
                          },
                          ticks: {
                            color: '#64748b',
                            font: { size: 11 },
                            callback: (val: any) => typeof val === 'number' ? (Math.abs(val) < 0.01 && val !== 0 ? val.toExponential(1) : val.toFixed(3)) : val
                          },
                          suggestedMin: epsLimits.min,
                          suggestedMax: epsLimits.max,
                          grid: { color: 'rgba(0,0,0,0.06)' }
                        }
                      }
                    }} 
                  />
                </div>
              </div>
            </div>

            {/* Plot 3: Spannung σ vs. Dehnung ε (Hysterese & Dissipationsenergie) */}
            <div className="bg-white border border-home-grau/30 shadow-sm rounded-3xl p-5 flex flex-col mt-2 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Spannungs-Dehnungs-Diagramm σ / ε (Hysterese &amp; Dissipationsarbeit)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Skalierungs-Umschalter */}
                  <div className="inline-flex rounded-lg border border-home-grau/30 bg-slate-100 p-0.5 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setHystScaleMode('autoMax')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        hystScaleMode === 'autoMax'
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Skaliert Diagramm automatisch auf die realen Maximalwerte (0 bis Max)"
                    >
                      Auto-Max [0 → Max]
                    </button>
                    <button
                      type="button"
                      onClick={() => setHystScaleMode('zoom')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        hystScaleMode === 'zoom'
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Fokussiert den Wertebereich direkt auf die Kurve"
                    >
                      Fokus-Zoom [Min → Max]
                    </button>
                  </div>

                  {hystLimits && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                      <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md font-bold">
                        σ_max = {formatDeZahl(hystLimits.peakY, 2)} MPa
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                        ε_max = {formatDeZahl(hystLimits.peakX * 1000, 2)} ‰
                      </span>
                      {dissEnergy_kJ_m3 > 0.01 && (
                        <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md font-semibold" title="Dissipierte mechanische Arbeit W_diss = ∮ σ dε (1 MPa = 1000 kJ/m³)">
                          ΔW_diss = {formatDeZahl(dissEnergy_kJ_m3, 1)} kJ/m³ ({formatDeZahl(dissEnergy_kJ_m3 / 1000, 3)} N/mm²)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-[320px] w-full relative">
                <Line 
                  data={sigEpsChartData} 
                  options={{
                    ...sharedOptions,
                    scales: {
                      x: { 
                        type: 'linear', 
                        position: 'bottom', 
                        min: hystLimits?.minX,
                        max: hystLimits?.maxX,
                        title: { 
                          display: true, 
                          text: 'Dehnung ε (-)', 
                          color: '#1e293b', 
                          font: { size: 12, weight: 'bold' } 
                        },
                        ticks: {
                          color: '#475569',
                          font: { size: 11, weight: 'bold' },
                          callback: (val: any) => typeof val === 'number' ? (Math.abs(val) < 0.01 && val !== 0 ? val.toExponential(1) : val.toFixed(3)) : val
                        },
                        grid: { color: 'rgba(0,0,0,0.06)' }
                      },
                      y: { 
                        display: true, 
                        min: hystLimits?.minY,
                        max: hystLimits?.maxY,
                        title: { 
                          display: true, 
                          text: 'Spannung σ (MPa)', 
                          color: '#2563eb', 
                          font: { size: 12, weight: 'bold' } 
                        },
                        ticks: {
                          color: '#64748b',
                          font: { size: 11 },
                          callback: (val: any) => `${typeof val === 'number' ? val.toFixed(1) : val} MPa`
                        },
                        grid: { color: 'rgba(0,0,0,0.06)' }
                      }
                    }
                  }} 
                />
              </div>
            </div>

            {/* PRAXISBEISPIELE DER RHEOLOGISCHEN MODELLE */}
            <div className="mt-8 pt-6 border-t border-home-grau/25 space-y-5">
              <div>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Activity className="text-shiraz" size={18} /> Praxisbeispiele aus dem Baustoff- &amp; Werkstoffbereich für jedes Modell
                </h3>
                <p className="text-xs text-text-main/70 mt-1">
                  In der Bauwerkstoffkunde repräsentiert jedes rheologische Ersatzmodell das charakteristische mechanische Antwortverhalten 
                  konkreter Baustoffe unter Kurzzeit-, Dauer- oder Zwangbeanspruchung.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                
                {/* 1. Hooke */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-shiraz text-sm">1. Hooke-Körper</span>
                      <span className="font-mono text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">Reinelastisch</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">σ = E · ε | Feder</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Bauglas (Kalk-Natron-Floatglas):</strong> Ideal sprödelastisch bis zum Bruch (DIN 18008). Keinerlei Fließzone oder Raumtemperaturkriechen.</li>
                        <li><strong>Keramik &amp; Klinker:</strong> Kristallines und amorphes Gefüge federt verzögerungsfrei ein.</li>
                        <li><strong>Baustahl (S235/S355):</strong> Unterhalb der Streckgrenze (<InlineMath math="\sigma < f_y" />) streng linear-elastisch.</li>
                        <li><strong>CFK-Lamellen:</strong> Carbonfasern besitzen rein elastische Dehnkennlinien bis zum Faserbruch.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Reversible elastische Auslenkung der Atomgitterbindungen ohne Dämpfungsverluste.
                  </div>
                </div>

                {/* 2. Newton */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-blue-700 text-sm">2. Newton-Körper</span>
                      <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Rein viskos</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">σ = η · (dε/dt) | Dämpfer</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Heißbitumen / Gussasphalt flüssig:</strong> Beim Mischen und Einbau (<InlineMath math="T > 160^\circ\text{C}" />) ideal viskose Flüssigkeit zur vollflächigen Gesteinsbenetzung.</li>
                        <li><strong>Frisches Anmachwasser &amp; Zementleim:</strong> Stark verdünnte Injektionsmischungen ohne Partikelnetzwerk.</li>
                        <li><strong>Niedrigviskose Epoxidharze:</strong> Zur drucklosen Rissverpressung vor dem Gelieren.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Reines laminares Gleiten von Fluidmolekülen. Keine Energiespeicherung, 100 % Dissipation in Wärme.
                  </div>
                </div>

                {/* 3. St. Venant */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-amber-700 text-sm">3. St.-Venant-Körper</span>
                      <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Ideal-plastisch</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">|σ| ≤ f_y | Reibelement</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Trockener Baugrund (Sand &amp; Kies):</strong> Coulomb'sches Reibungsgesetz (<InlineMath math="\tau = \sigma \cdot \tan\varphi" />). Unterhalb der Scherfestigkeit starr, bei Überschreiten Gleiten.</li>
                        <li><strong>PTFE-Gleitplatten in Brückenlagern:</strong> Feste Reibungsgrenze zur Verschiebungskompensation.</li>
                        <li><strong>Reines Fließplateau von Weichstahl:</strong> Plastisches Gleiten bei konstanter Streckgrenzenspannung.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Coulombsche Festkörperreibung / Aktivierung von Kristallgleitsystemen bei Grenzschubspannung.
                  </div>
                </div>

                {/* 4. Prandtl */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800 text-sm">4. Prandtl-Modell</span>
                      <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">Elastisch-Idealplastisch</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">Feder + Reibelement (Reihe)</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Warmgewalzter Baustahl (S235, S355):</strong> Elastische Dehnung bis zur Streckgrenze <InlineMath math="f_y" />, danach langes Fließplateau ohne Spannungsanstieg.</li>
                        <li><strong>Fließgelenke im Stahl- &amp; Stahlbetonbau:</strong> Basis des Traglastverfahrens nach Eurocode 3 (plastische Querschnittsklassen 1 und 2).</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Elastische Gitterdehnung gekoppelt mit athermischer Versetzungsbewegung ab <InlineMath math="f_y" />.
                  </div>
                </div>

                {/* 5. Elasto-Plastisch mit Verfestigung */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between border-l-4 border-l-shiraz">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-shiraz text-sm">5. Elasto-Plastisch mit Verfestigung</span>
                      <span className="font-mono text-[10px] bg-red-100 text-shiraz px-2 py-0.5 rounded font-bold">Hardening</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">Feder + Reibelement mit parallelem Tangentenmodul Et</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe &amp; Normbezug:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Betonstabstahl (B500B nach EC2):</strong> Ausgeprägter Verfestigungsast mit <InlineMath math="k = (f_t/f_y)_k \ge 1{,}08" /> zur Sicherung hoher Rotationsfähigkeit im Bruchzustand (GZT).</li>
                        <li><strong>Kaltgezogener Betonstahl (B500A):</strong> Kaltverfestigt mit kontinuierlichem Spannungsanstieg ohne Fließplateau.</li>
                        <li><strong>Aluminiumlegierungen (EN AW-6060 / 6082):</strong> Ausgeprägte Dehnungsverfestigung ab Dehngrenze <InlineMath math="R_{p0{,}2}" />.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Versetzungsaufstau an Korngrenzen (Kaltverfestigung); Bauschinger-Hysterese bei zyklischer Umkehr.
                  </div>
                </div>

                {/* 6. Maxwell */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-purple-700 text-sm">6. Maxwell-Modell</span>
                      <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">Spannungsrelaxation</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">Feder + Dämpfer (Reihe)</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Hochfester Spannstahl (Spannbeton nach EC2):</strong> Vorspanndrähte und Litzen stehen unter konstanter Vordehnung (<InlineMath math="\varepsilon = \text{konst.}" />). Spannkraftverlust durch Relaxation (<InlineMath math="\Delta \sigma_{pr}" />).</li>
                        <li><strong>Elastomere Fugendichtstoffe (Silikon / PU):</strong> In Dehnfugen baut sich die Zugspannung bei Fugenöffnung viskos ab.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Der serielle Dämpfer fließt stetig und entlastet die elastische Feder (<InlineMath math="\sigma(t) \to 0" />).
                  </div>
                </div>

                {/* 7. Kelvin-Voigt */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-emerald-700 text-sm">7. Kelvin-Voigt-Modell</span>
                      <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Kriechen / Retardation</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">Feder + Dämpfer (Parallel)</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Normalbeton &amp; Zementstein (DIN EN 1992-1-1):</strong> Langzeitdurchbiegung von Decken unter Dauerlastspannung. Die Verformung ist durch das elastische Gesteinsgerüst asymptotisch begrenzt (<InlineMath math="\varphi \approx 1{,}5 - 3{,}0" />).</li>
                        <li><strong>Konstruktionsvollholz (C24 nach EC5):</strong> Langzeitkriechen (<InlineMath math="k_{\text{def}} = 0{,}6 - 2{,}0" />) der Ligninmatrix.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Mechanismus: Dämpfer bremst Verformungsgeschwindigkeit; parallele Feder garantiert endlichen Gleichgewichtsendwert.
                  </div>
                </div>

                {/* 8. Zener / Standard Linear Solid */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-indigo-700 text-sm">8. Zener-Modell (SLS)</span>
                      <span className="font-mono text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">Viskoelastischer Festkörper</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">Feder E₁ parallel zu Maxwell (E₂ + η)</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Asphaltbeton im Straßenbau (DIN EN 13108):</strong> Das Mineralgerüst federt elastisch (<InlineMath math="E_1" />), während der Bitumenfilm viskose Relaxationen steuert.</li>
                        <li><strong>Elastomer-Brückenlager (Neopren nach DIN EN 1337-3):</strong> Sofortige elastische Stauchung, gefolgt von Relaxation auf Restspannung <InlineMath math="\sigma_\infty > 0" />.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Kombiniert elastische Sofortantwort, asymptotisch begrenztes Kriechen und unvollständige Relaxation.
                  </div>
                </div>

                {/* 9. Bingham */}
                <div className="p-4 bg-off-white rounded-2xl border border-home-grau/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-teal-800 text-sm">9. Bingham-Körper</span>
                      <span className="font-mono text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">Viskoplastisches Fluid</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-2">Reibelement parallel zu Dämpfer (τ = τ₀ + μ_p · γ̇)</div>
                    <div className="space-y-1.5 text-[11px] text-text-main/80">
                      <div><strong>Typische Baustoffe:</strong></div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        <li><strong>Frischbeton (Transportbeton nach DIN EN 206):</strong> Besitzt eine Fließgrenze <InlineMath math="\tau_0" /> (steht auf dem Förderband) und fließt erst bei Rüttelenergie mit plastischer Viskosität <InlineMath math="\mu_p" />.</li>
                        <li><strong>Selbstverdichtender Beton (SVB / SCC):</strong> Fließgrenze wird minimiert (<InlineMath math="\tau_0 \approx 0" />), hohe Viskosität verhindert Entmischung.</li>
                        <li><strong>Putzmörtel &amp; Fliesenkleber:</strong> Bleiben standfest an senkrechten Wänden haften.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-home-grau/20 text-[10px] text-slate-500">
                    Fließt erst nach Überwinden der inneren Haft- und Fließgrenze; Standardmodell der Frischbeton-Rheologie.
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

// =========================================================================
// HAUPTKOMPONENTE: MATERIALMODELLE
// =========================================================================

export default function Materialmodelle() {
  const [activeModel, setActiveModel] = useState<'linear' | 'non-linear' | 'ideal-plastic' | 'elasto-plastic' | 'visco-elastic' | 'thixotropy-rheopexy'>('elasto-plastic');

  // Interaktive Parameter für "Elasto-Plastisch mit Verfestigung"
  const [epPreset, setEpPreset] = useState<'b500b' | 's355' | 's235' | 'alu' | 'custom'>('b500b');
  const [fyVal, setFyVal] = useState<number>(500); // MPa
  const [eModVal, setEModVal] = useState<number>(200000); // MPa
  const [etModVal, setEtModVal] = useState<number>(2000); // MPa (Verfestigungsmodul)
  const [appliedMaxEpsPromille, setAppliedMaxEpsPromille] = useState<number>(15); // max. Dehnung in Promille für Entlastungspfad

  // Preset-Wechsel für Elasto-Plastisch mit Verfestigung
  const handleSelectEpPreset = (preset: 'b500b' | 's355' | 's235' | 'alu' | 'custom') => {
    setEpPreset(preset);
    if (preset === 'b500b') {
      setFyVal(500);
      setEModVal(200000);
      setEtModVal(1600); // ca. (540 - 500) / (0.050 - 0.0025) ≈ 840-2000 MPa
      setAppliedMaxEpsPromille(20);
    } else if (preset === 's355') {
      setFyVal(355);
      setEModVal(210000);
      setEtModVal(2500);
      setAppliedMaxEpsPromille(15);
    } else if (preset === 's235') {
      setFyVal(235);
      setEModVal(210000);
      setEtModVal(2000);
      setAppliedMaxEpsPromille(15);
    } else if (preset === 'alu') {
      setFyVal(150); // Rp0.2
      setEModVal(70000);
      setEtModVal(1200);
      setAppliedMaxEpsPromille(15);
    }
  };

  // Berechnete Kennwerte für Elasto-Plastisch mit Verfestigung
  const epAnalytics = useMemo(() => {
    const epsY = fyVal / eModVal; // z.B. 500 / 200000 = 0.0025 (2.5 Promille)
    const epsYPromille = epsY * 1000;
    const maxEps = appliedMaxEpsPromille / 1000;
    
    // Spitzenspannung bei maxEps
    let peakStress = 0;
    if (maxEps <= epsY) {
      peakStress = maxEps * eModVal;
    } else {
      peakStress = fyVal + (maxEps - epsY) * etModVal;
    }

    // Elastische Rückfederung bei Entlastung: Delta eps_e = peakStress / E
    const epsElasticRecovery = peakStress / eModVal;
    const epsElasticRecoveryPromille = epsElasticRecovery * 1000;

    // Bleibende plastische Dehnung: eps_p = maxEps - epsElasticRecovery
    const epsPlasticResidual = Math.max(0, maxEps - epsElasticRecovery);
    const epsPlasticResidualPromille = epsPlasticResidual * 1000;

    // Verfestigungsverhältnis k = peakStress / fyVal (nach DIN EN 1992-1-1)
    const kVerhaeltnis = fyVal > 0 ? peakStress / fyVal : 1;

    return {
      epsYPromille,
      peakStress,
      epsElasticRecoveryPromille,
      epsPlasticResidualPromille,
      kVerhaeltnis
    };
  }, [fyVal, eModVal, etModVal, appliedMaxEpsPromille]);

  const generateData = () => {
    if (activeModel === 'thixotropy-rheopexy') {
      const times = [];
      const thixo_eta = [];
      const rheo_eta = [];
      for (let t = 0; t <= 10; t += 0.2) {
        times.push(t.toFixed(1));
        thixo_eta.push(20 + 80 * Math.exp(-0.5 * t));
        rheo_eta.push(100 - 80 * Math.exp(-0.5 * t));
      }
      return {
        labels: times,
        datasets: [
          {
            label: 'Thixotropie η (Pa·s) - Abbau bei konstanter Scherrate',
            data: thixo_eta,
            borderColor: '#991b1b',
            backgroundColor: 'rgba(153, 27, 27, 0.1)',
            fill: false,
            tension: 0.2,
            pointRadius: 0
          },
          {
            label: 'Rheopexie η (Pa·s) - Aufbau bei konstanter Scherrate',
            data: rheo_eta,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: false,
            tension: 0.2,
            pointRadius: 0
          }
        ]
      };
    }

    // Wenn "Elasto-Plastisch mit Verfestigung" aktiv ist:
    if (activeModel === 'elasto-plastic') {
      const maxPlotEps = Math.max(appliedMaxEpsPromille + 5, 25); // Promille
      const epsLabels: string[] = [];
      const sigLoading: (number | null)[] = [];
      const sigIdealPlastic: (number | null)[] = [];
      const sigUnloading: (number | null)[] = [];

      const epsY = fyVal / eModVal;
      const maxEps = appliedMaxEpsPromille / 1000;
      const peakStress = maxEps <= epsY ? maxEps * eModVal : fyVal + (maxEps - epsY) * etModVal;
      const epsResidual = Math.max(0, maxEps - peakStress / eModVal);

      for (let ep = 0; ep <= maxPlotEps; ep += 0.5) {
        const e = ep / 1000; // Dehnung als Dezimalzahl
        epsLabels.push(ep.toFixed(1));

        // 1. Belastungsast bis zum Bruch / Maximalbereich
        if (e <= epsY) {
          sigLoading.push(e * eModVal);
        } else {
          sigLoading.push(fyVal + (e - epsY) * etModVal);
        }

        // 2. Ideal-Plastischer Vergleichsast
        sigIdealPlastic.push(Math.min(e * eModVal, fyVal));

        // 3. Entlastungsast von peakStress bei maxEps zurück zu sigma = 0
        if (e >= epsResidual && e <= maxEps) {
          // Gerade von (epsResidual, 0) bis (maxEps, peakStress) mit Steigung E
          const unlSig = (e - epsResidual) * eModVal;
          sigUnloading.push(unlSig);
        } else {
          sigUnloading.push(null);
        }
      }

      return {
        labels: epsLabels,
        datasets: [
          {
            label: 'Belastungsast (mit Verfestigung Et)',
            data: sigLoading,
            borderColor: '#A3113E',
            backgroundColor: 'rgba(163, 17, 62, 0.08)',
            fill: false,
            borderWidth: 2.5,
            pointRadius: 0
          },
          {
            label: 'Entlastungspfad (elastischer Rücksprung mit Steigung E)',
            data: sigUnloading,
            borderColor: '#2563eb',
            borderDash: [5, 4],
            borderWidth: 2.5,
            fill: false,
            pointRadius: 0
          },
          {
            label: 'Vergleich: Elastisch-Idealplastisch (ohne Verfestigung)',
            data: sigIdealPlastic,
            borderColor: '#94a3b8',
            borderDash: [3, 3],
            borderWidth: 1.5,
            fill: false,
            pointRadius: 0
          }
        ]
      };
    }

    // Standard qualitative Verläufe für andere Modelle
    const eps = [];
    const sig = [];
    const E = 200000; // MPa (typisch für Stahl)
    const fy = 355; // MPa (z.B. S355)

    for (let e = 0; e <= 0.005; e += 0.0001) {
      eps.push((e * 1000).toFixed(1)); // in Promille
      
      if (activeModel === 'linear') {
        sig.push(e * E);
      } else if (activeModel === 'non-linear') {
        const e0 = 0.002;
        sig.push((E * e) / (1 + Math.pow(e / e0, 2)));
      } else if (activeModel === 'ideal-plastic') {
        sig.push(Math.min(e * E, fy));
      } else if (activeModel === 'visco-elastic') {
        const sigma_inf = 400; // MPa
        sig.push(sigma_inf * (1 - Math.exp(- (E * e) / sigma_inf)));
      }
    }

    return {
      labels: eps,
      datasets: [
        {
          label: 'Spannung σ (MPa)',
          data: sig,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(163, 17, 62, 0.1)',
          fill: true,
          tension: 0.1,
          pointRadius: 0
        }
      ]
    };
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Activity className="text-shiraz" /> Materialmodelle &amp; Rheologie
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Materialmodelle (Stoffgesetze) beschreiben den mathematischen Zusammenhang zwischen Spannung und Dehnung (bzw. Kraft und Verformung) eines Baustoffs.
            Sie sind die zwingende Grundlage für reale statisch-konstruktive Nachweise und nichtlineare Finite-Elemente-Berechnungen (FEM).
          </p>
        </div>

        {/* Tab-Navigation für die Grundmodelle */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-2 relative">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'linear' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('linear')}>
            <TrendingUp size={16} /> Linear-Elastisch
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'non-linear' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('non-linear')}>
            <Activity size={16} /> Nichtlinear
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'ideal-plastic' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('ideal-plastic')}>
            <GitCommit size={16} /> Elastisch-Idealplastisch
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'elasto-plastic' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('elasto-plastic')}>
            <GitCommit size={16} /> Elasto-Plastisch mit Verfestigung
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'visco-elastic' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('visco-elastic')}>
            <Timer size={16} /> Rheologisch (Zeitabh.)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeModel === 'thixotropy-rheopexy' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveModel('thixotropy-rheopexy')}>
            <RotateCw size={16} /> Thixotropie &amp; Rheopexie
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
        
        {/* Linke Spalte: Theorie & Parametersteuerung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">
            {activeModel === 'linear' && 'Linear-Elastisches Materialmodell'}
            {activeModel === 'non-linear' && 'Nichtlinear-Elastisches Modell'}
            {activeModel === 'ideal-plastic' && 'Elastisch-Idealplastisches Modell (ohne Verfestigung)'}
            {activeModel === 'elasto-plastic' && 'Elasto-Plastisch mit Verfestigung (Bilineares Stoffgesetz)'}
            {activeModel === 'visco-elastic' && 'Rheologisches Modell (z.B. Maxwell)'}
            {activeModel === 'thixotropy-rheopexy' && 'Thixotropie & Rheopexie (Zeitabhängige Viskosität)'}
          </h3>
          
          <div className="text-sm text-text-main/80 space-y-4">
            {activeModel === 'linear' && (
              <>
                <p><strong>Hookesches Gesetz:</strong> Spannung und Dehnung sind streng proportional. Es gilt <FormulaText text="\sigma = E \cdot \varepsilon" />.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Keine bleibenden Verformungen nach Entlastung (vollständige Reversibilität).</li>
                  <li>Gilt näherungsweise für viele Baustoffe (Stahl, Glas, Holz parallel zur Faser) bei kleinen Dehnungen.</li>
                  <li>Mathematisch am einfachsten zu handhaben, da es auf lineare Gleichungssysteme führt.</li>
                </ul>
              </>
            )}
            {activeModel === 'non-linear' && (
              <>
                <p><strong>Krümmung des Verlaufs:</strong> Spannung und Dehnung sind nicht proportional, jedoch gibt es keine bleibenden Verformungen (elastisch).</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Der Zusammenhang zwischen Spannung und Dehnung ändert sich kontinuierlich.</li>
                  <li>Typisch für Beton unter Druckbelastung vor dem Bruch oder für elastomere Werkstoffe.</li>
                  <li>Oft durch Parabel-Rechteck-Diagramme nach Eurocode 2 oder das Ramberg-Osgood-Modell angenähert.</li>
                </ul>
              </>
            )}
            {activeModel === 'ideal-plastic' && (
              <>
                <p><strong>Fließplateau (ohne Verfestigung):</strong> Nach Erreichen der Fließgrenze (<FormulaText text="f_y" />) nimmt die Dehnung zu, ohne dass sich die Spannung weiter erhöht.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Typisch für klassischen Baustahl (z.B. S235, S355) mit ausgeprägter Streckgrenze.</li>
                  <li>Ermöglicht statische Schnittgrößenumlagerungen in Tragwerken (Fließgelenktheorie / Traglastverfahren nach Eurocode).</li>
                  <li>Nach Entlastung bleiben irreversible plastische Verformungen zurück.</li>
                </ul>
              </>
            )}

            {/* FOKUS: ELASTO-PLASTISCH MIT VERFESTIGUNG */}
            {activeModel === 'elasto-plastic' && (
              <div className="space-y-4">
                <p>
                  <strong>Bilineares Verfestigungsmodell:</strong> Nach Überschreiten der Fließgrenze (<InlineMath math="f_y" />) steigt die Spannung 
                  bei weiterer Dehnung linear entlang des Tangentenmoduls <InlineMath math="E_t" /> (Verfestigungsmodul) an.
                </p>
                
                {/* Werkstoff-Presets */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-text-main/70 uppercase tracking-wide block">Werkstoff-Presets:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => handleSelectEpPreset('b500b')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${epPreset === 'b500b' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'}`}
                    >
                      B500B (Betonstahl)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectEpPreset('s355')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${epPreset === 's355' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'}`}
                    >
                      S355 (Baustahl)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectEpPreset('s235')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${epPreset === 's235' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'}`}
                    >
                      S235 (Weichstahl)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectEpPreset('alu')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${epPreset === 'alu' ? 'bg-shiraz text-white border-shiraz shadow-sm' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'}`}
                    >
                      EN AW-6060 (Alu)
                    </button>
                  </div>
                </div>

                {/* Interaktive Parameter-Slider */}
                <div className="space-y-3 bg-off-white p-4 rounded-xl border border-home-grau/30">
                  <Slider 
                    label={<FormulaText text="Fließgrenze f_y" />} 
                    min={100} 
                    max={700} 
                    step={10} 
                    value={fyVal} 
                    unit="MPa" 
                    onChange={e => { setFyVal(Number(e.target.value)); setEpPreset('custom'); }} 
                  />
                  <Slider 
                    label={<FormulaText text="Elastizitätsmodul E" />} 
                    min={50000} 
                    max={220000} 
                    step={5000} 
                    value={eModVal} 
                    unit="MPa" 
                    onChange={e => { setEModVal(Number(e.target.value)); setEpPreset('custom'); }} 
                  />
                  <Slider 
                    label={<FormulaText text="Verfestigungsmodul E_t (Tangentenmodul)" />} 
                    min={500} 
                    max={10000} 
                    step={250} 
                    value={etModVal} 
                    unit="MPa" 
                    onChange={e => { setEtModVal(Number(e.target.value)); setEpPreset('custom'); }} 
                  />
                  <Slider 
                    label={<FormulaText text="Max. aufgeprägte Dehnung \\varepsilon_{\\text{max}} (für Entlastungspfad)" />} 
                    min={3} 
                    max={40} 
                    step={1} 
                    value={appliedMaxEpsPromille} 
                    unit="‰" 
                    onChange={e => setAppliedMaxEpsPromille(Number(e.target.value))} 
                  />
                </div>

                {/* Live-Berechnungs-Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Fließdehnung ε_y</span>
                    <span className="font-mono font-bold text-sm text-text-main mt-0.5 block">
                      {formatDeZahl(epAnalytics.epsYPromille, 2)} ‰
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">ε_y = f_y / E</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Höchstspannung σ_max</span>
                    <span className="font-mono font-bold text-sm text-shiraz mt-0.5 block">
                      {formatDeZahl(epAnalytics.peakStress, 1)} MPa
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">bei ε = {appliedMaxEpsPromille} ‰</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Verfestigung k = f_t / f_y</span>
                    <span className={`font-mono font-bold text-sm mt-0.5 block ${epAnalytics.kVerhaeltnis >= 1.08 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {formatDeZahl(epAnalytics.kVerhaeltnis, 3)}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">EC2: Klasse B ≥ 1,08</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Rückfederung Δε_e</span>
                    <span className="font-mono font-bold text-sm text-blue-700 mt-0.5 block">
                      {formatDeZahl(epAnalytics.epsElasticRecoveryPromille, 2)} ‰
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">Δε_e = σ_max / E</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-home-grau/25 col-span-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Bleibende Dehnung ε_p</span>
                    <span className="font-mono font-bold text-sm text-purple-900 mt-0.5 block">
                      {formatDeZahl(epAnalytics.epsPlasticResidualPromille, 2)} ‰
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">ε_p = ε_max - Δε_e (plastische Deformation)</span>
                  </div>
                </div>

                <ul className="list-disc list-inside space-y-1 text-xs text-text-main/70">
                  <li><strong>Entlastungsast:</strong> Bei Lastrücknahme entspannt das Material rein linear-elastisch mit voller elastischer Steifigkeit <InlineMath math="E" /> parallel zur Hookeschen Geraden.</li>
                  <li><strong>Kaltverfestigung:</strong> Durch Aufstau von Kristallbaufehlern (Versetzungen) steigt die Scherspannungsgrenze der Gleitebenen.</li>
                  <li><strong>Duktilität nach EC2:</strong> Hochduktiler Betonstahl B500B garantiert durch seinen Verfestigungsast ein großes Sicherheitsvermögen vor dem spröden Versagen.</li>
                </ul>
              </div>
            )}

            {activeModel === 'visco-elastic' && (
              <>
                <p><strong>Zeitabhängigkeit:</strong> Die Beziehung zwischen Spannung und Dehnung hängt von der Zeit bzw. der Belastungsgeschwindigkeit ab.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Kriechen (Retardation):</strong> Zunahme der Dehnung unter konstanter Spannung. Relevant für Beton, Holz und Kunststoffe.</li>
                  <li><strong>Relaxation:</strong> Abnahme der Spannung unter konstanter Dehnung. Maßgebend bei hochfestem Spannstahl (Vorspannungsverluste).</li>
                  <li>Abgebildet durch Kombinationen von elastischen Federn (Hooke) und viskosen Dämpfern (Newton) – z.B. Maxwell- oder Kelvin-Voigt-Modelle.</li>
                </ul>
              </>
            )}

            {activeModel === 'thixotropy-rheopexy' && (
              <div className="flex flex-col gap-4">
                <p><strong>Zeitabhängige Fluid-Eigenschaften (Rheologie):</strong> Bei thixotropen und rheopexen Systemen ändert sich die Viskosität unter konstanter mechanischer Beanspruchungsgeschwindigkeit (Scherung) mit der Zeit.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <h4 className="font-bold text-xs text-red-900 mb-1">Thixotropie (Verflüssigung)</h4>
                    <p className="text-[11px] text-red-800 leading-normal">
                      <strong>Prinzip:</strong> Viskositätsabnahme bei konstanter Scherbeanspruchung. Nach Entlastung baut sich das Netzwerk vollständig wieder auf (Gelkonsistenz).
                      <br /><strong>Bedeutung:</strong> Sichert hervorragende Verarbeitbarkeit beim Pumpen, verhindert danach sofort das Abrutschen (Fliesenkleber, Putze, Betone).
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl border-dashed">
                    <h4 className="font-bold text-xs text-blue-900 mb-1">Rheopexie (Verdickung)</h4>
                    <p className="text-[11px] text-blue-800 leading-normal">
                      <strong>Prinzip:</strong> Viskositätserhöhung bei fortwährender mechanischer Scherung über die Zeit.
                      <br /><strong>Vorkommen:</strong> Extrem selten im Bauwesen; vereinzelt bei hochkonzentrierten feinsten mineralischen Bindemittelsuspensionen.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rechte Spalte: Diagramm */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/30 pb-2">
            <h3 className="text-lg font-bold text-text-main">
              {activeModel === 'thixotropy-rheopexy' ? 'Rheologischer Zeitverlauf (Viskosität η / Zeit t)' : 'Spannungs-Dehnungs-Diagramm σ / ε'}
            </h3>
            {activeModel === 'elasto-plastic' && (
              <span className="text-xs font-mono bg-shiraz/10 text-shiraz border border-shiraz/30 px-2 py-0.5 rounded-full font-bold">
                Bilineare Verfestigung
              </span>
            )}
          </div>

          <div className="h-80 w-full relative">
            <Line 
              data={generateData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { 
                    title: { 
                      display: true, 
                      text: activeModel === 'thixotropy-rheopexy' ? 'Viskosität η (Pa·s)' : 'Spannung σ (MPa)',
                      color: '#1e293b',
                      font: { size: 12, weight: 'bold' }
                    },
                    suggestedMax: activeModel === 'thixotropy-rheopexy' ? 110 : (activeModel === 'elasto-plastic' ? Math.max(600, epAnalytics.peakStress * 1.1) : 500),
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.06)' }
                  },
                  x: { 
                    title: { 
                      display: true, 
                      text: activeModel === 'thixotropy-rheopexy' ? 'Scherdauer t (s) bei konstanter Scherrate' : 'Dehnung ε (‰)',
                      color: '#1e293b',
                      font: { size: 12, weight: 'bold' }
                    },
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.06)' }
                  }
                },
                plugins: { 
                  legend: { 
                    display: activeModel === 'thixotropy-rheopexy' || activeModel === 'elasto-plastic',
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      font: { size: 11 }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const val = context.parsed.y !== null ? context.parsed.y.toFixed(1) : '';
                        const unit = activeModel === 'thixotropy-rheopexy' ? ' Pa·s' : ' MPa';
                        return `${context.dataset.label ? context.dataset.label.split(' ')[0] : 'Wert'}: ${val}${unit}`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* RHEOLOGIE-SIMULATOR FÜR ERSATZMODELLE */}
      <RheologySection />

      {/* FOOTER MIT FORMELN, WIKIPEDIA, NORMEN & LITERATUR */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Hookesches Gesetz', url: 'https://de.wikipedia.org/wiki/Hookesches_Gesetz' },
          { title: 'Rheologie', url: 'https://de.wikipedia.org/wiki/Rheologie' },
          { title: 'Viskoelastizität', url: 'https://de.wikipedia.org/wiki/Viskoelastizit%C3%A4t' },
          { title: 'Fließkurve', url: 'https://de.wikipedia.org/wiki/Flie%C3%9Fkurve' },
          { title: 'Bauschinger-Effekt', url: 'https://de.wikipedia.org/wiki/Bauschinger-Effekt' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1990:2021-10 (Eurocode 0: Grundlagen der Tragwerksplanung)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 1992-1-1:2023-08 (Eurocode 2: Bemessung von Stahlbeton - Nichtlineare Stoffgesetze)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 1993-1-1:2024-03 (Eurocode 3: Bemessung von Stahlbauten - Plastische Grenzzustände)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN 1342-1..3:2003-11 (Viskosität - Rheologische Begriffe und Messverfahren)', url: 'https://www.dinmedia.de/' }
        ]}
        literatur={[
          'Mang, H., Hofstetter, G.: Festigkeitslehre (Springer Vieweg, 2013)',
          'Gross, D., Hauger, W. et al.: Technische Mechanik 4: Hydromechanik, Elemente der Höheren Mechanik (Springer, 2018)',
          'Wriggers, P.: Nichtlineare Finite-Element-Methoden (Springer, 2001)'
        ]}
        formeln={[
          {
            erklaerung: "Hookesches Gesetz (Linear-Elastisch)\n\\sigma: Normalspannung\nE: Elastizitätsmodul\n\\varepsilon: Dehnung",
            formel: "\\sigma = E \\cdot \\varepsilon"
          },
          {
            erklaerung: "Elasto-Plastisch mit bilinearer Verfestigung (DIN EN 1992-1-1)\nf_y: Fließgrenze\nE_t: Tangentenmodul (Verfestigungsmodul)\n\\varepsilon_y: Fließdehnung (\\varepsilon_y = f_y / E)\n\\varepsilon_p: bleibende plastische Dehnung nach Entlastung (\\varepsilon_p = \\varepsilon - \\sigma / E)",
            formel: "\\sigma(\\varepsilon) = \\begin{cases} E \\cdot \\varepsilon & \\text{für } \\varepsilon \\le \\varepsilon_y \\\\ f_y + E_t \\cdot (\\varepsilon - \\varepsilon_y) & \\text{für } \\varepsilon > \\varepsilon_y \\end{cases}"
          },
          {
            erklaerung: "Verfestigungsverhältnis k (Duktilitätskriterium nach Eurocode 2)\nf_t: Zugfestigkeit bei Höchstlast\nf_y: Streckgrenze des Betonstahls (B500B erfordert k >= 1,08)",
            formel: "k = \\frac{f_t}{f_y} = 1 + \\frac{E_t}{f_y} \\cdot (\\varepsilon_{uk} - \\varepsilon_y)"
          },
          {
            erklaerung: "Maxwell-Modell (Viskoelastische Relaxation)\nKombination aus Feder und Dämpfer in Reihe.\n\\dot{\\varepsilon}: Dehnrate\n\\eta: Viskosität des Dämpfers\n\\tau = \\eta / E: Relaxationszeit (Abbau auf 1/e = 36,8 %)",
            formel: "\\dot{\\varepsilon} = \\frac{\\dot{\\sigma}}{E} + \\frac{\\sigma}{\\eta} \\implies \\sigma(t) = \\sigma_0 \\cdot e^{-t / \\tau}"
          },
          {
            erklaerung: "Kelvin-Voigt-Modell (Verzögerte Elastizität / Retardation / Kriechen)\nFeder und Dämpfer parallel geschaltet.\n\\tau = \\eta / E: Retardationszeit",
            formel: "\\sigma = E \\cdot \\varepsilon + \\eta \\cdot \\dot{\\varepsilon} \\implies \\varepsilon(t) = \\frac{\\sigma_0}{E} \\cdot \\left(1 - e^{-t / \\tau}\\right)"
          },
          {
            erklaerung: "Bingham-Modell (Viskoplastisches Fluid für Frischbeton und Mörtel)\n\\tau_0: Fließgrenze (Haftspannung)\n\\mu_p: plastische Viskosität\n\\dot{\\gamma}: Scherrate",
            formel: "\\tau = \\tau_0 + \\mu_p \\cdot \\dot{\\gamma} \\quad \\text{für } |\\tau| > \\tau_0"
          },
          {
            erklaerung: "Dissipationsarbeit / Hysteresefläche pro Zyklus\nW_{diss}: mechanische Dissipationsenergie (in kJ/m³ bzw. N/mm²)\n\\sigma: Spannung, \\varepsilon: Dehnung",
            formel: "W_{\\text{diss}} = \\oint \\sigma \\, d\\varepsilon"
          }
        ]}
      />
    </div>
  );
}
