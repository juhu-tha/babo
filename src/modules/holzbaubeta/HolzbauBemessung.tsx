import type { Hinweis } from '@/src/calc/plausibilitaet';
import type { DruckstabErgebnis } from '@/src/calc/holzbau';
import { Calculator, ShieldAlert, Scale } from 'lucide-react';
import { formatDeWert, formatDeZahl, formatDeTeX, formatDeTeXWert } from '@/src/utils/numberFormat';
import { InlineMath } from 'react-katex';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import type { Dispatch, SetStateAction } from 'react';
import type { WoodMaterial } from './daten';

interface HolzbauBemessungProps {
  calculationResults: DruckstabErgebnis;
  colB: number;
  colH: number;
  colLen: number;
  currentMaterial: WoodMaterial;
  designLoad: number;
  eulerCase: number;
  loadDuration: string;
  qpB: number;
  qpConfig: string;
  qpForce: number;
  qpL: number;
  qpOverhang: boolean;
  qpResults: { f_c90k: number; f_c90d: number; k_c90: number; l_ef: number; A_ef: number; sigma_c90d: number; stressLimit: number; F_c90Rd_kN: number; utilization: number; gamma_M: number; isUnsafe: boolean; hinweise: Hinweis[]; };
  serviceClass: number;
  setColB: Dispatch<SetStateAction<number>>;
  setColH: Dispatch<SetStateAction<number>>;
  setColLen: Dispatch<SetStateAction<number>>;
  setDesignLoad: Dispatch<SetStateAction<number>>;
  setEulerCase: Dispatch<SetStateAction<number>>;
  setLoadDuration: Dispatch<SetStateAction<string>>;
  setQpB: Dispatch<SetStateAction<number>>;
  setQpConfig: Dispatch<SetStateAction<string>>;
  setQpForce: Dispatch<SetStateAction<number>>;
  setQpL: Dispatch<SetStateAction<number>>;
  setQpOverhang: Dispatch<SetStateAction<boolean>>;
  setServiceClass: Dispatch<SetStateAction<number>>;
  setWoodClass: Dispatch<SetStateAction<string>>;
  woodClass: string;
}

