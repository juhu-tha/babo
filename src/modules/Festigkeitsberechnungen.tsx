import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { Calculator, Layers, Compass } from 'lucide-react';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import Spannungszustand, { SPANNUNGSZUSTAND_FUSS } from './festigkeitsberechnungen/Spannungszustand';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem
} from 'chart.js';
import inhalt from '@/content/festigkeitsberechnungen/Festigkeitsberechnungen.json';
import { grenzhoehen, wuerfelstapel } from '@/src/calc/festigkeitsvergleich';
import { MdText } from '@/src/components/inhalt/MdText';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Material = {
  name: string;
  rho: number; // kg/m³
  fc: number;  // MPa (Druck)
  ft: number;  // MPa (Zug)
  E: number;   // MPa (E-Modul)
  color: string;
};

// Lehrvergleich: Beton f_ck/f_ctm und E_cm nach DIN EN 1992-1-1 Tab. 3.1, Stahl f_y/f_u (Mindestwerte),
// Holz C24 nach DIN EN 338 (charakteristisch), übrige Werte typische Literaturwerte (Größenordnung).
const materials: Record<string, Material> = inhalt.daten.materials;

type Reiter = 'eigengewicht' | 'spannungszustand';
const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'eigengewicht', label: 'Turmhöhe, Reißlänge & Würfelstapel', icon: Layers },
  { id: 'spannungszustand', label: 'Spannungszustand & Mohr-Kreis', icon: Compass },
];

