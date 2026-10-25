import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { EC2_NA_DE } from '@/src/data/normParams';
import { bemesseVerankerung } from '@/src/calc/verankerung';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Layers } from 'lucide-react';
import inhalt from '@/content/verankerungslaenge/Verankerungslaenge.json';
import { MdText } from '@/src/components/inhalt/MdText';

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

  const results = useMemo(
    () => bemesseVerankerung({ fck, fyk, phi, verbund: verbundBedingung, beanspruchung, art: berechnungsArt, form: verankerungsArt, alpha2, alpha3, alpha5, alpha6, asErf, asVorh }),
    [fck, fyk, phi, verbundBedingung, beanspruchung, berechnungsArt, verankerungsArt, alpha2, alpha3, alpha5, alpha6, asErf, asVorh]
  );

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/20">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /><MdText text={inhalt.texte.verankerungslängeÜbergreifungslänge} /></h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300"><MdText text={inhalt.texte.berechnetNachDinEn} /></span>
        </div>
        <p className="text-text-main/80 mb-6"><MdText text={inhalt.texte.dieVerankerungslängeIstDie} /></p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/20">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.materialGeometrie} /></h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-text-main mb-1 block">Betonfestigkeit</label>
                  <select aria-label="Betonfestigkeit" 
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
                  <select aria-label="Stahlfestigkeit" 
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
                  <select aria-label="Verbundbedingungen" 
                    className="w-full p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                    value={verbundBedingung}
                    onChange={(e) => setVerbundBedingung(e.target.value as 'gut' | 'maessig')}
                  >
                    <option value="gut">Gute Bedingungen (unten/mittig)</option>
                    <option value="maessig">Mäßige Bedingungen (oben)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-main mb-1 block"><MdText text={inhalt.texte.artDerBerechnung} /></label>
                  <select aria-label={inhalt.werte.artDerBerechnung} 
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
                  <button aria-pressed={beanspruchung === 'zug'} 
                    onClick={() => setBeanspruchung('zug')} 
                    className={`flex-1 py-2 text-sm font-medium rounded-l-md ${beanspruchung === 'zug' ? 'bg-shiraz text-white' : 'text-text-main hover:bg-off-white'}`}
                  >Zug</button>
                  <button aria-pressed={beanspruchung === 'druck'} 
                    onClick={() => setBeanspruchung('druck')} 
                    className={`flex-1 py-2 text-sm font-medium rounded-r-md ${beanspruchung === 'druck' ? 'bg-shiraz text-white' : 'text-text-main hover:bg-off-white'}`}
                  >Druck</button>
                </div>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/20">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-text-main"><MdText text={inhalt.texte.einflussfaktoren} /><FormulaText text="\alpha" />)</h3>
                <InfoTooltip text={inhalt.werte.ausgewählteFaktorenZurReduktion} />
              </div>
              
              <div className="mb-4">
                <label className="text-sm font-medium text-text-main mb-1 block"><MdText text={inhalt.texte.formgebung} /><FormulaText text="\alpha_1" />)</label>
                <select aria-label={inhalt.werte.formgebung} 
                  className="w-full p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz disabled:bg-gray-100 disabled:text-gray-500"
                  value={verankerungsArt}
                  onChange={(e) => setVerankerungsArt(e.target.value as 'gerade' | 'haken' | 'winkel')}
                  disabled={beanspruchung === 'druck'}
                >
                  <option value="gerade">Gerades Stabende (α₁ = 1,0)</option>
                  <option value="haken">Haken / Winkel (α₁ = 0,7 bei ZUG)</option>
                </select>
              </div>

              {beanspruchung === 'zug' && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div>
                    <label className="text-xs font-medium text-text-main mb-1 block"><MdText text={inhalt.texte.betondeckung} /><FormulaText text="\alpha_2" />)</label>
                    <input aria-label={inhalt.werte.betondeckung} type="number" step="0.05" min="0.7" max="1.0" value={alpha2} onChange={e => setAlpha2(Number(e.target.value))} className="w-full p-1.5 text-sm border rounded" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-main mb-1 block"><MdText text={inhalt.texte.querbewehrung} /><FormulaText text="\alpha_3" />)</label>
                    <input aria-label={inhalt.werte.querbewehrung} type="number" step="0.05" min="0.7" max="1.0" value={alpha3} onChange={e => setAlpha3(Number(e.target.value))} className="w-full p-1.5 text-sm border rounded" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-main mb-1 block">Querdruck (<FormulaText text="\alpha_5" />)</label>
                    <input aria-label={inhalt.werte.querdruck} type="number" step="0.05" min="0.7" max="1.0" value={alpha5} onChange={e => setAlpha5(Number(e.target.value))} className="w-full p-1.5 text-sm border rounded" />
                  </div>
                </div>
              )}

              {berechnungsArt === 'uebergreifung' && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-text-main mb-1 block"><MdText text={inhalt.texte.stoßanteilAbstand} /><FormulaText text="\alpha_6" />)</label>
                  <select aria-label={inhalt.werte.stoßanteilAbstand} 
                    className="w-full p-2 border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz"
                    value={alpha6}
                    onChange={(e) => setAlpha6(Number(e.target.value))}
                  >
                    <option value={EC2_NA_DE.alpha6_33}>&lt; 33% gestoßen (α₆ = {formatDeZahl(EC2_NA_DE.alpha6_33, 2)})</option>
                    <option value={1.41}>&lt; 50% gestoßen (α₆ = 1,41)</option>
                    <option value={1.5}>&gt; 50% gestoßen (α₆ = 1,50)</option>
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
              <p className="text-xs text-home-grau"><MdText text={inhalt.texte.dasVerhältnis} /><FormulaText text={inhalt.werte.aSErfA} /><MdText text={inhalt.texte.darfZurReduzierungDer} /></p>
            </div>
          </div>

          <div className="space-y-6">
            <EingabeHinweise hinweise={results.hinweise} />
            <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Ergebnisse</h3>
              
              <div className="p-6 bg-shiraz/5 border border-shiraz/20 rounded-xl mb-6 text-center">
                <div className="text-sm text-shiraz font-bold uppercase tracking-wider mb-2">
                  {berechnungsArt === 'verankerung' ? inhalt.werte.bemessungswertVerankerungslänge : inhalt.werte.bemessungswertÜbergreifungslänge} <FormulaText text={berechnungsArt === 'verankerung' ? "l_{bd}" : "l_0"} />
                </div>
                <div className="text-5xl font-bold text-shiraz">
                  {formatDeZahl(results.lbd, 0)} <span className="text-xl font-normal">mm</span>
                </div>
                <div className="text-xs text-home-grau mt-2">
                  (entspricht {formatDeZahl((results.lbd / phi), 1)} <FormulaText text="\varnothing" />)
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.zugfestigkeitBeton} /><FormulaText text="f_{ctk;0,05}" /></span>
                  <span className="font-mono font-bold">{formatDeZahl(results.fctk005, 2)} MPa</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70"><MdText text={inhalt.texte.bemessungswertVerbund} /><FormulaText text="f_{bd}" /></span>
                  <span className="font-mono font-bold">{formatDeZahl(results.fbd, 2)} MPa</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Grundwert <FormulaText text="l_{b,rqd}" /></span>
                  <span className="font-mono font-bold">{formatDeZahl(results.lbRqd, 0)} mm</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Einflussfaktoren <FormulaText text="\prod \alpha_i" /></span>
                  <span className="font-mono font-bold">{formatDeZahl(results.totalAlpha, 2)}</span>
                </div>
                {berechnungsArt === 'uebergreifung' && (
                  <div className="flex justify-between border-b border-home-grau/10 pb-2">
                    <span className="text-text-main/70">Längsstoß-Faktor <FormulaText text="\alpha_6" /></span>
                    <span className="font-mono font-bold">{formatDeZahl(results.a6, 2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Ausnutzungsgrad <FormulaText text={inhalt.werte.aSErfA2} /></span>
                  <span className="font-mono font-bold">{formatDeZahl(results.asRatio, 2)}</span>
                </div>
                <div className="flex justify-between border-b border-home-grau/10 pb-2">
                  <span className="text-text-main/70">Mindestlänge <FormulaText text={berechnungsArt === 'verankerung' ? "l_{b,min}" : "l_{0,min}"} /></span>
                  <span className="font-mono font-bold">{formatDeZahl(results.lbMin, 0)} mm</span>
                </div>
              </div>
            </div>

            <FormulaDerivationBox
              live
              title={berechnungsArt === 'verankerung' ? inhalt.werte.ihrRechenwegVerankerungslängeMit : inhalt.werte.ihrRechenwegÜbergreifungslängeMit}
              zielGleichung={`${berechnungsArt === 'verankerung' ? 'l_{bd}' : 'l_0'} = \\prod \\alpha_i \\cdot l_{b,rqd} \\cdot \\frac{A_{s,erf}}{A_{s,vorh}} = ${formatDeTeX(results.lbd, 0)}\\,\\text{mm}`}
              normQuelle={inhalt.werte.dinEn19921}
              schritte={[
                {
                  titel: inhalt.werte.bemessungswertDerBetonzugfestigkeit,
                  erklaerung: inhalt.werte.fCtk005,
                  formel: `f_{ctd} = \\frac{f_{ctk;0{,}05}}{\\gamma_c} = \\frac{${formatDeTeX(results.fctk005, 2)}}{${formatDeTeX(EC2_NA_DE.gammaC, 1)}} = ${formatDeTeX(results.fctd, 2)}\\,\\text{N/mm}^2`,
                },
                {
                  titel: inhalt.werte.bemessungswertDerVerbundspannung,
                  erklaerung: `${verbundBedingung === 'gut' ? inhalt.werte.guteVerbundbedingungen10 : inhalt.werte.mäßigeVerbundbedingungen07}; ${phi <= 32 ? inhalt.werte.t32Mm10 : inhalt.werte.t32Mm132100}.`,
                  formel: `f_{bd} = 2{,}25 \\cdot ${formatDeTeX(verbundBedingung === 'gut' ? 1.0 : 0.7, 1)} \\cdot ${formatDeTeX(phi <= 32 ? 1.0 : (132 - phi) / 100, 2)} \\cdot ${formatDeTeX(results.fctd, 2)} = ${formatDeTeX(results.fbd, 2)}\\,\\text{N/mm}^2`,
                },
                {
                  titel: inhalt.werte.grundwertDerVerankerungslänge,
                  erklaerung: inhalt.werte.volleAusnutzungDesStabes,
                  formel: `l_{b,rqd} = \\frac{\\varnothing}{4} \\cdot \\frac{f_{yd}}{f_{bd}} = \\frac{${formatDeTeX(phi, 0)}}{4} \\cdot \\frac{${formatDeTeX(fyk / EC2_NA_DE.gammaS, 1)}}{${formatDeTeX(results.fbd, 2)}} = ${formatDeTeX(results.lbRqd, 0)}\\,\\text{mm}`,
                },
                {
                  titel: 'Beiwerte',
                  erklaerung: beanspruchung === 'zug'
                    ? `Zug: α₁ = ${formatDeZahl(results.currentAlpha1, 1)}, das Produkt α₂ · α₃ · α₅ ist nach unten auf 0,7 begrenzt${berechnungsArt === 'uebergreifung' ? `; Stoßanteil α₆ = ${formatDeZahl(results.a6, 2)}` : ''}.`
                    : `Druck: Alle Formbeiwerte sind 1,0${berechnungsArt === 'uebergreifung' ? `; Stoßanteil α₆ = ${formatDeZahl(results.a6, 2)}` : ''}.`,
                  formel: beanspruchung === 'zug'
                    ? `\\prod \\alpha_i = ${formatDeTeX(results.currentAlpha1, 1)} \\cdot \\max(0{,}7;\\; ${formatDeTeX(alpha2, 2)} \\cdot ${formatDeTeX(alpha3, 2)} \\cdot ${formatDeTeX(alpha5, 2)}) \\cdot ${formatDeTeX(results.a6, 2)} = ${formatDeTeX(results.totalAlpha, 3)}`
                    : `\\prod \\alpha_i = 1{,}0 \\cdot ${formatDeTeX(results.a6, 2)} = ${formatDeTeX(results.totalAlpha, 3)}`,
                },
                {
                  titel: berechnungsArt === 'verankerung' ? 'Verankerungslänge' : 'Übergreifungslänge',
                  erklaerung: berechnungsArt === 'verankerung'
                    ? `Mindestwert l_b,min = max(${beanspruchung === 'zug' ? '0,3' : '0,6'} · l_b,rqd; 10 Ø; 100 mm) = ${formatDeZahl(results.lbMin, 0)} mm.`
                    : `Mindestwert l_0,min = max(0,3 · α₆ · l_b,rqd; 15 Ø; 200 mm) = ${formatDeZahl(results.lbMin, 0)} mm.`,
                  formel: `${berechnungsArt === 'verankerung' ? 'l_{bd}' : 'l_0'} = \\max(${formatDeTeX(results.totalAlpha, 3)} \\cdot ${formatDeTeX(results.lbRqd, 0)} \\cdot \\tfrac{${formatDeTeX(asErf, 1)}}{${formatDeTeX(asVorh, 1)}};\\; ${formatDeTeX(results.lbMin, 0)}) = ${formatDeTeX(results.lbd, 0)}\\,\\text{mm}`,
                },
              ]}
              ergebnisHinweis={`${berechnungsArt === 'verankerung' ? 'l_bd' : 'l_0'} = ${formatDeZahl(results.lbd, 0)} mm (≈ ${formatDeZahl(results.lbd / phi, 1)} Ø)`}
            />

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellung} /></h3>
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
                  Die Kraft <FormulaText text="F_s" /><MdText text={inhalt.texte.wirdÜberVerbundspannungenEntlang} /><FormulaText text={berechnungsArt === 'verankerung' ? "l_{bd}" : "l_0"} /><MdText text={inhalt.texte.inDenBetonEingeleitet} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielGrundwertDerVerankerun}
        zielGleichung="l_{b,rqd} = \frac{\varnothing}{4} \cdot \frac{\sigma_{sd}}{f_{bd}}"
        normQuelle={inhalt.werte.dinEn199212}
        schritte={inhalt.daten["Verankerungslaenge.schritte"]}
        ergebnisHinweis={inhalt.werte.lBRqd570}
      />
    </div>
  );
}
