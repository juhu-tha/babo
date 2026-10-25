import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { Calculator, Layers } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Material = {
  name: string;
  rho: number; // kg/m³
  fc: number;  // MPa (Druck)
  ft: number;  // MPa (Zug)
  E: number;   // MPa (E-Modul)
  color: string;
};

// Lehrvergleich: Beton f_ck/f_ctm und E_cm nach DIN EN 1992-1-1 Tab. 3.1, Stahl f_y/f_u (Mindestwerte),
// Holz C24 nach DIN EN 338 (charakteristisch), übrige Werte typische Literaturwerte (Größenordnung).
const materials: Record<string, Material> = {
  'beton_c20': { name: 'Beton C20/25', rho: 2400, fc: 20, ft: 2.2, E: 30000, color: '#94a3b8' },
  'beton_c50': { name: 'Beton C50/60', rho: 2400, fc: 50, ft: 4.1, E: 37000, color: '#64748b' },
  'beton_uhpc': { name: 'UHPC', rho: 2500, fc: 150, ft: 8.0, E: 50000, color: '#475569' },
  'stahl_s235': { name: 'Baustahl S235 (f_y / f_u)', rho: 7850, fc: 235, ft: 360, E: 210000, color: '#475569' },
  'stahl_hochfest': { name: 'Hochfester Stahl S690 (f_y / f_u)', rho: 7850, fc: 690, ft: 770, E: 210000, color: '#334155' },
  'alu': { name: 'Aluminium (EN AW-6060, Richtwert)', rho: 2700, fc: 160, ft: 200, E: 70000, color: '#94a3b8' },
  'holz_fichte_par': { name: 'Holz C24 (faserparallel, charakt.)', rho: 450, fc: 21, ft: 14, E: 11000, color: '#475569' },
  'mauerwerk': { name: 'Mauerwerk (Richtwert)', rho: 1800, fc: 12, ft: 0.5, E: 4000, color: '#A3113E' },
  'glas': { name: 'Glas', rho: 2500, fc: 500, ft: 45, E: 70000, color: '#64748b' },
  'titan': { name: 'Titan', rho: 4430, fc: 830, ft: 900, E: 105000, color: '#64748b' },
  'carbon': { name: 'Carbon (CFK)', rho: 1500, fc: 600, ft: 1500, E: 150000, color: '#475569' },
  'kevlar': { name: 'Kevlar', rho: 1440, fc: 300, ft: 3600, E: 112000, color: '#94a3b8' },
  'spinnenseide': { name: 'Spinnenseide (Faser, Literaturwert)', rho: 1300, fc: 100, ft: 1100, E: 30000, color: '#A3113E' }
};

