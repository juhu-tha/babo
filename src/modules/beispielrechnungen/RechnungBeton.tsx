import { BookOpen, Sliders } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeTeX, formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';
import React from 'react';
import inhalt from '@/content/beispielrechnungen/RechnungBeton.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../../components/ui/Auswahlgruppe';
import type { AusschalVergleich } from '@/src/calc/betonkennwerte';

interface RechnungBetonProps {
  ausschal: AusschalVergleich;
  ausschalVorgabe: number;
  setAusschalVorgabe: React.Dispatch<React.SetStateAction<number>>;
  V_a: number;
  V_air: 15;
  V_c: number;
  V_w: number;
  actualWz: number;
  aggregateMass: number;
  beta_cc: number;
  betonSubTab: "mischung" | "k_wert" | "temperatur" | "festigkeit";
  cementContent: number;
  cementFromWz: number;
  consClass: "F2" | "F3" | "F4";
  f_ck_t: number;
  f_cm_28: number;
  f_cm_t: number;
  finalFreshTemp: number;
  freshConcreteDensity: number;
  heat_agg: number;
  heat_cement: number;
  heat_ice_melting: number;
  heat_liquid_water: number;
  kAddType: "flugasche" | "silikastaub";
  kAddition: number;
  kCement: number;
  kWater: number;
  k_credited_addition: number;
  k_factor: number;
  k_max_allowed_addition: number;
  k_max_ratio: number;
  k_w_z_eq: number;
  k_w_z_pure: number;
  mAggregateInput: number;
  mCementInput: number;
  mIceInput: number;
  mLiquidWater: number;
  mWaterInput: number;
  maturityAge: number;
  maxGrainSize: 16 | 32;
  maxWz: 0.6 | 0.45;
  minCement: 320 | 280;
  s_param: number;
  setBetonSubTab: React.Dispatch<React.SetStateAction<"mischung" | "k_wert" | "temperatur" | "festigkeit">>;
  setConsClass: React.Dispatch<React.SetStateAction<"F2" | "F3" | "F4">>;
  setKAddType: React.Dispatch<React.SetStateAction<"flugasche" | "silikastaub">>;
  setKAddition: React.Dispatch<React.SetStateAction<number>>;
  setKCement: React.Dispatch<React.SetStateAction<number>>;
  setKWater: React.Dispatch<React.SetStateAction<number>>;
  setMIceInput: React.Dispatch<React.SetStateAction<number>>;
  setMaxGrainSize: React.Dispatch<React.SetStateAction<16 | 32>>;
  setStrengthCementType: React.Dispatch<React.SetStateAction<"S" | "N" | "R">>;
  setStrengthClassFck: React.Dispatch<React.SetStateAction<number>>;
  setStrengthCureAge: React.Dispatch<React.SetStateAction<number>>;
  setStrengthCureTemp: React.Dispatch<React.SetStateAction<number>>;
  setTargetExposure: React.Dispatch<React.SetStateAction<"XC4" | "XD3">>;
  setTempAggregate: React.Dispatch<React.SetStateAction<number>>;
  setTempCement: React.Dispatch<React.SetStateAction<number>>;
  setTempWater: React.Dispatch<React.SetStateAction<number>>;
  strengthCementType: "S" | "N" | "R";
  strengthClassFck: number;
  strengthCureAge: number;
  strengthCureTemp: number;
  targetExposure: "XC4" | "XD3";
  tempAggregate: number;
  tempCement: number;
  tempWater: number;
  total_heat: number;
  total_heat_capacity: number;
  waterDemand: 165 | 175 | 185 | 180 | 190 | 200;
}