export default function Festigkeitsberechnungen() {
  const [reiter, setReiter] = useState<Reiter>('eigengewicht');
  const [mat1Key, setMat1Key] = useState<string>('beton_c20');
  const [mat2Key, setMat2Key] = useState<string>('stahl_s235');
  const [useLogScale, setUseLogScale] = useState(false);
  
  // Würfelstapel State
  const [cubeMatKey, setCubeMatKey] = useState<string>('beton_c20');
  const [cubeSize, setCubeSize] = useState<number>(10); // cm

  const mat1 = materials[mat1Key];
  const mat2 = materials[mat2Key];
  const cubeMat = materials[cubeMatKey];
  // Rechenkern src/calc/festigkeitsvergleich.ts: Grenzhöhe H_max = f_c/(ρ·g), Reißlänge L_max = f_t/(ρ·g) (g = 9,81 m/s²)
  const res1 = useMemo(() => grenzhoehen(mat1), [mat1]);
  const res2 = useMemo(() => grenzhoehen(mat2), [mat2]);

  // Würfelstapel: N_max = ⌊f_c/(ρ·g·a)⌋, Stauchung des untersten Würfels δ = σ/E·a,
  // Gesamtstauchung δ_ges = ρ·g·a²/E·N(N + 1)/2 (Lehrdarstellung des Moduls, unverändert)
  const cubeCalc = useMemo(() => wuerfelstapel(cubeMat, cubeSize), [cubeMat, cubeSize]);

  const chartData = {
    labels: [inhalt.werte.maxTurmhöheDruck, inhalt.werte.maxReißlängeZug],
    datasets: [
      {
        label: mat1.name,
        data: [res1.H_max, res1.L_max],
        backgroundColor: mat1.color,
      },
      {
        label: mat2.name,
        data: [res2.H_max, res2.L_max],
        backgroundColor: mat2.color,
      }
    ]
  };

  const formatLength = (m: number) => {
    if (m > 10000) return `${formatDeZahl(m / 1000, 1)} km`;
    if (m > 1000) return `${formatDeZahl(m / 1000, 2)} km`;
    return `${formatDeZahl(m, 0)} m`;
  };

  return (
    <div className="flex flex-col gap-8">
      <ModuleTabs label="Themen" tabs={REITER} aktiv={reiter} onWechsel={setReiter} className="flex flex-col gap-8 [&>[role=tablist]]:mb-0">
      {reiter === 'spannungszustand' && <Spannungszustand />}
      {reiter === 'eigengewicht' && (<>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><Calculator className="text-shiraz" /><MdText text={inhalt.texte.festigkeitsberechnungenTurmbauReißlänge} /></h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
          <p><MdText text={inhalt.texte.festigkeitsberechnungenDienenDemNachweis} /></p>
        </div>

        <p className="text-home-grau mb-6"><MdText text={inhalt.texte.vergleichenSieZweiMaterialien} /><span className="font-mono text-xs bg-gray-100 px-1 rounded"><FormulaText text="H = f_c / (\rho \cdot g)" /></span><MdText text={inhalt.texte.brReißlängeZugWie} /><span className="font-mono text-xs bg-gray-100 px-1 rounded"><FormulaText text="L = f_t / (\rho \cdot g)" /></span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Material 1 */}
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Material 1</h3>
            <select aria-label="Material 1"
              value={mat1Key}
              onChange={(e) => setMat1Key(e.target.value)}
              className="w-full p-2 mb-4 border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-shiraz focus:border-shiraz outline-none"
            >
              {Object.entries(materials).map(([key, m]) => (
                <option key={key} value={key}>{m.name}</option>
              ))}
            </select>
            
            <div className="grid grid-cols-4 gap-2 text-xs mb-6">
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1"><FormulaText text="Dichte ρ" /></div>
                <div className="font-bold text-text-main">{formatDeWert(mat1.rho)} kg/m³</div>
              </div>
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1"><FormulaText text="Druck f_c" /></div>
                <div className="font-bold text-text-main">{formatDeWert(mat1.fc)} MPa</div>
              </div>
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1"><FormulaText text="Zug f_t" /></div>
                <div className="font-bold text-text-main">{formatDeWert(mat1.ft)} MPa</div>
              </div>
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1">E-Modul</div>
                <div className="font-bold text-text-main">{formatDeWert(mat1.E)} MPa</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-shiraz/10 p-4 rounded-lg border border-shiraz/20 text-center">
                <div className="text-shiraz text-xs font-bold uppercase mb-1"><MdText text={inhalt.texte.maxTurmhöhe} /></div>
                <div className="text-2xl font-bold text-shiraz">{formatLength(res1.H_max)}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <div className="text-blue-700 text-xs font-bold uppercase mb-1"><MdText text={inhalt.texte.maxReißlänge} /></div>
                <div className="text-2xl font-bold text-blue-700">{formatLength(res1.L_max)}</div>
              </div>
            </div>
          </div>

          {/* Material 2 */}
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Material 2</h3>
            <select aria-label="Material 2"
              value={mat2Key}
              onChange={(e) => setMat2Key(e.target.value)}
              className="w-full p-2 mb-4 border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-shiraz focus:border-shiraz outline-none"
            >
              {Object.entries(materials).map(([key, m]) => (
                <option key={key} value={key}>{m.name}</option>
              ))}
            </select>
            
            <div className="grid grid-cols-4 gap-2 text-xs mb-6">
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1"><FormulaText text="Dichte ρ" /></div>
                <div className="font-bold text-text-main">{formatDeWert(mat2.rho)} kg/m³</div>
              </div>
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1"><FormulaText text="Druck f_c" /></div>
                <div className="font-bold text-text-main">{formatDeWert(mat2.fc)} MPa</div>
              </div>
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1"><FormulaText text="Zug f_t" /></div>
                <div className="font-bold text-text-main">{formatDeWert(mat2.ft)} MPa</div>
              </div>
              <div className="bg-white p-2 rounded border border-home-grau/30 text-center">
                <div className="text-home-grau mb-1">E-Modul</div>
                <div className="font-bold text-text-main">{formatDeWert(mat2.E)} MPa</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-shiraz/10 p-4 rounded-lg border border-shiraz/20 text-center">
                <div className="text-shiraz text-xs font-bold uppercase mb-1"><MdText text={inhalt.texte.maxTurmhöhe2} /></div>
                <div className="text-2xl font-bold text-shiraz">{formatLength(res2.H_max)}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <div className="text-blue-700 text-xs font-bold uppercase mb-1"><MdText text={inhalt.texte.maxReißlänge2} /></div>
                <div className="text-2xl font-bold text-blue-700">{formatLength(res2.L_max)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Vergleichsdiagramm</h3>
            <label className="flex items-center gap-2 text-sm text-text-main cursor-pointer">
              <input 
                type="checkbox" 
                checked={useLogScale} 
                onChange={(e) => setUseLogScale(e.target.checked)}
                className="rounded text-shiraz focus:ring-shiraz"
              /><MdText text={inhalt.texte.logarithmischeSkalaFürExtreme} /></label>
          </div>
          <div className="w-full h-[400px]">
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { 
                    type: useLogScale ? 'logarithmic' : 'linear',
                    title: { display: true, text: inhalt.werte.längeHöheM },
                    beginAtZero: true
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context: TooltipItem<'bar'>) => {
                        return `${context.dataset.label}: ${formatLength(context.raw as number)}`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Würfelstapel-Problem */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><Layers className="text-shiraz" /><MdText text={inhalt.texte.dasWürfelstapelProblem} /></h2>
        <p className="text-home-grau mb-6"><MdText text={inhalt.texte.esSollenWürfelSolange} /></p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 lg:col-span-1">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Parameter</h3>
            
            <div className="mb-6">
              <div className="flex items-center gap-2"><label className="text-xs text-home-grau block mb-1">Material</label><InfoTooltip text={inhalt.werte.auswahlDesZuUntersuchenden} /></div>
              <select aria-label="Material"
                value={cubeMatKey}
                onChange={(e) => setCubeMatKey(e.target.value)}
                className="w-full p-2 border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-shiraz focus:border-shiraz outline-none"
              >
                {Object.entries(materials).map(([key, m]) => (
                  <option key={key} value={key}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <Slider 
                label={inhalt.werte.kantenlängeA} info={inhalt.werte.längeDerKanteDes} 
                min={1} 
                max={100} 
                step={1} 
                value={cubeSize} 
                unit="cm" 
                onChange={(e) => setCubeSize(Number(e.target.value))} 
              />
            </div>

            <div className="bg-white p-4 rounded-lg border border-home-grau/30 text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-home-grau"><FormulaText text="Dichte ρ:" /></span>
                <span className="font-bold">{formatDeWert(cubeMat.rho)} kg/m³</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-home-grau">Druckfestigkeit <span className="font-mono bg-gray-100 px-1 rounded"><FormulaText text="f_c" /></span>:</span>
                <span className="font-bold">{formatDeWert(cubeMat.fc)} MPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-home-grau">E-Modul <span className="font-mono bg-gray-100 px-1 rounded">E</span>:</span>
                <span className="font-bold">{formatDeWert(cubeMat.E)} MPa</span>
              </div>
            </div>
          </div>

          <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/20 lg:col-span-2 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-shiraz uppercase tracking-wider mb-6">Ergebnisse</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-home-grau text-sm mb-1"><MdText text={inhalt.texte.maxAnzahlWürfelN} /></div>
                <div className="text-4xl font-bold text-text-main">{formatDeWert(cubeCalc.N_max)} <span className="text-lg font-normal text-home-grau">Stück</span></div>
              </div>
              
              <div>
                <div className="text-home-grau text-sm mb-1"><MdText text={inhalt.texte.gesamthöheDesStapels} /></div>
                <div className="text-4xl font-bold text-text-main">{formatLength(cubeCalc.H_total)}</div>
              </div>

              <div>
                <div className="text-home-grau text-sm mb-1"><MdText text={inhalt.texte.stauchungUntersterWürfel} /></div>
                <div className="text-2xl font-bold text-shiraz">{formatDeZahl(cubeCalc.delta_bottom, 3)} <span className="text-sm font-normal">mm</span></div>
                <div className="text-xs text-home-grau mt-1">Spannung: {formatDeZahl(cubeCalc.sigma_bottom, 2)} MPa</div>
              </div>

              <div>
                <div className="text-home-grau text-sm mb-1"><MdText text={inhalt.texte.gesamtstauchungDesStapels} /></div>
                <div className="text-2xl font-bold text-shiraz">{formatDeZahl(cubeCalc.delta_total, 1)} <span className="text-sm font-normal">mm</span></div>
                <div className="text-xs text-home-grau mt-1"><MdText text={inhalt.texte.summeAllerEinzelverformungen} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Live-Rechenweg (AP 3.7) mit den aktuellen Eingaben */}
        <FormulaDerivationBox
          live
          title={`Ihr Rechenweg: Würfelstapel aus ${cubeMat.name}`}
          zielGleichung="N_{\max} = \left\lfloor \frac{f_c}{\rho \cdot g \cdot a} \right\rfloor"
          schritte={[
            {
              titel: inhalt.werte.eingabenInSiEinheiten,
              erklaerung: inhalt.werte.kantenlängeInMeterFestigkeit,
              formel: `a = ${formatDeTeX(cubeCalc.a, 2)}\\,\\text{m},\\; f_c = ${formatDeTeX(cubeMat.fc, 1)} \\cdot 10^{6}\\,\\text{N/m}^2,\\; \\rho = ${formatDeTeX(cubeMat.rho, 0)}\\,\\text{kg/m}^3`
            },
            {
              titel: inhalt.werte.anzahlDerWürfel,
              erklaerung: inhalt.werte.jederWürfelErhöhtDie,
              formel: `N = \\frac{${formatDeTeX(cubeMat.fc, 1)} \\cdot 10^{6}}{${formatDeTeX(cubeMat.rho, 0)} \\cdot 9{,}81 \\cdot ${formatDeTeX(cubeCalc.a, 2)}} = ${formatDeTeX(cubeCalc.N_max_exact, 2)} \\;\\Rightarrow\\; N_{\\max} = ${formatDeTeX(cubeCalc.N_max, 0)}`
            },
            {
              titel: 'Stapelhöhe',
              erklaerung: inhalt.werte.anzahlMalKantenlänge,
              formel: `H = ${formatDeTeX(cubeCalc.N_max, 0)} \\cdot ${formatDeTeX(cubeCalc.a, 2)} = ${formatDeTeX(cubeCalc.H_total, 2)}\\,\\text{m}`
            },
            {
              titel: inhalt.werte.spannungUndStauchungAm,
              erklaerung: `Hookesches Gesetz mit E = ${formatDeZahl(cubeMat.E, 0)} MPa für den untersten Würfel:`,
              formel: `\\sigma = N \\rho g a = ${formatDeTeX(cubeCalc.sigma_bottom, 2)}\\,\\text{MPa},\\quad \\Delta a = \\frac{\\sigma}{E} \\cdot a = ${formatDeTeX(cubeCalc.delta_bottom, 3)}\\,\\text{mm}`
            },
            {
              titel: 'Gesamtstauchung',
              erklaerung: inhalt.werte.derITeWürfel,
              formel: `\\Delta H = \\frac{\\rho g a^2}{E} \\cdot \\frac{N(N+1)}{2} = ${formatDeTeX(cubeCalc.delta_total, 1)}\\,\\text{mm}`
            }
          ]}
          ergebnisHinweis={inhalt.werte.gedankenexperimentOhneTeilsicherheitsbei}
          normQuelle={inhalt.werte.technischeMechanikGleichgewichtHookesche}
        />
      </div>
      </>)}
      </ModuleTabs>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1WieHoch}
        zielGleichung="H = \frac{f_c}{\rho \cdot g}"
        schritte={inhalt.daten["Festigkeitsberechnungen.schritte"]}
        ergebnisHinweis={inhalt.werte.mitBemessungswertenFCd}
        normQuelle={inhalt.werte.gleichgewichtBemessungswerteNachDin}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2ReißlängeVon}
        zielGleichung="L = \frac{f_u}{\rho \cdot g}"
        schritte={inhalt.daten["Festigkeitsberechnungen.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dieReißlängeIstEine}
        normQuelle={inhalt.werte.technischeMechanikFU}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="festigkeit" />

      <ModuleFooter 
        lastReviewed={inhalt.werte.oktober2026Ap5}
        wikipedia={[
          { title: 'Festigkeit', url: 'https://de.wikipedia.org/wiki/Festigkeit' },
          { title: inhalt.werte.hookeschesGesetz, url: 'https://de.wikipedia.org/wiki/Hookesches_Gesetz' },
          { title: 'Reißlänge', url: 'https://de.wikipedia.org/wiki/Rei%C3%9Fl%C3%A4nge' }
        ]}
        regelwerke={inhalt.daten["Festigkeitsberechnungen.regelwerke"]}
        literatur={[...(inhalt.daten["Festigkeitsberechnungen.literatur"]), ...SPANNUNGSZUSTAND_FUSS.literatur]}
        weblinks={SPANNUNGSZUSTAND_FUSS.weblinks}
        formeln={[...(inhalt.daten["Festigkeitsberechnungen.formeln"]), ...SPANNUNGSZUSTAND_FUSS.formeln]}
      />
    </div>
  );
}
