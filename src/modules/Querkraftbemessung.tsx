import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { EC2_NA_DE } from '@/src/data/normParams';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Layers, Scissors } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';

import { bemesseQuerkraft } from '@/src/calc/querkraft';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import inhalt from '@/content/querkraftbemessung/Querkraftbemessung.json';
import { MdText } from '@/src/components/inhalt/MdText';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);


export default function Querkraftbemessung() {
  // Geometrie
  const [b, setB] = useState(30); // Breite in cm
  const [h, setH] = useState(50); // Höhe in cm
  const [d1, setD1] = useState(5); // Betondeckung + halber Stabdurchmesser in cm
  const [cvl, setCvl] = useState(3.5); // Verlegemaß der Längsbewehrung in der Druckzone c_v,l in cm (nur Hinweis zur NA-Grenze von z)

  // Material
  const [fck, setFck] = useState(30); // Betonfestigkeitsklasse C30/37
  const [bewehrungsArt, setBewehrungsArt] = useState<'Stahl' | 'Carbon' | 'GFK' | 'Basalt'>('Stahl');
  const [fyk, setFyk] = useState(500); // Betonstahl B500
  const [ftk, setFtk] = useState(3000); // Zugfestigkeit nichtmetallisch MPa
  const [gammaFRP, setGammaFRP] = useState(1.3); // Teilsicherheitsbeiwert FRP
  const [asl, setAsl] = useState(6.0); // Vorhandene Längsbewehrung Asl in cm²

  // Einwirkung
  const [vEd, setVEd] = useState(250); // Bemessungswert der Querkraft in kN
  const [theta, setTheta] = useState(40); // Druckstrebenneigung in Grad (18.4° bis 45°)

  const results = useMemo(
    () => bemesseQuerkraft({ b, h, d1, fck, bewehrung: bewehrungsArt, fyk, ftk, gammaFRP, asl, vEd, theta, cvl }),
    [b, h, d1, cvl, fck, bewehrungsArt, fyk, ftk, gammaFRP, asl, vEd, theta]
  );

  // Diagrammdaten: a_sw über V_Ed
  const chartData = useMemo(() => {
    const vEd_values: number[] = [];
    const asw_values: number[] = [];
    const asw_min_values: number[] = [];
    for (let v = 20; v <= Math.min(results.vRd_max * 1.1, 1000); v += 20) {
      const r = bemesseQuerkraft({ b, h, d1, fck, bewehrung: bewehrungsArt, fyk, ftk, gammaFRP, asl, vEd: v, theta });
      vEd_values.push(v);
      asw_values.push(r.asw_final);
      asw_min_values.push(r.asw_min);
    }

    return {
      labels: vEd_values,
      datasets: [
        {
          label: inhalt.werte.erforderlicheBügelbewehrungAswCm,
          data: asw_values,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(163, 17, 62, 0.1)',
          fill: true,
          tension: 0.1,
        },
        {
          label: inhalt.werte.mindestbewehrungAswMinCm,
          data: asw_min_values,
          borderColor: '#64748b',
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }
      ]
    };
  }, [b, h, d1, theta, bewehrungsArt, fyk, ftk, gammaFRP, fck, asl, results.vRd_max]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: inhalt.werte.querkraftVEdKn
        }
      },
      y: {
        title: {
          display: true,
          text: inhalt.werte.bügelbewehrungASwCm
        },
        beginAtZero: true
      }
    }
  };

  // SVG Dimensionen für die Grafik (Tragmodell)
  const svgWidth = 350;
  const svgHeight = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const drawWidth = svgWidth - margin.left - margin.right;
  const drawHeight = svgHeight - margin.top - margin.bottom;
  
  const beamHeight = 100;
  const z_visual = beamHeight * 0.8;
  const theta_rad = (theta * Math.PI) / 180;
  const strutLength_x = z_visual / Math.tan(theta_rad);
  
  const startX = margin.left + 20;
  const topY = margin.top + (drawHeight - beamHeight) / 2;
  const bottomY = topY + beamHeight;
  const zTopY = topY + (beamHeight - z_visual) / 2;
  const zBottomY = zTopY + z_visual;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /><MdText text={inhalt.texte.querkraftbemessungMassivbau} /><InfoTooltip text={inhalt.werte.berechnungDerErforderlichenQuerkraftbewe} />
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300"><MdText text={inhalt.texte.berechnetNachDinEn} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
          <p><MdText text={inhalt.texte.dieQuerkraftbemessungBasiertAuf} /><FormulaText text="V_{Rd,max}" /><MdText text={inhalt.texte.währendDieBügelbewehrungDie} /><FormulaText text="V_{Rd,s}" /><MdText text={inhalt.texte.derWinkelDerDruckstrebe} /><FormulaText text="\theta" /><MdText text={inhalt.texte.kannInDeutschlandZwischen} /><FormulaText text="\theta" /><MdText text={inhalt.texte.t1030} /></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.querschnittMaterial} /></h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Slider info={inhalt.werte.breiteDesBauteils} label={<FormulaText text="Breite b" />} min={15} max={100} step={5} value={b} unit="cm" onChange={(e) => setB(Number(e.target.value))} />
                  <Slider label={<FormulaText text="Höhe h" />} min={20} max={150} step={5} value={h} unit="cm" onChange={(e) => setH(Number(e.target.value))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Slider info={inhalt.werte.abstandVomRandZur} label={<FormulaText text={inhalt.werte.randabstandD1} />} min={2} max={10} step={0.5} value={d1} unit="cm" onChange={(e) => setD1(Number(e.target.value))} />
                  <Slider info={inhalt.werte.cvlInfo} label={<FormulaText text={inhalt.werte.cvlLabel} />} min={1} max={8} step={0.5} value={cvl} unit="cm" onChange={(e) => setCvl(Number(e.target.value))} />
                  <Slider info={inhalt.werte.vorhandeneLängsbewehrungsflächeFürVrd} label={<FormulaText text={inhalt.werte.längsbewASl} />} min={0} max={50} step={0.5} value={asl} unit="cm²" onChange={(e) => setAsl(Number(e.target.value))} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2"><label className="block text-xs font-bold text-text-main"><FormulaText text={inhalt.werte.betonklasseFCk} /></label><InfoTooltip text={inhalt.werte.charakteristischeDruckfestigkeitDesBeton} /></div>
                    <select 
                      className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-white"
                      value={fck}
                      onChange={(e) => setFck(Number(e.target.value))}
                    >
                      <option value={20}>C20/25</option>
                      <option value={25}>C25/30</option>
                      <option value={30}>C30/37</option>
                      <option value={35}>C35/45</option>
                      <option value={40}>C40/50</option>
                      <option value={45}>C45/55</option>
                      <option value={50}>C50/60</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2"><label className="block text-xs font-bold text-text-main">Bewehrungsart</label><InfoTooltip text={inhalt.werte.wahlZwischenHerkömmlichemBetonstahl} /></div>
                    <select aria-label="Bewehrungsart" 
                      className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-white"
                      value={bewehrungsArt}
                      onChange={(e) => setBewehrungsArt(e.target.value as typeof bewehrungsArt)}
                    >
                      <option value="Stahl">Betonstahl (B500)</option>
                      <option value="Carbon">Carbon (CFK)</option>
                      <option value="GFK">Glasfaser (GFK)</option>
                      <option value="Basalt">Basalt (BFK)</option>
                    </select>
                  </div>
                </div>

                {bewehrungsArt === 'Stahl' ? (
                  <div className="mt-2">
                    <label className="block text-xs font-bold text-text-main mb-2"><MdText text={inhalt.texte.streckgrenzeStahl} /><FormulaText text="f_{yk}" /></label>
                    <select aria-label={inhalt.werte.streckgrenzeStahl} 
                      className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-white"
                      value={fyk}
                      onChange={(e) => setFyk(Number(e.target.value))}
                    >
                      <option value={500}>B500 (500 MPa)</option>
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Slider label={inhalt.werte.zugfestigkeitFtk} info={inhalt.werte.charakteristischeZugfestigkeitDesFaserve} min={500} max={4000} step={100} value={ftk} unit="MPa" onChange={(e) => setFtk(Number(e.target.value))} />
                    <Slider label={inhalt.werte.teilsicherheitsbeiwertFrp} info={inhalt.werte.teilsicherheitsbeiwertFürDenFaserverbund} min={1.0} max={2.0} step={0.05} value={gammaFRP} unit="-" onChange={(e) => setGammaFRP(Number(e.target.value))} />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.einwirkungModell} /></h3>
              <div className="grid grid-cols-1 gap-4">
                <Slider label={<FormulaText text={inhalt.werte.querkraftVEd} />} info={inhalt.werte.bemessungswertDerEinwirkendenQuerkraft} min={10} max={2000} step={10} value={vEd} unit="kN" onChange={(e) => setVEd(Number(e.target.value))} />
                <div>
                  <Slider 
                    info={inhalt.werte.neigungswinkelDerBetonDruckstrebe} 
                    label={<FormulaText text="Druckstrebenneigung \theta" />} 
                    min={18.4} max={45} step={0.1} 
                    value={theta} unit="°" 
                    onChange={(e) => setTheta(Number(e.target.value))} 
                  />
                  <div className="text-xs text-text-main/70 mt-1 flex justify-between">
                    <span>cot θ = {formatDeZahl(results.cot_theta, 2)}</span>
                    <span><MdText text={inhalt.texte.maxZulässigNaDe} />{formatDeZahl(results.cot_theta_max, 2)}</span>
                  </div>
                  {results.isCotThetaExceeded && (
                    <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-md mt-2"><MdText text={inhalt.texte.inDeIstCot} />{formatDeWert(vEd)}<MdText text={inhalt.texte.knUndVSub} />{formatDeZahl(results.vRd_cc_kN, 1)}<MdText text={inhalt.texte.knGiltCotMax} />{formatDeZahl(results.cot_theta_max, 2)} (θ ≥ {formatDeZahl(results.theta_min_deg, 1)}°).
                      {' '}<strong><MdText text={inhalt.texte.derRechnerBegrenztDeshalb} />{formatDeZahl(results.cot_theta_eff, 2)} (θ = {formatDeZahl(results.theta_eff_deg, 1)}°)</strong><MdText text={inhalt.texte.fürVSubRd} /></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <EingabeHinweise hinweise={results.hinweise.filter(x => x.feld !== 'cotTheta' && x.feld !== 'vRdMax')} />
            <div className="p-6 rounded-xl shadow-md text-white bg-shiraz transition-colors">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90 flex items-center gap-2">
                <Scissors size={18} /><MdText text={inhalt.texte.bemessungsergebnisseNaDe} /></h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-white/70 text-sm mb-1"><MdText text={inhalt.texte.erfBügelbewehrung} /><FormulaText text="a_{sw}" />)</div>
                  <div className="text-4xl font-bold">{formatDeZahl(results.asw_final, 2)} <span className="text-xl">cm²/m</span></div>
                  {results.asw_final === results.asw_min && (
                    <div className="text-xs text-white/80 mt-1 bg-white/10 inline-block px-2 py-1 rounded"><MdText text={inhalt.texte.mindestbewehrungMaßgebend} /></div>
                  )}
                  {!results.isVRdcExceeded && (
                    <div className="text-xs text-green-200 mt-1"><MdText text={inhalt.texte.vEdVRd} /></div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="text-white/70 text-sm mb-1"><MdText text={inhalt.texte.tragfOhneBügel} /><FormulaText text="V_{Rd,c}" />)</div>
                    <div className={`text-2xl font-bold ${results.isVRdcExceeded ? 'text-white/80' : 'text-green-300'}`}>
                      {formatDeZahl(results.vRd_c, 0)} <span className="text-base">kN</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1"><MdText text={inhalt.texte.maxTragfähigkeit} /><FormulaText text="V_{Rd,max}" />)</div>
                    <div className={`text-2xl font-bold ${results.isVRdMaxExceeded ? 'text-red-300' : 'text-white'}`}>
                      {formatDeZahl(results.vRd_max, 0)} <span className="text-base">kN</span>
                    </div>
                  </div>
                </div>
              </div>

              {results.isVRdMaxExceeded ? (
                <div className="bg-red-500/20 border border-red-300/50 p-4 rounded-lg">
                  <div className="font-bold text-red-100 mb-1">Nachweis <FormulaText text="V_{Ed} \le V_{Rd,max}" /><MdText text={inhalt.texte.nichtErfüllt} /></div>
                  <div className="text-sm text-red-100/80"><MdText text={inhalt.texte.dieBetondruckstrebeVersagtErhöhen} /><FormulaText text="b" />, <FormulaText text="h" /><MdText text={inhalt.texte.dieBetonfestigkeitOderDen} /><FormulaText text="\theta" />.
                  </div>
                </div>
              ) : (
                <div className="bg-green-500/20 border border-green-300/50 p-4 rounded-lg">
                  <div className="font-bold text-green-100 mb-1">Nachweis <FormulaText text="V_{Ed} \le V_{Rd,max}" /> erfüllt.</div>
                  <div className="text-sm text-green-100/80"><MdText text={inhalt.texte.ausnutzungDruckstrebe} />{formatDeZahl(((vEd / results.vRd_max) * 100), 1)} %
                    <br />
                    {results.isVRdcExceeded ? (
                      <span><MdText text={inhalt.texte.querkraftbewehrungErforderlichDa} /><FormulaText text={inhalt.werte.vEdVRd} />.</span>
                    ) : (
                      <span className="text-green-200"><MdText text={inhalt.texte.keineRechnerischeQuerkraftbewehrungErfor} /><FormulaText text="V_{Ed} \le V_{Rd,c}" /><MdText text={inhalt.texte.mindestbewehrungAnordnen} /></span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <FormulaDerivationBox
              live
              title={inhalt.werte.ihrRechenwegQuerkraftbemessungMit}
              zielGleichung={`a_{sw} = \\frac{V_{Ed}}{z \\cdot f_{yd} \\cdot \\cot\\theta} = ${formatDeTeX(results.asw_final, 2)}\\,\\text{cm}^2/\\text{m}`}
              normQuelle={inhalt.werte.dinEn19921}
              schritte={[
                {
                  titel: inhalt.werte.nutzhöheUndHebelarm,
                  erklaerung: inhalt.werte.vereinfachterInnererHebelarmZ,
                  formel: `d = ${formatDeTeX(h, 1)} - ${formatDeTeX(d1, 1)} = ${formatDeTeX(results.d, 1)}\\,\\text{cm};\\quad z = 0{,}9 \\cdot ${formatDeTeX(results.d, 1)} = ${formatDeTeX(results.z, 1)}\\,\\text{cm}`,
                },
                {
                  titel: inhalt.werte.tragfähigkeitOhneQuerkraftbewehrung,
                  erklaerung: `Maßstabsfaktor k und Längsbewehrungsgrad ρ_l (höchstens 0,02); v_min nach NA (DE) ist als Untergrenze berücksichtigt. V_Ed ${results.isVRdcExceeded ? '>' : '≤'} V_Rd,c: ${results.isVRdcExceeded ? inhalt.werte.querkraftbewehrungRechnerischErforderlic : inhalt.werte.nurMindestbewehrungErforderlich}.`,
                  formel: `k = \\min\\left(1 + \\sqrt{\\tfrac{200}{${formatDeTeX(results.d * 10, 0)}}};\\, 2\\right) = ${formatDeTeX(Math.min(2, 1 + Math.sqrt(200 / (results.d * 10))), 2)};\\; \\rho_l = \\frac{${formatDeTeX(asl, 1)}}{${formatDeTeX(b, 0)} \\cdot ${formatDeTeX(results.d, 1)}} = ${formatDeTeX(Math.min(0.02, asl / (b * results.d)), 4)};\\; V_{Rd,c} = ${formatDeTeX(results.vRd_c, 1)}\\,\\text{kN}`,
                },
                {
                  titel: 'Druckstrebentragfähigkeit',
                  erklaerung: `ν₁ = 0,75 · min(1,0; 1,1 − f_ck/500). Ausnutzung der Druckstrebe: ${formatDeZahl((vEd / results.vRd_max) * 100, 1)} %.`,
                  formel: `V_{Rd,max} = \\frac{b \\cdot z \\cdot \\nu_1 \\cdot f_{cd}}{\\tan\\theta + \\cot\\theta} = \\frac{${formatDeTeX(b / 100, 2)} \\cdot ${formatDeTeX(results.z / 100, 3)} \\cdot ${formatDeTeX(EC2_NA_DE.nu1 * Math.min(1.0, 1.1 - fck / 500), 3)} \\cdot ${formatDeTeX(results.fcd_vRdMax, 1)}}{${formatDeTeX(1 / results.cot_theta_eff, 3)} + ${formatDeTeX(results.cot_theta_eff, 3)}} \\cdot 10^3 = ${formatDeTeX(results.vRd_max, 0)}\\,\\text{kN} \\;${results.isVRdMaxExceeded ? '<' : '\\ge'}\\; V_{Ed} = ${formatDeTeX(vEd, 0)}\\,\\text{kN}`,
                },
                {
                  titel: inhalt.werte.rechnerischErforderlicheBügelbewehrung,
                  erklaerung: results.isCotThetaExceeded
                    ? `Achtung: Das gewählte cot θ = ${formatDeZahl(results.cot_theta, 2)} überschreitet die Grenze cot θ,max = ${formatDeZahl(results.cot_theta_max, 2)} nach Gl. (6.7aDE); der Rechner begrenzt deshalb auf cot θ = ${formatDeZahl(results.cot_theta_eff, 2)} (θ = ${formatDeZahl(results.theta_eff_deg, 1)}°).`
                    : `Senkrechte Bügel, cot θ = ${formatDeZahl(results.cot_theta, 2)} ≤ cot θ,max = ${formatDeZahl(results.cot_theta_max, 2)}.`,
                  formel: `a_{sw,erf} = \\frac{V_{Ed}}{z \\cdot f_{yd} \\cdot \\cot\\theta} = \\frac{${formatDeTeX(vEd / 1000, 3)}}{${formatDeTeX(results.z / 100, 3)} \\cdot ${formatDeTeX(results.fyd, 1)} \\cdot ${formatDeTeX(results.cot_theta_eff, 3)}} \\cdot 10^4 = ${formatDeTeX(results.asw_req, 2)}\\,\\text{cm}^2/\\text{m}`,
                },
                {
                  titel: inhalt.werte.mindestbewehrungUndMaßgebenderWert,
                  erklaerung: results.isVRdcExceeded
                    ? inhalt.werte.maßgebendIstDerGrößere
                    : inhalt.werte.daVEdV,
                  formel: `a_{sw,min} = 0{,}16 \\cdot \\frac{${formatDeTeX(results.fctm, 1)}}{${formatDeTeX(bewehrungsArt === 'Stahl' ? fyk : ftk, 0)}} \\cdot ${formatDeTeX(b, 0)} \\cdot 100 = ${formatDeTeX(results.asw_min, 2)}\\,\\text{cm}^2/\\text{m} \\;\\Rightarrow\\; a_{sw} = ${formatDeTeX(results.asw_final, 2)}\\,\\text{cm}^2/\\text{m}`,
                },
              ]}
              ergebnisHinweis={`Erforderliche Bügelbewehrung a_sw = ${formatDeZahl(results.asw_final, 2)} cm²/m`}
            />

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Zwischenwerte</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.statischeNutzhöhe} /><FormulaText text="d" />)</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.d, 1)} cm</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.innererHebelarm} /><FormulaText text="z" />)</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.z, 1)} cm</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.bemessungsfestigkeitBeton} /><FormulaText text="f_{cd}" />)</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.fcd, 1)} MPa</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.bemessungsfestigkeitStahl} /><FormulaText text="f_{yd}" />)</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.fyd, 1)} MPa</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.tragfOhneBügel2} /><FormulaText text="V_{Rd,c}" />)</span>
                  <span className="font-mono font-bold">{formatDeZahl(results.vRd_c, 1)} kN</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.rechnerischErf} /><FormulaText text="a_{sw}" /></span>
                  <span className="font-mono font-bold">{formatDeZahl(results.asw_req, 2)} cm²/m</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Mindestbewehrung <FormulaText text="a_{sw,min}" /></span>
                  <span className="font-mono font-bold">{formatDeZahl(results.asw_min, 2)} cm²/m</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Grenze <FormulaText text="\cot(\theta)_{max}" /></span>
                  <span className="font-mono font-bold">{formatDeZahl(results.cot_theta_max, 2)}</span>
                </div>
              </div>
            </div>

            {/* Visualisierung Fachwerkmodell */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col items-center">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-2"><MdText text={inhalt.texte.fachwerkmodellSeitenansicht} /></h3>
              <svg width={svgWidth} height={svgHeight} className="overflow-visible">
                <rect x={startX} y={topY} width={drawWidth - 40} height={beamHeight} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />
                <line x1={startX} y1={zBottomY} x2={startX + drawWidth - 40} y2={zBottomY} stroke="#A3113E" strokeWidth="3" />
                <line x1={startX} y1={zTopY} x2={startX + drawWidth - 40} y2={zTopY} stroke="#475569" strokeWidth="3" />

                <line x1={startX} y1={zBottomY} x2={startX + strutLength_x} y2={zTopY} stroke="#475569" strokeWidth="8" opacity="0.4" />
                <line x1={startX + strutLength_x} y1={zBottomY} x2={startX + 2 * strutLength_x} y2={zTopY} stroke="#475569" strokeWidth="8" opacity="0.4" />
                {startX + 2 * strutLength_x < startX + drawWidth - 40 && (
                  <line x1={startX + 2 * strutLength_x} y1={zBottomY} x2={Math.min(startX + 3 * strutLength_x, startX + drawWidth - 40)} y2={zTopY - (Math.min(startX + 3 * strutLength_x, startX + drawWidth - 40) - (startX + 2 * strutLength_x)) * Math.tan(theta_rad)} stroke="#475569" strokeWidth="8" opacity="0.4" />
                )}

                <line x1={startX + strutLength_x} y1={zTopY} x2={startX + strutLength_x} y2={zBottomY} stroke="#A3113E" strokeWidth="2" />
                <line x1={startX + 2 * strutLength_x} y1={zTopY} x2={startX + 2 * strutLength_x} y2={zBottomY} stroke="#A3113E" strokeWidth="2" />

                <path d={`M ${startX + 30} ${zBottomY} A 30 30 0 0 0 ${startX + 30 * Math.cos(theta_rad)} ${zBottomY - 30 * Math.sin(theta_rad)}`} fill="none" stroke="#475569" strokeWidth="1" />
                <text x={startX + 35} y={zBottomY - 10} fontSize="12" fill="#475569">θ = {formatDeWert(theta)}°</text>

                <line x1={startX - 10} y1={zTopY} x2={startX - 10} y2={zBottomY} stroke="#475569" strokeWidth="1" />
                <line x1={startX - 15} y1={zTopY} x2={startX - 5} y2={zTopY} stroke="#475569" strokeWidth="1" />
                <line x1={startX - 15} y1={zBottomY} x2={startX - 5} y2={zBottomY} stroke="#475569" strokeWidth="1" />
                <text x={startX - 20} y={topY + beamHeight / 2} fontSize="12" fill="#475569" textAnchor="end" dominantBaseline="middle">z</text>
                
                <circle cx={startX + 20} cy={bottomY + 20} r={4} fill="#A3113E" />
                <text x={startX + 30} y={bottomY + 20} fontSize="10" fill="#475569" dominantBaseline="middle">Zug (Stahl)</text>
                <circle cx={startX + 120} cy={bottomY + 20} r={4} fill="#475569" />
                <text x={startX + 130} y={bottomY + 20} fontSize="10" fill="#475569" dominantBaseline="middle">Druck (Beton)</text>
              </svg>
            </div>

            {/* Diagramm: a_sw über V_Ed */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.erforderlicheQuerkraftbewehrung} /></h3>
              <div className="relative w-full" style={{ height: '400px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-[11px] text-text-main/60 leading-relaxed"><MdText text={inhalt.texte.vereinfachungenHebelarmZ0} /></p>
      <CalculatorDisclaimerBanner className="my-2" />
    </div>
  );
}
