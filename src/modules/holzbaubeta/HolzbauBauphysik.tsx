import { Flame, Volume2 } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { formatDeWert, formatDeTeXWert, formatDeZahl } from '@/src/utils/numberFormat';
import type { Dispatch, SetStateAction } from 'react';

interface HolzbauBauphysikProps {
  fireB: number;
  fireH: number;
  fireResults: { beta_0: number; d_char0: number; d_ef: number; b_fi: number; h_fi: number; A_0: number; W_y0: number; A_fi: number; W_yfi: number; areaLossPercent: number; stiffnessLossPercent: number; isCollapsed: boolean; };
  fireSides: number;
  fireTime: number;
  fireType: string;
  setFireB: Dispatch<SetStateAction<number>>;
  setFireH: Dispatch<SetStateAction<number>>;
  setFireSides: Dispatch<SetStateAction<number>>;
  setFireTime: Dispatch<SetStateAction<number>>;
  setFireType: Dispatch<SetStateAction<string>>;
  setVibCltThick: Dispatch<SetStateAction<number>>;
  setVibExtraMass: Dispatch<SetStateAction<number>>;
  setVibSpan: Dispatch<SetStateAction<number>>;
  vibCltThick: number;
  vibExtraMass: number;
  vibResults: { cltSelfMass: number; totalMass: number; ei_L: number; inertia_L: number; freq_1: number; isCompliant: boolean; };
  vibSpan: number;
}

