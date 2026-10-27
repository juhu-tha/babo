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
import inhalt from '@/content/zfp/ZfP.json';
import { MdText } from '@/src/components/inhalt/MdText';
import {
  rueckprallZfp, rueckprallKurven, ultraschallZfp, bewehrungsSignal, georadar, potentialRisikoZfp, wenner, torrentKlasse,
  torrentFeuchte, karstenZfp, thermografieStufe, impactEchoZfp, durchstrahlung,
} from '@/src/calc/pruefverfahren';

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

  // Rechenkern src/calc/pruefverfahren.ts – die Komponente ordnet nur noch Texte und Farben zu
  // Rückprallhammer: ΔR = −3 (nach unten) / +3 (nach oben), einheitliche Lehrkurve f_c ≈ 0,0125·R^2,22 (ohne Kalibrierung nur Schätzung)
  const reboundResults = useMemo(() => rueckprallZfp(rebound, angle), [rebound, angle]);

  // Ultraschall: E_dyn = ρ·v²·(1+ν)(1−2ν)/(1−ν) mit ρ = 2400 kg/m³, ν = 0,2; f_c ≈ 20·(v − 2) (grob)
  const ultrasonicResults = useMemo(() => ultraschallZfp(velocity), [velocity]);

  // Bewehrungssucher: vereinfachtes Anzeigemodell
  const bewehrungssucherResults = useMemo(() => ({ signalStrength: bewehrungsSignal(cover, barDiameter) }), [cover, barDiameter]);

  // Georadar: v = c/√ε_r, d = v·t/2
  const radarResults = useMemo(() => georadar(dielectric, timeOfFlight), [dielectric, timeOfFlight]);

  // Potentialmessung
  const potentialResults = useMemo(() => {
    const stufe = potentialRisikoZfp(potential);
    if (stufe === 'hoch') return { risk: inhalt.werte.hoch90, color: "bg-red-500" };
    if (stufe === 'mittel') return { risk: inhalt.werte.mittelUnsicher, color: "bg-yellow-500" };
    return { risk: inhalt.werte.gering10, color: "bg-green-500" };
  }, [potential]);

  // Wenner-Sonde: ρ = 2π·a·R
  const wennerResults = useMemo(() => {
    const w = wenner(wennerSpacing, wennerResistance);
    const anzeige = {
      sehr_hoch: { rate: "Sehr hoch", color: "bg-red-600", textClass: "text-red-800 bg-red-50 border-red-200", description: inhalt.werte.feuchterChloridbelasteterOderKarbonatisi },
      mittel: { rate: "Mittel", color: "bg-amber-500", textClass: "text-amber-800 bg-amber-50 border-amber-200", description: inhalt.werte.durchschnittlicherFeuchteUndCarbonatisie },
      niedrig: { rate: "Niedrig", color: "bg-emerald-500", textClass: "text-emerald-800 bg-emerald-50 border-emerald-100", description: inhalt.werte.vorwiegendTrockenHoheBetondichte },
      vernachlaessigbar: { rate: "Vernachlässigbar", color: "bg-green-600", textClass: "text-green-800 bg-green-50", description: inhalt.werte.sehrTrockenesBauteilOder },
    }[w.stufe];
    return { rho: w.rho, rhoKohmCm: w.rhoKohmCm, ...anzeige };
  }, [wennerSpacing, wennerResistance]);

  // Gaspermeationsmessung (Torrent)
  const torrentResults = useMemo(() => {
    const klasse = {
      5: { klassifizierung: inhalt.werte.klasseVSehrHoch, bewertung: inhalt.werte.ungenügendSehrOffenporig, textClass: "text-red-800 bg-red-50 border-red-200", description: inhalt.werte.extremDurchlässigesPorensystemDringender },
      4: { klassifizierung: inhalt.werte.klasseIvHoch, bewertung: inhalt.werte.minderwertigerSchutz, textClass: "text-rose-700 bg-rose-50 border-rose-200", description: inhalt.werte.erhöhtesRisikoFürBewehrungskorrosion },
      3: { klassifizierung: inhalt.werte.klasseIiiMittel, bewertung: "Durchschnittlich", textClass: "text-amber-700 bg-amber-50 border-amber-200", description: inhalt.werte.durchschnittlicherBetonüberdeckungswider },
      2: { klassifizierung: inhalt.werte.klasseIiNiedrig, bewertung: inhalt.werte.guteQualität, textClass: "text-emerald-700 bg-emerald-50 border-emerald-200", description: inhalt.werte.sicheresBauteilverhaltenAusreichenderPor },
      1: { klassifizierung: inhalt.werte.klasseISehrNiedrig, bewertung: inhalt.werte.hervorragendDicht, textClass: "text-green-800 bg-green-50 border-green-200", description: inhalt.werte.maximaleDauerhaftigkeitDasBauteil },
    }[torrentKlasse(torrentKt)];
    const feuchte = torrentFeuchte(torrentMoisture);
    const moistureWarning = feuchte === 'kritisch' ? inhalt.werte.kritischeBetonfeuchte85Die : feuchte === 'hoch' ? inhalt.werte.hoheBetonfeuchte70Die : null;
    return { ...klasse, moistureWarning, moistureCritical: feuchte === 'kritisch' };
  }, [torrentKt, torrentMoisture]);

  // Karstensches Röhrchen: w = V·10/(A·√t), A und Grenzwerte DIN 4108-3 aus src/calc/karsten.ts
  const karstenResults = useMemo(() => {
    const k = karstenZfp(karstenTime, karstenAbsorbed);
    const anzeige = {
      saugend: { eingruppierung: inhalt.werte.starkSaugendAbsorbierend, textClass: "text-red-800 bg-red-50 border-red-200", color: "bg-red-600", detailtext: inhalt.werte.baustoffSaugtFeuchtigkeitGierig },
      hemmend: { eingruppierung: "Wasserhemmend", textClass: "text-amber-700 bg-amber-50 border-amber-200", color: "bg-amber-500", detailtext: inhalt.werte.ausreichendeReduzierungDerSaugwirkung },
      abweisend: { eingruppierung: inhalt.werte.wasserabweisendHydrophob, textClass: "text-green-800 bg-green-50 border-green-200", color: "bg-green-600", detailtext: inhalt.werte.sehrGuteSperrwirkungGegen },
    }[k.stufe];
    return { w: k.w, tHours: k.tHours, hinweise: k.hinweise, ...anzeige };
  }, [karstenTime, karstenAbsorbed]);

  // Thermografie
  const thermographyResults = useMemo(() => {
    const stufe = thermografieStufe(tempDiff);
    if (stufe === 'deutlich') return { indication: inhalt.werte.deutlicherHohlraumAblösung, color: "bg-red-500" };
    if (stufe === 'moeglich') return { indication: inhalt.werte.möglicheFehlstelle, color: "bg-yellow-500" };
    return { indication: inhalt.werte.keineAuffälligkeiten, color: "bg-green-500" };
  }, [tempDiff]);

  // Impact-Echo: d = β·v_p/(2f) mit β = 0,96 (ASTM C1383), Kern bauwerksuntersuchung.impactEcho
  const impactEchoResults = useMemo(() => impactEchoZfp(frequency, waveVelocity), [frequency, waveVelocity]);

  // Durchstrahlungsprüfung: I/I₀ = exp(−μ·d), μ = 0,15/E (stark vereinfacht)
  const radiographyResults = useMemo(() => {
    const d = durchstrahlung(thickness, radiationEnergy);
    const anzeige = {
      schlecht: { quality: inhalt.werte.schlechtZuDickDicht, color: "bg-red-500" },
      ausreichend: { quality: "Ausreichend", color: "bg-yellow-500" },
      gut: { quality: "Gut", color: "bg-green-500" },
    }[d.stufe];
    return { transmission: d.transmission, ...anzeige };
  }, [thickness, radiationEnergy]);

  // Chart Data für Rückprallhammer
  const chartData = useMemo(() => {
    const k = rueckprallKurven(20, 60, 2);
    const labels = k.labels;
    const data0 = k.horizontal;
    const data90 = k.unten;
    const dataMinus90 = k.oben;

    return {
      labels,
      datasets: [
        {
          label: inhalt.werte.horizontal0,
          data: data0,
          borderColor: '#E63946',
          backgroundColor: 'rgba(230, 57, 70, 0.1)',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: inhalt.werte.nachUnten90,
          data: data90,
          borderColor: '#457B9D',
          backgroundColor: 'rgba(69, 123, 157, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
        },
        {
          label: inhalt.werte.nachOben90,
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
        title: { display: true, text: inhalt.werte.druckfestigkeitFCN },
        min: 0,
        max: 100
      },
      x: {
        title: { display: true, text: inhalt.werte.rückprallzahlR }
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
            <Wrench className="text-shiraz" size={20} /><MdText text={inhalt.texte.praxisGerätepoolFachDatenblätter} /></h3>
          <p className="text-xs text-slate-500"><MdText text={inhalt.texte.wählenSieEinPrüfgerät} /></p>
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
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]"><MdText text={inhalt.texte.relevanteNormRegelwerk} /></span>
                    <span className="text-slate-800 font-medium">{currentDevice.norm || inhalt.werte.keineAngabe}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]"><MdText text={inhalt.texte.typischerEinsatzzweck} /></span>
                    <span className="text-slate-800 font-medium">{currentDevice.useCase}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]"><MdText text={inhalt.texte.technischeMethodischeDetails} /></span>
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
          <Hammer size={16} /><MdText text={inhalt.texte.mechanischRückprall} /></button>
        <button aria-pressed={activeTab === 'akustisch'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'akustisch' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('akustisch')}
        >
          <Waves size={16} /><MdText text={inhalt.texte.akustischUsIe} /></button>
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
          <Thermometer size={16} /><MdText text={inhalt.texte.thermischStrahlung} /></button>
        <button aria-pressed={activeTab === 'holz'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'holz' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('holz')}
        >
          <Trees size={16} /><MdText text={inhalt.texte.holzFeuchte} /></button>
        <button aria-pressed={activeTab === 'dgzfp'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'dgzfp' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('dgzfp')}
          id="dgzfp-tab-btn"
        >
          <Award size={16} /><MdText text={inhalt.texte.dgzfpRichtlinien} /></button>
      </div>

      {activeTab === 'mechanisch' && <MechanischTab angle={angle} chartData={chartData} karstenAbsorbed={karstenAbsorbed} karstenResults={karstenResults} karstenTime={karstenTime} options={options} rebound={rebound} reboundResults={reboundResults} renderEmbeddedGeraete={renderEmbeddedGeraete} setAngle={setAngle} setKarstenAbsorbed={setKarstenAbsorbed} setKarstenTime={setKarstenTime} setRebound={setRebound} setTorrentKt={setTorrentKt} setTorrentMoisture={setTorrentMoisture} torrentKt={torrentKt} torrentMoisture={torrentMoisture} torrentResults={torrentResults} />}

      {activeTab === 'akustisch' && <AkustischTab frequency={frequency} impactEchoResults={impactEchoResults} renderEmbeddedGeraete={renderEmbeddedGeraete} setFrequency={setFrequency} setVelocity={setVelocity} setWaveVelocity={setWaveVelocity} ultrasonicResults={ultrasonicResults} velocity={velocity} waveVelocity={waveVelocity} />}

      {activeTab === 'elektromagnetisch' && <ElektromagnetischTab barDiameter={barDiameter} bewehrungssucherResults={bewehrungssucherResults} cover={cover} dielectric={dielectric} radarResults={radarResults} renderEmbeddedGeraete={renderEmbeddedGeraete} setBarDiameter={setBarDiameter} setCover={setCover} setDielectric={setDielectric} setTimeOfFlight={setTimeOfFlight} timeOfFlight={timeOfFlight} />}

      {activeTab === 'elektrochemisch' && <ElektrochemischTab potential={potential} potentialResults={potentialResults} renderEmbeddedGeraete={renderEmbeddedGeraete} setPotential={setPotential} setWennerResistance={setWennerResistance} setWennerSpacing={setWennerSpacing} wennerResistance={wennerResistance} wennerResults={wennerResults} wennerSpacing={wennerSpacing} />}

      {activeTab === 'thermisch' && <ThermischTab radiationEnergy={radiationEnergy} radiographyResults={radiographyResults} renderEmbeddedGeraete={renderEmbeddedGeraete} setRadiationEnergy={setRadiationEnergy} setTempDiff={setTempDiff} setThickness={setThickness} tempDiff={tempDiff} thermographyResults={thermographyResults} thickness={thickness} />}

      {activeTab === 'holz' && <HolzTab renderEmbeddedGeraete={renderEmbeddedGeraete} />}

      <ModuleFooter 
        weblinks={inhalt.daten["ZfP.weblinks"]}
        wikipedia={[
          { title: inhalt.werte.zerstörungsfreiePrüfung, url: 'https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Pr%C3%BCfung' },
          { title: 'Rückprallhammer', url: 'https://de.wikipedia.org/wiki/R%C3%BCckprallhammer' },
          { title: 'Ultraschallprüfung', url: 'https://de.wikipedia.org/wiki/Ultraschallpr%C3%BCfung' },
          { title: 'Bodenradar', url: 'https://de.wikipedia.org/wiki/Bodenradar' }
        ]}
        literatur={inhalt.daten["ZfP.literatur"]}
        regelwerke={inhalt.daten["ZfP.regelwerke"]}
        formeln={inhalt.daten["ZfP.formeln"]}
      />
      <style>{inhalt.werte.keyframesScan0Transform}</style>
    </div>
  );
}
