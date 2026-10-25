import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { steelGrades, steelProperties, corrosionClasses } from './daten';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import { Slider } from '@/src/components/ui/Slider';
import { Line } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import { Sparkles, Info } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface StahlWerkstoffkundeProps {
  activeTab: "steckbrief" | "spannungsdehnung" | "stahlsorten" | "allgemein" | "walzen" | "schweissen" | "legierungen";
  alloyC: number;
  alloyCr: number;
  alloyMo: number;
  alloyNi: number;
  corrosion: "C1" | "C2" | "C3" | "C4" | "C5" | "CX";
  deltaSigma: number;
  detailCategory: number;
  fy: number;
  grade: "S235" | "S355" | "S460" | "S690" | "B500B" | "B500A" | "Y1860" | "SAS670";
  heatInput: number;
  kE: number;
  ky: number;
  m1: number;
  nR: number;
  plateThickness: number;
  profileType: "h" | "i";
  setAlloyC: Dispatch<SetStateAction<number>>;
  setAlloyCr: Dispatch<SetStateAction<number>>;
  setAlloyMo: Dispatch<SetStateAction<number>>;
  setAlloyNi: Dispatch<SetStateAction<number>>;
  setCorrosion: Dispatch<SetStateAction<"C1" | "C2" | "C3" | "C4" | "C5" | "CX">>;
  setDeltaSigma: Dispatch<SetStateAction<number>>;
  setDetailCategory: Dispatch<SetStateAction<number>>;
  setGrade: Dispatch<SetStateAction<"S235" | "S355" | "S460" | "S690" | "B500B" | "B500A" | "Y1860" | "SAS670">>;
  setHeatInput: Dispatch<SetStateAction<number>>;
  setM1: Dispatch<SetStateAction<number>>;
  setPlateThickness: Dispatch<SetStateAction<number>>;
  setProfileType: Dispatch<SetStateAction<"h" | "i">>;
  setTemp: Dispatch<SetStateAction<number>>;
  stressStrainData: { labels: string[]; datasets: ({ label: string; data: number[]; borderColor: string; borderDash: number[]; borderWidth: number; pointRadius: number; backgroundColor?: undefined; fill?: undefined; } | { label: string; data: number[]; borderColor: string; backgroundColor: string; fill: boolean; borderWidth: number; pointRadius: number; borderDash?: undefined; })[]; };
  temp: number;
  walzResults: { maxCompressive: number; maxTensile: number; chartData: ChartData<'line'> };
  weldResults: { b_t: number; chartData: { labels: string[]; datasets: ({ label: string; data: number[]; borderColor: string; backgroundColor: string; fill: boolean; tension: number; pointRadius: number; borderDash?: undefined; borderWidth?: undefined; } | { label: string; data: number[]; borderColor: string; borderDash: number[]; borderWidth: number; pointRadius: number; fill: boolean; backgroundColor?: undefined; tension?: undefined; })[]; }; };
  woehlerData: { labels: number[]; datasets: ({ label: string; data: number[]; borderColor: string; borderWidth: number; pointRadius: number; pointBackgroundColor: string; fill: boolean; backgroundColor?: undefined; pointStyle?: undefined; showLine?: undefined; } | { label: string; data: (number | null)[]; borderColor: string; backgroundColor: string; pointRadius: number; pointStyle: string; borderWidth: number; showLine: boolean; pointBackgroundColor?: undefined; fill?: undefined; })[]; };
}

