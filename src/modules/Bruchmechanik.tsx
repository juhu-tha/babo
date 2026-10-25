import { Activity } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { formatDeZahl } from '@/src/utils/numberFormat';
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
import '@/src/lib/chartSetup';
import inhalt from '@/content/bruchmechanik/Bruchmechanik.json';
import { MdText } from '@/src/components/inhalt/MdText';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Bruchmechanik() {
  const [sigma, setSigma] = useState(50); // MPa
  const [a, setA] = useState(10); // mm
  const [y, setY] = useState(1.12); // Geometriefaktor (Kantenriss)
  const [kIc, setKIc] = useState(2.0); // Risszähigkeit in MPa·√m (Richtwerte: Glas ≈ 0,75; Beton ≈ 0,5–1,5; Baustahl ≈ 50–150)

  const results = useMemo(() => {
    // K_I = Y * sigma * sqrt(pi * a)
    // a in Meter umrechnen!
    const a_m = a / 1000;
    const kI = y * sigma * Math.sqrt(Math.PI * a_m);
    
    const isCritical = kI >= kIc;
    const safetyFactor = kIc / kI;

    const labels = [];
    const kIData = [];
    const kIcData = [];
    const currentPointData = [];

    for (let i = 0.1; i <= 100; i += 1) {
      labels.push(formatDeZahl(i, 1));
      const current_a_m = i / 1000;
      const current_kI = y * sigma * Math.sqrt(Math.PI * current_a_m);
      kIData.push(current_kI);
      kIcData.push(kIc);
      if (Math.abs(i - a) < 0.5) {
        currentPointData.push(kI);
      } else {
        currentPointData.push(null);
      }
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: inhalt.werte.spannungsintensitätKI,
          data: kIData,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          label: inhalt.werte.risszähigkeitKIcGrenzwert,
          data: kIcData,
          borderColor: '#A3113E',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        },
        {
          label: inhalt.werte.aktuellerZustand,
          data: currentPointData,
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        }
      ]
    };

    return { kI, isCritical, safetyFactor, chartData };
  }, [sigma, a, y, kIc]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        title: { display: true, text: inhalt.werte.risslängeAMm, font: { weight: 'bold' as const } }
      },
      y: {
        title: { display: true, text: inhalt.werte.spannungsintensitätKIMpa, font: { weight: 'bold' as const } },
        min: 0,
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><Activity className="text-shiraz" /><MdText text={inhalt.texte.bruchmechanikLinearElastisch} /></h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
          <p><MdText text={inhalt.texte.dieBruchmechanikBefasstSich} /></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <Slider info={inhalt.werte.dieVonAußenAufgebrachte} label={<FormulaText text="Nennspannung (\sigma)" />} min={1} max={500} step={1} value={sigma} unit="MPa" onChange={(e) => setSigma(Number(e.target.value))} />
              <div className="mt-4"><Slider info={inhalt.werte.dieLängeDesPrimären} label={<FormulaText text={inhalt.werte.risslängeA} />} min={0.1} max={100} step={0.1} value={a} unit="mm" onChange={(e) => setA(Number(e.target.value))} /></div>
              <div className="mt-4"><Slider info={inhalt.werte.korrekturbeiwertFürDieBauteilgeometrie} label={<FormulaText text={inhalt.werte.geometriefaktorY} />} min={0.5} max={3.0} step={0.01} value={y} unit="-" onChange={(e) => setY(Number(e.target.value))} /></div>
              <div className="mt-4"><Slider info={inhalt.werte.kritischerSpannungsintensitätsfaktorBeiD} label={<FormulaText text={inhalt.werte.risszähigkeitKIc} />} min={0.1} max={100} step={0.1} value={kIc} unit="MPa√m" onChange={(e) => setKIc(Number(e.target.value))} /></div>
              <div className={`mt-4 p-3 rounded-lg border text-sm ${results.isCritical ? 'bg-shiraz/10 border-shiraz/20 text-shiraz' : 'bg-white border-home-grau/30 text-text-main'}`}>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.spannungsintensitätKI} /></span><strong>{formatDeZahl(results.kI, 2)} MPa√m</strong></div>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.ausnutzungKIK} /></span><strong>{formatDeZahl(results.kI / kIc, 2)}</strong></div>
                <div className="mt-1 font-bold">{results.isCritical ? inhalt.werte.kIKIc : `Riss stabil, Sicherheit gegen Bruch η = ${formatDeZahl(results.safetyFactor, 2)}`}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {/* Visualization */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30 flex flex-col items-center justify-center">
              <h3 className="text-sm font-bold text-text-main mb-4 self-start"><MdText text={inhalt.texte.rissmodellKantenriss} /></h3>
              <svg width="100%" height="200" viewBox="0 0 400 200" className="max-w-sm">
                <defs>
                  <pattern id="material" patternUnits="userSpaceOnUse" width="10" height="10">
                    <path d="M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9" stroke="#cbd5e1" strokeWidth="1" />
                  </pattern>
                </defs>
                
                {/* Material Block */}
                <rect x="100" y="50" width="200" height="100" fill="url(#material)" stroke="#475569" strokeWidth="2" />
                
                {/* Crack */}
                <path d={`M 100 100 L ${100 + Math.min(a * 2, 180)} 100`} stroke="#A3113E" strokeWidth="3" />
                <path d={`M ${100 + Math.min(a * 2, 180)} 100 L ${100 + Math.min(a * 2, 180) - 5} 95 M ${100 + Math.min(a * 2, 180)} 100 L ${100 + Math.min(a * 2, 180) - 5} 105`} stroke="#A3113E" strokeWidth="2" fill="none" />
                
                {/* Stress Arrows (Top) */}
                <g stroke="#475569" strokeWidth="2" fill="none">
                  <path d="M 120 40 L 120 20 M 115 25 L 120 20 L 125 25" />
                  <path d="M 160 40 L 160 20 M 155 25 L 160 20 L 165 25" />
                  <path d="M 200 40 L 200 20 M 195 25 L 200 20 L 205 25" />
                  <path d="M 240 40 L 240 20 M 235 25 L 240 20 L 245 25" />
                  <path d="M 280 40 L 280 20 M 275 25 L 280 20 L 285 25" />
                </g>
                <text x="200" y="15" textAnchor="middle" fontSize="14" fill="#475569">σ</text>

                {/* Stress Arrows (Bottom) */}
                <g stroke="#475569" strokeWidth="2" fill="none">
                  <path d="M 120 160 L 120 180 M 115 175 L 120 180 L 125 175" />
                  <path d="M 160 160 L 160 180 M 155 175 L 160 180 L 165 175" />
                  <path d="M 200 160 L 200 180 M 195 175 L 200 180 L 205 175" />
                  <path d="M 240 160 L 240 180 M 235 175 L 240 180 L 245 175" />
                  <path d="M 280 160 L 280 180 M 275 175 L 280 180 L 285 175" />
                </g>
                <text x="200" y="195" textAnchor="middle" fontSize="14" fill="#475569">σ</text>

                {/* Crack Length Label */}
                <line x1="100" y1="110" x2={100 + Math.min(a * 2, 180)} y2="110" stroke="#A3113E" strokeWidth="1" />
                <line x1="100" y1="105" x2="100" y2="115" stroke="#A3113E" strokeWidth="1" />
                <line x1={100 + Math.min(a * 2, 180)} y1="105" x2={100 + Math.min(a * 2, 180)} y2="115" stroke="#A3113E" strokeWidth="1" />
                <text x={100 + Math.min(a * 2, 180) / 2} y="125" textAnchor="middle" fontSize="12" fill="#A3113E">a</text>
              </svg>
            </div>

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 h-[300px] flex flex-col">
              <h3 className="text-sm font-bold text-center mb-2"><MdText text={inhalt.texte.spannungsintensitätVsRisslänge} /></h3>
              <div className="flex-1 relative">
                <Line data={results.chartData} options={chartOptions} />
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungRissöffnungsmodi} /></h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="160" viewBox="0 0 450 160">
                  {/* Modus I (Opening) */}
                  <g transform="translate(50, 40)">
                    <text x="0" y="-20" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Modus I</text>
                    <text x="0" y="-5" fontSize="10" fill="#1e293b" textAnchor="middle">(Öffnungsmodus)</text>
                    <path d="M -30 10 L 0 10 L 30 30 L 30 70 L -30 70 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                    <path d="M -30 10 L 0 10 L 30 -10 L 30 -50 L -30 -50 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                    <path d="M 0 10 L -30 10" stroke="#1e293b" strokeWidth="3" />
                    <path d="M 15 30 L 15 50" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-bruch)" />
                    <path d="M 15 -10 L 15 -30" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-bruch)" />
                  </g>

                  {/* Modus II (Sliding) */}
                  <g transform="translate(225, 40)">
                    <text x="0" y="-20" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Modus II</text>
                    <text x="0" y="-5" fontSize="10" fill="#1e293b" textAnchor="middle">(Längsscherung)</text>
                    <path d="M -30 10 L 0 10 L 30 30 L 30 70 L -30 70 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                    <path d="M -20 10 L 10 10 L 40 -10 L 40 -50 L -20 -50 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                    <path d="M 0 10 L -30 10" stroke="#1e293b" strokeWidth="3" />
                    <path d="M 15 30 L -5 30" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow-blue-bruch)" />
                    <path d="M 15 -10 L 35 -10" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow-blue-bruch)" />
                  </g>

                  {/* Modus III (Tearing) */}
                  <g transform="translate(400, 40)">
                    <text x="0" y="-20" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Modus III</text>
                    <text x="0" y="-5" fontSize="10" fill="#1e293b" textAnchor="middle">(Querscherung)</text>
                    <path d="M -30 10 L 0 10 L 30 30 L 30 70 L -30 70 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                    <path d="M -30 10 L 0 10 L 30 -10 L 30 -50 L -30 -50 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                    <path d="M 0 10 L -30 10" stroke="#1e293b" strokeWidth="3" />
                    <circle cx="15" cy="30" r="5" fill="#475569" />
                    <circle cx="15" cy="30" r="2" fill="#fff" />
                    <circle cx="15" cy="-10" r="5" fill="#475569" />
                    <path d="M 10 -15 L 20 -5 M 10 -5 L 20 -15" stroke="#fff" strokeWidth="2" />
                  </g>

                  <defs>
                    <marker id="arrow-red-bruch" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                    </marker>
                    <marker id="arrow-blue-bruch" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.dieBruchmechanikUnterscheidetDrei} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1WarumBricht}
        zielGleichung="\sigma_c = \frac{K_{Ic}}{Y \cdot \sqrt{\pi \cdot a}}"
        schritte={inhalt.daten["Bruchmechanik.schritte"]}
        ergebnisHinweis={inhalt.werte.einHalberMillimeterKantenverletzung}
        normQuelle={inhalt.werte.lebmNachIrwinVgl}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2IstEin}
        zielGleichung="K_I = Y \cdot \sigma \cdot \sqrt{\pi \cdot a},\qquad \eta = \frac{K_{Ic}}{K_I}"
        schritte={inhalt.daten["Bruchmechanik.schritte_2"]}
        ergebnisHinweis={inhalt.werte.statischUnkritischUnterWiederholter}
        normQuelle={inhalt.werte.lebmStahlgütewahlNachDin}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bruchmechanik" />

      <ModuleFooter 
        lastReviewed={inhalt.werte.oktober2026Ap5}
        wikipedia={[
          { title: 'Bruchmechanik', url: 'https://de.wikipedia.org/wiki/Bruchmechanik' }
        ]}
        regelwerke={inhalt.daten["Bruchmechanik.regelwerke"]}
        literatur={inhalt.daten["Bruchmechanik.literatur"]}
        formeln={inhalt.daten["Bruchmechanik.formeln"]}
      />
    </div>
  );
}
