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
  Sparkles,
  Award
} from 'lucide-react';
import { GEG_U_MAX, temperaturverlauf, uebergang, uWert } from '@/src/calc/waermeschutz';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';
import { NachErstemBild } from '@/src/components/ui/NachErstemBild';
import inhalt from '@/content/bauphysik/Bauphysik.json';
import { MdText } from '@/src/components/inhalt/MdText';

// Detailed material library with density, lambda, moisture resistance factor (mu) and specific heat capacity (c in J/kgK)
const materialLibrary = inhalt.daten.materialLibrary;

// Room acoustics materials library with scalar and frequency octave band (125, 250, 500, 1000, 2000, 4000 Hz) absorption coefficients
const acousticMaterials = inhalt.daten.acousticMaterials;

export default function Bauphysik() {
  // Main tab controller: 'thermal_hygric' | 'summer_heat' | 'acoustics'
  const [activeTab, setActiveTab] = useState<'thermal_hygric' | 'summer_heat' | 'acoustics'>('thermal_hygric');

  // Bauteil-Auswahl nach GEG (Außenwand, Steildach, Flachdach, Kellerdecke)
  const [buildingPart, setBuildingPart] = useState<'wall' | 'pitched_roof' | 'flat_roof' | 'basement'>('wall');

  // Wärmeschutz-Klima (Winter-Randbedingungen nach DIN 4108-3)
  const [Ti, setTi] = useState(20); // Innen-Temperatur
  const [Te, setTe] = useState(-5); // Außen-Temperatur (-5 °C nach DIN 4108-3)
  // Feuchteschutz (Glaser-Verfahren) liegt ausschließlich im Modul Feuchteschutz (AP 3.9)

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
          name: l.customName || inhalt.werte.spezialbaustoffBenutzerdefiniert,
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

  // U-Wert und Temperaturverlauf (Rechenkern src/calc/waermeschutz.ts); der Tauwassernachweis nach Glaser
  // ist bewusst nur im Modul Feuchteschutz implementiert (AP 3.9 „Eine Quelle je Thema“).
  const waerme = useMemo(() => {
    const uErgebnis = uWert(resolvedLayers, Rsi, Rse);
    const T_profile = uErgebnis.gueltig ? temperaturverlauf(resolvedLayers, Rsi, Rse, Ti, Te) : resolvedLayers.map(() => NaN).concat(NaN);
    return { U: uErgebnis.U, R_T: uErgebnis.R_T, hinweise: uErgebnis.hinweise, T_profile };
  }, [Ti, Te, resolvedLayers, Rsi, Rse]);

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
          label: inhalt.werte.außenluftTemperaturCT,
          data: t_outside,
          borderColor: '#A3113E', // rose-500
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 1,
          tension: 0.45,
          fill: false,
        },
        {
          label: inhalt.werte.innenwandOberflächenTemperaturC,
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
    let roomLabel = inhalt.werte.schulUnterrichtsraumNutzungsartA3;
    let minTarget = 0.8 * T_target;
    let maxTarget = 1.2 * T_target;

    if (roomType === 'office') {
      // Gruppe B: keine T_soll-Anforderung, sondern A/V-Empfehlung; Orientierungswert
      T_target = 0.75;
      roomLabel = inhalt.werte.mehrpersonenBüroKantineGruppe;
      minTarget = 0.60;
      maxTarget = 0.85;
    } else if (roomType === 'hall') {
      T_target = Math.max(0.3, 0.37 * lgV - 0.14); // A2 Sprache/Vortrag
      roomLabel = inhalt.werte.hörsaalVortragssaalNutzungsartA2;
      minTarget = 0.8 * T_target;
      maxTarget = 1.2 * T_target;
    }

    const stateDesc = T > maxTarget 
      ? inhalt.werte.zuVielNachhallDie 
      : T < minTarget 
        ? inhalt.werte.zuTrockenAkustischÜberdämpft 
        : inhalt.werte.nachhallzeitImToleranzbereichNach;

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
          label: inhalt.werte.berechneteNachhallzeitTF,
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
          label: inhalt.werte.optimumTSollS,
          data: acousticsFrequencyResolved.targetCenter,
          borderColor: '#475569', // Slate Gray
          borderWidth: 1.5,
          borderDash: [6, 6],
          pointRadius: 0,
          fill: false,
        },
        {
          label: inhalt.werte.din18041ToleranzOberkante,
          data: acousticsFrequencyResolved.targetMax,
          borderColor: '#94A3B8', // Orange
          borderWidth: 1.2,
          borderDash: [3, 3],
          pointRadius: 0,
          fill: false,
        },
        {
          label: inhalt.werte.din18041ToleranzUnterkante,
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

  const updateLayer = (index: number, field: keyof (typeof layers)[number], value: string | number) => {
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
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.bauphysikZentrumDTh} /></h2>
              <p className="text-sm text-text-main/60 mt-0.5"><MdText text={inhalt.texte.simulationsrechnerFürUWert} /></p>
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
            <Thermometer size={14} /><MdText text={inhalt.texte.wärmeschutzUWertF} /></button>
          
          <button aria-pressed={activeTab === 'summer_heat'}
            onClick={() => setActiveTab('summer_heat')}
            className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'summer_heat' 
                ? 'bg-shiraz text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sun size={14} /><MdText text={inhalt.texte.sommerlicherWärmeschutzTrägheit} /></button>

          <button aria-pressed={activeTab === 'acoustics'}
            onClick={() => setActiveTab('acoustics')}
            className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'acoustics' 
                ? 'bg-shiraz text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Volume2 size={14} /><MdText text={inhalt.texte.raumakustikNachhallzeitT} /></button>
        </div>
      </div>

      {/* 2. TAB CONTENT 1: WÄRMESCHUTZ (U-Wert, Temperaturverlauf, f_Rsi) */}
      {activeTab === 'thermal_hygric' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls - Left spanning 5 columns */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Climate Conditions */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
                <Thermometer size={14} className="text-shiraz" /><MdText text={inhalt.texte.klimaRandbedingungenBauteil} /></h3>

              {/* Bauteil-Zuweisung und GEG Auswahl */}
              <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5"><MdText text={inhalt.texte.bauteilTypRegeltR} /></label>
                <select 
                  id="building-part-select"
                  aria-label="Bauteil-Typ"
                  value={buildingPart}
                  onChange={(e) => setBuildingPart(e.target.value as typeof buildingPart)}
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
                        <span><MdText text={inhalt.texte.temperaturTI} /></span>
                        <span className="text-shiraz">{formatDeWert(Ti)} °C</span>
                      </div>
                      <input 
                        type="range" min="15" max="25" step="1" value={Ti} 
                        aria-label={inhalt.werte.innentemperaturTiInC}
                        onChange={(e) => setTi(Number(e.target.value))} 
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
                        <span><MdText text={inhalt.texte.temperaturTE} /></span>
                        <span className="text-blue-600">{formatDeWert(Te)} °C</span>
                      </div>
                      <input 
                        type="range" min="-20" max="5" step="1" value={Te} 
                        aria-label={inhalt.werte.außentemperaturTeInC}
                        onChange={(e) => setTe(Number(e.target.value))} 
                        className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Layer Configuration list */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Layers size={14} className="text-slate-600" /><MdText text={inhalt.texte.bauteilschichtenInnenAußen} /></h3>
                <button 
                  onClick={addLayer}
                  aria-label={inhalt.werte.schichtHinzufügenNeueBauteilschicht}
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
                          aria-label={inhalt.werte.schichtNachObenVerschieben}
                          className="text-slate-400 hover:text-shiraz disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button 
                          onClick={() => moveLayer(index, 'down')} 
                          disabled={index === layers.length - 1} 
                          aria-label={inhalt.werte.schichtNachUntenVerschieben}
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
            {/* unterhalb des Bildausschnitts (mobil) erst nach dem ersten Bild rendern (AP 5.5 Nachtrag) */}
            <NachErstemBild minHoehe="40rem">
            
            {/* Feuchteschutz: eine Quelle (AP 3.9) */}
            <Querverweis ziel="feuchteschutz" titel={inhalt.werte.tauwasserImBauteilGlaser} linkText={inhalt.werte.zumGlaserRechnerFeuchteschutz}>
              <p><MdText text={inhalt.texte.derHierBerechneteTemperaturverlauf} /></p>
            </Querverweis>

            {/* Wärmeschutz-Bewertung */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
                <Award size={14} className="text-shiraz" /><MdText text={inhalt.texte.wärmeschutzBewertungGmodgAnlage} /></h3>

              <EingabeHinweise hinweise={waerme.hinweise} />
              {/* GEG 2024 & DIN 4108-2 f_RSi Mold Risk overall Audit Panel */}
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* GEG 2024 Compliance Check Card */}
                {(() => {
                  const isGegCompliant = waerme.U <= gegLimit;
                  return (
                    <div className={`p-4 rounded-xl border ${isGegCompliant ? 'bg-emerald-50/40 border-emerald-150 text-emerald-950' : 'bg-red-50/40 border-red-150 text-red-950'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block"><MdText text={inhalt.texte.gmodgKonformitätVormalsGeg} /></span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${isGegCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {isGegCompliant ? inhalt.werte.uWertKonform : inhalt.werte.uWertUnzureichend}
                        </span>
                      </div>
                      <div className="text-xs space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-slate-600">Soll-Grenzwert:</span>
                          <span className="font-mono text-slate-500">≤ {formatDeZahl(gegLimit, 2)} W/(m²K)</span>
                        </div>
                        <div className="flex justify-between items-baseline pb-1 select-all">
                          <span className="font-semibold text-slate-800">Ist U-Wert:</span>
                          <span className="font-mono font-black text-[13px] text-slate-900">{formatDeZahl(waerme.U, 3)} W/(m²K)</span>
                        </div>
                        <div className="text-[9.5px] leading-relaxed text-slate-500 pt-1 border-t border-slate-200/50">
                          {isGegCompliant 
                            ? inhalt.werte.höchstwertNachGmodgGeg
                            : inhalt.werte.derUWertÜberschreitet
                          }
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* DIN 4108-2 Surface factor f_RSi mold-prevention card */}
                {(() => {
                  // DIN 4108-2: f_Rsi mit R_si = 0,25 m²K/W (erhöhter Übergangswiderstand für Schimmelnachweis)
                  const f_RSi = 1 - 0.25 * waerme.U;
                  const t_si = Te + f_RSi * (Ti - Te);
                  const is_f_RSi_compliant = f_RSi >= 0.70;
                  return (
                    <div className={`p-4 rounded-xl border ${is_f_RSi_compliant ? 'bg-emerald-50/40 border-emerald-150 text-emerald-950' : 'bg-red-50/40 border-red-150 text-red-950'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Schimmelpilzkriterium</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${is_f_RSi_compliant ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {is_f_RSi_compliant ? 'Schimmelsicher' : inhalt.werte.vorsichtSchimmelgefahr}
                        </span>
                      </div>
                      <div className="text-xs space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-slate-600"><MdText text={inhalt.texte.oberflächentemperaturSiMitR} /></span>
                          <span className="font-mono text-slate-700 font-bold">{formatDeZahl(t_si, 1)} °C</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-slate-600"><MdText text={inhalt.texte.istWertFRsi} /></span>
                          <span className="font-mono font-black text-slate-900 text-[13px]">{formatDeZahl(f_RSi, 3)}</span>
                        </div>
                        <div className="flex justify-between items-baseline pb-1">
                          <span className="font-semibold text-slate-600"><MdText text={inhalt.texte.normSollwertDin4108} /></span>
                          <span className="font-mono text-slate-500">≥ 0,700</span>
                        </div>
                        <div className="text-[9.5px] leading-relaxed text-slate-500 pt-1 border-t border-slate-200/50">
                          {is_f_RSi_compliant 
                            ? inhalt.werte.dieInnereOberflächentemperaturIst
                            : inhalt.werte.gefahrVonSchimmelpilzbildungWärmeschutz
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
                title={inhalt.werte.ihrRechenwegUWert}
                zielGleichung="U = \frac{1}{R_{si} + \sum d_i/\lambda_i + R_{se}}"
                schritte={[
                  {
                    titel: 'Wärmeübergangswiderstände',
                    erklaerung: inhalt.werte.nachDinEnIso,
                    formel: `R_{si} = ${formatDeTeX(Rsi, 2)}\\,\\text{m}^2\\text{K/W},\\quad R_{se} = ${formatDeTeX(Rse, 2)}\\,\\text{m}^2\\text{K/W}`
                  },
                  {
                    titel: inhalt.werte.wärmedurchlasswiderständeDerSchichten,
                    erklaerung: inhalt.werte.jedeSchichtTrägtMit,
                    formel: `\\sum \\frac{d_i}{\\lambda_i} = ${resolvedLayers.map(l => `\\frac{${formatDeTeXWert(l.d)}}{${formatDeTeXWert(l.lambda)}}`).join(' + ') || '0'} = ${formatDeTeX(waerme.R_T - Rsi - Rse, 3)}\\,\\text{m}^2\\text{K/W}`
                  },
                  {
                    titel: 'Wärmedurchgangswiderstand',
                    erklaerung: inhalt.werte.summeAusÜbergangsUnd,
                    formel: `R_T = ${formatDeTeX(Rsi, 2)} + ${formatDeTeX(waerme.R_T - Rsi - Rse, 3)} + ${formatDeTeX(Rse, 2)} = ${formatDeTeX(waerme.R_T, 3)}\\,\\text{m}^2\\text{K/W}`
                  },
                  {
                    titel: inhalt.werte.uWertUndAnforderung,
                    erklaerung: waerme.U <= gegLimit
                      ? `Der Höchstwert ${formatDeZahl(gegLimit, 2)} W/(m²K) nach GModG/GEG Anlage 7 ist eingehalten.`
                      : `Der Höchstwert ${formatDeZahl(gegLimit, 2)} W/(m²K) nach GModG/GEG Anlage 7 ist überschritten.`,
                    formel: `U = \\frac{1}{${formatDeTeX(waerme.R_T, 3)}} = ${formatDeTeX(waerme.U, 3)}\\,\\text{W/(m}^2\\text{K)} ${waerme.U <= gegLimit ? '\\le' : '>'} ${formatDeTeX(gegLimit, 2)}`
                  },
                  {
                    titel: inhalt.werte.temperaturfaktorSchimmelnachweis,
                    erklaerung: inhalt.werte.mitDemErhöhtenÜbergangswiderstand,
                    formel: `f_{Rsi} = 1 - 0{,}25 \\cdot ${formatDeTeX(waerme.U, 3)} = ${formatDeTeX(1 - 0.25 * waerme.U, 3)}`
                  }
                ]}
                ergebnisHinweis={inhalt.werte.wärmebrückenBefestigungsmittelUndLuftsch}
                normQuelle={inhalt.werte.dinEnIso6946}
              />

            </div>

            {/* Layer values Table */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-3"><MdText text={inhalt.texte.uWertSchichtenAuditdatenbank} /></h3>
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
                      <th className="py-2 px-1 font-bold text-right"><MdText text={inhalt.texte.tempGrenzfläche} /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {resolvedLayers.map((layer, idx) => {
                      const temp_at_interface = waerme.T_profile[idx + 1];
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
            </NachErstemBild>
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
                <Sun size={14} className="text-amber-500" /><MdText text={inhalt.texte.thermischeSpeichermasseDWerkstoffe} /></h3>
              
              <div className="p-4 bg-amber-50/45 border border-amber-100 rounded-xl leading-relaxed text-xs text-slate-700 font-normal"><MdText text={inhalt.texte.derSommerlicheWärmeschutzSchützt} /><FormulaText text="\rho" /><MdText text={inhalt.texte.undHohemSpeicherwert} /><FormulaText text="c" /><MdText text={inhalt.texte.wirkenWieEineThermische} /></div>

              {/* Specific heat values info box */}
              <div className="mt-4 space-y-2">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block"><MdText text={inhalt.texte.wärmespeichereigenschaftenInDieserBerech} /></label>
                <div className="divide-y divide-slate-100 text-[11px] text-slate-600">
                  <div className="py-1.5 flex justify-between">
                    <span className="font-semibold text-slate-800"><MdText text={inhalt.texte.holzfaserplatteBio} /></span>
                    <span className="font-mono font-bold text-slate-700"><MdText text={inhalt.texte.c2100JKg} /></span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-semibold text-slate-800"><MdText text={inhalt.texte.fichtenholzMassivholz} /></span>
                    <span className="font-mono font-bold text-slate-700"><MdText text={inhalt.texte.c1600JKg} /></span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-semibold text-slate-800"><MdText text={inhalt.texte.normalbetonStahlbeton} /></span>
                    <span className="font-mono font-bold text-slate-700"><MdText text={inhalt.texte.c1000JKg} /></span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-semibold text-slate-800"><MdText text={inhalt.texte.ziegelmauerwerkHlzMz} /></span>
                    <span className="font-mono font-bold text-slate-700"><MdText text={inhalt.texte.c1000JKg2} /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Bauteil-Audit trigger feedback */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4"><MdText text={inhalt.texte.uWertThermischeBilanz} /></h3>
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600"><MdText text={inhalt.texte.wärmedurchgangUWert} /></span>
                  <span className="text-sm font-black text-slate-800 font-mono">{formatDeZahl(waerme.U, 3)} W/(m²K)</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600"><MdText text={inhalt.texte.gesamteWanddicke} /></span>
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
                <Sparkles size={20} className="text-shiraz" /><MdText text={inhalt.texte.auswertungsberichtRaumklimatischePhasenv} /></h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                
                {/* 1. Amplitudendämpfung TAV */}
                <div className="p-4 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider"><MdText text={inhalt.texte.amplitudenverhältnisTav} /></span>
                  <span className="text-3xl font-black text-shiraz font-mono block mt-2">
                    {formatDeZahl(summerHeatAnalysis.TAV, 3)}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1"><MdText text={inhalt.texte.dämpfungsfaktorDerHitzewelle} /></span>
                </div>

                {/* 2. Phasenverschiebung in Stunden */}
                <div className="p-4 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider"><MdText text={inhalt.texte.phasenverschiebung} /></span>
                  <span className="text-3xl font-black text-amber-600 font-mono block mt-2">
                    {formatDeZahl(summerHeatAnalysis.phaseShift, 1)} <span className="text-xs">h</span>
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1"><MdText text={inhalt.texte.verzögerungDerHitzeIns} /></span>
                </div>

                {/* 3. Gesamt-Wärmespeicherung kJ/m²K */}
                <div className="p-4 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider"><MdText text={inhalt.texte.wärmekapazitätCTot} /></span>
                  <span className="text-3xl font-black text-rose-600 font-mono block mt-2">
                    {formatDeZahl(summerHeatAnalysis.totalHeatCapacity, 0)} <span className="text-xs">kJ/m²K</span>
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1"><MdText text={inhalt.texte.spezifischeBauteilspeicherung} /></span>
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
                      ? inhalt.werte.hervorragenderSommerlicherHitzeschutz10h 
                      : summerHeatAnalysis.phaseShift >= 6.0 
                        ? inhalt.werte.ausreichenderSommerlicherHitzeschutz6h 
                        : inhalt.werte.mangelhafterSommerlicherHitzeschutz6h}
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
                  <span><MdText text={inhalt.texte.temperaturverlaufSchnitt24Stunden} /></span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                    η = {formatDeZahl(summerHeatAnalysis.phaseShift, 1)}<MdText text={inhalt.texte.stundenTav} />{formatDeZahl(summerHeatAnalysis.TAV, 3)}
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
                          title: { display: true, text: inhalt.werte.temperaturC, font: { size: 10, weight: 'bold' }, color: '#475569' }, 
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
                <div className="text-[10px] text-slate-500 italic mt-2 text-center leading-relaxed"><MdText text={inhalt.texte.dieGrafikSimuliertEine} /></div>
              </div>

            </div>

            {/* Specific values list table */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-3"><MdText text={inhalt.texte.thermodynamischesDetailverzeichnisDerSch} /></h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-medium text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 px-1 font-bold">Nr</th>
                      <th className="py-2 px-1 font-bold">Material</th>
                      <th className="py-2 px-1 font-bold text-right">Rho (kg/m³)</th>
                      <th className="py-2 px-1 font-bold text-right">c (J/kgK)</th>
                      <th className="py-2 px-1 font-bold text-right"><MdText text={inhalt.texte.masseKgM} /></th>
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
                <Volume2 size={14} className="text-shiraz animate-pulse" /><MdText text={inhalt.texte.raumDimensionenDin18041} /></h3>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center mb-4 flex justify-between font-mono font-bold text-xs">
                <span>Volumen V = {formatDeZahl(roomW*roomL*roomH, 0)} m³</span>
                <span><MdText text={inhalt.texte.mantelflächeS} />{formatDeZahl(acousticsResults.totalSurfaceArea, 0)} m²</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span><MdText text={inhalt.texte.längeDesRaumesL} /></span>
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
                    <span><MdText text={inhalt.texte.breiteDesRaumesW} /></span>
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
                    <span><MdText text={inhalt.texte.lichteHöheDesRaumes} /></span>
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
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2"><MdText text={inhalt.texte.raumtypSollvorgabenNachDin} /></label>
                  <select aria-label={inhalt.werte.raumtypSollvorgabenNachDin} 
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as typeof roomType)}
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
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-3"><MdText text={inhalt.texte.zuweisungDSchallabsorberOberflächen} /></h3>

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
                  <span className="col-span-4 text-[11px] font-bold text-slate-600"><MdText text={inhalt.texte.rechteWand} /></span>
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
                <Volume2 size={16} className="text-shiraz" /><MdText text={inhalt.texte.raumakustischeVerhaltenskontrolle} /></h3>

              {/* Graphical gauge chart display */}
              <div className="flex flex-col items-center py-6 border border-slate-100 bg-slate-50/50 rounded-2xl mb-6 relative">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block"><MdText text={inhalt.texte.berechneteHallzeitTD} /></span>
                
                <span className="text-5xl font-black text-shiraz font-mono mt-2 mb-1 animate-pulse">
                  {formatDeZahl(acousticsResults.reverberationTime, 2)} <span className="text-lg">Sekunden</span>
                </span>
                
                <span className="text-xs bg-slate-900 border border-slate-800 text-slate-200 font-bold font-mono px-3 py-1 rounded-full flex items-center gap-1">
                  Typ: {acousticsResults.roomLabel}<MdText text={inhalt.texte.dinEmpfehlung} />{formatDeZahl(acousticsResults.T_target, 2)} s ({formatDeZahl(acousticsResults.minTarget, 2)} s - {formatDeZahl(acousticsResults.maxTarget, 2)} s)
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
                      ? inhalt.werte.unterrichtsflussBehindertZuHallig 
                      : acousticsResults.reverberationTime < acousticsResults.minTarget 
                        ? inhalt.werte.toterRaumZukleineHallzeit 
                        : inhalt.werte.perfekteAkustischeRaumstimmung}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-95">
                    {acousticsResults.stateDesc} 
                    {acousticsResults.reverberationTime > acousticsResults.maxTarget && inhalt.werte.tippÄndernSieDas}
                    {acousticsResults.reverberationTime < acousticsResults.minTarget && inhalt.werte.tippEntfernenSieEinige}
                  </p>
                </div>
              </div>

              {/* Dynamic Octave-Band Reverberation DIN 18041 Corridor Chart */}
              <div className="mt-6 pt-5 border-t border-slate-150">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span><MdText text={inhalt.texte.sollKorridorDerNachhallzeit} /></span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded"><MdText text={inhalt.texte.frequenzbereich125Hz4000} /></span>
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
                          title: { display: true, text: inhalt.werte.nachhallzeitTFS, font: { size: 10, weight: 'bold' }, color: '#475569' }, 
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
                <div className="text-[10px] text-slate-500 italic mt-2 text-center leading-relaxed"><MdText text={inhalt.texte.dieGrafikStelltDen} /></div>
              </div>

            </div>

            {/* Sabine calculation table list */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-3"><MdText text={inhalt.texte.äquivalenteAbsorptionsbilanzDerHüllfläch} /></h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-medium text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 px-1 font-bold">Flächenwand</th>
                      <th className="py-2 px-1 font-bold text-right"><MdText text={inhalt.texte.flächeSM} /></th>
                      <th className="py-2 px-1 font-bold text-right"><MdText text={inhalt.texte.absorptionsgrad} /></th>
                      <th className="py-2 px-1 font-bold text-right"><MdText text={inhalt.texte.kompAbsorptionAM} /></th>
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
                      <td className="py-2 px-1"><MdText text={inhalt.texte.summeGesamt} /></td>
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
      <NachErstemBild minHoehe="30rem">
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1UWert}
        zielGleichung="U = \frac{1}{R_{si} + \sum d_i/\lambda_i + R_{se}}, \quad f_{Rsi} = 1 - R_{si}^{*} \cdot U"
        schritte={inhalt.daten["Bauphysik.schritte"]}
        ergebnisHinweis={inhalt.werte.inDerUngestörtenFläche}
        normQuelle={inhalt.werte.dinEnIso69462}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2NachhallzeitEines}
        zielGleichung="T = 0{,}163 \cdot \frac{V}{A}"
        schritte={inhalt.daten["Bauphysik.schritte_2"]}
        ergebnisHinweis={inhalt.werte.eineVollflächigeAkustikdeckeSenkt}
        normQuelle={inhalt.werte.din18041201603}
      />
      </NachErstemBild>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bauphysik" />

      {/* 5. ACADEMY DOCUMENTATION FOOTER */}
      <CalculatorDisclaimerBanner className="my-2" />
      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap6}
wikipedia={[
          { title: 'Bauphysik', url: 'https://de.wikipedia.org/wiki/Bauphysik' },
          { title: 'Wärmedurchgangskoeffizient', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient' },
          { title: 'Nachhallzeit', url: 'https://de.wikipedia.org/wiki/Nachhallzeit' }
        ]}
        regelwerke={inhalt.daten["Bauphysik.regelwerke"]}
        literatur={inhalt.daten["Bauphysik.literatur"]}
        weblinks={inhalt.daten["Bauphysik.weblinks"]}
        formeln={inhalt.daten["Bauphysik.formeln"]}
      />
    </div>
  );
}
