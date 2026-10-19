import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo, useEffect } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Edges, Cylinder } from '@react-three/drei';
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
  RadialLinearScale,
  RadarController,
} from 'chart.js';
import { Line, Radar } from 'react-chartjs-2';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Activity, Droplets, Timer, Info, ShieldAlert, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  RadarController
);

const holzArten = {
  'Fichte (Vollholz)': { qr: 0.16, qt: 0.33, ql: 0.01, lambda: 0.13, rho: 450, beta0: 0.8 },
  'Kiefer (Vollholz)': { qr: 0.17, qt: 0.31, ql: 0.01, lambda: 0.13, rho: 520, beta0: 0.8 },
  'Buche (Vollholz)': { qr: 0.22, qt: 0.45, ql: 0.01, lambda: 0.17, rho: 720, beta0: 0.65 },
  'Eiche (Vollholz)': { qr: 0.18, qt: 0.34, ql: 0.01, lambda: 0.17, rho: 690, beta0: 0.65 },
  'Brettschichtholz (BSH)': { qr: 0.16, qt: 0.33, ql: 0.01, lambda: 0.13, rho: 450, beta0: 0.7 },
  'Furnierschichtholz (FSH)': { qr: 0.05, qt: 0.05, ql: 0.01, lambda: 0.15, rho: 500, beta0: 0.7 },
  'OSB': { qr: 0.02, qt: 0.02, ql: 0.02, lambda: 0.13, rho: 600, beta0: 0.9 },
};

const crossSections = [
  { id: 'brett', name: 'Brett (flach)' },
  { id: 'kantholz', name: 'Kantholz (quadratisch)' },
  { id: 'bohle', name: 'Bohle (dick)' },
  { id: 'rund', name: 'Rundholz' },
];

const festigkeitsklassen = {
  'C16 (Vollholz)': { fm: 16, ft0: 10, ft90: 0.4, fc0: 17, fc90: 2.2, fv: 3.2, E0mean: 8000, gammaM: 1.3 },
  'C24 (Vollholz)': { fm: 24, ft0: 14.5, ft90: 0.4, fc0: 21, fc90: 2.5, fv: 4.0, E0mean: 11000, gammaM: 1.3 },
  'C30 (Vollholz)': { fm: 30, ft0: 19, ft90: 0.4, fc0: 24, fc90: 2.7, fv: 4.0, E0mean: 12000, gammaM: 1.3 },
  'GL24h (BSH)': { fm: 24, ft0: 19.2, ft90: 0.5, fc0: 24, fc90: 2.5, fv: 3.5, E0mean: 11500, gammaM: 1.25 },
  'GL30h (BSH)': { fm: 30, ft0: 24, ft90: 0.5, fc0: 30, fc90: 2.5, fv: 3.5, E0mean: 13600, gammaM: 1.25 },
};

const kmodTable = {
  'NKL 1': { 'ständig': 0.6, 'lang': 0.7, 'mittel': 0.8, 'kurz': 0.9, 'sehr kurz': 1.1 },
  'NKL 2': { 'ständig': 0.6, 'lang': 0.7, 'mittel': 0.8, 'kurz': 0.9, 'sehr kurz': 1.1 },
  'NKL 3': { 'ständig': 0.5, 'lang': 0.55, 'mittel': 0.65, 'kurz': 0.7, 'sehr kurz': 0.9 },
};

function WoodThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Holz im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechsle nahtlos zwischen den drei Säulen der Holz-Baustofflehre:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('holz')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Baustoff-Kennwerte</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Anisotropes Quellen/Schwinden (3D-Modell), Holzfestigkeiten (EC5) & Kennwerte.
          </span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_holzprodukte')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Holzprodukte & Praxis</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Konstruktionsvollholz, CLT, Vor- und Nachteile & Vorbemessungsrechner.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={() => setActiveTab('holzkorrosion')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Dauerhaftigkeit</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Holzzerstörende Pilze/Insekten, Witterung & baulicher Holzschutz nach DIN 68800.
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

