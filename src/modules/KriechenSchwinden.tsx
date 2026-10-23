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
import '@/src/lib/chartSetup';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Timer, Activity, Layers, Clock, Sliders } from 'lucide-react';
import { InlineMath } from 'react-katex';

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

// Kriechen und Schwinden nach DIN EN 1992-1-1, 3.1.4 und Anhang B (gemeinsame Rechenbasis)
export function ec2KriechenSchwinden(fck: number, rh: number, h0: number, t0T: number, ts: number, zement: string) {
  const fcm = fck + 8;
  const Ecm = 22000 * Math.pow(fcm / 10, 0.3);
  const a1 = Math.pow(35 / fcm, 0.7), a2 = Math.pow(35 / fcm, 0.2), a3 = Math.pow(35 / fcm, 0.5);
  const rhTerm = (1 - rh / 100) / (0.1 * Math.pow(h0, 1 / 3));
  const phiRH = fcm <= 35 ? 1 + rhTerm : (1 + rhTerm * a1) * a2; // Gl. (B.3a/b)
  const betaFcm = 16.8 / Math.sqrt(fcm);
  // Einfluss der Zementart über das wirksame Belastungsalter, Gl. (B.9)
  const alphaZ = zement === 'S' ? -1 : zement === 'R' ? 1 : 0;
  const t0 = Math.max(0.5, t0T * Math.pow(9 / (2 + Math.pow(t0T, 1.2)) + 1, alphaZ));
  const betaT0 = 1 / (0.1 + Math.pow(t0, 0.2));
  const phi0 = phiRH * betaFcm * betaT0;
  const betaH = fcm <= 35
    ? Math.min(1.5 * (1 + Math.pow(0.012 * rh, 18)) * h0 + 250, 1500)
    : Math.min(1.5 * (1 + Math.pow(0.012 * rh, 18)) * h0 + 250 * a3, 1500 * a3);
  // Trocknungsschwinden, Gl. (B.11)/(B.12) und Tab. 3.3 (k_h)
  const [ads1, ads2] = zement === 'S' ? [3, 0.13] : zement === 'R' ? [6, 0.11] : [4, 0.12];
  const betaRH = 1.55 * (1 - Math.pow(rh / 100, 3));
  const epsCd0 = 0.85 * (220 + 110 * ads1) * Math.exp(-ads2 * fcm / 10) * 1e-6 * betaRH;
  const kh = h0 <= 100 ? 1.0 : h0 <= 200 ? 1.0 - 0.15 * (h0 - 100) / 100 : h0 <= 300 ? 0.85 - 0.10 * (h0 - 200) / 100 : h0 <= 500 ? 0.75 - 0.05 * (h0 - 300) / 200 : 0.70;
  const epsCaInf = 2.5 * (fck - 10) * 1e-6; // Gl. (3.12)
  const phi = (t: number) => (t <= t0T ? 0 : phi0 * Math.pow((t - t0T) / (betaH + t - t0T), 0.3));
  const epsCd = (t: number) => (t <= ts ? 0 : ((t - ts) / ((t - ts) + 0.04 * Math.sqrt(Math.pow(h0, 3)))) * kh * epsCd0);
  const epsCa = (t: number) => (1 - Math.exp(-0.2 * Math.sqrt(t))) * epsCaInf;
  return { fcm, Ecm, phi0, betaH, kh, epsCd0, epsCaInf, t0eff: t0, phi, epsCd, epsCa };
}

