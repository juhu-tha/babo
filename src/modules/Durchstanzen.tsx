import { Layers } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { EC2_NA_DE } from '@/src/data/normParams';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';

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

  const results = useMemo(() => {
    // 1. Kritischer Rundschnitt u1 (Abstand 2d von der Stütze) und Stützenumfang u0
    let u1 = 0;
    let u0 = 0;
    
    if (colType === 'rund') {
      u0 = Math.PI * c;
      u1 = Math.PI * (c + 4 * d);
    } else {
      u0 = 2 * (cx + cy);
      u1 = 2 * (cx + cy) + 4 * Math.PI * d;
    }

    // 2. Einwirkende Querkraftspannung im kritischen Rundschnitt u1
    const vEd_stress = (beta * vEd * 1000) / (u1 * d); // MPa (N/mm²)

    // 3. Durchstanzwiderstand ohne Durchstanzbewehrung (v_Rd,c) nach DIN EN 1992-1-1/NA DE
    const k = Math.min(1 + Math.sqrt(200 / d), 2.0);
    const rhoL_eff = Math.min(rhoL, 0.02);
    
    // CRd,c nach NA DE aus zentraler Registry
    const u0_d = u0 / d;
    let CRdc = EC2_NA_DE.CRdc_Durchstanz;
    if (u0_d < 4) {
      CRdc = EC2_NA_DE.CRdc_Durchstanz * (0.1 * u0_d + 0.6);
    }

    const vMin = (0.0525 / EC2_NA_DE.gammaC) * Math.pow(k, 1.5) * Math.sqrt(fck);
    let vRdc = CRdc * k * Math.pow(100 * rhoL_eff * fck, 1 / 3);
    if (vRdc < vMin) {
      vRdc = vMin;
    }

    // 4. Maximaler Durchstanzwiderstand nach NA DE: v_Rd,max = 1.4 * v_Rd,c (im Rundschnitt u1)
    const vRdMax = EC2_NA_DE.vRdMaxFaktor_u1 * vRdc;

    const needsReinforcement = vEd_stress > vRdc;
    const isOverloaded = vEd_stress > vRdMax;

    // 5. Erforderliche Durchstanzbewehrung abschätzen (pro Rundschnitt der Form u1)
    let asw_req_ring = 0;
    if (needsReinforcement && !isOverloaded) {
      const v_s = vEd_stress - 0.75 * vRdc;
      const fywd_ef = Math.min(250 + 0.25 * d, 435); 
      asw_req_ring = (v_s * u1 * d) / (2.0 * fywd_ef);
    }

    return {
      u1,
      u0,
      u0_d,
      CRdc,
      vEd_stress,
      vRdc,
      vRdMax,
      needsReinforcement,
      isOverloaded,
      asw_req_ring
    };
  }, [colType, vEd, d, c, cx, cy, fck, rhoL, beta]);

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
                  <button
                    onClick={() => setColType('rund')}
                    className={`flex-1 py-2 text-sm font-medium rounded-l-md border ${colType === 'rund' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'}`}
                  >
                    Rund
                  </button>
                  <button
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
                <select 
                  className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                  value={beta}
                  onChange={(e) => setBeta(Number(e.target.value))}
                >
                  <option value={EC2_NA_DE.betaInnen}>Innenstütze (β = {EC2_NA_DE.betaInnen.toFixed(2)})</option>
                  <option value={EC2_NA_DE.betaRand}>Randstütze (β = {EC2_NA_DE.betaRand.toFixed(2)})</option>
                  <option value={EC2_NA_DE.betaEcke}>Eckstütze (β = {EC2_NA_DE.betaEcke.toFixed(2)})</option>
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
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Nachweisführung (DIN EN 1992-1-1/NA)</h3>
              
              <div className="space-y-6">
                {/* Nachweis am kritischen Rundschnitt */}
                <div className={`p-4 rounded-lg border ${results.needsReinforcement ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                    1. Kritischer Rundschnitt <FormulaText text={`u_1 = ${(results.u1 / 1000).toFixed(2)}\\text{ m}`} />
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>Einwirkend <FormulaText text="v_{Ed}" />:</div>
                    <div className="font-bold">{results.vEd_stress.toFixed(3)} MPa</div>
                    <div>Widerstand <FormulaText text="v_{Rd,c}" />:</div>
                    <div className="font-bold">{results.vRdc.toFixed(3)} MPa</div>
                  </div>
                  <div className={`text-sm font-bold mt-2 ${results.needsReinforcement ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {results.needsReinforcement ? (
                      <>
                        <div className="mb-2">➜ Durchstanzbewehrung erforderlich!</div>
                        {!results.isOverloaded && (
                          <div className="font-normal text-amber-900/80 bg-amber-100 p-2 rounded-md border border-amber-200">
                            Geschätzte erf. Bewehrungsfläche je 1. und 2. Rundschnitt:<br/> 
                            <FormulaText text={`A_{sw,req} \\approx ${results.asw_req_ring.toFixed(0)} mm^2`} />
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
                    <div className="font-bold">{results.vEd_stress.toFixed(3)} MPa</div>
                    <div>Max. Widerstand <FormulaText text="v_{Rd,max}" />:</div>
                    <div className="font-bold">{results.vRdMax.toFixed(3)} MPa</div>
                  </div>
                  <div className={`text-sm font-bold ${results.isOverloaded ? 'text-red-700' : 'text-emerald-700'}`}>
                    {results.isOverloaded ? 
                      '➜ Maximaltragfähigkeit überschritten (Druckstrebenversagen)! Deckenstärke vergrößern oder Stützenquerschnitt erweitern.' : 
                      '➜ Maximaltragfähigkeit eingehalten (v_Ed ≤ v_Rd,max).'}
                  </div>
                </div>
              </div>
            </div>

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

      <CalculatorDisclaimerBanner className="my-2" />
      <ModuleFooter
        wikipedia={[
          { title: 'Durchstanzen', url: 'https://de.wikipedia.org/wiki/Durchstanzen' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1:2023-08 / DIN EN 1992-1-1/NA:2013-04 (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken - Abschnitt 6.4: Durchstanzen)', url: 'https://www.dinmedia.de/' }
        ]}
        literatur={[
          'Zilch, K., Zehetmaier, G.: Bemessung im Konstruktiven Betonbau (2010)'
        ]}
        formeln={[
          {
            erklaerung: "Einwirkende Durchstanz-Schubspannung\nv_{Ed}: Bemessungswert der einwirkenden Durchstanzspannung [MPa]\n\\beta: Beiwert zur Berücksichtigung der Lastexzentrizität (1,10 Innen-, 1,40 Rand-, 1,50 Eckstütze nach NA DE)\nV_{Ed}: Einwirkende Querkraft [kN]\nu_1: Länge des kritischen Rundschnitts im Abstand 2d [mm]\nd: Mittlere statische Nutzhöhe [mm]",
            formel: "v_{Ed} = \\frac{\\beta \\cdot V_{Ed}}{u_1 \\cdot d}"
          },
          {
            erklaerung: "Durchstanzwiderstand ohne Durchstanzbewehrung nach DIN EN 1992-1-1/NA\nv_{Rd,c}: Durchstanzwiderstand ohne Bewehrung [MPa]\nC_{Rd,c}: Beiwert (0{,}18 / \\gamma_c für u_0/d \\geq 4, sonst (0{,}18/\\gamma_c) \\cdot (0{,}1 \\cdot u_0/d + 0{,}6))\nk: Maßstabsfaktor (1 + \\sqrt{200/d} \\leq 2.0)\n\\rho_l: Mittlerer Längsbewehrungsgrad (\\leq 0.02)\nf_{ck}: Charakteristische Betondruckfestigkeit [MPa]",
            formel: "v_{Rd,c} = C_{Rd,c} \\cdot k \\cdot (100 \\cdot \\rho_l \\cdot f_{ck})^{1/3}"
          },
          {
            erklaerung: "Maximaler Durchstanzwiderstand nach NA DE\nv_{Rd,max}: Maximaler Durchstanzwiderstand im Rundschnitt u_1 [MPa]\nv_{Rd,c}: Durchstanzwiderstand ohne Bewehrung [MPa]. Der europäische Nachweis mit 0,4 * nu * fcd am Stützenrand entfällt in Deutschland.",
            formel: "v_{Rd,max} = 1{,}4 \\cdot v_{Rd,c}"
          }
        ]}
      />
    </div>
  );
}
