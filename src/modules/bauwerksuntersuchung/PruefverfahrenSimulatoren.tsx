import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Gauge, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PruefverfahrenDetail } from './pruefverfahrenData';
import {
  rueckprall, ultraschall, potentialStufe, betondeckung, chlorid, haftzug, karsten, karbonatisierung, bohrkern, impactEcho,
} from '@/src/calc/bauwerksuntersuchung';
import inhalt from '@/content/bauwerksuntersuchung/PruefverfahrenSimulatoren.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';
import { LebensdauerUebernehmen } from '../../components/ui/LebensdauerUebernehmen';
import { ErgebnisAnsage } from '@/src/components/ui/ErgebnisAnsage';

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
    // Rechenkern: Schlagrichtungs- und Karbonatisierungskorrektur, Potenzansatz f_c,is ≈ 0,0125 · R^2,22 (Lehr-Näherung)
    const r = rueckprall(rebound, impactAngle, carbDepth);
    return {
      r_corr: formatDeZahl(r.rKorr, 1),
      k_carb: formatDeZahl(r.kKarb, 2),
      r_final: formatDeZahl(r.rFinal, 1),
      fc_est: formatDeZahl(r.fcSchaetz, 1),
      grade: r.klasse
    };
  }, [rebound, impactAngle, carbDepth]);

  // Ultraschall
  const usCalc = useMemo(() => {
    // Rechenkern: v_p = s/t, E_dyn = ρ·v_p²·(1+ν)(1−2ν)/(1−ν) mit ν = 0,2
    const { vp, eDynGPa: edyn, stufe } = ultraschall(usDistance, usTime, usDensity);

    let status = inhalt.werte.hervorragendesSehrDichtesBetongefüge;
    let color = 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (stufe === '–') {
      // F-1: ungültige Eingabe → keine Einstufung
      status = '–';
      color = 'text-slate-700 bg-off-white border-home-grau/30';
    } else if (stufe === 'kritisch') {
      status = inhalt.werte.kritischerGefügemangelAusgeprägteHohlste;
      color = 'text-rose-600 bg-rose-50 border-rose-200';
    } else if (stufe === 'maessig') {
      status = inhalt.werte.mäßigeGefügequalitätLokaleMikrorissigkei;
      color = 'text-amber-600 bg-amber-50 border-amber-200';
    }

    return {
      vp: Math.round(vp),
      edyn: formatDeZahl(edyn, 1),
      status,
      color
    };
  }, [usDistance, usTime, usDensity]);

  // Potentialfeld
  const potentialStufeAktuell = potentialStufe(potentialVal);
  const potentialCalc = useMemo(() => {
    const stufe = potentialStufe(potentialVal);
    let prob = inhalt.werte.sehrGering10;
    let state = inhalt.werte.passiverIntakterBewehrungsstahl;
    let badgeColor = 'bg-emerald-500 text-white';
    let borderColor = 'border-emerald-200 bg-emerald-50/50';

    if (stufe === '–') {
      // F-1: keine Zahl → keine Einstufung (vorher „sehr gering“)
      prob = '–'; state = '–'; badgeColor = 'bg-slate-100 text-slate-700'; borderColor = 'border-home-grau/30 bg-off-white';
    } else if (stufe === 'hoch') {
      prob = inhalt.werte.sehrHoch90;
      state = inhalt.werte.akuteFortschreitendeLochfraßkorrosionAno;
      badgeColor = 'bg-rose-600 text-white';
      borderColor = 'border-rose-200 bg-rose-50/50';
    } else if (stufe === 'ungewiss') {
      prob = inhalt.werte.ungewiss10Bis90;
      state = inhalt.werte.übergangsbereichBeginnendeDepassivierung;
      badgeColor = 'bg-amber-500 text-white';
      borderColor = 'border-amber-200 bg-amber-50/50';
    }

    return { prob, state, badgeColor, borderColor };
  }, [potentialVal]);

  // Covermeter
  const coverCalc = useMemo(() => {
    // c_min,dur nach DIN EN 1992-1-1/NA, Tab. 4.4DE (Betonstahl); Vorhaltemaß Δc_dev = 15 mm (XC1: 10 mm)
    const { cMin, cNom, differenz: diff, ok: isOk } = betondeckung(exposureClass, measuredCover);

    return {
      c_min: cMin,
      c_nom: cNom,
      diff: diff > 0 ? `+${formatDeWert(diff)}` : formatDeWert(diff),
      isOk
    };
  }, [exposureClass, measuredCover]);

  // Bohrmehl / Chlorid
  const chlorideCalc = useMemo(() => {
    // Kein Normwert: Anhaltswert ≈ 0,5 M.-% bez. Zement (Einzelfallbewertung); Spannstahl: kein gesicherter Grenzwert
    const c = chlorid(chlorideVal, isPrestressed);
    const limit = c.grenze;
    const isExceeded = c.ueberschritten;
    const stufe = c.stufe === '–' ? '–' : c.stufe === 'unkritisch' ? 'unkritisch' :c.stufe === 'Beobachtung / Prävention' ? inhalt.werte.beobachtungPrävention : inhalt.werte.korrosionWahrscheinlich;
    const ratio = formatDeZahl(c.verhaeltnis, 1) + ' (' + stufe + ')';

    return {
      limit,
      isExceeded,
      ratio
    };
  }, [isPrestressed, chlorideVal]);

  // Haftabzug
  const haftCalc = useMemo(() => {
    // Rechenkern: f_ht = F/A, Stempel Ø 50 mm (A ≈ 1963,5 mm²)
    const { flaecheMm2: area, fct, ok: isNormOk } = haftzug(breakForce, failureType);

    return {
      area: Math.round(area),
      fct: formatDeZahl(fct, 2),
      isNormOk
    };
  }, [breakForce, failureType]);

  // Karsten
  const karstenCalc = useMemo(() => {
    // A = 4.5 cm² = 0.00045 m²
    // t = 1 h -> sqrt(t) = 1.0
    // w_kap = (deltaV * 1e-3 kg) / (0.00045 m² * 1) = deltaV * 2.22 kg/(m²*sqrt(h))
    const { w, klasse } = karsten(waterLoss60);
    // Einstufung nach DIN 4108-3: w ≤ 0,5 wasserabweisend, w ≤ 2,0 wasserhemmend, darüber wassersaugend
    let evalText = inhalt.werte.wasserabweisendW05;
    let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (klasse === '–') {
      // F-1: ungültige Eingabe → keine Einstufung
      evalText = '–';
      badgeClass = 'bg-slate-100 text-slate-700 border-home-grau/30';
    } else if (klasse === 'wassersaugend') {
      evalText = inhalt.werte.wassersaugendW20;
      badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
    } else if (klasse === 'wasserhemmend') {
      evalText = inhalt.werte.wasserhemmend05W;
      badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
    }

    return {
      w: formatDeZahl(w, 2),
      evalText,
      badgeClass
    };
  }, [waterLoss60]);

  // Karbonatisierung
  const carbCalc = useMemo(() => {
    // Rechenkern: √t-Gesetz, t_depass = (c/K)²
    const kb = karbonatisierung(carbMeasured, elementAge, elementCover);

    return {
      k: kb.k,
      gueltig: kb.gueltig,
      k_carb: formatDeZahl(kb.k, 2),
      t_depass: Math.round(kb.tDepass),
      restJahre: kb.restJahre,
      depassivated: kb.depassiviert
    };
  }, [carbMeasured, elementAge, elementCover]);

  // Bohrkern
  const bohrkernCalc = useMemo(() => {
    const { flaecheMm2: area, festigkeit: rawStrength, schlankheit: lambda } = bohrkern(coreDiameter, coreLength, coreMaxForce);
    // DIN EN 12504-1 enthält keine Umrechnungsfaktoren. DIN EN 13791:2020-02: Kern L/D = 1 (Ø 100 mm)
    // ≈ 150-mm-Würfel, L/D = 2 ≈ Zylinder 150/300. Andere Schlankheiten werden nicht umgerechnet.
    const f_corr = rawStrength;

    return {
      area: Math.round(area),
      lambda: formatDeZahl(lambda, 2),
      lambdaWert: lambda,
      rawStrength: formatDeZahl(rawStrength, 1),
      f_corr: formatDeZahl(f_corr, 1)
    };
  }, [coreDiameter, coreLength, coreMaxForce]);

  // Impact-Echo
  const ieCalc = useMemo(() => {
    // Rechenkern: d = β·v_p/(2·f) mit β = 0,96
    const { dickeCm: d_cm, delamination: isDelam } = impactEcho(ieFreq, ieVp, ieNominalThickness);

    return {
      d_cm: formatDeZahl(d_cm, 1),
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
            <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.interaktiverPrüfAuswertungsSimulator} /></h4>
            <p className="text-[11px] text-text-main/70"><MdText text={inhalt.texte.prüfparameterInSituEinstellen} /></p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-shiraz/10 text-shiraz font-bold">
          Normativ: {method.badge}
        </span>
      </div>

      {/* Kurzzeile je Simulator (Kurzzeilen 04.11.2026) aus den Kernergebnissen; Darrmethode ohne Rechnung */}
      <ErgebnisAnsage text={({
        schmidthammer: `Rückprallwert korrigiert ${schmidtCalc.r_final}, geschätzte Druckfestigkeit ${schmidtCalc.fc_est} MPa, ${schmidtCalc.grade}`,
        ultraschall: `Schallgeschwindigkeit ${formatDeZahl(usCalc.vp, 0)} m/s, E_dyn ${usCalc.edyn} GPa, ${usCalc.status}`,
        potentialfeld: `Potential ${formatDeWert(potentialVal)} mV: ${potentialCalc.state}, ${potentialCalc.prob}`,
        covermeter: `Betondeckung gemessen ${formatDeWert(measuredCover)} mm, c_min ${formatDeWert(coverCalc.c_min)} mm, Differenz ${coverCalc.diff} mm, ${coverCalc.isOk ? 'ausreichend' : 'unterschritten'}`,
        bohrmehl: `Chloridgehalt ${formatDeWert(chlorideVal)} %, Verhältnis zum Anhaltswert ${chlorideCalc.ratio}`,
        haftabzug: `Abreißfestigkeit ${haftCalc.fct} N/mm², ${haftCalc.isNormOk ? 'Anforderung erfüllt' : 'Anforderung nicht erfüllt'}`,
        karsten: `Wasseraufnahme ${karstenCalc.w} kg/(m²·h)`,
        karbonatisierung: carbCalc.gueltig ? `K ${carbCalc.k_carb} mm/√a, ${carbCalc.depassivated ? 'bereits depassiviert' : `Restlebensdauer etwa ${formatDeWert(carbCalc.restJahre)} Jahre`}` : 'Karbonatisierung –',
        bohrkern: `Kerndruckfestigkeit ${bohrkernCalc.f_corr} N/mm², Schlankheit ${bohrkernCalc.lambda}`,
        impact_echo: `Reflektortiefe ${ieCalc.d_cm} cm, ${ieCalc.isDelam ? 'Ablösung vermutet' : 'keine Ablösung'}`,
      } as Record<string, string>)[method.id] ?? ''} />
      {/* 1. SCHMIDT-HAMMER SIMULATOR */}
      {method.id === 'schmidthammer' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span><MdText text={inhalt.texte.rückprallwertRMedianAus} /></span>
                <span className="font-bold text-shiraz">{formatDeWert(rebound)}</span>
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
              <AuswahlGruppe label="Schlagbolzen-Ausrichtung" className="grid grid-cols-3 gap-2 text-xs">
                <button {...alsOption(impactAngle === 'horiz')}
                  type="button"
                  onClick={() => setImpactAngle('horiz')}
                  className={`py-1.5 px-2 rounded-lg border font-bold ${impactAngle === 'horiz' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                ><MdText text={inhalt.texte.horizontal0} /></button>
                <button {...alsOption(impactAngle === 'down')}
                  type="button"
                  onClick={() => setImpactAngle('down')}
                  className={`py-1.5 px-2 rounded-lg border font-bold ${impactAngle === 'down' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                ><MdText text={inhalt.texte.boden90} /></button>
                <button {...alsOption(impactAngle === 'up')}
                  type="button"
                  onClick={() => setImpactAngle('up')}
                  className={`py-1.5 px-2 rounded-lg border font-bold ${impactAngle === 'up' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                ><MdText text={inhalt.texte.decke90} /></button>
              </AuswahlGruppe>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span><MdText text={inhalt.texte.karbonatisierungstiefeDK} /></span>
                <span className="font-bold text-slate-800">{formatDeWert(carbDepth)} mm</span>
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block"><MdText text={inhalt.texte.inSituDruckfestigkeitDin} /></span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-shiraz font-mono">{schmidtCalc.fc_est}</span>
                <span className="text-xs font-bold text-slate-600">N/mm² (MPa)</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-600"><MdText text={inhalt.texte.abgeschätzteFestigkeitsklasse} /></span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-xs">
                  {schmidtCalc.grade}
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 space-y-1">
              <p><MdText text={inhalt.texte.richtungsbereinigterRückprallwert} /><strong>{schmidtCalc.r_corr}</strong></p>
              <p><MdText text={inhalt.texte.karbonatisierungsKorrekturfaktorKCarb} /><strong>{schmidtCalc.k_carb}</strong></p>
              <p className="text-[10px] text-amber-700"><MdText text={inhalt.texte.hinweisNachDinEn} /></p>
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
                <span><MdText text={inhalt.texte.messstreckeSDurchschallungsdicke} /></span>
                <span className="font-bold text-shiraz">{formatDeZahl((usDistance * 100), 0)} cm</span>
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
                <span><MdText text={inhalt.texte.gemessenePWellenlaufzeitT} /></span>
                <span className="font-bold text-shiraz">{formatDeWert(usTime)} µs</span>
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block"><MdText text={inhalt.texte.akustischeKennwerteInSitu} /></span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.schallgeschwindigkeitVP} /></span>
                  <span className="text-xl font-black text-slate-900 font-mono">{formatDeWert(usCalc.vp)}</span>
                  <span className="text-[10px] text-slate-500 ml-1">m/s</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.dynElastizitätsmodulEDyn} /></span>
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
                <span><MdText text={inhalt.texte.halbzellenpotentialECellCu} /></span>
                <span className="font-bold text-shiraz font-mono">{formatDeWert(potentialVal)} mV</span>
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
              <span className="font-bold block mb-1 text-slate-800">Messindikator:</span><MdText text={inhalt.texte.jeStärkerNegativDas} /></div>
          </div>

          <div className={`md:col-span-6 p-4 rounded-xl border flex flex-col justify-between ${potentialCalc.borderColor}`}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600"><MdText text={inhalt.texte.korrosionswahrscheinlichkeitDgzfpB1} /></span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${potentialCalc.badgeColor}`}>
                  {potentialCalc.prob}
                </span>
              </div>
              <h5 className="font-bold text-sm text-slate-900">
                {potentialCalc.state}
              </h5>
            </div>
            <div className="text-[11px] text-slate-600 pt-3 border-t border-slate-200/60">
              {potentialStufeAktuell === '–'
                ? '–'
                : potentialStufeAktuell === 'hoch'
                ? inhalt.werte.handlungsbedarfBetondeckungPartiellAbtra
                : potentialStufeAktuell === 'ungewiss'
                ? inhalt.werte.kontrollbefundErhöhteFeuchteOder
                : inhalt.werte.unkritischDiePassivschichtDer}
            </div>
          </div>
        </div>
      )}

      {/* 4. COVERMETER SIMULATOR */}
      {method.id === 'covermeter' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1"><MdText text={inhalt.texte.expositionsklasseNachEurocode2} /></label>
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
                <span><MdText text={inhalt.texte.gemesseneBetondeckungCIst} /></span>
                <span className="font-bold text-shiraz font-mono">{formatDeWert(measuredCover)} mm</span>
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block"><MdText text={inhalt.texte.sollIstAbgleichBetondeckung} /></span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600"><MdText text={inhalt.texte.gefordertesNennmaßCNom} /></span>
                <span className="font-mono font-bold text-slate-900">{formatDeWert(coverCalc.c_nom)} mm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600"><MdText text={inhalt.texte.mindestdeckungCMin} /></span>
                <span className="font-mono font-bold text-slate-900">{formatDeWert(coverCalc.c_min)} mm</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-slate-700"><MdText text={inhalt.texte.deckungsdifferenzC} /></span>
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
              <span>{coverCalc.isOk ? inhalt.werte.konformDauerhafterPassivierungsschutzGew : inhalt.werte.unzureichendAkuteDepassivierungsUnd}</span>
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
                ><MdText text={inhalt.texte.stahlbetonSchlaffBewehrt} /></button>
                <button
                  type="button"
                  onClick={() => setIsPrestressed(true)}
                  className={`py-2 px-3 rounded-lg border font-bold ${isPrestressed ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                ><MdText text={inhalt.texte.spannbetonSpannglieder} /></button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span><MdText text={inhalt.texte.chloridgehaltAnBewehrungslage} /></span>
                <span className="font-bold text-shiraz font-mono">{formatDeZahl(chlorideVal, 2)} M.-%</span>
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
              <span className="text-[10px] text-slate-400 block mt-1"><MdText text={inhalt.texte.gewChloridionenBezogenAuf} /></span>
            </div>
          </div>

          <div className={`md:col-span-6 p-4 rounded-xl border flex flex-col justify-between ${
            chlorideCalc.isExceeded ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block"><MdText text={inhalt.texte.chloridgehaltAnDerBewehrung} /></span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700"><MdText text={inhalt.texte.anhaltswertKorrosionsauslösend} /></span>
                <span className="font-mono font-bold text-slate-900">≈ {formatDeZahl(chlorideCalc.limit, 1)}<MdText text={inhalt.texte.mBezZement} /></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700"><MdText text={inhalt.texte.verhältnisIstAnhaltswert} /></span>
                <span className={`font-mono font-bold text-sm ${chlorideCalc.isExceeded ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {chlorideCalc.ratio}
                </span>
              </div>
            </div>
            <div className="text-xs font-bold pt-3 border-t border-slate-200">
              {chlorideCalc.isExceeded 
                ? (isPrestressed ? inhalt.werte.chlorideAmSpanngliedImmer : inhalt.werte.korrosionsgefahrErhöhtInstandsetzungspri)
                : inhalt.werte.unterhalbDesAnhaltswertsBewertung}
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
                <span><MdText text={inhalt.texte.bruchlastFBreakAm} /></span>
                <span className="font-bold text-shiraz font-mono">{formatDeZahl(breakForce, 1)} kN</span>
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
              <label className="text-xs font-semibold text-slate-700 block mb-1"><MdText text={inhalt.texte.klassifizierungDesBruchbilds} /></label>
              <AuswahlGruppe label="Bruchbild" className="grid grid-cols-3 gap-2 text-xs">
                <button {...alsOption(failureType === 'beton')}
                  type="button"
                  onClick={() => setFailureType('beton')}
                  className={`py-1.5 px-2 rounded-lg border font-bold ${failureType === 'beton' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                ><MdText text={inhalt.texte.betonbruchA} /></button>
                <button {...alsOption(failureType === 'verbund')}
                  type="button"
                  onClick={() => setFailureType('verbund')}
                  className={`py-1.5 px-2 rounded-lg border font-bold ${failureType === 'verbund' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                ><MdText text={inhalt.texte.verbundfugeAB} /></button>
                <button {...alsOption(failureType === 'kleber')}
                  type="button"
                  onClick={() => setFailureType('kleber')}
                  className={`py-1.5 px-2 rounded-lg border font-bold ${failureType === 'kleber' ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700'}`}
                ><MdText text={inhalt.texte.kleberversagenY} /></button>
              </AuswahlGruppe>
            </div>
          </div>

          <div className="md:col-span-6 bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block"><MdText text={inhalt.texte.abreißfestigkeitFCtDin} /></span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-shiraz font-mono">{haftCalc.fct}</span>
                <span className="text-xs font-bold text-slate-600">N/mm² (MPa)</span>
              </div>
              <div className="text-xs text-slate-600">
                Stempelfläche: {formatDeWert(haftCalc.area)}<MdText text={inhalt.texte.mm50Mm} /></div>
            </div>
            <div className={`p-2.5 rounded-lg border text-xs font-bold ${
              haftCalc.isNormOk 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {haftCalc.isNormOk 
                ? inhalt.werte.erfülltFCt1 
                : inhalt.werte.nichtErfülltEntwederF}
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
                <span><MdText text={inhalt.texte.eingesaugtesWasservolumenNach60} /></span>
                <span className="font-bold text-shiraz font-mono">{formatDeZahl(waterLoss60, 2)} ml</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="5.0"
                step="0.05"
                value={waterLoss60}
                onChange={(e) => setWaterLoss60(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200"><MdText text={inhalt.texte.prüfröhrchenMit10Cm} /></p>
          </div>

          <div className="md:col-span-6 bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block"><MdText text={inhalt.texte.wasseraufnahmeKarstenRichtwertNicht} /></span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-shiraz font-mono">{karstenCalc.w}</span>
                <span className="text-xs font-bold text-slate-600"><MdText text={inhalt.texte.kgMH} /></span>
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
                <span><MdText text={inhalt.texte.gemesseneKarbonatisierungstiefeDK} /></span>
                <span className="font-bold text-shiraz font-mono">{formatDeWert(carbMeasured)} mm</span>
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
                <span className="font-bold text-slate-800">{formatDeWert(elementAge)} Jahre</span>
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
                <span><MdText text={inhalt.texte.vorhandeneBetondeckungC} /></span>
                <span className="font-bold text-slate-800">{formatDeWert(elementCover)} mm</span>
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block"><MdText text={inhalt.texte.diffusionsKoeffizientRestPassivierungsda} /></span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600"><MdText text={inhalt.texte.karbonatisierungsbeiwertKCarb} /></span>
                <span className="font-mono font-bold text-slate-900">{carbCalc.k_carb} mm/√a</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600"><MdText text={inhalt.texte.errechneteGesamtdauerBisStahl} /></span>
                <span className="font-mono font-bold text-slate-900">{formatDeWert(carbCalc.t_depass)} Jahre</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-slate-800"><MdText text={inhalt.texte.verbleibendeSchutzdauer} /></span>
                <span className={`font-mono font-black text-sm ${carbCalc.depassivated ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {carbCalc.depassivated ? inhalt.werte.t0JahreBereitsDepassiviert : `ca. ${carbCalc.restJahre} Jahre`}
                </span>
              </div>
            </div>
            <div className={`p-2.5 rounded-lg border text-xs font-bold ${
              carbCalc.depassivated ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {carbCalc.depassivated 
                ? inhalt.werte.bewehrungsstahlIstKarbonatisiertBei
                : inhalt.werte.passivierungsschutzBestehtNochFür}
            </div>
            <LebensdauerUebernehmen aktiv={carbCalc.gueltig && carbCalc.k > 0} art="bauwerk" className="pt-3"
              daten={{ quelle: 'pruefverfahren_katalog', mech: 'karbonatisierung', deckM: elementCover, kNat: carbCalc.k }} />
          </div>
        </div>
      )}

      {/* 9. BOHRKERN SIMULATOR */}
      {method.id === 'bohrkern' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1"><MdText text={inhalt.texte.durchmesserD} /></div>
                <div className="font-bold text-shiraz text-sm font-mono">{formatDeWert(coreDiameter)} mm</div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Kernhöhe L:</span>
                  <span className="font-bold text-slate-800 font-mono">{formatDeWert(coreLength)} mm</span>
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
                <span><MdText text={inhalt.texte.bruchkraftFMaxIn} /></span>
                <span className="font-bold text-shiraz font-mono">{formatDeWert(coreMaxForce)} kN</span>
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block"><MdText text={inhalt.texte.kerndruckfestigkeitFCCore} /></span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-shiraz font-mono">{bohrkernCalc.f_corr}</span>
                <span className="text-xs font-bold text-slate-600">N/mm² (MPa)</span>
              </div>
              <div className="text-xs text-slate-600"><MdText text={inhalt.texte.schlankheitLD} />{bohrkernCalc.lambda}: {!Number.isFinite(bohrkernCalc.lambdaWert) ? '–' : Math.abs(bohrkernCalc.lambdaWert - 1) < 0.05 ? inhalt.werte.entsprichtEtwaEinem150 : Math.abs(bohrkernCalc.lambdaWert - 2) < 0.1 ? inhalt.werte.entsprichtEtwaEinemZylinder : inhalt.werte.keinBezugskörperNachDin}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100"><MdText text={inhalt.texte.referenzverfahrenCharakteristischerWertE} /></div>
          </div>
        </div>
      )}

      {/* 10. IMPACT-ECHO SIMULATOR */}
      {method.id === 'impact_echo' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span><MdText text={inhalt.texte.dominanteResonanzfrequenzFPeak} /></span>
                <span className="font-bold text-shiraz font-mono">{formatDeZahl(ieFreq, 1)} kHz</span>
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
                <span><MdText text={inhalt.texte.sollBauteildickePlattenstärke} /></span>
                <span className="font-bold text-slate-800">{formatDeWert(ieNominalThickness)} cm</span>
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block"><MdText text={inhalt.texte.errechneteReflektortiefeDDgzfp} /></span>
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
                ? inhalt.werte.interneFehlstelleDelaminationFrequenzpea 
                : inhalt.werte.bauteildickenResonanzSchallwelleReflekti}
            </div>
          </div>
        </div>
      )}

      {/* 11. BOHRWIDERSTAND (HOLZ) SIMULATOR */}
      {(method.id === 'bohrwiderstand' || method.id === 'endoskopie') && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1"><MdText text={inhalt.texte.holzartAuswählen} /></label>
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
              <label className="text-xs font-semibold text-slate-700 block mb-1"><MdText text={inhalt.texte.gefügezustandDesQuerschnitts} /></label>
              <AuswahlGruppe label="Gefügezustand" className="grid grid-cols-3 gap-2 text-xs">
                <button {...alsOption(timberCondition === 'gesund')}
                  type="button"
                  onClick={() => setTimberCondition('gesund')}
                  className={`py-1.5 rounded-lg border font-bold ${timberCondition === 'gesund' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700'}`}
                >
                  Gesund
                </button>
                <button {...alsOption(timberCondition === 'faeule')}
                  type="button"
                  onClick={() => setTimberCondition('faeule')}
                  className={`py-1.5 rounded-lg border font-bold ${timberCondition === 'faeule' ? 'bg-amber-700 text-white' : 'bg-white text-slate-700'}`}
                >
                  Braunfäule
                </button>
                <button {...alsOption(timberCondition === 'hohl')}
                  type="button"
                  onClick={() => setTimberCondition('hohl')}
                  className={`py-1.5 rounded-lg border font-bold ${timberCondition === 'hohl' ? 'bg-rose-700 text-white' : 'bg-white text-slate-700'}`}
                >
                  Hohlraum
                </button>
              </AuswahlGruppe>
            </div>
          </div>

          <div className="md:col-span-6 bg-off-white text-text-main p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest block mb-2"><MdText text={inhalt.texte.resistogrammKurvensimulation0Bis} /></span>
              <div className="h-16 w-full bg-white border border-home-grau/30 rounded-lg p-2 flex items-center relative overflow-hidden">
                <svg viewBox="0 0 100 40" className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke={timberCondition === 'gesund' ? '#059669' : timberCondition === 'faeule' ? '#d97706' : '#ef4444'}
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
            <div className="text-[11px] text-slate-700 pt-2 border-t border-home-grau/30">
              {timberCondition === 'gesund' && inhalt.werte.regelmäßigeDichteOszillationenZwischen}
              {timberCondition === 'faeule' && inhalt.werte.einbruchDesBohrdrehmomentsIm}
              {timberCondition === 'hohl' && inhalt.werte.totalerWiderstandseinbruchAufNadelwellen}
            </div>
          </div>
        </div>
      )}

      {/* 12. DARRMETHODE SIMULATOR */}
      {method.id === 'darrmethode' && (
        <div className="p-4 bg-white rounded-xl border border-home-grau/30 text-xs text-slate-700 space-y-2">
          <div className="flex justify-between font-bold">
            <span><MdText text={inhalt.texte.darrfeuchteReferenzNachDin} /></span>
            <span className="font-mono text-shiraz"><MdText text={inhalt.texte.t105CUmluftofenBis} /></span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.alsFundamentaleEichbasisWerden} /></p>
        </div>
      )}
    </div>
  );
}
