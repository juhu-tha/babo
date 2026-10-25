import { formatDeWert } from '@/src/utils/numberFormat';
import { useState } from 'react';
import {
  Scale,
  Activity,
  Droplets,
  Flame,
  Clock,
  Layers,
  Calculator
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
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
import '@/src/lib/chartSetup';
import Elastomechanik from './Elastomechanik';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import EigenschaftenTab from './baustoffkenngroessen/EigenschaftenTab';
import ZeitlichTab from './baustoffkenngroessen/ZeitlichTab';
import RechenbeispieleTab from './baustoffkenngroessen/RechenbeispieleTab';
import PhysikalischTab from './baustoffkenngroessen/PhysikalischTab';
import HygrischTab from './baustoffkenngroessen/HygrischTab';
import ThermischTab from './baustoffkenngroessen/ThermischTab';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
    
    // Druckbeanspruchung: ε_el und ε_cr sind Stauchungen (als Betrag), ε_cs ist negativ (Verkürzung).
    // Beide Anteile verkürzen das Bauteil, daher addieren sich die Beträge.
    const eps_total = eps_el + eps_cr + Math.abs(eps_cs);

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
        label: 'Schwindverkürzung |ε_cs|',
        data: timeLabels.map(d => Math.abs(calcTimedValues(d).eps_cs)),
        borderColor: '#1e293b',
        backgroundColor: '#1e293b',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 2,
      },
      {
        label: 'Gesamtstauchung (Betrag)',
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
          <button aria-pressed={activeTab === 'eigenschaften'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'eigenschaften' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('eigenschaften')}
          >
            <Layers size={16} /> Eigenschaften
          </button>
          <button aria-pressed={activeTab === 'mechanisch'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'mechanisch' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('mechanisch')}
          >
            <Activity size={16} /> Mechanisch
          </button>
          <button aria-pressed={activeTab === 'physikalisch'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'physikalisch' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('physikalisch')}
          >
            <Scale size={16} /> Physikalisch
          </button>
          <button aria-pressed={activeTab === 'hygrisch'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'hygrisch' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('hygrisch')}
          >
            <Droplets size={16} /> Hygrisch
          </button>
          <button aria-pressed={activeTab === 'thermisch'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'thermisch' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('thermisch')}
          >
            <Flame size={16} /> Thermisch
          </button>
          <button aria-pressed={activeTab === 'zeitlich'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zeitlich' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zeitlich')}
          >
            <Clock size={16} /> Zeitabh. Eigenschaften
          </button>
          <button aria-pressed={activeTab === 'rechenbeispiele'}
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

      {activeTab === 'eigenschaften' && <EigenschaftenTab selectedMaterial={selectedMaterial} setSelectedMaterial={setSelectedMaterial} />}

      {activeTab === 'mechanisch' && (
        <div className="w-full animate-fade-in">
          <Elastomechanik embedMode={true} />
        </div>
      )}

      {activeTab === 'zeitlich' && <ZeitlichTab currentTimed={currentTimed} dehnungenChartData={dehnungenChartData} relaxationChartData={relaxationChartData} setZeitlichE={setZeitlichE} setZeitlichPhi={setZeitlichPhi} setZeitlichRelaxationInf={setZeitlichRelaxationInf} setZeitlichSchwindenInf={setZeitlichSchwindenInf} setZeitlichSigma0={setZeitlichSigma0} setZeitlichT={setZeitlichT} zeitlichE={zeitlichE} zeitlichPhi={zeitlichPhi} zeitlichRelaxationInf={zeitlichRelaxationInf} zeitlichSchwindenInf={zeitlichSchwindenInf} zeitlichSigma0={zeitlichSigma0} zeitlichT={zeitlichT} />}

      {activeTab === 'rechenbeispiele' && <RechenbeispieleTab deltaLA={deltaLA} handleSaeulenMaterialChange={handleSaeulenMaterialChange} saeulenA={saeulenA} saeulenE={saeulenE} saeulenF={saeulenF} saeulenFy={saeulenFy} saeulenL0={saeulenL0} saeulenMaterial={saeulenMaterial} setSaeulenA={setSaeulenA} setSaeulenE={setSaeulenE} setSaeulenF={setSaeulenF} setSaeulenFy={setSaeulenFy} setSaeulenL0={setSaeulenL0} strainA={strainA} strainAPromille={strainAPromille} stressA={stressA} utilizationA={utilizationA} />}

      {activeTab === 'physikalisch' && <PhysikalischTab dichtePresets={dichtePresets} handleDichtePresetChange={handleDichtePresetChange} physRho={physRho} physRhoR={physRhoR} physRhoS={physRhoS} selectedDichtePreset={selectedDichtePreset} setPhysRho={setPhysRho} setPhysRhoR={setPhysRhoR} setPhysRhoS={setPhysRhoS} />}

      {activeTab === 'hygrisch' && <HygrischTab masseFeucht={masseFeucht} masseTrocken={masseTrocken} sdDicke={sdDicke} sdMuWert={sdMuWert} setMasseFeucht={setMasseFeucht} setMasseTrocken={setMasseTrocken} setSdDicke={setSdDicke} setSdMuWert={setSdMuWert} setWSaugzeit={setWSaugzeit} setWWasseraufnahme={setWWasseraufnahme} wassergehalt={wassergehalt} wSaugzeit={wSaugzeit} wWasseraufnahme={wWasseraufnahme} />}

      {activeTab === 'thermisch' && <ThermischTab alphaT={alphaT} deltaT={deltaT} handleThermischPresetChange={handleThermischPresetChange} laenge={laenge} lambda={lambda} lambdaDicke={lambdaDicke} setAlphaT={setAlphaT} setDeltaT={setDeltaT} setLaenge={setLaenge} setLambda={setLambda} setLambdaDicke={setLambdaDicke} setSpezKapazitaetC={setSpezKapazitaetC} setSpezKapazitaetDeltaT={setSpezKapazitaetDeltaT} setSpezKapazitaetMasse={setSpezKapazitaetMasse} setThermischC={setThermischC} setThermischLambda={setThermischLambda} setThermischRho={setThermischRho} spezKapazitaetC={spezKapazitaetC} spezKapazitaetDeltaT={spezKapazitaetDeltaT} spezKapazitaetMasse={spezKapazitaetMasse} thermischC={thermischC} thermischLambda={thermischLambda} thermischPreset={thermischPreset} thermischRho={thermischRho} waermedehnung={waermedehnung} />}

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