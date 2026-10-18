import React, { useState, useMemo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { Activity, Gauge, AlertTriangle, CheckCircle2, ShieldAlert, Droplets, Waves, Hammer, Compass, Trees, Scale, Layers } from 'lucide-react';
import { PruefverfahrenDetail } from './pruefverfahrenData';

interface SimulatorProps {
  method: PruefverfahrenDetail;
}

export function PruefverfahrenSimulator({ method }: SimulatorProps) {
  // Common states
  // 1. Schmidt-Hammer
  const [rebound, setRebound] = useState<number>(36);
  const [impactAngle, setImpactAngle] = useState<'horiz' | 'down' | 'up'>('horiz');
  const [carbDepth, setCarbDepth] = useState<number>(12); // mm
  const [concreteAge, setConcreteAge] = useState<number>(30); // Jahre

  // 2. Ultraschall
  const [usDistance, setUsDistance] = useState<number>(0.30); // m
  const [usTime, setUsTime] = useState<number>(75); // µs
  const [usDensity, setUsDensity] = useState<number>(2400); // kg/m³

  // 3. Potentialfeld
  const [potentialVal, setPotentialVal] = useState<number>(-380); // mV vs Cu/CuSO4

  // 4. Covermeter
  const [exposureClass, setExposureClass] = useState<'XC1' | 'XC3' | 'XC4' | 'XD1' | 'XD3'>('XC4');
  const [measuredCover, setMeasuredCover] = useState<number>(22); // mm

  // 5. Bohrmehl / Chlorid
  const [isPrestressed, setIsPrestressed] = useState<boolean>(false);
  const [chlorideVal, setChlorideVal] = useState<number>(0.55); // M.-% bezogen auf Zement

  // 6. Haftabzug
  const [breakForce, setBreakForce] = useState<number>(3.2); // kN
  const [failureType, setFailureType] = useState<'beton' | 'verbund' | 'kleber'>('beton');

  // 7. Karsten
  const [waterLoss60, setWaterLoss60] = useState<number>(1.8); // ml

  // 8. Karbonatisierung
  const [carbMeasured, setCarbMeasured] = useState<number>(24); // mm
  const [elementAge, setElementAge] = useState<number>(45); // Jahre
  const [elementCover, setElementCover] = useState<number>(30); // mm

  // 9. Bohrkern
  const [coreDiameter, setCoreDiameter] = useState<number>(100); // mm
  const [coreLength, setCoreLength] = useState<number>(100); // mm
  const [coreMaxForce, setCoreMaxForce] = useState<number>(265); // kN

  // 10. Impact-Echo
  const [ieFreq, setIeFreq] = useState<number>(6.5); // kHz
  const [ieVp, setIeVp] = useState<number>(4000); // m/s
  const [ieNominalThickness, setIeNominalThickness] = useState<number>(30); // cm

  // 11. Bohrwiderstand (Holz)
  const [timberType, setTimberType] = useState<'fichte' | 'eiche' | 'kiefer'>('fichte');
  const [timberCondition, setTimberCondition] = useState<'gesund' | 'faeule' | 'hohl'>('gesund');

  // Calculations
  // Schmidt-Hammer
  const schmidtCalc = useMemo(() => {
    let r_corr = rebound;
    if (impactAngle === 'down') r_corr -= 3.0;
    if (impactAngle === 'up') r_corr += 3.5;

    // Karbonatisierungskorrektur nach DIN EN 13791
    let k_carb = 1.0;
    if (carbDepth > 5) {
      k_carb = Math.max(0.75, 1.0 - (carbDepth - 5) * 0.015);
    }
    const r_final = r_corr * k_carb;

    // Potenzansatz f_c,is ≈ 0.013 * R^2.25
    const fc_est = 0.0125 * Math.pow(r_final, 2.22);
    let grade = 'C16/20';
    if (fc_est >= 50) grade = 'C50/60';
    else if (fc_est >= 45) grade = 'C45/55';
    else if (fc_est >= 35) grade = 'C35/45';
    else if (fc_est >= 30) grade = 'C30/37';
    else if (fc_est >= 25) grade = 'C25/30';
    else if (fc_est >= 20) grade = 'C20/25';

    return {
      r_corr: r_corr.toFixed(1),
      k_carb: k_carb.toFixed(2),
      r_final: r_final.toFixed(1),
      fc_est: fc_est.toFixed(1),
      grade
    };
  }, [rebound, impactAngle, carbDepth]);

  // Ultraschall
  const usCalc = useMemo(() => {
    const vp = (usDistance / (usTime * 1e-6)); // m/s
    const nu = 0.20; // Querdehnzahl
    // E_dyn = rho * vp^2 * ((1+nu)(1-2nu))/(1-nu)
    const factor = ((1 + nu) * (1 - 2 * nu)) / (1 - nu);
    const edyn = usDensity * Math.pow(vp, 2) * factor * 1e-9; // GPa

    let status = 'Hervorragendes, sehr dichtes Betongefüge';
    let color = 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (vp < 3000) {
      status = 'Kritischer Gefügemangel / Ausgeprägte Hohlstellen';
      color = 'text-rose-600 bg-rose-50 border-rose-200';
    } else if (vp < 3800) {
      status = 'Mäßige Gefügequalität / Lokale Mikrorissigkeit';
      color = 'text-amber-600 bg-amber-50 border-amber-200';
    }

    return {
      vp: Math.round(vp),
      edyn: edyn.toFixed(1),
      status,
      color
    };
  }, [usDistance, usTime, usDensity]);

  // Potentialfeld
  const potentialCalc = useMemo(() => {
    let prob = 'Sehr gering (< 10 %)';
    let state = 'Passiver, intakter Bewehrungsstahl';
    let badgeColor = 'bg-emerald-500 text-white';
    let borderColor = 'border-emerald-200 bg-emerald-50/50';

    if (potentialVal < -350) {
      prob = 'Sehr hoch (> 90 %)';
      state = 'Akute, fortschreitende Lochfraßkorrosion (Anode)';
      badgeColor = 'bg-rose-600 text-white';
      borderColor = 'border-rose-200 bg-rose-50/50';
    } else if (potentialVal <= -200) {
      prob = 'Ungewiss (10 % bis 90 %)';
      state = 'Übergangsbereich / beginnende Depassivierung';
      badgeColor = 'bg-amber-500 text-white';
      borderColor = 'border-amber-200 bg-amber-50/50';
    }

    return { prob, state, badgeColor, borderColor };
  }, [potentialVal]);

  // Covermeter
  const coverCalc = useMemo(() => {
    const minMap = {
      XC1: { min: 15, dev: 10, req: 25 },
      XC3: { min: 25, dev: 10, req: 35 },
      XC4: { min: 30, dev: 10, req: 40 },
      XD1: { min: 35, dev: 10, req: 45 },
      XD3: { min: 45, dev: 10, req: 55 }
    };
    const req = minMap[exposureClass];
    const diff = measuredCover - req.req;
    const isOk = diff >= 0;

    return {
      c_min: req.min,
      c_nom: req.req,
      diff: diff > 0 ? `+${diff}` : `${diff}`,
      isOk
    };
  }, [exposureClass, measuredCover]);

  // Bohrmehl / Chlorid
  const chlorideCalc = useMemo(() => {
    const limit = isPrestressed ? 0.20 : 0.40;
    const isExceeded = chlorideVal > limit;
    const ratio = (chlorideVal / limit).toFixed(2);

    return {
      limit,
      isExceeded,
      ratio
    };
  }, [isPrestressed, chlorideVal]);

  // Haftabzug
  const haftCalc = useMemo(() => {
    const area = (Math.PI * Math.pow(50, 2)) / 4; // 1963.5 mm²
    const fct = (breakForce * 1000) / area; // N/mm²
    const isNormOk = fct >= 1.5 && failureType === 'beton';

    return {
      area: Math.round(area),
      fct: fct.toFixed(2),
      isNormOk
    };
  }, [breakForce, failureType]);

  // Karsten
  const karstenCalc = useMemo(() => {
    // A = 4.5 cm² = 0.00045 m²
    // t = 1 h -> sqrt(t) = 1.0
    // w_kap = (deltaV * 1e-3 kg) / (0.00045 m² * 1) = deltaV * 2.22 kg/(m²*sqrt(h))
    const w = waterLoss60 * 2.222;
    let evalText = 'Wasserabweisend (Hydrophobiert)';
    let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (w > 0.5) {
      evalText = 'Stark saugender Untergrund (Hohes Schadensrisiko)';
      badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
    } else if (w >= 0.1) {
      evalText = 'Wasserhemmend (Normaler Außenputz)';
      badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
    }

    return {
      w: w.toFixed(2),
      evalText,
      badgeClass
    };
  }, [waterLoss60]);

  // Karbonatisierung
  const carbCalc = useMemo(() => {
    const k_carb = carbMeasured / Math.sqrt(elementAge);
    // Zeit bis zur Depassivierung: t_depass = (elementCover / k_carb)^2
    const t_depass = Math.pow(elementCover / Math.max(0.1, k_carb), 2);
    const restJahre = Math.max(0, Math.round(t_depass - elementAge));

    return {
      k_carb: k_carb.toFixed(2),
      t_depass: Math.round(t_depass),
      restJahre,
      depassivated: elementCover <= carbMeasured
    };
  }, [carbMeasured, elementAge, elementCover]);

  // Bohrkern
  const bohrkernCalc = useMemo(() => {
    const radius = coreDiameter / 2;
    const area = Math.PI * Math.pow(radius, 2); // mm²
    const rawStrength = (coreMaxForce * 1000) / area; // N/mm²

    const lambda = coreLength / coreDiameter; // L/D
    // DIN EN 12504-1 Korrekturfaktor auf L/D = 1.0 bzw. 2.0
    let f_corr = rawStrength;
    if (lambda < 0.95 || lambda > 1.05) {
      // Norm-Formel: f_is = raw / (0.80 + 0.22 / lambda) für L/D < 2
      f_corr = rawStrength / (0.80 + (0.22 / Math.max(0.5, lambda)));
    }

    return {
      area: Math.round(area),
      lambda: lambda.toFixed(2),
      rawStrength: rawStrength.toFixed(1),
      f_corr: f_corr.toFixed(1)
    };
  }, [coreDiameter, coreLength, coreMaxForce]);

  // Impact-Echo
  const ieCalc = useMemo(() => {
    // d = (beta * vp) / (2 * f)
    // f in Hz = ieFreq * 1000
    // d in m = (0.96 * ieVp) / (2 * ieFreq * 1000)
    const d_m = (0.96 * ieVp) / (2 * (ieFreq * 1000));
    const d_cm = d_m * 100;
    const diff = Math.abs(d_cm - ieNominalThickness);
    const isDelam = diff > 4.0 && d_cm < ieNominalThickness;

    return {
      d_cm: d_cm.toFixed(1),
      isDelam
    };
  }, [ieFreq, ieVp, ieNominalThickness]);

  return (
    <div className="bg-[#fcf8f2] rounded-2xl border border-home-grau/30 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-shiraz text-white rounded-lg">
            <Gauge size={16} />
          </span>
          <div>
            <h4 className="font-bold text-sm text-text-main">
              Interaktiver Prüf- &amp; Auswertungs-Simulator
            </h4>
            <p className="text-[11px] text-text-main/70">
              Prüfparameter in-situ einstellen und normative Grenzwerte direkt validieren
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-shiraz/10 text-shiraz font-bold">
          Normativ: {method.badge}
        </span>
      </div>

      {/* 1. SCHMIDT-HAMMER SIMULATOR */}
      {method.id === 'schmidthammer' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Rückprallwert R (Median aus 10 Schlägen):</span>
                <span className="font-bold text-shiraz">{rebound}</span>
              </div>
              <input
                type="range"
                min="15"
                max="55"
                step="1"
                value={rebound}
                onChange={(e) => setRebound(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Schlagbolzen-Ausrichtung:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setImpactAngle('horiz')}
                  className={`py-1.5 px-2 rounded-lg border font-bold ${impactAngle === 'horiz' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                >
                  Horizontal (0°)
                </button>
                <button
                  type="button"
                  onClick={() => setImpactAngle('down')}
                  className={`py-1.5 px-2 rounded-lg border font-bold ${impactAngle === 'down' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                >
                  Boden (-90°)
                </button>
                <button
                  type="button"
                  onClick={() => setImpactAngle('up')}
                  className={`py-1.5 px-2 rounded-lg border font-bold ${impactAngle === 'up' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                >
                  Decke (+90°)
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Karbonatisierungstiefe d_k:</span>
                <span className="font-bold text-slate-800">{carbDepth} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={carbDepth}
                onChange={(e) => setCarbDepth(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>
          </div>

          <div className="md:col-span-6 bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                In-situ-Druckfestigkeit (DIN EN 13791)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-shiraz font-mono">{schmidtCalc.fc_est}</span>
                <span className="text-xs font-bold text-slate-600">N/mm² (MPa)</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-600">Abgeschätzte Festigkeitsklasse:</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-xs">
                  {schmidtCalc.grade}
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 space-y-1">
              <p>• Richtungsbereinigter Rückprallwert: <strong>{schmidtCalc.r_corr}</strong></p>
              <p>• Karbonatisierungs-Korrekturfaktor k_carb: <strong>{schmidtCalc.k_carb}</strong></p>
              <p className="text-[10px] text-amber-700">Hinweis: Gemäß DIN EN 13791 müssen Rückprallwerte stets durch mindestens 3 bis 9 Bohrkernprüfungen kalibriert werden.</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. ULTRASCHALL SIMULATOR */}
      {method.id === 'ultraschall' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Messstrecke s (Durchschallungsdicke):</span>
                <span className="font-bold text-shiraz">{(usDistance * 100).toFixed(0)} cm</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.50"
                step="0.05"
                value={usDistance}
                onChange={(e) => setUsDistance(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Gemessene P-Wellenlaufzeit Δt:</span>
                <span className="font-bold text-shiraz">{usTime} µs</span>
              </div>
              <input
                type="range"
                min="20"
                max="400"
                step="5"
                value={usTime}
                onChange={(e) => setUsTime(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>
          </div>

          <div className="md:col-span-6 bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Akustische Kennwerte in-situ
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Schallgeschwindigkeit v_p</span>
                  <span className="text-xl font-black text-slate-900 font-mono">{usCalc.vp}</span>
                  <span className="text-[10px] text-slate-500 ml-1">m/s</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Dyn. Elastizitätsmodul E_dyn</span>
                  <span className="text-xl font-black text-slate-900 font-mono">{usCalc.edyn}</span>
                  <span className="text-[10px] text-slate-500 ml-1">GPa</span>
                </div>
              </div>
              <div className={`p-2.5 rounded-lg border text-xs font-bold ${usCalc.color}`}>
                {usCalc.status}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. POTENTIALFELD SIMULATOR */}
      {method.id === 'potentialfeld' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Halbzellenpotential E_cell (Cu/CuSO₄):</span>
                <span className="font-bold text-shiraz font-mono">{potentialVal} mV</span>
              </div>
              <input
                type="range"
                min="-600"
                max="0"
                step="10"
                value={potentialVal}
                onChange={(e) => setPotentialVal(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>
            <div className="text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
              <span className="font-bold block mb-1 text-slate-800">Messindikator:</span>
              Je stärker negativ das Halbzellenpotential ausfällt, desto höher ist die thermodynamische Triebkraft für anodische Eisenauflösung (Lochfraß).
            </div>
          </div>

          <div className={`md:col-span-6 p-4 rounded-xl border flex flex-col justify-between ${potentialCalc.borderColor}`}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Korrosionswahrscheinlichkeit (DGZfP B1)
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${potentialCalc.badgeColor}`}>
                  {potentialCalc.prob}
                </span>
              </div>
              <h5 className="font-bold text-sm text-slate-900">
                {potentialCalc.state}
              </h5>
            </div>
            <div className="text-[11px] text-slate-600 pt-3 border-t border-slate-200/60">
              {potentialVal < -350 
                ? '⚠️ Handlungsbedarf: Betondeckung partiell abtragen, Bewehrung inspizieren und chloridbelasteten Beton bis hinter die Bewehrungsebene entfernen.'
                : potentialVal <= -200
                ? '🔍 Kontrollbefund: Erhöhte Feuchte- oder Carbonatisierungsneigung. Engmaschige Nachmessung oder Chloridanalyse einplanen.'
                : '✅ Unkritisch: Die Passivschicht der Bewehrung ist vollkommen intakt. Keine Instandsetzung erforderlich.'}
            </div>
          </div>
        </div>
      )}

      {/* 4. COVERMETER SIMULATOR */}
      {method.id === 'covermeter' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Expositionsklasse nach Eurocode 2:</label>
              <div className="grid grid-cols-5 gap-1.5 text-xs">
                {(['XC1', 'XC3', 'XC4', 'XD1', 'XD3'] as const).map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setExposureClass(exp)}
                    className={`py-1.5 rounded-lg border font-bold text-center ${exposureClass === exp ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Gemessene Betondeckung c_ist:</span>
                <span className="font-bold text-shiraz font-mono">{measuredCover} mm</span>
              </div>
              <input
                type="range"
                min="10"
                max="65"
                step="1"
                value={measuredCover}
                onChange={(e) => setMeasuredCover(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>
          </div>

          <div className="md:col-span-6 bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Soll-Ist-Abgleich Betondeckung (DIN EN 1992-1-1)
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Gefordertes Nennmaß c_nom:</span>
                <span className="font-mono font-bold text-slate-900">{coverCalc.c_nom} mm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Mindestdeckung c_min:</span>
                <span className="font-mono font-bold text-slate-900">{coverCalc.c_min} mm</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-slate-700">Deckungsdifferenz Δc:</span>
                <span className={`font-mono font-bold text-xs ${coverCalc.isOk ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {coverCalc.diff} mm
                </span>
              </div>
            </div>
            <div className={`p-2.5 rounded-lg border text-xs font-bold flex items-center gap-2 ${
              coverCalc.isOk 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {coverCalc.isOk ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{coverCalc.isOk ? 'Konform: Dauerhafter Passivierungsschutz gewährleistet' : 'Unzureichend: Akute Depassivierungs- und Rostgefahr!'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. BOHRMEHL / CHLORID SIMULATOR */}
      {method.id === 'bohrmehl' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Bauteil-Tragwerkskategorie:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsPrestressed(false)}
                  className={`py-2 px-3 rounded-lg border font-bold ${!isPrestressed ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                >
                  Stahlbeton (schlaff bewehrt)
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrestressed(true)}
                  className={`py-2 px-3 rounded-lg border font-bold ${isPrestressed ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                >
                  Spannbeton (Spannglieder)
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Chloridgehalt an Bewehrungslage:</span>
                <span className="font-bold text-shiraz font-mono">{chlorideVal.toFixed(2)} M.-%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.50"
                step="0.05"
                value={chlorideVal}
                onChange={(e) => setChlorideVal(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Gew.-% Chloridionen bezogen auf Zementmasse</span>
            </div>
          </div>

          <div className={`md:col-span-6 p-4 rounded-xl border flex flex-col justify-between ${
            chlorideCalc.isExceeded ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Kritischer Chloridgehalt Cl_krit (DAfStb)
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700">Normativer Grenzwert:</span>
                <span className="font-mono font-bold text-slate-900">{chlorideCalc.limit.toFixed(2)} M.-%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700">Verhältnis Ist/Grenzwert:</span>
                <span className={`font-mono font-bold text-sm ${chlorideCalc.isExceeded ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {chlorideCalc.ratio} × Cl_krit
                </span>
              </div>
            </div>
            <div className="text-xs font-bold pt-3 border-t border-slate-200">
              {chlorideCalc.isExceeded 
                ? '❌ Grenzwert überschritten: Lochfraßkorrosion aktiv! Vollständiger Betonabtrag bis hinter die Bewehrung erforderlich.'
                : '✅ Unkritisch: Unterhalb des korrosionsauslösenden Schwellenwerts. Keine akute Lochfraßgefahr.'}
            </div>
          </div>
        </div>
      )}

      {/* 6. HAFTABZUG SIMULATOR */}
      {method.id === 'haftabzug' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Bruchlast F_break am Manometer:</span>
                <span className="font-bold text-shiraz font-mono">{breakForce.toFixed(1)} kN</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.1"
                value={breakForce}
                onChange={(e) => setBreakForce(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Klassifizierung des Bruchbilds:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFailureType('beton')}
                  className={`py-1.5 px-2 rounded-lg border font-bold ${failureType === 'beton' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                >
                  Betonbruch (A)
                </button>
                <button
                  type="button"
                  onClick={() => setFailureType('verbund')}
                  className={`py-1.5 px-2 rounded-lg border font-bold ${failureType === 'verbund' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                >
                  Verbundfuge (B)
                </button>
                <button
                  type="button"
                  onClick={() => setFailureType('kleber')}
                  className={`py-1.5 px-2 rounded-lg border font-bold ${failureType === 'kleber' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                >
                  Kleberversagen (C)
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Abreißfestigkeit f_ct (DIN EN 1542)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-shiraz font-mono">{haftCalc.fct}</span>
                <span className="text-xs font-bold text-slate-600">N/mm² (MPa)</span>
              </div>
              <div className="text-xs text-slate-600">
                Stempelfläche: {haftCalc.area} mm² (Ø 50 mm)
              </div>
            </div>
            <div className={`p-2.5 rounded-lg border text-xs font-bold ${
              haftCalc.isNormOk 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {haftCalc.isNormOk 
                ? '✅ Erfüllt: f_ct ≥ 1,5 N/mm² bei reinem Betonbruch (Untergrund tragfähig).' 
                : '❌ Nicht erfüllt: Entweder f_ct < 1,5 N/mm² oder Verbund-/Kleberversagen (Neuvorbereitung nötig)!'}
            </div>
          </div>
        </div>
      )}

      {/* 7. KARSTENSCHES RÖHRCHEN SIMULATOR */}
      {method.id === 'karsten' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Eingesaugtes Wasservolumen nach 60 min:</span>
                <span className="font-bold text-shiraz font-mono">{waterLoss60.toFixed(1)} ml</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={waterLoss60}
                onChange={(e) => setWaterLoss60(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
              Prüfröhrchen mit 10 cm Wassersäule übt ca. 1.000 Pa hydrostatischen Druck aus (Schlagregen-Simulation).
            </p>
          </div>

          <div className="md:col-span-6 bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Wasseraufnahmekoeffizient w_kap (DIN EN 15148)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-shiraz font-mono">{karstenCalc.w}</span>
                <span className="text-xs font-bold text-slate-600">kg / (m² · √h)</span>
              </div>
            </div>
            <div className={`p-2.5 rounded-lg border text-xs font-bold ${karstenCalc.badgeClass}`}>
              {karstenCalc.evalText}
            </div>
          </div>
        </div>
      )}

      {/* 8. KARBONATISIERUNG SIMULATOR */}
      {method.id === 'karbonatisierung' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Gemessene Karbonatisierungstiefe d_k:</span>
                <span className="font-bold text-shiraz font-mono">{carbMeasured} mm</span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                step="1"
                value={carbMeasured}
                onChange={(e) => setCarbMeasured(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Bauteilalter:</span>
                <span className="font-bold text-slate-800">{elementAge} Jahre</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={elementAge}
                onChange={(e) => setElementAge(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Vorhandene Betondeckung c:</span>
                <span className="font-bold text-slate-800">{elementCover} mm</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="2"
                value={elementCover}
                onChange={(e) => setElementCover(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>
          </div>

          <div className="md:col-span-6 bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Diffusions-Koeffizient &amp; Rest-Passivierungsdauer
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Karbonatisierungsbeiwert k_carb:</span>
                <span className="font-mono font-bold text-slate-900">{carbCalc.k_carb} mm/√a</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Errechnete Gesamtdauer bis Stahl:</span>
                <span className="font-mono font-bold text-slate-900">{carbCalc.t_depass} Jahre</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-slate-800">Verbleibende Schutzdauer:</span>
                <span className={`font-mono font-black text-sm ${carbCalc.depassivated ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {carbCalc.depassivated ? '0 Jahre (bereits depassiviert!)' : `ca. ${carbCalc.restJahre} Jahre`}
                </span>
              </div>
            </div>
            <div className={`p-2.5 rounded-lg border text-xs font-bold ${
              carbCalc.depassivated ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {carbCalc.depassivated 
                ? '⚠️ Bewehrungsstahl ist karbonatisiert! Bei Zutritt von Feuchte setzt unmittelbare Rostbildung ein.'
                : '🛡️ Passivierungsschutz besteht noch für die angegebene Restdauer.'}
            </div>
          </div>
        </div>
      )}

      {/* 9. BOHRKERN SIMULATOR */}
      {method.id === 'bohrkern' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1">Durchmesser D:</div>
                <div className="font-bold text-shiraz text-sm font-mono">{coreDiameter} mm</div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Kernhöhe L:</span>
                  <span className="font-bold text-slate-800 font-mono">{coreLength} mm</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  value={coreLength}
                  onChange={(e) => setCoreLength(Number(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Bruchkraft F_max in der Laborpresse:</span>
                <span className="font-bold text-shiraz font-mono">{coreMaxForce} kN</span>
              </div>
              <input
                type="range"
                min="50"
                max="600"
                step="5"
                value={coreMaxForce}
                onChange={(e) => setCoreMaxForce(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>
          </div>

          <div className="md:col-span-6 bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                In-situ-Druckfestigkeit (DIN EN 12504-1)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-shiraz font-mono">{bohrkernCalc.f_corr}</span>
                <span className="text-xs font-bold text-slate-600">N/mm² (MPa)</span>
              </div>
              <div className="text-xs text-slate-600">
                Schlankheit L/D = {bohrkernCalc.lambda} (Rohfestigkeit: {bohrkernCalc.rawStrength} N/mm²)
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              Gerichtlich und baurechtlich unanfechtbare Referenz zur statischen Nachrechnung nach DIN EN 13791.
            </div>
          </div>
        </div>
      )}

      {/* 10. IMPACT-ECHO SIMULATOR */}
      {method.id === 'impact_echo' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Dominante Resonanzfrequenz f_peak:</span>
                <span className="font-bold text-shiraz font-mono">{ieFreq.toFixed(1)} kHz</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="25.0"
                step="0.5"
                value={ieFreq}
                onChange={(e) => setIeFreq(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Soll-Bauteildicke (Plattenstärke):</span>
                <span className="font-bold text-slate-800">{ieNominalThickness} cm</span>
              </div>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={ieNominalThickness}
                onChange={(e) => setIeNominalThickness(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>
          </div>

          <div className="md:col-span-6 bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Errechnete Reflektortiefe d (DGZfP B11)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-shiraz font-mono">{ieCalc.d_cm}</span>
                <span className="text-xs font-bold text-slate-600">cm</span>
              </div>
            </div>
            <div className={`p-2.5 rounded-lg border text-xs font-bold ${
              ieCalc.isDelam 
                ? 'bg-rose-50 text-rose-800 border-rose-200' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {ieCalc.isDelam 
                ? '⚠️ Interne Fehlstelle/Delamination! Frequenzpeak reflektiert vor der Bauteilrückwand.' 
                : '✅ Bauteildicken-Resonanz: Schallwelle reflektiert an der Rückwand (keine inneren Trennlagen).'}
            </div>
          </div>
        </div>
      )}

      {/* 11. BOHRWIDERSTAND (HOLZ) SIMULATOR */}
      {(method.id === 'bohrwiderstand' || method.id === 'endoskopie') && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Holzart auswählen:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['fichte', 'kiefer', 'eiche'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimberType(t)}
                    className={`py-1.5 rounded-lg border font-bold capitalize ${timberType === t ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Gefügezustand des Querschnitts:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTimberCondition('gesund')}
                  className={`py-1.5 rounded-lg border font-bold ${timberCondition === 'gesund' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700'}`}
                >
                  Gesund
                </button>
                <button
                  type="button"
                  onClick={() => setTimberCondition('faeule')}
                  className={`py-1.5 rounded-lg border font-bold ${timberCondition === 'faeule' ? 'bg-amber-700 text-white' : 'bg-white text-slate-700'}`}
                >
                  Kernfäule
                </button>
                <button
                  type="button"
                  onClick={() => setTimberCondition('hohl')}
                  className={`py-1.5 rounded-lg border font-bold ${timberCondition === 'hohl' ? 'bg-rose-700 text-white' : 'bg-white text-slate-700'}`}
                >
                  Hohlraum
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
                Resistogramm-Kurvensimulation (0 bis 100 mm Bohrtiefe)
              </span>
              <div className="h-16 w-full bg-slate-950 rounded-lg p-2 flex items-center relative overflow-hidden">
                <svg viewBox="0 0 100 40" className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke={timberCondition === 'gesund' ? '#10b981' : timberCondition === 'faeule' ? '#f59e0b' : '#ef4444'}
                    strokeWidth="1.5"
                    points={
                      timberCondition === 'gesund'
                        ? "0,20 10,15 20,25 30,12 40,24 50,14 60,22 70,16 80,25 90,15 100,20"
                        : timberCondition === 'faeule'
                        ? "0,20 10,15 20,22 30,35 40,38 50,37 60,35 70,20 80,25 90,15 100,20"
                        : "0,20 10,15 20,22 30,39 40,39 50,39 60,39 70,39 80,25 90,15 100,20"
                    }
                  />
                </svg>
              </div>
            </div>
            <div className="text-[11px] text-slate-300 pt-2 border-t border-slate-800">
              {timberCondition === 'gesund' && 'Regelmäßige Dichte-Oszillationen zwischen Frühholz und Spätholz.'}
              {timberCondition === 'faeule' && 'Einbruch des Bohrdrehmoments im Kernbereich um ca. 70 % (braune Fäulepilze).'}
              {timberCondition === 'hohl' && 'Totaler Widerstandseinbruch auf Nadelwellen-Reibungswert (Nullamplitude).'}
            </div>
          </div>
        </div>
      )}

      {/* 12. DARRMETHODE SIMULATOR */}
      {method.id === 'darrmethode' && (
        <div className="p-4 bg-white rounded-xl border border-home-grau/30 text-xs text-slate-700 space-y-2">
          <div className="flex justify-between font-bold">
            <span>Darrfeuchte-Referenz nach DIN EN ISO 12570:</span>
            <span className="font-mono text-shiraz">105 °C Umluftofen bis Massekonstanz</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Als fundamentale Eichbasis werden ca. 100 g Festbetonfeinbruch gewogen (m_feucht), bei 105 °C getrocknet und nach Abkühlung im Exsikkator zurückgewogen (m_trocken). Ausgleichsfeuchte im trockenen Innenraum liegt bei ca. 2,0–3,0 M.-%, im Außenbereich bei 4,5–5,5 M.-%.
          </p>
        </div>
      )}
    </div>
  );
}
