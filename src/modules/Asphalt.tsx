import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { 
  Layers, 
  ThermometerSun, 
  BookOpen, 
  ShieldAlert, 
  Gauge, 
  TrendingDown, 
  Wind, 
  Flame, 
  Trash2, 
  Info,
  CheckCircle2, 
  AlertTriangle,
  FileText,
  HardHat,
  Clock,
  Sparkles
} from 'lucide-react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Asphalt() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'grundlagen' | 'arten' | 'eigenschaften' | 'nta'>('steckbrief');
  const [bitumen, setBitumen] = useState(5.0); // M.-%
  const [hohlraum, setHohlraum] = useState(3.0); // Vol.-%
  const [rhoG, setRhoG] = useState(2.65); // g/cm³
  const [rhoB, setRhoB] = useState(1.03); // g/cm³

  // Niedrigtemperaturasphalt (LTA/NTA) states
  const [ltaMethod, setLtaMethod] = useState<'organic' | 'zeolite' | 'foamed' | 'standard'>('organic');
  const [ltaTemp, setLtaTemp] = useState<number>(125); // Celsius
  const [ltaRecyclingShare, setLtaRecyclingShare] = useState<number>(30); // %

  const results = useMemo(() => {
    // Raumdichte (Bulk density)
    // 100g Asphalt = bitumen g Bitumen + (100-bitumen) g Gestein
    const volGestein = (100 - bitumen) / rhoG;
    const volBitumen = bitumen / rhoB;
    const volFest = volGestein + volBitumen;
    
    // Hohlraum = V_Luft / V_Gesamt * 100
    // V_Gesamt = V_Fest / (1 - hohlraum/100)
    const volGesamt = volFest / (1 - hohlraum / 100);
    const raumdichte = 100 / volGesamt; // g/cm³
    
    // Marshall-Stabilität (Mock-Wert basierend auf Bitumengehalt)
    // Optimaler Bitumengehalt oft bei ~5-6%
    const optimalBitumen = 5.5;
    const diff = Math.abs(bitumen - optimalBitumen);
    const marshall = Math.max(2, 12 - diff * 2); // kN

    const labels = [];
    const marshallData = [];
    const currentPointData = [];

    for (let b = 2; b <= 10; b += 0.5) {
      labels.push(b.toFixed(1));
      const currentDiff = Math.abs(b - optimalBitumen);
      const currentMarshall = Math.max(2, 12 - currentDiff * 2);
      marshallData.push(currentMarshall);
      if (Math.abs(b - bitumen) < 0.25) {
        currentPointData.push(marshall);
      } else {
        currentPointData.push(null);
      }
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Marshall-Stabilität [kN]',
          data: marshallData,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Aktueller Wert',
          data: currentPointData,
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        }
      ]
    };

    return { raumdichte, marshall, chartData };
  }, [bitumen, hohlraum, rhoG, rhoB]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        title: { display: true, text: 'Bitumengehalt [M.-%]', font: { weight: 'bold' as const } }
      },
      y: {
        title: { display: true, text: 'Marshall-Stabilität [kN]', font: { weight: 'bold' as const } },
        min: 0,
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Asphalt & Bitumen
        </h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Asphalt ist ein viskoelastisches Mehrphasengemisch aus dem Bindemittel Bitumen und Gesteinskörnungen. Dieses Modul behandelt die Klassifizierung, thermo-mechanischen Eigenschaften und normative Prüfungen im Straßenbau.
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
            <Layers size={16} /> Grundlagen &amp; Zusammensetzung
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'arten' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('arten')}
          >
            <Layers size={16} /> Asphaltarten
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'eigenschaften' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('eigenschaften')}
          >
            <Layers size={16} /> Material- &amp; Produkteigenschaften
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'nta' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('nta')}
          >
            <ThermometerSun size={16} /> Niedrigtemperaturasphalte (NTA)
          </button>
        </div>

        {activeTab === 'grundlagen' && (
          <>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
              <p>
                Asphalt ist ein Gemisch aus Bitumen und Gesteinskörnungen. Das viskoelastische Verhalten von Bitumen macht Asphalt stark temperatur- und belastungszeitabhängig.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                  <Slider label="Bitumengehalt" info="Massenanteil des Bitumens im Asphaltgemisch." min={2} max={10} step={0.1} value={bitumen} unit="M.-%" onChange={(e) => setBitumen(Number(e.target.value))} />
                  <div className="mt-4"><Slider label="Hohlraumgehalt"  min={1} max={10} step={0.5} value={hohlraum} unit="Vol.-%" onChange={(e) => setHohlraum(Number(e.target.value))} /></div>
                  <div className="mt-4"><Slider label="Dichte Gestein" info="Rohdichte der verwendeten Gesteinskörnung." min={2.5} max={3.0} step={0.05} value={rhoG} unit="g/cm³" onChange={(e) => setRhoG(Number(e.target.value))} /></div>
                  <div className="mt-4"><Slider label="Dichte Bitumen"  min={1.0} max={1.1} step={0.01} value={rhoB} unit="g/cm³" onChange={(e) => setRhoB(Number(e.target.value))} /></div>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="bg-shiraz text-white p-6 rounded-xl shadow-md">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Ergebnisse</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><div className="text-white/70 text-sm">Raumdichte</div><div className="text-3xl font-bold">{formatDeZahl(results.raumdichte, 3)} g/cm³</div></div>
                    <div><div className="text-white/70 text-sm">Marshall-Stabilität (geschätzt)</div><div className="text-3xl font-bold">{formatDeZahl(results.marshall, 1)} kN</div></div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-home-grau/30 h-[300px] flex flex-col">
                  <h3 className="text-sm font-bold text-center mb-2">Marshall-Stabilität vs. Bitumengehalt</h3>
                  <div className="flex-1 relative">
                    <Line data={results.chartData} options={chartOptions as any} />
                  </div>
                </div>

                {/* Schematische Darstellung */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
                  <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Asphaltzusammensetzung</h3>
                  <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                    <svg width="100%" height="160" viewBox="0 0 350 160">
                      {/* Gesteinskörnung */}
                      <path d="M 100 80 Q 110 60 130 70 T 150 90 T 120 110 Z" fill="#94a3b8" />
                      <path d="M 160 50 Q 180 40 200 60 T 180 80 T 150 70 Z" fill="#64748b" />
                      <path d="M 210 70 Q 230 60 250 80 T 230 110 T 200 90 Z" fill="#94a3b8" />
                      <path d="M 140 100 Q 160 90 180 110 T 160 130 T 130 120 Z" fill="#475569" />
                      <path d="M 180 110 Q 200 100 220 120 T 200 140 T 170 130 Z" fill="#64748b" />
                      
                      {/* Bitumen (Bindemittel) */}
                      <path d="M 130 70 Q 150 80 160 50 Q 150 60 130 70 Z" fill="#1e293b" />
                      <path d="M 150 90 Q 180 80 200 60 Q 180 70 150 90 Z" fill="#1e293b" />
                      <path d="M 180 110 Q 200 90 210 70 Q 200 80 180 110 Z" fill="#1e293b" />
                      <path d="M 120 110 Q 140 100 150 90 Q 140 110 120 110 Z" fill="#1e293b" />
                      <path d="M 160 130 Q 180 110 200 120 Q 180 130 160 130 Z" fill="#1e293b" />

                      {/* Hohlräume */}
                      <circle cx="145" cy="80" r="4" fill="#ffffff" />
                      <circle cx="190" cy="70" r="5" fill="#ffffff" />
                      <circle cx="170" cy="100" r="3" fill="#ffffff" />
                      <circle cx="210" cy="95" r="4" fill="#ffffff" />

                      {/* Legende */}
                      <rect x="20" y="20" width="15" height="15" fill="#64748b" />
                      <text x="45" y="32" fontSize="10" fill="#1e293b">Gestein</text>
                      
                      <rect x="20" y="45" width="15" height="15" fill="#1e293b" />
                      <text x="45" y="57" fontSize="10" fill="#1e293b">Bitumen</text>
                      
                      <rect x="20" y="70" width="15" height="15" fill="#ffffff" stroke="#cbd5e1" />
                      <text x="45" y="82" fontSize="10" fill="#1e293b">Hohlraum</text>
                    </svg>
                    <div className="text-xs text-text-main/70 text-center mt-2">
                      Asphalt ist ein 3-Phasen-System: Gesteinskörnung (Stützgerüst), Bitumen (Bindemittel) und luftgefüllte Hohlräume. Das Verhältnis dieser Phasen bestimmt maßgeblich die Eigenschaften (z.B. Marshall-Stabilität).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'arten' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <p>
                <strong>Asphaltarten (Asphaltmischgüter):</strong> Im Straßenbau werden verschiedene Asphalte für unterschiedliche Schichten und Belastungen eingesetzt. Sie unterscheiden sich primär durch die Gesteinskörnungskurve, den Bindemittelgehalt und den Hohlraumgehalt. Typische Schichten eines Straßenoberbaus sind Tragschicht, Binderschicht und Deckschicht.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asphaltbeton */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-stone-500 flex flex-col h-full">
                <div className="mb-3">
                  <h3 className="font-bold text-text-main text-lg">Asphaltbeton (AC)</h3>
                  <p className="text-xs text-text-main/70">Asphalt Concrete</p>
                </div>
                <p className="text-sm text-gray-700 mb-4 flex-1">
                  Der Standard-Asphalt. Er zeichnet sich durch eine stetige Sieblinie aus ("haufwerksporig"), das heißt, es sind alle Korngrößen gleichmäßig vertreten. Das führt zu einem dichten Gefüge.
                </p>
                <div className="text-xs text-gray-600 bg-stone-50 p-3 rounded-lg border border-home-grau/30">
                  <strong>Einsatz:</strong> Für Trag-, Binder- und Deckschichten bei normaler bis mittlerer Verkehrsbelastung. Einbau erfolgt durch Walzverdichtung.
                </div>
              </div>

              {/* Splittmastixasphalt */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-shiraz flex flex-col h-full">
                <div className="mb-3">
                  <h3 className="font-bold text-text-main text-lg">Splittmastixasphalt (SMA)</h3>
                  <p className="text-xs text-text-main/70">Stone Mastic Asphalt</p>
                </div>
                <p className="text-sm text-gray-700 mb-4 flex-1">
                  Besitzt ein grobes, hohlraumreiches Splittgerüst (Ausfallkörnung), dessen Hohlräume fast vollständig mit einem stützenden Mörtel (Mastix: aus Bitumen, Gesteinsmehl und stabilisierenden Zusätzen wie Zellulosefasern) gefüllt sind.
                </p>
                <div className="text-xs text-gray-600 bg-stone-50 p-3 rounded-lg border border-home-grau/30">
                  <strong>Einsatz:</strong> Deckschichten bei hoher bis sehr hoher Verkehrsbeanspruchung (z.B. Autobahnen). Sehr standfest und verformungsresistent (Spurrinnen).
                </div>
              </div>

              {/* Gussasphalt */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-amber-600 flex flex-col h-full">
                <div className="mb-3">
                  <h3 className="font-bold text-text-main text-lg">Gussasphalt (MA)</h3>
                  <p className="text-xs text-text-main/70">Mastic Asphalt</p>
                </div>
                <p className="text-sm text-gray-700 mb-4 flex-1">
                  Ein hohlraumfreier und wasserdichter Asphalt, der so viel Bitumen und Füller enthält, dass das Gemisch bei Verarbeitungstemperatur (ca. 230°C) gieß- und streichbar ist. Er wird nicht verdichtet (gewalzt), sondern nur glattgestrichen.
                </p>
                <div className="text-xs text-gray-600 bg-stone-50 p-3 rounded-lg border border-home-grau/30">
                  <strong>Einsatz:</strong> Brückenbeläge, Parkdecks, hochbelastete innerstädtische Bereiche und als Estrich im Hochbau. Sehr langlebig.
                </div>
              </div>

              {/* Offenporiger Asphalt */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-blue-500 flex flex-col h-full">
                <div className="mb-3">
                  <h3 className="font-bold text-text-main text-lg">Offenporiger Asphalt (OPA)</h3>
                  <p className="text-xs text-text-main/70">Flüsterasphalt</p>
                </div>
                <p className="text-sm text-gray-700 mb-4 flex-1">
                  Ein Asphalt mit sehr hohem zusammenhängenden Hohlraumgehalt (über 20%). Das Splittgerüst wird oft durch polymermodifiziertes Bitumen verklebt. Das Wasser kann abfließen (Drainage) und Schallwellen werden absorbiert.
                </p>
                <div className="text-xs text-gray-600 bg-stone-50 p-3 rounded-lg border border-home-grau/30">
                  <strong>Einsatz:</strong> Lärmminderung auf schnell befahrenen Strecken (Autobahnen). Reduziert Reifengeräusche und Gischt, hat aber eine geringere Lebensdauer.
                </div>
              </div>
            </div>
            
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 mt-2">
               <h3 className="font-bold text-text-main mb-3">Schichtaufbau (Klassisch)</h3>
               <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-home-grau/30">
                 <div className="relative pl-10">
                   <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold border-4 border-off-white z-10">1</div>
                   <div className="bg-white p-3 rounded-lg border border-home-grau/30 shadow-sm">
                     <div className="font-bold text-sm">Deckschicht (z.B. SMA oder AC D)</div>
                     <div className="text-xs text-gray-600">ca. 2-5 cm. Nimmt die direkten Verkehrslasten auf, sorgt für Griffigkeit und Lärmminderung.</div>
                   </div>
                 </div>
                 <div className="relative pl-10">
                   <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center text-white text-xs font-bold border-4 border-off-white z-10">2</div>
                   <div className="bg-white p-3 rounded-lg border border-home-grau/30 shadow-sm">
                     <div className="font-bold text-sm">Binderschicht (z.B. AC B)</div>
                     <div className="text-xs text-gray-600">ca. 4-10 cm. Aufnahme und Verteilung der Scherkräfte, Ausgleich von Unebenheiten. In der Regel erst bei höheren Belastungsklassen vorhanden.</div>
                   </div>
                 </div>
                 <div className="relative pl-10">
                   <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-800 text-xs font-bold border-4 border-off-white z-10">3</div>
                   <div className="bg-white p-3 rounded-lg border border-home-grau/30 shadow-sm">
                     <div className="font-bold text-sm">Tragschicht (z.B. AC T)</div>
                     <div className="text-xs text-gray-600">ca. 8-20+ cm. Größte Dicke, Lastabtragung in den Untergrund, frostsicher eingebaut.</div>
                   </div>
                 </div>
               </div>
            </div>
            
          </div>
        )}

        {activeTab === 'eigenschaften' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                <strong>Material- und Produkteigenschaften:</strong> Asphalt ist ein viskoelastisches Material, dessen Eigenschaften stark von der Temperatur und der Belastungsdauer abhängen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Viskoelastizität</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Das Verformungsverhalten von Asphalt setzt sich aus elastischen (reversiblen) und viskosen (irreversiblen) Anteilen zusammen.
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li><strong>Hohe Temperaturen / lange Belastung:</strong> Viskoses Verhalten dominiert (Gefahr von Spurrinnen).</li>
                  <li><strong>Tiefe Temperaturen / kurze Belastung:</strong> Elastisches Verhalten dominiert (Gefahr von Kälterissen).</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Ermüdungswiderstand</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Unter wiederholter Verkehrsbelastung entstehen Mikrorisse im Bitumen, die sich zu Makrorissen verbinden können (Ermüdungsrisse).
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li>Abhängig vom Bindemittelgehalt und der Hohlraumstruktur.</li>
                  <li>Polymermodifizierte Bitumen (PmB) verbessern den Ermüdungswiderstand deutlich.</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Verformungswiderstand</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Der Widerstand gegen bleibende Verformungen (Spurrinnenbildung) bei hohen sommerlichen Temperaturen.
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li>Wird durch eine standfeste Gesteinsstruktur (Korngerüst) erreicht.</li>
                  <li>Harte Bitumensorten oder PmB erhöhen den Verformungswiderstand.</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Griffigkeit & Lärmminderung</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Oberflächeneigenschaften der Deckschicht, die für die Verkehrssicherheit und den Lärmschutz entscheidend sind.
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li><strong>Griffigkeit:</strong> Hängt von der Rauheit der Gesteinskörnung ab (Polierwiderstand).</li>
                  <li><strong>Lärmminderung:</strong> Offenporige Asphalte (OPA) absorbieren Schall durch ihren hohen Hohlraumgehalt (ca. 20-25%).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nta' && (() => {
          // Dynamic calculation model for LTA/NTA
          // Viscosity curve calculation (Pa·s)
          let viscosity = 0.4 * Math.pow(1.06, 165 - ltaTemp);
          if (ltaMethod === 'organic') {
            if (ltaTemp >= 110) {
              viscosity *= 0.38; // Wax melting lubrication effect
            }
          } else if (ltaMethod === 'zeolite') {
            if (ltaTemp >= 105) {
              viscosity *= 0.52; // Synthetic steam foaming effect
            }
          } else if (ltaMethod === 'foamed') {
            if (ltaTemp >= 105) {
              viscosity *= 0.48; // Micro-foaming expansion effect
            }
          }

          // Workability & Compactor rating
          let ratingColor = "bg-green-50 text-green-800 border-green-200";
          let ratingBadge = "Optimal verarbeitbar";
          let ratingText = "Viskosität im idealen Bereich (0,2–1,8 Pa·s). Standard-Baurichtlinien für Walzverdichtung problemlos einhaltbar.";
          
          if (viscosity > 4.5) {
            ratingColor = "bg-red-50 text-red-800 border-red-200";
            ratingBadge = "Ungenügend / Kritischer Grenzstopp";
            ratingText = "Bindemittel ist viel zu zäh (> 4,5 Pa·s). Rascher Temperatursturz, mangelhafter Schichtenverbund, hohes Risiko von Frostschäden und Hohlstellen.";
          } else if (viscosity > 1.8) {
            ratingColor = "bg-amber-50 text-amber-800 border-amber-200";
            ratingBadge = "Erschwert verdichtbar (Grenzbereich)";
            ratingText = "Erhöhter Scherwiderstand. Erfordert sofortigen Einsatz schwerer Walzen (statisch prallebend), dichte Abschnitte oder angepasste Einbaugeschwindigkeiten.";
          }

          // Fumes & Aerosols calculation of bitumen (Exponential Arrhenius-like scale)
          // Threshold of 1.5 mg/m³ is new German legal limit (TRGS 900 AGW-Grenzwert)
          const fumesValue = 0.045 * Math.exp(0.029 * ltaTemp);
          const fumesPctOfLimit = Math.round((fumesValue / 1.5) * 100);
          const fumesReduction = ltaTemp >= 165 ? 0 : Math.round((1 - (fumesValue / (0.045 * Math.exp(0.029 * 165)))) * 100);

          // Energy Savings Calc
          const baseEnergy = 88; // kWh per ton of asphalt mixed at 165°C (approx 9L fuel oil)
          const energyConsumed = baseEnergy * (1 + (ltaTemp - 165) * 0.0102); // ~1% change per degree
          const energySavedPercent = Math.max(0, Math.round(((baseEnergy - energyConsumed) / baseEnergy) * 100));
          const fuelSavedLiters = Math.max(0, (baseEnergy - energyConsumed) / 10); // 1L ~ 10kWh

          // CO2 emissions calculation with recycling benefits
          const baseCo2 = 22.0; // kg CO2-equivalent per ton of standard hot mix asphalt
          const co2FromEnergy = baseCo2 * (energyConsumed / baseEnergy);
          // Recycling share substitution offsets (gravel and primary bitumen raw extraction, approx 0.14 kg CO2 per % share)
          const totalCo2 = Math.max(3.5, co2FromEnergy - (ltaRecyclingShare * 0.13));
          const co2SavedPercent = Math.max(0, Math.round(((baseCo2 - totalCo2) / baseCo2) * 100));

          // Compaction Time Window Calculation (minutes)
          // Standard Newton-cooling model from initial temp down to method's limit temp
          let limitTemp = 130; // standard cold compaction limit
          if (ltaMethod === 'organic') limitTemp = 85; // wax lowers the plasticity point
          else if (ltaMethod === 'zeolite') limitTemp = 95;
          else if (ltaMethod === 'foamed') limitTemp = 90;

          let coolingWindow = 0;
          if (ltaTemp > limitTemp) {
            // Ambient temperature of 15°C
            const logRatio = Math.log((ltaTemp - 15) / (limitTemp - 15));
            // Layer thickness of 4cm assumed (factor ~38)
            coolingWindow = Math.round(38 * logRatio);
          }

          return (
            <div className="flex flex-col gap-8 animate-in fade-in duration-300">
              
              {/* Introduction Banner */}
              <div className="bg-gradient-to-r from-stone-900 to-slate-800 text-white p-6 rounded-2xl border border-stone-800 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1 max-w-2xl">
                  <span className="text-shiraz font-mono text-xs tracking-wider uppercase font-semibold">Technologie-Fokus</span>
                  <h3 className="text-xl font-bold tracking-tight">Nachhaltiger Verkehrswegebau: Niedrigtemperaturasphalt (NTA)</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Niedrigtemperaturasphalt (auch temperaturabgesenkter Asphalt, vgl. FGSV-Merkblatt M TA) stellt durch anwendungsspezifische Absenkung der Herstelltemperatur um bis zu 40 °C einen Schlüsselpfeiler für Klimaresistenz, CO₂-Minderung und wirksamen Arbeitsschutz (Einhaltung des neuen TRGS 900 Grenzwerts von 1,5 mg/m³ für Bitumen-Dämpfe) dar.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg border border-white/20 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-mono tracking-wide text-stone-300">Neue Richtlinie</span>
                  <span className="text-lg font-bold text-white font-mono">1,5 mg/m³</span>
                  <span className="text-[9px] text-stone-400">Arbeitsplatzgrenzwert (AGW)</span>
                </div>
              </div>

              {/* TWO COLUMN INTERACTIVE SIMULATOR CARD */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* COLUMN 1: CONTROL PANEL (5 Cols) */}
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-5">
                  <div className="border-b border-home-grau/20 pb-3">
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-text-main flex items-center gap-1.5 font-mono">
                      <Flame size={16} className="text-shiraz" /> 1. Parameter-Steuerung
                    </h4>
                    <p className="text-[11px] text-text-main/60 mt-0.5">Definiere Rezeptur und Verarbeitungstemperatur</p>
                  </div>

                  {/* Method Selection Cards */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-bold text-text-main">Absenkungs-Verfahren / Zusatzmittel</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setLtaMethod('standard'); setLtaTemp(160); }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                          ltaMethod === 'standard' 
                            ? 'bg-stone-50 border-stone-800 ring-1 ring-stone-800' 
                            : 'bg-white border-home-grau/20 hover:bg-stone-50'
                        }`}
                      >
                        <span className="font-bold text-xs text-text-main">A. Standard Heißmix</span>
                        <span className="text-[10px] text-text-main/50 font-mono">Ohne Additive (145-180°C)</span>
                      </button>

                      <button
                        onClick={() => { setLtaMethod('organic'); setLtaTemp(125); }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                          ltaMethod === 'organic' 
                            ? 'bg-shiraz/5 border-shiraz ring-1 ring-shiraz' 
                            : 'bg-white border-home-grau/20 hover:bg-shiraz/5'
                        }`}
                      >
                        <span className="font-bold text-xs text-shiraz flex items-center gap-1">
                          B. Organische Wachse <Sparkles size={11} />
                        </span>
                        <span className="text-[10px] text-text-main/50 font-mono">Fischer-Tropsch / Montan</span>
                      </button>

                      <button
                        onClick={() => { setLtaMethod('zeolite'); setLtaTemp(130); }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                          ltaMethod === 'zeolite' 
                            ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600' 
                            : 'bg-white border-home-grau/20 hover:bg-blue-50'
                        }`}
                      >
                        <span className="font-bold text-xs text-blue-800">C. Mineralische Zeolithe</span>
                        <span className="text-[10px] text-text-main/50 font-mono">Mikro-Siede-Aufschäumung</span>
                      </button>

                      <button
                        onClick={() => { setLtaMethod('foamed'); setLtaTemp(120); }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                          ltaMethod === 'foamed' 
                            ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600' 
                            : 'bg-white border-home-grau/20 hover:bg-amber-50'
                        }`}
                      >
                        <span className="font-bold text-xs text-amber-800">D. Schaumbitumen</span>
                        <span className="text-[10px] text-text-main/50 font-mono">Wasserinjektion im Werk</span>
                      </button>
                    </div>
                  </div>

                  {/* Temperature Slider */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30">
                    <Slider 
                      label="Verarbeitungstemperatur (°C)" 
                      info="Die Ist-Mischguttemperatur beim Austritt aus der Mischtrommel bzw. beim Beginn des Walzens auf der Baustelle." 
                      min={100} 
                      max={180} 
                      step={5} 
                      value={ltaTemp} 
                      unit="°C" 
                      onChange={(e) => setLtaTemp(Number(e.target.value))} 
                    />
                    
                    <div className="mt-3 flex justify-between items-center text-[10px] font-mono text-text-main/60 border-t border-home-grau/20 pt-2">
                      <span className={ltaTemp < 115 ? "text-red-600 font-bold" : ""}>110°C: NTA-Untergrenze</span>
                      <span className="text-stone-400">|</span>
                      <span>140°C: NTA-Obergrenze</span>
                      <span className="text-stone-400">|</span>
                      <span className={ltaTemp >= 150 ? "text-amber-700 font-semibold" : ""}>160°C: Standard Heißmix</span>
                    </div>
                  </div>

                  {/* Recycling Share Slider */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30">
                    <Slider 
                      label="Asphaltgranulat-Anteil (RC)" 
                      info="Prozentualer Gewichtsanteil von recyceltem Fräsasphalt im Kreislaufmischgut. Höhere Anteile erfordern materialspezifische Vorheizung zur Vermeidung von Bindemittelalterung." 
                      min={0} 
                      max={60} 
                      step={5} 
                      value={ltaRecyclingShare} 
                      unit="%" 
                      onChange={(e) => setLtaRecyclingShare(Number(e.target.value))} 
                    />
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-text-main/60">
                      <Trash2 size={11} className="text-shiraz" />
                      <span>{ltaRecyclingShare > 40 ? "Hoher Recyclinganteil: NTA verhindert schädliche Re-Oxidation des Altbitumens." : "Mittelgroßer Recyclinganteil im Regelkreis."}</span>
                    </div>
                  </div>

                  {/* Ecological Footprint Equivalent Estimate */}
                  <div className="bg-emerald-50 text-emerald-800 p-4.5 rounded-xl border border-emerald-200">
                    <h5 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-900 mb-1">
                      <TrendingDown size={14} /> Ressourcen-Einsparung (pro 1.000 t Asphalt)
                    </h5>
                    <p className="text-[11px] text-emerald-800/90 leading-relaxed mb-3">
                      Durch die Absenkung der Massetemperatur und des Primärbitumeneinsatzes (via Recycling) werden folgende Umweltentlastungen simuliert:
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-1.5">
                      <div className="bg-white/80 p-2.5 rounded-lg text-center border border-emerald-200">
                        <div className="text-[9px] uppercase font-mono text-emerald-900/60">Heizöleinsparung</div>
                        <div className="text-sm font-extrabold text-emerald-950">{formatDeZahl((fuelSavedLiters * 100), 0)} L</div>
                        <div className="text-[9px] text-emerald-700 font-medium">Brennerbrennstoff</div>
                      </div>
                      <div className="bg-white/80 p-2.5 rounded-lg text-center border border-emerald-200">
                        <div className="text-[9px] uppercase font-mono text-emerald-900/60">CO₂ vermieden</div>
                        <div className="text-sm font-extrabold text-emerald-950">{((baseCo2 - totalCo2) * 1000).toLocaleString('de-DE')} kg</div>
                        <div className="text-[9px] text-emerald-700 font-medium">Treibhausgas-Equivalent</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: COCKPIT / METRICS / REAL-TIME LAB (7 Cols) */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-5">
                  <div className="border-b border-home-grau/20 pb-3">
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-text-main flex items-center gap-1.5 font-mono">
                      <Gauge size={16} className="text-shiraz" /> 2. Virtuelle Prüfstands-Auswertung
                    </h4>
                    <p className="text-[11px] text-text-main/60 mt-0.5">Analytische Messwerte basierend auf rheologischen Modellen</p>
                  </div>

                  {/* Indicator A: Viscosity / Compactability */}
                  <div className="bg-off-white p-4.5 rounded-xl border border-home-grau/30 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <Gauge size={14} className="text-text-main/60" />
                        <span className="text-xs font-bold text-text-main">Viskosität des Bindemittels (Rheologie)</span>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-home-grau/30 text-text-main">
                        {formatDeZahl(viscosity, 2)} Pa·s
                      </span>
                    </div>

                    {/* Simple Custom Color Gauge bar */}
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-blue-400 h-full" style={{ width: '15%' }} title="Niedrigviskos (> 0,2 Pa.s)"></div>
                      <div className="bg-green-500 h-full" style={{ width: '35%' }} title="Idealbereich (0,2–1,8 Pa.s)"></div>
                      <div className="bg-amber-500 h-full" style={{ width: '25%' }} title="Erschwert verdichtbar (1,8–4,5 Pa.s)"></div>
                      <div className="bg-red-500 h-full" style={{ width: '25%' }} title="Verarbeitbarkeit blockiert (> 4,5 Pa.s)"></div>
                    </div>

                    {/* Indicator pin overlay position based on viscosity */}
                    <div className="relative w-full h-1">
                      {/* Calculate percentage location on scale */}
                      {(() => {
                        let pct = (viscosity / 6) * 100;
                        if (pct > 99) pct = 99;
                        if (pct < 1) pct = 1;
                        return (
                          <div 
                            className="absolute -top-3.5 -translate-x-1/2 flex flex-col items-center transition-all duration-300" 
                            style={{ left: `${pct}%` }}
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-text-main border-2 border-white shadow-sm"></div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Feasibility Alert Box */}
                    <div className={`p-3 rounded-lg border text-xs leading-relaxed flex gap-2 items-start transition-colors duration-300 ${ratingColor}`}>
                      <div className="mt-0.5">
                        {viscosity > 4.5 ? (
                          <ShieldAlert size={14} className="text-red-700 animate-pulse" />
                        ) : viscosity > 1.8 ? (
                          <AlertTriangle size={14} className="text-amber-700" />
                        ) : (
                          <CheckCircle2 size={14} className="text-green-700" />
                        )}
                      </div>
                      <div>
                        <div className="font-extrabold uppercase tracking-wide text-[10px] mb-0.5">{ratingBadge}</div>
                        <div>{ratingText}</div>
                      </div>
                    </div>
                  </div>

                  {/* Indicator B: Workplace Exposure / Aerosols vs TRGS 900 Grenzwert */}
                  <div className="bg-off-white p-4.5 rounded-xl border border-home-grau/30 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <Wind size={14} className="text-text-main/60" />
                        <span className="text-xs font-bold text-text-main flex items-center gap-1">
                          Aerosol- &amp; Dampfkonzentration (Arbeitsplatzluft)
                        </span>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        fumesValue > 1.5 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {formatDeZahl(fumesValue, 2)} mg/m³
                      </span>
                    </div>

                    {/* Progress indicator representing exposure compared to law limit (1.5 mg/m³) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-text-main/60">
                        <span>Minimale Freisetzung</span>
                        <span className="text-red-600 font-bold flex items-center gap-0.5">
                          <AlertTriangle size={10} /> AGW-Limit: 1,5 mg/m³
                        </span>
                      </div>
                      <div className="relative w-full bg-stone-200 h-4 rounded overflow-hidden">
                        {/* 100% boundary of the element is 3.0 mg/m³ for visual scale */}
                        <div 
                          className={`h-full transition-all duration-500 ${fumesValue > 1.5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, (fumesValue / 3.0) * 100)}%` }}
                        ></div>
                        {/* Red divider indicating the 1.5 limit at 50% */}
                        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-red-600 z-10"></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] leading-relaxed">
                      <span className="text-text-main/70">
                        {fumesValue > 1.5 ? (
                          <span className="text-red-700 font-semibold">Grenzwertexzedierung! Zusätzliche Absaugung o. Atemschutz zwingend erforderlich.</span>
                        ) : (
                          <span className="text-green-700 font-semibold">AGW-Konform. Keine Atemschutzpflicht, exzellentes Schützergebnis am Fertiger.</span>
                        )}
                      </span>
                      {fumesReduction > 0 && (
                        <span className="text-xs font-extrabold text-emerald-800 shrink-0 font-mono">
                          -{formatDeWert(fumesReduction)}% Aerosole
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Indicator C & D Grid: Energy saving vs CO2 reduction */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Energy Progress panel */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between gap-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-text-main">
                        <Flame size={13} className="text-text-main/50" />
                        <span>Mischwerk-Energieverbrauch</span>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-text-main font-mono">
                          {formatDeZahl(energyConsumed, 1)} <span className="text-xs text-text-main/50">kWh/t</span>
                        </div>
                        <div className="text-[10px] text-text-main/60">Standard: 88,0 kWh/t</div>
                      </div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-shiraz h-full" style={{ width: `${(energyConsumed / baseEnergy) * 100}%` }}></div>
                      </div>
                      <div className="text-[11px] text-emerald-800 font-extrabold flex items-center gap-1">
                        <CheckCircle2 size={11} /> {formatDeWert(energySavedPercent)}% Energie eingespart!
                      </div>
                    </div>

                    {/* CO2 Progress panel */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between gap-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-text-main">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>CO₂-Emissionsbilanz</span>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-text-main font-mono">
                          {formatDeZahl(totalCo2, 1)} <span className="text-xs text-text-main/50">kg/t</span>
                        </div>
                        <div className="text-[10px] text-text-main/60">Standard: 22,0 kg/t</div>
                      </div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full" style={{ width: `${(totalCo2 / baseCo2) * 100}%` }}></div>
                      </div>
                      <div className="text-[11px] text-emerald-800 font-extrabold flex items-center gap-1">
                        <CheckCircle2 size={11} /> {formatDeWert(co2SavedPercent)}% Carbon Footprint gespart!
                      </div>
                    </div>
                  </div>

                  {/* Cool down compaction window */}
                  <div className="bg-amber-50/40 border border-amber-200/60 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500/10 p-2 rounded-lg text-amber-700">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h5 className="text-xs font-extrabold text-amber-800 uppercase tracking-wide">Berechnetes Zeitfenster für Walzverdichtung</h5>
                        <p className="text-[11px] text-text-main/70">Dauer ab Abkippen auf dem Planum bis zum Erreichen der Grenztemperatur</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-amber-900 font-mono">{formatDeWert(coolingWindow)} Min.</span>
                      <div className="text-[9px] text-amber-700/80 uppercase font-mono tracking-wider">Compaction Window</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* DETAILED ACADEMIC CORE KNOWLEDGE SECTIONS ( Herstellung, Einbau, MAK, Herausforderungen ) */}
              <div className="flex flex-col gap-6">
                
                <h3 className="text-base font-black text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2 mt-4 uppercase tracking-wider font-mono">
                  <BookOpen size={18} className="text-shiraz" /> Systemanalyse &amp; Vertiefungswissen
                </h3>

                {/* Grid for 4 Core Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Section 1: Herstellung */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-3">
                      <div className="bg-shiraz/10 text-shiraz p-2 rounded-xl">
                        <Flame size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-sm">1. Mischanlagentechnik &amp; Herstellung im Werk</h4>
                        <p className="text-[10px] text-text-main/50 uppercase tracking-widest font-mono">Werksprozess &amp; Dosierung</p>
                      </div>
                    </div>

                    <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
                      <p>
                        Die Absenkung der Massetemperatur im Asphaltmischwerk erfordert verfahrenstechnische Anpassungen, da die Gesteinskörnungen im konventionellen Prozess als Hauptwärmeträger dienen (Erhitzung auf ca. 170–190 °C).
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-text-main/70 pl-1">
                        <li>
                          <strong>Brennersteuerung &amp; Trockentrommel:</strong> Da die Trommeltemperatur reduziert wird, besteht die Gefahr, dass die unvollständige Verbrennung von Schwer- oder Leichtölen zu Rußbildung und Rückständen führt. Das Flammenprofil des Mischwerkbrenners muss daher penibel auf das niedrigere Saugzugvolumen eingeregelt werden.
                        </li>
                        <li>
                          <strong>Dosierung von Additiven:</strong> 
                          <ul className="list-circle list-inside pl-4 mt-1 space-y-1">
                            <li><em>Wachse (z.B. Sasobit):</em> Werden gravimetrisch als Granulat direkt in den Heißmischbehälter dosiert, schmelzen augenblicklich im Heißbitumen und verteilen sich hocheffizient.</li>
                            <li><em>Eindüsung von Schaumbitumen:</em> Wasser wird dosiert mit Druckluft (5–8 bar) über Spezial-Injektordüsen in den strömenden Heißbitumenstrom eingespritzt (0,5–2.0 Gew.-% Wasseranteil). Dies führt zu schlagartiger Expansion (Faktor 15–20) und erzeugt hochporösen Feinschaum.</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Kreislaufmaterial (Asphaltgranulat-Zugabe):</strong> Bei hohen RC-Zugabequoten (z.B. 40–60 %) verhindert die Temperaturabsenkung im Werk eine schädliche Überhitzung (Verkrustung) und thermische Alterung (Zerstörung des Asphalten/Malten-Verhältnisses) des Altbitumens, wodurch die Dehnungsfähigkeit im eingebauten Zustand geschont wird.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Section 2: Einbau */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-3">
                      <div className="bg-blue-600/10 text-blue-700 p-2 rounded-xl">
                        <Layers size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-sm">2. Einbauverfahren &amp; Walzverdichtung</h4>
                        <p className="text-[10px] text-text-main/50 uppercase tracking-widest font-mono">Baustellenpraxis &amp; Kinetik</p>
                      </div>
                    </div>

                    <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
                      <p>
                        Auf der Baustelle verhält sich temperaturabgesenkter Asphalt rheologisch anders. Durch die verminderte Ausgangswärme ist das Risiko von Temperatur-Entmischungen (Cold Spots) während des Transports erhöht.
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-text-main/70 pl-1">
                        <li>
                          <strong>Transportlogistik:</strong> Die Verwendung vollisolierter LKW-Transportmulden (Thermomulden mit Abdeckplane nach ZTV-Asphalt) ist bei NTA zwingend vorgeschrieben, um eine Randschichtabkühlung unter 110 °C vor dem Abkippen zu verhindern.
                        </li>
                        <li>
                          <strong>Kritisches Verdichtungszeitfenster:</strong> Wachsmodifizierte Bindemittel besitzen einen scharf abgegrenzten Erstarrungspunkt. Oberhalb dieses Punktes (z.B. &gt; 105 °C) ist der Verdichtungswiderstand extrem klein, der Asphalt fast selbstverdichtend. Fällt die Temperatur unter den Wachskristallisationspunkt, blockiert das Gesteinsgerüst schlagartig (Scherfestigkeit steigt rapide an). Ein weiteres Walzen ist dann nutzlos und erzeugt Gefügerisse.
                        </li>
                        <li>
                          <strong>Walzenstrategie:</strong> Der Schwerpunkt der Verdichtung (Vorwalzen) muss unmittelbar hinter dem Fertigerbohlen-Austritt erfolgen (statisch schwere Glattradwalzen). Vibrationswalzen sollten ausschließlich im Heißbereich eingesetzt werden, um Kornzertrümmerungen auszuschließen.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Section 3: MAK / AGW */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-3">
                      <div className="bg-emerald-600/10 text-emerald-700 p-2 rounded-xl">
                        <HardHat size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-sm">3. Arbeitsschutz, Gesundheit &amp; MAK/AGW Gesetzgebung</h4>
                        <p className="text-[10px] text-text-main/50 uppercase tracking-widest font-mono">TRGS 900 Grenzwert &amp; Toxikologie</p>
                      </div>
                    </div>

                    <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
                      <p>
                        Bitumen setzt bei Erhitzung über 150 °C an der Baustelle Aerosole und Dämpfe frei, die kondensierbare polyzyklische aromatische Kohlenwasserstoffe (PAK) und flüchtige organische Verbindungen (VOC) enthalten.
                      </p>
                      <div className="bg-emerald-50 text-emerald-950 p-3 rounded-lg border border-emerald-200 text-[11px] font-medium leading-relaxed">
                        <strong>Der neue AGW-Wert (Arbeitsplatzgrenzwert):</strong> Gemäß TRGS 900 (Technische Regeln für Gefahrstoffe) gilt in Deutschland seit 2025 ein strikter Höchstwert von <strong>1,5 mg/m³</strong> für Dämpfe und Aerosole aus Bitumen bei der Heißverarbeitung. Klassischer Asphaltbeton überschreitet diesen im Bohlenbereich des Fertigers ohne Absauganlage fast immer.
                      </div>
                      <ul className="list-disc list-inside space-y-2 text-text-main/70 pl-1">
                        <li>
                          <strong>Exponentielle Absenkung:</strong> Die Dampf- und Aerosolfreisetzung von Bitumen unterliegt einer thermodynamischen Arrhenius-Abhängigkeit. Eine Absenkung der Mischguttemperatur um nur 20–30 °C bewirkt eine Reduktion der toxischen Immissionen um ca. 60–80 Prozent.
                        </li>
                        <li>
                          <strong>Arbeitsplatzvorteile:</strong> Das Einbautageteam leidet an heißen Sommertagen deutlich seltener unter hitzebedingter Kreislaufbelastung, Augenreizungen und Hustenreiz. Zudem verbessert die Entlastung von Rauchgasschleiern die Sicht und mindert Unfallrisiken am Straßenfertiger signifikant.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Section 4: Challenges */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-3">
                      <div className="bg-amber-600/10 text-amber-700 p-2 rounded-xl">
                        <ShieldAlert size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-sm">4. Technische Herausforderungen &amp; Schadensbilder</h4>
                        <p className="text-[10px] text-text-main/50 uppercase tracking-widest font-mono">Schadensbilder &amp; Risikominderung</p>
                      </div>
                    </div>

                    <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
                      <p>
                        Trotz aller ökologischen und gesundheitlichen Vorzüge hat LTA technologische Hürden, die bei falschem Anlagendesign zu Frühschäden führen können:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-text-main/70 pl-1">
                        <li>
                          <strong>Restfeuchte und Stripping (Haftungsverlust):</strong> Da die Gesteinskörnung im Trockner nur auf ca. 120–130 °C erhitzt wird, verdampft das in den Gesteinsporen tief sitzende Haftwasser möglicherweise nicht vollständig. Aufsteigender Restwasserdampf kondensiert im heißen Bitumenfilm und stört die Adhäsion zwischen Bitumen und Gestein (Stripping-Anfälligkeit). Die Folge sind erhebliche Kornausbrüche (Frostaufbrüche) nach dem ersten Winter.
                        </li>
                        <li>
                          <strong>Verzögerte Anfangsstärke (Rutting-Gefahr):</strong> Verkehrsfreigabe: Auch LTA darf erst nach ausreichender Abkühlung des Belags freigegeben werden. Wachsmodifizierte Bindemittel erstarren bereits bei ca. 90–105 °C und erhöhen danach den Verformungswiderstand; bei chemischen Additiven und Schaumbitumen ist das Verformungsverhalten dagegen mit dem von Standardasphalt vergleichbar.. Wird eine Straße zu früh für den Schwerlastverkehr freigegeben, können die noch nicht vollständig formstabilen Kristallgitter verdrückt werden, was zu gravierenden Oberflächenverformungen (Spurrillen) führt.
                        </li>
                        <li>
                          <strong>Zusatzkosten &amp; Amortisation:</strong> Organische Additive verteuern die Materialrezeptur um ca. 5,50 bis 9.00 EUR pro Tonne Asphalt. Diese Differenz muss durch die Brennstoffeinsparung im Mischwerk (Heizöl/Erdgas) und die geringeren Verschleißkosten der Gießaggregate aufgewogen werden. Treiber sind der Arbeitsplatzgrenzwert für Dämpfe und Aerosole aus Bitumen (1,5 mg/m³, TRGS 900) sowie Vorgaben öffentlicher Auftraggeber nach M TA.
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Comparative Overview Card */}
                <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30 mt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#A3113E] mb-3 flex items-center gap-1">
                    <FileText size={14} /> Richtlinienkonformer Einbau (ZTV Asphalt-StB / M TA)
                  </h4>
                  <div className="overflow-x-auto text-[11px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-home-grau/30 text-text-main/70">
                          <th className="py-2 pr-4 font-bold">Kenngröße</th>
                          <th className="py-2 pr-4 font-bold">Standard Asphalt (AC Deck)</th>
                          <th className="py-2 pr-4 font-bold">Niedrigtemperaturasphalt (NTA)</th>
                          <th className="py-2 font-bold">Verfahrenstechnischer Vorteil</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-home-grau/10 text-text-main/80">
                        <tr>
                          <td className="py-2.5 pr-4 font-semibold text-text-main">Herstelltemperatur</td>
                          <td className="py-2.5 pr-4">160 °C bis 180 °C</td>
                          <td className="py-2.5 pr-4 text-emerald-800 font-medium">115 °C bis 135 °C</td>
                          <td className="py-2.5">Sparsamerer Brennerbetrieb, verringertes Treibhauspotenzial</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-4 font-semibold text-text-main">Viskosität bei Einbau</td>
                          <td className="py-2.5 pr-4">0,4 – 0,8 Pa·s</td>
                          <td className="py-2.5 pr-4 text-emerald-800 font-medium">0,6 – 1,4 Pa·s (Wachsverdünnt)</td>
                          <td className="py-2.5">Gleichwertige Verarbeitbarkeit trotz verringerter Hitze</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-4 font-semibold text-text-main">Zulässiger Lufttemperaturbereich</td>
                          <td className="py-2.5 pr-4">&gt; 5 °C (ZTV Asphalt-StB)</td>
                          <td className="py-2.5 pr-4 text-amber-700 font-medium">&gt; 10 °C (Kritische Auskühlung!)</td>
                          <td className="py-2.5">LTA ist wind- und kälteempfindlicher während des Einbaus</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-4 font-semibold text-text-main">Haftverhalten zum Gestein</td>
                          <td className="py-2.5 pr-4">Hervorragend (Keine Porenfeuchte)</td>
                          <td className="py-2.5 pr-4 text-amber-700 font-medium">Adhäsionsrisiken durch Restfeuchte</td>
                          <td className="py-2.5">Haftmittel (Spezial-Silane/Amine) mindern Ablösungen ab</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-4 font-semibold text-text-main">Bitumenalterung (Oxidation)</td>
                          <td className="py-2.5 pr-4">Hoch (starke Kurzzeit-Alterung)</td>
                          <td className="py-2.5 pr-4 text-emerald-800 font-medium">Sehr gering (Schutz des Binders)</td>
                          <td className="py-2.5">Längere Ermüdungslebensdauer und Rissfreiheit der Tragschichten</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          );
        })()}
      </div>

      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300">
          <BaustoffProfil materialKey="asphalt" />
        </div>
      )}
    
      <ModuleFooter 
        wikipedia={[
          { title: 'Asphalt', url: 'https://de.wikipedia.org/wiki/Asphalt' },
          { title: 'Niedrigtemperaturasphalt', url: 'https://de.wikipedia.org/wiki/Niedrigtemperaturasphalt' }
        ]}
        literatur={[
          'Velske, S.; Mentlein, H. (2013): Straßenbautechnik (7. Auflage, Werner Verlag)',
          'Schulze, K. (2011): Asphalt im Straßenbau - Baustoffliche Grundlagen, Bemessung und Qualitätssicherung (2. Auflage, Ernst & Sohn)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'ZTV Asphalt-StB 07/13:2013 (FGSV: Zusätzliche Technische Vertragsbedingungen und Richtlinien für den Bau von Verkehrsflächenbefestigungen aus Asphalt)', url: 'https://www.fgsv-verlag.de/' },
          { title: 'DIN EN 13108-1:2016-12 (Asphaltmischgut - Mischgutanforderungen - Teil 1: Asphaltbeton)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+13108-1' },
          { title: 'DIN EN 12591:2015-11 (Bitumen und bitumenhaltige Bindemittel - Anforderungen an Straßenbaubitumen)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+12591' },
          { title: 'DIN EN 14023:2010-09 (Bitumen und bitumenhaltige Bindemittel - Rahmenwerk für die Spezifikation von polymermodifizierten Bitumen)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+14023' },
          { title: 'DIN EN 12697-8:2019-04 (Asphalt - Prüfverfahren - Teil 8: Bestimmung des Hohlraumgehaltes von Asphalt-Probekörpern)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+12697-8' },
          { title: 'DIN EN 12697-34:2020-07 (Asphalt - Prüfverfahren - Teil 34: Marshall-Prüfung)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+12697-34' },
          { title: 'RStO 12 (FGSV Ausgabe 2012 / Fassung 2024: Richtlinien für die Standardisierung des Oberbaues von Verkehrsflächen, eingeführt mit ARS Nr. 02/2024)', url: 'https://www.fgsv-verlag.de/' }
        ]}
        formeln={[
          {
            formel: 'V_{\\text{Hohlraum}} = \\frac{\\rho_d - \\rho_b}{\\rho_d} \\cdot 100\\%',
            erklaerung: 'Hohlraumgehalt des Asphaltprobekörpers (Marshall-Probekörper) in Volumenprozent. Berechnet sich aus der theoretischen Raumdichte \\rho_d (vollkommen hohlraumfrei) und der tatsächlichen Rohdichte \\rho_b des verdichteten Mischguts.',
            quelle: 'DIN EN 12697-8:2019-04'
          },
          {
            formel: 'MQ = \\frac{S}{F}',
            erklaerung: 'Marshall-Quotient in kN/mm. Quotient aus der maximalen Marshall-Stabilität S (Bruchlast bei 60°C Warmwasserlagerung) und dem zugehörigen Fließweg F. Ist ein Indikator für den Verformungswiderstand des Asphalts unter Reifenlasten.',
            quelle: 'DIN EN 12697-34:2020-07'
          },
          {
            formel: 'VFB = \\frac{V_B}{V_B + V_{\\text{void}}} \\cdot 100\\%',
            erklaerung: 'Hohlraumfüllungsgrad (VFB - Voids Filled with Binder) in Prozent. Gibt das prozentuale Verhältnis des Bindemittelvolumens V_B zum Gesamtporenvolumen des Mineralstoffgerüsts an und beschreibt die Dauerhaftigkeit und Flexibilität.',
            quelle: 'DIN EN 13108-1:2016-12'
          }
        ]}
      />

</div>
  );
}
