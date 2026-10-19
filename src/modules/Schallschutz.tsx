import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { Volume2 } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
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

const materialLibrary = [
  { id: 'innenputz_gips', name: 'Gipsputz (Innen)', density: 1000 },
  { id: 'innenputz_kalk', name: 'Kalkputz (Innen)', density: 1400 },
  { id: 'aussenputz_zement', name: 'Zementputz (Außen)', density: 1800 },
  { id: 'mauerwerk_ziegel_hochloch', name: 'Hochlochziegel (HLZ)', density: 800 },
  { id: 'mauerwerk_ziegel_voll', name: 'Vollziegel (MZ)', density: 1800 },
  { id: 'mauerwerk_kalksandstein', name: 'Kalksandstein (KS)', density: 2000 },
  { id: 'mauerwerk_porenbeton', name: 'Porenbeton (PB)', density: 400 },
  { id: 'beton_normal', name: 'Normalbeton (Stahlbeton)', density: 2400 },
  { id: 'beton_leicht', name: 'Leichtbeton', density: 1200 },
  { id: 'daemmung_eps', name: 'EPS (Styropor)', density: 20 },
  { id: 'daemmung_xps', name: 'XPS (Styrodur)', density: 35 },
  { id: 'daemmung_miwo', name: 'Mineralwolle (MiWo)', density: 50 },
  { id: 'daemmung_holzfaser', name: 'Holzfaserplatte', density: 160 },
  { id: 'daemmung_pur', name: 'PUR/PIR Hartschaum', density: 30 },
  { id: 'holz_fichte', name: 'Fichte / Tanne (Vollholz)', density: 450 },
  { id: 'holz_eiche', name: 'Eiche (Vollholz)', density: 700 },
  { id: 'platte_osb', name: 'OSB-Platte', density: 600 },
  { id: 'platte_gipskarton', name: 'Gipskartonplatte (GKB)', density: 800 },
  { id: 'stahl', name: 'Stahl', density: 7850 },
  { id: 'aluminium', name: 'Aluminium', density: 2700 },
  { id: 'glas', name: 'Glas', density: 2500 },
];