export default function RechnungBeton({ ausschal, ausschalVorgabe, setAusschalVorgabe, V_a, V_air, V_c, V_w, actualWz, aggregateMass, beta_cc, betonSubTab, cementContent, cementFromWz, consClass, f_ck_t, f_cm_28, f_cm_t, finalFreshTemp, freshConcreteDensity, heat_agg, heat_cement, heat_ice_melting, heat_liquid_water, kAddType, kAddition, kCement, kWater, k_credited_addition, k_factor, k_max_allowed_addition, k_max_ratio, k_w_z_eq, k_w_z_pure, mAggregateInput, mCementInput, mIceInput, mLiquidWater, mWaterInput, maturityAge, maxGrainSize, maxWz, minCement, s_param, setBetonSubTab, setConsClass, setKAddType, setKAddition, setKCement, setKWater, setMIceInput, setMaxGrainSize, setStrengthCementType, setStrengthClassFck, setStrengthCureAge, setStrengthCureTemp, setTargetExposure, setTempAggregate, setTempCement, setTempWater, strengthCementType, strengthClassFck, strengthCureAge, strengthCureTemp, targetExposure, tempAggregate, tempCement, tempWater, total_heat, total_heat_capacity, waterDemand }: RechnungBetonProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* SUB-NAVIGATION FOR BETON CALCULATIONS */}
        <ReiterLeiste label="Beispielrechnungen Beton" className="flex flex-wrap gap-2 pb-2 border-b border-home-grau/20">
          <button {...alsReiter(betonSubTab === 'mischung', 'rechnung-beton', 'mischung')}
            type="button"
            className={`px-3 py-2 rounded-xl font-bold text-xs transition-all border shadow-sm cursor-pointer ${
                  betonSubTab === 'mischung'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
            onClick={() => setBetonSubTab('mischung')}
          ><MdText text={inhalt.texte.mischungsentwurfStoffraum} /></button>
          <button {...alsReiter(betonSubTab === 'k_wert', 'rechnung-beton', 'k_wert')}
            type="button"
            className={`px-3 py-2 rounded-xl font-bold text-xs transition-all border shadow-sm cursor-pointer ${
                  betonSubTab === 'k_wert'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
            onClick={() => setBetonSubTab('k_wert')}
          ><MdText text={inhalt.texte.kWertAnsatzZusatzstoffe} /></button>
          <button {...alsReiter(betonSubTab === 'temperatur', 'rechnung-beton', 'temperatur')}
            type="button"
            className={`px-3 py-2 rounded-xl font-bold text-xs transition-all border shadow-sm cursor-pointer ${
                  betonSubTab === 'temperatur'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
            onClick={() => setBetonSubTab('temperatur')}
          >
            Frischbetontemperatur
          </button>
          <button {...alsReiter(betonSubTab === 'festigkeit', 'rechnung-beton', 'festigkeit')}
            type="button"
            className={`px-3 py-2 rounded-xl font-bold text-xs transition-all border shadow-sm cursor-pointer ${
                  betonSubTab === 'festigkeit'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
            onClick={() => setBetonSubTab('festigkeit')}
          >
            Festigkeitsentwicklung
          </button>
        </ReiterLeiste>

        {/* A. MISCHUNGSENTWURF */}
        {betonSubTab === 'mischung' && (
          <div {...reiterPanel('rechnung-beton', betonSubTab)} className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <BookOpen className="text-shiraz" size={18} />
                <span><MdText text={inhalt.texte.normativerMischungsentwurfFürFrischbeton} /></span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.wasBerechnetWirdDie} /></p>
            </div>

            {/* INTERACTIVE CONTROLS */}
            <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
              <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders size={14} className="text-shiraz" /><MdText text={inhalt.texte.expositionsUndBaustoffklasseWählen} /></h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Exposure Class */}
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Expositionsklasse:</label>
                  <p className="text-[10px] text-text-main/70 mb-2"><MdText text={inhalt.texte.bestimmtMaxWZ} /></p>
                  <select aria-label={inhalt.werte.bestimmtMaxWZ} 
                    value={targetExposure} 
                    onChange={(e) => setTargetExposure(e.target.value as 'XC4' | 'XD3')}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value="XC4">XC4 (Außenbauteile mit Bewehrung)</option>
                    <option value="XD3">XD3 (Brückenkappen - Chloride)</option>
                  </select>
                </div>

                {/* Consistency */}
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Konsistenzklasse:</label>
                  <p className="text-[10px] text-text-main/70 mb-2"><MdText text={inhalt.texte.bestimmtDenRichtwertFür} /></p>
                  <select aria-label={inhalt.werte.bestimmtDenRichtwertFür} 
                    value={consClass} 
                    onChange={(e) => setConsClass(e.target.value as 'F2' | 'F3' | 'F4')}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value="F2">F2 (steifplastisch / plastisch)</option>
                    <option value="F3">F3 (weich, Regelkonsistenz)</option>
                    <option value="F4">F4 (sehr weich)</option>
                  </select>
                </div>

                {/* Max Grain Size */}
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.größtkornAggregat} /></label>
                  <p className="text-[10px] text-text-main/70 mb-2"><MdText text={inhalt.texte.großeGesteinskörnungMindertWasserbedarf} /></p>
                  <div className="flex gap-2 mt-1">
                    <button 
                      type="button"
                      onClick={() => setMaxGrainSize(16)}
                      className={`flex-1 py-1.5 rounded-lg font-bold border ${maxGrainSize === 16 ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700 border-slate-200'}`}
                    >
                      16 mm
                    </button>
                    <button 
                      type="button"
                      onClick={() => setMaxGrainSize(32)}
                      className={`flex-1 py-1.5 rounded-lg font-bold border ${maxGrainSize === 32 ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700 border-slate-200'}`}
                    >
                      32 mm
                    </button>
                  </div>
                </div>

                {/* Info Display */}
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xxs leading-relaxed font-normal text-slate-600">
                  <span className="font-bold text-slate-800 block text-xs mb-1"><MdText text={inhalt.texte.randbedingungenDin10452} /></span>
                  <div><MdText text={inhalt.texte.maximalerWZMax} /><strong className="text-shiraz font-black">{formatDeZahl(maxWz, 2)}</strong></div>
                  <div><MdText text={inhalt.texte.mindestzementZMin} /><strong className="text-slate-800 font-bold">{minCement} kg/m³</strong></div>
                  <div><MdText text={inhalt.texte.angenommeneReindichteZement3} /></div>
                </div>

              </div>
            </div>

            {/* STEP-BY-STEP RECIPE CALCULATION */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.stoffraumberechnungAbsolutvolumenSchritt} /></h4>

              <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
                <div><MdText text={inhalt.texte.schritt1WasserUnd} /><p className="mt-1"><MdText text={inhalt.texte.derWasserbedarfRichtetSich} /><span className="text-shiraz font-bold">{consClass}</span><MdText text={inhalt.texte.undGrößtkorn} /><span className="text-shiraz font-bold">dmax = {maxGrainSize} mm</span><MdText text={inhalt.texte.ergibtSichEinWasseranspruch} /></p>
                  <BlockMath math={`w = \\color{#A3113E}{${waterDemand}} \\, \\text{l/m}^3 \\quad (\\approx \\color{#A3113E}{${waterDemand}} \\, \\text{kg/m}^3)`} />
                  <p className="mt-1"><MdText text={inhalt.texte.dieErforderlicheZementmengeC} /><span className="text-shiraz font-bold">{targetExposure}</span>:
                  </p>
                  <BlockMath math={`c_{\\text{erf}} = \\frac{w}{(w/z)_{max}} = \\frac{\\color{#A3113E}{${waterDemand}}}{\\color{#A3113E}{${formatDeTeX(maxWz, 2)}}} = \\color{#A3113E}{${formatDeTeX(cementFromWz, 1)}} \\, \\text{kg/m}^3`} />
                  <p className="mt-1">
                    Da <InlineMath math={`c_{\\text{erf}} = ${formatDeTeX(cementFromWz, 1)} \\, \\text{kg/m}^3`} /><MdText text={inhalt.texte.mitDemNormativenMindestzementgehalt} /><InlineMath math={`z_{min} = ${minCement} \\, \\text{kg/m}^3`} /><MdText text={inhalt.texte.abgeglichenWerdenMussWählen} /></p>
                  <BlockMath math={`c = \\max(c_{\\text{erf}}, z_{min}) = \\color{#A3113E}{${formatDeTeX(cementContent, 1)}} \\, \\text{kg/m}^3`} />
                  <p className="mt-1"><MdText text={inhalt.texte.darausResultiertDerTatsächliche} /></p>
                  <BlockMath math={`(w/z)_{\\text{tats}} = \\frac{w}{c} = \\frac{\\color{#A3113E}{${waterDemand}}}{\\color{#A3113E}{${formatDeTeX(cementContent, 1)}}} = \\color{#A3113E}{${formatDeTeX(actualWz, 3)}}`} />
                </div>

                <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt2StoffraumbilanzFür} /><p className="mt-1"><MdText text={inhalt.texte.nachDerGleichungFür} /></p>
                  <BlockMath math={`V_c + V_w + V_{\\text{air}} + V_a = 1000 \\, \\text{dm}^3`} />
                  <p className="mt-1"><MdText text={inhalt.texte.wirBerechnenDieBekannten} /></p>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-lg font-mono text-xxs border border-home-grau/20">
                    <p><MdText text={inhalt.texte.zementvolumenVCC} /><span className="text-shiraz font-bold">{formatDeWert(cementContent)}</span><MdText text={inhalt.texte.kg310Kg} /><span className="text-shiraz font-bold">{formatDeZahl(V_c, 2)}</span> dm³</p>
                    <p><MdText text={inhalt.texte.wasservolumenVWW} /><span className="text-shiraz font-bold">{waterDemand}</span><MdText text={inhalt.texte.kg100Kg} /><span className="text-shiraz font-bold">{formatDeZahl(V_w, 2)}</span> dm³</p>
                    <p><MdText text={inhalt.texte.verdichtungsporen15Luft} />{V_air} dm³</p>
                  </div>
                  <p className="mt-2"><MdText text={inhalt.texte.dasVerbleibendeRestvolumenEntfällt} /></p>
                  <BlockMath math={`V_a = 1000 - (\\color{#A3113E}{${formatDeTeX(V_c, 2)}} + \\color{#A3113E}{${formatDeTeX(V_w, 2)}} + ${V_air}) = \\color{#A3113E}{${formatDeTeX(V_a, 2)}} \\, \\text{dm}^3`} />
                </div>

                <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt3MasseDer} /><p className="mt-1"><MdText text={inhalt.texte.unterAnnahmeEinerMittleren} /></p>
                  <BlockMath math={`m_a = V_a \\cdot \\rho_a = \\color{#A3113E}{${formatDeTeX(V_a, 2)}} \\cdot 2{,}65 = \\color{#A3113E}{${formatDeTeX(aggregateMass, 1)}} \\, \\text{kg/m}^3`} />
                </div>
              </div>
            </div>

            {/* RECIPE SUMMARY */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3"><MdText text={inhalt.texte.zusammenfassungDerBetonrezepturSoll} /></h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xxs text-slate-400 block font-normal"><MdText text={inhalt.texte.zementCemI} /></span>
                  <strong className="text-sm text-slate-800">{formatDeWert(cementContent)} kg</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xxs text-slate-400 block font-normal"><MdText text={inhalt.texte.wasserWirksam} /></span>
                  <strong className="text-sm text-slate-800">{waterDemand} l</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xxs text-slate-400 block font-normal">Gesteinskörnung</span>
                  <strong className="text-sm text-slate-800">{formatDeZahl(aggregateMass, 1)} kg</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xxs text-slate-400 block font-normal">Frischbetondichte</span>
                  <strong className="text-sm text-shiraz">{formatDeZahl(freshConcreteDensity, 1)} kg/m³</strong>
                </div>
              </div>

              <div className="text-xxs font-normal text-slate-500 mt-4 leading-relaxed bg-white/50 p-2.5 rounded-lg border border-slate-200/50"><MdText text={inhalt.texte.bewertungDerTatsächlicheW} /><strong>{formatDeZahl(actualWz, 3)}</strong><MdText text={inhalt.texte.hältDenGrenzwertVon} /><strong>{formatDeZahl(maxWz, 2)}</strong><MdText text={inhalt.texte.sicherEinDieBerechnete} />{formatDeZahl(freshConcreteDensity, 0)}<MdText text={inhalt.texte.kgMImTypischen} /></div>
            </div>
          </div>
        )}

        {/* B. K-WERT-ANSATZ */}
        {betonSubTab === 'k_wert' && (
          <div {...reiterPanel('rechnung-beton', betonSubTab)} className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <BookOpen className="text-shiraz" size={18} />
                <span><MdText text={inhalt.texte.kWertAnsatzFür} /></span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.wasBerechnetDieAnrechenbarkeit} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CONTROLS */}
              <div className="md:col-span-1 bg-slate-50/50 p-4 rounded-xl border border-home-grau/30 space-y-4">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider"><MdText text={inhalt.texte.parameterEinstellen} /></h4>

                {/* Additive Type */}
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.zusatzstoffTypIi} /></label>
                  <select aria-label={inhalt.werte.zusatzstoffTypIi} 
                    value={kAddType} 
                    onChange={(e) => {
                      const type = e.target.value as 'flugasche' | 'silikastaub';
                      setKAddType(type);
                      setKAddition(type === 'flugasche' ? 60 : 25);
                    }}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value="flugasche">Flugasche (k = 0,4)</option>
                    <option value="silikastaub">Silikastaub (k = 1,0)</option>
                  </select>
                </div>

                {/* Cement content */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold"><MdText text={inhalt.texte.zementgehaltCKgM} /></label>
                  <input aria-label={inhalt.werte.zementgehaltKgM} 
                    type="range" min="200" max="450" step="10"
                    value={kCement}
                    onChange={(e) => setKCement(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="text-xxs text-text-main/70 font-mono text-right">{formatDeWert(kCement)} kg/m³</div>
                </div>

                {/* Addition content */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold"><MdText text={inhalt.texte.zusatzstoffmengeFKgM} /></label>
                  <input aria-label={inhalt.werte.zusatzstoffmengeKgM} 
                    type="range" min="0" max="150" step="5"
                    value={kAddition}
                    onChange={(e) => setKAddition(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="text-xxs text-text-main/70 font-mono text-right">{formatDeWert(kAddition)} kg/m³</div>
                </div>

                {/* Water content */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold"><MdText text={inhalt.texte.wassergehaltWLM} /></label>
                  <input aria-label={inhalt.werte.wassergehaltLM} 
                    type="range" min="120" max="220" step="5"
                    value={kWater}
                    onChange={(e) => setKWater(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="text-xxs text-text-main/70 font-mono text-right">{formatDeWert(kWater)} l/m³</div>
                </div>
              </div>

              {/* STEP-BY-STEP */}
              <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.rechnerischerNachweis} /></h4>

                <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
                  <div><MdText text={inhalt.texte.schritt1KBeiwert} /><p className="mt-1">
                      Für <span className="text-shiraz font-bold">{kAddType === 'flugasche' ? 'Flugasche' : 'Silikastaub'}</span><MdText text={inhalt.texte.istNormativEinK} /><InlineMath math={`k = ${formatDeTeXWert(k_factor)}`} /><MdText text={inhalt.texte.vorgegebenDieMaximaleAnrechenbare} /><InlineMath math={`${formatDeTeX((k_max_ratio*100), 0)}\\%`} /><MdText text={inhalt.texte.desZementgehaltsBeiCem} /></p>
                    <BlockMath math={`f_{max} = ${formatDeTeXWert(k_max_ratio)} \\cdot c = ${formatDeTeXWert(k_max_ratio)} \\cdot \\color{#A3113E}{${kCement}} = \\color{#A3113E}{${formatDeTeX(k_max_allowed_addition, 1)}} \\, \\text{kg/m}^3`} />
                    <p className="mt-1"><MdText text={inhalt.texte.dieAnrechenbareZusatzstoffmengeF} /></p>
                    <BlockMath math={`f_{anr} = \\min(f, f_{max}) = \\min(\\color{#A3113E}{${kAddition}}, \\color{#A3113E}{${formatDeTeX(k_max_allowed_addition, 1)}}) = \\color{#A3113E}{${formatDeTeX(k_credited_addition, 1)}} \\, \\text{kg/m}^3`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt2ÄquivalentenWasserzementwert} /><p className="mt-1"><MdText text={inhalt.texte.dieKlassischeWZ} /></p>
                    <BlockMath math={`w/z = \\frac{w}{c} = \\frac{\\color{#A3113E}{${kWater}}}{\\color{#A3113E}{${kCement}}} = \\color{#A3113E}{${formatDeTeX(k_w_z_pure, 3)}}`} />
                    <p className="mt-1"><MdText text={inhalt.texte.durchAnrechnungDesZusatzstoffs} /></p>
                    <BlockMath math={`(w/z)_{eq} = \\frac{w}{c + k \\cdot f_{anr}} = \\frac{\\color{#A3113E}{${kWater}}}{\\color{#A3113E}{${kCement}} + ${formatDeTeXWert(k_factor)} \\cdot \\color{#A3113E}{${formatDeTeX(k_credited_addition, 1)}}} = \\color{#A3113E}{${formatDeTeX(k_w_z_eq, 3)}}`} />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                  <span className="text-xxs font-bold text-slate-400 block uppercase tracking-wide mb-1"><MdText text={inhalt.texte.ergebnisUndEinsparung} /></span>
                  <p className="text-xs font-normal"><MdText text={inhalt.texte.ihrÄquivalenterWasserzementwertSinkt} /><strong className="text-shiraz">{formatDeZahl(Math.max(0, k_w_z_pure - k_w_z_eq), 3)}</strong> von <span className="text-shiraz font-bold">{formatDeZahl(k_w_z_pure, 3)}</span> auf <strong className="text-shiraz">{formatDeZahl(k_w_z_eq, 3)}</strong><MdText text={inhalt.texte.diesEntsprichtRechnerischEiner} /><strong className="text-shiraz">{formatDeZahl((k_factor * k_credited_addition), 1)} kg</strong><MdText text={inhalt.texte.portlandzementKlinkerProKubikmeter} /></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* C. FRISCHBETONTEMPERATUR */}
        {betonSubTab === 'temperatur' && (
          <div {...reiterPanel('rechnung-beton', betonSubTab)} className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <BookOpen className="text-shiraz" size={18} />
                <span><MdText text={inhalt.texte.berechnungDerFrischbetontemperaturWinter} /></span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.wasBerechnetDieMischtemperatur} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CONTROLS */}
              <div className="md:col-span-1 bg-slate-50/50 p-4 rounded-xl border border-home-grau/30 space-y-4">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider"><MdText text={inhalt.texte.temperaturenMengen} /></h4>

                {/* Aggregate Temp */}
                <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold"><MdText text={inhalt.texte.gesteinskörnungTAC} /></label>
                  <input aria-label={inhalt.werte.gesteinskörnungC} 
                    type="range" min="-10" max="35" step="1"
                    value={tempAggregate}
                    onChange={(e) => setTempAggregate(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                    <span>{formatDeWert(mAggregateInput)} kg</span>
                    <span className="font-bold text-shiraz">{formatDeWert(tempAggregate)} °C</span>
                  </div>
                </div>

                {/* Cement Temp */}
                <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold"><MdText text={inhalt.texte.zementTCC} /></label>
                  <input aria-label="Zement (°C)" 
                    type="range" min="0" max="60" step="2"
                    value={tempCement}
                    onChange={(e) => setTempCement(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                    <span>{formatDeWert(mCementInput)} kg</span>
                    <span className="font-bold text-shiraz">{formatDeWert(tempCement)} °C</span>
                  </div>
                </div>

                {/* Water Temp */}
                <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold"><MdText text={inhalt.texte.anmachwasserTWC} /></label>
                  <input aria-label={inhalt.werte.anmachwasserC} 
                    type="range" min="2" max="80" step="2"
                    value={tempWater}
                    onChange={(e) => setTempWater(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                    <span>{formatDeWert(mWaterInput)} l</span>
                    <span className="font-bold text-shiraz">{formatDeWert(tempWater)} °C</span>
                  </div>
                </div>

                {/* Flake Ice Option */}
                <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-text-main/80 block font-bold"><MdText text={inhalt.texte.schuppeneisMEisKg} /></label>
                    <span className="text-[10px] text-slate-400 font-bold"><MdText text={inhalt.texte.ersetztWasser} /></span>
                  </div>
                  <input aria-label={inhalt.werte.schuppeneisKgErsetztWasser} 
                    type="range" min="0" max="50" step="5"
                    value={mIceInput}
                    onChange={(e) => setMIceInput(Math.min(Number(e.target.value), mWaterInput))}
                    className="w-full accent-shiraz"
                  />
                  <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                    <span><MdText text={inhalt.texte.meltingLatent334Kj} /></span>
                    <span className="font-bold text-shiraz">{formatDeWert(mIceInput)} kg</span>
                  </div>
                </div>
              </div>

              {/* CALCULATION AND VISUALIZATION */}
              <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.thermodynamischeMischungsrechnung} /></h4>

                <div className="space-y-3.5 text-xs text-text-main/80 leading-relaxed font-normal">
                  <div><MdText text={inhalt.texte.mischformelNachEnergiebilanzReferenz} /><p className="mt-1"><MdText text={inhalt.texte.dieEnthalpiebeträgeErgebenSich} /></p>
                    <div className="bg-slate-50 p-2.5 rounded-lg space-y-1 font-mono text-xxs my-2 border border-home-grau/20">
                      <p>• Gestein: {formatDeWert(mAggregateInput)}<MdText text={inhalt.texte.kg084Kj} /><span className="text-shiraz font-bold">{formatDeWert(tempAggregate)}</span>°C = <span className="text-shiraz font-bold">{formatDeZahl(heat_agg, 0)}</span> kJ</p>
                      <p>• Zement: {formatDeWert(mCementInput)}<MdText text={inhalt.texte.kg084Kj2} /><span className="text-shiraz font-bold">{formatDeWert(tempCement)}</span>°C = <span className="text-shiraz font-bold">{formatDeZahl(heat_cement, 0)}</span> kJ</p>
                      <p><MdText text={inhalt.texte.flüssigesWasser} /><span className="text-shiraz font-bold">{formatDeWert(mLiquidWater)}</span><MdText text={inhalt.texte.kg418Kj} /><span className="text-shiraz font-bold">{formatDeWert(tempWater)}</span>°C = <span className="text-shiraz font-bold">{formatDeZahl(heat_liquid_water, 0)}</span> kJ</p>
                      {mIceInput > 0 && (
                        <p className="text-blue-600 font-bold"><MdText text={inhalt.texte.schmelzwärmeEis} /><span className="text-shiraz">{formatDeWert(mIceInput)}</span><MdText text={inhalt.texte.kg334KjKg} /><span className="text-shiraz">{formatDeZahl(heat_ice_melting, 0)}</span> kJ</p>
                      )}
                      <p className="border-t border-slate-200 pt-1 font-bold"><MdText text={inhalt.texte.summeDerEnthalpienQ} /><span className="text-shiraz font-bold">{formatDeZahl(total_heat, 0)}</span> kJ</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.berechnungDerFrischbetontemperaturT} /><BlockMath math={`T_B = \\frac{\\sum Q}{\\sum (m_i \\cdot c_i)} = \\frac{\\color{#A3113E}{${formatDeTeX(total_heat, 0)}} \\, \\text{kJ}}{${formatDeTeX(total_heat_capacity, 0)} \\, \\text{kJ/K}} = \\color{#A3113E}{${formatDeTeX(finalFreshTemp, 1)}} \\, ^\\circ\\text{C}`} />
                  </div>
                </div>

                {/* EVALUATION GRAPHIC */}
                <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs leading-relaxed ${
                      finalFreshTemp < 5 ? 'bg-blue-50 border-blue-200 text-blue-900' :
                      finalFreshTemp > 30 ? 'bg-amber-50 border-amber-200 text-amber-950' :
                      'bg-green-50 border-green-200 text-green-900'
                    }`}>
                  <div className="text-2xl">
                    {finalFreshTemp < 5 ? '❄️' : finalFreshTemp > 30 ? '🔥' : '✅'}
                  </div>
                  <div>
                    <strong className="block font-bold">
                      Betontemperatur: {formatDeZahl(finalFreshTemp, 1)} °C ({
                        finalFreshTemp < 5 ? inhalt.werte.frostgefahrZuKalt :
                        finalFreshTemp > 30 ? inhalt.werte.zuHeißRissgefahr :
                        'Optimal'
                      })
                    </strong>
                    {finalFreshTemp < 0 && <span className="block text-xxs font-bold mb-1"><MdText text={inhalt.werte.mischtemperaturUnterNull} /></span>}
                    <span className="text-xxs opacity-90">
                      {finalFreshTemp < 5 ? inhalt.werte.derBetonDrohtEinzufrieren :
                       finalFreshTemp > 30 ? inhalt.werte.dieErhärtungsreaktionLäuftZu :
                       inhalt.werte.dieFrischbetontemperaturEntsprichtDen}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* D. FESTIGKEITSENTWICKLUNG */}
        {betonSubTab === 'festigkeit' && (
          <div {...reiterPanel('rechnung-beton', betonSubTab)} className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <BookOpen className="text-shiraz" size={18} />
                <span><MdText text={inhalt.texte.druckfestigkeitsverlaufReifeentwicklungN} /></span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.wasSchätztDieTatsächliche} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CONTROLS */}
              <div className="md:col-span-1 bg-slate-50/50 p-4 rounded-xl border border-home-grau/30 space-y-4">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Einflussparameter</h4>

                {/* Concrete class */}
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.festigkeitsklasseFCk28d} /></label>
                  <select aria-label={inhalt.werte.festigkeitsklasseFCk28d} 
                    value={strengthClassFck} 
                    onChange={(e) => setStrengthClassFck(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value={20}>C20/25 (f_ck = 20 MPa)</option>
                    <option value={25}>C25/30 (f_ck = 25 MPa)</option>
                    <option value={30}>C30/37 (f_ck = 30 MPa)</option>
                    <option value={35}>C35/45 (f_ck = 35 MPa)</option>
                    <option value={40}>C40/50 (f_ck = 40 MPa)</option>
                    <option value={50}>C50/60 (f_ck = 50 MPa)</option>
                  </select>
                </div>

                {/* Cement type rapidness */}
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.zementerhärtungsklasseSWert} /></label>
                  <select aria-label={inhalt.werte.zementerhärtungsklasseSWert} 
                    value={strengthCementType} 
                    onChange={(e) => setStrengthCementType(e.target.value as 'S' | 'N' | 'R')}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value="S">Klasse S (CEM 32,5 N - s = 0,38)</option>
                    <option value="N">Klasse N (CEM 32,5 R / 42,5 N - s = 0,25)</option>
                    <option value="R">Klasse R (CEM 42,5 R / 52,5 - s = 0,20)</option>
                  </select>
                </div>

                {/* Curing Temperature */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold"><MdText text={inhalt.texte.mittlereBauteiltemperaturC} /></label>
                  <input aria-label={inhalt.werte.mittlereBauteiltemperaturC} 
                    type="range" min="2" max="40" step="1"
                    value={strengthCureTemp}
                    onChange={(e) => setStrengthCureTemp(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="text-xxs text-text-main/70 font-mono text-right font-bold text-shiraz">{formatDeWert(strengthCureTemp)} °C</div>
                </div>

                {/* Age in days */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold"><MdText text={inhalt.texte.aktuellesAlterTTage} /></label>
                  <input aria-label={inhalt.werte.aktuellesAlterTage} 
                    type="range" min="1" max="90" step="1"
                    value={strengthCureAge}
                    onChange={(e) => setStrengthCureAge(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="text-xxs text-text-main/70 font-mono text-right font-bold text-shiraz">{formatDeWert(strengthCureAge)} Tage</div>
                </div>

                {/* Ausschalvorgabe der Tragwerksplanung (T15-BE-2) */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold"><MdText text={inhalt.texte.ausschalVorgabeLabel} /></label>
                  <input aria-label={inhalt.werte.ausschalVorgabe}
                    type="range" min="20" max="100" step="5"
                    value={ausschalVorgabe}
                    onChange={(e) => setAusschalVorgabe(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="text-xxs text-text-main/70 font-mono text-right font-bold text-shiraz">{formatDeWert(ausschalVorgabe)} %</div>
                  <p className="text-xxs text-text-main/70"><MdText text={inhalt.texte.ausschalVorgabeHinweis} /></p>
                </div>
              </div>

              {/* CALCULATIONS */}
              <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.erhärtungsfortschrittNachEn1992} /></h4>

                <div className="space-y-3.5 text-xs text-text-main/80 leading-relaxed font-normal">
                  <div><MdText text={inhalt.texte.schritt1ReifealterArrhenius} /><p className="mt-1"><MdText text={inhalt.texte.aufgrundErhöhterOderVerringerter} /></p>
                    <BlockMath math={`t_T = t \\cdot \\exp\\left( -\\left[ \\frac{4000}{273 + T} - 13{,}65 \\right] \\right)`} />
                    <BlockMath math={`t_T = \\color{#A3113E}{${formatDeTeXWert(strengthCureAge)}} \\cdot \\exp\\left( -\\left[ \\frac{4000}{273 + \\color{#A3113E}{${formatDeTeXWert(strengthCureTemp)}}} - 13{,}65 \\right] \\right) = \\color{#A3113E}{${formatDeTeX(maturityAge, 2)}} \\, \\text{Tage}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt2FestigkeitsbeiwertBeta} /><BlockMath math={`\\beta_{cc}(t_T) = \\exp\\left( s \\cdot \\left[ 1 - \\sqrt{\\frac{28}{t_T}} \\right] \\right)`} />
                    <BlockMath math={`\\beta_{cc}(t_T) = \\exp\\left( ${formatDeTeXWert(s_param)} \\cdot \\left[ 1 - \\sqrt{\\frac{28}{\\color{#A3113E}{${formatDeTeX(maturityAge, 2)}}}} \\right] \\right) = \\color{#A3113E}{${formatDeTeX(beta_cc, 4)}}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt3ErreichteDruckfestigkeiten} /><div className="grid grid-cols-2 gap-4 mt-2 bg-slate-50 p-3 rounded-lg font-mono text-xxs border border-home-grau/20">
                      <div>
                        <p className="font-bold text-slate-700"><MdText text={inhalt.texte.mittlereFestigkeitFCm} /></p>
                        <p className="text-xs text-slate-900 font-extrabold mt-1"><span className="text-shiraz">{formatDeZahl(f_cm_t, 2)}</span> N/mm²</p>
                        <p className="text-[10px] text-slate-500"><MdText text={inhalt.texte.vonFCm28} />{formatDeWert(f_cm_28)} MPa</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-700"><MdText text={inhalt.texte.charakteristischeFestigkeitFCk} /></p>
                        <p className="text-xs text-shiraz font-extrabold mt-1">{formatDeZahl(f_ck_t, 2)} N/mm²</p>
                        <p className="text-[10px] text-slate-500"><MdText text={inhalt.texte.vonFCk28} />{formatDeWert(strengthClassFck)} MPa</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATUS AND EXCLUSION ASSESSMENT */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 text-xs">
                  <span className="text-xxs font-bold text-slate-400 block uppercase tracking-wide mb-1"><MdText text={inhalt.texte.ausschaleignungCenRichtwert} /></span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${ausschal.erfuellt ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <p className="font-normal"><MdText text={inhalt.texte.derBetonHat} /><strong>{formatDeZahl(f_ck_t, 2)} N/mm²</strong> ({formatDeZahl(ausschal.anteil * 100, 1)} %<MdText text={inhalt.texte.seiner28TageNennfestigkeit} /><strong>{formatDeWert(ausschalVorgabe)} %</strong> = <strong>{formatDeZahl(ausschal.erforderlich, 2)} N/mm²</strong>.{ausschal.erfuellt ? (
                        <span className="text-green-800"><MdText text={inhalt.texte.einAusschalenTragenderBauteile} /></span>
                      ) : (
                        <span className="text-amber-800"><MdText text={inhalt.texte.einAusschalenTragenderBauteile2} /></span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
