import { formatDeZahl, formatDeTeX, formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Award, AlertTriangle, CheckCircle2, Shield, Info, FileText, ChevronRight, Settings } from 'lucide-react';

export default function HydratationRissberechnung() {
  // Input parameters
  const [concreteGrade, setConcreteGrade] = useState('C30/37');
  const [thickness, setThickness] = useState(0.8); // m
  const [restraint, setRestraint] = useState(0.45); // Festhaltungsgrad R
  const [deltaThyd, setDeltaThyd] = useState(25); // K
  const [deltaTcool, setDeltaTcool] = useState(15); // K
  const [shrinkage, setShrinkage] = useState(0.15); // ‰ (0.15 mm/m)
  const [relaxation, setRelaxation] = useState(0.65); // k_relax
  const [alphaT, setAlphaT] = useState(1.0); // *10^-5 1/K
  const [barDiameter, setBarDiameter] = useState(16); // mm
  const [barSpacing, setBarSpacing] = useState(150); // mm
  const [concreteCover, setConcreteCover] = useState(50); // mm
  const [allowableCrackWidth, setAllowableCrackWidth] = useState(0.20); // mm
  const [showFormulas, setShowFormulas] = useState(true);

  // Concrete characteristic values lookup
  const concreteData = useMemo(() => {
    const grades: Record<string, { fck: number; fctm: number; Ecm: number }> = {
      'C20/25': { fck: 20, fctm: 2.2, Ecm: 30000 },
      'C25/30': { fck: 25, fctm: 2.6, Ecm: 31000 },
      'C30/37': { fck: 30, fctm: 2.9, Ecm: 33000 },
      'C35/45': { fck: 35, fctm: 3.2, Ecm: 34000 },
      'C40/50': { fck: 40, fctm: 3.5, Ecm: 35000 },
      'C45/55': { fck: 45, fctm: 3.8, Ecm: 36000 },
      'C50/60': { fck: 50, fctm: 4.1, Ecm: 37000 },
    };
    return grades[concreteGrade] || grades['C30/37'];
  }, [concreteGrade]);

  // Calculations
  const calcResults = useMemo(() => {
    const { fctm, Ecm } = concreteData;

    // 1. Total Free Strain (Freie Dehnung)
    const thermalStrain = (alphaT * 1e-5) * (deltaThyd + deltaTcool);
    const shrinkageStrain = shrinkage / 1000.0;
    const totalFreeStrain = thermalStrain + shrinkageStrain;

    // 2. Resulting restraint stress with Relaxation effect included
    // sigma_z = Ecm * eps_tot * R * k_relax
    const restraintStress = Ecm * (totalFreeStrain * 1000) * restraint * relaxation; // MPa (since Ecm is in MPa and strain is scaled)

    // 3. Effective early-age concrete tensile strength (meist 0.70 * fctm für das erste Hydratationsmaximum)
    const fctEff = 0.70 * fctm;

    // 4. Cracking Risk check
    const crackingFactor = restraintStress / fctEff;
    const isCracked = crackingFactor >= 1.0;

    // 5. Coefficient k according to DIN EN 1992-1-1 Cl. 7.3.2 (abhängig von Bauteildicke h)
    // k = 1.0 für h <= 300mm, k = 0.5 für h >= 800mm, dazwischen linear interpoliert
    let kCoeff = 0.8;
    if (thickness <= 0.3) {
      kCoeff = 0.8;
    } else if (thickness >= 0.8) {
      kCoeff = 0.5;
    } else {
      // Linear interpolation between (0.3; 0.8) and (0.8; 0.5)
      kCoeff = 0.8 - ((thickness - 0.3) / (0.8 - 0.3)) * (0.8 - 0.5);
    }

    // 6. Coefficient kc (zentrischer Zwang => kc = 1.0)
    const kcCoeff = 1.0;

    // 7. Limit Steel Stress (Grenzspannung der Bewehrung sigma_s) to limit crack width w_k
    // Interpolated lookup from DIN EN 1992-1-1 Table 7.2N & 7.3N (simplified engineering interpolation)
    let limitSteelStress = 300; // default MPa
    if (allowableCrackWidth === 0.20) {
      if (barDiameter <= 8) limitSteelStress = 320;
      else if (barDiameter <= 10) limitSteelStress = 280;
      else if (barDiameter <= 12) limitSteelStress = 240;
      else if (barDiameter <= 16) limitSteelStress = 200;
      else if (barDiameter <= 20) limitSteelStress = 160;
      else if (barDiameter <= 25) limitSteelStress = 135;
      else limitSteelStress = 110;
    } else if (allowableCrackWidth === 0.30) {
      if (barDiameter <= 8) limitSteelStress = 400;
      else if (barDiameter <= 10) limitSteelStress = 360;
      else if (barDiameter <= 12) limitSteelStress = 320;
      else if (barDiameter <= 16) limitSteelStress = 280;
      else if (barDiameter <= 20) limitSteelStress = 240;
      else if (barDiameter <= 25) limitSteelStress = 200;
      else limitSteelStress = 160;
    } else { // 0.40 mm
      if (barDiameter <= 8) limitSteelStress = 450;
      else if (barDiameter <= 10) limitSteelStress = 400;
      else if (barDiameter <= 12) limitSteelStress = 360;
      else if (barDiameter <= 16) limitSteelStress = 320;
      else if (barDiameter <= 20) limitSteelStress = 280;
      else if (barDiameter <= 25) limitSteelStress = 230;
      else limitSteelStress = 180;
    }

    // 8. Effective height of tension zone (h_eff) per side
    // heff = min( 2.5 * (c_nom + phi/2), h/2 )
    const hEff = Math.min(2.5 * (concreteCover + barDiameter / 2), (thickness * 1000) / 2); // mm
    
    // Effective Concrete Area in tension (Act,eff per meter width)
    const Act = hEff * 1000; // mm²/m per side

    // 9. Required Minimum Reinforcement Area (As,min) per side
    // As,min = kc * k * fct,eff * Act / sigma_s
    const AsMin = (kcCoeff * kCoeff * fctEff * Act) / limitSteelStress; // mm²/m
    const AsMinCm2 = AsMin / 100.0; // cm²/m

    // 10. Provided reinforcement (As,prov) per side
    // As,prov = (pi * barDiameter^2 / 4) * (1000 / barSpacing)
    const singleBarArea = (Math.PI * Math.pow(barDiameter, 2)) / 4.0; // mm²
    const AsProv = singleBarArea * (1000 / barSpacing); // mm²/m
    const AsProvCm2 = AsProv / 100.0; // cm²/m

    // 11. Utilization (Ausnutzungsgrad)
    const utilization = AsMin / AsProv;

    return {
      thermalStrain,
      shrinkageStrain,
      totalFreeStrain,
      restraintStress,
      fctEff,
      crackingFactor,
      isCracked,
      kCoeff,
      kcCoeff,
      limitSteelStress,
      hEff,
      Act,
      AsMinCm2,
      AsProvCm2,
      utilization,
    };
  }, [concreteGrade, thickness, restraint, deltaThyd, deltaTcool, shrinkage, relaxation, alphaT, barDiameter, barSpacing, concreteCover, allowableCrackWidth, concreteData]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Editorial Header Block */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Award className="text-shiraz" /> Rissgefahr- &amp; Mindestbewehrungsrechner (DIN EN 1992-1-1 / EC2)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 space-y-2">
          <p>
            <strong>Wissenschaftlicher Hintergrund:</strong> Kann man mit einfachen Reifegrad- und Temperaturmodellierungsrechnern die echte Rissgefahr berechnen? 
            <em> Die Antwort lautet: Nur unvollständig!</em> Einfache thermische Abschätzungen vernachlässigen fundamentale mechanische Wechselbeziehungen wie:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Relaxation von Eigenspannungen:</strong> In jungem Beton bauen sich Spannungen infolge von viskoelastischem Kriechen (Kriech-Relaxation) erheblich ab (<InlineMath math="\alpha_{cr} \approx 0{,}50 - 0{,}70" />).</li>
            <li><strong>Effektive Zugfestigkeitsentwicklung:</strong> Am ersten Hydratationsmaximum besitzt der Beton erst einen Bruchteil seiner 28-Tage-Normzugfestigkeit (<InlineMath math="f_{ct,eff} \approx 0{,}70 \cdot f_{ctm}" />).</li>
            <li><strong>Mindestbewehrung zur Rissbreitenbegrenzung (<InlineMath math="A_{s,min}" />):</strong> Ist Zwang nicht vermeidbar, reißt der Zementleim zwangsweise. Nur durch eine korrekt dimensionierte Mindestbewehrung wird die Rissöffnung auf unkritische, mikroskopische Breiten (<InlineMath math="w_k \le 0{,}2\,\text{mm}" />) beschränkt.</li>
          </ul>
          <p className="text-xs font-semibold text-shiraz mt-1">
            Dieses Praxismodul führt die ingenieurmäßige Bemessung nach Eurocode 2 und den DAfStb-Richtlinien für massige Bauteile interaktiv durch.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Parameter Eingabe */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider border-b border-home-grau/20 pb-2 flex items-center gap-2">
              <Settings size={16} className="text-shiraz" /> Bauteil- &amp; Querschnittskonfiguration
            </h3>

            {/* Betonklasse */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-home-grau uppercase tracking-wider">Betonfestigkeitsklasse</label>
              <select
                value={concreteGrade}
                onChange={(e) => setConcreteGrade(e.target.value)}
                className="w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:outline-none focus:border-shiraz bg-white"
              >
                {['C20/25', 'C25/30', 'C30/37', 'C35/45', 'C40/50', 'C45/55', 'C50/60'].map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <div className="text-[10px] text-slate-500 font-mono flex gap-3 mt-0.5">
                <span>f_ctm: {formatDeZahl(concreteData.fctm, 1)} N/mm²</span>
                <span>E_cm: {formatDeWert(concreteData.Ecm)} N/mm²</span>
              </div>
            </div>

            {/* Bauteildicke h */}
            <Slider
              label="Bauteildicke (h)"
              min={0.2} max={2.5} step={0.1}
              value={thickness} unit="m"
              info="Die Gesamtdicke des Bauteils. Beeinflusst das Beiwert für nichtlineare Spannungen (k-Coeff) sowie die Rissbildungsflächen."
              onChange={(e) => setThickness(Number(e.target.value))}
            />

            {/* Festhaltungsgrad R */}
            <div className="mt-1">
              <Slider
                label="Festhaltungsbeiwert (R)"
                min={0.0} max={1.0} step={0.05}
                value={restraint} unit="-"
                info="Gibt an, wie stark die Verformung behindert wird (0 = freie Dehnung, 1 = starre Einspannung). Typischerweise 0.35 bis 0.50 für Fundamente auf Reibungsschichten, 0.70 bis 0.90 für monolithische Wand-auf-Fundament-Anschlüsse."
                onChange={(e) => setRestraint(Number(e.target.value))}
              />
              <div className="flex gap-2.5 mt-1">
                <button onClick={() => setRestraint(0.20)} className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded transition">Gleitlager (0,20)</button>
                <button onClick={() => setRestraint(0.45)} className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded transition">Bodenplatte (0,45)</button>
                <button onClick={() => setRestraint(0.80)} className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded transition">Starr gekoppelt (0,80)</button>
              </div>
            </div>

            {/* Betondeckung nom c */}
            <Slider
              label="BetondeckungNom (c_nom)"
              min={25} max={80} step={5}
              value={concreteCover} unit="mm"
              info="Konzentrische Betondeckung bis zum Bewehrungsstab. Definiert die wirksame Zugrandzone (h_eff)."
              onChange={(e) => setConcreteCover(Number(e.target.value))}
            />
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider border-b border-home-grau/20 pb-2 flex items-center gap-2">
              <FileText size={16} className="text-shiraz" /> Thermohygrische Verformungsquellen
            </h3>

            {/* Hydratations-Erwärmung deltaThyd */}
            <Slider
              label="Hydratations-Aufwärmung (ΔT_hyd)"
              min={10} max={50} step={1}
              value={deltaThyd} unit="K"
              info="Adiabatischer Temperaturanstieg infolge der Zementhydratation im Bauteilkern."
              onChange={(e) => setDeltaThyd(Number(e.target.value))}
            />

            {/* Abkühl-Temperaturgefälle deltaTcool */}
            <Slider
              label="Abkühlungsgefälle (ΔT_cool)"
              min={5} max={40} step={1}
              value={deltaTcool} unit="K"
              info="Temperaturdifferenz bei der anschließenden kalten Ausgleichsphase bis zur mittleren Betriebstemperatur."
              onChange={(e) => setDeltaTcool(Number(e.target.value))}
            />

            {/* Schwindmaß eps_cs */}
            <Slider
              label="Wirksames Schwinden (ε_cs)"
              min={0.00} max={0.50} step={0.05}
              value={shrinkage} unit="‰"
              info="Ganzheitlich wirksames Schwindmaß (Autogenes Schwinden und Trocknungsschwinden) zum Zeitpunkt der maximalen Rissgefahr."
              onChange={(e) => setShrinkage(Number(e.target.value))}
            />

            {/* Relaxationsbeiwert k_relax */}
            <Slider
              label="Relaxationsbeiwert (k_relax)"
              min={0.4} max={1.0} step={0.05}
              value={relaxation} unit="-"
              info="Berücksichtigt den viskoelastischen Spannungsabbau durch Betonkriechen in jungem Stadium. Standardmäßig ca. 0.65; weniger k_relax bedeutet eine stärkere Abminderung der gefährlichen Zwangspannungen."
              onChange={(e) => setRelaxation(Number(e.target.value))}
            />
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider border-b border-home-grau/20 pb-2 flex items-center gap-2">
              <Shield size={16} className="text-shiraz" /> Bewehrung &amp; Rissbreitenbeschränkung
            </h3>

            {/* Zulässige Rissbreite w_k */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-home-grau uppercase tracking-wider">Zulässige Rissbreite (w_k)</label>
              <select
                value={allowableCrackWidth}
                onChange={(e) => setAllowableCrackWidth(Number(e.target.value))}
                className="w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:outline-none focus:border-shiraz bg-white"
              >
                <option value={0.20}>w_k = 0,20 mm (Z.B. Weiße Wannen / WU-Bauwerke / aggressive Medien)</option>
                <option value={0.30}>w_k = 0,30 mm (Standard-Stahlbetonbau, Expositionsklassen XC2, XC3, XC4)</option>
                <option value={0.40}>w_k = 0,40 mm (Trockene Innenräume, Expositionsklasse XC1)</option>
              </select>
            </div>

            {/* Stabdurchmesser phi */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-home-grau uppercase tracking-wider">Gewählter Stabdurchmesser (Ø_s)</label>
              <select
                value={barDiameter}
                onChange={(e) => setBarDiameter(Number(e.target.value))}
                className="w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:outline-none focus:border-shiraz bg-white"
              >
                {[8, 10, 12, 14, 16, 20, 25, 28].map(d => (
                  <option key={d} value={d}>Ø {formatDeWert(d)} mm</option>
                ))}
              </select>
            </div>

            {/* Stababstand s */}
            <Slider
              label="Stababstand (s)"
              min={80} max={300} step={10}
              value={barSpacing} unit="mm"
              info="Achsabstand der Verlegestäbe im Bewehrungsnetz."
              onChange={(e) => setBarSpacing(Number(e.target.value))}
            />
          </div>

        </div>

        {/* Right Column: Ergebnisse, Formeln & Praxisbeurteilung */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Calculation Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Rissrisiko Status Card */}
            <div className={`p-5 rounded-2xl border shadow-sm transition-all duration-300 flex flex-col justify-between ${
              calcResults.isCracked 
                ? 'bg-red-50 border-red-200 text-red-950' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}>
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Rissbildung (Erstbelastung)</span>
                  {calcResults.isCracked 
                    ? <span className="bg-red-200 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">GERISSEN</span>
                    : <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">RISSDICHT</span>
                  }
                </div>
                
                <div className="mt-3">
                  <div className="text-2xl font-black">
                    σ_z = {formatDeZahl(calcResults.restraintStress, 2)} MPa
                  </div>
                  <div className="text-xs opacity-85 mt-1">
                    Aktuelle Zwangspannung im jungen Betonalter vs. wirksame Zugfestigkeit f_ct,eff = {formatDeZahl(calcResults.fctEff, 2)} MPa
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-black/10 flex items-center gap-2">
                {calcResults.isCracked ? (
                  <>
                    <AlertTriangle className="text-red-600 flex-shrink-0" size={18} />
                    <span className="text-xs font-semibold leading-tight text-red-900">
                      Risse entstehen! Mindestbewehrung zwecks Rissverteilung zwingend erforderlich.
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={18} />
                    <span className="text-xs font-semibold leading-tight text-emerald-900">
                      Zwangspannung liegt unterhalb der Dehngrenze. Makroskopisches Reißen unwahrscheinlich.
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Bewehrungsnachweis Card */}
            <div className={`p-5 rounded-2xl border shadow-sm transition-all duration-300 flex flex-col justify-between ${
              calcResults.utilization > 1.0 
                ? 'bg-orange-50 border-orange-200 text-orange-950' 
                : 'bg-teal-50 border-teal-200 text-teal-950'
            }`}>
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Rissbreitennachweis (EC2)</span>
                  {calcResults.utilization > 1.0 
                    ? <span className="bg-orange-200 text-orange-850 text-[10px] font-bold px-2 py-0.5 rounded-full">NICHT ERFÜLLT</span>
                    : <span className="bg-teal-200 text-teal-850 text-[10px] font-bold px-2 py-0.5 rounded-full">ERFÜLLT</span>
                  }
                </div>

                <div className="mt-3">
                  <div className="text-2xl font-black flex items-baseline gap-1.5">
                    As,prov = {formatDeZahl(calcResults.AsProvCm2, 2)} cm²/m
                    <span className="text-xs font-normal opacity-75">/ As,min = {formatDeZahl(calcResults.AsMinCm2, 2)} cm²/m</span>
                  </div>
                  <div className="text-xs opacity-85 mt-1">
                    Auslastung der Mindestbewehrung: <strong className="font-bold">{formatDeZahl((calcResults.utilization * 100), 0)}%</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-black/10 flex items-center gap-2">
                {calcResults.utilization > 1.0 ? (
                  <>
                    <AlertTriangle className="text-orange-600 flex-shrink-0" size={18} />
                    <span className="text-xs font-semibold leading-tight text-orange-900">
                      A_s,prov unzureichend! Reduzieren Sie den Stababstand oder vergrößern Sie Ø_s.
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="text-teal-600 flex-shrink-0" size={18} />
                    <span className="text-xs font-semibold leading-tight text-teal-900">
                      Bewehrungsmenge ausreichend, um Rissbreite w_k ≤ {formatDeZahl(allowableCrackWidth, 2)} mm zu halten.
                    </span>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Detailed step-by-step engineering report */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex justify-between items-center border-b border-home-grau/25 pb-3 mb-4">
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-shiraz" /> Nachweisprotokoll (Schritt für Schritt)
              </h3>
              <button
                onClick={() => setShowFormulas(!showFormulas)}
                className="text-xs text-shiraz font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showFormulas ? 'Formeln verbergen' : 'Formeln einblenden'}
              </button>
            </div>

            <div className="space-y-4 text-xs text-text-main/90">
              
              {/* Step 1 */}
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                <div className="font-bold flex justify-between">
                  <span>Schritt 1: Gesamte freie Zwangsdehnung ε_tot</span>
                  <span className="text-slate-600">{formatDeZahl((calcResults.totalFreeStrain * 1000), 4)} ‰</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Summe aus thermischer Längenänderung (Kernaufheizung und anschließende Abkühlung) und Schwinden:
                </p>
                {showFormulas && (
                  <div className="bg-white py-1.5 px-3 rounded border text-center font-mono overflow-x-auto text-[10px] text-slate-700">
                    <BlockMath math={`\\varepsilon_{tot} = \\alpha_T \\cdot (\\Delta T_{hyd} + \\Delta T_{cool}) + \\varepsilon_{cs}`} />
                    <BlockMath math={`\\varepsilon_{tot} = ${formatDeTeX(alphaT, 2)} \\cdot 10^{-5} \\cdot (${formatDeTeXWert(deltaThyd)} + ${formatDeTeXWert(deltaTcool)}) + \\frac{${formatDeTeX(shrinkage, 2)}}{1000} = ${formatDeTeX((calcResults.totalFreeStrain * 1000), 4)}\\,\\text{‰}`} />
                  </div>
                )}
              </div>

              {/* Step 2 */}
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                <div className="font-bold flex justify-between">
                  <span>Schritt 2: Ermittlung der Zwangspannung σ_z</span>
                  <span className="text-slate-600 font-mono">{formatDeZahl(calcResults.restraintStress, 2)} MPa</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Errechnet aus dem Elastizitätsmodul des Betons unter Berücksichtigung des Festhaltungsgrades (Behinderung) und dem Abklingbeiwert der Kriechrelaxation (early-age relaxation factor):
                </p>
                {showFormulas && (
                  <div className="bg-white py-1.5 px-3 rounded border text-center font-mono overflow-x-auto text-[10px] text-slate-700">
                    <BlockMath math={`\\sigma_z = E_{cm} \\cdot \\varepsilon_{tot} \\cdot R \\cdot k_{relax}`} />
                    <BlockMath math={`\\sigma_z = ${concreteData.Ecm} \\cdot ${formatDeTeX((calcResults.totalFreeStrain), 6)} \\cdot ${formatDeTeX(restraint, 2)} \\cdot ${formatDeTeX(relaxation, 2)} = ${formatDeTeX(calcResults.restraintStress, 2)}\\,\\text{N/mm}^2`} />
                  </div>
                )}
              </div>

              {/* Step 3 */}
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                <div className="font-bold flex justify-between">
                  <span>Schritt 3: Bemessungswert der Zugfestigkeit f_ct,eff</span>
                  <span className="text-slate-600 font-mono">{formatDeZahl(calcResults.fctEff, 2)} MPa</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Um das Risiko der Erstbelastungsrisse am Hydratationsmaximum (meist nach 3-5 Tagen) sicher abzubilden, wird die wirksame Zugfestigkeit zum Risszeitpunkt mit 70% des Normmittelwerts angesetzt:
                </p>
                {showFormulas && (
                  <div className="bg-white py-1.5 px-3 rounded border text-center font-mono overflow-x-auto text-[10px] text-slate-700">
                    <BlockMath math={`f_{ct,eff} = 0{,}70 \\cdot f_{ctm} = 0{,}70 \\cdot ${formatDeTeX(concreteData.fctm, 2)} = ${formatDeTeX(calcResults.fctEff, 2)}\\,\\text{N/mm}^2`} />
                  </div>
                )}
              </div>

              {/* Step 4 */}
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                <div className="font-bold flex justify-between">
                  <span>Schritt 4: Wirksame Zugzonenhöhe h_eff &amp; Betonzugfläche A_ct</span>
                  <span className="text-slate-600 font-mono">h_eff = {formatDeZahl(calcResults.hEff, 0)} mm</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Berechnung der maßgeblichen Betonrandzone am einseitigen Querschnitt, die unter Abkühlung auf Zug beansprucht wird (nach DIN EN 1992-1-1 Cl. 7.3.2):
                </p>
                {showFormulas && (
                  <div className="bg-white py-1.5 px-3 rounded border text-center font-mono overflow-x-auto text-[10px] text-slate-700">
                    <BlockMath math={`h_{eff} = \\min\\left( 2{,}5 \\cdot (c_{nom} + \\varnothing_s/2), \\frac{h}{2} \\right)`} />
                    <BlockMath math={`h_{eff} = \\min\\left( 2{,}5 \\cdot (${formatDeTeXWert(concreteCover)} + ${formatDeTeXWert(barDiameter)}/2), \\frac{${formatDeTeXWert(thickness * 1000)}}{2} \\right) = ${formatDeTeX(calcResults.hEff, 1)}\\,\\text{mm}`} />
                    <BlockMath math={`A_{ct} = h_{eff} \\cdot 1000\\,\\text{mm} = ${formatDeTeX(calcResults.Act, 0)}\\,\\text{mm}^2/\\text{m}`} />
                  </div>
                )}
              </div>

              {/* Step 5 */}
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                <div className="font-bold flex justify-between">
                  <span>Schritt 5: Grenzstahlspannung σ_s für Rissbreite w_k</span>
                  <span className="text-slate-600 font-mono">Grenzspannung σ_s = {formatDeWert(calcResults.limitSteelStress)} MPa</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Zur Beschränkung der Rissbreite auf den zulässigen Grenzwert (<InlineMath math={`w_k = ${formatDeTeX(allowableCrackWidth, 2)}\\text{ mm}`} />) wird die maximale Stahlspannung bei Rissöffnung nach Tabelle 7.2N/7.3N abgegrenzt:
                </p>
                <div className="bg-white p-2 rounded border text-center text-[10px] font-mono select-none">
                  Für Ø {formatDeWert(barDiameter)} mm und w_k = {formatDeZahl(allowableCrackWidth, 2)} mm → <span className="font-bold text-shiraz">σ_s,lim = {formatDeWert(calcResults.limitSteelStress)} N/mm²</span>
                </div>
              </div>

              {/* Step 6 */}
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                <div className="font-bold flex justify-between">
                  <span>Schritt 6: Mindestbewehrungsmenge A_s,min</span>
                  <span className="text-shiraz font-bold font-mono">A_s,min = {formatDeZahl(calcResults.AsMinCm2, 2)} cm²/m</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Rechnerischer Mindeststahlquerschnitt zur Sicherung einer feingliedrigen Rissverteilung ohne unkontrollierte Klusterrisse (Trennrisse):
                </p>
                {showFormulas && (
                  <div className="bg-white py-1.5 px-3 rounded border text-center font-mono overflow-x-auto text-[10px] text-slate-700">
                    <BlockMath math={`A_{s,min} = k_c \\cdot k \\cdot f_{ct,eff} \\cdot \\frac{A_{ct}}{\\sigma_s}`} />
                    <p className="text-[10px] text-slate-500 italic my-1">(Beiwert k = {formatDeZahl(calcResults.kCoeff, 2)} wegen Massigkeit, k_c = {formatDeZahl(calcResults.kcCoeff, 1)} für zentrische Normkraft)</p>
                    <BlockMath math={`A_{s,min} = ${formatDeTeX(calcResults.kcCoeff, 1)} \\cdot ${formatDeTeX(calcResults.kCoeff, 2)} \\cdot ${formatDeTeX(calcResults.fctEff, 2)} \\cdot \\frac{${formatDeTeX(calcResults.Act, 0)}}{${formatDeTeXWert(calcResults.limitSteelStress)}} = ${formatDeTeX(calcResults.AsMinCm2, 2)}\\,\\text{cm}^2/\\text{m}`} />
                  </div>
                )}
              </div>

              {/* Step 7 */}
              <div className="p-3 bg-[#FCF8F2] rounded-xl border border-home-grau/25 flex flex-col gap-1.5">
                <div className="font-bold flex justify-between text-text-main">
                  <span>Schritt 7: Vorhandene Bewehrungsmenge A_s,prov &amp; Nachweis</span>
                  <span className="font-mono">{formatDeZahl(calcResults.AsProvCm2, 2)} cm²/m</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Bewehrungsmenge der gewählten Verlegeparameter (Stabdurchmesser und Verlegeabstand):
                </p>
                {showFormulas && (
                  <div className="bg-white py-1.5 px-3 rounded border text-center font-mono overflow-x-auto text-[10px] text-slate-700">
                    <BlockMath math={`A_{s,prov} = \\frac{\\pi \\cdot \\varnothing_s^2}{4} \\cdot \\frac{1000}{s}`} />
                    <BlockMath math={`A_{s,prov} = \\frac{\\pi \\cdot ${formatDeTeXWert(barDiameter)}^2}{4} \\cdot \\frac{1000}{${formatDeTeXWert(barSpacing)}} = ${formatDeTeX(calcResults.AsProvCm2, 2)}\\,\\text{cm}^2/\\text{m}`} />
                  </div>
                )}
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold text-slate-700">Ausnutzungsgrad (Bewehrungsnachweis):</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    calcResults.utilization <= 1.0 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-orange-100 text-orange-850 border border-orange-200'
                  }`}>
                    {calcResults.utilization <= 1.0 ? '✓ Nachweis erfüllt' : '✗ Nicht erfüllt'} ({ formatDeZahl((calcResults.utilization * 100), 0) } %)
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Practical recommendations */}
          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-200 text-xs flex gap-3 text-blue-900 leading-normal">
            <Info className="flex-shrink-0 text-blue-600 mt-0.5" size={18} />
            <div className="space-y-1">
              <span className="font-bold block text-blue-950 text-sm">Praktische Baustoff-Optimierung:</span>
              <p>
                Wenn Sie eine unzureichende Bewehrung feststellen, versuchen Sie Folgendes:
              </p>
              <ul className="list-disc pl-4 space-y-1 mt-1 text-blue-900/90">
                <li><strong>Geringerer Stabdurchmesser (Ø_s):</strong> Ein kleinerer Durchmesser (z.B. Ø 12 statt Ø 16) erhöht die Grenzstahlspannung <InlineMath math="\sigma_s" /> da kleinere Stäbe die Risskräfte feiner im Beton verteilen. Das reduziert die erforderliche Bewehrungsmenge <InlineMath math="A_{s,min}" /> drastisch!</li>
                <li><strong>Geringerer Zementgehalt:</strong> Senkt <InlineMath math="\Delta T_{hyd}" /> und damit das Rissrisiko.</li>
                <li><strong>Festhaltungsgrad reduzieren:</strong> Einbau von Gleitfolien unterm Fundament senkt <InlineMath math="R" /> und beugt Trennrissen vor.</li>
              </ul>
            </div>
          </div>

        </div>

      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Rissbreitenbegrenzung' },
          { title: 'Zwangspannung', url: 'https://de.wikipedia.org/wiki/Zwangspannung' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Heft 600 DAfStb: Erläuterungen zu DIN EN 1992-1-1 (Eurocode 2)'
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1 (Bemessung und Konstruktion von Stahlbetontragwerken)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' },
          { title: 'DAfStb-Richtlinie: Massige Bauteile aus Beton', url: 'https://www.dinmedia.de/de/suche?q=DAfStb+Massige+Bauteile+aus+Beton' }
        ]}
        formeln={[
          {
            formel: 'A_{s,min} = k_c \\cdot k \\cdot f_{ct,eff} \\cdot A_{ct} / \\sigma_s',
            erklaerung: 'Mindestbewehrungsformel zur Rissbreitenbegrenzung gemäß DIN EN 1992-1-1 Abschnitt 7.3.2.',
            quelle: 'DIN EN 1992-1-1'
          }
        ]}
      />

    </div>
  );
}
