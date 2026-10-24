import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { formatDeZahl, formatDeWert, formatDeTeX, formatDeTeXWert } from '@/src/utils/numberFormat';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  Sun, 
  Thermometer, 
  CloudRain,
  Sparkles,
  Award
} from 'lucide-react';
import { GEG_U_MAX, psat, uebergang, uWert } from '@/src/calc/waermeschutz';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';

// Detailed material library with density, lambda, moisture resistance factor (mu) and specific heat capacity (c in J/kgK)
const materialLibrary = [
  { id: 'innenputz_gips', name: 'Gipsputz (Innen)', lambda: 0.35, mu: 10, density: 1000, c: 1000 },
  { id: 'innenputz_kalk', name: 'Kalkputz (Innen)', lambda: 0.70, mu: 15, density: 1400, c: 1000 },
  { id: 'aussenputz_zement', name: 'Zementputz (Außen)', lambda: 1.00, mu: 25, density: 1800, c: 1000 },
  { id: 'mauerwerk_ziegel_hochloch', name: 'Hochlochziegel (HLZ)', lambda: 0.42, mu: 5, density: 800, c: 1000 },
  { id: 'mauerwerk_ziegel_voll', name: 'Vollziegel (MZ)', lambda: 0.81, mu: 10, density: 1800, c: 1000 },
  { id: 'mauerwerk_kalksandstein', name: 'Kalksandstein (KS)', lambda: 0.99, mu: 15, density: 2000, c: 1000 },
  { id: 'mauerwerk_porenbeton', name: 'Porenbeton (PB)', lambda: 0.14, mu: 5, density: 400, c: 1000 },
  { id: 'beton_normal', name: 'Normalbeton (Stahlbeton)', lambda: 2.30, mu: 80, density: 2400, c: 1000 },
  { id: 'beton_leicht', name: 'Leichtbeton', lambda: 0.40, mu: 15, density: 1200, c: 1000 },
  { id: 'daemmung_eps', name: 'EPS (Polystyrol-Partikelschaum)', lambda: 0.035, mu: 50, density: 20, c: 1450 },
  { id: 'daemmung_xps', name: 'XPS (Polystyrol-Extruderschaum)', lambda: 0.035, mu: 150, density: 35, c: 1450 },
  { id: 'daemmung_miwo', name: 'Mineralwolle (MiWo)', lambda: 0.035, mu: 1, density: 50, c: 1030 },
  { id: 'daemmung_holzfaser', name: 'Holzfaserplatte (Bio)', lambda: 0.045, mu: 5, density: 160, c: 2100 },
  { id: 'daemmung_pur', name: 'PUR/PIR Hartschaum', lambda: 0.025, mu: 100, density: 30, c: 1400 },
  { id: 'holz_fichte', name: 'Fichte / Tanne (Vollholz)', lambda: 0.13, mu: 40, density: 450, c: 1600 },
  { id: 'holz_eiche', name: 'Eiche (Hardwood)', lambda: 0.20, mu: 50, density: 700, c: 1600 },
  { id: 'platte_osb', name: 'OSB-Platte', lambda: 0.13, mu: 200, density: 600, c: 1700 },
  { id: 'platte_gipskarton', name: 'Gipskartonplatte (GKB)', lambda: 0.25, mu: 10, density: 800, c: 1000 },
  { id: 'folie_pe', name: 'PE-Folie (Dampfsperre)', lambda: 0.50, mu: 100000, density: 900, c: 1500 },
  { id: 'folie_klimamembran', name: 'Klimamembran', lambda: 0.50, mu: 2500, density: 1000, c: 1500 },
  { id: 'luftschicht_ruhend', name: 'Luftschicht (ruhend, 2cm)', lambda: 0.13, mu: 1, density: 1.2, c: 1000 },
  { id: 'stahl', name: 'Stahl', lambda: 50.00, mu: 1000000, density: 7850, c: 460 },
  { id: 'glass', name: 'Glas', lambda: 1.00, mu: 1000000, density: 2500, c: 800 },
  { id: 'custom', name: '✏️ Benutzerdefiniertes Material...', lambda: 0.08, mu: 10, density: 300, c: 1200 }
];

// Room acoustics materials library with scalar and frequency octave band (125, 250, 500, 1000, 2000, 4000 Hz) absorption coefficients
const acousticMaterials = [
  { id: 'beton_roh', name: 'Sichtbeton / Estrich (hart)', alpha: 0.02, alphas: [0.01, 0.01, 0.02, 0.02, 0.02, 0.02] },
  { id: 'putz_gips', name: 'Kalk-Gips-Verputz (glatt)', alpha: 0.04, alphas: [0.02, 0.03, 0.04, 0.05, 0.04, 0.03] },
  { id: 'parkett', name: 'Holzparkett auf Balkenlage', alpha: 0.12, alphas: [0.15, 0.18, 0.12, 0.10, 0.10, 0.10] },
  { id: 'teppich', name: 'Velours-Teppichboden (weich)', alpha: 0.25, alphas: [0.05, 0.10, 0.25, 0.40, 0.50, 0.60] },
  { id: 'vorhang_schwer', name: 'Schwere Vorhangstoffe (gefaltet)', alpha: 0.45, alphas: [0.10, 0.25, 0.50, 0.60, 0.70, 0.70] },
  { id: 'akustik_decke', name: 'Mineralfaser-Lochdecke', alpha: 0.70, alphas: [0.35, 0.55, 0.75, 0.80, 0.80, 0.75] },
  { id: 'akustik_schaum', name: 'Melaminharz-Absorber (Basotect)', alpha: 0.85, alphas: [0.15, 0.45, 0.85, 0.95, 0.98, 0.95] },
  { id: 'glass_fenster', name: 'Große Fensterflächen', alpha: 0.03, alphas: [0.10, 0.05, 0.04, 0.03, 0.03, 0.02] },
  { id: 'fenster_offen', name: 'Offenes Fenster (vollständig)', alpha: 1.00, alphas: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00] }
];

