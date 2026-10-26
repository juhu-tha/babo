import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Layers, Activity, Maximize, BookOpen } from 'lucide-react';
import inhalt from '@/content/glas/Glas.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { weibull, vsgEffektiveDicke, sigma0Lehrmodell, VSG_MODUL } from '@/src/calc/glas';

const glassTypes = inhalt.daten.glassTypes;

export default function Glas() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'festigkeit' | 'verbundglas' | 'isoglas'>('steckbrief');

  const [glassType, setGlassType] = useState<keyof typeof glassTypes>('SPG');
  const [sigma, setSigma] = useState(45); // Spannung in MPa
  const [area, setArea] = useState(1.0); // Fläche in m²
  const [m, setM] = useState(7); // Weibull-Modul
  const [sigma0, setSigma0] = useState(() => sigma0Lehrmodell(glassTypes.SPG.fgk)); // Lehrmodell σ0 = 1,5 · f_g,k passend zur Startauswahl SPG

  const [temp, setTemp] = useState(20); // Temperatur in °C
  const [duration, setDuration] = useState<'short' | 'medium' | 'long'>('short'); // Lasteinwirkungsdauer

  // Rechenkern src/calc/glas.ts
  const wb = useMemo(() => weibull({ sigma, sigma0, m, A: area }), [sigma, sigma0, m, area]);
  const weibullData = useMemo(() => {
    const data = wb.kurve;
    const currentPf = wb.pf;

    return {
      datasets: [
        {
          label: `Bruchwahrscheinlichkeit (A = ${formatDeWert(area)} m², m = ${formatDeWert(m)})`,
          data: data,
          borderColor: '#64748b',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          fill: true,
          borderWidth: 3,
          pointRadius: 0,
        },
        {
          label: inhalt.werte.aktuelleSpannung,
          data: [{ x: sigma, y: currentPf * 100 }],
          backgroundColor: '#A3113E',
          borderColor: '#A3113E',
          pointRadius: 6,
          pointHoverRadius: 8,
          showLine: false,
        }
      ]
    };
  }, [wb, area, m, sigma]);

  // Rechenkern src/calc/glas.ts: Schubverbund VSG 2 × 8 mm, 1,52 mm PVB, Stützweite 1 m
  const vsgData = useMemo(() => vsgEffektiveDicke({ T: temp, dauer: duration, ...VSG_MODUL }), [temp, duration]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.glasImBauwesen} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.glasIstEinSpröder} /></p>
        </div>

        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'steckbrief' as const, label: 'Baustoff-Steckbrief', icon: BookOpen },
            { id: 'festigkeit' as const, label: inhalt.texte.festigkeitBruchwahrscheinlichkeit, icon: Activity },
            { id: 'verbundglas' as const, label: inhalt.texte.verbundsicherheitsglasVsg, icon: Layers },
            { id: 'isoglas' as const, label: inhalt.texte.mehrscheibenIsolierglasMig, icon: Maximize },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="flex flex-col gap-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20"
        >
        <div className="flex flex-col gap-6">

      {activeTab === 'festigkeit' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
        <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.glasartEigenschaften} /></h3>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Glasart</label><InfoTooltip text={inhalt.werte.artDesVerwendetenGlases} /></div>
                <select aria-label="Glasart" 
                  className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                  value={glassType}
                  onChange={(e) => {
                    const type = e.target.value as keyof typeof glassTypes;
                    setGlassType(type);
                    setSigma0(sigma0Lehrmodell(glassTypes[type].fgk)); // Lehrmodell: σ0 = 1,5 · f_g,k (keine Normgröße)
                  }}
                >
                  {Object.entries(glassTypes).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
                <p className="text-text-main/80 mb-3 font-medium">{glassTypes[glassType].desc}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-main/60"><MdText text={inhalt.texte.charFestigkeit} /><FormulaText text="f_{g,k}" />:</span>
                    <span className="font-bold">{formatDeWert(glassTypes[glassType].fgk)} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-main/60">Temp.-Wechsel <FormulaText text="\Delta T" />:</span>
                    <span className="font-bold">{formatDeWert(glassTypes[glassType].deltaT)} K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-main/60">Dichte <FormulaText text="\rho" />:</span>
                    <span className="font-bold">2500 kg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-main/60">E-Modul <FormulaText text="E" />:</span>
                    <span className="font-bold">70.000 MPa</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.sprödbruchWeibullVerteilung} /></h3>
              <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.glasVersagtSprödeDie} /></p>
              
              <Slider info={inhalt.werte.vorhandeneSpannungImGlas} label={<FormulaText text={inhalt.werte.vorhandeneSpannung} />} min={10} max={100} step={1} value={sigma} unit="MPa" onChange={(e) => setSigma(Number(e.target.value))} />
              <div className="mt-4">
                <Slider label={inhalt.werte.scheibenflächeA}  min={0.1} max={10} step={0.1} value={area} unit="m²" onChange={(e) => setArea(Number(e.target.value))} />
              </div>
              <div className="mt-4">
                <Slider label={inhalt.werte.weibullModulM} info={inhalt.werte.parameterFürDieStreuung} min={3} max={15} step={1} value={m} unit="-" onChange={(e) => setM(Number(e.target.value))} />
              </div>
              <EingabeHinweise hinweise={wb.hinweise} />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[400px]">
              <h3 className="text-lg font-bold text-text-main mb-4"><FormulaText text={inhalt.werte.bruchwahrscheinlichkeitPF} /></h3>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={weibullData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { type: 'linear', title: { display: true, text: inhalt.werte.spannungMpa } },
                      y: { title: { display: true, text: inhalt.werte.bruchwahrscheinlichkeit }, min: 0, max: 100 }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'verbundglas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.verbundsicherheitsglasVsg2} /></h3>
              <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.derSchubverbundDerPvb} /></p>
              
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Lasteinwirkungsdauer</label><InfoTooltip text={inhalt.werte.dauerÜberDieDie} /></div>
                <select aria-label="Lasteinwirkungsdauer" 
                  className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as typeof duration)}
                >
                  <option value="short">Kurz (Wind, Stoß)</option>
                  <option value="medium">Mittel (Schnee, Personen)</option>
                  <option value="long">Lang (Eigengewicht)</option>
                </select>
              </div>

              <Slider label={<div className="flex items-center gap-2">Temperatur <FormulaText text="T" /></div>} min={-20} max={60} step={5} value={temp} unit="°C" onChange={(e) => setTemp(Number(e.target.value))} />
              <EingabeHinweise hinweise={vsgData.hinweise} />
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                  <div className="text-xs text-home-grau mb-1"><MdText text={inhalt.texte.schubmodulPvb} /><FormulaText text="G_{PVB}" />)</div>
                  <div className="font-bold text-shiraz text-xl">{formatDeZahl(vsgData.G, 2)} MPa</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                  <div className="text-xs text-home-grau mb-1"><MdText text={inhalt.texte.effektiveDicke} /><FormulaText text="h_{ef,w}" />)</div>
                  <div className="font-bold text-text-main text-xl">{formatDeZahl(vsgData.hef_w, 1)} mm</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungVsgVerbundsicherh} /></h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="160" viewBox="0 0 350 160">
                  {/* Glas 1 */}
                  <rect x="100" y="40" width="150" height="20" fill="#cbd5e1" opacity="0.6" stroke="#475569" strokeWidth="1" />
                  <text x="175" y="54" fontSize="10" fill="#1e293b" textAnchor="middle">Glas 1 (h_1)</text>

                  {/* PVB Folie */}
                  <rect x="100" y="60" width="150" height="10" fill="#cbd5e1" opacity="0.8" />
                  <text x="175" y="68" fontSize="8" fill="#475569" textAnchor="middle">PVB-Folie (G)</text>

                  {/* Glas 2 */}
                  <rect x="100" y="70" width="150" height="20" fill="#cbd5e1" opacity="0.6" stroke="#475569" strokeWidth="1" />
                  <text x="175" y="84" fontSize="10" fill="#1e293b" textAnchor="middle">Glas 2 (h_2)</text>

                  {/* Schubverbund Pfeile */}
                  <path d="M 120 65 L 140 65" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-glas)" />
                  <path d="M 230 65 L 210 65" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red-glas)" />
                  <text x="175" y="60" fontSize="8" fill="#A3113E" textAnchor="middle">Schubübertragung (Γ)</text>

                  {/* Biegung (symbolisch) */}
                  <path d="M 100 110 Q 175 140 250 110" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 175 100 L 175 120" stroke="#1e293b" strokeWidth="2" markerEnd="url(#arrow-black-glas)" />

                  <defs>
                    <marker id="arrow-red-glas" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                    </marker>
                    <marker id="arrow-black-glas" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.verbundsicherheitsglasVsgBestehtAus} /></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'isoglas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.mehrscheibenIsolierglasMig2} /></h3>
              <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.migBestehtAusZwei} /></p>
              <ul className="list-disc pl-5 mt-3 space-y-2 text-sm text-gray-700">
                <li><MdText text={inhalt.texte.wärmeschutzUgWertEdelgasfüllungen} /></li>
                <li><MdText text={inhalt.texte.klimatischeBelastungDaDer} /></li>
                <li><MdText text={inhalt.texte.isochorenDruckDerDruckunterschied} /></li>
              </ul>
            </div>
            
             <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 mb-2"><MdText text={inhalt.texte.klimalastenP0} /></h3>
              <p className="text-sm text-blue-800"><MdText text={inhalt.texte.wirdMigAnEinem} /></p>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">MIG Aufbau</h3>
              <div className="bg-off-white p-4 rounded-lg flex justify-center border border-home-grau/30">
                 <svg width="200" height="150" viewBox="0 0 200 150">
                    {/* Scheibe Außen */}
                    <rect x="50" y="20" width="10" height="110" fill="#cbd5e1" opacity="0.6" stroke="#475569" />
                    <text x="35" y="75" fontSize="10" fill="#1e293b" transform="rotate(-90 35,75)">Außen</text>
                    
                    {/* Low-E Schicht */}
                    <rect x="58" y="20" width="2" height="110" fill="#cbd5e1" />
                    
                    {/* Gasfüllung */}
                    <rect x="60" y="25" width="80" height="100" fill="#f1f5f9" opacity="0.5" />
                    <text x="100" y="75" fontSize="10" fill="#475569" textAnchor="middle">SZR (Argon)</text>
                    
                    {/* Abstandhalter */}
                    <rect x="60" y="20" width="80" height="5" fill="#94a3b8" />
                    <rect x="60" y="125" width="80" height="5" fill="#94a3b8" />
                    
                    {/* Scheibe Innen */}
                    <rect x="140" y="20" width="10" height="110" fill="#cbd5e1" opacity="0.6" stroke="#475569" />
                    <text x="160" y="75" fontSize="10" fill="#1e293b" transform="rotate(-90 160,75)">Innen</text>
                 </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300">
          <BaustoffProfil materialKey="glas" />
        </div>
      )}
        </div>
        </ModuleTabs>
      </div>
    
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielThermischerGlasbruchBe}
          zielGleichung="\sigma_T \approx E \cdot \alpha_T \cdot \Delta T"
          normQuelle={inhalt.werte.lehrmodellVollBehinderteDehnung}
          schritte={inhalt.daten["Glas.schritte"]}
          ergebnisHinweis={inhalt.werte.beiRisikoThermischerSpannungen}
        />
      </div>

      <ModulTest moduleId="glas" />

      <ModuleFooter 
        wikipedia={[
        { title: 'Glas', url: 'https://de.wikipedia.org/wiki/Glas' },
        { title: 'Verbundsicherheitsglas', url: 'https://de.wikipedia.org/wiki/Verbundsicherheitsglas' }
      ]}
        literatur={inhalt.daten["Glas.literatur"]}
        regelwerke={inhalt.daten["Glas.regelwerke"]}
        formeln={inhalt.daten["Glas.formeln"]}
      />
    </div>
  );
}