export default function HolzbauBauphysik({ fireB, fireH, fireResults, fireSides, fireTime, fireType, setFireB, setFireH, setFireSides, setFireTime, setFireType, setVibCltThick, setVibExtraMass, setVibSpan, vibCltThick, vibExtraMass, vibResults, vibSpan }: HolzbauBauphysikProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_physics">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Fire Protection Box */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
            <h3 className="font-extrabold text-text-main text-base flex items-center gap-2 border-b border-home-grau/20 pb-2">
              <Flame size={18} className="text-amber-800 animate-pulse" /> Tragfähiger Brandschutz durch Verkohlung des Holzes
            </h3>

            <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
              <p>
                Holz ist brennbar, brennt bei größeren Querschnitten aber mit annähernd konstanter Geschwindigkeit ab. Die entstehende Holzkohleschicht leitet Wärme schlecht und verzögert die Erwärmung des Restquerschnitts; unmittelbar hinter der Kohleschicht ist das Holz jedoch bereits erwärmt und geschwächt (berücksichtigt über d₀).
              </p>

              <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1">Standard-Abbrandraten nach DIN EN 1995-1-2:</h4>
                <ul className="list-disc list-inside space-y-1 text-[11px] font-mono text-amber-950">
                  <li>Nadelholz (Vollholz / BSH): <InlineMath math="\beta_0 = 0{,}65;\; \beta_n = 0{,}80 \,/\, 0{,}70 \text{ mm/min}" /></li>
                  <li>Laubholz (<InlineMath math="\rho_k \ge 450" />): <InlineMath math="\beta_0 = 0{,}50;\; \beta_n = 0{,}55 \text{ mm/min}" /></li>
                  <li>Im Rechner wird β_n (inkl. Eckausrundung) verwendet; Brettsperrholz eindimensional mit β₀.</li>
                </ul>
              </div>

              <div className="bg-off-white p-3 rounded-lg border border-home-grau/20">
                <span className="font-bold text-text-main block">Berechnung der ideellen Restquerschnitts-Tiefe d_ef:</span>
                <div className="my-1 text-center font-mono font-bold text-text-main">
                  <InlineMath math="d_{ef} = \beta_n \cdot t + k_0 \cdot d_0" />
                </div>
                <span className="text-[10px] text-text-main/50 font-normal leading-normal block">
                  (mit <InlineMath math="d_0 = 7 \text{ mm}" /> als Schicht ohne Festigkeit, <InlineMath math="k_0 = \min(1;\, t/20)" /> bei ungeschützten Flächen; t = Branddauer in min).
                </span>
              </div>
            </div>
          </div>

          {/* Acoustic Insulation Box */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
            <h3 className="font-extrabold text-text-main text-base flex items-center gap-2 border-b border-home-grau/20 pb-2">
              <Volume2 size={18} className="text-amber-800" /> Schallschutz, Entkopplung &amp; Schwingungen
            </h3>

            <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
              <p>
                Aufgrund des geringen Eigengewichtes im Vergleich zum Stahlbetonbau ist der Schutz vor Schallübertragung die größte planerische Herausforderung im mehrgeschossigen Holzbau. 
              </p>

              <div className="bg-blue-50/50 p-3.5 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-1">Konstruktive Maßnahmen zur Trittschallminderung:</h4>
                <p className="text-[11px] text-text-main/75 mt-1">
                  1. <strong>Masse-Zufuhr:</strong> Gebundene Splittschüttungen erhöhen die Masse der Decke; das mindert vor allem tieffrequenten Trittschall.
                </p>
                <p className="text-[11px] text-text-main/75 mt-1.5">
                  2. <strong>Akustische Entkopplung:</strong> Elastomerlager unter den Wandanschlüssen und Justierschwingen entkoppeln den Körperschall an Last-Umlagerungspunkten.
                </p>
              </div>

              <div className="bg-off-white p-3 rounded-lg border border-home-grau/20">
                <h4 className="font-black text-text-main text-xs mb-1">Gebrauchstauglichkeitsgrenzkriterium: Decken-Schwingung</h4>
                <p className="text-text-main/75 leading-normal text-xs">
                  Eurocode 5 (7.3.3) verlangt für Wohnungsdecken einen Schwingungsnachweis: Das Verfahren gilt für Decken mit <InlineMath math="f_{1} > 8 \text{ Hz}" /> und begrenzt u. a. die Durchbiegung unter einer Einzellast von 1 kN (Grenzwert nach NA). Decken mit <InlineMath math="f_1 \le 8 \text{ Hz}" /> erfordern eine gesonderte Untersuchung.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* NEW INTERACTIVE: BRANDSCHUTZ- UND ABBRANDRECHNER */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
          <div>
            <span className="text-xs uppercase font-black text-rose-700 tracking-wider">Brandschutz &amp; Resttragfähigkeit</span>
            <h3 className="font-extrabold text-text-main text-base mt-1 flex items-center gap-2">
              <Flame size={20} className="text-rose-600 animate-pulse" /> Holz-Abbrandrechner &amp; Restquerschnitts-Visualisierer
            </h3>
            <p className="text-xs text-text-main/70 leading-relaxed mt-1">
              Berechnen Sie den verbleibenden tragfähigen Holzquerschnitt im Brandfall nach Eurocode 5 (DIN EN 1995-1-2). Die poröse Kohleschicht (Pyrolysepfad) schützt das Kernholz vor Hitze, verringert aber den statisch wirksamen Querschnitt.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Params (span 5) */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4 bg-off-white p-4 rounded-xl border border-home-grau/20">
              <h4 className="font-bold text-xs uppercase tracking-wider text-text-main">Brandschutz-Parameter</h4>

              {/* Fire wood type */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main">Materialtyp &amp; Abbrandrate</label>
                <select aria-label="Materialtyp und Abbrandrate"
                  value={fireType}
                  onChange={(e) => setFireType(e.target.value)}
                  className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                >
                  <option value="nadel">Nadel-Vollholz / KVH (β_n = 0,80 mm/min)</option>
                  <option value="bsh">Nadelholz-BSH (β_n = 0,70 mm/min)</option>
                  <option value="laub">Laubholz, ρ_k ≥ 450 kg/m³ (β_n = 0,55 mm/min)</option>
                  <option value="clt">Brettsperrholz (β₀ = 0,65 mm/min, Lehrannahme ohne Lagenabfall)</option>
                </select>
              </div>

              {/* Exposure time & sides */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Brandbeanspruchung (min)</label>
                  <select aria-label="Brandbeanspruchung (min)"
                    value={fireTime}
                    onChange={(e) => setFireTime(parseInt(e.target.value) || 30)}
                    className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                  >
                    <option value={30}>t = 30 Min (REI 30)</option>
                    <option value={60}>t = 60 Min (REI 60)</option>
                    <option value={90}>t = 90 Min (REI 90)</option>
                    <option value={120}>t = 120 Min (REI 120)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-main">Brandseiten</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFireSides(3)}
                      type="button"
                      className={`flex-1 text-xs py-1.5 rounded-lg border font-bold transition-all ${
                          fireSides === 3
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-white text-text-main/50 border-home-grau/25'
                        }`}
                    >
                      3-seitig
                    </button>
                    <button
                      onClick={() => setFireSides(4)}
                      type="button"
                      className={`flex-1 text-xs py-1.5 rounded-lg border font-bold transition-all ${
                          fireSides === 4
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-white text-text-main/50 border-home-grau/25'
                        }`}
                    >
                      4-seitig
                    </button>
                  </div>
                </div>
              </div>

              {/* Beam Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Balkenbreite b (mm)</label>
                  <input aria-label="Balkenbreite b (mm)"
                    type="number" min="0"
                    value={fireB}
                    onChange={(e) => setFireB(Math.max(60, parseInt(e.target.value) || 60))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Balkenhöhe h (mm)</label>
                  <input aria-label="Balkenhöhe h (mm)"
                    type="number" min="0"
                    value={fireH}
                    onChange={(e) => setFireH(Math.max(60, parseInt(e.target.value) || 60))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Outputs and 2D Restquerschnitt Illustration (span 7) */}
            <div className="lg:col-span-12 xl:col-span-7 bg-rose-50/10 border border-rose-200/40 p-5 rounded-xl flex flex-col justify-between gap-5">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider block mb-1">Brandnachweis</span>
                <p className="text-xs text-text-main/80 font-medium">
                  Nach <span className="font-bold">{formatDeWert(fireTime)} min</span> Brandeinwirkung mit <InlineMath math={`\\beta = ${formatDeTeXWert(fireResults.beta_0)}\\text{ mm/min}`} />:
                </p>

                <div className="grid grid-cols-2 gap-4 mt-2.5">
                  <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                    <span className="text-[9px] text-text-main/40 font-bold block uppercase">Verkohlte Schichttiefe d_ef</span>
                    <span className="font-mono text-base font-black text-rose-700">
                      {formatDeZahl(fireResults.d_ef, 1)} mm
                    </span>
                    <span className="text-[9px] text-text-main/50 block leading-tight mt-0.5">
                      ({formatDeZahl(fireResults.d_char0, 1)} mm Kohle + k₀ · 7 mm Zerrüttungsschicht, k₀ = min(1; t/20))
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                    <span className="text-[9px] text-text-main/40 font-bold block uppercase">Statischer Restquerschnitt</span>
                    {fireResults.isCollapsed ? (
                      <span className="font-mono text-sm font-black text-rose-600">KOMPLETT ZERSTÖRT</span>
                    ) : (
                      <span className="font-mono text-base font-black text-emerald-800">
                        {formatDeZahl(fireResults.b_fi, 0)} x {formatDeZahl(fireResults.h_fi, 0)} mm
                      </span>
                    )}
                    <span className="text-[9px] text-text-main/50 block leading-tight mt-0.5">
                      (Wirksam für Kaltbemessung nach EC5)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="text-xs bg-white p-2.5 rounded border border-home-grau/10 text-center">
                    <span className="text-text-main/50 font-semibold block text-[10px]">VERLUST QUERSCHNITTSFLÄCHE</span>
                    <span className="font-mono font-black text-rose-700 text-sm">{formatDeZahl(fireResults.areaLossPercent, 1)}%</span>
                  </div>
                  <div className="text-xs bg-white p-2.5 rounded border border-home-grau/10 text-center">
                    <span className="text-text-main/50 font-semibold block text-[10px]">VERLUST WIDERSTANDSMOMENT W</span>
                    <span className="font-mono font-black text-rose-700 text-sm">{formatDeZahl(fireResults.stiffnessLossPercent, 1)}%</span>
                  </div>
                </div>
              </div>

              {/* 2D Charred section representation */}
              <div className="border border-home-grau/25 bg-white p-4 rounded-xl flex flex-col items-center justify-center gap-2">
                <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider block">Querschnittsentwicklung (Grau: Vorher | Schwarz: Kohle | Orange: Tragfähig)</span>

                <div className="relative w-44 h-28 border border-dashed border-stone-200 bg-stone-50 rounded flex items-center justify-center overflow-hidden">
                  {/* Charcoal/Burn block */}
                  <div className="absolute w-[90px] h-[65px] bg-stone-900/90 flex items-center justify-center rounded">
                    {/* Safe Inner timber */}
                    {!fireResults.isCollapsed ? (
                      <div 
                        className="bg-amber-600/90 border border-amber-300 flex items-center justify-center rounded text-[8px] text-white font-mono font-black text-center"
                        style={{
                          width: `${Math.max(5, 90 * (fireResults.b_fi / fireB))}px`,
                          height: `${Math.max(5, 65 * (fireResults.h_fi / fireH))}px`
                        }}
                      >
                        REST
                      </div>
                    ) : (
                      <span className="text-white text-[8px] font-black">X COLLAPSED</span>
                    )}
                  </div>
                </div>

                <p className="text-[10px] text-text-main/70 text-center leading-normal italic mt-1 max-w-sm">
                  {fireResults.stiffnessLossPercent < 50 ? (
                    <span className="text-emerald-800 font-bold">&bull; Restquerschnitt deutlich vorhanden – Nachweis mit k_mod,fi = 1,0 und γ_M,fi = 1,0 führen.</span>
                  ) : fireResults.isCollapsed ? (
                    <span className="text-rose-700 font-bold">&bull; Kein Restquerschnitt – Querschnitt für diese Branddauer unzureichend.</span>
                  ) : (
                    <span className="text-amber-700 font-bold">&bull; Starke Querschnittsminderung – Querschnitt vergrößern oder Bekleidung (Kapselung) vorsehen.</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NEW INTERACTIVE: DECKEN-SCHWINGUNGSRECHNER (Vibration check) */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
          <div>
            <span className="text-xs uppercase font-black text-blue-700 tracking-wider">Akkustischer Komfort &amp; Tragsicherheit</span>
            <h3 className="font-extrabold text-text-main text-base mt-1 flex items-center gap-2">
              <Volume2 size={20} className="text-blue-600" /> CLT Decken-Schwingungs-Eigenfrequenzrechner
            </h3>
            <p className="text-xs text-text-main/70 leading-relaxed mt-1">
              Leichte Holzdecken können durch Gehen spürbar angeregt werden. Der Rechner ermittelt die erste Eigenfrequenz eines Einfeldstreifens und vergleicht sie mit der Anwendungsgrenze von <InlineMath math="f_{1} > 8 \text{ Hz}" /> nach EC5 7.3.3. Vereinfachung: Biegesteifigkeit aus voller Plattendicke mit E = 11 000 N/mm² (Querlagen nicht abgemindert – Lehrannahme, liegt auf der unsicheren Seite).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inputs (span 5) */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4 bg-off-white p-4 rounded-xl border border-home-grau/20">
              <h4 className="font-bold text-xs uppercase tracking-wider text-text-main">Decken-Parameter</h4>

              {/* Span L */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-text-main">Deckenspannweite L (m)</label>
                  <span className="font-mono text-xs font-black text-blue-700">{formatDeZahl(vibSpan, 2)} m</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="8.0"
                  step="0.1"
                  value={vibSpan}
                  onChange={(e) => setVibSpan(parseFloat(e.target.value))}
                  className="w-full accent-blue-700 cursor-pointer"
                />
              </div>

              {/* CLT Thickness */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main">Brettsperrholz-Plattenstärke t (mm)</label>
                <select aria-label="Brettsperrholz-Plattenstärke t (mm)"
                  value={vibCltThick}
                  onChange={(e) => setVibCltThick(parseInt(e.target.value) || 120)}
                  className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                >
                  <option value={100}>t = 100 mm (3-lagig CLT)</option>
                  <option value={120}>t = 120 mm (5-lagig CLT standard)</option>
                  <option value={140}>t = 140 mm (5-lagig CLT)</option>
                  <option value={160}>t = 160 mm (5-lagig tragfähig)</option>
                  <option value={200}>t = 200 mm (7-lagig weitgespannt)</option>
                </select>
              </div>

              {/* Extra Mass */}
              <div className="flex flex-col gap-1 border-t border-home-grau/10 pt-2.5">
                <label className="text-xs font-bold text-text-main">Zusatzmasse (Estrich + Dämmung + Schüttung) (kg/m²)</label>
                <input aria-label="Zusatzmasse (Estrich + Dämmung + Schüttung) (kg/m²)"
                  type="number"
                  min="10"
                  max="300"
                  value={vibExtraMass}
                  onChange={(e) => setVibExtraMass(Math.max(10, parseInt(e.target.value) || 10))}
                  className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-bold"
                />
                <p className="text-[10px] text-stone-500 leading-snug">
                  *Tipp: Eine schwere Zementschüttung verbessert den Trittschall, reduziert jedoch die Schwingungs-Eigenfrequenz.
                </p>
              </div>
            </div>

            {/* Outputs (span 7) */}
            <div className="lg:col-span-12 xl:col-span-7 bg-blue-50/20 border border-blue-200/50 p-5 rounded-xl flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block mb-1">Dynamische Eigenfrequenzermittlung</span>
                <h4 className="font-extrabold text-sm text-text-main">Gebrauchstauglichkeitsnachweis EC5</h4>
              </div>

              <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-3 shadow-xs text-xs">
                {/* Mass */}
                <div className="flex justify-between items-center text-text-main/80">
                  <span>Auswertbare Decken-Eigenmasse g_0:</span>
                  <span className="font-mono font-bold text-text-main">{formatDeZahl(vibResults.cltSelfMass, 1)} kg/m²</span>
                </div>
                <div className="flex justify-between items-center text-text-main/80 border-b border-home-grau/10 pb-2">
                  <span>Gesamtmasse m_tot (inkl. Estrich):</span>
                  <span className="font-mono font-bold text-text-main">{formatDeZahl(vibResults.totalMass, 1)} kg/m²</span>
                </div>

                {/* Stiffness */}
                <div className="space-y-1 pt-1 text-[11px] leading-relaxed">
                  <span className="font-bold text-text-main block">Biegesteifigkeit <InlineMath math="EI_L" /> (pro m Plattenbreite):</span>
                  <div className="bg-stone-50 p-1.5 rounded text-center border font-mono">
                    <InlineMath math={`EI_{L} = \\frac{11000 \\times 10^6 \\times 1{,}0 \\times ${formatDeTeXWert(vibCltThick / 1000)}^3}{12} = ${formatDeZahl(vibResults.ei_L / 1000, 0)}\\text{ kNm}^2/\\text{m}`} />
                  </div>
                </div>

                {/* Formula */}
                <div className="space-y-1 pt-1 text-[11px] leading-relaxed">
                  <span className="font-bold text-text-main block">Grundfrequenz <InlineMath math="f_{1}" /> einer einfeldgelagerten BSP-Platte:</span>
                  <div className="bg-stone-50 p-1.5 rounded text-center border font-mono text-blue-900 font-bold text-xs">
                    <InlineMath math={`f_1 = \\frac{\\pi}{2 \\times L^2} \\times \\sqrt{\\frac{EI_{L}}{m}} = ${formatDeZahl(vibResults.freq_1, 2)}\\text{ Hz}`} />
                  </div>
                </div>
              </div>

              {/* Status bar & gauge */}
              <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs text-center flex flex-col gap-1.5">
                <span className="text-[10px] text-text-main/50 font-black uppercase tracking-wider block">Schwingungsnachweis (Kriterium &gt;= 8,0 Hz)</span>
                <div className="flex items-center justify-center gap-3">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full ${
                      vibResults.isCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                    {vibResults.isCompliant ? 'ERFÜLLT (Keine Komfortstörung)' : 'STÖRENDE RESONANZ (f1 < 8 Hz)'}
                  </span>
                  <span className="font-mono text-base font-black text-text-main">{formatDeZahl(vibResults.freq_1, 2)} Hz</span>
                </div>

                {/* Indicator Warning */}
                {!vibResults.isCompliant && (
                  <p className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-lg leading-relaxed mt-1">
                    <strong>Schwingungsgefahr:</strong> Die Frequenz liegt bei 8 Hz oder darunter; spürbare Schwingungen sind wahrscheinlich und eine gesonderte Untersuchung ist nötig. Plattendicke <InlineMath math="t" /> erhöhen oder Spannweite <InlineMath math="L" /> verringern.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    );
}