export default function StahlWerkstoffkunde({ activeTab, alloyC, alloyCr, alloyMo, alloyNi, corrosion, deltaSigma, detailCategory, fy, grade, heatInput, kE, ky, m1, nR, plateThickness, profileType, setAlloyC, setAlloyCr, setAlloyMo, setAlloyNi, setCorrosion, setDeltaSigma, setDetailCategory, setGrade, setHeatInput, setM1, setPlateThickness, setProfileType, setTemp, stressStrainData, temp, walzResults, weldResults, woehlerData }: StahlWerkstoffkundeProps) {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
        <div className="lg:col-span-4 bg-off-white p-5 rounded-2xl border border-home-grau/25 flex flex-col gap-6">
          <h3 className="text-base font-bold text-text-main">
            Stahlwerkstoffe {activeTab === 'walzen' && '- Walzprofile'} {activeTab === 'schweissen' && '- Schweißen'} {activeTab === 'legierungen' && '- Legierungen & Edelstahl'}
          </h3>

          <div className="text-sm text-text-main/80 bg-white p-4 rounded-xl border border-home-grau/20">
          {activeTab === 'allgemein' ? (
            <p>
              Stahl verliert bei hohen Temperaturen (Brandfall) drastisch an Festigkeit und Steifigkeit. Zudem ist Stahl bei zyklischer Beanspruchung ermüdungsgefährdet (Wöhlerlinie).
            </p>
          ) : activeTab === 'walzen' ? (
            <p>
              Eigenspannungen in warmgewalzten Stahlprofilen entstehen durch ungleichmäßiges Abkühlen. Die dünneren Flanschenden kühlen schneller ab und schwinden, während der Kern noch warm ist. Kühlt der Kern später ab, wird er durch die bereits erstarrten Ränder am Schwinden gehindert. Dies führt zu <strong>Druckeigenspannungen an den Rändern</strong> und <strong>Zugeigenspannungen im Kern</strong>. Diese Spannungen reduzieren den Knickwiderstand (Euler-Knicken) von Stützen maßgeblich!
            </p>
          ) : activeTab === 'schweissen' ? (
            <p>
              Beim Schweißen wird lokal sehr viel Wärme eingebracht. Das Schweißgut und die Wärmeeinflusszone (WEZ) dehnen sich aus und werden beim anschließenden Abkühlen durch das umliegende, kalte Material am Schwinden gehindert. Dies führt zu extrem hohen <strong>Zugeigenspannungen (oft in Höhe der Fließgrenze)</strong> im Bereich der Naht und ausgleichenden Druckspannungen in den Randbereichen.
            </p>
          ) : (
            <p>
              Edelstahl und Rostfreie Stähle verdanken ihre hervorragenden Korrosionseigenschaften bestimmten Legierungszusätzen wie Chrom (Cr) und Molybdän (Mo). Ein Chromgehalt von mind. 10,5 % ist Voraussetzung für die Bildung der passivierenden Schutzschicht.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Stahlsorte</label><InfoTooltip text="Güteklasse des verwendeten Stahls." /></div>
          <select aria-label="Stahlsorte" 
            className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
            value={grade}
            onChange={(e) => setGrade(e.target.value as keyof typeof steelGrades)}
          >
            {Object.keys(steelGrades).map(k => <option key={k} value={k}>{k}</option>)}
          </select>

          {activeTab === 'allgemein' && (
            <div className="mt-2 p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-main/60">Dichte <FormulaText text="\rho" />:</span>
                  <span className="font-bold">{formatDeWert(steelProperties.rho)} kg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/60">Wärmeleitf. <FormulaText text="\lambda" />:</span>
                  <span className="font-bold">{formatDeWert(steelProperties.lambda)} W/(mK)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/60">Wärmedehnung <FormulaText text="\alpha" />:</span>
                  <span className="font-bold">1,2·10⁻⁵ 1/K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/60">E-Modul <FormulaText text="E" />:</span>
                  <span className="font-bold">{formatDeWert(steelProperties.E)} MPa</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {activeTab === 'allgemein' && (
          <>
            <div className="border-t border-home-grau/30 pt-4">
              <h3 className="text-sm font-bold text-text-main mb-4">Korrosionsschutz (DIN EN ISO 12944)</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Korrosivitätskategorie</label><InfoTooltip text="Einteilung der Umgebungsbedingungen hinsichtlich der Korrosionsbelastung." /></div>
                <select aria-label="Korrosivitätskategorie" 
                  className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                  value={corrosion}
                  onChange={(e) => setCorrosion(e.target.value as keyof typeof corrosionClasses)}
                >
                  {Object.keys(corrosionClasses).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <p className="text-xs text-text-main/70 mt-1">{corrosionClasses[corrosion]}</p>
              </div>
            </div>

            <div className="border-t border-home-grau/30 pt-4">
              <h3 className="text-sm font-bold text-text-main mb-4">Brandfall (Temperatureinfluss)</h3>
              <Slider
                label="Temperatur" info="Aktuelle Temperatur des Bauteils oder der Umgebung."
                min={20} max={1000} step={10}
                value={temp} unit="°C"
                onChange={(e) => setTemp(Number(e.target.value))}
              />
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
                  <div className="text-home-grau mb-1"><FormulaText text="Abminderung k_{y,θ}" /></div>
                  <div className="font-bold text-shiraz">{formatDeZahl(ky, 2)}</div>
                </div>
                <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
                  <div className="text-home-grau mb-1"><FormulaText text="Abminderung k_{E,θ}" /></div>
                  <div className="font-bold text-shiraz">{formatDeZahl(kE, 2)}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-home-grau/30 pt-4">
              <h3 className="text-sm font-bold text-text-main mb-4">Ermüdung (Kerbfall)</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2"><label className="text-sm font-medium text-text-main"><FormulaText text="Kerbfall \Delta\sigma_C (bei N=2\cdot 10^6)" /></label><InfoTooltip text="Kerbfall für die Ermüdungsberechnung." /></div>
                  <select 
                    className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                    value={detailCategory}
                    onChange={(e) => setDetailCategory(Number(e.target.value))}
                  >
                    {[36, 45, 56, 71, 80, 90, 100, 112, 125, 140, 160].map(k => <option key={k} value={k}>{formatDeWert(k)} MPa</option>)}
                  </select>
                </div>

                <Slider  label={<FormulaText text="Spannungsschwingbreite \Delta\sigma" />}
                  min={10} max={300} step={5}
                  value={deltaSigma} unit="MPa"
                  onChange={(e) => setDeltaSigma(Number(e.target.value))}
                />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Neigung m (N ≤ 5·10^6)</label><InfoTooltip text="Neigung der Wöhlerlinie für die Ermüdungsfestigkeit." /></div>
                  <select aria-label="Neigung m (N ≤ 5·10^6)" 
                    className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                    value={m1}
                    onChange={(e) => setM1(Number(e.target.value))}
                  >
                    <option value={3}>3 (Stahlbau Normalfall)</option>
                    <option value={4}>4 (Sonderfälle)</option>
                    <option value={5}>5 (Hohlprofilknoten)</option>
                  </select>
                </div>

                <div className={`p-4 rounded-xl shadow-md text-white ${nR === Infinity || nR > 1e8 ? 'bg-slate-800' : 'bg-shiraz'} transition-colors mt-2`}>
                  <div className="text-sm opacity-90 mb-1">Ertragbare Lastwechsel <FormulaText text="N_R" /></div>
                  <div className="text-2xl font-bold">
                    {nR === Infinity ? 'Dauerfest (∞)' : nR > 1e8 ? '> 100 Mio. (Dauerfest)' : nR.toExponential(2)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'walzen' && (
          <div className="border-t border-home-grau/30 pt-4">
            <h3 className="text-sm font-bold text-text-main mb-4">Profilgeometrie</h3>
            <div className="flex items-center gap-2"><label className="text-xs font-bold text-home-grau uppercase tracking-wider mb-1 block">Profiltyp</label><InfoTooltip text="Art des Stahlprofils (z.B. I-Profil, Hohlprofil)." /></div>
            <select aria-label="Profiltyp" 
              value={profileType}
              onChange={(e) => setProfileType(e.target.value as 'h' | 'i')}
              className="w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:outline-none focus:border-shiraz bg-white"
            >
              <option value="h">Breitflanschprofil (z.B. HEB) - Hohe Eigenspannungen</option>
              <option value="i">Schmales I-Profil (z.B. IPE) - Geringere Eigenspannungen</option>
            </select>
            <p className="text-xs text-home-grau mt-3">
              Breitflanschprofile kühlen ungleichmäßiger ab (dickere Steg-Flansch-Übergänge), was zu höheren Eigenspannungen führt. Dies wird im Eurocode 3 durch ungünstigere Knicklinien (z.B. Linie c) berücksichtigt.
            </p>
          </div>
        )}

        {activeTab === 'schweissen' && (
          <div className="border-t border-home-grau/30 pt-4">
            <h3 className="text-sm font-bold text-text-main mb-4">Schweißparameter</h3>
            <Slider label="Streckenenergie (Heat Input)" info="Eingebrachte Wärmeenergie pro Längeneinheit beim Schweißen." min={500} max={3000} step={100} value={heatInput} unit="J/mm" onChange={(e) => setHeatInput(Number(e.target.value))} />
            <div className="mt-4">
              <Slider label="Blechdicke t"  min={5} max={50} step={1} value={plateThickness} unit="mm" onChange={(e) => setPlateThickness(Number(e.target.value))} />
            </div>
            <p className="text-xs text-home-grau mt-3">
              Eine hohe Streckenenergie bei dünnen Blechen führt zu einer breiteren Wärmeeinflusszone und damit zu einer breiteren Zone mit hohen Zugeigenspannungen.
            </p>
          </div>
        )}

        {activeTab === 'legierungen' && (
          <div className="border-t border-home-grau/30 pt-4 space-y-4">
            <h3 className="text-sm font-bold text-text-main">Legierungs-Designer</h3>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-text-main flex items-center gap-1">Chrom (Cr) <InfoTooltip text="Erhöht Korrosionsschutz. Bildet ab 10,5% eine Passivschicht." /></span>
                <span className="font-mono text-shiraz font-bold">{formatDeZahl(alloyCr, 1)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={alloyCr}
                onChange={(e) => setAlloyCr(Number(e.target.value))}
                className="w-full accent-shiraz h-1 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-text-main flex items-center gap-1">Nickel (Ni) <InfoTooltip text="Stabilisiert Gefüge (Austenitbildner). Erhöht Zähigkeit und Verformbarkeit." /></span>
                <span className="font-mono text-shiraz font-bold">{formatDeZahl(alloyNi, 1)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={alloyNi}
                onChange={(e) => setAlloyNi(Number(e.target.value))}
                className="w-full accent-shiraz h-1 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-text-main flex items-center gap-1">Molybdän (Mo) <InfoTooltip text="Verhindert Lochfraßkorrosion (Pitting) in chloridreichen Umgebungen." /></span>
                <span className="font-mono text-shiraz font-bold">{formatDeZahl(alloyMo, 1)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={alloyMo}
                onChange={(e) => setAlloyMo(Number(e.target.value))}
                className="w-full accent-shiraz h-1 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-text-main flex items-center gap-1">Kohlenstoff (C) <InfoTooltip text="Bestimmt Härte und Fließgrenze. Hoher Gehalt mindert Schweißbarkeit." /></span>
                <span className="font-mono text-shiraz font-bold">{formatDeZahl(alloyC, 2)}%</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="1.5"
                step="0.01"
                value={alloyC}
                onChange={(e) => setAlloyC(Number(e.target.value))}
                className="w-full accent-shiraz h-1 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-home-grau/10 space-y-2">
              <span className="text-[10px] font-bold text-text-main/70 uppercase tracking-wider block font-semibold">Presets:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => { setAlloyCr(0.1); setAlloyNi(0); setAlloyMo(0); setAlloyC(0.15); }}
                  className="p-1.5 rounded bg-white hover:bg-home-grau/5 border border-home-grau/30 font-semibold"
                >
                  Baustahl (S235)
                </button>
                <button
                  type="button"
                  onClick={() => { setAlloyCr(18.0); setAlloyNi(8.0); setAlloyMo(0); setAlloyC(0.04); }}
                  className="p-1.5 rounded bg-white hover:bg-home-grau/5 border border-home-grau/30 font-semibold text-indigo-700"
                >
                  V2A (1.4301)
                </button>
                <button
                  type="button"
                  onClick={() => { setAlloyCr(17.0); setAlloyNi(12.0); setAlloyMo(2.1); setAlloyC(0.04); }}
                  className="p-1.5 rounded bg-white hover:bg-home-grau/5 border border-home-grau/30 font-semibold text-indigo-700 col-span-2"
                >
                  V4A (1.4404)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
        {activeTab === 'allgemein' && (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[350px]">
              <h3 className="text-lg font-bold text-text-main mb-4">Spannungs-Dehnungs-Linie (Brandfall, vereinfacht)</h3>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={stressStrainData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { title: { display: true, text: 'Dehnung ε (%)' } },
                      y: { title: { display: true, text: 'Spannung σ (MPa)' }, min: 0, max: 600 }
                    }
                  }} 
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[350px]">
              <h3 className="text-lg font-bold text-text-main mb-4">Wöhlerlinie (Ermüdung)</h3>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={woehlerData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { 
                        type: 'logarithmic',
                        title: { display: true, text: 'Lastwechsel N (log)' },
                        min: 1e4,
                        max: 1e8
                      },
                      y: { 
                        type: 'logarithmic',
                        title: { display: true, text: 'Spannungsschwingbreite Δσ (MPa) (log)' },
                        min: 10,
                        max: 500
                      }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Ermüdung (Kerbwirkung)</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="160" viewBox="0 0 350 160">
                  {/* Bauteil mit Kerbe */}
                  <path d="M 50 40 L 150 40 Q 175 40 175 60 Q 175 40 200 40 L 300 40 L 300 120 L 200 120 Q 175 120 175 100 Q 175 120 150 120 L 50 120 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />

                  {/* Zugkräfte */}
                  <path d="M 50 80 L 20 80" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow-red-stahl)" />
                  <path d="M 300 80 L 330 80" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow-red-stahl)" />
                  <text x="35" y="75" fontSize="12" fill="#A3113E" textAnchor="middle" fontWeight="bold">F</text>
                  <text x="315" y="75" fontSize="12" fill="#A3113E" textAnchor="middle" fontWeight="bold">F</text>

                  {/* Spannungslinien (Kraftfluss) */}
                  <path d="M 50 50 L 140 50 Q 175 70 210 50 L 300 50" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />
                  <path d="M 50 65 L 145 65 Q 175 75 205 65 L 300 65" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />
                  <path d="M 50 80 L 300 80" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />
                  <path d="M 50 95 L 145 95 Q 175 85 205 95 L 300 95" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />
                  <path d="M 50 110 L 140 110 Q 175 90 210 110 L 300 110" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />

                  {/* Spannungsspitzen Markierung */}
                  <circle cx="175" cy="60" r="15" fill="none" stroke="#A3113E" strokeWidth="2" strokeDasharray="2 2" />
                  <circle cx="175" cy="100" r="15" fill="none" stroke="#A3113E" strokeWidth="2" strokeDasharray="2 2" />
                  <text x="175" y="55" fontSize="10" fill="#A3113E" textAnchor="middle" fontWeight="bold">σ_max</text>
                  <text x="175" y="115" fontSize="10" fill="#A3113E" textAnchor="middle" fontWeight="bold">σ_max</text>

                  <defs>
                    <marker id="arrow-red-stahl" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Kerben (z.B. Schweißnähte, Bohrungen, Querschnittssprünge) stören den Kraftfluss. Die Spannungslinien drängen sich zusammen, es entstehen lokale Spannungsspitzen (σ_max). Bei zyklischer Belastung können hier Ermüdungsrisse entstehen.
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'walzen' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Max. Druckeigenspannung (Flanschrand)</div>
                <div className="text-2xl font-bold text-blue-600">{formatDeZahl(walzResults.maxCompressive, 0)} MPa</div>
                <div className="text-xs text-text-main/60 mt-1">Führt zu vorzeitigem Fließen bei Druckbeanspruchung (Knicken!)</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Max. Zugeigenspannung (Flanschmitte)</div>
                <div className="text-2xl font-bold text-red-600">+{formatDeZahl(walzResults.maxTensile, 0)} MPa</div>
                <div className="text-xs text-text-main/60 mt-1">Ausgleichsspannung im Querschnitt</div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm h-[350px]">
              <h3 className="text-sm font-bold text-text-main mb-4">Eigenspannungsverteilung über die Flanschbreite</h3>
              <div className="relative w-full h-[260px]">
                <Line 
                  data={walzResults.chartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      x: { title: { display: true, text: 'Position auf dem Flansch (%)' } },
                      y: { 
                        title: { display: true, text: 'Eigenspannung (MPa)' },
                        suggestedMin: -fy * 1.2,
                        suggestedMax: fy * 1.2
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 1)} MPa`;
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'schweissen' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Max. Zugeigenspannung (Schweißnaht)</div>
                <div className="text-2xl font-bold text-red-600">+{formatDeWert(fy)} MPa</div>
                <div className="text-xs text-text-main/60 mt-1">Erreicht typischerweise die Fließgrenze</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Breite der Zugzone (b_t)</div>
                <div className="text-2xl font-bold text-orange-600">{formatDeZahl(weldResults.b_t, 1)} mm</div>
                <div className="text-xs text-text-main/60 mt-1">Abhängig von Streckenenergie und Blechdicke</div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm h-[350px]">
              <h3 className="text-sm font-bold text-text-main mb-4">Längseigenspannungen quer zur Schweißnaht</h3>
              <div className="relative w-full h-[260px]">
                <Line 
                  data={weldResults.chartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      x: { title: { display: true, text: 'Abstand von der Schweißnahtmitte (mm)' } },
                      y: { 
                        title: { display: true, text: 'Eigenspannung (MPa)' },
                        suggestedMin: -fy * 1.2,
                        suggestedMax: fy * 1.2
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 1)} MPa`;
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'legierungen' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 border-b border-home-grau/10 pb-3">
              <Sparkles className="text-shiraz" size={24} />
              <h3 className="text-lg font-bold text-text-main">Eigenschaften der Legierungsmischung</h3>
            </div>

            {(() => {
              const pren = alloyCr + 3.3 * alloyMo;

              let category = 'Ferritisch / Unlegiert';
              let designationMatch = 'Unlegierter Baustahl (z.B. S235, S355)';
              let corrosionRating = 'Sehr Gering';
              let corrosionColor = 'text-red-600 bg-red-50';
              let microstructureDesc = 'Ferritisch-perlitische Zusammensetzung. Keine schützende Passivschicht, da der Chromgehalt unter 10,5 % liegt. Rostet unter atmosphärischen Bedingungen.';

              if (alloyCr >= 10.5) {
                if (alloyNi >= 8) {
                  category = 'Austenitisch (Rostfrei & Säurebeständig)';
                  microstructureDesc = 'Das Nickel stabilisiert das kubisch-flächenzentrierte (kfz) Austenitgitter. Extrem zäh bei tiefen Temperaturen, hervorragend schweißbar, antimagnetisch und hoch korrosionsbeständig.';
                  if (alloyMo >= 2) {
                    designationMatch = 'Nichtrostender Edelstahl V4A (z.B. 1.4401 / 1.4404)';
                    corrosionRating = 'Hervorragend (Säure- und Chloridbeständig - Pool-/Meertauglich)';
                    corrosionColor = 'text-emerald-700 bg-emerald-50';
                  } else {
                    designationMatch = 'Nichtrostender Edelstahl V2A (z.B. 1.4301 / X5CrNi18-10)';
                    corrosionRating = 'Hoch (Lebensmittelindustrie, Haushaltswaren)';
                    corrosionColor = 'text-sky-700 bg-sky-50';
                  }
                } else if (alloyNi > 1 && alloyCr >= 18) {
                  category = 'Duplex (Austenit-Ferrit-Mischgefüge)';
                  designationMatch = 'Duplex-Edelstahl (z.B. 1.4462)';
                  corrosionRating = 'Hervorragend bis Extrem (Hohe Streckgrenze & Lochfraßbeständig)';
                  corrosionColor = 'text-teal-700 bg-teal-50';
                  microstructureDesc = 'Besteht aus etwa gleichen Anteilen an Ferrit und Austenit. Verbindet die hohe Festigkeit der ferritischen Stähle mit der Korrosionsbeständigkeit und Zähigkeit der austenitischen Stähle.';
                } else if (alloyC > 0.12 && alloyNi < 2) {
                  category = 'Martensitischer Chromstahl (Härtbar)';
                  designationMatch = 'Martensitischer Stahl (z.B. 1.4021 - Werkzeug- & Messerstahl)';
                  corrosionRating = 'Mäßig (Härtbar durch Abschrecken)';
                  corrosionColor = 'text-amber-700 bg-amber-50';
                  microstructureDesc = 'Reagiert stark auf Wärmebehandlung. Durch Abschrecken entsteht das harte Martensitgefüge. Gut geeignet für Verschleißteile, Messer, Federn, jedoch geringere Zähigkeit.';
                } else {
                  category = 'Ferritischer Chromstahl (Rostfrei, magnetisch)';
                  designationMatch = 'Ferritischer Edelstahl (z.B. 1.4016)';
                  corrosionRating = 'Mäßig bis Gut';
                  corrosionColor = 'text-stone-700 bg-stone-50';
                  microstructureDesc = 'Rostfrei, aber ohne nennenswerten Nickelanteil magnetisch. Beständig im mäßig feuchten Innenbereich, mäßige Schweißeignung.';
                }
              }

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                      <span className="text-[10px] text-text-main/50 font-bold uppercase tracking-wider block font-semibold">Gefügestruktur</span>
                      <div className="text-base font-black text-text-main">{category}</div>
                      <div className="text-xs text-text-main/70 leading-normal">{microstructureDesc}</div>
                    </div>

                    <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-text-main/50 font-bold uppercase tracking-wider block font-semibold">PREN = Cr + 3,3·Mo (+16·N) – Lochfraßbeständigkeit</span>
                        <div className="text-2xl font-mono font-black text-shiraz mt-1">{formatDeZahl(pren, 2)}</div>
                      </div>
                      <div className={`p-2 rounded text-xs text-center font-bold ${corrosionColor}`}>
                        Korrosionswiderstand: {corrosionRating}
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                      <Info size={16} className="text-shiraz" />
                      Didaktischer Leitfaden: Edelstahl vs. Nichtrostender Stahl
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                      <div className="space-y-2">
                        <span className="font-bold text-text-main block">1. Ist Edelstahl immer korrosionsbeständig?</span>
                        <p className="text-text-main/75">
                          <strong>Nein, das ist ein weit verbreiteter Irrglaube!</strong> „Edelstahl“ bezeichnet laut DIN EN 10020 lediglich legierte oder unlegierte Stähle mit besonderem Reinheitsgrad (Phosphor- und Schwefelgehalt &le; 0,025 %). Ein hochreiner Baustahl ist somit auch ein Edelstahl, rostet jedoch völlig normal.
                        </p>
                        <p className="text-text-main/75 font-semibold">
                          Rostfreie Stähle (nichtrostende Stähle) benötigen zwingend mindestens 10,5 % Chrom.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="font-bold text-text-main block">2. Wie schützt die Passivschicht?</span>
                        <p className="text-text-main/75">
                          Der gelöste Chromanteil reagiert mit Luftsauerstoff oder Feuchtigkeit zu einer unsichtbaren, dichten Chromoxid-Schicht (<FormulaText text="Cr_2O_3" />). Bei oberflächlicher Verletzung ordnet sich diese Passivschicht unter Sauerstoffzufuhr spontan neu an (Selbstheilung).
                        </p>
                        <p className="text-text-main/75">
                          Molybdän-Zusätze (Mo) erhöhen den Schutz drastisch, insbesondere gegen abrasive Salze (Winterdienst) und chloridhaltiges Wasser (Bauteile im Schwimmbadbereich).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-off-white border border-home-grau/30 rounded-xl space-y-3">
                    <span className="text-xs font-bold text-text-main block uppercase tracking-wide">
                      Bezeichnungssystem für hochlegierte Stähle (DIN EN 10027)
                    </span>
                    <div className="text-xs text-text-main/80 space-y-2">
                      <p>
                        Hochlegierte Stähle (mindestens ein Legierungselement &ge; 5 %) sind durch das Kennzeichen „X“ am Anfang ausgewiesen:
                      </p>
                      <div className="bg-white p-3 rounded border border-home-grau/15 font-mono text-center text-sm font-bold flex flex-wrap justify-center gap-2">
                        <span className="text-shiraz">X5</span>
                        <span className="text-emerald-700">CrNiMo</span>
                        <span className="text-blue-600">17-12-2</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-text-main/70 pl-2">
                        <li><strong>X:</strong> Kennzeichen für hochlegierte Stähle</li>
                        <li><strong>5:</strong> Kohlenstoffgehalt in Hundertstel-Prozent (hier 0,05 % C)</li>
                        <li><strong>CrNiMo:</strong> Chemische Symbole der Hauptlegierungselemente in absteigender Konzentration</li>
                        <li><strong>17-12-2:</strong> Direkte Gewichtsanteile der Legierungselemente in % (17 % Cr, 12 % Ni, 2 % Mo)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
    );
}
