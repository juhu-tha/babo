import { Droplets, Activity, Calculator, Layers, Wrench, ShieldCheck, Package } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import type { Dispatch, SetStateAction } from 'react';
import inhalt from '@/content/spannbeton/kennwerte/KennwerteEinpressmoertel.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { LITZE } from '@/src/calc/spannbeton';
import { reglerName } from '@/src/lib/reglerName';

interface KennwerteEinpressmoertelProps {
  groutAdmixturePct: number;
  groutCalculations: { ductArea: number; strandArea: number; netVoidArea: number; netVoidVolumeLiter: number; cementPerLiter: number; waterPerLiter: number; totalCementKg: number; totalWaterLiter: number; totalAdmixtureKg: number; cementBags25: number; flowTimeT0: number; flowTimeT30: number; flowValid: boolean; bleeding3h: number; bleedingValid: boolean; expansion24h: number; expansionValid: boolean; fc7d: number; fc28d: number; strengthValid: boolean; };
  groutCementType: string;
  groutDuctDia: number;
  groutStrandCount: number;
  groutTendonLength: number;
  groutWz: number;
  setGroutAdmixturePct: Dispatch<SetStateAction<number>>;
  setGroutCementType: Dispatch<SetStateAction<string>>;
  setGroutDuctDia: Dispatch<SetStateAction<number>>;
  setGroutStrandCount: Dispatch<SetStateAction<number>>;
  setGroutTendonLength: Dispatch<SetStateAction<number>>;
  setGroutWz: Dispatch<SetStateAction<number>>;
}

