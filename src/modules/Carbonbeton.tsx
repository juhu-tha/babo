import { Layers } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { carbonbetonBiegung } from '@/src/calc/carbonbeton';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { useTabContext } from '@/src/contexts/TabContext';
import { formatDeZahl } from '@/src/utils/numberFormat';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
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
import inhalt from '@/content/carbonbeton/Carbonbeton.json';
import { MdText } from '@/src/components/inhalt/MdText';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Carbonbeton() {
  const [h, setH] = useState(40); // mm
  const [c, setC] = useState(10); // mm
  const [aTex, setATex] = useState(100); // mm²/m
  const [fTk, setFTk] = useState(2500); // MPa
  const [eTex, setETex] = useState(200); // GPa
  const [fCk, setFCk] = useState(50); // MPa

  const results = useMemo(() => {
    // Biegetragfähigkeit mit Dehnungskontrolle ε_c ≤ 3,5 ‰ im Kern src/calc/carbonbeton.ts (Umsetzung 29.10.2026, T9-CB-1);
    // γ_tex = 1,3 Lehrannahme – maßgebend: DAfStb-Richtlinie (2024) bzw. Zulassung
    const kern = carbonbetonBiegung({ h, c, aTex, fTk, eTexGPa: eTex, fCk });
    const { d, fTd, x, y, z, mRd } = kern;

    // Querschnitt für SVG berechnen (Balkenhöhe 160px h-Äquivalent)
    const mmToPx = 160 / h;
    const csv_c = c * mmToPx;
    const csv_d = d * mmToPx;
    const csv_x = Math.max(5, Math.min(150, x * mmToPx));
    const csv_y = Math.max(5, Math.min(150, y * mmToPx));

    // Skalierte Dehnung darstellen
    // Top Strain is statically set to 30px width corresponding to compressive limit
    const xTopStrain = 230; // 200 + 30
    // Tension strain is based on strain distribution: strain_bot = strain_top * (d-x)/x
    // Limit to safe bounding box 140px to 195px
    const xBotStrain = Math.min(195, Math.max(140, 200 - 30 * ((csv_d - csv_x) / (csv_x || 1))));

    // Vergleich mit Stahlbeton (B500B)
    // Um das gleiche mRd aufzunehmen, wie dick müsste die Decke sein?
    // Lehrannahme: Stahlbetonplatte XC4 mit c_nom = 40 mm oben und unten, Stab Ø 10 mm und
    // mindestens 10 mm Druckzone → h ≈ 2·40 + 10 + 10 = 100 mm
    const hStahl = Math.max(100, h + 2 * 40 - 2 * c); 

    // Chart Data: Spannung-Dehnung
    const strainData = [];
    const stressCarbon = [];
    const stressSteel = [];

    // Dehnung in Promille (‰)
    for (let eps = 0; eps <= 25; eps += 0.5) {
      strainData.push(eps.toFixed(1));
      
      // Carbon: linear elastisch bis Bruch
      const epsBruchCarbon = (fTk / (eTex * 1000)) * 1000; // in ‰
      if (eps <= epsBruchCarbon) {
        stressCarbon.push(eps * 1e-3 * eTex * 1000);
      } else {
        stressCarbon.push(null);
      }

      // Stahl: B500B
      const epsFlies = (500 / 200000) * 1000; // 2.5 ‰
      if (eps <= epsFlies) {
        stressSteel.push(eps * 1e-3 * 200000);
      } else {
        // Verfestigung bis 540 MPa bei 50‰ (vereinfacht)
        const stress = 500 + (eps - epsFlies) * (40 / (50 - epsFlies));
        stressSteel.push(stress);
      }
    }

    return {
      kern,
      d,
      fTd,
      x,
      y,
      z,
      mRd,
      hStahl,
      csv_c,
      csv_d,
      csv_x,
      csv_y,
      xTopStrain,
      xBotStrain,
      chartData: {
        labels: strainData,
        datasets: [
          {
            label: 'Carbonbewehrung',
            data: stressCarbon,
            borderColor: '#475569',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0,
            borderWidth: 3,
            pointRadius: 0,
          },
          {
            label: inhalt.werte.betonstahlB500b,
            data: stressSteel,
            borderColor: '#64748b',
            backgroundColor: 'rgba(100, 116, 139, 0.1)',
            borderDash: [5, 5],
            tension: 0,
            borderWidth: 2,
            pointRadius: 0,
          }
        ]
      }
    };
  }, [h, c, aTex, fTk, eTex, fCk]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><Layers className="text-shiraz" /><MdText text={inhalt.texte.carbonbetonTextilbeton} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.carbonbetonIstEinInnovativer} /></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.geometrieBeton} /></h3>
              <Slider
                label={inhalt.werte.bauteildickeH} info={inhalt.werte.dickeDesBetrachtetenBauteils}
                value={h}
                min={20}
                max={150}
                step={5}
                onChange={(e) => setH(Number(e.target.value))}
                unit="mm"
              />
              <Slider
                label={inhalt.werte.betondeckungC} info={inhalt.werte.derMinimaleAbstandZwischen}
                value={c}
                min={5}
                max={30}
                step={1}
                onChange={(e) => setC(Number(e.target.value))}
                unit="mm"
              />
              <Slider label={<FormulaText text={inhalt.werte.betonfestigkeitFCk} />} info={inhalt.werte.charakteristischeZylinderdruckfestigkeit}
                value={fCk}
                min={30}
                max={100}
                step={5}
                onChange={(e) => setFCk(Number(e.target.value))}
                unit="MPa"
              />
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.carbonbewehrungTextil} /></h3>
              <Slider info={inhalt.werte.effektiveQuerschnittsflächeDesBewehrungs} label={<FormulaText text={inhalt.werte.querschnittsflächeATex} />}
                value={aTex}
                min={50}
                max={300}
                step={10}
                onChange={(e) => setATex(Number(e.target.value))}
                unit="mm²/m"
              />
              <Slider label={<FormulaText text={inhalt.werte.zugfestigkeitFTk} />} info={inhalt.werte.charakteristischeZugfestigkeitDesVerwend}
                value={fTk}
                min={1500}
                max={4000}
                step={100}
                onChange={(e) => setFTk(Number(e.target.value))}
                unit="MPa"
              />
              <Slider info={inhalt.werte.elastizitätsmodulDesCarbontextilsIn} label={<FormulaText text={inhalt.werte.eModulETex} />}
                value={eTex}
                min={150}
                max={300}
                step={10}
                onChange={(e) => setETex(Number(e.target.value))}
                unit="GPa"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.biegebemessungVereinfacht} /></h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-off-white rounded-lg border border-home-grau/30">
                  <div className="text-sm text-text-main/70 mb-1"><MdText text={inhalt.texte.aufnehmbaresMoment} /><FormulaText text="m_{Rd}" /></div>
                  <div className="text-3xl font-bold text-text-main">
                    {formatDeZahl(results.mRd, 2)} <span className="text-lg">kNm/m</span>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-sm text-emerald-800 mb-1">Dickenvergleich</div>
                  <div className="text-sm font-medium text-emerald-900">
                    Carbonbeton: <strong>{formatDeZahl(h, 0)} mm</strong><MdText text={inhalt.texte.brStahlbetonMin} /><strong>{formatDeZahl(results.hStahl, 0)} mm</strong>
                    <span className="block text-[11px] text-emerald-800/70 mt-1"><MdText text={inhalt.texte.lehrannahmeXc4CNom} /></span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-text-main/80">
                <div className="flex justify-between border-b border-home-grau/10 pb-1">
                  <span>Nutzhöhe <FormulaText text="d" /></span>
                  <span className="font-medium">{formatDeZahl(results.d, 1)} mm</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-1">
                  <span>Nulllinie <FormulaText text="x" /></span>
                  <span className="font-medium">{formatDeZahl(results.x, 1)} mm</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-1">
                  <span>Spannungsblock <FormulaText text="y" /></span>
                  <span className="font-medium">{formatDeZahl(results.y, 1)} mm</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-1">
                  <span>Hebelarm <FormulaText text="z" /></span>
                  <span className="font-medium">{formatDeZahl(results.z, 1)} mm</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-1">
                  <span>Bemessungsfestigkeit <FormulaText text="f_{td}" /></span>
                  <span className="font-medium">{formatDeZahl(results.fTd, 0)} MPa</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-1">
                  <span>Betonranddehnung <FormulaText text="\varepsilon_c" /></span>
                  <span className="font-medium">{formatDeZahl(results.kern.epsC * 1000, 2)} ‰</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-1">
                  <span>Textilspannung <FormulaText text="\sigma_{tex}" /></span>
                  <span className="font-medium">{formatDeZahl(results.kern.sigmaTex, 0)} MPa</span>
                </div>
                <div className="col-span-2 flex justify-between border-b border-home-grau/10 pb-1">
                  <span>Maßgebendes Versagen</span>
                  <span className="font-medium">{results.kern.versagen === "beton" ? "Beton (ε_c = 3,5 ‰)" : "Textil (f_td erreicht)"}</span>
                </div>
              </div>
              <EingabeHinweise hinweise={results.kern.hinweise} />

              {/* Graphic */}
              <div className="mt-6 border-t border-home-grau/30 pt-6">
                <h4 className="font-semibold text-sm text-text-main mb-4"><MdText text={inhalt.texte.schematischeDarstellungQuerschnittDehnun} /></h4>
                <div className="relative w-full h-48 bg-off-white rounded-lg border border-home-grau/30 overflow-hidden flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <pattern id="concrete" patternUnits="userSpaceOnUse" width="20" height="20">
                        <circle cx="4" cy="4" r="1.5" fill="#cbd5e1" />
                        <circle cx="14" cy="12" r="2" fill="#94a3b8" />
                        <circle cx="8" cy="18" r="1" fill="#cbd5e1" />
                      </pattern>
                    </defs>
                    
                    {/* Cross section */}
                    <rect x="50" y="20" width="80" height="160" fill="url(#concrete)" stroke="#64748b" strokeWidth="2" />
                    
                    {/* Carbon reinforcement */}
                    <line x1="50" y1={180 - results.csv_c} x2="130" y2={180 - results.csv_c} stroke="#475569" strokeWidth="4" strokeDasharray="4 2" />
                    <text x="90" y={180 - results.csv_c + 15} fontSize="11" fill="#475569" fontWeight="bold" textAnchor="middle">Carbon</text>
                    
                    {/* Dimensions */}
                    <line x1="35" y1="20" x2="45" y2="20" stroke="#64748b" strokeWidth="1" />
                    <line x1="35" y1="180" x2="45" y2="180" stroke="#64748b" strokeWidth="1" />
                    <line x1="40" y1="20" x2="40" y2="180" stroke="#64748b" strokeWidth="1" />
                    <text x="30" y="105" fontSize="12" fill="#64748b" textAnchor="end">h</text>
                    
                    <line x1="135" y1="20" x2="145" y2="20" stroke="#64748b" strokeWidth="1" />
                    <line x1="135" y1={180 - results.csv_c} x2="145" y2={180 - results.csv_c} stroke="#64748b" strokeWidth="1" />
                    <line x1="140" y1="20" x2="140" y2={180 - results.csv_c} stroke="#64748b" strokeWidth="1" />
                    <text x="148" y={20 + (160 - results.csv_c) / 2 + 4} fontSize="12" fill="#64748b" fontWeight="bold">d</text>

                    {/* Strain distribution */}
                    <line x1="200" y1="20" x2="200" y2="180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                    {/* Top strain (compression) */}
                    <line x1="200" y1="20" x2={results.xTopStrain} y2="20" stroke="#A3113E" strokeWidth="2.5" />
                    {/* Bottom strain (tension) */}
                    <line x1="200" y1={180 - results.csv_c} x2={results.xBotStrain} y2={180 - results.csv_c} stroke="#475569" strokeWidth="2.5" />
                    {/* Strain line */}
                    <line x1={results.xTopStrain} y1="20" x2={results.xBotStrain} y2={180 - results.csv_c} stroke="#64748b" strokeWidth="2" />
                    
                    {/* Neutral axis */}
                    <line x1="170" y1={20 + results.csv_x} x2="280" y2={20 + results.csv_x} stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="285" y={20 + results.csv_x + 3} fontSize="10" fill="#64748b" fontWeight="bold">Nulllinie (x)</text>

                    {/* Stress distribution */}
                    <line x1="320" y1="20" x2="320" y2="180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                    {/* Compression block */}
                    <rect x="320" y="20" width="30" height={results.csv_y} fill="#A3113E" fillOpacity="0.25" stroke="#A3113E" strokeWidth="1.5" />
                    <text x="358" y={20 + results.csv_y / 2 + 4} fontSize="10" fill="#A3113E" fontWeight="bold">F_c</text>
                    
                    {/* Tension force */}
                    <line x1="320" y1={180 - results.csv_c} x2="280" y2={180 - results.csv_c} stroke="#475569" strokeWidth="2" />
                    <circle cx="280" cy={180 - results.csv_c} r="3.5" fill="#475569" />
                    <text x="264" y={180 - results.csv_c - 6} fontSize="10" fill="#475569" fontWeight="bold">F_t</text>
                    
                    {/* Lever arm z */}
                    <line x1="340" y1={20 + results.csv_y / 2} x2="340" y2={180 - results.csv_c} stroke="#475569" strokeWidth="1.5" strokeDasharray="2 1" />
                    {/* Arrowheads for z */}
                    <path d={`M 340 ${20 + results.csv_y / 2} l -3 6 m 3 -6 l 3 6`} stroke="#475569" strokeWidth="1.5" />
                    <path d={`M 340 ${180 - results.csv_c} l -3 -6 m 3 6 l 3 -6`} stroke="#475569" strokeWidth="1.5" />
                    <text x="346" y={20 + results.csv_y / 2 + (160 - results.csv_c - results.csv_y / 2) / 2 + 4} fontSize="12" fill="#475569" fontWeight="bold">z</text>

                  </svg>
                </div>
                <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.carbonbetonErmöglichtSehrGeringe} /></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Spannungs-Dehnungs-Verhalten</h3>
              <div className="h-64">
                <Line 
                  data={results.chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: inhalt.werte.spannungMpa }
                      },
                      x: {
                        title: { display: true, text: 'Dehnung (‰)' }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 0)} MPa`
                        }
                      }
                    }
                  }} 
                />
              </div>
              <p className="text-xs text-text-main/60 mt-3"><MdText text={inhalt.texte.imGegensatzZuBetonstahl} /></p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.regelwerkCarbonbeton} /></p>

      <CarbonVerweis />

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielCarbonbetonplatteStand}
        zielGleichung="m_{Rd} = a_{tex} \cdot \sigma_{tex} \cdot z,\; \sigma_{tex} \le f_{td}"
        normQuelle={inhalt.werte.gleichgewichtAmRechteckquerschnittTex}
        schritte={inhalt.daten["Carbonbeton.schritte"]}
        ergebnisHinweis={inhalt.werte.mRd51}
      />

      <ModulTest moduleId="carbonbeton" />

      <ModuleFooter
        weblinks={[
          inhalt.daten["Carbonbeton.weblinks.0"],
          { title: inhalt.werte.betonWikiTextilbetonCarbonbeton, url: 'https://beton.wiki/index.php?title=Textilbeton' }
        ]}
        wikipedia={[
          { title: 'Carbonbeton', url: 'https://de.wikipedia.org/wiki/Carbonbeton' },
          { title: inhalt.werte.kohlenstofffaserverstärkterKunststoff, url: 'https://de.wikipedia.org/wiki/Kohlenstofffaserverst%C3%A4rkter_Kunststoff' }
        ]}
        regelwerke={inhalt.daten["Carbonbeton.regelwerke"]}
        literatur={inhalt.daten["Carbonbeton.literatur"]}
        formeln={inhalt.daten["Carbonbeton.formeln"]}
      />
    </div>
  );
}

function CarbonVerweis() {
  const { setActiveTab } = useTabContext();
  return (
    <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.materialHerstellungUndAnwendungen} /><button type="button" onClick={() => setActiveTab('innovative_werkstoffe')} className="text-shiraz font-bold underline cursor-pointer">
        Entwicklungen
      </button>.
    </p>
  );
}