export default function HolzbauBemessung({ calculationResults, colB, colH, colLen, currentMaterial, designLoad, eulerCase, loadDuration, qpB, qpConfig, qpForce, qpL, qpOverhang, qpResults, serviceClass, setColB, setColH, setColLen, setDesignLoad, setEulerCase, setLoadDuration, setQpB, setQpConfig, setQpForce, setQpL, setQpOverhang, setServiceClass, setWoodClass, woodClass }: HolzbauBemessungProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_bemessung">

        <div className="bg-amber-50 text-amber-950 p-4 rounded-xl border border-amber-200">
          <h3 className="font-bold text-sm text-amber-900 mb-1 flex items-center gap-2">
            <Calculator size={18} /> Statischer Nachweis nach Eurocode 5 (DIN EN 1995-1-1)
          </h3>
          <p className="text-xs text-amber-900/80">
            Schlanke Druckstäbe werden nach dem Ersatzstabverfahren (DIN EN 1995-1-1, 6.3.2) nachgewiesen. Der Rechner ermittelt k_c für die schwache Achse bei zentrischem Druck.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Controls Parameters Box (span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4 border border-home-grau/30 p-5 rounded-xl bg-white shadow-xs">
            <h4 className="font-bold text-text-main text-xs uppercase tracking-wider border-b border-home-grau/25 pb-2">Stützen-Parameter</h4>

            {/* Parameter Row 1: Wood class */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-text-main">Holzart / Festigkeitsklasse</label>
              <select aria-label="Holzart / Festigkeitsklasse" 
                value={woodClass} 
                onChange={(e) => setWoodClass(e.target.value)}
                className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
              >
                <option value="C24">KVH / Vollholz C24</option>
                <option value="C30">Vollholz C30 (Tragfähig)</option>
                <option value="GL24h">Brettschichtholz GL24h (Balken standard)</option>
                <option value="GL28c">Brettschichtholz GL28c (Kombiniert)</option>
                <option value="GL30h">BHS GL30h (Hochleistung)</option>
              </select>
              <span className="text-[10px] text-text-main/50 font-mono">f_c,0,k = {formatDeWert(currentMaterial.f_c0k)} N/mm², E_mean = {formatDeWert(currentMaterial.E_0mean)} N/mm²</span>
            </div>

            {/* Parameter Row 2: Service class */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main">Nutzungsklasse (NKL)</label>
                <select aria-label="Nutzungsklasse (NKL)" 
                  value={serviceClass} 
                  onChange={(e) => setServiceClass(parseInt(e.target.value))}
                  className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-medium"
                >
                  <option value={1}>NKL 1 (Beheizter Innenraum)</option>
                  <option value={2}>NKL 2 (Überdachter Außenraum)</option>
                  <option value={3}>NKL 3 (Freie Bewitterung)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main">KLED (Lastdauer)</label>
                <select aria-label="KLED (Lastdauer)" 
                  value={loadDuration} 
                  onChange={(e) => setLoadDuration(e.target.value)}
                  className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-medium"
                >
                  <option value="stnd">Ständig (z. B. Eigengewicht)</option>
                  <option value="lg">Lang (z. B. Deckenschüttung)</option>
                  <option value="mtl">Mittel (z. B. Nutzlasten)</option>
                  <option value="krt">Kurz (z. B. Schneelasten)</option>
                  <option value="sfs">Sehr kurz (z. B. Windböen)</option>
                </select>
              </div>
            </div>

            {/* Parameter Row 3: Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main">Stützenbreite b (mm)</label>
                <input aria-label="Stützenbreite b (mm)" 
                  type="number" min="0" 
                  value={colB} 
                  onChange={(e) => setColB(Math.max(60, parseInt(e.target.value) || 60))}
                  className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main">Stützenhöhe h (mm)</label>
                <input aria-label="Stützenhöhe h (mm)" 
                  type="number" min="0" 
                  value={colH} 
                  onChange={(e) => setColH(Math.max(60, parseInt(e.target.value) || 60))}
                  className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                />
              </div>
            </div>

            {/* Length and Euler conditions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main">Stützenlänge L (m)</label>
                <input aria-label="Stützenlänge L (m)" 
                  type="number" min="0" 
                  step="0.1"
                  value={colLen} 
                  onChange={(e) => setColLen(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main">Lagerung (Euler)</label>
                <select aria-label="Lagerung (Euler)" 
                  value={eulerCase} 
                  onChange={(e) => setEulerCase(parseInt(e.target.value))}
                  className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-medium"
                >
                  <option value={1}>Euler-Fall 1: Kragarm, unten eingespannt (β = 2,0)</option>
                  <option value={2}>Euler-Fall 2: beidseitig gelenkig (β = 1,0)</option>
                  <option value={3}>Euler-Fall 3: eingespannt / gelenkig (β = 0,7)</option>
                  <option value={4}>Euler-Fall 4: beidseitig eingespannt (β = 0,5)</option>
                </select>
              </div>
            </div>

            {/* Design Axial Load input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-text-main text-emerald-800">Einwirkende Druckkraft N_Ed (kN)</label>
              <div className="relative">
                <input aria-label="Einwirkende Druckkraft N_Ed (kN)" 
                  type="number" min="0" 
                  value={designLoad} 
                  onChange={(e) => setDesignLoad(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-black"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 font-mono text-[10px] font-bold text-text-main/50">kN</span>
              </div>
            </div>

          </div>

          {/* Right Results Sheet (span 7) */}
          <div className="lg:col-span-7 bg-off-white p-5 rounded-xl border border-home-grau/35 flex flex-col justify-between gap-5">

            <div>
              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Statische Nachweisergebnisse</span>
              <h3 className="font-extrabold text-text-main text-base mt-2">Biegungsknicken um die schwache Achse</h3>
            </div>

            {/* Static Equations Card */}
            <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2 shadow-xs">
              <div className="text-xs text-text-main/70">
                <span className="font-bold text-text-main block">1. Bemessungsfestigkeit <InlineMath math="f_{c,0,d}" />:</span>
                <div className="my-1 text-center bg-off-white py-1 rounded border border-home-grau/10">
                  <InlineMath math={`f_{c,0,d} = k_{mod} \\times \\frac{f_{c,0,k}}{\\gamma_{M}} = ${calculationResults.k_mod} \\times \\frac{${currentMaterial.f_c0k}}{${calculationResults.gamma_M}} = ${formatDeZahl(calculationResults.f_c0d, 2)}\\text{ N/mm}^2`} />
                </div>
              </div>

              <div className="text-xs text-text-main/70">
                <span className="font-bold text-text-main block">2. Bezogene Schlankheit <InlineMath math="\lambda_{rel,z}" /> und Knickbeiwert <InlineMath math="k_{c,z}" />:</span>
                <div className="text-xs text-text-main/80 space-y-1 mt-1 leading-normal">
                  <div>&bull; Wirksame Länge <InlineMath math="l_{ef}" />: <span className="font-mono">{formatDeZahl(calculationResults.l_ef, 0)} mm</span></div>
                  <div>&bull; Schlankheitsgrad <InlineMath math="\lambda_z" />: <span className="font-mono">{formatDeZahl(calculationResults.lambda_z, 2)}</span> (Grenzschlankheit nach EC5 = 120)</div>
                  <div>&bull; Bezogene Schlankheit <InlineMath math="\lambda_{rel,z}" />: <span className="font-mono font-bold text-text-main">{formatDeZahl(calculationResults.lambda_rel_z, 3)}</span></div>
                  <div>&bull; Knickminderungsbeiwert <InlineMath math="k_{c,z}" />: <span className="font-mono font-bold text-amber-800">{formatDeZahl(calculationResults.k_cz, 4)}</span></div>
                </div>
              </div>

              <div className="text-xs text-text-main/70">
                <span className="font-bold text-text-main block">3. Knick-Widerstandskraft <InlineMath math="F_{c,R,d}" />:</span>
                <div className="my-1 text-center bg-off-white py-1 rounded border border-home-grau/10">
                  <InlineMath math={`F_{c,R,d} = k_{c,z} \\times A \\times f_{c,0,d} = ${formatDeZahl(calculationResults.k_cz, 4)} \\times ${formatDeZahl(calculationResults.A, 0)}\\text{ mm}^2 \\times ${formatDeZahl(calculationResults.f_c0d, 2)}\\text{ N/mm}^2 = ${formatDeZahl(calculationResults.F_c_R_d_kN, 1)}\\text{ kN}`} />
                </div>
              </div>
            </div>

            <EingabeHinweise hinweise={calculationResults.hinweise} />
            {/* Performance Indicator Gauge */}
            <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-text-main">Auslastungsnachweis (N_Ed / F_c,R,d)</span>
                <span className={`text-sm font-black font-mono px-2 py-0.5 rounded ${
                    calculationResults.isUnsafe ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                  {formatDeZahl(calculationResults.utilization, 1)}% {calculationResults.isUnsafe ? 'NICHT TRAGFÄHIG' : 'ERFÜLLT'}
                </span>
              </div>

              {/* Bar representation */}
              <div className="w-full bg-home-grau/20 h-4 rounded-full overflow-hidden relative shadow-inner">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                      calculationResults.isUnsafe ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}
                  style={{ width: `${Math.min(100, calculationResults.utilization)}%` }}
                />
                {/* limit marker */}
                <div className="absolute right-[0%] top-0 bottom-0 border-l-2 border-danger/60 w-1" />
              </div>

              {calculationResults.isUnsafe && (
                <div className="flex gap-2 text-rose-900 border border-rose-200 bg-rose-50 p-2 text-[11px] rounded-lg mt-3 leading-normal">
                  <ShieldAlert size={14} className="text-rose-600 flex-shrink-0" />
                  <span>
                    <strong>Achtung:</strong> Die Druckkraft überschreitet die Knicktragfähigkeit. Querschnitt vergrößern oder Knicklänge verringern (z. B. Zwischenhalterung).
                  </span>
                </div>
              )}
            </div>

            <FormulaDerivationBox
              live
              title="Ihr Rechenweg: Knicknachweis mit den aktuellen Eingaben"
              zielGleichung={`\\frac{N_{Ed}}{k_c \\cdot A \\cdot f_{c,0,d}} = \\frac{${formatDeTeX(designLoad, 1)}}{${formatDeTeX(calculationResults.F_c_R_d_kN, 1)}} = ${formatDeTeX(calculationResults.utilization, 1)}\\,\\%`}
              normQuelle="DIN EN 1995-1-1 mit NA (DE), 6.3.2"
              schritte={[
                {
                  titel: 'Bemessungswert der Druckfestigkeit',
                  erklaerung: `${currentMaterial.class}, Nutzungsklasse ${formatDeZahl(serviceClass, 0)}: k_mod = ${formatDeZahl(calculationResults.k_mod, 2)}, γ_M = 1,3.`,
                  formel: `f_{c,0,d} = \\frac{${formatDeTeX(calculationResults.k_mod, 2)} \\cdot ${formatDeTeX(currentMaterial.f_c0k, 1)}}{${formatDeTeX(calculationResults.gamma_M, 1)}} = ${formatDeTeX(calculationResults.f_c0d, 2)}\\,\\text{N/mm}^2`,
                },
                {
                  titel: 'Knicklänge und Schlankheit',
                  erklaerung: `Euler-Fall ${formatDeZahl(eulerCase, 0)} mit β = ${formatDeZahl(calculationResults.l_ef / (colLen * 1000), 1)}; maßgebend ist der kleinere Trägheitsradius.`,
                  formel: `l_{ef} = ${formatDeTeX(calculationResults.l_ef / (colLen * 1000), 1)} \\cdot ${formatDeTeX(colLen * 1000, 0)} = ${formatDeTeX(calculationResults.l_ef, 0)}\\,\\text{mm};\\quad i = \\frac{${formatDeTeX(Math.min(colB, colH), 0)}}{\\sqrt{12}} = ${formatDeTeX(Math.min(calculationResults.iy, calculationResults.iz), 1)}\\,\\text{mm};\\quad \\lambda = ${formatDeTeX(calculationResults.lambda_z, 1)}`,
                },
                {
                  titel: 'Bezogene Schlankheit',
                  erklaerung: `Mit E_0,05 = ${formatDeZahl(calculationResults.E_05, 0)} N/mm².`,
                  formel: `\\lambda_{rel} = \\frac{\\lambda}{\\pi} \\sqrt{\\frac{f_{c,0,k}}{E_{0{,}05}}} = \\frac{${formatDeTeX(calculationResults.lambda_z, 1)}}{\\pi} \\sqrt{\\frac{${formatDeTeX(currentMaterial.f_c0k, 1)}}{${formatDeTeX(calculationResults.E_05, 0)}}} = ${formatDeTeX(calculationResults.lambda_rel_z, 3)}`,
                },
                {
                  titel: 'Knickbeiwert',
                  erklaerung: calculationResults.lambda_rel_z <= 0.3
                    ? 'λ_rel ≤ 0,3: Kein Knickeinfluss, k_c = 1,0.'
                    : `Imperfektionsbeiwert β_c = ${currentMaterial.class.startsWith('GL') ? '0,1 (Brettschichtholz)' : '0,2 (Vollholz)'}.`,
                  formel: calculationResults.lambda_rel_z <= 0.3
                    ? 'k_c = 1{,}0'
                    : `k = 0{,}5 \\,[1 + ${currentMaterial.class.startsWith('GL') ? '0{,}1' : '0{,}2'} \\cdot (${formatDeTeX(calculationResults.lambda_rel_z, 3)} - 0{,}3) + ${formatDeTeX(calculationResults.lambda_rel_z, 3)}^2] = ${formatDeTeX(0.5 * (1 + (currentMaterial.class.startsWith('GL') ? 0.1 : 0.2) * (calculationResults.lambda_rel_z - 0.3) + calculationResults.lambda_rel_z ** 2), 3)};\\quad k_c = ${formatDeTeX(calculationResults.k_cz, 4)}`,
                },
                {
                  titel: 'Knicktragfähigkeit und Ausnutzung',
                  erklaerung: calculationResults.isUnsafe ? 'Die Ausnutzung liegt über 100 %: Der Nachweis ist nicht erfüllt.' : 'Die Ausnutzung liegt unter 100 %: Der Nachweis ist erfüllt.',
                  formel: `F_{c,R,d} = ${formatDeTeX(calculationResults.k_cz, 4)} \\cdot ${formatDeTeX(calculationResults.A, 0)} \\cdot ${formatDeTeX(calculationResults.f_c0d, 2)} \\cdot 10^{-3} = ${formatDeTeX(calculationResults.F_c_R_d_kN, 1)}\\,\\text{kN};\\quad \\eta = \\frac{${formatDeTeX(designLoad, 1)}}{${formatDeTeX(calculationResults.F_c_R_d_kN, 1)}} = ${formatDeTeX(calculationResults.utilization, 1)}\\,\\%`,
                },
              ]}
              ergebnisHinweis={`Ausnutzung ${formatDeZahl(calculationResults.utilization, 1)} % (${calculationResults.isUnsafe ? 'nicht erfüllt' : 'erfüllt'})`}
            />

          </div>

        </div>

        {/* NEW INTERACTIVE: Querpressungsnachweis nach EC5 6.1.5 */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
          <div>
            <span className="text-xs uppercase font-black text-amber-800 tracking-wider">Ergänzender Tragfähigkeitsnachweis</span>
            <h3 className="font-extrabold text-text-main text-base mt-1 flex items-center gap-2">
              <Scale size={20} className="text-amber-800" /> Querpressungsnachweis nach Eurocode 5 (DIN EN 1995-1-1 Abs. 6.1.5)
            </h3>
            <p className="text-xs text-text-main/70 leading-relaxed mt-1">
              Wird Holz quer zur Faserrichtung druckbelastet (z.B. Schwellenauflager, Stützenfüße, Balkenköpfe), ist die Festigkeit deutlich geringer als parallel zur Faser. Eurocode 5 erlaubt die Berücksichtigung von Lastverteilungseffekten des überstehenden Holzes durch eine wirksame Kontaktlänge <InlineMath math="l_{ef}" /> und eine Auflagerverstärkung <InlineMath math="k_{c,90}" />.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column Input panel (span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-4 bg-off-white p-4 rounded-xl border border-home-grau/20">
              <h4 className="font-bold text-xs uppercase tracking-wider text-text-main">Auflager-Geometrie</h4>

              {/* Configuration */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main">Auflagertyp &amp; Beanspruchungsart</label>
                <select aria-label="Auflagertyp &amp; Beanspruchungsart"
                  value={qpConfig}
                  onChange={(e) => setQpConfig(e.target.value)}
                  className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                >
                  <option value="schwelle">Kontinuierliche Lagerung, Schwelle (k_c,90 = 1,25 Vollholz / 1,5 BSH)</option>
                  <option value="pfosten_riegel">Einzelauflager, l₁ ≥ 2h (k_c,90 = 1,5 Vollholz / 1,75 BSH, l ≤ 400 mm)</option>
                  <option value="traeger_ende">Allgemeiner Fall (k_c,90 = 1,0)</option>
                  <option value="clt_plate">Brettsperrholz (Wert nach ETA; hier 1,0 als Lehrannahme)</option>
                </select>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Auflagerbreite b (mm)</label>
                  <input aria-label="Auflagerbreite b (mm)"
                    type="number" min="0"
                    value={qpB}
                    onChange={(e) => setQpB(Math.max(40, parseInt(e.target.value) || 40))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Auflagerlänge l (mm)</label>
                  <input aria-label="Auflagerlänge l (mm)"
                    type="number" min="0"
                    value={qpL}
                    onChange={(e) => setQpL(Math.max(40, parseInt(e.target.value) || 40))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                  />
                </div>
              </div>

              {/* Overhang switch */}
              <div className="flex items-center justify-between border-t border-home-grau/10 pt-2.5">
                <span className="text-xs font-bold text-text-main">Überstehende Holzfasern (&gt; 150mm)?</span>
                <button
                  onClick={() => setQpOverhang(!qpOverhang)}
                  type="button"
                  className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition-all ${
                      qpOverhang
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-white text-text-main/50 border-home-grau/25'
                    }`}
                >
                  {qpOverhang ? 'Ja (+30/60 mm l_ef)' : 'Nein (l_ef = l)'}
                </button>
              </div>

              {/* Load */}
              <div className="flex flex-col gap-1 border-t border-home-grau/10 pt-2.5">
                <label className="text-xs font-bold text-emerald-800">Querpressende Einwirkung F_c,90,d (kN)</label>
                <div className="relative">
                  <input aria-label="Querpressende Einwirkung F_c,90,d (kN)"
                    type="number" min="0"
                    value={qpForce}
                    onChange={(e) => setQpForce(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-black"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 font-mono text-[10px] text-text-main/50 font-bold">kN</span>
                </div>
              </div>
            </div>

            {/* Right Column result panel (span 7) */}
            <div className="lg:col-span-7 bg-amber-50/20 border border-amber-200/50 p-5 rounded-xl flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-1">Druckfestigkeitsnachweis</span>
                <h4 className="font-extrabold text-sm text-text-main">Querpressung senkrecht zur Holzfaser</h4>
              </div>

              <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-3 shadow-xs">
                {/* Step 1 */}
                <div className="text-xs text-text-main/80 space-y-1">
                  <span className="font-bold text-text-main block">1. Wirksame Auflagerfläche <InlineMath math="A_{ef}" />:</span>
                  <p className="text-[11px] leading-relaxed">
                    Länge <InlineMath math="l" /> wird erhöht um bis zu 30 mm je Überhangseite. Wirksame Länge: <span className="font-bold font-mono text-amber-800">{formatDeWert(qpResults.l_ef)} mm</span>
                  </p>
                  <div className="my-1 bg-[#fef3c7]/20 p-1.5 rounded border border-[#fef3c7] text-center font-mono text-[11px]">
                    <InlineMath math={`A_{ef} = b \\times l_{ef} = ${formatDeTeXWert(qpB)} \\times ${formatDeTeXWert(qpResults.l_ef)} = ${formatDeTeXWert(qpResults.A_ef)}\\text{ mm}^2`} />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="text-xs text-text-main/80 space-y-1">
                  <span className="font-bold text-text-main block">2. Bemessungsquerpressfestigkeit <InlineMath math="f_{c,90,d}" />:</span>
                  <p className="text-[11px] leading-relaxed">
                    Wert für Holzart <span className="font-bold">{woodClass}</span> (<InlineMath math={`f_{c,90,k} = ${qpResults.f_c90k}\\text{ N/mm}^2`} />) modifiziert mit <InlineMath math={`k_{mod} = ${formatDeTeXWert(calculationResults.k_mod)}`} />:
                  </p>
                  <div className="my-1 bg-[#fef3c7]/20 p-1.5 rounded border border-[#fef3c7] text-center font-mono text-[11px]">
                    <InlineMath math={`f_{c,90,d} = ${calculationResults.k_mod} \\times \\frac{${qpResults.f_c90k}}{${qpResults.gamma_M}} = ${formatDeZahl(qpResults.f_c90d, 2)}\\text{ N/mm}^2`} />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="text-xs text-text-main/80 space-y-1">
                  <span className="font-bold text-text-main block">3. Spannung und Tragwiderstands-Vergleich:</span>
                  <div className="text-[11px] space-y-1 bg-stone-50 p-2 rounded border border-stone-200">
                    <div>&bull; Vorhandene Pressung <InlineMath math="\sigma_{c,90,d}" />: <span className="font-mono font-bold text-text-main">{formatDeZahl(qpResults.sigma_c90d, 2)} N/mm²</span></div>
                    <div>&bull; Zulässige Pressung <InlineMath math="k_{c,90} \cdot f_{c,90,d}" />: <span className="font-mono font-bold text-emerald-800">{formatDeZahl(qpResults.k_c90 * qpResults.f_c90d, 2)} N/mm²</span></div>
                    <div>&bull; Max. Einwirkungskraft <InlineMath math="F_{c,90,Rd}" />: <span className="font-mono font-bold text-amber-900">{formatDeZahl(qpResults.F_c90Rd_kN, 1)} kN</span></div>
                  </div>
                </div>
              </div>

              <EingabeHinweise hinweise={qpResults.hinweise} />
              {/* Performance Indicator */}
              <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-main">Ausnutzungsgrad (σ_c,90,d / k_c,90 * f_c,90,d)</span>
                  <span className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                      qpResults.isUnsafe ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                    {formatDeZahl(qpResults.utilization, 1)}% {qpResults.isUnsafe ? 'ÜBERLASTET' : 'ERFÜLLT'}
                  </span>
                </div>

                <div className="w-full bg-home-grau/20 h-3 rounded-full overflow-hidden relative shadow-inner">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                        qpResults.isUnsafe ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}
                    style={{ width: `${Math.min(100, qpResults.utilization)}%` }}
                  />
                </div>

                {qpResults.isUnsafe && (
                  <div className="flex gap-2 text-rose-900 border border-rose-200 bg-rose-50 p-2 text-[10px] rounded-lg mt-2 leading-relaxed">
                    <ShieldAlert size={14} className="text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Querdruck überschritten:</strong> Es drohen große Eindrückungen. Auflagerlänge <InlineMath math="l" /> oder Breite vergrößern bzw. Auflager verstärken (z. B. Vollgewindeschrauben).
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    );
}
