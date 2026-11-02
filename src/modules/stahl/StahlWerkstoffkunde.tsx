import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { steelGrades, steelProperties, corrosionClasses } from './daten';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import { Slider } from '@/src/components/ui/Slider';
import { Line } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import { Sparkles, Info } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import inhalt from '@/content/stahl/StahlWerkstoffkunde.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import type { Hinweis } from '@/src/calc/plausibilitaet';
import { pren as prenWirksumme, gefuegeklasse } from '@/src/calc/werkstoffmodelle';

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
  hinweiseErmuedung: readonly Hinweis[];
  hinweiseSchweissen: readonly Hinweis[];
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

export default function StahlWerkstoffkunde({ activeTab, alloyC, alloyCr, alloyMo, alloyNi, corrosion, deltaSigma, detailCategory, fy, grade, heatInput, kE, ky, m1, nR, hinweiseErmuedung, hinweiseSchweissen, plateThickness, profileType, setAlloyC, setAlloyCr, setAlloyMo, setAlloyNi, setCorrosion, setDeltaSigma, setDetailCategory, setGrade, setHeatInput, setM1, setPlateThickness, setProfileType, setTemp, stressStrainData, temp, walzResults, weldResults, woehlerData }: StahlWerkstoffkundeProps) {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
        <div className="lg:col-span-4 bg-off-white p-5 rounded-2xl border border-home-grau/25 flex flex-col gap-6">
          <h3 className="text-base font-bold text-text-main">
            Stahlwerkstoffe {activeTab === 'walzen' && inhalt.werte.walzprofile} {activeTab === 'schweissen' && '- Schweißen'} {activeTab === 'legierungen' && inhalt.werte.legierungenEdelstahl}
          </h3>

          <div className="text-sm text-text-main/80 bg-white p-4 rounded-xl border border-home-grau/20">
          {activeTab === 'allgemein' ? (
            <p><MdText text={inhalt.texte.stahlVerliertBeiHohen} /></p>
          ) : activeTab === 'walzen' ? (
            <p><MdText text={inhalt.texte.eigenspannungenInWarmgewalztenStahlprofi} /></p>
          ) : activeTab === 'schweissen' ? (
            <p><MdText text={inhalt.texte.beimSchweißenWirdLokal} /></p>
          ) : (
            <p><MdText text={inhalt.texte.edelstahlUndRostfreieStähle} /></p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Stahlsorte</label><InfoTooltip text={inhalt.werte.güteklasseDesVerwendetenStahls} /></div>
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
                  <span className="font-bold"><MdText text={inhalt.texte.t12101} /></span>
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
              <h3 className="text-sm font-bold text-text-main mb-4"><MdText text={inhalt.texte.korrosionsschutzDinEnIso} /></h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Korrosivitätskategorie</label><InfoTooltip text={inhalt.werte.einteilungDerUmgebungsbedingungenHinsich} /></div>
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
              <h3 className="text-sm font-bold text-text-main mb-4"><MdText text={inhalt.texte.brandfallTemperatureinfluss} /></h3>
              <Slider
                label="Temperatur" info={inhalt.werte.aktuelleTemperaturDesBauteils}
                min={20} max={1000} step={10}
                value={temp} unit="°C"
                onChange={(e) => setTemp(Number(e.target.value))}
              />
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
                  <div className="text-home-grau mb-1"><FormulaText text={inhalt.werte.abminderungKY} /></div>
                  <div className="font-bold text-shiraz">{formatDeZahl(ky, 2)}</div>
                </div>
                <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
                  <div className="text-home-grau mb-1"><FormulaText text={inhalt.werte.abminderungKE} /></div>
                  <div className="font-bold text-shiraz">{formatDeZahl(kE, 2)}</div>
                </div>
              </div>
              <EingabeHinweise hinweise={hinweiseErmuedung} />
            </div>

            <div className="border-t border-home-grau/30 pt-4">
              <h3 className="text-sm font-bold text-text-main mb-4"><MdText text={inhalt.texte.ermüdungKerbfall} /></h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2"><label className="text-sm font-medium text-text-main"><FormulaText text="Kerbfall \Delta\sigma_C (bei N=2\cdot 10^6)" /></label><InfoTooltip text={inhalt.werte.kerbfallFürDieErmüdungsberechnung} /></div>
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
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main"><MdText text={inhalt.texte.neigungMN5} /></label><InfoTooltip text={inhalt.werte.neigungDerWöhlerlinieFür} /></div>
                  <select aria-label={inhalt.werte.neigungMN5} 
                    className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                    value={m1}
                    onChange={(e) => setM1(Number(e.target.value))}
                  >
                    <option value={3}>3 (Stahlbau Normalfall)</option>
                    <option value={4}>4 (Sonderfälle)</option>
                    <option value={5}>5 (Hohlprofilknoten)</option>
                  </select>
                </div>

                <div className={`p-4 rounded-xl shadow-md ${nR === Infinity || nR > 1e8 ? 'bg-off-white border border-home-grau/30 text-text-main' : 'bg-shiraz text-white'} transition-colors mt-2`}>
                  <div className="text-sm opacity-90 mb-1"><MdText text={inhalt.texte.ertragbareLastwechsel} /><FormulaText text="N_R" /></div>
                  <div className="text-2xl font-bold">
                    {nR === Infinity ? inhalt.werte.dauerfest : !Number.isFinite(nR) ? '–' : nR > 1e8 ? inhalt.werte.t100MioDauerfest : nR.toExponential(2)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'walzen' && (
          <div className="border-t border-home-grau/30 pt-4">
            <h3 className="text-sm font-bold text-text-main mb-4">Profilgeometrie</h3>
            <div className="flex items-center gap-2"><label className="text-xs font-bold text-home-grau uppercase tracking-wider mb-1 block">Profiltyp</label><InfoTooltip text={inhalt.werte.artDesStahlprofilsZ} /></div>
            <select aria-label="Profiltyp" 
              value={profileType}
              onChange={(e) => setProfileType(e.target.value as 'h' | 'i')}
              className="w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:outline-none focus:border-shiraz bg-white"
            >
              <option value="h">Breitflanschprofil (z.B. HEB) - Hohe Eigenspannungen</option>
              <option value="i">Schmales I-Profil (z.B. IPE) - Geringere Eigenspannungen</option>
            </select>
            <p className="text-xs text-home-grau mt-3"><MdText text={inhalt.texte.breitflanschprofileKühlenUngleichmäßiger} /></p>
          </div>
        )}

        {activeTab === 'schweissen' && (
          <div className="border-t border-home-grau/30 pt-4">
            <h3 className="text-sm font-bold text-text-main mb-4">Schweißparameter</h3>
            <Slider label={inhalt.werte.streckenenergieHeatInput} info={inhalt.werte.eingebrachteWärmeenergieProLängeneinheit} min={500} max={3000} step={100} value={heatInput} unit="J/mm" onChange={(e) => setHeatInput(Number(e.target.value))} />
            <div className="mt-4">
              <Slider label={inhalt.werte.blechdickeT}  min={5} max={50} step={1} value={plateThickness} unit="mm" onChange={(e) => setPlateThickness(Number(e.target.value))} />
            </div>
            <p className="text-xs text-home-grau mt-3"><MdText text={inhalt.texte.eineHoheStreckenenergieBei} /></p>
            <EingabeHinweise hinweise={hinweiseSchweissen} />
          </div>
        )}

        {activeTab === 'legierungen' && (
          <div className="border-t border-home-grau/30 pt-4 space-y-4">
            <h3 className="text-sm font-bold text-text-main">Legierungs-Designer</h3>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-text-main flex items-center gap-1">Chrom (Cr) <InfoTooltip text={inhalt.werte.erhöhtKorrosionsschutzBildetAb} /></span>
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
                <span className="font-semibold text-text-main flex items-center gap-1">Nickel (Ni) <InfoTooltip text={inhalt.werte.stabilisiertGefügeAustenitbildnerErhöht} /></span>
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
                <span className="font-semibold text-text-main flex items-center gap-1"><MdText text={inhalt.texte.molybdänMo} /><InfoTooltip text={inhalt.werte.verhindertLochfraßkorrosionPittingIn} /></span>
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
                <span className="font-semibold text-text-main flex items-center gap-1"><MdText text={inhalt.texte.kohlenstoffC} /><InfoTooltip text={inhalt.werte.bestimmtHärteUndFließgrenze} /></span>
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
                ><MdText text={inhalt.texte.baustahlS235} /></button>
                <button
                  type="button"
                  onClick={() => { setAlloyCr(18.0); setAlloyNi(8.0); setAlloyMo(0); setAlloyC(0.04); }}
                  className="p-1.5 rounded bg-white hover:bg-home-grau/5 border border-home-grau/30 font-semibold text-indigo-700"
                ><MdText text={inhalt.texte.v2a14301} /></button>
                <button
                  type="button"
                  onClick={() => { setAlloyCr(17.0); setAlloyNi(12.0); setAlloyMo(2.1); setAlloyC(0.04); }}
                  className="p-1.5 rounded bg-white hover:bg-home-grau/5 border border-home-grau/30 font-semibold text-indigo-700 col-span-2"
                ><MdText text={inhalt.texte.v4a14404} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
        {activeTab === 'allgemein' && (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[350px]">
              <h3 className="text-lg font-bold text-text-main mb-4"><MdText text={inhalt.texte.spannungsDehnungsLinieBrandfall} /></h3>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={stressStrainData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { title: { display: true, text: inhalt.werte.dehnung } },
                      y: { title: { display: true, text: inhalt.werte.spannungMpa }, min: 0, max: 600 }
                    }
                  }} 
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[350px]">
              <h3 className="text-lg font-bold text-text-main mb-4"><MdText text={inhalt.texte.wöhlerlinieErmüdung} /></h3>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={woehlerData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { 
                        type: 'logarithmic',
                        title: { display: true, text: inhalt.werte.lastwechselNLog },
                        min: 1e4,
                        max: 1e8
                      },
                      y: { 
                        type: 'logarithmic',
                        title: { display: true, text: inhalt.werte.spannungsschwingbreiteMpaLog },
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
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungErmüdungKerbwirku} /></h3>
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
                <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.kerbenZBSchweißnähte} /></div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'walzen' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                <div className="text-xs text-home-grau uppercase tracking-wider mb-1"><MdText text={inhalt.texte.maxDruckeigenspannungFlanschrand} /></div>
                <div className="text-2xl font-bold text-blue-600">{formatDeZahl(walzResults.maxCompressive, 0)} MPa</div>
                <div className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.führtZuVorzeitigemFließen} /></div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                <div className="text-xs text-home-grau uppercase tracking-wider mb-1"><MdText text={inhalt.texte.maxZugeigenspannungFlanschmitte} /></div>
                <div className="text-2xl font-bold text-red-600">+{formatDeZahl(walzResults.maxTensile, 0)} MPa</div>
                <div className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.ausgleichsspannungImQuerschnitt} /></div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm h-[350px]">
              <h3 className="text-sm font-bold text-text-main mb-4"><MdText text={inhalt.texte.eigenspannungsverteilungÜberDieFlanschbr} /></h3>
              <div className="relative w-full h-[260px]">
                <Line 
                  data={walzResults.chartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      x: inhalt.daten["StahlWerkstoffkunde.options.scales.x"],
                      y: { 
                        title: { display: true, text: inhalt.werte.eigenspannungMpa },
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
                <div className="text-xs text-home-grau uppercase tracking-wider mb-1"><MdText text={inhalt.texte.maxZugeigenspannungSchweißnaht} /></div>
                <div className="text-2xl font-bold text-red-600">+{formatDeWert(fy)} MPa</div>
                <div className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.erreichtTypischerweiseDieFließgrenze} /></div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
                <div className="text-xs text-home-grau uppercase tracking-wider mb-1"><MdText text={inhalt.texte.breiteDerZugzoneB} /></div>
                <div className="text-2xl font-bold text-orange-600">{formatDeZahl(weldResults.b_t, 1)} mm</div>
                <div className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.abhängigVonStreckenenergieUnd} /></div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm h-[350px]">
              <h3 className="text-sm font-bold text-text-main mb-4"><MdText text={inhalt.texte.längseigenspannungenQuerZurSchweißnaht} /></h3>
              <div className="relative w-full h-[260px]">
                <Line 
                  data={weldResults.chartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      x: inhalt.daten["StahlWerkstoffkunde.options.scales.x_2"],
                      y: { 
                        title: { display: true, text: inhalt.werte.eigenspannungMpa2 },
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
              <h3 className="text-lg font-bold text-text-main"><MdText text={inhalt.texte.eigenschaftenDerLegierungsmischung} /></h3>
            </div>

            {(() => {
              // Wirksumme und Gefügeeinordnung aus dem Rechenkern, Texte aus dem Inhalt
              const pren = prenWirksumme(alloyCr, alloyMo);
              const TEXTE = {
                unlegiert: { category: inhalt.werte.ferritischUnlegiert, designationMatch: inhalt.werte.unlegierterBaustahlZB, corrosionRating: 'Sehr Gering', corrosionColor: 'text-red-600 bg-red-50', microstructureDesc: inhalt.werte.ferritischPerlitischeZusammensetzungKein },
                austenitisch_mo: { category: inhalt.werte.austenitischRostfreiSäurebeständig, designationMatch: inhalt.werte.nichtrostenderEdelstahlV4aZ, corrosionRating: inhalt.werte.hervorragendSäureUndChloridbeständig, corrosionColor: 'text-emerald-700 bg-emerald-50', microstructureDesc: inhalt.werte.dasNickelStabilisiertDas },
                austenitisch: { category: inhalt.werte.austenitischRostfreiSäurebeständig, designationMatch: inhalt.werte.nichtrostenderEdelstahlV2aZ, corrosionRating: inhalt.werte.hochLebensmittelindustrieHaushaltswaren, corrosionColor: 'text-sky-700 bg-sky-50', microstructureDesc: inhalt.werte.dasNickelStabilisiertDas },
                duplex: { category: inhalt.werte.duplexAustenitFerritMischgefüge, designationMatch: inhalt.werte.duplexEdelstahlZB, corrosionRating: inhalt.werte.hervorragendBisExtremHohe, corrosionColor: 'text-teal-700 bg-teal-50', microstructureDesc: inhalt.werte.bestehtAusEtwaGleichen },
                martensitisch: { category: inhalt.werte.martensitischerChromstahlHärtbar, designationMatch: inhalt.werte.martensitischerStahlZB, corrosionRating: inhalt.werte.mäßigHärtbarDurchAbschrecken, corrosionColor: 'text-amber-700 bg-amber-50', microstructureDesc: inhalt.werte.reagiertStarkAufWärmebehandlung },
                ferritisch: { category: inhalt.werte.ferritischerChromstahlRostfreiMagnetisch, designationMatch: inhalt.werte.ferritischerEdelstahlZB, corrosionRating: inhalt.werte.mäßigBisGut, corrosionColor: 'text-stone-700 bg-stone-50', microstructureDesc: inhalt.werte.rostfreiAberOhneNennenswerten },
                '–': { category: '–', designationMatch: '–', corrosionRating: '–', corrosionColor: 'text-slate-700 bg-slate-100', microstructureDesc: '–' }, // F-1
              } as const;
              const { category, designationMatch, corrosionRating, corrosionColor, microstructureDesc } = TEXTE[gefuegeklasse(alloyCr, alloyNi, alloyMo, alloyC)];

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
                        <span className="text-[10px] text-text-main/50 font-bold uppercase tracking-wider block font-semibold"><MdText text={inhalt.texte.prenCr33} /></span>
                        <div className="text-2xl font-mono font-black text-shiraz mt-1">{formatDeZahl(pren, 2)}</div>
                      </div>
                      <div className={`p-2 rounded text-xs text-center font-bold ${corrosionColor}`}>
                        Korrosionswiderstand: {corrosionRating}
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                      <Info size={16} className="text-shiraz" /><MdText text={inhalt.texte.didaktischerLeitfadenEdelstahlVs} /></h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                      <div className="space-y-2">
                        <span className="font-bold text-text-main block"><MdText text={inhalt.texte.t1IstEdelstahlImmer} /></span>
                        <p className="text-text-main/75"><MdText text={inhalt.texte.neinDasIstEin} /></p>
                        <p className="text-text-main/75 font-semibold"><MdText text={inhalt.texte.rostfreieStähleNichtrostendeStähle} /></p>
                      </div>

                      <div className="space-y-2">
                        <span className="font-bold text-text-main block"><MdText text={inhalt.texte.t2WieSchütztDie} /></span>
                        <p className="text-text-main/75"><MdText text={inhalt.texte.derGelösteChromanteilReagiert} /><FormulaText text="Cr_2O_3" /><MdText text={inhalt.texte.beiOberflächlicherVerletzungOrdnet} /></p>
                        <p className="text-text-main/75"><MdText text={inhalt.texte.molybdänZusätzeMoErhöhen} /></p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-off-white border border-home-grau/30 rounded-xl space-y-3">
                    <span className="text-xs font-bold text-text-main block uppercase tracking-wide"><MdText text={inhalt.texte.bezeichnungssystemFürHochlegierteStähle} /></span>
                    <div className="text-xs text-text-main/80 space-y-2">
                      <p><MdText text={inhalt.texte.hochlegierteStähleMindestensEin} /></p>
                      <div className="bg-white p-3 rounded border border-home-grau/15 font-mono text-center text-sm font-bold flex flex-wrap justify-center gap-2">
                        <span className="text-shiraz">X5</span>
                        <span className="text-emerald-700">CrNiMo</span>
                        <span className="text-blue-600">17-12-2</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-text-main/70 pl-2">
                        <li><MdText text={inhalt.texte.xKennzeichenFürHochlegierte} /></li>
                        <li><MdText text={inhalt.texte.t5KohlenstoffgehaltInHundertstel} /></li>
                        <li><MdText text={inhalt.texte.crnimoChemischeSymboleDer} /></li>
                        <li><MdText text={inhalt.texte.t17122Direkte} /></li>
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
