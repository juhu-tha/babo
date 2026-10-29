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
import inhalt from '@/content/baustoffkenngroessen/Baustoffkenngroessen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const REITER = [
  { id: 'eigenschaften', label: 'Eigenschaften', icon: Layers },
  { id: 'mechanisch', label: 'Mechanisch', icon: Activity },
  { id: 'physikalisch', label: 'Physikalisch', icon: Scale },
  { id: 'hygrisch', label: 'Hygrisch', icon: Droplets },
  { id: 'thermisch', label: 'Thermisch', icon: Flame },
  { id: 'zeitlich', label: inhalt.texte.zeitabhEigenschaften, icon: Clock },
  { id: 'rechenbeispiele', label: 'Rechenbeispiele', icon: Calculator },
] as const;

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

  const dichtePresets = inhalt.daten["Baustoffkenngroessen.dichtePresets"];

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
      setThermischC(450);
    } else if (preset === 'eps') {
      setThermischLambda(0.035);
      setThermischRho(30);
      setThermischC(1450); // DIN EN ISO 10456 (EPS), wie Modul Wärmeeigenschaften (Konsistenzprüfung 29.10.2026, vorher 1500)
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
        label: inhalt.werte.spannungHookeschesGesetz,
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
        label: inhalt.werte.elastischeDehnung,
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
        label: inhalt.werte.schwindverkürzungCs,
        data: timeLabels.map(d => Math.abs(calcTimedValues(d).eps_cs)),
        borderColor: '#1e293b',
        backgroundColor: '#1e293b',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 2,
      },
      {
        label: inhalt.werte.gesamtstauchungBetrag,
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
        label: inhalt.werte.spannungsverlaufRelaxation,
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
          <p><MdText text={inhalt.texte.baustoffkenngrößenBeschreibenDiePhysikal} /></p>
        </div>

      </div>

      <ModuleTabs label="Kenngrößen nach Art" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:mb-8">
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
      </ModuleTabs>

      <ModulTest moduleId="baustoffkenngroessen" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Werkstoffeigenschaft', url: 'https://de.wikipedia.org/wiki/Werkstoffeigenschaft' },
          { title: 'Wärmeeindringkoeffizient', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmeeindringkoeffizient' },
          { title: 'Wasserdampfdiffusionswiderstandszahl', url: 'https://de.wikipedia.org/wiki/Wasserdampfdiffusionswiderstandszahl' }
        ]}
        literatur={inhalt.daten["Baustoffkenngroessen.literatur"]}
        regelwerke={inhalt.daten["Baustoffkenngroessen.regelwerke"]}
        formeln={inhalt.daten["Baustoffkenngroessen.formeln"]}
        lastReviewed={inhalt.werte.oktober2026Ap3}
      />
    </div>
  );
} 