export default function KennwerteEinpressmoertel({ groutAdmixturePct, groutCalculations, groutCementType, groutDuctDia, groutStrandCount, groutTendonLength, groutWz, setGroutAdmixturePct, setGroutCementType, setGroutDuctDia, setGroutStrandCount, setGroutTendonLength, setGroutWz }: KennwerteEinpressmoertelProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/15 pb-4">
            <div>
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Droplets className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.einpressmörtelSystembaustoffeImSpannbeto} /></h4>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.zementeinpressmörtelNachDinEn} /></p>
            </div>
            <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap"><MdText text={inhalt.texte.dinEn447Fib} /></span>
          </div>

          {/* Didaktische Einleitung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
            <div>
              <strong className="text-text-main block mb-1"><MdText text={inhalt.texte.die4SchutzUnd} /></strong>
              <p>
                Im nachträglichen Verbund und bei unverbundenen Spanngliedern ist der hochfeste Spannstahl extrem 
                korrosionsgefährdet (Gefahr von <strong><MdText text={inhalt.texte.spannungsrisskorrosionWasserstoffversprö} /></strong>). 
                Die Systembaustoffe bilden eine mehrstufige Barriere: 
                <strong><MdText text={inhalt.texte.t1Einpressmörtel} /></strong> (chemische Passivierung mit <InlineMath math="\text{pH} \ge 12{,}5" />), 
                <strong> 2. Hüllrohr</strong> (mechanischer Schutz gegen Feuchte und Chloride), 
                <strong><MdText text={inhalt.texte.t3KorrosionsschutzfettWachs} /></strong> (bei Monolitzen) und 
                <strong><MdText text={inhalt.texte.t4Keilverankerungen} /></strong> aus einsatzgehärtetem Qualitätsstahl.
              </p>
            </div>
            <div>
              <strong className="text-text-main block mb-1"><MdText text={inhalt.texte.warumIstEinpressmörtelKein} /></strong>
              <p>
                Einpressmörtel muss über Entfernungen von bis zu 100 m durch enge Litzenzwischenräume gepresst werden. 
                Er erfordert <strong><MdText text={inhalt.texte.extremHoheFließfähigkeit} /></strong> bei gleichzeitig 
                <strong><MdText text={inhalt.texte.minimalemWassergehaltWZ} /></strong>, 
                darf <strong><MdText text={inhalt.texte.keinFreiesWasserAbsondern} /></strong> und muss durch 
                spezielle Quellmittel das plastische Schwinden vollständig kompensieren.
              </p>
            </div>
          </div>

          {/* 1. INTERAKTIVES MÖRTEL-LABOR: REZEPTUR & GÜTE NACH DIN EN 447 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-shiraz" /><MdText text={inhalt.texte.mörtelLaborGütesimulationNach} /></span>
              <span className="text-[11px] font-mono text-slate-500"><MdText text={inhalt.texte.prüfungBei20C} /></span>
            </div>

            {/* Steuerregler: w/z-Wert, Zusatzmittel, Zement */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* w/z-Wert */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.wasserzementwertWZ} /></span>
                  <span className={`font-mono font-bold ${
                      groutWz <= 0.40 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                    {formatDeZahl(groutWz, 2)} {groutWz > 0.40 ? '(Normüberschreitung!)' : '(zulässig)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="0.45"
                  step="0.01"
                  value={groutWz}
                  aria-label={reglerName(inhalt.texte.wasserzementwertWZ)}
                  aria-valuetext={`${formatDeZahl(groutWz, 2)} ${groutWz > 0.40 ? '(Normüberschreitung!)' : '(zulässig)'}`}
                  onChange={(e) => setGroutWz(Number(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span><MdText text={inhalt.texte.t030SehrZäh} /></span>
                  <span className="text-emerald-700 font-bold"><MdText text={inhalt.texte.t036Optimum} /></span>
                  <span className="text-rose-600 font-bold"><MdText text={inhalt.texte.t044GrenzeDin} /></span>
                  <span><MdText text={inhalt.texte.t045Bluten} /></span>
                </div>
              </div>

              {/* Einpresshilfe / Zusatzmittel */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.einpresshilfeDinEn934} /></span>
                  <span className="font-mono text-shiraz font-bold">{formatDeZahl(groutAdmixturePct, 1)} % v. Zement</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={groutAdmixturePct}
                  aria-label={reglerName(inhalt.texte.einpresshilfeDinEn934)}
                  aria-valuetext={`${formatDeZahl(groutAdmixturePct, 1)} % v. Zement`}
                  onChange={(e) => setGroutAdmixturePct(Number(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span><MdText text={inhalt.texte.t02Gering} /></span>
                  <span className="text-shiraz font-bold"><MdText text={inhalt.texte.t10Standard} /></span>
                  <span><MdText text={inhalt.texte.t20StarkQuellend} /></span>
                </div>
              </div>

              {/* Zementart */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-main block"><MdText text={inhalt.texte.bindemittelDinEn197} /></label>
                <select aria-label={inhalt.werte.bindemittelDinEn197}
                  value={groutCementType}
                  onChange={(e) => setGroutCementType(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium outline-none focus:border-shiraz"
                >
                  <option value="CEM I 52.5 R (C3A-arm)">CEM I 52.5 R (C3A-arm, hochfest)</option>
                  <option value="CEM I 42.5 N (Standard)">CEM I 42.5 N (Standard-Portlandzement)</option>
                  <option value="Werktrockenmörtel (Zugelassen)">Werkstrockenmörtel (werksgemischt nach EAD)</option>
                </select>
                <p className="text-[10px] text-slate-500"><MdText text={inhalt.texte.chloridgehaltStrikt010} /></p>
              </div>
            </div>

            {/* 4 Soll-Ist KPI Karten nach DIN EN 447 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* 1. Fließmaß / Trichter */}
              <div className={`p-3 rounded-xl border space-y-1 ${
                  groutCalculations.flowValid ? 'bg-white border-home-grau/30' : 'bg-rose-50 border-rose-200'
                }`}>
                <div className="flex items-center justify-between text-xs text-text-main/70">
                  <span className="font-semibold uppercase tracking-wider"><MdText text={inhalt.texte.fließvermögenTrichterverfahrenDinEn} /></span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      groutCalculations.flowValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                    {groutCalculations.flowValid ? 'Normkonform' : 'Abweichung!'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-slate-900">{formatDeWert(groutCalculations.flowTimeT0)}</span>
                  <span className="text-xs text-slate-500">s (t₀)</span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5 border-t border-slate-200 pt-1.5">
                  <div className="flex justify-between">
                    <span><MdText text={inhalt.texte.normbereichT} /></span>
                    <strong className="font-mono"><MdText text={inhalt.texte.tT25S} /></strong>
                  </div>
                  <div className="flex justify-between">
                    <span><MdText text={inhalt.texte.nach30MinT} /></span>
                    <strong className="font-mono">{formatDeWert(groutCalculations.flowTimeT30)}<MdText text={inhalt.texte.sMax28S} /></strong>
                  </div>
                </div>
              </div>

              {/* 2. Wasserabsondern (Bluten) */}
              <div className={`p-3 rounded-xl border space-y-1 ${
                  groutCalculations.bleedingValid ? 'bg-white border-home-grau/30' : 'bg-rose-50 border-rose-200'
                }`}>
                <div className="flex items-center justify-between text-xs text-text-main/70">
                  <span className="font-semibold uppercase tracking-wider"><MdText text={inhalt.texte.wasserabsondern3H} /></span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      groutCalculations.bleedingValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                    {groutCalculations.bleedingValid ? 'Normkonform' : inhalt.werte.gefahrBluten}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold font-mono ${
                      groutCalculations.bleedingValid ? 'text-slate-900' : 'text-rose-700'
                    }`}>
                    {formatDeWert(groutCalculations.bleeding3h)}
                  </span>
                  <span className="text-xs text-slate-500">% Vol.</span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5 border-t border-slate-200 pt-1.5">
                  <div className="flex justify-between">
                    <span><MdText text={inhalt.texte.grenzwertDinEn447} /></span>
                    <strong className="font-mono">≤ 0,30 %</strong>
                  </div>
                  <div className="flex justify-between">
                    <span><MdText text={inhalt.texte.wiederaufnahme24H} /></span>
                    <strong className="font-mono text-emerald-700"><MdText text={inhalt.texte.t100Vollständig} /></strong>
                  </div>
                </div>
              </div>

              {/* 3. Volumenänderung (Quellen) */}
              <div className={`p-3 rounded-xl border space-y-1 ${
                  groutCalculations.expansionValid ? 'bg-white border-home-grau/30' : 'bg-amber-50 border-amber-200'
                }`}>
                <div className="flex items-center justify-between text-xs text-text-main/70">
                  <span className="font-semibold uppercase tracking-wider"><MdText text={inhalt.texte.volumenänderung24H} /></span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      groutCalculations.expansionValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                    {groutCalculations.expansionValid ? 'Kompensiert' : 'Schwindgefahr'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {groutCalculations.expansion24h > 0 ? `+${formatDeWert(groutCalculations.expansion24h)}` : groutCalculations.expansion24h}
                  </span>
                  <span className="text-xs text-slate-500">%</span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5 border-t border-slate-200 pt-1.5">
                  <div className="flex justify-between">
                    <span>Normbereich:</span>
                    <strong className="font-mono"><MdText text={inhalt.texte.t1Bis5} /></strong>
                  </div>
                  <div className="flex justify-between">
                    <span><MdText text={inhalt.texte.wirkungQuellmittel} /></span>
                    <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.keineSchwindsäcke} /></span>
                  </div>
                </div>
              </div>

              {/* 4. Druckfestigkeit & Passivierung */}
              <div className="p-3 rounded-xl bg-white border border-home-grau/30 space-y-1">
                <div className="flex items-center justify-between text-xs text-text-main/70">
                  <span className="font-semibold uppercase tracking-wider"><MdText text={inhalt.texte.druckfestigkeitPh} /></span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                    Hochfest
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-shiraz">{formatDeWert(groutCalculations.fc28d)}</span>
                  <span className="text-xs text-slate-500">MPa (28 d)</span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5 border-t border-slate-200 pt-1.5">
                  <div className="flex justify-between">
                    <span><MdText text={inhalt.texte.nach7TagenFc} /></span>
                    <strong className="font-mono">{formatDeWert(groutCalculations.fc7d)} MPa (≥ 27)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span><MdText text={inhalt.texte.alkalischePassivierung} /></span>
                    <strong className="font-mono text-emerald-700"><MdText text={inhalt.texte.ph12812} /></strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. INTERAKTIVER VERPRESSRECHNER FÜR SPANNGLIEDER */}
          <div className="p-5 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/15 pb-2">
              <div>
                <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <Calculator className="text-shiraz h-4 w-4" /><MdText text={inhalt.texte.injektionsMaterialmengenRechnerFür} /></h5>
                <p className="text-[11px] text-text-main/70"><MdText text={inhalt.texte.berechnungVonNettoHohlraumvolumen} /></p>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Länge: {formatDeWert(groutTendonLength)} m | {groutStrandCount}<MdText text={inhalt.texte.litzen150Mm} /></span>
            </div>

            {/* Steuerregler: Spanngliedlänge, Litzenanzahl, Hüllrohr-Durchmesser */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.spanngliedlängeL} /></span>
                  <span className="font-mono text-shiraz font-bold">{formatDeWert(groutTendonLength)} m</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={groutTendonLength}
                  aria-label={reglerName(inhalt.texte.spanngliedlängeL)}
                  aria-valuetext={`${formatDeWert(groutTendonLength)} m`}
                  onChange={(e) => setGroutTendonLength(Number(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10 m</span>
                  <span><MdText text={inhalt.texte.t45MStandard} /></span>
                  <span><MdText text={inhalt.texte.t120MGroßbrücke} /></span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.litzenbelegungAp} />{formatDeWert(groutStrandCount * LITZE.Ap)} mm²):</span>
                  <span className="font-mono text-shiraz font-bold">{groutStrandCount} Litzen</span>
                </div>
                <select
                  value={groutStrandCount}
                  onChange={(e) => setGroutStrandCount(Number(e.target.value))}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium outline-none focus:border-shiraz"
                >
                  <option value={4}>4 Litzen (Hochbau / Unterzüge)</option>
                  <option value={7}>7 Litzen (Hallenbinder / Brücken)</option>
                  <option value={12}>12 Litzen (Standard ZTV-ING Brückenbau)</option>
                  <option value={19}>19 Litzen (Schwere Brückenhauptträger)</option>
                  <option value={22}>22 Litzen (Große Hohlkastenbrücken)</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.hüllrohrInnendurchmesserDi} /></span>
                  <span className="font-mono text-shiraz font-bold">{formatDeWert(groutDuctDia)} mm</span>
                </div>
                <select
                  value={groutDuctDia}
                  onChange={(e) => setGroutDuctDia(Number(e.target.value))}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium outline-none focus:border-shiraz"
                >
                  <option value={65}>Ø 65 mm (für 4–7 Litzen)</option>
                  <option value={75}>Ø 75 mm (für 7–12 Litzen)</option>
                  <option value={85}>Ø 85 mm (für 12–15 Litzen, ZTV-ING)</option>
                  <option value={100}>Ø 100 mm (für 19–22 Litzen)</option>
                  <option value={115}>Ø 115 mm (für 27–31 Litzen)</option>
                </select>
              </div>
            </div>

            {/* Ergebnis-Raster Materialbedarf */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200 text-center">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Netto-Mörtelvolumen</span>
                <span className="text-xl font-bold font-mono text-slate-800">{formatDeWert(groutCalculations.netVoidVolumeLiter)} Liter</span>
                <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.freierHohlquerschnittZzgl10} /></span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Zementbedarf</span>
                <span className="text-xl font-bold font-mono text-shiraz">{formatDeWert(groutCalculations.totalCementKg)} kg</span>
                <span className="text-[10px] text-slate-500">ca. {formatDeWert(groutCalculations.cementBags25)}<MdText text={inhalt.texte.säcke25Kg} /></span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block"><MdText text={inhalt.texte.wasserbedarfWZ} />{formatDeWert(groutWz)})</span>
                <span className="text-xl font-bold font-mono text-blue-700">{formatDeWert(groutCalculations.totalWaterLiter)} Liter</span>
                <span className="text-[10px] text-slate-500">Trinkwasserqualität</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block"><MdText text={inhalt.texte.einpresshilfe} />{formatDeWert(groutAdmixturePct)} %)</span>
                <span className="text-xl font-bold font-mono text-purple-700">{formatDeWert(groutCalculations.totalAdmixtureKg)} kg</span>
                <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.quellFließmittel} /></span>
              </div>
            </div>

            {/* Technische Einpress-Richtwerte */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-amber-950">
              <div>
                <strong>Einpressgeschwindigkeit:</strong>
                <p className="text-[11px] text-amber-900 mt-0.5"><MdText text={inhalt.texte.t515MMin} /></p>
              </div>
              <div><MdText text={inhalt.texte.maximalerEinpressdruck} /><p className="text-[11px] text-amber-900 mt-0.5"><MdText text={inhalt.texte.p1015Bar} /></p>
              </div>
              <div>
                <strong>Entlüftungsstellen:</strong>
                <p className="text-[11px] text-amber-900 mt-0.5"><MdText text={inhalt.texte.anAllenScheitelpunktenHochpunkten} /></p>
              </div>
            </div>
          </div>

          {/* 3. HÜLLROHRSYSTEME IM DIREKTVERGLEICH: STAHL VS. KUNSTSTOFF */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
              <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Layers className="text-shiraz h-4 w-4" /><MdText text={inhalt.texte.hüllrohrSystemvergleichStahlwellblechDin} /></h5>
              <span className="text-[11px] text-slate-500"><MdText text={inhalt.texte.fibCategoryPl1Pl2} /></span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-text-main border-b border-home-grau/30 font-semibold">
                    <th className="p-2.5">Eigenschaft</th>
                    <th className="p-2.5"><MdText text={inhalt.texte.stahlwellrohrDinEn523} /></th>
                    <th className="p-2.5 text-shiraz"><MdText text={inhalt.texte.kunststoffWellrohrHdpePp} /></th>
                    <th className="p-2.5"><MdText text={inhalt.texte.praxisAuswirkungImSpannbeton} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr className="hover:bg-off-white">
                    <td className="p-2.5 font-bold"><MdText text={inhalt.texte.werkstoffWanddicke} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.gefalztesVerzinktesBandstahlT} /></td>
                    <td className="p-2.5 font-semibold text-shiraz"><MdText text={inhalt.texte.extrudiertesHighDensityPolyethylen} /></td>
                    <td className="p-2.5 text-[11px]"><MdText text={inhalt.texte.kunststoffrohreSindExtremSchlagzäh} /></td>
                  </tr>
                  <tr className="hover:bg-off-white">
                    <td className="p-2.5 font-bold"><MdText text={inhalt.texte.reibungsbeiwert} /></td>
                    <td className="p-2.5 font-mono">0,18 – 0,22</td>
                    <td className="p-2.5 font-mono font-bold text-shiraz">0,12 – 0,14 (-35 %)</td>
                    <td className="p-2.5 text-[11px]"><MdText text={inhalt.texte.erheblichGeringereReibungsverlusteP} /></td>
                  </tr>
                  <tr className="hover:bg-off-white">
                    <td className="p-2.5 font-bold"><MdText text={inhalt.texte.ungewollteKrümmungWobbleK} /></td>
                    <td className="p-2.5 font-mono"><MdText text={inhalt.texte.t00050010} /></td>
                    <td className="p-2.5 font-mono text-shiraz"><MdText text={inhalt.texte.t00040007} /></td>
                    <td className="p-2.5 text-[11px]"><MdText text={inhalt.texte.steifereGeometrieVerringertWellenbildung} /></td>
                  </tr>
                  <tr className="hover:bg-off-white">
                    <td className="p-2.5 font-bold">Korrosionsschutzbarriere</td>
                    <td className="p-2.5"><MdText text={inhalt.texte.verzinkungOpfertSichRost} /></td>
                    <td className="p-2.5 font-semibold text-emerald-700"><MdText text={inhalt.texte.sehrDichtGegenChloride} /></td>
                    <td className="p-2.5 text-[11px]"><MdText text={inhalt.texte.vollständigeKapselungDesSpannstahls} /></td>
                  </tr>
                  <tr className="hover:bg-off-white">
                    <td className="p-2.5 font-bold"><MdText text={inhalt.texte.elektrischeIsolierungEit} /></td>
                    <td className="p-2.5 text-slate-500"><MdText text={inhalt.texte.nichtMöglichLeitfähigMit} /></td>
                    <td className="p-2.5 font-semibold text-emerald-700"><MdText text={inhalt.texte.jaElectricallyIsolatedTendon} /></td>
                    <td className="p-2.5 text-[11px]"><MdText text={inhalt.texte.ermöglichtZerstörungsfreieDichtigkeitsKo} /></td>
                  </tr>
                  <tr className="hover:bg-off-white">
                    <td className="p-2.5 font-bold"><MdText text={inhalt.texte.verschleißBeiUmlenkung} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.gefahrDesDurchscheuernsBei} /></td>
                    <td className="p-2.5 font-semibold text-shiraz"><MdText text={inhalt.texte.sehrHoheErmüdungsUnd} /></td>
                    <td className="p-2.5 text-[11px]"><MdText text={inhalt.texte.keinMetallischerReibkontaktSpanndraht} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. VERANKERUNGSMATERIALIEN, KORROSIONSSCHUTZFETTE & SCHUTZELEMENTE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Keile & Keilmechanik */}
            <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.t1SpannkeileAnkerkörper} /></h5>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieVerankerungHochfesterLitzen} /></p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                <li><MdText text={inhalt.texte.einsatzgehärteterSonderstahlZB} /></li>
                <li><MdText text={inhalt.texte.mehrteiligeKeile2Teilig} /></li>
                <li><MdText text={inhalt.texte.ankerplattenSphärogussEnGjs} /></li>
              </ul>
            </div>

            {/* Box 2: Korrosionsschutzfette für Monolitzen */}
            <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.t2KorrosionsschutzfetteMonolitzen} /></h5>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.beiDerVorspannungOhne} /></p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                <li><MdText text={inhalt.texte.spezialfettSchutzwachsVerseifungsfreieKo} /></li>
                <li><MdText text={inhalt.texte.temperaturbeständigkeitTropfpunktGe85} /></li>
                <li><MdText text={inhalt.texte.peSchutzmantelNahtlosExtrudiertes} /></li>
                <li><MdText text={inhalt.texte.reibungsbeiwertExtremGeringMu} /></li>
              </ul>
            </div>

            {/* Box 3: Dichtungskappen & Entlüfter */}
            <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <Package className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.t3DichtungskappenPrüfstutzen} /></h5>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dauerhafterSchutzDerVerankerungs} /></p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                <li><MdText text={inhalt.texte.permanenteAnkerkappenDruckfesteSchutzkap} /></li>
                <li><MdText text={inhalt.texte.entlüftungsstutzenTransparentePeSchläuch} /></li>
                <li><MdText text={inhalt.texte.verschlussNachDemAbbinden} /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
}