export default function KriechenSchwinden() {
  // Eingebettet in Hydratation & Folgen: Quellenblock dort zentral
  const { activeTab: aktiverReiter } = useTabContext();
  const eingebettet = aktiverReiter === 'hydratation_folgen';
  const [material, setMaterial] = useState<'beton' | 'stahl' | 'rheologie'>('beton');

  // Beton States
  const [fck, setFck] = useState(30);
  const [rh, setRh] = useState(50);
  const [h0, setH0] = useState(200);
  const [t0, setT0] = useState(28);
  const [zementArt, setZementArt] = useState('N');
  const [ts, setTs] = useState(7);

  // Stahl States
  const [sigmaRatio, setSigmaRatio] = useState(0.7);
  const [stahlKlasse, setStahlKlasse] = useState('2'); // 1: Draht, 2: Litze, 3: Stab

  const calculateBeton = () => {
    const labels: number[] = [];
    const creepData: number[] = [];
    const shrinkageData: number[] = [];
    const autogenData: number[] = [];
    const totalShrinkData: number[] = [];
    const relaxationData: number[] = [];
    const m = ec2KriechenSchwinden(fck, rh, h0, t0, ts, zementArt);

    const timePoints: number[] = [];
    let currentT = 1;
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
      const phiT = m.phi(t);
      creepData.push(phiT);
      const cd = m.epsCd(t), ca = m.epsCa(t);
      shrinkageData.push(cd * 1e6);
      autogenData.push(ca * 1e6);
      totalShrinkData.push((cd + ca) * 1e6);
      // wirksamer E-Modul E_c,eff = E_cm / (1 + phi), DIN EN 1992-1-1 Gl. (7.20)
      relaxationData.push(t < t0 ? m.Ecm : m.Ecm / (1 + phiT));
    }

    return { labels, creepData, shrinkageData, autogenData, totalShrinkData, relaxationData, Ecm: m.Ecm, m };
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
    const { labels, creepData, shrinkageData, autogenData, totalShrinkData, relaxationData, Ecm, m } = calculateBeton();

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

            <Slider info="Ende der Nachbehandlung = Beginn des Trocknungsschwindens t_s (DIN EN 1992-1-1, 3.1.4)."
              label={<FormulaText text="Trocknungsbeginn (t_s)" />}
              min={1} max={28} step={1}
              value={ts} unit="Tage"
              onChange={(e) => setTs(Number(e.target.value))}
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Zementklasse</label><InfoTooltip text="S: langsam, N: normal, R: schnell erhärtend. Wirkt beim Kriechen über das wirksame Belastungsalter (Gl. B.9) und beim Trocknungsschwinden über α_ds1/α_ds2." /></div>
              </div>
              <select aria-label="Zementklasse" 
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-home-grau/30"><span className="text-text-main/60 block">φ(10 000 d, t₀)</span><strong className="font-mono text-shiraz text-base">{formatDeZahl(creepData[creepData.length - 1], 2)}</strong></div>
              <div className="bg-white p-3 rounded-xl border border-home-grau/30"><span className="text-text-main/60 block">ε_cd (10 000 d)</span><strong className="font-mono text-base">{formatDeZahl(shrinkageData[shrinkageData.length - 1], 0)} µm/m</strong></div>
              <div className="bg-white p-3 rounded-xl border border-home-grau/30"><span className="text-text-main/60 block">ε_ca,∞</span><strong className="font-mono text-base">{formatDeZahl(m.epsCaInf * 1e6, 0)} µm/m</strong></div>
              <div className="bg-white p-3 rounded-xl border border-home-grau/30"><span className="text-text-main/60 block">k_h · ε_cd,0</span><strong className="font-mono text-base">{formatDeZahl(m.kh, 2)} · {formatDeZahl(m.epsCd0 * 1e6, 0)}</strong></div>
            </div>
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
                        x: { type: 'logarithmic', title: { display: true, text: 'Betonalter t (Tage)' }, min: 1 },
                        y: { min: 0, title: { display: true, text: 'Kriechzahl φ' } }
                      },
                      plugins: { legend: { display: false } }
                    }} 
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[300px]">
                <h2 className="text-lg font-bold text-text-main mb-2"><FormulaText text="Schwinden ε_{cs} = ε_{cd} + ε_{ca}" /></h2>
                <div className="flex-1 relative w-full h-full">
                  <Line 
                    data={{
                      labels,
                      datasets: [
                        { label: 'Trocknungsschwinden εcd', data: shrinkageData, borderColor: '#0e558c', borderWidth: 2, pointRadius: 0 },
                        { label: 'Autogenes Schwinden εca', data: autogenData, borderColor: '#a855f7', borderWidth: 2, pointRadius: 0, borderDash: [4, 3] },
                        { label: 'Gesamtschwinden εcs', data: totalShrinkData, borderColor: '#0f172a', borderWidth: 2.5, pointRadius: 0 }
                      ]
                    }} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { type: 'logarithmic', title: { display: true, text: 'Betonalter t (Tage)' }, min: 1 },
                        y: { min: 0, title: { display: true, text: 'Schwinddehnung (μm/m)' } }
                      },
                      plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } }
                    }} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[300px]">
              <h2 className="text-lg font-bold text-text-main mb-2"><FormulaText text="Wirksamer E-Modul E_{c,eff}(t, t_0)" /></h2>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={{
                    labels,
                    datasets: [{
                      label: 'Wirksamer E-Modul Ec,eff',
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
                      x: { type: 'logarithmic', title: { display: true, text: 'Betonalter t (Tage)' }, min: 1 },
                      y: { min: 0, max: Ecm * 1.1, title: { display: true, text: 'Modul R (MPa)' } }
                    },
                    plugins: { legend: { display: false } }
                  }} 
                />
              </div>
              <p className="text-xs text-text-main/70 mt-2">
                Für Verformungen unter Dauerlast wird nach DIN EN 1992-1-1, Gl. (7.20) der wirksame E-Modul <FormulaText text="E_{c,eff} = E_{cm} / (1 + \varphi(t, t_0))" /> angesetzt. Für Zwangsspannungen (Relaxation) ist das eine grobe Näherung; genauer ist <FormulaText text="E_{cm} / (1 + \rho \varphi)" /> mit dem Relaxationsbeiwert ρ ≈ 0,8 (Trost).
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
                Die Fachliteratur unterscheidet meist fünf Schwindarten; DIN EN 1992-1-1 erfasst rechnerisch das Trocknungs- und das autogene Schwinden:
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
                    <strong>Ursache:</strong> Tritt in den ersten Stunden auf, wenn an der freien Oberfläche mehr Wasser verdunstet, als durch Bluten nachgeliefert wird. Der kapillare Unterdruck in den Menisken zieht den noch plastischen Beton zusammen (Gefahr von Frühschwindrissen).
                  </p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans">
                    <strong>Gegenmaßnahme:</strong> Frühzeitige Nachbehandlung: Abdecken mit Folie oder feuchten Vliesen, Nachbehandlungsmittel unmittelbar nach dem Abziehen, Schutz vor Wind und Sonne.
                  </p>
                </div>

                {/* 2. Autogenes Schwinden */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">2. Autogenes Schwinden (Selbstaustrocknung)</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[9px] font-bold">Stadium: Erste Tage/Wochen</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1">
                    <strong>Ursache:</strong> Selbstaustrocknung: Die Hydratation verbraucht Wasser; bei niedrigen w/z-Werten (etwa &lt; 0,40) entleeren sich die feinen Poren, ohne dass Wasser von außen nachkommt. Der Kapillarunterdruck verkürzt den Zementstein. Nach DIN EN 1992-1-1 gilt ε_ca,∞ = 2,5 · (f_ck − 10) · 10⁻⁶.
                  </p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans">
                    <strong>Gegenmaßnahme:</strong> Innere Nachbehandlung mit wassergesättigter leichter Gesteinskörnung oder Superabsorbern (SAP); schwindreduzierende Zusatzmittel (SRA).
                  </p>
                </div>

                {/* 3. Trocknungsschwinden */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">3. Trocknungsschwinden (Drying Shrinkage)</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-[9px] font-bold">Stadium: Langzeit (Jahre)</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1">
                    <strong>Ursache:</strong> Langsame Abgabe von Kapillar- und Gelwasser an die Umgebung. Bei Normalbeton meist der größte Schwindanteil; maßgebend sind die relative Luftfeuchte (RH), die wirksame Bauteildicke h<sub>0</sub> und der Zementsteingehalt.
                  </p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans">
                    <strong>Gegenmaßnahme:</strong> Geringer Zementleim- und Wassergehalt (hoher Gesteinskörnungsanteil), ausreichende Nachbehandlung, Bewehrung bzw. Fugen zur Rissverteilung.
                  </p>
                </div>

                {/* 4. Chemische Schrumpfung */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">4. Chemisches Schwinden (Schrumpfen)</span>
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono text-[9px] font-bold">Stadium: Permanent aktiv</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1">
                    <strong>Ursache:</strong> Die Hydratationsprodukte nehmen weniger Volumen ein als Zement und Wasser vor der Reaktion (Le-Chatelier-Kontraktion, rund 25 % des chemisch gebundenen Wassers – Größenordnung). Nach dem Erstarren äußert sich die Kontraktion vor allem als zusätzlicher Porenraum; die äußere Verkürzung zeigt sich als autogenes Schwinden.
                  </p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans">
                    <strong>Gegenmaßnahme:</strong> Nicht vermeidbar; die äußere Auswirkung wird über die Maßnahmen gegen autogenes Schwinden begrenzt.
                  </p>
                </div>

                {/* 5. Karbonatisierungsschwinden */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">5. Karbonatisierungsschwinden</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[9px] font-bold">Stadium: Langzeit (Jahrzehnte)</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1">
                    <strong>Ursache:</strong> Chemische Umwandlung des alkalischen Calciumhydroxids Ca(OH)<sub>2</sub> durch eindiffundierendes Kohlenstoffdioxid CO<sub>2</sub> aus der Luft zu Calciumcarbonat CaCO<sub>3</sub>; dabei wird Wasser frei. Der Umbau der Hydratphasen verursacht eine geringe zusätzliche Verkürzung in der karbonatisierten Randzone.
                  </p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans">
                    <strong>Gegenmaßnahme:</strong> Dichter Beton (niedriger w/z-Wert, gute Nachbehandlung) verlangsamt die Karbonatisierung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 mt-6">
          <FormulaDerivationBox
            title="Anwendungsbeispiel: Endkriechzahl und Endschwindmaß einer Innenwand C30/37"
            zielGleichung="\varphi_0 = \varphi_{RH} \cdot \beta(f_{cm}) \cdot \beta(t_0), \quad \varepsilon_{cs,\infty} = k_h \cdot \varepsilon_{cd,0} + \varepsilon_{ca,\infty}"
            normQuelle="DIN EN 1992-1-1, 3.1.4 und Anhang B"
            schritte={[
              { titel: '1. Gegeben', formel: 'f_{ck} = 30,\\; f_{cm} = 38\\,\\text{N/mm}^2,\\; RH = 50\\,\\%,\\; h_0 = 200\\,\\text{mm},\\; t_0 = 28\\,\\text{d, Zement N}', erklaerung: 'Innenbauteil, Belastung nach 28 Tagen.' },
              { titel: '2. Feuchte und Dicke', formel: '\\varphi_{RH} = \\left[1 + \\frac{1 - 0{,}50}{0{,}1 \\cdot \\sqrt[3]{200}} \\cdot 0{,}944\\right] \\cdot 0{,}984 = 1{,}78', erklaerung: 'Wegen f_cm > 35 N/mm² mit α₁ = (35/38)^0,7 und α₂ = (35/38)^0,2.' },
              { titel: '3. Festigkeit und Belastungsalter', formel: '\\beta(f_{cm}) = \\frac{16{,}8}{\\sqrt{38}} = 2{,}73;\\; \\beta(t_0) = \\frac{1}{0{,}1 + 28^{0{,}2}} = 0{,}49', erklaerung: 'Spätere Belastung verringert das Kriechen deutlich.' },
              { titel: '4. Endkriechzahl', formel: '\\varphi_0 = 1{,}78 \\cdot 2{,}73 \\cdot 0{,}49 \\approx 2{,}37', erklaerung: 'Stimmt mit dem Nomogramm in DIN EN 1992-1-1, Bild 3.1 überein (≈ 2,3).' },
              { titel: '5. Endschwindmaß', formel: '\\varepsilon_{cd,0} = 482\\,\\mu\\text{m/m};\\; k_h = 0{,}85 \\Rightarrow 410 + \\underbrace{2{,}5 \\cdot 20}_{\\varepsilon_{ca,\\infty}} = 460\\,\\mu\\text{m/m}', erklaerung: 'Trocknungsschwinden überwiegt; autogenes Schwinden rund 50 µm/m.' },
            ]}
            ergebnisHinweis="Eine Stütze unter σ_c = 8,5 N/mm² verkürzt sich damit langfristig um etwa ε_el · (1 + φ) + ε_cs ≈ 0,26 · 3,37 + 0,46 ≈ 1,3 ‰ – rund das Fünffache der elastischen Stauchung."
          />
        </div>

        <ModulTest moduleId="kriechen_schwinden" />

        {!eingebettet && (
<ModuleFooter weblinks={[{ title: "Beton.wiki: Kriechen", url: "https://beton.wiki/index.php?title=Kriechen" }, { title: "Zement-Merkblätter Übersicht", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }, { title: "Beton.wiki: Schwinden", url: "https://beton.wiki/index.php?title=Schwinden" }]} 
          wikipedia={[
                { title: 'Kriechen (Werkstoffe)', url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
                { title: 'Schwinden (Beton)', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' }
              ]}
              regelwerke={[
            { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 (Eurocode 2), Abschn. 3.1.4, 3.3.2 und Anhang B' },
            { title: 'fib Model Code for Concrete Structures 2010', url: 'https://www.fib-international.org/' }
          ]}
          literatur={[
            'Zilch, K.; Zehetmaier, G.: Bemessung im konstruktiven Betonbau. 2. Aufl., Berlin, Heidelberg: Springer 2010',
            'DAfStb-Heft 600: Erläuterungen zu DIN EN 1992-1-1 und DIN EN 1992-1-1/NA (Eurocode 2), 2. überarbeitete Auflage 2020'
          ]}
          formeln={[
            {
              formel: '\\varphi (t, t_0) = \\varphi _0 \\cdot  \\beta _c(t, t_0)',
              erklaerung: 'Kriechzahl\n\\varphi (t, t_0): Kriechzahl zum Zeitpunkt t bei Belastungsalter t_0 [-]\n\\beta _c(t, t_0): Beiwert für den zeitlichen Verlauf des Kriechens [-]\n\\varphi _0: Nennkriechzahl [-]',
              quelle: 'DIN EN 1992-1-1, 3.1.4 / Anhang B'
            },
            {
              formel: '\\varepsilon _{cs} = \\varepsilon _{cd} + \\varepsilon _{ca}',
              erklaerung: 'Gesamtschwinddehnung\n\\varepsilon _{cs}: Gesamtschwinddehnung [-]\n\\varepsilon _{cd}: Trocknungsschwinddehnung [-]\n\\varepsilon _{ca}: Autogene Schwinddehnung [-]',
              quelle: 'DIN EN 1992-1-1, 3.1.4 / Anhang B'
            },
            {
              formel: 'E_{c,eff} = \\frac{E_{cm}}{1 + \\varphi (t, t_0)}',
              erklaerung: 'Wirksamer E-Modul unter Dauerlast (Gl. 7.20)\nE_{c,eff}: wirksamer E-Modul [MPa]\nE_{cm}: Sekantenmodul der Elastizität des Betons [MPa]\n\\varphi (t, t_0): Kriechzahl [-]',
              quelle: 'DIN EN 1992-1-1, 3.1.4 / Anhang B'
            }
          ]}
        />
)}
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
                Kriechen und Schwinden spielen bei Betonstahl und Baustahl bei Raumtemperatur praktisch keine Rolle. 
                Bei <strong>Spannstahl</strong> ist jedoch die <strong>Relaxation</strong> (Spannungsverlust bei konstanter Dehnung) von großer Bedeutung.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Spannstahlklasse (Relaxationsverhalten)</label><InfoTooltip text="Klassifizierung des Spannstahls nach seinem Spannungsverlust." /></div>
              <select aria-label="Spannstahlklasse (Relaxationsverhalten)" 
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

        {!eingebettet && (
<ModuleFooter 
          wikipedia={[
                { title: 'Kriechen (Werkstoffe)', url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
                { title: 'Schwinden (Beton)', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' }
              ]}
              regelwerke={[
            { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 (Eurocode 2), Abschn. 3.1.4, 3.3.2 und Anhang B' },
            { title: 'fib Model Code for Concrete Structures 2010', url: 'https://www.fib-international.org/' }
          ]}
          literatur={[
            'Zilch, K.; Zehetmaier, G.: Bemessung im konstruktiven Betonbau. 2. Aufl., Berlin, Heidelberg: Springer 2010',
            'DAfStb-Heft 600: Erläuterungen zu DIN EN 1992-1-1 und DIN EN 1992-1-1/NA (Ausgabe manuell prüfen)'
          ]}
          formeln={[
            {
              formel: '\\frac{\\Delta \\sigma _{pr}}{\\sigma _{pi}} = k_1 \\cdot  \\rho _{1000} \\cdot  e^{k_2 \\cdot  \\mu } \\cdot  \\left(\\frac{t}{1000}\\right)^{0{,}75 \\cdot  (1-\\mu )} \\cdot  10^{-5}',
              erklaerung: 'Spannungsverlust durch Relaxation\n\\Delta\\sigma_{pr}: Spannungsverlust durch Relaxation [MPa]\n\\sigma_{pi}: Anfängliche Vorspannung [MPa]\n\\rho_{1000}: Relaxationsverlust nach 1000h in % (Klasse 1: 8,0; Klasse 2: 2,5; Klasse 3: 4,0)\n\\mu: Spannungsniveau (\\sigma_{pi} / f_{pk}) [-]\nt: Zeit [Stunden]\nk_1, k_2: Beiwerte nach Klasse (Kl. 1: 5,39 / 6,7; Kl. 2: 0,66 / 9,1; Kl. 3: 1,98 / 8,0)\nQuelle: DIN EN 1992-1-1 (EC2)',
              quelle: 'DIN EN 1992-1-1, 3.3.2, Gl. (3.28)–(3.30)'
            }
          ]}
        />
)}
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

    const m = ec2KriechenSchwinden(fck, rh, h0, t0, ts, zementArt);
    const Ecm = m.Ecm;

    const sigmaC = 8.5; // MPa Dauerlastspannung (Lehrannahme)
    const L0_mm = 3000; // 3 m Stützenhöhe

    const calcStateAt = (days: number) => {
      const phiT = m.phi(Math.max(days, t0 + 0.01));
      const epsCd = m.epsCd(days) + m.epsCa(days);

      const epsEl = (sigmaC / Ecm);
      const epsCr = phiT * epsEl;
      const epsCs = epsCd; // Trocknungs- + autogenes Schwinden
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
            Gleichzeitig bewirkt das lastunabhängige Schwinden eine zusätzliche Stauchung. Das Federmodell veranschaulicht das Verhalten qualitativ; gerechnet wird mit den Ansätzen nach DIN EN 1992-1-1, Anhang B. Linearität des Kriechens setzt σ_c ≤ 0,45 · f_ck voraus – bei f_ck &lt; 19 MPa ist das mit 8,5 MPa nicht mehr erfüllt.
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
                    <strong className="font-mono text-text-main">8,5 MPa (Lehrannahme)</strong>
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
                          (Trocknungs- + autogenes Schwinden)
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Formula & Mechanistic Footer */}
              <div className="mt-3 p-3 bg-off-white rounded-xl border border-home-grau/25 text-xs text-text-main/80 space-y-1">
                <span className="font-bold text-text-main block">Überlagerung der Verformungsanteile (DIN EN 1992-1-1, 3.1.4):</span>
                <div className="overflow-x-auto py-0.5">
                  <InlineMath math="\varepsilon_{\text{tot}}(t) = \varepsilon_{\text{el}} + \varepsilon_{\text{cr}}(t, t_0) + \varepsilon_{\text{cs}}(t) = \frac{\sigma_c}{E_{\text{cm}}} \cdot \left[1 + \varphi(t, t_0)\right] + \varepsilon_{\text{cs}}(t)" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {!eingebettet && (
<ModuleFooter 
          wikipedia={[
            { title: 'Kriechen (Werkstoffe)', url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
            { title: 'Schwinden (Beton)', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' },
            { title: 'Kelvin-Voigt-Modell', url: 'https://de.wikipedia.org/wiki/Kelvin-Voigt-Modell' }
          ]}
          regelwerke={[
            { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 (Eurocode 2), Abschn. 3.1.4, 3.3.2 und Anhang B' },
            { title: 'fib Model Code for Concrete Structures 2010', url: 'https://www.fib-international.org/' }
          ]}
          literatur={[
            'Zilch, K.; Zehetmaier, G.: Bemessung im konstruktiven Betonbau. 2. Aufl., Berlin, Heidelberg: Springer 2010',
            'DAfStb-Heft 600: Erläuterungen zu DIN EN 1992-1-1 und DIN EN 1992-1-1/NA (Ausgabe manuell prüfen)'
          ]}
          formeln={[
            {
              formel: '\\varepsilon_{\\text{tot}}(t) = \\frac{\\sigma_c}{E_{\\text{cm}}} \\cdot [1 + \\varphi(t, t_0)] + \\varepsilon_{\\text{cs}}(t)',
              erklaerung: 'Gesamtdehnung eines druckbeanspruchten Bauteils aus elastischer Dehnung, Kriechen und Schwinden (vereinfachend mit E_cm statt E_c = 1,05 E_cm).',
              quelle: 'DIN EN 1992-1-1 Abs. 3.1.4'
            }
          ]}
        />
)}
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
