import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { Layers } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { EC2_NA_DE } from '@/src/data/normParams';
import { bemesseDurchstanzen } from '@/src/calc/durchstanzen';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';

export default function Durchstanzen() {
  const [colType, setColType] = useState<'rund' | 'rechteckig'>('rund');
  const [vEd, setVEd] = useState(500); // kN
  const [d, setD] = useState(200); // mm (mittlere statische Nutzhöhe)
  const [c, setC] = useState(400); // mm (Stützendurchmesser)
  const [cx, setCx] = useState(400); // mm (Seitenlänge x)
  const [cy, setCy] = useState(400); // mm (Seitenlänge y)
  const [fck, setFck] = useState(30); // MPa
  const [rhoL, setRhoL] = useState(0.01); // Längsbewehrungsgrad
  const [beta, setBeta] = useState(EC2_NA_DE.betaInnen); // 1.10 (Innenstütze nach NA DE)

  const results = useMemo(
    () => bemesseDurchstanzen({ form: colType, vEd, d, c, cx, cy, fck, rhoL, beta }),
    [colType, vEd, d, c, cx, cy, fck, rhoL, beta]
  );

  // Dimensions for SVG Diagram
  const svgSize = 250;
  const center = svgSize / 2;
  const maxDim = colType === 'rund' ? c + 4 * d : Math.max(cx, cy) + 4 * d;
  const padding = 20;
  const scale = (svgSize - 2 * padding) / (maxDim || 1);

  const scaledD = d * scale;
  const scaledC = c * scale;
  const scaledCx = cx * scale;
  const scaledCy = cy * scale;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" />
            Durchstanzen (Punching Shear)
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300">
            Berechnet nach DIN EN 1992-1-1 + NA (DE)
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Durchstanzen ist ein lokales Querkraftversagen von flächenhaften Bauteilen (z.B. Flachdecken oder Fundamenten) 
            im Bereich von punktförmigen Lasteinleitungen (z.B. Stützen). Der Nachweis erfolgt im kritischen 
            Rundschnitt im Abstand <FormulaText text="2d" /> vom Stützenrand nach DIN EN 1992-1-1 mit NA DE.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Geometrie &amp; Einwirkung</h3>
              
              <div className="flex flex-col gap-2 mb-4">
                <label className="text-sm font-medium text-text-main">Stützenform</label>
                <div className="flex rounded-md shadow-sm">
                  <button aria-pressed={colType === 'rund'}
                    onClick={() => setColType('rund')}
                    className={`flex-1 py-2 text-sm font-medium rounded-l-md border ${colType === 'rund' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'}`}
                  >
                    Rund
                  </button>
                  <button aria-pressed={colType === 'rechteckig'}
                    onClick={() => setColType('rechteckig')}
                    className={`flex-1 py-2 text-sm font-medium rounded-r-md border border-l-0 ${colType === 'rechteckig' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'}`}
                  >
                    Rechteckig
                  </button>
                </div>
              </div>

              {colType === 'rund' ? (
                <Slider
                  label={<FormulaText text="Stützendurchmesser c" />}
                  value={c}
                  min={200}
                  max={1000}
                  step={10}
                  onChange={(e) => setC(Number(e.target.value))}
                  unit="mm"
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Slider
                    label={<FormulaText text="Seitenlänge c_x" />}
                    value={cx}
                    min={200}
                    max={1000}
                    step={10}
                    onChange={(e) => setCx(Number(e.target.value))}
                    unit="mm"
                  />
                  <Slider
                    label={<FormulaText text="Seitenlänge c_y" />}
                    value={cy}
                    min={200}
                    max={1000}
                    step={10}
                    onChange={(e) => setCy(Number(e.target.value))}
                    unit="mm"
                  />
                </div>
              )}

              <Slider
                label={<FormulaText text="Mittlere Nutzhöhe d" />}
                value={d}
                min={100}
                max={500}
                step={10}
                onChange={(e) => setD(Number(e.target.value))}
                unit="mm"
              />
              <Slider
                label={<FormulaText text="Querkraft V_{Ed}" />}
                value={vEd}
                min={100}
                max={3000}
                step={50}
                onChange={(e) => setVEd(Number(e.target.value))}
                unit="kN"
              />
              
              <div className="flex flex-col gap-2 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <label className="font-medium text-text-main">Stützenposition (Lasterhöhungsfaktor β nach NA DE)</label>
                  <InfoTooltip text="Berücksichtigt die ungleiche Schubspannungsverteilung: 1,10 für Innenstützen, 1,40 für Randstützen, 1,50 für Eckstützen nach DIN EN 1992-1-1/NA." />
                </div>
                <select aria-label="Stützenposition (Lasterhöhungsfaktor β nach NA DE)" 
                  className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                  value={beta}
                  onChange={(e) => setBeta(Number(e.target.value))}
                >
                  <option value={EC2_NA_DE.betaInnen}>Innenstütze (β = {formatDeZahl(EC2_NA_DE.betaInnen, 2)})</option>
                  <option value={EC2_NA_DE.betaRand}>Randstütze (β = {formatDeZahl(EC2_NA_DE.betaRand, 2)})</option>
                  <option value={EC2_NA_DE.betaEcke}>Eckstütze (β = {formatDeZahl(EC2_NA_DE.betaEcke, 2)})</option>
                </select>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Material</h3>
              <Slider
                label={<FormulaText text="Betonfestigkeit f_{ck}" />}
                value={fck}
                min={20}
                max={50}
                step={5}
                onChange={(e) => setFck(Number(e.target.value))}
                unit="MPa"
              />
              <Slider
                label={<FormulaText text="Längsbewehrungsgrad \rho_l" />}
                info="Mittlerer Bewehrungsgrad der Biegezugbewehrung in x- und y-Richtung. Max. anrechenbar 0.02 (2%)."
                value={rhoL}
                min={0.002}
                max={0.03}
                step={0.001}
                onChange={(e) => setRhoL(Number(e.target.value))}
                unit="-"
              />
            </div>
          </div>

          <div className="space-y-6">
            <EingabeHinweise hinweise={results.hinweise} />
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Nachweisführung (DIN EN 1992-1-1/NA)</h3>
              
              <div className="space-y-6">
                {/* Nachweis am kritischen Rundschnitt */}
                <div className={`p-4 rounded-lg border ${results.needsReinforcement ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                    1. Kritischer Rundschnitt <FormulaText text={`u_1 = ${formatDeTeX((results.u1 / 1000), 2)}\\text{ m}`} />
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>Einwirkend <FormulaText text="v_{Ed}" />:</div>
                    <div className="font-bold">{formatDeZahl(results.vEd_stress, 3)} MPa</div>
                    <div>Widerstand <FormulaText text="v_{Rd,c}" />:</div>
                    <div className="font-bold">{formatDeZahl(results.vRdc, 3)} MPa</div>
                  </div>
                  <div className={`text-sm font-bold mt-2 ${results.needsReinforcement ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {results.needsReinforcement ? (
                      <>
                        <div className="mb-2">➜ Durchstanzbewehrung erforderlich!</div>
                        {!results.isOverloaded && (
                          <div className="font-normal text-amber-900/80 bg-amber-100 p-2 rounded-md border border-amber-200">
                            Geschätzte erf. Bewehrungsfläche je 1. und 2. Rundschnitt:<br/> 
                            <FormulaText text={`A_{sw,req} \\approx ${formatDeTeX(results.asw_req_ring, 0)} mm^2`} />
                          </div>
                        )}
                      </>
                    ) : ( 
                      'keine Durchstanzbewehrung erforderlich'
                    )}
                  </div>
                </div>

                {/* Maximaltragfähigkeit nach NA DE */}
                <div className={`p-4 rounded-lg border ${results.isOverloaded ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                    2. Maximaltragfähigkeit <FormulaText text={`v_{Rd,max} = 1{,}4 \\cdot v_{Rd,c}`} />
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>Einwirkend <FormulaText text="v_{Ed,u1}" />:</div>
                    <div className="font-bold">{formatDeZahl(results.vEd_stress, 3)} MPa</div>
                    <div>Max. Widerstand <FormulaText text="v_{Rd,max}" />:</div>
                    <div className="font-bold">{formatDeZahl(results.vRdMax, 3)} MPa</div>
                  </div>
                  <div className={`text-sm font-bold ${results.isOverloaded ? 'text-red-700' : 'text-emerald-700'}`}>
                    {results.isOverloaded ? 
                      '➜ Maximaltragfähigkeit überschritten (Druckstrebenversagen)! Deckenstärke vergrößern oder Stützenquerschnitt erweitern.' : 
                      '➜ Maximaltragfähigkeit eingehalten (v_Ed ≤ v_Rd,max).'}
                  </div>
                </div>
              </div>
            </div>

            <FormulaDerivationBox
              live
              title="Ihr Rechenweg: Durchstanznachweis mit den aktuellen Eingaben"
              zielGleichung={`v_{Ed} = \\frac{\\beta \\cdot V_{Ed}}{u_1 \\cdot d} = ${formatDeTeX(results.vEd_stress, 3)} \;${results.needsReinforcement ? '>' : '\\le'}\; v_{Rd,c} = ${formatDeTeX(results.vRdc, 3)}\\,\\text{N/mm}^2`}
              normQuelle="DIN EN 1992-1-1 mit NA (DE), 6.4"
              schritte={[
                {
                  titel: 'Rundschnitte',
                  erklaerung: colType === 'rund'
                    ? 'Kreisförmige Stütze: Stützenumfang u₀ und kritischer Rundschnitt u₁ im Abstand 2d.'
                    : 'Rechteckstütze: Stützenumfang u₀; der kritische Rundschnitt u₁ im Abstand 2d hat ausgerundete Ecken.',
                  formel: colType === 'rund'
                    ? `u_0 = \\pi \\cdot ${formatDeTeX(c, 0)} = ${formatDeTeX(results.u0, 0)}\\,\\text{mm};\\quad u_1 = \\pi \\cdot (${formatDeTeX(c, 0)} + 4 \\cdot ${formatDeTeX(d, 0)}) = ${formatDeTeX(results.u1, 0)}\\,\\text{mm}`
                    : `u_0 = 2 \\cdot (${formatDeTeX(cx, 0)} + ${formatDeTeX(cy, 0)}) = ${formatDeTeX(results.u0, 0)}\\,\\text{mm};\\quad u_1 = u_0 + 4\\pi \\cdot ${formatDeTeX(d, 0)} = ${formatDeTeX(results.u1, 0)}\\,\\text{mm}`,
                },
                {
                  titel: 'Einwirkende Schubspannung',
                  erklaerung: `Lasterhöhungsfaktor β = ${formatDeZahl(beta, 2)} für die gewählte Stützenposition.`,
                  formel: `v_{Ed} = \\frac{${formatDeTeX(beta, 2)} \\cdot ${formatDeTeX(vEd * 1000, 0)}}{${formatDeTeX(results.u1, 0)} \\cdot ${formatDeTeX(d, 0)}} = ${formatDeTeX(results.vEd_stress, 3)}\\,\\text{N/mm}^2`,
                },
                {
                  titel: 'Beiwerte für den Betonwiderstand',
                  erklaerung: results.u0_d < 4
                    ? `Wegen u₀/d = ${formatDeZahl(results.u0_d, 2)} < 4 wird C_Rd,c nach NA (DE) abgemindert; ρ_l ist auf min(0,02; 0,5 · f_cd/f_yd) begrenzt.`
                    : `u₀/d = ${formatDeZahl(results.u0_d, 2)} ≥ 4, daher C_Rd,c = 0,18/γ_c; ρ_l ist auf min(0,02; 0,5 · f_cd/f_yd) begrenzt.`,
                  formel: `k = \\min\\left(1 + \\sqrt{\\tfrac{200}{${formatDeTeX(d, 0)}}};\\, 2\\right) = ${formatDeTeX(Math.min(1 + Math.sqrt(200 / d), 2.0), 3)};\\quad \\rho_l = ${formatDeTeX(results.rhoL_eff, 4)};\\quad C_{Rd,c} = ${formatDeTeX(results.CRdc, 4)}`,
                },
                {
                  titel: 'Durchstanzwiderstand ohne Bewehrung',
                  erklaerung: 'Der größere Wert aus der Bemessungsgleichung und der Mindesttragfähigkeit v_min ist maßgebend.',
                  formel: `v_{Rd,c} = \\max\\left(${formatDeTeX(results.CRdc, 4)} \\cdot ${formatDeTeX(Math.min(1 + Math.sqrt(200 / d), 2.0), 3)} \\cdot (100 \\cdot ${formatDeTeX(results.rhoL_eff, 4)} \\cdot ${formatDeTeX(fck, 0)})^{1/3};\; v_{min} = ${formatDeTeX((0.0525 / EC2_NA_DE.gammaC) * Math.pow(Math.min(1 + Math.sqrt(200 / d), 2.0), 1.5) * Math.sqrt(fck), 3)}\\right) = ${formatDeTeX(results.vRdc, 3)}\\,\\text{N/mm}^2`,
                },
                {
                  titel: 'Maximaltragfähigkeit',
                  erklaerung: results.isOverloaded
                    ? 'v_Ed > v_Rd,max: Der Nachweis ist auch mit Durchstanzbewehrung nicht erfüllbar.'
                    : 'v_Ed ≤ v_Rd,max: Die Maximaltragfähigkeit ist eingehalten.',
                  formel: `v_{Rd,max} = ${formatDeTeX(EC2_NA_DE.vRdMaxFaktor_u1, 1)} \\cdot ${formatDeTeX(results.vRdc, 3)} = ${formatDeTeX(results.vRdMax, 3)}\\,\\text{N/mm}^2 \;${results.isOverloaded ? '<' : '\\ge'}\; v_{Ed} = ${formatDeTeX(results.vEd_stress, 3)}\\,\\text{N/mm}^2`,
                },
                {
                  titel: 'Durchstanzbewehrung je Reihe',
                  erklaerung: results.needsReinforcement && !results.isOverloaded
                    ? 'Abschätzung nach Gl. (6.52) mit s_r = 0,75 · d und f_ywd,ef = 250 + 0,25 · d ≤ f_yd (ohne Faktoren κ_sw).'
                    : results.needsReinforcement
                      ? 'Keine Bemessung möglich, da v_Rd,max überschritten ist.'
                      : 'v_Ed ≤ v_Rd,c: Es ist keine Durchstanzbewehrung erforderlich.',
                  formel: results.needsReinforcement && !results.isOverloaded
                    ? `A_{sw} = \\frac{(${formatDeTeX(results.vEd_stress, 3)} - 0{,}75 \\cdot ${formatDeTeX(results.vRdc, 3)}) \\cdot ${formatDeTeX(results.u1, 0)} \\cdot ${formatDeTeX(d, 0)}}{2{,}0 \\cdot ${formatDeTeX(Math.min(250 + 0.25 * d, 500 / EC2_NA_DE.gammaS), 1)}} = ${formatDeTeX(results.asw_req_ring, 0)}\\,\\text{mm}^2`
                    : `A_{sw} = 0`,
                },
              ]}
              ergebnisHinweis={results.isOverloaded ? 'v_Rd,max überschritten – Querschnitt vergrößern' : results.needsReinforcement ? `Durchstanzbewehrung je Reihe ≈ ${formatDeZahl(results.asw_req_ring, 0)} mm²` : 'Keine Durchstanzbewehrung erforderlich'}
            />

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung (Draufsicht)</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4 relative overflow-hidden">
                <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="overflow-visible">
                  {colType === 'rund' ? (
                    <>
                      <circle cx={center} cy={center} r={scaledC / 2} fill="#64748b" />
                      <circle cx={center} cy={center} r={scaledC / 2 + 2 * scaledD} fill="none" stroke="#A3113E" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1={center + scaledC / 2} y1={center} x2={center + scaledC / 2 + 2 * scaledD} y2={center} stroke="#1e293b" strokeWidth="1.5" />
                      <line x1={center + scaledC / 2} y1={center - 4} x2={center + scaledC / 2} y2={center + 4} stroke="#1e293b" strokeWidth="1.5" />
                      <line x1={center + scaledC / 2 + 2 * scaledD} y1={center - 4} x2={center + scaledC / 2 + 2 * scaledD} y2={center + 4} stroke="#1e293b" strokeWidth="1.5" />
                      <text x={center + scaledC / 2 + scaledD} y={center - 6} fontSize="10" fill="#1e293b" fontWeight="bold" textAnchor="middle">2d</text>
                    </>
                  ) : (
                    <>
                      <rect x={center - scaledCx / 2} y={center - scaledCy / 2} width={scaledCx} height={scaledCy} fill="#64748b" />
                      
                      <path d={`
                        M ${center - scaledCx / 2} ${center - scaledCy / 2 - 2 * scaledD}
                        L ${center + scaledCx / 2} ${center - scaledCy / 2 - 2 * scaledD}
                        A ${2 * scaledD} ${2 * scaledD} 0 0 1 ${center + scaledCx / 2 + 2 * scaledD} ${center - scaledCy / 2}
                        L ${center + scaledCx / 2 + 2 * scaledD} ${center + scaledCy / 2}
                        A ${2 * scaledD} ${2 * scaledD} 0 0 1 ${center + scaledCx / 2} ${center + scaledCy / 2 + 2 * scaledD}
                        L ${center - scaledCx / 2} ${center + scaledCy / 2 + 2 * scaledD}
                        A ${2 * scaledD} ${2 * scaledD} 0 0 1 ${center - scaledCx / 2 - 2 * scaledD} ${center + scaledCy / 2}
                        L ${center - scaledCx / 2 - 2 * scaledD} ${center - scaledCy / 2}
                        A ${2 * scaledD} ${2 * scaledD} 0 0 1 ${center - scaledCx / 2} ${center - scaledCy / 2 - 2 * scaledD}
                        Z
                      `} fill="none" stroke="#A3113E" strokeWidth="2" strokeDasharray="4 4" />
                      
                      <line x1={center + scaledCx / 2} y1={center} x2={center + scaledCx / 2 + 2 * scaledD} y2={center} stroke="#1e293b" strokeWidth="1.5" />
                      <line x1={center + scaledCx / 2} y1={center - 4} x2={center + scaledCx / 2} y2={center + 4} stroke="#1e293b" strokeWidth="1.5" />
                      <line x1={center + scaledCx / 2 + 2 * scaledD} y1={center - 4} x2={center + scaledCx / 2 + 2 * scaledD} y2={center + 4} stroke="#1e293b" strokeWidth="1.5" />
                      <text x={center + scaledCx / 2 + scaledD} y={center - 6} fontSize="10" fill="#1e293b" fontWeight="bold" textAnchor="middle">2d</text>
                    </>
                  )}
                  <text x={center} y={colType === 'rund' ? "15" : center - scaledCy / 2 - 2 * scaledD - 10} fontSize="12" fill="#A3113E" textAnchor="middle">Kritischer Rundschnitt u₁</text>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-6 z-10 relative">
                  Der kritische Rundschnitt <FormulaText text="u_1" /> liegt im Abstand <FormulaText text="2d" /> vom Stützenrand. Hier wird geprüft, ob der Beton die Querkraft ohne zusätzliche Bewehrung aufnehmen kann.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-text-main/60 leading-relaxed">
        Vereinfachung: Die Durchstanzbewehrung wird je Bewehrungsreihe mit 1,5·d/s_r = 2,0 (s_r = 0,75·d) ermittelt.
        Erhöhungsfaktoren nach NA (κ_sw,1 = 2,5 für die 1. Reihe, κ_sw,2 = 1,4 für die 2. Reihe, ab 3. Reihe 1,0) sind nicht berücksichtigt.
      </p>
      <CalculatorDisclaimerBanner className="my-2" />
    </div>
  );
}
