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
          label: 'Spannungsintensität K_I',
          data: kIData,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'Risszähigkeit K_Ic (Grenzwert)',
          data: kIcData,
          borderColor: '#A3113E',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'Aktueller Zustand',
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
        title: { display: true, text: 'Risslänge a [mm]', font: { weight: 'bold' as const } }
      },
      y: {
        title: { display: true, text: 'Spannungsintensität K_I [MPa√m]', font: { weight: 'bold' as const } },
        min: 0,
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><Activity className="text-shiraz" /> Bruchmechanik (Linear-elastisch)</h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
          <p>
            Die Bruchmechanik befasst sich mit der Rissausbreitung in rissbehafteten Bauteilen. Die linear-elastische Bruchmechanik (LEBM) beschreibt spröde Werkstoffe wie Glas sehr gut. Beton ist dagegen quasi-spröde: Vor der Rissspitze bildet sich eine ausgedehnte Bruchprozesszone, daher werden dort nichtlineare Modelle (z. B. fiktives Rissmodell nach Hillerborg mit der Bruchenergie G_F) verwendet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <Slider info="Die von außen aufgebrachte Nennspannung im ungestörten Bauteilquerschnitt." label={<FormulaText text="Nennspannung (\sigma)" />} min={1} max={500} step={1} value={sigma} unit="MPa" onChange={(e) => setSigma(Number(e.target.value))} />
              <div className="mt-4"><Slider info="Die Länge des primären Risses (bzw. halbe Risslänge bei Innenrissen)." label={<FormulaText text="Risslänge (a)" />} min={0.1} max={100} step={0.1} value={a} unit="mm" onChange={(e) => setA(Number(e.target.value))} /></div>
              <div className="mt-4"><Slider info="Korrekturbeiwert für die Bauteilgeometrie, Risslage und Einspannbedingungen." label={<FormulaText text="Geometriefaktor (Y)" />} min={0.5} max={3.0} step={0.01} value={y} unit="-" onChange={(e) => setY(Number(e.target.value))} /></div>
              <div className="mt-4"><Slider info="Kritischer Spannungsintensitätsfaktor, bei dem instabile Rissausbreitung beginnt. Richtwerte: Glas ≈ 0,75; Beton ≈ 0,5–1,5 (scheinbar, größenabhängig); Baustahl ≈ 50–150 MPa√m." label={<FormulaText text="Risszähigkeit (K_{Ic})" />} min={0.1} max={100} step={0.1} value={kIc} unit="MPa√m" onChange={(e) => setKIc(Number(e.target.value))} /></div>
              <div className={`mt-4 p-3 rounded-lg border text-sm ${results.isCritical ? 'bg-shiraz/10 border-shiraz/20 text-shiraz' : 'bg-white border-home-grau/30 text-text-main'}`}>
                <div className="flex justify-between"><span>Spannungsintensität K_I:</span><strong>{formatDeZahl(results.kI, 2)} MPa√m</strong></div>
                <div className="flex justify-between"><span>Ausnutzung K_I / K_Ic:</span><strong>{formatDeZahl(results.kI / kIc, 2)}</strong></div>
                <div className="mt-1 font-bold">{results.isCritical ? 'K_I ≥ K_Ic: instabile Rissausbreitung (Bruch)' : `Riss stabil, Sicherheit gegen Bruch η = ${formatDeZahl(results.safetyFactor, 2)}`}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {/* Visualization */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30 flex flex-col items-center justify-center">
              <h3 className="text-sm font-bold text-text-main mb-4 self-start">Rissmodell (Kantenriss)</h3>
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
              <h3 className="text-sm font-bold text-center mb-2">Spannungsintensität vs. Risslänge</h3>
              <div className="flex-1 relative">
                <Line data={results.chartData} options={chartOptions as any} />
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Rissöffnungsmodi</h3>
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
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Die Bruchmechanik unterscheidet drei Rissöffnungsarten. Modus I (Öffnung durch Normalspannung senkrecht zum Riss) ist in der Praxis meist maßgebend. Modus II (ebener Schub) und Modus III (nicht-ebener Schub) entstehen durch Schubspannungen.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Warum bricht Glas schon bei geringen Spannungen?"
        zielGleichung="\sigma_c = \frac{K_{Ic}}{Y \cdot \sqrt{\pi \cdot a}}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Kalk-Natron-Glas, K_Ic ≈ 0,75 MPa√m; Kratzer an der Kante mit Tiefe a = 0,5 mm, Kantenriss Y = 1,12.', formel: 'a = 0{,}5\\,\\text{mm} = 5 \\cdot 10^{-4}\\,\\text{m}' },
          { titel: 'Kritische Spannung', erklaerung: 'Umstellen des Bruchkriteriums K_I = K_Ic nach σ:', formel: '\\sigma_c = \\frac{0{,}75}{1{,}12 \\cdot \\sqrt{\\pi \\cdot 5 \\cdot 10^{-4}}} = 16{,}9\\,\\text{MPa}' }
        ]}
        ergebnisHinweis="Ein halber Millimeter Kantenverletzung senkt die Festigkeit weit unter die charakteristische Biegezugfestigkeit von 45 MPa – deshalb werden Glaskanten geschliffen und Gläser vorgespannt."
        normQuelle="LEBM nach Irwin; vgl. Gross/Seelig 2016"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Ist ein 10 mm tiefer Riss in einem Stahlblech gefährlich?"
        zielGleichung="K_I = Y \cdot \sigma \cdot \sqrt{\pi \cdot a},\qquad \eta = \frac{K_{Ic}}{K_I}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Baustahl mit K_Ic ≈ 100 MPa√m, Nennspannung 200 MPa, Kantenriss a = 10 mm (Y = 1,12).', formel: 'a = 0{,}010\\,\\text{m}' },
          { titel: 'Spannungsintensität', erklaerung: 'Einsetzen:', formel: 'K_I = 1{,}12 \\cdot 200 \\cdot \\sqrt{\\pi \\cdot 0{,}010} = 39{,}7\\,\\text{MPa}\\sqrt{\\text{m}}' },
          { titel: 'Sicherheit gegen instabiles Risswachstum', erklaerung: 'Verhältnis zur Risszähigkeit:', formel: '\\eta = \\frac{100}{39{,}7} = 2{,}5' }
        ]}
        ergebnisHinweis="Statisch unkritisch – unter wiederholter Belastung kann der Riss aber durch Ermüdung wachsen. Bei tiefen Temperaturen sinkt die Zähigkeit (Gütegruppe nach DIN EN 1993-1-10 wählen)."
        normQuelle="LEBM; Stahlgütewahl nach DIN EN 1993-1-10"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bruchmechanik" />

      <ModuleFooter 
        lastReviewed="Oktober 2026 (AP 5 Mechanik: LEBM, Risszähigkeiten und Grenzen für Beton geprüft; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Bruchmechanik', url: 'https://de.wikipedia.org/wiki/Bruchmechanik' }
        ]}
        regelwerke={[
          { title: 'fib Model Code for Concrete Structures 2010 (Bruchenergie G_F, Zugentfestigung)', url: 'https://www.fib-international.org/' },
          { title: 'RILEM TC 50-FMC (1985): Bestimmung der Bruchenergie von Mörtel und Beton am gekerbten Balken', url: 'https://www.rilem.net/' },
          { title: 'ISO 12737 (Metallische Werkstoffe – Bestimmung der Bruchzähigkeit bei ebener Dehnung K_Ic)' }
        ]}
        literatur={[
          'Gross, D.; Seelig, T.: Bruchmechanik – Mit einer Einführung in die Mikromechanik. 6. Aufl., Berlin: Springer Vieweg 2016',
          'Karihaloo, B. L.: Fracture Mechanics and Structural Concrete. Harlow: Longman 1995',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
            formel: 'K_{\\text{I}} = Y \\cdot \\sigma \\cdot \\sqrt{\\pi \\cdot a} \\quad [\\text{MPa}\\sqrt{\\text{m}}]',
            erklaerung: 'Spannungsintensitätsfaktor im Rissöffnungsmodus I nach Irwin: Y ist der Geometriefaktor des Bauteils, σ die anliegende Nennspannung und a die Risslänge.',
            quelle: 'Gross, D.; Seelig, T.: Bruchmechanik'
          },
          {
            formel: 'K_{\\text{I}} \\le K_{\\text{Ic}} \\iff \\eta = \\frac{K_{\\text{Ic}}}{K_{\\text{I}}} \\ge 1{,}0',
            erklaerung: 'Linear-elastisches Bruchkriterium: Instabiles Risswachstum tritt ein, wenn der Spannungsintensitätsfaktor KI die werkstoffspezifische Risszähigkeit (kritischer Spannungsintensitätsfaktor KIc) erreicht oder übersteigt.',
            quelle: 'Linear-Elastische Bruchmechanik (LEBM)'
          }
        ]}
      />
    </div>
  );
}