export default function Bauphysik() {
  // Main tab controller: 'thermal_hygric' | 'summer_heat' | 'acoustics'
  const [activeTab, setActiveTab] = useState<'thermal_hygric' | 'summer_heat' | 'acoustics'>('thermal_hygric');

  // Bauteil-Auswahl nach GEG (Außenwand, Steildach, Flachdach, Kellerdecke)
  const [buildingPart, setBuildingPart] = useState<'wall' | 'pitched_roof' | 'flat_roof' | 'basement'>('wall');

  // Wärme & Feuchte State (Standard Winter-Klima nach DIN 4108-3)
  const [Ti, setTi] = useState(20); // Innen-Temperatur
  const [Te, setTe] = useState(-5); // Außen-Temperatur (-5 °C nach DIN 4108-3)
  const [RHi, setRHi] = useState(50); // Innen-Luftfeuchte (50 % nach DIN 4108-3)
  const [RHe, setRHe] = useState(80); // Außen-Luftfeuchte (80 % nach DIN 4108-3)
  const [tauperiodeDauer, setTauperiodeDauer] = useState(90); // Dauer Tauperiode in Tagen (DIN 4108-3)

  // Wall Layer structures
  const [layers, setLayers] = useState([
    { id: 'layer1', matId: 'innenputz_gips', d: 0.015, customName: '', customLambda: 0.35, customMu: 10, customDensity: 1000, customC: 1000 },
    { id: 'layer2', matId: 'mauerwerk_ziegel_hochloch', d: 0.24, customName: '', customLambda: 0.42, customMu: 5, customDensity: 800, customC: 1000 },
    { id: 'layer3', matId: 'daemmung_eps', d: 0.16, customName: '', customLambda: 0.035, customMu: 50, customDensity: 20, customC: 1450 },
    { id: 'layer4', matId: 'aussenputz_zement', d: 0.02, customName: '', customLambda: 1.00, customMu: 25, customDensity: 1800, customC: 1000 }
  ]);

  // Wärmeübergangswiderstände (DIN EN ISO 6946) und GEG-Höchstwerte aus dem Rechenkern src/calc/waermeschutz.ts
  const { Rsi, Rse } = useMemo(() => uebergang(buildingPart), [buildingPart]);
  const gegLimit = GEG_U_MAX[buildingPart];

  // Resolve layers with library values and custom overrides
  const resolvedLayers = useMemo(() => {
    return layers.map(l => {
      if (l.matId === 'custom') {
        return {
          ...l,
          name: l.customName || '✏️ Spezialbaustoff (Benutzerdefiniert)',
          lambda: l.customLambda !== undefined ? l.customLambda : 0.08,
          mu: l.customMu !== undefined ? l.customMu : 10,
          density: l.customDensity !== undefined ? l.customDensity : 300,
          c: l.customC !== undefined ? l.customC : 1200
        };
      }
      const mat = materialLibrary.find(m => m.id === l.matId) || materialLibrary[0];
      return { ...l, ...mat };
    });
  }, [layers]);

  // Master Thermodynamic and Glaser calculation
  const glaserData = useMemo(() => {
    // 1. U-Wert (DIN EN ISO 6946) mit Plausibilitätsprüfung der Schichten
    const uErgebnis = uWert(resolvedLayers, Rsi, Rse);
    const U = uErgebnis.U;

    // 2. Temperature profile through boundaries
    const q = U * (Ti - Te);
    let currentT = Ti - q * Rsi;
    const T_profile = [currentT];
    
    resolvedLayers.forEach(l => {
      currentT -= q * (l.d / l.lambda);
      T_profile.push(currentT);
    });

    // 3. Saturation vapor pressure psat (Magnus Formula)
    const calcPsat = psat; // DIN 4108-3 (Magnus, über Eis unter 0 °C)
    const psat_profile = T_profile.map(calcPsat);

    // 4. Pure linear vapor pressure p (assuming no condensation limit initially)
    const pi = calcPsat(Ti) * (RHi / 100);
    const pe = calcPsat(Te) * (RHe / 100);
    
    let sd_total = 0;
    resolvedLayers.forEach(l => sd_total += l.d * l.mu);
    
    const g_diff = (pi - pe) / sd_total;
    let currentP = pi;
    const p_profile_raw = [currentP];
    
    resolvedLayers.forEach(l => {
      currentP -= g_diff * (l.d * l.mu);
      p_profile_raw.push(currentP);
    });

    // 5. Correct Glaser physical vapor pressure (caps at psat boundary)
    // We check if at any layer interface, raw vapor pressure exceeds saturation vapor pressure
    let maxViolation = 0;
    let condensationIndex = -1;
    for (let i = 0; i < p_profile_raw.length; i++) {
      const violation = p_profile_raw[i] - psat_profile[i];
      if (violation > maxViolation) {
        maxViolation = violation;
        condensationIndex = i;
      }
    }

    let p_profile = [...p_profile_raw];
    const isCondensing = maxViolation > 0.05 && condensationIndex > 0 && condensationIndex < p_profile_raw.length - 1;
    let condMassFlowWinter = 0; // g/(m²·h)
    let evapMassFlowSummer = 0; // g/(m²·h)

    if (isCondensing) {
      // Condensation boundary coordinate plane (C)
      const sd_C = resolvedLayers.slice(0, condensationIndex).reduce((acc, l) => acc + l.d * l.mu, 0);
      const psat_C = psat_profile[condensationIndex];

      // Re-profile vapor pressure taking saturation at boundary into account (Glaser double-straight-line curve)
      p_profile = p_profile_raw.map((_, i) => {
        if (i <= condensationIndex) {
          const sd_curr = resolvedLayers.slice(0, i).reduce((acc, l) => acc + l.d * l.mu, 0);
          return pi - (pi - psat_C) * (sd_C > 0 ? sd_curr / sd_C : 0);
        } else {
          const sd_curr = resolvedLayers.slice(0, i).reduce((acc, l) => acc + l.d * l.mu, 0);
          const sd_dist = sd_total - sd_C;
          return psat_C - (psat_C - pe) * (sd_dist > 0 ? (sd_curr - sd_C) / sd_dist : 0);
        }
      });

      // Calculate Winter Condensation flux according to DIN 4108-3 Glaser algorithm
      // Wasserdampf-Diffusionsleitkoeffizient ruhender Luft nach DIN 4108-3:
      // delta_0 = 2,0 · 10^-10 kg/(m·s·Pa) = 7,2 · 10^-7 kg/(m·h·Pa)
      const delta_a = 7.2e-7; // kg/(m·h·Pa)
      const sd_before = sd_C;
      const sd_after = sd_total - sd_C;

      const flow_in = (pi - psat_C) / (sd_before > 0 ? sd_before : 0.01);
      const flow_out = (psat_C - pe) / (sd_after > 0 ? sd_after : 0.01);
      
      condMassFlowWinter = Math.max(0, delta_a * (flow_in - flow_out) * 1000); // g/(m²·h)

      // Verdunstungsperiode vereinfacht: innen und außen 12 °C / 70 % r. F., Tauwasserebene 12 °C
      // (klassisches Glaser-Klima; Randbedingungen der DIN 4108-3:2024-03 abweichend – manuell prüfen)
      const T_summer = 12;
      const psat_summer_total = calcPsat(T_summer); // 1402 Pa
      const p_ambient_summer = psat_summer_total * 0.70; // 981 Pa
      
      // Condensation plane is saturated at T_summer
      const flow_summer_interior = (psat_summer_total - p_ambient_summer) / (sd_before > 0 ? sd_before : 0.01);
      const flow_summer_exterior = (psat_summer_total - p_ambient_summer) / (sd_after > 0 ? sd_after : 0.01);
      
      evapMassFlowSummer = delta_a * (flow_summer_interior + flow_summer_exterior) * 1000; // g/(m²·h)
    }

    // Winter period is typically 90 days (2160 hours)
    // Summer drying period is typically 90 days (2160 hours)
    const winter_hours = tauperiodeDauer * 24;
    const summer_hours = 2160;
    const totalCondensation = condMassFlowWinter * winter_hours; // g/m²
    const totalPotentialEvaporation = evapMassFlowSummer * summer_hours; // g/m²

    const sd_profile = [0];
    let currentSd = 0;
    resolvedLayers.forEach(l => {
      currentSd += l.d * l.mu;
      sd_profile.push(currentSd);
    });

    return {
      U,
      R_T: uErgebnis.R_T,
      hinweise: uErgebnis.hinweise,
      labels: sd_profile.map(sd => formatDeZahl(sd, 2) + 'm'),
      T_labels: T_profile.map((_, i) => i === 0 ? 'Innen' : i === T_profile.length - 1 ? 'Außen' : `Grenzfl. ${i}`),
      T_profile,
      sd_total,
      isCondensing,
      condensationIndex,
      condMassFlowWinter,
      evapMassFlowSummer,
      totalCondensation,
      totalPotentialEvaporation,
      p_profile,
      psat_profile,
      datasets: [
        {
          label: 'Sättigungsdampfdruck p_sat (Pa)',
          data: psat_profile,
          borderColor: '#A3113E',
          borderDash: [4, 4],
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: '#A3113E',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Glaser Partialdampfdruck p (Pa)',
          data: p_profile,
          borderColor: '#475569',
          backgroundColor: 'rgba(59, 130, 246, 0.07)',
          fill: true,
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: '#334155',
          tension: 0
        }
      ]
    };
  }, [Ti, Te, RHi, RHe, resolvedLayers, tauperiodeDauer, Rsi, Rse]);

  // Sommerlicher Wärmeschutz - Phase shift & Damping calculations
  const summerHeatAnalysis = useMemo(() => {
    // Total Heat Capacity (Wärmespeicherfähigkeit C_tot in kJ/m²K)
    let totalHeatCapacity = 0; // J/(m²K)
    resolvedLayers.forEach(l => {
      totalHeatCapacity += l.d * l.density * l.c;
    });

    // Dämpfungsexponent X = Σ d_k / δ_k mit Eindringtiefe δ_k = sqrt(λ_k · T / (π · ρ_k · c_k)), T = 24 h
    let dampingExponent = 0;
    resolvedLayers.forEach(l => {
      if (l.lambda > 0) {
        dampingExponent += l.d * Math.sqrt((Math.PI * l.density * l.c) / (86400 * l.lambda));
      }
    });

    // Phasenverschiebung η = X · T/(2π) = X · 24/(2π) in Stunden
    const phaseShift = dampingExponent * (24 / (2 * Math.PI));

    // Amplitudenverhältnis TAV = e^(-X) – konsistent zu η (vereinfacht, ohne Übergangswiderstände)
    const TAV = Math.exp(-dampingExponent);

    return {
      totalHeatCapacity: totalHeatCapacity / 1000, // converted to kJ/m²K
      phaseShift, // in hours
      TAV, // attenuation factor
    };
  }, [resolvedLayers]);

  // Visual simulation of outdoor vs indoor surface temperature over 24 hours
  const dailyTemperatureChartData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const t_labels = hours.map(h => `${String(h).padStart(2, '0')}:00 Uhr`);

    const t_outside = hours.map(h => {
      // Direct solar-thermal load peaking at 14:00 (sine amplitude of 10 K around mean of 25°C)
      return 24 + 9 * Math.sin((h - 8) * Math.PI / 12);
    });

    const t_inside = hours.map(h => {
      // At interior surface: damped amplitude and phase shift eta
      const shift = summerHeatAnalysis.phaseShift;
      const tav = summerHeatAnalysis.TAV;
      return 21.5 + 9 * tav * Math.sin((h - 8 - shift) * Math.PI / 12);
    });

    return {
      labels: t_labels,
      datasets: [
        {
          label: 'Außenluft-Temperatur (°C) [T_a]',
          data: t_outside,
          borderColor: '#A3113E', // rose-500
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 1,
          tension: 0.45,
          fill: false,
        },
        {
          label: 'Innenwand-Oberflächen-Temperatur (°C) [T_si]',
          data: t_inside,
          borderColor: '#475569', // sky-600
          backgroundColor: 'rgba(56, 189, 248, 0.1)', // sky-300 light overlay
          borderWidth: 3,
          pointRadius: 2,
          tension: 0.45,
          fill: true,
        },
      ],
    };
  }, [summerHeatAnalysis]);

  // Raumakustik - Sabine's Reverberation Calculator Setup
  const [roomW, setRoomW] = useState(6.0); // width
  const [roomL, setRoomL] = useState(8.0); // length
  const [roomH, setRoomH] = useState(3.0); // height
  const [roomType, setRoomType] = useState<'classroom' | 'office' | 'hall'>('classroom');

  // Surface material assignments
  const [selectedCeiling, setSelectedCeiling] = useState('akustik_decke');
  const [selectedFloor, setSelectedFloor] = useState('parkett');
  const [selectedFrontWall, setSelectedFrontWall] = useState('putz_gips');
  const [selectedBackWall, setSelectedBackWall] = useState('vorhang_schwer');
  const [selectedLeftWall, setSelectedLeftWall] = useState('glass_fenster');
  const [selectedRightWall, setSelectedRightWall] = useState('putz_gips');

  const acousticsResults = useMemo(() => {
    const volume = roomW * roomL * roomH;
    
    // Areas of surfaces
    const areaCeiling = roomW * roomL;
    const areaFloor = roomW * roomL;
    const areaFront = roomW * roomH;
    const areaBack = roomW * roomH;
    const areaLeft = roomL * roomH;
    const areaRight = roomL * roomH;
    const totalSurfaceArea = 2 * (roomW * roomL + roomW * roomH + roomL * roomH);

    // Helper to get absorption
    const getAlpha = (id: string) => {
      const mat = acousticMaterials.find(m => m.id === id);
      return mat ? mat.alpha : 0.05;
    };

    const alphaCeiling = getAlpha(selectedCeiling);
    const alphaFloor = getAlpha(selectedFloor);
    const alphaFront = getAlpha(selectedFrontWall);
    const alphaBack = getAlpha(selectedBackWall);
    const alphaLeft = getAlpha(selectedLeftWall);
    const alphaRight = getAlpha(selectedRightWall);

    // Equivalent absorption area A = sum(S_i * alpha_i)
    const equivalentAbsorptionArea = (areaCeiling * alphaCeiling) +
                                    (areaFloor * alphaFloor) +
                                    (areaFront * alphaFront) +
                                    (areaBack * alphaBack) +
                                    (areaLeft * alphaLeft) +
                                    (areaRight * alphaRight);

    // Sabine's Formula: T = 0.163 * V / A
    const T = equivalentAbsorptionArea > 0.05 ? (0.163 * volume) / equivalentAbsorptionArea : 9.99;

    // DIN 18041:2016-03, Gruppe A: T_soll abhängig vom Raumvolumen; Toleranz 0,8 bis 1,2 · T_soll (250–2000 Hz)
    const lgV = Math.log10(Math.max(volume, 30));
    let T_target = Math.max(0.3, 0.32 * lgV - 0.17); // A3 Unterricht/Kommunikation
    let roomLabel = 'Schul- / Unterrichtsraum (Nutzungsart A3)';
    let minTarget = 0.8 * T_target;
    let maxTarget = 1.2 * T_target;

    if (roomType === 'office') {
      // Gruppe B: keine T_soll-Anforderung, sondern A/V-Empfehlung; Orientierungswert
      T_target = 0.75;
      roomLabel = 'Mehrpersonen-Büro / Kantine (Gruppe B, Orientierungswert)';
      minTarget = 0.60;
      maxTarget = 0.85;
    } else if (roomType === 'hall') {
      T_target = Math.max(0.3, 0.37 * lgV - 0.14); // A2 Sprache/Vortrag
      roomLabel = 'Hörsaal / Vortragssaal (Nutzungsart A2)';
      minTarget = 0.8 * T_target;
      maxTarget = 1.2 * T_target;
    }

    const stateDesc = T > maxTarget 
      ? 'Zu viel Nachhall: Die Sprachverständlichkeit sinkt.' 
      : T < minTarget 
        ? 'Zu trocken (akustisch überdämpft): Sprechende müssen lauter sprechen.' 
        : 'Nachhallzeit im Toleranzbereich nach DIN 18041.';

    return {
      volume,
      equivalentAbsorptionArea,
      totalSurfaceArea,
      reverberationTime: T,
      T_target,
      minTarget,
      maxTarget,
      stateDesc,
      roomLabel,
      areas: {
        Ceiling: { label: 'Decke', area: areaCeiling, alpha: alphaCeiling },
        Floor: { label: 'Boden', area: areaFloor, alpha: alphaFloor },
        FrontWall: { label: 'Stirnwand', area: areaFront, alpha: alphaFront },
        BackWall: { label: 'Rückwand', area: areaBack, alpha: alphaBack },
        LeftWall: { label: 'Linke Wand', area: areaLeft, alpha: alphaLeft },
        RightWall: { label: 'Rechte Wand', area: areaRight, alpha: alphaRight }
      }
    };
  }, [roomW, roomL, roomH, roomType, selectedCeiling, selectedFloor, selectedFrontWall, selectedBackWall, selectedLeftWall, selectedRightWall]);

  // Frequency-resolved room acoustics octave band simulation (125Hz to 4000Hz)
  const acousticsFrequencyResolved = useMemo(() => {
    const frequencies = [125, 250, 500, 1000, 2000, 4000];
    const volume = roomW * roomL * roomH;

    const areaCeiling = roomW * roomL;
    const areaFloor = roomW * roomL;
    const areaFront = roomW * roomH;
    const areaBack = roomW * roomH;
    const areaLeft = roomL * roomH;
    const areaRight = roomL * roomH;

    const getAlphasForMaterial = (id: string) => {
      const mat = acousticMaterials.find(m => m.id === id);
      if (mat) {
        if (mat.alphas) return mat.alphas;
        return Array(6).fill(mat.alpha);
      }
      return Array(6).fill(0.05);
    };

    const alphasCeiling = getAlphasForMaterial(selectedCeiling);
    const alphasFloor = getAlphasForMaterial(selectedFloor);
    const alphasFront = getAlphasForMaterial(selectedFrontWall);
    const alphasBack = getAlphasForMaterial(selectedBackWall);
    const alphasLeft = getAlphasForMaterial(selectedLeftWall);
    const alphasRight = getAlphasForMaterial(selectedRightWall);

    // Calculate sum of absorption at each octave band
    const calculatedTimes = frequencies.map((_, i) => {
      const A = (areaCeiling * alphasCeiling[i]) +
                (areaFloor * alphasFloor[i]) +
                (areaFront * alphasFront[i]) +
                (areaBack * alphasBack[i]) +
                (areaLeft * alphasLeft[i]) +
                (areaRight * alphasRight[i]);
      return A > 0.05 ? (0.163 * volume) / A : 9.99;
    });

    const baseTarget = acousticsResults.T_target;

    // Toleranzbereich nach DIN 18041 (Gruppe A), vereinfacht: 250–2000 Hz 0,8–1,2 · T_soll;
    // 125 Hz bis 1,45 · T_soll nach oben und 0,65 nach unten, 4000 Hz 0,65–1,2 (Eckwerte manuell prüfen)
    const targetMin = frequencies.map((f) => baseTarget * (f === 125 || f === 4000 ? 0.65 : 0.8));

    const targetMax = frequencies.map((f) => baseTarget * (f === 125 ? 1.45 : 1.2));

    const targetCenter = frequencies.map(() => baseTarget);

    return {
      labels: frequencies.map(f => `${formatDeWert(f)} Hz`),
      calculatedTimes,
      targetMin,
      targetMax,
      targetCenter
    };
  }, [roomW, roomL, roomH, roomType, selectedCeiling, selectedFloor, selectedFrontWall, selectedBackWall, selectedLeftWall, selectedRightWall, acousticsResults.T_target]);

  // Technical chart datasets formatting for DIN 18041 visualization
  const acousticsChartData = useMemo(() => {
    return {
      labels: acousticsFrequencyResolved.labels,
      datasets: [
        {
          label: 'Berechnete Nachhallzeit T(f) [s]',
          data: acousticsFrequencyResolved.calculatedTimes,
          borderColor: '#A3113E', // Shiraz Primary color
          backgroundColor: '#A3113E',
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.15,
          fill: false,
        },
        {
          label: 'Optimum T_soll [s]',
          data: acousticsFrequencyResolved.targetCenter,
          borderColor: '#475569', // Slate Gray
          borderWidth: 1.5,
          borderDash: [6, 6],
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'DIN 18041 Toleranz-Oberkante',
          data: acousticsFrequencyResolved.targetMax,
          borderColor: '#94A3B8', // Orange
          borderWidth: 1.2,
          borderDash: [3, 3],
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'DIN 18041 Toleranz-Unterkante',
          data: acousticsFrequencyResolved.targetMin,
          borderColor: '#94A3B8', // Orange
          borderWidth: 1.2,
          borderDash: [3, 3],
          pointRadius: 0,
          fill: false,
        }
      ]
    };
  }, [acousticsFrequencyResolved]);

  // Interactive UI actions
  const addLayer = () => {
    setLayers([
      ...layers, 
      { 
        id: `layer${Date.now()}`, 
        matId: 'daemmung_eps', 
        d: 0.10,
        customName: '',
        customLambda: 0.035,
        customMu: 50,
        customDensity: 20,
        customC: 1450
      }
    ]);
  };

  const removeLayer = (index: number) => {
    const newLayers = [...layers];
    newLayers.splice(index, 1);
    setLayers(newLayers);
  };

  const moveLayer = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newLayers = [...layers];
      const temp = newLayers[index - 1];
      newLayers[index - 1] = newLayers[index];
      newLayers[index] = temp;
      setLayers(newLayers);
    } else if (direction === 'down' && index < layers.length - 1) {
      const newLayers = [...layers];
      const temp = newLayers[index + 1];
      newLayers[index + 1] = newLayers[index];
      newLayers[index] = temp;
      setLayers(newLayers);
    }
  };

  const updateLayer = (index: number, field: string, value: any) => {
    const newLayers = [...layers];
    newLayers[index] = { ...newLayers[index], [field]: value };
    setLayers(newLayers);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. ACADEMY HERO HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-shiraz text-white rounded-xl flex items-center justify-center">
              <Activity size={24} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                Bauphysik-Zentrum d. TH Augsburg
              </h2>
              <p className="text-sm text-text-main/60 mt-0.5">
                Simulationsrechner für U-Wert, klimabedingten Feuchteschutz (Glaser) und Hallzeitraum-Tuning (DIN 18041)
              </p>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE TAB CONTROLLER */}
        <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button aria-pressed={activeTab === 'thermal_hygric'}
            onClick={() => setActiveTab('thermal_hygric')}
            className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'thermal_hygric' 
                ? 'bg-shiraz text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <CloudRain size={14} /> Feuchte- &amp; Wärmeschutz (Glaser)
          </button>
          
          <button aria-pressed={activeTab === 'summer_heat'}
            onClick={() => setActiveTab('summer_heat')}
            className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'summer_heat' 
                ? 'bg-shiraz text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sun size={14} /> Sommerlicher Wärmeschutz (Trägheit)
          </button>

          <button aria-pressed={activeTab === 'acoustics'}
            onClick={() => setActiveTab('acoustics')}
            className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'acoustics' 
                ? 'bg-shiraz text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Volume2 size={14} /> Raumakustik (Nachhallzeit T)
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT 1: THERMAL HYGRIC (GLASER SIMULATION) */}
      {activeTab === 'thermal_hygric' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls - Left spanning 5 columns */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Climate Conditions */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
                <Thermometer size={14} className="text-shiraz" /> Klima-Randbedingungen &amp; Bauteil
              </h3>

              {/* Bauteil-Zuweisung und GEG Auswahl */}
              <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Bauteil-Typ (Regelt R_si &amp; GModG/GEG Sollwert):
                </label>
                <select 
                  id="building-part-select"
                  aria-label="Bauteil-Typ"
                  value={buildingPart}
                  onChange={(e) => setBuildingPart(e.target.value as any)}
                  className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-lg font-bold text-slate-800 cursor-pointer focus:ring-1 focus:ring-shiraz"
                >
                  <option value="wall">Außenwand (Soll: U ≤ 0,24 W/(m²K), Rsi = 0,13 m²K/W)</option>
                  <option value="pitched_roof">Steildach / Dachfläche (Soll: U ≤ 0,24 W/(m²K), Rsi = 0,10 m²K/W)</option>
                  <option value="flat_roof">Flachdach (Soll: U ≤ 0,20 W/(m²K), Rsi = 0,10 m²K/W)</option>
                  <option value="basement">Kellerdecke gegen unbeheizten Keller (Soll: U ≤ 0,30 W/(m²K), Rsi = Rse = 0,17 m²K/W)</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                    <h4 className="font-bold text-xs text-shiraz mb-2">Innenklima</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Temperatur (T_i)</span>
                        <span className="text-shiraz">{formatDeWert(Ti)} °C</span>
                      </div>
                      <input 
                        type="range" min="15" max="25" step="1" value={Ti} 
                        aria-label="Innentemperatur Ti in °C"
                        onChange={(e) => setTi(Number(e.target.value))} 
                        className="w-full accent-shiraz h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] font-bold text-slate-700 mt-2">
                        <span>Feuchte (RH_i)</span>
                        <span className="text-shiraz">{formatDeWert(RHi)}%</span>
                      </div>
                      <input 
                        type="range" min="30" max="80" step="5" value={RHi} 
                        aria-label="Innenluftfeuchte RHi in %"
                        onChange={(e) => setRHi(Number(e.target.value))} 
                        className="w-full accent-shiraz h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-xs text-blue-600 mb-2">Außenklima</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Temperatur (T_e)</span>
                        <span className="text-blue-600">{formatDeWert(Te)} °C</span>
                      </div>
                      <input 
                        type="range" min="-20" max="5" step="1" value={Te} 
                        aria-label="Außentemperatur Te in °C"
                        onChange={(e) => setTe(Number(e.target.value))} 
                        className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] font-bold text-slate-700 mt-2">
                        <span>Feuchte (RH_e)</span>
                        <span className="text-blue-600">{formatDeWert(RHe)}%</span>
                      </div>
                      <input 
                        type="range" min="40" max="100" step="5" value={RHe} 
                        aria-label="Außenluftfeuchte RHe in %"
                        onChange={(e) => setRHe(Number(e.target.value))} 
                        className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span>Dauer Tauperiode (DIN 4108-3):</span>
                    <span className="text-shiraz font-mono">{formatDeWert(tauperiodeDauer)} Tage ({formatDeWert(tauperiodeDauer * 24)} h)</span>
                  </div>
                  <input 
                    type="range" min="30" max="150" step="5" value={tauperiodeDauer} 
                    aria-label="Dauer der Tauperiode in Tagen"
                    onChange={(e) => setTauperiodeDauer(Number(e.target.value))} 
                    className="w-full accent-shiraz h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                    <span>30 Tage</span>
                    <span>Standard: 90 Tage (DIN 4108-3)</span>
                    <span>150 Tage</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Layer Configuration list */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Layers size={14} className="text-slate-600" /> Bauteilschichten (Innen → Außen)
                </h3>
                <button 
                  onClick={addLayer}
                  aria-label="Schicht hinzufügen (neue Bauteilschicht)"
                  className="px-2.5 py-1 bg-shiraz hover:bg-slate-900 border border-transparent hover:border-slate-800 text-white rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-all uppercase tracking-wider shadow pointer-events-auto"
                >
                  <Plus size={12} /> Schicht
                </button>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {layers.map((layer, index) => (
                  <div key={layer.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1.5">
                        <button 
                          onClick={() => moveLayer(index, 'up')} 
                          disabled={index === 0} 
                          aria-label="Schicht nach oben verschieben"
                          className="text-slate-400 hover:text-shiraz disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button 
                          onClick={() => moveLayer(index, 'down')} 
                          disabled={index === layers.length - 1} 
                          aria-label="Schicht nach unten verschieben"
                          className="text-slate-400 hover:text-shiraz disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      <div className="flex-1 grid grid-cols-12 gap-2">
                        <div className="col-span-8">
                          <select 
                            value={layer.matId}
                            aria-label={`Material für Schicht ${index + 1}`}
                            onChange={(e) => updateLayer(index, 'matId', e.target.value)}
                            className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-lg font-medium text-slate-800 focus:ring-1 focus:ring-shiraz cursor-pointer"
                          >
                            {materialLibrary.map(mat => (
                              <option key={mat.id} value={mat.id}>{mat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-4 relative">
                          <input 
                            type="number" 
                            min="0.001" 
                            step="0.005"
                            aria-label={`Dicke für Schicht ${index + 1} in Metern`}
                            value={layer.d}
                            onChange={(e) => updateLayer(index, 'd', parseFloat(e.target.value) || 0)}
                            className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-lg font-mono text-slate-800 focus:ring-1 focus:ring-shiraz text-center pr-5"
                          />
                          <span className="absolute right-1.5 top-1.5 text-[9px] text-slate-400 font-bold">m</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeLayer(index)} 
                        aria-label={`Schicht ${index + 1} entfernen`}
                        className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Interactive Sub-Parameters Editor if benutzerdefiniert custom was chosen */}
                    {layer.matId === 'custom' && (
                      <div className="pt-2 border-t border-slate-200/60 grid grid-cols-5 gap-1.5 text-[9px] text-slate-400">
                        <div className="col-span-2">
                          <label className="font-bold block mb-0.5">Sollname</label>
                          <input 
                            type="text" 
                            placeholder="Spezialstoff"
                            className="w-full text-[10px] p-1 border border-slate-200 bg-white rounded font-medium text-slate-800"
                            value={layer.customName || ''}
                            onChange={(e) => updateLayer(index, 'customName', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-0.5">λ [W/mK]</label>
                          <input aria-label="λ [W/mK]" 
                            type="number" step="0.005" min="0.001"
                            className="w-full text-[10px] p-1 border border-slate-200 bg-white rounded font-mono text-slate-800 text-center"
                            value={layer.customLambda !== undefined ? layer.customLambda : 0.08}
                            onChange={(e) => updateLayer(index, 'customLambda', parseFloat(e.target.value) || 0.08)}
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-0.5">μ [-]</label>
                          <input aria-label="μ [-]" 
                            type="number" step="1" min="1"
                            className="w-full text-[10px] p-1 border border-slate-200 bg-white rounded font-mono text-slate-800 text-center"
                            value={layer.customMu !== undefined ? layer.customMu : 10}
                            onChange={(e) => updateLayer(index, 'customMu', parseInt(e.target.value) || 10)}
                          />
                        </div>
                        <div>
                          <label className="font-bold block mb-0.5">ρ [kg/m³]</label>
                          <input aria-label="ρ [kg/m³]" 
                            type="number" step="50" min="10"
                            className="w-full text-[10px] p-1 border border-slate-200 bg-white rounded font-mono text-slate-800 text-center"
                            value={layer.customDensity !== undefined ? layer.customDensity : 300}
                            onChange={(e) => updateLayer(index, 'customDensity', parseInt(e.target.value) || 300)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visualization & Evaluation Results - Right spanning 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Interactive Glaser Dampfdruck Chart */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center justify-between">
                <span>Glaser-Sättigungsdiagramm (Dampfdrücke)</span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 font-bold">
                  S_d gesamt = {formatDeZahl(glaserData.sd_total, 2)} m
                </span>
              </h3>
              
              <div className="h-[280px] w-full relative">
                <Line 
                  data={{ labels: glaserData.labels, datasets: glaserData.datasets }} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { title: { display: true, text: 'Wasserdampfdiffusionsäquivalente Luftschichtdicke s_d (m)', font: { size: 10, weight: 'bold' } } },
                      y: { title: { display: true, text: 'Dampfdruck (Pa)', font: { size: 10, weight: 'bold' } } }
                    },
                    plugins: {
                      legend: { labels: { font: { size: 11, weight: 'bold' } } }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Quantitative Safety Audit DIN 4108-3 Verification */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
                <Award size={14} className="text-shiraz" /> Feuchtetechnische Bewertung nach DIN 4108-3
              </h3>

              {!glaserData.isCondensing ? (
                // SUCCESS NOTIFICATION BOX
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-800">BAUTEIL ABSOLUT KONDENSATIONSFREI</h4>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                      Unter den gewählten Klimarandbedingungen wird an keiner Grenzfläche die Sättigungsgrenze (<FormulaText text="p < p_{sat}" />) erreicht. Es fällt <strong>kein Tauwasser (0,0 g/m²)</strong> an. Der normative Nachweis nach DIN 4108-3 gilt für diese Periode als rein rechnerisch bestanden!
                    </p>
                  </div>
                </div>
              ) : (
                // CONDENSATION WARNING & COMPUTATIONAL AUDIT REPORT
                <div className="space-y-4">
                  <div className="p-4 bg-off-white border border-rose-250 rounded-xl flex items-start gap-3">
                    <CloudRain className="text-rose-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                      <h4 className="font-extrabold text-sm text-rose-800 uppercase tracking-wide">
                        Tauwasserausfall an Grenzfläche {formatDeWert(glaserData.condensationIndex)}!
                      </h4>
                      <p className="text-xs text-shiraz-900 mt-1 leading-relaxed">
                        Die rote und blaue Kennlinie berühren sich. Im Bauteilinneren an der Schnittstelle nach dem Werkstoff <strong>"{resolvedLayers[glaserData.condensationIndex - 1]?.name}"</strong> kommt es zur Kondensation infolge ungenügender Dampfsperrwirkung auf der warmen Innenseite.
                      </p>
                    </div>
                  </div>

                  {/* Quantitative calculation balance card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Winter-Kondensat m_c</div>
                      <div className="text-xl font-black text-rose-600 font-mono mt-1">
                        {formatDeZahl(glaserData.totalCondensation, 1)} <span className="text-xs">g/m²</span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">@ 90 Tage Winter</div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Sommer-Trocknung m_evap</div>
                      <div className="text-xl font-black text-emerald-600 font-mono mt-1">
                        {formatDeZahl(glaserData.totalPotentialEvaporation, 1)} <span className="text-xs">g/m²</span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">@ 90 Tage Sommer</div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Bilanzergebnis</div>
                      <div className="text-xl font-black text-slate-800 font-mono mt-1">
                        {glaserData.totalPotentialEvaporation > glaserData.totalCondensation && glaserData.totalCondensation <= 1000 ? '+ Bestanden' : '- Kritisch'}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">Vollständige Austrocknung</div>
                    </div>
                  </div>

                  {/* Expert Normative Statement */}
                  <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
                    <div className="text-xs font-normal leading-normal text-slate-300">
                      <strong>Ingenieur-Empfehlung:</strong> 
                      {glaserData.totalPotentialEvaporation > glaserData.totalCondensation && glaserData.totalCondensation <= 1000 ? (
                        <span> Da die Sommerverdunstung die Winter-Kondensatmenge übersteigt (<span className="text-emerald-400 font-semibold font-mono">m_evap &gt; m_c</span>) und <span className="text-slate-100 font-semibold font-mono">m_c &lt; 1000 g/m²</span> liegt, sind die Grundkriterien nach DIN 4108-3 erfüllt (zusätzlich 500 g/m² an nicht kapillar wasseraufnahmefähigen Schichtgrenzen und Holzfeuchte-Grenzen beachten). Eine raumseitig diffusionshemmende Schicht verringert die Tauwassermenge weiter.</span>
                      ) : (
                        <span className="text-rose-300 font-bold"> Das Bauteil kann im Sommer nicht vollständig austrocknen! Gefahr der Akkumulation über Jahre hinweg und Holzfäule gefürchtet. Installiere auf der warmen Innenseite zwingend eine Klimamembran oder PE-Dampfsperrfolie!</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <EingabeHinweise hinweise={glaserData.hinweise} />
              {/* GEG 2024 & DIN 4108-2 f_RSi Mold Risk overall Audit Panel */}
              <div className="mt-4 pt-4 border-t border-slate-150 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* GEG 2024 Compliance Check Card */}
                {(() => {
                  const isGegCompliant = glaserData.U <= gegLimit;
                  return (
                    <div className={`p-4 rounded-xl border ${isGegCompliant ? 'bg-emerald-50/40 border-emerald-150 text-emerald-950' : 'bg-red-50/40 border-red-150 text-red-950'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">GModG Konformität (vormals GEG)</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${isGegCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {isGegCompliant ? 'U-Wert konform' : 'U-Wert unzureichend'}
                        </span>
                      </div>
                      <div className="text-xs space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-slate-600">Soll-Grenzwert:</span>
                          <span className="font-mono text-slate-500">≤ {formatDeZahl(gegLimit, 2)} W/(m²K)</span>
                        </div>
                        <div className="flex justify-between items-baseline pb-1 select-all">
                          <span className="font-semibold text-slate-800">Ist U-Wert:</span>
                          <span className="font-mono font-black text-[13px] text-slate-900">{formatDeZahl(glaserData.U, 3)} W/(m²K)</span>
                        </div>
                        <div className="text-[9.5px] leading-relaxed text-slate-500 pt-1 border-t border-slate-200/50">
                          {isGegCompliant 
                            ? 'Höchstwert nach GModG/GEG Anlage 7 (Änderung bestehender Gebäude) eingehalten. Für Neubauten gilt der Nachweis über das Referenzgebäude (§§ 15, 16).'
                            : 'Der U-Wert überschreitet den Höchstwert nach GModG/GEG Anlage 7: Dämmstoffdicke erhöhen oder Dämmstoff mit kleinerem λ wählen.'
                          }
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* DIN 4108-2 Surface factor f_RSi mold-prevention card */}
                {(() => {
                  // DIN 4108-2: f_Rsi mit R_si = 0,25 m²K/W (erhöhter Übergangswiderstand für Schimmelnachweis)
                  const f_RSi = 1 - 0.25 * glaserData.U;
                  const t_si = Te + f_RSi * (Ti - Te);
                  const is_f_RSi_compliant = f_RSi >= 0.70;
                  return (
                    <div className={`p-4 rounded-xl border ${is_f_RSi_compliant ? 'bg-emerald-50/40 border-emerald-150 text-emerald-950' : 'bg-red-50/40 border-red-150 text-red-950'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Schimmelpilzkriterium</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${is_f_RSi_compliant ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {is_f_RSi_compliant ? 'Schimmelsicher' : 'Vorsicht! Schimmelgefahr'}
                        </span>
                      </div>
                      <div className="text-xs space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-slate-600">Oberflächentemperatur (θ_si mit R_si = 0,25):</span>
                          <span className="font-mono text-slate-700 font-bold">{formatDeZahl(t_si, 1)} °C</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-slate-600">Ist-Wert f_RSi:</span>
                          <span className="font-mono font-black text-slate-900 text-[13px]">{formatDeZahl(f_RSi, 3)}</span>
                        </div>
                        <div className="flex justify-between items-baseline pb-1">
                          <span className="font-semibold text-slate-600">Norm-Sollwert (DIN 4108-2):</span>
                          <span className="font-mono text-slate-500">≥ 0,700</span>
                        </div>
                        <div className="text-[9.5px] leading-relaxed text-slate-500 pt-1 border-t border-slate-200/50">
                          {is_f_RSi_compliant 
                            ? 'Die innere Oberflächentemperatur ist hoch genug. f_RSi ≥ 0,70 verhindert hohe lokale Oberflächenfeuchte.'
                            : 'Gefahr von Schimmelpilzbildung: Wärmeschutz verbessern (bevorzugt außenseitig) und Wärmebrücken prüfen.'
                          }
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Live-Rechenweg (AP 3.7): U-Wert mit dem aktuellen Schichtaufbau */}
              <FormulaDerivationBox
                live
                title="Ihr Rechenweg: U-Wert Ihres Bauteils"
                zielGleichung="U = \frac{1}{R_{si} + \sum d_i/\lambda_i + R_{se}}"
                schritte={[
                  {
                    titel: 'Wärmeübergangswiderstände',
                    erklaerung: 'Nach DIN EN ISO 6946, Tab. 7 für die gewählte Bauteilart (Wärmestromrichtung):',
                    formel: `R_{si} = ${formatDeTeX(Rsi, 2)}\\,\\text{m}^2\\text{K/W},\\quad R_{se} = ${formatDeTeX(Rse, 2)}\\,\\text{m}^2\\text{K/W}`
                  },
                  {
                    titel: 'Wärmedurchlasswiderstände der Schichten',
                    erklaerung: 'Jede Schicht trägt mit Dicke d (in m) geteilt durch die Wärmeleitfähigkeit λ bei:',
                    formel: `\\sum \\frac{d_i}{\\lambda_i} = ${resolvedLayers.map(l => `\\frac{${formatDeTeXWert(l.d)}}{${formatDeTeXWert(l.lambda)}}`).join(' + ') || '0'} = ${formatDeTeX(glaserData.R_T - Rsi - Rse, 3)}\\,\\text{m}^2\\text{K/W}`
                  },
                  {
                    titel: 'Wärmedurchgangswiderstand',
                    erklaerung: 'Summe aus Übergangs- und Schichtwiderständen:',
                    formel: `R_T = ${formatDeTeX(Rsi, 2)} + ${formatDeTeX(glaserData.R_T - Rsi - Rse, 3)} + ${formatDeTeX(Rse, 2)} = ${formatDeTeX(glaserData.R_T, 3)}\\,\\text{m}^2\\text{K/W}`
                  },
                  {
                    titel: 'U-Wert und Anforderung',
                    erklaerung: glaserData.U <= gegLimit
                      ? `Der Höchstwert ${formatDeZahl(gegLimit, 2)} W/(m²K) nach GModG/GEG Anlage 7 ist eingehalten.`
                      : `Der Höchstwert ${formatDeZahl(gegLimit, 2)} W/(m²K) nach GModG/GEG Anlage 7 ist überschritten.`,
                    formel: `U = \\frac{1}{${formatDeTeX(glaserData.R_T, 3)}} = ${formatDeTeX(glaserData.U, 3)}\\,\\text{W/(m}^2\\text{K)} ${glaserData.U <= gegLimit ? '\\le' : '>'} ${formatDeTeX(gegLimit, 2)}`
                  },
                  {
                    titel: 'Temperaturfaktor (Schimmelnachweis)',
                    erklaerung: 'Mit dem erhöhten Übergangswiderstand R*_si = 0,25 m²K/W nach DIN 4108-2; gefordert ist f_Rsi ≥ 0,70:',
                    formel: `f_{Rsi} = 1 - 0{,}25 \\cdot ${formatDeTeX(glaserData.U, 3)} = ${formatDeTeX(1 - 0.25 * glaserData.U, 3)}`
                  }
                ]}
                ergebnisHinweis="Wärmebrücken, Befestigungsmittel und Luftschichten sind hier nicht berücksichtigt (Korrekturen ΔU nach DIN EN ISO 6946, Anhang F)."
                normQuelle="DIN EN ISO 6946:2018-03; DIN 4108-2:2026-05; GModG/GEG Anlage 7"
              />

            </div>

            {/* Layer values Table */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-3">
                U-Wert &amp; Schichten-Auditdatenbank
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-medium">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 px-1 font-bold">Nr</th>
                      <th className="py-2 px-1 font-bold">Materialname</th>
                      <th className="py-2 px-1 font-bold text-right">d (m)</th>
                      <th className="py-2 px-1 font-bold text-right">λ (W/mK)</th>
                      <th className="py-2 px-1 font-bold text-right">μ (-)</th>
                      <th className="py-2 px-1 font-bold text-right">s_d (m)</th>
                      <th className="py-2 px-1 font-bold text-right">Temp. Grenzfläche</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resolvedLayers.map((layer, idx) => {
                      const temp_at_interface = glaserData.T_profile[idx + 1];
                      return (
                        <tr key={layer.id} className="border-b border-slate-100 text-slate-700 hover:bg-slate-50/50">
                          <td className="py-2 px-1 font-mono text-slate-400 font-bold">{idx + 1}</td>
                          <td className="py-2 px-1 font-bold text-slate-800">{layer.name}</td>
                          <td className="py-2 px-1 text-right font-mono">{formatDeZahl(layer.d, 3)}</td>
                          <td className="py-2 px-1 text-right font-mono">{formatDeZahl(layer.lambda, 3)}</td>
                          <td className="py-2 px-1 text-right font-mono">{formatDeWert(layer.mu)}</td>
                          <td className="py-2 px-1 text-right font-mono font-bold">{formatDeZahl(layer.d * layer.mu, 3)}</td>
                          <td className="py-2 px-1 text-right font-mono text-shiraz font-bold">{formatDeZahl(temp_at_interface, 1)} °C</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT 2: SUMMER HEAT PROTECTION */}
      {activeTab === 'summer_heat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Heat calculations parameters */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
                <Sun size={14} className="text-amber-500" /> Thermische Speichermasse d. Werkstoffe
              </h3>
              
              <div className="p-4 bg-amber-50/45 border border-amber-100 rounded-xl leading-relaxed text-xs text-slate-700 font-normal">
                Der sommerliche Wärmeschutz schützt Räume vor Überhitzung. Schwere Baustoffe mit hoher Dichte (<FormulaText text="\rho" />) und hohem Speicherwert (<FormulaText text="c" />) wirken wie eine thermische Batterie: Sie schlucken tagsüber Hitze und geben sie erst nachts verzögert (Phasenverschiebung) ab.
              </div>

              {/* Specific heat values info box */}
              <div className="mt-4 space-y-2">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Wärmespeichereigenschaften in dieser Berechnung:</label>
                <div className="divide-y divide-slate-100 text-[11px] text-slate-600">
                  <div className="py-1.5 flex justify-between">
                    <span className="font-semibold text-slate-800">Holzfaserplatte (Bio)</span>
                    <span className="font-mono font-bold text-slate-700">c = 2100 J/(kg·K)</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-semibold text-slate-800">Fichtenholz / Massivholz</span>
                    <span className="font-mono font-bold text-slate-700">c = 1600 J/(kg·K)</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-semibold text-slate-800">Normalbeton (Stahlbeton)</span>
                    <span className="font-mono font-bold text-slate-700">c = 1000 J/(kg·K)</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-semibold text-slate-800">Ziegelmauerwerk (HLZ / MZ)</span>
                    <span className="font-mono font-bold text-slate-700">c = 1000 J/(kg·K)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Bauteil-Audit trigger feedback */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
                U-Wert &amp; Thermische Bilanz
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Wärmedurchgang (U-Wert)</span>
                  <span className="text-sm font-black text-slate-800 font-mono">{formatDeZahl(glaserData.U, 3)} W/(m²K)</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Gesamte Wanddicke</span>
                  <span className="text-sm font-black text-slate-800 font-mono">
                    {formatDeZahl(resolvedLayers.reduce((acc, l) => acc + l.d, 0), 3)} m
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Analysis - Sommerlicher Thermoschutz */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-shiraz" />
                Auswertungsbericht: Raumklimatische Phasenverzögerung
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                
                {/* 1. Amplitudendämpfung TAV */}
                <div className="p-4 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider">Amplitudenverhältnis TAV</span>
                  <span className="text-3xl font-black text-shiraz font-mono block mt-2">
                    {formatDeZahl(summerHeatAnalysis.TAV, 3)}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">Dämpfungsfaktor der Hitzewelle</span>
                </div>

                {/* 2. Phasenverschiebung in Stunden */}
                <div className="p-4 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider">Phasenverschiebung η</span>
                  <span className="text-3xl font-black text-amber-600 font-mono block mt-2">
                    {formatDeZahl(summerHeatAnalysis.phaseShift, 1)} <span className="text-xs">h</span>
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">Verzögerung der Hitze ins Innere</span>
                </div>

                {/* 3. Gesamt-Wärmespeicherung kJ/m²K */}
                <div className="p-4 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider">Wärmekapazität C_tot</span>
                  <span className="text-3xl font-black text-rose-600 font-mono block mt-2">
                    {formatDeZahl(summerHeatAnalysis.totalHeatCapacity, 0)} <span className="text-xs">kJ/m²K</span>
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">Spezifische Bauteilspeicherung</span>
                </div>

              </div>

              {/* Dynamic Assessment Check */}
              <div className={`p-5 rounded-xl border flex items-start gap-4 ${
                summerHeatAnalysis.phaseShift >= 10.0 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : summerHeatAnalysis.phaseShift >= 6.0 
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                    : 'bg-off-white border-shiraz-200 text-rose-800'
              }`}>
                {summerHeatAnalysis.phaseShift >= 10.0 ? (
                  <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-0.5" size={24} />
                ) : (
                  <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={24} />
                )}
                <div>
                  <h4 className="font-extrabold text-sm uppercase tracking-wide">
                    {summerHeatAnalysis.phaseShift >= 10.0 
                      ? 'Hervorragender sommerlicher Hitzeschutz (η ≥ 10h)' 
                      : summerHeatAnalysis.phaseShift >= 6.0 
                        ? 'Ausreichender sommerlicher Hitzeschutz (6h ≤ η < 10h)' 
                        : 'Mangelhafter sommerlicher Hitzeschutz (η < 6h)'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-90 font-medium">
                    {summerHeatAnalysis.phaseShift >= 10.0 ? (
                      `Eine große Phasenverschiebung von ${formatDeZahl(summerHeatAnalysis.phaseShift, 1)} Stunden stellt sicher, dass die Mittagshitze erst mitten in der kühlen Nacht an den Innenraum abgegeben wird. Das Schlafzimmer bleibt angenehm kühl, Lüftungskonzepte greifen sehr gut!`
                    ) : summerHeatAnalysis.phaseShift >= 6.0 ? (
                      `Eine Phasenverzögerung von ${formatDeZahl(summerHeatAnalysis.phaseShift, 1)} Stunden ist befriedigend. Erhöhen Sie eventuell die Schichtdicke dickerer Wandbaustoffe oder nutzen Sie Einblas-Holzfaserdämmstoffe für zusätzliche kapillare Trägheit.`
                    ) : (
                      `Vorsicht: Mit einer thermischen Verzögerung von nur ${formatDeZahl(summerHeatAnalysis.phaseShift, 1)} Stunden heizt sich der Dach- oder Wohnraum rasch auf (typisch bei ungedämmten Leichtbauten). Einbringen schwerer Bauteilmassen oder Dämmungen mit hoher Rohdichte empfohlen!`
                    )}
                  </p>
                </div>
              </div>

              {/* Dynamic 24h temperature wave progression simulation chart */}
              <div className="mt-6 pt-5 border-t border-slate-150">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span>Temperaturverlauf-Schnitt (24-Stunden-Welle)</span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                    η = {formatDeZahl(summerHeatAnalysis.phaseShift, 1)} Stunden | TAV = {formatDeZahl(summerHeatAnalysis.TAV, 3)}
                  </span>
                </h4>
                <div className="h-[250px] w-full relative">
                  <Line 
                    data={dailyTemperatureChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { 
                          grid: { display: false }, 
                          ticks: { font: { size: 9, weight: 'bold' }, color: '#64748b' } 
                        },
                        y: { 
                          title: { display: true, text: 'Temperatur (°C)', font: { size: 10, weight: 'bold' }, color: '#475569' }, 
                          ticks: { font: { size: 9, weight: 'bold' }, color: '#64748b' } 
                        }
                      },
                      plugins: {
                        legend: { 
                          position: 'bottom', 
                          labels: { boxWidth: 12, font: { size: 10, weight: 'bold' }, color: '#334155' } 
                        }
                      }
                    }} 
                  />
                </div>
                <div className="text-[10px] text-slate-500 italic mt-2 text-center leading-relaxed">
                  Die Grafik simuliert eine typische sommerliche Außenluft-Temperaturwelle (Sinus, Spitze um 14:00 Uhr) und zeigt wie die Innenoberflächentemperatur dank der thermalen Dämmträgheit des Schichtenpakets gedämpft (TAV) und zeitverzögert (η) verhält.
                </div>
              </div>

            </div>

            {/* Specific values list table */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-3">
                Thermodynamisches Detailverzeichnis der Schichten
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-medium text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 px-1 font-bold">Nr</th>
                      <th className="py-2 px-1 font-bold">Material</th>
                      <th className="py-2 px-1 font-bold text-right">Rho (kg/m³)</th>
                      <th className="py-2 px-1 font-bold text-right">c (J/kgK)</th>
                      <th className="py-2 px-1 font-bold text-right">Masse (kg/m²)</th>
                      <th className="py-2 px-1 font-bold text-right">C (kJ/m²K)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resolvedLayers.map((layer, idx) => {
                      const layer_mass = layer.d * layer.density;
                      const layer_capacity = (layer_mass * layer.c) / 1000;
                      return (
                        <tr key={layer.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="py-2 px-1 font-mono text-slate-400 font-bold">{idx + 1}</td>
                          <td className="py-2 px-1 font-bold text-slate-900">{layer.name}</td>
                          <td className="py-2 px-1 text-right font-mono">{formatDeWert(layer.density)}</td>
                          <td className="py-2 px-1 text-right font-mono">{formatDeWert(layer.c)}</td>
                          <td className="py-2 px-1 text-right font-mono text-slate-600 font-bold">{formatDeZahl(layer_mass, 1)}</td>
                          <td className="py-2 px-1 text-right font-mono text-shiraz font-bold">{formatDeZahl(layer_capacity, 0)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT 3: INTERACTIVE ROOM ACOUSTICS SABINE */}
      {activeTab === 'acoustics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sabine Controls left spanning 5 columns */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Room Dimensions config card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
                <Volume2 size={14} className="text-shiraz animate-pulse" /> Raum-Dimensionen (DIN 18041)
              </h3>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center mb-4 flex justify-between font-mono font-bold text-xs">
                <span>Volumen V = {formatDeZahl(roomW*roomL*roomH, 0)} m³</span>
                <span>Mantelfläche S = {formatDeZahl(acousticsResults.totalSurfaceArea, 0)} m²</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span>Länge des Raumes (L)</span>
                    <span className="font-mono">{formatDeZahl(roomL, 1)} m</span>
                  </div>
                  <input 
                    type="range" min="3.0" max="15.0" step="0.5" value={roomL} 
                    onChange={(e) => setRoomL(Number(e.target.value))} 
                    className="w-full accent-shiraz h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span>Breite des Raumes (W)</span>
                    <span className="font-mono">{formatDeZahl(roomW, 1)} m</span>
                  </div>
                  <input 
                    type="range" min="3.0" max="12.0" step="0.5" value={roomW} 
                    onChange={(e) => setRoomW(Number(e.target.value))} 
                    className="w-full accent-shiraz h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span>Lichte Höhe des Raumes (H)</span>
                    <span className="font-mono">{formatDeZahl(roomH, 1)} m</span>
                  </div>
                  <input 
                    type="range" min="2.2" max="5.0" step="0.1" value={roomH} 
                    onChange={(e) => setRoomH(Number(e.target.value))} 
                    className="w-full accent-shiraz h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Target context selection */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Raumtyp &amp; Sollvorgaben nach DIN:</label>
                  <select aria-label="Raumtyp &amp; Sollvorgaben nach DIN" 
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as any)}
                    className="w-full text-xs p-2 border border-slate-200 bg-white rounded-lg font-bold text-slate-800"
                  >
                    <option value="classroom">Schulraum / Unterricht (A3: T_soll = 0,32 · lg V − 0,17)</option>
                    <option value="office">Mehrpersonenbüro (Gruppe B: Orientierungswert 0,75 s)</option>
                    <option value="hall">Hörsaal / Aula (A2: T_soll = 0,37 · lg V − 0,14)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Surface Material assignments */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-3">
                Zuweisung d. Schallabsorber-Oberflächen
              </h3>

              <div className="space-y-3">
                {/* 1. Ceiling */}
                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-4 text-[11px] font-bold text-slate-600">Decke:</span>
                  <div className="col-span-8">
                    <select aria-label="Decke"
                      value={selectedCeiling}
                      onChange={(e) => setSelectedCeiling(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-lg font-medium"
                    >
                      {acousticMaterials.map(m => (
                        <option key={m.id} value={m.id}>{m.name} [α={formatDeWert(m.alpha)}]</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Floor */}
                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-4 text-[11px] font-bold text-slate-600">Boden:</span>
                  <div className="col-span-8">
                    <select aria-label="Boden"
                      value={selectedFloor}
                      onChange={(e) => setSelectedFloor(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-lg font-medium"
                    >
                      {acousticMaterials.map(m => (
                        <option key={m.id} value={m.id}>{m.name} [α={formatDeWert(m.alpha)}]</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Front Wall */}
                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-4 text-[11px] font-bold text-slate-600">Stirnwand:</span>
                  <div className="col-span-8">
                    <select aria-label="Stirnwand"
                      value={selectedFrontWall}
                      onChange={(e) => setSelectedFrontWall(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-lg font-medium"
                    >
                      {acousticMaterials.map(m => (
                        <option key={m.id} value={m.id}>{m.name} [α={formatDeWert(m.alpha)}]</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Back Wall */}
                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-4 text-[11px] font-bold text-slate-600">Rückwand:</span>
                  <div className="col-span-8">
                    <select aria-label="Rückwand"
                      value={selectedBackWall}
                      onChange={(e) => setSelectedBackWall(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-lg font-medium"
                    >
                      {acousticMaterials.map(m => (
                        <option key={m.id} value={m.id}>{m.name} [α={formatDeWert(m.alpha)}]</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Left Wall */}
                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-4 text-[11px] font-bold text-slate-600">Linke Wand:</span>
                  <div className="col-span-8">
                    <select aria-label="Linke Wand"
                      value={selectedLeftWall}
                      onChange={(e) => setSelectedLeftWall(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-lg font-medium"
                    >
                      {acousticMaterials.map(m => (
                        <option key={m.id} value={m.id}>{m.name} [α={formatDeWert(m.alpha)}]</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 6. Right Wall */}
                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-4 text-[11px] font-bold text-slate-600">Rechte Wand:</span>
                  <div className="col-span-8">
                    <select aria-label="Rechte Wand"
                      value={selectedRightWall}
                      onChange={(e) => setSelectedRightWall(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-lg font-medium"
                    >
                      {acousticMaterials.map(m => (
                        <option key={m.id} value={m.id}>{m.name} [α={formatDeWert(m.alpha)}]</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sabine Results and evaluation right spanning 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Sabine Hallzeit Meter panel */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Volume2 size={16} className="text-shiraz" /> Raumakustische Verhaltenskontrolle
              </h3>

              {/* Graphical gauge chart display */}
              <div className="flex flex-col items-center py-6 border border-slate-100 bg-slate-50/50 rounded-2xl mb-6 relative">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Berechnete Hallzeit T d. Raumes</span>
                
                <span className="text-5xl font-black text-shiraz font-mono mt-2 mb-1 animate-pulse">
                  {formatDeZahl(acousticsResults.reverberationTime, 2)} <span className="text-lg">Sekunden</span>
                </span>
                
                <span className="text-xs bg-slate-900 border border-slate-800 text-slate-200 font-bold font-mono px-3 py-1 rounded-full flex items-center gap-1">
                  Typ: {acousticsResults.roomLabel} | DIN-Empfehlung: {formatDeZahl(acousticsResults.T_target, 2)} s ({formatDeZahl(acousticsResults.minTarget, 2)} s - {formatDeZahl(acousticsResults.maxTarget, 2)} s)
                </span>
              </div>

              {/* Dyn message assessment bar */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                acousticsResults.reverberationTime > acousticsResults.maxTarget 
                  ? 'bg-off-white border-shiraz-200 text-rose-800' 
                  : acousticsResults.reverberationTime < acousticsResults.minTarget 
                    ? 'bg-amber-50 border-amber-200 text-amber-800' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                {acousticsResults.reverberationTime > acousticsResults.maxTarget || acousticsResults.reverberationTime < acousticsResults.minTarget ? (
                  <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
                ) : (
                  <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                )}
                <div>
                  <h4 className="font-extrabold text-sm uppercase">
                    {acousticsResults.reverberationTime > acousticsResults.maxTarget 
                      ? 'UNTERRICHTSFLUSS BEHINDERT - ZU HALLIG' 
                      : acousticsResults.reverberationTime < acousticsResults.minTarget 
                        ? 'TOTER RAUM - ZUKLEINE HALLZEIT' 
                        : 'Perfekte akustische Raumstimmung!'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-95">
                    {acousticsResults.stateDesc} 
                    {acousticsResults.reverberationTime > acousticsResults.maxTarget && ' TIPP: Ändern Sie das Deckenmaterial auf "Mineralfaser-Lochdecke" [α=0.70] oder bringe einen Akustik-Schaumstoffabsorber an.'}
                    {acousticsResults.reverberationTime < acousticsResults.minTarget && ' TIPP: Entfernen Sie einige Hochleistungs-Absorberdecken und tauschen sie diese gegen Sichtbeton oder Kalk-Gipskartonglätte aus.'}
                  </p>
                </div>
              </div>

              {/* Dynamic Octave-Band Reverberation DIN 18041 Corridor Chart */}
              <div className="mt-6 pt-5 border-t border-slate-150">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span>Soll-Korridor der Nachhallzeit T(f) (DIN 18041)</span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                    Frequenzbereich: 125 Hz - 4000 Hz
                  </span>
                </h4>
                <div className="h-[250px] w-full relative">
                  <Line 
                    data={acousticsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { 
                          grid: { display: false }, 
                          ticks: { font: { size: 9, weight: 'bold' }, color: '#64748b' } 
                        },
                        y: { 
                          title: { display: true, text: 'Nachhallzeit T(f) [s]', font: { size: 10, weight: 'bold' }, color: '#475569' }, 
                          ticks: { font: { size: 9, weight: 'bold' }, color: '#64748b' } 
                        }
                      },
                      plugins: {
                        legend: { 
                          position: 'bottom', 
                          labels: { boxWidth: 10, font: { size: 9, weight: 'bold' }, color: '#334155' } 
                        }
                      }
                    }} 
                  />
                </div>
                <div className="text-[10px] text-slate-500 italic mt-2 text-center leading-relaxed">
                  Die Grafik stellt den berechneten oktavweisen Verlauf T(f) relativ zur nach DIN 18041 geforderten Toleranzgrenze dar. Für barrierefreie Nutzung darf T(f) die orangefarbenen Korridorlinien nicht durchbrechen.
                </div>
              </div>

            </div>

            {/* Sabine calculation table list */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-3">
                Äquivalente Absorptionsbilanz der Hüllflächen
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-medium text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 px-1 font-bold">Flächenwand</th>
                      <th className="py-2 px-1 font-bold text-right">Fläche S (m²)</th>
                      <th className="py-2 px-1 font-bold text-right">Absorptionsgrad α (-)</th>
                      <th className="py-2 px-1 font-bold text-right">Komp. Absorption A (m²)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(acousticsResults.areas).map((item, index) => {
                      const comp_absorption = item.area * item.alpha;
                      return (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="py-2 px-1 font-semibold text-slate-800">{item.label}</td>
                          <td className="py-2 px-1 text-right font-mono">{formatDeZahl(item.area, 1)}</td>
                          <td className="py-2 px-1 text-right font-mono text-slate-500">{formatDeZahl(item.alpha, 2)}</td>
                          <td className="py-2 px-1 text-right font-mono text-shiraz font-bold">{formatDeZahl(comp_absorption, 2)} m²</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-slate-50 font-bold border-t border-slate-300 font-semibold text-slate-900">
                      <td className="py-2 px-1">Summe (Gesamt)</td>
                      <td className="py-2 px-1 text-right font-mono">{formatDeZahl(acousticsResults.totalSurfaceArea, 1)}</td>
                      <td className="py-2 px-1 text-right text-slate-400 font-mono">-</td>
                      <td className="py-2 px-1 text-right font-mono text-shiraz font-black">
                        {formatDeZahl(acousticsResults.equivalentAbsorptionArea, 2)} m²
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: U-Wert und Temperaturfaktor einer gedämmten Kalksandsteinwand"
        zielGleichung="U = \frac{1}{R_{si} + \sum d_i/\lambda_i + R_{se}}, \quad f_{Rsi} = 1 - R_{si}^{*} \cdot U"
        schritte={[
          { titel: 'Schichten', erklaerung: 'Innenputz 1,5 cm (λ = 0,70), KS 17,5 cm (λ = 0,99), Mineralwolle 14 cm (λ = 0,035); Putzträger außen vernachlässigt:', formel: 'R_T = 0{,}13 + \\frac{0{,}015}{0{,}70} + \\frac{0{,}175}{0{,}99} + \\frac{0{,}14}{0{,}035} + 0{,}04 = 4{,}37\\,\\text{m}^2\\text{K/W}' },
          { titel: 'U-Wert', erklaerung: 'Vergleich mit dem Höchstwert nach Anlage 7 (Außenwand 0,24):', formel: 'U = \\frac{1}{4{,}37} = 0{,}229\\,\\text{W/(m}^2\\text{K)} \\le 0{,}24' },
          { titel: 'Temperaturfaktor', erklaerung: 'Schimmelnachweis nach DIN 4108-2 mit erhöhtem Übergangswiderstand R*_si = 0,25 m²K/W:', formel: 'f_{Rsi} = 1 - 0{,}25 \\cdot 0{,}229 = 0{,}94 \\ge 0{,}70' }
        ]}
        ergebnisHinweis="In der ungestörten Fläche ist ein gut gedämmtes Bauteil unkritisch; maßgebend für Schimmel sind Wärmebrücken (Ecken, Laibungen, Sockel)."
        normQuelle="DIN EN ISO 6946:2018-03; GModG Anlage 7; DIN 4108-2"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Nachhallzeit eines Klassenraums nach Sabine"
        zielGleichung="T = 0{,}163 \cdot \frac{V}{A}"
        schritte={[
          { titel: 'Sollwert', erklaerung: 'Klassenraum 9 m × 7 m × 3 m, Nutzungsart A3:', formel: 'V = 189\\,\\text{m}^3, \\quad T_{soll} = 0{,}32 \\cdot \\lg 189 - 0{,}17 = 0{,}56\\,\\text{s}' },
          { titel: 'Ohne Maßnahmen', erklaerung: 'Alle 222 m² Oberfläche schallhart (α ≈ 0,05):', formel: 'A = 222 \\cdot 0{,}05 = 11{,}1\\,\\text{m}^2 \\Rightarrow T = \\frac{0{,}163 \\cdot 189}{11{,}1} = 2{,}78\\,\\text{s}' },
          { titel: 'Akustikdecke', erklaerung: 'Deckenfläche 63 m² mit α = 0,90 statt 0,05:', formel: 'A = 11{,}1 + 63 \\cdot 0{,}85 = 64{,}7\\,\\text{m}^2 \\Rightarrow T = \\frac{30{,}8}{64{,}7} = 0{,}48\\,\\text{s}' },
          { titel: 'Bewertung', erklaerung: 'Toleranzbereich 0,8 bis 1,2 · T_soll:', formel: '0{,}45\\,\\text{s} \\le 0{,}48\\,\\text{s} \\le 0{,}67\\,\\text{s}' }
        ]}
        ergebnisHinweis="Eine vollflächige Akustikdecke senkt die Nachhallzeit auf rund ein Sechstel. Personen und Möblierung bringen zusätzliche Absorption; für tiefe Frequenzen sind oft zusätzliche Absorber an der Rückwand nötig."
        normQuelle="DIN 18041:2016-03 (Gruppe A, Nutzungsart A3)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bauphysik" />

      {/* 5. ACADEMY DOCUMENTATION FOOTER */}
      <CalculatorDisclaimerBanner className="my-2" />
      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 6 Bauphysik: Diffusionsleitkoeffizient korrigiert, Magnus über Eis, f_Rsi mit R_si = 0,25, T_soll nach DIN 18041 volumenabhängig, GEG → GModG; fachliche Freigabe durch den Autor ausstehend)"
wikipedia={[
          { title: 'Bauphysik', url: 'https://de.wikipedia.org/wiki/Bauphysik' },
          { title: 'Glaser-Verfahren', url: 'https://de.wikipedia.org/wiki/Glaser-Verfahren' },
          { title: 'Nachhallzeit', url: 'https://de.wikipedia.org/wiki/Nachhallzeit' }
        ]}
        regelwerke={[
          { title: 'DIN 4108-2:2026-05 (Wärmeschutz – Anforderungen, Berechnungsverfahren und Hinweise für Planung und Ausführung; ersetzt DIN 4108-2:2013-02 „Mindestanforderungen an den Wärmeschutz“)' },
          { title: 'DIN 4108-3:2024-03 (Klimabedingter Feuchteschutz – Periodenbilanzverfahren; ersetzt 2018-10)' },
          { title: 'DIN 18041:2016-03 (Hörsamkeit in Räumen – Anforderungen, Empfehlungen und Hinweise für die Planung)' },
          { title: 'DIN EN ISO 6946:2018-03 (Wärmedurchlasswiderstand und Wärmedurchgangskoeffizient)' },
          { title: 'Gebäudemodernisierungsgesetz (GModG, seit 29.07.2026; vormals GEG) – Anlage 7', url: 'https://www.gesetze-im-internet.de/geg/' }
        ]}
        literatur={[
          'Willems, W. (Hrsg.): Lehrbuch der Bauphysik. 8. Aufl., Wiesbaden: Springer Vieweg 2017',
          'Bauphysik-Kalender. Berlin: Ernst & Sohn (jährlich)'
        ]}
        weblinks={[
          { title: 'Ubakus.de – Interaktiver U-Wert- & Glaser-Tauwassernachweis', url: 'https://www.ubakus.de/' },
          { title: 'LBNL THERM – 2D-Wärmebrücken-FE-Simulation', url: 'https://windows.lbl.gov/software/therm' },
          { title: 'ÖKOBAUDAT Plattform – BMWSB EPD-Datenbank', url: 'https://www.oekobaudat.de/' }
        ]}
        formeln={[
          {
            formel: 'U = 1 / R_T = 1 / (R_{si} + \\sum (d_i / \\lambda_i) + R_{se})',
            erklaerung: 'Wärmedurchgangskoeffizient (U-Wert) in W/(m²K). Berechnet den Transmissionswärmeverlust durch mehrschichtige Bauteile.',
            quelle: 'DIN EN ISO 6946'
          },
          {
            formel: 'm_c = \\delta_a \\cdot \\Delta t \\cdot \\left( \\frac{p_i - p_{sat}(T_C)}{s_{d,1}} - \\frac{p_{sat}(T_C) - p_e}{s_{d,2}} \\right)',
            erklaerung: 'Tauwassermasse m_c [g/m²] der Tauperiode an der Tauwasserebene C (Periodenbilanzverfahren); δ_a = 7,2 · 10⁻⁷ kg/(m·h·Pa), Δt = Dauer der Tauperiode in h.',
            quelle: 'DIN 4108-3:2024-03'
          },
          {
            formel: 'T = 0{,}163 \\cdot \\frac{V}{A} \\quad \\text{mit} \\quad A = \\sum S_i \\cdot \\alpha_i',
            erklaerung: 'Sabinesche Nachhallzeit-Gleichung zur quantitativen Ermittlung der akustischen Raumantwort T in Sekunden.',
            quelle: 'Sabine; DIN 18041:2016-03'
          }
        ]}
      />
    </div>
  );
}
