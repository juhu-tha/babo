import { BookOpen, Sliders } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeTeX, formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';
import React from 'react';

interface RechnungBetonProps {
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
  k_factor: 1 | 0.4;
  k_max_allowed_addition: number;
  k_max_ratio: 0.33 | 0.11;
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
  s_param: 0.38 | 0.25 | 0.2;
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

export default function RechnungBeton({ V_a, V_air, V_c, V_w, actualWz, aggregateMass, beta_cc, betonSubTab, cementContent, cementFromWz, consClass, f_ck_t, f_cm_28, f_cm_t, finalFreshTemp, freshConcreteDensity, heat_agg, heat_cement, heat_ice_melting, heat_liquid_water, kAddType, kAddition, kCement, kWater, k_credited_addition, k_factor, k_max_allowed_addition, k_max_ratio, k_w_z_eq, k_w_z_pure, mAggregateInput, mCementInput, mIceInput, mLiquidWater, mWaterInput, maturityAge, maxGrainSize, maxWz, minCement, s_param, setBetonSubTab, setConsClass, setKAddType, setKAddition, setKCement, setKWater, setMIceInput, setMaxGrainSize, setStrengthCementType, setStrengthClassFck, setStrengthCureAge, setStrengthCureTemp, setTargetExposure, setTempAggregate, setTempCement, setTempWater, strengthCementType, strengthClassFck, strengthCureAge, strengthCureTemp, targetExposure, tempAggregate, tempCement, tempWater, total_heat, total_heat_capacity, waterDemand }: RechnungBetonProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* SUB-NAVIGATION FOR BETON CALCULATIONS */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-home-grau/20">
          <button aria-pressed={betonSubTab === 'mischung'}
            type="button"
            className={`px-3 py-2 rounded-xl font-bold text-xs transition-all border shadow-sm cursor-pointer ${
                  betonSubTab === 'mischung'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
            onClick={() => setBetonSubTab('mischung')}
          >
            Mischungsentwurf (Stoffraum)
          </button>
          <button aria-pressed={betonSubTab === 'k_wert'}
            type="button"
            className={`px-3 py-2 rounded-xl font-bold text-xs transition-all border shadow-sm cursor-pointer ${
                  betonSubTab === 'k_wert'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
            onClick={() => setBetonSubTab('k_wert')}
          >
            k-Wert-Ansatz (Zusatzstoffe)
          </button>
          <button aria-pressed={betonSubTab === 'temperatur'}
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
          <button aria-pressed={betonSubTab === 'festigkeit'}
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
        </div>

        {/* A. MISCHUNGSENTWURF */}
        {betonSubTab === 'mischung' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <BookOpen className="text-shiraz" size={18} />
                <span>Normativer Mischungsentwurf für Frischbeton (Stoffraumberechnung)</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                <strong>Was?</strong> Berechnet wird die detaillierte Materialrezeptur für <InlineMath math="1 \, \text{m}^3" /> verdichteten Frischbeton unter Berücksichtigung von Expositionsklassen, Konsistenz und Zielsieblinien. <br />
                <strong>Warum?</strong> Eine genaue Stoffraumberechnung stellt sicher, dass das angenommene Betonvolumen hohlraumfrei verdichtet genau <InlineMath math="1000 \, \text{dm}^3" /> ausfüllt. So werden Abweichungen in der Frischbetondichte und Fehlmengen auf der Baustelle vermieden. <br />
                <strong>Wie?</strong> Über das <strong>Absolutvolumen-Verfahren</strong> nach DIN 1045-2 (Gleichung des dichten Gefüges).
              </p>
            </div>

            {/* INTERACTIVE CONTROLS */}
            <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
              <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders size={14} className="text-shiraz" /> Expositions- und Baustoffklasse wählen
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Exposure Class */}
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Expositionsklasse:</label>
                  <p className="text-[10px] text-text-main/70 mb-2">Bestimmt max. w/z-Wert &amp; Mindestzementgehalt</p>
                  <select aria-label="Bestimmt max. w/z-Wert &amp; Mindestzementgehalt" 
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
                  <p className="text-[10px] text-text-main/70 mb-2">Bestimmt den Richtwert für Wasseranspruch</p>
                  <select aria-label="Bestimmt den Richtwert für Wasseranspruch" 
                    value={consClass} 
                    onChange={(e) => setConsClass(e.target.value as 'F2' | 'F3' | 'F4')}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value="F2">F2 (steifplastisch / plastisch)</option>
                    <option value="F3">F3 (regelKonsistenz / weich)</option>
                    <option value="F4">F4 (sehr weich)</option>
                  </select>
                </div>

                {/* Max Grain Size */}
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Größtkorn Aggregat:</label>
                  <p className="text-[10px] text-text-main/70 mb-2">Große Gesteinskörnung mindert Wasserbedarf</p>
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
                  <span className="font-bold text-slate-800 block text-xs mb-1">Randbedingungen DIN 1045-2:</span>
                  <div>• Maximaler <InlineMath math="(w/z)_{max}" />: <strong className="text-shiraz font-black">{formatDeZahl(maxWz, 2)}</strong></div>
                  <div>• Mindestzement <InlineMath math="z_{min}" />: <strong className="text-slate-800 font-bold">{minCement} kg/m³</strong></div>
                  <div>• Angenommene Reindichte Zement: <strong>3,10 kg/dm³</strong></div>
                </div>

              </div>
            </div>

            {/* STEP-BY-STEP RECIPE CALCULATION */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                Stoffraumberechnung (Absolutvolumen) Schritt für Schritt
              </h4>

              <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
                <div>
                  <strong>Schritt 1: Wasser- und Zementgehalt bestimmen</strong>
                  <p className="mt-1">
                    Der Wasserbedarf richtet sich nach dem Größtkorn und der Konsistenzklasse (Erfahrungswerte nach DBV): <br />
                    Für Konsistenz <span className="text-shiraz font-bold">{consClass}</span> und Größtkorn <span className="text-shiraz font-bold">dmax = {maxGrainSize} mm</span> ergibt sich ein Wasseranspruch von:
                  </p>
                  <BlockMath math={`w = \\color{#A3113E}{${waterDemand}} \\, \\text{l/m}^3 \\quad (\\approx \\color{#A3113E}{${waterDemand}} \\, \\text{kg/m}^3)`} />
                  <p className="mt-1">
                    Die erforderliche Zementmenge <InlineMath math="c" /> ergibt sich aus dem maximal zulässigen <InlineMath math="w/z" />-Verhältnis der Expositionsklasse <span className="text-shiraz font-bold">{targetExposure}</span>:
                  </p>
                  <BlockMath math={`c_{\\text{erf}} = \\frac{w}{(w/z)_{max}} = \\frac{\\color{#A3113E}{${waterDemand}}}{\\color{#A3113E}{${formatDeTeX(maxWz, 2)}}} = \\color{#A3113E}{${formatDeTeX(cementFromWz, 1)}} \\, \\text{kg/m}^3`} />
                  <p className="mt-1">
                    Da <InlineMath math={`c_{\\text{erf}} = ${formatDeTeX(cementFromWz, 1)} \\, \\text{kg/m}^3`} /> mit dem normativen Mindestzementgehalt <InlineMath math={`z_{min} = ${minCement} \\, \\text{kg/m}^3`} /> abgeglichen werden muss, wählen wir:
                  </p>
                  <BlockMath math={`c = \\max(c_{\\text{erf}}, z_{min}) = \\color{#A3113E}{${formatDeTeX(cementContent, 1)}} \\, \\text{kg/m}^3`} />
                  <p className="mt-1">Daraus resultiert der tatsächliche (wirksame) w/z-Wert:</p>
                  <BlockMath math={`(w/z)_{\\text{tats}} = \\frac{w}{c} = \\frac{\\color{#A3113E}{${waterDemand}}}{\\color{#A3113E}{${formatDeTeX(cementContent, 1)}}} = \\color{#A3113E}{${formatDeTeX(actualWz, 3)}}`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 2: Stoffraumbilanz für Gesteinskörnung aufstellen</strong>
                  <p className="mt-1">
                    Nach der Gleichung für dichten Frischbeton addieren sich die Absolutvolumina der festen, flüssigen und gasförmigen Bestandteile auf <InlineMath math="1000 \, \text{dm}^3" /> pro Kubikmeter:
                  </p>
                  <BlockMath math={`V_c + V_w + V_{\\text{air}} + V_a = 1000 \\, \\text{dm}^3`} />
                  <p className="mt-1">Wir berechnen die bekannten Volumenanteile:</p>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-lg font-mono text-xxs border border-home-grau/20">
                    <p>• Zementvolumen: V_c = c / ρ_c = <span className="text-shiraz font-bold">{formatDeWert(cementContent)}</span> kg / 3,10 kg/dm³ = <span className="text-shiraz font-bold">{formatDeZahl(V_c, 2)}</span> dm³</p>
                    <p>• Wasservolumen: V_w = w / ρ_w = <span className="text-shiraz font-bold">{waterDemand}</span> kg / 1,00 kg/dm³ = <span className="text-shiraz font-bold">{formatDeZahl(V_w, 2)}</span> dm³</p>
                    <p>• Verdichtungsporen (1,5% Luft): V_air = {V_air} dm³</p>
                  </div>
                  <p className="mt-2">Das verbleibende Restvolumen entfällt vollständig auf die Gesteinskörnung (früher: Zuschlag) <InlineMath math="V_a" />:</p>
                  <BlockMath math={`V_a = 1000 - (\\color{#A3113E}{${formatDeTeX(V_c, 2)}} + \\color{#A3113E}{${formatDeTeX(V_w, 2)}} + ${V_air}) = \\color{#A3113E}{${formatDeTeX(V_a, 2)}} \\, \\text{dm}^3`} />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <strong>Schritt 3: Masse der Gesteinskörnung ermitteln</strong>
                  <p className="mt-1">Unter Annahme einer mittleren Gesteinsreindichte von <InlineMath math="\rho_a = 2{,}65 \, \text{kg/dm}^3" />:</p>
                  <BlockMath math={`m_a = V_a \\cdot \\rho_a = \\color{#A3113E}{${formatDeTeX(V_a, 2)}} \\cdot 2{,}65 = \\color{#A3113E}{${formatDeTeX(aggregateMass, 1)}} \\, \\text{kg/m}^3`} />
                </div>
              </div>
            </div>

            {/* RECIPE SUMMARY */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">
                Zusammenfassung der Betonrezeptur (Soll-Werte für Mischer)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xxs text-slate-400 block font-normal">Zement CEM I</span>
                  <strong className="text-sm text-slate-800">{formatDeWert(cementContent)} kg</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xxs text-slate-400 block font-normal">Wasser (wirksam)</span>
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

              <div className="text-xxs font-normal text-slate-500 mt-4 leading-relaxed bg-white/50 p-2.5 rounded-lg border border-slate-200/50">
                <strong>Bewertung:</strong> Der tatsächliche w/z-Wert von <strong>{formatDeZahl(actualWz, 3)}</strong> hält den Grenzwert von <strong>{formatDeZahl(maxWz, 2)}</strong> sicher ein. 
                Die berechnete Frischbetondichte liegt mit {formatDeZahl(freshConcreteDensity, 0)} kg/m³ im typischen Bereich für Normalbeton (2000 bis 2600 kg/m³ nach DIN EN 206). 
                Diese Rezeptur stellt sicher, dass der Beton nach dem Erhärten das erforderliche Porengefüge aufweist, um Karbonatisierung (XC4) bzw. Chlorideindringen (XD3) dauerhaft zu widerstehen.
              </div>
            </div>
          </div>
        )}

        {/* B. K-WERT-ANSATZ */}
        {betonSubTab === 'k_wert' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <BookOpen className="text-shiraz" size={18} />
                <span>k-Wert-Ansatz für Zusatzstoffe nach DIN EN 206</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                <strong>Was?</strong> Berechnet die Anrechenbarkeit von reaktiven mineralischen Zusatzstoffen (Zusatzstoffe vom Typ II) wie Flugasche oder Silikastaub auf das wirksame Wasser-Zement-Verhältnis. <br />
                <strong>Warum?</strong> Die Verwertung von Flugasche schont Ressourcen und verringert das Porenvolumen sowie die Hydratationswärme des Betons. Die Norm gestattet daher die bilanzielle Erhöhung des Zementvolumens um einen Faktor <InlineMath math="k \cdot f" />. <br />
                <strong>Wie?</strong> Über die Ermittlung der maximal zulässigen Anrechenbarkeit <InlineMath math="f_{max} = \text{Anteil} \cdot c" /> und Bildung des äquivalenten Wasserzementwerts <InlineMath math="(w/z)_{eq} = \frac{w}{c + k \cdot f_{anr}}" />.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CONTROLS */}
              <div className="md:col-span-1 bg-slate-50/50 p-4 rounded-xl border border-home-grau/30 space-y-4">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Parameter einstellen</h4>

                {/* Additive Type */}
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Zusatzstoff Typ II:</label>
                  <select aria-label="Zusatzstoff Typ II" 
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
                  <label className="text-xs text-text-main/80 block font-bold">Zementgehalt <InlineMath math="c" /> (kg/m³):</label>
                  <input aria-label="Zementgehalt (kg/m³)" 
                    type="range" min="200" max="450" step="10"
                    value={kCement}
                    onChange={(e) => setKCement(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="text-xxs text-text-main/70 font-mono text-right">{formatDeWert(kCement)} kg/m³</div>
                </div>

                {/* Addition content */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold">Zusatzstoffmenge <InlineMath math="f" /> (kg/m³):</label>
                  <input aria-label="Zusatzstoffmenge (kg/m³)" 
                    type="range" min="0" max="150" step="5"
                    value={kAddition}
                    onChange={(e) => setKAddition(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="text-xxs text-text-main/70 font-mono text-right">{formatDeWert(kAddition)} kg/m³</div>
                </div>

                {/* Water content */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold">Wassergehalt <InlineMath math="w" /> (l/m³):</label>
                  <input aria-label="Wassergehalt (l/m³)" 
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
                <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Rechnerischer Nachweis</h4>

                <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
                  <div>
                    <strong>Schritt 1: k-Beiwert und Anrechnungsgrenze ermitteln</strong>
                    <p className="mt-1">
                      Für <span className="text-shiraz font-bold">{kAddType === 'flugasche' ? 'Flugasche' : 'Silikastaub'}</span> ist normativ ein k-Beiwert von <InlineMath math={`k = ${formatDeTeXWert(k_factor)}`} /> vorgegeben. 
                      Die maximale anrechenbare Menge beträgt das <InlineMath math={`${formatDeTeX((k_max_ratio*100), 0)}\\%`} /> des Zementgehalts (bei CEM I):
                    </p>
                    <BlockMath math={`f_{max} = ${k_max_ratio} \\cdot c = ${k_max_ratio} \\cdot \\color{#A3113E}{${kCement}} = \\color{#A3113E}{${formatDeTeX(k_max_allowed_addition, 1)}} \\, \\text{kg/m}^3`} />
                    <p className="mt-1">
                      Die anrechenbare Zusatzstoffmenge <InlineMath math="f_{anr}" /> ergibt sich als Minimum aus der tatsächlichen Zugabe und der Begrenzung:
                    </p>
                    <BlockMath math={`f_{anr} = \\min(f, f_{max}) = \\min(\\color{#A3113E}{${kAddition}}, \\color{#A3113E}{${formatDeTeX(k_max_allowed_addition, 1)}}) = \\color{#A3113E}{${formatDeTeX(k_credited_addition, 1)}} \\, \\text{kg/m}^3`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <strong>Schritt 2: Äquivalenten Wasserzementwert berechnen</strong>
                    <p className="mt-1">
                      Die klassische w/z-Zahl beträgt:
                    </p>
                    <BlockMath math={`w/z = \\frac{w}{c} = \\frac{\\color{#A3113E}{${kWater}}}{\\color{#A3113E}{${kCement}}} = \\color{#A3113E}{${formatDeTeX(k_w_z_pure, 3)}}`} />
                    <p className="mt-1">
                      Durch Anrechnung des Zusatzstoffs ergibt sich das wirksame äquivalente Wasser-Zement-Verhältnis <InlineMath math="(w/z)_{eq}" />:
                    </p>
                    <BlockMath math={`(w/z)_{eq} = \\frac{w}{c + k \\cdot f_{anr}} = \\frac{\\color{#A3113E}{${kWater}}}{\\color{#A3113E}{${kCement}} + ${k_factor} \\cdot \\color{#A3113E}{${formatDeTeX(k_credited_addition, 1)}}} = \\color{#A3113E}{${formatDeTeX(k_w_z_eq, 3)}}`} />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                  <span className="text-xxs font-bold text-slate-400 block uppercase tracking-wide mb-1">Ergebnis und Einsparung</span>
                  <p className="text-xs font-normal">
                    Ihr äquivalenter Wasserzementwert sinkt um <strong className="text-shiraz">{formatDeZahl(Math.max(0, k_w_z_pure - k_w_z_eq), 3)}</strong> von <span className="text-shiraz font-bold">{formatDeZahl(k_w_z_pure, 3)}</span> auf <strong className="text-shiraz">{formatDeZahl(k_w_z_eq, 3)}</strong>. 
                    Dies entspricht rechnerisch einer fiktiven Zementeinsparung von ca. <strong className="text-shiraz">{formatDeZahl((k_factor * k_credited_addition), 1)} kg</strong> Portlandzement-Klinker pro Kubikmeter Beton bei identischer hydratationschemischer Wirksamkeit!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* C. FRISCHBETONTEMPERATUR */}
        {betonSubTab === 'temperatur' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <BookOpen className="text-shiraz" size={18} />
                <span>Berechnung der Frischbetontemperatur (Winter- & Sommerbetonieren)</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                <strong>Was?</strong> Berechnet die Mischtemperatur des Frischbetons aus den Einzel-Eingangstemperaturen von Zement, Gesteinskörnung, Wasser und eventueller Eisbeigabe. <br />
                <strong>Warum?</strong> Bei kaltem Wetter (Winterbaustellen) darf Beton beim Einbringen nicht einfrieren (<InlineMath math="T_b \ge +5\,^\circ\text{C}" />). Bei heißem Wetter beschleunigt Hitze die Hydratation und führt zu thermischen Rissen (<InlineMath math="T_b \le +30\,^\circ\text{C}" />). <br />
                <strong>Wie?</strong> Über eine thermodynamische Mischungsrechnung (Energiebilanz unter Berücksichtigung der spezifischen Wärmekapazitäten und der Schmelzenthalpie von Eis).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CONTROLS */}
              <div className="md:col-span-1 bg-slate-50/50 p-4 rounded-xl border border-home-grau/30 space-y-4">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Temperaturen &amp; Mengen</h4>

                {/* Aggregate Temp */}
                <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold">Gesteinskörnung <InlineMath math="T_A" /> (°C):</label>
                  <input aria-label="Gesteinskörnung (°C)" 
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
                  <label className="text-xs text-text-main/80 block font-bold">Zement <InlineMath math="T_C" /> (°C):</label>
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
                  <label className="text-xs text-text-main/80 block font-bold">Anmachwasser <InlineMath math="T_W" /> (°C):</label>
                  <input aria-label="Anmachwasser (°C)" 
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
                    <label className="text-xs text-text-main/80 block font-bold">Schuppeneis <InlineMath math="m_{Eis}" /> (kg):</label>
                    <span className="text-[10px] text-slate-400 font-bold">Ersetzt Wasser</span>
                  </div>
                  <input aria-label="Schuppeneis (kg): Ersetzt Wasser" 
                    type="range" min="0" max="50" step="5"
                    value={mIceInput}
                    onChange={(e) => setMIceInput(Math.min(Number(e.target.value), mWaterInput))}
                    className="w-full accent-shiraz"
                  />
                  <div className="flex justify-between text-xxs text-text-main/70 font-mono">
                    <span>Melting latent: 334 kJ/kg</span>
                    <span className="font-bold text-shiraz">{formatDeWert(mIceInput)} kg</span>
                  </div>
                </div>
              </div>

              {/* CALCULATION AND VISUALIZATION */}
              <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Thermodynamische Mischungsrechnung</h4>

                <div className="space-y-3.5 text-xs text-text-main/80 leading-relaxed font-normal">
                  <div>
                    <strong>Mischformel nach Energiebilanz (Referenz 0 °C):</strong>
                    <p className="mt-1">
                      Die Enthalpiebeträge ergeben sich aus Masse <InlineMath math="m_i" />, Temperatur <InlineMath math="T_i" /> und spezifischer Wärme <InlineMath math="c_i" />:
                    </p>
                    <div className="bg-slate-50 p-2.5 rounded-lg space-y-1 font-mono text-xxs my-2 border border-home-grau/20">
                      <p>• Gestein: {formatDeWert(mAggregateInput)} kg · 0,84 kJ/(kg·K) · <span className="text-shiraz font-bold">{formatDeWert(tempAggregate)}</span>°C = <span className="text-shiraz font-bold">{formatDeZahl(heat_agg, 0)}</span> kJ</p>
                      <p>• Zement: {formatDeWert(mCementInput)} kg · 0,84 kJ/(kg·K) · <span className="text-shiraz font-bold">{formatDeWert(tempCement)}</span>°C = <span className="text-shiraz font-bold">{formatDeZahl(heat_cement, 0)}</span> kJ</p>
                      <p>• Flüssiges Wasser: <span className="text-shiraz font-bold">{formatDeWert(mLiquidWater)}</span> kg · 4,18 kJ/(kg·K) · <span className="text-shiraz font-bold">{formatDeWert(tempWater)}</span>°C = <span className="text-shiraz font-bold">{formatDeZahl(heat_liquid_water, 0)}</span> kJ</p>
                      {mIceInput > 0 && (
                        <p className="text-blue-600 font-bold">• Schmelzwärme Eis: -(<span className="text-shiraz">{formatDeWert(mIceInput)}</span> kg · 334 kJ/kg) = <span className="text-shiraz">{formatDeZahl(heat_ice_melting, 0)}</span> kJ</p>
                      )}
                      <p className="border-t border-slate-200 pt-1 font-bold">Summe der Enthalpien Q = <span className="text-shiraz font-bold">{formatDeZahl(total_heat, 0)}</span> kJ</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <strong>Berechnung der Frischbetontemperatur <InlineMath math="T_{Beton}" />:</strong>
                    <BlockMath math={`T_B = \\frac{\\sum Q}{\\sum (m_i \\cdot c_i)} = \\frac{\\color{#A3113E}{${formatDeTeX(total_heat, 0)}} \\, \\text{kJ}}{${formatDeTeX(total_heat_capacity, 0)} \\, \\text{kJ/K}} = \\color{#A3113E}{${formatDeTeX(finalFreshTemp, 1)}} \\, ^\\circ\\text{C}`} />
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
                        finalFreshTemp < 5 ? 'Frostgefahr / zu kalt' :
                        finalFreshTemp > 30 ? 'Zu heiß / Rissgefahr' :
                        'Optimal'
                      })
                    </strong>
                    <span className="text-xxs opacity-90">
                      {finalFreshTemp < 5 ? 'Der Beton droht einzufrieren und die Hydratation stagniert. Maßnahme: Heizen Sie das Anmachwasser (T_W > 50°C) oder erwärmen Sie die Zuschläge.' :
                       finalFreshTemp > 30 ? 'Die Erhärtungsreaktion läuft zu schnell ab, was Spannungsrisse begünstigt. Maßnahme: Kühlen Sie das Wasser oder setze Schuppeneis ein.' :
                       'Die Frischbetontemperatur entspricht den baustellenpraktischen Vorschriften der DIN EN 206.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* D. FESTIGKEITSENTWICKLUNG */}
        {betonSubTab === 'festigkeit' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                <BookOpen className="text-shiraz" size={18} />
                <span>Druckfestigkeitsverlauf &amp; Reifeentwicklung nach Eurocode 2</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                <strong>Was?</strong> Schätzt die tatsächliche Druckfestigkeit des Betons im Bauteil nach <InlineMath math="t" /> Tagen bei einer bestimmten, konstanten mittleren Nachbehandlungstemperatur. <br />
                <strong>Warum?</strong> Auf Baustellen muss für Ausschalfristen oder Vorspannungen gewusst werden, wann der Beton eine ausreichende Mindestfestigkeit (z.B. <InlineMath math="15 \, \text{N/mm}^2" />) erreicht hat. <br />
                <strong>Wie?</strong> Bestimmung des temperaturkorrigierten Äquivalenten Reifealters nach <strong>Arrhenius</strong> und Berechnung der zeitlichen Festigkeit nach Eurocode 2 (DIN EN 1992-1-1).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CONTROLS */}
              <div className="md:col-span-1 bg-slate-50/50 p-4 rounded-xl border border-home-grau/30 space-y-4">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Einflussparameter</h4>

                {/* Concrete class */}
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <label className="font-bold text-slate-700 block">Festigkeitsklasse f_ck (28d):</label>
                  <select aria-label="Festigkeitsklasse f_ck (28d)" 
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
                  <label className="font-bold text-slate-700 block">Zementerhärtungsklasse (s-Wert):</label>
                  <select aria-label="Zementerhärtungsklasse (s-Wert)" 
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
                  <label className="text-xs text-text-main/80 block font-bold">Mittlere Bauteiltemperatur (°C):</label>
                  <input aria-label="Mittlere Bauteiltemperatur (°C)" 
                    type="range" min="2" max="40" step="1"
                    value={strengthCureTemp}
                    onChange={(e) => setStrengthCureTemp(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="text-xxs text-text-main/70 font-mono text-right font-bold text-shiraz">{formatDeWert(strengthCureTemp)} °C</div>
                </div>

                {/* Age in days */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs text-text-main/80 block font-bold">Aktuelles Alter <InlineMath math="t" /> (Tage):</label>
                  <input aria-label="Aktuelles Alter (Tage)" 
                    type="range" min="1" max="90" step="1"
                    value={strengthCureAge}
                    onChange={(e) => setStrengthCureAge(Number(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                  <div className="text-xxs text-text-main/70 font-mono text-right font-bold text-shiraz">{formatDeWert(strengthCureAge)} Tage</div>
                </div>
              </div>

              {/* CALCULATIONS */}
              <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Erhärtungsfortschritt nach EN 1992-1-1</h4>

                <div className="space-y-3.5 text-xs text-text-main/80 leading-relaxed font-normal">
                  <div>
                    <strong>Schritt 1: Reifealter (Arrhenius) berechnen</strong>
                    <p className="mt-1">
                      Aufgrund erhöhter oder verringerter Hydratationstemperatur wird die wirksame Reifezeit normativ skaliert:
                    </p>
                    <BlockMath math={`t_T = t \\cdot \\exp\\left( 4000 \\cdot \\left[ \\frac{1}{293} - \\frac{1}{273 + T} \\right] \\right)`} />
                    <BlockMath math={`t_T = \\color{#A3113E}{${formatDeTeXWert(strengthCureAge)}} \\cdot \\exp\\left( 4000 \\cdot \\left[ \\frac{1}{293} - \\frac{1}{273 + \\color{#A3113E}{${formatDeTeXWert(strengthCureTemp)}}} \\right] \\right) = \\color{#A3113E}{${formatDeTeX(maturityAge, 2)}} \\, \\text{Tage}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <strong>Schritt 2: Festigkeitsbeiwert <InlineMath math="\beta_{cc}" /> ermitteln</strong>
                    <BlockMath math={`\\beta_{cc}(t_T) = \\exp\\left( s \\cdot \\left[ 1 - \\sqrt{\\frac{28}{t_T}} \\right] \\right)`} />
                    <BlockMath math={`\\beta_{cc}(t_T) = \\exp\\left( ${formatDeTeXWert(s_param)} \\cdot \\left[ 1 - \\sqrt{\\frac{28}{\\color{#A3113E}{${formatDeTeX(maturityAge, 2)}}}} \\right] \\right) = \\color{#A3113E}{${formatDeTeX(beta_cc, 4)}}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <strong>Schritt 3: Erreichte Druckfestigkeiten</strong>
                    <div className="grid grid-cols-2 gap-4 mt-2 bg-slate-50 p-3 rounded-lg font-mono text-xxs border border-home-grau/20">
                      <div>
                        <p className="font-bold text-slate-700">Mittlere Festigkeit f_cm(t):</p>
                        <p className="text-xs text-slate-900 font-extrabold mt-1"><span className="text-shiraz">{formatDeZahl(f_cm_t, 2)}</span> N/mm²</p>
                        <p className="text-[10px] text-slate-500">von f_cm,28 = {formatDeWert(f_cm_28)} MPa</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">Charakteristische Festigkeit f_ck(t):</p>
                        <p className="text-xs text-shiraz font-extrabold mt-1">{formatDeZahl(f_ck_t, 2)} N/mm²</p>
                        <p className="text-[10px] text-slate-500">von f_ck,28 = {formatDeWert(strengthClassFck)} MPa</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATUS AND EXCLUSION ASSESSMENT */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 text-xs">
                  <span className="text-xxs font-bold text-slate-400 block uppercase tracking-wide mb-1">Ausschaleignung (CEN-Richtwert)</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-3 h-3 rounded-full ${beta_cc >= 0.5 ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <p className="font-normal">
                      Der Beton hat <strong>{formatDeZahl((beta_cc * 100), 1)}%</strong> seiner 28-Tage-Nennfestigkeit erreicht. 
                      {beta_cc >= 0.5 ? (
                        <span className="text-green-800"> Ein Ausschalen tragender Bauteile ist nach DBV-Leitfaden im Regelfall zulässig (&gt; 50% Festigkeit).</span>
                      ) : (
                        <span className="text-amber-800"> Ein Ausschalen tragender Bauteile wird noch nicht empfohlen (erforderlich sind i.d.R. ≥ 50% der charakteristischen Nennfestigkeit).</span>
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
