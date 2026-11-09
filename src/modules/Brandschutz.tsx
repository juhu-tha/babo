import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { formatDeZahl } from '@/src/utils/numberFormat';
import { Flame, Shield, Activity, Layers } from 'lucide-react';
import inhalt from '@/content/brandschutz/Brandschutz.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

type BrandschutzReiter = 'baustoffklassen' | 'baulicher_brandschutz' | 'holzabbrand';
const REITER: readonly ModulTab<BrandschutzReiter>[] = [
  { id: 'baustoffklassen', label: 'Baustoffklassen', icon: Layers },
  { id: 'baulicher_brandschutz', label: inhalt.texte.baulicherBrandschutz.trim(), icon: Shield },
  { id: 'holzabbrand', label: inhalt.texte.holzabbrandSimulation.trim(), icon: Activity },
];

export default function Brandschutz() {
  const [activeTab, setActiveTab] = useState<BrandschutzReiter>('baustoffklassen');
  
  const [dauer, setDauer] = useState(60); // min
  const [holzBreite, setHolzBreite] = useState(200); // mm
  const [holzHoehe, setHolzHoehe] = useState(400); // mm

  const results = useMemo(() => {
    // ISO-Normbrandkurve: T = 20 + 345 * log10(8 * t + 1)
    const tempIso = 20 + 345 * Math.log10(8 * dauer + 1);
    
    // Holzbalken Abbrand: ideelle Abbrandrate beta_n = 0,7 mm/min (Nadel-BSH, DIN EN 1995-1-2, Tab. 3.1)
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
            label: inhalt.werte.isoNormbrandkurveC,
            data: isoData,
            borderColor: '#A3113E',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            pointRadius: 0,
          },
          {
            label: inhalt.werte.aktuelleBranddauer,
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
          <p><MdText text={inhalt.texte.derBrandschutzGliedertSich} /></p>
        </div>
      </div>

      <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-8 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">

      {activeTab === 'baustoffklassen' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-text-main mb-4"><MdText text={inhalt.texte.brandverhaltenVonBaustoffenBaustoffklass} /></h2>
          <div className="text-sm text-text-main/80 mb-6"><MdText text={inhalt.texte.dieKlassifizierungVonBaustoffen} /></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* DIN 4102-1 */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                <span className="bg-shiraz text-white px-2 py-1 rounded text-xs">National</span>
                DIN 4102-1
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-text-main border-b border-home-grau/30 pb-1 mb-2"><MdText text={inhalt.texte.aNichtbrennbareBaustoffe} /></h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2"><span className="font-bold w-8 text-shiraz">A1</span> <span><MdText text={inhalt.texte.ohneBrennbareBestandteileZ} /></span></li>
                    <li className="flex gap-2"><span className="font-bold w-8 text-shiraz">A2</span> <span><MdText text={inhalt.texte.mitGeringenBrennbarenBestandteilen} /></span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-text-main border-b border-home-grau/30 pb-1 mb-2"><MdText text={inhalt.texte.bBrennbareBaustoffe} /></h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2"><span className="font-bold w-8 text-orange-600">B1</span> <span><MdText text={inhalt.texte.schwerentflammbarZBBrandschutzbehandelte} /></span></li>
                    <li className="flex gap-2"><span className="font-bold w-8 text-orange-500">B2</span> <span><MdText text={inhalt.texte.normalentflammbarZBHolz} /></span></li>
                    <li className="flex gap-2"><span className="font-bold w-8 text-red-600">B3</span> <span><MdText text={inhalt.texte.leichtentflammbarZBPapier} /></span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* DIN EN 13501-1 */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Europäisch</span><MdText text={inhalt.texte.dinEn135011} /></h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-text-main border-b border-home-grau/30 pb-1 mb-2">Hauptklassen</h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2"><span className="font-bold w-12 text-shiraz">A1, A2</span> <span><MdText text={inhalt.texte.nichtbrennbarA2NurMit} /></span></li>
                    <li className="flex gap-2"><span className="font-bold w-12 text-orange-600">B, C</span> <span><MdText text={inhalt.texte.schwerentflammbarAbhängigVonRauch} /></span></li>
                    <li className="flex gap-2"><span className="font-bold w-12 text-orange-500">D, E</span> <span>Normalentflammbar</span></li>
                    <li className="flex gap-2"><span className="font-bold w-12 text-red-600">F</span> <span><MdText text={inhalt.texte.leichtentflammbarBzwKeineLeistung} /></span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-text-main border-b border-home-grau/30 pb-1 mb-2">Zusatzklassifizierungen</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium mb-1"><MdText text={inhalt.texte.rauchentwicklungSSmoke} /></div>
                      <ul className="space-y-1 text-xs">
                        <li><span className="font-bold">s1:</span><MdText text={inhalt.texte.geringeRauchentwicklung} /></li>
                        <li><span className="font-bold">s2:</span><MdText text={inhalt.texte.mittlereRauchentwicklung} /></li>
                        <li><span className="font-bold">s3:</span><MdText text={inhalt.texte.hoheRauchentwicklung} /></li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium mb-1"><MdText text={inhalt.texte.brennendesAbtropfenDDroplets} /></div>
                      <ul className="space-y-1 text-xs">
                        <li><span className="font-bold">d0:</span><MdText text={inhalt.texte.keinAbtropfen} /></li>
                        <li><span className="font-bold">d1:</span><MdText text={inhalt.texte.begrenztesAbtropfen} /></li>
                        <li><span className="font-bold">d2:</span><MdText text={inhalt.texte.starkesAbtropfen} /></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 text-xs bg-white p-3 rounded-lg border border-home-grau/30 flex items-center gap-2">
                    <span className="font-bold text-text-main">Beispiel:</span> 
                    <span className="font-mono bg-blue-50 text-blue-800 px-2 py-1 rounded font-bold">A2 - s1, d0</span> 
                    <span className="text-text-main/70"><MdText text={inhalt.texte.nichtbrennbarKaumRauchKein} /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'baulicher_brandschutz' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-text-main mb-4"><MdText text={inhalt.texte.baulicherBrandschutzFeuerwiderstandsdaue} /></h2>
          <div className="text-sm text-text-main/80 mb-6"><MdText text={inhalt.texte.derBaulicheBrandschutzBewertet} /></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                <span className="bg-shiraz text-white px-2 py-1 rounded text-xs">Kriterien</span><MdText text={inhalt.texte.europäischeKlassifizierungDinEn} /></h3>
              <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.dieEuropäischeNormVerwendet} /></p>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3 items-start">
                  <span className="font-bold text-shiraz w-6 shrink-0 text-lg">R</span>
                  <div><MdText text={inhalt.texte.tragfähigkeitRSistanceBr} /></div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="font-bold text-shiraz w-6 shrink-0 text-lg">E</span>
                  <div><MdText text={inhalt.texte.raumabschlussTanchItBr} /></div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="font-bold text-shiraz w-6 shrink-0 text-lg">I</span>
                  <div><MdText text={inhalt.texte.wärmedämmungIsolationBrDas} /></div>
                </li>
              </ul>
              <div className="mt-4 text-xs bg-white p-3 rounded-lg border border-home-grau/30">
                <span className="font-bold text-text-main"><MdText text={inhalt.texte.beispielRei90} /></span><MdText text={inhalt.texte.eineTragendeUndRaumabschließende} /></div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Vergleich</span><MdText text={inhalt.texte.nationalVsEuropäisch} /></h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-home-grau/10 text-text-main">
                    <tr>
                      <th className="px-3 py-2 rounded-tl-lg">Dauer (min)</th>
                      <th className="px-3 py-2"><MdText text={inhalt.texte.bauaufsichtlicheBenennung} /></th>
                      <th className="px-3 py-2"><MdText text={inhalt.texte.din41022National} /></th>
                      <th className="px-3 py-2 rounded-tr-lg"><MdText text={inhalt.texte.dinEn135012} /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20">
                    <tr className="hover:bg-home-grau/5">
                      <td className="px-3 py-2 font-bold">≥ 30</td>
                      <td className="px-3 py-2">feuerhemmend</td>
                      <td className="px-3 py-2 font-mono">F 30</td>
                      <td className="px-3 py-2 font-mono"><MdText text={inhalt.texte.r30Rei30} /></td>
                    </tr>
                    <tr className="hover:bg-home-grau/5">
                      <td className="px-3 py-2 font-bold">≥ 60</td>
                      <td className="px-3 py-2">hochfeuerhemmend</td>
                      <td className="px-3 py-2 font-mono">F 60</td>
                      <td className="px-3 py-2 font-mono"><MdText text={inhalt.texte.r60Rei60} /></td>
                    </tr>
                    <tr className="hover:bg-home-grau/5">
                      <td className="px-3 py-2 font-bold">≥ 90</td>
                      <td className="px-3 py-2">feuerbeständig</td>
                      <td className="px-3 py-2 font-mono">F 90</td>
                      <td className="px-3 py-2 font-mono"><MdText text={inhalt.texte.r90Rei90} /></td>
                    </tr>
                    <tr className="hover:bg-home-grau/5">
                      <td className="px-3 py-2 font-bold">≥ 120</td>
                      <td className="px-3 py-2"><MdText text={inhalt.texte.keinBegriffDerMbo} /></td>
                      <td className="px-3 py-2 font-mono">F 120</td>
                      <td className="px-3 py-2 font-mono"><MdText text={inhalt.texte.r120Rei120} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-text-main/70 mt-4"><MdText text={inhalt.texte.hinweisDieNationaleBezeichnung} /></p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'holzabbrand' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-text-main mb-4"><MdText text={inhalt.texte.holzabbrandSimulation2} /></h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <Slider label={inhalt.werte.branddauerT} info={inhalt.werte.dauerDerBrandeinwirkungIn} min={0} max={120} step={5} value={dauer} unit="min" onChange={(e) => setDauer(Number(e.target.value))} />
                <div className="mt-6 border-t border-home-grau/30 pt-4">
                  <h3 className="font-bold text-sm mb-4 wie-h4"><MdText text={inhalt.texte.holzquerschnitt3SeitigBeflammt} /></h3>
                  <Slider label="Breite b"  min={50} max={400} step={10} value={holzBreite} unit="mm" onChange={(e) => setHolzBreite(Number(e.target.value))} />
                  <div className="mt-4"><Slider label="Höhe h" info={inhalt.werte.höheDesBauteilquerschnitts} min={100} max={800} step={10} value={holzHoehe} unit="mm" onChange={(e) => setHolzHoehe(Number(e.target.value))} /></div>
                </div>
              </div>
              <div className="bg-shiraz text-white p-6 rounded-xl shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Brandverhalten</h3>
                <ErgebnisAnsage text={kurzzeile(ansageWert('Gastemperatur', results.tempIso, 0, '°C'), ansageWert('Abbrandtiefe', results.abbrandTiefe, 1, 'mm'),
                  `Restquerschnitt ${formatDeZahl(results.restBreite, 0)} × ${formatDeZahl(results.restHoehe, 0)} mm`)} />
                <div className="grid grid-cols-2 gap-4">
                  <div><div className="text-white/70 text-sm"><MdText text={inhalt.texte.gastemperaturIso} /></div><div className="text-2xl font-bold">{formatDeZahl(results.tempIso, 0)} °C</div></div>
                  <div><div className="text-white/70 text-sm"><MdText text={inhalt.texte.abbrandtiefeHolz} /></div><div className="text-2xl font-bold">{formatDeZahl(results.abbrandTiefe, 1)} mm</div></div>
                  <div className="col-span-2 mt-2"><div className="text-white/70 text-sm"><MdText text={inhalt.texte.restquerschnittHolz} /></div><div className="text-2xl font-bold">{formatDeZahl(results.restBreite, 0)} × {formatDeZahl(results.restHoehe, 0)} mm ({formatDeZahl(results.restFlaeche, 1)} %)</div></div>
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
                      x: { type: 'linear', title: { display: true, text: inhalt.werte.zeitTMin } },
                      y: { title: { display: true, text: inhalt.werte.temperaturC } }
                    }
                  }} 
                />
              </div>

              {/* Schematische Darstellung */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungHolzabbrand3} /></h3>
                <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                  <svg role="img" aria-label="Schematische Darstellung: Holzabbrand bei dreiseitiger Beflammung" width="100%" height="160" viewBox="0 0 350 160">
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
                  <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.beiDreiseitigerBrandbeanspruchungZ} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </ModuleTabs>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1BrandraumtemperaturNach}
        zielGleichung="\theta_g = 20 + 345 \cdot \lg(8t + 1)"
        schritte={inhalt.daten["Brandschutz.schritte"]}
        ergebnisHinweis={inhalt.werte.dieKurveSteigtAnfangs}
        normQuelle={inhalt.werte.dinEn13631}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2RestquerschnittEines}
        zielGleichung="d_{ef} = \beta_n \cdot t + k_0 \cdot d_0"
        schritte={inhalt.daten["Brandschutz.schritte_2"]}
        ergebnisHinweis={inhalt.werte.imBrandfallWirkenGeringere}
        normQuelle={inhalt.werte.dinEn19951}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="brandschutz" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap6}
        wikipedia={[
        { title: 'Brandschutz', url: 'https://de.wikipedia.org/wiki/Brandschutz' },
        { title: 'Baustoffklasse', url: 'https://de.wikipedia.org/wiki/Baustoffklasse' }
      ]}
        literatur={inhalt.daten["Brandschutz.literatur"]}
        regelwerke={inhalt.daten["Brandschutz.regelwerke"]}
        formeln={inhalt.daten["Brandschutz.formeln"]}
      />
    </div>
  );
}
