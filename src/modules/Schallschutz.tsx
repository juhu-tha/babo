import { formatDeZahl, formatDeWert, formatDeTeX, formatDeTeXWert } from '@/src/utils/numberFormat';
import { Volume2, Footprints } from 'lucide-react';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { rwMassiv, schalldaemmung } from '@/src/calc/schall';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
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
import inhalt from '@/content/schallschutz/Schallschutz.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

// Reiter Trittschall (Z24) als eigener Chunk
const TrittschallTab = React.lazy(() => import('./schallschutz/TrittschallTab'));

const REITER = [
  { id: 'luftschall', label: 'Luftschall', icon: Volume2 },
  { id: 'trittschall', label: 'Trittschall', icon: Footprints },
] as const;

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
  { id: 'innenputz_gips', name: inhalt.werte.gipsputzInnen, density: 1000 },
  { id: 'innenputz_kalk', name: inhalt.werte.kalkputzInnen, density: 1400 },
  { id: 'aussenputz_zement', name: inhalt.werte.zementputzAußen, density: 1800 },
  { id: 'mauerwerk_ziegel_hochloch', name: inhalt.werte.hochlochziegelHlz, density: 800 },
  { id: 'mauerwerk_ziegel_voll', name: inhalt.werte.vollziegelMz, density: 1800 },
  { id: 'mauerwerk_kalksandstein', name: inhalt.werte.kalksandsteinKs, density: 2000 },
  { id: 'mauerwerk_porenbeton', name: inhalt.werte.porenbetonPb, density: 400 },
  { id: 'beton_normal', name: inhalt.werte.normalbetonStahlbeton, density: 2400 },
  { id: 'beton_leicht', name: 'Leichtbeton', density: 1200 },
  { id: 'daemmung_eps', name: inhalt.werte.epsPolystyrolPartikelschaum, density: 20 },
  { id: 'daemmung_xps', name: inhalt.werte.xpsPolystyrolExtruderschaum, density: 35 },
  { id: 'daemmung_miwo', name: inhalt.werte.mineralwolleMiwo, density: 50 },
  { id: 'daemmung_holzfaser', name: 'Holzfaserplatte', density: 160 },
  { id: 'daemmung_pur', name: inhalt.werte.purPirHartschaum, density: 30 },
  inhalt.daten["materialLibrary.holz_fichte"],
  { id: 'holz_eiche', name: inhalt.werte.eicheVollholz, density: 700 },
  { id: 'platte_osb', name: 'OSB-Platte', density: 600 },
  { id: 'platte_gipskarton', name: inhalt.werte.gipskartonplatteGkb, density: 800 },
  { id: 'stahl', name: 'Stahl', density: 7850 },
  { id: 'aluminium', name: 'Aluminium', density: 2700 },
  { id: 'glas', name: 'Glas', density: 2500 },
];

