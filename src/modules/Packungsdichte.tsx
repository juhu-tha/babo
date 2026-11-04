import { formatDeZahl } from '@/src/utils/numberFormat';
import { Layers } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
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
  LogarithmicScale
} from 'chart.js';
import inhalt from '@/content/packungsdichte/Packungsdichte.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { sieblinienOptimierung, zweikornMischung } from '@/src/calc/packungsdichte';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { ReiterLeiste, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Packungsdichte() {
  const [activeTab, setActiveTab] = useState<'sieblinien' | 'zweikorn'>('sieblinien');
  
  // Anteile der Feststoffe in Vol.-%
  const [pZement, setPZement] = useState(12);
  const [pZusatz, setPZusatz] = useState(5); // z.B. Flugasche oder Kalksteinmehl
  const [pSand, setPSand] = useState(33); // Sand 0/2
  const [pKies1, setPKies1] = useState(20); // Kies 2/8
  // pKies2 (Kies 8/16) ergibt sich aus 100 - Summe

  // Parameter für Idealsieblinie
  const [q, setQ] = useState(0.30); // Verteilungsmodul
  const [kornform, setKornform] = useState<'rund' | 'gebrochen'>('rund');
  const [vFest, setVFest] = useState(750); // l/m³

  const results = useMemo(() => {
    // Rechenkern src/calc/packungsdichte.ts: Anteile, Massen, Sieblinien (A&A, Fuller), RMSE, Packungsdichte
    const r = sieblinienOptimierung({ zement: pZement, zusatz: pZusatz, sand: pSand, kies1: pKies1, q, kornform, vFest });
    const { aZement, aZusatz, aSand, aKies1, aKies2, mZement, mZusatz, mSand, mKies1, mKies2, mTotal, rmseAA, rmseFuller } = r;
    const estimatedPD = r.packungsdichte;
    const sieves = r.sieblinie.map(p => p.d);
    const mixedCurve = r.sieblinie.map(p => p.gemisch);
    const idealCurveAA = r.sieblinie.map(p => p.andreasen);
    const fullerCurve = r.sieblinie.map(p => p.fuller);

    return {
      aZement,
      aZusatz,
      aSand,
      aKies1,
      aKies2,
      mZement,
      mZusatz,
      mSand,
      mKies1,
      mKies2,
      mTotal,
      rmseAA,
      rmseFuller,
      estimatedPD,
      hinweise: r.hinweise,
      chartData: {
        labels: sieves,
        datasets: [
          {
            label: inhalt.werte.aktuellesGemisch,
            data: mixedCurve,
            borderColor: '#A3113E',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            tension: 0.3,
          },
          {
            label: `Ideal (A&A, q=${q})`,
            data: idealCurveAA,
            borderColor: '#475569',
            borderDash: [5, 5],
            borderWidth: 2,
            tension: 0.3,
          },
          {
            label: 'Fuller-Parabel',
            data: fullerCurve,
            borderColor: '#475569',
            borderDash: [2, 2],
            borderWidth: 2,
            tension: 0.3,
          }
        ]
      }
    };
  }, [pZement, pZusatz, pSand, pKies1, q, kornform, vFest]);

  // Handler für Slider, um Kaskadierung zu ermöglichen
  const handleZementChange = (val: number) => setPZement(val);
  const handleZusatzChange = (val: number) => setPZusatz(val);
  const handleSandChange = (val: number) => setPSand(val);
  const handleKies1Change = (val: number) => setPKies1(val);

  // Zweikornmischung Parameter
  const [d1, setD1] = useState(0.5); // Feinkorn
  const [d2, setD2] = useState(8);   // Grobkorn
  const [phi1, setPhi1] = useState(0.60); // Eigenpackungsdichte Fein
  const [phi2, setPhi2] = useState(0.62); // Eigenpackungsdichte Grob

  const zweikornResults = useMemo(() => {
    // Rechenkern src/calc/packungsdichte.ts: ideale Theorie (Furnas/Mooney), linear, Lehrmodell „real“
    const z = zweikornMischung({ d1, d2, phi1, phi2 });
    const sizeRatio = z.verhaeltnis;
    const fractions = z.punkte;

    return {
      hinweise: z.hinweise,
      gueltig: z.gueltig,
      verhaeltnis: sizeRatio,
      maximum: z.maximum,
      chartData: {
        labels: fractions.map(f => f.x),
        datasets: [
          {
            label: inhalt.werte.idealeTheorieMooneyFurnas,
            data: fractions.map(f => f.ideal),
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 0
          },
          {
            label: inhalt.werte.theoretischLinearGleicheGrößen,
            data: fractions.map(f => f.linear),
            borderColor: '#e2e8f0',
            borderWidth: 1,
            tension: 0,
            pointRadius: 0
          },
          {
            label: `Reales Modell (simuliert für d1/d2 = ${formatDeZahl(sizeRatio, 3)})`,
            data: fractions.map(f => f.real),
            borderColor: '#475569',
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 0
          }
        ]
      }
    };
  }, [d1, d2, phi1, phi2]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Packungsdichteoptimierung
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieOptimierungDerPackungsdichte} /></p>
        </div>

        <ReiterLeiste label="Bereiche Packungsdichte" className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6 w-full">
          <button {...alsReiter(activeTab === 'sieblinien', 'packung-bereich', 'sieblinien')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'sieblinien' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('sieblinien')}
          ><MdText text={inhalt.texte.kontinuierlicheModelleSieblinien} /></button>
          <button {...alsReiter(activeTab === 'zweikorn', 'packung-bereich', 'zweikorn')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zweikorn' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zweikorn')}
          ><MdText text={inhalt.texte.diskreteModelleZweikornmischung} /></button>
        </ReiterLeiste>

        {activeTab === 'sieblinien' && (
        <div {...reiterPanel('packung-bereich', activeTab)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.feststoffanteileVol} /></h3>
              <div className="space-y-4">
                <Slider
                  label="Zement" info={inhalt.werte.mengeDesZements}
                  value={results.aZement}
                  min={0}
                  max={30}
                  step={1}
                  onChange={(e) => handleZementChange(Number(e.target.value))}
                  unit="%"
                />
                <Slider
                  label={inhalt.werte.zusatzstoffZBKalksteinmehl} 
                  value={results.aZusatz}
                  min={0}
                  max={30}
                  step={1}
                  onChange={(e) => handleZusatzChange(Number(e.target.value))}
                  unit="%"
                />
                <Slider
                  label={inhalt.werte.sand02Mm} info={inhalt.werte.mengeDerFeinenGesteinskörnung}
                  value={results.aSand}
                  min={0}
                  max={60}
                  step={1}
                  onChange={(e) => handleSandChange(Number(e.target.value))}
                  unit="%"
                />
                <Slider
                  label={inhalt.werte.kies28Mm} 
                  value={results.aKies1}
                  min={0}
                  max={60}
                  step={1}
                  onChange={(e) => handleKies1Change(Number(e.target.value))}
                  unit="%"
                />
                <div className="pt-2 border-t border-home-grau/30">
                  <div className="flex justify-between text-sm font-medium text-text-main">
                    <span><MdText text={inhalt.texte.kies816Mm} /></span>
                    <span>{formatDeZahl(results.aKies2, 0)} %</span>
                  </div>
                  <div className="w-full bg-home-grau/20 h-3 rounded-full mt-2 overflow-hidden flex">
                    <div style={{ width: `${results.aZement}%` }} className="bg-slate-400 h-full" title="Zement"></div>
                    <div style={{ width: `${results.aZusatz}%` }} className="bg-slate-300 h-full" title="Zusatzstoff"></div>
                    <div style={{ width: `${results.aSand}%` }} className="bg-amber-400 h-full" title="Sand"></div>
                    <div style={{ width: `${results.aKies1}%` }} className="bg-stone-400 h-full" title="Kies 2/8"></div>
                    <div style={{ width: `${results.aKies2}%` }} className="bg-stone-600 h-full" title="Kies 8/16"></div>
                  </div>
                </div>
              </div>
              <EingabeHinweise hinweise={results.hinweise} />
              <ErgebnisAnsage text={kurzzeile(ansageWert('Gesamtmasse', results.mTotal, 0, 'kg'), ansageWert('RMSE zu A&A', results.rmseAA, 1), ansageWert('RMSE zu Fuller', results.rmseFuller, 1), ansageWert('geschätzte Packungsdichte', results.estimatedPD * 100, 1, '%'))} />
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.massenProMBeton} /></h3>
              <Slider info={inhalt.werte.volumenanteilAllerFestenBestandteile} label={inhalt.werte.feststoffvolumenImBeton}
                value={vFest}
                min={600}
                max={850}
                step={10}
                onChange={(e) => setVFest(Number(e.target.value))}
                unit="l/m³"
                
              />
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600"><MdText text={inhalt.texte.zement31Kg} /></span>
                  <span className="font-medium">{formatDeZahl(results.mZement, 0)} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500"><MdText text={inhalt.texte.zusatzstoff265Kg} /></span>
                  <span className="font-medium">{formatDeZahl(results.mZusatz, 0)} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600"><MdText text={inhalt.texte.sand022} /></span>
                  <span className="font-medium">{formatDeZahl(results.mSand, 0)} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500"><MdText text={inhalt.texte.kies282} /></span>
                  <span className="font-medium">{formatDeZahl(results.mKies1, 0)} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-700"><MdText text={inhalt.texte.kies8162} /></span>
                  <span className="font-medium">{formatDeZahl(results.mKies2, 0)} kg</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-home-grau/30 pt-3 mt-3">
                  <span>Gesamtfeststoffmasse</span>
                  <span>{formatDeZahl(results.mTotal, 0)} kg</span>
                </div>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.modellparameterEigenschaften} /></h3>
              
              <div className="mb-6">
                <div className="flex items-center gap-2"><label className="block text-sm font-medium text-text-main mb-2"><MdText text={inhalt.texte.kornformDerGesteinskörnung} /></label><InfoTooltip text={inhalt.werte.formDerGesteinskörnerZ} /></div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="kornform" 
                      value="rund" 
                      checked={kornform === 'rund'} 
                      onChange={() => setKornform('rund')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm"><MdText text={inhalt.texte.rundFlusskies} /></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="kornform" 
                      value="gebrochen" 
                      checked={kornform === 'gebrochen'} 
                      onChange={() => setKornform('gebrochen')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm"><MdText text={inhalt.texte.gebrochenSplitt} /></span>
                  </label>
                </div>
              </div>

              <Slider info={inhalt.werte.exponentQDerModifizierten} label={<FormulaText text={inhalt.werte.verteilungsmodulQ} />}
                value={q}
                min={0.20}
                max={0.50}
                step={0.01}
                onChange={(e) => setQ(Number(e.target.value))}
                
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Feststoff-Sieblinie</h3>
              <div className="h-72">
                <Line 
                  data={results.chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        type: 'logarithmic',
                        title: { display: true, text: inhalt.werte.partikelgrößeDMm },
                        min: 0.001,
                        max: 20,
                        ticks: {
                          callback: function(value) {
                            return Number(value).toString();
                          }
                        }
                      },
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: inhalt.werte.durchgang }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 1)} %`
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.bewertungVisualisierung} /></h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30 text-center">
                  <div className="text-xs text-text-main/70 mb-1">RMSE zu A&A</div>
                  <div className={`text-xl font-bold ${results.rmseAA < 5 ? 'text-emerald-600' : results.rmseAA < 10 ? 'text-amber-500' : 'text-torch-red'}`}>
                    {formatDeZahl(results.rmseAA, 1)}
                  </div>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30 text-center">
                  <div className="text-xs text-text-main/70 mb-1"><MdText text={inhalt.texte.rmseZuFuller} /></div>
                  <div className={`text-xl font-bold ${results.rmseFuller < 5 ? 'text-emerald-600' : results.rmseFuller < 10 ? 'text-amber-500' : 'text-torch-red'}`}>
                    {formatDeZahl(results.rmseFuller, 1)}
                  </div>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30 text-center">
                  <div className="text-xs text-text-main/70 mb-1"><MdText text={inhalt.texte.estPackungsdichte} /></div>
                  <div className="text-xl font-bold text-primary">
                    {formatDeZahl((results.estimatedPD * 100), 1)} %
                  </div>
                </div>
              </div>

              {/* Grafische Darstellung des Querschnitts */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-text-main mb-2"><MdText text={inhalt.texte.schematischesGefügemodell} /></h4>
                <div className="relative w-full h-40 bg-slate-100 rounded-lg border border-home-grau/30 overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice">
                    {/* Hintergrund (Wasser/Luft) */}
                    <rect width="400" height="160" fill="#e2e8f0" />
                    
                    {/* Generiere Partikel basierend auf Anteilen */}
                    {/* Grobkorn (Kies 8/16) */}
                    {Array.from({ length: Math.floor(results.aKies2 / 3) }).map((_, i) => (
                      <circle 
                        key={`k2-${i}`} 
                        cx={20 + (i * 57) % 380} 
                        cy={20 + (i * 43) % 140} 
                        r={kornform === 'rund' ? 18 : 16} 
                        fill="#475569" 
                        opacity="0.9"
                        transform={kornform === 'gebrochen' ? `rotate(${i * 45} ${20 + (i * 57) % 380} ${20 + (i * 43) % 140}) scale(1.1, 0.9)` : ''}
                      />
                    ))}
                    
                    {/* Mittelkorn (Kies 2/8) */}
                    {Array.from({ length: Math.floor(results.aKies1 / 1.5) }).map((_, i) => (
                      <circle 
                        key={`k1-${i}`} 
                        cx={15 + (i * 31) % 380} 
                        cy={15 + (i * 27) % 140} 
                        r={kornform === 'rund' ? 9 : 8} 
                        fill="#94a3b8" 
                        opacity="0.9"
                        transform={kornform === 'gebrochen' ? `rotate(${i * 30} ${15 + (i * 31) % 380} ${15 + (i * 27) % 140}) scale(1.2, 0.8)` : ''}
                      />
                    ))}
                    
                    {/* Sand */}
                    {Array.from({ length: Math.floor(results.aSand * 1.5) }).map((_, i) => (
                      <circle 
                        key={`s-${i}`} 
                        cx={10 + (i * 17) % 390} 
                        cy={10 + (i * 13) % 150} 
                        r="3.5" 
                        fill="#94a3b8" 
                        opacity="0.8"
                      />
                    ))}

                    {/* Feinteile (Zement + Zusatzstoff) */}
                    {Array.from({ length: Math.floor((results.aZement + results.aZusatz) * 4) }).map((_, i) => (
                      <circle 
                        key={`f-${i}`} 
                        cx={5 + (i * 7) % 395} 
                        cy={5 + (i * 11) % 155} 
                        r="1" 
                        fill={i % 3 === 0 ? "#cbd5e1" : "#94a3b8"} 
                        opacity="0.7"
                      />
                    ))}
                  </svg>
                  <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded text-[10px] text-text-main/70 backdrop-blur-sm"><MdText text={inhalt.texte.visualisierungStarkVereinfacht} /></div>
                </div>
                <p className="text-xs text-text-main/60 mt-2"><MdText text={inhalt.texte.einGeringerRmseWert} /></p>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'zweikorn' && (
        <div {...reiterPanel('packung-bereich', activeTab)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-2 text-text-main"><MdText text={inhalt.texte.diskretePackungsdichtemodelle} /></h3>
              <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.währendKontinuierlicheModelleWie} /></p>
              
              <div className="space-y-3 mb-6">
                <div className="bg-white p-3 border border-home-grau/30 rounded-lg">
                  <h4 className="font-bold text-sm"><MdText text={inhalt.texte.compressiblePackingModelCpm} /></h4>
                  <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.nachDeLarrard1999} /></p>
                </div>
                <div className="bg-white p-3 border border-home-grau/30 rounded-lg">
                  <h4 className="font-bold text-sm"><MdText text={inhalt.texte.toufarKloseUndBorn} /></h4>
                  <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.beschreibtDieÄnderungDer} /></p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.eingabeparameterFeinkornIndex1} /></h4>
                <div className="grid grid-cols-2 gap-4">
                  <Slider label={inhalt.werte.durchmesserD} value={d1} min={0.1} max={4} step={0.1} onChange={(e) => setD1(Number(e.target.value))} unit=" mm" />
                  <Slider label={inhalt.werte.packungsdichte} value={phi1} min={0.4} max={0.7} step={0.01} onChange={(e) => setPhi1(Number(e.target.value))} unit="" />
                </div>
                
                <h4 className="font-medium text-sm text-text-main border-b border-home-grau/30 pb-2 mt-4"><MdText text={inhalt.texte.eingabeparameterGrobkornIndex2} /></h4>
                <div className="grid grid-cols-2 gap-4">
                  <Slider label={inhalt.werte.durchmesserD2} value={d2} min={4} max={32} step={1} onChange={(e) => setD2(Number(e.target.value))} unit=" mm" />
                  <Slider label={inhalt.werte.packungsdichte2} value={phi2} min={0.4} max={0.7} step={0.01} onChange={(e) => setPhi2(Number(e.target.value))} unit="" />
                </div>
                <EingabeHinweise hinweise={zweikornResults.hinweise} />
                <ErgebnisAnsage text={zweikornResults.gueltig ? kurzzeile(ansageWert('Durchmesserverhältnis', zweikornResults.verhaeltnis, 2), ansageWert('größte ideale Packungsdichte', zweikornResults.maximum.gamma * 100, 1, '%'), ansageWert('bei Feinkornanteil', zweikornResults.maximum.y1 * 100, 0, 'Vol.-%')) : 'Packungsdichte –'} />
              </div>
            </div>
            
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-2 text-text-main"><MdText text={inhalt.texte.wandeffektUndAuflockerung} /></h3>
              <ul className="text-sm text-text-main/80 space-y-2 list-disc pl-5">
                <li><MdText text={inhalt.texte.wandeffektWennEinKleines} /></li>
                <li><MdText text={inhalt.texte.auflockerungseffektWennDasGrößenverhältn} /></li>
              </ul>
              
              <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg text-sm text-blue-900 shadow-sm">
                <strong><MdText text={inhalt.texte.verhältnisDerDurchmesserD} />{formatDeZahl((d1/d2), 3)}</strong>
                <p className="mt-1 opacity-80"><MdText text={inhalt.texte.jeNäherDasVerhältnis} /></p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.zweikornmischungPackungsdichte} /></h3>
              <div className="h-[400px]">
                <Line 
                  data={zweikornResults.chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        title: { display: true, text: inhalt.werte.volumenanteilFeinkorn },
                        min: 0,
                        max: 100
                      },
                      y: {
                        title: { display: true, text: inhalt.werte.packungsdichte3 },
                        suggestedMin: Math.min(phi1, phi2) * 100 - 5,
                        suggestedMax: 85
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 1)} %`
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      <ModuleFooter
        wikipedia={[
        { title: 'Packungsdichte', url: 'https://de.wikipedia.org/wiki/Packungsdichte' },
        { title: 'Sieblinie', url: 'https://de.wikipedia.org/wiki/Sieblinie' }
      ]}
        literatur={inhalt.daten["Packungsdichte.literatur"]}
        regelwerke={inhalt.daten["Packungsdichte.regelwerke"]}
        formeln={inhalt.daten["Packungsdichte.formeln"]}
      />
    </div>
  );
}
