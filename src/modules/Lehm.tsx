import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { BookOpen } from 'lucide-react';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
function Pie({ data, options }: any) {
  return (
    <div className="text-center font-semibold text-xs text-stone-650 bg-stone-100 p-2 rounded-xl">
      Zusammensetzungsdiagramm
      <div className="flex gap-2 justify-center mt-2 text-[10px] font-normal">
        <span className="flex items-center gap-1">🟢 Ton: {formatDeZahl(data.datasets[0].data[0], 1)}%</span>
        <span className="flex items-center gap-1">🟡 Schluff: {formatDeZahl(data.datasets[0].data[1], 1)}%</span>
        <span className="flex items-center gap-1">🟠 Sand/Kies: {formatDeZahl(data.datasets[0].data[2], 1)}%</span>
      </div>
    </div>
  );
}
// Fix and replace standard chart.js Pie import to prevent compile issues on node.js

export default function Lehm() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'bemessung' | 'steckbrief' | 'bentonit'>('steckbrief');
  const [ton, setTon] = useState(15);
  const [schluff, setSchluff] = useState(35);
  const [sand, setSand] = useState(50);
  const [wasser, setWasser] = useState(12);

  // Normalize percentages
  const total = ton + schluff + sand;
  const tonNorm = (ton / total) * 100;
  const schluffNorm = (schluff / total) * 100;
  const sandNorm = (sand / total) * 100;

  const results = useMemo(() => {
    // Schätzwerte für Stampflehm
    const rohdichte = 1700 + sandNorm * 5 - tonNorm * 2; // kg/m³
    const druckfestigkeit = 1.0 + (tonNorm / 100) * 3.0 - (wasser / 100) * 2.0; // MPa
    const schwinden = (tonNorm / 100) * 4.0 + (wasser / 100) * 2.0; // %
    const lambda = 0.15 + 0.0004 * Math.max(1200, rohdichte); // W/(mK)
    const sorption = tonNorm * 0.8; // g/m² (vereinfachte Sorptionsfähigkeit)

    return { 
      rohdichte: Math.max(1200, rohdichte), 
      druckfestigkeit: Math.max(0.5, druckfestigkeit), 
      schwinden: Math.max(0.1, schwinden),
      lambda: lambda,
      sorption: sorption
    };
  }, [tonNorm, sandNorm, wasser]);

  const chartData = useMemo(() => {
    return {
      labels: ['Ton', 'Schluff', 'Sand/Kies'],
      datasets: [
        {
          data: [tonNorm, schluffNorm, sandNorm],
          backgroundColor: [
            '#8B4513', // SaddleBrown for Ton
            '#D2B48C', // Tan for Schluff
            '#F4A460', // SandyBrown for Sand
          ],
          borderColor: [
            '#ffffff',
            '#ffffff',
            '#ffffff',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [tonNorm, schluffNorm, sandNorm]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${formatDeZahl(context.parsed, 1)}%`;
          }
        }
      }
    },
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main">Lehmbau (Stampflehm)</h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Lehm ist einer der ältesten und ökologischsten Baustoffe der Menschheit. Er zeichnet sich durch hervorragende Feuchtigkeitsregulierung, hohe thermische Trägheit und vollständige, emissionsfreie Kreislauffähigkeit aus.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
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
            Grundlagen &amp; Zusammensetzung
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'bemessung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('bemessung')}
          >
            Bemessung (neue Norm)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'bentonit' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('bentonit')}
          >
            💦 Bentonit (Tonmineral)
          </button>
        </div>

        {activeTab === 'grundlagen' && (
          <div className="animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
              <p>
                Lehm ist ein ökologischer Baustoff, der reversibel aushärtet. Er reguliert die Raumfeuchte hervorragend, ist aber wasserempfindlich und weist geringere Festigkeiten auf.
              </p>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <Slider label="Tonanteil (Bindemittel)" info="Anteil an Ton im Lehmgemisch." min={5} max={40} step={1} value={ton} unit="Teile" onChange={(e) => setTon(Number(e.target.value))} />
              <div className="mt-4"><Slider label="Schluffanteil"  min={10} max={60} step={1} value={schluff} unit="Teile" onChange={(e) => setSchluff(Number(e.target.value))} /></div>
              <div className="mt-4"><Slider label="Sand/Kies-Anteil" info="Anteil an Sand und Kies im Lehmgemisch." min={20} max={80} step={1} value={sand} unit="Teile" onChange={(e) => setSand(Number(e.target.value))} /></div>
              <div className="mt-4"><Slider label="Herstellfeuchte (Wassergehalt)"  min={5} max={25} step={1} value={wasser} unit="%" onChange={(e) => setWasser(Number(e.target.value))} /></div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-shiraz text-white p-6 rounded-xl shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Eigenschaften (grobe Schätzung – Lehrmodell, keine Normwerte)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1"><div className="text-white/70 text-sm">Trockenrohdichte</div><div className="text-2xl font-bold">{formatDeZahl(results.rohdichte, 0)} kg/m³</div></div>
                <div className="col-span-2 sm:col-span-1"><div className="text-white/70 text-sm">Druckfestigkeit</div><div className="text-2xl font-bold">{formatDeZahl(results.druckfestigkeit, 1)} MPa</div></div>
                <div className="col-span-2 sm:col-span-1"><div className="text-white/70 text-sm">Lineares Schwindmaß</div><div className="text-2xl font-bold">{formatDeZahl(results.schwinden, 1)} %</div></div>
                <div className="col-span-2 sm:col-span-1"><div className="text-white/70 text-sm">Wärmeleitfähigkeit <FormulaText text="\lambda" /></div><div className="text-2xl font-bold">{formatDeZahl(results.lambda, 2)} W/(mK)</div></div>
                <div className="col-span-2"><div className="text-white/70 text-sm">Sorptionsfähigkeit (Feuchtepuffer)</div><div className="text-2xl font-bold">{formatDeZahl(results.sorption, 1)} g/m²</div></div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Zusammensetzung</h3>
              <div className="h-[250px] w-full flex justify-center">
                <div className="w-[250px] h-[250px]">
                  <Pie data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Lehmstruktur</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="160" viewBox="0 0 450 160">
                  {/* Sand/Kies (Gerüst) */}
                  <circle cx="100" cy="80" r="30" fill="#F4A460" stroke="#d97706" strokeWidth="2" />
                  <circle cx="170" cy="60" r="25" fill="#F4A460" stroke="#d97706" strokeWidth="2" />
                  <circle cx="150" cy="120" r="20" fill="#F4A460" stroke="#d97706" strokeWidth="2" />
                  <circle cx="220" cy="90" r="35" fill="#F4A460" stroke="#d97706" strokeWidth="2" />
                  <circle cx="280" cy="50" r="20" fill="#F4A460" stroke="#d97706" strokeWidth="2" />
                  <circle cx="300" cy="110" r="25" fill="#F4A460" stroke="#d97706" strokeWidth="2" />
                  
                  {/* Schluff (Füller) */}
                  <circle cx="140" cy="85" r="8" fill="#D2B48C" />
                  <circle cx="190" cy="130" r="10" fill="#D2B48C" />
                  <circle cx="260" cy="85" r="7" fill="#D2B48C" />
                  <circle cx="200" cy="45" r="9" fill="#D2B48C" />
                  <circle cx="110" cy="125" r="6" fill="#D2B48C" />
                  <circle cx="330" cy="80" r="8" fill="#D2B48C" />

                  {/* Ton (Bindemittel) */}
                  <path d="M 120 60 Q 140 40 160 70 T 180 100 T 200 70 T 240 60 T 260 100 T 280 80" fill="none" stroke="#8B4513" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
                  <path d="M 100 110 Q 120 130 140 100 T 170 110 T 200 130 T 230 120 T 270 130 T 310 100" fill="none" stroke="#8B4513" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
                  <path d="M 130 80 Q 150 90 170 80 T 210 90 T 250 80 T 290 90" fill="none" stroke="#8B4513" strokeWidth="6" strokeLinecap="round" opacity="0.8" />

                  {/* Legende */}
                  <g transform="translate(350, 40)">
                    <circle cx="0" cy="0" r="6" fill="#F4A460" stroke="#d97706" />
                    <text x="15" y="4" fontSize="10" fill="#1e293b">Sand/Kies</text>
                    <circle cx="0" cy="20" r="6" fill="#D2B48C" />
                    <text x="15" y="24" fontSize="10" fill="#1e293b">Schluff</text>
                    <line x1="-6" y1="40" x2="6" y2="40" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
                    <text x="15" y="44" fontSize="10" fill="#1e293b">Ton (Binder)</text>
                  </g>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Sand und Kies bilden das tragende Gerüst. Schluff füllt die Hohlräume. Tonplättchen wirken als reversibles Bindemittel, das die Körner durch Kohäsionskräfte (bei Trocknung) zusammenhält.
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        )}

        {activeTab === 'bemessung' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                <strong>Bemessung nach neuer Norm (DIN 18940):</strong> Seit Erscheinen der DIN 18940 (2023-06) ist die lastabtragende Bemessung von Lehmsteinmauerwerk normiert (Anwendungsgrenzen, z. B. Gebäudeklasse: manuell prüfen). Sie orientiert sich stark an den Konzepten des klassischen Mauerwerksbaus (DIN EN 1996), berücksichtigt jedoch das spezifische feuchteabhängige Verhalten (Kriechen & Schwinden) sowie die geringeren Festigkeiten von Lehmbaustoffen.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-shiraz">Wesentliche Konzepte der DIN 18940</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/80">
                  <li><strong>Anwendungs- & Druckfestigkeitsklassen:</strong> Lehmsteine werden nach DIN 18945 in Anwendungsklassen nach Feuchtebeanspruchung (AK Ia, Ib, II, III) und Druckfestigkeitsklassen (2 – 2,5 – 3 – 4 – 5 – 6 N/mm² mittlerer Steindruckfestigkeit) eingeteilt. Die charakteristische Mauerwerksdruckfestigkeit fk ergibt sich nach DIN 18940 aus Steinklasse und Mörtel.</li>
                  <li><strong>Format & Mörtel:</strong> Die Tragfähigkeit hängt stark vom verwendeten Lehmmauermörtel und dem Überbindemaß ab.</li>
                  <li><strong>Schwinden & Setzung:</strong> Da Lehm bei Feuchteaufnahme quillt und beim Trocknen wieder schwindet, müssen Setzungsmaße für den Bauablauf rechnerisch berücksichtigt werden.</li>
                  <li><strong>Feuchteschutz:</strong> Konstruktiver Witterungsschutz (Dachüberstände, wasserresistente Sockelzonen z.B. aus Naturstein oder Beton) ist zwingend vorgeschrieben.</li>
                </ul>
              </div>

               <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-home-prim">Anwendungsbereiche</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li>Tragendes Mauerwerk bei ein- bis mehrgeschossigen Gebäuden (begrenzt bis GK 4 nach LBO).</li>
                  <li>Innentrennwände und Ausfachungen (z.B. bei Holzfachwerk).</li>
                  <li>Ausführung als Einsteinmauerwerk oder Verbandsmauerwerk.</li>
                  <li>Durch die Produktnormen DIN 18945–18948 und die Bemessungsnorm DIN 18940 (2023) ist tragendes Lehmsteinmauerwerk im Anwendungsbereich der Norm ohne Einzelfallgenehmigung möglich; andere Bauweisen (z. B. tragender Stampflehm) benötigen weiterhin vBG bzw. ZiE.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="lehmbau" />
          </div>
        )}

        {activeTab === 'bentonit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                <strong>Bentonit</strong> ist ein Tonmineralgemisch (hauptsächlich Montmorillonit), das durch die Verwitterung von vulkanischer Asche entstanden ist. Es gehört zu den mineralischen Baustoffen und zeichnet sich durch seine enorme Quellfähigkeit bei Wasserzugabe aus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Eigenschaften</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Quellvermögen:</strong> Kann ein Vielfaches seines Eigengewichts an Wasser aufnehmen und sein Volumen stark vergrößern (durch Schichteinlagerung von Wasser).</li>
                  <li><strong>Thixotropie:</strong> Bentonitsuspensionen verhalten sich in Ruhe wie ein Gel (fest) und unter mechanischer Beanspruchung (Rühren, Pumpen) wie eine Flüssigkeit.</li>
                  <li><strong>Dichtwirkung:</strong> Im gequollenen Zustand nahezu wasserundurchlässig.</li>
                  <li><strong>Kationenaustauschkapazität:</strong> Kann Schadstoffe binden.</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Anwendungen im Bauwesen</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Spezialtiefbau (Stützflüssigkeit):</strong> Stabilisierung von Bohr- und Schlitzwänden. Die thixotrope Flüssigkeit stützt die Erdwand und verhindert das Einstürzen, bevor Beton eingefüllt wird.</li>
                  <li><strong>Abdichtung (Weiße Wanne / Braune Wanne):</strong> Bentonitquellbänder zur Fugenabdichtung in Betonbauwerken. Bentonitmatten (Geosynthetische Tondichtungsbahnen - GTD) zur Flächenabdichtung.</li>
                  <li><strong>Deponiebau:</strong> Als mineralische Basisabdichtung zum Schutz des Grundwassers.</li>
                  <li><strong>Tunnelbau:</strong> Als Schmiermittel beim Rohrvortrieb oder als Stützmedium bei Schildvortriebsmaschinen (EPB/Slurry).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

      <ModulTest moduleId="lehm" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Lehmbau', url: 'https://de.wikipedia.org/wiki/Lehmbau' },
          { title: 'Stampflehm', url: 'https://de.wikipedia.org/wiki/Stampflehm' }
        ]}
        literatur={[
          'Minke, G.: Handbuch Lehmbau – Baustoffkunde, Techniken, Lehmarchitektur. Staufen: Ökobuch (Auflage manuell prüfen)',
          'Dachverband Lehm e. V. (Hrsg.): Lehmbau Regeln (3. Aufl., Vieweg+Teubner 2009)',
          'Wendehorst Baustoffkunde, 27. Auflage, Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN 18940:2023-06 (Tragendes Lehmsteinmauerwerk - Bemessung und Konstruktion)' },
          { title: 'DIN 18945:2024-03 (Lehmsteine - Anforderungen, Prüfung und Kennzeichnung)' },
          { title: 'DIN 18946:2024-03 (Lehmmauermörtel - Anforderungen, Prüfung und Kennzeichnung)' },
          { title: 'DIN 18947:2024-03 (Lehmputzmörtel - Anforderungen, Prüfung und Kennzeichnung)' },
          { title: 'DIN 18948:2024-03 (Lehmplatten - Anforderungen, Prüfung und Kennzeichnung)' }
        ]}
        formeln={[
          {
            formel: '\\epsilon_s = \\frac{L_{\\text{feucht}} - L_{\\text{trocken}}}{L_{\\text{feucht}}} \\cdot 100\\%',
            erklaerung: 'Lineares Schwindmaß beim physikalischen Trocknen des Lehms. Entsteht durch die Verringerung der Wasserfilme zwischen den feinsten Tonplättchen.',
            quelle: 'DIN 18945:2024-03'
          },
          {
            formel: '\\rho_d = \\frac{m_{\\text{trocken}}}{V_d}',
            erklaerung: 'Trockenrohdichte von Lehmbaustoffen. Ein Hauptindikator für Wärmeleitfähigkeit und Schallleitung.',
            quelle: 'DIN 18940:2023-06'
          }
        ]}
      />
    </div>
  );
}
