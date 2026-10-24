import React, { useState, useMemo } from 'react';
import { Box, Layers, TrendingUp, CheckCircle2, AlertTriangle, ArrowRight, Scale, Sliders, Calendar, ShieldCheck } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Slider } from '@/src/components/ui/Slider';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { normalPDF } from '@/src/lib/math';
import { useTabContext } from '@/src/contexts/TabContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FestigkeitsKlasse {
  name: string;
  fck_cyl: number;   // MPa
  fck_cube: number;  // MPa
  fcm: number;       // fck + 8
  fctm: number;      // MPa (EC2 Tab. 3.1)
  fctk_005: number;  // 0.7 * fctm
  fctk_095: number;  // 1.3 * fctm
  Ecm: number;       // GPa
  eps_c1: number;    // Promille
  eps_cu1: number;   // Promille
  eps_c2: number;    // Promille
  eps_cu2: number;   // Promille
}

const NORM_KLASSEN: FestigkeitsKlasse[] = [
  { name: 'C8/10', fck_cyl: 8, fck_cube: 10, fcm: 16, fctm: 1.1, fctk_005: 0.8, fctk_095: 1.5, Ecm: 25, eps_c1: 1.5, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5 },
  { name: 'C12/15', fck_cyl: 12, fck_cube: 15, fcm: 20, fctm: 1.6, fctk_005: 1.1, fctk_095: 2.0, Ecm: 27, eps_c1: 1.8, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5 },
  { name: 'C16/20', fck_cyl: 16, fck_cube: 20, fcm: 24, fctm: 1.9, fctk_005: 1.3, fctk_095: 2.5, Ecm: 29, eps_c1: 1.9, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5 },
  { name: 'C20/25', fck_cyl: 20, fck_cube: 25, fcm: 28, fctm: 2.2, fctk_005: 1.5, fctk_095: 2.9, Ecm: 30, eps_c1: 2.0, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5 },
  { name: 'C25/30', fck_cyl: 25, fck_cube: 30, fcm: 33, fctm: 2.6, fctk_005: 1.8, fctk_095: 3.3, Ecm: 31, eps_c1: 2.1, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5 },
  { name: 'C30/37', fck_cyl: 30, fck_cube: 37, fcm: 38, fctm: 2.9, fctk_005: 2.0, fctk_095: 3.8, Ecm: 33, eps_c1: 2.2, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5 },
  { name: 'C35/45', fck_cyl: 35, fck_cube: 45, fcm: 43, fctm: 3.2, fctk_005: 2.2, fctk_095: 4.2, Ecm: 34, eps_c1: 2.25, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5 },
  { name: 'C40/50', fck_cyl: 40, fck_cube: 50, fcm: 48, fctm: 3.5, fctk_005: 2.5, fctk_095: 4.6, Ecm: 35, eps_c1: 2.3, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5 },
  { name: 'C45/55', fck_cyl: 45, fck_cube: 55, fcm: 53, fctm: 3.8, fctk_005: 2.7, fctk_095: 4.9, Ecm: 36, eps_c1: 2.4, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5 },
  { name: 'C50/60', fck_cyl: 50, fck_cube: 60, fcm: 58, fctm: 4.1, fctk_005: 2.9, fctk_095: 5.3, Ecm: 37, eps_c1: 2.45, eps_cu1: 3.5, eps_c2: 2.0, eps_cu2: 3.5 },
  { name: 'C55/67', fck_cyl: 55, fck_cube: 67, fcm: 63, fctm: 4.2, fctk_005: 3.0, fctk_095: 5.5, Ecm: 38, eps_c1: 2.5, eps_cu1: 3.2, eps_c2: 2.2, eps_cu2: 3.1 },
  { name: 'C60/75', fck_cyl: 60, fck_cube: 75, fcm: 68, fctm: 4.4, fctk_005: 3.1, fctk_095: 5.7, Ecm: 39, eps_c1: 2.6, eps_cu1: 3.0, eps_c2: 2.3, eps_cu2: 2.9 },
  { name: 'C70/85', fck_cyl: 70, fck_cube: 85, fcm: 78, fctm: 4.6, fctk_005: 3.2, fctk_095: 6.0, Ecm: 41, eps_c1: 2.7, eps_cu1: 2.8, eps_c2: 2.4, eps_cu2: 2.7 },
  { name: 'C80/95', fck_cyl: 80, fck_cube: 95, fcm: 88, fctm: 4.8, fctk_005: 3.4, fctk_095: 6.3, Ecm: 42, eps_c1: 2.8, eps_cu1: 2.8, eps_c2: 2.5, eps_cu2: 2.6 },
  { name: 'C90/105', fck_cyl: 90, fck_cube: 105, fcm: 98, fctm: 5.0, fctk_005: 3.5, fctk_095: 6.6, Ecm: 44, eps_c1: 2.8, eps_cu1: 2.8, eps_c2: 2.6, eps_cu2: 2.6 },
  { name: 'C100/115', fck_cyl: 100, fck_cube: 115, fcm: 108, fctm: 5.2, fctk_005: 3.6, fctk_095: 6.8, Ecm: 45, eps_c1: 2.8, eps_cu1: 2.8, eps_c2: 2.6, eps_cu2: 2.6 },
];

