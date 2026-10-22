import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Timer, Activity, Layers, Clock, ArrowDown, Scale, Play, CheckCircle2, Sliders } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function KriechenSchwinden() {
  const [material, setMaterial] = useState<'beton' | 'stahl' | 'rheologie'>('beton');

  // Beton States
  const [fck, setFck] = useState(30);
  const [rh, setRh] = useState(50);
  const [h0, setH0] = useState(200);
  const [t0, setT0] = useState(28);
  const [zementArt, setZementArt] = useState('N');

  // Stahl States
  const [sigmaRatio, setSigmaRatio] = useState(0.7);
  const [stahlKlasse, setStahlKlasse] = useState('2'); // 1: Draht, 2: Litze, 3: Stab

  const calculateBeton = () => {
    const labels = [];
    const creepData = [];
    const shrinkageData = [];
    const relaxationData = [];

    const fcm = fck + 8;
    const Ecm = 22000 * Math.pow(fcm / 10, 0.3); // in MPa
    const alpha1 = Math.pow(35 / fcm, 0.7);
    const alpha2 = Math.pow(35 / fcm, 0.2);
    const alpha3 = Math.pow(35 / fcm, 0.5);

    // DIN EN 1992-1-1 Anhang B, Gl. (B.3a) & (B.3b)
    let phiRH = 1 + (1 - rh / 100) / (0.1 * Math.pow(h0, 1/3));
    if (fcm > 35) {
      phiRH = (1 + ((1 - rh / 100) / (0.1 * Math.pow(h0, 1/3))) * alpha1) * alpha2;
    }

    const betaFcm = 16.8 / Math.sqrt(fcm);
    const betaT0 = 1 / (0.1 + Math.pow(t0, 0.2));
    const phi0 = phiRH * betaFcm * betaT0;

    // DIN EN 1992-1-1 Anhang B, Gl. (B.8a) & (B.8b)
    const betaH = fcm > 35
      ? Math.min(1.5 * (1 + Math.pow(0.012 * rh, 18)) * h0 + 250 * alpha3, 1500 * alpha3)
      : Math.min(1.5 * (1 + Math.pow(0.012 * rh, 18)) * h0 + 250, 1500);

    // Trocknungsschwund-Koeffizienten nach DIN EN 1992-1-1 Anhang B, Tabelle B.2
    let alphaDs1 = 4.0;
    let alphaDs2 = 0.12;
    if (zementArt === 'S') {
      alphaDs1 = 3.0;
      alphaDs2 = 0.13;
    } else if (zementArt === 'R') {
      alphaDs1 = 6.0;
      alphaDs2 = 0.11;
    }

    const timePoints = [];
    let currentT = t0;
    while (currentT <= 10000) {
      timePoints.push(currentT);
      if (currentT < 10) currentT += 1;
      else if (currentT < 100) currentT += 10;
      else if (currentT < 1000) currentT += 100;
      else currentT += 1000;
    }
    if (timePoints[timePoints.length - 1] !== 10000) timePoints.push(10000);

    for (const t of timePoints) {
      labels.push(t);
      
      // Creep
      const betaCT = Math.pow((t - t0) / (betaH + t - t0), 0.3);
      const phiT = phi0 * betaCT;
      creepData.push(phiT);

      // Shrinkage (drying shrinkage nach DIN EN 1992-1-1 Anhang B, Gl. B.11 & B.12)
      const betaDS = (t - t0) / ((t - t0) + 0.04 * Math.sqrt(Math.pow(h0, 3)));
      const betaRH = 1.55 * (1 - Math.pow(rh / 100, 3));
      const epsCd0 = 0.85 * (220 + 110 * alphaDs1) * Math.exp(-alphaDs2 * (fcm / 10)) * 1e-6 * betaRH;
      const epsCd = epsCd0 * betaDS;
      shrinkageData.push(epsCd * 1e6); // in microstrain

      // Relaxation (simplified effective modulus approach)
      // R(t, t0) = Ecm / (1 + phi(t, t0))
      const relaxationModulus = Ecm / (1 + phiT);
      relaxationData.push(relaxationModulus);
    }

    return { labels, creepData, shrinkageData, relaxationData, Ecm };
  };

  const calculateStahl = () => {
    const labels = [];
    const relaxationData = [];

    // Relaxation according to EC2 for prestressing steel
    // Class 1: Wire/Strand ordinary relaxation
    // Class 2: Wire/Strand low relaxation
    // Class 3: Hot rolled and processed bars
    
    const rho1000Map: Record<string, number> = {
      '1': 8.0,
      '2': 2.5,
      '3': 4.0
    };
    
    const rho1000 = rho1000Map[stahlKlasse] || 2.5;
    
    const mu = sigmaRatio;
    
    const timePoints = [1, 10, 100, 1000, 10000, 100000, 500000]; // hours
    
    for (const t of timePoints) {
      labels.push(t);
      
      let relLoss = 0;
      if (mu > 0.5) { // relaxation is negligible below 0.5
        let k1 = 0.66, k2 = 9.1;
        if (stahlKlasse === '1') { k1 = 5.39; k2 = 6.7; }
        else if (stahlKlasse === '3') { k1 = 1.98; k2 = 8.0; }
        relLoss = k1 * rho1000 * Math.exp(k2 * mu) * Math.pow(t / 1000, 0.75 * (1 - mu)) * 1e-5;
      }
      // Convert to percentage
      relaxationData.push(relLoss * 100);
    }

    return { labels, relaxationData };
  };

  const renderBeton = () => {
    const { labels, creepData, shrinkageData, relaxationData, Ecm } = calculateBeton();

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">Eingabeparameter (Beton)</h2>
      

            
            <Slider info="Charakteristische Zylinderdruckfestigkeit des Betons in MPa, bestimmt den E-Modul und die Kriech- und Schwindbeiwerte."
              label={<FormulaText text="Betondruckfestigkeit (f_{ck})" />}
              min={12} max={90} step={1}
              value={fck} unit="MPa"
              
              onChange={(e) => setFck(Number(e.target.value))}
            />
            
            <Slider info="Umgebungsfeuchte im Jahresmittel (bspw. 50% für trockene Innenräume, 80% für Außenbauteile)."
              label={<FormulaText text="Relative Luftfeuchtigkeit (RH)" />}
              min={20} max={100} step={5}
              value={rh} unit="%"
              
              onChange={(e) => setRh(Number(e.target.value))}
            />
            
            <Slider info="Wirksame Querschnittsdicke h_0 = 2 * A_c / u (A_c: Betonquerschnittsfläche, u: dem Schwinden ausgesetzter Umfang)."
              label={<FormulaText text="Wirksame Bauteildicke (h_0)" />}
              min={50} max={1000} step={10}
              value={h0} unit="mm"
              
              onChange={(e) => setH0(Number(e.target.value))}
            />

            <Slider info="Betonalter zum Zeitpunkt der ersten Belastungsübernahme."
              label={<FormulaText text="Belastungsalter (t_0)" />}
              min={1} max={365} step={1}
              value={t0} unit="Tage"
              
              onChange={(e) => setT0(Number(e.target.value))}
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Zementklasse</label><InfoTooltip text="Klassifizierung der Festigkeitsentwicklung des Zements." /></div>
                <InfoTooltip text="S: langsam erhärtend, N: normal erhärtend, R: schnell erhärtend." />
              </div>
              <select 
                className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                value={zementArt}
                onChange={(e) => setZementArt(e.target.value)}
              >
                <option value="S">Klasse S (langsam)</option>
                <option value="N">Klasse N (normal)</option>
                <option value="R">Klasse R (schnell)</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[300px]">
                <h2 className="text-lg font-bold text-text-main mb-2"><FormulaText text="Kriechzahl \varphi(t, t_0)" /></h2>
                <div className="flex-1 relative w-full h-full">
                  <Line 
                    data={{
                      labels,
                      datasets: [{
                        label: 'Kriechzahl φ',
                        data: creepData,
                        borderColor: '#A3113E',
                        borderWidth: 2,
                        pointRadius: 0,
                      }]
                    }} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { type: 'logarithmic', title: { display: true, text: 'Zeit t (Tage)' }, min: Math.max(1, t0) },
                        y: { min: 0, title: { display: true, text: 'Kriechzahl φ' } }
                      },
                      plugins: { legend: { display: false } }
                    }} 
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[300px]">
                <h2 className="text-lg font-bold text-text-main mb-2"><FormulaText text="Trocknungsschwinden ε_{cd}(t)" /></h2>
                <div className="flex-1 relative w-full h-full">
                  <Line 
                    data={{
                      labels,
                      datasets: [
                        {
                          label: 'Trocknungsschwinden εcd',
                          data: shrinkageData,
                          borderColor: '#0e558c',
                          borderWidth: 2,
                          pointRadius: 0,
                        }
                      ]
                    }} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { type: 'logarithmic', title: { display: true, text: 'Zeit t (Tage)' }, min: Math.max(1, t0) },
                        y: { min: 0, title: { display: true, text: 'Schwinddehnung (μm/m)' } }
                      },
                      plugins: { legend: { display: false } }
                    }} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[300px]">
              <h2 className="text-lg font-bold text-text-main mb-2"><FormulaText text="Relaxationsmodul R(t, t_0)" /></h2>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={{
                    labels,
                    datasets: [{
                      label: 'Relaxationsmodul R(t, t0)',
                      data: relaxationData,
                      borderColor: '#10b981',
                      borderWidth: 2,
                      pointRadius: 0,
                    }]
                  }} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { type: 'logarithmic', title: { display: true, text: 'Zeit t (Tage)' }, min: Math.max(1, t0) },
                      y: { min: 0, max: Ecm * 1.1, title: { display: true, text: 'Modul R (MPa)' } }
                    },
                    plugins: { legend: { display: false } }
                  }} 
                />
              </div>
              <p className="text-xs text-text-main/70 mt-2">
                Das Relaxationsmodul beschreibt den Spannungsabfall unter konstanter Dehnung, angenähert durch <FormulaText text="R(t, t_0) \approx E_{cm} / (1 + \varphi(t, t_0))" />.
              </p>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Kriechen & Schwinden</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kriechen */}
                <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                  <div className="text-sm font-bold mb-2">Kriechen (unter Last)</div>
                  <svg width="100%" height="100" viewBox="0 0 200 100">
                    {/* t=0 */}
                    <rect x="20" y="20" width="60" height="60" fill="#cbd5e1" stroke="#94a3b8" />
                    <path d="M 50 20 L 50 5" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)" />
                    <text x="50" y="95" fontSize="10" fill="#64748b" textAnchor="middle">t = t_0</text>
                    
                    {/* Pfeil */}
                    <path d="M 90 50 L 110 50" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-gray)" />
                    
                    {/* t=inf */}
                    <rect x="120" y="30" width="60" height="50" fill="#94a3b8" stroke="#64748b" />
                    <path d="M 150 30 L 150 15" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)" />
                    <text x="150" y="95" fontSize="10" fill="#64748b" textAnchor="middle">t = ∞</text>
                    
                    {/* Verformung */}
                    <path d="M 185 20 L 185 30" stroke="#3b82f6" strokeWidth="1" markerStart="url(#arrow-blue)" markerEnd="url(#arrow-blue)" />
                    <text x="190" y="28" fontSize="10" fill="#3b82f6">Δl</text>
                  </svg>
                  <div className="text-xs text-text-main/70 text-center mt-2">Zusätzliche Verformung bei konstanter Spannung.</div>
                </div>

                {/* Schwinden */}
                <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                  <div className="text-sm font-bold mb-2">Schwinden (ohne Last)</div>
                  <svg width="100%" height="100" viewBox="0 0 200 100">
                    {/* t=0 */}
                    <rect x="20" y="20" width="60" height="60" fill="#cbd5e1" stroke="#94a3b8" />
                    <text x="50" y="95" fontSize="10" fill="#64748b" textAnchor="middle">t = 0 (feucht)</text>
                    
                    {/* Pfeil */}
                    <path d="M 90 50 L 110 50" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-gray)" />
                    <path d="M 100 40 Q 110 20 120 30" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" markerEnd="url(#arrow-blue)" />
                    <text x="110" y="20" fontSize="8" fill="#3b82f6">H₂O</text>

                    {/* t=inf */}
                    <rect x="125" y="25" width="50" height="50" fill="#94a3b8" stroke="#64748b" />
                    <text x="150" y="95" fontSize="10" fill="#64748b" textAnchor="middle">t = ∞ (trocken)</text>

                    <defs>
                      <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                      </marker>
                      <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                      </marker>
                      <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                      </marker>
                    </defs>
                  </svg>
                  <div className="text-xs text-text-main/70 text-center mt-2">Volumenverringerung durch Feuchtigkeitsabgabe.</div>
                </div>
              </div>
            </div>

            {/* --- Neu: Detaillierte Darstellung aller 5 Schwindarten --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="font-bold text-lg text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
                <span>🌊</span> Die 5 Arten des Schwindens im Detail
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Unter Schwinden versteht man die volumenmindernde zeitabhängige Verformung von unbelastetem Beton. 
                In der betontechnologischen Praxis unterscheidet die Fachliteratur fünf grundlegende Schwindprozesse:
          </p>
        </div>

              <div className="grid grid-cols-1 gap-4 mt-1">
                {/* 1. Plastisches Schwinden */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">1. Plastisches Schwinden (Kapillarschwinden)</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[9px] font-bold">Stadium: Frischbeton</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1">
                    <strong>Ursache:</strong> Tritt unmittelbar in den ersten Stunden auf, wenn Wasser an der freien Bauteiloberfläche schneller verdunstet, als kapillares Wasser aus tieferen Schichten nachfließen kann (Bluten). Der entstehende kapillare Unterzug zieht die weiche Zementmatrix zusammen.
                  </p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans">
                    <strong>Gegenmaßnahme:</strong> Sofortiges Auflegen von feuchten Vliesen oder Folien, Aufsprühen von Nachbehandlungsmitteln (Curing) direkt nach dem Abziehen, Windschutz errichten.
                  </p>
                </div>

                {/* 2. Autogenes Schwinden */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">2. Autogenes Schwinden (Selbstaustrocknung)</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[9px] font-bold">Stadium: Erste Tage/Wochen</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1">
                    <strong>Ursache:</strong> Chemische Selbstaustrocknung im Inneren dichter Gefüge. Da die Hydratation Wasser verbraucht und bei niedrigen w/z-Werten (&lt; 0,40) kein freies Außenwasser nachdiffundieren kann, saugen sich die feinen Kapillarporen leer. Der immense Meniskus-Sog schrumpft das Zementsteinskelett.
                  </p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans">
                    <strong>Gegenmaßnahme:</strong> Internes Curing durch Einmischen von wassergesättigtem Blähtonfeinsand oder Superabsorbern (SAP), Verwendung von flüssigen Festigkeitsbildnern / Schwindreduzierern (SRA).
                  </p>
                </div>

                {/* 3. Trocknungsschwinden */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">3. Trocknungsschwinden (Drying Shrinkage)</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-[9px] font-bold">Stadium: Langzeit (Jahre)</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1">
                    <strong>Ursache:</strong> Der langsame Ausgleich des physikalisch gebundenen Adsorptionswassers mit der trockenen Außenluft. Es ist die ausgeprägteste Schwindart im Hochbau, gesteuert durch die relative Luftfeuchtigkeit (RH) und die Austauschfläche des Betonquerschnitts h<sub>0</sub>.
                  </p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans">
                    <strong>Gegenmaßnahme:</strong> Reduktion des Zementsteingehalts (Gesteinskörnungsanteil maximieren), Einsatz schwindarmer Zemente, längere Feuchthaltung zur Gefüge-Verdichtung.
                  </p>
                </div>

                {/* 4. Chemische Schrumpfung */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">4. Chemische Schrumpfung (Hydratationsunterdruck)</span>
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono text-[9px] font-bold">Stadium: Permanent aktiv</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1">
                    <strong>Ursache:</strong> Rein atomares thermodynamisches Phänomen. Die Reaktionsprodukte (C-S-H-Phasen) weisen ein geringeres Eigennutzvolumen auf als die Summe der Ausgangsstoffe (Klinker + Anmachwasser). Es entsteht ein inneres Volumendefizit von ca. 25% des umgesetzten Wassers, das als Mikroporen vakuumartig verbleibt.
                  </p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans">
                    <strong>Gegenmaßnahme:</strong> Thermodynamisch unvermeidbar. Wird betontechnologisch durch ein dichtes Primärgefüge und abgestimmtes Flugasche-Verhältnis kompensiert.
                  </p>
                </div>

                {/* 5. Karbonatisierungsschwinden */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">5. Karbonatisierungsschwinden</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[9px] font-bold">Stadium: Langzeit (Jahrzehnte)</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1">
                    <strong>Ursache:</strong> Chemische Umwandlung des alkalischen Calciumhydroxids Ca(OH)<sub>2</sub> durch eindiffundierendes Kohlenstoffdioxid CO<sub>2</sub> aus der Raumluft zu festem Calciumcarbonat CaCO<sub>3</sub>. Durch diesen mineralischen Kristallumbau schrumpft die Matrix um ein geringes Maß, zudem wird Wasser freigesetzt.
                  </p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans">
                    <strong>Gegenmaßnahme:</strong> Sehr dichter Beton zur Verlangsamung der Diffusionsgeschwindigkeit, Reduktion von Oberflächenrissen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ModuleFooter weblinks={[{ title: "Beton.wiki: Kriechen", url: "https://beton.wiki/index.php?title=Kriechen" }, { title: "Zement-Merkblätter Übersicht", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }, { title: "Beton.wiki: Schwinden", url: "https://beton.wiki/index.php?title=Schwinden" }]} 
          wikipedia={[
                { title: 'Kriechen (Werkstoffe)', url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
                { title: 'Schwinden (Beton)', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' }
              ]}
              regelwerke={[
            'DIN EN 1992-1-1 (Eurocode 2): Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken',
            'fib Model Code 2010'
          ]}
          literatur={[
            'Zilch, K., Zehetmaier, G.: Bemessung im Konstruktiven Betonbau (2010)',
            'Grasser, E. et al.: Bemessung von Betonbauten (2001)'
          ]}
          formeln={[
            {
              formel: '\\varphi (t, t_0) = \\varphi _0 \\cdot  \\beta _c(t, t_0)',
              erklaerung: 'Kriechzahl\n\\varphi (t, t_0): Kriechzahl zum Zeitpunkt t bei Belastungsalter t_0 [-]\n\\beta _c(t, t_0): Beiwert für den zeitlichen Verlauf des Kriechens [-]\n\\varphi _0: Nennkriechzahl [-]',
              quelle: 'Zilch, K., Zehetmaier, G.: Bemessung im Konstrukti...'
            },
            {
              formel: '\\varepsilon _{cs} = \\varepsilon _{cd} + \\varepsilon _{ca}',
              erklaerung: 'Gesamtschwinddehnung\n\\varepsilon _{cs}: Gesamtschwinddehnung [-]\n\\varepsilon _{cd}: Trocknungsschwinddehnung [-]\n\\varepsilon _{ca}: Autogene Schwinddehnung [-]',
              quelle: 'Zilch, K., Zehetmaier, G.: Bemessung im Konstrukti...'
            },
            {
              formel: 'R(t, t_0) \\approx  \\frac{E_{cm}}{1 + \\varphi (t, t_0)}',
              erklaerung: 'Relaxationsmodul (vereinfacht)\nR(t, t_0): Relaxationsmodul (effektiver E-Modul) [MPa]\nE_{cm}: Sekantenmodul der Elastizität des Betons [MPa]\n\\varphi (t, t_0): Kriechzahl [-]',
              quelle: 'Zilch, K., Zehetmaier, G.: Bemessung im Konstrukti...'
            }
          ]}
        />
      </>
    );
  };

  const renderStahl = () => {
    const { labels, relaxationData } = calculateStahl();

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main">Eingabeparameter (Spannstahl)</h2>
            
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Kriechen und Schwinden spielen bei normalem Baustahl keine Rolle (bei Raumtemperatur). 
                Bei <strong>Spannstahl</strong> ist jedoch die <strong>Relaxation</strong> (Spannungsverlust bei konstanter Dehnung) von großer Bedeutung.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Spannstahlklasse (Relaxationsverhalten)</label><InfoTooltip text="Klassifizierung des Spannstahls nach seinem Spannungsverlust." /></div>
              <select 
                className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                value={stahlKlasse}
                onChange={(e) => setStahlKlasse(e.target.value)}
              >
                <option value="1">Klasse 1: Draht/Litze (normale Relaxation)</option>
                <option value="2">Klasse 2: Draht/Litze (niedrige Relaxation)</option>
                <option value="3">Klasse 3: warmgewalzte Stäbe</option>
              </select>
            </div>

            <Slider info="Verhältnis der eingetragenen Vorspannung im Spannstahl zur charakteristischen Zugfestigkeit f_pk des Spannstahls."
              label={<FormulaText text="Spannungsniveau (\sigma_{pi} / f_{pk})" />}
              min={0.4} max={0.8} step={0.05}
              value={sigmaRatio} unit="-"
              
              onChange={(e) => setSigmaRatio(Number(e.target.value))}
            />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[400px]">
              <h2 className="text-xl font-bold text-text-main mb-2"><FormulaText text="Relaxationsverlust \Delta\sigma_{pr} / \sigma_{pi}" /></h2>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={{
                    labels,
                    datasets: [{
                      label: 'Spannungsverlust (%)',
                      data: relaxationData,
                      borderColor: '#10b981',
                      borderWidth: 2,
                      pointRadius: 4,
                      pointBackgroundColor: '#10b981'
                    }]
                  }} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { type: 'logarithmic', title: { display: true, text: 'Zeit t (Stunden)' } },
                      y: { min: 0, title: { display: true, text: 'Spannungsverlust (%)' } }
                    },
                    plugins: { 
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => `Verlust: ${formatDeZahl(context.parsed.y, 2)}%`
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>

        <ModuleFooter 
          wikipedia={[
                { title: 'Kriechen (Werkstoffe)', url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
                { title: 'Schwinden (Beton)', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' }
              ]}
              regelwerke={[
            'DIN EN 1992-1-1 (Eurocode 2): Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken'
          ]}
          literatur={[
            'Zilch, K., Zehetmaier, G.: Bemessung im Konstruktiven Betonbau (2010)'
          ]}
          formeln={[
            {
              formel: '\\frac{\\Delta \\sigma _{pr}}{\\sigma _{pi}} = k_1 \\cdot  \\rho _{1000} \\cdot  e^{k_2 \\cdot  \\mu } \\cdot  \\left(\\frac{t}{1000}\\right)^{0{,}75 \\cdot  (1-\\mu )} \\cdot  10^{-5}',
              erklaerung: 'Spannungsverlust durch Relaxation\n\\Delta\\sigma_{pr}: Spannungsverlust durch Relaxation [MPa]\n\\sigma_{pi}: Anfängliche Vorspannung [MPa]\n\\rho_{1000}: Relaxationsverlust nach 1000h in % (Klasse 1: 8.0, Klasse 2: 2.5, Klasse 3: 4.0)\n\\mu: Spannungsniveau (\\sigma_{pi} / f_{pk}) [-]\nt: Zeit [Stunden]\nk_1, k_2: Beiwerte nach Klasse (Kl. 1: 5.39, 6.7 | Kl. 2: 0.66, 9.1 | Kl. 3: 1.98, 8.0)\nQuelle: DIN EN 1992-1-1 (EC2)',
              quelle: 'Zilch, K., Zehetmaier, G.: Bemessung im Konstrukti...'
            }
          ]}
        />
      </>
    );
  };

  const renderRheologieSimulator = () => {
    // Current simulation time points
    const simDays = [
      { label: 't₀ (Start Last)', days: t0 },
      { label: '90 Tage', days: 90 },
      { label: '1 Jahr (365 d)', days: 365 },
      { label: '5 Jahre (1825 d)', days: 1825 },
      { label: '30 Jahre (10950 d)', days: 10950 },
      { label: '50 Jahre (18250 d)', days: 18250 },
    ];

    const fcm = fck + 8;
    const Ecm = 22000 * Math.pow(fcm / 10, 0.3); // in MPa
    const alpha1 = Math.pow(35 / fcm, 0.7);
    const alpha2 = Math.pow(35 / fcm, 0.2);
    const alpha3 = Math.pow(35 / fcm, 0.5);

    let phiRH = 1 + ((1 - rh / 100) / (0.1 * Math.pow(h0, 1/3))) * alpha1;
    if (fcm > 35) {
      phiRH = (1 + ((1 - rh / 100) / (0.1 * Math.pow(h0, 1/3))) * alpha1) * alpha2;
    }
    const betaFcm = 16.8 / Math.sqrt(fcm);
    const betaT0 = 1 / (0.1 + Math.pow(t0, 0.2));
    const phi0 = phiRH * betaFcm * betaT0;
    const betaH = Math.min(1.5 * (1 + Math.pow(0.012 * rh, 18)) * h0 + 250 * alpha3, 1500 * alpha3);

    const sigmaC = 8.5; // MPa Dauerlastspannung
    const L0_mm = 3000; // 3 m Stützenhöhe

    const calcStateAt = (days: number) => {
      const dt = Math.max(0.01, days - t0);
      const betaCT = Math.pow(dt / (betaH + dt), 0.3);
      const phiT = phi0 * betaCT;

      // Shrinkage
      const betaDS = dt / (dt + 0.04 * Math.sqrt(Math.pow(h0, 3)));
      const epsCd0 = 0.85 * (220 + 110 * alpha1) * Math.exp(-alpha2 * fcm / 10) * 1e-6 * 1.55 * (1 - Math.pow(rh/100, 3));
      const epsCd = epsCd0 * betaDS;

      const epsEl = (sigmaC / Ecm);
      const epsCr = phiT * epsEl;
      const epsCs = epsCd;
      const epsTot = epsEl + epsCr + epsCs;

      const dL_el = epsEl * L0_mm;
      const dL_cr = epsCr * L0_mm;
      const dL_cs = epsCs * L0_mm;
      const dL_tot = epsTot * L0_mm;

      return { phiT, epsEl, epsCr, epsCs, epsTot, dL_el, dL_cr, dL_cs, dL_tot };
    };

    const currentState = calcStateAt(simDays[timeIndex].days);

    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p>
            <strong>Rheologischer Mechanismus &amp; Stützenverformung (DIN EN 1992-1-1):</strong> Das zeitabhängige Kriechen von Beton 
            lässt sich physikalisch als Kombination aus einer rein elastischen Hooke’schen Feder (<InlineMath math="E_1" />) und einem 
            viskoelastischen Kelvin-Voigt-Körper (Feder <InlineMath math="E_2" /> parallel zu einem viskosen Newton-Dämpfer <InlineMath math="\eta" />) 
            beschreiben. Unter konstanter Last verlagert sich die Spannung allmählich vom Dämpfer auf die Feder. 
            Gleichzeitig bewirkt das lastunabhängige Trocknungsschwinden eine zusätzliche Stauchung.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/20 pb-2">
                <Clock size={16} className="text-shiraz" /> 1. Betrachtungszeitraum (t)
              </h3>

              {/* Time Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-text-main">Standzeit des Tragwerks:</span>
                  <span className="font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded text-xs">
                    {simDays[timeIndex].label}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={1}
                  value={timeIndex}
                  onChange={(e) => setTimeIndex(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                />
                <div className="flex justify-between text-[10px] text-text-main/60 font-mono">
                  <span>t₀</span>
                  <span>90 d</span>
                  <span>1 a</span>
                  <span>5 a</span>
                  <span>30 a</span>
                  <span>50 a</span>
                </div>
              </div>

              {/* Quick Time Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {simDays.map((sd, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTimeIndex(idx)}
                    className={`py-1.5 px-2 text-[11px] rounded-lg border font-medium transition-all cursor-pointer ${
                      timeIndex === idx
                        ? 'bg-shiraz text-white border-shiraz shadow-xs font-bold'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100'
                    }`}
                  >
                    {sd.label.split(' ')[0]} {sd.label.split(' ')[1] || ''}
                  </button>
                ))}
              </div>

              {/* Base Parameters Overview */}
              <div className="pt-3 border-t border-home-grau/20 space-y-2 text-xs">
                <span className="font-bold text-text-main block">Randbedingungen der Stütze:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-off-white p-2 rounded-lg border border-home-grau/20">
                    <span className="text-text-main/60 block">Stützenhöhe L₀:</span>
                    <strong className="font-mono text-text-main">3.000 mm (3 m)</strong>
                  </div>
                  <div className="bg-off-white p-2 rounded-lg border border-home-grau/20">
                    <span className="text-text-main/60 block">Dauerlast σc:</span>
                    <strong className="font-mono text-text-main">8,5 MPa (C30/37)</strong>
                  </div>
                  <div className="bg-off-white p-2 rounded-lg border border-home-grau/20">
                    <span className="text-text-main/60 block">E-Modul Ecm:</span>
                    <strong className="font-mono text-text-main">{formatDeZahl(Ecm, 0)} MPa</strong>
                  </div>
                  <div className="bg-off-white p-2 rounded-lg border border-home-grau/20">
                    <span className="text-text-main/60 block">Luftfeuchte RH:</span>
                    <strong className="font-mono text-text-main">{formatDeWert(rh)} %</strong>
                  </div>
                </div>
              </div>

              {/* Live Deformation Readouts */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-home-grau/20">
                <div className="bg-blue-50/80 p-2.5 rounded-xl border border-blue-200">
                  <span className="text-[10px] uppercase font-bold text-blue-900 block">Elastisch ΔL_el</span>
                  <span className="text-lg font-mono font-bold text-blue-700">
                    {formatDeZahl(currentState.dL_el, 2)} mm
                  </span>
                  <span className="text-[9px] text-blue-900/70 block">Spontan bei Lastbeginn</span>
                </div>

                <div className="bg-rose-50/80 p-2.5 rounded-xl border border-rose-200">
                  <span className="text-[10px] uppercase font-bold text-rose-900 block">Kriechen ΔL_cr</span>
                  <span className="text-lg font-mono font-bold text-shiraz">
                    {formatDeZahl(currentState.dL_cr, 2)} mm
                  </span>
                  <span className="text-[9px] text-rose-900/70 block">φ = {formatDeZahl(currentState.phiT, 2)}</span>
                </div>

                <div className="bg-purple-50/80 p-2.5 rounded-xl border border-purple-200">
                  <span className="text-[10px] uppercase font-bold text-purple-900 block">Schwinden ΔL_cs</span>
                  <span className="text-lg font-mono font-bold text-purple-700">
                    {formatDeZahl(currentState.dL_cs, 2)} mm
                  </span>
                  <span className="text-[9px] text-purple-900/70 block">Lastunabhängig</span>
                </div>

                <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-300">
                  <span className="text-[10px] uppercase font-bold text-emerald-900 block">Gesamtstauchung</span>
                  <span className="text-lg font-mono font-bold text-emerald-800">
                    {formatDeZahl(currentState.dL_tot, 2)} mm
                  </span>
                  <span className="text-[9px] text-emerald-900/70 block">ΔL_tot = {formatDeZahl((currentState.dL_tot / L0_mm * 1000), 2)} ‰</span>
                </div>
              </div>

            </div>
          </div>

          {/* Visualization Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
              
              <div className="flex items-center justify-between pb-3 border-b border-home-grau/20 mb-3">
                <div>
                  <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                    <Layers size={18} className="text-shiraz" /> 2. Physischer Säulenvergleich &amp; Rheologisches Modell
                  </h3>
                  <span className="text-xs text-text-main/70 font-medium">Belastete Stütze (Kriechen + Schwinden) vs. unbelastetes Schwindprisma</span>
                </div>
                <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                  Maßstab Verformung: 25× überhöht
                </span>
              </div>

              {/* Visual SVG Canvas */}
              <div className="relative w-full aspect-4/3 max-h-[380px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 540 380" className="select-none">
                  <defs>
                    <linearGradient id="columnGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="50%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>

                    <linearGradient id="pressGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="50%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                  </defs>

                  {/* Ceiling/Load distribution beam */}
                  <rect x="20" y="20" width="500" height="18" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
                  <text x="270" y="33" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Tragwerksebene (Deckenauflager)
                  </text>

                  {/* Floor slab bottom */}
                  <rect x="20" y="340" width="500" height="24" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
                  <text x="270" y="356" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Fundament / Rohbeton-Bodenplatte
                  </text>

                  {/* LEFT: Loaded Column (Kriechen + Schwinden + Elastizität) */}
                  {(() => {
                    const baseTopY = 80;
                    const baseHeight = 260;
                    // Visual displacement exaggerated 20x for clarity
                    const visualDef = currentState.dL_tot * 6.0;
                    const loadedTopY = baseTopY + visualDef;
                    const loadedHeight = baseHeight - visualDef;

                    return (
                      <g transform="translate(60, 0)">
                        {/* Hydraulic Jack Piston pressing down */}
                        <rect x="18" y="38" width="44" height={loadedTopY - 38} fill="url(#pressGrad)" stroke="#475569" strokeWidth="1" />
                        
                        {/* Hydraulic Platen */}
                        <rect x="10" y={loadedTopY - 8} width="60" height="8" rx="1.5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />

                        {/* Force Arrow N */}
                        <path d="M 40 42 L 40 70" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow)" />
                        <text x="56" y="58" fill="#ef4444" fontSize="11" fontWeight="bold">N (8,5 MPa)</text>

                        {/* Stütze Original Height Ghost Outline */}
                        <rect x="10" y={baseTopY} width="60" height={baseHeight} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

                        {/* Compressed Column Body */}
                        <rect x="10" y={loadedTopY} width="60" height={loadedHeight} fill="url(#columnGrad)" stroke="#0f172a" strokeWidth="2" rx="2" />

                        {/* Shortening delta marker */}
                        <line x1="74" y1={baseTopY} x2="74" y2={loadedTopY} stroke="#38bdf8" strokeWidth="2" />
                        <line x1="71" y1={baseTopY} x2="77" y2={baseTopY} stroke="#38bdf8" strokeWidth="2" />
                        <line x1="71" y1={loadedTopY} x2="77" y2={loadedTopY} stroke="#38bdf8" strokeWidth="2" />
                        <text x="82" y={baseTopY + visualDef / 2 + 4} fill="#38bdf8" fontSize="10" fontWeight="bold">
                          - {formatDeZahl(currentState.dL_tot, 2)} mm
                        </text>

                        {/* Label under Column */}
                        <text x="40" y="330" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Stütze unter Dauerlast
                        </text>
                        <text x="40" y="318" fill="#cbd5e1" fontSize="9" textAnchor="middle">
                          (Elast. + Kriech. + Schwind.)
                        </text>
                      </g>
                    );
                  })()}

                  {/* CENTER: Rheological Model (Maxwell / Kelvin-Voigt) */}
                  <g transform="translate(230, 65)">
                    <rect x="0" y="0" width="130" height="260" rx="8" fill="#0f172a" stroke="#334155" opacity="0.9" />
                    <text x="65" y="20" fill="#fde047" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Rheologisches Modell
                    </text>

                    {/* Spring 1 (Hooke Element E1) */}
                    <text x="65" y="42" fill="#93c5fd" fontSize="9" textAnchor="middle">Feder E₁ (Elastizität)</text>
                    <path d="M 65 48 L 55 54 L 75 62 L 55 70 L 75 78 L 65 84" fill="none" stroke="#60a5fa" strokeWidth="2" />

                    {/* Series connector to Kelvin-Voigt body */}
                    <line x1="65" y1="84" x2="65" y2="105" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="30" y1="105" x2="100" y2="105" stroke="#cbd5e1" strokeWidth="2" />

                    {/* Parallel branch Left: Spring E2 */}
                    <line x1="40" y1="105" x2="40" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
                    <path d="M 40 120 L 32 126 L 48 134 L 32 142 L 48 150 L 40 156" fill="none" stroke="#f472b6" strokeWidth="2" />
                    <line x1="40" y1="156" x2="40" y2="175" stroke="#cbd5e1" strokeWidth="1.5" />
                    <text x="40" y="190" fill="#f472b6" fontSize="8" textAnchor="middle">Feder E₂</text>

                    {/* Parallel branch Right: Dashpot eta (Dämpfer) */}
                    <line x1="90" y1="105" x2="90" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
                    {/* Cylinder housing */}
                    <path d="M 80 125 L 80 155 L 100 155 L 100 125" fill="none" stroke="#38bdf8" strokeWidth="2" />
                    {/* Dashpot Oil Fluid */}
                    <rect x="82" y="138" width="16" height="15" fill="#0284c7" opacity="0.6" />
                    {/* Piston Plate moving inside */}
                    <line x1="84" y1={130 + (currentState.phiT / 3.0) * 12} x2="96" y2={130 + (currentState.phiT / 3.0) * 12} stroke="#f8fafc" strokeWidth="3" />
                    <line x1="90" y1="120" x2="90" y2={130 + (currentState.phiT / 3.0) * 12} stroke="#f8fafc" strokeWidth="2" />
                    <line x1="90" y1="155" x2="90" y2="175" stroke="#cbd5e1" strokeWidth="1.5" />
                    <text x="90" y="190" fill="#38bdf8" fontSize="8" textAnchor="middle">Dämpfer η</text>

                    {/* Rejoining lower bar */}
                    <line x1="30" y1="175" x2="100" y2="175" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="65" y1="175" x2="65" y2="200" stroke="#cbd5e1" strokeWidth="2" />

                    <text x="65" y="222" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Kelvin-Voigt-Körper
                    </text>
                    <text x="65" y="235" fill="#94a3b8" fontSize="8" textAnchor="middle">
                      (Viskoelastisches Kriechen)
                    </text>
                  </g>

                  {/* RIGHT: Unloaded Shrinkage Prism (Reines Schwinden ΔL_cs) */}
                  {(() => {
                    const baseTopY = 80;
                    const baseHeight = 260;
                    const visualDef = currentState.dL_cs * 6.0;
                    const shrinkTopY = baseTopY + visualDef;
                    const shrinkHeight = baseHeight - visualDef;

                    return (
                      <g transform="translate(420, 0)">
                        {/* No external load/jack above */}
                        <text x="30" y="58" fill="#a855f7" fontSize="10" fontWeight="bold" textAnchor="middle">Lastfrei (N = 0)</text>

                        {/* Original Height Ghost Outline */}
                        <rect x="10" y={baseTopY} width="40" height={baseHeight} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

                        {/* Shrunken Prism Body */}
                        <rect x="10" y={shrinkTopY} width="40" height={shrinkHeight} fill="#64748b" stroke="#0f172a" strokeWidth="2" rx="2" />

                        {/* Evaporating Moisture Water Vapor squiggly arrows */}
                        <path d="M 0 140 Q -8 130 0 120" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.7" />
                        <path d="M 60 170 Q 68 160 60 150" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.7" />
                        <text x="30" y="195" fill="#38bdf8" fontSize="9" textAnchor="middle">H₂O ↑</text>

                        {/* Shortening delta marker */}
                        <line x1="56" y1={baseTopY} x2="56" y2={shrinkTopY} stroke="#c084fc" strokeWidth="2" />
                        <line x1="53" y1={baseTopY} x2="59" y2={baseTopY} stroke="#c084fc" strokeWidth="2" />
                        <line x1="53" y1={shrinkTopY} x2="59" y2={shrinkTopY} stroke="#c084fc" strokeWidth="2" />
                        <text x="64" y={baseTopY + visualDef / 2 + 4} fill="#c084fc" fontSize="9" fontWeight="bold">
                          - {formatDeZahl(currentState.dL_cs, 2)} mm
                        </text>

                        {/* Label under Prism */}
                        <text x="30" y="330" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Schwindprisma
                        </text>
                        <text x="30" y="318" fill="#c084fc" fontSize="9" textAnchor="middle">
                          (Reines Trocknen)
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Formula & Mechanistic Footer */}
              <div className="mt-3 p-3 bg-off-white rounded-xl border border-home-grau/25 text-xs text-text-main/80 space-y-1">
                <span className="font-bold text-text-main block">Superpositionsprinzip der Gesamtverformung nach EC2:</span>
                <div className="overflow-x-auto py-0.5">
                  <InlineMath math="\varepsilon_{\text{tot}}(t) = \varepsilon_{\text{el}} + \varepsilon_{\text{cr}}(t, t_0) + \varepsilon_{\text{cs}}(t) = \frac{\sigma_c}{E_{\text{cm}}} \cdot \left[1 + \varphi(t, t_0)\right] + \varepsilon_{\text{cs}}(t)" />
                </div>
              </div>

            </div>
          </div>
        </div>

        <ModuleFooter 
          wikipedia={[
            { title: 'Kriechen (Werkstoffe)', url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
            { title: 'Schwinden (Beton)', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' },
            { title: 'Kelvin-Voigt-Modell', url: 'https://de.wikipedia.org/wiki/Kelvin-Voigt-Modell' }
          ]}
          regelwerke={[
            { title: 'DIN EN 1992-1-1 (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+1992-1-1' },
            { title: 'fib Model Code for Concrete Structures 2010', url: 'https://www.fib-international.org/' }
          ]}
          literatur={[
            'Zilch, K., Zehetmaier, G.: Bemessung im Konstruktiven Betonbau (Springer Vieweg 2010)',
            'Grasser, E. et al.: Bemessung von Betonbauten nach EC2 (2001)'
          ]}
          formeln={[
            {
              formel: '\\varepsilon_{\\text{tot}}(t) = \\frac{\\sigma_c}{E_{\\text{cm}}} \\cdot [1 + \\varphi(t, t_0)] + \\varepsilon_{\\text{cs}}(t)',
              erklaerung: 'Gesamtverformung eines druckbeanspruchten Bauteils infolge sofortiger elastischer Dehnung, zeitverzögertem Kriechen und Trocknungsschwinden.',
              quelle: 'DIN EN 1992-1-1 Abs. 3.1.4'
            }
          ]}
        />
      </div>
    );
  };

  const [timeIndex, setTimeIndex] = useState(2); // for rheologie simulator

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in slide-in-from-left duration-200">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Timer className="text-shiraz" /> Kriechen, Schwinden &amp; Relaxation
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Verformungsverhalten von Beton (Kriechen und Schwinden) nach Eurocode 2 (DIN EN 1992-1-1) sowie zeitabhängige Relaxationsverluste von Spannstählen unter hoher Dauerlast.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              material === 'beton'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMaterial('beton')}
          >
            <Activity size={16} /> Beton
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              material === 'stahl'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMaterial('stahl')}
          >
            <Layers size={16} /> Spannstahl
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              material === 'rheologie'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMaterial('rheologie')}
          >
            <Sliders size={16} /> Rheologie &amp; Säulenverformung
          </button>
        </div>
      </div>

      {material === 'beton' && renderBeton()}
      {material === 'stahl' && renderStahl()}
      {material === 'rheologie' && renderRheologieSimulator()}
    </div>
  );
}
