import type { ChartOptions } from 'chart.js';
import { formatDeZahl } from '@/src/utils/numberFormat';
import { useState, useMemo } from 'react';
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
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import {
  Search,
  Thermometer,
  Battery,
  Waves,
  Hammer,
  Radio,
  Trees,
  Wrench,
  CheckCircle2,
  Award
} from 'lucide-react';
import { geraeteList } from './zfp/daten';
import MechanischTab from './zfp/MechanischTab';
import AkustischTab from './zfp/AkustischTab';
import ElektromagnetischTab from './zfp/ElektromagnetischTab';
import ElektrochemischTab from './zfp/ElektrochemischTab';
import ThermischTab from './zfp/ThermischTab';
import HolzTab from './zfp/HolzTab';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ZfP() {
  const [activeTab, setActiveTab] = useState<'mechanisch' | 'akustisch' | 'elektromagnetisch' | 'elektrochemisch' | 'thermisch' | 'holz' | 'geraete' | 'dgzfp'>('mechanisch');

  // New states for Wenner-Sonde, Torrent, and Karsten-Röhrchen
  const [wennerSpacing, setWennerSpacing] = useState(50); // mm
  const [wennerResistance, setWennerResistance] = useState(150); // Ohm

  const [torrentKt, setTorrentKt] = useState(0.2); // kT in 10^-16 m^2
  const [torrentMoisture, setTorrentMoisture] = useState(55); // %

  const [karstenTime, setKarstenTime] = useState(15); // min
  const [karstenAbsorbed, setKarstenAbsorbed] = useState(2.5); // ml
  const [karstenMaterial, setKarstenMaterial] = useState<'concrete' | 'klinker' | 'plaster'>('concrete');

  // Selected device state (now used in local tab views)
  const [selectedGeraetLocal, setSelectedGeraetLocal] = useState<Record<string, string>>({
    mechanisch: 'rueckprall',
    akustisch: 'ultraschall',
    elektromagnetisch: 'georadar',
    elektrochemisch: 'potentialfeld',
    thermisch: 'thermografie',
    holz: 'setzdehnung'
  });

  // Keep original states to avoid breaking any references
  const [selectedGeraet, setSelectedGeraet] = useState<string | null>('georadar');
  const [geraeteSearch, setGeraeteSearch] = useState('');
  const [geraeteCategory, setGeraeteCategory] = useState<'all' | 'zfp' | 'destructive' | 'monitoring' | 'spezial'>('all');

  // Rückprallhammer State
  const [rebound, setRebound] = useState(35);
  const [angle, setAngle] = useState<'0' | '90' | '-90'>('0');

  // Ultraschall State
  const [velocity, setVelocity] = useState(4.0); // km/s

  // Bewehrungssucher State
  const [cover, setCover] = useState(30); // mm
  const [barDiameter, setBarDiameter] = useState(16); // mm

  // Radar State
  const [dielectric, setDielectric] = useState(6.0); // Dielektrizitätszahl
  const [timeOfFlight, setTimeOfFlight] = useState(1.5); // ns

  // Potentialmessung State
  const [potential, setPotential] = useState(-350); // mV

  // Thermografie State
  const [tempDiff, setTempDiff] = useState(2.5); // K

  // Impact-Echo State
  const [frequency, setFrequency] = useState(15); // kHz
  const [waveVelocity, setWaveVelocity] = useState(4000); // m/s

  // Durchstrahlungsprüfung State
  const [thickness, setThickness] = useState(20); // cm
  const [radiationEnergy, setRadiationEnergy] = useState(1.5); // MeV

  // Filtered devices based on Category and Search
  const filteredGeraete = useMemo(() => {
    return geraeteList.filter((item) => {
      const matchCategory =
        geraeteCategory === 'all' || item.category === geraeteCategory;
      const matchSearch =
        item.name.toLowerCase().includes(geraeteSearch.toLowerCase()) ||
        item.desc.toLowerCase().includes(geraeteSearch.toLowerCase()) ||
        item.useCase.toLowerCase().includes(geraeteSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [geraeteList, geraeteCategory, geraeteSearch]);

  // Selected device object
  const activeGeraet = useMemo(() => {
    return geraeteList.find((item) => item.id === selectedGeraet) || null;
  }, [geraeteList, selectedGeraet]);

  // Berechnungen Rückprallhammer
  const reboundResults = useMemo(() => {
    let deltaR = 0;
    if (angle === '90') deltaR = -3; // nach unten (Schwerkraft erhöht Aufprallenergie -> R zu groß -> Korrektur negativ)
    if (angle === '-90') deltaR = 3; // nach oben (Schwerkraft verringert Aufprallenergie -> R zu klein -> Korrektur positiv)
    
    const rCorr = rebound + deltaR;
    // Empirische Formel: fc = 0.027 * R^2.1 (vereinfacht)
    const fc = 0.027 * Math.pow(Math.max(10, rCorr), 2.1);

    return {
      rCorr,
      fc
    };
  }, [rebound, angle]);

  // Berechnungen Ultraschall
  const ultrasonicResults = useMemo(() => {
    // Edyn = rho * v^2 * (1+v)(1-2v)/(1-v)
    // rho = 2400 kg/m3, v_poisson = 0.2 -> Faktor = 0.9
    // v in km/s -> v * 1000 m/s
    const eDyn = 2.4 * Math.pow(velocity, 2) * 0.9; // in GPa
    
    // Grobe Abschätzung der Druckfestigkeit aus Ultraschall (sehr stark vereinfacht)
    // fc ≈ (v - 2.0) * 20
    const fcEst = Math.max(0, (velocity - 2.0) * 20);

    return {
      eDyn,
      fcEst
    };
  }, [velocity]);

  // Berechnungen Bewehrungssucher
  const bewehrungssucherResults = useMemo(() => {
    // Signalstärke nimmt mit Abstand quadratisch/kubisch ab
    // Vereinfachtes Modell für die Anzeige
    const signalStrength = Math.max(0, 100 - (cover / barDiameter) * 20);
    return { signalStrength };
  }, [cover, barDiameter]);

  // Berechnungen Radar (Georadar)
  const radarResults = useMemo(() => {
    // v = c / sqrt(epsilon_r)
    // c = 300 mm/ns (Lichtgeschwindigkeit)
    const vRadar = 300 / Math.sqrt(dielectric); // mm/ns
    
    // Tiefe d = v * t / 2 (Hin- und Rückweg)
    const depth = (vRadar * timeOfFlight) / 2; // mm
    
    return { vRadar, depth };
  }, [dielectric, timeOfFlight]);

  // Berechnungen Potentialmessung
  const potentialResults = useMemo(() => {
    let risk = "Gering (< 10%)";
    let color = "bg-green-500";
    if (potential < -350) {
      risk = "Hoch (> 90%)";
      color = "bg-red-500";
    } else if (potential < -200) {
      risk = "Mittel (unsicher)";
      color = "bg-yellow-500";
    }
    return { risk, color };
  }, [potential]);

  // Berechnungen Wenner-Sonde (Spezifischer Widerstand)
  const wennerResults = useMemo(() => {
    // rho = 2 * pi * a * R
    // a in meter = wennerSpacing / 1000
    // R in Ohm = wennerResistance
    const rho = 2 * Math.PI * (wennerSpacing / 1000) * wennerResistance; // Ohm*m
    const rhoKohmCm = rho / 10; // 1 Ohm*m = 0.1 kOhm*cm
    
    let rate = "Vernachlässigbar";
    let color = "bg-green-600";
    let textClass = "text-green-800 bg-green-50";
    let description = "Sehr trockenes Bauteil oder extrem dichtes Gefüge (z.B. Silicafume/HSPC). Eine Korrosionsinitiierung ist thermodynamisch extrem unwahrscheinlich.";

    if (rho < 120) {
      rate = "Sehr hoch";
      color = "bg-red-600";
      textClass = "text-red-800 bg-red-50 border-red-200";
      description = "Feuchter, chloridbelasteter oder karbonatisierter Beton. Aktiver Korrosionsstrom kann ungehindert fließen (Lochfraßgefahr).";
    } else if (rho < 500) {
      rate = "Mittel";
      color = "bg-amber-500";
      textClass = "text-amber-800 bg-amber-50 border-amber-200";
      description = "Durchschnittlicher Feuchte- und Carbonatisierungsgrad. Geringe bis moderate Ausbreitungsgeschwindigkeit.";
    } else if (rho < 1000) {
      rate = "Niedrig";
      color = "bg-emerald-500";
      textClass = "text-emerald-800 bg-emerald-50 border-emerald-100";
      description = "Vorwiegend trocken, hohe Betondichte. Sehr geringe Schädigungsdynamik.";
    }

    return { rho, rhoKohmCm, rate, color, textClass, description };
  }, [wennerSpacing, wennerResistance]);

  // Berechnungen Gaspermeationsmessung (Torrent)
  const torrentResults = useMemo(() => {
    let klassifizierung = "Klasse I (Sehr niedrig)";
    let bewertung = "Hervorragend dicht";
    let textClass = "text-green-800 bg-green-50 border-green-200";
    let description = "Maximale Dauerhaftigkeit. Das Bauteil besitzt einen sehr guten Widerstand gegen Karbonatisierung und Chlorideindringung.";

    if (torrentKt >= 10.0) {
      klassifizierung = "Klasse V (Sehr hoch)";
      bewertung = "Ungenügend / Sehr offenporig";
      textClass = "text-red-800 bg-red-50 border-red-200";
      description = "Extrem durchlässiges Porensystem. Dringender Sanierungsbedarf oder zusätzliche hydrophobierende Applikation angeraten.";
    } else if (torrentKt >= 1.0) {
      klassifizierung = "Klasse IV (Hoch)";
      bewertung = "Minderwertiger Schutz";
      textClass = "text-rose-700 bg-rose-50 border-rose-200";
      description = "Erhöhtes Risiko für Bewehrungskorrosion. Die Karbonatisierungsfront schreitet beschleunigt voran.";
    } else if (torrentKt >= 0.1) {
      klassifizierung = "Klasse III (Mittel)";
      bewertung = "Durchschnittlich";
      textClass = "text-amber-700 bg-amber-50 border-amber-200";
      description = "Durchschnittlicher Betonüberdeckungswiderstand. Standardbeton ohne gesonderte Expositionsklassenschutz-Vorgaben.";
    } else if (torrentKt >= 0.01) {
      klassifizierung = "Klasse II (Niedrig)";
      bewertung = "Gute Qualität";
      textClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
      description = "Sicheres Bauteilverhalten. Ausreichender Porenwiderstand für reguläre Umwelteinflüsse.";
    }

    // Feuchtigkeitseinfluss bestimmen
    let moistureWarning = null;
    let moistureCritical = false;
    if (torrentMoisture > 85) {
      moistureWarning = "Kritische Betonfeuchte (> 85%): Die Messung ist extrem fehleranfällig und ungültig! Wasser blockiert den Porenraum, wodurch der gemessene kT-Wert künstlich gegen Null fällt.";
      moistureCritical = true;
    } else if (torrentMoisture > 70) {
      moistureWarning = "Hohe Betonfeuchte (> 70%): Die tatsächliche Gaspermeabilität ist durch okkludiertes Porenwasser beeinträchtigt. Der reale kT-Wert ist schätzungsweise um den Faktor 2-5 höher.";
    }

    return { klassifizierung, bewertung, textClass, description, moistureWarning, moistureCritical };
  }, [torrentKt, torrentMoisture]);

  // Berechnungen Karstensches Röhrchen
  const karstenResults = useMemo(() => {
    // w = V / (0.491 * sqrt(t_hours))
    const tHours = karstenTime / 60;
    const w = karstenAbsorbed / (0.491 * Math.sqrt(tHours)); // kg/(m² * h^0.5)

    let eingruppierung = "Wasserabweisend (Hydrophob)";
    let textClass = "text-green-800 bg-green-50 border-green-200";
    let color = "bg-green-600";
    let detailtext = "Sehr gute Sperrwirkung gegen eindringende Flüssigkeiten. Extrem hohe Lebensdauer bei Schlagregenbelastung.";

    if (w > 0.5) {
      eingruppierung = "Stark saugend (Absorbierend)";
      textClass = "text-red-800 bg-red-50 border-red-200";
      color = "bg-red-600";
      detailtext = "Baustoff saugt Feuchtigkeit gierig auf. Extreme Frost-Tau-Schadensgefahr und beschleunigter Carbonatisierungsgrad.";
    } else if (w > 0.1) {
      eingruppierung = "Wasserhemmend";
      textClass = "text-amber-700 bg-amber-50 border-amber-200";
      color = "bg-amber-500";
      detailtext = "Ausreichende Reduzierung der Saugwirkung. Regellösung für gut ausgeführte mineralische Außenputze.";
    }

    return { w, tHours, eingruppierung, textClass, color, detailtext };
  }, [karstenTime, karstenAbsorbed]);

  // Berechnungen Thermografie
  const thermographyResults = useMemo(() => {
    let indication = "Keine Auffälligkeiten";
    let color = "bg-green-500";
    if (tempDiff > 2.0) {
      indication = "Deutlicher Hohlraum / Ablösung";
      color = "bg-red-500";
    } else if (tempDiff > 0.5) {
      indication = "Mögliche Fehlstelle";
      color = "bg-yellow-500";
    }
    return { indication, color };
  }, [tempDiff]);

  // Berechnungen Impact-Echo
  const impactEchoResults = useMemo(() => {
    // d = β · v_p / (2 · f), Formfaktor β ≈ 0,96 für Platten (ASTM C1383); f in kHz → Hz
    const beta = 0.96;
    const depth = frequency > 0 ? (beta * waveVelocity) / (2 * (frequency * 1000)) : 0; // in m
    return { depth: depth * 1000 }; // in mm
  }, [frequency, waveVelocity]);

  // Berechnungen Durchstrahlungsprüfung
  const radiographyResults = useMemo(() => {
    // Schwächungsgesetz: I = I0 * e^(-mu * d)
    // Vereinfachte Annahme für mu (Absorptionskoeffizient) basierend auf Energie
    const mu = 0.15 / radiationEnergy; // cm^-1 (stark vereinfacht)
    const transmission = Math.exp(-mu * thickness) * 100; // in %
    
    let quality = "Gut";
    let color = "bg-green-500";
    if (transmission < 1) {
      quality = "Schlecht (zu dick/dicht)";
      color = "bg-red-500";
    } else if (transmission < 5) {
      quality = "Ausreichend";
      color = "bg-yellow-500";
    }

    return { transmission, quality, color };
  }, [thickness, radiationEnergy]);

  // Chart Data für Rückprallhammer
  const chartData = useMemo(() => {
    const labels = [];
    const data0 = [];
    const data90 = [];
    const dataMinus90 = [];

    for (let r = 20; r <= 60; r += 2) {
      labels.push(r);
      data0.push(0.027 * Math.pow(r, 2.1));
      data90.push(0.027 * Math.pow(Math.max(10, r - 3), 2.1));
      dataMinus90.push(0.027 * Math.pow(r + 3, 2.1));
    }

    return {
      labels,
      datasets: [
        {
          label: 'Horizontal (0°)',
          data: data0,
          borderColor: '#E63946',
          backgroundColor: 'rgba(230, 57, 70, 0.1)',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'Nach unten (+90°)',
          data: data90,
          borderColor: '#457B9D',
          backgroundColor: 'rgba(69, 123, 157, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
        },
        {
          label: 'Nach oben (-90°)',
          data: dataMinus90,
          borderColor: '#1D3557',
          backgroundColor: 'rgba(29, 53, 87, 0.1)',
          borderWidth: 2,
          borderDash: [2, 2],
          tension: 0.4,
        }
      ]
    };
  }, []);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: { display: true, text: 'Druckfestigkeit f_c [N/mm²]' },
        min: 0,
        max: 100
      },
      x: {
        title: { display: true, text: 'Rückprallzahl R [-]' }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatDeZahl(context.raw as number, 1)} N/mm²`
        }
      }
    }
  };

  // Sub-renderer for the distributed Device Pool
  const renderEmbeddedGeraete = (tabKey: string, deviceIds: string[]) => {
    // filter devices
    const devices = geraeteList.filter(d => deviceIds.includes(d.id));
    
    // get selected device for this tab
    const selectedId = selectedGeraetLocal[tabKey] || deviceIds[0];
    const currentDevice = devices.find(d => d.id === selectedId) || devices[0];

    const handleSelect = (id: string) => {
      setSelectedGeraetLocal(prev => ({
        ...prev,
        [tabKey]: id
      }));
    };

    if (devices.length === 0) return null;

    return (
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-home-grau/20 mt-8 flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="flex flex-col gap-1 border-b border-home-grau/20 pb-4">
          <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <Wrench className="text-shiraz" size={20} />
            Praxis-Gerätepool &amp; Fach-Datenblätter
          </h3>
          <p className="text-xs text-slate-500">
            Wählen Sie ein Prüfgerät aus, um detaillierte normative und bautechnische Spezifikationen einzusehen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Device Selector Cards */}
          <div className="lg:col-span-5 flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {devices.map((dev) => {
              const isSelected = dev.id === selectedId;
              return (
                <button
                  key={dev.id}
                  onClick={() => handleSelect(dev.id)}
                  className={`w-full p-4 rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-shiraz text-white border-shiraz shadow-md'
                      : 'bg-white text-slate-850 border-home-grau/30 hover:bg-slate-100 hover:border-home-grau/40'
                  }`}
                >
                  <span className="font-bold text-sm flex items-center justify-between">
                    {dev.name}
                    {isSelected && <CheckCircle2 size={16} className="text-white" />}
                  </span>
                  <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'} line-clamp-1`}>
                    {dev.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Device Details Sheet */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-4 shadow-sm animate-in fade-in duration-300">
            {currentDevice && (
              <>
                <div className="flex flex-col gap-1 border-b border-home-grau/20 pb-2">
                  <div className="text-[10px] font-mono tracking-wider uppercase text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full w-max font-bold">
                    {currentDevice.categoryLabel}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{currentDevice.name}</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Relevante Norm / Regelwerk</span>
                    <span className="text-slate-800 font-medium">{currentDevice.norm || 'Keine Angabe'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Typischer Einsatzzweck</span>
                    <span className="text-slate-800 font-medium">{currentDevice.useCase}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Technische &amp; Methodische Details</span>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-home-grau/10">
                    {currentDevice.details.map((detail, idx) => (
                      <li key={idx} className="indent-[-12px] pl-[12px] text-slate-700">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button aria-pressed={activeTab === 'mechanisch'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'mechanisch' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('mechanisch')}
        >
          <Hammer size={16} /> Mechanisch (Rückprall)
        </button>
        <button aria-pressed={activeTab === 'akustisch'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'akustisch' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('akustisch')}
        >
          <Waves size={16} /> Akustisch (US, IE)
        </button>
        <button aria-pressed={activeTab === 'elektromagnetisch'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'elektromagnetisch' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('elektromagnetisch')}
        >
          <Radio size={16} /> Elektromagnetisch
        </button>
        <button aria-pressed={activeTab === 'elektrochemisch'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'elektrochemisch' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('elektrochemisch')}
        >
          <Battery size={16} /> Elektrochemisch
        </button>
        <button aria-pressed={activeTab === 'thermisch'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'thermisch' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('thermisch')}
        >
          <Thermometer size={16} /> Thermisch &amp; Strahlung
        </button>
        <button aria-pressed={activeTab === 'holz'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'holz' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('holz')}
        >
          <Trees size={16} /> Holz &amp; Feuchte
        </button>
        <button aria-pressed={activeTab === 'dgzfp'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'dgzfp' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('dgzfp')}
          id="dgzfp-tab-btn"
        >
          <Award size={16} /> DGZfP &amp; Richtlinien
        </button>
      </div>

      {activeTab === 'mechanisch' && <MechanischTab angle={angle} chartData={chartData} karstenAbsorbed={karstenAbsorbed} karstenResults={karstenResults} karstenTime={karstenTime} options={options} rebound={rebound} reboundResults={reboundResults} renderEmbeddedGeraete={renderEmbeddedGeraete} setAngle={setAngle} setKarstenAbsorbed={setKarstenAbsorbed} setKarstenTime={setKarstenTime} setRebound={setRebound} setTorrentKt={setTorrentKt} setTorrentMoisture={setTorrentMoisture} torrentKt={torrentKt} torrentMoisture={torrentMoisture} torrentResults={torrentResults} />}

      {activeTab === 'akustisch' && <AkustischTab frequency={frequency} impactEchoResults={impactEchoResults} renderEmbeddedGeraete={renderEmbeddedGeraete} setFrequency={setFrequency} setVelocity={setVelocity} setWaveVelocity={setWaveVelocity} ultrasonicResults={ultrasonicResults} velocity={velocity} waveVelocity={waveVelocity} />}

      {activeTab === 'elektromagnetisch' && <ElektromagnetischTab barDiameter={barDiameter} bewehrungssucherResults={bewehrungssucherResults} cover={cover} dielectric={dielectric} radarResults={radarResults} renderEmbeddedGeraete={renderEmbeddedGeraete} setBarDiameter={setBarDiameter} setCover={setCover} setDielectric={setDielectric} setTimeOfFlight={setTimeOfFlight} timeOfFlight={timeOfFlight} />}

      {activeTab === 'elektrochemisch' && <ElektrochemischTab potential={potential} potentialResults={potentialResults} renderEmbeddedGeraete={renderEmbeddedGeraete} setPotential={setPotential} setWennerResistance={setWennerResistance} setWennerSpacing={setWennerSpacing} wennerResistance={wennerResistance} wennerResults={wennerResults} wennerSpacing={wennerSpacing} />}

      {activeTab === 'thermisch' && <ThermischTab radiationEnergy={radiationEnergy} radiographyResults={radiographyResults} renderEmbeddedGeraete={renderEmbeddedGeraete} setRadiationEnergy={setRadiationEnergy} setTempDiff={setTempDiff} setThickness={setThickness} tempDiff={tempDiff} thermographyResults={thermographyResults} thickness={thickness} />}

      {activeTab === 'holz' && <HolzTab renderEmbeddedGeraete={renderEmbeddedGeraete} />}

      <ModuleFooter 
        weblinks={[
          { title: "Deutsche Gesellschaft für Zerstörungsfreie Prüfung e.V. (DGZfP)", url: "https://www.dgzfp.de" }
        ]}
        wikipedia={[
          { title: 'Zerstörungsfreie Prüfung', url: 'https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Pr%C3%BCfung' },
          { title: 'Rückprallhammer', url: 'https://de.wikipedia.org/wiki/R%C3%BCckprallhammer' },
          { title: 'Ultraschallprüfung', url: 'https://de.wikipedia.org/wiki/Ultraschallpr%C3%BCfung' },
          { title: 'Bodenradar', url: 'https://de.wikipedia.org/wiki/Bodenradar' }
        ]}
        literatur={[
          'Schickert, M.: Verfahren der zerstörungsfreien Prüfung im Bauwesen.',
          'DGZfP-Merkblatt B 04: Ultraschallverfahren zur Zerstörungsfreien Prüfung im Bauwesen.'
        ]}
        regelwerke={[
          { title: 'DIN EN 12504-2 (Prüfung von Beton - Bestimmung der Rückprallzahl)' },
          { title: 'DIN EN 12504-4 (Prüfung von Beton - Bestimmung der Ultraschalllaufzeit)' },
          { title: 'DGZfP-Merkblätter der Reihe B (ZfP im Bauwesen)', url: 'https://publikationen.dgzfp.de/' }
        ]}
        formeln={[
          {
            formel: 'E_{dyn} = \\rho \\cdot v^2 \\cdot \\frac{(1+\\nu)(1-2\\nu)}{1-\\nu}',
            erklaerung: 'Dynamischer Elastizitätsmodul E_{dyn} aus der Ultraschall-Impulsgeschwindigkeit v (mit Dichte \\rho und Querdehnzahl \\nu).',
            quelle: 'DIN EN 12504-4'
          },
          {
            formel: 'd = \\frac{v \\cdot t}{2}',
            erklaerung: 'Tiefenberechnung beim akustischen Impuls-Echo-Verfahren aus Ultraschallgeschwindigkeit v und Reflexionslaufzeit t.',
            quelle: 'DGZfP-Merkblatt B 04'
          },
          {
            formel: 'd = \\frac{c_0}{\\sqrt{\\varepsilon_r}} \\cdot \\frac{t}{2}',
            erklaerung: 'Tiefenberechnung beim Boden- und Betonradar (GPR): c_0 = Lichtgeschwindigkeit im Vakuum, \\varepsilon_r = relative Dielektrizitätskonstante des Baustoffs, t = Signallaufzeit.',
            quelle: 'DGZfP Richtlinie B1'
          },
          {
            formel: 'I = I_0 \\cdot e^{-\\mu \\cdot d}',
            erklaerung: 'Lambert-Beersches Schwächungsgesetz für Durchstrahlungsprüfungen (Röntgen- / Gammametrie): I_0 = Ursprungsintensität, \\mu = linearer Schwächungskoeffizient, d = Bauteildicke.',
            quelle: 'DIN EN ISO 5579'
          }
        ]}
      />
      <style>{`
        @keyframes scan {
          0% { transform: translateX(0); }
          100% { transform: translateX(1000%); }
        }
      `}</style>
    </div>
  );
}