export default function Holz() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'grundlagen' | 'schwinden' | 'festigkeit' | 'kriechen'>('steckbrief');

  const [holz, setHolz] = useState<keyof typeof holzArten>('Fichte (Vollholz)');
  const [querschnitt, setQuerschnitt] = useState(crossSections[0].id);
  const [uStart, setUStart] = useState(30);
  
  // Dimensions
  const [breite, setBreite] = useState(120);
  const [dicke, setDicke] = useState(24);
  const [laenge, setLaenge] = useState(350);
  
  // Environment
  const [temp, setTemp] = useState(20);
  const [rh, setRh] = useState(65);
  const [lagerDauer, setLagerDauer] = useState(30);
  
  // Eccentricity
  const [exzentrizitaetX, setExzentrizitaetX] = useState(0);
  const [exzentrizitaetY, setExzentrizitaetY] = useState(50);

  // Scaling factor for deformations
  const [skalierungsfaktor, setSkalierungsfaktor] = useState(10);

  // Strength Parameters
  const [festigkeitsklasse, setFestigkeitsklasse] = useState<keyof typeof festigkeitsklassen>('C24 (Vollholz)');
  const [nkl, setNkl] = useState<keyof typeof kmodTable>('NKL 1');
  const [kled, setKled] = useState('mittel');
  const [winkel, setWinkel] = useState(0);
  const [kc90, setKc90] = useState(1.0);

  // Handle cross-section presets
  useEffect(() => {
    if (querschnitt === 'brett') { setBreite(120); setDicke(24); }
    else if (querschnitt === 'kantholz') { setBreite(100); setDicke(100); }
    else if (querschnitt === 'bohle') { setBreite(200); setDicke(60); }
    else if (querschnitt === 'rund') { setBreite(150); setDicke(150); }
  }, [querschnitt]);

  const uGleichgewicht = useMemo(() => {
    const h = rh / 100;
    const emc = (-0.00004 * Math.pow(rh, 3) + 0.005 * Math.pow(rh, 2) + 0.05 * rh) * (1 - (temp - 20) * 0.01);
    const simpleEmc = 18 * h * h * h - 10 * h * h + 20 * h;
    return Math.max(0, Math.min(30, simpleEmc));
  }, [temp, rh]);

  const uEnde = useMemo(() => {
    const tau = Math.pow(dicke / 20, 2) * 15;
    const factor = Math.exp(-lagerDauer / tau);
    return uGleichgewicht + (uStart - uGleichgewicht) * factor;
  }, [uStart, uGleichgewicht, lagerDauer, dicke]);

  const { qr, qt, ql } = holzArten[holz];

  const effStart = Math.min(uStart, 30);
  const effEnde = Math.min(uEnde, 30);
  const deltaU = effStart - effEnde;

  const shrinkT = (deltaU * qt) / 100;
  const shrinkR = (deltaU * qr) / 100;
  const shrinkL = (deltaU * ql) / 100;

  const scaleX = 1 - shrinkT;
  const scaleY = 1 - shrinkR;
  const scaleZ = 1 - shrinkL;

  const visualShrinkT = shrinkT * skalierungsfaktor;
  const visualShrinkR = shrinkR * skalierungsfaktor;
  const visualShrinkL = shrinkL * skalierungsfaktor;

  const visualScaleX = 1 - visualShrinkT;
  const visualScaleY = 1 - visualShrinkR;
  const visualScaleZ = 1 - visualShrinkL;

  const newBreite = breite * scaleX;
  const newDicke = dicke * scaleY;
  const newLaenge = laenge * scaleZ;

  const viewScale = 0.02;

  const woodCrossTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#cbd5e1';
      context.fillRect(0, 0, 1024, 1024);

      // BoxGeometry streckt die 1024x1024 Textur auf die Bauteilabmessungen (breite x dicke).
      // Damit die Jahresringe auch auf dem 3D-Modell kreisförmig aussehen, rufen 
      // wir scale() auf, um die Verzerrung auszugleichen. Wir zeichnen dann im "mm"-Maßstab.
      const scaleX = Math.max(breite, 1);
      const scaleY = Math.max(dicke, 1);
      
      const centerPhysX = scaleX / 2 + exzentrizitaetX;
      const centerPhysY = scaleY / 2 + exzentrizitaetY;

      context.save();
      // Streckung umkehren und in mm-Koordinaten wechseln:
      context.scale(1024 / scaleX, 1024 / scaleY);

      // Max Radius bestimmen (größte Distanz von der Markröhre zu den Ecken des Bretts)
      const maxR = Math.sqrt(Math.pow(Math.max(centerPhysX, scaleX - centerPhysX), 2) + Math.pow(Math.max(centerPhysY, scaleY - centerPhysY), 2)) + 50;

      for (let r = 2; r <= maxR; r += 4) { // Jahresringe ca. alle 4mm
        context.beginPath();
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
          const noise = (Math.sin(angle * 8) * 0.5 + Math.cos(angle * 3) * 0.2) * (r / 50); // Leichte Abweichung vom perfekten Kreis
          const x = centerPhysX + (r + noise) * Math.cos(angle);
          const y = centerPhysY + (r + noise) * Math.sin(angle);
          if (angle === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        
        // Linienstärke dynamisch anpassen. context.scale verformt auch die Linienstärke! 
        // Um eine halbwegs gleichmäßige Stärke zu haben, nehmen wir einen Mittelwert der Skalierung.
        const meanScale = (1024 / scaleX + 1024 / scaleY) / 2;
        context.lineWidth = Math.max(0.2, (3 - r * 0.005)) / meanScale * 2;
        
        context.strokeStyle = `rgba(30, 15, 0, 0.95)`;
        context.stroke();
      }
      context.restore();
      
      // Leichtes Rauschen für eine natürliche Textur
      const imageData = context.getImageData(0, 0, 1024, 1024);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 15;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
        data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
      }
      context.putImageData(imageData, 0, 0);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, [exzentrizitaetX, exzentrizitaetY, breite, dicke]);

  const woodSideTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#cbd5e1';
      context.fillRect(0, 0, 1024, 1024);

      for (let x = 0; x < 1024; x += 15) {
        context.beginPath();
        context.moveTo(x, 0);
        for (let y = 0; y <= 1024; y += 50) {
          const noise = Math.sin(y * 0.05) * 5 + Math.cos(y * 0.01) * 3;
          context.lineTo(x + noise, y);
        }
        context.lineWidth = 4;
        context.strokeStyle = `rgba(40, 20, 0, 0.8)`;
        context.stroke();
      }
      
      const imageData = context.getImageData(0, 0, 1024, 1024);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 15;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
        data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
      }
      context.putImageData(imageData, 0, 0);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.rotation = Math.PI / 2;
    return texture;
  }, []);

  const materials = useMemo(() => {
    const crossMat = new THREE.MeshStandardMaterial({ map: woodCrossTexture, roughness: 0.9 });
    const sideMat = new THREE.MeshStandardMaterial({ map: woodSideTexture, roughness: 0.9 });
    return [sideMat, sideMat, sideMat, sideMat, crossMat, crossMat];
  }, [woodCrossTexture, woodSideTexture]);

  const cylinderMaterials = useMemo(() => {
    const crossMat = new THREE.MeshStandardMaterial({ map: woodCrossTexture, roughness: 0.9 });
    const sideMat = new THREE.MeshStandardMaterial({ map: woodSideTexture, roughness: 0.9 });
    return [sideMat, crossMat, crossMat];
  }, [woodCrossTexture, woodSideTexture]);

  const cuppingFactorX = (visualShrinkT - visualShrinkR) * (exzentrizitaetY / 100);
  const cuppingFactorY = (visualShrinkT - visualShrinkR) * (exzentrizitaetX / 100);
  
  const DeformedBox = () => {
    const geom = useMemo(() => {
      const g = new THREE.BoxGeometry(breite * viewScale, dicke * viewScale, laenge * viewScale, 32, 2, 2);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        
        // yOffset depends on x distance from center
        const yOffset = x * x * cuppingFactorX * 2;
        
        // xOffset depends on y distance from center
        const xOffset = y * y * cuppingFactorY * 2;
        
        pos.setY(i, y + yOffset);
        pos.setX(i, x + xOffset);
      }
      g.computeVertexNormals();
      return g;
    }, [breite, dicke, laenge, viewScale, cuppingFactorX, cuppingFactorY]);

    return (
      <mesh geometry={geom} scale={[visualScaleX, visualScaleY, visualScaleZ]} material={materials}>
        <Edges scale={1} threshold={15} color="#334155" />
      </mesh>
    );
  };

  // Strength Calculations
  const { fm, ft0, ft90, fc0, fc90, fv, E0mean, gammaM } = festigkeitsklassen[festigkeitsklasse];
  const kmod = kmodTable[nkl][kled as keyof typeof kmodTable['NKL 1']];
  
  const fmd = (fm * kmod) / gammaM;
  const ft0d = (ft0 * kmod) / gammaM;
  const ft90d = (ft90 * kmod) / gammaM;
  const fc0d = (fc0 * kmod) / gammaM;
  const fc90d = (fc90 * kmod) / gammaM;
  const fvd = (fv * kmod) / gammaM;

  const alphaRad = (winkel * Math.PI) / 180;
  const fcad = fc0d / ((fc0d / (kc90 * fc90d)) * Math.pow(Math.sin(alphaRad), 2) + Math.pow(Math.cos(alphaRad), 2));

  const hankinsonData = useMemo(() => {
    const labels = [];
    const data = [];
    const currentPoint = [];

    for (let w = 0; w <= 90; w += 5) {
      labels.push(`${formatDeWert(w)}°`);
      const rad = (w * Math.PI) / 180;
      const currentFcad = fc0d / ((fc0d / (kc90 * fc90d)) * Math.pow(Math.sin(rad), 2) + Math.pow(Math.cos(rad), 2));
      data.push(currentFcad);
      
      if (Math.abs(w - winkel) < 2.5) {
        currentPoint.push(fcad);
      } else {
        currentPoint.push(null);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: 'Druckfestigkeit f_c,α,d [MPa]',
          data: data,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Aktueller Winkel',
          data: currentPoint,
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        }
      ]
    };
  }, [fc0d, fc90d, kc90, winkel, fcad]);

  const hankinsonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        title: { display: true, text: 'Faserwinkel α [°]', font: { weight: 'bold' as const } }
      },
      y: {
        title: { display: true, text: 'Druckfestigkeit [MPa]', font: { weight: 'bold' as const } },
        min: 0,
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Holzbau &amp; Holztechnologie
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Holz ist ein natürlicher, nachwachsender und biologisch abbaubarer Baustoff mit ausgeprägter Anisotropie. Sein mechanisches und physikalisches Verhalten wird maßgeblich von der Faserrichtung, der Feuchtigkeit und der Beanspruchungsdauer (Kriechen, kmod) bestimmt.
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
              activeTab === 'grundlagen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('grundlagen')}
          >
            <Info size={16} /> Grundlagen &amp; Theorie
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'schwinden' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('schwinden')}
          >
            <Droplets size={16} /> Schwinden &amp; Quellen
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'festigkeit' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('festigkeit')}
          >
            <Activity size={16} /> Festigkeit (EC5)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'kriechen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('kriechen')}
          >
            <Timer size={16} /> Kriechen &amp; Verformung
          </button>
        </div>

        {activeTab !== 'steckbrief' && (
        <div className="animate-in fade-in duration-300 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-main">Holzart / Werkstoff</label>
            <InfoTooltip text="Auswahl der Holzart oder des Holzwerkstoffs. Dies beeinflusst Rohdichte, Schwindmaße und Festigkeiten." />
          </div>
          <select 
            className="w-full p-3 border border-home-grau/30 rounded-xl focus:outline-none focus:border-shiraz bg-off-white"
            value={holz} 
          onChange={(e) => setHolz(e.target.value as keyof typeof holzArten)}
        >
          {Object.keys(holzArten).map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      )}

      {activeTab === 'grundlagen' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* Dynamischer Theorie-Bezug zur ausgewählten Holzart */}
          <div className="bg-shiraz/5 p-6 rounded-2xl border border-shiraz/35 space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-shiraz animate-pulse"></span>
              Spezifische Quell- &amp; Schwindtheorie für {holz}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Für die gewählte Holzart bzw. den Holzwerkstoff <strong>{holz}</strong> gelten im Fasersättigungsbereich folgende differentielle Schwindmaße (Maßänderung in % je 1% Feuchtigkeitsänderung unterhalb FSP):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] text-home-grau font-bold uppercase tracking-wider">Tangential (Ringrichtung | q_t)</span>
                <span className="text-xl font-mono font-black text-shiraz mt-1">{formatDeZahl(holzArten[holz].qt, 2)} %</span>
                <p className="text-[10px] text-slate-500 mt-1">Breitenänderung senkrecht zur radialen Schichtebene.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] text-home-grau font-bold uppercase tracking-wider">Radial (Strahlenrichtung | q_r)</span>
                <span className="text-xl font-mono font-black text-slate-800 mt-1">{formatDeZahl(holzArten[holz].qr, 2)} %</span>
                <p className="text-[10px] text-slate-500 mt-1">Dickenänderung parallel zu den Markstrahlen.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] text-home-grau font-bold uppercase tracking-wider">Longitudinal (Faserrichtung | q_l)</span>
                <span className="text-xl font-mono font-black text-slate-800 mt-1">{formatDeZahl(holzArten[holz].ql, 2)} %</span>
                <p className="text-[10px] text-slate-500 mt-1">Äußerst geringe Maßänderung längs der Faserrichtung.</p>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-home-grau/25 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-800">Umschrumpfungs-Szenario für {holz}:</div>
              <p className="leading-relaxed">
                Wird das Material von Fasersättigung (~30% Holzfeuchte) auf eine typische Wohnraum-Ausgleichsfeuchte von 12% getrocknet (<FormulaText text="\Delta u = 18\%" />), verringern sich die Abmessungen rechnerisch um:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-650">
                <li>Tangential: <strong className="font-mono text-shiraz">{formatDeZahl((18 * holzArten[holz].qt), 2)}%</strong> (Spürbare Breitenreduktion)</li>
                <li>Radial: <strong className="font-mono text-slate-800">{formatDeZahl((18 * holzArten[holz].qr), 2)}%</strong> (Moderate Dickenreduktion)</li>
                <li>Longitudinal: <strong className="font-mono text-slate-800">{formatDeZahl((18 * holzArten[holz].ql), 2)}%</strong> (Längenänderung vernachlässigbar)</li>
              </ul>
              <div className="text-[10px] text-slate-550 border-t border-home-grau/10 pt-1.5 mt-1.5 italic">
                {holz.includes('OSB') || holz.includes('Furnier') || holz.includes('Brettschichtholz') 
                  ? 'Verbundwerkstoff-Effekt: Durch die Absperrwirkung der verleimten Lagen/Furniere ist dieses Produkt maßlich extrem stabil.' 
                  : 'Naturwerkstoff-Verhalten: Das hohe Anisotropieverhältnis (qt / qr ≈ 2) führt bei ungleichmäßiger Trocknung zu typischen Schüssellungen, Verdrehungen oder Rissbildungen.'}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              Quellen und Schwinden anhand der Fasersättigung
            </h2>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Holz ist ein hygroskopisches Material, das Feuchtigkeit aus der Umgebungsluft aufnimmt oder dorthin abgibt. 
                Dieser Feuchtigkeitsaustausch findet statt, bis sich ein Gleichgewicht mit dem Umgebungsklima einstellt (Holzausgleichsfeuchte). 
                Entscheidend für das Maßänderungsverhalten (Quellen und Schwinden) ist der sogenannte <strong>Fasersättigungsbereich</strong>.
              </p>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/80">
              <li><strong>Freies Wasser (Kapillarwasser):</strong> Befindet sich in den Zellhohlräumen. Wird dieses Wasser bei der Trocknung abgegeben, sinkt zwar das Gewicht des Holzes, aber es findet <em>kein</em> Schwinden statt.</li>
              <li><strong>Gebundenes Wasser:</strong> Befindet sich in den Zellwänden.</li>
              <li><strong>Fasersättigungspunkt (FSP):</strong> Ein Zustand (bei den meisten heimischen Holzarten ca. 28 - 32 % Holzfeuchte), bei dem die Zellhohlräume wasserfrei sind, aber die Zellwände noch maximal mit Wasser gesättigt sind.</li>
              <li><strong>Quellen und Schwinden:</strong> Eine Volumenänderung (Quellen oder Schwinden) des Holzes tritt <em>ausschließlich unterhalb des Fasersättigungspunktes</em> auf. Gibt das Holz Feuchtigkeit aus den Zellwänden ab (unterhalb ~30%), ziehen sich die Zellwände zusammen (das Holz schwindet). Nimmt es Feuchtigkeit auf, weiten sich die Zellwände (das Holz quillt). Oberhalb des FSP passiert maßlich nichts.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h2 className="text-xl font-bold text-text-main mb-4">Holz vs. Holzwerkstoffe</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Vollholz (Massivholz)</h3>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
                  <p className="mb-3 font-medium">
                    Natürlich gewachsenes Holz, das durch Sägen aus dem Stammquerschnitt geschnitten wird (z. B. Bohlen, Kanthölzer, Bretter).
                  </p>
                  <div className="text-sm grid grid-cols-1 gap-2">
                    <div className="bg-green-50 text-green-800 p-3 rounded-xl border border-green-200">+ Hohe natürliche Festigkeit parallel zur Faserrichtung</div>
                    <div className="bg-green-50 text-green-800 p-3 rounded-xl border border-green-200">+ Geringer Energieaufwand in der Herstellung, ressourcenschonend</div>
                    <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-200">- Starkes anisotropes Quellen und Schwinden (verzieht sich stark, verdreht sich, reißt)</div>
                    <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-200">- Inhomogen: Fehlstellen (z.B. Äste, Risse, Faserabweichungen) mindern die Tragfähigkeit lokal</div>
                    <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-200">- Abmessungen sind strikt durch die Baumgröße (Stammdurchmesser und Baumlänge) limitiert</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-shiraz text-xl mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-shiraz animate-pulse"></div> Holzwerkstoffe (z.B. BSH, FSH, OSB, Spanplatte)</h3>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
                  <p className="mb-3 font-medium">Aus zerkleinertem Holz (Bretter, Furniere, Späne, Fasern) durch Verpressen und zumeist synthetisches Verleimen hergestellte Bauteile.</p>
                  <div className="text-sm grid grid-cols-1 gap-2">
                    <div className="bg-green-50 text-green-800 p-3 rounded-xl border border-green-200">+ Deutlich reduziertes und homogeneres Quellen/Schwinden (Sperreffekt durch kreuzweise Verleimung oder Klebstoffanteil)</div>
                    <div className="bg-green-50 text-green-800 p-3 rounded-xl border border-green-200">+ Höhere und verlässlichere Festigkeiten durch Homogenisierung (Fehlstellen werden verteilt, herausgeschnitten oder kaschiert)</div>
                    <div className="bg-green-50 text-green-800 p-3 rounded-xl border border-green-200">+ Quasi unbegrenzte Querschnitte, Längen und Formen machbar (z. B. gebogene Brettschichtholz-Träger)</div>
                    <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-200">- Höherer Primärenergieeinsatz bei der Produktion (Trocknen, Pressen, Leimen)</div>
                    <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-200">- Verwendung von synthetischen Klebstoffen (Ausgasungspotenzial (VOCs), Verwertung am Lebensende oft problematisch)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schwinden' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main">Anisotropes Schwinden (3D)</h2>
          
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p>
              Holz ist ein stark anisotropes Material. Es schwindet und quillt in tangentialer, radialer und longitudinaler Richtung unterschiedlich stark. Zudem sind die Festigkeiten stark abhängig von der Faserrichtung, der Holzfeuchte und der Dauer der Lasteinwirkung (Berechnung nach DIN EN 1995-1-1 / Eurocode 5).
          </p>
        </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Holzprodukt / Holzart</label><InfoTooltip text="Art des verwendeten Holzes oder Holzwerkstoffs." /></div>
            <select 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={holz}
              onChange={(e) => setHolz(e.target.value as keyof typeof holzArten)}
            >
              {Object.keys(holzArten).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            
            <div className="mt-2 p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-main/60">Rohdichte <FormulaText text="\rho" />:</span>
                  <span className="font-bold">{formatDeWert(holzArten[holz].rho)} kg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/60">Wärmeleitf. <FormulaText text="\lambda" />:</span>
                  <span className="font-bold">{formatDeWert(holzArten[holz].lambda)} W/(mK)</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-text-main/60">Abbrandrate <FormulaText text="\beta_0" /> (Brandschutz):</span>
                  <span className="font-bold">{formatDeWert(holzArten[holz].beta0)} mm/min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Querschnitt</label><InfoTooltip text="Abmessungen des Bauteilquerschnitts." /></div>
            <select 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={querschnitt}
              onChange={(e) => setQuerschnitt(e.target.value)}
            >
              {crossSections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <Slider
            label="Einbaufeuchte (u_start)" info="Holzfeuchte zum Zeitpunkt des Einbaus."
            min={5} max={40} step={1}
            value={uStart} unit="%"
            onChange={(e) => setUStart(Number(e.target.value))}
          />
          
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main">Lagerung & Umgebung</h3>
            <Slider
              label="Temperatur" 
              min={-10} max={40} step={1}
              value={temp} unit="°C"
              onChange={(e) => setTemp(Number(e.target.value))}
            />
            <Slider
              label="Relative Luftfeuchte" info="Relative Feuchtigkeit der Umgebungsluft."
              min={20} max={100} step={1}
              value={rh} unit="%"
              onChange={(e) => setRh(Number(e.target.value))}
            />
            <Slider
              label="Lagerdauer" 
              min={1} max={365} step={1}
              value={lagerDauer} unit=" Tage"
              onChange={(e) => setLagerDauer(Number(e.target.value))}
            />
            <div className="flex justify-between text-sm mt-2 pt-2 border-t border-home-grau/30">
              <span className="text-text-main/70">Gleichgewichtsfeuchte:</span>
              <span className="font-bold text-shiraz">{formatDeZahl(uGleichgewicht, 1)} %</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-main/70">Erreichte Endfeuchte:</span>
              <span className="font-bold text-shiraz">{formatDeZahl(uEnde, 1)} %</span>
            </div>
          </div>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main">Abmessungen & Lage</h3>
            <Slider
              label={querschnitt === 'rund' ? 'Durchmesser (T/R)' : 'Breite (T)'} info="Breite des Querschnitts in tangentialer Richtung bzw. Durchmesser."
              min={10} max={500} step={1}
              value={breite} unit=" mm"
              onChange={(e) => setBreite(Number(e.target.value))}
            />
            {querschnitt !== 'rund' && (
              <Slider
                label="Dicke (R)" info="Dicke des Querschnitts in radialer Richtung."
                min={10} max={300} step={1}
                value={dicke} unit=" mm"
                onChange={(e) => setDicke(Number(e.target.value))}
              />
            )}
            <Slider
              label="Länge (L)" info="Länge des Bauteils."
              min={100} max={5000} step={10}
              value={laenge} unit=" mm"
              onChange={(e) => setLaenge(Number(e.target.value))}
            />
            {querschnitt !== 'rund' && (
              <div className="flex flex-col gap-4">
                <Slider
                  label="Exzentrizität X (Abstand Markröhre)" 
                  min={0} max={200} step={5}
                  value={exzentrizitaetX} unit=" mm"
                  onChange={(e) => setExzentrizitaetX(Number(e.target.value))}
                />
                <Slider
                  label="Exzentrizität Y (Abstand Markröhre)" 
                  min={0} max={200} step={5}
                  value={exzentrizitaetY} unit=" mm"
                  onChange={(e) => setExzentrizitaetY(Number(e.target.value))}
                />
              </div>
            )}
            <Slider
              label="Skalierungsfaktor (Darstellung)"
              min={1} max={50} step={1}
              value={skalierungsfaktor} unit="x"
              info="Überhöhung der Verformung für eine bessere Sichtbarkeit im 3D-Modell."
              onChange={(e) => setSkalierungsfaktor(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[700px]">
          <h2 className="text-xl font-bold text-text-main mb-4">3D Verformung</h2>
          
          <div className="flex-1 relative w-full h-full bg-off-white rounded-xl overflow-hidden border border-home-grau/30">
            <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [5, 5, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <OrbitControls makeDefault />
              
              {querschnitt !== 'rund' ? (
                <Box args={[breite * viewScale, dicke * viewScale, laenge * viewScale]}>
                  <meshBasicMaterial color="#A3113E" wireframe={false} visible={false} />
                  <Edges scale={1} threshold={15} color="#A3113E" renderOrder={1000}>
                    <lineBasicMaterial color="#A3113E" linewidth={3} depthTest={false} />
                  </Edges>
                </Box>
              ) : (
                <Cylinder args={[(breite / 2) * viewScale, (breite / 2) * viewScale, laenge * viewScale, 32]} rotation={[Math.PI / 2, 0, 0]}>
                  <meshBasicMaterial color="#A3113E" wireframe={false} visible={false} />
                  <Edges scale={1} threshold={15} color="#A3113E" renderOrder={1000}>
                    <lineBasicMaterial color="#A3113E" linewidth={3} depthTest={false} />
                  </Edges>
                </Cylinder>
              )}

              {querschnitt !== 'rund' ? (
                <DeformedBox />
              ) : (
                <Cylinder 
                  args={[(breite / 2) * viewScale, (breite / 2) * viewScale, laenge * viewScale, 32]} 
                  scale={[visualScaleX, visualScaleY, visualScaleZ]}
                  rotation={[Math.PI / 2, 0, 0]}
                  material={cylinderMaterials}
                >
                </Cylinder>
              )}
              
              <axesHelper args={[5]} />
            </Canvas>
            
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm text-xs border border-home-grau/30">
              <div className="font-bold text-text-main mb-1">Achsen & Legende:</div>
              <div className="text-red-500">X (Rot): Tangential (Breite)</div>
              <div className="text-green-500">Y (Grün): Radial (Dicke)</div>
              <div className="text-blue-500">Z (Blau): Longitudinal (Länge)</div>
              <div className="text-[#A3113E] mt-2 font-bold">Rotes Gitter: Ausgangszustand</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-4 text-center">
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
              <div className="text-xs text-text-main/60 uppercase tracking-wider">
                {querschnitt === 'rund' ? 'Durchmesser (T)' : 'Breite (T)'}
              </div>
              <div className="text-lg font-bold text-shiraz">{formatDeZahl(newBreite, 1)} mm</div>
              <div className="text-xs text-torch-red">Δ {formatDeZahl((newBreite - breite), 1)} mm</div>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
              <div className="text-xs text-text-main/60 uppercase tracking-wider">
                {querschnitt === 'rund' ? 'Durchmesser (R)' : 'Dicke (R)'}
              </div>
              <div className="text-lg font-bold text-shiraz">
                {querschnitt === 'rund' ? formatDeZahl((breite * scaleY), 1) : formatDeZahl(newDicke, 1)} mm
              </div>
              <div className="text-xs text-torch-red">
                Δ {formatDeZahl((querschnitt === 'rund' ? (breite * scaleY) - breite : newDicke - dicke), 1)} mm
              </div>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
              <div className="text-xs text-text-main/60 uppercase tracking-wider">Länge (L)</div>
              <div className="text-lg font-bold text-shiraz">{formatDeZahl(newLaenge, 1)} mm</div>
              <div className="text-xs text-torch-red">Δ {formatDeZahl((newLaenge - laenge), 1)} mm</div>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
              <div className="text-xs text-text-main/60 uppercase tracking-wider">Volumenschwindmaß</div>
              <div className="text-lg font-bold text-shiraz">{formatDeZahl(((1 - (scaleX * scaleY * scaleZ)) * 100), 1)} %</div>
              <div className="text-xs text-text-main/60">ΔV / V</div>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
              <div className="text-xs text-text-main/60 uppercase tracking-wider">Verhältnis T/R</div>
              <div className="text-lg font-bold text-shiraz">{formatDeZahl((shrinkT / shrinkR || 0), 2)}</div>
              <div className="text-xs text-text-main/60">Anisotropie</div>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'festigkeit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main">Holzfestigkeit (EC5)</h2>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Sortierklasse / Festigkeitsklasse</label><InfoTooltip text="Klassifizierung des Holzes nach seiner Tragfähigkeit." /></div>
            <select 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={festigkeitsklasse}
              onChange={(e) => setFestigkeitsklasse(e.target.value as keyof typeof festigkeitsklassen)}
            >
              {Object.keys(festigkeitsklassen).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Nutzungsklasse (NKL)</label><InfoTooltip text="Einteilung nach den klimatischen Umgebungsbedingungen." /></div>
            <select 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={nkl}
              onChange={(e) => setNkl(e.target.value as keyof typeof kmodTable)}
            >
              <option value="NKL 1">NKL 1 (Innenraum, trocken)</option>
              <option value="NKL 2">NKL 2 (Überdacht, außen)</option>
              <option value="NKL 3">NKL 3 (Frei bewittert)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Klasse der Lasteinwirkungsdauer (KLED)</label><InfoTooltip text="Einteilung der Lasten nach ihrer Einwirkungsdauer." /></div>
            <select 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={kled}
              onChange={(e) => setKled(e.target.value)}
            >
              <option value="ständig">Ständig (z.B. Eigengewicht)</option>
              <option value="lang">Lang (z.B. Lagerstoffe)</option>
              <option value="mittel">Mittel (z.B. Nutzlast)</option>
              <option value="kurz">Kurz (z.B. Schnee, Wind)</option>
              <option value="sehr kurz">Sehr kurz (z.B. Anprall)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Auflagerbedingung (k_c,90)</label><InfoTooltip text="Beiwert zur Berücksichtigung der Auflagerart bei Querdruck." /></div>
            <select 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={kc90}
              onChange={(e) => setKc90(Number(e.target.value))}
            >
              <option value={1.0}>1,00 (Standard, keine Erhöhung)</option>
              <option value={1.25}>1,25 (Vollholz, l_1 ≥ 150mm)</option>
              <option value={1.50}>1,50 (Vollholz, l_1 ≥ 150mm, l ≥ 400mm)</option>
              <option value={1.75}>1,75 (BSH, l_1 ≥ 150mm, l ≥ 400mm)</option>
            </select>
          </div>

          <Slider
            label="Faserwinkel α (Druck)"
            min={0} max={90} step={1}
            value={winkel} unit="°"
            
            onChange={(e) => setWinkel(Number(e.target.value))}
          />
        </div>

        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col">
          <h2 className="text-xl font-bold text-text-main mb-4">Bemessungswerte der Festigkeit (f_d)</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="text-xs font-bold text-home-grau mb-1">Modifikationsbeiwert k_mod</h3>
              <div className="text-2xl font-bold text-text-main">{formatDeZahl(kmod, 2)}</div>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="text-xs font-bold text-home-grau mb-1">Teilsicherheitsbeiwert γ_M</h3>
              <div className="text-2xl font-bold text-text-main">{formatDeZahl(gammaM, 2)}</div>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="text-xs font-bold text-home-grau mb-1">E-Modul E_0,mean</h3>
              <div className="text-2xl font-bold text-text-main">{formatDeWert(E0mean)} <span className="text-sm font-normal">MPa</span></div>
            </div>
            <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/20">
              <h3 className="text-xs font-bold text-shiraz mb-1">Druckfestigkeit f_c,α,d ({formatDeWert(winkel)}°)</h3>
              <div className="text-2xl font-bold text-shiraz">{formatDeZahl(fcad, 2)} <span className="text-sm font-normal">MPa</span></div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-home-grau/30">
                  <th className="py-3 px-4 font-bold text-text-main">Beanspruchung</th>
                  <th className="py-3 px-4 font-bold text-text-main">Charakteristisch (f_k)</th>
                  <th className="py-3 px-4 font-bold text-shiraz">Bemessungswert (f_d)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-home-grau/10">
                  <td className="py-3 px-4 font-medium text-text-main">Biegung (f_m)</td>
                  <td className="py-3 px-4">{formatDeZahl(fm, 1)} MPa</td>
                  <td className="py-3 px-4 font-bold text-shiraz">{formatDeZahl(fmd, 2)} MPa</td>
                </tr>
                <tr className="border-b border-home-grau/10 bg-off-white/50">
                  <td className="py-3 px-4 font-medium text-text-main">Zug parallel (f_t,0)</td>
                  <td className="py-3 px-4">{formatDeZahl(ft0, 1)} MPa</td>
                  <td className="py-3 px-4 font-bold text-shiraz">{formatDeZahl(ft0d, 2)} MPa</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-3 px-4 font-medium text-text-main">Zug rechtwinklig (f_t,90)</td>
                  <td className="py-3 px-4">{formatDeZahl(ft90, 1)} MPa</td>
                  <td className="py-3 px-4 font-bold text-shiraz">{formatDeZahl(ft90d, 2)} MPa</td>
                </tr>
                <tr className="border-b border-home-grau/10 bg-off-white/50">
                  <td className="py-3 px-4 font-medium text-text-main">Druck parallel (f_c,0)</td>
                  <td className="py-3 px-4">{formatDeZahl(fc0, 1)} MPa</td>
                  <td className="py-3 px-4 font-bold text-shiraz">{formatDeZahl(fc0d, 2)} MPa</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-3 px-4 font-medium text-text-main">Druck rechtwinklig (f_c,90)</td>
                  <td className="py-3 px-4">{formatDeZahl(fc90, 1)} MPa</td>
                  <td className="py-3 px-4 font-bold text-shiraz">{formatDeZahl(fc90d, 2)} MPa</td>
                </tr>
                <tr className="border-b border-home-grau/10 bg-off-white/50">
                  <td className="py-3 px-4 font-medium text-text-main">Schub/Scherung (f_v)</td>
                  <td className="py-3 px-4">{formatDeZahl(fv, 1)} MPa</td>
                  <td className="py-3 px-4 font-bold text-shiraz">{formatDeZahl(fvd, 2)} MPa</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <h3 className="text-sm font-bold text-text-main mb-2">Hankinson-Gleichung (Druck unter Winkel)</h3>
            <p className="text-sm text-home-grau mb-4">
              Die Druckfestigkeit von Holz ist stark richtungsabhängig. Bei Krafteinleitung unter einem Winkel α zur Faserrichtung wird die Festigkeit nach Hankinson abgemindert. 
              <br/><br/>
              <code className="bg-white px-2 py-1 rounded border border-home-grau/30">
                <FormulaText text="f_{c,\alpha,d} = f_{c,0,d} / \left( \left(\frac{f_{c,0,d}}{k_{c,90} \cdot f_{c,90,d}}\right) \cdot \sin^2(\alpha) + \cos^2(\alpha) \right)" />
              </code>
            </p>
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 h-[300px] flex flex-col">
              <h4 className="text-sm font-bold text-center mb-2">Druckfestigkeit vs. Faserwinkel</h4>
              <div className="flex-1 relative">
                <Line data={hankinsonData} options={hankinsonOptions as any} />
              </div>
            </div>
          </div>

          {/* Schematische Darstellung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
            <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Faserrichtung und Festigkeit</h3>
            <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
              <svg width="100%" height="160" viewBox="0 0 350 160">
                {/* Holzbalken */}
                <rect x="100" y="40" width="150" height="80" fill="#cbd5e1" stroke="#A3113E" strokeWidth="2" />
                
                {/* Holzfasern (parallel zur x-Achse) */}
                <path d="M 100 50 L 250 50 M 100 60 L 250 60 M 100 70 L 250 70 M 100 80 L 250 80 M 100 90 L 250 90 M 100 100 L 250 100 M 100 110 L 250 110" stroke="#A3113E" strokeWidth="1" strokeDasharray="10 5" opacity="0.5" />

                {/* Druck parallel (f_c,0) */}
                <path d="M 60 80 L 90 80" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow-red-holz)" />
                <path d="M 290 80 L 260 80" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow-red-holz)" />
                <text x="75" y="70" fontSize="10" fill="#A3113E" textAnchor="middle" fontWeight="bold">f_c,0</text>
                <text x="275" y="70" fontSize="10" fill="#A3113E" textAnchor="middle" fontWeight="bold">f_c,0</text>

                {/* Druck rechtwinklig (f_c,90) */}
                <path d="M 175 10 L 175 30" stroke="#475569" strokeWidth="3" markerEnd="url(#arrow-blue-holz)" />
                <path d="M 175 150 L 175 130" stroke="#475569" strokeWidth="3" markerEnd="url(#arrow-blue-holz)" />
                <text x="195" y="25" fontSize="10" fill="#475569" textAnchor="start" fontWeight="bold">f_c,90</text>
                <text x="195" y="145" fontSize="10" fill="#475569" textAnchor="start" fontWeight="bold">f_c,90</text>

                {/* Faserwinkel α */}
                {(() => {
                  if (winkel > 0 && winkel < 90) {
                    const angleRad = (winkel * Math.PI) / 180;
                    const dx = 40 * Math.cos(angleRad);
                    const dy = 40 * Math.sin(angleRad);
                    return (
                      <g>
                        <path d={`M ${175 - dx} ${80 - dy} L ${175} 80`} stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-orange-holz)" />
                        <text x={175 - dx - 10} y={80 - dy - 10} fontSize="10" fill="#64748b" textAnchor="middle" fontWeight="bold">F_α</text>
                        <path d="M 135 80 A 40 40 0 0 1 150 55" fill="none" stroke="#1e293b" strokeWidth="1" />
                        <text x="140" y="75" fontSize="10" fill="#1e293b">α</text>
                      </g>
                    );
                  }
                  return null;
                })()}

                <defs>
                  <marker id="arrow-red-holz" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                  </marker>
                  <marker id="arrow-blue-holz" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                  </marker>
                  <marker id="arrow-orange-holz" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                  </marker>
                </defs>
              </svg>
              <div className="text-xs text-text-main/70 text-center mt-2">
                Holz ist ein anisotropes Material. Die Festigkeit parallel zur Faser (f_c,0, rot) ist deutlich höher als rechtwinklig dazu (f_c,90, blau). Bei Kraftangriff unter einem Winkel α (orange) wird die Festigkeit interpoliert (Hankinson-Formel).
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'kriechen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main">Kriechen &amp; Verformung (EC5)</h2>
          
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p>
              Die Kriechverformung von Holz wird durch den Verformungsbeiwert <FormulaText text="k_{def}" /> berücksichtigt. Dieser hängt von der Holzart und der Nutzungsklasse ab.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-text-main">Holzart / Werkstoff</label>
              <InfoTooltip text="Auswahl der Holzart oder des Holzwerkstoffs. Dies beeinflusst k_def sowie die Quell- und Schwindbeiwerte." />
            </div>
            <select 
              className="w-full p-2.5 border border-home-grau/30 rounded-xl bg-off-white text-text-main focus:outline-none focus:border-shiraz"
              value={holz} 
              onChange={(e) => setHolz(e.target.value as keyof typeof holzArten)}
            >
              {Object.keys(holzArten).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-text-main">Nutzungsklasse (NKL)</label>
              <InfoTooltip text="Einfluss der Dauerfeuchte der Umgebung auf das Kriechen." />
            </div>
            <select 
              className="w-full p-2.5 border border-home-grau/30 rounded-xl bg-off-white text-text-main focus:outline-none focus:border-shiraz"
              value={nkl} 
              onChange={(e) => setNkl(e.target.value as keyof typeof kmodTable)}
            >
              <option value="NKL 1">NKL 1 (Innenraum, trocken)</option>
              <option value="NKL 2">NKL 2 (Überdacht, außen)</option>
              <option value="NKL 3">NKL 3 (Frei bewittert)</option>
            </select>
          </div>

          <div className="border-t border-home-grau/20 pt-4 space-y-4">
            <h3 className="text-xs font-bold text-home-grau uppercase tracking-wider">Feuchtesimulation</h3>
            
            <Slider
              label="Einbaufeuchte (u_start)" info="Feuchtegehalt beim Einbau."
              min={5} max={40} step={1}
              value={uStart} unit="%"
              onChange={(e) => setUStart(Number(e.target.value))}
            />
            
            <Slider
              label="Rel. Luftfeuchte (Umgebung)" info="Beeinflusst die Ausgleichsfeuchte."
              min={20} max={100} step={1}
              value={rh} unit="%"
              onChange={(e) => setRh(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-bold text-text-main mb-2"><FormulaText text="Verformungsbeiwert k_{def}" /></h3>
              <div className="text-5xl font-bold text-shiraz my-4">
                {(() => {
                  const kdefMap: Record<string, Record<string, number>> = {
                    'Vollholz': { 'NKL 1': 0.60, 'NKL 2': 0.80, 'NKL 3': 2.00 },
                    'BSH': { 'NKL 1': 0.60, 'NKL 2': 0.80, 'NKL 3': 2.00 },
                    'FSH': { 'NKL 1': 0.60, 'NKL 2': 0.80, 'NKL 3': 2.00 },
                    'OSB': { 'NKL 1': 1.50, 'NKL 2': 2.25, 'NKL 3': 0 },
                  };
                  let holzType = 'Vollholz';
                  if (holz.includes('BSH')) holzType = 'BSH';
                  else if (holz.includes('OSB')) holzType = 'OSB';
                  else if (holz.includes('FSH')) holzType = 'FSH';
                  const kdef = kdefMap[holzType]?.[nkl] || 0;
                  return kdef > 0 ? formatDeZahl(kdef, 2) : 'N/A';
                })()}
              </div>
              <p className="text-sm text-text-main/80">
                {(() => {
                  const kdefMap: Record<string, Record<string, number>> = {
                    'Vollholz': { 'NKL 1': 0.60, 'NKL 2': 0.80, 'NKL 3': 2.00 },
                    'BSH': { 'NKL 1': 0.60, 'NKL 2': 0.80, 'NKL 3': 2.00 },
                    'FSH': { 'NKL 1': 0.60, 'NKL 2': 0.80, 'NKL 3': 2.00 },
                    'OSB': { 'NKL 1': 1.50, 'NKL 2': 2.25, 'NKL 3': 0 },
                  };
                  let holzType = 'Vollholz';
                  if (holz.includes('BSH')) holzType = 'BSH';
                  else if (holz.includes('OSB')) holzType = 'OSB';
                  else if (holz.includes('FSH')) holzType = 'FSH';
                  const kdef = kdefMap[holzType]?.[nkl] || 0;
                  return kdef === 0 ? 'Für diese Kombination nicht zulässig/definiert.' : 'Berücksichtigt die Kriechverformung über die Lebensdauer.';
                })()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <h3 className="text-lg font-bold text-text-main text-center mb-1">Differentielles Quell-/Schwindmaß</h3>
              
              <div className="space-y-4 my-2">
                <div className="flex justify-between items-center pb-2 border-b border-home-grau/10">
                  <span className="text-xs font-semibold text-slate-500">Tangential (quer zur Faser):</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#A3113E]">
                      {formatDeZahl(Math.abs(deltaU * qt * 10000), 0)}
                    </span>
                    <span className="text-xs font-bold text-slate-500 ml-1">μm/m</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-home-grau/10">
                  <span className="text-xs font-semibold text-slate-500">Radial (quer zur Faser):</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#A3113E]">
                      {formatDeZahl(Math.abs(deltaU * qr * 10000), 0)}
                    </span>
                    <span className="text-xs font-bold text-slate-500 ml-1">μm/m</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500">Longitudinal (faserparallel):</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-400">
                      {formatDeZahl(Math.abs(deltaU * ql * 10000), 0)}
                    </span>
                    <span className="text-xs font-bold text-slate-400 ml-1">μm/m</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-text-main/70 text-center leading-relaxed">
                Rechnerische Hübe bei Feuchteänderung um <span className="font-bold text-shiraz">{formatDeZahl(deltaU, 1)}%</span> (Einbau {formatDeWert(uStart)}% vs. Endfeuchte {formatDeZahl(uEnde, 1)}%) basierend auf den materialspezifischen Parametern für <strong>{holz}</strong>.
              </p>
            </div>
          </div>
          
          <div className="bg-off-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-lg font-bold text-text-main mb-2">Relaxation bei Holz</h3>
            <p className="text-sm text-text-main/80">
              Bei Holz wird die Relaxation (Spannungsabbau bei konstanter Dehnung) in der Praxis meist über einen reduzierten Elastizitätsmodul berücksichtigt:
              <br/><br/>
              <code className="bg-white px-2 py-1 rounded border border-home-grau/50"><FormulaText text="E_{mean,fin} = E_{mean} / (1 + k_{def})" /></code>
              <br/><br/>
              Dies ist analog zur Kriechzahl beim Beton.
            </p>
          </div>
        </div>
      </div>
      )}
    
      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300">
          <BaustoffProfil materialKey="holz" />
        </div>
      )}
      </div>
    
      <WoodThematicLinks current="baustoff" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Holz', url: 'https://de.wikipedia.org/wiki/Holz' },
          { title: 'Holzfeuchte', url: 'https://de.wikipedia.org/wiki/Holzfeuchte' },
          { title: 'Schwindmaß (Holz)', url: 'https://de.wikipedia.org/wiki/Schwindma%C3%9F_(Holz)' },
          { title: 'dataholz.eu (Baustoff- und Bauteildaten)', url: 'https://www.dataholz.eu/' }
        ]}
        literatur={[
          'Blaß, H. J.; Sandhaas, C. (2017): Ingenieurholzbau - Grundlagen der Bemessung (KIT Scientific Publishing)',
          'Niemz, P.; Sonderegger, W. (2021): Holzphysik - Physik des Holzes und der Holzwerkstoffe (Carl Hanser Verlag)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 1995-1-1:2024-03 / NA:2021-03 (Eurocode 5: Bemessung und Konstruktion von Holzbauten - Teil 1-1: Allgemeines - Allgemeine Regeln und Regeln für den Hochbau)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1995-1-1' },
          { title: 'DIN EN 338:2016-07 (Bauholz für tragende Zwecke - Festigkeitsklassen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+338' },
          { title: 'DIN 68800-1..4:2019-06 (Holzschutz - Teile 1 bis 4: Vorbeugender baulicher und chemischer Holzschutz)', url: 'https://www.dinmedia.de/de/suche?q=DIN+68800-1..4' },
          { title: 'DIN EN 14080:2013-09 (Holzbauwerke - Brettschichtholz und Balkenschichtholz - Anforderungen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+14080' },
          { title: 'DIN EN 14081-1:2019-10 (Holzbauwerke - Nach Festigkeit sortiertes Bauholz für tragende Zwecke)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+14081-1' }
        ]}
        weblinks={[
          { title: 'best wood STATICS – Kostenlose Holzbaubemessung nach EC5', url: 'https://www.schneider-holz.com/service/statiksoftware.html' },
          { title: 'dataholz.eu – Akkreditierte Holzbauteil- & EPD-Datenbank', url: 'https://www.dataholz.eu/' },
          { title: 'STRIAN – Online 2D-Stabwerk- & Rahmenberechnung', url: 'https://strian.designer.io/' },
          { title: 'Informationsdienst Holz – Fachwissen & Handbücher', url: 'https://informationsdienst-holz.de/' }
        ]}
        formeln={[
          {
            formel: 'f_d = k_{\\text{mod}} \\cdot \\frac{f_k}{\\gamma_M}',
            erklaerung: 'Bemessungswert einer Festigkeitseigenschaft nach Eurocode 5: k_{mod} berücksichtigt die Lasteinwirkungsdauer (LED) und die Nutzungsklasse (NKL 1-3), \\gamma_M = 1,30 (DIN EN 1995-1-1/NA für Vollholz und BSH; EC-Grundwert für BSH: 1,25).',
            quelle: 'DIN EN 1995-1-1'
          },
          {
            formel: 'f_{c,\\alpha,d} = \\frac{f_{c,0,d}}{\\frac{f_{c,0,d}}{k_{c,90} \\cdot f_{c,90,d}} \\cdot \\sin^2\\alpha + \\cos^2\\alpha}',
            erklaerung: 'Hankinson-Formel nach Eurocode 5: Bemessungsdruckfestigkeit unter dem Neigungswinkel \\alpha zur Faserrichtung.',
            quelle: 'DIN EN 1995-1-1 Abs. 6.2.2'
          },
          {
            formel: '\\Delta l = l_0 \\cdot \\alpha \\cdot \\Delta u \\quad (u \\le u_{\\text{FSP}} \\approx 30\\,\\%)',
            erklaerung: 'Differentielles Schwind- und Quellmaß: \\alpha = Schwindmaß pro 1% Feuchteänderung (radial ca. 0,16%, tangential ca. 0,33%, longitudinal ca. 0,01%). Nur unterhalb des Fasersättigungspunkts (FSP).',
            quelle: 'Niemz: Holzphysik'
          },
          {
            formel: 'u_{\\text{fin}} = u_{\\text{inst}} \\cdot (1 + k_{\\text{def}})',
            erklaerung: 'Endverformung unter Kriecheinfluss: u_{inst} = elastische Anfangsverformung, k_{def} = Verformungsbeiwert in Abhängigkeit von Material und Nutzungsklasse (z.B. Vollholz NKL 1: k_{def} = 0.60).',
            quelle: 'DIN EN 1995-1-1 Tab. 3.2'
          }
        ]}
      />
    </div>
  );
}