export default function Festigkeitsberechnungen() {
  const [mat1Key, setMat1Key] = useState<string>('beton_c20');
  const [mat2Key, setMat2Key] = useState<string>('stahl_s235');
  const [useLogScale, setUseLogScale] = useState(false);
  
  // Würfelstapel State
  const [cubeMatKey, setCubeMatKey] = useState<string>('beton_c20');
  const [cubeSize, setCubeSize] = useState<number>(10); // cm

  const mat1 = materials[mat1Key];
  const mat2 = materials[mat2Key];
  const cubeMat = materials[cubeMatKey];
  const g = 9.81;

  const calc = (mat: Material) => {
    const H_max = (mat.fc * 1e6) / (mat.rho * g);
    const L_max = (mat.ft * 1e6) / (mat.rho * g);
    return { H_max, L_max };
  };

  const res1 = useMemo(() => calc(mat1), [mat1]);
  const res2 = useMemo(() => calc(mat2), [mat2]);

  // Würfelstapel Berechnung
  const cubeCalc = useMemo(() => {
    const a = cubeSize / 100; // in m
    // N_max = f_c / (rho * g * a)
    const N_max_exact = (cubeMat.fc * 1e6) / (cubeMat.rho * g * a);
    const N_max = Math.floor(N_max_exact);
    
    const H_total = N_max * a;
    
    // Verformung unterster Würfel: delta = sigma / E * a
    // sigma = N_max * rho * g * a
    const sigma_bottom = N_max * cubeMat.rho * g * a; // in Pa
    const delta_bottom = (sigma_bottom / (cubeMat.E * 1e6)) * a; // in m
    
    // Gesamtverformung des Stapels
    // delta_total = sum(i * rho * g * a^2 / E) = (rho * g * a^2 / E) * (N * (N+1) / 2)
    const delta_total = (cubeMat.rho * g * a * a / (cubeMat.E * 1e6)) * (N_max * (N_max + 1) / 2); // in m
    
    return {
      a,
      N_max_exact,
      N_max,
      H_total,
      delta_bottom: delta_bottom * 1000, // in mm
      delta_total: delta_total * 1000, // in mm
      sigma_bottom: sigma_bottom / 1e6 // in MPa
    };
  }, [cubeMat, cubeSize]);

  const chartData = {
    labels: ['Max. Turmhöhe (Druck)', 'Max. Reißlänge (Zug)'],
    datasets: [
      {
        label: mat1.name,
        data: [res1.H_max, res1.L_max],
        backgroundColor: mat1.color,
      },
      {
        label: mat2.name,
        data: [res2.H_max, res2.L_max],
        backgroundColor: mat2.color,
      }
    ]
  };

  const formatLength = (m: number) => {
    if (m > 10000) return `${formatDeZahl(m / 1000, 1)} km`;
    if (m > 1000) return `${formatDeZahl(m / 1000, 2)} km`;
    return `${formatDeZahl(m, 0)} m`;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><Calculator className="text-shiraz" /> Festigkeitsberechnungen (Turmbau & Reißlänge)</h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
          <p>
            Festigkeitsberechnungen dienen dem Nachweis, dass die auftretenden Spannungen in einem Bauteil die Festigkeit des Werkstoffs (in der Bemessung: den Bemessungswert nach Eurocode) nicht überschreiten. Die folgenden Gedankenexperimente arbeiten ohne Teilsicherheitsbeiwerte und ohne Stabilitätsversagen.
          </p>
        </div>

        <p className="text-home-grau mb-6">
          Vergleichen Sie zwei Materialien hinsichtlich ihrer theoretischen Grenzen unter Eigengewicht.
          <br/><br/>
          <strong>Turmbau (Druck):</strong> Wie hoch kann ein Turm gestapelt werden, bis das Material unten zerdrückt wird? <span className="font-mono text-xs bg-gray-100 px-1 rounded"><FormulaText text="H = f_c / (\rho \cdot g)" /></span>
          <br/>
          <strong>Reißlänge (Zug):</strong> Wie lang kann ein frei hängendes Seil/Stab sein, bis es unter seinem eigenen Gewicht reißt? <span className="font-mono text-xs bg-gray-100 px-1 rounded"><FormulaText text="L = f_t / (\rho \cdot g)" /></span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Material 1 */}
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Material 1</h3>
            <select aria-label="Material 1"
              value={mat1Key}
              onChange={(e) => setMat1Key(e.target.value)}
              className="w-full p-2 mb-4 border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-shiraz focus:border-shiraz outline-none"
            >
              {Object.entries(materials).map(([key, m]) => (
                <option key={key} value={key}>{m.name}</option>
              ))}
            </select>
            
            <div className="grid grid-cols-4 gap-2 text-xs mb-6">
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1"><FormulaText text="Dichte ρ" /></div>
                <div className="font-bold text-text-main">{formatDeWert(mat1.rho)} kg/m³</div>
              </div>
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1"><FormulaText text="Druck f_c" /></div>
                <div className="font-bold text-text-main">{formatDeWert(mat1.fc)} MPa</div>
              </div>
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1"><FormulaText text="Zug f_t" /></div>
                <div className="font-bold text-text-main">{formatDeWert(mat1.ft)} MPa</div>
              </div>
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1">E-Modul</div>
                <div className="font-bold text-text-main">{formatDeWert(mat1.E)} MPa</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-shiraz/10 p-4 rounded-lg border border-shiraz/20 text-center">
                <div className="text-shiraz text-xs font-bold uppercase mb-1">Max. Turmhöhe</div>
                <div className="text-2xl font-bold text-shiraz">{formatLength(res1.H_max)}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <div className="text-blue-700 text-xs font-bold uppercase mb-1">Max. Reißlänge</div>
                <div className="text-2xl font-bold text-blue-700">{formatLength(res1.L_max)}</div>
              </div>
            </div>
          </div>

          {/* Material 2 */}
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Material 2</h3>
            <select aria-label="Material 2"
              value={mat2Key}
              onChange={(e) => setMat2Key(e.target.value)}
              className="w-full p-2 mb-4 border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-shiraz focus:border-shiraz outline-none"
            >
              {Object.entries(materials).map(([key, m]) => (
                <option key={key} value={key}>{m.name}</option>
              ))}
            </select>
            
            <div className="grid grid-cols-4 gap-2 text-xs mb-6">
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1"><FormulaText text="Dichte ρ" /></div>
                <div className="font-bold text-text-main">{formatDeWert(mat2.rho)} kg/m³</div>
              </div>
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1"><FormulaText text="Druck f_c" /></div>
                <div className="font-bold text-text-main">{formatDeWert(mat2.fc)} MPa</div>
              </div>
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1"><FormulaText text="Zug f_t" /></div>
                <div className="font-bold text-text-main">{formatDeWert(mat2.ft)} MPa</div>
              </div>
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1">E-Modul</div>
                <div className="font-bold text-text-main">{formatDeWert(mat2.E)} MPa</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-shiraz/10 p-4 rounded-lg border border-shiraz/20 text-center">
                <div className="text-shiraz text-xs font-bold uppercase mb-1">Max. Turmhöhe</div>
                <div className="text-2xl font-bold text-shiraz">{formatLength(res2.H_max)}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <div className="text-blue-700 text-xs font-bold uppercase mb-1">Max. Reißlänge</div>
                <div className="text-2xl font-bold text-blue-700">{formatLength(res2.L_max)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Vergleichsdiagramm</h3>
            <label className="flex items-center gap-2 text-sm text-text-main cursor-pointer">
              <input 
                type="checkbox" 
                checked={useLogScale} 
                onChange={(e) => setUseLogScale(e.target.checked)}
                className="rounded text-shiraz focus:ring-shiraz"
              />
              Logarithmische Skala (für extreme Unterschiede)
            </label>
          </div>
          <div className="w-full h-[400px]">
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { 
                    type: useLogScale ? 'logarithmic' : 'linear',
                    title: { display: true, text: 'Länge / Höhe [m]' },
                    beginAtZero: true
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context: TooltipItem<'bar'>) => {
                        return `${context.dataset.label}: ${formatLength(context.raw as number)}`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Würfelstapel-Problem */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><Layers className="text-shiraz" /> Das Würfelstapel-Problem</h2>
        <p className="text-home-grau mb-6">
          Es sollen Würfel solange aufeinandergestapelt werden, bis der unterste aufgrund des Gewichts auf Druck versagt 
          (kein Stabilitätsversagen, keine Horizontalkräfte, keine Sicherheitsbeiwerte). Die Verformung wird linear-elastisch über den E-Modul berechnet.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 lg:col-span-1">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Parameter</h3>
            
            <div className="mb-6">
              <div className="flex items-center gap-2"><label className="text-xs text-home-grau block mb-1">Material</label><InfoTooltip text="Auswahl des zu untersuchenden Werkstoffs." /></div>
              <select aria-label="Material"
                value={cubeMatKey}
                onChange={(e) => setCubeMatKey(e.target.value)}
                className="w-full p-2 border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-shiraz focus:border-shiraz outline-none"
              >
                {Object.entries(materials).map(([key, m]) => (
                  <option key={key} value={key}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <Slider 
                label="Kantenlänge a" info="Länge der Kante des Probekörpers." 
                min={1} 
                max={100} 
                step={1} 
                value={cubeSize} 
                unit="cm" 
                onChange={(e) => setCubeSize(Number(e.target.value))} 
              />
            </div>

            <div className="bg-white p-4 rounded-lg border border-home-grau/30 text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-home-grau"><FormulaText text="Dichte ρ:" /></span>
                <span className="font-bold">{formatDeWert(cubeMat.rho)} kg/m³</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-home-grau">Druckfestigkeit <span className="font-mono bg-gray-100 px-1 rounded"><FormulaText text="f_c" /></span>:</span>
                <span className="font-bold">{formatDeWert(cubeMat.fc)} MPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-home-grau">E-Modul <span className="font-mono bg-gray-100 px-1 rounded">E</span>:</span>
                <span className="font-bold">{formatDeWert(cubeMat.E)} MPa</span>
              </div>
            </div>
          </div>

          <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/20 lg:col-span-2 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-shiraz uppercase tracking-wider mb-6">Ergebnisse</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-home-grau text-sm mb-1">Max. Anzahl Würfel (N)</div>
                <div className="text-4xl font-bold text-text-main">{formatDeWert(cubeCalc.N_max)} <span className="text-lg font-normal text-home-grau">Stück</span></div>
              </div>
              
              <div>
                <div className="text-home-grau text-sm mb-1">Gesamthöhe des Stapels</div>
                <div className="text-4xl font-bold text-text-main">{formatLength(cubeCalc.H_total)}</div>
              </div>

              <div>
                <div className="text-home-grau text-sm mb-1">Stauchung unterster Würfel</div>
                <div className="text-2xl font-bold text-shiraz">{formatDeZahl(cubeCalc.delta_bottom, 3)} <span className="text-sm font-normal">mm</span></div>
                <div className="text-xs text-home-grau mt-1">Spannung: {formatDeZahl(cubeCalc.sigma_bottom, 2)} MPa</div>
              </div>

              <div>
                <div className="text-home-grau text-sm mb-1">Gesamtstauchung des Stapels</div>
                <div className="text-2xl font-bold text-shiraz">{formatDeZahl(cubeCalc.delta_total, 1)} <span className="text-sm font-normal">mm</span></div>
                <div className="text-xs text-home-grau mt-1">Summe aller Einzelverformungen</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live-Rechenweg (AP 3.7) mit den aktuellen Eingaben */}
        <FormulaDerivationBox
          live
          title={`Ihr Rechenweg: Würfelstapel aus ${cubeMat.name}`}
          zielGleichung="N_{\max} = \left\lfloor \frac{f_c}{\rho \cdot g \cdot a} \right\rfloor"
          schritte={[
            {
              titel: 'Eingaben in SI-Einheiten',
              erklaerung: 'Kantenlänge in Meter, Festigkeit in N/m²:',
              formel: `a = ${formatDeTeX(cubeCalc.a, 2)}\\,\\text{m},\\; f_c = ${formatDeTeX(cubeMat.fc, 1)} \\cdot 10^{6}\\,\\text{N/m}^2,\\; \\rho = ${formatDeTeX(cubeMat.rho, 0)}\\,\\text{kg/m}^3`
            },
            {
              titel: 'Anzahl der Würfel',
              erklaerung: 'Jeder Würfel erhöht die Spannung am Fuß um ρ·g·a; es zählen nur ganze Würfel (abrunden):',
              formel: `N = \\frac{${formatDeTeX(cubeMat.fc, 1)} \\cdot 10^{6}}{${formatDeTeX(cubeMat.rho, 0)} \\cdot 9{,}81 \\cdot ${formatDeTeX(cubeCalc.a, 2)}} = ${formatDeTeX(cubeCalc.N_max_exact, 2)} \\;\\Rightarrow\\; N_{\\max} = ${formatDeTeX(cubeCalc.N_max, 0)}`
            },
            {
              titel: 'Stapelhöhe',
              erklaerung: 'Anzahl mal Kantenlänge:',
              formel: `H = ${formatDeTeX(cubeCalc.N_max, 0)} \\cdot ${formatDeTeX(cubeCalc.a, 2)} = ${formatDeTeX(cubeCalc.H_total, 2)}\\,\\text{m}`
            },
            {
              titel: 'Spannung und Stauchung am Fuß',
              erklaerung: `Hookesches Gesetz mit E = ${formatDeZahl(cubeMat.E, 0)} MPa für den untersten Würfel:`,
              formel: `\\sigma = N \\rho g a = ${formatDeTeX(cubeCalc.sigma_bottom, 2)}\\,\\text{MPa},\\quad \\Delta a = \\frac{\\sigma}{E} \\cdot a = ${formatDeTeX(cubeCalc.delta_bottom, 3)}\\,\\text{mm}`
            },
            {
              titel: 'Gesamtstauchung',
              erklaerung: 'Der i-te Würfel von oben trägt i Würfel; die Summe 1 + 2 + … + N ergibt N(N+1)/2:',
              formel: `\\Delta H = \\frac{\\rho g a^2}{E} \\cdot \\frac{N(N+1)}{2} = ${formatDeTeX(cubeCalc.delta_total, 1)}\\,\\text{mm}`
            }
          ]}
          ergebnisHinweis="Gedankenexperiment ohne Teilsicherheitsbeiwerte und ohne Stabilitätsversagen."
          normQuelle="Technische Mechanik (Gleichgewicht, Hookesches Gesetz)"
        />
      </div>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Wie hoch könnte eine Betonsäule aus C20/25 werden?"
        zielGleichung="H = \frac{f_c}{\rho \cdot g}"
        schritte={[
          { titel: 'Gleichgewicht', erklaerung: 'Am Fuß einer prismatischen Säule wirkt das Eigengewicht ρ·g·A·H auf die Fläche A – die Querschnittsfläche kürzt sich heraus:', formel: '\\sigma = \\rho \\cdot g \\cdot H' },
          { titel: 'Einheiten', erklaerung: 'f_c = 20 N/mm² = 20 · 10⁶ N/m², ρ = 2400 kg/m³, g = 9,81 m/s².', formel: 'H = \\frac{20 \\cdot 10^{6}}{2400 \\cdot 9{,}81}' },
          { titel: 'Ergebnis', erklaerung: 'Theoretische Grenzhöhe ohne Sicherheiten und ohne Knicken:', formel: 'H = 849\\,\\text{m}' }
        ]}
        ergebnisHinweis="Mit Bemessungswerten (f_cd = 0,85 · 20/1,5 = 11,3 N/mm², γ_G = 1,35) schrumpft die Höhe auf rund 356 m – und lange vorher wird Knicken maßgebend."
        normQuelle="Gleichgewicht; Bemessungswerte nach DIN EN 1990/1992-1-1"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Reißlänge von Baustahl S235"
        zielGleichung="L = \frac{f_u}{\rho \cdot g}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Zugfestigkeit f_u = 360 N/mm² (Mindestwert), ρ = 7850 kg/m³.', formel: 'f_u = 360 \\cdot 10^{6}\\,\\text{N/m}^2' },
          { titel: 'Ergebnis', erklaerung: 'Länge, bei der ein frei hängender Stab an der Aufhängung reißt:', formel: 'L = \\frac{360 \\cdot 10^{6}}{7850 \\cdot 9{,}81} = 4\\,675\\,\\text{m} \\approx 4{,}7\\,\\text{km}' }
        ]}
        ergebnisHinweis="Die Reißlänge ist eine spezifische Festigkeit (Festigkeit je Gewicht) – deshalb schneiden leichte Fasern wie CFK oder Aramid um ein Vielfaches besser ab als Stahl."
        normQuelle="Technische Mechanik; f_u nach DIN EN 10025-2"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="festigkeit" />

      <ModuleFooter 
        lastReviewed="Oktober 2026 (AP 5 Mechanik: Werkstoffwerte und Grenzhöhen-/Reißlängenmodell geprüft; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Festigkeit', url: 'https://de.wikipedia.org/wiki/Festigkeit' },
          { title: 'Hookesches Gesetz', url: 'https://de.wikipedia.org/wiki/Hookesches_Gesetz' },
          { title: 'Reißlänge', url: 'https://de.wikipedia.org/wiki/Rei%C3%9Fl%C3%A4nge' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1990 (Eurocode 0: Grundlagen der Tragwerksplanung)' },
          { title: 'DIN EN 1992 bis EN 1999 (Werkstoffspezifische Eurocodes)' },
          { title: 'DIN EN ISO 6892-1 (Metallische Werkstoffe - Zugversuch)' }
        ]}
        literatur={[
          'Gross, D.; Hauger, W.; Schröder, J.; Wall, W. A.: Technische Mechanik 2 – Elastostatik. Berlin: Springer Vieweg (aktuelle Auflage)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
              formel: 'H = \\frac{f_c}{\\rho \\cdot g}',
              erklaerung: 'Maximale Turmhöhe unter Eigengewicht (Druck)\n$\\rho$: Dichte [kg/m³]\n$f_c$: Druckfestigkeit [N/m²] (1 N/mm² = 10⁶ N/m²)\n$H$: Höhe [m]\n$g$: Erdbeschleunigung [m/s²]',
              quelle: 'Technische Mechanik (Gleichgewicht am Prisma)'
            },
          {
              formel: 'L = \\frac{f_t}{\\rho \\cdot g}',
              erklaerung: 'Maximale Reißlänge unter Eigengewicht (Zug)\n$\\rho$: Dichte [kg/m³]\n$f_t$: Zugfestigkeit [N/m²]\n$g$: Erdbeschleunigung [m/s²]\n$L$: Länge [m]',
              quelle: 'Technische Mechanik (Gleichgewicht am Seil)'
            },
          {
              formel: '\\Delta l = \\frac{\\sigma}{E} \\cdot l',
              erklaerung: 'Elastische Verformung (Hookesches Gesetz)\n$\\Delta l$: Längenänderung (Einheit wie l)\n$\\sigma$: Normalspannung [N/mm²]\n$l$: Länge\n$E$: Elastizitätsmodul [N/mm²]',
              quelle: 'Hookesches Gesetz'
            }
        ]}
      />
    </div>
  );
}
