import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { formatDeZahl } from '@/src/utils/numberFormat';
import { Flame, Shield, Activity, Layers } from 'lucide-react';

export default function Brandschutz() {
  const [activeTab, setActiveTab] = useState<'baustoffklassen' | 'baulicher_brandschutz' | 'holzabbrand'>('baustoffklassen');
  
  const [dauer, setDauer] = useState(60); // min
  const [holzBreite, setHolzBreite] = useState(200); // mm
  const [holzHoehe, setHolzHoehe] = useState(400); // mm

  const results = useMemo(() => {
    // ISO-Normbrandkurve: T = 20 + 345 * log10(8 * t + 1)
    const tempIso = 20 + 345 * Math.log10(8 * dauer + 1);
    
    // Holzbalken Abbrand (ca. 0.7 mm/min für Nadelholz)
    const abbrandRate = 0.7; // mm/min
    const abbrandTiefe = abbrandRate * dauer;
    
    // Restquerschnitt (3-seitige Brandbeanspruchung angenommen)
    const restBreite = Math.max(0, holzBreite - 2 * abbrandTiefe);
    const restHoehe = Math.max(0, holzHoehe - abbrandTiefe);
    const restFlaeche = (restBreite * restHoehe) / (holzBreite * holzHoehe) * 100;

    const isoData = [];
    for (let t = 0; t <= 120; t += 5) {
      isoData.push({ x: t, y: 20 + 345 * Math.log10(8 * t + 1) });
    }

    return { 
      tempIso, abbrandTiefe, restBreite, restHoehe, restFlaeche,
      chartData: {
        datasets: [
          {
            label: 'ISO-Normbrandkurve (°C)',
            data: isoData,
            borderColor: '#A3113E',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            pointRadius: 0,
          },
          {
            label: 'Aktuelle Branddauer',
            data: [{ x: dauer, y: tempIso }],
            backgroundColor: '#1e293b',
            borderColor: '#1e293b',
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false,
          }
        ]
      }
    };
  }, [dauer, holzBreite, holzHoehe]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Flame className="text-shiraz" /> Brandschutz
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der Brandschutz gliedert sich in das Brandverhalten von Baustoffen (Baustoffklassen) und den baulichen Brandschutz von Bauteilen (Feuerwiderstandsdauer).
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'baustoffklassen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('baustoffklassen')}
          >
            <Layers size={16} /> Baustoffklassen
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'baulicher_brandschutz' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('baulicher_brandschutz')}
          >
            <Shield size={16} /> Baulicher Brandschutz
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'holzabbrand' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('holzabbrand')}
          >
            <Activity size={16} /> Holzabbrand (Simulation)
          </button>
        </div>
      </div>

      {activeTab === 'baustoffklassen' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-text-main mb-4">Brandverhalten von Baustoffen (Baustoffklassen)</h2>
          <div className="text-sm text-text-main/80 mb-6">
            Die Klassifizierung von Baustoffen beschreibt deren Beitrag zum Brandgeschehen (Entflammbarkeit, Rauchentwicklung, brennendes Abtropfen). In Deutschland gelten parallel die nationale Norm <strong>DIN 4102-1</strong> und die europäische Norm <strong>DIN EN 13501-1</strong>.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* DIN 4102-1 */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                <span className="bg-shiraz text-white px-2 py-1 rounded text-xs">National</span>
                DIN 4102-1
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-text-main border-b border-home-grau/30 pb-1 mb-2">A - Nichtbrennbare Baustoffe</h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2"><span className="font-bold w-8 text-shiraz">A1</span> <span>Ohne brennbare Bestandteile (z.B. Beton, Ziegel, Glas, Stahl)</span></li>
                    <li className="flex gap-2"><span className="font-bold w-8 text-shiraz">A2</span> <span>Mit geringen brennbaren Bestandteilen (z.B. Gipskartonplatten)</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-text-main border-b border-home-grau/30 pb-1 mb-2">B - Brennbare Baustoffe</h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2"><span className="font-bold w-8 text-orange-600">B1</span> <span>Schwerentflammbar (z.B. brandschutzbehandeltes Holz, HWL-Platten)</span></li>
                    <li className="flex gap-2"><span className="font-bold w-8 text-orange-500">B2</span> <span>Normalentflammbar (z.B. Holz ab best. Dicke, normale Kunststoffe)</span></li>
                    <li className="flex gap-2"><span className="font-bold w-8 text-red-600">B3</span> <span>Leichtentflammbar (z.B. Papier, Stroh - im Bauwesen unzulässig!)</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* DIN EN 13501-1 */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Europäisch</span>
                DIN EN 13501-1
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-text-main border-b border-home-grau/30 pb-1 mb-2">Hauptklassen</h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2"><span className="font-bold w-12 text-shiraz">A1, A2</span> <span>Nichtbrennbar</span></li>
                    <li className="flex gap-2"><span className="font-bold w-12 text-orange-600">B, C</span> <span>Schwerentflammbar</span></li>
                    <li className="flex gap-2"><span className="font-bold w-12 text-orange-500">D, E</span> <span>Normalentflammbar</span></li>
                    <li className="flex gap-2"><span className="font-bold w-12 text-red-600">F</span> <span>Leichtentflammbar</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-text-main border-b border-home-grau/30 pb-1 mb-2">Zusatzklassifizierungen</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium mb-1">Rauchentwicklung (s - smoke)</div>
                      <ul className="space-y-1 text-xs">
                        <li><span className="font-bold">s1:</span> Geringe Rauchentwicklung</li>
                        <li><span className="font-bold">s2:</span> Mittlere Rauchentwicklung</li>
                        <li><span className="font-bold">s3:</span> Hohe Rauchentwicklung</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Brennendes Abtropfen (d - droplets)</div>
                      <ul className="space-y-1 text-xs">
                        <li><span className="font-bold">d0:</span> Kein Abtropfen</li>
                        <li><span className="font-bold">d1:</span> Begrenztes Abtropfen</li>
                        <li><span className="font-bold">d2:</span> Starkes Abtropfen</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 text-xs bg-white p-3 rounded-lg border border-home-grau/30 flex items-center gap-2">
                    <span className="font-bold text-text-main">Beispiel:</span> 
                    <span className="font-mono bg-blue-50 text-blue-800 px-2 py-1 rounded font-bold">A2 - s1, d0</span> 
                    <span className="text-text-main/70">(Nichtbrennbar, kaum Rauch, kein Abtropfen)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'baulicher_brandschutz' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-text-main mb-4">Baulicher Brandschutz (Feuerwiderstandsdauer)</h2>
          <div className="text-sm text-text-main/80 mb-6">
            Der bauliche Brandschutz bewertet nicht das Material selbst, sondern das Verhalten von <strong>Bauteilen</strong> (z.B. Wände, Decken, Stützen) im Brandfall. Ziel ist es, die Tragfähigkeit und den Raumabschluss für eine bestimmte Zeitdauer (Feuerwiderstandsdauer) sicherzustellen, um Flucht und Rettung zu ermöglichen.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                <span className="bg-shiraz text-white px-2 py-1 rounded text-xs">Kriterien</span>
                Europäische Klassifizierung (DIN EN 13501-2)
              </h3>
              <p className="text-sm text-text-main/80 mb-4">Die europäische Norm verwendet Buchstaben zur Beschreibung der Leistungsmerkmale eines Bauteils im Brandfall:</p>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3 items-start">
                  <span className="font-bold text-shiraz w-6 shrink-0 text-lg">R</span>
                  <div>
                    <strong>Tragfähigkeit (Résistance)</strong><br/>
                    Das Bauteil (z.B. Stütze, Träger) trägt die anliegenden Lasten weiterhin ohne einzustürzen.
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="font-bold text-shiraz w-6 shrink-0 text-lg">E</span>
                  <div>
                    <strong>Raumabschluss (Étanchéité)</strong><br/>
                    Das Bauteil (z.B. Wand, Tür) verhindert den Durchtritt von Flammen und heißen Gasen auf die brandabgewandte Seite.
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="font-bold text-shiraz w-6 shrink-0 text-lg">I</span>
                  <div>
                    <strong>Wärmedämmung (Isolation)</strong><br/>
                    Das Bauteil begrenzt die Temperaturerhöhung auf der brandabgewandten Seite (meist max. 140K im Mittel), sodass sich dort keine brennbaren Materialien entzünden.
                  </div>
                </li>
              </ul>
              <div className="mt-4 text-xs bg-white p-3 rounded-lg border border-home-grau/30">
                <span className="font-bold text-text-main">Beispiel REI 90:</span> Eine tragende und raumabschließende Wand, die für 90 Minuten ihre Tragfähigkeit (R), ihren Raumabschluss (E) und ihre Wärmedämmung (I) behält.
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Vergleich</span>
                National vs. Europäisch
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-home-grau/10 text-text-main">
                    <tr>
                      <th className="px-3 py-2 rounded-tl-lg">Dauer (min)</th>
                      <th className="px-3 py-2">Bauaufsichtliche Benennung</th>
                      <th className="px-3 py-2">DIN 4102-2 (National)</th>
                      <th className="px-3 py-2 rounded-tr-lg">DIN EN 13501-2 (Europa)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20">
                    <tr className="hover:bg-home-grau/5">
                      <td className="px-3 py-2 font-bold">≥ 30</td>
                      <td className="px-3 py-2">feuerhemmend</td>
                      <td className="px-3 py-2 font-mono">F 30</td>
                      <td className="px-3 py-2 font-mono">R 30 / REI 30</td>
                    </tr>
                    <tr className="hover:bg-home-grau/5">
                      <td className="px-3 py-2 font-bold">≥ 60</td>
                      <td className="px-3 py-2">hochfeuerhemmend</td>
                      <td className="px-3 py-2 font-mono">F 60</td>
                      <td className="px-3 py-2 font-mono">R 60 / REI 60</td>
                    </tr>
                    <tr className="hover:bg-home-grau/5">
                      <td className="px-3 py-2 font-bold">≥ 90</td>
                      <td className="px-3 py-2">feuerbeständig</td>
                      <td className="px-3 py-2 font-mono">F 90</td>
                      <td className="px-3 py-2 font-mono">R 90 / REI 90</td>
                    </tr>
                    <tr className="hover:bg-home-grau/5">
                      <td className="px-3 py-2 font-bold">≥ 120</td>
                      <td className="px-3 py-2">hochfeuerbeständig</td>
                      <td className="px-3 py-2 font-mono">F 120</td>
                      <td className="px-3 py-2 font-mono">R 120 / REI 120</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-text-main/70 mt-4">
                Hinweis: Die nationale Bezeichnung "F" (z.B. F90) impliziert bei tragenden, raumabschließenden Bauteilen automatisch die Eigenschaften R, E und I. In der europäischen Norm werden diese explizit angegeben (z.B. REI90). Für eine reine Stütze ohne Raumabschluss reicht "R90".
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'holzabbrand' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-text-main mb-4">Holzabbrand (Simulation)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <Slider label="Branddauer t" info="Dauer der Brandeinwirkung in Minuten." min={0} max={120} step={5} value={dauer} unit="min" onChange={(e) => setDauer(Number(e.target.value))} />
                <div className="mt-6 border-t border-home-grau/30 pt-4">
                  <h4 className="font-bold text-sm mb-4">Holzquerschnitt (3-seitig beflammt)</h4>
                  <Slider label="Breite b"  min={50} max={400} step={10} value={holzBreite} unit="mm" onChange={(e) => setHolzBreite(Number(e.target.value))} />
                  <div className="mt-4"><Slider label="Höhe h" info="Höhe des Bauteilquerschnitts." min={100} max={800} step={10} value={holzHoehe} unit="mm" onChange={(e) => setHolzHoehe(Number(e.target.value))} /></div>
                </div>
              </div>
              <div className="bg-shiraz text-white p-6 rounded-xl shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Brandverhalten</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><div className="text-white/70 text-sm">Gastemperatur (ISO)</div><div className="text-2xl font-bold">{formatDeZahl(results.tempIso, 0)} °C</div></div>
                  <div><div className="text-white/70 text-sm">Abbrandtiefe Holz</div><div className="text-2xl font-bold">{formatDeZahl(results.abbrandTiefe, 1)} mm</div></div>
                  <div className="col-span-2 mt-2"><div className="text-white/70 text-sm">Restquerschnitt Holz</div><div className="text-2xl font-bold">{formatDeZahl(results.restBreite, 0)} × {formatDeZahl(results.restHoehe, 0)} mm ({formatDeZahl(results.restFlaeche, 1)} %)</div></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 h-[300px]">
                <Line 
                  data={results.chartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      x: { type: 'linear', title: { display: true, text: "Zeit t (min)" } },
                      y: { title: { display: true, text: 'Temperatur (°C)' } }
                    }
                  }} 
                />
              </div>

              {/* Schematische Darstellung */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Holzabbrand (3-seitig)</h3>
                <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                  <svg width="100%" height="160" viewBox="0 0 350 160">
                    {/* Ursprünglicher Querschnitt */}
                    <rect x="125" y="20" width="100" height="120" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="175" y="15" fontSize="10" fill="#64748b" textAnchor="middle">Ursprünglich (b × h)</text>

                    {/* Abgebrannter Bereich (Holzkohle) */}
                    <rect x="125" y="20" width="100" height="120" fill="#1e293b" opacity="0.8" />
                    
                    {/* Restquerschnitt */}
                    {(() => {
                      // Skalierung: 100px = holzBreite, 120px = holzHoehe
                      const scaleX = 100 / holzBreite;
                      const scaleY = 120 / holzHoehe;
                      const abbrandPxX = results.abbrandTiefe * scaleX;
                      const abbrandPxY = results.abbrandTiefe * scaleY;
                      
                      // 3-seitig: links, rechts, unten
                      const restX = 125 + abbrandPxX;
                      const restY = 20; // Oben kein Abbrand
                      const restW = Math.max(0, 100 - 2 * abbrandPxX);
                      const restH = Math.max(0, 120 - abbrandPxY);

                      return (
                        <g>
                          <rect x={restX} y={restY} width={restW} height={restH} fill="#94a3b8" stroke="#475569" strokeWidth="2" />
                          <text x={175} y={restY + restH / 2} fontSize="12" fill="#334155" textAnchor="middle" fontWeight="bold">Rest</text>
                        </g>
                      );
                    })()}

                    {/* Flammen (symbolisch) */}
                    <path d="M 115 140 Q 125 120 115 100 Q 105 120 115 140" fill="#A3113E" />
                    <path d="M 175 150 Q 185 130 175 110 Q 165 130 175 150" fill="#A3113E" />
                    <path d="M 235 140 Q 245 120 235 100 Q 225 120 235 140" fill="#A3113E" />
                    <path d="M 105 80 Q 115 60 105 40 Q 95 60 105 80" fill="#A3113E" />
                    <path d="M 245 80 Q 255 60 245 40 Q 235 60 245 80" fill="#A3113E" />

                    {/* Maßlinien Abbrand */}
                    <path d="M 125 145 L 125 155 M 225 145 L 225 155 M 125 150 L 225 150" stroke="#1e293b" strokeWidth="1" />
                    <text x="175" y="160" fontSize="10" fill="#1e293b" textAnchor="middle">b</text>

                  </svg>
                  <div className="text-xs text-text-main/70 text-center mt-2">
                    Bei dreiseitiger Brandbeanspruchung (z.B. Deckenbalken) brennt das Holz von unten und den Seiten ab. Es entsteht eine schützende Holzkohleschicht (schwarz). Der innere Restquerschnitt (gelb) bleibt tragfähig.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    
      <ModuleFooter 
        wikipedia={[
        { title: 'Brandschutz', url: 'https://de.wikipedia.org/wiki/Brandschutz' },
        { title: 'Baustoffklasse', url: 'https://de.wikipedia.org/wiki/Baustoffklasse' }
      ]}
        literatur={[
          'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Hosser, D. (2018): Brandschutz im Bauwesen (Vieweg+Teubner Verlag)'
        ]}
        regelwerke={[
          { title: 'DIN EN 13501-1:2019-05 (Klassifizierung von Bauprodukten zu ihrem Brandverhalten - Euroklassen A1..F)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13501-1' },
          { title: 'DIN 4102-4:2016-05 (Brandverhalten von Baustoffen und Bauteilen - Klassifizierte Baustoffe & Feuerwiderstand)', url: 'https://www.dinmedia.de/de/suche?q=DIN+4102-4' },
          { title: 'DIN EN 1995-1-2:2024-03 (Eurocode 5: Bemessung von Holzbauten - Heißbemessung & Abbrandraten)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1995-1-2' },
          { title: 'Musterbauordnung (MBO 2023 - Gebäudeklassen 1 bis 5)', url: 'https://www.bauministerkonferenz.de/' }
        ]}
        formeln={[
          {
            formel: 'd_{\\text{ef}} = d_{\\text{char,n}} + k_0 \\cdot d_0 = \\beta_n \\cdot t + k_0 \\cdot d_0',
            erklaerung: 'Effektive Abbrandtiefe def von Holz nach Eurocode 5 (DIN EN 1995-1-2): Rechnerische Berücksichtigung der durch Erwärmung geschwächten Übergangsschicht d0 = 7 mm.',
            quelle: 'DIN EN 1995-1-2 Gl. 4.1'
          },
          {
            formel: '\\theta_g - 20 = 345 \\cdot \\log_{10}(8t + 1) \\quad [^\\circ\\text{C}]',
            erklaerung: 'Einheitstemperaturzeitkurve (ETK) nach DIN EN 1363-1 / DIN 4102 zur standardisierten Brandprüfung von Bauteilen im Ofen.',
            quelle: 'DIN EN 1363-1'
          }
        ]}
      />
    </div>
  );
}
