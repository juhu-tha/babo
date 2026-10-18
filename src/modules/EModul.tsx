import React, { useState, useMemo } from 'react';
import { Activity } from 'lucide-react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function EModul() {
  const [material, setMaterial] = useState('Beton');
  const [fck, setFck] = useState(30); // Für Beton
  const [alphaE, setAlphaE] = useState(1.0); // Gesteinsart-Beiwert nach EC2
  const [eModulGestein, setEModulGestein] = useState(60); // GPa
  const [volGestein, setVolGestein] = useState(70); // %
  const [eModulMatrix, setEModulMatrix] = useState(20); // GPa

  const results = useMemo(() => {
    // E-Modul Beton nach Eurocode 2: E_cm = alpha_E * 22 * (f_cm / 10)^0.3
    const fcm = fck + 8;
    const ecm = alphaE * 22 * Math.pow(fcm / 10, 0.3); // GPa

    // Mischungsregel (Voigt / Reuss) für Zweiphasenmaterial (Gestein + Zementstein)
    const vG = volGestein / 100;
    const vM = 1 - vG;
    const eG = eModulGestein;
    const eM = eModulMatrix;

    // Parallelschaltung (Voigt) - Obere Schranke
    const eVoigt = vG * eG + vM * eM;

    // Reihenschaltung (Reuss) - Untere Schranke
    const eReuss = 1 / (vG / eG + vM / eM);

    // Hashin-Shtrikman Schranken (vereinfacht für Kugelinklusionen)
    // Annahme Querdehnzahl nu = 0.2 für beide
    const nu = 0.2;
    const kG = eG / (3 * (1 - 2 * nu));
    const gG = eG / (2 * (1 + nu));
    const kM = eM / (3 * (1 - 2 * nu));
    const gM = eM / (2 * (1 + nu));

    // HS Lower (Matrix is continuous)
    const kHSMinus = kM + vG / (1 / (kG - kM) + 3 * vM / (3 * kM + 4 * gM));
    const gHSMinus = gM + vG / (1 / (gG - gM) + 6 * vM * (kM + 2 * gM) / (5 * gM * (3 * kM + 4 * gM)));
    const eHSMinus = (9 * kHSMinus * gHSMinus) / (3 * kHSMinus + gHSMinus);

    // HS Upper (Inclusion is continuous - less realistic for concrete but good for theory)
    const kHSPlus = kG + vM / (1 / (kM - kG) + 3 * vG / (3 * kG + 4 * gG));
    const gHSPlus = gG + vM / (1 / (gM - gG) + 6 * vG * (kG + 2 * gG) / (5 * gG * (3 * kG + 4 * gG)));
    const eHSPlus = (9 * kHSPlus * gHSPlus) / (3 * kHSPlus + gHSPlus);

    // Chart Data: Variation des Gesteinsvolumens von 0 bis 100%
    const chartLabels = [];
    const voigtData = [];
    const reussData = [];
    const hsMinusData = [];
    const hsPlusData = [];

    for (let v = 0; v <= 100; v += 5) {
      const vg = v / 100;
      const vm = 1 - vg;
      
      voigtData.push(vg * eG + vm * eM);
      reussData.push(1 / (vg / eG + vm / eM));

      const kHS_m = kM + vg / (1 / (kG - kM) + 3 * vm / (3 * kM + 4 * gM));
      const gHS_m = gM + vg / (1 / (gG - gM) + 6 * vm * (kM + 2 * gM) / (5 * gM * (3 * kM + 4 * gM)));
      hsMinusData.push((9 * kHS_m * gHS_m) / (3 * kHS_m + gHS_m));

      const kHS_p = kG + vm / (1 / (kM - kG) + 3 * vg / (3 * kG + 4 * gG));
      const gHS_p = gG + vm / (1 / (gM - gG) + 6 * vg * (kG + 2 * gG) / (5 * gG * (3 * kG + 4 * gG)));
      hsPlusData.push((9 * kHS_p * gHS_p) / (3 * kHS_p + gHS_p));
      
      chartLabels.push(v);
    }

    return {
      ecm,
      eVoigt,
      eReuss,
      eHSMinus,
      eHSPlus,
      chartLabels,
      voigtData,
      reussData,
      hsMinusData,
      hsPlusData
    };
  }, [fck, eModulGestein, volGestein, eModulMatrix]);

  const chartData = {
    labels: results.chartLabels,
    datasets: [
      {
        label: 'Voigt (Obere Schranke)',
        data: results.voigtData,
        borderColor: '#A3113E',
        borderDash: [5, 5],
        fill: false,
        tension: 0.1
      },
      {
        label: 'Reuss (Untere Schranke)',
        data: results.reussData,
        borderColor: '#475569',
        borderDash: [5, 5],
        fill: false,
        tension: 0.1
      },
      {
        label: 'Hashin-Shtrikman (Oben)',
        data: results.hsPlusData,
        borderColor: '#64748b',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Hashin-Shtrikman (Unten)',
        data: results.hsMinusData,
        borderColor: '#475569',
        fill: false,
        tension: 0.1
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Activity className="text-shiraz" /> E-Modul &amp; Mehrphasenmodelle
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der Elastizitätsmodul (E-Modul) beschreibt die Steifigkeit eines Materials. Bei Verbundwerkstoffen wie Beton 
          setzt sich der E-Modul aus den Eigenschaften der Einzelkomponenten (Gesteinskörnung und Zementstein) zusammen. 
          Hier werden verschiedene theoretische Modelle zur Abschätzung des resultierenden E-Moduls vorgestellt.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Normativer E-Modul (Eurocode 2)</h3>
              <Slider
                label="Charakt. Druckfestigkeit (fck)" info="Charakteristische Zylinderdruckfestigkeit des Betons nach 28 Tagen."
                value={fck}
                min={12}
                max={90}
                step={1}
                onChange={(e) => setFck(Number(e.target.value))}
                unit="MPa"
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-text-main mb-1">
                  Gesteinsart (Beiwert <FormulaText text="\alpha_E" />)
                </label>
                <select
                  value={alphaE}
                  onChange={(e) => setAlphaE(Number(e.target.value))}
                  className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value={1.2}>Basalt, dichte Kalksteine (α_E = 1.20)</option>
                  <option value={1.0}>Quarzit (α_E = 1.00 - Standard)</option>
                  <option value={0.9}>Kalkstein (α_E = 0.90)</option>
                  <option value={0.7}>Sandstein (α_E = 0.70)</option>
                </select>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg border border-home-grau/30">
                <div className="text-sm text-text-main/70">Mittlerer E-Modul (E_cm)</div>
                <div className="text-2xl font-bold text-text-main">{results.ecm.toFixed(1)} GPa</div>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Mehrphasenmodelle (Mikromechanik)</h3>
              <Slider
                label="E-Modul Gesteinskörnung (E_G)" 
                value={eModulGestein}
                min={20}
                max={100}
                step={5}
                onChange={(e) => setEModulGestein(Number(e.target.value))}
                unit="GPa"
              />
              <Slider
                label="E-Modul Zementstein (E_M)" info="Elastizitätsmodul der Zementsteinmatrix."
                value={eModulMatrix}
                min={5}
                max={40}
                step={1}
                onChange={(e) => setEModulMatrix(Number(e.target.value))}
                unit="GPa"
              />
              <Slider
                label="Volumenanteil Gestein (v_G)" 
                value={volGestein}
                min={0}
                max={100}
                step={1}
                onChange={(e) => setVolGestein(Number(e.target.value))}
                unit="%"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Ergebnisse der Modelle</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30">
                  <div className="text-xs text-text-main/70 mb-1">Voigt (Parallelschaltung)</div>
                  <div className="text-lg font-bold text-shiraz">{results.eVoigt.toFixed(1)} GPa</div>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30">
                  <div className="text-xs text-text-main/70 mb-1">Reuss (Reihenschaltung)</div>
                  <div className="text-lg font-bold text-blue-600">{results.eReuss.toFixed(1)} GPa</div>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30">
                  <div className="text-xs text-text-main/70 mb-1">Hashin-Shtrikman (Oben)</div>
                  <div className="text-lg font-bold text-amber-500">{results.eHSPlus.toFixed(1)} GPa</div>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30">
                  <div className="text-xs text-text-main/70 mb-1">Hashin-Shtrikman (Unten)</div>
                  <div className="text-lg font-bold text-emerald-500">{results.eHSMinus.toFixed(1)} GPa</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-text-main/80">
                Für Beton ist das untere Hashin-Shtrikman-Modell (Matrix umschließt Partikel) meist die beste theoretische Näherung.
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">E-Modul in Abhängigkeit vom Gesteinsanteil</h3>
              <div className="h-64">
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        title: { display: true, text: 'E-Modul (GPa)' }
                      },
                      x: {
                        title: { display: true, text: 'Volumenanteil Gestein (%)' }
                      }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Modelle</h3>
              <div className="flex justify-between items-center h-40 bg-off-white rounded-lg border border-home-grau/30 p-4">
                
                {/* SVG Defs for Arrows */}
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                    </marker>
                    <marker id="arrow-red-start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                      <path d="M 10 0 L 0 5 L 10 10 z" fill="#A3113E" />
                    </marker>
                  </defs>
                </svg>

                {/* Voigt */}
                <div className="flex flex-col items-center w-1/3">
                  <div className="text-xs font-bold mb-2">Voigt (Parallel)</div>
                  <div className="text-[10px] text-text-main/70 mb-2">Dehnung <FormulaText text="\varepsilon" /> gleich</div>
                  <svg width="60" height="70" viewBox="0 0 60 70" className="overflow-visible">
                    <rect x="10" y="15" width="20" height="40" fill="#cbd5e1" stroke="#94a3b8" />
                    <rect x="30" y="15" width="20" height="40" fill="#94a3b8" stroke="#64748b" />
                    <path d="M 30 15 L 30 2" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                    <path d="M 30 55 L 30 68" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  </svg>
                </div>
                
                {/* Reuss */}
                <div className="flex flex-col items-center w-1/3 border-l border-r border-home-grau/30">
                  <div className="text-xs font-bold mb-2">Reuss (Reihe)</div>
                  <div className="text-[10px] text-text-main/70 mb-2">Spannung <FormulaText text="\sigma" /> gleich</div>
                  <svg width="60" height="70" viewBox="0 0 60 70" className="overflow-visible">
                    <rect x="10" y="15" width="40" height="20" fill="#cbd5e1" stroke="#94a3b8" />
                    <rect x="10" y="35" width="40" height="20" fill="#94a3b8" stroke="#64748b" />
                    <path d="M 30 15 L 30 2" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                    <path d="M 30 55 L 30 68" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  </svg>
                </div>

                {/* Hashin-Shtrikman */}
                <div className="flex flex-col items-center w-1/3">
                  <div className="text-xs font-bold mb-2">HS (Einschluss)</div>
                  <div className="text-[10px] text-text-main/70 mb-2">Exaktere Schranke</div>
                  <svg width="60" height="70" viewBox="0 0 60 70" className="overflow-visible">
                    <rect x="10" y="15" width="40" height="40" fill="#cbd5e1" stroke="#94a3b8" />
                    <circle cx="30" cy="35" r="12" fill="#94a3b8" stroke="#64748b" />
                    <path d="M 30 15 L 30 2" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                    <path d="M 30 55 L 30 68" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Elastizitätsmodul', url: 'https://de.wikipedia.org/wiki/Elastizit%C3%A4tsmodul' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1 (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 12390-13 (Prüfung von Festbeton - Bestimmung des Elastizitätsmoduls unter Druckbeanspruchung)', url: 'https://www.dinmedia.de/' }
        ]}
        literatur={[
          'Wendehorst Baustoffkunde, 27. Auflage, Vieweg+Teubner 2011',
          'Hashin, Z., Shtrikman, S. (1963): A variational approach to the theory of the elastic behaviour of multiphase materials. J. Mech. Phys. Solids',
          'Gross, D.; Hauger, W.: Technische Mechanik 2: Elastostatik (Springer Vieweg)'
        ]}
        formeln={[
          {
            formel: 'E_{cm} = \\alpha_E \\cdot 22 \\cdot \\left(\\frac{f_{cm}}{10}\\right)^{0.3} \\quad [\\text{GPa}]',
            erklaerung: 'Mittlerer Elastizitätsmodul von Normalbeton nach Eurocode 2 in Abhängigkeit von mittlerer Zylinderdruckfestigkeit fcm und Gesteinszuschlagsbeiwert αE.',
            quelle: 'DIN EN 1992-1-1 Tab. 3.1'
          },
          {
            formel: 'E_{\\text{Voigt}} = v_G \\cdot E_G + v_M \\cdot E_M',
            erklaerung: 'Voigt-Modell (obere Schranke / Parallelschaltung / Isostrain): Annahme einheitlicher Dehnung in allen Phasen des Zweiphasen-Verbundwerkstoffs.',
            quelle: 'Mikromechanik'
          },
          {
            formel: 'E_{\\text{Reuss}} = \\left(\\frac{v_G}{E_G} + \\frac{v_M}{E_M}\\right)^{-1}',
            erklaerung: 'Reuss-Modell (untere Schranke / Reihenschaltung / Isostress): Annahme einheitlicher Spannung in allen Phasen.',
            quelle: 'Mikromechanik'
          },
          {
            formel: 'K_{\\text{HS}-} = K_M + \\frac{v_G}{\\frac{1}{K_G - K_M} + \\frac{3v_M}{3K_M + 4G_M}}',
            erklaerung: 'Untere Hashin-Shtrikman-Schranke für sphärische Gesteinsinklusionen in zementärer Matrix: liefert realitätsnahe Steifigkeitsabschätzungen für Beton.',
            quelle: 'Hashin & Shtrikman (1963)'
          }
        ]}
      />
    </div>
  );
}
