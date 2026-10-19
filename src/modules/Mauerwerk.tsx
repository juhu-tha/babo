import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Edges } from '@react-three/drei';
import * as THREE from 'three';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Layers, Ruler, ShieldCheck, Calculator, BookOpen, ArrowRight, ShieldAlert } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const stoneTypes = {
  'MZ': { name: 'Mauerziegel (Ton-Vollstein)', K: { 'NM': 0.45, 'LM': 0.35, 'DM': 0.75 }, fvk0: { 'NM': 0.20, 'LM': 0.15, 'DM': 0.30 }, lambda: 0.81, rho: 1800, desc: 'Keramisch gebrannter Ton. Extreme Langlebigkeit, exzellente Dauerhaftigkeit (Klinker), hervorragender Witterungswiderstand, hoher Energiewert bei Herstellung.' },
  'KSV': { name: 'Kalksandstein (KS)', K: { 'NM': 0.45, 'LM': 0.35, 'DM': 0.80 }, fvk0: { 'NM': 0.20, 'LM': 0.15, 'DM': 0.40 }, lambda: 0.99, rho: 2000, desc: 'Hydrothermal dampfgehärtetes Kalk-Sand-Gemisch. Sehr hoher Schallschutz, höchste Tragfähigkeit, ökologisch vorteilhafter als massiv gebrannt' },
  'PB': { name: 'Porenbeton (PB)', K: { 'NM': 0.45, 'LM': 0.35, 'DM': 0.80 }, fvk0: { 'NM': 0.15, 'LM': 0.15, 'DM': 0.30 }, lambda: 0.09, rho: 400, desc: 'Aufgeblähter und dampfgehärteter Quarz-Kalk-Zementstein. Herausragende monolithische Wärmedämmung, sehr geringe Masse, mäßiger Schallschutz' },
  'HLZ': { name: 'Hochlochziegel (HLz)', K: { 'NM': 0.35, 'LM': 0.30, 'DM': 0.55 }, fvk0: { 'NM': 0.15, 'LM': 0.10, 'DM': 0.20 }, lambda: 0.12, rho: 800, desc: 'Tonziegel mit wärmetechnisch optimiertem Lochbild, teils mit Naturdämmstoff-Verfüllung (Perlit/Mineralwolle) für monolithische Wände' },
  'LH': { name: 'Lehmbaustein (LH)', K: { 'NM': 0.35, 'LM': 0.30, 'DM': 0.50 }, fvk0: { 'NM': 0.10, 'LM': 0.08, 'DM': 0.15 }, lambda: 0.73, rho: 1600, desc: 'Ungebrannter, solar luftgetrockneter Tonstein nach DIN 18945. Phänomenale Feuchtigkeitsregulierung, extrem CO₂-arm, unstabilisierter Lehm nahezu verlustfrei wiederverwendbar' },
  'LB': { name: 'Leichtbetonstein', K: { 'NM': 0.40, 'LM': 0.35, 'DM': 0.65 }, fvk0: { 'NM': 0.15, 'LM': 0.15, 'DM': 0.30 }, lambda: 0.16, rho: 800, desc: 'Zementgebundener Bims- oder Blähtonstein. Unempfindlich gegen Baufeuchte, gute Wärmedämmung bei mäßiger Tragfähigkeit' },
};

const bonds = [
  { id: 'laeufer', name: 'Läuferverband (1/2 Stein Versatz)' },
  { id: 'block', name: 'Blockverband' },
  { id: 'kreuz', name: 'Kreuzverband' },
];

function MauerwerkThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'naturstein');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 mt-6">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Mauerwerk & Stein im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den drei Säulen der Mauerwerkskunde:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('mauerwerk')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Baustoff-Eigenschaften</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Steinarten (Ziegel, KS, Porenbeton), Festigkeitsbemessung & Mauerwerksverbände im 3D-Modell.
          </span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_mauerwerk')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Mauerwerksprodukte & Praxis</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Hintermauer- und Vormauerziegel, Planblöcke, Mauermörtelarten, Leistungserklärung und CE-Kennzeichnung nach BauPVO (EU) 2024/3110.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={handleDauerhaftigkeitClick}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Alterung & Denkmalschutz</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Salzkristallisation, Frostsprengung, chemischer Verwitterungsschutz & Sanierputze.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Mauerwerk() {
  const [activeTab, setActiveTab] = useState<'material' | 'verband' | 'bemessung' | 'ziegellexikon' | 'steckbrief'>('steckbrief');
  const [steckbriefMaterial, setSteckbriefMaterial] = useState<'mauerziegel' | 'kalksandstein' | 'porenbeton' | 'leichtbeton' | 'lehmstein'>('mauerziegel');

  const [stone, setStone] = useState<keyof typeof stoneTypes>('MZ');
  const [mortar, setMortar] = useState<'NM' | 'LM' | 'DM'>('NM');
  const [fb, setFb] = useState(12); // Steinfestigkeit
  const [fm, setFm] = useState(5); // Mörtelfestigkeit
  const [height, setHeight] = useState(2.75); // Wandhöhe in m
  const [thickness, setThickness] = useState(0.24); // Wanddicke in m
  const [eccentricity, setEccentricity] = useState(0.05); // Exzentrizität in m
  const [sigmaD, setSigmaD] = useState(1.0); // Vorhandene Druckspannung in N/mm² für Schub
  
  // Verband
  const [bond, setBond] = useState(bonds[0].id);
  const [stoneLength, setStoneLength] = useState(240); // mm
  const [stoneHeight, setStoneHeight] = useState(113); // mm

  const results = useMemo(() => {
    // 1. Mauerwerksdruckfestigkeit fk
    const K = stoneTypes[stone].K[mortar] || 0.45;
    let fk = 0;
    if (mortar === 'DM') {
      if (stone === 'HLZ') {
        fk = K * Math.pow(fb, 0.7); // Für Dünnbettmörtel und Hochlochziegel (Gruppe 2)
      } else {
        fk = K * Math.pow(fb, 0.85); // Für Dünnbettmörtel (Vollsteine etc.)
      }
    } else {
      fk = K * Math.pow(fb, 0.7) * Math.pow(fm, 0.3); // Für Normal- und Leichtmörtel
    }
    const fd = fk / 1.5; // gamma_M = 1.5

    // 2. Knicken (vereinfacht)
    const slenderness = height / thickness;
    // phi_i,m = 1 - 2(e/t)
    const phi = Math.max(0, 1 - 2 * (eccentricity / thickness));
    
    // Tragfähigkeit N_Rd = Phi * A * fd
    const A = thickness * 1.0; // pro lfm
    const NRd = phi * A * fd * 1000; // in kN/m

    // 3. Schubfestigkeit fvk
    const fvk0 = stoneTypes[stone].fvk0[mortar] || 0.20;
    // fvk = fvk0 + 0.4 * sigma_d (vereinfacht nach EC6)
    // Begrenzung auf max Werte je nach Stein/Mörtel (hier vereinfacht)
    const fvk_calc = fvk0 + 0.4 * sigmaD;
    const fvk_max = mortar === 'DM' ? 1.2 : 1.5; // Stark vereinfachte Obergrenze
    const fvk = Math.min(fvk_calc, fvk_max);
    const fvd = fvk / 1.5; // gamma_M = 1.5

    // 4. Überbindemaß
    const minOverlap = Math.max(0.4 * stoneHeight, 45); // mm
    const actualOverlap = bond === 'laeufer' ? stoneLength / 2 : stoneLength / 4; // Vereinfachte Annahme für Block/Kreuz
    const overlapValid = actualOverlap >= minOverlap;

    const labels = [];
    const fvkData = [];
    const currentPointData = [];

    for (let s = 0; s <= 5; s += 0.25) {
      labels.push(s.toFixed(2));
      const current_fvk_calc = fvk0 + 0.4 * s;
      const current_fvk = Math.min(current_fvk_calc, fvk_max);
      fvkData.push(current_fvk);
      
      if (Math.abs(s - sigmaD) < 0.125) {
        currentPointData.push(fvk);
      } else {
        currentPointData.push(null);
      }
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Schubfestigkeit f_vk [MPa]',
          data: fvkData,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Aktueller Wert',
          data: currentPointData,
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        }
      ]
    };

    return { fk, fd, slenderness, phi, NRd, K, fvk0, fvk, fvd, minOverlap, actualOverlap, overlapValid, chartData };
  }, [stone, mortar, fb, fm, height, thickness, eccentricity, sigmaD, stoneLength, stoneHeight, bond]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        title: { display: true, text: 'Vorhandene Druckspannung σ_d [N/mm²]', font: { weight: 'bold' as const } }
      },
      y: {
        title: { display: true, text: 'Schubfestigkeit f_vk [MPa]', font: { weight: 'bold' as const } },
        min: 0,
      }
    }
  };

  const BrickWall = () => {
    const bricks = [];
    const rows = 8;
    const l = stoneLength / 1000;
    const h = stoneHeight / 1000;
    const t = thickness;
    const joint = 0.012; // 12mm Fuge
    // Header (Binder) width is typically around half a stretcher minus half a joint
    const w = Math.max(0.04, (l - joint) / 2);

    const xMin = -1.2;
    const xMax = 1.2;

    for (let r = 0; r < rows; r++) {
      const y = r * (h + joint) - (rows * h) / 2 + h / 2;

      if (bond === 'laeufer') {
        // Stretcher bond (Läuferverband): offset alternates between 0 and half a full stretcher
        const isShifted = (r % 2) === 1;
        const offset = isShifted ? (l + joint) / 2 : 0;
        const startX = xMin - offset - l;
        
        let c = 0;
        for (let x = startX; x < xMax + l; x += l + joint) {
          const brickX = x + l / 2;
          
          // Seeded/hashed random value so color remains consistent and doesn't flicker
          const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
          const color = new THREE.Color('#94a3b8').offsetHSL(0.02 * (hash - 0.5), 0, (hash - 0.5) * 0.08);

          bricks.push(
            <Box key={`l-${r}-${c}`} args={[l, h, t]} position={[brickX, y, 0]}>
              <meshStandardMaterial color={color} roughness={0.8} />
              <Edges scale={1.01} threshold={15} color="#1e293b" />
            </Box>
          );
          c++;
        }
      } else if (bond === 'block') {
        // Block bond (Blockverband): alternating stretcher (even rows) and header (odd rows) courses
        const isHeaderRow = (r % 2) === 1;
        
        if (!isHeaderRow) {
          // Stretcher row
          const startX = xMin - l;
          let c = 0;
          for (let x = startX; x < xMax + l; x += l + joint) {
            const brickX = x + l / 2;
            const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
            const color = new THREE.Color('#94a3b8').offsetHSL(0.02 * (hash - 0.5), 0, (hash - 0.5) * 0.08);

            bricks.push(
              <Box key={`b-s-${r}-${c}`} args={[l, h, t]} position={[brickX, y, 0]}>
                <meshStandardMaterial color={color} roughness={0.8} />
                <Edges scale={1.01} threshold={15} color="#1e293b" />
              </Box>
            );
            c++;
          }
        } else {
          // Header row with 1/4 brick offset relative to stretcher course
          const offset = l / 4;
          const startX = xMin - offset - w;
          let c = 0;
          for (let x = startX; x < xMax + w; x += w + joint) {
            const brickX = x + w / 2;
            const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
            const color = new THREE.Color('#94a3b8').offsetHSL(0.02 * (hash - 0.5), 0, (hash - 0.5) * 0.08);

            bricks.push(
              <Box key={`b-h-${r}-${c}`} args={[w, h, t]} position={[brickX, y, 0]}>
                <meshStandardMaterial color={color} roughness={0.85} />
                <Edges scale={1.01} threshold={15} color="#1e293b" />
              </Box>
            );
            c++;
          }
        }
      } else if (bond === 'kreuz') {
        // Cross bond (Kreuzverband): alternating stretcher and header courses, but stretcher courses are offset relative to each other by half a brick (l/2)
        const isHeaderRow = (r % 2) === 1;
        
        if (!isHeaderRow) {
          // Stretcher row: alternate offset of 0 (r % 4 === 0) or l / 2 (r % 4 === 2)
          const isShifted = (r % 4) === 2;
          const offset = isShifted ? (l + joint) / 2 : 0;
          const startX = xMin - offset - l;
          let c = 0;
          for (let x = startX; x < xMax + l; x += l + joint) {
            const brickX = x + l / 2;
            const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
            const color = new THREE.Color('#94a3b8').offsetHSL(0.02 * (hash - 0.5), 0, (hash - 0.5) * 0.08);

            bricks.push(
              <Box key={`k-s-${r}-${c}`} args={[l, h, t]} position={[brickX, y, 0]}>
                <meshStandardMaterial color={color} roughness={0.8} />
                <Edges scale={1.01} threshold={15} color="#1e293b" />
              </Box>
            );
            c++;
          }
        } else {
          // Header row is shifted by l/4
          const offset = l / 4;
          const startX = xMin - offset - w;
          let c = 0;
          for (let x = startX; x < xMax + w; x += w + joint) {
            const brickX = x + w / 2;
            const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
            const color = new THREE.Color('#94a3b8').offsetHSL(0.02 * (hash - 0.5), 0, (hash - 0.5) * 0.08);

            bricks.push(
              <Box key={`k-h-${r}-${c}`} args={[w, h, t]} position={[brickX, y, 0]}>
                <meshStandardMaterial color={color} roughness={0.85} />
                <Edges scale={1.01} threshold={15} color="#1e293b" />
              </Box>
            );
            c++;
          }
        }
      }
    }

    return <group>{bricks}</group>;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Mauerwerksbau &amp; Naturstein
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Mauerwerk ist ein extrem dauerhafter Verbundwerkstoff aus Mauersteinen und Mauermörtel. Das mechanische Zusammenwirken beider Komponenten bestimmt das komplexe, anisotrope Tragverhalten unter Druck-, Zug- und Scherbeanspruchung.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Baustoff-Steckbrief
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'material' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('material')}
          >
            <Layers size={16} /> Steine &amp; Mörtel
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'verband' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('verband')}
          >
            <Ruler size={16} /> Mauerwerksverband
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'bemessung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('bemessung')}
          >
            <Calculator size={16} /> Festigkeit &amp; Bemessung
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'ziegellexikon' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('ziegellexikon')}
          >
            <BookOpen size={16} /> Ziegel-Lexikon
          </button>
        </div>

        {activeTab === 'material' && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-6">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Materialwahl</h3>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Die Mauerwerksdruckfestigkeit <span className="font-mono"><FormulaText text="f_k" /></span> setzt sich aus der Steinfestigkeit (<span className="font-mono"><FormulaText text="f_b" /></span>) und der Mörtelfestigkeit (<span className="font-mono"><FormulaText text="f_m" /></span>) zusammen.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Material</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Steinart</label><InfoTooltip text="Art des Mauersteins." /></div>
                  <select 
                    className="p-2 border border-home-grau rounded-md bg-white"
                    value={stone}
                    onChange={(e) => {
                      const val = e.target.value as keyof typeof stoneTypes;
                      setStone(val);
                      if (val === 'MZ') { setFb(12); setFm(5); }
                      else if (val === 'KSV') { setFb(20); setFm(5); }
                      else if (val === 'PB') { setFb(4); setFm(2); }
                      else if (val === 'HLZ') { setFb(8); setFm(5); }
                      else if (val === 'LH') { setFb(2); setFm(2); }
                      else if (val === 'LB') { setFb(6); setFm(5); }
                    }}
                  >
                    {Object.entries(stoneTypes).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Mörtelart</label><InfoTooltip text="Art des verwendeten Mauermörtels." /></div>
                  <select 
                    className="p-2 border border-home-grau rounded-md bg-white"
                    value={mortar}
                    onChange={(e) => setMortar(e.target.value as any)}
                  >
                    <option value="NM">Normalmörtel (NM)</option>
                    <option value="LM">Leichtmörtel (LM)</option>
                    <option value="DM">Dünnbettmörtel (DM)</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6 p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
                <p className="text-text-main/80 mb-2 font-medium">{stoneTypes[stone].desc}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-main/60">Rohdichte <FormulaText text="\rho" />:</span>
                    <span className="font-bold">{stoneTypes[stone].rho} kg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-main/60">Wärmeleitf. <FormulaText text="\lambda" />:</span>
                    <span className="font-bold">{stoneTypes[stone].lambda} W/(mK)</span>
                  </div>
                </div>
              </div>

              <Slider info="Druckfestigkeit des Mauersteins." label={<FormulaText text="Steinfestigkeit f_b" />} min={2} max={40} step={1} value={fb} unit="MPa" onChange={(e) => setFb(Number(e.target.value))} />
              <div className="mt-4">
                <Slider  label={<FormulaText text="Mörtelfestigkeit f_m" />} min={1} max={20} step={1} value={fm} unit="MPa" onChange={(e) => setFm(Number(e.target.value))} />
              </div>
            </div>
          </div>
          
          {/* Spalte 2: Detaillierte Baustoff-Steckbriefe & Vergleiche der 4 Hauptsteinarten */}
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-text-main/80" /> Baustoff-Gegenüberstellung
              </h3>
              
              <div className="space-y-4">
                {/* Ton-Ziegel */}
                <div className={`p-3.5 rounded-lg border transition-all ${stone === 'MZ' || stone === 'HLZ' ? 'bg-white border-home-grau shadow-sm ring-1 ring-home-grau/10' : 'bg-white/50 border-home-grau/30 hover:border-home-grau/40'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                      <span>🧱 (Ton-)Ziegel (MZ / HLz)</span>
                    </h4>
                    <span className="text-[10px] bg-home-grau/20 text-text-main px-2 py-0.5 rounded font-bold uppercase">Keramisch</span>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    <strong>Herstellung:</strong> Ton, Lehm und Sand geformt und im Tunnelofen bei <strong>900 °C bis 1100 °C gebrannt</strong> (keramische Sinterung).
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-text-main/60 border-t border-home-grau/10 pt-2 font-mono">
                    <div>🔊 Schallschutz: <span className="text-text-main font-semibold">Sehr gut (MZ)</span></div>
                    <div>🔥 Brandschutz: <span className="text-text-main font-semibold">Klasse A1</span></div>
                    <div>🌡️ Leitf. λ: <span className="text-text-main font-semibold">0,07-0,45 W/mK</span></div>
                    <div>Tragfähigkeit: <span className="text-text-main font-semibold">Sehr hoch</span></div>
                  </div>
                  <div className="mt-2 text-[10.5px] text-text-main/60 bg-off-white p-2 rounded border border-home-grau/10">
                    💡 <strong>Vorteil:</strong> Extreme Wetterdauerhaftigkeit (Klinker), monolithisch wärmedämmend (HLz). <span className="text-rose-700">Nachteil:</span> Energieintensives Brennen (hohe CO₂-Emissionen).
                  </div>
                </div>

                {/* Kalksandstein */}
                <div className={`p-3.5 rounded-lg border transition-all ${stone === 'KSV' ? 'bg-white border-home-grau shadow-sm ring-1 ring-home-grau/10' : 'bg-white/50 border-home-grau/30 hover:border-home-grau/40'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                      <span>🧱 Kalksandstein (KS)</span>
                    </h4>
                    <span className="text-[10px] bg-home-grau/20 text-text-main px-2 py-0.5 rounded font-bold uppercase">Autoklaviert</span>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    <strong>Herstellung:</strong> Quarzsand, Kalk und Wasser hydrothermal dampfgehärtet bei circa <strong>200 °C unter 16 bar Druck</strong>.
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-text-main/60 border-t border-home-grau/10 pt-2 font-mono">
                    <div>🔊 Schallschutz: <span className="text-text-main font-semibold">Exzellent (Masse)</span></div>
                    <div>🔥 Brandschutz: <span className="text-text-main font-semibold">Klasse A1</span></div>
                    <div>🌡️ Leitf. λ: <span className="text-text-main font-semibold">0,99-1,30 W/mK</span></div>
                    <div>Tragfähigkeit: <span className="text-text-main font-semibold">Extrem hoch</span></div>
                  </div>
                  <div className="mt-2 text-[10.5px] text-text-main/60 bg-off-white p-2 rounded border border-home-grau/10">
                    💡 <strong>Vorteil:</strong> Unerreichte Tragfähigkeit und Schallschutz, sehr geringe Prozessenergie erforderlich. <span className="text-rose-700">Nachteil:</span> Keinerlei eigene dämmende Wirkung.
                  </div>
                </div>

                {/* Porenbeton */}
                <div className={`p-3.5 rounded-lg border transition-all ${stone === 'PB' ? 'bg-white border-home-grau shadow-sm ring-1 ring-home-grau/10' : 'bg-white/50 border-home-grau/30 hover:border-home-grau/40'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                      <span>🧱 Porenbeton (PB)</span>
                    </h4>
                    <span className="text-[10px] bg-home-grau/20 text-text-main px-2 py-0.5 rounded font-bold uppercase">Poren-Blähstein</span>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    <strong>Herstellung:</strong> Quarzmehl, Kalk, Zement gepaart mit <strong>Aluminiumpulver</strong> zur H2-Porenbildung, danach dampfgehärtet im Autoklaven.
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-text-main/60 border-t border-home-grau/10 pt-2 font-mono">
                    <div>🔊 Schallschutz: <span className="text-text-main font-semibold">Gering</span></div>
                    <div>🔥 Brandschutz: <span className="text-text-main font-semibold">Klasse A1</span></div>
                    <div>🌡️ Leitf. λ: <span className="text-text-main font-semibold">0,07-0,16 W/mK</span></div>
                    <div>Tragfähigkeit: <span className="text-text-main font-semibold">Mäßig</span></div>
                  </div>
                  <div className="mt-2 text-[10.5px] text-text-main/60 bg-off-white p-2 rounded border border-home-grau/10">
                    💡 <strong>Vorteil:</strong> Spitzenreiter der Eigendämmung (WDVS-frei), federleichte Baustelle, unkompliziert trennbar. <span className="text-rose-700">Nachteil:</span> Schallempfindlich, geringere Festigkeit.
                  </div>
                </div>

                {/* Lehmbausteine */}
                <div className={`p-3.5 rounded-lg border transition-all ${stone === 'LH' ? 'bg-white border-home-grau shadow-sm ring-1 ring-home-grau/10' : 'bg-white/50 border-home-grau/30 hover:border-home-grau/40'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                      <span>🧱 Lehmbausteine (LH)</span>
                    </h4>
                    <span className="text-[10px] bg-home-grau/20 text-text-main px-2 py-0.5 rounded font-bold uppercase">Luftgetrocknet</span>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    <strong>Herstellung:</strong> Aus ungebranntem Ton, Sand und Schluff mechanisch gepresst und <strong>rein solar/luftgetrocknet</strong> (völlig emissionsfrei).
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-text-main/60 border-t border-home-grau/10 pt-2 font-mono">
                    <div>🔊 Schallschutz: <span className="text-text-main font-semibold">Sehr gut (Masse)</span></div>
                    <div>🔥 Brandschutz: <span className="text-text-main font-semibold">Klasse A1</span></div>
                    <div>🌡️ Leitf. λ: <span className="text-text-main font-semibold">0.47-0.73 W/mK</span></div>
                    <div>Tragfähigkeit: <span className="text-text-main font-semibold">Gering (2-5 MPa)</span></div>
                  </div>
                  <div className="mt-2 text-[10.5px] text-text-main/60 bg-off-white p-2 rounded border border-home-grau/10">
                    💡 <strong>Vorteil:</strong> Unschlagbare Raumklima-Regulierung (Hygroskopisch), zu 100% zirkulär einsumpf- und wiederverwendbar. <span className="text-rose-700">Nachteil:</span> nicht wasserbeständig (erweicht bei Durchfeuchtung); Einsatz außen nur mit geeigneter Anwendungsklasse und Witterungsschutz (DIN 18945).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'bemessung' && (
        <div className="animate-in fade-in duration-300 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Festigkeit &amp; Bemessung</h3>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p>
              Zudem ist unbewehrtes Mauerwerk stark knickgefährdet, was durch den Abminderungsfaktor <span className="font-mono"><FormulaText text="Φ" /></span> berücksichtigt wird. Die Schubfestigkeit hängt maßgeblich von der überlagerten Druckspannung ab (Reibung).
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Geometrie & Knicken (Druck)</h3>
              <Slider info="Effektive Wandhöhe." label={<FormulaText text="Wandhöhe h_{ef}" />} min={2.0} max={4.0} step={0.05} value={height} unit="m" onChange={(e) => setHeight(Number(e.target.value))} />
              <div className="mt-4">
                <Slider  label={<FormulaText text="Wanddicke t" />} min={0.115} max={0.49} step={0.01} value={thickness} unit="m" onChange={(e) => setThickness(Number(e.target.value))} />
              </div>
              <div className="mt-4">
                <Slider info="Exzentrizität der Lasteinleitung." label={<FormulaText text="Exzentrizität e" />} min={0} max={thickness/2} step={0.01} value={eccentricity} unit="m" onChange={(e) => setEccentricity(Number(e.target.value))} />
              </div>
            </div>

          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Schubbeanspruchung</h3>
              <Slider  
                label={<FormulaText text="Vorhandene Druckspannung σ_d" />} 
                min={0} max={5.0} step={0.1} 
                value={sigmaD} unit="N/mm²" 
                info="Eine höhere Auflast (Druckspannung) erhöht die Schubfestigkeit durch Reibung in den Lagerfugen."
                onChange={(e) => setSigmaD(Number(e.target.value))} 
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-shiraz text-white p-6 rounded-xl shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Ergebnisse (Druckfestigkeit)</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-white/70 text-sm mb-1"><FormulaText text="Charakt. Festigkeit f_k" /></div>
                  <div className="text-3xl font-bold">{results.fk.toFixed(2)} MPa</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm mb-1"><FormulaText text="Bemessungswert f_d" /></div>
                  <div className="text-3xl font-bold">{results.fd.toFixed(2)} MPa</div>
                </div>
              </div>
              <div className="text-sm text-white/80 border-t border-white/20 pt-4">
                Formel: <FormulaText text="f_k = K · f_b^{0.7} · f_m^{0.3}" /> (K = {results.K})
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Tragfähigkeit (Druck pro lfm Wand)</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-home-grau text-sm mb-1"><FormulaText text="Schlankheit h_{ef}/t" /></div>
                  <div className="text-xl font-bold text-text-main">{results.slenderness.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-home-grau text-sm mb-1 flex items-center gap-1">
                    <FormulaText text="Knickbeiwert Φ" />
                    <InfoTooltip text="Vereinfachte Berechnung des Abminderungsfaktors für Knicken in der Wandmitte (Φ_m). Die tatsächliche Knicklänge h_ef hängt von den Halterungen am Wandkopf und -fuß ab." />
                  </div>
                  <div className={`text-xl font-bold ${results.phi < 0.2 ? 'text-shiraz' : 'text-text-main'}`}>
                    {results.phi.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="bg-shiraz/5 p-4 rounded-lg border border-shiraz/20">
                <div className="text-shiraz text-sm font-bold mb-1"><FormulaText text="Max. Normalkraft N_{Rd}" /></div>
                <div className="text-3xl font-bold text-shiraz">{results.NRd.toFixed(0)} kN/m</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Schubfestigkeit</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-home-grau text-sm mb-1"><FormulaText text="Haftscherfestigkeit f_{vk0}" /></div>
                  <div className="text-xl font-bold text-text-main">{results.fvk0.toFixed(2)} MPa</div>
                </div>
                <div>
                  <div className="text-home-grau text-sm mb-1"><FormulaText text="Charakt. Schubfestigkeit f_{vk}" /></div>
                  <div className="text-xl font-bold text-text-main">{results.fvk.toFixed(2)} MPa</div>
                </div>
              </div>
              <div className="bg-shiraz/5 p-4 rounded-lg border border-shiraz/20">
                <div className="text-shiraz text-sm font-bold mb-1"><FormulaText text="Bemessungswert f_{vd}" /></div>
                <div className="text-3xl font-bold text-shiraz">{results.fvd.toFixed(2)} MPa</div>
              </div>
              <div className="text-xs text-home-grau mt-4 mb-4">
                Formel: <FormulaText text="f_{vk} = f_{vk0} + 0.4 · σ_d" /> (vereinfacht)
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 h-[250px] flex flex-col">
                <h4 className="text-sm font-bold text-center mb-2">Schubfestigkeit vs. Druckspannung</h4>
                <div className="flex-1 relative">
                  <Line data={results.chartData} options={chartOptions as any} />
                </div>
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Schubfestigkeit (Reibung)</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="160" viewBox="0 0 350 160">
                  {/* Mauersteine */}
                  <rect x="125" y="40" width="100" height="40" fill="#94a3b8" stroke="#A3113E" strokeWidth="2" />
                  <rect x="125" y="90" width="100" height="40" fill="#94a3b8" stroke="#A3113E" strokeWidth="2" />
                  
                  {/* Mörtelfuge */}
                  <rect x="125" y="80" width="100" height="10" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                  <text x="175" y="88" fontSize="8" fill="#1e293b" textAnchor="middle">Mörtel</text>

                  {/* Druckkraft (Auflast) */}
                  <path d="M 175 10 L 175 35" stroke="#475569" strokeWidth="3" markerEnd="url(#arrow-blue-mauer)" />
                  <text x="185" y="25" fontSize="12" fill="#475569" textAnchor="start" fontWeight="bold">σ_d (Druck)</text>

                  {/* Schubkraft */}
                  <path d="M 60 60 L 115 60" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow-red-mauer)" />
                  <text x="85" y="50" fontSize="12" fill="#A3113E" textAnchor="middle" fontWeight="bold">τ (Schub)</text>

                  {/* Reibungswiderstand */}
                  <path d="M 235 85 L 180 85" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrow-orange-mauer)" />
                  <text x="260" y="90" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">Reibung</text>

                  <defs>
                    <marker id="arrow-blue-mauer" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                    <marker id="arrow-red-mauer" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                    </marker>
                    <marker id="arrow-orange-mauer" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Die Schubfestigkeit von Mauerwerk basiert auf der Haftscherfestigkeit des Mörtels und der Reibung in den Lagerfugen. Je höher die aufliegende Druckspannung (σ_d, blau), desto größer ist der Reibungswiderstand gegen Abscheren (orange).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'verband' && (
        <div className="animate-in fade-in duration-300 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Mauerwerksverband</h3>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-2">Mauerwerksverband</h3>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Verbandsart</label><InfoTooltip text="Art des Mauerwerksverbands." /></div>
              <select 
                className="p-2 border border-home-grau rounded-md bg-white"
                value={bond}
                onChange={(e) => setBond(e.target.value)}
              >
                {bonds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <Slider info="Länge des Mauersteins." label={<FormulaText text="Steinlänge l_u" />} min={115} max={490} step={5} value={stoneLength} unit="mm" onChange={(e) => setStoneLength(Number(e.target.value))} />
            <Slider  label={<FormulaText text="Steinhöhe h_u" />} min={52} max={249} step={1} value={stoneHeight} unit="mm" onChange={(e) => setStoneHeight(Number(e.target.value))} />

            <div className={`mt-4 p-4 rounded-lg border ${results.overlapValid ? 'bg-slate-100 border-slate-200' : 'bg-shiraz/10 border-shiraz/30'}`}>
              <h4 className={`text-sm font-bold mb-2 ${results.overlapValid ? 'text-slate-800' : 'text-shiraz'}`}>
                Überbindemaß-Kontrolle
              </h4>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-main/70">Erforderlich (min):</span>
                <span className="font-bold">{results.minOverlap.toFixed(0)} mm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-main/70">Vorhanden (ca.):</span>
                <span className="font-bold">{results.actualOverlap.toFixed(0)} mm</span>
              </div>
              {!results.overlapValid && (
                <div className="text-xs text-shiraz mt-2 font-medium">
                  Warnung: Das Überbindemaß ist zu gering! Die Tragfähigkeit der Wand ist nicht gewährleistet.
                </div>
              )}
            </div>
            <div className="text-xs text-home-grau mt-2">
              Regel: <FormulaText text="l_{ol} \ge 0{,}4 \cdot h_u" /> und <FormulaText text="l_{ol} \ge 45\text{ mm}" />
            </div>
            
            <div className="mt-2 flex flex-col gap-2">
              {bond === 'laeufer' && (
                <div className="text-xs text-text-main/75 leading-relaxed bg-white border border-home-grau/15 rounded-lg p-3 shadow-2xs">
                  <span className="font-bold text-shiraz block mb-1">Läuferverband</span>
                  Alle Steine sind als Läufer (Längsseite parallel zur Wandflucht) vermauert. Der Versatz der Stoßfugen zwischen den Schichten beträgt genau die halbe Steinlänge (<FormulaText text="l_{ol} = 0{,}5 \cdot l_u" />). Dies ist der heutzutage wirtschaftlichste Standardverband.
                </div>
              )}
              {bond === 'block' && (
                <div className="text-xs text-text-main/75 leading-relaxed bg-white border border-home-grau/15 rounded-lg p-3 shadow-2xs">
                  <span className="font-bold text-shiraz block mb-1">Blockverband</span>
                  Es wechseln sich eine Läuferschicht und eine Binderschicht (Steine quer vermauert) ab. Die Stoßfugen der Läuferschichten fluchten exakt senkrecht übereinander. Der Versatz zwischen Läufer- und Binderschicht beträgt ein Viertel der Steinlänge (<FormulaText text="l_{ol} = 0{,}25 \cdot l_u" />).
                </div>
              )}
              {bond === 'kreuz' && (
                <div className="text-xs text-text-main/75 leading-relaxed bg-white border border-home-grau/15 rounded-lg p-3 shadow-2xs">
                  <span className="font-bold text-shiraz block mb-1">Kreuzverband</span>
                  Ähnlich aufgebaut wie der Blockverband aus abwechselnden Läufer- und Binderschichten. Um ein diagonales Kreuzmuster der Fugen zu erzeugen, ist jedoch jede zweite Läuferschicht um eine halbe Steinlänge versetzt gemauert (<FormulaText text="0{,}5 \cdot l_u" />). Statisch sehr robust und historisch sehr geschätzt.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col h-[400px]">
             <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">3D Visualisierung (Verband)</h3>
             <div className="flex-1 relative w-full h-full bg-slate-100/50 rounded-lg overflow-hidden border border-home-grau/30">
              <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 2], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <OrbitControls makeDefault enableZoom={true} />
                <BrickWall />
              </Canvas>
             </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ziegellexikon' && (
        <div className="animate-in fade-in duration-300 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Wissen kompakt: Ziegel-Lexikon</h3>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 flex flex-col gap-2">
            <p>
              Ziegel gehören zu den ältesten und bewährtesten Baustoffen. Basierend auf dem <strong>Ziegel-Lexikon</strong> (herausgegeben vom Bundesverband der Deutschen Ziegelindustrie e.V.) sind hier die maßgeblichen Kennwerte und Eigenschaften für Ziegelmauerwerk aufgeführt.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">Klassifizierung & Kennwerte</h3>
                <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
                  <li>
                    <strong>Festigkeitsklasse (SFK):</strong> Gibt die normative (Druck-)Festigkeit des Steins an.
                    Typische SFK-Werte für porosierte Mauerziegel: 4, 6, 8, 12. Für Klinker oder belastetes Mauerwerk: 20 und höher. Je höher die SFK, desto tragfähiger der Stein.
                  </li>
                  <li>
                    <strong>Rohdichteklasse (RDK):</strong> Gibt das Gewicht / die Dichte des Ziegels in kg/dm³ an.
                    Werte liegen oft zwischen 0,6 (sehr leichter Hochlochziegel für gute Wärmedämmung) und 2,4 (schwerer Vollziegel oder Klinker für guten Schallschutz).
                  </li>
                  <li>
                    <strong>Wärmeleitfähigkeit (λ):</strong> Hochwärmedämmende Ziegel (teils ungefüllt, teils mit Mineralwolle oder Perlit gefüllt) erreichen λ-Werte von 0,07 bis 0,14 W/(mK) und ermöglichen damit einschaliges Mauerwerk ohne zusätzliche Außendämmung (WDVS).
                  </li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">Ziegelformate</h3>
                <p className="text-sm text-text-main/80 mb-3">Ziegel werden traditionell im Oktameter-System geplant (Baurichtmaß = 1/8 Meter = 12,5 cm).</p>
                <div className="grid grid-cols-1 gap-2 text-sm text-text-main/80">
                  <div className="flex justify-between border-b border-home-grau/30 pb-1"><span>Dünnformat (DF)</span><span className="font-mono text-xs">240 × 115 × 52 mm</span></div>
                  <div className="flex justify-between border-b border-home-grau/30 pb-1"><span>Normalformat (NF)</span><span className="font-mono text-xs">240 × 115 × 71 mm</span></div>
                  <div className="flex justify-between border-b border-home-grau/30 pb-1"><span>2-faches DF (2 DF)</span><span className="font-mono text-xs">240 × 115 × 113 mm</span></div>
                  <div className="flex justify-between"><span>Großformate (Blocks)</span><span className="font-mono text-xs text-right">z. B. 248 × 365 × 249 mm</span></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">Wichtige Ziegelarten</h3>
                <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
                  <li>
                    <strong>Planziegel:</strong> Ziegel, deren Lagerflächen (Ober- und Unterseite) nach dem Brennen planparallel auf einen Millimeterbruchteil geschliffen werden. Sie werden mit <em>Dünnbettmörtel</em> (Fugendicke 1 bis 3 mm) vermauert, was die Wärmedämmung deutlich verbessert.
                  </li>
                  <li>
                    <strong>Blockziegel:</strong> Werden im klassischen Dickbettverfahren (Normalmörtel, Fugendicke ca. 12 mm) verarbeitet.
                  </li>
                  <li>
                    <strong>Hintermauerziegel:</strong> Werden verputzt oder verkleidet. Optimiert auf Bauphysik (Wärmeschutz / Schallschutz).
                  </li>
                  <li>
                    <strong>Vormauerziegel / Klinker:</strong> Sichtbares Mauerwerk (Verblender). Sie sind frostbeständig, weisen eine geringe Wasseraufnahme auf und schützen die Fassade vor der Witterung.
                  </li>
                  <li>
                    <strong>Wärmedämmziegel:</strong> Oft mit Hohlkammern, die passgenau mit Dämmstoff (z.B. Mineralwolle oder Perlit) gefüllt sind, um U-Werte für Plus-Energie-Häuser zu erfüllen.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300 space-y-6">
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/20 shadow-inner">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Wählen Sie den gewünschten Baustoff-Steckbrief:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'mauerziegel', label: 'Mauerziegel' },
                { id: 'kalksandstein', label: 'Kalksandstein' },
                { id: 'porenbeton', label: 'Porenbeton' },
                { id: 'leichtbeton', label: 'Leichtbeton' },
                { id: 'lehmstein', label: 'Lehmbaustein' }
              ].map((item) => {
                const isActive = steckbriefMaterial === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSteckbriefMaterial(item.id as any)}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer min-h-[50px] ${
                      isActive
                        ? 'bg-shiraz border-shiraz text-white shadow-md font-extrabold translate-y-[-1px]'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <BaustoffProfil materialKey={steckbriefMaterial} />
        </div>
      )}
      </div>
    
      <MauerwerkThematicLinks current="baustoff" />

      <ModuleFooter 
        wikipedia={[
        { title: 'Mauerwerk', url: 'https://de.wikipedia.org/wiki/Mauerwerk' },
        { title: 'Mauerwerksverband', url: 'https://de.wikipedia.org/wiki/Mauerwerksverband' },
        { title: 'Mauerziegel', url: 'https://de.wikipedia.org/wiki/Mauerziegel' },
        { title: 'Ziegel-Lexikon (Bundesverband der Deutschen Ziegelindustrie e. V.)', url: 'https://www.ziegel.de/lexikon' }
      ]}
        literatur={[
          'Schubert, P. (2019): Mauerwerk - Baustoffe, Bemessung und Ausführung (Ernst & Sohn)',
          'Jäger, W. (Hrsg.): Mauerwerk-Kalender (Jährliche Ausgaben, Ernst & Sohn Verlag)',
          'Wendehorst Baustoffkunde, 27. Auflage, Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 1996-1-1:2024-03 / DIN EN 1996-1-1/NA:2019-12 (Eurocode 6: Bemessung und Konstruktion von Mauerwerksbauten - Teil 1-1: Allgemeine Regeln)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1996-1-1' },
          { title: 'DIN EN 1996-3:2024-03 / DIN EN 1996-3/NA:2019-12 (Eurocode 6 - Teil 3: Vereinfachte Berechnungsmethoden für unbewehrte Mauerwerksbauten)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1996-3' },
          { title: 'DIN EN 771-1:2015-11 (Festlegungen für Mauersteine - Teil 1: Mauerziegel)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+771-1' },
          { title: 'DIN EN 771-2:2015-11 (Festlegungen für Mauersteine - Teil 2: Kalksandsteine)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+771-2' },
          { title: 'DIN EN 771-3:2015-11 (Festlegungen für Mauersteine - Teil 3: Betonmauersteine)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+771-3' },
          { title: 'DIN EN 771-4:2015-11 (Festlegungen für Mauersteine - Teil 4: Porenbetonsteine)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+771-4' },
          { title: 'DIN EN 998-2:2017-02 (Festlegungen für Mörtel im Mauerwerksbau - Teil 2: Mauermörtel)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+998-2' },
          { title: 'DIN 20000-401:2017-01 (Anwendung von Mauerziegeln nach DIN EN 771-1)', url: 'https://www.dinmedia.de/de/suche?q=DIN+20000-401' },
          { title: 'DIN 20000-412:2019-06 (Anwendung von Mauermörtel nach DIN EN 998-2)', url: 'https://www.dinmedia.de/de/suche?q=DIN+20000-412' }
        ]}
        formeln={[
          {
            formel: 'f_k = K \\cdot f_b^{0{,}7} \\cdot f_m^{0{,}2}',
            erklaerung: 'Charakteristische Druckfestigkeit f_k von Mauerwerk aus Normalmörtel nach Eurocode 6. K ist eine steinartspezifische Konstante, f_b die normierte Steindruckfestigkeit und f_m die Mörteldruckfestigkeit.',
            quelle: 'DIN EN 1996-1-1:2024-03 Gl. 3.1'
          },
          {
            formel: 'f_{vk} = f_{vk0} + 0{,}4 \\cdot \\sigma_d \\quad \\left(\\le f_{vlt}\\right)',
            erklaerung: 'Charakteristische Haftscherfestigkeit f_{vk}: f_{vk0} = Anfangsscherfestigkeit ohne Auflast, \\sigma_d = planmäßige vertikale Druckspannung, f_{vlt} = oberer Grenzwert.',
            quelle: 'DIN EN 1996-1-1:2024-03'
          },
          {
            formel: 'l_{ol} \\ge 0{,}4 \\cdot h_u  \\quad \\land \\quad l_{ol} \\ge 45\\text{ mm}',
            erklaerung: 'Überbindemaß-Regel zur Gewährleistung eines statischen Kraftverteilungswinkels im Mauerwerksverband: l_{ol} = Überbindemaß, h_u = Steinhöhe.',
            quelle: 'DIN EN 1996-1-1:2024-03'
          }
        ]}
      />
    </div>
  );
}

