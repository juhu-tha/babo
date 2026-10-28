import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { Layers } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { EC2_NA_DE } from '@/src/data/normParams';
import { bemesseDurchstanzen, betaNaDe } from '@/src/calc/durchstanzen';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import inhalt from '@/content/durchstanzen/Durchstanzen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

export default function Durchstanzen() {
  const [colType, setColType] = useState<'rund' | 'rechteckig'>('rund');
  const [vEd, setVEd] = useState(500); // kN
  const [d, setD] = useState(200); // mm (mittlere statische Nutzhöhe)
  const [c, setC] = useState(400); // mm (Stützendurchmesser)
  const [cx, setCx] = useState(400); // mm (Seitenlänge x)
  const [cy, setCy] = useState(400); // mm (Seitenlänge y)
  const [fck, setFck] = useState(30); // MPa
  const [rhoL, setRhoL] = useState(0.01); // Längsbewehrungsgrad
  const [lage, setLage] = useState<'innen' | 'rand' | 'ecke'>('innen');
  const [aRand, setARand] = useState(0); // mm, Abstand Stützenaußenkante – freier Rand (Rand-/Eckstütze)
  const beta = betaNaDe(lage); // NA DE 6.4.3(6): 1,10 / 1,40 / 1,50

  const results = useMemo(
    () => bemesseDurchstanzen({ form: colType, vEd, d, c, cx, cy, fck, rhoL, lage, aRand: lage === 'innen' ? 0 : aRand }),
    [colType, vEd, d, c, cx, cy, fck, rhoL, lage, aRand]
  );
  const randnah = lage !== 'innen' && results.u1 < results.u1Voll - 1e-9;

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
  // Draufsicht Rand-/Eckstütze (Bild 6.15): freier Rand oben (Rand und Ecke) und links (Ecke); Randabstand zeichnerisch <= 2d
  const halbX = colType === 'rund' ? scaledC / 2 : scaledCx / 2;
  const halbY = colType === 'rund' ? scaledC / 2 : scaledCy / 2;
  const aZeich = Math.min(aRand, 2 * d) * scale;
  const randOben = center - halbY - aZeich;
  const randLinks = center - halbX - aZeich;
  const r1Zeich = colType === 'rund' ? scaledC / 2 + 2 * scaledD : 2 * scaledD;
  const clipOben = lage === 'innen' ? -svgSize : colType === 'rund' ? center : center - halbY;
  const clipLinks = lage === 'ecke' ? (colType === 'rund' ? center : center - halbX) : -svgSize;
  const seiteX = colType === 'rund' ? center + r1Zeich : center + halbX + 2 * scaledD;
  const seiteY = colType === 'rund' ? center + r1Zeich : center + halbY + 2 * scaledD;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /><MdText text={inhalt.texte.durchstanzenPunchingShear} /></h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300"><MdText text={inhalt.texte.berechnetNachDinEn} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.durchstanzenIstEinLokales} /><FormulaText text="2d" /><MdText text={inhalt.texte.vomStützenrandNachDin} /></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.geometrieEinwirkung} /></h3>
              
              <div className="flex flex-col gap-2 mb-4">
                <label className="text-sm font-medium text-text-main">Stützenform</label>
                <AuswahlGruppe label="Stützenform" className="flex rounded-md shadow-sm">
                  <button {...alsOption(colType === 'rund')}
                    onClick={() => setColType('rund')}
                    className={`flex-1 py-2 text-sm font-medium rounded-l-md border ${colType === 'rund' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'}`}
                  >
                    Rund
                  </button>
                  <button {...alsOption(colType === 'rechteckig')}
                    onClick={() => setColType('rechteckig')}
                    className={`flex-1 py-2 text-sm font-medium rounded-r-md border border-l-0 ${colType === 'rechteckig' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'}`}
                  >
                    Rechteckig
                  </button>
                </AuswahlGruppe>
              </div>

              {colType === 'rund' ? (
                <Slider
                  label={<FormulaText text={inhalt.werte.stützendurchmesserC} />}
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
                    label={<FormulaText text={inhalt.werte.seitenlängeCX} />}
                    value={cx}
                    min={200}
                    max={1000}
                    step={10}
                    onChange={(e) => setCx(Number(e.target.value))}
                    unit="mm"
                  />
                  <Slider
                    label={<FormulaText text={inhalt.werte.seitenlängeCY} />}
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
                label={<FormulaText text={inhalt.werte.mittlereNutzhöheD} />}
                value={d}
                min={100}
                max={500}
                step={10}
                onChange={(e) => setD(Number(e.target.value))}
                unit="mm"
              />
              <Slider
                label={<FormulaText text={inhalt.werte.querkraftVEd} />}
                value={vEd}
                min={100}
                max={3000}
                step={50}
                onChange={(e) => setVEd(Number(e.target.value))}
                unit="kN"
              />
              
              <div className="flex flex-col gap-2 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <label className="font-medium text-text-main"><MdText text={inhalt.texte.stützenpositionLasterhöhungsfaktorNachNa} /></label>
                  <InfoTooltip text={inhalt.werte.berücksichtigtDieUngleicheSchubspannungs} />
                </div>
                <select aria-label={inhalt.werte.stützenpositionLasterhöhungsfaktorNachNa} 
                  className="p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                  value={lage}
                  onChange={(e) => setLage(e.target.value as 'innen' | 'rand' | 'ecke')}
                >
                  <option value="innen">Innenstütze (β = {formatDeZahl(EC2_NA_DE.betaInnen, 2)})</option>
                  <option value="rand">Randstütze (β = {formatDeZahl(EC2_NA_DE.betaRand, 2)})</option>
                  <option value="ecke">Eckstütze (β = {formatDeZahl(EC2_NA_DE.betaEcke, 2)})</option>
                </select>
              </div>
              {lage !== 'innen' && (
                <div className="mt-4">
                  <Slider
                    label={inhalt.werte.randabstandStützeFreierRand}
                    info={inhalt.werte.randabstandInfo}
                    value={aRand}
                    min={0}
                    max={1000}
                    step={10}
                    onChange={(e) => setARand(Number(e.target.value))}
                    unit="mm"
                  />
                </div>
              )}
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Material</h3>
              <Slider
                label={<FormulaText text={inhalt.werte.betonfestigkeitFCk} />}
                value={fck}
                min={20}
                max={50}
                step={5}
                onChange={(e) => setFck(Number(e.target.value))}
                unit="MPa"
              />
              <Slider
                label={<FormulaText text="Längsbewehrungsgrad \rho_l" />}
                info={inhalt.werte.mittlererBewehrungsgradDerBiegezugbewehr}
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
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.nachweisführungDinEn1992} /></h3>
              
              <div className="space-y-6">
                {/* Nachweis am kritischen Rundschnitt */}
                <div className={`p-4 rounded-lg border ${results.needsReinforcement ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><MdText text={inhalt.texte.t1KritischerRundschnitt} /><FormulaText text={`u_1 = ${formatDeTeX((results.u1 / 1000), 2)}\\text{ m}`} />
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
                        <div className="mb-2"><MdText text={inhalt.texte.durchstanzbewehrungErforderlich} /></div>
                        {!results.isOverloaded && (
                          <div className="font-normal text-amber-900/80 bg-amber-100 p-2 rounded-md border border-amber-200"><MdText text={inhalt.texte.geschätzteErfBewehrungsflächeJe} /><FormulaText text={`A_{sw,req} \\approx ${formatDeTeX(results.asw_req_ring, 0)} mm^2`} />
                          </div>
                        )}
                      </>
                    ) : ( 
                      inhalt.werte.keineDurchstanzbewehrungErforderlich
                    )}
                  </div>
                </div>

                {/* Maximaltragfähigkeit nach NA DE */}
                <div className={`p-4 rounded-lg border ${results.isOverloaded ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><MdText text={inhalt.texte.t2Maximaltragfähigkeit} /><FormulaText text={`v_{Rd,max} = 1{,}4 \\cdot v_{Rd,c}`} />
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>Einwirkend <FormulaText text="v_{Ed,u1}" />:</div>
                    <div className="font-bold">{formatDeZahl(results.vEd_stress, 3)} MPa</div>
                    <div><MdText text={inhalt.texte.maxWiderstand} /><FormulaText text="v_{Rd,max}" />:</div>
                    <div className="font-bold">{formatDeZahl(results.vRdMax, 3)} MPa</div>
                  </div>
                  <div className={`text-sm font-bold ${results.isOverloaded ? 'text-red-700' : 'text-emerald-700'}`}>
                    {results.isOverloaded ? 
                      inhalt.werte.maximaltragfähigkeitÜberschrittenDruckst : 
                      inhalt.werte.maximaltragfähigkeitEingehaltenVEd}
                  </div>
                </div>
              </div>
            </div>

            <FormulaDerivationBox
              live
              title={inhalt.werte.ihrRechenwegDurchstanznachweisMit}
              zielGleichung={`v_{Ed} = \\frac{\\beta \\cdot V_{Ed}}{u_1 \\cdot d} = ${formatDeTeX(results.vEd_stress, 3)} \\;${results.needsReinforcement ? '>' : '\\le'}\\; v_{Rd,c} = ${formatDeTeX(results.vRdc, 3)}\\,\\text{N/mm}^2`}
              normQuelle={inhalt.werte.dinEn19921}
              schritte={[
                {
                  titel: 'Rundschnitte',
                  erklaerung: lage !== 'innen'
                    ? `${lage === 'rand' ? inhalt.werte.rundschnittRandstütze : inhalt.werte.rundschnittEckstütze} ${randnah ? inhalt.werte.randnaherRundschnittMaßgebend : inhalt.werte.vollerRundschnittMaßgebend}`
                    : colType === 'rund'
                    ? inhalt.werte.kreisförmigeStützeStützenumfangU
                    : inhalt.werte.rechteckstützeStützenumfangUDer,
                  formel: lage !== 'innen'
                    ? (randnah
                      ? (colType === 'rund'
                        ? (lage === 'rand'
                          ? `u_1 = \\pi \\cdot (\\tfrac{${formatDeTeX(c, 0)}}{2} + 2 \\cdot ${formatDeTeX(d, 0)}) + ${formatDeTeX(c, 0)} + 2 \\cdot ${formatDeTeX(aRand, 0)} = ${formatDeTeX(results.u1, 0)}\\,\\text{mm}`
                          : `u_1 = \\tfrac{\\pi}{2} \\cdot (\\tfrac{${formatDeTeX(c, 0)}}{2} + 2 \\cdot ${formatDeTeX(d, 0)}) + ${formatDeTeX(c, 0)} + 2 \\cdot ${formatDeTeX(aRand, 0)} = ${formatDeTeX(results.u1, 0)}\\,\\text{mm}`)
                        : (lage === 'rand'
                          ? `u_1 = ${formatDeTeX(cx, 0)} + 2 \\cdot (${formatDeTeX(cy, 0)} + ${formatDeTeX(aRand, 0)}) + 2\\pi \\cdot ${formatDeTeX(d, 0)} = ${formatDeTeX(results.u1, 0)}\\,\\text{mm}`
                          : `u_1 = ${formatDeTeX(cx, 0)} + ${formatDeTeX(cy, 0)} + 2 \\cdot ${formatDeTeX(aRand, 0)} + \\pi \\cdot ${formatDeTeX(d, 0)} = ${formatDeTeX(results.u1, 0)}\\,\\text{mm}`))
                      : `u_{1,\\text{voll}} = ${formatDeTeX(results.u1Voll, 0)}\\,\\text{mm} \\le u_{1,\\text{Rand}}`) + `;\\quad u_0 = ${formatDeTeX(results.u0, 0)}\\,\\text{mm}`
                    : colType === 'rund'
                    ? `u_0 = \\pi \\cdot ${formatDeTeX(c, 0)} = ${formatDeTeX(results.u0, 0)}\\,\\text{mm};\\quad u_1 = \\pi \\cdot (${formatDeTeX(c, 0)} + 4 \\cdot ${formatDeTeX(d, 0)}) = ${formatDeTeX(results.u1, 0)}\\,\\text{mm}`
                    : `u_0 = 2 \\cdot (${formatDeTeX(cx, 0)} + ${formatDeTeX(cy, 0)}) = ${formatDeTeX(results.u0, 0)}\\,\\text{mm};\\quad u_1 = u_0 + 4\\pi \\cdot ${formatDeTeX(d, 0)} = ${formatDeTeX(results.u1, 0)}\\,\\text{mm}`,
                },
                {
                  titel: inhalt.werte.einwirkendeSchubspannung,
                  erklaerung: `Lasterhöhungsfaktor β = ${formatDeZahl(beta, 2)} für die gewählte Stützenposition.`,
                  formel: `v_{Ed} = \\frac{${formatDeTeX(beta, 2)} \\cdot ${formatDeTeX(vEd * 1000, 0)}}{${formatDeTeX(results.u1, 0)} \\cdot ${formatDeTeX(d, 0)}} = ${formatDeTeX(results.vEd_stress, 3)}\\,\\text{N/mm}^2`,
                },
                {
                  titel: inhalt.werte.beiwerteFürDenBetonwiderstand,
                  erklaerung: results.u0_d < 4 && lage === 'innen'
                    ? `Wegen u₀/d = ${formatDeZahl(results.u0_d, 2)} < 4 wird C_Rd,c bei der Innenstütze nach NA (DE) abgemindert; ρ_l ist auf min(0,02; 0,5 · f_cd/f_yd) begrenzt.`
                    : results.u0_d < 4
                    ? `u₀/d = ${formatDeZahl(results.u0_d, 2)} < 4, die Abminderung von C_Rd,c gilt nach NA (DE) aber nur für Innenstützen: C_Rd,c = 0,18/γ_c; ρ_l ist auf min(0,02; 0,5 · f_cd/f_yd) begrenzt.`
                    : `u₀/d = ${formatDeZahl(results.u0_d, 2)} ≥ 4, daher C_Rd,c = 0,18/γ_c; ρ_l ist auf min(0,02; 0,5 · f_cd/f_yd) begrenzt.`,
                  formel: `k = \\min\\left(1 + \\sqrt{\\tfrac{200}{${formatDeTeX(d, 0)}}};\\, 2\\right) = ${formatDeTeX(Math.min(1 + Math.sqrt(200 / d), 2.0), 3)};\\quad \\rho_l = ${formatDeTeX(results.rhoL_eff, 4)};\\quad C_{Rd,c} = ${formatDeTeX(results.CRdc, 4)}`,
                },
                {
                  titel: inhalt.werte.durchstanzwiderstandOhneBewehrung,
                  erklaerung: inhalt.werte.derGrößereWertAus,
                  formel: `v_{Rd,c} = \\max\\left(${formatDeTeX(results.CRdc, 4)} \\cdot ${formatDeTeX(Math.min(1 + Math.sqrt(200 / d), 2.0), 3)} \\cdot (100 \\cdot ${formatDeTeX(results.rhoL_eff, 4)} \\cdot ${formatDeTeX(fck, 0)})^{1/3};\\; v_{min} = ${formatDeTeX((0.0525 / EC2_NA_DE.gammaC) * Math.pow(Math.min(1 + Math.sqrt(200 / d), 2.0), 1.5) * Math.sqrt(fck), 3)}\\right) = ${formatDeTeX(results.vRdc, 3)}\\,\\text{N/mm}^2`,
                },
                {
                  titel: 'Maximaltragfähigkeit',
                  erklaerung: results.isOverloaded
                    ? inhalt.werte.vEdVRd
                    : inhalt.werte.vEdVRd2,
                  formel: `v_{Rd,max} = ${formatDeTeX(EC2_NA_DE.vRdMaxFaktor_u1, 1)} \\cdot ${formatDeTeX(results.vRdc, 3)} = ${formatDeTeX(results.vRdMax, 3)}\\,\\text{N/mm}^2 \\;${results.isOverloaded ? '<' : '\\ge'}\\; v_{Ed} = ${formatDeTeX(results.vEd_stress, 3)}\\,\\text{N/mm}^2`,
                },
                {
                  titel: inhalt.werte.durchstanzbewehrungJeReihe,
                  erklaerung: results.needsReinforcement && !results.isOverloaded
                    ? inhalt.werte.abschätzungNachGl6
                    : results.needsReinforcement
                      ? inhalt.werte.keineBemessungMöglichDa
                      : inhalt.werte.vEdVRd3,
                  formel: results.needsReinforcement && !results.isOverloaded
                    ? `A_{sw} = \\frac{(${formatDeTeX(results.vEd_stress, 3)} - 0{,}75 \\cdot ${formatDeTeX(results.vRdc, 3)}) \\cdot ${formatDeTeX(results.u1, 0)} \\cdot ${formatDeTeX(d, 0)}}{2{,}0 \\cdot ${formatDeTeX(Math.min(250 + 0.25 * d, 500 / EC2_NA_DE.gammaS), 1)}} = ${formatDeTeX(results.asw_req_ring, 0)}\\,\\text{mm}^2`
                    : `A_{sw} = 0`,
                },
              ]}
              ergebnisHinweis={results.isOverloaded ? inhalt.werte.vRdMaxÜberschritten : results.needsReinforcement ? `Durchstanzbewehrung je Reihe ≈ ${formatDeZahl(results.asw_req_ring, 0)} mm²` : inhalt.werte.keineDurchstanzbewehrungErforderlich2}
            />

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungDraufsicht} /></h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4 relative overflow-hidden">
                <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="overflow-visible">
                  <defs>
                    <clipPath id="durchstanzen-u1-clip">
                      <rect x={clipLinks} y={clipOben} width={2 * svgSize} height={2 * svgSize} />
                    </clipPath>
                  </defs>
                  {lage !== 'innen' && (
                    <>
                      <line x1={lage === 'ecke' ? randLinks : 0} y1={randOben} x2={svgSize} y2={randOben} stroke="#475569" strokeWidth="2" />
                      {lage === 'ecke' && <line x1={randLinks} y1={randOben} x2={randLinks} y2={svgSize} stroke="#475569" strokeWidth="2" />}
                      {/* Bild 6.15: Rundschnitt läuft senkrecht auf den freien Rand */}
                      <line x1={seiteX} y1={clipOben} x2={seiteX} y2={randOben} stroke="#A3113E" strokeWidth="2" strokeDasharray="4 4" />
                      {lage === 'rand' && <line x1={2 * center - seiteX} y1={clipOben} x2={2 * center - seiteX} y2={randOben} stroke="#A3113E" strokeWidth="2" strokeDasharray="4 4" />}
                      {lage === 'ecke' && <line x1={clipLinks} y1={seiteY} x2={randLinks} y2={seiteY} stroke="#A3113E" strokeWidth="2" strokeDasharray="4 4" />}
                      <text x={svgSize - 4} y={randOben - 4} fontSize="10" fill="#475569" textAnchor="end">freier Rand</text>
                    </>
                  )}
                  {colType === 'rund' ? (
                    <>
                      <circle cx={center} cy={center} r={scaledC / 2} fill="#64748b" />
                      <circle cx={center} cy={center} r={scaledC / 2 + 2 * scaledD} fill="none" stroke="#A3113E" strokeWidth="2" strokeDasharray="4 4" clipPath="url(#durchstanzen-u1-clip)" />
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
                      `} fill="none" stroke="#A3113E" strokeWidth="2" strokeDasharray="4 4" clipPath="url(#durchstanzen-u1-clip)" />
                      
                      <line x1={center + scaledCx / 2} y1={center} x2={center + scaledCx / 2 + 2 * scaledD} y2={center} stroke="#1e293b" strokeWidth="1.5" />
                      <line x1={center + scaledCx / 2} y1={center - 4} x2={center + scaledCx / 2} y2={center + 4} stroke="#1e293b" strokeWidth="1.5" />
                      <line x1={center + scaledCx / 2 + 2 * scaledD} y1={center - 4} x2={center + scaledCx / 2 + 2 * scaledD} y2={center + 4} stroke="#1e293b" strokeWidth="1.5" />
                      <text x={center + scaledCx / 2 + scaledD} y={center - 6} fontSize="10" fill="#1e293b" fontWeight="bold" textAnchor="middle">2d</text>
                    </>
                  )}
                  <text x={center} y={lage !== 'innen' ? svgSize - 2 : colType === 'rund' ? "15" : center - scaledCy / 2 - 2 * scaledD - 10} fontSize="12" fill="#A3113E" textAnchor="middle">Kritischer Rundschnitt u₁</text>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-6 z-10 relative"><MdText text={inhalt.texte.derKritischeRundschnitt} /><FormulaText text="u_1" /><MdText text={inhalt.texte.liegtImAbstand} /><FormulaText text="2d" /><MdText text={inhalt.texte.vomStützenrandHierWird} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-text-main/60 leading-relaxed"><MdText text={inhalt.texte.vereinfachungDieDurchstanzbewehrungWird} /></p>
      <CalculatorDisclaimerBanner className="my-2" />
    </div>
  );
}