export default function Schallschutz() {
  const [activeTab, setActiveTab] = useState<'luftschall' | 'trittschall'>('luftschall');
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
    // Flächenbezogene Masse und R_w nach DIN 4109-32 aus dem Rechenkern src/calc/schall.ts
    const sd = schalldaemmung(resolvedLayers.map(l => ({ name: l.name, d: l.d, density: l.density })));
    const m_prime = sd.gueltig ? sd.mStrich : 0;
    const Rw = sd.gueltig ? Math.max(0, sd.Rw) : 0;
    const isValidRange = m_prime >= 65 && m_prime <= 720;

    // Chart Data
    const chartData = [];
    for (let m = 50; m <= 1000; m += 50) {
      chartData.push({ x: m, y: Math.max(10, rwMassiv(m)) });
    }

    return {
      m_prime,
      Rw,
      isValidRange,
      hinweise: sd.hinweise.filter(x => x.feld !== 'm'),
      chartData: {
        datasets: [
          {
            label: inhalt.werte.schalldämmMaßRW,
            data: chartData,
            borderColor: '#64748b',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            fill: true,
            pointRadius: 0,
          },
          {
            label: inhalt.werte.aktuellesBauteil,
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

  const updateLayer = (id: string, field: keyof (typeof layers)[number], value: string | number) => {
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
      <ModuleTabs label="Bereiche Schallschutz" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6">
      {activeTab === 'trittschall' && (
        <React.Suspense fallback={<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shiraz"></div></div>}>
          <TrittschallTab />
        </React.Suspense>
      )}
      {activeTab === 'luftschall' && (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
          <Volume2 className="text-shiraz" /><MdText text={inhalt.texte.bauphysikSchallschutz} /><InfoTooltip text={inhalt.werte.berechnungDesBewertetenSchalldämm} />
        </h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
          <p><MdText text={inhalt.texte.derSchallschutzVonEinschaligen} /><FormulaText text="m'" /><MdText text={inhalt.texte.abJeSchwererDas} /></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Bauteilaufbau</h3>
                <button 
                  onClick={addLayer}
                  className="text-xs bg-shiraz text-white px-3 py-1.5 rounded-lg hover:bg-shiraz/90 transition-colors flex items-center gap-1"
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
                        <div className="flex items-center gap-2"><label className="text-xs text-home-grau block mb-1">Material</label><InfoTooltip text={inhalt.werte.auswahlDesZuUntersuchenden} /></div>
                        <select aria-label="Material" 
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
                        <div className="flex items-center gap-2"><label className="text-xs text-home-grau block mb-1">Dicke d (m)</label><InfoTooltip text={inhalt.werte.dickeDerBauteilschichtIn} /></div>
                        <input aria-label="Dicke d (m)" 
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

            <div className="bg-off-white border border-home-grau/30 text-text-main p-6 rounded-xl shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Ergebnisse</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-slate-600 text-sm mb-1 flex items-center gap-1">
                    <FormulaText text={inhalt.werte.flächenbezogeneMasseM} />
                  </div>
                  <div className="text-3xl font-bold">{formatDeZahl(schallData.m_prime, 1)} <span className="text-lg font-normal">kg/m²</span></div>
                </div>
                <div>
                  <div className="text-slate-600 text-sm mb-1 flex items-center gap-1">
                    <FormulaText text={inhalt.werte.schalldämmMaßRW2} />
                    <InfoTooltip text={inhalt.werte.berechnetNachDin4109} />
                  </div>
                  <div className="text-3xl font-bold">{formatDeZahl(schallData.Rw, 1)} <span className="text-lg font-normal">dB</span></div>
                </div>
              </div>

              <EingabeHinweise hinweise={schallData.hinweise} />
              {!schallData.isValidRange && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs"><MdText text={inhalt.texte.gültigkeitsbereichBeachtenDieFormel} />{formatDeZahl(schallData.m_prime, 1)} kg/m²).
                </div>
              )}

              <div className="mt-4 bg-white p-3 rounded-lg border border-home-grau/30 text-xs space-y-1.5 leading-relaxed">
                <p><MdText text={inhalt.texte.berechnungsgrundlageDin410932} /><FormulaText text="R_w = 30{,}9 \cdot \log_{10}(m'/1) - 22{,}2 \text{ dB}" /><MdText text={inhalt.texte.fürEinschaligeMassiveBauteile} /></p>
                <p className="text-slate-600"><MdText text={inhalt.texte.hinweisZuDämmschichtenDämmschichten} /></p>
              </div>
            </div>

            {/* Live-Rechenweg (AP 3.7) mit dem aktuellen Schichtaufbau */}
            <FormulaDerivationBox
              live
              kurzzeile={kurzzeile(ansageWert('flächenbezogene Masse', schallData.m_prime, 1, 'kg/m²'), ansageWert('Schalldämmmaß R_w', schallData.Rw, 1, 'dB'), !schallData.isValidRange && 'außerhalb des Gültigkeitsbereichs')}
              title={inhalt.werte.ihrRechenwegSchalldämmMaß}
              zielGleichung="R_w = 30{,}9 \cdot \lg\left(\frac{m'}{1\,\text{kg/m}^2}\right) - 22{,}2\,\text{dB}"
              schritte={[
                {
                  titel: inhalt.werte.flächenbezogeneMasseJeSchicht,
                  erklaerung: inhalt.werte.dickeDInM,
                  formel: `m' = \\sum d_i \\cdot \\rho_i = ${resolvedLayers.map(l => `${formatDeTeXWert(l.d)} \\cdot ${formatDeTeX(l.density, 0)}`).join(' + ') || '0'}`
                },
                {
                  titel: 'Summe',
                  erklaerung: schallData.isValidRange
                    ? inhalt.werte.derWertLiegtIm
                    : inhalt.werte.achtungDerWertLiegt,
                  formel: `m' = ${formatDeTeX(schallData.m_prime, 1)}\\,\\text{kg/m}^2`
                },
                {
                  titel: inhalt.werte.logarithmusDerMasse,
                  erklaerung: inhalt.werte.bezogenAufM1,
                  formel: `\\lg(${formatDeTeX(schallData.m_prime, 1)}) = ${formatDeTeX(schallData.m_prime > 0 ? Math.log10(schallData.m_prime) : NaN, 3)}`
                },
                {
                  titel: inhalt.werte.bewertetesSchalldämmMaß,
                  erklaerung: inhalt.werte.einsetzenInDieMassekurve,
                  formel: `R_w = 30{,}9 \\cdot ${formatDeTeX(schallData.m_prime > 0 ? Math.log10(schallData.m_prime) : NaN, 3)} - 22{,}2 = ${formatDeTeX(schallData.Rw, 1)}\\,\\text{dB}`
                }
              ]}
              ergebnisHinweis={inhalt.werte.leichteDämmUndHolzschichten}
              normQuelle={inhalt.werte.din4109322016}
            />
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[400px]">
              <h3 className="text-lg font-bold text-text-main mb-4"><MdText text={inhalt.texte.schalldämmMaßNachMassegesetz} /></h3>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={schallData.chartData} 
                  options={{
                    responsive: true, 
                    maintainAspectRatio: false,
                    scales: {
                      x: { type: 'linear', title: { display: true, text: inhalt.werte.flächenbezogeneMasseMKg } },
                      y: { title: { display: true, text: 'R_w (dB)' } }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungSchalldämmung} /></h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg role="img" aria-label="Schematische Darstellung: Schalldämmung" width="100%" height="160" viewBox="0 0 350 160">
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
                <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.auftreffenderSchallL1} /></div>
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
      )}
      </ModuleTabs>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1WohnungstrennwandAus}
        zielGleichung="R_w = 30{,}9 \cdot \lg\left(\frac{m'}{1\,\text{kg/m}^2}\right) - 22{,}2\,\text{dB}"
        schritte={inhalt.daten["Schallschutz.schritte"]}
        ergebnisHinweis={inhalt.werte.dieAbschätzungVonR}
        normQuelle={inhalt.werte.din410912018}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2LeichtesMauerwerk}
        zielGleichung="\Delta R_w = 30{,}9 \cdot \lg 2 = 9{,}3\,\text{dB}"
        schritte={inhalt.daten["Schallschutz.schritte_2"]}
        ergebnisHinweis={inhalt.werte.leichteLochsteineEignenSich}
        normQuelle={inhalt.werte.din41093220162}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="schallschutz" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap6}
        wikipedia={[
          { title: 'Schallschutz', url: 'https://de.wikipedia.org/wiki/Schallschutz' }
        ]}
        regelwerke={inhalt.daten["Schallschutz.regelwerke"]}
        literatur={inhalt.daten["Schallschutz.literatur"]}
        formeln={inhalt.daten["Schallschutz.formeln"]}
        weblinks={inhalt.daten["Schallschutz.weblinks"]}
      />
    </div>
  );
}