export default function Festbeton() {
  const { setActiveTab: setGlobalTab } = useTabContext();
  const [activeTab, setActiveTab] = useState<'druckfestigkeitsklassen' | 'festigkeitsentwicklung' | 'statistik' | 'konformitaet'>('druckfestigkeitsklassen');

  // Tab 1: Klassen-Inspektor
  const [selectedKlasseName, setSelectedKlasseName] = useState<string>('C25/30');
  const [alphaCc, setAlphaCc] = useState<number>(0.85);
  const [gammaC, setGammaC] = useState<number>(1.5);
  const [alphaCt, setAlphaCt] = useState<number>(0.85);

  const selectedKlasse = NORM_KLASSEN.find(k => k.name === selectedKlasseName) || NORM_KLASSEN[4];
  const fcd = (alphaCc * selectedKlasse.fck_cyl) / gammaC;
  const fctd = (alphaCt * selectedKlasse.fctk_005) / gammaC;

  // Tab 2: Festigkeitsentwicklung
  const [fckRef, setFckRef] = useState<number>(30); // Zylinder fck
  const [alter, setAlter] = useState<number>(28);
  const [zementArt, setZementArt] = useState<'R' | 'N' | 'S'>('N');
  const [geometrie, setGeometrie] = useState<'zyl_150' | 'cube_150' | 'cube_100' | 'cube_200'>('zyl_150');
  const [lagerung, setLagerung] = useState<'norm' | 'feucht' | 'luft' | 'heiss'>('norm');

  // Erhärtungskoeffizient s nach EC2 (DIN EN 1992-1-1 Gl. 3.2)
  const sKoeff = zementArt === 'R' ? 0.20 : zementArt === 'N' ? 0.25 : 0.38;
  const beta_cc = Math.exp(sKoeff * (1 - Math.sqrt(28 / Math.max(1, alter))));
  const fcmRef = fckRef + 8;
  const fcm_t = fcmRef * beta_cc;

  // Geometrie- & Lagerungsumrechnungen
  const geoFaktor = geometrie === 'zyl_150' ? 1.0 : geometrie === 'cube_150' ? 1.25 : geometrie === 'cube_100' ? 1.30 : 1.20;
  const lagerungsFaktor = lagerung === 'norm' ? 1.0 : lagerung === 'feucht' ? 0.95 : lagerung === 'luft' ? 0.90 : 0.85;
  const fcm_t_eff = fcm_t * geoFaktor * lagerungsFaktor;

  // Tab 3: Statistik (Gauß-Verteilung)
  const [statFcm, setStatFcm] = useState<number>(38);
  const [statSigma, setStatSigma] = useState<number>(3.5);
  const [statFormat, setStatFormat] = useState<'zylinder' | 'wuerfel'>('zylinder');

  const statFckCyl = statFcm - 1.645 * statSigma;
  const statScale = statFormat === 'wuerfel' ? 1.25 : 1.0;
  const statDisplayFcm = statFcm * statScale;
  const statDisplaySigma = statSigma * statScale;
  const statDisplayFck = statFckCyl * statScale;
  const statFcd = (alphaCc * statFckCyl) / gammaC;

  const chartData = useMemo(() => {
    const minX = Math.floor(Math.max(0, statDisplayFcm - 4 * statDisplaySigma));
    const maxX = Math.ceil(statDisplayFcm + 4 * statDisplaySigma);
    const rawXValues: number[] = [];
    const step = (maxX - minX) / 100;
    for (let i = 0; i <= 100; i++) {
      rawXValues.push(minX + i * step);
    }
    rawXValues.push(statDisplayFck);
    const xValues = Array.from(new Set(rawXValues)).sort((a, b) => a - b);
    const yValues = xValues.map(x => normalPDF(x, statDisplayFcm, statDisplaySigma));

    const redAreaX: number[] = [];
    const redAreaY: number[] = [];
    xValues.forEach(x => {
      if (x <= statDisplayFck) {
        redAreaX.push(x);
        redAreaY.push(normalPDF(x, statDisplayFcm, statDisplaySigma));
      }
    });
    redAreaX.push(statDisplayFck);
    redAreaY.push(0);

    return {
      datasets: [
        {
          label: '5%-Fraktil (Ausschuss-Wahrscheinlichkeit)',
          data: redAreaX.map((x, i) => ({ x, y: redAreaY[i] })),
          backgroundColor: 'rgba(163, 17, 62, 0.4)', // Shiraz Transparent
          borderColor: 'transparent',
          fill: true,
          pointRadius: 0,
          tension: 0,
        },
        {
          label: 'Dichtefunktion f(x)',
          data: xValues.map((x, i) => ({ x, y: yValues[i] })),
          borderColor: '#A3113E',
          backgroundColor: 'rgba(210, 210, 210, 0.2)',
          borderWidth: 2,
          fill: true,
          pointRadius: 0,
          tension: 0.3,
        },
        {
          label: `Charakt. Wert f_ck (${formatDeZahl(statDisplayFck, 1)} N/mm²)`,
          data: [{ x: statDisplayFck, y: 0 }, { x: statDisplayFck, y: Math.max(...yValues) * 1.05 }],
          borderColor: '#1e293b',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }
      ]
    };
  }, [statDisplayFcm, statDisplaySigma, statDisplayFck]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { display: false, beginAtZero: true },
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: `Druckfestigkeit [N/mm²] (${statFormat === 'zylinder' ? 'Zylinder 150/300' : 'Würfel 150'})`,
          font: { weight: 'bold' as const }
        }
      }
    },
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          title: (context: any) => `Festigkeit: ${formatDeZahl(Number(context[0].parsed.x), 1)} N/mm²`,
          label: () => ''
        }
      }
    }
  };

  // Tab 4: Schnellevaluator Konformität (DIN EN 206 Abs. 8 / DIN 1045-2)
  const [konfKlasse, setKonfKlasse] = useState<string>('C25/30');
  const [konfModus, setKonfModus] = useState<'erst' | 'stetig'>('erst');
  const [konfWerteStr, setKonfWerteStr] = useState<string>('34,5; 33,2; 35,8');

  const konfFck = (NORM_KLASSEN.find(k => k.name === konfKlasse) || NORM_KLASSEN[4]).fck_cube;
  // Trennung an Semikolon oder Leerzeichen; Komma ist Dezimalzeichen
  const konfWerte = konfWerteStr
    .split(/[;\s]+/)
    .map(v => parseFloat(v.replace(',', '.')))
    .filter(v => !isNaN(v) && v > 0);

  const konfMean = konfWerte.length > 0 ? konfWerte.reduce((a, b) => a + b, 0) / konfWerte.length : 0;
  const konfMin = konfWerte.length > 0 ? Math.min(...konfWerte) : 0;
  const konfVariance = konfWerte.length > 1
    ? konfWerte.reduce((acc, v) => acc + Math.pow(v - konfMean, 2), 0) / (konfWerte.length - 1)
    : 0;
  const konfStdDev = Math.sqrt(konfVariance);
  const konfStdDevUsed = Math.max(konfStdDev, 3.0);

  const konfSollMean = konfModus === 'erst' ? konfFck + 4.0 : konfFck + 1.48 * konfStdDevUsed;
  const konfSollMin = konfFck - 4.0;
  const konfMeanOk = konfMean >= konfSollMean;
  const konfMinOk = konfMin >= konfSollMin;
  const konfAnzahlOk = konfModus === 'erst' ? konfWerte.length >= 3 : konfWerte.length >= 15;
  const konfBestanden = konfMeanOk && konfMinOk && konfAnzahlOk;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="text-shiraz" /> Festbeton: Festigkeitsklassen, Gefüge &amp; Konformität
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Vollständige Übersicht der Betondruckfestigkeitsklassen nach <strong>DIN EN 206:2021-06</strong> und <strong>DIN 1045-2:2023-08</strong>, 
            mechanische Kenngrößen nach <strong>Eurocode 2 (DIN EN 1992-1-1)</strong>, zeitliche Festigkeitsentwicklung <InlineMath math="\beta_{cc}(t)" />, Probekörpergeometrie 
            (Reibungskegel Zylinder vs. Würfel) sowie statistischer Konformitätsnachweis nach Kriterien 1 und 2.
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-xs">
            <strong className="mr-1">Lernpfad:</strong>
            {([
              ['druckfestigkeitsklassen', 'Klassen & Kennwerte'], ['festigkeitsentwicklung', 'Festigkeitsentwicklung'],
              ['statistik', 'Statistik (f_ck aus f_cm)'], ['konformitaet', 'Konformität'],
            ] as const).map(([id, label], i) => (
              <React.Fragment key={id}>
                {i > 0 && <span className="text-text-main/40">→</span>}
                <button onClick={() => setActiveTab(id)} className="underline decoration-dotted hover:text-shiraz cursor-pointer">{i + 1}. {label}</button>
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button aria-pressed={activeTab === 'druckfestigkeitsklassen'} 
            onClick={() => setActiveTab('druckfestigkeitsklassen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'druckfestigkeitsklassen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Layers size={16} /> Druckfestigkeitsklassen (DIN EN 206 / EC2)
          </button>
          <button aria-pressed={activeTab === 'festigkeitsentwicklung'} 
            onClick={() => setActiveTab('festigkeitsentwicklung')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'festigkeitsentwicklung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Calendar size={16} /> Festigkeitsentwicklung &amp; Geometrie
          </button>
          <button aria-pressed={activeTab === 'statistik'} 
            onClick={() => setActiveTab('statistik')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'statistik' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <TrendingUp size={16} /> Statistik &amp; Normalverteilung
          </button>
          <button aria-pressed={activeTab === 'konformitaet'} 
            onClick={() => setActiveTab('konformitaet')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'konformitaet' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <CheckCircle2 size={16} /> Konformitätskriterien (Abs. 8)
          </button>
        </div>

        {/* Tab 1: Druckfestigkeitsklassen */}
        {activeTab === 'druckfestigkeitsklassen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Linke Spalte: Normtabelle aller Klassen */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm">
                  <h3 className="text-base font-bold text-text-main mb-2 flex items-center gap-2">
                    <Layers size={18} className="text-shiraz" />
                    Festigkeitsklassen für Normal- und Schwerbeton (DIN EN 206 / EC2 Tab. 3.1)
                  </h3>
                  <p className="text-xs text-text-main/70 mb-4">
                    Klicken Sie auf eine Zeile, um die Bemessungswerte im rechten Inspektor detailliert zu analysieren.
                  </p>

                  <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 bg-off-white shadow-2xs z-10">
                        <tr className="border-b border-home-grau/30 text-text-main font-bold">
                          <th className="p-2.5">Klasse</th>
                          <th className="p-2.5 font-mono">f_ck,cyl <br /><span className="text-[10px] text-text-main/60">[MPa]</span></th>
                          <th className="p-2.5 font-mono">f_ck,cube <br /><span className="text-[10px] text-text-main/60">[MPa]</span></th>
                          <th className="p-2.5 font-mono">f_cm <br /><span className="text-[10px] text-text-main/60">[MPa]</span></th>
                          <th className="p-2.5 font-mono">f_ctm <br /><span className="text-[10px] text-text-main/60">[MPa]</span></th>
                          <th className="p-2.5 font-mono">E_cm <br /><span className="text-[10px] text-text-main/60">[GPa]</span></th>
                          <th className="p-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-home-grau/20 text-text-main/90 font-medium">
                        {NORM_KLASSEN.map((cls) => {
                          const isSelected = cls.name === selectedKlasseName;
                          return (
                            <tr 
                              key={cls.name}
                              onClick={() => setSelectedKlasseName(cls.name)}
                              className={`cursor-pointer transition-colors ${
                                isSelected 
                                  ? 'bg-shiraz/10 font-bold border-l-4 border-l-shiraz text-shiraz' 
                                  : 'hover:bg-off-white/70'
                              }`}
                            >
                              <td className="p-2.5 font-mono font-bold">{cls.name}</td>
                              <td className="p-2.5 font-mono">{formatDeWert(cls.fck_cyl)}</td>
                              <td className="p-2.5 font-mono">{formatDeWert(cls.fck_cube)}</td>
                              <td className="p-2.5 font-mono">{formatDeWert(cls.fcm)}</td>
                              <td className="p-2.5 font-mono">{formatDeZahl(cls.fctm, 1)}</td>
                              <td className="p-2.5 font-mono">{formatDeWert(cls.Ecm)}</td>
                              <td className="p-2.5 text-center">
                                {cls.fck_cyl >= 55 ? (
                                  <span className="text-[10px] bg-indigo-100 text-indigo-900 px-1.5 py-0.5 rounded font-sans font-bold">HD-Beton</span>
                                ) : (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-sans font-bold">Standard</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-xs text-text-main/80 leading-relaxed">
                  <h4 className="font-bold text-shiraz mb-1">Leichtbetonklassen (LC nach DIN EN 206 Tab. 13)</h4>
                  <p>
                    Für Leichtbeton gelten die Bezeichnungen <strong>LC8/9</strong> bis <strong>LC80/88</strong> (z. B. LC25/28, LC30/33). 
                    Zusätzlich wird die Trockenrohdichte in Klassen <strong>D1,0</strong> (&le; 1000 kg/m³) bis <strong>D2,0</strong> (1800 bis 2000 kg/m³) 
                    eingeteilt, und für die Bemessung wird ein Abminderungsbeiwert <InlineMath math="\eta_1 = 0{,}40 + 0{,}60 \cdot \rho / 2200" /> für E-Modul und Zugfestigkeit angesetzt.
                  </p>
                </div>
              </div>

              {/* Rechte Spalte: Detail-Inspektor der ausgewählten Klasse */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                  <div className="border-b border-home-grau/20 pb-3">
                    <span className="text-[10px] font-bold text-home-grau uppercase block">Ausgewählte Klasse</span>
                    <h3 className="text-2xl font-bold font-mono text-shiraz">{selectedKlasse.name}</h3>
                    <span className="text-xs text-text-main/70">
                      Zylinder f_ck = {formatDeWert(selectedKlasse.fck_cyl)} MPa / Würfel f_ck,cube = {formatDeWert(selectedKlasse.fck_cube)} MPa
                    </span>
                    {selectedKlasse.name === 'C8/10' && (
                      <span className="block text-[11px] text-torch-red mt-1">C8/10 ist in DIN EN 1992-1-1 Tab. 3.1 nicht enthalten – Kennwerte sind Lehrwerte.</span>
                    )}
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="bg-off-white p-3 rounded-xl border border-home-grau/20 flex justify-between items-center">
                      <span className="text-text-main/80 font-medium">Mittlere Festigkeit f_cm:</span>
                      <span className="font-mono font-bold text-text-main text-sm">{formatDeWert(selectedKlasse.fcm)} N/mm²</span>
                    </div>

                    <div className="bg-off-white p-3 rounded-xl border border-home-grau/20 flex justify-between items-center">
                      <span className="text-text-main/80 font-medium">Mittlere Zugfestigkeit f_ctm:</span>
                      <span className="font-mono font-bold text-text-main text-sm">{formatDeZahl(selectedKlasse.fctm, 2)} N/mm²</span>
                    </div>

                    <div className="bg-off-white p-3 rounded-xl border border-home-grau/20 flex justify-between items-center">
                      <span className="text-text-main/80 font-medium">5%-Fraktil Zugfestigkeit f_ctk,0.05:</span>
                      <span className="font-mono font-bold text-text-main text-sm">{formatDeZahl(selectedKlasse.fctk_005, 2)} N/mm²</span>
                    </div>

                    <div className="bg-off-white p-3 rounded-xl border border-home-grau/20 flex justify-between items-center">
                      <span className="text-text-main/80 font-medium">Elastizitätsmodul E_cm:</span>
                      <span className="font-mono font-bold text-text-main text-sm">{formatDeWert(selectedKlasse.Ecm)} GPa</span>
                    </div>
                  </div>

                  {/* Bemessungswerte für Tragwerksplanung */}
                  <div className="border-t border-home-grau/20 pt-3 flex flex-col gap-2">
                    <span className="text-xs font-bold text-text-main">Tragwerksbemessung nach Eurocode 2</span>
                    
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="text-text-main/70 block">Beiwert α_cc:</label>
                        <input aria-label="Beiwert α_cc" 
                          type="number" 
                          step="0.05" 
                          min="0.80" 
                          max="1.00"
                          value={alphaCc} 
                          onChange={(e) => setAlphaCc(parseFloat(e.target.value) || 0.85)}
                          className="w-full p-1.5 bg-off-white border border-home-grau/30 rounded-lg font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-text-main/70 block">Teilsicherheit γ_c:</label>
                        <input aria-label="Teilsicherheit γ_c" 
                          type="number" 
                          step="0.1" 
                          min="1.2" 
                          max="1.8"
                          value={gammaC} 
                          onChange={(e) => setGammaC(parseFloat(e.target.value) || 1.5)}
                          className="w-full p-1.5 bg-off-white border border-home-grau/30 rounded-lg font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-300 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-950">Bemessungsdruckfestigkeit f_cd:</span>
                        <span className="text-base font-bold font-mono text-emerald-800">{formatDeZahl(fcd, 2)} N/mm²</span>
                      </div>
                      <span className="text-[10px] text-emerald-900/70 block mt-1">
                        f_cd = (α_cc · f_ck,cyl) / γ_c = ({formatDeZahl(alphaCc, 2)} · {formatDeWert(selectedKlasse.fck_cyl)}) / {formatDeZahl(gammaC, 2)}
                      </span>
                    </div>

                    <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-300">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-950">Bemessungszugfestigkeit f_ctd:</span>
                        <span className="text-base font-bold font-mono text-emerald-800">{formatDeZahl(fctd, 2)} N/mm²</span>
                      </div>
                      <span className="text-[10px] text-emerald-900/70 block mt-1">
                        f_ctd = (α_ct · f_ctk,0.05) / γ_c = ({formatDeZahl(alphaCt, 2)} · {formatDeZahl(selectedKlasse.fctk_005, 2)}) / {formatDeZahl(gammaC, 2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Festigkeitsentwicklung & Geometrie */}
        {activeTab === 'festigkeitsentwicklung' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Steuerung & Rechner */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-text-main border-b border-home-grau/20 pb-2 flex items-center gap-2">
                    <Sliders size={18} className="text-shiraz" /> Einflussfaktoren auf die Festigkeit
                  </h3>

                  <Slider 
                    label="Charakteristische Zylinderfestigkeit f_ck,28d"
                    min={12}
                    max={100}
                    step={1}
                    value={fckRef}
                    unit=" N/mm²"
                    onChange={(e) => setFckRef(Number(e.target.value))}
                  />

                  <Slider 
                    label="Betonalter t"
                    min={1}
                    max={365}
                    step={1}
                    value={alter}
                    unit=" Tage"
                    onChange={(e) => setAlter(Number(e.target.value))}
                  />

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-text-main block mb-1">Zementklasse (EC2):</label>
                      <select aria-label="Zementklasse (EC2)" 
                        value={zementArt}
                        onChange={(e) => setZementArt(e.target.value as 'R' | 'N' | 'S')}
                        className="w-full p-2 bg-off-white border border-home-grau/30 rounded-xl font-semibold"
                      >
                        <option value="R">Klasse R (schnell, s = 0,20)</option>
                        <option value="N">Klasse N (normal, s = 0,25)</option>
                        <option value="S">Klasse S (langsam, s = 0,38)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-text-main block mb-1">Prüfgeometrie:</label>
                      <select aria-label="Prüfgeometrie" 
                        value={geometrie}
                        onChange={(e) => setGeometrie(e.target.value as any)}
                        className="w-full p-2 bg-off-white border border-home-grau/30 rounded-xl font-semibold"
                      >
                        <option value="zyl_150">Zylinder 150/300 (Ref. 1,00)</option>
                        <option value="cube_150">Würfel 150 mm (ca. 1,25)</option>
                        <option value="cube_100">Würfel 100 mm (ca. 1,30)</option>
                        <option value="cube_200">Würfel 200 mm (ca. 1,20)</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-bold text-text-main block mb-1">Lagerungsbedingung:</label>
                    <select aria-label="Lagerungsbedingung" 
                      value={lagerung}
                      onChange={(e) => setLagerung(e.target.value as any)}
                      className="w-full p-2 bg-off-white border border-home-grau/30 rounded-xl font-semibold"
                    >
                      <option value="norm">Normlagerung Wasser 20 °C (Faktor 1,00)</option>
                      <option value="feucht">Feuchtlagerung &gt; 95 % r.F. (Faktor 0,95)</option>
                      <option value="luft">Trockene Baustellenluft 65 % r.F. (Faktor 0,90)</option>
                      <option value="heiss">Heißhärtung / Wärmebehandlung (Faktor 0,85)</option>
                    </select>
                    <p className="text-[11px] text-text-main/60 mt-1">Faktoren für Würfel 100/200 mm und Lagerung sind Lehrwerte. Für die Prüfkörperlagerung nach DIN EN 12390-2, Anhang NA.2 gilt fc,cube = 0,92 · fc,dry (Normalbeton bis C50/60) bzw. 0,95 · fc,dry (ab C55/67).</p>
                  </div>

                  {/* Ergebnisbox */}
                  <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/20 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-main/80 font-medium">Entwicklungsbeiwert β_cc({formatDeWert(alter)} d):</span>
                      <span className="font-mono font-bold text-shiraz text-base">{formatDeZahl(beta_cc, 3)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-shiraz/10 pt-2">
                      <span className="text-xs text-text-main font-bold">Erwartete Festigkeit f_cm({formatDeWert(alter)} d):</span>
                      <span className="font-mono font-bold text-shiraz text-lg">{formatDeZahl(fcm_t_eff, 1)} N/mm²</span>
                    </div>
                    <span className="text-[10px] text-text-main/60">
                      Berechnet mit: f_cm,28d = {formatDeWert(fcmRef)} MPa · β_cc = {formatDeZahl(beta_cc, 3)} · Geo = {formatDeZahl(geoFaktor, 2)} · Lagerung = {formatDeZahl(lagerungsFaktor, 2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grafischer Nachweis Reibungskegel: Zylinder vs. Würfel */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main border-b border-home-grau/20 pb-2">
                    Einfluss der Querdehnungsbehinderung: Zylinder (h/d = 2) vs. Würfel (h/d = 1)
                  </h3>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    Bei der Druckprüfung in der Prüfmaschine entsteht durch die Reibung zwischen den stählernen Druckplatten und den Probekörper-Endflächen 
                    ein zweiachsiger bzw. dreiachsiger Spannungszustand (<strong>Reibungskegel</strong>).
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {/* Zylinder 150/300 */}
                    <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col items-center">
                      <span className="text-xs font-bold text-text-main mb-2">Zylinder 150 / 300 mm (Europäische Referenz)</span>
                      <svg width="100%" height="180" viewBox="0 0 200 180" className="max-w-[200px]">
                        {/* Stahldruckplatten */}
                        <rect x="50" y="10" width="100" height="12" fill="#475569" rx="2" />
                        <rect x="50" y="158" width="100" height="12" fill="#475569" rx="2" />
                        {/* Zylinderkörper */}
                        <rect x="65" y="22" width="70" height="136" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                        {/* Kraftpfeile */}
                        <path d="M 100 2 L 100 10" stroke="#A3113E" strokeWidth="2.5" markerEnd="url(#arr-shiraz)" />
                        <path d="M 100 178 L 100 170" stroke="#A3113E" strokeWidth="2.5" markerEnd="url(#arr-shiraz)" />
                        {/* Reibungskegel oben und unten */}
                        <polygon points="65,22 135,22 100,57" fill="#A3113E" opacity="0.3" />
                        <polygon points="65,158 135,158 100,123" fill="#A3113E" opacity="0.3" />
                        {/* Freier ungestörter Kern in der Mitte */}
                        <line x1="65" y1="90" x2="45" y2="90" stroke="#0284c7" strokeWidth="1.5" markerEnd="url(#arr-cyan)" />
                        <line x1="135" y1="90" x2="155" y2="90" stroke="#0284c7" strokeWidth="1.5" markerEnd="url(#arr-cyan)" />
                        <text x="100" y="93" fontSize="8" fontWeight="bold" fill="#0f172a" textAnchor="middle">Ungestört (1D)</text>
                      </svg>
                      <span className="text-[10px] text-text-main/70 text-center mt-2 leading-tight">
                        Wegen h/d = 2 bleibt das mittlere Drittel frei von Reibungskräften. Nahezu einaxialer Spannungszustand.
                      </span>
                    </div>

                    {/* Würfel 150 */}
                    <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col items-center">
                      <span className="text-xs font-bold text-text-main mb-2">Würfel 150 / 150 mm (Baustellen-Standard)</span>
                      <svg width="100%" height="180" viewBox="0 0 200 180" className="max-w-[200px]">
                        {/* Stahldruckplatten */}
                        <rect x="40" y="25" width="120" height="12" fill="#475569" rx="2" />
                        <rect x="40" y="143" width="120" height="12" fill="#475569" rx="2" />
                        {/* Würfelkörper */}
                        <rect x="55" y="37" width="90" height="106" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                        {/* Kraftpfeile */}
                        <path d="M 100 15 L 100 25" stroke="#A3113E" strokeWidth="2.5" markerEnd="url(#arr-shiraz)" />
                        <path d="M 100 165 L 100 155" stroke="#A3113E" strokeWidth="2.5" markerEnd="url(#arr-shiraz)" />
                        {/* Reibungskegel berühren sich in der Mitte */}
                        <polygon points="55,37 145,37 100,90" fill="#A3113E" opacity="0.4" />
                        <polygon points="55,143 145,143 100,90" fill="#A3113E" opacity="0.4" />
                        <text x="100" y="93" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle">Behinderung</text>
                        <defs>
                          <marker id="arr-shiraz" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                          </marker>
                          <marker id="arr-cyan" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
                          </marker>
                        </defs>
                      </svg>
                      <span className="text-[10px] text-text-main/70 text-center mt-2 leading-tight">
                        Wegen h/d = 1 überlagern sich die Reibungskegel vollständig. Die Querdehnung ist behindert: scheinbare Festigkeitserhöhung um ca. 20–25 %!
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Statistik & Normalverteilung */}
        {activeTab === 'statistik' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Steuerung */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-text-main border-b border-home-grau/20 pb-2 flex items-center gap-2">
                    <TrendingUp size={18} className="text-shiraz" /> Statistische Kenngrößen
                  </h3>

                  <Slider 
                    label="Mittlere Festigkeit f_cm"
                    min={15}
                    max={90}
                    step={1}
                    value={statFcm}
                    unit=" N/mm²"
                    onChange={(e) => setStatFcm(Number(e.target.value))}
                  />

                  <Slider 
                    label="Standardabweichung σ"
                    min={1.5}
                    max={8.0}
                    step={0.1}
                    value={statSigma}
                    unit=" N/mm²"
                    onChange={(e) => setStatSigma(Number(e.target.value))}
                  />

                  <div>
                    <label className="text-xs font-bold text-text-main block mb-1">Referenz-Prüfformat:</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button aria-pressed={statFormat === 'zylinder'} 
                        onClick={() => setStatFormat('zylinder')}
                        className={`p-2 rounded-xl font-bold border transition-all cursor-pointer ${
                          statFormat === 'zylinder' 
                            ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                            : 'bg-off-white text-text-main border-home-grau/30'
                        }`}
                      >
                        Zylinder (f_ck,cyl)
                      </button>
                      <button aria-pressed={statFormat === 'wuerfel'} 
                        onClick={() => setStatFormat('wuerfel')}
                        className={`p-2 rounded-xl font-bold border transition-all cursor-pointer ${
                          statFormat === 'wuerfel' 
                            ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                            : 'bg-off-white text-text-main border-home-grau/30'
                        }`}
                      >
                        Würfel (f_ck,cube)
                      </button>
                    </div>
                  </div>

                  {/* Ergebnisboxen */}
                  <div className="space-y-2 text-xs pt-2 border-t border-home-grau/20">
                    <div className="bg-off-white p-3 rounded-xl border border-home-grau/20 flex justify-between items-center">
                      <span className="text-text-main/80 font-medium">Mittelwert f_cm:</span>
                      <span className="font-mono font-bold text-text-main">{formatDeZahl(statDisplayFcm, 1)} N/mm²</span>
                    </div>

                    <div className="bg-off-white p-3 rounded-xl border border-home-grau/20 flex justify-between items-center">
                      <span className="text-text-main/80 font-medium">Standardabweichung σ:</span>
                      <span className="font-mono font-bold text-text-main">{formatDeZahl(statDisplaySigma, 1)} N/mm²</span>
                    </div>

                    <div className="bg-shiraz/5 p-3 rounded-xl border border-shiraz/20 flex justify-between items-center">
                      <div>
                        <span className="text-shiraz font-bold block">5%-Fraktil f_ck:</span>
                        <span className="text-[10px] text-shiraz/70">f_ck = f_cm - 1,645 · σ</span>
                      </div>
                      <span className="font-mono font-bold text-shiraz text-base">{formatDeZahl(statDisplayFck, 1)} N/mm²</span>
                    </div>

                    <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-300 flex justify-between items-center">
                      <div>
                        <span className="text-emerald-950 font-bold block">Bemessungswert f_cd:</span>
                        <span className="text-[10px] text-emerald-900/70">f_cd = (0,85 · f_ck,cyl) / 1,5</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-800 text-base">{formatDeZahl(statFcd, 1)} N/mm²</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart-Visualisierung */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col h-[480px]">
                  <h3 className="text-base font-bold text-text-main mb-2">
                    Gaußsche Normalverteilung und das 5%-Fraktil (f_ck)
                  </h3>
                  <p className="text-xs text-text-main/70 mb-3">
                    Die rote Fläche kennzeichnet den statistischen Ausschuss (5 % aller Werte unterschreiten f_ck).
                  </p>
                  <div className="flex-1 relative w-full h-full">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: Konformitätskriterien nach DIN EN 206 */}
        {activeTab === 'konformitaet' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Kriterien-Übersicht */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main border-b border-home-grau/20 pb-2 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-shiraz" /> Konformitätskriterien nach DIN EN 206 Abs. 8 / DIN 1045-2:2023-08
                  </h3>
                  <p className="text-xs text-text-main/80 leading-relaxed">
                    Für die Konformität der Druckfestigkeit müssen stets zwei Kriterien gleichzeitig erfüllt sein:
                  </p>

                  <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 space-y-2 text-xs">
                    <span className="font-bold text-shiraz block">Kriterium 1: Mittelwert (f_cm)</span>
                    <ul className="list-disc list-inside space-y-1 text-text-main/80">
                      <li>
                        <strong>Erstprüfung (Anfangsproduktion n = 3 bis 14):</strong><br />
                        <span className="font-mono font-bold ml-4">f_cm &ge; f_ck + 4,0 N/mm²</span>
                      </li>
                      <li>
                        <strong>Stetige Produktion (n &ge; 15 über max. 12 Monate):</strong><br />
                        <span className="font-mono font-bold ml-4">f_cm &ge; f_ck + 1,48 · s</span> (mit Mindeststreuung <InlineMath math="s \ge 3{,}0\,\text{N/mm}^2" />)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 space-y-2 text-xs">
                    <span className="font-bold text-shiraz block">Kriterium 2: Jeder Einzelwert (f_ci)</span>
                    <p className="text-text-main/80">
                      Kein einziger geprüfter Probekörper darf die Schranke von:
                    </p>
                    <div className="font-mono font-bold bg-white p-2 rounded-lg border border-home-grau/30 text-rose-800 text-center">
                      f_ci &ge; f_ck - 4,0 N/mm²
                    </div>
                    <p className="text-[11px] text-text-main/60">
                      Ein Ausreißer unter dieser Schwelle stellt eine lokale Gefährdung des Bauteils dar und führt zwingend zur Nichtkonformität.
                    </p>
                  </div>

                  <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/20 flex items-center justify-between mt-1">
                    <div>
                      <span className="text-xs font-bold text-shiraz block">Ausführlicher Labor-Prüfprotokoll-Simulator</span>
                      <span className="text-[11px] text-text-main/70">WPK, CSV-Import, SVG-Festigkeitsverlauf &amp; Druckbericht</span>
                    </div>
                    <button 
                      onClick={() => setGlobalTab('qualitaetssicherung')}
                      className="px-3 py-2 bg-shiraz text-white rounded-xl text-xs font-bold hover:bg-shiraz/90 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      Zum Modul QS <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Interaktiver Schnellevaluator */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-text-main border-b border-home-grau/20 pb-2 flex items-center gap-2">
                    <Scale size={18} className="text-shiraz" /> Interaktiver Festigkeits-Schnellprüfer
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-text-main block mb-1">Betonklasse:</label>
                      <select aria-label="Betonklasse" 
                        value={konfKlasse}
                        onChange={(e) => setKonfKlasse(e.target.value)}
                        className="w-full p-2 bg-off-white border border-home-grau/30 rounded-xl font-bold"
                      >
                        {NORM_KLASSEN.map(cls => (
                          <option key={cls.name} value={cls.name}>{cls.name} (Würfel f_ck = {formatDeWert(cls.fck_cube)} MPa)</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-text-main block mb-1">Prüfregime:</label>
                      <select aria-label="Prüfregime" 
                        value={konfModus}
                        onChange={(e) => {
                          const m = e.target.value as 'erst' | 'stetig';
                          setKonfModus(m);
                          if (m === 'erst') {
                            setKonfWerteStr('34.5, 33.2, 35.8');
                          } else {
                            setKonfWerteStr('35.2, 34.8, 36.5, 33.9, 35.1, 37.0, 34.2, 36.1, 35.5, 34.9, 36.8, 35.0, 34.6, 36.2, 35.7');
                          }
                        }}
                        className="w-full p-2 bg-off-white border border-home-grau/30 rounded-xl font-bold"
                      >
                        <option value="erst">Erstprüfung (n = 3 Proben)</option>
                        <option value="stetig">Stetige Produktion (n &ge; 15 Proben)</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-bold text-text-main block mb-1">
                      Gemessene Festigkeiten [N/mm²] (mit Semikolon getrennt):
                    </label>
                    <input aria-label="Gemessene Festigkeiten [N/mm²] (mit Semikolon getrennt)" 
                      type="text" 
                      value={konfWerteStr} 
                      onChange={(e) => setKonfWerteStr(e.target.value)}
                      className="w-full p-2.5 bg-off-white border border-home-grau/30 rounded-xl font-mono text-xs font-bold"
                    />
                  </div>

                  {/* Auswertung */}
                  <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                    konfBestanden 
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' 
                      : 'bg-rose-50/70 border-rose-300 text-rose-950'
                  }`}>
                    <div className="flex items-center gap-2">
                      {konfBestanden ? (
                        <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle size={22} className="text-rose-600 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-sm block">
                          {konfBestanden ? 'Konformität nach DIN EN 206 bestätigt' : 'Nicht konform: Normgrenzen verfehlt'}
                        </span>
                        <span className="text-xs opacity-80">
                          {konfWerte.length} Proben ausgewertet (Gefordert: {konfModus === 'erst' ? '≥ 3' : '≥ 15'})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-black/10">
                      <div>
                        <span className="text-text-main/70 block">Mittelwert f_cm:</span>
                        <span className={`font-mono font-bold ${konfMeanOk ? 'text-emerald-800' : 'text-rose-800'}`}>
                          {formatDeZahl(konfMean, 2)} N/mm² (Soll: &ge; {formatDeZahl(konfSollMean, 2)})
                        </span>
                      </div>
                      <div>
                        <span className="text-text-main/70 block">Min. Einzelwert:</span>
                        <span className={`font-mono font-bold ${konfMinOk ? 'text-emerald-800' : 'text-rose-800'}`}>
                          {formatDeZahl(konfMin, 2)} N/mm² (Soll: &ge; {formatDeZahl(konfSollMin, 2)})
                        </span>
                      </div>
                      {konfModus === 'stetig' && (
                        <div className="col-span-2">
                          <span className="text-text-main/70 block">Standardabweichung s:</span>
                          <span className="font-mono font-bold">
                            {formatDeZahl(konfStdDev, 2)} N/mm² (Angewandt: {formatDeZahl(konfStdDevUsed, 2)} N/mm², min 3.0)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Festigkeit nach 7 Tagen"
        zielGleichung="f_{cm}(t) = \beta_{cc}(t) \cdot f_{cm}, \quad \beta_{cc}(t) = e^{\,s\,(1 - \sqrt{28/t})}"
        normQuelle="DIN EN 1992-1-1, Gl. (3.1) und (3.2)"
        schritte={[
          { titel: '1. Gegeben', formel: '\\text{C30/37: } f_{cm} = 30 + 8 = 38\\,\\text{N/mm}^2,\\; s = 0{,}25\\;(\\text{Klasse N}),\\; t = 7\\,\\text{d}', erklaerung: 'Zement der Klasse N, z. B. CEM I 42,5 N.' },
          { titel: '2. Entwicklungsbeiwert', formel: '\\beta_{cc}(7) = e^{0{,}25 \\cdot (1 - \\sqrt{4})} = e^{-0{,}25} = 0{,}78', erklaerung: '√(28/7) = 2.' },
          { titel: '3. Mittlere Festigkeit', formel: 'f_{cm}(7) = 0{,}78 \\cdot 38 = 29{,}6\\,\\text{N/mm}^2', erklaerung: 'Nach 7 Tagen sind rund 78 % der 28-Tage-Festigkeit erreicht.' },
        ]}
        ergebnisHinweis="f_cm(7 d) ≈ 29,6 N/mm² (Zylinder, Mittelwert)."
      />

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Konformität bei stetiger Herstellung"
        zielGleichung="f_{cm} \ge f_{ck} + 1{,}48\,\sigma, \quad f_{ci} \ge f_{ck} - 4"
        normQuelle="DIN EN 206 (Konformitätskriterien Druckfestigkeit); σ ≥ 3,0 N/mm²"
        schritte={[
          { titel: '1. Gegeben', formel: '\\text{C25/30: } f_{ck,cube} = 30,\\; n = 15,\\; f_{cm} = 36{,}0,\\; s = 2{,}6,\\; f_{ci,min} = 27{,}5\\,\\text{N/mm}^2', erklaerung: 'Würfelergebnisse aus der laufenden Produktion.' },
          { titel: '2. Standardabweichung', formel: '\\sigma = \\max(2{,}6;\\; 3{,}0) = 3{,}0', erklaerung: 'Der Rechenwert darf 3,0 N/mm² nicht unterschreiten.' },
          { titel: '3. Mittelwertkriterium', formel: '30 + 1{,}48 \\cdot 3{,}0 = 34{,}4 \\le 36{,}0', erklaerung: 'Erfüllt.' },
          { titel: '4. Einzelwertkriterium', formel: '27{,}5 \\ge 30 - 4 = 26{,}0', erklaerung: 'Erfüllt.' },
        ]}
        ergebnisHinweis="Beide Kriterien erfüllt – die Produktion ist konform."
      />

      <ModulTest moduleId="festbeton" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Druckfestigkeit', url: 'https://de.wikipedia.org/wiki/Druckfestigkeit' },
          { title: 'Eurocode 2', url: 'https://de.wikipedia.org/wiki/Eurocode_2' }
        ]}
        literatur={[
          'Heidelberg Materials / InformationsZentrum Beton: Betontechnische Daten (Stand 2022 / aktualisiert nach DIN 1045-2:2023-08)',
          'Grübl, P.; Weigler, H.; Karl, S.: Beton – Arten, Herstellung und Eigenschaften. 2. Aufl., Berlin: Ernst & Sohn 2001',
          'Zilch, K.; Zehetmaier, G. (2010): Bemessung im konstruktiven Betonbau (Springer Vieweg)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 (Beton: Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN 1045-2:2023-08 (Tragwerke aus Beton - Teil 2: Anwendungsregeln zu DIN EN 206)' },
          { title: 'DIN EN 1992-1-1:2011-01 mit DIN EN 1992-1-1/NA:2013-04 (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken)' },
          { title: 'DIN EN 1992-1-1:2025-09 (Eurocode 2, 2. Generation; Deutsche Fassung EN 1992-1-1:2023 – bauaufsichtlich noch nicht eingeführt (MVV TB 2025/1 und notifizierter Entwurf MVV TB 2026/1 führen weiterhin DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 + NA/A1:2015-12))' },
          { title: 'DIN EN 12390-3:2019-10 (Prüfung von Festbeton - Teil 3: Druckfestigkeit von Probekörpern)' }
        ]}
        formeln={[
          {
            formel: 'f_{cm}(t) = \\beta_{cc}(t) \\cdot f_{cm} \\quad [\\text{N/mm}^2]',
            erklaerung: 'Zeitabhängige mittlere Betondruckfestigkeit im Alter t Tage nach Eurocode 2.',
            quelle: 'DIN EN 1992-1-1 Abs. 3.1.2'
          },
          {
            formel: '\\beta_{cc}(t) = \\exp\\left( s \\cdot \\left[ 1 - \\sqrt{\\frac{28}{t}} \\right] \\right)',
            erklaerung: 'Entwicklungsbeiwert β_cc(t) nach Eurocode 2: s ist der zementabhängige Erhärtungskoeffizient (s = 0,20 für Klasse R; s = 0,25 für Klasse N; s = 0,38 für Klasse S).',
            quelle: 'DIN EN 1992-1-1 Gl. (3.1)'
          },
          {
            formel: 'f_{cd} = \\frac{\\alpha_{cc} \\cdot f_{ck,cyl}}{\\gamma_c} \\quad [\\text{N/mm}^2]',
            erklaerung: 'Bemessungswert der Betondruckfestigkeit im Grenzzustand der Tragfähigkeit (GZT) nach Eurocode 2 (α_cc = 0,85 für Dauerlastwirkungen in Deutschland, γ_c = 1,5 für ständige Bemessungssituationen).',
            quelle: 'DIN EN 1992-1-1 Abs. 3.1.6'
          },
          {
            formel: 'f_{ck} = f_{cm} - 1{,}645 \\cdot \\sigma \\quad [\\text{N/mm}^2]',
            erklaerung: 'Statistische Definition der charakteristischen Festigkeit als 5%-Fraktil bei Gaußscher Normalverteilung.',
            quelle: 'DIN EN 206 / DIN EN 1990'
          },
          {
            formel: 'f_{cm} \\ge f_{ck} + \\lambda \\quad \\text{und} \\quad f_{ci} \\ge f_{ck} - 4\\,\\text{N/mm}^2',
            erklaerung: 'Konformitätskriterien nach DIN EN 206 Abs. 8 (Erstprüfung: λ = 4,0 N/mm² für n=3; stetige Herstellung: λ = 1,48·s für n>=15).',
            quelle: 'DIN EN 206:2021 Tabelle 14 & 15'
          }
        ]}
      />
    </div>
  );
}
