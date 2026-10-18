import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { EC2_NA_DE } from '@/src/data/normParams';
import { Layers } from 'lucide-react';

export default function Verankerungslaenge() {
  const [fck, setFck] = useState(30); // MPa
  const [fyk, setFyk] = useState(500); // MPa
  const [phi, setPhi] = useState(16); // mm (Stabdurchmesser)
  const [verbundBedingung, setVerbundBedingung] = useState<'gut' | 'maessig'>('gut');
  const [beanspruchung, setBeanspruchung] = useState<'zug' | 'druck'>('zug');
  const [berechnungsArt, setBerechnungsArt] = useState<'verankerung' | 'uebergreifung'>('verankerung');
  
  // Alpha values
  const [verankerungsArt, setVerankerungsArt] = useState<'gerade' | 'haken' | 'winkel'>('gerade');
  const [alpha2, setAlpha2] = useState(1.0); // Betondeckung
  const [alpha3, setAlpha3] = useState(1.0); // Querbewehrung
  const [alpha5, setAlpha5] = useState(1.0); // Querdruck
  const [alpha6, setAlpha6] = useState(1.5); // Stoßanteil (für Übergreifung)
  
  const [asErf, setAsErf] = useState(10); // cm²
  const [asVorh, setAsVorh] = useState(12); // cm²

  const results = useMemo(() => {
    // 1. Bemessungswert der Verbundspannung (f_bd)
    const gammaC = EC2_NA_DE.gammaC;
    // Anmerkung: Nach NA(DE) wird oft alpha_ct = 0.85 für f_ctd verwendet, 
    // aber bei der Verbundspannung (f_bd) explizit 1.0 (bzw. ist direkt ohne alpha_ct definiert). 
    // Wir setzen alphaCt = 1.0 für f_bd gem. Standard-EC2/NA.
    const alphaCt = 1.0; 
    
    // Zugfestigkeit
    let fctm;
    if (fck <= 50) {
      fctm = 0.3 * Math.pow(fck, 2/3);
    } else {
      fctm = 2.12 * Math.log(1 + (fck + 8) / 10);
    }
    const fctk005 = 0.7 * fctm; // 5%-Quantil
    const fctd = (alphaCt * fctk005) / gammaC;
    
    const eta1 = verbundBedingung === 'gut' ? 1.0 : 0.7;
    const eta2 = phi <= 32 ? 1.0 : (132 - phi) / 100;
    
    const fbd = 2.25 * eta1 * eta2 * fctd; // MPa (N/mm²)

    // 2. Grundwert der Verankerungslänge (l_b,rqd)
    const gammaS = EC2_NA_DE.gammaS;
    const fyd = fyk / gammaS;
    const sigmaSd = fyd; // Annahme: volle Ausnutzung für Grundwert
    
    const lbRqd = (phi / 4) * (sigmaSd / fbd); // mm

    // 3. Bemessungswert der Verankerungslänge (l_bd) / Übergreifungslänge (l_0)
    // alpha1 = 1.0 für gerade Stäbe, 0.7 für Haken/Winkel bei Zug
    let currentAlpha1 = 1.0;
    if (beanspruchung === 'zug' && verankerungsArt !== 'gerade') {
      currentAlpha1 = 0.7;
    }

    // Für Druckbeanspruchung sind alle alphas = 1.0
    const a1 = beanspruchung === 'zug' ? currentAlpha1 : 1.0;
    const a2 = beanspruchung === 'zug' ? alpha2 : 1.0;
    const a3 = beanspruchung === 'zug' ? alpha3 : 1.0;
    const a5 = beanspruchung === 'zug' ? alpha5 : 1.0;
    const a6 = berechnungsArt === 'uebergreifung' ? alpha6 : 1.0;

    // Mindestens 0.7 für das Produkt (bei Verankerung) bzw. für (a2*a3*a5)
    let alphaProduct = a1 * a2 * a3 * a5;
    if (alphaProduct < 0.7) alphaProduct = 0.7;
    
    // Für Übergreifung gilt: l0 = alpha1*alpha2*alpha3*alpha5*alpha6 * lbRqd
    const totalAlpha = alphaProduct * a6;

    // Verhältnis As,erf / As,vorh
    const asRatio = Math.max(0.0, Math.min(asErf / asVorh, 1.0));

    let lbd = totalAlpha * lbRqd * asRatio;

    // 4. Mindestlänge (l_b,min bzw. l_0,min)
    let lbMin = 0;
    if (berechnungsArt === 'verankerung') {
      if (beanspruchung === 'zug') {
        lbMin = Math.max(0.3 * lbRqd, 10 * phi, 100);
      } else {
        lbMin = Math.max(0.6 * lbRqd, 10 * phi, 100);
      }
    } else {
      // Übergreifung
      lbMin = Math.max(0.3 * a6 * lbRqd, 15 * phi, 200);
    }

    if (lbd < lbMin) {
      lbd = lbMin;
    }

    return {
      fctk005,
      fctd,
      fbd,
      lbRqd,
      alphaProduct,
      totalAlpha,
      a6,
      asRatio,
      lbMin,
      lbd,
      currentAlpha1: a1
    };
  }, [fck, fyk, phi, verbundBedingung, beanspruchung, berechnungsArt, verankerungsArt, alpha2, alpha3, alpha5, alpha6, asErf, asVorh]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/20">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /> Verankerungslänge &amp; Übergreifungslänge
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300">
            Berechnet nach DIN EN 1992-1-1 + NA (DE)
          </span>
        </div>
        <p className="text-text-main/80 mb-6">
          Die Verankerungslänge ist die Länge, die benötigt wird, um die Zug- oder Druckkräfte eines Bewehrungsstabes 
          sicher in den umgebenden Beton einzuleiten. Die Berechnung erfolgt nach DIN EN 1992-1-1 mit dem Nationalen Anhang (NA DE).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/20">
              <h3 className="font-semibold mb-4 text-text-main">Material & Geometrie</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-text-main mb-1 block">Betonfestigkeit</label>
                  <select 
                    className="w-full p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                    value={fck}
                    onChange={(e) => setFck(Number(e.target.value))}
                  >
                    <option value={20}>C20/25</option>
                    <option value={25}>C25/30</option>
                    <option value={30}>C30/37</option>
                    <option value={35}>C35/45</option>
                    <option value={40}>C40/50</option>
                    <option value={50}>C50/60</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-main mb-1 block">Stahlfestigkeit</label>
                  <select 
                    className="w-full p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                    value={fyk}
                    onChange={(e) => setFyk(Number(e.target.value))}
                  >
                    <option value={500}>B500 (500 MPa)</option>
                  </select>
                </div>
              </div>
              
              <Slider
                label={<FormulaText text="Stabdurchmesser \varnothing" />}
                value={phi}
                min={6}
                max={40}
                step={2}
                onChange={(e) => setPhi(Number(e.target.value))}
                unit="mm"
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-text-main mb-1 block">Verbundbedingungen</label>
                  <select 
                    className="w-full p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                    value={verbundBedingung}
                    onChange={(e) => setVerbundBedingung(e.target.value as 'gut' | 'maessig')}
                  >
                    <option value="gut">Gute Bedingungen (unten/mittig)</option>
                    <option value="maessig">Mäßige Bedingungen (oben)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-main mb-1 block">Art der Berechnung</label>
                  <select 
                    className="w-full p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                    value={berechnungsArt}
                    onChange={(e) => setBerechnungsArt(e.target.value as 'verankerung' | 'uebergreifung')}
                  >
                    <option value="verankerung">Verankerungslänge</option>
                    <option value="uebergreifung">Übergreifungslänge</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="text-sm font-medium text-text-main mb-1 block">Beanspruchung</label>
                <div className="flex bg-white rounded-md border border-home-grau/20 shadow-sm">
                  <button 
                    onClick={() => setBeanspruchung('zug')} 
                    className={`flex-1 py-2 text-sm font-medium rounded-l-md ${beanspruchung === 'zug' ? 'bg-shiraz text-white' : 'text-text-main hover:bg-off-white'}`}
                  >Zug</button>
                  <button 
                    onClick={() => setBeanspruchung('druck')} 
                    className={`flex-1 py-2 text-sm font-medium rounded-r-md ${beanspruchung === 'druck' ? 'bg-shiraz text-white' : 'text-text-main hover:bg-off-white'}`}
                  >Druck</button>
                </div>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/20">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-text-main">Einflussfaktoren (<FormulaText text="\alpha" />)</h3>
                <InfoTooltip text="Ausgewählte Faktoren zur Reduktion der Länge. Bei Druckbeanspruchung sind alle Formbeiwerte = 1.0." />
              </div>
              
              <div className="mb-4">
                <label className="text-sm font-medium text-text-main mb-1 block">Formgebung (<FormulaText text="\alpha_1" />)</label>
                <select 
                  className="w-full p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz disabled:bg-gray-100 disabled:text-gray-500"
                  value={verankerungsArt}
                  onChange={(e) => setVerankerungsArt(e.target.value as 'gerade' | 'haken' | 'winkel')}
                  disabled={beanspruchung === 'druck'}
                >
                  <option value="gerade">Gerades Stabende (α₁ = 1.0)</option>
                  <option value="haken">Haken / Winkel (α₁ = 0.7 bei ZUG)</option>
                </select>
              </div>

              {beanspruchung === 'zug' && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div>
                    <label className="text-xs font-medium text-text-main mb-1 block">Betondeckung (<FormulaText text="\alpha_2" />)</label>
                    <input type="number" step="0.05" min="0.7" max="1.0" value={alpha2} onChange={e => setAlpha2(Number(e.target.value))} className="w-full p-1.5 text-sm border rounded" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-main mb-1 block">Querbewehrung (<FormulaText text="\alpha_3" />)</label>
                    <input type="number" step="0.05" min="0.7" max="1.0" value={alpha3} onChange={e => setAlpha3(Number(e.target.value))} className="w-full p-1.5 text-sm border rounded" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-main mb-1 block">Querdruck (<FormulaText text="\alpha_5" />)</label>
                    <input type="number" step="0.05" min="0.7" max="1.0" value={alpha5} onChange={e => setAlpha5(Number(e.target.value))} className="w-full p-1.5 text-sm border rounded" />
                  </div>
                </div>
              )}

              {berechnungsArt === 'uebergreifung' && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-text-main mb-1 block">Stoßanteil / Abstand (<FormulaText text="\alpha_6" />)</label>
                  <select 
                    className="w-full p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                    value={alpha6}
                    onChange={(e) => setAlpha6(Number(e.target.value))}
                  >
                    <option value={EC2_NA_DE.alpha6_33}>&lt; 33% gestoßen (α₆ = {EC2_NA_DE.alpha6_33.toFixed(2)})</option>
                    <option value={1.41}>&lt; 50% gestoßen (α₆ = 1.41)</option>
                    <option value={1.5}>&gt; 50% gestoßen (α₆ = 1.50)</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Slider
                  label={<FormulaText text="A_{s,erf}" />}
                  value={asErf}
                  min={1}
                  max={50}
                  step={0.5}
                  onChange={(e) => setAsErf(Number(e.target.value))}
                  unit="cm²"
                />
                <Slider
                  label={<FormulaText text="A_{s,vorh}" />}
                  value={asVorh}
                  min={1}
                  max={50}
                  step={0.5}
                  onChange={(e) => setAsVorh(Number(e.target.value))}
                  unit="cm²"
                />
              </div>
              <p className="text-xs text-home-grau">
                Das Verhältnis <FormulaText text="A_{s,erf} / A_{s,vorh}" /> darf zur Reduzierung der Verankerungslänge angesetzt werden.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Ergebnisse</h3>
              
              <div className="p-6 bg-shiraz/5 border border-shiraz/20 rounded-xl mb-6 text-center">
                <div className="text-sm text-shiraz font-bold uppercase tracking-wider mb-2">
                  {berechnungsArt === 'verankerung' ? 'Bemessungswert Verankerungslänge' : 'Bemessungswert Übergreifungslänge'} <FormulaText text={berechnungsArt === 'verankerung' ? "l_{bd}" : "l_0"} />
                </div>
                <div className="text-5xl font-bold text-shiraz">
                  {results.lbd.toFixed(0)} <span className="text-xl font-normal">mm</span>
                </div>
                <div className="text-xs text-home-grau mt-2">
                  (entspricht {(results.lbd / phi).toFixed(1)} <FormulaText text="\varnothing" />)
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Zugfestigkeit Beton <FormulaText text="f_{ctk;0,05}" /></span>
                  <span className="font-mono font-bold">{results.fctk005.toFixed(2)} MPa</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Bemessungswert Verbund <FormulaText text="f_{bd}" /></span>
                  <span className="font-mono font-bold">{results.fbd.toFixed(2)} MPa</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Grundwert <FormulaText text="l_{b,rqd}" /></span>
                  <span className="font-mono font-bold">{results.lbRqd.toFixed(0)} mm</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Einflussfaktoren <FormulaText text="\prod \alpha_i" /></span>
                  <span className="font-mono font-bold">{results.totalAlpha.toFixed(2)}</span>
                </div>
                {berechnungsArt === 'uebergreifung' && (
                  <div className="flex justify-between border-b border-home-grau/10 pb-2">
                    <span className="text-text-main/70">Längsstoß-Faktor <FormulaText text="\alpha_6" /></span>
                    <span className="font-mono font-bold">{results.a6.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Ausnutzungsgrad <FormulaText text="A_{s,erf} / A_{s,vorh}" /></span>
                  <span className="font-mono font-bold">{results.asRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Mindestlänge <FormulaText text={berechnungsArt === 'verankerung' ? "l_{b,min}" : "l_{0,min}"} /></span>
                  <span className="font-mono font-bold">{results.lbMin.toFixed(0)} mm</span>
                </div>
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/20 p-4">
                <svg width="300" height="150" viewBox="0 0 300 150">
                  {/* Betonblock */}
                  <rect x="150" y="20" width="130" height="110" fill="#cbd5e1" stroke="#94a3b8" />
                  <text x="215" y="40" fontSize="12" fill="#64748b" textAnchor="middle">Beton</text>
                  
                  {/* Bewehrungsstab */}
                  {verankerungsArt === 'gerade' ? (
                    <rect x="20" y="65" width="230" height="10" fill="#ef4444" />
                  ) : (
                    <path d="M 20 70 L 250 70 L 250 110" fill="none" stroke="#ef4444" strokeWidth="10" strokeLinejoin="round" />
                  )}
                  
                  {/* Zugkraft */}
                  <line x1="80" y1="70" x2="30" y2="70" stroke="#1e293b" strokeWidth="2" markerEnd="url(#arrow-black)" />
                  <text x="55" y="60" fontSize="12" fill="#1e293b" textAnchor="middle">F_s</text>
                  
                  {/* Verankerungslänge Markierung */}
                  <line x1="150" y1="100" x2="150" y2="140" stroke="#4b5563" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="250" y1="100" x2="250" y2="140" stroke="#4b5563" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="150" y1="130" x2="250" y2="130" stroke="#4b5563" strokeWidth="1" markerStart="url(#arrow-gray)" markerEnd="url(#arrow-gray)" />
                  <text x="200" y="125" fontSize="12" fill="#4b5563" textAnchor="middle">{berechnungsArt === 'verankerung' ? 'l_bd' : 'l_0'}</text>
                  
                  <defs>
                    <marker id="arrow-black" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
                    </marker>
                    <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#4b5563" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Die Kraft <FormulaText text="F_s" /> wird über Verbundspannungen entlang der Länge <FormulaText text={berechnungsArt === 'verankerung' ? "l_{bd}" : "l_0"} /> in den Beton eingeleitet.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Verankerung von Betonstahl', url: 'https://de.wikipedia.org/wiki/Bewehrung#Verankerung_von_Betonstahl' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1:2023-08 / DIN EN 1992-1-1/NA:2013-04 (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken - Abschnitte 8.4 Verankerung und 8.7 Übergreifung)', url: 'https://www.dinmedia.de/' }
        ]}
        literatur={[
          'Zilch, K., Zehetmaier, G.: Bemessung im Konstruktiven Betonbau',
          'Deutscher Ausschuss für Stahlbeton (DAfStb): Heft 600'
        ]}
        formeln={[
          {
            erklaerung: "Bemessungswert der Verbundspannung\nf_bd: Bemessungswert der Verbundspannung [MPa]\nη₁: Beiwert für die Verbundbedingung (1.0 für gut, 0.7 für mäßig)\nη₂: Beiwert für den Stabdurchmesser (1.0 für ≤ 32 mm)\nf_ctd: Bemessungswert der Betonzugfestigkeit [MPa]",
            formel: "f_{bd} = 2.25 \\cdot \\eta_1 \\cdot \\eta_2 \\cdot f_{ctd}"
          },
          {
            erklaerung: "Grundwert der Verankerungslänge\nl_b,rqd: Grundwert der Verankerungslänge [mm]\nØ: Stabdurchmesser [mm]\nσ_sd: Bemessungswert der Stabspannung [MPa]\nf_bd: Bemessungswert der Verbundspannung [MPa]",
            formel: "l_{b,rqd} = \\frac{\\varnothing}{4} \\cdot \\frac{\\sigma_{sd}}{f_{bd}}"
          },
          {
            erklaerung: berechnungsArt === 'verankerung' 
              ? "Bemessungswert der Verankerungslänge\nl_bd: Bemessungswert der Verankerungslänge [mm]\nα₁ bis α₅: Formbeiwerte für Formgebung, Betondeckung, Querbewehrung, angeschweißte Querstäbe, Querdruck\nl_b,rqd: Grundwert der Verankerungslänge [mm]\nA_s,erf / A_s,vorh: Verhältnis von erforderlicher zu vorhandener Bewehrung\nl_b,min: Mindestverankerungslänge [mm]" 
              : "Bemessungswert der Übergreifungslänge\nl_0: Bemessungswert der Übergreifungslänge [mm]\nα₁ bis α₆: Formbeiwerte (α₆ für Anteil der gestoßenen Stäbe)\nl_b,rqd: Grundwert der Verankerungslänge [mm]\nA_s,erf / A_s,vorh: Verhältnis von erforderlicher zu vorhandener Bewehrung\nl_0,min: Mindestübergreifungslänge [mm]",
            formel: berechnungsArt === 'verankerung' 
              ? "l_{bd} = \\left(\\prod_{i=1}^5 \\alpha_i\\right) \\cdot l_{b,rqd} \\cdot \\frac{A_{s,erf}}{A_{s,vorh}} \\ge l_{b,min}"
              : "l_0 = \\left(\\prod_{i=1}^6 \\alpha_i\\right) \\cdot l_{b,rqd} \\cdot \\frac{A_{s,erf}}{A_{s,vorh}} \\ge l_{0,min}"
          }
        ]}
      />
    </div>
  );
}