export default function Schallschutz() {
  const [layers, setLayers] = useState([
    { id: 'layer1', matId: 'innenputz_gips', d: 0.015 },
    { id: 'layer2', matId: 'mauerwerk_ziegel_hochloch', d: 0.24 },
    { id: 'layer3', matId: 'daemmung_eps', d: 0.16 },
    { id: 'layer4', matId: 'aussenputz_zement', d: 0.02 },
  ]);

  const resolvedLayers = useMemo(() => {
    return layers.map(l => {
      const mat = materialLibrary.find(m => m.id === l.matId) || materialLibrary[0];
      return { ...l, ...mat };
    });
  }, [layers]);

  const schallData = useMemo(() => {
    // 1. Mass per unit area (m')
    let m_prime = 0;
    resolvedLayers.forEach(l => {
      m_prime += l.d * l.density;
    });

    // 2. Sound insulation according to DIN 4109-32:
    // Rw = 30.9 * log10(m'/1) - 22.2 dB für einschalige massive Bauteile (65 <= m' <= 720 kg/m²)
    let Rw = 0;
    if (m_prime > 0) {
      Rw = 30.9 * Math.log10(m_prime / 1) - 22.2;
    }
    if (Rw < 0) Rw = 0;

    const isValidRange = m_prime >= 65 && m_prime <= 720;

    // Chart Data
    const chartData = [];
    for (let m = 50; m <= 1000; m += 50) {
      chartData.push({ x: m, y: Math.max(10, 30.9 * Math.log10(m / 1) - 22.2) });
    }

    return {
      m_prime,
      Rw,
      isValidRange,
      chartData: {
        datasets: [
          {
            label: 'Schalldämm-Maß R_w (dB) nach DIN 4109-32',
            data: chartData,
            borderColor: '#64748b',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            fill: true,
            pointRadius: 0,
          },
          {
            label: 'Aktuelles Bauteil',
            data: [{ x: m_prime, y: Math.max(10, Rw) }],
            backgroundColor: '#A3113E',
            borderColor: '#A3113E',
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false,
          }
        ]
      }
    };
  }, [resolvedLayers]);

  const addLayer = () => {
    setLayers([...layers, { id: `layer${Date.now()}`, matId: 'mauerwerk_ziegel_hochloch', d: 0.115 }]);
  };

  const removeLayer = (id: string) => {
    if (layers.length > 1) {
      setLayers(layers.filter(l => l.id !== id));
    }
  };

  const updateLayer = (id: string, field: string, value: any) => {
    setLayers(layers.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const moveLayer = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newLayers = [...layers];
      [newLayers[index - 1], newLayers[index]] = [newLayers[index], newLayers[index - 1]];
      setLayers(newLayers);
    } else if (direction === 'down' && index < layers.length - 1) {
      const newLayers = [...layers];
      [newLayers[index + 1], newLayers[index]] = [newLayers[index], newLayers[index + 1]];
      setLayers(newLayers);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
          <Volume2 className="text-shiraz" /> Bauphysik (Schallschutz)
          <InfoTooltip text="Berechnung des Schalldämm-Maßes nach dem Berger'schen Massegesetz für einschalige Bauteile." />
        </h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
          <p>
            Der Schallschutz von einschaligen, biegesteifen Bauteilen hängt maßgeblich von ihrer flächenbezogenen Masse (<FormulaText text="m'" />) ab. Je schwerer das Bauteil, desto besser die Schalldämmung (Massegesetz). Bei mehrschaligen Bauteilen (z.B. mit Dämmung) treten komplexe Resonanzeffekte (Masse-Feder-Masse) auf, die hier vereinfacht vernachlässigt werden.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Bauteilaufbau</h3>
                <button 
                  onClick={addLayer}
                  className="text-xs bg-orange-800 text-white px-3 py-1.5 rounded-lg hover:bg-torch-red transition-colors flex items-center gap-1"
                >
                  + Schicht
                </button>
              </div>
              
              <div className="flex flex-col gap-3">
                {layers.map((layer, idx) => (
                  <div key={layer.id} className="bg-white p-3 rounded-lg border border-home-grau/30 flex flex-col gap-3 relative group">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-home-grau">Schicht {idx + 1} {idx === 0 ? '(Innen)' : idx === layers.length - 1 ? '(Außen)' : ''}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => moveLayer(idx, 'up')} disabled={idx === 0} className="p-1 text-home-grau hover:text-orange-800 disabled:opacity-30">▲</button>
                        <button onClick={() => moveLayer(idx, 'down')} disabled={idx === layers.length - 1} className="p-1 text-home-grau hover:text-orange-800 disabled:opacity-30">▼</button>
                        <button onClick={() => removeLayer(layer.id)} disabled={layers.length === 1} className="p-1 text-home-grau hover:text-orange-800 disabled:opacity-30">✕</button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center gap-2"><label className="text-xs text-home-grau block mb-1">Material</label><InfoTooltip text="Auswahl des zu untersuchenden Werkstoffs." /></div>
                        <select 
                          value={layer.matId}
                          onChange={(e) => updateLayer(layer.id, 'matId', e.target.value)}
                          className="w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-orange-800 outline-none"
                        >
                          {materialLibrary.map(mat => (
                            <option key={mat.id} value={mat.id}>{mat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <div className="flex items-center gap-2"><label className="text-xs text-home-grau block mb-1">Dicke d (m)</label><InfoTooltip text="Dicke der Bauteilschicht in Metern." /></div>
                        <input 
                          type="number" 
                          min="0.001" max="2.0" step="0.005"
                          value={layer.d}
                          onChange={(e) => updateLayer(layer.id, 'd', Number(e.target.value))}
                          className="w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-orange-800 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-800 text-white p-6 rounded-xl shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Ergebnisse</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-white/70 text-sm mb-1 flex items-center gap-1">
                    <FormulaText text="Flächenbezogene Masse m'" />
                  </div>
                  <div className="text-3xl font-bold">{formatDeZahl(schallData.m_prime, 1)} <span className="text-lg font-normal">kg/m²</span></div>
                </div>
                <div>
                  <div className="text-white/70 text-sm mb-1 flex items-center gap-1">
                    <FormulaText text="Schalldämm-Maß R_w" />
                    <InfoTooltip text="Berechnet nach DIN 4109-32 für einschalige massive Bauteile: Rw = 30.9 · log10(m'/1) - 22,2 dB. Historisch nach DIN 4109 Bbl. 1:1989: Rw ≈ 37.5 · log10(m') - 42 dB." />
                  </div>
                  <div className="text-3xl font-bold">{formatDeZahl(schallData.Rw, 1)} <span className="text-lg font-normal">dB</span></div>
                </div>
              </div>

              {!schallData.isValidRange && (
                <div className="mt-3 p-3 bg-amber-500/20 border border-amber-300/40 rounded-lg text-amber-200 text-xs">
                  ⚠️ <strong>Gültigkeitsbereich beachten:</strong> Die Formel nach DIN 4109-32 gilt für 65 ≤ m' ≤ 720 kg/m². Der aktuelle Wert liegt außerhalb dieses Bereichs ({formatDeZahl(schallData.m_prime, 1)} kg/m²).
                </div>
              )}

              <div className="mt-4 bg-white/10 p-3 rounded-lg border border-white/20 text-xs space-y-1.5 leading-relaxed">
                <p>
                  <strong>Berechnungsgrundlage DIN 4109-32:</strong> <FormulaText text="R_w = 30.9 \cdot \log_{10}(m'/1) - 22.2 \text{ dB}" /> für einschalige massive Bauteile (Gültigkeit: 65 ≤ m' ≤ 720 kg/m²).
                </p>
                <p className="text-white/80">
                  <strong>Hinweis zu Dämmschichten:</strong> Dämmschichten (z. B. EPS, WDVS) dürfen bei der Ermittlung des Schalldämm-Maßes der Grundwand nicht einfach als Masse addiert werden; der akustische Einfluss von WDVS ist gesondert nach DIN 4109-34 nachzuweisen.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[400px]">
              <h3 className="text-lg font-bold text-text-main mb-4">Schalldämm-Maß nach Massegesetz</h3>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={schallData.chartData} 
                  options={{
                    responsive: true, 
                    maintainAspectRatio: false,
                    scales: {
                      x: { type: 'linear', title: { display: true, text: "Flächenbezogene Masse m' (kg/m²)" } },
                      y: { title: { display: true, text: 'R_w (dB)' } }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Schalldämmung</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="160" viewBox="0 0 350 160">
                  {/* Senderaum */}
                  <text x="50" y="30" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Senderaum</text>
                  
                  {/* Bauteil */}
                  <rect x="140" y="20" width="70" height="120" fill="#cbd5e1" stroke="#94a3b8" />
                  <text x="175" y="80" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Wand</text>
                  <text x="175" y="95" fontSize="10" fill="#1e293b" textAnchor="middle">m'</text>

                  {/* Empfangsraum */}
                  <text x="300" y="30" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">Empfangsraum</text>

                  {/* Schallwellen Sender */}
                  <path d="M 20 60 Q 50 40 80 60 T 130 60" fill="none" stroke="#A3113E" strokeWidth="3" />
                  <path d="M 20 80 Q 50 60 80 80 T 130 80" fill="none" stroke="#A3113E" strokeWidth="3" />
                  <path d="M 20 100 Q 50 80 80 100 T 130 100" fill="none" stroke="#A3113E" strokeWidth="3" />
                  <text x="75" y="125" fontSize="10" fill="#A3113E" textAnchor="middle">L_1 (Laut)</text>

                  {/* Reflexion */}
                  <path d="M 130 70 Q 100 50 70 70" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
                  
                  {/* Transmission (Empfänger) */}
                  <path d="M 220 80 Q 250 70 280 80 T 330 80" fill="none" stroke="#475569" strokeWidth="1.5" />
                  <text x="275" y="105" fontSize="10" fill="#475569" textAnchor="middle">L_2 (Leise)</text>

                  {/* Pfeil Transmission */}
                  <path d="M 130 80 L 220 80" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-schall)" />

                  <defs>
                    <marker id="arrow-schall" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Auftreffender Schall (L_1) versetzt die Wand in Schwingung. Ein Teil wird reflektiert, ein Teil absorbiert und ein Teil transmittiert (L_2). Je schwerer die Wand (m'), desto geringer die Schwingung und Transmission.
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main mb-4">Schichtkennwerte</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-home-grau/30">
                      <th className="py-2 px-2 font-bold text-text-main">Schicht</th>
                      <th className="py-2 px-2 font-bold text-text-main">d (m)</th>
                      <th className="py-2 px-2 font-bold text-text-main"><FormulaText text="ρ (kg/m³)" /></th>
                      <th className="py-2 px-2 font-bold text-text-main"><FormulaText text="m' (kg/m²)" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {resolvedLayers.map((layer, idx) => (
                      <tr key={layer.id} className="border-b border-home-grau/10">
                        <td className="py-2 px-2 text-text-main">{idx + 1}. {layer.name}</td>
                        <td className="py-2 px-2">{formatDeZahl(layer.d, 3)}</td>
                        <td className="py-2 px-2">{formatDeWert(layer.density)}</td>
                        <td className="py-2 px-2 font-medium">{formatDeZahl((layer.d * layer.density), 1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <ModuleFooter 
        wikipedia={[
          { title: 'Schallschutz', url: 'https://de.wikipedia.org/wiki/Schallschutz' }
        ]}
        regelwerke={[
          { title: 'DIN 4109-1: Schallschutz im Hochbau - Mindestanforderungen', url: 'https://www.dinmedia.de/de/suche?q=DIN+4109-1' },
          { title: 'DIN 4109-32: Schallschutz im Hochbau - Daten für rechnerische Nachweise (Massivbau)', url: 'https://www.dinmedia.de/de/suche?q=DIN+4109-32' },
          { title: 'DIN 4109-34: Schallschutz im Hochbau - Daten für rechnerische Nachweise (Vorsatzkonstruktionen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+4109-34' }
        ]}
        literatur={[
          'Willems, W. M. et al.: Lehrbuch der Bauphysik (2017)',
          'Lutz, P. et al.: Lehrbuch der Bauphysik (2013)'
        ]}
        formeln={[
          {
            formel: "R_w = 30{,}9 \\cdot \\log_{10}(m'/1) - 22{,}2",
            erklaerung: "Berechnung des bewerteten Schalldämm-Maßes R_w in dB für einschalige massive Bauteile nach DIN 4109-32 (gültig für 65 ≤ m' ≤ 720 kg/m²).\nR_w: bewertetes Schalldämm-Maß [dB]\nm': flächenbezogene Masse [kg/m²]",
            quelle: 'DIN 4109-32'
          },
          {
            formel: "R_w \\approx 37{,}5 \\cdot \\log_{10}(m') - 42",
            erklaerung: "Historische Näherungsformel für das Schalldämm-Maß einschaliger Bauteile nach DIN 4109 Bbl. 1:1989 (abgelöst durch DIN 4109-32).\nm': flächenbezogene Masse [kg/m²]",
            quelle: 'DIN 4109 Bbl. 1:1989 (historisch)'
          }
        ]}
      />
    </div>
  );
}
