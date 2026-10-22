import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { Scale, Activity, Droplets, Flame, Clock, Layers, Calculator } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Slider } from '@/src/components/ui/Slider';
import { BlockMath, InlineMath } from 'react-katex';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Elastomechanik from './Elastomechanik';
import { ModulTest } from '@/src/components/quiz/ModulTest';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CONCRETE_PROPS_MAP = {
  'C20/25': { fck: 20, Ecm: 30000, fctm: 2.2, fcm: 28 },
  'C25/30': { fck: 25, Ecm: 31000, fctm: 2.6, fcm: 33 },
  'C30/37': { fck: 30, Ecm: 33000, fctm: 2.9, fcm: 38 },
  'C35/45': { fck: 35, Ecm: 34000, fctm: 3.2, fcm: 43 },
  'C50/60': { fck: 50, Ecm: 37000, fctm: 4.1, fcm: 58 }
};

export default function Baustoffkenngroessen() {
  const [activeTab, setActiveTab] = useState<'eigenschaften' | 'mechanisch' | 'physikalisch' | 'hygrisch' | 'thermisch' | 'zeitlich' | 'rechenbeispiele'>('eigenschaften');

  // Zeitabhängige Kennwerte State
  const [zeitlichSigma0, setZeitlichSigma0] = useState(15); // MPa Dauerlast
  const [zeitlichE, setZeitlichE] = useState(30000); // MPa Elastizitätsmodul
  const [zeitlichPhi, setZeitlichPhi] = useState(2.0); // Endkriechbeiwert
  const [zeitlichSchwindenInf, setZeitlichSchwindenInf] = useState(-0.5); // Endschwindmaß in ‰
  const [zeitlichRelaxationInf, setZeitlichRelaxationInf] = useState(12); // Relaxation in %
  const [zeitlichT, setZeitlichT] = useState(365); // Tage

  // Mechanisch State (Grundlagen)
  const [kraft, setKraft] = useState(100); // kN
  const [flaeche, setFlaeche] = useState(50); // cm²
  const [laenge, setLaenge] = useState(2); // m
  const [verlaengerung, setVerlaengerung] = useState(5); // mm
  const [eModul, setEModul] = useState(210000); // MPa (Stahl)

  // State für Rechenbeispiel A (einfach mit festen Kennwerten)
  const [saeulenMaterial, setSaeulenMaterial] = useState<'stahl' | 'alu' | 'holz' | 'beton' | 'custom'>('beton');
  const [saeulenF, setSaeulenF] = useState(500); // kN
  const [saeulenA, setSaeulenA] = useState(625); // cm²
  const [saeulenL0, setSaeulenL0] = useState(3.0); // m
  const [saeulenE, setSaeulenE] = useState(30000); // MPa
  const [saeulenFy, setSaeulenFy] = useState(30); // MPa (Grenzfestigkeit)

  // State für Rechenbeispiel B (Beton mit Kriechen, Schwinden und Zwang)
  const [betonKlasse, setBetonKlasse] = useState<'C20/25' | 'C25/30' | 'C30/37' | 'C35/45' | 'C50/60'>('C30/37');
  const [loadingAge, setLoadingAge] = useState(7); // t0, Tage bei Erstbelastung (3-90)
  const [observationDays, setObservationDays] = useState(365); // t, Tage (3-10000)
  const [sustainedForce, setSustainedForce] = useState(250); // kN sustained load (Dauerlast)
  const [creepCoeffInf, setCreepCoeffInf] = useState(2.5); // Endkriechbeiwert phi_inf (0.5-4.0)
  const [shrinkageStrainInf, setShrinkageStrainInf] = useState(-0.5); // Endschwindmaß in Promille (negativ)
  const [restraintGrad, setRestraintGrad] = useState(0.8); // Zwang-Grad K (0-1)
  const [tempDrop, setTempDrop] = useState(15); // Delta T Abkühlung in K

  // Physikalisch State
  const [masse, setMasse] = useState(2400); // kg
  const [volumen, setVolumen] = useState(1); // m³
  const [reindichte, setReindichte] = useState(2650); // kg/m³
  const [rohdichte, setRohdichte] = useState(2400); // kg/m³

  // Hygrisch State
  const [masseFeucht, setMasseFeucht] = useState(1050); // g
  const [masseTrocken, setMasseTrocken] = useState(1000); // g

  // Thermisch State
  const [alphaT, setAlphaT] = useState(1.2); // 10^-5 1/K (Stahl)
  const [deltaT, setDeltaT] = useState(50); // K

  // Neu hinzugefügte States für erweiterte Kennwerte (Wärmeleitfähigkeit λ, Wärmekapazität c, sd, w/B)
  const [lambda, setLambda] = useState(0.04); // W/(m K)
  const [lambdaDicke, setLambdaDicke] = useState(0.12); // m (Dicke)
  const [spezKapazitaetC, setSpezKapazitaetC] = useState(1000); // J/(kg K)
  const [spezKapazitaetMasse, setSpezKapazitaetMasse] = useState(1500); // kg
  const [spezKapazitaetDeltaT, setSpezKapazitaetDeltaT] = useState(15); // K

  const [sdMuWert, setSdMuWert] = useState(150); // dimensionslos
  const [sdDicke, setSdDicke] = useState(0.14); // m
  
  const [wSaugzeit, setWSaugzeit] = useState(24); // h
  const [wWasseraufnahme, setWWasseraufnahme] = useState(0.5); // kg/m²

  const [selectedMaterial, setSelectedMaterial] = useState<'holz' | 'beton' | 'stahl' | 'glas' | 'mauerwerk' | 'asphalt'>('holz');

  const dichtePresets = {
    ziegel: {
      name: "Ziegelscherben (Vollziegel)",
      rhoR: 2650,
      rho: 1800,
      rhoS: 1100,
      desc: "Der gebrannte Ziegelscherben hat eine Reindichte von etwa 2650 kg/m³. Durch die Brennporen sinkt die Scherbenrohdichte eines Vollziegels auf ca. 1800 kg/m³ (Lochziegel: Steinrohdichte durch die Lochung deutlich geringer). Geschütteter Ziegelsplitt erreicht ca. 1100 kg/m³."
    },
    blaehton: {
      name: "Blähtongranulat",
      rhoR: 2500,
      rho: 650,
      rhoS: 380,
      desc: "Die Mineralsubstanz hat ca. 2500 kg/m³ Reindichte. Beim Brennen bei ca. 1200 °C blähen Gase den erweichten Ton auf; die Kornrohdichte sinkt dadurch auf ca. 650 kg/m³. Die lose Schüttung mit Haufwerksporen wiegt nur ca. 380 kg/m³."
    },
    granit: {
      name: "Monolithischer Granit",
      rhoR: 2700,
      rho: 2650,
      rhoS: 1600,
      desc: "Quarzreiches Tiefengestein mit vernachlässigbar kleiner Porigkeit. Reindichte und Rohdichte sind quasi identisch (~2650 kg/m³). Als gebrochener Schotter (Haufwerk) bildet Granit eine Schüttdichte von ca. 1600 kg/m³."
    },
    porenbeton: {
      name: "Porenbeton",
      rhoR: 2400,
      rho: 500,
      rhoS: 310,
      desc: "Das Feststoffgerüst (Tobermorit, Quarz) hat ca. 2400 kg/m³ Reindichte. Aluminiumpulver reagiert in der alkalischen Mischung unter Wasserstoffbildung und treibt den Mörtel auf; die Steinrohdichte sinkt dadurch auf ca. 500 kg/m³. Als Granulatschüttung wiegt der Baustoff nur noch ca. 310 kg/m³."
    }
  };

  const [selectedDichtePreset, setSelectedDichtePreset] = useState<'ziegel' | 'blaehton' | 'granit' | 'porenbeton' | 'custom'>('ziegel');
  const [physRhoR, setPhysRhoR] = useState(2650);
  const [physRho, setPhysRho] = useState(1800);
  const [physRhoS, setPhysRhoS] = useState(1100);

  const [thermischPreset, setThermischPreset] = useState<'holz' | 'porenbeton' | 'ziegel' | 'beton' | 'stahl' | 'eps' | 'custom'>('ziegel');
  const [thermischLambda, setThermischLambda] = useState(0.81);
  const [thermischRho, setThermischRho] = useState(1800);
  const [thermischC, setThermischC] = useState(1000);


  // ----------------------------------------------------
  // BERECHNUNGEN
  // ----------------------------------------------------

  // Berechnungen Mechanisch (Grundlagen)
  const spannung = (kraft * 1000) / (flaeche * 100); // N/mm² = MPa
  const dehnung = verlaengerung / (laenge * 1000); // m/m
  const dehnungPromille = dehnung * 1000;
  const spannungHooke = eModul * dehnung;

  // Material-Preset Handler für Rechenbeispiel A
  const handleDichtePresetChange = (preset: 'ziegel' | 'blaehton' | 'granit' | 'porenbeton' | 'custom') => {
    setSelectedDichtePreset(preset);
    if (preset !== 'custom') {
      const p = dichtePresets[preset];
      setPhysRhoR(p.rhoR);
      setPhysRho(p.rho);
      setPhysRhoS(p.rhoS);
    }
  };

  const handleThermischPresetChange = (preset: 'holz' | 'porenbeton' | 'ziegel' | 'beton' | 'stahl' | 'eps' | 'custom') => {
    setThermischPreset(preset);
    if (preset === 'holz') {
      setThermischLambda(0.13);
      setThermischRho(500);
      setThermischC(1600);
    } else if (preset === 'porenbeton') {
      setThermischLambda(0.10);
      setThermischRho(400);
      setThermischC(1000);
    } else if (preset === 'ziegel') {
      setThermischLambda(0.81);
      setThermischRho(1800);
      setThermischC(1000);
    } else if (preset === 'beton') {
      setThermischLambda(2.0);
      setThermischRho(2400);
      setThermischC(1000);
    } else if (preset === 'stahl') {
      setThermischLambda(50.0);
      setThermischRho(7850);
      setThermischC(460);
    } else if (preset === 'eps') {
      setThermischLambda(0.035);
      setThermischRho(30);
      setThermischC(1500);
    }
  };

  const handleSaeulenMaterialChange = (mat: 'stahl' | 'alu' | 'holz' | 'beton' | 'custom') => {
    setSaeulenMaterial(mat);
    if (mat === 'stahl') {
      setSaeulenE(210000);
      setSaeulenFy(235);
      setSaeulenA(50);
    if (saeulenF > 1000) setSaeulenF(800);
    } else if (mat === 'alu') {
      setSaeulenE(70000);
      setSaeulenFy(160);
      setSaeulenA(80);
    } else if (mat === 'holz') {
      setSaeulenE(11000);
      setSaeulenFy(21);
      setSaeulenA(400);
    } else if (mat === 'beton') {
      setSaeulenE(30000);
      setSaeulenFy(30);
      setSaeulenA(625);
    }
  };

  // Berechnungen: Rechenbeispiel A: Einfache elastische Beanspruchung
  const stressA = (saeulenF * 1000) / (saeulenA * 100); // N/mm² = MPa
  const strainA = stressA / saeulenE; // m/m
  const strainAPromille = strainA * 1000; // ‰
  const deltaLA = strainA * saeulenL0 * 1000; // mm
  const utilizationA = (stressA / saeulenFy) * 100; // Auslastungsgrad (%)

  // Berechnungen: Rechenbeispiel B: Beton zeitabhängig (Kriechen, Schwinden, Zwang)
  const cInfo = CONCRETE_PROPS_MAP[betonKlasse] || CONCRETE_PROPS_MAP['C30/37'];
  const obsT = Math.max(loadingAge + 1, observationDays);

  // t0, Erstbelastung
  const beta_cc_t0 = Math.exp(0.25 * (1 - Math.sqrt(28 / loadingAge)));
  const f_cm_t0 = beta_cc_t0 * cInfo.fcm;
  const Ecm_t0 = cInfo.Ecm * Math.pow(f_cm_t0 / cInfo.fcm, 0.3);

  // t, Beobachtungsalter
  const beta_cc_t = Math.exp(0.25 * (1 - Math.sqrt(28 / obsT)));
  const f_cm_t = beta_cc_t * cInfo.fcm;
  // Zugfestigkeitsentwicklung (Eurocode 2 Näherung)
  const f_ctm_t = obsT <= 28 
    ? cInfo.fctm * beta_cc_t 
    : cInfo.fctm * Math.pow(beta_cc_t, 2 / 3);

  // Kriechbeiwertentwicklung bei Beobachtungsdauer obsT
  const beta_c_t = (obsT - loadingAge) / ((obsT - loadingAge) + 30);
  const phi_t = creepCoeffInf * beta_c_t;
  const E_eff_t = Ecm_t0 / (1 + phi_t);

  // Lastbedingte Spannungen von F_g
  const sigma_c0 = (sustainedForce * 1000) / (saeulenA * 100); // MPa (Stütze Fläche A_saeule)
  const eps_el0 = (sigma_c0 / Ecm_t0) * 1000; // initial elastisch ‰
  const eps_cr = eps_el0 * phi_t; // ‰ (Kriechdehnung)

  // Schwinden
  const beta_ds_t = obsT / (obsT + 150);
  const eps_cs = shrinkageStrainInf * beta_ds_t; // ‰ (Schwinddehnung, negativ)

  // Abkühlung
  const eps_temp = -tempDrop * 1.0e-5 * 1000; // ‰ (negativ)

  // Zwangskraft-Berechnung: Grad des Zwangs x (Dehnungen aus Schwinden & Temp)
  const totalContraction = eps_cs + eps_temp; // negative Dehnung
  const sigma_zwang = restraintGrad * Math.abs(totalContraction) * (E_eff_t / 1000); // positive Zugspannung
  const utilizationB = (sigma_zwang / f_ctm_t) * 100; // Rissauslastung in %

  // Kurvendaten über Zeitachse für Beispiel B generieren
  const daysList = [3, 7, 14, 28, 56, 90, 180, 270, 360, 720, 1080];
  const chartLabelsB = daysList.map(d => `${formatDeWert(d)} d`);

  const tensileStrengthsB = daysList.map(x => {
    const b_cc = Math.exp(0.25 * (1 - Math.sqrt(28 / x)));
    const f_ct_x = x <= 28 
      ? cInfo.fctm * b_cc 
      : cInfo.fctm * Math.pow(b_cc, 2 / 3);
    return Number(f_ct_x.toFixed(2));
  });

  const restraintStressesB = daysList.map(x => {
    if (x <= loadingAge) return 0;
    const b_cc_t0_x = Math.exp(0.25 * (1 - Math.sqrt(28 / loadingAge)));
    const f_cm_t0_x = b_cc_t0_x * cInfo.fcm;
    const Ecm_t0_x = cInfo.Ecm * Math.pow(f_cm_t0_x / cInfo.fcm, 0.3);

    const b_c_x = (x - loadingAge) / ((x - loadingAge) + 30);
    const phi_x = creepCoeffInf * b_c_x;
    const E_eff_x = Ecm_t0_x / (1 + phi_x);

    const b_ds_x = x / (x + 150);
    const eps_cs_x = shrinkageStrainInf * b_ds_x;
    const eps_temp_x = -tempDrop * 1.0e-5 * 1000;

    const sig_zw_x = restraintGrad * Math.abs(eps_cs_x + eps_temp_x) * (E_eff_x / 1000);
    return Number(sig_zw_x.toFixed(2));
  });

  const concreteChartData = {
    labels: chartLabelsB,
    datasets: [
      {
        label: 'Beton-Zugfestigkeit f_ctm(t) [MPa]',
        data: tensileStrengthsB,
        borderColor: '#475569', // Gray slate
        backgroundColor: 'rgba(71, 85, 105, 0.05)',
        borderDash: [5, 5],
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 3,
      },
      {
        label: 'Zwangspannung σ_zwang(t) [MPa]',
        data: restraintStressesB,
        borderColor: '#A3113E', // Shiraz red
        backgroundColor: 'rgba(163, 17, 62, 0.1)',
        borderWidth: 3,
        tension: 0.1,
        fill: true,
        pointRadius: 4,
      }
    ]
  };

  // Berechnungen Physikalisch
  const dichte = masse / volumen;
  const porositaet = (1 - (rohdichte / reindichte)) * 100;

  // Berechnungen Hygrisch
  const wassergehalt = ((masseFeucht - masseTrocken) / masseTrocken) * 100;

  // Berechnungen Thermisch
  const waermedehnung = (alphaT * 1e-5) * laenge * deltaT * 1000; // mm

  const stressStrainData = {
    labels: [0, dehnungPromille / 2, dehnungPromille, dehnungPromille * 1.5],
    datasets: [
      {
        label: 'Spannung (Hookesches Gesetz)',
        data: [0, (eModul * (dehnung / 2)), spannungHooke, (eModul * (dehnung * 1.5))],
        borderColor: '#A3113E',
        tension: 0,
      }
    ]
  };

  // Berechnungen für den zeitabhängigen Reiter (Kriechen, Schwinden und Relaxieren)
  const calcTimedValues = (t: number) => {
    const eps_el = (zeitlichSigma0 / zeitlichE) * 1000; // in ‰
    const beta_c = t === 0 ? 0 : t / (t + 30);
    const phi_t = zeitlichPhi * beta_c;
    const eps_cr = eps_el * phi_t;
    
    const beta_ds = t === 0 ? 0 : t / (t + 150);
    const eps_cs = zeitlichSchwindenInf * beta_ds;
    
    const eps_total = eps_el + eps_cr + eps_cs;

    const psi_t = (zeitlichRelaxationInf / 100) * beta_c;
    const sigma_t = zeitlichSigma0 * (1 - psi_t);

    return {
      eps_el,
      phi_t,
      eps_cr,
      eps_cs,
      eps_total,
      sigma_t
    };
  };

  const currentTimed = calcTimedValues(zeitlichT);

  const timeLabels = [0, 3, 7, 14, 28, 90, 180, 270, 360, 540, 720, 1080];
  const dehnungenChartData = {
    labels: timeLabels.map(d => `${formatDeWert(d)} d`),
    datasets: [
      {
        label: 'Elastische Dehnung',
        data: timeLabels.map(d => calcTimedValues(d).eps_el),
        borderColor: '#94a3b8',
        backgroundColor: '#94a3b8',
        borderDash: [5, 5],
        borderWidth: 1.5,
        tension: 0.1,
        pointRadius: 2,
      },
      {
        label: 'Kriechdehnung',
        data: timeLabels.map(d => calcTimedValues(d).eps_cr),
        borderColor: '#64748b',
        backgroundColor: '#64748b',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 2,
      },
      {
        label: 'Schwinden (negativ)',
        data: timeLabels.map(d => calcTimedValues(d).eps_cs),
        borderColor: '#1e293b',
        backgroundColor: '#1e293b',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 2,
      },
      {
        label: 'Gesamtverformung (Summe)',
        data: timeLabels.map(d => calcTimedValues(d).eps_total),
        borderColor: '#A3113E',
        backgroundColor: '#A3113E',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 3,
      }
    ]
  };

  const relaxationChartData = {
    labels: timeLabels.map(d => `${formatDeWert(d)} d`),
    datasets: [
      {
        label: 'Spannungsverlauf (Relaxation)',
        data: timeLabels.map(d => calcTimedValues(d).sigma_t),
        borderColor: '#A3113E',
        backgroundColor: '#A3113E',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 3,
      }
    ]
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Scale className="text-shiraz" /> Baustoffkenngrößen
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Baustoffkenngrößen beschreiben die physikalischen, mechanischen, hygrischen und thermischen Eigenschaften von Materialien. Sie sind die Grundlage für jede statische und bauphysikalische Bemessung.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'eigenschaften' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('eigenschaften')}
          >
            <Layers size={16} /> Eigenschaften
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'mechanisch' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('mechanisch')}
          >
            <Activity size={16} /> Mechanisch
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'physikalisch' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('physikalisch')}
          >
            <Scale size={16} /> Physikalisch
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'hygrisch' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('hygrisch')}
          >
            <Droplets size={16} /> Hygrisch
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'thermisch' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('thermisch')}
          >
            <Flame size={16} /> Thermisch
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zeitlich' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zeitlich')}
          >
            <Clock size={16} /> Zeitabh. Eigenschaften
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'rechenbeispiele' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
            onClick={() => setActiveTab('rechenbeispiele')}
          >
            <Calculator size={16} /> Rechenbeispiele
          </button>
        </div>
      </div>

      {activeTab === 'eigenschaften' && (
        <div className="flex flex-col gap-8 w-full animate-fade-in" id="tab-eigenschaften-container">
          {/* Sektion 1: Interaktive Material-Klassifizierung */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <Layers className="text-shiraz" size={18} /> Interaktive Material-Klassifizierung
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Wählen Sie einen Baustoff aus, um die grundlegenden Gefügestrukturen, Richtungsabhängigkeiten (Isotropie/Anisotropie), Homogenitätsgrade und das rheologische Verformungsverhalten anhand wissenschaftlicher Kennwerte zu analysieren.
          </p>
        </div>

            {/* Material Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {(['holz', 'beton', 'stahl', 'glas', 'mauerwerk', 'asphalt'] as const).map((mat) => {
                const names = {
                  holz: '🌲 Holz',
                  beton: '🪨 Normalbeton',
                  stahl: '🏗️ Baustahl',
                  glas: '💎 Floatglas',
                  mauerwerk: '🧱 Mauerwerk',
                  asphalt: '🛣️ Asphalt'
                };
                const isSelected = selectedMaterial === mat;
                return (
                  <button
                    key={mat}
                    id={`btn-mat-${mat}`}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold font-sans border transition-all text-center ${
                      isSelected
                        ? 'bg-shiraz text-white border-shiraz shadow-md scale-[1.02]'
                        : 'bg-slate-50 border-home-grau/30 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {names[mat]}
                  </button>
                );
              })}
            </div>

            {/* Dynamic material profile render */}
            {(() => {
              const spec = {
                holz: {
                  name: 'Fichtenholz (Picea abies)',
                  description: 'Naturbaustoff aus organischen Fasern (Zellulose, Lignin) mit ausgeprägter anisotrop-röhrenförmiger Zellstruktur.',
                  isotropy: 'Anisotrop (Orthotrop)',
                  isotropyBadge: 'bg-rose-50 text-rose-700 border-rose-200',
                  isotropyDesc: 'Zeigt in den drei Achsenachsen (axial/Faserrichtung, radial und tangential) völlig unterschiedliche physikalische Profile. Das E-Modul parallel zur Faser ist um ein Vielfaches höher (ca. 11.000 MPa) als quer zur Faser (ca. 300 - 450 MPa). Schwinden parallel ist vernachlässigbar (< 0,1 %), während es tangential ca. 8 % erreicht.',
                  homogeneity: 'Stark Heterogen',
                  homogeneityBadge: 'bg-amber-50 text-amber-700 border-amber-200',
                  homogeneityDesc: 'Charakterisiert durch natürliches Wachstum: Jahresringgrenzen (Frühholz vs. Spätholz), Astansätze, Kern-/Splintholzanteile und Markstrahlen führen zu ortsabhängigen Dichteunterschieden im Millimetermaßstab.',
                  rheology: 'Viskoelastisch mit Sorptionsbindung',
                  rheologyBadge: 'bg-blue-50 text-blue-700 border-blue-200',
                  rheologyDesc: 'Verformt sich unter Dauerlast über die Zeit (zeitabhängiges viskoses Kriechen). Die Kriechrate ist stark gekoppelt an hygrische Wechsel (De- und Adsorption), bekannt als mechano-sorptiver Effekt.',
                  example: 'Ein massiver Holzbinder biegt sich im Dachwerk über Jahrzehnte hinweg langsam viskös durch (Kriechen). Bei Querzugspannung bricht das Holz schlagartig ohne Vorwarnung längs auf, da die radialen Bindekräfte minimal sind.',
                  norm: 'Entwurf nach DIN EN 1995-1-1 (Eurocode 5), Holzbeständigkeit nach DIN 68800.',
                  test: 'Visuelle Festigkeitssortierung nach DIN 4074-1 bzw. maschinelle Sortierung nach DIN EN 14081; Prüfung der Festigkeitswerte nach DIN EN 408.'
                },
                beton: {
                  name: 'Normalbeton (z. B. C25/30)',
                  description: 'Künstlicher Verbundbaustoff aus mineralischen Zuschlägen, hydraulischem Bindemittel (Zementstein) und Mikroporen.',
                  isotropy: 'Quasi-Isotrop (im ungerissenen Zustand)',
                  isotropyBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  isotropyDesc: 'Solange keine Risse auftreten (Zustand I) und die Gesteinskörnung regellos verteilt ist, sind die Druckfestigkeiten in alle Raumrichtungen identisch. Nach Rissbildung oder bei einseitiger schlaffer Stahlbewehrung wandelt sich das System in ein hochgradig anisotropes Verhalten.',
                  homogeneity: 'Stark Heterogen',
                  homogeneityBadge: 'bg-amber-50 text-amber-700 border-amber-200',
                  homogeneityDesc: 'Zweiphasensytem aus Zementmatrix, Gesteinskörnung und der porösen Übergangszone (ITZ: Interfacial Transition Zone). Eigenschaften unterliegen starken Größeneffekten des Probekörpers (Maßstabseffekt).',
                  rheology: 'Elastisch & plasto-viskos (Kriechen & Schwinden)',
                  rheologyBadge: 'bg-blue-50 text-blue-700 border-blue-200',
                  rheologyDesc: 'Zeigt bei Kurzzeitbelastung elastisches Rückfederungsverhalten. Unter Dauerlast kriecht Beton erheblich (Zementsteingel fließt um). Das Schwinden (Feuchteabgabe an die Umwelt) erzeugt zusätzliche zeitabhängige Schwindstauchungen.',
                  example: 'Die Druckstützen im Untergeschoss stauchen sich in den ersten Jahren merklich ein. Das Tragwerk kriecht infolge permanenter Eigenlasten und schwindet gleichzeitig durch die fortschreitende Austrocknung.',
                  norm: 'Konstruktion nach DIN EN 1992-1-1 (Eurocode 2) und Herstellungsnorm DIN EN 206 / DIN 1045-2.',
                  test: 'Zerstörende Druckprüfung von Würfeln (150 mm Kantenlänge) nach DIN EN 12390-3 im Alter von 28 Tagen; Lagerung nach DIN EN 12390-2 (in Deutschland meist Trockenlagerung nach Anhang NA mit Umrechnung auf Wasserlagerung).'
                },
                stahl: {
                  name: 'Baustahl (z. B. S235J0)',
                  description: 'Metallischer Legierungswerkstoff mit fein-polykristallinem, metallogefüglichem Kristallgitter.',
                  isotropy: 'Isotrop',
                  isotropyBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  isotropyDesc: 'Durch die regellose Richtungsverteilung der mikroskopischen Metallkörner verhalten sich alle Festigkeiten, Elastizitätsmoduln (<InlineMath math="E \\approx 210\\,000" /> MPa) und Querdehnzahlen (<InlineMath math="\\nu \\approx 0{,}3" />) in allen drei Raumachsen praktisch identisch (Walztexturen bewirken nur geringe Unterschiede).',
                  homogeneity: 'Homogen (makroskopisch)',
                  homogeneityBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  homogeneityDesc: 'Auf der makroskopischen Ebene sind alle physikalischen Eigenschaften homogen im gesamten Profilquerschnitt verteilt. Es gibt keine ausgeprägten Phasengrenzflächen im Zentimetermaßstab.',
                  rheology: 'Linear-elastisch / ideal-plastisch',
                  rheologyBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  rheologyDesc: 'Folgt bis zur ausgeprägten Streckgrenze streng dem Hooke\'schen Gesetz (<InlineMath math="\\sigma = E \\cdot \\varepsilon" />). Nach Erreichen der Streckgrenze fließt der Stahl stark plastisch unter Verfestigung bis zum Dehnungsbruch. Zeitabhängiges Raumtemperaturkriechen ist vernachlässigbar.',
                  example: 'Ein stählerner Walzträger fängt Deckeneigenlasten elastisch ab. Bei extremer mechanischer Überlastung biegt er sich massiv plastisch durch, ohne sofort zu zerreißen (Duktilitätsvorteil der Stahlbauweise).',
                  norm: 'Tragwerksentwurf nach DIN EN 1993-1-1 (Eurocode 3) und Stahlspezifikation nach DIN EN 10025.',
                  test: 'Zugversuch an normierten Flach- oder Rundproben zur Bestimmung der Dehngrenze und Bruchdehnung nach DIN EN ISO 6892-1.'
                },
                glas: {
                  name: 'Kalknatron-Floatglas',
                  description: 'Anorganisches, amorphes Schmelzprodukt ohne weitreichende kristalline Ordnung.',
                  isotropy: 'Vollkommen Isotrop',
                  isotropyBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  isotropyDesc: 'Wegen der ungeordneten, nicht-kristallinen Atomanordnung besitzt Fensterglas in alle Achsenrichtungen exakt dieselben physikalischen, spannungsoptischen und elastischen Eigenschaften.',
                  homogeneity: 'Homogen',
                  homogeneityBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  homogeneityDesc: 'Makroskopisch homogen: Der Floatprozess erzeugt ein einphasiges, amorphes Gefüge ohne Körner oder Phasengrenzen. Die Festigkeit wird aber von mikroskopischen Oberflächendefekten (Griffith-Risse) bestimmt – deshalb streut sie stark.',
                  rheology: 'Rein linear-elastisch & extrem spröde',
                  rheologyBadge: 'bg-rose-50 text-rose-700 border-rose-200',
                  rheologyDesc: 'Zeigt bis zum eigentlichen Bruch keinerlei plastisches Fließen oder Dehnkriechen. Es verwindet sich absolut linear und federt schadensfrei zurück, bricht jedoch bei Überschreiten der Oberflächenzugfestigkeit schlagartig.',
                  example: 'Eine Schaufensterscheibe hält hohen Windböen rein elastisch stand. Ein auftreffender Kieselstein erzeugt Mikrorisse; wird die kritische Risszähigkeit lokal überschritten, erfolgt unverzüglich der Sprödbruch.',
                  norm: 'Bemessung im Bauwesen nach DIN 18008-1 bis 6 (Glas im Bauwesen).',
                  test: 'Doppelring-Biegeversuch zur Bestimmung der Biegefestigkeit nach DIN EN 1288-2 bzw. -5.'
                },
                mauerwerk: {
                  name: 'Mauerwerk (Ziegel mitsamt Mörtelfuge)',
                  description: 'Anorganischer Verbundwerkstoff aus vorgefertigten Bausteinen und plastisch applizierten Lagerfugenmörteln.',
                  isotropy: 'Stark Anisotrop',
                  isotropyBadge: 'bg-rose-50 text-rose-700 border-rose-200',
                  isotropyDesc: 'Besitzt extreme Richtungsabhängigkeiten. Die vertikale Tragfähigkeit senkrecht zur horizontalen Mörtellagerfuge ist hoch. Horizontalschub oder Parallelbeanspruchungen führen sehr früh zu Gleitfugenrissen oder Ziegelscheren.',
                  homogeneity: 'Extrem Heterogen',
                  homogeneityBadge: 'bg-amber-50 text-amber-700 border-amber-200',
                  homogeneityDesc: 'Zwei sehr unterschiedliche Materialien – Mauerstein (höhere Festigkeit und Steifigkeit) und Fugenmörtel (meist geringere Steifigkeit, stärkere Querdehnung) – sind über den Haftverbund miteinander verbunden.',
                  rheology: 'Nichtlinear-elastisch mit Fugenstauchungskriechen',
                  rheologyBadge: 'bg-blue-50 text-blue-700 border-blue-200',
                  rheologyDesc: 'Das Verformungsverhalten ist nichtlinear und stark von den Fugeneigenschaften abhängig. Der plastische Fugenanteil unterliegt unter kontinuierlicher Auflast signifikanten Setzungen und Stauchungen.',
                  example: 'Ein Ziegelpfeiler fängt vertikale Deckenkräfte sehr steif ab. Bei einer seitlich einwirkenden Windböe gleiten die Ziegel auf den Lagerfugen ab, wenn die Haftscherfestigkeit überschritten wird.',
                  norm: 'Bemessung nach DIN EN 1996-1-1 (Eurocode 6); Mauersteine nach DIN EN 771-1 mit DIN 20000-401 (Ziegel).',
                  test: 'Bestimmung der Mauerwerksdruckfestigkeit an Prüfkörpern (Wandabschnitten) nach DIN EN 1052-1; Haftscherfestigkeit nach DIN EN 1052-3.'
                },
                asphalt: {
                  name: 'Asphalttragschicht (z. B. AC 32 TN)',
                  description: 'Viskoelastisches Mehrphasengemisch aus bruchrauher Gesteinskörnung, Gesteinsmehl (Filler) und dem Bindemittel Bitumen.',
                  isotropy: 'Isotrop (makroskopisch nach Verdichtung)',
                  isotropyBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  isotropyDesc: 'Nach dem profilgerechten Einbau und der Verdichtung durch Walzen sind die mechanischen Steifigkeiten in alle horizontalen und vertikalen Tragachsen im Wesentlichen identisch.',
                  homogeneity: 'Heterogen',
                  homogeneityBadge: 'bg-amber-50 text-amber-700 border-amber-200',
                  homogeneityDesc: 'Körnung und viskoses Bitumensystem bilden eine grobe Korn-Matrix mit messbaren Hohlraumvolumenanteilen. Die Eigenschaften hängen extrem von der lokalen Korngrößenmischung ab.',
                  rheology: 'Thermisch hochviskos & thermoelastisch (Viskoelastisch)',
                  rheologyBadge: 'bg-blue-50 text-blue-700 border-blue-200',
                  rheologyDesc: 'Zentrales mechanisches Verhalten ist stark temperatur- und frequenzabhängig (Lastwechselrate). Bei Winterkälte (-15°C) verhält sich Asphalt spröde und elastisch. Bei Hitze (>40°C) wird er plastisch-weich und fließt viskös.',
                  example: 'Im Winter fängt der Asphalt Erschütterungen elastisch ab, neigt aber bei Frost zu Kälterissen. Im warmen Sommer verformt sich der Fahrbahnbelag durch stehende Lastschwerpunkte plastisch dauerhaft zu Spurrinnen.',
                  norm: 'Asphaltmischgut nach DIN EN 13108 mit TL Asphalt-StB; Schichtdicken nach RStO.',
                  test: 'Spurbildungsversuch im Wasserbad/Luft zur Bestimmung der Verformungsbeständigkeit am Spurbildungsgerät nach DIN EN 12697-22.'
                }
              }[selectedMaterial];

              return (
                <div className="p-5 sm:p-6 bg-slate-50 border border-home-grau/30 rounded-2xl flex flex-col gap-5 animate-fade-in" id="material-profile-card">
                  <div className="border-b border-home-grau/30 pb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Ausgewählter Baustoff-Steckbrief:</span>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-800">{spec.name}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 italic">{spec.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Richtungsabhängigkeit */}
                    <div className="bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Richtungsabhängigkeit</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${spec.isotropyBadge}`}>{spec.isotropy}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans">{spec.isotropyDesc}</p>
                      </div>
                    </div>

                    {/* Homogenitätsgrad */}
                    <div className="bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Gefügestruktur</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${spec.homogeneityBadge}`}>{spec.homogeneity}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans">{spec.homogeneityDesc}</p>
                      </div>
                    </div>

                    {/* Rheologische Einordnung */}
                    <div className="bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Verformungsverhalten</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${spec.rheologyBadge}`}>{spec.rheology}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans">{spec.rheologyDesc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Praktisches Beispiel & Wissenschaftliche Prüfung */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-home-grau/30 text-xs">
                    <div className="space-y-1 bg-white/70 p-3.5 rounded-xl border border-home-grau/30">
                      <strong className="text-slate-800 flex items-center gap-1.5">💡 Praxisbeispiel im Tragwerkskontext:</strong>
                      <p className="text-slate-600 leading-relaxed">{spec.example}</p>
                    </div>
                    <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-home-grau/30">
                      <div>
                        <strong className="text-slate-800 flex items-center gap-1.5">📋 Zugelassenes Prüfverfahren:</strong>
                        <p className="text-slate-600 leading-relaxed text-[11px] mt-0.5">{spec.test}</p>
                      </div>
                      <div className="pt-1.5 border-t border-home-grau/30 text-[10.5px]">
                        <span className="font-bold text-slate-700">Normatives Regelwerk:</span> <span className="text-slate-600 font-mono">{spec.norm}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Sektion 2: Wissenschaftliche Theorie-DeepDives */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            
            {/* Box 1: Isotropie vs. Anisotropie */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between" id="card-isotropie-anisotropie">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
                  <span className="p-1 bg-sky-50 text-sky-600 rounded-md text-xs">A / I</span> Isotropie vs. Anisotropie (Richtungsverhalten)
                </h3>
                <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
                  Die <strong>Isotropie</strong> (griechisch <i>isos</i> „gleich“ und <i>tropos</i> „Richtung“) besagt, dass die werkstofflichen Kennwerte (Festigkeiten, Wärmeleitfähigkeiten, Verformungen) richtungsunabhängig sind.
                </p>
                <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
                  Die <strong>Anisotropie</strong> beschreibt das direkte Gegenteil: Die Kennwerte hängen signifikant von der Beanspruchungsrichtung ab. Holz ist hierbei ein klassisches orthotropes System mit ausgeprägter Längs- (Faser), Radial- und Tangentialausrichtung.
                </p>

                {/* Ein kleiner schematischer SVG-Visualizer */}
                <div className="bg-slate-50 text-slate-800 p-4 rounded-xl space-y-3 font-sans text-xs border border-home-grau/30">
                  <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Grafisches Richtungs-Schema:</span>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="border border-home-grau/30 p-2.5 rounded-lg bg-white shadow-sm space-y-2">
                      <span className="font-bold text-emerald-700">Isotrop (z. B. Stahl)</span>
                      <div className="flex justify-center py-2">
                        <svg className="w-16 h-16" viewBox="0 0 100 100">
                          {/* Circle indicating same properties in all angles */}
                          <circle cx="50" cy="50" r="30" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
                          <circle cx="50" cy="50" r="2" fill="#334155" />
                          <path d="M50,10 L50,90 M10,50 L90,50 M22,22 L78,78 M22,78 L78,22" stroke="#cbd5e1" strokeWidth="1" />
                          {/* Arrows representing equal forces */}
                          <path d="M50,20 L50,15 M50,80 L50,85 M20,50 L15,50 M80,50 L85,50" stroke="#334155" strokeWidth="2" markerEnd="arrow" />
                        </svg>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">E-Modul <InlineMath math="E_x \equiv E_y \equiv E_z" /></p>
                    </div>

                    <div className="border border-home-grau/30 p-2.5 rounded-lg bg-white shadow-sm space-y-2">
                      <span className="font-bold text-rose-700">Anisotrop (z. B. Holz)</span>
                      <div className="flex justify-center py-2">
                        <svg className="w-16 h-16" viewBox="0 0 100 100">
                          {/* Ellipse indicating directionality */}
                          <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="#A3113E" strokeWidth="2" strokeDasharray="3 3" transform="rotate(-30 50 50)" />
                          <circle cx="50" cy="50" r="2" fill="#A3113E" />
                          {/* Fiber direction lines */}
                          <path d="M10,25 L90,65 M15,35 L95,75 M5,15 L85,55" stroke="#A3113E" strokeWidth="1.5" strokeOpacity="0.4" />
                          <path d="M30,35 L70,55" stroke="#A3113E" strokeWidth="2.5" />
                        </svg>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">E-Modul <InlineMath math="E_{||} \gg E_{\perp}" /></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600 mt-5">
                <p><strong>Zentrales Prüfverfahren:</strong> Nachweis der richtungsabhängigen Festigkeiten nach <strong>DIN EN 408</strong> (Druck- und Biegeprüfungen parallel und senkrecht zur Hauptfaserrichtung).</p>
                <p><strong>Praxisrelevanz:</strong> Bauteile aus Brettschichtholz (BSH) müssen an Tragknoten so angeordnet werden, dass keine unzulässigen Querzugspannungen senkrecht zur Faser entstehen, da Holz dort kaum Last abtragen kann.</p>
              </div>
            </div>

            {/* Box 2: Homogenität vs. Heterogenität */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between" id="card-homogenitaet-heterogenitaet">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
                  <span className="p-1 bg-amber-50 text-amber-600 rounded-md text-xs">H / H</span> Homogenität vs. Heterogenität (Struktur)
                </h3>
                <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
                  Ein Werkstoff ist <strong>homogen</strong> (griechisch <i>homogenēs</i> „gleichartig“), wenn seine stoffliche Zusammensetzung und alle Materialkennwerte an jedem beliebigen Ort des Bauteils vollkommen identisch sind. Ein idealer Einkristall oder reiner Kohlenstoffstahl erfüllt diese Anforderung auf makroskopischer Ebene.
                </p>
                <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
                  Ein <strong>heterogener</strong> Baustoff besitzt eine ungleichmäßige Phasen- oder stoffliche Verteilung. Gesteine, Beton oder Verbundwerkstoffe weisen extreme mikro- und makroskopische Heterogenitäten aus Matrix, Poren und Aggregaten auf. Die Kennwerte hängen herkunftsmäßig stark vom untersuchten Volumen ab (REV-Prinzip).
                </p>

                {/* Homogeneity Illustration */}
                <div className="bg-slate-50 text-slate-800 p-4 rounded-xl space-y-3 font-sans text-xs border border-home-grau/30">
                  <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Gefüge-Phasen-Schema:</span>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="border border-home-grau/30 p-2.5 rounded-lg bg-white shadow-sm space-y-2">
                      <span className="font-bold text-emerald-700">Homogen Gefüge (z. B. Glas)</span>
                      <div className="flex justify-center py-2">
                        <svg className="w-16 h-16" viewBox="0 0 100 100">
                          {/* Smooth evenly-spaced small dots representing molecules */}
                          <rect x="15" y="15" width="70" height="70" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                          <g fill="#334155" opacity="0.8">
                            <circle cx="25" cy="25" r="2" /><circle cx="35" cy="25" r="2" /><circle cx="45" cy="25" r="2" /><circle cx="55" cy="25" r="2" /><circle cx="65" cy="25" r="2" /><circle cx="75" cy="25" r="2" />
                            <circle cx="25" cy="40" r="2" /><circle cx="35" cy="40" r="2" /><circle cx="45" cy="40" r="2" /><circle cx="55" cy="40" r="2" /><circle cx="65" cy="40" r="2" /><circle cx="75" cy="40" r="2" />
                            <circle cx="25" cy="55" r="2" /><circle cx="35" cy="55" r="2" /><circle cx="45" cy="55" r="2" /><circle cx="55" cy="55" r="2" /><circle cx="65" cy="55" r="2" /><circle cx="75" cy="55" r="2" />
                            <circle cx="25" cy="70" r="2" /><circle cx="35" cy="70" r="2" /><circle cx="45" cy="70" r="2" /><circle cx="55" cy="70" r="2" /><circle cx="65" cy="70" r="2" /><circle cx="75" cy="70" r="2" />
                          </g>
                        </svg>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">Phasenreinheit, konstante Werkstoffdichte <InlineMath math="\rho(x,y,z) = C" /></p>
                    </div>

                    <div className="border border-home-grau/30 p-2.5 rounded-lg bg-white shadow-sm space-y-2">
                      <span className="font-bold text-rose-700">Heterogen Gefüge (z. B. Beton)</span>
                      <div className="flex justify-center py-2">
                        <svg className="w-16 h-16" viewBox="0 0 100 100">
                          {/* Multi-phase structure with various particle sizes and pores */}
                          <rect x="15" y="15" width="70" height="70" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                          {/* Stone Aggregates */}
                          <polygon points="25,30 40,22 45,35 30,38" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                          <polygon points="55,50 70,45 75,60 60,65" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                          <circle cx="25" cy="65" r="8" fill="#cbd5e1" />
                          {/* Pores */}
                          <circle cx="50" cy="25" r="3" fill="#A3113E" stroke="#A3113E" strokeWidth="0.5" />
                          <circle cx="40" cy="55" r="4.5" fill="#A3113E" stroke="#A3113E" strokeWidth="0.5" />
                          <circle cx="72" cy="28" r="2" fill="#A3113E" />
                          {/* Mortar matrix */}
                          <path d="M15,15 L85,85" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 2" />
                        </svg>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">Mehrphasig (Korn matrix, Zementleim &amp; Poren)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600 mt-5">
                <p><strong>Bauseitige Konsequenz:</strong> Zur statistischen Absicherung heterogener Verbundbaustoffe regelt die <strong>DIN EN 206</strong> weitreichende Konformitätskriterien für Betonprüfergebnisse via Standardabweichungen.</p>
                <p><strong>Wichtig für Rechenverfahren:</strong> In Rechenmodellen wird das heterogene Gefüge zur Vereinfachung näherungsweise verschmiert homogenisiert modelliert (effektive Medienberechnung).</p>
              </div>
            </div>

          </div>

          {/* Sektion 3: Elastizität, Plastizität & Fließverhalten */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <span className="p-1 bg-red-50 text-red-650 rounded-md text-xs">R</span> Rheologisches Dehnverhalten &amp; Viskositäten
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 text-shiraz">1. Elastizität</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Beschreibt die Eigenschaft eines Materials, sich unter Belastung zu verformen und nach Entlastung <strong>vollständig und unverzögert</strong> in seine ursprüngliche geometrische Ausgangslage zurückzukehren.
                  </p>
                </div>
                <div className="font-mono text-[10px] bg-white p-2 border border-home-grau/30 rounded mt-3 text-slate-500">
                  Hookesches Gesetz:<br />
                  <InlineMath math="\sigma = E \cdot \varepsilon" /> (linear-elastisch)<br />
                  Beispiel: Federstahl, Glas
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 text-shiraz">2. Plastizität</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Beschreibt die Fähigkeit, nach Überschreiten einer materialabhängigen Grenzspannung (Fließ- oder Dehngrenze) irreversible, <strong>bleibende Verformungen</strong> ohne Rissbildung oder Sprödbruch zu erfahren.
                  </p>
                </div>
                <div className="font-mono text-[10px] bg-white p-2 border border-home-grau/30 rounded mt-3 text-slate-500">
                  Fließkriterium:<br />
                  <InlineMath math="\sigma \ge f_y" /> (bleibende Verformung)<br />
                  Beispiel: Kaltgeformter Bewehrungsstahl
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 text-shiraz">3. Viskoelastizität</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Eine temperatur- und zeitabhängige Kombination aus elastischem Federungsverhalten und viskosem, trägem Fließen. Sie verursacht <strong>Kriechen</strong> unter konstanter Last und <strong>Relaxation</strong> unter konstanter Verformung. (Schwinden ist dagegen ein lastunabhängiger, hygrischer Vorgang.)
                  </p>
                </div>
                <div className="font-mono text-[10px] bg-white p-2 border border-home-grau/30 rounded mt-3 text-slate-500">
                  Kriechverformung (Zementstein):<br />
                  <InlineMath math="\varepsilon(t) = \varepsilon_{el} \cdot (1 + \varphi(t))" /><br />
                  Beispiel: Bitumenbindemittel, PMMA
                </div>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600">
              <span className="font-bold text-slate-800">Prüfverfahren der Elastizität / Plastizität:</span>
              <p className="leading-relaxed">
                Bestimmung der Elastizitätsmoduln über statische Spannungs-Dehnungs-Kurven im zerstörenden Einaxial-Zugversuch (nach DIN EN ISO 6892-1) oder zerstörungsfreie akustische Eignungsprüfungen (Eigenfrequenzverfahren). Das Fließverhalten wird bei Fluiden mit Rotationsviskosimetern (nach DIN EN ISO 3219) charakterisiert.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mechanisch' && (
        <div className="w-full animate-fade-in">
          <Elastomechanik embedMode={true} />
        </div>
      )}

      {activeTab === 'zeitlich' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-fade-in">
          {/* Spalte 1: Theorie & Parameter */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
                <Clock className="text-shiraz" size={18} /> Zeitabhängiges Werkstoffverhalten
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Viele Baustoffe – allen voran <strong>Beton, Holz und Kunststoffe</strong> (viskoelastische Materialien) – zeigen signifikante Verformungsänderungen über die Zeit, selbst wenn die Last absolut konstant bleibt. Man unterscheidet drei wesentliche physikalische Phänomene:
              </p>

              <div className="space-y-4 pt-2">
                {/* Kriechen Card */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px] uppercase tracking-wider">1. Kriechen (Creep)</span>
                  <p className="text-xs text-text-main/80 mt-1.5 leading-relaxed">
                    Kontinuierliche Zunahme der viskosen Dehnung unter einer <strong>konstanten langanhaltenden mechanischen Spannung (<InlineMath math="\sigma_0" />)</strong>.
                  </p>
                  <div className="mt-2 bg-white px-3 py-1.5 rounded border border-home-grau/30 text-center">
                    <BlockMath math="\varepsilon_{cr}(t) = \varepsilon_{el} \cdot \phi(t) = \frac{\sigma_0}{E} \cdot \phi(t)" />
                  </div>
                  <div className="mt-2 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100/40 text-[10px] text-slate-700 leading-relaxed text-left">
                    <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                    Dauerlastspannung <InlineMath math="\sigma_0 = 10 \text{ MPa}" />, E-Modul <InlineMath math="E = 30.000 \text{ MPa}" /> (elastische Dehnung <InlineMath math="\varepsilon_{el} = 0{,}33 \ \text{‰}" />) und Endkriechbeiwert <InlineMath math="\phi = 2{,}0" />.
                    <div className="font-mono mt-1 bg-white/80 p-1 rounded border border-indigo-100/30 text-slate-900">
                      &epsilon;_cr = (10 / 30.000) · 2,0 = 0,000333 · 2,0 = 0,000667 (0,67 &permil;)
                    </div>
                  </div>
                </div>

                {/* Schwinden Card */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px] uppercase tracking-wider">2. Schwinden (Shrinkage)</span>
                  <p className="text-xs text-text-main/80 mt-1.5 leading-relaxed">
                    Volumenminderung über die Zeit <strong>ohne jegliche äußere Krafteinwirkung</strong> (rein hygrisch durch Wasserabgabe aus Kapillaren und Poren).
                  </p>
                  <div className="mt-2 bg-white px-3 py-1.5 rounded border border-home-grau/30 text-center">
                    <BlockMath math="\varepsilon_{cs}(t) = \varepsilon_{cs,\infty} \cdot \beta_{ds}(t)" />
                  </div>
                  <div className="mt-2 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100/40 text-[10px] text-slate-700 leading-relaxed text-left">
                    <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                    Endschwindmaß <InlineMath math="\varepsilon_{cs,\infty} = -0{,}5 \ \text{‰}" /> und zeitabhängiger Beiwert <InlineMath math="\beta_{ds}(t) = 0{,}6" /> (nach ca. 100 Tagen).
                    <div className="font-mono mt-1 bg-white/80 p-1 rounded border border-indigo-100/30 text-slate-900">
                      &epsilon;_cs = -0,5 &permil; · 0,6 = -0,30 &permil;
                    </div>
                  </div>
                </div>

                {/* Relaxation Card */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold text-[10px] uppercase tracking-wider">3. Relaxation</span>
                  <p className="text-xs text-text-main/80 mt-1.5 leading-relaxed">
                    Kontinuierlicher <strong>Spannungsabfall</strong> über die Zeit bei einer <strong>erzwungenen, absolut konstanten Dehnung</strong> (ein Teil der elastischen Dehnung wird durch Kriechvorgänge in bleibende Verformung umgewandelt).
                  </p>
                  <div className="mt-2 bg-white px-3 py-1.5 rounded border border-home-grau/30 text-center">
                    <BlockMath math="\sigma(t) = \sigma_0 \cdot [1 - \psi(t)]" />
                  </div>
                  <div className="mt-2 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100/40 text-[10px] text-slate-700 leading-relaxed text-left">
                    <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                    Anfangsspannung <InlineMath math="\sigma_0 = 20 \text{ MPa}" /> und Spannungsabfallbeiwert (Relaxationsgrad) <InlineMath math="\psi = 0{,}15" /> (15 %).
                    <div className="font-mono mt-1 bg-white/80 p-1 rounded border border-indigo-100/30 text-slate-900">
                      σ(t) = 20 MPa · (1 - 0,15) = 20 · 0,85 = 17,0 MPa
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interaktive Parameterregelungen */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-md font-bold text-text-main border-b border-home-grau/30 pb-2">Interaktives Simulationslabor</h3>
              <p className="text-[11px] text-slate-500">Lehrmodell mit vereinfachten Zeitfunktionen β(t) = t/(t + 30) für Kriechen und Relaxation sowie t/(t + 150) für Schwinden. Die genauen Funktionen nach DIN EN 1992-1-1, Anhang B, hängen zusätzlich von wirksamer Bauteildicke, Luftfeuchte, Zementart und Belastungsalter ab.</p>
              
              <div className="space-y-4">
                <Slider 
                  label="Dauerlastspannung (σ₀)" 
                  min={1} 
                  max={30} 
                  step={0.5} 
                  value={zeitlichSigma0} 
                  unit="MPa" 
                  onChange={(e) => setZeitlichSigma0(Number(e.target.value))} 
                />
                <Slider 
                  label="Elastizitätsmodul (E-Modul)" 
                  min={5000} 
                  max={210000} 
                  step={1000} 
                  value={zeitlichE} 
                  unit="MPa" 
                  onChange={(e) => setZeitlichE(Number(e.target.value))} 
                />
                <Slider 
                  label="Endkriechbeiwert (φ_inf)" 
                  min={0.5} 
                  max={4.5} 
                  step={0.1} 
                  value={zeitlichPhi} 
                  unit="" 
                  onChange={(e) => setZeitlichPhi(Number(e.target.value))} 
                />
                <Slider 
                  label="Endschwindmaß (ε_cs,inf)" 
                  min={-1.5} 
                  max={0.0} 
                  step={0.05} 
                  value={zeitlichSchwindenInf} 
                  unit="‰" 
                  onChange={(e) => setZeitlichSchwindenInf(Number(e.target.value))} 
                />
                <Slider 
                  label="Endrelaxation (ψ_inf)" 
                  min={0} 
                  max={30} 
                  step={1} 
                  value={zeitlichRelaxationInf} 
                  unit="%" 
                  onChange={(e) => setZeitlichRelaxationInf(Number(e.target.value))} 
                />
                <Slider 
                  label="Beobachtungszeitpunkt (t)" 
                  min={0} 
                  max={1080} 
                  step={5} 
                  value={zeitlichT} 
                  unit="Tage (d)" 
                  onChange={(e) => setZeitlichT(Number(e.target.value))} 
                />
              </div>
            </div>
          </div>

          {/* Spalte 2: Echtzeit-Diagramme & Kennwerte */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Echtzeit-Berechnungsprotokoll für t = {formatDeWert(zeitlichT)} d</h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-home-grau/30">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Elastische Erstdehnung</span>
                  <span className="text-md font-extrabold text-slate-700 block mt-1">{formatDeZahl(currentTimed.eps_el, 3)} ‰</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">(elastischer Initialwert bei Belastung)</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] text-amber-600 font-bold block uppercase">Kriechbeiwert φ(t)</span>
                  <span className="text-md font-extrabold text-amber-700 block mt-1">{formatDeZahl(currentTimed.phi_t, 2)}</span>
                  <span className="text-[9px] text-amber-500 mt-0.5 block">(Endwert war: {formatDeZahl(zeitlichPhi, 1)})</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] text-amber-600 font-bold block uppercase">Kriechdehnung ε_cr(t)</span>
                  <span className="text-md font-extrabold text-amber-700 block mt-1">{formatDeZahl(currentTimed.eps_cr, 3)} ‰</span>
                  <span className="text-[9px] text-amber-500 mt-0.5 block">({formatDeZahl((currentTimed.phi_t * 100), 0)}% der Erstdehnung)</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] text-blue-600 font-bold block uppercase">Schwinddehnung ε_cs(t)</span>
                  <span className="text-md font-extrabold text-blue-700 block mt-1">{formatDeZahl(currentTimed.eps_cs, 3)} ‰</span>
                  <span className="text-[9px] text-blue-500 mt-0.5 block">(Schrumpfung ohne Last)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-rose-600 font-bold block uppercase">Summenverformung ε_total(t)</span>
                  <span className="text-[9px] text-rose-500 mt-0.5 block">ε_gesamt = ε_el + ε_cr + ε_cs</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-shiraz">{formatDeZahl(currentTimed.eps_total, 3)} ‰</span>
                  <span className="text-[10px] text-rose-600 font-bold block">Gesamtdehnung</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-indigo-600 font-bold block uppercase">Spannungsabfall durch Relaxation σ(t)</span>
                  <span className="text-[9px] text-indigo-500 mt-0.5 block">ausgehend von σ₀ = {formatDeWert(zeitlichSigma0)} MPa</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-indigo-700">{formatDeZahl(currentTimed.sigma_t, 2)} MPa</span>
                  <span className="text-[10px] text-indigo-600 font-bold block">Restspannung</span>
                </div>
              </div>
            </div>

            {/* Diagrams section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
              <div>
                <h4 className="font-bold text-sm text-text-main mb-1">Dehnungsentwicklung (Kriechen &amp; Schwinden)</h4>
                <p className="text-[11px] text-slate-400">Zeigt das zeitliche Dehnungsverhalten unter Last sowie das reine lastfreie Schwinden (Schrumpfung).</p>
                <div className="h-48 w-full mt-3">
                  <Line 
                    data={dehnungenChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { title: { display: true, text: 'Dehnung (‰)', font: { size: 10 } } },
                        x: { title: { display: true, text: 'Beobachtungszeit d', font: { size: 10 } } }
                      },
                      plugins: { legend: { display: true, labels: { boxWidth: 12, font: { size: 9 } } } }
                    }} 
                  />
                </div>
              </div>

              <hr className="border-home-grau/30" />

              <div>
                <h4 className="font-bold text-sm text-text-main mb-1">Spannungsabbau durch Relaxation im Zwangzustand</h4>
                <p className="text-[11px] text-slate-400">Zeigt den kontinuierlichen Abbau einer mechanischen Spannung über die Zeit bei festgehaltener Länge.</p>
                <div className="h-44 w-full mt-3">
                  <Line 
                    data={relaxationChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { title: { display: true, text: 'Restspannung (MPa)', font: { size: 10 } } },
                        x: { title: { display: true, text: 'Beobachtungszeit d', font: { size: 10 } } }
                      },
                      plugins: { legend: { display: false } }
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rechenbeispiele' && (
        <div className="flex flex-col gap-6 w-full animate-fade-in" id="rechenbeispiele-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Spalte 1: Eingabeparameter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 lg:col-span-1">
              <h3 className="text-md font-bold text-text-main border-b border-home-grau/30 pb-2">Eingabeparameter (Säule)</h3>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Material Preset</label>
                <select 
                  className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz text-xs font-semibold"
                  value={saeulenMaterial}
                  onChange={(e) => handleSaeulenMaterialChange(e.target.value as any)}
                >
                  <option value="beton">Beton (z.B. C30/37)</option>
                  <option value="stahl">Baustahl S235</option>
                  <option value="alu">Aluminium EN AW</option>
                  <option value="holz">Nadelholz C24</option>
                  <option value="custom">Spezifisch / Benutzerdefiniert</option>
                </select>
              </div>

              <Slider label="Belastung (F)" min={50} max={2000} step={50} value={saeulenF} unit="kN" onChange={(e) => setSaeulenF(Number(e.target.value))} />
              
              <Slider label="Querschnittsfläche (A)" min={10} max={2500} step={10} value={saeulenA} unit="cm²" onChange={(e) => setSaeulenA(Number(e.target.value))} />
              
              <Slider label="Säulenhöhe (l₀)" min={1.0} max={15.0} step={0.5} value={saeulenL0} unit="m" onChange={(e) => setSaeulenL0(Number(e.target.value))} />
              
              {saeulenMaterial === 'custom' && (
                <>
                  <Slider label="E-Modul (E)" min={1000} max={250000} step={1000} value={saeulenE} unit="MPa" onChange={(e) => setSaeulenE(Number(e.target.value))} />
                  <Slider label="Grenzfestigkeit (f_k)" min={5} max={500} step={5} value={saeulenFy} unit="MPa" onChange={(e) => setSaeulenFy(Number(e.target.value))} />
                </>
              )}
              
              {saeulenMaterial !== 'custom' && (
                <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/30 text-xs">
                  <p className="font-semibold text-slate-700">Festgelegte Materialempfehlungen:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600">
                    <li>E-Modul: <strong>{saeulenE.toLocaleString('de-DE')} MPa</strong></li>
                    <li>Druckfestigkeit (<InlineMath math="f_{crit}" />): <strong>{saeulenFy.toLocaleString('de-DE')} MPa</strong></li>
                  </ul>
                  <p className="mt-2 text-[11px] text-slate-500">Charakteristische Werte ohne Teilsicherheitsbeiwerte und ohne Knicknachweis – das Beispiel zeigt nur den Zusammenhang σ = F/A und ε = σ/E. Bemessung siehe Module Eurocode und Knicken.</p>
                </div>
              )}
            </div>

            {/* Spalte 2 & 3: Berechnungen & Ergebnisse */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 lg:col-span-2">
              <h3 className="text-md font-bold text-text-main border-b border-home-grau/30 pb-2">Berechnung & Physikalische Auswertung</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Spannung */}
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">1. Normalspannung (<InlineMath math="\sigma" />)</span>
                  <InlineMath math="\sigma = \frac{F}{A}" />
                  <div className="mt-3">
                    <span className="text-[11px] text-slate-500 block">Rechnung:</span>
                    <code className="text-xs text-shiraz font-bold block bg-white p-2 rounded border border-home-grau/30 mt-1 flex flex-col">
                      <span>({formatDeWert(saeulenF)} * 10³) N / ({formatDeWert(saeulenA)} * 100) mm²</span>
                      <span className="text-shiraz font-black text-sm mt-0.5">= {formatDeZahl(stressA, 2)} MPa</span>
                    </code>
                  </div>
                </div>

                {/* Dehnung */}
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">2. Elastische Dehnung (<InlineMath math="\varepsilon" />)</span>
                  <InlineMath math="\varepsilon = \frac{\sigma}{E}" />
                  <div className="mt-3">
                    <span className="text-[11px] text-slate-500 block">Rechnung:</span>
                    <code className="text-xs text-shiraz font-bold block bg-white p-2 rounded border border-home-grau/30 mt-1 flex flex-col">
                      <span>{formatDeZahl(stressA, 2)} MPa / {saeulenE.toLocaleString('de-DE')} MPa</span>
                      <span className="text-shiraz font-black text-sm mt-0.5">= {formatDeZahl(strainA, 6)} ({formatDeZahl(strainAPromille, 3)} ‰)</span>
                    </code>
                  </div>
                </div>

                {/* Verkürzung */}
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">3. Gesamte Verkürzung (<InlineMath math="\Delta l" />)</span>
                  <InlineMath math="\Delta l = \varepsilon \cdot l_0" />
                  <div className="mt-3">
                    <span className="text-[11px] text-slate-500 block">Rechnung:</span>
                    <code className="text-xs text-shiraz font-bold block bg-white p-2 rounded border border-home-grau/30 mt-1 flex flex-col">
                      <span>{formatDeZahl(strainA, 6)} * {formatDeWert(saeulenL0 * 1000)} mm</span>
                      <span className="text-shiraz font-black text-sm mt-0.5">= {formatDeZahl(deltaLA, 3)} mm</span>
                    </code>
                  </div>
                </div>

                {/* Ausnutzung */}
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">4. Auslastungsgrad (<InlineMath math="\eta" />)</span>
                  <InlineMath math="\eta = \frac{\sigma}{f_{crit}} \cdot 100" />
                  <div className="mt-3">
                    <span className="text-[11px] text-slate-500 block">Rechnung:</span>
                    <code className="text-xs font-bold block bg-white p-2 rounded border border-home-grau/30 mt-1 flex flex-col" style={{ color: utilizationA > 100 ? '#A3113E' : '#475569' }}>
                      <span>({formatDeZahl(stressA, 2)} / {formatDeWert(saeulenFy)}) * 100</span>
                      <span className="font-black text-sm mt-0.5">= {formatDeZahl(utilizationA, 1)} %</span>
                    </code>
                  </div>
                </div>
              </div>

              {/* Grafische Zusammenfassung & Status */}
              <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center gap-4 justify-between mt-2 ${
                utilizationA > 100 ? 'bg-rose-50 border-rose-300' : 'bg-emerald-50 border-emerald-300'
              }`}>
                <div className="text-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    Tragfähigkeitsprüfung: {utilizationA > 100 ? 'Versagen ❌' : 'Tragfähig ✓'}
                  </h4>
                  <p className="text-slate-600 mt-1">
                    {utilizationA > 100 
                      ? `Die Beanspruchung überschreitet die materialspezifische Druckfestigkeit von ${formatDeWert(saeulenFy)} MPa. Vergrößern Sie die Säulenfläche oder verringern Sie die Tragkraft.` 
                      : `Die Säule trägt die Belastung problemlos im elastisch-sicheren Beanspruchungsbereich.`}
                  </p>
                </div>
                <div className="shrink-0 text-center w-full md:w-auto">
                  <div className="text-3xl font-extrabold text-slate-800">{formatDeZahl(utilizationA, 0)}%</div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Ausnutzungsgrad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'physikalisch' && (
        <div className="flex flex-col gap-6 w-full animate-fade-in" id="physikalisch-tab-container">
          {/* Sektion 1: Dichtearten im Gefügevergleich */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-3 flex items-center gap-2">
              <Scale className="text-shiraz" size={20} /> Gefügeabhängige Dichtebestimmung im Vergleich
            </h3>
            
            <p className="text-xs sm:text-sm text-text-main/80 mt-3 mb-6 leading-relaxed">
              Im Bauwesen ist Dichte nicht gleich Dichte. Je nachdem, ob Hohlräume im Baustoffinneren (Poren) oder Zwickelräume zwischen Baustoffkörnern (Haufwerk) mitgewogen werden, unterscheidet man drei grundlegende Dichtebegriffe.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Reindichte */}
              <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 shadow-inner mb-4 flex justify-center">
                    <svg viewBox="0 0 120 120" className="w-24 h-24">
                      <rect x="10" y="10" width="100" height="100" rx="8" fill="#475569" />
                      <g opacity="0.3">
                        <circle cx="25" cy="25" r="4" fill="#ffffff" />
                        <circle cx="45" cy="25" r="4" fill="#ffffff" />
                        <circle cx="65" cy="25" r="4" fill="#ffffff" />
                        <circle cx="85" cy="25" r="4" fill="#ffffff" />
                        <circle cx="25" cy="45" r="4" fill="#ffffff" />
                        <circle cx="45" cy="45" r="4" fill="#ffffff" />
                        <circle cx="65" cy="45" r="4" fill="#ffffff" />
                        <circle cx="85" cy="45" r="4" fill="#ffffff" />
                        <circle cx="25" cy="65" r="4" fill="#ffffff" />
                        <circle cx="45" cy="65" r="4" fill="#ffffff" />
                        <circle cx="65" cy="65" r="4" fill="#ffffff" />
                        <circle cx="85" cy="65" r="4" fill="#ffffff" />
                        <circle cx="25" cy="85" r="4" fill="#ffffff" />
                        <circle cx="45" cy="85" r="4" fill="#ffffff" />
                        <circle cx="65" cy="85" r="4" fill="#ffffff" />
                        <circle cx="85" cy="85" r="4" fill="#ffffff" />
                      </g>
                      <text x="60" y="64" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">100% Feststoff</text>
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">1. Reindichte (<InlineMath math="\rho_R" />)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[64px]">
                    Die Reindichte bezieht sich ausschließlich auf das Netto-Volumen der reinen, absolut porenfreien Festsubstanz. Es wird chemisch-physikalisch durch Zermahlen bestimmt.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/30">
                  <BlockMath math="\rho_R = \frac{m}{V_{Fest}}" />
                  <div className="mt-2 mb-2 p-2 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal">
                    <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                    Ziegelmehl: <InlineMath math="m = 26{,}5\text{ g}" />, <InlineMath math="V_{Fest} = 10\text{ cm}^3" />.
                    <div className="font-mono mt-0.5 text-slate-800">&rho;_R = 26,5 g / 10 cm³ = 2,65 g/cm³ (2650 kg/m³)</div>
                  </div>
                  <span className="text-[10px] text-slate-400 block text-center mt-1">Prüfverfahren: Helium-Pyknometrie / DIN 51057</span>
                </div>
              </div>

              {/* Card 2: Rohdichte */}
              <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 shadow-inner mb-4 flex justify-center relative">
                    <svg viewBox="0 0 120 120" className="w-24 h-24">
                      <rect x="8" y="8" width="104" height="104" rx="10" fill="transparent" stroke="#94a3b8" strokeDasharray="4,4" strokeWidth="1.5" />
                      <rect x="10" y="10" width="100" height="100" rx="8" fill="#64748b" />
                      <circle cx="35" cy="28" r="7" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                      <circle cx="50" cy="74" r="10" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                      <circle cx="82" cy="35" r="11" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                      <circle cx="85" cy="78" r="6" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                      <circle cx="32" cy="82" r="5" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                      <path d="M 10 50 Q 25 50 25 55 Q 25 60 10 60 Z" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">2. Rohdichte (<InlineMath math="\rho" />)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[64px]">
                    Die Rohdichte (Scherben- bzw. Steinrohdichte) beschreibt das Verhältnis der Masse zum äußeren Hüllvolumen des Festkörpers, also inklusive aller eingebetteten Poren und Risse.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/30">
                  <BlockMath math="\rho = \frac{m}{V_{H\ddot{u}ll}}" />
                  <div className="mt-2 mb-2 p-2 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal">
                    <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                    Ziegelstein: <InlineMath math="m = 3{,}6\text{ kg}" />, <InlineMath math="V_{Hüll} = 2\text{ dm}^3\ (0{,}002\text{ m}^3)" />.
                    <div className="font-mono mt-0.5 text-slate-800">&rho; = 3,6 kg / 0,002 m³ = 1800 kg/m³</div>
                  </div>
                  <span className="text-[10px] text-slate-400 block text-center mt-1">Prüfverfahren: Wägung und Volumen über Ausmessen oder Unterwasserwägung (z. B. DIN EN 1936, DIN EN 772-13)</span>
                </div>
              </div>

              {/* Card 3: Schüttdichte */}
              <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 shadow-inner mb-4 flex justify-center">
                    <svg viewBox="0 0 120 120" className="w-24 h-24">
                      <path d="M 15 15 L 15 110 L 105 110 L 105 15" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                      <g stroke="#334155" strokeWidth="1" fill="#94a3b8">
                        <circle cx="35" cy="95" r="12" />
                        <circle cx="62" cy="93" r="13" />
                        <circle cx="85" cy="95" r="11" />
                        <circle cx="45" cy="75" r="10" />
                        <circle cx="75" cy="74" r="12" />
                        <circle cx="30" cy="55" r="11" />
                        <circle cx="58" cy="54" r="12" />
                        <circle cx="88" cy="58" r="10" />
                      </g>
                      <g fill="#ffffff" opacity="0.4">
                        <circle cx="35" cy="95" r="1.5" />
                        <circle cx="62" cy="93" r="2" />
                        <circle cx="85" cy="95" r="1.5" />
                        <circle cx="45" cy="75" r="1.5" />
                        <circle cx="75" cy="74" r="2" />
                        <circle cx="58" cy="54" r="1.5" />
                      </g>
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">3. Schüttdichte (<InlineMath math="\rho_S" />)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[64px]">
                    Die Schüttdichte gilt für lose Haufwerke (Sande, Kiese, Körnungen). Das Volumen umfasst hier sowohl das Feststoffvolumen, die Kornporen als auch die weiten Zwickelräume dazwischen.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/30">
                  <BlockMath math="\rho_S = \frac{m}{V_{Sch\ddot{u}tt}}" />
                  <div className="mt-2 mb-2 p-2 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal">
                    <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                    Splitschüttung: <InlineMath math="m = 11\text{ kg}" />, <InlineMath math="V_{Schütt} = 10\text{ Liter}\ (0{,}01\text{ m}^3)" />.
                    <div className="font-mono mt-0.5 text-slate-800">&rho;_S = 11 kg / 0,01 m³ = 1100 kg/m³</div>
                  </div>
                  <span className="text-[10px] text-slate-400 block text-center mt-1">Prüfverfahren: Messzylindermessung / DIN EN 1097-3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sektion 2: Interaktiver Gefügerechner & Porigkeitssimulator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel 1: Controls */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 lg:col-span-1">
              <h3 className="text-md font-bold text-text-main border-b border-home-grau/30 pb-2">Materialkonfiguration</h3>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Werkstoff-Gefügetyp</label>
                <select 
                  className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz text-xs font-semibold"
                  value={selectedDichtePreset}
                  onChange={(e) => handleDichtePresetChange(e.target.value as any)}
                >
                  <option value="ziegel">Ziegelton (Poröse Keramik)</option>
                  <option value="blaehton">Blähton (Zellulär hochporös)</option>
                  <option value="granit">Granitschotter (Kompaktgestein)</option>
                  <option value="porenbeton">Porenbeton (Aufgeschäumtes Mineral)</option>
                  <option value="custom">Benutzerdefiniert / Custom</option>
                </select>
              </div>

              {selectedDichtePreset === 'custom' ? (
                <div className="space-y-4 mt-2">
                  <Slider 
                    label="Reindichte (ρ_R) [Feststoff]" 
                    min={1000} 
                    max={3500} 
                    step={50} 
                    value={physRhoR} 
                    unit="kg/m³" 
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPhysRhoR(val);
                      if (physRho > val) setPhysRho(val);
                      if (physRhoS > val) setPhysRhoS(val);
                    }} 
                  />
                  <Slider 
                    label="Rohdichte (ρ) [Korn]" 
                    min={200} 
                    max={physRhoR} 
                    step={20} 
                    value={physRho} 
                    unit="kg/m³" 
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPhysRho(val);
                      if (physRhoS > val) setPhysRhoS(val);
                    }} 
                  />
                  <Slider 
                    label="Schüttdichte (ρ_S) [Schüttung]" 
                    min={50} 
                    max={physRho} 
                    step={10} 
                    value={physRhoS} 
                    unit="kg/m³" 
                    onChange={(e) => setPhysRhoS(Number(e.target.value))} 
                  />
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/30 text-xs mt-2 self-start flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-700 leading-tight mb-2">Gefügecharakteristik:</h4>
                    <p className="text-slate-600 leading-relaxed italic">{dichtePresets[selectedDichtePreset].desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-home-grau/30 text-slate-500 font-mono text-[10px] space-y-1">
                    <div>Reindichte: <strong>{formatDeWert(dichtePresets[selectedDichtePreset].rhoR)} kg/m³</strong></div>
                    <div>Rohdichte: <strong>{formatDeWert(dichtePresets[selectedDichtePreset].rho)} kg/m³</strong></div>
                    <div>Schüttdichte: <strong>{formatDeWert(dichtePresets[selectedDichtePreset].rhoS)} kg/m³</strong></div>
                  </div>
                </div>
              )}
            </div>

            {/* Panel 2 & 3: Mathematische Auswertung & Porenanteile */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 lg:col-span-2">
              <h3 className="text-md font-bold text-text-main border-b border-home-grau/30 pb-2">Mathematische Gefügeanalyse</h3>
              
              {(() => {
                const activeRhoR = selectedDichtePreset === 'custom' ? physRhoR : dichtePresets[selectedDichtePreset].rhoR;
                const activeRho = selectedDichtePreset === 'custom' ? physRho : dichtePresets[selectedDichtePreset].rho;
                const activeRhoS = selectedDichtePreset === 'custom' ? physRhoS : dichtePresets[selectedDichtePreset].rhoS;
                
                const grainPorosity = (1 - (activeRho / activeRhoR)) * 100;
                const haufwerkPorosity = (1 - (activeRhoS / activeRho)) * 100;
                const totalVoidRatio = (1 - (activeRhoS / activeRhoR)) * 100;

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Kornporosität */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Innere Kornporosität</span>
                          <BlockMath math="P_{Korn} = \left(1 - \frac{\rho}{\rho_R}\right)" />
                          <div className="mt-2 p-2 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal">
                            <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                            Ziegel mit Rohdichte <InlineMath math="\rho = 1800\text{ kg/m}^3" /> und Reindichte <InlineMath math="\rho_R = 2650\text{ kg/m}^3" />.
                            <div className="font-mono mt-0.5 text-slate-800">1 - (1800 / 2650) = 32,1%</div>
                          </div>
                        </div>
                        <div className="text-center mt-3 bg-white p-2 rounded border border-home-grau/30">
                          <strong className="text-lg font-extrabold text-blue-600">{formatDeZahl(grainPorosity, 1)}%</strong>
                          <span className="text-[9px] text-slate-400 block uppercase font-bold mt-0.5">Inneres Porenvolumen</span>
                        </div>
                      </div>

                      {/* Haufwerksporigkeit */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Zwickel-/Haufwerksporigkeit</span>
                          <BlockMath math="P_{Hauf} = \left(1 - \frac{\rho_S}{\rho}\right)" />
                          <div className="mt-2 p-2 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal">
                            <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                            Kiesschüttung mit Schüttdichte <InlineMath math="\rho_S = 1600\text{ kg/m}^3" /> und Kornrohdichte <InlineMath math="\rho = 2650\text{ kg/m}^3" />.
                            <div className="font-mono mt-0.5 text-slate-800">1 - (1600 / 2650) = 39,6%</div>
                          </div>
                        </div>
                        <div className="text-center mt-3 bg-white p-2 rounded border border-home-grau/30">
                          <strong className="text-lg font-extrabold text-indigo-600">{formatDeZahl(haufwerkPorosity, 1)}%</strong>
                          <span className="text-[9px] text-slate-400 block uppercase font-bold mt-0.5">Zwischenkörnungshohlraum</span>
                        </div>
                      </div>

                      {/* Gesamthohlraumgehalt */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Gesamter Hohlraumanteil</span>
                          <BlockMath math="P_{Gesamt} = \left(1 - \frac{\rho_S}{\rho_R}\right)" />
                          <div className="mt-2 p-2 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal">
                            <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                            Ziegelgrus mit Schüttdichte <InlineMath math="\rho_S = 1100\text{ kg/m}^3" /> und Reindichte <InlineMath math="\rho_R = 2650\text{ kg/m}^3" />.
                            <div className="font-mono mt-0.5 text-slate-800">1 - (1100 / 2650) = 58,5%</div>
                          </div>
                        </div>
                        <div className="text-center mt-3 bg-white p-2 rounded border border-home-grau/30">
                          <strong className="text-lg font-extrabold text-shiraz">{formatDeZahl(totalVoidRatio, 1)}%</strong>
                          <span className="text-[9px] text-slate-400 block uppercase font-bold mt-0.5">Hohlraumanteil gesamt</span>
                        </div>
                      </div>
                    </div>

                    {/* Gefügebalken Visualisierung */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Visuelle Verteilung des Schüttvolumens</h4>
                      <div className="h-8 w-full bg-slate-200 rounded-full overflow-hidden flex font-mono text-[9px] font-bold text-white text-center">
                        <div 
                          className="bg-slate-700 flex items-center justify-center transition-all duration-300"
                          style={{ width: `${(100 - totalVoidRatio)}%` }}
                          title="Reines Feststoffvolumen (Skelett)"
                        >
                          {(100 - totalVoidRatio) > 12 && `Skelett ${formatDeZahl((100 - totalVoidRatio), 1)}%`}
                        </div>
                        <div 
                          className="bg-blue-500 flex items-center justify-center transition-all duration-300"
                          style={{ width: `${((100 - haufwerkPorosity) * (grainPorosity / 100))}%` }}
                          title="Volumen der Kornporen"
                        >
                          {((100 - haufwerkPorosity) * (grainPorosity / 100)) > 12 && `Intraporen`}
                        </div>
                        <div 
                          className="bg-indigo-500 flex items-center justify-center transition-all duration-300"
                          style={{ width: `${haufwerkPorosity}%` }}
                          title="Volumen der Interporen (Haufwerkshohlräume)"
                        >
                          {haufwerkPorosity > 12 && `Haufwerk ${formatDeZahl(haufwerkPorosity, 1)}%`}
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-medium">
                        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-700 rounded-sm"></span> Rein-Feststoff (Skelett)</div>
                        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></span> Kornporen (Intra-Poren)</div>
                        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></span> Haufwerksporen (Zwickelräume)</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hygrisch' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-fade-in">
          {/* Card 1: Feuchtegehalt */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <span className="p-1 bg-rose-50 text-shiraz rounded-md text-xs">u</span> Feuchtegehalt
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der Feuchtegehalt beschreibt die Menge an Wasser in einem Baustoff. Er wird meist massenbezogen (Verhältnis der Wassermasse zur Trockenmasse) oder volumenbezogen angegeben.
              </p>
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
                <BlockMath math="u_m = \frac{m_w - m_d}{m_d} \cdot 100" />
                <p className="text-[10px] text-slate-500 mt-2 font-mono">
                  u_m = Massenbezogener Feuchtegehalt [%] | m_w = Feuchtmasse [g] | m_d = Trockenmasse [g]
                </p>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
                <span className="font-bold text-indigo-950 block mb-0.5">🔢 Einfache Beispielrechnung:</span>
                Eine feuchte Steinprobe wiegt <InlineMath math="m_w = 1050 \text{ g}" />, nach Ofentrocknung wiegt sie <InlineMath math="m_d = 1000 \text{ g}" />.
                <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]">
                  u_m = ((1050 g - 1000 g) / 1000 g) · 100 = (50 / 1000) · 100 = 5,00 %
                </div>
              </div>

              <div className="space-y-4">
                <Slider label="Feuchtmasse (m_w)" min={100} max={2500} step={10} value={masseFeucht} unit="g" onChange={(e) => setMasseFeucht(Number(e.target.value))} />
                <Slider label="Trockenmasse (m_d)" min={100} max={2000} step={10} value={masseTrocken} unit="g" onChange={(e) => setMasseTrocken(Number(e.target.value))} />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="p-3 bg-shiraz/10 rounded-lg text-shiraz font-bold text-center text-sm">
                Massenbezogener Feuchtegehalt: {formatDeZahl(Math.max(0, wassergehalt), 2)} M.-%
              </div>
              
              <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-2 text-slate-600">
                <p><strong>Norm-Prüfverfahren:</strong> Gravimetrische Bestimmung (Darrmethode) nach <strong>DIN EN ISO 12570</strong>. Trocknung bis zur Massenkonstanz, in der Regel bei 105 °C; temperaturempfindliche Stoffe (z. B. Gips, Dämmstoffe) bei 40 bzw. 70 °C.</p>
                <p><strong>Praxisanwendung:</strong> Qualitätskontrolle beim Einbau, Bauwerksdiagnostik bei Wasserschäden, Restfeuchtebeurteilung vor Estrichbelegung (CM-Messung).</p>
              </div>
            </div>
          </div>

          {/* Card 2: sd-Wert & mu-Wert */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <span className="p-1 bg-sky-50 text-sky-600 rounded-md text-xs">s_d</span> Diffusionsäquivalente Luftschichtdicke
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der <InlineMath math="s_d" />-Wert gibt an, wie dick eine ruhende Luftschicht sein müsste, um denselben Wasserdampf-Diffusionswiderstand wie die Baustoffschicht aufzuweisen.
              </p>
              
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
                <BlockMath math="s_d = \mu \cdot d" />
                <p className="text-[10px] text-slate-500 mt-2 font-mono">
                  s_d = diffusionsäquivalente Luftschichtdicke [m] | \mu = Diffusionswiderstandszahl [-] | d = Bauteildicke [m]
                </p>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
                <span className="font-bold text-indigo-950 block mb-0.5">🔢 Einfache Beispielrechnung:</span>
                Ein Bauteil aus Beton (<InlineMath math="\mu = 130" />) hat eine Dicke von <InlineMath math="d = 20 \text{ cm} = 0{,}20 \text{ m}" />.
                <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]">
                  s_d = 130 · 0,20 m = 26,0 m (äquivalenter Luftwiderstand)
                </div>
              </div>

              <div className="space-y-4">
                <Slider label="Bauteildicke (d)" min={0.001} max={1.0} step={0.001} value={sdDicke} unit="m" onChange={(e) => setSdDicke(Number(e.target.value))} />
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <label>Diffusionswiderstandszahl (μ)</label>
                    <span className="text-indigo-600">{sdMuWert.toLocaleString('de-DE')} [-]</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="120000" 
                    step="100" 
                    value={sdMuWert} 
                    onChange={(e) => setSdMuWert(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    <button onClick={() => { setSdMuWert(1); setSdDicke(0.14); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Mineralwolle (μ=1)</button>
                    <button onClick={() => { setSdMuWert(10); setSdDicke(0.0125); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Gips (μ=10)</button>
                    <button onClick={() => { setSdMuWert(130); setSdDicke(0.20); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Beton (μ=130)</button>
                    <button onClick={() => { setSdMuWert(100000); setSdDicke(0.0002); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">PE-Folie (μ=10⁵)</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {(() => {
                const sdCalculated = sdMuWert * sdDicke;
                let classification = "diffusionsoffen";
                let colorClass = "bg-emerald-50 border-emerald-200 text-emerald-800";
                if (sdCalculated > 0.5 && sdCalculated < 1500) {
                  classification = "diffusionshemmend";
                  colorClass = "bg-amber-50 border-amber-200 text-amber-800";
                } else if (sdCalculated >= 1500) {
                  classification = "diffusionsdicht (Dampfsperre)";
                  colorClass = "bg-rose-50 border-rose-200 text-rose-800";
                }
                return (
                  <div className={`p-3 rounded-xl border text-center font-bold text-xs space-y-1 ${colorClass}`}>
                    <div>Errechneter s_d-Wert: {formatDeZahl(sdCalculated, 3)} m</div>
                    <div className="uppercase text-[10px] tracking-wider">Klassifizierung nach DIN 4108-3: {classification}</div>
                  </div>
                );
              })()}

              <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-2 text-slate-600">
                <p><strong>Prüfverfahren:</strong> Nach <strong>DIN EN ISO 12572</strong> (Klimakammertest im Wet-Cup/Dry-Cup-Verfahren). Wasserdampfdurchgangsrate wird gravimetrisch über die Zeit erfasst.</p>
                <p><strong>Praxisrelevanz:</strong> Planung des Feuchteschutzes nach dem Glaser-Verfahren (DIN 4108-3), um schädliches Kondensat in Dach- oder Wandkonstruktionen zu minimieren.</p>
              </div>
            </div>
          </div>

          {/* Card 3: Wasseraufnahmekoeffizient (w-Wert / B-Wert) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between lg:col-span-2">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <span className="p-1 bg-teal-50 text-teal-600 rounded-md text-xs">w</span> Wasseraufnahmekoeffizient &amp; Kapillarität (w-Wert / B-Wert)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
                  Der Wasseraufnahmekoeffizient (<InlineMath math="w" />-Wert, früher auch als <span className="font-bold font-mono">B-Wert</span> bezeichnet) beschreibt das kapillare Saugverhalten eines Baustoffs bei direktem Flüssigwasserkontakt.
                </p>
                
                <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
                  <BlockMath math="w = \frac{W_w}{\sqrt{t}}" />
                  <p className="text-[10px] text-slate-500 mt-2 font-mono">
                    w = Wasseraufnahmekoeffizient [kg/(m² · h^0.5)] | W_w = Wasseraufnahme [kg/m²] | t = Saugzeit [h]
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left">
                  <span className="font-bold text-indigo-950 block mb-0.5">🔢 Einfache Beispielrechnung:</span>
                  Ein Backstein hat nach der Saugzeit <InlineMath math="t = 4 \text{ Stunden}" /> ein Flächenwassergewicht von <InlineMath math="W_w = 1{,}4 \text{ kg/m}^2" /> aufgenommen.
                  <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]">
                    w = 1,4 kg/m² / &radic;(4 h) = 1,4 / 2 = 0,70 kg/(m² · h^0,5)
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <Slider label="Wasseraufnahme je m² Fläche (W_w)" min={0.01} max={15.0} step={0.05} value={wWasseraufnahme} unit="kg/m²" onChange={(e) => setWWasseraufnahme(Number(e.target.value))} />
                  <Slider label="Saugdauer / Einwirkzeit (t)" min={1} max={120} step={1} value={wSaugzeit} unit="Stunden" onChange={(e) => setWSaugzeit(Number(e.target.value))} />
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4">
                {(() => {
                  const wCurrentValue = wWasseraufnahme / Math.sqrt(wSaugzeit);
                  let rating = "Kapillar saugend";
                  let ratingDetail = "Erhöhte kapillare Wasseraufnahme. Typisch für rohes Mauerwerk (z.B. Kalksandstein) oder ungeschützte Putze. Benötigt oft hydrophobe Oberflächenbehandlung im Außenbereich.";
                  let styleClass = "bg-rose-50 border-rose-200 text-rose-800";
                  
                  if (wCurrentValue <= 0.5) {
                    rating = "Wasserabweisend (w ≤ 0,5; zusätzlich s_d ≤ 2,0 m und w · s_d ≤ 0,2 nach DIN 4108-3)";
                    ratingDetail = "Hervorragender Schlagregenschutz. Wasser perlt gut ab, kapillares Saugen ist stark unterbunden (Verwendung für Außenputze, Klinker oder hydrophobiertes Mauerwerk).";
                    styleClass = "bg-emerald-50 border-emerald-200 text-emerald-800";
                  } else if (wCurrentValue <= 2.0) {
                    rating = "Wasserhemmend (0,5 < w ≤ 2,0)";
                    ratingDetail = "Eingeschränkte kapillare Leitfähigkeit. Ein Kompromiss aus Saugaktivität und Schutz vor Durchnässung. Geeignet in mäßig regenbeanspruchten Schutzbereichen.";
                    styleClass = "bg-amber-50 border-amber-200 text-amber-800";
                  }

                  return (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-2xl border text-center ${styleClass}`}>
                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-85">Berechneter w-Wert / B-Wert:</div>
                        <div className="text-2xl font-black my-1">{formatDeZahl(wCurrentValue, 4)} <span className="text-xs font-normal">kg/(m² · h<sup>0,5</sup>)</span></div>
                        <div className="text-xs font-bold mt-1 uppercase tracking-wider">{rating}</div>
                        <p className="text-[11px] font-normal leading-relaxed mt-1">{ratingDetail}</p>
                      </div>

                      <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-2 text-slate-600">
                        <p className="font-bold text-slate-800">Prüfverfahren und Normenbezug:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li><strong>DIN EN ISO 15148:</strong> Kapillare Wasseraufnahme. Die Probenunterseite taucht ca. 5 mm (± 2 mm) in Wasser ein; die Massenzunahme wird über die Wurzel der Zeit aufgetragen.</li>
                          <li><strong>DIN 4108-3:</strong> Festlegung der bauphysikalischen Grenzwerte für schlagregensichere Bauteile. Für wasserabweisende Putze und Beschichtungen gilt <InlineMath math="w \le 0{,}5" />, <InlineMath math="s_d \le 2{,}0\,\text{m}" /> und <InlineMath math="w \cdot s_d \le 0{,}2\,\text{kg/(m}\cdot\text{h}^{0{,}5})" /> – eine Balance aus Regenschutz und Austrocknung (nach der Fassadenschutztheorie von Künzel strenger ≤ 0,1).</li>
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'thermisch' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-fade-in">
          {/* Card 1: Wärmeleitfähigkeit (lambda) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <span className="p-1 bg-amber-50 text-amber-600 rounded-md text-xs">λ</span> Wärmeleitfähigkeit (Lambda-Wert)
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der <InlineMath math="\lambda" />-Wert gibt den Wärmestrom an, der bei einem Temperaturgefälle von 1 K durch 1 m² einer 1 m dicken Werkstoffschicht fließt. Er beschreibt das thermische Dämmvermögen eines Baustoffs.
              </p>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
                <BlockMath math="R = \frac{d}{\lambda}" />
                <p className="text-[10px] text-slate-500 mt-2 font-mono">
                  R = Wärmedurchlasswiderstand [m² · K / W] | d = Bauteildicke [m] | \lambda = Wärmeleitfähigkeit [W / (m · K)]
                </p>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
                <span className="font-bold text-indigo-950 block mb-0.5">🔢 Einfache Beispielrechnung:</span>
                Eine Zellulosedämmung hat eine Dicke von <InlineMath math="d = 14 \text{ cm} = 0{,}14 \text{ m}" /> und <InlineMath math="\lambda = 0{,}04 \text{ W/(m · K)}" />.
                <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]">
                  R = 0,14 m / 0,04 W/(m·K) = 3,50 m&sup2;K/W
                </div>
              </div>

              <div className="space-y-4">
                <Slider label="Bauteildicke (d)" min={0.01} max={0.50} step={0.01} value={lambdaDicke} unit="m" onChange={(e) => setLambdaDicke(Number(e.target.value))} />
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <label>Wärmeleitfähigkeit (λ)</label>
                    <span className="text-indigo-600">{formatDeZahl(lambda, 3)} W / (m · K)</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.020" 
                    max="3.000" 
                    step="0.005" 
                    value={lambda} 
                    onChange={(e) => setLambda(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    <button onClick={() => setLambda(0.035)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Dämmung/EPS (λ=0,035)</button>
                    <button onClick={() => setLambda(0.13)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Holz (λ=0,13)</button>
                    <button onClick={() => setLambda(0.70)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Mauerwerk (λ=0,70)</button>
                    <button onClick={() => setLambda(2.0)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Normalbeton (λ=2,0)</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {(() => {
                const rCalc = lambdaDicke / lambda;
                const uCalc = 1 / (0.13 + rCalc + 0.04); // R_si = 0.13, R_se = 0.04 fur Aussenwand
                return (
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Wärmedurchlasswiderstand <span className="font-semibold">R</span>:</span>
                      <strong className="text-slate-800">{formatDeZahl(rCalc, 2)} m²K/W</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Geschätzter U-Wert (einschichtige Außenwand, R_si = 0,13, R_se = 0,04):</span>
                      <strong className="text-indigo-600 font-bold">{formatDeZahl(uCalc, 2)} W/(m²K)</strong>
                    </div>
                  </div>
                );
              })()}

              <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600">
                <p><strong>Zugelassenes Prüfverfahren:</strong> Schutzplatten-Verfahren nach <strong>DIN EN 12667</strong> oder Wärmeflussmesser-Verfahren für Dämmstoffe.</p>
                <p><strong>Rechtlicher Bezug:</strong> Nachweis des baulichen Wärmeschutzes nach Gebäudemodernisierungsgesetz (GModG, bis 07/2026 GEG) und Mindestwärmeschutz nach DIN 4108-2; Bemessungswerte der Wärmeleitfähigkeit nach DIN 4108-4 bzw. DIN EN ISO 10456.</p>
              </div>
            </div>
          </div>

          {/* Card 2: Spezifische Wärmekapazität (c) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <span className="p-1 bg-rose-50 text-shiraz rounded-md text-xs">c</span> Spezifische Wärmekapazität
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die spezifische Wärmekapazität beschreibt die thermische Speicherfähigkeit eines Baustoffs. Sie gibt an, wie viel Wärmeenergie benötigt wird, um 1 kg eines Stoffes um 1 K zu erwärmen.
              </p>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
                <BlockMath math="Q = m \cdot c \cdot \Delta T" />
                <p className="text-[10px] text-slate-500 mt-2 font-mono">
                  Q = Zugeführte Wärmemenge [kJ] | m = Bauteilmasse [kg] | c = spez. Wärmekapazität [J / (kg · K)] | \Delta T = Temperaturhub [K]
                </p>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
                <span className="font-bold text-indigo-950 block mb-0.5">🔢 Einfache Beispielrechnung:</span>
                Eine Holzweichfaserwand mit Masse <InlineMath math="m = 500 \text{ kg}" /> (<InlineMath math="c = 2100 \text{ J/(kg·K)} = 2{,}1 \text{ kJ/(kg·K)}" />) erwärmt sich um <InlineMath math="\Delta T = 10 \text{ K}" />.
                <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]">
                  Q = 500 kg · 2,1 kJ/(kg·K) · 10 K = 10.500 kJ (ca. 2,92 kWh)
                </div>
              </div>

              <div className="space-y-4">
                <Slider label="Bauteilmasse (m)" min={10} max={10000} step={20} value={spezKapazitaetMasse} unit="kg" onChange={(e) => setSpezKapazitaetMasse(Number(e.target.value))} />
                <Slider label="Temperaturerwärmung (ΔT)" min={1} max={100} step={1} value={spezKapazitaetDeltaT} unit="K" onChange={(e) => setSpezKapazitaetDeltaT(Number(e.target.value))} />
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <label>Spezifische Wärmekapazität (c)</label>
                    <span className="text-indigo-600">{spezKapazitaetC.toLocaleString('de-DE')} J / (kg · K)</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="2500" 
                    step="50" 
                    value={spezKapazitaetC} 
                    onChange={(e) => setSpezKapazitaetC(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    <button onClick={() => setSpezKapazitaetC(480)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Stahl (c=480)</button>
                    <button onClick={() => setSpezKapazitaetC(1000)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Beton/Ziegel (c=1000)</button>
                    <button onClick={() => setSpezKapazitaetC(1600)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Holz (c=1600)</button>
                    <button onClick={() => setSpezKapazitaetC(2100)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Stroh/Dämmung (c=2100)</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {(() => {
                const energyKJ = (spezKapazitaetMasse * (spezKapazitaetC / 1000) * spezKapazitaetDeltaT);
                const energyWh = energyKJ / 3.6; // 1 Wh = 3.6 kJ
                return (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs space-y-1 text-center font-sans">
                    <div className="font-bold">Gespeicherte Wärmeenergie (Q):</div>
                    <div className="text-xl font-black">{energyKJ.toLocaleString('de-DE', { maximumFractionDigits: 1 })} kJ <span className="text-xs font-normal">({formatDeZahl((energyWh / 1000), 2)} kWh)</span></div>
                  </div>
                );
              })()}

              <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600">
                <p><strong>Zugelassenes Prüfverfahren:</strong> Dynamische Differenzkalorimetrie (DSC) nach <strong>DIN EN ISO 11357-4</strong> für präzise Wärmekapazitätsbestimmungen.</p>
                <p><strong>Praxisrelevanz:</strong> Bauteile mit hoher Rohdichte und hohem c-Wert dämpfen sommerliche Temperaturspitzen hervorragend (Phasenverschiebung).</p>
              </div>
            </div>
          </div>

          {/* Card 3: Wärmedehnung */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <span className="p-1 bg-blue-50 text-blue-600 rounded-md text-xs">Δl</span> Thermische Längenausdehnung
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Baustoffe verändern ihr geometrisches Volumen bei Temperaturänderungen. Der thermische Längenausdehnungskoeffizienten (<InlineMath math="\alpha_T" />) beschreibt diese proportionale Längenänderung.
              </p>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
                <BlockMath math="\Delta l = \alpha_T \cdot l_0 \cdot \Delta T" />
                <p className="text-[10px] text-slate-500 mt-2 font-mono">
                  \Delta l = Längenänderung [mm] | \alpha_T = Ausdehnungskoeffizient \cdot 10^{-5} [1/K] | l_0 = Ausgangslänge [m] | \Delta T = Temp.-Differenz [K]
                </p>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
                <span className="font-bold text-indigo-950 block mb-0.5">🔢 Einfache Beispielrechnung:</span>
                Ein stählerner Träger (<InlineMath math="l_0 = 20 \text{ m}" />, <InlineMath math="\alpha_T = 1{,}2 \cdot 10^{-5} \text{ 1/K}" />) erfährt eine Erwärmung von <InlineMath math="\Delta T = 30 \text{ K}" />.
                <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]">
                  &Delta;l = 1,2 · 10⁻⁵ · 20 m · 30 K = 0,0072 m = 7,20 mm
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Werkstoff-Ausdehnungskoeffizient (α_T)</label>
                  <select 
                    className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz text-xs font-semibold"
                    value={alphaT}
                    onChange={(e) => setAlphaT(Number(e.target.value))}
                  >
                    <option value={1.2}>Stahl (1,2 × 10⁻⁵ 1/K)</option>
                    <option value={1.0}>Normalbeton (1,0 × 10⁻⁵ 1/K)</option>
                    <option value={2.4}>Aluminium (2,4 × 10⁻⁵ 1/K)</option>
                    <option value={0.5}>Holz parallel (0,5 × 10⁻⁵ 1/K)</option>
                    <option value={0.9}>Kalknatronscheibenglas (0,9 × 10⁻⁵ 1/K)</option>
                    <option value={0.1}>Invar-Legierung FeNi36 (ca. 0,1 × 10⁻⁵ 1/K)</option>
                  </select>
                </div>

                <Slider label="Ursprungslänge (l₀)" min={1} max={100} step={1} value={laenge} unit="m" onChange={(e) => setLaenge(Number(e.target.value))} />
                <Slider label="Temperaturänderung (ΔT)" min={-40} max={120} step={5} value={deltaT} unit="K" onChange={(e) => setDeltaT(Number(e.target.value))} />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="p-3 bg-shiraz/10 rounded-lg text-shiraz font-bold text-center text-sm">
                Resultierende Längenänderung (Δl): {formatDeZahl(waermedehnung, 3)} mm
              </div>

              <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600">
                <p><strong>Normverfahren:</strong> Dilatometer-Messung im Temperaturschrank oder Laserinterferometrie nach <strong>DIN 51045</strong>.</p>
                <p><strong>Wichtige Baupraxis:</strong> Ermöglicht die korrekte Einplanung von Dehnungsfugen (Fugenabstände im Fassadenbau oder bei langen Straßenbahnschienen/Brücken).</p>
              </div>
            </div>
          </div>

          {/* Card 4: Thermische Dynamik (Wärmeeindringkoeffizient & Temperaturleitfähigkeit) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <span className="p-1 bg-amber-50 text-amber-600 rounded-md text-xs">d</span> Thermische Instationär-Dynamik
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Das instationäre Wärmeverhalten beschreibt, wie Baustoffe auf Temperaturänderungen reagieren. Es entscheidet maßgeblich über das Behaglichkeitsgefühl (z.B. barfuß auf Parkett vs. Fliesen) und das sommerliche Aufheizverhalten.
              </p>

              {/* Presets and Custom Mode Slider Block */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 mb-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Dynamisches Materialpreset:</span>
                  <select 
                    value={thermischPreset}
                    onChange={(e) => handleThermischPresetChange(e.target.value as any)}
                    className="p-1.5 border border-home-grau/30 rounded bg-white text-xs font-bold focus:outline-none focus:border-shiraz"
                  >
                    <option value="ziegel">Hochlochziegel (Mauerstein)</option>
                    <option value="beton">Normalbeton (Konstruktiver Kern)</option>
                    <option value="holz">Nadelholz (Dielung/Parkett)</option>
                    <option value="porenbeton">Porenbeton (Wärmeschutzstein)</option>
                    <option value="stahl">Baustahl (Skelettträger)</option>
                    <option value="eps">EPS / Styropor (Wärmedämmung)</option>
                    <option value="custom">Benutzerdefiniert / Custom Slider</option>
                  </select>
                </div>

                {thermischPreset === 'custom' ? (
                  <div className="space-y-3 pt-2">
                    <Slider label="Wärmeleitfähigkeit (λ)" min={0.01} max={60} step={0.01} value={thermischLambda} unit="W/(m·K)" onChange={(e) => setThermischLambda(Number(e.target.value))} />
                    <Slider label="Rohdichte (ρ)" min={10} max={8000} step={10} value={thermischRho} unit="kg/m³" onChange={(e) => setThermischRho(Number(e.target.value))} />
                    <Slider label="Spez. Wärmekapazität (c)" min={100} max={2500} step={10} value={thermischC} unit="J/(kg·K)" onChange={(e) => setThermischC(Number(e.target.value))} />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono text-slate-600 pt-1.5">
                    <div className="bg-white p-1.5 rounded border border-home-grau/30">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">λ (mK)</span>
                      <strong>{formatDeZahl(thermischLambda, 3)}</strong>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-home-grau/30">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">ρ (kg/m³)</span>
                      <strong>{formatDeWert(thermischRho)}</strong>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-home-grau/30">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">c (J/kgK)</span>
                      <strong>{formatDeWert(thermischC)}</strong>
                    </div>
                  </div>
                )}
              </div>

              {(() => {
                const a_m2_s = thermischLambda / (thermischRho * thermischC);
                const a_mm2_s = a_m2_s * 1e6;
                const b_eff = Math.sqrt(thermischLambda * thermischRho * thermischC);

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {/* Diffusivity Box */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Temperaturleitfähigkeit (<InlineMath math="a" />)</span>
                        <BlockMath math="a = \frac{\lambda}{\rho \cdot c}" />
                        <div className="p-2.5 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal mb-2">
                          <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung (Beton):</span>
                          <InlineMath math="\lambda = 2{,}0\,\text{W/(mK)}" />, <InlineMath math="\rho = 2400\,\text{kg/m}^3" />, <InlineMath math="c = 1000\,\text{J/(kgK)}" />.
                          <div className="font-mono mt-0.5 text-slate-800">a = 2,0 / (2400 · 1000) = 8,33 · 10⁻⁷ m²/s (0,833 mm²/s)</div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                          Maß für die Ausbreitungsgeschwindigkeit einer Wärmeleit-Welle. Hohe Werte bedeuten schnellen Temperaturausgleich.
                        </p>
                      </div>
                      <div className="mt-4 bg-white p-2.5 rounded border border-home-grau/30 text-center font-mono">
                        <strong className="text-md text-slate-800 font-extrabold block">{formatDeZahl(a_mm2_s, 3)} mm²/s</strong>
                        <span className="text-[9px] text-slate-400 block font-bold">(= {formatDeZahl(a_m2_s * 1e7, 2)} · 10⁻⁷ m²/s)</span>
                      </div>
                    </div>

                    {/* Effusivity Box */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Wärmeeindringkoeffizient (<InlineMath math="b" />)</span>
                        <BlockMath math="b = \sqrt{\lambda \cdot \rho \cdot c}" />
                        <div className="p-2.5 bg-indigo-50/60 rounded border border-indigo-100/30 text-[9px] text-slate-600 leading-normal mb-2">
                          <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung (Fichte):</span>
                          <InlineMath math="\lambda = 0{,}13\,\text{W/(mK)}" />, <InlineMath math="\rho = 500\,\text{kg/m}^3" />, <InlineMath math="c = 1600\,\text{J/(kgK)}" />.
                          <div className="font-mono mt-0.5 text-slate-800">b = &radic;(0,13 · 500 · 1600) = 322,5 J/(m&sup2;·K·s^0,5)</div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                          Maß für das Aufheizverhalten von Oberflächen. Hohe Werte (z.B. Beton, Stahl) entziehen dem menschlichen Körper viel Wärme (Kalte Haptik).
                        </p>
                      </div>
                      <div className="mt-4 bg-white p-2.5 rounded border border-home-grau/30 text-center font-mono">
                        <strong className="text-md text-shiraz font-extrabold block">{formatDeZahl(b_eff, 0)} J/(m²·K·s^0,5)</strong>
                        <span className="text-[9px] text-slate-400 block font-bold">Barfußkontakt: {b_eff < 1000 ? '✓ Behaglich-Warm' : '❌ Kühleffekt'}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-4 p-3 bg-amber-50 text-amber-950 rounded-xl text-xs space-y-1.5 border border-amber-200 font-normal leading-relaxed">
              <p>💡 <strong>Wohnbehaglichkeit ("Tactile Comfort"):</strong></p>
              <p className="text-[11px] text-amber-900 leading-normal">
                Nadelholz besitzt ein sehr geringes <InlineMath math="b \approx 320" />, weshalb Fußbodenparkett dem Fuß kaum Eigenwärme entzieht und barfuß kuschelig warm wirkt. Beton hingegen transportiert mit <InlineMath math="b \approx 2200" /> instantan Wärme ab – Estrich kühlt ungeheizt den Fuß rasch aus.
              </p>
            </div>
          </div>
        </div>
      )}

      <ModulTest moduleId="baustoffkenngroessen" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Werkstoffeigenschaft', url: 'https://de.wikipedia.org/wiki/Werkstoffeigenschaft' },
          { title: 'Wärmeeindringkoeffizient', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmeeindringkoeffizient' },
          { title: 'Wasserdampfdiffusionswiderstandszahl', url: 'https://de.wikipedia.org/wiki/Wasserdampfdiffusionswiderstandszahl' }
        ]}
        literatur={[
          'Willems, W. M. (Hrsg.): Lehrbuch der Bauphysik. 9. Aufl., Wiesbaden: Springer Vieweg 2022',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Stark, J.; Wicht, B.: Dauerhaftigkeit von Beton. 2. Aufl., Berlin/Heidelberg: Springer Vieweg 2013'
        ]}
        regelwerke={[
          { title: 'DIN 4108-3 (Wärmeschutz und Energie-Einsparung in Gebäuden - Klimabedingter Feuchteschutz)' },
          { title: 'DIN EN ISO 6946 (Bauteile - Wärmedurchlasswiderstand und Wärmedurchgangskoeffizient)' },
          { title: 'DIN EN ISO 10456 (Baustoffe und Bauprodukte - Wärme- und feuchtetechnische Eigenschaften)' },
          { title: 'DIN 4108-4 (Wärme- und feuchteschutztechnische Bemessungswerte)' },
          { title: 'DIN EN ISO 12570 (Bestimmung des Feuchtegehaltes durch Trocknen bei erhöhter Temperatur)' },
          { title: 'DIN EN ISO 12572 (Bestimmung der Wasserdampfdurchlässigkeit)' },
          { title: 'DIN EN ISO 15148 (Bestimmung des Wasseraufnahmekoeffizienten bei teilweisem Eintauchen)' },
          { title: 'DIN EN 1992-1-1 (Eurocode 2) – Kriechen und Schwinden (3.1.4, Anhang B)' }
        ]}
        formeln={[
          {
            formel: 'b = \\sqrt{\\lambda \\cdot \\rho \\cdot c} \\quad \\left[\\frac{\\text{J}}{\\text{m}^2 \\cdot \\text{K} \\cdot \\text{s}^{1/2}}\\right]',
            erklaerung: 'Wärmeeindringkoeffizient b: Beschreibt die Geschwindigkeit und Intensität, mit der ein Baustoff bei Kontakt Wärme aufnimmt (maßgeblich für Fußwärme von Bodenbelägen).',
            quelle: 'Bauphysik / Willems'
          },
          {
            formel: 's_d = \\mu \\cdot d \\quad [\\text{m}] \\quad \\text{und} \\quad a = \\frac{\\lambda}{\\rho \\cdot c} \\quad \\left[\\frac{\\text{m}^2}{\\text{s}}\\right]',
            erklaerung: 'Diffusionsäquivalente Luftschichtdicke s_d (Wasserdampfdiffusionswiderstand) und Temperaturleitfähigkeit a (thermische Trägheit des Bauteils).',
            quelle: 'DIN 4108-3 / DIN EN ISO 13788'
          }
        ]}
        lastReviewed="Oktober 2026 (AP 3 Grundlagen: Dichten, Feuchte, Diffusion, Kapillarität, Wärme und Zeitverhalten gegen DIN 4108-3/-4, DIN EN ISO 10456, 12570, 15148 und DIN EN 1992-1-1 geprüft; fachliche Freigabe durch den Autor ausstehend)"
      />
    </div>
  );
} 